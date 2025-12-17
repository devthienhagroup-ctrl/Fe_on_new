<template>
  <div class="section section6">
    <div class="st-title" :style="{ width: sectionData.styles.titleWidth }">
      <TitleComponent
          :circle-size="sectionData.styles.circleSize"
          :icon-height="sectionData.styles.iconHeight"
          :icon-width="sectionData.styles.iconWidth"
          :order-number="sectionData.id"
          :component-height="sectionData.styles.titleComponentHeight"
          :component-width="sectionData.styles.titleComponentWidth"
          :icon-url="baseImgaeUrl+sectionData.icon"
          :title="sectionData.title"
          :is-right="sectionData.styles.isRight"
      >
      </TitleComponent>
    </div>
    <div class="main-content-wrapper">
      <div class="left-content-section fade-left">
        <img :src="baseImgaeUrl+sectionData.imageLeft" :alt="sectionData.altText">
      </div>

      <div class="right-content-section">
        <div
            class="text-content-wrapper"
            :style="{
            backgroundImage: `url('${baseImgaeUrl+sectionData.imageRight}')`,
            backgroundColor: sectionData.styles.backgroundColor
          }"
        >
          <div class="rich-text-editor-wrapper">
            <div class="text-content fade-up tiptap" v-html="sectionData.content">

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComponent from "./TitleQickSale.vue";
import {ref, onMounted} from 'vue';
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Định nghĩa props để nhận dữ liệu từ bên ngoài
const props = defineProps({
  sectionData: {
    type: Object,
    default: () => ({
      id: 6,
      title: "Lên ý tưởng chiến lược trên từng bất động sản",
      icon: "/imgs/icon-len-y-tuong.png",
      imageLeft: "/imgs/anh-len-y-tuong-1.png",
      imageRight: "/imgs/anh-len-y-tuong-2.png",
      altText: "Lên ý tưởng chiến lược bất động sản",
      content: {
        intro: "Đội ngũ marketing sẽ xây dựng <b>kế hoạch truyền thông chuyên biệt cho từng bất động sản</b>, bao gồm:",
        items: [
          {
            text: "Sáng tạo nội dung quảng cáo hấp dẫn, đánh trúng tâm lý người mua.",
            bold: true
          },
          {
            text: "Thiết kế hình ảnh và video chuyên nghiệp, làm nổi bật giá trị thật của sản phẩm.",
            bold: true
          },
          {
            text: "Triển khai chiến dịch quảng bá đa kênh (Facebook, Google, Zalo, sàn BĐS, website).",
            bold: true
          }
        ],
        goal: {
          text: "Tối đa hóa lượng khách hàng tiềm năng và đẩy nhanh giao dịch trong",
          days: "30 ngày"
        }
      },
      styles: {
        titleWidth: "45%",
        titleComponentHeight: "120px",
        titleComponentWidth: "100%",
        circleSize: 100,
        iconHeight: 109,
        iconWidth: 109,
        isRight: true,
        borderColor: "#C2CBF0",
        backgroundColor: "transparent",
        textColor: "#333",
        fontSize: "17px",
        fontFamily: "'Ubuntu', sans-serif"
      }
    })
  }
});

// Hoặc có thể fetch dữ liệu từ API
const sectionData = ref(props.sectionData);

// Nếu muốn fetch dữ liệu từ API
/*
const fetchSectionData = async () => {
  try {
    const response = await fetch('/api/section6');
    sectionData.value = await response.json();
  } catch (error) {
    console.error('Error fetching section data:', error);
  }
};

onMounted(() => {
  fetchSectionData();
});
*/
</script>

<style scoped>
* {
  font-family: v-bind('sectionData.styles.fontFamily');
  font-size: v-bind('sectionData.styles.fontSize');
  color: v-bind('sectionData.styles.textColor');
}

.section {
  padding: 50px 20px;
  position: relative;
  overflow: visible;
}

.title-component {
  z-index: 1;
}

.st-title {
  display: block;
  width: v-bind('sectionData.styles.titleWidth');
  margin-left: auto;
}

.text-content-wrapper {
  margin-top: 50px;
  position: relative;
  padding: 30px 60px;
  border-left: 0;
  border-radius: 20px;
  min-height: 80%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.section6::before {
  content: "";
  position: absolute;
  border-right: 5px dashed v-bind('sectionData.styles.borderColor');
  border-bottom: 5px dashed v-bind('sectionData.styles.borderColor');
  width: 80%;
  height: 106.5%;
  right: 68px;
  top: 0;
}

.right-content-section {
  position: relative;
}

.section6 .title-component {
  transform: translateY(-70px);
}

.main-content-wrapper {
  display: flex;
}

.left-content-section {
  flex: 1;
  min-width: 0;
  z-index: 3;
}

.right-content-section {
  flex: 1;
  min-width: 0;
  z-index: 2;
  padding-right: 10%;
}

.left-content-section img {
  transform: translate(130px, -50px);
  width: 90%;
}

.section6 .text-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: v-bind('sectionData.styles.fontSize');
  color: v-bind('sectionData.styles.textColor');
  text-align: justify;
}

.right-content-section img {
  width: 100%;
  transform: translate(40px, 40px);
}

/* Responsive Design */
@media (max-width: 1400px) {
  .st-title {
    width: 100%;
  }
}

@media (max-width: 1308px) {
  .img-right::before {
    display: none;
  }

  .text-content-wrapper::before {
    border-bottom: 0;
    height: 300%;
  }

  .img-right img {
    transform: translate(0, 0);
    height: 100%;
  }

  .img-right {
    height: 145px;
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
  }

  .right-content-section::before {
    display: none;
  }

  .section6 {
    position: relative;
  }

  .section6::before {
    content: "";
    position: absolute;
    width: 1%;
    height: 106%;
    border-right: 5px dashed v-bind('sectionData.styles.borderColor');
    right: 96px;
  }

  .text-content-wrapper {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
  }

  .text-content-wrapper::before {
    display: none;
  }

  .img-right img {
    border-radius: 50px;
    height: 100%;
  }

  .img-right {
    height: 100%;
  }

  .left-content-section img {
    transform: translate(0px, 0px);
  }

  .right-content-section {
    padding-right: 10px;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 20px;
    margin-bottom: 30px;
  }

  .text-content-wrapper {
    padding: 20px;
  }

  /* Tăng chiều cao cho TitleComponent trên mobile */
  .section5 .st-title :deep(.title-component) {
    height: v-bind('sectionData.responsive?.mobileTitleHeight || "150px"') !important;
  }

  .section6::before {
    right: 67px;
  }
}
</style>