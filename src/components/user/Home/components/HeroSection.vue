<template>
  <div class="real-estate-solution">
    <!-- Phần trên với background -->
    <div class="hero-section" :style="{ backgroundImage: `url(${baseImgaeUrl + mergedConfig.background.image})` }">
      <div class="hero-content">
        <div class="video-content">
          <div class="video-frame">
            <!-- Khung video -->
            <img
                :src="baseImgaeUrl+ mergedConfig.video.frame.image"
                alt="Video frame"
                class="frame-image"
            />
            <!-- Video container -->
            <div class="video-container">
              <iframe
                  :width="mergedConfig.video.embed.width"
                  :height="mergedConfig.video.embed.height"
                  :src="mergedConfig.video.embed.url"
                  :title="mergedConfig.video.embed.title"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>

        <div class="text-content">
          <!-- Hiển thị toàn bộ nội dung bằng v-html -->
          <div class="rich-text-editor-wrapper">
            <div class="tiptap" v-html="mergedConfig.content"></div>
          </div>
          <div class="button-group">
            <button
                class="btn btn-primary"
                :style="buttonStyles.primary"
                @click="handleButtonClick(mergedConfig.buttons.primary)"
                @mousedown="startClickEffect($event, 'primary')"
                @mouseup="endClickEffect('primary')"
                @mouseleave="endClickEffect('primary')"
            >
              {{ mergedConfig.buttons.primary.text }}
            </button>
            <router-link
                :to="mergedConfig.buttons.outline.link"
                class="btn btn-outline"
                :style="buttonStyles.outline"
                @click="handleButtonClick(mergedConfig.buttons.outline)"
                @mousedown="startClickEffect($event, 'outline')"
                @mouseup="endClickEffect('outline')"
                @mouseleave="endClickEffect('outline')"
            >
              {{ mergedConfig.buttons.outline.text }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed, watch} from 'vue'
import {useRouter} from 'vue-router';

import {baseImgaeUrl} from "../../../../assets/js/global.js";

const router = useRouter()
const props = defineProps({
  content: {
    type: Object
  }
})

console.log("Hero props content:", props.content)

// Config mặc định ban đầu
const defaultConfig = {
  background: {
    image: '/imgs/bg-tin-tuc.png',
  },
  video: {
    frame: {
      width: '640px',
      height: '380px',
      image: '/imgs/khungVideo.svg'
    },
    embed: {
      width: 640,
      height: 360,
      url: 'https://www.youtube.com/embed/JZ1YvvYo2hA?si=x9rywQQBLi_1Vcf8',
      title: 'YouTube video player'
    }
  },
  content: `
    <h1 class="title">GIẢI PHÁP BÁN GẤP BẤT ĐỘNG SẢN TRONG 30 NGÀY</h1>
    <p class="description">Thiên Hà Group tự hào là đơn vị có hơn 15 năm kinh nghiệm hoạt động trong lĩnh vực mua bán và đầu tư bất động sản tại Việt Nam.</p>
    <p class="description">Với phương châm <strong class="highlight">"Bất Động Sản Thật – Giá Trị Thật"</strong>, Thiên Hà Group luôn nỗ lực đồng hành cùng Quý khách hàng trong quá trình mua bán, kiến tạo nên những giá trị thật sự cho cả người mua và người bán.</p>
    <p class="description">Liên hệ ngay <b>Thiên Hà Group</b> để nhận tư vấn và hỗ trợ nhanh nhất!</p>
  `,
  buttons: {
    primary: {
      text: 'Về chúng tôi >',
      link: '/ve-chung-toi',
      backgroundColor: '#031358',
      hoverBackgroundColor: '#0a2463',
      color: 'white',
      borderColor: '#031358',
      borderWidth: '0',
      borderRadius: '25px',
      padding: '10px 45px',
      margin: '0',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      clickTransform: 'scale(0.95)',
      clickBoxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      type: 'internal'
    },
    outline: {
      text: 'Xem chi tiết',
      link: '/giai-phap-ban-nhanh',
      backgroundColor: 'transparent',
      hoverBackgroundColor: '#031358',
      color: '#031358',
      hoverColor: 'white',
      borderColor: '#031358',
      borderWidth: '2px',
      borderRadius: '25px',
      padding: '10px 45px',
      margin: '0',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      clickTransform: 'scale(0.95)',
      clickBoxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      type: 'internal'
    }
  }
}

