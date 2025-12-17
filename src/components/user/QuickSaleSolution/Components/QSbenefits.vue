<template>
  <div class="benefits-container">
    <h1
        class="main-title"
        :style="{
        color: sectionData.titleColor,
        fontSize: sectionData.titleFontSize
      }"
    >
      {{ sectionData.sectionTitle }}
    </h1>

    <div class="benefits-content">
      <!-- Cột bên trái - Danh sách lợi ích -->
      <div class="benefits-list">
        <div
            v-for="(benefit, index) in sectionData.benefits"
            :key="benefit.id"
            class="benefit-item"
            :class="{ active: activeBenefit?.id === benefit.id }"
            @click="setActiveBenefit(benefit)"
            :style="{
              '--border-color': sectionData.borderColor,
              '--active-border-color': sectionData.activeBorderColor,
              '--hover-shadow': sectionData.benefitItemHoverShadow,
              '--active-background': sectionData.activeBackground
            }"
        >
          <div class="benefit-header">
            <div class="benefit-number">
              {{ String(index + 1).padStart(2, '0') }}
            </div>
            <div class="benefit-title-wrapper">
              <div
                  class="progress-bar"
                  :style="{ background: sectionData.progressBarColor }"
              >
                <div
                    class="progress-fill"
                    :class="{ active: activeBenefit?.id === benefit.id }"
                    :style="{ background: sectionData.progressFillColor }"
                ></div>
              </div>
              <h3 class="benefit-title">{{ benefit.title }}</h3>
            </div>
            <div class="expand-icon">
              <i class="fas fa-chevron-down" :class="{ rotated: activeBenefit?.id === benefit.id }"></i>
            </div>
          </div>

          <transition name="slide">
            <div v-if="activeBenefit?.id === benefit.id" class="benefit-description">
              <p>{{ benefit.description }}</p>
            </div>
          </transition>
        </div>
      </div>

      <!-- Cột bên phải - Hình ảnh -->
      <div
          class="benefit-image-container"
          :style="{ height: sectionData.imageContainerHeight }"
      >
        <transition name="fade" mode="out-in">
          <div
              v-if="activeBenefit"
              :key="activeBenefit.id"
              class="benefit-image"
              :style="{ backgroundImage: `url(${baseImgaeUrl+activeBenefit.image})` }"
          >
            <div
                class="image-overlay"
                :style="{ background: sectionData.imageOverlayGradient }"
            ></div>
            <div class="image-content">
              <i :class="activeBenefit.icon"></i>
              <h3>{{ activeBenefit.title }}</h3>
            </div>
          </div>
          <div
              v-else
              class="placeholder-image"
              :style="{ background: sectionData.placeholderBackground }"
          >
            <i class="fas fa-home"></i>
            <p>Chọn một lợi ích để xem chi tiết</p>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

const props = defineProps({
  sectionData: Object,
})

