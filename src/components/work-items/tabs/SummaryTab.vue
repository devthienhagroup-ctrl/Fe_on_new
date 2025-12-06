<template>
  <div class="summary-dashboard container-fluid py-4">
    <!-- HÀNG 1: 3 biểu đồ nhỏ -->
    <div class="row g-4">
      <!-- Task ratio by status -->
      <div class="col-12 col-xl-4">
        <div class="card rounded-4 shadow-sm border-0 h-100">
          <div class="card-body p-4 d-flex flex-column">
            <h6 class="fw-semibold text-center mb-4">Biểu đồ tỉ trọng trạng thái</h6>
            <div class="flex-grow-1">
              <Doughnut
                  v-if="hasPieData"
                  :data="pieChartData"
                  :options="pieChartOptions"
                  :key="pieChartData.labels.join(',')"
              />
              <div v-else class="text-center text-muted py-5">Chưa có dữ liệu để hiển thị</div>
            </div>
          </div>
        </div>
      </div>

      <!-- On-time completion ratio -->
      <div class="col-12 col-xl-4">
        <div class="card rounded-4 shadow-sm border-0 h-100">
          <div class="card-body p-4 d-flex flex-column">
            <h6 class="fw-semibold text-center mb-4">Biểu đồ tỉ trọng công việc theo tiến độ</h6>
            <div class="flex-grow-1 position-relative">
              <Doughnut
                  v-if="hasDoughnutData"
                  :data="doughnutChartData"
                  :options="doughnutChartOptions"
                  :key="doughnutChartData.labels.join(',')"
              />
              <div v-else class="text-center text-muted py-5">Chưa có dữ liệu để hiển thị</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task ratio by type -->
      <div class="col-12 col-xl-4">
        <div class="card rounded-4 shadow-sm border-0 h-100">
          <div class="card-body p-4 d-flex flex-column">
            <h6 class="fw-semibold text-center mb-4">Tỉ trọng công việc theo loại</h6>
            <div class="flex-grow-1">
              <Bar
                  v-if="horizontalBarData"
                  :data="horizontalBarData"
                  :options="horizontalBarOptions"
                  :key="horizontalBarData.labels.join(',')"
              />
              <div v-else class="text-center text-muted py-5">Chưa có dữ liệu để hiển thị</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- HÀNG 2: Biểu đồ tiến độ dự án -->
    <div class="row g-4 mt-2">
      <div class="col-12">
        <div class="card rounded-4 shadow-sm border-0 h-100">
          <div class="card-body p-4 d-flex flex-column" style="min-height: 750px">
            <h6 class="fw-semibold text-center mb-4">Tiến độ dự án</h6>
            <div class="flex-grow-1">
              <Line
                  v-if="hasLineData"
                  :data="lineChartData"
                  :options="lineChartOptions"
                  :key="lineChartData.labels.join(',')"
              />
              <div v-else class="text-center text-muted py-5">Chưa có dữ liệu tiến độ</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- HÀNG 3: Biểu đồ đóng góp cá nhân -->
    <div class="row g-4 mt-2">
      <div class="col-12">
        <div class="card rounded-4 shadow-sm border-0 h-100">
          <div class="card-body p-4 d-flex flex-column">
            <h6 class="fw-semibold text-center mb-4">Đóng góp cá nhân</h6>
            <div class="flex-grow-1" style="min-height: 650px">
              <Bar v-if="mixedChartData"
                   :data="mixedChartData"
                   :options="mixedChartOptions"
                   :key="mixedChartData.labels.join(',')"/>
              <div v-else class="text-center text-muted py-5">Chưa có dữ liệu đóng góp cá nhân</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie, Doughnut, Bar, Line } from 'vue-chartjs';
import { reactive, onMounted, computed, watch } from "vue";
import api from "../../../api/api.js";
const route = useRoute();
import { eventMatchesProject, isWorkItemEvent, isCommentEvent, isProjectMetaEvent } from "../../../utils/socketEventUtils.js";

