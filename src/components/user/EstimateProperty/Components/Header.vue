<template>
  <div class="banner">
    <img
        class="bg-img"
        :src="baseImgaeUrl+headerData.banner.imageUrl"
        :alt="headerData.banner.altText"
    >

    <div class="content-wrapper">
      <!-- Card Liquid Glass kết hợp cả hai phần -->
      <div class="liquid-glass-card" :style="cardStyles">
        <!-- Phần hình ảnh bên trái -->
        <div class="card-image-section">
          <div class="image-circle">
            <img
                :src="baseImgaeUrl+headerData.card.iconUrl"
                :alt="headerData.card.iconAlt"
            >
          </div>
        </div>

        <!-- Phần nội dung bên phải -->
        <div class="card-content-section">
          <h2 class="card-title">{{ headerData.card.title }}</h2>
          <div class="divider-line"></div>

          <div class="stats-container">
            <div
                v-for="(stat, index) in headerData.stats"
                :key="index"
                class="stat-box"
            >
              <p class="stat-number" :style="{ color: stat.color }">
                {{ stat.number }}<span>{{ stat.plusSign }}</span>
              </p>
              <p class="stat-label">{{ stat.label }}</p>
            </div>
          </div>
          <button
              class="btn valuation-btn"
              ref="valuationBtn"
              :style="buttonStyles"
          >
            <router-link
                :to="headerData.button.link"
                class="nav-link"
            >
              <i class="" style="color: #ff6a00 !important;"></i>
              {{ headerData.button.text }}
              <i :class="headerData.button.icon"></i>
            </router-link>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import {baseImgaeUrl} from "../../../../assets/js/global.js";


const valuationBtn = ref(null);

// Dữ liệu mẫu - có thể thay thế bằng API call sau này
const headerData = ref({
  banner: {
    imageUrl: "/imgs/Banner-dinh-gia.png",
    altText: "Banner định giá bất động sản"
  },
  card: {
    iconUrl: "/imgs/svg-dinh-gia.svg",
    iconAlt: "icon định giá",
    title: "Xác định giá trị bất động sản nhanh và chính xác nhất"
  },
  stats: [
    {
      number: "500",
      plusSign: "+",
      label: "Dự án",
      color: "#002FFF"
    },
    {
      number: "5Tr",
      plusSign: "+",
      label: "BĐS đã xác thực",
      color: "#002FFF"
    },
    {
      number: "2Tr",
      plusSign: "+",
      label: "Lượt định giá",
      color: "#002FFF"
    }
  ],
  button: {
    text: "Định giá ngay",
    link: "/bao-cao-dinh-gia",
    icon: "fa-solid fa-paper-plane",
    gradient: {
      start: "#667eea",
      middle: "#0a2463",
      end: "#0030ff"
    }
  },
  styles: {
    cardBackground: "rgba(255, 255, 255, 0.15)",
    cardBlur: "10px",
    borderColor: "rgba(255, 255, 255, 0.2)",
    buttonBorderColor: "rgba(255, 255, 255, 0.6)",
    buttonBorderWidth: "4px"
  }
});

const props= defineProps({
  sectionData: String
});

if(props.sectionData) {
  headerData.value= JSON.parse(props.sectionData);
  console.log("headerData:", headerData.value)
}else console("Không nhận được props dùng default")

// Computed styles cho card
const cardStyles = computed(() => ({
  'background': headerData.value.styles.cardBackground,
  'backdrop-filter': `blur(${headerData.value.styles.cardBlur})`,
  '-webkit-backdrop-filter': `blur(${headerData.value.styles.cardBlur})`,
  'border-color': headerData.value.styles.borderColor
}));

// Computed styles cho button
const buttonStyles = computed(() => ({
  'background': `linear-gradient(135deg, ${headerData.value.button.gradient.start} 0%, ${headerData.value.button.gradient.middle} 50%, ${headerData.value.button.gradient.end} 100%)`,
  'border': `${headerData.value.styles.buttonBorderWidth} solid ${headerData.value.styles.buttonBorderColor}`
}));

