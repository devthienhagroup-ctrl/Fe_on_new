<template>
  <div
      class="section section8"
      :id="sectionData.id"
      :style="{
      marginTop: sectionData.styles.section.marginTop,
      padding: sectionData.styles.section.padding,
      marginBottom: sectionData.styles.section.marginBottom
    }"
  >
    <div class="st-title">
      <TitleComponent
          :circle-size="sectionData.titleComponent.circleSize"
          :icon-height="sectionData.titleComponent.iconHeight"
          :icon-width="sectionData.titleComponent.iconWidth"
          :order-number="sectionData.titleComponent.orderNumber"
          :component-height="sectionData.titleComponent.componentHeight"
          :component-width="sectionData.titleComponent.componentWidth"
          :icon-url="baseImgaeUrl+sectionData.icon"
          :title="sectionData.title"
          :is-right="sectionData.titleComponent.isRight"
      ></TitleComponent>
    </div>
    <div class="main-content-wrapper">

      <div
          class="text-content fade-left"
          :style="{
          backgroundColor: sectionData.styles.backgroundColor,
          border: `2px solid ${sectionData.styles.borderColor}`,
          borderRadius: sectionData.styles.borderRadius,
          marginLeft: sectionData.styles.textContent.marginLeft,
          marginRight: sectionData.styles.textContent.marginRight,
          paddingLeft: sectionData.styles.textContent.paddingLeft,
          minHeight: sectionData.styles.textContent.minHeight
        }"
      >
        <div class="text-wrapper rich-text-editor-wrapper">
          <div class="tiptap" v-html="sectionData.content">
          </div>
        </div>

        <img
            class="img1 fade-up"
            :src="baseImgaeUrl+sectionData.images.img1.src"
            :alt="sectionData.images.img1.alt"
            :style="{
            right: sectionData.images.img1.position.right,
            top: sectionData.images.img1.position.top
          }"
        >
      </div>
      <img
          class="img2 fade-up"
          :src="baseImgaeUrl+sectionData.images.img2.src"
          :alt="sectionData.images.img2.alt"
          :style="{
          right: sectionData.images.img2.position.right,
          top: sectionData.images.img2.position.top
        }"
      >

    </div>
  </div>
</template>

<script setup>
import TitleComponent from "./TitleQickSale.vue";
import { ref, onMounted } from 'vue';
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Dữ liệu mẫu - có thể fetch từ API hoặc CMS
const sectionData = ref({
  id: "quick-sale-section-8",
  title: "Tư vấn hỗ trợ chủ nhà và khách hàng",
  icon: "/imgs/icon-tu-van.png",
  titleComponent: {
    circleSize: 100,
    iconHeight: 80,
    iconWidth: 90,
    orderNumber: 8,
    componentHeight: "80px",
    componentWidth: "100%",
    isRight: true
  },
  content: {
    description: "Trong suốt quá trình bán, chuyên viên luôn đồng hành, hỗ trợ cả hai bên:",
    listItems: [
      "Giải đáp mọi thắc mắc về thủ tục",
      "Tư vấn chiến lược giá linh hoạt",
      "Hỗ trợ giao tiếp, thương lượng hiệu quả"
    ]
  },
  images: {
    img1: {
      src: "/imgs/anh-tu-van-1.png",
      alt: "Tư vấn 1",
      position: {
        right: "-15%",
        top: "-15%"
      }
    },
    img2: {
      src: "/imgs/anh-tu-van-2.png",
      alt: "Tư vấn 2",
      position: {
        right: "50%",
        top: "90%"
      }
    }
  },
  styles: {
    borderColor: "#031358",
    borderRadius: "20px",
    backgroundColor: "white",
    dashedLineColor: "#C2CBF0",
    textContent: {
      marginLeft: "12%",
      marginRight: "20%",
      paddingLeft: "10px",
      minHeight: "200px"
    },
    section: {
      marginTop: "150px",
      padding: "30px 20px 100px",
      marginBottom: "80px"
    }
  }
});

