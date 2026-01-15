<template>
  <section id="pricing" class="py-16 md:py-24" :class="{'gradient-pink-purple': gradientPinkPurple}">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
          Chọn gói <span class="gradient-text">phù hợp với bạn</span>
        </h2>
        <p class="text-lg text-slate-300 max-w-2xl mx-auto">
          Từ cá nhân đến doanh nghiệp, chúng tôi có giải pháp cho mọi nhu cầu
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <div class="relative mx-auto w-20 h-20 mb-4">
            <div :class="gradientPinkPurple ? 'border-pink-500/20' : 'border-purple-500/20'" class="absolute inset-0 border-4 rounded-full"></div>
            <div
                :class="gradientPinkPurple ? 'border-t-pink-500' : 'border-t-purple-500'"
                class="absolute inset-0 border-4 border-transparent rounded-full animate-spin"></div>
          </div>
          <p class="text-slate-300">Đang tải thông tin gói dịch vụ...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-10">
        <div class="glass-card rounded-2xl p-8 max-w-md mx-auto">
          <i class="fas fa-exclamation-triangle text-yellow-400 text-4xl mb-4"></i>
          <h3 class="text-xl font-bold text-slate-50 mb-2">Không thể tải thông tin gói dịch vụ</h3>
          <p class="text-slate-300 mb-4">{{ error }}</p>
          <button @click="fetchPackages"
                  :class="gradientPinkPurple ?
                    'bg-pink-500/20 border-pink-500/30 text-pink-300 hover:bg-pink-500/30' :
                    'bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30'"
                  class="px-6 py-2 border rounded-lg transition">
            Thử lại
          </button>
        </div>
      </div>

      <!-- Success State -->
      <div v-else class="grid md:grid-cols-3 gap-8 mx-auto">
        <div v-for="(packageItem, index) in packages" :key="packageItem.id"
             class="glass-card rounded-2xl p-8 relative hover-lift flex flex-col justify-between gap-0"
             :class="index === 1 ? (gradientPinkPurple ? 'border-2 border-pink-500' : 'border-2 border-purple-500') : ''"
             data-aos="fade-up" :data-aos-delay="index * 100">

          <!-- Popular badge for middle package -->
          <div class="top-wrapper">
            <div v-if="index === 1" class="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div class="gradient-bg text-slate-50 px-4 py-1 rounded-full text-sm font-semibold">
                Phổ biến nhất
              </div>
            </div>

            <!-- Package Header -->
            <div class="text-center mb-8">
              <div class="flex items-center justify-between gap-3 mb-4">
                <h3 class="text-3xl font-bold text-slate-50">{{ packageItem.name }}</h3>
                <i v-if="index === 1" :class="packageItem.icon" class="text-5xl gradient-text"></i>
                <i
                    v-else
                    :class="{
    [packageItem.icon]: true,
    'text-pink-400': gradientPinkPurple,
    'text-purple-400': !gradientPinkPurple,
    'text-3xl': true
  }"
                ></i>

              </div>

              <!-- Price -->
              <div class="text-3xl font-bold text-slate-50 mb-2">
                {{ formatPrice(packageItem.price) + 'đ' }}
                <span class="text-lg text-slate-400">/{{ packageItem.unit }}</span>
              </div>

              <!-- Description with custom CSS -->
              <div class="package-description text-slate-300 text-sm mb-6 text-justify"
                   v-html="packageItem.description">
              </div>
            </div>
          </div>
          <hr/>
          <!-- Features List -->
          <div class="bottom-wrapper">
            <ul class="space-y-4 mb-8 p-0">
              <li v-for="(detail, idx) in packageItem.details" :key="idx" class="flex items-center">
                <i :class="gradientPinkPurple ? 'text-pink-400' : 'text-purple-400'" class="fas fa-check mr-3"></i>
                <span class="text-slate-300">
                {{ detail.text }}
                <span v-if="detail.soLuot" :class="gradientPinkPurple ? 'text-pink-300' : 'text-purple-300'" class="font-semibold">
                  ({{ detail.soLuot }} lượt)
                </span>
                <span v-else :class="gradientPinkPurple ? 'text-pink-300' : 'text-purple-300'" class="font-semibold">
                  (Không giới hạn)
                </span>
              </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-2" data-aos="fade-left" data-aos-delay="100">
        <router-link to="/ho-so/goi-dich-vu" class="btn-gradient glow py-2 rounded-lg px-3">Tới trang đăng ký</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import api from "../../../../api/api.js";

