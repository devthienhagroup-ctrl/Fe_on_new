<template>
  <div class="fee-calculator">
    <div class="container">
      <!-- Hiển thị loading khi chưa có dữ liệu -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <!-- Hiển thị nội dung khi đã có dữ liệu -->
      <template v-else>
        <h1 class="main-title">
          {{ pageTitle }}
        </h1>

        <!-- Component tính phí nhanh -->
        <QuickFeeCalculator
            v-if="hasFeeRates && hasSectionData"
            :feeRates="dynamicFeeRates"
            :config="sectionDataForChildParsed"
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
                    v-for="(rate, index) in dynamicFeeRates"
                    :key="index"
                    class="table-row"
                    :class="{
                      'active': isRateActive(rate),
                      'highlight': index % 2 === 0
                    }"
                    :style="getRowStyle(index, rate)"
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
                {{ guideTitle }}
              </h2>

              <div class="steps-container">
                <!-- Bước 1-6 -->
                <div
                    v-for="(step, index) in steps"
                    :key="index"
                    class="step"
                    :class="{ 'expanded': expandedSteps[index] }"
                    @click="toggleStep(index)"
                >
                  <div class="step-main">
                    <div class="step-number">{{ step.number }}</div>
                    <div class="step-content">
                      <p class="step-title">{{ step.title }}</p>
                      <p class="step-action" v-if="step.action">{{ step.action }}</p>
                      <!-- Các link đặc biệt -->
                      <p v-if="index === 0" class="step-action">
                        Nếu chưa có tài khoản hãy truy cập và tạo tài khoản mới
                        <span class="link" @click.stop="navigateToLogin">tại đây</span>.
                      </p>
                      <p v-if="index === 1" class="step-action">
                        Nhấn định giá ngay
                        <span class="link" @click.stop="navigateToValuation">tại đây</span>
                      </p>
                    </div>
                    <button
                        class="expand-btn"
                        @click.stop="toggleStep(index)"
                    >
                      <i :class="expandedSteps[index] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                    </button>
                  </div>
                  <transition name="slide-down">
                    <div v-if="expandedSteps[index]" class="step-detail">
                      {{ step.detail }}
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import QuickFeeCalculator from './QuickFeeCalculator.vue'

const router = useRouter()

const props = defineProps({
  sectionData: String,
  sectionDataForChild: String
})

// =============== STATE ===============
const loading = ref(true)
const dynamicData = ref(null)

// Biến lưu giá trị hiện tại từ component con
const currentValue = ref(5)
const hoveredRow = ref(null)
const expandedSteps = ref([])

// =============== COMPUTED ===============
const hasData = computed(() => dynamicData.value !== null)
const hasFeeRates = computed(() => dynamicData.value?.feeRates?.length > 0)
const hasSectionData = computed(() => props.sectionDataForChild !== undefined)

const pageTitle = computed(() => dynamicData.value?.pageTitle || 'Biểu phí định giá')
const dynamicFeeRates = computed(() => dynamicData.value?.feeRates || [])
const guideTitle = computed(() => dynamicData.value?.guideTitle || 'Hướng dẫn sử dụng')
const steps = computed(() => dynamicData.value?.guideConfig.steps || [])
const styleConfig = computed(() => dynamicData.value?.styleConfig || getDefaultStyleConfig())
const links = computed(() => dynamicData.value?.links || getDefaultLinks())

const sectionDataForChildParsed = computed(() => {
  try {
    return props.sectionDataForChild ? JSON.parse(props.sectionDataForChild) : {}
  } catch (e) {
    console.error('Lỗi khi parse sectionDataForChild:', e)
    return {}
  }
})

// =============== LIFECYCLE & WATCHERS ===============
onMounted(() => {
  initializeData()
})

// Theo dõi thay đổi của props
watch(() => props.sectionData, (newVal) => {
  if (newVal) {
    initializeData()
  }
})

watch(steps, (newSteps) => {
  // Reset expanded steps khi steps thay đổi
  expandedSteps.value = Array(newSteps.length).fill(false)
}, { immediate: true })

// =============== METHODS ===============
const initializeData = () => {

  try {
    if (props.sectionData) {
      // Nhận dữ liệu từ cha
      dynamicData.value = JSON.parse(props.sectionData)
      console.log("✅ Đã nhận dữ liệu từ component cha:", dynamicData.value)
      console.log(dynamicData.value.guideConfig.steps)
      loading.value = true
    } else {
      // Dữ liệu mặc định
      dynamicData.value = getDefaultData()
      console.log("ℹ️ Sử dụng dữ liệu mặc định")
    }
  } catch (error) {
    console.error("❌ Lỗi khi parse dữ liệu:", error)
    dynamicData.value = getDefaultData()
  } finally {
    loading.value = false
  }
}

