<template>
  <div class="services-container">
    <h1 class="services-title">DỊCH VỤ NỔI BẬT</h1>

    <!-- Vòng tròn xoay (chỉ hiển thị trên desktop) -->
    <div class="rotating-circle desktop-only">
      <img src="/imgs/Circle.svg" alt="Rotating Circle" />
    </div>

    <!-- Layout desktop -->
    <div class="services-layout desktop-only">
      <!-- Cột trái: Hiển thị chi tiết dịch vụ -->
      <div class="service-detail-col">
        <div
            class="service-detail-container"
            :class="{ 'active': activeIndex === index }"
            v-for="(service, index) in services"
            :key="index"
        >
          <!-- Tam giác chỉ vào menu -->
          <div class="service-pointer" :style="{ top: pointerPosition + 'px' }"></div>

          <!-- Ảnh dịch vụ -->
          <div class="service-detail-image">
            <img
                :src="service.image"
                :alt="service.title"
                class="service-detail-img"
                :ref="el => { if (el) imageRefs[index] = el }"
                @load="analyzeImageColor(index)"
            />

            <!-- Vùng chi tiết với hiệu ứng kính mờ thông minh -->
            <div
                class="service-detail-overlay"
                :class="{
                'dark-text': textColors[index] === 'dark',
                'light-text': textColors[index] === 'light'
              }"
            >
              <div class="service-detail-content">
                <h3 class="service-detail-title">{{ service.title }}</h3>
                <p class="service-detail-text">{{ service.content }}</p>
                <button
                    class="service-detail-btn"
                    :class="{
                    'dark-btn': textColors[index] === 'dark',
                    'light-btn': textColors[index] === 'light'
                  }"
                >
                  <span>Tìm hiểu thêm</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải: Menu dịch vụ -->
      <div class="service-menu-col">
        <div class="service-menu">
          <div
              v-for="(service, index) in services"
              :key="index"
              class="service-menu-item"
              :class="{ 'active': activeIndex === index }"
              @click="selectService(index)"
              :ref="el => { if (el) menuItems[index] = el }"
          >
            <div class="service-menu-icon">
              <i :class="service.icon"></i>
            </div>
            <div class="service-menu-title">
              {{ service.title }}
            </div>
            <div class="service-menu-arrow">
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout mobile - Collapse -->
    <div class="services-collapse mobile-only">
      <div
          class="service-collapse-item"
          v-for="(service, index) in services"
          :key="index"
          :class="{ 'active': activeMobileIndex === index }"
      >
        <div class="service-collapse-header" @click="toggleMobileService(index)">
          <div class="service-collapse-icon">
            <i :class="service.icon"></i>
          </div>
          <div class="service-collapse-title">
            {{ service.title }}
          </div>
          <div class="service-collapse-arrow">
            <i class="fas" :class="activeMobileIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </div>
        </div>
        <div class="service-collapse-content" v-show="activeMobileIndex === index">
          <div class="service-collapse-image">
            <img :src="service.image" :alt="service.title" />
          </div>
          <div class="service-collapse-detail">
            <p class="service-collapse-text">{{ service.content }}</p>
            <button class="service-collapse-btn">
              <span>Tìm hiểu thêm</span>
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const services = ref([
  {
    title: "Khảo sát bất động sản",
    content: "Khảo sát, tìm kiếm thông tin đối thủ, lên chiến lược marketing hiệu quả trên từng bất động sản.",
    image: "/imgs/khaosatbds.jpg",
    icon: "fa-solid fa-magnifying-glass-chart"
  },
  {
    title: "Đăng tin bất động sản",
    content: "Dịch vụ đăng tin bất động sản lên 20-50 trang phù thị trường tiếp cận khách hàng tiềm năng.",
    image: "/imgs/dangtinbds.jpg",
    icon: "fa-solid fa-newspaper"
  },
  {
    title: "Giải pháp bán gấp BĐS",
    content: "Giải pháp bán gấp bất động sản từ 3 - 6 tháng là gói tiết kiệm chi phí.",
    image: "/imgs/bangapbds.jpg",
    icon: "fa-solid fa-bolt"
  },
  {
    title: "Định giá bất động sản",
    content: "Định giá chuẩn bán nhanh hơn, bằng phương pháp so sánh, phương pháp đầu tư...trên mỗi bất động sản.",
    image: "/imgs/dinhgiabds.jpg",
    icon: "fa-solid fa-chart-line"
  },
  {
    title: "Bán nhanh BĐS 30 ngày",
    content: "Giải pháp bán nhanh bất động sản trong 30 ngày tại Thiên Hà Group có cam kết",
    image: "/imgs/bannhanh30d.jpg",
    icon: "fa-solid fa-stopwatch"
  },
  {
    title: "Truyền thông bất động sản",
    content: "Xuất thân tử Công Nghệ và Digital Marketing Thiên Hà Group triển khai truyền thông bđs hiệu quả.",
    image: "/imgs/truyenthongbds.jpg",
    icon: "fa-solid fa-bullhorn"
  }
])

