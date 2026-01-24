<!-- CooperationForm.vue -->
<template>
  <div
      :class="[
      'rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden transition-all duration-700',
      purpleTemplate
        ? 'bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800'
        : 'bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800'
    ]"
      data-aos="zoom-in"
      data-aos-duration="1000"
  >
    <!-- Animated Background with Gradient Layers -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Animated Gradient Layer -->
      <div
          class="absolute inset-0 opacity-30"
          :style="{
          backgroundImage: purpleTemplate
            ? 'radial-gradient(circle at 20% 80%, rgba(216, 180, 254, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.3) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 80%, rgba(147, 197, 253, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.3) 0%, transparent 50%)'
        }"
      ></div>

      <!-- Large Moving Circles -->
      <div
          :class="[
          'absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full circle-large-1',
          purpleTemplate ? 'bg-gradient-to-br from-pink-300/30 to-purple-400/20' : 'bg-gradient-to-br from-blue-300/30 to-blue-400/20'
        ]"
          :style="{ animationDelay: '0s' }"
      ></div>
      <div
          :class="[
          'absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full circle-large-2',
          purpleTemplate ? 'bg-gradient-to-br from-pink-400/30 to-purple-500/20' : 'bg-gradient-to-br from-blue-400/30 to-blue-500/20'
        ]"
          :style="{ animationDelay: '2s' }"
      ></div>

      <!-- Medium Moving Circles -->
      <div
          v-for="i in 4"
          :key="`medium-${i}`"
          :class="[
          'absolute rounded-full circle-medium',
          purpleTemplate ? 'bg-gradient-to-br from-pink-200/20 to-purple-300/10' : 'bg-gradient-to-br from-blue-200/20 to-blue-300/10'
        ]"
          :style="{
          width: `${Math.random() * 120 + 40}px`,
          height: `${Math.random() * 120 + 40}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${i * 1.5}s`
        }"
      ></div>

      <!-- Small Floating Dots -->
      <div v-for="i in 15"
           :key="`dot-${i}`"
           :class="[
          'absolute rounded-full circle-dot',
          purpleTemplate ? 'bg-pink-200/10' : 'bg-blue-200/10'
        ]"
           :style="{
          width: `${Math.random() * 15 + 5}px`,
          height: `${Math.random() * 15 + 5}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.8}s`,
          animationDuration: `${Math.random() * 15 + 10}s`
        }"
      ></div>

      <!-- Animated Grid Pattern -->
      <div
          class="absolute inset-0 opacity-10"
          :style="{
          backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'moveGrid 20s linear infinite'
        }"
          :class="purpleTemplate ? 'text-pink-200' : 'text-blue-200'"
      ></div>
    </div>

    <!-- Content -->
    <h2 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6 relative z-10 animate-fade-in-down pt-5">
      {{ title }}
    </h2>
    <p class="mb-10 max-w-4xl mx-auto text-lg relative z-10 animate-fade-in-up p-3"
       :style="{ animationDelay: '0.2s' }"
       :class="purpleTemplate ? 'text-purple-100' : 'text-blue-100'">
      {{ description }}
    </p>

    <form @submit.prevent="handleSubmit" class="max-w-4xl mx-auto relative z-10 p-3">
      <!-- Thông tin cơ bản -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="animate-fade-in-left" :style="{ animationDelay: '0.3s' }">
          <label class="block text-white text-sm font-medium mb-2 ml-6 text-left">
            Họ và tên <span class="text-red-400">*</span>
          </label>
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
            <input
                type="text"
                v-model="formData.fullName"
                placeholder="Nhập họ và tên"
                class="w-full px-5 py-3 rounded-full text-slate-900 focus:outline-none focus:ring-4 relative transition-all duration-300 transform hover:scale-[1.02]"
                :class="[
                errors.fullName ? 'border-2 border-red-500 shadow-lg shadow-red-500/30' : '',
                purpleTemplate ? 'focus:ring-pink-300 focus:shadow-pink-500/30' : 'focus:ring-blue-300 focus:shadow-blue-500/30'
              ]"
            />
          </div>
          <p v-if="errors.fullName" class="text-red-400 text-sm mt-2 ml-6 text-left animate-shake">
            {{ errors.fullName }}
          </p>
        </div>

        <div class="animate-fade-in-right" :style="{ animationDelay: '0.4s' }">
          <label class="block text-white text-sm font-medium mb-2 ml-6 text-left">
            Số điện thoại <span class="text-red-400">*</span>
          </label>
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
            <input
                type="tel"
                v-model="formData.phone"
                placeholder="Nhập số điện thoại"
                class="w-full px-5 py-3 rounded-full text-slate-900 focus:outline-none focus:ring-4 relative transition-all duration-300 transform hover:scale-[1.02]"
                :class="[
                errors.phone ? 'border-2 border-red-500 shadow-lg shadow-red-500/30' : '',
                purpleTemplate ? 'focus:ring-pink-300 focus:shadow-pink-500/30' : 'focus:ring-blue-300 focus:shadow-blue-500/30'
              ]"
            />
          </div>
          <p v-if="errors.phone" class="text-red-400 text-sm mt-2 ml-6 text-left animate-shake">
            {{ errors.phone }}
          </p>
        </div>
      </div>

      <!-- Email -->
      <div class="mb-6 animate-fade-in-up" :style="{ animationDelay: '0.5s' }">
        <label class="block text-white text-sm font-medium mb-2 ml-6 text-left">
          {{ placeholder.replace(' *', '') }} <span class="text-red-400">*</span>
        </label>
        <div class="relative group">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
          <input
              type="email"
              v-model="formData.email"
              :placeholder="placeholder"
              class="w-full px-5 py-3 rounded-full text-slate-900 focus:outline-none focus:ring-4 relative transition-all duration-300 transform hover:scale-[1.02]"
              :class="[
              errors.email ? 'border-2 border-red-500 shadow-lg shadow-red-500/30' : '',
              purpleTemplate ? 'focus:ring-pink-300 focus:shadow-pink-500/30' : 'focus:ring-blue-300 focus:shadow-blue-500/30'
            ]"
          />
        </div>
        <p v-if="errors.email" class="text-red-400 text-sm mt-2 ml-6 text-left animate-shake">
          {{ errors.email }}
        </p>
      </div>

      <!-- Địa chỉ -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- Tỉnh/Thành phố -->
        <div class="z-50 relative animate-fade-in-left" :style="{ animationDelay: '0.6s' }">
          <label class="block text-white text-sm font-medium mb-2 ml-6 text-left">
            Tỉnh/Thành phố <span class="text-red-400">*</span>
          </label>
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
            <input
                type="text"
                v-model="provinceSearch"
                @focus="showProvinceDropdown = true"
                @blur="hideProvinceDropdown"
                @input="filterProvinces"
                placeholder="Chọn tỉnh/thành phố"
                class="w-full px-5 py-3 rounded-full text-slate-900 focus:outline-none focus:ring-4 relative transition-all duration-300 transform hover:scale-[1.02]"
                :class="[
                errors.province ? 'border-2 border-red-500 shadow-lg shadow-red-500/30' : '',
                purpleTemplate ? 'focus:ring-pink-300 focus:shadow-pink-500/30' : 'focus:ring-blue-300 focus:shadow-blue-500/30'
              ]"
            />
            <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <div
              v-if="showProvinceDropdown && filteredProvinces.length > 0"
              class="absolute w-full mt-1 bg-white rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-dropdown"
          >
            <div
                v-for="province in filteredProvinces"
                :key="province.code"
                @mousedown="selectProvince(province)"
                class="px-6 py-3 hover:bg-gray-100 cursor-pointer text-slate-900 transition-colors duration-200"
                :class="purpleTemplate ? 'hover:text-purple-600' : 'hover:text-blue-600'"
            >
              {{ province.name }}
            </div>
          </div>
          <p v-if="errors.province" class="text-red-400 text-sm mt-2 ml-6 text-left animate-shake">
            {{ errors.province }}
          </p>
        </div>

        <!-- Phường/Xã -->
        <div class="z-50 relative animate-fade-in-up" :style="{ animationDelay: '0.7s' }">
          <label class="block text-white text-sm font-medium mb-2 ml-6 text-left">
            Phường/Xã <span class="text-red-400">*</span>
          </label>
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
            <input
                type="text"
                v-model="wardSearch"
                :disabled="!formData.province"
                @focus="showWardDropdown = true"
                @blur="hideWardDropdown"
                @input="filterWards"
                placeholder="Chọn phường/xã"
                class="w-full px-5 py-3 rounded-full text-slate-900 focus:outline-none focus:ring-4 relative transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                :class="[
                errors.ward ? 'border-2 border-red-500 shadow-lg shadow-red-500/30' : '',
                purpleTemplate ? 'focus:ring-pink-300 focus:shadow-pink-500/30' : 'focus:ring-blue-300 focus:shadow-blue-500/30'
              ]"
            />
            <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <div
              v-if="showWardDropdown && filteredWards.length > 0"
              class="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-dropdown"
          >
            <div
                v-for="ward in filteredWards"
                :key="ward.code"
                @mousedown="selectWard(ward)"
                class="px-6 py-3 hover:bg-gray-100 cursor-pointer text-slate-900 transition-colors duration-200"
                :class="purpleTemplate ? 'hover:text-purple-600' : 'hover:text-blue-600'"
            >
              {{ ward.name }}
            </div>
          </div>
          <p v-if="errors.ward" class="text-red-400 text-sm mt-2 ml-6 text-left animate-shake">
            {{ errors.ward }}
          </p>
        </div>

        <!-- Địa chỉ chi tiết -->
        <div class="animate-fade-in-right" :style="{ animationDelay: '0.8s' }">
          <label class="block text-white text-sm font-medium mb-2 ml-6 text-left">
            Địa chỉ chi tiết <span class="text-red-400">*</span>
          </label>
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
            <input
                type="text"
                v-model="formData.detailAddress"
                placeholder="Nhập địa chỉ chi tiết"
                class="w-full px-5 py-3 rounded-full text-slate-900 focus:outline-none focus:ring-4 relative transition-all duration-300 transform hover:scale-[1.02]"
                :class="[
                errors.detailAddress ? 'border-2 border-red-500 shadow-lg shadow-red-500/30' : '',
                purpleTemplate ? 'focus:ring-pink-300 focus:shadow-pink-500/30' : 'focus:ring-blue-300 focus:shadow-blue-500/30'
              ]"
            />
          </div>
          <p v-if="errors.detailAddress" class="text-red-400 text-sm mt-2 ml-6 text-left animate-shake">
            {{ errors.detailAddress }}
          </p>
        </div>
      </div>

      <!-- Lĩnh vực cần tư vấn -->
      <div class="mb-6 animate-fade-in-up" :style="{ animationDelay: '0.9s' }">
        <label class="block text-white text-sm font-medium mb-2 ml-6 text-left">
          Lĩnh vực cần tư vấn <span class="text-red-400">*</span>
        </label>
        <div class="relative group">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
          <select
              v-model="formData.consultingField"
              class="w-full px-5 py-3 rounded-full text-slate-900 focus:outline-none focus:ring-4 appearance-none relative transition-all duration-300 transform hover:scale-[1.02]"
              :class="[
              errors.consultingField ? 'border-2 border-red-500 shadow-lg shadow-red-500/30' : '',
              purpleTemplate ? 'focus:ring-pink-300 focus:shadow-pink-500/30' : 'focus:ring-blue-300 focus:shadow-blue-500/30'
            ]"
          >
            <option value="" disabled>Chọn lĩnh vực cần tư vấn</option>
            <option value="team-management">Quản lý nhóm</option>
            <option value="estimate-property">Định giá BĐS</option>
            <option value="project-manager">Quản lý dự án</option>
            <option value="quick-sale">Bán nhanh BĐS</option>
            <option value="property-management">Quản lý tài sản</option>
            <option value="ctv-recruitment">Ứng tuyển cộng tác viên</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <p v-if="errors.consultingField" class="text-red-400 text-sm mt-2 ml-6 text-left animate-shake">
          {{ errors.consultingField }}
        </p>
      </div>

      <!-- Vấn đề chi tiết -->
      <div class="mb-8 animate-fade-in-up" :style="{ animationDelay: '1s' }">
        <label class="block text-white text-sm font-medium mb-2 ml-6 text-left">
          Mô tả chi tiết vấn đề <span class="text-red-400">*</span>
        </label>
        <div class="relative group">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
          <textarea
              v-model="formData.description"
              placeholder="Mô tả chi tiết vấn đề của bạn..."
              rows="4"
              class="w-full px-5 py-3 rounded-3xl text-slate-900 focus:outline-none focus:ring-4 resize-none relative transition-all duration-300 transform hover:scale-[1.01]"
              :class="[
              errors.description ? 'border-2 border-red-500 shadow-lg shadow-red-500/30' : '',
              purpleTemplate ? 'focus:ring-pink-300 focus:shadow-pink-500/30' : 'focus:ring-blue-300 focus:shadow-blue-500/30'
            ]"
          ></textarea>
        </div>
        <div class="flex justify-between items-center mt-2">
          <p v-if="errors.description" class="text-red-400 text-sm ml-6 text-left animate-shake">
            {{ errors.description }}
          </p>
          <p class="text-sm text-white/70 mr-6">
            {{ formData.description.length }}/500 ký tự
          </p>
        </div>
      </div>

      <!-- Nút gửi -->
      <button
          type="submit"
          class="text-white px-10 py-4 rounded-full font-bold transition-all duration-500 shadow-2xl hover:shadow-3xl whitespace-nowrap text-lg relative overflow-hidden group animate-fade-in-up"
          :class="[
          purpleTemplate
            ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
            : 'bg-slate-900  hover:from-slate-800 hover:to-blue-700',
          'transform hover:scale-105 active:scale-95'
        ]"
          :style="{ animationDelay: '1.1s' }"
      >
        <span class="relative z-10">{{ buttonText }}</span>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </button>
    </form>

    <!-- Thông báo cảm ơn -->
    <p class="mt-8 text-white/80 text-sm relative z-10 animate-fade-in-up" :style="{ animationDelay: '1.2s' }">
      Cảm ơn bạn đã tin tưởng liên hệ, chúng tôi sẽ phản hồi trong thời gian sớm nhất!
    </p>
  </div>
