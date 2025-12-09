<template>
  <div class="article-view" v-if="assetDetail">
    <div class="article-header px-3 px-md-4 px-lg-5 py-3 border-bottom bg-white">
      <button class="btn btn-link text-decoration-none text-muted px-0 small" type="button" @click="emit('back')">
        <i class="fa-solid fa-arrow-left-long me-1 me-md-2"></i>Quay lại danh sách tài sản
      </button>
      <h3 class="fw-semibold text-primary mt-2 mt-md-3 fs-5 fs-md-4">{{ formatAddress(assetDetail.address) }}</h3>
      <p class="text-muted mb-0 small">{{ formatAddress(assetDetail.oldAddress) }}</p>
    </div>
    <div class="px-3 px-md-4 px-lg-5 py-3 py-md-4 article-body">
      <section class="mb-4 mb-md-5">
        <div class="row g-4">
          <div class="col-12 col-lg-8">
            <div class="mb-4">
              <h5 class="section-title">Tổng quan tài sản</h5>
              <div class="d-flex flex-wrap gap-2 gap-md-3 text-muted small">
                <span><i class="fa-solid fa-map-marker-alt me-1 me-md-2 text-primary"></i>{{  getCityFromAddress(assetDetail.address) }}</span>
                <span><i class="fa-solid fa-ruler-combined me-1 me-md-2 text-primary"></i>{{ assetDetail.totalArea }} m²</span>
                <span><i class="fa-solid fa-landmark me-1 me-md-2 text-primary"></i>{{ assetDetail.landUseRight }}</span>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2 mb-4">
              <button class="btn btn-outline-primary1 btn-sm rounded-3" type="button" @click="emit('edit', assetDetail)">
                <i class="fa-solid fa-pen me-1 me-md-2"></i>Chỉnh sửa tài sản
              </button>

              <button class="btn btn-success btn-sm rounded-3" type="button" @click="emit('request', asset)">
                <i class="fa-solid fa-envelope-open-text me-1 me-md-2"></i>Yêu cầu định giá
              </button>

              <!-- ⭐ NÚT BÁN NHANH 30 NGÀY – MÀU CAM -->
              <button class="btn btn-fast-orange btn-sm rounded-3" type="button"
                      @click="openFastSale(assetDetail.id, null , formatAddress(assetDetail.address), 'BN30N')">
                <i class="fa-solid fa-paper-plane me-1 me-md-2"></i>Bán nhanh 30 ngày
              </button>
            </div>


            <!-- ẢNH THƯỜNG -->
            <div class="mb-4" v-if="assetDetail.images?.length > 0">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="section-title mb-0">Hình ảnh tài sản</h5>
                <span class="badge rounded-pill text-bg-light small">{{ assetDetail.images?.length || 0 }} hình</span>
              </div>
              <AssetImageCarousel :images="assetDetail.images" @open-image="emit('open-image', $event)" />
            </div>

            <!-- TÀI LIỆU ĐÍNH KÈM -->
            <div class="mb-4">
              <h5 class="section-title">Tài liệu đính kèm</h5>
              <FileOrLand
                  :key="assetDetail.id"
                  :fileList="getAllFiles()"
                  :entityId="assetDetail.id"
                  entityType="land"
                  :canEdit="false"
                  :on-upload="false"
                  @update:files="emit('update-files', $event)"
                  class="mt-3"
              />
            </div>
          </div>

          <div class="col-12 col-lg-4">
            <div class="info-panel p-3 p-md-4 rounded-3 rounded-md-4 shadow-sm bg-white h-100">
              <h6 class="fw-semibold text-primary mb-2 mb-md-3 fs-6">Thông tin sở hữu</h6>
              <ul class="list-unstyled text-muted small">
                <li class="mb-1 mb-md-2"><strong>Chủ sở hữu:</strong> {{ assetDetail.ownerFullName }}</li>
                <li class="mb-1 mb-md-2"><strong>Giá trị mong muốn:</strong> <i style="color: #1762bd; font-size: 18px"> {{ formatCurrency(assetDetail.desire) }}</i></li>
                <li class="mb-1 mb-md-2"><strong>Số tờ:</strong> {{ assetDetail.plotNumber }}</li>
                <li class="mb-1 mb-md-2"><strong>Số thửa:</strong> {{ assetDetail.parcelNumber }}</li>
                <li class="mb-1 mb-md-2"><strong>Quan hệ sở hữu:</strong> {{ assetDetail.ownershipRelation }}</li>
                <li class="mb-1 mb-md-2"><strong>Quyền sử dụng:</strong> {{ assetDetail.landUseRight }}</li>
                <li class="mb-1 mb-md-2"><strong>Vị trí:</strong> {{ assetDetail.landPosition }}</li>
                <li class="mb-1 mb-md-2"><strong>Kết cấu:</strong> {{ assetDetail.structure }}</li>
                <li class="mb-0"><strong>Ngày ghi nhận:</strong> {{ formatDate(assetDetail.updatedAt) }}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section v-if="assetDetail.valuationReports != null">
        <div class="d-flex justify-content-between align-items-center mb-2 mb-md-3">
          <h5 class="section-title mb-0">Lịch sử định giá</h5>
          <span class="badge rounded-pill text-bg-light small">{{ assetDetail.valuationReports.length }} báo cáo</span>
        </div>
        <div class="timeline d-flex flex-column gap-2 gap-md-3">
          <article
              v-for="item in  assetDetail.valuationReports"
              :key="item.id"
              class="history-item p-3 p-md-4 rounded-3 shadow-sm bg-white"
          >
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-2 mb-md-3">
              <div>
                <h6 class="fw-semibold text-primary mb-1">
                  Định giá số DG-THG-SB-{{ item.id }}

                  <span style="color: black" v-if="item.priceGap == null">
                    Nhận kết quả tại văn phòng hoặc bán nhanh 30 ngày bạn sẽ được nhận kết quả
                    <span class="tag-free">MIỄN PHÍ</span>
                  </span>
                </h6>
                <div class="text-muted small">Cập nhật {{ formatDate(item.createdAt) }}</div>
              </div>
            </div>
            <p class="text-muted small mb-2">{{ item.summary }}</p>
            <div class="text-muted small mb-3 d-flex flex-wrap gap-2 gap-md-3">
              <span>
                <i class="fa-solid fa-scale-balanced me-1 me-md-2 text-primary"></i>
                Giá trị:
                <span v-if="item.totalPrice != null" class="fw-bold text-dark">
                  {{ formatCurrency(item.totalPrice) }}
                </span>
                <span v-else class="hide-value purple-shine" style="font-size: 10px !important; color: #12bd43!important;">$$$$$$$$</span>
              </span>
              <span>
                <i class="fa-solid fa-bullseye me-1 me-md-2 text-primary"></i>
                Chênh lệch:
                <i
                    :class="[
                    getPriceGapDisplay(item.priceGap).icon,
                    getPriceGapDisplay(item.priceGap).color,
                    'me-1'
                  ]"
                ></i>
                <span v-if="item.priceGap != null" :class="getPriceGapDisplay(item.priceGap).color">
                  {{ getPriceGapDisplay(item.priceGap).text }}
                </span>
                <span v-else class="hide-value purple-shine">*************</span>
              </span>
            </div>
            <button v-if="item.priceGap != null" class="btn btn-outline-primary btn-sm" type="button"
                    style="border-radius: 10px; padding: 5px 12px"
                    @click="emit('open-report', item)">
              <i class="fa-solid fa-book-open-reader me-1 me-md-2"></i>Xem báo cáo chi tiết
            </button>
            <button
                v-else
                class="btn-unlock"
                type="button"
                @click="saveLocalStore(item.id, assetDetail.id, assetDetail.address)"
            >
              <i class="fa-solid fa-unlock-keyhole"></i>
              <span>Thanh toán để mở khóa kết quả</span>
            </button>
            <button
                v-if="item.priceGap == null"
                class="btn btn-fast-orange-history btn-sm rounded-3"
                type="button"
                @click="openFastSale(assetDetail.id, item.id, formatAddress(assetDetail.address), 'BN30N')"
            >
              <i class="fa-solid fa-paper-plane me-1 me-md-2"></i>
              Bán nhanh 30 ngày
            </button><button
              v-if="item.priceGap == null"
              class="btn btn-fast-green btn-sm rounded-3"
              type="button"
              @click="openFastSale(assetDetail.id, item.id, formatAddress(assetDetail.address), null)"
          >
            <i class="fa-solid fa-paper-plane me-1 me-md-2"></i>
            Nhận trực tiếp tại văn phòng
          </button>

          </article>
        </div>
      </section>
    </div>
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
import AssetImageCarousel from "./AssetImageCarousel.vue";
import FileOrLand from "../../FileOrLand.vue";
import AppointmentModal from "./AppointmentModal.vue";
import { ref } from "vue";

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
import { onMounted, watch, computed } from "vue";
import api from "../../../../api/api.js"
import {socketService} from "../../../../services/socketService.js";
import {SOCKET_CONFIG} from "../../../../config/socketConfig.js";
import {useAuthStore} from "../../../../stores/authStore.js";

