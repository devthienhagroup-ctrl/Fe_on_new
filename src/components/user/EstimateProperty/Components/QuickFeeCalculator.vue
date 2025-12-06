<template>
  <div class="qfc-quick-calculator">
    <h2 class="qfc-calculator-title">
      <i class="fas fa-calculator"></i>
      Tính nhanh phí định giá sơ bộ
    </h2>

    <div class="qfc-calculator-content">
      <div class="qfc-input-section">
        <div class="qfc-input-group">
          <label for="propertyValue">
            <i class="fas fa-home"></i>
            Giá trị tài sản (tỷ VNĐ):
          </label>
          <div class="qfc-input-wrapper">
            <input
                type="number"
                id="propertyValue"
                v-model="inputValue"
                @input="handleInputChange"
                min="1"
                step="0.1"
                class="qfc-value-input"
            >
            <span class="qfc-unit">tỷ</span>
          </div>
        </div>
      </div>

      <div class="qfc-slider-section">
        <div class="qfc-slider-group">
          <label>Kéo để điều chỉnh giá mong muốn (tỷ VNĐ):</label>
          <div class="qfc-slider-container">
            <input
                type="range"
                :value="inputValue"
                @input="handleSliderChange"
                min="1"
                max="150"
                step="0.1"
                class="qfc-value-slider"
                :style="sliderProgressStyle"
            >
            <div class="qfc-slider-labels">
              <div
                  v-for="value in sliderQuickValues"
                  :key="value"
                  class="qfc-slider-label-value"
                  :class="{ active: inputValue === value }"
                  @click="selectQuickValue(value)"
                  :style="{ left: calculatePosition(value) + '%' }"
              >
                {{ value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="qfc-result-section">
      <div class="qfc-result-card">
        <div class="qfc-result-icon">
          <i class="fas fa-money-bill-wave"></i>
        </div>
        <div class="qfc-result-content">
          <h3>Phí dịch vụ ước tính:</h3>
          <div class="qfc-fee-result">{{ formatCurrency(calculatedFee) }} VNĐ</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  feeRates: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['valueChanged'])

const inputValue = ref(5)
const calculatedFee = ref(350000)
const quickValues = ref([1, 5, 10, 20, 50, 100])

// Thêm 150 vào các giá trị hiển thị trên slider
const sliderQuickValues = computed(() => [...quickValues.value, 150])

// Tính toán progress cho slider background
const sliderProgressStyle = computed(() => {
  const progress = ((inputValue.value - 1) / (150 - 1)) * 100
  return {
    '--slider-progress': `${progress}%`
  }
})

const calculatePosition = (value) => {
  const min = 1
  const max = 150
  return ((value - min) / (max - min)) * 100
}

const calculateFee = (value) => {
  const numericValue = parseFloat(value)

  // Tìm mức phí phù hợp - ĐÃ SỬA
  const rate = props.feeRates.find(rate => {
    if (rate.max === null) {
      // Mức "> 100 tỷ" - chỉ áp dụng khi value > 100
      return numericValue > 100
    }

    // Xử lý đặc biệt cho mốc 50-100 tỷ - bao gồm cả 100
    if (rate.min === 50 && rate.max === 100) {
      return numericValue >= rate.min && numericValue <= rate.max
    }

    // Các mức khác - min <= value < max
    return numericValue >= rate.min && numericValue < rate.max
  })

  return rate ? rate.fee : 0
}

const handleInputChange = (event) => {
  const value = parseFloat(event.target.value)
  if (!isNaN(value) && value >= 1) {
    inputValue.value = value
    calculatedFee.value = calculateFee(value)
    emit('valueChanged', value)
  }
}

const handleSliderChange = (event) => {
  inputValue.value = parseFloat(event.target.value)
  calculatedFee.value = calculateFee(inputValue.value)
  emit('valueChanged', inputValue.value)
}

const selectQuickValue = (value) => {
  inputValue.value = value
  calculatedFee.value = calculateFee(value)
  emit('valueChanged', value)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount)
}

