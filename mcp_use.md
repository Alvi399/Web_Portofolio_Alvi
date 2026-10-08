# ⚡ Alvi Portfolio MCP Server Documentation (`mcp_use.md`)

Panduan ini ditujukan bagi **AI Agent** (seperti Claude Desktop, Claude Code, Cursor, Windsurf, Roo Code, dll.) agar dapat berinteraksi secara aman dan terstruktur dengan database Portofolio melalui **Model Context Protocol (MCP)** baik secara lokal (`stdio`) maupun remote dari perangkat lain (`HTTP/SSE`).

---

## 📌 1. Ikhtisar MCP Server

* **Nama Server**: `Alvi-Portfolio-MCP`
* **Versi Protocol**: `v1.3.0`
* **Supported Transports**:
  1. `stdio` (Standard Input / Output - lokal via `node mcp.js`)
  2. `HTTP/SSE` (Server-Sent Events - remote hosted via `/sse` & `/api/mcp/message`)
* **File Utama**: `mcp.js` (lokal) & `helpers/mcpServer.js` (shared logic & remote SSE server)
* **Database Target**: MySQL (via Sequelize ORM)

---

## ⚙️ 2. Cara Mengonfigurasi MCP Server di Client AI

### A. Local Connection: Claude Desktop (`claude_desktop_config.json`)

Tambahkan konfigurasi berikut pada file konfigurasi Claude Desktop Anda:

```json
{
  "mcpServers": {
    "alvi-portfolio": {
      "command": "node",
      "args": ["C:/KARIR/Web_Portofolio_Alvi/mcp.js"],
      "env": {
        "NODE_ENV": "development",
        "DB_HOST": "127.0.0.1",
        "DB_PORT": "3306",
        "DB_USER": "root",
        "DB_PASS": "",
        "DB_NAME": "web_portofolio_alvi"
      }
    }
  }
}
```

### B. Local CLI / Other IDE (Cursor / Windsurf / Roo Code)

Jalankan server lokal menggunakan command:
```bash
node c:/KARIR/Web_Portofolio_Alvi/mcp.js
```

### C. Remote Device Connection (SSE / Hosted Server)

Jika Anda ingin mengakses MCP Server ini dari **laptop, perangkat mobile, atau VPS lain**:

1. Pastikan server portofolio berjalan (misal pada `http://<IP-SERVER-ANDA>:3005`).
2. Sambungkan Client AI remote Anda ke Endpoint SSE:
   - **SSE Endpoint (GET)**: `http://<IP-SERVER-ANDA>:3005/sse`
   - **Post Message Endpoint (POST)**: `http://<IP-SERVER-ANDA>:3005/api/mcp/message?sessionId=<SESSION_ID>`
3. *(Opsional)* Jika `MCP_API_KEY` diatur di `.env`, tambahkan Header HTTP:
   ```http
   x-api-key: YOUR_MCP_API_KEY
   ```
   Atau query param: `http://<IP-SERVER-ANDA>:3005/sse?api_key=YOUR_MCP_API_KEY`

---

## 🛠️ 3. Daftar Tool yang Tersedia (MCP Tools Registry)

### 📁 A. Projects (Proyek)

| Tool Name | Deskripsi | Input Parameters Utama |
|---|---|---|
| `list_projects` | Membaca seluruh data proyek | `{}` |
| `add_project` | Menambahkan proyek baru (bisa upload gambar Base64) | `title` (required), `description`, `problem`, `role`, `impact`, `technologies` (array), `project_url`, `github_url`, `status`, `image_base64`, `image_extension` |
| `update_project` | Memperbarui proyek berdasarkan `id` | `id` (required), `title`, `description`, `problem`, `role`, `impact`, `technologies`, `project_url`, `github_url`, `status`, `image_base64`, `image_extension` |
| `delete_project` | Menghapus proyek berdasarkan `id` | `id` (required) |

### 📜 B. Certificates (Sertifikat)

| Tool Name | Deskripsi | Input Parameters Utama |
|---|---|---|
| `list_certificates` | Membaca seluruh sertifikat | `{}` |
| `add_certificate` | Menambahkan sertifikat baru | `title` (required), `issuer` (required), `date` (YYYY-MM-DD), `category` (Backend/Frontend/AI/Other), `credential_url`, `is_highlight` (boolean), `image_base64`, `image_extension` |
| `update_certificate` | Memperbarui sertifikat berdasarkan `id` | `id` (required), `title`, `issuer`, `date`, `category`, `credential_url`, `is_highlight`, `image_base64`, `image_extension` |
| `delete_certificate` | Menghapus sertifikat berdasarkan `id` | `id` (required) |

### 🚀 C. Journey (Pengalaman & Pendidikan)

| Tool Name | Deskripsi | Input Parameters Utama |
|---|---|---|
| `list_journey` | Membaca timeline perjalanan karir | `{}` |
| `add_journey` | Menambahkan milestone baru | `title` (required), `date` (YYYY-MM-DD, required), `description`, `end_date`, `is_current` (boolean), `category` (experience/education), `image_base64`, `image_extension` |
| `update_journey` | Memperbarui journey berdasarkan `id` | `id` (required), `title`, `description`, `date`, `end_date`, `is_current`, `category`, `image_base64`, `image_extension` |
| `delete_journey` | Menghapus journey berdasarkan `id` | `id` (required) |

### 🛠️ D. Skills (Keahlian)

