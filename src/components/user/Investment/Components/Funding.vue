<template>
  <div class="funding-container">
    <h1 class="page-title">
      {{ config.text.pageTitle }}
    </h1>

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
                {{ config.text.totalCapital }}
              </span>
              <span class="value">{{ formatCurrency(branch.totalCapital) }}</span>
            </div>

            <div class="progress-section">
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
            >
              <i :class="config.icons.contribute" class="icon"></i>
              {{ config.buttons.contribute }}
            </button>
            <button
                class="btn details-btn"
                @click="$emit('viewDetails', index)"
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
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

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
  color: v-bind('config.colors.primary');
  font-weight: 700;
  font-size: 2rem;
  background: v-bind('config.gradient.text');
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
  color: v-bind('config.colors.primary');
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
  transition: width 0.3s ease; /* Transition mượt mà hơn */
}

.progress-fill.animating {
  transition: width 0.05s ease; /* Reset nhanh nhưng vẫn mượt */
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

.contribute-btn:hover {
  background: v-bind('config.colors.primary');
  color: white !important;
  transform: translateY(-2px);
}

.details-btn:hover {
  background: v-bind('config.gradient.buttonSecondaryHover');
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