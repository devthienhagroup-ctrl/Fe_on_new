<template>
  <div id="refined-dashboard" class="refined-dashboard">
    <!-- Compact Header -->
    <div class="dashboard-header">
      <div>
        <div class="header-content">
          <div class="d-flex align-items-center gap-3">
            <button
              type="button"
              class="header-menu-toggle"
              title="Ẩn/hiện menu"
              @click="sidebar.toggle()"
            >
              <i class="fas fa-bars"></i>
              <span class="d-none d-md-inline">Menu</span>
            </button>
            <div class="brand-icon">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
            <div>
              <h1 class="dashboard-title">Bảng điều khiển Marketing</h1>
              <p class="dashboard-subtitle">Nhập liệu & phân tích theo thời gian thực</p>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <NotificationBell />
            <div class="d-flex flex-column align-items-end text-end">
              <div class="fw-semibold text-dark">{{ info.fullName }}</div>
            </div>

            <img
                v-if="info.avatarUrl"
                :src="' https://s3.cloudfly.vn/thg-storage/uploads-public/' + info.avatarUrl"
                alt="avatar"
                class="rounded-circle border"
                style="width: 36px; height: 36px; object-fit: cover;"
            />
            <div v-else class="avatar-circle">
              {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div style="max-width: 99%; padding-top: 20px; padding-left: 20px">
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
                  <label>Họ tên <span class="required">*</span></label>
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
                  <label>Số điện thoại <span class="required">*</span></label>
                  <div class="input-icon">
                    <span class="icon-chip" style="background: linear-gradient(135deg, #FF416C, #FF4B2B); color: white;">
                      <i class="fas fa-phone"></i>
                    </span>
                    <input
                        v-model="formData.phone"
                        type="tel"
                        class="form-control"
                        placeholder="09xxxxxxxx"
                        @blur="handlePhoneBlur"
                        required
                    />
                  </div>
                </div>
              </div>

              <div class="form-row">
                <!-- Province/City Searchable Dropdown -->
                <div class="form-group">
                  <label>Tỉnh/Thành <span class="required">*</span></label>
                  <div class="input-icon select-like" :class="{ open: provinceDropdownOpen }" style="position: relative;">
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

                    <span class="select-caret" aria-hidden="true" @mousedown.prevent="toggleProvinceDropdown">
                      <i class="fas fa-chevron-down"></i>
                    </span>

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
                    <span
                        class="icon-chip"
                        style="background: linear-gradient(135deg, #6b7280, #707f98); color: #f9fafb;"
                    >
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
                <label>Giá <span class="required">*</span></label>
                <div class="input-icon">
                  <span class="icon-chip" style="background: linear-gradient(135deg, #00b09b, #96c93d); color: white;">
                    <i class="fas fa-coins"></i>
                  </span>
                  <input
                      :value="priceDisplay"
                      type="text"
                      inputmode="numeric"
                      class="form-control"
                      placeholder="0"
                      @input="handlePriceInput"
                      @blur="syncPriceDisplay"
                      required
                  />
                </div>
              </div>

              <div class="form-group">
                <label>Phân loại <span class="required">*</span></label>
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
                <label>Nguồn <span class="required">*</span></label>
                <div class="source-buttons">
                  <button
                      v-for="source in customerSources"
                      :key="source.id"
                      type="button"
                      :class="['type-btn', source.id, { active: formData.source === source.id }]"
                      @click="formData.source = source.id"
                  >
                    <i :class="source.icon"></i>
                    {{ source.label }}
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
                    <input id="fileInput" class="upload-input" type="file" multiple @change="onPickFile" />
                  </label>
                  <div class="upload-meta" v-if="pickedFileNames.length">
                    <i class="fas fa-file-lines"></i>
                    <span class="text-truncate">{{ pickedFileLabel }}</span>
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
                <div>
                  <button type="submit" class="btn btn-primary">
                    <i class="fas fa-check"></i> Ghi nhận
                  </button>
                  <button
                      type="button"
                      @click="clearForm"
                      class="btn ms-2"
                      style="background-color: #b3f388; font-weight: 600!important; border-radius: 12px; !important"
                  >
                    <i class="fas fa-rotate-right me-1"></i>
                    Làm mới
                  </button>
                </div>
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
                <div class="stat-value sm">{{ thongKe.slHomNay }}</div>
                <div class="stat-label">Hôm nay</div>
              </div>
              <div class="mini-stat stat-b">
                <div class="stat-value sm">{{ thongKe.phanTramLienLacDuocHomNay }}%</div>
                <div class="stat-label">Liên lạc được</div>
              </div>
              <div class="mini-stat stat-c">
                <div class="stat-value sm">{{ formatCurrency(thongKe.giaTBSHomNay) }}</div>
                <div class="stat-label">Giá trị TB</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Analytics Panels -->
        <div class="col-lg-7">
          <!-- Performance Metrics -->
          <div class="row g-4">
            <div class="col-lg-4 col-md-6">
              <div class="metric-card metric-card-call">
                <div class="metric-header">
                  <h4>
                    <span class="icon-label" style="background: linear-gradient(135deg, #00C9FF, #92FE9D);">
                      <i class="fas fa-phone-volume"></i>
                    </span>
                    Hiệu suất cuộc gọi
                  </h4>
                </div>
                <div class="metric-content py-4">
                  <div class="metric-value">{{ thongKe.tongPhanTramLLD }} %</div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: thongKe.tongPhanTramLLD + '%' }"></div>
                  </div>
                  <div class="metric-details">
                    <span>Kết nối:{{ thongKe.slKhachLenDuoc }}</span>
                    <span>Không kết nối: {{ thongKe.slKhackKongLienLac }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-lg-4 col-md-6">
              <div class="metric-card metric-card-revenue text-center">
                <div class="metric-header">
                  <h4>
        <span class="icon-label" style="background: linear-gradient(135deg, #FF8A00, #FFC837);">
          <i class="fas fa-money-bill-wave"></i>
        </span>
                    Tổng dữ liệu đã nhập
                  </h4>
                </div>

                <div class="metric-content d-flex flex-column align-items-center">

                  <!-- Vòng tròn -->
                  <div class="progress-circle progress-circle-lg mb-2"
                       :style="{ '--progress': thongKe.tongPhanTramGT }">
                    <span class="progress-percent">{{ thongKe.tongPhanTramGT }}%</span>
                  </div>

                  <!-- Chữ nằm dưới -->
                  <div class="metric-main mt-1">
                    <div class="metric-value metric-value-sm" style="font-size:16px">
                      {{ formatCurrency(thongKe.tongGiaTri) }} khách hàng
                    </div>
                    <div class="metric-sub">Tổng khách nhập</div>
                  </div>

                </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6">
              <div class="chart-panel chart-panel-source">
                <div class="panel-header">
                  <h4>
                    <span class="icon-label" style="background: linear-gradient(135deg, #38bdf8, #0ea5e9);">
                      <i class="fas fa-chart-pie"></i>
                    </span>
                    Biểu đồ nguồn data
                  </h4>
                </div>
                <div class="distribution-chart">
                  <div class="chart-graphic chart-graphic-sm">
                    <canvas ref="sourceCanvas"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Doughnut status -->
          <div class="row" style="padding: 0.8rem;">
            <div class="col-7 chart-panel chart-panel-distribution mt-2">
              <div class="panel-header">
                <h4>
                  <span class="icon-label" style="background: linear-gradient(135deg, #FD746C, #FF9068);">
                    <i class="fas fa-chart-pie"></i>
                  </span>
                  Biểu đồ đánh giá chất lượng data
                </h4>
              </div>
              <div class="distribution-chart">
                <div class="chart-graphic chart-graphic-sm">
                  <canvas ref="distributionCanvas"></canvas>
                </div>
              </div>
            </div>

            <div class="col-5 status-stack mt-2 ps-4" style="padding-right: 0px">
              <div class="status-item success">
                <i class="fas fa-house-user"></i>
                <div>
                  <div class="status-count">{{ thongKe.slChuNha }}</div>
                  <div class="status-label">Chủ nhà</div>
                </div>
              </div>

              <div class="status-item pending">
                <i class="fas fa-handshake"></i>
                <div>
                  <div class="status-count">{{ thongKe.slMoiGioi }}</div>
                  <div class="status-label">Môi giới</div>
                </div>
              </div>

              <div class="status-item failed">
                <i class="fas fa-people-group"></i>
                <div>
                  <div class="status-count">{{ thongKe.slNguoiThan }}</div>
                  <div class="status-label">Người thân</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity -->
          <div class="chart-panel chart-panel-activity mt-4">
            <div class="panel-header panel-header-activity">
              <h4>
                <span class="icon-label" style="background: linear-gradient(135deg, #9D50BB, #6E48AA);">
                  <i class="fas fa-chart-bar"></i>
                </span>
                Hoạt động nhập liệu
              </h4>

              <div class="activity-filter">
                <button type="button" class="seg-btn" :class="{ active: activityRange === 'week' }" @click="setActivityRange('week')">
                  Tuần
                </button>
                <button type="button" class="seg-btn" :class="{ active: activityRange === 'month' }" @click="setActivityRange('month')">
                  Tháng
                </button>
                <button type="button" class="seg-btn" :class="{ active: activityRange === 'year' }" @click="setActivityRange('year')">
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
import addressData from "/src/assets/js/address.json";

import api from "/src/api/api.js";
import {
  showLoading,
  updateAlertError,
  updateAlertSuccess,
  showCenterError,
  showCenterWarning,
  showWarning
} from "../../assets/js/alertService.js";
import NotificationBell from "../NotificationBell.vue";
import { useAuthStore } from "/src/stores/authStore.js";
import { useSidebarStore } from "/src/stores/sidebarStore.js";
const authStore = useAuthStore();
const info = authStore.userInfo;
const sidebar = useSidebarStore();
const provinces = ref(addressData);
function normalizePhone(phone) {
  if (!phone) return "";
  return String(phone).trim().replace(/\s+/g, "");
}

const formData = reactive({
  name: "",
  phone: "",
  area: "",
  oldArea: null,
  type: "CHINH_CHU",
  source: "ADS",
  price: "",
  note: "",
});

const submissionCount = ref(0);
const totalValue = ref(2435000000);
const priceDisplay = ref("");

const customerTypes = [
  { id: "CHINH_CHU", label: "Chủ nhà", icon: "fas fa-house-user" },
  { id: "MOI_GIOI", label: "Môi giới", icon: "fas fa-handshake" },
  { id: "NGUOI_THAN", label: "Người thân", icon: "fas fa-people-group" },
];

const customerSources = [
  { id: "ADS", label: "Quảng cáo", icon: "fas fa-bullhorn" },
  { id: "FORUM", label: "Diễn đàn", icon: "fas fa-comments" },
  { id: "RAO_VAT", label: "Rao vặt", icon: "fas fa-tags" },
  { id: "FB", label: "Facebook", icon: "fab fa-facebook" },
  { id: "SEO", label: "SEO", icon: "fas fa-magnifying-glass-chart" },
];

/* =========================
   STATUS DOUGHNUT (Chart.js)
========================= */
const distributionCanvas = ref(null);
let distributionChart = null;

const normalizeStatus = (status) => {
  if (status == null) return status
  return status === 'BAN_NHANH' || status === 'BAN_GP' ? 'TRIEN_KHAI' : status
}

const STATUS_META = {
  NEW: { label: "Mới", color: "#94a3b8" },                 // xám
  DC_TELESALES: { label: "Đã cấp Telesales", color: "#6366f1" }, // tím xanh
  CHAM_SOC: { label: "Đang chăm sóc", color: "#38bdf8" },  // xanh trời
  TN_7NGAY: { label: "Theo dõi 7 ngày", color: "#0ea5e9" },
  TN_14NGAY: { label: "Theo dõi 14 ngày", color: "#0284c7" },

  THAT_BAI: { label: "Thất bại", color: "#dc2626" },       // đỏ đậm
  KHONG_LIEN_LAC_DUOC: { label: "Không liên lạc được", color: "#ea580c" }, // cam đậm
  SAI_SO_LIEU: { label: "Sai số liệu", color: "#9333ea" }, // tím đậm

  THANH_CONG: { label: "Lên VP (ĐK)", color: "#22c55e" },  // xanh lá tươi

  // ===== BỔ SUNG (ĐỔI MÀU RÕ HƠN) =====
  KHACH_HUY_HEN: { label: "Khách huỷ hẹn", color: "#b45309" }, // nâu cam (huỷ)
  TRIEN_KHAI: { label: "Triển khai", color: "#10b981" },  // xanh gradient hiện đại
};



const statusChartData = ref([]); // [{label,value,color}]
const sourceCanvas = ref(null);
let sourceChart = null;

const SOURCE_META = {
  ADS: { label: "Quảng cáo", color: "#f97316" },
  FORUM: { label: "Diễn đàn", color: "#6366f1" },
  RAO_VAT: { label: "Rao vặt", color: "#22c55e" },
  FB: { label: "Facebook", color: "#1877f2" },
  SEO: { label: "SEO", color: "#e11d48" },
};

const sourceChartData = ref([]);

async function fetchThongKeStatus() {
  try {
    const res = await api.get("/customer-crm/marketing/thong-ke-status", { withCredentials: true });
    const raw = Array.isArray(res.data) ? res.data : [];

    // BE: StatusChartDTO {label, value}
    statusChartData.value = raw
        .map(item => ({
          ...item,
          label: normalizeStatus(item.label)
        }))
        .filter(item => STATUS_META[item.label]) // label = enum key
        .map(item => ({
          label: STATUS_META[item.label].label, // dịch label
          value: Number(item.value || 0),
          color: STATUS_META[item.label].color,
        }));

    nextTick(() => renderDistributionChart());
  } catch (err) {
    console.error(err);
    showCenterError("Không tải được thống kê trạng thái");
  }
}

async function fetchThongKeNguon() {
  try {
    const res = await api.get("/customer-crm/marketing/thong-ke-nguon", { withCredentials: true });
    const raw = Array.isArray(res.data) ? res.data : [];
    const sourceTotals = raw.reduce((acc, item) => {
      const key = item?.nguon;
      if (key) acc[key] = Number(item?.total || 0);
      return acc;
    }, {});

    sourceChartData.value = Object.entries(SOURCE_META).map(([key, meta]) => ({
      label: meta.label,
      value: sourceTotals[key] ?? 0,
      color: meta.color,
    }));

    nextTick(() => renderSourceChart());
  } catch (err) {
    console.error(err);
    showCenterError("Không tải được thống kê nguồn data");
  }
}

const renderDistributionChart = () => {
  const el = distributionCanvas.value;
  if (!el) return;

  if (distributionChart) distributionChart.destroy();

  const chartData = Array.isArray(statusChartData.value) ? statusChartData.value : [];
  const safeData = chartData.length
      ? chartData
      : [{ label: "Chưa có dữ liệu", value: 0, color: "#e2e8f0" }];

  const totalCount = safeData.reduce((sum, r) => sum + (Number(r.value) || 0), 0);

  distributionChart = new Chart(el, {
    type: "doughnut",
    data: {
      labels: safeData.map(r => r.label),
      datasets: [
        {
          data: safeData.map(r => r.value),
          backgroundColor: safeData.map(r => r.color),
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 15,
          hoverBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      layout: { padding: { top: 16, bottom: 16 } },

      // Vẽ chữ giữa (không dùng plugin ngoài)
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
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.font = "700 14px Inter, system-ui, sans-serif";
          ctx.fillStyle = "#475569";
          ctx.fillText("TỔNG", centerX, centerY - 14);

          ctx.font = "700 18px Inter, system-ui, sans-serif";
          ctx.fillStyle = "#0f172a";
          ctx.fillText(`${totalCount} KH`, centerX, centerY + 10);

          ctx.restore();
        },
      },

      plugins: {
        // Legend dùng mặc định: labels đã dịch sẵn nên không cần generateLabels
        legend: {
          display: true,
          position: "right",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 16,
            color: "#1e293b",
            font: {
              size: 12,
              family: "'Inter', system-ui, sans-serif",
              weight: "600",
            },
          },
        },

        tooltip: {
          backgroundColor: "rgb(15,23,42)",
          titleColor: "#ffffff",
          bodyColor: "#e5e7eb",
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          bodySpacing: 4,
          callbacks: {
            label(context) {
              const label = context.label || "";
              const count = Number(context.raw || 0);
              const percent = totalCount ? ((count / totalCount) * 100).toFixed(1) : "0.0";
              return [`${label}: ${count} khách hàng (${percent}%)`];
            },
          },
        },
      },

      interaction: { intersect: false, mode: "index" },
    },
  });
};

