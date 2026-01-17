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
            <span class="stat-label">Số khách lên VP:</span>
            <span class="stat-value">{{ todayStats.totalCalls }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Liên lạc được:</span>
            <span class="stat-value success">{{ todayStats.successfulCalls }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Không liên lạc:</span>
            <span class="stat-value failed">{{ todayStats.unreachableCalls }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Sai số:</span>
            <span class="stat-value warning">{{ todayStats.wrongNumberCalls }}</span>
          </div>
          <div class="progress-container">
            <div class="progress-label">Tiến độ ngày</div>
            <div class="progress-bar">
              <div
                  class="progress-fill"
                  :style="{ width: (todayStats.apiCalls / 40) * 100 + '%' }"
              ></div>
            </div>
            <div class="progress-text">{{ todayStats.apiCalls }}/40 cuộc gọi</div>
          </div>
        </div>

        <!-- Biểu đồ tổng hợp -->
        <div class="chart-widget">
          <h3><i class="fas fa-chart-pie"></i> Tổng hợp trạng thái</h3>
          <div class="chart-container">
            <canvas ref="summaryChart"></canvas>
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
              <select id="timeRange" v-model="selectedTimeRange" @change="updateChart">
                <option value="year">Theo năm</option>
                <option value="month">Theo tháng</option>
              </select>
            </div>

            <div class="filter-group" v-if="selectedTimeRange === 'year'">
              <label for="yearSelect">Năm:</label>
              <select id="yearSelect" v-model="selectedYear" @change="updateChart">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>

            <div class="filter-group" v-if="selectedTimeRange === 'month'">
              <label for="monthSelect">Tháng:</label>
              <select id="monthSelect" v-model="selectedMonth" @change="updateChart">
                <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
              </select>
            </div>

            <button class="refresh-btn" @click="refreshData">
              <i class="fas fa-sync-alt"></i> Làm mới
            </button>
          </div>
        </div>

        <!-- Biểu đồ đường -->
        <div class="chart-container-large">
          <h3><i class="fas fa-chart-line"></i> Biểu đồ cuộc gọi theo {{ selectedTimeRange === 'year' ? 'năm' : 'tháng' }}</h3>
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
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'new' }"
                    @click="activeTab = 'new'"
                >
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
                  <option value="all">Tất cả</option>
                  <option value="success">Thành công</option>
                  <option value="potential_7">Tiềm năng 7 ngày</option>
                  <option value="potential_14">Tiềm năng 14 ngày</option>
                  <option value="unreachable">Không liên lạc</option>
                  <option value="wrong_number">Sai số</option>
                  <option value="care">Chăm sóc</option>
                </select>
              </div>
              <div class="filter-group type-filter">
                <label for="typeFilter">Phân loại:</label>
                <select id="typeFilter" v-model="typeFilter">
                  <option value="all">Tất cả</option>
                  <option value="owner">Chủ nhà</option>
                  <option value="broker">Môi giới</option>
                  <option value="relative">Người thân</option>
                </select>
              </div>
              <div class="search-box">
                <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Tìm kiếm theo tên, số điện thoại..."
                />
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
                <div
                    class="avatar-initials"
                    :style="{ backgroundColor: getAvatarColor(customer.name) }"
                >
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
                  <span v-if="customer.oldProvince" class="location-old">
                    (Cũ: {{ customer.oldProvince }})
                  </span>
                </div>
                <div class="customer-notes-preview" v-if="customer.notes && customer.notes.length > 0">
                  <i class="fas fa-sticky-note"></i>
                  {{ getLastNotePreview(customer.notes) }}
                </div>
                <div class="customer-tags">
                  <span
                      v-for="tag in customer.tags"
                      :key="tag"
                      class="customer-tag"
                      :class="tag"
                  >
                    {{ getTagLabel(tag) }}
                  </span>
                </div>
              </div>

              <div class="customer-actions">
                <div class="contact-icons">
                  <a
                      class="contact-icon zalo"
                      :href="`zalo:${customer.phone}`"
                      title="Zalo"
                      @click.stop
                  >
                    <i class="fas fa-comment-dots"></i> zalo: {{ customer.phone }}
                  </a>
                  <a
                      class="contact-icon tel"
                      :href="`tel:${customer.phone}`"
                      title="Điện thoại"
                      @click.stop
                  >
                    <i class="fas fa-phone"></i> tel: {{ customer.phone }}
                  </a>
                </div>
                <div class="call-status" v-if="customer.lastCall">
                  <i class="fas fa-clock"></i>
                  {{ formatTime(customer.lastCall) }}
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
              <p class="detail-received">Tiếp nhận: {{ selectedCustomer ? formatReceivedAt(selectedCustomer.receivedAt) : '' }}</p>
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
                  :class="{ active: selectedCustomer.tags.includes(tag.value) }"
                  @click="toggleCustomerTag(tag.value)"
              >
                {{ tag.label }}
              </button>
            </div>
          </div>

          <div class="detail-section">
            <h5><i class="fas fa-sticky-note"></i> Ghi chú cuộc gọi</h5>
            <div class="notes-container">
              <div class="notes-list" v-if="selectedCustomer.notes && selectedCustomer.notes.length > 0">
                <div
                    v-for="(note, index) in selectedCustomer.notes"
                    :key="index"
                    class="note-item"
                >
                  <div class="note-header">
                    <span class="note-date">{{ formatNoteDate(note.date) }}</span>
                    <span class="note-time">{{ note.time }}</span>
                  </div>
                  <p class="note-content">{{ note.content }}</p>
                </div>
              </div>
              <div class="no-notes" v-else>
                Chưa có ghi chú nào
              </div>
            </div>

            <div class="add-note-form">
              <textarea
                  v-model="newNote"
                  placeholder="Thêm ghi chú cuộc gọi..."
                  rows="3"
              ></textarea>
              <button
                  class="add-note-btn"
                  @click="addNote"
                  :disabled="!newNote.trim()"
              >
                <i class="fas fa-plus-circle"></i> Thêm ghi chú
              </button>
            </div>
          </div>

          <div class="detail-actions">
            <button
                class="action-btn move-btn"
                @click="moveToContacted"
            >
              <i class="fas fa-save"></i> Lưu thông tin
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'
import api from '/src/api/api.js'

// Reactive state
const activeTab = ref('new')
const selectedCustomer = ref(null)
const newNote = ref('')
const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(4)
const selectedTimeRange = ref('month')
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)

// Static data
const years = [2022, 2023, 2024, 2025]
const months = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
]

