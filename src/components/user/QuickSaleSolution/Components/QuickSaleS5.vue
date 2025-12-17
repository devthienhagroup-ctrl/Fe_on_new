<template>
  <div class="section section5" :style="sectionStyle">
    <div class="st-title">
      <TitleComponent
          :circle-size="sectionData.title.circleSize"
          :icon-height="sectionData.title.iconHeight"
          :icon-width="sectionData.title.iconWidth"
          :order-number="sectionData.title.orderNumber"
          :component-height="sectionData.title.componentHeight"
          :component-width="sectionData.title.componentWidth"
          :icon-url="baseImgaeUrl+sectionData.title.iconUrl"
          :title="sectionData.title.titleText"
      ></TitleComponent>
    </div>
    <div class="main-content-wrapper">
      <div class="text-content fade-in" :style="textContentStyle">
        <div class="rich-text-editor-wrapper">
        <div class="tiptap" v-html="sectionData.content.description"
            :style="{ fontSize: sectionData.styles.fontSizeDesktop }">
        </div>
        </div>

        <img
            class="img1 fade-up"
            :src="baseImgaeUrl+sectionData.content.image1"
            :alt="sectionData.content.image1Alt"
            :style="imageStyle1"
        >
        <img
            class="img2 fade-right"
            :src="baseImgaeUrl+sectionData.content.image2"
            :alt="sectionData.content.image2Alt"
            :style="imageStyle2"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TitleComponent from "./TitleQickSale.vue";
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Dữ liệu động (sẽ được lấy từ CMS/API)
let sectionData = ref({
  title: {
    iconUrl: "/imgs/icon-thoa-thuan.png",
    orderNumber: 5,
    titleText: "Thỏa thuận & ký kết hợp đồng triển khai bán trong 30 ngày",
    circleSize: 100,
    iconHeight: 80,
    iconWidth: 90,
    componentHeight: "120px",
    componentWidth: "100%"
  },
  content: {
    description: "Khách hàng và đơn vị triển khai thống nhất ký kết hợp đồng dịch vụ trong 30 ngày. Hợp đồng nêu rõ lộ trình, cam kết và quyền lợi của khách hàng, đảm bảo tính minh bạch và hiệu quả xuyên suốt quá trình bán.",
    image1: "/imgs/anh-thoa-thuan-2.png",
    image2: "/imgs/anh-thoa-thuan-1.png",
    image1Alt: "Ảnh thỏa thuận 2",
    image2Alt: "Ảnh thỏa thuận 1"
  },
  styles: {
    borderColor: "#C2CBF0",
    borderWidth: "5px",
    borderStyle: "dashed",
    textColor: "#000000",
    backgroundColor: "#ffffff",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
    fontSizeDesktop: "17px",
    fontSizeTablet: "16px",
    fontSizeMobile: "15px",
    fontSizeSmallMobile: "14px"
  }
});

const props = defineProps({
  sectionData: Object
})
if(props.sectionData) {
  sectionData.value = props.sectionData.section5;
  console.log("Nhận được: ", props.sectionData.section5)
}

// Computed styles
const sectionStyle = computed(() => ({
  '--border-color': sectionData.value.styles.borderColor,
  '--border-width': sectionData.value.styles.borderWidth,
  '--border-style': sectionData.value.styles.borderStyle,
  '--text-color': sectionData.value.styles.textColor,
  '--bg-color': sectionData.value.styles.backgroundColor,
  '--shadow-color': sectionData.value.styles.shadowColor,
  '--border-radius': sectionData.value.styles.borderRadius
}));

const textContentStyle = computed(() => ({
  backgroundColor: sectionData.value.styles.backgroundColor,
  boxShadow: `0 0 10px ${sectionData.value.styles.shadowColor}`,
  borderRadius: sectionData.value.styles.borderRadius,
  color: sectionData.value.styles.textColor
}));

const imageStyle1 = computed(() => ({
  borderColor: sectionData.value.styles.borderColor
}));

const imageStyle2 = computed(() => ({
  borderColor: sectionData.value.styles.borderColor
}));
</script>

<style scoped>
* {
  font-family: 'Ubuntu', sans-serif;
}

.main-content-wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
}

.section5::before {
  content: "";
  position: absolute;
  top: 0;
  left: -8px;
  width: 80%;
  height: 120%;
  border-left: var(--border-width) var(--border-style) var(--border-color);
  border-bottom: var(--border-width) var(--border-style) var(--border-color);
  margin-left: 75px;
  z-index: 0;
}

.section5 {
  position: relative;
  overflow: visible;
  padding: 20px;
  padding-bottom: 100px;
  margin-bottom: 80px;
}

.section5 .title-component {
  transform: translateY(-70px);
}

.section5 .st-title {
  width: 50%;
}

.section5 .img1 {
  position: absolute;
  z-index: 2;
  width: 50%;
}

.section5 .img2 {
  position: absolute;
  right: -300px;
  top: -100px;
  width: 60%;
}

.section5 .main-content-wrapper {
  margin-top: 50px;
}

.section5 p {
  text-align: justify;
}

.section5 .text-content {
  width: 100%;
  margin-left: 12%;
  margin-right: 25%;
  padding: 40px 25% 10% 40px;
  z-index: 2;
  position: relative;
}

/* Tablet */
@media (max-width: 1400px) {
  .st-title {
    width: 100% !important;
  }

  .section5 {
    margin-bottom: 30px;
    padding: 20px;
    padding-bottom: 60px;
  }

  .section5::before {
    left: -7px;
    height: 110%;
    width: 2px;
  }

  .section5 .st-title {
    width: 70%;
  }

  .section5 .text-content {
    margin-left: 8%;
    margin-right: 15%;
    padding: 30px 20% 8% 30px;
  }

  .section5 .img1 {
    width: 30%;
  }

  .section5 .img2 {
    right: -150px;
    top: -80px;
    width: 40%;
  }

  .section5 p {
    font-size: v-bind('sectionData.styles.fontSizeTablet');
  }
}

/* Mobile */
@media (max-width: 768px) {
  .section5 {
    padding: 15px;
    padding-bottom: 40px;
    margin-bottom: 20px;
  }

  .section5 .st-title :deep(.title-component) {
    height: 150px !important;
  }

  .section5 .img1,
  .section5 .img2,
  .section5 .text-content {
    position: static;
  }

  .section5 .img1 {
    display: block;
    margin: 20px auto 0;
    max-width: 100%;
    width: 80%;
  }

  .section5 .img2 {
    display: block;
    margin: 20px auto 0;
    max-width: 100%;
    width: 80%;
  }

  .section5 .text-content {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
  }

  .main-content-wrapper {
    flex-direction: column;
    gap: 15px;
  }

  .section5 p {
    font-size: v-bind('sectionData.styles.fontSizeMobile');
    text-align: left;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .section5 {
    padding: 10px;
    padding-bottom: 30px;
  }

  .section5 .st-title :deep(.title-component) {
    height: 140px !important;
  }

  .section5 .text-content {
    padding: 15px;
  }

  .section5 p {
    font-size: v-bind('sectionData.styles.fontSizeSmallMobile');
  }

  .section5 .img1,
  .section5 .img2 {
    width: 90%;
  }
}
</style>