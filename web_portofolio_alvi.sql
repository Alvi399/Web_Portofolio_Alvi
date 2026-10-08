-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 08 Okt 2026 pada 02.31
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_portofolio_alvi`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `issuer` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `credential_url` varchar(255) DEFAULT '',
  `image` varchar(255) DEFAULT '',
  `category` varchar(255) DEFAULT 'Other',
  `is_highlight` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `certificates`
--

INSERT INTO `certificates` (`id`, `title`, `issuer`, `date`, `credential_url`, `image`, `category`, `is_highlight`, `createdAt`, `updatedAt`) VALUES
(1, 'AWS Certified Developer - Associate (Page Edit Test)', 'Amazon Web Services', '2023-11-10', 'https://aws.amazon.com/certification', '', 'Backend', 0, '2026-10-07 23:58:22', '2026-10-08 00:22:46'),
(2, 'Node.js Application Developer (JSNAD)', 'OpenJS Foundation', '2023-08-20', 'https://openjsf.org', '', 'Backend', 1, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(3, 'Meta Front-End Developer Professional', 'Meta / Coursera', '2023-04-10', 'https://coursera.org', '', 'Frontend', 1, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(4, 'MySQL Database Administrator Certified', 'Oracle', '2022-12-05', 'https://oracle.com', '', 'Backend', 1, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(5, 'Docker Certified Associate (DCA)', 'Docker Inc', '2022-09-18', 'https://docker.com', '', 'Other', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(6, 'Professional Scrum Master I (PSM I)', 'Scrum.org', '2022-05-30', 'https://scrum.org', '', 'Other', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(7, 'JavaScript Specialist Certification', 'W3Schools', '2021-11-12', 'https://w3schools.com', '', 'Frontend', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(8, 'RESTful API Architecture & Security', 'Udemy', '2021-07-22', 'https://udemy.com', '', 'Backend', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(9, 'AI & Machine Learning Foundations', 'Google Cloud', '2021-03-14', 'https://cloud.google.com', '', 'AI', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(10, 'Cybersecurity & Web Defense Fundamentals', 'Cisco Networking Academy', '2020-10-01', 'https://netacad.com', '', 'Other', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT '',
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `is_read`, `createdAt`, `updatedAt`) VALUES
(1, 'Anita Wijaya', 'anita@company.com', 'Tawaran Kerjasama Full Stack Developer', 'Halo Alvi, kami tertarik dengan portofolio Anda dan ingin mendiskusikan peluang proyek Full Stack.', 1, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(2, 'Deni Kurniawan', 'deni@techcorp.com', 'Undangan Wawancara Senior Backend', 'Halo Alvi, tim kami ingin mengundang Anda untuk sesi wawancara teknis posisi Backend Engineer.', 1, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(3, 'Rina Sugiarto', 'rina@startup.io', 'Pertanyaan Konsultasi Web Architecture', 'Apakah Anda membuka layanan konsultasi untuk optimasi performa Node.js dan MySQL?', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(4, 'Fajar Nugraha', 'fajar@digital agency.com', 'Penawaran Freelance Web App', 'Kami membutuhkan pengembang web untuk membangun dashboard analitik skala menengah.', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(5, 'Maya Putri', 'maya@hrsolutions.id', 'Peluang Karir Remote Developer', 'Kami membuka lowongan Remote Full Stack Developer untuk klien Singapura.', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(6, 'Gita Prasetya', 'gita@edu.org', 'Undangan Pemateri Workshop Web Dev', 'Kami mengundang Anda menjadi pembicara dalam sesi workshop Node.js minggu depan.', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(7, 'Hadi Gunawan', 'hadi@fintech.id', 'Diskusi Integrasi Gateway Pembayaran', 'Kami tertarik dengan proyek payment gateway connector yang Anda buat.', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(8, 'Indra Perkasa', 'indra@softwarehouse.com', 'Lowongan Tech Lead', 'Tim kami mencari Tech Lead untuk mengawasi proyek migrasi microservices.', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(9, 'Joko Susilo', 'joko@ecommerce.com', 'Kolaborasi Proyek E-Commerce', 'Tertarik untuk berkolaborasi mengembangkan platform e-commerce berbasis React dan Node.js.', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(10, 'Kiki Amelia', 'kiki@agency.co.id', 'Apresiasi Portofolio', 'Situs portofolio Anda sangat bagus dan responsif! Tertarik untuk bertukar pikiran.', 0, '2026-10-07 23:58:22', '2026-10-07 23:58:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `event_type` varchar(50) NOT NULL,
  `target_id` varchar(100) DEFAULT NULL,
  `ip_hash` varchar(64) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `events`
--

INSERT INTO `events` (`id`, `event_type`, `target_id`, `ip_hash`, `user_agent`, `created_at`, `updated_at`) VALUES
(1, 'project_view', 'fintech-payment-gateway-connector', 'c43df4f9759f81e54d9c944b221774fa', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36 Edg/154.0.0.0', '2026-10-07 23:59:27', '2026-10-07 23:59:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `journey`
--

CREATE TABLE `journey` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT 0,
  `image` varchar(255) DEFAULT '',
  `category` varchar(255) DEFAULT 'experience',
  `title_en` varchar(255) DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `journey`
--

INSERT INTO `journey` (`id`, `title`, `description`, `date`, `end_date`, `is_current`, `image`, `category`, `title_en`, `description_en`, `createdAt`, `updatedAt`) VALUES
(1, 'Senior Full Stack Developer - TechNusantara', 'Updated via dedicated form test!', '2023-05-01', NULL, 0, '', 'experience', NULL, NULL, '2026-10-07 23:58:22', '2026-10-08 00:22:46'),
(2, 'Backend Web Engineer - Inovasi Solusi Digital', 'Mengembangkan RESTful API dengan Node.js dan MySQL, mengoptimalkan query database yang meningkatkan efisiensi sistem sebesar 35%.', '2021-06-01', '2022-12-31', 0, '', 'experience', NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(3, 'Junior Web Developer - Studio Kreatif Media', 'Membuat halaman web responsif dengan HTML, CSS, JavaScript, dan mengintegrasikan CMS untuk klien perbankan.', '2020-01-15', '2021-05-30', 0, '', 'experience', NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(4, 'Magang Software Engineer - PT Teknologi Bangsa', 'Membantu pembuatan komponen UI React dan pengujian otomatis API backend.', '2019-07-01', '2019-12-15', 0, '', 'experience', NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(5, 'Pendidikan S1 Teknik Informatika - Universitas Indonesia', 'Lulus dengan Predikat Cumlaude (IPK 3.82). Berfokus pada Rekayasa Perangkat Lunak dan Basis Data.', '2016-09-01', '2020-08-25', 0, '', 'education', NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(6, 'Bootcamp Full Stack Web Development - Hacktiv8', 'Pelatihan intensif 12 minggu mencakup JavaScript, Node.js, Express, React, dan MySQL.', '2020-09-01', '2020-12-20', 0, '', 'education', NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(7, 'Pelatihan Cloud Computing & AWS Architecture', 'Program sertifikasi arsitektur cloud dan deployment container Docker di AWS EC2 & RDS.', '2022-02-01', '2022-04-30', 0, '', 'education', NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(8, 'Sertifikasi Keahlian Software Engineering Specialist', 'Program pendalaman desain sistem terdistribusi, Clean Code, dan Design Patterns.', '2022-08-01', '2022-10-15', 0, '', 'education', NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(9, 'Workshop Modern Microservices & Event-Driven Architecture', 'Studi mendalam mengenai arsitektur Kafka, RabbitMQ, dan Node.js event loops.', '2023-03-10', '2023-03-25', 0, '', 'education', NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(10, 'SMA Negeri 1 Jakarta - Jurusan IPA', 'Lulus dengan nilai sains terbaik dan aktif di klub Pemrograman Komputer.', '2013-07-01', '2016-06-15', 0, '', 'education', NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `profiles`
--

CREATE TABLE `profiles` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `display_name` varchar(40) DEFAULT 'Malvix',
  `tagline` varchar(255) DEFAULT '',
  `bio` text DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT '',
  `email` varchar(255) DEFAULT '',
  `phone` varchar(255) DEFAULT '',
  `location` varchar(255) DEFAULT '',
  `github_url` varchar(255) DEFAULT '',
  `linkedin_url` varchar(255) DEFAULT '',
  `resume_url` varchar(255) DEFAULT '',
  `resume_file` varchar(255) DEFAULT NULL,
  `headline` varchar(120) DEFAULT NULL,
  `availability_status` enum('open_to_work','freelance','not_available') NOT NULL DEFAULT 'open_to_work',
  `work_preference` varchar(60) DEFAULT NULL,
  `whatsapp` varchar(30) DEFAULT NULL,
  `og_image` varchar(255) DEFAULT NULL,
  `about_summary` text DEFAULT NULL,
  `looking_for` text DEFAULT NULL,
  `bio_en` text DEFAULT NULL,
  `about_summary_en` text DEFAULT NULL,
  `headline_en` varchar(120) DEFAULT NULL,
  `work_preference_en` varchar(60) DEFAULT NULL,
  `looking_for_en` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `profiles`
--

INSERT INTO `profiles` (`id`, `full_name`, `display_name`, `tagline`, `bio`, `profile_image`, `email`, `phone`, `location`, `github_url`, `linkedin_url`, `resume_url`, `resume_file`, `headline`, `availability_status`, `work_preference`, `whatsapp`, `og_image`, `about_summary`, `looking_for`, `bio_en`, `about_summary_en`, `headline_en`, `work_preference_en`, `looking_for_en`, `createdAt`, `updatedAt`) VALUES
(1, 'Muhammad Alvi Kirana Zulfan Nazal', 'Alvi Kirana', 'Senior Full Stack Web Developer & Software Engineer', 'Loves building clean software architecture, optimizing MySQL database queries, and creating intuitive user experiences.', '/uploads/1791418441361-535846251.jpg', 'alvikirana@gmail.com', '+6281234567890', 'Jakarta, Indonesia', 'https://github.com/Alvi399', 'https://linkedin.com/in/alvi', '', NULL, 'Full Stack Web Developer', 'open_to_work', 'Hybrid / Remote', '6281234567890', NULL, 'Experienced Full Stack Developer with over 4 years of expertise in building high-performance web applications, scalable backend microservices, and modern responsive user interfaces. Proven track record of delivering cloud-native solutions that serve over 100,000 active users with 99.9% uptime.', 'Full-time Full Stack Web Developer or Senior Backend Engineer roles', NULL, NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-08 00:14:01');

-- --------------------------------------------------------

--
-- Struktur dari tabel `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT '',
  `technologies` text DEFAULT NULL,
  `project_url` varchar(255) DEFAULT '',
  `github_url` varchar(255) DEFAULT '',
  `github_repo_name` varchar(255) DEFAULT '',
  `stars` int(11) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `problem` text DEFAULT NULL,
  `role` varchar(120) DEFAULT NULL,
  `impact` text DEFAULT NULL,
  `demo_url` varchar(255) DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'published',
  `description_en` text DEFAULT NULL,
  `problem_en` text DEFAULT NULL,
  `role_en` varchar(120) DEFAULT NULL,
  `impact_en` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `projects`
