<template>
  <div class="pt-20">
    <!-- Hero Section -->
    <section class="py-16 md:py-24 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 relative">
        <div class=" mx-auto">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Left Content -->
            <div data-aos="fade-right">
              <div class="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <i :class="config.hero.taglineIcon" class="mr-2 text-purple-300"></i>
                <span class="text-sm font-semibold text-purple-300">{{ config.hero.tagline }}</span>
              </div>

              <h1 class="text-4xl md:text-5xl font-bold text-slate-50 mb-6 leading-tight">
                {{ config.hero.title }}
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{{ config.hero.highlightedText }}</span>
              </h1>

              <p class="text-lg text-slate-300 mb-8 leading-relaxed">
                {{ config.hero.description }}
                <span :class="config.hero.highlights[0].class">{{ config.hero.highlights[0].text }}</span>
                {{ config.hero.descriptionContinuation }}
                <span :class="config.hero.highlights[1].class">{{ config.hero.highlights[1].text }}</span>.
              </p>

              <div class="flex flex-col sm:flex-row gap-4">
                <button @click="goToStep(1)" class="btn-gradient glow px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center space-x-2">
                  <i :class="config.hero.ctaButtons.priceNow.icon"></i>
                  <span>{{ config.hero.ctaButtons.priceNow.text }}</span>
                </button>
                <button class="glass-card border border-blue/10 px-8 py-3 rounded-xl font-semibold hover:bg-white/5 transition flex items-center justify-center space-x-2">
                  <i :class="config.hero.ctaButtons.watchDemo.icon"></i>
                  <span>{{ config.hero.ctaButtons.watchDemo.text }}</span>
                </button>
              </div>

              <!-- Stats -->
              <div class="mt-12 grid grid-cols-3 gap-4">
                <div v-for="stat in config.hero.stats" :key="stat.label" class="text-center border-2 bg-blue-400/5 border-slate-700 rounded-xl p-4">
                  <div class="text-2xl font-bold text-slate-50">{{ stat.value }}</div>
                  <div class="text-sm text-slate-400">{{ stat.label }}</div>
                </div>
              </div>
            </div>

            <!-- Right - Pricing Calculator Card -->
            <!-- PHẦN NÀY KHÔNG THAY ĐỔI - GIỮ NGUYÊN LOGIC ĐỊNH GIÁ -->
            <div data-aos="fade-left">
              <div class="glass-card rounded-3xl p-8 hover-lift">
                <!-- Header với tabs -->
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-3">
                    <div class="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center">
                      <i class="fas fa-calculator text-slate-50 text-xl"></i>
                    </div>
                    <div>
                      <h3 class="text-2xl font-bold text-slate-50">Công cụ định giá AI</h3>
                      <p class="text-sm text-slate-400">Tính toán chính xác 95% với dữ liệu thực tế</p>
                    </div>
                  </div>

                  <!-- Tabs -->
                  <div class="flex gap-2">
                    <button class="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm font-medium">
                      <i class="fas fa-bolt mr-2"></i>Nhanh
                    </button>
                  </div>
                </div>

                <!-- Progress Steps -->
                <div class="flex justify-between mb-8 relative">
                  <div class="absolute top-4 left-0 w-full h-1 bg-slate-800 -z-10"></div>
                  <div class="absolute top-4 left-0 h-1 gradient-bg -z-10" :style="{ width: progressWidth }" id="progress-line"></div>

                  <div v-for="step in stepsConfig" :key="step.number" class="text-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2"
                         :class="getStepClass(step.number)">
                      <i v-if="currentStep > step.number" class="fas fa-check text-slate-50 text-sm"></i>
                      <i v-else-if="currentStep === step.number" class="fas fa-home text-slate-50 text-sm"></i>
                      <span v-else class="text-slate-400 text-sm">{{ step.number }}</span>
                    </div>
                    <span class="text-xs font-medium" :class="currentStep >= step.number ? 'text-slate-50' : 'text-slate-400'">
                      {{ step.label }}
                    </span>
                  </div>
                </div>

                <!-- Step 1: Thông tin BĐS -->
                <div v-show="currentStep === 1" class="space-y-6">
                  <!-- Loại BĐS với icons -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-3">
                      <i class="fas fa-building mr-2 text-blue-400"></i>Loại bất động sản
                    </label>
                    <div class="grid grid-cols-4 gap-3">
                      <button v-for="type in propertyTypes" :key="type.id"
                              @click="selectPropertyType(type.id)"
                              class="p-4 rounded-xl border-2  transition-all group"
                              :class="getPropertyTypeClass(type.id)">
                        <i :class="type.icon" class="text-xl mb-2 group-hover:font-bold"></i>
                        <div class="text-sm font-medium">{{ type.label }}</div>
                      </button>
                    </div>
                  </div>

                  <!-- Diện tích với advanced slider -->
                  <div>
                    <div class="flex justify-between items-center mb-3">
                      <label class="text-sm font-medium text-slate-300">
                        <i class="fas fa-vector-square mr-2 text-blue-400"></i>Diện tích
                      </label>
                      <div class="flex items-center gap-2">
                        <input type="number" v-model.number="propertyData.area" min="20" max="500"
                               @input="updateArea"
                               class="w-24 bg-slate-800/50 border border-purple-700 rounded-lg px-3 py-1 text-slate-50 text-center">
                        <span class="text-slate-400 text-sm">m²</span>
                      </div>
                    </div>
                    <input type="range" v-model.number="propertyData.area" min="20" max="500" step="5"
                           @input="updatePriceEstimate"
                           class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-slider">
                    <div class="relative h-6 mt-2">
                      <span class="absolute text-xs text-slate-400 transform -translate-x-1/2" style="left: 0%;">20m²</span>
                      <span class="absolute text-xs text-slate-400 transform -translate-x-1/2" style="left: 16.67%;">100m²</span>
                      <span class="absolute text-xs text-slate-400 transform -translate-x-1/2" style="left: 50%;">260m²</span>
                      <span class="absolute text-xs text-slate-400 transform -translate-x-1/2" style="left: 100%;">500m²</span>
                    </div>
                  </div>

                  <!-- Khu vực với search -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-3">
                      <i class="fas fa-map-marker-alt mr-2 text-blue-400"></i>Khu vực
                    </label>

                    <!-- Grid 2 cột cho tỉnh và phường -->
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <!-- Tỉnh/Thành phố -->
                      <div>
                        <label class="block text-xs text-slate-400 mb-2">Tỉnh/Thành phố</label>
                        <div class="relative">
                          <i class="fas fa-search absolute left-3 top-3.5 text-slate-500 text-sm"></i>
                          <input type="text"
                                 v-model="provinceSearch"
                                 @input="onProvinceInput"
                                 @focus="showProvinceDropdown = true"
                                 @blur="onProvinceBlur"
                                 placeholder="Tìm tỉnh/thành phố..."
                                 class="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">

                          <!-- Dropdown tỉnh/thành -->
                          <div v-if="showProvinceDropdown && filteredProvinces.length > 0"
                               class="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-slate-900/95 border border-slate-700 rounded-xl shadow-lg scrollbar-custom">
                            <div v-for="province in filteredProvinces"
                                 :key="province.code"
                                 @mousedown="selectProvince(province)"
                                 class="px-4 py-3 cursor-pointer hover:bg-slate-800 text-white text-sm border-b border-slate-700 last:border-b-0">
                              {{ province.name }}
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Phường/Xã -->
                      <div>
                        <label class="block text-xs text-slate-400 mb-2">Phường/Xã</label>
                        <div class="relative">
                          <i class="fas fa-search absolute left-3 top-3.5 text-slate-500 text-sm"></i>
                          <input type="text"
                                 v-model="wardSearch"
                                 @input="onWardInput"
                                 @focus="showWardDropdown = selectedProvince !== null"
                                 :disabled="!selectedProvince"
                                 :placeholder="selectedProvince ? 'Tìm phường/xã...' : 'Chọn tỉnh trước'"
                                 class="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed">

                          <!-- Dropdown phường/xã -->
                          <div v-if="showWardDropdown && filteredWards.length > 0 && selectedProvince"
                               class="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-slate-900/95 border border-slate-700 rounded-xl shadow-lg scrollbar-custom">
                            <div v-for="ward in filteredWards"
                                 :key="ward.code"
                                 @mousedown="selectWard(ward)"
                                 class="px-4 py-3 cursor-pointer hover:bg-slate-800 text-white text-sm border-b border-slate-700 last:border-b-0">
                              {{ ward.name }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Hiển thị đã chọn -->
                    <div v-if="propertyData.province && propertyData.ward"
                         class="text-xs text-slate-300 mb-4">
                      <i class="fas fa-check-circle text-green-400 mr-1"></i>
                      Đã chọn: <span class="font-medium">{{ propertyData.ward }}, {{ propertyData.province }}</span>
                    </div>

                    <!-- Thông tin khu vực -->
                    <div v-if="selectedLocation" class="mt-3 p-3 bg-slate-800/30 rounded-lg">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <i class="fas fa-chart-line text-purple-400"></i>
                          <span class="text-sm text-slate-300">Chỉ số giá:</span>
                          <span class="text-purple-400 font-bold">{{ selectedLocation.priceIndex }}x</span>
                        </div>
                        <div class="text-xs" :class="trendClass">
                          <i :class="trendIcon" class="mr-1"></i>
                          <span>{{ trendText }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Năm xây dựng với decade buttons -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-3">
                      <i class="fas fa-calendar-alt mr-2 text-blue-400"></i>Năm xây dựng
                    </label>
                    <div class="grid grid-cols-5 gap-2 mb-4">
                      <button v-for="year in yearRanges" :key="year.label"
                              @click="selectYearRange(year.value)"
                              class="py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-purple-500 hover:text-slate-50 text-xs">
                        {{ year.label }}
                      </button>
                    </div>
                    <input type="range" v-model.number="propertyData.year" min="1990" max="2024"
                           @input="updatePriceEstimate"
                           class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-slider">
                    <div class="relative h-6 mt-2">
                      <span class="absolute text-xs text-slate-400 transform -translate-x-1/2" style="left: 0%;">1990</span>
                      <span class="absolute text-xs text-slate-400 transform -translate-x-1/2" style="left: 44.12%;">2005</span>
                      <span class="absolute text-xs text-slate-400 transform -translate-x-1/2" style="left: 73.53%;">2015</span>
                      <span class="absolute text-xs text-slate-400 transform -translate-x-1/2" style="left: 88.24%;">2020</span>
                      <span class="absolute text-xs text-slate-400 transform -translate-x-1/2" style="left: 100%;">2024</span>
                    </div>
                  </div>

                  <!-- Button tiếp tục -->
                  <button @click="validateStep1"
                          class="btn-gradient w-full py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                    <span>Tiếp tục phân tích vị trí</span>
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>

                <!-- Step 2: Vị trí chi tiết -->
                <div v-show="currentStep === 2" class="space-y-6">
                  <!-- Back button -->
                  <button @click="goToStep(1)"
                          class="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
                    <i class="fas fa-arrow-left"></i>
                    <span class="text-sm">Quay lại</span>
                  </button>

                  <!-- Tiện ích xung quanh -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-4">
                      <i class="fas fa-star mr-2 text-purple-400"></i>Tiện ích xung quanh
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                      <div v-for="amenity in amenities" :key="amenity.name"
                           class="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="amenity.bgClass">
                          <i  :class="amenity.iconClass + ' ' + amenity.icon"></i>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-slate-50">{{ amenity.name }}</div>
                          <div class="text-xs text-slate-400">{{ amenity.subtitle }}</div>
                        </div>
                        <div class="ml-auto">
                          <select class="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-50">
                            <option v-for="option in amenity.options" :key="option">{{ option }}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mặt tiền/Đường rộng -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-3">
                      <i class="fas fa-road mr-2 text-purple-400"></i>Mặt tiền & Đường
                    </label>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <div class="text-xs text-slate-400 mb-2">Mặt tiền (m)</div>
                        <div class="flex items-center gap-2">
                          <input type="number" v-model.number="propertyData.frontage" min="4" max="20"
                                 class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-50 text-center">
                          <span class="text-slate-400 text-sm">m</span>
                        </div>
                      </div>

                      <div>
                        <div class="text-xs text-slate-400 mb-2">Đường rộng (m)</div>
                        <div class="flex items-center gap-2">
                          <input type="number" v-model.number="propertyData.roadWidth" min="4" max="30"
                                 class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-50 text-center">
                          <span class="text-slate-400 text-sm">m</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Button tiếp tục -->
                  <button @click="validateStep2"
                          class="w-full gradient-bg text-slate-50 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <span>Tiếp tục đặc điểm</span>
                    <i class="fas fa-arrow-right"></i>
                  </button>
                </div>

                <!-- Step 3: Đặc điểm chi tiết -->
                <div v-show="currentStep === 3" class="space-y-6">
                  <!-- Back button -->
                  <button @click="goToStep(2)"
                          class="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
                    <i class="fas fa-arrow-left"></i>
                    <span class="text-sm">Quay lại</span>
                  </button>

                  <!-- Tình trạng pháp lý -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-3">
                      <i class="fas fa-gavel mr-2 text-purple-400"></i>Tình trạng pháp lý
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                      <button v-for="legal in legalOptions" :key="legal.id"
                              @click="propertyData.legal = legal.id"
                              class="p-3 rounded-lg border-2 text-slate-300 hover:text-slate-50 transition text-sm flex items-center justify-center"
                              :class="propertyData.legal === legal.id ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-slate-700'">
                        <i :class="legal.icon" class="mr-2"></i>
                        {{ legal.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Nội thất & Tiện nghi -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-3">
                      <i class="fas fa-couch mr-2 text-purple-400"></i>Nội thất & Tiện nghi
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <button v-for="amenity in amenityOptions" :key="amenity.id"
                              @click="propertyData.amenities = amenity.id"
                              class="px-3 py-2 rounded-lg  border-2 text-slate-300 hover:text-slate-50 transition text-sm"
                              :class="propertyData.amenities === amenity.id ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-slate-700'">
                        <i :class="amenity.icon" class="mr-1"></i>
                        {{ amenity.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Hướng nhà -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-3">
                      <i class="fas fa-compass mr-2 text-purple-400"></i>Hướng nhà
                    </label>
                    <div class="grid grid-cols-4 gap-2">
                      <button v-for="direction in directions" :key="direction.id"
                              @click="propertyData.direction = direction.id"
                              class="p-3 rounded-lg border-2 hover:text-slate-50 transition text-sm flex items-center justify-center"
                              :class="propertyData.direction === direction.id ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-slate-700'">
                        <i class="fas fa-sun mr-1"></i>{{ direction.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Button tính toán -->
                  <button @click="validateStep3"
                          class="w-full gradient-bg text-slate-50 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <i class="fas fa-calculator"></i>
                    <span>Tính toán giá trị ngay</span>
                  </button>
                </div>

                <!-- Step 4: Kết quả với hiệu ứng loading và animation -->
                <div v-show="currentStep === 4" class="space-y-6">
                  <!-- Back button -->
                  <button @click="goToStep(3)"
                          class="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
                    <i class="fas fa-arrow-left"></i>
                    <span class="text-sm">Quay lại</span>
                  </button>

                  <!-- Loading State -->
                  <div v-if="isLoading" class="text-center py-10 space-y-6">
                    <div class="relative mx-auto w-24 h-24">
                      <!-- Outer spinning ring -->
                      <div class="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                      <div class="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>

                      <!-- Inner pulsing circle -->
                      <div class="absolute inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>

                      <!-- AI Icon -->
                      <div class="absolute inset-0 flex items-center justify-center">
                        <i class="fas fa-brain text-white text-2xl"></i>
                      </div>
                    </div>

                    <div>
                      <h3 class="text-xl font-bold text-slate-50 mb-3">AI đang phân tích...</h3>
                      <p class="text-slate-400 text-sm max-w-sm mx-auto">
                        Đang so sánh với 10,000+ dữ liệu thị trường và tính toán giá trị tối ưu
                      </p>

                      <!-- Progress dots -->
                      <div class="flex justify-center space-x-2 mt-6">
                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                        <div class="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        <div class="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Results State -->
                  <div v-else data-aos="fade-up" data-aos-duration="800" class="space-y-6">
                    <!-- Kết quả chính với hiệu ứng typewriter -->
                    <div class="text-center py-6">
                      <div class="text-sm text-slate-400 mb-2" data-aos="fade-down" data-aos-delay="200">GIÁ TRỊ ƯỚC TÍNH</div>
                      <div class="text-5xl font-bold text-slate-50 mb-2 typewriter-text">
                        {{ finalPrice }} tỷ
                      </div>
                      <div class="text-slate-400" data-aos="fade-up" data-aos-delay="400">VNĐ</div>

                      <!-- Độ chính xác với animation -->
                      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mt-4"
                           data-aos="zoom-in" data-aos-delay="600">
                        <div class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                        <span class="text-sm text-purple-300">Độ chính xác: 92%</span>
                      </div>
                    </div>

                    <!-- So sánh thị trường với hiệu ứng từng thanh -->
                    <div class="bg-slate-900/50 rounded-xl p-5 border border-slate-700"
                         data-aos="fade-right" data-aos-delay="200">
                      <h4 class="font-bold text-slate-50 mb-4 flex items-center gap-2">
                        <i class="fas fa-chart-bar text-purple-400"></i>
                        So sánh với thị trường
                      </h4>

                      <div class="space-y-3">
                        <!-- BĐS của bạn -->
                        <div class="animate-slide-in" style="--order: 1">
                          <div class="flex justify-between text-sm mb-1">
                            <span class="text-slate-300">BĐS của bạn</span>
                            <span class="text-slate-50 font-bold">{{ finalPrice }} tỷ</span>
                          </div>
                          <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full gradient-bg rounded-full animate-progress" :style="{ width: '100%', 'animation-delay': '0.1s' }"></div>
                          </div>
                        </div>

                        <!-- Trung bình khu vực -->
                        <div class="animate-slide-in" style="--order: 2">
                          <div class="flex justify-between text-sm mb-1">
                            <span class="text-slate-300">Trung bình khu vực</span>
                            <span class="text-slate-400">{{ averageMarketPrice }} tỷ</span>
                          </div>
                          <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-slate-600 rounded-full animate-progress" :style="{ width: getMarketWidth(averageMarketPrice), 'animation-delay': '0.2s' }"></div>
                          </div>
                        </div>

                        <!-- Cao nhất khu vực -->
                        <div class="animate-slide-in" style="--order: 3">
                          <div class="flex justify-between text-sm mb-1">
                            <span class="text-slate-300">Cao nhất khu vực</span>
                            <span class="text-slate-400">{{ highestMarketPrice }} tỷ</span>
                          </div>
                          <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div class="h-full bg-slate-600 rounded-full animate-progress" :style="{ width: getMarketWidth(highestMarketPrice), 'animation-delay': '0.3s' }"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Chi tiết phân tích với stagger animation -->
                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700 animate-fade-in"
                           data-aos="zoom-in" data-aos-delay="100">
                        <div class="text-xs text-slate-400 mb-1">Vị trí</div>
                        <div class="text-sm text-slate-50 font-medium">
                          {{ selectedLocation?.label || 'N/A' }}
                        </div>
                        <div class="text-xs text-purple-400 mt-1 animate-count-up">
                          +{{ Math.round((selectedLocation?.priceIndex - 1) * 100) || 0 }}% giá trị
                        </div>
                      </div>

                      <div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700 animate-fade-in"
                           data-aos="zoom-in" data-aos-delay="200">
                        <div class="text-xs text-slate-400 mb-1">Diện tích</div>
                        <div class="text-sm text-slate-50 font-medium">{{ propertyData.area }}m²</div>
                        <div class="text-xs text-purple-400 mt-1">Tối ưu</div>
                      </div>

                      <div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700 animate-fade-in"
                           data-aos="zoom-in" data-aos-delay="300">
                        <div class="text-xs text-slate-400 mb-1">Năm XD</div>
                        <div class="text-sm text-slate-50 font-medium">{{ propertyData.year }}</div>
                        <div class="text-xs text-amber-400 mt-1 animate-count-up">
                          -{{ getDepreciationPercentage() }}% khấu hao
                        </div>
                      </div>

                      <div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700 animate-fade-in"
                           data-aos="zoom-in" data-aos-delay="400">
                        <div class="text-xs text-slate-400 mb-1">Pháp lý</div>
                        <div class="text-sm text-slate-50 font-medium">
                          {{ legalOptions.find(l => l.id === propertyData.legal)?.label || 'N/A' }}
                        </div>
                        <div class="text-xs text-green-400 mt-1 animate-count-up">
                          +{{ getLegalValuePercentage() }}% giá trị
                        </div>
                      </div>
                    </div>

                    <!-- Khuyến nghị từ AI với slide-in -->
                    <div class="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 animate-slide-in-right"
                         data-aos="fade-up" data-aos-delay="500">
                      <div class="flex items-start gap-3">
                        <i class="fas fa-lightbulb text-purple-400 mt-1 text-xl animate-pulse"></i>
                        <div>
                          <h5 class="font-medium text-slate-50 mb-1">Khuyến nghị từ AI</h5>
                          <p class="text-sm text-slate-300">
                            Giá đề xuất bán:
                            <span class="text-slate-50 font-bold animate-highlight">{{ recommendedMinPrice }} - {{ recommendedMaxPrice }} tỷ</span>.
                            Nên chụp ảnh 360° và quay video walkthrough để tăng 40% lượt xem.
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons với bounce animation -->
                    <div class="flex flex-col sm:flex-row gap-3 pt-4" data-aos="fade-up" data-aos-delay="600">
                      <button class="flex-1 gradient-bg text-slate-50 py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 animate-bounce-in">
                        <i class="fas fa-download"></i>
                        Tải báo cáo
                      </button>
                      <button class="flex-1 bg-white/10 text-slate-50 py-3 rounded-xl font-semibold hover:bg-white/15 transition border border-white/10 flex items-center justify-center gap-2 animate-bounce-in" style="animation-delay: 0.1s">
                        <i class="fas fa-chart-line"></i>
                        Phân tích sâu
                      </button>
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
    <section id="features" class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            {{ config.features.title }}
            <span :class="config.features.titleHighlight.class">{{ config.features.titleHighlight.text }}</span>
          </h2>
          <p class="text-lg text-slate-300 max-w-2xl mx-auto">
            {{ config.features.description }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature Cards -->
          <GlassCard
              v-for="(feature, index) in config.features.items"
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
          >
            {{ feature.description }}
          </GlassCard>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 md:py-24 bg-slate-900/30">
      <div class="container mx-auto py-5 px-4 glass-card rounded-3xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            {{ config.howItWorks.title }}
            <span :class="config.howItWorks.titleHighlight.class">{{ config.howItWorks.titleHighlight.text }}</span>
          </h2>
          <p class="text-lg text-slate-300 max-w-2xl mx-auto">
            {{ config.howItWorks.description }}
          </p>
        </div>

        <div class="max-w-5xl mx-auto">
          <div class="grid md:grid-cols-4 gap-8">
            <!-- Step 1 -->
            <div class="text-center" data-aos="fade-up">
              <div class="relative mb-6">
                <div class="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto text-slate-50 text-2xl font-bold">
                  {{ config.howItWorks.steps[0].number }}
                </div>
                <div class="absolute top-1/2 right-0 w-full h-0.5 bg-slate-700 hidden md:block"></div>
              </div>
              <h3 class="text-xl font-bold text-slate-50 mb-3">{{ config.howItWorks.steps[0].title }}</h3>
              <p class="text-slate-300 text-sm">
                {{ config.howItWorks.steps[0].description }}
              </p>
            </div>

            <!-- Step 2 -->
            <div class="text-center" data-aos="fade-up" data-aos-delay="100">
              <div class="relative mb-6">
                <div class="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto text-slate-50 text-2xl font-bold">
                  {{ config.howItWorks.steps[1].number }}
                </div>
                <div class="absolute top-1/2 right-0 w-full h-0.5 bg-slate-700 hidden md:block"></div>
              </div>
              <h3 class="text-xl font-bold text-slate-50 mb-3">{{ config.howItWorks.steps[1].title }}</h3>
              <p class="text-slate-300 text-sm">
                {{ config.howItWorks.steps[1].description }}
              </p>
            </div>

            <!-- Step 3 -->
            <div class="text-center" data-aos="fade-up" data-aos-delay="200">
              <div class="relative mb-6">
                <div class="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto text-slate-50 text-2xl font-bold">
                  {{ config.howItWorks.steps[2].number }}
                </div>
                <div class="absolute top-1/2 right-0 w-full h-0.5 bg-slate-700 hidden md:block"></div>
              </div>
              <h3 class="text-xl font-bold text-slate-50 mb-3">{{ config.howItWorks.steps[2].title }}</h3>
              <p class="text-slate-300 text-sm">
                {{ config.howItWorks.steps[2].description }}
              </p>
            </div>

            <!-- Step 4 -->
            <div class="text-center" data-aos="fade-up" data-aos-delay="300">
              <div class="relative mb-6">
                <div class="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto text-slate-50 text-2xl font-bold">
                  {{ config.howItWorks.steps[3].number }}
                </div>
              </div>
              <h3 class="text-xl font-bold text-slate-50 mb-3">{{ config.howItWorks.steps[3].title }}</h3>
              <p class="text-slate-300 text-sm">
                {{ config.howItWorks.steps[3].description }}
              </p>
            </div>
          </div>

          <!-- CTA -->
          <div class="text-center mt-16">
            <button @click="goToStep(1)"
                    class="gradient-bg text-slate-50 px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition text-lg flex items-center mx-auto space-x-3">
              <i :class="config.howItWorks.ctaButton.icon"></i>
              <span>{{ config.howItWorks.ctaButton.text }}</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="py-16 md:py-24">
      <PackageService/>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="py-16 md:py-24 bg-slate-900/30">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            {{ config.testimonials.title }}
            <span :class="config.testimonials.titleHighlight.class">{{ config.testimonials.titleHighlight.text }}</span>
          </h2>
          <p class="text-lg text-slate-300 max-w-2xl mx-auto">
            {{ config.testimonials.description }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <TestimonialCard
              v-for="testimonial in config.testimonials.items"
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

    <!-- Contact Section -->
    <!-- PHẦN NÀY KHÔNG THAY ĐỔI - GIỮ NGUYÊN FORM ĐĂNG KÝ TƯ VẤN -->
    <section id="contact" class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="mx-auto">
          <div class="grid md:grid-cols-2 gap-12">
            <!-- Contact Info -->
            <div data-aos="fade-right">
              <h2 class="text-3xl font-bold text-slate-50 mb-6">
                {{ config.contact.title }}
                <span :class="config.contact.titleHighlight.class">{{ config.contact.titleHighlight.text }}</span>
              </h2>
              <p class="text-slate-300 mb-8">
                {{ config.contact.description }}
              </p>

              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mr-4">
                    <i :class="config.contact.info.phone.icon" class="text-slate-50"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-50 mb-1">{{ config.contact.info.phone.title }}</h4>
                    <p class="text-blue-400 text-lg font-semibold">{{ config.contact.info.phone.value }}</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mr-4">
                    <i :class="config.contact.info.email.icon" class="text-slate-50"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-50 mb-1">{{ config.contact.info.email.title }}</h4>
                    <p class="text-blue-400">{{ config.contact.info.email.value }}</p>
                    <p class="text-slate-400 text-sm">{{ config.contact.info.email.responseTime }}</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mr-4">
                    <i :class="config.contact.info.address.icon" class="text-slate-50"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-50 mb-1">{{ config.contact.info.address.title }}</h4>
                    <p class="text-slate-300">{{ config.contact.info.address.value }}</p>
                    <p class="text-slate-400 text-sm">{{ config.contact.info.address.workHours }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Form - GIỮ NGUYÊN LOGIC -->
            <div data-aos="fade-left">
              <div class="glass-card rounded-2xl p-8">
                <h3 class="text-xl font-bold text-slate-50 mb-6">Đăng ký tư vấn miễn phí</h3>

                <form @submit.prevent="submitContactForm" class="space-y-4">
                  <div>
                    <input type="text" v-model="contactForm.name" placeholder="Họ và tên" required
                           class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500">
                  </div>

                  <div>
                    <input type="tel" v-model="contactForm.phone" placeholder="Số điện thoại" required
                           class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500">
                  </div>

                  <div>
                    <input type="email" v-model="contactForm.email" placeholder="Email" required
                           class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500">
                  </div>

                  <div>
                    <select v-model="contactForm.need" required
                            class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-50 focus:outline-none focus:border-purple-500">
                      <option value="" disabled>Nhu cầu của bạn</option>
                      <option>Tư vấn định giá BĐS</option>
                      <option>Đăng ký dùng thử</option>
                      <option>Hợp tác doanh nghiệp</option>
                      <option>Khác</option>
                    </select>
                  </div>

                  <div>
                    <textarea rows="4" v-model="contactForm.message" placeholder="Tin nhắn của bạn"
                              class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-50 placeholder-slate-500 focus:outline-none focus:border-purple-500"></textarea>
                  </div>

                  <button type="submit"
                          class="w-full btn-gradient py-3 rounded-lg font-semibold hover:opacity-90 transition">
                    Gửi yêu cầu tư vấn
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import GlassCard from "../../UI/GlassCard.vue";
import TestimonialCard from "../../UI/TestimonialCard.vue";
import addressData from "../../../../assets/js/address.json";
import api from "../../../../api/api.js";
import Fuse from "fuse.js";
import Swal from 'sweetalert2'
import PackageService from "./PackageService.vue";
import {useAuthStore} from "../../../../stores/authStore.js";

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

// ========== HELPER FUNCTIONS ==========
// Hàm trích xuất giá trị HEX từ CSS variable
const extractCssVariableValue = (variableName) => {
  // Lấy giá trị từ biến CSS
  if (typeof document !== 'undefined') {
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue(variableName).trim();
  }
  return null;
};

// Chuyển đổi bất kỳ định dạng màu nào sang RGBA
const toRgba = (colorValue, alpha = 1) => {
  if (!colorValue) return colorValue;

  // Nếu là CSS variable: var(--color-blue-400)
  if (colorValue.startsWith('var(')) {
    // Trích xuất tên biến
    const varMatch = colorValue.match(/var\(([^)]+)\)/);
    if (varMatch) {
      const varName = varMatch[1];
      const hexColor = extractCssVariableValue(varName);
      if (hexColor) {
        colorValue = hexColor;
      }
    }
  }

  // Nếu là mã HEX
  if (colorValue.startsWith('#')) {
    // Xử lý hex có hoặc không có #
    let hex = colorValue.replace('#', '');

    // Xác định độ dài hex
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }

    // Chuyển đổi HEX to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Nếu đã là RGBA hoặc RGB
  if (colorValue.startsWith('rgb')) {
    if (colorValue.startsWith('rgba')) {
      // Thay đổi alpha của rgba hiện có
      return colorValue.replace(/rgba\(([^)]+)\)/, (match, values) => {
        const parts = values.split(',');
        parts[3] = alpha;
        return `rgba(${parts.join(',')})`;
      });
    } else if (colorValue.startsWith('rgb')) {
      // Chuyển rgb sang rgba
      return colorValue.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
    }
  }

  return colorValue;
};

// Hàm lấy màu từ config với hỗ trợ opacity
const getColor = (colorPath, alpha = 1) => {
  const paths = colorPath.split('.');
  let value = config.value;

  // Truy cập nested property
  for (const path of paths) {
    if (value && value[path] !== undefined) {
      value = value[path];
    } else {
      return colorPath; // Trả về nguyên bản nếu không tìm thấy
    }
  }

  // Nếu có opacity và cần chuyển sang rgba
  if (alpha < 1 && value) {
    return toRgba(value, alpha);
  }

  return value;
};

// ========== CONFIG OBJECT ==========
const config = ref({
  // ========== STYLE CONFIG ==========
  styles: {
    colors: {
      blue400: 'var(--color-blue-400)',
      blue500: 'var(--color-blue-500)',
      blue600: 'var(--color-blue-600)',
      purple400: 'var(--color-purple-400)',
      purple500: 'var(--color-purple-500)',
      purple600: 'var(--color-purple-600)',
      slate50: 'var(--color-slate-50)',
      slate300: 'var(--color-slate-300)',
      slate400: 'var(--color-slate-400)',
      slate500: 'var(--color-slate-500)',
      slate700: 'var(--color-slate-700)',
      slate800: 'var(--color-slate-800)',
      slate900: 'var(--color-slate-900)'
    },
    gradients: {
      heroText: 'from-blue-400 to-purple-500',
      button: 'from-blue-500 to-purple-600',
      sectionTitle: 'from-blue-400 to-purple-500'
    }
  },

  // ========== HERO SECTION ==========
  hero: {
    tagline: 'CÔNG NGHỆ AI TIÊN TIẾN',
    taglineIcon: 'fas fa-bolt',
    title: 'Định giá BĐS chính xác',
    highlightedText: 'với AI & Big Data',
    description: 'Công cụ định giá thông minh của Thiên Hà Group phân tích',
    descriptionContinuation: 'mỗi ngày để đưa ra mức giá tối ưu với độ chính xác lên đến',
    highlights: [
      {
        text: '10,000+ dữ liệu thị trường',
        class: 'text-slate-50 font-semibold'
      },
      {
        text: '95%',
        class: 'text-blue-300 font-bold'
      }
    ],

    // Call to Action Buttons
    ctaButtons: {
      priceNow: {
        text: 'Định giá ngay',
        icon: 'fas fa-calculator'
      },
      watchDemo: {
        text: 'Xem demo',
        icon: 'fas fa-play-circle'
      }
    },

    // Stats
    stats: [
      { value: '95%', label: 'Độ chính xác' },
      { value: '10K+', label: 'Dữ liệu/ngày' },
      { value: '50K+', label: 'Khách hàng' }
    ]
  },

  // ========== FEATURES SECTION ==========
  features: {
    title: 'Công nghệ',
    titleHighlight: {
      text: 'định giá vượt trội',
      class: 'gradient-text'
    },
    description: 'Kết hợp AI, Big Data và Machine Learning để đưa ra mức giá chính xác nhất',

    items: [
      {
        title: 'AI Phân Tích Nâng Cao',
        iconName: 'fas fa-brain',
        color: 'purple',
        aosDelay: '0',
        description: 'Hệ thống AI phân tích 50+ yếu tố ảnh hưởng đến giá BĐS, từ vị trí đến xu hướng thị trường.',
        listContent: [
          'Phân tích dữ liệu lịch sử',
          'Dự đoán xu hướng giá',
          'So sánh 1000+ BĐS tương tự'
        ],
        listDotIconClass: 'fas fa-check-circle text-purple-400'
      },
      {
        title: 'Big Data Thời Gian Thực',
        iconName: 'fas fa-database',
        color: 'blue',
        aosDelay: '100',
        description: 'Cập nhật 10,000+ dữ liệu giao dịch mỗi ngày từ các sàn BĐS lớn và cơ quan nhà nước.',
        listContent: [
          'Dữ liệu từ 20+ nguồn uy tín',
          'Cập nhật real-time 24/7',
          'Phân tích đa chiều'
        ],
        listDotIconClass: 'fas fa-check-circle text-blue-400'
      },
      {
        title: 'Báo Cáo Chi Tiết',
        iconName: 'fas fa-chart-line',
        color: 'purple',
        aosDelay: '200',
        description: 'Xuất báo cáo đầy đủ với biểu đồ, phân tích SWOT và khuyến nghị giá tối ưu.',
        listContent: [
          'Biểu đồ tương tác',
          'So sánh với BĐS tương tự',
          'Dự báo 6-12 tháng'
        ],
        listDotIconClass: 'fas fa-check-circle text-purple-400'
      }
    ]
  },

  // ========== HOW IT WORKS SECTION ==========
  howItWorks: {
    title: 'Quy trình',
    titleHighlight: {
      text: 'định giá 4 bước',
      class: 'gradient-text'
    },
    description: 'Đơn giản, nhanh chóng và chính xác chỉ trong 5 phút',

    steps: [
      {
        number: 1,
        title: 'Nhập thông tin',
        description: 'Điền thông tin BĐS: vị trí, diện tích, loại hình, năm xây dựng'
      },
      {
        number: 2,
        title: 'AI Phân tích',
        description: 'Hệ thống AI phân tích 10,000+ dữ liệu và 50+ yếu tố ảnh hưởng'
      },
      {
        number: 3,
        title: 'So sánh thị trường',
        description: 'So sánh với 100+ BĐS tương tự đã giao dịch trong 6 tháng gần nhất'
      },
      {
        number: 4,
        title: 'Nhận kết quả',
        description: 'Nhận báo cáo chi tiết với giá đề xuất và phân tích SWOT'
      }
    ],

    ctaButton: {
      text: 'Bắt đầu định giá miễn phí',
      icon: 'fas fa-play-circle'
    }
  },

  // ========== TESTIMONIALS SECTION ==========
  testimonials: {
    title: 'Được tin dùng bởi',
    titleHighlight: {
      text: '50,000+ khách hàng',
      class: 'gradient-text'
    },
    description: 'Những đánh giá từ khách hàng đã sử dụng công cụ định giá của chúng tôi',

    items: [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        position: 'Chủ nhà phố Q.2',
        quote: 'Công cụ định giá giúp tôi bán nhà nhanh hơn 30% so với dự kiến. Giá đề xuất rất chính xác, khách hàng đồng ý ngay!',
        initials: 'NA',
        color: 'purple',
        rating: 5,
        aos: 'fade-up',
        aosDelay: '0'
      },
      {
        id: 2,
        name: 'Trần Thị B',
        position: 'Môi giới BĐS',
        quote: 'Tôi đã sử dụng nhiều công cụ định giá nhưng của Thiên Hà Group là chính xác nhất. Khách hàng tin tưởng hơn khi có báo cáo chi tiết.',
        initials: 'TB',
        color: 'blue',
        rating: 5,
        aos: 'fade-up',
        aosDelay: '100'
      },
      {
        id: 3,
        name: 'Lê Văn C',
        position: 'Nhà đầu tư BĐS',
        quote: 'Phân tích SWOT và dự báo giá giúp tôi đưa ra quyết định đầu tư đúng đắn. Đã tăng lợi nhuận 25% nhờ công cụ này.',
        initials: 'LC',
        color: 'purple',
        rating: 5,
        aos: 'fade-up',
        aosDelay: '200'
      }
    ]
  },

  // ========== CONTACT SECTION ==========
  contact: {
    title: 'Liên hệ với',
    titleHighlight: {
      text: 'chuyên gia',
      class: 'gradient-text'
    },
    description: 'Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7',

    // Contact Info
    info: {
      phone: {
        title: 'Hotline',
        value: '091.123.1882',
        icon: 'fas fa-phone'
      },
      email: {
        title: 'Email',
        value: 'thienhagroup@gmail.com',
        responseTime: 'Phản hồi trong 2 giờ',
        icon: 'fas fa-envelope'
      },
      address: {
        title: 'Văn phòng',
        value: '14 đường 15, KĐT Vạn Phúc, Phường Hiệp Bình Phước, TP. Thủ Đức, TP.HCM',
        workHours: 'Làm việc: Thứ 2 - Thứ 7',
        icon: 'fas fa-map-marker-alt'
      }
    }
  }
});

// ========== HÀM LOAD CONFIG TỪ API ==========
const loadConfig = async () => {
  try {
    const response = await api.get('/thg/public/cms/contentSection/59'); // Thay bằng ID thực tế
    if (response.status === 200) {
      const apiConfig = JSON.parse(response.data.contentJson);

      // Hàm đệ quy để xử lý CSS variables
      const wrapCssVariables = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;

        const result = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string' && value.startsWith('--')) {
            result[key] = `var(${value})`;
          } else if (typeof value === 'object' && value !== null) {
            result[key] = wrapCssVariables(value);
          } else {
            result[key] = value;
          }
        }
        return result;
      };

      const processedConfig = wrapCssVariables(apiConfig);
      config.value = processedConfig;

      console.log('Hoàn tất load config từ API:', config.value);
    }
  } catch (error) {
    console.error('Lỗi khi load config:', error);
  }
};

// ========== PHẦN KHÔNG THAY ĐỔI - LOGIC ĐỊNH GIÁ ==========

// Step navigation
const currentStep = ref(1)

const stepsConfig = [
  { number: 1, label: 'Thông tin' },
  { number: 2, label: 'Vị trí' },
  { number: 3, label: 'Đặc điểm' },
  { number: 4, label: 'Kết quả' }
]

const progressWidth = computed(() => {
  return `${((currentStep.value - 1) / 3) * 100}%`
})

function goToStep(step) {
  currentStep.value = step
}

function getStepClass(stepNumber) {
  if (currentStep.value > stepNumber) {
    return 'bg-green-500'
  } else if (currentStep.value === stepNumber) {
    return 'gradient-bg'
  } else {
    return 'bg-slate-800 border border-slate-700'
  }
}

// Property data
const propertyTypes = [
  { id: 'nha-pho', label: 'Nhà phố', icon: 'fas fa-house', color: 'purple' },
  { id: 'can-ho', label: 'Căn hộ', icon: 'fas fa-building', color: 'blue' },
  { id: 'dat-nen', label: 'Đất nền', icon: 'fas fa-layer-group', color: 'purple' },
  { id: 'biet-thu', label: 'Biệt thự', icon: 'fas fa-igloo', color: 'blue' }
]

function selectPropertyType(type) {
  propertyData.type = type
  updatePriceEstimate()
}

function getPropertyTypeClass(typeId) {
  const baseClass = 'border-2'
  if (propertyData.type === typeId) {
    const color = propertyTypes.find(t => t.id === typeId)?.color || 'purple'
    return `${baseClass} border-${color}-500 bg-${color}-500/10 text-${color}-400 group-hover:border-${color}-500`
  }
  return `${baseClass} border-slate-700`
}

function updateArea() {
  if (propertyData.area < 20) propertyData.area = 20
  if (propertyData.area > 500) propertyData.area = 500
  updatePriceEstimate()
}

// Locations
const specialLocations = [
  {
    priceIndex: 1.2,
    newAddress: [
      'Phường Sài Gòn',
      'Phường Bến Thành',
      'Phường Tân Định',
      'Phường Cầu Ông Lãnh'
    ]
  },
  {
    priceIndex: 1.0,
    newAddress: [
      'Phường Xuân Hòa',
      'Phường Nhiêu Lộc',
      'Phường Bàn Cờ'
    ]
  },
  {
    priceIndex: 1.3,
    newAddress: [
      'Phường Tân Mỹ',
      'Phường Tân Phú',
      'Phường Phú Thuận',
      'Phường Tân Hưng',
      'Phường Bình Thuận'
    ]
  },
  {
    priceIndex: 0.9,
    newAddress: [
      'Phường Gia Định',
      'Phường Bình Thạnh',
      'Phường Thạnh Mỹ Tây',
      'Phường Bình Quới'
    ]
  },
  {
    priceIndex: 0.8,
    newAddress: [
      'Phường Linh Xuân',
      'Phường Linh Trung',
      'Phường Tam Bình',
      'Phường Hiệp Bình',
      'Phường Trường Thọ'
    ]
  },
  {
    priceIndex: 0.7,
    newAddress: [
      'Phường Hạnh Thông',
      'Phường An Nhơn',
      'Phường Gò Vấp',
      'Phường Thông Tây Hội'
    ]
  },
  {
    priceIndex: 0.6,
    newAddress: [
      'Phường Đức Nhuận',
      'Phường Cầu Kiệu',
      'Phường Phú Nhuận'
    ]
  }
];

// ========== ADDRESS DATA ==========
const provinces = ref([]);
const selectedProvince = ref(null);
const provinceSearch = ref('');
const wardSearch = ref('');
const showProvinceDropdown = ref(false);
const showWardDropdown = ref(false);
const filteredProvinces = ref([]);
const filteredWards = ref([]);

let provinceFuse = null;
let wardFuse = null;

// ========== PROPERTY DATA - Update structure ==========
const propertyData = reactive({
  type: 'nha-pho',
  area: 100,
  province: '', // Thay location bằng province
  ward: '',     // Thêm ward
  year: 2015,
  frontage: 6,
  roadWidth: 8,
  legal: '',
  amenities: '',
  direction: ''
});

// ========== ADDRESS INITIALIZATION ==========
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

// ========== PROVINCE HANDLERS ==========
const onProvinceInput = () => {
  if (!provinceFuse) return;

  const searchTerm = provinceSearch.value.trim();
  if (searchTerm.length === 0) {
    filteredProvinces.value = provinces.value;
  } else {
    const results = provinceFuse.search(searchTerm);
    filteredProvinces.value = results.map(result => result.item);
  }
  showProvinceDropdown.value = true;
};

const onProvinceBlur = () => {
  setTimeout(() => {
    showProvinceDropdown.value = false;
  }, 200);
};

const selectProvince = (province) => {
  selectedProvince.value = province;
  provinceSearch.value = province.name;
  propertyData.province = province.name;

  // Reset phường/xã
  wardSearch.value = '';
  propertyData.ward = '';
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
    filteredWards.value = province.wards;
  }

  updatePriceEstimate();
};

// ========== WARD HANDLERS ==========
const onWardInput = () => {
  if (!wardFuse || !selectedProvince.value) return;

  const searchTerm = wardSearch.value.trim();
  if (searchTerm.length === 0) {
    filteredWards.value = selectedProvince.value.wards;
  } else {
    const results = wardFuse.search(searchTerm);
    filteredWards.value = results.map(result => result.item);
  }
  showWardDropdown.value = true;
};

const onWardBlur = () => {
  setTimeout(() => {
    showWardDropdown.value = false;
  }, 200);
};

const selectWard = (ward) => {
  wardSearch.value = ward.name;
  propertyData.ward = ward.name;
  showWardDropdown.value = false;
  updatePriceEstimate();
};

// ========== SELECTED LOCATION COMPUTED ==========
const selectedLocation = computed(() => {
  if (!propertyData.province || !propertyData.ward) return null;

  // Tính priceIndex dựa trên phường
  let priceIndex = 0.6; // Mặc định

  // Nếu là TP.HCM
  if (propertyData.province === "Thành phố Hồ Chí Minh") {
    const specialLocation = specialLocations.find(loc =>
        loc.newAddress.includes(propertyData.ward)
    );
    if (specialLocation) {
      priceIndex = specialLocation.priceIndex;
    }
  }

  return {
    label: `${propertyData.ward}, ${propertyData.province}`,
    priceIndex: priceIndex
  };
});

// ========== TREND COMPUTED PROPERTIES ==========
const trendClass = computed(() => {
  if (!selectedLocation.value) return '';
  const index = selectedLocation.value.priceIndex;
  if (index > 1.1) return 'text-purple-400';
  if (index > 0.9) return 'text-blue-400';
  return 'text-rose-400';
});

const trendIcon = computed(() => {
  if (!selectedLocation.value) return '';
  const index = selectedLocation.value.priceIndex;
  if (index > 1.1) return 'fas fa-trend-up';
  if (index > 0.9) return 'fas fa-equals';
  return 'fas fa-trend-down';
});

const trendText = computed(() => {
  if (!selectedLocation.value) return '';
  const index = selectedLocation.value.priceIndex;
  if (index > 1.1) return 'Cao nhất khu vực';
  if (index > 0.9) return 'Trung bình';
  return 'Thấp hơn trung bình';
});

// Year ranges
const yearRanges = [
  { label: '2020+', value: 2020 },
  { label: '2015-2019', value: 2015 },
  { label: '2010-2014', value: 2010 },
  { label: '2000-2009', value: 2000 },
  { label: 'Trước 2000', value: 1990 }
]

function selectYearRange(year) {
  propertyData.year = year
  updatePriceEstimate()
}

// Amenities in step 2
const amenities = [
  {
    name: 'Ga Metro',
    subtitle: 'Khoảng cách',
    icon: 'fas fa-subway',
    iconClass: 'text-blue-400',
    bgClass: 'bg-blue-500/10',
    options: ['500m', '1km', '2km', '3km+']
  },
  {
    name: 'Trường học',
    subtitle: 'Quốc tế/Công lập',
    icon: 'fas fa-school',
    iconClass: 'text-green-400',
    bgClass: 'bg-green-500/10',
    options: ['<1km', '1-3km', '3-5km']
  },
  {
    name: 'Trung tâm TM',
    subtitle: 'Vincom/Aeon',
    icon: 'fas fa-shopping-cart',
    iconClass: 'text-purple-400',
    bgClass: 'bg-purple-500/10',
    options: ['500m', '1km', '2km', '3km+']
  },
  {
    name: 'Công viên',
    subtitle: 'Khoảng cách',
    icon: 'fas fa-tree',
    iconClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10',
    options: ['300m', '500m', '1km', '2km+']
  }
]

// Legal options
const legalOptions = [
  { id: 'so-do', label: 'Sổ đỏ', icon: 'fas fa-file-contract text-green-400' },
  { id: 'so-hong', label: 'Sổ hồng', icon: 'fas fa-file-alt text-yellow-400' },
  { id: 'hop-dong', label: 'Hợp đồng', icon: 'fas fa-handshake text-blue-400' },
  { id: 'dang-ky', label: 'Đang đăng ký', icon: 'fas fa-edit text-red-400' }
]

// Amenity options
const amenityOptions = [
  { id: 'full', label: 'Full nội thất', icon: 'fas fa-check-circle' },
  { id: 'basic', label: 'Cơ bản', icon: 'fas fa-check' },
  { id: 'empty', label: 'Trống', icon: 'fas fa-times' }
]

// Directions
const directions = [
  { id: 'dong', label: 'Đông' },
  { id: 'tay', label: 'Tây' },
  { id: 'nam', label: 'Nam' },
  { id: 'bac', label: 'Bắc' }
]


const basePrices = {
  'nha-pho': 150,
  'can-ho': 120,
  'dat-nen': 80,
  'biet-thu': 200
}

// ========== PRICE CALCULATION ==========
const updatePriceEstimate = () => {
  if (!selectedLocation.value) {
    estimatedPrice.value = 0;
    return;
  }

  const locationMultiplier = selectedLocation.value.priceIndex;
  let basePrice = basePrices[propertyData.type] || 100;

  // Adjust for area
  let areaMultiplier = 1;
  if (propertyData.area > 300) areaMultiplier = 0.95;
  else if (propertyData.area > 200) areaMultiplier = 0.98;
  else if (propertyData.area < 50) areaMultiplier = 1.2;

  // Adjust for year
  const currentYear = 2024;
  const age = currentYear - propertyData.year;
  let yearMultiplier = 1;
  if (age > 30) yearMultiplier = 0.7;
  else if (age > 20) yearMultiplier = 0.8;
  else if (age > 10) yearMultiplier = 0.9;
  else if (age > 5) yearMultiplier = 0.95;

  // Calculate price in billions
  let price = (basePrice * propertyData.area * locationMultiplier * areaMultiplier * yearMultiplier) / 1000;
  estimatedPrice.value = Math.round(price * 10) / 10;
};

function calculateFinalPrice() {
  // Additional multipliers
  let frontageMultiplier = 1
  if (propertyData.frontage > 8) frontageMultiplier = 1.15
  else if (propertyData.frontage > 6) frontageMultiplier = 1.08
  else if (propertyData.frontage < 4) frontageMultiplier = 0.9

  let roadMultiplier = 1
  if (propertyData.roadWidth > 12) roadMultiplier = 1.1
  else if (propertyData.roadWidth > 8) roadMultiplier = 1.05
  else if (propertyData.roadWidth < 6) roadMultiplier = 0.95

  let legalMultiplier = 1
  switch (propertyData.legal) {
    case 'so-do': legalMultiplier = 1.08; break
    case 'so-hong': legalMultiplier = 1.05; break
    case 'hop-dong': legalMultiplier = 0.95; break
    case 'dang-ky': legalMultiplier = 0.85; break
  }

  let amenityMultiplier = 1
  switch (propertyData.amenities) {
    case 'full': amenityMultiplier = 1.1; break
    case 'basic': amenityMultiplier = 1.0; break
    case 'empty': amenityMultiplier = 0.95; break
  }

  let directionMultiplier = 1
  switch (propertyData.direction) {
    case 'nam': directionMultiplier = 1.05; break
    case 'dong': directionMultiplier = 1.03; break
    case 'tay': directionMultiplier = 0.98; break
    case 'bac': directionMultiplier = 1.0; break
  }

  // Apply all multipliers
  let finalPriceValue = estimatedPrice.value * frontageMultiplier * roadMultiplier *
      legalMultiplier * amenityMultiplier * directionMultiplier

  // Add random factor (±2%)
  const randomFactor = 0.98 + Math.random() * 0.04
  finalPriceValue *= randomFactor

  finalPrice.value = Math.round(finalPriceValue * 10) / 10
  goToStep(4)
}

// ========== PHẦN KHÔNG THAY ĐỔI - FORM ĐĂNG KÝ TƯ VẤN ==========
// Contact form
const contactForm = reactive({
  name: '',
  phone: '',
  email: '',
  need: '',
  message: ''
})

function submitContactForm() {
  Swal.fire({
    icon: 'success',
    title: 'Thành công',
    text: 'Cảm ơn bạn đã gửi thông tin! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.',
  })
  Object.assign(contactForm, {
    name: '',
    phone: '',
    email: '',
    need: '',
    message: ''
  })
}

// ========== VALIDATION FUNCTIONS ==========
const validateStep1 = () => {
  if (!propertyData.type) {
    Swal.fire({
      icon: 'warning',
      title: 'Thiếu thông tin',
      text: 'Vui lòng chọn loại bất động sản.',
    })
    return false
  }

  if (!propertyData.area || propertyData.area < 20 || propertyData.area > 500) {
    Swal.fire({
      icon: 'warning',
      title: 'Diện tích không hợp lệ',
      text: 'Diện tích phải từ 20 đến 500 m².',
    })
    return false
  }

  if (!propertyData.province || !propertyData.ward) {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn chưa điền đầy đủ thông tin',
      text: 'Vui lòng chọn đầy đủ tỉnh/thành phố và phường/xã.',
      customClass: {
        popup: 'bg-brand-dark',
        confirmButton: 'btn-gradient px-6 py-2 text-white rounded-lg',
        cancelButton: 'border border-white text-white bg-transparent px-6 py-2 hover:bg-slate-800 rounded-lg',
        title: 'text-white',
        content: 'text-slate-300'
      },
      buttonsStyling: false // bắt buộc để dùng class custom
    })
    return false
  }

  if (!propertyData.year) {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn chưa điền đầy đủ thông tin',
      text: 'Vui lòng chọn năm xây dựng.',
      customClass: {
        popup: 'bg-brand-dark',
        confirmButton: 'btn-gradient px-6 py-2 text-white rounded-lg',
        cancelButton: 'border border-white text-white bg-transparent px-6 py-2 hover:bg-slate-800 rounded-lg',
        title: 'text-white',
        content: 'text-slate-300'
      },
      buttonsStyling: false // bắt buộc để dùng class custom
    })
    return false
  }

  goToStep(2)
  return true
}

