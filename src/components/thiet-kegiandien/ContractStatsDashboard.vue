<template>
  <div class="page">
    <div>
      <!-- Header -->
      <header class="header">
        <div class="header__title">
          <span class="header__icon">
            <i class="fa-solid fa-chart-column"></i>
          </span>
          <div>
            <h1>Thống kê hợp đồng</h1>
            <p class="muted">Thống kê hợp đồng và doanh thu nâng cao</p>
          </div>
        </div>

        <div class="filter glass">
          <div class="filter__row" :class="{ 'filter__row--year': timeRange === 'year' }">
            <div class="field">
              <label>Chế độ</label>
              <select v-model="timeRange">
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
            </div>

            <div v-if="timeRange === 'month'" class="field">
              <label>Tháng</label>
              <select v-model.number="selectedMonth">
                <option v-for="m in monthOptions" :key="m" :value="m">Tháng {{ m }}</option>
              </select>
            </div>

            <div class="field">
              <label>Năm</label>
              <input v-model.number="selectedYear" type="number" min="1" placeholder="2026" />
            </div>

            <button class="btn" :disabled="loading" @click="applyFilter">
              <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
              <i v-else class="fa-solid fa-filter"></i>
              <span>{{ loading ? "Đang tải..." : "Áp dụng" }}</span>
            </button>
          </div>

          <div class="filter__hint">
            <i class="fa-regular fa-calendar"></i>
            <span>{{ dateText }}</span>
          </div>
        </div>
      </header>

      <!-- Stats -->
      <section class="stats">
        <article v-for="(s, idx) in statCards" :key="s.key" class="stat" :class="`stat--${s.tone}`">
          <div class="stat__top">
            <div class="stat__icon" :class="`bg--${s.tone}`">
              <i :class="s.icon"></i>
            </div>
            <div class="stat__badge" :class="`chip--${s.tone}`">
              <i class="fa-solid fa-sparkles"></i>
              <span>{{ s.badge }}</span>
            </div>
          </div>

          <div class="stat__value">
            <span class="gradient-text" :class="`text--${s.tone}`">{{ s.value }}</span>
          </div>
          <div class="stat__label">{{ s.label }}</div>

          <div class="stat__glow" :class="`glow--${s.tone}`"></div>
        </article>
      </section>

      <!-- Charts (full width) -->
      <section class="card">
        <div class="card__title">
          <span class="card__titleIcon bg--indigo"><i class="fa-solid fa-chart-line"></i></span>
          <div>
            <h3>Xu hướng hợp đồng theo tháng (2026)</h3>
            <p class="muted">So sánh HĐ mới / thành công / thất bại</p>
          </div>
        </div>
        <div class="chartWrap chartWrap--lg">
          <canvas ref="trend1El"></canvas>
        </div>
      </section>

      <section class="card">
        <div class="card__title">
          <span class="card__titleIcon bg--emerald"><i class="fa-solid fa-money-bill-trend-up"></i></span>
          <div>
            <h3>Doanh thu theo tháng (2026)</h3>
            <p class="muted">Tổng doanh thu & doanh thu bán nhanh</p>
          </div>
        </div>
        <div class="chartWrap chartWrap--lg">
          <canvas ref="trend2El"></canvas>
        </div>
      </section>

      <!-- 3 charts row -->
      <section class="grid3">
        <article class="card">
          <div class="card__title">
            <span class="card__titleIcon bg--sky"><i class="fa-solid fa-chart-column"></i></span>
            <div>
              <h3>Trạng thái hợp đồng</h3>
              <p class="muted">Phân bố số lượng theo nhóm</p>
            </div>
          </div>

          <div class="chartWrap chartWrap--md">
            <canvas ref="statusEl"></canvas>
          </div>

          <div class="legend">
            <div v-for="l in statusLegend" :key="l.label" class="legend__item">
              <span class="legend__dot" :style="{ background: l.color }"></span>
              <span>{{ l.label }}</span>
            </div>
          </div>
        </article>

        <article class="card">
          <div class="card__title">
            <span class="card__titleIcon bg--violet"><i class="fa-solid fa-users"></i></span>
            <div>
              <h3>Loại khách hàng</h3>
              <p class="muted">Tỉ trọng theo nhóm</p>
            </div>
          </div>

          <div class="chartWrap chartWrap--md">
            <canvas ref="customerTypeEl"></canvas>
          </div>

          <div class="legend">
            <div v-for="l in customerLegend" :key="l.label" class="legend__item">
              <span class="legend__dot" :style="{ background: l.color }"></span>
              <span>{{ l.label }}</span>
            </div>
          </div>
        </article>

        <article class="card">
          <div class="card__title">
            <span class="card__titleIcon bg--amber"><i class="fa-solid fa-concierge-bell"></i></span>
            <div>
              <h3>Loại dịch vụ</h3>
              <p class="muted">Tỉ trọng theo nhóm</p>
            </div>
          </div>

          <div class="chartWrap chartWrap--md">
            <canvas ref="serviceTypeEl"></canvas>
          </div>

          <div class="legend">
            <div v-for="l in serviceLegend" :key="l.label" class="legend__item">
              <span class="legend__dot" :style="{ background: l.color }"></span>
              <span>{{ l.label }}</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";

