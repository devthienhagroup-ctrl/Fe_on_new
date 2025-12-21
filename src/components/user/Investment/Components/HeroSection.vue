<template>
  <div class="contribution-section">
    <h1 class="main-title">{{ contributionData.title }}</h1>

    <div class="main-content">
      <!-- Cột trái - Thông tin góp vốn -->
      <div class="left-column">
        <div class="info-card">
          <!-- Header card -->
          <div class="card-header">
            <i :class="config.headerIcon"></i>
            <span class="header-title" v-html="config.headerTitle"></span>
          </div>

          <!-- Content card -->
          <div class="card-content">
            <!-- Text content -->
            <div class="text-content-wrapper">
              <div class="text-content" v-html="contributionData.description"></div>
              <div class="left-line"></div>
            </div>

            <!-- Progress section -->
            <div class="progress-section">
              <div class="progress-info">
                <span class="progress-text">{{ config.progressLabel }}</span>
                <span class="progress-percent">{{ animatedProgress }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: animatedProgress + '%' }">
                  <div class="progress-shine"></div>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="divider"></div>

            <!-- Quick stats -->
            <div class="quick-stats">
              <div class="stat-item" v-for="(stat, index) in contributionData.stats" :key="index">
                <div class="stat-number">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải - Ảnh và Logo -->
      <div class="right-column">
        <!-- Logo absolute trên cùng bên trái -->
        <div class="logo-container">
          <img src="/imgs/logoTHG.png" :alt="config.logoAlt" class="logo-image"/>
        </div>

        <!-- Ảnh background với hiệu ứng sweep light -->
        <div class="image-background">
          <div class="branch-image"></div>
          <div class="image-light-sweep"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Config object chứa các thiết lập cố định (UI, styling, texts cố định)
let config = {
  // Text content cố định
  headerIcon: "fa-solid fa-hand-holding-dollar",
  headerTitle: "Cùng <b>Thiên Hà Group</b> mở rộng chi nhánh",
  progressLabel: "Tiến độ hiện tại",

  // Image paths cố định
  logoPath: "/imgs/logoTHG.png",
  logoAlt: "THG Logo",
  backgroundImagePath: "/imgs/ivm3.jpg",

  // Animation settings cố định
  animationDuration: 1500,

  // Color palette cố định
  colors: {
    primaryDark: "#031358",
    primary: "#2a5298",
    primaryLight: "#4a7bd6",
    accent: "#0030ff",
    backgroundLight: "rgba(240, 245, 255, 0.7)",
    cardBackground: "#e6f0ff",
    textDark: "#031358",
    textLight: "#ffffff",
    statBackground: "rgba(230, 240, 255, 0.5)"
  },

  // Gradient settings cố định
  gradients: {
    title: "linear-gradient(135deg, #031358, #2a5298)",
    progress: "linear-gradient(90deg, #0030ff, #2a5298, #4a7bd6)",
    divider: "linear-gradient(90deg, transparent, #2a5298, transparent)",
    lightSweep: "linear-gradient(90deg, transparent, rgba(200, 220, 255, 0.6), transparent)",
    progressShine: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)"
  },

  // Typography cố định
  typography: {
    mainTitleSize: "33px",
    headerSize: "20px",
    statNumberSize: "20px",
    statLabelSize: "12px",
    progressPercentSize: "18px",
    iconSize: "30px"
  },

  // Spacing cố định
  spacing: {
    sectionPadding: "20px",
    cardPadding: "30px 20px",
    textPadding: "20px 30px",
    statPadding: "30px 10px",
    headerPadding: "15px 20px"
  },

  // Border radius cố định
  borderRadius: {
    card: "20px",
    progressBar: "6px",
    statItem: "8px",
    logoContainer: "15px"
  },

  // Sizes cố định
  sizes: {
    logoWidth: "100px",
    logoHeight: "100px",
    progressBarHeight: "12px",
    leftLineWidth: "4px"
  },

  // Animation timings cố định
  animations: {
    sweepDuration: "6s",
    progressPulseDuration: "2s",
    shineDuration: "2s"
  },

  // Responsive breakpoints cố định
  responsive: {
    mobileBreakpoint: "768px",
    mobileLogoWidth: "80px",
    mobileLogoHeight: "80px"
  }
}

const props = defineProps({
  sectionData: Object
});

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã lấy data từ cha");
}

// Data object riêng chứa dữ liệu góp vốn sẽ được load từ API/DB sau
const contributionData = {
  // Dữ liệu sẽ được thay thế từ API/DB
  title: "GÓP VỐN CHI NHÁNH QUẬN THỦ ĐỨC",
  description: "Mục tiêu <b>300 triệu</b> sắp chạm đích. Khi đủ số vốn, chi nhánh mới sẽ được triển khai <b>trong 30 ngày</b>. Cùng chúng tôi tạo bước phát triển mới.",
  targetProgress: 51, // Sẽ được load từ API/DB
  stats: [
    { value: "21", label: "Số ngày còn lại" }, // Sẽ được load từ API/DB
    { value: "50", label: "Số người góp vốn" }, // Sẽ được load từ API/DB
    { value: "153 triệu", label: "Tiến độ hiện tại" } // Sẽ được load từ API/DB
  ]
}

const animatedProgress = ref(0)

