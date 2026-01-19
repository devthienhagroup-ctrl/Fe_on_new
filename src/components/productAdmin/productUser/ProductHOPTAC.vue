<template>
  <div v-if="shouldShow && items.length > 0" class="mb-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2 px-3 py-2 rounded-lg">
        Hàng Hợp Tác
        <span class="text-sm font-normal text-slate-700">({{ total }} sản phẩm)</span>
      </h2>
    </div>

    <!-- Slider container -->
    <div class="relative bg-gradient-to-r from-slate-50 to-blue-50 p-6 rounded-2xl shadow-sm border border-slate-200">
      <!-- Navigation buttons - outside slider -->
      <button @click="scrollSlider(-1)"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-slate-300 shadow-lg flex items-center justify-center hover:bg-slate-50 hover:scale-110 transition-all duration-200">
        <i class="fa-solid fa-chevron-left text-slate-700 text-lg"></i>
      </button>

      <button @click="scrollSlider(1)"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-slate-300 shadow-lg flex items-center justify-center hover:bg-slate-50 hover:scale-110 transition-all duration-200">
        <i class="fa-solid fa-chevron-right text-slate-700 text-lg"></i>
      </button>

      <!-- Slider content -->
      <div ref="sliderRef" class="flex overflow-x-auto scrollbar-hide gap-6 pb-4 slider-container px-4"
           @scroll="handleScroll"
           style="scroll-behavior: smooth;">
        <!-- Product cards -->
        <div v-for="item in items" :key="item.id" class="slider-item">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full relative">
            <!-- Image section -->
            <div @click="$emit('view-detail', item)" style="cursor: pointer;">
              <div class="relative w-full overflow-hidden" style="height: 200px">
                <div class="relative w-full h-full px-3 pt-3 rounded-3 overflow-hidden aspect-[4/3] w-full">
                  <img :src="item.imageUrl || defaultImage" class="w-full rounded-3 h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>

                <!-- Tags -->
                <div class="absolute top-2 mt-3 ms-3 left-2 flex items-center gap-2 z-10">
                  <!-- Asset type -->
                  <div class="px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm text-white" style="font-size: 10px !important;">
                    <i :class="getAssetTypeIcon(item)" style="font-size: 13px !important;"></i>
                    {{ getLoai(item) || '—' }}
                  </div>

                  <!-- Lock status -->
                  <div class="px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm"
                       :class="item.moKhoa ? 'text-green-300' : 'text-yellow-300'"
                       style="font-size: 10px !important;">
                    <i :class="item.moKhoa ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'" style="font-size: 10px !important;"></i>
                    <span style="font-size: 10px !important;">{{ item.moKhoa ? 'Đã mở' : 'Chưa mở' }}</span>
                  </div>
                </div>

                <!-- Status badge - FIXED: corrected string comparison -->
                <img v-if="item.status === 'Đã kiểm duyệt'"
                     src="https://s3.cloudfly.vn/thg-storage/uploads-public/icon-kiem-duỵet.png"
                     class="absolute z-20"
                     style="width: 32px; height: auto; top: 20px; right: 20px;"
                     alt="checked"
                />
              </div>

              <!-- Product info -->
              <div class="p-3 leading-tight text-slate-800">
                <!-- Address -->
                <div class="font-semibold text-slate-900 mb-1" style="font-size: 15px; font-weight: 700; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  {{ formatWardCard(item.diaChi) }}, {{ formatProvinceCard(item.khuVuc) }}
                </div>
                <div class="font-semibold text-slate-500" style="font-size: 13px">
                  Ngày cập nhật: {{ formatDate(item.capNhatNgay) }}
                </div>

                <!-- Price and commission -->
                <div class="flex items-center justify-between mt-1">
                  <div style="color: #dc2626; font-weight: 700; font-size: 16px">
                    {{ formatMoneyVN(item.giaBan) }}
                    <span class="text-[12px] text-slate-500 font-semibold">Hoa hồng: </span>
                    <DotLottieVue
                        src="https://lottie.host/a94085b1-dc72-4753-88d0-4bdfad75c588/NgBvXtuOwE.lottie"
                        autoplay
                        loop
                        style="width: 20px; height: 26px; display: inline-block; vertical-align: bottom;"
                    />
                    <span class="font-semibold text-blue-700 text-[14px]">
                      {{ item.phiMoiGioi != null ? item.phiMoiGioi + '%' : '-' }}
                    </span>
                  </div>

                  <!-- Unit and type -->
                  <div class="flex items-center gap-2 mt-2">
                    <div class="px-2.5 py-0.5 rounded-full text-white shadow-sm"
                         :class="item.donVi === 'THG' ? 'bg-[#6A0DAD]' : 'bg-[#0057D9]'"
                         style="font-weight: 550; font-size: 12.5px !important;">
                      {{ item.donVi }}
                    </div>
                    <span class="px-2 py-0.5 rounded-full bg-orange-500 text-white font-semibold"
                          style="font-weight: 550; font-size: 12.5px !important;">
                      {{ item.loaiMH }}
                    </span>
                  </div>
                </div>

                <!-- Appraisal price and stats -->
                <div class="flex items-center justify-between mt-2 text-[14px]">
                  <span class="font-semibold text-slate-700 truncate max-w-[55%]">
                    <template v-if="!item.giaDinhGia">Chưa định giá</template>
                    <template v-else-if="item.giaDinhGia == -1.1">*********** (Giá định)</template>
                    <template v-else>{{ formatMoneyVN(item.giaDinhGia) }} (Giá định)</template>
                  </span>
                  <div class="flex items-center gap-3 text-slate-500 text-[12px] shrink-0">
                    <div class="flex items-center gap-1 font-medium">
                      <span class="font-medium text-slate-700">{{ item.soLuotXem ?? 0 }}</span>đã xem
                    </div>
                    <div class="flex items-center gap-1 font-medium">
                      <span class="font-medium text-slate-700">{{ item.soLuotThich ?? 0 }}</span>đã thích
                    </div>
                  </div>
                </div>

                <!-- Owner and contact -->
                <div class="grid grid-cols-2 gap-2 mt-2">
                  <div class="p-2 bg-blue-50 rounded-lg">
                    <div class="text-[12px] text-slate-500 font-semibold">Chủ nhà</div>
                    <div class="text-[14px] font-semibold text-slate-800 mt-0.5 truncate">
                      {{ item.tenChuNha || '—' }}
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

                <!-- Area and location -->
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

            <!-- Action buttons -->
            <div class="flex items-center gap-2 px-3 pb-3">
              <div class="flex-1 grid grid-cols-2 gap-2">
                <button @click.stop="$emit('view-detail', item)"
                        class="py-2.5 bg-gradient-to-r from-slate-900 to-black text-white rounded-full text-[14px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  <i class="fa-regular fa-eye text-sm"></i>
                  Xem chi tiết
                </button>

                <button v-if="canRequestCollaboration(item)"
                        @click.stop="$emit('open-collab', item)"
                        class="py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-[14px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  <i class="fas fa-handshake"></i>
                  Hợp tác
                </button>
              </div>

              <button @click="$emit('toggle-love', item)"
                      class="w-10 h-10 rounded-full bg-slate-100 text-slate-800 shadow-sm hover:bg-slate-200 flex items-center justify-center transition">
                <i :class="item.daThich ? 'fa-solid fa-heart text-black text-base' : 'fa-regular fa-heart text-base'"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Load more indicator -->
        <div v-if="loading && items.length > 0" class="slider-item flex items-center justify-center">
          <div class="text-center">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
            <p class="mt-2 text-sm text-slate-600">Đang tải thêm...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { useAuthStore } from "/src/stores/authStore.js";

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

