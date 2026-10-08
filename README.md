# 🚀 Web Portofolio Alvi (Malvix) & Hosted MCP Server

Website portofolio pribadi & profesional modern yang dibangun menggunakan **Node.js (Express 5)**, **EJS Layouts**, **Sequelize ORM**, dan **MySQL/MariaDB**. Dilengkapi dengan **Hosted Model Context Protocol (MCP) Server v1.3.0**, **Formulir Rekomendasi Testimoni Publik**, **ATS CV Scoring Engine**, **Dukungan Dua Bahasa (IND/ENG)**, **Admin Panel**, serta keamanan berlapis tingkat produksi (SSRF Proxy Hardening, CSRF Token, Rate Limiting, Helmet CSP).

---

## 🌟 Fitur Utama Aplikasi

### 🤖 1. Integrated Model Context Protocol (MCP Server v1.3.0)
* **Dual Transport**: Menudukung transport lokal **`stdio`** (`mcp.js`) dan remote hosted **`HTTP/SSE`** (`/sse` & `/api/mcp/message`).
* **Remote AI Agent Ready**: Memungkinkan AI Client (Claude Desktop, Cursor, Windsurf, Roo Code, dll.) mengelola seluruh data portofolio dari perangkat lain.
* **MCP Tools Registry**: Tool CRUD lengkap untuk Projects, Certificates, Journey, Skills, Testimonials, & Profile dengan dukungan unggah gambar Base64.
* **Dokumentasi Lengkap**: Tersedia di [`mcp_use.md`](mcp_use.md).

### 📊 2. Dynamic ATS CV Scoring Engine
* **Akurasi Pengukuran 100%**: Evaluasi CV otomatis berbasis 16 parameter ATS (*Applicant Tracking System*).
* **Penilaian Komprehensif**: Mengukur kata kunci teknis & soft skill, ringkasan profesional (40-120 kata), metrik terukur (%/angka), kata kerja aktif, breakdown proyek (*Problem/Role/Impact*), sertifikasi, dan total panjang CV (250-800 kata).
* **Download CV Multi-Format**: HRD dapat mengunduh CV PDF resmi atau CV Teks terformat (`/resume` & `/cv.txt`).

### 💬 3. Public Testimonial Submission Form (`/testimonial`)
* **Shareable Link untuk Pembimbing & Klien**: Halaman publik khusus bagi Pembimbing Magang, Atasan, Rekan Kerja, atau Klien untuk memberikan ulasan & rekomendasi profesional secara langsung.
* **Integrasi Otomatis**: Testimoni yang dikirim langsung tersimpan di database dan tampil di beranda portofolio.
* **Fitur Form**: Upload avatar foto profil (dengan instant preview), seleksi hubungan kerja, proteksi `testimonialLimiter` anti-spam, dan otentikasi CSRF.
* **Shareable Admin Link**: Tombol `🔗 Public Form Link` pada Admin Panel (`/admin/testimonials`) untuk kemudahan berbagi link.

### 🌐 4. Public Pages & Halaman Utama
* **Hero & Status Ketersediaan**: Tampilan status kerja (*Open to Work* / *Freelance*), lokasi, headline, dan chip keahlian utama.
* **Featured Projects (`/projects` & `/projects/:slug`)**: Showcase proyek berorientasi dampak dengan narasi bercerita (Problem, Role, Impact, Tech Stack, Kode, & Live Demo).
* **Interactive Certifications (`/certificates`)**: Filter sertifikat interaktif (Backend, Frontend, AI, Other) & sorotan (*Highlight*).
* **Journey Timeline (`/journey`)**: Timeline perjalanan karir dan pendidikan.
* **Dukungan Dua Bahasa (IND/ENG)**: Ganti bahasa secara instan di navbar (`?lang=id` / `?lang=en`).
* **Contact Form (`/contact`)**: Formulir kontak anti-spam (Honeypot + Rate Limit) dengan notifikasi email.
* **SEO & OpenGraph**: Meta tag OG lengkap, JSON-LD `Person`, `robots.txt`, dan `sitemap.xml`.