const getDefaultData = () => ({
  pageTitle: "Biểu phí định giá sơ bộ",
  feeRates: [
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
  ],
  guideTitle: "Hướng dẫn sử dụng công cụ định giá",
  steps: [
    {
      number: "Bước 1",
      title: "Đăng ký tài khoản chủ nhà",
      detail: "Quá trình đăng ký đơn giản, chỉ cần cung cấp email, số điện thoại và thông tin cá nhân cơ bản."
    },
    {
      number: "Bước 2",
      title: "Truy cập trang định giá",
      detail: "Giao diện thân thiện, dễ sử dụng với các bước hướng dẫn rõ ràng và xem trước biểu phí."
    },
    {
      number: "Bước 3",
      title: "Thêm thông tin tài sản",
      action: "Điền form thông tin và cung cấp hình ảnh, giấy tờ cần thiết",
      detail: "Chuẩn bị sẵn giấy chứng nhận quyền sử dụng đất, sổ đỏ, hình ảnh tài sản từ nhiều góc độ."
    },
    {
      number: "Bước 4",
      title: "Kiểm tra thông tin",
      action: "Xác nhận lại thông tin cá nhân và địa chỉ email",
      detail: "Kiểm tra kỹ thông tin liên hệ, đặc biệt là email vì kết quả sẽ được gửi đến địa chỉ này."
    },
    {
      number: "Bước 5",
      title: "Thanh toán phí dịch vụ",
      action: "Thanh toán trực tuyến bằng QR code hoặc tại văn phòng",
      detail: "Hỗ trợ đa dạng phương thức: chuyển khoản, ví điện tử, thẻ tín dụng và QR code tiện lợi."
    },
    {
      number: "Bước 6",
      title: "Nhận kết quả định giá",
      action: "Theo dõi email hoặc truy cập website để nhận kết quả",
      detail: "Thời gian xử lý 3-5 ngày, kết quả bao gồm báo cáo chi tiết và có thể tải về bản PDF."
    }
  ],
  styleConfig: getDefaultStyleConfig(),
  links: getDefaultLinks()
})

const getDefaultStyleConfig = () => ({
  evenRowBgColor: "#f8fafc",
  oddRowBgColor: "#ffffff",
  activeGradientStart: "#dbeafe",
  activeGradientEnd: "#eff6ff",
  activeBorderColor: "#3b82f6",
  hoverBorderColor: "#60a5fa"
})

const getDefaultLinks = () => ({
  login: "/login-user",
  valuation: "/valuation"
})

const toggleStep = (index) => {
  expandedSteps.value[index] = !expandedSteps.value[index]
}

const getRowStyle = (index, rate) => {
  const styles = {}

  // Màu nền dựa trên index chẵn/lẻ
  if (index % 2 === 0) {
    styles.backgroundColor = styleConfig.value.evenRowBgColor
  } else {
    styles.backgroundColor = styleConfig.value.oddRowBgColor
  }

  return styles
}

const handleValueChange = (value) => {
  currentValue.value = value
}

const isRateActive = (rate) => {
  const value = currentValue.value

  if (rate.max === null) {
    return value > 100
  }

  if (rate.min === 50 && rate.max === 100) {
    return value >= rate.min && value <= rate.max
  }

  return value >= rate.min && value < rate.max
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

const navigateToLogin = () => {
  router.push(links.value.login)
}

const navigateToValuation = () => {
  emit('navigateToValuation')
}

const updateDynamicData = (newData) => {
  loading.value = true
  try {
    Object.assign(dynamicData.value, newData)
    console.log("✅ Đã cập nhật dữ liệu động:", newData)
  } finally {
    loading.value = false
  }
}

// =============== EXPOSE & EMITS ===============
const emit = defineEmits(['navigateToValuation'])

defineExpose({
  updateDynamicData
})

watch(steps, (newSteps) => {
  console.log('Steps data:', newSteps) // Thêm dòng này để debug
  // Reset expanded steps khi steps thay đổi
  expandedSteps.value = Array(newSteps.length).fill(false)
}, { immediate: true })
</script>


<style scoped>
/* Thêm CSS cho loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #1e3a8a;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Giữ nguyên tất cả CSS cũ từ đây trở xuống */
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
}

.right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

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
  /* Màu nền động được áp dụng qua inline style */
}

.table-row.active {
  background: linear-gradient(135deg, v-bind('styleConfig.activeGradientStart') 0%, v-bind('styleConfig.activeGradientEnd') 100%);
  border-left: 4px solid v-bind('styleConfig.activeBorderColor');
  transform: scale(1.02);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
}

.table-row:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
  border-left: 4px solid v-bind('styleConfig.hoverBorderColor');
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