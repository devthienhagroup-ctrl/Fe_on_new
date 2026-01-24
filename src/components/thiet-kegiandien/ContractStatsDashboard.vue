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
          <div class="filter__row" :style="filterGridStyle">
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

            <div v-if="canFullBranch" class="field">
              <label>Chi nhánh</label>
              <select v-model="selectedBranch" :disabled="branchLoading">
                <option v-for="branch in branchFilterOptions" :key="branch.id ?? 'all'" :value="branch.id">
                  {{ branch.label }}
                </option>
              </select>
            </div>
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
            <h3>{{ revenueTitle }}</h3>
            <p class="muted">{{ revenueSubtitle }}</p>
          </div>
          <div class="card__actions">
            <div class="field field--compact">
              <label>Dịch vụ</label>
              <select v-model="selectedService">
                <option v-for="service in serviceOptions" :key="service.id" :value="service.id">
                  {{ service.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="chartWrap chartWrap--lg">
          <canvas ref="trend2El"></canvas>
        </div>
      </section>

      <section class="card">
        <div class="card__title">
          <span class="card__titleIcon bg--violet"><i class="fa-solid fa-chart-line"></i></span>
          <div>
            <h3>{{ salesTitle }}</h3>
            <p class="muted">{{ salesSubtitle }}</p>
          </div>
        </div>
        <div class="chartWrap chartWrap--lg">
          <canvas ref="trend3El"></canvas>
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

          <div class="chartWrap chartWrap--md chartWrap--donut">
            <canvas ref="customerTypeEl"></canvas>
            <div class="chartTotal">
              <span class="chartTotal__label">Tổng số</span>
              <strong>{{ customerTotal.toLocaleString("vi-VN") }}</strong>
            </div>
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

          <div class="chartWrap chartWrap--md chartWrap--donut">
            <canvas ref="serviceTypeEl"></canvas>
            <div class="chartTotal">
              <span class="chartTotal__label">Tổng số</span>
              <strong>{{ serviceTotal.toLocaleString("vi-VN") }}</strong>
            </div>
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
import api from "../../api/api.js";
import { useAuthStore } from "../../stores/authStore";

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
const authStore = useAuthStore();
const timeRange = ref("month");
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear());
const selectedService = ref("all");
const selectedBranch = ref(null);
const chartsReady = ref(false);
const startDate = ref("");
const endDate = ref("");
const services = ref([]);
const branchOptions = ref([]);
const branchLoading = ref(false);
const statusLegend = ref([]);
const customerLegend = ref([]);
const serviceLegend = ref([]);
const customerTotal = ref(0);
const serviceTotal = ref(0);
const canFullBranch = computed(() => authStore.hasPermission("HOPDONG_FULL_CHINHANH"));

// Stats base (giống file gốc)
const stats = ref({
  totalContracts: 0,
  activeContracts: 0,
  completedContracts: 0,
  cancelledContracts: 0,
  totalRevenue: 0,
  totalSales: 0,
});

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

const formatCompactVnd = (value) => {
  const raw = Number(value || 0);
  const abs = Math.abs(raw);
  if (abs >= 1_000_000_000) {
    const amount = raw / 1_000_000_000;
    const formatted = amount.toLocaleString("vi-VN", {
      minimumFractionDigits: abs > 0 && abs < 1_000_000_000 ? 1 : 0,
      maximumFractionDigits: 1,
    });
    return `${formatted} tỷ`;
  }
  const amount = raw / 1_000_000;
  const formatted = amount.toLocaleString("vi-VN", {
    minimumFractionDigits: abs > 0 && abs < 1_000_000 ? 1 : 0,
    maximumFractionDigits: 1,
  });
  return `${formatted} triệu`;
};

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
    label: "Tổng doanh thu",
    value: formatCompactVnd(stats.value.totalRevenue),
    tone: "amber",
    badge: "Doanh thu",
  },
  {
    key: "totalSales",
    icon: "fa-solid fa-chart-line",
    label: "Tổng doanh số",
    value: formatCompactVnd(stats.value.totalSales),
    tone: "violet",
    badge: "Doanh số",
  },
]);