### ⚡ 5. Admin Panel & Manajemen Content (`/admin`)
* **Dashboard Statistik**: Overview jumlah data project, skill, pesan kontak, sertifikat, journey, dan testimoni.
* **GitHub Repository Import**: Impor repositori publik dari API GitHub secara otomatis menjadi draft proyek.
* **Manajemen Konten Lengkap**: Kelola Project (Draft/Published), Skills, Certificates, Journey, Testimonials, & Profile.

### 🛡️ 6. Keamanan & Performa Produksi
* **SSRF Proxy Hardening (`/api/image-proxy`)**: Strict domain whitelist & pemblokiran IP privat/loopback resolution.
* **CSRF Protection**: Token verifikasi pada semua bentuk request POST/PUT/DELETE.
* **Rate Limiting**: Proteksi brute-force login (`loginLimiter`), submit kontak (`contactLimiter`), proxy (`proxyLimiter`), dan testimoni (`testimonialLimiter`).
* **Security Headers (`helmet`)**: Dynamic Content Security Policy (CSP) & cookie flags (`HttpOnly; SameSite=Lax`).

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Runtime** | Node.js (v18+ / v20 LTS / v22 LTS) |
| **Framework** | Express 5.x |
| **View Engine** | EJS 4 + `express-ejs-layouts` |
| **Database** | MySQL / MariaDB + Sequelize ORM 6 |
| **Protocol** | Model Context Protocol (MCP v1.3.0) via `stdio` & `SSE` |
| **Security** | Helmet, CSRF, Express Rate Limit, BcryptJS |
| **File Upload** | Multer 2 (dengan magic bytes validation) |
| **Testing** | Jest + Supertest |

---

## 💻 Cara Instalasi & Mengoperasikan Lokal

### 1. Clone & Instal Dependensi
```bash
git clone https://github.com/Alvi399/Web_Portofolio_Alvi.git
cd Web_Portofolio_Alvi
npm install
```

### 2. Konfigurasi Environment (`.env`)
Salin `.env.example` menjadi `.env` dan sesuaikan kredensial MySQL lokal Anda:
```bash
cp .env.example .env
```

### 3. Inisialisasi Database & Reseed Dummy Data
Jalankan skrip seeder untuk mengisi database secara otomatis dengan 10 data sampel per tabel:
```bash
node seeders/seed_dummy_10.js
```

### 4. Menjalankan Aplikasi
* **Development Mode (dengan Hot Reload):**
  ```bash
  npm run dev
  ```
* **Production Mode:**
  ```bash
  npm start
  ```

Akses web di browser: `http://localhost:3005`.

---

## 🤖 Mengoperasikan MCP Server

### 1. Transport Lokal (`stdio`)
```bash
node mcp.js
```

### 2. Transport Remote (`HTTP/SSE`)
Server MCP otomatis aktif bersamaan dengan aplikasi web pada endpoint:
* **SSE Endpoint**: `http://localhost:3005/sse`
* **POST Message**: `http://localhost:3005/api/mcp/message`

*Untuk panduan konfigurasi AI Client (Claude Desktop, Cursor, Windsurf, dll.), baca [mcp_use.md](mcp_use.md).*

---

## 🖥️ Panduan Hosting di Debian Server

Untuk melakukan deployment ke server Linux berbasis **Debian (Debian 11 / 12)** menggunakan **PM2**, **Nginx Reverse Proxy (SSE Supported)**, dan **Let's Encrypt SSL**, baca panduan lengkap di:
👉 **[how_host_this_web.md](how_host_this_web.md)**

---

## 🧪 Pengujian Otomatis (Tests)

Jalankan pengujian integrasi Jest & HTTP flow:
```bash
npm test
```

---

## 📄 Lisensi

[MIT License](LICENSE) — Copyright (c) 2026 Muhammad Alvi Kirana Zulfan Nazal