--

INSERT INTO `projects` (`id`, `title`, `slug`, `description`, `image`, `technologies`, `project_url`, `github_url`, `github_repo_name`, `stars`, `is_featured`, `sort_order`, `problem`, `role`, `impact`, `demo_url`, `status`, `description_en`, `problem_en`, `role_en`, `impact_en`, `createdAt`, `updatedAt`) VALUES
(1, 'E-Commerce Microservices Engine', 'e-commerce-microservices-engine', 'Membangun platform e-commerce berbasis microservices dengan arsitektur REST API berkinerja tinggi.', '', '[\"Node.js\",\"Express\",\"MySQL\",\"Docker\",\"Redis\"]', 'https://example.com/ecommerce', 'https://github.com/Alvi399/ecommerce-engine', '', 0, 1, 1, 'Sistem monolithic lama mengalami bottleneck saat kilat promo (flash sale) melayani lebih dari 20,000 pengguna bersamaan.', 'Lead Backend Engineer', 'Mengurangi waktu muat server hingga 45% dan meningkatkan throughput checkout sebesar 300%.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(2, 'Real-time Analytics Dashboard', 'realtime-analytics-dashboard', 'Merancang dashboard analitik real-time yang memvisualisasikan matriks traffic dan konversi penjualan.', '', '[\"React\",\"Node.js\",\"Chart.js\",\"MySQL\"]', 'https://example.com/analytics', 'https://github.com/Alvi399/analytics-dashboard', '', 0, 1, 2, 'Tim bisnis memerlukan pemantauan penjualan secara real-time tanpa membebani database utama.', 'Full Stack Developer', 'Menghemat biaya server sebesar 30% dan memberikan wawasan statistik dengan latency kurang dari 100ms.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(3, 'Smart Task & Project Manager', 'smart-task-project-manager', 'Mengembangkan aplikasi manajemen tugas kolaboratif dengan papan Kanban dan pengingat otomatis.', '', '[\"Vue.js\",\"Express\",\"MySQL\",\"TailwindCSS\"]', 'https://example.com/taskmanager', 'https://github.com/Alvi399/task-manager', '', 0, 1, 3, 'Kurangnya alur kerja terpusat untuk tim pengembang jarak jauh dalam mengelola tugas sprint.', 'Full Stack Engineer', 'Meningkatkan produktivitas tim sebesar 25% dan menyelesaikan 500+ sprint task secara efisien.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(4, 'AI Resume & Portfolio Builder', 'ai-resume-portfolio-builder', 'Membuat generator CV berstandar ATS otomatis berbasis AI yang mengukur kelayakan dokumen secara instan.', '', '[\"Node.js\",\"Express\",\"EJS\",\"Sequelize\",\"MySQL\"]', 'https://example.com/cvbuilder', 'https://github.com/Alvi399/cv-builder', '', 0, 0, 4, 'Banyak pelamar kerja mengalami kesulitan dalam menyusun format CV yang terbaca oleh sistem ATS.', 'Lead Software Architect', 'Meningkatkan skor kelulusan ATS pengguna sebesar 40% dan telah dipakai oleh 5,000+ pengguna.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(5, 'Fintech Payment Gateway Connector', 'fintech-payment-gateway-connector', 'Mengintegrasikan berbagai sistem gateway pembayaran lokal dan internasional dengan standar keamanan tinggi.', '', '[\"Node.js\",\"Express\",\"MySQL\",\"Midtrans API\"]', 'https://example.com/payment', 'https://github.com/Alvi399/payment-connector', '', 0, 0, 5, 'Tingginya kegagalan transaksi pembayaran akibat ketidakstabilan webhook penyedia lama.', 'Backend Developer', 'Berhasil memproses transaksi senilai Rp 2 Miliar dengan sukses rate 99.8%.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(6, 'Hospital Management Information System', 'hospital-management-info-system', 'Membangun sistem informasi manajemen rumah sakit untuk otomatisasi pendaftaran dan rekam medis digital.', '', '[\"PHP\",\"Laravel\",\"MySQL\",\"Bootstrap\"]', 'https://example.com/simrs', 'https://github.com/Alvi399/simrs-app', '', 0, 0, 6, 'Proses antrean fisik pasien yang memakan waktu hingga 2 jam setiap pagi.', 'Full Stack Engineer', 'Memotong waktu tunggu pasien sebesar 60% dan mengdigitalisasi 10,000+ data rekam medis.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(7, 'Cloud Inventory & Warehouse App', 'cloud-inventory-warehouse-app', 'Mengembangkan sistem inventaris stok pergudangan otomatis dengan barcode scanner integration.', '', '[\"Node.js\",\"MySQL\",\"Express\",\"REST API\"]', 'https://example.com/inventory', 'https://github.com/Alvi399/inventory-app', '', 0, 0, 7, 'Sering terjadi kejanggalan selisih stok fisik akibat pencatatan manual di spreadsheet.', 'Backend Developer', 'Mencapai akurasi stok 99.9% dan mempercepat proses opname dari 3 hari menjadi 4 jam.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(8, 'Learning Management System (LMS)', 'learning-management-system-lms', 'Membuat platform pembelajaran jarak jauh interaktif dengan materi video streaming dan kuis online.', '', '[\"React\",\"Node.js\",\"Express\",\"MySQL\"]', 'https://example.com/lms', 'https://github.com/Alvi399/lms-platform', '', 0, 0, 8, 'Institusi memerlukan platform edukasi mandiri yang hemat bandwidth.', 'Full Stack Developer', 'Diakses oleh 8,000 siswa aktif dengan konsumsi bandwidth 50% lebih hemat.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(9, 'Corporate Portal & CMS Engine', 'corporate-portal-cms-engine', 'Mendesain portal perusahaan profesional dengan sistem CMS dinamis berbasis role-based access control.', '', '[\"HTML5\",\"CSS3\",\"JavaScript\",\"Node.js\",\"MySQL\"]', 'https://example.com/portal', 'https://github.com/Alvi399/corporate-cms', '', 0, 0, 9, 'Perusahaan kesulitan memperbarui informasi situs utama tanpa bantuan developer.', 'Frontend & CMS Developer', 'Memungkinkan tim marketing menerbitkan 50+ artikel berita per bulan secara mandiri.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(10, 'API Gateway & Rate Limiter Service', 'api-gateway-rate-limiter-service', 'Menerapkan middleware API Gateway berkinerja tinggi untuk proteksi rate limiting dan autentikasi JWT.', '', '[\"Node.js\",\"Express\",\"Helmet\",\"Express-Rate-Limit\"]', 'https://example.com/gateway', 'https://github.com/Alvi399/api-gateway', '', 0, 0, 10, 'Serangan DDoS ringan yang sering menyebabkan degradasi server publik.', 'DevOps & Backend Engineer', 'Menolak 100% serangan spam traffic berlebih tanpa mengganggu pengguna sah.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(11, 'Project from MCP Agent', 'project-from-mcp-agent', 'This project was added dynamically by an AI Agent testing the MCP integration.', '', '[\"Node.js\",\"MCP\",\"AI\"]', '', '', '', 0, 0, 0, '', 'MCP Tester', 'Proves that the AI can act as an MCP client and insert data securely.', NULL, 'published', NULL, NULL, NULL, NULL, '2026-10-08 00:08:21', '2026-10-08 00:08:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sessions`
--

INSERT INTO `sessions` (`sid`, `expires`, `data`, `createdAt`, `updatedAt`) VALUES
('2tsN-ITJ1zCCgc4WQA2UTLW6T2a40FBb', '2026-10-08 23:58:30', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:58:30.842Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"d30a86e5fa6c3438dd6175319b15f5f7db811acd2b2c52e5\"}', '2026-10-07 23:58:30', '2026-10-07 23:58:30'),
('3lzg7r6qyRAr-LyupsOT0vwZ5xf3TVwo', '2026-10-08 16:19:58', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T16:19:58.010Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"0e0cb50cb799785b7e78cfc420ec39740daad22f8533fc80\"}', '2026-10-07 16:19:58', '2026-10-07 16:19:58'),
('4Pi4zhweEO_6WBo4MCSTtNNeMybT_2Eb', '2026-10-09 00:04:29', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:04:29.122Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"7d3cc096f040e847eac6b2255705a549fb13a506bc27ebe4\"}', '2026-10-08 00:04:29', '2026-10-08 00:04:29'),
('7jQKVAUMW7aKhr237nQcySANWuDoxMF6', '2026-10-08 23:58:30', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:58:30.813Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"055cc855822fe1aae09b1edebe8f15c4267307dbd4b87564\"}', '2026-10-07 23:58:30', '2026-10-07 23:58:30'),
('81BmyfS1I_ORF9H-PsOkuja2C58VP5LK', '2026-10-08 23:58:30', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:58:30.765Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"b3d12857d4d3ab7a7b20c081a5256149e9b06e49c1f3e9b3\"}', '2026-10-07 23:58:30', '2026-10-07 23:58:30'),
('8hXJII-TEE11u7LB_2fpHZIXgvyQZ5Vq', '2026-10-09 00:04:29', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:04:29.149Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"292c5694e4af7be163e7b42840384a825044bde1de8089be\"}', '2026-10-08 00:04:29', '2026-10-08 00:04:29'),
('BDG5P1ZflNDlvOfBxuRH6iQZfvOYxQJg', '2026-10-09 00:04:29', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:04:29.097Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"479902a3e2dcf79687e3a965ab2b3c3ed1c07b588c6ecdcf\"}', '2026-10-08 00:04:29', '2026-10-08 00:04:29'),
('bPY5Lwb-9k_-g5q_4W0QUyX8IeMIjWun', '2026-10-08 23:58:30', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:58:30.830Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"341c809fa109c2633fd3508ded9c5f48aafbc63e23d1093b\"}', '2026-10-07 23:58:30', '2026-10-07 23:58:30'),
('CPezh5Zas2nXvgoNj0-j0OblTQjU20EU', '2026-10-08 23:58:30', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:58:30.693Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"dcca0206ff5d6aca255489e5c2ef506ec4d7b3a290a21f0f\"}', '2026-10-07 23:58:30', '2026-10-07 23:58:30'),
('CWUhQAYzHhNTxaxjz5SFC7uGh2-DYgEq', '2026-10-08 16:37:58', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T16:37:58.379Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":1,\"username\":\"admin\",\"csrfToken\":\"a11ff937a16ff7ef3f0087ddc5175fdf016118b0b39a502b\",\"flash\":{\"success\":[\"Skill \\\"JavaScript\\\" berhasil diperbarui di database!\"]}}', '2026-10-07 16:37:58', '2026-10-07 16:37:58'),
('eQmfU0YNBmwS7km487ETCbDIUZj4iAFx', '2026-10-09 00:18:40', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:18:40.856Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"891b8a49aae4a0de6c73cc96d70cf5bb45f21d2355636bc5\"}', '2026-10-08 00:18:40', '2026-10-08 00:18:40'),
('f4jaJi1cf-neKkKWBaBo373e0j2n__90', '2026-10-08 23:42:43', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:42:43.109Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"073e00795965bde5ea7318135b9c5904e60663245517e3da\",\"flash\":{}}', '2026-10-07 23:42:43', '2026-10-07 23:42:43'),
('fk9_4u7gJkyy9geEG0PixcDC6ZBj1kUi', '2026-10-08 23:58:30', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:58:30.738Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"40106810944cef9dcd10cca8c3bf6e6b172148a64c501bfc\"}', '2026-10-07 23:58:30', '2026-10-07 23:58:30'),
('GsHlbgwG2I2MXNJWBqDmlnt3iVOt908J', '2026-10-08 16:21:49', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T16:21:49.183Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"9c7696b4fe787a22a15267160647282dbb9e064caaf8ebd0\"}', '2026-10-07 16:21:49', '2026-10-07 16:21:49'),
('HA-LyyR4bu0gEKhOL5oeetv_nFQxd4I0', '2026-10-09 00:08:37', '{\"cookie\":{\"originalMaxAge\":86399999,\"expires\":\"2026-10-09T00:08:37.129Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"eb0cc54714e918177c134079336a571f56d94e8f0d841cd0\"}', '2026-10-08 00:08:37', '2026-10-08 00:08:37'),
('hoXoL1SkQmmaIwlZ35Rh0rpkDbZeTHeN', '2026-10-09 00:18:40', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:18:40.820Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"866cefb2796f6eddf1a04683614ea10827f3d2653fc3a851\"}', '2026-10-08 00:18:40', '2026-10-08 00:18:40'),
('imPOUXDKTccD76PU57ntq7g7sOSZmRI2', '2026-10-09 00:26:47', '{\"cookie\":{\"originalMaxAge\":86399999,\"expires\":\"2026-10-09T00:14:01.507Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":1,\"username\":\"admin\",\"csrfToken\":\"65b5f8d43f3420d39edd157a3f1481103a09267c85ede495\",\"flash\":{}}', '2026-10-07 23:48:11', '2026-10-08 00:26:47'),
('iqOFfn0nctBsuMPcBcRzHC_T4ul7Te3G', '2026-10-08 23:42:43', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:42:43.173Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"420a445e2687982a515e05b248501e2362565249e5b88b35\"}', '2026-10-07 23:42:43', '2026-10-07 23:42:43'),
('iqs7yTU8obXudpTWww3RBx68KwlU0fkN', '2026-10-08 23:42:43', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:42:43.083Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"1694e690dadda0543b1ef8319f5be99705cfdbb8cadc8f90\"}', '2026-10-07 23:42:43', '2026-10-07 23:42:43'),
('IT-ZEWqZTUII3yn-KDhWgZRHSgqL0PbS', '2026-10-09 00:04:29', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:04:29.053Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"f576b866bbdbef7f7c95de8ad0b33079785bb087887efd29\"}', '2026-10-08 00:04:29', '2026-10-08 00:04:29'),
('iyadUynf5yNqQxfKTbCFzVaGL9d7_OiU', '2026-10-08 16:26:46', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T16:26:46.174Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":1,\"username\":\"admin\",\"csrfToken\":\"bd68fabfb0f808e6ad2ff87bfe302a27fbe9c9965473e2b1\",\"flash\":{\"success\":[\"Testimonial dari \\\"Budi Santoso\\\" berhasil diperbarui di database!\"]}}', '2026-10-07 16:26:46', '2026-10-07 16:26:46'),
('JeNQ_FRnBtCFkPr3oIXdWWkuV6UeoS-y', '2026-10-09 00:04:29', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:04:29.188Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"4901d05c55c44d2ea7dbdf4854ff3f0bcf399b4aa8dee487\"}', '2026-10-08 00:04:29', '2026-10-08 00:04:29'),
('KCRFZ1FtqRGnUYLjIk1ad9PAkYVuXWDi', '2026-10-09 00:04:29', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:04:29.226Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"6bca919e8b6851d5579522ee9f91cbc24ba12af7e4a508f2\"}', '2026-10-08 00:04:29', '2026-10-08 00:04:29'),
('kwztvV3TEP9GZOg8Xg0xPeLW296Qdu2O', '2026-10-09 00:04:29', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:04:29.075Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"53148c7ea17d8d17d88785f8a73272fd1cb9202d783fc0ba\"}', '2026-10-08 00:04:29', '2026-10-08 00:04:29'),
('leexuj3fdZG_VTqpOyj6M03ZxDGsYdu9', '2026-10-08 23:42:43', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:42:43.207Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"ac9c0ca95bab0ad8757beb649b584968191833d791fe0391\"}', '2026-10-07 23:42:43', '2026-10-07 23:42:43'),
('NlxxBlZW69biLCDH3x22aYffwV8_SSN_', '2026-10-08 16:26:00', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T16:26:00.908Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":1,\"username\":\"admin\",\"csrfToken\":\"7ba60cbc6070f3b5ff5718bd0eb312451ac452a40ad0dd4a\",\"flash\":{\"success\":[\"Journey \\\"Fullstack Web Developer (HTTP Test)\\\" berhasil diperbarui di database!\"]}}', '2026-10-07 16:26:00', '2026-10-07 16:26:00'),
('nVW-3n_ubTjdsIt_25tGISr1Ip8cWXRt', '2026-10-08 16:22:24', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T16:22:24.311Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":1,\"username\":\"admin\",\"csrfToken\":\"bc133a4a7e91b47b85b9ae0a33a760ecc1e9ac4c4d722740\",\"flash\":{\"success\":[\"Journey \\\"Fullstack Web Developer (HTTP Test)\\\" berhasil diperbarui di database!\"]}}', '2026-10-07 16:22:24', '2026-10-07 16:22:24'),
('oLJrC--IPmqNBs2JoCjiD_YmnlV7PUg_', '2026-10-09 00:19:03', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:19:03.821Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"600224b64858ddbee3445a0ea959ea5eb8b5528954cee56e\",\"flash\":{\"success\":[\"Terima kasih banyak! Testimoni & rekomendasi Anda berhasil dikirim dan terintegrasi langsung dengan portofolio.\"]}}', '2026-10-08 00:19:03', '2026-10-08 00:19:03'),
('qe1ZyeNnS8wEig9rcxon5En6CP4Q5xUY', '2026-10-08 23:42:43', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:42:43.027Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"cde52e902d2007553d08e4b1f8363aa35b7856e27fbc1b48\"}', '2026-10-07 23:42:43', '2026-10-07 23:42:43'),
('qIfq66XfsVn0W2ls58x0E_POOvxXrGFr', '2026-10-08 23:58:30', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:58:30.753Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"be960b52fa8a292f866c584cf598480e58e71089685bb60f\"}', '2026-10-07 23:58:30', '2026-10-07 23:58:30'),
('qsCXzKw16WyAlSW_OjKyYpn-fwLu14ef', '2026-10-08 23:42:42', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:42:42.918Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"d7f8b999cb95e9474d81137fcd28fd3dc1f016e3ceb38ac3\"}', '2026-10-07 23:42:42', '2026-10-07 23:42:42'),
('qxS1K-0FGySiuMaY4-aK0XTM-bY6YV4H', '2026-10-08 23:58:30', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:58:30.855Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"a16cb32f5d71f7bb4a967783a2cc00ff151c788acc6b5c18\"}', '2026-10-07 23:58:30', '2026-10-07 23:58:30'),
('r9xm7_HnISGv3zsi4sa9wFr1ZJu6XWB1', '2026-10-09 00:19:03', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:19:03.750Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"064a6d216a30079d452ef7a1fe172bd7f4fc256177e72b1d\"}', '2026-10-08 00:19:03', '2026-10-08 00:19:03'),
('rI0y8paCyAxAsDdw-UhEMcVHC5eVpiEi', '2026-10-08 23:58:30', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:58:30.578Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"f6afb1c3a6f1298259359b2654519da123465e95bc046dfc\"}', '2026-10-07 23:58:30', '2026-10-07 23:58:30'),
('SbJldksu2_yUSJpFazYTwMVpu8cZ0uX7', '2026-10-08 23:42:43', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:42:43.156Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"44b9a522a2ff76e0d31e39aa55a1974d250b10b8fe2cd607\"}', '2026-10-07 23:42:43', '2026-10-07 23:42:43'),
('sbZ3yGl1th1MFKCTCaHjA0_gfocl-e58', '2026-10-09 00:04:29', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:04:29.006Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"e60d7b3cd3390881fd22e1fad6193d2271fbb6a1e03d8bb6\"}', '2026-10-08 00:04:29', '2026-10-08 00:04:29'),
('srtuyqQe205xITyZFxvc1MSYT3RhCR9O', '2026-10-08 23:42:43', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:42:43.189Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"38c14eda91e220fd0f43f9db6ce695e0094027c7585b5395\"}', '2026-10-07 23:42:43', '2026-10-07 23:42:43'),
('TF56HU2qipV73EaIeoM1N50fzr8hp2UQ', '2026-10-08 23:58:30', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:58:30.642Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"43755f98d4cda34229d8716ef3d13cec4d06726a66e844e8\"}', '2026-10-07 23:58:30', '2026-10-07 23:58:30'),
('wtEk94o6mp8LN3rw2-pXPHq8sjimOXGn', '2026-10-09 00:18:40', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:18:40.776Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"5d24a08b8c1d740ff33f6d827b09ce95d94755f96cc772f9\",\"flash\":{}}', '2026-10-08 00:18:40', '2026-10-08 00:18:40'),
('wUPDd64D85S6-M0MkI9SUiZNayDCAkeA', '2026-10-09 00:22:46', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-09T00:22:46.260Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":1,\"username\":\"admin\",\"csrfToken\":\"9188c165843a4498fba9f71c296e5c5f01a0c1c8d09b603a\",\"flash\":{\"success\":[\"Skill \\\"JavaScript (ES6+)\\\" berhasil diperbarui di database!\"]}}', '2026-10-08 00:22:45', '2026-10-08 00:22:46'),
('WvWjURDKBf0q1fYEBtoIyPTL7yDal_4U', '2026-10-08 23:42:43', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:42:43.055Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"e5b0cb2f42be755364d4036286140c428509a9d54bf24a02\"}', '2026-10-07 23:42:43', '2026-10-07 23:42:43'),
('Z0yKHIpJlcKbAgCIwIcFiS-4fIgY2yET', '2026-10-08 23:42:42', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T23:42:42.985Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"47d4804e5b2fe7f71909242937bed1473d6cc71bf2c78d03\"}', '2026-10-07 23:42:42', '2026-10-07 23:42:42'),
('zNATppxt4PZe35enDW0TPY9hDo6KZO-D', '2026-10-08 23:42:52', '{\"cookie\":{\"originalMaxAge\":86399999,\"expires\":\"2026-10-08T23:42:52.256Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"userId\":1,\"username\":\"admin\",\"csrfToken\":\"1b13621b51727d31d43949ed7b78ab57742c5961eeb4cd85\",\"flash\":{\"success\":[\"Skill \\\"JavaScript\\\" berhasil diperbarui di database!\"]}}', '2026-10-07 23:42:51', '2026-10-07 23:42:52'),
('_Td-P1ofE_TaCkqiHRF9aqvr565AidAH', '2026-10-08 16:21:49', '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2026-10-08T16:21:49.330Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\",\"sameSite\":\"lax\"},\"csrfToken\":\"7f88ca9e721016c1e3943670261bf6c06e06dd70bdf1a688\",\"flash\":{}}', '2026-10-07 16:21:49', '2026-10-07 16:21:49');

-- --------------------------------------------------------

--
-- Struktur dari tabel `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT 'General',
  `proficiency` int(11) DEFAULT 50,
  `icon` varchar(255) DEFAULT '',
  `image` varchar(255) DEFAULT '',
  `sort_order` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `skills`
--

INSERT INTO `skills` (`id`, `name`, `category`, `proficiency`, `icon`, `image`, `sort_order`, `createdAt`, `updatedAt`) VALUES
(1, 'JavaScript (ES6+)', 'Frontend', 95, '⚡', '', 1, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(2, 'React.js', 'Frontend', 90, '⚛️', '', 2, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(3, 'Vue.js', 'Frontend', 85, '💚', '', 3, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(4, 'Node.js', 'Backend', 92, '🟢', '', 4, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(5, 'Express.js', 'Backend', 90, '🚀', '', 5, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(6, 'MySQL & Sequelize', 'Database', 88, '🗄️', '', 6, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(7, 'Docker & Git', 'Tools', 85, '🐳', '', 7, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(8, 'Problem Solving & Analytics', 'Soft Skills', 95, '🧠', '', 8, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(9, 'Team Leadership & Collaboration', 'Soft Skills', 90, '👥', '', 9, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(10, 'Time Management & Agile / Scrum', 'Soft Skills', 90, '⏱️', '', 10, '2026-10-07 23:58:22', '2026-10-07 23:58:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `quote` text NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `is_visible` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `testimonials`
--

INSERT INTO `testimonials` (`id`, `name`, `position`, `company`, `quote`, `photo`, `is_visible`, `sort_order`, `createdAt`, `updatedAt`) VALUES
(1, 'Budi Santoso', 'CTO', 'TechNusantara', 'Great developer!', NULL, 0, 1, '2026-10-07 23:58:22', '2026-10-08 00:22:46'),
(2, 'Siti Rahmawati', 'Product Manager', 'Inovasi Solusi Digital', 'Sangat profesional dan selalu menyampaikan proyek tepat waktu dengan kualitas kode yang luar biasa.', NULL, 1, 2, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(3, 'Rian Hidayat', 'VP of Engineering', 'Kreatif Media Studio', 'Eksekusi teknis Alvi dalam memecahkan masalah sistem berjalan sangat cepat dan efektif.', NULL, 1, 3, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(4, 'Dewi Lestari', 'Lead UI/UX Designer', 'Digital Craft', 'Bekerja bersama Alvi sangat menyenangkan. Dia sangat paham bagaimana menerjemahkan desain menjadi kode web yang presisi.', NULL, 1, 4, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(5, 'Ahmad Fauzi', 'Senior Backend Developer', 'TechNusantara', 'Pengetahuan Alvi mengenai optimasi database MySQL dan Node.js sangat membantu tim backend.', NULL, 1, 5, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(6, 'Linda Permata', 'HR Manager', 'Inovasi Solusi Digital', 'Alvi memiliki komunikasi dan etos kerja yang hebat. Selalu siap membantu rekan satu tim.', NULL, 1, 6, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(7, 'Eko Prasetyo', 'Co-Founder', 'Fintech Utama', 'Integrasi payment gateway buatan Alvi terbukti sangat stabil tanpa ada kendala transaksi.', NULL, 1, 7, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(8, 'Maya Indah', 'Project Lead', 'Simrs App Project', 'Proyek sistem informasi rumah sakit diselesaikan dengan tingkat akurasi data yang sangat memuaskan.', NULL, 1, 8, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(9, 'Hendra Wijaya', 'Head of Operations', 'Cloud Warehouse', 'Sistem inventaris baru yang dibangun Alvi memotong waktu kerja kami hingga 60%. Luar biasa!', NULL, 1, 9, '2026-10-07 23:58:22', '2026-10-07 23:58:22'),
(10, 'Bambang Triyono', 'Lead Architect', 'Software Nusantara', 'Alvi adalah tipe insinyur yang tidak hanya paham kode, tetapi juga paham dampak bisnis dari produk yang dibangun.', NULL, 1, 10, '2026-10-07 23:58:22', '2026-10-07 23:58:22');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'admin@example.com', '$2b$10$7yLscuokQcmV5sG/Y2mrR.J77c4tEvikMl/oRqnlOmgL8bVDZmAXu', '2026-10-07 23:58:22', '2026-10-07 23:58:22');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `journey`
--
ALTER TABLE `journey`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `slug_2` (`slug`);

--
-- Indeks untuk tabel `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`);

--
-- Indeks untuk tabel `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `journey`
--
ALTER TABLE `journey`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `profiles`
--
ALTER TABLE `profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
