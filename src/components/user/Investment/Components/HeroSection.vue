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
            <span class="header-title">Mục tiêu: {{contributionData.targetAmount}}</span>
          </div>

          <!-- Content card -->
          <div class="card-content">
            <!-- Text content -->
            <div class="text-content-wrapper">
              <p class="text-content" v-text="contributionData.description"></p>
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

          <!-- Form đăng ký -->
          <div style="padding: 0 20px 20px">
            <!-- Thông báo trạng thái - CHỈ HIỆN KHI ĐÃ ĐĂNG KÝ -->
            <div v-if="showStatusMessage" class="status-message" :class="statusClass">
              <i :class="statusIcon"></i>
              <span>{{ statusText }}</span>
            </div>

            <div class="package-select-wrapper">
              <label class="package-label" for="package-select">
                <i class="fa-solid fa-box-open"></i> Chọn gói đầu tư
              </label>
              <select
                  id="package-select"
                  class="package-select"
                  v-model="selectedPackageId"
                  :disabled="isDisabled"
              >
                <option value="" disabled>-- Vui lòng chọn gói --</option>
                <option
                    v-for="pkg in filteredPackages"
                    :key="pkg.id"
                    :value="pkg.id"
                >
                  {{ pkg.name }} - {{ formatCurrency(pkg.amount) }} ({{ pkg.profitPercent }}% - Kỳ hạn: {{pkg.durationMonths}} tháng)
                </option>
              </select>
              <div class="select-arrow">
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <button
                @click="handleRegister"
                class="btn btn-primary w-100"
                :disabled="!selectedPackageId || isDisabled"
            >
              <i class="fa-solid fa-file-signature"></i> {{ buttonText }}
            </button>
            <p v-if="!selectedPackageId && !isDisabled" class="package-hint">
              <i class="fa-solid fa-info-circle"></i> Vui lòng chọn gói đầu tư trước khi đăng ký
            </p>
            <p v-if="isDisabled && contributionData.hasInvested === true" class="package-hint">
              <i class="fa-solid fa-check-circle"></i> Bạn đã đăng ký góp vốn thành công
            </p>
          </div>
          <div class="notifications"><i :class="currentMessage.icon" /> {{currentMessage.message}}</div>
        </div>
      </div>

      <!-- Cột phải - Ảnh và Logo -->
      <div class="right-column">
        <!-- Badge "Đã đăng ký góp vốn" -->

        <!-- Logo absolute trên cùng bên trái -->
        <div class="logo-container">
          <img :src="config.logoPath" :alt="config.logoAlt" class="logo-image"/>
        </div>

        <!-- Ảnh background với hiệu ứng sweep light -->
        <div class="image-background">
          <div class="branch-image" :style="{ backgroundImage: `url(${baseImgaeUrl+contributionData.thumbnail || config.backgroundImagePath}) ` }"></div>
          <div class="image-light-sweep"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, onUnmounted, computed} from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

const emit = defineEmits(['payment'])

// Config object chứa các thiết lập cố định
let config = {
  headerIcon: "fa-solid fa-hand-holding-dollar",
  headerTitle: "Cùng <b>Thiên Hà Group</b> mở rộng chi nhánh",
  progressLabel: "Tiến độ hiện tại",
  logoPath: "/imgs/logoTHG.png",
  logoAlt: "THG Logo",
  backgroundImagePath: "/imgs/ivm3.jpg",
  animationDuration: 1500,
  colors: {
    primaryDark: "#031358",
    primary: "#2a5298",
    primaryLight: "#4a7bd6",
    accent: "#0030ff",
    backgroundLight: "rgba(240, 245, 255, 0.7)",
    cardBackground: "#e6f0ff",
    textDark: "#031358",
    textLight: "#ffffff",
    statBackground: "rgba(230, 240, 255, 0.5)",
    success: "#10b981",
    successLight: "#d1fae5",
    warning: "#f59e0b",
    warningLight: "#fef3c7"
  },
  gradients: {
    title: "linear-gradient(135deg, #031358, #2a5298)",
    progress: "linear-gradient(90deg, #0030ff, #2a5298, #4a7bd6)",
    divider: "linear-gradient(90deg, transparent, #2a5298, transparent)",
    lightSweep: "linear-gradient(90deg, transparent, rgba(200, 220, 255, 0.6), transparent)",
    progressShine: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
    success: "linear-gradient(135deg, #10b981, #34d399)",
    warning: "linear-gradient(135deg, #f59e0b, #fbbf24)"
  },
  typography: {
    mainTitleSize: "33px",
    headerSize: "20px",
    statNumberSize: "20px",
    statLabelSize: "12px",
    progressPercentSize: "18px",
    iconSize: "30px"
  },
  spacing: {
    sectionPadding: "20px",
    cardPadding: "30px 20px",
    textPadding: "20px 30px",
    statPadding: "30px 10px",
    headerPadding: "15px 20px"
  },
  borderRadius: {
    card: "20px",
    progressBar: "6px",
    statItem: "8px",
    logoContainer: "15px"
  },
  sizes: {
    logoWidth: "100px",
    logoHeight: "100px",
    progressBarHeight: "12px",
    leftLineWidth: "4px"
  },
  animations: {
    sweepDuration: "6s",
    progressPulseDuration: "2s",
    shineDuration: "2s"
  },
  responsive: {
    mobileBreakpoint: "768px",
    mobileLogoWidth: "80px",
    mobileLogoHeight: "80px"
  }
}