</template>

<!-- CooperationForm.vue - Phần script cập nhật -->
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from "../../../api/api.js";
import Swal from 'sweetalert2'

const props = defineProps({
  title: {
    type: String,
    default: 'Sẵn sàng hợp tác cùng Thiên Hà Group?'
  },
  description: {
    type: String,
    default: 'Hãy để lại thông tin, đội ngũ chuyên gia của chúng tôi sẽ liên hệ tư vấn giải pháp tốt nhất cho bạn.'
  },
  placeholder: {
    type: String,
    default: 'Email'
  },
  buttonText: {
    type: String,
    default: 'Gửi thông tin'
  },
  purpleTemplate: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

// Dữ liệu form
const formData = reactive({
  fullName: '',
  phone: '',
  email: '',
  province: null,
  ward: null,
  detailAddress: '',
  consultingField: '',
  description: ''
})

// Lỗi validation
const errors = reactive({
  fullName: '',
  phone: '',
  email: '',
  province: '',
  ward: '',
  detailAddress: '',
  consultingField: '',
  description: ''
})

// Dữ liệu địa chỉ
const provinces = ref([])
const filteredProvinces = ref([])
const filteredWards = ref([])

// Tìm kiếm
const provinceSearch = ref('')
const wardSearch = ref('')

// Dropdown states
const showProvinceDropdown = ref(false)
const showWardDropdown = ref(false)

// Trạng thái loading
const isLoading = ref(false)

// Tải dữ liệu tỉnh/thành phố
onMounted(async () => {
  try {
    const response = await fetch('/src/assets/js/address.json')
    provinces.value = await response.json()
    filteredProvinces.value = provinces.value
  } catch (error) {
    console.error('Không thể tải dữ liệu địa chỉ:', error)
  }
})

// Lọc tỉnh/thành phố
const filterProvinces = () => {
  if (!provinceSearch.value) {
    filteredProvinces.value = provinces.value
  } else {
    filteredProvinces.value = provinces.value.filter(province =>
        province.name.toLowerCase().includes(provinceSearch.value.toLowerCase())
    )
  }
}

// Lọc phường/xã
const filterWards = () => {
  if (!formData.province) return

  if (!wardSearch.value) {
    filteredWards.value = formData.province.wards
  } else {
    filteredWards.value = formData.province.wards.filter(ward =>
        ward.name.toLowerCase().includes(wardSearch.value.toLowerCase())
    )
  }
}

// Chọn tỉnh/thành phố
const selectProvince = (province) => {
  formData.province = province
  provinceSearch.value = province.name
  showProvinceDropdown.value = false

  // Reset ward khi chọn tỉnh mới
  formData.ward = null
  wardSearch.value = ''
  filteredWards.value = province.wards
}

// Chọn phường/xã
const selectWard = (ward) => {
  formData.ward = ward
  wardSearch.value = ward.name
  showWardDropdown.value = false
}

// Ẩn dropdown tỉnh
const hideProvinceDropdown = () => {
  setTimeout(() => {
    showProvinceDropdown.value = false
  }, 200)
}

// Ẩn dropdown phường
const hideWardDropdown = () => {
  setTimeout(() => {
    showWardDropdown.value = false
  }, 200)
}

// Validation
const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  // Họ tên
  if (!formData.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ tên'
    isValid = false
  }

  // SĐT
  const phoneRegex = /^(0|\+84)(3[2-9]|5[2689]|7[06789]|8[1-9]|9[0-9])[0-9]{7}$/
  if (!formData.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại'
    isValid = false
  } else if (!phoneRegex.test(formData.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ'
    isValid = false
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email.trim()) {
    errors.email = 'Vui lòng nhập email'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Email không hợp lệ'
    isValid = false
  }

  // Tỉnh
  if (!formData.province) {
    errors.province = 'Vui lòng chọn tỉnh/thành phố'
    isValid = false
  }

  // Phường
  if (!formData.ward) {
    errors.ward = 'Vui lòng chọn phường/xã'
    isValid = false
  }

  // Địa chỉ chi tiết
  if (!formData.detailAddress.trim()) {
    errors.detailAddress = 'Vui lòng nhập địa chỉ chi tiết'
    isValid = false
  }

  // Lĩnh vực tư vấn
  if (!formData.consultingField) {
    errors.consultingField = 'Vui lòng chọn lĩnh vực cần tư vấn'
    isValid = false
  }

  // Vấn đề chi tiết
  if (!formData.description.trim()) {
    errors.description = 'Vui lòng mô tả vấn đề của bạn'
    isValid = false
  } else if (formData.description.trim().length < 10) {
    errors.description = 'Vui lòng mô tả chi tiết hơn (ít nhất 10 ký tự)'
    isValid = false
  } else if (formData.description.trim().length > 500) {
    errors.description = 'Mô tả không được vượt quá 500 ký tự'
    isValid = false
  }

  return isValid
}

// Gửi dữ liệu lên server
const submitToServer = async (data) => {
  try {
    isLoading.value = true

    const response = await api.post('/thg/public/saveContact', data)

    if (response.status === 200) {
      // Thành công
      return { success: true, message: 'Đăng ký thành công!' }
    }
  } catch (error) {
    // Xử lý lỗi từ server
    if (error.response) {
      const status = error.response.status
      const message = error.response.data

      if (status === 429) {
        // Phát hiện spam
        return {
          success: false,
          isSpam: true,
          message: message || 'Bạn đã gửi liên hệ quá nhiều lần trong thời gian ngắn. Vui lòng thử lại sau.'
        }
      } else {
        // Lỗi khác
        return {
          success: false,
          message: message || 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.'
        }
      }
    } else {
      // Lỗi mạng
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
      }
    }
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    Swal.fire({
      icon: 'error',
      title: 'Thiếu thông tin',
      text: 'Vui lòng điền đầy đủ thông tin theo yêu cầu',
      confirmButtonColor: props.purpleTemplate ? '#d946ef' : '#1e40af',
      confirmButtonText: 'Đã hiểu'
    })
    return
  }

  // Chuẩn bị dữ liệu gửi đi
  const submitData = {
    fullName: formData.fullName,
    phone: formData.phone,
    email: formData.email,
    address: formData.detailAddress + ', '+ formData.ward?.name +', ' + formData.province?.name,
    consultingField: formData.consultingField,
    description: formData.description
  }

  // Gửi dữ liệu lên server
  const result = await submitToServer(submitData)

  if (result.success) {
    // Hiển thị thông báo thành công
    Swal.fire({
      icon: 'success',
      title: 'Đăng ký thành công!',
      html: `
        <div class="text-left">
          <p><strong>Cảm ơn ${formData.fullName} đã tin tưởng liên hệ!</strong></p>
          <p class="mt-2">Chúng tôi đã nhận được thông tin của bạn:</p>
          <ul class="mt-2 list-disc pl-5">
            <li>SĐT: ${formData.phone}</li>
            <li>Email: ${formData.email}</li>
            <li>Địa chỉ: ${formData.detailAddress}, ${formData.ward?.name}, ${formData.province?.name}</li>
            <li>Lĩnh vực quan tâm: ${formData.consultingField}</li>
          </ul>
          <p class="mt-4">Đội ngũ chuyên gia của chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.</p>
        </div>
      `,
      confirmButtonColor: props.purpleTemplate ? '#d946ef' : '#1e40af',
      confirmButtonText: 'Tuyệt vời!',
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      }
    })

    // Gửi event
    emit('submit', submitData)

    // Reset form
    resetForm()
  } else {
    // Hiển thị thông báo lỗi
    if (result.isSpam) {
      // Thông báo warning cho spam
      Swal.fire({
        icon: 'warning',
        title: 'Gửi quá nhanh!',
        html: `
          <div class="text-left">
            <p class="mb-3"><strong>${result.message}</strong></p>
            <p class="text-sm text-gray-600">Để đảm bảo chất lượng dịch vụ và chống spam, hệ thống đã tạm thời giới hạn số lần gửi liên hệ.</p>
            <ul class="mt-2 text-sm text-gray-600 list-disc pl-5">
              <li>Bạn chỉ có thể gửi tối đa 10 lần/ 1 giờ</li>
              <li>Vui lòng đợi ít nhất 1 giờ trước khi gửi lại</li>
              <li>Đảm bảo thông tin bạn cung cấp là chính xác</li>
              <li>Nếu đây là lỗi hệ thống, vui lòng liên hệ hotline: <a class="text-blue-600 text-decoration-underline" href="tel:0911231882">091.123.1882</a></li>
            </ul>
          </div>
        `,
        confirmButtonColor: '#f59e0b',
        confirmButtonText: 'Đã hiểu',
        showClass: {
          popup: 'animate__animated animate__shakeX animate__faster'
        },
        width: 500
      })
    } else {
      // Thông báo lỗi khác
      Swal.fire({
        icon: 'error',
        title: 'Gửi thất bại',
        text: result.message,
        confirmButtonColor: props.purpleTemplate ? '#d946ef' : '#1e40af',
        confirmButtonText: 'Thử lại'
      })
    }
  }
}

