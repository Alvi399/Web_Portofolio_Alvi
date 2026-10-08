# 🚀 Panduan Hosting Web Portofolio Alvi & MCP Server (Debian + Cloudflare Tunnel)

Panduan ini menjelaskan cara melakukan *deploy* dan *hosting* aplikasi Web Portofolio Express beserta **Hosted MCP Server (Model Context Protocol)** pada server Linux berbasis **Debian (Debian 11 / Debian 12)** menggunakan **Cloudflare Tunnel (`cloudflared`)**, **Node.js**, **MariaDB/MySQL**, dan **PM2 Process Manager**.

---

## ⚡ Jawaban Singkat: Port Berapa yang Ditembak?

👉 **Tembak ke PORT `3005`** (`http://localhost:3005` atau `http://127.0.0.1:3005`).

Pada konfigurasi **Cloudflare Tunnel (Zero Trust Dashboard)**:
* **Service**: `HTTP`
* **URL**: `localhost:3005` (atau `127.0.0.1:3005`)

> 💡 **Keuntungan Cloudflare Tunnel**:
> 1. **Tidak perlu Buka Port / Port Forwarding** di router / VPS IP Publik.
> 2. **Otomatis SSL HTTPS Gratis** dari Cloudflare Edge.
> 3. **Otomatis Mendukung Streaming SSE MCP Server** (`/sse` & `/api/mcp/message`) tanpa perlu konfigurasi Nginx yang rumit!

---

## 📋 Langkah-Langkah Deployment Lengkap di Debian

### 1. Update Server & Instal Dependensi
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential MariaDB-server mariadb-client
```

---

### 2. Instal Node.js (v20 LTS) & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

---

### 3. Setup Database MariaDB/MySQL
```bash
sudo systemctl enable --now mariadb
sudo mysql -u root
```

Jalankan perintah SQL berikut:
```sql
CREATE DATABASE web_portofolio_alvi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'alvi_user'@'localhost' IDENTIFIED BY 'PasswordRahasiaAnda123!';
GRANT ALL PRIVILEGES ON web_portofolio_alvi.* TO 'alvi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### 4. Clone Repository & Konfigurasi `.env`

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone <URL_REPOSITORY_ANDA> web_portofolio_alvi
cd web_portofolio_alvi

# Instal dependensi
npm install --production

# Buat file .env
cp .env.example .env
nano .env
```

**Isi file `.env`**:
```env
NODE_ENV=production
PORT=3005

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=alvi_user
DB_PASS=PasswordRahasiaAnda123!
DB_NAME=web_portofolio_alvi

# Sesi & Keamanan
SESSION_SECRET=UbahDenganStringAcakDanSangatPanjang987654321!
SITE_URL=https://domain-anda.com

# Kunci MCP Remote (Opsional)
MCP_API_KEY=KunciMcpRahasiaPerangkatRemote123!
```

---

### 5. Inisialisasi & Reseed Database
```bash
node seeders/seed_dummy_10.js
```
*Output:* `✓ Database reseeded successfully with 10 records per table!`

---

### 6. Jalankan Aplikasi & MCP Server dengan PM2

```bash
pm2 start app.js --name "alvi-portfolio"
pm2 startup
pm2 save
```
*(Salin & jalankan perintah `sudo env PATH=...` yang diberikan oleh PM2).*

---

### 7. Konfigurasi Cloudflare Tunnel (`cloudflared`)

#### Opsi A: Melalui Cloudflare Zero Trust Dashboard (Disarankan / Sangat Mudah)
1. Buka [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/).
2. Buka menu **Networks** &rarr; **Tunnels** &rarr; Klik **Create a Tunnel**.
3. Pilih **Cloudflared**, beri nama tunnel (misal: `debian-alvi-portfolio`).
4. Pilih OS **Debian** dan jalankan perintah install connector yang diberikan di terminal Debian Anda, contoh:
   ```bash
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared.deb
   sudo cloudflared service install <TOKEN_DARI_CLOUDFLARE_DASHBOARD>
   ```
5. Di bagian **Public Hostnames**:
   * **Subdomain**: *(kosongkan jika root domain)* atau isi `portfolio` / `mcp`.
   * **Domain**: Pilih domain Anda (misal: `domain-anda.com`).
   * **Type**: `HTTP`
   * **URL**: `localhost:3005` (atau `127.0.0.1:3005`).
6. Klik **Save Hostname**. Selesai! 🎉

#### Opsi B: Melalui File Konfigurasi CLI (`config.yml`)
Jika menggunakan CLI `cloudflared`:
```yaml
tunnel: <TUNNEL_UUID>
credentials-file: /root/.cloudflared/<TUNNEL_UUID>.json

ingress:
  - hostname: domain-anda.com
    service: http://localhost:3005
  - service: http_status:404
```

---

## 📡 8. Menggunakan MCP Server Remote via Cloudflare Tunnel

Setelah Cloudflare Tunnel aktif menembak ke `localhost:3005`, **Hosted MCP Server** secara otomatis dapat diakses oleh Client AI (Cursor, Windsurf, Claude Desktop, dll.) dari perangkat mana saja di seluruh dunia!

### Endpoint Remote MCP Server:
* **SSE Streaming URL**: `https://domain-anda.com/sse`
* **POST Message URL**: `https://domain-anda.com/api/mcp/message?sessionId=<SESSION_ID>`
* **Header API Key** *(jika `MCP_API_KEY` diatur)*:
  `x-api-key: KunciMcpRahasiaPerangkatRemote123!`

### Uji Coba dari Perangkat Lain (Terminal / Command Prompt):
```bash
curl -N -H "Accept: text/event-stream" -H "x-api-key: KunciMcpRahasiaPerangkatRemote123!" https://domain-anda.com/sse
```
*Output Event Stream:*
```text
event: endpoint
data: /api/mcp/message?sessionId=...
```

---

## 🛠️ 9. Perintah Perawatan (Maintenance)

* **Cek Status Aplikasi Node.js**: `pm2 status`
* **Cek Log Realtime**: `pm2 logs alvi-portfolio`
* **Cek Status Cloudflare Tunnel**: `sudo systemctl status cloudflared`
* **Restart Aplikasi**: `pm2 restart alvi-portfolio`
