<template>
  <div class="address-selector">
    <!-- ROW 1: PROVINCE + WARD -->
    <div class="address-grid">
      <div class="form-group">
        <label for="province-selector">
          <span class="required">*</span> Tỉnh / Thành phố
        </label>
        <div class="select-wrapper" @click.stop>
          <input
              v-if="showProvince"
              v-model="provinceSearch"
              id="province-selector"
              class="select-box search-enabled"
              placeholder="Tìm tỉnh..."
              @input="searchProvinces"
          />
          <div
              v-else
              id="province-selector"
              class="select-box"
              :class="{ 'placeholder': !selectedProvinceText }"
              @click="openProvince"
          >
            {{ selectedProvinceText || "Chọn tỉnh/thành phố" }}
          </div>
          <div v-if="showProvince" class="dropdown-menu-box">
            <div
                v-for="p in filteredProvinces"
                :key="p.code"
                class="dropdown-item"
                @click="selectProvince(p)"
            >
              {{ p.name }}
            </div>
            <div v-if="filteredProvinces.length === 0" class="empty">
              Không có kết quả
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="ward-selector">
          <span class="required">*</span> Phường / Xã
        </label>
        <div class="select-wrapper" @click.stop>
          <input
              v-if="showWard"
              v-model="wardSearch"
              id="ward-selector"
              class="select-box search-enabled"
              placeholder="Tìm phường..."
              @input="searchWards"
              :disabled="!wards.length"
          />
          <div
              v-else
              id="ward-selector"
              class="select-box"
              :class="{ 'placeholder': !selectedWardText, 'disabled': !wards.length }"
              @click="openWard"
          >
            {{ selectedWardText || "Chọn phường/xã" }}
          </div>
          <div v-if="showWard" class="dropdown-menu-box">
            <div
                v-for="w in filteredWards"
                :key="w.code"
                class="dropdown-item"
                @click="selectWard(w)"
            >
              {{ w.name }}
            </div>
            <div v-if="filteredWards.length === 0" class="empty">
              Không có kết quả
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ROW 2: STREET -->
    <div class="form-group full-width">
      <label for="street-input">
        <span class="required">*</span> Địa chỉ cụ thể
      </label>
      <input
          v-model="street"
          id="street-input"
          type="text"
          class="input-box"
          placeholder="Số nhà, tên đường"
          required
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import addressData from "/src/assets/js/address.json";

// Props để nhận và cập nhật giá trị từ AuthModal
const props = defineProps({
  modelValue: String,
  addressData: {
    type: Object,
    default: () => ({ city: '', ward: '', specific: '' })
  }
});

const emit = defineEmits(["update:modelValue", "update:addressData"]);

const provinces = ref(addressData);
const wards = ref([]);

const provinceCode = ref("");
const wardCode = ref("");
const street = ref("");

const showProvince = ref(false);
const showWard = ref(false);

const provinceSearch = ref("");
const wardSearch = ref("");

// Fuse.js instances
let provinceFuse = null;
let wardFuse = null;

// Fuse.js options
const fuseOptions = {
  keys: ['name'],
  threshold: 0.5,
  includeScore: true,
  includeMatches: true
};

// Initialize Fuse.js instances
const initializeFuse = () => {
  if (window.Fuse) {
    provinceFuse = new window.Fuse(provinces.value, fuseOptions);
  }
};

const initializeWardFuse = () => {
  if (window.Fuse && wards.value.length > 0) {
    wardFuse = new window.Fuse(wards.value, fuseOptions);
  }
};

// Search functions using Fuse.js
const searchProvinces = () => {
  if (!provinceFuse || !provinceSearch.value.trim()) {
    return;
  }

  const results = provinceFuse.search(provinceSearch.value);
  filteredProvinces.value = results.map(result => result.item);
};

const searchWards = () => {
  if (!wardFuse || !wardSearch.value.trim()) {
    return;
  }

  const results = wardFuse.search(wardSearch.value);
  filteredWards.value = results.map(result => result.item);
};

// Reactive filtered data
const filteredProvinces = ref(provinces.value);
const filteredWards = ref([]);

// Reset filtered data when opening dropdowns
function openProvince() {
  showProvince.value = true;
  showWard.value = false;
  provinceSearch.value = "";
  filteredProvinces.value = provinces.value;
}

function openWard() {
  if (!wards.value.length) return;
  showWard.value = true;
  showProvince.value = false;
  wardSearch.value = "";
  filteredWards.value = wards.value;
}

function selectProvince(p) {
  provinceCode.value = p.code;
  wards.value = p.wards || [];
  wardCode.value = "";
  showProvince.value = false;

  // Emit address data to parent
  emitAddressData();

  // Initialize ward fuse when province is selected
  initializeWardFuse();
  filteredWards.value = wards.value;
}