// Hàm để update dữ liệu từ CMS (có thể gọi từ parent component)
const updateHeaderData = (newData) => {
  headerData.value = { ...headerData.value, ...newData };
};

// Hàm làm nổi bật nút định giá
const highlightValuationButton = () => {
  if (valuationBtn.value) {
    const btn = valuationBtn.value;
    btn.classList.add('pulse-effect');

    setTimeout(() => {
      btn.classList.remove('pulse-effect');
    }, 3000);
  }
};

// Expose function để parent component gọi
defineExpose({
  highlightValuationButton,
  updateHeaderData,
  headerData
});

onMounted(() => {
  const animatedElements = document.querySelectorAll(
      ".fade-left, .fade-right, .fade-in, .fade-up"
  );

  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
      }
  );

  animatedElements.forEach((el) => observer.observe(el));

  // cleanup
  onBeforeUnmount(() => {
    observer.disconnect();
  });
});
</script>

<style scoped>
/* Giữ nguyên toàn bộ CSS từ file gốc */
.banner {
  position: relative;
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  overflow: hidden;
}

.bg-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 100px;
  width: 100%;
  max-width: 1400px;
}

/* Liquid Glass Card với hiệu ứng trong suốt hơn */
.liquid-glass-card {
  display: flex;
  background: rgba(255, 255, 255, 0.15); /* Sẽ được ghi đè bởi dynamic style */
  backdrop-filter: blur(10px); /* Sẽ được ghi đè bởi dynamic style */
  -webkit-backdrop-filter: blur(10px); /* Sẽ được ghi đè bởi dynamic style */
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2); /* Sẽ được ghi đè bởi dynamic style */
  box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  overflow: hidden;
  width: 100%;
  max-width: 900px;
  padding: 0;
  gap: 10px;
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Hiệu ứng ánh sáng cho card */
.liquid-glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
  transparent,
  rgba(255, 255, 255, 0.3),
  transparent
  );
}

/* Phần hình ảnh bên trái */
.card-image-section {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.image-circle {
  background: rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(3, 19, 88, 0.2);
  border-radius: 50%;
  width: 220px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.08),
      inset 0 4px 10px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
}

.image-circle img {
  width: 250px;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

/* Phần nội dung bên phải */
.card-content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0;
}

.card-title {
  font-family: 'Ubuntu', sans-serif;
  font-size: 24px;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.3;
  text-align: center;
}

.divider-line {
  width: 80%;
  height: 3px;
  background: linear-gradient(90deg,
  transparent,
  rgba(3, 19, 88, 0.4),
  transparent
  );
  margin: 0 auto 25px;
  border-radius: 2px;
}

