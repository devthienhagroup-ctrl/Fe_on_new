<template>
  <div class="pricing-page">
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="bg-blur-circle w-96 h-96" :style="{ backgroundColor: config.css.purple500, top: '20px', left: '10px' }"></div>
      <div class="bg-blur-circle w-80 h-80"
           :style="{ backgroundColor: config.css.pink500, bottom: '40px', right: '10px', 'animation-delay': '2s' }"></div>
      <div class="bg-blur-circle w-64 h-64"
           :style="{ backgroundColor: config.css.blue500, top: '50%', left: '33%', 'animation-delay': '4s' }"></div>
    </div>

    <!-- Quick Navigation Menu (Floating Right) -->
    <div id="quickNav"
         class="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 flex flex-col items-center space-y-2 gap-12 transition-all duration-300">
      <!-- Line connecting dots -->
      <div
          class="absolute h-[calc(100%-4rem)] w-0.5 bg-gradient-to-b from-purple-500/30 via-pink-500/30 to-amber-500/30 left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2"></div>

      <!-- Plus Package -->
      <a href="#plus-package" class="quick-nav-item group" data-package="plus"
         :class="{ 'active': activePackage === 'plus' }"
         @click.prevent="scrollToSection('plus-package')">
        <div
            class="w-10 h-10 rounded-full glass-card-custom flex items-center justify-center transition-all duration-300 group-hover:w-auto group-hover:px-4 group-hover:rounded-xl group-hover:bg-blue-500/20 group-hover:border-blue-500/50">
          <i :class="`${config.packages.plus.icon} text-blue-400 text-sm ${activePackage === 'plus'? 'fa-flip !text-xl' : ''}`"></i>
          <span
              class="text-xs font-semibold text-slate-50 ml-2 hidden group-hover:block transition-opacity duration-300 whitespace-nowrap">{{ config.packages.plus.name }}</span>
        </div>
      </a>

      <!-- Pro Package -->
      <a href="#pro-package" class="quick-nav-item group" data-package="pro"
         :class="{ 'active': activePackage === 'pro' }"
         @click.prevent="scrollToSection('pro-package')">
        <div
            class="w-12 h-12 rounded-full gradient-bg flex items-center justify-center transition-all duration-300 group-hover:w-auto group-hover:px-4 group-hover:rounded-xl group-hover:bg-gradient-to-r group-hover:from-purple-500/30 group-hover:to-pink-500/30 group-hover:border-purple-500/50 border-2 border-transparent">
          <i :class="`${config.packages.pro.icon} text-slate-50 text-sm ${activePackage === 'pro'? 'fa-flip !text-xl' : ''}`"></i>
          <span
              class="text-xs font-semibold text-slate-50 ml-2 hidden group-hover:block transition-opacity duration-300 whitespace-nowrap">{{ config.packages.pro.name }}</span>
        </div>
      </a>

      <!-- Premium Package -->
      <a href="#premium-package" class="quick-nav-item group" data-package="premium"
         :class="{ 'active': activePackage === 'premium' }"
         @click.prevent="scrollToSection('premium-package')">
        <div
            class="w-10 h-10 rounded-full glass-card-custom flex items-center justify-center transition-all duration-300 group-hover:w-auto group-hover:px-4 group-hover:rounded-xl group-hover:bg-amber-500/20 group-hover:border-amber-500/50">
          <i :class="`${config.packages.premium.icon} text-amber-400 text-sm ${activePackage === 'premium'? 'fa-flip !text-xl' : ''}`"></i>
          <span
              class="text-xs font-semibold text-slate-50 ml-2 hidden group-hover:block transition-opacity duration-300 whitespace-nowrap">{{ config.packages.premium.name }}</span>
        </div>
      </a>
    </div>

    <section class="pt-32 pb-20 lg:pt-40 lg:pb-32 first-section relative overflow-hidden">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
            <!-- Left Content -->
            <div data-aos="fade-right" data-aos-delay="200">
              <div class="inline-flex items-center px-4 py-2 rounded-full glass-card-custom mb-8 border border-purple-500/30">
                <i :class="config.hero.badge.icon"></i>
                <span class="text-sm font-semibold text-purple-300">{{ config.hero.badge.text }}</span>
              </div>

              <h1 class="text-5xl font-bold text-slate-50 mb-8 leading-tight">
                {{ config.hero.title.line1 }}
                <span class="gradient-text block">{{ config.hero.title.line2 }}</span>
              </h1>

              <!-- Mô tả dài hơn -->
              <p class="text-lg text-slate-300 mb-10 leading-relaxed max-w-2xl text-justify">
                {{ config.hero.description }}
              </p>

              <div class="flex items-center space-x-6">
                <div class="flex items-center">
                  <div class="flex -space-x-2 mr-3">
                    <div
                        class="w-8 h-8 rounded-full border-2 border-darker bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <div
                        class="w-8 h-8 rounded-full border-2 border-darker bg-gradient-to-r from-blue-500 to-emerald-500"></div>
                    <div
                        class="w-8 h-8 rounded-full border-2 border-darker bg-gradient-to-r from-amber-500 to-pink-500"></div>
                  </div>
                  <div>
                    <div class="text-slate-50 font-bold">{{ config.hero.stats.users.count }}</div>
                    <div class="text-sm text-slate-400">{{ config.hero.stats.users.label }}</div>
                  </div>
                </div>
                <div class="h-10 w-px bg-white/10"></div>
                <div class="flex items-center">
                  <i :class="config.hero.stats.security.icon"></i>
                  <div>
                    <div class="text-slate-50 font-bold">{{ config.hero.stats.security.title }}</div>
                    <div class="text-sm text-slate-400">{{ config.hero.stats.security.description }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right - 3 Package Cards -->
            <div data-aos="fade-left" data-aos-delay="400" class="relative h-full w-full">
              <!-- Gói Plus Card - Vị trí trên cùng, lệch trái -->
              <a href="#plus-package"
                 class="block absolute top-0 left-0 w-10/12 z-10 transform hover:-translate-y-2 transition-all duration-300"
                 @click.prevent="scrollToSection('plus-package')">
                <div
                    class="package-preview-card glass-card-custom rounded-3xl p-6 border-2 border-white/10 hover:border-blue-500/50 transition-all duration-300">
                  <div class="flex items-center gap-4">
                    <div
                        class="w-14 h-14 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <i :class="config.packages.plus.icon + ' text-slate-50 text-xl'"></i>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-slate-50">{{ config.packages.plus.fullName }}</h3>
                      <p class="text-sm text-slate-400">{{ config.packages.plus.tagline }}</p>
                    </div>
                  </div>
                  <p class="text-slate-300 text-sm mt-3 mb-0">
                    {{ config.packages.plus.previewDescription }}
                  </p>
                  <div class="flex items-center justify-between mt-3">
                    <span class="text-blue-400 text-sm font-semibold">{{ config.packages.plus.features[0] }}</span>
                    <span class="text-blue-300 text-sm font-medium">{{ config.buttons.viewDetails }}</span>
                  </div>
                </div>
              </a>

              <!-- Gói Pro Card - Vị trí giữa, chính giữa, nổi bật -->
              <a href="#pro-package"
                 class="block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-20 transition-all duration-300 hover:-translate-y-1/2 hover:-translate-x-1/2 lg:max-w-md md:max-w-full"
                 @click.prevent="scrollToSection('pro-package')">
                <div
                    class="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-slate-50 text-xs font-bold px-3 py-1 rounded-full animate-pulse z-20">
                  {{ config.packages.pro.badge }}
                </div>
                <div
                    class="package-preview-card glass-card-custom rounded-3xl p-8 border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300 pro-highlight hover:transform hover:translate-y-0">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                      <i :class="config.packages.pro.icon + ' text-slate-50 text-2xl'"></i>
                    </div>
                    <div>
                      <h3 class="text-2xl font-bold text-slate-50 mb-0">{{ config.packages.pro.fullName }}</h3>
                      <div
                          class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
                        <span class="text-xs font-semibold text-purple-300">{{ config.packages.pro.subBadge }}</span>
                      </div>
                    </div>
                  </div>
                  <p class="text-slate-300 text-sm mt-3 mb-0">
                    {{ config.packages.pro.previewDescription }}
                    <span class="block mt-2 text-purple-300 font-medium">{{ config.packages.pro.stats }}</span>
                  </p>
                  <div class="flex items-center justify-between mt-3">
                    <span class="text-purple-400 text-sm font-semibold">{{ config.packages.pro.features[0] }}</span>
                    <span class="text-purple-300 text-sm font-medium">{{ config.buttons.viewDetails }}</span>
                  </div>
                </div>
              </a>

              <!-- Gói Premium Card - Vị trí dưới cùng, lệch phải -->
              <a href="#premium-package"
                 class="block absolute bottom-0 right-0 w-10/12 z-10 transform hover:-translate-y-2 transition-all duration-300"
                 @click.prevent="scrollToSection('premium-package')">
                <div
                    class="package-preview-card glass-card-custom rounded-3xl p-6 border-2 border-white/10 hover:border-amber-500/50 transition-all duration-300">
                  <div class="flex items-center gap-4">
                    <div
                        class="w-14 h-14 bg-gradient-to-r from-amber-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <i :class="config.packages.premium.icon + ' text-slate-50 text-xl'"></i>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-slate-50">{{ config.packages.premium.fullName }}</h3>
                      <p class="text-sm text-slate-400">{{ config.packages.premium.tagline }}</p>
                    </div>
                  </div>
                  <p class="text-slate-300 text-sm mt-3 mb-0">
                    {{ config.packages.premium.previewDescription }}
                  </p>
                  <div class="flex items-center justify-between mt-3">
                    <span class="text-amber-400 text-sm font-semibold">{{ config.packages.premium.features[0] }}</span>
                    <span class="text-amber-300 text-sm font-medium">{{ config.buttons.viewDetails }}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section id="features" class="py-20 lg:py-32 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center max-w-4xl mx-auto mb-20" data-aos="fade-up">
          <h2 class="text-4xl md:text-5xl font-bold text-slate-50 mb-6">
            {{ config.benefits.title.line1 }}
            <span class="gradient-text">{{ config.benefits.title.line2 }}</span>
          </h2>
          <p class="text-xl text-slate-300">
            {{ config.benefits.subtitle }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Benefit 1 -->
          <GlassCard
              v-for="(benefit, index) in config.benefits.items"
              :key="index"
              :title="benefit.title"
              :iconName="benefit.icon"
              :color="benefit.color"
              padding="medium"
              :hoverEffect="true"
              :aos="'fade-up'"
              :aosDelay="index * 100"
              :statNumber="benefit.stat.number"
              :statLabel="benefit.stat.label"
              :gradient-class-icon="true"
          >
            <template #default>
              <p class="text-slate-300">{{ benefit.description }}</p>
            </template>
          </GlassCard>
        </div>
      </div>
    </section>

    <!-- Gói Plus Detail Section -->
    <section id="plus-package" class="package-detail-section" ref="plusSection">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <!-- Package Header -->
          <div class="text-center mb-16" data-aos="fade-up">
            <div
                class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-blue-500/30 mb-6">
              <i :class="config.packages.plus.icon + ' text-blue-400 mr-2'"></i>
              <span class="text-sm font-semibold text-blue-300">{{ config.packages.plus.detailBadge }}</span>
            </div>
            <h2 class="text-4xl md:text-5xl font-bold text-slate-50 mb-6">
              Gói <span class="text-blue-400">{{ config.packages.plus.detailTitle }}</span>
              <span class="block text-xl text-slate-400 mt-4">{{ config.packages.plus.price }}</span>
            </h2>
            <p class="text-xl text-slate-300 max-w-3xl mx-auto">
              {{ config.packages.plus.detailDescription }}
              <span class="text-blue-300 font-semibold">{{ config.packages.plus.highlight }}</span>
            </p>
          </div>

          <div class="grid lg:grid-cols-2 gap-12">
            <!-- Left: Package Details -->
            <div data-aos="fade-right">
              <div class="glass-card-custom rounded-3xl p-8 mb-8">
                <h3 class="text-2xl font-bold text-slate-50 mb-6">{{ config.packages.plus.sections.target.title }}</h3>
                <ul class="space-y-4">
                  <li v-for="(item, index) in config.packages.plus.sections.target.items" :key="index" class="flex items-start">
                    <i :class="config.packages.plus.sections.target.icon + ' text-blue-400 mt-1 mr-3'"></i>
                    <span class="text-slate-300">{{ item }}</span>
                  </li>
                </ul>
              </div>

              <div class="glass-card-custom rounded-3xl p-8">
                <h3 class="text-2xl font-bold text-slate-50 mb-6">{{ config.packages.plus.sections.features.title }}</h3>
                <div class="space-y-6">
                  <div v-for="(feature, index) in config.packages.plus.sections.features.items" :key="index" class="flex items-start">
                    <div
                        class="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mr-4">
                      <i :class="feature.icon + ' text-blue-400'"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-50 mb-2">{{ feature.title }}</h4>
                      <p class="text-slate-300 text-sm">{{ feature.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Pricing & CTA -->
            <div data-aos="fade-left">
              <div class="glass-card-custom rounded-3xl p-8 border-2 border-blue-500/30 relative">
                <div class="absolute top-4 right-4 text-7xl">
                  <i :class="config.packages.plus.icon + ' text-blue-500'"></i>
                </div>
                <div class="text-center mb-8">
                  <div class="text-6xl font-bold text-slate-50 mb-2">{{ config.packages.plus.priceNumber }}<span
                      class="text-3xl text-slate-400">{{ config.packages.plus.priceDecimal }}</span></div>
                  <p class="text-slate-400"></p>
                </div>

                <div class="mb-8">
                  <h4 class="font-bold text-slate-50 mb-4">{{ config.packages.plus.sections.keyFeatures.title }}</h4>
                  <ul class="space-y-3">
                    <li v-for="(feature, index) in config.packages.plus.sections.keyFeatures.items" :key="index" class="flex items-center">
                      <i :class="config.packages.plus.sections.keyFeatures.icon + ' text-blue-400 mr-3'"></i>
                      <span class="text-slate-300">{{ feature }}</span>
                    </li>
                  </ul>
                </div>

                <button
                    class="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-emerald-500 text-slate-50 hover:opacity-90 transition"
                    @click="openModal('Plus')">
                  <i :class="config.buttons.register.icon"></i>
                  {{ config.packages.plus.cta }}
                </button>
              </div>

              <div class="glass-card-custom rounded-3xl p-6 mt-6">
                <h4 class="font-bold text-slate-50 mb-4">{{ config.packages.plus.roi.title }}</h4>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-slate-300">{{ config.packages.plus.roi.investment.label }}</span>
                  <span class="text-slate-50 font-bold">{{ config.packages.plus.roi.investment.value }}</span>
                </div>
                <div class="flex items-center justify-between mb-4">
                  <span class="text-slate-300">{{ config.packages.plus.roi.profit.label }}</span>
                  <span class="text-emerald-400 font-bold">{{ config.packages.plus.roi.profit.value }}</span>
                </div>
                <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                       :style="{ width: config.packages.plus.roi.progress }"></div>
                </div>
                <p class="text-center text-slate-400 text-sm mt-4">{{ config.packages.plus.roi.ratio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gói Pro Detail Section -->
    <section id="pro-package" class="package-detail-section bg-gradient-to-b from-purple-900/10 to-transparent" ref="proSection">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <!-- Package Header -->
          <div class="text-center mb-16" data-aos="fade-up">
            <div class="inline-flex items-center px-4 py-2 rounded-full gradient-bg mb-6">
              <i :class="config.packages.pro.icon + ' text-slate-50 mr-2'"></i>
              <span class="text-sm font-semibold text-slate-50">{{ config.packages.pro.detailBadge }}</span>
            </div>
            <h2 class="text-4xl md:text-5xl font-bold text-slate-50 mb-6">
              Gói <span class="gradient-text gradient-animate">{{ config.packages.pro.detailTitle }}</span>
              <span class="block text-xl text-slate-400 mt-4">{{ config.packages.pro.price }}</span>
            </h2>
            <p class="text-xl text-slate-300 max-w-3xl mx-auto">
              <span>{{ config.packages.pro.detailDescription.before }}</span>
              <span class="text-purple-300 font-semibold">{{ config.packages.pro.detailDescription.highlight }}</span>
              <span>{{ config.packages.pro.detailDescription.after }}</span>
              <span class="block mt-2">{{ config.packages.pro.detailSubdescription }}</span>
            </p>
          </div>

          <div class="grid lg:grid-cols-2 gap-12">
            <!-- Left: Package Details -->
            <div data-aos="fade-right">
              <div class="glass-card-custom rounded-3xl p-8 mb-8 border-2 border-purple-500/30">
                <h3 class="text-2xl font-bold text-slate-50 mb-6">{{ config.packages.pro.sections.whyBest.title }}</h3>
                <ul class="space-y-4">
                  <li v-for="(item, index) in config.packages.pro.sections.whyBest.items" :key="index" class="flex items-start">
                    <i :class="config.packages.pro.sections.whyBest.icon + ' text-purple-400 mt-1 mr-3'"></i>
                    <span class="text-slate-300">
                      <span class="text-slate-50 font-semibold">{{ item.highlight }}</span>{{ item.text }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="glass-card-custom rounded-3xl p-8">
                <h3 class="text-2xl font-bold text-slate-50 mb-6">{{ config.packages.pro.sections.privileges.title }}</h3>
                <div class="space-y-6">
                  <div v-for="(privilege, index) in config.packages.pro.sections.privileges.items" :key="index" class="flex items-start">
                    <div class="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mr-4">
                      <i :class="privilege.icon + ' text-slate-50'"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-50 mb-2">{{ privilege.title }}</h4>
                      <p class="text-slate-300 text-sm">{{ privilege.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Pricing & CTA -->
            <div data-aos="fade-left">
              <div class="pro-pkg glass-card-custom rounded-3xl p-8 gradient-bg gradient-animate relative">
                <div class="absolute top-4 right-4 text-7xl">
                  <i :class="config.packages.pro.icon + ' text-slate-50'"></i>
                </div>
                <div class="text-center mb-8">
                  <div class="text-6xl font-bold text-slate-50 mb-2">{{ config.packages.pro.priceNumber }}<span
                      class="text-3xl text-slate-50/80">{{ config.packages.pro.priceDecimal }}</span></div>
                  <p class="text-slate-50/90">/tháng</p>
                </div>

                <div class="mb-8 bg-white/10 rounded-xl p-6">
                  <h4 class="font-bold text-slate-50 mb-4">{{ config.packages.pro.sections.premiumFeatures.title }}</h4>
                  <ul class="space-y-3">
                    <li v-for="(feature, index) in config.packages.pro.sections.premiumFeatures.items" :key="index" class="flex items-center">
                      <i :class="config.packages.pro.sections.premiumFeatures.icon + ' text-slate-50 mr-3'"></i>
                      <span class="text-slate-50">{{ feature }}</span>
                    </li>
                  </ul>
                </div>

                <button class="w-full py-4 rounded-xl font-bold bg-white text-purple-600 hover:bg-white/90 transition"
                        @click="openModal('Pro')">
                  <i :class="config.buttons.proCta.icon"></i>
                  {{ config.packages.pro.cta }}
                </button>
              </div>

              <div class="glass-card-custom rounded-3xl p-6 mt-6">
                <h4 class="font-bold text-slate-50 mb-4">{{ config.packages.pro.statsTitle }}</h4>
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="text-center p-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl">
                    <div class="text-2xl font-bold text-slate-50">{{ config.packages.pro.userStats.percentage }}</div>
                    <div class="text-xs text-slate-400">{{ config.packages.pro.userStats.label }}</div>
                  </div>
                  <div class="text-center p-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl">
                    <div class="text-2xl font-bold text-emerald-400">{{ config.packages.pro.userStats.roi }}</div>
                    <div class="text-xs text-slate-400">{{ config.packages.pro.userStats.roiLabel }}</div>
                  </div>
                </div>
                <p class="text-center text-slate-300 text-sm">
                  {{ config.packages.pro.userStats.description.before }}
                  <span class="text-purple-300 font-bold">{{ config.packages.pro.userStats.description.highlight }}</span>
                  {{ config.packages.pro.userStats.description.after }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gói Premium Detail Section -->
    <section id="premium-package" class="package-detail-section" ref="premiumSection">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <!-- Package Header -->
          <div class="text-center mb-16" data-aos="fade-up">
            <div
                class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/30 mb-6">
              <i :class="config.packages.premium.icon + ' text-amber-400 mr-2'"></i>
              <span class="text-sm font-semibold text-amber-300">{{ config.packages.premium.detailBadge }}</span>
            </div>
            <h2 class="text-4xl md:text-5xl font-bold text-slate-50 mb-6">
              Gói <span class="text-amber-400">{{ config.packages.premium.detailTitle }}</span>
              <span class="block text-xl text-slate-400 mt-4">{{ config.packages.premium.price }}/tháng</span>
            </h2>
            <p class="text-xl text-slate-300 max-w-3xl mx-auto">
              <span>{{ config.packages.premium.detailDescription.before }}</span>
              <span class="text-amber-300 font-semibold">{{ config.packages.premium.detailDescription.highlight }}</span>
              <span>{{ config.packages.premium.detailDescription.after }}</span>
              <span class="block mt-2">{{ config.packages.premium.detailSubdescription }}</span>
            </p>
          </div>

          <div class="grid lg:grid-cols-2 gap-12">
            <!-- Left: Package Details -->
            <div data-aos="fade-right">
              <div class="glass-card-custom rounded-3xl p-8 mb-8">
                <h3 class="text-2xl font-bold text-slate-50 mb-6">{{ config.packages.premium.sections.privileges.title }}</h3>
                <ul class="space-y-4">
                  <li v-for="(item, index) in config.packages.premium.sections.privileges.items" :key="index" class="flex items-start">
                    <i :class="config.packages.premium.sections.privileges.icon + ' text-amber-400 mt-1 mr-3'"></i>
                    <span class="text-slate-300">
                      <span class="text-slate-50 font-semibold">{{ item.highlight }}</span>{{ item.text }}
                    </span>
                  </li>
                </ul>
              </div>

              <div class="glass-card-custom rounded-3xl p-8 border-2 border-amber-500/30">
                <h3 class="text-2xl font-bold text-slate-50 mb-6">{{ config.packages.premium.sections.features.title }}</h3>
                <div class="space-y-6">
                  <div v-for="(feature, index) in config.packages.premium.sections.features.items" :key="index" class="flex items-start">
                    <div
                        class="w-12 h-12 bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mr-4">
                      <i :class="feature.icon + ' text-amber-400'"></i>
                    </div>
                    <div>
                      <h4 class="font-bold text-slate-50 mb-2">{{ feature.title }}</h4>
                      <p class="text-slate-300 text-sm">{{ feature.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Pricing & CTA -->
            <div data-aos="fade-left">
              <div
                  class="relative glass-card-custom rounded-3xl p-8 bg-gradient-to-br from-amber-900/20 to-pink-900/20 border-3 border-amber-500/30">
                <div class="text-center mb-8">
                  <div class="absolute top-4 right-4 text-7xl">
                    <i :class="config.packages.premium.icon + ' text-amber-500'"></i>
                  </div>
                  <div class="text-6xl font-bold text-slate-50 mb-2">{{ config.packages.premium.priceNumber }}<span
                      class="text-3xl text-slate-400">{{ config.packages.premium.priceDecimal }}</span></div>
                  <p class="text-slate-400">/tháng</p>
                </div>

                <div class="mb-8">
                  <h4 class="font-bold text-slate-50 mb-4">{{ config.packages.premium.sections.exclusiveFeatures.title }}</h4>
                  <ul class="space-y-3">
                    <li v-for="(feature, index) in config.packages.premium.sections.exclusiveFeatures.items" :key="index" class="flex items-center">
                      <i :class="config.packages.premium.sections.exclusiveFeatures.icon + ' text-amber-400 mr-3'"></i>
                      <span class="text-slate-300">{{ feature }}</span>
                    </li>
                  </ul>
                </div>

                <button
                    class="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-pink-500 text-slate-50 hover:opacity-90 transition"
                    @click="openModal('Premium')">
                  <i :class="config.buttons.premiumCta.icon"></i>
                  {{ config.packages.premium.cta }}
                </button>
              </div>

              <div class="glass-card-custom rounded-3xl p-6 mt-6">
                <h4 class="font-bold text-slate-50 mb-4">{{ config.packages.premium.resultsTitle }}</h4>
                <div class="space-y-4">
                  <div v-for="(result, index) in config.packages.premium.results" :key="index" class="flex items-center justify-between">
                    <span class="text-slate-300">{{ result.label }}</span>
                    <span class="text-amber-400 font-bold">{{ result.value }}</span>
                  </div>
                </div>
                <p class="text-center text-slate-300 text-sm mt-4">
                  {{ config.packages.premium.resultsDescription.before }}
                  <span class="text-amber-300 font-bold">{{ config.packages.premium.resultsDescription.highlight }}</span>
                  {{ config.packages.premium.resultsDescription.after }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Table -->
    <section id="comparison" class="relative overflow-hidden">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-4xl mx-auto mb-16" data-aos="fade-up">
          <h2 class="text-4xl md:text-5xl font-bold text-slate-50 mb-6">
            {{ config.comparison.title.line1 }}
            <span class="gradient-text">{{ config.comparison.title.line2 }}</span>
          </h2>
          <p class="text-xl text-slate-300">
            {{ config.comparison.subtitle }}
          </p>
        </div>

        <div class="overflow-x-auto glass-card-custom rounded-3xl p-8" data-aos="fade-up">
          <table class="w-full">
            <thead>
            <tr class="border-b border-white/10">
              <th class="text-left py-6 text-lg font-bold text-slate-50">{{ config.comparison.tableHeaders.feature }}</th>
              <th v-for="(pkg, key) in config.comparison.packages" :key="key" class="text-center py-6" :class="key === 'pro' ? 'bg-gradient-to-b from-purple-900/10 to-transparent rounded-t-xl' : ''">
                <div class="font-bold text-slate-50 text-lg">{{ pkg.name }}</div>
                <div :class="pkg.priceClass">{{ pkg.price }}</div>
                <div v-if="pkg.note" class="text-xs text-emerald-400 mt-1">{{ pkg.note }}</div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(feature, featureKey) in config.comparison.features" :key="featureKey" :class="featureKey < config.comparison.features.length - 1 ? 'border-b border-white/5' : ''">
              <td class="py-3 text-slate-300">{{ feature.name }}</td>
              <td v-for="(pkg, packageKey) in config.comparison.packages" :key="packageKey" class="text-center py-3" :class="packageKey === 'pro' ? 'bg-gradient-to-b from-purple-900/5 to-transparent' : ''">
                <span :class="feature[packageKey].class">{{ feature[packageKey].value }}</span>
                <div v-if="feature[packageKey].note" class="text-xs text-emerald-400 mt-1">{{ feature[packageKey].note }}</div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="text-center mt-12" data-aos="fade-up">
          <p class="text-slate-300 text-lg">
            <i :class="config.comparison.tip.icon"></i>
            <span class="text-slate-50 font-semibold">{{ config.comparison.tip.label }}</span>
            {{ config.comparison.tip.text }}
          </p>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="relative overflow-hidden pb-32">
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/10"></div>

      <div class="container py-32 mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-5xl mx-auto">
          <div class="glass-card-custom rounded-3xl p-12 text-center border-2 border-purple-500/30" data-aos="fade-up">
            <div class="w-28 h-28 gradient-bg rounded-full flex items-center justify-center mx-auto mb-8">
              <i :class="config.finalCta.icon"></i>
            </div>

            <h2 class="text-4xl md:text-5xl font-bold text-slate-50 mb-8">
              {{ config.finalCta.title }}
            </h2>

            <div class="grid md:grid-cols-2 gap-8 mb-12">
              <div v-for="(option, index) in config.finalCta.options" :key="index" :class="option.class">
                <div :class="option.numberClass">{{ option.number }}</div>
                <h3 class="text-xl font-bold text-slate-50 mb-4">{{ option.title }}</h3>
                <p class="text-slate-300 mb-6">
                  {{ option.description }}
                </p>
                <div :class="option.priceClass">{{ option.priceLabel }}</div>
                <div :class="option.noteClass">{{ option.priceNote }}</div>
              </div>
            </div>

            <div class="mb-10">
              <h3 class="text-2xl font-bold text-slate-50 mb-6">{{ config.finalCta.question.title }}</h3>
              <p class="text-xl text-slate-300 max-w-2xl mx-auto">
                {{ config.finalCta.question.description }}
                <span class="text-slate-50 font-bold">{{ config.finalCta.question.highlight }}</span>
              </p>
            </div>

            <!-- Final CTA Button -->
            <div class="max-w-md mx-auto">
              <button class="w-full py-3 rounded-xl font-bold text-xl btn-primary shadow-2xl mb-6"
                      @click="openModal('Pro')">
                <i :class="config.finalCta.button.icon"></i>
                {{ config.finalCta.button.text }}
              </button>

              <div class="grid grid-cols-3 gap-4 text-center mb-8">
                <div v-for="(guarantee, index) in config.finalCta.guarantees" :key="index" class="p-4 rounded-xl glass-card-custom">
                  <div class="text-sm text-slate-400">{{ guarantee.label }}</div>
                  <div class="text-slate-50 font-bold">{{ guarantee.value }}</div>
                </div>
              </div>

              <p class="text-slate-400 text-sm">
                {{ config.finalCta.contact.label }} <span class="text-slate-50 font-bold text-lg">{{ config.finalCta.contact.phone }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Back to Top Button -->
    <section id="contact" class="container mx-auto px-4 sm:px-6 lg:px-8 mb-32">
      <CooperationForm :purple-template="true"/>
    </section>

    <!-- Modal for package selection -->
    <div v-if="showModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="glass-card-custom rounded-3xl p-8 max-w-md w-full">
        <div class="text-center mb-6">
          <div class="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-check text-slate-50 text-2xl"></i>
          </div>
          <h3 class="text-2xl font-bold text-slate-50 mb-2">{{ config.modal.successTitle }}</h3>
          <p class="text-slate-300">{{ config.modal.selectedText }} <span class="text-purple-300 font-bold">{{ selectedPackage }}</span></p>
        </div>
        <p class="text-slate-400 text-sm mb-6 text-center">
          {{ config.modal.redirectText }}
        </p>
        <div class="flex space-x-4">
          <button class="flex-1 py-3 rounded-xl glass-card-custom text-slate-50 hover:bg-white/5 transition"
                  @click="closeModal">
            {{ config.buttons.cancel }}
          </button>
          <button class="flex-1 py-3 rounded-xl btn-primary" @click="confirmPayment">
            {{ config.buttons.payNow }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import GlassCard from "../../UI/GlassCard.vue";
import CooperationForm from "../../UI/CooperationForm.vue";
import {useRouter} from "vue-router";
import api from "../../../../api/api.js";

const router = useRouter();

// Config object
const config = ref({
  hero: {
    badge: {
      icon: 'fas fa-bolt text-purple-400 mr-2',
      text: 'CÔNG CỤ SỐ 1 CHO MÔI GIỚI BĐS VIỆT NAM'
    },
    title: {
      line1: 'Chọn gói phù hợp',
      line2: 'cho sự nghiệp của bạn'
    },
    description: 'Không phải gói nào cũng phù hợp với mọi người. Chúng tôi thiết kế 3 gói dịch vụ với các tính năng và giới hạn khác biệt, giúp bạn lựa chọn chính xác gói phù hợp nhất với quy mô và định hướng phát triển của mình. Dù bạn mới bắt đầu hay đã là chuyên gia, luôn có một gói dành cho bạn.',
    stats: {
      users: {
        count: '5,000+',
        label: 'Môi giới đã lựa chọn'
      },
      security: {
        icon: 'fas fa-shield-alt text-emerald-400 text-xl mr-3',
        title: 'Bảo mật tuyệt đối',
        description: 'Dữ liệu được mã hóa'
      }
    }
  },
  packages: {
    plus: {
      name: 'Plus',
      fullName: 'Gói Plus',
      icon: 'fa-regular fa-star',
      tagline: 'Khởi đầu vững chắc',
      previewDescription: 'Dành cho môi giới mới bắt đầu muốn trải nghiệm hệ thống với đầy đủ tính năng cơ bản.',
      features: ['• 50 BĐS được quản lý'],
      detailBadge: 'GÓI KHỞI ĐẦU THÔNG MINH',
      detailTitle: 'Plus',
      price: '199.000đ/tháng',
      priceNumber: '199',
      priceDecimal: '.000đ',
      detailDescription: 'Dành cho môi giới mới bắt đầu muốn thử nghiệm hệ thống mà không rủi ro tài chính.',
      highlight: 'Hoàn hảo để khởi nghiệp với ngân sách thấp.',
      sections: {
        target: {
          title: 'Ai nên chọn gói này?',
          icon: 'fas fa-check-circle',
          items: [
            'Môi giới mới vào nghề, cần công cụ cơ bản để khởi đầu',
            'Người muốn thử nghiệm hệ thống trước khi đầu tư lớn',
            'Môi giới bán thời gian hoặc có số lượng BĐS ít'
          ]
        },
        features: {
          title: 'Bạn sẽ nhận được gì?',
          items: [
            {
              icon: 'fas fa-home',
              title: 'Quản lý 50 BĐS',
              description: 'Đủ để bắt đầu với một danh mục nhỏ và học cách sử dụng hệ thống'
            },
            {
              icon: 'fas fa-calculator',
              title: '10 lượt định giá/tháng',
              description: 'Định giá sơ bộ cho 10 BĐS mỗi tháng'
            },
            {
              icon: 'fas fa-unlock',
              title: '20 lượt mở khóa',
              description: 'Tiếp cận thông tin chi tiết của 20 BĐS tiềm năng'
            }
          ]
        },
        keyFeatures: {
          title: 'Tính năng chính:',
          icon: 'fas fa-check',
          items: [
            'Quản lý tối đa 50 BĐS',
            '10 lượt định giá sơ bộ/tháng',
            '20 lượt mở khóa sản phẩm/tháng',
            'Đội nhóm cá nhân: 25 thành viên',
            'Đăng tin: 20 tin/tháng'
          ]
        }
      },
      cta: 'Đăng ký Gói Plus',
      roi: {
        title: 'ROI dự kiến:',
        investment: {
          label: 'Chi phí đầu tư:',
          value: '199.000đ/tháng'
        },
        profit: {
          label: 'Lợi nhuận tối thiểu:',
          value: '+2.000.000đ/tháng'
        },
        progress: '65%',
        ratio: 'Tỷ lệ đầu tư : lợi nhuận ≈ 1:10'
      }
    },
    pro: {
      name: 'Pro',
      fullName: 'Gói Pro',
      icon: 'fa-solid fa-gem',
      tagline: 'Lựa chọn thông minh',
      badge: 'PHỔ BIẾN NHẤT',
      subBadge: 'Lựa chọn thông minh nhất',
      previewDescription: 'Đầy đủ công cụ cho môi giới chuyên nghiệp, tối ưu hiệu suất và tăng doanh thu đáng kể.',
      stats: '85% môi giới thành công chọn gói này',
      features: ['• 100 BĐS được quản lý'],
      detailBadge: 'LỰA CHỌN THÔNG MINH NHẤT',
      detailTitle: 'Pro',
      price: '499.000đ/tháng',
      priceNumber: '499',
      priceDecimal: '.000đ',
      detailDescription: {
        before: 'Được ',
        highlight: '85% môi giới thành công',
        after: ' lựa chọn vì hiệu quả vượt trội so với chi phí.'
      },
      detailSubdescription: 'Khoản đầu tư thông minh nhất cho sự nghiệp môi giới của bạn.',
      sections: {
        whyBest: {
          title: 'Vì sao đây là lựa chọn tốt nhất?',
          icon: 'fas fa-check-circle',
          items: [
            {highlight: 'ROI ấn tượng:', text: ' Đầu tư 499K, thu về ít nhất 5 triệu/tháng'},
            {highlight: 'Đầy đủ tính năng:', text: ' Mọi công cụ cần thiết cho môi giới chuyên nghiệp'},
            {highlight: 'Hỗ trợ 24/7:', text: ' Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ'},
            {highlight: 'Không giới hạn tiềm năng:', text: ' Đủ tài nguyên để phát triển mạnh mẽ'}
          ]
        },
        privileges: {
          title: 'Đặc quyền của gói Pro',
          items: [
            {
              icon: 'fa-solid fa-diagram-project',
              title: 'Quản lý 100 BĐS',
              description: 'Đủ để xây dựng danh mục đầu tư đa dạng và phát triển mạnh mẽ'
            },
            {
              icon: 'fas fa-calculator',
              title: '50 lượt định giá/tháng',
              description: 'Định giá chuyên sâu cho 50 BĐS mỗi tháng'
            },
            {
              icon: 'fas fa-unlock',
              title: '50 lượt mở khóa',
              description: 'Tiếp cận thông tin chi tiết của 50 BĐS tiềm năng mỗi tháng'
            }
          ]
        },
        premiumFeatures: {
          title: 'Tính năng cao cấp:',
          icon: 'fas fa-check',
          items: [
            'Quản lý tối đa 100 BĐS',
            '50 lượt định giá chuyên sâu/tháng',
            '50 lượt mở khóa sản phẩm/tháng',
            'Đội nhóm cá nhân: 100 thành viên',
            'Đăng tin không giới hạn',
            'Hỗ trợ ưu tiên 24/7'
          ]
        }
      },
      cta: 'CHỌN GÓI PRO - THÔNG MINH NHẤT',
      statsTitle: 'Thống kê người dùng gói Pro:',
      userStats: {
        percentage: '85%',
        label: 'Môi giới chọn',
        roi: '1:10',
        roiLabel: 'Tỷ lệ ROI',
        description: {
          before: 'Trung bình mỗi người tăng ',
          highlight: '5-8 triệu/tháng',
          after: ' sau khi dùng'
        }
      }
    },
    premium: {
      name: 'Premium',
      fullName: 'Gói Premium',
      icon: 'fa-solid fa-crown',
      tagline: 'Dành cho người dẫn đầu',
      previewDescription: 'Tất cả tính năng cao cấp, không giới hạn, dành cho những ai muốn thống lĩnh thị trường.',
      features: ['• 150 BĐS được quản lý'],
      detailBadge: 'GÓI CAO CẤP DÀNH CHO NGƯỜI DẪN ĐẦU',
      detailTitle: 'Premium',
      price: '599.000đ/tháng',
      priceNumber: '599',
      priceDecimal: '.000đ',
      detailDescription: {
        before: 'Dành cho những người muốn ',
        highlight: 'thống lĩnh thị trường',
        after: ' và vượt mặt đối thủ.'
      },
      detailSubdescription: 'Mọi tính năng cao cấp nhất, hỗ trợ VIP 24/7, và công cụ để bạn trở thành số 1.',
      sections: {
        privileges: {
          title: 'Đặc quyền chỉ có ở Premium',
          icon: 'fas fa-crown',
          items: [
            {highlight: 'Hỗ trợ VIP 24/7:', text: ' Đội ngũ chuyên gia riêng luôn sẵn sàng'},
            {highlight: 'Không giới hạn mọi thứ:', text: ' Từ định giá, mở khóa đến quản lý BĐS'},
            {highlight: 'Đào tạo chuyên sâu:', text: ' Các khóa học đặc biệt chỉ dành cho Premium'},
            {highlight: 'Tính năng độc quyền:', text: ' Công cụ phân tích nâng cao chỉ có ở Premium'}
          ]
        },
        features: {
          title: 'Bạn sẽ nhận được gì?',
          items: [
            {
              icon: 'fas fa-infinity',
              title: 'Quản lý 150 BĐS',
              description: 'Xây dựng danh mục đầu tư khủng, thống lĩnh thị trường'
            },
            {
              icon: 'fas fa-calculator',
              title: '150 lượt định giá/tháng',
              description: 'Định giá chuyên sâu không giới hạn cho mọi BĐS'
            },
            {
              icon: 'fas fa-unlock',
              title: '200 lượt mở khóa',
              description: 'Tiếp cận không giới hạn thông tin BĐS tiềm năng'
            }
          ]
        },
        exclusiveFeatures: {
          title: 'Tính năng độc quyền:',
          icon: 'fas fa-check',
          items: [
            'Quản lý 150 BĐS (không giới hạn nâng cấp)',
            '150 lượt định giá chuyên sâu/tháng',
            '200 lượt mở khóa sản phẩm/tháng',
            'Đội nhóm cá nhân: 200 thành viên',
            'Hỗ trợ VIP 24/7 với chuyên gia riêng'
          ]
        }
      },
      cta: 'NÂNG CẤP LÊN PREMIUM',
      resultsTitle: 'Kết quả người dùng Premium:',
      results: [
        {
          label: 'Thu nhập tăng trung bình:',
          value: '+15-20 triệu/tháng'
        },
        {
          label: 'Tỷ lệ chốt deal:',
          value: '85%+'
        },
        {
          label: 'Thời gian hoàn vốn:',
          value: '1.5 tháng'
        }
      ],
      resultsDescription: {
        before: 'Premium dành cho người muốn ',
        highlight: 'dẫn đầu thị trường',
        after: ''
      }
    }
  },
  benefits: {
    title: {
      line1: 'Vì sao nên đầu tư vào',
      line2: 'công cụ này?'
    },
    subtitle: 'Không phải là chi phí, mà là khoản đầu tư sinh lời ít nhất 1:5 mỗi tháng',
    items: [
      {
        title: 'Tiết kiệm 15 giờ/tuần',
        icon: 'fas fa-clock',
        color: 'pink',
        stat: {
          number: '15 giờ/tuần',
          label: 'Thời gian tiết kiệm:'
        },
        description: 'Tự động hóa công việc thủ công, giúp bạn tập trung vào việc tạo ra doanh thu thay vì quản lý giấy tờ.'
      },
      {
        title: 'Tăng 40% doanh thu',
        icon: 'fas fa-chart-line',
        color: 'blue',
        stat: {
          number: '+40%',
          label: 'Tăng trưởng trung bình:'
        },
        description: 'Phân tích thông minh giúp bạn xác định đúng khách hàng tiềm năng và tối ưu chiến lược bán hàng.'
      },
      {
        title: 'Chuyên nghiệp hóa hình ảnh',
        icon: 'fas fa-user-check',
        color: 'amber',
        stat: {
          number: '4.8/5 sao',
          label: 'Đánh giá khách hàng:'
        },
        description: 'Hệ thống quản lý chuyên nghiệp giúp bạn tạo ấn tượng tốt và xây dựng niềm tin với khách hàng.'
      }
    ]
  },
  comparison: {
    title: {
      line1: 'So sánh để thấy',
      line2: 'sự khác biệt rõ ràng'
    },
    subtitle: 'Lựa chọn gói phù hợp với mục tiêu và ngân sách của bạn',
    tableHeaders: {
      feature: 'Tính năng'
    },
    packages: {
      plus: {
        name: 'Gói Plus',
        price: '199.000đ/tháng',
        priceClass: 'text-purple-300 font-semibold'
      },
      pro: {
        name: 'Gói Pro',
        price: '499.000đ/tháng',
        priceClass: 'gradient-text font-bold',
        note: '(Lựa chọn thông minh nhất)'
      },
      premium: {
        name: 'Gói Premium',
        price: '599.000đ/tháng',
        priceClass: 'text-amber-300 font-semibold'
      }
    },
    features: [
      {
        name: 'Định giá BĐS',
        plus: {
          value: '10 lượt/tháng',
          class: 'text-slate-50 font-semibold'
        },
        pro: {
          value: '50 lượt/tháng',
          class: 'text-slate-50 font-semibold',
          note: '+400% giá trị'
        },
        premium: {
          value: '150 lượt/tháng',
          class: 'text-slate-50 font-semibold'
        }
      },
      {
        name: 'Quản lý kho BĐS',
        plus: {
          value: '50 BĐS',
          class: ''
        },
        pro: {
          value: '100 BĐS',
          class: 'text-slate-50 font-semibold',
          note: 'Đủ để kinh doanh chuyên nghiệp'
        },
        premium: {
          value: '150 BĐS',
          class: ''
        }
      },
      {
        name: 'Mở khóa cơ hội',
        plus: {
          value: '20 lượt/tháng',
          class: ''
        },
        pro: {
          value: '50 lượt/tháng',
          class: 'text-slate-50 font-semibold'
        },
        premium: {
          value: '200 lượt/tháng',
          class: ''
        }
      },
      {
        name: 'Hỗ trợ khách hàng',
        plus: {
          value: 'Qua email',
          class: ''
        },
        pro: {
          value: 'Hỗ trợ ưu tiên 24/7',
          class: 'text-slate-50 font-semibold',
          note: 'Giải đáp mọi thắc mắc'
        },
        premium: {
          value: 'Hỗ trợ VIP 24/7',
          class: ''
        }
      },
      {
        name: 'Đào tạo chuyên sâu',
        plus: {
          value: 'Cơ bản',
          class: ''
        },
        pro: {
          value: '2 buổi đào tạo miễn phí',
          class: 'text-slate-50 font-semibold',
          note: 'Trị giá 2 triệu'
        },
        premium: {
          value: 'Khóa học đặc biệt',
          class: ''
        }
      }
    ],
    tip: {
      icon: 'fas fa-lightbulb text-amber-400 mr-2',
      label: 'Lời khuyên:',
      text: 'Nếu bạn nghiêm túc với nghề môi giới, Gói Pro mang lại giá trị tốt nhất so với chi phí bỏ ra'
    }
  },
  finalCta: {
    icon: 'fas fa-rocket text-slate-50 text-3xl',
    title: 'Bạn có 2 lựa chọn:',
    options: [
      {
        number: '1',
        numberClass: 'text-6xl text-slate-500 mb-4',
        title: 'Tiếp tục cách cũ',
        description: 'Mất thêm 15 giờ/tuần cho công việc thủ công, bỏ lỡ cơ hội, đối thủ vượt mặt bạn mỗi ngày.',
        priceLabel: 'Chi phí: 0đ',
        priceClass: 'text-2xl font-bold text-slate-500',
        priceNote: '(Nhưng mất cơ hội vô giá)',
        noteClass: 'text-sm text-slate-500 mt-2',
        class: 'p-8 rounded-2xl glass-card-custom border-2 border-white/10'
      },
      {
        number: '2',
        numberClass: 'text-6xl gradient-text mb-4',
        title: 'Đầu tư thông minh',
        description: 'Tiết kiệm 15 giờ/tuần, tăng 40% doanh thu, chốt deal nhanh gấp 3 lần, vượt mặt đối thủ.',
        priceLabel: 'Chi phí: 499.000đ/tháng',
        priceClass: 'text-2xl font-bold gradient-text',
        priceNote: '(Hoàn vốn chỉ sau 2.5 tháng)',
        noteClass: 'text-sm text-emerald-400 mt-2',
        class: 'p-8 rounded-2xl border-2 border-purple-500 bg-gradient-to-b from-purple-900/10 to-transparent'
      }
    ],
    question: {
      title: 'Lựa chọn nào thông minh hơn?',
      description: 'Đầu tư 499K để thu về ít nhất 5 triệu mỗi tháng.',
      highlight: 'Đây không phải là chi phí, mà là khoản đầu tư sinh lời.'
    },
    button: {
      icon: 'fas fa-gem mr-3',
      text: 'ĐĂNG KÝ GÓI PRO NGAY - 499.000đ/tháng'
    },
    guarantees: [
      {
        label: 'Không rủi ro',
        value: '7 ngày hoàn tiền'
      },
      {
        label: 'Không ràng buộc',
        value: 'Hủy bất kỳ lúc nào'
      },
      {
        label: 'Dùng thử miễn phí',
        value: '14 ngày đầu tiên'
      }
    ],
    contact: {
      label: 'Hoặc gọi ngay:',
      phone: '1900 888 999'
    }
  },
  buttons: {
    viewDetails: 'Xem chi tiết →',
    register: {
      icon: 'fas fa-shopping-cart mr-2'
    },
    proCta: {
      icon: 'fas fa-bolt mr-2'
    },
    premiumCta: {
      icon: 'fas fa-crown mr-2'
    },
    cancel: 'Hủy',
    payNow: 'Thanh toán ngay'
  },
  modal: {
    successTitle: 'Đăng ký thành công!',
    selectedText: 'Bạn đã chọn',
    redirectText: 'Chúng tôi sẽ chuyển hướng bạn đến trang thanh toán an toàn.'
  },
  css: {
    // Background colors
    purple500: 'var(--color-purple-500)',
    pink500: 'var(--color-pink-500)',
    blue500: 'var(--color-blue-500)',
    emerald500: 'var(--color-emerald-500)',
    amber500: 'var(--color-amber-500)',

    // Gradient colors
    gradientFrom: 'var(--color-purple-500)',
    gradientTo: 'var(--color-pink-500)',

    // Text colors
    slate50: 'var(--color-slate-50)',
    slate300: 'var(--color-slate-300)',
    slate400: 'var(--color-slate-400)',
    slate800: 'var(--color-slate-800)',

    // Border colors
    borderOpacity: '0.08',

    // Animation durations
    floatDuration: '6s',
    pulseDuration: '2s',
    glowDuration: '3s'
  }
});

// State for modal
const showModal = ref(false)
const selectedPackage = ref('')
const activePackage = ref('')

// Refs for sections
const plusSection = ref(null)
const proSection = ref(null)
const premiumSection = ref(null)

// Function to open modal
const openModal = (packageName) => {
  router.push('/ho-so/goi-dich-vu')
}

// Function to close modal
const closeModal = () => {
  showModal.value = false
}

// Function to confirm payment
const confirmPayment = () => {
  alert(`Thanh toán thành công! Bạn đã đăng ký ${selectedPackage.value}. Tài khoản sẽ được kích hoạt trong 5 phút.`)
  closeModal()
}

// Function to scroll to section
const scrollToSection = (sectionId) => {
  const targetElement = document.getElementById(sectionId)
  if (targetElement) {
    // Set active package
    if (sectionId === 'plus-package') {
      activePackage.value = 'plus'
    } else if (sectionId === 'pro-package') {
      activePackage.value = 'pro'
    } else if (sectionId === 'premium-package') {
      activePackage.value = 'premium'
    }

    window.scrollTo({
      top: targetElement.offsetTop - 100,
      behavior: 'smooth'
    })
  }
}

// Function to scroll to top
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Function to check which section is in view
const checkActiveSection = () => {
  const sections = [
    { id: 'plus-package', ref: plusSection, key: 'plus' },
    { id: 'pro-package', ref: proSection, key: 'pro' },
    { id: 'premium-package', ref: premiumSection, key: 'premium' }
  ]

  const windowHeight = window.innerHeight
  const scrollPosition = window.scrollY + 100 // Giảm offset xuống 100px

  let currentActive = ''
  let minDistance = Infinity

  for (const section of sections) {
    if (section.ref.value) {
      const element = section.ref.value
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const elementBottom = elementTop + rect.height

      // Kiểm tra xem section có trong viewport không
      const isInView = (
          (elementTop <= scrollPosition + windowHeight / 2) &&
          (elementBottom >= scrollPosition + windowHeight / 3)
      )

      // Tính khoảng cách từ giữa màn hình đến section
      const elementCenter = elementTop + (rect.height / 2)
      const distance = Math.abs(scrollPosition + (windowHeight / 2) - elementCenter)

      if (isInView && distance < minDistance) {
        minDistance = distance
        currentActive = section.key
      }
    }
  }

  // Nếu không tìm thấy section nào trong viewport, kiểm tra section gần nhất
  if (!currentActive) {
    for (const section of sections) {
      if (section.ref.value) {
        const element = section.ref.value
        const elementTop = element.offsetTop
        const distance = Math.abs(scrollPosition - elementTop)

        if (distance < minDistance) {
          minDistance = distance
          currentActive = section.key
        }
      }
    }
  }

  // Nếu cuộn quá cao hoặc quá thấp, không active gói nào
  const firstSection = sections[0].ref.value
  const lastSection = sections[sections.length - 1].ref.value

  if (firstSection && lastSection) {
    const firstSectionTop = firstSection.offsetTop
    const lastSectionBottom = lastSection.offsetTop + lastSection.offsetHeight

    if (scrollPosition < firstSectionTop - 200 || scrollPosition > lastSectionBottom + 200) {
      currentActive = ''
    }
  }

  activePackage.value = currentActive
}

// Initialize AOS animation
const initAOS = () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    })
  }
}

// Back to top button visibility and active section
const handleScroll = () => {
  // Back to top button
  const backToTopButton = document.getElementById('backToTop')
  if (backToTopButton) {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.remove('opacity-0', 'invisible')
      backToTopButton.classList.add('opacity-100', 'visible')
    } else {
      backToTopButton.classList.remove('opacity-100', 'visible')
      backToTopButton.classList.add('opacity-0', 'invisible')
    }
  }

  // Check active section
  checkActiveSection()
}

const loadConfig = async () => {
  const response = await api.get('/thg/public/cms/contentSection/64');

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

// Thêm observer cho các section
const initIntersectionObserver = () => {
  const options = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Chỉ active khi section chiếm ít nhất 50% viewport
    threshold: 0.1
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id
        if (sectionId === 'plus-package') activePackage.value = 'plus'
        else if (sectionId === 'pro-package') activePackage.value = 'pro'
        else if (sectionId === 'premium-package') activePackage.value = 'premium'
      }
    })
  }, options)

  // Observer tất cả các section
  if (plusSection.value) observer.observe(plusSection.value)
  if (proSection.value) observer.observe(proSection.value)
  if (premiumSection.value) observer.observe(premiumSection.value)

  return observer
}



onMounted(async () => {
  // Load config từ API
  await loadConfig()

  // Khởi tạo AOS
  initAOS()

  // Thêm scroll padding cho anchor links
  document.documentElement.style.scrollPaddingTop = '80px'

  // Thêm event listener cho scroll
  window.addEventListener('scroll', handleScroll, { passive: true })

  // Khởi tạo Intersection Observer
  let observer = null
  setTimeout(() => {
    observer = initIntersectionObserver()

    // Fallback: vẫn dùng checkActiveSection cho các trình duyệt cũ
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver không được hỗ trợ, sử dụng fallback')
      checkActiveSection()
    }
  }, 500)

  // Smooth scrolling cho tất cả anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault()
      const targetId = this.getAttribute('href')
      if (targetId === '#') return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        // Set active package dựa trên target
        if (targetId === '#plus-package') activePackage.value = 'plus'
        else if (targetId === '#pro-package') activePackage.value = 'pro'
        else if (targetId === '#premium-package') activePackage.value = 'premium'

        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        })
      }
    })
  })

  // Kiểm tra active section ban đầu
  setTimeout(() => {
    checkActiveSection()
  }, 100)

  // Cleanup observer khi component unmount
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (observer) {
      observer.disconnect()
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.pricing-page {
  /* CSS Variables using v-bind */
  --purple-500: v-bind('config.css.purple500');
  --pink-500: v-bind('config.css.pink500');
  --blue-500: v-bind('config.css.blue500');
  --emerald-500: v-bind('config.css.emerald500');
  --amber-500: v-bind('config.css.amber500');
  --gradient-from: v-bind('config.css.gradientFrom');
  --gradient-to: v-bind('config.css.gradientTo');
  --slate-50: v-bind('config.css.slate50');
  --slate-300: v-bind('config.css.slate300');
  --slate-400: v-bind('config.css.slate400');
  --slate-800: v-bind('config.css.slate800');
  --border-opacity: v-bind('config.css.borderOpacity');
  --float-duration: v-bind('config.css.floatDuration');
  --pulse-duration: v-bind('config.css.pulseDuration');
  --glow-duration: v-bind('config.css.glowDuration');
}

.glass-card-custom {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, var(--border-opacity));
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

ul {
  padding: 0;
}

.pricing-page {
  background: linear-gradient(135deg, #070712 0%, #0f0f23 100%);
  color: var(--slate-300);
  line-height: 1.6;
  overflow-x: hidden;
  position: relative;
}

/* Custom Scrollbar */
.pricing-page ::-webkit-scrollbar {
  width: 10px;
}

.pricing-page ::-webkit-scrollbar-track {
  background: rgba(139, 92, 246, 0.1);
}

.pricing-page ::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
  border-radius: 5px;
}

/* Gradient Text */
.gradient-text {
  background: linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Gradient Background */
.gradient-bg {
  background: linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
}

/* Animated Background Elements */
.bg-blur-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  z-index: -1;
}

/* Floating Animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float var(--float-duration) ease-in-out infinite;
}

/* Package Preview Card */
.package-preview-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.package-preview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%);
  transform: translateX(-100%);
}

