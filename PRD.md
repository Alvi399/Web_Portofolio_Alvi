# Product Requirements Document (PRD) — Web Portofolio Alvi

| Item | Detail |
|---|---|
| Nama Produk | Web Portofolio Alvi |
| Versi Dokumen | 1.0 (berdasarkan kondisi codebase saat ini) |
| Tanggal | 2026-10-03 |
| Pemilik | Alvi |
| Status | Live/Maintenance — dokumen ini mencatat as-built + gap & roadmap |

---

## 1. Ringkasan Produk

Website portofolio pribadi berbasis server-side rendering (Node.js + Express + EJS) dengan database MySQL (Sequelize). Seluruh konten (profil, project, skill, sertifikat, perjalanan karir) dikelola secara dinamis lewat **Admin Panel** yang terproteksi login, tanpa perlu mengubah kode.

### 1.1 Masalah yang Diselesaikan
- Portofolio statis sulit diperbarui; setiap perubahan butuh edit kode & redeploy.
- Memasukkan project dari GitHub secara manual memakan waktu.
- Rekruter/klien butuh satu tempat untuk melihat profil, karya, sertifikasi, dan cara menghubungi.

### 1.2 Tujuan (Goals)
1. Menampilkan profil profesional yang cepat dan rapi.
2. Memudahkan pemilik memperbarui konten via CMS ringan.
3. Mempercepat pengisian project lewat impor GitHub.
4. Menerima pesan pengunjung dan menyimpannya di database.
5. Mudah di-host (VPS Ubuntu + Nginx, atau shared hosting dengan remote MySQL).

### 1.3 Non-Goals
- Bukan platform multi-user/multi-tenant (hanya satu profil).
- Bukan blog/CMS umum.
- Belum ada pengiriman email otomatis dari form kontak.

---

## 2. Persona & Pengguna

| Persona | Kebutuhan | Interaksi |
|---|---|---|
| **Pengunjung / Rekruter** | Melihat profil, project, sertifikat, riwayat; menghubungi pemilik; (opsional) mengunduh resume | Halaman publik |
| **Admin (Alvi)** | Mengelola seluruh konten dan membaca pesan masuk | `/admin/*` |

---

## 3. Tech Stack

| Layer | Teknologi |
|---|---|
| Runtime | Node.js |
| Web framework | Express 5.x |
| View | EJS 4 + `express-ejs-layouts` (layout `layouts/main`, `layouts/admin`) |
| ORM / DB | Sequelize 6 + MySQL (`mysql2`), pool max 2 |
| Auth | `express-session` (cookie 24 jam) + `bcryptjs` |
| Upload | `multer` 2 (disk, `public/uploads`, maks 5 MB) |
| HTTP | `axios` (image proxy), `https` native (GitHub API) |
| Util | `slugify`, `method-override`, `connect-flash`, `express-flash`, `dotenv` |
| Dev | `nodemon` |
| Frontend | Vanilla JS (`main.js`, `imageUtils.js`, `resumeGenerator.js`), CSS (`style.css`, `admin.css`) |

### 3.1 Konfigurasi Environment
`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT` (opsional, default 3306), `PORT` (default 3005), `SESSION_SECRET`, `NODE_ENV`.

### 3.2 Script
- `npm start` — jalankan produksi
- `npm run dev` — nodemon
- `npm run seed` — **DESTRUKTIF**: `sync({force:true})`, membuat admin default + data contoh

---

## 4. Arsitektur

```
app.js                  Bootstrap Express, session, locals, routes, 404, start+retry DB (5x, jeda 5s)
config/db.js            Instance Sequelize
models/                 Profile, Project, Skill, Contact, User, Certificate, Journey (+ index.js)
routes/public.js        Rute publik + /api/image-proxy
routes/admin.js         Rute admin (login publik; sisanya di belakang isAuthenticated) + konfigurasi multer
controllers/            homeController (publik), adminController (CRUD), imageController (proxy)
middleware/auth.js      isAuthenticated (simpan returnTo, redirect ke /admin/login)
services/github.js      Fetch repo publik user dari GitHub REST API
helpers/imageHelper.js  getImageUrl() — normalisasi URL gambar (Drive, Dropbox, OneDrive, GitHub)
views/                  Halaman publik, admin/, layouts/
public/                 css, js, uploads
seeders/seed.js         Data awal
```

Pola: MVC sederhana, server-rendered. `res.locals.user` dan `res.locals.getImageUrl` tersedia di semua view.

---

## 5. Model Data

