<template>
  <div class="investment-management">
    <!-- Light Sweep Effect Container -->
    <div class="light-sweep-container">
      <div class="light-sweep"></div>
    </div>

    <!-- Header Section -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">
        <i class="fas fa-chart-line fa-fw"></i>
        Quản lý Đầu tư
      </h1>
      <div class="header-stats">
        <div class="stat-card total-invested-highlight">
          <div class="stat-icon">
            <i class="fas fa-wallet fa-lg"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatCurrency(totalInvested) }}</div>
            <div class="stat-label">Tổng đầu tư</div>
<!--            <div class="stat-trend">-->
<!--              <i class="fas fa-arrow-up text-success"></i>-->
<!--              <span class="trend-text">+12.5%</span>-->
<!--            </div>-->
          </div>
          <div class="light-sweep-line"></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-bar fa-lg"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ activeInvestments }}</div>
            <div class="stat-label">Đầu tư đang hoạt động</div>
<!--            <div class="stat-trend">-->
<!--              <i class="fas fa-arrow-up text-success"></i>-->
<!--              <span class="trend-text">+8.2%</span>-->
<!--            </div>-->
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-coins fa-lg"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatCurrency(expectedProfit) }}</div>
            <div class="stat-label">Lợi nhuận dự kiến</div>
