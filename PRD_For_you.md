# PRD — Web Portofolio Alvi (v2.0, Agent-Executable)

| Item | Detail |
|---|---|
| Nama Produk | Web Portofolio Alvi |
| Versi Dokumen | 2.0 — as-built + backlog tugas untuk AI agent |
| Tanggal | 2026-10-03 |
| Pemilik | Alvi |
| Status | Live/Maintenance → fase "Optimasi untuk HRD/Rekruter" |
| Bahasa UI | Indonesia (siapkan struktur untuk EN di Fase 3) |

---

## 0. Panduan untuk AI Agent (BACA DULU)

### 0.1 Cara bekerja
1. **Verifikasi dulu, baru ubah.** Dokumen ini ditulis dari analisis kode. Sebelum mengerjakan tugas, buka file yang disebut dan pastikan asumsinya benar. Jika berbeda, ikuti kode yang ada dan catat selisihnya di `docs/CHANGELOG-AGENT.md`.
2. **Satu tugas = satu commit/PR kecil.** Gunakan ID tugas di pesan commit, mis. `T-10: resume PDF upload`.
3. **Kerjakan berurutan sesuai §6 (Urutan Eksekusi).** Tugas yang mengubah skema DB harus menunggu T-02 (migrasi).
4. **Setiap tugas punya Acceptance Criteria (AC).** Tugas baru dianggap selesai jika semua AC terpenuhi dan perintah verifikasi lulus.
5. **Jangan perluas scope.** Hanya kerjakan yang tertulis. Ide tambahan → tulis di `docs/CHANGELOG-AGENT.md` bagian "Saran".
6. **Jika ambigu, pilih opsi paling sederhana dan konsisten dengan pola MVC yang ada**, lalu catat asumsinya.

### 0.2 Aturan keras (DILARANG)
- ❌ Menjalankan `npm run seed` pada DB yang berisi data nyata (destruktif, `force:true`).
- ❌ Commit file `.env`, kredensial, atau data pribadi.
- ❌ Menghapus/mengubah data di tabel `contacts` secara massal.
- ❌ Mengganti stack (Express, EJS, Sequelize, MySQL) atau menambah framework frontend (React/Vue/Tailwind build step). Frontend tetap Vanilla JS + CSS.
- ❌ Menambah dependensi tanpa alasan; setiap dependensi baru wajib dicatat di PR beserta alasannya.
- ❌ Mengubah rute publik yang sudah ada (URL tetap, agar tautan lama tidak rusak).

### 0.3 Konvensi kode
- Bahasa kode & komentar: Inggris; teks UI: Indonesia.
- Controller tipis, logika bersama masuk ke `services/` atau `helpers/`.
- Semua input pengguna divalidasi di server; semua output EJS memakai `<%= %>` (escape), `<%- %>` hanya untuk partial/HTML tepercaya.
- Error async di route harus ditangani (try/catch atau wrapper), tidak boleh membuat proses crash.
- Gunakan variabel lingkungan untuk semua rahasia; tambahkan ke `.env.example` setiap ada env baru.

### 0.4 Definition of Done (berlaku untuk SEMUA tugas)
- [ ] Semua AC tugas terpenuhi.
- [ ] `npm start` berjalan tanpa error pada DB kosong hasil migrasi dan pada DB yang sudah ada.
- [ ] Tidak ada regresi di rute pada §4.1 dan §4.2 (respons status sama seperti sebelumnya).
- [ ] Tampilan dicek di lebar 375px (mobile) dan 1280px (desktop).
- [ ] Env baru terdokumentasi di `.env.example` dan README.
- [ ] Jika ada tes otomatis (setelah T-34), seluruh tes lulus.

---

## 1. Ringkasan Produk

Website portofolio pribadi server-side rendering (Node.js + Express 5 + EJS) dengan MySQL (Sequelize). Konten (profil, project, skill, sertifikat, perjalanan karir) dikelola lewat **Admin Panel** terproteksi login.

### 1.1 Masalah yang Diselesaikan
- Portofolio statis sulit diperbarui.
- Input project dari GitHub manual dan lama.
- Rekruter/klien butuh satu tempat untuk melihat profil, karya, sertifikasi, dan cara menghubungi.

### 1.2 Masalah Baru yang Diselesaikan di Versi Ini
HRD dan rekruter non-teknis memindai website **±30–60 detik**. Kondisi saat ini menghambat mereka:
- CV hanya tersedia lewat tombol tersembunyi (`secretResumeBtn`) dan formatnya TXT.
- Tidak jelas role spesifik dan status ketersediaan kerja.
- Project hanya berisi deskripsi + teknologi; tidak ada cerita masalah, peran, dan dampak.
- Impor GitHub dapat menampilkan repo tidak layak (tanpa deskripsi/gambar) ke publik.
- Link yang dibagikan via WhatsApp/LinkedIn tidak punya preview (tanpa Open Graph).
- Pesan kontak tidak memicu notifikasi, sehingga bisa tak terbaca berhari-hari.

### 1.3 Goals
1. **G1** — HRD dapat mengunduh CV PDF dalam ≤ 2 klik dari halaman mana pun.
2. **G2** — Dalam 5 detik pertama, hero menjawab: siapa, role apa, status kerja, cara menghubungi.
3. **G3** — Project unggulan menampilkan cerita (masalah, peran, dampak, demo).
4. **G4** — Link website menghasilkan preview kartu yang rapi saat dibagikan.
5. **G5** — Pemilik dinotifikasi email saat ada pesan baru.
6. **G6** — Website aman dari penyalahgunaan dasar (SSRF, CSRF, spam, brute force).
7. Mempertahankan tujuan lama: update konten mudah via CMS, impor GitHub, mudah di-host.

### 1.4 Non-Goals
- Bukan platform multi-user/multi-tenant.
- Bukan blog/CMS umum.
- Tidak ada migrasi ke framework frontend.
- Tidak ada fitur pembayaran/komentar publik.

