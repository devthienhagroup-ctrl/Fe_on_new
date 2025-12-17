<template>
  <div class="quy-trinh-container">
    <!-- Tiêu đề -->
    <div class="header-section fade-up">
      <h1
          class="main-title"
          :style="{
          color: processData.styles.mainTitleColor,
          background: processData.styles.mainTitleBg
        }"
      >
        {{ processData.title }}
      </h1>
      <br>
      <div class="subtitle-section">
        <h2
            class="subtitle"
            :style="{ color: processData.styles.subtitleColor }"
        >
          {{ processData.subtitle }}
        </h2>
        <div
            class="underline"
            :style="{ background: processData.styles.underlineBg }"
        ></div>
      </div>
    </div>

    <!-- Nội dung chính - 2 cột -->
    <div class="content-wrapper">
      <!-- Cột trái - Danh sách quy trình -->
      <div class="left-column">
        <div
            class="dashed-line-main"
            :style="{ borderLeftColor: processData.styles.dashedLineColor }"
        ></div>
        <ProcessStep
            v-for="step in processData.steps"
            :key="step.id"
            :number="step.order"
            :title="step.title"
            :content="step.content"
            :icon="step.icon"
        />
      </div>

      <!-- Cột phải - Ảnh -->
      <div class="right-column">
        <img
            :src="baseImgaeUrl+processData.image"
            :alt="processData.imageAlt"
            class="process-image"
            :style="{
              borderRadius: processData.styles.imageBorderRadius,
              boxShadow: processData.styles.imageShadow
            }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ProcessStep from './ProcessStep.vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Dữ liệu mặc định (có thể thay thế bằng API call sau này)
let defaultData = {
  title: "Quy trình",
  subtitle: "7 BƯỚC ĐỊNH GIÁ SƠ BỘ BẤT ĐỘNG SẢN",
  image: "/imgs/bg-quy-trinh-7.png",
  imageAlt: "Quy trình định giá bất động sản",
  steps: [
    // ... giữ nguyên các step ...
  ],
  styles: {
    mainTitleBg: "linear-gradient(90deg, #031358, #000a85)",
    mainTitleColor: "#fff",
    subtitleColor: "#031358",
    underlineBg: "linear-gradient(90deg, #031358, #000a85)",
    dashedLineColor: "#002FFF",
    imageBorderRadius: "12px",
    imageShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    // Thêm styles cho ProcessStep
    stepStyles: {
      circle: {
        border: '2px solid #002FFF',
        backgroundColor: 'white',
        color: '#002FFF',
        fontSize: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        flexShrink: '0',
        marginTop: '20px'
      },
      title: {
        color: '#031358',
        fontSize: '20px',
        height: '68px',
        paddingLeft: '70px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: 'bold'
      },
      border: {
        borderBottom: '5px solid #002FFF',
        borderBottomRightRadius: '32px',
        height: '68px',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        pointerEvents: 'none'
      },
      icon: {
        fontSize: '40px',
        color: '#002FFF'
      },
      dashedLine: {
        borderLeft: '2px dashed #002FFF',
        height: '50px',
        left: '76px',
        top: '-30px',
        width: '2px',
        position: 'absolute'
      },
      content: {
        backgroundColor: 'white',
        color: '#031358',
        fontSize: '17px',
        padding: '20px',
        marginTop: '30px',
        marginLeft: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        lineHeight: '1.5',
        position: 'relative',
        zIndex: '1'
      }
    }
  }
}

const props = defineProps({
  sectionData: String
})

if(props.sectionData) {
  const sectionData = JSON.parse(props.sectionData);
  defaultData = sectionData.processData;
  console.log("Đã lấy dữ liệu từ props", defaultData);
}

// Dữ liệu động - có thể thay thế bằng API call
const processData = ref(defaultData)

// Export data để sử dụng ở component khác nếu cần
defineExpose({
  processData
})
</script>

<style scoped>
.quy-trinh-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Header Section */
.header-section {
  text-align: center;
  font-family: "Ubuntu", sans-serif;
  margin-bottom: 30px;
}