// 🔧 Custom Plugins
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    const { ctx, chartArea, config } = chart;
    if (!chartArea) return;
    const text = config.options.plugins.centerText?.text;
    if (!text) return;

    ctx.save();
    const fontSize = Math.min(chartArea.width / 12, 18);
    ctx.font = `600 ${fontSize}px "Inter", "Helvetica", "Arial", sans-serif`;
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, (chartArea.left + chartArea.right) / 2, (chartArea.top + chartArea.bottom) / 2);
    ctx.restore();
  }
};


ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    centerTextPlugin
);

import ChartDataLabels from 'chartjs-plugin-datalabels';
import {useRoute} from "vue-router";
ChartJS.register(ChartDataLabels);


// 🎯 Reactive Pie Chart

const DOUGHNUT_BASE_COLORS = ['#5697dc', '#64c8d7', '#74e1c0', '#83bb6d'];
const PIE_BASE_COLORS = [ '#80cc77','#d4e4f893baf4', '#e0946b', '#6cc566'];

const pieChartData = reactive({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: PIE_BASE_COLORS.map(color => brightenColor(color, 1.12)),
      borderWidth: 0
    }
  ]
});

const hasPieData = computed(() => {
  const d = pieChartData.datasets[0].data;
  return Array.isArray(d) && d.length > 0 && d.some(v => v > 0);
});

const hasDoughnutData = computed(() => {
  const d = doughnutChartData.datasets[0].data;
  return Array.isArray(d) && d.length > 0 && d.some(v => v > 0);
});

