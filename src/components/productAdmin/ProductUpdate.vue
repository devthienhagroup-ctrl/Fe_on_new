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
              <div class="text-2xl font-bold mt-2">{{ formData.phiMoiGioi ? formData.phiMoiGioi + '%' : asset.phiMoiGioi + '%' }}</div>
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
                  <span>Loại tài sản *</span>
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

            <!-- Phân loại hàng -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                    <i class="fa-solid fa-box text-white text-xs"></i>
                  </div>
                  <span>Phân loại hàng *</span>
                </span>
              </label>
              <select
                  v-model="formData.phanLoaiHang"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
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
                  <span>Đơn vị sở hữu *</span>
                </span>
              </label>
              <select
                  v-model="formData.donViSoHuu"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  required
              >
                <option value="">-- Chọn đơn vị --</option>
                <option value="THG">THG</option>
                <option value="DT">Đối tác</option>
              </select>
            </div>

            <!-- Giá bán -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <i class="fa-solid fa-money-bill-wave text-white text-xs"></i>
                  </div>
                  <span>Giá bán *</span>
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

            <!-- Giá nội bộ -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <i class="fa-solid fa-hand-holding-usd text-white text-xs"></i>
                  </div>
                  <span>Giá nội bộ *</span>
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

            <!-- Phí môi giới -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                    <i class="fa-solid fa-percent text-white text-xs"></i>
                  </div>
                  <span>Phí môi giới (%) *</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.phiMoiGioi"
                    step="0.1"
                    min="0"
                    max="100"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập % phí môi giới"
                    required
                />
                <i class="fa-solid fa-percent absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
              <div class="text-sm font-medium text-rose-700 bg-rose-50 p-2 rounded-lg">
                {{ formData.phiMoiGioi }}%
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 2: ĐỊA CHỈ & KHU VỰC -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-300 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div class="bg-gradient-to-r from-emerald-500 to-green-600 p-2.5 rounded-xl">
              <i class="fa-solid fa-location-dot text-white text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-900">Địa chỉ & Khu vực</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Tỉnh/Thành phố -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <i class="fa-solid fa-city text-white text-xs"></i>
                  </div>
                  <span>Tỉnh/Thành phố *</span>
                </span>
              </label>
              <select
                  v-model="selectedProvince"
                  @change="onProvinceChange"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  required
              >
                <option value="">-- Chọn tỉnh/thành phố --</option>
                <option v-for="province in provinces" :key="province.name" :value="province.name">
                  {{ formatProvinceName(province.name) }}
                </option>
              </select>
            </div>

            <!-- Phường/Xã -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                    <i class="fa-solid fa-map-marker-alt text-white text-xs"></i>
                  </div>
                  <span>Phường/Xã *</span>
                </span>
              </label>
              <select
                  v-model="formAddress.ward"
                  :disabled="!selectedProvince"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  required
              >
                <option value="">-- Chọn phường/xã --</option>
                <option v-for="ward in wards" :key="ward.name" :value="ward.name">
                  {{ formatWardName(ward.name) }}
                </option>
              </select>
              <div v-if="!selectedProvince" class="text-xs text-slate-500 italic">
                Vui lòng chọn tỉnh/thành phố trước
              </div>
            </div>

            <!-- Địa chỉ đường -->
            <div class="space-y-2 md:col-span-2 lg:col-span-1">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                    <i class="fa-solid fa-road text-white text-xs"></i>
                  </div>
                  <span>Địa chỉ đường *</span>
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

            <!-- Khu vực mã -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <i class="fa-solid fa-map-pin text-white text-xs"></i>
                  </div>
                  <span>Khu vực</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.khuVucMa"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: TP. Thủ Đức"
              />
            </div>

            <!-- Vị trí -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                    <i class="fa-solid fa-location-arrow text-white text-xs"></i>
                  </div>
                  <span>Vị trí *</span>
                </span>
              </label>
              <select
                  v-model="formData.landPosition"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  required
              >
                <option value="">-- Chọn vị trí --</option>
                <option value="Mặt tiền">Mặt tiền</option>
                <option value="Hẻm">Hẻm</option>
                <option value="Hẻm cụt">Hẻm cụt</option>
                <option value="Khu dân cư">Khu dân cư</option>
                <option value="Mặt tiền đường lớn">Mặt tiền đường lớn</option>
                <option value="Chưa cập nhật">Chưa cập nhật</option>
              </select>
            </div>

            <!-- Địa chỉ cũ -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-slate-500 to-gray-500 flex items-center justify-center">
                    <i class="fa-solid fa-history text-white text-xs"></i>
                  </div>
                  <span>Địa chỉ cũ</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.oldAddress"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Nhập địa chỉ cũ"
              />
            </div>

            <!-- Preview địa chỉ -->
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
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div class="bg-gradient-to-r from-purple-500 to-violet-600 p-2.5 rounded-xl">
              <i class="fa-solid fa-user-tie text-white text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-900">Chủ sở hữu & Pháp lý</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Chủ sở hữu -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <i class="fa-solid fa-user text-white text-xs"></i>
                  </div>
                  <span>Tên chủ sở hữu *</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="text"
                    v-model="formData.ownerName"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập tên chủ sở hữu"
                    required
                />
                <i class="fa-solid fa-user-tag absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- Số điện thoại -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                    <i class="fa-solid fa-phone text-white text-xs"></i>
                  </div>
                  <span>Số điện thoại *</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="tel"
                    v-model="formData.ownerPhone"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập số điện thoại"
                    required
                />
                <i class="fa-solid fa-mobile-screen absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- Loại đất -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <i class="fa-solid fa-mountain text-white text-xs"></i>
                  </div>
                  <span>Loại đất *</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.loaiDat"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Thuộc nhóm đất ở"
                  required
              />
            </div>

            <!-- Số tờ bản đồ -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                    <i class="fa-solid fa-map text-white text-xs"></i>
                  </div>
                  <span>Số tờ bản đồ</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.plotNumber"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: 6 tờ"
              />
            </div>

            <!-- Số thửa đất -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                    <i class="fa-solid fa-vector-square text-white text-xs"></i>
                  </div>
                  <span>Số thửa đất</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.parcelNumber"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: 10 B/1 A"
              />
            </div>

            <!-- Diện tích tổng -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <i class="fa-solid fa-ruler-combined text-white text-xs"></i>
                  </div>
                  <span>Diện tích tổng (m²) *</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.totalArea"
                    step="0.01"
                    min="0"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập diện tích"
                    required
                />
                <i class="fa-solid fa-square absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
              <div class="text-sm font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                {{ formatArea(formData.totalArea) }}
              </div>
            </div>

            <!-- Quan hệ sở hữu -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <i class="fa-solid fa-handshake text-white text-xs"></i>
                  </div>
                  <span>Quan hệ sở hữu *</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.ownershipRelation"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Chủ"
                  required
              />
            </div>

            <!-- Quyền sử dụng đất -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                    <i class="fa-solid fa-scale-balanced text-white text-xs"></i>
                  </div>
                  <span>Quyền sử dụng đất *</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.landUseRight"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Sở hữu lâu dài"
                  required
              />
            </div>

            <!-- Trạng thái -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <i class="fa-solid fa-circle-check text-white text-xs"></i>
                  </div>
                  <span>Trạng thái *</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.status"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Đã định giá sơ bộ"
                  required
              />
            </div>

            <!-- Giá mong muốn -->
            <div class="space-y-2 md:col-span-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                    <i class="fa-solid fa-bullseye text-white text-xs"></i>
                  </div>
                  <span>Giá mong muốn (VND) *</span>
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
            <!-- Kết cấu -->
            <div class="space-y-2 md:col-span-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <i class="fa-solid fa-layer-group text-white text-xs"></i>
                  </div>
                  <span>Kết cấu *</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.structure"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: 1 trệt 5 lầu, 1 hầm"
                  required
              />
            </div>

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
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập diện tích sàn"
                />
                <i class="fa-solid fa-ruler absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
              <div v-if="formData.floorArea" class="text-sm font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg">
                {{ formatArea(formData.floorArea) }}
              </div>
            </div>

            <!-- Chiều ngang -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                    <i class="fa-solid fa-arrows-left-right text-white text-xs"></i>
                  </div>
                  <span>Chiều ngang (m)</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.chieuNgang"
                    step="0.1"
                    min="0"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập chiều ngang"
                />
                <i class="fa-solid fa-ruler-horizontal absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- Chiều dài -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <i class="fa-solid fa-arrows-up-down text-white text-xs"></i>
                  </div>
                  <span>Chiều dài (m)</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.chieuDai"
                    step="0.1"
                    min="0"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập chiều dài"
                />
                <i class="fa-solid fa-ruler-vertical absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- Mặt tiền nhà -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center">
                    <i class="fa-solid fa-road text-white text-xs"></i>
                  </div>
                  <span>Mặt tiền nhà (m)</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.matTienNha"
                    step="0.1"
                    min="0"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập mặt tiền"
                />
                <i class="fa-solid fa-road absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

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
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
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
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập số lầu"
                />
                <i class="fa-solid fa-stairs absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

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
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
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
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập số phòng tắm"
                />
                <i class="fa-solid fa-shower absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
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
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập tổng số phòng"
                />
                <i class="fa-solid fa-door-closed absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
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
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Ví dụ: 2020"
                />
                <i class="fa-solid fa-calendar-days absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

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
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Cơ bản"
              />
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
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Nhà phố"
              />
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
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Sạch sẽ"
              />
            </div>
          </div>
        </div>

        <!-- SECTION 4B: THÔNG TIN ĐẤT (chỉ hiện khi loại tài sản là DAT hoặc DATLON) -->
        <div v-if="isLand" class="bg-white rounded-2xl shadow-xl border border-slate-300 p-6">
          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-2.5 rounded-xl">
              <i class="fa-solid fa-mountain-sun text-white text-lg"></i>
            </div>
            <h2 class="text-xl font-bold text-slate-900">Thông tin đất</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.chieuNgang"
                    step="0.1"
                    min="0"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập chiều ngang"
                />
                <i class="fa-solid fa-ruler-horizontal absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
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
              <div class="relative">
                <input
                    type="number"
                    v-model.number="formData.chieuDai"
                    step="0.1"
                    min="0"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Nhập chiều dài"
                />
                <i class="fa-solid fa-ruler-vertical absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- Hình dạng thửa đất -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 flex items-center justify-center">
                    <i class="fa-solid fa-shapes text-white text-xs"></i>
                  </div>
                  <span>Hình dạng thửa đất</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.hinhDangThuaDat"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Hình chữ nhật"
              />
            </div>

            <!-- Hiện trạng đất -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <i class="fa-solid fa-eye text-white text-xs"></i>
                  </div>
                  <span>Hiện trạng đất</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.hienTrangDat"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Đất trống"
              />
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
              <div class="relative">
                <input
                    type="text"
                    v-model="formData.loGioi"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Ví dụ: 10"
                />
                <i class="fa-solid fa-road absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- Độ rộng đường -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <i class="fa-solid fa-road text-white text-xs"></i>
                  </div>
                  <span>Độ rộng đường (m)</span>
                </span>
              </label>
              <div class="relative">
                <input
                    type="text"
                    v-model="formData.doRongDuong"
                    class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                    placeholder="Ví dụ: 6"
                />
                <i class="fa-solid fa-ruler-combined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></i>
              </div>
            </div>

            <!-- Quy hoạch -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-800">
                <span class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <i class="fa-solid fa-map text-white text-xs"></i>
                  </div>
                  <span>Quy hoạch</span>
                </span>
              </label>
              <input
                  type="text"
                  v-model="formData.quyHoach"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all text-sm hover:border-slate-400"
                  placeholder="Ví dụ: Đất ở đô thị"
              />
            </div>
          </div>
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "/src/api/api.js";
import addressData from "/src/assets/js/address.json";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const asset = ref(null);
const formData = ref({});
const formAddress = ref({
  street: "",
  ward: "",
  area: ""
});
const selectedProvince = ref(null);
const wards = ref([]);
const provinces = ref([]);
const isSaving = ref(false);

