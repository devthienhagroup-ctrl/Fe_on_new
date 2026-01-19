<template>
  <!-- HERO SECTION (2 cột) -->
  <section id="hero" class="min-h-screen flex items-center relative overflow-hidden py-12 lg:py-0"
           :style="`background: ${injectBaseImgUrl(config.css.heroBackground)}`">
    <!-- Animated background elements -->
    <div class="light-effect top-10 left-10"></div>
    <div class="light-effect bottom-10 right-10"></div>

    <div class="container mx-auto px-4 lg:px-6 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Cột trái: Nội dung chính -->
        <div class="text-left" data-aos="fade-right" data-aos-duration="1000">
          <p class="text-blue-400 font-bold tracking-[0.3em] mb-4 uppercase fade-in-up" data-aos="fade-up" data-aos-duration="1000">
            {{ config.hero.subtitle }}
          </p>

          <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight text-white fade-in-up" data-aos="fade-up" data-aos-delay="200">
            {{ config.hero.titleLine1 }} <br>
            <span class="text-gradient highlight-text">{{ config.hero.titleLine2 }}</span>
          </h1>

          <p class="text-slate-300 text-lg mb-8 lg:mb-10 font-light fade-in-up" data-aos="fade-up" data-aos-delay="400">
            <b>{{ config.hero.companyName }}</b> {{ config.hero.description }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 fade-in-up" data-aos="fade-up" data-aos-delay="600">
            <a :href="config.hero.buttons.explore.link" class="btn-gradient glow">
              <i :class="`${config.hero.buttons.explore.icon} mr-2`"></i> {{ config.hero.buttons.explore.text }}
            </a>

            <a :href="config.hero.buttons.demo.link" class="btn-outline">
              <i :class="`${config.hero.buttons.demo.icon} mr-2`"></i> {{ config.hero.buttons.demo.text }}
            </a>
          </div>

          <!-- Ưu điểm nổi bật -->
          <div class="mt-12 grid grid-cols-2 gap-4">
            <div v-for="(benefit, index) in config.hero.benefits"
                 :key="index"
                 class="flex items-center"
                 :data-aos="benefit.aos"
                 :data-aos-delay="benefit.aosDelay">
              <div :class="`${benefit.iconBgClass} p-2 rounded-lg mr-3`">
                <i :class="`${benefit.icon} ${benefit.iconColor}`"></i>
              </div>
              <span class="text-slate-300 text-sm">{{ benefit.text }}</span>
            </div>
          </div>
        </div>

        <!-- Cột phải: Thống kê với hiệu ứng động -->
        <div class="relative" data-aos="fade-left" data-aos-duration="1000">
          <div class="grid grid-cols-2 gap-6">
            <!-- Thống kê -->
            <div v-for="(stat, index) in config.hero.stats"
                 :key="index"
                 class="hero-stat-item gradient-border"
                 :data-aos="stat.aos"
                 :data-aos-delay="stat.aosDelay"
                 :style="`animation-delay: ${stat.animationDelay};`">
              <div :class="`stat-icon-wrapper ${stat.iconWrapperClass}`">
                <i :class="stat.icon"></i>
              </div>
              <div class="counter count-up" :data-count="stat.count">{{ stat.initialValue }}</div>
              <p class="text-slate-400 text-sm uppercase tracking-widest mt-2">{{ stat.label }}</p>
              <div :class="`absolute bottom-2 right-2 ${stat.bottomIconColor}`">
                <i :class="`${stat.bottomIcon} text-2xl`"></i>
              </div>
            </div>
          </div>

          <!-- Card thông tin thêm -->
          <div class="mt-8 glass-card p-6" data-aos="fade-up" data-aos-delay="1000">
            <div class="flex items-center">
              <div :class="config.hero.infoCard.iconBgClass">
                <i :class="config.hero.infoCard.icon"></i>
              </div>
              <div>
                <h4 class="font-bold text-white">{{ config.hero.infoCard.title }}</h4>
                <p class="text-slate-400 text-sm">{{ config.hero.infoCard.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-400 hidden lg:block">
      <i :class="config.hero.scrollIndicator.icon"></i>
    </div>
  </section>

  <!-- FEATURES SECTION -->
  <section id="features" class="py-24 bg-brand-dark relative overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16" data-aos="fade-up">
        <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{{ config.features.section.subtitle }}</h2>
        <h3 class="text-4xl font-display font-bold text-white mb-4">{{ config.features.section.titleLine1 }} <span class="text-gradient">{{ config.features.section.titleLine2 }}</span></h3>
        <div class="section-divider"></div>
        <p class="max-w-2xl mx-auto text-slate-400 mt-6">
          {{ config.features.section.description }}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GlassCard
            v-for="feature in config.features.items"
            :key="feature.id"
            :title="feature.title"
            :icon-name="feature.iconName"
            :link="feature.link"
            :link-text="feature.linkText"
            :color="feature.color"
            :padding="feature.padding"
            :hover-effect="feature.hoverEffect"
            :aos="feature.aos"
            :aos-delay="feature.aosDelay"
            :quick-access-url="feature.quickAccessUrl"
            show-login-button
        >{{feature.description}}</GlassCard>
      </div>
    </div>
  </section>

  <!-- BENEFITS SECTION -->
  <section class="py-24 bg-slate-900 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="text-center mb-16" data-aos="fade-up">
        <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{{ config.benefits.section.subtitle }}</h2>
        <h3 class="text-4xl font-display font-bold text-white mb-4">{{ config.benefits.section.titleLine1 }} <span class="text-gradient">{{ config.benefits.section.titleLine2 }}</span></h3>
        <div class="section-divider"></div>
      </div>

      <div class="flex flex-col lg:flex-row items-center gap-12">
        <div class="lg:w-1/2" data-aos="fade-right">
          <div class="relative">
            <ImageWithShadow
                class="max-h-100"
                :src="baseImgaeUrl+config.benefits.image.src"
                :alt="config.benefits.image.alt"
                :show-shadow="true"
                :hover-effect="true"
                :duration="3.5"
                :delay-between="1.5"
            >
              <template #badge>
                <div class="absolute -bottom-6 -right-6 bg-slate-800 p-6 rounded-xl border border-slate-600 shadow-xl"
                     data-aos="zoom-in" data-aos-delay="400">
                  <p class="text-4xl font-display font-bold text-blue-500">{{ config.benefits.badge.value }}</p>
                  <p class="text-xs text-slate-400 uppercase tracking-widest">{{ config.benefits.badge.label }}</p>
                </div>
              </template>
            </ImageWithShadow>
          </div>
        </div>

        <div class="lg:w-1/2" data-aos="fade-left">
          <h3 class="text-2xl font-bold text-white mb-6">{{ config.benefits.question }}</h3>

          <div class="space-y-6">
            <div v-for="(benefit, index) in config.benefits.items"
                 :key="index"
                 class="flex items-start">
              <div :class="`${benefit.iconBgClass} p-3 rounded-lg mr-4 ${benefit.iconColor} min-w-[60px] min-h-[60px] mt-2 flex items-center justify-center`">
                <i :class="benefit.icon"></i>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-white mb-1">{{ benefit.title }}</h4>
                <p class="text-slate-400">{{ benefit.description }}</p>
              </div>
            </div>
          </div>

          <div class="mt-8">
            <a :href="config.benefits.cta.link" class="btn-gradient inline-block">
              <i :class="`${config.benefits.cta.icon} mr-2`"></i> {{ config.benefits.cta.text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- MỤC MỚI: TÍCH HỢP & CÔNG NGHỆ -->
  <section id="integration" class="py-24 bg-brand-dark relative overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16" data-aos="fade-up">
        <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{{ config.integration.section.subtitle }}</h2>
        <h3 class="text-4xl font-display font-bold text-white mb-4">{{ config.integration.section.titleLine1 }} <span class="text-gradient">{{ config.integration.section.titleLine2 }}</span></h3>
        <div class="section-divider"></div>
        <p class="max-w-2xl mx-auto text-slate-400 mt-6">
          {{ config.integration.section.description }}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <SimpleGlassCard
            v-for="integration in config.integration.items"
            :key="integration.id"
            :title="integration.title"
            :description="integration.description"
            :icon="integration.iconName"
            :color="integration.color"
            :hover-effect="integration.hoverEffect"
        />
      </div>

      <!-- Timeline quy trình tích hợp -->
      <div class="mt-16 mx-auto" data-aos="fade-up">
        <h4 class="text-2xl font-bold text-white text-center mb-8">{{ config.integration.timeline.title }}</h4>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(step, index) in config.integration.timeline.steps"
               :key="index"
               class="timeline-item"
               :data-aos="step.aos"
               :data-aos-delay="step.aosDelay">
            <div class="bg-slate-800/50 p-6 rounded-lg">
              <div :class="`${step.numberColor} text-2xl font-bold mb-2`">{{ step.number }}</div>
              <h5 class="text-lg font-bold text-white mb-3">{{ step.title }}</h5>
              <p class="text-slate-400">{{ step.description }}</p>
            </div>
          </div>
        </div>

        <div class="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
          <a :href="config.integration.cta.link" class="btn-gradient inline-block">
            <i :class="`${config.integration.cta.icon} mr-2`"></i> {{ config.integration.cta.text }}
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA SECTION -->
  <section id="contact" class="py-24 relative overflow-hidden"
           :style="`background: ${config.cta.background}`">
    <div class="container mx-auto px-6">
      <div :class="`${config.cta.card.bgColor} rounded-3xl p-12 md:p-20 text-center relative overflow-hidden`"
           data-aos="zoom-in"
           data-aos-duration="1000">
        <!-- Decorative Circles (exact like original) -->
        <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black opacity-10 rounded-full"></div>

        <h2 class="text-4xl font-display font-bold text-white mb-6">{{ config.cta.title }}</h2>
        <p class="text-slate-300 mb-10">
          {{ config.cta.description }}
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a :href="config.cta.buttons.consultation.link"
             :class="config.cta.buttons.consultation.class">
            <i :class="`${config.cta.buttons.consultation.icon} mr-2`"></i> {{ config.cta.buttons.consultation.text }}
          </a>
          <a :href="config.cta.buttons.phone.link"
             :class="config.cta.buttons.phone.class">
            <i :class="`${config.cta.buttons.phone.icon} mr-2`"></i> {{ config.cta.buttons.phone.text }}
          </a>
        </div>

        <p class="text-slate-400 text-sm mt-8">
          <i :class="`${config.cta.footer.icon} mr-2`"></i> {{ config.cta.footer.text }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import {reactive, onMounted, ref} from 'vue'
import GlassCard from "../../UI/GlassCard.vue"
import SimpleGlassCard from "../../UI/SimpleGlassCard.vue"
import ImageWithShadow from "../../UI/ImageWithShadow.vue"
import api from "../../../../api/api.js";
import {baseImgaeUrl} from "../../../../assets/js/global.js";

const injectBaseImgUrl =(str)=> {
  return str.replace(/url\(\s*['"]?/g, match => match + baseImgaeUrl);
}


// Config object chứa tất cả dữ liệu và CSS properties
const config = ref({
  hero: {
    subtitle: "QUẢN LÝ TÀI SẢN THÔNG MINH",
    titleLine1: "Quản Lý Tài Sản",
    titleLine2: "Đẳng Cấp Thời Đại Số",
    companyName: "Thiên Hà Group",
    description: "giới thiệu nền tảng quản lý tài sản bất động sản toàn diện, kết hợp trí tuệ nhân tạo và công nghệ blockchain để tối ưu hóa quy trình môi giới, gia tăng hiệu suất và nâng tầm giá trị đầu tư của bạn.",
    buttons: {
      explore: {
        text: "Khám Phá Công Cụ",
        icon: "fas fa-rocket",
        link: "#features"
      },
      demo: {
        text: "Xem Demo",
        icon: "fas fa-play-circle",
        link: "#demo"
      }
    },
    benefits: [
      {
        text: "Quản lý đa tài sản",
        icon: "fa-solid fa-building-circle-check",
        iconColor: "text-blue-400",
        iconBgClass: "bg-blue-500/10",
        aos: "fade-up",
        aosDelay: "800"
      },
      {
        text: "Bảo mật tuyệt đối",
        icon: "fa-solid fa-building-shield",
        iconColor: "text-purple-400",
        iconBgClass: "bg-purple-500/10",
        aos: "fade-up",
        aosDelay: "900"
      },
      {
        text: "Cập nhật thời gian thực",
        icon: "fa-solid fa-repeat",
        iconColor: "text-emerald-400",
        iconBgClass: "bg-emerald-500/10",
        aos: "fade-up",
        aosDelay: "1000"
      },
      {
        text: "Hỗ trợ 24/7",
        icon: "fa-solid fa-headset",
        iconColor: "text-blue-400",
        iconBgClass: "bg-blue-500/10",
        aos: "fade-up",
        aosDelay: "1100"
      }
    ],
    stats: [
      {
        count: 10000,
        initialValue: "0",
        label: "Môi Giới Hợp Tác",
        icon: "fas fa-users",
        iconWrapperClass: "bg-blue-500/10 text-blue-400",
        bottomIcon: "fas fa-network-wired",
        bottomIconColor: "text-blue-400/30",
        aos: "zoom-in",
        aosDelay: "200",
        animationDelay: "0s"
      },
      {
        count: 85000,
        initialValue: "0",
        label: "Tài Sản Quản Lý",
        icon: "fas fa-building",
        iconWrapperClass: "bg-purple-500/10 text-purple-400",
        bottomIcon: "fas fa-chart-line",
        bottomIconColor: "text-purple-400/30",
        aos: "zoom-in",
        aosDelay: "400",
        animationDelay: "0.5s"
      },
      {
        count: 98.5,
        initialValue: "0",
        label: "Độ Chính Xác Dữ Liệu",
        icon: "fas fa-percentage",
        iconWrapperClass: "bg-emerald-500/10 text-emerald-400",
        bottomIcon: "fas fa-bullseye",
        bottomIconColor: "text-emerald-400/30",
        aos: "zoom-in",
        aosDelay: "600",
        animationDelay: "1s"
      },
      {
        count: 45,
        initialValue: "0",
        label: "Tỉnh Thành Phủ Sóng",
        icon: "fas fa-map-marked-alt",
        iconWrapperClass: "bg-blue-500/10 text-blue-400",
        bottomIcon: "fas fa-globe-asia",
        bottomIconColor: "text-blue-400/30",
        aos: "zoom-in",
        aosDelay: "800",
        animationDelay: "1.5s"
      }
    ],
    infoCard: {
      title: "Tăng 73% Hiệu Suất",
      description: "Các môi giới sử dụng nền tảng của chúng tôi tăng hiệu suất làm việc trung bình 73%",
      icon: "fas fa-bolt text-white",
      iconBgClass: "bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg mr-4"
    },
    scrollIndicator: {
      icon: "fas fa-chevron-down w-6 h-6"
    }
  },

  features: {
    section: {
      subtitle: "Tính Năng Đột Phá",
      titleLine1: "Quản Lý Nhiều Tài Sản",
      titleLine2: "Tiện Lợi Trên Một Nền Tảng",
      description: "Tích hợp tất cả công cụ cần thiết cho quy trình môi giới bất động sản chuyên nghiệp, từ quản lý khách hàng, theo dõi tài sản đến phân tích thị trường và tự động hóa tiếp cận."
    },
    items: [
      {
        id: 1,
        title: "Kho dữ liệu tập trung",
        description: "Lưu trữ và quản lý thông tin chi tiết của hàng nghìn tài sản bất động sản với đầy đủ hình ảnh, video 360°, tài liệu pháp lý và lịch sử giao dịch. Truy cập mọi lúc, mọi nơi trên đa thiết bị.",
        iconName: "fas fa-database",
        color: "blue",
        link: "#",
        linkText: "Khám phá ngay",
        padding: "large",
        hoverEffect: true,
        aos: "fade-up",
        aosDelay: "0",
        quickAccessUrl: "#"
      },
      {
        id: 2,
        title: "Nguồn khách hàng uy tính",
        description: "Kết nối với hơn 10.000 môi giới uy tín trên toàn quốc và hệ thống khách hàng tiềm năng được xác minh. Tự động đề xuất khách hàng phù hợp với từng loại tài sản, tăng tỷ lệ chốt giao dịch lên đến 67%.",
        iconName: "fas fa-user-friends",
        color: "purple",
        link: "#",
        linkText: "Tìm hiểu thêm",
        padding: "large",
        hoverEffect: true,
        aos: "fade-up",
        aosDelay: "200",
        quickAccessUrl: "#"
      },
      {
        id: 3,
        title: "Mở khóa thông tin chi tiết",
        description: "Truy cập thông tin chi tiết về tài sản đang đăng bán của các môi giới khác với mức phí hợp lý. Xem lịch sử giá, thời gian tồn kho, đánh giá của chuyên gia và dự báo xu hướng thị trường.",
        iconName: "fas fa-lock-open",
        color: "teal",
        link: "#",
        linkText: "Trải nghiệm ngay",
        padding: "large",
        hoverEffect: true,
        aos: "fade-up",
        aosDelay: "400",
        quickAccessUrl: "#"
      }
    ]
  },

  benefits: {
    section: {
      subtitle: "Lợi Ích Vượt Trội",
      titleLine1: "Một Công Cụ –",
      titleLine2: "Tối Ưu Cả Quy Trình Môi Giới"
    },
    image: {
      src: "https://images.unsplash.com/photo-1597733336794-12d05021d510?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8&ixlib=rb-4.1.0&q=60&w=3000",
      alt: "Quản lý tài sản bất động sản"
    },
    badge: {
      value: "73%",
      label: "Tăng hiệu suất làm việc"
    },
    question: "Tại Sao Chọn Nền Tảng Quản Lý Tài Sản Của Thiên Hà Group?",
    items: [
      {
        title: "Lưu Trữ và Quản Trị Tập Trung",
        description: "Tất cả thông tin khách hàng, sản phẩm và lịch sử giao dịch được lưu trữ tập trung trên nền tảng đám mây bảo mật cao, đồng bộ hóa đa thiết bị theo thời gian thực.",
        icon: "fas fa-database",
        iconColor: "text-blue-400",
        iconBgClass: "bg-blue-500/10"
      },
      {
        title: "Cập Nhật Thời Gian Thực",
        description: "Nhận thông báo ngay lập tức khi có khách hàng quan tâm, tài sản mới phù hợp hoặc biến động thị trường quan trọng. Không bỏ lỡ bất kỳ cơ hội nào.",
        icon: "fas fa-bolt",
        iconColor: "text-purple-400",
        iconBgClass: "bg-purple-500/10"
      },
      {
        title: "Đề Xuất Sản Phẩm 'Đúng Gu'",
        description: "Thuật toán AI phân tích hành vi và sở thích của khách hàng để đề xuất chính xác các tài sản phù hợp, tăng tỷ lệ chốt giao dịch lên đến 45% so với phương pháp truyền thống.",
        icon: "fas fa-brain",
        iconColor: "text-emerald-400",
        iconBgClass: "bg-emerald-500/10"
      },
      {
        title: "Mạng Lưới Hợp Tác 10.000+ Môi Giới",
        description: "Kết nối và chia sẻ thông tin với mạng lưới môi giới uy tín trên toàn quốc, mở rộng phạm vi tiếp cận và tối ưu hóa cơ hội hợp tác, chia sẻ hoa hồng linh hoạt.",
        icon: "fas fa-handshake",
        iconColor: "text-blue-400",
        iconBgClass: "bg-blue-500/10"
      }
    ],
    cta: {
      text: "Đăng Ký Trải Nghiệm Miễn Phí",
      icon: "fas fa-calendar-check",
      link: "#contact"
    }
  },

  integration: {
    section: {
      subtitle: "Tích Hợp Công Nghệ",
      titleLine1: "Nền Tảng",
      titleLine2: "Tích Hợp Đa Công Cụ Cho Môi Giới Hiện Đại",
      description: "Kết hợp sức mạnh của nhiều công cụ công nghệ tiên tiến trong một nền tảng duy nhất, giúp môi giới tối ưu hóa mọi khía cạnh của quy trình làm việc."
    },
    items: [
      {
        id: 1,
        title: "AI phân tích thông minh",
        description: "Trí tuệ nhân tạo phân tích hành vi khách hàng, dự đoán xu hướng thị trường và đề xuất chiến lược tiếp cận tối ưu, giúp tăng tỷ lệ chốt giao dịch lên đến 58%.",
        iconName: "fas fa-robot",
        color: "#60a5fa",
        hoverEffect: true
      },
      {
        id: 2,
        title: "Ứng dụng đa nền tảng",
        description: "Truy cập nền tảng từ mọi thiết bị: desktop, tablet, smartphone. Đồng bộ hóa dữ liệu theo thời gian thực, cho phép làm việc linh hoạt mọi lúc, mọi nơi.",
        iconName: "fas fa-mobile-alt",
        color: "#a78bfa",
        hoverEffect: true
      },
      {
        id: 3,
        title: "Bảo mật blockchain",
        description: "Ứng dụng công nghệ blockchain để bảo mật thông tin giao dịch, hợp đồng điện tử và lịch sử tài sản. Đảm bảo tính minh bạch, không thể thay đổi và an toàn tuyệt đối.",
        iconName: "fas fa-shield-alt",
        color: "#34d399",
        hoverEffect: true
      }
    ],
    timeline: {
      title: "Quy Trình Tích Hợp Chỉ Trong 3 Bước",
      steps: [
        {
          number: "01",
          numberColor: "text-blue-400",
          title: "Đăng Ký & Cài Đặt",
          description: "Tạo tài khoản và cài đặt nền tảng trong 5 phút. Nhập dữ liệu tài sản hiện có hoặc bắt đầu từ đầu.",
          aos: "fade-right",
          aosDelay: "100"
        },
        {
          number: "02",
          numberColor: "text-purple-400",
          title: "Kết Nối & Đồng Bộ",
          description: "Kết nối với các công cụ hiện có và đồng bộ dữ liệu tự động. Tích hợp với CRM, email marketing, và hệ thống quản lý khác.",
          aos: "fade-up",
          aosDelay: "200"
        },
        {
          number: "03",
          numberColor: "text-emerald-400",
          title: "Vận Hành & Tối Ưu",
          description: "Bắt đầu vận hành hệ thống. Nhận phân tích hiệu suất và tối ưu hóa tự động dựa trên dữ liệu thực tế.",
          aos: "fade-left",
          aosDelay: "300"
        }
      ]
    },
    cta: {
      text: "Bắt Đầu Tích Hợp Ngay",
      icon: "fas fa-cogs",
      link: "#contact"
    }
  },

  cta: {
    background: "linear-gradient(to bottom right, var(--color-slate-900), rgba(30, 64, 175, 0.3))",
    title: "Sẵn Sàng Nâng Tầm Quản Lý Tài Sản Của Bạn?",
    description: "Đăng ký ngay hôm nay để trải nghiệm 14 ngày dùng thử miễn phí nền tảng quản lý tài sản bất động sản đẳng cấp từ Thiên Hà Group. Tối ưu hóa quy trình, gia tăng hiệu suất và mở rộng mạng lưới hợp tác.",
    card: {
      bgColor: "bg-blue-600"
    },
    buttons: {
      consultation: {
        text: "Đặt Lịch Tư Vấn",
        icon: "fas fa-calendar-alt",
        class: "bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition shadow-lg whitespace-nowrap",
        link: "#"
      },
      phone: {
        text: "Gọi Ngay: 1900 1000",
        icon: "fas fa-phone-alt",
        class: "bg-transparent border text-slate-50 px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition shadow-lg whitespace-nowrap",
        link: "tel:19001000"
      }
    },
    footer: {
      icon: "fas fa-shield-alt",
      text: "Cam kết bảo mật thông tin 100% • Hỗ trợ 24/7 • Cập nhật miễn phí trọn đời"
    }
  },

  css: {
    // Hero Background
    heroBackground: `linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%),
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
      url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80')`,

    // Colors
    colors: {
      blue400: "var(--color-blue-400)",
      blue500: "var(--color-blue-500)",
      blue600: "var(--color-blue-600)",
      purple500: "var(--color-purple-500)",
      purple600: "var(--color-purple-600)",
      emerald500: "var(--color-emerald-500)",
      slate900: "var(--color-slate-900)"
    },

    // Gradients
    gradients: {
      textGradient: "linear-gradient(90deg, var(--color-blue-400), var(--color-purple-500))",
      sectionDivider: "linear-gradient(90deg, var(--color-blue-500), var(--color-purple-600))",
      gradientBorder: "linear-gradient(45deg, var(--color-blue-500), var(--color-purple-500), var(--color-emerald-500), var(--color-blue-500))"
    },

    // Animation Durations
    animations: {
      counterDuration: 2000,
      counterSteps: 60
    },

    // Sizes
    sizes: {
      heroPaddingTop: "110px",
      statIconSize: "60px",
      featureIconSize: "72px"
    }
  }
})

const loadConfig = async () => {
  const response = await api.get('/thg/public/cms/contentSection/61');

  if (response.status === 200) {
    const apiConfig = JSON.parse(response.data.contentJson);

    // Hàm đệ quy để xử lý toàn bộ object
    const wrapCssVariables = (obj) => {
      if (typeof obj !== 'object' || obj === null) return obj;

      const result = {};

      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string' && value.startsWith('--')) {
          // Nếu bắt đầu bằng -- thì bọc lại bằng var()
          result[key] = `var(${value})`;
        } else if (typeof value === 'object' && value !== null) {
          // Đệ quy xử lý object lồng nhau
          result[key] = wrapCssVariables(value);
        } else {
          // Giữ nguyên các giá trị khác
          result[key] = value;
        }
      }

      return result;
    };

    // Áp dụng cho toàn bộ config
    const processedConfig = wrapCssVariables(apiConfig);

    // Cập nhật config
    config.value = processedConfig;

    console.log('Config đã được xử lý:', processedConfig);
  }
};

onMounted(async () => {

  console.log("Chuẩn bị load config")
  await loadConfig();
  console.log("Đã load")


  // Initialize AOS
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    })
  }

  // Animated counters với hiệu ứng mượt hơn
  const counters = document.querySelectorAll('.count-up')

  const startCounter = (counter) => {
    const target = +counter.getAttribute('data-count')
    const suffix = counter.innerText.replace(/[0-9.]/g, '') || ''
    const count = +counter.innerText.replace(/[^0-9.]/g, '') || 0

    // Sử dụng giá trị mặc định nếu không tìm thấy trong config
    const duration = config.value?.css?.animations?.counterDuration || 2000
    const steps = config.value?.css?.animations?.counterSteps || 60

    const stepTime = duration / steps
    const increment = target / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(increment * step, target)

      // Format số với định dạng
      if (suffix === '%') {
        counter.innerText = current.toFixed(1) + suffix
      } else {
        counter.innerText = Math.floor(current).toLocaleString() + suffix
      }

      if (step >= steps) {
        clearInterval(timer)
        // Đảm bảo hiển thị đúng giá trị cuối
        if (suffix === '%') {
          counter.innerText = target.toFixed(1) + suffix
        } else {
          counter.innerText = target.toLocaleString() + suffix
        }
      }
    }, stepTime)
  }


  // Start counter khi element vào viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
  })

  counters.forEach(counter => {
    // Đặt giá trị ban đầu là 0
    const suffix = counter.getAttribute('data-count').includes('.') ? '%' : ''
    counter.innerText = '0' + suffix
    observer.observe(counter)
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault()

      const targetId = this.getAttribute('href')
      if (targetId === '#') return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        })
      }
    })
  })

  // Cải thiện hiệu ứng hover cho stats - loại bỏ hiệu ứng giật
  document.querySelectorAll('.hero-stat-item').forEach(item => {
    let hoverTimeout

    item.addEventListener('mouseenter', function() {
      clearTimeout(hoverTimeout)
      this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    })

    item.addEventListener('mouseleave', function() {
      // Thêm delay nhỏ để tránh hiệu ứng giật
      hoverTimeout = setTimeout(() => {
        this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }, 50)
    })
  })

  // Hiệu ứng parallax nhẹ cho hero section
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset
    const heroSection = document.getElementById('hero')

    if (heroSection) {
      const rate = scrolled * -0.5
      heroSection.style.transform = `translate3d(0, ${rate}px, 0)`
    }
  })

  // Reset position khi không di chuột
  document.addEventListener('mouseleave', () => {
    const heroStatItems = document.querySelectorAll('.hero-stat-item')
    heroStatItems.forEach(item => {
      item.style.transform = 'translate(0, 0) scale(1)'
    })
  })

  // Add scroll effect to highlight current section
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section')
    const scrollPosition = window.scrollY + 100

    sections.forEach(section => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      const sectionId = section.getAttribute('id')

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Có thể thêm hiệu ứng active cho navigation nếu có
      }
    })
  })
})
</script>

