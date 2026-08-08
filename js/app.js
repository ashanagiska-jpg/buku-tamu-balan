// Buku Tamu Online - Bapas Lahat

const PK_LIST = [
  { name: 'Firman',    foto: 'firman.jpg' },
  { name: 'Sarnudi',   foto: 'sarnudi.jpg' },
  { name: 'Merwandi',  foto: 'merwandi.jpg' },
  { name: 'Rinto',     foto: 'rinto.jpg' },
  { name: 'Darwind',   foto: 'darwind.jpg' },
  { name: 'Eryzal',    foto: 'eryzal.jpg' },
  { name: 'Rozak',     foto: 'rozak.jpg' },
  { name: 'Revan',     foto: 'revan.jpg' },
  { name: 'Marendi',   foto: 'marendi.jpg' },
  { name: 'Armicho',   foto: 'armicho.jpg' },
  { name: 'Henry',     foto: 'henry.jpg' },
  { name: 'Simamora',  foto: 'simamora.jpg' },
  { name: 'Arif',      foto: 'arif.jpg' },
  { name: 'Muslimah',  foto: 'muslimah.jpg' },
  { name: 'Pinesthi',  foto: 'pinesthi.jpg' }
];

const AVATAR_COLORS = [
  '#1d6fb8','#0d9488','#7c3aed','#c2410c','#be185d',
  '#0369a1','#15803d','#a16207','#4f46e5','#b91c1c',
  '#0e7490','#7e22ce','#b45309','#db2777','#1e40af'
];

const FOTO_BASE = 'img/pk/';

const formConfigs = {
  registrasi: {
    title: 'Form Klien Registrasi Awal',
    fields: `
      <div class="form-group">
        <label for="lapas_rutan">Bebas dari Lapas / Rutan <span class="required">*</span></label>
        <select id="lapas_rutan" name="lapas_rutan" required>
          <option value="">Pilih Lapas / Rutan</option>
          <option value="Lapas Kelas IIA Lahat">Lapas Kelas IIA Lahat</option>
          <option value="Lapas Kelas III Pagar Alam">Lapas Kelas III Pagar Alam</option>
          <option value="Lapas Kelas IIB Muara Enim">Lapas Kelas IIB Muara Enim</option>
          <option value="LPKA Kelas I Palembang">LPKA Kelas I Palembang</option>
          <option value="Lapas Kelas IIB Empat Lawang">Lapas Kelas IIB Empat Lawang</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>
      <div class="form-group" id="lapas_lainnya_wrap" style="display:none">
        <label for="lapas_lainnya">Nama Lapas / Rutan Lainnya <span class="required">*</span></label>
        <input type="text" id="lapas_lainnya" name="lapas_lainnya" placeholder="Tulis nama Lapas/Rutan" />
      </div>
      <div class="form-group">
        <label for="jenis_kasus">Jenis Kasus / Pasal</label>
        <input type="text" id="jenis_kasus" name="jenis_kasus" placeholder="Contoh: Pasal 362 KUHP" />
      </div>
      <div class="form-group">
        <label for="alamat">Alamat Lengkap <span class="required">*</span></label>
        <textarea id="alamat" name="alamat" rows="2" required placeholder="Alamat domisili saat ini"></textarea>
      </div>
    `,
    pkRequired: false
  },
  'wajib-lapor': {
    title: 'Form Klien Wajib Lapor',
    fields: `
      <div class="form-group">
        <label for="status_klien">Status Saat Ini</label>
        <select id="status_klien" name="status_klien">
          <option value="">Pilih status</option>
          <option value="Baik">Baik / Lancar</option>
          <option value="Bermasalah">Ada Kendala</option>
          <option value="Pindah Domisili">Pindah Domisili</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>
    `,
    pkRequired: true
  },
  keluarga: {
    title: 'Form Keluarga Klien (Bertemu PK)',
    fields: `
      <div class="form-group">
        <label for="nama_klien">Nama Klien yang Dituju <span class="required">*</span></label>
        <input type="text" id="nama_klien" name="nama_klien" required placeholder="Nama lengkap klien" />
      </div>
      <div class="form-group">
        <label for="hubungan">Hubungan dengan Klien <span class="required">*</span></label>
        <select id="hubungan" name="hubungan" required>
          <option value="">Pilih hubungan</option>
          <option value="Orang Tua">Orang Tua</option>
          <option value="Suami/Istri">Suami / Istri</option>
          <option value="Anak">Anak</option>
          <option value="Saudara">Saudara Kandung</option>
          <option value="Kerabat">Kerabat Lain</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>
    `,
    pkRequired: true
  }
};

// DOM
const welcomeScreen = document.getElementById('welcome-screen');
const formScreen = document.getElementById('form-screen');
const successScreen = document.getElementById('success-screen');
const guestForm = document.getElementById('guest-form');
const formTitle = document.getElementById('form-title');
const dynamicFields = document.getElementById('dynamic-fields');
const tipeInput = document.getElementById('tipe_kunjungan');
const pkInput = document.getElementById('pk_tujuan');
const pkReqMark = document.getElementById('pk-req-mark');