const pieChartOptions = {
  cutout: '70%', // 🟢 thêm khoảng trống giữa để thành dạng Doughnut
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: 20 },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1400,
    easing: 'easeOutQuart'
  },
  animations: {
    circumference: {
      from: 0,
      duration: 1600,
      easing: 'easeOutQuart',
      delay: (ctx) => ctx.dataIndex * 110
    },
    outerRadius: {
      duration: 900,
      easing: 'easeOutBack',
      delay: (ctx) => ctx.dataIndex * 90
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: { usePointStyle: true, boxWidth: 10 }
    },
    tooltip: {
      callbacks: {
        label(context) {
          const dataset = context.dataset;
          const total = dataset.data.reduce((a, b) => a + b, 0);
          const value = context.parsed;
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${percentage}% (${value})`;
        }
      }
    },
    dynamicArcThickness: {
      minFactor: 0.92,
      maxFactor: 1.12
    },
    datalabels: {
      color: '#2c2c2c',
      font: {
        weight: '500',
        size: 12
      },
      formatter: (value, context) => {
        const dataset = context.chart.data.datasets[0];
        const total = dataset.data.reduce((a, b) => a + b, 0);
        if (!total || value === 0) return '';
        const percentage = ((value / total) * 100).toFixed(1);
        return `${percentage}%`;
      },
      // ✅ Đặt phần trăm vào giữa lát bánh (thích hợp Doughnut)
      anchor: 'center',
      align: 'center',
      offset: 0,
      clip: false
    }
  }
};


// 🧩 Hàm chuyển HEX (#rrggbb) sang RGBA
function hexToRgba(hex, alpha = 1) {
  // Xử lý các mã màu kiểu #fff hoặc #ffffff
  const cleaned = hex.replace('#', '');
  const fullHex = cleaned.length === 3
      ? cleaned.split('').map(c => c + c).join('')
      : cleaned;
  const bigint = parseInt(fullHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


function brightenColor(hex, factor = 1.15) {
  const cleaned = hex.replace('#', '');
  const fullHex = cleaned.length === 3
      ? cleaned.split('').map((c) => c + c).join('')
      : cleaned;

  const bigint = parseInt(fullHex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  const [h, s, l] = rgbToHsl(r, g, b);
  const boostedLightness = Math.min(1, l * factor);
  const boostedSaturation = Math.min(1, s * (1 + (factor - 1) * 0.75));
  const [nr, ng, nb] = hslToRgb(h, boostedSaturation, boostedLightness);

  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`.toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = 0;
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return [h, s, l];
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const val = Math.round(l * 255);
    return [val, val, val];
  }

  const hue2rgb = (p, q, t) => {
    let temp = t;
    if (temp < 0) temp += 1;
    if (temp > 1) temp -= 1;
    if (temp < 1 / 6) return p + (q - p) * 6 * temp;
    if (temp < 1 / 2) return q;
    if (temp < 2 / 3) return p + (q - p) * (2 / 3 - temp) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}



// 🌐 Fetch Dashboard Data
const props = defineProps({
  projectId: {
    type: Number,
    default: null,
  },
  socketEvent: {
    type: Object,
    default: null,
  },
});

const effectiveProjectId = computed(() => props.projectId ?? Number(route.params.projectId) ?? null);

async function fetchDashboardData() {
  try {
    if (!effectiveProjectId.value) return;
    const res = await api.get(`/admin.thg/project/summary/${effectiveProjectId.value}`);
    console.log("✅ API result:", res.data);

    if (res.data && res.data.dashboardStatus) {
      pieChartData.labels = res.data.dashboardStatus.map(item => item.label);
      pieChartData.datasets[0].data = res.data.dashboardStatus.map(item => item.value);
      const total = pieChartData.datasets[0].data.reduce((a, b) => a + b, 0);

      // 🔹 Gán text vào trung tâm (nếu bạn có plugin centerText)
      pieChartOptions.plugins.centerText = {
        text: `Tổng: ${total}`,
      };
    }

    if (res.data?.dashboardProgress) {
      doughnutChartData.labels = res.data.dashboardProgress.map(i => i.label);
      doughnutChartData.datasets[0].data = res.data.dashboardProgress.map(i => i.value);
    }

    if (res.data?.horizontalBarData) {
      const items = res.data.horizontalBarData;

      horizontalBarData.labels = items.map(i => i.labelName);
      horizontalBarData.datasets[0].data = items.map(i => i.value);

      // 🔵 Làm dịu màu theo pastel lạnh sáng
      horizontalBarData.datasets[0].backgroundColor = items.map(i => toPastelCool(brightenColor(i.iconColor, 1.1), 0.82));

      // Icon và màu gốc
      horizontalBarData.icons = items.map(i => i.iconName);
      horizontalBarData.colors = items.map(i => i.iconColor);
    }


    if (res.data?.lineChartData) {
      const chart = res.data.lineChartData;

      // ⚙️ Gán nhãn trục X
      lineChartData.labels = chart.labels;

      // ⚙️ Gán dữ liệu 2 đường
      lineChartData.datasets[0].data = chart.datasets.idealProgress || [];
      lineChartData.datasets[1].data = chart.datasets.actualProgress || [];
    }

    if (res.data?.mixedChartData) {
      const items = res.data.mixedChartData;
      mixedChartData.labels = items.map(i => i.fullName);
      mixedChartData.datasets[0].data = items.map(i => i.totalEffort ?? 0);
      mixedChartData.datasets[1].data = items.map(i => i.totalWorkItem ?? 0);
    }




    console.log("🟢 doughnut labels:", doughnutChartData.labels);
    console.log("🟢 doughnut data:", doughnutChartData.datasets[0].data);
    const total = doughnutChartData.datasets[0].data.reduce((a, b) => a + b, 0);
    doughnutChartOptions.plugins.centerText.text = `Tổng: ${total}`;





  } catch (error) {
    console.error("❌ Lỗi load chart:", error);
  }
}

onMounted(fetchDashboardData);

watch(
    () => props.socketEvent,
    (event) => {
      if (!event) return;
      if (!eventMatchesProject(event, effectiveProjectId.value)) return;
      if (isWorkItemEvent(event) || isCommentEvent(event) || isProjectMetaEvent(event)) {
        fetchDashboardData();
      }
    }
);

defineExpose({
  fetchDashboardData,
});

function toPastelCool(hex, opacity = 0.8) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  // 🌈 Làm sáng nhẹ (đưa màu về pastel)
  r = Math.min(255, Math.round((r + 240) / 2));
  g = Math.min(255, Math.round((g + 245) / 2));
  b = Math.min(255, Math.round((b + 255) / 2));

  // ❄️ Dịch chuyển tone lạnh (tăng lam, giảm đỏ)
  const coolFactor = 0.15; // 0.1–0.2 là đẹp
  r = Math.round(r * (1 - coolFactor));
  b = Math.min(255, Math.round(b + 30)); // thêm lam nhạt

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}




// 🟦 Doughnut Chart
const doughnutChartData = reactive({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: DOUGHNUT_BASE_COLORS.map(color => brightenColor(color, 1.12)),
      borderWidth: 0
    }
  ]
});

