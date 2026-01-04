<template>
  <div class="investment-branches">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="bg-circle c1"></div>
      <div class="bg-circle c2"></div>
      <div class="bg-circle c3"></div>
    </div>

    <!-- Toast Notifications Container -->
    <!-- Toast Notifications Container -->
    <div v-if="toast.show" class="toast-notification" :class="toast.type">
      <i :class="toast.icon"></i>
      <div class="toast-content">
        <span>{{ toast.message }}</span>
        <!-- Hiển thị suggestions nếu có -->
        <div v-if="toast.suggestions && toast.suggestions.length > 0" class="toast-suggestions">
          <p class="suggestions-title">Slug gợi ý:</p>
          <div class="suggestions-list">
        <span
            v-for="(slug, index) in toast.suggestions"
            :key="index"
            class="suggestion-item"
            @click="copyToClipboard(slug)"
        >
          {{ slug }}
        </span>
          </div>
        </div>
      </div>
      <button class="btn-toast-close" @click="hideToast">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="title-wrapper">
          <h1>
            <span class="title-text">
              <span class="title-main">Quản lý chi nhánh đầu tư</span>
              <span class="title-sub">Tạo, chỉnh sửa và quản lý các chi nhánh hợp tác đầu tư</span>
            </span>
          </h1>
          <div class="stats-bubble">
            <div class="stat-item">
              <i class="fas fa-building"></i>
              <span class="stat-value">{{ totalElements }}</span>
              <span class="stat-label">Chi nhánh</span>
            </div>
          </div>
        </div>

        <div class="header-actions">
          <button class="btn-create" @click="openCreateModal">
            <span class="btn-icon">
              <i class="fas fa-plus"></i>
            </span>
            <span class="btn-text">Thêm chi nhánh mới</span>
            <div class="btn-shine"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Search & Filter Section -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm chi nhánh theo tên, mô tả..."
              @input="handleSearch"
              class="search-input"
          />
          <div class="search-focus-line"></div>
        </div>

        <div class="filter-buttons">
          <button
              v-for="status in statusFilters"
              :key="status.value"
              :class="['filter-btn', { active: activeFilter === status.value }]"
              @click="setFilter(status.value)"
          >
            <span class="filter-dot" :style="{ backgroundColor: status.color }"></span>
            {{ status.label }}
          </button>
        </div>

        <!-- Sort Dropdown -->
        <div class="sort-dropdown" ref="sortDropdown">
          <button
              class="sort-btn"
              @click="toggleSortDropdown"
              @blur="onSortBtnBlur"
          >
            <i class="fas" :class="sortDirection === 'desc' ? 'fa-sort-amount-down' : 'fa-sort-amount-up'"></i>
            <span>{{ getSortLabel() }}</span>
            <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotate': showSortDropdown }"></i>
          </button>

          <div
              v-if="showSortDropdown"
              class="sort-options"
              @mouseenter="keepDropdownOpen = true"
              @mouseleave="keepDropdownOpen = false"
          >
            <button
                @click="changeSort('createdAt')"
                :class="{ active: sortField === 'createdAt' }"
            >
              <i class="fas" :class="sortField === 'createdAt' && sortDirection === 'asc' ? 'fa-sort-amount-up-alt' : 'fa-sort-amount-down-alt'"></i>
              Ngày tạo {{ sortField === 'createdAt' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
            </button>
            <button
                @click="changeSort('name')"
                :class="{ active: sortField === 'name' }"
            >
              <i class="fas" :class="sortField === 'name' && sortDirection === 'asc' ? 'fa-sort-alpha-up' : 'fa-sort-alpha-down'"></i>
              Tên {{ sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
            </button>
            <button
                @click="changeSort('targetAmount')"
                :class="{ active: sortField === 'targetAmount' }"
            >
              <i class="fas fa-money-bill-wave"></i>
              Mục tiêu {{ sortField === 'targetAmount' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
            </button>
            <button
                @click="changeSort('endDate')"
                :class="{ active: sortField === 'endDate' }"
            >
              <i class="fas fa-calendar-alt"></i>
              Ngày kết thúc {{ sortField === 'endDate' ? (sortDirection === 'asc' ? '↑' : '↓') : '' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-content">
          <div class="spinner-container">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-center"></div>
          </div>
          <p class="loading-text">Đang tải dữ liệu chi nhánh...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!branches || branches.length === 0" class="empty-state">
        <div class="empty-illustration">
          <div class="empty-building">
            <i class="fas fa-building"></i>
          </div>
          <div class="empty-plus">
            <i class="fas fa-plus"></i>
          </div>
        </div>
        <h3 class="empty-title">Chưa có chi nhánh nào</h3>
        <p class="empty-description">Hãy tạo chi nhánh đầu tiên để bắt đầu hợp tác đầu tư</p>
        <button class="btn-empty-create" @click="openCreateModal">
          <i class="fas fa-plus-circle"></i>
          Tạo chi nhánh đầu tiên
        </button>
      </div>

      <!-- Branches Grid -->
      <div v-else class="branches-grid">
        <div
            v-for="branch in branches"
            :key="branch.id"
            class="branch-card"
            :class="[`status-${branch.status.toLowerCase()}`, { 'featured': branch.status === 'OPEN' }]"
            @click="openEditModal(branch)"
        >
          <!-- Card Glow Effect -->
          <div class="card-glow"></div>

          <!-- Card Header -->
          <div class="card-header">
            <div class="status-wrapper">
              <div class="status-indicator" :style="{ backgroundColor: getStatusColor(branch.status) }"></div>
              <span class="status-text">{{ getStatusText(branch.status) }}  {{branch.parentId ? ' | Đợt mở lại' : ''}}</span>
            </div>
            <div class="card-actions">
              <button class="action-btn edit" @click.stop="openEditModal(branch)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" @click.stop="confirmDelete(branch)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>

          <!-- Card Thumbnail -->
          <div class="card-thumbnail">
            <div class="thumbnail-overlay"></div>
            <img
                v-if="branch.thumbnail"
                :src="baseImgaeUrl+branch.thumbnail"
                :alt="branch.name"
                class="thumbnail-image"
            />
            <div v-else class="thumbnail-placeholder">
              <i class="fas fa-city"></i>
            </div>
            <div class="thumbnail-badge">
              <i class="fas fa-boxes"></i>
              <span>{{ branch.packagesCount || 0 }} gói</span>
            </div>
          </div>

          <!-- Card Content -->
          <div class="card-content">
            <h3 class="branch-name">{{ branch.name }}</h3>
            <div class="branch-content-wrapper">
              <p class="branch-description">{{ truncateString(branch.description) }}</p>

              <!-- Progress Bar -->
              <div class="progress-section">
                <div class="progress-label">
                  <span>Tiến độ đầu tư</span>
                  <span class="progress-percent">{{ branch.progressPercent || 0 }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="`width: ${branch.progressPercent || 0}%`"></div>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="quick-stats">
                <div class="stat">
                  <i class="fas fa-bullseye stat-icon"></i>
                  <div class="stat-content">
                    <span class="stat-label">Mục tiêu</span>
                    <span class="stat-value">{{ formatCurrency(branch.targetAmount) }}</span>
                  </div>
                </div>
                <div class="stat">
                  <i class="fas fa-calendar-alt stat-icon"></i>
                  <div class="stat-content">
                    <span class="stat-value">{{ checkDate(branch.endDate) }}</span>
                    <span class="stat-label">{{ formatDate(branch.endDate)}}</span>
                  </div>
                </div>
              </div>

              <!-- Packages Preview -->
              <div v-if="branch.packages && branch.packages.length > 0" class="packages-preview">
                <div class="packages-header">
                  <i class="fas fa-box-open"></i>
                  <span>Gói đầu tư</span>
                </div>
                <div class="packages-tags">
                  <div
                      v-for="pkg in branch.packages.slice(0, 3)"
                      :key="pkg.id"
                      class="package-tag"
                      :style="{ background: getPackageColor(pkg.amount) }"
                  >
                    <span class="package-name">{{ pkg.name }}</span>
                    <span class="package-amount">{{ formatCurrency(pkg.amount) }}</span>
                  </div>
                  <div v-if="branch.packages.length > 3" class="package-more">
                    +{{ branch.packages.length - 3 }} gói
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <button class="btn-view-details" @click.stop="openEditModal(branch)">
              <span>Xem chi tiết</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-section">
        <div class="pagination-container">
          <button
              :disabled="currentPage === 0"
              @click="changePage(currentPage - 1)"
              class="pagination-btn prev"
          >
            <i class="fas fa-chevron-left"></i>
            <span>Trước</span>
          </button>

          <div class="page-numbers">
            <span class="current-page">{{ currentPage + 1 }}</span>
            <span class="page-separator">/</span>
            <span class="total-pages">{{ totalPages }}</span>
          </div>

          <button
              :disabled="currentPage >= totalPages - 1"
              @click="changePage(currentPage + 1)"
              class="pagination-btn next"
          >
            <span>Sau</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <CreateEditModal
        v-if="showModal"
        :isEditing="isEditing"
        :formData="formData"
        :submitting="submitting"
        :modalLoading="modalLoading"
        @close="closeModal"
        @submit="submitForm"
        @addPackage="addNewPackage"
        @removePackage="removePackage"
        @fileUpload="handleFileUpload"
        @removeImage="removeImage"
        @goToBranch="goToBranch"
        @showWarning="showToastWarning"
        @ReopenBranch="reopenBranch"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteModal
        v-if="showDeleteModal"
        :branch="selectedBranch"
        :deleting="deleting"
        @cancel="cancelDelete"
        @confirm="deleteBranch"
    />
  </div>
</template>

<script setup>
import {ref, onMounted, computed, onUnmounted, reactive} from 'vue'
import api from "../../api/api.js";
import CreateEditModal from "./CreateEditModal.vue";
import DeleteModal from "./DeleteModal.vue";
import {baseImgaeUrl} from "../../assets/js/global.js";

// State
const branches = ref([])
const loading = ref(false)
const currentPage = ref(0)
const pageSize = ref(6)
const totalPages = ref(0)
const totalElements = ref(0)
const searchQuery = ref('')
const activeFilter = ref('ALL')

// Sorting state
const sortField = ref('createdAt')
const sortDirection = ref('desc')

// Modal states
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const selectedBranch = ref(null)
const modalLoading = ref(false)

// Thêm vào phần state
let searchTimeout = ref(null)
const deleting = ref(false)
const submitting = ref(false)

// Thêm vào phần state
const showSortDropdown = ref(false)
const keepDropdownOpen = ref(false)
const sortDropdown = ref(null)

// Thêm các methods mới
const toggleSortDropdown = () => {
  showSortDropdown.value = !showSortDropdown.value
}

const onSortBtnBlur = () => {
  // Đợi một chút để kiểm tra xem có click vào dropdown không
  setTimeout(() => {
    if (!keepDropdownOpen.value) {
      showSortDropdown.value = false
    }
  }, 100)
}


const showToastWarning = (warn) => {
  showToast(warn.type, warn.message)
}

// Sửa lại method changeSort để đóng dropdown sau khi chọn
const changeSort = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'desc'
  }

  // Đóng dropdown sau khi chọn
  showSortDropdown.value = false
  keepDropdownOpen.value = false

  // Reload dữ liệu với sắp xếp mới
  currentPage.value = 0
  fetchBranches(0)
}

// Thêm event listener để đóng dropdown khi click ra ngoài
const handleClickOutside = (event) => {
  if (sortDropdown.value && !sortDropdown.value.contains(event.target)) {
    showSortDropdown.value = false
    keepDropdownOpen.value = false
  }
}

// Thêm vào lifecycle hooks
onMounted(() => {
  fetchBranches()
  // Thêm event listener
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // Dọn dẹp event listener
  document.removeEventListener('click', handleClickOutside)
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
  }
})

// Form data
const formData = ref({
  id: null,
  slug: '',
  name: '',
  thumbnail: null,
  description: '',
  targetAmount: '',
  startDate: '',
  endDate: '',
  status: 'DRAFT',
  packages: [],
  parentId: null, // Thêm parentId
  children: [],    // Thêm children
  canReopen: false
})

// Filters
const statusFilters = ref([
  { value: 'ALL', label: 'Tất cả', color: '#667eea' },
  { value: 'OPEN', label: 'Đang mở', color: '#10b981' },
  { value: 'DRAFT', label: 'Nháp', color: '#f59e0b' },
  { value: 'CLOSED', label: 'Đã đóng', color: '#ef4444' },
  { value: 'FULL', label: 'Đã đầy', color: '#8b5cf6' }
])

// Toast notification state
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})
// Thêm timeout ref để quản lý
const toastTimeout = ref(null)

// Methods
const showToast = (type = 'info', message, suggestions = null) => {
  // Xóa toast cũ nếu có
  hideToast()

  toast.message = message
  toast.type = type
  toast.suggestions = suggestions // Thêm suggestions vào toast object

  switch (type) {
    case 'success':
      toast.icon = 'fas fa-check-circle'
      break
    case 'error':
      toast.icon = 'fas fa-exclamation-circle'
      break
    case 'warning':
      toast.icon = 'fas fa-exclamation-triangle'
      break
    default:
      toast.icon = 'fas fa-info-circle'
  }

  toast.show = true
  // Tự động ẩn sau 5 giây cho lỗi có suggestions, 3 giây cho thông báo khác
  const duration = suggestions ? 10000 : 3000
  toastTimeout.value = setTimeout(() => {
    toast.show = false
  }, duration)
}

const hideToast = () => {
  toast.show = false
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
    toastTimeout.value = null
  }
}

// Thêm vào methods
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    showToast('success', `Đã sao chép: ${text}`)
  }).catch(err => {
    console.error('Lỗi khi sao chép:', err)
  })
}