const validateStep2 = () => {
  // Bước 2 không có trường bắt buộc, có thể bỏ qua
  goToStep(3)
  return true
}
// Thêm state loading
const isLoading = ref(false)

const auth = useAuthStore();
const openLoginModal = () => {
  window.dispatchEvent(new Event('open-login-modal'));
};

const validateStep3 = () => {


  if (!propertyData.legal) {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn chưa điền đầy đủ thông tin',
      text: 'Vui lòng chọn tình trạng pháp lý.',
      customClass: {
        popup: 'bg-brand-dark',
        confirmButton: 'btn-gradient px-6 py-2 text-white rounded-lg',
        cancelButton: 'border border-white text-white bg-transparent px-6 py-2 hover:bg-slate-800 rounded-lg',
        title: 'text-white',
        content: 'text-slate-300'
      },
      buttonsStyling: false // bắt buộc để dùng class custom
    });
    return false
  }

  if (!propertyData.amenities) {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn chưa điền đầy đủ thông tin',
      text: 'Vui lòng chọn mức độ nội thất.',
      customClass: {
        popup: 'bg-brand-dark',
        confirmButton: 'btn-gradient px-6 py-2 text-white rounded-lg',
        cancelButton: 'border border-white text-white bg-transparent px-6 py-2 hover:bg-slate-800 rounded-lg',
        title: 'text-white',
        content: 'text-slate-300'
      },
      buttonsStyling: false // bắt buộc để dùng class custom
    })
    return false
  }

  if (!propertyData.direction) {
    Swal.fire({
      icon: 'warning',
      title: 'Bạn chưa điền đầy đủ thông tin',
      text: 'Vui lòng chọn hướng nhà.',
      customClass: {
        popup: 'bg-brand-dark',
        confirmButton: 'btn-gradient px-6 py-2 text-white rounded-lg',
        cancelButton: 'border border-white text-white bg-transparent px-6 py-2 hover:bg-slate-800 rounded-lg',
        title: 'text-white',
        content: 'text-slate-300'
      },
      buttonsStyling: false // bắt buộc để dùng class custom
    })
    return false
  }


  if (auth.userInfo == null) {
    Swal.fire({
      icon: 'warning',
      title: 'Đăng nhập để tiếp tục',
      text: 'Vui lòng đăng nhập để nhận kết quả định giá.',
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonText: 'Đăng nhập',

      // custom class
      customClass: {
        popup: 'bg-brand-dark',
        confirmButton: 'btn-gradient px-6 py-2 text-white rounded-lg',
        cancelButton: 'border border-white text-white bg-transparent px-6 py-2 hover:bg-slate-800 rounded-lg',
        title: 'text-white',
        content: 'text-slate-300'
      },

      buttonsStyling: false // bắt buộc để dùng class custom
    }).then((result) => {
      if (result.isConfirmed) {
        openLoginModal()
      }
    })

    return false
  }


  // Chuyển sang step 4 TRƯỚC KHI bắt đầu loading
  goToStep(4)

  // Show loading
  isLoading.value = true

  // Simulate AI processing time
  setTimeout(() => {
    calculateFinalPrice()
    isLoading.value = false

    // Trigger AOS animations
    setTimeout(() => {
      if (window.AOS) {
        window.AOS.refresh()
      }
    }, 100)
  }, 2500) // 2.5 seconds delay

  return true
}

