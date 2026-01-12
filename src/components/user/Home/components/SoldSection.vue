<template>
  <section class="success-sales-section">
    <div class="ellipse-bg"></div>
    <div class="container">
      <!-- Phần elip trên cùng -->
      <div class="ellipse-section">
        <div class="section-header">
          <h2 class="section-title">{{ title ? title : "DỰ ÁN ĐÃ BÁN THÀNH CÔNG" }}</h2>
          <p class="section-subtitle">Tổng hợp các dự án đã bán thành công nhờ định giá đúng</p>
        </div>

        <div class="stats-overview">
          <div class="stat-card" v-for="(stat, index) in stats" :key="stat.title" :id="'stat' + index">
            <div class="stat-icon stat-value" v-html="stat.icon"></div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
          </div>
        </div>
      </div>

      <!-- Phần dự án -->
      <h2 class="project-title">Một số dự án đã bán thành công trong năm {{ year }}</h2>

      <div class="sold-products-panel">
        <!-- Bộ lọc nâng cao (chỉ chế độ thẻ) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          <div
            v-for="item in landAssets"
            :key="item.id"
            class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div @click="$router.push(buildSeoUrl(item))" style="cursor: pointer;">
              <div class="relative w-full overflow-hidden" style="height: 200px">
                <div class="relative w-full h-full px-3 pt-3 rounded-3 overflow-hidden aspect-[4/3] w-full">
                  <img
                    :src="item.imageUrl || 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg'"
                    class="w-full rounded-3 h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div class="absolute top-2 mt-3 ms-3 left-2 flex items-center gap-2">
                  <div
                    class="px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm text-white"
                    style="font-size: 10px !important;"
                  >
                    <i :class="getAssetTypeIcon(item)" style="font-size: 13px !important;"></i>
                    {{ getLoai(item) || '—' }}
                  </div>
                </div>
                <div
                  v-if="'Đã bán' === item.status"
                  class="absolute top-3 mr- ms-3 right-2 flex items-center gap-2"
                  style="width: 65px; position: absolute; top: 4px; right: 1px"
                >
                  <img src="/imgs/sold-out.png" />
                </div>
                <div
                  v-else-if="'Đã kiểm duyệt' === item.status"
                  class="absolute top-3 mr-0 ms-3 right-2 flex items-center gap-2"
                  style="width: 60px; position: absolute; top: 7px; right: 3px"
                >
                  <img src="https://s3.cloudfly.vn/thg-storage/uploads-public/icon-kiem-duỵet.png" />
                </div>
              </div>

              <div class="p-3 leading-tight text-slate-800">
                <div
                  class="font-semibold text-slate-900 mb-1"
                  style="
                    font-size: 15px;
                    font-weight: 700;
                    text-transform: uppercase;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  {{ formatWardCard(item.diaChi) }}, {{ formatProvinceCard(item.khuVuc) }}
                </div>
                <div class="font-semibold text-slate-500" style="font-size: 13px">
                  Ngày bán: {{ formatDate(item.capNhatNgay) }}
                </div>

                <div class="flex items-center justify-between mt-1">
                  <div style="color: #dc2626; font-weight: 700; font-size: 16px">
                    {{ formatMoneyVN(item.giaBan) }}
                    <div class="inline-flex items-center gap-1 text-[12px] text-slate-500 font-semibold">
                      <span>H.hồng:</span>
                      <DotLottieVue
                        src="https://lottie.host/a94085b1-dc72-4753-88d0-4bdfad75c588/NgBvXtuOwE.lottie"
                        autoplay
                        loop
                        style="width: 20px; height: 26px; display: inline-block; position: relative; top:-5px;"
                      />
                      <span class="font-semibold text-blue-700 text-[14px]">
                        {{ item.phiMoiGioi != null ? item.phiMoiGioi + '%' : '-' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <div
                      class="p-2.5 py-0.5 rounded-full text-white shadow-sm"
                      :class="item.donVi === 'THG' ? 'bg-[#6A0DAD]' : 'bg-[#0057D9]'"
                      style="font-weight: 550; font-size: 12.5px !important;"
                    >
                      {{ item.donVi }}
                    </div>
                    <span
                      class="px-2 py-0.5 rounded-full"
                      :class="badgeClass(item.loaiMH)"
                      style="font-weight: 550; font-size: 12.5px !important;"
                    >
                      {{ item.loaiMH }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-2 text-[14px]">
                  <span class="font-semibold text-slate-700 truncate max-w-[55%]">
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

                  <div class="flex items-center gap-3 text-slate-500 text-[12px] shrink-0">
                    <div class="flex items-center gap-1 font-medium">
                      <span class="font-medium text-slate-700">
                        {{ item.soLuotXem ?? 0 }}
                      </span>đã xem
                    </div>
                    <div class="flex items-center gap-1 font-medium">
                      <span class="font-medium text-slate-700">
                        {{ item.soLuotThich ?? 0 }}
                      </span>đã thích
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 mt-2">
                  <div class="p-2 bg-blue-50 rounded-lg">
                    <div class="text-[12px] text-slate-500 font-semibold">Người bán</div>
                    <div class="text-[14px] font-semibold text-slate-800 mt-0.5 truncate">
                      {{ shortOwnerName(item.tenChuNha) || '—' }}
                    </div>
                  </div>
                  <div class="p-2 bg-slate-50 rounded-lg">
                    <div class="text-[12px] text-slate-500 font-semibold">Liên hệ</div>
                    <div class="text-[14px] font-semibold text-blue-700 mt-0.5 flex items-center gap-1">
                      <i class="fa-solid fa-phone text-blue-500"></i>
                      {{ item.soDienThoai || '—' }}
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 mt-2 text-start">
                  <div>
                    <div class="text-[12px] text-slate-500 font-semibold">Diện tích</div>
                    <div class="font-bold">{{ item.dtcn }}m²</div>
                  </div>
                  <div>
                    <div class="text-[12px] text-slate-500 font-semibold">Vị trí</div>
                    <div class="text-slate-800 text-[13px] truncate font-bold">{{ item.viTri || '—' }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 px-3 pb-3">
              <button
                  @click="$router.push(buildSeoUrl(item))"
                class="flex-1 py-2.5 bg-gradient-to-r from-slate-900
                 to-black text-white rounded-full text-[14px] font-semibold flex items-center justify-center
                 gap-2 hover:opacity-90 transition-all"
              >
                <i class="fa-regular fa-eye text-sm"></i>
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        <div v-if="!landAssets.length" class="empty-state">
          <p>Chưa có dữ liệu phù hợp với bộ lọc hiện tại.</p>
        </div>

        <div class="w-full flex flex-col gap-3 p-3">

          <!-- Hàng trên: Chọn năm + Pagination -->
          <div class="w-full flex flex-wrap items-center justify-center md:justify-between gap-3">

            <!-- Chọn năm -->
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-calendar-days text-slate-500"></i>
              <select
                  v-model="year"
                  class="form-select w-auto rounded-lg border-slate-300
               text-sm font-semibold
               focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              >
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
            <div class="flex items-center gap-1 justify-center">

              <button
                  @click="goToPage(0)"
                  :disabled="page === 0"
                  class="p-2 rounded-lg text-slate-500
               hover:text-violet-600
               disabled:opacity-40 disabled:cursor-not-allowed
               transition-all"
              >
                <i class="fa-solid fa-angles-left"></i>
              </button>

              <button
                  @click="goToPage(page - 1)"
                  :disabled="page === 0"
                  class="p-2 rounded-lg text-slate-500
               hover:text-violet-600
               disabled:opacity-40 disabled:cursor-not-allowed
               transition-all"
              >
                <i class="fa-solid fa-angle-left"></i>
              </button>

              <!-- Badge trang -->
              <div
                  class="px-4 py-2 bg-gradient-to-r
               from-violet-600 to-purple-600
               text-white rounded-xl shadow-md"
              >
        <span class="text-sm font-semibold">
          Trang {{ page + 1 }} / {{ totalPages }}
        </span>
              </div>

              <button
                  @click="goToPage(page + 1)"
                  :disabled="page >= totalPages - 1"
                  class="p-2 rounded-lg text-slate-500
               hover:text-violet-600
               disabled:opacity-40 disabled:cursor-not-allowed
               transition-all"
              >
                <i class="fa-solid fa-angle-right"></i>
              </button>

              <button
                  @click="goToPage(totalPages - 1)"
                  :disabled="page >= totalPages - 1"
                  class="p-2 rounded-lg text-slate-500
               hover:text-violet-600
               disabled:opacity-40 disabled:cursor-not-allowed
               transition-all"
              >
                <i class="fa-solid fa-angles-right"></i>
              </button>
            </div>
          </div>

          <!-- Hàng dưới: text hiển thị -->
          <div class="text-sm text-slate-600 font-medium text-center">
            Hiển thị
            <span class="font-semibold text-slate-800">
      {{ displayedRangeEnd }}
    </span>
            /
            <span class="font-semibold text-slate-800">
      {{ totalRecords }}
    </span>
            bất động sản
          </div>

        </div>


      </div>
    </div>
  </section>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import addressData from '/src/assets/js/address.json';
import api from '/src/api/api.js';
import { useAuthStore } from '/src/stores/authStore.js';
import {buildSeoUrl} from "../../../../assets/js/global.js";

const props = defineProps({
  title: String
});
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
  return province.replace(/^Thành phố\s+/i, 'TP.').replace(/^Tỉnh\s+/i, 'T.');
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
    BN30N: 'bg-green-500 text-white font-semibold ',
    HTT: 'bg-yellow-500 text-white font-semibold',
    HOPTAC: 'bg-orange-500 text-white font-semibold'
  };

  return map[code] || 'bg-slate-400 text-white font-semibold';
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
              : 'https://s3.cloudfly.vn/thg-storage/uploads-public/default.jpg'
        }))
        : [];

    totalRecords.value = res.data.page.totalElements || 0;
    totalPages.value = res.data.page.totalPages || 0;
    console.log(res);
    const maxPage = Math.max(
        Math.ceil(totalRecords.value / pageSize.value) - 1,
        0
    );
    if (page.value > maxPage) {
      page.value = maxPage;
    }
    console.log( totalPages.value )
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
  overflow: visible;
  padding: 0 20px 60px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.ellipse-section {
  position: relative;
  margin-bottom: 80px;
  padding-top: 60px;
}

