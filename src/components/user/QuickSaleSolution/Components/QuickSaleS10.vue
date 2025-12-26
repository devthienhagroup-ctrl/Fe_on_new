<template>
  <div class="section section10">
    <div class="st-title">
      <TitleComponent
          :circle-size="sectionData.circleSize"
          :icon-height="sectionData.iconHeight"
          :icon-width="sectionData.iconWidth"
          :order-number="sectionData.orderNumber"
          component-height="120px"
          component-width="100%"
          :icon-url="baseImgaeUrl+sectionData.iconUrl"
          :title="sectionData.title"
          :is-right="sectionData.isRight"
      >
      </TitleComponent>
    </div>
    <div class="main-content-wrapper">
      <div class="left-content-section">
        <div class="left-img fade-left">
          <img :src="baseImgaeUrl+sectionData.images.leftImage" alt="">
        </div>
        <div class="text-content-wrapper fade-up" :style="textWrapperStyle">
          <div class="text-content rich-text-editor-wrapper">
            <div class="tiptap" v-html="sectionData.content.paragraph">
            </div>
          </div>
        </div>
        <div class="center-img" :style="centerImageStyle">
          <img class="fade-up" :src="baseImgaeUrl+sectionData.images.centerImage" alt="">
        </div>
      </div>

      <div class="right-content-section">
        <div class="right-img">
          <img class="fade-right" :src="baseImgaeUrl+sectionData.images.rightImage" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComponent from "./TitleQickSale.vue";
import { computed } from 'vue';
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Dữ liệu động - có thể fetch từ API hoặc import từ JSON
let sectionData = {
  title: "Hỗ trợ pháp lý 100% đến khi hoàn tất giao dịch",
  iconUrl: "/imgs/icon-phap-ly.png",
  orderNumber: 10,
  circleSize: 100,
  iconHeight: 90,
  iconWidth: 109,
  isRight: true,
  content: {
    paragraph: "Đơn vị hỗ trợ trọn gói hồ sơ pháp lý: công chứng, sang tên, kiểm tra quy hoạch, hoàn tất thủ tục chuyển nhượng. Khách hàng chỉ cần ký hợp đồng và nhận tiền — mọi thủ tục còn lại đều được xử lý chuyên nghiệp, an toàn, đúng quy định pháp luật."
  },
  images: {
    leftImage: "/imgs/anh-phap-ly-1.png",
    centerImage: "/imgs/anh-phap-ly-3.png",
    rightImage: "/imgs/anh-phap-ly-2.png"
  },
  styles: {
    dashColor: "#C2CBF0",
    titleWidth: "43%",
    textWrapperWidth: "80%",
    textWrapperRight: "-25%",
    textWrapperBottom: "-10%",
    centerImageWidth: "300px",
    centerImageRight: "-150px",
    centerImageTop: "-70px",
    circleSize: "350px"
  }
};

const props = defineProps({
  sectionData: Object
})
if(props.sectionData) {
  sectionData = props.sectionData.section10;
  console.log("Đã nhận được data từ cha", sectionData)
}

// Computed style cho text wrapper
const textWrapperStyle = computed(() => ({
  '--dash-color': sectionData.styles.dashColor,
  width: sectionData.styles.textWrapperWidth,
  right: sectionData.styles.textWrapperRight,
  bottom: sectionData.styles.textWrapperBottom
}));

// Computed style cho center image
const centerImageStyle = computed(() => ({
  '--circle-size': sectionData.styles.circleSize,
  width: sectionData.styles.centerImageWidth,
  right: sectionData.styles.centerImageRight,
  top: sectionData.styles.centerImageTop
}));
</script>

<style scoped>
* {
  font-family: 'Ubuntu', sans-serif;
  font-size: 17px;
  box-sizing: border-box;
}

.section {
  margin-top: 50px;
  padding: 50px 20px;
  position: relative;
  margin-bottom: 50px;
}

.title-component {
  z-index: 1;
}

.st-title {
  display: block;
  width: v-bind('sectionData.styles.titleWidth');
  margin-left: auto;
}