/* Stats Container */
.stats-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-box {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  width: 150px;
  padding: 20px 10px;
  box-shadow:
      0 4px 15px rgba(0, 0, 0, 0.08),
      inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.stat-box:hover {
  transform: translateY(-5px);
  box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.1),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.stat-number {
  font-family: 'Ubuntu', sans-serif;
  font-size: 32px;
  color: #002FFF; /* Sẽ được ghi đè bởi dynamic style */
  font-weight: 800;
  margin: 0;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.stat-number span {
  font-size: 20px;
  vertical-align: super;
  font-weight: 600;
}

.stat-label {
  font-family: 'Ubuntu', sans-serif;
  font-size: 14px;
  color: #031358;
  margin-top: 8px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

/* Nút định giá - Gradient mới đẹp hơn với viền dày hơn */
.valuation-btn {
  background: linear-gradient(135deg, #667eea 0%, #0a2463 50%, #0030ff 100%) !important; /* Sẽ được ghi đè bởi dynamic style */
  backdrop-filter: blur(8px);
  border: 4px solid rgba(255, 255, 255, 0.6) !important; /* Sẽ được ghi đè bởi dynamic style */
  border-radius: 20px;
  width: 490px;
  margin: 10px auto;
  padding: 20px 10px;
  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.25),
      inset 0 2px 4px rgba(255, 255, 255, 0.4),
      0 0 0 2px rgba(255, 255, 255, 0.3);
  transition: all 0.5s ease;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.valuation-btn .nav-link {
  color: #ffffff !important;
  font-weight: 700;
  font-size: 24px;
  text-decoration: none;
  display: block;
  transition: all 0.5s ease;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Hiệu ứng hover mạnh hơn */
.valuation-btn:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow:
      0 15px 40px rgba(0, 0, 0, 0.3),
      inset 0 2px 4px rgba(255, 255, 255, 0.5),
      0 0 0 4px rgba(255, 255, 255, 0.4);
  background: linear-gradient(135deg, #0a2463 0%, #0030ff 50%, #667eea 100%) !important;
  border: 4px solid rgba(255, 255, 255, 0.8) !important;
}

/* Hiệu ứng pulse mạnh hơn với viền dày - chạy 3 lần trong 3 giây */
.valuation-btn.pulse-effect {
  animation: strongPulse 1s ease-in-out 3, borderFlowStrong 1s ease-in-out 3;
  border-width: 4px !important;
}

/* Hiệu ứng pulse mạnh hơn - 1 chu kỳ 1 giây */
@keyframes strongPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.25),
        inset 0 2px 4px rgba(255, 255, 255, 0.4),
        0 0 0 2px rgba(255, 255, 255, 0.3);
  }
  25% {
    transform: scale(1.05);
    box-shadow:
        0 15px 40px rgba(0, 0, 0, 0.35),
        inset 0 2px 4px rgba(255, 255, 255, 0.5),
        0 0 0 4px rgba(255, 255, 255, 0.5);
  }
  50% {
    transform: scale(1.03);
    box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.4),
        inset 0 2px 4px rgba(255, 255, 255, 0.6),
        0 0 0 6px rgba(255, 255, 255, 0.6);
  }
  75% {
    transform: scale(1.05);
    box-shadow:
        0 15px 40px rgba(0, 0, 0, 0.35),
        inset 0 2px 4px rgba(255, 255, 255, 0.5),
        0 0 0 4px rgba(255, 255, 255, 0.5);
  }
}

/* Hiệu ứng viền mạnh hơn với màu gradient - 1 chu kỳ 1 giây */
@keyframes borderFlowStrong {
  0% {
    border-color: rgba(255, 255, 255, 0.6);
  }
  25% {
    border-top-color: rgba(255, 255, 255, 1);
    border-right-color: rgba(255, 255, 255, 0.6);
    border-bottom-color: rgba(255, 255, 255, 0.6);
    border-left-color: rgba(255, 255, 255, 0.6);
  }
  50% {
    border-top-color: rgba(255, 255, 255, 0.6);
    border-right-color: rgba(255, 255, 255, 1);
    border-bottom-color: rgba(255, 255, 255, 0.6);
    border-left-color: rgba(255, 255, 255, 0.6);
  }
  75% {
    border-top-color: rgba(255, 255, 255, 0.6);
    border-right-color: rgba(255, 255, 255, 0.6);
    border-bottom-color: rgba(255, 255, 255, 1);
    border-left-color: rgba(255, 255, 255, 0.6);
  }
  100% {
    border-top-color: rgba(255, 255, 255, 0.6);
    border-right-color: rgba(255, 255, 255, 0.6);
    border-bottom-color: rgba(255, 255, 255, 0.6);
    border-left-color: rgba(255, 255, 255, 1);
  }
}

/* Animation */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design - Tablet */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 50px 60px;
  }

  .liquid-glass-card {
    max-width: 800px;
    padding: 25px;
    gap: 25px;
  }

  .image-circle {
    width: 200px;
    height: 200px;
  }

  .image-circle img {
    width: 140px;
  }

  .card-title {
    font-size: 22px;
  }

  .stat-box {
    width: 140px;
    padding: 18px 8px;
  }

  .stat-number {
    font-size: 30px;
  }

  .valuation-btn {
    width: 450px;
    border-width: 3px !important;
  }

  .valuation-btn .nav-link {
    font-size: 22px;
  }
}

