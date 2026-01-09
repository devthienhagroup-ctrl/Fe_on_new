<!-- Save as: TeleSaleApp.vue -->
<template>
  <div id="app" class="telesale-app">
    <!-- Header -->
    <header class="app-header">
      <h1><i class="fas fa-phone-alt"></i> Hệ Thống Telesale</h1>
      <div class="user-info">
        <span>Nhân viên: Nguyễn Văn A</span>
        <button class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </div>
    </header>

    <div class="main-container" :class="{ 'with-detail': selectedCustomer }">
      <!-- Sidebar với thống kê -->
      <aside class="sidebar">
        <div class="stats-widget">
          <h3><i class="fas fa-chart-bar"></i> Thống kê hôm nay</h3>

          <div class="stat-item">
            <span class="stat-label">Khách lên VP:</span>
            <span class="stat-value">{{ todayStats.soKhachLenVP }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Liên hệ được:</span>
            <span class="stat-value success">{{ todayStats.soCuocGoiThanhCongHomNay }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Không liên lạc:</span>
            <span class="stat-value failed">{{ todayStats.khongLienLacDuoc }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Sai số:</span>
            <span class="stat-value warning">{{ todayStats.saiSo }}</span>
          </div>

          <!-- Progress: Liên hệ mới -->
          <div class="progress-container">
            <div class="progress-label">Liên hệ mới</div>
            <div class="progress-bar">
              <div
                  class="progress-fill progress-new"
                  :style="{
                  width: Math.min((todayStats.soCuocGoiMoiHN / 30) * 100, 100) + '%'
                }"
              ></div>
            </div>
            <div class="progress-text">{{ todayStats.soCuocGoiMoiHN }}/30 cuộc</div>
          </div>

          <!-- Progress: Chăm sóc -->
          <div class="progress-container mt-2">
            <div class="progress-label">Chăm sóc</div>
            <div class="progress-bar">
              <div
                  class="progress-fill progress-care"
                  :style="{
                  width: Math.min((todayStats.soCuocGoiChamSocHN / 20) * 100, 100) + '%'
                }"
              ></div>
            </div>
            <div class="progress-text">{{ todayStats.soCuocGoiChamSocHN }}/20 cuộc</div>
          </div>
        </div>

        <!-- Biểu đồ tổng hợp -->
        <div class="chart-widget">
          <h3><i class="fas fa-chart-pie"></i> Tổng hợp trạng thái</h3>
          <div class="chart-container">
            <canvas id="summaryChart"></canvas>
          </div>
        </div>
      </aside>

      <!-- Nội dung chính -->
      <main class="content-area">
        <!-- Thanh điều khiển -->
        <div class="control-bar">
          <div class="filter-controls">
            <div class="filter-group">
              <label for="timeRange">Thống kê:</label>
              <select id="timeRange" v-model="selectedTimeRange">
                <option value="year">Theo năm</option>
                <option value="month">Theo tháng</option>
              </select>
            </div>

            <div class="filter-group" v-if="selectedTimeRange === 'year'">
              <label for="yearSelect">Năm:</label>
              <select id="yearSelect" v-model="selectedYear">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>

            <div class="filter-group" v-if="selectedTimeRange === 'month'">
              <label for="monthSelect">Tháng:</label>
              <select id="monthSelect" v-model="selectedMonth">
                <option v-for="(month, index) in months" :key="index" :value="index + 1">
                  {{ month }}
                </option>
              </select>
            </div>

            <button class="refresh-btn" @click="refreshData">
              <i class="fas fa-sync-alt"></i> Làm mới
            </button>
          </div>
        </div>

        <!-- Biểu đồ đường -->
        <div class="chart-container-large">
          <h3>
            <i class="fas fa-chart-line"></i>
            Biểu đồ cuộc gọi theo {{ selectedTimeRange === 'year' ? 'năm' : 'tháng' }}
          </h3>
          <div class="chart-wrapper">
            <canvas ref="lineChart"></canvas>
          </div>
        </div>

        <!-- Danh sách khách hàng -->
        <div class="customer-section">
          <div class="section-header">
            <div class="section-title">
              <h3>
                <i class="fas fa-users"></i>
                {{ activeTab === 'new' ? 'Khách hàng vừa tiếp nhận' : 'Khách hàng đã liên hệ' }}
              </h3>

              <div class="view-controls">
                <button class="tab-btn" :class="{ active: activeTab === 'new' }" @click="activeTab = 'new'">
                  <i class="fas fa-user-plus"></i> Vừa tiếp nhận ({{ newCustomers.length }})
                </button>
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'contacted' }"
                    @click="activeTab = 'contacted'"
                >
                  <i class="fas fa-user-check"></i> Đã liên hệ ({{ contactedCustomers.length }})
                </button>
              </div>
            </div>

            <div class="section-controls">
              <div class="filter-group status-filter" v-if="activeTab === 'contacted'">
                <label for="statusFilter">Trạng thái:</label>
                <select id="statusFilter" v-model="statusFilter">
                  <option :value="null">Tất cả</option>
                  <option value="THANH_CONG">Thành công</option>
                  <option value="TN_7NGAY">Tiềm năng 7 ngày</option>
                  <option value="TN_14NGAY">Tiềm năng 14 ngày</option>
                  <option value="KHONG_LIEN_LAC_DUOC">Không liên lạc</option>
                  <option value="SAI_SO_LIEU">Sai số</option>
                  <option value="CHAM_SOC">Chăm sóc</option>
                  <option value="THAT_BAI">Thất bại</option>
                </select>
              </div>

              <div class="filter-group type-filter">
                <label for="typeFilter">Phân loại:</label>
                <select id="typeFilter" v-model="typeFilter">
                  <option :value="null">Tất cả</option>
                  <option value="CHINH_CHU">Chủ nhà</option>
                  <option value="MOI_GIOI">Môi giới</option>
                  <option value="NGUOI_THAN">Người thân</option>
                </select>
              </div>

              <div class="search-box">
                <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên, số điện thoại..." />
                <i class="fas fa-search"></i>
              </div>
            </div>
          </div>

          <!-- Danh sách khách hàng -->
          <div class="customer-list">
            <div
                v-for="customer in pagedCustomers"
                :key="customer.id"
                class="customer-card"
                :class="{ selected: selectedCustomer && selectedCustomer.id === customer.id }"
                @click="selectCustomer(customer)"
            >
              <div class="customer-avatar">
                <div class="avatar-initials" :style="{ backgroundColor: getAvatarColor(customer.name) }">
                  {{ getInitials(customer.name) }}
                </div>
                <span :class="`customer-type ${customer.type}`">{{ getCustomerTypeLabel(customer.type) }}</span>
              </div>

              <div class="customer-info">
                <h4 class="customer-name">{{ customer.name }}</h4>

                <p class="customer-phone">
                  <i class="fas fa-phone"></i> {{ customer.phone }}
                </p>

                <p class="customer-received">
                  <i class="fas fa-clock"></i> Tiếp nhận: {{ formatReceivedAt(customer.receivedAt) }}
                </p>

                <div class="customer-location">
                  <span class="location-current">
                    <i class="fas fa-map-marker-alt"></i> {{ customer.province }}
                  </span>
                  <span v-if="customer.oldProvince" class="location-old">(Cũ: {{ customer.oldProvince }})</span>
                </div>

                <div class="customer-tags" v-if="Array.isArray(customer.tags) && customer.tags.length">
                  <span v-for="tag in customer.tags" :key="tag" class="customer-tag" :class="tag">
                    {{ getTagLabel(tag) }}
                  </span>
                </div>
              </div>

              <div class="customer-actions">
                <div class="contact-icons">
                  <a class="contact-icon zalo" :href="`zalo:${customer.phone}`" title="Zalo" @click.stop>
                    <i class="fas fa-comment-dots"></i> zalo: {{ customer.phone }}
                  </a>
                  <a class="contact-icon tel" :href="`tel:${customer.phone}`" title="Điện thoại" @click.stop>
                    <i class="fas fa-phone"></i> tel: {{ customer.phone }}
                  </a>
                </div>
                <div class="call-status" v-if="customer.lastCall">
                  <i class="fas fa-clock"></i> {{ formatTime(customer.lastCall) }}
                </div>
              </div>
            </div>
          </div>

          <div class="pagination" v-if="activeTab === 'contacted' && totalPages > 1">
            <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
              <i class="fas fa-chevron-left"></i>
            </button>

            <button
                v-for="page in pageNumbers"
                :key="`page-${page}`"
                class="page-btn"
                :class="{ active: currentPage === page }"
                @click="changePage(page)"
            >
              {{ page }}
            </button>

            <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>

            <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>

      <!-- Panel chi tiết khách hàng -->
      <div class="detail-panel" v-if="selectedCustomer">
        <div class="detail-header">
          <h3>Chi tiết khách hàng</h3>
          <button class="close-btn" @click="selectedCustomer = null">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="detail-content" v-if="selectedCustomer">
          <div class="customer-detail-header">
            <div
                class="detail-avatar avatar-initials"
                :style="selectedCustomer ? { backgroundColor: getAvatarColor(selectedCustomer.name) } : {}"
            >
              {{ selectedCustomer ? getInitials(selectedCustomer.name) : '' }}
            </div>

            <div class="detail-name-info">
              <h4>{{ selectedCustomer ? selectedCustomer.name : '' }}</h4>
              <p class="detail-phone">{{ selectedCustomer ? selectedCustomer.phone : '' }}</p>
              <p class="detail-received">
                Tiếp nhận: {{ selectedCustomer ? formatReceivedAt(selectedCustomer.receivedAt) : '' }}
              </p>
              <p class="detail-type">
                <span :class="selectedCustomer ? `type-badge ${selectedCustomer.type}` : 'type-badge'">
                  {{ selectedCustomer ? getCustomerTypeLabel(selectedCustomer.type) : '' }}
                </span>
              </p>
            </div>
          </div>

          <div class="detail-section">
            <h5><i class="fas fa-map-marked-alt"></i> Thông tin địa chỉ</h5>
            <div class="detail-row">
              <span class="detail-label">Tỉnh hiện tại:</span>
              <span class="detail-value">{{ selectedCustomer.province }}</span>
            </div>
            <div class="detail-row" v-if="selectedCustomer.oldProvince">
              <span class="detail-label">Tỉnh cũ:</span>
              <span class="detail-value">{{ selectedCustomer.oldProvince }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h5><i class="fas fa-tags"></i> Đánh dấu khách hàng</h5>
            <div class="tag-selector">
              <button
                  v-for="tag in availableTags"
                  :key="tag.value"
                  class="tag-option"
                  :class="{ active: isTagActive(tag.value) }"
                  :style="isTagActive(tag.value) ? { backgroundColor: tag.color, borderColor: tag.color, color: '#fff' } : {}"
                  @click="toggleCustomerStatus(tag.value)"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>

          <div class="detail-section">
            <h5>
              <i class="fas fa-sticky-note"></i>Mô tả:
              <span style="font-size: 14px; color: #4A4A4A; font-weight: 400">
                {{ selectedCustomer.note !== '' ? selectedCustomer.note : 'Không có' }}
              </span>
            </h5>
          </div>

          <FileNew
              v-if="selectedCustomer"
              :key="'request-new-asset'"
              :file-list="fileForm.files"
              :entity-id="selectedCustomer.id"
              :allow-download-all="true"
              entity-type="host"
              :can-edit="true"
              :on-upload="true"
              class="mt-2"
              @update:files="handleFileUpdate"
          />

          <div class="add-note-form">
            <textarea v-model="newNote" placeholder="Thêm ghi chú cuộc gọi..." rows="3"></textarea>
          </div>

          <div class="detail-actions">
            <button class="action-btn move-btn" @click="moveToContacted">
              <i class="fas fa-save"></i> Lưu thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import api from '/src/api/api.js'
import FileNew from './File.vue'

// ====== META ======
const STATUS_META = {
  NEW: { label: 'Mới', color: '#94a3b8' },
  DC_TELESALES: { label: 'Mới tiếp nhận', color: '#6366f1' },
  CHAM_SOC: { label: 'Đang chăm sóc', color: '#38bdf8' },
  TN_7NGAY: { label: 'Tiềm năng 7 ngày', color: '#0ea5e9' },
  TN_14NGAY: { label: 'Tiềm năng 14 ngày', color: '#0284c7' },
  THAT_BAI: { label: 'Thất bại', color: '#f43f5e' },
  KHONG_LIEN_LAC_DUOC: { label: 'Không liên lạc được', color: '#f97316' },
  SAI_SO_LIEU: { label: 'Sai số liệu', color: '#a855f7' },
  THANH_CONG: { label: 'Thành công (Lên VP)', color: '#22c55e' }
}

// ====== Reactive state ======
const activeTab = ref('new')
const selectedCustomer = ref(null)
const newNote = ref('')
const searchQuery = ref('')
const originalFiles = ref([])

const fileForm = ref({
  files: [],
  newFiles: [],
  newLandBookFiles: [],
  deletedFileIds: [],
  deletedLandBookFileIds: []
})

// ✅ FIX all -> null
const statusFilter = ref(null)
const typeFilter = ref(null)

const currentPage = ref(1)
const pageSize = ref(1)

const selectedTimeRange = ref('month')
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)