const renderSourceChart = () => {
  const el = sourceCanvas.value;
  if (!el) return;

  if (sourceChart) sourceChart.destroy();

  const chartData = Array.isArray(sourceChartData.value) ? sourceChartData.value : [];
  const safeData = chartData.length
      ? chartData
      : [{ label: "Chưa có dữ liệu", value: 0, color: "#e2e8f0" }];

  const totalCount = safeData.reduce((sum, r) => sum + (Number(r.value) || 0), 0);

  sourceChart = new Chart(el, {
    type: "doughnut",
    data: {
      labels: safeData.map(r => r.label),
      datasets: [
        {
          data: safeData.map(r => r.value),
          backgroundColor: safeData.map(r => r.color),
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      layout: { padding: { top: 12, bottom: 12 } },
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
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.font = "700 12px Inter, system-ui, sans-serif";
          ctx.fillStyle = "#64748b";
          ctx.fillText("TỔNG", centerX, centerY - 12);

          ctx.font = "700 16px Inter, system-ui, sans-serif";
          ctx.fillStyle = "#0f172a";
          ctx.fillText(`${totalCount} KH`, centerX, centerY + 10);

          ctx.restore();
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            padding: 12,
            color: "#1e293b",
            font: {
              size: 11,
              family: "'Inter', system-ui, sans-serif",
              weight: "600",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgb(15,23,42)",
          titleColor: "#ffffff",
          bodyColor: "#e5e7eb",
          padding: 10,
          cornerRadius: 8,
          displayColors: true,
          bodySpacing: 4,
          callbacks: {
            label(context) {
              const label = context.label || "";
              const count = Number(context.raw || 0);
              const percent = totalCount ? ((count / totalCount) * 100).toFixed(1) : "0.0";
              return [`${label}: ${count} khách hàng (${percent}%)`];
            },
          },
        },
      },
      interaction: { intersect: false, mode: "index" },
    },
  });
};

/* =========================
   ACTIVITY BAR (Chart.js) - DATA THẬT TỪ BE
   GET /customer-crm/marketing/thong-ke-theo-thoi-gian?type=WEEK|MONTH|YEAR
========================= */
const activityCanvas = ref(null);
let activityChart = null;

const activityRange = ref("week");
const activityRangeLabel = computed(() => {
  if (activityRange.value === "week") return "tuần";
  if (activityRange.value === "month") return "tháng";
  return "năm";
});

const activityChartData = ref({
  labels: [],
  values: [],
});

function normalizeWeekLabel(label) {
  // BE có thể trả "Th 2" => convert thành "T2"
  if (!label) return "";
  const s = String(label).trim().replace(/\s+/g, "");
  if (s.startsWith("Th")) return s.replace("Th", "T");
  return s;
}

async function fetchActivityData() {
  try {
    const type = activityRange.value.toUpperCase(); // WEEK|MONTH|YEAR

    const res = await api.get("/customer-crm/marketing/thong-ke-theo-thoi-gian", {
      withCredentials: true,
      params: { type },
    });

    const raw = Array.isArray(res.data) ? res.data : [];

    const labels = raw.map(x => {
      const lb = x?.label ?? "";
      return type === "WEEK" ? normalizeWeekLabel(lb) : String(lb);
    });

    const values = raw.map(x => Number(x?.value || 0));

    activityChartData.value = { labels, values };

    nextTick(() => renderActivityChart());
  } catch (err) {
    console.error(err);
    showCenterError("Không tải được thống kê hoạt động nhập liệu");
    activityChartData.value = { labels: [], values: [] };
    nextTick(() => renderActivityChart());
  }
}

function renderActivityChart() {
  const el = activityCanvas.value;
  if (!el) return;

  const labels = activityChartData.value.labels?.length ? activityChartData.value.labels : ["—"];
  const values = activityChartData.value.values?.length ? activityChartData.value.values : [0];

  if (activityChart) {
    activityChart.destroy();
    activityChart = null;
  }

  activityChart = new Chart(el, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Số lượng nhập",
          data: values,
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
          grid: { drawBorder: false, color: "rgba(148, 163, 184, 0.20)" },
          ticks: { color: "#334155", font: { size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: { drawBorder: false, color: "rgba(148, 163, 184, 0.20)", borderDash: [4, 4] },
          ticks: { color: "#334155", font: { size: 11 }, precision: 0 },
        },
      },
    },
  });
}

