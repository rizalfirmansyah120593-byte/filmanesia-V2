# Filmanesia

<p align="center">
  <img src="https://raw.githubusercontent.com/rizalfirmansyah120593-byte/filmanesia-V2/main/public/logo.png" alt="Filmanesia Logo" width="200"/>
</p>

<p align="center">
  <strong>Filmanesia</strong> adalah platform streaming film modern yang dibangun dengan teknologi mutakhir untuk memberikan pengalaman menonton terbaik bagi pengguna.
</p>

<p align="center">
  <a href="https://filmanesia.com">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-0070f3?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
</p>

---

## 🚀 Fitur Utama
*   **Katalog Film Terupdate**: Menampilkan daftar film terbaru dengan detail lengkap.
*   **Antarmuka Responsif**: Desain yang elegan dan nyaman digunakan di perangkat mobile maupun desktop.
*   **Mode Malam (Dark Mode)**: Mendukung kenyamanan mata saat menonton di kondisi minim cahaya.
*   **Integrasi Supabase**: Sistem autentikasi dan manajemen database yang cepat dan aman.
*   **Pencarian Canggih**: Memudahkan pengguna menemukan film favorit dengan cepat.

## 🛠️ Teknologi yang Digunakan
*   **Framework**: [Next.js](https://nextjs.org/)
*   **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
*   **Database & Auth**: [Supabase](https://supabase.com/)
*   **Styling**: Tailwind CSS
*   **Deployment**: Vercel

## ⚙️ Cara Instalasi & Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda:

### 1. Persyaratan
Pastikan Anda sudah menginstal:
*   [Node.js](https://nodejs.org/) (Versi 18 ke atas disarankan)
*   [Git](https://git-scm.com/)

### 2. Kloning Repository
```bash
git clone [https://github.com/rizalfirmansyah120593-byte/filmanesia-V2.git](https://github.com/rizalfirmansyah120593-byte/filmanesia-V2.git)
cd filmanesia-V2

```

### 3. Instalasi Dependency

```bash
npm install

```

### 4. Konfigurasi Lingkungan

Buat file `.env` di direktori utama dan isi dengan konfigurasi berikut:

```env
SUPABASE_AUTH_GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
SUPABASE_AUTH_GOOGLE_SECRET_KEY="YOUR_SECRET_KEY"
SUPABASE_AUTH_SMTP_HOST="YOUR_SMTP_HOST"
SUPABASE_AUTH_SMTP_PORT="587"
SUPABASE_AUTH_SMTP_EMAIL="your_email@example.com"
SUPABASE_AUTH_SMTP_PASSWORD="your_password"
NEXT_PUBLIC_ADSENSE_ID="ca-pub-XXXXXXXXXXXXXXXX"

```

### 5. Menjalankan Server Pengembangan

```bash
npm run dev

```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 💡 Panduan Kontribusi

Kami sangat terbuka untuk kontribusi! Silakan buat *pull request* untuk fitur baru atau perbaikan bug.

## 📝 Lisensi

Proyek ini bersifat open-source. Silakan gunakan untuk keperluan pembelajaran.

---