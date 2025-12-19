<template>
  <div class="d-flex flex-column h-100">
    <!-- Header -->
    <div
        class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2 border-bottom"
        style="border-color: rgba(0, 0, 0, 0.3)"
    >
      <h5 class="fw-bold mb-0 d-flex align-items-center">Quản lý loại hạng mục</h5>

      <div class="d-flex align-items-center justify-content-end gap-2">
        <NotificationBell />
        <div class="d-flex flex-column align-items-end text-end">
          <div class="fw-semibold text-dark">{{ info.fullName }}</div>
        </div>

        <img
            v-if="info.avatarUrl"
            :src="' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + info.avatarUrl"
            alt="avatar"
            class="rounded-circle border"
            style="width: 36px; height: 36px; object-fit: cover;"
        />
        <div v-else class="avatar-circle">
          {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
        </div>
      </div>
    </div>

    <!-- Nội dung -->
    <div class="main-layout px-3">
      <!-- Form -->
      <div class="form-section card border rounded-4 shadow-sm">
        <div class="card-header fw-semibold border-bottom rounded-top-3 form-header">
          Thêm / sửa loại hạng mục
        </div>

        <div class="p-4 position-relative">
          <div v-if="detailLoading" class="loading-overlay">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Icon preview -->
          <div class="text-center mb-4">
            <i :class="resolvedFormIcon" :style="{ color: typeForm.color || '#1274e5', fontSize: '64px' }"></i>
            <div class="text-muted small mt-2">Icon hiển thị</div>
          </div>

          <!-- Name -->
          <div class="form-row align-items-center my-4">
            <label class="form-label fw-medium">
              Tên phân loại <span class="text-danger">*</span>
            </label>
            <div class="flex-grow-1 field-control">
              <input
                  type="text"
                  v-model="typeForm.name"
                  class="form-control form-control-sm py-2"
                  placeholder="Nhập tên dự án"
                  style="font-size: 16px; border-radius: 12px;"
              />
            </div>
          </div>

          <!-- Color -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Màu sắc</label>
            <div class="d-flex align-items-center gap-2">
              <input
                  v-model="typeForm.color"
                  type="color"
                  class="color-picker"
              />
                      <span class="color-label fw-semibold text-uppercase">
              {{ typeForm.color || '#1274e5' }}
            </span>
            </div>
          </div>

          <!-- Icon -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Icon</label>
            <div class="d-flex align-items-center gap-2">
              <i :class="resolvedFormIcon" :style="{ color: typeForm.color || '#1274e5', fontSize: '22px' }"></i>
              <button class="btn btn-outline-primary btn-sm" type="button" @click="openIconModal">
                <i class="fa-solid fa-icons me-1"></i>
                Chọn icon
              </button>
            </div>
          </div>

          <!-- Type Option -->
          <div class="mb-4">
            <label class="form-label fw-semibold">Phân loại</label>
            <div class="d-flex gap-2 flex-wrap type-option-container">
              <label class="type-option flex-fill" :class="{ active: typeForm.workTypeFlag === true }">
                <input type="radio" v-model="typeForm.workTypeFlag" :value="true" hidden />
                <i class="fa-solid fa-briefcase me-2"></i> Công việc
              </label>
              <label class="type-option flex-fill" :class="{ active: typeForm.workTypeFlag === false }">
                <input type="radio" v-model="typeForm.workTypeFlag" :value="false" hidden />
                <i class="fa-solid fa-diagram-project me-2"></i> Dự án
              </label>
            </div>
          </div>

          <!-- Buttons -->
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button class="btn btn-outline-secondary btn-sm px-3" type="button" @click="resetForm">
              Làm mới
            </button>
            <button
                v-if="!isEditing &&  authStore.listAuthority.includes('TYPE_CREATE')"
                class="btn btn-primary btn-sm px-3"
                type="button"
                @click="addType"
            >
              <i class="fas fa-plus me-1"></i> Thêm mới
            </button>
            <button
                v-else-if=" authStore.listAuthority.includes('TYPE_UPDATE')"
                class="btn btn-success btn-sm px-3"
                type="button"
                @click="updateType"
            >
              <i class="fas fa-save me-1"></i> Cập nhật
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-section card border rounded-4 shadow-sm overflow-hidden d-flex flex-column">
        <div class="card-header fw-semibold border-bottom rounded-top-3 table-header">
          <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span>Danh sách phân loại</span>
            <div class="btn-group btn-group-sm">
              <button
                  type="button"
                  class="btn view-btn"
                  :class="{ active: filterFlag === 'all' }"
                  @click="setFilter('all')"
              >
                Tất cả
              </button>
              <button
                  type="button"
                  class="btn view-btn"
                  :class="{ active: filterFlag === 'work' }"
                  @click="setFilter('work')"
              >
                Công việc
              </button>
              <button
                  type="button"
                  class="btn view-btn"
                  :class="{ active: filterFlag === 'asset' }"
                  @click="setFilter('asset')"
              >
                Dự án
              </button>
            </div>
          </div>
        </div>

        <div class="table-container flex-grow-1 overflow-auto">
          <table class="table align-middle modern-table mb-0">
            <thead>
            <tr>
              <th class="text-center" style="width: 10%">STT</th>
              <th style="width: 30%">Tên loại</th>
              <th class="text-center" style="width: 20%">Icon</th>
              <th class="text-center" style="width: 20%">Phân loại</th>
              <th class="text-center" style="width: 20%">Hành động</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="filteredTypes.length === 0">
              <td colspan="4" class="text-center text-muted py-4">
                Không có loại nào phù hợp.
              </td>
            </tr>
            <tr
                v-else
                v-for="(type, index) in filteredTypes"
                :key="type.id ?? index"
                :class="{ 'selected-row': type.id === selectedTypeId }"
            >
              <td class="text-center"> {{ index + 1 }} </td>
              <td class="align-middle ps-4">{{ type.name }}</td>
              <td class="text-center">
                <i :class="resolveIconClass(type.icon)" :style="{ color: type.color || '#1274e5', fontSize: '20px' }"></i>
              </td>
              <td class="text-center">
                  <span
                      :class="type.workTypeFlag ? 'bg-soft-primary text-primary' : 'bg-soft-success text-success'"
                  >
                    {{ type.workTypeFlag ? 'Công việc' : 'Dự án' }}
                  </span>
              </td>
              <td class="text-center">
                <button  class="btn icon-btn btn-edit me-1" @click="handleEditType(type)">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button v-if=" authStore.listAuthority.includes('TYPE_DELETE')" class="btn icon-btn btn-delete" @click="handleDeleteType(type)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal chọn icon -->
    <div v-if="showIconModal" class="icon-modal-backdrop" @click.self="closeIconModal">
      <div class="icon-modal card" style="border-radius: 25px">
        <div class="icon-modal-header d-flex justify-content-between align-items-center"
             style="border-radius: 25px 25px 0 0; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);">
          <span class="fw-semibold">Chọn icon Font Awesome 6</span>
          <button type="button" class="btn-close" @click="closeIconModal"></button>
        </div>
        <div class="icon-modal-body" style="border-radius: 0 0 25px 25px">
          <div v-for="entry in iconEntries" :key="entry.key" class="mb-4">
            <div class="fw-semibold text-capitalize small mb-2">{{ entry.key }}</div>
            <div class="icon-grid">
              <button
                  v-for="icon in entry.icons"
                  :key="icon"
                  type="button"
                  class="icon-option"
                  :class="{ active: icon === typeForm.icon }"
                  @click="selectIcon(icon)"
              >
                <i :class="icon" :style="{ color: typeForm.color || '#1274e5' }"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '../api/api.js'
import FA6 from '../assets/js/FA6icons.json'
import {showError, showSuccess, showWarning} from "../assets/js/alertService.js"; // dùng file tạo bằng script trong cheat sheet
import { useAuthStore } from "../stores/authStore.js"

const authStore = useAuthStore()
const info = authStore.userInfo

const isLoading = ref(false)
const detailLoading = ref(false)
const types = ref([])
const usingFallback = ref(false)
const selectedTypeId = ref(null)
const showIconModal = ref(false)
const filterFlag = ref('all')
const typeForm = ref(createDefaultForm())

const iconEntries = computed(() =>
    Object.entries(FA6 || {}).map(([key, icons]) => ({ key, icons }))
)

const filteredTypes = computed(() => {
  if (filterFlag.value === 'work') return types.value.filter(t => t.workTypeFlag)
  if (filterFlag.value === 'asset') return types.value.filter(t => !t.workTypeFlag)
  return types.value
})

const isEditing = computed(() => typeForm.value.id !== null)
const resolvedFormIcon = computed(() => resolveIconClass(typeForm.value.icon))


function validateTypeForm() {
  const f = typeForm.value

  // Tên
  if (!f.name || f.name.trim() === "") {
    showWarning("Dữ liệu chưa hợp lệ!", "Tên phân loại không được bỏ trống.")
    return false
  }

  if (f.name.length < 3) {
    showWarning("Dữ liệu chưa hợp lệ!", "Tên phân loại phải có ít nhất 3 ký tự.")
    return false
  }

  if (f.name.length > 50) {
    showWarning("Dữ liệu chưa hợp lệ!", "Tên phân loại quá dài (tối đa 50 ký tự).")
    return false
  }

  // Icon
  if (!f.icon || f.icon.trim() === "") {
    showWarning("Dữ liệu chưa hợp lệ!", "Bạn cần chọn một icon.")
    return false
  }

  // Color
  const hexRegex = /^#([0-9A-Fa-f]{6})$/
  if (!hexRegex.test(f.color)) {
    showWarning("Dữ liệu chưa hợp lệ!", "Mã màu không hợp lệ. Ví dụ: #1274e5")
    return false
  }

  // workTypeFlag
  if (f.workTypeFlag === null || f.workTypeFlag === undefined) {
    showWarning("Dữ liệu chưa hợp lệ!", "Bạn cần chọn loại phân loại (Dự án hoặc Công việc).")
    return false
  }

  return true
}


function createDefaultForm() {
  return { id: null, name: '', icon: 'fa-solid fa-tag', color: '#1274e5', workTypeFlag: true, projects: 0, works: 0 }
}
function resolveIconClass(icon) {
  if (!icon) return 'fa-solid fa-tag'
  if (icon.includes('fa-')) return icon
  return 'fa-solid fa-tag'
}
async function fetchTypes() {
  isLoading.value = true
  try {
    const res = await api.get('/admin.thg/type/get_types', { withCredentials: true })
    types.value = Array.isArray(res.data) ? res.data : []
  } catch {
    types.value = []
  } finally {
    isLoading.value = false
  }
}

//=============== Hàm tạo phân loại ====================
async function addType() {isLoading.value = true
  if (!validateTypeForm()) return
  try {
    const res = await api.post(
        '/admin.thg/type/create',
        typeForm.value, // this is the request body
        { withCredentials: true } // this is the config
    );
    console.log(typeForm.value)
    resetForm();
    showSuccess("Thêm phân loại thành công!");
    await fetchTypes();
  } catch (error) {
  }  finally {
    isLoading.value = false
  } }


//================Hàm cập nhật loại ==================
async function updateType() {
  isLoading.value = true
  if (!validateTypeForm()) return
  try {
    const res = await api.post(
        '/admin.thg/type/update',
        typeForm.value, // this is the request body
        { withCredentials: true } // this is the config
    );
    showSuccess("Cập nhật phân loại thành công!");
    await fetchTypes();
    console.log('Update type response:', res.data)
  } catch (error) {
  }  finally {
    isLoading.value = false
  }
}


function handleEditType(type) { typeForm.value = { ...type } }

import Swal from 'sweetalert2'
import NotificationBell from "./NotificationBell.vue";

//================Hàm xóa phân loại ==================
async function handleDeleteType(type) {
  console.log(type)
  // Hiển thị cảnh báo nếu có dự án hoặc công việc
  if (type.projects > 0 || type.works > 0) {
    const result = await Swal.fire({
      title: 'Xác nhận hành động',
      text: `Loại này có ${type.projects} dự án và ${type.works} công việc. Bạn có chắc muốn tiếp tục không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, tiếp tục',
      cancelButtonText: 'Hủy',
    });

    if (!result.isConfirmed) {
      console.log('Người dùng hủy');
      return;
    }
  }

  // ✅ Người dùng đồng ý → bắt đầu loading
  isLoading.value = true;

  try {
    const res = await api.delete('/admin.thg/type/remove', {
      withCredentials: true,
      params: { id: type.id },
    });

    showSuccess("Xóa phân loại thành công!");
    await fetchTypes();
    console.log('Delete type response:', res.data);
  } catch (error) {

  } finally {
    isLoading.value = false;
  }
}



function resetForm() { typeForm.value = createDefaultForm() }
function openIconModal() { showIconModal.value = true }
function closeIconModal() { showIconModal.value = false }
function selectIcon(icon) { typeForm.value.icon = icon; closeIconModal() }
function setFilter(flag) { filterFlag.value = flag }

onMounted(fetchTypes)
</script>

<style scoped>/* ====== HEADER / CARD ====== */
.form-header {
  background: #3b82f6;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 12px 12px 0 0;
}

.table-header {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 12px 12px 0 0;
}

.form-section,
.table-section {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.main-layout {
  display: flex;
  gap: 20px;
  height: calc(100vh - 120px);
}

.form-section {
  width: 30%;
  min-width: 320px;
}

.table-section {
  flex: 1;
}

/* ====== TABLE ====== */
.modern-table {
  font-size: 15px;
  color: #374151;
}

.modern-table th {
  background: #f9fafb;
  color: #374151;
  font-weight: 600;
}

.modern-table th,
.modern-table td {
  padding: 8px 14px;
  border-bottom: 1px solid #e5e7eb;
}

.modern-table tr:hover td {
  background: #f3f4f6;
}

.selected-row td {
  background-color: #e0f2fe !important;
}

/* ====== BUTTONS ====== */
.icon-btn {
  border-radius: 6px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  font-size: 14px;
  padding: 5px 10px;
}

.btn-edit {
  background-color: #ecfdf5;
  border-color: #a7f3d0;
  color: #059669;
}

.btn-edit:hover {
  background-color: #d1fae5;
}

.btn-delete {
  background-color: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.btn-delete:hover {
  background-color: #fee2e2;
}

/* ====== FILTER BUTTONS ====== */
.view-btn {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #9aadd5;
}

.view-btn.active {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}

/* ====== TYPE SELECTOR ====== */
.type-option-container {
  display: flex;
  gap: 8px;
}

.type-option {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 0;
  text-align: center;
  cursor: pointer;
  font-size: 15px;
  color: #374151;
  transition: all 0.25s ease;
}

.type-option:hover {
  background: #f3f4f6;
  border-color: #93c5fd;
}

.type-option.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* ====== COLOR PICKER ====== */
.color-picker {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 2px;
}

/* ====== MODAL CHỌN ICON ====== */
.icon-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.icon-modal {
  background: #fff;
  width: 70%;
  max-width: 800px;
  max-height: 75vh;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.icon-modal-header {
  background: #3b82f6;
  padding: 10px 14px;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
}

.icon-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #fafafa;
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.icon-option {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-option:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

.icon-option.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* ====== SCROLLBAR ====== */
.icon-modal-body::-webkit-scrollbar {
  width: 8px;
}

.icon-modal-body::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}
/* Nhóm màu sắc */
.color-picker {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  border-radius: 10px;          /* Bo tròn nhẹ */
  border: 1px solid #d1d5db;
  padding: 0;                  /* Loại bỏ padding mặc định */
  cursor: pointer;
  background-color: transparent;
  align-items: center;
}

/* Ẩn khung viền đen mặc định của Chrome khi focus */
.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
  width: 80%;
  height: 80%;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 8px;
  /* Bo tròn bên trong khớp bên ngoài */
}

/* Nếu bạn dùng Firefox */
.color-picker::-moz-color-swatch {
  border: none;
  border-radius: 8px;

}

/* Đảm bảo căn giữa cùng span */
.d-flex.align-items-center.gap-2 {
  align-items: center;
  gap: 8px;
}

.color-label {
  display: inline-block;
  min-width: 80px;
  font-size: 14px;
  color: #374151;
}


</style>
