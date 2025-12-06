<template>
  <div class="funding-container">
    <h1 class="page-title">Danh sách chi nhánh cần góp vốn</h1>

    <div class="branches-list">
      <div
          v-for="(branch, index) in branches"
          :key="index"
          class="branch-item"
          @mouseenter="hoverItem(index)"
          @mouseleave="resetItem(index)"
      >
        <div class="branch-image-container">
          <img
              :src="branch.image"
              :alt="branch.title"
              class="branch-image"
              :class="{ 'zoomed': branch.isHovered }"
          />
        </div>

        <div class="branch-content">
          <h3 class="branch-title">{{ branch.title }}</h3>

          <div class="branch-info">
            <div class="capital-info">
              <span class="label">
                Tổng vốn cần:
              </span>
              <span class="value">{{ formatCurrency(branch.totalCapital) }}</span>
            </div>

            <div class="progress-section">
              <div class="progress-info">
                <span class="label">
                  <i class="fas fa-chart-line icon"></i>
                  Tiến độ:
                </span>
                <span class="value">{{ branch.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div
                    class="progress-fill"
                    :style="{ width: branch.currentProgress + '%' }"
                    :class="{ 'animating': branch.isAnimating }"
                ></div>
              </div>
            </div>

            <div class="additional-info">
              <div class="time-left">
                <i class="fas fa-clock icon"></i>
                <span>{{ branch.timeLeft }}</span>
              </div>
              <div class="contributors">
                <i class="fas fa-users icon"></i>
                <span>{{ branch.contributors }} người đã góp</span>
              </div>
            </div>
          </div>

          <div
              class="action-buttons"
              :class="{ 'visible': branch.isHovered }"
          >
            <button class="btn contribute-btn" @click="$emit('openModal', branch)">
              <i class="fas fa-hand-holding-usd icon"></i>
              Góp vốn
            </button>
            <button class="btn details-btn" @click="$emit('viewDetails', index)">
              <i class="fas fa-info-circle icon"></i>
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

// Định nghĩa emits
const emit = defineEmits(['openModal', 'viewDetails'])

// Tạo danh sách chi nhánh mẫu
const branches = ref([
  {
    title: "Góp vốn để mở chi nhánh Quận 1",
    image: "/imgs/ivm1.jpg",
    totalCapital: 500000000,
    progress: 65,
    currentProgress: 65,
    timeLeft: "15 ngày",
    contributors: 124,
    isHovered: false,
    isAnimating: false
  },
  {
    title: "Góp vốn để mở chi nhánh Quận 2",
    image: "/imgs/ivm2.jpg",
    totalCapital: 450000000,
    progress: 42,
    currentProgress: 42,
    timeLeft: "22 ngày",
    contributors: 89,
    isHovered: false,
    isAnimating: false
  },
  {
    title: "Góp vốn để mở chi nhánh Quận 3",
    image: "/imgs/ivm3.jpg",
    totalCapital: 600000000,
    progress: 78,
    currentProgress: 78,
    timeLeft: "8 ngày",
    contributors: 156,
    isHovered: false,
    isAnimating: false
  },
  {
    title: "Góp vốn để mở chi nhánh Quận 4",
    image: "/imgs/ivm4.jpg",
    totalCapital: 350000000,
    progress: 25,
    currentProgress: 25,
    timeLeft: "30 ngày",
    contributors: 67,
    isHovered: false,
    isAnimating: false
  },
  {
    title: "Góp vốn để mở chi nhánh Quận 5",
    image: "/imgs/ivm5.jpg",
    totalCapital: 550000000,
    progress: 58,
    currentProgress: 58,
    timeLeft: "18 ngày",
    contributors: 112,
    isHovered: false,
    isAnimating: false
  },
  {
    title: "Góp vốn để mở chi nhánh Bình Dương",
    image: "/imgs/ivm6.jpg",
    totalCapital: 550000000,
    progress: 20,
    currentProgress: 20,
    timeLeft: "18 ngày",
    contributors: 12,
    isHovered: false,
    isAnimating: false
  }
])

// Thêm biến để theo dõi animation
const animationFrameIds = ref({})

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
    const duration = 800 // 0.8 giây

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
  }, 50)
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

// Dọn dẹp animation frames khi component unmount
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
  color: #1e3a8a;
  font-weight: 700;
  font-size: 2rem;
  background: linear-gradient(135deg, #031358, #283593);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.branches-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
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

.branch-content {
  padding: 20px;
}

.branch-title {
  color: #031358;
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
}

.branch-info {
  margin-bottom: 15px;
}

.capital-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.label {
  color: #64748b;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.value {
  color: #031358;
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
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #283593, #031358);
  border-radius: 4px;
  transition: width 0.3s ease; /* Transition mượt mà hơn */
}

.progress-fill.animating {
  transition: width 0.05s ease; /* Reset nhanh nhưng vẫn mượt */
}

.additional-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #64748b;
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
  color: #031358;
  border: 2px solid #031358;
}

.contribute-btn:hover {
  background: #031358;
  color: white;
  transform: translateY(-2px);
}

.details-btn {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #475569;
}

.details-btn:hover {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  transform: translateY(-2px);
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
}
</style>