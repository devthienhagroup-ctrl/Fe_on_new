<template>
  <div class="service-packages-container">
    <!-- Header - Conditionally Rendered -->
    <div v-if="!hideHeader" class="header-bg"></div>
    <header v-if="!hideHeader" class="header">
      <div class="header-content">
        <img src="/imgs/logoTHG.png" alt="Logo THG" class="logo" />
        <h1 class="title">CÁC GÓI DỊCH VỤ</h1>
        <p class="subtitle">
          Bắt đầu hành trình cùng Thiên Hà Group với gói dịch vụ phù hợp nhất – linh hoạt, dễ dùng và tối ưu cho mọi nhu cầu.
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'no-header-layout': hideHeader }">
      <div class="packages-grid" id="grid">
        <div
            v-for="packageItem in servicePackages"
            :key="packageItem.id"
            class="package-card"
            :class="{
            active: packageItem.isActive,
            'details-expanded': packageItem.showDetails
          }"
        >
          <div class="card-content">
            <div class="card-main">
              <div class="card-header">
                <h3 class="package-name">{{ packageItem.name }}</h3>
                <i :class="packageItem.icon" class="package-icon"></i>
              </div>

              <div class="price-section">
                <div class="price">{{ formatPrice(packageItem.price) }}</div>
                <div class="duration">/ {{ packageItem.unit }} <span class="fs-6" v-if="packageItem.tuDongGiaHan != null">
                  ( {{ packageItem.tuDongGiaHan ? 'Gia hạn tự động':'Đã hủy' }})
                </span> </div>
              </div>

              <div class="divider"></div>

              <div class="description-section">
                <p v-html="packageItem.description" class="description"></p>
              </div>

              <div class="button-section">
                <button
                    :class="[
                    'upgrade-btn',
                    packageItem.isActive ? 'current-package' : 'upgrade'
                  ]"
                    :disabled="packageItem.isActive"
                    @click="registerOrUpgradePackage(packageItem)"
                >
                  {{ packageItem.buttonText }}
                </button>

                <div class="details-toggle" @click="toggleDetails(packageItem.id)">
                  <span class="details-text">{{ packageItem.showDetails ? 'Thu gọn' : 'Xem chi tiết' }}</span>
                  <i class="fa-solid fa-chevron-down" :class="{ rotated: packageItem.showDetails }"></i>
                </div>
              </div>
            </div>

            <transition name="expand">
              <div v-if="packageItem.showDetails" class="package-details-container">
                <div class="package-details">
                  <div
                      v-for="(detail, index) in packageItem.details"
                      :key="index"
                      class="detail-item d-flex align-items-start gap-2 text-blue-dark"
                  >
                    <!-- ICON -->
                    <i class="fa-solid fa-plus mt-1"></i>

                    <!-- TEXT -->
                    <span class="fw-semibold">
        {{ detail.text }}
      </span>

                    <!-- SỐ LƯỢT (CĂN PHẢI + IN ĐẬM + CÓ MÀU) -->
                    <span class="ms-auto fw-bold text-primary">
                      {{ detail.soLuot === null ? 'Không giới hạn':  detail.soLuot + ' lượt'}}
                    </span>
                  </div>
                </div>
              </div>

            </transition>
          </div>
        </div>
      </div>
      <AdditionalServices @cancel-package="fetchServicePackages" ></AdditionalServices>
      <!-- Call to Action Section -->
      <div class="cta-section">
        <h2 class="cta-title">Sẵn sàng nâng tầm hoạt động kinh doanh của bạn?</h2>
        <p class="cta-description">
          Đăng ký ngay hôm nay để nhận hỗ trợ thiết lập tài khoản và ưu đãi đặc biệt cho người dùng mới!
        </p>
        <div class="cta-buttons">
          <button class="cta-btn contact-btn">Liên hệ tư vấn</button>
          <button class="cta-btn register-btn">Đăng ký ngay</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import AdditionalServices from "./AdditionalServices.vue";
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '/src/api/api.js'   // dùng axios instance của bạn

const route = useRoute()

// ===== HIDE HEADER =====
const hideHeader = computed(() => {
  return route.meta?.hideHeader === true
})

// ===== DATA =====
const servicePackages = ref([])
const loading = ref(false)
const error = ref(null)

// ===== FETCH API =====
const fetchServicePackages = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await api.get('/api/service-packages')
    servicePackages.value = res.data
  } catch (e) {
    console.error(e)
    error.value = 'Không thể tải danh sách gói dịch vụ'
  } finally {
    loading.value = false
  }
}