---

## 2. Persona

| Persona | Kebutuhan | Interaksi |
|---|---|---|
| **HRD / Rekruter non-teknis** | Cepat tahu siapa Alvi, bidangnya, bisa dihubungi, unduh CV | Home, About, Contact, tombol CV |
| **Hiring Manager / Teknis** | Lihat project nyata, demo, kode, stack | Projects, detail project, GitHub |
| **Admin (Alvi)** | Kelola konten, baca pesan, unggah CV | `/admin/*` |

---

## 3. Tech Stack & Environment (as-built)

| Layer | Teknologi |
|---|---|
| Runtime | Node.js |
| Web | Express 5.x |
| View | EJS 4 + `express-ejs-layouts` (`layouts/main`, `layouts/admin`) |
| ORM/DB | Sequelize 6 + MySQL (`mysql2`), pool max 2 |
| Auth | `express-session` (cookie 24 jam) + `bcryptjs` |
| Upload | `multer` 2 (disk, `public/uploads`, maks 5 MB) |
| HTTP | `axios` (image proxy), `https` native (GitHub API) |
| Util | `slugify`, `method-override`, `connect-flash`, `express-flash`, `dotenv` |
| Dev | `nodemon` |
| Frontend | Vanilla JS (`main.js`, `imageUtils.js`, `resumeGenerator.js`), CSS (`style.css`, `admin.css`) |