| Tabel | Field utama |
|---|---|
| `users` | id, username (unique), email (unique), password (bcrypt) |
| `profiles` | full_name*, tagline, bio, profile_image, email, phone, location, github_url, linkedin_url, resume_url |
| `projects` | title*, slug* (unique), description, image, image_url, technologies (TEXT JSON array via getter/setter), project_url, github_url, github_repo_name, stars, is_featured, sort_order |
| `skills` | name*, category (default General), proficiency (0–100, default 50), icon, image_url, sort_order |
| `certificates` | title*, issuer*, date*, credential_url, image_url, category ENUM(Backend, Frontend, AI, Other) |
| `journey` | title*, description, date*, image_url |
| `contacts` | name*, email*, subject, message*, is_read |

`*` = wajib. Semua tabel memiliki `createdAt/updatedAt`. Tidak ada relasi antar-tabel (tabel independen).

---

## 6. Kebutuhan Fungsional

### 6.1 Halaman Publik

| ID | Rute | Kebutuhan |
|---|---|---|
| FR-P1 | `GET /` | Home: profil, hingga 6 project `is_featured` (urut `sort_order`), semua skill, 4 sertifikat terbaru, 4 journey terbaru |
| FR-P2 | `GET /about` | Profil lengkap + skill dikelompokkan per kategori |
| FR-P3 | `GET /projects` | Daftar semua project urut `sort_order` |
| FR-P4 | `GET /projects/:slug` | Detail project; 404 bila slug tidak ada |
| FR-P5 | `GET /certificates` | Semua sertifikat urut tanggal menurun |
| FR-P6 | `GET /journey` | Timeline urut tanggal menurun |
| FR-P7 | `GET/POST /contact` | Form kontak; validasi name, email, message wajib; simpan ke `contacts`; pesan sukses/gagal via query string |
| FR-P8 | `GET /api/image-proxy?url=` | Proxy gambar eksternal (timeout 10 s, cache 24 jam); fallback piksel transparan |
| FR-P9 | Client-side | **Resume generator**: tombol tersembunyi (`secretResumeBtn`) membuat modal resume dari konten halaman; unduh TXT dan cetak PDF |
| FR-P10 | `*` | Halaman 404 / error bertema |

### 6.2 Admin Panel (semua di bawah `/admin`, kecuali login)

| ID | Rute | Kebutuhan |
|---|---|---|
| FR-A1 | `/login`, `/logout` | Login username+password (bcrypt), session; redirect ke `returnTo` |
| FR-A2 | `/` | Dashboard statistik ringkas konten |
| FR-A3 | `/projects*` | CRUD project, upload gambar (jpeg/jpg/png/gif/webp/svg ≤ 5 MB) atau image URL; slug otomatis (slugify) |
| FR-A4 | `/skills*` | CRUD skill |
| FR-A5 | `/certificates*` | CRUD sertifikat |
| FR-A6 | `/journey*` | CRUD journey |
| FR-A7 | `/profile` | Edit profil + upload foto |
| FR-A8 | `/contacts*` | Daftar, detail (tandai dibaca), hapus pesan |
| FR-A9 | `/github`, `/github/fetch`, `/github/import` | Ambil repo publik non-fork dari username GitHub (maks 100, urut updated), pilih, lalu impor ke `projects` (nama, deskripsi, url, homepage, bahasa/topics → technologies, stars) |

### 6.3 Penanganan URL Gambar
`getImageUrl` mengonversi: Google Drive → `drive.google.com/thumbnail?id=…&sz=s3000`; Dropbox → `dl=1`/`dl.dropboxusercontent.com`; OneDrive → via image-proxy; GitHub blob → `raw.githubusercontent.com`. Panduan: `IMAGE_URL_GUIDE.md`.

---

## 7. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| Performa | Render server-side < 1 detik di VPS kecil; pool DB kecil (2) agar aman di shared hosting; gambar di-cache 24 jam |
| Keamanan | Password di-hash bcrypt; admin di belakang session; upload dibatasi tipe & ukuran; `trust proxy` aktif untuk Nginx/HTTPS |
| Keandalan | Retry koneksi DB 5× saat start |
| Responsif | Tampilan mobile-first untuk halaman publik dan admin |
| Deployability | VPS Ubuntu 22.04 + Nginx + SSL (lihat `how_host_this_web.md`) |
| Maintainability | Struktur MVC; env via `.env` |
| SEO | Title per halaman (via `title` di render); perlu ditingkatkan (lihat §9) |

---

## 8. Alur Pengguna Utama

1. **Pengunjung**: Home → lihat project unggulan → detail project → kirim pesan di Contact.
2. **Admin**: `/admin/login` → dashboard → impor repo GitHub → rapikan project (gambar, featured, urutan) → baca pesan masuk.
3. **Setup awal**: set `.env` → `npm run seed` → login `admin/admin123` → **ganti password segera**.

---

