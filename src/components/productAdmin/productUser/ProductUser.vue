<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-3 py-3" style="padding-top: 90px!important;">
    <div class="max-w-[1600px] mx-auto">
      <!-- Bộ lọc -->
      <ProductFilter
          v-model:searchQuery="searchQuery"
          v-model:filterGiaRange="filterGiaRange"
          v-model:filterProvince="filterProvince"
          v-model:filterWard="filterWard"
          v-model:filterLoaiMH="filterLoaiMH"
          v-model:filterViTri="filterViTri"
          v-model:filterUnlock="filterUnlock"
          v-model:filterLove="filterLove"
      >
        <template #view-mode-toggle>
          <div class="filter-actions">
            <button
                @click="viewMode = 'card'"
                :class="[
                'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2',
                viewMode === 'card'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              ]"
            >
              <i class="fa-solid fa-grip text-sm"></i>
              <span class="text-sm font-medium">Slider</span>
            </button>

            <button
                @click="viewMode = 'table'"
                :disabled="isMobile"
                :class="[
                'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2',
                viewMode === 'table'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50',
                isMobile ? 'opacity-60 cursor-not-allowed' : ''
              ]"
            >
              <i class="fa-solid fa-table text-sm"></i>
              <span class="text-sm font-medium">Bảng</span>
            </button>
          </div>
        </template>
      </ProductFilter>

      <!-- Hiển thị theo chế độ -->
      <template v-if="viewMode === 'table'">
        <!-- Bảng dữ liệu -->
        <ProductTable
            :land-assets="landAssets"
            :page="page"
            :page-size="pageSize"
            :total-records="totalRecords"
            :total-pages="totalPages"
            @go-to-page="goToPage"
            @update-page-size="updatePageSize"
            @toggle-love="toggleLove"
            @open-collab="openCollabModal"
            @view-detail="goToDetail"
        />
      </template>

      <template v-else>
        <!-- Loading hiệu ứng cho toàn bộ page -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p class="text-lg font-semibold text-slate-700">Đang tải sản phẩm...</p>
          </div>
        </div>

        <!-- Hiển thị slider theo loại mặt hàng -->
        <div v-else>
          <!-- Loading skeleton cho BN30N khi đang load more -->
          <div v-if="bn30nLoading && bn30nItems.length === 0 && shouldShowCategory('BN30N')" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
              <div class="flex gap-2">
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div class="flex gap-4">
              <div v-for="i in 4" :key="i" class="slider-item">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 animate-pulse">
                  <div class="bg-slate-300 h-48 rounded-xl mb-4"></div>
                  <div class="space-y-3">
                    <div class="h-4 bg-slate-300 rounded"></div>
                    <div class="h-4 bg-slate-300 rounded w-2/3"></div>
                    <div class="h-4 bg-slate-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- BN30N - Bán nhanh 30 ngày -->
          <ProductBN30N
              :items="bn30nItems"
              :total="bn30nTotal"
              :loading="bn30nLoading"
              :should-show="shouldShowCategory('BN30N')"
              @view-detail="goToDetail"
              @open-collab="openCollabModal"
              @toggle-love="toggleLove"
              @load-more="loadMoreCategory('BN30N')"
          />

          <!-- Loading skeleton cho HOPTAC khi đang load more -->
          <div v-if="hoptacLoading && hoptacItems.length === 0 && shouldShowCategory('HOPTAC')" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
              <div class="flex gap-2">
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div class="flex gap-4">
              <div v-for="i in 4" :key="i" class="slider-item">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 animate-pulse">
                  <div class="bg-slate-300 h-48 rounded-xl mb-4"></div>
                  <div class="space-y-3">
                    <div class="h-4 bg-slate-300 rounded"></div>
                    <div class="h-4 bg-slate-300 rounded w-2/3"></div>
                    <div class="h-4 bg-slate-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- HOPTAC - Hàng hợp tác -->
          <ProductHOPTAC
              :items="hoptacItems"
              :total="hoptacTotal"
              :loading="hoptacLoading"
              :should-show="shouldShowCategory('HOPTAC')"
              @open-collab="openCollabModal"
              @view-detail="goToDetail"
              @toggle-love="toggleLove"
              @load-more="loadMoreCategory('HOPTAC')"
          />

          <!-- Loading skeleton cho HTT khi đang load more -->
          <div v-if="httLoading && httItems.length === 0 && shouldShowCategory('HTT')" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
              <div class="flex gap-2">
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div class="flex gap-4">
              <div v-for="i in 4" :key="i" class="slider-item">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 animate-pulse">
                  <div class="bg-slate-300 h-48 rounded-xl mb-4"></div>
                  <div class="space-y-3">
                    <div class="h-4 bg-slate-300 rounded"></div>
                    <div class="h-4 bg-slate-300 rounded w-2/3"></div>
                    <div class="h-4 bg-slate-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- HTT - Hàng thị trường -->
          <ProductThiTruong
              :items="httItems"
              :total="httTotal"
              :loading="httLoading"
              :should-show="shouldShowCategory('HTT')"
              @open-collab="openCollabModal"
              @view-detail="goToDetail"
              @toggle-love="toggleLove"
              @load-more="loadMoreCategory('HTT')"
          />

          <!-- No data message -->
          <div v-if="!hasData && !loading" class="text-center py-12">
            <div class="text-slate-400 mb-4">
              <i class="fa-solid fa-inbox text-5xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-slate-700 mb-2">Không có sản phẩm nào</h3>
            <p class="text-slate-500">Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn.</p>
          </div>
        </div>
      </template>
    </div>
  </div>

  <!-- Modal hợp tác -->
  <div v-if="showCollabModal" class="collab-overlay">
    <div class="collab-modal">
      <!-- Header -->
      <div class="collab-header">
        <div class="collab-icon">🤝</div>
        <div class="collab-title-wrap">
          <h3 class="collab-title">Gửi lời đề nghị hợp tác</h3>
          <p class="collab-subtitle">
            Sản phẩm:
            <span>
            {{ formatWardCard(selectedAsset?.diaChi) }},
            {{ formatProvinceCard(selectedAsset?.khuVuc) }}
          </span>
          </p>
        </div>
      </div>

      <!-- Content -->
      <div class="collab-body">
        <p class="text-primary fs-6 fw-bold">Chúng tôi sẽ công khai cho bạn tất cả thông tin và cam kết trã phí môi giới đầy đủ như đã công bố!</p>
        <label class="collab-label">Lý do bạn muốn hợp tác</label>

        <textarea
            v-model="collabReason"
            rows="3"
            placeholder="Ví dụ: Tôi có khách đang tìm mua khu vực này, đã từng chốt nhiều giao dịch tương tự..."
            class="collab-textarea"
        ></textarea>

        <!-- Gợi ý -->
        <div class="collab-hints">
          <button
              v-for="hint in collabHints"
              :key="hint"
              @click="collabReason = hint"
              class="collab-hint-btn"
          >
            {{ hint }}
          </button>
        </div>

        <!-- Cam kết -->
        <label class="collab-policy">
          <input type="checkbox" v-model="agreePolicy" />
          Tôi cam kết tuân thủ giá và quy định của sản phẩm
        </label>
      </div>

      <!-- Footer -->
      <div class="collab-footer">
        <button class="btn-cancel" @click="closeCollabModal">
          Hủy
        </button>
        <button
            class="btn-submit"
            :disabled="!collabReason || !agreePolicy"
            @click="submitCollaboration"
        >
          Gửi đề nghị
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { useAuthStore } from "/src/stores/authStore.js";
import { useSidebarStore } from "/src/stores/sidebarStore.js";
import addressData from "/src/assets/js/address.json";
import api from "/src/api/api.js";
import { buildSeoUrl } from "../../../assets/js/global.js";
import { showCenterWarning, showCenterSuccess, showCenterError } from "../../../assets/js/alertService.js";

