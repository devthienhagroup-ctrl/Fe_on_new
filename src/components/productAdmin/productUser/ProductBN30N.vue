<template>
  <div v-if="shouldShow && items.length > 0" class="product-bn30n-container">
    <!-- Header mới với tiêu đề ở giữa -->
    <div class="header-container">
      <div class="header-center">
        <div class="title-wrapper">
          <div class="title-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <h1 class="main-title">BÁN NHANH 30 NGÀY</h1>
          <div class="subtitle">
          </div>
        </div>
      </div>

    </div>

    <!-- Main content layout -->
    <div class="main-content">
      <!-- Featured item (left - 55%) -->
      <div v-if="items[0]" class="featured-item" @click="$emit('view-detail', items[0])">
        <!-- Badge loại bất động sản -->
        <div class="property-type-badge" :class="getPropertyTypeClass(items[0])">
          <i :class="getPropertyTypeIcon(items[0])"></i>
          {{ getPropertyTypeText(items[0]) }}
        </div>

        <!-- Badge lock status -->
        <div class="lock-badge-featured-wrapper">
          <div v-if="!items[0].moKhoa" class="lock-badge-featured">
            <i class="fas fa-lock"></i>
            Đã khóa
          </div>
          <img v-if="items[0].status === 'Đã kiểm duyệt'"
               src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/icon-kiem-duỵet.png"
               style="width: 40px"
               alt="checked"
          />
        </div>

        <div class="featured-image">
          <img :src="items[0].imageUrl || defaultImage" :alt="items[0].tenChuNha"/>
        </div>

        <div class="featured-content">
          <!-- Title là địa chỉ chính -->
          <div class="featured-header">
            <div class="featured-title">

              <div class="premium-badge">
                <div class="premium-content">
                  <i class="fas fa-star"></i>
                  <span>NỔI BẬT</span>
                </div>
              </div>
              {{ formatFullAddress(items[0]) }}
            </div>
          </div>

          <div class="price-section" :title="getFormattedPriceTooltip(items[0])">
            <div class="price-fill"></div>
            <div class="main-price">
              {{ formatPriceNumber(items[0].giaBan) }}
              <span class="price-unit">VNĐ</span>
            </div>
          </div>
          <div class="price-info">
            <div class="commission" :class="{'hovered': isFeaturedHovered}">
              <i :class="isFeaturedHovered ? 'fa-solid fa-fire-flame-curved fa-flip' : 'fa-solid fa-fire-flame-curved'"></i>
              Hoa hồng: <strong>{{ items[0].phiMoiGioi != null ? items[0].phiMoiGioi + '%' : '-' }}</strong>
            </div>
            <div class="update-time">
              <i class="far fa-calendar-alt"></i>
              {{ formatDate(items[0].capNhatNgay) }}
            </div>
          </div>
          <div class="property-details">
            <div class="detail-item">
              <i class="fas fa-vector-square"></i>
              <span>Diện tích: {{ items[0].dtcn }}m²</span>
            </div>

            <div class="detail-item">
              <i class="fas fa-home"></i>
              <span>Loại: {{ items[0].loaiMH || '—' }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-layer-group"></i>
              <span>Vị trí: {{ getPropertyTitle(items[0]) || '—' }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-building"></i>
              <span>Đơn vị: {{ getDonVi(items[0].donVi) || '—' }}</span>
            </div>

          </div>

          <div class="owner-section">
            <div class="owner-info">
              <div class="owner-label">
                <i class="fas fa-user-tie"></i>
                Chủ nhà
              </div>
              <div class="owner-name">{{ items[0].tenChuNha || '—' }}</div>
            </div>
            <div class="contact-info">
              <div class="contact-label">
                <i class="fas fa-phone"></i>
                Liên hệ
              </div>
              <div class="phone-number">{{ items[0].soDienThoai || '—' }}</div>
            </div>
          </div>

          <div class="stats-section">
            <div class="stat-item">
              <i class="far fa-eye"></i>
              {{ items[0].soLuotXem || 0 }} lượt xem
            </div>
            <div class="stat-item">
              <i class="far fa-heart"></i>
              {{ items[0].soLuotThich || 0 }} lượt thích
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn view-detail-btn" @click.stop="$emit('view-detail', items[0])">
              <i class="fas fa-search"></i>
              Xem chi tiết
            </button>
            <button v-if="canRequestCollaboration(items[0])"
                    class="btn collab-btn"
                    @click.stop="$emit('open-collab', items[0])">
              <i class="fas fa-handshake"></i>
              Hợp tác
            </button>
          </div>
        </div>
      </div>

      <!-- Grid items (right - 45%) -->
      <div class="grid-items">
        <div v-for="(item, index) in items.slice(1, 5)" :key="item.id"
             class="grid-item" @click="$emit('view-detail', item)"
             @mouseenter="handleGridHover(item)"
             @mouseleave="handleGridLeave(item)">
          <!-- Property type badge -->
          <div class="property-type-badge-grid" :class="getPropertyTypeClass(item)">
            <i :class="getPropertyTypeIcon(item)"></i>
            {{ getPropertyTypeText(item) }}
          </div>

          <!-- Lock badge -->
          <div class="lock-badge-grid-wrapper">
            <div v-if="!item.moKhoa" class="lock-badge-grid">
              <i class="fas fa-lock"></i>
            </div>

            <img v-if="item.status === 'Đã kiểm duyệt'"
                 src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/icon-kiem-duỵet.png"
                 style="width: 32px"
                 alt="checked"
            />
          </div>

          <div class="grid-item-image">
            <img :src="item.imageUrl || defaultImage" :alt="item.tenChuNha"/>
          </div>

          <div class="grid-item-content">
            <!-- Title là địa chỉ -->
            <h4 class="grid-title">
              {{ formatFullAddress(item) }}
            </h4>

            <div class="grid-price" :title="getFormattedPriceTooltip(item)">
              {{ formatPriceNumber(item.giaBan) }}
              <span class="price-unit">VNĐ</span>
            </div>
            <div class="grid-commission" v-if="item.phiMoiGioi">
              <i class="fa-solid fa-fire-flame-curved"></i>
              Hoa hồng: <strong>{{ item.phiMoiGioi }}%</strong>
            </div>
            <div class="grid-details">
              <div class="detail">
                <i class="fas fa-vector-square"></i>
                {{ item.dtcn }}m²
              </div>
              <div class="detail">
                <i class="fas fa-home"></i>
                {{ item.loaiMH || '—' }}
              </div>
              <div class="detail">
                <i class="fas fa-map-marker-alt"></i>
                {{ item.viTri || formatShortAddress(item) }}
              </div>
              <div class="detail">
                <i class="fas fa-building"></i>
                {{ getDonVi(item.donVi) || '—' }}
              </div>
            </div>


            <div class="grid-property-info">
              <div class="info-item">
                <i class="fas fa-user"></i>
                {{ item.tenChuNha ? item.tenChuNha.substring(0, 12) + (item.tenChuNha.length > 12 ? '...' : '') : '—' }}
              </div>
              <div class="info-item">
                <i class="fas fa-phone"></i>
                {{
                  item.soDienThoai ? item.soDienThoai.substring(0, 12) + (item.soDienThoai.length > 12 ? '...' : '') : '—'
                }}
              </div>
            </div>

            <div class="grid-footer">
              <div class="grid-stats">
                <span class="stat">
                  <i class="far fa-eye"></i>
                  {{ item.soLuotXem || 0 }}
                </span>
                <button class="like-btn" @click.stop="$emit('toggle-love', item)">
                  <i :class="item.daThich ? 'fas fa-heart' : 'far fa-heart'"></i>
                  {{ item.soLuotThich || 0 }}
                </button>
              </div>
              <div class="grid-actions">
                <button class="icon-btn detail-expand"
                        @click.stop="$emit('view-detail', item)"
                        title="Xem chi tiết">
                  <i class="fas fa-search"></i>
                  <span class="expand-text">Chi tiết</span>
                </button>
                <button v-if="canRequestCollaboration(item)"
                        class="icon-btn collab collab-expand"
                        @click.stop="$emit('open-collab', item)"
                        title="Hợp tác">
                  <i class="fas fa-handshake"></i>
                  <span class="expand-text">Hợp tác</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Load more section -->
    <div v-if="items.length > 5" class="load-more-section">
      <div class="more-items-grid">
        <div v-for="(item, index) in displayedMoreItems" :key="item.id"
             class="grid-item" @click="$emit('view-detail', item)"
             @mouseenter="handleGridHover(item)"
             @mouseleave="handleGridLeave(item)">
          <!-- Property type badge -->
          <div class="property-type-badge-grid" :class="getPropertyTypeClass(item)">
            <i :class="getPropertyTypeIcon(item)"></i>
            {{ getPropertyTypeText(item) }}
          </div>

          <!-- Lock badge -->
          <div class="lock-badge-grid-wrapper">
            <div  v-if="!item.moKhoa" class="lock-badge-grid">
              <i class="fas fa-lock"></i>
            </div>

            <img v-if="item.status === 'Đã kiểm duyệt'"
                 src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/icon-kiem-duỵet.png"
                 style="width: 32px"
                 alt="checked"
            />
          </div>

          <div class="grid-item-image">
            <img :src="item.imageUrl || defaultImage" :alt="item.tenChuNha"/>
          </div>

          <div class="grid-item-content">
            <!-- Title là địa chỉ -->
            <h4 class="grid-title">
              {{ formatFullAddress(item) }}
            </h4>

            <div class="grid-price" :title="getFormattedPriceTooltip(item)">
              {{ formatPriceNumber(item.giaBan) }}
              <span class="price-unit">VNĐ</span>
            </div>

            <div class="grid-details">
              <div class="detail">
                <i class="fas fa-vector-square"></i>
                {{ item.dtcn }}m²
              </div>
              <div class="detail">
                <i class="fas fa-home"></i>
                {{ item.loaiMH || '—' }}
              </div>
              <div class="detail">
                <i class="fas fa-map-marker-alt"></i>
                {{ item.viTri || formatShortAddress(item) }}
              </div>
              <div class="detail">
                <i class="fas fa-building"></i>
                {{ getDonVi(item.donVi) || '—' }}
              </div>
            </div>

            <div class="grid-property-info">
              <div class="info-item">
                <i class="fas fa-user"></i>
                {{ item.tenChuNha ? item.tenChuNha.substring(0, 12) + (item.tenChuNha.length > 12 ? '...' : '') : '—' }}
              </div>
              <div class="info-item">
                <i class="fas fa-phone"></i>
                {{
                  item.soDienThoai ? item.soDienThoai.substring(0, 12) + (item.soDienThoai.length > 12 ? '...' : '') : '—'
                }}
              </div>
            </div>

            <div class="grid-footer">
              <div class="grid-stats">
                <span class="stat">
                  <i class="far fa-eye"></i>
                  {{ item.soLuotXem || 0 }}
                </span>
                <button class="like-btn" @click.stop="$emit('toggle-love', item)">
                  <i :class="item.daThich ? 'fas fa-heart' : 'far fa-heart'"></i>
                  {{ item.soLuotThich || 0 }}
                </button>
              </div>
              <div class="grid-actions">
                <button class="icon-btn detail-expand"
                        @click.stop="$emit('view-detail', item)"
                        title="Xem chi tiết">
                  <i class="fas fa-search"></i>
                  <span class="expand-text">Chi tiết</span>
                </button>
                <button v-if="canRequestCollaboration(item)"
                        class="icon-btn collab collab-expand"
                        @click.stop="$emit('open-collab', item)"
                        title="Hợp tác">
                  <i class="fas fa-handshake"></i>
                  <span class="expand-text">Hợp tác</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Link đơn giản "Xem thêm sản phẩm" ở dưới cùng -->
    <div v-if="hasMoreItems" class="simple-load-more-link">
      <a href="#" @click.prevent="handleLoadMore">
        <i class="fas fa-chevron-right"></i>
        Xem thêm sản phẩm
      </a>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {useAuthStore} from "/src/stores/authStore.js";

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
  }
});


