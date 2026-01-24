<template>
  <div class="reports-management">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white border-b border-gray-200 px-4 py-2">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Quản lý Báo cáo</h1>
            <p class="text-gray-600 mt-1">Giám sát và xử lý báo cáo vi phạm từ người dùng</p>
          </div>
          <div class="flex items-center space-x-3"></div>
        </div>
      </header>

      <!-- Toolbar & Filters -->
      <div class="px-8 py-6">
        <div class="filter-card p-3">
          <div class="flex flex-col lg:flex-row lg:items-center gap-5">
            <!-- Search -->
            <div class="flex-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
                <input
                    v-model="filters.keyword"
                    type="text"
                    placeholder="Tìm kiếm báo cáo..."
                    class="input-field pl-11 w-full"
                    style="padding-left: 40px"
                />
              </div>
            </div>

            <!-- Filter Groups -->
            <div class="flex flex-wrap gap-3">
              <div class="relative">
                <select v-model="filters.reason" class="input-field pr-10 appearance-none bg-white">
                  <option value="">Tất cả lý do</option>
                  <option value="spam">Spam</option>
                  <option value="incorrect_info">Sai thông tin</option>
                  <option value="scam">Lừa đảo</option>
                  <option value="inappropriate_content">Nội dung không phù hợp</option>
                </select>
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i class="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <input v-model="filters.dateFrom" type="date" class="input-field" />
                <span class="text-gray-500">-</span>
                <input v-model="filters.dateTo" type="date" class="input-field" />
              </div>

              <button @click="resetFilters" class="btn-secondary px-4 py-2.5">
                <i class="fas fa-redo mr-2"></i>
                Đặt lại
              </button>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="mt-6 pt-6 border-t border-gray-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="text-gray-700 font-medium">Lọc theo trạng thái:</span>
                <div class="flex flex-wrap gap-2">
                  <button
                      v-for="statusOption in statusOptions"
                      :key="statusOption.value"
                      :class="[
                      'status-filter-btn',
                      { active: filters.status === statusOption.value }
                    ]"
                      @click="filters.status = statusOption.value"
                  >
                    {{ statusOption.label }}
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600">Sắp xếp:</span>
                <select v-model="filters.sortBy" class="input-field text-sm">
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Body - Split View -->
      <div class="flex-1 flex overflow-hidden px-8 pb-8">
        <!-- Report List -->
        <div class="w-2/5 pr-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-gray-800">Danh sách báo cáo</h2>
            <span class="text-sm text-gray-600">{{ reports.length }}/{{ reports.length }}</span>
          </div>
          <div class="space-y-2 max-h-screen overflow-y-auto pr-2">
            <!-- Loading State -->
            <div v-if="loading" class="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-200">
              <i class="fas fa-spinner fa-spin text-4xl mb-4 text-gray-300"></i>
              <p class="text-lg font-medium mb-2">Đang tải dữ liệu...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="reports.length === 0" class="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-200">
              <i class="fas fa-inbox text-4xl mb-4 text-gray-300"></i>
              <p class="text-lg font-medium mb-2">Không tìm thấy báo cáo nào</p>
              <p class="text-sm">Thử thay đổi bộ lọc hoặc tìm kiếm</p>
            </div>

            <!-- Report Items -->
            <div
                v-for="report in reports"
                :key="report.id"
                :class="[
                'report-row bg-white',
                { selected: selectedReport?.id === report.id }
              ]"
                @click="selectReport(report)"
            >
              <div class="p-3">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-gray-900">#{{ report.id }}</span>
                    <span :class="getReasonColor(report.reason)" class="reason-badge">
                      {{ getReasonDisplay(report.reason) }}
                    </span>
                  </div>
                  <span :class="getStatusColor(report.status)" class="status-badge">
                    {{ getStatusDisplay(report.status) }}
                  </span>
                </div>

                <div class="mb-4">
                  <p class="font-medium text-gray-900 line-clamp-1">{{ report.listingTitle }}</p>
                  <p class="text-sm text-gray-600 mt-1">Người báo cáo: {{ report.reporterName }}</p>
                </div>

                <div class="flex items-center justify-between">
                  <div class="report-time">
                    <i class="far fa-clock"></i>
                    <span>{{ formatRelativeTime(report.createdAt) }}</span>
                  </div>

                  <div class="flex space-x-2">
                    <button @click.stop="handleReportAction(report.id, 'process')" class="action-btn resolve">
                      <i class="fas fa-cog mr-1.5"></i> Xử lý
                    </button>
                    <button @click.stop="ignoreReport(report.id)" class="action-btn reject">
                      <i class="fas fa-times mr-1.5"></i> Bỏ qua
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Report Detail -->
        <div class="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Loading State -->
          <div v-if="detailLoading && !selectedReport" class="h-full flex flex-col items-center justify-center text-gray-400 p-8">
            <i class="fas fa-spinner fa-spin text-4xl mb-4 text-gray-300"></i>
            <p class="text-lg font-medium mb-3">Đang tải chi tiết...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!selectedReport" class="h-full flex flex-col items-center justify-center text-gray-400 p-8">
            <div
                class="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6"
            >
              <i class="fas fa-flag text-gray-300 text-5xl"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Chọn một báo cáo</h3>
            <p class="text-gray-500 max-w-md text-center">
              Chọn một báo cáo từ danh sách bên trái để xem chi tiết và thực hiện các thao tác xử lý.
            </p>
          </div>

          <!-- Detail Content -->
          <div v-else class="h-full flex flex-col">
            <!-- Detail header -->
            <div class="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div class="flex justify-between items-center">
                <div>
                  <h2 class="text-xl font-bold text-gray-900">Báo cáo #{{ selectedReport.id }}</h2>
                  <div class="flex items-center gap-3 mt-2">
                    <span :class="getStatusColor(selectedReport.status)" class="status-badge">
                      {{ getStatusDisplay(selectedReport.status) }}
                    </span>
                    <span class="text-gray-600 text-sm">{{ formatRelativeTime(selectedReport.createdAt) }}</span>
                  </div>
                </div>
                <button @click="openDrawer" class="btn-primary px-5 py-2.5 font-medium">
                  <i class="fas fa-cog mr-2"></i> Xử lý báo cáo
                </button>
              </div>
            </div>

            <!-- Detail content -->
            <div class="flex-1 p-8 overflow-y-auto">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Reporter Info -->
                <div class="bg-gray-50 rounded-xl p-6">
                  <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                    <div
                        class="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg flex items-center justify-center mr-3"
                    >
                      <i class="fas fa-user text-indigo-600"></i>
                    </div>
                    Thông tin người báo cáo
                  </h3>
                  <div class="space-y-4">
                    <div>
                      <p class="text-sm text-gray-600 mb-1">Họ tên</p>
                      <p class="font-medium">{{ selectedReport.reporterName }}</p>
                    </div>
                    <div class="">
                      <div>
                        <p class="text-sm text-gray-600 mb-1">Email</p>
                        <p class="font-medium">{{ selectedReport.email }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-600 mb-1">Số điện thoại</p>
                        <p class="font-medium">{{ selectedReport.phone }}</p>
                      </div>
                    </div>
                    <div class="">
                      <div>
                        <p class="text-sm text-gray-600 mb-1">Địa chỉ IP</p>
                        <p class="font-medium">{{ selectedReport.reporterIp || 'Không có' }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-600 mb-1">Trình duyệt</p>
                        <p class="font-medium">{{ selectedReport.userAgent || 'Không có' }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Listing Info -->
                <div class="bg-gray-50 rounded-xl p-6">
                  <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                    <div
                        class="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg flex items-center justify-center mr-3"
                    >
                      <i class="fas fa-home text-emerald-600"></i>
                    </div>
                    Thông tin tin đăng
                  </h3>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm text-gray-600 mb-1">Listing ID</p>
                        <p class="font-medium">{{ selectedReport.listingId }}</p>
                      </div>
                      <router-link
                          :to="`/-thg/quan-ly-san-pham/${selectedReport.listingId}`"
                          class="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 bg-indigo-50 rounded-lg"
                      >
                        <i class="fas fa-external-link-alt mr-1.5"></i> Xem tin đăng
                      </router-link>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 mb-1">Tiêu đề</p>
                      <p class="font-medium">{{ selectedReport.listingTitle }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm text-gray-600 mb-1">Người đăng</p>
                        <p class="font-medium">{{ selectedReport.listingOwner || 'Không có' }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-600 mb-1">Ngày đăng</p>
                        <p class="font-medium">{{ formatDate(selectedReport.listingCreatedAt) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Report Details -->
                <div class="lg:col-span-2 bg-gray-50 rounded-xl p-6">
                  <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                    <div
                        class="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg flex items-center justify-center mr-3"
                    >
                      <i class="fas fa-exclamation-circle text-amber-600"></i>
                    </div>
                    Chi tiết báo cáo
                  </h3>
                  <div class="space-y-6">
                    <div class="flex items-center gap-3">
                      <p class="text-sm text-gray-600 m-0">Lý do báo cáo:</p>
                      <div class="flex items-center gap-3">
                        <span class="px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg font-medium">
                          {{ getReasonDisplay(selectedReport.reason) }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600 mb-2">Mô tả chi tiết</p>
                      <div class="mt-2 p-3 bg-white border border-gray-200 rounded-xl">
                        <p class="text-gray-700 leading-relaxed">{{ selectedReport.description || 'Không có mô tả' }}</p>
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center justify-between mb-2">
                        <p class="text-sm text-gray-600">Phản hồi từ Admin</p>
                        <span class="text-xs text-gray-500">
                          Cập nhật lần cuối: {{ formatRelativeTime(selectedReport.updatedAt || selectedReport.createdAt) }}
                        </span>
                      </div>
                      <div
                          class="mt-2 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl"
                      >
                        <div class="flex items-start gap-3">
                          <div
                              class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0"
                          >
                            <i class="fas fa-user-shield text-indigo-600 text-sm"></i>
                          </div>
                          <div v-if="selectedReport.responseMessage">
                            <p class="text-gray-800">{{ selectedReport.responseMessage }}</p>
                            <p class="text-xs text-gray-500 mt-2">
                              Cập nhật: {{ formatRelativeTime(selectedReport.updatedAt || selectedReport.createdAt) }}
                            </p>
                          </div>
                          <div v-else>
                            <p class="text-gray-600 italic">Chưa có phản hồi từ Admin</p>
                            <p class="text-xs text-gray-500 mt-1">
                              Bạn có thể thêm phản hồi bằng cách nhấn nút "Xử lý báo cáo"
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer for handling report -->
    <div
        :class="['drawer-overlay fixed inset-0 z-50', { 'opacity-0 hidden': !drawerOpen }]"
        @click="closeDrawer"
    ></div>
    <div
        :class="['drawer-panel fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50', { 'drawer-open': drawerOpen }]"
    >
      <div class="h-full flex flex-col">
        <div class="px-8 py-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Xử lý báo cáo</h2>
              <p class="text-gray-600 text-sm mt-1">
                #{{ drawerData.id }} • {{ getReasonDisplay(drawerData.reason) }}
              </p>
            </div>
            <button
                @click="closeDrawer"
                class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
            >
              <i class="fas fa-times text-gray-600"></i>
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-8">
          <form @submit.prevent="handleReportSubmission">
            <div class="space-y-8">
              <!-- Status Update -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Cập nhật trạng thái</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                      type="button"
                      :class="[
                      'status-option p-4 border border-gray-200 rounded-xl text-center transition',
                      drawerData.status === 'RESOLVING'
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'hover:border-indigo-300 hover:bg-indigo-50'
                    ]"
                      @click="drawerData.status = 'RESOLVING'"
                  >
                    <div
                        class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3"
                    >
                      <i class="fas fa-clock text-amber-600"></i>
                    </div>
                    <p class="font-medium text-gray-800">Đang xử lý</p>
                    <p class="text-xs text-gray-500 mt-1">Chuyển sang xử lý</p>
                  </button>
                  <button
                      type="button"
                      :class="[
                      'status-option p-4 border border-gray-200 rounded-xl text-center transition',
                      drawerData.status === 'RESOLVED'
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'hover:border-emerald-300 hover:bg-emerald-50'
                    ]"
                      @click="drawerData.status = 'RESOLVED'"
                  >
                    <div
                        class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3"
                    >
                      <i class="fas fa-check-circle text-emerald-600"></i>
                    </div>
                    <p class="font-medium text-gray-800">Đã giải quyết</p>
                    <p class="text-xs text-gray-500 mt-1">Hoàn thành xử lý</p>
                  </button>
                </div>
              </div>

              <!-- Admin Note -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-medium text-gray-700">Ghi chú nội bộ</label>
                  <span class="text-xs text-gray-500">Chỉ Admin nhìn thấy</span>
                </div>
                <textarea
                    v-model="drawerData.internalNote"
                    rows="3"
                    class="input-field w-full"
                    placeholder="Ghi chú về cách xử lý, lý do quyết định..."
                ></textarea>
              </div>

              <!-- Response to Reporter -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-sm font-medium text-gray-700">Phản hồi cho người báo cáo</label>
                  <span class="text-xs text-gray-500">Sẽ gửi qua email</span>
                </div>
                <textarea
                    v-model="drawerData.responseMessage"
                    rows="4"
                    class="input-field w-full"
                    placeholder="Nhập phản hồi sẽ gửi cho người báo cáo..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <!-- Buttons -->
        <div class="px-5 py-3 border-t border-gray-200 bg-gray-50">
          <div class="flex space-x-3">
            <button
                @click="handleReportSubmission"
                class="btn-primary flex-1 px-4 py-2 font-medium"
            >
              <i class="fas fa-save mr-2"></i> Lưu thay đổi
            </button>
            <button @click="closeDrawer" class="btn-secondary px-4 py-2 font-medium">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import api from "../../../api/api.js";
import {buildSeoUrl} from "../../../assets/js/global.js";

// State
const reports = ref([])
const selectedReport = ref(null)
const drawerOpen = ref(false)
const loading = ref(false)
const detailLoading = ref(false)

const drawerData = reactive({
  id: null,
  reason: '',
  status: 'RESOLVING',
  internalNote: '',
  responseMessage: ''
})

// Filters
const filters = reactive({
  keyword: '',
  reason: '',
  dateFrom: '',
  dateTo: '',
  status: 'NEW',
  sortBy: 'newest'
})

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'NEW', label: 'Mới' },
  { value: 'RESOLVING', label: 'Đang xử lý' },
  { value: 'RESOLVED', label: 'Đã giải quyết' },
  { value: 'REJECTED', label: 'Đã từ chối' }
]

// Computed
// Trong computed filterDTO
const filterDTO = computed(() => {
  return {
    keyword: filters.keyword || null,
    reason: filters.reason || null,
    fromDate: filters.dateFrom ?
        `${filters.dateFrom}T00:00:00` : null,  // Thêm giờ phút giây
    toDate: filters.dateTo ?
        `${filters.dateTo}T23:59:59` : null,    // Thêm giờ phút giây
    status: filters.status || null,
    sortByDateDesc: filters.sortBy === 'newest' ? true : filters.sortBy === 'oldest' ? false : null
  }
})

// Watch filters for changes
watch(filters, () => {
  fetchReports()
}, { deep: true })

// Methods
const fetchReports = async () => {
  try {
    loading.value = true
    const response = await api.post('/thg/product-report', filterDTO.value)
    reports.value = response.data
  } catch (error) {
    console.error('Error fetching reports:', error)
    showNotification('Không thể tải danh sách báo cáo', 'error')
  } finally {
    loading.value = false
  }
}

const fetchReportDetail = async (reportId) => {
  try {
    detailLoading.value = true
    const response = await api.get(`/thg/product-report/${reportId}`)
    selectedReport.value = response.data
  } catch (error) {
    console.error('Error fetching report detail:', error)
    showNotification('Không thể tải chi tiết báo cáo', 'error')
  } finally {
    detailLoading.value = false
  }
}

const selectReport = async (report) => {
  selectedReport.value = report
  await fetchReportDetail(report.id)
}

const ignoreReport = async (reportId) => {
  try {
    await api.put(`/thg/product-report/ignore/${reportId}`)
    showNotification('Báo cáo đã được bỏ qua thành công', 'success')
    // Refresh the reports list
    await fetchReports()
    // If the ignored report is currently selected, refresh its detail
    if (selectedReport.value?.id === reportId) {
      await fetchReportDetail(reportId)
    }
  } catch (error) {
    console.error('Error ignoring report:', error)
    showNotification('Không thể bỏ qua báo cáo', 'error')
  }
}

const handleReportAction = (reportId, action) => {
  const report = reports.value.find(r => r.id === reportId)
  if (report) {
    selectReport(report)
    openDrawer()
  }
}

const updateReportStatus = (reportId, newStatus) => {
  // This function is no longer used - replaced by API calls
  console.warn('updateReportStatus is deprecated - use API calls instead')
}

const openDrawer = () => {
  if (!selectedReport.value) return

  drawerData.id = selectedReport.value.id
  drawerData.reason = selectedReport.value.reason
  drawerData.status = selectedReport.value.status === 'NEW' ? 'RESOLVING' : selectedReport.value.status
  drawerData.internalNote = selectedReport.value.internalNote || ''
  drawerData.responseMessage = selectedReport.value.responseMessage || ''

  drawerOpen.value = true
}

const closeDrawer = () => {
  drawerOpen.value = false
}

const handleReportSubmission = async () => {
  try {
    const requestData = {
      id: drawerData.id,
      status: drawerData.status,
      internalNote: drawerData.internalNote,
      reporterEmail: selectedReport.value.email,
      reporterName: selectedReport.value.reporterName,
      responseMessage: drawerData.responseMessage
    }

    await api.put('/thg/product-report/save', requestData)

    showNotification('Đã cập nhật báo cáo thành công!', 'success')

    // Refresh data
    await fetchReports()
    if (selectedReport.value?.id === drawerData.id) {
      await fetchReportDetail(drawerData.id)
    }

    closeDrawer()
  } catch (error) {
    console.error('Error saving report:', error)
    showNotification('Không thể lưu thay đổi', 'error')
  }
}

// Trong resetFilters
const resetFilters = () => {
  const today = new Date()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // Format thành YYYY-MM-DD cho input date
  filters.keyword = ''
  filters.reason = ''
  filters.dateFrom = formatDateForInput(sevenDaysAgo)
  filters.dateTo = formatDateForInput(today)
  filters.status = 'NEW'
  filters.sortBy = 'newest'

  showNotification('Đã đặt lại bộ lọc', 'info')
}

// Helper function để format ngày cho input date
const formatDateForInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper functions
const getStatusDisplay = (status) => {
  const statusMap = {
    'NEW': 'Mới',
    'RESOLVING': 'Đang xử lý',
    'RESOLVED': 'Đã giải quyết',
    'REJECTED': 'Đã từ chối'
  }
  return statusMap[status] || status
}

const getReasonDisplay = (reason) => {
  const reasonMap = {
    'spam': 'Spam',
    'incorrect_info': 'Sai thông tin',
    'scam': 'Lừa đảo',
    'inappropriate_content': 'Nội dung không phù hợp'
  }
  return reasonMap[reason] || reason
}

const getStatusColor = (status) => {
  switch (status) {
    case 'NEW': return 'bg-blue-100 text-blue-800'
    case 'RESOLVING': return 'bg-amber-100 text-amber-800'
    case 'RESOLVED': return 'bg-emerald-100 text-emerald-800'
    case 'REJECTED': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getReasonColor = (reason) => {
  switch (reason) {
    case 'spam': return 'bg-rose-50 text-rose-700 border-rose-100'
    case 'incorrect_info': return 'bg-amber-50 text-amber-700 border-amber-100'
    case 'scam': return 'bg-red-50 text-red-700 border-red-100'
    case 'inappropriate_content': return 'bg-purple-50 text-purple-700 border-purple-100'
    default: return 'bg-gray-50 text-gray-700 border-gray-100'
  }
}

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Không có thông tin'

  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffDay > 30) {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } else if (diffDay > 0) {
    return `${diffDay} ngày trước`
  } else if (diffHour > 0) {
    return `${diffHour} giờ trước`
  } else if (diffMin > 0) {
    return `${diffMin} phút trước`
  } else {
    return 'Vừa xong'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Không có'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const showNotification = (message, type = 'info') => {
  // Create notification element
  const notification = document.createElement('div')
  notification.className = `fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg z-50 transform transition-all duration-300 translate-x-full ${
      type === 'success'
          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          : type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
  }`

  notification.innerHTML = `
    <div class="flex items-center">
      <i class="fas ${
      type === 'success'
          ? 'fa-check-circle'
          : type === 'error'
              ? 'fa-exclamation-circle'
              : 'fa-info-circle'
  } mr-3"></i>
      <span>${message}</span>
    </div>
  `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full')
    notification.classList.add('translate-x-0')
  }, 10)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('translate-x-0')
    notification.classList.add('translate-x-full')
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Initialize
// Trong onMounted
onMounted(() => {
  const today = new Date()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  filters.dateFrom = formatDateForInput(sevenDaysAgo)
  filters.dateTo = formatDateForInput(today)

  fetchReports()
})
</script>

<style scoped>
/* Keep all existing CSS styles - they remain unchanged */
.reports-management {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.sidebar-item.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.sidebar-item.active i {
  color: white;
}

.report-row {
  transition: all 0.2s ease;
  border-radius: 12px;
  margin: 6px;
  border: 1px solid #e2e8f0;
}

.report-row:hover {
  background: white;
  cursor: pointer;
  border-color: #c7d2fe;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
  transform: translateY(-1px);
}

.report-row.selected {
  background: white;
  border-left: 4px solid #6366f1;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.12);
  border-radius: 12px 8px 8px 12px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reason-badge {
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 500;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.drawer-overlay {
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  transition: opacity 0.3s ease;
}

.drawer-panel {
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -20px 0 60px rgba(15, 23, 42, 0.15);
}

.drawer-panel.drawer-open {
  transform: translateX(0);
}

.stat-card {
  transition: all 0.3s ease;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: white;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.chart-bar {
  height: 100px;
  border-radius: 8px;
  transition: height 0.5s ease;
}

.filter-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.filter-group {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.input-field {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  transition: all 0.2s ease;
  background: white;
}

.input-field:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.status-filter-btn {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  transition: all 0.2s ease;
}

.status-filter-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.status-filter-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.action-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn.resolve {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
}

.action-btn.resolve:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.action-btn.reject {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.action-btn.reject:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.report-time {
  color: #64748b;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.report-time i {
  font-size: 10px;
}
</style>