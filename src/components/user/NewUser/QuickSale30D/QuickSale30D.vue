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

      <div class="container mx-auto px-6 py-16 lg:py-24">
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
              :use-tag_a_-link="true"
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
                 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                 appearance-none">
                  <option value="" disabled selected class="text-slate-500">Chọn loại quyền sử dụng</option>
                  <option v-for="option in landUseOptions" :key="option.value" :value="option.value" class="text-white bg-slate-900">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Quan hệ sở hữu -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1.5">Quan hệ sở hữu <span class="text-rose-500">*</span></label>
                <select required v-model="ownershipChoice"
                        class="w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                 appearance-none">
                  <option value="" disabled selected class="text-slate-500">Chọn quan hệ sở hữu</option>
                  <option v-for="option in ownershipOptions" :key="option" :value="option" class="text-white bg-slate-900">
                    {{ option }}
                  </option>
                </select>
                <input v-if="ownershipChoice === 'Khác'" type="text" required v-model="searchForm.ownershipRelation"
                       class="mt-3 w-full rounded-xl bg-slate-900/70 border border-white/10 px-4 py-3
                    text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                       placeholder="Nhập quan hệ sở hữu khác...">
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
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <p class="text-slate-400 text-sm">{{ searchResultSuggestedPrice.title }}</p>
                      <!-- Icon con mắt bị gạch khi chưa đăng nhập -->
                      <button
                          v-if="!isLoggedIn"
                          @click="handleViewPrice"
                          class="text-slate-400 hover:text-purple-400 transition p-1"
                          title="Đăng nhập để xem giá"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        </svg>
                      </button>
                    </div>
                    <p class="text-3xl font-bold text-white mt-1">
                      {{ displayedGiaDeXuat }}
                    </p>
                    <p class="text-sm text-slate-300 mt-1">{{ displayedPriceRange }}</p>
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
                    <p :class="isLoggedIn ? chenhLechClass : ''">{{ displayedChenhLech }}</p>
                  </div>
                  <div class="p-3 bg-slate-800/50 rounded-lg">
                    <p class="text-slate-400">{{ searchResultSuggestedPrice.average }}</p>
                    <p class="text-white font-semibold">{{ displayedAveragePrice }}</p>
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
                <button
                    @click="handleViewDetails"
                    class="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold
           btn-gradient transition-all duration-300 w-full shadow-lg hover:shadow-purple-500/25">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>
                  {{ isLoggedIn ? config.buttons.viewDetails.text : config.buttons.loginToView.text }}
                </button>
                <p class="text-xs text-slate-500 mt-3">{{ isLoggedIn ? searchResultSavedNotice : 'Đăng nhập để xem giá và lưu kết quả' }}</p>
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

    <section id="du-an-da-ban" class="relative py-14 lg:py-20 border-t border-white/10">
      <div class="container mx-auto px-6">
        <div class="max-w-3xl">
          <h2 class="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {{ config.soldProjects.title }}
          </h2>
          <p class="mt-3 text-slate-300/90">
            {{ config.soldProjects.description }}
          </p>
        </div>

        <div class="mt-10 relative">
          <!-- Loading indicator -->
          <div v-if="loadingSoldProjects" class="text-center py-10">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            <p class="mt-3 text-slate-400">Đang tải dự án...</p>
          </div>

          <!-- Danh sách dự án -->
          <div
              ref="soldProjectsContainer"
              class="flex overflow-x-auto pb-6 gap-4 scroll-snap-x custom-scrollbar"
              data-aos="fade-up"
              @scroll="handleSoldProjectsScroll"
          >
            <SoldProjectCard
                v-for="project in soldProjects"
                :key="project.id"
                :project="project"
            />

            <!-- Empty state -->
            <div v-if="!loadingSoldProjects && soldProjects.length === 0" class="text-center py-10 w-full">
              <svg class="w-16 h-16 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              <p class="text-slate-400">Chưa có dự án nào được hiển thị</p>
            </div>

            <!-- Loading more indicator -->
            <div v-if="loadingMoreProjects" class="flex items-center justify-center min-w-[300px]">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
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

          <a v-if="config.buttons.dashboard.href!==''" :href="config.buttons.dashboard.href"
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
      <div id="contact" class="container mx-auto px-4 lg:px-6">
        <CooperationForm :purple-template="true" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, onUnmounted, nextTick, watch } from "vue";
import GlassCard from "../../UI/GlassCard.vue";
import TestimonialCard from "../../UI/TestimonialCard.vue";
import SoldProjectCard from "../../UI/SoldProjectCard.vue";
import { useAuthStore } from "../../../../stores/authStore.js";
import addressData from "../../../../assets/js/address.json";
import Fuse from "fuse.js";
import api from "../../../../api/api.js";
import { buildSeoUrl } from "../../../../assets/js/global.js";
import Swal from 'sweetalert2';
import CooperationForm from "../../UI/CooperationForm.vue";

