<template>
  <div class="recruitment-page pt-20">
    <!-- HERO SECTION - TUYỂN DỤNG -->
    <section id="hero" class="min-h-screen bg-hero-pattern flex items-center relative overflow-hidden py-12 lg:py-0">
      <!-- Animated background elements -->
      <div class="light-effect top-10 left-10"></div>
      <div class="light-effect bottom-10 right-10"></div>

      <div class="container mx-auto px-4 lg:px-6 relative z-10">
        <div class="custom-grid grid gap-12 lg:gap-10 items-center">
          <!-- Cột trái: Nội dung chính -->
          <div class="text-left" data-aos="fade-right" data-aos-duration="1000">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight text-white fade-in-up"
                data-aos="fade-up" data-aos-delay="200">
              {{ config.hero.title.line1 }} <br>
              <span class="text-gradient highlight-text">{{ config.hero.title.line2 }}</span>
            </h1>

            <p class="text-slate-300 text-lg mb-6 font-light fade-in-up" data-aos="fade-up"
               data-aos-delay="400">
              <b>{{ config.company.name }}</b> {{ config.hero.description }}
            </p>

            <div class="earnings-card mb-8" data-aos="fade-up" data-aos-delay="500">
              <div class="flex items-center mb-4">
                <div class="earnings-badge">{{ config.hero.earnings.badge }}</div>
              </div>
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="text-4xl font-bold text-white mb-2">{{ config.hero.earnings.range }}</p>
                  <p class="text-slate-400">{{ config.hero.earnings.unit }}</p>
                </div>
                <div class="mt-4 md:mt-0">
                  <p v-for="bonus in config.hero.earnings.bonuses" :key="bonus" :class="bonus.class">
                    {{ bonus.text }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 fade-in-up" data-aos="fade-up" data-aos-delay="600">
              <a href="#application" class="btn-gradient">
                <i class="fas fa-paper-plane mr-2"></i> {{ config.hero.buttons.apply }}
              </a>

              <a href="#jobs" class="btn-outline">
                <i class="fas fa-search mr-2"></i> {{ config.hero.buttons.viewJobs }}
              </a>
            </div>

            <!-- Thông tin nhanh -->
            <div class="mt-12 grid grid-cols-2 gap-4">
              <div v-for="(feature, index) in config.hero.features" :key="index"
                   class="flex items-center" data-aos="fade-up" :data-aos-delay="700 + index * 100">
                <div :class="feature.iconBgClass" class="w-[40px] h-[40px] flex justify-center items-center">
                  <i :class="feature.iconClass"></i>
                </div>
                <span class="text-slate-300 text-sm">{{ feature.text }}</span>
              </div>
            </div>
          </div>

          <!-- Cột phải: Hình ảnh và thông tin -->
          <div class="relative" data-aos="fade-left" data-aos-duration="1000">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                  :src="baseImgaeUrl+config.hero.image.url"
                  :alt="config.hero.image.alt" class="w-full max-h-[50vh]">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-70"></div>

              <!-- Overlay text -->
              <div class="absolute bottom-0 left-0 p-8">
                <div class="flex items-center mb-4">
                  <div class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p class="text-white font-bold">{{ config.hero.overlay.stats }}</p>
                  </div>
                </div>
                <h3 class="text-2xl font-bold text-white">{{ config.hero.overlay.title }}</h3>
              </div>
            </div>

            <!-- Thông tin thêm -->
            <div class="grid grid-cols-2 gap-4 mt-8">
              <div v-for="stat in config.hero.stats" :key="stat.label" class="stats-card">
                <div :class="stat.iconClass">
                  <i :class="stat.icon"></i>
                </div>
                <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
                <p class="text-slate-400 text-sm">{{ stat.label }}</p>
              </div>
            </div>
            <div class="flex justify-center">
              <div
                  class="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mt-6">
                <i class="fas fa-bullhorn text-blue-400 mr-2"></i><span
                  class="text-blue-400 text-sm font-bold uppercase tracking-widest">{{ config.hero.recruitmentBadge }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div
          class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-400 hidden lg:block">
        <i class="fas fa-chevron-down w-6 h-6"></i>
      </div>
    </section>

    <!-- VỊ TRÍ TUYỂN DỤNG -->
    <section id="jobs" class="py-24 bg-brand-dark relative overflow-hidden">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{{ config.jobs.section.subtitle }}</h2>
          <h3 class="text-4xl font-display font-bold text-white mb-4">{{ config.jobs.section.title.line1 }} <span
              class="text-gradient">{{ config.jobs.section.title.line2 }}</span></h3>
          <div class="section-divider"></div>
          <p class="max-w-2xl mx-auto text-slate-400 mt-6">
            {{ config.jobs.section.description }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SimpleGlassCard
              v-for="(job, index) in config.jobs.list"
              :key="job.id"
              :data-aos="'fade-up'"
              :data-aos-delay="index * 100"
              :title="job.title"
              :description="job.description"
              :icon="job.icon"
              :color="job.color"
              :price="job.price"
              :unit="job.unit"
              :listTags="formatTags(job.tags)"
              :link="job.link"
              :linkText="job.linkText"
          />
        </div>

        <!-- More jobs row -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        </div>

        <div class="text-center mt-12" data-aos="fade-up" data-aos-delay="700">
          <a href="#application" class="btn-gradient inline-block">
            <i class="fas fa-briefcase mr-2"></i> {{ config.jobs.applyButton }}
          </a>
          <p class="text-slate-400 text-sm mt-4">{{ config.jobs.footerNote }}</p>
        </div>
      </div>
    </section>

    <!-- TẠI SAO CHỌN CHÚNG TÔI -->
    <section class="py-24 bg-slate-900 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]">
        </div>
      </div>

      <div class="container mx-auto px-6 relative z-10">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{{ config.benefits.section.subtitle }}</h2>
          <h3 class="text-4xl font-display font-bold text-white mb-4">{{ config.benefits.section.title.line1 }} <span
              class="text-gradient">{{ config.benefits.section.title.line2 }}</span></h3>
          <div class="section-divider"></div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <GlassCard
              v-for="(benefit, index) in config.benefits.list"
              :key="index"
              :title="benefit.title"
              :iconName="benefit.iconName"
              :color="benefit.color"
              :padding="'medium'"
              :hoverEffect="true"
              :aos="'fade-up'"
              :aosDelay="`${benefit.aosDelay}`"
              :gradient-class-icon="true"
          >
            {{ benefit.description }}
          </GlassCard>
        </div>

        <!-- QUY TRÌNH LÀM VIỆC DẠNG DỌC -->
        <div class="mt-16 max-w-4xl mx-auto" data-aos="fade-up">
          <h4 class="text-2xl font-bold text-white text-center mb-12">{{ config.process.title }}</h4>

          <div class="vertical-timeline">
            <div v-for="(step, index) in config.process.steps" :key="index"
                 :class="`timeline-step step-${parseInt(index) + 1}`" :data-aos="'fade-right'" :data-aos-delay="100 + index * 100">
              <div class="step-number">{{ parseInt(index) + 1 }}</div>
              <div class="step-content">
                <h5 class="text-xl font-bold text-white mb-3 flex items-center">
                  <span class="mr-2">{{ step.title }}</span>
                  <span :class="step.badgeClass">{{ step.badgeText }}</span>
                </h5>
                <p class="text-slate-300 mb-4">
                  {{ step.description }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="(tag, tagIndex) in step.tags" :key="tagIndex" :class="tag.class">
                    {{ tag.text }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-12" data-aos="fade-up" data-aos-delay="500">
            <a href="#application" class="btn-gradient inline-block">
              <i class="fas fa-play-circle mr-2"></i> {{ config.process.startButton }}
            </a>
            <p class="text-slate-400 text-sm mt-4">{{ config.process.footerNote }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TRẢI NGHIỆM CTV -->
    <section class="py-24 bg-brand-dark relative overflow-hidden">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{{ config.testimonials.section.subtitle }}</h2>
          <h3 class="text-4xl font-display font-bold text-white mb-4">{{ config.testimonials.section.title.line1 }} <span
              class="text-gradient">{{ config.testimonials.section.title.line2 }}</span></h3>
          <div class="section-divider"></div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
              v-for="(testimonial, index) in config.testimonials.list"
              :key="index"
              :name="testimonial.name"
              :position="testimonial.position"
              :quote="testimonial.quote"
              :initials="testimonial.initials"
              :color="testimonial.color"
              :rating="testimonial.rating"
          />
        </div>
        <!-- Thống kê CTV -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div v-for="(stat, index) in config.stats" :key="stat.label"
               class="text-center" data-aos="fade-up" :data-aos-delay="100 + index * 100">
            <p class="counter count-up" :data-count="stat.count">{{ stat.count }}</p>
            <p class="text-slate-400 text-sm uppercase tracking-widest">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FORM ĐĂNG KÝ -->
    <section id="application" class="py-24 bg-gradient-to-br from-slate-900 to-blue-900/30 relative overflow-hidden">
      <div class="container mx-auto px-6">
        <div class="mx-auto">
          <div class="text-center mb-16" data-aos="fade-up">
            <h2 class="text-4xl font-display font-bold text-white mb-6">{{ config.form.title }}</h2>
            <p class="text-slate-300 mb-10">
              {{ config.form.description }}
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-12">
            <!-- Form đăng ký -->
            <div class="glass-card p-8" data-aos="fade-right">
              <h3 class="text-2xl font-bold text-white mb-6">{{ config.form.sections.info.title }}</h3>

              <form @submit.prevent="submitForm">
                <div v-for="field in config.form.fields" :key="field.name" class="mb-6">
                  <label class="block text-slate-300 mb-2">{{ field.label }}</label>
                  <input v-if="field.type !== 'select'"
                         v-model="formData[field.name]"
                         :type="field.type"
                         class="form-input"
                         :placeholder="field.placeholder"
                         :required="field.required">
                  <select v-else v-model="formData[field.name]" class="form-input" required>
                    <option value="">{{ field.placeholder }}</option>
                    <option v-for="option in field.options" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                </div>

                <div class="mb-6">
                  <label class="block text-slate-300 mb-2">{{ config.form.timeLabel }}</label>
                  <div class="grid grid-cols-2 gap-4">
                    <div v-for="time in config.form.workTimes" :key="time.id" class="flex items-center">
                      <input v-model="formData.workTime[time.id]" type="checkbox" :id="time.id" class="mr-2">
                      <label :for="time.id" class="text-slate-300">{{ time.label }}</label>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn-gradient w-full">
                  <i class="fas fa-paper-plane mr-2"></i> {{ config.form.submitButton }}
                </button>

                <p class="text-slate-400 text-xs mt-4">
                  {{ config.form.terms.text }} <a href="#" class="text-blue-400">{{ config.form.terms.linkText }}</a>
                </p>
              </form>
            </div>

            <!-- Thông tin hỗ trợ -->
            <div class="glass-card p-8 flex justify-center flex-col" data-aos="fade-left">
              <h3 class="text-2xl font-bold text-white mb-6 text-center">{{ config.form.sections.support.title }}</h3>

              <div class="mb-8">
                <div v-for="contact in config.form.contact" :key="contact.type" class="flex items-start mb-6">
                  <div :class="contact.iconBgClass">
                    <i :class="contact.iconClass"></i>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white mb-1">{{ contact.title }}</h4>
                    <p class="text-slate-300 text-xl font-bold mb-1">{{ contact.value }}</p>
                    <p v-if="contact.note" class="text-slate-400 text-sm">{{ contact.note }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800/50 p-6 rounded-lg mb-8">
                <h4 class="text-lg font-bold text-white mb-4">{{ config.form.notes.title }}</h4>
                <ul class="space-y-3">
                  <li v-for="note in config.form.notes.list" :key="note" class="flex items-start">
                    <i class="fas fa-check text-emerald-400 mt-1 mr-3"></i>
                    <span class="text-slate-300">{{ note }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, nextTick, computed} from 'vue'
import SimpleGlassCard from "../../UI/SimpleGlassCard.vue";
import GlassCard from "../../UI/GlassCard.vue";
import TestimonialCard from "../../UI/TestimonialCard.vue";
import api from "../../../../api/api.js";
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// CONFIG OBJECT
const config = reactive({
  company: {
    name: "Thiên Hà Group",
    email: "thienhagroup@gmail.com",
    phone: "091.123.1882"
  },
  hero: {
    title: {
      line1: "Cơ Hội Việc Làm",
      line2: "Linh Hoạt 1-2 Tiếng/Lần"
    },
    description: "đang tuyển Cộng Tác Viên bất động sản trên toàn quốc. Bạn có thể làm việc linh hoạt chỉ với 1-2 tiếng mỗi lần, không yêu cầu kinh nghiệm, thu nhập hấp dẫn từ 200K - 500K cho mỗi nhiệm vụ hoàn thành.",
    earnings: {
      badge: "THU NHẬP HẤP DẪN",
      range: "200K - 500K",
      unit: "Mỗi nhiệm vụ hoàn thành",
      bonuses: [
        { text: "+ Thưởng hiệu suất", class: "text-lg text-emerald-400 font-semibold" },
        { text: "+ Hoa hồng theo giao dịch", class: "text-lg text-purple-400 font-semibold" }
      ]
    },
    buttons: {
      apply: "Đăng Ký Ngay",
      viewJobs: "Xem Vị Trí Tuyển Dụng"
    },
    features: [
      {
        iconClass: "fas fa-clock text-blue-400",
        iconBgClass: "bg-blue-500/10 p-2 rounded-lg mr-3",
        text: "Linh hoạt thời gian"
      },
      {
        iconClass: "fas fa-map-marker-alt text-purple-400",
        iconBgClass: "bg-purple-500/10 p-2 rounded-lg mr-3",
        text: "Làm việc tại nhà"
      },
      {
        iconClass: "fas fa-graduation-cap text-emerald-400",
        iconBgClass: "bg-emerald-500/10 p-2 rounded-lg mr-3",
        text: "Không yêu cầu kinh nghiệm"
      },
      {
        iconClass: "fas fa-money-bill-wave text-blue-400",
        iconBgClass: "bg-blue-500/10 p-2 rounded-lg mr-3",
        text: "Thanh toán nhanh 24h"
      }
    ],
    image: {
      url: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      alt: "Cộng tác viên bất động sản"
    },
    overlay: {
      stats: "Hơn 5,000 CTV đang hợp tác",
      title: "Gia nhập đội ngũ CTV hàng đầu Việt Nam"
    },
    stats: [
      {
        icon: "fas fa-user-plus",
        iconClass: "stats-icon bg-blue-500/10 text-blue-400",
        value: "1,200+",
        label: "CTV mới mỗi tháng"
      },
      {
        icon: "fas fa-money-check-alt",
        iconClass: "stats-icon bg-purple-500/10 text-purple-400",
        value: "8.2 tỷ",
        label: "Thanh toán cho CTV/năm"
      }
    ],
    recruitmentBadge: "ĐANG TUYỂN CỘNG TÁC VIÊN"
  },
  jobs: {
    section: {
      subtitle: "Vị Trí Tuyển Dụng",
      title: {
        line1: "Các Công Việc",
        line2: "CTV Đang Cần Tuyển"
      },
      description: "Thiên Hà Group cần tuyển hàng trăm CTV cho các vị trí khác nhau tại 63 tỉnh thành. Bạn có thể lựa chọn công việc phù hợp với thời gian và kỹ năng của mình."
    },
    list: [
      {
        id: 1,
        icon: 'fas fa-camera',
        color: '#60a5fa',
        title: 'CTV Chụp Ảnh BĐS',
        price: '300K',
        unit: '/tài sản',
        description: 'Chụp ảnh bất động sản theo yêu cầu (căn hộ, nhà phố, đất nền). Chỉ cần smartphone chất lượng tốt, không cần máy ảnh chuyên nghiệp.',
        tags: ['Làm tại nhà', '1-2 tiếng/lần', 'Không yêu cầu kinh nghiệm'],
        link: '#',
        linkText: 'Xem chi tiết'
      },
      {
        id: 2,
        icon: 'fas fa-search-location',
        color: '#a78bfa',
        title: 'CTV Khảo Sát Thị Trường',
        price: '200K',
        unit: '/khu vực',
        description: 'Khảo sát giá bất động sản tại các khu vực được chỉ định. Thu thập thông tin về các dự án mới, giá cho thuê, giá bán thực tế trên thị trường.',
        tags: ['Linh hoạt địa điểm', '2-3 tiếng/lần', 'Có smartphone'],
        link: '#',
        linkText: 'Xem chi tiết'
      },
      {
        id: 3,
        icon: 'fas fa-user-tie',
        color: '#ec4899',
        title: 'CTV Giới Thiệu Khách Hàng',
        price: '500K',
        unit: '/khách hàng tiềm năng',
        description: 'Giới thiệu khách hàng có nhu cầu mua/bán/thuê bất động sản. Nhận hoa hồng cao khi khách hàng thực hiện giao dịch thành công.',
        tags: ['Hoa hồng cao', 'Làm online', 'Không giới hạn thu nhập'],
        link: '#',
        linkText: 'Xem chi tiết'
      },
      {
        id: 4,
        icon: 'fas fa-file-contract',
        color: '#22d3ee',
        title: 'CTV Nhập Liệu BĐS',
        price: '250K',
        unit: '/ngày',
        description: 'Nhập liệu thông tin bất động sản lên hệ thống. Công việc có thể làm hoàn toàn online, thời gian linh hoạt, chỉ cần máy tính kết nối internet.',
        tags: ['Làm online', 'Giờ linh hoạt', 'Đào tạo miễn phí'],
        link: '#',
        linkText: 'Xem chi tiết'
      },
      {
        id: 5,
        icon: 'fas fa-video',
        color: '#34d399',
        title: 'CTV Quay Video 360°',
        price: '400K',
        unit: '/tài sản',
        description: 'Quay video 360° bất động sản bằng thiết bị chuyên dụng được công ty cung cấp. Đào tạo kỹ thuật miễn phí, thu nhập ổn định.',
        tags: ['Cung cấp thiết bị', 'Đào tạo miễn phí', 'Thu nhập cao'],
        link: '#',
        linkText: 'Xem chi tiết'
      },
      {
        id: 6,
        icon: 'fas fa-headset',
        color: '#fbbf24',
        title: 'CTV Tư Vấn Online',
        price: '180K',
        unit: '/giờ',
        description: 'Tư vấn khách hàng qua điện thoại, zalo, facebook về các sản phẩm bất động sản. Làm việc theo ca linh hoạt, được cung cấp script và đào tạo bài bản.',
        tags: ['Làm online', 'Ca linh hoạt', 'Có script hỗ trợ'],
        link: '#',
        linkText: 'Xem chi tiết'
      },
    ],
    applyButton: "Đăng Ký Ngay!",
    footerNote: "*Nhận ngay để nhận phản hồi nhanh nhất từ Thiên Hà Group"
  },
  benefits: {
    section: {
      subtitle: "Lợi Ích Khi Làm CTV",
      title: {
        line1: "Tại Sao Nên Làm Cộng Tác Viên Tại",
        line2: "Thiên Hà Group?"
      }
    },
    list: [
      {
        title: 'Thu Nhập Hấp Dẫn',
        iconName: 'fas fa-money-bill-wave',
        color: 'blue',
        aosDelay: 100,
        description: '200K - 500K cho mỗi nhiệm vụ hoàn thành. Thanh toán nhanh trong 24h qua ví điện tử hoặc tài khoản ngân hàng.',
      },
      {
        title: 'Thời Gian Linh Hoạt',
        iconName: 'fas fa-clock',
        color: 'purple',
        aosDelay: 200,
        description: 'Làm việc bất cứ khi nào bạn rảnh. Chỉ cần 1-2 tiếng mỗi lần, không gò bó thời gian, không ảnh hưởng công việc chính.',
      },
      {
        title: 'Đào Tạo Miễn Phí',
        iconName: 'fas fa-graduation-cap',
        color: 'teal',
        aosDelay: 300,
        description: 'Không cần kinh nghiệm. Chúng tôi đào tạo từ cơ bản đến nâng cao về bất động sản, kỹ năng chụp ảnh, tư vấn khách hàng.',
      },
      {
        title: 'Thăng Tiến & Thưởng',
        iconName: 'fas fa-trophy',
        color: 'amber',
        aosDelay: 400,
        description: 'Cơ hội trở thành nhân viên chính thức, quản lý khu vực. Thưởng hiệu suất hàng tháng, quý, năm với giá trị cao.',
      },
    ]
  },
  process: {
    title: "Quy Trình Làm Việc Của CTV",
    steps: [
      {
        title: "Đăng Ký & Đào Tạo",
        badgeText: "Bắt đầu",
        badgeClass: "text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full",
        description: "Đăng ký online chỉ trong 5 phút. Sau đó, tham gia khóa đào tạo miễn phí 2 buổi được thiết kế riêng cho CTV mới. Bạn sẽ được hướng dẫn chi tiết về quy trình làm việc và các công cụ hỗ trợ.",
        tags: [
          { text: "Đăng ký online", class: "text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full" },
          { text: "Đào tạo miễn phí", class: "text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full" },
          { text: "Hỗ trợ 1:1", class: "text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full" }
        ]
      },
      {
        title: "Nhận Nhiệm Vụ",
        badgeText: "Lựa chọn",
        badgeClass: "text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full",
        description: "Truy cập vào ứng dụng Thiên Hà Group để xem danh sách nhiệm vụ có sẵn. Lựa chọn công việc phù hợp với thời gian và kỹ năng của bạn. Mỗi nhiệm vụ đều có mô tả chi tiết, yêu cầu cụ thể và mức thù lao rõ ràng.",
        tags: [
          { text: "App thông minh", class: "text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full" },
          { text: "Đa dạng nhiệm vụ", class: "text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full" },
          { text: "Lựa chọn linh hoạt", class: "text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full" }
        ]
      },
      {
        title: "Thực Hiện Công Việc",
        badgeText: "Hành động",
        badgeClass: "text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full",
        description: "Thực hiện nhiệm vụ trong thời gian linh hoạt 1-2 tiếng. Trong quá trình làm việc, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc 24/7 qua điện thoại, Zalo hoặc email.",
        tags: [
          { text: "Linh hoạt thời gian", class: "text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full" },
          { text: "Hỗ trợ 24/7", class: "text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full" },
          { text: "Công cụ hỗ trợ", class: "text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full" }
        ]
      },
      {
        title: "Nộp Kết Quả & Nhận Thanh Toán",
        badgeText: "Hoàn thành",
        badgeClass: "text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full",
        description: "Nộp kết quả công việc qua ứng dụng. Hệ thống sẽ tự động xét duyệt trong vòng 2 giờ và thanh toán vào ví điện tử hoặc tài khoản ngân hàng của bạn trong vòng 24 giờ. Bạn cũng có thể theo dõi lịch sử thanh toán chi tiết trên app.",
        tags: [
          { text: "Duyệt tự động", class: "text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 px-3 py-1 rounded-full" },
          { text: "Thanh toán 24h", class: "text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 px-3 py-1 rounded-full" },
          { text: "Theo dõi thu nhập", class: "text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 px-3 py-1 rounded-full" }
        ]
      }
    ],
    startButton: "Bắt Đầu Ngay Từ Bước 1",
    footerNote: "Hoàn thành 4 bước đơn giản để bắt đầu kiếm thu nhập ngay hôm nay"
  },
  testimonials: {
    section: {
      subtitle: "Trải Nghiệm Thực Tế",
      title: {
        line1: "CTV Nói Gì Về",
        line2: "Thiên Hà Group?"
      }
    },
    list: [
      {
        name: 'Nguyễn Thị Hương',
        position: 'Sinh viên - CTV 8 tháng',
        quote: 'Mình là sinh viên, làm CTV chụp ảnh BĐS được 8 tháng. Thu nhập trung bình 4-5 triệu/tháng, đủ trang trải học phí và sinh hoạt. Công việc linh hoạt, không ảnh hưởng việc học.',
        initials: 'NH',
        color: 'blue',
        rating: 5
      },
      {
        name: 'Trần Văn Minh',
        position: 'Nhân viên văn phòng - CTV 2 năm',
        quote: 'Làm CTV khảo sát thị trường vào cuối tuần, thu nhập thêm 3-4 triệu/tháng. Công ty thanh toán rất nhanh, luôn hỗ trợ nhiệt tình. Đây là công việc phụ tốt nhất mình từng làm.',
        initials: 'TM',
        color: 'emerald',
        rating: 5
      },
      {
        name: 'Phạm Thị Lan',
        position: 'Nội trợ - CTV 1 năm',
        quote: 'Sau khi sinh em bé, mình làm CTV nhập liệu online tại nhà. Công việc nhẹ nhàng, thời gian linh hoạt, vừa trông con vừa kiếm thêm 4-5 triệu/tháng. Rất phù hợp với các mẹ bỉm sữa.',
        initials: 'PL',
        color: 'pink',
        rating: 5
      }
    ]
  },
  stats: [
    { label: "CTV Đang Hợp Tác", count: 5200 },
    { label: "Tỷ Thanh Toán/Năm", count: 8.2 },
    { label: "% Hài Lòng", count: 98 },
    { label: "Tỉnh Thành Phủ Sóng", count: 34 }
  ],
  form: {
    title: "Đăng Ký Làm Cộng Tác Viên Ngay",
    description: "Điền thông tin đăng ký để nhận tư vấn chi tiết về công việc phù hợp với bạn. Chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc.",
    sections: {
      info: {
        title: "Thông Tin Đăng Ký"
      },
      support: {
        title: "Hỗ Trợ & Tư Vấn"
      }
    },
    fields: [
      {
        name: "name",
        label: "Họ và tên *",
        type: "text",
        placeholder: "Nguyễn Văn A",
        required: true
      },
      {
        name: "phone",
        label: "Số điện thoại *",
        type: "tel",
        placeholder: "0900 123 456",
        required: true
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "email@example.com",
        required: false
      },
      {
        name: "location",
        label: "Khu vực sinh sống *",
        type: "text",
        placeholder: "Quận/Huyện, Tỉnh/Thành phố",
        required: true
      },
      {
        name: "position",
        label: "Bạn quan tâm vị trí nào? *",
        type: "select",
        placeholder: "Chọn vị trí quan tâm",
        required: true,
        options: [
          { value: "photographer", text: "CTV Chụp Ảnh BĐS" },
          { value: "survey", text: "CTV Khảo Sát Thị Trường" },
          { value: "referral", text: "CTV Giới Thiệu Khách Hàng" },
          { value: "data", text: "CTV Nhập Liệu BĐS" },
          { value: "video", text: "CTV Quay Video 360°" },
          { value: "consultant", text: "CTV Tư Vấn Online" }
        ]
      }
    ],
    timeLabel: "Thời gian có thể làm việc *",
    workTimes: [
      { id: "weekday", label: "Ngày thường" },
      { id: "weekend", label: "Cuối tuần" },
      { id: "morning", label: "Buổi sáng" },
      { id: "afternoon", label: "Buổi chiều" }
    ],
    submitButton: "Gửi Đăng Ký Ngay",
    terms: {
      text: "Bằng việc đăng ký, bạn đồng ý với",
      linkText: "Điều khoản & Chính sách"
    },
    contact: [
      {
        type: "phone",
        title: "Hotline Tuyển Dụng",
        value: "091.123.1882",
        iconClass: "fas fa-phone-alt text-blue-400",
        iconBgClass: "bg-blue-500/10 p-3 rounded-lg mr-4"
      },
      {
        type: "email",
        title: "Email Tuyển Dụng",
        value: "thienhagroup@gmail.com",
        note: "(Phản hồi trong 2h)",
        iconClass: "fas fa-envelope text-emerald-400",
        iconBgClass: "bg-emerald-500/10 p-3 rounded-lg mr-4"
      }
    ],
    notes: {
      title: "Lưu ý quan trọng",
      list: [
        "Không yêu cầu kinh nghiệm, đào tạo từ đầu",
        "Không thu bất kỳ khoản phí nào",
        "Thanh toán nhanh trong 24h sau khi hoàn thành",
        "Làm việc tại nhà, không cần đến văn phòng"
      ]
    }
  },
  style: {
    colors: {
      slate900: 'var(--color-slate-900)',
      slate800: 'var(--color-slate-800)',
      slate700: 'var(--color-slate-700)',
      slate300: 'var(--color-slate-300)',
      slate400: 'var(--color-slate-400)',
      blue400: 'var(--color-blue-400)',
      blue500: 'var(--color-blue-500)',
      blue600: 'var(--color-blue-600)',
      purple400: 'var(--color-purple-400)',
      purple500: 'var(--color-purple-500)',
      purple600: 'var(--color-purple-600)',
      emerald400: 'var(--color-emerald-400)',
      emerald500: 'var(--color-emerald-500)',
      pink400: 'var(--color-pink-400)',
      cyan400: 'var(--color-cyan-400)',
      amber400: 'var(--color-amber-400)',
      white: '#ffffff'
    },
    gradients: {
      primary: "linear-gradient(90deg, #60a5fa, #8b5cf6)",
      hero: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
      earningsBadge: "linear-gradient(90deg, #10b981, #3b82f6, #10b981)",
      formBg: "linear-gradient(to bottom right, #0f172a, rgba(30, 58, 138, 0.3))"
    },
    shadows: {
      glow: "0 10px 25px rgba(59, 130, 246, 0.3)",
      cardHover: "0 20px 40px rgba(0, 0, 0, 0.4)"
    },
    borderRadius: {
      small: "8px",
      medium: "12px",
      large: "16px",
      xlarge: "20px",
      full: "9999px"
    }
  }
});

// CSS Variables computed from config


// Reactive data
const formData = reactive({
  name: '',
  phone: '',
  email: '',
  location: '',
  position: '',
  workTime: {
    weekday: false,
    weekend: false,
    morning: false,
    afternoon: false
  }
})

// Methods
const submitForm = () => {
  // Simple validation
  if (formData.phone.length < 10) {
    alert('Vui lòng nhập số điện thoại hợp lệ')
    return
  }

  // In a real application, you would send data to server here
  alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 2 giờ làm việc.')

  // Reset form
  formData.name = ''
  formData.phone = ''
  formData.email = ''
  formData.location = ''
  formData.position = ''
  formData.workTime = {
    weekday: false,
    weekend: false,
    morning: false,
    afternoon: false
  }
}

const startCounter = (counter) => {
  const target = +counter.getAttribute('data-count')
  const suffix = counter.innerText.replace(/[0-9.]/g, '') || ''
  const count = +counter.innerText.replace(/[^0-9.]/g, '') || 0

  const duration = 2000
  const steps = 60
  const stepTime = duration / steps
  const increment = target / steps
  let current = 0
  let step = 0

  const timer = setInterval(() => {
    step++
    current = Math.min(increment * step, target)

    if (suffix === '%') {
      counter.innerText = current.toFixed(1) + suffix
    } else {
      counter.innerText = Math.floor(current).toLocaleString() + suffix
    }

    if (step >= steps) {
      clearInterval(timer)
      if (suffix === '%') {
        counter.innerText = target.toFixed(1) + suffix
      } else {
        counter.innerText = target.toLocaleString() + suffix
      }
    }
  }, stepTime)
}

const loadConfig = async () => {
  const response = await api.get('/thg/public/cms/contentSection/63');

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
    Object.assign(config, processedConfig)

    console.log('Config đã được xử lý:', processedConfig);
  }
};

// Hàm chuyển đổi object -> array
const convertObjectToArray =(obj) =>{
  if (!obj) return [];
  return Object.values(obj);
}

// Nếu BE trả về trực tiếp object
const formatTags = (tags) => {
  if (Array.isArray(tags)) return tags; // Nếu đã là array thì return luôn
  if (typeof tags === 'object' && tags !== null) {
    return Object.values(tags);
  }
  return [];
}

// Lifecycle hooks
onMounted(async () => {
  console.log("Chuẩn bị load config")
  await loadConfig();
  console.log("Đã load")

  // Initialize AOS
  if (window.AOS) {
    window.AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    })
  }

  // Animated counters
  nextTick(() => {
    const counters = document.querySelectorAll('.count-up')

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
      const suffix = counter.getAttribute('data-count').includes('.') ? '%' : ''
      counter.innerText = '0' + suffix
      observer.observe(counter)
    })

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
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
  })
})
</script>

<style scoped>
.custom-grid {
  grid-template-columns: 3fr 2fr;
}

@media (max-width: 1024px) {
  .custom-grid {
    grid-template-columns: 1fr;
  }
}

.recruitment-page {
  font-family: 'Inter', sans-serif;
  background-color: v-bind('config.style.colors.slate900');
  color: white;
  overflow-x: hidden;
}

.font-display {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
}

.bg-brand-dark {
  background-color: v-bind('config.style.colors.slate900');
}

.text-gradient {
  background: v-bind('config.style.gradients.primary');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.highlight-text {
  background: v-bind('config.style.gradients.primary');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bg-hero-pattern {
  background: v-bind('config.style.gradients.hero'),
  radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
  url('https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.section-divider {
  width: 80px;
  height: 4px;
  background: v-bind('config.style.gradients.primary');
  border-radius: 2px;
  margin: 0 auto;
}

.btn-outline {
  background: transparent;
  color: white;
  font-weight: 600;
  padding: 12px 32px;
  border-radius: v-bind('config.style.borderRadius.small');
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
}

.btn-outline:hover {
  border-color: v-bind('config.style.colors.blue500');
  color: v-bind('config.style.colors.blue400');
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
  background: v-bind('config.style.colors.blue600');
  border-radius: 4px;
}

/* Hiệu ứng cho số liệu thống kê */
.counter {
  font-size: 3rem;
  font-weight: 800;
  background: v-bind('config.style.gradients.primary');
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

/* CẬP NHẬT: Job card styling với hover mới */
.job-card {
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: v-bind('config.style.borderRadius.xlarge');
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.job-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: v-bind('config.style.gradients.primary');
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease;
}

/* HIỆU ỨNG HOVER MỚI - DỄ ĐỌC CHỮ */
.job-card:hover {
  transform: translateY(-8px);
  box-shadow: v-bind('config.style.shadows.cardHover');
  border-color: rgba(59, 130, 246, 0.3);
  background: linear-gradient(145deg, rgba(20, 28, 47, 0.95), rgba(35, 46, 69, 0.95));
}

.job-card:hover::before {
  transform: scaleX(1);
}

.job-icon {
  width: 80px;
  height: 80px;
  border-radius: v-bind('config.style.borderRadius.xlarge');
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15));
  transition: all 0.4s ease;
}

.job-card:hover .job-icon {
  transform: scale(1.1);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.25));
}

/* Step process styling - CẬP NHẬT THÀNH DẠNG DỌC */
.vertical-timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.vertical-timeline::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: v-bind('config.style.gradients.primary');
}

.timeline-step {
  position: relative;
  padding-left: 80px;
  margin-bottom: 40px;
}

.timeline-step:last-child {
  margin-bottom: 0;
}

.timeline-step::before {
  content: '';
  position: absolute;
  left: 22px;
  top: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: v-bind('config.style.colors.slate900');
  border: 4px solid v-bind('config.style.colors.blue500');
  z-index: 1;
}

.timeline-step.completed::before {
  background: v-bind('config.style.colors.blue500');
}

.timeline-step .step-number {
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  z-index: 1;
}

.step-content {
  background: rgba(15, 23, 42, 0.6);
  border-radius: v-bind('config.style.borderRadius.large');
  padding: 24px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.step-content:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateX(5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Earnings card */
.earnings-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
  border-radius: v-bind('config.style.borderRadius.large');
  padding: 2rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  position: relative;
  overflow: hidden;
}

.earnings-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
  z-index: 0;
}

.earnings-badge {
  background: v-bind('config.style.gradients.earningsBadge');
  background-size: 200% 100%;
  color: white;
  padding: 4px 12px;
  border-radius: v-bind('config.style.borderRadius.full');
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
  animation: gradientMove 2s linear infinite;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

/* Testimonial card */
.testimonial-card {
  background: rgba(15, 23, 42, 0.6);
  border-radius: v-bind('config.style.borderRadius.large');
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.1);
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.testimonial-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid v-bind('config.style.colors.blue500');
}

/* Form styling */
.form-input {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: v-bind('config.style.borderRadius.small');
  padding: 12px 16px;
  color: white;
  width: 100%;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: v-bind('config.style.colors.blue500');
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Tag styling */
.job-tag {
  background: rgba(59, 130, 246, 0.15);
  color: v-bind('config.style.colors.blue400');
  padding: 6px 12px;
  border-radius: v-bind('config.style.borderRadius.full');
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.job-card:hover .job-tag {
  background: rgba(59, 130, 246, 0.25);
  color: white;
}

/* Stats card */
.stats-card {
  background: rgba(15, 23, 42, 0.6);
  border-radius: v-bind('config.style.borderRadius.large');
  padding: 1.5rem;
  border: 1px solid rgba(148, 163, 184, 0.1);
  transition: all 0.4s ease;
}

.stats-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: v-bind('config.style.borderRadius.medium');
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
}

/* Thêm lớp cho các phần tử văn bản trong job card */
.job-title {
  color: white;
  font-weight: 700;
  transition: color 0.3s ease;
}

.job-price {
  color: v-bind('config.style.colors.emerald400');
  font-weight: 700;
  transition: color 0.3s ease;
}

.job-description {
  color: v-bind('config.style.colors.slate300');
  transition: color 0.3s ease;
}

/* Hiệu ứng overlay tinh tế khi hover */
.job-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: v-bind('config.style.borderRadius.xlarge');
  z-index: 0;
  pointer-events: none;
}

.job-card:hover::after {
  opacity: 1;
}

/* Đảm bảo nội dung nằm trên overlay */
.job-card > * {
  position: relative;
  z-index: 1;
}

/* Hiệu ứng glow nhẹ khi hover */
@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
  }
}

.job-card:hover {
  animation: glow 3s ease-in-out infinite;
}

/* Step gradient backgrounds */
.step-1 .step-number {
  background: v-bind('config.style.gradients.primary');
  color: white;
}

.step-2 .step-number {
  background: linear-gradient(135deg, v-bind('config.style.colors.purple500'), v-bind('config.style.colors.emerald500'));
  color: white;
}

.step-3 .step-number {
  background: linear-gradient(135deg, v-bind('config.style.colors.emerald500'), v-bind('config.style.colors.blue500'));
  color: white;
}

.step-4 .step-number {
  background: linear-gradient(135deg, v-bind('config.style.colors.blue500'), v-bind('config.style.colors.emerald500'), v-bind('config.style.colors.purple500'));
  color: white;
}

/* Responsive cho timeline */
@media (max-width: 768px) {
  .vertical-timeline::before {
    left: 25px;
  }

  .timeline-step {
    padding-left: 60px;
  }

  .timeline-step::before {
    left: 17px;
  }

  .timeline-step .step-number {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
</style>