@media (max-width: 900px) {
  .banner {
    min-height: 600px;
  }

  .content-wrapper {
    padding: 40px 50px;
  }

  .liquid-glass-card {
    flex-direction: column;
    text-align: center;
    max-width: 600px;
    gap: 20px;
  }

  .card-image-section {
    padding: 10px;
  }

  .image-circle {
    width: 180px;
    height: 180px;
    margin: 0 auto;
  }

  .image-circle img {
    width: 130px;
  }

  .card-content-section {
    padding: 0;
  }

  .card-title {
    font-size: 20px;
    margin-bottom: 12px;
  }

  .divider-line {
    width: 70%;
    margin-bottom: 20px;
  }

  .valuation-btn {
    width: 400px;
    border-width: 3px !important;
  }

  .valuation-btn .nav-link {
    font-size: 20px;
  }
}

/* Responsive Design - Mobile */
@media (max-width: 768px) {
  .banner {
    margin-top: 70px;
    min-height: 500px;
  }

  .content-wrapper {
    padding: 30px 20px;
  }

  .liquid-glass-card {
    padding: 20px;
    border-radius: 20px;
  }

  .image-circle {
    width: 160px;
    height: 160px;
  }

  .image-circle img {
    width: 110px;
  }

  .card-title {
    font-size: 18px;
  }

  .stats-container {
    gap: 15px;
  }

  .stat-box {
    width: 130px;
    padding: 15px 8px;
  }

  .stat-number {
    font-size: 28px;
  }

  .stat-number span {
    font-size: 18px;
  }

  .stat-label {
    font-size: 13px;
  }

  .content-wrapper {
    margin-top: 70px;
  }

  .valuation-btn {
    width: 350px;
    padding: 18px 10px;
    border-width: 3px !important;
  }

  .valuation-btn .nav-link {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .banner {
    margin-top: 60px;
    min-height: 450px;
  }

  .content-wrapper {
    padding: 20px 15px;
  }

  .liquid-glass-card {
    padding: 15px;
    border-radius: 18px;
    gap: 15px;
  }

  .image-circle {
    width: 140px;
    height: 140px;
  }

  .image-circle img {
    width: 100px;
  }

  .card-title {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .divider-line {
    width: 80%;
    margin-bottom: 15px;
  }

  .stats-container {
    gap: 10px;
  }

  .stat-box {
    width: calc(33.333% - 10px);
    min-width: 100px;
    padding: 12px 5px;
  }

  .stat-number {
    font-size: 24px;
  }

  .stat-number span {
    font-size: 16px;
  }

  .stat-label {
    font-size: 11px;
    margin-top: 6px;
  }

  .content-wrapper {
    margin-top: 70px;
  }

  .valuation-btn {
    width: 280px;
    padding: 15px 8px;
    border-width: 2px !important;
  }

  .valuation-btn .nav-link {
    font-size: 16px;
  }
}

@media (max-width: 360px) {
  .banner {
    min-height: 400px;
  }

  .content-wrapper {
    padding: 15px 12px;
  }

  .liquid-glass-card {
    padding: 12px;
  }

  .image-circle {
    width: 120px;
    height: 120px;
  }

  .image-circle img {
    width: 85px;
  }

  .card-title {
    font-size: 15px;
  }

  .stat-box {
    width: calc(33.333% - 8px);
    min-width: 90px;
    padding: 10px 4px;
  }

  .stat-number {
    font-size: 22px;
  }

  .stat-number span {
    font-size: 14px;
  }

  .stat-label {
    font-size: 10px;
  }

  .valuation-btn {
    width: 250px;
    padding: 12px 6px;
    border-width: 2px !important;
  }

  .valuation-btn .nav-link {
    font-size: 15px;
  }
}

/* Xử lý cho màn hình rất nhỏ */
@media (max-width: 320px) {
  .stats-container {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .stat-box {
    width: 120px;
  }

  .valuation-btn {
    width: 220px;
    border-width: 2px !important;
  }

  .valuation-btn .nav-link {
    font-size: 14px;
  }
}
</style>