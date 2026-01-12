<template>
  <section class="success-sales-section">
    <!-- Header với gradient và hiệu ứng -->
    <div class="modern-header">
      <!-- Background gradient với hiệu ứng -->
      <div class="header-bg">
        <div class="gradient-overlay"></div>
        <div class="particles-container">
          <div class="particle" v-for="n in 25" :key="n"></div>
        </div>
        <div class="floating-elements">
          <div class="floating-element el-1"></div>
          <div class="floating-element el-2"></div>
          <div class="floating-element el-3"></div>
          <div class="floating-element el-4"></div>
        </div>
      </div>

      <!-- Nội dung header -->
      <div class="header-content">
        <div class="section-header">
          <div class="title-wrapper">
            <h2 class="section-title">
              <span class="title-text">{{ title ? title : "DỰ ÁN ĐÃ BÁN THÀNH CÔNG" }}</span>
              <span class="title-highlight"></span>
            </h2>
            <div class="title-line"></div>
          </div>

          <p class="section-subtitle">
            <span class="subtitle-wrapper">
              <i class="fas fa-check-circle subtitle-icon"></i>
              <span class="subtitle-text">Tổng hợp các dự án đã bán thành công nhờ định giá đúng</span>
              <img class="sparkle" src="/imgs/logoTHG.png" alt="logo-ThienHaGroup" width="50px" height="50px">
            </span>
          </p>
        </div>

        <!-- Thống kê -->
        <div class="stats-overview">
          <div
              class="stat-card"
              v-for="(stat, index) in stats"
              :key="stat.title"
              :id="'stat' + index"
              :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="stat-icon-wrapper">
              <div class="stat-icon" v-html="stat.icon"></div>
              <div class="icon-glow"></div>
            </div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-glow"></div>
          </div>
        </div>
      </div>

      <!-- Wave separator -->
      <div class="wave-separator">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>

    <!-- Phần dự án -->
    <div class="container">
      <!-- Tiêu đề và chuyển đổi chế độ xem -->
      <div class="title-and-toggle">
        <h2 class="project-title">
          Một số dự án đã bán thành công trong năm {{ year }}
          <div class="title-underline"></div>
        </h2>

        <!-- Nút chuyển đổi chế độ xem -->
        <div class="view-toggle-container">
          <span class="view-toggle-label">Xem dạng:</span>
          <div class="view-toggle-buttons">
            <button
                @click="viewMode = 'grid'"
                :class="['view-toggle-btn', viewMode === 'grid' ? 'active' : '']"
                title="Xem dạng lưới"
            >
              <i class="fa-solid fa-grip"></i>
              <span class="btn-text">Lưới</span>
            </button>
            <button
                @click="viewMode = 'table'"
                :class="['view-toggle-btn', viewMode === 'table' ? 'active' : '']"
                title="Xem dạng bảng"
            >
              <i class="fa-solid fa-table"></i>
              <span class="btn-text">Bảng</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Chế độ xem lưới -->
      <div v-if="viewMode === 'grid'" class="sold-products-panel view-transition">
        <div class="grid-container">
          <div
              v-for="item in landAssets"
              :key="item.id"
              class="asset-card"
          >
            <div @click="goToDetail(item.id)" class="card-clickable">
              <div class="card-image-container">
                <div class="image-wrapper">
                  <img
                      :src="item.imageUrl || 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg'"
                      class="card-image"
                  />
                </div>
                <div class="card-badge card-type-badge">
                  <i :class="getAssetTypeIcon(item)"></i>
                  {{ getLoai(item) || '—' }}
                </div>
                <div v-if="'Đã bán' === item.status" class="sold-badge">
                  <img src="/imgs/sold-out.png" />
                </div>
                <div v-else-if="'Đã kiểm duyệt' === item.status" class="card-badge verified-badge">
                  <img src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/icon-kiem-duỵet.png" />
                </div>
              </div>

              <div class="card-content">
                <div class="card-address">
                  {{ formatWardCard(item.diaChi) }}, {{ formatProvinceCard(item.khuVuc) }}
                </div>
                <div class="card-date">
                  Ngày bán: {{ formatDate(item.capNhatNgay) }}
                </div>

                <div class="price-section">
                  <div class="price-main">
                    {{ formatMoneyVN(item.giaBan) }}
                    <div class="commission">
                      <span>H.hồng:</span>
                      <DotLottieVue
                          src="https://lottie.host/a94085b1-dc72-4753-88d0-4bdfad75c588/NgBvXtuOwE.lottie"
                          autoplay
                          loop
                          class="commission-animation"
                      />
                      <span class="commission-value">
                        {{ item.phiMoiGioi != null ? item.phiMoiGioi + '%' : '-' }}
                      </span>
                    </div>
                  </div>
                  <div class="card-tags">
                    <div class="unit-tag" :class="item.donVi === 'THG' ? 'thg-tag' : 'other-tag'">
                      {{ item.donVi }}
                    </div>
                    <span class="type-tag" :class="badgeClass(item.loaiMH)">
                      {{ item.loaiMH }}
                    </span>
                  </div>
                </div>

                <div class="price-comparison">
                  <span class="estimated-price">
                    <template v-if="!item.giaDinhGia">
                      Chưa định giá
                    </template>
                    <template v-else-if="item.giaDinhGia == -1.1">
                      *********** (Giá định)
                    </template>
                    <template v-else>
                      {{ formatMoneyVN(item.giaDinhGia) }} (Giá định)
                    </template>
                  </span>

                  <div class="view-stats">
                    <div class="stat-item">
                      <span>{{ item.soLuotXem ?? 0 }}</span>đã xem
                    </div>
                    <div class="stat-item">
                      <span>{{ item.soLuotThich ?? 0 }}</span>đã thích
                    </div>
                  </div>
                </div>

                <div class="owner-info-grid">
                  <div class="owner-info">
                    <div class="info-label">Người bán</div>
                    <div class="info-value">
                      {{ shortOwnerName(item.tenChuNha) || '—' }}
                    </div>
                  </div>
                  <div class="contact-info">
                    <div class="info-label">Liên hệ</div>
                    <div class="info-value">
                      <i class="fa-solid fa-phone phone-icon"></i>
                      {{ item.soDienThoai || '—' }}
                    </div>
                  </div>
                </div>

                <div class="property-details">
                  <div>
                    <div class="detail-label">Diện tích</div>
                    <div class="detail-value">{{ item.dtcn }}m²</div>
                  </div>
                  <div>
                    <div class="detail-label">Vị trí</div>
                    <div class="detail-value">{{ item.viTri || '—' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <button
                  @click="$router.push(buildSeoUrl(item))"
                  class="detail-button"
              >
                <i class="fa-regular fa-eye"></i>
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Chế độ xem bảng -->
      <!-- Chế độ xem bảng -->
      <div v-else class="sold-products-panel view-transition">
        <div class="table-container">
          <table class="data-table">
            <thead>
            <tr>
              <th>Thông tin</th>
              <th>Diện tích</th>
              <th>Giá bán</th>
              <th>Hoa hồng</th>
              <th>Giá định</th>
              <th>Ngày bán</th>
              <th>Thao tác</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in landAssets"
                :key="item.id"
                class="table-row"
            >
              <td>
                <div class="table-info">
                  <div class="table-image">
                    <img
                        :src="item.imageUrl || 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg'"
                        alt=""
                    >
                  </div>
                  <div class="table-details">
                    <div class="table-address">
                      {{ formatWardCard(item.diaChi) }}, {{ formatProvinceShort(item.khuVuc) }}
                    </div>
                    <div class="table-location">
                      {{ item.viTri || '—' }}
                    </div>
                    <div class="table-tags">
                      <div class="table-unit" :class="item.donVi === 'THG' ? 'thg-unit' : 'other-unit'">
                        {{ item.donVi }}
                      </div>
                      <span :class="['type-badge', badgeClass(item.loaiMH)]">
                  {{ item.loaiMH }}
                </span>
                      <div class="asset-type">
                        <i :class="getAssetTypeIcon(item)"></i>
                        <span>{{ getLoai(item) || '—' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div class="table-area">{{ item.dtcn }}m²</div>
              </td>
              <td>
                <div class="table-price">{{ formatMoneyVN(item.giaBan) }}</div>
              </td>
              <td>
                <div class="table-commission">
                  {{ item.phiMoiGioi != null ? item.phiMoiGioi + '%' : '-' }}
                </div>
              </td>
              <td>
                <div class="table-estimated">
                  {{ item.giaDinhGia ? formatMoneyVN(item.giaDinhGia) : '—' }}
                </div>
              </td>
              <td>
                <div class="table-date">{{ formatDate(item.capNhatNgay) }}</div>
                <div class="table-stats">
                  <div class="stat-item">
                    <i class="fa-regular fa-eye"></i>
                    {{ item.soLuotXem ?? 0 }}
                  </div>
                  <div class="stat-item">
                    <i class="fa-regular fa-heart"></i>
                    {{ item.soLuotThich ?? 0 }}
                  </div>
                </div>
              </td>
              <td>
                <div class="table-actions">
                  <button
                      @click="goToDetail(item.id)"
                      class="table-button"
                  >
                    <i class="fa-regular fa-eye"></i>
                    Chi tiết
                  </button>
                  <div class="table-owner">
                    <i class="fa-solid fa-user"></i>
                    {{ shortOwnerName(item.tenChuNha) || '—' }}
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>

          <div v-if="!landAssets.length" class="table-empty">
            <i class="fa-regular fa-folder-open"></i>
            <p>Chưa có dữ liệu phù hợp với bộ lọc hiện tại.</p>
          </div>
        </div>
      </div>

      <!-- Empty state chung -->
      <div v-if="!landAssets.length && viewMode === 'grid'" class="empty-state">
        <p>Chưa có dữ liệu phù hợp với bộ lọc hiện tại.</p>
      </div>

      <!-- Phân trang -->
      <div class="pagination-container">
        <!-- Hàng trên: Chọn năm + Pagination -->
        <div class="pagination-top">
          <!-- Chọn năm -->
          <div class="year-selector">
            <i class="fa-solid fa-calendar-days"></i>
            <select v-model="year" class="year-select">
              <option
                  v-for="y in [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]"
                  :key="y"
                  :value="y"
              >
                Năm {{ y }}
              </option>
            </select>
          </div>

          <!-- Pagination -->
          <div class="pagination-controls">
            <button
                @click="goToPage(0)"
                :disabled="page === 0"
                class="pagination-btn first-btn"
            >
              <i class="fa-solid fa-angles-left"></i>
            </button>

            <button
                @click="goToPage(page - 1)"
                :disabled="page === 0"
                class="pagination-btn prev-btn"
            >
              <i class="fa-solid fa-angle-left"></i>
            </button>

            <!-- Badge trang -->
            <div class="page-badge">
              <span>Trang {{ page + 1 }} / {{ totalPages }}</span>
            </div>

            <button
                @click="goToPage(page + 1)"
                :disabled="page >= totalPages - 1"
                class="pagination-btn next-btn"
            >
              <i class="fa-solid fa-angle-right"></i>
            </button>

            <button
                @click="goToPage(totalPages - 1)"
                :disabled="page >= totalPages - 1"
                class="pagination-btn last-btn"
            >
              <i class="fa-solid fa-angles-right"></i>
            </button>
          </div>
        </div>

        <!-- Hàng dưới: text hiển thị -->
        <div class="pagination-info">
          Hiển thị
          <span>{{ displayedRangeEnd }}</span>
          /
          <span>{{ totalRecords }}</span>
          bất động sản
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '/src/api/api.js';
import { useAuthStore } from '/src/stores/authStore.js';


import {buildSeoUrl} from "/src/assets/js/global.js";
const props = defineProps({
  title: String
});

// 👉 Thêm state cho chế độ xem
const viewMode = ref('grid'); // 'grid' hoặc 'table'

// 👉 năm hiện tại
const currentYear = new Date().getFullYear();
const year = ref(currentYear);

function shortOwnerName(fullName) {
  if (!fullName || typeof fullName !== 'string') return '—';

  const MAX_LEN = 'Nguyễn Khánh Linh'.length; // mốc chuẩn
  if (fullName.length <= MAX_LEN) return fullName;

  const parts = fullName.trim().split(/\s+/);

  // Nếu không đủ 3 chữ thì khỏi rút gọn
  if (parts.length < 3) return fullName;

  const firstInitial = parts[0][0]?.toUpperCase() || '';
  const secondInitial = parts[1][0]?.toUpperCase() || '';

  const restName = parts.slice(2).join(' ');

  return `${firstInitial}${secondInitial}. ${restName}`;
}

const stats = ref([
  { icon: '<i class="fa-solid fa-house"></i>', value: '1,250+', title: 'Bất động sản đã bán' },
  { icon: '<i class="fa-solid fa-star"></i>', value: '4.9/5', title: 'Đánh giá từ khách hàng' },
  { icon: '<i class="fa-solid fa-users"></i>', value: '2,500+', title: 'Khách hàng hài lòng' },
  { icon: '<i class="fa-solid fa-trophy"></i>', value: '15+', title: 'Giải thưởng uy tín' }
]);

const landAssets = ref([]);
const totalRecords = ref(0);

const isFilterMobile = ref(false);
const showFilterPanel = ref(true);

const page = ref(0);
const pageSize = ref(8);


const totalPages = ref(0);
const displayedRangeStart = computed(() => (totalRecords.value === 0 ? 0 : page.value * pageSize.value + 1));
const displayedRangeEnd = computed(() => Math.min((page.value + 1) * pageSize.value, totalRecords.value));

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;
};

const formatWardCard = (addressDetail) => {
  const raw = addressDetail || '';
  const parts = raw.split('/!!');
  return parts[1]?.trim() || '';
};

const formatProvinceCard = (province) => {
  if (typeof province !== 'string') return province || '';
  return province;
};

const formatProvinceShort = (province) => {
  if (!province || typeof province !== 'string') return province || '';
  return province
      .replace(/^Thành phố\s+/i, 'TP.')
      .replace(/^Tỉnh\s+/i, 'T.')
      .replace(/Thành phố Hồ Chí Minh/i, 'TP.HCM')
      .replace(/Hà Nội/i, 'HN');
};

const getAssetType = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const ketCau = (item.ketCau || '').toLowerCase();

  if (item.loaiTaiSan) {
    const map = {
      NHA: 'house',
      DAT: 'land',
      DATLON: 'land-large'
    };

    if (map[item.loaiTaiSan]) {
      return map[item.loaiTaiSan];
    }
  }

  const houseKeywords = [
    'lầu', 'trệt', 'tầng', 'hầm', 'gác',
    'nhà cấp', 'cấp 1', 'cấp 2', 'cấp 3', 'cấp 4',
    'biệt thự', 'villa', 'shophouse', 'townhouse', 'nhà',
    'chung cư', 'căn hộ', 'chcc', 'studio',
    'condotel', 'officetel', 'apartment', 'can ho',
    'chung cu', 'tower', 'block'
  ];

  if (houseKeywords.some((keyword) => ketCau.includes(keyword))) {
    return 'house';
  }

  if (dtcnValue > 1000) return 'land-large';

  return 'land';
};

const getLoai = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const structure = (item.structure || '').toLowerCase();

  if (item.loaiTaiSan) {
    const map = {
      NHA: 'Nhà',
      DAT: 'Đất',
      DATLON: 'Đất lớn'
    };

    if (map[item.loaiTaiSan]) {
      return map[item.loaiTaiSan];
    }
  }

  const houseKeywords = [
    'lầu', 'trệt', 'tầng', 'hầm', 'gác',
    'nhà cấp', 'cấp 1', 'cấp 2', 'cấp 3', 'cấp 4',
    'biệt thự', 'villa', 'shophouse', 'townhouse', 'nhà',
    'chung cư', 'căn hộ', 'chcc', 'studio',
    'condotel', 'officetel', 'apartment', 'can ho',
    'chung cu', 'tower', 'block'
  ];

  if (houseKeywords.some((keyword) => structure.includes(keyword))) {
    return 'Nhà';
  }

  if (dtcnValue > 10000) return 'Đất lớn';

  return 'Đất';
};

const getAssetTypeIcon = (item) => {
  const type = getAssetType(item);
  switch (type) {
    case 'house':
      return 'fa-solid fa-house-chimney';
    case 'land-large':
      return 'fa-solid fa-mountain-city';
    default:
      return 'fa-solid fa-map-location-dot';
  }
};

const badgeClass = (code) => {
  const map = {
    BN30N: 'badge-green',
    HTT: 'badge-yellow',
    HOPTAC: 'badge-orange'
  };

  return map[code] || 'badge-gray';
};

function formatMoneyVN(value) {
  if (value == null || isNaN(value)) return '0';
  const num = Number(value);

  if (num < 1_000_000) {
    return num.toLocaleString('vi-VN');
  }

  if (num < 1_000_000_000) {
    const trieu = num / 1_000_000;
    return `${trieu.toFixed(trieu % 1 === 0 ? 0 : 1)} triệu`;
  }

  const ty = num / 1_000_000_000;
  return `${ty.toFixed(ty % 1 === 0 ? 0 : 2)} tỷ`;
}

const goToPage = (p) => {
  if (p < 0) p = 0;
  if (p >= totalPages.value) p = totalPages.value - 1;
  page.value = p;
};

const updatePageSize = () => {
  if (pageSize.value < 1) pageSize.value = 1;
  page.value = 0;
};

function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

watch([page, year], () => {
  fetchFilteredAssets();
});

async function fetchFilteredAssets() {
  try {
    const res = await api.post(
        '/user.thg/product/user/da-ban',
        null,
        {
          params: {
            pageNo: page.value,
            year: year.value
          }
        }
    );

    landAssets.value = Array.isArray(res.data.content)
        ? res.data.content.map(item => ({
          ...item,
          imageUrl: item.imageUrl
              ? item.imageUrl
              : 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/default.jpg'
        }))
        : [];


    totalRecords.value = res.data.page.totalElements || 0;
    totalPages.value = res.data.page.totalPages || 0;

    const maxPage = Math.max(
        Math.ceil(totalRecords.value / pageSize.value) - 1,
        0
    );
    if (page.value > maxPage) {
      page.value = maxPage;
    }
  } catch (err) {
    console.error('Lỗi tải dữ liệu đã bán:', err);
  }
}

const debouncedFilter = debounce(fetchFilteredAssets, 300);

watch([page, pageSize], () => {
  debouncedFilter();
});

const auth = useAuthStore();
const router = useRouter();

const goToDetail = (id) => {
  router.push(`/san-pham-thien-ha/${id}`);
};

async function toggleLove(item) {
  localStorage.setItem('redirectAfterLogin', '/san-pham-thien-ha');
  if (!auth.accessToken) {
    router.push({
      path: '/dang-nhap'
    });
    return;
  }

  item.daThich = !item.daThich;
  item.soLuotThich = item.daThich ? item.soLuotThich + 1 : item.soLuotThich - 1;

  try {
    await api.post('/user.thg/product/user/love/toggle', null, {
      params: {
        idAsset: item.id
      }
    });
  } catch (e) {
    item.daThich = !item.daThich;
    item.soLuotThich = item.daThich ? item.soLuotThich + 1 : item.soLuotThich - 1;
  }
}

const updateViewportMode = () => {
  const w = typeof window !== 'undefined' ? window.innerWidth : 0;
  if (w < 736) {
    isFilterMobile.value = true;
    showFilterPanel.value = false;
  } else {
    isFilterMobile.value = false;
    showFilterPanel.value = true;
  }
};



onMounted(() => {
  updateViewportMode();
  fetchFilteredAssets();
  window.addEventListener('resize', updateViewportMode);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportMode);
});
</script>

