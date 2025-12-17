<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import gsap from 'gsap'
import { baseImgaeUrl } from '../../../../assets/js/global';

const props = defineProps({
  content: Object
});

interface Customer {
  baseImage: string;
  foregroundImage: string;
  text: string;
  name: string;
}

// ====== CẤU HÌNH MẶC ĐỊNH ======
const defaultConfig = {
  // Tiêu đề
  title: "KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI",

  // Màu sắc chủ đạo
  colors: {
    primary: "#031358",
    secondary: "#f8f9ff",
    textDark: "#000000",
    textLight: "#ffffff",
    buttonBg: "transparent",
    buttonHoverBg: "rgba(3, 19, 88, 0.05)",
    buttonDisabled: "rgba(3, 19, 88, 0.3)"
  },

  // Font chữ
  fonts: {
    titleSize: "33px",
    titleWeight: "600",
    textSize: "17px",
    authorSize: "20px",
    authorWeight: "600",
    buttonSize: "18px"
  },

  // Kích thước & khoảng cách
  spacing: {
    containerPadding: "60px 20px",
    reviewBoxPadding: "25px",
    bubblePadding: "25px",
    gapColumns: "40px",
    buttonPadding: "8px",
    buttonMarginTop: "20px",
    buttonGap: "10px"
  },

  // Hiệu ứng border
  borderEffects: {
    borderRadius: "20px",
    shadow: "0 10px 30px rgba(3, 19, 88, 0.1)",
    gradientColors: "rgba(3, 19, 88, 0.1), rgba(194, 203, 240, 0.3), rgba(3, 19, 88, 0.1)"
  },

  // Khách hàng (có thể thêm/xóa/sửa dễ dàng)
  customers: [
    {
      baseImage: '/imgs/khach1.png',
      foregroundImage: '/imgs/khach1rb.png',
      text: 'Tôi đã bán nhà của tôi hơn 1 năm không có khách hàng nào quan tâm, nhờ biết đến Thiên Hà Group qua kênh Facebook tôi đã bán nhanh bất động sản chỉ trong 30 ngày.',
      name: 'Anh Lê Văn Thiện (Chủ nhà)'
    },
    {
      baseImage: '/imgs/khach2.png',
      foregroundImage: '/imgs/khach2rb.png',
      text: 'Tôi bán nhà từ năm 2020 giá còn rất cao, nhờ sự tư vấn tận tình của Thiên Hà Group tôi đã nắm được giá trị bất động sản của mình. Nhờ đó tôi đã bán được nhanh hơn chỉ trong 27 ngày.',
      name: 'Chị Nguyễn Thị Lan (Nhà đầu tư)'
    },
    {
      baseImage: '/imgs/khach3.png',
      foregroundImage: '/imgs/khach3rb.png',
      text: 'Trong quá trình bán đất tại Đà Lạt, tôi bị quá nhiều môi giới báo giá ảo nhằm kéo giá tôi xuống, một phần tôi cũng đưa giá quá cao. Sau khi biết đến Thiên Hà Group qua các trang báo chí, tôi đã hợp tác và bán thành công bất động sản của mình.',
      name: 'Anh Trần Quang Huy (Chủ đất)'
    }
  ],

  // Kích thước ảnh
  imageSizes: {
    containerHeight: "400px",
    baseImageHeight: "330px",
    foregroundImageHeight: "400px"
  },

  // Hiệu ứng animation
  animation: {
    borderLightSpeed: 3, // giây
    borderLightColors: "rgba(194, 203, 240, 0.8), rgba(3, 19, 88, 0.6), rgba(194, 203, 240, 0.8)"
  },

  // Cấu hình nút điều hướng
  navigation: {
    position: "right",
    buttonSize: "40px",
    buttonBorderRadius: "50%",
    buttonColor: "#031358",
    buttonHoverColor: "#031358",
    buttonBgColor: "transparent",
    buttonHoverBgColor: "rgba(3, 19, 88, 0.05)",
    buttonDisabledColor: "rgba(3, 19, 88, 0.3)",
    iconSize: "18px",
    showDots: true,
    dotsSize: "8px",
    dotsActiveSize: "10px",
    dotsColor: "rgba(3, 19, 88, 0.2)",
    dotsActiveColor: "#031358",
    dotsSpacing: "6px"
  },

  // ====== CẤU HÌNH RESPONSIVE CHO ĐIỆN THOẠI ======
  responsive: {
    tablet: {
      titleSize: "26px",
      containerPadding: "40px 15px",
      imageHeight: "300px",
      baseImageHeight: "250px",
      foregroundImageHeight: "300px",
      reviewBoxPadding: "20px",
      bubblePadding: "20px",
      reviewTextSize: "16px",
      authorSize: "18px",
      buttonSize: "36px",
      iconSize: "16px",
      buttonPosition: "center",
      dotsSize: "7px",
      dotsActiveSize: "9px"
    },

    mobile: {
      titleSize: "22px",
      containerPadding: "30px 10px",
      imageHeight: "250px",
      baseImageHeight: "200px",
      foregroundImageHeight: "250px",
      reviewBoxPadding: "15px",
      bubblePadding: "15px",
      reviewTextSize: "15px",
      authorSize: "16px",
      buttonSize: "32px",
      iconSize: "14px",
      buttonPosition: "center",
      dotsSize: "6px",
      dotsActiveSize: "8px",
      dotsSpacing: "5px"
    },

    smallMobile: {
      titleSize: "20px",
      containerPadding: "25px 8px",
      imageHeight: "200px",
      baseImageHeight: "160px",
      foregroundImageHeight: "200px",
      reviewBoxPadding: "12px",
      bubblePadding: "12px",
      reviewTextSize: "14px",
      authorSize: "15px",
      buttonSize: "30px",
      iconSize: "13px",
      dotsSize: "5px",
      dotsActiveSize: "7px"
    },

    xSmallMobile: {
      titleSize: "18px",
      imageHeight: "180px",
      baseImageHeight: "140px",
      foregroundImageHeight: "180px",
      buttonSize: "28px",
      iconSize: "12px"
    }
  }
};

