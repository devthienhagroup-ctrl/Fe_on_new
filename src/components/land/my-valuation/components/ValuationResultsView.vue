<template>
  <div>
    <!-- HEADER -->
    <div
        class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 mb-md-4"
    >
      <div>
        <h5 class="fw-semibold text-dark mb-1 fs-6 fs-md-5">
          Kết quả định giá gần đây
        </h5>
        <p class="text-muted small mb-0">
          So sánh giá mong muốn của bạn với giá thị trường để đánh giá hiệu quả.
        </p>
      </div>

      <!-- BỘ LỌC -->
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <button
            class="btn btn-outline-primary btn-sm"
            :class="{ active: filterMode === 'all' }"
            @click="setFilter('all')"
        >
          <i class="fa-solid fa-list me-1"></i> Tất cả
        </button>

        <button
            class="btn btn-outline-success btn-sm"
            :class="{ active: filterMode === 'completed' }"
            @click="setFilter('completed')"
        >
          <i class="fa-solid fa-check-circle me-1"></i> Hoàn thành
        </button>

        <button
            class="btn btn-outline-warning btn-sm"
            :class="{ active: filterMode === 'inprogress' }"
            @click="setFilter('inprogress')"
        >
          <i class="fa-solid fa-hourglass-half me-1"></i> Đang định giá
        </button>
      </div>
    </div>

    <!-- DANH SÁCH -->
    <transition-group
        name="fade-list"
        tag="div"
        class="d-flex flex-column gap-2 gap-md-3"
    >
      <div
          v-for="valuation in filteredValuations"
          :key="valuation.id"
          class="valuation-card card border-0 shadow-sm"
      >
        <div class="card-body p-3 p-md-4">
          <!-- TIÊU ĐỀ -->
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h6 class="fw-semibold text-dark mb-1">
                Định giá tài sản:
                <span class="text-primary">{{ formatAddress(valuation.address) }}</span>
                <span v-if="valuation.round"> — Lần {{ valuation.round }}</span>
                <span style="color: black" v-if="valuation.priceGap == null">
                    Nhận kết quả tại văn phòng hoặc bán nhanh 30 ngày bạn sẽ được nhận kết quả
                    <span class="tag-free">MIỄN PHÍ</span>
                  </span>
              </h6>
              <p v-if="!valuation.createAt" class="text-muted small mb-0">
                Ngày yêu cầu: {{ formatTimeAgo(valuation.requestedAt) }}
              </p>
              <p v-else class="text-muted small mb-0">
                Ngày định giá: {{ formatTimeAgo(valuation.createAt) }}
              </p>
            </div>
            <span class="status-badge" :class="statusBadgeClass(valuation.status)">
              {{ valuation.status }}
            </span>
          </div>

          <!-- GIÁ SO SÁNH -->
          <div
              v-if="valuation.status.toLowerCase() !== 'đang định giá'"
              class="mt-3 mb-2"
          >
            <div class="d-flex align-items-center mb-1">
              <i
                  v-if="valuation.priceGap > 0 "
                  class="fa-solid fa-arrow-trend-up text-success fs-7 me-2"
              ></i>
              <i
                  v-else-if="valuation.priceGap < 0"
                  class="fa-solid fa-arrow-trend-down text-success fs-7 me-2"
              ></i>
              <i
                  v-else-if="valuation.priceGap === null"
              ></i>
              <i
                  v-else
                  class="fa-solid fa-minus text-secondary fs-7 me-2"
              ></i>

              <div class="text-muted small">
                <template v-if="valuation.priceGap > 0">
                  <span class="fw-semibold text-success">{{ valuation.priceGap.toFixed(1) }}%</span>
                  — Giá mong muốn của bạn <b class="text-dark">cao hơn</b> giá thị trường
                </template>
                <template v-else-if="valuation.priceGap < 0">
                  <span class="fw-semibold text-success">{{ Math.abs(valuation.priceGap).toFixed(1) }}%</span>
                  — Giá mong muốn của bạn <b class="text-dark">thấp hơn</b> giá thị trường
                </template>
                <template v-else-if="valuation.priceGap === null">
                  So sánh với giá thị trường : <span class="hide-value purple-shine">*************</span>
                </template>
                <template v-else>
                  <span class="fw-semibold text-secondary">0%</span>
                  — Bằng với giá thị trường
                </template>
              </div>
            </div>
            <div v-if="!!valuation.totalPrice" class="fs-6 fw-semibold text-dark">
              Giá trị ước tính: <span class="text-primary">{{ formatCurrency(valuation.totalPrice) }}</span>
            </div>
            <div v-else class="fs-6 fw-semibold text-dark">
              Giá trị ước tính: <span class="hide-value purple-shine" style="font-size: 10px !important; color: #12bd43!important;">$$$$$$$$</span>
            </div>
          </div>

          <!-- NẾU ĐANG ĐỊNH GIÁ -->
          <div v-else class="text-muted small mt-3 mb-2 fst-italic">
            <i class="fa-regular fa-circle-question me-1 text-primary"></i>
            Đang trong quá trình định giá — chưa có giá trị hiển thị.
          </div>

          <!-- NGÀY HIỆU LỰC -->
          <div
              v-if="valuation.status.toLowerCase() !== 'đang định giá'"
              class="text-muted small mt-2"
          >
            <i class="fa-regular fa-calendar text-primary me-1"></i>
            <span>
              Hiệu lực: {{ formatDate(valuation.effectiveDate) }} – {{ formatDate(valuation.expiryDate) }}
            </span>
          </div>

          <!-- NÚT HÀNH ĐỘNG -->
          <div class="pt-3 border-top mt-3 d-flex flex-wrap gap-2">
            <button
                v-if="valuation.status.toLowerCase() !== 'đang định giá' && valuation.priceGap != null"
                class="btn btn-primary btn-sm d-flex align-items-center gap-1"
                type="button"
                @click="emit('open-report', valuation)"
            >
              <i class="fa-solid fa-book-open"></i>
              <span>Đọc báo cáo</span>
            </button>
            <div  v-else-if="valuation.priceGap === null && valuation.status.toLowerCase() !== 'đang định giá'">
              <button

                  class="btn-unlock"
                  type="button"
                  @click="saveLocalStore(valuation.id, valuation.asset.id, valuation.asset.address )"

              >
                <i class="fa-solid fa-unlock-keyhole"></i>
                <span>Thanh toán để mở khóa kết quả</span>
              </button>
              <button
                  class="btn btn-fast-orange-history btn-sm rounded-3" type="button"
                  @click="openFastSale(valuation.asset.id, valuation.id, formatAddress(valuation.asset.address), 'BN30N')">
                <i class="fa-solid fa-paper-plane me-1 me-md-2"></i>Bán nhanh 30 ngày
              </button>
              <button
                  class="btn btn-fast-green btn-sm rounded-3"
                  type="button"
                  @click="openFastSale(valuation.asset.id, valuation.id, formatAddress(valuation.asset.address), null)"
              >
                <i class="fa-solid fa-paper-plane me-1 me-md-2"></i>
                Nhận trực tiếp tại văn phòng
              </button>
            </div>
            <button
                class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                type="button"
                @click="emit('view-detail', valuation.asset)"
            >
              <i class="fa-solid fa-city"></i>
              <span>Xem tài sản</span>
            </button>
          </div>
        </div>

      </div>
    </transition-group>
    <AppointmentModal
        v-if="showModal"
        :landAssetId="currentLandAssetId"
        :valuationId="currentValuationId"
        :asset-address="currentAddress"
        :purpose="currenPurpose"
        :show="showModal"
        @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../../../api/api.js";