const lineChart = ref(null)
const lineChartInstance = ref(null)
const summaryChartInstance = ref(null)

// ✅ years = 5 năm gần nhất
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

const months = [
  'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'
]

const isTagActive = (value) => selectedCustomer.value?.status === value

// ====== Sidebar stats ======
const todayStats = ref({
  soCuocGoiMoiHN: 0,
  soCuocGoiThanhCongHomNay: 0,
  soKhachLenVP: 0,
  khongLienLacDuoc: 0,
  saiSo: 0,
  soCuocGoiChamSocHN: 0
})

// ====== Tags ======
const availableTags = [
  { value: 'CHAM_SOC', label: 'Đang chăm sóc', color: '#38bdf8' },
  { value: 'TN_7NGAY', label: 'Tiềm năng 7 ngày', color: '#0ea5e9' },
  { value: 'TN_14NGAY', label: 'Tiềm năng 14 ngày', color: '#0284c7' },
  { value: 'THAT_BAI', label: 'Thất bại', color: '#f43f5e' },
  { value: 'KHONG_LIEN_LAC_DUOC', label: 'Không liên lạc được', color: '#f97316' },
  { value: 'SAI_SO_LIEU', label: 'Sai số liệu', color: '#a855f7' },
  { value: 'THANH_CONG', label: 'Thành công (Lên VP)', color: '#22c55e' }
]

