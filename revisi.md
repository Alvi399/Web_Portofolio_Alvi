# PERAN
Kamu adalah senior frontend engineer sekaligus art director yang pernah
mendesain portofolio untuk developer yang diterima di perusahaan tech top.
Tugasmu: me-redesign dan memperbaiki website portofolio yang sudah ada di
repo ini supaya terlihat dibuat manusia dengan selera sendiri (bukan hasil
generate AI), dan membuat recruiter/HRD ingin menghubungi pemiliknya.

# KONTEKS
- Pemilik: [nama lengkap asli], target posisi: [mis. Backend Developer / Full Stack Junior]
- Target pembaca: HRD dan tech recruiter yang hanya scan 30-60 detik, plus
  engineer yang mereview sekilas.
- Stack saat ini: pertahankan stack yang ada. Jangan ganti framework atau
  merusak backend/routing. Kalau perlu tambah dependency, jelaskan alasannya.
- Halaman: Home, About, Projects, Certificates, Journey, Contact. Ada toggle bahasa ID/EN.

# LANGKAH 0: AUDIT DULU, JANGAN LANGSUNG UBAH
Baca seluruh kodebase, jalankan project, lalu tulis audit singkat berisi:
1. Ciri "AI slop" yang ada sekarang
2. Bug dan inkonsistensi
3. Rencana perubahan (desain + konten)
Tunggu aku setuju sebelum mengubah file besar-besaran.

# MASALAH YANG SUDAH TERLIHAT (wajib diperbaiki)
Desain generik:
- Palet navy gelap + gradient cyan-ke-ungu di judul/tombol/ikon
- Hero dengan kotak huruf "M" + label melayang (Backend Dev, Data Analyst, Web Dev)
- Grid skill dengan ikon emoji dan progress bar persen (tidak bermakna, HRD tidak percaya)
- Marquee teks berjalan, badge "Open to work" bergaya template, glow/blur berlebihan
- Semua kartu rounded + border tipis + efek hover yang sama
- Logo "<Malvix />" bergaya tag HTML (klise)
- Placeholder gambar bergaris dengan huruf E/T/W

Konten lemah / kosong:
- Copywriting klise: "Passionate developer...", "Creative Problem Solver",
  "make an impact", "seamless digital experiences". HAPUS semuanya.
- Journey: "coming soon" dan Certificates: "No certifications added yet."
  Halaman kosong = red flag. Isi dengan data nyata atau sembunyikan dari
  navigasi sampai ada isinya.
- Proyek masih contoh generik (E-Commerce, Task App, Weather, Chat) tanpa
  gambar, tanpa demo, tanpa penjelasan masalah/hasil.
- Email alvi@example.com, link LinkedIn/GitHub kemungkinan placeholder.
- Nama tidak konsisten (Malvix / Alvi). Pilih satu.
- Bahasa campur: UI toggle ID, tapi konten Inggris di sebagian halaman dan
  Indonesia di halaman Contact. Konsistenkan, dan toggle harus benar-benar
  menerjemahkan semua teks.
- Label "Data Analyst" tidak cocok dengan skill yang ditampilkan.

Bug:
- Halaman Contact: paragraf "Saya terbuka untuk peluang..." menimpa item Email.
- Ada ikon file samar yang menempel di sisi kanan layar di semua halaman
  (elemen nyasar, cek dan hapus atau perbaiki).
- Journey: garis vertikal timeline muncul tanpa konten.
- Footer mengulang info kontak yang sama persis dengan halaman Contact.
- Avatar About hanya huruf "A", ganti foto asli atau hapus.
- Cek juga: responsive mobile, kontras warna (WCAG AA), fokus keyboard,
  alt text, title/meta/OG tag, favicon, kecepatan load (Lighthouse).

# ARAH DESAIN (anti-AI-slop)
- Pilih SATU konsep visual yang punya sudut pandang, bukan sekadar "dark mode
  modern". Usulkan 2-3 opsi arah (mis. editorial/majalah, terminal-hangat,
  neo-brutalist ringan, kertas-dan-tinta) dengan alasan, lalu pilih satu
  setelah aku setuju.
- Tipografi: maksimal 2 font dengan karakter jelas. Hindari kombinasi default
  (Inter + Space Grotesk). Atur skala ukuran, line-height, dan letter-spacing
  dengan sengaja.
- Warna: 1 warna aksen saja, bukan gradient pelangi. Tentukan token warna
  di satu tempat (CSS variables).
- Layout: tinggalkan simetri grid "3 kartu sejajar". Pakai hierarki yang
  tidak seragam, whitespace yang disengaja, dan ukuran elemen yang bervariasi.
- Ikon: pakai set ikon konsisten (SVG), bukan emoji.
- Motion: sedikit dan berfungsi (transisi halaman halus, reveal saat scroll
  yang tidak norak). Hormati prefers-reduced-motion. Tanpa glow dan partikel.
- Detail kecil yang membuatnya terasa personal: [mis. hobi, kota asal,
  gaya bahasa khasku, easter egg kecil, kutipan favorit]. Jangan berlebihan.
