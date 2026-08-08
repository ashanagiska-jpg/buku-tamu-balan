// Admin Buku Tamu - Bapas Lahat
// Backend: Google Sheets via Apps Script

const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

let allGuests = []; // cache data dari sheet

// Login
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const pin = document.getElementById('pin').value.trim();
  if (pin === CONFIG.ADMIN_PIN) {
    sessionStorage.setItem('bapas_admin', '1');
    showDashboard();
  } else {
    loginError.textContent = 'PIN salah. Silakan coba lagi.';
    loginError.style.display = 'block';
  }
});

// Auto login if already authenticated in session
if (sessionStorage.getItem('bapas_admin') === '1') {
  showDashboard();
}

function showDashboard() {
  loginScreen.classList.remove('active');
  dashboardScreen.classList.add('active');
  loadAndRender();
}

async function loadAndRender() {
  const tbody = document.getElementById('guest-tbody');
  const empty = document.getElementById('empty-state');

  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;">Memuat data...</td></tr>';
  empty.style.display = 'none';

  try {
    if (!CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL.includes('XXXX')) {
      throw new Error('URL Google Apps Script belum dikonfigurasi. Lihat SETUP-GOOGLE-SHEETS.md');
    }

    const url = CONFIG.SCRIPT_URL + '?action=list&_=' + Date.now(); // cache buster
    const res = await fetch(url);
    const json = await res.json();

    if (!json.success) {
      throw new Error(json.message || 'Gagal mengambil data');
    }

    allGuests = json.data || [];
    renderTable();

  } catch (err) {
    console.error(err);
    tbody.innerHTML = '';
    empty.style.display = 'block';
    empty.innerHTML = `<p style="color:#e53e3e;">Gagal memuat data:<br>${escapeHtml(err.message)}</p>
      <p style="margin-top:0.5rem;font-size:0.85rem;">Pastikan URL di config.js sudah benar dan koneksi internet aktif.</p>`;
  }
}


function getPeriodRange(period) {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  let start;
  if (period === 'week') {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(now.getDate() - diff);
  } else if (period === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === 'year') {
    start = new Date(now.getFullYear(), 0, 1);
  } else {
    return null;
  }
  return { start, end: now };
}

function getFilteredGuests() {
  const typeFilter = document.getElementById('filter-type')?.value || 'all';
  const dateFilter = document.getElementById('filter-date')?.value || '';
  const periodFilter = document.getElementById('filter-period')?.value || 'all';

  let filtered = allGuests.slice();

  if (typeFilter !== 'all') {
    filtered = filtered.filter(g => g.tipe_kunjungan === typeFilter);
  }

  if (dateFilter) {
    filtered = filtered.filter(g => g.timestamp && String(g.timestamp).slice(0, 10) === dateFilter);
  } else if (periodFilter && periodFilter !== 'all') {
    const range = getPeriodRange(periodFilter);
    if (range) {
      filtered = filtered.filter(g => {
        if (!g.timestamp) return false;
        const d = new Date(g.timestamp);
        if (isNaN(d.getTime())) return false;
        return d >= range.start && d <= range.end;
      });
    }
  }

  return filtered;
}

function periodLabel() {
  const p = document.getElementById('filter-period')?.value || 'all';
  const d = document.getElementById('filter-date')?.value || '';
  if (d) return 'Tanggal ' + d;
  return ({ all: 'Semua Periode', week: 'Minggu Ini', month: 'Bulan Ini', year: 'Tahun Ini' })[p] || p;
}