.main-title {
  display: inline-block;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle-section {
  display: inline-block;
  text-align: center;
}

.subtitle {
  font-size: 40px;
  font-weight: 700;
  margin: 0;
}

.underline {
  width: 60px;
  height: 3px;
  margin: 6px auto 0;
  border-radius: 5px;
}

/* Content Layout */
.content-wrapper {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

/* Left Column - Process Steps */
.left-column {
  flex: 1.5;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.dashed-line-main {
  width: 2px;
  height: 87%;
  border-left: 2px dashed;
  position: absolute;
  left: 30px;
  top: 40px;
  z-index: -1;
}

/* Right Column - Image */
.right-column {
  flex: 1;
  position: sticky;
  top: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

.process-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

/* Deep CSS cho ProcessStep component */
:deep(.circle-number) {
  border: 2px solid #002FFF !important;
  background-color: white !important;
  color: #002FFF !important;
  font-size: 20px !important;
  width: 60px !important;
  height: 60px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: bold !important;
  flex-shrink: 0 !important;
  margin-top: 20px !important;
}

:deep(.title-text) {
  color: #031358 !important;
  font-size: 20px !important;
  height: 68px !important;
  padding-left: 70px !important;
  display: flex !important;
  align-items: center !important;
  font-weight: bold !important;
}

:deep(.rectangle-border) {
  border-bottom: 5px solid #002FFF !important;
  border-bottom-right-radius: 32px !important;
  height: 68px !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  pointer-events: none !important;
}

:deep(.step-icon) {
  font-size: 40px !important;
  color: #002FFF !important;
}

:deep(.dashed-line) {
  border-left: 2px dashed #002FFF !important;
  height: 50px !important;
  left: 76px !important;
  top: -30px !important;
  width: 2px !important;
  position: absolute !important;
}

:deep(.content-text) {
  background-color: white !important;
  color: #031358 !important;
  font-size: 17px !important;
  padding: 20px !important;
  margin-top: 30px !important;
  margin-left: 30px !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  line-height: 1.5 !important;
  position: relative !important;
  z-index: 1 !important;
}

/* Responsive Design - Tablet */
@media (max-width: 1024px) {
  .content-wrapper {
    gap: 40px;
  }

  .process-image {
    max-width: 400px;
  }
}

@media (max-width: 900px) {
  .content-wrapper {
    flex-direction: column-reverse;
    gap: 40px;
  }

  .right-column {
    position: relative;
    top: 0;
  }

  .process-image {
    max-width: 450px;
  }

  .dashed-line {
    left: 25px;
  }
}

/* Responsive Design - Mobile */
@media (max-width: 768px) {
  .quy-trinh-container {
    padding: 30px 15px;
  }

  .subtitle {
    font-size: 32px;
  }

  .header-section {
    margin-bottom: 40px;
  }

  .content-wrapper {
    gap: 30px;
  }

  .process-image {
    max-width: 100%;
  }

  .dashed-line {
    left: 20px;
  }

  /* Responsive cho ProcessStep */
  :deep(.circle-number) {
    width: 40px !important;
    height: 40px !important;
    font-size: 18px !important;
  }

  :deep(.title-text) {
    font-size: 18px !important;
    height: 60px !important;
  }

  :deep(.rectangle-border) {
    height: 60px !important;
    border-bottom-right-radius: 60px !important;
  }

  :deep(.content-text) {
    font-size: 16px !important;
    padding: 16px !important;
  }
}

@media (max-width: 480px) {
  .quy-trinh-container {
    padding: 20px 12px;
  }

  .main-title {
    font-size: 12px;
    padding: 3px 8px;
  }

  .subtitle {
    font-size: 24px;
  }

  .underline {
    width: 50px;
  }

  .content-wrapper {
    gap: 25px;
  }

  .left-column {
    gap: 15px;
  }

  .dashed-line {
    left: 18px;
    top: 30px;
  }
}

@media (max-width: 478px) {
  .subtitle {
    font-size: 22px;
  }

  .dashed-line {
    height: 86%;
  }
}
</style>