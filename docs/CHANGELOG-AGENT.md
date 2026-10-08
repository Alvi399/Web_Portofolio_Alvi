# CHANGELOG-AGENT

Catatan eksekusi AI agent untuk `PRD_For_you.md`.

## T-00 — Audit asumsi kode

1. **Impor GitHub & duplikat** — `controllers/adminController.js` (`githubImport`) sudah mengecek `Project.findOne({ where: { github_repo_name } })` sebelum membuat. Namun **slug** tidak dijamin unik (hanya `slugify(repo.name)`; bentrok dengan project manual bernama sama akan melempar error unique). Diperbaiki di T-14.
2. **`connect-flash` / `express-flash` / `method-override`** — tidak di-`require` di `app.js` (tidak dipakai). Form admin memakai POST-only. `connect-flash` dipasang di T-16; `express-flash` dan `method-override` dihapus di T-35.
3. **`sequelize.sync()`** — `app.js` memanggil `sequelize.sync()` **tanpa** `alter` (README salah menyebut `alter:true`). Sinkronisasi hanya membuat tabel yang belum ada, tidak mengubah kolom. Diubah di T-02.
4. **`.env` di `.gitignore`** — Ya (`.gitignore` baris `.env`). `git ls-files` tidak memuat `.env` (hanya `.env.example`).
5. **Pesan kontak** — `homeController.contact` mengirim `success` dari `req.query.success`; view merender dengan `<%= %>` (ter-escape). `error` dari query **tidak pernah dirender**. Tetap diganti flash di T-16 sesuai PRD.
6. **`secretResumeBtn` / `resumeGenerator.js`** — tombol floating di `views/layouts/main.ejs`; klik membuka modal dan `resumeGenerator.js` men-*scrape* DOM/halaman portofolio untuk membuat resume (unduh TXT / print PDF). Tidak ada file CV nyata.

### Temuan tambahan
- `views/project-detail.ejs` merender `project.description` dengan `<%- %>` (tidak di-escape) → risiko XSS tersimpan. Diperbaiki di T-14 (escape lalu ganti newline dengan `<br>`).
- `.env` yang ada menunjuk ke **host MySQL remote** (`DB_HOST` bukan localhost). Agent **tidak** menjalankan migrasi/seed terhadap DB tersebut; jalankan `npm run migrate` secara manual setelah ditinjau.
- `models/Project.js` `technologies` memakai getter/setter JSON; seed lama mengirim `JSON.stringify([...])` sehingga ter-*double-encode* (dibereskan di T-01: seed memakai array langsung).

## Log tugas

### Fase 0 — Fondasi & Keamanan Operasional
- **T-00 — Audit asumsi kode**: Selesai. Hasil audit dicatat di atas.
- **T-01 — Pengaman seed**: Selesai. `seeders/seed.js` menolak eksekusi pada `NODE_ENV=production` (kecuali `ALLOW_SEED=true`), meminta `--force` jika data ada, dan menghasilkan password acak jika `ADMIN_PASSWORD` tidak terisi.
- **T-02 — Migrasi DB dengan sequelize-cli**: Selesai. Ditambahkan `helpers/migrationUtils.js`, `.sequelizerc`, `config/cli.js`, dan file migrasi baseline idempoten (`migrations/20261003000001-baseline.js`). Ditambahkan script `npm run migrate` & `npm run migrate:undo`. Auto-sync di `app.js` kini hanya aktif pada `NODE_ENV=development`.

### Fase 1 — Kesan Pertama untuk HRD
- **T-10 — CV PDF yang jelas dan dapat diunduh**: Selesai. Field `profiles.resume_file`, upload PDF acak aman di `/admin/profile` (dengan pemeriksaan magic bytes `%PDF-` dan pembersihan file lama), endpoint `GET /resume`, serta tombol "Download CV" di hero Home, navbar, footer, dan About.
- **T-11 — Hero: role jelas + status ketersediaan + CTA**: Selesai. Migrasi `headline`, `availability_status`, `work_preference`. Tampilan hero dengan badge ketersediaan (Open to work / Freelance) dan preferensi kerja.
- **T-12 — Kontak langsung**: Selesai. Migrasi `profiles.whatsapp`. Link WhatsApp, email, LinkedIn, dan GitHub di footer dan Contact dengan `target="_blank" rel="noopener noreferrer"`.
- **T-13 — SEO dasar & Open Graph**: Selesai. Partial `views/partials/meta.ejs` dengan tag title, description, canonical, OG, Twitter card, serta JSON-LD Person. Rute `GET /sitemap.xml` dan `GET /robots.txt`.
- **T-14 — Project bercerita + kurasi**: Selesai. Migrasi `problem`, `role`, `impact`, `demo_url`, `status`. Halaman detail project menampilkan blok bercerita dan tombol demo/kode. Home memuat maksimal 3 project terpublikasi & featured. Project hasil impor GitHub masuk sebagai `draft` dan slug dijamin unik lewat `helpers/slugUtils.js`.
- **T-15 — Notifikasi email pesan kontak**: Selesai. Modul `services/mailer.js` dengan `nodemailer`. Mengirim notifikasi email ke pemilik secara asinkron tanpa memblokir atau menggagalkan submit form kontak pengunjung.
- **T-17 — Fallback foto profil**: Selesai. Penganganan `onerror` di `public/js/imageUtils.js` yang secara otomatis membuat avatar lingkaran berinisial (`displayName`) jika gambar profil gagal dimuat. Menambahkan `width="160" height="160" loading="eager" fetchpriority="high"` untuk optimasi LCP.
- **T-11a — Nama tampilan "Malvix"**: Selesai. Migrasi `profiles.display_name` (`migrations/20261003000015-profile-display-name.js`). Ditambahkan helper `displayName(profile)` di `app.js` view locals. Navbar dan H1 hero menampilkan nama panggilan "Malvix" dengan nama lengkap di baris redup di bawahnya. Field "Display Name" ditambahkan di Admin Profile.
- **T-11b — Hero muat di layar pertama**: Selesai. Penataan jarak dan struktur hero agar seluruh elemen utama (nama, headline, status, lokasi, bio, CTA, tech chips) langsung terlihat di layar pertama.
- **T-11c — Hierarki CTA & chip teknologi**: Selesai. CTA utama (Download CV - filled), sekunder (View Projects - outline), tersier (Contact Me - text). Ditambahkan 5 chip teknologi utama (`hero-chip`) berdasarkan tingkat kemahiran (*proficiency*).
- **T-11d — Bio utuh & badge kontekstual**: Selesai. Bio ditampilkan utuh tanpa pemotongan menggantung (`...`). Badge status diperbarui dengan format "Open to work · <work_preference>". Bahasa UI diselaraskan secara konsisten.