| Tool Name | Deskripsi | Input Parameters Utama |
|---|---|---|
| `list_skills` | Membaca seluruh skill | `{}` |
| `add_skill` | Menambahkan skill baru | `name` (required), `category` (Frontend/Backend/Database/Tools/Soft Skills), `proficiency` (1-100), `icon` (emoji/icon name), `image_base64`, `image_extension` |
| `update_skill` | Memperbarui skill berdasarkan `id` | `id` (required), `name`, `category`, `proficiency`, `icon` |
| `delete_skill` | Menghapus skill berdasarkan `id` | `id` (required) |

### 💬 E. Testimonials (Rekomendasi)

| Tool Name | Deskripsi | Input Parameters Utama |
|---|---|---|
| `list_testimonials` | Membaca seluruh testimoni | `{}` |
| `add_testimonial` | Menambahkan testimoni baru | `name` (required), `quote` (required), `position`, `company`, `is_visible` (boolean), `image_base64`, `image_extension` |
| `update_testimonial` | Memperbarui testimoni berdasarkan `id` | `id` (required), `name`, `position`, `company`, `quote`, `is_visible` |
| `delete_testimonial` | Menghapus testimoni berdasarkan `id` | `id` (required) |

### 👤 F. Profile (Profil Pengguna)

| Tool Name | Deskripsi | Input Parameters Utama |
|---|---|---|
| `get_profile` | Membaca profil utama pengguna | `{}` |
| `update_profile` | Memperbarui profil utama | `full_name`, `display_name`, `headline`, `tagline`, `bio`, `email`, `phone`, `location` |

---

## 💡 4. Contoh Payload JSON-RPC Call untuk AI Agent

### Contoh 1: Menambahkan Project Baru dengan Gambar Base64
```json
{
  "name": "add_project",
  "arguments": {
    "title": "E-Commerce Microservices",
    "description": "Platform e-commerce dengan arsitektur microservices modern.",
    "role": "Lead Backend Engineer",
    "impact": "Meningkatkan throughput hingga 10,000 req/sec.",
    "technologies": ["Node.js", "Express", "Docker", "MySQL"],
    "project_url": "https://example.com",
    "github_url": "https://github.com/Alvi399/ecommerce",
    "status": "published",
    "image_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "image_extension": "png"
  }
}
```

### Contoh 2: Menambahkan Sertifikat
```json
{
  "name": "add_certificate",
  "arguments": {
    "title": "AWS Certified Solutions Architect",
    "issuer": "Amazon Web Services",
    "date": "2024-05-15",
    "category": "Backend",
    "credential_url": "https://aws.amazon.com/verify/12345",
    "is_highlight": true
  }
}
```

---

## 📈 6. Panduan Optimasi Skor CV ATS (Target 90% - 100%)

Jika AI Agent bertugas mengisi atau memperbarui data portofolio penggua melalui MCP, ikuti aturan pencapaian **Skor CV ATS Maksimal** berikut:

### 🎯 Checklist Parameter Penilaian ATS (`services/cvService.js`)

1. **Profile (`update_profile`)**:
   - `full_name`: Wajib terisi lengkap *(5 poin)*.
   - `email`: Email aktif profesional *(8 poin)*.
   - `phone`: Nomor telepon / WhatsApp aktif *(5 poin)*.
   - `location`: Nama Kota & Negara, misal: `Jakarta, Indonesia` *(4 poin)*.
   - `linkedin_url` & `github_url`: URL profil valid *(8 poin)*.
   - `headline`: Posisi spesifik yang ditargetkan, misal `Full Stack Developer` *(4 poin)*.
   - `about_summary`: Ringkasan profesional sepanjang **40 - 120 kata** *(8 poin)*.

2. **Skills (`add_skill`)**:
   - Tambahkan minimal **8 skill teknis** *(8 poin)*.
   - Tambahkan minimal **3 soft skill** dengan kategori `Soft Skills` (misal: `Problem Solving`, `Teamwork`) *(2 poin)*.

3. **Projects (`add_project` / `update_project`)**:
   - Tambahkan minimal **2 proyek** dengan status `published` *(8 poin)*.
   - Pastikan setiap proyek mengisi kolom `problem`, `role`, dan `impact` *(8 poin)*.
   - **Gunakan Angka Terukur (% / Angka / Waktu)** di kolom `impact` atau `description` (misal: `"Meningkatkan kecepatan loading 45%"`, `"Melayani 50,000 pengguna"`) *(10 poin)*.
   - **Gunakan Kata Kerja Aktif** di awal kalimat deskripsi (`Membangun`, `Mengoptimalkan`, `Merancang`, `Built`, `Optimized`, `Developed`) *(6 poin)*.

4. **Journey (`add_journey`)**:
   - Tambahkan minimal 2 entri riwayat (Pengalaman Kerja & Pendidikan) lengkap dengan `date` dan `end_date` *(8 poin)*.

5. **Certifications (`add_certificate`)**:
   - Tambahkan minimal 1 sertifikat resmi *(3 poin)*.

6. **Panjang CV Ideal**:
   - Pastikan total kata pada rangkuman CV berada di kisaran **250 - 800 kata** *(5 poin)*.

---

## 🧪 7. Verifikasi & Pengujian Server

Untuk menguji bahwa MCP server merespon dengan benar melalui `stdio` tanpa melempar error non-JSON:

Jalankan script pengujian mentah:
```bash
node test_mcp_raw.js
```

Jika berhasil, output akan menampilkan status:
`✅ MCP Test completed successfully!`
