<template>
  <div class="recruitment-positions">
    <!-- Background image với overlay tối hơn -->
    <div class="background-image"></div>
    <div class="background-overlay"></div>

    <!-- Header full width -->
    <div class="header-section">
      <div class="header-rectangle">
        <h1 class="header-title">TUYỂN DỤNG - VỊ TRÍ ĐANG MỞ</h1>
        <p class="header-subtitle">Khám phá cơ hội nghề nghiệp tại công ty chúng tôi</p>
      </div>
    </div>

    <!-- Content với giới hạn width -->
    <div class="content-container">
      <div class="positions-grid fade-left">
        <div
            v-for="(department, index) in departments"
            :key="index"
            class="position-card"
            :class="getRowClass(index)"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave"
            :style="{ zIndex: hoveredIndex === index ? 100 : 1 }"
        >
          <div class="card-inner" :class="{ 'is-expanded': hoveredIndex === index }">
            <!-- Liquid glass effect layers -->
            <div class="liquid-glass-layer layer-1"></div>
            <div class="liquid-glass-layer layer-2"></div>
            <div class="liquid-glass-layer layer-3"></div>

            <!-- Card content -->
            <div class="card-content" :id="'dpm'+index">
              <h3 class="department-name">{{ department.name }}</h3>
              <div class="hover-indicator">
                <span>Xem chi tiết</span>
                <div class="arrow">→</div>
              </div>

              <!-- Expanded content -->
              <div class="expanded-content" v-if="hoveredIndex === index">
                <p class="department-description">{{ department.description }}</p>
                <button class="apply-btn">Ứng tuyển ngay</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hoveredIndex = ref(-1)
const hoveredRow = ref(-1)

// Xác định hàng dựa trên index
const getRowClass = (index) => {
  if (index < 2) return 'row-1'
  if (index < 4) return 'row-2'
  return 'row-3'
}

const handleMouseEnter = (index) => {
  hoveredIndex.value = index
  hoveredRow.value = Math.floor(index / 2) + 1 // Tính hàng (1, 2, hoặc 3)
}

const handleMouseLeave = () => {
  hoveredIndex.value = -1
  hoveredRow.value = -1
}

const departments = [
  {
    name: "Phòng Marketing",
    description: "Chúng tôi tìm kiếm những chuyên gia sáng tạo với khả năng xây dựng chiến lược marketing hiệu quả. Bạn sẽ tham gia vào các chiến dịch quảng bá thương hiệu, phân tích thị trường và phát triển nội dung đa kênh để thu hút khách hàng mục tiêu."
  },
  {
    name: "Phòng Giải pháp",
    description: "Đội ngũ giải pháp của chúng tôi chuyên nghiên cứu và phát triển các giải pháp công nghệ tiên tiến. Chúng tôi cần những kỹ sư tài năng với tư duy đổi mới và khả năng giải quyết vấn đề phức tạp trong môi trường đa dạng."
  },
  {
    name: "Phòng Telesale",
    description: "Gia nhập đội ngũ telesale năng động của chúng tôi để phát triển kỹ năng giao tiếp và thuyết phục. Bạn sẽ có cơ hội làm việc với khách hàng tiềm năng và đóng góp trực tiếp vào doanh thu của công ty thông qua các chiến dịch bán hàng."
  },
  {
    name: "Phòng Bán nhanh",
    description: "Đội ngũ bán hàng nhanh của chúng tôi chuyên xử lý các giao dịch với tốc độ cao và hiệu quả tối ưu. Chúng tôi tìm kiếm những cá nhân có khả năng làm việc dưới áp lực và đạt được mục tiêu doanh số đề ra."
  },
  {
    name: "Phòng Thông tin",
    description: "Phòng thông tin đảm bảo luồng thông tin nội bộ và đối ngoại được truyền tải chính xác và kịp thời. Chúng tôi cần những chuyên gia có khả năng phân tích và tổng hợp thông tin đa chiều từ nhiều nguồn khác nhau."
  },
  {
    name: "Phòng Định giá",
    description: "Đội ngũ định giá của chúng tôi chịu trách nhiệm phân tích thị trường và xác định chiến lược giá cả cạnh tranh. Chúng tôi tìm kiếm những chuyên gia với kiến thức sâu về tài chính và thị trường để đưa ra quyết định chính xác."
  }
]
</script>

