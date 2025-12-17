<template>
  <div v-if="asset" class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-4 sm:px-6 lg:px-10 pb-10">
    <div class="space-y-6 w-full">

      <!-- HEADER -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-emerald-600 shadow-2xl border border-indigo-200/60 text-white">
        <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_30%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.35),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.3),transparent_30%)]"></div>
        <div class="relative p-6 lg:p-8 space-y-6">
          <div class="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8 justify-between">
            <div class="flex-1 space-y-4">
              <div class="flex flex-wrap items-center gap-3">
                <button
                    @click="$router.back()"
                    class="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl font-semibold backdrop-blur transition-all duration-200 shadow-sm border border-white/30"
                >
                  <i class="fa-solid fa-arrow-left text-sm"></i>
                  <span>Quay lại</span>
                </button>

                <div class="flex items-center gap-2 px-4 py-2.5 bg-white/15 rounded-xl border border-white/30 backdrop-blur">
                  <div class="bg-white/30 p-2 rounded-lg">
                    <i class="fa-solid fa-pen text-white text-sm"></i>
                  </div>
                  <div>
                    <p class="text-xs uppercase tracking-wide text-white/80">Chỉnh sửa tài sản</p>
                    <h1 class="text-2xl font-bold">#{{ asset.id }}</h1>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <span :class="['px-3 py-1.5 rounded-full font-semibold text-xs shadow-sm border border-white/30 bg-white/10', badgeClass(asset.phanLoaiHang)]">
                    {{ asset.phanLoaiHang }}
                  </span>
                  <span v-if="isHouse" class="px-3 py-1.5 bg-white/15 text-white rounded-full font-semibold text-xs border border-white/30">
                    <i class="fa-solid fa-house-chimney mr-1"></i> Nhà
                  </span>
                  <span v-if="isLand" class="px-3 py-1.5 bg-white/15 text-white rounded-full font-semibold text-xs border border-white/30">
                    <i class="fa-solid fa-mountain-sun mr-1"></i> Đất
                  </span>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3 text-sm text-white/90">
                <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20">
                  <i class="fa-solid fa-location-dot"></i>
                  <span class="font-medium">{{ formatAddress(asset.address) }}</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20">
                  <i class="fa-solid fa-calendar-check"></i>
                  <span class="font-medium">Đã cập nhật: {{ formatUpdatedAt(asset.updatedAt) }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-3 justify-start lg:justify-end items-center">
              <button
                  @click="resetForm"
                  class="px-5 py-2.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 shadow-sm flex items-center gap-2 border border-white/30"
              >
                <i class="fa-solid fa-rotate-left"></i>
                <span>Đặt lại</span>
              </button>
              <button
                  @click="saveChanges"
                  :disabled="isSaving"
                  class="px-5 py-2.5 bg-white text-indigo-900 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <i class="fa-solid fa-save"></i>
                <span>{{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur">
              <div class="flex items-center justify-between text-sm text-white/70">
                <span>Giá bán</span>
                <i class="fa-solid fa-sack-dollar"></i>
              </div>
              <div class="text-2xl font-bold mt-2">{{ formatMoneyVN(formData.giaBan || asset.giaBan) }}</div>
            </div>
            <div class="bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur">
              <div class="flex items-center justify-between text-sm text-white/70">
                <span>Giá nội bộ</span>
                <i class="fa-solid fa-hand-holding-dollar"></i>
              </div>
              <div class="text-2xl font-bold mt-2">{{ formatMoneyVN(formData.giaNoiBo || asset.giaNoiBo) }}</div>
            </div>
            <div class="bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur">
              <div class="flex items-center justify-between text-sm text-white/70">
                <span>Phí môi giới</span>
                <i class="fa-solid fa-percent"></i>
              </div>
              <div class="text-2xl font-bold mt-2">
                {{
                  formData.phiMoiGioi != null
                      ? formData.phiMoiGioi + '%'
                      : asset.phiMoiGioi != null
                          ? asset.phiMoiGioi + '%'
                          : 'Chưa cập nhật'
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN EDIT FORM -->
      <form @submit.prevent="saveChanges" class="space-y-6">

        <!-- SECTION 1: THÔNG TIN CƠ BẢN -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-300 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl">
              <i class="fa-solid fa-circle-info text-white text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-900">Thông tin cơ bản</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Loại tài sản -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <i class="fa-solid fa-tag text-white text-xs"></i>
                  </div>
                  <span>Loại tài sản</span>
                </span>
              </label>
              <select
                  v-model="formData.loaiTaiSan"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  required
                  @change="onAssetTypeChange"
              >
                <option value="">-- Chọn loại tài sản --</option>
                <option value="NHA">Nhà</option>
                <option value="DAT">Đất</option>
                <option value="DATLON">Đất lớn</option>
              </select>
              <div v-if="!formData.loaiTaiSan && formData.structure" class="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg mt-2">
                <i class="fa-solid fa-lightbulb mr-1"></i>
                Phát hiện: "<span class="font-medium">{{ formData.structure }}</span>" → {{ detectAssetTypeFromStructure }}
              </div>
            </div>

            <!-- Giá bán -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <i class="fa-solid fa-money-bill-wave text-white text-xs"></i>
                  </div>
                  <span>Giá bán</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.giaBan"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập giá bán"
                    step="1000000"
                    required
                />
                <i class="fa-solid fa-dollar-sign absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
              <div class="text-sm font-medium text-blue-700 bg-blue-50 p-2 rounded-lg">
                {{ formatMoneyVN(formData.giaBan) }}
              </div>
            </div>

            <!-- Phân loại hàng -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Phân loại hàng -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
          <i class="fa-solid fa-box text-white text-xs"></i>
        </div>
        <span>Phân loại hàng</span>
      </span>
                </label>
                <select
                    v-model="formData.phanLoaiHang"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl
             focus:ring-2 focus:ring-emerald-500 focus:border-transparent
             bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    required
                >
                  <option value="">-- Chọn phân loại --</option>
                  <option value="BN30N">Bán nhanh 30 ngày</option>
                  <option value="HOPTAC">Hàng hợp tác</option>
                  <option value="HTT">Hàng thị trường</option>
                </select>
              </div>

              <!-- Đơn vị sở hữu -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
          <i class="fa-solid fa-building text-white text-xs"></i>
        </div>
        <span>Đơn vị sở hữu</span>
      </span>
                </label>
                <select
                    v-model="formData.donViSoHuu"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl
             focus:ring-2 focus:ring-purple-500 focus:border-transparent
             bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    required
                >
                  <option value="">-- Chọn đơn vị --</option>
                  <option value="THG">THG</option>
                  <option value="DT">Đối tác</option>
                </select>
              </div>
            </div>


            <!-- Giá nội bộ -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <i class="fa-solid fa-hand-holding-usd text-white text-xs"></i>
                  </div>
                  <span>Giá nội bộ</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.giaNoiBo"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập giá nội bộ"
                    step="1000000"
                    required
                />
                <i class="fa-solid fa-dollar-sign absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
              <div class="text-sm font-medium text-blue-700 bg-blue-50 p-2 rounded-lg">
                {{ formatMoneyVN(formData.giaNoiBo) }}
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                    <i class="fa-solid fa-bullseye text-white text-xs"></i>
                  </div>
                  <span>Giá mong muốn (VND)</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.desire"
                    step="1000000"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập giá mong muốn"
                    required
                />
                <i class="fa-solid fa-dollar-sign absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
              <div class="text-sm font-medium text-rose-700 bg-rose-50 p-2 rounded-lg">
                {{ formatMoneyVN(formData.desire) }}
              </div>
            </div>

            <!-- Phí môi giới -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Phí môi giới (%) -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div
            class="w-6 h-6 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500
                 flex items-center justify-center shadow-sm"
        >
          <i class="fa-solid fa-percent text-white text-xs"></i>
        </div>
        <span>Phí môi giới (%)</span>
      </span>
                </label>

                <div class="relative">
                  <input
                      type="number"
                      v-model.number="formData.phiMoiGioi"
                      step="0.1"
                      min="0"
                      max="100"
                      class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl
               focus:ring-2 focus:ring-purple-500 focus:border-transparent
               bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                      placeholder="Nhập % phí môi giới"
                  />
                  <i
                      class="fa-solid fa-percent absolute left-3 top-1/2 -translate-y-1/2
               text-yellow-500 text-sm"
                  ></i>
                </div>

                <!-- Hiển thị giá trị -->
                <div
                    v-if="formData.phiMoiGioi !== null && formData.phiMoiGioi !== ''"
                    class="text-sm font-medium text-purple-700 bg-purple-50 p-2 rounded-lg"
                >
                  {{ formData.phiMoiGioi }}%
                </div>
              </div>

              <!-- Hiển thị (Yes / No) -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div
            class="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500
                 flex items-center justify-center shadow-sm"
        >
          <i class="fa-solid fa-eye text-white text-xs"></i>
        </div>
        <span>Hiển thị</span>
      </span>
                </label>

                <select
                    v-model="formData.show"
                    class="w-full px-4 py-3 border border-slate-300 rounded-xl
             focus:ring-2 focus:ring-purple-500 focus:border-transparent
             bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    required
                >
                  <option :value="true">Yes</option>
                  <option :value="false">No</option>
                </select>
              </div>
            </div>


          </div>
        </div>

        <!-- SECTION 2: ĐỊA CHỈ -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-300 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div class="bg-gradient-to-r from-emerald-500 to-green-600 p-2.5 rounded-xl">
              <i class="fa-solid fa-location-dot text-white text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-900">Địa chỉ</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <!-- 🟦 TỈNH / THÀNH PHỐ — nằm cột trái -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <i class="fa-solid fa-city text-white text-xs"></i>
          </div>
          <span>Tỉnh/Thành phố</span>
        </span>
              </label>

              <select
                  v-model="formAddress.province"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  required
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                <option v-for="province in provinceOptions" :key="province.code" :value="province.name">
                  {{ province.name }}
                </option>
              </select>
            </div>

            <!-- 🟪 ĐỊA CHỈ ĐƯỜNG — chuyển sang cột phải -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
            <i class="fa-solid fa-road text-white text-xs"></i>
          </div>
          <span>Địa chỉ đường</span>
        </span>
              </label>

              <div class="relative">
                <input
                    type="text"
                    v-model="formAddress.street"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Ví dụ: 23 Đường Pasteur"
                    required
                />
                <i class="fa-solid fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- 🟩 PHƯỜNG / XÃ -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
            <i class="fa-solid fa-map-marker-alt text-white text-xs"></i>
          </div>
          <span>Phường/Xã</span>
        </span>
              </label>

              <select
                  v-model="formAddress.ward"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  required
              >
                <option value="">-- Chọn phường/xã --</option>
                <option v-for="ward in wardOptions" :key="ward.code" :value="ward.name">
                  {{ ward.name }}
                </option>
              </select>
            </div>

            <!-- 🟧 VỊ TRÍ -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
    <span class="flex items-center gap-2">
      <div
          class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500
               flex items-center justify-center"
      >
        <i class="fa-solid fa-location-arrow text-white text-xs"></i>
      </div>
      <span>Vị trí</span>
    </span>
              </label>

              <div class="relative">
                <input
                    type="text"
                    v-model="formData.landPosition"
                    list="landPositions"
                    required
                    placeholder="Chọn hoặc nhập vị trí"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl
             focus:ring-2 focus:ring-rose-500 focus:border-transparent
             bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                />

                <i
                    class="fa-solid fa-location-arrow
             absolute left-3 top-1/2 -translate-y-1/2
             text-slate-500 text-sm"
                ></i>

                <!-- DATALIST -->
                <datalist id="landPositions">
                  <option value="Mặt tiền đường chính"></option>
                  <option value="Mặt tiền quốc lộ"></option>
                  <option value="Mặt tiền tỉnh lộ"></option>
                  <option value="Mặt tiền nội bộ"></option>

                  <option value="Góc 2 mặt tiền"></option>
                  <option value="Góc 3 mặt tiền"></option>

                  <option value="Hẻm xe hơi"></option>
                  <option value="Hẻm xe hơi tránh nhau"></option>
                  <option value="Hẻm xe máy"></option>
                  <option value="Hẻm cụt"></option>

                  <option value="Khu dân cư"></option>
                  <option value="Chưa cập nhật"></option>
                </datalist>
              </div>
            </div>


            <!-- 🟥 ĐỊA CHỈ CŨ -->
            <div class="space-y-2 col-span-2">
              <label class="block text-sm font-semibold text-slate-800">
    <span class="flex items-center gap-2">
      <div
          class="w-6 h-6 rounded-lg bg-gradient-to-r from-slate-500 to-gray-500
               flex items-center justify-center"
      >
        <i class="fa-solid fa-history text-white text-xs"></i>
      </div>
      <span>Địa chỉ cũ</span>
    </span>
              </label>

              <input
                  type="text"
                  v-model="formData.oldAddress"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl
           focus:ring-2 focus:ring-slate-500 focus:border-transparent
           bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Nhập địa chỉ cũ"
              />
            </div>


            <!-- 🟦 PREVIEW -->
            <div class="md:col-span-3 space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <i class="fa-solid fa-eye text-white text-xs"></i>
          </div>
          <span>Xem trước địa chỉ</span>
        </span>
              </label>

              <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div class="flex items-center gap-2 text-slate-800">
                  <i class="fa-solid fa-map-marker-alt text-blue-500"></i>
                  <span class="font-medium">{{ fullAddressPreview }}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- SECTION 3: CHỦ SỞ HỮU & THÔNG TIN PHÁP LÝ -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-300 p-6">
          <!-- HEADER -->
          <div class="flex flex-col gap-3 mb-6 pb-4 border-b border-slate-200">
            <div class="flex items-center gap-3">
              <div class="bg-gradient-to-r from-purple-500 to-violet-600 p-2.5 rounded-xl">
                <i class="fa-solid fa-user-tie text-white text-lg"></i>
              </div>
              <h2 class="text-xl font-bold text-slate-900">Chủ sở hữu & Pháp lý</h2>
            </div>
          </div>

          <!-- GRID -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <!-- HÀNG 1 -->
            <!-- Số thửa -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
            <i class="fa-solid fa-vector-square text-white text-xs"></i>
          </div>
          <span>Số thửa đất</span>
        </span>
              </label>
              <input v-model="formData.parcelNumber"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" />
            </div>

            <!-- Số tờ -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
            <i class="fa-solid fa-map text-white text-xs"></i>
          </div>
          <span>Số tờ bản đồ</span>
        </span>
              </label>
              <input v-model="formData.plotNumber"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" />
            </div>

            <!-- Tổng diện tích -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <i class="fa-solid fa-ruler-combined text-white text-xs"></i>
          </div>
          <span>Diện tích tổng (m²)</span>
        </span>
              </label>
              <input v-model.number="formData.totalArea" type="number" step="0.01"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" />
            </div>

            <!-- HÀNG 2 -->
            <!-- Quan hệ -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <i class="fa-solid fa-handshake text-white text-xs"></i>
          </div>
          <span>Quan hệ sở hữu</span>
        </span>
              </label>
              <input v-model="formData.ownershipRelation" list="ownershipRelations"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" />
              <datalist id="ownershipRelations">
                <option value="Chính chủ"></option>
                <option value="Người thân"></option>
                <option value="Uỷ quyền"></option>
                <option value="Đồng sở hữu"></option>
                <option value="Môi giới đại diện"></option>
              </datalist>
            </div>

            <!-- Quyền sử dụng -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
            <i class="fa-solid fa-scale-balanced text-white text-xs"></i>
          </div>
          <span>Quyền sử dụng đất</span>
        </span>
              </label>
              <input v-model="formData.landUseRight"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl"  list="landUseRights"/>
              <datalist id="landUseRights">
                <option value="Sổ đỏ"></option>
                <option value="Sổ hồng"></option>
                <option value="Đất thổ cư"></option>
                <option value="Đất nông nghiệp"></option>
                <option value="Giấy tờ viết tay"></option>
              </datalist>
            </div>

            <!-- Loại đất -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
    <span class="flex items-center gap-2">
      <div
          class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500
               flex items-center justify-center"
      >
        <i class="fas fa-clipboard-check text-white text-xs"></i>
      </div>
      <span>
        Trạng thái <span class="text-red-500">*</span>
      </span>
    </span>
              </label>

              <select
                  v-model="formData.status"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl
           focus:ring-2 focus:ring-amber-500 focus:border-transparent
           bg-white shadow-sm transition-all text-sm hover:border-slate-400"
              >
                <option value="">-- Chọn tình trạng --</option>
                <option value="Chưa định giá">Mới</option>
                <option value="Bán nhanh 30 ngày">Bán nhanh 30 ngày</option>
                <option value="Đã bán">Đã bán</option>
              </select>

              <small v-if="errors?.status" class="text-red-600 text-sm">
                {{ errors.status }}
              </small>
            </div>


            <!-- HÀNG 3 -->
            <!-- Mặt tiền -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-yellow-500 flex items-center justify-center">
            <i class="fa-solid fa-road text-white text-xs"></i>
          </div>
          <span>Mặt tiền (m)</span>
        </span>
              </label>
              <input v-model.number="formData.matTienNha" type="number" step="0.01"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" />
            </div>

            <!-- Chiều ngang -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <i class="fa-solid fa-arrows-left-right text-white text-xs"></i>
          </div>
          <span>Chiều ngang (m)</span>
        </span>
              </label>
              <input v-model.number="formData.chieuNgang" type="number" step="0.01"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" />
            </div>

            <!-- Chiều dài -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
            <i class="fa-solid fa-arrows-up-down text-white text-xs"></i>
          </div>
          <span>Chiều dài (m)</span>
        </span>
              </label>
              <input v-model.number="formData.chieuDai" type="number" step="0.01"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" />
            </div>

            <!-- HÀNG 4 -->
            <!-- Hiện trạng -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
            <i class="fa-solid fa-eye text-white text-xs"></i>
          </div>
          <span >Hiện trạng đất</span>
        </span>
              </label>
              <input v-model="formData.hienTrangDat"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" list="hienTrangDatList" />
              <datalist id="hienTrangDatList">
                <option value="Đất trống"></option>
                <option value="Có nhà"></option>
                <option value="Đã lên thổ cư"></option>
                <option value="Đang cho thuê"></option>
                <option value="Đang tranh chấp"></option>
              </datalist>
            </div>

            <!-- Độ rộng -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <i class="fa-solid fa-road text-white text-xs"></i>
          </div>
          <span>Độ rộng đường</span>
        </span>
              </label>
              <input v-model="formData.doRongDuong"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" />
            </div>

            <!-- Lộ giới -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
            <i class="fa-solid fa-road text-white text-xs"></i>
          </div>
          <span>Lộ giới</span>
        </span>
              </label>
              <input v-model="formData.loGioi"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" />
            </div>

            <!-- FULL -->
            <div class="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
              <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <i class="fa-solid fa-layer-group text-white text-xs"></i>
          </div>
          <span>Kết cấu / hình dạng</span>
        </span>
              </label>
              <input v-model="formData.structure"
                     class="w-full px-4 py-3 border border-slate-300 rounded-xl" />
            </div>

          </div>
        </div>

        <!-- SECTION: NGƯỜI BÁN THÀNH CÔNG -->
        <div v-if="isSold" class="bg-white rounded-2xl shadow-xl border border-slate-300 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div class="bg-gradient-to-r from-rose-500 to-pink-500 p-2.5 rounded-xl">
              <i class="fa-solid fa-user-check text-white text-lg"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900">Người bán thành công</h2>
              <p class="text-sm text-slate-600">Thông tin người chốt giao dịch</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Tìm người bán -->
            <div>
              <label class="block text-sm font-semibold mb-2">
                Email / SĐT <span class="text-red-500">*</span>
              </label>
              <input
                  v-model.trim="formData.nguoiBanSearch"
                  @blur="handleNguoiBanLookup"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl"
                  placeholder="Nhập email hoặc SĐT"
              />
              <small v-if="errors.nguoiBanSearch" class="text-red-600">
                {{ errors.nguoiBanSearch }}
              </small>
            </div>

            <!-- Tên người bán -->
            <div>
              <label class="block text-sm font-semibold mb-2">Người bán</label>
              <input
                  readonly
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-100"
                  v-model="formData.nguoiBanTen"
              />
            </div>

            <!-- Giá bán thành công -->
            <div>
              <label class="block text-sm font-semibold mb-2">
                Giá bán thành công <span class="text-red-500">*</span>
              </label>
              <input
                  type="number"
                  min="0"
                  step="1000000"
                  v-model.number="formData.giaBanThanhCong"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl"
              />
              <small v-if="errors.giaBanThanhCong" class="text-red-600">
                {{ errors.giaBanThanhCong }}
              </small>
              <div class="text-sm font-medium text-rose-700 bg-rose-50 p-2 rounded-lg mt-1">
                {{ formatMoneyVN(formData.giaBanThanhCong) }}
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 4A: THÔNG TIN NHÀ (chỉ hiện khi loại tài sản là NHA) -->
        <div v-if="isHouse" class="bg-white rounded-2xl shadow-xl border border-slate-300 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div class="bg-gradient-to-r from-amber-500 to-orange-600 p-2.5 rounded-xl">
              <i class="fa-solid fa-house-chimney text-white text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-900">Thông tin nhà</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <!-- HÀNG 1 -->
            <!-- Diện tích sàn -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
          <i class="fa-solid fa-square text-white text-xs"></i>
        </div>
        <span>Diện tích sàn (m²)</span>
      </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.floorArea"
                    step="0.01"
                    min="0"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl
                 focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                 bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập diện tích sàn"
                />
                <i class="fa-solid fa-ruler absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
              <div v-if="formData.floorArea" class="text-sm font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                {{ formatArea(formData.floorArea) }}
              </div>
            </div>

            <!-- Loại nhà -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
          <i class="fa-solid fa-home text-white text-xs"></i>
        </div>
        <span>Loại nhà</span>
      </span>
              </label>
              <input
                  type="text"
                  v-model="formData.loaiNha"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl
               focus:ring-2 focus:ring-purple-500 focus:border-transparent
               bg-white shadow-sm transition-all text-sm hover:border -slate-400"
                  placeholder="Ví dụ: Nhà phố" list="loaiNhaList"
              />
              <datalist id="loaiNhaList">
                <option value="Nhà cấp 4"></option>
                <option value="Chung cư"></option>
                <option value="Nhà 4 tầng"></option>
                <option value="Nhà phố"></option>
                <option value="Nhà biệt thự"></option>
              </datalist>
            </div>

            <!-- Tổng số phòng -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
          <i class="fa-solid fa-door-closed text-white text-xs"></i>
        </div>
        <span>Tổng số phòng</span>
      </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.tongSoPhong"
                    min="0"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl
                 focus:ring-2 focus:ring-rose-500 focus:border-transparent
                 bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập tổng số phòng"
                />
                <i class="fa-solid fa-door-closed absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- HÀNG 2 -->
            <!-- Số phòng ngủ -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
          <i class="fa-solid fa-bed text-white text-xs"></i>
        </div>
        <span>Số phòng ngủ</span>
      </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.soPhongNgu"
                    min="0"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl
                 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                 bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập số phòng ngủ"
                />
                <i class="fa-solid fa-bed absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- Số phòng tắm -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
          <i class="fa-solid fa-shower text-white text-xs"></i>
        </div>
        <span>Số phòng tắm</span>
      </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.soPhongTam"
                    min="0"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl
                 focus:ring-2 focus:ring-amber-500 focus:border-transparent
                 bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập số phòng tắm"
                />
                <i class="fa-solid fa-shower absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- Số tầng + Số lầu (GIỮ NGUYÊN GRID CON) -->
            <div class="grid grid-cols-2 gap-2">
              <!-- Số tầng -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <i class="fa-solid fa-building text-white text-xs"></i>
          </div>
          <span>Số tầng</span>
        </span>
                </label>
                <div class="relative">
                  <input
                      type="number"
                      v-model.number="formData.soTang"
                      min="0"
                      class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                      placeholder="Nhập số tầng"
                  />
                  <i class="fa-solid fa-stairs absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                </div>
              </div>

              <!-- Số lầu -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-800">
        <span class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
            <i class="fa-solid fa-stairs text-white text-xs"></i>
          </div>
          <span>Số lầu</span>
        </span>
                </label>
                <div class="relative">
                  <input
                      type="number"
                      v-model.number="formData.soLau"
                      min="0"
                      class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl
                   focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                   bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                      placeholder="Nhập số lầu"
                  />
                  <i class="fa-solid fa-stairs absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
                </div>
              </div>
            </div>

            <!-- HÀNG 3 -->
            <!-- Nội thất -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
          <i class="fa-solid fa-couch text-white text-xs"></i>
        </div>
        <span>Nội thất</span>
      </span>
              </label>
              <input
                  type="text"
                  v-model="formData.noiThat"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl
               focus:ring-2 focus:ring-emerald-500 focus:border-transparent
               bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Cơ bản" list="noiThatList"
              />
              <datalist id="noiThatList">
                <option value="Full nội thất"></option>
                <option value="Cơ bản"></option>
                <option value="Nội thất trống"></option>
                <option value="Có tủ bếp"></option>
                <option value="Có máy lạnh"></option>
              </datalist>
            </div>



            <!-- Hiện trạng nhà -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
          <i class="fa-solid fa-eye text-white text-xs"></i>
        </div>
        <span>Hiện trạng nhà</span>
      </span>
              </label>
              <input
                  type="text"
                  v-model="formData.hienTrangNha"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl
               focus:ring-2 focus:ring-amber-500 focus:border-transparent
               bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Sạch sẽ" list="hienTrangNhaList"
              />
              <datalist id="hienTrangNhaList">
                <option value="Nhà mới"></option>
                <option value="Nhà đang ở"></option>
                <option value="Nhà đang cho thuê"></option>
                <option value="Nhà xuống cấp"></option>
                <option value="Nhà bỏ trống"></option>
              </datalist>
            </div>

            <!-- Năm xây dựng -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
      <span class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
          <i class="fa-solid fa-calendar text-white text-xs"></i>
        </div>
        <span>Năm xây dựng</span>
      </span>
              </label>
              <div class="relative">
                <input
                    type="text"
                    v-model="formData.namXayDung"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Ví dụ: 2020"
                />
                <i class="fa-solid fa-calendar-days absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

          </div>

        </div>

        <!-- SECTION: CHI TIẾT PHÒNG -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-300 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div class="bg-gradient-to-r from-teal-500 to-emerald-500 p-2.5 rounded-xl">
              <i class="fa-solid fa-bed text-white text-lg"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900">Chi tiết phòng</h2>
              <p class="text-sm text-slate-600">Cập nhật số lượng, diện tích và mô tả cho từng loại phòng.</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead class="bg-slate-100 text-slate-700">
              <tr>
                <th class="px-4 py-3 font-semibold">Loại phòng</th>
                <th class="px-4 py-3 font-semibold w-32">Số lượng</th>
                <th class="px-4 py-3 font-semibold w-40">Diện tích (m²)</th>
                <th class="px-4 py-3 font-semibold">Mô tả</th>
                <th class="px-4 py-3 font-semibold w-20 text-center">Xóa</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(room, index) in formData.rooms" :key="room.id || index" class="border-t border-slate-200">
                <td class="px-4 py-3">
                  <input
                      list="roomList"
                      v-model="room.loaiPhong"
                      class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Ghi tên phòng"
                      required
                  />

                  <datalist id="roomList">
                    <option v-for="opt in roomTypeOptions" :key="opt" :value="opt" />
                  </datalist>

                </td>
                <td class="px-4 py-3">
                  <input
                      v-model.number="room.soLuong"
                      type="number"
                      min="0"
                      class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                      v-model.number="room.dienTich"
                      type="number"
                      step="0.1"
                      min="0"
                      class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                      v-model="room.moTa"
                      type="text"
                      class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Ghi chú thêm..."
                      required
                  />
                </td>
                <td class="px-4 py-3 text-center">
                  <button type="button" class="text-rose-600 hover:text-rose-700" @click="removeRoom(index)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!formData.rooms.length">
                <td colspan="5" class="px-4 py-4 text-center text-slate-500">Chưa có thông tin phòng</td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <div class="text-sm text-slate-600">Thêm mới hoặc chỉnh sửa chi tiết phòng để mô tả đầy đủ tài sản.</div>
            <button
                type="button"
                class="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-semibold shadow hover:from-teal-600 hover:to-emerald-600"
                @click="addRoom"
            >
              <i class="fa-solid fa-plus mr-2"></i>Thêm phòng
            </button>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-xl border border-slate-300 p-6">
          <section class="mb-5">
            <div class="d-flex align-items-center mb-4 border-bottom pb-3 gap-3">
              <!-- ICON -->
              <div
                  class="d-flex align-items-center justify-content-center
           rounded-4
           bg-danger bg-opacity-10
           shadow-sm"
                  style="width: 48px; height: 48px;"
              >
                <i class="fas fa-user-tie text-danger fs-4"></i>
              </div>

              <!-- TEXT -->
              <div>
                <h2 class="h5 fw-bold mb-1">Thông tin chủ tài sản và liên hệ</h2>
                <p class="text-muted small mb-0">Thông tin người sở hữu tài sản</p>
              </div>
            </div>


            <div class="alert alert-warning border-warning bg-warning-light mb-4" v-if="isLookupMode">
            <div class="d-flex align-items-start">
              <i class="fas fa-info-circle mt-1 me-2 text-warning"></i>
              <div>
                <p class="mb-1 fw-medium">Chế độ tìm kiếm chủ tài sản</p>
                <p class="small mb-0">
                  Đối với hạng "Hợp tác" và "Bán nhanh 30 ngày", hệ thống sẽ tự động tìm và
                  khóa thông tin khi tìm thấy chủ tài sản.
                </p>
              </div>
            </div>
          </div>

          <div class="row g-4">
            <!-- Tìm chủ tài sản -->
            <div class="col-md-4" v-if="isLookupMode">
              <label class="form-label fw-semibold d-flex align-items-center gap-2">
                <i class="fas fa-search text-primary"></i>
                <span>Tìm chủ tài sản <span class="text-danger">*</span></span>
              </label>
              <div class="input-group input-group-md">
        <span class="input-group-text bg-light">
          <i class="fas fa-search text-muted"></i>
        </span>
                <input
                    type="text"
                    class="form-control"
                    v-model.trim="ownerSearch"
                    @blur="handleOwnerLookup"
                    placeholder="Nhập số điện thoại hoặc email"
                />
              </div>

              <div v-if="ownerLookupMessage" class="mt-2">
                <div
                    :class="[
            'alert',
            ownerLookupMessage.includes('thành công')
              ? 'alert-success'
              : 'alert-danger',
            'py-2 small'
          ]"
                >
                  <i
                      :class="
              ownerLookupMessage.includes('thành công')
                ? 'fas fa-check-circle'
                : 'fas fa-exclamation-circle'
            "
                  ></i>
                  {{ ownerLookupMessage }}
                </div>
              </div>

              <small v-if="errors.ownerSearch" class="text-danger">
                {{ errors.ownerSearch }}
              </small>
            </div>

            <!-- Họ tên chủ -->
            <div class="col-md-4">
              <label class="form-label fw-semibold d-flex align-items-center gap-2">
                <i class="fas fa-user text-success"></i>
                <span>Họ tên chủ <span class="text-danger">*</span></span>
              </label>
              <div class="input-group input-group-md">
        <span class="input-group-text bg-light">
          <i class="fas fa-user text-muted"></i>
        </span>
                <input
                    type="text"
                    class="form-control"
                    v-model.trim="formData.ownerName"
                    :readonly="isLookupMode && formData.ownerId"
                    :class="{ 'bg-light': isLookupMode && formData.ownerId }"
                    placeholder="Họ và tên đầy đủ"
                />
              </div>
              <small v-if="errors.ownerName" class="text-danger">
                {{ errors.ownerName }}
              </small>
            </div>

            <!-- Số điện thoại -->
            <div class="col-md-4">
              <label class="form-label fw-semibold d-flex align-items-center gap-2">
                <i class="fas fa-phone text-info"></i>
                <span>Số điện thoại <span class="text-danger">*</span></span>
              </label>
              <div class="input-group input-group-md">
        <span class="input-group-text bg-light">
          <i class="fas fa-phone text-muted"></i>
        </span>
                <input
                    type="text"
                    class="form-control"
                    v-model.trim="formData.ownerPhone"
                    :readonly="isLookupMode && formData.ownerId"
                    :class="{ 'bg-light': isLookupMode && formData.ownerId }"
                    placeholder="Số điện thoại liên hệ"
                />
              </div>
              <small v-if="errors.ownerPhone" class="text-danger">
                {{ errors.ownerPhone }}
              </small>
            </div>
          </div>

          <div class="row g-4 mt-2">
            <!-- Liên hệ mở khóa -->
            <div class="col-md-4">
              <label class="form-label fw-semibold">
                Liên hệ <span class="text-danger">*</span>
              </label>
              <input
                  v-model="formData.lienHeMoKhoa"
                  type="tel"
                  class="form-control"
                  placeholder="VD: 0909 123 456"
              />
              <small v-if="errors.lienHeMoKhoa" class="text-danger">
                {{ errors.lienHeMoKhoa }}
              </small>
            </div>

            <!-- Hiện thông tin chủ -->
            <div class="col-md-4">
              <label class="form-label fw-semibold">
                Hiện thông tin chủ khi MG mở khóa
              </label>
              <select
                  v-model="formData.hienThongTinChuKhiMoKhoa"
                  class="form-select"
              >
                <option :value="true">Có</option>
                <option :value="false">Không</option>
              </select>
            </div>

            <!-- Hiện liên hệ -->
            <div class="col-md-4">
              <label class="form-label fw-semibold">
                Hiện liên hệ khi MG mở khóa
              </label>
              <select
                  v-model="formData.hienLienHeKhiMoKhoa"
                  class="form-select"
              >
                <option :value="true">Có</option>
                <option :value="false">Không</option>
              </select>
            </div>
          </div>
        </section>
        </div>

        <!-- SECTION: HÌNH ẢNH & TỆP ĐÍNH KÈM -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-300 p-6">
          <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
            <div
                class="w-12 h-12 rounded-2xl
           bg-gradient-to-r from-indigo-500 to-blue-500
           flex items-center justify-center
           shadow-lg shadow-blue-500/30 ring-1 ring-white/30"
            >
              <i class="fa-solid fa-images text-white text-2xl"></i>
            </div>

            <div>
              <h2 class="text-xl font-bold text-slate-900">Hình ảnh & tài liệu</h2>
              <p class="text-sm text-slate-600">
                Quản lý ảnh, sổ và file đính kèm của tài sản.
              </p>
            </div>
          </div>


          <FileOrLand
              entity-type="land"
              :entity-id="asset.id"
              :file-list="formData.files || []"
              :canEdit="true"
              @update:files="handleFilesUpdate"
          />
        </div>

        <!-- ACTION BUTTONS -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-10">
          <button
              type="button"
              @click="$router.back()"
              class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-slate-500 to-gray-600 text-white rounded-xl font-semibold hover:from-slate-600 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <i class="fa-solid fa-times"></i>
            <span>Hủy</span>
          </button>

          <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
                type="button"
                @click="resetForm"
                class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-rotate-left"></i>
              <span>Đặt lại</span>
            </button>

            <button
                type="submit"
                :disabled="isSaving"
                class="w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i class="fa-solid fa-save"></i>
              <span>{{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch, reactive} from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "/src/api/api.js";
import FileOrLand from "../land/FileOrLand.vue";
import addressData from "/src/assets/js/address.json";
import {showLoading, updateAlertSuccess} from "../../assets/js/alertService.js";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const asset = ref(null);
const formData = ref({});
// ===== NGƯỜI BÁN THÀNH CÔNG =====
formData.value.nguoiBanId ??= null
formData.value.nguoiBanTen ??= ''
formData.value.nguoiBanSearch ??= ''
formData.value.giaBanThanhCong ??= null

const isSold = computed(() => formData.value.status === 'Đã bán')


const originalFiles = ref([]);
const formAddress = ref({
  street: "",
  ward: "",
  province: ""
});
const isSaving = ref(false);
const provinces = addressData || [];

const provinceOptions = computed(() => provinces);
const selectedProvince = computed(() => findProvinceByName(formAddress.value.province));
const wardOptions = computed(() => selectedProvince.value?.wards || []);

watch(() => formAddress.value.province, (newProvince) => {
  const province = findProvinceByName(newProvince);

  if (!province) {
    formAddress.value.ward = "";
    return;
  }

  const wardStillValid = province.wards.find(ward => normalizeText(ward.name) === normalizeText(formAddress.value.ward));

  if (!wardStillValid) {
    formAddress.value.ward = "";
  }
});

// Load dữ liệu ban đầu
onMounted(async () => {
  await loadAssetDetail();
});


async function loadAssetDetail() {
  try {
    const res = await api.get(`/admin.thg/product/admin/chi-tiet/${id}`);
    asset.value = res.data;
    initializeFormData();
    parseAddress();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu tài sản:", error);
  }
}

function initializeFormData() {
  formData.value = JSON.parse(JSON.stringify(asset.value));
  formData.value.loaiTaiSan = formData.value.loaiTaiSan || detectAssetTypeFromStructure.value || "";
  formData.value.rooms = formData.value.rooms || [];
  formData.value.files = formData.value.files || [];
  formData.value.newFiles = formData.value.newFiles || [];
  formData.value.newLandBookFiles = formData.value.newLandBookFiles || [];
  formData.value.deletedFileIds = formData.value.deletedFileIds || [];
  formData.value.deletedLandBookFileIds = formData.value.deletedLandBookFileIds || [];
  originalFiles.value = JSON.parse(JSON.stringify(formData.value.files));
}

function parseAddress() {
  if (!formData.value.address) {
    formAddress.value = { street: "", ward: "", province: "" };
    return;
  }

  const parts = formData.value.address.split("/!!").map(p => p.trim());
  const street = parts[0] || "";
  const rawWard = parts[1] || "";
  const rawProvince = parts[2] || "";

  const provinceMatched = findProvinceByName(rawProvince);
  const provinceName = provinceMatched?.name || "";
  const wardName = findWardByName(rawWard, provinceMatched);

  formAddress.value = {
    street,
    ward: wardName,
    province: provinceName
  };
  formData.value.khuVucMa = provinceName;
}

function normalizeText(value) {
  return (value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
}

function findProvinceByName(name) {
  const normalized = normalizeText(name);
  if (!normalized) return null;

  return provinces.find(province => normalizeText(province.name) === normalized) || null;
}

function findWardByName(name, province) {
  const normalized = normalizeText(name);
  if (!normalized || !province) return "";

  const match = (province.wards || []).find(ward => normalizeText(ward.name) === normalized);
  return match ? match.name : "";
}
const handleNguoiBanLookup = async () => {
  if (!formData.value.nguoiBanSearch) {
    errors.nguoiBanSearch = 'Nhập email hoặc số điện thoại'
    return
  }

  errors.nguoiBanSearch = ''

  try {
    const { data } = await api.get(
        '/admin.thg/product/admin/tim-nguoi',
        { params: { search: formData.value.nguoiBanSearch } }
    )

    if (data) {
      formData.value.nguoiBanId = data.id
      formData.value.nguoiBanTen = data.fullName
    } else {
      formData.value.nguoiBanId = null
      formData.value.nguoiBanTen = ''
      errors.nguoiBanSearch = 'Không tìm thấy người bán'
    }
  } catch (e) {
    errors.nguoiBanSearch = 'Lỗi tìm người bán'
  }
}
watch(
    () => formData.value.status,
    (newVal, oldVal) => {
      if (oldVal === 'Đã bán' && newVal !== 'Đã bán') {
        formData.value.nguoiBanId = null
        formData.value.nguoiBanTen = ''
        formData.value.nguoiBanSearch = ''
        formData.value.giaBanThanhCong = null
      }
    }
)


// Computed properties
const isHouse = computed(() => formData.value.loaiTaiSan === "NHA");
const isLand = computed(() => formData.value.loaiTaiSan === "DAT" || formData.value.loaiTaiSan === "DATLON");

const detectAssetTypeFromStructure = computed(() => {
  if (!formData.value.structure) return null;

  const ketCau = formData.value.structure.toLowerCase();
  const houseKeywords = [
    "lầu", "trệt", "tầng", "hầm", "gác",
    "nhà cấp", "cấp 1", "cấp 2", "cấp 3", "cấp 4",
    "biệt thự", "villa", "shophouse", "townhouse", "nhà",
    "chung cư", "căn hộ", "chcc", "studio",
    "condotel", "officetel", "apartment", "can ho",
    "chung cu", "tower", "block"
  ];

  if (houseKeywords.some(keyword => ketCau.includes(keyword))) {
    return "Nhà";
  }

  if (formData.value.totalArea > 1000) {
    return "Đất lớn";
  }

  return "Đất";
});

const fullAddressPreview = computed(() => {
  const parts = [
    formAddress.value.street,
    formAddress.value.ward,
    formAddress.value.province
  ].filter(part => part && part.trim());

  return parts.join(", ") || "Chưa có địa chỉ";
});

// Hàm xử lý
function onAssetTypeChange() {
  // Reset các trường đặc thù khi thay đổi loại
  if (isHouse.value) {
    formData.value.hinhDangThuaDat = "";
    formData.value.hienTrangDat = "";
    formData.value.quyHoach = "";
  } else if (isLand.value) {
    formData.value.structure = "";
    formData.value.floorArea = "";
    formData.value.soTang = "";
    formData.value.soLau = "";
  }
}

const errors = reactive({})
const ownerSearch = ref('')
const ownerLookupMessage = ref('')
const isSubmitting = ref(false)
const isLookupMode = computed(() =>
    ['HOPTAC', 'BN30N'].includes(formData.value.phanLoaiHang)
)

const handleOwnerLookup = async () => {
  ownerLookupMessage.value = ''

  // Không đúng chế độ thì không lookup
  if (!isLookupMode.value) return

  if (!ownerSearch.value) {
    errors.ownerSearch = 'Nhập phone hoặc email để tìm kiếm'
    return
  }

  errors.ownerSearch = ''

  try {
    const { data } = await api.get(
        '/admin.thg/product/admin/tim-chu-tai-san',
        {
          params: {
            search: ownerSearch.value,
            phanLoaiHang: formData.value.phanLoaiHang,
          },
        }
    )

    if (data) {
      formData.value.ownerId = data.id
      formData.value.ownerName = data.fullName
      formData.value.ownerPhone = data.phone

      ownerLookupMessage.value = 'Tìm thấy chủ tài sản thành công'
    } else {
      ownerLookupMessage.value =
          'Không tìm thấy chủ tài sản với thông tin đã nhập'
    }
  } catch (e) {
    console.error(e)
    ownerLookupMessage.value = 'Lỗi khi tìm kiếm chủ tài sản'
  }
}

watch(
    () => formData.value.phanLoaiHang,
    (newVal, oldVal) => {
      ownerLookupMessage.value = ''
      errors.ownerSearch = ''

      const wasLookup = ['HOPTAC', 'BN30N'].includes(oldVal)
      const isLookup = ['HOPTAC', 'BN30N'].includes(newVal)

      // 👉 CHỈ reset khi TỪ lookup → KHÔNG lookup
      if (wasLookup && !isLookup) {
        formData.value.ownerName = ''
        formData.value.ownerPhone = ''
        formData.value.ownerId = null
      }
    }
)


function handleFilesUpdate(updatedFiles) {
  formData.value.files = updatedFiles;

  const existingFiles = updatedFiles.filter(file => !file.file && file.id);
  const newFiles = updatedFiles.filter(file => file.file instanceof File);

  formData.value.newFiles = newFiles
      .filter(f => !f.isIG)
      .map(f => ({ file: f.file }));

  formData.value.newLandBookFiles = newFiles
      .filter(f => f.isIG)
      .map(f => ({ file: f.file }));


  const originalIds = (originalFiles.value || []).map(f => f.id);
  const currentIds = existingFiles.map(f => f.id);

  const deletedFileIds = originalIds.filter(id => {
    const file = (originalFiles.value || []).find(f => f.id === id);
    return !currentIds.includes(id) && file && !file.isIG;
  });

  const deletedLandBookFileIds = originalIds.filter(id => {
    const file = (originalFiles.value || []).find(f => f.id === id);
    return !currentIds.includes(id) && file && file.isIG;
  });

  formData.value.deletedFileIds = deletedFileIds;
  formData.value.deletedLandBookFileIds = deletedLandBookFileIds;
}

function addRoom() {
  formData.value.rooms.push({
    id: -Date.now(),
    loaiPhong: "",
    soLuong: 0,
    dienTich: null,
    moTa: ""
  });

  recalculateRooms();
}

function removeRoom(index) {
  formData.value.rooms.splice(index, 1);
  recalculateRooms();
}

async function saveChanges() {
  try {
    isSaving.value = true;

    // Ghép lại địa chỉ
    const addressParts = [
      formAddress.value.street,
      formAddress.value.ward,
      formAddress.value.province
    ].filter(part => part && part.trim());

    formData.value.address = addressParts.join("/!!");
    formData.value.khuVucMa = formAddress.value.province || "";

    // 🟩 Tạo FormData
    const payload = new FormData();

    const {
      nguoiBanTen,
      nguoiBanSearch,
      ...cleanDto
    } = formData.value
    // 🟩 Gửi DTO JSON
    const dtoToSend = {
      ...cleanDto,
      newFiles: undefined,           // FE gửi file vào @RequestPart
      newLandBookFiles: undefined,   // FE gửi file vào @RequestPart
    };

    payload.append("dto", new Blob([JSON.stringify(dtoToSend)], { type: "application/json" }));

    // 🟦 Gửi file thường
    (formData.value.newFiles || []).forEach(f => {
      payload.append("newFiles", f.file);
    });

    // 🟦 Gửi file sổ đỏ
    (formData.value.newLandBookFiles || []).forEach(f => {
      payload.append("newLandBookFiles", f.file);
    });

    // DEBUG
    console.log("=== FormData gửi BE ===");
    for (let pair of payload.entries()) {
      console.log(pair[0], pair[1]);
    }

    // Gửi API
    const res =  await showLoading(api.post(`/admin.thg/product/admin/cap-nhat/${id}`, payload));

    if (res.status === 200) {
      updateAlertSuccess("Cập nhật dữ liệu thành công", "Hệ thống đã ghi nhận!");
      router.back();
    }

  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    alert("Có lỗi xảy ra khi cập nhật!");
  } finally {
    isSaving.value = false;
  }
}



function resetForm() {
  if (confirm("Bạn có chắc muốn đặt lại tất cả thay đổi?")) {
    initializeFormData();
    parseAddress();
  }
}

// Format functions
function formatAddress(address) {
  if (!address) return "";
  return address.replace(/\/!!/g, ", ");
}

function formatUpdatedAt(value) {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);

  if (isNaN(date.getTime())) return "Chưa cập nhật";

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoneyVN(value) {
  if (value == null || isNaN(value)) return "0";
  const num = Number(value);

  if (num < 1_000_000) {
    return num.toLocaleString("vi-VN");
  }

  if (num < 1_000_000_000) {
    const trieu = num / 1_000_000;
    return `${trieu.toFixed(trieu % 1 === 0 ? 0 : 1)} triệu`;
  }

  const ty = num / 1_000_000_000;
  return `${ty.toFixed(ty % 1 === 0 ? 0 : 2)} tỷ`;
}

function formatArea(value) {
  if (value === null || value === undefined || isNaN(value)) return "";
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }) + " m²";
}

function badgeClass(code) {
  const map = {
    BN30N: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
    HTT: "bg-gradient-to-r from-yellow-500 to-amber-600 text-white",
    HOPTAC: "bg-gradient-to-r from-orange-500 to-red-600 text-white"
  };
  return map[code] || "bg-gradient-to-r from-slate-500 to-gray-600 text-white";
}

function recalculateRooms() {
  let total = 0;
  let bedrooms = 0;
  let bathrooms = 0;

  (formData.value.rooms || []).forEach(room => {
    const qty = Number(room.soLuong || 0);
    if (qty <= 0) return;

    total += qty;

    const name = normalizeText(room.loaiPhong || "").trim();

    // ---- PHÒNG NGỦ ----
    if (
        name.includes("phong ngu") ||
        name.includes("ngu")
    ) {
      bedrooms += qty;
    }

    // ---- PHÒNG TẮM + WC ----
    if (
        name.includes("wc") ||
        name.includes("toilet") ||
        name.includes("ve sinh") ||
        name.includes("vesinh") ||
        name.includes("phong tam") ||
        name.startsWith("tam ") ||
        name.endsWith(" tam") ||
        name.includes(" tam ")
    ) {
      bathrooms += qty;
    }
  });

  formData.value.tongSoPhong = total;
  formData.value.soPhongNgu = bedrooms;
  formData.value.soPhongTam = bathrooms;

}


watch(
    () => formData.value.rooms,
    () => recalculateRooms(),
    { deep: true }
);

const roomTypeOptions = [
  "Phòng ngủ",
  "Nhà vệ sinh",
  "Phòng khách",
  "Phòng bếp",
  "Phòng ăn",
  "Phòng làm việc",
  "Phòng đọc sách",
  "Phòng thờ",
  "Kho",
  "Sân thượng"
];


</script>

<style scoped>
/* Custom styles */
input:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover effects */
button:hover {
  transform: translateY(-2px);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr !important;
  }

  .md\:col-span-2, .md\:col-span-3 {
    grid-column: span 1 !important;
  }
}

/* THÊM CÁC STYLE MỚI ĐỂ LOẠI BỎ KHOẢNG TRẮNG */
.min-h-screen {
  min-height: 100vh;
  padding-left: 10px !important;
  padding-right: 10px !important;
}

/* Đảm bảo các container chính chiếm toàn bộ chiều rộng */
.mx-auto {
  margin-left: 0;
  margin-right: 0;
  width: 100%;
}

/* Điều chỉnh padding cho các sections */
.bg-white.rounded-2xl {
  margin-left: 12px;
  margin-right: 12px;
}

/* Trên mobile, giảm khoảng cách */
@media (max-width: 640px) {
  .bg-white.rounded-2xl {
    margin-left: 8px;
    margin-right: 8px;
    padding: 16px;
  }

  .mx-3 {
    margin-left: 8px;
    margin-right: 8px;
  }
}

/* Trên desktop lớn, thêm khoảng cách vừa phải */
@media (min-width: 1536px) {
  .bg-white.rounded-2xl {
    margin-left: auto;
    margin-right: auto;
    max-width: 1500px;
  }

  .mx-3 {
    margin-left: auto;
    margin-right: auto;
    max-width: 1500px;
  }
}

/* Đảm bảo form chiếm toàn bộ không gian */
form.space-y-6 {
  width: 100%;
}

/* Điều chỉnh grid để tận dụng không gian */
.grid {
  gap: 1rem;
}

/* Tăng kích thước font trên màn hình lớn */
@media (min-width: 1024px) {
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  input, select {
    font-size: 0.875rem;
  }
}

/* Hiệu ứng shadow tinh tế hơn */
.shadow-xl {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
}

.border-slate-300 {
  border-color: #e2e8f0;
}

/* Gradient background chiếm toàn màn hình */
.bg-gradient-to-br {
  background-attachment: fixed;
}

/* Đảm bảo các input không bị thu nhỏ */
input, select {
  min-height: 44px;
}

/* Tối ưu cho các thẻ badge */
.px-3.py-1 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

/* Điều chỉnh khoảng cách giữa các phần tử */
.space-y-6 > * + * {
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .space-y-6 > * + * {
    margin-top: 1.5rem;
  }
}
</style>