/**
 * Lưu ý:
 * - Component này chuyển từ HTML thuần sang Vue SFC.
 * - Yêu cầu FontAwesome đã được load global (như bạn đang làm ở app).
 */

// ===== Colors (pastel + linear gradients) =====
const COLORS = {
  NEW: "#94a3b8",
  DC_TELESALES: "#7c83ff",
  CHAM_SOC: "#60c8ff",
  TN_7NGAY: "#44b7ff",
  TN_14NGAY: "#2ea2ff",
  THAT_BAI: "#ff6b8a",
  KHONG_LIEN_LAC_DUOC: "#ffb86b",
  SAI_SO_LIEU: "#c39bff",
  THANH_CONG: "#55e6a5",
  KHACH_HUY_HEN: "#fbbf24",
  BAN_NHANH: "#34d399",
  BAN_GP: "#2dd4bf",
};

// ===== State =====
const loading = ref(false);
const timeRange = ref("month");
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear());
const startDate = ref("");
const endDate = ref("");

// Stats base (giống file gốc)
const baseStats = {
  totalContracts: 48,
  activeContracts: 32,
  completedContracts: 12,
  cancelledContracts: 4,
  totalRevenue: 1245, // triệu VNĐ
};
const stats = ref({ ...baseStats });

// ===== Helpers =====
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const toISODate = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

const dateText = computed(() => {
  if (!selectedYear.value || selectedYear.value < 1) return "—";
  if (timeRange.value === "month") {
    return `Tháng ${selectedMonth.value}/${selectedYear.value}`;
  }
  return `Năm ${selectedYear.value}`;
});

const statCards = computed(() => [
  {
    key: "totalContracts",
    icon: "fa-solid fa-file-contract",
    label: "Tổng hợp đồng",
    value: stats.value.totalContracts.toLocaleString("vi-VN"),
    tone: "indigo",
    badge: "Tổng quan",
  },
  {
    key: "activeContracts",
    icon: "fa-solid fa-handshake",
    label: "Hợp đồng đang hiệu lực",
    value: stats.value.activeContracts.toLocaleString("vi-VN"),
    tone: "sky",
    badge: "Đang chạy",
  },
  {
    key: "completedContracts",
    icon: "fa-solid fa-circle-check",
    label: "Hợp đồng hoàn tất",
    value: stats.value.completedContracts.toLocaleString("vi-VN"),
    tone: "emerald",
    badge: "Kết quả",
  },
  {
    key: "cancelledContracts",
    icon: "fa-solid fa-circle-xmark",
    label: "Hợp đồng hủy",
    value: stats.value.cancelledContracts.toLocaleString("vi-VN"),
    tone: "rose",
    badge: "Cảnh báo",
  },
  {
    key: "totalRevenue",
    icon: "fa-solid fa-money-bill-wave",
    label: "Tổng doanh thu (triệu VNĐ)",
    value: stats.value.totalRevenue.toLocaleString("vi-VN"),
    tone: "amber",
    badge: "Doanh thu",
  },
]);

