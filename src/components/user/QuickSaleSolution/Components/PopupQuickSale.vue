<template>
  <div class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <!-- Header -->
      <div class="popup-header">
        <div class="header-left">
          <img :src="data.logo" :alt="data.logoAlt" class="logo" />
          <span class="title">{{ data.title }}</span>
        </div>
        <button class="close-btn" @click="closePopup">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Content - Thêm wrapper có thể cuộn -->
      <div class="popup-content-wrapper">
        <div class="popup-content">
          <p class="main-text" v-html="data.mainText"></p>

          <p class="sub-text">{{ data.subText }}</p>

          <div class="content-columns">
            <div class="left-col">
              <ul class="benefits-list">
                <li
                    v-for="(benefit, index) in data.benefits"
                    :key="index"
                    class="benefit-item"
                >
                  <i :class="benefit.icon"></i>
                  <span>{{ benefit.text }}</span>
                </li>
              </ul>
            </div>

            <div class="right-col">
              <img :src="data.image.src" :alt="data.image.alt" />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="popup-footer">
        <button class="ok-btn" @click="closePopup">
          {{ data.buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  configData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

const data = computed(() => ({
  logo: props.configData?.logo || '/imgs/logoTHG.png',
  logoAlt: props.configData?.logoAlt || 'Logo',
  title: props.configData?.title || 'Bán nhanh 30 ngày',
  mainText: props.configData?.mainText || 'Để đảm bảo quá trình bán được thực hiện nhanh chóng và hiệu quả, chúng tôi chỉ triển khai dịch vụ <b>\'bán nhanh trong 30 ngày\'</b> khi quý khách đưa ra mức giá kỳ vọng phù hợp với mặt bằng giá thị trường.',
  subText: props.configData?.subText || 'Việc đồng thuận về giá ngay từ đầu sẽ giúp:',
  image: {
    src: props.configData?.image?.src || '/imgs/house-searching-animate.svg',
    alt: props.configData?.image?.alt || 'House Searching'
  },
  benefits: props.configData?.benefits || [
    { icon: 'fas fa-check-circle', text: 'Quy trình thẩm định được thực hiện nhanh chóng và rõ ràng' },
    { icon: 'fas fa-chart-line', text: 'Hoạt động marketing được triển khai tập trung và hiệu quả hơn' },
    { icon: 'fas fa-users', text: 'Tiếp cận đúng nhóm khách mua thực, hạn chế mất thời gian' },
    { icon: 'fas fa-bullseye', text: 'Tối ưu tỷ lệ chốt giao dịch trong thời gian cam kết' }
  ],
  buttonText: props.configData?.buttonText || 'OK',
  styles: {
    primaryColor: props.configData?.styles?.primaryColor || '#031358',
    hoverColor: props.configData?.styles?.hoverColor || '#0056b3',
    iconColor: props.configData?.styles?.iconColor || '#0030ff',
    backgroundColor: props.configData?.styles?.backgroundColor || '#f8f9fa'
  }
}))

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
  padding: 16px; /* Thêm padding để popup không chạm vào cạnh màn hình */
  box-sizing: border-box;
}

.popup-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh; /* Quan trọng: Giới hạn chiều cao tối đa */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column; /* Sử dụng flex để bố cục */
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e5e5;
  background-color: v-bind('data.styles.backgroundColor');
  flex-shrink: 0; /* Ngăn header co lại */
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

/* Wrapper mới cho phép cuộn */
.popup-content-wrapper {
  overflow-y: auto; /* Cho phép cuộn dọc */
  flex-grow: 1; /* Chiếm không gian còn lại */
  max-height: calc(90vh - 130px); /* Tính toán chiều cao tối đa (trừ header và footer) */
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
  color: v-bind('data.styles.iconColor');
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
  background-color: v-bind('data.styles.backgroundColor');
  flex-shrink: 0; /* Ngăn footer co lại */
}

.ok-btn {
  background-color: v-bind('data.styles.primaryColor');
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.ok-btn:hover {
  background-color: v-bind('data.styles.hoverColor');
}

/* Responsive */
@media (max-width: 768px) {
  .popup-overlay {
    padding: 12px;
    align-items: flex-start; /* Căn popup lên trên trên mobile */
    padding-top: 40px; /* Tạo khoảng cách từ top */
  }

  .popup-container {
    width: 100%;
    max-height: 85vh; /* Giảm chiều cao tối đa trên mobile */
  }

  .popup-content-wrapper {
    max-height: calc(85vh - 130px);
  }

  .content-columns {
    flex-direction: column;
  }

  .right-col {
    order: -1;
    margin-bottom: 16px;
  }

  .right-col img {
    max-width: 80%;
    height: auto;
  }
}

/* Thêm cho màn hình rất nhỏ */
@media (max-width: 480px) {
  .popup-overlay {
    padding: 8px;
    padding-top: 30px;
  }

  .popup-container {
    max-height: 80vh;
  }

  .popup-content-wrapper {
    max-height: calc(80vh - 130px);
  }

  .popup-content {
    padding: 16px;
  }

  .title {
    font-size: 18px;
  }

  .main-text, .sub-text, .benefit-item span {
    font-size: 14px;
  }
}
</style>