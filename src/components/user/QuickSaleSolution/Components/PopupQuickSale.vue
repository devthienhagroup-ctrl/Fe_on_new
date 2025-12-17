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

      <!-- Content -->
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
  background-color: v-bind('data.styles.backgroundColor');
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