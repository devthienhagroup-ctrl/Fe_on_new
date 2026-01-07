<template>
  <div id="refined-dashboard" class="refined-dashboard">
    <!-- Compact Header -->
    <div class="dashboard-header">
      <div class="container">
        <div class="header-content">
          <div class="d-flex align-items-center gap-3">
            <div class="brand-icon">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
            <div>
              <h1 class="dashboard-title">Bảng điều khiển Marketing</h1>
              <p class="dashboard-subtitle">Nhập liệu & phân tích theo thời gian thực</p>
            </div>
          </div>
          <div class="header-actions">
            <button @click="generateSampleData" class="btn btn-sm btn-outline">
              <i class="fas fa-sparkles"></i> Dữ liệu mẫu
            </button>
            <button @click="exportData" class="btn btn-sm btn-primary">
              <i class="fas fa-download"></i> Xuất dữ liệu
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container main-content">
      <div class="row g-4">
        <!-- Left: Compact Form -->
        <div class="col-lg-5">
          <div class="form-panel">
            <div class="panel-header">
              <h3>
                <span class="icon-label" style="background: linear-gradient(135deg, #FF6B6B, #FF8E53);">
                  <i class="fas fa-user-edit"></i>
                </span>
                Nhập khách hàng
              </h3>
              <span class="badge">Mới</span>
            </div>

            <form @submit.prevent="submitData" class="compact-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Họ tên *</label>
                  <div class="input-icon">
                    <span class="icon-chip" style="background: linear-gradient(135deg, #36D1DC, #5B86E5); color: white;">
                      <i class="fas fa-user"></i>
                    </span>
                    <input
                        v-model="formData.name"
                        type="text"
                        class="form-control"
                        placeholder="Nguyễn Văn A"
                        required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Số điện thoại *</label>
                  <div class="input-icon">
                    <span class="icon-chip" style="background: linear-gradient(135deg, #FF416C, #FF4B2B); color: white;">
                      <i class="fas fa-phone"></i>
                    </span>
                    <input
                        v-model="formData.phone"
                        type="tel"
                        class="form-control"
                        placeholder="09xxxxxxxx"
                        required
                    />
                  </div>
                </div>
              </div>

              <div class="form-row">
                <!-- Province/City Searchable Dropdown -->
                <div class="form-group">
                  <label>Tỉnh/Thành</label>
                  <div class="input-icon" style="position: relative;">
    <span class="icon-chip" style="background: linear-gradient(135deg, #8344C5, #3A7BD5); color: white;">
      <i class="fas fa-location-dot"></i>
    </span>
                    <input
                        v-model="provinceSearch"
                        @focus="provinceDropdownOpen = true"
                        @input="provinceDropdownOpen = true"
                        @blur="closeProvinceDropdown"
                        type="text"
                        class="form-control"
                        placeholder="Tìm tỉnh/thành"
                        autocomplete="off"
                        style="cursor: pointer;"
                    />
                    <ul
                        v-if="provinceDropdownOpen && filteredProvinces.length"
                        class="province-dropdown"
                        style="position: absolute; left: 0; right: 0; top: 110%; z-index: 10; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; max-height: 180px; overflow-y: auto; margin: 0; padding: 0;"
                    >
                      <li
                          v-for="province in filteredProvinces"
                          :key="province.name"
                          @mousedown.prevent="selectProvince(province)"
                          style="padding: 0.5rem 1rem; cursor: pointer; list-style: none;"
                          :style="{ background: province.name === formData.area ? '#e0e7ff' : 'transparent' }"
                      >
                        {{ province.name }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="form-group">
                  <label>Tên tỉnh cũ</label>
                  <div class="input-icon">
                    <span class="icon-chip"
                          style="background: linear-gradient(135deg, #6b7280, #707f98); color: #f9fafb;">
                      <i class="fas fa-map-marked-alt"></i>
                    </span>
                    <input
                        v-model="formData.oldArea"
                        type="text"
                        class="form-control"
                        placeholder="Tên tỉnh cũ (nếu có)"
                    />
                  </div>
                </div>

              </div>
              <div class="form-group">
                <label>Giá</label>
                <div class="input-icon">
                    <span class="icon-chip" style="background: linear-gradient(135deg, #00b09b, #96c93d); color: white;">
                      <i class="fas fa-coins"></i>
                    </span>
                  <input
                      v-model="formData.price"
                      type="number"
                      class="form-control"
                      placeholder="0"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>Phân loại</label>
                <div class="type-buttons">
                  <button
                      v-for="type in customerTypes"
                      :key="type.id"
                      type="button"
                      :class="['type-btn', type.id, { active: formData.type === type.id }]"
                      @click="formData.type = type.id"
                  >
                    <i :class="type.icon"></i>
                    {{ type.label }}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Ghi chú</label>
                <div class="input-icon">
                  <span class="icon-chip" style="background: linear-gradient(135deg, #FF9966, #FF5E62); color: white;">
                    <i class="fas fa-note-sticky"></i>
                  </span>
                  <textarea
                      v-model="formData.note"
                      class="form-control"
                      rows="2"
                      placeholder="Thông tin bổ sung..."
                  ></textarea>
                </div>
              </div>

              <!-- Upload tiny -->
              <div class="form-group">
                <label>Đính kèm (tuỳ chọn)</label>
                <div class="upload-row">
                  <label class="upload-btn" title="Tải tệp nhỏ">
                    <i class="fas fa-paperclip"></i>
                    <span>Up file</span>
                    <input class="upload-input" type="file" @change="onPickFile" />
                  </label>
                  <div class="upload-meta" v-if="pickedFileName">
                    <i class="fas fa-file-lines"></i>
                    <span class="text-truncate">{{ pickedFileName }}</span>
                    <button type="button" class="upload-clear" @click="clearPickedFile" title="Bỏ chọn">
                      <i class="fas fa-xmark"></i>
                    </button>
                  </div>
                  <div class="upload-meta muted" v-else>
                    <i class="fas fa-circle-info"></i>
                    <span>Chọn tệp (nhỏ) để lưu kèm</span>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                  <i class="fas fa-check"></i> Ghi nhận
                </button>
                <button type="button" @click="clearForm" class="btn btn-text">
                  Xoá
                </button>
                <div class="entry-counter">
                  <small>{{ submissionCount }} lượt</small>
                </div>
              </div>
            </form>
          </div>

          <!-- Quick Stats -->
          <div class="stats-panel mt-4">
            <div class="panel-header">
              <h4>
                <span class="icon-label" style="background: linear-gradient(135deg, #3A7BD5, #00D2FF);">
                  <i class="fas fa-tachometer-alt"></i>
                </span>
                Thống kê nhanh
              </h4>
            </div>
            <div class="mini-stats">
              <div class="mini-stat stat-a">
                <div class="stat-value sm">{{ quickStats.today }}</div>
                <div class="stat-label">Hôm nay</div>
              </div>
              <div class="mini-stat stat-b">
                <div class="stat-value sm">{{ quickStats.successRate }}%</div>
                <div class="stat-label">Thành công</div>
              </div>
              <div class="mini-stat stat-c">
                <div class="stat-value sm">{{ quickStats.avgValue }}M</div>
                <div class="stat-label">Giá trị TB</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Analytics Panels -->
        <div class="col-lg-7">
          <!-- Performance Metrics -->
          <div class="row g-4">
            <div class="col-md-6">
              <div class="metric-card metric-card-call">
                <div class="metric-header">
                  <h4>
                    <span class="icon-label" style="background: linear-gradient(135deg, #00C9FF, #92FE9D);">
                      <i class="fas fa-phone-volume"></i>
                    </span>
                    Hiệu suất cuộc gọi
                  </h4>
                </div>
                <div class="metric-content">
                  <div class="metric-value">84%</div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 84%"></div>
                  </div>
                  <div class="metric-details">
                    <span>Kết nối: 168</span>
                    <span>Không kết nối: 32</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="metric-card metric-card-revenue">
                <div class="metric-header">
                  <h4>
                    <span class="icon-label" style="background: linear-gradient(135deg, #FF8A00, #FFC837);">
                      <i class="fas fa-money-bill-wave"></i>
                    </span>
                    Tổng giá trị
                  </h4>
                </div>
                <div class="metric-content">
                  <div class="row align-items-center">
                    <!-- Cột trái: Text -->
                    <div class="col-7">
                      <div class="metric-main">
                        <div class="metric-value metric-value-sm" style="font-size: 16px">
                          ₫{{ formatCurrency(totalValue) }}
                        </div>
                        <div class="metric-sub">Tổng khách nhập</div>
                      </div>
                    </div>

                    <!-- Cột phải: Progress -->
                    <div class="col-5 text-start">
                      <div class="target-progress target-progress-lg d-inline-flex justify-content-end">
                        <div
                            class="progress-circle progress-circle-lg"
                            :style="{ '--progress': '78' }"
                        >
                          <span>78%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- ✅ Phân bổ theo khu vực: thu nhỏ còn 1/2 -->
          <div class="row" style="padding: 0.8rem;">
            <div class="col-7 chart-panel chart-panel-distribution mt-2">
              <div class="panel-header">
                <h4>
                  <span class="icon-label" style="background: linear-gradient(135deg, #FD746C, #FF9068);">
                    <i class="fas fa-chart-pie"></i>
                  </span>
                  Phân bổ theo tỉnh/thành
                </h4>
                <select class="form-control form-control-sm period-select">
                  <option>Tháng này</option>
                  <option>Tháng trước</option>
                </select>
              </div>
              <div class="distribution-chart">
                <div class="chart-graphic chart-graphic-sm">
                  <canvas ref="distributionCanvas"></canvas>
                </div>
                <!-- ✅ Hiển thị tổng giá trị -->
              </div>
            </div>
            <div class="col-5 status-stack mt-2 ps-4" style="padding-right: 0px">
              <div class="status-item success">
                <i class="fas fa-check-circle"></i>
                <div>
                  <div class="status-count">892</div>
                  <div class="status-label">Khách lên văn phòng</div>
                </div>
              </div>

              <div class="status-item pending">
                <i class="fas fa-clock"></i>
                <div>
                  <div class="status-count">124</div>
                  <div class="status-label">Cuộc gọi thành công</div>
                </div>
              </div>

              <div class="status-item failed">
                <i class="fas fa-times-circle"></i>
                <div>
                  <div class="status-count">56</div>
                  <div class="status-label">Không liên lạc được</div>
                </div>
              </div>
            </div>
          </div>
          <!-- ✅ 3 thẻ thống kê: đưa lên, nằm riêng (không chung thẻ) -->


          <!-- Weekly Activity (Chart.js Bar) -->
          <div class="chart-panel chart-panel-activity mt-4">
            <div class="panel-header panel-header-activity">
              <h4>
                <span class="icon-label" style="background: linear-gradient(135deg, #9D50BB, #6E48AA);">
                  <i class="fas fa-chart-bar"></i>
                </span>
                Hoạt động nhập liệu
              </h4>

              <div class="activity-filter">
                <button
                    type="button"
                    class="seg-btn"
                    :class="{ active: activityRange === 'week' }"
                    @click="setActivityRange('week')"
                >
                  Tuần
                </button>
                <button
                    type="button"
                    class="seg-btn"
                    :class="{ active: activityRange === 'month' }"
                    @click="setActivityRange('month')"
                >
                  Tháng
                </button>
                <button
                    type="button"
                    class="seg-btn"
                    :class="{ active: activityRange === 'year' }"
                    @click="setActivityRange('year')"
                >
                  Năm
                </button>
              </div>
            </div>

            <div class="activity-chart-wrap activity-chart-wrap-lg">
              <canvas ref="activityCanvas"></canvas>
            </div>

            <div class="activity-note">
              Biểu đồ cột hiển thị số lượng nhập theo {{ activityRangeLabel }}.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification container injected by JS -->
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onBeforeUnmount, nextTick } from "vue";
import Chart from "chart.js/auto";
import addressData from '/src/assets/js/address.json'

