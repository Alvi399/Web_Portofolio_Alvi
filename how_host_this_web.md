# 🚀 Panduan Step-by-Step Hosting Debian Server + PM2 + Cloudflare Tunnel

Dokumen ini adalah panduan **step-by-step** untuk melakukan *deploy* dan *hosting* Web Portofolio Alvi beserta **Hosted MCP Server (Model Context Protocol)** di server berbasis **Debian (Debian 11 / Debian 12)**.

Aplikasi akan berjalan di `localhost:3005` menggunakan **PM2**, dan domain Anda akan diarahkan menggunakan **Cloudflare Tunnel (`cloudflared`)**.

---

## 📌 Mengapa MCP Server Otomatis Ikut Ter-Host?

Hosted MCP Server telah diintegrasikan langsung di dalam `app.js` pada rute `/sse` dan `/api/mcp/message`. 

Saat Anda menjalankan `app.js` menggunakan PM2, **Web Portofolio + MCP Server berjalan bersamaan di port `3005` (`http://localhost:3005`)**. Saat Cloudflare Tunnel diarahkan ke `localhost:3005`, web portofolio DAN MCP server otomatis online dan siap diakses dari perangkat luar!

---

## ⚡ Ringkasan Parameter Cloudflare Tunnel

Saat menambahkan Public Hostname di Cloudflare Zero Trust Dashboard:
* **Service Type**: `HTTP`
* **URL / Target**: `localhost:3005` *(atau `127.0.0.1:3005`)*

---

## 📋 LANGKAH DEMI LANGKAH (STEP-BY-STEP) DEPLOYMENT

### Step 1: Update Repositori Debian & Instal Tools Utama
Buka terminal Debian server Anda dan jalankan:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential mariadb-server mariadb-client
```

---

### Step 2: Instal Node.js (v20 LTS) & PM2
```bash
# Tambahkan repo NodeSource Node.js v20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instal Process Manager PM2 secara global
sudo npm install -g pm2

# Verifikasi instalasi
node -v   # Output: v20.x.x
pm2 -v    # Output: 5.x.x
```

---

### Step 3: Setup Database MariaDB / MySQL
```bash
# Pastikan MariaDB berjalan otomatis saat boot
sudo systemctl enable --now mariadb

# Masuk ke MySQL console sebagai root
sudo mysql -u root
```

Di dalam konsol MySQL, jalankan query berikut:
```sql
CREATE DATABASE web_portofolio_alvi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'alvi_user'@'localhost' IDENTIFIED BY 'PasswordRahasiaAnda123!';
GRANT ALL PRIVILEGES ON web_portofolio_alvi.* TO 'alvi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### Step 4: Clone Repository & Buat File Environment (`.env`)

```bash
# Buat folder aplikasi
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www

# Clone repository
git clone <URL_REPOSITORY_GITHUB_ANDA> web_portofolio_alvi
cd web_portofolio_alvi

# Instal dependensi produksi
npm install --production

# Salin template .env
cp .env.example .env
nano .env
```

**Sesuaikan isi `.env` di Debian**:
```env
NODE_ENV=production
PORT=3005

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=alvi_user
DB_PASS=PasswordRahasiaAnda123!
DB_NAME=web_portofolio_alvi

# Session & Site Security
SESSION_SECRET=UbahDenganStringRandomSangatPanjang987654321!
SITE_URL=https://domain-anda.com

# MCP Server Security Key (Opsional untuk Akses Client AI Remote)
MCP_API_KEY=KunciMcpRahasiaPerangkatRemote123!
```

---

### Step 5: Inisialisasi Database (Populasikan Data Awal)
Jalankan seeder untuk mengisi database secara otomatis dengan 10 data sampel per tabel:
```bash
node seeders/seed_dummy_10.js
```
*Output yang muncul:*
`✓ Database reseeded successfully with 10 records per table!`

---

### Step 6: Jalankan Aplikasi & MCP Server Menggunakan PM2

```bash
# Jalankan aplikasi Express + MCP Server di port 3005
pm2 start app.js --name "alvi-portfolio"

# Setup auto-start PM2 saat Debian server di-reboot
pm2 startup
```
*(Salin perintah `sudo env PATH=...` yang muncul di layar terminal Anda lalu jalankan)*.

```bash
# Simpan daftar proses PM2
pm2 save
```

Cek apakah aplikasi berjalan lancar di localhost:
```bash
curl -I http://localhost:3005
```
*Output:* `HTTP/1.1 200 OK`

---

### Step 7: Sambungkan Cloudflare Tunnel (`cloudflared`)

#### Menggunakan Cloudflare Zero Trust Dashboard (Paling Mudah):
1. Buka [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/).
2. Masuk ke **Networks** &rarr; **Tunnels** &rarr; Klik **Create a Tunnel**.
3. Beri nama tunnel (misal: `debian-alvi-server`).
4. Pilih OS **Debian** dan jalankan perintah instalasi connector yang diberikan Cloudflare di terminal Debian Anda, contoh:
   ```bash
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared.deb
   sudo cloudflared service install <TOKEN_DARI_DASHBOARD>
   ```
5. Pada tab **Public Hostnames**:
   * **Domain**: Domain Anda (misal: `alvikirana.com` atau `portfolio.alvikirana.com`).
   * **Type**: `HTTP`
   * **URL**: `localhost:3005`
6. Klik **Save Hostname**.

---

### Step 8: Verifikasi MCP Server Remote dari Perangkat Lain

Setelah Cloudflare Tunnel mengarahkan domain ke `localhost:3005`, MCP Server Anda siap dihubungkan oleh AI Client (Cursor, Windsurf, Claude Desktop, Roo Code, dll.) dari laptop atau perangkat manapun!

* **SSE Streaming URL**: `https://domain-anda.com/sse`
* **POST Message URL**: `https://domain-anda.com/api/mcp/message?sessionId=<SESSION_ID>`
* **HTTP Header (jika `MCP_API_KEY` diatur)**:
  `x-api-key: KunciMcpRahasiaPerangkatRemote123!`

**Uji koneksi SSE dari terminal perangkat luar**:
```bash
curl -N -H "Accept: text/event-stream" -H "x-api-key: KunciMcpRahasiaPerangkatRemote123!" https://domain-anda.com/sse
```
*Output SSE Stream:*
```text
event: endpoint
data: /api/mcp/message?sessionId=...
```

---

## 🛠️ Perintah Perawatan (Cheat Sheet)

* **Cek Status PM2**: `pm2 status`
* **Melihat Log Aplikasi**: `pm2 logs alvi-portfolio`
* **Restart Aplikasi**: `pm2 restart alvi-portfolio`
* **Cek Service Cloudflare Tunnel**: `sudo systemctl status cloudflared`
* **Update Kode dari Repository**:
  ```bash
  cd /var/www/web_portofolio_alvi
  git pull
  npm install --production
  pm2 restart alvi-portfolio
  ```