// Đảm bảo dọn dẹp khi component unmount
onUnmounted(() => {
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
  }
})

const getToastIcon = (type) => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }
  return icons[type] || 'fas fa-bell'
}

// Computed
const filteredBranches = computed(() => {
  return branches.value
})

// Methods
const fetchBranches = async (page = currentPage.value, size = pageSize.value) => {
  loading.value = true
  try {
    // Tạo object params với tất cả tham số
    const params = {
      page,
      size,
      sort: `${sortField.value},${sortDirection.value}`,
      keyword: searchQuery.value || null,
      status: activeFilter.value !== 'ALL' ? activeFilter.value : null
    }

    // Xóa các giá trị null/undefined
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    })

    const response = await api.get('/investment/branches', {
      params: params
    })

    branches.value = response.data.data.content
    totalPages.value = response.data.data.page.totalPages
    totalElements.value = response.data.data.page.totalElements
    currentPage.value = response.data.data.page.number
  } catch (error) {
    console.error('Lỗi khi tải chi nhánh:', error)
    showToast('error', 'Không thể tải danh sách chi nhánh')
  } finally {
    loading.value = false
  }
}

const fetchBranchDetail = async (id) => {
  try {
    const response = await api.get(`/investment/branches/${id}`)
    console.log("RESPONSE nhận được",response.data)
    return response.data.data
  } catch (error) {
    console.error('Lỗi khi tải chi tiết chi nhánh:', error)
    showToast('error', 'Không thể tải chi tiết chi nhánh')
    return null
  }
}

const handleSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    currentPage.value = 0 // Reset về trang đầu khi tìm kiếm
    fetchBranches(0)
  }, 500)
}

const setFilter = (filter) => {
  activeFilter.value = filter
  currentPage.value = 0 // Reset về trang đầu khi lọc
  fetchBranches(0)
}



const getSortLabel = () => {
  const labels = {
    'createdAt': 'Ngày tạo',
    'name': 'Tên',
    'targetAmount': 'Mục tiêu',
    'endDate': 'Ngày kết thúc'
  }
  const fieldLabel = labels[sortField.value] || 'Sắp xếp'
  const directionIcon = sortDirection.value === 'asc' ? '↑' : '↓'
  return `${fieldLabel} ${directionIcon}`
}

const changePage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    fetchBranches(page)
  }
}

const openCreateModal = () => {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

const openEditModal = async (branch) => {
  modalLoading.value = true
  showModal.value = true

  try {
    const branchDetail = await fetchBranchDetail(branch.id)

    if (branchDetail) {
      // Format dữ liệu đúng cho form
      formData.value = {
        id: branchDetail.id,
        slug: branchDetail.slug,
        name: branchDetail.name,
        thumbnail: branchDetail.thumbnail,
        description: branchDetail.description,
        targetAmount: branchDetail.targetAmount?.toString() || '',
        startDate: formatDateForInput(branchDetail.startDate),
        endDate: formatDateForInput(branchDetail.endDate),
        status: branchDetail.status,
        packages: branchDetail.packages?.map(pkg => ({
          id: pkg.id,
          name: pkg.name,
          amount: pkg.amount?.toString() || '',
          profitPercent: pkg.profitPercent?.toString() || '',
          durationMonths: pkg.durationMonths?.toString() || '',
          isActive: pkg.isActive !== false
        })) || [],
        parentId: branchDetail.parentId || null,
        children: branchDetail.children || [],
        // QUAN TRỌNG: đảm bảo gán đúng giá trị
        canReopen: branchDetail.canReopen !== false // hoặc Boolean(branchDetail.canReopen)
      }

      // DEBUG: Kiểm tra giá trị canReopen
      console.log('📋 API response canReopen:', {
        raw: branchDetail.canReopen,
        type: typeof branchDetail.canReopen,
        boolean: Boolean(branchDetail.canReopen)
      })
      console.log('📋 FormData canReopen:', formData.value.canReopen)
    }

    isEditing.value = true
  } catch (error) {
    console.error('Lỗi khi mở modal chỉnh sửa:', error)
    showToast('error', 'Không thể tải chi tiết chi nhánh')
    closeModal()
  } finally {
    modalLoading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  modalLoading.value = false // Reset loading state
  resetForm() // Reset form data
}

const resetForm = () => {
  formData.value = {
    id: null,
    slug: '',
    name: '',
    thumbnail: null,
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT',
    packages: [],
    parentId: null, // Reset parentId
    children: [],    // Reset children
    canReopen: false
  }
}

const addNewPackage = () => {
  formData.value.packages.push({
    name: '',
    amount: '',
    profitPercent: '',
    durationMonths: '',
    isActive: true
  })
}

const removePackage = (index) => {
  formData.value.packages.splice(index, 1)
}

const handleFileUpload = (file) => {
  // File đã được xử lý trong modal
}

const removeImage = () => {
  formData.value.thumbnail = null
}

const submitForm = async (formDataFromModal, file) => {
  submitting.value = true
  try {
    // 1. VALIDATION - Kiểm tra dữ liệu trước khi gửi
    if (!formDataFromModal.name || formDataFromModal.name.trim() === '') {
      showToast('error', 'Vui lòng nhập tên chi nhánh')
      submitting.value = false
      return
    }

    if (!formDataFromModal.slug || formDataFromModal.slug.trim() === '') {
      showToast('error', 'Vui lòng nhập slug')
      submitting.value = false
      return
    }

    if (!formDataFromModal.targetAmount || parseFloat(formDataFromModal.targetAmount) <= 0) {
      showToast('error', 'Vui lòng nhập số tiền mục tiêu hợp lệ')
      submitting.value = false
      return
    }

    // 2. Tạo FormData đúng cách
    const formDataToSend = new FormData()

    // 3. Tạo branchDTO object với kiểu dữ liệu đúng - THÊM parentId và children
    const branchDTO = {
      id: formDataFromModal.id ? parseInt(formDataFromModal.id) : null,
      name: formDataFromModal.name,
      slug: formDataFromModal.slug,
      description: formDataFromModal.description,
      targetAmount: parseFloat(formDataFromModal.targetAmount) || 0,
      startDate: formDataFromModal.startDate,
      endDate: formDataFromModal.endDate,
      status: formDataFromModal.status,
      packages: formDataFromModal.packages.map(pkg => ({
        id: pkg.id || null,
        name: pkg.name,
        amount: parseFloat(pkg.amount) || 0,
        profitPercent: parseFloat(pkg.profitPercent) || 0,
        durationMonths: parseInt(pkg.durationMonths) || 1,
        isActive: pkg.isActive !== false
      })),
      // Thêm parentId và children
      parentId: formDataFromModal.parentId ? parseInt(formDataFromModal.parentId) : null,
      children: formDataFromModal.children || [],
      canReopen: formDataFromModal.canReopen !== false, // ← Thêm thuộc tính mới
    }

    // 4. Thêm branchDTO dưới dạng JSON string với đúng key
    formDataToSend.append('branchDTO', new Blob(
        [JSON.stringify(branchDTO)],
        { type: 'application/json' }
    ))

    // 5. Thêm file nếu có
    if (file) {
      formDataToSend.append('thumbnail', file)
    }

    // 6. Gọi API
    let response
    if (isEditing.value && branchDTO.id) {
      console.log('🔄 Cập nhật chi nhánh ID:', branchDTO.id)
      response = await api.put(`/investment/branches/${branchDTO.id}`, formDataToSend)
    } else {
      console.log('➕ Tạo chi nhánh mới')
      console.log('➕ Tạo chi nhánh mới')
      console.log('📤 ParentId trong create:', branchDTO.parentId)
      response = await api.post('/investment/branches', formDataToSend)
    }

    // 7. Kiểm tra response từ BE
    if (response.data.status === '400') {
      // Xử lý lỗi slug trùng
      if (response.data.message.includes('Slug đã tồn tại')) {
        showToast('error', response.data.message, response.data.metadata?.suggestedSlugs)
      } else {
        showToast('error', response.data.message)
      }
      submitting.value = false
      return
    }

    console.log('✅ API Response:', response.data)

    // 8. Đóng modal và reload dữ liệu
    closeModal()
    await fetchBranches()

    // 9. Hiển thị thông báo thành công
    showToast('success', isEditing.value ? 'Cập nhật thành công' : 'Tạo thành công')

  } catch (error) {
    console.error('❌ Lỗi khi lưu chi nhánh:', error)

    // Xử lý lỗi network hoặc lỗi từ axios
    showToast('error', error.response?.data?.message || 'Có lỗi xảy ra khi lưu chi nhánh')

  } finally {
    submitting.value = false
  }
}

// Hàm reopenBranch
const reopenBranch = async (branchId) => {
  if (!branchId) {
    showToast('error', 'Không tìm thấy ID chi nhánh để mở lại')
    return
  }

  try {
    // 1. Đóng modal hiện tại (CreateEditModal)
    closeModal()

    // 2. Đợi một chút để modal đóng hoàn toàn
    await new Promise(resolve => setTimeout(resolve, 100))

    // 3. Reset form và cấu hình để mở modal mới
    resetForm()
    isEditing.value = false // Đặt là false vì đây là tạo mới

    // 4. Gán parentId bằng branchId nhận được
    formData.value.parentId = branchId
    console.log("Đã gán parentId =", branchId)
    // 5. Cập nhật trạng thái mặc định cho chi nhánh mở lại
    formData.value.status = 'OPEN' // Hoặc 'DRAFT' tùy theo yêu cầu

    // 6. Thêm tiền tố vào tên để phân biệt
    formData.value.name = `Mở lại - ${new Date().toLocaleDateString('vi-VN')}`

    // 7. Reset các field date (có thể cập nhật sau)
    const today = new Date()
    formData.value.startDate = formatDateForInput(today)

    // Tính ngày kết thúc mặc định (ví dụ: 30 ngày sau)
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + 30)
    formData.value.endDate = formatDateForInput(endDate)

    // 8. Mở modal CreateEditModal với dữ liệu đã được gán sẵn
    showModal.value = true

    // 9. Thông báo thành công
    showToast('success', 'Đã sẵn sàng tạo chi nhánh mới từ chi nhánh gốc')

  } catch (error) {
    console.error('Lỗi khi mở lại chi nhánh:', error)
    showToast('error', 'Có lỗi xảy ra khi mở lại chi nhánh')
  }
}

const confirmDelete = (branch) => {
  selectedBranch.value = branch
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  selectedBranch.value = null
}

const deleteBranch = async () => {
  deleting.value = true
  try {
    console.log('Xóa chi nhánh:', selectedBranch.value?.id)

    // Gọi API xóa
    const response = await api.delete(`/investment/branches/${selectedBranch.value?.id}`)

    // Kiểm tra response từ backend
    if (response.data.status === '400') {
      // Hiển thị thông báo lỗi từ BE
      showToast('warning', response.data.message || 'Không thể xóa chi nhánh')
      cancelDelete()
      return
    }

    console.log('Xóa thành công')

    // Đóng modal và reload dữ liệu
    cancelDelete()
    await fetchBranches()

    // Hiển thị thông báo thành công
    showToast('success', 'Xóa chi nhánh thành công')

  } catch (error) {
    console.error('Lỗi khi xóa chi nhánh:', error)

    // Kiểm tra nếu có response từ server
    if (error.response?.data?.status === '400') {
      showToast('warning', error.response.data.message || 'Không thể xóa chi nhánh')
    } else {
      showToast('error', error.response?.data?.message || 'Có lỗi xảy ra khi xóa chi nhánh')
    }

  } finally {
    deleting.value = false
  }
}

const goToBranch = async (branchId) => {
  if (!branchId) {
    showToast('error', 'Không tìm thấy ID chi nhánh')
    return
  }

  modalLoading.value = true

  try {
    // 1. Lấy dữ liệu chi tiết chi nhánh mới
    const branchDetail = await fetchBranchDetail(branchId)

    if (!branchDetail) {
      showToast('error', 'Không thể tải chi tiết chi nhánh')
      return
    }

    // 2. Đóng modal hiện tại
    closeModal()

    // 3. Đợi một chút để modal đóng hoàn toàn
    await new Promise(resolve => setTimeout(resolve, 100))

    // 4. Format dữ liệu mới cho form
    formData.value = {
      id: branchDetail.id,
      slug: branchDetail.slug,
      name: branchDetail.name,
      thumbnail: branchDetail.thumbnail,
      description: branchDetail.description,
      targetAmount: branchDetail.targetAmount?.toString() || '',
      startDate: formatDateForInput(branchDetail.startDate),
      endDate: formatDateForInput(branchDetail.endDate),
      status: branchDetail.status,
      packages: branchDetail.packages?.map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        amount: pkg.amount?.toString() || '',
        profitPercent: pkg.profitPercent?.toString() || '',
        durationMonths: pkg.durationMonths?.toString() || '',
        isActive: pkg.isActive !== false
      })) || [],
      parentId: branchDetail.parentId || null,
      children: branchDetail.children || [],
      canReopen: branchDetail.canReopen
    }

    // 5. Mở lại modal với dữ liệu mới
    isEditing.value = true
    showModal.value = true

    // 6. Thông báo thành công
    showToast('success', 'Đã chuyển đến chi nhánh mới')

  } catch (error) {
    console.error('Lỗi khi chuyển đến chi nhánh:', error)
    showToast('error', 'Có lỗi xảy ra khi chuyển đến chi nhánh')
  } finally {
    modalLoading.value = false
  }
}
// Helper methods
const getStatusColor = (status) => {
  const statusMap = {
    'OPEN': '#10b981',
    'DRAFT': '#f59e0b',
    'CLOSED': '#ef4444',
    'FULL': '#8b5cf6'
  }
  return statusMap[status] || '#6b7280'
}

