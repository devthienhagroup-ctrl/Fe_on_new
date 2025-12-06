<template>
  <div class="banner">
    <img class="bg-img" src="/imgs/Banner-dinh-gia.png" alt="Banner định giá bất động sản">

    <div class="content-wrapper">
      <!-- Card Liquid Glass kết hợp cả hai phần -->
      <div class="liquid-glass-card">
        <!-- Phần hình ảnh bên trái -->
        <div class="card-image-section">
          <div class="image-circle">
            <img src="/imgs/svg-dinh-gia.svg" alt="icon định giá">
          </div>
        </div>

        <!-- Phần nội dung bên phải -->
        <div class="card-content-section">
          <h2 class="card-title">Xác định giá trị bất động sản nhanh và chính xác nhất</h2>
          <div class="divider-line"></div>

          <div class="stats-container">
            <div class="stat-box">
              <p class="stat-number">500<span>+</span></p>
              <p class="stat-label">Dự án</p>
            </div>
            <div class="stat-box">
              <p class="stat-number">5Tr<span>+</span></p>
              <p class="stat-label">BĐS đã xác thực</p>
            </div>
            <div class="stat-box">
              <p class="stat-number">2Tr<span>+</span></p>
              <p class="stat-label">Lượt định giá</p>
            </div>
          </div>
          <button class="btn valuation-btn" style="background-color:rgba(255, 255, 255, 0.6);     backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 15px;
    width: 490px;
    margin: 10px auto;
    padding: 20px 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.3);
    transition: transform 0.3s
ease, box-shadow 0.3s
ease;
    text-align: center;">
            <router-link to="/bao-cao-dinh-gia" class="nav-link" style="color: #002FFF; font-weight: 700; font-size: 24px">
              <i class="" style="color: #ff6a00 !important;"></i> Định giá ngay <i class="fa-solid fa-paper-plane"></i>
            </router-link>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="main-content">
    <ProcessEP></ProcessEP>
    <PropertyValueFactors id="propertyValueFactors"></PropertyValueFactors>
    <Reason></Reason>
    <FeeEP id="feeEP" @navigateToValuation="scrollToValuation"></FeeEP>
    <SoldSection title="DỰ ÁN ĐÃ BÁN THÀNH CÔNG NHỜ ĐỊNH GIÁ ĐÚNG"></SoldSection>
    <Faq @navigateToCriteria="scrollToCriteria"
         @navigateToPricing="scrollToPricing"
         @navigateToValuation="scrollToValuation"
    ></Faq>
    <ContactForm></ContactForm>
  </div>
</template>


<script setup>
import ProcessStep from "./Components/ProcessStep.vue";
import ProcessEP from "./Components/ProcessEP.vue";
import PropertyValueFactors from "./Components/PropertyValueFactors.vue";
import Reason from "./Components/Reason.vue";
import Faq from "./Components/Faq.vue";
import SoldSection from "../Home/components/SoldSection.vue";
import ContactForm from "../Home/components/ContactForm.vue";
import Footer from "../Home/components/Footer.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import FeeEP from "./Components/FeeEP.vue";
import { removeJsonLd, setJsonLd } from "../../../utils/structuredData.js";

const estimateJsonLdId = "jsonld-estimate-property-itemlist";

onMounted(() => {
  setJsonLd(estimateJsonLdId, {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: "http://localhost:8084/dinh-gia-bds"
      }
    ]
  });
});

onBeforeUnmount(() => removeJsonLd(estimateJsonLdId));

const valuationBtn = ref(null);