const statusLegend = [
  { label: "Thành công", color: COLORS.THANH_CONG },
  { label: "Tiềm năng", color: COLORS.TN_7NGAY },
  { label: "Đang CS", color: COLORS.CHAM_SOC },
  { label: "Thất bại", color: COLORS.THAT_BAI },
  { label: "Không LL", color: COLORS.KHONG_LIEN_LAC_DUOC },
];
const customerLegend = [
  { label: "Mới tiếp nhận", color: COLORS.DC_TELESALES },
  { label: "Đang chăm sóc", color: COLORS.CHAM_SOC },
  { label: "Sai số liệu", color: COLORS.SAI_SO_LIEU },
];
const serviceLegend = [
  { label: "Không liên lạc", color: COLORS.KHONG_LIEN_LAC_DUOC },
  { label: "Bán nhanh", color: COLORS.BAN_NHANH },
  { label: "Đã lên VP", color: COLORS.BAN_GP },
];

// ===== Chart refs =====
const trend1El = ref(null);
const trend2El = ref(null);
const statusEl = ref(null);
const customerTypeEl = ref(null);
const serviceTypeEl = ref(null);

// ===== Chart instances =====
let trendChart1 = null;
let trendChart2 = null;
let statusChart = null;
let customerTypeChart = null;
let serviceTypeChart = null;

// ===== Initial data =====
const monthLabels = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

