<template>
  <div class="intro-section" :style="backgroundStyle">
    <div class="intro-container">
      <div class="intro-header">
        <img src="/imgs/logoTHG.png" alt="Logo Thiên Hà Group" class="intro-logo">
        <h1 class="intro-title">
          <span class="title-line">{{ config.titleLine1 }}</span>
          <span class="title-line">{{ config.titleLine2 }}</span>
        </h1>
      </div>

      <div class="intro-content">
        <div class="rich-text-editor-wrapper">
        <div class="intro-text tiptap" v-html="config.contentHTML"></div>
      </div>
        <div class="benefits-section">
          <h3 class="benefits-title">{{ config.benefitsTitle }}</h3>
          <div class="benefits-grid">
            <div class="benefit-card" v-for="(benefit, index) in config.benefits" :key="index"
                 @mouseenter="hoveredBenefit = index" @mouseleave="hoveredBenefit = null">
              <div class="benefit-card-inner">
                <div class="benefit-icon">
                  <i :class="['fa-solid', benefit.icon, { 'fa-beat': hoveredBenefit === index }]"></i>
                </div>
                <div class="benefit-content">
                  <h4 class="benefit-heading">{{ benefit.heading }}</h4>
                  <p class="benefit-description">{{ benefit.description }}</p>
                </div>
              </div>
            </div>
            <div class="benefit-card">
              <div class="benefit-card-inner">
                <img src="/imgs/logoTHG.png" alt="Logo Thiên Hà Group">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// CONFIG OBJECT
let config = {
  // Logo

  // Title
  titleLine1: 'Cùng Thiên Hà Group mở rộng mạng lưới –',
  titleLine2: 'Chung tay phát triển hệ thống chi nhánh BĐS trên toàn quốc',

  // Background
  backgroundImage: '/imgs/bg-investment.jpg',

  // Content HTML - mỗi thẻ p là một đoạn văn
  contentHTML: `
<p><b>Thiên Hà Group</b> hướng đến mục tiêu phát triển một hệ sinh thái kinh doanh bất động sản bền vững – nơi giá trị tài sản được mở rộng, vận hành minh bạch và tạo ra lợi nhuận ổn định cho nhà đầu tư. Chúng tôi đang mở cơ hội góp vốn mở chi nhánh mới, dành cho những cá nhân & đối tác muốn đồng hành phát triển cùng doanh nghiệp trong giai đoạn mở rộng quy mô.</p>
<p>Với mỗi chi nhánh triển khai, Thiên Hà Group sẽ công bố kế hoạch kinh doanh, dự toán dòng tiền, tỷ suất lợi nhuận dự kiến và báo cáo theo từng giai đoạn, đảm bảo nhà đầu tư dễ dàng nắm bắt hiệu quả hoạt động của từng dự án. Tỷ lệ lợi nhuận và phương án chia sẽ được quy định rõ trong từng dự án chi tiết – minh bạch, tách bạch, dễ theo dõi.</p>
<p>Chúng tôi cam kết luôn đặt hiệu quả đầu tư & sự an toàn của nguồn vốn lên hàng đầu. Mọi dự án đều được triển khai theo quy trình rõ ràng, có hợp đồng pháp lý ràng buộc, hệ thống báo cáo minh bạch, cùng chuyên môn vận hành từ đội ngũ giàu kinh nghiệm.</p>
  `,

  // Benefits section
  benefitsTitle: 'Vì sao nên góp vốn cùng Thiên Hà Group?',
  benefits: [
    {
      icon: 'fa-chart-line',
      heading: 'Mở rộng chi nhánh tiềm năng',
      description: 'Mở rộng chi nhánh ở các khu vực tiềm năng – dữ liệu cập nhật động theo từng đợt phát hành'
    },
    {
      icon: 'fa-file-invoice-dollar',
      heading: 'Minh bạch tài chính',
      description: 'Minh bạch dòng tiền, báo cáo định kỳ rõ ràng'
    },
    {
      icon: 'fa-hand-holding-usd',
      heading: 'Chính sách lợi nhuận rõ ràng',
      description: 'Mỗi dự án đều có chính sách lợi nhuận riêng, tỷ lệ chia cụ thể – công khai ngay trong trang chi tiết'
    },
    {
      icon: 'fa-handshake',
      heading: 'Đồng hành dài hạn',
      description: 'Đồng hành dài hạn cùng doanh nghiệp bất động sản đang tăng trưởng mạnh'
    },
    {
      icon: 'fa-sitemap',
      heading: 'Đa dạng hóa đầu tư',
      description: 'Cơ hội sở hữu phần lợi nhuận từ nhiều chi nhánh khác nhau nếu đầu tư đa dự án'
    }
  ],

  // CSS Properties
  styles: {
    // Colors
    primaryColor: '#fbbf24',
    textColor: 'white',

    // Background
    overlayOpacity: 0.6,
    contentBgOpacity: 0.1,
    contentBorderOpacity: 0.2,

    // Spacing
    sectionPadding: '50px 0',
    mobileSectionPadding: '30px 0',
    contentPadding: '30px',
    mobileContentPadding: '20px',

    // Typography
    titleFontSize: '2.2rem',
    mobileTitleFontSize: '1.6rem',
    smallMobileTitleFontSize: '1.4rem',
    textFontSize: '1.1rem',
    mobileTextFontSize: '1rem',
    benefitsTitleFontSize: '1.4rem',
    benefitHeadingFontSize: '1.1rem',
    benefitDescriptionFontSize: '0.95rem',

    // Sizes
    logoHeight: '80px',
    mobileLogoHeight: '60px',
    benefitCardMaxHeight: '150px',
    benefitIconSize: '1.8rem',
    mobileBenefitIconSize: '1.5rem',

    // Effects
    blurIntensity: '10px',
    hoverTransform: 'translateY(-5px)'
  }
};