// Thêm sự kiện load-more
const emit = defineEmits(['view-detail', 'open-collab', 'toggle-love', 'load-more']);

const authStore = useAuthStore();
const defaultImage = 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg';
// const loadCount = ref(0);
// const itemsPerLoad = 4;
const isFeaturedHovered = ref(false);
const gridHoverStates = ref({});

const displayedMoreItems = computed(() => {
  // Luôn hiển thị tất cả items từ thứ 6 trở đi
  return props.items.slice(5);
});

// Sửa hasMoreItems
const hasMoreItems = computed(() => {
  // Dựa trên total từ props thay vì items.length
  return props.items.length < props.total;
});

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
};

const formatShortAddress = (item) => {
  const address = item.diaChi || "";
  const parts = address.split("/!!");
  const ward = parts[1]?.trim() || "";
  const province = item.khuVuc || "";

  if (ward && province) {
    return `${ward}, ${province}`;
  } else if (ward) {
    return ward;
  } else if (province) {
    return province;
  }
  return "—";
};

const formatFullAddress = (item) => {
  const address = item.diaChi || "";
  const parts = address.split("/!!");
  const street = parts[0]?.trim() || "";
  const ward = parts[1]?.trim() || "";
  const district = parts[2]?.trim() || "";
  const province = item.khuVuc || "";

  let result = [];
  if (street) result.push(street);
  if (ward) result.push(ward);
  if (district) result.push(district);
  if (province) result.push(province);

  return result.length > 0 ? result.join(", ") : "—";
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

function formatPriceNumber(value) {
  if (value == null || isNaN(value)) return "0";
  return Number(value).toLocaleString("vi-VN");
}

const getFormattedPriceTooltip = (item) => {
  return formatMoneyVN(item.giaBan) + " VNĐ";
};

const getPropertyType = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const structure = (item.structure || "").toLowerCase();

  if (item.loaiTaiSan) {
    const map = {
      NHA: "house",
      DAT: "land",
      DATLON: "land-large"
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

  if (houseKeywords.some(keyword => structure.includes(keyword))) return "house";
  if (dtcnValue > 10000) return "land-large";
  return "land";
};

const getPropertyTypeClass = (item) => {
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

const getPropertyTypeIcon = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const structure = (item.structure || "").toLowerCase();

  // Ưu tiên loại tài sản từ backend
  if (item.loaiTaiSan) {
    const map = {
      NHA: "fas fa-house-chimney",       // Icon cho nhà
      DAT: "fas fa-map-location-dot",    // Icon cho đất thường
      DATLON: "fas fa-map-location-dot"  // Icon cho đất lớn (có thể dùng icon khác nếu muốn)
    };
    if (map[item.loaiTaiSan]) return map[item.loaiTaiSan];
  }

  // Từ khóa nhận diện nhà
  const houseKeywords = [
    "lầu", "trệt", "tầng", "hầm", "gác",
    "nhà cấp", "cấp 1", "cấp 2", "cấp 3", "cấp 4",
    "biệt thự", "villa", "shophouse", "townhouse", "nhà",
    "chung cư", "căn hộ", "chcc", "studio",
    "condotel", "officetel", "apartment", "can ho",
    "chung cu", "tower", "block"
  ];

  if (houseKeywords.some(keyword => structure.includes(keyword))) {
    return "fas fa-house-chimney";
  }

  if (dtcnValue > 10000) {
    return "fas fa-map-location-dot";  // Icon cho đất lớn
  }

  return "fas fa-map-location-dot";    // Icon cho đất thường
};

const getPropertyTypeText = (item) => {
  const type = getPropertyType(item);
  return type === 'house' ? 'Nhà' : 'Đất';
};

const getPropertyTitle = (item) => {
  const type = getPropertyTypeText(item);
  const area = item.dtcn ? `${item.dtcn}m²` : '';
  const location = item.viTri || formatShortAddress(item);

  return `${type} ${area} ${location}`.trim();
};

const getStatusClass = (status) => {
  const statusMap = {
    'Đã bán': 'sold',
    'Đang mở': 'available',
    'Đã khóa': 'locked',
    'Chờ duyệt': 'pending'
  };
  return statusMap[status] || 'available';
};

const canRequestCollaboration = (item) => {
  if (item.status === 'Đã bán') return false;
  if (item.isOwner) return false;
  if (item.daGuiYeuCau) return false;
  return true;
};

const loadMore = () => {
  loadCount.value++;
};

// Thêm hàm xử lý load more từ component cha
const handleLoadMore = () => {
  // Phát sự kiện để component cha xử lý
  emit('load-more');
};

const getDonVi = (donvi) => {
  if (donvi === 'DT') return 'Đối tác';
  if (donvi === 'THG') return 'Thiên Hà Group';
  return '-'
}

const handleGridHover = (item) => {
  gridHoverStates.value[item.id] = true;
};

const handleGridLeave = (item) => {
  gridHoverStates.value[item.id] = false;
};


// Type
const getAssetType = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const ketCau = (item.ketCau || "").toLowerCase();

  // Ưu tiên dữ liệu từ backend
  if (item.loaiTaiSan) {
    const map = {
      NHA: "house",
      DAT: "land",
      DATLON: "land-large"
    };

    if (map[item.loaiTaiSan]) {
      return map[item.loaiTaiSan];
    }
  }

  // Từ khóa nhận diện nhà (bao gồm cả chung cư, căn hộ)
  const houseKeywords = [
    // Nhà truyền thống
    "lầu", "trệt", "tầng", "hầm", "gác",
    "nhà cấp", "cấp 1", "cấp 2", "cấp 3", "cấp 4",
    "biệt thự", "villa", "shophouse", "townhouse", "nhà",

    // Chung cư & căn hộ → cũng tính là "nhà"
    "chung cư", "căn hộ", "chcc", "studio",
    "condotel", "officetel", "apartment", "can ho",
    "chung cu", "tower", "block"
  ];

  // Nếu kết cấu chứa từ khóa → là nhà
  if (houseKeywords.some(keyword => ketCau.includes(keyword))) {
    return "house";
  }

  // Nếu diện tích lớn → đất lớn
  if (dtcnValue > 1000) return "land-large";

  // Còn lại → đất
  return "land";
};

onMounted(() => {
  // Initialize any required functionality
});
</script>

<style scoped>
/* ===== LINK ĐƠN GIẢN "XEM THÊM SẢN PHẨM" ===== */
.simple-load-more-link {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.simple-load-more-link a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.simple-load-more-link a:hover {
  background-color: #f1f5f9;
  color: #2563eb;
}

.simple-load-more-link a i {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.simple-load-more-link a:hover i {
  transform: translateX(3px);
}

/* Responsive */
@media (max-width: 768px) {
  .simple-load-more-link a {
    font-size: 14px;
    padding: 6px 12px;
  }
}

@media (max-width: 576px) {
  .simple-load-more-link {
    margin-top: 20px;
    padding-top: 15px;
  }
}

/* ... GIỮ NGUYÊN TẤT CẢ CSS CÒN LẠI ... */

.product-bn30n-container {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

/* ===== HEADER STYLES ===== */
.header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  text-align: center;
}

.header-center {
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
}

.title-wrapper {
  position: relative;
  padding: 0;
}

.title-icon {
  font-size: 48px;
  color: #22c55e;
  margin-bottom: 15px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.main-title {
  margin: 0;
  font-size: 36px;
  font-weight: 900;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
  position: relative;
  display: inline-block;
}

.main-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
  border-radius: 2px;
}

.subtitle {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
}

.product-count {
  font-size: 18px;
  font-weight: 600;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  padding: 8px 20px;
  border-radius: 25px;
  border: 2px solid rgba(59, 130, 246, 0.2);
}

.time-badge {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 16px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.header-actions {
  margin-top: 20px;
}

.action-btn {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.view-all-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
}

.view-all-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.6);
}

/* ===== MAIN CONTENT LAYOUT ===== */
.main-content {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.featured-item {
  width: 55%;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
  position: relative;
}

.featured-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.featured-item:hover .price-fill {
  width: 100%;
}

.featured-item:hover .commission {
  transform: scale(1.05);
}

.featured-item:hover .commission i {
  font-size: 1.1em;
}

/* Property type badges với hiệu ứng kính mờ trong suốt */
.property-type-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}


.property-type-badge.house-type {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.property-type-badge.land-type {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* Hiệu ứng hover cho kính mờ */
.property-type-badge:hover {
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 6px 40px rgba(0, 0, 0, 0.15);
}

.lock-badge-featured-wrapper {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  gap: 5px;
}

.lock-badge-featured {

  padding: 8px 16px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Thêm icon riêng cho lock-badge để dễ nhận biết */
.lock-badge-featured::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(239, 68, 68, 0.3);
  border-radius: 25px;
  z-index: -1;
  backdrop-filter: blur(5px);
}

.lock-badge-featured:hover {
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.featured-image {
  position: relative;
  width: 100%;
  max-height: 400px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.featured-item:hover .featured-image img {
  transform: scale(1.08);
}

.featured-content {
  padding: 15px 30px;
}

.featured-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.featured-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;

  gap: 15px;
  flex-wrap: wrap;
}

/* Premium badge inline với title */
.premium-badge {
  background: linear-gradient(90deg, #ffd700, #ff8c00, #ffd700);
  background-size: 200% 100%;
  animation: gradientMove 2s infinite linear;
  padding: 8px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  display: inline-block;
  vertical-align: middle;
}

@keyframes gradientMove {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.premium-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.premium-content i {
  font-size: 14px;
}

.price-section {
  margin-bottom: 25px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 15px;
  border-left: 5px solid #dc2626;
  position: relative;
  cursor: help;
  overflow: hidden;
}

.price-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.2));
  transition: width 0.8s ease-out;
  z-index: 1;
}

.price-section:hover::after {
  content: attr(title);
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100;
}

.main-price {
  font-size: 32px;
  font-weight: 800;
  color: #dc2626;
  position: relative;
  z-index: 2;
}

.price-unit {
  font-size: 16px;
  color: #64748b;
  font-weight: normal;
}

.price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: #475569;
  margin-bottom: 20px;
}

.commission, .update-time {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.commission i {
  color: #ff6b35;
  transition: all 0.3s ease;
}

.commission.hovered i {
  color: #ff4500;
}

.update-time i {
  color: #3b82f6;
}

.property-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 25px;
  padding: 20px 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #475569;
  font-weight: 500;
}

.detail-item i {
  color: #3b82f6;
  width: 24px;
  font-size: 18px;
  text-align: center;
}

.owner-section {
  display: flex;
  gap: 30px;
  margin-bottom: 25px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 15px;
}

.owner-info, .contact-info {
  flex: 1;
}

.owner-label, .contact-label {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.owner-name, .phone-number {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.stats-section {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  padding: 15px;
  background: #f1f5f9;
  border-radius: 12px;
  justify-content: flex-end;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  color: white;
}

.status-badge.sold {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.status-badge.available {
  background: linear-gradient(135deg, #10b981, #059669);
}

.status-badge.locked {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.status-badge.pending {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.btn {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.view-detail-btn {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: white;
}

.collab-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* ===== GRID ITEMS STYLES ===== */
.grid-items {
  width: 45%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.grid-item {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* Property type badges với hiệu ứng kính mờ cho grid */
.property-type-badge-grid {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 10;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.property-type-badge-grid.house-type,
.property-type-badge-grid.land-type {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.property-type-badge-grid:hover {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.lock-badge-grid-wrapper {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;
  display: flex;
  gap: 5px;
  justify-content: center;
  align-items: center;
}

.lock-badge-grid {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.12);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.lock-badge-grid::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(239, 68, 68, 0.25);
  border-radius: 50%;
  z-index: -1;
  backdrop-filter: blur(4px);
}

.lock-badge-grid:hover {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
}


.grid-item-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.grid-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.grid-item-content {
  padding: 20px;
}

.grid-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.grid-price {
  font-size: 20px;
  font-weight: 800;
  color: #dc2626;
  margin-bottom: 7px;
  padding: 10px;
  background: #fef2f2;
  border-radius: 10px;
  cursor: help;
  position: relative;
}

.grid-price:hover::after {
  content: attr(title);
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  z-index: 100;
}

.grid-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.detail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
}

.detail i {
  color: #3b82f6;
  width: 16px;
}

.grid-property-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 15px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.grid-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
}

.grid-stats {
  display: flex;
  gap: 25px;
  align-items: center;

  color: #475569;
  font-size: 12px;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 36px;
}

.stat, .like-btn {

}

.like-btn:hover {
  background: #fee2e2;
  transform: scale(1.05);
}

.grid-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: none;
  background: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}


.icon-btn.detail-expand {
  background: #3b82f6;
  color: white;
}

.icon-btn.collab-expand {
  background: #22c55e;
  color: white;
}

.expand-text {
  opacity: 0;
  width: 0;
  transition: all 0.3s ease;
  font-size: 12px;
  font-weight: 600;
  margin-left: 0;
}

/* Thành phần CSS mới này */
.icon-btn:hover {
  width: 100px;
  justify-content: flex-start;
  padding-left: 12px;
  padding-right: 12px;
}

.icon-btn:hover .expand-text {
  opacity: 1;
  width: auto;
  margin-left: 8px;
}

.icon-btn:hover {
  transform: translateY(-2px) scale(1.05);
}

/* ===== LOAD MORE SECTION STYLES ===== */
.load-more-section {
  margin-top: 50px;
}

.more-items-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-bottom: 40px;
}

.more-item {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.more-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Property type badges với hiệu ứng kính mờ cho more items */
.property-type-badge-more {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.property-type-badge-more.house-type {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(29, 78, 216, 0.8));
}

.property-type-badge-more.land-type {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.8));
}

.lock-badge-more {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: rgba(239, 68, 68, 0.8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.more-item-image {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.more-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.more-item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.more-item:hover .more-item-overlay {
  opacity: 1;
}

.quick-view {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 18px;
  transition: transform 0.3s ease;
}

.more-item:hover .quick-view {
  transform: rotate(360deg);
}

.more-item-content {
  padding: 15px;
}

.more-title {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.more-price {
  font-size: 16px;
  font-weight: 800;
  color: #dc2626;
  margin-bottom: 12px;
  padding: 8px;
  background: #fef2f2;
  border-radius: 8px;
  cursor: help;
  position: relative;
}

.more-price:hover::after {
  content: attr(title);
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 10px;
  white-space: nowrap;
  z-index: 100;
}

.more-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.more-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.more-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.like-icon {
  border: none;
  background: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.like-icon:hover {
  transform: scale(1.3);
}

.views {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-badge-small {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 10px;
  font-weight: 700;
  color: white;
}

.status-badge-small.sold {
  background: #dc2626;
}

.status-badge-small.available {
  background: #10b981;
}

.status-badge-small.locked {
  background: #f59e0b;
}

.status-badge-small.pending {
  background: #3b82f6;
}

.load-more-btn-container {
  text-align: center;
  margin-top: 40px;
}

.load-more-btn {
  padding: 18px 45px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  font-size: 18px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.25);
}

.load-more-btn i:first-child {
  color: #22c55e;
}

/* ===== LINK ĐƠN GIẢN "XEM THÊM SẢN PHẨM" ===== */
.simple-load-more-link {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.simple-load-more-link a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.simple-load-more-link a:hover {
  background-color: #f1f5f9;
  color: #2563eb;
}

.simple-load-more-link a i {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.simple-load-more-link a:hover i {
  transform: translateX(3px);
}

/* ===== RESPONSIVE STYLES ===== */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }

  .featured-item,
  .grid-items {
    flex: 1;
    width: 100%;
  }

  .more-items-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid-items {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .property-details {
    grid-template-columns: 1fr;
  }

  .more-items-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-container {
    margin-bottom: 30px;
  }

  .main-title {
    font-size: 28px;
  }

  .title-icon {
    font-size: 36px;
  }

  .subtitle {
    flex-direction: column;
    gap: 10px;
  }

  .featured-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .grid-items {
    grid-template-columns: 1fr;
  }

  .more-items-grid {
    grid-template-columns: 1fr;
  }

  .owner-section {
    flex-direction: column;
    gap: 15px;
  }

  .price-info {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .stats-section {
    flex-wrap: wrap;
  }

  .grid-details {
    grid-template-columns: 1fr;
  }

  .simple-load-more-link a {
    font-size: 14px;
    padding: 6px 12px;
  }
}

@media (max-width: 576px) {
  .product-bn30n-container {
    padding: 15px;
  }

  .main-title {
    font-size: 24px;
  }

  .featured-image {
    max-height: 300px;
  }

  .featured-title {
    font-size: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .main-price {
    font-size: 24px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .load-more-btn {
    width: 100%;
    justify-content: center;
  }

  .grid-item:hover .icon-btn {
    width: 36px;
    justify-content: center;
    padding: 0;
  }

  .grid-item:hover .expand-text {
    display: none;
  }

  .simple-load-more-link {
    margin-top: 20px;
    padding-top: 15px;
  }
}

/* Thêm vào phần grid styles */
.grid-commission {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #ff6b35;
  font-weight: 500;
  margin-bottom: 10px;
  padding: 6px 10px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 8px;
}

.grid-commission i {
  color: #ff6b35;
  font-size: 14px;
}

/* Hoặc nếu thêm vào grid-details */
.grid-details .detail i.fa-fire-flame-curved {
  color: #ff6b35;
}
</style>