const todayStats = ref({
  totalCalls: 28,
  apiCalls: 28,
  successfulCalls: 12,
  unreachableCalls: 8,
  wrongNumberCalls: 3
})

const availableTags = [
  { value: 'potential_7', label: 'Khách tiềm năng 7 ngày' },
  { value: 'potential_14', label: 'Khách tiềm năng 14 ngày' },
  { value: 'success', label: 'Thành công (đặt lịch)' },
  { value: 'wrong_number', label: 'Sai số' },
  { value: 'unreachable', label: 'Không liên lạc được' },
  { value: 'care', label: 'Chăm sóc' }
]

// Data from API
const newCustomers = ref([])
const thongKeTrangThai = ref([])
const chartData = ref({ labels: [], datasets: [] })

// Chart instances
const lineChartInstance = ref(null)
const summaryChartInstance = ref(null)

// Mock data for contacted customers (có thể fetch từ API sau)
const contactedCustomers = ref([
  {
    id: 6,
    name: 'Vũ Thị Phương',
    phone: '0967890123',
    receivedAt: '2024-03-10T09:05:00',
    province: 'Bình Dương',
    oldProvince: 'Đồng Nai',
    type: 'owner',
    notes: [
      { date: '2024-03-10', time: '11:30', content: 'Đã đặt lịch thành công ngày 20/3' },
      { date: '2024-03-15', time: '15:20', content: 'Xác nhận lại lịch hẹn' }
    ],
    tags: ['success'],
    lastCall: '2024-03-15T15:20:00'
  },
  {
    id: 7,
    name: 'Đặng Văn Quân',
    phone: '0978901234',
    receivedAt: '2024-03-11T13:15:00',
    province: 'Hà Nội',
    oldProvince: null,
    type: 'broker',
    notes: [
      { date: '2024-03-14', time: '14:10', content: 'Số điện thoại không liên lạc được' }
    ],
    tags: ['unreachable'],
    lastCall: '2024-03-14T14:10:00'
  },
  {
    id: 8,
    name: 'Bùi Thị Hà',
    phone: '0989012345',
    receivedAt: '2024-03-12T10:25:00',
    province: 'TP. Hồ Chí Minh',
    oldProvince: 'Long An',
    type: 'owner',
    notes: [
      { date: '2024-03-12', time: '09:45', content: 'Sai số, không phải khách hàng' }
    ],
    tags: ['wrong_number'],
    lastCall: '2024-03-12T09:45:00'
  }
])

// Computed properties
const filteredCustomers = computed(() => {
  const customers = activeTab.value === 'new' ? newCustomers.value : contactedCustomers.value

  if (!searchQuery.value.trim()) {
    return filterByType(filterByStatus(customers))
  }

  const query = searchQuery.value.toLowerCase()
  const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.province.toLowerCase().includes(query) ||
      (customer.oldProvince && customer.oldProvince.toLowerCase().includes(query))
  )
  return filterByType(filterByStatus(filtered))
})

