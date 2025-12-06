<template>
  <div class="modal-overlay" v-if="visible" @click="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Header sticky -->
      <div class="modal-header sticky-header">
        <h2 class="modal-title">Góp vốn đầu tư</h2>
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
              <span>Thời gian còn lại: {{ projectData.timeLeft }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-money-bill-wave"></i>
              <span>Tổng vốn cần: {{ formatCurrency(projectData.totalCapital) }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-chart-line"></i>
              <span>Tiến độ: {{ projectData.progress }}%</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-users"></i>
              <span>{{ projectData.contributors }} người đã góp</span>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="progress-section">
            <div class="progress-info">
              <span>Tiến độ góp vốn</span>
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
            <h3 class="section-title">Chọn gói đầu tư</h3>

            <div class="format-toggle">
              <span class="toggle-label">Hiển thị số: </span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="useShortFormat">
                <span class="slider"></span>
              </label>
              <span class="toggle-label">{{ useShortFormat ? 'Chữ viết' : 'Số nguyên' }}</span>
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
                  <span class="label">Gói đầu tư:</span>
                  <span class="value">{{ formatCurrency(pkg.goiDauTu, useShortFormat) }}</span>
                </div>
                <div class="package-item">
                  <span class="label">Phần trăm sở hữu:</span>
                  <span class="value highlight">{{ pkg.phanTramGoi }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Thông tin thanh toán -->
        <div class="payment-section" v-if="selectedPackage !== null">
          <h3 class="section-title">Thông tin thanh toán</h3>
          <div class="payment-summary">
            <div class="summary-item">
              <span class="label">Gói đã chọn:</span>
              <span class="value">{{ packagesText[selectedPackage] }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Số tiền góp:</span>
              <span class="value highlight">{{ formatCurrency(packagesData[selectedPackage].goiDauTu) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Tỷ lệ sở hữu:</span>
              <span class="value">{{ packagesData[selectedPackage].phanTramGoi }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="closeModal">
          <i class="fas fa-times"></i>
          Hủy bỏ
        </button>
        <button
            class="btn btn-primary"
            :disabled="selectedPackage === null"
            @click="handlePayment"
        >
          <i class="fas fa-credit-card"></i>
          Thanh toán ngay
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, defineProps, defineEmits, watch} from 'vue'

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
  }
})

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
const packagesText = ref([
  "Gói 20 triệu - 1%",
  "Gói 30 triệu - 1,5%",
  "Gói 50 triệu - 2,5%",
  "Gói 70 triệu - 3,5%",
  "Gói 100 triệu - 5%",
  "Gói 150 triệu - 7,5%",
  "Gói 200 triệu - 10%",
  "Gói 300 triệu - 15%"
])



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
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Sticky Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #031358, #2563eb);
  color: white;
  border-radius: 12px 12px 0 0;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
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
  background: linear-gradient(135deg, #2563eb, #031358);
  border-radius: 4px;
  border: 2px solid #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1e40af, #031358);
}

/* Project Info */
.project-info {
  padding: 25px 30px;
  border-bottom: 1px solid #e2e8f0;
}

.project-name {
  color: #031358;
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
  color: #475569;
  font-size: 0.95rem;
}

.detail-item i {
  color: #2563eb;
  width: 16px;
}

/* Progress Bar */
.progress-section {
  background: #f8faff;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #2563eb;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #475569;
}

.progress-bar {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #031358);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Investment Section */
.investment-section {
  padding: 25px 30px;
  border-bottom: 1px solid #e2e8f0;
}

.investment-header {
  display: flex;
  justify-content: space-between;
}

.section-title {
  color: #031358;
  margin: 0 0 20px 0;
  font-size: 1.2rem;
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
  color: #475569;
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
  background-color: #2563eb;
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
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.package-card:hover {
  border-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.package-card.selected {
  border-color: #2563eb;
  background: linear-gradient(135deg, #f0f7ff, #e6f0ff);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.15);
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.package-name {
  color: #031358;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.checkmark {
  background: #10b981;
  color: white;
  border-radius: 50%;
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
  color: #64748b;
  font-size: 0.85rem;
}

.package-item .value {
  color: #031358;
  font-weight: 500;
  font-size: 0.9rem;
}

.package-item .value.highlight {
  color: #059669;
  font-weight: 600;
}

/* Payment Section */
.payment-section {
  padding: 25px 30px;
  border-bottom: 1px solid #e2e8f0;
}

.payment-summary {
  background: #f8faff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2563eb;
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
  color: #475569;
  font-weight: 500;
}

.summary-item .value {
  color: #031358;
  font-weight: 600;
}

.summary-item .value.highlight {
  color: #dc2626;
  font-size: 1.1rem;
}

/* Modal Actions */
.modal-actions {
  padding: 25px 30px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  background: #f8faff;
  border-radius: 0 0 12px 12px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #031358);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1e40af, #031358);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
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