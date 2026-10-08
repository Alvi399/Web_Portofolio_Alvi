# AGENT.md — Panduan untuk AI Agent

Proyek: **Web Portofolio Alvi** — portofolio dinamis dengan Admin Panel. Detail produk: lihat [PRD.md](./PRD.md).

## 1. Stack Singkat
Node.js, Express 5, EJS + express-ejs-layouts, Sequelize 6 + MySQL, express-session + bcryptjs, multer, axios. **CommonJS** (`require`/`module.exports`), bukan ESM. Tanpa framework frontend; JS/CSS vanilla.

## 2. Perintah
```bash
npm install
npm run dev     # nodemon app.js (port dari .env, default 3005)
npm start       # produksi
npm run seed    # DESTRUKTIF: drop & recreate semua tabel + admin/admin123
```
Tidak ada test, linter, atau build step. Jangan mengklaim tes lulus; verifikasi dengan menjalankan server dan memeriksa halaman terkait bila memungkinkan.

## 3. Struktur & Tanggung Jawab
| Path | Fungsi |
|---|---|
| `app.js` | Bootstrap, session, `res.locals` (`user`, `getImageUrl`), mount route, 404, start dengan retry DB |
| `config/db.js` | Instance Sequelize (dari `.env`) |
| `models/*.js` | Definisi model; **daftarkan model baru di `models/index.js`** |
| `routes/public.js`, `routes/admin.js` | Definisi rute; admin dilindungi `isAuthenticated` setelah rute login |
| `controllers/homeController.js` | Halaman publik |
| `controllers/adminController.js` | Semua handler admin (CRUD) |
| `controllers/imageController.js` | Image proxy |
| `services/github.js` | Klien GitHub API |
| `helpers/imageHelper.js` | `getImageUrl` (dipakai di view) |
| `views/` | EJS publik; `views/admin/*` admin; `views/layouts/{main,admin}.ejs` |
| `public/` | Aset statis; `public/uploads` = upload runtime |

## 4. Konvensi Kode
- Pertahankan gaya yang ada: CommonJS, `async/await`, `try/catch` di tiap handler, `console.error(err)` lalu render `error` dengan status 500.
- Controller diekspor sebagai `exports.namaHandler = async (req, res) => {…}`.
- Setiap `res.render` halaman publik mengirim `title`, `profile` (`profile || {}`), dan `currentPage` (untuk nav aktif).
- Admin memakai pola **POST-only untuk mutasi** (`/:id`, `/:id/delete`), bukan PUT/DELETE; ikuti pola ini.
- Rute dengan path statis (mis. `/projects/create`) harus dideklarasikan **sebelum** rute `/:id`.
- Field `Project.technologies` disimpan sebagai TEXT JSON lewat getter/setter — selalu assign array, bukan string.
- Gambar: selalu render lewat `getImageUrl(...)` di view; mendukung upload lokal (`image`) maupun URL eksternal (`image_url`).
- Slug project dibuat dengan `slugify`; harus unik.
- Bahasa UI/konten: Inggris untuk tampilan; dokumentasi internal boleh Indonesia.

## 5. Menambah Fitur (Checklist)
**Entitas/CRUD baru:**
1. Buat model di `models/` + ekspor di `models/index.js`.
2. Tambah handler di `adminController.js` + rute di `routes/admin.js` (di bawah `isAuthenticated`).
3. Buat view `views/admin/<nama>/index.ejs`; tambahkan link di `views/layouts/admin.ejs`.
4. Jika tampil publik: handler di `homeController.js`, rute di `routes/public.js`, view, link di `layouts/main.ejs`.
5. Perbarui `seeders/seed.js` bila perlu data contoh, dan [PRD.md](./PRD.md).

**Skema DB:** tidak ada migrasi; app memakai `sequelize.sync()` (tidak mengubah kolom tabel yang sudah ada). Perubahan kolom pada DB yang sudah berjalan perlu SQL/ALTER manual — **beri tahu user**, jangan jalankan `force:true`.

## 6. Aturan Keamanan (WAJIB)
- **Jangan** menjalankan `npm run seed` atau `sync({force:true})` pada DB yang berisi data tanpa persetujuan eksplisit user.
- **Jangan** membaca, mencetak, atau meng-commit isi `.env`; gunakan `.env.example` sebagai acuan.
- Jangan hardcode kredensial/secret. Jangan menambah fallback secret baru.
- Setiap rute admin baru harus di belakang `isAuthenticated`.
- Escape output di EJS (`<%= %>`); hindari `<%- %>` untuk data pengguna.
- Input upload: jaga batas tipe & ukuran; jangan melonggarkan.
- Image proxy: jangan memperluas kemampuannya mengambil URL arbitrer (risiko SSRF — lihat PRD §9).
- Hindari menambah dependensi tanpa alasan kuat; sebutkan bila menambahkan.

## 7. Known Issues (jangan "diperbaiki" diam-diam di luar scope)
Lihat [PRD.md §9](./PRD.md). Ringkas: tanpa CSRF, tanpa rate limit, SSRF di proxy, session MemoryStore, seed destruktif, helper URL gambar duplikat (`imageController.convertImageUrl` vs `imageHelper.getImageUrl`; yang dipakai view adalah `imageHelper`), dependensi flash/method-override belum terpakai. Bila diminta memperbaikinya, kerjakan sesuai rekomendasi di PRD.

## 8. Cara Bekerja
1. Baca file terkait sebelum mengubah; ubah seminimal mungkin dan sesuai pola yang ada.
2. Jangan menghapus komentar/dokumentasi yang tidak terkait perubahan.
3. Jangan menyentuh `node_modules/` dan `public/uploads/` (data runtime).
4. Jangan commit/push kecuali diminta.
5. Setelah perubahan, jelaskan file yang diubah dan cara memverifikasi. Jika sesuatu tidak bisa diuji (butuh MySQL), katakan terus terang.
6. Ragu soal maksud user → tanya, jangan berasumsi.

## 9. Deployment
VPS Ubuntu + Nginx reverse proxy + SSL; `trust proxy` sudah aktif. Detail: `how_host_this_web.md`. Env produksi wajib: `DB_*`, `SESSION_SECRET` kuat, `NODE_ENV=production`, `PORT`.

## 10. Dokumen Terkait
[PRD.md](./PRD.md) · [README.md](./README.md) · [how_host_this_web.md](./how_host_this_web.md) · [IMAGE_URL_GUIDE.md](./IMAGE_URL_GUIDE.md)