function selectWard(w) {
  wardCode.value = w.code;
  showWard.value = false;
  emitAddressData();
}

const selectedProvinceText = computed(() => {
  const p = provinces.value.find(x => x.code === provinceCode.value);
  return p?.name || "";
});

const selectedWardText = computed(() => {
  const p = provinces.value.find(x => x.code === provinceCode.value);
  const w = p?.wards?.find(x => x.code === wardCode.value);
  return w?.name || "";
});

// Emit address data in AuthModal format
const emitAddressData = () => {
  const province = provinces.value.find(p => p.code === provinceCode.value);
  const ward = province?.wards?.find(w => w.code === wardCode.value);

  const addressData = {
    city: province?.name || '',
    ward: ward?.name || '',
    specific: street.value.trim()
  };

  emit('update:addressData', addressData);

  // Also emit in the original format for compatibility
  if (provinceCode.value && wardCode.value && street.value.trim()) {
    const full = [street.value.trim(), ward?.name, province?.name]
        .filter(Boolean)
        .join("/!!");
    emit("update:modelValue", full);
  } else {
    emit("update:modelValue", "");
  }
};

// Watch for street changes
watch(street, () => {
  emitAddressData();
});

// Parse initial value from AuthModal props
onMounted(() => {
  // If addressData prop is provided (from AuthModal)
  if (props.addressData) {
    const { city, ward, specific } = props.addressData;

    if (city) {
      const p = provinces.value.find(x => x.name === city);
      if (p) {
        provinceCode.value = p.code;
        wards.value = p.wards;

        if (ward) {
          const w = p.wards.find(x => x.name === ward);
          if (w) wardCode.value = w.code;
        }
      }
    }

    if (specific) {
      street.value = specific;
    }
  }

  // Also check for old modelValue format
  else if (props.modelValue) {
    const parts = props.modelValue.split("/!!");
    if (parts.length >= 3) {
      street.value = parts[0] || "";
      const wardName = parts[1];
      const provinceName = parts[2];

      const p = provinces.value.find(x => x.name === provinceName);
      if (p) {
        provinceCode.value = p.code;
        wards.value = p.wards;
        const w = p.wards.find(x => x.name === wardName);
        if (w) wardCode.value = w.code;
      }
    }
  }

  // Load Fuse.js from CDN and initialize
  if (!window.Fuse) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0';
    script.onload = () => {
      initializeFuse();
    };
    document.head.appendChild(script);
  } else {
    initializeFuse();
  }

  // Add click outside listener
  document.addEventListener('click', closeDropdowns);
});

// Close dropdowns when clicking outside
const closeDropdowns = () => {
  showProvince.value = false;
  showWard.value = false;
};
</script>

<style scoped>
.address-selector {
  width: 100%;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

@media (max-width: 640px) {
  .address-grid {
    grid-template-columns: 1fr;
  }
}

/* Labels và required */
.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
  font-size: 18px;
  line-height: 1;
}

/* Inputs và selects cho AddressSelector */
.input-box,
.select-box {
  padding: 14px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  background: #ffffff;
  color: #1e293b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.03);
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
}

.select-box::after {
  content: '';
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px;
  pointer-events: none;
}

.select-box.placeholder {
  color: #94a3b8;
  font-weight: 300;
}

.input-box::placeholder,
.select-box.placeholder {
  color: #94a3b8;
  font-weight: 300;
}

.input-box:focus,
.select-box:focus,
.search-enabled {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.search-enabled {
  cursor: text;
  padding-right: 16px !important;
}

.search-enabled::after {
  display: none !important;
}

/* Bật chế độ search */
.search-enabled {
  cursor: text;
}

/* Disable */
.select-box.disabled {
  opacity: 0.5;
  pointer-events: none;
  background-color: #f8fafc;
}

/* Dropdown list */
.select-wrapper {
  position: relative;
  width: 100%;
}

.dropdown-menu-box {
  position: absolute;
  z-index: 50;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
  0 8px 10px -6px rgba(0, 0, 0, 0.05);
  max-height: 260px;
  overflow-y: auto;
  margin-top: 8px;
  border: 1.5px solid #e2e8f0;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 15px;
  color: #1e293b;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid #f1f5f9;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
  padding-left: 20px;
}

.empty {
  padding: 20px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}

/* Form group full width */
.form-group.full-width {
  grid-column: 1 / -1;
}

/* Scrollbar styling cho dropdown */
.dropdown-menu-box::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu-box::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.dropdown-menu-box::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.dropdown-menu-box::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>