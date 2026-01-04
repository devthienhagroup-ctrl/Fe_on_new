<template>
  <div class="investor-management">
    <!-- Header với tiêu đề -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="fas fa-chart-line"></i>
          Quản lý nhà đầu tư
        </h1>
        <div class="header-actions">
          <button class="btn btn-refresh" @click="fetchData">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <p class="page-subtitle">Quản lý và theo dõi thông tin nhà đầu tư các chi nhánh</p>
    </div>

    <!-- Header với thống kê -->
    <div class="dashboard-stats">
      <div class="stats-grid">
        <div class="stat-card total-investors">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value" style="color: #f8fafc">{{ formatNumber(stats.investor?.totalInvestors || 0) }}</h3>
            <p class="stat-label">Tổng nhà đầu tư</p>
            <!-- Các thống kê phụ -->
            <div class="stat-sub-stats">
              <div class="sub-stat">
                <span class="sub-stat-value">{{ formatNumber(stats.investor?.activeInvestors || 0) }}</span>
                <span class="sub-stat-label">Đang hoạt động</span>
              </div>
              <div class="sub-stat">
                <span class="sub-stat-value">{{ formatNumber(stats.investor?.newThisMonth || 0) }}</span>
                <span class="sub-stat-label">Mới tháng này</span>
              </div>
            </div>
          </div>
        </div>

        <div class="stat-card total-investment">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ formatCurrency(stats.investment?.totalAmount || 0) }}</h3>
            <p class="stat-label">Tổng đầu tư</p>
            <!-- Các thống kê phụ -->
            <div class="stat-sub-stats">
              <div class="sub-stat">
                <span class="sub-stat-value">{{ formatNumber(stats.investment?.totalInvestments || 0) }}</span>
                <span class="sub-stat-label">Lượt đầu tư</span>
              </div>
              <div class="sub-stat">
                <span class="sub-stat-value">{{ formatCurrency(stats.investment?.avgPerInvestor || 0) }}</span>
                <span class="sub-stat-label">Trung bình/NĐT</span>
              </div>
            </div>
          </div>
          <div class="vn-money">
            <p class="stat-label">{{ formatVietnameseCurrency(stats.investment?.totalAmount || 0) }}</p>
          </div>
        </div>

        <div class="stat-card active-branches">
          <div class="stat-icon">
            <i class="fas fa-code-branch"></i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.branch?.activeBranches || 0 }}</h3>
            <p class="stat-label">Chi nhánh hoạt động</p>
            <span class="stat-change">Tổng: {{ branches.length }} chi nhánh</span>
            <!-- Thêm tỷ lệ nhà đầu tư/branch -->
            <div class="stat-sub-stats">
              <div class="sub-stat">
                <span class="sub-stat-value">{{ formatNumber(stats.branch?.investorsPerBranch || 0) }}</span>
                <span class="sub-stat-label">NĐT/Branch</span>
              </div>
              <div class="sub-stat">
                <span class="sub-stat-value">{{ formatCurrency(stats.branch?.investmentPerBranch || 0) }}</span>
                <span class="sub-stat-label">Đầu tư/Branch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bộ lọc chính -->
    <div class="main-filter-section">
      <div class="filter-header">
        <h3><i class="fas fa-sliders-h"></i> Bộ lọc tìm kiếm</h3>
      </div>

      <div class="filter-grid">
        <!-- Thanh lọc chi nhánh nằm riêng -->
        <!-- Bộ lọc chi nhánh -->
        <div class="filter-group full-width">
          <label>Chi nhánh:</label>
          <div class="branches-filter-bar">
            <button
                class="branch-tag"
                :class="{ active: filters.branchId === ALL_BRANCHES_ID }"
                @click="selectBranch(ALL_BRANCHES_ID)"
            >
              <i class="fas fa-layer-group"></i>
              Tất cả chi nhánh
            </button>
            <div class="branches-scroll-wrapper">
              <div class="branches-scroll-container">
                <div class="branches-list">
                  <button
                      v-for="branch in branches"
                      :key="branch.branchId"
                      class="branch-tag"
                      :class="{ active: filters.branchId === branch.branchId }"
                      @click="selectBranch(branch.branchId)"
                  >
                    <span class="branch-name">{{ branch.branchName }}</span>
                    <span
                        class="branch-count"
                        :class="getBranchStatusClass(branch.status)"
                    >
                      {{ branch.investmentCount }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Các bộ lọc khác -->
        <div class="filter-group">
          <label>Tìm nhà đầu tư:</label>
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
                v-model="filters.keyword"
                type="text"
                placeholder="Nhập tên hoặc số điện thoại..."
                @input="handleSearch"
            />
          </div>
        </div>

        <div class="filter-group">
          <label>Gói đầu tư:</label>
          <div class="combobox-wrapper">
            <div class="combobox-input">
              <i class="fas fa-box"></i>
              <input
                  v-model="packageSearch"
                  type="text"
                  placeholder="Nhập hoặc chọn gói..."
                  @focus="showPackageDropdown = true"
                  @input="filterPackages"
              />
              <i
                  class="fas fa-chevron-down combobox-arrow"
                  @click="showPackageDropdown = !showPackageDropdown"
              ></i>
            </div>
            <div v-if="showPackageDropdown" class="combobox-dropdown">
              <div
                  v-for="pkg in filteredPackageList"
                  :key="pkg.pkgId"
                  class="dropdown-item"
                  @click="selectPackage(pkg)"
              >
                <div class="package-item">
                  <span class="package-name">{{ pkg.pkgName }}</span>
                  <!-- Hiển thị tên chi nhánh nếu đang ở tất cả chi nhánh -->
                  <span v-if="filters.branchId === ALL_BRANCHES_ID" class="package-branch">
                    {{ pkg.branchName }}
                  </span>
                  <span :class="['package-status', pkg.isPkgActive ? 'package-status-active' : 'package-status-closed']">
                    {{ pkg.isPkgActive ? 'Đang hoạt động' : 'Đã đóng' }}
                  </span>
                </div>
              </div>
              <div v-if="filteredPackageList.length === 0" class="dropdown-item empty">
                Không tìm thấy gói nào
              </div>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <label>Trạng thái đầu tư:</label>
          <select v-model="filters.investmentStatus" @change="handleFilterChange">
            <option :value="null">Tất cả trạng thái</option>
            <option v-for="status in investmentStatuses.filter(s => s.value !== null)" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>Trạng thái lợi nhuận:</label>
          <select v-model="filters.profitStatus" @change="handleFilterChange">
            <option :value="null">Tất cả</option>
            <option v-for="status in profitStatuses.filter(s => s.value !== null)" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>&nbsp;</label>
          <div class="filter-actions">
            <button class="btn-icon reset-btn" @click="resetFilters" title="Đặt lại bộ lọc">
              <i class="fas fa-redo"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bảng dữ liệu -->
    <div class="table-section">
      <div class="table-header">
        <div class="table-title">
          <h3>{{ getTableTitle() }}</h3>
          <div class="table-subtitle">
            <span class="badge badge-info">{{ pagination.totalElements }} nhà đầu tư</span>
            <span v-if="filters.branchId !== ALL_BRANCHES_ID" class="badge badge-light">
              Chi nhánh: {{ getSelectedBranchName() }}
            </span>
            <span v-if="filters.branchId !== ALL_BRANCHES_ID" class="badge" :class="getSelectedBranchStatusClass()">
              {{ getSelectedBranchStatusText() }}
            </span>
          </div>
        </div>
        <div class="table-controls">
          <div class="records-count">
            Hiển thị {{ displayedInvestors.length ? (pagination.number * pagination.size + 1) : 0 }}-{{ Math.min((pagination.number + 1) * pagination.size, pagination.totalElements) }} trên {{ pagination.totalElements }} bản ghi
          </div>
          <div class="sort-control">
            <label>Sắp xếp:</label>
            <select v-model="filters.sortBy" @change="handleSortChange">
              <option value="investedAt">Ngày đầu tư</option>
              <option value="investedAmount">Số tiền đầu tư</option>
              <option value="profitPercent">Lợi nhuận</option>
              <option value="expectedReturnDate">Ngày hoàn</option>
              <option value="investor.fullName">Tên nhà đầu tư</option>
              <option value="branch.name">Tên chi nhánh</option>
              <option value="pkg.name">Tên gói</option>
            </select>
            <button
                class="sort-direction"
                @click="toggleSortDirection"
            >
              <i class="fas" :class="filters.sortDirection === 'ASC' ? 'fa-sort-amount-up' : 'fa-sort-amount-down'"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="table-container">
        <table class="investor-table">
          <thead>
          <tr>
            <!-- Thêm cột STT -->
            <th class="stt-column">STT</th>
            <th @click="sortBy('investor.fullname')" class="sortable">
              <div class="th-content">
                <span>Nhà đầu tư</span>
                <i class="fas" :class="sortIcon('investor.fullname')"></i>
              </div>
            </th>
            <th @click="sortBy('branch.name')" class="sortable">
              <div class="th-content">
                <span>Chi nhánh</span>
                <i class="fas" :class="sortIcon('branch.name')"></i>
              </div>
            </th>
            <th @click="sortBy('pkg.name')" class="sortable">
              <div class="th-content">
                <span>Gói đầu tư</span>
                <i class="fas" :class="sortIcon('pkg.name')"></i>
              </div>
            </th>
            <th @click="sortBy('investedAmount')" class="sortable">
              <div class="th-content">
                <span>Số tiền</span>
                <i class="fas" :class="sortIcon('investedAmount')"></i>
              </div>
            </th>
            <th @click="sortBy('investedAt')" class="sortable">
              <div class="th-content">
                <span>Ngày đầu tư</span>
                <i class="fas" :class="sortIcon('investedAt')"></i>
              </div>
            </th>
            <th @click="sortBy('expectedReturnDate')" class="sortable">
              <div class="th-content">
                <span>Ngày hoàn</span>
                <i class="fas" :class="sortIcon('expectedReturnDate')"></i>
              </div>
            </th>
            <!-- Cột trạng thái chỉ hiển thị icon -->
            <th class="status-column">Trạng thái</th>
            <th class="actions">Thao tác</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(investor, index) in displayedInvestors" :key="investor.branchInvestmentId">
            <!-- Cột STT -->
            <td class="stt-cell">
              <span class="stt-number">{{ pagination.number * pagination.size + index + 1 }}</span>
            </td>
            <td>
              <div class="investor-info">
                <div class="avatar-placeholder">
                  {{ getInitials(investor.ivtName) }}
                </div>
                <div class="investor-details">
                  <strong class="investor-name">{{ investor.ivtName }}</strong>
                  <div class="investor-meta">
                    <span class="investor-phone" v-if="investor.ivtPhone">
                      <i class="fas fa-phone"></i> {{ investor.ivtPhone }}
                    </span>
                    <!-- Badge trạng thái thanh toán nhỏ -->
                    <span :class="['payment-status-badge', `payment-${investor.profitStatus?.toLowerCase()}`]">
                      <i :class="getProfitStatusIcon(investor.profitStatus)" style="font-size: 8px;"></i>
                      {{ getProfitStatusLabel(investor.profitStatus) }}
                    </span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="branch-info">
                <i class="fas fa-map-marker-alt branch-icon"></i>
                <span class="branch-name">{{ investor.branchName }}</span>
              </div>
            </td>
            <td>
              <div class="package-info">
                <div class="package-meta">
                  <strong>{{ investor.pkgName }}</strong>
                  <small>{{ investor.durationMonths }} tháng</small>
                  <span :class="['package-status-badge', investor.isPkgActive ? 'package-status-active' : 'package-status-closed']">
                    {{ investor.isPkgActive ? 'Đang hoạt động' : 'Đã đóng' }}
                  </span>
                </div>
                <div class="package-meta">
                  <span class="duration-badge">{{ investor.profitPercent }}%</span>
                </div>
              </div>
            </td>
            <td class="amount-cell">
              <strong>{{ formatCurrency(investor.investedAmount) }}</strong>
              <div class="amount-breakdown">
                <small>Dự kiến: {{ formatCurrency(investor.investedAmount * investor.profitPercent / 100) }}</small>
              </div>
            </td>
            <td>
              <div class="date-cell">
                {{ formatDate(investor.investedAt) }}
                <small>{{ formatTime(investor.investedAt) }}</small>
              </div>
            </td>
            <td>
              <div class="date-cell">
                {{ formatDate(investor.expectedReturnDate) }}
                <div class="date-indicator-wrapper">
                  <span :class="['date-indicator', getDateIndicator(investor.expectedReturnDate)]"></span>
                  <small>{{ getDaysRemaining(investor.expectedReturnDate) }}</small>
                </div>
              </div>
            </td>
            <!-- Cột trạng thái chỉ hiển thị icon với tooltip -->
            <td class="status-icon-cell">
              <div
                  class="status-icon-wrapper"
                  :title="getStatusTooltip(investor.status)"
              >
                <i
                    :class="getSimpleStatusIcon(investor.status)"
                    :style="{ color: getSimpleStatusColor(investor.status) }"
                ></i>
              </div>
            </td>
            <td class="action-cell">
              <button class="btn-icon" title="Xem chi tiết">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Empty state -->
        <div v-if="displayedInvestors.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-user-slash"></i>
          </div>
          <div class="empty-content">
            <h4>Không tìm thấy nhà đầu tư</h4>
            <p>Không có nhà đầu tư nào phù hợp với bộ lọc hiện tại</p>
            <button class="btn btn-outline" @click="resetFilters">
              <i class="fas fa-redo"></i> Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>

      <!-- Phân trang -->
      <div class="pagination">
        <div class="pagination-info">
          <span class="pagination-label">Hiển thị</span>
          <select v-model="filters.size" @change="handlePageSizeChange">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="pagination-label">bản ghi/trang</span>
        </div>
        <div class="pagination-controls">
          <button
              class="pagination-btn first"
              :disabled="pagination.number === 0"
              @click="changePage(0)"
              title="Trang đầu"
          >
            <i class="fas fa-angle-double-left"></i>
          </button>
          <button
              class="pagination-btn prev"
              :disabled="pagination.number === 0"
              @click="changePage(pagination.number - 1)"
              title="Trang trước"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          <div class="page-numbers">
            <button
                v-for="page in pagination.pages"
                :key="page"
                class="pagination-btn"
                :class="{ active: page === pagination.number + 1 }"
                @click="changePage(page - 1)"
            >
              {{ page }}
            </button>
            <span v-if="pagination.totalPages > 5 && pagination.number + 1 < pagination.totalPages - 2"
                  class="page-dots">...</span>
          </div>

          <button
              class="pagination-btn next"
              :disabled="pagination.number === pagination.totalPages - 1"
              @click="changePage(pagination.number + 1)"
              title="Trang sau"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
          <button
              class="pagination-btn last"
              :disabled="pagination.number === pagination.totalPages - 1"
              @click="changePage(pagination.totalPages - 1)"
              title="Trang cuối"
          >
            <i class="fas fa-angle-double-right"></i>
          </button>
        </div>
        <div class="pagination-go">
          <span>Đến trang</span>
          <input
              type="number"
              :min="1"
              :max="pagination.totalPages"
              v-model.number="goToPage"
              @keyup.enter="goToSpecificPage"
          />
          <button @click="goToSpecificPage">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from "../../../../api/api.js";

// Constants
const ALL_BRANCHES_ID = -1

// Data
const branches = ref([])
const packages = ref([])
const displayedInvestors = ref([])
const stats = ref({
  investor: {},
  investment: {},
  branch: {}
})

// Filters
const filters = ref({
  branchId: ALL_BRANCHES_ID,
  packageId: null,
  keyword: '',
  investmentStatus: null,
  profitStatus: null,
  page: 0,
  size: 10,
  sortBy: 'investedAt',
  sortDirection: 'DESC'
})

// Pagination
const pagination = ref({
  number: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  pages: []
})

// UI States
const showPackageDropdown = ref(false)
const packageSearch = ref('')
const goToPage = ref(1)
const isLoading = ref(false)

// Status options
const investmentStatuses = ref([
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'UPGRADED', label: 'Đã nâng cấp' },
  { value: 'CANCELLED', label: 'Đã hủy' }
])

