<template>
  <div class="address-selector">
    <!-- ROW 1: PROVINCE + WARD -->
    <div class="form-row">
      <div class="form-group-half">
        <label>Tỉnh / Thành phố</label>
        <div class="select-wrapper" @click.stop>
          <input
              v-if="showProvince"
              v-model="provinceSearch"
              class="select-box search-enabled"
              placeholder="Tìm tỉnh..."
              @input="searchProvinces"
          />
          <div
              v-else
              class="select-box"
              @click="openProvince"
          >
            {{ selectedProvinceText || "Tỉnh / TP" }}
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

      <div class="form-group-half">
        <label>Phường / Xã</label>
        <div class="select-wrapper" @click.stop>
          <input
              v-if="showWard"
              v-model="wardSearch"
              class="select-box search-enabled"
              placeholder="Tìm phường..."
              @input="searchWards"
          />
          <div
              v-else
              class="select-box"
              :class="{ disabled: !wards.length }"
              @click="openWard"
          >
            {{ selectedWardText || "Phường / Xã" }}
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
    <div class="form-group mt-3">
      <label>Địa chỉ cụ thể</label>
      <input
          v-model="street"
          type="text"
          class="input-box"
          placeholder="Số nhà, tên đường"
      />
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch, onMounted } from "vue";
import addressData from "/src/assets/js/address.json";

const props = defineProps({ modelValue: String });
const emit = defineEmits(["update:modelValue"]);

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

  // Initialize ward fuse when province is selected
  initializeWardFuse();
  filteredWards.value = wards.value;
}

function selectWard(w) {
  wardCode.value = w.code;
  showWard.value = false;
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

// Check if all fields are filled
const isComplete = computed(() => {
  return provinceCode.value && wardCode.value && street.value.trim();
});

// Emit output value only when all fields are filled
watch([provinceCode, wardCode, street], () => {
  if (isComplete.value) {
    const province = provinces.value.find(p => p.code === provinceCode.value);
    const ward = province?.wards?.find(w => w.code === wardCode.value);

    const full = [street.value.trim(), ward?.name, province?.name]
        .filter(Boolean)
        .join("/!!");

    emit("update:modelValue", full);
  } else {
    // Emit empty string if any field is missing
    emit("update:modelValue", "");
  }
});

// Parse initial value
onMounted(() => {
  if (!props.modelValue) return;

  const parts = props.modelValue.split("/");
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
});

// Load Fuse.js from CDN and initialize
onMounted(() => {
  // Check if Fuse.js is already loaded
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
  max-width: 100%; /* Hoặc kích thước cố định bạn muốn */
  min-width: 300px; /* Đảm bảo không bị nhỏ quá */
}

/* Input box theo style form */
.input-box,
.select-box {
  width: 100%;
  padding: 14px;
  background-color: #EEF1FF;
  border: none;
  border-radius: 13px;
  font-size: 16px;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: 0.2s;

  /* Ngăn text xuống dòng và hiển thị ... khi quá dài */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Đảm bảo chiều rộng tối đa */
  box-sizing: border-box;
}

.input-box:focus,
.select-box:focus,
.search-enabled {
  outline: none;
  background-color: #e6e9ff;
}

/* Bật chế độ search */
.search-enabled {
  cursor: text;
  border: 1px solid #0d6efd;

  /* Khi đang search thì cho phép xuống dòng để xem toàn bộ text */
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
}

/* Disable */
.select-box.disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* Dropdown list */
.select-wrapper {
  position: relative;
}

.dropdown-menu-box {
  position: absolute;
  z-index: 20;
  width: 100%;
  background: white;
  border-radius: 13px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  max-height: 260px;
  overflow-y: auto;
  margin-top: 5px;
  border: 1px solid #ddd;
}

.dropdown-item {
  padding: 10px 14px;
  cursor: pointer;
  font-size: 15px;

  /* Đảm bảo text trong dropdown cũng bị cắt nếu quá dài */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item:hover {
  background: #eef6ff;
  color: #0d6efd;
}

.empty {
  padding: 12px;
  text-align: center;
  color: #777;
}

/* Row layout theo form */
.form-row {
  display: flex;
  gap: 15px;

  /* Đảm bảo responsive trên mobile */
  flex-wrap: wrap;
}

.form-group-half {
  flex: 1;
  min-width: 150px; /* Đảm bảo không bị nhỏ quá */
}

label {
  display: block;
  font-size: 18px;
  color: #000;
  font-weight: 500;
  margin-bottom: 6px;

  /* Đảm bảo label không bị tràn */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mt-3 {
  margin-top: 15px;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .address-selector {
    max-width: 100%; /* Trên mobile chiếm toàn bộ chiều rộng */
  }

  .form-row {
    flex-direction: column;
    gap: 10px;
  }

  .form-group-half {
    min-width: 100%;
  }

  label {
    font-size: 16px;
  }

  .input-box,
  .select-box {
    font-size: 14px;
    padding: 12px;
  }
}

/* Đảm bảo container cha không làm thay đổi kích thước */
:deep() .address-selector-container {
  width: fit-content;
  max-width: 100%;
}
</style>