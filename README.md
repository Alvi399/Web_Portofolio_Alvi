# Web Portofolio Alvi (Malvix)

Website portofolio pribadi & profesional modern yang dibangun menggunakan **Node.js (Express 5)**, **EJS Layouts**, **Sequelize ORM**, dan **MySQL**. Dilengkapi **Admin Panel** terproteksi login, integrasi GitHub REST API, notifikasi pesan kontak, serta keamanan berlapis (SSRF proxy hardening, CSRF token, Rate Limiting, Helmet CSP).

---

## 🚀 Fitur Utama

### 🌐 Public Pages
- **Hero & Headline**: Role spesifik, status ketersediaan kerja (*Open to Work* / *Freelance*), preferensi lokasi, serta 5 chip teknologi utama.
- **CV PDF Unduhan (`/resume`)**: HRD dapat mengunduh CV PDF resmi dalam 1 klik.
- **Featured Projects (`/projects` & `/projects/:slug`)**: Showcase project unggulan dengan narasi bercerita (Masalah, Peran, Dampak, Live Demo, Kode).
- **Testimoni Neo-Brutalist**: Rekomendasi & kesan dari rekan kerja/klien dalam kartu Neo-Brutalist berdesain kontras tinggi.
- **Interactive Certifications (`/certificates`)**: Filter sertifikat interaktif sisi klien (Backend, Frontend, AI, Other) & sorotan (*Highlight*).
- **Journey Timeline (`/journey`)**: Catatan riwayat perjalanan karir dan pendidikan.
- **Contact Form (`/contact`)**: Formulir kontak anti-spam (Honeypot + Rate Limit) dengan notifikasi email asinkron ke pemilik.
- **SEO & OpenGraph**: Tag meta OG lengkap, `robots.txt`, `sitemap.xml`, dan JSON-LD `Person`.

### 🛡️ Keamanan & Performa (Fase 1B Hardening)
- **SSRF Hardening (`/api/image-proxy`)**: Strict domain whitelist & IP privat/loopback resolution blocking.
- **CSRF Protection**: Token verifikasi pada semua form POST (termasuk upload multipart).
- **Rate Limiting & Anti-Spam**: Proteksi brute-force login, submit kontak, dan proxy request (`express-rate-limit`).
- **Security Headers (`helmet`)**: Dynamic Content Security Policy (CSP) & cookie flags (`HttpOnly; SameSite=Lax`).
- **Upload Validation**: Magic bytes check untuk gambar (JPEG/PNG/GIF/WebP) & CV (PDF). Ekstensi SVG dilarang.

### ⚡ Admin Panel (`/admin`)
- **Dashboard**: Statistik ringkas (Project, Skill, Pesan, Sertifikat, Journey, Testimoni).
- **CRUD Content**: Kelola Project (Draft/Published), Skills, Certificates (Highlight), Journey, Testimonials, & Profile.
- **GitHub Import**: Impor repositori publik langsung dari API GitHub sebagai project draft tanpa duplikasi.
- **Inbox Messages**: Baca dan kelola pesan kontak yang masuk.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Runtime** | Node.js (v18+) |
| **Framework** | Express 5.x |
| **View Engine** | EJS 4 + `express-ejs-layouts` |
| **Database** | MySQL + Sequelize ORM 6 |
| **Security** | Helmet, CSRF, Express Rate Limit, BcryptJS |
| **File Upload** | Multer 2 (dengan magic bytes validation) |
| **Testing** | Jest + Supertest |

---

## 💻 Cara Instalasi & Mengoperasikan

### 1. Clone & Install
```bash
git clone https://github.com/Alvi399/Web_Portofolio_Alvi.git
cd Web_Portofolio_Alvi
npm install
```

### 2. Konfigurasi `.env`
Salin file contoh `.env.example` ke `.env` dan sesuaikan kredensial MySQL lokal Anda:
```bash
cp .env.example .env
```

### 3. Migrasi Database CLI
Jalankan migrasi Sequelize untuk membuat tabel dan skema database secara idempoten:
```bash
npm run migrate
```

*(Opsional) Seed data awal (hanya untuk environment development):*
```bash
npm run seed
```

### 4. Jalankan Aplikasi
- **Development mode:**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```

Akses website di `http://localhost:3005`.

---

## 🧪 Pengujian Otomatis (Tests)

Jalankan pengujian integrasi Jest:
```bash
npm test
```

---

## 📄 Lisensi

[MIT License](LICENSE) — Copyright (c) 2026 Alvi
