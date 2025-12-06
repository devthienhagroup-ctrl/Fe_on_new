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

const hoverIndex = ref(-1)
const autoHoverIndex = ref(0) // Mặc định hover mục đầu tiên
const isTouchDevice = ref(false)

// Phát hiện thiết bị touch
const checkTouchDevice = () => {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)
}

const handleMouseEnter = (index) => {
  hoverIndex.value = index
}

const handleMouseLeave = () => {
  hoverIndex.value = -1
}

const handleTouchStart = (index) => {
  if (isTouchDevice.value) {
    hoverIndex.value = index
    // Reset sau 5 giây để quay về trạng thái auto hover
    setTimeout(() => {
      if (hoverIndex.value === index) {
        hoverIndex.value = -1
      }
    }, 5000)
  }
}

onMounted(() => {
  isTouchDevice.value = checkTouchDevice()
})

const benefits = [
  {
    title: "Khen thưởng",
    image: "khen-thuong.jpg",
    description:
        "Tại Thiên Hà Group, mọi nỗ lực và thành tích đều được ghi nhận xứng đáng. Những phần thưởng hấp dẫn, kịp thời dành cho các cá nhân có đóng góp nổi bật hay ý tưởng sáng tạo được áp dụng thành công – chính là cách chúng tôi lan tỏa tinh thần cống hiến và khuyến khích sự khác biệt."
  },
  {
    title: "Phát triển sự nghiệp",
    image: "phat-trien.jpg",
    description:
        "Thiên Hà Group tin rằng con người là nền tảng của mọi thành công. Chúng tôi xây dựng lộ trình phát triển rõ ràng, cơ hội thăng tiến rộng mở cùng các khóa đào tạo chuyên sâu giúp bạn không ngừng hoàn thiện bản thân. Cùng chúng tôi, bạn không chỉ có công việc – mà còn là một hành trình sự nghiệp bền vững."
  },
  {
    title: "Môi trường làm việc",
    image: "moi-truong.png",
    description:
        "Chúng tôi mang đến không gian làm việc hiện đại, trang thiết bị đầy đủ, cùng văn hóa thân thiện và đội ngũ quản lý chuyên nghiệp. Thiên Hà Group là nơi bạn có thể phát huy năng lực, học hỏi không ngừng và tận hưởng bầu không khí làm việc năng động – hiệu quả mỗi ngày."
  },
  {
    title: "Chăm sóc sức khỏe",
    image: "suc-khoe.png",
    description:
        "Sức khỏe luôn là ưu tiên hàng đầu. Nhân viên Thiên Hà Group được hưởng các quyền lợi như bảo hiểm xã hội, bảo hiểm quốc tế, chương trình khám sức khỏe định kỳ cùng nhiều hoạt động thể thao – giúp giữ gìn cân bằng cuộc sống. Chúng tôi mong muốn mỗi thành viên đều an tâm, khỏe mạnh và tràn đầy năng lượng để phát triển lâu dài."
  }
]

// Tách benefits thành 2 cột
const leftColumnBenefits = computed(() => [benefits[0], benefits[2]])
const rightColumnBenefits = computed(() => [benefits[1], benefits[3]])

const getImageUrl = (imageName) => {
  return(`/imgs/${imageName}`);
}
</script>

<style scoped>
.benefits-section {
  font-family: 'Ubuntu', sans-serif;
  width: 100%;
  display: flex;
  justify-content: center;

}

.benefits-container {
  max-width: 1400px;
  width: 100%;
  padding: 0 20px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  width: 100%;
}

/* Cột trái - cách lề trên 145px */
.benefits-left-column {
  padding-top: 0;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Cột phải - không có padding-top */
.benefits-right-column {
  padding-top: 145px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.benefit-item {
  width: 100%;
  height: 700px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.5s ease;
}

.benefit-item:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.benefit-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
  transition: all 0.5s ease;
}

/* Overlay trắng mở rộng từ trên xuống */
.white-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: rgba(255, 255, 255, 0.95);
  transition: height 0.5s ease;
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
  justify-content: flex-end; /* Căn giữa theo chiều dọc */
  align-items: center; /* Căn giữa theo chiều ngang */
  text-align: center;
  padding: 40px;
  padding-bottom: 60px;
  transition: all 0.5s ease;
  box-sizing: border-box;
}

/* Thêm class active cho benefit-content khi hover */
.benefit-content.active {
  justify-content: center; /* Căn giữa khi hover */
}

.benefit-title {
  color: white;
  font-size: 33px;
  text-align: center;
  margin-bottom: 0px;
  transition: all 0.5s ease;
  width: 100%;
  font-weight: bolder;
}

.benefit-title.hovered {
  color: #031358; /* Màu chữ đậm khi hover */
  margin-bottom: 30px;
}

.benefit-description {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s ease;
  width: 100%;
  max-width: 700px; /* Giới hạn chiều rộng tối đa */
  text-align: justify;
}

.benefit-description.active {
  opacity: 1;
  max-height: 400px;
}

.description-line {
  width: 50px;
  height: 2px;
  background-color: white;
  margin: 0 auto 20px;
  transition: background-color 0.5s ease;
}

.benefit-description.active .description-line {
  background-color: #031358; /* Màu đậm khi hover */
}

.benefit-description p {
  color: white;
  font-size: 20px;
  line-height: 1.6;
  transition: color 0.5s ease;
  margin: 0;
}

.benefit-description.active p {
  color: #031358; /* Màu đậm khi hover */
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .benefits-container {
    padding: 0 30px;
  }

  .benefit-item {
    height: 400px;
  }

  .benefit-content {
    padding: 30px;
  }

  .benefit-title {
    font-size: 28px;
  }

  .benefit-description p {
    font-size: 18px;
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