// ========== SOLD PROJECTS - Lấy từ API ==========
const soldProjects = ref([]);
const loadingSoldProjects = ref(false);
const loadingMoreProjects = ref(false);
const soldProjectsPage = ref(0);
const soldProjectsTotalPages = ref(0);
const soldProjectsContainer = ref(null);
const hasMoreSoldProjects = ref(true);

// Hàm format địa chỉ: chỉ lấy Thành phố/Tỉnh, giới hạn 40 ký tự
const formatLocation = (address) => {
  if (!address) return '';

  const parts = address.split('/!!');

  // Lấy phần cuối cùng (Thành phố / Tỉnh)
  const city = parts[parts.length - 1]?.trim() || '';

  if (city.length > 40) {
    return city.slice(0, 40) + '...';
  }

  return city;
};

// Hàm format giá
const formatPrice = (price) => {
  if (!price && price !== 0) return '';

  const priceNum = Number(price);
  if (isNaN(priceNum)) return price;

  if (priceNum >= 1000000000) {
    // Tỷ đồng
    const ty = priceNum / 1000000000;
    return `${ty.toFixed(1).replace('.0', '')} tỷ VNĐ`;
  } else if (priceNum >= 1000000) {
    // Triệu đồng
    const trieu = priceNum / 1000000;
    return `${trieu.toFixed(0)} triệu VNĐ`;
  } else {
    // Đồng
    return `${priceNum.toLocaleString('vi-VN')} VNĐ`;
  }
};

// Hàm lấy dự án đã bán từ API
const fetchSoldProjects = async (page = 0, loadMore = false) => {
  if (loadMore) {
    loadingMoreProjects.value = true;
  } else {
    loadingSoldProjects.value = true;
  }

  try {
    const response = await api.post('/user.thg/product/user/da-ban', null, {
      params: {
        pageNo: page,
        year: 2026// Số lượng item mỗi trang
      }
    });

    if (response.data && response.data.content) {
      const apiProjects = response.data.content;

      // Map dữ liệu từ API sang format của component
      const mappedProjects = apiProjects.map(rp => ({
        id: rp.id || Date.now() + Math.random(),
        type: getLoai(rp) || 'Nhà phố',
        location: formatLocation(rp.diaChi),
        status: rp.status || 'ĐÃ BÁN',
        price: formatPrice(rp.giaBan),
        saleTime: rp.capNhatNgay, // Tạm thời ẩn, có thể tính toán sau
        priceDifference: rp.phiMoiGioi || 'Chưa cập nhật ',
        imageUrl: rp.imageUrl || '',
        imageClass: 'bg-gradient-to-br from-purple-500/20 to-blue-500/10',
        detailUrl: buildSeoUrl(rp),
        showDetailsButton: true
      }));

      if (loadMore) {
        // Thêm vào cuối danh sách
        soldProjects.value = [...soldProjects.value, ...mappedProjects];
      } else {
        // Thay thế danh sách
        soldProjects.value = mappedProjects;
      }

      // Cập nhật thông tin phân trang
      soldProjectsPage.value = response.data.page?.number || 0;
      soldProjectsTotalPages.value = response.data.page?.totalPages || 0;
      hasMoreSoldProjects.value = soldProjectsPage.value < soldProjectsTotalPages.value - 1;
    }
  } catch (error) {
    console.error('Lỗi khi tải dự án đã bán:', error);
  } finally {
    loadingSoldProjects.value = false;
    loadingMoreProjects.value = false;
  }
};

// Hàm xử lý scroll để load thêm
const handleSoldProjectsScroll = () => {
  if (!soldProjectsContainer.value || loadingMoreProjects.value || !hasMoreSoldProjects.value) {
    return;
  }

  console.log("Điều kiện scroll được kiểm tra");

  const container = soldProjectsContainer.value;
  const scrollLeft = container.scrollLeft;
  const scrollWidth = container.scrollWidth;
  const clientWidth = container.clientWidth;

  // Debug log
  console.log('Scroll info:', {
    scrollLeft,
    scrollWidth,
    clientWidth,
    scrollableDistance: scrollWidth - clientWidth,
    scrolledPercentage: (scrollLeft / (scrollWidth - clientWidth)) * 100 + '%'
  });

  // Khi đã cuộn đến 70-80% thì load thêm
  const threshold = 0.7; // 70%
  const scrollableDistance = scrollWidth - clientWidth;

  if (scrollableDistance > 0 && scrollLeft >= scrollableDistance * threshold) {
    console.log('Triggering load more...', {
      threshold: threshold * 100 + '%',
      scrolled: (scrollLeft / scrollableDistance) * 100 + '%'
    });
    loadMoreSoldProjects();
  }
};