const provinces = ref(addressData)
const formData = reactive({
  name: "",
  phone: "",
  area: "",
  oldArea: null,
  type: "",
  price: "",
  note: "",
});

const submissionCount = ref(0);
const totalValue = ref(2435000000); // 2.435 tỷ

const customerTypes = [
  { id: "CHINH_CHU", label: "Chủ nhà", icon: "fas fa-house-user" },
  { id: "MOI_GIOI", label: "Môi giới", icon: "fas fa-handshake" },
  { id: "NGUOI_THAN", label: "Người thân", icon: "fas fa-people-group" },
];

const quickStats = reactive({
  today: 24,
  successRate: 84,
  avgValue: 2.4,
});

/* =========================
   DISTRIBUTION CHART (Chart.js)
========================= */
const distributionCanvas = ref(null);
let distributionChart = null;
const distributionData = reactive([
  { id: "hcm", name: "TP. Hồ Chí Minh", value: 850000000, count: 40, color: "#FF416C" },
  { id: "hn",  name: "Hà Nội",         value: 650000000, count: 30, color: "#36D1DC" },
  { id: "dn",  name: "Đà Nẵng",        value: 450000000, count: 20, color: "#5B86E5" },
  { id: "bd",  name: "Bình Dương",     value: 285000000, count: 15, color: "#FF8A00" },
  { id: "dna", name: "Đồng Nai",       value: 205000000, count: 10, color: "#8344C5" },
]);