// ====== Data from API ======
const newCustomers = ref([])
const contactedCustomers = ref([
  // Mock (để UI có dữ liệu)
  {
    id: 6,
    name: 'Vũ Thị Phương',
    phone: '0967890123',
    receivedAt: '2024-03-10T09:05:00',
    province: 'Bình Dương',
    oldProvince: 'Đồng Nai',
    type: 'CHINH_CHU',
    note: 'Đã đặt lịch thành công ngày 20/3',
    status: 'THANH_CONG',
    tags: ['THANH_CONG'],
    lastCall: '2024-03-15T15:20:00'
  },
  {
    id: 7,
    name: 'Đặng Văn Quân',
    phone: '0978901234',
    receivedAt: '2024-03-11T13:15:00',
    province: 'Hà Nội',
    oldProvince: null,
    type: 'MOI_GIOI',
    note: 'Số điện thoại không liên lạc được',
    status: 'KHONG_LIEN_LAC_DUOC',
    tags: ['KHONG_LIEN_LAC_DUOC'],
    lastCall: '2024-03-14T14:10:00'
  },
  {
    id: 8,
    name: 'Bùi Thị Hà',
    phone: '0989012345',
    receivedAt: '2024-03-12T10:25:00',
    province: 'TP. Hồ Chí Minh',
    oldProvince: 'Long An',
    type: 'CHINH_CHU',
    note: 'Sai số, không phải khách hàng',
    status: 'SAI_SO_LIEU',
    tags: ['SAI_SO_LIEU'],
    lastCall: '2024-03-12T09:45:00'
  }
])