<style scoped>
#hero {
  padding-top: v-bind('config.css.sizes.heroPaddingTop');
}

.font-display {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
}

.bg-brand-dark {
  background-color: v-bind('config.css.colors.slate900');
}

.text-gradient {
  background: v-bind('config.css.gradients.textGradient');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-divider {
  width: 80px;
  height: 4px;
  background: v-bind('config.css.gradients.sectionDivider');
  border-radius: 2px;
  margin: 0 auto;
}

.feature-icon {
  width: v-bind('config.css.sizes.featureIconSize');
  height: v-bind('config.css.sizes.featureIconSize');
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  font-size: 28px;
}

.btn-outline {
  background: transparent;
  color: white;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
}

.btn-outline:hover {
  border-color: v-bind('config.css.colors.blue500');
  color: v-bind('config.css.colors.blue400');
  transform: translateY(-3px);
}

/* Animation cho các phần tử */
.fade-in-up {
  animation: fadeInUp 1s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}

::-webkit-scrollbar-thumb {
  background: v-bind('config.css.colors.blue600');
  border-radius: 4px;
}

/* Hiệu ứng cho số liệu thống kê */
.counter {
  font-size: 3rem;
  font-weight: 800;
  background: v-bind('config.css.gradients.textGradient');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* HIỆU ỨNG HERO STATS MỚI - MƯỢT HƠN */
.hero-stat-item {
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform, box-shadow, border-color;
}

.hero-stat-item:hover {
  background: rgba(15, 23, 42, 0.85);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-6px) scale(1.02);
  box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(59, 130, 246, 0.1),
      0 0 30px rgba(59, 130, 246, 0.1);
}

.hero-stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
  transparent,
  rgba(59, 130, 246, 0.15),
  rgba(139, 92, 246, 0.15),
  transparent);
  transition: left 0.8s ease;
}