<!--            <div class="stat-trend">-->
<!--              <i class="fas fa-arrow-up text-success"></i>-->
<!--              <span class="trend-text">+15.3%</span>-->
<!--            </div>-->
          </div>
        </div>
      </div>
    </div>
    <h2>
      <i class="fas fa-slist-ul fa-fw"></i>
      Danh sách đầu tư
      <span class="badge-count">{{ filteredInvestments.length }}</span>
    </h2>
    <!-- Table Section with Quick Filters -->
    <div class="table-section">
      <div class="section-header">
        <div class="quick-filter-groups">
          <!-- Status Filter Group -->
          <div class="filter-group">
            <span class="filter-group-label">Trạng thái</span>
            <div class="button-group">
              <button
                  v-for="status in statusOptions"
                  :key="status.value"
                  class="filter-btn"
                  :class="{ active: selectedStatuses.includes(status.value) }"
                  @click="toggleStatusFilter(status.value)"
              >
                <span class="btn-fill"></span>
                <span class="btn-text">{{ status.label }}</span>
              </button>
            </div>
          </div>

          <!-- Profit Status Filter Group -->
          <div class="filter-group">
            <span class="filter-group-label">TT Lợi nhuận</span>
            <div class="button-group">
              <button
                  v-for="profitStatus in profitStatusOptions"
                  :key="profitStatus.value"
                  class="filter-btn"
                  :class="{ active: selectedProfitStatuses.includes(profitStatus.value) }"
                  @click="toggleProfitStatusFilter(profitStatus.value)"
              >
                <span class="btn-fill"></span>
                <span class="btn-text">{{ profitStatus.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <!-- Date Filter Dropdown -->
          <div class="filter-dropdown">
            <button class="btn btn-date-filter" @click="toggleDateDropdown">
              <i class="fas fa-calendar-alt fa-fw"></i>
              {{ dateFilterText }}
              <i class="fas fa-chevron-down"></i>
            </button>
            <div v-if="showDateDropdown" class="date-dropdown-menu">
              <div class="date-inputs">
                <div class="date-input-group">
                  <label><i class="fas fa-calendar-alt fa-xs"></i> Từ ngày</label>
                  <input type="date" v-model="filters.startDate" class="date-input">
                </div>
                <div class="date-input-group">
                  <label><i class="fas fa-calendar-check fa-xs"></i> Đến ngày</label>
                  <input type="date" v-model="filters.endDate" class="date-input">
                </div>
              </div>
              <div class="date-actions">
                <button class="btn btn-sm" @click="clearDateFilter">Xóa</button>
                <button class="btn btn-sm btn-primary" @click="applyDateFilter">Áp dụng</button>
              </div>
            </div>
          </div>

          <div class="search-box">
            <i class="fas fa-search fa-fw"></i>
            <input
                v-model="searchQuery"
                placeholder="Tìm kiếm theo tên, mã đầu tư..."
                @input="handleSearch"
                class="search-input"
            >
          </div>
        </div>
      </div>

      <!-- Investments Table -->
      <div class="table-container">
        <div class="table-responsive">
          <table class="investment-table">
            <thead>
            <tr>
              <th>
                <i class="fas fa-hashtag fa-fw"></i> Mã đầu tư
              </th>
              <th>
                <i></i> Tên chi nhánh
              </th>
              <th>
                <i class="fas fa-box fa-fw"></i> Gói đầu tư
              </th>
              <th @click="sortBy('investedAmount')" class="sortable">
                <i class="fas fa-money-bill-wave fa-fw"></i> Số tiền đầu tư
                <i :class="sortIcon('investedAmount')"></i>
              </th>
              <th @click="sortBy('expectedProfit')" class="sortable">
                <i class="fas fa-chart-line fa-fw"></i> Lợi nhuận
                <i :class="sortIcon('expectedProfit')"></i>
              </th>
              <th>
                <i class="fas fa-clock fa-fw"></i> Thời gian
              </th>
              <th>
                <i class="fas fa-circle fa-fw"></i> Trạng thái
              </th>
              <th>
                <i class="fas fa-coins fa-fw"></i> TT lợi nhuận
              </th>
              <th>
                <i class="fas fa-cogs fa-fw"></i> Thao tác
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(investment, index) in paginatedInvestments"
                :key="investment.id"
                class="table-row"
                @click="viewInvestmentDetail(investment)"
            >
              <td class="investment-id">
                  <span class="badge badge-id">
                    <i class="fas fa-fingerprint fa-xs"></i>
                    #{{ investment.id }}
                  </span>
              </td>
              <td >
                {{ investment.branchName }}
              </td>
              <td>
                <div class="package-name">
                  {{ investment.packageName }}
                </div>
              </td>
              <td>
                <div class="amount-cell">
                  <div class="amount-value">
                    {{ formatCurrency(investment.investedAmount) }}
                  </div>
                  <div class="amount-details">
                      <span class="profit-percent">
                        LN: {{ investment.profitPercent }}%
                      </span>
                    <span class="duration">
                        {{ investment.durationMonths }} tháng
                      </span>
                  </div>
                </div>
              </td>
              <td>
                <div class="profit-cell">
                  <div class="expected-profit">
                    Dự kiến: {{ formatCurrency(investment.expectedProfit) }}
                  </div>
                </div>
              </td>
              <td>
                <div class="time-cell">
                  <div class="time-item">
                    {{ formatDate(investment.investedAt) }}
                  </div>
                  <div class="time-item">
                    {{ formatDate(investment.expectedReturnDate) }}
                  </div>
                </div>
              </td>
              <td>
                  <span class="status-badge" :class="investment.statusClass">
                    {{ investment.statusText }}
                  </span>
              </td>
              <td>
                  <span class="profit-badge" :class="investment.profitStatusClass">
                    {{ investment.profitStatusText }}
                  </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button
                      class="btn-icon btn-view"
                      @click.stop="viewInvestmentDetail(investment)"
                      title="Xem chi tiết"
                  >
                    <i class="fas fa-eye fa-fw"></i>
                  </button>
                  <button
                      v-if="investment.status === 'ACTIVE'"
                      class="btn-icon btn-upgrade"
                      @click.stop="upgradeInvestment(investment)"
                      title="Nâng cấp gói"
                  >
                    <i class="fas fa-level-up-alt fa-fw"></i>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <button
              v-for="page in visiblePages"
              :key="page"
              class="pagination-btn"
              :class="{ active: currentPage === page }"
              @click="changePage(page)"
          >
            {{ page }}
          </button>

          <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="changePage(currentPage + 1)"
          >
            <i class="fas fa-chevron-right"></i>
          </button>

          <div class="pagination-info">
            Hiển thị {{ startItem }}-{{ endItem }} của {{ filteredInvestments.length }} đầu tư
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredInvestments.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-chart-pie fa-4x"></i>
      </div>
      <h3>Không có dữ liệu đầu tư</h3>
      <p>Không tìm thấy khoản đầu tư nào phù hợp với bộ lọc của bạn</p>
      <button class="btn btn-primary" @click="resetFilters">
        <i class="fas fa-eye fa-fw"></i> Xem tất cả đầu tư
      </button>
    </div>

    <!-- Notification Toast -->
    <div v-if="showToast" class="toast toast-success">
      <i class="fas fa-check-circle"></i>
      <span>{{ toastMessage }}</span>
      <button @click="showToast = false" class="toast-close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from "../../../../api/api.js";

// State
const investments = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortField = ref('id')
const sortDirection = ref('desc')
const showToast = ref(false)
const toastMessage = ref('')
const showDateDropdown = ref(false)
const isLoading = ref(false)

// Statistics
const investedStat = ref({
  activePackagesCount: 0,
  totalInvested: 0,
  totalProfit: 0
})

// Multi-select filters
const selectedStatuses = ref([])
const selectedProfitStatuses = ref([])

// Filters object để gửi lên API
const filters = ref({
  startDate: '',
  endDate: '',
  keyword: '',
  profitStatusList: [],
  pkgIsActive: null
})

// Filter Options
const statusOptions = [
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'CANCELLED', label: 'Đã hủy' }
]

const profitStatusOptions = [
  { value: 'NOT_DUE', label: 'Chưa đến hạn' },
  { value: 'DUE', label: 'Đến hạn' },
  { value: 'PAID', label: 'Đã thanh toán đủ' },
  { value: 'PARTIALLY_PAID', label: 'Thanh toán một phần' }
]

// Computed properties
const totalInvested = computed(() => {
  return investedStat.value.totalInvested
})

const activeInvestments = computed(() => {
  return investedStat.value.activePackagesCount
})

const expectedProfit = computed(() => {
  return investedStat.value.totalProfit
})

const dateFilterText = computed(() => {
  if (filters.value.startDate && filters.value.endDate) {
    return `${formatShortDate(filters.value.startDate)} - ${formatShortDate(filters.value.endDate)}`
  }
  return 'Chọn ngày'
})

const filteredInvestments = computed(() => {
  return investments.value.map(inv => ({
    ...inv,
    packageName: inv.name,
    investedAmount: inv.amount,
    profitPercent: inv.profitPercent,
    durationMonths: inv.durationMonths,
    expectedReturnDate: calculateExpectedReturnDate(inv.investedAt, inv.durationMonths),
    expectedProfit: calculateExpectedProfit(inv.amount, inv.profitPercent),
    statusText: getStatusText(inv.status),
    statusClass: getStatusClass(inv.status),
    profitStatusText: getProfitStatusText(inv.profitStatus),
    profitStatusClass: getProfitStatusClass(inv.profitStatus)
  }))
})

const paginatedInvestments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInvestments.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredInvestments.value.length / itemsPerPage.value)
})

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredInvestments.value.length)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const toggleStatusFilter = (status) => {
  const index = selectedStatuses.value.indexOf(status)
  if (index > -1) {
    selectedStatuses.value.splice(index, 1)
  } else {
    selectedStatuses.value.push(status)
  }

  // Cập nhật filters
  filters.value.pkgIsActive = selectedStatuses.value.length > 0
      ? selectedStatuses.value.includes('ACTIVE')
      : null

  fetchInvestments()
}