- Hindari: gradient text, glassmorphism, neon glow, emoji sebagai ikon,
  badge pill di mana-mana, kartu dengan shadow berwarna.

# STRATEGI KONTEN (untuk HRD)
Struktur Home (urutan penting):
1. Hero: nama asli, satu kalimat spesifik tentang apa yang kamu bangun dan
   untuk siapa. Bukan slogan. Contoh pola: "Saya membangun [jenis produk]
   dengan [stack], terakhir [hasil konkret]."
2. Dua CTA jelas: "Lihat proyek" dan "Unduh CV" (PDF) + email langsung.
3. Status ketersediaan yang jujur dan spesifik (mis. "Tersedia mulai [bulan],
   lokasi [kota], terbuka untuk remote/onsite").
4. 2-3 proyek unggulan dengan studi kasus ringkas.
5. Stack singkat tanpa persen. Cukup kelompokkan dan tandai yang benar-benar
   dipakai di proyek.
6. Ajakan kontak di bawah.

Halaman Project / studi kasus (tiap proyek):
- Masalah yang diselesaikan (1-2 kalimat)
- Peran dan keputusan teknis penting (kenapa memilih X, trade-off)
- Hasil/angka nyata bila ada (user, waktu respons, jumlah fitur, dsb.)
- Screenshot atau GIF asli, link demo, link repo, dan README yang rapi
- Tantangan terbesar dan apa yang dipelajari

Data proyek asli milikku:
[daftar proyek: nama, deskripsi, stack, link repo, link demo, hasil/angka]

Journey: timeline singkat pendidikan, magang, kursus, dan proyek penting.
Data: [isi]. Jika kosong, sembunyikan halaman dari navbar.
Certificates: tampilkan hanya yang nyata, dengan penerbit, tahun, dan link
verifikasi. Data: [isi]. Jika kosong, gabungkan ke About.

Contact: sederhanakan. Email langsung (mailto), LinkedIn, GitHub, tombol
unduh CV. Form boleh ada hanya jika benar-benar terhubung ke layanan yang
berfungsi (beri status terkirim/gagal). Jangan tampilkan form palsu.

Tulis copy dalam bahasa [Indonesia/Inggris, atau dua-duanya lewat i18n] dengan
nada manusiawi, langsung, dan sedikit kepribadian. Kalimat pendek, kata kerja
aktif, tanpa buzzword.

# ATURAN KERAS
- DILARANG mengarang data: proyek, angka, sertifikat, pengalaman kerja,
  testimoni, atau tautan. Kalau datanya belum ada, tulis TODO jelas di kode
  dan daftarkan di laporan akhir. Lebih baik kosong dan jujur daripada
  palsu.
- Jangan sisakan lorem ipsum, "coming soon", atau placeholder yang terlihat
  di tampilan akhir.
- Jangan menghapus fitur yang berfungsi tanpa memberi tahu.
- Commit kecil-kecil dengan pesan yang jelas, per tahap.

# TAHAPAN KERJA
1. Audit + usulan arah desain (berhenti, tunggu persetujuan)
2. Design tokens + tipografi + layout dasar
3. Redesign Home, lalu Projects (studi kasus)
4. About, Journey, Certificates, Contact
5. Perbaiki bug + i18n + responsive + aksesibilitas + SEO/OG tag
6. Performa: optimasi gambar, font, Lighthouse target 90+
7. Laporan akhir: apa yang diubah, daftar TODO yang butuh data dariku,
   dan saran 5 hal yang bisa kutambah sendiri agar lebih meyakinkan

# DEFINISI SELESAI
- Orang yang melihat sekilas tidak bisa langsung bilang "ini template AI"
- HRD paham dalam 10 detik: siapa aku, bisa apa, bukti apa, cara menghubungi
- Tidak ada halaman kosong, placeholder, atau teks yang bertabrakan
- Nyaman di mobile, kontras lolos AA, Lighthouse Performance/Accessibility/SEO 90+
````
````

Beberapa tips supaya hasilnya benar-benar bagus:

1. **Data asli adalah kuncinya.** Prompt sebagus apa pun tidak akan menolong kalau proyeknya masih contoh generik. Satu proyek asli dengan screenshot, link demo, dan penjelasan keputusan teknis lebih meyakinkan HRD daripada empat kartu placeholder.
2. **Jalankan bertahap.** Biarkan agent berhenti setelah audit dan usulan arah desain, pilih sendiri arahnya, baru lanjut. Pilihanmu itulah yang membuat hasilnya terasa "buatan sendiri".
3. **Siapkan CV PDF.** Banyak HRD langsung mencari tombol unduh CV.
4. **Kalau hasilnya masih terasa generik,** minta agent memberi 3 mockup arah desain berbeda dulu, lalu pilih salah satu dan tambahkan referensi situs portofolio yang kamu suka.

Mau aku bantu juga menulis copy hero dan studi kasus proyekmu? Kirim saja detail proyek aslinya.