const profitStatuses = ref([
  { value: 'NOT_DUE', label: 'Chưa đến hạn' },
  { value: 'DUE', label: 'Cần thanh toán' },
  { value: 'PAID', label: 'Đã thanh toán' }
])

// Computed
const filteredPackageList = computed(() => {
  if (!packageSearch.value) return packages.value

  const searchLower = removeVietnameseDiacritics(packageSearch.value.toLowerCase())

  return packages.value.filter(pkg => {
    const pkgName = removeVietnameseDiacritics(pkg.pkgName.toLowerCase())
    return pkgName.includes(searchLower)
  })
})

// Methods
const fetchData = async (useFilter = false) => {
  try {
    isLoading.value = true
    let response

    if (useFilter) {
      // Chuẩn bị dữ liệu filter để gửi API
      const filterData = {
        branchId: filters.value.branchId !== ALL_BRANCHES_ID ? filters.value.branchId : null,
        packageId: filters.value.packageId,
        keyword: filters.value.keyword || null,
        investmentStatus: filters.value.investmentStatus,
        profitStatus: filters.value.profitStatus,
        page: filters.value.page,
        size: filters.value.size,
        sortBy: filters.value.sortBy,
        sortDirection: filters.value.sortDirection === 'ASC' ? 'ASC' : 'DESC'
      }

      // Clean filter data
      const cleanFilterData = {}
      Object.keys(filterData).forEach(key => {
        if (filterData[key] !== null && filterData[key] !== undefined && filterData[key] !== '') {
          cleanFilterData[key] = filterData[key]
        }
      })

      console.log('Filter data to send:', cleanFilterData)
      response = await api.post("/investment/branches/branchInvestor/filter", cleanFilterData)
      console.log('Filter API response:', response.data) // Thêm log này để debug

      // Xử lý dữ liệu từ API filter
      if (response.data) {
        // Dữ liệu nhà đầu tư từ API filter
        if (response.data.content) { // API filter có thể trả về content trực tiếp
          displayedInvestors.value = response.data.content
          pagination.value = {
            number: response.data.pageable?.pageNumber || 0,
            size: response.data.size || filters.value.size,
            totalElements: response.data.totalElements || 0,
            totalPages: response.data.totalPages || 0
          }
        }
        // Hoặc nếu API trả về dạng khác
        else if (response.data.investors) {
          displayedInvestors.value = response.data.investors.content || response.data.investors
          pagination.value = {
            number: response.data.investors?.page?.number || 0,
            size: response.data.investors?.page?.size || filters.value.size,
            totalElements: response.data.investors?.page?.totalElements || 0,
            totalPages: response.data.investors?.page?.totalPages || 0
          }
        }

        updatePagesArray()
      }

    } else {
      // Gọi API lấy dữ liệu ban đầu
      response = await api.get("/investment/branches/branchInvestor")
      console.log('Initial API response:', response.data) // Thêm log này để debug

      // Xử lý dữ liệu chung cho cả 2 API
      if (response.data) {
        // Lấy danh sách chi nhánh
        branches.value = response.data.branches || []

        // Lấy danh sách gói đầu tư từ tất cả chi nhánh
        packages.value = branches.value.flatMap(branch =>
            (branch.packages || []).map(pkg => ({
              ...pkg,
              branchName: branch.branchName,
              branchId: branch.branchId // Thêm branchId để filter theo chi nhánh
            }))
        )

        // Lấy danh sách nhà đầu tư
        if (response.data.investor?.content) {
          displayedInvestors.value = response.data.investor.content
          pagination.value = {
            number: response.data.investor.page.number,
            size: response.data.investor.page.size,
            totalElements: response.data.investor.page.totalElements,
            totalPages: response.data.investor.page.totalPages
          }
        }

        // Lấy thống kê
        if (response.data.branchInvestorStats) {
          stats.value = response.data.branchInvestorStats
        }

        updatePagesArray()
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    // Hiển thị thông báo lỗi nếu cần
  } finally {
    isLoading.value = false
  }
}

const updatePagesArray = () => {
  const pages = []
  const totalPages = pagination.value.totalPages
  const current = pagination.value.number + 1
  const delta = 2

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  pagination.value.pages = pages
}

// Branch status methods
const getBranchStatusClass = (status) => {
  switch (status) {
    case 'OPEN':
    case 'FULL':
      return 'branch-count-active'
    case 'CLOSED':
    case 'DRAFT':
    default:
      return 'branch-count-closed'
  }
}

const getBranchStatusLabel = (status) => {
  switch (status) {
    case 'OPEN': return 'Mở'
    case 'CLOSED': return 'Đóng'
    case 'DRAFT': return 'Nháp'
    case 'FULL': return 'Đầy'
    default: return status
  }
}

// Filter handlers
const handleSearch = () => {
  clearTimeout(window.searchTimeout)
  window.searchTimeout = setTimeout(() => {
    applyFilters()
  }, 300)
}

const selectBranch = (branchId) => {
  filters.value.branchId = branchId

  // Reset package filter khi chọn chi nhánh mới
  filters.value.packageId = null
  packageSearch.value = ''

  // Filter packages theo chi nhánh được chọn
  filterPackagesByBranch()

  applyFilters()
}

// Filter packages theo chi nhánh được chọn
const filterPackagesByBranch = () => {
  if (filters.value.branchId === ALL_BRANCHES_ID) {
    // Nếu đang ở tất cả chi nhánh, hiển thị tất cả gói với tên chi nhánh
    packages.value = branches.value.flatMap(branch =>
        (branch.packages || []).map(pkg => ({
          ...pkg,
          branchName: branch.branchName,
          branchId: branch.branchId
        }))
    )
  } else {
    // Nếu đang chọn 1 chi nhánh cụ thể, chỉ hiển thị gói của chi nhánh đó
    const selectedBranch = branches.value.find(b => b.branchId === filters.value.branchId)
    if (selectedBranch) {
      packages.value = (selectedBranch.packages || []).map(pkg => ({
        ...pkg,
        branchName: selectedBranch.branchName,
        branchId: selectedBranch.branchId
      }))
    }
  }
}

const selectPackage = (pkg) => {
  filters.value.packageId = pkg.pkgId
  packageSearch.value = pkg.pkgName
  showPackageDropdown.value = false
  applyFilters()
}

const filterPackages = () => {
  showPackageDropdown.value = true
}

const sortBy = (field) => {
  if (filters.value.sortBy === field) {
    filters.value.sortDirection = filters.value.sortDirection === 'ASC' ? 'DESC' : 'ASC'
  } else {
    filters.value.sortBy = field
    filters.value.sortDirection = 'ASC'
  }

  applyFilters()
}

const toggleSortDirection = () => {
  filters.value.sortDirection = filters.value.sortDirection === 'ASC' ? 'DESC' : 'ASC'
  applyFilters()
}

const sortIcon = (field) => {
  if (filters.value.sortBy !== field) return 'fa-sort'
  return filters.value.sortDirection === 'ASC' ? 'fa-sort-up' : 'fa-sort-down'
}

const handleFilterChange = () => {
  applyFilters()
}

const handleSortChange = () => {
  applyFilters()
}

const applyFilters = () => {
  filters.value.page = 0
  fetchData(true)
}

const resetFilters = () => {
  filters.value = {
    branchId: ALL_BRANCHES_ID,
    packageId: null,
    keyword: '',
    investmentStatus: null,
    profitStatus: null,
    page: 0,
    size: 10,
    sortBy: 'investedAt',
    sortDirection: 'DESC'
  }
  packageSearch.value = ''
  showPackageDropdown.value = false
  goToPage.value = 1

  // Reset packages để hiển thị tất cả gói
  filterPackagesByBranch()

  fetchData()
}

const changePage = (page) => {
  if (page >= 0 && page < pagination.value.totalPages) {
    filters.value.page = page
    goToPage.value = page + 1
    fetchData(true)
  }
}

const handlePageSizeChange = () => {
  applyFilters()
}

const goToSpecificPage = () => {
  const page = parseInt(goToPage.value)
  if (page >= 1 && page <= pagination.value.totalPages) {
    changePage(page - 1)
  } else {
    goToPage.value = pagination.value.number + 1
  }
}

const getSelectedBranchName = () => {
  if (filters.value.branchId === ALL_BRANCHES_ID) return 'Tất cả'
  const branch = branches.value.find(b => b.branchId === filters.value.branchId)
  return branch ? branch.branchName : ''
}

const getSelectedBranchStatusClass = () => {
  if (filters.value.branchId === ALL_BRANCHES_ID) return ''
  const branch = branches.value.find(b => b.branchId === filters.value.branchId)
  if (!branch) return ''

  switch (branch.status) {
    case 'OPEN':
    case 'FULL':
      return 'badge-success'
    case 'CLOSED':
      return 'badge-danger'
    case 'DRAFT':
      return 'badge-warning'
    default:
      return ''
  }
}

const getSelectedBranchStatusText = () => {
  if (filters.value.branchId === ALL_BRANCHES_ID) return ''
  const branch = branches.value.find(b => b.branchId === filters.value.branchId)
  if (!branch) return ''
  return getBranchStatusLabel(branch.status)
}

const getTableTitle = () => {
  if (filters.value.branchId === ALL_BRANCHES_ID) {
    return 'Danh sách nhà đầu tư'
  } else {
    const branch = branches.value.find(b => b.branchId === filters.value.branchId)
    return branch ? `Nhà đầu tư - ${branch.branchName}` : 'Danh sách nhà đầu tư'
  }
}

// Formatting methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num)
}

const formatVietnameseCurrency = (amount) => {
  const billions = Math.floor(amount / 1000000000)
  const millions = Math.floor((amount % 1000000000) / 1000000)

  if (billions > 0) {
    return `${billions} tỷ ${millions > 0 ? `${millions} triệu` : ''} đồng`.trim()
  }
  return `${millions} triệu đồng`
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getInitials = (name) => {
  return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
}

const getDateIndicator = (dateString) => {
  const returnDate = new Date(dateString)
  const today = new Date()
  const diffTime = returnDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'overdue'
  if (diffDays < 30) return 'near-due'
  return 'normal'
}

const getDaysRemaining = (dateString) => {
  const returnDate = new Date(dateString)
  const today = new Date()
  const diffTime = returnDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `Quá hạn ${Math.abs(diffDays)} ngày`
  if (diffDays === 0) return 'Hôm nay'
  return `Còn ${diffDays} ngày`
}

const getStatusLabel = (status) => {
  const found = investmentStatuses.value.find(s => s.value === status)
  return found ? found.label : status
}

const getProfitStatusLabel = (status) => {
  const found = profitStatuses.value.find(s => s.value === status)
  return found ? found.label : status
}

const getProfitStatusIcon = (status) => {
  switch (status) {
    case 'NOT_DUE':
      return 'fas fa-clock'
    case 'PAYING':
      return 'fas fa-money-bill-wave'
    case 'PAID':
      return 'fas fa-check-circle'
    default:
      return 'fas fa-question-circle'
  }
}

const getSimpleStatusIcon = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'fas fa-check-circle'
    case 'UPGRADED':
      return 'fas fa-level-up-alt'
    case 'CANCELLED':
      return 'fas fa-times-circle'
    default:
      return 'fas fa-question-circle'
  }
}

const getSimpleStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return '#10b981' // green
    case 'UPGRADED':
      return '#3b82f6' // blue
    case 'CANCELLED':
      return '#ef4444' // red
    default:
      return '#94a3b8' // gray
  }
}

const getStatusTooltip = (status) => {
  return getStatusLabel(status)
}

const removeVietnameseDiacritics = (str) => {
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  str = str.replace(/đ/g, "d").replace(/Đ/g, "D")
  return str
}

// Watchers
watch(() => filters.value.page, () => {
  updatePagesArray()
})

watch(() => filters.value.size, () => {
  updatePagesArray()
})

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>


<style scoped>
.investor-management {
  padding: 16px;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

/* Page Header */
.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title i {
  color: #3b82f6;
  font-size: 28px;
}

.page-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-export {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-export:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.btn-refresh {
  background: white;
  border: 1px solid #e2e8f0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.btn-refresh:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #3b82f6;
}

/* Dashboard Stats */
.dashboard-stats {
  margin-bottom: 24px;
  /* Gradient background cho toàn bộ dashboard */
  background: linear-gradient(135deg, #5f6fd1 0%, #6b4b9a 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(95, 111, 209, 0.15);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.stat-card {
  /* Hiệu ứng kính mờ */
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
  /* Nền trong suốt nhẹ cho icon */
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

/* Xóa các lớp gradient cũ */
.total-investors,
.total-investment,
.active-branches,
.expected-profit {
  /* Gradient đã được chuyển lên dashboard-stats */
}

.total-investment {
  position: relative;
}

.total-investment .vn-money {
  position: absolute;
  bottom: 12px;
  right: 24px;
}

.stat-content {
  flex: 1;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Cập nhật màu chữ cho phù hợp với nền gradient tối */
.stat-value {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: white !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
}

.stat-change {
  display: inline-block;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-change.positive {
  background: rgba(209, 250, 229, 0.25);
  color: #d1fae5;
  border-color: rgba(209, 250, 229, 0.3);
}

/* Thống kê phụ */
.stat-sub-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sub-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.sub-stat-value {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.sub-stat-label {
  color: rgba(255, 255, 255, 0.7);
}

/* VN Money display */
.vn-money .stat-label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Adjust hover effect for stat cards with sub-stats */
.stat-card:hover .vn-money .stat-label {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

/* Main Filter Section */
.main-filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #f1f5f9;
}

.filter-header {
  margin-bottom: 20px;
}

.filter-header h3 {
  margin: 0;
  font-size: 16px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: start;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group.full-width {
  grid-column: 1 / -1;
}

.filter-group label {
  font-size: 13px;
  color: #475569;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  height: 20px;
  display: flex;
  align-items: center;
}

/* Branches Filter Bar */
.branches-filter-bar {
  display: flex;
  gap: 12px;
  align-items: stretch;
  min-height: 42px;
}

.branches-scroll-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.branches-scroll-container {
  flex: 1;
  overflow-x: auto;
  display: flex;
  align-items: center;
}

.branches-list {
  display: flex;
  gap: 8px;
  min-width: min-content;
  padding: 4px 8px 4px 0;
  align-items: center;
}

.branch-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-size: 13px;
  flex-shrink: 0;
  height: 36px;
  box-sizing: border-box;
  align-self: center;
}

.branch-tag:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.branch-tag.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.branch-status {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.branch-active {
  background: #d1fae5;
  color: #065f46;
}

.branch-closed {
  background: #fee2e2;
  color: #991b1b;
}

.branch-count {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.branch-count-active {
  background: rgba(209, 250, 229, 0.8);
  color: #065f46;
}

.branch-count-closed {
  background: rgba(254, 226, 226, 0.8);
  color: #991b1b;
}

/* Search Box */
.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
}

.search-box input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
  height: 42px;
  box-sizing: border-box;
}

.search-box input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Combobox */
.combobox-wrapper {
  position: relative;
}

.combobox-input {
  position: relative;
}

.combobox-input i.fa-box {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
}

.combobox-input input {
  width: 100%;
  padding: 10px 36px 10px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
  height: 42px;
  box-sizing: border-box;
}

.combobox-input input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.combobox-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  cursor: pointer;
  font-size: 12px;
}

.combobox-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
}

.dropdown-item {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f1f5f9;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item.empty {
  color: #94a3b8;
  text-align: center;
  cursor: default;
}

.package-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.package-name {
  font-weight: 500;
  color: #1e293b;
}

.package-branch {
  font-size: 12px;
  color: #64748b;
}

.package-status {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
  align-self: flex-start;
}

.package-status-active {
  background: #d1fae5;
  color: #065f46;
}

.package-status-closed {
  background: #fee2e2;
  color: #991b1b;
}

/* Select */
.filter-group select {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  color: #334155;
  height: 42px;
  box-sizing: border-box;
}

.filter-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Filter Actions */
.filter-actions {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  height: 100%;
}

.btn-icon.reset-btn {
  width: 100%;
  height: 42px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon.reset-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #3b82f6;
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #f1f5f9;
}

.table-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 768px) {
  .table-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.table-title h3 {
  margin: 0 0 8px;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.table-subtitle {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.badge-info {
  background: #dbeafe;
  color: #1e40af;
}

.badge-light {
  background: #f1f5f9;
  color: #475569;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.table-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 768px) {
  .table-controls {
    flex-direction: row;
    align-items: center;
    gap: 24px;
  }
}

.records-count {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-control label {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.sort-control select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.sort-direction {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s;
}

.sort-direction:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #3b82f6;
}

/* Table Container */
.table-container {
  overflow-x: auto;
  min-height: 400px;
}

.investor-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.investor-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-size: 13px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.investor-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  vertical-align: middle;
}

.investor-table tbody tr {
  transition: background-color 0.2s;
}

.investor-table tbody tr:hover {
  background: #f8fafc;
}

.investor-table tbody tr:last-child td {
  border-bottom: none;
}

/* Cột STT */
.stt-column {
  width: 60px;
  text-align: center;
}

.stt-cell {
  text-align: center;
}

.stt-number {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #f1f5f9;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

/* Table Head Content */
.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover .th-content {
  color: #3b82f6;
}

.sortable .fas {
  font-size: 12px;
  opacity: 0.7;
}

/* Column specific styles */
.investor-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.investor-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.investor-name {
  font-weight: 600;
  color: #1e293b;
}

.investor-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.investor-id {
  font-size: 12px;
  color: #64748b;
}

.investor-phone {
  font-size: 12px;
  color: #3b82f6;
  display: flex;
  align-items: center;
  gap: 4px;
}

.investor-phone i {
  font-size: 10px;
}

/* Badge trạng thái thanh toán nhỏ */
.payment-status-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 120px;
}

.payment-not_due {
  background: #f3f4f6;
  color: #374151;
}

.payment-paying {
  background: #fef3c7;
  color: #92400e;
}

.payment-paid {
  background: #d1fae5;
  color: #065f46;
}

.branch-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.branch-icon {
  color: #94a3b8;
  font-size: 14px;
}

.package-info {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  gap: 8px;
  min-width: 180px;
}

.package-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.duration-badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  align-self: flex-start;
}

.package-status-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
  align-self: flex-start;
}

.package-status-active {
  background: #d1fae5;
  color: #065f46;
}

.package-status-closed {
  background: #fee2e2;
  color: #991b1b;
}

.package-info small {
  color: #64748b;
  font-size: 12px;
  text-align: left;
}

.amount-cell {
  min-width: 140px;
}

.amount-cell strong {
  font-family: 'SF Mono', 'Courier New', monospace;
  font-weight: 600;
  color: #1e293b;
  font-size: 15px;
}

.amount-breakdown {
  margin-top: 4px;
}

.amount-breakdown small {
  color: #64748b;
  font-size: 12px;
}

.profit-cell {
  min-width: 120px;
}

.profit-percent {
  color: #10b981;
  font-weight: 600;
  font-size: 15px;
  display: block;
  margin-bottom: 6px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 3px;
}

.date-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
}

.date-cell small {
  color: #64748b;
  font-size: 12px;
}

.date-indicator-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.date-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.date-indicator.normal {
  background: #10b981;
}

.date-indicator.near-due {
  background: #f59e0b;
}

.date-indicator.overdue {
  background: #ef4444;
}

/* Cột trạng thái icon */
.status-icon-cell {
  width: 60px;
  text-align: center;
}

.status-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
}

.status-icon-wrapper:hover {
  background: #e2e8f0;
  transform: scale(1.1);
}

.status-icon-wrapper i {
  font-size: 16px;
}

/* Action Cell */
.action-cell {
  min-width: 100px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #3b82f6;
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  padding: 60px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: #f8fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  font-size: 32px;
}

.empty-content h4 {
  margin: 0 0 8px;
  color: #475569;
  font-size: 18px;
}

.empty-content p {
  margin: 0 0 20px;
  color: #64748b;
  max-width: 300px;
}

/* Pagination */
.pagination {
  padding: 20px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
}

.pagination-info select {
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.pagination-label {
  font-size: 14px;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 8px;
}

.page-dots {
  color: #94a3b8;
  padding: 0 8px;
}

.pagination-btn {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #3b82f6;
}

.pagination-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.first,
.pagination-btn.last,
.pagination-btn.prev,
.pagination-btn.next {
  background: #f8fafc;
}

.pagination-go {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-go span {
  color: #64748b;
  font-size: 14px;
}

.pagination-go input {
  width: 60px;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}

.pagination-go input:focus {
  outline: none;
  border-color: #3b82f6;
}

.pagination-go button {
  padding: 8px 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-go button:hover {
  background: #e2e8f0;
}

/* Scrollbar styling */
.branches-scroll-container::-webkit-scrollbar,
.combobox-dropdown::-webkit-scrollbar,
.table-container::-webkit-scrollbar {
  height: 6px;
}

.branches-scroll-container::-webkit-scrollbar-track,
.combobox-dropdown::-webkit-scrollbar-track,
.table-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.branches-scroll-container::-webkit-scrollbar-thumb,
.combobox-dropdown::-webkit-scrollbar-thumb,
.table-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.branches-scroll-container::-webkit-scrollbar-thumb:hover,
.combobox-dropdown::-webkit-scrollbar-thumb:hover,
.table-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.combobox-dropdown::-webkit-scrollbar {
  width: 6px;
}
</style>