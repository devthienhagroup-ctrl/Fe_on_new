<template>
  <div class="funding-container">
    <h1 class="page-title">
      {{ config.text.pageTitle }}
    </h1>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <i class="fas fa-exclamation-triangle error-icon"></i>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchBranches">
        <i class="fas fa-redo"></i>
        Thử lại
      </button>
    </div>

    <!-- Main Content -->
    <template v-else>
      <div class="branches-list">
        <div
            v-for="(branch, index) in branches"
            :key="branch.id"
            class="branch-item"
            @mouseenter="hoverItem(index)"
            @mouseleave="resetItem(index)"
        >
          <div class="branch-image-container">
            <img
                :src="baseImgaeUrl+branch.image"
                :alt="branch.title"
                class="branch-image"
                :class="{ 'zoomed': branch.isHovered }"
                @error="handleImageError"
            />
            <!-- Status Badge -->
            <div class="status-badge" :class="branch.status.toLowerCase()">
              {{ getStatusText(branch.status) }}
            </div>
          </div>

          <div class="branch-content">
            <h3 class="branch-title">{{ branch.title }}</h3>
            <p class="branch-description">{{ branch.description }}</p>

            <div class="branch-info">
              <div class="capital-info">
                <span class="label">
                  {{ config.text.totalCapital }}
                </span>
                <span class="value">{{ formatCurrency(branch.totalCapital) }}</span>
              </div>

              <div class="progress-section" v-if="branch.progress !== null">
                <div class="progress-info">
                  <span class="label">
                    <i :class="config.icons.progress" class="icon"></i>
                    {{ config.text.progress }}
                  </span>
                  <span class="value">{{ branch.progress }}%</span>
                </div>
                <div class="progress-bar">
                  <div
                      class="progress-fill"
                      :style="{
                      width: branch.currentProgress + '%',
                      background: config.gradient.progress
                    }"
                      :class="{ 'animating': branch.isAnimating }"
                  ></div>
                </div>
              </div>

              <div class="additional-info">
                <div class="time-left">
                  <i :class="config.icons.time" class="icon"></i>
                  <span>{{ branch.timeLeft }}</span>
                </div>
                <div class="contributors">
                  <i :class="config.icons.contributors" class="icon"></i>
                  <span>{{ branch.contributors }} {{ config.text.contributorsText }}</span>
                </div>
              </div>
            </div>

            <div
                class="action-buttons"
                :class="{ 'visible': branch.isHovered }"
            >
              <button
                  class="btn contribute-btn"
                  @click="$emit('openModal', branch)"
                  :style="{
                  border: `2px solid ${config.colors.primary}`,
                  color: config.colors.primary
                }"
                  :disabled="branch.status !== 'OPEN'"
              >
                <i :class="config.icons.contribute" class="icon"></i>
                {{ branch.status === 'OPEN' ? config.buttons.contribute : 'Đã đóng' }}
              </button>
              <button
                  class="btn details-btn"
                  @click="$emit('viewDetails', branch.originalData.slug)"
                  :style="{
                  background: config.gradient.buttonSecondary,
                  color: config.colors.buttonSecondaryText
                }"
              >
                <i :class="config.icons.details" class="icon"></i>
                {{ config.buttons.details }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="page.totalPages > 1">
        <button
            class="pagination-btn prev"
            @click="goToPage(page.number - 1)"
            :disabled="page.number === 0"
        >
          <i class="fas fa-chevron-left"></i>
          Trang trước
        </button>

        <div class="page-info">
          <span class="current-page">Trang {{ page.number + 1 }}</span>
          <span class="total-pages">/ {{ page.totalPages }}</span>
        </div>

        <button
            class="pagination-btn next"
            @click="goToPage(page.number + 1)"
            :disabled="page.number >= page.totalPages - 1"
        >
          Trang sau
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- No Data -->
      <div v-if="branches.length === 0" class="no-data">
        <i class="fas fa-inbox"></i>
        <p>Không có dự án nào để hiển thị</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from "../../../../api/api.js";

// Định nghĩa emits
const emit = defineEmits(['openModal', 'viewDetails'])

// CONFIG OBJECT - Có thể quản lý qua CMS
let config = {
  text: {
    pageTitle: "Danh sách chi nhánh cần góp vốn",
    totalCapital: "Tổng vốn cần:",
    progress: "Tiến độ:",
    contributorsText: "người đã góp"
  },
  buttons: {
    contribute: "Góp vốn",
    details: "Xem chi tiết"
  },
  icons: {
    progress: "fas fa-chart-line",
    time: "fas fa-clock",
    contributors: "fas fa-users",
    contribute: "fas fa-hand-holding-usd",
    details: "fas fa-info-circle"
  },
  colors: {
    primary: "#031358",
    secondary: "#64748b",
    border: "#e2e8f0",
    progressBg: "#e2e8f0",
    buttonSecondaryText: "#475569"
  },
  gradient: {
    text: "linear-gradient(135deg, #031358, #283593)",
    progress: "linear-gradient(90deg, #283593, #031358)",
    buttonSecondary: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
    buttonSecondaryHover: "linear-gradient(135deg, #e2e8f0, #cbd5e1)"
  },
  animation: {
    duration: 800,
    resetDelay: 50
  }
}

const props = defineProps({
  sectionData: Object
});

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã lấy data từ cha");
}