// Load dữ liệu ban đầu
onMounted(async () => {
  await loadAssetDetail();
  loadProvinces();
});

function loadProvinces() {
  provinces.value = addressData;
}

function onProvinceChange() {
  const found = provinces.value.find(p => p.name === selectedProvince.value);
  wards.value = found ? found.wards : [];
  formAddress.value.ward = "";
}


async function loadAssetDetail() {
  try {
    const res = await api.get(`/admin.thg/product/admin/chi-tiet/${id}`);
    asset.value = res.data;
    initializeFormData();
    parseAddress();
    matchAddressWithData();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu tài sản:", error);
  }
}

function matchAddressWithData() {
  if (!formAddress.value.area) return;

  const provinceName = formAddress.value.area.trim();

  // 🔍 tìm đúng tỉnh
  const foundProvince = provinces.value.find(
      p => p.name.trim() === provinceName
  );

  if (!foundProvince) {
    console.warn("Không tìm thấy tỉnh:", provinceName);
    return;
  }

  // set STRING
  selectedProvince.value = foundProvince.name;

  // load wards
  wards.value = foundProvince.wards;

  // match ward
  const foundWard = foundProvince.wards.find(
      w => w.name.trim() === formAddress.value.ward.trim()
  );

  if (foundWard) {
    formAddress.value.ward = foundWard.name;
  }
}