function renderTable() {
  const filtered = getFilteredGuests();

  // Stats hari ini
  const today = new Date().toISOString().slice(0, 10);
  const todayGuests = allGuests.filter(g => g.timestamp && g.timestamp.slice(0, 10) === today);

  document.getElementById('stat-total').textContent = todayGuests.length;
  document.getElementById('stat-registrasi').textContent =
    todayGuests.filter(g => g.tipe_kunjungan === 'registrasi').length;
  document.getElementById('stat-wajib').textContent =
    todayGuests.filter(g => g.tipe_kunjungan === 'wajib-lapor').length;
  document.getElementById('stat-keluarga').textContent =
    todayGuests.filter(g => g.tipe_kunjungan === 'keluarga').length;

  const tbody = document.getElementById('guest-tbody');
  const empty = document.getElementById('empty-state');

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    empty.innerHTML = '<p>Belum ada data kunjungan.</p>';
    return;
  }

  empty.style.display = 'none';

  tbody.innerHTML = filtered.map(g => {
    const badgeClass = {
      registrasi: 'badge-registrasi',
      'wajib-lapor': 'badge-wajib',
      keluarga: 'badge-keluarga'
    }[g.tipe_kunjungan] || '';

    return `
      <tr>
        <td>
          <div>${escapeHtml(g.waktu) || '-'}</div>
          <small style="color:#718096">${formatShortDate(g.timestamp)}</small>
        </td>
        <td><span class="badge ${badgeClass}">${escapeHtml(g.tipe_label || g.tipe_kunjungan)}</span></td>
        <td><strong>${escapeHtml(g.nama)}</strong></td>
        <td>${escapeHtml(g.nik || '-')}</td>
        <td>
          <button class="btn-detail" data-id="${escapeHtml(g.id)}">Lihat</button>
        </td>
        <td>
          <button class="btn-delete" data-id="${escapeHtml(g.id)}" title="Hapus">Hapus</button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', () => showDetail(btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deleteGuest(btn.dataset.id));
  });
}

function formatShortDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showDetail(id) {
  const guest = allGuests.find(g => g.id === id);
  if (!guest) return;

  const body = document.getElementById('modal-body');
  const fields = [
    ['Jenis Kunjungan', guest.tipe_label],
    ['Tanggal', guest.tanggal],
    ['Waktu', guest.waktu],
    ['Nama Lengkap', guest.nama],
    ['NIK / Identitas', guest.nik],
    ['No. HP', guest.no_hp || '-'],
    ['Keperluan', guest.keperluan],
    ['Catatan', guest.catatan || '-'],
    ['Lapas/Rutan', guest.lapas_rutan || '-'],
    ['Tanda Tangan', guest.tanda_tangan || '-']
  ];

  if (guest.tipe_kunjungan === 'registrasi') {
    fields.push(
      ['No. Register', guest.no_register || '-'],
      ['Jenis Kasus', guest.jenis_kasus || '-'],
      ['Alamat', guest.alamat || '-'],
      ['PK Tujuan', guest.pk_tujuan || '-']
    );
  } else if (guest.tipe_kunjungan === 'wajib-lapor') {
    fields.push(
      ['No. Register', guest.no_register || '-'],
      ['Periode Lapor', guest.periode_lapor || '-'],
      ['Lapor Terakhir', guest.tanggal_lapor_sebelumnya || '-'],
      ['PK Pembimbing', guest.pk_tujuan || '-'],
      ['Status', guest.status_klien || '-']
    );
  } else if (guest.tipe_kunjungan === 'keluarga') {
    fields.push(
      ['Nama Klien', guest.nama_klien || '-'],
      ['Hubungan', guest.hubungan || '-'],
      ['No. Register Klien', guest.no_register_klien || '-'],
      ['PK Tujuan', guest.pk_tujuan || '-']
    );
  }

  body.innerHTML = fields.map(([label, value]) => {
    let display = escapeHtml(value);
    if (label === 'Tanda Tangan' && value && String(value).indexOf('http') === 0) {
      display = '<a href="' + escapeHtml(value) + '" target="_blank" rel="noopener">Lihat tanda tangan ↗</a>';
    }
    return '<div class="detail-row"><span class="detail-label">' + label + '</span><span class="detail-value">' + display + '</span></div>';
  }).join('');

  document.getElementById('detail-modal').classList.add('open');
}

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('detail-modal').classList.remove('open');
});

document.getElementById('detail-modal').addEventListener('click', (e) => {
  if (e.target.id === 'detail-modal') {
    e.target.classList.remove('open');
  }
});

async function deleteGuest(id) {
  if (!confirm('Yakin ingin menghapus data kunjungan ini?')) return;

  try {
    await fetch(CONFIG.SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'delete', id: id })
    });

    // Update local cache & re-render
    allGuests = allGuests.filter(g => g.id !== id);
    renderTable();
    alert('Data berhasil dihapus.');

  } catch (err) {
    alert('Gagal menghapus data: ' + err.message);
  }
}

// Filters
document.getElementById('filter-type').addEventListener('change', renderTable);
document.getElementById('filter-date').addEventListener('change', renderTable);
const periodEl = document.getElementById('filter-period');
if (periodEl) {
  periodEl.addEventListener('change', () => {
    // clear specific date when period chosen
    const d = document.getElementById('filter-date');
    if (d && periodEl.value !== 'all') d.value = '';
    renderTable();
  });
}

function exportRows() {
  return getFilteredGuests();
}

function exportFilename(ext) {
  const p = document.getElementById('filter-period')?.value || 'all';
  const tag = ({ all: 'semua', week: 'mingguan', month: 'bulanan', year: 'tahunan' })[p] || p;
  const day = new Date().toISOString().slice(0, 10);
  return `buku-tamu-bapas-lahat-${tag}-${day}.${ext}`;
}

// Export Excel (CSV UTF-8 — bisa dibuka di Excel)
const btnExcel = document.getElementById('btn-export-excel');
if (btnExcel) btnExcel.addEventListener('click', () => {
  const list = exportRows();
  if (list.length === 0) {
    alert('Tidak ada data untuk diekspor pada filter/periode ini.');
    return;
  }

  const headers = [
    'Tanggal', 'Waktu', 'Jenis', 'Nama', 'No HP', 'Keperluan',
    'PK', 'Lapas/Rutan', 'Nama Klien', 'Hubungan', 'Alamat', 'Jenis Kasus', 'Status', 'Catatan'
  ];

  const rows = list.map(g => [
    g.tanggal || '',
    g.waktu || '',
    g.tipe_label || '',
    g.nama || '',
    g.no_hp || '',
    g.keperluan || '',
    g.pk_tujuan || '',
    g.lapas_rutan || '',
    g.nama_klien || '',
    g.hubungan || '',
    g.alamat || '',
    g.jenis_kasus || '',
    g.status_klien || '',
    g.catatan || ''
  ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = exportFilename('csv');
  a.click();
  URL.revokeObjectURL(url);
});

// Export PDF
const btnPdf = document.getElementById('btn-export-pdf');
if (btnPdf) btnPdf.addEventListener('click', () => {
  const list = exportRows();
  if (list.length === 0) {
    alert('Tidak ada data untuk diekspor pada filter/periode ini.');
    return;
  }

  if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
    // fallback: print window
    printPdfFallback(list);
    return;
  }

  const { jsPDF } = window.jspdf || window;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const title = 'Laporan Buku Tamu — Bapas Kelas II Lahat';
  const periode = periodLabel();
  const nowStr = new Date().toLocaleString('id-ID');

  doc.setFontSize(14);
  doc.text(title, 14, 14);
  doc.setFontSize(10);
  doc.text('Periode: ' + periode + '  |  Dicetak: ' + nowStr + '  |  Jumlah: ' + list.length, 14, 21);

  const body = list.map(g => [
    g.tanggal || '',
    g.waktu || '',
    g.tipe_label || '',
    g.nama || '',
    g.no_hp || '',
    g.pk_tujuan || '',
    g.lapas_rutan || '',
    (g.keperluan || '').slice(0, 40)
  ]);

  doc.autoTable({
    startY: 26,
    head: [['Tanggal', 'Waktu', 'Jenis', 'Nama', 'No HP', 'PK', 'Lapas/Rutan', 'Keperluan']],
    body,
    styles: { fontSize: 8, cellPadding: 1.5 },
    headStyles: { fillColor: [15, 43, 76] },
    margin: { left: 14, right: 14 }
  });

  doc.save(exportFilename('pdf'));
});

function printPdfFallback(list) {
  const periode = periodLabel();
  const rows = list.map(g => `<tr>
    <td>${g.tanggal || ''}</td>
    <td>${g.waktu || ''}</td>
    <td>${g.tipe_label || ''}</td>
    <td>${g.nama || ''}</td>
    <td>${g.no_hp || ''}</td>
    <td>${g.pk_tujuan || ''}</td>
    <td>${g.lapas_rutan || ''}</td>
    <td>${(g.keperluan || '').replace(/</g, '&lt;')}</td>
  </tr>`).join('');
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Laporan Buku Tamu</title>
    <style>
      body{font-family:system-ui,sans-serif;padding:20px;font-size:12px}
      h1{font-size:16px;margin:0 0 6px}
      p{margin:0 0 12px;color:#444}
      table{border-collapse:collapse;width:100%}
      th,td{border:1px solid #ccc;padding:5px 6px;text-align:left}
      th{background:#0f2b4c;color:#fff}
    </style></head><body>
    <h1>Laporan Buku Tamu — Bapas Kelas II Lahat</h1>
    <p>Periode: ${periode} · Jumlah: ${list.length}</p>
    <table><thead><tr>
      <th>Tanggal</th><th>Waktu</th><th>Jenis</th><th>Nama</th><th>No HP</th><th>PK</th><th>Lapas/Rutan</th><th>Keperluan</th>
    </tr></thead><tbody>${rows}</tbody></table>
    <script>window.onload=function(){window.print();}</script>
    </body></html>`);
  w.document.close();
}

// Clear all
document.getElementById('btn-clear').addEventListener('click', async () => {
  if (!confirm('Yakin ingin menghapus SEMUA data kunjungan? Tindakan ini tidak dapat dibatalkan.')) return;
  if (!confirm('Konfirmasi sekali lagi: Hapus semua data di Google Sheet?')) return;

  try {
    await fetch(CONFIG.SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'clear' })
    });

    allGuests = [];
    renderTable();
    alert('Semua data berhasil dihapus.');
  } catch (err) {
    alert('Gagal menghapus data: ' + err.message);
  }
});

// Tombol refresh (opsional - bisa ditambahkan di UI nanti)
window.refreshData = loadAndRender;