const totalPages = computed(() => {
  if (activeTab.value !== 'contacted') return 1
  return Math.max(1, Math.ceil(filteredCustomers.value.length / pageSize.value))
})

const pageNumbers = computed(() => {
  if (activeTab.value !== 'contacted') return []
  return Array.from({ length: totalPages.value }, (_, index) => index + 1)
})

const pagedCustomers = computed(() => {
  if (activeTab.value !== 'contacted') return filteredCustomers.value
  const start = (currentPage.value - 1) * pageSize.value
  return filteredCustomers.value.slice(start, start + pageSize.value)
})

// Watchers
watch(activeTab, (newVal) => {
  currentPage.value = 1
  statusFilter.value = 'all'
  searchQuery.value = ''
  if (newVal === 'new') {
    loadKhachMoiTiepNhan()
  }
})

watch([statusFilter, typeFilter, searchQuery], () => {
  currentPage.value = 1
})

// Methods
const filterByStatus = (customers) => {
  if (activeTab.value !== 'contacted' || statusFilter.value === 'all') {
    return customers
  }
  return customers.filter(customer => customer.tags.includes(statusFilter.value))
}

const filterByType = (customers) => {
  if (typeFilter.value === 'all') {
    return customers
  }
  return customers.filter(customer => customer.type === typeFilter.value)
}

const changePage = (page) => {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

const getCustomerTypeLabel = (type) => {
  const typeLabels = {
    'MOI_GIOI': 'Môi giới',
    'CHINH_CHU': 'Chủ nhà',
    'NGUOI_THAN': 'Người thân'
  }
  return typeLabels[type] || type
}

const getTagLabel = (tag) => {
  const tagObj = availableTags.find(t => t.value === tag)
  return tagObj ? tagObj.label : tag
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

const getLastNotePreview = (notes) => {
  if (!notes || notes.length === 0) return 'Chưa có ghi chú'
  const lastNote = notes[0]
  const preview = lastNote.content.length > 50
      ? lastNote.content.substring(0, 50) + '...'
      : lastNote.content
  return `Ghi chú: ${preview}`
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

const formatNoteDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString('vi-VN')
}

const selectCustomer = (customer) => {
  selectedCustomer.value = customer
  newNote.value = ''
}

const addNote = () => {
  if (newNote.value.trim() && selectedCustomer.value) {
    const now = new Date()
    const note = {
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
      content: newNote.value
    }

    if (!selectedCustomer.value.notes) {
      selectedCustomer.value.notes = []
    }

    selectedCustomer.value.notes.unshift(note)
    newNote.value = ''
  }
}

const markCustomerStatus = (status) => {
  if (!selectedCustomer.value) return

  // Xóa các tag cũ thuộc nhóm trạng thái
  const statusTags = ['potential_7', 'potential_14', 'success', 'wrong_number', 'unreachable']
  selectedCustomer.value.tags = selectedCustomer.value.tags.filter(
      tag => !statusTags.includes(tag)
  )

  // Thêm tag mới
  if (!selectedCustomer.value.tags.includes(status)) {
    selectedCustomer.value.tags.push(status)
  }

  // Nếu là thành công, chuyển sang tab đã liên hệ
  if (status === 'success') {
    moveToContacted()
  }
}

const moveToContacted = () => {
  if (!selectedCustomer.value) return

  const index = newCustomers.value.findIndex(c => c.id === selectedCustomer.value.id)
  if (index !== -1) {
    const customer = newCustomers.value.splice(index, 1)[0]
    contactedCustomers.value.unshift(customer)
    selectedCustomer.value = null
    activeTab.value = 'contacted'
  }
}

const toggleCustomerTag = (tag) => {
  if (!selectedCustomer.value) return

  if (selectedCustomer.value.tags.includes(tag)) {
    selectedCustomer.value.tags = []
    return
  }

  selectedCustomer.value.tags = [tag]
}

// Chart methods
const generateRandomData = (count, min, max) => {
  return Array.from({ length: count }, () =>
      Math.floor(Math.random() * (max - min + 1)) + min
  )
}

const initLineChart = () => {
  const ctx = document.getElementById('lineChart')
  if (!ctx) return

  // Xóa biểu đồ cũ nếu tồn tại
  if (lineChartInstance.value) {
    lineChartInstance.value.destroy()
  }

  // Tạo dữ liệu mẫu cho biểu đồ
  const labels = selectedTimeRange.value === 'year'
      ? months
      : Array.from({ length: 30 }, (_, i) => `Ngày ${i + 1}`)

  const datasets = [
    {
      label: 'Thành công',
      data: generateRandomData(labels.length, 5, 20),
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      tension: 0.4
    },
    {
      label: 'Không liên lạc được',
      data: generateRandomData(labels.length, 2, 15),
      borderColor: '#f44336',
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      tension: 0.4
    },
    {
      label: 'Sai số',
      data: generateRandomData(labels.length, 1, 8),
      borderColor: '#FF9800',
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
      tension: 0.4
    },
    {
      label: 'Tiềm năng 7 ngày',
      data: generateRandomData(labels.length, 3, 18),
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      tension: 0.4
    },
    {
      label: 'Tiềm năng 14 ngày',
      data: generateRandomData(labels.length, 2, 12),
      borderColor: '#9C27B0',
      backgroundColor: 'rgba(156, 39, 176, 0.1)',
      tension: 0.4
    }
  ]

  lineChartInstance.value = new Chart(ctx, {
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
          title: {
            display: true,
            text: selectedTimeRange.value === 'year' ? 'Tháng' : 'Ngày'
          }
        }
      }
    }
  })
}