function setActivityRange(r) {
  activityRange.value = r;
}

/* =========================
   THỐNG KÊ SƠ BỘ
========================= */
const thongKe = ref({
  slHomNay: 0,
  phanTramLienLacDuocHomNay: 0,
  giaTBSHomNay: 0,

  tongPhanTramLLD: 0,
  tongPhanTramGT: 0,

  slChuNha: 0,
  slMoiGioi: 0,
  slNguoiThan: 0,
  tongGiaTri: 0,

  // bạn đang dùng ở UI nhưng chưa set (mình giữ để khỏi lỗi)
  slKhachLenDuoc: 0,
  slKhackKongLienLac: 0,
});

async function fetchThongKeSoBo() {
  try {
    const res = await api.get("/customer-crm/marketing/thong-ke-so-bo", { withCredentials: true });
    const data = res.data || {};

    thongKe.value = {
      slHomNay: data.slHomNay ?? 0,
      phanTramLienLacDuocHomNay: data.phanTramLienLacDuocHomNay ?? 0,
      giaTBSHomNay: data.giaTBSHomNay ?? 0,

      tongPhanTramLLD: data.tongPhanTramLLD ?? 0,
      tongPhanTramGT: data.tongPhanTramGT ?? 0,

      slChuNha: data.slChuNha ?? 0,
      slMoiGioi: data.slMoiGioi ?? 0,
      slNguoiThan: data.slNguoiThan ?? 0,
      tongGiaTri: data.tongGiaTri ?? 0,

      slKhachLenDuoc: data.slKhachLenDuoc ?? 0,
      slKhackKongLienLac: data.slKhackKongLienLac ?? 0,
    };
  } catch (err) {
    console.error(err);
    showCenterError("Không tải được thống kê sơ bộ");
  }
}