<style scoped>
.recruitment-positions {
  font-family: 'Ubuntu', sans-serif;
  position: relative;
  padding-bottom: 200px;
}

/* Background image full screen với overlay tối */
.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/imgs/department-section.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -2;
  transform: scaleX(-1);
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.3) 40%,
      rgba(0, 0, 0, 0) 100%
  );
  z-index: -1;
}

/* Header section - full width */
.header-section {
  width: 100%;
  position: relative;
  margin-bottom: 155px;
}

.header-rectangle {
  background: linear-gradient(135deg, rgba(3, 19, 88, 0.85) 0%, rgba(0, 48, 255, 0.7) 100%);
  height: 220px;
  border-radius: 0 0 50% 50% / 0 0 100px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(3, 19, 88, 0.3);
  backdrop-filter: blur(5px);
  text-align: center;
  padding: 0 20px;
}

.header-title {
  font-size: 40px;
  color: white;
  font-weight: 700;
  margin: 0 0 15px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 400;
  max-width: 600px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

/* Content container với giới hạn width */
.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Grid layout - BỐ CỤC 2*3 */
.positions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 50px;
  margin-top: 40px;
  max-width: 70%;
}

.position-card {
  height: 200px;
  perspective: 1200px;
  cursor: pointer;
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
}

/* Hiệu ứng tịnh tiến khi hover - ĐÃ SỬA */
.positions-grid:hover .position-card {
  transition: transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
}

/* Khi hover hàng 1: chỉ item được hover lên 50px */
.positions-grid:hover .row-1:hover {
  transform: translateY(-170px);
}

/* Khi hover hàng 2: cả hàng trên lên 50px, hàng dưới xuống 50px */
.positions-grid:hover .row-2:hover {
  transform: translateY(-95px);
}

.positions-grid:has(.row-2:hover) .row-1 {
  transform: translateY(-70px);
}

.positions-grid:hover .row-2:hover ~ .row-3 {
  transform: translateY(70px);
}

/* Khi hover hàng 3: chỉ item được hover xuống 50px */
.positions-grid:hover .row-3:hover {
  transform: translateY(-20px);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: all 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
  border-radius: 20px;
  box-shadow:
      0 15px 35px rgba(3, 19, 88, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.card-inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: 20px;
  z-index: 1;
  pointer-events: none;
}

.card-inner.is-expanded {
  height: 350px;
  transform: translateY(20px);
  box-shadow:
      0 25px 50px rgba(3, 19, 88, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Liquid glass layers */
.liquid-glass-layer {
  position: absolute;
  border-radius: 20px;
  pointer-events: none;
  z-index: 2;
  transition: all 0.5s ease;
}

.layer-1 {
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.08) 30%,
      rgba(255, 255, 255, 0.15) 70%,
      rgba(255, 255, 255, 0.08) 100%
  );
  filter: blur(8px);
  opacity: 0.8;
}

.layer-2 {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 30% 20%,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 50%
  );
  opacity: 0.6;
}

.layer-3 {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0.12) 50%,
      transparent 100%
  );
  opacity: 0.5;
}

.card-inner.is-expanded .liquid-glass-layer {
  opacity: 0.9;
}

.card-inner.is-expanded .layer-1 {
  filter: blur(12px);
}

.card-inner.is-expanded .layer-2 {
  background: radial-gradient(
      circle at 30% 20%,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 50%
  );
}

.card-content {
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
  position: relative;
  z-index: 3;
}

.department-name {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #f0f0f0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.card-inner.is-expanded .department-name {
  margin-bottom: 25px;
}

.hover-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

.arrow {
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}

.position-card:hover .arrow {
  transform: translateX(5px);
}