const props = defineProps({
  sectionData: Object
})
if(props.sectionData) {
  sectionData.value = props.sectionData.section8;
  console.log("Đã nhận được data từ cha", sectionData.value)
}


onMounted(() => {
  // fetchSectionData();
});
</script>

<style scoped>
.st-title {
  display: block;
  margin-left: auto;
}

.main-content-wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
}

.section8::before {
  content: "";
  position: absolute;
  top: 0;
  right: 79px;
  width: 87.6%;
  height: 118%;
  border-right: 5px dashed v-bind('sectionData.styles.dashedLineColor');
  border-bottom: 5px dashed v-bind('sectionData.styles.dashedLineColor');
  margin-left: 75px;
  z-index: 0;
}

.section8 {
  position: relative;
  overflow: visible;
}

.section8 .title-component {
  transform: translateY(-70px);
}

.section8 .st-title {
  width: 40%;
}

.img2 {
  position: absolute;
}

.section8 .img1 {
  position: absolute;
}

.section8 .main-content-wrapper {
  margin-top: 50px;
}

.section8 p {
  font-size: 17px;
  text-align: justify;
}

.section8 .text-content {
  border: 2px solid v-bind('sectionData.styles.borderColor');
  border-radius: v-bind('sectionData.styles.borderRadius');
  background-color: v-bind('sectionData.styles.backgroundColor');
  width: 100%;
  z-index: 2;
  position: relative;
  display: flex;
  align-items: center;
}

@media (max-width: 1400px) {
  .section8 .st-title {
    width: 100% !important;
  }

  .section8::before {
    width: 87.5%;
  }

  .section8::before {
    width: 2px;
    height: 160%;
  }
}

/* Tablet styles */
@media (min-width: 769px) and (max-width: 1200px) {
  .section8 {
    margin-top: 120px !important;
    padding: 25px 25px 80px !important;
    margin-bottom: 60px !important;
  }

  .section8 .text-content {
    margin-left: 8% !important;
    margin-right: 15% !important;
    padding-right: 35% !important;
    padding-left: 20px !important;
    min-height: 180px !important;
  }

  .section8 .img1 {
    right: -10% !important;
    top: -10% !important;
    max-width: 280px !important;
  }

  .img2 {
    right: 45% !important;
    top: 85% !important;
    max-width: 200px !important;
  }

  .section8 p {
    font-size: 16px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .section8 {
    margin-top: 80px !important;
    padding: 20px 15px 60px !important;
    margin-bottom: 40px !important;
  }

  .section8::before {
    height: 130%;
  }

  .section8 .st-title {
    width: 100%;
    margin-bottom: 30px;
  }

  .main-content-wrapper {
    flex-direction: column;
    gap: 20px;
    position: relative;
  }

  .section8 .text-content {
    margin: 0 !important;
    padding: 25px 20px !important;
    width: 100%;
    display: block;
    min-height: auto !important;
    text-align: center;
  }

  .section8 p {
    font-size: 16px;
    text-align: justify;
    margin-bottom: 15px;
  }

  .section8 ul {
    text-align: justify;
    padding-left: 0;
    list-style-position: inside;
  }

  .section8 .img1 {
    position: static !important;
    display: block;
    margin: 20px auto 0;
    max-width: 280px !important;
    width: 100%;
  }

  .img2 {
    position: static !important;
    display: block;
    margin: 0 auto;
    max-width: 200px !important;
    width: 100%;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .section8 {
    margin-top: 60px !important;
    padding: 15px 10px 40px !important;
    margin-bottom: 30px !important;
  }

  .section8 .text-content {
    padding: 20px 15px !important;
  }

  .section8 p {
    font-size: 15px;
  }

  .section8 .img1 {
    max-width: 250px !important;
  }

  .img2 {
    max-width: 180px !important;
  }

  .section8::before{
    right: 60px;
    height: 115%;
  }
}

/* Large desktop adjustments */
@media (min-width: 1600px) {
  .section8 .text-content {
    margin-left: 15% !important;
    margin-right: 25% !important;
  }

  .section8 .img1 {
    right: -12% !important;
    top: -12% !important;
  }
}
</style>