// Import components
import ProductFilter from './ProductFilter.vue';
import ProductTable from './ProductTable.vue';
import ProductBN30N from "./ProductBN30N.vue";
import ProductHOPTAC from "./ProductHOPTAC.vue";
import ProductThiTruong from "./ProductThiTruong.vue";


// Data
const landAssets = ref([]);
const totalRecords = ref(0);

// Slider data
const bn30nItems = ref([]);
const hoptacItems = ref([]);
const httItems = ref([]);

// Pagination for sliders
const bn30nPage = ref(0);
const hoptacPage = ref(0);
const httPage = ref(0);
const pageSizeSlider = ref(5);
const pageSizeThiTruong = ref(8);
const loading = ref(false);
const bn30nLoading = ref(false);
const hoptacLoading = ref(false);
const httLoading = ref(false);

// Totals
const bn30nTotal = ref(0);
const hoptacTotal = ref(0);
const httTotal = ref(0);

// Filters
const filterGiaRange = ref("");
const filterProvince = ref("");
const filterWard = ref("");
const filterStreet = ref("");
const filterLoaiMH = ref("");
const filterDTCN = ref("");
const filterViTri = ref("");
const filterCreateDate = ref("");
const filterUpdateDate = ref("");
const searchQuery = ref("");
const filterUnlock = ref("");
const filterStatus = ref("Chưa bán");
const filterLove = ref(null);

