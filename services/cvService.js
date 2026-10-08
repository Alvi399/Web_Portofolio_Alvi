/**
 * CV (ATS) Service
 * Builds a single-column, plain-text-first CV straight from the portfolio
 * database (Profile, Skill, Project, Journey, Certificate) and scores how
 * ATS-ready the *content* is.
 *
 * Rules:
 *  - Never invents data. Missing fields are simply omitted and reported as tips.
 *  - The score is a transparent heuristic, not a score from a real ATS vendor.
 */
const { Profile, Skill, Project, Journey, Certificate } = require('../models');

const LABELS = {
  id: {
    summary: 'Ringkasan Profesional',
    skills: 'Keahlian Inti (Core Competencies)',
    projects: 'Proyek',
    experience: 'Pengalaman',
    education: 'Pendidikan',
    certifications: 'Sertifikasi',
    problem: 'Masalah',
    impact: 'Dampak',
    role: 'Peran',
    stack: 'Teknologi',
    repo: 'Repositori',
    demo: 'Demo',
    verify: 'Verifikasi',
    phone: 'Telepon'
  },
  en: {
    summary: 'Professional Summary',
    skills: 'Core Competencies',
    projects: 'Projects',
    experience: 'Experience',
    education: 'Education',
    certifications: 'Certifications',
    problem: 'Problem',
    impact: 'Impact',
    role: 'Role',
    stack: 'Tech Stack',
    repo: 'Repository',
    demo: 'Demo',
    verify: 'Verify',
    phone: 'Phone'
  }
};

// Action verbs that ATS/recruiters expect at the start of achievement bullets
const ACTION_VERBS = {
  en: ['built', 'developed', 'designed', 'created', 'implemented', 'led', 'delivered', 'automated',
    'optimized', 'reduced', 'increased', 'improved', 'launched', 'deployed', 'integrated', 'migrated',
    'analyzed', 'maintained', 'managed', 'engineered', 'architected', 'wrote', 'tested', 'refactored',
    'completed', 'established', 'collaborated', 'achieved', 'resolved', 'streamlined'],
  id: ['membangun', 'mengembangkan', 'merancang', 'membuat', 'menerapkan', 'memimpin', 'menghasilkan',
    'mengotomatisasi', 'mengoptimalkan', 'mengurangi', 'meningkatkan', 'meluncurkan', 'mengintegrasikan',
    'memigrasi', 'menganalisis', 'mengelola', 'menulis', 'menguji', 'menyelesaikan', 'menyusun',
    'memperbaiki', 'mengimplementasikan', 'menciptakan', 'mendesain', 'merilis']
};

const clean = (v) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
const words = (s) => clean(s).split(' ').filter(Boolean);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Pick the localized value of a field, falling back to the default language
function pick(obj, field, lang) {
  if (!obj) return '';
  if (lang === 'en' && obj[field + '_en']) return clean(obj[field + '_en']);
  return clean(obj[field]);
}

function formatDate(value, lang) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    month: 'short', year: 'numeric', timeZone: 'UTC'
  });
}

// Split a paragraph into sentence-level bullets (max n) so each stays scannable
function toBullets(text, max = 3) {
  const t = clean(text);
  if (!t) return [];
  const parts = t.split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/).map(clean).filter(Boolean);
  return (parts.length ? parts : [t]).slice(0, max);
}

