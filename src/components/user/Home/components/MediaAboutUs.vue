<template>
  <section class="media-section">
    <div class="background">
      <img :alt="config.backgroundAlt" :src="getImageUrl(config.backgroundImage)" />
    </div>
    <div class="container">
      <div class="text-content">
        <h1 class="title">{{ config.title }}</h1>
        <p class="subtitle" v-html="config.subtitle"></p>
      </div>

      <!-- Logo Marquee Section - Chạy từ phải sang trái -->
      <div class="logo-section">
        <div class="logo-marquee">
          <div class="logo-track left-to-right" :style="{ animationDuration: `${config.marqueeDuration}s` }">
            <!-- Thêm logo báo chí ở đây -->
            <div v-for="(logo, index) in config.mediaLogos" :key="index" class="logo-item">
              <img :src="getImageUrl(logo)" :alt="`Logo ${logo}`" />
            </div>
            <!-- Lặp lại để tạo hiệu ứng liên tục -->
            <div v-for="(logo, index) in config.mediaLogos" :key="`dup-${index}`" class="logo-item">
              <img :src="getImageUrl(logo)" :alt="`Logo ${logo}`" />
            </div>
          </div>
        </div>
      </div>

      <!-- Company Activities Gallery - Chạy từ trái sang phải -->
      <div class="gallery-section">
        <div class="gallery-marquee">
          <div class="gallery-track right-to-left" :style="{ animationDuration: `${config.galleryMarqueeDuration}s` }">
            <div
                v-for="(image, index) in config.galleryImages"
                :key="index"
                class="gallery-item"
                @click="openImagePreview(index)"
            >
              <img :src="getImageUrl(image)" :alt="`${config.galleryAltPrefix} ${index + 1}`" />
            </div>
            <!-- Lặp lại để tạo hiệu ứng liên tục -->
            <div
                v-for="(image, index) in config.galleryImages"
                :key="`dup-${index}`"
                class="gallery-item"
                @click="openImagePreview(index)"
            >
              <img :src="getImageUrl(image)" :alt="`${config.galleryAltPrefix} ${index + 1}`" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="showImagePreview" class="image-preview-modal" @click.self="closeImagePreview">
      <div class="modal-content">
        <button class="close-btn" @click="closeImagePreview">×</button>
        <div class="image-container">
          <img :src="getImageUrl(config.galleryImages[currentImageIndex])" :alt="`${config.galleryAltPrefix} ${currentImageIndex + 1}`" />
        </div>
        <div class="navigation-controls">
          <button class="nav-btn prev-btn" @click="prevImage" :disabled="currentImageIndex === 0">
            ‹
          </button>
          <span class="image-counter">{{ currentImageIndex + 1 }} / {{ config.galleryImages.length }}</span>
          <button class="nav-btn next-btn" @click="nextImage" :disabled="currentImageIndex === config.galleryImages.length - 1">
            ›
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

const props = defineProps({
  content: Object,
});
// ========== CONFIGURATION OBJECT - Có thể chỉnh sửa dễ dàng ==========
let config = ref({
  // Background settings
  backgroundImage: 'logoTHG.png',
  backgroundAlt: 'Logo nền',

  // Text content
  title: 'TRUYỀN THÔNG NÓI VỀ CHÚNG TÔI',
  subtitle: 'Thiên Hà Group tự hào được các phương tiện truyền thông phản ánh tích cực trong thời gian qua.<br>Cùng điểm lại một số tin bài online về Thiên Hà Group nhé!',

  // Media logos
  mediaLogos: [
    'md1.jpg', 'md2.jpg', 'md3.jpg', 'md4.jpg',
    'md5.jpg', 'md6.jpg', 'md7.jpg', 'md8.jpg'
  ],

  // Gallery images
  galleryImages: [
    'hd1.jpg', 'hd2.jpg', 'hd3.jpg', 'hd4.jpg',
    'hd5.jpg', 'hd6.jpg', 'hd7.jpg', 'hd8.jpg'
  ],
  galleryAltPrefix: 'Hoạt động',

  // Animation durations (seconds)
  marqueeDuration: 30,
  galleryMarqueeDuration: 40,

  // Colors
  primaryColor: '#031358',
  textColor: '#000000',
  backgroundColor: '#ffffff',

  // Font sizes
  titleFontSize: '33px',
  subtitleFontSize: '17px',

  // Logo settings
  logoHeight: '60px',
  logoMaxWidth: '150px',

  // Gallery settings
  galleryItemWidth: '300px',
  galleryItemHeight: '200px',
  galleryGap: '20px',

  // Modal settings
  modalBackgroundColor: 'rgba(0, 0, 0, 0.9)',
  modalButtonColor: 'rgba(255, 255, 255, 0.2)',
  modalButtonHoverColor: 'rgba(255, 255, 255, 0.4)',

  // Responsive settings
  mobileBreakpoint: '768px',
  mobileTitleFontSize: '28px',
  mobileLogoHeight: '40px',
  mobileGalleryItemWidth: '250px',
  mobileGalleryItemHeight: '170px'
})

