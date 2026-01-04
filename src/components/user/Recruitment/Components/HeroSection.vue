<template>
  <section class="hero-section">
    <div class="hero-content">
      <!-- Hình chữ nhật chứa logo -->
      <div class="logo-container fade-left" :style="logoContainerStyle">
        <img
            src="/imgs/logoTHG.png"
            :alt="config.logo.alt"
            class="company-logo"
            :style="logoStyle"
        >
      </div>

      <!-- Ô chứa text -->
      <div class="text-container" :style="textContainerStyle">
        <div class="text-content fade-right rich-text-editor-wrapper" :style="textContentStyle">
          <div class="tiptap" v-html="config.description">
          </div>
        </div>

        <!-- Hình ảnh bên phải -->
        <img
            :src="baseImgaeUrl+config.heroImage.src"
            :alt="config.heroImage.alt"
            class="hero-image fade-right"
            :style="heroImageStyle"
        >
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import ApplyButton from "./ApplyButton.vue"
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Config object
let config = {
  // Logo settings
  logo: {
    src: "/imgs/logoTHG.png",
    alt: "Thiên Hà Group Logo"
  },


  // Company info
  companyName: "Thiên Hà Group",
  description: "tự hào là đơn vị hoạt động trong lĩnh vực mua — bán — đầu tư bất động sản với bề dày kinh nghiệm và phương châm 'Bất Động Sản Thật — Giá Trị Thật'. Chúng tôi nổi bật với giải pháp bán gấp bất động sản siêu tốc và cam kết tối ưu hoá giá trị cho khách hàng, góp phần tạo ra hàng nghìn giao dịch thành công. Nếu ông là người năng động, thích môi trường mục tiêu rõ ràng và muốn cùng đội ngũ hiện thực hoá những giao dịch lớn — hãy gia nhập Thiên Hà Group ngay hôm nay; chúng tôi có chế độ đãi ngộ cạnh tranh, lộ trình thăng tiến rõ ràng và phúc lợi theo quy định.",

  // Hero image settings
  heroImage: {
    src: "/imgs/building-hero-section.png",
    alt: "Thiên Hà Group"
  },

  // Colors
  colors: {
    primary: "#031358",
    secondary: "#0827AF",
    white: "#FFFFFF"
  },

  // Container styles
  container: {
    maxWidth: "1400px",
    padding: "0 20px"
  },

  // Logo container styles
  logoContainer: {
    width: "900px",
    height: "500px",
    borderRadius: "10px",
    paddingTop: "25px"
  },

  // Text container styles
  textContainer: {
    marginLeft: "200px",
    paddingRight: "320px",
    transform: "translateY(-150px)",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)"
  },

  // Text content styles
  textContent: {
    fontSize: "20px",
    padding: "40px",
    lineHeight: "1.6"
  },

  // Hero image styles
  heroImageStyle: {
    maxWidth: "400px",
    height: "700px"
  },

  // Responsive breakpoints
  breakpoints: {
    desktop: "1200px",
    tablet: "800px"
  }
}

const props = defineProps({
  sectionData: Object
})

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã nhận props từ cha", config);
}

// Computed styles
const logoContainerStyle = computed(() => ({
  width: config.logoContainer.width,
  height: config.logoContainer.height,
  background: `linear-gradient(to right, ${config.colors.primary}, ${config.colors.secondary}, ${config.colors.primary})`,
  borderRadius: config.logoContainer.borderRadius,
  paddingTop: config.logoContainer.paddingTop
}))

const logoStyle = computed(() => ({
  maxWidth: "33%"
}))

const textContainerStyle = computed(() => ({
  marginLeft: config.textContainer.marginLeft,
  paddingRight: config.textContainer.paddingRight,
  transform: config.textContainer.transform,
  backgroundColor: config.colors.white,
  borderRadius: config.textContainer.borderRadius,
  boxShadow: config.textContainer.boxShadow
}))

const textContentStyle = computed(() => ({
  color: config.colors.primary,
  fontSize: config.textContent.fontSize,
  padding: config.textContent.padding,
  lineHeight: config.textContent.lineHeight
}))

const heroImageStyle = computed(() => ({
  maxWidth: config.heroImageStyle.maxWidth,
  height: config.heroImageStyle.height
}))
</script>

<style scoped>
.apply-btn {
  position: absolute;
  right: 0;
  bottom: 0;
}

.hero-section {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}

.hero-content {
  margin-top: 20px;
  max-width: v-bind('config.container.maxWidth');
  width: 100%;
  position: relative;
  padding: v-bind('config.container.padding');
}

/* Hình chữ nhật chứa logo */
.logo-container {
  border-radius: v-bind('config.logoContainer.borderRadius');
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.company-logo {
  object-fit: contain;
}

/* Ô chứa text */
.text-container {
  background-color: v-bind('config.colors.white');
  border-radius: v-bind('config.textContainer.borderRadius');
  box-shadow: v-bind('config.textContainer.boxShadow');
}

.text-content {
  color: v-bind('config.colors.primary');
  font-family: 'Ubuntu', sans-serif;
  position: relative;
  overflow: hidden;
  text-align: justify;
}

.text-content::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 70%;
  background-color: v-bind('config.colors.secondary');
}

.company-name {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 24px;
  font-weight: 800;
}

.company-description {
  margin: 0;
}

/* Hình ảnh bên phải */
.hero-image {
  position: absolute;
  right: 0;
  bottom: -10px;
  z-index: 2;
  transform: scaleX(-1);
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .text-container {
    margin-left: 100px !important;
    padding-right: 250px !important;
  }

  .hero-image {
    max-width: 300px !important;
  }
}

@media (max-width: 800px) {
  .hero-section {
    padding-bottom: 50px !important;
  }

  .logo-container {
    width: 90% !important;
    height: 300px !important;
    display: flex !important;
    align-items: center !important;
    justify-items: center !important;
  }

  .text-container {
    margin-left: 20px !important;
    padding: 0 !important;
    transform: translateY(-150px) !important;
  }

  .text-content {
    font-size: 16px !important;
    padding: 20px !important;
  }

  .hero-image {
    top: -250px !important;
    max-width: 250px !important;
    margin: 0 auto !important;
    display: none !important;
  }

  .text-container {
    transform: translateY(0) !important;
    display: block !important;
    margin: 0 auto !important;
  }

  .logo-container {
    width: 100% !important;
    padding: 0 !important;
  }

  .company-logo {
    display: block !important;
    margin: 0 auto !important;
  }

  .text-content::before {
    display: none !important;
  }

  .hero-content {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
}
</style>