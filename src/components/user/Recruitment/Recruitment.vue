<template>
  <div class="recruitment-banner">
    <!-- Banner chính -->
    <div class="banner-container">
      <!-- Background với fallback -->
      <div class="banner-bg">
        <ParticleBackground image-url="/imgs/tuyen-dung-banner.png"

                            alt-text="Mô tả ảnh"
                            :max-particle-size="20"
                            particle-color="#3C4980"
                            line-color="#031358"
                            :line-width="0.5"
        />
        <!-- Fallback background image -->
        <div class="banner-fallback-bg"></div>
      </div>

      <div class="banner-content">
        <!-- Tiêu đề chính -->
        <h1 class="banner-title fade-left">{{ title }}</h1>

        <!-- Subtitle với icon -->
        <div class="subtitle-section fade-left">
          <div class="subtitle-item">
            <img src="/imgs/icon-bling.svg" alt="Icon Bling" class="subtitle-icon">
            <p class="subtitle-text">Gia nhập <strong>Thiên Hà Group</strong>, bạn sẽ có trải nghiệm làm việc tốt hơn!</p>
          </div>

          <div class="subtitle-item fade-left">
            <img src="/imgs/icon-kinh-lup.svg" alt="Icon Kính Lúp" class="subtitle-icon">
            <p class="subtitle-text">Chúng tôi tin rằng đầu tư cho nhân viên chính là cách mang đến cho khách hàng những sản phẩm tốt nhất. Tại THG, luôn có hơn một chiếc ghế trống ẩn chứa những điều thú vị đang chờ đợi bạn. Đừng bỏ lỡ cuộc hẹn hôm nay!</p>
          </div>
        </div>

        <!-- Nút ứng tuyển -->
        <button class="apply-button" @mouseenter="startAnimation" @mouseleave="stopAnimation" @click="scrollToSectionB">
          <span class="button-icon" :class="{ 'animate': isAnimating }"><i class="fa-solid fa-hand-point-right"></i></span>
          <span class="button-text">Ứng tuyển ngay</span>
        </button>

        <!-- Phần nổi bật -->
        <div class="highlight-section fade-up">
          <div
              v-for="(item, index) in highlightItems"
              :key="index"
              class="highlight-item"
              @mouseenter="setActiveItem(index)"
              @mouseleave="setActiveItem(null)"
          >
            <!-- Nền liquid glass -->
            <div class="liquid-glass-background"></div>

            <!-- Trạng thái mặc định - tiêu đề trên ảnh dưới -->
            <div class="highlight-default">
              <h3 class="highlight-title">{{ item.title }}</h3>
              <img :src="item.image" :alt="item.title" class="highlight-image">
            </div>

            <!-- Trạng thái hover - hiện nền trắng và content -->
            <div class="highlight-hover" :class="{ 'active': activeItem === index }">
              <div class="hover-background"></div>
              <div class="hover-content">
                <h3 class="highlight-title-hover">{{ item.title }}</h3>
                <p class="highlight-description">{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="main-content">
    <HeroSection></HeroSection>
    <BenefitsSection></BenefitsSection>
    <JobPositionList></JobPositionList>
    <DepartmentSection></DepartmentSection>
    <PostSection></PostSection>
    <FormSection ref="formSection"></FormSection>
  </div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'
import { removeJsonLd, setJsonLd } from "../../../utils/structuredData.js";
import HeroSection from "./Components/HeroSection.vue";
import BenefitsSection from "./Components/BenefitsSection.vue";
import JobPositionList from "./Components/JobPositionList.vue";
import DepartmentSection from "./Components/DepartmentSection.vue";
import PostSection from "./Components/PostSection.vue";
import FormSection from "./Components/FormSection.vue";
import ParticleBackground from "../ParticleBackground.vue";

// Tiêu đề chính
const title = "Không chỉ là công việc, đây là cơ hội để bạn phát triển sự nghiệp!"

// Trạng thái cho hiệu ứng nút
const isAnimating = ref(false)

// Bắt đầu hiệu ứng
const startAnimation = () => {
  isAnimating.value = true
}

// Dừng hiệu ứng
const stopAnimation = () => {
  isAnimating.value = false
}

// Dữ liệu cho phần nổi bật
const highlightItems = ref([
  {
    title: "Không yêu cầu kinh nghiệm",
    description: "Chỉ cần bạn có tinh thần học hỏi, Thiên Hà Group sẽ giúp bạn phát triển từ con số 0.",
    image: "/imgs/team-work-animate.svg"
  },
  {
    title: "Môi trường trẻ trung, năng động",
    description: "Làm việc cùng đội ngũ nhiệt huyết, sẵn sàng chia sẻ và hỗ trợ nhau mỗi ngày.",
    image: "/imgs/experts-animate.svg"
  },
  {
    title: "Cơ hội thăng tiến rõ ràng",
    description: "Chúng tôi đánh giá dựa trên năng lực và kết quả, không phải thâm niên.",
    image: "/imgs/growth-curve-animate.svg"
  },
  {
    title: "Thu nhập và phúc lợi hấp dẫn",
    description: "Mức thưởng cạnh tranh, chế độ đãi ngộ tốt – xứng đáng với nỗ lực của bạn.",
    image: "/imgs/make-it-rain-animate.svg"
  }
])

// Theo dõi item đang active
const activeItem = ref(null)

// Đặt item active
const setActiveItem = (index) => {
  activeItem.value = index
}

const recruitmentJsonLdId = "jsonld-recruitment-itemlist";

onMounted(() => {
  setJsonLd(recruitmentJsonLdId, {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: "http://localhost:8084/tuyen-dung"
      },
      {
        "@type": "ListItem",
        position: 2,
        url: "http://localhost:8084/tuyen-dung/1"
      },
      {
        "@type": "ListItem",
        position: 3,
        url: "http://localhost:8084/tuyen-dung/2"
      },
      {
        "@type": "ListItem",
        position: 4,
        url: "http://localhost:8084/tuyen-dung/3"
      }
    ]
  });
});