// Data states
const branches = ref([])
const loading = ref(true)
const error = ref(null)
const page = ref({
  size: 6,
  number: 0,
  totalElements: 0,
  totalPages: 1
})

// Thêm biến để theo dõi animation
const animationFrameIds = ref({})

// Fetch data từ API
const fetchBranches = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await api.get(`/thg/public/investment/getAll?page=${page.value.number}&size=${page.value.size}`)

    // Update pagination info
    page.value = response.data.page || {
      size: 6,
      number: 0,
      totalElements: 0,
      totalPages: 1
    }

    // Map API data to local structure
    branches.value = (response.data.content || []).map(item => ({
      id: item.id,
      title: item.name,
      description: item.description,
      image: item.thumbnail,
      totalCapital: item.targetAmount,
      progress: item.progressPercent || 0,
      currentProgress: item.progressPercent || 0,
      timeLeft: calculateTimeLeft(item.endDate),
      contributors: item.investorsCount || 0,
      status: item.status,
      isHovered: false,
      isAnimating: false,
      // Keep original data for details
      originalData: item
    }))

  } catch (err) {
    console.error('Error fetching branches:', err)
    error.value = 'Không thể tải dữ liệu. Vui lòng thử lại sau.'
    branches.value = []
  } finally {
    loading.value = false
  }
}

// Calculate time left from end date
const calculateTimeLeft = (endDate) => {
  if (!endDate) return 'Không xác định'

  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end - now

  if (diffTime <= 0) return 'Đã kết thúc'

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays > 30) {
    const months = Math.floor(diffDays / 30)
    return `${months} tháng`
  }

  return `${diffDays} ngày`
}

// Get status text
const getStatusText = (status) => {
  const statusMap = {
    'OPEN': 'Đang mở',
    'CLOSED': 'Đã đóng',
    'DRAFT': 'Nháp',
    'COMPLETED': 'Hoàn thành'
  }
  return statusMap[status] || status
}

// Handle image loading error
const handleImageError = (event) => {
  event.target.src = '/imgs/default-branch.jpg' // Fallback image
}