const serviceOptions = computed(() => [
  { id: "all", name: "Tất cả dịch vụ" },
  ...services.value.map((service) => ({ id: service.id, name: service.name })),
]);

const branchFilterOptions = computed(() => [
  { id: null, label: "Tất cả" },
  ...branchOptions.value,
]);

const filterGridStyle = computed(() => {
  const columns = ["1.1fr"];
  if (timeRange.value === "month") {
    columns.push("140px");
  }
  columns.push("140px");
  if (canFullBranch.value) {
    columns.push("180px");
  }
  return { gridTemplateColumns: columns.join(" ") };
});

const revenueTitle = computed(() => {
  const selected = serviceOptions.value.find((option) => option.id === selectedService.value);
  const suffix = timeRange.value === "month" ? "theo tháng" : "theo năm";
  return `Doanh thu ${suffix} (${selected?.name || "Tất cả dịch vụ"})`;
});

const revenueSubtitle = computed(() => {
  if (selectedService.value === "all") return "Phân loại theo dịch vụ";
  return "Phân loại theo phân khúc dịch vụ";
});

const salesTitle = computed(() => {
  const selected = serviceOptions.value.find((option) => option.id === selectedService.value);
  const suffix = timeRange.value === "month" ? "theo tháng" : "theo năm";
  return `Doanh số ${suffix} (${selected?.name || "Tất cả dịch vụ"})`;
});

const salesSubtitle = computed(() => {
  if (selectedService.value === "all") return "Phân loại theo dịch vụ";
  return "Phân loại theo phân khúc dịch vụ";
});

// ===== Chart refs =====
const trend1El = ref(null);
const trend2El = ref(null);
const trend3El = ref(null);
const statusEl = ref(null);
const customerTypeEl = ref(null);
const serviceTypeEl = ref(null);

// ===== Chart instances =====
let trendChart1 = null;
let trendChart2 = null;
let trendChart3 = null;
let statusChart = null;
let customerTypeChart = null;
let serviceTypeChart = null;

// ===== Initial data =====
const monthLabels = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

const revenuePalette = [
  COLORS.BAN_NHANH,
  COLORS.BAN_GP,
  COLORS.DC_TELESALES,
  COLORS.CHAM_SOC,
  COLORS.TN_7NGAY,
  COLORS.TN_14NGAY,
  COLORS.SAI_SO_LIEU,
  COLORS.THANH_CONG,
];

const emptyLineData = {
  labels: monthLabels,
  datasets: [],
};

const statusData = {
  labels: [],
  datasets: [
    {
      label: "Số lượng",
      data: [],
      backgroundColor: [],
      borderWidth: 0,
      borderRadius: 10,
      barPercentage: 0.55,
      categoryPercentage: 0.7,
    },
  ],
};

const customerTypeData = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
      borderWidth: 0,
      spacing: 4,
    },
  ],
};