// ===== TOGGLE DETAILS =====
const toggleDetails = (packageId) => {
  const packageItem = servicePackages.value.find(p => p.id === packageId)
  if (packageItem) {
    packageItem.showDetails = !packageItem.showDetails
  }
}

// ===== FORMAT PRICE =====
const formatPrice = (price) => {
  if (price === 0) return 'Miễn phí'
  return price.toLocaleString('vi-VN')
}

// ===== INIT =====
onMounted(() => {
  fetchServicePackages()
})

import {
  confirmYesNo,
  showLoading,
  updateAlertSuccess,
  updateAlertError
} from '/src/assets/js/alertService.js'

const registerOrUpgradePackage = async (packageItem) => {
  confirmYesNo(
      'Xác nhận gói dịch vụ',
      `
<div style="text-align:left; font-size:18px; line-height:1.6;">
  <div style="margin-bottom:6px;">
    <span style="color:#374151;">Gói:</span>
    <b style="color:#2563eb;">${packageItem.name}</b>
  </div>

  <div style="margin-bottom:10px;">
    <span style="color:#374151;">Giá:</span>
    <b style="color:#2563eb;">
      ${formatPrice(packageItem.price)} / ${packageItem.unit}
    </b>
  </div>

  <div style="
    padding:10px 12px;
    border-radius:8px;
    background:rgba(37,99,235,0.10);
    color:#1e3a8a;
    font-weight:600;
  ">
    Bạn có chắc chắn muốn <b>đăng ký / nâng cấp</b> gói này không?
  </div>
</div>
`
      ,
      async () => {
        try {
          // 🌀 Hiện loading + chờ API xong
           const  res = await showLoading(
              api.post(
                  `/profile/register-or-upgrade/${packageItem.id}`
              )
          )
          const data = res.data
          console.log(data.success)
          // ❌ Không đủ tiền / nghiệp vụ fail
          if (!data.success){
            updateAlertError('Thất bại', 'Số dư không đủ để đăng ký gói dịch vụ! Vui lòng nạp thêm tiền vào tài khoản và đăng ký lại.')
            return;
          }else{
            updateAlertSuccess(
                'Thành công 🎉',
                'Gói dịch vụ đã được kích hoạt'
            )
          }

          // ✅ Thành công


          // reload lại danh sách gói
          await fetchServicePackages()

        } catch (e) {
          console.error(e)

          // ❌ Lỗi
          updateAlertError(
              'Thất bại',
              e?.response?.data || 'Không thể đăng ký gói dịch vụ'
          )
        }
      }
  )
}

</script>


<style scoped>
.service-packages-container {
  max-width: 1400px;
  margin: 0 auto;

  position: relative;
}

/* Header Styles */
.header {
  padding: 40px 20px 80px;
  text-align: center;
  color: white;
  position: relative; /* Thêm position relative */
  z-index: 2; /* Đảm bảo header nằm trên background */
}

