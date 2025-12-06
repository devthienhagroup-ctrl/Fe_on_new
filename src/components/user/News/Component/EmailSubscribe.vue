<template>
  <div class="newsletter-container">
    <div class="newsletter-content">
      <!-- Cột trái (6/12) -->
      <div class="left-column">
        <h2 class="title">Luôn đồng hành cùng bạn qua mỗi bản tin mới</h2>
        <p class="subtitle">Hãy để chúng tôi gửi đến bạn những nội dung hữu ích và cập nhật theo từng giai đoạn phát triển.</p>
      </div>

      <!-- Cột giữa (4/12) -->
      <div class="center-column">
        <form @submit.prevent="handleSubmit" class="subscription-form">
          <input
              v-model="email"
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              class="email-input"
              required
          />
          <button type="submit" class="subscribe-btn">
            Đăng ký nhận tin
          </button>
        </form>
      </div>

      <!-- Cột phải (2/12) -->
      <div class="right-column">
        <img
            src="/imgs/mail-sent-animate.svg"
            alt="Đăng ký nhận tin"
            class="newsletter-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')

const handleSubmit = () => {
  // Xử lý logic đăng ký ở đây
  console.log('Email đã đăng ký:', email.value)
  alert(`Cảm ơn bạn đã đăng ký với email: ${email.value}`)
  email.value = '' // Reset input sau khi submit
}
</script>

<style scoped>
.newsletter-container {
  background: linear-gradient(135deg,
  #0629BE 7%,
  #031358 22%,
  #0629BE 56%,
  #031358 81%,
  #0628B9 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding-bottom: 30px;
  padding-top: 30px;
}

.newsletter-content {
  display: flex;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  gap: 20px;
  padding: 0 20px;
}

/* Cột trái - 6/12 */
.left-column {
  flex: 6;
  padding-right: 20px;
}

.title {
  color: white;
  font-size: 33px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 15px;
}

.subtitle {
  color: white;
  font-size: 20px;
  line-height: 1.4;
  opacity: 0.9;
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
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.email-input:focus {
  outline: none;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);
}

.email-input::placeholder {
  color: #999;
}

.subscribe-btn {
  background-color: #C2CBF0;
  color: #031358;
  border: none;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.subscribe-btn:hover {
  background-color: #b0b9e8;
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