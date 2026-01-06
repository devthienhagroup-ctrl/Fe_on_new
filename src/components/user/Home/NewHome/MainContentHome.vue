<template>
  <!-- HERO SECTION -->
  <section id="home"
           class="h-screen bg-hero-pattern bg-cover bg-center bg-fixed flex items-center relative overflow-hidden">
    <div class="absolute inset-0 bg-slate-900/60 z-0"></div>
    <div id="particles-js" class="absolute inset-0 z-0"></div>

    <div
        class="absolute top-1/4 left-10 w-20 h-20 bg-blue-500 rounded-full blur-[100px] opacity-50 animate-pulse z-0 pointer-events-none"></div>
    <div
        class="absolute bottom-1/4 right-10 w-32 h-32 bg-purple-600 rounded-full blur-[120px] opacity-50 z-0 pointer-events-none"></div>

    <div class="container mx-auto px-6 text-center relative z-10">
      <p class="text-blue-400 font-bold tracking-[0.3em] mb-4 uppercase" data-aos="fade-up" data-aos-duration="1000">
        {{ config.hero.tagline }}</p>
      <h1 class="text-5xl md:text-7xl font-display font-black mb-6 leading-tight text-white" data-aos="fade-up"
          data-aos-delay="200" data-aos-duration="1000">
        {{ config.hero.title }} <br> <span
          class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{{
          config.hero.highlightedText
        }}</span>
      </h1>
      <p class="max-w-2xl mx-auto text-slate-300 text-lg mb-10 font-light" data-aos="fade-up" data-aos-delay="400"
         data-aos-duration="1000">
        <b>{{ config.hero.companyName }}</b> {{ config.hero.description }}
      </p>
      <div class="flex justify-center gap-4" data-aos="fade-up" data-aos-delay="600">
        <CustomButton
            :href="config.buttons.explore.href"
            :variant="config.buttons.explore.variant"
            :color="config.buttons.explore.color"
            :size="config.buttons.explore.size"
            :rounded="config.buttons.explore.rounded"
            :hover-scale="config.buttons.explore.hoverScale"
            :shadow="config.buttons.explore.shadow"
        >
          {{ config.buttons.explore.text }}
        </CustomButton>

        <CustomButton
            :href="config.buttons.profile.href"
            :target="config.buttons.profile.target"
            :variant="config.buttons.profile.variant"
            :color="config.buttons.profile.color"
            :size="config.buttons.profile.size"
            :rounded="config.buttons.profile.rounded"
        >
          <i class="fas fa-play w-5 h-5 group-hover:text-blue-400 transition"></i>
          {{ config.buttons.profile.text }}
        </CustomButton>
      </div>
    </div>

    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-400">
      <i class="fas fa-chevron-down w-6 h-6"></i>
    </div>
  </section>

  <!-- ABOUT SECTION -->
  <section id="about" class="py-24 bg-brand-dark relative overflow-hidden">
    <div class="container mx-auto px-6 text-center relative z-10 pt-16 pb-16">
      <div class="flex flex-col md:flex-row items-center gap-16">
        <!-- Image Side với carousel-->
        <div class="w-full md:w-1/2 relative" data-aos="fade-right" data-aos-duration="1200">
          <ImageWithShadow
              :src="baseImgaeUrl+config.about.image.src"
              :alt="config.about.image.alt"
              :show-shadow="config.about.image.showShadow"

              :duration="3.5"
              :delay-between="1.5"
          >
            <template #badge>
              <div class="absolute -bottom-6 -right-6 bg-slate-800 p-6 rounded-xl border border-slate-600 shadow-xl"
                   data-aos="zoom-in" data-aos-delay="400">
                <p class="text-4xl font-display font-bold text-blue-500">{{ config.about.stats.years.value }}</p>
                <p class="text-xs text-slate-400 uppercase tracking-widest">{{ config.about.stats.years.label }}</p>
              </div>
            </template>
          </ImageWithShadow>
        </div>

        <!-- Text Side -->
        <div class="w-full md:w-1/2" data-aos="fade-left" data-aos-duration="1200">
          <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{{ config.about.subtitle }}</h2>
          <h3 class="text-4xl font-display font-bold text-white mb-6">{{ config.about.title }} <span
              class="text-gradient">{{ config.about.highlightedText }}</span></h3>
          <p class="text-slate-400 mb-6 leading-relaxed">
            {{ config.about.description }}
          </p>

          <div class="grid grid-cols-2 gap-6 mt-8">
            <GlassCard
                v-for="stat in config.about.quickStats"
                :key="stat.id"
                :title="stat.value"
                :color="stat.color"
                :padding="stat.padding"
                :hover-effect="stat.hoverEffect"
            >
              <p class="text-sm text-slate-400">{{ stat.label }}</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SERVICES SECTION -->
  <section id="services" class="py-24 bg-[#0B1120] relative">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16" data-aos="fade-up">
        <h2 class="text-4xl font-display font-bold text-white mb-4">{{ config.sections.services.title }}</h2>
        <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <GlassCard
            v-for="service in config.services"
            :key="service.id"
            :title="service.title"
            :icon-name="service.iconName"
            :icon-class="service.iconClass"
            :link="service.link"
            :link-text="service.linkText"
            :color="service.color"
            :padding="service.padding"
            :hover-effect="service.hoverEffect"
            :aos="service.aos"
            :aos-delay="service.aosDelay"
            :quick-access-url="service.quickAccessUrl"
            show-login-button
        >
          {{ service.description }}
        </GlassCard>
      </div>
    </div>
  </section>

  <!-- CONTACT SECTION -->
  <section id="contact" class="py-24 relative">
    <div class="absolute inset-0 bg-gradient-to-b from-[#0B1120] to-[#1e293b]"></div>
    <div class="container mx-auto px-6 relative z-10">
      <CooperationForm @submit="handleFormSubmit"/>
    </div>
  </section>

  <!-- OPERATIONS MAP SECTION -->
  <section id="locations" class="py-24 bg-[#0b1120] relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="text-center mb-16" data-aos="fade-up">
        <h2 class="text-blue-500 font-bold tracking-widest uppercase text-sm mb-3">{{
            config.sections.locations.subtitle
          }}</h2>
        <h3 class="text-3xl md:text-5xl font-bold text-white">
          {{ config.sections.locations.title }} <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{{
            config.sections.locations.highlightedText
          }}</span>
        </h3>
        <p class="text-slate-400 mt-4 max-w-2xl mx-auto">
          {{ config.sections.locations.description }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Cột 1: Thống kê (Bên trái) -->
        <div class="lg:col-span-4 space-y-8" data-aos="fade-right">
          <MiniCardIcon
              v-for="stat in config.statsCards"
              :key="stat.id"
              :value="stat.value"
              :label="stat.label"
              :color="stat.color"
              :icon-class="stat.icon"
          />
        </div>

        <!-- Cột 2: Bản đồ Visual (Bên phải) -->
        <div class="lg:col-span-8 relative" data-aos="fade-left">
          <!-- Ảnh bản đồ thế giới (Dạng chấm - Dotted Map) -->
          <div class="relative w-full aspect-[16/9] bg-contain bg-no-repeat bg-center"
               :style="`background-image: url('${baseImgaeUrl+config.map.imageUrl}'); filter: grayscale(100%) invert(100%) opacity(0.2);`">
          </div>

          <!-- Các điểm Hotspot -->
          <div v-for="location in config.map.locations"
               :key="location.id"
               class="absolute group cursor-pointer"
               :style="`top: ${location.position.top}; left: ${location.position.left};`">

            <!-- Bóng (ping/ripple effect) -->
            <span
                :class="`absolute inline-flex h-${location.size} w-${location.size} rounded-full opacity-75 animate-ping ${location.animationDelay}`"
                :style="`background-color: ${location.color};`">
  </span>

            <!-- Điểm chính (hotspot dot) -->
            <span
                :class="`relative inline-flex rounded-full h-${location.size} w-${location.size} border-2 border-[#0b1120] items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.8)]`"
                :style="`background-color: ${location.color};`">
    <i :class="location.iconClass"></i>
  </span>

            <!-- Tooltip -->
            <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max px-3 py-1 bg-white rounded text-xs font-bold text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
              {{ location.name }}
              <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
            </div>
          </div>

          <!-- Đường nối ảo (Tech lines - Trang trí) -->
          <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
            <!-- Nối VN -> Japan -->
            <path d="M78% 55% Q 82% 45% 85% 40%" stroke="url(#lineGradient)" stroke-width="1" fill="none"
                  class="animate-pulse"/>
            <!-- Nối VN -> USA -->
            <path d="M78% 55% Q 50% 20% 20% 35%" stroke="url(#lineGradient)" stroke-width="1" fill="none"
                  stroke-dasharray="4 4"/>

            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0"/>
                <stop offset="50%" stop-color="#3b82f6" stop-opacity="1"/>
                <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS - Đánh giá từ khách hàng -->
  <section id="testimonials" class="py-16 bg-gray-900 text-white">
    <div class="container mx-auto px-6">
      <div class="text-center mb-12">
        <span class="text-blue-400 font-semibold tracking-widest uppercase text-sm">{{
            config.sections.testimonials.subtitle
          }}</span>
        <h2 class="mt-2 text-3xl md:text-4xl font-bold">{{ config.sections.testimonials.title }}</h2>
        <p class="text-slate-300 mt-3 max-w-2xl mx-auto">
          {{ config.sections.testimonials.description }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TestimonialCard
            v-for="testimonial in config.testimonials"
            :key="testimonial.id"
            :name="testimonial.name"
            :position="testimonial.position"
            :quote="testimonial.quote"
            :initials="testimonial.initials"
            :color="testimonial.color"
            :rating="testimonial.rating"
        />
      </div>

      <!-- CTA nhỏ ở cuối section (tuỳ chọn) -->
      <div class="flex justify-center mt-10">
        <CustomButton
            :href="config.buttons.contact.href"
            :variant="config.buttons.contact.variant"
            :color="config.buttons.contact.color"
            :size="config.buttons.contact.size"
            :rounded="config.buttons.contact.rounded"
        >
          {{ config.buttons.contact.text }}
        </CustomButton>
      </div>
    </div>
  </section>
</template>

<script setup>
import TestimonialCard from "../../UI/TestimonialCard.vue";
import CustomButton from "../../UI/CustomButton.vue";
import CooperationForm from "../../UI/CooperationForm.vue";
import GlassCard from "../../UI/GlassCard.vue";
import ImageWithShadow from "../../UI/ImageWithShadow.vue";
import {onBeforeUnmount, onMounted, ref, computed} from "vue";
import MiniCardIcon from "../../UI/MiniCardIcon.vue";
import {baseImgaeUrl} from "../../../../assets/js/global.js";
import api from "../../../../api/api.js";

// CONFIG OBJECT - Tất cả dữ liệu và style được quản lý qua CMS
const config = ref({
  // ========== STYLE CONFIG ==========
  styles: {
    colors: {
      blue400: '--color-blue-400',
      blue500: '--color-blue-500',
      blue600: '--color-blue-600',
      purple500: '--color-purple-500',
      purple600: '--color-purple-600',
      slate300: '--color-slate-300',
      slate400: '--color-slate-400',
      slate700: '--color-slate-700',
      slate900: '--color-slate-900',
      emerald500: '#10b981'
    },
    gradients: {
      hero: 'from-blue-400 to-purple-500',
      services: 'from-blue-500 to-purple-600',
      locations: 'from-blue-400 to-purple-500'
    },
    sizes: {
      heroTitle: 'text-5xl md:text-7xl',
      sectionTitle: 'text-4xl'
    }
  },

  // ========== CONTENT CONFIG ==========
  hero: {
    tagline: 'Kiến tạo tương lai',
    title: 'Vươn Tầm',
    highlightedText: 'Đẳng Cấp Quốc Tế',
    companyName: 'Thiên Hà Group',
    description: 'mang đến giải pháp bất động sản toàn diện, kết hợp công nghệ tiên tiến và tư duy đột phá để nâng tầm giá trị giá trị bất động sản của bạn.'
  },

  buttons: {
    explore: {
      text: 'Khám phá ngay',
      href: '#services',
      variant: 'gradient',
      color: 'blue',
      size: 'large',
      rounded: 'lg',
      hoverScale: true,
      shadow: true
    },
    profile: {
      text: 'Xem hồ sơ',
      href: 'https://www.youtube.com/watch?v=JPedlPJSBkg',
      target: '_blank',
      variant: 'outline',
      color: 'white',
      size: 'large',
      rounded: 'lg'
    },
    contact: {
      text: 'Liên hệ để được tư vấn',
      href: '#contact',
      variant: 'gradient',
      color: 'blue',
      size: 'medium',
      rounded: 'lg'
    }
  },

  about: {
    subtitle: 'Về chúng tôi',
    title: 'Đối tác tin cậy cho sự',
    highlightedText: 'thịnh vượng bền vững',
    description: 'Tại Thiên Hà Group, chúng tôi không chỉ xây dựng các dự án, chúng tôi xây dựng những biểu tượng. Với triết lý kinh doanh lấy con người làm trọng tâm và công nghệ làm bệ phóng, chúng tôi cam kết mang lại giá trị vượt trội.',
    image: {
      src: 'https://kienviet.net/wp-content/uploads/2015/08/21.jpg',
      alt: 'Office',
      showShadow: true
    },
    stats: {
      years: {
        value: '15+',
        label: 'Năm kinh nghiệm'
      }
    },
    quickStats: [
      {
        id: 1,
        value: '200+',
        label: 'Dự án hoàn thành',
        color: 'blue',
        padding: 'small',
        hoverEffect: true
      },
      {
        id: 2,
        value: '98%',
        label: 'Khách hàng hài lòng',
        color: 'purple',
        padding: 'small',
        hoverEffect: true
      }
    ]
  },

  sections: {
    services: {
      title: 'Dịch vụ của chúng tôi'
    },
    locations: {
      subtitle: 'Mạng Lưới Hoạt Động',
      title: 'Dấu Ấn',
      highlightedText: 'Thiên Hà Group',
      description: 'Không chỉ dẫn đầu thị trường về giải pháp bán nhanh bất động sản, chúng tôi đang vươn mình mạnh mẽ hướng đến hệ sinh thái toàn diện trong ngành bất động sản.'
    },
    testimonials: {
      subtitle: 'Khách hàng nói gì',
      title: 'Đánh giá từ khách hàng',
      description: 'Những phản hồi chân thực từ các đối tác và khách hàng đã đồng hành cùng Thiên Hà Group.'
    }
  },

  services: [
    {
      id: 1,
      title: 'Phát triển đội nhóm',
      description: 'Tạo dựng và mở rộng đội nhóm của bạn trên một hệ sinh thái duy nhất. Thiên Hà Group tiên phong giải pháp hợp tác toàn diện cho môi giới toàn quốc, cung cấp nguồn hàng chất lượng, tiềm năng cao.',
      color: '#0030FF',
      link: '#',
      linkText: 'Xem chi tiết',
      iconName: 'fas fa-building',
      iconClass: 'w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition duration-300 text-blue-400 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '0',
      quickAccessUrl: '/nhom-cua-toi'
    },
    {
      id: 2,
      title: 'Quản lý tài sản',
      description: 'Một công cụ – tối ưu cả quy trình môi giới. Lưu trữ và quản trị khách hàng/sản phẩm tập trung, cập nhật theo thời gian thực, nhận thông báo sản phẩm "đúng gu" và tăng tỷ lệ chốt nhờ mạng lưới hợp tác 10.000+ môi giới.',
      color: 'purple',
      link: '#',
      linkText: 'Xem chi tiết',
      iconName: 'fas fa-chart-bar',
      iconClass: 'w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-400 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '200',
      quickAccessUrl: '/bao-cao-dinh-gia'
    },
    {
      id: 3,
      title: 'Định giá bất động sản',
      description: 'Định giá chuẩn hơn nhờ dữ liệu lớn cập nhật liên tục. Thiên Hà Group mang đến bộ công cụ giúp người mua, người bán và nhà đầu tư hiểu đúng giá trị bất động sản, từ đó tự tin chốt giao dịch và tối ưu lợi nhuận.',
      color: 'teal',
      link: '#',
      linkText: 'Xem chi tiết',
      iconName: 'fas fa-calendar-alt',
      iconClass: 'w-16 h-16 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500 transition duration-300 text-teal-400 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '400',
      quickAccessUrl: '/bao-cao-dinh-gia'
    },
    {
      id: 4,
      title: 'Dự Án và Tiến độ',
      description: '"Dự án & Tiến độ" là công cụ trọng tâm trong gói giải pháp công nghệ Thiên Hà Group, giúp môi giới hợp tác theo dõi công việc và tiến độ dự án của mình theo thời gian thực, rõ ràng và chính xác.',
      color: 'teal',
      link: '#',
      linkText: 'Xem chi tiết',
      iconName: 'fas fa-calendar-alt',
      iconClass: 'w-16 h-16 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-500 transition duration-300 text-teal-400 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '400',
      quickAccessUrl: '/-thg/du-an'
    },
    {
      id: 5,
      title: 'Bán nhanh bất động sản',
      description: 'Thiên Hà Group thấu hiểu áp lực của chủ nhà khi bất động sản "nằm" quá lâu. Chúng tôi triển khai giải pháp bán nhanh với quy trình rõ ràng, hướng đến rút ngắn thời gian giao dịch và chốt ở mức giá tốt nhất.',
      color: 'blue',
      link: '#',
      linkText: 'Xem chi tiết',
      iconName: 'fas fa-home',
      iconClass: 'w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition duration-300 text-blue-400 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '0',
      quickAccessUrl: '/bao-cao-dinh-gia'
    },
    {
      id: 6,
      title: 'Cơ hội việc làm',
      description: 'Bạn đang tìm một công việc làm thêm linh hoạt 1–2 tiếng mỗi lần? Thiên Hà Group đang tuyển CTV liên tục tại từng khu vực, thu nhập 200K–500K/lần (tuỳ nhiệm vụ). Chi tiết công việc và cách đăng ký sẽ có trong mô tả.',
      color: 'purple',
      link: '#',
      linkText: 'Xem chi tiết',
      iconName: 'fas fa-users',
      iconClass: 'w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-400 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '200',
      quickAccessUrl: '/cong-viec-cong-tac-vien'
    }
  ],

  statsCards: [
    {
      id: 1,
      value: '359 Căn',
      label: 'Đã bán trong năm 2025',
      color: 'blue',
      icon: 'fas fa-globe'
    },
    {
      id: 2,
      value: '4.394 Môi giới',
      label: 'Đang hoạt động tại Thiên Hà Group',
      color: 'purple',
      icon: 'fas fa-users'
    },
    {
      id: 3,
      value: '2.234 Căn',
      label: 'Đã bán từ định giá THG',
      color: 'emerald',
      icon: 'fas fa-building'
    }
  ],

  map: {
    imageUrl: 'https://radanhadat.vn/edutech/wp-content/uploads/2025/01/2.-Ra-mat-SAAS-popup-web-800-x-600-px-3.png',
    locations: [
      {
        id: 1,
        name: 'Hồ Chí Minh (HQ)',
        position: {top: '55%', left: '78%'},
        color: 'blue-500',
        size: '6',
        iconClass: 'fas fa-location-arrow text-white text-xs',
        animationDelay: ''
      },
      {
        id: 2,
        name: 'Bình Dương',
        position: {top: '60%', left: '76%'},
        color: 'purple-500',
        size: '3',
        iconClass: '',
        animationDelay: 'delay-75'
      },
      {
        id: 3,
        name: 'Đồng Nai',
        position: {top: '40%', left: '85%'},
        color: 'purple-500',
        size: '3',
        iconClass: '',
        animationDelay: 'delay-150'
      },
      {
        id: 4,
        name: 'Vĩnh Long',
        position: {top: '35%', left: '20%'},
        color: 'blue-400',
        size: '4',
        iconClass: '',
        animationDelay: 'delay-300'
      },
      {
        id: 5,
        name: 'Bạc Liêu',
        position: {top: '32%', left: '52%'},
        color: 'emerald-500',
        size: '3',
        iconClass: '',
        animationDelay: 'delay-500'
      }
    ]
  },

  testimonials: [
    {
      id: 1,
      name: 'Nguyễn Văn Nam',
      position: 'CTO, Công ty ABC',
      quote: 'Thiên Hà Group mang đến giải pháp tích hợp công nghệ rất hiệu quả. Đội ngũ tư vấn tận tâm, triển khai nhanh và ROI tốt.',
      initials: 'NV',
      color: 'blue',
      rating: 5
    },
    {
      id: 2,
      name: 'Lê Đình Đông',
      position: 'Giám đốc Dự án, XYZ Co.',
      quote: 'Một đối tác công nghệ đẳng tin cậy. Đội ngũ hỗ trợ 24/7 và cung cấp các giải pháp phù hợp với ngân sách của chúng tôi.',
      initials: 'LĐ',
      color: 'purple',
      rating: 5
    },
    {
      id: 3,
      name: 'Trần Thị Thanh',
      position: 'Giám đốc CNTT, Công Ty 123',
      quote: 'Giải pháp được tùy biến rất linh hoạt, giúp chúng tôi tối ưu quy trình và tăng hiệu suất làm việc của đội ngũ.',
      initials: 'TT',
      color: 'emerald',
      rating: 5
    },
    {
      id: 4,
      name: 'Hoàng Bình',
      position: 'Giám đốc Marketing, LMN Ltd.',
      quote: 'Dễ hiểu, dễ triển khai và mang lại kết quả rõ ràng. Chúng tôi sẽ tiếp tục hợp tác với Thiên Hà Group cho các dự án tới.',
      initials: 'HB',
      color: 'blue',
      rating: 5
    }
  ]
});

const loadConfig = async () => {
  const response = await api.get('/thg/public/cms/contentSection/56');

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

// Lifecycle hooks
onMounted(async () => {
  console.log("Chuẩn bị load config")
  await loadConfig();
  console.log("Đã load")
  // Load particles.js
  if (window.particlesJS) {
    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": 100,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false
        },
        "size": {
          "value": 3,
          "random": true
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out"
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        }
      },
      "retina_detect": true
    })
  }
})