const trendData1 = {
  labels: monthLabels,
  datasets: [
    {
      label: "Hợp đồng mới",
      data: [8, 12, 9, 14, 18, 16, 20, 18, 15, 12, 10, 13],
      borderColor: COLORS.DC_TELESALES,
      backgroundColor: `${COLORS.DC_TELESALES}22`,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
    {
      label: "Hợp đồng thành công",
      data: [4, 6, 5, 8, 10, 12, 14, 13, 11, 9, 7, 8],
      borderColor: COLORS.THANH_CONG,
      backgroundColor: `${COLORS.THANH_CONG}22`,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
    {
      label: "Hợp đồng thất bại",
      data: [1, 2, 1, 2, 3, 2, 3, 2, 2, 1, 1, 2],
      borderColor: COLORS.THAT_BAI,
      backgroundColor: `${COLORS.THAT_BAI}1F`,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
  ],
};

const trendData2 = {
  labels: monthLabels,
  datasets: [
    {
      label: "Doanh thu (triệu VNĐ)",
      data: [85, 105, 92, 125, 145, 160, 180, 165, 155, 135, 120, 140],
      borderColor: COLORS.BAN_NHANH,
      backgroundColor: `${COLORS.BAN_NHANH}22`,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
    {
      label: "Doanh thu bán nhanh",
      data: [25, 30, 28, 35, 45, 50, 60, 55, 50, 40, 35, 42],
      borderColor: COLORS.BAN_GP,
      backgroundColor: `${COLORS.BAN_GP}22`,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 5,
    },
  ],
};

const statusData = {
  labels: ["Thành công", "Tiềm năng", "Đang CS", "Thất bại", "Không LL"],
  datasets: [
    {
      label: "Số lượng",
      data: [45, 28, 32, 12, 8],
      backgroundColor: [
        COLORS.THANH_CONG,
        COLORS.TN_7NGAY,
        COLORS.CHAM_SOC,
        COLORS.THAT_BAI,
        COLORS.KHONG_LIEN_LAC_DUOC,
      ],
      borderWidth: 0,
      borderRadius: 10,
      barPercentage: 0.55,
      categoryPercentage: 0.7,
    },
  ],
};

const customerTypeData = {
  labels: ["Mới tiếp nhận", "Đang chăm sóc", "Sai số liệu"],
  datasets: [
    {
      data: [40, 35, 25],
      backgroundColor: [COLORS.DC_TELESALES, COLORS.CHAM_SOC, COLORS.SAI_SO_LIEU],
      borderWidth: 0,
      spacing: 4,
    },
  ],
};

const serviceTypeData = {
  labels: ["Không liên lạc", "Bán nhanh", "Đã lên VP"],
  datasets: [
    {
      data: [30, 40, 30],
      backgroundColor: [COLORS.KHONG_LIEN_LAC_DUOC, COLORS.BAN_NHANH, COLORS.BAN_GP],
      borderWidth: 0,
      spacing: 4,
    },
  ],
};

// ===== Build charts =====
function createCharts() {
  const gridColor = "rgba(15, 23, 42, 0.06)";

  trendChart1 = new Chart(trend1El.value.getContext("2d"), {
    type: "line",
    data: structuredClone(trendData1),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { grid: { color: gridColor } },
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          title: { display: true, text: "Số hợp đồng", font: { weight: "700" } },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: { usePointStyle: true, padding: 14, font: { size: 12 } },
        },
        tooltip: { padding: 10, cornerRadius: 10 },
      },
    },
  });

  trendChart2 = new Chart(trend2El.value.getContext("2d"), {
    type: "line",
    data: structuredClone(trendData2),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      scales: {
        x: { grid: { color: gridColor } },
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          title: { display: true, text: "Triệu VNĐ", font: { weight: "700" } },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: { usePointStyle: true, padding: 14, font: { size: 12 } },
        },
        tooltip: { padding: 10, cornerRadius: 10 },
      },
    },
  });

  statusChart = new Chart(statusEl.value.getContext("2d"), {
    type: "bar",
    data: structuredClone(statusData),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: gridColor } },
        x: { grid: { display: false } },
      },
      plugins: { legend: { display: false }, tooltip: { padding: 10, cornerRadius: 10 } },
    },
  });

  customerTypeChart = new Chart(customerTypeEl.value.getContext("2d"), {
    type: "doughnut",
    data: structuredClone(customerTypeData),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: { legend: { display: false }, tooltip: { padding: 10, cornerRadius: 10 } },
    },
  });

  serviceTypeChart = new Chart(serviceTypeEl.value.getContext("2d"), {
    type: "doughnut",
    data: structuredClone(serviceTypeData),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: { legend: { display: false }, tooltip: { padding: 10, cornerRadius: 10 } },
    },
  });
}

function destroyCharts() {
  [trendChart1, trendChart2, statusChart, customerTypeChart, serviceTypeChart].forEach((c) => c?.destroy());
  trendChart1 = trendChart2 = statusChart = customerTypeChart = serviceTypeChart = null;
}

// ===== Filter logic =====
const normalizeYear = () => {
  const safeYear = Math.floor(Number(selectedYear.value) || 0);
  selectedYear.value = safeYear > 0 ? safeYear : 1;
};

const updateDateRange = () => {
  normalizeYear();
  if (timeRange.value === "month") {
    const s = new Date(selectedYear.value, selectedMonth.value - 1, 1);
    const e = new Date(selectedYear.value, selectedMonth.value, 0);
    startDate.value = toISODate(s);
    endDate.value = toISODate(e);
  } else {
    const s = new Date(selectedYear.value, 0, 1);
    const e = new Date(selectedYear.value, 11, 31);
    startDate.value = toISODate(s);
    endDate.value = toISODate(e);
  }
};

watch([timeRange, selectedMonth, selectedYear], updateDateRange, { immediate: true });

function multiplierByRange(r) {
  return r === "month" ? 0.3 : r === "quarter" ? 0.7 : r === "year" ? 1 : 1.2;
}

function generateFilteredLineData(currentDatasets, range) {
  const m = multiplierByRange(range);
  return currentDatasets.map((ds) =>
    ds.data.map((v) => Math.round(v * m + (Math.random() * 10 - 5)))
  );
}