const getStatusText = (status) => {
  const statusTextMap = {
    'OPEN': 'Đang mở',
    'DRAFT': 'Nháp',
    'CLOSED': 'Đã đóng',
    'FULL': 'Đã đầy'
  }
  return statusTextMap[status] || status
}

const getPackageColor = (amount) => {
  if (amount >= 1000000000) return 'linear-gradient(135deg, #f59e0b, #d97706)'
  if (amount >= 500000000) return 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
  return 'linear-gradient(135deg, #10b981, #059669)'
}

const formatCurrency = (amount) => {
  if (!amount) return '0 ₫'
  if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)} tỷ`
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)} triệu`
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

function checkDate(ngayCanKiemTra) {
  if (!ngayCanKiemTra) return 'Không có hạn'
  // Chuyển đổi đầu vào thành đối tượng Date
  const ngayKiemTra = new Date(ngayCanKiemTra);
  const ngayHienTai = new Date();

  // Đặt giờ về 00:00:00 để chỉ so sánh ngày
  ngayKiemTra.setHours(0, 0, 0, 0);
  ngayHienTai.setHours(0, 0, 0, 0);

  // Tính chênh lệch số ngày (tính bằng mili giây, chuyển sang ngày)
  const chechLechMs = ngayKiemTra.getTime() - ngayHienTai.getTime();
  const soNgayChenhLech = Math.ceil(chechLechMs / (1000 * 60 * 60 * 24));

  // Kiểm tra và trả về kết quả
  if (soNgayChenhLech > 0) {
    return `Còn lại ${soNgayChenhLech} ngày`;
  } else if (soNgayChenhLech < 0) {
    return `Đã hết hạn ${Math.abs(soNgayChenhLech)} ngày trước`;
  } else {
    return "Hết hạn vào hôm nay";
  }
}

