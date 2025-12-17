<template>
  <div class="section section2" :id="sectionData.id">
    <div class="st-title">
      <TitleComponent
          :circle-size="sectionData.circleSize"
          :icon-height="sectionData.iconHeight"
          :icon-width="sectionData.iconWidth"
          :order-number="sectionData.order"
          component-height="80px"
          component-width="100%"
          :icon-url="baseImgaeUrl+sectionData.icon"
          :title="sectionData.title"
          :is-right="sectionData.titlePosition === 'right'"
      ></TitleComponent>
    </div>
    <div class="main-content-wrapper">

      <img
          :class="sectionData.images.img1.className"
          :src="baseImgaeUrl+sectionData.images.img1.src"
          :alt="sectionData.images.img1.alt"
          :style="{ zIndex: sectionData.images.img1.zIndex }"
      >

      <img
          v-if="sectionData.images.img1rb.showOnMobile || !isMobile"
          :class="sectionData.images.img1rb.className"
          :src="baseImgaeUrl+sectionData.images.img1rb.src"
          :alt="sectionData.images.img1rb.alt"
          :style="{ zIndex: sectionData.images.img1rb.zIndex }"
      >

      <div
          class="text-content fade-right"
          :style="{
          backgroundColor: sectionData.backgroundColor,
          boxShadow: sectionData.boxShadow,
          borderRadius: sectionData.borderRadius,
          padding: isMobile ? '20px' : sectionData.padding,
          zIndex: 2
        }"
      >
        <div class="rich-text-editor-wrapper">
          <div v-html="sectionData.textContent.paragraph"
              :style="{
          fontSize: sectionData.textContent.fontSize,
          textAlign: sectionData.textContent.textAlign

          }">

          </div>
        </div>
        <img
            class="img2"
            :src="baseImgaeUrl+sectionData.images.img2.src"
            :alt="sectionData.images.img2.alt"
            :style="isMobile ? {} : {
            position: 'absolute',
            bottom: sectionData.images.img2.position.bottom,
            right: sectionData.images.img2.position.right
          }"
        >
      </div>

    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue';
import TitleComponent from "./TitleQickSale.vue";
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Dữ liệu động - có thể fetch từ API hoặc CMS
const sectionData = ref({
  id: "agree-price",
  order: 2,
  title: "Đồng ý giá sơ bộ",
  icon: "/imgs/icon-dong-y-gia-so-bo.png",
  iconWidth: 90,
  iconHeight: 80,
  circleSize: 100,
  titlePosition: "right",
  backgroundColor: "#ffffff",
  borderRadius: "20px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  padding: "20px 20px 20px 20%",
  textContent: {
    paragraph: "Sau khi nhận được kết quả định giá, khách hàng và chuyên viên thống nhất mức giá đề xuất. Việc đồng thuận này giúp toàn bộ kế hoạch triển khai bán hàng sau đó được xây dựng trên cơ sở chính xác, phù hợp với thị trường.",
    fontSize: "17px",
    textAlign: "justify"
  },
  images: {
    img1: {
      src: "/imgs/anh-dong-y-1.png",
      alt: "Đồng ý giá sơ bộ 1",
      className: "img1 fade-left",
      zIndex: 1
    },
    img1rb: {
      src: "/imgs/anh-dong-y-1-rb.png",
      alt: "Đồng ý giá sơ bộ 1 rb",
      className: "img1rb fade-left",
      zIndex: 3,
      showOnMobile: false
    },
    img2: {
      src: "/imgs/anh-dong-y-2.png",
      alt: "Đồng ý giá sơ bộ 2",
      className: "img2",
      position: {
        bottom: "-200px",
        right: "-100px"
      }
    }
  },
  layout: {
    borderStyle: "dashed",
    borderColor: "#C2CBF0",
    borderWidth: "5px"
  }
});

const props = defineProps({
  sectionData: Object
})
if (props.sectionData) {
  sectionData.value = props.sectionData.section2;
  console.log("Đã nhận được data từ cha")
}


// Responsive handling
const isMobile = ref(false);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth <= 1400;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize);
});

// Function để cập nhật dữ liệu từ CMS (có thể gọi từ parent component)
const updateSectionData = (newData) => {
  sectionData.value = {...sectionData.value, ...newData};
};

// Export hàm update nếu cần
defineExpose({
  updateSectionData
});
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

.section2::before {
  content: "";
  position: absolute;
  top: 0;
  left: -7px;
  width: 80%; /* nửa chiều rộng */
  height: 100%;
  border-top: v-bind('sectionData.layout.borderWidth + " " + sectionData.layout.borderStyle + " " + sectionData.layout.borderColor');
  border-left: v-bind('sectionData.layout.borderWidth + " " + sectionData.layout.borderStyle + " " + sectionData.layout.borderColor');
  margin-left: 75px;
  z-index: 0;
}

.section2 {
  margin-bottom: 40px;
  position: relative;
  overflow: visible;
  padding: 30px 20px 200px;
}

.section2 .title-component {
  transform: translateY(-70px);
}

.section2 .st-title {
  display: block;
  margin-left: auto;
  width: 40%;
}

.section2 .img1 {
  position: absolute;
}

.section2 .img1rb {
  position: absolute;
}

.section2 .main-content-wrapper {
  margin-top: 50px;
}

.section2 .text-content {
  width: 100%;
  margin-left: 25%;
  margin-right: 12.5%;
  margin-top: 20px;
  position: relative;
}

@media (max-width: 768px) {
  /* Thêm các style mobile nếu cần */
}

/* Responsive Design */
@media (max-width: 1400px) {
  .section2 {
    margin-bottom: 30px;
    padding: v-bind('sectionData.layout.mobileSettings?.padding || "20px 20px 150px"');
  }

  .section2::before {
    width: 2px;
  }

  .section2 .img1, .section2 .img1rb {
    position: static;
  }

  /* Ẩn img1rb khi thu nhỏ nếu cấu hình yêu cầu */
  .section2 .img1rb {
    display: v-bind('sectionData.images.img1rb.showOnMobile ? "block" : "none"');
  }

  /* Đặt tất cả về static */
  .section2 .img1,
  .section2 .img2,
  .section2 .text-content {
    position: static;
  }

  /* Canh giữa img1 */
  .section2 .img1 {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }

  /* Canh giữa img2 */
  .section2 .img2 {
    display: block;
    margin: 20px auto 0;
    max-width: 100%;
    position: static;
  }

  /* Điều chỉnh text-content */
  .section2 .text-content {
    margin: 20px 0 0 0;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
  }

  /* Điều chỉnh main content wrapper */
  .main-content-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .section2 .st-title {
    display: block;
    margin-left: auto;
    width: 100%;
  }
}
</style>