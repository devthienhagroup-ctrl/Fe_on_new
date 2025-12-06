<template>
  <div class="under-construction-page">
    <!-- Logo công ty -->
    <div class="logo-container">
      <img :src="logoUrl" alt="Company Logo" class="logo" />
    </div>

    <!-- Ảnh SVG lớn -->
    <div class="image-container">
      <img :src="constructionImageUrl" alt="Under Construction" class="construction-image" />
    </div>

    <!-- Tiêu đề trang -->
    <h1 class="page-title">Tính năng đang phát triển</h1>

    <!-- Subtitle -->
    <p class="subtitle">
      Chúng tôi xin lỗi vì sự bất tiện. Tính năng này vẫn đang trong quá trình phát triển, Rất mong quý khách thông cảm!
    </p>

    <!-- Nút quay về trang chủ -->
    <button class="home-button" @click="goBack">
      <i class="fa-solid fa-arrow-left-long"></i>
      Quay lại trang trước
    </button>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const goBack = () => {
  router.back()
}


// Đường dẫn đến các hình ảnh
const logoUrl = ref('/imgs/logoTHG.png')
const constructionImageUrl = ref('/imgs/under-construction-animate.svg')

// Hiệu ứng chuyển màu liên tục cho nút
let animationFrameId = ref(null)

const animateButton = () => {
  const button = document.querySelector('.home-button')
  if (!button) return

  const now = Date.now() / 1000
  const hue1 = (Math.sin(now * 0.5) * 30 + 240) // Từ 210-270 (xanh dương)
  const hue2 = (Math.sin(now * 0.5 + 2) * 30 + 240) // Dịch pha để tạo hiệu ứng

  button.style.background = `linear-gradient(135deg,
    hsl(${hue1}, 100%, 40%) 0%,
    hsl(${hue2}, 100%, 50%) 100%)`

  animationFrameId.value = requestAnimationFrame(animateButton)
}

onMounted(() => {
  // Bắt đầu hiệu ứng chuyển màu sau khi component được mount
  setTimeout(() => {
    animateButton()
  }, 100)
})

onUnmounted(() => {
  // Dọn dẹp animation frame khi component bị unmount
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>

<style scoped>
.under-construction-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  background-color: white;
}

.logo-container {
  margin-bottom: 40px;
}

.logo {
  height: 150px;
  width: auto;
}

.image-container {
  margin-bottom: 40px;
}

.construction-image {
  width: 400px;
  height: auto;
}

.page-title {
  color: #031358;
  text-transform: uppercase;
  font-size: 40px;
  margin-bottom: 20px;
  font-weight: bold;
}

.subtitle {
  font-size: 18px;
  color: #666;
  max-width: 600px;
  margin-bottom: 40px;
  line-height: 1.6;
}

.home-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #031358 0%, #0030FF 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.home-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.home-button:hover::after {
  left: 100%;
}

.home-icon {
  width: 18px;
  height: 18px;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .construction-image {
    max-width: 300px;
  }

  .subtitle {
    font-size: 16px;
  }
}
</style>