const resetForm = () => {
  formData.fullName = ''
  formData.phone = ''
  formData.email = ''
  formData.province = null
  formData.ward = null
  formData.detailAddress = ''
  formData.consultingField = ''
  formData.description = ''
  provinceSearch.value = ''
  wardSearch.value = ''
}
</script>

<style scoped>
/* Style cho dropdown */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Style cho select dropdown */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Animations */
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Circle Animations */
@keyframes circleFloatLarge {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(30px, -20px) rotate(90deg);
  }
  50% {
    transform: translate(-20px, 30px) rotate(180deg);
  }
  75% {
    transform: translate(20px, 20px) rotate(270deg);
  }
}

@keyframes circleFloatMedium {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(40px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 40px) scale(0.9);
  }
}

@keyframes circleFloatDot {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

@keyframes moveGrid {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-fade-in-left {
  animation: fade-in-left 0.6s ease-out forwards;
}

.animate-fade-in-right {
  animation: fade-in-right 0.6s ease-out forwards;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-dropdown {
  animation: dropdown 0.2s ease-out forwards;
}

/* Circle Animation Classes */
.circle-large-1 {
  animation: circleFloatLarge 30s infinite ease-in-out;
}

.circle-large-2 {
  animation: circleFloatLarge 35s infinite ease-in-out reverse;
}

.circle-medium {
  animation: circleFloatMedium 25s infinite ease-in-out;
}

.circle-dot {
  animation: circleFloatDot 15s infinite ease-in-out;
}
</style>