const props = defineProps({
  asset: { type: Object, default: null },
  history: { type: Array, default: () => [] },
  profile: { type: Object, required: true },
  formatDate: { type: Function, required: true },
  formatCurrency: { type: Function, required: true },
  statusBadgeClass: { type: Function, required: true },
});

const assetDetail = ref(null);
const loading = ref(false);

async function fetchAssetDetail(id) {
  try {
    loading.value = true;
    const res = await api.get(`/thg.user/my-land/view/${id}`);
    assetDetail.value = res.data;
    console.log("📊 Asset detail:", res.data);
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết tài sản:", err);
  } finally {
    loading.value = false;
  }
}

// 👉 Hàm kết hợp tất cả file để truyền vào FileOrLand component
function getAllFiles() {
  if (!assetDetail.value) return [];

  const allFiles = [];

  // Thêm ảnh thường (nếu có)
  if (assetDetail.value.images) {
    allFiles.push(...assetDetail.value.images.map(img => ({
      ...img,
      isIG: false // Đánh dấu là ảnh thường
    })));
  }

  // Thêm ảnh sổ (nếu có)
  if (assetDetail.value.landBookFiles) {
    allFiles.push(...assetDetail.value.landBookFiles.map(img => ({
      ...img,
      isIG: true // Đánh dấu là ảnh sổ
    })));
  }

  // Thêm file tài liệu khác (nếu có)
  if (assetDetail.value.files) {
    allFiles.push(...assetDetail.value.files);
  }

  return allFiles;
}