// Sử dụng computed để đảm bảo cmsConfig luôn có giá trị hợp lệ
const cmsConfig = computed(() => {
  if (props.content && props.content.contentJson) {
    return {
      ...defaultConfig,
      ...props.content.contentJson,
      // Merge nested objects để tránh mất cấu trúc
      colors: { ...defaultConfig.colors, ...(props.content.contentJson.colors || {}) },
      fonts: { ...defaultConfig.fonts, ...(props.content.contentJson.fonts || {}) },
      spacing: { ...defaultConfig.spacing, ...(props.content.contentJson.spacing || {}) },
      borderEffects: { ...defaultConfig.borderEffects, ...(props.content.contentJson.borderEffects || {}) },
      imageSizes: { ...defaultConfig.imageSizes, ...(props.content.contentJson.imageSizes || {}) },
      animation: { ...defaultConfig.animation, ...(props.content.contentJson.animation || {}) },
      navigation: { ...defaultConfig.navigation, ...(props.content.contentJson.navigation || {}) },
      responsive: { ...defaultConfig.responsive, ...(props.content.contentJson.responsive || {}) },
      // Đảm bảo customers luôn là mảng
      customers: props.content.contentJson.customers || defaultConfig.customers
    };
  }
  return defaultConfig;
});

const customers = computed(() => cmsConfig.value.customers || []);

const currentIndex = ref(0);
const isAnimating = ref(false);

const baseImageRef = ref<HTMLImageElement | null>(null);
const foregroundImageRef = ref<HTMLImageElement | null>(null);
const reviewTextRef = ref<HTMLDivElement | null>(null);
const reviewAuthorRef = ref<HTMLDivElement | null>(null);
const reviewBoxRef = ref<HTMLDivElement | null>(null);

const currentCustomer = computed(() => {
  return customers.value[currentIndex.value] || customers.value[0];
});

onMounted(() => {
  if (customers.value.length > 0) {
    animateIn();
    animateBorderLight();
  }
});

const animateIn = () => {
  const tl = gsap.timeline();

  tl.fromTo(baseImageRef.value,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
  );

  tl.fromTo(foregroundImageRef.value,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
  );

  tl.to(foregroundImageRef.value,
      { scale: 1.25, duration: 0.5, ease: 'power2.out' },
      '+=0.1'
  );

  tl.fromTo(reviewTextRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.3'
  );

  tl.fromTo(reviewAuthorRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4 },
      '-=0.2'
  );
};