.package-preview-card:hover::before {
  animation: shine 1.5s ease-out;
}

@keyframes shine {
  100% {
    transform: translateX(100%);
  }
}

.package-preview-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
}

/* Custom Button Styles */
.btn-primary {
  background: linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
  color: white;
  font-weight: 600;
  padding: 14px 32px;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
  transition: width 0.3s ease;
  z-index: -1;
}

.btn-primary:hover::before {
  width: 100%;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(139, 92, 246, 0.3);
}

/* Package Detail Section */
.package-detail-section {
  scroll-margin-top: 120px;
  position: relative;
  padding: 120px 0;
}

.package-detail-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gradient-from), transparent);
}

/* Stats Counter */
.stat-number {
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  font-size: 3rem;
  background: linear-gradient(135deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Section Spacing */
section {
  position: relative;
}

@media (max-width: 768px) {
  section {
    padding: 60px 0;
  }

  .first-section {
    padding-top: 100px !important;
  }
}

/* Pro highlight */
.pro-highlight {
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3),
  0 0 60px rgba(139, 92, 246, 0.15),
  inset 0 0 20px rgba(255, 255, 255, 0.05);
  transform: scale(1.05);
}

/* Animation pulse cho badge */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
  }
}

.animate-pulse {
  animation: pulse var(--pulse-duration) infinite;
}

