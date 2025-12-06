<template>
  <div class="career-opportunities">
    <h1 class="title">CƠ HỘI VIỆC LÀM</h1>

    <div class="content-container">
      <div class="left-column fade-left">
        <div class="positions-container">
          <div
              v-for="(position, index) in positions"
              :key="index"
              :class="['position-item', { 'hovered': hoveredIndex >= index }]"
              :style="{
              height: `calc(100% - ${index * 80}px)`,
            }"
              @mouseenter="setHoveredIndex(index)"
              @mouseleave="resetHoveredIndex"
          >
            <div class="position-content">
              <h3>{{ position }}</h3>
              <div
                  class="button-container"
              >
                <button class="btn apply-btn">ỨNG TUYỂN NGAY</button>
                <button class="btn detail-btn">XEM CHI TIẾT</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-column fade-right">
        <img
            src="/imgs/coi-hoi-viec-lam.png"
            alt="Cơ hội việc làm"
            class="career-image"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const positions = ref([
  'Nhân viên telesale',
  'Nhân viên văn phòng',
  'Chuyên viên tư vấn',
  'Chuyên viên định giá BĐS',
  'Nhân viên khảo sát thị trường',
  'Môi giới bất động sản',
  'Cộng tác viên THG'
])

const hoveredIndex = ref(-1)

const setHoveredIndex = (index) => {
  hoveredIndex.value = index
}

const resetHoveredIndex = () => {
  hoveredIndex.value = -1
}
</script>

<style scoped>
.career-opportunities {
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Ubuntu', sans-serif;
  padding: 20px;
}

.title {
  font-size: 40px;
  color: #031358;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
}

.content-container {
  display: flex;
  gap: 0;
  height: 600px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.left-column {
  flex: 4;
  position: relative;
}

.right-column {
  flex: 8;
}

.career-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.positions-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.position-item {
  position: absolute;
  width: 100%;
  bottom: 0;
  background: white;
  color: #031358;
  font-size: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px 0 0 0;
  transform: translateY(54px);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  cursor: pointer;
}

.position-item.hovered {
  transform: translateY(0);
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.15);
}

.position-item:not(.hovered):hover {
  transform: translateY(20px);
}

.position-content {
  padding: 25px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.position-content h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.position-item:hover .position-content h3 {
  transform: translateY(-5px);
}

.position-item:hover .position-content {
  gap: 12px;
}

.button-container {
  display: flex;
  gap: 12px;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn {
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.apply-btn {
  background: linear-gradient(135deg, #031358, #0827AF);
  color: white;
}

.detail-btn {
  background: transparent;
  border: 2px solid transparent;
  background-image: linear-gradient(white, white),
  linear-gradient(135deg, #031358, #0827AF);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  color: #031358;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.3);
}

/* Responsive */
@media (max-width: 1024px) {
  .content-container {
    flex-direction: column;
    height: auto;
  }

  .left-column, .right-column {
    flex: none;
  }


    .positions-container {
      height: 600px;
    }

  .career-image {
    transform: translateY(0px);
  }

  .position-item {
    border-top-right-radius: 20px;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 32px;
  }

  .position-content h3 {
    font-size: 18px;
  }


  .btn {
    padding: 10px 15px;
  }
}

@media (max-width: 441px) {
  .btn {
    font-size: 12px;
  }

}
</style>