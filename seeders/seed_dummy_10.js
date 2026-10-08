const bcrypt = require('bcryptjs');
const { sequelize, User, Profile, Project, Skill, Certificate, Journey, Testimonial, Contact } = require('../models');

async function seed10Dummy() {
  try {
    console.log('=== Wiping current database tables and inserting 10 dummy records per table ===');
    await sequelize.authenticate();

    // Recreate all database tables cleanly
    await sequelize.sync({ force: true });
    console.log('✓ Database tables wiped & recreated');

    // 1. Admin User
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const hash = bcrypt.hashSync(adminPassword, 10);
    await User.create({ username: adminUsername, email: adminEmail, password: hash });
    console.log(`✓ Admin user created (${adminUsername} / ${adminPassword})`);

    // 2. Profile (ATS Optimized 100%)
    await Profile.create({
      full_name: 'Muhammad Alvi Kirana Zulfan Nazal',
      display_name: 'Alvi Kirana',
      tagline: 'Senior Full Stack Web Developer & Software Engineer',
      headline: 'Full Stack Web Developer',
      about_summary: 'Experienced Full Stack Developer with over 4 years of expertise in building high-performance web applications, scalable backend microservices, and modern responsive user interfaces. Proven track record of delivering cloud-native solutions that serve over 100,000 active users with 99.9% uptime.',
      bio: 'Loves building clean software architecture, optimizing MySQL database queries, and creating intuitive user experiences.',
      email: 'alvikirana@gmail.com',
      phone: '+6281234567890',
      whatsapp: '6281234567890',
      location: 'Jakarta, Indonesia',
      work_preference: 'Hybrid / Remote',
      availability_status: 'open_to_work',
      looking_for: 'Full-time Full Stack Web Developer or Senior Backend Engineer roles',
      github_url: 'https://github.com/Alvi399',
      linkedin_url: 'https://linkedin.com/in/alvi'
    });
    console.log('✓ Profile created');

    // 3. 10 Skills (7 Technical + 3 Soft Skills)
    const skillsData = [
      { name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 95, icon: '⚡', sort_order: 1 },
      { name: 'React.js', category: 'Frontend', proficiency: 90, icon: '⚛️', sort_order: 2 },
      { name: 'Vue.js', category: 'Frontend', proficiency: 85, icon: '💚', sort_order: 3 },
      { name: 'Node.js', category: 'Backend', proficiency: 92, icon: '🟢', sort_order: 4 },
      { name: 'Express.js', category: 'Backend', proficiency: 90, icon: '🚀', sort_order: 5 },
      { name: 'MySQL & Sequelize', category: 'Database', proficiency: 88, icon: '🗄️', sort_order: 6 },
      { name: 'Docker & Git', category: 'Tools', proficiency: 85, icon: '🐳', sort_order: 7 },
      { name: 'Problem Solving & Analytics', category: 'Soft Skills', proficiency: 95, icon: '🧠', sort_order: 8 },
      { name: 'Team Leadership & Collaboration', category: 'Soft Skills', proficiency: 90, icon: '👥', sort_order: 9 },
      { name: 'Time Management & Agile / Scrum', category: 'Soft Skills', proficiency: 90, icon: '⏱️', sort_order: 10 }
    ];
    await Skill.bulkCreate(skillsData);
    console.log('✓ 10 Skills created');

    // 4. 10 Projects
    const projectsData = [
      {
        title: 'E-Commerce Microservices Engine',
        slug: 'e-commerce-microservices-engine',
        description: 'Membangun platform e-commerce berbasis microservices dengan arsitektur REST API berkinerja tinggi.',
        problem: 'Sistem monolithic lama mengalami bottleneck saat kilat promo (flash sale) melayani lebih dari 20,000 pengguna bersamaan.',
        role: 'Lead Backend Engineer',
        impact: 'Mengurangi waktu muat server hingga 45% dan meningkatkan throughput checkout sebesar 300%.',
        technologies: ['Node.js', 'Express', 'MySQL', 'Docker', 'Redis'],
        project_url: 'https://example.com/ecommerce',
        github_url: 'https://github.com/Alvi399/ecommerce-engine',
        status: 'published',
        is_featured: true,
        sort_order: 1
      },
      {
        title: 'Real-time Analytics Dashboard',
        slug: 'realtime-analytics-dashboard',
        description: 'Merancang dashboard analitik real-time yang memvisualisasikan matriks traffic dan konversi penjualan.',
        problem: 'Tim bisnis memerlukan pemantauan penjualan secara real-time tanpa membebani database utama.',
        role: 'Full Stack Developer',
        impact: 'Menghemat biaya server sebesar 30% dan memberikan wawasan statistik dengan latency kurang dari 100ms.',
        technologies: ['React', 'Node.js', 'Chart.js', 'MySQL'],
        project_url: 'https://example.com/analytics',
        github_url: 'https://github.com/Alvi399/analytics-dashboard',
        status: 'published',
        is_featured: true,
        sort_order: 2
      },
      {
        title: 'Smart Task & Project Manager',
        slug: 'smart-task-project-manager',
        description: 'Mengembangkan aplikasi manajemen tugas kolaboratif dengan papan Kanban dan pengingat otomatis.',
        problem: 'Kurangnya alur kerja terpusat untuk tim pengembang jarak jauh dalam mengelola tugas sprint.',
        role: 'Full Stack Engineer',
        impact: 'Meningkatkan produktivitas tim sebesar 25% dan menyelesaikan 500+ sprint task secara efisien.',
        technologies: ['Vue.js', 'Express', 'MySQL', 'TailwindCSS'],
        project_url: 'https://example.com/taskmanager',
        github_url: 'https://github.com/Alvi399/task-manager',
        status: 'published',
        is_featured: true,
        sort_order: 3
      },
      {
        title: 'AI Resume & Portfolio Builder',
        slug: 'ai-resume-portfolio-builder',
        description: 'Membuat generator CV berstandar ATS otomatis berbasis AI yang mengukur kelayakan dokumen secara instan.',
        problem: 'Banyak pelamar kerja mengalami kesulitan dalam menyusun format CV yang terbaca oleh sistem ATS.',
        role: 'Lead Software Architect',
        impact: 'Meningkatkan skor kelulusan ATS pengguna sebesar 40% dan telah dipakai oleh 5,000+ pengguna.',
        technologies: ['Node.js', 'Express', 'EJS', 'Sequelize', 'MySQL'],
        project_url: 'https://example.com/cvbuilder',
        github_url: 'https://github.com/Alvi399/cv-builder',
        status: 'published',
        is_featured: false,
        sort_order: 4
      },
      {
        title: 'Fintech Payment Gateway Connector',
        slug: 'fintech-payment-gateway-connector',
        description: 'Mengintegrasikan berbagai sistem gateway pembayaran lokal dan internasional dengan standar keamanan tinggi.',
        problem: 'Tingginya kegagalan transaksi pembayaran akibat ketidakstabilan webhook penyedia lama.',
        role: 'Backend Developer',
        impact: 'Berhasil memproses transaksi senilai Rp 2 Miliar dengan sukses rate 99.8%.',
        technologies: ['Node.js', 'Express', 'MySQL', 'Midtrans API'],
        project_url: 'https://example.com/payment',
        github_url: 'https://github.com/Alvi399/payment-connector',
        status: 'published',
        is_featured: false,
        sort_order: 5
      },
      {
        title: 'Hospital Management Information System',
        slug: 'hospital-management-info-system',
        description: 'Membangun sistem informasi manajemen rumah sakit untuk otomatisasi pendaftaran dan rekam medis digital.',
        problem: 'Proses antrean fisik pasien yang memakan waktu hingga 2 jam setiap pagi.',
        role: 'Full Stack Engineer',
        impact: 'Memotong waktu tunggu pasien sebesar 60% dan mengdigitalisasi 10,000+ data rekam medis.',
        technologies: ['PHP', 'Laravel', 'MySQL', 'Bootstrap'],
        project_url: 'https://example.com/simrs',
        github_url: 'https://github.com/Alvi399/simrs-app',
        status: 'published',
        is_featured: false,
        sort_order: 6
      },
      {
        title: 'Cloud Inventory & Warehouse App',
        slug: 'cloud-inventory-warehouse-app',
        description: 'Mengembangkan sistem inventaris stok pergudangan otomatis dengan barcode scanner integration.',
        problem: 'Sering terjadi kejanggalan selisih stok fisik akibat pencatatan manual di spreadsheet.',
        role: 'Backend Developer',
        impact: 'Mencapai akurasi stok 99.9% dan mempercepat proses opname dari 3 hari menjadi 4 jam.',
        technologies: ['Node.js', 'MySQL', 'Express', 'REST API'],
        project_url: 'https://example.com/inventory',
        github_url: 'https://github.com/Alvi399/inventory-app',
        status: 'published',
        is_featured: false,
        sort_order: 7
      },
      {
        title: 'Learning Management System (LMS)',
        slug: 'learning-management-system-lms',
        description: 'Membuat platform pembelajaran jarak jauh interaktif dengan materi video streaming dan kuis online.',
        problem: 'Institusi memerlukan platform edukasi mandiri yang hemat bandwidth.',
        role: 'Full Stack Developer',
        impact: 'Diakses oleh 8,000 siswa aktif dengan konsumsi bandwidth 50% lebih hemat.',
        technologies: ['React', 'Node.js', 'Express', 'MySQL'],
        project_url: 'https://example.com/lms',
        github_url: 'https://github.com/Alvi399/lms-platform',
        status: 'published',
        is_featured: false,
        sort_order: 8
      },
      {
        title: 'Corporate Portal & CMS Engine',
        slug: 'corporate-portal-cms-engine',
        description: 'Mendesain portal perusahaan profesional dengan sistem CMS dinamis berbasis role-based access control.',
        problem: 'Perusahaan kesulitan memperbarui informasi situs utama tanpa bantuan developer.',
        role: 'Frontend & CMS Developer',
        impact: 'Memungkinkan tim marketing menerbitkan 50+ artikel berita per bulan secara mandiri.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'MySQL'],
        project_url: 'https://example.com/portal',
        github_url: 'https://github.com/Alvi399/corporate-cms',
        status: 'published',
        is_featured: false,
        sort_order: 9
      },
      {
        title: 'API Gateway & Rate Limiter Service',
        slug: 'api-gateway-rate-limiter-service',
        description: 'Menerapkan middleware API Gateway berkinerja tinggi untuk proteksi rate limiting dan autentikasi JWT.',
        problem: 'Serangan DDoS ringan yang sering menyebabkan degradasi server publik.',
        role: 'DevOps & Backend Engineer',
        impact: 'Menolak 100% serangan spam traffic berlebih tanpa mengganggu pengguna sah.',
        technologies: ['Node.js', 'Express', 'Helmet', 'Express-Rate-Limit'],
        project_url: 'https://example.com/gateway',
        github_url: 'https://github.com/Alvi399/api-gateway',
        status: 'published',
        is_featured: false,
        sort_order: 10
      }
    ];
    await Project.bulkCreate(projectsData);
    console.log('✓ 10 Projects created');

    // 5. 10 Certificates
    const certificatesData = [
      { title: 'AWS Certified Developer - Associate', issuer: 'Amazon Web Services', date: '2023-11-15', category: 'Backend', credential_url: 'https://aws.amazon.com/certification', is_highlight: true },
      { title: 'Node.js Application Developer (JSNAD)', issuer: 'OpenJS Foundation', date: '2023-08-20', category: 'Backend', credential_url: 'https://openjsf.org', is_highlight: true },
      { title: 'Meta Front-End Developer Professional', issuer: 'Meta / Coursera', date: '2023-04-10', category: 'Frontend', credential_url: 'https://coursera.org', is_highlight: true },
      { title: 'MySQL Database Administrator Certified', issuer: 'Oracle', date: '2022-12-05', category: 'Backend', credential_url: 'https://oracle.com', is_highlight: true },
      { title: 'Docker Certified Associate (DCA)', issuer: 'Docker Inc', date: '2022-09-18', category: 'Other', credential_url: 'https://docker.com', is_highlight: false },
      { title: 'Professional Scrum Master I (PSM I)', issuer: 'Scrum.org', date: '2022-05-30', category: 'Other', credential_url: 'https://scrum.org', is_highlight: false },
      { title: 'JavaScript Specialist Certification', issuer: 'W3Schools', date: '2021-11-12', category: 'Frontend', credential_url: 'https://w3schools.com', is_highlight: false },
      { title: 'RESTful API Architecture & Security', issuer: 'Udemy', date: '2021-07-22', category: 'Backend', credential_url: 'https://udemy.com', is_highlight: false },
      { title: 'AI & Machine Learning Foundations', issuer: 'Google Cloud', date: '2021-03-14', category: 'AI', credential_url: 'https://cloud.google.com', is_highlight: false },
      { title: 'Cybersecurity & Web Defense Fundamentals', issuer: 'Cisco Networking Academy', date: '2020-10-01', category: 'Other', credential_url: 'https://netacad.com', is_highlight: false }
    ];
    await Certificate.bulkCreate(certificatesData);
    console.log('✓ 10 Certificates created');

    // 6. 10 Journey Entries (Experience & Education)
    const journeyData = [
      { title: 'Senior Full Stack Developer - TechNusantara', category: 'experience', date: '2023-01-01', end_date: null, is_current: true, description: 'Memimpin tim yang terdiri dari 6 insinyur dalam membangun dan merancang aplikasi web skala besar melayani 100,000+ pengguna.' },
      { title: 'Backend Web Engineer - Inovasi Solusi Digital', category: 'experience', date: '2021-06-01', end_date: '2022-12-31', is_current: false, description: 'Mengembangkan RESTful API dengan Node.js dan MySQL, mengoptimalkan query database yang meningkatkan efisiensi sistem sebesar 35%.' },
      { title: 'Junior Web Developer - Studio Kreatif Media', category: 'experience', date: '2020-01-15', end_date: '2021-05-30', is_current: false, description: 'Membuat halaman web responsif dengan HTML, CSS, JavaScript, dan mengintegrasikan CMS untuk klien perbankan.' },
      { title: 'Magang Software Engineer - PT Teknologi Bangsa', category: 'experience', date: '2019-07-01', end_date: '2019-12-15', is_current: false, description: 'Membantu pembuatan komponen UI React dan pengujian otomatis API backend.' },
      { title: 'Pendidikan S1 Teknik Informatika - Universitas Indonesia', category: 'education', date: '2016-09-01', end_date: '2020-08-25', is_current: false, description: 'Lulus dengan Predikat Cumlaude (IPK 3.82). Berfokus pada Rekayasa Perangkat Lunak dan Basis Data.' },
      { title: 'Bootcamp Full Stack Web Development - Hacktiv8', category: 'education', date: '2020-09-01', end_date: '2020-12-20', is_current: false, description: 'Pelatihan intensif 12 minggu mencakup JavaScript, Node.js, Express, React, dan MySQL.' },
      { title: 'Pelatihan Cloud Computing & AWS Architecture', category: 'education', date: '2022-02-01', end_date: '2022-04-30', is_current: false, description: 'Program sertifikasi arsitektur cloud dan deployment container Docker di AWS EC2 & RDS.' },
      { title: 'Sertifikasi Keahlian Software Engineering Specialist', category: 'education', date: '2022-08-01', end_date: '2022-10-15', is_current: false, description: 'Program pendalaman desain sistem terdistribusi, Clean Code, dan Design Patterns.' },
      { title: 'Workshop Modern Microservices & Event-Driven Architecture', category: 'education', date: '2023-03-10', end_date: '2023-03-25', is_current: false, description: 'Studi mendalam mengenai arsitektur Kafka, RabbitMQ, dan Node.js event loops.' },
      { title: 'SMA Negeri 1 Jakarta - Jurusan IPA', category: 'education', date: '2013-07-01', end_date: '2016-06-15', is_current: false, description: 'Lulus dengan nilai sains terbaik dan aktif di klub Pemrograman Komputer.' }
    ];
    await Journey.bulkCreate(journeyData);
    console.log('✓ 10 Journey entries created');

    // 7. 10 Testimonials
    const testimonialsData = [
      { name: 'Budi Santoso', position: 'CTO', company: 'TechNusantara', quote: 'Alvi adalah pengembang berbakat. Kemampuannya merancang arsitektur bersih dan terstruktur sangat membantu tim kami.', is_visible: true, sort_order: 1 },
      { name: 'Siti Rahmawati', position: 'Product Manager', company: 'Inovasi Solusi Digital', quote: 'Sangat profesional dan selalu menyampaikan proyek tepat waktu dengan kualitas kode yang luar biasa.', is_visible: true, sort_order: 2 },
      { name: 'Rian Hidayat', position: 'VP of Engineering', company: 'Kreatif Media Studio', quote: 'Eksekusi teknis Alvi dalam memecahkan masalah sistem berjalan sangat cepat dan efektif.', is_visible: true, sort_order: 3 },
      { name: 'Dewi Lestari', position: 'Lead UI/UX Designer', company: 'Digital Craft', quote: 'Bekerja bersama Alvi sangat menyenangkan. Dia sangat paham bagaimana menerjemahkan desain menjadi kode web yang presisi.', is_visible: true, sort_order: 4 },
      { name: 'Ahmad Fauzi', position: 'Senior Backend Developer', company: 'TechNusantara', quote: 'Pengetahuan Alvi mengenai optimasi database MySQL dan Node.js sangat membantu tim backend.', is_visible: true, sort_order: 5 },
      { name: 'Linda Permata', position: 'HR Manager', company: 'Inovasi Solusi Digital', quote: 'Alvi memiliki komunikasi dan etos kerja yang hebat. Selalu siap membantu rekan satu tim.', is_visible: true, sort_order: 6 },
      { name: 'Eko Prasetyo', position: 'Co-Founder', company: 'Fintech Utama', quote: 'Integrasi payment gateway buatan Alvi terbukti sangat stabil tanpa ada kendala transaksi.', is_visible: true, sort_order: 7 },
      { name: 'Maya Indah', position: 'Project Lead', company: 'Simrs App Project', quote: 'Proyek sistem informasi rumah sakit diselesaikan dengan tingkat akurasi data yang sangat memuaskan.', is_visible: true, sort_order: 8 },
      { name: 'Hendra Wijaya', position: 'Head of Operations', company: 'Cloud Warehouse', quote: 'Sistem inventaris baru yang dibangun Alvi memotong waktu kerja kami hingga 60%. Luar biasa!', is_visible: true, sort_order: 9 },
      { name: 'Bambang Triyono', position: 'Lead Architect', company: 'Software Nusantara', quote: 'Alvi adalah tipe insinyur yang tidak hanya paham kode, tetapi juga paham dampak bisnis dari produk yang dibangun.', is_visible: true, sort_order: 10 }
    ];
    await Testimonial.bulkCreate(testimonialsData);
    console.log('✓ 10 Testimonials created');

    // 8. 10 Contact Messages
    const contactsData = [
      { name: 'Anita Wijaya', email: 'anita@company.com', subject: 'Tawaran Kerjasama Full Stack Developer', message: 'Halo Alvi, kami tertarik dengan portofolio Anda dan ingin mendiskusikan peluang proyek Full Stack.', is_read: true },
      { name: 'Deni Kurniawan', email: 'deni@techcorp.com', subject: 'Undangan Wawancara Senior Backend', message: 'Halo Alvi, tim kami ingin mengundang Anda untuk sesi wawancara teknis posisi Backend Engineer.', is_read: true },
      { name: 'Rina Sugiarto', email: 'rina@startup.io', subject: 'Pertanyaan Konsultasi Web Architecture', message: 'Apakah Anda membuka layanan konsultasi untuk optimasi performa Node.js dan MySQL?', is_read: false },
      { name: 'Fajar Nugraha', email: 'fajar@digital agency.com', subject: 'Penawaran Freelance Web App', message: 'Kami membutuhkan pengembang web untuk membangun dashboard analitik skala menengah.', is_read: false },
      { name: 'Maya Putri', email: 'maya@hrsolutions.id', subject: 'Peluang Karir Remote Developer', message: 'Kami membuka lowongan Remote Full Stack Developer untuk klien Singapura.', is_read: false },
      { name: 'Gita Prasetya', email: 'gita@edu.org', subject: 'Undangan Pemateri Workshop Web Dev', message: 'Kami mengundang Anda menjadi pembicara dalam sesi workshop Node.js minggu depan.', is_read: false },
      { name: 'Hadi Gunawan', email: 'hadi@fintech.id', subject: 'Diskusi Integrasi Gateway Pembayaran', message: 'Kami tertarik dengan proyek payment gateway connector yang Anda buat.', is_read: false },
      { name: 'Indra Perkasa', email: 'indra@softwarehouse.com', subject: 'Lowongan Tech Lead', message: 'Tim kami mencari Tech Lead untuk mengawasi proyek migrasi microservices.', is_read: false },
      { name: 'Joko Susilo', email: 'joko@ecommerce.com', subject: 'Kolaborasi Proyek E-Commerce', message: 'Tertarik untuk berkolaborasi mengembangkan platform e-commerce berbasis React dan Node.js.', is_read: false },
      { name: 'Kiki Amelia', email: 'kiki@agency.co.id', subject: 'Apresiasi Portofolio', message: 'Situs portofolio Anda sangat bagus dan responsif! Tertarik untuk bertukar pikiran.', is_read: false }
    ];
    await Contact.bulkCreate(contactsData);
    console.log('✓ 10 Contact messages created');

    console.log('\n🎉 ALL TABLES WIPED & SUCCESSFULLY POPULATED WITH 10 DUMMY RECORDS PER TABLE!');
    console.log(`   Admin Login: ${adminUsername} / ${adminPassword}`);
    process.exit(0);

  } catch (err) {
    console.error('❌ Reseed failed:', err);
    process.exit(1);
  }
}

seed10Dummy();