// Price calculation
const estimatedPrice = ref(0)
const finalPrice = ref(0)

// Thêm các computed properties mới
const averageMarketPrice = computed(() => {
  if (finalPrice.value === 0) return 0
  return Math.round((finalPrice.value * 0.9) * 10) / 10
})

const highestMarketPrice = computed(() => {
  if (finalPrice.value === 0) return 0
  return Math.round((finalPrice.value * 1.04) * 10) / 10
})

const recommendedMinPrice = computed(() => {
  if (finalPrice.value === 0) return 0
  return Math.round((finalPrice.value * 0.98) * 10) / 10
})

const recommendedMaxPrice = computed(() => {
  if (finalPrice.value === 0) return 0
  return Math.round((finalPrice.value * 1.02) * 10) / 10
})

// Hàm tính toán chiều rộng cho thanh so sánh
const getMarketWidth = (price) => {
  if (finalPrice.value === 0 || price === 0) return '0%'
  const percentage = (price / finalPrice.value) * 100
  return `${Math.min(percentage, 100)}%`
}

// Hàm tính phần trăm khấu hao dựa trên năm xây dựng
const getDepreciationPercentage = () => {
  const currentYear = 2024
  const age = currentYear - propertyData.year

  if (age > 30) return 30
  if (age > 20) return 20
  if (age > 10) return 10
  if (age > 5) return 5
  return 0
}

