<template>
  <div class="fee-calculator">
    <div class="container">
      <h1 class="main-title">
        Biểu phí định giá sơ bộ
      </h1>

      <!-- Component tính phí nhanh -->
      <QuickFeeCalculator
          :feeRates="feeRates"
          @value-changed="handleValueChange"
      />

      <!-- Layout 2 cột -->
      <div class="two-column-layout">
        <!-- Cột trái: Bảng hiển thị biểu phí -->
        <div class="left-column">
          <div class="fee-table-wrapper">
            <div class="fee-table">
              <div class="table-header">
                <div class="col-range">Giá trị tài sản mong muốn (tỷ VNĐ)</div>
                <div class="col-fee">Phí dịch vụ (VNĐ)</div>
              </div>

              <div
                  v-for="(rate, index) in feeRates"
                  :key="index"
                  class="table-row"
                  :class="{
                    'active': isRateActive(rate),
                    'highlight': index % 2 === 0
                  }"
                  @mouseover="hoveredRow = index"
                  @mouseleave="hoveredRow = null"
              >
                <div class="col-range">
                  <i class="fas fa-chart-bar"></i>
                  {{ rate.desiredValue }}
                </div>
                <div class="col-fee">
                  <span class="fee-amount">{{ formatCurrency(rate.fee) }}</span>
                  <i v-if="isRateActive(rate)" class="fas fa-check active-indicator"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cột phải: Hướng dẫn sử dụng -->
        <div class="right-column">
          <div class="guide-container">
            <h2 class="guide-title">
              <i class="fas fa-info-circle"></i>
              Hướng dẫn sử dụng công cụ định giá
            </h2>

            <div class="steps-container">
              <div
                  class="step"
                  :class="{ 'expanded': expandedSteps[0] }"
                  @click="toggleStep(0)"
              >
                <div class="step-main">
                  <div class="step-number">Bước 1</div>
                  <div class="step-content">
                    <p class="step-title">Đăng ký tài khoản chủ nhà</p>
                    <p class="step-action">
                      Nếu chưa có tài khoản hãy truy cập và tạo tài khoản mới
                      <span class="link" @click.stop="navigateToLogin">tại đây</span>.
                    </p>
                  </div>
                  <button
                      class="expand-btn"
                      @click.stop="toggleStep(0)"
                  >
                    <i :class="expandedSteps[0] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                  </button>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedSteps[0]" class="step-detail">
                    Quá trình đăng ký đơn giản, chỉ cần cung cấp email, số điện thoại và thông tin cá nhân cơ bản.
                  </div>
                </transition>
              </div>

              <div
                  class="step"
                  :class="{ 'expanded': expandedSteps[1] }"
                  @click="toggleStep(1)"
              >
                <div class="step-main">
                  <div class="step-number">Bước 2</div>
                  <div class="step-content">
                    <p class="step-title">Truy cập trang định giá</p>
                    <p class="step-action">
                      Nhấn định giá ngay
                      <span class="link" @click.stop="navigateToValuation">tại đây</span>
                    </p>
                  </div>
                  <button
                      class="expand-btn"
                      @click.stop="toggleStep(1)"
                  >
                    <i :class="expandedSteps[1] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                  </button>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedSteps[1]" class="step-detail">
                    Giao diện thân thiện, dễ sử dụng với các bước hướng dẫn rõ ràng và xem trước biểu phí.
                  </div>
                </transition>
              </div>

              <div
                  class="step"
                  :class="{ 'expanded': expandedSteps[2] }"
                  @click="toggleStep(2)"
              >
                <div class="step-main">
                  <div class="step-number">Bước 3</div>
                  <div class="step-content">
                    <p class="step-title">Thêm thông tin tài sản</p>
                    <p class="step-action">Điền form thông tin và cung cấp hình ảnh, giấy tờ cần thiết</p>
                  </div>
                  <button
                      class="expand-btn"
                      @click.stop="toggleStep(2)"
                  >
                    <i :class="expandedSteps[2] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                  </button>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedSteps[2]" class="step-detail">
                    Chuẩn bị sẵn giấy chứng nhận quyền sử dụng đất, sổ đỏ, hình ảnh tài sản từ nhiều góc độ.
                  </div>
                </transition>
              </div>

              <div
                  class="step"
                  :class="{ 'expanded': expandedSteps[3] }"
                  @click="toggleStep(3)"
              >
                <div class="step-main">
                  <div class="step-number">Bước 4</div>
                  <div class="step-content">
                    <p class="step-title">Kiểm tra thông tin</p>
                    <p class="step-action">Xác nhận lại thông tin cá nhân và địa chỉ email</p>
                  </div>
                  <button
                      class="expand-btn"
                      @click.stop="toggleStep(3)"
                  >
                    <i :class="expandedSteps[3] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                  </button>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedSteps[3]" class="step-detail">
                    Kiểm tra kỹ thông tin liên hệ, đặc biệt là email vì kết quả sẽ được gửi đến địa chỉ này.
                  </div>
                </transition>
              </div>

              <div
                  class="step"
                  :class="{ 'expanded': expandedSteps[4] }"
                  @click="toggleStep(4)"
              >
                <div class="step-main">
                  <div class="step-number">Bước 5</div>
                  <div class="step-content">
                    <p class="step-title">Thanh toán phí dịch vụ</p>
                    <p class="step-action">Thanh toán trực tuyến bằng QR code hoặc tại văn phòng</p>
                  </div>
                  <button
                      class="expand-btn"
                      @click.stop="toggleStep(4)"
                  >
                    <i :class="expandedSteps[4] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                  </button>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedSteps[4]" class="step-detail">
                    Hỗ trợ đa dạng phương thức: chuyển khoản, ví điện tử, thẻ tín dụng và QR code tiện lợi.
                  </div>
                </transition>
              </div>

              <div
                  class="step"
                  :class="{ 'expanded': expandedSteps[5] }"
                  @click="toggleStep(5)"
              >
                <div class="step-main">
                  <div class="step-number">Bước 6</div>
                  <div class="step-content">
                    <p class="step-title">Nhận kết quả định giá</p>
                    <p class="step-action">Theo dõi email hoặc truy cập website để nhận kết quả</p>
                  </div>
                  <button
                      class="expand-btn"
                      @click.stop="toggleStep(5)"
                  >
                    <i :class="expandedSteps[5] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                  </button>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedSteps[5]" class="step-detail">
                    Thời gian xử lý 3-5 ngày, kết quả bao gồm báo cáo chi tiết và có thể tải về bản PDF.
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import QuickFeeCalculator from './QuickFeeCalculator.vue'

