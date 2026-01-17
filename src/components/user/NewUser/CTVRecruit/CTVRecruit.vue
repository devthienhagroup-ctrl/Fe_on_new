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
              {{ config.textContent.heroTitle }}
              <br>
              <span class="text-gradient highlight-text">{{ config.textContent.heroTitleHighlight }}</span>
            </h1>

            <p class="text-slate-300 text-lg mb-6 font-light fade-in-up" data-aos="fade-up"
               data-aos-delay="400">
              <b>{{ config.textContent.companyName }}</b> {{ config.textContent.heroDescription }}
            </p>

            <div class="earnings-card mb-8" data-aos="fade-up" data-aos-delay="500">
              <div class="flex items-center mb-4">
                <div class="earnings-badge">{{ config.textContent.earningsBadge }}</div>
              </div>
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="text-4xl font-bold text-white mb-2">{{ config.textContent.earningsAmount }}</p>
                  <p class="text-slate-400">{{ config.textContent.earningsUnit }}</p>
                </div>
                <div class="mt-4 md:mt-0">
                  <p class="text-lg text-emerald-400 font-semibold">{{ config.textContent.bonusText }}</p>
                  <p class="text-lg text-purple-400 font-semibold">{{ config.textContent.commissionText }}</p>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 fade-in-up" data-aos="fade-up" data-aos-delay="600">
              <a href="#application" class="btn-gradient">
                <i :class="`${config.icons.paperPlane} mr-2`"></i> {{ config.textContent.applyButton }}
              </a>

              <a href="#jobs" class="btn-outline">
                <i :class="`${config.icons.search} mr-2`"></i> {{ config.textContent.viewJobsButton }}
              </a>
            </div>

            <!-- Thông tin nhanh -->
            <div class="mt-12 grid grid-cols-2 gap-4">
              <div class="flex items-center" data-aos="fade-up" data-aos-delay="700">
                <div class="bg-blue-500/10 p-2 rounded-lg mr-3">
                  <i :class="`${config.icons.clock} text-blue-400`"></i>
                </div>
                <span class="text-slate-300 text-sm">{{ config.textContent.quickInfo.flexibleTime }}</span>
              </div>
              <div class="flex items-center" data-aos="fade-up" data-aos-delay="800">
                <div class="bg-purple-500/10 p-2 rounded-lg mr-3">
                  <i :class="`${config.icons.mapMarker} text-purple-400`"></i>
                </div>
                <span class="text-slate-300 text-sm">{{ config.textContent.quickInfo.workFromHome }}</span>
              </div>
              <div class="flex items-center" data-aos="fade-up" data-aos-delay="900">
                <div class="bg-emerald-500/10 p-2 rounded-lg mr-3">
                  <i :class="`${config.icons.graduationCap} text-emerald-400`"></i>
                </div>
                <span class="text-slate-300 text-sm">{{ config.textContent.quickInfo.noExperience }}</span>
              </div>
              <div class="flex items-center" data-aos="fade-up" data-aos-delay="1000">
                <div class="bg-blue-500/10 p-2 rounded-lg mr-3">
                  <i :class="`${config.icons.moneyBill} text-blue-400`"></i>
                </div>
                <span class="text-slate-300 text-sm">{{ config.textContent.quickInfo.fastPayment }}</span>
              </div>
            </div>
          </div>

          <!-- Cột phải: Hình ảnh và thông tin -->
          <div class="relative" data-aos="fade-left" data-aos-duration="1000">
            <div class="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                  :src="config.images.heroImage"
                  alt="Cộng tác viên bất động sản" class="w-full max-h-[50vh]">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-70"></div>

              <!-- Overlay text -->
              <div class="absolute bottom-0 left-0 p-8">
                <div class="flex items-center mb-4">
                  <div class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p class="text-white font-bold">{{ config.textContent.ctvCountText }}</p>
                  </div>
                </div>
                <h3 class="text-2xl font-bold text-white">{{ config.textContent.ctvTitle }}</h3>
              </div>
            </div>

            <!-- Thông tin thêm -->
            <div class="grid grid-cols-2 gap-4 mt-8">
              <div class="stats-card">
                <div class="stats-icon bg-blue-500/10 text-blue-400">
                  <i :class="config.icons.userPlus"></i>
                </div>
                <p class="text-2xl font-bold text-white">{{ config.stats.newCTV }}</p>
                <p class="text-slate-400 text-sm">{{ config.textContent.newCTVLabel }}</p>
              </div>

              <div class="stats-card">
                <div class="stats-icon bg-purple-500/10 text-purple-400">
                  <i :class="config.icons.moneyCheck"></i>
                </div>
                <p class="text-2xl font-bold text-white">{{ config.stats.paymentAmount }}</p>
                <p class="text-slate-400 text-sm">{{ config.textContent.paymentLabel }}</p>
              </div>
            </div>
            <div class="flex justify-center">
              <div
                  class="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mt-6">
                <i :class="`${config.icons.bullhorn} text-blue-400 mr-2`"></i><span
                  class="text-blue-400 text-sm font-bold uppercase tracking-widest">{{ config.textContent.hiringBadge }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div
          class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-400 hidden lg:block">
        <i :class="`${config.icons.chevronDown} w-6 h-6`"></i>
      </div>
    </section>

    <!-- VỊ TRÍ TUYỂN DỤNG -->
    <section id="jobs" class="py-24 bg-brand-dark relative overflow-hidden">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{{ config.textContent.jobsSection.subtitle }}</h2>
          <h3 class="text-4xl font-display font-bold text-white mb-4">
            {{ config.textContent.jobsSection.title }}
            <span class="text-gradient">{{ config.textContent.jobsSection.highlight }}</span>
          </h3>
          <div class="section-divider"></div>
          <p class="max-w-2xl mx-auto text-slate-400 mt-6">
            {{ config.textContent.jobsSection.description }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SimpleGlassCard
              v-for="(job, index) in config.data.jobs"
              :key="job.id"
              :data-aos="'fade-up'"
              :data-aos-delay="index * 100"
              :title="job.title"
              :description="job.description"
              :icon="job.icon"
              :color="job.color"
              :price="job.price"
              :unit="job.unit"
              :listTags="job.tags"
              :link="job.link"
              :linkText="job.linkText"
          />
        </div>

        <div class="text-center mt-12" data-aos="fade-up" data-aos-delay="700">
          <a href="#application" class="btn-gradient inline-block">
            <i :class="`${config.icons.briefcase} mr-2`"></i> {{ config.textContent.jobsSection.applyButton }}
          </a>
          <p class="text-slate-400 text-sm mt-4">{{ config.textContent.jobsSection.note }}</p>
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
          <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{{ config.textContent.benefitsSection.subtitle }}</h2>
          <h3 class="text-4xl font-display font-bold text-white mb-4">
            {{ config.textContent.benefitsSection.title }}
            <span class="text-gradient">{{ config.textContent.benefitsSection.highlight }}</span>
          </h3>
          <div class="section-divider"></div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <GlassCard
              v-for="(benefit, index) in config.data.benefits"
              :key="index"
              :title="benefit.title"
              :iconName="benefit.iconName"
              :color="benefit.color"
              :padding="'medium'"
              :hoverEffect="true"
              :aos="'fade-up'"
              :aosDelay="benefit.aosDelay"
              :gradient-class-icon="true"
          >
            {{ benefit.description }}
          </GlassCard>
        </div>

        <!-- QUY TRÌNH LÀM VIỆC DẠNG DỌC -->
        <div class="mt-16 max-w-4xl mx-auto" data-aos="fade-up">
          <h4 class="text-2xl font-bold text-white text-center mb-12">{{ config.textContent.workflowSection.title }}</h4>

          <div class="vertical-timeline">
            <!-- Bước 1 -->
            <div class="timeline-step step-1" data-aos="fade-right" data-aos-delay="100">
              <div class="step-number">1</div>
              <div class="step-content">
                <h5 class="text-xl font-bold text-white mb-3 flex items-center">
                  <span class="mr-2">{{ config.textContent.workflowSection.step1.title }}</span>
                  <span class="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">{{ config.textContent.workflowSection.step1.badge }}</span>
                </h5>
                <p class="text-slate-300 mb-4">
                  {{ config.textContent.workflowSection.step1.description }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in config.textContent.workflowSection.step1.tags"
                        :key="tag"
                        class="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">{{ tag }}</span>
                </div>
              </div>
            </div>

            <!-- Bước 2 -->
            <div class="timeline-step step-2" data-aos="fade-right" data-aos-delay="200">
              <div class="step-number">2</div>
              <div class="step-content">
                <h5 class="text-xl font-bold text-white mb-3 flex items-center">
                  <span class="mr-2">{{ config.textContent.workflowSection.step2.title }}</span>
                  <span class="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">{{ config.textContent.workflowSection.step2.badge }}</span>
                </h5>
                <p class="text-slate-300 mb-4">
                  {{ config.textContent.workflowSection.step2.description }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in config.textContent.workflowSection.step2.tags"
                        :key="tag"
                        class="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full">{{ tag }}</span>
                </div>
              </div>
            </div>

            <!-- Bước 3 -->
            <div class="timeline-step step-3" data-aos="fade-right" data-aos-delay="300">
              <div class="step-number">3</div>
              <div class="step-content">
                <h5 class="text-xl font-bold text-white mb-3 flex items-center">
                  <span class="mr-2">{{ config.textContent.workflowSection.step3.title }}</span>
                  <span class="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">{{ config.textContent.workflowSection.step3.badge }}</span>
                </h5>
                <p class="text-slate-300 mb-4">
                  {{ config.textContent.workflowSection.step3.description }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in config.textContent.workflowSection.step3.tags"
                        :key="tag"
                        class="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full">{{ tag }}</span>
                </div>
              </div>
            </div>

            <!-- Bước 4 -->
            <div class="timeline-step step-4" data-aos="fade-right" data-aos-delay="400">
              <div class="step-number">4</div>
              <div class="step-content">
                <h5 class="text-xl font-bold text-white mb-3 flex items-center">
                  <span class="mr-2">{{ config.textContent.workflowSection.step4.title }}</span>
                  <span class="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full">{{ config.textContent.workflowSection.step4.badge }}</span>
                </h5>
                <p class="text-slate-300 mb-4">
                  {{ config.textContent.workflowSection.step4.description }}
                </p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in config.textContent.workflowSection.step4.tags"
                        :key="tag"
                        class="text-xs bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-400 px-3 py-1 rounded-full">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-12" data-aos="fade-up" data-aos-delay="500">
            <a href="#application" class="btn-gradient inline-block">
              <i :class="`${config.icons.playCircle} mr-2`"></i> {{ config.textContent.workflowSection.ctaButton }}
            </a>
            <p class="text-slate-400 text-sm mt-4">{{ config.textContent.workflowSection.ctaNote }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TRẢI NGHIỆM CTV -->
    <section class="py-24 bg-brand-dark relative overflow-hidden">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16" data-aos="fade-up">
          <h2 class="text-sm font-bold text-blue-500 uppercase tracking-widest mb-2">{{ config.textContent.testimonialsSection.subtitle }}</h2>
          <h3 class="text-4xl font-display font-bold text-white mb-4">
            {{ config.textContent.testimonialsSection.title }}
            <span class="text-gradient">{{ config.textContent.testimonialsSection.highlight }}</span>
          </h3>
          <div class="section-divider"></div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
              v-for="(testimonial, index) in config.data.testimonials"
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
          <div class="text-center" data-aos="fade-up" data-aos-delay="100">
            <p class="counter count-up" :data-count="config.stats.ctv">{{ displayStats.ctv }}</p>
            <p class="text-slate-400 text-sm uppercase tracking-widest">{{ config.textContent.stats.ctvLabel }}</p>
          </div>

          <div class="text-center" data-aos="fade-up" data-aos-delay="200">
            <p class="counter count-up" :data-count="config.stats.payment">{{ displayStats.payment }}</p>
            <p class="text-slate-400 text-sm uppercase tracking-widest">{{ config.textContent.stats.paymentLabel }}</p>
          </div>

          <div class="text-center" data-aos="fade-up" data-aos-delay="300">
            <p class="counter count-up" :data-count="config.stats.satisfaction">{{ displayStats.satisfaction }}</p>
            <p class="text-slate-400 text-sm uppercase tracking-widest">{{ config.textContent.stats.satisfactionLabel }}</p>
          </div>

          <div class="text-center" data-aos="fade-up" data-aos-delay="400">
            <p class="counter count-up" :data-count="config.stats.provinces">{{ displayStats.provinces }}</p>
            <p class="text-slate-400 text-sm uppercase tracking-widest">{{ config.textContent.stats.provincesLabel }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FORM ĐĂNG KÝ -->
    <section id="application" class="py-24 bg-gradient-to-br from-slate-900 to-blue-900/30 relative overflow-hidden">
      <div class="container mx-auto px-6">
        <div class="mx-auto">
          <div class="text-center mb-16" data-aos="fade-up">
            <h2 class="text-4xl font-display font-bold text-white mb-6">{{ config.textContent.formSection.title }}</h2>
            <p class="text-slate-300 mb-10">
              {{ config.textContent.formSection.description }}
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-12">
            <!-- Form đăng ký -->
            <div class="glass-card p-8" data-aos="fade-right">
              <h3 class="text-2xl font-bold text-white mb-6">{{ config.textContent.formSection.formTitle }}</h3>

              <form @submit.prevent="submitForm">
                <div class="mb-6">
                  <label class="block text-slate-300 mb-2">{{ config.textContent.formSection.labels.name }}</label>
                  <input v-model="formData.name" type="text" class="form-input" :placeholder="config.textContent.formSection.placeholders.name" required>
                </div>

                <div class="mb-6">
                  <label class="block text-slate-300 mb-2">{{ config.textContent.formSection.labels.phone }}</label>
                  <input v-model="formData.phone" type="tel" class="form-input" :placeholder="config.textContent.formSection.placeholders.phone" required>
                </div>

                <div class="mb-6">
                  <label class="block text-slate-300 mb-2">{{ config.textContent.formSection.labels.email }}</label>
                  <input v-model="formData.email" type="email" class="form-input" :placeholder="config.textContent.formSection.placeholders.email">
                </div>

                <div class="mb-6">
                  <label class="block text-slate-300 mb-2">{{ config.textContent.formSection.labels.location }}</label>
                  <input v-model="formData.location" type="text" class="form-input"
                         :placeholder="config.textContent.formSection.placeholders.location" required>
                </div>

                <div class="mb-6">
                  <label class="block text-slate-300 mb-2">{{ config.textContent.formSection.labels.position }}</label>
                  <select v-model="formData.position" class="form-input" required>
                    <option value="">{{ config.textContent.formSection.positionPlaceholder }}</option>
                    <option v-for="position in config.data.positionOptions" :value="position.value">{{ position.label }}</option>
                  </select>
                </div>

                <div class="mb-6">
                  <label class="block text-slate-300 mb-2">{{ config.textContent.formSection.labels.workTime }}</label>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center">
                      <input v-model="formData.workTime.weekday" type="checkbox" id="weekday" class="mr-2">
                      <label for="weekday" class="text-slate-300">{{ config.textContent.formSection.workTimeOptions.weekday }}</label>
                    </div>
                    <div class="flex items-center">
                      <input v-model="formData.workTime.weekend" type="checkbox" id="weekend" class="mr-2">
                      <label for="weekend" class="text-slate-300">{{ config.textContent.formSection.workTimeOptions.weekend }}</label>
                    </div>
                    <div class="flex items-center">
                      <input v-model="formData.workTime.morning" type="checkbox" id="morning" class="mr-2">
                      <label for="morning" class="text-slate-300">{{ config.textContent.formSection.workTimeOptions.morning }}</label>
                    </div>
                    <div class="flex items-center">
                      <input v-model="formData.workTime.afternoon" type="checkbox" id="afternoon" class="mr-2">
                      <label for="afternoon" class="text-slate-300">{{ config.textContent.formSection.workTimeOptions.afternoon }}</label>
                    </div>
                  </div>
                </div>

                <button type="submit" class="btn-gradient w-full">
                  <i :class="`${config.icons.paperPlane} mr-2`"></i> {{ config.textContent.formSection.submitButton }}
                </button>

                <p class="text-slate-400 text-xs mt-4">
                  {{ config.textContent.formSection.termsText.prefix }} <a href="#" class="text-blue-400">{{ config.textContent.formSection.termsText.link }}</a> {{ config.textContent.formSection.termsText.suffix }}
                </p>
              </form>
            </div>

            <!-- Thông tin hỗ trợ -->
            <div class="glass-card p-8 flex justify-center flex-col" data-aos="fade-left">
              <h3 class="text-2xl font-bold text-white mb-6 text-center">{{ config.textContent.supportSection.title }}</h3>

              <div class="mb-8">
                <div class="flex items-start mb-6">
                  <div class="bg-blue-500/10 p-3 rounded-lg mr-4">
                    <i :class="`${config.icons.phone} text-blue-400`"></i>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white mb-1">{{ config.textContent.supportSection.hotline.title }}</h4>
                    <p class="text-slate-300 text-xl font-bold mb-1">
                      {{ config.textContent.supportSection.hotline.number }}</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="bg-emerald-500/10 p-3 rounded-lg mr-4">
                    <i :class="`${config.icons.envelope} text-emerald-400`"></i>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white mb-1">{{ config.textContent.supportSection.email.title }}</h4>
                    <p class="text-slate-300 mb-1">{{ config.textContent.supportSection.email.address }}</p>
                    <p class="text-slate-400 text-sm">{{ config.textContent.supportSection.email.responseTime }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-slate-800/50 p-6 rounded-lg mb-8">
                <h4 class="text-lg font-bold text-white mb-4">{{ config.textContent.supportSection.importantNotes.title }}</h4>
                <ul class="space-y-3">
                  <li class="flex items-start" v-for="note in config.textContent.supportSection.importantNotes.list" :key="note">
                    <i :class="`${config.icons.check} text-emerald-400 mt-1 mr-3`"></i>
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

// Config object - KHÔNG CHỨA HTML
const config = reactive({
  textContent: {
    heroTitle: "Cơ Hội Việc Làm",
    heroTitleHighlight: "Linh Hoạt 1-2 Tiếng/Lần",
    companyName: "Thiên Hà Group",
    heroDescription: "đang tuyển Cộng Tác Viên bất động sản trên toàn quốc. Bạn có thể làm việc linh hoạt chỉ với 1-2 tiếng mỗi lần, không yêu cầu kinh nghiệm, thu nhập hấp dẫn từ 200K - 500K cho mỗi nhiệm vụ hoàn thành.",
    earningsBadge: "THU NHẬP HẤP DẪN",
    earningsAmount: "200K - 500K",
    earningsUnit: "Mỗi nhiệm vụ hoàn thành",
    bonusText: "+ Thưởng hiệu suất",
    commissionText: "+ Hoa hồng theo giao dịch",
    applyButton: "Đăng Ký Ngay",
    viewJobsButton: "Xem Vị Trí Tuyển Dụng",
    quickInfo: {
      flexibleTime: "Linh hoạt thời gian",
      workFromHome: "Làm việc tại nhà",
      noExperience: "Không yêu cầu kinh nghiệm",
      fastPayment: "Thanh toán nhanh 24h"
    },
    ctvCountText: "Hơn 5,000 CTV đang hợp tác",
    ctvTitle: "Gia nhập đội ngũ CTV hàng đầu Việt Nam",
    newCTVLabel: "CTV mới mỗi tháng",
    paymentLabel: "Thanh toán cho CTV/năm",
    hiringBadge: "ĐANG TUYỂN CỘNG TÁC VIÊN",

    jobsSection: {
      subtitle: "Vị Trí Tuyển Dụng",
      title: "Các Công Việc",
      highlight: "CTV Đang Cần Tuyển",
      description: "Thiên Hà Group cần tuyển hàng trăm CTV cho các vị trí khác nhau tại 63 tỉnh thành. Bạn có thể lựa chọn công việc phù hợp với thời gian và kỹ năng của mình.",
      applyButton: "Đăng Ký Ngay!",
      note: "*Nhận ngay để nhận phản hồi nhanh nhất từ Thiên Hà Group"
    },

    benefitsSection: {
      subtitle: "Lợi Ích Khi Làm CTV",
      title: "Tại Sao Nên Làm Cộng Tác Viên Tại",
      highlight: "Thiên Hà Group?"
    },

    workflowSection: {
      title: "Quy Trình Làm Việc Của CTV",
      step1: {
        title: "Đăng Ký & Đào Tạo",
        badge: "Bắt đầu",
        description: "Đăng ký online chỉ trong 5 phút. Sau đó, tham gia khóa đào tạo miễn phí 2 buổi được thiết kế riêng cho CTV mới. Bạn sẽ được hướng dẫn chi tiết về quy trình làm việc và các công cụ hỗ trợ.",
        tags: ["Đăng ký online", "Đào tạo miễn phí", "Hỗ trợ 1:1"]
      },
      step2: {
        title: "Nhận Nhiệm Vụ",
        badge: "Lựa chọn",
        description: "Truy cập vào ứng dụng Thiên Hà Group để xem danh sách nhiệm vụ có sẵn. Lựa chọn công việc phù hợp với thời gian và kỹ năng của bạn. Mỗi nhiệm vụ đều có mô tả chi tiết, yêu cầu cụ thể và mức thù lao rõ ràng.",
        tags: ["App thông minh", "Đa dạng nhiệm vụ", "Lựa chọn linh hoạt"]
      },
      step3: {
        title: "Thực Hiện Công Việc",
        badge: "Hành động",
        description: "Thực hiện nhiệm vụ trong thời gian linh hoạt 1-2 tiếng. Trong quá trình làm việc, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc 24/7 qua điện thoại, Zalo hoặc email.",
        tags: ["Linh hoạt thời gian", "Hỗ trợ 24/7", "Công cụ hỗ trợ"]
      },
      step4: {
        title: "Nộp Kết Quả & Nhận Thanh Toán",
        badge: "Hoàn thành",
        description: "Nộp kết quả công việc qua ứng dụng. Hệ thống sẽ tự động xét duyệt trong vòng 2 giờ và thanh toán vào ví điện tử hoặc tài khoản ngân hàng của bạn trong vòng 24 giờ. Bạn cũng có thể theo dõi lịch sử thanh toán chi tiết trên app.",
        tags: ["Duyệt tự động", "Thanh toán 24h", "Theo dõi thu nhập"]
      },
      ctaButton: "Bắt Đầu Ngay Từ Bước 1",
      ctaNote: "Hoàn thành 4 bước đơn giản để bắt đầu kiếm thu nhập ngay hôm nay"
    },

    testimonialsSection: {
      subtitle: "Trải Nghiệm Thực Tế",
      title: "CTV Nói Gì Về",
      highlight: "Thiên Hà Group?"
    },

    stats: {
      ctvLabel: "CTV Đang Hợp Tác",
      paymentLabel: "Tỷ Thanh Toán/Năm",
      satisfactionLabel: "% Hài Lòng",
      provincesLabel: "Tỉnh Thành Phủ Sóng"
    },

    formSection: {
      title: "Đăng Ký Làm Cộng Tác Viên Ngay",
      description: "Điền thông tin đăng ký để nhận tư vấn chi tiết về công việc phù hợp với bạn. Chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc.",
      formTitle: "Thông Tin Đăng Ký",
      labels: {
        name: "Họ và tên *",
        phone: "Số điện thoại *",
        email: "Email",
        location: "Khu vực sinh sống *",
        position: "Bạn quan tâm vị trí nào? *",
        workTime: "Thời gian có thể làm việc *"
      },
      placeholders: {
        name: "Nguyễn Văn A",
        phone: "0900 123 456",
        email: "email@example.com",
        location: "Quận/Huyện, Tỉnh/Thành phố"
      },
      positionPlaceholder: "Chọn vị trí quan tâm",
      workTimeOptions: {
        weekday: "Ngày thường",
        weekend: "Cuối tuần",
        morning: "Buổi sáng",
        afternoon: "Buổi chiều"
      },
      submitButton: "Gửi Đăng Ký Ngay",
      termsText: {
        prefix: "Bằng việc đăng ký, bạn đồng ý với",
        link: "Điều khoản & Chính sách",
        suffix: "của Thiên Hà Group."
      }
    },

    supportSection: {
      title: "Hỗ Trợ & Tư Vấn",
      hotline: {
        title: "Hotline Tuyển Dụng",
        number: "091.123.1882"
      },
      email: {
        title: "Email Tuyển Dụng",
        address: "thienhagroup@gmail.com",
        responseTime: "(Phản hồi trong 2h)"
      },
      importantNotes: {
        title: "Lưu ý quan trọng",
        list: [
          "Không yêu cầu kinh nghiệm, đào tạo từ đầu",
          "Không thu bất kỳ khoản phí nào",
          "Thanh toán nhanh trong 24h sau khi hoàn thành",
          "Làm việc tại nhà, không cần đến văn phòng"
        ]
      }
    }
  },

  colors: {
    blue400: 'var(--color-blue-400)',
    blue500: 'var(--color-blue-500)',
    purple500: 'var(--color-purple-500)',
    purple600: 'var(--color-purple-600)',
    emerald400: 'var(--color-emerald-400)',
    emerald500: 'var(--color-emerald-500)',
    slate300: 'var(--color-slate-300)',
    slate400: 'var(--color-slate-400)',
    slate900: 'var(--color-slate-900)'
  },

  gradients: {
    text: 'linear-gradient(90deg, var(--color-blue-400), var(--color-purple-500))',
    button: 'linear-gradient(90deg, var(--color-blue-500), var(--color-purple-600))',
    hero: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
    earningsBadge: 'linear-gradient(90deg, var(--color-emerald-500), var(--color-blue-500), var(--color-emerald-500))'
  },

  icons: {
    paperPlane: 'fas fa-paper-plane',
    search: 'fas fa-search',
    clock: 'fas fa-clock',
    mapMarker: 'fas fa-map-marker-alt',
    graduationCap: 'fas fa-graduation-cap',
    moneyBill: 'fas fa-money-bill-wave',
    userPlus: 'fas fa-user-plus',
    moneyCheck: 'fas fa-money-check-alt',
    bullhorn: 'fas fa-bullhorn',
    chevronDown: 'fas fa-chevron-down',
    briefcase: 'fas fa-briefcase',
    playCircle: 'fas fa-play-circle',
    phone: 'fas fa-phone-alt',
    envelope: 'fas fa-envelope',
    check: 'fas fa-check'
  },

  images: {
    heroImage: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  },

  stats: {
    newCTV: "1,200+",
    paymentAmount: "8.2 tỷ",
    ctv: 5200,
    payment: 8.2,
    satisfaction: 98,
    provinces: 34
  },

  data: {
    jobs: [
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

    benefits: [
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
    ],

    testimonials: [
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
    ],

    positionOptions: [
      { value: 'photographer', label: 'CTV Chụp Ảnh BĐS' },
      { value: 'survey', label: 'CTV Khảo Sát Thị Trường' },
      { value: 'referral', label: 'CTV Giới Thiệu Khách Hàng' },
      { value: 'data', label: 'CTV Nhập Liệu BĐS' },
      { value: 'video', label: 'CTV Quay Video 360°' },
      { value: 'consultant', label: 'CTV Tư Vấn Online' }
    ]
  }
})

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

// Computed display stats for counter
const displayStats = computed(() => ({
  ctv: 0,
  payment: 0,
  satisfaction: 0,
  provinces: 0
}))

// Methods (giữ nguyên như cũ)
const submitForm = () => {
  if (formData.phone.length < 10) {
    alert('Vui lòng nhập số điện thoại hợp lệ')
    return
  }

  alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 2 giờ làm việc.')

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

// Lifecycle hooks (giữ nguyên như cũ)
onMounted(() => {
  if (window.AOS) {
    window.AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    })
  }

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
  background-color: var(--color-slate-900);
  color: white;
  overflow-x: hidden;
}

.font-display {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
}

.bg-brand-dark {
  background-color: var(--color-slate-900);
}

.text-gradient {
  background: linear-gradient(90deg, var(--color-blue-400), var(--color-purple-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.bg-hero-pattern {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%),
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
  background: linear-gradient(90deg, var(--color-blue-500), var(--color-purple-600));
  border-radius: 2px;
  margin: 0 auto;
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
  border-color: var(--color-blue-500);
  color: var(--color-blue-400);
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
  background: var(--color-blue-600);
  border-radius: 4px;
}

/* Hiệu ứng cho số liệu thống kê */
.counter {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(90deg, var(--color-blue-400), var(--color-purple-500));
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
  border-radius: 20px;
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
  background: linear-gradient(90deg, var(--color-blue-500), var(--color-purple-500));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease;
}

/* HIỆU ỨNG HOVER MỚI - DỄ ĐỌC CHỮ */
.job-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border-color: rgba(59, 130, 246, 0.3);
  background: linear-gradient(145deg, rgba(20, 28, 47, 0.95), rgba(35, 46, 69, 0.95));
}

.job-card:hover::before {
  transform: scaleX(1);
}

.job-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
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
  background: linear-gradient(to bottom, var(--color-blue-500), var(--color-purple-500));
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
  background: var(--color-slate-900);
  border: 4px solid var(--color-blue-500);
  z-index: 1;
}

.timeline-step.completed::before {
  background: var(--color-blue-500);
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
  border-radius: 16px;
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
  border-radius: 16px;
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
  background: linear-gradient(90deg, var(--color-emerald-500), var(--color-blue-500), var(--color-emerald-500));
  background-size: 200% 100%;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
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
  border-radius: 16px;
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
  border: 2px solid var(--color-blue-500);
}

/* Form styling */
.form-input {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  width: 100%;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-blue-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Tag styling */
.job-tag {
  background: rgba(59, 130, 246, 0.15);
  color: var(--color-blue-300);
  padding: 6px 12px;
  border-radius: 20px;
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
  border-radius: 16px;
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
  border-radius: 12px;
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
  color: var(--color-emerald-400);
  font-weight: 700;
  transition: color 0.3s ease;
}

.job-description {
  color: var(--color-slate-300);
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
  border-radius: 20px;
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
  background: linear-gradient(135deg, var(--color-blue-500), var(--color-purple-500));
  color: white;
}

.step-2 .step-number {
  background: linear-gradient(135deg, var(--color-purple-500), var(--color-emerald-500));
  color: white;
}

.step-3 .step-number {
  background: linear-gradient(135deg, var(--color-emerald-500), var(--color-blue-500));
  color: white;
}

.step-4 .step-number {
  background: linear-gradient(135deg, var(--color-blue-500), var(--color-emerald-500), var(--color-purple-500));
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

/* Glass card styling */
/* Additional utility classes */
.text-blue-400 {
  color: var(--color-blue-400);
}

.text-purple-400 {
  color: var(--color-purple-400);
}

.text-emerald-400 {
  color: var(--color-emerald-400);
}

.text-slate-300 {
  color: var(--color-slate-300);
}

.text-slate-400 {
  color: var(--color-slate-400);
}

.bg-blue-500\/10 {
  background-color: rgba(59, 130, 246, 0.1);
}

.bg-purple-500\/10 {
  background-color: rgba(139, 92, 246, 0.1);
}

.bg-emerald-500\/10 {
  background-color: rgba(16, 185, 129, 0.1);
}

.border-blue-500\/20 {
  border-color: rgba(59, 130, 246, 0.2);
}
</style>