// Hàm load thêm dự án - THÊM DEBOUNCE
const loadMoreSoldProjects = async () => {
  if (loadingMoreProjects.value || !hasMoreSoldProjects.value) return;

  console.log('Loading more projects, page:', soldProjectsPage.value + 1);

  const nextPage = soldProjectsPage.value + 1;
  await fetchSoldProjects(nextPage, true);
};

// Hàm refresh danh sách dự án
const refreshSoldProjects = () => {
  soldProjectsPage.value = 0;
  fetchSoldProjects(0, false);
};

// Data từ address.json
const provinces = ref([]);
const selectedProvince = ref(null);
const ownershipChoice = ref('');

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
  authStore.openLoginModal()
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
  { value: 'Sổ đỏ lâu dài', label: 'Sổ đỏ lâu dài' },
  { value: 'Sổ hồng', label: 'Sổ hồng' },
  { value: 'Sổ đỏ 50 năm', label: 'Sổ đỏ 50 năm' },
  { value: 'Đang chờ cấp sổ', label: 'Đang chờ cấp sổ' },
  { value: 'Giấy tờ khác', label: 'Giấy tờ khác' },
  { value: 'Khác', label: 'Khác' }
];

const ownershipOptions = ['Sở hữu riêng', 'Sở hữu chung', 'Đồng sở hữu', 'Khác'];

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
      href: ''
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
    items: []
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
  ownershipRelation: '',
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
  phanTram: 0,
  minPrice: 0, // Thêm trường min
  maxPrice: 0  // Thêm trường max
});
//Dữ liệu gửi về BE
const PropertySaleDTO = reactive({
  fullName: '',
  phone: '',
  email: '',
  province: '',
  ward: '',
  addressDetail: '',
  soTo: '',
  soThua: '',
  dienTichDat: 0,
  dienTichSan: 0,
  ketCauCongTrinh: '',

  landUseRight: '',
  ownershipRelation: '',
  expectedPrice: 0,

  estimatedSaleTimeDays: 0,
  suggestedPrice: 0,
  priceChangePercent: 0,
  areaAveragePrice: 0,
  acceptedPriceMin: 0,
  acceptedPriceMax: 0,
  saleSuccessRate: 0,
})

// ========== COMPUTED PROPERTIES ==========
const isLoggedIn = computed(() => authStore.userInfo != null);

watch(ownershipChoice, (val) => {
  if (val && val !== 'Khác') {
    searchForm.ownershipRelation = val;
  } else {
    searchForm.ownershipRelation = '';
  }
});

// Computed properties cho hiển thị giá
const displayedGiaDeXuat = computed(() => {
  if (isLoggedIn.value) {
    return `${searchResult.giaDeXuat} tỷ VNĐ`;
  }
  return '*******';
});

const displayedChenhLech = computed(() => {
  if (isLoggedIn.value) {
    return chenhLechText.value;
  }
  return '******';
});

const displayedAveragePrice = computed(() => {
  if (isLoggedIn.value) {
    return `${(searchResult.giaDeXuat * 0.96).toFixed(1)} tỷ`;
  }
  return '******';
});

const displayedPriceRange = computed(() => {
  if (isLoggedIn.value) {
    return `Giá thị trường chấp nhận: ${searchResult.minPrice} - ${searchResult.maxPrice} tỷ`;
  }
  return 'Giá thị trường chấp nhận: ******* - ******* tỷ';
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
  const totalDays = 30
  const soldDays = searchResult.ngayBan || 0

  const percent = Math.min((soldDays / totalDays) * 100, 100)

  return `${percent}%`
})


// ========== HÀM XỬ LÝ LOCALSTORAGE ==========

// Hàm chuẩn hóa giá trị (chuyển tất cả về string để so sánh)
const normalizeValue = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value.trim();
  return String(value);
};

// Hàm tạo hash đơn giản từ string
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
};

// Hàm tạo key cho localStorage dựa trên thông tin form
const generateStorageKey = () => {
  const keyData = {
    tinhThanh: normalizeValue(searchForm.tinhThanh),
    quanHuyen: normalizeValue(searchForm.quanHuyen),
    soTo: normalizeValue(searchForm.soTo),
    soThua: normalizeValue(searchForm.soThua),
    dienTichDat: normalizeValue(searchForm.dienTichDat),
    dienTichSan: normalizeValue(searchForm.dienTichSan),
    giaMongMuon: normalizeValue(searchForm.giaMongMuon)
  };

  // Tạo string JSON
  const jsonString = JSON.stringify(keyData);

  // Tạo hash từ dữ liệu để tránh key quá dài
  return `search_result_${hashString(jsonString)}`;
};