const router = useRouter()

// Dữ liệu biểu phí
const feeRates = [
  { min: 1, max: 3, desiredValue: "1 - 3 tỷ", fee: 250000 },
  { min: 3, max: 5, desiredValue: "3 - 5 tỷ", fee: 300000 },
  { min: 5, max: 7, desiredValue: "5 - 7 tỷ", fee: 350000 },
  { min: 7, max: 10, desiredValue: "7 - 10 tỷ", fee: 400000 },
  { min: 10, max: 15, desiredValue: "10 - 15 tỷ", fee: 450000 },
  { min: 15, max: 20, desiredValue: "15 - 20 tỷ", fee: 450000 },
  { min: 20, max: 30, desiredValue: "20 - 30 tỷ", fee: 500000 },
  { min: 30, max: 50, desiredValue: "30 - 50 tỷ", fee: 550000 },
  { min: 50, max: 100, desiredValue: "50 - 100 tỷ", fee: 1200000 },
  { min: 100, max: null, desiredValue: "> 100 tỷ", fee: 1500000 }
]

// Biến lưu giá trị hiện tại từ component con
const currentValue = ref(5)

// Biến theo dõi hàng đang được hover
const hoveredRow = ref(null)

// Quản lý trạng thái expand của các bước
const expandedSteps = ref([false, false, false, false, false, false])

// Hàm toggle expand/collapse cho từng bước
const toggleStep = (index) => {
  expandedSteps.value[index] = !expandedSteps.value[index]
}

// Xử lý khi giá trị thay đổi từ component con
const handleValueChange = (value) => {
  currentValue.value = value
}

