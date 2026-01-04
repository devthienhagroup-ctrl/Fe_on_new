<template>
  <div class="floating-contact-container">
    <!-- Floating Menu -->
    <div class="floating-menu" :class="{ 'menu-open': isOpen }">
      <!-- Contact Options (nằm dưới main FAB) -->
      <div class="contact-options">
        <!-- WhatsApp -->
        <div class="contact-item" @click="openWhatsApp">
          <div class="label-pill">
            <span class="label-text">Liên hệ</span>
            <div class="pill-pointer"></div>
          </div>
          <div class="icon-circle whatsapp">
            <i class="fa-solid fa-headset"></i>
          </div>
        </div>

        <!-- Messenger -->
        <div class="contact-item" @click="openMessenger">
          <div class="label-pill">
            <span class="label-text">Fanpage</span>
            <div class="pill-pointer"></div>
          </div>
          <div class="icon-circle messenger">
            <i class="fa-brands fa-facebook-f"></i>
          </div>
        </div>

        <!-- Email -->
        <div class="contact-item" @click="sendEmail">
          <div class="label-pill">
            <span class="label-text">thienhagroup@gmail.com</span>
            <div class="pill-pointer"></div>
          </div>
          <div class="icon-circle email">
            <i class="far fa-envelope"></i>
          </div>
        </div>

        <!-- Call -->
        <div class="contact-item" @click="makeCall">
          <div class="label-pill">
            <span class="label-text">0911.231.882</span>
            <div class="pill-pointer"></div>
          </div>
          <div class="icon-circle call">
            <i class="fas fa-phone"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Main FAB Button với hiệu ứng thu hút -->
    <button
        class="main-fab"
        @click="toggleMenu"
        :class="{ 'fab-close': isOpen }"
        aria-label="Contact Menu"
    >
      <!-- Hiệu ứng ánh sáng xung quanh -->
      <div class="pulse-ring"></div>
      <div class="pulse-ring ring-delay-1"></div>

      <!-- Icon chính -->
      <i class="fas" :class="isOpen ? 'fa-times' : 'fa-phone-flip'"></i>

      <!-- Hiệu ứng ánh sáng lấp lánh -->
      <div class="sparkle-effect"></div>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from "vue-router";

const router = useRouter();
const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const openWhatsApp = () => {
  router.push("/lien-he")
}

const openMessenger = () => {
  window.open('https://www.facebook.com/profile.php?id=61557872978828', '_blank')
}

const sendEmail = () => {
  window.location.href = 'mailto:thienhagroup@gmail.com'
}

const makeCall = () => {
  window.location.href = 'tel:0911231882'
}

