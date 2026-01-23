<template>
  <div>
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3 mb-md-4">
      <div>
        <h5 class="fw-semibold text-dark mb-1 fs-6 fs-md-5">Tài sản của bạn</h5>
        <p class="text-muted small mb-0">Danh sách các bất động sản đang quản lý và lịch sử định giá.</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary btn-sm" type="button" @click="emit('refresh')">
          <i class="fa-solid fa-rotate me-1 me-md-2"></i>Làm mới
        </button>
        <button class="btn btn-primary btn-sm" type="button" @click="emit('add-asset')">
          <i class="fa-solid fa-plus me-1 me-md-2"></i>Thêm tài sản
        </button>
      </div>
    </div>

    <!-- Không có tài sản -->
    <div v-if="!assets.length" class="text-center py-4 py-md-5">
      <div class="display-5 text-muted mb-2 mb-md-3">
        <i class="fa-solid fa-city"></i>
      </div>
      <p class="text-muted mb-2 mb-md-3">Bạn chưa có tài sản nào được lưu trữ.</p>
      <button class="btn btn-primary" type="button" @click="emit('add-asset')">
        <i class="fa-solid fa-plus me-1 me-md-2"></i>Thêm tài sản đầu tiên
      </button>
    </div>

    <!-- DANH SÁCH TÀI SẢN -->
    <div v-else class="row g-3 g-md-4">
      <div
          v-for="asset in assets"
          :key="asset.id"
          class="col-12 col-md-6 col-xl-4 d-flex"
      >
        <article class="asset-card card border-0 shadow-sm flex-fill h-100 rounded-4 overflow-hidden">

          <!-- GRID ẢNH -->
          <div class="image-grid-container">

            <!-- Ảnh chính -->
            <div class="main-image-col">
              <div class="image-wrapper main-image-wrapper">
                <img
                    :src="asset.images?.[0]?.tempUrl || 'https://s3.cloudfly.vn/thg-storage/uploads-public/file_20260113_171315_590.jpg'"
                    class="image-content"
                    :alt="'Ảnh ' + asset.images?.[0]?.name"
                />
                <div class="image-overlay"></div>
              </div>
            </div>

            <!-- Ảnh phụ -->
            <div class="side-images-col">

              <div class="image-wrapper side-image-wrapper" v-if="asset.images && asset.images[1]">
                <img
                    :src="asset.images[1].tempUrl"
                    class="image-content"
                    :alt="'Ảnh ' + asset.images[1]?.name"
                />
                <div class="image-overlay"></div>
              </div>

              <div class="image-wrapper side-image-wrapper" v-if="asset.images && asset.images[2]">
                <img
                    :src="asset.images[2].tempUrl"
                    class="image-content"
                    :alt="'Ảnh ' + asset.images[2]?.name"
                />
                <div class="image-overlay"></div>
              </div>

              <div class="image-wrapper side-image-wrapper position-relative" v-if="asset.images && asset.images[3]">
                <img
                    :src="asset.images[3].tempUrl"
                    class="image-content"
                    :alt="'Ảnh ' + asset.images[3]?.name"
                />
                <div class="image-overlay"></div>

                <div class="total-images-overlay" v-if="asset.images.length > 0">
                  <div class="total-images-badge">
                    <i class="fa-solid fa-images me-1"></i>
                    {{ asset.images.length }} ảnh
                  </div>
                </div>
              </div>

              <!-- Placeholder -->
              <div class="image-wrapper side-image-wrapper empty-image" v-if="!asset.images || asset.images.length < 2">
                <span class="empty-image-content">
                  <i class="fa-solid fa-image text-muted"></i>
                </span>
              </div>

              <div class="image-wrapper side-image-wrapper empty-image" v-if="!asset.images || asset.images.length < 3">
                <span class="empty-image-content">
                  <i class="fa-solid fa-image text-muted"></i>
                </span>
              </div>

              <div class="image-wrapper side-image-wrapper empty-image" v-if="!asset.images || asset.images.length < 4">
                <span class="empty-image-content">
                  <i class="fa-solid fa-image text-muted"></i>
                </span>
              </div>

            </div>
          </div>

          <!-- THÔNG TIN TÀI SẢN -->
          <div class="card-content-compact">
            <div class="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-1">
              <span class="badge rounded-pill text-bg-light small">
                <i class="fa-solid fa-layer-group me-1 text-primary"></i>{{ asset.totalValuation || 0 }} lần
              </span>
              <span class="badge rounded-pill small" :class="statusBadgeClass(asset.status)">
                {{ asset.status }}
              </span>
            </div>

            <h5 class="card-title text-truncate fs-6 mb-2">
              {{ formatAddress(asset.address) }}
            </h5>

            <ul class="list-unstyled text-muted small mb-2 compact-list">
              <li class="mb-1">
                <i class="fa-solid fa-map-pin me-1 text-primary"></i>
                Tờ {{ asset.plotNumber }} • Thửa {{ asset.parcelNumber }}
              </li>
              <li class="mb-1">
                <i class="fa-solid fa-ruler-combined me-1 text-primary"></i>
                {{ asset.totalArea }} m²
              </li>
              <li>
                <i class="fa-solid fa-landmark me-1 text-primary"></i>
                {{ asset.landUseRight }}
              </li>
            </ul>

            <p class="text-muted small mb-0">
              Cập nhật: {{ formatDate(asset.updatedAt) }}
            </p>
          </div>

          <!-- BUTTONS -->
          <div class="card-footer bg-white border-0 pt-0 pb-3 px-3">
            <div class="d-flex gap-2 w-100 action-button-group">

              <button class="btn btn-outline-primary btn-sm action-button"
                      @click="emit('view-detail', asset)">
                <i class="fa-solid fa-eye me-1"></i>Chi tiết
              </button>

              <button class="btn btn-success btn-sm action-button"
                      @click="emit('request-valuation', asset)">
                <i class="fa-solid fa-envelope-open-text me-1"></i>Định giá
              </button>

              <button class="btn btn-bluepurple btn-sm action-button"
                      @click="openFastSale(asset.id, null, formatAddress(asset.address), 'BN30N')">
                <i class="fa-solid fa-paper-plane me-1"></i>Bán nhanh 30N
              </button>

            </div>
          </div>

        </article>
      </div>
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
import { ref } from "vue";
import AppointmentModal from "./AppointmentModal.vue";

