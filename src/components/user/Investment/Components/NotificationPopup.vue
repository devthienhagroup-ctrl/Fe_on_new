<template>
  <!-- Overlay -->
  <transition name="fade">
    <div v-if="visible" class="notification-overlay" @click.self="handleClose">
      <!-- Main Notification Card -->
      <div class="notification-card">

        <!-- Animated Background Elements -->
        <div class="bg-elements">
          <div class="confetti-container">
            <div v-for="i in 30" :key="i" class="confetti" :style="confettiStyle(i)"></div>
          </div>

          <!-- Floating Icons -->
          <div class="floating-icons">
            <svg v-for="i in 8" :key="'icon'+i" class="floating-icon" :style="iconStyle(i)">
              <use :href="'#money-icon' + (i % 4)"></use>
            </svg>
          </div>

          <!-- Particle Rings -->
          <div class="rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>
        </div>

        <!-- Content Container -->
        <div class="content-container">
          <!-- Animated Checkmark -->
          <div class="checkmark-container">
            <svg class="checkmark" viewBox="0 0 52 52">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>

            <!-- Sparkle Effect -->
            <div class="sparkles">
              <div v-for="i in 12" :key="'sparkle'+i" class="sparkle" :style="sparkleStyle(i)"></div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="main-content">
            <h2 class="title">🎉 Giao Dịch Thành Công!</h2>
            <p class="subtitle">Cảm ơn bạn đã tin tưởng đầu tư cùng chúng tôi</p>

            <!-- Transaction Details -->
            <div class="details-card">
              <div class="detail-row">
                <span class="detail-label">Số tiền:</span>
                <span class="detail-value highlight">{{ formatCurrency(amount) }} VNĐ</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Mã giao dịch:</span>
                <span class="detail-value code">{{ transactionCode }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Thời gian:</span>
                <span class="detail-value">{{ formatDate(timestamp) }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="btn btn-primary" @click="goToHome">
                <i class="fas fa-home"></i>
                <span>Trang Chủ</span>
              </button>
              <button class="btn btn-secondary" @click="goToPackages">
                <i class="fas fa-box-open"></i>
                <span>Gói Đã Đăng Ký</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <button class="close-btn" @click="handleClose">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </transition>


  <!-- SVG Icons Definitions -->
  <svg style="display: none;">
    <symbol id="money-icon0" viewBox="0 0 24 24">
      <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,10H13V14H11V10M15,10H17V14H15V10M7,10H9V14H7V10Z"/>
    </symbol>
    <symbol id="money-icon1" viewBox="0 0 24 24">
      <path fill="currentColor" d="M11.8,10.9C9.53,10.31 8.8,9.7 8.8,8.75C8.8,7.66 9.81,6.9 11.5,6.9C13.28,6.9 14.26,7.75 14.3,9H16.78C16.65,7.14 15.19,5.6 12.8,5.19V3H10.2V5.16C7.86,5.65 6.2,7 6.2,8.77C6.2,11.08 8.18,12.23 11.2,12.9C13.66,13.43 14.2,14.31 14.2,15.31C14.2,16 13.71,17.1 11.5,17.1C9.44,17.1 8.34,16.18 8.22,15H5.78C5.9,17.3 7.67,18.84 10.2,19.3V21H12.8V19.28C15.17,18.82 16.8,17.38 16.8,15.35C16.8,12.43 14.5,11.5 11.8,10.9Z"/>
    </symbol>
    <symbol id="money-icon2" viewBox="0 0 24 24">
      <path fill="currentColor" d="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z"/>
    </symbol>
    <symbol id="money-icon3" viewBox="0 0 24 24">
      <path fill="currentColor" d="M2,21H20V19H2M20,8H18V5H20M20,3H4V13A4,4 0 0,0 8,17H14A4,4 0 0,0 18,13V10H20A2,2 0 0,0 22,8V5C22,3.89 21.1,3 20,3Z"/>
    </symbol>
  </svg>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  visible: Boolean,
  amount: {
    type: Number,
    default: 0
  },
  transactionCode: {
    type: String,
    default: ''
  },
  timestamp: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const router = useRouter()

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value)
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Confetti styles
const confettiStyle = (index) => {
  const colors = [
    'linear-gradient(45deg, #FFD700, #FFA500)',
    'linear-gradient(45deg, #00FF00, #00CC00)',
    'linear-gradient(45deg, #FF6B6B, #FF4757)',
    'linear-gradient(45deg, #4ECDC4, #44A08D)',
    'linear-gradient(45deg, #9D50BB, #6E48AA)'
  ]

  return {
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 10 + 5}px`,
    height: `${Math.random() * 10 + 5}px`,
    background: colors[index % colors.length],
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${Math.random() * 3 + 2}s`,
    transform: `rotate(${Math.random() * 360}deg)`
  }
}