async function collect(lang) {
  const [profile, skills, projects, journeys, certificates] = await Promise.all([
    Profile.findOne(),
    Skill.findAll({ order: [['category', 'ASC'], ['sort_order', 'ASC']] }),
    Project.findAll({ where: { status: 'published' }, order: [['is_featured', 'DESC'], ['sort_order', 'ASC']], limit: 6 }),
    Journey.findAll({ order: [['date', 'DESC']] }),
    Certificate.findAll({ order: [['date', 'DESC']] })
  ]);

  const p = profile || {};
  const L = LABELS[lang];

  const skillGroups = {};
  skills.forEach((s) => {
    const cat = clean(s.category) || 'General';
    (skillGroups[cat] = skillGroups[cat] || []).push(clean(s.name));
  });

  return {
    lang,
    labels: L,
    name: clean(p.full_name),
    headline: pick(p, 'headline', lang) || clean(p.tagline),
    contact: {
      email: clean(p.email),
      phone: clean(p.phone) || (p.whatsapp ? '+' + clean(p.whatsapp).replace(/^\+/, '') : ''),
      location: clean(p.location),
      linkedin: clean(p.linkedin_url),
      github: clean(p.github_url)
    },
    summary: pick(p, 'about_summary', lang) || pick(p, 'bio', lang),
    skillGroups,
    projects: projects.map((pr) => ({
      title: clean(pr.title),
      role: pick(pr, 'role', lang),
      stack: Array.isArray(pr.technologies) ? pr.technologies.map(clean).filter(Boolean) : [],
      bullets: [
        ...(pick(pr, 'problem', lang) ? [`${L.problem}: ${pick(pr, 'problem', lang)}`] : []),
        ...toBullets(pick(pr, 'description', lang), 2),
        ...(pick(pr, 'impact', lang) ? [`${L.impact}: ${pick(pr, 'impact', lang)}`] : [])
      ],
      repo: clean(pr.github_url),
      demo: clean(pr.demo_url || pr.project_url)
    })),
    experience: journeys.filter(j => j.category !== 'education').map((j) => {
      const sd = formatDate(j.date, lang);
      const ed = j.is_current ? (lang === 'id' ? 'Sekarang' : 'Present') : formatDate(j.end_date, lang);
      return {
        date: ed ? `${sd} - ${ed}` : sd,
        title: pick(j, 'title', lang),
        bullets: toBullets(pick(j, 'description', lang), 3)
      };
    }),
    education: journeys.filter(j => j.category === 'education').map((j) => {
      const sd = formatDate(j.date, lang);
      const ed = j.is_current ? (lang === 'id' ? 'Sekarang' : 'Present') : formatDate(j.end_date, lang);
      return {
        date: ed ? `${sd} - ${ed}` : sd,
        title: pick(j, 'title', lang),
        bullets: toBullets(pick(j, 'description', lang), 3)
      };
    }),
    certifications: certificates.map((c) => ({
      title: clean(c.title),
      issuer: clean(c.issuer),
      year: c.date ? String(new Date(c.date).getUTCFullYear()) : '',
      url: clean(c.credential_url)
    }))
  };
}