const toggleProfitStatusFilter = (profitStatus) => {
  const index = selectedProfitStatuses.value.indexOf(profitStatus)
  if (index > -1) {
    selectedProfitStatuses.value.splice(index, 1)
  } else {
    selectedProfitStatuses.value.push(profitStatus)
  }

  // Cập nhật filters để gửi lên API
  filters.value.profitStatusList = selectedProfitStatuses.value.length > 0
      ? selectedProfitStatuses.value
      : []

  fetchInvestments()
}

const toggleDateDropdown = () => {
  showDateDropdown.value = !showDateDropdown.value
}

const applyDateFilter = () => {
  showDateDropdown.value = false
  fetchInvestments()
  showToastMessage('Đã áp dụng bộ lọc ngày!')
}

const clearDateFilter = () => {
  filters.value.startDate = ''
  filters.value.endDate = ''
  showDateDropdown.value = false
  fetchInvestments()
  showToastMessage('Đã xóa bộ lọc ngày!')
}

const formatShortDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit'
  })
}

// Fetch data từ API
const fetchInvestments = async () => {
  isLoading.value = true
  try {
    // Chuyển đổi date string sang ISO format cho LocalDateTime
    const startDateISO = filters.value.startDate
        ? `${filters.value.startDate}T00:00:00`
        : null
    const endDateISO = filters.value.endDate
        ? `${filters.value.endDate}T23:59:59`
        : null

    // Xây dựng filterDTO theo đúng API yêu cầu
    const filterDTO = {
      profitStatusList: filters.value.profitStatusList.length > 0
          ? filters.value.profitStatusList
          : null,
      pkgIsActive: filters.value.pkgIsActive,
      startDate: startDateISO,
      endDate: endDateISO,
      keyword: filters.value.keyword || null,
      investedAmountSort: getSortDirection('investedAmount'),
      profitPercentSort: getSortDirection('profitPercent'),
      investedAtSort: getSortDirection('investedAt')
    }

    console.log('Sending filterDTO to API:', JSON.stringify(filterDTO, null, 2))

    // Gọi API với filterDTO trong body và page/size trong query params
    const response = await api.post('/investment/branches/investedPackage', filterDTO, {
      params: {
        page: currentPage.value - 1, // API sử dụng zero-based page
        size: itemsPerPage.value
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.data && response.data.investedStatDTO && response.data.invPage) {
      // Cập nhật statistics
      investedStat.value = response.data.investedStatDTO

      // Cập nhật investments
      investments.value = response.data.invPage.content
      console.log('Received investments:', investments.value)

      // Cập nhật total pages từ API response
      itemsPerPage.value = response.data.invPage.page.size

      showToastMessage('Tải dữ liệu thành công!')
    }
  } catch (error) {
    console.error('Error fetching investments:', error.response || error)

    // Hiển thị chi tiết lỗi nếu có
    if (error.response) {
      console.error('Error response:', error.response.data)
      console.error('Error status:', error.response.status)
      showToastMessage(`Lỗi ${error.response.status}: ${error.response.data?.message || 'Lỗi khi tải dữ liệu!'}`, 'error')
    } else {
      showToastMessage('Lỗi kết nối đến máy chủ!', 'error')
    }

    // Fallback to mock data nếu API fail
    fallbackToMockData()
  } finally {
    isLoading.value = false
  }
}

// Helper function để lấy sort direction
const getSortDirection = (field) => {
  if (sortField.value !== field) {
    return 'NONE'
  }
  return sortDirection.value === 'asc' ? 'ASC' : 'DESC'
}

// Fallback to mock data nếu API fail
const fallbackToMockData = () => {
  const mockInvestments = [
    {
      id: 1001,
      branchId: 1,
      branchName: 'Chi nhánh Hà Nội',
      name: 'Gói Vàng',
      amount: 50000000,
      profitPercent: 12.5,
      durationMonths: 12,
      investedAt: '2024-01-15T08:30:00',
      expectedReturnDate: '2025-01-15T08:30:00',
      expectedProfit: 6250000,
      status: 'ACTIVE',
      profitStatus: 'NOT_DUE'
    },
    {
      id: 1002,
      branchId: 2,
      branchName: 'Chi nhánh HCM',
      name: 'Gói Bạch Kim',
      amount: 100000000,
      profitPercent: 15.0,
      durationMonths: 24,
      investedAt: '2024-03-10T10:15:00',
      expectedReturnDate: '2026-03-10T10:15:00',
      expectedProfit: 15000000,
      status: 'ACTIVE',
      profitStatus: 'DUE'
    },
    {
      id: 1003,
      branchId: 1,
      branchName: 'Chi nhánh Hà Nội',
      name: 'Gói Đồng',
      amount: 20000000,
      profitPercent: 8.0,
      durationMonths: 6,
      investedAt: '2024-06-20T14:45:00',
      expectedReturnDate: '2024-12-20T14:45:00',
      expectedProfit: 1600000,
      status: 'CANCELLED',
      profitStatus: 'PARTIALLY_PAID'
    }
  ]

  investments.value = mockInvestments
  investedStat.value = {
    activePackagesCount: mockInvestments.filter(inv => inv.status === 'ACTIVE').length,
    totalInvested: mockInvestments.reduce((sum, inv) => sum + inv.amount, 0),
    totalProfit: mockInvestments.reduce((sum, inv) => sum + (inv.expectedProfit || 0), 0)
  }
}

const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const resetFilters = () => {
  selectedStatuses.value = []
  selectedProfitStatuses.value = []
  filters.value = {
    startDate: '',
    endDate: '',
    keyword: '',
    profitStatusList: [],
    pkgIsActive: null
  }
  searchQuery.value = ''
  currentPage.value = 1
  sortField.value = 'id'
  sortDirection.value = 'desc'

  fetchInvestments()
  showToastMessage('Đã đặt lại bộ lọc!')
}

const handleSearch = () => {
  filters.value.keyword = searchQuery.value
  currentPage.value = 1
  fetchInvestments()
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }

  fetchInvestments()
}

const sortIcon = (field) => {
  if (sortField.value !== field) return 'fas fa-sort'
  return sortDirection.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchInvestments()
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const calculateExpectedReturnDate = (investedAt, durationMonths) => {
  if (!investedAt || !durationMonths) return ''
  const date = new Date(investedAt)
  date.setMonth(date.getMonth() + durationMonths)
  return date.toISOString()
}

const calculateExpectedProfit = (amount, profitPercent) => {
  if (!amount || !profitPercent) return 0
  return (amount * profitPercent) / 100
}

const getStatusText = (status) => {
  const statusMap = {
    ACTIVE: 'Đang hoạt động',
    UPGRADED: 'Đã nâng cấp',
    CANCELLED: 'Đã hủy'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    ACTIVE: 'status-active',
    UPGRADED: 'status-upgraded',
    CANCELLED: 'status-cancelled'
  }
  return classMap[status] || ''
}

const getProfitStatusText = (status) => {
  const statusMap = {
    NOT_DUE: 'Chưa đến hạn',
    DUE: 'Đến hạn',
    PARTIALLY_PAID: 'Thanh toán một phần',
    PAID: 'Đã thanh toán đủ'
  }
  return statusMap[status] || status
}

const getProfitStatusClass = (status) => {
  const classMap = {
    NOT_DUE: 'profit-not-due',
    DUE: 'profit-due',
    PARTIALLY_PAID: 'profit-partial',
    PAID: 'profit-paid'
  }
  return classMap[status] || ''
}

const viewInvestmentDetail = (investment) => {
  console.log('View investment detail:', investment)
  showToastMessage(`Đang xem chi tiết đầu tư #${investment.id}`)
}

const upgradeInvestment = (investment) => {
  console.log('Upgrade investment:', investment)
  showToastMessage(`Đang nâng cấp đầu tư #${investment.id}`)
}

// Watch for changes in currentPage
watch(currentPage, () => {
  fetchInvestments()
})

// Lifecycle
onMounted(() => {
  fetchInvestments()
})
</script>

<style scoped>
.investment-management {
  padding: 80px 24px 24px;
  min-height: 100vh;
  background: linear-gradient(135deg,
  rgba(102, 126, 234, 0.05) 0%,
  rgba(118, 75, 162, 0.05) 25%,
  rgba(243, 147, 251, 0.05) 50%,
  rgba(245, 87, 108, 0.05) 75%,
  rgba(79, 172, 254, 0.05) 100%
  );
}

/* Light Sweep Effect */
.light-sweep-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.light-sweep {
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(90deg,
  transparent 0%,
  rgba(255, 255, 255, 0.1) 50%,
  transparent 100%
  );
  animation: sweep 8s ease-in-out infinite;
}

@keyframes sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Header Styles - CẢI THIỆN MÀU CHỮ */
.dashboard-header {
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.dashboard-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.dashboard-title .fa-chart-line {
  color: #667eea;
  text-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-card.total-invested-highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.total-invested-highlight .stat-value,
.stat-card.total-invested-highlight .stat-label,
.stat-card.total-invested-highlight .stat-trend {
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}
.trend-text {
  color: #a5f3fc !important;
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card:nth-child(2) .stat-value,
.stat-card:nth-child(2) .stat-label,
.stat-card:nth-child(2) .stat-trend {
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card:nth-child(3) .stat-value,
.stat-card:nth-child(3) .stat-label,
.stat-card:nth-child(3) .stat-trend {
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.light-sweep-line {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg,
  transparent 0%,
  rgba(255, 255, 255, 0.8) 50%,
  transparent 100%
  );
  animation: diagonal-sweep 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes diagonal-sweep {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.stat-trend i {
  color: #a5f3fc !important
}


/* Table Section */
.table-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-count {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.quick-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-dropdown {
  position: relative;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.btn-date-filter {
  min-width: 140px;
  justify-content: space-between;
}

.btn-primary {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-primary:hover {
  background: #5a67d8;
  border-color: #5a67d8;
  color: white;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

.date-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
  min-width: 320px;
  border: 1px solid #e2e8f0;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-input {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.date-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.date-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 10px 16px 10px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 240px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  width: 260px;
}

.search-box .fa-search {
  position: absolute;
  left: 12px;
  color: #94a3b8;
}

/* Quick Filter Groups - HIỆU ỨNG FILL */
.quick-filter-groups {
  display: flex;
  gap: 24px;
}

.filter-group {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  background: white;
}

.filter-group-label {
  position: absolute;
  top: -10px;
  left: 16px;
  background: white;
  padding: 0 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  position: relative;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.filter-btn .btn-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: #667eea;
  transition: width 0.3s ease;
  z-index: 1;
}

.filter-btn .btn-text {
  position: relative;
  z-index: 2;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  border-color: #667eea;
  color: white;
}

.filter-btn.active .btn-fill {
  width: 100%;
}

.filter-btn:hover .btn-fill {
  width: 100%;
  background: rgba(102, 126, 234, 0.1);
}

.filter-btn.active:hover .btn-fill {
  background: #5a67d8;
}

/* Table Styles - CĂN GIỮA THEO CHIỀU DỌC */
.table-container {
  margin-top: 20px;
}

.investment-table {
  width: 100%;
  border-collapse: collapse;
}

.investment-table thead {
  background: #f8fafc;
}

.investment-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
  vertical-align: middle;
}

.investment-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;
}

.investment-table th.sortable:hover {
  color: #667eea;
}

.investment-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.table-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8fafc;
}

.badge-id {
  background: #667eea;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.package-name,
.amount-cell,
.profit-cell,
.time-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.amount-details,
.time-item {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  font-size: 0.85rem;
  color: #64748b;
}

.status-badge,
.profit-badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  min-width: 100px;
  justify-content: center;
  align-items: center;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.profit-not-due {
  background: #fef3c7;
  color: #92400e;
}

.profit-due {
  background: #fef3c7;
  color: #92400e;
  border: 2px solid #f59e0b;
}

.profit-paid {
  background: #d1fae5;
  color: #065f46;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
}

.btn-view {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.btn-view:hover {
  background: rgba(102, 126, 234, 0.2);
}

.btn-upgrade {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.btn-upgrade:hover {
  background: rgba(139, 92, 246, 0.2);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.pagination-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin-left: 24px;
  color: #64748b;
  font-size: 0.85rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 24px;
  background: white;
  border-radius: 16px;
  margin-top: 32px;
  border: 2px dashed #e2e8f0;
}

.empty-icon {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.3rem;
  color: #1e293b;
  margin-bottom: 12px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 24px;
}

/* Toast Notification */
.toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
}

.toast-success {
  background: #10b981;
}

.toast-close {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .investment-management {
    padding: 16px;
  }

  .header-stats {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .quick-actions {
    flex-direction: row;
    gap: 12px;
  }

  .search-input {
    width: 100%;
  }

  .search-input:focus {
    width: 100%;
  }

  .quick-filter-groups {
    flex-direction: column;
    gap: 16px;
  }

  .date-dropdown-menu {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    min-width: auto;
  }

  .date-inputs {
    grid-template-columns: 1fr;
  }

  .investment-table {
    font-size: 0.85rem;
  }

  .investment-table th,
  .investment-table td {
    padding: 12px 8px;
  }
}

@media (max-width: 576px) {
  .button-group {
    flex-direction: column;
    width: 100%;
  }

  .filter-btn {
    width: 100%;
    text-align: center;
  }
}

/* Thêm loading indicator nếu cần */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Thêm indicator trong component nếu isLoading */
.table-section {
  position: relative;
}

.table-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  display: none;
  z-index: 10;
}

.table-section.loading::after {
  display: block;
}
</style>