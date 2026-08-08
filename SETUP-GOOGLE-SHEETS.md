# Panduan Setup Google Sheets sebagai Database

Ikuti langkah berikut **sekali saja**. Setelah selesai, data buku tamu akan tersimpan di Google Sheets dan bisa diakses dari banyak perangkat.

---

## Langkah 1 — Buat Google Sheet

1. Buka [https://sheets.google.com](https://sheets.google.com)
2. Klik **Blank** (spreadsheet baru)
3. Beri nama: **Buku Tamu Bapas Lahat**
4. Di baris pertama (header), isi kolom berikut **persis**:

Copy-paste baris berikut ke **baris 1** Google Sheet (mulai dari kolom A):

```
id	timestamp	tanggal	waktu	tipe_kunjungan	tipe_label	nama	nik	no_hp	keperluan	catatan	no_register	jenis_kasus	alamat	pk_tujuan	periode_lapor	tanggal_lapor_sebelumnya	status_klien	nama_klien	hubungan	no_register_klien	lapas_rutan	tanda_tangan	foto_wajah
```


> **Jika Sheet sudah dibuat sebelumnya:** tambahkan kolom baru di baris header: `lapas_rutan` (kolom berikutnya setelah no_register_klien), lalu **Deploy ulang** Apps Script (New version).

> Catatan: pisahkan dengan **Tab** (bukan spasi). Atau ketik manual satu per satu di masing-masing kolom.


---

## Langkah 2 — Buat Apps Script

1. Di Google Sheet yang sama, klik menu **Extensions → Apps Script**
2. Hapus semua kode yang ada, lalu **paste** kode berikut:

```javascript
// Buku Tamu Bapas Lahat - Google Apps Script Backend
// Deploy sebagai Web App

const SHEET_NAME = 'Sheet1'; // sesuaikan jika nama sheet berbeda

function doGet(e) {
  try {
    const action = e.parameter.action || 'list';
    
    if (action === 'list') {
      return listGuests();
    }
    
    return jsonResponse({ success: false, message: 'Action tidak dikenal' });
  } catch (err) {
    return jsonResponse({ success: false, message: err.toString() });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'add';
    
    if (action === 'add') {
      return addGuest(data);
    }
    
    if (action === 'delete') {
      return deleteGuest(data.id);
    }
    
    if (action === 'clear') {
      return clearAll();
    }
    
    return jsonResponse({ success: false, message: 'Action tidak dikenal' });
  } catch (err) {
    return jsonResponse({ success: false, message: err.toString() });
  }
}

function listGuests() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  
  if (values.length <= 1) {
    return jsonResponse({ success: true, data: [] });
  }
  
  const headers = values[0];
  const rows = values.slice(1);
  
  const data = rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] !== undefined && row[i] !== null ? String(row[i]) : '';
    });
    return obj;
  }).reverse(); // terbaru di atas
  
  return jsonResponse({ success: true, data: data });
}

function addGuest(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  const row = [
    data.id || '',
    data.timestamp || new Date().toISOString(),
    data.tanggal || '',
    data.waktu || '',
    data.tipe_kunjungan || '',
    data.tipe_label || '',
    data.nama || '',
    data.nik || '',
    data.no_hp || '',
    data.keperluan || '',
    data.catatan || '',
    data.no_register || '',
    data.jenis_kasus || '',
    data.alamat || '',
    data.pk_tujuan || '',
    data.periode_lapor || '',
    data.tanggal_lapor_sebelumnya || '',
    data.status_klien || '',
    data.nama_klien || '',
    data.hubungan || '',
    data.no_register_klien || '',
    data.lapas_rutan || '',
    data.tanda_tangan || '',
    data.foto_wajah || ''
  ];
  
  sheet.appendRow(row);
  
  return jsonResponse({ success: true, message: 'Data berhasil disimpan', id: data.id });
}

function deleteGuest(id) {
  if (!id) {
    return jsonResponse({ success: false, message: 'ID tidak ditemukan' });
  }
  
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol = headers.indexOf('id');
  
  if (idCol === -1) {
    return jsonResponse({ success: false, message: 'Kolom id tidak ditemukan' });
  }
  
  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1);
      return jsonResponse({ success: true, message: 'Data dihapus' });
    }
  }
  
  return jsonResponse({ success: false, message: 'Data tidak ditemukan' });
}

function clearAll() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  return jsonResponse({ success: true, message: 'Semua data dihapus' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Klik **Save** (💾) → beri nama project: `BukuTamuBapas`

---

## Langkah 3 — Deploy sebagai Web App

1. Klik **Deploy → New deployment**
2. Ikon gear ⚙️ → pilih **Web app**
3. Isi:
   - **Description**: Buku Tamu Bapas Lahat
   - **Execute as**: **Me** (akun Google Anda)
   - **Who has access**: **Anyone**
4. Klik **Deploy**
5. Akan muncul peringatan otorisasi → klik **Authorize access** → pilih akun Google → **Advanced** → **Go to ... (unsafe)** → **Allow**
6. **Salin URL** yang muncul (bentuknya: `https://script.google.com/macros/s/XXXX/exec`)

---

## Langkah 4 — Masukkan URL ke Web App

1. Buka file `js/config.js` di folder web app
2. Ganti baris ini:

```js
SCRIPT_URL: 'https://script.google.com/macros/s/XXXX/exec',
```

dengan URL yang Anda salin tadi.

3. Simpan file.

---

## Langkah 5 — Uji Coba

1. Buka `index.html` di browser
2. Isi form kunjungan → Simpan
3. Cek Google Sheet → data harus muncul di baris baru
4. Buka `admin/index.html` → login → data harus tampil

---

## Catatan Penting

- **Jangan bagikan URL Web App** ke publik sembarangan (meski hanya bisa write/read sheet Anda)
- Jika ingin ubah kode Apps Script, setelah edit klik **Deploy → Manage deployments → Edit (pensil) → New version → Deploy**
- Data di Google Sheet bisa di-export, difilter, atau dibuatkan dashboard sendiri
- Satu Google Sheet bisa dipakai banyak perangkat sekaligus

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Data tidak masuk | Pastikan URL di config.js benar & deployment "Anyone" |
| Admin kosong | Cek apakah header kolom di Sheet persis seperti di atas |
| Error CORS | Pastikan deploy sebagai Web App (bukan API Executable) |
| Otorisasi gagal | Ulangi Authorize access dengan akun yang punya sheet |

---
Selesai! Sekarang data tersimpan di cloud dan bisa diakses dari mana saja.