const showModal = ref(false);
const currentLandAssetId = ref(null);
const currentValuationId = ref(null);
const currentAddress = ref(null);
const currenPurpose = ref(null);

function openFastSale(landAssetId, id, address, purpose) {
  currentLandAssetId.value = landAssetId;
  currentValuationId.value = id;
  currentAddress.value = address;
  currenPurpose.value = purpose;
  showModal.value = true;
}

const props = defineProps({
  assets: { type: Array, default: () => [] },
  statusBadgeClass: Function,
  formatDate: Function,
});

const emit = defineEmits(["refresh", "add-asset", "view-detail", "request-valuation"]);

function formatAddress(address) {
  if (!address) return "";
  return address.replace(/\s*\/!!\s*/g, ", ");
}
</script>


<style scoped>
.btn-bluepurple {
  background: linear-gradient(135deg, #4a6cf7, #8c52ff);
  color: #fff !important;
  border: none;
  font-weight: 600;
  transition: 0.25s ease;
}
.btn-bluepurple:hover {
  filter: brightness(1.08);
}
/* ============================
   🎨 3 NÚT HÀNH ĐỘNG FULL 100%
   ============================ */

.action-button-group {
  display: flex;
  width: 100%;
  gap: 8px;
  flex-wrap: nowrap; /* Ở desktop không xuống dòng */
}

/* Mỗi nút chính xác 33.33% */
.action-button {
  flex: 1 1 calc(33.33% - 6px);
  width: calc(33.33% - 6px);
  padding: 7px 6px;
  font-size: 12px;
  border-radius: 999px;
  white-space: nowrap;
  font-weight: 600;
  text-align: center;
}

/* ❗ GIỮ NGUYÊN MÀU NÚT CHI TIẾT */
.btn-outline-primary {
  white-space: nowrap;
}

/* Định giá (xanh lá) */
.btn-success.action-button {
  background: linear-gradient(135deg, #329a1a, #1fab2b) !important;
  border: none !important;
  color: #fff !important;
  transition: all 0.25s ease;
}

.btn-success.action-button:hover {
  background: linear-gradient(135deg, #3bbd20, #26c63c);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 14px rgba(32, 185, 55, 0.35);
}


/* Bán nhanh 30N (xanh tím) */
.btn-bluepurple.action-button {
  background: linear-gradient(135deg, #4a6cf7, #8c52ff);
  border: none !important;
  color: #fff !important;
  transition: all 0.25s ease;
}

.btn-bluepurple.action-button:hover {
  background: linear-gradient(135deg, #5a7cff, #9d63ff);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 14px rgba(90, 124, 255, 0.35);
}
/* ⭐ Nút Chi tiết – GIỮ NGUYÊN MÀU nhưng có hiệu ứng hover premium */
.btn-outline-primary.action-button {
  transition: all 0.25s ease;
  border-width: 1px !important;
}

.btn-outline-primary.action-button:hover {
  background-color: #ffffff !important;  /* giữ sáng */
  color: #0d6efd !important;             /* giữ màu xanh primary */
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 6px 14px rgba(13, 110, 253, 0.25); /* shadow xanh */
  border-color: #0d6efd !important;
}


/* 📱 Mobile: 3 nút xuống dòng – full width */
@media (max-width: 575.98px) {
  .action-button-group {
    flex-wrap: wrap;
  }
  .action-button {
    flex: 1 1 100% !important;
    width: 100% !important;
    padding: 9px 12px;
    font-size: 13px;
  }
}


.asset-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(243, 249, 255, 0.75) 100%);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  height: 380px; /* Giữ nguyên chiều cao tổng */
  display: flex;
  flex-direction: column;
}

.asset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 1rem 2.5rem rgba(15, 23, 42, 0.12);
}

/* Layout ảnh chiếm 6 phần */
.image-grid-container {
  display: flex;
  height: 228px; /* 60% của 380px = 228px */
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

/* Thông tin chiếm 4 phần */
.card-content-compact {
  flex: 1;
  padding: 12px 16px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0; /* Quan trọng để flex hoạt động tốt */
}

/* Thu hẹp khoảng cách */
.compact-list {
  margin-bottom: 8px !important;
}

.compact-list li {
  margin-bottom: 2px !important;
  line-height: 1.3;
}

.compact-text {
  font-size: 11px;
  line-height: 1.2;
}

.card-title {
  line-height: 1.3;
  margin-bottom: 8px !important;
}

.main-image-col {
  flex: 7; /* 7 phần */
  position: relative;
}

.side-images-col {
  flex: 3; /* 3 phần */
  display: flex;
  flex-direction: column;
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  flex: 1;
}

.main-image-wrapper {
  height: 100%;
  border-right: 1px solid rgba(0,0,0,0.1);
}

.side-image-wrapper {
  border-bottom: 1px solid rgba(0,0,0,0.1);
  height: calc(100% / 3);
}

.side-image-wrapper:last-child {
  border-bottom: none;
}

.image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.asset-card:hover .image-content {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.25) 0%, rgba(15, 23, 42, 0) 45%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.asset-card:hover .image-overlay {
  opacity: 1;
}

/* Hiệu ứng tổng số ảnh */
.total-images-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.asset-card:hover .total-images-overlay {
  opacity: 1;
}

.total-images-badge {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 10px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

/* Placeholder cho ảnh trống */
.empty-image {
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-image-content {
  color: #dee2e6;
  font-size: 18px;
}

.action-button-group {
  flex: 1 1 100%;
}


.action-button.btn-success {
  box-shadow: inset 0 0 0 1px rgba(25, 135, 84, 0.12);
}

.action-button:focus {
  outline: none;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

/* Responsive */
@media (max-width: 575.98px) {
  .asset-card {
    height: auto;
    min-height: 380px;
  }

  .image-grid-container {
    height: 200px;
    flex-direction: column;
  }

  .main-image-col,
  .side-images-col {
    flex: none;
  }

  .main-image-col {
    height: 60%;
  }

  .side-images-col {
    height: 40%;
    flex-direction: row;
  }

  .side-image-wrapper {
    height: 100%;
    border-bottom: none;
    border-right: 1px solid rgba(0,0,0,0.1);
  }

  .side-image-wrapper:last-child {
    border-right: none;
  }

  .main-image-wrapper {
    border-right: none;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }

}

@media (min-width: 768px) {
  .card-content-compact {
    padding: 16px 20px 12px;
  }

  .compact-text {
    font-size: 12px;
  }

  .action-button {
    padding: 6px 12px;
    font-size: 13px;
  }

  .total-images-badge {
    padding: 6px 10px;
    font-size: 11px;
  }
}

</style>