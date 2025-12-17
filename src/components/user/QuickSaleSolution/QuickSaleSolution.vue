<!-- QuickSaleSolution.vue -->
<template>
  <div v-if="isLoaded" class="app-container">
    <!-- Sử dụng component header -->
    <QSaleHeader
        @search="handleHeaderSearch"
        @submit="handleHeaderSubmit"
        @focus="handleHeaderFocus"
        @blur="handleHeaderBlur"
        :section-data="contentData[0]?.contentJson"
    />

    <div class="main-container">
      <h2 class="subtitle">GIẢI PHÁP BÁN NHANH BẤT ĐỘNG SẢN TRONG 30 NGÀY</h2>
      <QuickSaleS1 v-if="contentData[1]" :section-data="contentData[1].contentJson"></QuickSaleS1>
      <!-- Các component khác sẽ bỏ comment khi cần -->
       <div class="section23">
         <img class="right-img" :src="baseImgaeUrl+ imageBg3" alt="">
         <QuickSaleS2 :section-data="contentData[2].contentJson"></QuickSaleS2>
         <QuickSaleS3 :section-data="contentData[3].contentJson"></QuickSaleS3>
       </div>
       <QuickSaleS4 :section-data="contentData[4].contentJson"></QuickSaleS4>
       <QuickSaleS5 :section-data="contentData[5].contentJson"></QuickSaleS5>
       <QuickSaleS6 :section-data="contentData[6].contentJson.section6"></QuickSaleS6>
       <div class="section78">
         <QuickSaleS7 :section-data="contentData[7].contentJson"></QuickSaleS7>
         <QuickSaleS8 :section-data="contentData[8].contentJson"></QuickSaleS8>
       </div>
       <QuickSaleS9 :section-data="contentData[9].contentJson"></QuickSaleS9>
       <QuickSaleS10 :section-data="contentData[10].contentJson"></QuickSaleS10>
       <QSbenefits :section-data="contentData[11].contentJson"></QSbenefits>
    </div>
    <SoldSection title="DỰ ÁN ĐÃ BÁN THÀNH CÔNG NHỜ ĐỊNH GIÁ ĐÚNG"></SoldSection>
    <ContactForm></ContactForm>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import QuickSaleS1 from "./Components/QuickSaleS1.vue";
import QuickSaleS2 from "./Components/QuickSaleS2.vue";
import QuickSaleS3 from "./Components/QuickSaleS3.vue";
import QuickSaleS4 from "./Components/QuickSaleS4.vue";
import QuickSaleS5 from "./Components/QuickSaleS5.vue";
import QuickSaleS6 from "./Components/QuickSaleS6.vue";
import QuickSaleS7 from "./Components/QuickSaleS7.vue";
import QuickSaleS8 from "./Components/QuickSaleS8.vue";
import QuickSaleS9 from "./Components/QuickSaleS9.vue";
import QuickSaleS10 from "./Components/QuickSaleS10.vue";
import SoldSection from "../Home/components/SoldSection.vue";
import ContactForm from "../Home/components/ContactForm.vue";
import QSbenefits from "./Components/QSbenefits.vue";
import QSaleHeader from "./Components/QSaleHeader.vue";

import api from "../../../api/api";
import {baseImgaeUrl} from "../../../assets/js/global.js";

let contentData = ref({});
let isLoaded = ref(false);
let animationObserver = ref(null);
let mutationObserver = ref(null);
const imageBg3= ref('');

const init = async () => {
  try {
    const response = await api.get("/thg/public/cms/contentPage/quickSale");
    console.log("API Response:", response.data);

    contentData.value = response.data.sections.map(sec => {
      let parsedJson;
      try {
        parsedJson = JSON.parse(sec.contentJson);
      } catch (e) {
        // Thử sửa JSON nếu có lỗi
        try {
          // Fix common JSON issues
          let fixedJson = sec.contentJson
              .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix unquoted keys
              .replace(/,\s*}/g, '}') // Remove trailing commas
              .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays

          parsedJson = JSON.parse(fixedJson);
        } catch (e2) {
          console.warn("Could not parse JSON for section:", sec.id);
          parsedJson = {};
        }
      }

      return {
        ...sec,
        contentJson: parsedJson
      };
    });
    imageBg3.value = contentData.value[13].contentJson.image;
    console.log(imageBg3.value)

        console.log("Parsed Content Data:", contentData.value);
  } catch (error) {
    console.error("Error loading content:", error);
    contentData.value = [];
  }
}

// Tách hàm setup observer ra riêng
const setupAnimationObserver = () => {
  // Hủy observer cũ nếu có
  if (animationObserver.value) {
    animationObserver.value.disconnect();
    animationObserver.value = null;
  }

  // Đợi DOM render hoàn tất
  nextTick(() => {
    // Sử dụng :deep selector để tìm phần tử trong component con
    const animatedElements = document.querySelectorAll(
        ".fade-left, .fade-right, .fade-in, .fade-up, [class*='fade-']"
    );

    console.log("Tìm thấy", animatedElements.length, "phần tử để animate");

    if (animatedElements.length === 0) {
      console.warn("Không tìm thấy phần tử animation nào");
      return;
    }

    animationObserver.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Thêm class show khi vào viewport
              entry.target.classList.add("show");
              // Dừng quan sát sau khi đã hiển thị
              animationObserver.value.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15, // Giảm threshold để dễ trigger hơn
          rootMargin: "80px 0px -30px 0px" // Trigger sớm hơn
        }
    );

    animatedElements.forEach((el) => {
      // Bỏ qua nếu đã có class show (tránh trigger lại)
      if (!el.classList.contains('show')) {
        animationObserver.value.observe(el);
      }
    });
  });
};