<style scoped>
.success-sales-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #eef1ff 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
}

/* Tiêu đề và chuyển đổi */
.title-and-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 20px;
}

@media (min-width: 768px) {
  .title-and-toggle {
    flex-direction: row;
    align-items: flex-end;
  }
}

.view-toggle-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.view-toggle-label {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  display: none;
}

@media (min-width: 640px) {
  .view-toggle-label {
    display: block;
  }
}

.view-toggle-buttons {
  display: flex;
  background: #f1f5f9;
  border-radius: 24px;
  padding: 4px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.view-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-toggle-btn:hover {
  color: #475569;
  background: rgba(255, 255, 255, 0.5);
}

.view-toggle-btn.active {
  background: white;
  color: #7c3aed;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd6fe;
}

.view-toggle-btn .btn-text {
  display: none;
}

@media (min-width: 768px) {
  .view-toggle-btn .btn-text {
    display: inline;
  }
}

.view-toggle-btn i {
  font-size: 14px;
}

/* Project Title */
.project-title {
  text-align: center;
  color: #031358;
  margin-top: 60px;
  margin-bottom: 0;
  font-size: 2rem;
  font-weight: 700;
  position: relative;
  display: inline-block;
}

@media (min-width: 768px) {
  .project-title {
    text-align: left;
    font-size: 2.5rem;
  }
}

.title-underline {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #031358, #4f46e5);
  margin: 15px auto 0;
  border-radius: 2px;
  animation: underlineWidth 3s ease-in-out infinite;
}

@media (min-width: 768px) {
  .title-underline {
    margin: 15px 0 0 0;
  }
}

@keyframes underlineWidth {
  0%, 100% {
    width: 100px;
  }
  50% {
    width: 150px;
  }
}

/* Chế độ lưới (Grid) */
.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

@media (min-width: 640px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .grid-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

.asset-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.asset-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-clickable {
  cursor: pointer;
}

.card-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.image-wrapper {
  width: 100%;
  height: 100%;
  padding: 12px 12px 0 12px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.asset-card:hover .card-image {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  color: white;
  border-radius: 20px;
  padding: 4px 8px;
  font-size: 10px;
}

.card-type-badge {
  top: 16px;
  left: 24px;
  background: rgba(0, 0, 0, 0.2);
}

.card-type-badge i {
  font-size: 13px;
}

.sold-badge {
  position: absolute;
  top: 8px;
  right: 12px;
  width: 65px;
}

.verified-badge {
  top: 12px;
  right: 12px;
  width: 60px;
}

.card-content {
  padding: 12px;
}

.card-address {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.card-date {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
}

.price-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
}

.price-main {
  color: #dc2626;
  font-weight: 700;
  font-size: 16px;
}

.commission {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  margin-left: 8px;
}

.commission-animation {
  width: 20px;
  height: 26px;
  display: inline-block;
  position: relative;
  top: -5px;
}

.commission-value {
  font-weight: 600;
  color: #1d4ed8;
  font-size: 14px;
}

.card-tags {
  display: flex;
  align-items: center;
  gap: 4px;
}

.unit-tag {
  padding: 6px 10px;
  border-radius: 20px;
  color: white;
  font-weight: 550;
  font-size: 12.5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.thg-tag {
  background: #6A0DAD;
}

.other-tag {
  background: #0057D9;
}

.type-tag {
  padding: 6px 10px;
  border-radius: 20px;
  color: white;
  font-weight: 550;
  font-size: 12.5px;
}

.badge-green {
  background: #10b981;
}

.badge-yellow {
  background: #f59e0b;
}

.badge-orange {
  background: #f97316;
}

.badge-gray {
  background: #94a3b8;
}

.price-comparison {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0;
  font-size: 14px;
}

.estimated-price {
  font-weight: 600;
  color: #374151;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 16px;
}

.view-stats {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  font-size: 12px;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.stat-item span {
  font-weight: 600;
  color: #1e293b;
}

.owner-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 12px 0;
}

.owner-info,
.contact-info {
  padding: 8px;
  border-radius: 8px;
}

.owner-info {
  background: #dbeafe;
}

.contact-info {
  background: #f1f5f9;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 2px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.contact-info .info-value {
  color: #1d4ed8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.phone-icon {
  color: #3b82f6;
}

.property-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 12px;
  text-align: left;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.detail-value {
  font-weight: 700;
  color: #1e293b;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-footer {
  padding: 0 12px 12px 12px;
}

.detail-button {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(to right, #1e293b, #000000);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.detail-button:hover {
  opacity: 0.9;
}

.detail-button i {
  font-size: 14px;
}

/* Chế độ bảng (Table) */
.table-container {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.data-table thead {
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
}

.data-table th {
  padding: 16px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.data-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s ease;
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

.data-table td {
  padding: 16px 20px;
  vertical-align: top;
}

/* Các ô trong bảng */
.table-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 250px;
}

.table-image {
  flex-shrink: 0;
  width: 64px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.table-details {
  flex: 1;
  min-width: 0;
}

.table-address {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.table-location {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.table-unit {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
}

.table-unit[class*="THG"] {
  background: #6A0DAD;
}

.table-unit:not([class*="THG"]) {
  background: #0057D9;
}

.table-type {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 120px;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  width: fit-content;
}

.asset-type {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.asset-type i {
  color: #94a3b8;
  font-size: 12px;
}

.table-area {
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  font-size: 14px;
}

.table-price {
  font-weight: 700;
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 4px;
}

.table-commission {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.table-commission span {
  font-weight: 600;
  color: #1d4ed8;
}

.table-estimated {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.table-date {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;
}

.table-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.table-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #94a3b8;
}

.table-stats .stat-item i {
  font-size: 11px;
}

.table-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.table-button {
  padding: 6px 12px;
  background: linear-gradient(to right, #1e293b, #000000);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.table-button:hover {
  opacity: 0.9;
}

.table-button i {
  font-size: 12px;
}

.table-owner {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #64748b;
  justify-content: center;
}

.table-owner i {
  color: #94a3b8;
  font-size: 11px;
}

.table-empty {
  padding: 40px 20px;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
}

.table-empty i {
  font-size: 32px;
  color: #cbd5e1;
  margin-bottom: 12px;
  display: block;
}

.table-empty p {
  font-size: 14px;
  color: #64748b;
}

/* Empty state chung */
.empty-state {
  padding: 20px;
  text-align: center;
  background: white;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  color: #475569;
  margin-bottom: 16px;
}

/* Phân trang */
.pagination-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
}

.pagination-top {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

@media (min-width: 768px) {
  .pagination-top {
    justify-content: space-between;
  }
}

.year-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.year-selector i {
  color: #64748b;
}

.year-select {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  background: white;
  cursor: pointer;
  outline: none;
}

.year-select:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.pagination-btn {
  padding: 8px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  color: #8b5cf6;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-badge {
  padding: 8px 16px;
  background: linear-gradient(to right, #8b5cf6, #7c3aed);
  color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 600;
}

.pagination-info {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-align: center;
}

.pagination-info span {
  font-weight: 600;
  color: #1e293b;
}

/* Modern Header Styles (giữ nguyên) */
.modern-header {
  position: relative;
  overflow: hidden;
  padding-bottom: 120px;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
  #031358 0%,
  #012cd3 30%,
  #4f46e5 60%,
  #7c3aed 90%);
  animation: gradientMove 10s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradientMove {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
}

.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: particleFloat 20s infinite linear;
}

.particle:nth-child(even) {
  background: rgba(255, 255, 255, 0.15);
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.el-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation: floatElement 25s infinite ease-in-out;
}

.el-2 {
  width: 120px;
  height: 120px;
  bottom: 30%;
  right: 15%;
  animation: floatElement 30s infinite ease-in-out reverse;
}

.el-3 {
  width: 60px;
  height: 60px;
  top: 40%;
  right: 20%;
  animation: floatElement 20s infinite ease-in-out;
}

.el-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 5%;
  animation: floatElement 35s infinite ease-in-out;
}

@keyframes floatElement {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(30px, -30px) rotate(90deg);
  }
  50% {
    transform: translate(0, -60px) rotate(180deg);
  }
  75% {
    transform: translate(-30px, -30px) rotate(270deg);
  }
}

.header-content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 100px;
}

.title-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 25px;
}

.section-title {
  position: relative;
  z-index: 2;
  margin: 0;
}

.title-text {
  display: inline-block;
  font-size: 3.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 20px rgba(3, 19, 88, 0.3);
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 4px 20px rgba(3, 19, 88, 0.3);
  }
  50% {
    text-shadow: 0 4px 30px rgba(3, 19, 88, 0.5),
    0 0 40px rgba(255, 255, 255, 0.2);
  }
}

.title-highlight {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 10px;
  background: linear-gradient(90deg,
  transparent 0%,
  rgba(255, 255, 255, 0.5) 50%,
  transparent 100%);
  filter: blur(5px);
  animation: highlightMove 4s ease-in-out infinite;
}

@keyframes highlightMove {
  0%, 100% {
    opacity: 0.5;
    width: 200px;
  }
  50% {
    opacity: 0.8;
    width: 300px;
  }
}

.title-line {
  width: 150px;
  height: 4px;
  background: linear-gradient(90deg, transparent, #ffffff, transparent);
  margin: 20px auto 0;
  border-radius: 2px;
}

.section-subtitle {
  margin-top: 30px;
}

.subtitle-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 12px 24px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.subtitle-icon {
  color: #4f46e5;
  font-size: 1.2rem;
  animation: iconBounce 2s infinite;
}

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.subtitle-text {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 400;
}

.sparkle {
  animation: sparkleSpin 4s infinite;
  filter: brightness(0) invert(1);
}

@keyframes sparkleSpin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(0deg) scale(1.4);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 35px 25px;
  text-align: center;
  box-shadow:
      0 20px 40px rgba(3, 19, 88, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  animation: statCardAppear 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

@keyframes statCardAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card:hover {
  transform: translateY(-10px);
  box-shadow:
      0 30px 60px rgba(3, 19, 88, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.6);
}

.stat-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.stat-icon {
  font-size: 3rem;
  color: #4f46e5;
  position: relative;
  z-index: 2;
  animation: iconFloat 3s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.stat-value {
  font-size: 2.8rem;
  font-weight: 800;
  color: #031358;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #031358 0%, #4f46e5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-title {
  color: #5a6ab1;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.stat-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(79, 70, 229, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.stat-card:hover .stat-glow {
  opacity: 1;
}

.wave-separator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  color: #f8f9ff;
  transform: rotate(180deg);
}

.wave-separator svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Responsive */
@media (max-width: 1024px) {
  .title-text {
    font-size: 2.6rem;
  }

  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .stat-card {
    padding: 25px 20px;
  }

  .stat-value {
    font-size: 2.2rem;
  }

  .project-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .title-text {
    font-size: 2rem;
  }

  .subtitle-wrapper {
    flex-direction: column;
    gap: 8px;
    padding: 15px 20px;
  }

  .subtitle-text {
    font-size: 1.1rem;
    text-align: center;
  }

  .stats-overview {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 30px auto 0;
  }

  .header-content {
    padding: 100px 20px 0;
  }

  .modern-header {
    padding-bottom: 80px;
  }

  .wave-separator {
    height: 80px;
  }

  .project-title {
    font-size: 1.6rem;
    margin-top: 40px;
    text-align: center;
  }

  .title-and-toggle {
    align-items: center;
  }

  .title-underline {
    margin: 15px auto 0;
  }

  .floating-element {
    display: none;
  }
}

@media (max-width: 480px) {
  .title-text {
    font-size: 1.6rem;
  }

  .header-content {
    padding: 100px 15px 0;
  }

  .modern-header {
    padding-bottom: 60px;
  }

  .section-header {
    margin-bottom: 60px;
  }

  .stat-card {
    padding: 20px 15px;
  }

  .stat-value {
    font-size: 1.8rem;
  }

  .stat-icon {
    font-size: 2.2rem;
  }

  .project-title {
    font-size: 1.4rem;
  }

  .view-toggle-container {
    width: 100%;
    justify-content: center;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }
}

.data-table thead th {
  text-align: center;
  vertical-align: middle;
}

tbody td:nth-child(n+2) {
  text-align: center;
  vertical-align: middle;
}

tbody td:nth-child(n+2) .table-type {
  display: flex;
  flex-direction: column; /* nếu muốn badge trên, icon dưới */
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* CSS thêm vào phần table styles */
.table-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.table-unit {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
}

.table-unit.thg-unit {
  background: #6A0DAD;
}

.table-unit.other-unit {
  background: #0057D9;
}

.asset-type {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  margin-left: 4px;
}

.asset-type i {
  color: #94a3b8;
  font-size: 12px;
}

.table-commission {
  font-size: 14px;
  font-weight: 600;
  color: #1d4ed8;
  text-align: center;
}

.table-estimated {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-align: center;
}

/* Căn giữa các cột */
.data-table thead th {
  text-align: center;
  vertical-align: middle;
}

.data-table tbody td {
  text-align: center;
  vertical-align: middle;
}

.data-table tbody td:first-child {
  text-align: left;
}

</style>