.header-bg {
  background: linear-gradient(135deg,
  #0629BE 7%,
  #031358 22%,
  #0629BE 56%,
  #031358 81%,
  #0628B9 100%);
  border-bottom-left-radius: 50% 30%;
  border-bottom-right-radius: 50% 30%;
  height: 430px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1; /* Giảm z-index để nằm dưới header */
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative; /* Đảm bảo nội dung header nằm trên background */
  z-index: 3;
}

.logo {
  width: 200px;
  height: auto;
  margin-bottom: 20px;
}

.title {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 20px;
  line-height: 1.5;
}

/* Main Content */
.main-content {
  padding: 40px 20px;
  position: relative; /* Thêm position relative */
  z-index: 1; /* Đảm bảo main content nằm trên background */
}

/* Layout when header is hidden */
.main-content.no-header-layout {
  padding-top: 0;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 60px;
  align-items: stretch; /* Thay đổi từ start thành stretch */
}

/* 2-column layout when header is hidden */
.main-content.no-header-layout .packages-grid {
  grid-template-columns: repeat(2, 1fr);
}

.package-card {
  background: white;
  border-radius: 12px;
  padding: 25px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: auto; /* Đảm bảo chiều cao tự động */
}

.package-card:hover {
  box-shadow:
      0 8px 25px rgba(0, 48, 255, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 100%; /* Chiếm toàn bộ chiều cao của card */
  position: relative;
}

.card-main {
  flex: 1; /* Chiếm không gian còn lại */
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.package-name {
  font-size: 18px;
  font-weight: 700;
  color: #031358;
  margin: 0;
  flex: 1;
}

.package-icon {
  font-size: 50px;
  color: #031358;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.package-card.active .package-icon,
.package-card:hover .package-icon {
  color: #0030FF;
}

.package-card.details-expanded .package-icon {
  color: #0030FF;
  transform: scale(1.1);
}

.price-section {
  margin-bottom: 15px;
}

.price {
  font-size: 48px;
  font-weight: 700;
  color: #031358;
  line-height: 1;
  transition: color 0.3s ease;
}

.package-card.active .price,
.package-card:hover .price {
  color: #407BFF;
}

.package-card.details-expanded .price {
  color: #407BFF;
}

.duration {
  font-size: 28px;
  color: #031358;
  margin-top: 5px;
}

.divider {
  width: 60px;
  height: 3px;
  background: #0030FF;
  margin: 15px 0;
}

.description-section {
  flex: 1; /* Chiếm không gian còn lại */
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.description {
  color: #555;
  line-height: 1.6;
  margin: 0;
  font-size: 14px;
  flex: 1; /* Đảm bảo description chiếm không gian đều nhau */
}

.button-section {
  margin-top: auto; /* Đẩy button section xuống dưới cùng */
  flex-shrink: 0; /* Không bị co lại */
}

.upgrade-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.upgrade {
  background: linear-gradient(90deg, #031358, #0030FF, #031358);
  background-size: 200% 100%;
  color: white;
  animation: gradientShift 3s ease infinite;
}

.upgrade:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 48, 255, 0.3);
}

.current-package {
  background: transparent;
  border: 2px solid #0030FF;
  color: #0030FF;
  cursor: not-allowed;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.details-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #031358;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 8px 0;
  font-size: 14px;
}

.details-toggle:hover {
  color: #0030FF;
}

.details-text {
  margin-right: 8px;
}

.fa-chevron-down {
  transition: transform 0.3s ease;
}

.fa-chevron-down.rotated {
  transform: rotate(180deg);
}

/* Expand Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s ease;
  max-height: 500px;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}

.package-details-container {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
  overflow: hidden;
  flex-shrink: 0; /* Không bị co lại */
}

.package-details {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

/* Custom scrollbar for details */
.package-details::-webkit-scrollbar {
  width: 4px;
}

.package-details::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.package-details::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #0030FF, #031358);
  border-radius: 2px;
}

.package-details::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #031358, #0030FF);
}

.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.detail-item i {
  color: #0030FF;
  margin-right: 10px;
  margin-top: 2px;
  flex-shrink: 0;
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f8f9ff, #e8ecff);
  border-radius: 12px;
  max-width: 900px;
  margin: 0 auto;
}

.cta-title {
  font-size: 32px;
  color: #031358;
  margin-bottom: 20px;
  font-weight: 700;
}

.cta-description {
  font-size: 18px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 14px 30px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-btn {
  background: white;
  color: #031358;
  border: 2px solid #031358;
}

.contact-btn:hover {
  background: #031358;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(3, 19, 88, 0.3);
}

.register-btn {
  background: linear-gradient(90deg, #031358, #0030FF);
  color: white;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 48, 255, 0.3);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .packages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Override for 2-column layout when header is hidden */
  .main-content.no-header-layout .packages-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .packages-grid {
    grid-template-columns: 1fr;
  }

  /* Override for 2-column layout when header is hidden */
  .main-content.no-header-layout .packages-grid {
    grid-template-columns: 1fr;
  }

  .header {
    padding: 30px 15px 60px;
  }

  .title {
    font-size: 32px;
  }

  .subtitle {
    font-size: 18px;
  }

  .price {
    font-size: 40px;
  }

  .duration {
    font-size: 24px;
  }

  .cta-title {
    font-size: 28px;
  }

  .cta-description {
    font-size: 16px;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 20px 10px 50px;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .logo {
    width: 160px;
  }

  .package-card {
    padding: 20px 15px;
  }

  .price {
    font-size: 36px;
  }

  .duration {
    font-size: 20px;
  }

  .cta-section {
    padding: 40px 15px;
  }

  .cta-title {
    font-size: 24px;
  }

  .header-bg {
    height: 450px;
  }
}
.text-blue-dark {
  color: #0f172a; /* xanh đen - slate-900 */
}

</style>