function toText(cv) {
  const L = cv.labels;
  const out = [];
  const line = (s = '') => out.push(s);
  const head = (s) => { line(); line(s.toUpperCase()); line('-'.repeat(s.length)); };

  line(cv.name.toUpperCase());
  if (cv.headline) line(cv.headline);
  const c = cv.contact;
  const contactLine = [c.email, c.phone, c.location].filter(Boolean).join(' | ');
  if (contactLine) line(contactLine);
  const links = [c.linkedin, c.github].filter(Boolean).join(' | ');
  if (links) line(links);

  if (cv.summary) { head(L.summary); line(cv.summary); }

  const cats = Object.keys(cv.skillGroups);
  if (cats.length) {
    head(L.skills);
    cats.forEach((k) => line(`${k}: ${cv.skillGroups[k].join(', ')}`));
  }

  if (cv.projects.length) {
    head(L.projects);
    cv.projects.forEach((p) => {
      line([p.title, p.role].filter(Boolean).join(' | '));
      if (p.stack.length) line(`- ${L.stack}: ${p.stack.join(', ')}`);
      p.bullets.forEach((b) => line(`- ${b}`));
      if (p.repo) line(`- ${L.repo}: ${p.repo}`);
      if (p.demo) line(`- ${L.demo}: ${p.demo}`);
      line();
    });
  }

  if (cv.experience.length) {
    head(L.experience);
    cv.experience.forEach((e) => {
      line([e.title, e.date].filter(Boolean).join(' | '));
      e.bullets.forEach((b) => line(`- ${b}`));
      line();
    });
  }

  if (cv.education && cv.education.length) {
    head(L.education);
    cv.education.forEach((e) => {
      line([e.title, e.date].filter(Boolean).join(' | '));
      e.bullets.forEach((b) => line(`- ${b}`));
      line();
    });
  }

  if (cv.certifications.length) {
    head(L.certifications);
    cv.certifications.forEach((x) => {
      line(`- ${[x.title, x.issuer, x.year].filter(Boolean).join(', ')}${x.url ? ` (${L.verify}: ${x.url})` : ''}`);
    });
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/**
 * Content-based ATS readiness score (0-100).
 * Format-related ATS rules (single column, no images/tables/icons, standard
 * headings, selectable text) are guaranteed by the template, so they are not
 * scored here; only data completeness and quality are.
 */
function score(cv) {
  const lang = cv.lang;
  const checks = [];
  const add = (key, max, got, ok, tip) => checks.push({ key, max, got: Math.round(got * 10) / 10, ok, tip });
  const c = cv.contact;
  const isId = lang === 'id';
  const t = (idText, enText) => (isId ? idText : enText);

  add(t('Nama lengkap', 'Full name'), 5, cv.name ? 5 : 0, !!cv.name,
    t('Isi nama lengkap di Admin > Profile.', 'Fill in your full name in Admin > Profile.'));
  add(t('Email valid', 'Valid email'), 8, EMAIL_RE.test(c.email) ? 8 : 0, EMAIL_RE.test(c.email),
    t('Tambahkan email aktif yang profesional.', 'Add an active, professional email.'));
  add(t('Nomor telepon/WhatsApp', 'Phone/WhatsApp'), 5, c.phone ? 5 : 0, !!c.phone,
    t('Tambahkan nomor telepon agar HRD mudah menghubungi.', 'Add a phone number so recruiters can reach you.'));
  add(t('Lokasi', 'Location'), 4, c.location ? 4 : 0, !!c.location,
    t('Tambahkan kota/lokasi (filter ATS sering memakai lokasi).', 'Add city/location (ATS filters often use it).'));
  const linkPts = (c.linkedin ? 4 : 0) + (c.github ? 4 : 0);
  add(t('LinkedIn & GitHub', 'LinkedIn & GitHub'), 8, linkPts, linkPts === 8,
    t('Lengkapi tautan LinkedIn dan GitHub yang asli.', 'Add your real LinkedIn and GitHub links.'));
  add(t('Judul profesional', 'Professional headline'), 4, cv.headline ? 4 : 0, !!cv.headline,
    t('Tulis headline sesuai posisi yang dilamar, mis. "Backend Developer".', 'Write a headline matching the target role, e.g. "Backend Developer".'));

  const sw = words(cv.summary).length;
  add(t('Ringkasan 40-120 kata', 'Summary of 40-120 words'), 8, sw >= 40 && sw <= 120 ? 8 : sw > 0 ? 4 : 0, sw >= 40 && sw <= 120,
    t(`Ringkasan saat ini ${sw} kata. Targetkan 40-120 kata, spesifik, tanpa klise.`, `Summary is ${sw} words. Aim for 40-120 specific words, no buzzwords.`));

  const skillCount = Object.values(cv.skillGroups).reduce((n, a) => n + a.length, 0);
  add(t('Keahlian teknis (min. 8)', 'Technical skills (min. 8)'), 8, skillCount >= 8 ? 8 : skillCount >= 4 ? 4 : 0, skillCount >= 8,
    t(`Ada ${skillCount} skill. Tambahkan skill yang benar-benar dipakai (kata kunci ATS).`, `${skillCount} skills listed. Add skills you truly use (ATS keywords).`));

  const softSkillsCat = Object.keys(cv.skillGroups).find(k => k.toLowerCase().includes('soft'));
  const softSkillCount = softSkillsCat ? cv.skillGroups[softSkillsCat].length : 0;
  add(t('Soft Skills (min. 3)', 'Soft Skills (min. 3)'), 2, softSkillCount >= 3 ? 2 : softSkillCount > 0 ? 1 : 0, softSkillCount >= 3,
    t('Kelompokkan keahlian dengan kategori "Soft Skills" (mis. Komunikasi, Kepemimpinan).', 'Group non-technical skills under a "Soft Skills" category (e.g. Leadership, Communication).'));

  const pc = cv.projects.length;
  add(t('Proyek (min. 2)', 'Projects (min. 2)'), 8, pc >= 2 ? 8 : pc === 1 ? 4 : 0, pc >= 2,
    t('Tambahkan minimal 2 proyek asli yang berstatus published.', 'Add at least 2 real published projects.'));

  const detailed = cv.projects.filter((p) => p.bullets.length >= 2 || p.role).length;
  add(t('Detail proyek (masalah/peran/dampak)', 'Project detail (problem/role/impact)'), 8,
    pc ? (detailed / pc) * 8 : 0, pc > 0 && detailed === pc,
    t('Isi kolom masalah, peran, dan dampak pada tiap proyek.', 'Fill in problem, role, and impact for every project.'));

  const allBullets = [
    ...cv.projects.flatMap((p) => p.bullets),
    ...cv.experience.flatMap((e) => e.bullets)
  ];
  const numeric = allBullets.filter((b) => /\d/.test(b)).length;
  add(t('Hasil terukur (angka/%)', 'Quantified results (numbers/%)'), 10, numeric >= 3 ? 10 : numeric >= 1 ? 5 : 0, numeric >= 3,
    t('Tambahkan angka nyata (user, waktu respons, % peningkatan) di dampak proyek. Jangan mengarang.', 'Add real numbers (users, response time, % gain) to project impact. Do not invent them.'));

  const verbs = ACTION_VERBS[lang];
  const verbStart = allBullets.filter((b) => {
    const first = (b.split(':').length > 1 ? '' : b).toLowerCase().split(' ')[0];
    return verbs.includes(first);
  }).length;
  const verbRatio = allBullets.length ? verbStart / allBullets.length : 0;
  add(t('Kalimat diawali kata kerja aksi', 'Bullets start with action verbs'), 6, verbRatio * 6, verbRatio >= 0.5,
    t('Mulai deskripsi dengan kata kerja aktif: "Membangun...", "Mengoptimalkan...".', 'Start descriptions with active verbs: "Built...", "Optimized...".'));

  const dated = cv.experience.filter((e) => e.date && e.title).length;
  add(t('Pengalaman/pendidikan bertanggal', 'Dated experience/education'), 8, dated >= 2 ? 8 : dated === 1 ? 4 : 0, dated >= 2,
    t('Isi halaman Journey dengan pendidikan/magang/kursus lengkap dengan tanggal.', 'Fill Journey with education/internships/courses including dates.'));

  add(t('Sertifikasi', 'Certifications'), 3, cv.certifications.length ? 3 : 0, cv.certifications.length > 0,
    t('Tambahkan sertifikat asli (opsional tetapi menambah kata kunci).', 'Add real certificates (optional but adds keywords).'));

  const totalWords = words(toText(cv)).length;
  add(t('Panjang CV 250-800 kata', 'CV length 250-800 words'), 5, totalWords >= 250 && totalWords <= 800 ? 5 : totalWords > 0 ? 2 : 0,
    totalWords >= 250 && totalWords <= 800,
    t(`CV saat ini ${totalWords} kata. Idealnya 1 halaman (250-800 kata).`, `CV is ${totalWords} words. Ideal is one page (250-800 words).`));

  const total = checks.reduce((n, x) => n + x.got, 0);
  const max = checks.reduce((n, x) => n + x.max, 0);
  const value = Math.round((total / max) * 100);
  const grade = value >= 85 ? 'high' : value >= 65 ? 'medium' : 'low';
  return { value, grade, checks, totalWords };
}

async function buildCv(lang) {
  const safeLang = lang === 'id' ? 'id' : 'en';
  const cv = await collect(safeLang);
  const text = toText(cv);
  return { cv, text, score: score(cv) };
}

module.exports = { buildCv, toText, score };