.st-title::before {
  content: "";
  position: absolute;
  border-top: 5px dashed var(--dash-color, #C2CBF0);
  border-right: 5px dashed var(--dash-color, #C2CBF0);
  width: 29.7%;
  height: 20%;
  top: -130px;
  right: 68px;
}

.text-content-wrapper {
  border-left: 0;
  border-radius: 20px;
  position: absolute;
  width: v-bind('sectionData.styles.textWrapperWidth');
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  right: v-bind('sectionData.styles.textWrapperRight');
  bottom: v-bind('sectionData.styles.textWrapperBottom');
  z-index: 2;
}

.left-img img, .right-img img {
  border-radius: 20px;
  width: 100%;
  height: auto;
  display: block;
}

.left-img img {
  margin-left: auto;
}

.right-content-section {
  position: relative;
}

.center-img img {
  width: 100%;
  border-radius: 20px;
  height: auto;
}

.center-img {
  width: v-bind('sectionData.styles.centerImageWidth');
  position: absolute;
  top: v-bind('sectionData.styles.centerImageTop');
  right: v-bind('sectionData.styles.centerImageRight');
  z-index: 3;
}

/* Vòng tròn nét đứt */
.center-img::before {
  content: "";
  width: var(--circle-size, 350px);
  height: var(--circle-size, 350px);
  border: 5px dashed var(--dash-color, #C2CBF0);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.right-img {
  margin-top: 50px;
}

.section10::before {
  content: "";
  position: absolute;
  border-right: 5px dashed var(--dash-color, #C2CBF0);
  border-bottom: 5px dashed var(--dash-color, #C2CBF0);
  width: 35%;
  height: 20%;
  right: 68px;
  top: 0;
}

.section10 .title-component {
  transform: translateY(-70px);
}

.main-content-wrapper {
  display: flex;
  gap: 0;
  position: relative;
}

.left-content-section {
  flex: 1;
  min-width: 0;
  z-index: 3;
  position: relative;
}

.right-content-section {
  flex: 1;
  min-width: 0;
  z-index: 2;
  padding-right: 0;
}

.section10 .text-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 17px;
  color: #333;
  text-align: justify;
}

@media (max-width: 1400px) {
  .main-content-wrapper {
    margin-top: 50px !important;
  }

  .st-title {
    width: 100% !important;
  }

  .text-content-wrapper {
    width: 90% !important;
    right: -20% !important;
  }

  .center-img {
    width: 280px !important;
    right: -120px !important;
  }

  .center-img::before {
    width: 320px !important;
    height: 320px !important;
  }

  .section10::before {
    height: 24% !important;
    width: 39% !important;
  }

  .st-title::before {
    display: none !important;
  }
}

@media (max-width: 1200px) {
  .section {
    padding: 40px 30px !important;
  }

  .text-content-wrapper {
    width: 95% !important;
    right: -15% !important;
    padding: 18px !important;
  }

  .center-img {
    width: 250px !important;
    right: -100px !important;
    top: -50px !important;
  }

  .center-img::before {
    width: 290px !important;
    height: 290px !important;
  }
}

@media (max-width: 992px) {
  .main-content-wrapper {
    flex-direction: column !important;
    gap: 30px !important;
    margin-top: 30px !important;
  }

  .left-content-section,
  .right-content-section {
    flex: none !important;
    width: 100% !important;
  }

  .st-title {
    width: 100% !important;
  }

  .st-title::before {
    display: none !important;
  }

  .section10::before {
    display: none !important;
  }

  .text-content-wrapper {
    position: relative !important;
    width: 100% !important;
    right: 0 !important;
    bottom: 0 !important;
    margin-top: 20px !important;
    padding: 25px !important;
  }

  .center-img {
    position: relative !important;
    width: 300px !important;
    top: 0 !important;
    right: 0 !important;
    margin: 30px auto !important;
  }

  .center-img::before {
    width: 340px !important;
    height: 340px !important;
  }

  .left-img img {
    margin-left: 0 !important;
    width: 100% !important;
    max-width: 500px !important;
    margin: 0 auto !important;
    display: block !important;
  }

  .right-img {
    margin-top: 20px !important;
  }

  .section10 .title-component {
    transform: translateY(0) !important;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 30px 20px !important;
    margin-top: 30px !important;
    margin-bottom: 30px !important;
  }

  .text-content-wrapper {
    padding: 20px !important;
    margin-top: 15px !important;
  }

  .center-img {
    width: 250px !important;
    margin: 20px auto !important;
  }

  .center-img::before {
    width: 280px !important;
    height: 280px !important;
  }

  .section10 .text-content p {
    font-size: 16px !important;
    line-height: 1.5 !important;
  }

  .left-img img,
  .right-img img {
    border-radius: 15px !important;
  }
}

@media (max-width: 576px) {
  .section {
    padding: 20px 15px !important;
    margin-top: 20px !important;
    margin-bottom: 20px !important;
  }

  .text-content-wrapper {
    padding: 15px !important;
    border-radius: 15px !important;
    margin-top: 15px !important;
  }

  .center-img {
    width: 200px !important;
    margin: 15px auto !important;
  }

  .center-img::before {
    width: 230px !important;
    height: 230px !important;
  }

  .section10 .text-content p {
    font-size: 15px !important;
    line-height: 1.4 !important;
    text-align: left !important;
  }

  .main-content-wrapper {
    gap: 20px !important;
  }

  .right-img {
    margin-top: 10px !important;
  }
}

@media (max-width: 400px) {
  .section {
    padding: 15px 10px !important;
  }

  .text-content-wrapper {
    padding: 12px !important;
  }

  .center-img {
    width: 180px !important;
  }

  .center-img::before {
    width: 210px !important;
    height: 210px !important;
  }

  .section10 .text-content p {
    font-size: 14px !important;
  }
}

@media (max-width: 360px) {
  .center-img {
    width: 160px !important;
  }

  .center-img::before {
    width: 190px !important;
    height: 190px !important;
  }

  .text-content-wrapper {
    padding: 10px !important;
  }
}
</style>