const emit = defineEmits(['view-detail', 'toggle-love', 'load-more', 'open-collab']);

const authStore = useAuthStore();
const sliderRef = ref(null);
const defaultImage = 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg';

// Kiểm tra xem người dùng có thể yêu cầu hợp tác không
const canRequestCollaboration = (item) => {
  if (item.status === 'Đã bán') return false;
  if (item.isOwner) return false;
  if (item.daGuiYeuCau) return false;
  return true;
};

// Reuse helper functions from BN30N component
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

const scrollSlider = (direction) => {
  if (!sliderRef.value) return;

  const firstItem = sliderRef.value.querySelector('.slider-item');
  if (!firstItem) return;

  const style = getComputedStyle(sliderRef.value);
  const gap = parseInt(style.gap) || 16;
  const itemWidth = firstItem.offsetWidth;
  const scrollAmount = itemWidth + gap;

  sliderRef.value.scrollLeft += direction * scrollAmount;
};

const handleScroll = () => {
  if (!sliderRef.value || props.loading) return;

  const { scrollLeft, scrollWidth, clientWidth } = sliderRef.value;
  if (scrollWidth - scrollLeft - clientWidth < 200) {
    emit('load-more');
  }
};
</script>

<style scoped>
.slider-container {
  scroll-behavior: smooth;
}

.slider-item {
  flex: 0 0 auto;
  width: 350px;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

@media (max-width: 768px) {
  .slider-item {
    width: 350px;
  }

  .relative {
    padding: 1rem !important;
  }
}

@media (max-width: 480px) {
  .slider-item {
    width: 320px;
  }
}
</style>