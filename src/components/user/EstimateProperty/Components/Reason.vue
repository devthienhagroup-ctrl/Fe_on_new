<template>
  <section class="why-choose-section" :style="sectionStyles">
    <div class="background-overlay">
      <div
          class="background-image"
          :style="{ backgroundImage: `url('${baseImgaeUrl+sectionData.backgroundImage}')` }"
      ></div>
      <div class="overlay" :style="{ backgroundColor: themeColors.primary }"></div>

      <!-- Floating Icons Container -->
      <div class="floating-icons-container" v-if="floatingConfig.enabled">
        <div
            v-for="(icon, index) in floatingIcons"
            :key="index"
            :class="['floating-icon', `floating-icon-${index + 1}`]"
            :style="icon.style"
        >
          <i :class="icon.class"></i>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Rest of your existing code -->
      <div class="title-section fade-up">
        <h1 :style="titleStyles">{{ sectionData.sectionTitle }}</h1>
      </div>

      <div class="content-wrapper">
        <!-- Left Column -->
        <div class="column left-column">
          <div
              v-for="(advantage, index) in leftColumnAdvantages"
              :key="index"
              class="advantage-item fade-right"
              :style="advantageItemStyles"
          >
            <div class="icon-wrapper" :style="iconWrapperStyles">
              <i :class="advantage.icon"></i>
            </div>
            <div class="text-content">
              <h3 :style="advantageTitleStyles">{{ advantage.title }}</h3>
              <p :style="advantageContentStyles">{{ advantage.content }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="column right-column">
          <div
              class="logo-section fade-in"
              :style="logoSectionStyles"
          >
            <img
                :src="sectionData.logoUrl"
                alt="Thiên Hà Group Logo"
                class="logo"
                :style="logoStyles"
            />
          </div>

          <div class="advantages-right">
            <div
                v-for="(advantage, index) in rightColumnAdvantages"
                :key="index"
                class="advantage-item fade-left"
                :style="advantageItemStyles"
            >
              <div class="icon-wrapper" :style="iconWrapperStyles">
                <i :class="advantage.icon"></i>
              </div>
              <div class="text-content">
                <h3 :style="advantageTitleStyles">{{ advantage.title }}</h3>
                <p :style="advantageContentStyles">{{ advantage.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, reactive, watch } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

const props = defineProps({
  sectionData: String // Nhận chuỗi JSON từ component cha
})

// Dữ liệu mặc định
const defaultSectionData = {
  sectionTitle: "Tại sao nên định giá tại Thiên Hà Group?",
  logoUrl: "/imgs/logoTHG.png",
  backgroundImage: "/imgs/bg-gia-tri.jpg",
  advantages: [
    {
      icon: "fa-solid fa-laptop-house",
      title: "Tiện lợi đánh giá mọi lúc mọi nơi",
      content: "Không cần phải hẹn chuyên viên hay di chuyển, người dùng chỉ cần nhập thông tin tài sản (vị trí, diện tích, số tầng, hướng...) là có thể nhận được kết quả định giá ngay lập tức — tiết kiệm thời gian và công sức."
    },
    {
      icon: "fa-solid fa-bolt",
      title: "Nhanh chóng có kết quả trong vài giây",
      content: "Hệ thống tự động phân tích dữ liệu thị trường, so sánh với các bất động sản tương tự để đưa ra mức giá ước tính tức thì và chính xác — nhanh hơn hàng chục lần so với định giá thủ công."
    },
    {
      icon: "fa-solid fa-database",
      title: "Độ chính xác cao nhờ dữ liệu lớn",
      content: "Công cụ sử dụng dữ liệu thực tế từ hàng nghìn giao dịch, tin rao và giá trị trung cấp nhất liên tục — giúp kết quả phản ánh sát với giá trị thật của tài sản."
    },
    {
      icon: "fa-solid fa-chart-line",
      title: "Hỗ trợ ra quyết định đầu tư hiệu quả",
      content: "Kết quả định giá giúp người dùng so sánh giá bán, xác định cơ hội đầu tư hoặc thương lượng tốt hơn, tránh mua hớ hoặc bán lỗ."
    },
    {
      icon: "fa-solid fa-shield-halved",
      title: "Bảo mật và minh bạch thông tin",
      content: "Thông tin cá nhân và dữ liệu bất động sản của người dùng được mã hóa, chỉ phục vụ cho mục đích định giá — đảm bảo tính riêng tư và bảo mật."
    }
  ]
}

// Dữ liệu động - sẽ bị ghi đè nếu có props
const sectionData = reactive({ ...defaultSectionData })

// Cấu hình theme mặc định
const defaultThemeColors = {
  primary: "#031358",
  secondary: "#F8BD0D",
  textLight: "#FFFFFF",
  textDark: "#031358",
  overlayOpacity: 0.5,
  glassOpacity: 0.15,
  glassHoverOpacity: 0.2
}

const themeColors = reactive({ ...defaultThemeColors })

// Cấu hình floating icons mặc định
const defaultFloatingConfig = {
  enabled: true,
  count: 5,
  minSize: 20,
  maxSize: 40,
  minOpacity: 0.2,
  maxOpacity: 0.5,
  minDuration: 10,
  maxDuration: 20
}

const floatingConfig = reactive({ ...defaultFloatingConfig })

// Cấu hình layout mặc định
const defaultLayoutConfig = {
  leftColumnItems: 3,
  rightColumnItems: 2
}

const layoutConfig = reactive({ ...defaultLayoutConfig })

// Computed styles
const sectionStyles = computed(() => ({
  '--primary-color': themeColors.primary,
  '--secondary-color': themeColors.secondary,
  '--text-light': themeColors.textLight,
  '--text-dark': themeColors.textDark,
  '--glass-opacity': themeColors.glassOpacity,
  '--glass-hover-opacity': themeColors.glassHoverOpacity
}))

const titleStyles = computed(() => ({
  color: themeColors.textDark,
  backgroundColor: themeColors.secondary
}))

const advantageItemStyles = computed(() => ({
  background: `rgba(255, 255, 255, ${themeColors.glassOpacity})`,
  border: `1px solid rgba(255, 255, 255, 0.2)`
}))

const iconWrapperStyles = computed(() => ({
  background: `rgba(3, 19, 88, 0.9)`,
  color: themeColors.secondary,
  border: `1px solid rgba(255, 255, 255, 0.3)`
}))

const advantageTitleStyles = computed(() => ({
  color: themeColors.textLight
}))

const advantageContentStyles = computed(() => ({
  color: `rgba(255, 255, 255, 0.9)`
}))

const logoSectionStyles = computed(() => ({
  background: `rgba(255, 255, 255, ${themeColors.glassOpacity})`,
  border: `1px solid rgba(255, 255, 255, 0.2)`
}))

const logoStyles = computed(() => ({
  filter: 'brightness(0) invert(1)'
}))

// Split advantages based on layout config
const leftColumnAdvantages = computed(() =>
    sectionData.advantages.slice(0, layoutConfig.leftColumnItems)
)

const rightColumnAdvantages = computed(() =>
    sectionData.advantages.slice(
        layoutConfig.leftColumnItems,
        layoutConfig.leftColumnItems + layoutConfig.rightColumnItems
    )
)

// Floating icons data
const floatingIcons = ref([])

// Initialize floating icons
const initFloatingIcons = () => {
  if (!floatingConfig.enabled) return

  const iconClasses = sectionData.advantages.map(adv => adv.icon)

  // Limit number of icons if needed
  const iconsToShow = iconClasses.slice(0, floatingConfig.count)

  floatingIcons.value = iconsToShow.map((iconClass, index) => {
    const left = Math.random() * 90 + 5
    const top = Math.random() * 90 + 5
    const duration = Math.random() * (floatingConfig.maxDuration - floatingConfig.minDuration) + floatingConfig.minDuration
    const delay = Math.random() * 5
    const size = Math.random() * (floatingConfig.maxSize - floatingConfig.minSize) + floatingConfig.minSize
    const opacity = Math.random() * (floatingConfig.maxOpacity - floatingConfig.minOpacity) + floatingConfig.minOpacity

    return {
      class: iconClass,
      style: {
        left: `${left}%`,
        top: `${top}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        fontSize: `${size}px`,
        opacity: opacity
      }
    }
  })
}

// Hàm cập nhật dữ liệu từ props
const updateFromProps = () => {
  console.log("Kiểm tra props")
  if (props.sectionData) {
    console.log("có nhận được props", props.sectionData)
    try {
      const parsedData = JSON.parse(props.sectionData)

      // Cập nhật sectionData
      Object.assign(sectionData, {
        sectionTitle: parsedData.sectionTitle,
        logoUrl: parsedData.logoUrl,
        backgroundImage: parsedData.backgroundImage,
        advantages: parsedData.advantages
      })

      // Cập nhật themeColors
      if (parsedData.themeColors) {
        Object.assign(themeColors, {
          primary: parsedData.themeColors.primary,
          secondary: parsedData.themeColors.secondary,
          textLight: parsedData.themeColors.textLight,
          textDark: parsedData.themeColors.textDark
          // Giữ nguyên các giá trị opacity nếu không có trong JSON
        })
      }

      // Cập nhật floatingConfig
      if (parsedData.floatingIcons) {
        Object.assign(floatingConfig, parsedData.floatingIcons)
      }

      // Cập nhật layoutConfig
      if (parsedData.layout) {
        Object.assign(layoutConfig, parsedData.layout)
      }

      // Khởi tạo lại floating icons
      initFloatingIcons()

    } catch (error) {
      console.error('Error parsing JSON from props:', error)
    }
  } else console.log("Không nhận được props")
}

// Watch for props changes
watch(() => props.sectionData, () => {
  updateFromProps()
})

onMounted(() => {
  // Cập nhật từ props khi component được mount
  updateFromProps()
  initFloatingIcons()
})

// Function to update data (for future CMS integration)
const updateSectionData = (newData) => {
  Object.assign(sectionData, newData)
  initFloatingIcons()
}

const updateThemeColors = (newColors) => {
  Object.assign(themeColors, newColors)
}

const updateFloatingConfig = (newConfig) => {
  Object.assign(floatingConfig, newConfig)
  initFloatingIcons()
}

const updateLayoutConfig = (newConfig) => {
  Object.assign(layoutConfig, newConfig)
}

// Expose functions for future CMS integration
defineExpose({
  updateSectionData,
  updateThemeColors,
  updateFloatingConfig,
  updateLayoutConfig,
  sectionData,
  themeColors,
  floatingConfig,
  layoutConfig
})
</script>

<style scoped>
/* Giữ nguyên phần style không thay đổi */
.why-choose-section {
  position: relative;
  min-height: 100vh;
  font-family: 'Ubuntu', sans-serif;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: v-bind('themeColors.overlayOpacity');
}

/* Floating Icons Styles */
.floating-icons-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-icon {
  position: absolute;
  color: rgba(255, 255, 255, 0.7);
  animation: floating linear infinite;
  z-index: 0;
}

@keyframes floating {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) translateX(10px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) translateX(20px) rotate(0deg);
  }
  75% {
    transform: translateY(-30px) translateX(10px) rotate(-5deg);
  }
  100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
}

/* Rest of your existing styles */
.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 0 20px;
}

.title-section {
  text-align: center;
  margin-bottom: 60px;
}

.title-section h1 {
  font-size: 40px;
  display: inline-block;
  padding: 20px 40px;
  margin: 0;
  position: relative;
  border-radius: 5px;
}

.title-section h1::after {
  content: '';
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20%;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 2px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: stretch;
  padding-bottom: 30px;
}

.column {
  display: flex;
  flex-direction: column;
}

.left-column {
  gap: 30px;
}

.right-column {
  gap: 40px;
}

.advantage-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  flex: 1;
  min-height: 200px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.advantage-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
  transparent,
  rgba(255, 255, 255, 0.4),
  transparent
  );
}

.advantage-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, var(--glass-hover-opacity)) !important;
}

.icon-wrapper {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.text-content {
  flex: 1;
}

.text-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 15px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.text-content p {
  font-size: 15px;
  line-height: 1.7;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.logo-section {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 40px;
  min-height: 200px;
}

.logo {
  width: 100%;
  height: auto;
  max-width: 300px;
}

.advantages-right {
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-wrapper {
    gap: 40px;
  }

  .advantage-item {
    padding: 25px;
    min-height: 180px;
  }

  .logo {
    max-width: 250px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .title-section h1 {
    font-size: 32px;
    padding: 15px 30px;
  }

  .advantage-item {
    flex-direction: column;
    text-align: center;
    padding: 25px;
    min-height: auto;
  }

  .icon-wrapper {
    align-self: center;
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .logo {
    max-width: 200px;
  }

  .logo-section {
    padding: 30px;
  }

  /* Reduce number of floating icons on mobile */
  .floating-icon:nth-child(n+4) {
    display: none;
  }
}

@media (max-width: 480px) {
  .why-choose-section {
    padding: 40px 15px;
  }

  .title-section {
    margin-bottom: 40px;
  }

  .title-section h1 {
    font-size: 24px;
    padding: 12px 20px;
  }

  .advantage-item {
    padding: 20px;
  }

  .icon-wrapper {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .text-content h3 {
    font-size: 18px;
  }

  .text-content p {
    font-size: 14px;
  }

  .logo {
    max-width: 180px;
  }

  .logo-section {
    padding: 25px;
  }
}
</style>