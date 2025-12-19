<template>
  <div class="d-flex flex-column h-100">
    <!-- Header -->
    <div
        class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2 border-bottom"
        style="border-color: rgba(0, 0, 0, 0.3)"
    >
      <h5 class="fw-bold mb-0 d-flex align-items-center text-dark">
        <i class="fa-solid fa-briefcase me-2 text-primary"></i> Quản lý dịch vụ
      </h5>

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

    <!-- Main layout -->
    <div class="main-layout px-3">
      <!-- Form Section -->
      <div class="form-section card border rounded-4 shadow-sm">
        <div class="card-header fw-semibold border-bottom rounded-top-4 form-header" style="background-color: #9bd5af">
          {{ isEditing ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới' }}
        </div>

        <div class="p-4 position-relative">
          <div v-if="isLoading" class="loading-overlay">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Form -->
          <div class="mb-4">
            <label class="form-label fw-medium">
              Tên dịch vụ <span class="text-danger">*</span>
            </label>
            <input
                v-model="form.serviceName"
                type="text"
                class="form-control form-control-sm py-2"
                placeholder="Nhập tên dịch vụ"
                style="font-size: 15px; border-radius: 12px"
            />
          </div>

          <div class="mb-4">
            <label class="form-label fw-medium">Mô tả</label>
            <DescriptionEditor v-model="form.description" />
          </div>

          <!-- Buttons -->
          <div class="d-flex justify-content-end gap-2 mt-3 flex-nowrap">
            <button
                class="btn btn-outline-secondary btn-sm px-3"
                type="button"
                @click="resetForm"
            >
              <i class="fa-solid fa-rotate-left me-1"></i> Làm mới
            </button>
            <button
                v-if="!isEditing && authStore.listAuthority.includes('SERVICE_CREATE')"
                class="btn btn-primary btn-sm px-3"
                type="button"
                @click="saveService"
            >
              <i class="fa-solid fa-plus me-1"></i> Thêm mới
            </button>
            <button
                v-else-if=" authStore.listAuthority.includes('SERVICE_UPDATE')"
                class="btn btn-success btn-sm px-3"
                type="button"
                @click="saveService"
            >
              <i class="fa-solid fa-save me-1"></i> Cập nhật
            </button>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-section card border rounded-4 shadow-sm overflow-hidden d-flex flex-column">
        <div class="card-header fw-semibold border-bottom rounded-top-3 table-header" style="background-color: #cbb56f">
          Danh sách dịch vụ
        </div>

        <div class="table-container flex-grow-1 overflow-auto">
          <table class="table align-middle modern-table mb-0">
            <thead>
            <tr>
              <th class="text-center" style="width: 10%">STT</th>
              <th style="width: 30%">Tên dịch vụ</th>
              <th style="width: 50%">Mô tả</th>
              <th class="text-center" style="width: 10%">Hành động</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="services.length === 0">
              <td colspan="4" class="text-center text-muted py-4">
                <i class="fa-regular fa-folder-open fa-lg mb-2"></i><br />
                Chưa có dịch vụ nào
              </td>
            </tr>

            <tr v-for="(service, index) in services" :key="service.serviceID">
              <td class="text-center fw-semibold">{{ index + 1 }}</td>
              <td class="fw-semibold text-dark">{{ service.serviceName }}</td>
              <td class="text-dark" style="font-size: 15px;">
                <!-- Trường mô tả hiển thị nội dung HTML từ Quill Editor -->
                <div
                    v-if="service.description"
                    class="description-view"
                    v-html="service.description"
                ></div>
                <span v-else>—</span>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center align-items-center gap-2">
                  <button
                      class="btn icon-btn btn-edit"
                      @click="editService(service)"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button
                      v-if="authStore.listAuthority.includes('SERVICE_DELETE')"
                      class="btn icon-btn btn-delete"
                      @click="handleDelete(service)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/api.js'
import Swal from 'sweetalert2'
import { showSuccess, confirmWithInput } from '../assets/js/alertService.js'
import { useAuthStore } from "../stores/authStore.js"
import DescriptionEditor from "./common/DescriptionEditor.vue"
import NotificationBell from "./NotificationBell.vue";

const authStore = useAuthStore()
const info = authStore.userInfo

const services = ref([])
const form = ref({ serviceID: null, serviceName: '', description: '' })
const isEditing = ref(false)
const isLoading = ref(false)

// 🧩 Load danh sách
const fetchServices = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/admin.thg/service/all', { withCredentials: true })
    services.value = res.data || []
  } catch (err) {

  } finally {
    isLoading.value = false
  }
}

// 🧩 Reset form
const resetForm = () => {
  form.value = { serviceID: null, serviceName: '', description: '' }
  isEditing.value = false
}

// 🧩 Thêm / Cập nhật dịch vụ
const saveService = async () => {
  if (!form.value.serviceName.trim()) {
    Swal.fire('Cảnh báo', 'Vui lòng nhập tên dịch vụ', 'warning')
    return
  }

  try {
    isLoading.value = true
    if (isEditing.value) {
      await api.put(`/admin.thg/service/update/${form.value.serviceID}`, form.value, {
        withCredentials: true,
      })
      showSuccess('Cập nhật dịch vụ thành công!')
    } else {
      await api.post(`/admin.thg/service/create`, form.value, { withCredentials: true })
      showSuccess('Thêm mới dịch vụ thành công!')
    }
    await fetchServices()
    resetForm()
  } catch (error) {

  } finally {
    isLoading.value = false
  }
}

// 🧩 Chỉnh sửa
const editService = (service) => {
  form.value = { ...service }
  isEditing.value = true
}

// 🧩 Xóa có xác nhận nhập tên
const handleDelete = async (service) => {
  await confirmWithInput(
      'Xác nhận xoá dịch vụ',
      `Nhập chính xác tên dịch vụ để xác nhận xoá: "${service.serviceName}"`,
      service.serviceName,
      async () => {
        try {
          await api.delete(`/admin.thg/service/delete/${service.serviceID}`, { withCredentials: true })
          showSuccess('Đã xoá dịch vụ thành công!')
          await fetchServices()
        } catch (error) {

        }
      }
  )
}

onMounted(fetchServices)
</script>

<style scoped>
/* ====== FORM / TABLE LAYOUT ====== */
.main-layout {
  display: flex;
  gap: 20px;
  height: calc(100vh - 120px);
}

.form-section {
  width: 30%;
  min-width: 340px;
}

.table-section {
  flex: 1;
}

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

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  z-index: 10;
}

/* ====== TABLE ====== */
.modern-table {
  font-size: 15.5px;
  color: #1f2937;
}
.modern-table th {
  background: #f9fafb;
  color: #111827;
  font-weight: 600;
}
.modern-table th,
.modern-table td {
  padding: 10px 14px;
  border-bottom: 1px solid #e5e7eb;
}
.modern-table tr:hover td {
  background: #f3f4f6;
}

/* ====== BUTTONS ====== */
.icon-btn {
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  font-size: 14px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

/* ====== AVATAR ====== */
.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
}
</style>