const animateBorderLight = () => {
  if (!reviewBoxRef.value) return;

  const borderLight = document.createElement('div');
  borderLight.className = 'border-light';
  reviewBoxRef.value.appendChild(borderLight);

  gsap.to(borderLight, {
    rotation: 360,
    duration: cmsConfig.value.animation.borderLightSpeed,
    repeat: -1,
    ease: 'linear'
  });
};

const switchCustomer = (direction: 'next' | 'prev') => {
  if (isAnimating.value || customers.value.length === 0) return;

  isAnimating.value = true;

  const tl = gsap.timeline({
    onComplete: () => {
      if (direction === 'next') {
        currentIndex.value = (currentIndex.value + 1) % customers.value.length;
      } else {
        currentIndex.value = (currentIndex.value - 1 + customers.value.length) % customers.value.length;
      }

      gsap.set([baseImageRef.value, foregroundImageRef.value], { y: 100, opacity: 0, scale: 1 });
      gsap.set([reviewTextRef.value, reviewAuthorRef.value], { opacity: 0, y: 20 });

      animateIn();
      isAnimating.value = false;
    }
  });

  tl.to([reviewTextRef.value, reviewAuthorRef.value], {
    opacity: 0,
    y: -20,
    duration: 0.3,
    stagger: 0.1
  });

  tl.to(foregroundImageRef.value, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.in'
  }, '-=0.2');

  tl.to([baseImageRef.value, foregroundImageRef.value], {
    y: -100,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
    stagger: 0.1
  }, '-=0.2');
};

const nextCustomer = () => switchCustomer('next');
const prevCustomer = () => switchCustomer('prev');

const goToCustomer = (index: number) => {
  if (isAnimating.value || index === currentIndex.value || customers.value.length === 0) return;

  isAnimating.value = true;

  const tl = gsap.timeline({
    onComplete: () => {
      currentIndex.value = index;

      gsap.set([baseImageRef.value, foregroundImageRef.value], { y: 100, opacity: 0, scale: 1 });
      gsap.set([reviewTextRef.value, reviewAuthorRef.value], { opacity: 0, y: 20 });

      animateIn();
      isAnimating.value = false;
    }
  });

  tl.to([reviewTextRef.value, reviewAuthorRef.value], {
    opacity: 0,
    y: -20,
    duration: 0.3,
    stagger: 0.1
  });

  tl.to(foregroundImageRef.value, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.in'
  }, '-=0.2');

  tl.to([baseImageRef.value, foregroundImageRef.value], {
    y: -100,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.in',
    stagger: 0.1
  }, '-=0.2');
};
</script>
<template>
  <div class="customer-reviews">
    <h2 class="title">{{ cmsConfig.title }}</h2>
    <div class="content">
      <div class="left-column">
        <div class="image-container">
          <img
              ref="baseImageRef"
              :src="baseImgaeUrl+currentCustomer.baseImage"
              :alt="currentCustomer.name"
              class="base-image"
          />
          <img
              ref="foregroundImageRef"
              :src="baseImgaeUrl+currentCustomer.foregroundImage"
              :alt="currentCustomer.name"
              class="foreground-image"
          />
        </div>
      </div>

      <div class="right-column">
        <div ref="reviewBoxRef" class="review-box">
          <div class="message-bubble">
            <div class="bubble-tail"></div>
            <div class="review-content">
              <p ref="reviewTextRef" class="review-text">"{{ currentCustomer.text }}"</p>
              <p ref="reviewAuthorRef" class="review-author">{{ currentCustomer.name }}</p>
            </div>
          </div>

          <!-- Dots Navigation (luôn canh giữa) -->
          <div v-if="cmsConfig.navigation.showDots" class="dots-navigation">
            <button
                v-for="(customer, index) in customers"
                :key="index"
                class="dot-button"
                :class="{ active: index === currentIndex }"
                @click="goToCustomer(index)"
                :disabled="isAnimating || index === currentIndex"
                :aria-label="`Go to review ${index + 1}`"
            ></button>
          </div>

          <!-- Navigation Container -->
          <div class="navigation-container">
            <!-- Navigation Buttons -->
            <div class="navigation-buttons">
              <button
                  @click="prevCustomer"
                  class="nav-button"
                  :disabled="isAnimating"
                  :aria-label="'Previous review'"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                  @click="nextCustomer"
                  class="nav-button"
                  :disabled="isAnimating"
                  :aria-label="'Next review'"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-reviews {
  max-width: 1400px;
  margin: 0 auto;
  padding: v-bind('cmsConfig.spacing.containerPadding');
  font-family: 'Ubuntu', sans-serif;
}

