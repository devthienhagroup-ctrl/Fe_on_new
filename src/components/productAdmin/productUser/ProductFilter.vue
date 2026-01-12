<template>
  <div class="filter-wrapper">
    <div class="bg-white rounded-xl shadow-lg border border-slate-300 mb-5 p-4"
         style="
            background-image: url('https://s3.cloudfly.vn/thg-storage-dev/uploads-public/thienhagroup_filter_2.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          ">
      <div class="filter-header mb-3">
        <div class="filter-title-wrap">
          <h1 class="filter-title">
            Sản Phẩm Thiên Hà Group Dành Riêng Cho Bạn
          </h1>
        </div>

        <div class="filter-actions">
          <slot name="view-mode-toggle"></slot>
        </div>
      </div>

      <div v-if="isFilterMobile" class="flex justify-end mb-3">
        <button
            @click="showFilterPanel = !showFilterPanel"
            class="px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all"
            :class="showFilterPanel
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
        >
          <i :class="['fa-solid text-sm', showFilterPanel ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          <span class="text-sm font-medium">
            {{ showFilterPanel ? 'Thu gọn bộ lọc' : 'Hiển thị bộ lọc' }}
          </span>
        </button>
      </div>

      <!-- Thanh tìm kiếm -->
      <div class="mb-3">
        <div class="relative">
          <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo tên chủ nhà hoặc số điện thoại, địa chỉ chi tết..."
              class="w-full pl-9 pr-4 py-2 border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-sm transition-all text-sm"
              @input="$emit('update:searchQuery', $event.target.value)"
          />
        </div>
      </div>

      <div class="filter-row" v-show="!isFilterMobile || showFilterPanel">
        <!-- Mức giá -->
        <div class="filter-item">
          <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
            <i class="fa-solid fa-dollar-sign text-blue-600 text-xs icon-glow"></i>
            Mức Giá
          </label>
          <select v-model="filterGiaRange"
                  class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
                   focus:ring-2 focus:ring-blue-600 focus:border-transparent
                   bg-white shadow-sm transition-all"
                  @change="$emit('update:filterGiaRange', $event.target.value)">
            <option value="">Tất cả</option>
            <option value="<1>">&lt; 1 tỷ</option>
            <option value="1-3">1 - 3 tỷ</option>
            <option value="3-5">3 - 5 tỷ</option>
            <option value="5-7">5 - 7 tỷ</option>
            <option value="7-10">7 - 10 tỷ</option>
            <option value=">10">&gt; 10 tỷ</option>
          </select>
        </div>

        <!-- Tỉnh thành -->
        <div class="filter-item">
          <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
            <i class="fa-solid fa-city text-emerald-600 text-xs icon-glow"></i>
            Tỉnh Thành
          </label>
          <select v-model="filterProvince"
                  class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
                   focus:ring-2 focus:ring-blue-600 focus:border-transparent
                   bg-white shadow-sm transition-all"
                  @change="$emit('update:filterProvince', $event.target.value)">
            <option value="">Tất cả</option>
            <option v-for="p in provinces" :key="p" :value="p">
              {{ formatProvinceShort(p) }}
            </option>
          </select>
        </div>

        <!-- Phường/Xã -->
        <div class="filter-item">
          <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
            <i class="fa-solid fa-location-dot text-violet-600 text-xs icon-glow"></i>
            Phường/Xã
          </label>
          <select v-model="filterWard"
                  class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
                   focus:ring-2 focus:ring-blue-600 focus:border-transparent
                   bg-white shadow-sm transition-all"
                  @change="$emit('update:filterWard', $event.target.value)">
            <option value="">Tất cả</option>
            <option v-for="w in wards" :key="w" :value="w">{{ w }}</option>
          </select>
        </div>

        <!-- Loại mặt hàng -->
        <div class="filter-item">
          <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
            <i class="fa-solid fa-tag text-rose-600 text-xs icon-glow"></i>
            Loại Mặt Hàng
          </label>
          <select v-model="filterLoaiMH"
                  class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
                   focus:ring-2 focus:ring-blue-600 focus:border-transparent
                   bg-white shadow-sm transition-all"
                  @change="$emit('update:filterLoaiMH', $event.target.value)">
            <option value="">Tất cả</option>
            <option value="BN30N">Bán nhanh 30 ngày</option>
            <option value="HOPTAC">Hàng hợp tác</option>
            <option value="HTT">Hàng thị trường</option>
          </select>
        </div>

        <!-- Vị trí -->
        <div class="filter-item">
          <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
            <i class="fa-solid fa-location-arrow text-cyan-400 text-xs icon-glow"></i>
            Vị Trí
          </label>
          <input
              list="landPositions"
              v-model="filterViTri"
              placeholder="Chọn hoặc nhập vị trí..."
              class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
                   focus:ring-2 focus:ring-blue-600 focus:border-transparent
                   bg-white shadow-sm transition-all"
              @input="$emit('update:filterViTri', $event.target.value)" />
          <datalist id="landPositions">
            <option value="Mặt tiền đường chính"></option>
            <option value="Góc 2 mặt tiền"></option>
            <option value="Hẻm xe hơi"></option>
            <option value="Khu dân cư"></option>
          </datalist>
        </div>

        <!-- Mở khóa -->
        <div class="filter-item">
          <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
            <i class="fa-solid fa-unlock text-yellow-500 text-xs icon-glow"></i>
            Mở khóa
          </label>
          <select v-model="filterUnlock"
                  class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
                   focus:ring-2 focus:ring-blue-600 focus:border-transparent
                   bg-white shadow-sm transition-all"
                  @change="$emit('update:filterUnlock', $event.target.value)">
            <option value="">Tất cả</option>
            <option value="yes">Đã mở</option>
            <option value="no">Chưa mở</option>
          </select>
        </div>

        <!-- Đã thích -->
        <div class="filter-item">
          <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
            <i class="fa-solid fa-heart text-black text-xs icon-glow"></i>
            Đã thích
          </label>
          <select v-model="filterLove"
                  class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
                   focus:ring-2 focus:ring-blue-600 focus:border-transparent
                   bg-white shadow-sm transition-all"
                  @change="$emit('update:filterLove', filterLove)"

          >
            <option :value="null">Tất cả</option>
            <option :value="true">Đã thích</option>
            <option :value="false">Chưa thích</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import addressData from "/src/assets/js/address.json";

const props = defineProps({
  searchQuery: String,
  filterGiaRange: String,
  filterProvince: String,
  filterWard: String,
  filterLoaiMH: String,
  filterViTri: String,
  filterUnlock: String,
  filterLove: [Boolean, null],
});

const emit = defineEmits([
  'update:searchQuery',
  'update:filterGiaRange',
  'update:filterProvince',
  'update:filterWard',
  'update:filterLoaiMH',
  'update:filterViTri',
  'update:filterUnlock',
  'update:filterLove',
]);

const isFilterMobile = ref(false);
const showFilterPanel = ref(true);

// Local refs for two-way binding
const searchQuery = ref(props.searchQuery || '');
const filterGiaRange = ref(props.filterGiaRange || '');
const filterProvince = ref(props.filterProvince || '');
const filterWard = ref(props.filterWard || '');
const filterLoaiMH = ref(props.filterLoaiMH || '');
const filterViTri = ref(props.filterViTri || '');
const filterUnlock = ref(props.filterUnlock || '');
const filterLove = ref(props.filterLove);

const provinces = computed(() => addressData.map(x => x.name));

const wards = computed(() => {
  if (!filterProvince.value) return [];
  const province = addressData.find(p => p.name === filterProvince.value);
  if (!province || !Array.isArray(province.wards)) return [];
  return province.wards.map(w => w.name);
});

const formatProvinceShort = (province) => {
  if (!province || typeof province !== "string") return province || "";
  return province
      .replace(/^Thành phố\s+/i, "TP.")
      .replace(/^Tỉnh\s+/i, "T.");
};

const updateViewportMode = () => {
  const w = window.innerWidth;
  if (w < 736) {
    isFilterMobile.value = true;
    showFilterPanel.value = false;
  } else {
    isFilterMobile.value = false;
    showFilterPanel.value = true;
  }
};

// Watch local refs and emit changes
watch(searchQuery, (val) => emit('update:searchQuery', val));
watch(filterGiaRange, (val) => emit('update:filterGiaRange', val));
watch(filterProvince, (val) => {
  emit('update:filterProvince', val);
  filterWard.value = ""; // Reset ward when province changes
});
watch(filterWard, (val) => emit('update:filterWard', val));
watch(filterLoaiMH, (val) => emit('update:filterLoaiMH', val));
watch(filterViTri, (val) => emit('update:filterViTri', val));
watch(filterUnlock, (val) => emit('update:filterUnlock', val));
watch(filterLove, (val) => emit('update:filterLove', val));

// Watch props to update local refs
watch(() => props.searchQuery, (val) => searchQuery.value = val || '');
watch(() => props.filterGiaRange, (val) => filterGiaRange.value = val || '');
watch(() => props.filterProvince, (val) => filterProvince.value = val || '');
watch(() => props.filterWard, (val) => filterWard.value = val || '');
watch(() => props.filterLoaiMH, (val) => filterLoaiMH.value = val || '');
watch(() => props.filterViTri, (val) => filterViTri.value = val || '');
watch(() => props.filterUnlock, (val) => filterUnlock.value = val || '');
watch(() => props.filterLove, (val) => filterLove.value = val);

onMounted(() => {
  updateViewportMode();
  window.addEventListener('resize', updateViewportMode);
});
</script>

<style scoped>
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

.label-glow,
.icon-glow {
  text-shadow:
      0 0 6px rgba(9, 9, 9, 0.9),
      0 0 12px rgba(10, 10, 10, 0.8);
}
</style>