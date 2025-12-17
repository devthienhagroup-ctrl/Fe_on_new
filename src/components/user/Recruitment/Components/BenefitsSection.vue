<template>
  <div class="benefits-section">
    <div class="benefits-container">
      <div class="benefits-grid">
        <!-- Cột trái -->
        <div class="benefits-left-column">
          <div
              v-for="(benefit, index) in leftColumnBenefits"
              :key="index"
              class="benefit-item"
              @mouseenter="handleMouseEnter(index)"
              @mouseleave="handleMouseLeave"
              @touchstart="handleTouchStart(index)"
          >
            <div
                class="benefit-image"
                :style="{ backgroundImage: `url(${getImageUrl(benefit.image)})` }"
            >
              <!-- Overlay trắng mở rộng từ trên xuống -->
              <div class="white-overlay" :class="{
                active: hoverIndex === index || (isTouchDevice && autoHoverIndex === index && hoverIndex === -1)
              }"></div>

              <!-- Nội dung hiển thị trên nền trắng -->
              <div class="benefit-content" :class="{
                active: hoverIndex === index || (isTouchDevice && autoHoverIndex === index && hoverIndex === -1)
              }">
                <h3 class="benefit-title" :class="{
                  hovered: hoverIndex === index || (isTouchDevice && autoHoverIndex === index && hoverIndex === -1)
                }">
                  {{ benefit.title }}
                </h3>
                <div
                    class="benefit-description"
                    :class="{
                      active: hoverIndex === index || (isTouchDevice && autoHoverIndex === index && hoverIndex === -1)
                    }"
                >
                  <div class="description-line"></div>
                  <p>{{ benefit.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cột phải -->
        <div class="benefits-right-column">
          <div
              v-for="(benefit, index) in rightColumnBenefits"
              :key="index + 2"
              class="benefit-item"
              @mouseenter="handleMouseEnter(index + 2)"
              @mouseleave="handleMouseLeave"
              @touchstart="handleTouchStart(index + 2)"
          >
            <div
                class="benefit-image"
                :style="{ backgroundImage: `url(${getImageUrl(benefit.image)})` }"
            >
              <!-- Overlay trắng mở rộng từ trên xuống -->
              <div class="white-overlay" :class="{
                active: hoverIndex === index + 2 || (isTouchDevice && autoHoverIndex === index + 2 && hoverIndex === -1)
              }"></div>

              <!-- Nội dung hiển thị trên nền trắng -->
              <div class="benefit-content" :class="{
                active: hoverIndex === index + 2 || (isTouchDevice && autoHoverIndex === index + 2 && hoverIndex === -1)
              }">
                <h3 class="benefit-title" :class="{
                  hovered: hoverIndex === index + 2 || (isTouchDevice && autoHoverIndex === index + 2 && hoverIndex === -1)
                }">
                  {{ benefit.title }}
                </h3>
                <div
                    class="benefit-description"
                    :class="{
                      active: hoverIndex === index + 2 || (isTouchDevice && autoHoverIndex === index + 2 && hoverIndex === -1)
                    }"
                >
                  <div class="description-line"></div>
                  <p>{{ benefit.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

const hoverIndex = ref(-1)
const autoHoverIndex = ref(0)
const isTouchDevice = ref(false)

// Config object
const config = ref({
  // Section settings
  section: {
    maxWidth: '1400px',
    gridGap: '40px',
    columnGap: '40px',
  },

  // Benefits data
  benefits: [
    {
      title: "Khen thưởng",
      image: "khen-thuong.jpg",
      description: "Tại Thiên Hà Group, mọi nỗ lực và thành tích đều được ghi nhận xứng đáng. Những phần thưởng hấp dẫn, kịp thời dành cho các cá nhân có đóng góp nổi bật hay ý tưởng sáng tạo được áp dụng thành công – chính là cách chúng tôi lan tỏa tinh thần cống hiến và khuyến khích sự khác biệt."
    },
    {
      title: "Phát triển sự nghiệp",
      image: "phat-trien.jpg",
      description: "Thiên Hà Group tin rằng con người là nền tảng của mọi thành công. Chúng tôi xây dựng lộ trình phát triển rõ ràng, cơ hội thăng tiến rộng mở cùng các khóa đào tạo chuyên sâu giúp bạn không ngừng hoàn thiện bản thân. Cùng chúng tôi, bạn không chỉ có công việc – mà còn là một hành trình sự nghiệp bền vững."
    },
    {
      title: "Môi trường làm việc",
      image: "moi-truong.png",
      description: "Chúng tôi mang đến không gian làm việc hiện đại, trang thiết bị đầy đủ, cùng văn hóa thân thiện và đội ngũ quản lý chuyên nghiệp. Thiên Hà Group là nơi bạn có thể phát huy năng lực, học hỏi không ngừng và tận hưởng bầu không khí làm việc năng động – hiệu quả mỗi ngày."
    },
    {
      title: "Chăm sóc sức khỏe",
      image: "suc-khoe.png",
      description: "Sức khỏe luôn là ưu tiên hàng đầu. Nhân viên Thiên Hà Group được hưởng các quyền lợi như bảo hiểm xã hội, bảo hiểm quốc tế, chương trình khám sức khỏe định kỳ cùng nhiều hoạt động thể thao – giúp giữ gìn cân bằng cuộc sống. Chúng tôi mong muốn mỗi thành viên đều an tâm, khỏe mạnh và tràn đầy năng lượng để phát triển lâu dài."
    }
  ],

  // Item settings
  item: {
    height: '700px',
    borderRadius: '8px',
    shadow: {
      normal: '0 4px 6px rgba(0, 0, 0, 0.1)',
      hover: '0 10px 25px rgba(0, 0, 0, 0.2)'
    }
  },

  // Column settings
  columns: {
    rightPaddingTop: '145px',
    leftPaddingTop: '0'
  },

  // Typography settings
  typography: {
    fontFamily: "'Ubuntu', sans-serif",
    title: {
      fontSize: '33px',
      color: 'white',
      hoverColor: '#031358',
      fontWeight: 'bolder'
    },
    description: {
      fontSize: '20px',
      color: 'white',
      hoverColor: '#031358',
      lineHeight: '1.6',
      maxWidth: '700px'
    }
  },

  // Colors
  colors: {
    primary: '#031358',
    overlay: 'rgba(255, 255, 255, 0.95)',
    descriptionLine: {
      normal: 'white',
      hover: '#031358'
    }
  },

  // Spacing
  spacing: {
    containerPadding: '0 20px',
    contentPadding: '40px',
    contentPaddingBottom: '60px',
    titleMarginBottom: {
      normal: '0px',
      hover: '30px'
    },
    lineWidth: '50px',
    lineHeight: '2px',
    lineMargin: '0 auto 20px'
  },

  // Animations
  animations: {
    duration: '0.5s',
    timing: 'ease'
  },

  // Responsive breakpoints
  responsive: {
    maxWidth: '1200px',
    itemHeight: '400px',
    titleFontSize: '28px',
    descriptionFontSize: '18px'
  }
})

const props = defineProps({
  sectionData: Object
})

if(props.sectionData) {
  config.value = props.sectionData;
  console.log("Đã nhận props từ cha", config);
}

// Computed properties
const benefits = computed(() => config.value.benefits)
const leftColumnBenefits = computed(() => [config.value.benefits[0], config.value.benefits[2]])
const rightColumnBenefits = computed(() => [config.value.benefits[1], config.value.benefits[3]])

// Device detection
const checkTouchDevice = () => {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
}

// Event handlers
const handleMouseEnter = (index) => {
  hoverIndex.value = index
}

const handleMouseLeave = () => {
  hoverIndex.value = -1
}

const handleTouchStart = (index) => {
  if (isTouchDevice.value) {
    hoverIndex.value = index
    setTimeout(() => {
      if (hoverIndex.value === index) {
        hoverIndex.value = -1
      }
    }, 5000)
  }
}

// Image URL helper
const getImageUrl = (imageName) => {
  return baseImgaeUrl+imageName;
}

onMounted(() => {
  isTouchDevice.value = checkTouchDevice()
})
</script>

<style scoped>
.benefits-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.benefits-container {
  max-width: v-bind('config.section.maxWidth');
  width: 100%;
  padding: v-bind('config.spacing.containerPadding');
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: v-bind('config.section.gridGap');
  width: 100%;
}

/* Cột trái */
.benefits-left-column {
  padding-top: v-bind('config.columns.leftPaddingTop');
  display: flex;
  flex-direction: column;
  gap: v-bind('config.section.columnGap');
}

/* Cột phải */
.benefits-right-column {
  padding-top: v-bind('config.columns.rightPaddingTop');
  display: flex;
  flex-direction: column;
  gap: v-bind('config.section.columnGap');
}

.benefit-item {
  width: 100%;
  height: v-bind('config.item.height');
  position: relative;
  overflow: hidden;
  border-radius: v-bind('config.item.borderRadius');
  cursor: pointer;
  box-shadow: v-bind('config.item.shadow.normal');
  transition: box-shadow v-bind('config.animations.duration') v-bind('config.animations.timing');
}

.benefit-item:hover {
  box-shadow: v-bind('config.item.shadow.hover');
}

.benefit-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
  transition: all v-bind('config.animations.duration') v-bind('config.animations.timing');
}

/* Overlay trắng mở rộng từ trên xuống */
.white-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: v-bind('config.colors.overlay');
  transition: height v-bind('config.animations.duration') v-bind('config.animations.timing');
  z-index: 1;
}