### 3.1 Environment
Existing: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT` (3306), `PORT` (3005), `SESSION_SECRET`, `NODE_ENV`.

Baru (didefinisikan di tugas terkait, semua opsional kecuali dinyatakan lain):
`SITE_URL` (T-13), `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_TO`, `NOTIFY_FROM` (T-15), `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL` (T-01), `ALLOW_SEED` (T-01), `SESSION_SECRET` (wajib di production, T-23).

### 3.2 Script
`npm start`, `npm run dev`, `npm run seed` (destruktif; lihat T-01). Setelah tugas terkait: `npm run migrate`, `npm test`.

---

## 4. Arsitektur & Peta Kode

```
app.js                  Bootstrap Express, session, locals, routes, 404, start + retry DB (5x, jeda 5s)
config/db.js            Instance Sequelize
models/                 Profile, Project, Skill, Contact, User, Certificate, Journey (+ index.js)
routes/public.js        Rute publik + /api/image-proxy
routes/admin.js         Rute admin + konfigurasi multer
controllers/            homeController, adminController, imageController
middleware/auth.js      isAuthenticated
services/github.js      GitHub REST API
helpers/imageHelper.js  getImageUrl()
views/                  Halaman publik, admin/, layouts/
public/                 css, js, uploads
seeders/seed.js         Data awal (destruktif)
```

Pola: MVC sederhana, server-rendered. `res.locals.user` dan `res.locals.getImageUrl` tersedia di semua view.

### 4.1 Rute Publik (JANGAN diubah URL-nya)
`GET /`, `/about`, `/projects`, `/projects/:slug`, `/certificates`, `/journey`, `GET|POST /contact`, `GET /api/image-proxy`.

### 4.2 Rute Admin
Semua di bawah `/admin`: `/login`, `/logout`, `/`, `/projects*`, `/skills*`, `/certificates*`, `/journey*`, `/profile`, `/contacts*`, `/github*`.

### 4.3 Rute Baru (ditambahkan oleh tugas)
| Rute | Tugas |
|---|---|
| `GET /resume` (unduh PDF) | T-10 |
| `GET /sitemap.xml`, `GET /robots.txt` | T-13 |
| `POST /track/:event` (opsional, analitik) | T-40 |

---

## 5. Model Data

### 5.1 Skema saat ini
| Tabel | Field utama |
|---|---|
| `users` | id, username (unique), email (unique), password (bcrypt) |
| `profiles` | full_name*, tagline, bio, profile_image, email, phone, location, github_url, linkedin_url, resume_url |
| `projects` | title*, slug* (unique), description, image, image_url, technologies (TEXT JSON via getter/setter), project_url, github_url, github_repo_name, stars, is_featured, sort_order |
| `skills` | name*, category (default General), proficiency (0–100, default 50), icon, image_url, sort_order |
| `certificates` | title*, issuer*, date*, credential_url, image_url, category ENUM(Backend, Frontend, AI, Other) |
| `journey` | title*, description, date*, image_url |
| `contacts` | name*, email*, subject, message*, is_read |

`*` wajib. Semua tabel punya `createdAt/updatedAt`. Tidak ada relasi antar-tabel.

### 5.2 Perubahan skema (ringkasan; detail di tugas)
| Tabel | Kolom baru | Tugas |
|---|---|---|
| `profiles` | `display_name` STRING(40) (nama pendek, nilai awal "Malvix"), `headline` STRING(120), `availability_status` ENUM('open_to_work','freelance','not_available') default 'open_to_work', `work_preference` STRING(60), `whatsapp` STRING(30), `resume_file` STRING(255), `about_summary` TEXT, `looking_for` TEXT, `og_image` STRING(255) | T-10, T-11, T-12, T-13, T-31 |
| `projects` | `problem` TEXT, `role` STRING(120), `impact` TEXT, `demo_url` STRING(255), `status` ENUM('draft','published') default 'published' | T-14 |
| `certificates` | `is_highlight` BOOLEAN default false | T-32 |
| tabel baru `testimonials` | id, name*, position, company, quote*, photo_url, is_visible, sort_order | T-30 |
| tabel baru `events` (opsional) | id, type, path, createdAt | T-40 |

Aturan migrasi: setiap kolom baru harus **nullable atau punya default** agar data lama tetap valid.

---

## 6. Backlog Tugas (Urutan Eksekusi)

Urutan: **Fase 0 → Fase 1 → Fase 2 → Fase 3.** Dalam satu fase, kerjakan sesuai nomor kecuali tertulis dependensi lain.

Format tugas: **Prioritas · Dependensi · File terkait · Spesifikasi · AC · Verifikasi**.

---

### FASE 0 — Fondasi & Keamanan Operasional

#### T-00 — Audit asumsi kode
- **Prioritas:** P0 · **Dependensi:** —
- **Spesifikasi:** Baca kode dan jawab, lalu catat di `docs/CHANGELOG-AGENT.md`:
  1. Apakah impor GitHub (`/admin/github/import`) sudah mencegah duplikat (cek `github_repo_name`/slug)?
  2. Apakah `connect-flash`/`express-flash`/`method-override` dipakai di `app.js`?
  3. Apakah `sequelize.sync()` memakai `alter`? (README menyebut `alter:true`.)
  4. Apakah `.env` ada di `.gitignore`?
  5. Bagaimana pesan sukses/gagal kontak dirender (escape atau tidak)?
  6. Seperti apa `secretResumeBtn` dan `resumeGenerator.js` bekerja?
- **AC:** File catatan berisi 6 jawaban dengan referensi file:baris. Tidak ada perubahan kode di tugas ini.

#### T-01 — Pengaman seed
- **Prioritas:** P0 · **File:** `seeders/seed.js`, `package.json`, `.env.example`
- **Spesifikasi:**
  - Seed menolak jalan jika `NODE_ENV === 'production'` kecuali `ALLOW_SEED=true`.
  - Jika tabel `users` atau `projects` sudah berisi data, minta konfirmasi (argumen `--force`) sebelum `sync({force:true})`.
  - Kredensial admin dari `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`. Jika `ADMIN_PASSWORD` kosong, hasilkan password acak dan cetak sekali di console. **Jangan hardcode `admin123`.**
- **AC:** Seed di production tanpa `ALLOW_SEED` keluar dengan kode ≠ 0 dan pesan jelas. Tidak ada string `admin123` di repo. Seed pada DB berisi data tanpa `--force` tidak menghapus apa pun.
- **Verifikasi:** `NODE_ENV=production npm run seed` → ditolak. `grep -r "admin123" --exclude-dir=node_modules .` → kosong.

#### T-02 — Migrasi DB dengan `sequelize-cli`
- **Prioritas:** P0 · **Dependensi:** T-00 · **File:** `.sequelizerc`, `migrations/`, `config/`, `package.json`
- **Spesifikasi:**
  - Pasang `sequelize-cli`, buat migrasi **baseline** yang mereproduksi skema §5.1 (idempoten: aman dijalankan pada DB yang sudah ada, mis. cek `describeTable`).
  - Tambah script `npm run migrate` dan `npm run migrate:undo`.
  - Ganti `sequelize.sync()` di `app.js` dengan tidak melakukan sinkronisasi skema otomatis di production (boleh tetap `sync()` hanya jika `NODE_ENV=development`). Sesuaikan README.
- **AC:** DB kosong + `npm run migrate` menghasilkan skema yang sama dengan §5.1. DB lama tidak rusak. `npm start` berjalan di keduanya. Aturan: semua tugas bagian skema (T-10, T-11, T-12, T-13, T-14, T-30, T-31, T-32, T-40) menambah migrasi baru, bukan edit migrasi baseline.

---

### FASE 1 — Kesan Pertama untuk HRD (nilai tertinggi)

#### T-10 — CV PDF yang jelas dan dapat diunduh
- **Prioritas:** P1 · **Dependensi:** T-02 · **File:** `models/Profile`, `routes/admin.js`, `routes/public.js`, `adminController`, `homeController`, `views/layouts/main`, view home & about, view admin profile, `public/js/resumeGenerator.js`
- **Spesifikasi:**
  1. Migrasi: tambah `profiles.resume_file` (path relatif ke `public/uploads/resume/`).
  2. Admin `/admin/profile`: field upload **PDF** (mime `application/pdf`, ≤ 5 MB). File lama dihapus saat diganti. Nama file disimpan acak/aman, bukan nama asli dari pengguna.
  3. `GET /resume`: jika `resume_file` ada → kirim PDF dengan `Content-Disposition: attachment; filename="CV-<full_name-slug>.pdf"`. Jika tidak ada tapi `resume_url` terisi → redirect ke `resume_url`. Jika keduanya kosong → 404 halaman bertema.
  4. Tombol **"Download CV"** terlihat di: hero Home, navbar (desktop & mobile), footer, dan halaman About. Tombol disembunyikan jika tidak ada CV.
  5. `secretResumeBtn` dipertahankan (tidak dihapus), tapi bukan lagi satu-satunya jalur.
- **AC:**
  - Mengunggah non-PDF atau > 5 MB ditolak dengan pesan jelas dan tidak tersimpan.
  - `GET /resume` mengembalikan `200` + `application/pdf` bila CV ada.
  - Tombol terlihat tanpa scroll di mobile 375px pada Home.
  - Mengganti CV menghapus file lama dari disk.
- **Verifikasi:** `curl -I http://localhost:3005/resume` → `200`, `Content-Type: application/pdf`.

#### T-11 — Hero: role jelas + status ketersediaan + CTA
- **Prioritas:** P1 · **Dependensi:** T-02 · **File:** `models/Profile`, admin profile view, home view, `style.css`
- **Spesifikasi:**
  1. Migrasi `profiles`: `headline` (mis. "Backend Developer — Node.js & MySQL"), `availability_status`, `work_preference` (mis. "Remote / Hybrid / Onsite — Surabaya").
  2. Form admin untuk ketiga field.
  3. Hero menampilkan berurutan: nama → `headline` → badge status (hijau "Open to work", biru "Terbuka untuk freelance", abu-abu tidak tampil bila `not_available`) → lokasi + `work_preference` → dua CTA: **Download CV** (T-10) dan **Hubungi Saya** (link ke `/contact`).
  4. Jika `headline` kosong, fallback ke `tagline` lama.