const initSummaryChart = () => {
  const ctx = document.getElementById('summaryChart')
  if (!ctx) return

  // Xóa biểu đồ cũ nếu tồn tại
  if (summaryChartInstance.value) {
    summaryChartInstance.value.destroy()
  }

  // Sử dụng dữ liệu thật từ thongKeTrangThai
  const labels = thongKeTrangThai.value.map(item => item.label)
  const data = thongKeTrangThai.value.map(item => item.value)
  const backgroundColor = [
    '#4CAF50', '#2196F3', '#9C27B0', '#f44336', '#FF9800', '#FFC107', '#00bcd4', '#8bc34a', '#e91e63', '#607d8b'
  ]

  summaryChartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor.slice(0, labels.length),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: { size: 12 }
          }
        }
      }
    }
  })
}

const initCharts = () => {
  initLineChart()
  initSummaryChart()
}

const updateChart = () => {
  initLineChart()
}

const refreshData = () => {
  // Trong thực tế, đây sẽ là nơi gọi API để lấy dữ liệu mới
  todayStats.value.apiCalls = Math.min(40, todayStats.value.apiCalls + 5)
  todayStats.value.totalCalls += 5
  todayStats.value.successfulCalls += 2

  // Khởi tạo lại biểu đồ
  initCharts()
}

// API functions
const loadKhachMoiTiepNhan = async () => {
  try {
    const data = await fetchKhachMoiTiepNhan()
    // Chuyển đổi dữ liệu API về đúng định dạng newCustomers
    newCustomers.value = (data || []).map((item, idx) => ({
      id: idx + 1, // hoặc item.id nếu backend trả về
      name: item.hoTen,
      phone: item.soDienThoai,
      receivedAt: item.thoiGianTiepNhan,
      province: item.tinhMoi,
      oldProvince: item.tinhCu || null,
      type: item.type, // hoặc xác định từ dữ liệu nếu có
      notes: item.ghiChu ? [{
        date: item.thoiGianTiepNhan.split('T')[0],
        time: item.thoiGianTiepNhan.split('T')[1]?.slice(0, 5) || '',
        content: item.ghiChu
      }] : [],
      tags: [],
      lastCall: null,
      files: item.files || null
    }))
  } catch (err) {
    newCustomers.value = []
  }
}

const fetchKhachMoiTiepNhan = async () => {
  try {
    const res = await api.get(
        '/customer-crm/telesales/khach-moi-tiep-nhan',
        { withCredentials: true }
    )
    console.log('👉 Khách mới tiếp nhận:', res.data)
    return res.data
  } catch (err) {
    console.error('❌ Lỗi lấy khách mới tiếp nhận:', err)
    throw err
  }
}

const fetchThongKeTrangThaiTeleSales = async () => {
  try {
    const { data } = await api.get('/customer-crm/telesales/thong-ke-trang-thai')
    thongKeTrangThai.value = Array.isArray(data)
        ? data.map(item => ({
          label: item.label,
          value: Number(item.value)
        }))
        : []
  } catch (e) {
    thongKeTrangThai.value = []
  }
}

// Lifecycle hooks
onMounted(async () => {
  await Promise.all([
    fetchThongKeTrangThaiTeleSales(),
    loadKhachMoiTiepNhan()
  ])
  initCharts()
})

onUnmounted(() => {
  if (lineChartInstance.value) {
    lineChartInstance.value.destroy()
  }
  if (summaryChartInstance.value) {
    summaryChartInstance.value.destroy()
  }
})
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
  border: 1px solid #cfd7e3;
  border-radius: 999px;
  background-color: #f5f8ff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  color: #344054;
}

.tag-option:hover {
  background-color: #f5f5f5;
}

.tag-option.active {
  background-color: #16a34a;
  color: white;
  border-color: #16a34a;
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

</style>