import AppointmentModal from "./AppointmentModal.vue";

const showModal = ref(false);
const currentLandAssetId = ref(null);
const currentValuationId = ref(null);
const currentAddress = ref(null);
const currenPurpose = ref(null);

function openFastSale(landAssetId, id, address, purpose) {
  // item là object định giá bạn đang loop
  currentLandAssetId.value = landAssetId;
  currentValuationId.value = id; // hoặc item.valuationId tùy BE
  currentAddress.value = address
  showModal.value = true;
  currenPurpose.value = purpose;
}

const valuations = ref([]);
const filterMode = ref("all"); // all | completed | inprogress

// --- Lọc danh sách ---
const filteredValuations = computed(() => {
  if (filterMode.value === "all") return valuations.value;
  if (filterMode.value === "completed") {
    return valuations.value.filter(v => v.status?.toLowerCase() === "hoàn thành");
  }
  if (filterMode.value === "inprogress") {
    return valuations.value.filter(v => v.status?.toLowerCase() === "đang định giá");
  }
  return valuations.value;
});

// --- Chuyển bộ lọc ---
function setFilter(mode) {
  filterMode.value = mode;
}

// --- API ---
async function getListValuationRepost() {
  const res = await api.get("/thg.user/my-land/view/report", {
    withCredentials: true
  });
  valuations.value = res.data;
  console.log("Dữ liệu định giá:", res.data);
}