- **AC:** Semua elemen hero tampil benar dengan data lengkap dan tetap rapi dengan data kosong (tidak ada teks "undefined"/"null"). CTA terlihat di atas lipatan (above the fold) pada 375×667.

> **Revisi berdasarkan review tampilan hero (screenshot 2026-10-03).** Sub-tugas T-11a–T-11d di bawah **menggantikan butir 3 spesifikasi T-11 di atas** jika bertentangan. Kerjakan berurutan a → d.

##### T-11a — Nama tampilan "Malvix"
- **Latar belakang:** Nama lengkap "Muhammad Alvi Kirana Zulfan Nazal" memakai 3 baris besar di hero dan mendorong CTA keluar dari layar pertama.
- **Spesifikasi:**
  1. Migrasi: `profiles.display_name` STRING(40), nullable. Isi awal lewat admin dengan nilai **`Malvix`** (jangan hard-code di view; jangan ubah `full_name`).
  2. Helper `displayName(profile)` = `display_name || full_name`. Dipakai di semua tempat di bawah.
  3. **Hero H1:** `Hello, I'm <span class="accent">Malvix</span>` (maksimal 1–2 baris). Tepat di bawahnya, satu baris kecil berwarna redup berisi `full_name` lengkap, supaya HRD bisa mencocokkan dengan CV.
  4. **Navbar brand:** `<Malvix />` (gaya kode yang sudah ada dipertahankan).
  5. **Tetap memakai `full_name`:** halaman About, hasil CV/resume generator, judul file unduhan CV (`CV-<full_name-slug>.pdf`), footer hak cipta, `og:site_name`, dan JSON-LD `Person.name`. JSON-LD ditambah `alternateName: display_name`.
  6. **`<title>` dan `og:title` Home:** `Malvix — <full_name> | <headline>`.
  7. Field "Nama tampilan" ditambahkan ke form `/admin/profile` (maks 40 karakter, trim).
- **AC:** H1 hero tidak lebih dari 2 baris di 375px dan 1280px. Jika `display_name` kosong, tampilan jatuh ke `full_name` tanpa error. Nama lengkap tetap terbaca di hero (baris kecil), About, dan nama file CV.

##### T-11b — Hero muat di layar pertama
- **Spesifikasi:** Atur ulang jarak dan ukuran font (gunakan `clamp()`) agar urutan **nama → headline → badge → lokasi → bio → CTA** seluruhnya terlihat tanpa scroll pada viewport **1280×628** dan **375×667**. Tidak ada elemen terpotong separuh di tepi bawah.
- **AC:** Tombol CTA utama terlihat penuh (tidak terpotong) pada kedua viewport. Tidak ada scroll horizontal.

##### T-11c — Hierarki CTA & chip teknologi
- **Spesifikasi:**
  1. **Tombol utama (filled):** Download CV. **Tombol sekunder (outline):** View Projects (ke `/projects`). **Tersier (link teks/ikon):** Contact Me (ke `/contact`).
  2. Di bawah CTA, tampilkan maksimal **5 chip teknologi** dari skill dengan `proficiency` tertinggi (urut `proficiency` desc lalu `sort_order`). Sembunyikan baris bila tidak ada skill.
  3. Navbar tetap memuat tombol Download CV yang sudah ada.
- **AC:** Hanya satu tombol dengan gaya filled di hero. Chip tidak lebih dari 5 dan tidak membuat hero lebih tinggi dari batas T-11b.

##### T-11d — Bio utuh, badge kontekstual, bahasa konsisten
- **Spesifikasi:**
  1. Teks pendek di hero memakai `about_summary` (T-31); jika kosong, fallback ke `bio`. **Dilarang memotong string di server dengan "..."** (kalimat tidak boleh berakhir menggantung). Gunakan CSS `line-clamp` hanya jika terpaksa, dan pastikan teks sumber memang ringkas (≤ 200 karakter).
  2. Badge status: `Open to work · <work_preference>` (mis. "Open to work · Fresh Graduate · Surabaya, Remote/Onsite"). Warna badge mengikuti `availability_status` (T-11).
  3. **Satu bahasa untuk seluruh teks UI hero & navbar.** Default **Inggris** (konten sudah berbahasa Inggris): "Download CV", "View Projects", "Contact Me". Bila pemilik memilih Indonesia (lihat Q6), ganti sekali di satu tempat (berkas string/konstanta), bukan tersebar di view.
  4. Naikkan kontras teks sekunder (bio, lokasi, nama lengkap) minimal **4.5:1** terhadap latar.
- **AC:** Tidak ada kalimat bio yang berakhir dengan "..." di hero. Tidak ada campuran bahasa di hero dan navbar. Kontras teks sekunder lolos pemeriksaan 4.5:1 (cek dengan DevTools/Lighthouse).

#### T-17 — Fallback foto profil (BUG, kerjakan paling awal di Fase 1)
- **Prioritas:** P0 · **Dependensi:** T-00 · **File:** hero di `views/` Home, `public/js/imageUtils.js`, `helpers/imageHelper.js`, `style.css`
- **Latar belakang:** Pada tampilan live, lingkaran foto di hero kosong dan hanya menampilkan teks `alt` yang terpotong. Penyebab belum diketahui (URL eksternal gagal lewat proxy, path salah, atau file hilang).
- **Spesifikasi:**
  1. **Diagnosis dulu:** cek nilai `profile_image` di DB, hasil `getImageUrl()`, dan status respons `/api/image-proxy` atau file di `public/uploads`. Catat penyebabnya di `docs/CHANGELOG-AGENT.md`, lalu perbaiki akar masalahnya.
  2. **Fallback visual:** bila gambar gagal dimuat (`onerror`) atau `profile_image` kosong, tampilkan avatar berisi **inisial** dari `displayName(profile)` (mis. "M") di lingkaran yang sama, dengan gradien senada tema. Teks `alt` tidak boleh terlihat sebagai konten.
  3. Beri `width`/`height` eksplisit pada elemen gambar agar tidak terjadi layout shift; tambah `loading="eager"` + `fetchpriority="high"` (gambar hero adalah kandidat LCP).
  4. Berlaku sama untuk foto profil di halaman About.
  5. Jika sumber foto adalah URL eksternal, sarankan di panel admin (teks bantuan di bawah field) untuk mengunggah file langsung. Pastikan domain foto lolos whitelist saat T-20 dikerjakan.