/* =========================
   FORM helpers + submit
========================= */
const formatCurrency = (amount) => {
  if (!amount) return "0 VND";
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)} triệu`;
  return new Intl.NumberFormat("vi-VN").format(amount);
};

function normalizePriceInput(value) {
  return String(value || "").replace(/[^\d]/g, "");
}
function formatPriceDisplay(value) {
  if (!value) return "";
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function handlePriceInput(event) {
  const raw = normalizePriceInput(event.target.value);
  priceDisplay.value = formatPriceDisplay(raw);
  formData.price = raw ? Number(raw) : "";
}
function syncPriceDisplay() {
  const raw = normalizePriceInput(priceDisplay.value);
  priceDisplay.value = formatPriceDisplay(raw);
  formData.price = raw ? Number(raw) : "";
}

/* ===== Upload ===== */
const pickedFileNames = ref([]);
const pickedFileLabel = computed(() => {
  if (!pickedFileNames.value.length) return "";
  if (pickedFileNames.value.length === 1) return pickedFileNames.value[0];
  return `${pickedFileNames.value.length} tệp: ${pickedFileNames.value.join(", ")}`;
});
const lastCheckedPhone = ref("");
const isCheckingPhone = ref(false);
function onPickFile(e) {
  const files = Array.from(e?.target?.files || []);
  pickedFileNames.value = files.map(file => file.name);
}
function clearPickedFile() {
  pickedFileNames.value = [];
  const fileInput = document.getElementById("fileInput");
  if (fileInput) fileInput.value = "";
}

/* ===== Validate ===== */
function isValidName(name) {
  const normalized = name.trim().replace(/\s+/g, " ");
  if (!normalized) return false;
  const words = normalized.split(" ");
  if (words.length < 2) return false;
  return /^[A-Za-zÀ-ỹ\s]+$/u.test(normalized);
}
function isValidPhone(phone) {
  const normalized = normalizePhone(phone);
  return /^(0\d{9})$/.test(normalized);
}
async function handlePhoneBlur() {
  const normalized = normalizePhone(formData.phone);
  formData.phone = normalized;

  if (!normalized) return;

  if (!isValidPhone(normalized)) {
    showCenterWarning("Số điện thoại không đúng định dạng (ví dụ: 09xxxxxxxx).");
    return;
  }

  if (normalized === lastCheckedPhone.value || isCheckingPhone.value) return;

  isCheckingPhone.value = true;
  try {
    const res = await api.get("/customer-crm/marketing/check-phone", {
      withCredentials: true,
      params: { phone: normalized },
    });

    // ❌ KHÔNG return khi success = false nữa
    // success = true  => đã tồn tại
    // success = false => chưa tồn tại (OK)

    if (res?.data?.success === true) {
      showCenterWarning("Số điện thoại đã tồn tại trong hệ thống.");
    }

    lastCheckedPhone.value = normalized;

  } catch (err) {
    console.error(err);
    showCenterError("Không thể kiểm tra số điện thoại. Vui lòng thử lại!");
  } finally {
    isCheckingPhone.value = false;
  }
}

function validateForm() {
  if (!formData.name?.trim()) {
    showCenterWarning("Vui lòng nhập họ tên.");
    return false;
  }
  if (!isValidName(formData.name)) {
    showCenterWarning("Họ tên phải có ít nhất 2 từ và không chứa số hoặc ký tự đặc biệt.");
    return false;
  }
  if (!formData.phone?.trim()) {
    showCenterWarning("Vui lòng nhập số điện thoại.");
    return false;
  }
  if (!isValidPhone(formData.phone)) {
    showCenterWarning("Số điện thoại không đúng định dạng (ví dụ: 09xxxxxxxx).");
    return false;
  }
  if (!formData.area?.trim()) {
    showCenterWarning("Vui lòng chọn tỉnh/thành.");
    return false;
  }
  if (!formData.price) {
    showWarning("Vui lòng nhập giá bán.");
    return false;
  }
  if (!formData.type) {
    showWarning("Vui lòng chọn phân loại.");
    return false;
  }
  if (!formData.source) {
    showWarning("Vui lòng chọn nguồn khách hàng.");
    return false;
  }
  return true;
}

async function submitData() {
  try {
    if (!validateForm()) return;

    const form = new FormData();
    const dto = {
      name: formData.name,
      phone: normalizePhone(formData.phone),
      area: formData.area,
      oldArea: formData.oldArea,
      type: formData.type,
      source: formData.source,
      price: formData.price,
      note: formData.note,
    };

    form.append("dto", new Blob([JSON.stringify(dto)], { type: "application/json" }));

    const fileInput = document.getElementById("fileInput");
    if (fileInput?.files?.length) {
      Array.from(fileInput.files).forEach(f => form.append("files", f));
    }

    const res = await showLoading(
        api.post("/customer-crm/marketing/create", form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        })
    );

    const data = res.data;
    if (!data.success) {
      updateAlertError(data?.message || "Gửi dữ liệu không thành công. Vui lòng thử lại!");
      return;
    }

    submissionCount.value++;
    updateAlertSuccess(`Đã ghi nhận dữ liệu lượt #${submissionCount.value}`);
    clearForm();

    // ✅ refresh dashboard data thật
    fetchThongKeSoBo();
    fetchThongKeStatus();
    fetchThongKeNguon();
    fetchActivityData();
  } catch (err) {
    console.error(err);
    showCenterError("Gửi dữ liệu thất bại. Vui lòng thử lại!");
  }
}