// Hàm tính phần trăm giá trị pháp lý
const getLegalValuePercentage = () => {
  switch (propertyData.legal) {
    case 'so-do': return 8
    case 'so-hong': return 5
    case 'hop-dong': return 0
    case 'dang-ky': return -15
    default: return 0
  }
}

// ========== ON MOUNTED ==========
onMounted(async () => {
  // Load config từ CMS nếu cần
  await loadConfig();

  if (window.AOS) {
    window.AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }

  // Khởi tạo dữ liệu địa chỉ
  initializeAddressData();
  filteredProvinces.value = provinces.value;
});

// Initialize price estimate - watch selectedLocation thay vì propertyData.location
watch(selectedLocation, updatePriceEstimate, { immediate: true });

// Thêm watch để reset ward khi province thay đổi
watch(() => propertyData.province, (newProvince, oldProvince) => {
  if (newProvince !== oldProvince) {
    propertyData.ward = '';
    wardSearch.value = '';
  }
});
</script>

<style>
.text-blue-400 {
color: v-bind('getColor("styles.colors.blue400")');
}

.text-purple-400 {
color: v-bind('getColor("styles.colors.purple400")');
}

.text-slate-300 {
color: v-bind('getColor("styles.colors.slate300")');
}

.text-slate-400 {
color: v-bind('getColor("styles.colors.slate400")');
}

