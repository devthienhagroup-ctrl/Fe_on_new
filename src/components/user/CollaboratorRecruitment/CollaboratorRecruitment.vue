<template>
  <div class="collaborator-recruitment">
    <!-- Header Banner -->
    <div class="banner-header">
      <div class="banner-content">
        <div class="left-column">
          <h1 class="main-title">Cơ hội cộng tác cùng Thiên Hà Group</h1>
          <h2 class="sub-title">Định hướng nghề môi giới chuyên nghiệp</h2>
          <p class="description">
            Tham gia vào hệ thống của Thiên Hà Group với vai trò cộng tác viên bất động sản để tiếp cận kho dự án lớn,
            quy trình làm việc bài bản và đội ngũ hỗ trợ tận tâm. Đây là bước khởi đầu lý tưởng cho những ai muốn nghiêm
            túc phát triển sự nghiệp môi giới nhưng cần một vị trí linh hoạt, không ràng buộc thời gian.
          </p>
        </div>
        <div class="right-column">
          <div class="glass-effect">
            <img :src="logoTHG" alt="Thiên Hà Group Logo" class="logo">
          </div>
        </div>
      </div>
    </div>

    <!-- Main Container -->
    <div class="main-container">
      <!-- Available Jobs Section -->
      <section class="jobs-section">
        <div class="section-header">
          <h2 class="section-title">Các công việc đang tuyển</h2>

          <div class="view-toggle-container">
            <button
                class="view-toggle-btn"
                :class="{ active: !tableView }"
                @click="tableView = false"
                title="Xem dạng lưới"
            >
              <i class="fa-solid fa-grip"></i>
            </button>
            <button
                class="view-toggle-btn"
                :class="{ active: tableView }"
                @click="tableView = true"
                title="Xem dạng bảng"
            >
              <i class="fa-solid fa-table"></i>
            </button>
          </div>

        </div>
        <div class="filter-container">
          <div class="filter-item">
            <div class="search-box" :class="{ 'has-content': searchQuery }">
              <div class="search-icon">
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
              <input
                  type="text"
                  placeholder="Tìm kiếm công việc..."
                  v-model="searchQuery"
                  class="search-input"
              >
              <button
                  class="search-clear"
                  v-if="searchQuery"
                  @click="clearSearch"
              >
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Bộ lọc khu vực -->
          <div class="filter-item" :class="{ active: locationFilter !== '' }">
            <div class="filter-icon" @click="resetLocationFilter">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <select
                id="location-filter"
                v-model="locationFilter"
                class="filter-select"
                @change="handleFilterChange"
            >
              <option value="">Tất cả Tỉnh/Khu vực</option>
              <option
                  v-for="province in provinceOptions"
                  :key="province"
                  :value="province"
              >
                {{ province }}
              </option>
            </select>
          </div>

          <!-- Bộ lọc Xã/Phường -->
          <div class="filter-item" :class="{ active: wardFilter !== '' }">
            <div class="filter-icon" @click="resetWardFilter">
              <i class="fa-solid fa-map-pin"></i>
            </div>
            <select
                id="ward-filter"
                v-model="wardFilter"
                class="filter-select"
                @change="handleFilterChange"
            >
              <option value="">Tất cả Xã/Phường</option>
              <option
                  v-for="ward in wardOptions"
                  :key="ward"
                  :value="ward"
              >
                {{ ward }}
              </option>
            </select>
          </div>

          <!-- Bộ lọc mức lương -->
          <div class="filter-item" :class="{ active: salaryRange.min > 0 || salaryRange.max < 50000000 }">
            <div class="filter-icon" @click="openSalaryModal">
              <i class="fa-solid fa-money-bill-wave"></i>
            </div>
            <div class="salary-display" @click="openSalaryModal">
              {{ formatSalaryDisplay() }}
            </div>
          </div>
        </div>


        <!-- Modal mức lương -->
        <div class="salary-modal" v-if="showSalaryModal">
          <div class="modal-overlay" @click="closeSalaryModal"></div>
          <div class="modal-content">
            <div class="modal-header">
              <h3>Chọn mức lương</h3>
              <button class="close-btn" @click="closeSalaryModal">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="salary-range">
              <div class="range-labels">
                <span>{{ formatSalary(salaryRange.min) }}</span>
                <span>{{ formatSalary(salaryRange.max) }}</span>
              </div>
              <div class="range-slider">
                <input
                    type="range"
                    min="0"
                    max="50000000"
                    step="1000000"
                    v-model="salaryRange.min"
                    class="slider min-slider"
                >
                <input
                    type="range"
                    min="0"
                    max="50000000"
                    step="1000000"
                    v-model="salaryRange.max"
                    class="slider max-slider"
                >
              </div>
              <div class="selected-range">
                Mức lương: {{ formatSalary(salaryRange.min) }} - {{ formatSalary(salaryRange.max) }}
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-apply" @click="applySalaryFilter">Áp dụng</button>
              <button class="btn-reset" @click="resetSalaryFilter">Đặt lại</button>
            </div>
          </div>
        </div>

        <!-- Dạng lưới -->
        <div v-if="!tableView" class="jobs-grid">
          <div
              v-for="job in paginatedJobs"
              :key="job.id"
              class="job-item"
              @mouseenter="hoveredJob = job.id"
              @mouseleave="hoveredJob = null"
          >
            <div class="job-content">
              <div class="job-image">
                <img :src="resolveImage(job.image)" :alt="job.title">
              </div>
              <div class="job-details">
                <h3 class="job-title">{{ job.title }}</h3>
                <div class="job-info-row">
                  <div class="job-detail salary">
                    <span class="icon money"><i class="fa-solid fa-money-bill-wave"></i> </span>
                    <span class="salary-text">
                      <span>{{ job.salary ? formatSalary(job.salary) : 'Chưa cập nhật' }}</span>
                    </span>
                  </div>
                </div>
                <div class="job-info-row">
                  <div class="job-detail">
                    <span class="icon location"><i class="fa-solid fa-location-dot"></i></span>
                    <span>{{ getJobAddress(job) }}</span>
                  </div>
                </div>
                <div class="job-info-row">
                  <div class="job-detail">
                    <span class="icon calendar"><i class="fa-solid fa-calendar"></i></span>
                    <span>{{ formatDate(job.endDate || job.deadline) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="job-actions">
              <button
                  class="btn-register"
                  :class="{ 'half-width': hoveredJob === job.id }"
                  @click="openApplyModal(job)"
              >
                <i class="fa-solid fa-paper-plane"></i> Đăng ký ngay
              </button>
              <button
                  @click="openDetailModal(job.id)"
                  class="btn-detail-2 outline"
                  v-if="hoveredJob === job.id"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        <!-- Dạng bảng -->
        <div v-else class="jobs-table-container">
          <table class="jobs-table">
            <thead>
            <tr>
              <th class="table-header">Công việc</th>
              <th class="table-header">Mức lương</th>
              <th class="table-header">Địa điểm</th>
              <th class="table-header">Hạn ứng tuyển</th>
              <th class="table-header">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="job in paginatedJobs"
                :key="job.id"
                class="table-row"
            >
              <td class="table-cell job-title-cell">
                <div class="job-title-wrapper">
                  <div class="job-image-table">
                    <img :src="resolveImage(job.image)" :alt="job.title">
                  </div>
                  <div class="job-info-table">
                    <h3 class="job-title-table">{{ job.title }}</h3>
                    <p class="job-creator">{{ getJobAddress(job) }}</p>
                  </div>
                </div>
              </td>
              <td class="table-cell salary-cell">
                <div class="salary-wrapper">
                  <span>{{ job.salary ? formatSalary(job.salary) : 'Chưa cập nhật' }}</span>
                </div>
              </td>
              <td class="table-cell location-cell">
                <div class="location-wrapper">
                  <i class="fa-solid fa-location-dot location-icon"></i>
                  <span>{{ getJobAddress(job) }}</span>
                </div>
              </td>
              <td class="table-cell date-cell">
                <div class="date-wrapper">
                  <i class="fa-solid fa-calendar date-icon"></i>
                  <span>{{ formatDate(job.endDate || job.deadline) }}</span>
                </div>
              </td>
              <td class="table-cell action-cell">
                <div class="action-wrapper">
                  <button
                      class="btn-register-table"
                      @click="openApplyModal(job)"
                  >
                    <i class="fa-solid fa-paper-plane"></i> Đăng ký
                  </button>
                  <button
                      class="btn-detail-table"
                      @click="openDetailModal(job.id)"
                  >
                    <i class="fa-solid fa-circle-info"></i> Chi tiết
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            <i class="fa-solid fa-chevron-left"></i>
          </button>

          <button
              v-for="page in totalPages"
              :key="page"
              class="page-btn"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
          >
            {{ page }}
          </button>

          <button class="page-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </section>
    </div>

    <div v-if="showDetailModal" class="job-modal">
      <div class="modal-overlay" @click="closeDetailModal"></div>
      <div class="modal-card">
        <button class="modal-close" @click="closeDetailModal">
          <i class="fa-solid fa-times"></i>
        </button>
        <div class="modal-body">
          <div class="modal-header">
            <div class="modal-image">
              <img :src="resolveImage(selectedJob?.image)" :alt="selectedJob?.title">
            </div>
            <div class="modal-title">
              <h3>{{ selectedJob?.title }}</h3>
              <p class="modal-subtitle">{{ getJobAddress(selectedJob) }}</p>
            </div>
          </div>

          <div class="modal-info-grid">
            <div class="modal-info-item">
              <span class="info-label">Địa chỉ</span>
              <span class="info-value">{{ getJobAddress(selectedJob) }}</span>
            </div>
            <div class="modal-info-item">
              <span class="info-label">Mức lương</span>
              <span class="info-value">
                {{ selectedJob?.mucLuong ? formatSalary(selectedJob.mucLuong) : 'Chưa cập nhật' }}
              </span>
            </div>
            <div class="modal-info-item">
              <span class="info-label">Hạn ứng tuyển</span>
              <span class="info-value">{{ formatDate(selectedJob?.endDate || selectedJob?.deadline) }}</span>
            </div>
          </div>

          <div class="modal-description" v-if="selectedJob?.description || selectedJob?.jobDescription">
            <h4>Mô tả công việc</h4>
            <div v-html="selectedJob?.description || selectedJob?.jobDescription"></div>
          </div>

          <div class="modal-actions">
            <button class="btn-register" @click="openApplyModal(selectedJob)">
              <i class="fa-solid fa-paper-plane"></i> Ứng tuyển ngay
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showApplyModal" class="job-modal">
      <div class="modal-overlay" @click="closeApplyModal"></div>
      <div class="modal-card modal-apply">
        <button class="modal-close" @click="closeApplyModal">
          <i class="fa-solid fa-times"></i>
        </button>
        <div class="modal-body">
          <h3 class="modal-title">Ứng tuyển công việc</h3>
          <p class="modal-subtitle">{{ applyJob?.title }}</p>

          <div class="file-upload">
            <label class="file-label" for="cv-upload">
              <i class="fa-solid fa-upload"></i>
              <span>Upload CV (tối đa 1 file)</span>
            </label>
            <input
                id="cv-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                @change="handleFileChange"
            >
            <p v-if="selectedFile" class="file-name">Đã chọn: {{ selectedFile.name }}</p>
          </div>

          <div class="modal-actions">
            <button class="btn-register" :disabled="!selectedFile || isSubmitting" @click="submitApplication">
              <i class="fa-solid fa-paper-plane"></i> Gửi ứng tuyển
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import Swal from "sweetalert2";
import api from "../../../api/api.js";
import addressData from "../../../assets/js/address.json";

// Mock data for images (replace with actual imports in your project)
const logoTHG = '/imgs/logoTHG.png'
const ASSET_BASE_URL = 'https://s3.cloudfly.vn/thg-storage/uploads-public/'

// Thêm vào script setup
const searchQuery = ref('')
const tableView = ref(false) // false = lưới, true = bảng

const clearSearch = () => {
  searchQuery.value = ''
  handleFilterChange()
}

const availableJobs = ref([])
const isLoading = ref(false)
const totalPages = ref(1)

// Reactive variables
const hoveredJob = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(6)
const addressList = ref(addressData)

// Computed properties
const paginatedJobs = computed(() => {
  return availableJobs.value
})

// Methods
const formatSalary = (salary) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(salary)
}

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật'
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

const resolveImage = (image) => {
  if (!image) return logoTHG
  if (image.startsWith('http') || image.startsWith('/')) return image
  return `${ASSET_BASE_URL}${image}`
}

const formatAddressParts = (value) => {
  if (!value) return ''
  if (typeof value !== 'string') return value
  return value
      .split('/!!')
      .map((part) => part.trim())
      .filter(Boolean)
      .join(', ')
}

const getJobAddress = (job) => {
  if (!job) return 'Chưa cập nhật'
  if (job.address) return formatAddressParts(job.address)
  if (job.location) return formatAddressParts(job.location)
  if (job.ward || job.province) {
    return [formatAddressParts(job.ward), formatAddressParts(job.province)]
        .filter(Boolean)
        .join(', ')
  }
  return 'Chưa cập nhật'
}

// Filter variables
const locationFilter = ref('')
const wardFilter = ref('')
const showSalaryModal = ref(false)
const salaryRange = ref({
  min: 0,
  max: 50000000
})

const resetLocationFilter = () => {
  locationFilter.value = ''
  handleFilterChange()
}

const resetWardFilter = () => {
  wardFilter.value = ''
  handleFilterChange()
}

const openSalaryModal = () => {
  showSalaryModal.value = true
}

const closeSalaryModal = () => {
  showSalaryModal.value = false
}

const applySalaryFilter = () => {
  closeSalaryModal()
  handleFilterChange()
}

const resetSalaryFilter = () => {
  salaryRange.value = { min: 0, max: 50000000 }
  handleFilterChange()
}

const formatSalaryDisplay = () => {
  if (salaryRange.value.min === 0 && salaryRange.value.max === 50000000) {
    return 'Tất cả mức lương'
  }
  return `${formatSalary(salaryRange.value.min)} - ${formatSalary(salaryRange.value.max)}`
}

const showDetailModal = ref(false)
const selectedJob = ref(null)
const showApplyModal = ref(false)
const applyJob = ref(null)
const selectedFile = ref(null)
const isSubmitting = ref(false)

const provinceOptions = computed(() => {
  return addressList.value.map((province) => province.name)
})

const wardOptions = computed(() => {
  if (locationFilter.value) {
    const province = addressList.value.find((item) => item.name === locationFilter.value)
    return province?.wards?.map((ward) => ward.name) || []
  }
  const allWards = addressList.value.flatMap((province) => province.wards || [])
  return [...new Set(allWards.map((ward) => ward.name))]
})

const fetchWorkItems = async () => {
  isLoading.value = true
  try {
    const params = {
      page: currentPage.value - 1,
      size: itemsPerPage.value,
      title: searchQuery.value || null,
      province: locationFilter.value || null,
      ward: wardFilter.value || null,
      minSalary: salaryRange.value.min > 0 ? salaryRange.value.min : null,
      maxSalary: salaryRange.value.max < 50000000 ? salaryRange.value.max : null
    }

    const res = await api.get('/thg/work-items', { params })
    const { content, totalPages: total } = res.data || {}
    availableJobs.value = Array.isArray(content)
        ? content
        : []
    totalPages.value = total || 1
  } catch (error) {
    console.error('Error fetching work items:', error)
    availableJobs.value = []
    totalPages.value = 1
  } finally {
    isLoading.value = false
  }
}

const openDetailModal = async (id) => {
  try {
    const res = await api.get(`/admin.thg/project/work/view_detail/${id}`, {
      withCredentials: true,
    })
    selectedJob.value = res.data
    showDetailModal.value = true
  } catch (error) {
    console.error('Error fetching work item detail:', error)
    Swal.fire('Lỗi', 'Không thể tải chi tiết công việc. Vui lòng thử lại sau.', 'error')
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedJob.value = null
}

const openApplyModal = (job) => {
  applyJob.value = job
  selectedFile.value = null
  showApplyModal.value = true
  showDetailModal.value = false
}

const closeApplyModal = () => {
  showApplyModal.value = false
  applyJob.value = null
  selectedFile.value = null
  isSubmitting.value = false
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  selectedFile.value = file || null
}

const submitApplication = async () => {
  if (!applyJob.value?.id || !selectedFile.value || isSubmitting.value) return
  isSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('cv', selectedFile.value)

    await api.post(`/thg/work-items/${applyJob.value.id}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    Swal.fire('Thành công', 'Ứng tuyển thành công!', 'success')
    closeApplyModal()
  } catch (error) {
    console.error('Error submitting application:', error)
    Swal.fire('Lỗi', 'Không thể gửi ứng tuyển. Vui lòng thử lại sau.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleFilterChange = () => {
  currentPage.value = 1
  fetchWorkItems()
}

const goToPage = (page) => {
  currentPage.value = page
  fetchWorkItems()
}

let searchTimeout
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleFilterChange()
  }, 400)
})

watch(locationFilter, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    wardFilter.value = ''
  }
})

onMounted(() => {
  fetchWorkItems()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

.collaborator-recruitment {
  margin-top: 60px;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Ubuntu', sans-serif;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Banner Header */
.banner-header {
  background-image: url('/imgs/ctv.png');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 80px 20px;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.left-column {
  flex: 1;
  padding-right: 40px;
}

.main-title {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: left;
  line-height: 1.2;
}

.sub-title {
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 30px;
  text-align: left;
}

.description {
  font-size: 20px;
  line-height: 1.6;
  text-align: justify;
  padding-left: 50px;
  position: relative;
}

.description::before {
  content: "🔗";
  position: absolute;
  left: 0;
  top: 0;
}

.right-column {
  flex: 0 0 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glass-effect {
  width: 250px;
  height: 250px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.logo {
  width: 80%;
  filter: brightness(0) invert(1);
}

/* Main Container */
.main-container {
  padding: 60px 20px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: left;
  color: #031358;
}

/* View Toggle */
.view-toggle-container {
  display: flex;
  gap: 5px;
  margin-left: 20px;
}

.view-toggle-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #e8e8e8;
  background: #fff;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-toggle-btn:hover {
  border-color: #0030FF;
  color: #0030FF;
}

.view-toggle-btn.active {
  background: linear-gradient(135deg, #031358, #0030FF);
  border-color: #0030FF;
  color: white;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-container {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.filter-item {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 200px;
}

.filter-item.active {
  background: linear-gradient(135deg, #031358, #0030FF);
  border-color: #0030FF;
}

.filter-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-right: 2px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-item.active .filter-icon {
  background: transparent;
  border-right-color: rgba(255, 255, 255, 0.3);
}

.filter-icon i {
  font-size: 16px;
  color: #6b7280;
  transition: all 0.3s ease;
}

.filter-item.active .filter-icon i {
  color: #fff;
}

.filter-select {
  border: none;
  padding: 10px 12px;
  font-size: 13px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  min-width: 180px;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
}

.filter-select option {
  color: #374151;
  background: #fff;
}

.filter-item.active .filter-select {
  background: transparent;
  color: #fff;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
}

.filter-item.active .filter-select option {
  color: #374151;
  background: #fff;
}

.salary-display {
  padding: 10px 12px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  min-width: 140px;
  white-space: nowrap;
}

.filter-item.active .salary-display {
  color: #fff;
}

/* Modal mức lương */
.salary-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-header h3 {
  margin: 0;
  color: #031358;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.salary-range {
  margin-bottom: 24px;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
}

.range-slider {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
}

.slider {
  position: absolute;
  width: 100%;
  height: 4px;
  background: #e8e8e8;
  border-radius: 2px;
  outline: none;
  pointer-events: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #031358, #0030FF);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 2px 8px rgba(3, 19, 88, 0.3);
  border: 2px solid #fff;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #031358, #0030FF);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 2px 8px rgba(3, 19, 88, 0.3);
  border: 2px solid #fff;
}

.selected-range {
  text-align: center;
  margin-top: 20px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-weight: 600;
  color: #031358;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-apply, .btn-reset {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-apply {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: #fff;
}

.btn-apply:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.3);
}

.btn-reset {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-reset:hover {
  background: #e5e7eb;
}

/* CSS cho thanh tìm kiếm */
.search-container {
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 200px;
}

.search-box.has-content {
  border-color: #0030FF !important;
  box-shadow: 0 0 0 3px rgba(0, 48, 255, 0.1);
}

.search-box.has-content .search-icon {
  background: linear-gradient(135deg, #031358, #0030FF);
  border-right-color: rgba(255, 255, 255, 0.3);
}

.search-box.has-content .search-icon i {
  color: #fff;
}

.search-box:focus-within {
  border-color: #0030FF !important;
  box-shadow: 0 0 0 3px rgba(0, 48, 255, 0.1);
}

.search-box:focus-within .search-icon {
  background: linear-gradient(135deg, #031358, #0030FF);
  border-right-color: rgba(255, 255, 255, 0.3);
}

.search-box:focus-within .search-icon i {
  color: #fff;
}

.search-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-right: 2px solid #e8e8e8;
  transition: all 0.3s ease;
}

.search-icon i {
  font-size: 16px;
  color: #6b7280;
  transition: all 0.3s ease;
}

.search-input {
  flex: 1;
  border: none;
  padding: 10px 12px;
  font-size: 13px;
  background: #fff;
  color: #374151;
  outline: none;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-clear {
  background: none;
  border: none;
  padding: 8px;
  margin-right: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #6b7280;
}

.search-clear:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Dạng lưới */
.jobs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 50px;
}

.job-item {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.job-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.job-content {
  display: flex;
  padding: 20px;
  gap: 15px;
  flex-grow: 1;
}

.job-image {
  flex: 0 0 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
}

.job-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.job-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.job-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #031358;
  line-height: 1.3;
}

.job-info-row {
  display: flex;
  align-items: center;
}

.job-detail {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.job-detail.salary {
  font-weight: 600;
  color: #e74c3c;
}

.icon {
  margin-right: 8px;
  font-size: 14px;
  min-width: 16px;
}

.salary-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-salary {
  cursor: pointer;
  font-size: 12px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.toggle-salary:hover {
  opacity: 1;
}

/* Buttons */
.info-btn {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border: none;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.info-btn:hover {
  background: linear-gradient(135deg, #0030FF, #031358);
}

.job-actions {
  display: flex;
  padding: 0 20px 20px;
  gap: 10px;
}

.btn-register {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border: none;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  border-radius: 8px;
}

.btn-register.half-width {
  width: 50%;
}

.btn-detail {
  background: transparent;
  color: #0030FF;
  border: 2px solid #0030FF;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  width: 90%;
  margin: 5px auto;
}

.btn-detail:hover {
  background: #0030FF;
  color: white;
}

.btn-detail-2 {
  background: transparent;
  color: #0030FF;
  border: 2px solid #0030FF;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  width: 50%;
}

.btn-detail-2:hover {
  background: #0030FF;
  color: white;
}

/* Dạng bảng */
.jobs-table-container {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  overflow-x: auto;
}

.jobs-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  color: white;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 16px;
  border-bottom: 2px solid #e8e8e8;
  position: relative;
}

thead {
  background: linear-gradient(135deg, #031358, #0030FF);
}

.table-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.table-row {
  border-bottom: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-cell {
  padding: 16px 20px;
  vertical-align: middle;
}

.job-title-cell {
  min-width: 250px;
}

.job-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.job-image-table {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.job-image-table img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.job-info-table {
  flex: 1;
}

.job-title-table {
  font-size: 16px;
  font-weight: 600;
  color: #031358;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.job-creator {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.salary-cell {
  min-width: 150px;
}

.salary-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #e74c3c;
}

.location-cell, .date-cell {
  min-width: 150px;
}

.location-wrapper, .date-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.location-icon, .date-icon {
  color: #6b7280;
  width: 16px;
  text-align: center;
}

.action-cell {
  min-width: 180px;
}

.action-wrapper {
  display: flex;
  gap: 8px;
}

.btn-register-table {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  white-space: nowrap;
}

.btn-register-table:hover {
  background: linear-gradient(135deg, #0030FF, #031358);
  transform: translateY(-1px);
}

.btn-detail-table {
  background: transparent;
  color: #0030FF;
  border: 1px solid #0030FF;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  white-space: nowrap;
}

.btn-detail-table:hover {
  background: #0030FF;
  color: white;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.page-btn.active,
.page-btn:hover {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border-color: #0030FF;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .section-header {
    flex-direction: column;
    gap: 16px;
  }

  .view-toggle-container {
    order: 1;
    margin-left: 0;
    margin-bottom: 10px;
  }

  .filter-container {
    order: 2;
    justify-content: center;
    width: 100%;
  }

  .jobs-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .banner-content {
    flex-direction: column;
    text-align: center;
  }

  .left-column {
    padding-right: 0;
    margin-bottom: 40px;
  }

  .description {
    text-align: center;
    padding-left: 0;
  }

  .description::before {
    display: none;
  }
}

@media (max-width: 768px) {
  .jobs-grid {
    grid-template-columns: 1fr;
  }

  .main-title {
    font-size: 32px;
  }

  .sub-title {
    font-size: 24px;
  }

  .description {
    font-size: 18px;
  }

  .glass-effect {
    width: 200px;
    height: 200px;
  }

  .job-content {
    flex-direction: column;
    text-align: center;
  }

  .job-image {
    align-self: center;
  }

  .job-info-row {
    justify-content: center;
  }

  .search-box {
    width: 100%;
  }

  .search-input {
    min-width: 0;
  }

  .filter-container {
    flex-direction: column;
    width: 100%;
  }

  .filter-item {
    width: 100%;
  }

  .filter-select, .salary-display {
    flex: 1;
  }

  .jobs-table {
    min-width: 700px;
  }

  .jobs-table-container {
    border-radius: 8px;
    margin-left: -10px;
    margin-right: -10px;
    border-radius: 0;
  }

  .table-header {
    padding: 10px 12px;
    font-size: 13px;
  }

  .table-cell {
    padding: 10px 12px;
  }

  .job-title-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .job-image-table {
    width: 40px;
    height: 40px;
  }

  .job-title-table {
    font-size: 13px;
  }

  .job-creator {
    font-size: 12px;
  }

  .salary-wrapper, .location-wrapper, .date-wrapper {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    margin: 20px;
    width: calc(100% - 40px);
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-apply, .btn-reset {
    width: 100%;
  }

  .job-actions {
    flex-direction: column;
  }

  .btn-register.half-width,
  .btn-detail {
    width: 100%;
  }

  .action-wrapper {
    flex-direction: column;
  }

  .btn-register-table, .btn-detail-table {
    width: 100%;
    font-size: 11px;
    padding: 6px 10px;
  }
}

.job-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.job-modal .modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.job-modal .modal-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: min(900px, 92vw);
  max-height: 90vh;
  overflow-y: auto;
  z-index: 2;
}

.job-modal .modal-card.modal-apply {
  width: min(560px, 92vw);
}

.job-modal .modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
}

.job-modal .modal-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.job-modal .modal-image img {
  width: 120px;
  height: 90px;
  border-radius: 10px;
  object-fit: cover;
}

.job-modal .modal-title h3 {
  margin: 0 0 6px;
  font-size: 22px;
  color: #031358;
}

.job-modal .modal-subtitle {
  margin: 0;
  color: #6c757d;
}

.modal-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.modal-info-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 12px 16px;
}

.modal-info-item .info-label {
  display: block;
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 6px;
}

.modal-info-item .info-value {
  font-weight: 600;
  color: #031358;
}

.modal-description h4 {
  margin-bottom: 12px;
  color: #031358;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-apply .file-upload {
  margin-top: 20px;
  border: 1px dashed #cfd4da;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.modal-apply .file-label {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #031358;
  font-weight: 600;
}

.modal-apply input[type="file"] {
  display: none;
}

.modal-apply .file-name {
  margin-top: 10px;
  font-size: 13px;
  color: #6c757d;
}

</style>
