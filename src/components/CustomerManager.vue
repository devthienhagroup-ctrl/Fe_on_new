<template>
  <div class="d-flex flex-column h-100">
    <!-- Header -->
    <div
        class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2 border-bottom"
        style="border-color: rgba(0, 0, 0, 0.3)"
    >
      <h5 class="fw-bold mb-0 d-flex align-items-center text-dark">
        <i class="fa-solid fa-user-tie me-2 text-primary"></i> Quản lý khách hàng
      </h5>

      <div class="d-flex align-items-center justify-content-end gap-2">
        <NotificationBell />
        <div class="d-flex flex-column align-items-end text-end">
          <div class="fw-semibold text-dark">{{ info.fullName }}</div>
        </div>

        <img
            v-if="info.avatarUrl"
            :src="' https://s3.cloudfly.vn/thg-storage/uploads-public/' + info.avatarUrl"
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
        <div class="card-header fw-semibold border-bottom rounded-top-3 form-header">
          {{ isEditing ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới' }}
        </div>

        <div class="p-4 position-relative">
          <div v-if="isLoading" class="loading-overlay">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Tên -->
          <div class="mb-3">
            <label class="form-label fw-medium">Tên khách hàng <span class="text-danger">*</span></label>
            <input
                v-model="form.customerName"
                type="text"
                class="form-control form-control-sm py-2"
                placeholder="Nhập tên khách hàng"
                style="font-size: 15px; border-radius: 12px"
            />
          </div>

          <!-- SĐT -->
          <div class="mb-3">
            <label class="form-label fw-medium">Số điện thoại <span class="text-danger">*</span></label>
            <input
                v-model="form.customerPhone"
                type="text"
                class="form-control form-control-sm py-2"
                placeholder="Nhập số điện thoại"
                style="font-size: 15px; border-radius: 12px"
            />
          </div>

          <!-- Địa chỉ -->
          <div class="mb-3">
            <label class="form-label fw-medium">Địa chỉ</label>
            <div class="d-flex flex-column gap-2">
              <select
                  v-model="form.provinceCode"
                  class="form-select form-select-sm py-2"
                  @change="onProvinceChange"
              >
                <option value="">-- Chọn tỉnh / thành phố --</option>
                <option v-for="p in provinces" :key="p.code" :value="p.code">
                  {{ p.name }}
                </option>
              </select>

              <select
                  v-model="form.wardCode"
                  class="form-select form-select-sm py-2"
                  :disabled="!wards.length"
              >
                <option value="">-- Chọn phường / xã --</option>
                <option v-for="w in wards" :key="w.code" :value="w.code">
                  {{ w.name }}
                </option>
              </select>

              <input
                  v-model="form.street"
                  type="text"
                  class="form-control form-control-sm py-2"
                  placeholder="Số nhà, tên đường"
                  style="font-size: 15px; border-radius: 12px"
              />
            </div>
          </div>

          <!-- Nút hành động -->
          <div class="d-flex justify-content-end gap-2 mt-3 flex-wrap">
            <button class="btn btn-outline-secondary btn-sm px-3" @click="resetForm">
              <i class="fa-solid fa-rotate-left me-1"></i> Làm mới
            </button>
            <button
                v-if="!isEditing"
                class="btn btn-primary btn-sm px-3"
                @click="saveCustomer"
            >
              <i class="fa-solid fa-plus me-1"></i> Thêm mới
            </button>
            <button
                v-else
                class="btn btn-success btn-sm px-3"
                @click="saveCustomer"
            >
              <i class="fa-solid fa-save me-1"></i> Cập nhật
            </button>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="table-section card border rounded-4 shadow-sm overflow-hidden d-flex flex-column">
        <!-- Header: bộ lọc, tìm kiếm, size -->
        <div
            class="card-header fw-semibold border-bottom rounded-top-3 table-header d-flex flex-wrap justify-content-between align-items-center gap-2"
        >
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <span>Danh sách khách hàng</span>
            <!-- Bộ lọc tỉnh -->
            <select
                v-model="filterProvince"
                class="form-select form-select-sm"
                style="width: 200px"
                @change="onFilterChange"
            >
              <option value="">-- Tất cả tỉnh / thành --</option>
              <option v-for="p in provinces" :key="p.code" :value="p.code">
                {{ p.name }}
              </option>
            </select>
          </div>

          <div class="d-flex align-items-center gap-2 flex-wrap">
            <!-- Ô tìm kiếm nhỏ -->
            <input
                v-model="searchText"
                type="text"
                class="form-control form-control-sm"
                placeholder="Tìm tên / SĐT..."
                style="width: 150px"
                @input="onSearch"
            />

            <!-- Nhập size -->
            <input
                v-model.number="pageSize"
                type="number"
                class="form-control form-control-sm text-center"
                style="width: 70px"
                min="5"
                max="50"
                step="5"
                @change="onFilterChange"
            />
          </div>
        </div>

        <!-- Bảng -->
        <div class="table-container flex-grow-1 overflow-auto">
          <table class="table align-middle modern-table mb-0">
            <thead>
            <tr>
              <th style="width: 5%">#</th>
              <th style="width: 25%">Tên</th>
              <th style="width: 10%">SĐT</th>
              <th style="width: 45%">Địa chỉ</th>
              <th style="width: 15%" class="text-center">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="customers.length === 0">
              <td colspan="5" class="text-center text-muted py-4">
                <i class="fa-regular fa-folder-open fa-lg mb-2"></i><br />
                Không có khách hàng nào
              </td>
            </tr>

            <tr v-for="(c, index) in customers" :key="c.customerPhone">
              <td>{{ index + 1 + pageNo * pageSize }}</td>
              <td class="fw-semibold text-dark">{{ c.customerName }}</td>
              <td>{{ c.customerPhone }}</td>
              <td>{{ formatAddress(c.address) }}</td>
              <td class="text-center">
                <button class="btn icon-btn btn-edit me-1" @click="editCustomer(c)">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button v-if="authStore.listAuthority.includes('CUSTOMER_DELETE')" class="btn icon-btn btn-delete" @click="deleteCustomer(c)">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer: phân trang -->
        <div
            class="card-footer bg-light border-top d-flex justify-content-between align-items-center py-2 px-3 small"
        >
          <div>Trang {{ pageNo + 1 }} / {{ totalPages }}</div>
          <div class="d-flex align-items-center gap-1">
            <button
                class="btn btn-sm btn-outline-primary"
                :disabled="pageNo === 0"
                @click="toFirstPage"
            >
              <i class="fa-solid fa-angles-left"></i>
            </button>
            <button
                class="btn btn-sm btn-outline-primary"
                :disabled="pageNo === 0"
                @click="prevPage"
            >
              <i class="fa-solid fa-angle-left"></i>
            </button>
            <button
                class="btn btn-sm btn-outline-primary"
                :disabled="pageNo >= totalPages - 1"
                @click="nextPage"
            >
              <i class="fa-solid fa-angle-right"></i>
            </button>
            <button
                class="btn btn-sm btn-outline-primary"
                :disabled="pageNo >= totalPages - 1"
                @click="toLastPage"
            >
              <i class="fa-solid fa-angles-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import Swal from 'sweetalert2'
import { showSuccess } from '../assets/js/alertService.js'
import api from '../api/api.js'
import addressData from '../assets/js/address.json'
import {useAuthStore} from "../stores/authStore.js";
import NotificationBell from "./NotificationBell.vue";
const authStore = useAuthStore();
const info = authStore.userInfo;

const provinces = ref(addressData)
const wards = ref([])
const isEditing = ref(false)
const isLoading = ref(false)

const form = ref({
  customerName: '',
  customerPhone: '',
  street: '',
  provinceCode: '',
  wardCode: ''
})

// ========== CRUD ==========
const saveCustomer = async () => {
  if (!form.value.customerName || !form.value.customerPhone) {
    Swal.fire('Thiếu thông tin', 'Vui lòng nhập đầy đủ tên và số điện thoại!', 'warning')
    return
  }
  const fullAddress = [form.value.provinceCode, form.value.wardCode, form.value.street].filter(Boolean).join('|')
  const payload = { ...form.value, address: fullAddress }

  if (isEditing.value) {
    await api.put(`/admin.thg/customer/update/${form.value.customerPhone}`, payload, { withCredentials: true })
    showSuccess('Cập nhật khách hàng thành công!')
  } else {
    await api.post(`/admin.thg/customer/create`, payload, { withCredentials: true })
    showSuccess('Thêm mới khách hàng thành công!')
  }
  resetForm()
  fetchCustomersPaged()
}

const editCustomer = async (c) => {
  isEditing.value = true
  form.value.customerName = c.customerName
  form.value.customerPhone = c.customerPhone
  const [provinceCode, wardCode, streetDetail] = (c.address || '').split('|').map(x => x.trim())
  form.value.street = streetDetail || ''
  form.value.provinceCode = provinceCode || ''
  const province = provinces.value.find(p => p.code == provinceCode)
  if (province) {
    wards.value = province.wards || []
    await nextTick()
    const ward = wards.value.find(w => w.code == wardCode)
    form.value.wardCode = ward ? ward.code : ''
  } else {
    wards.value = []
    form.value.wardCode = ''
  }
}

const deleteCustomer = async (c) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa',
    text: `Bạn có chắc muốn xóa khách hàng "${c.customerName}" không?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#d33'
  })
  if (result.isConfirmed) {
    await api.delete(`/admin.thg/customer/delete/${c.customerPhone}`, { withCredentials: true })
    showSuccess('Xóa khách hàng thành công!')
    fetchCustomersPaged()
  }
}

// ========== Address ==========
const onProvinceChange = () => {
  const province = provinces.value.find(p => p.code === form.value.provinceCode)
  wards.value = province ? province.wards || [] : []
  form.value.wardCode = ''
}

// ========== Pagination, Filter, Search ==========
const customers = ref([])
const searchText = ref('')
const filterProvince = ref('')
const pageNo = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)

const formatAddress = (address) => {
  if (!address) return ''
  const [provinceCode, wardCode, detail] = address.split('|')
  const province = provinces.value.find(p => p.code == provinceCode)
  const ward = province?.wards?.find(w => w.code == wardCode)
  return [detail, ward?.name, province?.name].filter(Boolean).join(', ')
}

const fetchCustomersPaged = async () => {
  try {
    const res = await api.get('/admin.thg/customer/search', {
      params: {
        keyword: searchText.value || '',
        pageNo: pageNo.value,
        size: pageSize.value,
        provinceCode: filterProvince.value || null
      },
      withCredentials: true
    })
    customers.value = res.data.content
    totalPages.value = res.data.page.totalPages
    console.log(res.data)
  } catch (err) {
    console.error('❌ Lỗi khi tải khách hàng:', err)
  }
}

const onSearch = () => {
  pageNo.value = 0
  fetchCustomersPaged()
}

const onFilterChange = () => {
  if (pageSize.value < 5) pageSize.value = 5
  if (pageSize.value > 50) pageSize.value = 50
  pageNo.value = 0
  fetchCustomersPaged()
}

const nextPage = () => {
  if (pageNo.value < totalPages.value - 1) {
    pageNo.value++
    fetchCustomersPaged()
  }
}
const prevPage = () => {
  if (pageNo.value > 0) {
    pageNo.value--
    fetchCustomersPaged()
  }
}
const toFirstPage = () => {
  pageNo.value = 0
  fetchCustomersPaged()
}
const toLastPage = () => {
  pageNo.value = totalPages.value - 1
  fetchCustomersPaged()
}

const resetForm = () => {
  isEditing.value = false
  form.value = { customerName: '', customerPhone: '', street: '', provinceCode: '', wardCode: '' }
  wards.value = []
}

onMounted(fetchCustomersPaged)
</script>

<style scoped>
.main-layout {
  display: flex;
  gap: 20px;
  height: calc(100vh - 120px);
}

.form-section {
  width: 32%;
  min-width: 340px;
}

.table-section {
  flex: 1;
}

.form-header {
  background: #3b82f6;
  color: white;
  font-weight: 600;
  font-size: 15px;
  padding: 10px 16px;
  border-radius: 12px 12px 0 0;
}

.table-header {
  background: #2563eb;
  color: white;
  font-weight: 600;
  font-size: 15px;
  padding: 8px 16px;
  border-radius: 12px 12px 0 0;
}

.card-footer button {
  min-width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.modern-table {
  font-size: 15px;
}
.modern-table th {
  background: #f9fafb;
}
.modern-table tr:hover td {
  background: #f3f4f6;
}

.icon-btn {
  border-radius: 6px;
  padding: 6px 10px;
}
.btn-edit {
  background: #ecfdf5;
  color: #059669;
}
.btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
</style>