const props = defineProps({
  sectionConfig: Object,
  contributionData: Object,
  packages: Array // Thay đổi từ Object thành Array
});

// Khởi tạo với dữ liệu mặc định
const contributionData = ref({
  title: "GÓP VỐN CHI NHÁNH",
  description: "Mục tiêu <b>300 triệu</b> sắp chạm đích. Khi đủ số vốn, chi nhánh mới sẽ được triển khai <b>trong 30 ngày</b>. Cùng chúng tôi tạo bước phát triển mới.",
  targetProgress: 51,
  thumbnail: null,
  hasInvested: null, // true: đã đăng ký, false: chưa đăng ký, null: chưa đăng nhập
  stats: [
    { value: "21", label: "Số ngày còn lại" },
    { value: "50", label: "Số người góp vốn" },
    { value: "153 triệu", label: "Tiến độ hiện tại" }
  ]
})

const selectedPackageId = ref('')
const animatedProgress = ref(0)

// Computed properties
const isDisabled = computed(() => {
  return contributionData.value.hasInvested === true
})

const buttonText = computed(() => {
  if (contributionData.value.hasInvested === true) return 'Đã đăng ký'
  if (contributionData.value.hasInvested === false) return 'Đăng ký ngay'
  return 'Đăng nhập để đăng ký'
})

// CHỈ HIỂN THỊ KHI ĐÃ ĐĂNG KÝ GÓP VỐN (true)
const showStatusMessage = computed(() => {
  return contributionData.value.hasInvested === true
})

const statusClass = computed(() => {
  if (contributionData.value.hasInvested === true) return 'status-success'
  // Không cần status-warning nữa vì không hiển thị
  return ''
})

const statusIcon = computed(() => {
  if (contributionData.value.hasInvested === true) return 'fa-solid fa-check-circle'
  // Không cần icon cho trường hợp khác
  return ''
})

const statusText = computed(() => {
  if (contributionData.value.hasInvested === true) return 'Bạn đã đăng ký góp vốn thành công'
  // Không cần text cho trường hợp khác
  return ''
})

// Computed property để lọc các gói đang active
const filteredPackages = computed(() => {
  if (!props.packages || !Array.isArray(props.packages)) {
    return []
  }
  return props.packages.filter(pkg => pkg.isActive === true)
})

// Format currency
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Xử lý đăng ký
const handleRegister = () => {
  if (!selectedPackageId.value) {
    alert('Vui lòng chọn gói đầu tư!')
    return
  }

  if (contributionData.value.hasInvested === null) {
    alert('Vui lòng đăng nhập để đăng ký góp vốn!')
    return
  }

  if (contributionData.value.hasInvested === true) {
    alert('Bạn đã đăng ký góp vốn rồi!')
    return
  }

  // Emit sự kiện với packageId
  emit('payment', selectedPackageId.value)
}

if(props.contributionData) {
  console.log("props ContributionData:", props.contributionData)
  contributionData.value = props.contributionData;
}

// Watch sectionConfig để update khi có dữ liệu mới
watch(() => props.sectionConfig, (newData) => {
  if (newData) {
    console.log("HeroSection nhận data từ cha:", newData);

    // Merge config từ cha nếu có
    if (newData.colors || newData.gradients) {
      config = { ...config, ...newData };
    }

    // Update contributionData nếu được truyền từ cha
    if (newData.contributionData) {
      contributionData.value = {
        ...contributionData.value,
        ...newData.contributionData
      };

      // Animate progress
      animateProgress(newData.contributionData.targetProgress || contributionData.value.targetProgress);
    }
  }
}, { immediate: true });