const props = defineProps({
  sectionData: Object
});

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã lấy data từ cha");
}

// Computed background style
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(${baseImgaeUrl+config.backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative'
  };
});

// Reactive hover state
const hoveredBenefit = ref(null);
</script>

<style scoped>
.intro-section {
  color: white;
  padding: 50px 0;
  position: relative;
  overflow: hidden;
  margin-top: 60px;
}

.intro-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 0;
}

.intro-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.intro-header {
  text-align: center;
  margin-bottom: 30px;
}

.intro-logo {
  height: 80px;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.intro-logo:hover {
  transform: scale(1.05);
}

.intro-title {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-line {
  display: block;
  animation: fadeInUp 0.8s ease-out;
}

.title-line:first-child {
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.title-line:last-child {
  animation-delay: 0.4s;
  animation-fill-mode: both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideInUp 0.8s ease-out 0.6s both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: justify;
  animation: fadeIn 0.8s ease-out 0.8s both;
}

.intro-text p {
  margin-bottom: 20px;
}

.intro-text p:last-child {
  margin-bottom: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.benefits-section {
  margin-top: 30px;
  animation: fadeIn 0.8s ease-out 1s both;
}

.benefits-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fbbf24;
  text-align: center;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.benefit-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  animation: slideInUp 0.6s ease-out;
  animation-fill-mode: both;
  max-height: 150px;
}

.benefit-card-inner img {
  max-height:100%;
  max-width: 70%;
  filter: brightness(0) invert(1);
}

.benefit-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.benefit-card:nth-child(1) {
  animation-delay: 1.2s;
}

.benefit-card:nth-child(2) {
  animation-delay: 1.4s;
}

.benefit-card:nth-child(3) {
  animation-delay: 1.6s;
}

.benefit-card:nth-child(4) {
  animation-delay: 1.8s;
}

.benefit-card:nth-child(5) {
  animation-delay: 2s;
}

.benefit-card:nth-child(6) {
  animation-delay: 2.2s;
}

.benefit-card-inner {
  display: flex;
  justify-content: center;
  gap: 15px;
  max-height: 100%;
}

.benefit-icon {
  color: #fbbf24;
  font-size: 1.8rem;
  flex-shrink: 0;
  margin-top: 5px;
  transition: all 0.3s ease;
}

.benefit-content {
  flex: 1;
}

.benefit-heading {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fbbf24;
}

.benefit-description {
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .intro-section {
    padding: 30px 0;
  }

  .intro-title {
    font-size: 1.6rem;
    gap: 8px;
  }

  .intro-content {
    padding: 20px;
  }

  .intro-logo {
    height: 60px;
  }

  .intro-text {
    font-size: 1rem;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .benefit-card {
    padding: 15px;
  }

  .benefit-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .intro-title {
    font-size: 1.4rem;
  }

  .title-line {
    display: block;
  }

  .benefit-card-inner {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style>