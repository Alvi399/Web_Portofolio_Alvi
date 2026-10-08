const { Journey, Certificate, Testimonial, sequelize } = require('../models');

async function testDB() {
  try {
    await sequelize.authenticate();
    console.log('DB Connection OK');

    const journeys = await Journey.findAll();
    console.log('Journeys count:', journeys.length);
    if (journeys.length > 0) {
      const j = journeys[0];
      console.log('Sample Journey before update:', j.toJSON());
      await j.update({ title: j.title });
      console.log('Journey update OK');
    }

    const certs = await Certificate.findAll();
    console.log('Certificates count:', certs.length);
    if (certs.length > 0) {
      const c = certs[0];
      console.log('Sample Certificate before update:', c.toJSON());
      await c.update({ title: c.title });
      console.log('Certificate update OK');
    }

    const tests = await Testimonial.findAll();
    console.log('Testimonials count:', tests.length);
    if (tests.length > 0) {
      const t = tests[0];
      console.log('Sample Testimonial before update:', t.toJSON());
      await t.update({ name: t.name });
      console.log('Testimonial update OK');
    }
  } catch (err) {
    console.error('DB Test Error:', err);
  } finally {
    await sequelize.close();
  }
}

testDB();
