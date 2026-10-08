/**
 * Navigation visibility helper.
 * Hides "Journey" and "Certificates" from the public navbar while they have
 * no data (an empty page is a red flag for recruiters). Cached for 60s so it
 * does not hit the database on every request.
 */
const { Journey, Certificate } = require('../models');

const TTL_MS = 60 * 1000;
let cache = null;
let cachedAt = 0;

async function hasRows(Model) {
  const rows = await Model.findAll({ attributes: ['id'], limit: 1 });
  return Array.isArray(rows) && rows.length > 0;
}

async function getNavState() {
  if (cache && Date.now() - cachedAt < TTL_MS) return cache;
  try {
    const [journey, certificates] = await Promise.all([hasRows(Journey), hasRows(Certificate)]);
    cache = { journey, certificates };
  } catch (err) {
    // On any DB problem keep every link visible rather than hiding content
    cache = { journey: true, certificates: true };
  }
  cachedAt = Date.now();
  return cache;
}

async function navMiddleware(req, res, next) {
  res.locals.nav = await getNavState();
  next();
}

module.exports = { navMiddleware, getNavState };