- **AC:** Dengan `profile_image` berisi URL rusak, hero menampilkan avatar inisial (bukan teks alt). Dengan gambar valid, foto tampil di dalam lingkaran. Tidak ada request gambar gagal yang berulang di tab Network.
- **Verifikasi:** Set `profile_image` ke URL sengaja salah → buka Home → lingkaran berisi inisial "M". Kembalikan ke URL benar → foto tampil.

#### T-12 — Kontak langsung
- **Prioritas:** P1 · **Dependensi:** T-02 · **File:** `models/Profile`, admin profile view, `layouts/main`, view contact
- **Spesifikasi:**
  - Migrasi: `profiles.whatsapp` (format internasional tanpa `+`, mis. `6281234567890`).
  - Footer dan halaman Contact menampilkan: `mailto:<email>`, link LinkedIn, GitHub, dan WhatsApp (`https://wa.me/<whatsapp>`). Item kosong tidak ditampilkan.
  - Semua link eksternal memakai `target="_blank" rel="noopener noreferrer"`.
  - Form kontak tetap ada.
- **AC:** Link benar di footer semua halaman; tidak ada link kosong/rusak saat field tidak diisi.

#### T-13 — SEO dasar & Open Graph
- **Prioritas:** P1 · **Dependensi:** T-02 · **File:** `views/layouts/main`, partial baru `views/partials/meta.ejs`, `routes/public.js`, `.env.example`
- **Spesifikasi:**
  1. Env `SITE_URL` (mis. `https://namakamu.com`), dipakai untuk URL absolut.
  2. Partial `meta.ejs` menerima `title`, `description`, `image`, `path`. Menghasilkan: `<title>`, `meta description`, `canonical`, `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card=summary_large_image`.
  3. Default deskripsi dari `profile.headline` + ringkasan. Detail project memakai judul + deskripsi project + gambar project. `og_image` default dari `profiles.og_image` atau foto profil.
  4. Gambar OG harus URL absolut; jika sumber eksternal, gunakan URL absolut hasil `getImageUrl`.
  5. `GET /sitemap.xml` memuat semua halaman publik + `/projects/:slug` yang `published` (lihat T-14).
  6. `GET /robots.txt`: `Allow: /`, `Disallow: /admin`, `Disallow: /api/`, plus `Sitemap:`.
  7. Tambahkan JSON-LD `Person` di Home (name, jobTitle, url, sameAs: LinkedIn/GitHub).
- **AC:** Setiap halaman publik punya `<title>` unik dan `description` unik. Sitemap valid XML. Semua tag OG ada di Home dan detail project.
- **Verifikasi:** `curl -s localhost:3005/ | grep -c 'og:'` ≥ 5; `curl -s localhost:3005/robots.txt` memuat `Disallow: /admin`.

#### T-14 — Project bercerita + kurasi
- **Prioritas:** P1 · **Dependensi:** T-02 · **File:** `models/Project`, `adminController`, `services/github.js`, admin project form, view project detail, home view
- **Spesifikasi:**
  1. Migrasi `projects`: `problem`, `role`, `impact`, `demo_url`, `status` (default `published` agar data lama tetap tampil).
  2. Form admin project: field baru + dropdown status.
  3. Halaman detail project menampilkan blok bertajuk **Masalah**, **Peran Saya**, **Dampak/Hasil**, tombol **Live Demo** (jika `demo_url`) dan **Kode di GitHub** (jika `github_url`). Blok kosong tidak tampil.
  4. Home menampilkan **maksimal 3** project `is_featured=true` dan `status='published'` (urut `sort_order`). Ubah dari batas 6. Tampilkan juga link "Lihat semua project".
  5. `/projects`, `/projects/:slug`, sitemap hanya memuat `status='published'`. Slug `draft` → 404 untuk publik (admin tetap bisa pratinjau lewat panel).
  6. **Impor GitHub:** project hasil impor berstatus `draft`. Cegah duplikat berdasarkan `github_repo_name`: repo yang sudah ada dilewati dan dilaporkan di pesan hasil impor ("X diimpor, Y dilewati"). Slug dijamin unik (tambahkan akhiran `-2`, `-3`, dst. bila bentrok).
  8. Admin list project menampilkan badge status dan indikator kelengkapan (ada gambar? ada deskripsi?).
- **AC:** Data project lama tetap tampil tanpa edit. Impor repo yang sama dua kali tidak menggandakan. Home tidak pernah lebih dari 3 project. Draft tidak muncul di publik.

#### T-15 — Notifikasi email pesan kontak
- **Prioritas:** P1 · **Dependensi:** T-16 · **File:** `services/mailer.js` (baru), `homeController`, `.env.example`
- **Spesifikasi:**
  - Pasang `nodemailer`. `services/mailer.js` mengekspor `sendContactNotification(contact)`.
  - Aktif hanya jika `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_TO` terisi; jika tidak, lewati tanpa error.
  - Pesan **tetap disimpan ke DB terlebih dahulu**. Pengiriman email dijalankan setelahnya dan **kegagalannya tidak boleh menggagalkan respons ke pengunjung** (log error saja).
  - Isi email: nama, email pengirim (set `replyTo`), subjek, pesan, tautan ke `/admin/contacts/:id`. Semua konten pengguna di-escape bila HTML.