const formSection = ref(null)

const scrollToSectionB = () => {
  formSection.value?.$el.scrollIntoView({ behavior: 'smooth' })
}

//EFFECT

onMounted(() => {
  const animatedElements = document.querySelectorAll(
      ".fade-left, .fade-right, .fade-in, .fade-up"
  );

  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            // Nếu chỉ muốn chạy 1 lần, unobserve sau khi hiện
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5, // phần tử hiện 20% là kích hoạt
      }
  );

  animatedElements.forEach((el) => observer.observe(el));

  // cleanup
  onBeforeUnmount(() => observer.disconnect());
});

onBeforeUnmount(() => removeJsonLd(recruitmentJsonLdId));
</script>

<style scoped>
.main-content {
  margin: 60px 0;
}

.recruitment-banner {
  margin-top: 60px;
  font-family: 'Ubuntu', sans-serif;
  width: 100%;
  position: relative;
}

.banner-container {
  position: relative;
  width: 100%;
  min-height: 90vh; /* Sử dụng viewport height */
  max-height: 900px; /* Giới hạn chiều cao tối đa */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Background container */
.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

/* Fallback background image */
.banner-fallback-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/imgs/tuyen-dung-banner.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Đảm bảo ParticleBackground chiếm toàn bộ không gian */
.banner-bg :deep(.particle-background) {
  width: 100%;
  height: 100%;
}

.banner-content {
  position: relative;
  max-width: 1400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 60px 40px;
  box-sizing: border-box;
  z-index: 1;
}

.banner-title {
  font-size: clamp(28px, 4vw, 48px); /* Responsive font size */
  font-weight: 700;
  color: white;
  margin-bottom: 30px;
  text-align: left;
  line-height: 1.2;
  width: 100%;
}

.subtitle-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  width: 100%;
  max-width: 900px;

}

.subtitle-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.subtitle-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.subtitle-text {
  font-size: clamp(16px, 2vw, 20px); /* Responsive font size */
  color: white;
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
  text-align: justify;
}

.subtitle-text strong {
  font-weight: 700;
}

.apply-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: white;
  color: #031358;
  font-size: clamp(14px, 1.5vw, 17px); /* Responsive font size */
  font-weight: 600;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-bottom: 60px;
}

.apply-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button-icon {
  transition: transform 0.3s ease;
}

.button-icon.animate {
  animation: bounce 0.5s infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(5px);
  }
}

/* Phần nổi bật */
.highlight-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.highlight-item {
  width: 100%;
  height: 250px;
  position: relative;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

/* Nền liquid glass */
.liquid-glass-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.1) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  z-index: 1;
  overflow: hidden;
}

.liquid-glass-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
  );
  transition: left 0.6s ease;
}

.highlight-item:hover .liquid-glass-background::before {
  left: 100%;
}

/* Trạng thái mặc định - tiêu đề trên ảnh dưới */
.highlight-default {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.4s ease;
  padding: 20px;
  box-sizing: border-box;
  gap: 15px;
}

.highlight-title {
  font-size: clamp(16px, 1.5vw, 18px); /* Responsive font size */
  color: white;
  font-weight: 700;
  text-align: center;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;
  line-height: 1.3;
}

.highlight-image {
  height: 120px;
  width: auto;
  max-width: 100%;
  transition: all 0.4s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  object-fit: contain;
}

/* Trạng thái hover */
.highlight-hover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  transition: all 0.4s ease;
}

.highlight-hover.active {
  opacity: 1;
  z-index: 3;
}