const activeIndex = ref(0)
const activeMobileIndex = ref(null)
const menuItems = ref([])
const imageRefs = ref([])
const pointerPosition = ref(0)
const textColors = ref([]) // 'light' hoặc 'dark'

// Phân tích màu sắc của ảnh để xác định màu chữ phù hợp
const analyzeImageColor = (index) => {
  if (!imageRefs.value[index]) return

  const img = imageRefs.value[index]
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  // Lấy dữ liệu pixel từ vùng dưới cùng (nơi đặt overlay)
  const imageData = ctx.getImageData(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3)
  const data = imageData.data

  let totalBrightness = 0
  let sampleCount = 0

  // Lấy mẫu một số pixel để tính độ sáng trung bình
  for (let i = 0; i < data.length; i += 16) { // Lấy mẫu 1/16 pixel
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Tính độ sáng (luminance) theo công thức tiêu chuẩn
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    totalBrightness += brightness
    sampleCount++
  }

  const averageBrightness = totalBrightness / sampleCount

  // Nếu độ sáng trung bình > 0.6, sử dụng chữ tối, ngược lại dùng chữ sáng
  textColors.value[index] = averageBrightness > 0.6 ? 'dark' : 'light'
}

const selectService = (index) => {
  activeIndex.value = index

  // Cập nhật vị trí tam giác chỉ
  if (menuItems.value[index]) {
    const item = menuItems.value[index]
    const itemRect = item.getBoundingClientRect()
    const menuRect = item.parentElement.getBoundingClientRect()
    pointerPosition.value = itemRect.top - menuRect.top + itemRect.height / 2 - 10
  }
}

const toggleMobileService = (index) => {
  activeMobileIndex.value = activeMobileIndex.value === index ? null : index
}

onMounted(() => {
  // Khởi tạo vị trí tam giác chỉ
  selectService(0)

  // Đặt màu mặc định cho tất cả dịch vụ
  services.value.forEach((_, index) => {
    textColors.value[index] = 'light' // Mặc định là chữ sáng
  })
})
</script>

<style scoped>
.services-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  padding: 0 20px 60px;

  display: flex;
  flex-direction: column;
}

.services-title {
  font-family: 'Ubuntu', sans-serif;
  font-size: 33px;
  color: #031358;
  text-align: center;
  margin-bottom: 60px;
  font-weight: bolder;
  flex-shrink: 0;
}

/* Desktop Layout */
.services-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  position: relative;
  z-index: 2;
  flex: 1;
}

/* Cột chi tiết dịch vụ */
.service-detail-col {
  position: relative;
  height: 600px;
  overflow: hidden;
}

.service-detail-container {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.5s ease;
}

.service-detail-container.active {
  opacity: 1;
  transform: scale(1);
}

.service-pointer {
  position: absolute;
  right: -20px;
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
  border-left: 20px solid #fff;
  z-index: 10;
  transition: top 0.3s ease;
}

/* Ảnh dịch vụ */
.service-detail-image {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.service-detail-img {
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center;
  transition: transform 0.8s ease;
}

.service-detail-container.active .service-detail-img {
  transform: scale(1.05);
}

/* Vùng chi tiết với hiệu ứng kính mờ thông minh */
.service-detail-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 40px;
  transform: translateY(0);
  transition: all 0.4s ease;
}

/* Overlay cho nền sáng - chữ tối */
.service-detail-overlay.dark-text {
  background: rgba(255, 255, 255, 0);
  color: #031358;
}

.service-detail-overlay.dark-text .service-detail-content {
  color: #031358;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

/* Overlay cho nền tối - chữ sáng */
.service-detail-overlay.light-text {
  background: rgba(0, 0, 0, 0);
  color: #fff;
}

.service-detail-overlay.light-text .service-detail-content {
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.service-detail-content {
  transition: all 0.3s ease;
}

.service-detail-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 20px 0;
  font-family: 'Ubuntu', sans-serif;
  line-height: 1.2;
}

.service-detail-text {
  font-size: 16px;
  line-height: 1.6;
  font-family: 'Ubuntu', sans-serif;
  margin: 0 0 30px 0;
  opacity: 0.9;
}

/* Nút với màu sắc thích ứng */
.service-detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Ubuntu', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

/* Nút cho nền sáng */
.service-detail-btn.dark-btn {
  background: rgba(3, 19, 88, 0.9);
  color: #fff;
  border: 1px solid rgba(3, 19, 88, 0.5);
}

.service-detail-btn.dark-btn:hover {
  background: rgba(3, 19, 88, 1);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(3, 19, 88, 0.3);
}

/* Nút cho nền tối */
.service-detail-btn.light-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
}

.service-detail-btn.light-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Phần còn lại của CSS giữ nguyên... */

/* Cột menu dịch vụ */
.service-menu-col {
  display: flex;
  align-items: center;
  padding-right: 15px;
}