.title {
  font-size: v-bind('cmsConfig.fonts.titleSize');
  font-weight: v-bind('cmsConfig.fonts.titleWeight');
  color: v-bind('cmsConfig.colors.primary');
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 50px;
  letter-spacing: 0.5px;
}

.content {
  display: flex;
  gap: v-bind('cmsConfig.spacing.gapColumns');
  align-items: center;
}

.left-column {
  flex: 0 0 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: v-bind('cmsConfig.imageSizes.containerHeight');
  width: 30%;
}

.image-container {
  position: relative;
  width: 100%;
  height: v-bind('cmsConfig.imageSizes.containerHeight');
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: visible;
}

.base-image,
.foreground-image {
  position: absolute;
  bottom: 0;
  left: 30%;
  transform: translateX(-50%);
  max-width: 100%;
  height: auto;
}

.base-image {
  max-height: v-bind('cmsConfig.imageSizes.baseImageHeight');
  z-index: 1;
}

.foreground-image {
  max-height: v-bind('cmsConfig.imageSizes.foregroundImageHeight');
  z-index: 2;
  transform-origin: bottom center;
}

.right-column {
  width: 70%;
}

.review-box {
  position: relative;
  border-radius: v-bind('cmsConfig.borderEffects.borderRadius');
  padding: v-bind('cmsConfig.spacing.reviewBoxPadding');
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, v-bind('cmsConfig.colors.secondary') 0%, #ffffff 100%);
  box-shadow: v-bind('cmsConfig.borderEffects.shadow');
  overflow: hidden;
}

.message-bubble {
  position: relative;
  background: white;
  border-radius: 18px;
  padding: v-bind('cmsConfig.spacing.bubblePadding');
  box-shadow: 0 4px 15px rgba(3, 19, 88, 0.08);
}

.bubble-tail {
  position: absolute;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right: 15px solid white;
}

.review-content {
  flex: 1;
}

.review-text {
  font-size: v-bind('cmsConfig.fonts.textSize');
  line-height: 1.7;
  color: v-bind('cmsConfig.colors.textDark');
  margin-bottom: 20px;
  text-align: justify;
}

.review-author {
  font-size: v-bind('cmsConfig.fonts.authorSize');
  font-weight: v-bind('cmsConfig.fonts.authorWeight');
  color: v-bind('cmsConfig.colors.primary');
  margin-top: 15px;
}

/* Dots Navigation (Luôn canh giữa) */
.dots-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: v-bind('cmsConfig.navigation.dotsSpacing');
  margin: 15px 0;
}

.dot-button {
  width: v-bind('cmsConfig.navigation.dotsSize');
  height: v-bind('cmsConfig.navigation.dotsSize');
  border-radius: 50%;
  border: none;
  background-color: v-bind('cmsConfig.navigation.dotsColor');
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.dot-button.active {
  background-color: v-bind('cmsConfig.navigation.dotsActiveColor');
  width: v-bind('cmsConfig.navigation.dotsActiveSize');
  height: v-bind('cmsConfig.navigation.dotsActiveSize');
}

.dot-button:hover:not(:disabled) {
  transform: scale(1.2);
}

.dot-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Navigation Styles */
.navigation-container {
  display: flex;
  margin-top: v-bind('cmsConfig.spacing.buttonMarginTop');
  justify-content: v-bind('cmsConfig.navigation.position');
}

.navigation-buttons {
  display: flex;
  gap: v-bind('cmsConfig.spacing.buttonGap');
}

.nav-button {
  background-color: v-bind('cmsConfig.navigation.buttonBgColor');
  border: none;
  color: v-bind('cmsConfig.navigation.buttonColor');
  cursor: pointer;
  padding: v-bind('cmsConfig.spacing.buttonPadding');
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: v-bind('cmsConfig.navigation.buttonSize');
  height: v-bind('cmsConfig.navigation.buttonSize');
  border-radius: v-bind('cmsConfig.navigation.buttonBorderRadius');
  font-size: v-bind('cmsConfig.navigation.iconSize');
}

.nav-button:hover:not(:disabled) {
  opacity: 0.8;
  background-color: v-bind('cmsConfig.navigation.buttonHoverBgColor');
  color: v-bind('cmsConfig.navigation.buttonHoverColor');
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  color: v-bind('cmsConfig.navigation.buttonDisabledColor');
}

/* Hiệu ứng tia sáng chạy quanh viền */
.border-light {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: calc(v-bind('cmsConfig.borderEffects.borderRadius') + 2px);
  background: linear-gradient(90deg,
  transparent,
  v-bind('cmsConfig.animation.borderLightColors'),
  transparent);
  z-index: 0;
  pointer-events: none;
  filter: blur(1px);
}

.review-box::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: calc(v-bind('cmsConfig.borderEffects.borderRadius') + 2px);
  background: linear-gradient(135deg,
  v-bind('cmsConfig.borderEffects.gradientColors'));
  z-index: -1;
  opacity: 0.7;
}