// Kiểm tra xem mức phí có đang active không - ĐÃ SỬA
const isRateActive = (rate) => {
  const value = currentValue.value

  if (rate.max === null) {
    // Mức "> 100 tỷ" - chỉ active khi value > 100
    return value > 100
  }

  // Xử lý đặc biệt cho mốc 50-100 tỷ - bao gồm cả 100
  if (rate.min === 50 && rate.max === 100) {
    return value >= rate.min && value <= rate.max
  }

  // Các mức khác - min <= value < max
  return value >= rate.min && value < rate.max
}

// Định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

// Điều hướng đến trang đăng nhập
const navigateToLogin = () => {
  router.push('/login-user')
}

// Điều hướng đến trang định giá
const navigateToValuation = () => {
  emit('navigateToValuation')
}

// Định nghĩa emit
const emit = defineEmits(['navigateToValuation'])
</script>

<style scoped>
.fee-calculator {
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.main-title {
  text-align: center;
  color: #1e3a8a;
  font-size: 2.5rem;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.main-title i {
  color: #3b82f6;
  font-size: 2.2rem;
}

.two-column-layout {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  align-items: stretch;
  min-height: 600px;
}

.left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 600px; /* Thêm chiều cao cố định */
}

.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Không giới hạn chiều cao để có thể cuộn */
}
/* Wrapper cho bảng phí để căn chỉnh chiều cao */
.fee-table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fee-table {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 20px 30px;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 20px 30px;
  border-bottom: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.highlight {
  background-color: #f8fafc;
}

.table-row.active {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border-left: 4px solid #3b82f6;
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
}

.table-row:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
  border-left: 4px solid #60a5fa;
}

.col-range, .col-fee {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
}

.col-range i {
  color: #3b82f6;
  font-size: 1.2rem;
}

.fee-amount {
  font-weight: 600;
  color: #1e3a8a;
  font-size: 1.2rem;
}

.active-indicator {
  color: #10b981;
  font-size: 1.3rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Hướng dẫn sử dụng */
.guide-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.guide-title {
  color: #1e3a8a;
  font-size: 1.8rem;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.guide-title i {
  color: #3b82f6;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}

/* Custom scrollbar cho steps container */
.steps-container::-webkit-scrollbar {
  width: 6px;
}

.steps-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.steps-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.steps-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  border-radius: 12px;
  background: #f8fafc;
  transition: all 0.3s ease;
  flex-shrink: 0;
  overflow: hidden;
  cursor: pointer;
}

.step.expanded {
  gap: 12px;
  padding: 20px;
  background: #f0f9ff;
}

.step:hover {
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.step-main {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  padding: 20px;
  width: 100%;
}

.step.expanded .step-main {
  padding: 0;
}

.step-number {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  font-size: 0.9rem;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 600;
  color: #1e3a8a;
  font-size: 1.1rem;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.step-action {
  font-size: 0.95rem;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}

.expand-btn {
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-btn:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
}

.step-detail {
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
  padding: 12px 15px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
  margin: 0;
}

/* Animation cho step detail */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.slide-down-enter-from {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to {
  max-height: 200px;
  opacity: 1;
}

.slide-down-leave-from {
  max-height: 200px;
  opacity: 1;
}

.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Thêm animation cho nội dung chi tiết */
.step-detail {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.link {
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;
}

.link:hover {
  color: #1e3a8a;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .two-column-layout {
    flex-direction: column;
    min-height: auto;
  }

  .fee-table-wrapper {
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 10px;
  }

  .main-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 10px;
  }

  .col-range, .col-fee {
    justify-content: center;
  }

  .guide-container {
    padding: 20px;
  }

  .guide-title {
    font-size: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .step-main {
    flex-direction: column;
    text-align: center;
    gap: 10px;
    padding: 15px;
  }

  .step.expanded .step-main {
    padding: 0;
  }

  .step-number {
    align-self: center;
  }

  .step.expanded {
    padding: 15px;
  }

  .fee-table-wrapper {
    min-height: 400px;
  }

  .expand-btn {
    align-self: center;
  }
}
</style>