// --- Utils format ---
function formatDate(dateStr) {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("vi-VN");
}
function formatCurrency(num) {
  if (!num) return "0 ₫";
  return num.toLocaleString("vi-VN") + " ₫";
}
function formatAddress(address) {
  if (!address) return "";
  return address.replace(/\s*\/!!\s*/g, ", ");
}
function formatDateTime(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleString("vi-VN");
}
function formatTimeAgo(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return "1 ngày trước";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDateTime(dateString);
}

// --- Badge màu ---
function statusBadgeClass(status) {
  switch ((status || "").toLowerCase()) {
    case "đang định giá":
      return "status-inprogress";
    case "hoàn thành":
      return "status-completed";
    default:
      return "status-default";
  }
}

const emit = defineEmits(["open-report", "view-detail", "request-open-report"]);

const authStore = useAuthStore();
const info = authStore.userInfo;
import { socketService } from "/src/services/socketService.js"
import { SOCKET_CONFIG } from "/src/config/socketConfig.js"
import {useAuthStore} from "../../../../stores/authStore.js";
onMounted(async () => {
  await getListValuationRepost();

  const token = () => authStore.accessToken;
  socketService.connect(token);
  const employeeId = authStore.userInfo?.id;
  // 🏡 Lắng nghe sự kiện "Yêu cầu định giá mới"
  socketService.subscribe(SOCKET_CONFIG.valuationResponseTopic(employeeId), (event) => {
    if (event?.payload) {
      console.log("📨 Có yêu cầu định giá mới:", event.payload);
      // ✅ Tải lại danh sách yêu cầu mới nhất
      getListValuationRepost();
    }
  });
});

import { useRouter } from "vue-router";
const router = useRouter();
function saveLocalStore(id, landId, address){
  localStorage.setItem("valuationReportId", id);
  localStorage.setItem("landAssetId", landId);
  localStorage.setItem("address", address)
  router.push("/thanh-toan")
}
</script>

<style scoped>
.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.3s ease;
}
.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.valuation-card {
  border-radius: 12px;
  transition: all 0.25s ease;
}
.valuation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

/* Badge pastel */
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  border: 1px solid transparent;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  white-space: nowrap;
}
.status-inprogress {
  background-color: #fff3cd;
  color: #856404;
  border-color: #ffe8a1;
}
.status-completed {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}
.status-default {
  background-color: #e7f1ff;
  color: #084298;
  border-color: #b6d4fe;
}

/* Button */
.btn {
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.btn:hover {
  transform: translateY(-1px);
}
.btn.active {
  background-color: var(--bs-primary);
  color: #fff !important;
  border-color: var(--bs-primary);
}

@media (max-width: 576px) {
  .valuation-card .card-body {
    padding: 1rem 1.2rem;
  }
}
@media (max-width: 480px) {
  .status-badge {
    font-size: 0.72rem;
    padding: 4px 10px;
  }
}
.hide-value {
  display: inline-block;
  width: 140px;            /* chiều dài */
  height: 18px;            /* chiều cao */
  border-radius: 10px;
  background: linear-gradient(90deg,
  #8a36ff,
  #6a44ff,
  #3f2bd8,
  #8a36ff
  );
  position: relative;
  overflow: hidden;
}

/* ánh sáng chạy */
.hide-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;                    /* padding bạn yêu cầu */
  font-size: 16px;                      /* chữ to */
  font-weight: 800;                     /* đậm hơn */
  letter-spacing: 2px;                  /* đẹp hơn */
  color: white;                         /* chữ trắng */
  border-radius: 10px;
  background: linear-gradient(90deg,
  #8a36ff,
  #6a44ff,
  #3f2bd8,
  #8a36ff
  );
  position: relative;
  overflow: hidden;
  user-select: none;
}

/* hiệu ứng ánh sáng chạy */
.hide-value::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 70%;                           /* ánh sáng rộng hơn khi có chữ */
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.55),
      transparent
  );
  transform: skewX(-20deg);
  animation: shineMove 2.2s infinite ease-in-out;
}

/* ánh sáng metallic mềm */
.hide-value::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
      circle at 25% 50%,
      rgba(255,255,255,0.35) 0%,
      transparent 70%
  );
  opacity: 0.35;
  pointer-events: none;
}

@keyframes shineMove {
  0%   { left: -140%; }
  60%  { left: 130%; }
  100% { left: 160%; }
}

/* version đổ bóng tím đẹp hơn */
.purple-shine {
  box-shadow:
      inset 0 0 7px rgba(255,255,255,0.2),
      0 3px 8px rgba(0,0,0,0.18);
}
.btn-unlock {
  background: linear-gradient(135deg, #6a4dfd 0%, #8a36ff 45%, #b084ff 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(125, 60, 255, 0.35);
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
  transition: all 0.25s ease;
}

/* hiệu ứng ánh sáng chạy */
.btn-unlock::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.55),
      transparent
  );
  transform: skewX(-20deg);
  animation: unlockShine 2.4s infinite ease-in-out;
}

