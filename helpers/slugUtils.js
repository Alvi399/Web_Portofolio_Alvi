const slugify = require('slugify');

/**
 * Build a unique slug for a model. Appends -2, -3, ... when the slug is taken.
 * @param {Model} Model - Sequelize model with a `slug` column
 * @param {string} text - Source text (e.g. title)
 * @param {number|null} excludeId - Row id to ignore (when updating)
 */
async function uniqueSlug(Model, text, excludeId = null) {
  const base = slugify(text || '', { lower: true, strict: true }) || 'project';
  let candidate = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const found = await Model.findOne({ where: { slug: candidate } });
    if (!found || (excludeId && String(found.id) === String(excludeId))) return candidate;
    candidate = `${base}-${n++}`;
  }
}

module.exports = { uniqueSlug };