// PK Modal elements
const pkModal = document.getElementById('pk-modal');
const pkSlideFoto = document.getElementById('pk-slide-foto');
const pkSlideFallback = document.getElementById('pk-slide-fallback');
const pkSlideName = document.getElementById('pk-slide-name');
const pkSlideCounter = document.getElementById('pk-slide-counter');
const pkDots = document.getElementById('pk-dots');
const pkTrigger = document.getElementById('pk-trigger');
const pkTriggerEmpty = document.getElementById('pk-trigger-empty');
const pkTriggerSelected = document.getElementById('pk-trigger-selected');
const pkTriggerFoto = document.getElementById('pk-trigger-foto');
const pkTriggerName = document.getElementById('pk-trigger-name');

let pkIndex = 0;
let pkRequired = false;
let currentFormType = '';

// ===== Statistik + Grafik =====
let cachedGuests = [];
let statsChart = null;
let trendChart = null;
let compareChart = null;
let pkStatsChart = null;
let pkStatsPeriod = 'week';
let lapasStatsChart = null;
let lapasStatsPeriod = 'week';
let comparePeriod = 'week';
let currentPeriod = 'week';

function getPeriodRange(period) {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  let start;

  if (period === 'week') {
    const day = now.getDay();
    const diffToMon = day === 0 ? 6 : day - 1;
    start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(now.getDate() - diffToMon);
  } else if (period === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    // year
    start = new Date(now.getFullYear(), 0, 1);
  }
  return { start, end: now };
}

function filterByPeriod(list, period) {
  const { start, end } = getPeriodRange(period);
  return list.filter(g => {
    if (!g.timestamp) return false;
    const d = new Date(g.timestamp);
    if (isNaN(d.getTime())) return false;
    return d >= start && d <= end;
  });
}

function countByType(list) {
  return {
    registrasi: list.filter(g => g.tipe_kunjungan === 'registrasi').length,
    wajib: list.filter(g => g.tipe_kunjungan === 'wajib-lapor').length,
    penjamin: list.filter(g => g.tipe_kunjungan === 'keluarga').length,
    total: list.length
  };
}

function buildTrendLabels(period, list) {
  // Group counts per day/week/month for line-friendly bar chart
  const { start, end } = getPeriodRange(period);
  const buckets = [];
  const labels = [];

  if (period === 'week') {
    // 7 days Mon-Sun
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      labels.push(d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }));
      buckets.push(key);
    }
    const byDay = { registrasi: [], wajib: [], penjamin: [] };
    buckets.forEach(key => {
      const dayList = list.filter(g => g.timestamp && String(g.timestamp).slice(0, 10) === key);
      byDay.registrasi.push(dayList.filter(g => g.tipe_kunjungan === 'registrasi').length);
      byDay.wajib.push(dayList.filter(g => g.tipe_kunjungan === 'wajib-lapor').length);
      byDay.penjamin.push(dayList.filter(g => g.tipe_kunjungan === 'keluarga').length);
    });
    return { labels, byDay };
  }

  if (period === 'month') {
    // Group by week of month (W1-W5) or by day if short - use weeks
    const weeks = [[], [], [], [], []];
    const weekLabels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'];
    list.forEach(g => {
      const d = new Date(g.timestamp);
      if (isNaN(d.getTime())) return;
      const weekNum = Math.min(4, Math.floor((d.getDate() - 1) / 7));
      weeks[weekNum].push(g);
    });
    // only show weeks that exist in month
    const daysInMonth = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
    const numWeeks = Math.ceil(daysInMonth / 7);
    const labels = weekLabels.slice(0, numWeeks);
    const byDay = { registrasi: [], wajib: [], penjamin: [] };
    for (let i = 0; i < numWeeks; i++) {
      byDay.registrasi.push(weeks[i].filter(g => g.tipe_kunjungan === 'registrasi').length);
      byDay.wajib.push(weeks[i].filter(g => g.tipe_kunjungan === 'wajib-lapor').length);
      byDay.penjamin.push(weeks[i].filter(g => g.tipe_kunjungan === 'keluarga').length);
    }
    return { labels, byDay };
  }

  // year - 12 months
  const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const yearLabels = monthNames;
  const byDay = { registrasi: [], wajib: [], penjamin: [] };
  for (let m = 0; m < 12; m++) {
    const mList = list.filter(g => {
      const d = new Date(g.timestamp);
      return !isNaN(d.getTime()) && d.getMonth() === m && d.getFullYear() === end.getFullYear();
    });
    byDay.registrasi.push(mList.filter(g => g.tipe_kunjungan === 'registrasi').length);
    byDay.wajib.push(mList.filter(g => g.tipe_kunjungan === 'wajib-lapor').length);
    byDay.penjamin.push(mList.filter(g => g.tipe_kunjungan === 'keluarga').length);
  }
  return { labels: yearLabels, byDay };
}