## 9. Temuan, Risiko & Gap (hasil analisis kode)

| # | Prioritas | Temuan | Rekomendasi |
|---|---|---|---|
| 1 | **Tinggi** | `seed.js` memakai `force:true` (menghapus semua data) dan membuat admin `admin/admin123` | Tambah guard `NODE_ENV`/konfirmasi; password dari env; paksa ganti password |
| 2 | **Tinggi** | `/api/image-proxy` menerima URL arbitrer → risiko **SSRF** dan open proxy | Whitelist domain (drive, dropbox, onedrive), blokir IP privat, validasi content-type `image/*`, batasi ukuran |
| 3 | **Tinggi** | Tidak ada proteksi **CSRF** pada semua POST admin & form kontak | Tambah token CSRF |
| 4 | **Tinggi** | Tidak ada rate limiting di login dan form kontak (brute force/spam) | `express-rate-limit`, honeypot/captcha |
| 5 | Sedang | Session memakai MemoryStore & secret default `default-secret`; cookie tanpa `secure/httpOnly/sameSite` eksplisit | Store persisten, wajibkan `SESSION_SECRET`, set flag cookie |
| 6 | Sedang | Tidak ada header keamanan | Tambah `helmet` |
| 7 | Sedang | Validasi upload hanya ekstensi+mime (SVG bisa memuat script); file lama tidak dihapus saat update/hapus | Sanitasi SVG/larang SVG, bersihkan file yatim |
| 8 | Sedang | Redirect kontak memakai pesan di query string (`?error=`), dapat dimanipulasi (XSS/spoof jika dirender tak ter-escape) | Gunakan flash message, pastikan escaping |
| 9 | Sedang | `sequelize.sync()` untuk skema, tanpa migrasi; README menyebut `alter:true` namun kode memakai `sync()` | Adopsi `sequelize-cli` migrations; samakan dokumentasi |
| 10 | Rendah | `convertImageUrl` di `imageController` duplikat dengan `imageHelper` dan tidak konsisten | Konsolidasi ke satu helper |
| 11 | Rendah | `package` `connect-flash`/`express-flash`/`method-override` terpasang tetapi tidak dipakai di `app.js` | Aktifkan atau hapus |
| 12 | Rendah | `.env` ada di repo lokal; pastikan tercantum di `.gitignore` | Verifikasi tidak ter-commit |
| 13 | Rendah | Script bantu `create_db.js`, `test_db_ipv4.js` di root; README memiliki karakter rusak (encoding emoji); `LICENSE` dirujuk tetapi tidak ada | Rapikan/pindah ke `scripts/`, perbaiki encoding, tambah LICENSE |
| 14 | Rendah | Tidak ada pagination, tes otomatis, atau CI | Tambah bila data bertambah |

---

## 10. Roadmap

**Fase 1 — Hardening (disarankan segera):** temuan #1–#6, #8.
**Fase 2 — Kualitas:** migrasi DB, tes dasar (Jest + Supertest), perbaikan README/LICENSE, bersihkan dependensi & duplikasi.
**Fase 3 — Fitur:**
- Notifikasi email untuk pesan kontak (Nodemailer)
- Meta SEO per halaman (description, Open Graph, sitemap.xml, robots.txt)
- Drag-and-drop pengurutan project/skill
- Upload & hosting file resume PDF
- Dukungan multibahasa (ID/EN)
- Analitik pengunjung ringan
- Pagination/filter kategori di project & sertifikat

---

## 11. Kriteria Penerimaan (Acceptance Criteria)

- Semua halaman publik di §6.1 merespons 200 dengan data dari DB; slug tak dikenal → 404.
- Pengunjung yang mengirim form valid membuat 1 record `contacts` dan melihat pesan sukses; field wajib kosong menolak submit.
- Akses `/admin/*` tanpa login selalu redirect ke `/admin/login`, lalu kembali ke halaman asal setelah login.
- Upload di luar tipe/ukuran yang diizinkan tidak tersimpan.
- Impor GitHub membuat project dengan slug unik tanpa menggandakan repo yang sudah diimpor (*perilaku dedup perlu diverifikasi/diimplementasikan*).
- Aplikasi tetap start setelah kegagalan DB sementara (≤ 5 percobaan).

---

## 12. Metrik Keberhasilan
- Waktu update konten oleh admin < 2 menit per item.
- Waktu muat halaman utama < 2 detik (LCP) pada 4G.
- 0 insiden keamanan setelah Fase 1.
- Pesan kontak tersimpan 100% (tidak ada kehilangan).

---

## 13. Dokumen Terkait
`README.md`, `how_host_this_web.md`, `IMAGE_URL_GUIDE.md`, `AGENT.md`
