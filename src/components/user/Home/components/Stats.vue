<template>
  <div class="stats-container">
    <div
        class="stat-item"
        v-for="(stat, index) in stats"
        :key="index"
        @mouseenter="hoveredStat = index"
        @mouseleave="hoveredStat = null"
        :class="{ hovered: hoveredStat === index, 'auto-expanded': autoExpandedIndex === index }"
    >
      <div class="stat-expanded" :class="{ active: hoveredStat === index || autoExpandedIndex === index }">
        <div class="expanded-content">
          {{ stat.description }}
        </div>
        <div class="divider"></div>
      </div>
      <div class="stat-content">
        <div class="stat-icon">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-info">
          <div class="stat-number">
            {{ stat.number }}<sup>+</sup>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const hoveredStat = ref(null);
const autoExpandedIndex = ref(null);
const stats = ref([
  {
    number: '1,000',
    label: 'Dự án đã triển khai',
    icon: 'fas fa-project-diagram',
    description: 'Chúng tôi đã triển khai thành công hơn 1,000 dự án bất động sản trên khắp cả nước, mang đến giải pháp tối ưu cho khách hàng.'
  },
  {
    number: '100',
    label: 'Chiến dịch',
    icon: 'fas fa-chart-line',
    description: 'Với hơn 100 chiến dịch marketing hiệu quả, chúng tôi đã giúp hàng ngàn khách hàng tiếp cận thị trường bất động sản một cách tối ưu nhất.'
  },
  {
    number: '500',
    label: 'Khách hàng',
    icon: 'fas fa-users',
    description: 'Hơn 500 khách hàng đã tin tưởng và lựa chọn dịch vụ của chúng tôi, mang lại sự hài lòng tuyệt đối về chất lượng và hiệu quả.'
  },
  {
    number: '200',
    label: 'Đối tác tiêu biểu',
    icon: 'fas fa-handshake',
    description: 'Chúng tôi tự hào hợp tác với hơn 200 đối tác uy tín trong ngành, tạo nên mạng lưới đa dạng và chất lượng cao.'
  }
]);

// Tự động mở ngẫu nhiên một item khi component được tạo
onMounted(() => {
  // Thêm delay nhỏ để đảm bảo DOM đã render xong
  setTimeout(() => {
    autoExpandedIndex.value = Math.floor(Math.random() * stats.value.length);

    // Tự động đóng sau 5 giây
    setTimeout(() => {
      autoExpandedIndex.value = null;
    }, 5000);
  }, 100);
});
</script>

<style scoped>
/* Container cho 4 ô thống kê */
.stats-container {
  position: absolute;
  bottom: -220px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  z-index: 3;
  padding: 0 20px;
  align-items: flex-end;
}

.stat-item {
  position: relative;
  flex: 1;
  margin: 0 10px;
  border-radius: 10px;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  height: 120px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #00C2FF, #031358, #0629BE);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
  transform: translateY(0);
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.stat-item.hovered,
.stat-item.auto-expanded {
  height: 220px;
  box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-20px);
}

.stat-content {
  padding: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  order: 2;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  pointer-events: none;
  transition: transform 0.3s ease;
}

.stat-item.hovered .stat-content,
.stat-item.auto-expanded .stat-content {
  transform: translateY(-10px);
}

.stat-content > * {
  pointer-events: auto;
}

.stat-icon {
  font-size: 48px;
  color: white;
  margin-right: 15px;
  flex-shrink: 0;
  width: 60px;
  text-align: center;
  transition: transform 0.3s ease;
}

.stat-item.hovered .stat-icon,
.stat-item.auto-expanded .stat-icon {
  transform: scale(1.1);
}

.stat-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s ease;
}

.stat-item.hovered .stat-info,
.stat-item.auto-expanded .stat-info {
  transform: translateY(-5px);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin-bottom: 5px;
  line-height: 1;
  transition: transform 0.3s ease;
}



.stat-number sup {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  transition: transform 0.3s ease;
}



.stat-expanded {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  padding: 15px;
  transform: translateY(-100%);
  transition: transform 0.4s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  order: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  pointer-events: none;
}

.stat-expanded.active {
  transform: translateY(0);
}

.divider {
  width: 40px;
  height: 3px;
  background-color: #fff;
  margin: 10px auto 0;
  border-radius: 2px;
  opacity: 0.7;
  transition: transform 0.3s ease, opacity 0.3s ease;
}


.expanded-content {
  font-size: 13px;
  color: #e1f2ff;
  line-height: 1.4;
  margin-bottom: 10px;
  text-align: justify;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive cho tablet */
@media (max-width: 1024px) {
  .stats-container {
    max-width: 95%;
  }

  .stat-number {
    font-size: 28px;
  }

  .stat-number sup {
    font-size: 16px;
  }

  .stat-icon {
    font-size: 42px;
  }
}

@media (max-width: 1276px) {
  .stats-container {
    bottom: -80px;
  }
}

@media (max-width: 1000px) {
  .stat-expanded {
    height: 150px;
  }

  .stat-item.hovered,
  .stat-item.auto-expanded {
    height: 250px;
    box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-15px);
  }
}

/* Responsive cho mobile */
@media (max-width: 900px) {
  .banner-container {
    margin-bottom: 0;
  }

  .stats-container {
    position: static;
    flex-wrap: wrap;
    padding: 20px;
    justify-content: center;
    transform: translateY(-20px);
    display: block;
    margin: 0 auto;
  }

  .stat-item {
    flex: 0 0 calc(50% - 20px);
    margin: 20px;
    height: 100px;
  }

  .stat-item.hovered,
  .stat-item.auto-expanded {
    height: 180px;
    transform: translateY(-10px);
  }

  .stat-content {
    height: 100px;
    padding: 15px;
  }

  .stat-icon {
    font-size: 36px;
    margin-right: 10px;
    width: 50px;
  }

  .stat-number {
    font-size: 24px;
  }

  .stat-number sup {
    font-size: 14px;
  }

  .stat-label {
    font-size: 12px;
  }

  .stat-expanded {
    height: 80px;
    padding: 10px;
  }

  .expanded-content {
    font-size: 12px;
  }
}

/* Responsive cho mobile nhỏ hơn */
@media (max-width: 480px) {
  .stat-item {
    flex: 0 0 100%;
  }

  .stat-number {
    font-size: 22px;
  }

  .stat-number sup {
    font-size: 12px;
  }

  .stat-icon {
    font-size: 32px;
    margin-right: 8px;
    width: 45px;
  }

  .stat-label {
    font-size: 11px;
  }
}

/* Responsive cho mobile rất nhỏ */
@media (max-width: 360px) {
  .stat-number {
    font-size: 20px;
  }

  .stat-number sup {
    font-size: 11px;
  }

  .stat-icon {
    font-size: 28px;
    width: 40px;
  }

  .stat-label {
    font-size: 10px;
  }

  .expanded-content {
    font-size: 11px;
  }
}
</style>