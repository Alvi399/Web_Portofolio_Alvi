# Professional Portfolio Website

Website portfolio modern yang dibangun dengan **Node.js**, **Express**, dan **Sequelize (MySQL)**. Dilengkapi dengan Admin Panel lengkap untuk mengelola konten secara dinamis.

## 🚀 Fitur Utama

### Public Pages

- **Home**: Ringkasan profil dan showcase utama.
- **About**: Informasi detail tentang pemilik portfolio.
- **Projects**: Daftar project lengkap dengan detail dan kategori slug.
- **Certificates**: Showcase sertifikat keahlian.
- **Journey**: Timeline riwayat pendidikan dan pengalaman kerja.
- **Contact**: Formulir kontak yang terintegrasi dengan database.

### Admin Panel (Secured)

- **Dashboard**: Statistik ringkas konten.
- **Project Management**: Tambah, edit, hapus project dengan dukungan upload gambar.
- **GitHub Import**: Import data repository langsung dari GitHub API ke daftar project.
- **Skill Management**: Kelola daftar keahlian (Frontend, Backend, dll).
- **Certificate & Journey**: Kelola sertifikat dan riwayat perjalanan karir.
- **Profile Settings**: Ubah informasi profil dan foto secara real-time.
- **Contact Inquiries**: Lihat pesan yang masuk dari pengunjung.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (Sequelize ORM)
- **View Engine**: EJS (with Express EJS Layouts)
- **Authentication**: Session-based with BcryptJS
- **Uploads**: Multer
- **Integration**: GitHub Rest API

## 💻 Instalasi Lokal

1. **Clone project:**

   ```bash
   git clone https://github.com/USERNAME_ANDA/Web_Portofolio_Alvi.git
   cd Web_Portofolio_Alvi
   ```

2. **Install dependensi:**

   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   Copy `.env.example` menjadi `.env` dan isi dengan kredensial database lokal Anda:

   ```bash
   cp .env.example .env
   ```

4. **Database Migration (Initial):**
   Aplikasi akan otomatis melakukan syncing tabel saat dijalankan (`sequelize.sync({ alter: true })`).

5. **Jalankan aplikasi:**
   ```bash
   npm run dev
   ```
   Akses di: `http://localhost:3000`

## 🌐 Hosting & Deployment

Project ini dioptimalkan untuk di-deploy ke **VPS (Ubuntu 22.04+)**. Untuk langkah-langkah detail mengenai setup VPS, Nginx Reverse Proxy, SSL (HTTPS), dan Remote Database, silakan lihat panduan yang tersedia di folder dokumentasi atau instruksi sebelumnya.

## 📄 Lisensi

[ISC](LICENSE)
