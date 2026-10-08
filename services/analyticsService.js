const crypto = require('crypto');
const { Event } = require('../models');

/**
 * Log an analytics event with privacy-focused IP hashing (T-40)
 */
async function trackEvent(eventType, targetId = null, req = null) {
  try {
    let ipHash = null;
    let userAgent = null;

    if (req) {
      const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const dateSalt = new Date().toISOString().slice(0, 10); // rotates daily for privacy
      ipHash = crypto.createHash('sha256').update(clientIp + dateSalt).digest('hex').substring(0, 32);
      userAgent = (req.headers['user-agent'] || '').substring(0, 255);
    }

    await Event.create({
      event_type: eventType,
      target_id: targetId ? String(targetId).substring(0, 100) : null,
      ip_hash: ipHash,
      user_agent: userAgent
    });
  } catch (err) {
    console.error('[Analytics] Failed to track event:', err.message);
  }
}

/**
 * Get 30-day analytics summary for admin dashboard (T-40, T-44)
 */
async function getAnalyticsSummary() {
  try {
    const { Op } = require('sequelize');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const events = await Event.findAll({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    const summary = {
      cvDownloads: 0,
      projectViews: 0,
      contactClicks: 0,
      whatsappClicks: 0,
      totalEvents: events.length
    };

    events.forEach(ev => {
      if (ev.event_type === 'cv_download') summary.cvDownloads++;
      else if (ev.event_type === 'project_view') summary.projectViews++;
      else if (ev.event_type === 'contact_click') summary.contactClicks++;
      else if (ev.event_type === 'whatsapp_click') summary.whatsappClicks++;
    });

    return summary;
  } catch (err) {
    console.error('[Analytics] Failed to fetch summary:', err.message);
    return { cvDownloads: 0, projectViews: 0, contactClicks: 0, whatsappClicks: 0, totalEvents: 0 };
  }
}

module.exports = {
  trackEvent,
  getAnalyticsSummary
};