const animateProgress = (targetProgress) => {
  let startTimestamp = null
  const target = targetProgress || contributionData.value.targetProgress

  const animate = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const elapsed = timestamp - startTimestamp
    const progress = Math.min(elapsed / config.animationDuration, 1)

    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    animatedProgress.value = Math.floor(easeOutQuart * target)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

let shuffledList = []
let currentIndex = 0
const currentMessage = ref({})

const initShuffle = (list) => {
  if (!list || list.length === 0) return

  shuffledList = [...list]

  // Fisher–Yates shuffle
  for (let i = shuffledList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]]
  }

  currentIndex = 0
  console.log('Shuffled list:', shuffledList)
}

const getNextRandomItem = () => {
  // Kiểm tra danh sách rỗng
  if (!shuffledList || shuffledList.length === 0) {
    console.warn('Danh sách rỗng')
    return null
  }

  // Nếu đã hết danh sách, reset về đầu
  if (currentIndex >= shuffledList.length) {
    currentIndex = 0
  }

  const item = shuffledList[currentIndex]
  currentIndex++
  return item
}

let timer = null

const startRandomTimer = (list) => {
  if (timer) return

  // Khởi tạo danh sách
  initShuffle(list)

  // Hiển thị item đầu tiên ngay lập tức
  const firstItem = getNextRandomItem()
  if (firstItem) {
    currentMessage.value = firstItem
  }

  // Bắt đầu timer
  timer = setInterval(() => {
    const item = getNextRandomItem()
    if (item) {
      currentMessage.value = item
    }
  }, 5000)
}

const stopRandomTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// Trong onMounted
onMounted(() => {
  animateProgress(contributionData.value.targetProgress)

  // Kiểm tra xem có notifications không
  if (props.sectionConfig && props.sectionConfig.notifications) {
    startRandomTimer(props.sectionConfig.notifications)
  }
})
</script>

<style scoped>
.notifications {
  padding: 20px;
  color: #031358;
}

/* Badge "Đã đăng ký góp vốn" */
.investment-badge {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
}

.badge-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  background:lavender;
  color: #0030ff;
  padding: 12px 40px;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 20px rgb(10, 36, 99);
  border: 3px solid rgba(255, 255, 255, 0.8);
  animation: badgeGlow 2s ease-in-out infinite alternate;
}

.badge-content i {
  font-size: 18px;
}

@keyframes badgeGlow {
  0% {
    box-shadow: 0 4px 20px rgb(10, 36, 99);
  }
  100% {
    box-shadow: 0 4px 30px rgb(10, 36, 99);
  }
}

/* Status message */
.status-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-weight: 500;
}

.status-success {
  background: v-bind('config.colors.successLight');
  color: v-bind('config.colors.success');
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-warning {
  background: v-bind('config.colors.warningLight');
  color: v-bind('config.colors.warning');
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-message i {
  font-size: 16px;
}

/* Package Select Styles */
.package-select-wrapper {
  position: relative;
  margin-bottom: 15px;
}

.package-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: v-bind('config.colors.textDark');
  margin-bottom: 8px;
}

.package-label i {
  color: v-bind('config.colors.primary');
  font-size: 16px;
}

.package-select {
  width: 100%;
  padding: 12px 15px;
  font-size: 14px;
  border: 2px solid v-bind('config.colors.cardBackground');
  border-radius: 8px;
  background-color: white;
  color: v-bind('config.colors.textDark');
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.package-select:focus {
  outline: none;
  border-color: v-bind('config.colors.primary');
  box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.1);
}

.package-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.package-select option {
  padding: 10px;
}

.select-arrow {
  position: absolute;
  right: 15px;
  top: 42px;
  transform: translateY(-50%);
  pointer-events: none;
  color: v-bind('config.colors.primary');
}

.package-select:disabled + .select-arrow {
  color: #ccc;
}

.package-hint {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.package-hint i {
  color: v-bind('config.colors.primaryLight');
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: v-bind('config.gradients.progress');
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(42, 82, 152, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary i {
  font-size: 14px;
}

/* CSS giữ nguyên, chỉ sửa backgroundImage để dynamic */
.branch-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

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
  gap: 15px;
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

  /* Đảm bảo xuống dòng */
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
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
@media (max-width: 800px) {
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

  /* Responsive badge */
  .badge-content {
    transform: translate(-50%, -50%) rotate(35deg);
    padding: 8px 30px;
    font-size: 14px;
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

  .status-message {
    padding: 10px 12px;
    font-size: 14px;
  }

  .package-select-wrapper {
    margin-bottom: 12px;
  }

  .package-select {
    padding: 10px 12px;
  }

  .select-arrow {
    top: 38px;
    right: 12px;
  }
}

@media (max-width: 480px) {
  .badge-content {
    transform: translate(-50%, -50%) rotate(30deg);
    padding: 6px 20px;
    font-size: 12px;
  }

  .badge-content i {
    font-size: 14px;
  }
}
</style>