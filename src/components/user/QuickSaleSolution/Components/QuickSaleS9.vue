<template>
  <div class="section section9" :id="sectionData.id">
    <div class="st-title">
      <TitleComponent
          :circle-size="sectionData.circleSize"
          :icon-height="sectionData.icon.height"
          :icon-width="sectionData.icon.width"
          :order-number="sectionData.orderNumber"
          component-height="100px"
          component-width="100%"
          :icon-url="baseImgaeUrl+sectionData.icon.url"
          :title="sectionData.title"
      />
    </div>

    <div class="main-content-wrapper">
      <div class="left-content-section">
        <div v-for="img in sectionData.images.filter(img => img.class.includes('fade-left'))"
             :key="img.id"
             :class="img.class.split(' ')[0]"
             :style="{ transform: img.transform }">
          <img :class="img.class.split(' ')[1]" :src="baseImgaeUrl+img.src" :alt="img.alt">
        </div>
        <img :src="baseImgaeUrl+sectionData.backgroundImages.left" alt="" class="bottom-left-img">
      </div>

      <div class="right-content-section">
        <div class="right-img fade-up">
          <img :src="baseImgaeUrl+sectionData.images.find(img => img.id === 'image4').src"
               :alt="sectionData.images.find(img => img.id === 'image4').alt">
        </div>
        <div class="text-content-wrapper">
          <div class="text-content fade-right">
            <p class="content-text">
              {{ sectionData.content.text }}
            </p>
          </div>
        </div>
        <img class="bottom-right-img" :src="baseImgaeUrl+sectionData.backgroundImages.right" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComponent from "./TitleQickSale.vue";
import { ref, onMounted } from 'vue';
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Dữ liệu mặc định
let defaultData = {
  id: "section9",
  orderNumber: 9,
  title: "Hỗ trợ đàm phán để bán được giá cao nhất",
  icon: {
    url: "/imgs/icon-ho-tro.png",
    width: 109,
    height: 109
  },
  circleSize: 100,
  backgroundImages: {
    left: "/imgs/bg-s4.png",
    right: "/imgs/bg-s3.png"
  },
  images: [
    {
      id: "image1",
      src: "/imgs/anh-ho-tro-1.png",
      alt: "Hỗ trợ đàm phán 1",
      class: "top-img fade-left"
    },
    {
      id: "image2",
      src: "/imgs/anh-ho-tro-2.png",
      alt: "Hỗ trợ đàm phán 2",
      class: "mid-img fade-left",
      transform: "translate(100px, -100px)"
    },
    {
      id: "image3",
      src: "/imgs/anh-ho-tro-3.png",
      alt: "Hỗ trợ đàm phán 3",
      class: "bot-img fade-left",
      transform: "translate(200px, -200px)"
    },
    {
      id: "image4",
      src: "/imgs/anh-ho-tro-4.png",
      alt: "Hỗ trợ đàm phán 4",
      class: "right-img fade-up"
    }
  ],
  content: {
    text: "Các chuyên viên giàu kinh nghiệm đại diện chủ nhà tham gia đàm phán, giúp thương lượng giá tối ưu nhất dựa trên dữ liệu thị trường, đảm bảo giao dịch nhanh mà vẫn có lợi nhất cho khách hàng.",
    styles: {
      backgroundColor: "white",
      maxWidth: "500px",
      fontSize: "17px",
      lineHeight: "1.6",
      color: "#333"
    }
  }
};

// Props để nhận dữ liệu từ CMS
const props = defineProps({
  sectionData: {
    type: Object,
  }
});

// Dữ liệu section - ưu tiên dữ liệu từ CMS
const sectionData = ref({defaultData});
if(props.sectionData) {
  sectionData.value = props.sectionData.section9;
}

</script>

<style scoped>
.section {
  padding: v-bind('sectionData.styles?.sectionPadding || "50px 50px 0"');
  margin-top: v-bind('sectionData.styles?.sectionMarginTop || "250px"');
  position: relative;
  overflow: visible;
}

.title-component { z-index: 1; }

.st-title {
  position: relative;
  width: 40%;
}
.st-title::before {
  content: "";
  position: absolute;
  border-left: v-bind('sectionData.styles?.borderWidth || "5px"')
  v-bind('sectionData.styles?.borderStyle || "dashed"')
  v-bind('sectionData.styles?.borderColor || "#C2CBF0"');
  width: 100%;
  height: 243%;
  bottom: 070px;
  left: 45px;
}
.st-title::after {
  content: "";
  position: absolute;
  border-right: v-bind('sectionData.styles?.borderWidth || "5px"')
  v-bind('sectionData.styles?.borderStyle || "dashed"')
  v-bind('sectionData.styles?.borderColor || "#C2CBF0"');
  width: 100%;
  height: 175%;
  top: -30px;
  left: 0;
}

.bottom-right-img {
  position: absolute;
  width: 70%;
  right: 0;
}

.bottom-left-img {
  position: absolute;
  bottom: -0px;
  left: 0px;
  width: 100%;
  border-radius: 10px;
  z-index: -1;
}