const doughnutChartOptions = {
  cutout: '70%',
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: 20 },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1400,
    easing: 'easeOutQuart'
  },
  animations: {
    circumference: {
      from: 0,
      duration: 1600,
      easing: 'easeOutQuart',
      delay: (ctx) => ctx.dataIndex * 120
    },
    outerRadius: {
      duration: 900,
      easing: 'easeOutBack',
      delay: (ctx) => ctx.dataIndex * 100
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        boxWidth: 10
      }
    },
    // 🧠 Tooltip: hiển thị số lượng thực tế khi hover
    tooltip: {
      callbacks: {
        label(context) {
          const dataset = context.dataset;
          const total = dataset.data.reduce((a, b) => a + b, 0);
          const value = context.parsed;
          const percentage = ((value / total) * 100).toFixed(1);
          // 🟡 Hiện phần trăm và số lượng
          return `${context.label}: ${percentage}% (${value})`;
        }
      }
    },
    // 🟢 Hiển thị phần trăm trực tiếp trên lát bánh
    datalabels: {
      color: '#2c2c2c',
      font: {
        weight: '500',
        size: 12
      },
      formatter: (value, context) => {
        const dataset = context.chart.data.datasets[0];
        const total = dataset.data.reduce((a, b) => a + b, 0);
        if (!total || value === 0) return '';
        const percentage = ((value / total) * 100).toFixed(1);
        return `${percentage}%`;
      },
      // ✅ Đưa phần trăm vào trong lát
      anchor: 'center',
      align: 'center',
      offset: 0,    // không đẩy ra ngoài
      clip: false
    },
    // 🧩 Giữ trung tâm (nếu bạn có text tổng số task)
    centerText: {
      text: '' // 🟢 khởi tạo rỗng, sẽ gán sau khi API trả về
    },
    dynamicArcThickness: {
      minFactor: 0.92,
      maxFactor: 1.13
    }

  }
};

const horizontalBarData = reactive({
  labels: [],
  datasets: [
    {
      label: 'Công việc theo loại',
      data: [],
      backgroundColor: [],
      borderWidth: 0,
      borderRadius: 8
    }
  ]
});

const horizontalBarOptions = reactive({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1200,
    easing: 'easeOutCubic'
  },
  animations: {
    x: {
      from: 0,
      duration: 1200,
      easing: 'easeOutCubic',
      delay: (ctx) => ctx.dataIndex * 90
    },
    y: {
      duration: 600,
      easing: 'easeOutQuart'
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label(context) {
          const dataset = context.dataset;
          const total = dataset.data.reduce((a, b) => a + b, 0);
          const value = context.parsed.x;
          const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
          return `${context.label}: ${percentage}% (${value})`;
        }
      }
    },
    datalabels: {
      display: (context) => context.datasetIndex === 0,
      color: '#282828',
      font: { weight: 500, size: 12 },
      formatter: (value, context) => {
        const dataset = context.chart.data.datasets[0];
        const total = dataset.data.reduce((a, b) => a + b, 0);
        const percent = total ? ((value / total) * 100).toFixed(1) : 0;
        return percent >= 2 ? `${percent}%` : '';
      },
      anchor: 'center',
      align: 'center',
      clip: true
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { display: false },
      ticks: { color: '#666', font: { weight: '500' } }
    },
    y: {
      // 🔹 Hai dòng này giúp cột mảnh hơn rõ rệt
      categoryPercentage: 0.5, // giảm độ cao của “slot” mỗi thanh
      barPercentage: 0.5,      // giảm độ dày thực tế thanh trong slot
      ticks: { color: '#444', font: { weight: '600' } },
      grid: { drawBorder: false }
    }
  },
  elements: {
    bar: {
      borderRadius: { topRight: 8, bottomRight: 8, topLeft: 0, bottomLeft: 0 },
      borderSkipped: 'start'
    }
  }
});


