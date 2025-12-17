<template>
  <div class="section section3">
    <div class="st-title">
      <TitleComponent
          :circle-size="sectionData.circleSize"
          :icon-height="sectionData.iconHeight"
          :icon-width="sectionData.iconWidth"
          :order-number="sectionData.id"
          :component-height="sectionData.componentHeight"
          :component-width="sectionData.componentWidth"
          :icon-url="baseImgaeUrl+sectionData.iconUrl"
          :title="sectionData.title"
      >
      </TitleComponent>
    </div>
    <div class="main-content-wrapper">
      <div class="left-content-section">
        <img
            :src="baseImgaeUrl+sectionData.image.src"
            :alt="sectionData.image.alt"
            :style="{ borderRadius: sectionData.image.borderRadius }"
        >
      </div>

      <div class="right-content-section">
        <div class="text-content-wrapper">
          <div class="text-content fade-up rich-text-editor-wrapper">
            <div v-html="sectionData.content.text" class="tiptap"
                :style="{
              fontSize: sectionData.content.fontSize,
              lineHeight: sectionData.content.lineHeight,
              color: sectionData.content.color,
              textAlign: sectionData.content.textAlign
            }">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComponent from "./TitleQickSale.vue";
import { ref, onMounted } from 'vue';
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Dữ liệu động - có thể fetch từ API hoặc CMS
let sectionData = ref({
  id: 3,
  title: "Khảo sát",
  iconUrl: "/imgs/icon-khao-sat.png",
  iconWidth: 109,
  iconHeight: 109,
  circleSize: 100,
  componentHeight: "80px",
  componentWidth: "100%",

  image: {
    src: "/imgs/anh-khao-sat-1.png",
    alt: "Khảo sát bất động sản",
    borderRadius: "10px"
  },

  content: {
    text: "Chuyên viên tiến hành khảo sát trực tiếp bất động sản để xác minh tình trạng, pháp lý, vị trí, môi trường sống và giá trị xung quanh. Bước này giúp củng cố tính chính xác của giá định và nâng cao niềm tin của người mua.",
    fontSize: "17px",
    lineHeight: 1.6,
    color: "#000000",
    textAlign: "justify"
  },

  border: {
    color: "#C2CBF0",
    width: "5px",
    style: "dashed"
  },

  layout: {
    gap: "30px",
    imageTranslateX: "70px",
    rightSectionPadding: "0 70px",
    textPaddingRight: "60px"
  },

  responsive: {
    tabletImageMaxHeight: "400px",
    mobileImageMaxHeight: "300px",
    smallMobileImageMaxHeight: "250px"
  }
});

const props = defineProps({
  sectionData: Object
})
if(props.sectionData) {
  sectionData = props.sectionData.section3;
  console.log("Đã nhận được data từ cha")
}

// Hàm để cập nhật dữ liệu từ CMS/API
const updateSectionData = (newData) => {
  sectionData.value = { ...sectionData.value, ...newData };
};

// Ví dụ: Fetch dữ liệu từ API
onMounted(async () => {
  try {
    // const response = await fetch('/api/section3-data');
    // const data = await response.json();
    // sectionData.value = data;
  } catch (error) {
    console.error('Error fetching section data:', error);
  }
});

// Export hàm update để có thể sử dụng từ component cha
defineExpose({
  updateSectionData
});
</script>

<style scoped>
.section {
  padding: 20px;
  margin-bottom: 40px;
  position: relative;
  overflowY: visible;
}

.title-component {
  z-index: 1;
}

/* tạo viền nửa trên bên phải */
.section3::before {
  content: "";
  position: absolute;
  top: -10px;
  right: 30px;
  width: 60%;
  height: 350px;
  border-top: v-bind('sectionData.border.width') v-bind('sectionData.border.style') v-bind('sectionData.border.color');
  border-right: v-bind('sectionData.border.width') v-bind('sectionData.border.style') v-bind('sectionData.border.color');
  border-bottom: v-bind('sectionData.border.width') v-bind('sectionData.border.style') v-bind('sectionData.border.color');
  z-index: 1;
}

.text-content-wrapper {
  position: relative;
  padding: 30px 40px;
}

.text-content-wrapper::before {
  content: "";
  position: absolute;
  top: -70px;
  left: 0;
  border-left: v-bind('sectionData.border.width') v-bind('sectionData.border.style') v-bind('sectionData.border.color');
  border-top: v-bind('sectionData.border.width') v-bind('sectionData.border.style') v-bind('sectionData.border.color');
  width: 103.5%;
  height: 350px;
  z-index: -1;
}

.right-content-section {
  position: relative;
}

.right-content-section::before {
  content: "";
  position: absolute;
  border-right: v-bind('sectionData.border.width') v-bind('sectionData.border.style') v-bind('sectionData.border.color');
  width: 100%;
  height: 130%;
  right: 48px;
  top: -70px;
}

.section3 .title-component {
  transform: translateY(-70px);
}

.main-content-wrapper {
  display: flex;
  gap: v-bind('sectionData.layout.gap');
}

.left-content-section {
  flex: 1;
  min-width: 0;
  z-index: 3;
  transform: translateX(v-bind('sectionData.layout.imageTranslateX'));
}

/* CSS cho ảnh - đã thêm responsive */
.left-content-section img {
  width: 100%;
  height: auto;
  display: block;
  max-width: 100%;
  object-fit: cover;
  border-radius: v-bind('sectionData.image.borderRadius');
  transform: translateX(60px);
}

.right-content-section {
  flex: 1;
  min-width: 0;
  z-index: 2;
  padding: v-bind('sectionData.layout.rightSectionPadding');
}

.section3 .text-content p {
  margin-bottom: 20px;
  padding-right: v-bind('sectionData.layout.textPaddingRight');
}

.detail-button {
  background-color: #0827AF;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 17px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin-left: auto;
}

.detail-button:hover {
  background-color: #041b6a;
}

.st-title {
  width: 40%;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .st-title {
    width: 100%;
  }
}

@media (max-width: 1200px) {
  .left-content-section img {
    max-height: v-bind('sectionData.responsive.tabletImageMaxHeight');
    object-fit: cover;
  }
}

@media (max-width: 992px) {
  .main-content-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .left-content-section,
  .right-content-section {
    flex: none;
    width: 100%;
    transform: none;
  }

  .left-content-section {
    text-align: center;
  }

  .left-content-section img {
    max-height: v-bind('sectionData.responsive.tabletImageMaxHeight');
    width: auto;
    max-width: 100%;
    margin: 0 auto;
  }

  .text-content-wrapper::before {
    display: none;
  }

  .right-content-section::before {
    display: none;
  }

  .section3::before {
    border-bottom: 0;
    height: 110%;
    right: 70px;
  }

  .text-content-wrapper {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 20px;
  }

  .right-content-section{
    padding: 0 20px;
  }

  .section3 .text-content p {
    padding: 5px;
    font-size: 16px;
  }

  .left-content-section img {
    max-height: v-bind('sectionData.responsive.mobileImageMaxHeight');
    width: 100%;
    transform: translateX(0);
  }
}

@media (max-width: 576px) {
  .left-content-section img {
    max-height: v-bind('sectionData.responsive.smallMobileImageMaxHeight');
    transform: translateX(0);
  }

  .text-content-wrapper {
    padding: 20px;
    background-color: white;
  }
}
</style>