.top-img::before,
.mid-img::before,
.bot-img::before {
  content: "";
  position: absolute;
  border-top: v-bind('sectionData.styles?.borderWidth || "5px"')
  v-bind('sectionData.styles?.borderStyle || "dashed"')
  v-bind('sectionData.styles?.borderColor || "#C2CBF0"');
  border-right: v-bind('sectionData.styles?.borderWidth || "5px"')
  v-bind('sectionData.styles?.borderStyle || "dashed"')
  v-bind('sectionData.styles?.borderColor || "#C2CBF0"');
}
.top-img::before { width: 21%; height: 34%; top: 50px; right: 0; }
.mid-img::before { width: 18%; height: 62.7%; top: -20px; right: -20px; }
.bot-img::before { width: 15%; height: 177%; top: -20px; right: -20px; }

.top-img img,
.mid-img img,
.bot-img img {
  display: block;
  margin-left: auto;
}

.right-img img {
  display: block;
  margin: 0 auto;
}
.right-img { position: relative; }

.text-content-wrapper {
  position: relative;
  border-left: 0;
  border-top-right-radius: 50px;
  display: block;
  margin: 5px auto;
  max-width: v-bind('sectionData.content.styles.maxWidth || "500px"');
  background-color: v-bind('sectionData.content.styles.backgroundColor || "white"');
}

.section9 .title-component { transform: translateY(-70px); }

.main-content-wrapper {
  display: flex;
}
.left-content-section,
.right-content-section {
  flex: 1;
  min-width: 0;
  position: relative;
}
.left-content-section {
  z-index: 3;
  padding-top: 50px;
}
.right-content-section {
  z-index: 2;
  transform: translateY(-50px);
}

/* Thêm class mới cho nội dung text */
.content-text {
  margin-bottom: 20px !important;
  line-height: v-bind('sectionData.content.styles.lineHeight || "1.6"');
  font-size: v-bind('sectionData.content.styles.fontSize || "17px"');
  color: v-bind('sectionData.content.styles.color || "#333"');
  text-align: justify !important;
}

/* Responsive - sử dụng !important để ghi đè inline styles */
@media (max-width: 1400px) {
  .section9::before {
    content: "";
    position: absolute;
    height: 105%;
    width: 2px;
    border-left: v-bind('sectionData.styles?.borderWidth || "5px"')
    v-bind('sectionData.styles?.borderStyle || "dashed"')
    v-bind('sectionData.styles?.borderColor || "#C2CBF0"');
    top: 0;
    left: 100px;
  }

  .st-title {
    width: 100% !important;
  }
  .st-title::before, .st-title::after {
    display: none !important;
  }

  .st-title::before,
  .st-title::after,
  .top-img::before,
  .mid-img::before,
  .bot-img::before {
    display: none !important;
  }

  .st-title {
    position: relative;
  }
  .st-title::after {
    display: none !important;
    content: "";
    position: absolute;
    border-left: 2px dashed v-bind('sectionData.styles?.borderColor || "#C2CBF0"') !important;
    width: 2px !important;
    height: 100% !important;
    left: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
  }

  .top-img img,
  .mid-img img,
  .bot-img img {
    max-width: 80% !important;
    height: auto !important;
  }
}

@media (max-width: 1308px) {
  .img-right::before,
  .text-content-wrapper::before {
    display: none !important;
  }
  .text-content-wrapper::before {
    height: 300% !important;
  }
  .right-img img {
    transform: translate(0, 0) !important;
    height: 100% !important;
  }
  .right-img {
    height: 145px !important;
  }
}

@media (max-width: 992px) {
  .main-content-wrapper {
    flex-direction: column !important;
    gap: 20px !important;
  }
  .left-content-section,
  .right-content-section {
    flex: none !important;
    width: 100% !important;
  }

  .right-content-section::before,
  .text-content-wrapper::before {
    display: none !important;
  }

  .section9 {
    position: relative !important;
  }
  .bottom-right-img {
    display: none !important;
  }
  .text-content-wrapper {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    padding: 20px !important;
    max-width: 100% !important;
  }
  .right-img img {
    border-radius: 50px !important;
    height: 100% !important;
  }
  .right-img {
    height: 100% !important;
  }

  .content-text {
    text-align: left !important;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 20px !important;
    margin-bottom: 30px !important;
    margin-top: 150px !important;
  }

  .top-img,
  .mid-img,
  .bot-img {
    text-align: center !important;
  }

  .top-img img,
  .mid-img img,
  .bot-img img {
    margin: 0 auto !important;
    max-width: 100% !important;
    transform: none !important;
  }

  .mid-img,
  .bot-img {
    transform: none !important;
    margin-top: 20px !important;
  }

  .right-content-section {
    transform: none !important;
  }

  .text-content-wrapper {
    margin-top: 20px !important;
  }

  .content-text {
    text-align: left !important;
    font-size: 16px !important;
    line-height: 1.5 !important;
  }
}

@media (max-width: 576px) {
  .section {
    padding: 15px !important;
    margin-top: 100px !important;
  }

  .section9 .title-component {
    transform: translateY(-30px) !important;
  }

  .left-content-section {
    padding-top: 20px !important;
  }

  .section9::before {
    left: 63px !important;
    top: 0 !important;
  }

  .content-text {
    font-size: 15px !important;
    line-height: 1.4 !important;
    text-align: left !important;
  }
}
</style>