.btn-unlock {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  padding: 5px 6px;
  border-radius: 8px; /* hơi vuông vuông */
  border: 1px solid #7c3aed; /* tím đặc trưng */
  background: #ffffff;
  color: #6d28d9; /* chữ tím */
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
  transition: all 0.25s ease;
  overflow: hidden;
}

/* ánh sáng chạy qua */
.btn-unlock::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.65),
      transparent
  );
  transform: skewX(-20deg);
  animation: unlockShine 2s infinite ease-in-out;
}

@keyframes unlockShine {
  0% { left: -120%; }
  100% { left: 140%; }
}

/* Hover tím nhẹ + nâng nhẹ */
.btn-unlock:hover {
  background: #f5f0ff; /* tím nhạt */
  border-color: #8b5cf6;
  color: #6d28d9;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(125, 60, 255, 0.25);
}

/* icon tím */
.btn-unlock i {
  color: #6d28d9;
  font-size: 15px;
}
.btn-fast-orange-history {
  position: relative;                 /* ⭐ để chứa hiệu ứng */
  overflow: hidden;                   /* ⭐ tránh tràn */
  background: linear-gradient(135deg, #ff9f43, #ff7e29);
  border: 1px solid #d96a1b;
  color: #fff !important;
  top: 0px;
  margin-left: 10px;
  font-weight: 600;
  border-radius: 8px !important;
  padding: 5px 12px;
  box-shadow: 0 4px 14px rgba(255, 126, 41, 0.35);
  letter-spacing: 0.3px;
  transition: all 0.25s ease;
}

/* ✨ Hiệu ứng vàng chạy */
.btn-fast-orange-history::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 70%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.45),
      rgba(255, 224, 135, 0.65),   /* ⭐ vàng nhẹ đẹp */
      transparent
  );
  transform: skewX(-20deg);
  animation: fastOrangeShine 2.2s infinite ease-in-out;
  pointer-events: none; /* tránh lỗi click */
}

@keyframes fastOrangeShine {
  0% { left: -120%; }
  60% { left: 130%; }
  100% { left: 160%; }
}

/* Hover nảy */
.btn-fast-orange-history:hover {
  background: linear-gradient(135deg, #ffae59, #ff8d3d);
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 8px 20px rgba(255, 126, 41, 0.45);
}
.btn-fast-green {
  background: linear-gradient(135deg, #27ae60, #1e8f4d);   /* xanh lá gradient */
  border: 1px solid #176c3a;                               /* viền xanh đậm */
  color: #fff !important;
  margin-left: 10px;
  font-weight: 600;
  border-radius: 10px !important;
  padding: 5px 12px;
  box-shadow: 0 4px 14px rgba(46, 204, 113, 0.35);
  letter-spacing: 0.3px;
  transition: all 0.25s ease;
}

.btn-fast-green:hover {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 8px 20px rgba(39, 174, 96, 0.45);
}

/* Responsive cho mobile */
@media (max-width: 576px) {
  .btn-fast-green {
    width: 100%;
    margin-left: 0;
    margin-top: 6px;
    text-align: center;
    border-radius: 10px !important;
    white-space: normal;
  }
}

/* =============================
      📱 TABLET RESPONSIVE
============================= */
@media (max-width: 768px) {
  .btn-fast-orange-history {
    padding: 6px 12px;
    font-size: 13px;
  }
}
.tag-free {
  background: #ff2d2d;             /* đỏ tươi */
  color: #fff;
  padding: 5px 10px 3px 14px;      /* thêm padding trái cho giống tag */
  border-radius: 14px 4px 4px 14px;/* bo tròn trái nhiều hơn phải */
  font-size: 12.5px;
  font-weight: 700;
  display: inline-block;
  margin: 0 2px;
  position: relative;
}

/* tạo lỗ như tag thật */
.tag-free::before {
  content: "";
  position: absolute;
  left: 5px;
  top: 50%;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  transform: translateY(-50%);
  box-shadow: 0 0 0 2px #d61f1f; /* viền đỏ nhẹ */
}

@media (max-width: 576px) {
  .btn-fast-orange-history, .btn-fast-green, .btn-unlock {
    width: 100%;
    margin-left: 0;
    margin-top: 6px;
    text-align: center;
    border-radius: 10px !important;
    white-space: normal;
  }
}

/* =============================
      📱 TABLET RESPONSIVE
============================= */
@media (max-width: 768px) {
  .btn-fast-orange-history, .btn-fast-green, .btn-unlock {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>