- **AC:** Dengan SMTP valid → email terkirim. Dengan SMTP salah/kosong → form tetap sukses, record tersimpan, error hanya di log.

#### T-16 — Pesan kontak via flash (bukan query string)
- **Prioritas:** P1 · **File:** `app.js`, `homeController`, view contact
- **Spesifikasi:** Hapus pemakaian `?success=`/`?error=` untuk pesan. Gunakan `connect-flash` (pastikan dipasang di `app.js` setelah session) dan render dengan escape. Hapus `express-flash` jika tidak dipakai. Validasi gagal mempertahankan input yang sudah diketik (name/email/subject/message) dan menampilkan pesan per-field.
- **AC:** Mengakses `/contact?error=<script>alert(1)</script>` tidak menampilkan apa pun dari query. Pesan sukses/gagal tetap muncul setelah submit.

---

### FASE 1B — Hardening (bisa paralel dengan Fase 1, kecuali dinyatakan)

#### T-20 — Amankan `/api/image-proxy` (SSRF)
- **Prioritas:** P1 · **File:** `controllers/imageController`, `routes/public.js`
- **Spesifikasi:**
  1. Hanya `http(s)`; tolak skema lain.
  2. **Whitelist hostname**: `drive.google.com`, `lh3.googleusercontent.com`, `*.googleusercontent.com`, `dl.dropboxusercontent.com`, `www.dropbox.com`, `onedrive.live.com`, `1drv.ms`, `*.sharepoint.com`, `raw.githubusercontent.com`, `avatars.githubusercontent.com`. Tolak lainnya dengan 400.
  3. Resolusi DNS lalu **blokir IP privat/loopback/link-local** (10/8, 172.16/12, 192.168/16, 127/8, 169.254/16, ::1, fc00::/7, fe80::/10). Validasi ulang pada setiap redirect (`maxRedirects` maksimal 3, cek tiap hop).
  4. Batas ukuran respons (mis. 8 MB, `maxContentLength`), timeout tetap 10 s.
  5. Hanya teruskan jika `Content-Type` diawali `image/` dan **bukan `image/svg+xml`**.
  6. Pertahankan fallback piksel transparan dan cache 24 jam.
  7. Konsolidasikan `convertImageUrl` ke `helpers/imageHelper.js` (hapus duplikat).
- **AC:** `?url=http://127.0.0.1:3005/admin`, `?url=http://169.254.169.254/`, `?url=file:///etc/passwd`, dan domain di luar whitelist semuanya ditolak. URL Drive/Dropbox sah tetap berfungsi.
- **Verifikasi:** Cek manual dengan `curl` pada 4 kasus tolak + 1 kasus sah.

#### T-21 — Proteksi CSRF
- **Prioritas:** P1 · **File:** `app.js`, semua form POST di `views/` (admin + contact)
- **Spesifikasi:** `csurf` sudah deprecated. Gunakan `csrf-csrf` (double-submit) atau implementasi token sesi sederhana. Sediakan `res.locals.csrfToken`, sisipkan `<input type="hidden" name="_csrf">` di **setiap** form POST/PUT/DELETE (termasuk yang memakai `method-override` dan form upload multipart). Untuk multipart, pastikan token terbaca setelah multer atau kirim lewat query `?_csrf=`.
- **AC:** POST tanpa/ dengan token salah → 403 halaman bertema. Semua form yang ada tetap berfungsi (cek login, kontak, CRUD, upload, hapus, impor GitHub).

#### T-22 — Rate limiting & anti-spam
- **Prioritas:** P1 · **File:** `app.js`/`routes`, view contact
- **Spesifikasi:** Pasang `express-rate-limit`.
  - `POST /admin/login`: 5 percobaan / 15 menit per IP.
  - `POST /contact`: 5 kirim / jam per IP.
  - `/api/image-proxy`: 60 / menit per IP.
  - Honeypot di form kontak (field tersembunyi `website`; jika terisi → anggap sukses palsu tanpa menyimpan).
  - Batas panjang: name ≤ 100, email ≤ 150 dan valid, subject ≤ 150, message ≤ 3000.
- **AC:** Percobaan ke-6 login mengembalikan 429 dengan pesan ramah. Honeypot terisi tidak membuat record. Karena `trust proxy` aktif, pastikan IP klien dibaca benar.

#### T-23 — Session & cookie aman
- **Prioritas:** P2 · **File:** `app.js`
- **Spesifikasi:**
  - Di production, **proses berhenti dengan pesan jelas** jika `SESSION_SECRET` kosong/`default-secret`.
  - Cookie: `httpOnly: true`, `sameSite: 'lax'`, `secure: true` bila `NODE_ENV=production`.
  - Ganti MemoryStore dengan store persisten (`express-mysql-session` memakai koneksi MySQL yang sama; perhatikan pool max 2 pada shared hosting — beri pool terpisah kecil atau gunakan store file jika keterbatasan koneksi).
  - Regenerate session ID setelah login berhasil.
- **AC:** Restart server tidak melogout admin (jika store persisten aktif). Header `Set-Cookie` memuat `HttpOnly; SameSite=Lax` (+`Secure` di production).

#### T-24 — Header keamanan (`helmet`)
- **Prioritas:** P2 · **Dependensi:** T-13 selesai (agar CSP tahu semua sumber) · **File:** `app.js`
- **Spesifikasi:** Pasang `helmet`. Atur CSP agar tidak merusak: gambar dari Drive/Dropbox/GitHub/googleusercontent (`img-src 'self' data: https:`), font/CDN yang dipakai situs, dan skrip inline yang ada (utamakan menggeser ke file `.js`; bila belum bisa, gunakan nonce). Uji setiap halaman publik dan admin.
- **AC:** Tidak ada error CSP di console browser pada seluruh halaman §4.1/§4.2. Header `X-Content-Type-Options`, `Referrer-Policy`, dst. hadir.

