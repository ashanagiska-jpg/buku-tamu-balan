# Buku Tamu Online - Bapas Lahat

Web app buku tamu digital untuk **Balai Pemasyarakatan Kelas II Lahat**.

Data disimpan di **Google Sheets** → bisa diakses dari banyak perangkat (HP, tablet, komputer).

---

## Fitur

### Form Pengunjung (3 jenis)
- **Klien Registrasi Awal** — pendaftaran klien baru
- **Klien Wajib Lapor** — pelaporan berkala
- **Keluarga Klien** — bertemu dengan Pembimbing Kemasyarakatan (PK)

### Halaman Admin
- Login dengan PIN
- Statistik kunjungan hari ini
- Filter berdasarkan jenis & tanggal
- Lihat detail lengkap
- Export data ke CSV (Excel)
- Hapus data individual / semua

---

## Setup (WAJIB dilakukan dulu)

Ikuti panduan lengkap di file:

**→ `SETUP-GOOGLE-SHEETS.md`**

Ringkasan:
1. Buat Google Sheet baru + isi header kolom
2. Buat Apps Script (kode sudah disediakan)
3. Deploy sebagai Web App → salin URL
4. Tempel URL ke file `js/config.js`

Setelah itu web app siap dipakai di banyak perangkat.

---

## Cara Menjalankan

### Opsi A – Langsung buka di browser
1. Extract folder `buku-tamu-bapas-lahat`
2. Double-click `index.html`

### Opsi B – Deploy ke hosting (disarankan)
Upload seluruh folder ke:
- GitHub Pages / Netlify / Vercel
- atau hosting biasa (cPanel)

Lalu akses via link, bisa dibuka di HP/tablet banyak orang sekaligus.

### Login Admin
- Buka: `admin/index.html`
- PIN default: **`bapas2026`**
- Ganti di `js/config.js` → `ADMIN_PIN`

---

## Struktur Folder

```
buku-tamu-bapas-lahat/
├── index.html                 ← Form pengunjung
├── admin/index.html           ← Panel admin
├── css/
│   ├── style.css
│   └── admin.css
├── js/
│   ├── config.js              ← URL Google Script & PIN (WAJIB diisi)
│   ├── app.js
│   └── admin.js
├── SETUP-GOOGLE-SHEETS.md     ← Panduan setup database
└── README.md
```

---

© 2026 · Dibuat untuk Bapas Lahat