/* ====== RESPONSIVE STYLES ====== */

/* Tablet: max-width: 992px */
@media (max-width: 992px) {
  .customer-reviews {
    padding: v-bind('cmsConfig.responsive.tablet.containerPadding');
  }

  .title {
    font-size: v-bind('cmsConfig.responsive.tablet.titleSize');
    margin-bottom: 30px;
  }

  .content {
    flex-direction: column;
    gap: 30px;
  }

  .left-column,
  .right-column {
    flex: 1 1 100%;
    width: 100%;
  }

  .left-column {
    min-height: v-bind('cmsConfig.responsive.tablet.imageHeight');
  }

  .image-container {
    height: v-bind('cmsConfig.responsive.tablet.imageHeight');
    align-items: center;
  }

  .base-image,
  .foreground-image {
    left: 40%;
  }

  .base-image {
    max-height: v-bind('cmsConfig.responsive.tablet.baseImageHeight');
  }

  .foreground-image {
    max-height: v-bind('cmsConfig.responsive.tablet.foregroundImageHeight');
  }

  .bubble-tail {
    left: 50%;
    top: -15px;
    transform: translateX(-50%) rotate(90deg);
  }

  .review-box {
    padding: v-bind('cmsConfig.responsive.tablet.reviewBoxPadding');
    min-height: 200px;
  }

  .message-bubble {
    padding: v-bind('cmsConfig.responsive.tablet.bubblePadding');
  }

  .review-text {
    font-size: v-bind('cmsConfig.responsive.tablet.reviewTextSize');
    line-height: 1.6;
  }

  .review-author {
    font-size: v-bind('cmsConfig.responsive.tablet.authorSize');
  }

  .navigation-container {
    justify-content: v-bind('cmsConfig.responsive.tablet.buttonPosition');
  }

  .nav-button {
    width: v-bind('cmsConfig.responsive.tablet.buttonSize');
    height: v-bind('cmsConfig.responsive.tablet.buttonSize');
    font-size: v-bind('cmsConfig.responsive.tablet.iconSize');
  }

  .dots-navigation {
    margin: 12px 0;
  }

  .dot-button {
    width: v-bind('cmsConfig.responsive.tablet.dotsSize');
    height: v-bind('cmsConfig.responsive.tablet.dotsSize');
  }

  .dot-button.active {
    width: v-bind('cmsConfig.responsive.tablet.dotsActiveSize');
    height: v-bind('cmsConfig.responsive.tablet.dotsActiveSize');
  }
}