/* Nền trắng phủ từ trên xuống */
.hover-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  transition: height 0.4s ease;
}

.highlight-hover.active .hover-background {
  height: 100%;
}

/* Nội dung khi hover */
.hover-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px 20px;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease 0.1s;
}

.highlight-hover.active .hover-content {
  opacity: 1;
  transform: translateY(0);
}

.highlight-title-hover {
  font-size: clamp(16px, 1.5vw, 18px); /* Responsive font size */
  color: #031358;
  font-weight: 700;
  text-align: center;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.highlight-description {
  font-size: clamp(14px, 1.5vw, 15px); /* Responsive font size */
  color: rgba(0, 0, 0, 0.8);
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

/* Hiệu ứng khi hover */
.highlight-item:hover .highlight-default {
  opacity: 0;
  transform: translateY(-10px);
}

.highlight-item:hover .highlight-default .highlight-image {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
}

.highlight-item:hover .highlight-hover {
  opacity: 1;
  z-index: 3;
}

/* Hiệu ứng ánh sáng cho liquid glass */
.highlight-item:hover .liquid-glass-background {
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.08) 25%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.08) 75%,
      rgba(255, 255, 255, 0.15) 100%
  );
  border-color: rgba(255, 255, 255, 0.3);
}

/* ========== RESPONSIVE FIXES ========== */

/* Large Desktop */
@media (min-width: 1600px) {
  .banner-content {
    max-width: 1600px;
  }

  .banner-container {
    max-height: 1000px;
  }
}

/* Desktop */
@media (max-width: 1440px) {

}

/* Tablet */
@media (max-width: 1024px) {


  .banner-content {
    padding: 40px 30px;
  }

  .highlight-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .highlight-item {
    height: 220px;
  }
}

/* Mobile Large */
@media (max-width: 768px) {
  .recruitment-banner {
    margin-top: 60px;
  }

  .banner-container {
    min-height: 600px;
    max-height: none; /* Bỏ giới hạn chiều cao trên mobile */
  }

  .banner-content {
    padding: 30px 20px;
    align-items: center;
    text-align: center;
  }

  .banner-title {
    text-align: center;
  }

  .subtitle-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
  }

  .highlight-section {
    grid-template-columns: 1fr;
    gap: 15px;
    max-width: 400px;
  }

  .highlight-item {
    height: 200px;
  }

  .apply-button {
    margin-bottom: 40px;
  }
}

/* Mobile Small */
@media (max-width: 480px) {
  .banner-container {
    min-height: 500px;
  }

  .banner-content {
    padding: 20px 15px;
  }

  .highlight-item {
    height: 180px;
  }

  .highlight-default {
    padding: 15px;
    gap: 10px;
  }

  .highlight-image {
    height: 80px;
  }

  .hover-content {
    padding: 20px 15px;
  }
}

/* Very small devices */
@media (max-width: 360px) {
  .banner-container {
    min-height: 450px;
  }

  .banner-content {
    padding: 15px 10px;
  }

  .highlight-item {
    height: 160px;
  }
}

/* Fix for landscape mobile */
@media (max-height: 500px) and (orientation: landscape) {
  .banner-container {
    min-height: 400px;
    max-height: 400px;
  }

  .banner-content {
    padding-top: 20px;
    justify-content: flex-start;
  }

  .highlight-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .highlight-item {
    height: 150px;
  }
}

/* Ensure images are responsive */
img {
  max-width: 100%;
  height: auto;
}
</style>

<style>

/* ========== HIỆU ỨNG XUẤT HIỆN ========== */
.fade-left,
.fade-right,
.fade-up,
.fade-in {
  opacity: 0;
  visibility: hidden;
}

.fade-left.show,
.fade-right.show,
.fade-up.show,
.fade-in.show {
  opacity: 1 !important;
  visibility: visible;
  animation-fill-mode: forwards !important;
}

/* Bounce từ trái */
.fade-left.show {
  animation: bounceInLeft 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Bounce từ phải */
.fade-right.show {
  animation: bounceInRight 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Từ dưới lên (fade + bounce) */
.fade-up.show {
  animation: bounceInUp 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Fade nhẹ vô */
.fade-in.show {
  animation: fadeIn 1.2s ease-out;
}

/* Keyframes */
@keyframes bounceInLeft {
  0% {
    opacity: 0;
    transform: translateX(-500px);
  }
  60% {
    opacity: 1;
    transform: translateX(15px);
  }
  80% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes bounceInRight {
  0% {
    opacity: 0;
    transform: translateX(500px);
  }
  60% {
    opacity: 1;
    transform: translateX(-15px);
  }
  80% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes bounceInUp {
  0% {
    opacity: 0;
    transform: translateY(500px);
  }
  60% {
    opacity: 1;
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>