function generateRandomData(count, range) {
  const base = range === "month" ? 10 : range === "quarter" ? 30 : range === "year" ? 100 : 150;
  const arr = [];
  for (let i = 0; i < count; i++) arr.push(Math.round(base + Math.random() * 50 - 25));
  return arr.map((x) => clamp(x, 0, 9999));
}

function updateStatistics(range) {
  const m = multiplierByRange(range);
  stats.value = {
    totalContracts: Math.round(baseStats.totalContracts * m),
    activeContracts: Math.round(baseStats.activeContracts * m),
    completedContracts: Math.round(baseStats.completedContracts * m),
    cancelledContracts: Math.round(baseStats.cancelledContracts * m),
    totalRevenue: Math.round(baseStats.totalRevenue * m),
  };
}

function updateAllCharts(range) {
  // Trend 1
  const newT1 = generateFilteredLineData(trendChart1.data.datasets, range);
  trendChart1.data.datasets.forEach((ds, idx) => (ds.data = newT1[idx]));
  trendChart1.update();

  // Trend 2
  const newT2 = generateFilteredLineData(trendChart2.data.datasets, range);
  trendChart2.data.datasets.forEach((ds, idx) => (ds.data = newT2[idx]));
  trendChart2.update();

  // Bar
  statusChart.data.datasets[0].data = generateRandomData(5, range);
  statusChart.update();

  // Doughnuts
  customerTypeChart.data.datasets[0].data = generateRandomData(3, range);
  customerTypeChart.update();

  serviceTypeChart.data.datasets[0].data = generateRandomData(3, range);
  serviceTypeChart.update();

  // Stats
  updateStatistics(range);
}

async function applyFilter() {
  if (loading.value) return;
  loading.value = true;

  // giả lập API call
  await new Promise((r) => setTimeout(r, 650));

  updateAllCharts(timeRange.value);
  loading.value = false;
}

onMounted(() => {
  createCharts();
  // Đếm số lúc đầu: ở Vue, mình set trực tiếp (nhẹ). Nếu cần animate count như file gốc, mình nâng cấp thêm sau.
  updateStatistics(timeRange.value);
});

onBeforeUnmount(() => {
  destroyCharts();
});
</script>

<style scoped>
h1{
  color: #0e0f4f;
  font-weight: 800;
  z-index: 1;
}