// Pagination
const page = ref(0);
const pageSize = ref(8);
const viewMode = ref('card');
const isMobile = ref(false);
const totalPages = computed(() =>
    Math.ceil(totalRecords.value / pageSize.value || 1)
);

// Modal
const showCollabModal = ref(false);
const selectedAsset = ref(null);
const collabReason = ref("");
const agreePolicy = ref(false);
const collabHints = [
  "Tôi có khách đang tìm mua khu vực này",
  "Am hiểu giá thị trường và khu vực",
  "Đã từng bán nhiều sản phẩm tương tự",
  "Có nguồn khách sẵn, có thể chốt nhanh"
];

// Stores
const authStore = useAuthStore();
const auth = useAuthStore();
const router = useRouter();
const sidebar = useSidebarStore();

// Helper functions
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
  let ward = parts[1]?.trim() || "";
  return ward;
};

const formatProvinceCard = (province) => {
  if (typeof province !== "string") return province || "";
  return province;
};

const formatAddressDetail = (diaChi) => {
  let raw = diaChi || "";
  let clean = raw.split("/!!")[0].trim();
  clean = clean.replace(/đường/iu, "Đ.");
  return clean;
};

const formatWard = (addressDetail) => {
  const raw = addressDetail || "";
  const parts = raw.split("/!!");
  let ward = parts[1]?.trim() || "";
  return ward
      .replace(/^Phường\s+/i, "P. ")
      .replace(/^Xã\s+/i, "X. ")
      .replace(/^Thị trấn\s+/i, "TT. ");
};

const formatProvince = (province) => {
  if (typeof province !== "string") return province || "";
  return province
      .replace(/^Thành phố\s+/i, "TP.")
      .replace(/^Tỉnh\s+/i, "T.");
};

const formatProvinceShort = (province) => {
  if (!province || typeof province !== "string") return province || "";
  return province
      .replace(/^Thành phố\s+/i, "TP.")
      .replace(/^Tỉnh\s+/i, "T.");
};

const getAssetType = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const ketCau = (item.ketCau || "").toLowerCase();

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

  if (houseKeywords.some(keyword => ketCau.includes(keyword))) return "house";
  if (dtcnValue > 1000) return "land-large";
  return "land";
};

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
  const type = getAssetType(item);
  switch (type) {
    case "house": return "fa-solid fa-house-chimney";
    case "land-large": return "fa-solid fa-mountain-city";
    default: return "fa-solid fa-map-location-dot";
  }
};

const catChuoi = (text, max = 11) => {
  if (!text) return '-';
  return text.length > max ? text.slice(0, max) + '...' : text;
};

const getAssetTypeColor = (item) => {
  const type = getAssetType(item);
  switch (type) {
    case "house": return "text-emerald-700";
    case "land-large": return "text-rose-700";
    default: return "text-blue-700";
  }
};