.white-overlay.active {
  height: 100%;
}

/* CĂN GIỮA NỘI DUNG */
.benefit-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  padding: v-bind('config.spacing.contentPadding');
  padding-bottom: v-bind('config.spacing.contentPaddingBottom');
  transition: all v-bind('config.animations.duration') v-bind('config.animations.timing');
  box-sizing: border-box;
}

.benefit-content.active {
  justify-content: center;
}

.benefit-title {
  color: v-bind('config.typography.title.color');
  font-size: v-bind('config.typography.title.fontSize');
  text-align: center;
  margin-bottom: v-bind('config.spacing.titleMarginBottom.normal');
  transition: all v-bind('config.animations.duration') v-bind('config.animations.timing');
  width: 100%;
  font-weight: v-bind('config.typography.title.fontWeight');
}

.benefit-title.hovered {
  color: v-bind('config.typography.title.hoverColor');
  margin-bottom: v-bind('config.spacing.titleMarginBottom.hover');
}

.benefit-description {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all v-bind('config.animations.duration') v-bind('config.animations.timing');
  width: 100%;
  max-width: v-bind('config.typography.description.maxWidth');
  text-align: justify;
}

.benefit-description.active {
  opacity: 1;
  max-height: 400px;
}

.description-line {
  width: v-bind('config.spacing.lineWidth');
  height: v-bind('config.spacing.lineHeight');
  background-color: v-bind('config.colors.descriptionLine.normal');
  margin: v-bind('config.spacing.lineMargin');
  transition: background-color v-bind('config.animations.duration') v-bind('config.animations.timing');
}