// Pagination navigation
const goToPage = (pageNumber) => {
  if (pageNumber >= 0 && pageNumber < page.value.totalPages) {
    page.value.number = pageNumber
    fetchBranches()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Hàm xử lý hover vào item
const hoverItem = (index) => {
  const branch = branches.value[index]
  branch.isHovered = true

  // Dừng animation hiện tại nếu có
  if (animationFrameIds.value[index]) {
    cancelAnimationFrame(animationFrameIds.value[index])
  }

  // Reset progress về 0 với transition mượt mà
  branch.isAnimating = true
  branch.currentProgress = 0

  // Sau đó animate tăng dần lên giá trị ban đầu
  setTimeout(() => {
    let startTime = null
    const targetProgress = branch.progress
    const duration = config.animation.duration

    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Sử dụng easing function để animation mượt mà hơn
      const easedProgress = easeOutCubic(progress)
      branch.currentProgress = easedProgress * targetProgress

      if (progress < 1) {
        animationFrameIds.value[index] = requestAnimationFrame(animateProgress)
      } else {
        branch.isAnimating = false
        branch.currentProgress = targetProgress // Đảm bảo đạt chính xác giá trị cuối
        delete animationFrameIds.value[index]
      }
    }

    animationFrameIds.value[index] = requestAnimationFrame(animateProgress)
  }, config.animation.resetDelay)
}

// Hàm easing để animation mượt mà
const easeOutCubic = (x) => {
  return 1 - Math.pow(1 - x, 3)
}

// Hàm xử lý khi rời khỏi item
const resetItem = (index) => {
  const branch = branches.value[index]
  branch.isHovered = false

  // Dừng animation nếu đang chạy
  if (animationFrameIds.value[index]) {
    cancelAnimationFrame(animationFrameIds.value[index])
    delete animationFrameIds.value[index]
  }

  // Reset về trạng thái ban đầu
  branch.isAnimating = false
  branch.currentProgress = branch.progress
}

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Lifecycle hooks
onMounted(() => {
  fetchBranches()
})

// Watch for page number changes
watch(() => page.value.number, () => {
  fetchBranches()
})

// Dọn dẹp animation frames khi component unmount
import { onUnmounted } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";
onUnmounted(() => {
  Object.values(animationFrameIds.value).forEach(id => {
    cancelAnimationFrame(id)
  })
})
</script>

<style scoped>
.funding-container {
  max-width: 1400px;
  margin: 60px auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: v-bind('config.colors.primary');
  font-weight: 700;
  font-size: 2rem;
  background: v-bind('config.gradient.text');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid v-bind('config.colors.border');
  border-top: 3px solid v-bind('config.colors.primary');
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  text-align: center;
  padding: 40px;
  background: #fee;
  border-radius: 10px;
  border: 1px solid #fcc;
}

.error-icon {
  font-size: 3rem;
  color: #e53e3e;
  margin-bottom: 20px;
}

.retry-btn {
  background: v-bind('config.colors.primary');
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.3s;
}

.retry-btn:hover {
  opacity: 0.9;
}

/* Branches List */
.branches-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.branch-item {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.branch-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.branch-image-container {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.branch-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.branch-image.zoomed {
  transform: scale(1.1);
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.open {
  background: #10b981;
  color: white;
}

.status-badge.closed {
  background: #ef4444;
  color: white;
}

.status-badge.draft {
  background: #6b7280;
  color: white;
}

.status-badge.completed {
  background: #3b82f6;
  color: white;
}

.branch-content {
  padding: 20px;
}

.branch-title {
  color: v-bind('config.colors.primary');
  margin-bottom: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
}

.branch-description {
  color: v-bind('config.colors.secondary');
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.branch-info {
  margin-bottom: 15px;
}

.capital-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid v-bind('config.colors.border');
}

.label {
  color: v-bind('config.colors.secondary');
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.value {
  color: v-bind('config.colors.primary');
  font-weight: 600;
}

.progress-section {
  margin-bottom: 15px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-bar {
  height: 8px;
  background-color: v-bind('config.colors.progressBg');
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.animating {
  transition: width 0.05s ease;
}

.additional-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: v-bind('config.colors.secondary');
}

.time-left, .contributors {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  font-size: 0.9rem;
  width: 16px;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  margin-top: 15px;
}

.action-buttons.visible {
  opacity: 1;
  transform: translateY(0);
}

.btn {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.contribute-btn {
  background: transparent;
}

.contribute-btn:hover:not(:disabled) {
  background: v-bind('config.colors.primary');
  color: white !important;
  transform: translateY(-2px);
}

.contribute-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.details-btn:hover {
  background: v-bind('config.gradient.buttonSecondaryHover');
  transform: translateY(-2px);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid v-bind('config.colors.border');
}

.pagination-btn {
  background: v-bind('config.gradient.buttonSecondary');
  border: 1px solid v-bind('config.colors.border');
  color: v-bind('config.colors.secondary');
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: v-bind('config.gradient.buttonSecondaryHover');
  color: v-bind('config.colors.primary');
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 1rem;
  color: v-bind('config.colors.secondary');
}

.current-page {
  color: v-bind('config.colors.primary');
  font-weight: 600;
}

/* No Data */
.no-data {
  text-align: center;
  padding: 60px;
  color: v-bind('config.colors.secondary');
}

.no-data i {
  font-size: 3rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 768px) {
  .branches-list {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1.6rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .pagination {
    flex-direction: column;
    gap: 15px;
  }
}
</style>