const truncateString = (str) => {
  const maxLength = 30;
  const suffix = '.....';

  if (!str || typeof str !== 'string') {
    return '';
  }

  // Nếu chuỗi ngắn hơn hoặc bằng độ dài yêu cầu, trả về nguyên chuỗi
  if (str.length <= maxLength) {
    return str;
  }

  // Cắt chuỗi đến độ dài yêu cầu
  let truncated = '';
  let charCount = 0;

  // Duyệt qua từng ký tự để đảm bảo không cắt đôi ký tự Unicode
  for (let i = 0; i < str.length && charCount < maxLength; i++) {
    truncated += str[i];
    charCount++;
  }

  // Tìm vị trí dấu cách cuối cùng
  const lastSpace = truncated.lastIndexOf(' ');

  // Nếu tìm thấy dấu cách và không ở đầu chuỗi
  if (lastSpace > 0) {
    truncated = truncated.substring(0, lastSpace);
  }

  // Thêm dấu ... nếu chuỗi bị cắt
  if (truncated.length < str.length) {
    truncated += suffix;
  }

  return truncated;
}


// Lifecycle
onMounted(() => {
  fetchBranches()
})
</script>

<style scoped>
.investment-branches {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow-x: hidden;
}

/* Animated Background */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
  animation: float 20s infinite ease-in-out;
}

