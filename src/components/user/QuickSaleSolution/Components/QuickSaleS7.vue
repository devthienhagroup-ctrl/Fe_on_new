<template>
  <div class="section section7" :style="sectionStyles">
    <div class="st-title" :style="{ width: data.styles.titleContainer.width }">
      <TitleComponent
          :circle-size="100"
          :icon-height="80"
          :icon-width="90"
          :order-number="7"
          component-height="100px"
          component-width="100%"
          :icon-url="baseImgaeUrl+data.iconUrl"
          :title="data.title"
      ></TitleComponent>
    </div>
    <div class="main-content-wrapper">
      <div class="text-content fade-right" :style="textContentStyles">
        <p :style="{ fontSize: data.styles.textContent.fontSize }">
          {{ data.content }}
        </p>
        <img
            class="img2 fade-left"
            :src="baseImgaeUrl+data.image.src"
            :alt="data.image.alt"
            :style="imageStyles"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComponent from "./TitleQickSale.vue";
import { ref, computed } from 'vue';
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Props hoặc dữ liệu động (có thể nhận từ API hoặc prop)
const props = defineProps({
  sectionData: {
    type: Object,
    default: () => ({})
  }
});

// Sử dụng dữ liệu động, fallback về dữ liệu mặc định nếu không có
const data = computed(() => {
  const defaultData = {
    title: "Triển khai bán nhanh bất động sản",
    iconUrl: "/imgs/icon-trien-khai.png",
    content: "Các chiến dịch được triển khai đồng bộ. Đội ngũ môi giới, chăm sóc khách hàng liên tục tiếp nhận phản hồi, lọc khách thật và sắp xếp lịch xem nhà nhanh nhất — rút ngắn thời gian chốt giao dịch.",
    image: {
      src: "/imgs/anh-trien-khai-1.png",
      alt: "Triển khai bán nhanh"
    },
    styles: {
      section: {
        marginTop: "60px",
        padding: "30px 20px",
        paddingBottom: "100px",
        marginBottom: "80px",
        borderColor: "#C2CBF0",
        dashWidth: "5px",
        dashPositionLeft: "75px",
        dashWidthPercent: "80%",
        dashHeightPercent: "132%"
      },
      textContent: {
        backgroundColor: "white",
        borderColor: "#031358",
        borderWidth: "2px",
        borderRadius: "20px",
        marginLeft: "12%",
        marginRight: "12%",
        paddingLeft: "50px",
        paddingRight: "42%",
        minHeight: "200px",
        fontSize: "17px"
      },
      image: {
        width: "40%",
        positionTop: "-100px"
      },
      titleContainer: {
        width: "40%"
      }
    }
  };
  // Nếu sectionData có dữ liệu thực sự, dùng hoàn toàn
  if (props.sectionData && Object.keys(props.sectionData).length > 0) {
    return props.sectionData.section7;
  }

  // Ngược lại dùng default
  return defaultData;
});


// Computed styles
const sectionStyles = computed(() => ({
  marginTop: data.value.styles.section.marginTop,
  padding: data.value.styles.section.padding,
  paddingBottom: data.value.styles.section.paddingBottom,
  marginBottom: data.value.styles.section.marginBottom,
  position: 'relative',
  overflow: 'visible'
}));

const textContentStyles = computed(() => ({
  backgroundColor: data.value.styles.textContent.backgroundColor,
  border: `${data.value.styles.textContent.borderWidth} solid ${data.value.styles.textContent.borderColor}`,
  borderRadius: data.value.styles.textContent.borderRadius,
  marginLeft: data.value.styles.textContent.marginLeft,
  marginRight: data.value.styles.textContent.marginRight,
  paddingLeft: data.value.styles.textContent.paddingLeft,
  paddingRight: data.value.styles.textContent.paddingRight,
  minHeight: data.value.styles.textContent.minHeight,
  zIndex: 2,
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
}));

const imageStyles = computed(() => ({
  width: data.value.styles.image.width,
  position: 'absolute',
  right: '0px',
  top: data.value.styles.image.positionTop
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

.section7::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: v-bind('data.styles.section.dashWidthPercent');
  height: v-bind('data.styles.section.dashHeightPercent');
  border-left: v-bind('data.styles.section.dashWidth') dashed v-bind('data.styles.section.borderColor');
  border-bottom: v-bind('data.styles.section.dashWidth') dashed v-bind('data.styles.section.borderColor');
  margin-left: v-bind('data.styles.section.dashPositionLeft');
  z-index: 0;
}

.section7 {
  margin-top: v-bind('data.styles.section.marginTop');
  position: relative;
  overflow: visible;
  padding: v-bind('data.styles.section.padding');
  padding-bottom: v-bind('data.styles.section.paddingBottom');
  margin-bottom: v-bind('data.styles.section.marginBottom');
}

.section7 .title-component {
  transform: translateY(-70px);
}

.section7 p {
  text-align: justify;
  margin: 0;
}

.section7 .main-content-wrapper {
  margin-top: 50px;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .section7 {
    margin-bottom: 30px;
  }

  .section7::before {
    border-bottom: 0;
    height: 130%;
  }

  /* Điều chỉnh text-content */
  .section7 .text-content {
    margin: 20px 0 0 0;
    padding: 20px;
    padding-right: 40%;
    width: 100%;
    box-sizing: border-box;
  }

  /* Điều chỉnh main content wrapper */
  .main-content-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .section7 .st-title {
    display: block;
    margin-left: auto;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .img2 {
    left: 35%;
  }

  .section7 .text-content {
    padding-right: 20px;
  }

  .section7::before {
    border-bottom: 0;
    height: 105%;
  }

  .section7 .img2 {
    top: -130px;
  }
}
</style>