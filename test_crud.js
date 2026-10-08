const { Project, Skill, Journey, Certificate, Testimonial, sequelize } = require('./models');

async function run() {
  try {
    await sequelize.authenticate();
    console.log("DB connected.");

    // Test Project
    console.log("Testing Project CRUD...");
    const project = await Project.create({
      title: "Test Project",
      slug: "test-project-" + Date.now(),
      description: "Testing CRUD",
      image: "/uploads/test.png",
      status: "published"
    });
    console.log(`Created project id: ${project.id}`);
    
    project.title = "Updated Project";
    await project.save();
    console.log(`Updated project title: ${project.title}`);

    await project.destroy();
    console.log(`Deleted project id: ${project.id}`);

    // Test Skill
    console.log("Testing Skill CRUD...");
    const skill = await Skill.create({
      name: "Node.js Test",
      category: "Backend",
      proficiency: 90,
      image: "/uploads/skill.png"
    });
    console.log(`Created skill id: ${skill.id}`);
    await skill.destroy();

    // Test Journey
    console.log("Testing Journey CRUD...");
    const journey = await Journey.create({
      title: "First Job",
      date: "2022-01-01",
      image: "/uploads/journey.png"
    });
    console.log(`Created journey id: ${journey.id}`);
    await journey.destroy();

    // Test Certificate
    console.log("Testing Certificate CRUD...");
    const cert = await Certificate.create({
      title: "AWS Cert",
      issuer: "Amazon",
      date: "2023-01-01",
      image: "/uploads/cert.png"
    });
    console.log(`Created cert id: ${cert.id}`);
    await cert.destroy();

    // Test Testimonial
    console.log("Testing Testimonial CRUD...");
    const testi = await Testimonial.create({
      name: "John Doe",
      quote: "Great work!",
      photo: "/uploads/photo.png"
    });
    console.log(`Created testimonial id: ${testi.id}`);
    await testi.destroy();

    console.log("All CRUD tests passed!");
    process.exit(0);

  } catch (error) {
    console.error("CRUD Test Failed:", error);
    process.exit(1);
  }
}

run();
