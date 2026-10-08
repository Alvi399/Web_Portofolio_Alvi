const { Journey, Certificate, Testimonial, Skill, sequelize } = require('../models');

async function testFullCrud() {
  try {
    console.log('=== STARTING DB UPDATE TEST ===');
    await sequelize.authenticate();

    // 1. Test Journey Update
    const journey = await Journey.findOne();
    if (journey) {
      const originalTitle = journey.title;
      const testTitle = originalTitle + ' (Updated Test)';
      await journey.update({ title: testTitle });
      console.log(`[PASS] Journey ID ${journey.id} updated title to "${journey.title}"`);
      // Revert back
      await journey.update({ title: originalTitle });
      console.log(`[PASS] Journey ID ${journey.id} restored title to "${journey.title}"`);
    }

    // 2. Test Certificate Update
    const cert = await Certificate.findOne();
    if (cert) {
      const originalTitle = cert.title;
      const testTitle = originalTitle + ' (Updated Test)';
      await cert.update({ title: testTitle, category: 'Backend' });
      console.log(`[PASS] Certificate ID ${cert.id} updated title to "${cert.title}"`);
      // Revert back
      await cert.update({ title: originalTitle });
      console.log(`[PASS] Certificate ID ${cert.id} restored title to "${cert.title}"`);
    }

    // 3. Test Testimonial Update
    const testimonial = await Testimonial.findOne();
    if (testimonial) {
      const originalName = testimonial.name;
      const testName = originalName + ' (Updated Test)';
      await testimonial.update({ name: testName });
      console.log(`[PASS] Testimonial ID ${testimonial.id} updated name to "${testimonial.name}"`);
      // Revert back
      await testimonial.update({ name: originalName });
      console.log(`[PASS] Testimonial ID ${testimonial.id} restored name to "${testimonial.name}"`);
    }

    // 4. Test Skill Update
    const skill = await Skill.findOne();
    if (skill) {
      const originalName = skill.name;
      const testName = originalName + ' (Updated Test)';
      await skill.update({ name: testName });
      console.log(`[PASS] Skill ID ${skill.id} updated name to "${skill.name}"`);
      // Revert back
      await skill.update({ name: originalName });
      console.log(`[PASS] Skill ID ${skill.id} restored name to "${skill.name}"`);
    }

    console.log('=== ALL DB CRUD UPDATES PASSED SUCCESSFULLY ===');
  } catch (err) {
    console.error('[FAIL] DB Update Error:', err);
  } finally {
    await sequelize.close();
  }
}

testFullCrud();