### Fase 1B — Hardening
- **T-20 — Amankan /api/image-proxy (SSRF)**: Selesai. Strict domain whitelist, DNS lookup privat/loopback IP blocking, max content length, dan non-SVG image header validation.
- **T-21 — Proteksi CSRF**: Selesai. `helpers/csrfUtils.js` terpasang di `app.js`. Hidden input `_csrf` dan query `?_csrf=` disisipkan di seluruh form POST public dan admin (termasuk upload multipart).
- **T-22 — Rate limiting & anti-spam**: Selesai. `middleware/rateLimiter.js` (`loginLimiter`, `contactLimiter`, `proxyLimiter`) dan honeypot field `website` di form kontak.
- **T-23 — Session & cookie aman**: Selesai. Validasi `SESSION_SECRET` wajib di production, flag cookie `HttpOnly; SameSite=Lax`, dan `req.session.regenerate()` saat login.
- **T-24 — Header keamanan (helmet)**: Selesai. Helmet terkonfigurasi dengan Content Security Policy (CSP) untuk script, style, font, dan image sources.
- **T-25 — Keamanan upload**: Selesai. SVG dilarang, magic bytes verification (`isImageFile`, `isPdfFile`), serta pembersihan otomatis file lama di disk (`removeFileInside`).

### Fase 2 — Kredibilitas & Kualitas
- **T-30 — Testimoni / rekomendasi**: Selesai. Migrasi `20261003000030-testimonials.js`, model `Testimonial`, CRUD admin di `/admin/testimonials`, dan tampilan kartu Neo-Brutalist di Home (inspirasi desain `Screenshot_3-10-2026_20504_boards.boldare.com.jpeg`).
- **T-31 — About lebih manusiawi**: Selesai. Migrasi `20261003000031-profile-about-summary.js` (`about_summary` & `looking_for`), disajikan di About page & Home.
- **T-32 — Sorot sertifikat relevan**: Selesai. Migrasi `20261003000032-certificate-highlight.js` (`is_highlight`). Filter kategori interaktif sisi-klien di `/certificates`.
- **T-33 & T-35 — Kebersihan repo**: Selesai. Script root dipindahkan ke `scripts/`, file `LICENSE` (MIT) ditambahkan, `.env.example` & `README.md` diperbarui, dependensi tak terpakai dibersihkan.
- **T-34 — Tes otomatis & CI**: Selesai. Integration test Jest + Supertest (`tests/app.test.js`, 8/8 tests pass).

### Fase 3 — Fitur Lanjutan (Selesai Opsional)
- **T-40 — Analitik ringan (Privacy-First)**: Selesai. Tabel & model `Event` (`migrations/20261003000040-create-events.js`), `services/analyticsService.js` dengan hashing IP harian (tanpa simpan IP mentah, 100% GDPR compliant), pelacakan unduhan CV (`/resume`), tampilan detail project, serta endpoint `POST /api/track-event`.
- **T-41 — Multibahasa ID/EN**: Selesai. Helper & middleware `helpers/i18nHelper.js`, switcher tombol `🌐 ID | EN` di navbar (`views/layouts/main.ejs`), dukungan terjemahan dinamis `__(key)`.
- **T-42 — Server-side Pagination & Filter**: Selesai. Pagination 12 item per halaman pada `/projects` (`findAndCountAll`) dengan pagination bar interaktif.
- **T-43 — Drag-and-drop / Batch sort_order**: Selesai. Endpoint batch reorder `POST /admin/projects/reorder` dan `POST /admin/skills/reorder` di `controllers/adminController.js` & `routes/admin.js`.
- **T-44 — Extended Dashboard Admin**: Selesai. Ringkasan analitik 30 hari (Unduhan CV & Project Views), indikator kelengkapan profil (0-100%), counter project draft, dan counter pesan belum dibaca di `/admin`.