function renderChart(period) {
  currentPeriod = period;
  const canvas = document.getElementById('stats-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  const filtered = filterByPeriod(cachedGuests, period);
  const counts = countByType(filtered);
  const trend = buildTrendLabels(period, filtered);

  // Breakdown numbers
  const bdReg = document.getElementById('bd-reg');
  const bdWajib = document.getElementById('bd-wajib');
  const bdKel = document.getElementById('bd-kel');
  if (bdReg) bdReg.textContent = counts.registrasi;
  if (bdWajib) bdWajib.textContent = counts.wajib;
  if (bdKel) bdKel.textContent = counts.penjamin;

  // Tabs active
  document.querySelectorAll('.period-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.period === period);
  });

  if (statsChart) {
    statsChart.destroy();
    statsChart = null;
  }

  statsChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: trend.labels,
      datasets: [
        {
          label: 'Registrasi Awal',
          data: trend.byDay.registrasi,
          backgroundColor: 'rgba(29, 111, 184, 0.85)',
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 28
        },
        {
          label: 'Wajib Lapor',
          data: trend.byDay.wajib,
          backgroundColor: 'rgba(13, 148, 136, 0.85)',
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 28
        },
        {
          label: 'Penjamin',
          data: trend.byDay.penjamin,
          backgroundColor: 'rgba(194, 65, 12, 0.85)',
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 28
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f2b4c',
          titleFont: { size: 13, weight: '700' },
          bodyFont: { size: 12 },
          footerFont: { size: 11, weight: '600' },
          padding: 12,
          cornerRadius: 10,
          boxPadding: 5,
          usePointStyle: true,
          callbacks: {
            title: function(items) {
              if (!items.length) return '';
              const label = items[0].label || '';
              const periodLabel = currentPeriod === 'week' ? 'Hari' :
                                 currentPeriod === 'month' ? 'Periode' : 'Bulan';
              return periodLabel + ': ' + label;
            },
            label: function(ctx) {
              const val = ctx.parsed.y || 0;
              const satuan = val === 1 ? ' kunjungan' : ' kunjungan';
              return '  ' + ctx.dataset.label + ': ' + val + satuan;
            },
            afterBody: function(items) {
              if (!items.length) return [];
              const idx = items[0].dataIndex;
              const ds = items[0].chart.data.datasets;
              const sum = ds.reduce((s, d) => s + (d.data[idx] || 0), 0);
              return ['', '────────────────', 'Total: ' + sum + ' kunjungan'];
            },
            footer: function(items) {
              if (!items.length) return '';
              const idx = items[0].dataIndex;
              const ds = items[0].chart.data.datasets;
              const sum = ds.reduce((s, d) => s + (d.data[idx] || 0), 0);
              if (sum === 0) return 'Belum ada data pada periode ini';
              return ds.map(d => {
                const v = d.data[idx] || 0;
                const pct = Math.round((v / sum) * 100);
                return d.label + ' ' + pct + '%';
              }).join(' · ');
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, color: '#64748b' }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: { size: 11 },
            color: '#64748b',
            precision: 0
          },
          grid: { color: 'rgba(220,227,235,0.8)' }
        }
      }
    }
  });
}


function renderTrendChart() {
  const canvas = document.getElementById('trend-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  const now = new Date();
  const year = now.getFullYear();
  const yearLabel = document.getElementById('trend-year-label');
  if (yearLabel) yearLabel.textContent = '(' + year + ')';

  const monthNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const reg = [], wajib = [], penjamin = [], total = [];

  for (let m = 0; m < 12; m++) {
    const mList = cachedGuests.filter(g => {
      if (!g.timestamp) return false;
      const d = new Date(g.timestamp);
      return !isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === m;
    });
    reg.push(mList.filter(g => g.tipe_kunjungan === 'registrasi').length);
    wajib.push(mList.filter(g => g.tipe_kunjungan === 'wajib-lapor').length);
    penjamin.push(mList.filter(g => g.tipe_kunjungan === 'keluarga').length);
    total.push(mList.length);
  }

  if (trendChart) {
    trendChart.destroy();
    trendChart = null;
  }

  trendChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: monthNames,
      datasets: [
        {
          label: 'Registrasi Awal',
          data: reg,
          borderColor: '#1d6fb8',
          backgroundColor: 'rgba(29, 111, 184, 0.12)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#1d6fb8',
          tension: 0.35,
          fill: false
        },
        {
          label: 'Wajib Lapor',
          data: wajib,
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.12)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#0d9488',
          tension: 0.35,
          fill: false
        },
        {
          label: 'Penjamin',
          data: penjamin,
          borderColor: '#c2410c',
          backgroundColor: 'rgba(194, 65, 12, 0.12)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#c2410c',
          tension: 0.35,
          fill: false
        },
        {
          label: 'Total',
          data: total,
          borderColor: '#64748b',
          backgroundColor: 'rgba(100, 116, 139, 0.08)',
          borderWidth: 2,
          borderDash: [5, 4],
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: '#64748b',
          tension: 0.35,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 14,
            font: { size: 11 }
          }
        },
        tooltip: {
          backgroundColor: '#0f2b4c',
          titleFont: { size: 13, weight: '700' },
          bodyFont: { size: 12 },
          footerFont: { size: 11, weight: '600' },
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            title: function(items) {
              if (!items.length) return '';
              return 'Bulan: ' + items[0].label + ' ' + year;
            },
            label: function(ctx) {
              return '  ' + ctx.dataset.label + ': ' + (ctx.parsed.y || 0) + ' kunjungan';
            },
            afterBody: function(items) {
              if (!items.length) return [];
              const idx = items[0].dataIndex;
              // total from total dataset or sum of 3
              const t = total[idx] || 0;
              return ['', 'Total kunjungan: ' + t];
            },
            footer: function(items) {
              if (!items.length) return '';
              const idx = items[0].dataIndex;
              const t = total[idx] || 0;
              if (t === 0) return 'Belum ada data';
              const r = reg[idx] || 0, w = wajib[idx] || 0, p = penjamin[idx] || 0;
              return 'Reg ' + Math.round(r/t*100) + '% · Wajib ' + Math.round(w/t*100) + '% · Penjamin ' + Math.round(p/t*100) + '%';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 }, color: '#64748b' }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            precision: 0,
            font: { size: 11 },
            color: '#64748b'
          },
          grid: { color: 'rgba(220,227,235,0.8)' }
        }
      }
    }
  });
}