function clearForm() {
  formData.name = "";
  formData.phone = "";
  formData.area = "";
  formData.oldArea = "";
  formData.type = "CHINH_CHU";
  formData.source = "ADS";
  formData.price = "";
  formData.note = "";
  priceDisplay.value = "";
  clearPickedFile();
}

/* ===== Demo (giữ nguyên) ===== */
function generateSampleData() {
  const names = ["Lê Minh Anh", "Trần Quốc Bảo", "Phạm Thị Cẩm", "Nguyễn Đức Duy"];
  const types = ["CHINH_CHU", "MOI_GIOI", "NGUOI_THAN"];
  const sources = ["ADS", "FORUM", "RAO_VAT", "FB", "SEO"];

  formData.name = names[Math.floor(Math.random() * names.length)];
  formData.phone = `09${Math.floor(Math.random() * 90000000 + 10000000)}`;
  formData.type = types[Math.floor(Math.random() * types.length)];
  formData.source = sources[Math.floor(Math.random() * sources.length)];
  const samplePrice = Math.floor(Math.random() * 5000 + 500) * 100000;
  formData.price = samplePrice;
  priceDisplay.value = formatPriceDisplay(String(samplePrice));
  formData.note = "Quan tâm dịch vụ. Nhắc gọi lại tuần sau.";
}

