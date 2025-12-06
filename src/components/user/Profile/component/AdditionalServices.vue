<template>
  <div class="services-section">
  <!--    <div class="service-item" @click="navigateTo('service-package')">-->
  <!--      <div class="service-info">-->
  <!--        <h3 class="service-title">Nâng cấp gói thành viên</h3>-->
  <!--        <p class="service-subtitle">Chọn gói phù hợp để tận hưởng thêm quyền lợi và tính năng ưu việt.</p>-->
  <!--      </div>-->
  <!--      <button class="service-arrow">-->
  <!--        <i class="fas fa-chevron-right"></i>-->
  <!--      </button>-->
  <!--    </div>-->

    <div class="service-item" @click="navigateTo('package-benefits')">
      <div class="service-info">
        <h3 class="service-title">Quyền lợi</h3>
        <p class="service-subtitle">Xem lại còn lại của mỗi dịch vụ</p>
      </div>
      <button class="service-arrow">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <div class="service-item" @click="navigateTo('cancel-subscription')">
      <div class="service-info">
        <h3 class="service-title">Hủy đăng ký gói hiện tại</h3>
        <p class="service-subtitle">Dừng dịch vụ không cần thiết một cách nhanh chóng và an toàn.</p>
      </div>
      <button class="service-arrow">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (routeName) => {
  router.push({ name: routeName });
};
</script>

<style scoped>
.services-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.service-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.service-info {
  flex: 1;
}

.service-title {
  font-size: 20px;
  color: #000;
  margin: 0 0 5px 0;
}

.service-subtitle {
  font-size: 15px;
  color: #666;
  margin: 0;
}

.service-arrow {
  background: none;
  border: none;
  color: #031358;
  font-size: 18px;
  cursor: pointer;
  padding: 5px 10px;
  transition: transform 0.2s;
}

.service-item:hover .service-arrow {
  transform: translateX(3px);
}

/* Responsive Styles */
@media (max-width: 768px) {
  .service-item {
    padding: 15px;
  }

  .service-title {
    font-size: 18px;
  }

  .service-subtitle {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .service-item {
    padding: 12px;
  }

  .service-title {
    font-size: 16px;
  }

  .service-subtitle {
    font-size: 13px;
  }
}
</style>