/* Mobile: max-width: 768px */
@media (max-width: 768px) {
  .customer-reviews {
    padding: v-bind('cmsConfig.responsive.mobile.containerPadding');
  }

  .title {
    font-size: v-bind('cmsConfig.responsive.mobile.titleSize');
    margin-bottom: 25px;
  }

  .left-column {
    min-height: v-bind('cmsConfig.responsive.mobile.imageHeight');
  }

  .image-container {
    height: v-bind('cmsConfig.responsive.mobile.imageHeight');
  }

  .base-image {
    max-height: v-bind('cmsConfig.responsive.mobile.baseImageHeight');
  }

  .foreground-image {
    max-height: v-bind('cmsConfig.responsive.mobile.foregroundImageHeight');
  }

  .review-box {
    padding: v-bind('cmsConfig.responsive.mobile.reviewBoxPadding');
  }

  .message-bubble {
    padding: v-bind('cmsConfig.responsive.mobile.bubblePadding');
  }

  .review-text {
    font-size: v-bind('cmsConfig.responsive.mobile.reviewTextSize');
    line-height: 1.5;
    margin-bottom: 15px;
  }

  .review-author {
    font-size: v-bind('cmsConfig.responsive.mobile.authorSize');
    margin-top: 10px;
  }

  .navigation-container {
    margin-top: 10px;
    justify-content: v-bind('cmsConfig.responsive.mobile.buttonPosition');
  }

  .nav-button {
    width: v-bind('cmsConfig.responsive.mobile.buttonSize');
    height: v-bind('cmsConfig.responsive.mobile.buttonSize');
    font-size: v-bind('cmsConfig.responsive.mobile.iconSize');
  }

  .dots-navigation {
    margin: 10px 0;
    gap: v-bind('cmsConfig.responsive.mobile.dotsSpacing');
  }

  .dot-button {
    width: v-bind('cmsConfig.responsive.mobile.dotsSize');
    height: v-bind('cmsConfig.responsive.mobile.dotsSize');
  }

  .dot-button.active {
    width: v-bind('cmsConfig.responsive.mobile.dotsActiveSize');
    height: v-bind('cmsConfig.responsive.mobile.dotsActiveSize');
  }
}

/* Small Mobile: max-width: 576px */
@media (max-width: 576px) {
  .customer-reviews {
    padding: v-bind('cmsConfig.responsive.smallMobile.containerPadding');
  }

  .title {
    font-size: v-bind('cmsConfig.responsive.smallMobile.titleSize');
    margin-bottom: 20px;
  }

  .left-column {
    min-height: v-bind('cmsConfig.responsive.smallMobile.imageHeight');
  }

  .image-container {
    height: v-bind('cmsConfig.responsive.smallMobile.imageHeight');
  }

  .base-image {
    max-height: v-bind('cmsConfig.responsive.smallMobile.baseImageHeight');
  }

  .foreground-image {
    max-height: v-bind('cmsConfig.responsive.smallMobile.foregroundImageHeight');
  }

  .review-box {
    padding: v-bind('cmsConfig.responsive.smallMobile.reviewBoxPadding');
  }

  .message-bubble {
    padding: v-bind('cmsConfig.responsive.smallMobile.bubblePadding');
  }

  .review-text {
    font-size: v-bind('cmsConfig.responsive.smallMobile.reviewTextSize');
    line-height: 1.4;
  }

  .review-author {
    font-size: v-bind('cmsConfig.responsive.smallMobile.authorSize');
  }

  .nav-button {
    width: v-bind('cmsConfig.responsive.smallMobile.buttonSize');
    height: v-bind('cmsConfig.responsive.smallMobile.buttonSize');
    font-size: v-bind('cmsConfig.responsive.smallMobile.iconSize');
  }

  .dots-navigation {
    margin: 8px 0;
  }

  .dot-button {
    width: v-bind('cmsConfig.responsive.smallMobile.dotsSize');
    height: v-bind('cmsConfig.responsive.smallMobile.dotsSize');
  }

  .dot-button.active {
    width: v-bind('cmsConfig.responsive.smallMobile.dotsActiveSize');
    height: v-bind('cmsConfig.responsive.smallMobile.dotsActiveSize');
  }
}

/* X-Small Mobile: max-width: 400px */
@media (max-width: 400px) {
  .title {
    font-size: v-bind('cmsConfig.responsive.xSmallMobile.titleSize');
  }

  .left-column {
    min-height: v-bind('cmsConfig.responsive.xSmallMobile.imageHeight');
  }

  .image-container {
    height: v-bind('cmsConfig.responsive.xSmallMobile.imageHeight');
  }

  .base-image {
    max-height: v-bind('cmsConfig.responsive.xSmallMobile.baseImageHeight');
  }

  .foreground-image {
    max-height: v-bind('cmsConfig.responsive.xSmallMobile.foregroundImageHeight');
  }

  .nav-button {
    width: v-bind('cmsConfig.responsive.xSmallMobile.buttonSize');
    height: v-bind('cmsConfig.responsive.xSmallMobile.buttonSize');
    font-size: v-bind('cmsConfig.responsive.xSmallMobile.iconSize');
  }

  .dots-navigation {
    margin: 6px 0;
  }
}
</style>