// Dữ liệu động từ CMS
const sectionData = ref({
  sectionTitle: "LỢI ÍCH KHI CHỌN DỊCH VỤ BÁN NHANH BĐS CỦA THIÊN HÀ GROUP?",
  titleColor: "#031358",
  titleFontSize: "40px",
  borderColor: "#e8ecff",
  activeBorderColor: "#002FFF",
  progressBarColor: "#e8ecff",
  progressFillColor: "linear-gradient(90deg, #002FFF 0%, #4d74ff 100%)",
  benefitItemHoverShadow: "0 8px 25px rgba(3, 19, 88, 0.1)",
  activeBackground: "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
  imageOverlayGradient: "linear-gradient(to top, rgba(3, 19, 88, 0.8) 0%, rgba(3, 19, 88, 0.4) 50%, rgba(3, 19, 88, 0.2) 100%)",
  placeholderBackground: "linear-gradient(135deg, #031358 0%, #002FFF 100%)",
  imageContainerHeight: "500px",
  benefits: [
    {
      id: 1,
      title: "Bán nhanh bất động sản trong thời gian ngắn",
      description: "Chúng tôi cam kết giúp bạn bán bất động sản trong vòng 30 ngày nhờ vào chiến lược marketing mạnh mẽ và đội ngũ chuyên gia giàu kinh nghiệm.",
      icon: "fas fa-clock",
      image: "benefit12222222.jpg"
    },
    {
      id: 2,
      title: "Tiết kiệm thời gian và công sức",
      description: "Bạn không cần phải lo lắng về quá trình quảng bá, chúng tôi sẽ xử lý mọi khía cạnh từ việc xây dựng chiến lược đến triển khai, giúp bạn tiết kiệm thời gian quý báu.",
      icon: "fas fa-user-clock",
      image: "benefit2.jpg"
    },
    {
      id: 3,
      title: "Quy trình bán hàng tối ưu và chuyên nghiệp",
      description: "Với phương pháp bài bản, Thiên Hà Group giúp bạn đẩy nhanh tiến độ giao dịch mà vẫn đảm bảo tính minh bạch, uy tín, và hiệu quả.",
      icon: "fas fa-clipboard-check",
      image: "benefit3.jpg"
    },
    {
      id: 4,
      title: "Tiếp cận rộng rãi và chính xác khách hàng tiềm năng",
      description: "Chúng tôi sử dụng các kênh quảng cáo tối ưu, kết hợp với nghiên cứu đối tượng khách hàng, giúp bất động sản của bạn được tiếp cận đúng người và đúng thời điểm.",
      icon: "fas fa-bullseye",
      image: "benefit4.png"
    },
    {
      id: 5,
      title: "Tối ưu hóa chi phí marketing",
      description: "Dịch vụ bán nhanh của chúng tôi giúp bạn tiết kiệm chi phí quảng cáo không hiệu quả, đồng thời mang lại kết quả cao nhất với nguồn lực tối ưu.",
      icon: "fas fa-chart-line",
      image: "benefit5.jpg"
    }
  ]
})

if(props.sectionData) sectionData.value = props.sectionData

const activeBenefit = ref(null)

const setActiveBenefit = (benefit) => {
  activeBenefit.value = activeBenefit.value?.id === benefit.id ? null : benefit
}

onMounted(() => {
  // Tự động chọn benefit đầu tiên khi component được mount
  if (sectionData.value.benefits.length > 0) {
    activeBenefit.value = sectionData.value.benefits[0]
  }
})
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.benefits-container {
  font-family: 'Ubuntu', sans-serif;
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.main-title {
  text-align: center;
  margin-bottom: 60px;
  font-weight: 700;
  line-height: 1.2;
}

.benefits-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

/* Cột danh sách lợi ích */
.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-item {
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  overflow: hidden;
}

.benefit-item:hover {
  border-color: var(--active-border-color);
  transform: translateY(-2px);
  box-shadow: var(--hover-shadow);
}

.benefit-item.active {
  border-color: var(--active-border-color);
  background: var(--active-background);
}

.benefit-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.benefit-number {
  font-size: 24px;
  font-weight: 700;
  color: #031358;
  min-width: 40px;
}

.benefit-title-wrapper {
  flex: 1;
  position: relative;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.progress-fill.active {
  width: 100%;
}

.benefit-title {
  font-size: 20px;
  font-weight: 600;
  color: #031358;
  margin: 0;
  position: relative;
  z-index: 1;
  padding: 8px;
  transition: color 0.3s ease;
}

.benefit-item.active .benefit-title {
  color: white;
}

.expand-icon {
  color: #031358;
  transition: all 0.3s ease;
}

.expand-icon .rotated {
  transform: rotate(180deg);
  color: #002FFF;
}

/* Hiệu ứng mở rộng nội dung */
.benefit-description {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8ecff;
}

.benefit-description p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
  font-size: 17px;
}

/* Hiệu ứng transition cho description */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

/* Cột hình ảnh */
.benefit-image-container {
  border-radius: 16px;
  overflow: hidden;
  position: sticky;
  top: 20px;
}

.benefit-image {
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 30px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.image-content {
  position: relative;
  z-index: 2;
  color: white;
}

.image-content i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  color: #002FFF;
}

.image-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.placeholder-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 16px;
}

.placeholder-image i {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.7;
}

.placeholder-image p {
  font-size: 18px;
  opacity: 0.8;
  margin: 0;
}

/* Hiệu ứng transition cho hình ảnh */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
  .benefits-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .main-title {
    font-size: 28px;
    margin-bottom: 40px;
  }

  .benefit-image-container {
    height: 300px;
    position: relative;
  }

  .benefit-header {
    gap: 12px;
  }

  .benefit-number {
    font-size: 20px;
    min-width: 35px;
  }

  .benefit-title {
    font-size: 14px;
  }
}
</style>