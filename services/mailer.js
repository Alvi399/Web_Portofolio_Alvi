const nodemailer = require('nodemailer');

const escapeHtml = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Email is enabled only when all required SMTP env vars are present. */
function isConfigured() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, NOTIFY_TO } = process.env;
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && NOTIFY_TO);
}

let transporter = null;
function getTransporter() {
  if (!transporter) {
    const port = parseInt(process.env.SMTP_PORT, 10) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
}

/**
 * Notify the site owner about a new contact message.
 * Never throws: failures are logged only, so visitors are unaffected.
 * @param {object} contact - saved Contact record
 * @param {string} [siteUrl] - absolute base URL used to build the admin link
 */
async function sendContactNotification(contact, siteUrl = '') {
  if (!isConfigured()) return false;
  try {
    const adminLink = `${siteUrl}/admin/contacts/${contact.id}`;
    const subject = contact.subject ? contact.subject : '(tanpa subjek)';
    await getTransporter().sendMail({
      from: process.env.NOTIFY_FROM || process.env.SMTP_USER,
      to: process.env.NOTIFY_TO,
      replyTo: `"${String(contact.name).replace(/["\r\n]/g, '')}" <${String(contact.email).replace(/[\r\n]/g, '')}>`,
      subject: `[Portofolio] Pesan baru: ${String(subject).replace(/[\r\n]/g, ' ').slice(0, 150)}`,
      text: `Dari: ${contact.name} <${contact.email}>\nSubjek: ${subject}\n\n${contact.message}\n\nBuka di admin: ${adminLink}`,
      html: `<p><strong>Dari:</strong> ${escapeHtml(contact.name)} &lt;${escapeHtml(contact.email)}&gt;</p>
<p><strong>Subjek:</strong> ${escapeHtml(subject)}</p>
<p style="white-space:pre-wrap">${escapeHtml(contact.message)}</p>
<p><a href="${escapeHtml(adminLink)}">Buka di admin panel</a></p>`
    });
    return true;
  } catch (err) {
    console.error('Contact notification email failed:', err.message);
    return false;
  }
}

module.exports = { sendContactNotification, isConfigured };