// Tính tổng giá trị phân bổ
const totalDistributionValue = computed(() => {
  return distributionData.reduce((sum, region) => sum + region.value, 0);
});

const renderDistributionChart = () => {
  const el = distributionCanvas.value;
  if (!el) return;

  if (distributionChart) {
    distributionChart.destroy();
  }

  const totalCount = distributionData.reduce(
      (sum, r) => sum + r.count,
      0
  );

  distributionChart = new Chart(el, {
    type: 'doughnut',
    data: {
      labels: distributionData.map(r => r.name),
      datasets: [
        {
          data: distributionData.map(r => r.count),
          backgroundColor: distributionData.map(r => r.color),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 15,
          hoverBorderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',

      // ===============================
      // VẼ CHỮ GIỮA – KHÔNG PLUGIN
      // ===============================
      animation: {
        animateRotate: true,
        animateScale: true,
        onComplete(animation) {
          const chart = animation.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return;

          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2;

          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Dòng 1: TỔNG
          ctx.font = '700 14px Inter, system-ui, sans-serif';
          ctx.fillStyle = '#475569';
          ctx.fillText('TỔNG', centerX, centerY - 14);

          // Dòng 2: Tổng giá trị
          ctx.font = '700 18px Inter, system-ui, sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText(
              formatCurrency(totalDistributionValue.value),
              centerX,
              centerY + 10
          );

          ctx.restore();
        }
      },

      plugins: {
        // ===============================
        // LEGEND
        // ===============================
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            color: '#1e293b',
            font: {
              size: 12,
              family: "'Inter', system-ui, sans-serif"
            },
            generateLabels(chart) {
              const data = chart.data;
              if (!data.labels.length) return [];

              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percent = ((value / totalCount) * 100).toFixed(1);

                return {
                  text: `${label} – ${value} KH (${percent}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].backgroundColor[i],
                  index: i
                };
              });
            }
          }
        },

        // ===============================
        // TOOLTIP (ĐÈ CHỮ TỔNG)
        // ===============================
        tooltip: {
          backgroundColor: 'rgb(15,23,42)',
          titleColor: '#ffffff',
          bodyColor: '#e5e7eb',
          footerColor: '#c7d2fe',
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          bodySpacing: 4,
          footerMarginTop: 8,

          callbacks: {
            label(context) {
              const label = context.label || '';
              const count = context.raw;
              const percent = ((count / totalCount) * 100).toFixed(1);
              const region = distributionData[context.dataIndex];

              return [
                `${label}: ${count} khách hàng (${percent}%)`,
                `Giá trị: ${formatCurrency(region.value)}`
              ];
            },
            footer(contexts) {
              const region = distributionData[contexts[0].dataIndex];
              const valuePercent = (
                  (region.value / totalDistributionValue.value) *
                  100
              ).toFixed(1);

              return `Chiếm ${valuePercent}% tổng giá trị`;
            }
          }
        }
      },

      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
};

/* =========================
   WEEKLY ACTIVITY (Chart.js)
========================= */
const activityCanvas = ref(null);
let activityChart = null;

const activityRange = ref("week");
const activityRangeLabel = computed(() => {
  if (activityRange.value === "week") return "tuần";
  if (activityRange.value === "month") return "tháng";
  return "năm";
});

const activityDataMap = {
  week: {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    data: [5, 7, 6, 9, 8, 10, 6],
  },
  month: {
    labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    data: [38, 42, 35, 50],
  },
  year: {
    labels: ["Th1","Th2","Th3","Th4","Th5","Th6","Th7","Th8","Th9","Th10","Th11","Th12"],
    data: [120, 140, 135, 150, 160, 170, 165, 180, 175, 190, 200, 210],
  },
};

function renderActivityChart() {
  const el = activityCanvas.value;
  if (!el) return;

  const cfg = activityDataMap[activityRange.value];

  if (activityChart) {
    activityChart.destroy();
    activityChart = null;
  }

  activityChart = new Chart(el, {
    type: "bar",
    data: {
      labels: cfg.labels,
      datasets: [
        {
          label: "Số lượng nhập",
          data: cfg.data,
          backgroundColor: "rgba(79, 70, 229, 0.72)",
          borderRadius: 6,
          barPercentage: 0.42,
          categoryPercentage: 0.62,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#0f172a",
          titleColor: "#fff",
          bodyColor: "#e5e7eb",
          padding: 10,
        },
      },
      scales: {
        x: {
          offset: true,
          grid: {
            drawBorder: false,
            color: "rgba(148, 163, 184, 0.20)",
          },
          ticks: {
            color: "#334155",
            font: { size: 11 },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: "rgba(148, 163, 184, 0.20)",
            borderDash: [4, 4],
          },
          ticks: {
            color: "#334155",
            font: { size: 11 },
          },
        },
      },
    },
  });
}

function setActivityRange(r) {
  activityRange.value = r;
}

/* ===== Helper Functions ===== */
function formatCurrency(value) {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(3).replace('.', ',') + 'B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1).replace('.', ',') + 'M';
  } else {
    return value.toLocaleString('vi-VN');
  }
}

/* ===== Upload ===== */
const pickedFileName = ref("");
function onPickFile(e) {
  const f = e?.target?.files?.[0];
  pickedFileName.value = f ? f.name : "";
}
function clearPickedFile() {
  pickedFileName.value = "";
}

/* ===== Existing actions ===== */
import api from "/src/api/api.js"
import { showWarning, showSuccess, showError} from "../../assets/js/alertService.js";

async function submitData() {
  try {
    const form = new FormData();

    // DTO gửi cho backend
    const dto = {
      name: formData.name,
      phone: formData.phone,
      area: formData.area,
      oldArea: formData.oldArea,
      type: formData.type,
      price: formData.price,
      note: formData.note,
    };

    form.append(
        "dto",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    // File upload (nếu có)
    const fileInput = document.getElementById("fileInput");
    if (fileInput?.files?.length) {
      Array.from(fileInput.files).forEach(f => {
        form.append("files", f);
      });
    }

    // 🚀 CALL API
    const res = await api.post(
        "/customer-crm/marketing/create",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // nếu dùng session / cookie
        }
    );

    const data = res.data;
    if( !res.success ){
      showWarning(data?.message || "Gửi dữ liệu không thành công. Vui lòng thử lại!");
      return;
    }

    // ======================
    // API THÀNH CÔNG
    // ======================
    submissionCount.value++;

    // Toast / notification
    showSuccess(`Đã ghi nhận dữ liệu lượt #${submissionCount.value}`);

    clearForm();

  } catch (err) {
    console.error(err);
    showError("Gửi dữ liệu thất bại. Vui lòng thử lại!");
  }
}


function clearForm() {
  formData.name = "";
  formData.phone = "";
  formData.area = "";
  formData.type = "";
  formData.price = "";
  formData.note = "";
  clearPickedFile();
}

function generateSampleData() {
  const names = ["Lê Minh Anh", "Trần Quốc Bảo", "Phạm Thị Cẩm", "Nguyễn Đức Duy"];
  const areaList = ["hcm", "hn", "dn", "bd", "dna"];
  const types = ["CHINH_CHU", "MOI_GIOI", "NGUOI_THAN"];

  formData.name = names[Math.floor(Math.random() * names.length)];
  formData.phone = `09${Math.floor(Math.random() * 90000000 + 10000000)}`;
  formData.area = areaList[Math.floor(Math.random() * areaList.length)];
  formData.type = types[Math.floor(Math.random() * types.length)];
  formData.price = Math.floor(Math.random() * 5000 + 500);
  formData.note = "Quan tâm dịch vụ. Nhắc gọi lại tuần sau.";

  quickStats.today++;
  quickStats.avgValue = (Math.random() * 0.5 + 2.2).toFixed(1);
}

function exportData() {
  const dataStr = JSON.stringify(
      {
        entries: submissionCount.value,
        exportTime: new Date().toISOString(),
        stats: quickStats,
        distribution: distributionData,
        totalValue: totalValue.value,
      },
      null,
      2
  );

  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const link = document.createElement("a");
  link.setAttribute("href", dataUri);
  link.setAttribute("download", `marketing-data-${new Date().toISOString().split("T")[0]}.json`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Watch và lifecycle hooks
watch(activityRange, () => renderActivityChart());

onMounted(() => {
  renderActivityChart();
  renderDistributionChart();
});

onBeforeUnmount(() => {
  if (activityChart) activityChart.destroy();
  if (distributionChart) distributionChart.destroy();
});

const provinceSearch = ref('');
const provinceDropdownOpen = ref(false);

const filteredProvinces = computed(() =>
    provinces.value.filter(p =>
        p.name.toLowerCase().includes(provinceSearch.value.toLowerCase())
    )
);

function selectProvince(province) {
  formData.area = province.name;
  provinceSearch.value = province.name;
  provinceDropdownOpen.value = false;
}

function closeProvinceDropdown() {
  setTimeout(() => {
    provinceDropdownOpen.value = false;
    // If user didn't select, keep the last valid name
    const selected = provinces.value.find(p => p.name === formData.area);
    provinceSearch.value = selected ? selected.name : '';
  }, 120);
}

// Sync input when area changes (e.g. on clearForm)
watch(() => formData.area, val => {
  const selected = provinces.value.find(p => p.name === val);
  provinceSearch.value = selected ? selected.name : '';
});

</script>

<style scoped>
/* ===== MODERN DASHBOARD STYLES ===== */
.refined-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #1e293b;
}

/* ===== HEADER ===== */
.dashboard-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.025em;
}

.dashboard-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

/* ===== Icon Labels ===== */
.icon-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  margin-right: 8px;
  color: white;
  font-size: 14px;
}

/* ===== BUTTONS ===== */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.btn-outline {
  background: white;
  border-color: #e2e8f0;
  color: #64748b;
}

.btn-outline:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.btn-primary {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.btn-primary:hover {
  background: #4338ca;
  border-color: #4338ca;
}

.btn-text {
  background: transparent;
  color: #64748b;
  border: none;
}

.btn-text:hover {
  color: #4f46e5;
}

/* ===== PANELS ===== */
.main-content {
  padding: 1.5rem 0;
}

.form-panel,
.stats-panel,
.metric-card,
.chart-panel {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* ⭐ THÊM MÀU NỀN CHO THẺ LỚN */
.form-panel {
  padding: 1.5rem;
  background: linear-gradient(135deg, #eef2ff 0%, #ffffff 65%);
}

.stats-panel {
  padding: 1.25rem;
  background: linear-gradient(135deg, #ecfeff 0%, #ffffff 65%);
}

.metric-card {
  padding: 1.25rem;
  height: 100%;
  background: #ffffff;
}

.metric-card-call {
  background: linear-gradient(135deg, #ecfeff 0%, #ffffff 65%);
}

.metric-card-revenue {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 65%);
}

/* ✅ Doanh thu: chữ nhỏ lại + vòng to hơn */
.metric-content-split {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.metric-value-sm {
  font-size: 1.25rem;
  font-weight: 800;
}
.metric-sub {
  margin-top: 0.2rem;
  font-size: 0.8rem;
  color: #64748b;
}
.target-progress-lg .progress-circle-lg {
  width: 96px;
  height: 96px;
}
.target-progress-lg .progress-circle-lg::before {
  width: 72px;
  height: 72px;
}

.chart-panel {
  padding: 1.25rem;
  background: #ffffff;
}

.chart-panel-distribution {
  background: linear-gradient(135deg, #fff7ed 0%, #ffffff 65%);
}

.chart-panel-activity {
  background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 65%);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.panel-header h3,
.panel-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* ===== INPUT ICONS ===== */
.input-icon {
  position: relative;
}
.icon-chip {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  box-shadow: 0 6px 14px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.9);
}

.input-icon .form-control {
  padding-left: 48px;
}

/* ===== FORM ===== */
.compact-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
}

.form-control {
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  color: #1e293b;
  background: white;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-control::placeholder {
  color: #94a3b8;
}

/* ===== TYPE BUTTONS ===== */
.type-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.type-btn {
  padding: 0.7rem 0.55rem;
  background: rgba(248, 250, 252, 0.9);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
}

.type-btn:hover {
  border-color: #cbd5e1;
  background: rgba(241, 245, 249, 0.95);
}

.type-btn.active {
  background: #e0e7ff;
  border-color: #4f46e5;
  color: #4f46e5;
}

/* ===== UPLOAD ===== */
.upload-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  border: 1px dashed rgba(148, 163, 184, 0.8);
  background: rgba(255, 255, 255, 0.75);
  color: #475569;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.upload-btn:hover {
  border-color: rgba(79, 70, 229, 0.45);
  color: #4f46e5;
  background: rgba(224, 231, 255, 0.35);
}
.upload-input {
  display: none;
}
.upload-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: rgba(248, 250, 252, 0.85);
  color: #334155;
  font-size: 0.82rem;
  max-width: 280px;
}
.upload-meta.muted {
  color: #64748b;
  background: rgba(248, 250, 252, 0.75);
}
.upload-clear {
  border: none;
  background: transparent;
  color: #94a3b8;
  padding: 0 4px;
  cursor: pointer;
}
.upload-clear:hover {
  color: #ef4444;
}

/* ===== ACTIONS ===== */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.6rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.entry-counter small {
  color: #94a3b8;
  font-size: 0.8125rem;
}

/* ===== MINI STATS (smaller + color each) ===== */
.mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}

.mini-stat {
  text-align: center;
  padding: 0.85rem 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.9);
}
.stat-a { background: linear-gradient(135deg, rgba(224,231,255,0.8), rgba(255,255,255,0.9)); }
.stat-b { background: linear-gradient(135deg, rgba(209,250,229,0.8), rgba(255,255,255,0.9)); }
.stat-c { background: linear-gradient(135deg, rgba(207,250,254,0.8), rgba(255,255,255,0.9)); }

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.15rem;
}
.stat-value.sm {
  font-size: 1.18rem;
  letter-spacing: -0.01em;
}
.stat-label {
  font-size: 0.72rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

/* ===== METRICS ===== */
.metric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.metric-header h4 {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #0f172a;
}

.metric-trend {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.metric-trend.up {
  background: #d1fae5;
  color: #059669;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  border-radius: 3px;
}

.metric-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: #64748b;
}

.target-progress {
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: conic-gradient(#4f46e5 calc(var(--progress) * 3.6deg), #e2e8f0 0deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.progress-circle::before {
  content: "";
  position: absolute;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
}

.progress-circle span {
  position: relative;
  z-index: 1;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
}

/* ===== DISTRIBUTION CHART ===== */
.period-select {
  width: auto;
  min-width: 120px;
  font-size: 0.8125rem;
}

.distribution-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-top: 0.75rem;
}

.chart-graphic {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-graphic-sm {
  width: 90%;
  height: 200px;
}

.total-value-display {
  text-align: center;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border-radius: 10px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  margin-top: 0.5rem;
}

.total-value-label {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.total-value-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

/* ===== STATUS STACK (separate cards) ===== */
.status-stack {
  display: grid;
  gap: 0.85rem;
}
.status-item {
  padding: 0.95rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.95);
  background: rgba(255, 255, 255, 0.85);
}
.status-item.success { background: linear-gradient(135deg, rgba(224,231,255,0.75), rgba(255,255,255,0.92)); }
.status-item.pending { background: linear-gradient(135deg, rgba(254,243,199,0.7), rgba(255,255,255,0.92)); }
.status-item.failed  { background: linear-gradient(135deg, rgba(254,226,226,0.72), rgba(255,255,255,0.92)); }

.status-item i { font-size: 1.25rem; }
.status-item.success i { color: #4f46e5; }
.status-item.pending i { color: #f59e0b; }
.status-item.failed i { color: #ef4444; }

.status-count {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
}
.status-label {
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 600;
}

/* ===== WEEKLY ACTIVITY ===== */
.panel-header-activity {
  margin-bottom: 0.75rem;
}

.activity-filter {
  display: inline-flex;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 10px;
  padding: 0.25rem;
}

.seg-btn {
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 0.8rem;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.seg-btn:hover {
  color: #334155;
  background: rgba(241, 245, 249, 0.9);
}

.seg-btn.active {
  background: #4f46e5;
  color: #fff;
}

.activity-chart-wrap {
  height: 240px;
  padding-top: 0.75rem;
}
.activity-chart-wrap-lg {
  height: 320px;
}

.activity-note {
  margin-top: 0.6rem;
  font-size: 0.8125rem;
  color: #64748b;
}

/* ===== NOTIFICATIONS ===== */
.success-notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #10b981;
  color: white;
  padding: 0.85rem 1.1rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.25);
  display: flex;
  align-items: center;
  gap: 0.65rem;
  animation: slideIn 0.25s ease;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    transform: translateX(16px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .chart-visual {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }

  .chart-graphic-sm {
    align-self: center;
  }

  .half-panel,
  .status-stack {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .type-buttons {
    grid-template-columns: 1fr;
  }

  .activity-filter {
    width: 100%;
    justify-content: space-between;
  }
}

.chart-graphic canvas {
  width: 100% !important;
  height: 100% !important;
}
.province-dropdown {
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
  font-size: 0.95em;
}
.province-dropdown li:hover {
  background: #f1f5f9;
}

</style>