const thongKeTrangThai = ref([])

// ✅ dữ liệu cho line chart từ BE
// Kỳ vọng BE trả: [{ status: 'TN_14NGAY', time: 9, total: 3 }, ...]
// - time: nếu theo năm => 1..12 (tháng)
// - time: nếu theo tháng => 1..31 (ngày)
const thongKeThoiGian = ref([])

// ====== Computed ======
const filteredCustomers = computed(() => {
  const customers = activeTab.value === 'new' ? newCustomers.value : contactedCustomers.value

  const filteredBySearch = !searchQuery.value.trim()
      ? customers
      : customers.filter((c) => {
        const q = searchQuery.value.toLowerCase()
        return (
            (c.name || '').toLowerCase().includes(q) ||
            (c.phone || '').includes(q) ||
            (c.province || '').toLowerCase().includes(q) ||
            ((c.oldProvince || '').toLowerCase().includes(q))
        )
      })

  return filterByType(filterByStatus(filteredBySearch))
})

const totalPages = computed(() => {
  if (activeTab.value !== 'contacted') return 1
  return Math.max(1, Math.ceil(filteredCustomers.value.length / pageSize.value))
})

const pageNumbers = computed(() => {
  if (activeTab.value !== 'contacted') return []
  return Array.from({ length: totalPages.value }, (_, idx) => idx + 1)
})

const pagedCustomers = computed(() => {
  if (activeTab.value !== 'contacted') return filteredCustomers.value
  const start = (currentPage.value - 1) * pageSize.value
  return filteredCustomers.value.slice(start, start + pageSize.value)
})

// ====== Watchers ======
watch(activeTab, (newVal) => {
  currentPage.value = 1
  statusFilter.value = null
  searchQuery.value = ''

  if (newVal === 'new') {
    loadKhachMoiTiepNhan()
  }
})

watch([statusFilter, typeFilter, searchQuery], () => {
  currentPage.value = 1
})

watch([typeFilter, searchQuery], () => {
  if (activeTab.value === 'new') loadKhachMoiTiepNhan()
})

// ✅ đổi thời gian => reload line chart data từ BE
watch([selectedTimeRange, selectedYear, selectedMonth], async () => {
  await fetchThongKeBieuDo()
})

// ====== Methods: filter ======
const filterByStatus = (customers) => {
  if (activeTab.value !== 'contacted' || !statusFilter.value) return customers
  return customers.filter((c) => c.status === statusFilter.value)
}

const filterByType = (customers) => {
  if (!typeFilter.value) return customers
  return customers.filter((c) => c.type === typeFilter.value)
}

const changePage = (page) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

// ====== Helpers ======
const getCustomerTypeLabel = (type) => {
  const typeLabels = {
    MOI_GIOI: 'Môi giới',
    CHINH_CHU: 'Chủ nhà',
    NGUOI_THAN: 'Người thân'
  }
  return typeLabels[type] || type
}

const getTagLabel = (tag) => {
  return STATUS_META[tag]?.label || tag
}

