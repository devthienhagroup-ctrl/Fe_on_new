<template>
  <section class="impressive-numbers-section">
    <div class="background-container">
      <img src="/imgs/building.jpg" alt="Background" class="background-image" />
      <div class="blur-bg"></div>
    </div>

    <div class="container">
      <div class="section-header">
        <h2 class="section-title">NHỮNG CON SỐ ẤN TƯỢNG</h2>
        <p class="section-subtitle">
          Thiên Hà Group tự hào về những thành tựu đã đạt được trong những năm qua.
          Dưới đây là một số thành tựu nổi bật:
        </p>
      </div>

      <!-- Navigation Buttons -->
      <div class="navigation">
        <button class="nav-btn prev-btn" @click="prevSlide" :disabled="isTransitioning">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="nav-btn next-btn" @click="nextSlide" :disabled="isTransitioning">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="cards-container">
        <div
            v-for="(achievement, index) in visibleAchievements"
            :key="achievement.key"
            :class="[
              'stat-card',
              getCardPosition(index),
              { 'transitioning': isTransitioning }
            ]"
        >
          <div class="card-icon">
            <img :src="getIconUrl(achievement.icon)" :alt="achievement.title" />
          </div>
          <div class="card-info">
            <h3 class="card-number">
              {{ achievement.isTop ? `Top ${achievement.number}` : achievement.number }}
            </h3>
            <span class="card-title">{{ achievement.title }}</span>
          </div>
          <p class="card-description">{{ achievement.description }}</p>
        </div>
      </div>

      <!-- Indicators -->
      <div class="indicators">
        <button
            v-for="i in originalAchievements.length"
            :key="i"
            :class="['indicator', { 'active': currentOriginalIndex === i - 1 }]"
            @click="goToSlide(i - 1)"
            :disabled="isTransitioning"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const originalAchievements = [
  {
    id: 1,
    icon: '15nam.svg',
    title: 'năm kinh nghiệm',
    description: 'Với 15 năm kinh nghiệm, Thiên Hà Group đã xây dựng được uy tín vững chắc và trở thành đối tác đáng tin cậy trong lĩnh vực bất động sản.',
    number: 15,
    isTop: false
  },
  {
    id: 2,
    icon: '130can.svg',
    title: 'căn',
    description: '130 căn hộ đã được bán nhanh chóng trong vòng 30 ngày với mức giá tốt nhất thị trường, khẳng định hiệu quả của giải pháp bán gấp.',
    number: 130,
    isTop: false
  },
  {
    id: 3,
    icon: '329bds.svg',
    title: 'bất động sản',
    description: '329 bất động sản đã được cho thuê thành công, mang lại lợi nhuận tối ưu cho chủ đầu tư và đáp ứng nhu cầu đa dạng của người thuê.',
    number: 329,
    isTop: false
  },
  {
    id: 4,
    icon: '1donvi.svg',
    title: 'đơn vị tiên phong',
    description: 'Top 1 đơn vị tiên phong trong việc cung cấp giải pháp bán gấp bất động sản chỉ trong 30 ngày, mang lại hiệu quả vượt trội cho khách hàng.',
    number: 1,
    isTop: true
  }
]

// State
const currentIndex = ref(0)
const isTransitioning = ref(false)
const transitionDirection = ref('next')

// Tính toán achievements hiển thị
const visibleAchievements = computed(() => {
  const total = originalAchievements.length
  const current = currentIndex.value

  const visible = []
  for (let i = -1; i <= 2; i++) {
    const index = (current + i + total) % total
    visible.push({
      ...originalAchievements[index],
      key: `${originalAchievements[index].id}-${current + i}`
    })
  }

  return visible
})

const currentOriginalIndex = computed(() => {
  return currentIndex.value % originalAchievements.length
})

const getIconUrl = (iconName) => `/imgs/${iconName}`

const getCardPosition = (index) => {
  const positions = ['left', 'main', 'right', 'hidden']
  return positions[index] || 'hidden'
}

const nextSlide = async () => {
  if (isTransitioning.value) return

  isTransitioning.value = true
  transitionDirection.value = 'next'

  currentIndex.value = (currentIndex.value + 1) % originalAchievements.length

  setTimeout(() => {
    isTransitioning.value = false
  }, 600)
}