// Thêm mutation observer để theo dõi DOM changes
const setupMutationObserver = () => {
  // Hủy observer cũ nếu có
  if (mutationObserver.value) {
    mutationObserver.value.disconnect();
    mutationObserver.value = null;
  }

  const mainContainer = document.querySelector('.main-container');
  if (!mainContainer) return;

  mutationObserver.value = new MutationObserver((mutations) => {
    let shouldUpdate = false;

    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) {
      // Đợi một chút để DOM ổn định rồi setup lại animation
      setTimeout(setupAnimationObserver, 150);
    }
  });

  mutationObserver.value.observe(mainContainer, {
    childList: true,
    subtree: true
  });
};

onMounted(async () => {
  try {
    await init();
    isLoaded.value = true;

    // Chờ một chút để đảm bảo tất cả component con đã render
    await nextTick();

    // Setup observers
    setupAnimationObserver();
    setupMutationObserver();

    // Setup lại khi có thay đổi kích thước
    window.addEventListener('resize', setupAnimationObserver);
    window.addEventListener('orientationchange', setupAnimationObserver);
  } catch (error) {
    console.error("Error in onMounted:", error);
  }
});

onBeforeUnmount(() => {
  // Hủy observers khi component unmount
  if (animationObserver.value) {
    animationObserver.value.disconnect();
    animationObserver.value = null;
  }

  if (mutationObserver.value) {
    mutationObserver.value.disconnect();
    mutationObserver.value = null;
  }

  // Xóa event listeners
  window.removeEventListener('resize', setupAnimationObserver);
  window.removeEventListener('orientationchange', setupAnimationObserver);
});

// Xử lý các event từ header
const handleHeaderSearch = (query) => {
  console.log('Search query:', query);
  // Xử lý logic tìm kiếm
}

const handleHeaderSubmit = (data) => {
  console.log('Submit data:', data);
  // Xử lý logic submit
}

const handleHeaderFocus = () => {
  console.log('Input focused');
}

const handleHeaderBlur = () => {
  console.log('Input blurred');
}
</script>

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.subtitle {
  font-size: 40px;
  color: #031358;
  font-weight: 700;
  text-align: center;
  margin: 30px auto;
  margin-bottom: 100px;
}

.section23 {
  position: relative;
  width: 100%;
}

.section23 > .right-img {
  position: absolute;
  width: auto;
  height: 70%;
  z-index: 0;
  bottom: 0;
  left: -260px;
  opacity: 0.9;
  transform: scaleX(-1);
}

.section78 {
  position: relative;
}

.section78 img {
  position: absolute;
  opacity: 0.9;
  width: 70%;
  left: -700px;
  transform: scaleX(-1);
}

/* Main Container Styles */
.main-container {
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 100px;
  position: relative;
  z-index: 2;
}

/* Thêm transition cho các phần tử animation */
.fade-left, .fade-right, .fade-up, .fade-in {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 1400px) {
  .section23 > .right-img {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-container {
    margin: 80px auto 0;
    padding: 0 15px;
  }

  .subtitle {
    font-size: 28px;
    margin-bottom: 60px;
  }
}

/* ========== ANIMATION STYLES (SCOPED WITH DEEP SELECTORS) ========== */
/* Hiệu ứng xuất hiện - dùng deep selector để ảnh hưởng đến component con */
:deep(.fade-left),
:deep(.fade-right),
:deep(.fade-up),
:deep(.fade-in) {
  opacity: 0;
  visibility: hidden;
}

:deep(.fade-left.show),
:deep(.fade-right.show),
:deep(.fade-up.show),
:deep(.fade-in.show) {
  opacity: 1 !important;
  visibility: visible !important;
  animation-fill-mode: forwards !important;
}

/* Fallback cho trường hợp animation không chạy */
:deep(.fade-left.show) {
  transform: translateX(0) !important;
}

:deep(.fade-right.show) {
  transform: translateX(0) !important;
}

:deep(.fade-up.show) {
  transform: translateY(0) !important;
}

:deep(.fade-in.show) {
  transform: scale(1) !important;
}

/* Bounce từ trái */
:deep(.fade-left.show) {
  animation: bounceInLeft 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Bounce từ phải */
:deep(.fade-right.show) {
  animation: bounceInRight 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Từ dưới lên (fade + bounce) */
:deep(.fade-up.show) {
  animation: bounceInUp 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Fade nhẹ vô */
:deep(.fade-in.show) {
  animation: fadeIn 1.2s ease-out;
}

/* Keyframes - phải đặt trong scoped vì keyframes là global */
@keyframes bounceInLeft {
  0% {
    opacity: 0;
    transform: translateX(-300px);
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
    transform: translateX(300px);
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
    transform: translateY(150px);
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

/* Debug styles - có thể xóa sau khi fix xong */
:deep(.debug-animation) {
  border: 2px solid red !important;
  background-color: rgba(255, 0, 0, 0.1) !important;
}
</style>