const props = defineProps({
  gradientPinkPurple: {
    type: Boolean,
    default: false
  }
})

const loading = ref(true)
const error = ref(null)
const packages = ref([])

// Format price to Vietnamese currency
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

// Fetch packages from API
const fetchPackages = async () => {
  try {
    loading.value = true
    error.value = null

    const response = await api.get('/thg/public/service-packages')

    if (response.data && Array.isArray(response.data)) {
      packages.value = response.data
    } else {
      throw new Error('Dữ liệu không hợp lệ')
    }
  } catch (err) {
    console.error('Lỗi khi tải gói dịch vụ:', err)
    error.value = err.message || 'Đã xảy ra lỗi khi tải dữ liệu'

    // Fallback data for development
    if (process.env.NODE_ENV === 'development') {
      packages.value = [
        {
          id: 1,
          name: "Premium",
          price: 599000,
          unit: "tháng",
          icon: "fa-solid fa-crown",
          description: "<p>Dành cho môi giới chuyên nghiệp và người dùng cao cấp. Trải nghiệm đầy đủ tính năng, phân tích chuyên sâu và hỗ trợ ưu tiên.</p>",
          buttonText: "Đăng ký ngay",
          details: [
            {text: "Định giá sơ bộ", soLuot: 150},
            {text: "Quản lý kho hàng", soLuot: 150},
            {text: "Mở khóa sản phẩm", soLuot: 200}
          ]
        },
        {
          id: 2,
          name: "Pro",
          price: 499000,
          unit: "tháng",
          icon: "fa-solid fa-gem",
          description: "<p>Phù hợp với môi giới hoạt động thường xuyên. Cung cấp công cụ quản lý nâng cao, báo cáo chi tiết.</p>",
          buttonText: "Đăng ký ngay",
          details: [
            {text: "Định giá sơ bộ", soLuot: 50},
            {text: "Quản lý kho hàng", soLuot: 100},
            {text: "Mở khóa sản phẩm", soLuot: 50}
          ]
        },
        {
          id: 3,
          name: "Plus",
          price: 199000,
          unit: "tháng",
          icon: "fa-regular fa-star",
          description: "<p>Dành cho cá nhân và môi giới mới bắt đầu. Hỗ trợ các tính năng cơ bản để quản lý tài sản.</p>",
          buttonText: "Đăng ký ngay",
          details: [
            {text: "Định giá sơ bộ", soLuot: 10},
            {text: "Quản lý kho hàng", soLuot: 50},
            {text: "Mở khóa sản phẩm", soLuot: 20}
          ]
        }
      ]
      error.value = null
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPackages()

  // Initialize AOS animations if available
  if (window.AOS) {
    setTimeout(() => {
      window.AOS.refresh()
    }, 100)
  }
})
</script>

<style scoped>
/* Default gradient (purple) */
.gradient-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-bg {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
}

.glass-card:hover .gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-gradient {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: #fff;
}

/* When gradientPinkPurple is true - chỉ áp dụng trong component này */
.gradient-pink-purple .gradient-text {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.gradient-pink-purple .gradient-bg {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%) !important;
}

.gradient-pink-purple .glass-card:hover .gradient-text {
  background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.gradient-pink-purple .btn-gradient {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%) !important;
  color: #fff !important;
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.15);
}

/* Custom styles for package description */
.package-description :deep(p) {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.package-description :deep(strong) {
  font-weight: 600;
}

.package-description :deep(em) {
  font-style: italic;
}

.package-description :deep(span) {
  color: inherit;
}

/* Override any inline styles from the description */
.package-description :deep(*[style*="color"]) {
  color: #cbd5e1 !important; /* slate-300 */
}

.package-description :deep(strong[style*="color"]) {
  color: #f1f5f9 !important; /* slate-100 */
}

.package-description :deep(em[style*="color"]) {
  color: #cbd5e1 !important; /* slate-300 */
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>