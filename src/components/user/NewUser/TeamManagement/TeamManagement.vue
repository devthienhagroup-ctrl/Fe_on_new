<!-- TeamManagement.vue -->
<template>
  <!-- Hero Section -->
  <section class="pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div data-aos="fade-right" data-aos-delay="200">
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <i class="fas fa-crown text-purple-400 mr-2"></i>
              <span class="text-sm font-semibold text-purple-300">{{ config.hero.badgeText }}</span>
            </div>

            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 space-y-3">
              <span class="mb-1">{{ config.hero.titleLine1 }} </span>
              <span class="gradient-text block">{{ config.hero.titleLine2 }}</span>
            </h1>

            <p class="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              {{ config.hero.description }}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 mb-12">
              <a href="#pricing" class="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold gradient-bg text-white shadow-xl hover:shadow-2xl transition">
                <i class="fas fa-play-circle mr-3"></i>
                {{ config.hero.button1.text }}
              </a>
              <a href="#ytb-video-demo" class="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold bg-white/10 text-white border border-white/10 hover:bg-white/15 transition">
                <i class="fas fa-video mr-3"></i>
                {{ config.hero.button2.text }}
              </a>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-6">
              <div v-for="(stat, index) in config.hero.stats" :key="index">
                <div class="text-3xl font-bold text-white mb-2 stat-number">{{ stat.value }}</div>
                <div class="text-sm text-slate-400">{{ stat.label }}</div>
              </div>
            </div>
          </div>

          <!-- Right - Dashboard Preview -->
          <div data-aos="fade-left" data-aos-delay="400">
            <div class="glass-card rounded-3xl p-8 hover-lift border border-white/10">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                  <i class="fa-solid fa-users-gear text-white text-2xl"></i>
                </div>
                <div>
                  <h3 class="text-2xl font-bold text-white">{{ config.dashboard.title }}</h3>
                  <p class="text-slate-400">{{ config.dashboard.subtitle }}</p>
                </div>
              </div>

              <!-- Stats Preview -->
              <div class="grid grid-cols-3 gap-4 mb-8">
                <div v-for="(stat, index) in config.dashboard.stats" :key="index" class="text-center p-4 bg-slate-900/30 rounded-xl">
                  <div class="text-2xl font-bold text-white">{{ stat.value }}</div>
                  <div class="text-xs text-slate-400">{{ stat.label }}</div>
                </div>
              </div>

              <!-- Performance Chart Preview -->
              <div class="mb-8">
                <div class="flex justify-between items-center mb-4">
                  <span class="text-sm font-medium text-slate-300">{{ config.dashboard.performance.label }}</span>
                  <span class="text-sm text-green-400 font-semibold">{{ config.dashboard.performance.value }}</span>
                </div>
                <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full gradient-bg rounded-full" :style="{ width: config.dashboard.performance.width }"></div>
                </div>
              </div>

              <!-- Team Structure Preview -->
              <div class="text-center">
                <div class="team-node mx-auto mb-3">
                  <div class="text-sm font-semibold">{{ config.dashboard.teamStructure.leader.title }}</div>
                  <div class="text-xs opacity-90">{{ config.dashboard.teamStructure.leader.name }}</div>
                </div>
                <div class="team-connector mb-3"></div>
                <div class="flex justify-center gap-4">
                  <div v-for="(team, index) in config.dashboard.teamStructure.teams" :key="index" class="team-node">
                    <div class="text-sm font-semibold">{{ team.title }}</div>
                    <div class="text-xs opacity-90">{{ team.members }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="py-20 lg:py-32 bg-gradient-to-b from-transparent to-slate-900/20 overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          {{ config.sections.features.title }}
          <span class="gradient-text">{{ config.sections.features.titleHighlight }}</span>
        </h2>
        <p class="text-lg text-slate-300">
          {{ config.sections.features.description }}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature Cards -->
        <GlassCard
            v-for="(feature, index) in config.features"
            :key="index"
            :title="feature.title"
            :iconName="feature.iconName"
            :color="feature.color"
            :padding="'medium'"
            :hoverEffect="true"
            :aos="'fade-up'"
            :aosDelay="feature.aosDelay"
            :listContent="ensureArray(feature.listContent)"
            :listDotIconClass="feature.listDotIconClass"
            :gradient-class-icon="true"
        >
          {{ feature.description }}
        </GlassCard>
      </div>
    </div>
  </section>

  <!-- Tools Section -->
  <section id="tools" class="py-20 lg:py-32 bg-gradient-to-b from-slate-900/20 to-slate-900/40 overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          {{ config.sections.tools.title }} <span class="gradient-text">{{ config.sections.tools.titleHighlight }}</span>
        </h2>
        <p class="text-lg text-slate-300">
          {{ config.sections.tools.description }}
        </p>
      </div>

      <div id="ytb-video-demo" class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <MiniCardIcon
            v-for="tool in config.tools"
            :key="tool.id"
            :value="tool.value"
            :label="tool.label"
            :color="tool.color"
            :icon-class="tool.icon"
            :align-center="true"
        />
      </div>

      <!-- Video Demo -->
      <YoutubeVideo

          :video-id="config.videoId"
          :show-controls="true"
      />
    </div>
  </section>

  <!-- Benefits Section -->
  <section id="benefits" class="py-20 lg:py-32 overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          {{ config.sections.benefits.title }} <span class="gradient-text">{{ config.sections.benefits.titleHighlight }}</span>
        </h2>
        <p class="text-lg text-slate-300">
          {{ config.sections.benefits.description }}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <GlassCard
            v-for="(benefit, index) in config.benefits"
            :key="index"
            :title="benefit.title"
            :iconName="benefit.iconName"
            :color="benefit.color"
            :padding="'medium'"
            :hoverEffect="true"
            :aos="'fade-up'"
            :aosDelay="benefit.aosDelay"
            :statNumber="benefit.statNumber"
            :statLabel="benefit.statLabel"
            :gradient-class-icon="false"
        >
          <template #default>
            <p class="text-slate-300">{{ benefit.description }}</p>
          </template>
        </GlassCard>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="bg-gradient-to-b from-slate-900/40 to-slate-900/60 overflow-hidden">
    <PackageService :gradient-pink-purple="true"/>
  </section>

  <!-- Testimonials -->
  <section id="testimonials" class="py-20 lg:py-32 overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          {{ config.sections.testimonials.title }}
          <span class="gradient-text">{{ config.sections.testimonials.titleHighlight }}</span>
        </h2>
        <p class="text-lg text-slate-300">
          {{ config.sections.testimonials.description }}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TestimonialCard
            v-for="testimonial in config.testimonials"
            :key="testimonial.id"
            :name="testimonial.name"
            :position="testimonial.position"
            :quote="testimonial.quote"
            :initials="testimonial.initials"
            :color="testimonial.color"
            :rating="testimonial.rating"
            :data-aos="testimonial.aos || 'fade-up'"
            :data-aos-delay="testimonial.aosDelay || 0"
        />
      </div>
    </div>
  </section>

  <!-- Contact CTA -->
  <section id="contact" class="py-20 lg:py-32 bg-gradient-to-b from-slate-900/60 to-darker overflow-hidden">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <CooperationForm :purple-template="true"/>
    </div>
  </section>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import GlassCard from "../../UI/GlassCard.vue";
import MiniCardIcon from "../../UI/MiniCardIcon.vue";
import PackageService from "../EstimateProperty/PackageService.vue";
import TestimonialCard from "../../UI/TestimonialCard.vue";
import YoutubeVideo from "../../UI/YoutubeVideo.vue";
import api from "../../../../api/api.js";
import CooperationForm from "../../UI/CooperationForm.vue";

// Config object
const config = ref({
  // Hero Section
  hero: {
    badgeText: "GIẢI PHÁP SỐ 1 CHO ĐỘI NHÓM MÔI GIỚI",
    titleLine1: "Quản lý đội nhóm",
    titleLine2: "môi giới chuyên nghiệp",
    description: "Tất cả công cụ bạn cần để xây dựng, quản lý và phát triển đội nhóm môi giới thành công trong một nền tảng duy nhất. Tối ưu hiệu suất, tăng doanh thu và mở rộng không giới hạn.",
    button1: {
      text: "Bắt đầu miễn phí 14 ngày",
      icon: "fas fa-play-circle"
    },
    button2: {
      text: "Xem video demo",
      icon: "fas fa-video"
    },
    stats: [
      { value: "2500", label: "Đội nhóm tin dùng" },
      { value: "98", label: "% Hài lòng" },
      { value: "300", label: "% Tăng hiệu suất" }
    ]
  },

  // Dashboard Preview
  dashboard: {
    title: "Dashboard Quản Lý",
    subtitle: "Xem trước hệ thống thông minh",
    stats: [
      { value: "24", label: "Thành viên" },
      { value: "68", label: "BĐS đang bán" },
      { value: "42", label: "Giao dịch" }
    ],
    performance: {
      label: "Hiệu suất đội nhóm",
      value: "+35%",
      width: "85%"
    },
    teamStructure: {
      leader: {
        title: "Trưởng nhóm",
        name: "Nguyễn Văn A"
      },
      teams: [
        {
          title: "Nhóm 1",
          members: "8 thành viên",
          gradient: "secondary-gradient"
        },
        {
          title: "Nhóm 2",
          members: "12 thành viên",
          gradient: "info-gradient"
        }
      ]
    }
  },

  // Sections Headers
  sections: {
    features: {
      title: "Tất cả công cụ bạn cần trong",
      titleHighlight: "một nền tảng",
      description: "Hệ thống quản lý đội nhóm toàn diện với đầy đủ tính năng chuyên nghiệp"
    },
    tools: {
      title: "Bộ công cụ",
      titleHighlight: "toàn diện",
      description: "Khám phá tất cả công cụ chuyên nghiệp được tích hợp trong hệ thống"
    },
    benefits: {
      title: "Lợi ích khi",
      titleHighlight: "sử dụng",
      description: "Những giá trị thực tế mang lại cho đội nhóm của bạn"
    },
    testimonials: {
      title: "Được tin dùng bởi",
      titleHighlight: "2,500+ đội nhóm",
      description: "Những đội nhóm môi giới thành công đã tin tưởng lựa chọn chúng tôi"
    },
    contact: {
      title: "Sẵn sàng phát triển đội nhóm của bạn?",
      description: "Đăng ký ngay để được tư vấn và trải nghiệm miễn phí hệ thống quản lý đội nhóm chuyên nghiệp",
      buttonText: "Đăng ký tư vấn miễn phí",
      phone: "1900 1234"
    }
  },

  // Features Data
  features: [
    {
      title: 'Tuyển Dụng & Onboarding',
      iconName: 'fas fa-user-plus',
      color: 'purple',
      aosDelay: '0',
      description: 'Hệ thống tuyển dụng thông minh, tự động onboarding và đào tạo thành viên mới với quy trình chuẩn hóa.',
      listContent: ['Portal tuyển dụng riêng', 'Onboarding tự động', 'Đào tạo E-learning'],
      listDotIconClass: 'fas fa-check-circle'
    },
    {
      title: 'Phân Cấp Đội Nhóm',
      iconName: 'fas fa-sitemap',
      color: 'blue',
      aosDelay: '100',
      description: 'Thiết lập cơ cấu tổ chức linh hoạt với nhiều cấp độ quản lý, phân quyền chi tiết cho từng vị trí.',
      listContent: ['Cơ cấu đa cấp', 'Phân quyền chi tiết', 'Quản lý nhóm con'],
      listDotIconClass: 'fas fa-check-circle'
    },
    {
      title: 'Theo Dõi Hiệu Suất',
      iconName: 'fas fa-chart-line',
      color: 'teal',
      aosDelay: '200',
      description: 'Dashboard real-time theo dõi KPI, doanh số và hiệu suất từng thành viên với báo cáo chi tiết.',
      listContent: ['KPI cá nhân & đội nhóm', 'Báo cáo real-time', 'Cảnh báo tự động'],
      listDotIconClass: 'fas fa-check-circle'
    },
    {
      title: 'Tính Hoa Hồng Tự Động',
      iconName: 'fas fa-money-bill-wave',
      color: 'amber',
      aosDelay: '0',
      description: 'Hệ thống tính hoa hồng thông minh với nhiều mô hình, tự động tính toán và thanh toán minh bạch.',
      listContent: ['Nhiều mô hình hoa hồng', 'Tính toán tự động', 'Thanh toán online'],
      listDotIconClass: 'fas fa-check-circle'
    },
    {
      title: 'Giao Tiếp & Cộng Tác',
      iconName: 'fas fa-comments',
      color: 'pink',
      aosDelay: '100',
      description: 'Nền tảng giao tiếp nội bộ, chia sẻ kiến thức và cộng tác hiệu quả trong đội nhóm.',
      listContent: ['Chat nhóm & riêng tư', 'Thư viện kiến thức', 'Meeting online'],
      listDotIconClass: 'fas fa-check-circle'
    },
    {
      title: 'Mobile App Quản Lý',
      iconName: 'fas fa-mobile-alt',
      color: 'purple',
      aosDelay: '200',
      description: 'Ứng dụng di động đầy đủ tính năng, quản lý đội nhóm mọi lúc mọi nơi trên iOS và Android.',
      listContent: ['iOS & Android', 'Push notification', 'Quản lý offline'],
      listDotIconClass: 'fas fa-check-circle'
    }
  ],

  // Tools Data
  tools: [
    {
      id: 1,
      value: 'Quản Lý Tài Sản',
      label: 'Quản lý danh sách BĐS, phân phối và theo dõi',
      color: 'blue',
      icon: 'fas fa-home'
    },
    {
      id: 2,
      value: 'Lịch Dẫn Khách',
      label: 'Lên lịch, nhắc nhở và quản lý lịch trình',
      color: 'purple',
      icon: 'fas fa-calendar-alt'
    },
    {
      id: 3,
      value: 'Báo Cáo & Phân Tích',
      label: 'Báo cáo chi tiết, phân tích xu hướng',
      color: 'emerald',
      icon: 'fas fa-chart-pie'
    },
    {
      id: 4,
      value: 'Quản Lý Hợp Đồng',
      label: 'Tạo, lưu trữ và theo dõi hợp đồng',
      color: 'amber',
      icon: 'fas fa-file-contract'
    }
  ],

  // Testimonials Data
  testimonials: [
    {
      id: 1,
      name: 'Nguyễn Minh Tâm',
      position: 'Trưởng nhóm BĐS Q.2',
      quote: 'Từ 3 thành viên ban đầu, sau 6 tháng đội nhóm tôi đã phát triển lên 15 người. Hệ thống quản lý của Thiên Hà giúp tôi tiết kiệm 70% thời gian quản lý.',
      initials: 'NT',
      color: 'purple',
      rating: 5,
      aos: 'fade-up',
      aosDelay: '0'
    },
    {
      id: 2,
      name: 'Công ty BĐS Sài Gòn Land',
      position: '50+ thành viên',
      quote: 'Sau khi triển khai hệ thống, hiệu suất đội nhóm tăng 300%, chi phí quản lý giảm 60%. Tính minh bạch trong hoa hồng giúp giữ chân nhân tài tốt hơn.',
      initials: 'SGL',
      color: 'blue',
      rating: 5,
      aos: 'fade-up',
      aosDelay: '100'
    },
    {
      id: 3,
      name: 'Lê Thị Hồng',
      position: 'Startup môi giới',
      quote: 'Khởi nghiệp với 2 người, nhờ hệ thống onboarding và đào tạo tự động, tôi đã mở rộng lên 8 thành viên chỉ trong 3 tháng mà không cần nhiều kinh nghiệm quản lý.',
      initials: 'LH',
      color: 'emerald',
      rating: 5,
      aos: 'fade-up',
      aosDelay: '200'
    }
  ],

  // Benefits Data
  benefits: [
    {
      title: "Tăng 300% Hiệu Suất",
      iconName: "fas fa-chart-line",
      color: "pink",
      aosDelay: 0,
      statNumber: "+300%",
      statLabel: "Thống kê thực tế:",
      description: "Đội nhóm hoạt động hiệu quả hơn với công cụ quản lý chuyên nghiệp và tự động hóa quy trình."
    },
    {
      title: "Giảm 80% Chi Phí",
      iconName: "fas fa-money-bill-wave",
      color: "purple",
      aosDelay: 100,
      statNumber: "80%",
      statLabel: "Tiết kiệm trung bình:",
      description: "Tiết kiệm chi phí quản lý, đào tạo và vận hành đội nhóm với hệ thống tự động hóa."
    },
    {
      title: "0% Turnover Rate",
      iconName: "fas fa-users",
      color: "blue",
      aosDelay: 200,
      statNumber: "0%",
      statLabel: "Tỷ lệ nghỉ việc:",
      description: "Tính minh bạch trong hoa hồng và môi trường làm việc chuyên nghiệp giúp giữ chân nhân tài."
    }
  ],

  // Video
  videoId: "JZ1YvvYo2hA",

  // CSS Properties
  css: {
    gradients: {
      primary: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      secondary: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      success: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
      warning: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
      info: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
    },
    colors: {
      darkBg: "#0f172a",
      darkerBg: "#020617",
      purpleLight: "rgba(139, 92, 246, 0.1)",
      pinkLight: "rgba(236, 72, 153, 0.1)"
    },
    sizes: {
      heroCardWidth: "200px",
      featureIconSize: "70px"
    }
  }
});

function ensureArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return [value];
    }
  }
  if (typeof value === 'object') return Object.values(value);
  return [value];
}