function initializeFormData() {
  formData.value = JSON.parse(JSON.stringify(asset.value));
  formData.value.loaiTaiSan = formData.value.loaiTaiSan || detectAssetTypeFromStructure.value || "";
  formData.value.rooms = formData.value.rooms || [];
}

function parseAddress() {
  if (!formData.value.address) return;

  const parts = formData.value.address.split("/!!").map(p => p.trim());
  formAddress.value = {
    street: parts[0] || "",
    ward: parts[1] || "",
    area: parts[2] || ""
  };
}

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
    formData.value.khuVucMa || formAddress.value.area
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

async function saveChanges() {
  try {
    isSaving.value = true;

    // Ghép lại địa chỉ
    const addressParts = [
      formAddress.value.street,
      formAddress.value.ward,
      formData.value.khuVucMa || formAddress.value.area
    ].filter(part => part && part.trim());

    formData.value.address = addressParts.join("/!!");

    // Chuẩn bị payload
    const payload = {
      ...formData.value,
      slide: undefined,
      files: undefined,
      valuations: undefined,
      createAt: undefined,
      updateAt: undefined
    };

    const res = await api.put(`/admin.thg/product/admin/cap-nhat/${id}`, payload);

    if (res.status === 200) {
      alert("Cập nhật thành công!");
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
    matchAddressWithData();
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

function formatProvinceName(name) {
  if (!name) return "";
  return name.replace(/^Thành phố\s+/i, "TP. ").replace(/^Tỉnh\s+/i, "T. ");
}

function formatWardName(name) {
  if (!name) return "";
  return name
      .replace(/^Phường\s+/i, "P. ")
      .replace(/^Xã\s+/i, "X. ")
      .replace(/^Thị trấn\s+/i, "TT. ");
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