function exportData() {
  const dataStr = JSON.stringify(
      {
        entries: submissionCount.value,
        exportTime: new Date().toISOString(),
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

/* ===== Province dropdown ===== */
const provinceSearch = ref("");
const provinceDropdownOpen = ref(false);

const filteredProvinces = computed(() =>
    provinces.value.filter(p => p.name.toLowerCase().includes(provinceSearch.value.toLowerCase()))
);

function selectProvince(province) {
  formData.area = province.name;
  provinceSearch.value = province.name;
  provinceDropdownOpen.value = false;
}

function closeProvinceDropdown() {
  setTimeout(() => {
    provinceDropdownOpen.value = false;
    const selected = provinces.value.find(p => p.name === formData.area);
    provinceSearch.value = selected ? selected.name : "";
  }, 120);
}

function toggleProvinceDropdown() {
  provinceDropdownOpen.value = !provinceDropdownOpen.value;
}

watch(() => formData.area, val => {
  const selected = provinces.value.find(p => p.name === val);
  provinceSearch.value = selected ? selected.name : "";
});

/* ===== lifecycle ===== */
watch(activityRange, () => {
  fetchActivityData(); // ✅ đổi range là fetch data thật luôn
});

onMounted(() => {
  fetchThongKeSoBo();
  fetchThongKeStatus();
  fetchThongKeNguon();
  fetchActivityData(); // ✅ mặc định tuần hiện tại
});

onBeforeUnmount(() => {
  if (activityChart) activityChart.destroy();
  if (distributionChart) distributionChart.destroy();
  if (sourceChart) sourceChart.destroy();
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
  position: relative;
  max-width: 100%;
  top:-10px;
}

/* ===== HEADER ===== */
.dashboard-header {
  top:-10px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  z-index: 100;
  padding: 10px 20px;
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
.header-menu-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  height: 40px;
  border-radius: 15px;
  border: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #334155;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.header-menu-toggle:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  color: #0369a1;
  border-color: #bae6fd;
}

.header-menu-toggle:active {
  transform: scale(0.95);
}

.header-menu-toggle:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.35);
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

.required {
  color: #ef4444;
  margin-left: 4px;
}

.select-like .form-control {
  padding-right: 2rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.select-like.open .form-control {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.select-caret {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: auto;
  transition: transform 0.2s ease, color 0.2s ease;
}

.select-like.open .select-caret {
  transform: translateY(-50%) rotate(180deg);
  color: #4338ca;
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
  margin: 10px auto;
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

.chart-panel-source {
  background: linear-gradient(135deg, #e0f2fe 0%, #ffffff 65%);
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

.source-buttons {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
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
  width: 130px;
  height: 130px;
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
  width: 85px;
  height: 85px;
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

  .source-buttons {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