const serviceTypeData = {
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [],
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
    data: structuredClone(emptyLineData),
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
    data: structuredClone(emptyLineData),
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

  trendChart3 = new Chart(trend3El.value.getContext("2d"), {
    type: "line",
    data: structuredClone(emptyLineData),
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
  [trendChart1, trendChart2, trendChart3, statusChart, customerTypeChart, serviceTypeChart].forEach((c) =>
    c?.destroy()
  );
  trendChart1 = trendChart2 = trendChart3 = statusChart = customerTypeChart = serviceTypeChart = null;
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

watch(
  [timeRange, selectedMonth, selectedYear, selectedService, selectedBranch, chartsReady],
  ([, , , , , ready]) => {
    if (!ready) return;
    fetchStats();
  },
  { immediate: true }
);

watch(
  services,
  (nextServices) => {
    if (selectedService.value === "all") return;
    const exists = nextServices.some(
      (service) => String(service.id) === String(selectedService.value)
    );
    if (!exists) {
      selectedService.value = "all";
    }
  },
  { deep: true }
);

watch(
  branchOptions,
  (nextBranches) => {
    if (!canFullBranch.value) return;
    if (selectedBranch.value === null) return;
    const exists = nextBranches.some(
      (branch) => String(branch.id) === String(selectedBranch.value)
    );
    if (!exists) {
      selectedBranch.value = null;
    }
  },
  { deep: true }
);


const normalizeSeries = (series) =>
  Array.isArray(series)
    ? series.map((item, index) => ({
        label: item?.label || `Dòng ${index + 1}`,
        data: Array.isArray(item?.data) ? item.data : [],
      }))
    : [];

const buildLineDatasets = (series) =>
  normalizeSeries(series).map((item, index) => ({
    label: item.label,
    data: item.data,
    borderColor: revenuePalette[index % revenuePalette.length],
    backgroundColor: `${revenuePalette[index % revenuePalette.length]}22`,
    borderWidth: 3,
    fill: true,
    tension: 0.4,
    pointRadius: 2,
    pointHoverRadius: 5,
  }));

const buildLegend = (items, palette) =>
  items.map((item, index) => ({
    label: item?.label || `Nhóm ${index + 1}`,
    color: palette[index % palette.length],
  }));

const updateBarChart = (chart, labels, values, palette) => {
  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  chart.data.datasets[0].backgroundColor = labels.map(
    (_, index) => palette[index % palette.length]
  );
  chart.update();
};

const updateDoughnutChart = (chart, labels, values, palette) => {
  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  chart.data.datasets[0].backgroundColor = labels.map(
    (_, index) => palette[index % palette.length]
  );
  chart.update();
};

const updateLineChart = (chart, labels, series) => {
  chart.data.labels = labels;
  chart.data.datasets = buildLineDatasets(series);
  chart.update();
};

const updateChartsFromResponse = (payload) => {
  const labels = Array.isArray(payload?.labels) && payload.labels.length ? payload.labels : monthLabels;

  updateLineChart(trendChart1, labels, payload?.hopDongTrend || []);
  updateLineChart(trendChart2, labels, payload?.doanhThuTrend || []);
  updateLineChart(trendChart3, labels, payload?.doanhSoTrend || []);

  const statusItems = Array.isArray(payload?.trangThaiHopDong) ? payload.trangThaiHopDong : [];
  const statusLabels = statusItems.map((item) => item?.label || "");
  const statusValues = statusItems.map((item) => clamp(Number(item?.value) || 0, 0, 999999));
  updateBarChart(statusChart, statusLabels, statusValues, [
    COLORS.THANH_CONG,
    COLORS.TN_7NGAY,
    COLORS.CHAM_SOC,
    COLORS.THAT_BAI,
    COLORS.KHONG_LIEN_LAC_DUOC,
  ]);
  statusLegend.value = buildLegend(statusItems, [
    COLORS.THANH_CONG,
    COLORS.TN_7NGAY,
    COLORS.CHAM_SOC,
    COLORS.THAT_BAI,
    COLORS.KHONG_LIEN_LAC_DUOC,
  ]);

  const customerItems = Array.isArray(payload?.loaiKhachHang) ? payload.loaiKhachHang : [];
  const customerLabels = customerItems.map((item) => item?.label || "");
  const customerValues = customerItems.map((item) => clamp(Number(item?.value) || 0, 0, 999999));
  customerTotal.value = customerValues.reduce((sum, value) => sum + value, 0);
  updateDoughnutChart(customerTypeChart, customerLabels, customerValues, [
    COLORS.DC_TELESALES,
    COLORS.CHAM_SOC,
    COLORS.SAI_SO_LIEU,
    COLORS.NEW,
  ]);
  customerLegend.value = buildLegend(customerItems, [
    COLORS.DC_TELESALES,
    COLORS.CHAM_SOC,
    COLORS.SAI_SO_LIEU,
    COLORS.NEW,
  ]);

  const serviceItems = Array.isArray(payload?.loaiDichVu) ? payload.loaiDichVu : [];
  const serviceLabels = serviceItems.map((item) => item?.label || "");
  const serviceValues = serviceItems.map((item) => clamp(Number(item?.value) || 0, 0, 999999));
  serviceTotal.value = serviceValues.reduce((sum, value) => sum + value, 0);
  updateDoughnutChart(serviceTypeChart, serviceLabels, serviceValues, [
    COLORS.KHONG_LIEN_LAC_DUOC,
    COLORS.BAN_NHANH,
    COLORS.BAN_GP,
    COLORS.NEW,
  ]);
  serviceLegend.value = buildLegend(serviceItems, [
    COLORS.KHONG_LIEN_LAC_DUOC,
    COLORS.BAN_NHANH,
    COLORS.BAN_GP,
    COLORS.NEW,
  ]);
};

const buildRequestParams = () => ({
  nam: selectedYear.value,
  thang: timeRange.value === "month" ? selectedMonth.value : null,
  theo: timeRange.value,
  tuNgay: startDate.value,
  denNgay: endDate.value,
  dichVu: selectedService.value === "all" ? "all" : selectedService.value,
  branchId: canFullBranch.value ? selectedBranch.value : null,
});

async function fetchStats() {
  if (loading.value) return;
  loading.value = true;

  try {
    const res = await api.get("/hop-dong/admin/thong-ke", {
      params: buildRequestParams(),
    });
    const payload = res?.data || {};
    stats.value = {
      totalContracts: Number(payload?.summary?.totalContracts) || 0,
      activeContracts: Number(payload?.summary?.activeContracts) || 0,
      completedContracts: Number(payload?.summary?.completedContracts) || 0,
      cancelledContracts: Number(payload?.summary?.cancelledContracts) || 0,
      totalRevenue: Number(payload?.summary?.totalRevenue) || 0,
      totalSales: Number(payload?.summary?.totalSales) || 0,
    };
    updateChartsFromResponse(payload);
  } catch (error) {
    console.error("Không thể tải thống kê hợp đồng", error);
  } finally {
    loading.value = false;
  }
}

const fetchServices = async () => {
  try {
    const res = await api.get("/dich-vu-thg/admin", {
      params: {
        keyword: null,
      },
    });
    services.value = Array.isArray(res?.data) ? res.data : [];
  } catch (error) {
    console.error("Không thể tải danh sách dịch vụ", error);
    services.value = [];
  }
};

const fetchBranchOptions = async () => {
  if (branchLoading.value) return;
  branchLoading.value = true;
  try {
    const res = await api.get("/customer-crm/admin/lich-hen/options");
    branchOptions.value = (Array.isArray(res?.data) ? res.data : []).map((branch) => ({
      id: Number(branch.id),
      label: branch.address,
    }));
  } catch (error) {
    console.error("Không thể tải danh sách chi nhánh", error);
    branchOptions.value = [];
  } finally {
    branchLoading.value = false;
  }
};

watch(
  canFullBranch,
  (value) => {
    if (value) {
      fetchBranchOptions();
      return;
    }
    selectedBranch.value = null;
  },
  { immediate: true }
);

onMounted(async () => {
  createCharts();
  await fetchServices();
  chartsReady.value = true;
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
  grid-template-columns: 0.9fr 1.3fr;
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
  grid-template-columns: 1.1fr 140px 140px;
  gap: 10px;
  align-items: end;
}
.filter__row--year{
  grid-template-columns: 1.1fr 160px;
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

.card__actions{
  margin-left: auto;
  display: flex;
  align-items: center;
}

.field--compact label{
  margin-bottom: 4px;
}

.field--compact select{
  min-width: 180px;
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
  position: relative;
}

.chartWrap--lg{ height: 360px; }
.chartWrap--md{ height: 280px; }
.chartWrap--donut{
  height: 230px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chartWrap--donut canvas{
  max-width: 210px;
  max-height: 210px;
}

.chartTotal{
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 800;
  color: #0f172a;
  pointer-events: none;
  gap: 4px;
}

.chartTotal__label{
  font-size: 12px;
  font-weight: 700;
  color: rgba(15,23,42,.6);
}

.chartTotal strong{
  font-size: 26px;
  line-height: 1.1;
}

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
  .filter__row{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .stats{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 820px){
  .filter__row{ grid-template-columns: 1fr 1fr; }
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