// 🟥 Line Chart
// 🟦 Line Chart reactive
const lineChartData = reactive({
  labels: [],
  datasets: [
    {
      label: 'Tiến độ lý tưởng',
      data: [],
      borderColor: '#93c5fd',
      backgroundColor: 'rgba(147, 197, 253, 0.25)',
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 2,
      pointBackgroundColor: '#93c5fd'
    },
    {
      label: 'Tiến độ thực tế',
      data: [],
      borderColor: '#fda4af',
      backgroundColor: 'rgba(253, 164, 175, 0.35)',
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 2,
      pointBackgroundColor: '#fda4af'
    }
  ]
});

const hasLineData = computed(() => {
  return lineChartData.labels.length > 0;
});

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1400,
    easing: 'easeOutQuart'
  },
  animations: {
    y: {
      from: 0,
      duration: 1400,
      easing: 'easeOutQuart',
      delay: (ctx) => ctx.datasetIndex * 180 + ctx.dataIndex * 40
    },
    tension: {
      duration: 800,
      easing: 'easeOutQuad'
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: { usePointStyle: true, boxWidth: 10 }
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}%`
      }
    },
    datalabels: {
      display: true,
      color: (ctx) => ctx.dataset.label === 'Tiến độ lý tưởng' ? '#3b82f6' : '#f43f5e',
      font: {
        weight: '600',
        size: 12
      },
      align: 'end',
      anchor: 'end',
      // ⚙️ offset lệch nhau theo dataset
      offset: (ctx) => ctx.dataset.label === 'Tiến độ lý tưởng' ? 12 : 4,
      formatter: (value) => `${value.toFixed(1)}%`
    }
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      grid: { color: '#eef2ff' },
      beginAtZero: true,
      max: 100,
      title: { display: true, text: 'Progress (%)' },
      ticks: {
        stepSize: 20,
        font: { size: 13, weight: '600' }
      }
    }
  }
};



// 🟧 Mixed Chart
const mixedChartData = reactive({
  labels: [],
  datasets: [
    {
      type: 'bar',
      label: 'Tổng điểm effort',
      data: [],
      backgroundColor: 'rgba(147, 197, 253, 0.6)',
      borderColor: '#93c5fd',
      borderWidth: 1,
      borderRadius: 8
    },
    {
      type: 'line',
      label: 'Tổng số công việc',
      data: [],
      borderColor: '#4ade80',
      backgroundColor: '#4ade80',
      borderWidth: 3,
      tension: 0.3,
      pointBackgroundColor: '#4ade80',
      pointRadius: 4,
      yAxisID: 'y1'
    }
  ]
});


const mixedChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1300,
    easing: 'easeOutQuart'
  },
  animations: {
    y: {
      from: 0,
      duration: 1300,
      easing: 'easeOutCubic',
      delay: (ctx) => ctx.type === 'data' && ctx.dataset.type === 'bar' ? ctx.dataIndex * 80 : ctx.dataIndex * 50
    }
  },
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 10 } }
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      type: 'linear',
      position: 'left',
      grid: { color: '#eef2ff' },
      title: { display: true, text: 'Effort' }
    },
    y1: {
      type: 'linear',
      position: 'right',
      grid: { drawOnChartArea: false },
      beginAtZero: true,
      title: { display: true, text: 'Tasks' }
    }
  }
};
</script>

<style scoped>
.summary-dashboard {
  background-color: #f8fafc;
}
.card {
  background-color: #ffffff;
  min-height: 320px;
}
.card-body {
  display: flex;
  flex-direction: column;
}
.card-body > div {
  min-height: 240px;
}
@media (max-width: 991.98px) {
  .card {
    min-height: 280px;
  }
  .card-body > div {
    min-height: 220px;
  }
}


</style>
