<template>
  <div v-if="shouldShow && items.length > 0" class="product-grid-container">
    <!-- Header -->
    <div class="header">
      <h2 class="title">
        Hàng Thị Trường
        <span class="count">({{ total }} sản phẩm)</span>
      </h2>
    </div>

    <!-- Grid container -->
    <div class="grid-wrapper">
      <div class="product-grid">
        <!-- Product cards - chỉ hiển thị 8 items đầu tiên -->
        <div v-for="item in visibleItems" :key="item.id" class="product-card">
          <div class="card-inner">
            <!-- Image section -->
            <div @click="$emit('view-detail', item)" class="image-container">
              <div class="image-wrapper">
                <div class="image-holder">
                  <img :src="item.imageUrl || defaultImage" class="product-image" />
                </div>

                <!-- Tags -->
                <div class="tags-container">
                  <!-- Asset type -->
                  <div class="tag asset-tag">
                    <i :class="getAssetTypeIcon(item)"></i>
                    {{ getLoai(item) || '—' }}
                  </div>

                  <!-- Lock status -->
                  <div class="tag lock-tag" :class="item.moKhoa ? 'unlocked' : 'locked'">
                    <i :class="item.moKhoa ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'"></i>
                    {{ item.moKhoa ? 'Đã mở' : 'Chưa mở' }}
                  </div>
                </div>

                <!-- Status badge - FIXED -->
                <div v-if="item.status === 'Đã kiểm duyệt'" class="status-badge">
                  <img src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/icon-kiem-duỵet.png"
                       alt="checked"
                       class="badge-image"
                  />
                </div>
              </div>

              <!-- Product info -->
              <div class="product-info">
                <!-- Address -->
                <div class="address">
                  {{ formatWardCard(item.diaChi) }}, {{ formatProvinceCard(item.khuVuc) }}
                </div>
                <div class="update-date">
                  Ngày cập nhật: {{ formatDate(item.capNhatNgay) }}
                </div>

                <!-- Price and commission -->
                <div class="price-section">
                  <div class="price-commission">
                    <span class="price">{{ formatMoneyVN(item.giaBan) }}</span>
                    <span class="commission-label">Hoa hồng: </span>
                    <DotLottieVue
                        src="https://lottie.host/a94085b1-dc72-4753-88d0-4bdfad75c588/NgBvXtuOwE.lottie"
                        autoplay
                        loop
                        class="lottie-animation"
                    />
                    <span class="commission-value">
                      {{ item.phiMoiGioi != null ? item.phiMoiGioi + '%' : '-' }}
                    </span>
                  </div>

                  <!-- Unit and type -->
                  <div class="unit-type-container">
                    <div class="unit-tag" :class="item.donVi === 'THG' ? 'thg' : 'other'">
                      {{ item.donVi }}
                    </div>
                    <span class="type-tag">
                      {{ item.loaiMH }}
                    </span>
                  </div>
                </div>

                <!-- Appraisal price and stats -->
                <div class="appraisal-section">
                  <span class="appraisal-price">
                    <template v-if="!item.giaDinhGia">Chưa định giá</template>
                    <template v-else-if="item.giaDinhGia == -1.1">*********** (Giá định)</template>
                    <template v-else>{{ formatMoneyVN(item.giaDinhGia) }} (Giá định)</template>
                  </span>
                  <div class="stats">
                    <div class="stat-item">
                      <span class="stat-value">{{ item.soLuotXem ?? 0 }}</span>đã xem
                    </div>
                    <div class="stat-item">
                      <span class="stat-value">{{ item.soLuotThich ?? 0 }}</span>đã thích
                    </div>
                  </div>
                </div>

                <!-- Owner and contact -->
                <div class="contact-grid">
                  <div class="owner-info">
                    <div class="label">Chủ nhà</div>
                    <div class="value">{{ item.tenChuNha || '—' }}</div>
                  </div>
                  <div class="contact-info">
                    <div class="label">Liên hệ</div>
                    <div class="value phone">
                      <i class="fa-solid fa-phone"></i>
                      {{ item.soDienThoai || '—' }}
                    </div>
                  </div>
                </div>

                <!-- Area and location -->
                <div class="details-grid">
                  <div class="area">
                    <div class="label">Diện tích</div>
                    <div class="value">{{ item.dtcn }}m²</div>
                  </div>
                  <div class="location">
                    <div class="label">Vị trí</div>
                    <div class="value">{{ item.viTri || '—' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="action-buttons">
              <button @click="$emit('view-detail', item)" class="view-detail-btn">
                <i class="fa-regular fa-eye"></i>
                Xem chi tiết
              </button>

              <!-- Nút Hợp tác (chỉ hiển thị khi đủ điều kiện) -->
              <button v-if="canRequestCollaboration(item)"
                      @click="$emit('open-collab', item)"
                      class="collaborate-btn">
                <i class="fa-solid fa-handshake"></i>
                Hợp tác
              </button>

              <button @click="$emit('toggle-love', item)" class="love-btn">
                <i :class="item.daThich ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load more indicator -->
      <div v-if="loading && items.length > 0" class="loading-indicator">
        <div class="spinner"></div>
        <p class="loading-text">Đang tải thêm...</p>
      </div>

      <!-- Xem thêm button -->
      <div v-if="showViewMore && items.length < total" class="view-more-container">
        <button @click="loadMoreItems" class="view-more-btn">
          Xem thêm <i class="fa-solid fa-chevron-down"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  shouldShow: {
    type: Boolean,
    default: true
  },
  collaborationEnabled: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['view-detail', 'toggle-love', 'load-more', 'open-collab']);

const itemsToShow = ref(8);
const defaultImage = 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg';

const visibleItems = computed(() => {
  return props.items.slice(0, itemsToShow.value);
});

const showViewMore = computed(() => {
  return itemsToShow.value < props.items.length && props.items.length < props.total;
});

const loadMoreItems = () => {
  itemsToShow.value += 8;
  if (itemsToShow.value >= props.items.length && props.items.length < props.total) {
    emit('load-more');
  }
};

const canRequestCollaboration = (item) => {
  if (item.status === 'Đã bán') return false;
  if (item.isOwner) return false;
  if (item.daGuiYeuCau) return false;
  return true;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`;
};

const formatWardCard = (addressDetail) => {
  const raw = addressDetail || "";
  const parts = raw.split("/!!");
  return parts[1]?.trim() || "";
};

const formatProvinceCard = (province) => {
  if (typeof province !== "string") return province || "";
  return province;
};

function formatMoneyVN(value) {
  if (value == null || isNaN(value)) return "0";
  const num = Number(value);

  if (num < 1_000_000) return num.toLocaleString("vi-VN");
  if (num < 1_000_000_000) {
    const trieu = num / 1_000_000;
    return `${trieu.toFixed(trieu % 1 === 0 ? 0 : 1)} triệu`;
  }

  const ty = num / 1_000_000_000;
  return `${ty.toFixed(ty % 1 === 0 ? 0 : 2)} tỷ`;
}

const getLoai = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const structure = (item.structure || "").toLowerCase();

  if (item.loaiTaiSan) {
    const map = {
      NHA: "Nhà",
      DAT: "Đất",
      DATLON: "Đất lớn"
    };
    if (map[item.loaiTaiSan]) return map[item.loaiTaiSan];
  }

  const houseKeywords = [
    "lầu", "trệt", "tầng", "hầm", "gác",
    "nhà cấp", "cấp 1", "cấp 2", "cấp 3", "cấp 4",
    "biệt thự", "villa", "shophouse", "townhouse", "nhà",
    "chung cư", "căn hộ", "chcc", "studio",
    "condotel", "officetel", "apartment", "can ho",
    "chung cu", "tower", "block"
  ];

  if (houseKeywords.some(keyword => structure.includes(keyword))) return "Nhà";
  if (dtcnValue > 10000) return "Đất lớn";
  return "Đất";
};

const getAssetTypeIcon = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const ketCau = (item.ketCau || "").toLowerCase();

  if (item.loaiTaiSan) {
    const map = {
      NHA: "house",
      DAT: "land",
      DATLON: "land-large"
    };
    if (map[item.loaiTaiSan]) {
      return map[item.loaiTaiSan] === "house" ? "fa-solid fa-house-chimney" :
          map[item.loaiTaiSan] === "land-large" ? "fa-solid fa-mountain-city" :
              "fa-solid fa-map-location-dot";
    }
  }

  const houseKeywords = [
    "lầu", "trệt", "tầng", "hầm", "gác",
    "nhà cấp", "cấp 1", "cấp 2", "cấp 3", "cấp 4",
    "biệt thự", "villa", "shophouse", "townhouse", "nhà",
    "chung cư", "căn hộ", "chcc", "studio",
    "condotel", "officetel", "apartment", "can ho",
    "chung cu", "tower", "block"
  ];

  if (houseKeywords.some(keyword => ketCau.includes(keyword))) return "fa-solid fa-house-chimney";
  if (dtcnValue > 1000) return "fa-solid fa-mountain-city";
  return "fa-solid fa-map-location-dot";
};
</script>

<style scoped>
/* Container */
.product-grid-container {
  margin-bottom: 2rem;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, rgba(234,179,8,0.45) 0%, rgba(234,179,8,0.32) 50%, rgba(234,179,8,0.16) 80%, rgba(234,179,8,0) 100%);
  border-left: 7px solid #facc15;
}

.count {
  font-size: 0.875rem;
  font-weight: normal;
  color: #475569;
}

/* Grid */
.grid-wrapper {
  position: relative;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

/* Product Card */
.product-card {
  flex: 0 0 auto;
  width: 100%;
}

.card-inner {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  height: 100%;
}

.card-inner:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

/* Image Section */
.image-container {
  cursor: pointer;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.image-holder {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0.75rem 0.75rem 0 0.75rem;
  border-radius: 0.25rem;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.25rem;
  transition: transform 0.3s ease;
}

.card-inner:hover .product-image {
  transform: scale(1.05);
}

/* Tags */
.tags-container {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  margin-left: 0.75rem;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  color: white;
  font-size: 10px !important;
}

.tag i {
  font-size: 13px !important;
}

.asset-tag {
  background-color: rgba(0, 0, 0, 0.2);
}

.lock-tag.unlocked {
  color: #86efac;
}

.lock-tag.locked {
  color: #fde047;
}

.lock-tag i {
  font-size: 10px !important;
}

/* Status Badge */
.status-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.badge-image {
  width: 27px;
  height: 27px;
  object-fit: contain;
}

/* Product Info */
.product-info {
  padding: 0.75rem;
  line-height: 1.25;
  color: #1e293b;
}

.address {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
  font-size: 15px;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.update-date {
  font-weight: 600;
  color: #64748b;
  font-size: 13px;
}

/* Price Section */
.price-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.price-commission {
  color: #dc2626;
  font-weight: 700;
  font-size: 16px;
}

.price {
  color: #dc2626;
}

.commission-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  margin-left: 0.25rem;
}

.lottie-animation {
  width: 20px;
  height: 26px;
  display: inline-block;
  vertical-align: bottom;
  margin: 0 0.125rem;
}

.commission-value {
  font-weight: 600;
  color: #1d4ed8;
  font-size: 14px;
}

.unit-type-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.unit-tag {
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  color: white;
  font-weight: 550;
  font-size: 12.5px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.unit-tag.thg {
  background-color: #6A0DAD;
}

.unit-tag.other {
  background-color: #0057D9;
}

.type-tag {
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background-color: #eab308;
  color: white;
  font-weight: 550;
  font-size: 12.5px;
}

/* Appraisal Section */
.appraisal-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 14px;
}

.appraisal-price {
  font-weight: 600;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 55%;
}

.stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-size: 12px;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
}

.stat-value {
  font-weight: 500;
  color: #374151;
}

/* Contact Grid */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.owner-info,
.contact-info {
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.owner-info {
  background-color: #eff6ff;
}

.contact-info {
  background-color: #f8fafc;
}

.label {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.value {
  font-size: 14px;
  font-weight: 600;
  margin-top: 0.125rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.owner-info .value {
  color: #1e293b;
}

.contact-info .value {
  color: #1d4ed8;
}

.phone {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.phone i {
  color: #3b82f6;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
  text-align: left;
}

.area,
.location {
  margin: 0;
}

.area .value {
  font-weight: bold;
}

.location .value {
  color: #1e293b;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.75rem 0.75rem;
}

.view-detail-btn {
  flex: 1;
  padding: 0.625rem;
  background: linear-gradient(to right, #0f172a, #000);
  color: white;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s ease;
  border: none;
  cursor: pointer;
}

.view-detail-btn:hover {
  opacity: 0.9;
}

.collaborate-btn {
  flex: 1;
  padding: 0.625rem;
  background-color: #0030ff;
  color: white;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s ease;
  border: none;
  cursor: pointer;
}

.collaborate-btn:hover {
  opacity: 0.9;
}

.love-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: #f1f5f9;
  color: #1e293b;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  border: none;
  cursor: pointer;
}

.love-btn:hover {
  background-color: #e2e8f0;
}

.love-btn i {
  font-size: 1rem;
}

.love-btn i.fa-solid.fa-heart {
  color: black;
}

/* Loading Indicator */
.loading-indicator {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border-bottom: 2px solid #eab308;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.loading-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
}

/* View More Button */
.view-more-container {
  margin-top: 1.5rem;
  text-align: center;
}

.view-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.view-more-btn:hover {
  color: #1e40af;
}

.view-more-btn i {
  font-size: 0.75rem;
}

/* Animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>