.benefit-description.active .description-line {
  background-color: v-bind('config.colors.descriptionLine.hover');
}

.benefit-description p {
  color: v-bind('config.typography.description.color');
  font-size: v-bind('config.typography.description.fontSize');
  line-height: v-bind('config.typography.description.lineHeight');
  transition: color v-bind('config.animations.duration') v-bind('config.animations.timing');
  margin: 0;
}

.benefit-description.active p {
  color: v-bind('config.typography.description.hoverColor');
}

/* Responsive Styles - Giữ nguyên breakpoints */
@media (max-width: 1200px) {
  .benefits-container {
    padding: 0 30px;
  }

  .benefit-item {
    height: v-bind('config.responsive.itemHeight');
  }

  .benefit-content {
    padding: 30px;
  }

  .benefit-title {
    font-size: v-bind('config.responsive.titleFontSize');
  }

  .benefit-description p {
    font-size: v-bind('config.responsive.descriptionFontSize');
  }
}

@media (max-width: 992px) {
  .benefits-grid {
    gap: 30px;
  }

  .benefits-left-column,
  .benefits-right-column {
    gap: 30px;
  }

  .benefit-item {
    height: 350px;
  }

  .benefit-content {
    padding: 25px;
  }

  .benefit-title {
    font-size: 24px;
  }

  .benefit-description p {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .benefits-right-column {
    padding-top: 0;
  }

  .benefits-left-column,
  .benefits-right-column {
    gap: 25px;
  }

  .benefit-item {
    height: 300px;
  }

  .benefit-content {
    padding: 20px;
  }

  .benefit-title {
    font-size: 22px;
    margin-bottom: 15px;
  }

  .benefit-title.hovered {
    margin-bottom: 20px;
  }

  .description-line {
    margin: 0 auto 15px;
  }

  .benefit-description p {
    font-size: 15px;
    line-height: 1.4;
  }
}

@media (max-width: 576px) {
  .benefits-container {
    padding: 0 15px;
  }

  .benefits-grid {
    gap: 20px;
  }

  .benefits-left-column,
  .benefits-right-column {
    gap: 20px;
  }

  .benefit-item {
    height: 250px;
  }

  .benefit-content {
    padding: 15px;
  }

  .benefit-title {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .benefit-title.hovered {
    margin-bottom: 15px;
  }

  .description-line {
    width: 40px;
    margin: 0 auto 12px;
  }

  .benefit-description p {
    font-size: 14px;
    line-height: 1.3;
  }
}

@media (max-width: 480px) {
  .benefit-item {
    height: 220px;
  }

  .benefit-content {
    padding: 12px;
  }

  .benefit-title {
    font-size: 18px;
  }

  .benefit-description p {
    font-size: 13px;
  }
}

/* Touch device optimization */
@media (hover: none) and (pointer: coarse) {
  .benefit-item {
    cursor: pointer;
  }
}

/* High-resolution displays */
@media (min-width: 1600px) {
  .benefits-container {
    max-width: 1800px;
  }

  .benefit-title {
    font-size: 36px;
  }

  .benefit-description p {
    font-size: 22px;
  }
}
</style>