// Tính toán phí ban đầu
calculatedFee.value = calculateFee(inputValue.value)
</script>

<style scoped>
.qfc-quick-calculator {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  color: white;
}

.qfc-calculator-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.6rem;
  margin-bottom: 20px;
}

.qfc-calculator-content {
  display: flex;
  gap: 20px;
  align-items: start;
}

.qfc-input-section {
  width: 20%;
}

.qfc-slider-section {
  width: 80%;
}

.qfc-result-section {
  width: 100%;
  margin-top: 20px;
}

.qfc-input-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 0.95rem;
}

.qfc-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.qfc-value-input {
  width: 100%;
  padding: 10px 40px 10px 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.qfc-unit {
  position: absolute;
  right: 12px;
  color: #666;
  font-weight: 600;
  font-size: 0.9rem;
}

.qfc-slider-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 0.95rem;
}

.qfc-slider-container {
  position: relative;
  width: 100%;
  padding: 0 16px; /* Thêm padding để cân bằng với thumb của slider */
}

.qfc-value-slider {
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: linear-gradient(
      to right,
      #ffffff var(--slider-progress, 0%),
      rgba(255, 255, 255, 0.3) var(--slider-progress, 0%)
  );
  outline: none;
  margin: 15px 0;
  -webkit-appearance: none;
}

/* Thumb cho Webkit browsers (Chrome, Safari, Edge) */
.qfc-value-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: url('/imgs/logoTHG.png') center/contain no-repeat;
  background-color: #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Thumb cho Firefox */
.qfc-value-slider::-moz-range-thumb {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: url('/imgs/logoTHG.png') center/contain no-repeat;
  background-color: #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

/* Track cho Firefox */
.qfc-value-slider::-moz-range-track {
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
}

.qfc-value-slider::-moz-range-progress {
  background: #ffffff;
  height: 6px;
  border-radius: 5px;
}

/* Thumb cho Edge */
.qfc-value-slider::-ms-thumb {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: url('/imgs/logoTHG.png') center/contain no-repeat;
  background-color: #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.qfc-slider-labels {
  position: relative;
  width: calc(100% - 32px); /* Trừ đi kích thước thumb */
  margin: 0 auto;
  height: 20px;
}

.qfc-slider-label-value {
  position: absolute;
  transform: translateX(-50%);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.qfc-slider-label-value:hover {
  background: rgba(255, 255, 255, 0.2);
}

.qfc-slider-label-value.active {
  background: rgba(255, 255, 255, 0.9);
  color: #1e40af;
  font-weight: 600;
}

.qfc-result-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.qfc-result-icon {
  font-size: 1.5rem;
  color: #ffffff;
}

.qfc-result-content {
  display: flex;
}

.qfc-result-content h3 {
  margin: auto;
  font-size: 1rem;
  opacity: 0.9;
}

.qfc-fee-result {
  font-size: 1.6rem;
  font-weight: bold;
  color: #ffffff;
  margin-left: 5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .qfc-calculator-content {
    flex-direction: column;
    gap: 15px;
  }

  .qfc-input-section,
  .qfc-slider-section {
    width: 100%;
  }

  .qfc-quick-calculator {
    padding: 20px;
  }

  .qfc-result-card {
    flex-direction: row;
    text-align: left;
  }
}

@media (max-width: 480px) {
  .qfc-slider-label-value {
    font-size: 0.7rem;
  }

  .qfc-result-card {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .qfc-value-slider::-webkit-slider-thumb {
    width: 28px;
    height: 28px;
  }

  .qfc-value-slider::-moz-range-thumb {
    width: 28px;
    height: 28px;
  }

  .qfc-value-slider::-ms-thumb {
    width: 28px;
    height: 28px;
  }
}
</style>