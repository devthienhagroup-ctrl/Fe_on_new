<template>
  <div class="address-selector">

    <div class="address-grid">

      <!-- PROVINCE -->
      <div class="address-field">
        <label class="address-label required">
          <i class="fas fa-map-marker-alt text-danger"></i>
          Tỉnh/Thành phố
        </label>

        <div class="dropdown-wrapper" @click.stop>
          <input
              v-if="showProvince"
              v-model="provinceSearch"
              class="address-input search-mode"
              placeholder="Tìm tỉnh..."
          />

          <div
              v-else
              class="address-input"
              @click="openProvince"
          >
            {{ selectedProvinceText || "-- Chọn Tỉnh/TP --" }}
          </div>

          <div v-if="showProvince" class="dropdown-menu-box">
            <div
                class="dropdown-item"
                v-for="p in filteredProvinces"
                :key="p.code"
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

      <!-- WARD -->
      <div class="address-field">
        <label class="address-label required">
          <i class="fas fa-map-pin text-success"></i>
          Xã/Phường
        </label>

        <div class="dropdown-wrapper" @click.stop>
          <input
              v-if="showWard"
              v-model="wardSearch"
              class="address-input search-mode"
              placeholder="Tìm phường..."
          />

          <div
              v-else
              class="address-input"
              :class="{ disabled: !wards.length }"
              @click="openWard"
          >
            {{ selectedWardText || "-- Chọn khu vực --" }}
          </div>

          <div v-if="showWard" class="dropdown-menu-box">
            <div
                class="dropdown-item"
                v-for="w in filteredWards"
                :key="w.code"
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

      <!-- STREET -->
      <div class="address-field">
        <label class="address-label required">
          <i class="fas fa-road text-secondary"></i>
          Số nhà, đường
        </label>

        <input
            v-model="street"
            type="text"
            class="address-input"
            placeholder="Số nhà, tên đường"
        />
      </div>

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

// Dropdown state
const showProvince = ref(false);
const showWard = ref(false);

const provinceSearch = ref("");
const wardSearch = ref("");

// Filter
const filteredProvinces = computed(() =>
    provinces.value.filter(p =>
        p.name.toLowerCase().includes(provinceSearch.value.toLowerCase())
    )
);

const filteredWards = computed(() =>
    wards.value.filter(w =>
        w.name.toLowerCase().includes(wardSearch.value.toLowerCase())
    )
);

// Open dropdowns
function openProvince() {
  showProvince.value = true;
  showWard.value = false;
  provinceSearch.value = "";
}

function openWard() {
  if (!wards.value.length) return;
  showWard.value = true;
  showProvince.value = false;
  wardSearch.value = "";
}

// Select province
function selectProvince(p) {
  provinceCode.value = p.code;
  wards.value = p.wards || [];
  wardCode.value = "";
  showProvince.value = false;
}

// Select ward
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

// Emit full address
watch([provinceCode, wardCode, street], () => {
  const province = provinces.value.find(p => p.code === provinceCode.value);
  const ward = province?.wards?.find(w => w.code === wardCode.value);

  const full = [street.value, ward?.name, province?.name]
      .filter(Boolean)
      .join("/!!");

  emit("update:modelValue", full);
});

// Parse initial value
onMounted(() => {
  if (!props.modelValue) return;

  const parts = props.modelValue.split("/!!");
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
});
</script>

<style scoped>
/* ========= INPUT / SELECT (3 ô giống nhau) ========= */
/* ========= INPUT / SELECT (3 ô giống nhau) ========= */
.address-input {
  width: 100%;
  height: 38px;            /* 🔥 ép chiều cao cố định */
  padding: 0 12px;         /* 🔥 bỏ padding trên dưới */
  border-radius: 6px !important;
  border: 1px solid #d0d7e2;
  background: #ffffff;
  font-size: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  line-height: 38px;       /* 🔥 text căn giữa */
  box-sizing: border-box;  /* đảm bảo không vỡ layout */
}

/* Khi search → vẫn giữ chiều cao như div */
.address-input.search-mode {
  height: 38px;
  line-height: 38px;
  padding: 0 12px;
  cursor: text;
  border-color: #0d6efd;
}

/* Disabled */
.address-input.disabled {
  background: #f1f3f5;
  color: #999;
  cursor: not-allowed;
}


/* Search mode */
.address-input.search-mode {
  cursor: text;
  border-color: #0d6efd;
}

/* Disabled */
.address-input.disabled {
  background: #f1f3f5;
  color: #999;
  cursor: not-allowed;
}

/* Dropdown wrapper */
.dropdown-wrapper {
  position: relative;
}

/* Dropdown menu */
.dropdown-menu-box {
  position: absolute;
  z-index: 20;
  width: 100%;
  background: #fff;
  border: 1px solid #d0d7e2;
  border-radius: 10px;
  margin-top: 4px;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* Items */
.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 13px;
}

.dropdown-item:hover {
  background: #eef6ff;
  color: #0d6efd;
}

/* No result */
.empty {
  padding: 10px;
  text-align: center;
  color: #777;
}

/* GRID layout */
.address-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}

/* 📱 Mobile */
@media (max-width: 768px) {
  .address-grid {
    grid-template-columns: 1fr;
  }

  .address-input {
    padding: 10px 14px;
    font-size: 0.858rem;
  }
}

/* ===== FIELD WRAPPER ===== */
.address-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ===== LABEL ===== */
.address-label {
  font-size: 15px;
  font-weight: 600;
  color: #212529;
  display: flex;
  align-items: center;
  gap: 6px;
}

.address-label.required::after {
  content: "*";
  color: #dc3545;
  margin-left: 2px;
  font-weight: 700;
}

/* ===== INPUT / SELECT ===== */
.address-input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #ced4da;
  background: #fff;
  font-size: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  line-height: 40px;
  transition: border-color .15s ease, box-shadow .15s ease;
}

/* Hover / Focus */
.address-input:hover {
  border-color: #86b7fe;
}

.address-input.search-mode {
  cursor: text;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.15rem rgba(13,110,253,.15);
}

/* Disabled giống Bootstrap */
.address-input.disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* ===== DROPDOWN ===== */
.dropdown-wrapper {
  position: relative;
}

.dropdown-menu-box {
  position: absolute;
  z-index: 1050;
  width: 100%;
  background: #fff;
  border: 1px solid #ced4da;
  border-radius: 8px;
  margin-top: 4px;
  max-height: 240px;
  overflow-y: auto;
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}

.dropdown-item {
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f1f7ff;
  color: #0d6efd;
}

/* ===== GRID ===== */
.address-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Mobile */
@media (max-width: 768px) {
  .address-grid {
    grid-template-columns: 1fr;
  }
}

</style>