.hero-stat-item:hover::before {
  left: 100%;
}

.stat-icon-wrapper {
  width: v-bind('config.css.sizes.statIconSize');
  height: v-bind('config.css.sizes.statIconSize');
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
  transition: all 0.4s ease;
}

.hero-stat-item:hover .stat-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

/* Hiệu ứng ánh sáng */
.light-effect {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  filter: blur(40px);
  z-index: 0;
  pointer-events: none;
}

/* Floating animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.floating {
  animation: float 4s ease-in-out infinite;
}

/* Animated gradient border */
.gradient-border {
  position: relative;
  border-radius: 16px;
}

.gradient-border::after {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: v-bind('config.css.gradients.gradientBorder');
  background-size: 300% 300%;
  border-radius: 17px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.5s ease;
  animation: gradientMove 3s ease infinite;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-stat-item:hover.gradient-border::after {
  opacity: 1;
}

/* Pulse animation for stats */
@keyframes pulse-subtle {
  0%, 100% {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
  }
}

.hero-stat-item {
  animation: pulse-subtle 4s ease-in-out infinite;
}

/* Text highlight effect */
.highlight-text {
  position: relative;
  display: inline-block;
}

.highlight-text::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
  z-index: -1;
  transform: skewX(-15deg);
  transition: height 0.3s ease;
}

#hero .text-left:hover .highlight-text::after {
  height: 80%;
}

/* Hiệu ứng cho số đếm */
.count-up {
  display: inline-block;
}

/* Timeline styling */
.timeline-item {
  position: relative;
  padding-left: 2rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, var(--color-blue-500), var(--color-purple-500));
}

.timeline-item::after {
  content: '';
  position: absolute;
  left: -4px;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-blue-500);
}

/* Smooth hover for all interactive elements */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Performance optimization */
.hero-stat-item, .integration-card, .glass-card {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
</style>