// Computed property để merge config
const mergedConfig = computed(() => {
  if (props.content?.contentJson) {
    // Deep merge defaultConfig với contentJson từ props
    return deepMerge(defaultConfig, props.content.contentJson)
  }
  console.log("Hero", "đang lấy dữ liệu mặc định")
  return defaultConfig
})

// Hàm deep merge để gộp đối tượng
function deepMerge(target, source) {
  const result = {...target}

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (target[key] && typeof target[key] === 'object') {
        result[key] = deepMerge(target[key], source[key])
      } else {
        result[key] = source[key]
      }
    } else {
      result[key] = source[key]
    }
  }

  return result
}

// State cho hiệu ứng click
const clickStates = reactive({
  primary: false,
  outline: false
})

// Computed styles cho các nút
const buttonStyles = computed(() => {
  return {
    primary: {
      backgroundColor: mergedConfig.value.buttons.primary.backgroundColor,
      color: mergedConfig.value.buttons.primary.color,
      border: `${mergedConfig.value.buttons.primary.borderWidth} solid ${mergedConfig.value.buttons.primary.borderColor}`,
      borderRadius: mergedConfig.value.buttons.primary.borderRadius,
      padding: mergedConfig.value.buttons.primary.padding,
      margin: mergedConfig.value.buttons.primary.margin,
      fontSize: mergedConfig.value.buttons.primary.fontSize,
      fontWeight: mergedConfig.value.buttons.primary.fontWeight,
      transition: mergedConfig.value.buttons.primary.transition,
      transform: clickStates.primary ? mergedConfig.value.buttons.primary.clickTransform : 'scale(1)',
      boxShadow: clickStates.primary ? mergedConfig.value.buttons.primary.clickBoxShadow : 'none'
    },
    outline: {
      backgroundColor: mergedConfig.value.buttons.outline.backgroundColor,
      color: mergedConfig.value.buttons.outline.color,
      border: `${mergedConfig.value.buttons.outline.borderWidth} solid ${mergedConfig.value.buttons.outline.borderColor}`,
      borderRadius: mergedConfig.value.buttons.outline.borderRadius,
      padding: mergedConfig.value.buttons.outline.padding,
      margin: mergedConfig.value.buttons.outline.margin,
      fontSize: mergedConfig.value.buttons.outline.fontSize,
      fontWeight: mergedConfig.value.buttons.outline.fontWeight,
      transition: mergedConfig.value.buttons.outline.transition,
      transform: clickStates.outline ? mergedConfig.value.buttons.outline.clickTransform : 'scale(1)',
      boxShadow: clickStates.outline ? mergedConfig.value.buttons.outline.clickBoxShadow : 'none'
    }
  }
})

// Hàm xử lý click
const handleButtonClick = (buttonConfig) => {
  console.log(`Button clicked: ${buttonConfig.text}`)

  switch (buttonConfig.type) {
    case 'internal':
      // Điều hướng nội bộ
      router.push(buttonConfig.link)
      break
    case 'external':
      // Mở link bên ngoài
      window.open(buttonConfig.link, '_blank')
      break
    case 'action':
      // Thực hiện hành động cụ thể
      if (buttonConfig.text.includes('Về chúng tôi')) {
        console.log('Mở modal giới thiệu')
        // Gọi hàm mở modal
      }
      break
    default:
      console.log('Default action')
  }

  // Thêm hiệu ứng haptic/feedback nếu là mobile
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
}

// Hàm bắt đầu hiệu ứng click
const startClickEffect = (event, buttonType) => {
  clickStates[buttonType] = true

  // Tạo ripple effect
  createRippleEffect(event, buttonType)
}

// Hàm kết thúc hiệu ứng click
const endClickEffect = (buttonType) => {
  setTimeout(() => {
    clickStates[buttonType] = false
  }, 150)
}