// Icon styles
const iconStyle = (index) => {
  return {
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${index * 0.5}s`,
    animationDuration: `${Math.random() * 10 + 10}s`,
    opacity: Math.random() * 0.3 + 0.1
  }
}

// Sparkle styles
const sparkleStyle = (index) => {
  const angle = (index / 12) * 2 * Math.PI
  const radius = 80
  const x = radius * Math.cos(angle)
  const y = radius * Math.sin(angle)

  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    animationDelay: `${index * 0.1}s`
  }
}

// Navigation methods
const goToHome = () => {
  router.push('/')
  emit('close')
}

const goToPackages = () => {
  router.push('/hop-tac/goi-hop-tac-da-dang-ky')
  emit('close')
}

const handleClose = () => {
  emit('close')
}

// Handle ESC key
const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.visible) {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Overlay */
.notification-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Main Card */
.notification-card {
  position: relative;
  background: linear-gradient(135deg,
  rgba(255, 255, 255, 0.95) 0%,
  rgba(248, 250, 255, 0.98) 100%);
  border-radius: 24px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  animation: cardAppear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Background Elements */
.bg-elements {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 24px;
  pointer-events: none;
}

/* Confetti */
.confetti-container {
  position: absolute;
  inset: 0;
}

.confetti {
  position: absolute;
  animation: fall linear infinite;
  border-radius: 2px;
}

@keyframes fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Floating Icons */
.floating-icons {
  position: absolute;
  inset: 0;
}

.floating-icon {
  position: absolute;
  width: 40px;
  height: 40px;
  animation: float linear infinite;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Rings */
.rings {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring {
  position: absolute;
  border: 2px solid;
  border-radius: 50%;
  opacity: 0.1;
}

.ring-1 {
  width: 300px;
  height: 300px;
  border-color: #3f2bd8;
  animation: pulseRing 4s ease-in-out infinite;
}

.ring-2 {
  width: 400px;
  height: 400px;
  border-color: #8a36ff;
  animation: pulseRing 4s ease-in-out infinite 0.5s;
}

.ring-3 {
  width: 500px;
  height: 500px;
  border-color: #0ea5e9;
  animation: pulseRing 4s ease-in-out infinite 1s;
}

@keyframes pulseRing {
  0%, 100% {
    transform: scale(1);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.2;
  }
}

/* Checkmark Animation */
.checkmark-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}

.checkmark {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: block;
  stroke-width: 4;
  stroke: #fff;
  stroke-miterlimit: 10;
  filter: drop-shadow(0 4px 12px rgba(63, 43, 216, 0.3));
  animation: fill 0.4s ease-in-out 0.4s forwards,
  scale 0.3s ease-in-out 0.9s both;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 4;
  stroke: #4CAF50;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 60px #4CAF50;
  }
}

/* Sparkles */
.sparkles {
  position: absolute;
  inset: 0;
}

.sparkle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #FFD700;
  border-radius: 50%;
  animation: sparklePop 1s ease-out forwards;
  opacity: 0;
}

@keyframes sparklePop {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

/* Main Content */
.content-container {
  position: relative;
  z-index: 2;
}

.title {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #3f2bd8 0%, #8a36ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

/* Details Card */
.details-card {
  background: rgba(63, 43, 216, 0.05);
  border-radius: 16px;
  padding: 24px;
  margin: 30px 0;
  border: 1px solid rgba(63, 43, 216, 0.1);
  backdrop-filter: blur(10px);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #666;
  font-size: 14px;
}

.detail-value {
  font-weight: 600;
  color: #333;
}

.detail-value.highlight {
  color: #4CAF50;
  font-size: 18px;
  font-weight: 700;
}

.detail-value.code {
  font-family: 'Courier New', monospace;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px 12px;
  border-radius: 8px;
  color: #3f2bd8;
}

/* Thank You Section */
.thank-you {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-radius: 16px;
  padding: 24px;
  margin: 30px 0;
  border-left: 4px solid #3f2bd8;
  position: relative;
  overflow: hidden;
}

.quote-icon {
  position: absolute;
  top: 10px;
  left: 20px;
  font-size: 60px;
  color: rgba(63, 43, 216, 0.1);
  line-height: 1;
}

.thank-you-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 0 0 20px;
  padding-left: 40px;
  font-style: italic;
}

.signature {
  text-align: right;
  padding-left: 40px;
}

.signature-line {
  width: 100px;
  height: 2px;
  background: #3f2bd8;
  margin-left: auto;
  margin-bottom: 8px;
}

.signature-text {
  font-size: 14px;
  color: #666;
  font-weight: 600;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 30px 0;
}



.btn {
  padding: 16px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 50%;
}

.btn:after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.btn:hover:after {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #3f2bd8 0%, #8a36ff 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(63, 43, 216, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(63, 43, 216, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #0ea5e9 0%, #3f2bd8 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
}

.btn-secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(14, 165, 233, 0.4);
}

.btn-outline {
  background: transparent;
  color: #666;
  border: 2px solid #ddd;
}

.btn-outline:hover {
  background: rgba(0, 0, 0, 0.05);
  border-color: #999;
}

/* Security Badge */
.security-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50px;
  color: #4CAF50;
  font-size: 14px;
  font-weight: 600;
  margin-top: 20px;
}

.security-badge i {
  font-size: 18px;
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 3;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: rotate(90deg);
}

/* SVG Icons (hidden) */
svg {
  display: none;
}

/* Responsive */
@media (max-width: 768px) {
  .notification-card {
    padding: 30px 20px;
    margin: 20px;
  }

  .title {
    font-size: 26px;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }

  .details-card {
    padding: 16px;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>