const prevSlide = async () => {
  if (isTransitioning.value) return

  isTransitioning.value = true
  transitionDirection.value = 'prev'

  currentIndex.value = (currentIndex.value - 1 + originalAchievements.length) % originalAchievements.length

  setTimeout(() => {
    isTransitioning.value = false
  }, 600)
}

const goToSlide = (targetIndex) => {
  if (isTransitioning.value || currentOriginalIndex.value === targetIndex) return

  isTransitioning.value = true
  const direction = targetIndex > currentOriginalIndex.value ? 'next' : 'prev'
  transitionDirection.value = direction

  currentIndex.value = targetIndex

  setTimeout(() => {
    isTransitioning.value = false
  }, 600)
}

// Auto-play
let autoPlayInterval

const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    nextSlide()
  }, 4000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.impressive-numbers-section {
  position: relative;
  width: 100%;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-family: 'Ubuntu', sans-serif;
  padding: 60px 20px;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blur-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(10, 36, 99);
  opacity: 0.7;
}

.container {
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  color: white;
  position: relative;
}

.section-header {
  margin-bottom: 50px;
}

.section-title {
  font-size: 33px;
  font-weight: 700;
  margin-bottom: 15px;
}

.section-subtitle {
  font-size: 20px;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Navigation */
.navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 10;
  pointer-events: none;
  padding: 0 20px;
}

.nav-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: all;
  backdrop-filter: blur(10px);
}

.nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Cards Container */
.cards-container {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.stat-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.2),
      0 15px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Sửa transitions để tránh hiệu ứng đảo */
.stat-card.hidden {
  transition: none !important;
  opacity: 0;
  pointer-events: none;
  z-index: 1;
  transform: translateX(0) scale(0.5);
}

/* Khi đang transitioning, chỉ main card và các card visible có transition */
.stat-card.transitioning:not(.hidden) {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Main Card Styles */
.stat-card.main {
  width: 450px;
  height: 350px;
  z-index: 3;
  transform: translateX(0) scale(1);
  opacity: 1;
}

/* Left Card Styles */
.stat-card.left {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  z-index: 2;
  padding: 20px;
  transform: translateX(-300px) scale(0.8);
  opacity: 0.8;
}

/* Right Card Styles */
.stat-card.right {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  z-index: 2;
  padding: 20px;
  transform: translateX(300px) scale(0.8);
  opacity: 0.8;
}

/* Card Content */
.card-icon {
  width: 90px;
  height: 90px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s ease 0.1s;
}

.stat-card.main .card-icon {
  margin-bottom: 20px;
}

.stat-card.left .card-icon,
.stat-card.right .card-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 0;
}

.card-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.card-info {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  transition: all 0.4s ease 0.1s;
}

.stat-card.left .card-info,
.stat-card.right .card-info {
  opacity: 0;
  height: 0;
  margin: 0;
  overflow: hidden;
}

.card-number {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.4s ease 0.1s;
}

.stat-card.left .card-number,
.stat-card.right .card-number {
  font-size: 0;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  transition: all 0.4s ease 0.1s;
}

.stat-card.left .card-title,
.stat-card.right .card-title {
  font-size: 0;
}

.card-description {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  text-align: justify;
  transition: all 0.4s ease 0.1s;
}

.stat-card.left .card-description,
.stat-card.right .card-description {
  opacity: 0;
  height: 0;
  margin: 0;
  overflow: hidden;
}

/* Indicators */
.indicators {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 40px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.indicator:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.6);
  transform: scale(1.1);
}

.indicator:disabled {
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .stat-card.main {
    width: 350px;
    height: 300px;
    padding: 20px;
  }

  .stat-card.left {
    transform: translateX(-140px) scale(0.8);
  }

  .stat-card.right {
    transform: translateX(140px) scale(0.8);
  }

  .card-number {
    font-size: 36px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-description {
    font-size: 14px;
  }

  .navigation {
    top: auto;
    bottom: -16px;
    transform: none;
  }

  .nav-btn {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 480px) {
  .stat-card.main {
    width: 300px;
    height: 280px;
  }

  .stat-card.left {
    transform: translateX(-120px) scale(0.7);
  }

  .stat-card.right {
    transform: translateX(120px) scale(0.7);
  }

  .section-title {
    font-size: 28px;
  }

  .section-subtitle {
    font-size: 16px;
  }
}
</style>