function renderCompareChart(period) {
  if (period) comparePeriod = period;
  period = comparePeriod;

  const canvas = document.getElementById('compare-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  const filtered = filterByPeriod(cachedGuests, period);
  const counts = countByType(filtered);
  const total = counts.total || 0;

  const vals = [counts.registrasi, counts.wajib, counts.penjamin];
  const pcts = vals.map(v => total ? Math.round((v / total) * 100) : 0);

  // Update side stats + bars
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('cmp-reg', counts.registrasi);
  set('cmp-wajib', counts.wajib);
  set('cmp-kel', counts.penjamin);
  set('cmp-pct-reg', pcts[0] + '%');
  set('cmp-pct-wajib', pcts[1] + '%');
  set('cmp-pct-kel', pcts[2] + '%');
  set('cmp-total', total);

  const bar = (id, pct) => {
    const el = document.getElementById(id);
    if (el) el.style.width = pct + '%';
  };
  bar('cmp-bar-reg', pcts[0]);
  bar('cmp-bar-wajib', pcts[1]);
  bar('cmp-bar-kel', pcts[2]);

  // Tabs
  document.querySelectorAll('#compare-tabs .period-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.compare === period);
  });

  if (compareChart) {
    compareChart.destroy();
    compareChart = null;
  }

  const periodTitle = period === 'week' ? 'Minggu Ini' : period === 'month' ? 'Bulan Ini' : 'Tahun Ini';

  compareChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Registrasi Awal', 'Wajib Lapor', 'Penjamin'],
      datasets: [{
        data: vals,
        backgroundColor: [
          'rgba(29, 111, 184, 0.9)',
          'rgba(13, 148, 136, 0.9)',
          'rgba(194, 65, 12, 0.9)'
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f2b4c',
          titleFont: { size: 13, weight: '700' },
          bodyFont: { size: 12 },
          footerFont: { size: 11, weight: '600' },
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            title: function(items) {
              return periodTitle;
            },
            label: function(ctx) {
              const v = ctx.parsed || 0;
              const p = total ? Math.round((v / total) * 100) : 0;
              return '  ' + ctx.label + ': ' + v + ' kunjungan (' + p + '%)';
            },
            afterBody: function() {
              return ['', 'Total: ' + total + ' kunjungan'];
            },
            footer: function(items) {
              if (!items.length || total === 0) return 'Belum ada data';
              const v = items[0].parsed || 0;
              const lainnya = total - v;
              return 'Kategori lain: ' + lainnya + ' (' + (total ? Math.round(lainnya/total*100) : 0) + '%)';
            }
          }
        }
      }
    }
  });
}



function getPkCounts(period) {
  let list;
  if (period === 'all') {
    list = cachedGuests;
  } else {
    list = filterByPeriod(cachedGuests, period);
  }
  const map = {};
  list.forEach(g => {
    const name = (g.pk_tujuan || '').trim();
    if (!name) return;
    map[name] = (map[name] || 0) + 1;
  });
  // include PKs with 0 for completeness? only those with visits is cleaner
  const ranked = Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  return ranked;
}

function renderPkStats(period) {
  if (period) pkStatsPeriod = period;
  period = pkStatsPeriod;

  const ranked = getPkCounts(period);
  const canvas = document.getElementById('pk-stats-chart');
  const listEl = document.getElementById('pk-rank-list');

  document.querySelectorAll('#pk-stats-tabs .period-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.pkPeriod === period);
  });

  // Rank list
  if (listEl) {
    if (ranked.length === 0) {
      listEl.innerHTML = '<p class="pk-rank-empty">Belum ada data kunjungan PK pada periode ini</p>';
    } else {
      const max = ranked[0].count || 1;
      listEl.innerHTML = ranked.map((item, i) => {
        const topClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
        const pct = Math.round((item.count / max) * 100);
        return `<div class="pk-rank-item ${topClass}">
          <span class="pk-rank-no">${i + 1}</span>
          <span class="pk-rank-name">${item.name}</span>
          <span class="pk-rank-bar-wrap"><span class="pk-rank-bar" style="width:${pct}%"></span></span>
          <span class="pk-rank-count">${item.count}</span>
        </div>`;
      }).join('');
    }
  }

  if (!canvas || typeof Chart === 'undefined') return;

  // Top 10 for chart readability
  const top = ranked.slice(0, 10);
  const labels = top.map(r => r.name);
  const data = top.map(r => r.count);

  if (pkStatsChart) {
    pkStatsChart.destroy();
    pkStatsChart = null;
  }

  const periodLabel = { week: 'Minggu Ini', month: 'Bulan Ini', year: 'Tahun Ini', all: 'Semua Waktu' }[period] || period;

  pkStatsChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels.length ? labels : ['(belum ada data)'],
      datasets: [{
        label: 'Jumlah Kunjungan',
        data: data.length ? data : [0],
        backgroundColor: labels.map((_, i) => {
          const colors = ['#1d6fb8','#0d9488','#c2410c','#7c3aed','#b45309','#0369a1','#be185d','#15803d','#4f46e5','#0e7490'];
          return colors[i % colors.length];
        }),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 36
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f2b4c',
          titleFont: { size: 13, weight: '700' },
          bodyFont: { size: 12 },
          footerFont: { size: 11, weight: '600' },
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            title: function(items) {
              return items.length ? 'PK: ' + items[0].label : '';
            },
            label: function(ctx) {
              const v = ctx.parsed.x || 0;
              return '  ' + v + ' kunjungan';
            },
            afterBody: function(items) {
              if (!items.length) return [];
              const total = ranked.reduce((s, r) => s + r.count, 0);
              const v = items[0].parsed.x || 0;
              const pct = total ? Math.round((v / total) * 100) : 0;
              return ['', 'Periode: ' + periodLabel, 'Porsi: ' + pct + '% dari ' + total + ' kunjungan ber-PK'];
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { stepSize: 1, precision: 0, font: { size: 11 }, color: '#64748b' },
          grid: { color: 'rgba(220,227,235,0.8)' }
        },
        y: {
          ticks: { font: { size: 11 }, color: '#334155' },
          grid: { display: false }
        }
      }
    }
  });
}