if(props.content) config.value = props.content.contentJson;
else console.log("Media không có props lấy dữ liệu mặc định")

// console.log(JSON.stringify(config.value));

// State cho image preview
const showImagePreview = ref(false)
const currentImageIndex = ref(0)

// Hàm lấy đường dẫn ảnh từ thư mục assets
const getImageUrl = (filename) => {
  return baseImgaeUrl+filename;
}

// Mở modal xem trước ảnh
const openImagePreview = (index) => {
  currentImageIndex.value = index
  showImagePreview.value = true
}

// Đóng modal xem trước ảnh
const closeImagePreview = () => {
  showImagePreview.value = false
}

// Chuyển đến ảnh tiếp theo
const nextImage = () => {
  if (currentImageIndex.value < config.value.galleryImages.length - 1) {
    currentImageIndex.value++
  }
}

// Chuyển đến ảnh trước đó
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// Xử lý sự kiện phím để điều hướng ảnh
const handleKeydown = (event) => {
  if (!showImagePreview.value) return

  switch (event.key) {
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
    case 'Escape':
      closeImagePreview()
      break
  }
}

// Thêm event listener cho phím
document.addEventListener('keydown', handleKeydown)

// Cleanup event listener
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.media-section {
  padding: 60px 0 20px;
  background: v-bind('config.backgroundColor');
  position: relative;
  overflow: hidden;
  min-height: 80vh;
  justify-items: center;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
}

.background img {
  height: 70%;
  width: auto;
  opacity: 0.2;
  object-fit: contain;
}

.text-content {
  text-align: center;
  margin-bottom: 50px;
}

.title {
  font-family: 'Ubuntu', sans-serif;
  font-size: v-bind('config.titleFontSize');
  color: v-bind('config.primaryColor');
  margin-bottom: 20px;
  font-weight: 700;
}

.subtitle {
  font-family: 'Ubuntu', sans-serif;
  font-size: v-bind('config.subtitleFontSize');
  color: v-bind('config.textColor');
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

/* Logo Marquee Styles - Chạy từ trái sang phải */
.logo-section {
  margin: 40px 0 60px;
  overflow: hidden;
  position: relative;
}

.logo-marquee {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.logo-track {
  display: flex;
  width: max-content;
}

/* Animation cho logo chạy từ trái sang phải */
.logo-track.left-to-right {
  animation: marqueeLeftToRight linear infinite;
}

/* Animation cho gallery chạy từ phải sang trái */
.gallery-track.right-to-left {
  animation: marqueeRightToLeft linear infinite;
}

.logo-item {
  flex-shrink: 0;
  margin: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
}

.logo-item img {
  height: v-bind('config.logoHeight');
  width: auto;
  max-width: v-bind('config.logoMaxWidth');
  object-fit: contain;
  transition: filter 0.3s ease;
}

.logo-item img:hover {
  filter: grayscale(0%);
}

/* Gallery Marquee Styles - Chạy từ phải sang trái */
.gallery-section {
  margin-top: 60px;
  overflow: hidden;
  position: relative;
}

.gallery-marquee {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.gallery-track {
  display: flex;
  gap: v-bind('config.galleryGap');
  width: max-content;
}

.gallery-item {
  flex-shrink: 0;
  width: v-bind('config.galleryItemWidth');
  height: v-bind('config.galleryItemHeight');
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

/* Keyframes cho animation ngược chiều nhau */
@keyframes marqueeLeftToRight {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0%);
  }
}

@keyframes marqueeRightToLeft {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Pause animation on hover */
.logo-track:hover,
.gallery-track:hover {
  animation-play-state: paused;
}

/* Image Preview Modal Styles */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: v-bind('config.modalBackgroundColor');
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #ccc;
}

.image-container {
  max-width: 100%;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
}

.navigation-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;
}

.nav-btn {
  background: v-bind('config.modalButtonColor');
  border: none;
  color: white;
  font-size: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.nav-btn:hover:not(:disabled) {
  background: v-bind('config.modalButtonHoverColor');
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-counter {
  color: white;
  font-size: 16px;
  font-family: 'Ubuntu', sans-serif;
}

/* Responsive Design */
/*@media (max-width: v-bind('config.mobileBreakpoint')) {*/@media (max-width: 800px) {

  .media-section {
    padding: 40px 15px;
  }

  .title {
    font-size: v-bind('config.mobileTitleFontSize');
  }

  .subtitle {
    font-size: 16px;
  }

  .logo-item {
    margin: 0 20px;
    height: 60px;
  }

  .logo-item img {
    height: v-bind('config.mobileLogoHeight');
  }

  .gallery-item {
    width: v-bind('config.mobileGalleryItemWidth');
    height: v-bind('config.mobileGalleryItemHeight');
  }

  .modal-content {
    max-width: 95%;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 24px;
  }

  .logo-item {
    margin: 0 15px;
  }

  .gallery-item {
    width: 220px;
    height: 150px;
  }

  .gallery-track {
    gap: 15px;
  }

  .navigation-controls {
    gap: 10px;
  }
}
</style>