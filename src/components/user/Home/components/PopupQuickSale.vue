<template>
  <div class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <!-- Header -->
      <div class="popup-header">
        <div class="header-left">
          <img src="/imgs/logoTHG.png" alt="Logo" class="logo" />
          <span class="title">Bán nhanh 30 ngày</span>
        </div>
        <button class="close-btn" @click="closePopup">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="popup-content">
        <p class="main-text">
          Để đảm bảo quá trình bán được thực hiện nhanh chóng và hiệu quả, chúng tôi chỉ triển khai dịch vụ <b>'bán nhanh trong 30 ngày'</b> khi quý khách đưa ra mức giá kỳ vọng phù hợp với mặt bằng giá thị trường.
        </p>

        <p class="sub-text">
          Việc đồng thuận về giá ngay từ đầu sẽ giúp:
        </p>

        <div class="content-columns">
          <div class="left-col">
            <ul class="benefits-list">
              <li class="benefit-item">
                <i class="fas fa-check-circle"></i>
                <span>Quy trình thẩm định được thực hiện nhanh chóng và rõ ràng</span>
              </li>
              <li class="benefit-item">
                <i class="fas fa-chart-line"></i>
                <span>Hoạt động marketing được triển khai tập trung và hiệu quả hơn</span>
              </li>
              <li class="benefit-item">
                <i class="fas fa-users"></i>
                <span>Tiếp cận đúng nhóm khách mua thực, hạn chế mất thời gian</span>
              </li>
              <li class="benefit-item">
                <i class="fas fa-bullseye"></i>
                <span>Tối ưu tỷ lệ chốt giao dịch trong thời gian cam kết</span>
              </li>
            </ul>
          </div>

          <div class="right-col">
            <img src="/imgs/house-searching-animate.svg" alt="House Searching">
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="popup-footer">
        <button class="ok-btn" @click="closePopup">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close'])

const closePopup = () => {
  emit('close')
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e5e5;
  background-color: #f8f9fa;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.title {
  font-weight: 600;
  color: #333;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #e9ecef;
  color: #333;
}

.popup-content {
  padding: 24px 20px;
}

.content-columns {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.left-col {
  flex: 1;
}

.right-col {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-col img {
  height: 60%;
  width: 70%;
}

.main-text {
  margin-bottom: 16px;
  line-height: 1.5;
  color: #333;
}

.sub-text {
  margin-bottom: 16px;
  font-weight: 500;
  color: #333;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  line-height: 1.4;
  text-align: justify;
}

.benefit-item i {
  color: #0030ff;
  margin-top: 6px;
  flex-shrink: 0;
}

.benefit-item span {
  color: #555;
}

.popup-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: flex-end;
  background-color: #f8f9fa;
}

.ok-btn {
  background-color: #031358;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.ok-btn:hover {
  background-color: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .content-columns {
    flex-direction: column;
  }

  .right-col {
    order: -1;
    margin-bottom: 16px;
  }

  .right-col img {
    max-width: 80%;
  }
}
</style>