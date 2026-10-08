/**
 * Multilingual Translation Helper & Middleware (T-41)
 */

const translations = {
  id: {
    home: 'Beranda',
    about: 'Tentang',
    projects: 'Project',
    certificates: 'Sertifikat',
    journey: 'Perjalanan',
    contact: 'Kontak',
    download_cv: 'Download CV',
    generate_cv: 'CV ATS',
    view_projects: 'Lihat Project',
    contact_me: 'Hubungi Saya',
    featured_projects: 'Project Unggulan',
    all_projects: 'Lihat semua project',
    skills_expertise: 'Keahlian & Spesialisasi',
    my_journey: 'Perjalanan Karir',
    latest_certifications: 'Sertifikasi Terbaru',
    testimonials: 'Apa Kata Mereka',
    testimonials_sub: 'Rekomendasi dan kesan dari rekan kerja & mitra',
    open_to_work: 'Terbuka untuk pekerjaan',
    freelance: 'Terbuka untuk freelance'
  },
  en: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    certificates: 'Certificates',
    journey: 'Journey',
    contact: 'Contact',
    download_cv: 'Download CV',
    generate_cv: 'ATS CV',
    view_projects: 'View Projects',
    contact_me: 'Contact Me',
    featured_projects: 'Featured Projects',
    all_projects: 'View all projects',
    skills_expertise: 'Skills & Expertise',
    my_journey: 'My Journey',
    latest_certifications: 'Latest Certifications',
    testimonials: 'What People Say',
    testimonials_sub: 'Recommendations and reviews from colleagues & partners',
    open_to_work: 'Open to work',
    freelance: 'Available for freelance'
  }
};

function i18nMiddleware(req, res, next) {
  // Query param ?lang=en or ?lang=id overrides
  let lang = req.query.lang;
  if (lang && (lang === 'id' || lang === 'en')) {
    res.cookie('lang', lang, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false });
  } else {
    lang = req.cookies ? req.cookies.lang : 'id';
  }

  if (lang !== 'id' && lang !== 'en') lang = 'id';

  res.locals.lang = lang;
  // Inline translation helper: t('teks Indonesia', 'English text')
  res.locals.t = (idText, enText) => (lang === 'en' ? enText : idText);
  // Locale-aware date formatting (UTC so DATEONLY values never shift a day)
  res.locals.fmtDate = (value, opts) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID',
      Object.assign({ year: 'numeric', month: 'long', timeZone: 'UTC' }, opts || {}));
  };
  res.locals.__ = (key) => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    return translations['en'][key] || key;
  };

  next();
}

module.exports = {
  i18nMiddleware,
  translations
};
