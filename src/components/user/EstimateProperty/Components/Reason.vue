<template>
  <section class="why-choose-section">
    <div class="background-overlay">
      <div class="background-image"></div>
      <div class="overlay"></div>

      <!-- Floating Icons Container -->
      <div class="floating-icons-container">
        <div
            v-for="(icon, index) in floatingIcons"
            :key="index"
            :class="['floating-icon', `floating-icon-${index + 1}`]"
            :style="icon.style"
        >
          <i :class="icon.class"></i>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Rest of your existing code -->
      <div class="title-section fade-up">
        <h1>Tại sao nên định giá tại Thiên Hà Group?</h1>
      </div>

      <div class="content-wrapper">
        <!-- Left Column -->
        <div class="column left-column">
          <div
              v-for="(advantage, index) in leftColumnAdvantages"
              :key="index"
              class="advantage-item fade-right"
          >
            <div class="icon-wrapper">
              <i :class="advantage.icon"></i>
            </div>
            <div class="text-content">
              <h3>{{ advantage.title }}</h3>
              <p>{{ advantage.content }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="column right-column">
          <div class="logo-section fade-in">
            <img
                src="/imgs/logoTHG.png"
                alt="Thiên Hà Group Logo"
                class="logo"
            />
          </div>

          <div class="advantages-right">
            <div
                v-for="(advantage, index) in rightColumnAdvantages"
                :key="index"
                class="advantage-item fade-left"
            >
              <div class="icon-wrapper">
                <i :class="advantage.icon" ></i>
              </div>
              <div class="text-content">
                <h3>{{ advantage.title }}</h3>
                <p>{{ advantage.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const advantages = [
  {
    icon: "fa-solid fa-laptop-house",
    title: "Tiện lợi đánh giá mọi lúc mọi nơi",
    content: "Không cần phải hẹn chuyên viên hay di chuyển, người dùng chỉ cần nhập thông tin tài sản (vị trí, diện tích, số tầng, hướng...) là có thể nhận được kết quả định giá ngay lập tức — tiết kiệm thời gian và công sức."
  },
  {
    icon: "fa-solid fa-bolt",
    title: "Nhanh chóng có kết quả trong vài giây",
    content: "Hệ thống tự động phân tích dữ liệu thị trường, so sánh với các bất động sản tương tự để đưa ra mức giá ước tính tức thì và chính xác — nhanh hơn hàng chục lần so với định giá thủ công."
  },
  {
    icon: "fa-solid fa-database",
    title: "Độ chính xác cao nhờ dữ liệu lớn",
    content: "Công cụ sử dụng dữ liệu thực tế từ hàng nghìn giao dịch, tin rao và giá trị trung cấp nhất liên tục — giúp kết quả phản ánh sát với giá trị thật của tài sản."
  },
  {
    icon: "fa-solid fa-chart-line",
    title: "Hỗ trợ ra quyết định đầu tư hiệu quả",
    content: "Kết quả định giá giúp người dùng so sánh giá bán, xác định cơ hội đầu tư hoặc thương lượng tốt hơn, tránh mua hớ hoặc bán lỗ."
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "Bảo mật và minh bạch thông tin",
    content: "Thông tin cá nhân và dữ liệu bất động sản của người dùng được mã hóa, chỉ phục vụ cho mục đích định giá — đảm bảo tính riêng tư và bảo mật."
  }
]

// Split advantages into left (3 items) and right (2 items)
const leftColumnAdvantages = computed(() => advantages.slice(0, 3))
const rightColumnAdvantages = computed(() => advantages.slice(3, 5))

// Floating icons data
const floatingIcons = ref([])

// Initialize floating icons
const initFloatingIcons = () => {
  // Get all icon classes from advantages
  const iconClasses = advantages.map(adv => adv.icon)

  // Create floating icons with random positions and animations
  floatingIcons.value = iconClasses.map((iconClass, index) => {
    // Random position
    const left = Math.random() * 90 + 5 // 5% to 95%
    const top = Math.random() * 90 + 5 // 5% to 95%

    // Random animation duration (10-20s)
    const duration = Math.random() * 10 + 10

    // Random delay (0-5s)
    const delay = Math.random() * 5

    // Random size (20-40px)
    const size = Math.random() * 20 + 20

    // Random opacity (0.-0.3)
    const opacity = Math.random() * 0.3 + 0.2

    return {
      class: iconClass,
      style: {
        left: `${left}%`,
        top: `${top}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        fontSize: `${size}px`,
        opacity: opacity
      }
    }
  })
}

onMounted(() => {
  initFloatingIcons()
})
</script>

<style scoped>
.why-choose-section {
  position: relative;
  min-height: 100vh;
  font-family: 'Ubuntu', sans-serif;
  overflow: hidden;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/imgs/bg-gia-tri.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #031358;
  opacity: 0.5;
}

/* Floating Icons Styles */
.floating-icons-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.floating-icon {
  position: absolute;
  color: rgba(255, 255, 255, 0.7);
  animation: floating linear infinite;
  z-index: 0;
}

@keyframes floating {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) translateX(10px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) translateX(20px) rotate(0deg);
  }
  75% {
    transform: translateY(-30px) translateX(10px) rotate(-5deg);
  }
  100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
}

/* Rest of your existing styles */
.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 0 20px;
}

.title-section {
  text-align: center;
  margin-bottom: 60px;
}

.title-section h1 {
  font-size: 40px;
  color: #031358;
  background-color: #F8BD0D;
  display: inline-block;
  padding: 20px 40px;
  margin: 0;
  position: relative;
  border-radius: 5px;
}

.title-section h1::after {
  content: '';
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20%;
  height: 3px;
  background-color: #031358;
  border-radius: 2px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: stretch;
  padding-bottom: 30px;
}

.column {
  display: flex;
  flex-direction: column;
}

.left-column {
  gap: 30px;
}

.right-column {
  gap: 40px;
}

.advantage-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 1;
  min-height: 200px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.advantage-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
  transparent,
  rgba(255, 255, 255, 0.4),
  transparent
  );
}

.advantage-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.2);
}

.icon-wrapper {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  background: rgba(3, 19, 88, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F8BD0D;
  font-size: 28px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.text-content {
  flex: 1;
}

.text-content h3 {
  color: #FFFFFF;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 15px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.text-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  line-height: 1.7;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.logo-section {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-height: 200px;
}

.logo {
  width: 100%;
  height: auto;
  max-width: 300px;
  filter: brightness(0) invert(1);
}

.advantages-right {
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-wrapper {
    gap: 40px;
  }

  .advantage-item {
    padding: 25px;
    min-height: 180px;
  }

  .logo {
    max-width: 250px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .title-section h1 {
    font-size: 32px;
    padding: 15px 30px;
  }

  .advantage-item {
    flex-direction: column;
    text-align: center;
    padding: 25px;
    min-height: auto;
  }

  .icon-wrapper {
    align-self: center;
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .logo {
    max-width: 200px;
  }

  .logo-section {
    padding: 30px;
  }

  /* Reduce number of floating icons on mobile */
  .floating-icon:nth-child(n+4) {
    display: none;
  }
}

@media (max-width: 480px) {
  .why-choose-section {
    padding: 40px 15px;
  }

  .title-section {
    margin-bottom: 40px;
  }

  .title-section h1 {
    font-size: 24px;
    padding: 12px 20px;
  }

  .advantage-item {
    padding: 20px;
  }

  .icon-wrapper {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .text-content h3 {
    font-size: 18px;
  }

  .text-content p {
    font-size: 14px;
  }

  .logo {
    max-width: 180px;
  }

  .logo-section {
    padding: 25px;
  }
}
</style>