#### T-25 — Keamanan upload
- **Prioritas:** P2 · **File:** konfigurasi multer di `routes/admin.js`, `adminController`
- **Spesifikasi:**
  - Larang SVG upload (hapus `svg` dari daftar yang diizinkan) **atau** sanitasi dengan library khusus; pilih larang agar sederhana.
  - Verifikasi isi file (magic bytes), bukan hanya ekstensi/mime.
  - Nama file di-generate acak.
  - Saat gambar diganti atau record dihapus, hapus file lama dari `public/uploads` (hanya jika path berada di dalam folder uploads; jangan menghapus URL eksternal).
- **AC:** Upload `.svg` atau file berekstensi palsu ditolak. Setelah ganti/hapus, file lama hilang dari disk.

---

### FASE 2 — Kredibilitas & Kualitas

#### T-30 — Testimoni / rekomendasi
- **Prioritas:** P2 · **Dependensi:** T-02, T-21 · **File:** model `Testimonial`, migrasi, CRUD admin, home view
- **Spesifikasi:** Tabel `testimonials` (§5.2), CRUD di `/admin/testimonials*` mengikuti pola CRUD yang ada, tampil di Home (maks 3, `is_visible=true`, urut `sort_order`). Bagian disembunyikan jika kosong.
- **AC:** CRUD berfungsi; Home tidak menampilkan section kosong.

#### T-31 — About lebih manusiawi
- **Prioritas:** P2 · **Dependensi:** T-02 · **Spesifikasi:** Tambah `about_summary` (1 paragraf singkat) dan `looking_for` (posisi/jenis peran yang dicari) ke profil + form admin. Halaman About menampilkan keduanya di atas bio panjang. Home menampilkan `about_summary` ringkas bila ada.
- **AC:** Tampil dengan benar; fallback ke `bio` bila kosong.

#### T-32 — Sorot sertifikat relevan
- **Prioritas:** P2 · **Dependensi:** T-02 · **Spesifikasi:** Tambah `certificates.is_highlight`. Home menampilkan sertifikat `is_highlight=true` (maks 4); jika belum ada yang di-highlight, fallback ke 4 terbaru seperti sekarang. Halaman `/certificates` menambahkan filter kategori sisi-klien (Backend/Frontend/AI/Other).
- **AC:** Perilaku lama tetap jika tidak ada highlight; filter berfungsi tanpa reload.

#### T-33 — Portofolio sebagai bukti skill
- **Prioritas:** P3 · **Spesifikasi:** Tambahkan satu entri project khusus "Web Portofolio ini" (lewat admin/seed contoh, **bukan** hard-code) berisi problem/role/impact/stack/link repo. Pastikan README repo berisi: deskripsi, screenshot, cara instal, env, arsitektur singkat.
- **AC:** README tidak mengandung karakter rusak; ada instruksi `npm run migrate`, `npm start`, dan env lengkap.

#### T-34 — Tes otomatis & CI
- **Prioritas:** P2 · **Dependensi:** T-02, T-14, T-20, T-21 · **File:** `tests/`, `package.json`, `.github/workflows/ci.yml`
- **Spesifikasi:** Jest + Supertest, gunakan DB uji terpisah (env `DB_NAME_TEST`, jangan pernah memakai DB produksi). Minimal tes:
  1. Semua rute publik §4.1 → 200 (slug tak dikenal → 404; draft → 404).
  2. `/admin/*` tanpa login → redirect `/admin/login`.
  3. Form kontak valid → 1 record; kosong → ditolak; honeypot → tidak menyimpan.
  4. `/api/image-proxy` menolak URL privat/non-whitelist.
  5. `GET /resume` → 404 bila tidak ada CV; 200 PDF bila ada.
  6. Impor GitHub tidak menggandakan (mock `services/github.js`).
  Workflow CI: install → migrate (DB service MySQL) → `npm test`.
- **AC:** `npm test` hijau lokal dan di CI.

#### T-35 — Kebersihan repo
- **Prioritas:** P3
- **Spesifikasi:** Pindahkan `create_db.js`, `test_db_ipv4.js` ke `scripts/`; hapus dependensi yang tidak dipakai (hasil T-00); pastikan `.env` ada di `.gitignore` dan tidak pernah ter-track (`git ls-files | grep .env`); tambah `LICENSE` (tanyakan pemilik jenis lisensi — default MIT bila tidak dijawab); perbaiki encoding README ke UTF-8; buat `.env.example` lengkap.
- **AC:** Repo bersih sesuai daftar; `git ls-files` tidak memuat `.env`.

---

### FASE 3 — Fitur Lanjutan (kerjakan hanya setelah Fase 1 & 2 selesai)

| ID | Fitur | Catatan spesifikasi |
|---|---|---|
| T-40 | Analitik ringan | Tabel `events` mencatat: unduhan CV, klik Hubungi/WhatsApp/email, tampilan detail project. **Tanpa cookie pelacak pihak ketiga, tanpa menyimpan IP mentah** (hash harian atau tidak sama sekali). Ringkasan tampil di dashboard admin: 30 hari terakhir. |
| T-41 | Multibahasa ID/EN | Berkas terjemahan UI statis; konten dinamis (project, bio) dapat memiliki kolom `_en` opsional. Penentuan bahasa lewat `?lang=` + cookie, default ID. |
| T-42 | Pagination & filter | `/projects` dan `/certificates` dengan filter kategori/teknologi, pagination bila > 12 item. |
| T-43 | Drag-and-drop `sort_order` | Untuk project dan skill di admin, simpan lewat endpoint batch. |
| T-44 | Dashboard admin | Tambah ringkasan: pesan belum dibaca, project draft, kelengkapan profil (CV, headline, foto, OG). |

---

## 7. Urutan Eksekusi Ringkas