.service-menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.service-menu-item {
  display: flex;
  align-items: center;
  padding: 20px 25px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
  overflow: hidden;
}

.service-menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
  rgba(3, 19, 88, 0.9) 0%,
  rgba(58, 83, 185, 0.8) 50%,
  rgba(3, 19, 88, 0.9) 100%);
  transition: left 0.6s ease;
  z-index: 1;
}

.service-menu-item.active::before {
  left: 0;
}

.service-menu-item:hover::before {
  left: 0;
}

.service-menu-item > * {
  position: relative;
  z-index: 2;
}

.service-menu-item:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  border-color: rgba(3, 19, 88, 0.1);
}

.service-menu-item.active {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(3, 19, 88, 0.3);
}

.service-menu-item.active .service-menu-title {
  color: #fff;
  font-weight: 600;
}

.service-menu-item.active .service-menu-icon i {
  color: #fff;
  transform: scale(1.1);
}

.service-menu-item.active .service-menu-arrow i {
  color: #fff;
  transform: translateX(5px);
}

.service-menu-icon {
  flex: 0 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.service-menu-icon i {
  font-size: 24px;
  color: #031358;
  transition: all 0.3s ease;
}

.service-menu-title {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Ubuntu', sans-serif;
  color: #031358;
  transition: all 0.3s ease;
}

.service-menu-arrow {
  flex: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-menu-arrow i {
  font-size: 14px;
  color: #031358;
  transition: all 0.3s ease;
}

.service-menu-item:hover .service-menu-arrow i {
  transform: translateX(3px);
}

/* Mobile Layout - Collapse */
.services-collapse {
  display: none;
  width: 100%;
  flex-direction: column;
  gap: 15px;
}

.service-collapse-item {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.service-collapse-item.active {
  box-shadow: 0 8px 25px rgba(3, 19, 88, 0.15);
}

.service-collapse-header {
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.service-collapse-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
  rgba(3, 19, 88, 0.9) 0%,
  rgba(58, 83, 185, 0.8) 50%,
  rgba(3, 19, 88, 0.9) 100%);
  transition: left 0.6s ease;
  z-index: 1;
}

.service-collapse-item.active .service-collapse-header::before {
  left: 0;
}

.service-collapse-header > * {
  position: relative;
  z-index: 2;
}

.service-collapse-item.active .service-collapse-header > * {
  color: #fff;
}

.service-collapse-icon {
  flex: 0 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.service-collapse-icon i {
  font-size: 24px;
  color: #031358;
  transition: all 0.3s ease;
}

.service-collapse-item.active .service-collapse-icon i {
  color: #fff;
  transform: scale(1.1);
}

.service-collapse-title {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  font-family: 'Ubuntu', sans-serif;
  color: #031358;
  transition: all 0.3s ease;
}

.service-collapse-item.active .service-collapse-title {
  font-weight: 600;
}

.service-collapse-arrow {
  flex: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-collapse-arrow i {
  font-size: 14px;
  color: #031358;
  transition: all 0.3s ease;
}

.service-collapse-item.active .service-collapse-arrow i {
  color: #fff;
}

.service-collapse-content {
  padding: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.4s ease;
}

.service-collapse-item.active .service-collapse-content {
  padding: 20px;
  max-height: 1000px;
}

.service-collapse-image {
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

.service-collapse-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-collapse-text {
  font-size: 14px;
  line-height: 1.6;
  font-family: 'Ubuntu', sans-serif;
  color: #333;
  margin-bottom: 20px;
}

.service-collapse-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #031358, #3a53b9);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-family: 'Ubuntu', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-collapse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(3, 19, 88, 0.3);
}

/* Vòng tròn xoay */
.rotating-circle {
  position: absolute;
  left: -50%;
  top: 30%;
  transform: translateY(-50%);
  width: 100%;
  height: auto;
  z-index: -1;
  animation: rotate 10s linear infinite;
}

.rotating-circle img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@keyframes rotate {
  from {
    transform: translateY(-50%) rotate(0deg);
  }
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

/* Responsive */
@media (min-width: 769px) {
  .mobile-only {
    display: none;
  }
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }

  .services-container {
    height: auto;
    padding-bottom: 40px;
  }

  .services-title {
    font-size: 28px;
    margin-bottom: 40px;
  }
}

@media (max-width: 480px) {
  .services-title {
    font-size: 24px;
  }

  .service-collapse-header {
    padding: 15px;
  }

  .service-collapse-icon {
    flex: 0 0 30px;
    margin-right: 10px;
  }

  .service-collapse-icon i {
    font-size: 20px;
  }

  .service-collapse-title {
    font-size: 14px;
  }

  .service-collapse-content {
    padding: 0 15px;
  }

  .service-collapse-item.active .service-collapse-content {
    padding: 15px;
  }

  .service-collapse-image {
    height: 150px;
  }
}
</style>