// Hàm cuộn đến phần tiêu chí định giá
const scrollToCriteria = () => {
  const element = document.getElementById('propertyValueFactors');
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Hàm cuộn đến phần bảng giá
const scrollToPricing = () => {
  const element = document.getElementById('feeEP');
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Hàm cuộn lên đầu trang và làm nổi bật nút
const scrollToValuation = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Kích hoạt hiệu ứng nổi bật sau khi cuộn lên
  setTimeout(() => {
    highlightValuationButton();
  }, 500);
};

// Hàm làm nổi bật nút định giá
const highlightValuationButton = () => {
  if (valuationBtn.value) {
    const btn = valuationBtn.value;

    // Thêm class pulse-effect
    btn.classList.add('pulse-effect');

    // Tự động remove class sau 3 giây (thời gian animation)
    setTimeout(() => {
      btn.classList.remove('pulse-effect');
    }, 3000);
  }
};

onMounted(() => {
  const animatedElements = document.querySelectorAll(
      ".fade-left, .fade-right, .fade-in, .fade-up"
  );

  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            // Nếu chỉ muốn chạy 1 lần, unobserve sau khi hiện
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5, // phần tử hiện 20% là kích hoạt
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
  background: rgba(255, 255, 255, 0.15); /* Giảm opacity để trong suốt hơn */
  backdrop-filter: blur(10px); /* Giảm blur để trong suốt hơn */
  -webkit-backdrop-filter: blur(10px);
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2); /* Border trong suốt hơn */
  box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.08), /* Shadow nhẹ hơn */
      inset 0 1px 0 rgba(255, 255, 255, 0.15); /* Inner shadow nhẹ hơn */
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
  rgba(255, 255, 255, 0.3), /* Nhẹ hơn */
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
  background: rgba(255, 255, 255, 0.3); /* Trong suốt hơn */
  border: 2px solid rgba(3, 19, 88, 0.2); /* Border nhẹ hơn */
  border-radius: 50%;
  width: 220px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow:
      0 8px 20px rgba(0, 0, 0, 0.08), /* Shadow nhẹ hơn */
      inset 0 4px 10px rgba(255, 255, 255, 0.2); /* Inner shadow nhẹ hơn */
  backdrop-filter: blur(5px);
}

.image-circle img {
  width: 250px;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15)); /* Shadow nhẹ hơn */
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
  rgba(3, 19, 88, 0.4), /* Nhẹ hơn */
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
  background: rgba(255, 255, 255, 0.4); /* Trong suốt hơn */
  backdrop-filter: blur(8px); /* Giảm blur */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Border trong suốt hơn */
  border-radius: 15px;
  width: 150px;
  padding: 20px 10px;
  box-shadow:
      0 4px 15px rgba(0, 0, 0, 0.08), /* Shadow nhẹ hơn */
      inset 0 2px 4px rgba(255, 255, 255, 0.2); /* Inner shadow nhẹ hơn */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.stat-box:hover {
  transform: translateY(-5px);
  box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.1), /* Shadow nhẹ hơn */
      inset 0 2px 4px rgba(255, 255, 255, 0.3); /* Inner shadow nhẹ hơn */
}

.stat-number {
  font-family: 'Ubuntu', sans-serif;
  font-size: 32px;
  color: #002FFF;
  font-weight: 800;
  margin: 0;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); /* Shadow nhẹ hơn */
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
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6); /* Shadow nhẹ hơn */
}

/* Nút định giá - Gradient mới đẹp hơn với viền dày hơn */
.valuation-btn {
  background: linear-gradient(135deg,
  #667eea 0%,
  #0a2463 50%,
  #0030ff 100%) !important;
  backdrop-filter: blur(8px);
  border: 4px solid rgba(255, 255, 255, 0.6) !important; /* Viền dày hơn và sáng hơn */
  border-radius: 20px; /* Bo góc lớn hơn để phù hợp với viền dày */
  width: 490px;
  margin: 10px auto;
  padding: 20px 10px;
  box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.25), /* Shadow đậm hơn */
      inset 0 2px 4px rgba(255, 255, 255, 0.4), /* Inner shadow sáng hơn */
      0 0 0 2px rgba(255, 255, 255, 0.3); /* Thêm outer glow */
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
  transform: translateY(-5px) scale(1.02); /* Thêm scale để nổi bật hơn */
  box-shadow:
      0 15px 40px rgba(0, 0, 0, 0.3), /* Shadow đậm hơn */
      inset 0 2px 4px rgba(255, 255, 255, 0.5), /* Inner shadow sáng hơn */
      0 0 0 4px rgba(255, 255, 255, 0.4); /* Outer glow dày hơn */
  background: linear-gradient(135deg,
  #0a2463 0%,
  #0030ff 50%,
  #667eea 100%) !important;
  border: 4px solid rgba(255, 255, 255, 0.8) !important; /* Viền sáng hơn khi hover */
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
    border-width: 3px !important; /* Giảm viền trên tablet */
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
    border-width: 3px !important; /* Giảm viền trên tablet nhỏ */
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

  .valuation-btn {
    width: 350px;
    padding: 18px 10px;
    border-width: 3px !important; /* Giảm viền trên mobile */
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
    border-width: 2px !important; /* Giảm viền trên mobile nhỏ */
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
    border-width: 2px !important; /* Giữ viền mỏng trên màn hình rất nhỏ */
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
    border-width: 2px !important; /* Giữ viền mỏng trên màn hình rất nhỏ */
  }

  .valuation-btn .nav-link {
    font-size: 14px;
  }
}
</style>