/* Expanded content */
.expanded-content {
  margin-top: 20px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-inner.is-expanded .expanded-content {
  opacity: 1;
  transform: translateY(0);
}

.department-description {
  font-size: 16px;
  line-height: 1.7;
  color: #f8f8f8;
  text-align: justify;
  text-justify: inter-word;
  margin-bottom: 25px;
  overflow-y: auto;
  max-height: 180px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  font-weight: 500;
}

.apply-btn {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  padding: 14px 35px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Ubuntu', sans-serif;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  align-self: flex-start;
  backdrop-filter: blur(10px);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.6);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Large desktop */
@media (max-width: 1400px) {
  .content-container {
    max-width: 1200px;
    padding: 0 30px;
  }

  .positions-grid {
    gap: 30px;
  }

  .position-card {
    height: 280px;
  }

  .card-inner.is-expanded {
    height: 420px;
  }
}

/* Desktop */
@media (max-width: 1200px) {
  .positions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  .position-card {
    height: 260px;
  }

  .card-inner.is-expanded {
    height: 400px;
  }

  .header-title {
    font-size: 36px;
  }

  .header-rectangle {
    height: 200px;
  }
}

/* Tablet landscape */
@media (max-width: 992px) {
  .positions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .position-card {
    height: 240px;
  }

  .card-inner.is-expanded {
    height: 380px;
  }

  .department-name {
    font-size: 22px;
  }

  .department-description {
    font-size: 15px;
    max-height: 160px;
  }
}

/* Tablet portrait */
@media (max-width: 768px) {
  .expanded-content {
    transform: translateY(20px);
  }

  .positions-grid {
    grid-template-columns: 1fr;
    gap: 25px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Trên mobile, tắt hiệu ứng tịnh tiến hàng */
  .positions-grid:hover .row-1,
  .positions-grid:hover .row-2,
  .positions-grid:hover .row-3 {
    transform: none !important;
  }

  .position-card {
    height: auto;
    /* Thêm transition mượt mà cho mobile */
    transition: height 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
  }

  .card-inner {
    /* Đảm bảo card-inner không bị transform ảnh hưởng */
    transform: none !important;
    transition: all 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
  }

  .card-inner.is-expanded {
    height: auto;
    /* Loại bỏ transform trên mobile */
    transform: none !important;
    /* Thêm margin để tạo khoảng cách khi mở rộng */
    margin: 10px 0;
  }

  /* Đảm bảo các card không bị dịch chuyển */
  .positions-grid .position-card {
    transform: none !important;
  }

  .header-title {
    font-size: 32px;
    padding: 0 20px;
  }

  .header-subtitle {
    font-size: 16px;
    padding: 0 20px;
  }

  .header-rectangle {
    height: 180px;
    border-radius: 0 0 50% 50% / 0 0 80px 80px;
  }

  .card-content {
    padding: 25px;
  }
}

/* Mobile */
@media (max-width: 576px) {
  .header-title {
    font-size: 28px;
  }

  .header-subtitle {
    font-size: 15px;
  }

  .header-rectangle {
    height: 160px;
    border-radius: 0 0 50% 50% / 0 0 60px 60px;
  }

  .positions-grid {
    gap: 20px;
  }

  .position-card {
    /* Đảm bảo không có transform trên mobile */
    transform: none !important;
  }

  .card-inner.is-expanded {
    /* Thêm khoảng cách khi mở rộng trên mobile nhỏ */
    margin: 8px 0;
  }

  .card-content {
    padding: 20px;
  }

  .department-name {
    font-size: 20px;
  }

  .department-description {
    font-size: 14px;
    line-height: 1.6;
    max-height: 140px;
  }

  .apply-btn {
    padding: 12px 25px;
    font-size: 15px;
    min-width: 160px;
  }

  .content-container {
    padding: 0 15px;
  }
}

/* Small mobile */
@media (max-width: 400px) {
  .header-title {
    font-size: 24px;
  }

  .header-subtitle {
    font-size: 14px;
  }

  .header-rectangle {
    height: 140px;
  }

  .department-name {
    font-size: 18px;
  }

  .department-description {
    font-size: 13px;
    max-height: 120px;
  }

  .card-inner.is-expanded {
    margin: 5px 0;
  }
}
</style>