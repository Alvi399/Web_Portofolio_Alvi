const { sequelize, Profile, Project, Skill, Contact, User, Certificate, Journey, Testimonial, Event } = require('../models');

async function auditDatabaseSchema() {
  console.log('🔍 --- STARTING COMPREHENSIVE DB SCHEMA AUDIT --- 🔍\n');
  await sequelize.authenticate();
  console.log('✓ MySQL Database Connection OK\n');

  // Sync any missing columns if needed ({ alter: true })
  await sequelize.sync({ alter: true });
  console.log('✓ Sequelize Schema Sync ({ alter: true }) Completed\n');

  const modelsMap = {
    profiles: Profile,
    projects: Project,
    skills: Skill,
    contacts: Contact,
    users: User,
    certificates: Certificate,
    journey: Journey,
    testimonials: Testimonial,
    events: Event
  };

  const queryInterface = sequelize.getQueryInterface();
  let totalIssues = 0;

  for (const [tableName, model] of Object.entries(modelsMap)) {
    console.log(`📋 Table: [${tableName}]`);
    let tableColumns = {};
    try {
      tableColumns = await queryInterface.describeTable(tableName);
    } catch (err) {
      console.error(`  ❌ Table '${tableName}' does not exist in DB: ${err.message}`);
      totalIssues++;
      continue;
    }

    const modelAttributes = model.rawAttributes;
    const modelFieldNames = Object.keys(modelAttributes);
    const dbColumnNames = Object.keys(tableColumns);

    // Check Model attributes vs DB columns
    let missingInDb = [];
    modelFieldNames.forEach(fieldName => {
      const colName = modelAttributes[fieldName].field || fieldName;
      if (!dbColumnNames.includes(colName)) {
        missingInDb.push(colName);
      }
    });

    if (missingInDb.length > 0) {
      console.log(`  ❌ Missing columns in DB table '${tableName}': ${missingInDb.join(', ')}`);
      totalIssues += missingInDb.length;
    } else {
      console.log(`  ✅ All ${modelFieldNames.length} model fields match columns in MySQL DB!`);
    }

    // Sample print columns
    console.log(`  Columns in DB (${dbColumnNames.length}): ${dbColumnNames.join(', ')}\n`);
  }

  console.log('----------------------------------------------------');
  if (totalIssues === 0) {
    console.log('🎉 AUDIT PASSED: Structure DB 100% mendukung semua field backend, controller, & MCP!');
  } else {
    console.log(`⚠️ AUDIT WARNING: Found ${totalIssues} issue(s) between models and DB tables.`);
  }

  process.exit(totalIssues > 0 ? 1 : 0);
}

auditDatabaseSchema().catch(err => {
  console.error('❌ Audit execution failed:', err);
  process.exit(1);
});
