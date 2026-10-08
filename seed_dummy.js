const { sequelize, Profile, Skill, Project, Journey, Certificate, Testimonial } = require('./models');

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("DB connected and synced.");

    // Clear existing data to avoid duplicates, except maybe Profile if we want to update it.
    // Let's just destroy all and recreate.
    await Project.destroy({ where: {} });
    await Skill.destroy({ where: {} });
    await Journey.destroy({ where: {} });
    await Certificate.destroy({ where: {} });
    await Testimonial.destroy({ where: {} });
    await Profile.destroy({ where: {} });

    console.log("Cleared existing data.");

    // 1. Profile
    await Profile.create({
      full_name: "Muhammad Alvi Kirana Zulfan Nazal",
      display_name: "Malvix",
      tagline: "Building digital experiences.",
      headline: "Full Stack Developer | UI/UX Enthusiast",
      bio: "I am a passionate Full Stack Junior Developer with a knack for creating intuitive, modern web applications. With expertise in both frontend and backend technologies, I bridge the gap between design and robust engineering.",
      about_summary: "Over the past 2 years, I've developed a deep love for web technologies. From designing sleek UI with CSS frameworks to architecting backend services with Node.js and SQL. I thrive in challenging environments where I can creatively solve problems.",
      email: "alvi@example.com",
      phone: "+62 812 3456 7890",
      location: "Indonesia",
      github_url: "https://github.com",
      linkedin_url: "https://linkedin.com",
      availability_status: "open_to_work",
      work_preference: "Remote / Hybrid",
      profile_image: ""
    });

    // 2. Skills
    const skills = [
      { name: "JavaScript", category: "Frontend", proficiency: 90, icon: "⚡" },
      { name: "React.js", category: "Frontend", proficiency: 85, icon: "⚛️" },
      { name: "Node.js", category: "Backend", proficiency: 80, icon: "🟢" },
      { name: "Express", category: "Backend", proficiency: 85, icon: "🚂" },
      { name: "MySQL", category: "Database", proficiency: 75, icon: "🐬" },
      { name: "Tailwind CSS", category: "Frontend", proficiency: 95, icon: "🌊" },
      { name: "Git", category: "Tools", proficiency: 88, icon: "🌲" },
      { name: "Figma", category: "Tools", proficiency: 70, icon: "🎨" }
    ];
    for (const s of skills) await Skill.create(s);

    // 3. Projects
    await Project.create({
      title: "FinTech Dashboard",
      slug: "fintech-dashboard",
      description: "I built a comprehensive analytics dashboard for personal finance tracking. The platform features real-time charts, budget planning tools, and intelligent transaction categorization, currently processing over 10,000 transactions daily.",
      technologies: ["React.js", "Node.js", "Tailwind CSS", "MySQL"],
      project_url: "https://demo.example.com",
      github_url: "https://github.com/example/fintech",
      is_featured: true,
      status: "published",
      sort_order: 1,
      problem: "Users needed a unified view of their disparate bank accounts and expenses without complex spreadsheets.",
      role: "Lead Fullstack Developer",
      impact: "Adopted by 500+ beta testers, leading to a 30% increase in daily active engagement."
    });

    await Project.create({
      title: "E-Commerce Microservices",
      slug: "ecommerce-microservices",
      description: "I built a headless e-commerce backend utilizing scalable microservices. The backend supports robust inventory management, seamless payment gateways, and real-time order tracking, successfully managing up to 5,000 concurrent requests.",
      technologies: ["Node.js", "Express", "MySQL", "Git"],
      project_url: "",
      github_url: "https://github.com/example/ecommerce",
      is_featured: true,
      status: "published",
      sort_order: 2,
      problem: "The previous monolithic system crashed during peak sales events.",
      role: "Backend Engineer",
      impact: "Reduced system downtime by 99% and improved API response times by 400ms."
    });

    await Project.create({
      title: "Neo-Brutalist Portfolio",
      slug: "neo-brutalist-portfolio",
      description: "I needed a unique personal brand identity that would stand out from generic templates, so I built my personal portfolio website. It features a clean, high-contrast neo-brutalist design and a custom-built admin CMS panel.",
      technologies: ["JavaScript", "Node.js", "Express", "Tailwind CSS"],
      project_url: "https://malvix.com",
      github_url: "https://github.com",
      is_featured: true,
      status: "published",
      sort_order: 3,
      problem: "Needed a unique personal brand identity that stands out from typical generic templates.",
      role: "Sole Developer & Designer",
      impact: "Received numerous compliments from recruiters and landed 3 freelance gigs."
    });

    // 4. Journey
    await Journey.create({
      title: "Fullstack Web Developer",
      description: "I joined a fast-paced tech startup and was responsible for building and maintaining core features of their flagship SaaS product, collaborating with a cross-functional team of 12 engineers to serve over 50,000 active users.",
      date: "2023-05-01"
    });
    
    await Journey.create({
      title: "Freelance Developer",
      description: "I worked as an independent contractor delivering tailored web applications for 15+ international clients, successfully reducing average project delivery time by 20% and driving measurable conversion increases.",
      date: "2022-01-15"
    });

    await Journey.create({
      title: "Computer Science Degree",
      description: "I graduated with honors, achieving a 3.85 GPA. For my thesis, I successfully optimized database query performance in distributed systems, demonstrating a 40% reduction in query execution time across 5 tested databases.",
      date: "2021-08-01",
      category: "education"
    });

    // 5. Certificates
    await Certificate.create({
      title: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2023-11-10",
      credential_url: "https://aws.amazon.com/certification"
    });

    await Certificate.create({
      title: "Full-Stack Web Development Bootcamp",
      issuer: "Dicoding Indonesia",
      date: "2022-06-20",
      credential_url: "https://dicoding.com"
    });

    // 6. Testimonials
    await Testimonial.create({
      name: "Budi Santoso",
      position: "CTO",
      company: "TechNusantara",
      quote: "Alvi is an exceptional developer. His ability to grasp complex architectures and deliver clean, maintainable code is outstanding. Highly recommended!",
      is_visible: true,
      sort_order: 1
    });

    await Testimonial.create({
      name: "Sarah Wijaya",
      position: "Product Manager",
      company: "Creative Studio",
      quote: "Working with Alvi was a breeze. He communicates well, understands the design requirements perfectly, and consistently delivers ahead of schedule.",
      is_visible: true,
      sort_order: 2
    });

    console.log("Dummy data seeded successfully!");
    process.exit(0);

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