// 👉 Tự động gọi khi component mount
const authStore = useAuthStore();
const info = authStore.userInfo;
onMounted(() => {
  if (props.asset?.id) {
    fetchAssetDetail(props.asset.id);
  }

  const token = () => authStore.accessToken;
  socketService.connect(token);
  const employeeId = authStore.userInfo?.id;
  // 🏡 Lắng nghe sự kiện "Yêu cầu định giá mới"
  socketService.subscribe(SOCKET_CONFIG.valuationResponseTopic(employeeId), (event) => {
    if (event?.payload) {
      console.log("📨 Có yêu cầu định giá mới:", event.payload);
      fetchAssetDetail(props.asset.id);
    }
  });
});

// 👉 Hoặc nếu asset thay đổi
watch(
    () => props.asset?.id,
    (newId) => {
      if (newId) fetchAssetDetail(newId);
    }
);

const emit = defineEmits([
  "back",
  "edit",
  "request",
  "open-image",
  "open-land-book-image", // THÊM EMIT MỚI CHO ẢNH SỔ
  "update-files",
  "download-all",
  "open-report",
  "request-open-report"
]);

function formatAddress(address) {
  if (!address) return "";
  return address.replace(/\s*\/!!\s*/g, ", ");
}

function getCityFromAddress(address) {
  if (!address) return "";
  const parts = address.split("/").map(p => p.trim());
  return parts.find(p => p.startsWith("Thành phố")) || "";
}

function getPriceGapDisplay(priceGap) {
  if (priceGap == null || isNaN(priceGap)) {
    return { text: "—", color: "text-secondary", icon: "" };
  }

  if (priceGap > 0) {
    return {
      text: `${priceGap.toFixed(1)}%`,
      color: "text-success",
      icon: "fa-solid fa-arrow-trend-up text-success fs-7s",
    };
  } else if (priceGap < 0) {
    return {
      text: `${Math.abs(priceGap).toFixed(1)}%`,
      color: "text-danger",
      icon: "fa-solid fa-arrow-trend-down text-success fs-7",
    };
  } else {
    return {
      text: "0%",
      color: "text-muted",
      icon: "fa-solid fa-minus",
    };
  }
}
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
.article-view {
  background: linear-gradient(160deg, rgba(245, 250, 255, 0.9) 0%, rgba(255, 255, 255, 0.85) 100%);
}

.article-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
}

.section-title {
  font-weight: 600;
  color: #0f172a;
}

.info-panel {
  border: 1px solid rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(6px);
  border-radius: 1.25rem !important;
}

.history-item {
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 1.25rem !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 1rem 2.5rem rgba(15, 23, 42, 0.12);
}

.timeline {
  border-left: 2px dashed rgba(148, 163, 184, 0.4);
  padding-left: 1rem;
}