onMounted(() => {
  let startTimestamp = null

  const animateProgress = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const elapsed = timestamp - startTimestamp
    const progress = Math.min(elapsed / config.animationDuration, 1)

    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    animatedProgress.value = Math.floor(easeOutQuart * contributionData.targetProgress)

    if (progress < 1) {
      requestAnimationFrame(animateProgress)
    }
  }

  requestAnimationFrame(animateProgress)
})
</script>

<style scoped>
/* Sử dụng v-bind() để bind CSS properties từ config */
.contribution-section {
  font-family: 'Ubuntu', sans-serif;
  padding: v-bind('config.spacing.sectionPadding');
  max-width: 1400px;
  margin: 0 auto;
}

.main-title {
  background: v-bind('config.gradients.title');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-size: v-bind('config.typography.mainTitleSize');
  font-weight: bold;
  margin-bottom: 30px;
}

.main-content {
  display: flex;
  gap: 20px;
  min-height: 500px;
}

.left-column {
  width: 58%;
  height: 100%;
}

.right-column {
  width: 42%;
  position: relative;
  min-height: 500px;
}

.info-card {
  background: v-bind('config.colors.backgroundLight');
  border-radius: v-bind('config.borderRadius.card');
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
  min-height: 500px;
}

/* Logo container styles */
.logo-container {
  position: absolute;
  top: 5px;
  left: 5px;
  width: v-bind('config.sizes.logoWidth');
  height: v-bind('config.sizes.logoHeight');
  z-index: 10;
  border-radius: v-bind('config.borderRadius.logoContainer');
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.logo-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

/* Image background styles */
.image-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: v-bind('config.colors.backgroundLight');
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.branch-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /*background-image: v-bind('`url("${config.backgroundImagePath}")`');*/
  background-image: url("/imgs/ivm3.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

.image-light-sweep {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: v-bind('config.gradients.lightSweep');
  transform: skewX(25deg);
  animation: sweep v-bind('config.animations.sweepDuration') ease-in-out infinite;
  z-index: 2;
}

/* Card header styles */
.card-header {
  background: v-bind('config.colors.primaryDark');
  color: v-bind('config.colors.textLight');
  padding: v-bind('config.spacing.headerPadding');
  font-size: v-bind('config.typography.headerSize');
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-header i {
  font-size: v-bind('config.typography.iconSize');
}

.header-title {
  font-weight: bold;
}

/* Card content styles */
.card-content {
  padding: v-bind('config.spacing.cardPadding');
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.text-content-wrapper {
  position: relative;
}

.text-content {
  background: v-bind('config.colors.cardBackground');
  color: v-bind('config.colors.textDark');
  padding: v-bind('config.spacing.textPadding');
  border-radius: 8px;
  line-height: 1.5;
  z-index: 1;
  margin-left: 10px;
  border-left: v-bind('config.sizes.leftLineWidth') solid v-bind('config.colors.accent');
}

/* Progress section styles */
.progress-section {
  margin-bottom: 10px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-text {
  color: v-bind('config.colors.textDark');
  font-weight: 500;
}

.progress-percent {
  color: v-bind('config.colors.primary');
  font-weight: bold;
  font-size: v-bind('config.typography.progressPercentSize');
}

.progress-bar {
  width: 100%;
  height: v-bind('config.sizes.progressBarHeight');
  background: v-bind('config.colors.cardBackground');
  border-radius: v-bind('config.borderRadius.progressBar');
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: v-bind('config.gradients.progress');
  border-radius: v-bind('config.borderRadius.progressBar');
  position: relative;
  overflow: hidden;
  transition: width 0.3s ease-out;
  animation: progressPulse v-bind('config.animations.progressPulseDuration') ease-in-out infinite;
}

.progress-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: v-bind('config.gradients.progressShine');
  animation: shine v-bind('config.animations.shineDuration') ease-in-out infinite;
}

@keyframes progressPulse {
  0%, 100% {
    box-shadow: 0 0 5px rgba(42, 82, 152, 0.3);
  }
  50% {
    box-shadow: 0 0 15px rgba(42, 82, 152, 0.6);
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

/* Divider */
.divider {
  height: 1px;
  background: v-bind('config.gradients.divider');
  margin: 10px 0;
}

/* Quick stats styles */
.quick-stats {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.stat-item {
  text-align: center;
  flex: 1;
  padding: v-bind('config.spacing.statPadding');
  background: v-bind('config.colors.statBackground');
  border-radius: v-bind('config.borderRadius.statItem');
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
}

.stat-number {
  font-size: v-bind('config.typography.statNumberSize');
  font-weight: bold;
  color: v-bind('config.colors.textDark');
  margin-bottom: 5px;
}

.stat-label {
  font-size: v-bind('config.typography.statLabelSize');
  color: v-bind('config.colors.textDark');
  opacity: 0.8;
}

@keyframes sweep {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

/* Responsive design */
/*@media (max-width: v-bind('config.responsive.mobileBreakpoint')) {*/@media (max-width: 800px) {
  .main-content {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    width: 100%;
  }

  .right-column {
    min-height: 300px;
  }

  .logo-container {
    width: v-bind('config.responsive.mobileLogoWidth');
    height: v-bind('config.responsive.mobileLogoHeight');
    top: 15px;
    left: 15px;
  }

  .quick-stats {
    flex-direction: column;
    gap: 15px;
  }

  .card-content {
    padding: 20px 15px;
    gap: 20px;
  }

  .text-content {
    padding: 15px 25px;
  }
}
</style>