// Hàm kiểm tra kết quả có khớp với form hiện tại không
const isResultMatchingCurrentForm = (savedResult) => {
  // Kiểm tra từng trường quan trọng
  const fieldsToCheck = [
    'tinhThanh',
    'quanHuyen',
    'soTo',
    'soThua',
    'dienTichDat',
    'dienTichSan',
    'giaMongMuon'
  ];

  for (const field of fieldsToCheck) {
    const savedValue = savedResult._meta?.formData?.[field] || savedResult[field];
    const currentValue = searchForm[field];

    // Chuyển đổi cả hai về string để so sánh
    const savedStr = savedValue !== undefined && savedValue !== null ? String(savedValue).trim() : '';
    const currentStr = currentValue !== undefined && currentValue !== null ? String(currentValue).trim() : '';

    // So sánh giá trị
    if (savedStr !== currentStr) {
      return false;
    }
  }

  return true;
};

// Hàm kiểm tra và lấy kết quả từ localStorage
const getResultFromLocalStorage = () => {
  const storageKey = generateStorageKey();
  const savedResult = localStorage.getItem(storageKey);

  if (savedResult) {
    try {
      const parsedResult = JSON.parse(savedResult);

      // Kiểm tra xem kết quả có phù hợp với form hiện tại không
      if (isResultMatchingCurrentForm(parsedResult)) {
        return parsedResult;
      } else {
        // Nếu không phù hợp, xóa kết quả cũ
        localStorage.removeItem(storageKey);
      }
    } catch (e) {
      console.error('Lỗi khi parse kết quả từ localStorage:', e);
      localStorage.removeItem(storageKey);
    }
  }
  return null;
};

// Hàm lưu kết quả vào localStorage
const saveResultToLocalStorage = (result) => {
  const storageKey = generateStorageKey();

  // Thêm thời gian lưu và dữ liệu form để kiểm tra sau
  const resultToSave = {
    ...result,
    _meta: {
      savedAt: new Date().toISOString(),
      formData: {
        tinhThanh: normalizeValue(searchForm.tinhThanh),
        quanHuyen: normalizeValue(searchForm.quanHuyen),
        soTo: normalizeValue(searchForm.soTo),
        soThua: normalizeValue(searchForm.soThua),
        dienTichDat: normalizeValue(searchForm.dienTichDat),
        dienTichSan: normalizeValue(searchForm.dienTichSan),
        giaMongMuon: normalizeValue(searchForm.giaMongMuon)
      }
    }
  };

  localStorage.setItem(storageKey, JSON.stringify(resultToSave));
};

// ========== HÀM XỬ LÝ FORM ==========