@media (max-width: 767.98px) {
  .timeline {
    border-left: none;
    padding-left: 0;
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
  border-radius: 10px; /* hơi vuông vuông */
  border: 1px solid #7c3aed; /* tím đặc trưng */
  background: #ffffff;
  color: #6d28d9; /* chữ tím */
  font-size: 14px;
  font-weight: 700;
  top: 1px;
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

@media (max-width: 576px) {
  .btn-unlock, .btn-outline-primary {
    width: 100%;
    justify-content: center;
    font-size: 13px;
    padding: 8px 12px;
    white-space: normal;
  }
}

/* ============================
      📱 TABLET RESPONSIVE
============================ */
@media (max-width: 768px) {
  .btn-unlock, .btn-outline-primary {
    font-size: 13px;
    padding: 6px 12px;
  }
}


/* ======================================
   ⭐ NÚT BÁN NHANH 30 NGÀY – MÀU CAM PREMIUM
   ====================================== */

.btn-fast-orange {
  background: linear-gradient(135deg, #ff9f43, #ff7e29);
  color: #fff !important;
  border: none;
  box-shadow: 0 4px 14px rgba(255, 126, 41, 0.35);
  letter-spacing: 0.3px;
  transition: all 0.25s ease;
}

.btn-fast-orange:hover {
  background: linear-gradient(135deg, #ffae59, #ff8d3d);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 18px rgba(255, 126, 41, 0.45);
}

.btn-fast-orange i {
  color: white !important;
}
.btn-success.rounded-3 {
  background: linear-gradient(135deg, #329a1a, #1fab2b);
  color: #fff !important;
  border: none;
  font-weight: 500;
  transition: all 0.25s ease;
}

.btn-success.rounded-3:hover {
  background: linear-gradient(135deg, #3bbd20, #26c63c);
  transform: translateY(-3px) scale(1.04);  /* ⭐ hiệu ứng nảy */
  box-shadow: 0 8px 20px rgba(32, 185, 55, 0.45);
}



/* =====================================
   ⭐ NÚT CHỈNH SỬA – OUTLINE PRIMARY
   ===================================== */
.btn-outline-primary1 {
  border: 1px solid #0d6efd;     /* ⭐ thêm border */
  color: #0d6efd;                /* ⭐ text xanh */
  background-color: transparent;
  font-weight: 500;
  transition: all 0.25s ease;
  padding: 5px 12px;
}
.btn-outline-primary1.rounded-3 {
  font-weight: 500;
  transition: all 0.25s ease;
}

.btn-outline-primary1.rounded-3:hover {
  background-color: #ffffff !important;
  color: #0d6efd !important;
  border-color: #0d6efd !important;
  transform: translateY(-3px) scale(1.04);  /* ⭐ hiệu ứng nảy */
  box-shadow: 0 8px 20px rgba(13, 110, 253, 0.35);
}


.btn-outline-primary1.rounded-3 {
  font-weight: 500;
  transition: all 0.25s ease;
}

.btn-outline-primary1.rounded-3:hover {
  background-color: #ffffff !important;
  color: #0d6efd !important;
  border-color: #0d6efd !important;
  transform: translateY(-3px) scale(1.04);  /* ⭐ hiệu ứng nảy */
  box-shadow: 0 8px 20px rgba(13, 110, 253, 0.35);
}

/* =========================================
   ⭐ NÚT BÁN NHANH TRONG LỊCH SỬ ĐỊNH GIÁ
   ========================================= */

.btn-fast-orange-history {
  background: linear-gradient(135deg, #ff9f43, #ff7e29);
  border: 1px solid #d96a1b;
  color: #fff !important;
  margin-left: 10px;
  font-weight: 600;
  border-radius: 10px !important;
  padding: 5px 12px;
  box-shadow: 0 4px 14px rgba(255, 126, 41, 0.35);
  letter-spacing: 0.3px;
  transition: all 0.25s ease;

}

.btn-fast-orange-history:hover {
  background: linear-gradient(135deg, #ffae59, #ff8d3d);
  transform: translateY(-3px) scale(1.04);   /* ⭐ hiệu ứng nảy giống 2 nút dưới */
  box-shadow: 0 8px 20px rgba(255, 126, 41, 0.45);
}

@media (max-width: 576px) {
  .btn-fast-orange-history {
    width: 100%;               /* full width cho mobile */
    margin-left: 0;
    margin-top: 6px;
    text-align: center;
    border-radius: 10px !important;
    white-space: normal;       /* cho phép xuống dòng */
  }
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

</style>