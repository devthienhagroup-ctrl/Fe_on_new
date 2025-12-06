<template>
  <section class="prelogin-container">
    <!-- Video nền -->
    <div class="video-container">
      <video autoplay muted loop playsinline class="bg-video">
        <source src="/imgs/BG-Globe-animation.mp4" type="video/mp4" />
      </video>
    </div>

    <!-- Lớp phủ để tăng độ tương phản -->
    <div class="overlay"></div>

    <!-- Nội dung chính -->
    <div class="content" v-if="!showAuthForm">
      <img src="/imgs/logoTHG.png" alt="Thiên Hà Group Logo" class="logo" />

      <h2 class="main-text">
        Giải pháp bán nhanh bất động sản trong 30 ngày
      </h2>
      <h3 class="slogan">
        "Bạn có nhà – Thiên Hà có khách"
      </h3>

      <div class="btn-group">
        <button class="btn-primary" @click="showRegisterForm">Đăng ký ngay</button>
        <button class="btn-outline" @click="showLoginForm">Đăng nhập</button>
      </div>
    </div>

    <!-- Form đăng nhập/đăng ký -->
    <div class="auth-form-container" v-if="showAuthForm">
      <Login
          v-if="currentForm === 'login'"
          @switch-to-register="showRegisterForm"
          @close-form="hideAuthForm"
          @forgot-password="showForgotPasswordForm"
      />
      <ForgotPasswordFlow
          v-else-if="currentForm === 'forgot'"
          @switch-to-login="showLoginForm"
      />
      <Register
          v-else
          @switch-to-login="showLoginForm"
          @close-form="hideAuthForm"
          @scrollToError="scrollToError"
          @scrollTop="scrollTop"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import Login from './Components/LoginForm.vue'
import Register from './Components/RegisterForm.vue'
import ForgotPasswordFlow from './Components/ForgotPasswordFlow.vue'

const showAuthForm = ref(false)
const currentForm = ref('login')

const showLoginForm = () => {
  currentForm.value = 'login'
  showAuthForm.value = true
  setContainerMarginBottom(0);
}

const showRegisterForm = () => {
  currentForm.value = 'register'
  showAuthForm.value = true
  setContainerMarginBottom(0);
}

const scrollToError = (el) => {
  if (!el) return;

  setTimeout(() => {
    el.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 500);
}

const scrollTop = () => {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
}

const showForgotPasswordForm = () => {
  currentForm.value = 'forgot'
  showAuthForm.value = true
  setContainerMarginBottom(0);
}

const hideAuthForm = () => {
  showAuthForm.value = false
}

const setContainerMarginBottom =(bottomSpace) => {
  const container = document.querySelector(".prelogin-container");
  if (container) {
    container.style.marginBottom = `${bottomSpace}px`;
  }
}
</script>

<style scoped>
.prelogin-container {
  position: relative;
  width: 100%;
  padding-top: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
}

/* Container cho video với bo tròn phần dưới */
.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: -2;
}

/* Video nền full màn hình */
.bg-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Lớp phủ nhẹ để đọc chữ rõ hơn - cũng cần bo tròn */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: -1;
  border-bottom-left-radius: 50% 20%;
  border-bottom-right-radius: 50% 20%;
  height: 90vh;
}

/* Nội dung căn giữa */
.content {
  text-align: center;
  color: #fff;
  max-width: 900px;
  padding: 0 20px;
  width: 100%;
}

/* Logo lớn giữa màn hình */
.logo {
  width: 250px;
  margin-bottom: 20px;
  max-width: 80%;
  height: auto;
}

/* Dòng text chính */
.main-text {
  font-size: 33px;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1.3;
}

/* Slogan có hiệu ứng chuyển màu động */
.slogan {
  font-size: 45px;
  font-weight: bold;
  background: linear-gradient(
      90deg,
      #ffffff,
      #319AFF,
      #ffffff,
      #319AFF
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientMove 4s linear infinite;
  margin-bottom: 40px;
  line-height: 1.2;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

/* Nhóm nút */
.btn-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* Nút trắng */
.btn-primary {
  background: #fff;
  color: #0b2e59;
  border: none;
  padding: 12px 28px;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
}
.btn-primary:hover {
  background: #e6e6e6;
  transform: scale(1.05);
}
.btn-primary:active {
  transform: scale(0.95);
}

/* Nút outline trắng */
.btn-outline {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
  padding: 12px 28px;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
}
.btn-outline:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}
.btn-outline:active {
  transform: scale(0.95);
}

/* Container cho form đăng nhập/đăng ký */
.auth-form-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  padding: 20px;
}

/* ========== RESPONSIVE STYLES ========== */

/* Tablet */
@media (max-width: 1024px) {
  .prelogin-container {
    padding-top: 150px;
    margin-bottom: 400px;
  }

  .content {
    max-width: 700px;
  }

  .main-text {
    font-size: 28px;
  }

  .slogan {
    font-size: 38px;
  }

  .logo {
    width: 200px;
  }
}

/* Small Tablet */
@media (max-width: 768px) {
  .prelogin-container {
    padding-top: 100px;
    margin-bottom: 300px;
  }

  .video-container,
  .overlay {
    height: 80vh;
    border-bottom-left-radius: 40% 15%;
    border-bottom-right-radius: 40% 15%;
  }

  .content {
    max-width: 90%;
    padding: 0 15px;
  }

  .main-text {
    font-size: 24px;
  }

  .slogan {
    font-size: 32px;
    margin-bottom: 30px;
  }

  .logo {
    width: 180px;
    margin-bottom: 15px;
  }

  .btn-group {
    gap: 15px;
  }

  .btn-primary,
  .btn-outline {
    padding: 10px 24px;
    min-width: 120px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .prelogin-container {
    padding-top: 100px;
    margin-bottom: 200px;
  }

  .video-container,
  .overlay {
    height: 90vh;
    border-bottom-left-radius: 30% 10%;
    border-bottom-right-radius: 30% 10%;
  }

  .content {
    max-width: 95%;
    padding: 0 10px;
  }

  .main-text {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .slogan {
    font-size: 26px;
    margin-bottom: 25px;
  }

  .logo {
    width: 150px;
    margin-bottom: 10px;
  }

  .btn-group {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
  }

  .btn-primary,
  .btn-outline {
    width: 100%;
    padding: 12px 20px;
    min-width: auto;
  }

  .auth-form-container {
    padding: 15px 10px;
  }
}

/* Small Mobile */
@media (max-width: 360px) {
  .prelogin-container {
    padding-top: 80px;
    margin-bottom: 150px;
  }

  .main-text {
    font-size: 18px;
  }

  .slogan {
    font-size: 22px;
  }

  .logo {
    width: 130px;
  }
}

/* Landscape Orientation */
@media (max-height: 600px) and (orientation: landscape) {
  .prelogin-container {
    padding-top: 80px;
    min-height: auto;
  }

  .video-container,
  .overlay {
    height: 100vh;
  }

  .content {
    padding: 20px;
  }

  .logo {
    width: 120px;
    margin-bottom: 10px;
  }

  .main-text {
    font-size: 20px;
    margin-bottom: 8px;
  }

  .slogan {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .btn-group {
    gap: 10px;
  }

  .btn-primary,
  .btn-outline {
    padding: 8px 16px;
    min-width: 100px;
  }
}

/* High-resolution displays */
@media (min-width: 1400px) {
  .content {
    max-width: 1000px;
  }

  .main-text {
    font-size: 36px;
  }

  .slogan {
    font-size: 50px;
  }

  .logo {
    width: 280px;
  }
}
</style>