function getLapasCounts(period) {
  let list;
  if (period === 'all') {
    list = cachedGuests;
  } else {
    list = filterByPeriod(cachedGuests, period);
  }
  // Only registrasi typically has lapas, but count any row with lapas_rutan
  const map = {};
  list.forEach(g => {
    const name = (g.lapas_rutan || '').trim();
    if (!name) return;
    map[name] = (map[name] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function renderLapasStats(period) {
  if (period) lapasStatsPeriod = period;
  period = lapasStatsPeriod;

  const ranked = getLapasCounts(period);
  const canvas = document.getElementById('lapas-stats-chart');
  const listEl = document.getElementById('lapas-rank-list');

  document.querySelectorAll('#lapas-stats-tabs .period-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.lapasPeriod === period);
  });

  if (listEl) {
    if (ranked.length === 0) {
      listEl.innerHTML = '<p class="pk-rank-empty">Belum ada data Lapas/Rutan pada periode ini</p>';
    } else {
      const max = ranked[0].count || 1;
      listEl.innerHTML = ranked.map((item, i) => {
        const topClass = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
        const pct = Math.round((item.count / max) * 100);
        return `<div class="pk-rank-item ${topClass}">
          <span class="pk-rank-no">${i + 1}</span>
          <span class="pk-rank-name">${item.name}</span>
          <span class="pk-rank-bar-wrap"><span class="pk-rank-bar" style="width:${pct}%;background:#0d9488"></span></span>
          <span class="pk-rank-count">${item.count}</span>
        </div>`;
      }).join('');
    }
  }

  if (!canvas || typeof Chart === 'undefined') return;

  const top = ranked.slice(0, 10);
  const labels = top.map(r => r.name.length > 28 ? r.name.slice(0, 26) + '…' : r.name);
  const fullNames = top.map(r => r.name);
  const data = top.map(r => r.count);

  if (lapasStatsChart) {
    lapasStatsChart.destroy();
    lapasStatsChart = null;
  }

  const periodLabel = { week: 'Minggu Ini', month: 'Bulan Ini', year: 'Tahun Ini', all: 'Semua Waktu' }[period] || period;

  lapasStatsChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels.length ? labels : ['(belum ada data)'],
      datasets: [{
        label: 'Jumlah Klien',
        data: data.length ? data : [0],
        backgroundColor: labels.map((_, i) => {
          const colors = ['#0d9488','#1d6fb8','#c2410c','#7c3aed','#b45309','#0369a1','#be185d','#15803d','#4f46e5','#0e7490'];
          return colors[i % colors.length];
        }),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 36
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f2b4c',
          titleFont: { size: 13, weight: '700' },
          bodyFont: { size: 12 },
          footerFont: { size: 11, weight: '600' },
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            title: function(items) {
              if (!items.length) return '';
              const idx = items[0].dataIndex;
              return 'Lapas/Rutan: ' + (fullNames[idx] || items[0].label);
            },
            label: function(ctx) {
              return '  ' + (ctx.parsed.x || 0) + ' klien registrasi';
            },
            afterBody: function(items) {
              if (!items.length) return [];
              const total = ranked.reduce((s, r) => s + r.count, 0);
              const v = items[0].parsed.x || 0;
              const pct = total ? Math.round((v / total) * 100) : 0;
              return ['', 'Periode: ' + periodLabel, 'Porsi: ' + pct + '% dari ' + total + ' data'];
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { stepSize: 1, precision: 0, font: { size: 11 }, color: '#64748b' },
          grid: { color: 'rgba(220,227,235,0.8)' }
        },
        y: {
          ticks: { font: { size: 10 }, color: '#334155' },
          grid: { display: false }
        }
      }
    }
  });
}



function renderTodayVisitors() {
  const listEl = document.getElementById('today-visitors-list');
  const countEl = document.getElementById('today-visitors-count');
  if (!listEl) return;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayList = (cachedGuests || []).filter(g => {
    if (!g.timestamp) return false;
    return String(g.timestamp).slice(0, 10) === todayStr;
  });

  // newest first (already often reversed from sheet)
  todayList.sort((a, b) => {
    const ta = new Date(a.timestamp).getTime() || 0;
    const tb = new Date(b.timestamp).getTime() || 0;
    return tb - ta;
  });

  if (countEl) countEl.textContent = todayList.length;

  if (todayList.length === 0) {
    listEl.innerHTML = '<p class="pk-rank-empty">Belum ada pengunjung hari ini</p>';
    return;
  }

  const badgeClass = {
    registrasi: 'reg',
    'wajib-lapor': 'wajib',
    keluarga: 'kel'
  };
  const badgeLabel = {
    registrasi: 'Registrasi',
    'wajib-lapor': 'Wajib Lapor',
    keluarga: 'Penjamin'
  };

  listEl.innerHTML = todayList.map(g => {
    const bc = badgeClass[g.tipe_kunjungan] || 'reg';
    const bl = badgeLabel[g.tipe_kunjungan] || (g.tipe_label || '-');
    const waktu = g.waktu || '-';
    const pk = g.pk_tujuan ? ` · PK: ${g.pk_tujuan}` : '';
    const name = (g.nama || '-').replace(/</g, '&lt;');
    return `<div class="today-visitor-item">
      <span class="tv-time">${waktu}</span>
      <div>
        <div class="tv-name">${name}</div>
        <div class="tv-meta">${bl}${pk}</div>
      </div>
      <span class="tv-badge ${bc}">${bl}</span>
    </div>`;
  }).join('');
}


async function loadStats() {
  const elToday = document.getElementById('stat-today');
  const elWeek = document.getElementById('stat-week');
  const elMonth = document.getElementById('stat-month');
  const elYear = document.getElementById('stat-year');
  const elMeta = document.getElementById('stats-meta');

  if (!elToday) return;

  [elToday, elWeek, elMonth, elYear].forEach(el => { if (el) el.textContent = '…'; });
  if (elMeta) {
    elMeta.textContent = 'Memuat statistik...';
    elMeta.classList.remove('error');
  }

  try {
    if (!CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL.includes('XXXX')) {
      [elToday, elWeek, elMonth, elYear].forEach(el => { if (el) el.textContent = '0'; });
      if (elMeta) elMeta.textContent = 'Hubungkan Google Sheets untuk data real-time';
      cachedGuests = [];
      renderChart(currentPeriod);
      renderTrendChart();
      renderCompareChart();
      renderPkStats();
      renderLapasStats();
      renderTodayVisitors();
      return;
    }

    const url = CONFIG.SCRIPT_URL + '?action=list&_=' + Date.now();
    const res = await fetch(url);
    const json = await res.json();

    if (!json.success) throw new Error(json.message || 'Gagal memuat data');

    cachedGuests = json.data || [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const day = now.getDay();
    const diffToMon = day === 0 ? 6 : day - 1;
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(now.getDate() - diffToMon);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    let nToday = 0, nWeek = 0, nMonth = 0, nYear = 0;
    cachedGuests.forEach(g => {
      if (!g.timestamp) return;
      const d = new Date(g.timestamp);
      if (isNaN(d.getTime())) return;
      if (d.toISOString().slice(0, 10) === todayStr) nToday++;
      if (d >= weekStart) nWeek++;
      if (d >= monthStart) nMonth++;
      if (d >= yearStart) nYear++;
    });

    elToday.textContent = nToday;
    elWeek.textContent = nWeek;
    elMonth.textContent = nMonth;
    elYear.textContent = nYear;

    if (elMeta) {
      const tgl = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      elMeta.textContent = `${tgl} · Total seluruh data: ${cachedGuests.length}`;
    }

    renderChart(currentPeriod);
    renderTrendChart();
    renderCompareChart();
    renderPkStats();
    renderLapasStats();
    renderTodayVisitors();
  } catch (err) {
    console.error('Stats error:', err);
    [elToday, elWeek, elMonth, elYear].forEach(el => { if (el) el.textContent = '–'; });
    if (elMeta) {
      elMeta.textContent = 'Statistik tidak tersedia';
      elMeta.classList.add('error');
    }
  }
}

// Period tab clicks
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.period-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      renderChart(tab.dataset.period);
    });
  });
});
// Also bind immediately if DOM already ready
document.querySelectorAll('.period-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    renderChart(tab.dataset.period);
  });
});