const badgeClass = (code) => {
  const map = {
    BN30N: "bg-green-500 text-white font-semibold",
    HTT: "bg-yellow-500 text-white font-semibold",
    HOPTAC: "bg-orange-500 text-white font-semibold",
  };
  return map[code] || "bg-slate-400 text-white font-semibold";
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

// Computed
const provinces = computed(() => addressData.map(x => x.name));

const wards = computed(() => {
  if (!filterProvince.value) return [];
  const province = addressData.find(p => p.name === filterProvince.value);
  if (!province || !Array.isArray(province.wards)) return [];
  return province.wards.map(w => w.name);
});

const shouldShowCategory = (category) => {
  if (!filterLoaiMH.value) return true;
  return filterLoaiMH.value === category;
};

const hasData = computed(() => {
  return bn30nItems.value.length > 0 || hoptacItems.value.length > 0 || httItems.value.length > 0;
});

// Methods
const updateViewportMode = () => {
  isMobile.value = typeof window !== 'undefined' && window.innerWidth < 1050;
  if (isMobile.value) {
    viewMode.value = 'card';
  }
};

const goToDetail = (item) => {
  router.push(buildSeoUrl(item));
};

const goToPage = (p) => {
  if (p < 0) p = 0;
  if (p >= totalPages.value) p = totalPages.value - 1;
  page.value = p;
};

const updatePageSize = () => {
  if (pageSize.value < 1) pageSize.value = 1;
  page.value = 0;
};

// Debounce
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const debouncedFilter = debounce(fetchFilteredAssets, 300);

// API calls
function processItems(items) {
  return Array.isArray(items)
      ? items.map(item => ({
        ...item,
        imageUrl: item.imageUrl
            ? item.imageUrl
            : "https://s3.cloudfly.vn/thg-storage/uploads-public/default.jpg"
      }))
      : [];
}

async function fetchFilteredAssets() {
  if (viewMode.value !== 'table') return;

  const payload = {
    trangSo: page.value,
    soDong: pageSize.value,
    tuKhoa: searchQuery.value || null,
    mucGia: filterGiaRange.value || null,
    phuongXa: filterWard.value || null,
    khuVuc: filterProvince.value || null,
    viTri: filterViTri.value || null,
    loaiMH: filterLoaiMH.value || null,
    moKhoa: filterUnlock.value === "" ? null : filterUnlock.value === "yes",
    trangThai: filterStatus.value || null,
    daThich: filterLove.value || null,
  };

  try {
    const res = await api.post(
        "/user.thg/product/user/bang-du-lieu",
        payload
    );

    landAssets.value = processItems(res.data.content || []);
    totalRecords.value = res.data.page?.totalElements || 0;
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
  }
}

async function fetchSliderData() {
  loading.value = true;

  try {
    const basePayload = {
      trangSo: 0,
      soDong: pageSizeSlider.value,
      tuKhoa: searchQuery.value || null,
      mucGia: filterGiaRange.value || null,
      phuongXa: filterWard.value || null,
      khuVuc: filterProvince.value || null,
      viTri: filterViTri.value || null,
      moKhoa: filterUnlock.value === "" ? null : filterUnlock.value === "yes",
      trangThai: filterStatus.value || null,
      daThich: filterLove.value || null,
    };

    if (!filterLoaiMH.value) {
      const [bn30nRes, hoptacRes, httRes] = await Promise.all([
        api.post("/user.thg/product/user/bang-du-lieu", {
          ...basePayload,
          loaiMH: "BN30N",
        }),
        api.post("/user.thg/product/user/bang-du-lieu", {
          ...basePayload,
          loaiMH: "HOPTAC",
        }),
        api.post("/user.thg/product/user/bang-du-lieu", {
          ...basePayload,
          soDong: pageSizeThiTruong.value,
          loaiMH: "HTT",
        }),
      ]);

      bn30nItems.value = processItems(bn30nRes.data.content || []);
      hoptacItems.value = processItems(hoptacRes.data.content || []);
      httItems.value = processItems(httRes.data.content || []);

      bn30nTotal.value = bn30nRes.data.page?.totalElements || 0;
      hoptacTotal.value = hoptacRes.data.page?.totalElements || 0;
      httTotal.value = httRes.data.page?.totalElements || 0;
    } else {
      const soDong = filterLoaiMH.value === "HTT" ? pageSizeThiTruong.value : pageSizeSlider.value;
      const res = await api.post("/user.thg/product/user/bang-du-lieu", {
        ...basePayload,
        soDong: soDong,
        loaiMH: filterLoaiMH.value,
      });

      const items = processItems(res.data.content || []);
      const total = res.data.page?.totalElements || 0;

      bn30nItems.value = filterLoaiMH.value === "BN30N" ? items : [];
      hoptacItems.value = filterLoaiMH.value === "HOPTAC" ? items : [];
      httItems.value = filterLoaiMH.value === "HTT" ? items : [];

      bn30nTotal.value = filterLoaiMH.value === "BN30N" ? total : 0;
      hoptacTotal.value = filterLoaiMH.value === "HOPTAC" ? total : 0;
      httTotal.value = filterLoaiMH.value === "HTT" ? total : 0;
    }

    bn30nPage.value = 0;
    hoptacPage.value = 0;
    httPage.value = 0;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function loadMoreCategory(category) {
  const config = {
    BN30N: {
      page: bn30nPage,
      items: bn30nItems,
      total: bn30nTotal,
      loading: bn30nLoading,
    },
    HOPTAC: {
      page: hoptacPage,
      items: hoptacItems,
      total: hoptacTotal,
      loading: hoptacLoading,
    },
    HTT: {
      page: httPage,
      items: httItems,
      total: httTotal,
      loading: httLoading,
    },
  };

  const c = config[category];
  if (!c) return;

  if (c.items.value.length >= c.total.value) return;

  c.loading.value = true;
  c.page.value++;

  try {
    const res = await api.post("/user.thg/product/user/bang-du-lieu", {
      trangSo: c.page.value,
      soDong: pageSizeSlider.value,
      loaiMH: category,
      tuKhoa: searchQuery.value || null,
      mucGia: filterGiaRange.value || null,
      phuongXa: filterWard.value || null,
      khuVuc: filterProvince.value || null,
      viTri: filterViTri.value || null,
      moKhoa: filterUnlock.value === "" ? null : filterUnlock.value === "yes",
      trangThai: filterStatus.value || null,
      daThich: filterLove.value || null,
    });

    c.items.value.push(...processItems(res.data.content || []));
  } catch (e) {
    c.page.value--;
    console.error(e);
  } finally {
    c.loading.value = false;
  }
}

async function toggleLove(item) {
  localStorage.setItem("redirectAfterLogin", buildSeoUrl(item));
  if (!auth.accessToken) {
    router.push({
      path: "/dang-nhap"
    });
    return;
  }

  item.daThich = !item.daThich;
  item.soLuotThich = item.daThich
      ? item.soLuotThich + 1
      : item.soLuotThich - 1;

  try {
    await api.post(
        "/thg.user/my-land/love/toggle",
        null,
        {
          params: {
            idAsset: item.id
          }
        }
    );
  } catch (e) {
    item.daThich = !item.daThich;
    item.soLuotThich = item.daThich
        ? item.soLuotThich + 1
        : item.soLuotThich - 1;
  }
}

const canRequestCollaboration = (item) => {
  if (!auth.accessToken) return false;
  if (item.status === 'Đã bán') return false;
  if (item.isOwner) return false;
  if (item.daGuiYeuCau) return false;
  return true;
};

const openCollabModal = (item) => {
  selectedAsset.value = item;
  collabReason.value = "";
  agreePolicy.value = false;
  showCollabModal.value = true;
};

const closeCollabModal = () => {
  showCollabModal.value = false;
  selectedAsset.value = null;
  collabReason.value = "";
  agreePolicy.value = false;
};

async function submitCollaboration() {
  if (!auth.accessToken) {
    localStorage.setItem("redirectAfterLogin", "/san-pham-thien-ha");
    router.push({
      path: "/dang-nhap"
    });
    return;
  }

  if (!selectedAsset.value?.id) {
    showCenterError("Không xác định được sản phẩm");
    return;
  }

  try {
    const payload = {
      sanPhamId: selectedAsset.value.id,
      noiDungHopTac: collabReason.value
    };

    const res = await api.post(
        "/admin/api/de-nghi-hop-tac/gui-loi-moi",
        payload
    );

    if (!res.data.success) {
      showCenterWarning(res.data.message || "Không thể gửi đề nghị hợp tác");
      return;
    }

    showCenterSuccess(res.data.message || "Gửi đề nghị hợp tác thành công");
    selectedAsset.value.daGuiYeuCau = true;
    closeCollabModal();
  } catch (e) {
    console.error(e);
    showCenterError("Có lỗi xảy ra khi gửi đề nghị hợp tác");
  }
}

// Watchers
watch(
    [
      filterGiaRange,
      filterProvince,
      filterWard,
      filterLoaiMH,
      filterViTri,
      filterUnlock,
      searchQuery,
      filterLove,
      filterStatus,
      page,
      pageSize,
    ],
    () => {
      if (viewMode.value === 'table') {
        debouncedFilter();
      } else {
        bn30nPage.value = 0;
        hoptacPage.value = 0;
        httPage.value = 0;
        bn30nItems.value = [];
        hoptacItems.value = [];
        httItems.value = [];
        fetchSliderData();
      }
    },
    { deep: true, immediate: true }
);

watch(viewMode, (mode) => {
  pageSize.value = mode === 'card' ? 8 : 10;
});

watch(filterProvince, () => {
  filterWard.value = "";
});

// Lifecycle
onMounted(() => {
  updateViewportMode();
  window.addEventListener('resize', updateViewportMode);

  if (viewMode.value === 'table') {
    fetchFilteredAssets();
  } else {
    loading.value = true;
    nextTick(() => {
      fetchSliderData();
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportMode);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(4px);
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.slider-container {
  scroll-behavior: smooth;
}

.slider-item {
  flex: 0 0 auto;
  width: 350px;
}

* {
  font-size: 14px;
}

table * {
  font-size: 13.5px !important;
}

td {
  padding: 5px 5px 10px 0 !important;
}

.bg-pattern {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2AiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTM2IDE4YzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41IiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=');
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.group:hover {
  transform: translateY(-4px);
}

tbody tr:hover {
  background-color: rgba(239, 246, 255, 0.7) !important;
}

button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

table {
  border-radius: 16px;
  overflow: hidden;
}

th {
  padding-top: 7px !important;
  padding-bottom: 7px !important;
}

.table-header {
  background: linear-gradient(to right, #641eaf, #562df3);
  border-bottom: 2px solid #a78bfa;
}

.blink-row {
  animation: blink 1.4s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.45; }
  100% { opacity: 1; }
}

.label-glow,
.icon-glow {
  text-shadow:
      0 0 6px rgba(9, 9, 9, 0.9),
      0 0 12px rgba(10, 10, 10, 0.8);
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

.filter-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

@media (min-width: 768px) {
  .filter-header {
    flex-direction: row;
    align-items: center;
  }
  .filter-actions {
    margin-left: auto;
  }
  .filter-title {
    font-size: 22px;
  }
}

.action-heart {
  background: rgba(133,132,132,0.13);
  padding: 0 10px;
  margin-right: 5px;
  border-radius: 8px;
}

.action-view {
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px;
  background: #BFDBFE;
  color: #1D4ED8;
  border: 1px solid #93C5FD;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.dot-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(133,132,132,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-menu {
  position: absolute;
  right: 0;
  top: 36px;
  min-width: 140px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 20px rgba(0,0,0,.12);
  padding: 6px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-5px);
  transition: .2s;
  z-index: 50;
}

.dot-item {
  width: 100%;
  padding: 6px 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
}

.dot-item:hover {
  background: #f1f5f9;
}

.action-dot:hover .dot-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

@media (max-width: 1299px) {
  .action-full {
    display: none;
  }
}

@media (min-width: 1300px) {
  .action-dot {
    display: none;
  }
}

@media (max-width: 768px) {
  .slider-item {
    width: 350px;
  }
}

@media (max-width: 480px) {
  .slider-item {
    width: 350px;
  }
}

.collab-overlay {
  position: fixed;
  inset: 0;
  z-index: 99998;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
}

.collab-modal {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
}

.collab-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.collab-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5edff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.collab-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
}

.collab-subtitle {
  font-size: 0.9rem;
  font-weight: 500;
  color: #4b5563;
}

.collab-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.collab-label {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.collab-textarea {
  width: 100%;
  min-height: 96px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.2px solid #d1d5db;
  font-size: 1rem;
  font-weight: 400;
  color: #111827;
  resize: none;
}

.collab-textarea::placeholder {
  color: #6b7280;
  font-weight: 400;
}

.collab-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.collab-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.collab-hint-btn {
  padding: 5px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 999px;
  background: #e5e7eb;
  color: #111827;
  border: none;
  cursor: pointer;
}

.collab-hint-btn:hover {
  background: #d1d5db;
}

.collab-policy {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1f2937;
}

.collab-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.btn-cancel {
  padding: 7px 14px;
  border-radius: 8px;
  background: #e5e7eb;
  color: #111827;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.btn-submit {
  padding: 7px 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2563eb, #4338ca);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .collab-modal {
    max-width: 100%;
    padding: 16px;
    border-radius: 12px;
  }
  .collab-title {
    font-size: 1rem;
  }
  .collab-textarea {
    min-height: 88px;
  }
  .collab-footer {
    gap: 8px;
  }
}

.action-collab {
  padding: 2px 12px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px;
  background: #f8d7ac;
  color: #f57430;
  border: 1px solid #f8b66c;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 6px;
  margin-right: 10px;
}

.action-collab:hover {
  background: #fed7aa;
  border-color: #fdba74;
}
</style>