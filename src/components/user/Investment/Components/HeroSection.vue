<template>
  <div class="contribution-section">
    <h1 class="main-title">GÓP VỐN CHI NHÁNH QUẬN THỦ ĐỨC</h1>

    <div class="main-content">
      <!-- Cột trái - Thông tin góp vốn -->
      <div class="left-column">
        <div class="info-card">
          <!-- Header card -->
          <div class="card-header">
            <i class="fa-solid fa-hand-holding-dollar"></i>
            <span class="header-title">Cùng <b>Thiên Hà Group</b> mở rộng chi nhánh </span>
          </div>

          <!-- Content card -->
          <div class="card-content">
            <!-- Text content -->
            <div class="text-content-wrapper">
              <div class="text-content">
                Mục tiêu <b>300 triệu</b> sắp chạm đích. Khi đủ số vốn, chi nhánh mới sẽ được triển khai <b>trong 30
                ngày</b>. Cùng chúng tôi tạo bước phát triển mới.
              </div>
              <div class="left-line"></div>
            </div>

            <!-- Progress section -->
            <div class="progress-section">
              <div class="progress-info">
                <span class="progress-text">Tiến độ hiện tại</span>
                <span class="progress-percent">{{ animatedProgress }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: animatedProgress + '%' }">
                  <div class="progress-shine"></div>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="divider"></div>

            <!-- Quick stats -->
            <div class="quick-stats">
              <div class="stat-item">
                <div class="stat-number">21</div>
                <div class="stat-label">Số ngày còn lại</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">50</div>
                <div class="stat-label">Số người góp vốn</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">153 triệu</div>
                <div class="stat-label">Tiến độ hiện tại</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải - Ảnh và Logo -->
      <div class="right-column">
        <!-- Logo absolute trên cùng bên trái -->
        <div class="logo-container">
          <img src="/imgs/logoTHG.png" alt="THG Logo" class="logo-image"/>
        </div>

        <!-- Ảnh background với hiệu ứng sweep light -->
        <div class="image-background">
          <div class="branch-image"></div>
          <div class="image-light-sweep"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const targetProgress = 51 // Giá trị progress mục tiêu
const animatedProgress = ref(0) // Giá trị progress động bắt đầu từ 0
const animationDuration = 1500 // Thời gian animation (ms)

onMounted(() => {
  // Kích hoạt animation khi component được mount
  let startTimestamp = null

  const animateProgress = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const elapsed = timestamp - startTimestamp
    const progress = Math.min(elapsed / animationDuration, 1)

    // Easing function để tạo hiệu ứng mượt mà
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)

    animatedProgress.value = Math.floor(easeOutQuart * targetProgress)

    if (progress < 1) {
      requestAnimationFrame(animateProgress)
    }
  }

  requestAnimationFrame(animateProgress)
})
</script>

<style scoped>
/* Tông màu mới - xanh dương thể hiện sự uy tín, chuyên nghiệp */
.contribution-section {
  font-family: 'Ubuntu', sans-serif;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.main-title {
  background: linear-gradient(135deg, #031358, #2a5298);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-size: 33px;
  font-weight: bold;
  margin-bottom: 30px;
}

.main-content {
  display: flex;
  gap: 20px;
  min-height: 500px;
}

.left-column {
  width: 58%;
  height: 100%;
}

.right-column {
  width: 42%;
  position: relative; /* Để logo có thể absolute bên trong */
  min-height: 500px;
}

.info-card {
  background: rgba(240, 245, 255, 0.7);
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  min-height: 500px;
}

/* Logo container styles - Absolute trên cùng bên trái */
.logo-container {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 100px;
  height: 100px;
  z-index: 10; /* Đảm bảo logo nằm trên hiệu ứng sweep light */

  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.logo-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

/* Image background styles */
.image-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(240, 245, 255, 0.7);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.branch-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/imgs/ivm3.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.image-light-sweep {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(200, 220, 255, 0.6),
      transparent
  );
  transform: skewX(25deg);
  animation: sweep 6s ease-in-out infinite;
  z-index: 2; /* Hiệu ứng sweep light nằm trên ảnh */
}

/* Card header styles */
.card-header {
  background: #031358;
  color: #ffffff;
  padding: 15px 20px;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-header i {
  font-size: 30px;
}

.header-title {
  font-weight: bold;
}

/* Card content styles */
.card-content {
  padding: 30px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.text-content-wrapper {
  position: relative;
}

.text-content {
  background: #e6f0ff;
  color: #031358;
  padding: 20px 30px;
  border-radius: 8px;
  line-height: 1.5;
  z-index: 1;
  margin-left: 10px;
  border-left: 4px solid #0030ff;
}


/* Progress section styles */
.progress-section {
  margin-bottom: 10px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-text {
  color: #031358;
  font-weight: 500;
}

.progress-percent {
  color: #2a5298;
  font-weight: bold;
  font-size: 18px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e6f0ff;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0030ff, #2a5298, #4a7bd6);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  transition: width 0.3s ease-out;
  animation: progressPulse 2s ease-in-out infinite;
}

.progress-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
  );
  animation: shine 2s ease-in-out infinite;
}

@keyframes progressPulse {
  0%, 100% {
    box-shadow: 0 0 5px rgba(42, 82, 152, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(42, 82, 152, 0.6);
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

/* Divider */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #2a5298, transparent);
  margin: 10px 0;
}

/* Quick stats styles */
.quick-stats {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.stat-item {
  text-align: center;
  flex: 1;
  padding: 30px 10px;
  background: rgba(230, 240, 255, 0.5);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #031358;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #031358;
  opacity: 0.8;
}

@keyframes sweep {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    width: 100%;
  }

  .right-column {
    min-height: 300px;
  }

  .logo-container {
    width: 80px;
    height: 80px;
    top: 15px;
    left: 15px;
  }

  .quick-stats {
    flex-direction: column;
    gap: 15px;
  }

  .card-content {
    padding: 20px 15px;
    gap: 20px;
  }

  .text-content {
    padding: 15px 25px;
  }
}
</style>