// Category buttons
document.querySelectorAll('.side-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showForm(btn.dataset.type);
    closeSidebar();
  });
});
document.getElementById('btn-back').addEventListener('click', showWelcome);
document.getElementById('btn-new').addEventListener('click', showWelcome);

function showScreen(screen) {
  [welcomeScreen, formScreen, successScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showWelcome() {
  guestForm.reset();
  clearPkSelection();
  showScreen(welcomeScreen);
  loadStats();
  document.querySelectorAll('.side-nav-btn').forEach(b => b.classList.remove('active'));
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = 'Dashboard';
}










function bindLapasLainnya() {
  const sel = document.getElementById('lapas_rutan');
  const wrap = document.getElementById('lapas_lainnya_wrap');
  const input = document.getElementById('lapas_lainnya');
  if (!sel || !wrap) return;
  const toggle = () => {
    const isLain = sel.value === 'Lainnya';
    wrap.style.display = isLain ? 'block' : 'none';
    if (input) {
      if (isLain) input.setAttribute('required', '');
      else {
        input.removeAttribute('required');
        input.value = '';
      }
    }
  };
  sel.addEventListener('change', toggle);
  toggle();
}

function showForm(type) {
  const config = formConfigs[type];
  if (!config) return;

  currentFormType = type;
  formTitle.textContent = config.title;
  tipeInput.value = type;
  dynamicFields.innerHTML = config.fields;
  pkRequired = config.pkRequired;
  pkReqMark.style.display = pkRequired ? 'inline' : 'none';
  if (pkRequired) pkInput.setAttribute('required', '');
  else pkInput.removeAttribute('required');

  clearPkSelection();
  bindLapasLainnya();
  showScreen(formScreen);

  // Highlight sidebar
  document.querySelectorAll('.side-nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.type === type);
  });
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = config.title.replace('Form ', '');
}

function clearPkSelection() {
  pkInput.value = '';
  pkTrigger.classList.remove('has-value');
  pkTriggerEmpty.style.display = 'flex';
  pkTriggerSelected.style.display = 'none';
  pkIndex = 0;
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ===== PK Modal =====
function openPkModal() {
  // Start at currently selected PK if any
  if (pkInput.value) {
    const idx = PK_LIST.findIndex(p => p.name === pkInput.value);
    if (idx >= 0) pkIndex = idx;
  }
  buildDots();
  renderSlide();
  pkModal.classList.add('open');
  pkModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePkModal() {
  pkModal.classList.remove('open');
  pkModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function buildDots() {
  pkDots.innerHTML = PK_LIST.map((_, i) =>
    `<button type="button" class="pk-dot${i === pkIndex ? ' active' : ''}" data-i="${i}" aria-label="PK ${i+1}"></button>`
  ).join('');
  pkDots.querySelectorAll('.pk-dot').forEach(d => {
    d.addEventListener('click', () => {
      const target = parseInt(d.dataset.i, 10);
      if (target === pkIndex) return;
      const direction = target > pkIndex ? 'next' : 'prev';
      // handle wrap-around heuristically for dots
      animateTo(target, direction);
    });
  });
}

let isAnimating = false;

function applySlideContent() {
  const pk = PK_LIST[pkIndex];
  const color = AVATAR_COLORS[pkIndex % AVATAR_COLORS.length];

  pkSlideName.textContent = pk.name;
  pkSlideCounter.textContent = `${pkIndex + 1} / ${PK_LIST.length}`;

  pkSlideFoto.style.display = 'block';
  pkSlideFallback.style.display = 'none';
  pkSlideFoto.src = FOTO_BASE + pk.foto;
  pkSlideFoto.alt = pk.name;
  pkSlideFoto.onerror = function () {
    this.style.display = 'none';
    pkSlideFallback.style.display = 'flex';
    pkSlideFallback.style.background = color;
    pkSlideFallback.textContent = getInitials(pk.name);
  };

  pkDots.querySelectorAll('.pk-dot').forEach((d, i) => {
    d.classList.toggle('active', i === pkIndex);
  });
}

function renderSlide() {
  applySlideContent();
}

function animateTo(newIndex, direction) {
  if (isAnimating) return;
  if (newIndex === pkIndex) return;

  isAnimating = true;
  const inner = document.getElementById('pk-slide-inner');
  if (!inner) {
    pkIndex = newIndex;
    applySlideContent();
    isAnimating = false;
    return;
  }

  // Slide out
  const outClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
  const inClass = direction === 'next' ? 'slide-in-from-right' : 'slide-in-from-left';

  inner.classList.remove('slide-in-from-left', 'slide-in-from-right', 'slide-out-left', 'slide-out-right');
  // force reflow
  void inner.offsetWidth;
  inner.classList.add(outClass);

  setTimeout(() => {
    pkIndex = newIndex;
    applySlideContent();
    inner.classList.remove(outClass);
    void inner.offsetWidth;
    inner.classList.add(inClass);

    setTimeout(() => {
      inner.classList.remove(inClass);
      isAnimating = false;
    }, 350);
  }, 280);
}

function nextPk() {
  const newIndex = (pkIndex + 1) % PK_LIST.length;
  animateTo(newIndex, 'next');
}
function prevPk() {
  const newIndex = (pkIndex - 1 + PK_LIST.length) % PK_LIST.length;
  animateTo(newIndex, 'prev');
}

function confirmPk() {
  const pk = PK_LIST[pkIndex];
  pkInput.value = pk.name;

  pkTrigger.classList.add('has-value');
  pkTriggerEmpty.style.display = 'none';
  pkTriggerSelected.style.display = 'flex';
  pkTriggerName.textContent = pk.name;
  pkTriggerFoto.src = FOTO_BASE + pk.foto;
  pkTriggerFoto.onerror = function () {
    this.style.display = 'none';
  };
  pkTriggerFoto.style.display = 'block';

  closePkModal();
}

// Bind modal controls
pkTrigger.addEventListener('click', openPkModal);
document.getElementById('pk-modal-close').addEventListener('click', closePkModal);
document.getElementById('pk-modal-backdrop').addEventListener('click', closePkModal);
document.getElementById('pk-prev').addEventListener('click', prevPk);
document.getElementById('pk-next').addEventListener('click', nextPk);
document.getElementById('pk-confirm').addEventListener('click', confirmPk);

// Keyboard
document.addEventListener('keydown', (e) => {
  if (!pkModal.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') prevPk();
  if (e.key === 'ArrowRight') nextPk();
  if (e.key === 'Escape') closePkModal();
  if (e.key === 'Enter') confirmPk();
});

// Swipe support
let touchStartX = 0;
let touchEndX = 0;
const slideArea = document.querySelector('.pk-slide-area');

slideArea.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

slideArea.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) nextPk();
    else prevPk();
  }
}, { passive: true });

// Mouse drag (desktop)
let mouseDown = false;
let mouseStartX = 0;
slideArea.addEventListener('mousedown', (e) => {
  mouseDown = true;
  mouseStartX = e.clientX;
});
document.addEventListener('mouseup', (e) => {
  if (!mouseDown) return;
  mouseDown = false;
  const diff = mouseStartX - e.clientX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) nextPk();
    else prevPk();
  }
});

