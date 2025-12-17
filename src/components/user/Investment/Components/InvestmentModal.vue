<template>
  <div class="modal-overlay" v-if="visible" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header sticky -->
      <div class="modal-header sticky-header">
        <h2 class="modal-title">{{ config.modalTitle }}</h2>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Content scrollable -->
      <div class="modal-body custom-scrollbar">
        <!-- Thông tin dự án -->
        <div class="project-info">
          <h3 class="project-name">{{ projectData.title }}</h3>
          <div class="project-details">
            <div class="detail-item">
              <i class="fas fa-clock"></i>
              <span>{{ config.labels.timeLeft }}: {{ projectData.timeLeft }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-money-bill-wave"></i>
              <span>{{ config.labels.totalCapital }}: {{ formatCurrency(projectData.totalCapital) }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-chart-line"></i>
              <span>{{ config.labels.progress }}: {{ projectData.progress }}%</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-users"></i>
              <span>{{ projectData.contributors }} {{ config.labels.contributors }}</span>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="progress-section">
            <div class="progress-info">
              <span>{{ config.labels.fundingProgress }}</span>
              <span>{{ projectData.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div
                  class="progress-fill"
                  :style="{ width: projectData.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Chọn gói đầu tư -->
        <div class="investment-section">
          <div class="investment-header">
            <h3 class="section-title">{{ config.labels.choosePackage }}</h3>

            <div class="format-toggle">
              <span class="toggle-label">{{ config.labels.displayFormat }}: </span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="useShortFormat">
                <span class="slider"></span>
              </label>
              <span class="toggle-label">{{ useShortFormat ? config.labels.wordFormat : config.labels.numberFormat }}</span>
            </div>
          </div>

          <div class="packages-grid">
            <div
                v-for="(pkg, index) in packagesData"
                :key="index"
                class="package-card"
                :class="{ 'selected': selectedPackage === index }"
                @click="selectPackage(index)"
            >
              <div class="package-header">
                <h4 class="package-name">{{ packagesText[index] }}</h4>
                <div class="checkmark" v-if="selectedPackage === index">
                  <i class="fas fa-check"></i>
                </div>
              </div>
              <div class="package-details">
                <div class="package-item">
                  <span class="label">{{ config.labels.investmentPackage }}:</span>
                  <span class="value">{{ formatCurrency(pkg.goiDauTu, useShortFormat) }}</span>
                </div>
                <div class="package-item">
                  <span class="label">{{ config.labels.ownershipPercentage }}:</span>
                  <span class="value highlight">{{ pkg.phanTramGoi }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Thông tin thanh toán -->
        <div class="payment-section" v-if="selectedPackage !== null">
          <h3 class="section-title">{{ config.labels.paymentInfo }}</h3>
          <div class="payment-summary">
            <div class="summary-item">
              <span class="label">{{ config.labels.selectedPackage }}:</span>
              <span class="value">{{ packagesText[selectedPackage] }}</span>
            </div>
            <div class="summary-item">
              <span class="label">{{ config.labels.contributionAmount }}:</span>
              <span class="value highlight">{{ formatCurrency(packagesData[selectedPackage].goiDauTu) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">{{ config.labels.ownershipRate }}:</span>
              <span class="value">{{ packagesData[selectedPackage].phanTramGoi }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="closeModal">
          <i class="fas fa-times"></i>
          {{ config.buttons.cancel }}
        </button>
        <button
            class="btn btn-primary"
            :disabled="selectedPackage === null"
            @click="handlePayment"
        >
          <i class="fas fa-credit-card"></i>
          {{ config.buttons.payment }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch, computed} from 'vue'

// Config object
let config = {
  modalTitle: 'Góp vốn đầu tư',
  labels: {
    timeLeft: 'Thời gian còn lại',
    totalCapital: 'Tổng vốn cần',
    progress: 'Tiến độ',
    contributors: 'người đã góp',
    fundingProgress: 'Tiến độ góp vốn',
    choosePackage: 'Chọn gói đầu tư',
    displayFormat: 'Hiển thị số',
    wordFormat: 'Chữ viết',
    numberFormat: 'Số nguyên',
    investmentPackage: 'Gói đầu tư',
    ownershipPercentage: 'Phần trăm sở hữu',
    paymentInfo: 'Thông tin thanh toán',
    selectedPackage: 'Gói đã chọn',
    contributionAmount: 'Số tiền góp',
    ownershipRate: 'Tỷ lệ sở hữu'
  },
  buttons: {
    cancel: 'Hủy bỏ',
    payment: 'Thanh toán ngay'
  },
  styles: {
    colors: {
      primary: '#2563eb',
      primaryDark: '#031358',
      secondary: '#f1f5f9',
      success: '#10b981',
      successDark: '#059669',
      danger: '#dc2626',
      textPrimary: '#031358',
      textSecondary: '#475569',
      textMuted: '#64748b',
      border: '#e2e8f0',
      background: '#f8faff',
      white: '#ffffff'
    },
    gradients: {
      header: 'linear-gradient(135deg, #031358, #2563eb)',
      button: 'linear-gradient(135deg, #2563eb, #031358)',
      buttonHover: 'linear-gradient(135deg, #1e40af, #031358)',
      progressBar: 'linear-gradient(90deg, #2563eb, #031358)',
      selectedPackage: 'linear-gradient(135deg, #f0f7ff, #e6f0ff)'
    },
    sizes: {
      borderRadius: '12px',
      borderRadiusSmall: '8px',
      borderRadiusRound: '50%',
      fontSizeTitle: '1.5rem',
      fontSizeSection: '1.2rem',
      fontSizeNormal: '0.95rem',
      fontSizeSmall: '0.85rem'
    },
    shadows: {
      modal: '0 20px 60px rgba(0, 0, 0, 0.3)',
      button: '0 4px 12px rgba(37, 99, 235, 0.3)',
      packageHover: '0 4px 12px rgba(37, 99, 235, 0.1)',
      packageSelected: '0 4px 15px rgba(37, 99, 235, 0.15)'
    }
  }
}

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  projectData: {
    type: Object,
    default: () => ({
      title: '',
      timeLeft: '',
      totalCapital: 0,
      progress: 0,
      contributors: 0
    })
  },
  sectionData: Object
})


if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã lấy data từ cha");
}
// Emits
const emit = defineEmits(['close', 'payment'])

// State
const selectedPackage = ref(null)
const useShortFormat = ref(false)

// Dữ liệu gói đầu tư
const packagesData = ref([
  {
    goiDauTu: 20000000,
    phanTramGoi: 1.0
  },
  {
    goiDauTu: 30000000,
    phanTramGoi: 1.5
  },
  {
    goiDauTu: 50000000,
    phanTramGoi: 2.5
  },
  {
    goiDauTu: 70000000,
    phanTramGoi: 3.5
  },
  {
    goiDauTu: 100000000,
    phanTramGoi: 5.0
  },
  {
    goiDauTu: 150000000,
    phanTramGoi: 7.5
  },
  {
    goiDauTu: 200000000,
    phanTramGoi: 10.0
  },
  {
    goiDauTu: 300000000,
    phanTramGoi: 15.0
  }
])

// Text hiển thị cho các gói
const packagesText = computed(() => {
  return packagesData.value.map(pkg => {
    const amountInMillions = pkg.goiDauTu / 1000000;
    return `Gói ${amountInMillions} triệu - ${pkg.phanTramGoi}%`;
  });
})

// Theo dõi sự thay đổi của visible prop
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // Thêm class để ngăn cuộn
    document.body.classList.add('body-no-scroll')
  } else {
    // Xóa class khi đóng modal
    document.body.classList.remove('body-no-scroll')
  }
})

// Methods
const closeModal = () => {
  selectedPackage.value = null
  document.body.classList.remove('body-no-scroll') // Đảm bảo xóa class khi đóng modal
  emit('close')
}

const selectPackage = (index) => {
  selectedPackage.value = index
}

const handlePayment = () => {
  if (selectedPackage.value !== null) {
    const paymentData = {
      project: props.projectData.title,
      package: packagesText.value[selectedPackage.value],
      amount: packagesData.value[selectedPackage.value].goiDauTu,
      ownership: packagesData.value[selectedPackage.value].phanTramGoi
    }
    emit('payment', paymentData)
  }
}

const formatCurrency = (amount, useShortFormat = false) => {
  if (useShortFormat) {
    let result;
    if (amount >= 1000000000) {
      result = (amount / 1000000000).toFixed(1);
      result = parseFloat(result) + ' tỷ';
    } else if (amount >= 1000000) {
      result = (amount / 1000000).toFixed(1);
      result = parseFloat(result) + ' triệu';
    } else if (amount >= 1000) {
      result = (amount / 1000).toFixed(1);
      result = parseFloat(result) + ' nghìn';
    } else {
      result = amount.toString();
    }
    return result.replace('.', ',');
  } else {
    return amount.toLocaleString('vi-VN');
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: v-bind('config.styles.sizes.borderRadius');
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: v-bind('config.styles.shadows.modal');
}

/* Sticky Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid v-bind('config.styles.colors.border');
  background: v-bind('config.styles.gradients.header');
  color: v-bind('config.styles.colors.white');
  border-radius: v-bind('config.styles.sizes.borderRadius') v-bind('config.styles.sizes.borderRadius') 0 0;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-title {
  margin: 0;
  font-size: v-bind('config.styles.sizes.fontSizeTitle');
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: v-bind('config.styles.colors.white');
  font-size: 1.3rem;
  cursor: pointer;
  padding: 5px;
  border-radius: v-bind('config.styles.sizes.borderRadiusRound');
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Scrollable Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

/* Custom Scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: v-bind('config.styles.gradients.progressBar');
  border-radius: 4px;
  border: 2px solid #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1e40af, #031358);
}

/* Project Info */
.project-info {
  padding: 25px 30px;
  border-bottom: 1px solid v-bind('config.styles.colors.border');
}

.project-name {
  color: v-bind('config.styles.colors.textPrimary');
  margin: 0 0 15px 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.project-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: v-bind('config.styles.colors.textSecondary');
  font-size: v-bind('config.styles.sizes.fontSizeNormal');
}

.detail-item i {
  color: v-bind('config.styles.colors.primary');
  width: 16px;
}

/* Progress Bar */
.progress-section {
  background: v-bind('config.styles.colors.background');
  padding: 15px;
  border-radius: v-bind('config.styles.sizes.borderRadiusSmall');
  border-left: 4px solid v-bind('config.styles.colors.primary');
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: v-bind('config.styles.colors.textSecondary');
}

.progress-bar {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: v-bind('config.styles.gradients.progressBar');
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Investment Section */
.investment-section {
  padding: 25px 30px;
  border-bottom: 1px solid v-bind('config.styles.colors.border');
}

.investment-header {
  display: flex;
  justify-content: space-between;
}

.section-title {
  color: v-bind('config.styles.colors.textPrimary');
  margin: 0 0 20px 0;
  font-size: v-bind('config.styles.sizes.fontSizeSection');
  font-weight: 600;
}

.format-toggle {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.toggle-label {
  font-weight: 500;
  color: v-bind('config.styles.colors.textSecondary');
  font-size: 0.9rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: v-bind('config.styles.colors.primary');
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.package-card {
  border: 2px solid v-bind('config.styles.colors.border');
  border-radius: v-bind('config.styles.sizes.borderRadiusSmall');
  padding: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: v-bind('config.styles.colors.white');
}

.package-card:hover {
  border-color: v-bind('config.styles.colors.primary');
  transform: translateY(-2px);
  box-shadow: v-bind('config.styles.shadows.packageHover');
}

.package-card.selected {
  border-color: v-bind('config.styles.colors.primary');
  background: v-bind('config.styles.gradients.selectedPackage');
  box-shadow: v-bind('config.styles.shadows.packageSelected');
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.package-name {
  color: v-bind('config.styles.colors.textPrimary');
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.checkmark {
  background: v-bind('config.styles.colors.success');
  color: v-bind('config.styles.colors.white');
  border-radius: v-bind('config.styles.sizes.borderRadiusRound');
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.package-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.package-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.package-item .label {
  color: v-bind('config.styles.colors.textMuted');
  font-size: v-bind('config.styles.sizes.fontSizeSmall');
}

.package-item .value {
  color: v-bind('config.styles.colors.textPrimary');
  font-weight: 500;
  font-size: 0.9rem;
}

.package-item .value.highlight {
  color: v-bind('config.styles.colors.successDark');
  font-weight: 600;
}

/* Payment Section */
.payment-section {
  padding: 25px 30px;
  border-bottom: 1px solid v-bind('config.styles.colors.border');
}

.payment-summary {
  background: v-bind('config.styles.colors.background');
  padding: 20px;
  border-radius: v-bind('config.styles.sizes.borderRadiusSmall');
  border-left: 4px solid v-bind('config.styles.colors.primary');
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-item .label {
  color: v-bind('config.styles.colors.textSecondary');
  font-weight: 500;
}

.summary-item .value {
  color: v-bind('config.styles.colors.textPrimary');
  font-weight: 600;
}

.summary-item .value.highlight {
  color: v-bind('config.styles.colors.danger');
  font-size: 1.1rem;
}

/* Modal Actions */
.modal-actions {
  padding: 25px 30px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  background: v-bind('config.styles.colors.background');
  border-radius: 0 0 v-bind('config.styles.sizes.borderRadius') v-bind('config.styles.sizes.borderRadius');
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: v-bind('config.styles.sizes.borderRadiusSmall');
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: v-bind('config.styles.sizes.fontSizeNormal');
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-secondary {
  background: v-bind('config.styles.colors.secondary');
  color: v-bind('config.styles.colors.textSecondary');
}

.btn-secondary:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.btn-primary {
  background: v-bind('config.styles.gradients.button');
  color: v-bind('config.styles.colors.white');
}

.btn-primary:hover:not(:disabled) {
  background: v-bind('config.styles.gradients.buttonHover');
  transform: translateY(-1px);
  box-shadow: v-bind('config.styles.shadows.button');
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    margin: 10px;
    max-height: 95vh;
  }

  .modal-header,
  .project-info,
  .investment-section,
  .payment-section,
  .modal-actions {
    padding: 20px;
  }

  .packages-grid {
    grid-template-columns: 1fr;
  }

  .project-details {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .format-toggle {
    justify-content: center;
  }

  .package-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>