const handleClickOutside = (e) => {
  const menu = document.querySelector('.floating-menu')
  const fab = document.querySelector('.main-fab')

  if (isOpen.value &&
      menu &&
      fab &&
      !menu.contains(e.target) &&
      !fab.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.floating-contact-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

/* Main FAB Button - Thiết kế nổi bật hơn */
.main-fab {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007AFF, #0056CC);
  border: none;
  outline: none;
  cursor: pointer;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
      0 8px 30px rgba(0, 122, 255, 0.4),
      0 4px 15px rgba(0, 122, 255, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.4),
      0 0 0 4px rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 502;
  overflow: hidden;
}

/* Hiệu ứng phát sáng khi hover */
.main-fab:hover {
  transform: translateY(-4px) scale(1.1);
  background: linear-gradient(135deg, #0095FF, #007AFF);
  box-shadow:
      0 15px 40px rgba(0, 122, 255, 0.6),
      0 8px 20px rgba(0, 122, 255, 0.4),
      inset 0 2px 0 rgba(255, 255, 255, 0.5),
      0 0 0 6px rgba(0, 122, 255, 0.15);
  animation: gentleGlow 1.5s infinite alternate;
}

/* Hiệu ứng nhấp nháy nhẹ */
@keyframes gentleGlow {
  0% {
    box-shadow:
        0 15px 40px rgba(0, 122, 255, 0.6),
        0 8px 20px rgba(0, 122, 255, 0.4),
        inset 0 2px 0 rgba(255, 255, 255, 0.5),
        0 0 0 6px rgba(0, 122, 255, 0.15);
  }
  100% {
    box-shadow:
        0 15px 45px rgba(0, 149, 255, 0.7),
        0 8px 25px rgba(0, 149, 255, 0.5),
        inset 0 2px 0 rgba(255, 255, 255, 0.6),
        0 0 0 8px rgba(0, 149, 255, 0.2);
  }
}

/* Hiệu ứng vòng tròn xung quanh */
.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(0, 122, 255, 0.6);
  animation: pulse 2s infinite;
  z-index: -1;
}

.pulse-ring.ring-delay-1 {
  animation-delay: 0.5s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  70% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Hiệu ứng lấp lánh */
.sparkle-effect {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
  animation: sparkle 3s infinite;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

/* Khi ở trạng thái đóng (icon X) */
.main-fab.fab-close {
  background: linear-gradient(135deg, #4B5563, #374151);
  transform: rotate(0deg);
}

.main-fab.fab-close:hover {
  background: linear-gradient(135deg, #6B7280, #4B5563);
  transform: translateY(-4px) scale(1.1) rotate(90deg);
  animation: none; /* Tắt hiệu ứng phát sáng khi đóng menu */
}

.main-fab.fab-close .pulse-ring,
.main-fab.fab-close .sparkle-effect {
  display: none; /* Ẩn hiệu ứng khi menu mở */
}

/* Floating Menu */
.floating-menu {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 501;
  /* Quan trọng: Thêm pointer-events none khi đóng */
  pointer-events: none;
}

/* Khi menu mở - cho phép click */
.floating-menu.menu-open {
  pointer-events: auto;
}

/* Contact Options */
.contact-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 70px; /* Khoảng cách với main FAB */
  position: relative;
  /* Xóa pointer-events từ đây, đặt ở .floating-menu thay thế */
}

/* Contact Item - Căn phải */
.contact-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  cursor: pointer;
  position: relative;
  opacity: 0;
  transform: translateY(100%) scale(0.8);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Quan trọng: Thêm để ngăn click khi đang ẩn */
  pointer-events: none;
}

/* Khi menu mở - các item hiển thị và cho phép click */
.floating-menu.menu-open .contact-item {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

/* Animation delays cho từng item khi mở */
.floating-menu.menu-open .contact-item:nth-child(1) {
  transition-delay: 0.1s;
}
.floating-menu.menu-open .contact-item:nth-child(2) {
  transition-delay: 0.2s;
}
.floating-menu.menu-open .contact-item:nth-child(3) {
  transition-delay: 0.3s;
}
.floating-menu.menu-open .contact-item:nth-child(4) {
  transition-delay: 0.4s;
}

/* Khi menu đóng - các item di chuyển xuống */
.floating-menu:not(.menu-open) .contact-item {
  opacity: 0;
  transform: translateY(100%) scale(0.8);
  pointer-events: none;
}

/* Label Pill với mũi nhọn */
.label-pill {
  background: white;
  padding: 12px 20px;
  border-radius: 18px;
  box-shadow:
      0 4px 20px rgba(74, 111, 165, 0.18),
      0 2px 10px rgba(74, 111, 165, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  position: relative;
  transition: all 0.3s ease;
  min-width: 120px;
  text-align: center;
}

/* Mũi nhọn của pill */
.pill-pointer {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid white;
  filter: drop-shadow(2px 0 2px rgba(0, 0, 0, 0.1));
}

.label-text {
  color: #5A6C7D;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Icon Circles */
.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.2),
      0 4px 12px rgba(0, 0, 0, 0.15),
      inset 0 -2px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

/* Specific Icon Colors */
.whatsapp {
  background: linear-gradient(135deg, #25D366, #1EBE5D);
}

.messenger {
  background: linear-gradient(135deg, #006AFF, #0051CC);
}

.email {
  background: linear-gradient(135deg, #EA4335, #D62516);
}

.call {
  background: linear-gradient(135deg, #34A853, #2E8B47);
}

/* Hiệu ứng hover - chỉ khi menu mở */
.floating-menu.menu-open .contact-item:hover .label-pill {
  transform: translateX(-5px);
  box-shadow:
      0 6px 25px rgba(74, 111, 165, 0.25),
      0 3px 15px rgba(74, 111, 165, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.floating-menu.menu-open .contact-item:hover .icon-circle {
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .floating-contact-container {
    bottom: 20px;
    right: 20px;
  }

  .main-fab {
    width: 56px;
    height: 56px;
    font-size: 22px;
  }

  .contact-options {
    gap: 16px;
  }

  .label-pill {
    padding: 10px 18px;
    min-width: 110px;
  }

  .icon-circle {
    width: 44px;
    height: 44px;
    font-size: 18px;
  }
}
</style>