// ===== Submit =====
guestForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  if (pkRequired && !pkInput.value) {
    alert('Silakan pilih Pembimbing Kemasyarakatan (PK) terlebih dahulu.');
    openPkModal();
    return;
  }

  const submitBtn = guestForm.querySelector('.btn-submit');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');

  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';

  const formData = new FormData(guestForm);
  const data = {
    action: 'add',
    id: generateId(),
    timestamp: new Date().toISOString(),
    tanggal: new Date().toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }),
    waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };

  formData.forEach((value, key) => {
    data[key] = value.trim();
  });

  // Normalisasi Lapas/Rutan: jika "Lainnya", pakai isian manual
  if (data.lapas_rutan === 'Lainnya' && data.lapas_lainnya) {
    data.lapas_rutan = data.lapas_lainnya;
  }
  delete data.lapas_lainnya;

  // TTD: kirim base64 ke server (disimpan Drive + link di Sheet)
  const ttdDataUrl = data.tanda_tangan || '';
  data._ttd_preview = ttdDataUrl;
  // data.tanda_tangan tetap base64 data URL untuk Apps Script

  const typeLabels = {
    registrasi: 'Klien Registrasi Awal',
    'wajib-lapor': 'Klien Wajib Lapor',
    keluarga: 'Keluarga Klien'
  };
  data.tipe_label = typeLabels[data.tipe_kunjungan] || data.tipe_kunjungan;

  try {
    if (!CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL.includes('XXXX')) {
      throw new Error('URL Google Apps Script belum dikonfigurasi. Lihat SETUP-GOOGLE-SHEETS.md');
    }
    await fetch(CONFIG.SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    });
    showSuccess(data);
  } catch (err) {
    console.error(err);
    alert('Gagal menyimpan data.\n\n' + err.message);
  } finally {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }
});

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function showSuccess(data) {
  const info = document.getElementById('success-info');
  const kode = (data.id || '').toUpperCase();
  let extra = '';
  if (data.pk_tujuan) extra += `<p><strong>PK:</strong> ${data.pk_tujuan}</p>`;
  if (data.lapas_rutan) extra += `<p><strong>Lapas/Rutan:</strong> ${data.lapas_rutan}</p>`;
  info.innerHTML = `
    <p><strong>Jenis:</strong> ${data.tipe_label}</p>
    <p><strong>Nama:</strong> ${data.nama}</p>
    ${data.no_hp ? `<p><strong>No. HP:</strong> ${data.no_hp}</p>` : ''}
    ${extra}
    <p><strong>Tanggal:</strong> ${data.tanggal}</p>
    <p><strong>Waktu:</strong> ${data.waktu}</p>
  `;
  const kodeEl = document.getElementById('bukti-kode');
  if (kodeEl) kodeEl.textContent = kode;
  document.getElementById('success-message').textContent =
    `Terima kasih, ${data.nama}. Bukti kedatangan Anda telah tercatat.`;
  showScreen(successScreen);
}


document.querySelectorAll('#compare-tabs .period-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    renderCompareChart(tab.dataset.compare);
  });
});


// Sidebar mobile
function openSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  if (sb) sb.classList.add('open');
  if (ov) ov.classList.add('show');
}
function closeSidebar() {
  const sb = document.getElementById('sidebar');
  const ov = document.getElementById('sidebar-overlay');
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('show');
}
const menuToggle = document.getElementById('menu-toggle');
if (menuToggle) menuToggle.addEventListener('click', openSidebar);
const sidebarOverlay = document.getElementById('sidebar-overlay');
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);


document.querySelectorAll('#pk-stats-tabs .period-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    renderPkStats(tab.dataset.pkPeriod);
  });
});


document.querySelectorAll('#lapas-stats-tabs .period-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    renderLapasStats(tab.dataset.lapasPeriod);
  });
});


const btnPrint = document.getElementById('btn-print-bukti');
if (btnPrint) {
  btnPrint.addEventListener('click', () => {
    window.print();
  });
}

// Muat statistik saat halaman dibuka
loadStats();