/* Animation glow khi đứng yên cho gói Pro */
@keyframes pro-glow {
  0%, 100% {
    box-shadow: 0 20px 40px rgba(139, 92, 246, 0.3),
    0 0 60px rgba(139, 92, 246, 0.15),
    inset 0 0 20px rgba(255, 255, 255, 0.05);
  }
  50% {
    box-shadow: 0 20px 40px rgba(139, 92, 246, 0.4),
    0 0 80px rgba(139, 92, 246, 0.25),
    inset 0 0 25px rgba(255, 255, 255, 0.08);
  }
}

.pro-highlight {
  animation: pro-glow var(--glow-duration) ease-in-out infinite;
}

/* Responsive cho mobile */
@media (max-width: 1024px) {
  .pro-highlight {
    animation: none;
    transform: none !important;
    width: 100% !important;
    position: relative !important;
    top: auto !important;
    left: auto !important;
    transform: none !important;
    margin: 20px 0;
  }

  /* Trên mobile, chuyển sang layout dọc */
  section.pt-32 .grid > div:last-child {
    position: relative;
    height: auto;
    min-height: 600px;
  }

  section.pt-32 .grid > div:last-child a {
    position: relative !important;
    width: 100% !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    transform: none !important;
    margin-bottom: 20px;
  }
}