const getInitials = (name) => {
  if (!name) return ''
  const words = name.trim().split(/\s+/)
  const first = words[0]?.charAt(0) || ''
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : ''
  return `${first}${last}`.toUpperCase()
}

const getAvatarColor = (name) => {
  if (!name) return 'hsl(210, 60%, 55%)'
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 60%, 55%)`
}

const formatTime = (isoString) => {
  if (!isoString) return 'Chưa gọi'
  const date = new Date(isoString)
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

const formatReceivedAt = (isoString) => {
  if (!isoString) return '-'
  const date = new Date(isoString)
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// ====== Detail actions ======
const selectCustomer = (customer) => {
  selectedCustomer.value = customer
  newNote.value = ''
  resetFileForm(customer?.files)
}

const toggleCustomerStatus = (status) => {
  if (!selectedCustomer.value) return
  selectedCustomer.value.status = selectedCustomer.value.status === status ? null : status
}

const resetFileForm = (files) => {
  const safeFiles = Array.isArray(files) ? JSON.parse(JSON.stringify(files)) : []
  fileForm.value = {
    files: safeFiles,
    newFiles: [],
    newLandBookFiles: [],
    deletedFileIds: [],
    deletedLandBookFileIds: []
  }
  originalFiles.value = JSON.parse(JSON.stringify(safeFiles))
}

const handleFileUpdate = (files) => {
  fileForm.value.files = Array.isArray(files) ? files : []

  const existingFiles = fileForm.value.files.filter((file) => !file.file && file.id)
  const newFiles = fileForm.value.files.filter((file) => file.file instanceof File)

  fileForm.value.newFiles = newFiles
      .filter((file) => !file.isIG)
      .map((file) => ({ file: file.file, isOnTop: file.isOnTop }))

  fileForm.value.newLandBookFiles = newFiles
      .filter((file) => file.isIG)
      .map((file) => ({ file: file.file, isOnTop: file.isOnTop }))

  const originalIds = (originalFiles.value || []).map((file) => file.id)
  const currentIds = existingFiles.map((file) => file.id)

  fileForm.value.deletedFileIds = originalIds.filter((id) => {
    const file = (originalFiles.value || []).find((item) => item.id === id)
    return !currentIds.includes(id) && file && !file.isIG
  })

  fileForm.value.deletedLandBookFileIds = originalIds.filter((id) => {
    const file = (originalFiles.value || []).find((item) => item.id === id)
    return !currentIds.includes(id) && file && file.isIG
  })
}

const buildFilePayload = () => {
  const dto = {
    customerId: selectedCustomer.value.id,
    status: selectedCustomer.value.status,
    description: newNote.value,
    files: fileForm.value.files
        .filter((file) => !file.file && file.id)
        .map((file) => ({
          id: file.id,
          fileName: file.fileName,
          isIG: file.isIG,
          isOnTop: file.isOnTop
        })),
    deletedFileIds: fileForm.value.deletedFileIds,
    deletedLandBookFileIds: fileForm.value.deletedLandBookFileIds
  }

  const fd = new FormData()
  fd.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }))

  const mainFile = fileForm.value.newFiles.find((file) => file?.isOnTop && file.file instanceof File)
      || fileForm.value.newLandBookFiles.find((file) => file?.isOnTop && file.file instanceof File)

  if (mainFile) {
    fd.append('newFileOntop', mainFile.file)
  }

  fileForm.value.newFiles.forEach((file) => {
    if (file?.file instanceof File) {
      fd.append('newFiles', file.file)
    }
  })

  fileForm.value.newLandBookFiles.forEach((file) => {
    if (file?.file instanceof File) {
      fd.append('newLandBookFiles', file.file)
    }
  })

  return fd
}

const moveToContacted = async () => {
  if (!selectedCustomer.value) return

  try {
    const payload = buildFilePayload()
    await api.post('/customer-crm/telesales/journey-history/create', payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const index = newCustomers.value.findIndex((c) => c.id === selectedCustomer.value.id)
    if (index !== -1) {
      const customer = newCustomers.value.splice(index, 1)[0]
      customer.tags = customer.status ? [customer.status] : []
      contactedCustomers.value.unshift(customer)
    }

    selectedCustomer.value = null
    newNote.value = ''
    resetFileForm([])
    activeTab.value = 'contacted'

    // reload thống kê
    await refreshData()
  } catch (err) {
    console.error(err)
  }
}

// ====== API ======
const fetchThongKeHomNay = async () => {
  try {
    const { data } = await api.get('/customer-crm/telesales/thong-ke/hom-nay')
    todayStats.value = data
  } catch (e) {
    console.error('❌ Lỗi thống kê hôm nay', e)
  }
}

const fetchThongKeTrangThaiTeleSales = async () => {
  try {
    const { data } = await api.get('/customer-crm/telesales/thong-ke-trang-thai')
    thongKeTrangThai.value = Array.isArray(data)
        ? data.map((item) => ({
          label: item.label,
          value: Number(item.value)
        }))
        : []
  } catch (e) {
    thongKeTrangThai.value = []
  }
}

const fetchKhachMoiTiepNhan = async () => {
  const res = await api.get('/customer-crm/telesales/khach-moi-tiep-nhan', {
    params: {
      type: typeFilter.value || null,
      search: searchQuery.value || null
    }
  })
  return res.data
}

const loadKhachMoiTiepNhan = async () => {
  try {
    const data = await fetchKhachMoiTiepNhan()
    newCustomers.value = (data || []).map((item) => ({
      id: item.id,
      name: item.hoTen,
      phone: item.soDienThoai,
      receivedAt: item.thoiGianTiepNhan,
      province: item.tinhMoi,
      oldProvince: item.tinhCu || null,
      type: item.type || null, // CHINH_CHU / MOI_GIOI / NGUOI_THAN
      note: item.ghiChu || '',
      status: null,
      tags: [],
      lastCall: null,
      files: Array.isArray(item.files) ? item.files : []
    }))
  } catch (err) {
    newCustomers.value = []
  }
}

// ====== LINE CHART (theo năm / tháng) ======
const fetchThongKeBieuDo = async () => {
  try {
    let res

    if (selectedTimeRange.value === 'month') {
      res = await api.get('/customer-crm/telesales/thong-ke/thang', {
        params: { year: selectedYear.value, month: selectedMonth.value }
      })
    } else {
      res = await api.get('/customer-crm/telesales/thong-ke/nam', {
        params: { year: selectedYear.value }
      })
    }

    thongKeThoiGian.value = Array.isArray(res.data) ? res.data : []
    await nextTick()
    initLineChart()
  } catch (e) {
    console.error('❌ Lỗi load biểu đồ', e)
    thongKeThoiGian.value = []
    await nextTick()
    initLineChart()
  }
}

const buildLineChartData = () => {
  const isYear = selectedTimeRange.value === 'year'

  const labels = isYear
      ? Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
      : Array.from({ length: 31 }, (_, i) => `Ngày ${i + 1}`)

  // status -> [..data..]
  const statusMap = {}

  for (const item of thongKeThoiGian.value) {
    // expected: {status, time, total}
    const status = item.status ?? item.label // fallback
    const t = Number(item.time ?? item.bucket ?? item.day ?? item.month) // fallback
    const total = Number(item.total ?? item.value ?? 0)

    if (!status || !t || t < 1 || t > labels.length) continue

    if (!statusMap[status]) statusMap[status] = Array(labels.length).fill(0)
    statusMap[status][t - 1] = total
  }

  const datasets = Object.keys(statusMap).map((status) => ({
    label: STATUS_META[status]?.label || status,
    data: statusMap[status],
    borderColor: STATUS_META[status]?.color || '#94a3b8',
    backgroundColor: 'transparent',
    tension: 0.35,
    pointRadius: 2
  }))

  return { labels, datasets }
}

const initLineChart = () => {
  const canvas = lineChart.value
  if (!canvas) return

  if (lineChartInstance.value) {
    lineChartInstance.value.destroy()
  }

  const { labels, datasets } = buildLineChartData()

  lineChartInstance.value = new Chart(canvas, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Số lượng cuộc gọi' }
        },
        x: {
          title: { display: true, text: selectedTimeRange.value === 'year' ? 'Tháng' : 'Ngày' }
        }
      }
    }
  })
}

// ====== SUMMARY CHART ======
const initSummaryChart = () => {
  const ctx = document.getElementById('summaryChart')
  if (!ctx) return

  if (summaryChartInstance.value) {
    summaryChartInstance.value.destroy()
  }

  const labels = thongKeTrangThai.value.map((item) => STATUS_META[item.label]?.label || item.label)
  const data = thongKeTrangThai.value.map((item) => item.value)
  const backgroundColor = thongKeTrangThai.value.map((item) => STATUS_META[item.label]?.color || '#94a3b8')

  summaryChartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor, borderWidth: 1 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 12, font: { size: 12 } }
        }
      }
    }
  })
}

// ====== Refresh all ======
const refreshData = async () => {
  await Promise.all([
    fetchThongKeHomNay(),
    fetchThongKeTrangThaiTeleSales(),
    fetchThongKeBieuDo()
  ])
  await nextTick()
  initSummaryChart()
}

// ====== Lifecycle ======
onMounted(async () => {
  await Promise.all([
    fetchThongKeHomNay(),
    fetchThongKeTrangThaiTeleSales(),
    loadKhachMoiTiepNhan(),
    fetchThongKeBieuDo()
  ])
  await nextTick()
  initSummaryChart()
})

onUnmounted(() => {
  if (lineChartInstance.value) lineChartInstance.value.destroy()
  if (summaryChartInstance.value) summaryChartInstance.value.destroy()
})

const getKhachDaLienHe = async () => {
  try {
    const res = await api.get(
        '/customer-crm/telesales/khach-da-lien-he',
        {
          params: {
            page: 0,
            size: 10,
            status: 'TN_14NGAY', // hoặc null
            type: null,             // VD: 'NONG', 'AM'
            search: ''              // hoặc null
          }
        }
    )

    console.log('✅ Response full:', res)
    console.log('📦 Page data:', res.data)
    console.log('📋 Content:', res.data.content)
    console.log('📄 Total elements:', res.data.page.totalElements)
    console.log('📑 Total pages:', res.data.page.totalPages)

  } catch (err) {
    console.error('❌ Lỗi gọi API khach-da-lien-he:', err)
  }
}
getKhachDaLienHe();
</script>

<style scoped>
/* Reset và kiểu cơ bản */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
  color: #333;
}

.telesale-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Header */
.app-header {
  background: linear-gradient(135deg, #3f51b5, #2196f3);
  color: white;
  padding: 15px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 22px;
  font-weight: 600;
}

.app-header h1 i {
  margin-right: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.logout-btn i {
  margin-right: 5px;
}

/* Main container */
.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 280px;
  background-color: #f7f9fc;
  border-right: 1px solid #cfd7e3;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.stats-widget,
.chart-widget {
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 10px 20px rgba(31, 45, 61, 0.08);
}

.stats-widget {
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 55%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
}

.chart-widget {
  background: linear-gradient(135deg, #f8fafc 0%, #ecfeff 55%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
}

.stats-widget h3,
.chart-widget h3 {
  font-size: 16px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-widget h3 {
  color: #334155;
}

.chart-widget h3 {
  color: #334155;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-weight: 600;
  font-size: 15px;
}

.stat-value.success {
  color: #4caf50;
}

.stat-value.failed {
  color: #f44336;
}

.stat-value.warning {
  color: #ff9800;
}

.progress-container {
  margin-top: 20px;
}

.progress-label {
  font-size: 14px;
  margin-bottom: 8px;
  color: #666;
}

.progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #2196f3, #3f51b5);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  text-align: center;
  margin-top: 5px;
  color: #777;
}

.chart-container {
  height: 200px;
  position: relative;
}

/* Content area */
.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Control bar */
.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 55%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  padding: 15px 20px;
  border-radius: 14px;
  box-shadow: 0 10px 20px rgba(31, 45, 61, 0.08);
}

.view-controls {
  display: flex;
  gap: 10px;
}

.tab-btn {
  padding: 10px 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  color: #334155;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 6px 12px rgba(15, 23, 42, 0.08);
}

.tab-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  color: #ffffff;
  border-color: #c7d2fe;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.25);
}

.tab-btn:hover:not(.active) {
  background-color: #dfe7f5;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #666;
}

.filter-group select {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  font-size: 14px;
  color: #334155;
}

.refresh-btn {
  padding: 8px 15px;
  background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.3s;
  color: #ffffff;
}

.refresh-btn:hover {
  background-color: #cfdefa;
}

/* Chart container */
.chart-container-large {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 55%, #eef2ff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(31, 45, 61, 0.08);
}

.chart-container-large h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

/* Customer section */
.customer-section {
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(31, 45, 61, 0.08);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

.main-container.with-detail .section-header {
  flex-direction: column;
  align-items: flex-start;
}

.section-title {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.main-container.with-detail .section-controls {
  flex-wrap: nowrap;
}

.main-container.with-detail .section-controls .search-box {
  flex: 1;
  min-width: 240px;
}

.status-filter {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 6px 10px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.type-filter {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 6px 10px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.status-filter select {
  min-width: 160px;
}

.section-header h3 {
  font-size: 18px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  font-size: 14px;
  color: #334155;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

/* Customer list */
.customer-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
}

.customer-card {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 45%, #eef2ff 100%);
}

.customer-card:hover {
  border-color: #2196f3;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

.customer-card.selected {
  border-color: #c7d2fe;
  background: linear-gradient(135deg, #eef2ff 0%, #f8fafc 100%);
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
}

.customer-avatar {
  position: relative;
  margin-right: 15px;
}

.customer-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-initials {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}

.customer-type {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
}

.customer-type.MOI_GIOI {
  background-color: #1e88e5;
  color: #ffffff;
}

.customer-type.CHINH_CHU {
  background-color: #2e7d32;
  color: #ffffff;
}

.customer-type.NGUOI_THAN {
  background-color: #6a1b9a;
  color: #ffffff;
}

.customer-info {
  flex: 1;
}

.customer-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.customer-phone {
  font-size: 14px;
  color: #4daf36;
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.customer-received {
  font-size: 14px;
  color: #444444;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.customer-location {
  font-size: 14px;
  font-weight: 600;
  color: #c92222;
  margin-bottom: 8px;
  display: flex;
  gap: 10px;
}

.location-current {
  display: flex;
  align-items: center;
  gap: 4px;
}

.location-old {
  font-style: italic;
}

.customer-notes-preview {
  font-size: 13px;
  color: #334155;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #e2e8f0;
  padding: 5px 8px;
  border-radius: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.customer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.customer-tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  font-weight: 500;
  color: #ffffff;
}

.customer-tag.potential_7 {
  background-color: #1e88e5;
}

.customer-tag.potential_14 {
  background-color: #6a1b9a;
}

.customer-tag.success {
  background-color: #2e7d32;
}

.customer-tag.wrong_number {
  background-color: #f57c00;
}

.customer-tag.unreachable {
  background-color: #c62828;
}

.customer-tag.care {
  background-color: #f9a825;
  color: #1f2937;
}

.customer-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.contact-icons {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.contact-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid transparent;
}

.contact-icon.zalo {
  background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
  color: #ffffff;
  border-color: #cbd5f5;
}

.contact-icon.tel {
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  color: #ffffff;
  border-color: #c7d2fe;
}

.call-status {
  font-size: 12px;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Detail panel */
.detail-panel {
  width: 400px;
  background: linear-gradient(160deg, #f8fafc 0%, #eef2ff 100%);
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.detail-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
}

.detail-header h3 {
  font-size: 18px;
  color: #1e293b;
}

.close-btn {
  background: #f1f5ff;
  border: 1px solid #cfd7e3;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 10px;
}

.close-btn:hover {
  color: #f44336;
}

.detail-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.customer-detail-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #cfd7e3;
}

.detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  font-size: 22px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.detail-name-info h4 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}

.detail-phone {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.detail-received {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.type-badge {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
}

.type-badge.MOI_GIOI {
  background-color: #1e88e5;
}

.type-badge.CHINH_CHU {
  background-color: #2e7d32;
}

.type-badge.NGUOI_THAN {
  background-color: #6a1b9a;
}

.detail-section h5 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #3f51b5;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.detail-label {
  color: #666;
  font-size: 14px;
}

.detail-value {
  font-weight: 500;
  font-size: 14px;
}

.tag-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-option {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
  transition: all 0.2s ease;
}

.tag-option.active {
  font-weight: 500;
}


.tag-option:hover {
  background-color: #f5f5f5;
}

.tag-option:not(.active):hover {
  border-color: #c7d2fe;
  background: #eef2ff;
}


.notes-container {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.note-item {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.note-item:last-child {
  border-bottom: none;
}

.note-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
  margin-bottom: 5px;
}

.note-content {
  font-size: 14px;
  line-height: 1.5;
}

.no-notes {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
  font-size: 14px;
}

.add-note-form textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  border-radius: 12px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 10px;
}

.add-note-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #4aa8ff 0%, #1e88e5 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: background 0.3s;
}

.add-note-btn:hover:not(:disabled) {
  background-color: #0d8bf2;
}

.add-note-btn:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}

.detail-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
}

.action-btn {
  padding: 12px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 6px 12px rgba(31, 45, 61, 0.12);
}

.action-btn.success {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
}

.action-btn.success:hover {
  background-color: #3d8b40;
}

.action-btn.move-btn {
  background: linear-gradient(135deg, #8e24aa 0%, #5e35b1 100%);
  color: white;
}

.action-btn.move-btn:hover {
  background-color: #7b1fa2;
}

.action-btn.danger {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.page-btn {
  border: 1px solid #cfd7e3;
  background: linear-gradient(135deg, #f4f7ff 0%, #dbe6ff 100%);
  color: #2f3f63;
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(47, 63, 99, 0.12);
}

.page-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
  border-color: #c7d2fe;
  color: #ffffff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: #3a4a5e;
  background: #f0f5ff;
  padding: 6px 10px;
  border-radius: 12px;
  border: 1px solid #cfd7e3;
}

.action-btn.danger:hover {
  background-color: #d32f2f;
}

/* Call modal */
/* Responsive */
@media (max-width: 1200px) {
  .sidebar {
    width: 250px;
  }

  .detail-panel {
    width: 190px;
  }
}

@media (max-width: 992px) {
  .main-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid #d6dce5;
    overflow-x: auto;
  }

  .stats-widget, .chart-widget {
    min-width: 250px;
  }

  .detail-panel {
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 100;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  }
}

@media (max-width: 768px) {
  .control-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .filter-controls {
    flex-wrap: wrap;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .section-controls {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .search-box {
    width: 100%;
  }

  .customer-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .customer-avatar {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .customer-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
  }
}
.progress-fill.progress-new {
  background: linear-gradient(to right, #6366f1, #818cf8);
}

.progress-fill.progress-care {
  background: linear-gradient(to right, #0ea5e9, #38bdf8);
}

</style>
