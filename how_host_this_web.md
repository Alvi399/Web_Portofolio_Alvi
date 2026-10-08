# 🚀 Panduan Hosting Web Portofolio Alvi & MCP Server di Debian Linux

Panduan lengkap ini menjelaskan langkah-langkah *deploy* dan *hosting* aplikasi Web Portofolio Express beserta **Hosted MCP Server (Model Context Protocol)** di server Linux berbasis **Debian (Debian 11 / Debian 12)** menggunakan **Node.js, MariaDB/MySQL, PM2 Process Manager, Nginx Reverse Proxy (dengan dukungan SSE), dan Certbot SSL**.

---

## 📋 Daftar Isi
1. [Prasyarat & Persiapan Debian](#1-prasyarat--persiapan-debian)
2. [Instalasi Node.js, MariaDB, & Tools Pendukung](#2-instalasi-nodejs-mariadb--tools-pendukung)
3. [Konfigurasi Database MariaDB/MySQL](#3-konfigurasi-database-mariadbmysql)
4. [Clone Repository & Konfigurasi `.env`](#4-clone-repository--konfigurasi-env)
5. [Inisialisasi & Reseed Database](#5-inisialisasi--reseed-database)
6. [Menjalankan Aplikasi & MCP Server dengan PM2](#6-menjalankan-aplikasi--mcp-server-dengan-pm2)
7. [Konfigurasi Nginx Reverse Proxy (Streaming SSE MCP)](#7-konfigurasi-nginx-reverse-proxy-streaming-sse-mcp)
8. [Aktivasi SSL HTTPS (Let's Encrypt Certbot)](#8-aktivasi-ssl-https-lets-encrypt-certbot)
9. [Uji Coba MCP Server Remote dari Perangkat Lain](#9-uji-coba-mcp-server-remote-dari-perangkat-lain)
10. [Perintah Perawatan (Maintenance & Monitoring)](#10-perintah-perawatan-maintenance--monitoring)

---

## 🛠️ 1. Prasyarat & Persiapan Debian

Pastikan Anda memiliki akses `root` atau pengguna dengan hak akses `sudo` pada Debian server Anda.

Update seluruh paket repositori sistem:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential ufw ufw-extra
```

---

## 📦 2. Instalasi Node.js, MariaDB, & Tools Pendukung

### A. Instal Node.js (v20 LTS atau v22 LTS)
Gunakan repository resmi NodeSource:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verifikasi versi
node -v  # v20.x.x
npm -v   # v10.x.x
```

### B. Instal MariaDB / MySQL Server
```bash
sudo apt install -y mariadb-server mariadb-client

# Pastikan MariaDB berjalan saat boot
sudo systemctl enable --now mariadb

# Amankan instalasi MariaDB
sudo mysql_secure_installation
```

### C. Instal PM2 & Nginx
```bash
sudo npm install -g pm2
sudo apt install -y nginx
```

---

## 🗄️ 3. Konfigurasi Database MariaDB/MySQL

Masuk ke konsol MySQL sebagai root:
```bash
sudo mysql -u root -p
```

Jalankan perintah SQL berikut untuk membuat database dan pengguna baru:
```sql
CREATE DATABASE web_portofolio_alvi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'alvi_user'@'localhost' IDENTIFIED BY 'PasswordRahasiaAnda123!';
GRANT ALL PRIVILEGES ON web_portofolio_alvi.* TO 'alvi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 📂 4. Clone Repository & Konfigurasi `.env`

1. **Clone repository aplikasi ke folder server** (misal: `/var/www/web_portofolio_alvi`):
   ```bash
   sudo mkdir -p /var/www
   sudo chown -R $USER:$USER /var/www
   cd /var/www
   git clone <URL_REPOSITORY_ANDA> web_portofolio_alvi
   cd web_portofolio_alvi
   ```

2. **Instal dependensi NPM**:
   ```bash
   npm install --production
   ```

3. **Buat file `.env` produksi**:
   ```bash
   cp .env.example .env
   nano .env
   ```

   **Isi file `.env` untuk lingkungan Debian Production**:
   ```env
   NODE_ENV=production
   PORT=3005
   
   # Konfigurasi Database
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=alvi_user
   DB_PASS=PasswordRahasiaAnda123!
   DB_NAME=web_portofolio_alvi
   
   # Sesi & Keamanan
   SESSION_SECRET=UbahDenganStringAcakDanSangatPanjang987654321!
   SITE_URL=https://domain-anda.com
   
   # Kunci Otentikasi MCP Remote (Opsional tapi Direkomendasikan)
   MCP_API_KEY=KunciMcpRahasiaPerangkatRemote123!
   ```

---

## 🌱 5. Inisialisasi & Reseed Database

Jalankan skrip seeder untuk mengisi database secara otomatis dengan data awal 10 sampel di semua tabel:
```bash
node seeders/seed_dummy_10.js
```
*Output yang diharapkan:*
`✓ Database reseeded successfully with 10 records per table!`

---

## ⚡ 6. Menjalankan Aplikasi & MCP Server dengan PM2

Karena **Hosted MCP Server (SSE)** telah di-attach langsung di `app.js` pada rute `/sse` dan `/api/mcp/message`, Anda cukup menjalankan aplikasi utama melalui **PM2**:

1. **Jalankan aplikasi dengan PM2**:
   ```bash
   pm2 start app.js --name "alvi-portfolio"
   ```

2. **Atur PM2 agar otomatis berjalan saat server Debian reboot**:
   ```bash
   pm2 startup
   ```
   *(Salin dan jalankan perintah `sudo env PATH=...` yang muncul di layar)*.

3. **Simpan status proses PM2**:
   ```bash
   pm2 save
   ```

4. **Cek Status Aplikasi**:
   ```bash
   pm2 status
   ```

---

## 🌐 7. Konfigurasi Nginx Reverse Proxy (Streaming SSE MCP)

Nginx dikonfigurasikan agar mampu menangani traffic biasa (HTTP/HTTPS) sekaligus **Server-Sent Events (SSE)** tanpa mengalami disconnect/buffering.

1. **Buat file konfigurasi Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/alvi-portfolio
   ```

2. **Salin konfigurasi berikut** *(Ganti `domain-anda.com` dengan domain atau IP Server Debian Anda)*:
   ```nginx
   server {
       listen 80;
       server_name domain-anda.com www.domain-anda.com;

       # Batas ukuran upload foto/gambar (5 MB)
       client_max_body_size 10M;

       # Main Portfolio Web Application
       location / {
           proxy_pass http://127.0.0.1:3005;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # ⚡ Hosted MCP Server SSE Endpoint (Koneksi Remote AI Agent)
       location /sse {
           proxy_pass http://127.0.0.1:3005/sse;
           proxy_http_version 1.1;
           proxy_set_header Connection '';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;

           # Pengaturan Khusus SSE Streaming
           proxy_buffering off;
           proxy_cache off;
           chunked_transfer_encoding on;
           proxy_read_timeout 86400s;
           proxy_send_timeout 86400s;
       }

       # ⚡ Hosted MCP Server Post Message Endpoint
       location /api/mcp/message {
           proxy_pass http://127.0.0.1:3005/api/mcp/message;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Serve Static Uploaded Files
       location /uploads/ {
           alias /var/www/web_portofolio_alvi/public/uploads/;
           expires 30d;
           add_header Cache-Control "public, no-transform";
       }
   }
   ```

3. **Aktifkan Konfigurasi & Reload Nginx**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/alvi-portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 🔒 8. Aktivasi SSL HTTPS (Let's Encrypt Certbot)

Amankan server Debian Anda dengan Sertifikat SSL Gratis dari Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com
```
*(Ikuti petunjuk di layar, pilih opsi otomatis redirect HTTP ke HTTPS).*

Buka port di Firewall UFW:
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 📡 9. Uji Coba MCP Server Remote dari Perangkat Lain

Setelah di-host di server Debian, Anda dapat menghubungkan Client AI (Cursor, Windsurf, Claude Desktop, atau AI Agent di perangkat laptop/mobile lain) menggunakan **Remote SSE**:

### Detail Endpoint Remote MCP Server:
* **URL SSE (Stream)**: `https://domain-anda.com/sse`
* **URL POST Message**: `https://domain-anda.com/api/mcp/message?sessionId=<SESSION_ID>`
* **Header Otentikasi (Jika MCP_API_KEY diisi)**:
  `x-api-key: KunciMcpRahasiaPerangkatRemote123!`

### Cara Uji Koneksi dari Terminal Perangkat Lain:
```bash
curl -N -H "Accept: text/event-stream" -H "x-api-key: KunciMcpRahasiaPerangkatRemote123!" https://domain-anda.com/sse
```
*Output yang diharapkan (Chunk Event Stream):*
```text
event: endpoint
data: /api/mcp/message?sessionId=...
```

---

## 🛠️ 10. Perintah Perawatan (Maintenance & Monitoring)

* **Melihat Log Aplikasi Realtime**:
  ```bash
  pm2 logs alvi-portfolio
  ```
* **Restart Aplikasi**:
  ```bash
  pm2 restart alvi-portfolio
  ```
* **Cek Memory & CPU Usage**:
  ```bash
  pm2 monit
  ```
* **Update Kode dari Git**:
  ```bash
  cd /var/www/web_portofolio_alvi
  git pull
  npm install --production
  pm2 restart alvi-portfolio
  ```
