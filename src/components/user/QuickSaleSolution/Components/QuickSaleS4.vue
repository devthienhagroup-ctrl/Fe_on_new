<template>
  <div
      class="section section4"
      :style="{
      padding: sectionData.styles.section.padding,
      marginBottom: sectionData.styles.section.marginBottom,
      maxWidth: sectionData.styles.section.maxWidth
    }"
  >
    <div class="st-title" :style="{ width: sectionData.styles.titleWrapper.width }">
      <TitleComponent
          :circle-size="sectionData.title.circleSize"
          :icon-height="sectionData.title.iconHeight"
          :icon-width="sectionData.title.iconWidth"
          :order-number="sectionData.title.orderNumber"
          :component-height="sectionData.title.componentHeight"
          :component-width="sectionData.title.componentWidth"
          :icon-url="baseImgaeUrl+sectionData.title.iconUrl"
          :title="sectionData.title.text"
          :is-right="sectionData.title.isRight"
      >
      </TitleComponent>
    </div>
    <div class="main-content-wrapper">
      <div class="left-content-section" :class="sectionData.content.leftImage.class">
        <img
            :src="baseImgaeUrl+sectionData.content.leftImage.url"
            :alt="sectionData.content.leftImage.alt"
        >
      </div>

      <div class="right-content-section" :style="{ paddingRight: sectionData.styles.rightSection.paddingRight }">
        <div
            class="text-content-wrapper"
            :class="sectionData.content.textContent.wrapperClass"
            :style="{
            padding: sectionData.content.textContent.padding,
            border: `3px solid ${sectionData.content.textContent.borderColor}`,
            borderLeft: '0',
            borderTopRightRadius: sectionData.content.textContent.borderRadius,
            backgroundColor: sectionData.content.textContent.backgroundColor
          }"
        >
          <div class="text-content">
            <div class="rich-text-editor-wrapper">
              <div class="tiptap" v-html="sectionData.content.textContent.paragraph"
                  :style="{
              lineHeight: sectionData.styles.text.lineHeight,
              fontSize: sectionData.styles.text.fontSize,
              color: sectionData.styles.text.color,
              textAlign: sectionData.styles.text.textAlign
              }">
              </div>
            </div>
          </div>
        </div>
        <div class="img-right" :class="sectionData.content.rightImage.class">
          <img
              :src="baseImgaeUrl+sectionData.content.rightImage.url"
              :alt="sectionData.content.rightImage.alt"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComponent from "./TitleQickSale.vue";
import {ref} from 'vue';
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Dữ liệu động
let sectionData = ref({
  id: "section4",
  title: {
    orderNumber: 4,
    text: "Đánh giá giao dịch thực tế",
    iconUrl: "/imgs/icon-danh-gia-giao-dich.png",
    circleSize: 100,
    iconWidth: 109,
    iconHeight: 109,
    isRight: true,
    componentWidth: "100%",
    componentHeight: "80px"
  },
  content: {
    leftImage: {
      url: "/imgs/anh-danh-gia-giao-dich-1.png",
      alt: "dgsb",
      class: "fade-left"
    },
    textContent: {
      paragraph: "Sau khi khảo sát, đội ngũ chuyên môn sẽ cập nhật lại giá trị thực tế của bất động sản – đảm bảo mức giá vừa cạnh tranh, vừa giúp chủ nhà đạt lợi nhuận tối ưu khi giao dịch.",
      wrapperClass: "text-content-wrapper fade-right",
      borderColor: "#031358",
      backgroundColor: "white",
      borderRadius: "50px",
      padding: "30px 40px"
    },
    rightImage: {
      url: "/imgs/anh-danh-gia-giao-dich-2.png",
      alt: "",
      class: "img-right fade-up"
    }
  },
  styles: {
    section: {
      padding: "50px 20px",
      marginBottom: "40px",
      maxWidth: "1400px"
    },
    titleWrapper: {
      width: "40%",
      mobileWidth: "100%"
    },
    rightSection: {
      paddingRight: "130px",
      mobilePaddingRight: "0"
    },
    text: {
      fontSize: "17px",
      mobileFontSize: "15px",
      lineHeight: "1.6",
      color: "#333",
      textAlign: "justify"
    },
    dashedBorder: {
      color: "#C2CBF0",
      width: "5px"
    }
  }
});

const props = defineProps({
  sectionData: Object
})
if (props.sectionData) {
  sectionData = props.sectionData.section4;
  console.log("Đã nhận được data từ cha")
}

</script>

<style scoped>
.section {
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: visible;
}

.main-content-wrapper {
  box-sizing: border-box;
}

.title-component {
  z-index: 1;
}

.st-title {
  display: block;
  margin-left: auto;
}

.text-content-wrapper {
  margin-top: 5px;
  position: relative;
  border-left: 0;
}

.text-content-wrapper::before {
  content: "";
  position: absolute;
  border-right: 5px dashed #C2CBF0;
  border-bottom: 5px dashed #C2CBF0;
  width: 109%;
  height: 155%;
  right: -85px;
  top: -60px;
}

.img-right {
  position: relative;
}

.img-right::before {
  content: "";
  position: absolute;
  border-left: 5px dashed #C2CBF0;
  width: 113%;
  height: 125%;
  left: 24px;
  top: 21px;
}

.right-content-section {
  position: relative;
}

.section4 .title-component {
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
}

.left-content-section img {
  width: 100%;
}

.st-title {
  width: 40%;
}

.right-content-section img {
  width: 100%;
  transform: translate(40px, 40px);
}

/* Responsive Design */
@media (max-width: 1400px) {
  .st-title {
    width: 100% !important;
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

  .left-content-section img {
    width: auto;
    max-width: 80%;
  }

  .text-content-wrapper {
    display: block;
    margin-bottom: 20px;
    border: 3px solid #031358;
    border-radius: 20px;
    padding: 20px;
  }

  .right-content-section::before {
    display: none;
  }

  .section4 {
    position: relative;
  }

  .section4::before {
    content: "";
    position: absolute;
    width: 1%;
    height: 100%;
    border-right: 5px dashed #C2CBF0;
    right: 70px;
    z-index: -1;
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

  .text-content p {
    font-size: v-bind('sectionData.styles.text.mobileFontSize');
    line-height: 1.5;
    text-align: left;
  }

  .right-content-section {
    padding-right: v-bind('sectionData.styles.rightSection.mobilePaddingRight');
  }
}

@media (max-width: 768px) {
  .section {
    padding: 20px;
    margin-bottom: 30px;
  }

  .right-content-section {
    padding-right: 0;
    z-index: 2;
  }

  .section4::before {
    right: 69px;
  }

  .text-content-wrapper {
    padding: 15px;
    margin-bottom: 15px;
  }

  .text-content p {
    font-size: 15px;
  }
}
</style>