.text-slate-50 {
color: v-bind('getColor("styles.colors.slate50")');
}

/* Màu với opacity sử dụng helper */
.bg-blue-500\/10 {
background-color: v-bind('getColor("styles.colors.blue500", 0.1)');
}

.bg-purple-500\/10 {
background-color: v-bind('getColor("styles.colors.purple500", 0.1)');
}

.bg-slate-800 {
background-color: v-bind('getColor("styles.colors.slate800")');
}

.bg-slate-900\/50 {
background-color: v-bind('getColor("styles.colors.slate900", 0.5)');
}

/* Gradient backgrounds */
.gradient-bg {
background: linear-gradient(135deg,
v-bind('getColor("styles.colors.blue400")'),
v-bind('getColor("styles.colors.purple500")')
);
}

.gradient-text {
background: linear-gradient(135deg,
v-bind('getColor("styles.colors.blue400")'),
v-bind('getColor("styles.colors.purple500")')
);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
}

/* Các class khác giữ nguyên */
.glass-card {
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.hover-lift {
transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
transform: translateY(-5px);
box-shadow: 0 20px 40px v-bind('getColor("styles.colors.purple500", 0.15)');
}

/* Range slider */
.range-slider {
-webkit-appearance: none;
appearance: none;
}

.range-slider::-webkit-slider-thumb {
-webkit-appearance: none;
appearance: none;
width: 20px;
height: 20px;
border-radius: 50%;
background: v-bind('getColor("styles.colors.purple500")');
cursor: pointer;
}

.range-slider::-moz-range-thumb {
width: 20px;
height: 20px;
border-radius: 50%;
background: v-bind('getColor("styles.colors.purple500")');
cursor: pointer;
border: none;
}

/* Animation keyframes và các style khác giữ nguyên */
@keyframes pulse {
0%, 100% { opacity: 1; }
50% { opacity: 0.7; }
}

.animate-pulse {
animation: pulse 2s infinite;
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
background: v-bind('getColor("styles.colors.purple500", 0.5)');
border-radius: 3px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
background: v-bind('getColor("styles.colors.purple500", 0.7)');
}

/* Loading animations */
@keyframes spin {
to { transform: rotate(360deg); }
}

@keyframes bounce {
0%, 100% { transform: translateY(0); }
50% { transform: translateY(-5px); }
}

@keyframes slideIn {
from {
opacity: 0;
transform: translateX(-20px);
}
to {
opacity: 1;
transform: translateX(0);
}
}

@keyframes slideInRight {
from {
opacity: 0;
transform: translateX(20px);
}
to {
opacity: 1;
transform: translateX(0);
}
}

@keyframes fadeIn {
from { opacity: 0; }
to { opacity: 1; }
}

@keyframes progressFill {
from { width: 0; }
to { width: var(--target-width); }
}

@keyframes countUp {
from {
opacity: 0;
transform: translateY(10px);
}
to {
opacity: 1;
transform: translateY(0);
}
}

@keyframes typewriter {
from { width: 0; }
to { width: 100%; }
}

@keyframes bounceIn {
0% {
opacity: 0;
transform: scale(0.3);
}
50% {
opacity: 1;
transform: scale(1.05);
}
70% {
transform: scale(0.9);
}
100% {
transform: scale(1);
}
}

@keyframes highlight {
0%, 100% { color: inherit; }
50% { color: v-bind('getColor("styles.colors.blue400")'); }
}

/* Apply animations */
.animate-spin {
animation: spin 1s linear infinite;
}

.animate-bounce {
animation: bounce 1s infinite;
}

.animate-slide-in {
opacity: 0;
animation: slideIn 0.5s ease-out forwards;
animation-delay: calc(var(--order, 0) * 0.1s);
}

.animate-slide-in-right {
animation: slideInRight 0.5s ease-out;
}

.animate-fade-in {
animation: fadeIn 0.5s ease-out;
}

.animate-progress {
animation: progressFill 1s ease-out forwards;
}

.animate-count-up {
animation: countUp 0.5s ease-out forwards;
opacity: 0;
animation-delay: 0.3s;
}

.typewriter-text {
overflow: hidden;
white-space: nowrap;
margin: 0 auto;
letter-spacing: 0.15em;
animation: typewriter 1s steps(20, end);
}

.animate-bounce-in {
animation: bounceIn 0.6s ease-out;
}

.animate-highlight {
animation: highlight 2s infinite;
}

/* Stagger delay for children */
.animate-stagger > * {
opacity: 0;
animation: fadeIn 0.5s ease-out forwards;
}

.animate-stagger > *:nth-child(1) { animation-delay: 0.1s; }
.animate-stagger > *:nth-child(2) { animation-delay: 0.2s; }
.animate-stagger > *:nth-child(3) { animation-delay: 0.3s; }
.animate-stagger > *:nth-child(4) { animation-delay: 0.4s; }
</style>