.bg-circle.c1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -100px;
  animation-delay: 0s;
}

.bg-circle.c2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -100px;
  animation-delay: 5s;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
}

.bg-circle.c3 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 20%;
  animation-delay: 10s;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 191, 36, 0.1) 100%);
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Header */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 0 0 2rem 2rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
  position: relative;
  z-index: 1;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
}

.title-icon {
  font-size: 3rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.title-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-main {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.title-sub {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
}

.stats-bubble {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.stat-item i {
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Create Button */
.btn-create {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.btn-create:hover .btn-shine {
  transform: translateX(100%);
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-text {
  white-space: nowrap;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
  );
  transition: transform 0.6s ease;
}

/* Search Section */
.search-section {
  max-width: 1400px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.search-container {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.1rem;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-focus-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.search-input:focus ~ .search-focus-line {
  width: 100%;
}

/* Filter Buttons */
.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.filter-btn.active {
  border-color: transparent;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
}

.filter-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* Sửa CSS cho sort dropdown */
.sort-dropdown {
  position: relative;
  z-index: 110;
}

.sort-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 140px;
  justify-content: space-between;
}

.sort-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.sort-options {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 100;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  /* Đảm bảo dropdown đủ cao */
  max-height: none;
}

/* Đảm bảo không có phần tử cha nào gây overflow:hidden */
.search-section,
.search-container,
.content-area {
  position: static; /* Hoặc relative nhưng không có overflow */
  overflow: visible !important;
}



.sort-options button {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.sort-options button:hover {
  background: #f8fafc;
  color: #3b82f6;
}

.sort-options button.active {
  background: #3b82f6;
  color: white;
}

/* Content Area */
.content-area {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
  position: relative;
  z-index: 1;
}

/* Loading State */
.loading-state {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
}

.spinner-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.spinner-ring:nth-child(1) {
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
}

.spinner-ring:nth-child(2) {
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
  animation-delay: 0.5s;
}

.spinner-ring:nth-child(3) {
  border: 3px solid rgba(245, 158, 11, 0.2);
  border-top-color: #f59e0b;
  animation-delay: 1s;
}

.spinner-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-illustration {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
}

.empty-building {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s infinite;
}

.empty-plus {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  animation: float 3s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
}

.empty-title {
  font-size: 1.8rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #64748b;
  margin-bottom: 2rem;
}

.btn-empty-create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-empty-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

/* Branches Grid - FIXED */
.branches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  align-items: stretch; /* Quan trọng: canh chỉnh các item theo chiều dọc */
}

/* Branch Card - FIXED */
.branch-card {
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%; /* Quan trọng: đảm bảo tất cả card có cùng chiều cao */
}

.branch-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.branch-card.featured {
  border: 2px solid #10b981;
}

.card-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 7px;
  background: linear-gradient(90deg, #667eea, #764ba2, #10b981);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.branch-card:hover .card-glow {
  opacity: 0.8;
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.25rem 0;
  flex-shrink: 0; /* Không co lại */
}

.status-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn.edit:hover {
  background: #3b82f6;
  color: white;
}

.action-btn.delete:hover {
  background: #ef4444;
  color: white;
}

/* Card Thumbnail */
.card-thumbnail {
  position: relative;
  height: 180px;
  overflow: hidden;
  margin: 1rem;
  border-radius: 1rem;
  flex-shrink: 0; /* Không co lại */
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%);
  z-index: 1;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.branch-card:hover .thumbnail-image {
  transform: scale(1.1);
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-size: 3rem;
  color: white;
}

.thumbnail-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
  z-index: 2;
}

/* Card Content - FIXED */
.card-content {
  padding: 0 1.25rem;
  flex: 1; /* Chiếm không gian còn lại */
  display: flex;
  flex-direction: column;
}

.branch-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  /* Giới hạn số dòng tiêu đề */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 3em; /* Chiều cao tối thiểu cho 2 dòng */
}

/* Branch Content Wrapper - FIXED */
.branch-content-wrapper {
  flex: 1; /* Chiếm không gian còn lại trong card-content */
  display: flex;
  flex-direction: column;
}

.branch-description {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex: 1; /* Chiếm không gian còn lại trong wrapper */
  /* Giới hạn số dòng mô tả */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Progress Section */
.progress-section {
  margin-bottom: 1.5rem;
  flex-shrink: 0; /* Không co lại */
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.progress-percent {
  font-weight: 700;
  color: #10b981;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 4px;
  transition: width 1s ease;
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-shrink: 0; /* Không co lại */
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.stat-icon {
  font-size: 1.25rem;
  color: #667eea;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
}

/* Packages Preview */
.packages-preview {
  margin-bottom: 1.5rem;
  flex-shrink: 0; /* Không co lại */
}

.packages-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.95rem;
}

.packages-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.package-tag {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  color: white;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 80px;
}

.package-name {
  font-weight: 600;
  font-size: 0.8rem;
}

.package-amount {
  font-size: 0.75rem;
  opacity: 0.9;
}

.package-more {
  padding: 0.5rem 0.75rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Card Footer */
.card-footer {
  padding: 1.25rem;
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0; /* Không co lại */
}

.btn-view-details {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

/* Pagination */
.pagination-section {
  margin-top: 2rem;
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.pagination-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 0.75rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.current-page {
  color: #3b82f6;
  font-size: 1.2rem;
}

.total-pages {
  color: #64748b;
}

.page-separator {
  color: #cbd5e1;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10000;
  animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 400px;
}

.toast-notification.success {
  background: linear-gradient(135deg, #28a745 0%, #34ce57 100%);
  color: white;
}

.toast-notification.error {
  background: linear-gradient(135deg, #dc3545 0%, #e4606d 100%);
  color: white;
}

.toast-notification.warning {
  background: linear-gradient(135deg, #ffc107 0%, #ffd54f 100%);
  color: #856404;
}

.toast-notification.info {
  background: linear-gradient(135deg, #17a2b8 0%, #4dc0d1 100%);
  color: white;
}

.toast-notification i {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-notification span {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
}

.btn-toast-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.btn-toast-close:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .search-container {
    flex-wrap: wrap;
  }

  .search-input-wrapper {
    width: 100%;
  }

  .filter-buttons {
    flex: 1;
  }

  .sort-dropdown {
    flex: 0 0 auto;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .title-wrapper {
    flex-direction: column;
    gap: 1rem;
  }

  .title-main {
    font-size: 2rem;
  }

  .branches-grid {
    grid-template-columns: 1fr;
  }

  .search-container {
    flex-direction: column;
  }

  .filter-buttons {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    justify-content: flex-start;
  }

  .sort-dropdown {
    width: 100%;
  }

  .sort-btn {
    width: 100%;
    justify-content: center;
  }

  .sort-options {
    width: 100%;
    right: auto;
    left: 0;
  }
}

@media (max-width: 480px) {
  .header, .search-section, .content-area {
    padding: 1rem;
  }

  .title-main {
    font-size: 1.75rem;
  }

  .btn-create, .btn-empty-create {
    width: 100%;
    justify-content: center;
  }

  .filter-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
}

/* Thêm vào CSS cho toast notification */
.toast-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast-suggestions {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.suggestions-title {
  font-size: 0.85rem;
  margin-bottom: 4px;
  opacity: 0.9;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.suggestion-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* Điều chỉnh toast width cho suggestions */
.toast-notification {
  max-width: 500px;
}
</style>