onBeforeUnmount(() => {
  const canvas = document.querySelector('#particles-js canvas')
  if (canvas) canvas.remove()
})

// Methods
const handleFormSubmit = (email) => {
  console.log('Form submitted with email:', email)
  // Handle form submission logic here
  alert(`Cảm ơn bạn đã đăng ký với email: ${email}. Chúng tôi sẽ liên hệ với bạn sớm nhất!`)
}
</script>

<style scoped>
/* Sử dụng biến CSS từ config object */
#home .text-blue-400 {
  color: v-bind('config.styles.colors.blue400');
}

#home .bg-blue-500 {
  background-color: v-bind('config.styles.colors.blue500');
}

#home .bg-purple-600 {
  background-color: v-bind('config.styles.colors.purple600');
}

#home .text-slate-300 {
  color: v-bind('config.styles.colors.slate300');
}

#home .text-slate-400 {
  color: v-bind('config.styles.colors.slate400');
}

/* Gradient text sử dụng biến */
#home .from-blue-400 {
  --tw-gradient-from: v-bind('config.styles.colors.blue400');
}

#home .to-purple-500 {
  --tw-gradient-to: v-bind('config.styles.colors.purple500');
}

/* About section */
#about .text-blue-500 {
  color: v-bind('config.styles.colors.blue500');
}

