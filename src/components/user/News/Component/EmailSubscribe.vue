<template>
  <div class="newsletter-container" :style="containerStyle">
    <div class="newsletter-content">
      <!-- Cột trái (6/12) -->
      <div class="left-column">
        <h2 class="title" :style="titleStyle">{{ config.content.title }}</h2>
        <p class="subtitle" :style="subtitleStyle">{{ config.content.subtitle }}</p>
      </div>

      <!-- Cột giữa (4/12) -->
      <div class="center-column">
        <form @submit.prevent="handleSubmit" class="subscription-form">
          <input
              v-model="email"
              type="email"
              :placeholder="config.content.placeholder"
              class="email-input"
              :style="inputStyle"
              required
          />
          <button type="submit" class="subscribe-btn" :style="buttonStyle">
            {{ config.content.buttonText }}
          </button>
        </form>
      </div>

      <!-- Cột phải (2/12) -->
      <div class="right-column">
        <img
            :src="baseImgaeUrl+config.content.imageSrc"
            :alt="config.content.imageAlt"
            class="newsletter-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

let config = {
  styles: {
    container: {
      backgroundGradient: 'linear-gradient(135deg, #0629BE 7%, #031358 22%, #0629BE 56%, #031358 81%, #0628B9 100%)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      paddingBottom: '30px',
      paddingTop: '30px'
    },
    title: {
      color: '#FFFFFF',
      fontSize: '33px',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '15px'
    },
    subtitle: {
      color: '#FFFFFF',
      fontSize: '20px',
      lineHeight: '1.4',
      opacity: '0.9'
    },
    input: {
      padding: '12px 16px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease',
      placeholderColor: '#999'
    },
    button: {
      backgroundColor: '#C2CBF0',
      color: '#031358',
      border: 'none',
      padding: '12px 16px',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.3s ease',
      width: '100%',
      hoverBackgroundColor: '#b0b9e8'
    }
  },
  content: {
    title: 'Luôn đồng hành cùng bạn qua mỗi bản tin mới',
    subtitle: 'Hãy để chúng tôi gửi đến bạn những nội dung hữu ích và cập nhật theo từng giai đoạn phát triển.',
    placeholder: 'Nhập địa chỉ email của bạn',
    buttonText: 'Đăng ký nhận tin',
    imageSrc: '/imgs/mail-sent-animate.svg',
    imageAlt: 'Đăng ký nhận tin'
  },
  layout: {
    maxWidth: '1400px',
    gap: '20px',
    padding: '0 20px'
  }
}

const props = defineProps({
  sectionData: Object
})

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã nhận props", config)
}

const email = ref('')

const containerStyle = computed(() => ({
  background: config.styles.container.backgroundGradient,
  boxShadow: config.styles.container.boxShadow,
  paddingBottom: config.styles.container.paddingBottom,
  paddingTop: config.styles.container.paddingTop
}))

const titleStyle = computed(() => ({
  color: config.styles.title.color,
  fontSize: config.styles.title.fontSize,
  fontWeight: config.styles.title.fontWeight,
  lineHeight: config.styles.title.lineHeight,
  marginBottom: config.styles.title.marginBottom
}))

const subtitleStyle = computed(() => ({
  color: config.styles.subtitle.color,
  fontSize: config.styles.subtitle.fontSize,
  lineHeight: config.styles.subtitle.lineHeight,
  opacity: config.styles.subtitle.opacity
}))

const inputStyle = computed(() => ({
  padding: config.styles.input.padding,
  border: config.styles.input.border,
  borderRadius: config.styles.input.borderRadius,
  fontSize: config.styles.input.fontSize,
  boxShadow: config.styles.input.boxShadow,
  transition: config.styles.input.transition
}))

const buttonStyle = computed(() => ({
  backgroundColor: config.styles.button.backgroundColor,
  color: config.styles.button.color,
  border: config.styles.button.border,
  padding: config.styles.button.padding,
  borderRadius: config.styles.button.borderRadius,
  fontSize: config.styles.button.fontSize,
  fontWeight: config.styles.button.fontWeight,
  transition: config.styles.button.transition,
  width: config.styles.button.width
}))

const handleSubmit = () => {
  // Xử lý logic đăng ký ở đây
  console.log('Email đã đăng ký:', email.value)
  alert(`Cảm ơn bạn đã đăng ký với email: ${email.value}`)
  email.value = '' // Reset input sau khi submit
}
</script>

<style scoped>
.newsletter-container {
  background: v-bind('config.styles.container.backgroundGradient');
  box-shadow: v-bind('config.styles.container.boxShadow');
  padding-bottom: v-bind('config.styles.container.paddingBottom');
  padding-top: v-bind('config.styles.container.paddingTop');
}

.newsletter-content {
  display: flex;
  align-items: center;
  max-width: v-bind('config.layout.maxWidth');
  margin: 0 auto;
  gap: v-bind('config.layout.gap');
  padding: v-bind('config.layout.padding');
}

/* Cột trái - 6/12 */
.left-column {
  flex: 6;
  padding-right: 20px;
}

.title {
  color: v-bind('config.styles.title.color');
  font-size: v-bind('config.styles.title.fontSize');
  font-weight: v-bind('config.styles.title.fontWeight');
  line-height: v-bind('config.styles.title.lineHeight');
  margin-bottom: v-bind('config.styles.title.marginBottom');
}

.subtitle {
  color: v-bind('config.styles.subtitle.color');
  font-size: v-bind('config.styles.subtitle.fontSize');
  line-height: v-bind('config.styles.subtitle.lineHeight');
  opacity: v-bind('config.styles.subtitle.opacity');
}

/* Cột giữa - 4/12 */
.center-column {
  flex: 4;
}

.subscription-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.email-input {
  padding: v-bind('config.styles.input.padding');
  border: v-bind('config.styles.input.border');
  border-radius: v-bind('config.styles.input.borderRadius');
  font-size: v-bind('config.styles.input.fontSize');
  box-shadow: v-bind('config.styles.input.boxShadow');
  transition: v-bind('config.styles.input.transition');
}

.email-input:focus {
  outline: none;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);
}

.email-input::placeholder {
  color: v-bind('config.styles.input.placeholderColor');
}

.subscribe-btn {
  background-color: v-bind('config.styles.button.backgroundColor');
  color: v-bind('config.styles.button.color');
  border: v-bind('config.styles.button.border');
  padding: v-bind('config.styles.button.padding');
  border-radius: v-bind('config.styles.button.borderRadius');
  font-size: v-bind('config.styles.button.fontSize');
  font-weight: v-bind('config.styles.button.fontWeight');
  cursor: pointer;
  transition: v-bind('config.styles.button.transition');
  width: v-bind('config.styles.button.width');
}

.subscribe-btn:hover {
  background-color: v-bind('config.styles.button.hoverBackgroundColor');
}

/* Cột phải - 2/12 */
.right-column {
  flex: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.newsletter-image {
  width: 100%;
  height: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .newsletter-content {
    flex-direction: column;
    text-align: center;
  }

  .left-column {
    padding-right: 0;
    margin-bottom: 20px;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 18px;
  }

  .right-column {
    margin-top: 20px;
  }
}
</style>