/* ========= Pastel gradient tokens ========= */
.page{
  --bg-0: #f8fafc;
  --bg-1: #ffffff;

  --g-indigo: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
  --g-sky: linear-gradient(135deg, #7dd3fc 0%, #a7f3d0 100%);
  --g-emerald: linear-gradient(135deg, #86efac 0%, #5eead4 100%);
  --g-rose: linear-gradient(135deg, #fda4af 0%, #fbcfe8 100%);
  --g-amber: linear-gradient(135deg, #fde68a 0%, #fdba74 100%);
  --g-violet: linear-gradient(135deg, #c4b5fd 0%, #a5b4fc 100%);

  --text: #0f172a;
  --muted: rgba(15, 23, 42, .62);

  --card: rgba(255,255,255,.78);
  --stroke: rgba(15,23,42,.08);

  --shadow-sm: 0 8px 22px rgba(2, 6, 23, 0.06);
  --shadow-md: 0 18px 42px rgba(2, 6, 23, 0.09);
}

*{ box-sizing: border-box; }

.page{
  min-height: 100vh;
  padding: 18px;
  color: var(--text);
  background:
    radial-gradient(1100px 700px at 10% 8%, rgba(167, 139, 250, .22), transparent 55%),
    radial-gradient(900px 600px at 90% 16%, rgba(125, 211, 252, .22), transparent 55%),
    radial-gradient(1000px 700px at 30% 92%, rgba(134, 239, 172, .18), transparent 55%),
    linear-gradient(180deg, #f8fafc 0%, #eef2ff 55%, #f1f5f9 100%);
}


.muted{ color: var(--muted); }

/* ========= Header ========= */
.header{
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 18px;
  align-items: stretch;
  margin-bottom: 18px;
}

.header__title{
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 18px 18px;
  border-radius: 18px;
  background: var(--g-indigo);
  box-shadow: 0 14px 34px rgba(99, 102, 241, 0.22);
  position: relative;
  overflow: hidden;
}

.header__title::after{
  content:"";
  position: absolute;
  inset: -40%;
  transform: rotate(18deg);
  pointer-events: none;
}

.header__icon{
  width: 54px;
  height: 54px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(255,255,255,.18);
  border: 1px solid rgba(255,255,255,.28);
  backdrop-filter: blur(10px);
  z-index: 1;
}

.header h1{
  font-size: 26px;
  line-height: 1.1;
  margin: 0;
  z-index: 1;
}

.header p{
  margin: 6px 0 0;
  z-index: 1;
  opacity: .9;
}

/* ========= Filter ========= */
.glass{
  background: rgba(255,255,255,.72);
  border: 1px solid var(--stroke);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(14px);
}

.filter{
  border-radius: 18px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.filter__row{
  display: grid;
  grid-template-columns: 1.1fr 140px 140px auto;
  gap: 10px;
  align-items: end;
}
.filter__row--year{
  grid-template-columns: 1.1fr 160px auto;
}

.field label{
  font-size: 12px;
  font-weight: 700;
  color: rgba(15,23,42,.7);
  display: block;
  margin-bottom: 6px;
}

.field input,
.field select{
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.9);
  color: var(--text);
  outline: none;
  transition: box-shadow .2s, border-color .2s, transform .2s;
}

.field input:focus,
.field select:focus{
  border-color: rgba(99,102,241,.35);
  box-shadow: 0 0 0 4px rgba(99,102,241,.12);
}

.btn{
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  border: 0;
  cursor: pointer;
  color: rgba(15,23,42,.92);
  font-weight: 800;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255,255,255,.9), rgba(255,255,255,.72));
  box-shadow: 0 10px 24px rgba(2,6,23,.10);
  transition: transform .15s ease, box-shadow .15s ease, opacity .15s ease;
  border: 1px solid rgba(15,23,42,.10);
}

.btn:hover{ transform: translateY(-1px); box-shadow: 0 14px 30px rgba(2,6,23,.12); }
.btn:disabled{ opacity: .65; cursor: not-allowed; transform: none; }

.filter__hint{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(15,23,42,.62);
  padding-left: 2px;
}

/* ========= Stats ========= */
.stats{
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin: 14px 0 18px;
}

.stat{
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  padding: 16px;
  background: var(--card);
  border: 1px solid var(--stroke);
  box-shadow: var(--shadow-sm);
  transition: transform .18s ease, box-shadow .18s ease;
}

.stat:hover{
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat__top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.stat__icon{
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 12px 26px rgba(2,6,23,.12);
}

.stat__badge{
  font-size: 12px;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.72);
  color: rgba(15,23,42,.75);
}

.stat__value{
  margin-top: 12px;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.stat__label{
  margin-top: 4px;
  font-size: 13px;
  color: rgba(15,23,42,.60);
  font-weight: 600;
}

.stat__glow{
  position: absolute;
  inset: auto -30% -45% -30%;
  height: 120px;
  filter: blur(28px);
  opacity: .75;
  pointer-events: none;
}

/* gradient text by tone */
.gradient-text{
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text--indigo{ background-image: var(--g-indigo); }
.text--sky{ background-image: var(--g-sky); }
.text--emerald{ background-image: var(--g-emerald); }
.text--rose{ background-image: var(--g-rose); }
.text--amber{ background-image: var(--g-amber); }
.text--violet{ background-image: var(--g-violet); }

.bg--indigo{ background: var(--g-indigo); }
.bg--sky{ background: var(--g-sky); }
.bg--emerald{ background: var(--g-emerald); }
.bg--rose{ background: var(--g-rose); }
.bg--amber{ background: var(--g-amber); }
.bg--violet{ background: var(--g-violet); }

.glow--indigo{ background: radial-gradient(circle at 30% 30%, rgba(167, 139, 250,.55), transparent 60%); }
.glow--sky{ background: radial-gradient(circle at 30% 30%, rgba(125, 211, 252,.55), transparent 60%); }
.glow--emerald{ background: radial-gradient(circle at 30% 30%, rgba(134, 239, 172,.55), transparent 60%); }
.glow--rose{ background: radial-gradient(circle at 30% 30%, rgba(253, 164, 175,.60), transparent 60%); }
.glow--amber{ background: radial-gradient(circle at 30% 30%, rgba(253, 230, 138,.60), transparent 60%); }

.chip--indigo{ box-shadow: 0 10px 24px rgba(99,102,241,.12); }
.chip--sky{ box-shadow: 0 10px 24px rgba(14,165,233,.10); }
.chip--emerald{ box-shadow: 0 10px 24px rgba(16,185,129,.10); }
.chip--rose{ box-shadow: 0 10px 24px rgba(244,63,94,.10); }
.chip--amber{ box-shadow: 0 10px 24px rgba(245,158,11,.10); }

/* ========= Cards ========= */
.card{
  border-radius: 18px;
  padding: 16px;
  background: rgba(255,255,255,.78);
  border: 1px solid var(--stroke);
  box-shadow: var(--shadow-sm);
  margin-bottom: 14px;
}

.card__title{
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.card__titleIcon{
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 12px 26px rgba(2,6,23,.12);
  flex: 0 0 auto;
}

.card h3{
  margin: 0;
  font-size: 18px;
  line-height: 1.15;
}

.card p{
  margin: 6px 0 0;
  font-size: 13px;
}

/* ========= Chart wrappers ========= */
.chartWrap{
  width: 100%;
  border-radius: 16px;
  padding: 10px;
  background: rgba(248, 250, 252, .55);
  border: 1px dashed rgba(15,23,42,.08);
}

.chartWrap--lg{ height: 360px; }
.chartWrap--md{ height: 280px; }

/* ========= Legend ========= */
.legend{
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  justify-content: center;
  padding: 10px 0 2px;
}

.legend__item{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: rgba(15,23,42,.62);
  font-weight: 700;
}

.legend__dot{
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

/* ========= 3 columns ========= */
.grid3{
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

/* ========= Footer ========= */
.footer{
  margin-top: 14px;
  border-radius: 18px;
  padding: 14px 16px;
  background: rgba(255,255,255,.72);
  border: 1px solid var(--stroke);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.footer__left{
  display: flex;
  gap: 12px;
  align-items: center;
}

.footer__dot{
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--g-indigo);
  box-shadow: 0 10px 18px rgba(99,102,241,.18);
}

.footer__title{ font-weight: 900; }
.footer__sub{ margin-top: 2px; font-size: 12px; color: rgba(15,23,42,.58); font-weight: 700; }

.footer__right{
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.pill{
  font-size: 12px;
  font-weight: 900;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(255,255,255,.72);
  color: rgba(15,23,42,.75);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* ========= Responsive ========= */
@media (max-width: 1160px){
  .header{ grid-template-columns: 1fr; }
  .filter__row{ grid-template-columns: 1fr 1fr 1fr auto; }
  .stats{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 820px){
  .filter__row{ grid-template-columns: 1fr 1fr; }
  .btn{ width: 100%; grid-column: 1 / -1; }
  .stats{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid3{ grid-template-columns: 1fr; }
  .chartWrap--lg{ height: 320px; }
}

@media (max-width: 520px){
  .page{ padding: 12px; }
  .stats{ grid-template-columns: 1fr; }
  .chartWrap--lg{ height: 300px; }
  .chartWrap--md{ height: 260px; }
  .footer{ flex-direction: column; align-items: flex-start; }
}
</style>