.ellipse-bg {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #031358 0%, #012cd3 100%);
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 160px;
  position: relative;
  z-index: 2;
}

.project-title {
  text-align: center;
  color: #031358;
  margin-top: 100px;
  margin-bottom: 50px;
  font-size: 42px;
  font-weight: 700;
}

.section-title {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.section-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
}

#stat0, #stat3 {
  transform: translateY(20px);
}

#stat1, #stat2 {
  transform: translateY(60px);
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px;
  position: relative;
  z-index: 3;
  margin-top: -100px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(3, 19, 88, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(3, 19, 88, 0.08);
  position: relative;
  z-index: 4;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(3, 19, 88, 0.2);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: #031358;
  margin-bottom: 8px;
}

.stat-title {
  color: #5a6ab1;
  font-size: 1rem;
  font-weight: 500;
}

.sold-products-panel {
  position: relative;
  z-index: 5;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-item {
  width: 100%;
}

@media (min-width: 640px) {
  .filter-item {
    width: calc(50% - 12px);
  }
}

@media (min-width: 768px) {
  .filter-item {
    width: calc(25% - 12px);
  }
}

@media (min-width: 1024px) {
  .filter-row {
    flex-wrap: nowrap;
  }

  .filter-item {
    flex: 1;
    min-width: 100px;
  }
}

.filter-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-title-wrap {
  display: flex;
  align-items: center;
}

.filter-title {
  font-weight: 700;
  font-size: 20px;
  color: white;
  text-shadow: 0 0 6px rgba(10, 10, 10, 0.9);
}

@media (min-width: 768px) {
  .filter-header {
    flex-direction: row;
    align-items: center;
  }

  .filter-title {
    font-size: 22px;
  }
}

.label-glow,
.icon-glow {
  text-shadow:
    0 0 6px rgba(9, 9, 9, 0.9),
    0 0 12px rgba(10, 10, 10, 0.8);
}

.empty-state {
  padding: 20px;
  text-align: center;
  background: white;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  color: #475569;
  margin-bottom: 16px;
}

@media (max-width: 1024px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
    margin-top: -50px;
  }

  .ellipse-bg {
    height: 500px;
  }

  #stat0, #stat1, #stat2, #stat3 {
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .ellipse-section {
    margin-bottom: 60px;
    padding-top: 40px;
  }

  .ellipse-bg {
    height: 400px;
  }

  .section-header {
    margin-bottom: 120px;
  }

  .stats-overview {
    grid-template-columns: 1fr;
    position: static;
    margin-top: 30px;
  }

  .stat-card {
    position: static;
  }
}

@media (max-width: 480px) {
  .ellipse-bg {
    height: 250px;
  }

  .section-header {
    margin-bottom: 100px;
  }
}
</style>
