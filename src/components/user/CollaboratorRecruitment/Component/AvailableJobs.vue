<template>
  <section class="jobs-section">
    <div class="section-header">
      <h2 class="section-title">Các công việc đang tuyển</h2>

      <div class="filter-container">
        <!-- Search Box -->
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
          >
            <option value="">Tất cả khu vực</option>
            <option value="hcm">TP.HCM</option>
            <option value="hn">Hà Nội</option>
            <option value="dn">Đà Nẵng</option>
            <option value="other">Khu vực khác</option>
          </select>
        </div>

        <!-- Bộ lọc Quận/Huyện -->
        <div class="filter-item" :class="{ active: districtFilter !== '' }">
          <div class="filter-icon" @click="resetDistrictFilter">
            <i class="fa-solid fa-map"></i>
          </div>
          <select
              id="district-filter"
              v-model="districtFilter"
              class="filter-select"
          >
            <option value="">Tất cả Quận/Huyện</option>
            <option value="q1">Quận 1</option>
            <option value="q2">Quận 2</option>
            <option value="q3">Quận 3</option>
            <option value="q7">Quận 7</option>
            <option value="q9">Quận 9</option>
            <option value="bt">Bình Thạnh</option>
            <option value="td">Thủ Đức</option>
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
          >
            <option value="">Tất cả Xã/Phường</option>
            <option value="p1">Phường 1</option>
            <option value="p2">Phường 2</option>
            <option value="p3">Phường 3</option>
            <option value="pt">Phú Thạnh</option>
            <option value="tn">Tân Phong</option>
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

    <div class="jobs-grid">
      <div
          v-for="job in paginatedJobs"
          :key="job.id"
          class="job-item"
          @mouseenter="hoveredJob = job.id"
          @mouseleave="hoveredJob = null"
      >
        <div class="job-content">
          <div class="job-image">
            <img :src="job.image" :alt="job.title">
          </div>
          <div class="job-details">
            <h3 class="job-title">{{ job.title }}</h3>
            <div class="job-info-row">
              <div class="job-detail salary">
                <span class="icon money"><i class="fa-solid fa-money-bill-wave"></i> </span>
                <span class="salary-text">
                  <span v-if="isLoggedIn || job.salaryVisible">{{ formatSalary(job.salary) }}</span>
                  <span v-else>{{ hideSalary(job.salary) }}</span>
                  <span v-if="!isLoggedIn" class="toggle-salary" @click.stop="toggleSalaryVisibility(job.id)"
                        v-html=" !job.salaryVisible ? `<i class='fa-solid fa-eye'></i>️` : `<i class='fa-solid fa-eye-slash'></i>`">
                  </span>
                </span>
              </div>
            </div>
            <div class="job-info-row">
              <div class="job-detail">
                <span class="icon location"><i class="fa-solid fa-location-dot"></i></span>
                <span>{{ job.location }}</span>
              </div>
            </div>
            <div class="job-info-row">
              <div class="job-detail">
                <span class="icon calendar"><i class="fa-solid fa-calendar"></i></span>
                <span>{{ job.date }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="job-actions">
          <button
              class="btn-register"
              :class="{ 'half-width': hoveredJob === job.id }"
          >
            <i class="fa-solid fa-paper-plane"></i> Đăng ký ngay
          </button>
          <button
              @click="router.push('/collaborator-jobs/'+ job.id)"
              class="btn-detail-2 outline"
              v-if="hoveredJob === job.id"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button class="page-btn"><i class="fa-solid fa-chevron-left"></i></button>

      <button
          v-for="page in totalPages"
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="currentPage = page"
      >
        {{ page }}
      </button>

      <button class="page-btn"><i class="fa-solid fa-chevron-right"></i></button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from "vue-router";

const router = useRouter()

// Props
const props = defineProps({
  jobs: {
    type: Array,
    required: true,
    default: () => []
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  }
})

// Reactive variables
const searchQuery = ref('')
const locationFilter = ref('')
const districtFilter = ref('')
const wardFilter = ref('')
const showSalaryModal = ref(false)
const salaryRange = ref({
  min: 0,
  max: 50000000
})
const hoveredJob = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Computed properties
const totalPages = computed(() => Math.ceil(props.jobs.length / itemsPerPage.value))
const paginatedJobs = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  return props.jobs.slice(startIndex, startIndex + itemsPerPage.value)
})

// Methods
const clearSearch = () => {
  searchQuery.value = ''
}

const resetLocationFilter = () => {
  locationFilter.value = ''
}

const resetDistrictFilter = () => {
  districtFilter.value = ''
}

const resetWardFilter = () => {
  wardFilter.value = ''
}

const openSalaryModal = () => {
  showSalaryModal.value = true
}

const closeSalaryModal = () => {
  showSalaryModal.value = false
}

const applySalaryFilter = () => {
  closeSalaryModal()
  // Logic áp dụng bộ lọc lương ở đây
}

const resetSalaryFilter = () => {
  salaryRange.value = { min: 0, max: 50000000 }
}

const formatSalaryDisplay = () => {
  if (salaryRange.value.min === 0 && salaryRange.value.max === 50000000) {
    return 'Tất cả mức lương'
  }
  return `${formatSalary(salaryRange.value.min)} - ${formatSalary(salaryRange.value.max)}`
}

const formatSalary = (salary) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(salary)
}

const hideSalary = (salary) => {
  const salaryStr = salary.toString()
  return salaryStr.charAt(0) + 'x.xxx.xxx ₫'
}

const toggleSalaryVisibility = (jobId) => {
  // Kiểm tra nếu chưa đăng nhập
  if (!props.isLoggedIn) {
    showLoginAlert();
    return;
  }

  const job = props.jobs.find(j => j.id === jobId)
  if (job) {
    job.salaryVisible = !job.salaryVisible
  }
}

const showLoginAlert = () => {
  // Sử dụng SweetAlert2 hoặc thông báo khác
  alert('Bạn cần đăng nhập để xem mức lương chi tiết')
  // Hoặc chuyển hướng đến trang đăng nhập
  // router.push('/dang-nhap');
}
</script>

<style scoped>
/* CSS giữ nguyên từ file gốc */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.section-title {
  margin: 0;
  color: #031358;
  font-size: 28px;
  font-weight: 700;
}

.filter-container {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
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
  min-width: 160px;
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
  min-width: 140px;
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

/* Responsive */
@media (max-width: 1024px) {
  .section-header {
    flex-direction: column;
    gap: 16px;
  }

  .filter-container {
    justify-content: center;
    width: 100%;
  }

  .jobs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
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

  .jobs-grid {
    grid-template-columns: 1fr;
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
  .btn-detail-2 {
    width: 100%;
  }
}
</style>