// Hàm hiện thông báo đăng nhập bằng SweetAlert2
const showLoginPrompt = (message = 'Vui lòng đăng nhập để xem kết quả dự đoán chi tiết từ hệ thống AI.') => {
  return new Promise((resolve) => {
    Swal.fire({
      title: 'Yêu cầu đăng nhập',
      html: `
        <div class="text-slate-300 text-sm leading-relaxed">
          <p class="mb-3">${message}</p>
          <p class="text-xs text-slate-400">Kết quả sẽ được lưu vào tài khoản của bạn để xem lại sau.</p>
        </div>
      `,
      background: '#0f172a',
      color: '#e2e8f0',
      showCancelButton: true,
      cancelButtonText: 'Bỏ qua',
      confirmButtonText: 'Đăng nhập',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl border border-white/10',
        title: 'text-white text-lg font-bold mb-4',
        confirmButton: 'btn-gradient !rounded-xl !px-6 !py-2.5 !text-sm !font-semibold',
        cancelButton: '!bg-transparent !text-slate-300 !border !border-white/10 !rounded-xl !px-6 !py-2.5 !text-sm !font-semibold hover:!bg-white/10 hover:!border-white/20'
      },
      buttonsStyling: false,
      showLoaderOnConfirm: false,
      preConfirm: () => {
        openLoginModal();
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

// Hàm tính toán và hiển thị kết quả
// Hàm tính toán và hiển thị kết quả
const calculateAndShowResult = async () => {
  // Hiển thị thông báo đang tính toán
  Swal.fire({
    title: 'Đang phân tích...',
    html: '<div class="text-slate-300 text-sm">Hệ thống AI đang phân tích dữ liệu và dự đoán thời gian bán</div>',
    background: '#0f172a',
    color: '#e2e8f0',
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  // Giả lập delay để tính toán
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Tính toán các giá trị (giữ nguyên logic cũ)
  let heSoKhuVuc = 1.0;
  const tinhThanh = normalizeValue(searchForm.tinhThanh);
  if (tinhThanh.includes('Hồ Chí Minh')) heSoKhuVuc = 1.05;
  else if (tinhThanh.includes('Hà Nội')) heSoKhuVuc = 1.08;
  else if (tinhThanh.includes('Đà Nẵng')) heSoKhuVuc = 0.98;
  else heSoKhuVuc = 0.95;

  const giaMongMuon = parseFloat(searchForm.giaMongMuon) || 15;
  const giaDeXuat = parseFloat((giaMongMuon * heSoKhuVuc).toFixed(1));
  const minPrice = parseFloat((giaDeXuat * 0.92).toFixed(1));
  const maxPrice = parseFloat((giaDeXuat * 1.03).toFixed(1));

  let ngayBan = 28;
  if (tinhThanh.includes('Hồ Chí Minh')) ngayBan = Math.floor(Math.random() * 8) + 18;
  else if (tinhThanh.includes('Hà Nội')) ngayBan = Math.floor(Math.random() * 10) + 20;
  else ngayBan = Math.floor(Math.random() * 12) + 22;
  ngayBan = Math.min(ngayBan, 30);

  const phanTram = Math.floor((ngayBan / 30) * 100);
  const chenhLech = parseFloat(((giaDeXuat / giaMongMuon - 1) * 100).toFixed(1));

  // Cập nhật PropertySaleDTO với kết quả tính toán
  Object.assign(PropertySaleDTO, {
    estimatedSaleTimeDays: ngayBan,
    suggestedPrice: giaDeXuat,
    priceChangePercent: chenhLech,
    areaAveragePrice: parseFloat((giaDeXuat * 0.96).toFixed(1)),
    acceptedPriceMin: minPrice,
    acceptedPriceMax: maxPrice,
    saleSuccessRate: phanTram
  });

  // Tạo đối tượng kết quả
  const resultData = {
    show: true,
    tinhThanh: tinhThanh || 'TP. Hồ Chí Minh',
    quanHuyen: normalizeValue(searchForm.quanHuyen) || 'Phường Tân Phú',
    ngayBan: ngayBan,
    giaDeXuat: giaDeXuat,
    chenhLech: chenhLech,
    phanTram: phanTram,
    minPrice: minPrice,
    maxPrice: maxPrice
  };

  // Lưu vào localStorage
  saveResultToLocalStorage(resultData);

  // Cập nhật kết quả hiển thị
  Object.assign(searchResult, resultData);

  // Đóng thông báo loading
  Swal.close();

  // Hiển thị thông báo thành công
  Swal.fire({
    title: 'Phân tích hoàn tất!',
    html: `<div class="text-slate-300 text-sm">
            ${isLoggedIn.value ? 'Kết quả đã được lưu vào tài khoản của bạn' : 'Kết quả đã được tính toán'}
          </div>`,
    icon: 'success',
    background: '#0f172a',
    color: '#e2e8f0',
    confirmButtonText: 'Xem kết quả',
    customClass: {
      popup: 'rounded-2xl border border-white/10',
      confirmButton: 'btn-gradient !rounded-xl !px-6 !py-2.5 !text-sm !font-semibold'
    },
    buttonsStyling: false,
    timer: 2000
  });

  // Scroll đến kết quả
  setTimeout(() => {
    const resultEl = document.getElementById('ket-qua-du-doan');
    if (resultEl) {
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
};

// Hàm xử lý submit form - đã thêm tính toán min-max và kiểm tra localStorage
// Hàm xử lý submit form - đã thêm tính toán min-max và kiểm tra localStorage
const handleSearchSubmit = async (e) => {
  e.preventDefault();

  // Kiểm tra các trường bắt buộc
  const requiredFields = [
    'hoTen',
    'soDienThoai',
    'email',
    'tinhThanh',
    'quanHuyen',
    'dienTichDat',
    'giaMongMuon',
    'quyenSuDungDat',
    'ownershipRelation'
  ];

  // Kiểm tra xem các trường bắt buộc có được điền không
  const missingFields = requiredFields.filter(field => {
    const value = searchForm[field];

    // Kiểm tra các trường string
    if (field === 'hoTen' || field === 'soDienThoai' || field === 'email' ||
        field === 'tinhThanh' || field === 'quanHuyen') {
      return !value || String(value).trim() === '';
    }

    // Kiểm tra các trường số
    if (field === 'dienTichDat' || field === 'giaMongMuon') {
      return !value && value !== 0;
    }

    return !value;
  });

  if (missingFields.length > 0) {
    const fieldLabels = {
      'hoTen': 'Họ tên',
      'soDienThoai': 'Số điện thoại',
      'email': 'Email',
      'tinhThanh': 'Tỉnh/Thành phố',
      'quanHuyen': 'Quận/Huyện',
      'dienTichDat': 'Diện tích đất',
      'giaMongMuon': 'Giá mong muốn',
      'quyenSuDungDat': 'Quyền sử dụng đất',
      'ownershipRelation': 'Quan hệ sở hữu'
    };

    const missingFieldNames = missingFields.map(field => fieldLabels[field] || field).join(', ');

    Swal.fire({
      title: 'Thiếu thông tin',
      html: `<div class="text-slate-300 text-sm">
              <p class="mb-2">Vui lòng điền đầy đủ các trường bắt buộc:</p>
              <p class="text-amber-300 font-medium">${missingFieldNames}</p>
            </div>`,
      icon: 'warning',
      background: '#0f172a',
      color: '#e2e8f0',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'rounded-2xl border border-white/10',
        confirmButton: 'btn-gradient !rounded-xl !px-6 !py-2.5 !text-sm !font-semibold'
      },
      buttonsStyling: false
    });
    return;
  }

  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(searchForm.email.trim())) {
    Swal.fire({
      title: 'Email không hợp lệ',
      html: '<div class="text-slate-300 text-sm">Vui lòng nhập địa chỉ email hợp lệ</div>',
      icon: 'warning',
      background: '#0f172a',
      color: '#e2e8f0',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'rounded-2xl border border-white/10',
        confirmButton: 'btn-gradient !rounded-xl !px-6 !py-2.5 !text-sm !font-semibold'
      },
      buttonsStyling: false
    });
    return;
  }

  // Kiểm tra định dạng số điện thoại Việt Nam
  const phoneRegex = /^(0\d{9}|\+84\d{9})$/;
  const phoneNumber = searchForm.soDienThoai.trim().replace(/\s+/g, '');
  if (!phoneRegex.test(phoneNumber)) {
    Swal.fire({
      title: 'Số điện thoại không hợp lệ',
      html: '<div class="text-slate-300 text-sm">Vui lòng nhập số điện thoại hợp lệ (10-11 số, bắt đầu bằng 0 hoặc +84)</div>',
      icon: 'warning',
      background: '#0f172a',
      color: '#e2e8f0',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'rounded-2xl border border-white/10',
        confirmButton: 'btn-gradient !rounded-xl !px-6 !py-2.5 !text-sm !font-semibold'
      },
      buttonsStyling: false
    });
    return;
  }

  // ========== CHUẨN BỊ DỮ LIỆU GỬI VỀ BE ==========
  const preparePropertySaleDTO = () => {
    //
    // console.log('=== PREPARE DTO START ===');
    // console.log('searchForm.hoTen:', searchForm.hoTen);
    // Tính toán các giá trị giống như trong calculateAndShowResult
    let heSoKhuVuc = 1.0;
    const tinhThanh = normalizeValue(searchForm.tinhThanh);
    if (tinhThanh.includes('Hồ Chí Minh')) heSoKhuVuc = 1.05;
    else if (tinhThanh.includes('Hà Nội')) heSoKhuVuc = 1.08;
    else if (tinhThanh.includes('Đà Nẵng')) heSoKhuVuc = 0.98;
    else heSoKhuVuc = 0.95;

    const giaMongMuon = parseFloat(searchForm.giaMongMuon) || 15;
    const giaDeXuat = parseFloat((giaMongMuon * heSoKhuVuc).toFixed(1));
    const minPrice = parseFloat((giaDeXuat * 0.92).toFixed(1));
    const maxPrice = parseFloat((giaDeXuat * 1.03).toFixed(1));

    // Tính ngày bán dự kiến
    let ngayBan = 28;
    if (tinhThanh.includes('Hồ Chí Minh')) ngayBan = Math.floor(Math.random() * 8) + 18;
    else if (tinhThanh.includes('Hà Nội')) ngayBan = Math.floor(Math.random() * 10) + 20;
    else ngayBan = Math.floor(Math.random() * 12) + 22;
    ngayBan = Math.min(ngayBan, 30);

    const phanTram = Math.floor((ngayBan / 30) * 100);
    const chenhLech = parseFloat(((giaDeXuat / giaMongMuon - 1) * 100).toFixed(1));

    // Cập nhật PropertySaleDTO
    Object.assign(PropertySaleDTO, {
      fullName: searchForm.hoTen.trim(),
      phone: phoneNumber,
      email: searchForm.email.trim(),
      province: searchForm.tinhThanh.trim(),
      ward: searchForm.quanHuyen.trim(),
      addressDetail: searchForm.diaChiChiTiet?.trim() || '',
      soTo: searchForm.soTo?.trim() || '',
      soThua: searchForm.soThua?.trim() || '',
      dienTichDat: parseFloat(searchForm.dienTichDat) || 0,
      dienTichSan: parseFloat(searchForm.dienTichSan) || 0,
      ketCauCongTrinh: searchForm.ketCauCongTrinh?.trim() || '',
      landUseRight: searchForm.quyenSuDungDat || '',
      ownershipRelation: searchForm.ownershipRelation?.trim() || '',
      expectedPrice: parseFloat(searchForm.giaMongMuon) || 0,

      // Kết quả dự đoán
      estimatedSaleTimeDays: ngayBan,
      suggestedPrice: giaDeXuat,
      priceChangePercent: chenhLech,
      areaAveragePrice: parseFloat((giaDeXuat * 0.96).toFixed(1)), // Giá trung bình khu vực
      acceptedPriceMin: minPrice,
      acceptedPriceMax: maxPrice,
      saleSuccessRate: phanTram
    });

    // console.log('PropertySaleDTO sau khi assign:', PropertySaleDTO);
    // console.log('=== PREPARE DTO END ===');
  };

  // Gọi hàm chuẩn bị dữ liệu
  preparePropertySaleDTO();

  // Kiểm tra nếu đã có kết quả trong localStorage
  const savedResult = getResultFromLocalStorage();
  if (savedResult) {
    // Hiển thị kết quả đã lưu
    Object.assign(searchResult, savedResult);
    searchResult.show = true;

    // Hiển thị thông báo đã lấy từ cache
    Swal.fire({
      title: 'Đã tìm thấy kết quả',
      html: `<div class="text-slate-300 text-sm">Hiển thị kết quả đã được lưu trước đó</div>`,
      icon: 'info',
      background: '#0f172a',
      color: '#e2e8f0',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'rounded-2xl border border-white/10',
        confirmButton: 'btn-gradient !rounded-xl !px-6 !py-2.5 !text-sm !font-semibold'
      },
      buttonsStyling: false,
      timer: 1500
    });

    // GỬI DỮ LIỆU VỀ BE (kể cả khi có cache)
    await sendPropertySaleData();

    // Scroll đến kết quả
    setTimeout(() => {
      const resultEl = document.getElementById('ket-qua-du-doan');
      if (resultEl) {
        resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    return;
  }

  // Tiến hành tính toán
  await calculateAndShowResult();

  // GỬI DỮ LIỆU VỀ BE sau khi tính toán
  await sendPropertySaleData();
};


// Hàm gửi dữ liệu PropertySaleDTO về BE
const sendPropertySaleData = async () => {
  try {
    // Kiểm tra nếu đã có thông tin người dùng
    if (authStore.userInfo && authStore.userInfo.id) {
      PropertySaleDTO.userId = authStore.userInfo.id;
    }

    // Gửi request đến API
    const response = await api.post('thg/public/property-sales', PropertySaleDTO);

    if (response.status === 200 || response.status === 201) {
      // console.log('Dữ liệu tra cứu đã được lưu thành công:', response.data);

      // Nếu có response data và có id, có thể lưu lại để sử dụng sau
      if (response.data && response.data.id) {
        PropertySaleDTO.id = response.data.id;
      }
    } else {
      console.warn('API trả về status không mong muốn:', response.status);
    }
  } catch (error) {
    console.error('Lỗi khi gửi dữ liệu tra cứu về BE:', error);

    // Không hiển thị lỗi cho người dùng để không làm gián đoạn trải nghiệm
    // Chỉ log ra console để debug
  }
};

// ========== HÀM XỬ LÝ SỰ KIỆN ĐĂNG NHẬP ==========

// Hàm xử lý khi đăng nhập thành công
const handleLoginSuccess = async () => {
  // Kiểm tra nếu form đã được điền đầy đủ và đã có kết quả
  if (isFormFilled() && searchResult.show) {
    // Nếu đã có kết quả, chỉ cần re-render để hiển thị giá
    // Không cần tính toán lại
    return;
  }
};

// Hàm kiểm tra form đã điền đầy đủ chưa
const isFormFilled = () => {
  return searchForm.hoTen &&
      searchForm.soDienThoai &&
      searchForm.email &&
      searchForm.tinhThanh &&
      searchForm.quanHuyen &&
      searchForm.dienTichDat &&
      searchForm.giaMongMuon;
};

// Hàm xử lý khi nhấn vào icon xem giá
const handleViewPrice = () => {
  if (!isLoggedIn.value) {
    showLoginPrompt('Đăng nhập để xem giá đề xuất và phân tích chi tiết.');
  }
};

import { useRouter } from "vue-router";
const router = useRouter();
// Hàm xử lý khi nhấn nút xem chi tiết
const handleViewDetails = () => {
  if (!isLoggedIn.value) {
    // Hiển thị thông báo đăng nhập nếu chưa đăng nhập
    showLoginPrompt();
  } else {
    // Nếu đã đăng nhập, kiểm tra xem đã có kết quả chưa
    if (!searchResult.show) {
      Swal.fire({
        title: 'Chưa có kết quả',
        html: '<div class="text-slate-300 text-sm">Vui lòng nhập thông tin và tra cứu trước</div>',
        icon: 'info',
        background: '#0f172a',
        color: '#e2e8f0',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'rounded-2xl border border-white/10',
          confirmButton: 'btn-gradient !rounded-xl !px-6 !py-2.5 !text-sm !font-semibold'
        },
        buttonsStyling: false
      });
    }
    router.push("/bao-cao-dinh-gia?openTab=yeu-cau");
  }
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

    console.log('Config đã được xử lý:', processedConfig);
  }
};

function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16)
  return `${(bigint >> 16) & 255} ${(bigint >> 8) & 255} ${bigint & 255}`
}

const getLoai = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const structure = (item.structure || '').toLowerCase();

  if (item.loaiTaiSan) {
    const map = {
      NHA: 'Nhà',
      DAT: 'Đất',
      DATLON: 'Đất lớn'
    };

    if (map[item.loaiTaiSan]) {
      return map[item.loaiTaiSan];
    }
  }

  const houseKeywords = [
    'lầu', 'trệt', 'tầng', 'hầm', 'gác',
    'nhà cấp', 'cấp 1', 'cấp 2', 'cấp 3', 'cấp 4',
    'biệt thự', 'villa', 'shophouse', 'townhouse', 'nhà',
    'chung cư', 'căn hộ', 'chcc', 'studio',
    'condotel', 'officetel', 'apartment', 'can ho',
    'chung cu', 'tower', 'block'
  ];

  if (houseKeywords.some((keyword) => structure.includes(keyword))) {
    return 'Nhà';
  }

  if (dtcnValue > 10000) return 'Đất lớn';

  return 'Đất';
};

onMounted(async () => {
  console.log("Chuẩn bị load config ban nhanh")
  await loadConfig();
  console.log("Đã load", config.value)
  // Khởi tạo dữ liệu địa chỉ
  initializeAddressData();

  // Khởi tạo dropdown với 10 tỉnh đầu tiên
  filteredProvinces.value = provinces.value;

  // Load dự án đã bán
  await fetchSoldProjects(0);

  // THÊM: Kiểm tra container sau khi load xong
  nextTick(() => {
    if (soldProjectsContainer.value) {
      console.log('Container loaded, dimensions:', {
        scrollWidth: soldProjectsContainer.value.scrollWidth,
        clientWidth: soldProjectsContainer.value.clientWidth,
        scrollLeft: soldProjectsContainer.value.scrollLeft
      });
    }
  });

  // AOS initialization
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 80 });
  }

  // Scroll event listener
  window.addEventListener('scroll', handleScroll);

  // Thêm event listener cho sự kiện đăng nhập thành công
  window.addEventListener('login-success', handleLoginSuccess);

  console.log("màu purple",config.value.styles.colors.purple500)
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('login-success', handleLoginSuccess);
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
}

.bg-purple-500\/10 {}

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

.shadow-glow{
  --tw-shadow: 0 8px 28px rgb(71, 54, 99), 0 2px 6px rgba(0,0,0,.25) !important;
  --tw-shadow-colored: 0 8px 28px var(--tw-shadow-color), 0 2px 6px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

/* Style cho scroll container */
.scroll-snap-x {
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 92, 246, 0.5) rgba(15, 23, 42, 0.5);
}

/* Thêm padding bên phải để không bị che bởi thanh scroll */
.flex.overflow-x-auto {
  padding-right: 4px;
}

/* Loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
/* THÊM: Tối ưu CSS cho container scroll */
.flex.overflow-x-auto {
  padding-right: 4px;
  /* Thêm will-change để tối ưu hiệu suất scroll */
  will-change: transform;
  /* Đảm bảo container có overflow-x hiển thị đúng */
  overflow-x: auto !important;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch; /* Cho iOS */
}

/* Đảm bảo các card có kích thước tối thiểu */
.flex.overflow-x-auto > * {
  flex: 0 0 auto;
  min-width: 300px;
  max-width: 300px; /* THÊM: Giới hạn max-width để đồng nhất */
  scroll-snap-align: start;
}

/* THÊM: Style cho loading indicator khi scroll */
.flex.overflow-x-auto::after {
  content: '';
  min-width: 20px;
  flex-shrink: 0;
}
/* THÊM: Tối ưu CSS cho container scroll */
.flex.overflow-x-auto {
  padding-right: 4px;
  padding-top: 12px; /* THÊM: Tạo khoảng trống cho hover */
  margin-bottom: -12px; /* Bù lại khoảng trống padding-top */
  will-change: transform;
  overflow-x: auto !important;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

/* Đảm bảo các card có kích thước tối thiểu */
.flex.overflow-x-auto > * {
  flex: 0 0 auto;
  min-width: 300px;
  max-width: 300px;
  scroll-snap-align: start;
  margin-bottom: 12px; /* Bù lại khoảng trống */
}

/* THÊM: Style cho loading indicator khi scroll */
.flex.overflow-x-auto::after {
  content: '';
  min-width: 20px;
  flex-shrink: 0;
}

/* THÊM: Đảm bảo SoldProjectCard có z-index cao khi hover */
.flex.overflow-x-auto > *:hover {
  z-index: 10; /* Đảm bảo card hover hiển thị trên các card khác */
  position: relative;
}

/* THÊM: Tăng khoảng cách giữa các card */
.flex.overflow-x-auto {
  gap: 1.5rem; /* Thay vì gap-4 (16px) -> 24px */
}

/* Style cho icon ẩn giá */
button.text-slate-400:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>