const loadConfig = async () => {
  const response = await api.get('/thg/public/cms/contentSection/60');

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

onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
/* CSS Variables được bind từ config */
:root {
  --primary-gradient: v-bind('config.css.gradients.primary');
  --secondary-gradient: v-bind('config.css.gradients.secondary');
  --success-gradient: v-bind('config.css.gradients.success');
  --warning-gradient: v-bind('config.css.gradients.warning');
  --info-gradient: v-bind('config.css.gradients.info');
  --dark-bg: v-bind('config.css.colors.darkBg');
  --darker-bg: v-bind('config.css.colors.darkerBg');
  --hero-card-width: v-bind('config.css.sizes.heroCardWidth');
  --feature-icon-size: v-bind('config.css.sizes.featureIconSize');
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px v-bind('config.css.colors.purpleLight');
}

.gradient-text {
  background: v-bind('config.css.gradients.primary');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-bg {
  background: v-bind('config.css.gradients.primary');
}

.secondary-gradient {
  background: v-bind('config.css.gradients.secondary');
}

.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px v-bind('config.css.colors.purpleLight');
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Tool Card */
.tool-card {
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: 0.5s;
}

.tool-card:hover::before {
  left: 100%;
}

/* Feature Icon */
.feature-icon {
  width: v-bind('config.css.sizes.featureIconSize');
  height: v-bind('config.css.sizes.featureIconSize');
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  margin-bottom: 25px;
  transition: all 0.3s ease;
}

.feature-icon:hover {
  transform: scale(1.1) rotate(5deg);
}

/* Team Node */
.team-node {
  background: v-bind('config.css.gradients.primary');
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  text-align: center;
  min-width: var(--hero-card-width);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
}

.team-node:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(139, 92, 246, 0.4);
}

.team-connector {
  height: 40px;
  width: 2px;
  background: linear-gradient(to bottom, #8b5cf6, #ec4899);
  margin: 0 auto;
}

/* Testimonial Card */
.testimonial-card {
  position: relative;
}

.testimonial-card::before {
  content: '"';
  position: absolute;
  top: -20px;
  left: 20px;
  font-size: 80px;
  color: rgba(139, 92, 246, 0.2);
  font-family: serif;
}

/* Pricing Card */
.pricing-popular {
  position: relative;
  transform: scale(1.05);
  z-index: 10;
}

.pricing-popular::before {
  content: 'PHỔ BIẾN NHẤT';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: v-bind('config.css.gradients.primary');
  color: white;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Form Input */
.form-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px v-bind('config.css.colors.purpleLight');
}

/* Video Container */
.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: 20px;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>