// Hàm tạo hiệu ứng ripple
const createRippleEffect = (event, buttonType) => {
  const button = event.currentTarget
  const circle = document.createElement('span')
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  // Tính vị trí click
  const rect = button.getBoundingClientRect()
  const x = event.clientX - rect.left - radius
  const y = event.clientY - rect.top - radius

  // Tạo circle
  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${x}px`
  circle.style.top = `${y}px`
  circle.classList.add('ripple')

  // Thêm màu ripple dựa trên button type
  if (buttonType === 'primary') {
    circle.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'
  } else {
    circle.style.backgroundColor = 'rgba(3, 19, 88, 0.2)'
  }

  // Xóa ripple cũ nếu có
  const ripple = button.querySelector('.ripple')
  if (ripple) {
    ripple.remove()
  }

  button.appendChild(circle)

  // Tự động xóa ripple sau animation
  setTimeout(() => {
    circle.remove()
  }, 600)
}
</script>

<style scoped>
.real-estate-solution {
  font-family: "Ubuntu", sans-serif;
}

.hero-section {
  background-size: cover;
  background-position: center;
  padding: 80px 0 40px;
}

.hero-content {
  margin: auto;
  display: flex;
  align-items: center;
  gap: 70px;
  max-width: 1400px;
  padding: 0 20px;
}

.video-content {
  flex: 0 0 auto;
}

.video-frame {
  position: relative;
  width: 640px;
  height: 380px;
}

/* Khung video */
.frame-image {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
  pointer-events: none;
}

/* Video container */
.video-container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.video-container iframe {
  width: 88%;
  height: 88%;
  border-radius: 12px;
}

.text-content {
  flex: 1;
}

/* Các class cho nội dung HTML */
.content :deep(.title) {
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.3;
}

.content :deep(.description) {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 15px;
  text-align: justify;
}

.content :deep(.highlight) {
  color: #f8bd0d;
}

.button-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  background: none !important;
  margin-top: 20px;
}

.btn {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  border: none;
  outline: none;
}

/* Ripple effect */
.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  transform: scale(0);
  animation: ripple-animation 0.6s linear;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Hover effects */
.btn-primary:hover {
  background-color: v-bind('mergedConfig.buttons.primary.hoverBackgroundColor');
  color: white;
}

.btn-outline:hover {
  background-color: v-bind('mergedConfig.buttons.outline.hoverBackgroundColor');
  color: v-bind('mergedConfig.buttons.outline.hoverColor');
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    gap: 40px;
  }

  .video-frame {
    width: 520px;
    height: 310px;
  }

  .content :deep(.title) {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    gap: 30px;
  }

  .content :deep(.title) {
    font-size: 28px;
  }

  .content :deep(.description) {
    font-size: 17px;
  }

  .button-group {
    justify-content: center;
  }
}

/* Thêm breakpoint cho màn hình nhỏ hơn 640px */
@media (max-width: 640px) {
  .video-frame {
    width: 100%;
    max-width: 500px;
    height: auto;
    aspect-ratio: 16/9;
    margin: 0 auto;
  }

  .video-container iframe {
    width: 90%;
    height: 90%;
  }
}

/* Điều chỉnh cho màn hình rất nhỏ */
@media (max-width: 480px) {
  .hero-section {
    padding: 50px 15px;
  }

  .video-frame {
    max-width: 100%;
  }

  .content :deep(.title) {
    font-size: 24px;
    text-align: center;
  }

  .content :deep(.description) {
    text-align: left;
  }

  .btn {
    padding: 10px 30px !important;
    width: 100%;
    max-width: 200px;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
  }
}

/* Điều chỉnh cho màn hình rất nhỏ (dưới 360px) */
@media (max-width: 360px) {
  .video-frame {
    max-width: 100%;
  }

  .video-container iframe {
    width: 92%;
    height: 92%;
  }

  .content :deep(.title) {
    font-size: 22px;
  }

  .content :deep(.description) {
    font-size: 16px;
  }
}
</style>