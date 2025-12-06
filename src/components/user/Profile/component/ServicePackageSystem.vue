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
                <div class="duration">/ {{ packageItem.unit }}</div>
              </div>

              <div class="divider"></div>

              <div class="description-section">
                <p class="description">{{ packageItem.description }}</p>
              </div>

              <div class="button-section">
                <button
                    :class="[
                    'upgrade-btn',
                    packageItem.isActive ? 'current-package' : 'upgrade'
                  ]"
                    :disabled="packageItem.isActive"
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
                      class="detail-item"
                  >
                    <i :class="detail.icon"></i>
                    <span>{{ detail.text }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <AdditionalServices></AdditionalServices>
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AdditionalServices from "./AdditionalServices.vue";

const route = useRoute()

// Check if hideHeader is true in route meta
const hideHeader = computed(() => {
  return route.meta?.hideHeader === true
})

const servicePackages = ref([
  {
    id: 1,
    name: "Gói dùng thử",
    price: 0,
    unit: "tháng",
    icon: "fa-regular fa-star",
    description: "Trải nghiệm miễn phí các tính năng cơ bản — đăng tin, xem danh sách và làm quen với nền tảng. Gói này phù hợp cho những người mới bắt đầu muốn khám phá các tính năng cơ bản của nền tảng.",
    buttonText: "Gói hiện tại của bạn",
    isActive: true,
    showDetails: false,
    details: [
      { icon: "fa-solid fa-bullhorn", text: "Đăng tối đa 3 tin bất động sản miễn phí" },
      { icon: "fa-regular fa-eye", text: "Hiển thị tin ở mức cơ bản" },
      { icon: "fa-solid fa-user", text: "Xem thông tin của 5 khách hàng đầu tiên" },
      { icon: "fa-solid fa-magnifying-glass", text: "Truy cập bộ lọc tìm kiếm cơ bản" },
      { icon: "fa-solid fa-mobile", text: "Ứng dụng di động miễn phí" },
      { icon: "fa-solid fa-envelope", text: "Hỗ trợ email trong 24h" }
    ]
  },
  {
    id: 2,
    name: "Gói nâng cao",
    price: 199000,
    unit: "tháng",
    icon: "fa-solid fa-rocket",
    description: "Mở rộng quyền truy cập với nhiều lượt đăng tin hơn, ưu tiên hiển thị và thêm công cụ quản lý tin đăng hiệu quả. Phù hợp cho các cá nhân kinh doanh nhỏ.",
    buttonText: "Nâng cấp ngay!",
    isActive: false,
    showDetails: false,
    details: [
      { icon: "fa-solid fa-clipboard-list", text: "Đăng tối đa 20 tin/tháng" },
      { icon: "fa-solid fa-star", text: "Ưu tiên hiển thị trong kết quả tìm kiếm" },
      { icon: "fa-solid fa-chart-line", text: "Thống kê lượt xem tin đăng" },
      { icon: "fa-solid fa-pen-to-square", text: "Chỉnh sửa và làm mới tin dễ dàng" },
      { icon: "fa-solid fa-headset", text: "Hỗ trợ kỹ thuật nhanh chóng" },
      { icon: "fa-solid fa-image", text: "Tải lên hình ảnh chất lượng cao" },
      { icon: "fa-solid fa-share", text: "Chia sẻ tin đăng lên mạng xã hội" }
    ]
  },
  {
    id: 3,
    name: "Gói Pro",
    price: 299000,
    unit: "tháng",
    icon: "fa-solid fa-briefcase",
    description: "Dành cho môi giới chuyên nghiệp, hỗ trợ đăng tin không giới hạn, phân tích lượt xem và tiếp cận khách hàng tiềm năng nhanh hơn. Bao gồm tất cả tính năng của gói nâng cao và nhiều hơn nữa.",
    buttonText: "Nâng cấp ngay!",
    isActive: false,
    showDetails: false,
    details: [
      { icon: "fa-solid fa-infinity", text: "Đăng tin không giới hạn" },
      { icon: "fa-solid fa-rectangle-ad", text: "Đặt banner nổi bật trên trang chủ" },
      { icon: "fa-solid fa-chart-column", text: "Thống kê chi tiết lượt xem & tương tác" },
      { icon: "fa-solid fa-arrows-rotate", text: "Tự động làm mới tin mỗi ngày" },
      { icon: "fa-brands fa-facebook", text: "Quảng cáo trên mạng xã hội" },
      { icon: "fa-solid fa-headset", text: "Hỗ trợ kỹ thuật 24/7" },
      { icon: "fa-solid fa-download", text: "Xuất báo cáo định kỳ" },
      { icon: "fa-solid fa-users", text: "Quản lý nhiều tài khoản con" }
    ]
  },
  {
    id: 4,
    name: "Gói Premium",
    price: 449000,
    unit: "tháng",
    icon: "fa-solid fa-gem",
    description: "Trải nghiệm toàn bộ tính năng cao cấp — hiển thị nổi bật, báo cáo hiệu suất chi tiết, hỗ trợ thương hiệu cá nhân và chăm sóc khách hàng riêng. Giải pháp toàn diện cho doanh nghiệp lớn.",
    buttonText: "Nâng cấp ngay!",
    isActive: false,
    showDetails: false,
    details: [
      { icon: "fa-solid fa-layer-group", text: "Bao gồm mọi tính năng của Gói Pro" },
      { icon: "fa-solid fa-trophy", text: "Hiển thị top đầu trong kết quả tìm kiếm" },
      { icon: "fa-solid fa-chart-pie", text: "Báo cáo phân tích chuyên sâu hiệu quả tin đăng" },
      { icon: "fa-solid fa-user-tie", text: "Xây dựng thương hiệu cá nhân/doanh nghiệp" },
      { icon: "fa-solid fa-handshake", text: "Chăm sóc khách hàng riêng 1-1" },
      { icon: "fa-solid fa-headset", text: "Hỗ trợ kỹ thuật 24/7" },
      { icon: "fa-solid fa-comments-dollar", text: "Tư vấn chiến lược marketing bất động sản" },
      { icon: "fa-solid fa-gem", text: "Badge Premium trên hồ sơ" },
      { icon: "fa-solid fa-video", text: "Hỗ trợ video call tư vấn" }
    ]
  },
  {
    id: 5,
    name: "Gói Pro",
    price: 299000,
    unit: "tháng",
    icon: "fa-solid fa-briefcase",
    description: "Dành cho môi giới chuyên nghiệp, hỗ trợ đăng tin không giới hạn, phân tích lượt xem và tiếp cận khách hàng tiềm năng nhanh hơn. Bao gồm tất cả tính năng của gói nâng cao và nhiều hơn nữa.",
    buttonText: "Nâng cấp ngay!",
    isActive: false,
    showDetails: false,
    details: [
      { icon: "fa-solid fa-infinity", text: "Đăng tin không giới hạn" },
      { icon: "fa-solid fa-rectangle-ad", text: "Đặt banner nổi bật trên trang chủ" },
      { icon: "fa-solid fa-chart-column", text: "Thống kê chi tiết lượt xem & tương tác" },
      { icon: "fa-solid fa-arrows-rotate", text: "Tự động làm mới tin mỗi ngày" },
      { icon: "fa-brands fa-facebook", text: "Quảng cáo trên mạng xã hội" },
      { icon: "fa-solid fa-headset", text: "Hỗ trợ kỹ thuật 24/7" },
      { icon: "fa-solid fa-download", text: "Xuất báo cáo định kỳ" },
      { icon: "fa-solid fa-users", text: "Quản lý nhiều tài khoản con" }
    ]
  },
  {
    id: 6,
    name: "Gói Premium",
    price: 449000,
    unit: "tháng",
    icon: "fa-solid fa-gem",
    description: "Trải nghiệm toàn bộ tính năng cao cấp — hiển thị nổi bật, báo cáo hiệu suất chi tiết, hỗ trợ thương hiệu cá nhân và chăm sóc khách hàng riêng. Giải pháp toàn diện cho doanh nghiệp lớn.",
    buttonText: "Nâng cấp ngay!",
    isActive: false,
    showDetails: false,
    details: [
      { icon: "fa-solid fa-layer-group", text: "Bao gồm mọi tính năng của Gói Pro" },
      { icon: "fa-solid fa-trophy", text: "Hiển thị top đầu trong kết quả tìm kiếm" },
      { icon: "fa-solid fa-chart-pie", text: "Báo cáo phân tích chuyên sâu hiệu quả tin đăng" },
      { icon: "fa-solid fa-user-tie", text: "Xây dựng thương hiệu cá nhân/doanh nghiệp" },
      { icon: "fa-solid fa-handshake", text: "Chăm sóc khách hàng riêng 1-1" },
      { icon: "fa-solid fa-headset", text: "Hỗ trợ kỹ thuật 24/7" },
      { icon: "fa-solid fa-comments-dollar", text: "Tư vấn chiến lược marketing bất động sản" },
      { icon: "fa-solid fa-gem", text: "Badge Premium trên hồ sơ" },
      { icon: "fa-solid fa-video", text: "Hỗ trợ video call tư vấn" }
    ]
  }
])

const toggleDetails = (packageId) => {
  // Mở/đóng card được click
  const packageItem = servicePackages.value.find(p => p.id === packageId)
  if (packageItem) {
    packageItem.showDetails = !packageItem.showDetails
  }
}

const formatPrice = (price) => {
  if (price === 0) return 'Miễn phí'
  return price.toLocaleString('vi-VN')
}
</script>

<style scoped>
.service-packages-container {
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Ubuntu', sans-serif;
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
</style>