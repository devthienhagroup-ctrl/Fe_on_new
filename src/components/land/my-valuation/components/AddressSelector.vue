<template>
  <div class="address-selector">

    <div class="address-grid">

      <!-- PROVINCE -->
      <div>
        <div class="dropdown-wrapper" @click.stop>

          <input
              v-if="showProvince"
              v-model="provinceSearch"
              class="dropdown-box search-mode"
              placeholder="Tìm tỉnh..."
          />

          <div
              v-else
              class="dropdown-box"
              @click="openProvince"
          >
            {{ selectedProvinceText || "Tỉnh / Thành phố" }}
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
      <div>
        <div class="dropdown-wrapper" @click.stop>

          <input
              v-if="showWard"
              v-model="wardSearch"
              class="dropdown-box search-mode"
              placeholder="Tìm phường..."
          />

          <div
              v-else
              class="dropdown-box"
              :class="{ disabled: !wards.length }"
              @click="openWard"
          >
            {{ selectedWardText || "Phường / Xã" }}
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
      <div>
        <input
            v-model="street"
            type="text"
            class="street-input"
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

  const parts = props.modelValue.split("/");
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
/* Ô input & select */
.dropdown-box,
.street-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #d0d7e2;
  background: white;
  font-size: 14px;
}

/* SEARCH MODE */
.dropdown-box.search-mode {
  border-color: #0d6efd;
  cursor: text;
}

/* Disable */
.dropdown-box.disabled {
  background: #f3f3f3;
  pointer-events: none;
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
  background: white;
  border: 1px solid #d0d7e2;
  border-radius: 12px;
  margin-top: 4px;
  max-height: 240px;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* Items */
.dropdown-item {
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #eef6ff;
  color: #0d6efd;
}

.empty {
  padding: 10px;
  text-align: center;
  color: #777;
}
.address-grid {
  display: grid;
  width: 100%;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

/* STREET full width khi xuống dòng */
.address-grid > div:nth-child(3) {
  grid-column: 1 / -1;
}

</style>