#about .text-white {
  color: white;
}

#about .text-slate-400 {
  color: v-bind('config.styles.colors.slate400');
}

/* Services section */
#services .bg-gradient-to-r.from-blue-500 {
  --tw-gradient-from: v-bind('config.styles.colors.blue500');
}

#services .to-purple-600 {
  --tw-gradient-to: v-bind('config.styles.colors.purple600');
}

/* Operations map section */
#locations .text-blue-500 {
  color: v-bind('config.styles.colors.blue500');
}

#locations .from-blue-400 {
  --tw-gradient-from: v-bind('config.styles.colors.blue400');
}

#locations .to-purple-500 {
  --tw-gradient-to: v-bind('config.styles.colors.purple500');
}

#locations .text-slate-400 {
  color: v-bind('config.styles.colors.slate400');
}

#locations .bg-blue-500 {
  background-color: v-bind('config.styles.colors.blue500');
}

#locations .bg-blue-600 {
  background-color: v-bind('config.styles.colors.blue600');
}

#locations .bg-purple-500 {
  background-color: v-bind('config.styles.colors.purple500');
}

#locations .bg-blue-400 {
  background-color: v-bind('config.styles.colors.blue400');
}

#locations .bg-slate-700 {
  background-color: v-bind('config.styles.colors.slate700');
}

#locations .bg-blue-900\/20 {
  background-color: rgba(37, 99, 235, 0.2);
}

/* Testimonials section */
#testimonials.bg-gray-900 {
  background-color: v-bind('config.styles.colors.slate900');
}

#testimonials .text-blue-400 {
  color: v-bind('config.styles.colors.blue400');
}

#testimonials .text-slate-300 {
  color: v-bind('config.styles.colors.slate300');
}
</style>