```
T-00 → T-01 → T-02
  → T-17 (bug foto) → T-11a → T-11b → T-11c → T-11d
  → (T-16 → T-15) · T-10 · T-12 · T-14 · T-13
  → T-20 · T-21 · T-22 · T-23 · T-25 → T-24
  → T-34 (tes) → T-30 · T-31 · T-32 · T-33 · T-35
  → Fase 3 (T-40 … T-44)
```

---

## 8. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| Performa | Render server < 1 detik di VPS kecil; LCP < 2 detik di 4G (ukur dengan Lighthouse mobile); pool DB kecil tetap dihormati; gambar OG & foto dioptimalkan (ukuran wajar, `loading="lazy"` untuk gambar di bawah lipatan). |
| Keamanan | Lihat T-20–T-25; password bcrypt; admin di belakang session; `trust proxy` aktif. |
| Keandalan | Retry koneksi DB 5×; kegagalan email tidak menghalangi penyimpanan pesan. |
| Responsif | Mobile-first (uji 375px) untuk publik dan admin. |
| Aksesibilitas | `alt` pada semua gambar, kontras teks memadai, tombol dapat difokus dengan keyboard, label pada semua input form. |
| SEO | Lihat T-13. Target skor Lighthouse SEO ≥ 90. |
| Deployability | VPS Ubuntu 22.04 + Nginx + SSL (`how_host_this_web.md`); migrasi dijalankan sebagai bagian dari deploy. |
| Maintainability | MVC; env via `.env`; `.env.example` selalu mutakhir. |

---

## 9. Kriteria Penerimaan Global

- Semua halaman publik §4.1 merespons 200 dengan data DB; slug tak dikenal atau berstatus draft → 404.
- Form kontak valid membuat tepat 1 record dan menampilkan sukses; field wajib kosong ditolak; honeypot tidak menyimpan.
- `/admin/*` tanpa login selalu redirect ke `/admin/login`, lalu kembali ke halaman asal setelah login.
- Upload di luar tipe/ukuran yang diizinkan tidak tersimpan.
- Impor GitHub tidak menggandakan repo dan menghasilkan project `draft`.
- Aplikasi start kembali setelah kegagalan DB sementara (≤ 5 percobaan).
- **HRD flow:** dari Home, pengunjung dapat (a) membaca role + status kerja tanpa scroll, (b) mengunduh CV dalam 1 klik, (c) menghubungi lewat email/LinkedIn/WhatsApp, (d) membuka ≥ 1 project dengan cerita lengkap.
- Membagikan URL Home dan detail project ke WhatsApp/LinkedIn menampilkan preview (periksa dengan alat validasi OG).

---

## 10. Metrik Keberhasilan

| Metrik | Target | Cara ukur |
|---|---|---|
| Unduhan CV | Tercatat & tren naik | T-40 |
| Klik kontak (email/WA/LinkedIn) | Tercatat | T-40 |
| Pesan kontak masuk tersimpan | 100% | DB vs log |
| Notifikasi email terkirim | ≥ 95% bila SMTP aktif | Log mailer |
| LCP halaman utama | < 2 s pada 4G | Lighthouse |
| Lighthouse SEO | ≥ 90 | Lighthouse |
| Insiden keamanan setelah Fase 1B | 0 | Log/pemantauan |
| Waktu update konten per item | < 2 menit | Manual |
| **Hasil akhir** | Jumlah panggilan wawancara | Dicatat pemilik |

---

## 11. Temuan Awal (referensi, sudah dipetakan ke tugas)

| # | Prioritas | Temuan | Tugas |
|---|---|---|---|
| 1 | Tinggi | Seed destruktif + admin default `admin/admin123` | T-01 |
| 2 | Tinggi | Image proxy menerima URL arbitrer (SSRF) | T-20 |
| 3 | Tinggi | Tanpa CSRF | T-21 |
| 4 | Tinggi | Tanpa rate limit login/kontak | T-22 |
| 5 | Sedang | MemoryStore, secret default, cookie tanpa flag | T-23 |
| 6 | Sedang | Tanpa header keamanan | T-24 |
| 7 | Sedang | Upload SVG berisiko, file yatim | T-25 |
| 8 | Sedang | Pesan kontak di query string | T-16 |
| 9 | Sedang | `sync()` tanpa migrasi; dokumentasi tidak konsisten | T-02 |
| 10 | Rendah | `convertImageUrl` duplikat | T-20 |
| 11 | Rendah | Paket flash/method-override tak terpakai | T-00, T-16, T-35 |
| 12 | Rendah | `.env` di repo lokal | T-35 |
| 13 | Rendah | Skrip bantu di root, README rusak, LICENSE hilang | T-33, T-35 |
| 14 | Rendah | Tanpa tes/CI/pagination | T-34, T-42 |
| 15 | **Baru** | CV tersembunyi & TXT; hero tak spesifik; project tanpa cerita; tanpa OG; tanpa notifikasi email | T-10–T-16 |

---

## 12. Pertanyaan Terbuka (jawab pemilik, atau agent memakai default)

| # | Pertanyaan | Default bila tak dijawab |
|---|---|---|
| Q1 | Domain final untuk `SITE_URL`? | Wajib diisi pemilik sebelum deploy; di dev gunakan `http://localhost:3005` |
| Q2 | Penyedia SMTP (Gmail App Password / Brevo / Mailgun)? | Fitur email nonaktif sampai env diisi |
| Q3 | Jenis lisensi? | MIT |
| Q4 | Role target & teks hero final? | Isi lewat admin, bukan hard-code |
| Q5 | Hosting production: VPS atau shared (batas koneksi DB)? | Anggap pool max 2 tetap berlaku |
| Q6 | Bahasa utama UI: Inggris atau Indonesia? | Inggris (lihat T-11d) |

---

## 13. Dokumen Terkait
`README.md`, `how_host_this_web.md`, `IMAGE_URL_GUIDE.md`, `AGENT.md`, `docs/CHANGELOG-AGENT.md` (dibuat oleh T-00)
