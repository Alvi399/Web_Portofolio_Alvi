# Image URL Support Guide

## Panduan Menggunakan External Image URLs

Website ini sekarang mendukung berbagai jenis URL untuk menampilkan gambar di bagian Projects, Skills, Journey, dan Certificates.

## Supported Image Sources

### 1. Google Drive

**Format URL yang didukung:**

```
https://drive.google.com/file/d/FILE_ID/view
https://drive.google.com/uc?export=view&id=FILE_ID
```

**Cara menggunakan:**

1. Upload gambar ke Google Drive
2. Klik kanan pada file → Share → Change to "Anyone with the link"
3. Copy link yang muncul
4. Paste langsung ke field Image URL di admin panel

**Contoh:**

```
https://drive.google.com/file/d/1abc123xyz456/view?usp=sharing
```

### 2. Dropbox

**Format URL yang didukung:**

```
https://www.dropbox.com/s/xxxxx/image.jpg?dl=0
https://dl.dropboxusercontent.com/s/xxxxx/image.jpg
```

**Cara menggunakan:**

1. Upload gambar ke Dropbox
2. Klik Share → Create/Copy link
3. Paste link ke field Image URL

### 3. GitHub

**Format URL yang didukung:**

```
https://github.com/user/repo/blob/main/image.jpg
https://raw.githubusercontent.com/user/repo/main/image.jpg
```

**Cara menggunakan:**

1. Upload gambar ke repository GitHub
2. Browse file di GitHub → klik pada gambar
3. Copy URL dari browser atau klik "Download" lalu copy URL
4. Paste ke field Image URL

### 4. OneDrive

**Format URL yang didukung:**

```
https://1drv.ms/i/xxxxx
https://onedrive.live.com/...
```

**Cara menggunakan:**

1. Upload ke OneDrive
2. Klik Share → Copy link
3. Paste ke field Image URL

### 5. Direct Image URLs

**Format yang didukung:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.bmp`

**Contoh:**

```
https://example.com/images/photo.jpg
https://cdn.example.com/image.png
```

## Automatic Features

### 1. URL Conversion

Sistem secara otomatis mengkonversi URL ke format yang paling optimal:

- Google Drive links dikonversi ke format direct view
- Dropbox links disesuaikan untuk direct download
- GitHub links dikonversi ke raw.githubusercontent.com
- OneDrive links menggunakan proxy untuk bypass restrictions

### 2. Error Handling

Jika gambar gagal dimuat:

1. Sistem akan mencoba menggunakan image proxy
2. Jika masih gagal, placeholder akan ditampilkan
3. Tidak ada "broken image" yang terlihat oleh user

### 3. Performance Optimization

- Image proxy menggunakan caching (24 jam)
- Browser caching untuk gambar yang sudah dimuat
- Lazy loading untuk performa optimal

## Troubleshooting

### Gambar tidak muncul dari Google Drive

**Solusi:**

- Pastikan file sharing setting adalah "Anyone with the link"
- Coba copy link lagi dari Google Drive
- Pastikan file adalah image file yang valid

### Gambar tidak muncul dari Dropbox

**Solusi:**

- Pastikan link adalah shareable link
- URL harus diakhiri dengan `?dl=1` atau sistem akan otomatis mengubahnya

### Gambar tidak muncul dari URL lain

**Solusi:**

1. Pastikan URL adalah direct link ke gambar
2. Test URL di browser baru - apakah gambar langsung muncul?
3. Jika tidak, coba upload gambar ke Google Drive atau Dropbox

## Best Practices

1. **Use Google Drive for Portfolio**: Paling reliable dan mudah digunakan
2. **Image Size**: Gunakan gambar dengan resolusi yang sesuai (rekomendasi: 1200x800px untuk projects)
3. **Image Format**: PNG untuk screenshots, JPG untuk photos, SVG untuk logos
4. **File Names**: Gunakan nama file yang deskriptif (mis: `project-dashboard.png`)

## Technical Details

### Image Proxy Endpoint

```
GET /api/image-proxy?url=<encoded_url>
```

Endpoint ini digunakan untuk bypass CORS restrictions dan fetch gambar dari sumber yang tidak mendukung direct embedding.

### Client-side Conversion

JavaScript utility `convertImageUrl()` tersedia di semua halaman untuk konversi URL di client-side.

### Server-side Helper

EJS helper function `getImageUrl()` tersedia di semua templates untuk konversi URL di server-side.

---

**Note**: Sistem ini dirancang untuk user-friendly - Anda hanya perlu paste URL dan sistem akan menghandle sisanya!
