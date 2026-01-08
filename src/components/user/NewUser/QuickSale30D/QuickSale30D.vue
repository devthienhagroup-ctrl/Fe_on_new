<template>
  <div class="pt-20">
    <!-- Hero -->
    <section class="relative">
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>
        <div class="absolute -bottom-32 -right-24 w-[32rem] h-[32rem] bg-purple-500/10 blur-3xl rounded-full"></div>
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.12)_1px,transparent_0)] [background-size:22px_22px] opacity-30"></div>
      </div>

      <div class="container mx-auto px-6 py-16 lg:py-24 max-w-none">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p class="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-blue-400">
              <span class="w-2 h-2 rounded-full bg-blue-400"></span>
              {{ config.hero.tagline }}
            </p>

            <h1 class="mt-4 text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {{ config.hero.title }} <span class="text-purple-400">{{ config.hero.highlightedText1 }}</span><br/>
              {{ config.hero.subtitle }} <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{{ config.hero.highlightedText2 }}</span>
            </h1>

            <p class="mt-5 text-slate-300/90 leading-relaxed max-w-xl">
              {{ config.hero.description }}
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <a :href="config.buttons.solution.href"
                 class="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold
                        bg-purple-400/10 text-white border border-white/10
                        hover:bg-white/15 hover:border-white/20 transition">
                {{ config.buttons.solution.text }}
              </a>

              <a :href="config.buttons.register.href"
                 class="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold
                        btn-gradient glow transition">
                {{ config.buttons.register.text }}
              </a>
            </div>

            <div class="mt-8 flex flex-wrap gap-3 text-xs text-slate-400">
              <span v-for="tag in config.hero.tags" :key="tag"
                    class="px-3 py-1 rounded-full border border-white/10 bg-white/5">{{ tag }}</span>
            </div>
          </div>

          <!-- Right side card -->
          <div class="glass-card rounded-3xl p-8 shadow-glow"
               data-aos="fade-up" data-aos-delay="150">
            <h3 class="text-white font-extrabold text-xl">{{ config.timeline.title }}</h3>
            <p class="mt-2 text-sm text-slate-300/80">
              {{ config.timeline.description }}
            </p>

            <div class="mt-6 space-y-4">
              <div v-for="step in config.timeline.steps" :key="step.id" class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 grid place-items-center text-purple-300 font-bold">
                  {{ step.number }}
                </div>
                <div>
                  <p class="font-semibold text-white">{{ step.title }}</p>
                  <p class="text-sm text-slate-300/80">{{ step.description }}</p>
                </div>
              </div>
            </div>

            <div class="mt-7 flex flex-wrap gap-3">
              <button @click="openLoginModal" v-if="authStore.userInfo==null"
                      class="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold
                        bg-blue-400/10 text-white border border-white/10
                        hover:bg-white/15 hover:border-white/20 transition">
                Đăng nhập
              </button>
              <a :href="config.buttons.consult.href"
                 class="inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold
                        btn-gradient text-white transition">
                {{ config.buttons.consult.text }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Solutions -->
    <section id="giai-phap" class="relative py-14 lg:py-20">
      <div class="container mx-auto px-6">
        <div class="">
          <div class="text-center mb-16" data-aos="fade-up">
            <h2 class="text-4xl font-display font-bold text-white mb-4">{{ config.solutions.title }}</h2>
            <p class="mt-3 mb-2 text-slate-300/90">
              {{ config.solutions.description }}
            </p>
            <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
        </div>

        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              :quick-access-text="service.quickAccessText"
              show-login-button
          >
            {{ service.description }}
          </GlassCard>
        </div>
      </div>
    </section>

    <!-- START: Form Tra cứu thời gian bán -->
    <section id="tra-cuu" class="relative py-14 lg:py-20 border-t border-white/10">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-2xl md:text-3xl font-extrabold text-white">
            {{ searchFormTitle }}
          </h2>
          <p class="mt-3 text-slate-300/90">
            {{ searchFormDescription }}
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <!-- Form nhập thông tin -->
          <div class="glass-card rounded-2xl p-7">
            <form @submit.prevent="handleSearchSubmit" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <!-- Họ tên -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1.5">Họ tên <span class="text-rose-500">*</span></label>
                  <input type="text" required v-model="searchForm.hoTen"
                         class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                      text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                         :placeholder="searchFormPlaceholders.hoTen">
                </div>

                <!-- Số điện thoại -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1.5">Số điện thoại <span class="text-rose-500">*</span></label>
                  <input type="tel" required v-model="searchForm.soDienThoai"
                         class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                      text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                         :placeholder="searchFormPlaceholders.soDienThoai">
                </div>
              </div>

              <!-- Mail nhận thông báo -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5">Email nhận thông báo <span class="text-rose-500">*</span></label>
                <input type="email" required v-model="searchForm.email"
                       class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                    text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                       :placeholder="searchFormPlaceholders.email">
              </div>

              <!-- Khu vực địa chỉ, tỉnh thành bán -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <!-- Tỉnh/Thành phố với search -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1.5">Tỉnh/Thành phố <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <input type="text" required
                           v-model="provinceSearch"
                           @input="onProvinceInput"
                           @focus="showProvinceDropdown = true"
                           @blur="onProvinceBlur"
                           class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                                text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                           :placeholder="searchFormPlaceholders.tinhThanh">

                    <!-- Dropdown tỉnh/thành -->
                    <div v-if="showProvinceDropdown && filteredProvinces.length > 0"
                         class="scrollbar-custom absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-slate-900/95 border border-white/20 rounded-xl shadow-lg backdrop-blur-sm">
                      <div v-for="province in filteredProvinces"
                           :key="province.code"
                           @mousedown="selectProvince(province)"
                           class="px-4 py-3 cursor-pointer hover:bg-white/10 text-white text-sm border-b border-white/5 last:border-b-0 transition-colors">
                        {{ province.name }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Phường/Xã với search -->
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1.5">Phường/Xã <span class="text-rose-500">*</span></label>
                  <div class="relative">
                    <input type="text" required
                           v-model="wardSearch"
                           @input="onWardInput"
                           @focus="showWardDropdown = selectedProvince !== null"
                           :disabled="!selectedProvince"
                           class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                                text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                                disabled:opacity-50 disabled:cursor-not-allowed"
                           :placeholder="selectedProvince ? 'Tìm phường/xã...' : 'Vui lòng chọn tỉnh trước'">

                    <!-- Dropdown phường/xã -->
                    <div v-if="showWardDropdown && filteredWards.length > 0 && selectedProvince"
                         class="scrollbar-custom absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-slate-900/95 border border-white/20 rounded-xl shadow-lg backdrop-blur-sm">
                      <div v-for="ward in filteredWards"
                           :key="ward.code"
                           @mousedown="selectWard(ward)"
                           class="px-4 py-3 cursor-pointer hover:bg-white/10 text-white text-sm border-b border-white/5 last:border-b-0 transition-colors">
                        {{ ward.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Địa chỉ chi tiết -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5">Địa chỉ chi tiết</label>
                <input type="text" v-model="searchForm.diaChiChiTiet"
                       class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                    text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                       :placeholder="searchFormPlaceholders.diaChiChiTiet">
              </div>

              <!-- Số tờ & Số thửa -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1.5">Số tờ</label>
                  <input type="text" v-model="searchForm.soTo"
                         class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                      text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                         :placeholder="searchFormPlaceholders.soTo">
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1.5">Số thửa</label>
                  <input type="text" v-model="searchForm.soThua"
                         class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                      text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                         :placeholder="searchFormPlaceholders.soThua">
                </div>
              </div>

              <!-- Diện tích & Diện tích sàn -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1.5">Diện tích đất (m²) <span class="text-rose-500">*</span></label>
                  <input type="number" step="0.1" required v-model="searchForm.dienTichDat"
                         class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                      text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                         :placeholder="searchFormPlaceholders.dienTichDat">
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-1.5">Diện tích sàn (m²)</label>
                  <input type="number" step="0.1" v-model="searchForm.dienTichSan"
                         class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                      text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                         :placeholder="searchFormPlaceholders.dienTichSan">
                </div>
              </div>

              <!-- Quyền sử dụng đất -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5">Quyền sử dụng đất <span class="text-rose-500">*</span></label>
                <select required v-model="searchForm.quyenSuDungDat"
                        class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                     text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                  <option value="">{{ searchFormPlaceholders.quyenSuDungDat }}</option>
                  <option v-for="option in landUseOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Kết cấu -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5">Kết cấu công trình</label>
                <input type="text" v-model="searchForm.ketCauCongTrinh"
                       class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                    text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                       :placeholder="searchFormPlaceholders.ketCauCongTrinh">
              </div>

              <!-- Giá mong muốn bán -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5">Giá mong muốn bán (tỷ VNĐ) <span class="text-rose-500">*</span></label>
                <div class="relative">
                  <input type="number" step="0.1" required v-model="searchForm.giaMongMuon"
                         class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                      text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                         :placeholder="searchFormPlaceholders.giaMongMuon">
                  <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                    tỷ VNĐ
                  </div>
                </div>
                <p class="text-xs text-slate-500 mt-1">{{ priceHint }}</p>
              </div>

              <!-- Nút submit -->
              <div class="pt-3">
                <button type="submit"
                        class="btn-gradient w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold
                     transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ config.buttons.search.text }}
                </button>
              </div>
            </form>
          </div>

          <!-- Kết quả dự đoán (sẽ hiển thị sau khi submit) -->
          <div v-if="searchResult.show" id="ket-qua-du-doan" class="glass-card rounded-2xl p-7 border-2 border-purple-500/30">
            <div class="text-center mb-6">
              <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-400/30 mb-4">
                <svg class="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white">{{ searchResultTitle }}</h3>
              <p class="text-slate-300 mt-2">{{ searchResultSubtitle }}</p>
            </div>

            <div class="space-y-6">
              <!-- Thông tin khu vực -->
              <div class="bg-slate-900/50 rounded-xl p-5 border border-white/10">
                <div class="flex items-center gap-3 mb-3">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <h4 class="font-bold text-white">{{ searchResultAreaInfo.title }}</h4>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-slate-400">{{ searchResultAreaInfo.province }}</p>
                    <p class="text-white font-medium">{{ searchResult.tinhThanh }}</p>
                  </div>
                  <div>
                    <p class="text-slate-400">{{ searchResultAreaInfo.district }}</p>
                    <p class="text-white font-medium">{{ searchResult.quanHuyen }}</p>
                  </div>
                </div>
                <div class="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p class="text-xs text-purple-300">{{ searchResultAreaInfo.highDemand }}</p>
                </div>
              </div>

              <!-- Thời gian bán dự kiến -->
              <div class="bg-slate-900/50 rounded-xl p-5 border border-purple-400/20">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">{{ searchResultEstimatedTime.title }}</p>
                    <p class="text-3xl font-bold text-white mt-1">
                      {{ searchResult.ngayBan }} ngày
                    </p>
                    <p class="text-sm text-slate-300 mt-1">{{ searchResultEstimatedTime.subtitle }}</p>
                  </div>
                  <div class="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <div class="mt-4">
                  <div class="flex justify-between text-sm text-slate-400 mb-1">
                    <span>0 ngày</span>
                    <span>30 ngày</span>
                  </div>
                  <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r to-purple-500 from-blue-500 rounded-full" :style="{ width: progressWidth }"></div>
                  </div>
                  <!-- Sửa dòng này: hiển thị phần trăm cứng từ searchResult.phanTram -->
                  <p class="text-xs text-purple-400 mt-2">
                    Nhà phố của bạn có {{ searchResult.phanTram }}% khả năng bán trong vòng 30 ngày
                  </p>
                </div>
              </div>

              <!-- Giá đề xuất -->
              <div class="bg-slate-900/50 rounded-xl p-5 border border-blue-400/20">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-slate-400 text-sm">{{ searchResultSuggestedPrice.title }}</p>
                    <p class="text-3xl font-bold text-white mt-1">
                      {{ searchResult.giaDeXuat }} tỷ VNĐ
                    </p>
                    <p class="text-sm text-slate-300 mt-1">{{ searchResultSuggestedPrice.subtitle }}</p>
                  </div>
                  <div class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div class="p-3 bg-slate-800/50 rounded-lg">
                    <p class="text-slate-400">{{ searchResultSuggestedPrice.compare }}</p>
                    <p :class="chenhLechClass">{{ chenhLechText }}</p>
                  </div>
                  <div class="p-3 bg-slate-800/50 rounded-lg">
                    <p class="text-slate-400">{{ searchResultSuggestedPrice.average }}</p>
                    <p class="text-white font-semibold">{{ (searchResult.giaDeXuat * 0.96).toFixed(1) }} tỷ</p>
                  </div>
                </div>
              </div>

              <!-- Khuyến nghị -->
              <div class="bg-slate-900/50 rounded-xl p-5">
                <h4 class="font-bold text-white mb-3 flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ searchResultRecommendations.title }}
                </h4>
                <ul class="space-y-3">
                  <li v-for="rec in searchResultRecommendations.items" :key="rec" class="flex items-start gap-3">
                    <span class="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm mt-0.5 flex-shrink-0">✓</span>
                    <span class="text-sm text-slate-300">{{ rec }}</span>
                  </li>
                </ul>
              </div>

              <!-- Nút đăng nhập để xem chi tiết -->
              <div class="text-center pt-4">
                <router-link to="#"
                             class="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold
                 text-white
                transition-all duration-300 w-full shadow-lg hover:shadow-purple-500/25">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>
                  {{ authStore.userInfo == null ? config.buttons.loginToView.text : config.buttons.viewDetails.text }}
                </router-link>
                <p class="text-xs text-slate-500 mt-3">{{ searchResultSavedNotice }}</p>
              </div>
            </div>
          </div>

          <!-- Placeholder trước khi submit -->
          <div v-else class="glass-card rounded-2xl p-7 border-2 border-dashed border-white/20" id="placeholder-ket-qua">
            <div class="text-center py-10">
              <div
                  class="w-24 h-24 mx-auto rounded-full bg-slate-900/70 flex items-center justify-center border border-white/10 mb-6">
                <svg class="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">{{ searchResultPlaceholder.title }}</h3>
              <p class="text-slate-400">{{ searchResultPlaceholder.description }}</p>
              <ul class="text-sm text-slate-400 mt-4 space-y-2 text-left max-w-sm mx-auto">
                <li v-for="item in searchResultPlaceholder.items" :key="item.text" class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full" :class="item.colorClass"></span>
                  {{ item.text }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Slider Dự án đã bán (Social Proof) -->
    <section id="du-an-da-ban" class="relative py-14 lg:py-20 border-t border-white/10">
      <div class="container mx-auto px-6">
        <div class="max-w-2xl">
          <h2 class="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {{ config.soldProjects.title }}
          </h2>
          <p class="mt-3 text-slate-300/90">
            {{ config.soldProjects.description }}
          </p>
        </div>

        <div class="mt-10 relative">
          <div class="flex overflow-x-auto pb-6 gap-5 scroll-snap-x custom-scrollbar" data-aos="fade-up">
            <SoldProjectCard
                v-for="project in config.soldProjects.items"
                :key="project.id"
                :project="project"
                @view-details="handleViewProjectDetails"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Process -->
    <section id="quy-trinh" class="relative py-14 lg:py-20 border-t border-white/10">
      <div class="container mx-auto px-6">
        <div class="flex lg:flex-row lg:items-end lg:justify-between gap-6">
          <div class="max-w-2xl">
            <h2 class="text-2xl md:text-3xl font-extrabold text-white">{{ config.process.title }}</h2>
            <p class="mt-3 text-slate-300/90">
              {{ config.process.description }}
            </p>
          </div>

          <a :href="config.buttons.dashboard.href"
             class="inline-flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold
                  bg-white/10 text-white border border-white/10
                  hover:bg-white/15 hover:border-white/20 transition">
            {{ config.buttons.dashboard.text }}
          </a>
        </div>

        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="step in config.process.steps" :key="step.id" class="glass-card rounded-2xl p-7">
            <p class="text-sm text-purple-500 font-semibold">{{ step.label }}</p>
            <p class="mt-2 text-white font-bold text-lg">{{ step.title }}</p>
            <p class="mt-2 text-sm text-slate-300/80">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Đánh giá khách hàng -->
    <section id="danh-gia" class="relative py-14 lg:py-20 border-t border-white/10">
      <div class="container mx-auto px-6">
        <div class="max-w-2xl">
          <h2 class="text-2xl md:text-3xl font-extrabold text-white">{{ config.testimonials.title }}</h2>
          <p class="mt-3 text-slate-300/90">
            {{ config.testimonials.description }}
          </p>
        </div>

        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TestimonialCard
              v-for="testimonial in config.testimonials.items"
              :key="testimonial.id"
              :name="testimonial.name"
              :position="testimonial.position"
              :quote="testimonial.quote"
              :initials="testimonial.initials"
              :color="testimonial.color"
              :rating="testimonial.rating"
          />
        </div>
      </div>
    </section>

    <!-- Contact (Đã mở rộng) -->
    <section id="lien-he" class="relative py-10 lg:py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="glass-card rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10">
          <!-- Thay đổi flex container -->
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-10">
            <!-- Phần nội dung bên trái -->
            <div class="lg:max-w-lg">
              <div class="flex items-center justify-center lg:justify-start">
                <img src="/imgs/logoTHG.png" alt="logo Thiên Hà Group" class="w-32 md:w-40 lg:w-48 mb-4"/>
              </div>
              <h2 class="text-xl md:text-2xl lg:text-3xl font-extrabold text-white text-center lg:text-left">
                {{ contactTitle }}
              </h2>
              <p class="mt-3 text-slate-300/90 text-sm md:text-base text-center lg:text-left">
                {{ contactDescription }}
              </p>
            </div>

            <!-- Form bên phải -->
            <form class="w-full lg:max-w-xl space-y-4">
              <!-- Grid cho 2 cột trên mobile -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="text-xs md:text-sm text-slate-400">{{ contactFormLabels.name }}</label>
                  <input type="text" :placeholder="contactFormPlaceholders.name" required
                         class="mt-1 w-full rounded-lg md:rounded-xl bg-slate-950/60 border border-white/10 px-4 py-3
                            text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
                </div>

                <div>
                  <label class="text-xs md:text-sm text-slate-400">{{ contactFormLabels.phone }}</label>
                  <input type="tel" :placeholder="contactFormPlaceholders.phone" required
                         class="mt-1 w-full rounded-lg md:rounded-xl bg-slate-950/60 border border-white/10 px-4 py-3
                            text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
                </div>

                <div>
                  <label class="text-xs md:text-sm text-slate-400">{{ contactFormLabels.propertyType }}</label>
                  <select class="mt-1 w-full rounded-lg md:rounded-xl bg-slate-950/60 border border-white/10 px-4 py-3
                            text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                    <option value="">{{ contactFormPlaceholders.propertyType }}</option>
                    <option v-for="type in propertyTypes" :key="type.value" :value="type.value">
                      {{ type.label }}
                    </option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="text-xs md:text-sm text-slate-400">{{ contactFormLabels.area }}</label>
                  <input type="text" :placeholder="contactFormPlaceholders.area" required
                         class="mt-1 w-full rounded-lg md:rounded-xl bg-slate-950/60 border border-white/10 px-4 py-3
                            text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
                </div>

                <div class="md:col-span-2">
                  <label class="text-xs md:text-sm text-slate-400">{{ contactFormLabels.address }}</label>
                  <textarea :placeholder="contactFormPlaceholders.address" rows="2"
                            class="mt-1 w-full rounded-lg md:rounded-xl bg-slate-950/60 border border-white/10 px-4 py-3
                            text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"></textarea>
                </div>

                <div class="md:col-span-2">
                  <label class="text-xs md:text-sm text-slate-400">{{ contactFormLabels.price }}</label>
                  <input type="number" :placeholder="contactFormPlaceholders.price" step="0.1"
                         class="mt-1 w-full rounded-lg md:rounded-xl bg-slate-950/60 border border-white/10 px-4 py-3
                            text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"/>
                </div>
              </div>

              <!-- Nút bấm - thay đổi layout trên mobile -->
              <div class="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit"
                        class="btn-gradient flex-1 inline-flex items-center justify-center px-5 py-3 rounded-lg md:rounded-xl text-sm font-semibold
                           transition order-2 sm:order-1">
                  {{ config.buttons.submit.text }}
                </button>
                <button v-if="authStore.userInfo==null" @click="openLoginModal" type="button"
                        class="inline-flex items-center justify-center px-5 py-3 rounded-lg md:rounded-xl text-sm font-semibold
                      bg-blue-400/10 text-white border border-white/10
                      hover:bg-white/15 hover:border-white/20 transition order-1 sm:order-2">
                  Đăng nhập ngay
                </button>
              </div>

              <p class="text-xs text-slate-500 leading-relaxed text-center lg:text-left">
                {{ contactPrivacyNotice }}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, onUnmounted } from "vue";
import GlassCard from "../../UI/GlassCard.vue";
import TestimonialCard from "../../UI/TestimonialCard.vue";
import SoldProjectCard from "../../UI/SoldProjectCard.vue";
import { useAuthStore } from "../../../../stores/authStore.js";
import addressData from "../../../../assets/js/address.json"
import Fuse from "fuse.js";
import api from "../../../../api/api.js";

// Data từ address.json
const provinces = ref([]);
const selectedProvince = ref(null);

// Fuse.js instances
let provinceFuse = null;
let wardFuse = null;

// State cho search và dropdown
const provinceSearch = ref(''); // Biến riêng cho search tỉnh
const wardSearch = ref(''); // Biến riêng cho search phường
const showProvinceDropdown = ref(false);
const showWardDropdown = ref(false);
const filteredProvinces = ref([]);
const filteredWards = ref([]);

// Khởi tạo dữ liệu địa chỉ
const initializeAddressData = () => {
  provinces.value = addressData.map(province => ({
    name: province.name,
    code: province.code,
    codename: province.codename,
    phone_code: province.phone_code,
    wards: province.wards || []
  }));

  // Khởi tạo Fuse.js cho tỉnh
  provinceFuse = new Fuse(provinces.value, {
    keys: ['name', 'codename'],
    threshold: 0.3,
    includeScore: true
  });
};

// Xử lý input tỉnh
const onProvinceInput = () => {
  if (!provinceFuse) return;

  const searchTerm = provinceSearch.value.trim();
  if (searchTerm.length === 0) {
    filteredProvinces.value = provinces.value.slice(0, 10);
  } else {
    const results = provinceFuse.search(searchTerm);
    filteredProvinces.value = results.map(result => result.item).slice(0, 10);
  }
  showProvinceDropdown.value = true;
};

// Xử lý blur tỉnh
const onProvinceBlur = () => {
  setTimeout(() => {
    showProvinceDropdown.value = false;
  }, 200);
};

// Chọn tỉnh
const selectProvince = (province) => {
  selectedProvince.value = province;
  provinceSearch.value = province.name;
  searchForm.tinhThanh = province.name; // Gán vào searchForm.tinhThanh

  // Reset phường/xã
  wardSearch.value = '';
  searchForm.quanHuyen = '';
  filteredWards.value = [];
  showProvinceDropdown.value = false;
  showWardDropdown.value = false;

  // Khởi tạo Fuse.js cho phường/xã của tỉnh này
  if (province.wards && province.wards.length > 0) {
    wardFuse = new Fuse(province.wards, {
      keys: ['name', 'codename', 'short_codename'],
      threshold: 0.3,
      includeScore: true
    });
    filteredWards.value = province.wards.slice(0, 10);
  }
};

// Xử lý input phường/xã
const onWardInput = () => {
  if (!wardFuse || !selectedProvince.value) return;

  const searchTerm = wardSearch.value.trim();
  if (searchTerm.length === 0) {
    filteredWards.value = selectedProvince.value.wards.slice(0, 10);
  } else {
    const results = wardFuse.search(searchTerm);
    filteredWards.value = results.map(result => result.item).slice(0, 10);
  }
  showWardDropdown.value = true;
};

// Xử lý blur phường/xã
const onWardBlur = () => {
  setTimeout(() => {
    showWardDropdown.value = false;
  }, 200);
};

// Chọn phường/xã
const selectWard = (ward) => {
  wardSearch.value = ward.name;
  searchForm.quanHuyen = ward.name; // Gán vào searchForm.quanHuyen
  showWardDropdown.value = false;
};

const authStore = useAuthStore();

const openLoginModal = () => {
  window.dispatchEvent(new Event('open-login-modal'));
}

// ========== FORM CONFIG (SET CỨNG) ==========
const searchFormTitle = 'Tra cứu thời gian bán trên chính sản phẩm của bạn';
const searchFormDescription = 'Nhập thông tin nhà phố của bạn - hệ thống AI của chúng tôi sẽ dự đoán chính xác thời gian bán và giá đề xuất trong vòng 30 ngày.';

const searchFormPlaceholders = {
  hoTen: 'Nguyễn Văn A',
  soDienThoai: '0912 345 678',
  email: 'example@gmail.com',
  tinhThanh: 'Chọn tỉnh/thành phố',
  quanHuyen: 'VD: Quận 2, Quận 7, Bình Thạnh...',
  diaChiChiTiet: 'VD: Số 123, đường Nguyễn Văn Linh, Phường Tân Phong',
  soTo: 'VD: 123',
  soThua: 'VD: 456',
  dienTichDat: 'VD: 100',
  dienTichSan: 'VD: 350',
  quyenSuDungDat: 'Chọn loại quyền sử dụng',
  ketCauCongTrinh: 'VD: Nhà 4 tầng, 1 hầm, 5 phòng ngủ, 2 WC, nội thất cao cấp',
  giaMongMuon: 'VD: 15.5'
};

const landUseOptions = [
  { value: 'so-do', label: 'Sổ đỏ (Sở hữu lâu dài)' },
  { value: 'so-hong', label: 'Sổ hồng (Nhà nước cho thuê đất)' },
  { value: 'hop-dong', label: 'Hợp đồng thuê đất' },
  { value: 'chua-co', label: 'Chưa có sổ' },
  { value: 'giay-to-khac', label: 'Giấy tờ khác' }
];

const priceHint = 'Nhập giá bạn mong muốn bán (đơn vị: tỷ đồng)';

// ========== SEARCH RESULT CONFIG (SET CỨNG) ==========
const searchResultTitle = 'Kết quả dự đoán';
const searchResultSubtitle = 'Dựa trên phân tích AI và dữ liệu thị trường thực tế';

const searchResultAreaInfo = {
  title: 'Thông tin khu vực',
  province: 'Tỉnh/Thành phố:',
  district: 'Quận/Huyện:',
  highDemand: '✓ Khu vực này có nhu cầu mua cao trong 3 tháng gần đây'
};

const searchResultEstimatedTime = {
  title: 'Thời gian bán dự kiến',
  subtitle: 'Dưới mục tiêu 30 ngày'
};

const searchResultSuggestedPrice = {
  title: 'Giá đề xuất tối ưu',
  subtitle: 'Giá thị trường chấp nhận: {min} - {max} tỷ',
  compare: 'So với giá mong muốn',
  average: 'Giá trung bình khu vực'
};

const searchResultRecommendations = {
  title: 'Khuyến nghị của chuyên gia',
  items: [
    'Cần chụp ảnh chuyên nghiệp và quay video 360° để tăng 40% lượt xem',
    'Nên tập trung marketing vào nhóm khách đầu tư sinh lời',
    'Hoàn thiện hồ sơ pháp lý trước khi niêm yết để tăng độ tin cậy'
  ]
};

const searchResultSavedNotice = 'Kết quả đã được lưu vào tài khoản của bạn';

const searchResultPlaceholder = {
  title: 'Kết quả dự đoán sẽ hiển thị tại đây',
  description: 'Sau khi nhập đầy đủ thông tin và nhấn "Tra cứu", hệ thống sẽ phân tích và hiển thị:',
  items: [
    { text: 'Thời gian bán dự kiến (dưới 30 ngày)', colorClass: 'bg-blue-500' },
    { text: 'Giá đề xuất tối ưu cho giao dịch', colorClass: 'bg-cyan-500' },
    { text: 'Phân tích thị trường khu vực', colorClass: 'bg-purple-500' },
    { text: 'Khuyến nghị từ chuyên gia BĐS', colorClass: 'bg-teal-500' }
  ]
};

// ========== CONTACT FORM CONFIG (SET CỨNG) ==========
const contactTitle = 'Đăng ký bán nhà phố trong 30 ngày';
const contactDescription = 'Để lại thông tin, đội ngũ Thiên Hà Group sẽ liên hệ tư vấn định giá và lộ trình bán phù hợp.';

const contactFormLabels = {
  name: 'Họ và tên *',
  phone: 'Số điện thoại *',
  propertyType: 'Loại BĐS *',
  area: 'Khu vực nhà phố *',
  address: 'Địa chỉ chi tiết',
  price: 'Giá mong muốn (tỷ VNĐ)'
};

const contactFormPlaceholders = {
  name: 'Nguyễn Văn A',
  phone: '09xx xxx xxx',
  propertyType: 'Chọn loại BĐS',
  area: 'VD: Quận 2, Quận 7, Bình Thạnh, Thủ Đức...',
  address: 'Số nhà, đường, phường...',
  price: 'VD: 15'
};

const propertyTypes = [
  { value: 'nha-pho', label: 'Nhà phố' },
  { value: 'shophouse', label: 'Shophouse' },
  { value: 'biet-thu', label: 'Biệt thự' },
  { value: 'can-ho', label: 'Căn hộ' },
  { value: 'dat-nen', label: 'Đất nền' }
];

const contactPrivacyNotice = 'Bằng việc gửi thông tin, bạn đồng ý để Thiên Hà Group liên hệ tư vấn. Dữ liệu được bảo mật theo chính sách.';

// CONFIG OBJECT - Tất cả dữ liệu được quản lý qua CMS (đã loại bỏ phần form)
const config = ref({
  // ========== STYLE CONFIG ==========
  styles: {
    colors: {
      blue400: 'var(--color-blue-400)',
      blue500: 'var(--color-blue-500)',
      blue600: 'var(--color-blue-600)',
      purple400: 'var(--color-purple-500)',
      purple500: 'var(--color-purple-500)',
      purple600: 'var(--color-purple-600)',
      teal500: 'var(--color-teal-500)',
      slate300: 'var(--color-slate-300)',
      slate400: 'var(--color-slate-400)',
      slate500: '#64748b',
      slate700: 'var(--color-slate-700)',
      slate800: 'var(--color-slate-800)',
      slate900: 'var(--color-slate-900)',
      emerald500: 'var(--color-emerald-500)',
      rose500: '#f43f5e'
    },
    gradients: {
      hero: 'from-blue-400 to-purple-500',
      solutions: 'from-blue-500 to-purple-600',
      soldProjects: 'from-blue-400 to-purple-500'
    }
  },

  // ========== HERO SECTION ==========
  hero: {
    tagline: 'GIẢI PHÁP CÔNG NGHỆ THIÊN HÀ GROUP',
    title: 'Bán nhanh',
    highlightedText1: 'nhà phố',
    subtitle: 'trong',
    highlightedText2: '30 ngày',
    description: 'Chuẩn hoá quy trình bán + dữ liệu thị trường + theo dõi tiến độ real-time giúp bạn định giá đúng, tiếp cận đúng tệp khách và chốt nhanh – minh bạch.',
    tags: ['Định giá theo dữ liệu', 'Lọc khách chất lượng', 'Hỗ trợ pháp lý']
  },

  // ========== TIMELINE ==========
  timeline: {
    title: 'Tóm tắt lộ trình 30 ngày',
    description: 'Theo dõi từng bước, cập nhật minh bạch, tối ưu liên tục theo phản hồi thị trường.',
    steps: [
      {
        id: 1,
        number: '1',
        title: 'Ngày 1–3: Khảo sát & định giá',
        description: 'Chốt mức giá mục tiêu + chiến lược thương lượng.'
      },
      {
        id: 2,
        number: '2',
        title: 'Ngày 4–10: Chuẩn hoá hồ sơ & marketing',
        description: 'Ảnh/clip, mô tả chuẩn, phân phối đa kênh đúng tệp.'
      },
      {
        id: 3,
        number: '3',
        title: 'Ngày 11–25: Dẫn khách & tối ưu',
        description: 'Lọc khách, tăng lịch hẹn, tối ưu theo phản hồi thực.'
      },
      {
        id: 4,
        number: '4',
        title: 'Ngày 26–30: Đàm phán & chốt',
        description: 'Check pháp lý, đặt cọc, công chứng sang tên.'
      }
    ]
  },

  // ========== BUTTONS ==========
  buttons: {
    solution: {
      text: 'Xem giải pháp',
      href: '#giai-phap'
    },
    register: {
      text: 'Đăng ký bán ngay',
      href: '#lien-he'
    },
    consult: {
      text: 'Nhận tư vấn',
      href: '#lien-he'
    },
    search: {
      text: 'Tra cứu thời gian bán'
    },
    loginToView: {
      text: 'Đăng nhập để xem phân tích chi tiết'
    },
    viewDetails: {
      text: 'Xem chi tiết phân tích'
    },
    dashboard: {
      text: 'Mở dashboard tiến độ',
      href: '#'
    },
    submit: {
      text: 'Gửi đăng ký'
    },
  },

  // ========== SOLUTIONS SECTION ==========
  solutions: {
    title: 'Giải pháp bán nhanh nhà phố trong 30 ngày',
    description: 'Tập trung vào 3 trụ cột: định giá đúng, marketing đúng, theo dõi tiến độ rõ.'
  },

  // ========== SERVICES ==========
  services: [
    {
      id: 1,
      title: 'Định giá theo dữ liệu',
      description: 'Phân tích thị trường, so sánh giao dịch thực tế, đề xuất mức giá tối ưu theo mục tiêu chốt nhanh.',
      color: 'blue',
      link: null,
      linkText: null,
      iconName: 'fa-solid fa-chart-line',
      iconClass: 'w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '100',
      quickAccessText: 'Đăng ký bán ngay',
      quickAccessUrl: '#'
    },
    {
      id: 2,
      title: 'Marketing đa kênh thông minh',
      description: 'Chuẩn hoá nội dung, ảnh/clip, phân phối đúng tệp khách mua nhà phố — tăng lịch hẹn, giảm khách ảo.',
      color: 'purple',
      link: null,
      linkText: null,
      iconName: 'fa-solid fa-bullhorn',
      iconClass: 'w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '200',
      quickAccessText: 'Đăng ký bán ngay',
      quickAccessUrl: '#lien-he'
    },
    {
      id: 3,
      title: 'Dự án & Tiến độ (Real-time)',
      description: 'Theo dõi lượt xem – phản hồi – lịch dẫn khách – đàm phán – checklist pháp lý. Rõ ràng từng ngày.',
      color: 'teal',
      link: null,
      linkText: null,
      iconName: 'fa-solid fa-chart-gantt',
      iconClass: 'w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '300',
      quickAccessText: 'Đăng ký bán ngay',
      quickAccessUrl: '#'
    },
    {
      id: 4,
      title: 'Chuẩn hoá hồ sơ pháp lý',
      description: 'Kiểm tra và hoàn thiện giấy tờ pháp lý, đảm bảo giao dịch minh bạch, nhanh chóng và an toàn.',
      color: 'teal',
      link: null,
      linkText: null,
      iconName: 'fa-solid fa-file-contract',
      iconClass: 'w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '100',
      quickAccessText: 'Đăng ký bán ngay',
      quickAccessUrl: '#'
    },
    {
      id: 5,
      title: 'Lọc khách chất lượng',
      description: 'Hệ thống sàng lọc và phân loại khách hàng tiềm năng, tập trung vào khách có nhu cầu thực.',
      color: 'blue',
      link: null,
      linkText: null,
      iconName: 'fa-solid fa-filter',
      iconClass: 'w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '200',
      quickAccessText: 'Đăng ký bán ngay',
      quickAccessUrl: '#lien-he'
    },
    {
      id: 6,
      title: 'Hỗ trợ đàm phán & chốt deal',
      description: 'Tư vấn chiến lược đàm phán, hỗ trợ thương lượng và hoàn tất thủ tục chuyển nhượng.',
      color: 'purple',
      link: null,
      linkText: null,
      iconName: 'fa-solid fa-handshake',
      iconClass: 'w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white',
      padding: 'large',
      hoverEffect: true,
      aos: 'fade-up',
      aosDelay: '300',
      quickAccessText: 'Đăng ký bán ngay',
      quickAccessUrl: '#'
    }
  ],

  // ========== SOLD PROJECTS ==========
  soldProjects: {
    title: 'Dự án đã bán thành công',
    description: 'Khách hàng tin tưởng – Nhà phố được bán nhanh trong 30 ngày. Dưới đây là các giao dịch tiêu biểu.',
    items: [
      {
        id: 1,
        type: 'Nhà phố 4 tầng',
        location: 'Quận 2, TP.HCM',
        status: 'ĐÃ BÁN',
        price: 14.5,
        saleTime: '28 ngày',
        priceDifference: 8,
        imageUrl: '',
        imageClass: 'bg-gradient-to-br from-purple-500/20 to-blue-500/10'
      },
      {
        id: 2,
        type: 'Nhà mặt tiền',
        location: 'Quận 7, TP.HCM',
        status: 'ĐÃ BÁN',
        price: 9.2,
        saleTime: '22 ngày',
        priceDifference: 12,
        imageUrl: '/imgs/projects/nha-mat-tien-q7.jpg',
        imageClass: 'bg-gradient-to-br from-blue-500/20 to-purple-500/10'
      },
      {
        id: 3,
        type: 'Nhà phố Shophouse',
        location: 'Quận Bình Thạnh',
        status: 'ĐÃ BÁN',
        price: '22 tỷ VNĐ',
        saleTime: '30 ngày',
        priceDifference: 5,
        imageUrl: '',
        imageClass: 'bg-gradient-to-br from-purple-500/20 to-pink-500/10'
      },
      {
        id: 4,
        type: 'Nhà phố cao cấp',
        location: 'Thủ Đức, TP.HCM',
        status: 'ĐÃ BÁN',
        price: 18.7,
        saleTime: '25 ngày',
        priceDifference: 10,
        imageUrl: '/imgs/projects/nha-pho-thu-duc.jpg',
        imageClass: 'bg-gradient-to-br from-amber-500/20 to-orange-500/10'
      }
    ]
  },

  // ========== PROCESS ==========
  process: {
    title: 'Quy trình chuẩn hoá',
    description: 'Từ khảo sát tài sản đến công chứng — mọi bước được quản lý trên hệ thống, giảm rủi ro và tăng tốc chốt.',
    steps: [
      {
        id: 1,
        label: 'Bước 1',
        title: 'Chuẩn hoá thông tin nhà phố',
        description: 'Pháp lý, hiện trạng, ưu điểm vị trí, công năng, lộ giới/hẻm, tiện ích xung quanh.'
      },
      {
        id: 2,
        label: 'Bước 2',
        title: 'Thiết lập chiến dịch bán',
        description: 'Mức giá mục tiêu, thông điệp, tệp khách, kịch bản tư vấn & bộ câu hỏi sàng lọc.'
      },
      {
        id: 3,
        label: 'Bước 3',
        title: 'Dẫn khách & cập nhật phản hồi',
        description: 'Ghi nhận phản hồi theo từng lượt xem để tối ưu giá/chiến lược và tăng tỷ lệ chốt.'
      },
      {
        id: 4,
        label: 'Bước 4',
        title: 'Đàm phán – đặt cọc – công chứng',
        description: 'Checklist giấy tờ rõ ràng, giảm sai sót và đảm bảo an toàn giao dịch.'
      }
    ]
  },

  // ========== TESTIMONIALS ==========
  testimonials: {
    title: 'Khách hàng nói gì về chúng tôi',
    description: 'Hàng trăm chủ nhà đã tin tưởng và bán thành công nhà phố trong 30 ngày.',
    items: [
      {
        id: 1,
        name: 'Nguyễn Thị Mai',
        position: 'Chủ nhà phố, Q.2',
        quote: 'Tôi đã thử bán tự do 6 tháng không được. Nhờ Thiên Hà Group, nhà bán được sau 24 ngày với giá cao hơn dự kiến 10%. Rất chuyên nghiệp!',
        initials: 'NM',
        color: 'blue',
        rating: 5
      },
      {
        id: 2,
        name: 'Trần Văn Minh',
        position: 'Chủ shophouse, Bình Thạnh',
        quote: 'Dịch vụ định giá theo dữ liệu rất chuẩn. Team marketing đa kênh giúp tôi tiếp cận đúng khách thiệt, giảm 90% khách ảo. Highly recommend!',
        initials: 'TM',
        color: 'purple',
        rating: 5
      },
      {
        id: 3,
        name: 'Lê Thị Hương',
        position: 'Chủ nhà phố, Thủ Đức',
        quote: 'Dashboard theo dõi tiến độ real-time giúp tôi yên tâm. Mọi thứ minh bạch, hỗ trợ pháp lý rất tận tình. Cảm ơn Thiên Hà Group!',
        initials: 'LT',
        color: 'emerald',
        rating: 5
      }
    ]
  }
});

// Reactive data cho form tra cứu
const searchForm = reactive({
  hoTen: '',
  soDienThoai: '',
  email: '',
  tinhThanh: '',
  quanHuyen: '',
  diaChiChiTiet: '',
  soTo: '',
  soThua: '',
  dienTichDat: '',
  dienTichSan: '',
  quyenSuDungDat: '',
  ketCauCongTrinh: '',
  giaMongMuon: ''
});

// Reactive data cho kết quả
const searchResult = reactive({
  show: false,
  tinhThanh: '',
  quanHuyen: '',
  ngayBan: 0,
  giaDeXuat: 0,
  chenhLech: 0,
  phanTram: 0
});

// Computed property cho chênh lệch giá
const chenhLechText = computed(() => {
  return searchResult.chenhLech > 0
      ? `+${searchResult.chenhLech}%`
      : `${searchResult.chenhLech}%`;
});

const chenhLechClass = computed(() => {
  return searchResult.chenhLech > 0
      ? 'text-green-400 font-semibold'
      : 'text-rose-400 font-semibold';
});

// Computed property cho progress bar
const progressWidth = computed(() => {
  return `${100 - searchResult.phanTram}%`;
});

// Hàm xử lý submit form - giữ nguyên logic cũ
const handleSearchSubmit = (e) => {
  e.preventDefault();

  // Giả lập tính toán dựa trên dữ liệu nhập
  let heSoKhuVuc = 1.0;
  if (searchForm.tinhThanh.includes('Hồ Chí Minh')) heSoKhuVuc = 1.05;
  else if (searchForm.tinhThanh.includes('Hà Nội')) heSoKhuVuc = 1.08;
  else if (searchForm.tinhThanh.includes('Đà Nẵng')) heSoKhuVuc = 0.98;
  else heSoKhuVuc = 0.95;

  const giaMongMuon = parseFloat(searchForm.giaMongMuon) || 15;
  const giaDeXuat = (giaMongMuon * heSoKhuVuc).toFixed(1);

  // Tính ngày bán dự kiến
  let ngayBan = 28;
  if (searchForm.tinhThanh.includes('Hồ Chí Minh')) ngayBan = Math.floor(Math.random() * 8) + 18;
  else if (searchForm.tinhThanh.includes('Hà Nội')) ngayBan = Math.floor(Math.random() * 10) + 20;
  else ngayBan = Math.floor(Math.random() * 12) + 22;

  ngayBan = Math.min(ngayBan, 30);

  const phanTram = Math.floor((ngayBan / 30) * 100);
  const chenhLech = ((giaDeXuat / giaMongMuon - 1) * 100).toFixed(1);

  // Cập nhật kết quả
  searchResult.show = true;
  searchResult.tinhThanh = searchForm.tinhThanh || 'TP. Hồ Chí Minh';
  searchResult.quanHuyen = searchForm.quanHuyen || 'Phường Tân Phú';
  searchResult.ngayBan = ngayBan;
  searchResult.giaDeXuat = giaDeXuat;
  searchResult.chenhLech = parseFloat(chenhLech);
  searchResult.phanTram = phanTram;

  // Scroll đến kết quả
  setTimeout(() => {
    const resultEl = document.getElementById('ket-qua-du-doan');
    if (resultEl) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};

// Hàm xử lý xem chi tiết dự án
const handleViewProjectDetails = (project) => {
  console.log('View project details:', project);
  // Xử lý logic xem chi tiết dự án ở đây
};

// Back to top logic
const showBackToTop = ref(false);

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 200;
};

const loadConfig = async () => {
  const response = await api.get('/thg/public/cms/contentSection/58');

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

    // console.log('Config đã được xử lý:', processedConfig);
  }
};


onMounted(async () => {
  console.log("Chuẩn bị load config ban nhanh")
  await loadConfig();
  console.log("Đã load", config.value)
  // Khởi tạo dữ liệu địa chỉ
  initializeAddressData();

  // Khởi tạo dropdown với 10 tỉnh đầu tiên
  filteredProvinces.value = provinces.value;

  // AOS initialization
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 80 });
  }

  // Scroll event listener
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Sử dụng biến CSS từ config object */
.text-blue-400 {
  color: v-bind('config.styles.colors.blue400');
}

.text-purple-400 {
  color: v-bind('config.styles.colors.purple400');
}

.bg-blue-400 {
  background-color: v-bind('config.styles.colors.blue400');
}

.bg-blue-500\/10 {
  background-color: rgba(v-bind('config.styles.colors.blue500'), 0.1);
}

.bg-purple-500\/10 {
  background-color: rgba(v-bind('config.styles.colors.purple500'), 0.1);
}

.text-slate-300\/90 {
  color: rgba(v-bind('config.styles.colors.slate300'), 0.9);
}

.text-slate-400 {
  color: v-bind('config.styles.colors.slate400');
}

.text-slate-500 {
  color: v-bind('config.styles.colors.slate500');
}

.bg-slate-900\/70 {
  background-color: rgba(v-bind('config.styles.colors.slate900'), 0.7);
}

.bg-slate-800 {
  background-color: v-bind('config.styles.colors.slate800');
}

.bg-slate-900\/50 {
  background-color: rgba(v-bind('config.styles.colors.slate900'), 0.5);
}

.from-blue-400 {
  --tw-gradient-from: v-bind('config.styles.colors.blue400');
}

.to-purple-500 {
  --tw-gradient-to: v-bind('config.styles.colors.purple500');
}

.from-blue-500 {
  --tw-gradient-from: v-bind('config.styles.colors.blue500');
}

.to-purple-600 {
  --tw-gradient-to: v-bind('config.styles.colors.purple600');
}

.text-rose-500 {
  color: v-bind('config.styles.colors.rose500');
}

/* Responsive styles */
@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to right, v-bind('config.styles.colors.blue500'), v-bind('config.styles.colors.purple500'));
  border-radius: 10px;
  transition: background 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to right, #60a5fa, #c084fc);
}

/* Responsive styles cho section liên hệ */
@media (max-width: 768px) {
  #lien-he {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  #lien-he .glass-card {
    padding: 1.5rem;
    border-radius: 1rem;
  }

  #lien-he h2 {
    font-size: 1.5rem;
    line-height: 1.2;
  }

  #lien-he p {
    font-size: 0.875rem;
  }

  #lien-he input,
  #lien-he select,
  #lien-he textarea {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  #lien-he .flex-col > * {
    width: 100%;
  }

  #lien-he .btn-gradient,
  #lien-he a {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  #lien-he .grid-cols-1 {
    grid-template-columns: 1fr;
  }

  #lien-he .md\:col-span-2 {
    grid-column: span 1;
  }

  #lien-he .flex-col {
    gap: 0.75rem;
  }

  #lien-he .glass-card {
    padding: 1.25rem;
  }

  #lien-he img {
    width: 120px;
    margin-bottom: 1rem;
  }
}

/* Style cho dropdown */
.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
  border-radius: 3px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.7);
}
</style>