/* Quick Navigation Styles */
#quickNav {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.quick-nav-item {
  position: relative;
  transition: all 0.3s ease;
}

.quick-nav-item.active > div {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
}

.quick-nav-item[data-package="plus"].active > div {
  background: rgba(59, 130, 246, 0.3) !important;
  border: 1px solid rgba(59, 130, 246, 0.7) !important;
}

.quick-nav-item[data-package="pro"].active > div {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%) !important;
  border: 1px solid rgba(139, 92, 246, 0.7) !important;
}

.quick-nav-item[data-package="premium"].active > div {
  background: rgba(245, 158, 11, 0.3) !important;
  border: 1px solid rgba(245, 158, 11, 0.7) !important;
}

/* Tooltip effect */
.quick-nav-item::after {
  content: attr(data-package);
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 15, 35, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  margin-right: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.quick-nav-item:hover::after {
  opacity: 1;
  visibility: visible;
}

/* Mobile responsive - CHỈ ẨN TRÊN MOBILE THỰC SỰ NHỎ */
@media (max-width: 768px) {
  #quickNav {
    display: none !important;
  }
}

/* Hiển thị trên tablet và desktop */
@media (min-width: 769px) {
  #quickNav {
    display: flex !important;
  }
}

@keyframes gradient-move {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-animate {
  background-size: 300% 300%;
  animation: gradient-move 4s ease infinite;
}

/* Hover effects */
.glass-card-custom:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

/* Hover cho các hàng trong bảng so sánh */
tbody tr:hover {
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.2s ease;
}

/* Hover cho các nút CTA thứ cấp */
button.bg-gradient-to-r:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

/* Hover cho các icon trong package details */
.fa-check-circle:hover,
.fa-crown:hover,
.fa-check:hover,
.fa-gem:hover,
.fa-star:hover {
  transform: scale(1.2);
  transition: transform 0.2s ease;
}

/* Thêm animation cho active state */
.quick-nav-item.active > div {
  animation: pulse-active 2s infinite;
}

@keyframes pulse-active {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
  }
}

/*!* Thêm hiệu ứng cho line khi active *!
.quick-nav-item.active::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  z-index: 1;
  z-index: 1;
}*/

.quick-nav-item[data-package="plus"].active::before {
  background: #3b82f6;
}

.quick-nav-item[data-package="pro"].active::before {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
}
.quick-nav-item[data-package="premium"].active::before {
  background: #f59e0b;
}
</style>