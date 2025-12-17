<template>
  <div
      class="qfc-quick-calculator"
      :style="containerStyles"
  >
    <h2 class="qfc-calculator-title">
      <i :class="config.calculatorConfig.icon"></i>
      {{ config.calculatorConfig.title }}
    </h2>

    <div class="qfc-calculator-content">
      <div class="qfc-input-section">
        <div class="qfc-input-group">
          <label for="propertyValue">
            <i :class="config.inputConfig.icon"></i>
            {{ config.inputConfig.label }}
          </label>
          <div class="qfc-input-wrapper">
            <input
                type="number"
                id="propertyValue"
                v-model="inputValue"
                @input="handleInputChange"
                :min="config.calculatorConfig.minValue"
                :max="config.calculatorConfig.maxValue"
                :step="config.calculatorConfig.step"
                class="qfc-value-input"
                :placeholder="config.inputConfig.placeholder"
            >
            <span class="qfc-unit">{{ config.calculatorConfig.unit }}</span>
          </div>
        </div>
      </div>

      <div class="qfc-slider-section">
        <div class="qfc-slider-group">
          <label>{{ config.sliderConfig.label }}</label>
          <div class="qfc-slider-container">
            <input
                type="range"
                :value="inputValue"
                @input="handleSliderChange"
                :min="config.calculatorConfig.minValue"
                :max="config.calculatorConfig.maxValue"
                :step="config.calculatorConfig.step"
                class="qfc-value-slider"
                :style="sliderStyles"
            >
            <div
                v-if="config.sliderConfig.showQuickValues"
                class="qfc-slider-labels"
            >
              <div
                  v-for="value in sliderQuickValues"
                  :key="value"
                  class="qfc-slider-label-value"
                  :class="{ active: inputValue === value }"
                  @click="selectQuickValue(value)"
                  :style="getLabelPosition(value)"
              >
                {{ value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="qfc-result-section">
      <div
          class="qfc-result-card"
          :style="resultCardStyles"
      >
        <div class="qfc-result-icon">
          <i :class="config.resultConfig.icon"></i>
        </div>
        <div class="qfc-result-content">
          <h3>{{ config.resultConfig.title }}</h3>
          <div class="qfc-fee-result">
            {{ formatCurrency(calculatedFee) }}
            <span v-if="config.resultConfig.showCurrency">
              {{ config.calculatorConfig.currency }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

const props = defineProps({
  feeRates: {
    type: Array,
    required: true,
    default: () => []
  },
  config: {
    type: Object,
    required: true,
    default: () => ({
      calculatorConfig: {
        title: 'Tính nhanh phí định giá sơ bộ',
        icon: 'fas fa-calculator',
        minValue: 1,
        maxValue: 150,
        step: 0.1,
        defaultValue: 5,
        quickValues: [1, 5, 10, 20, 50, 100],
        unit: 'tỷ',
        currency: 'VNĐ',
        locale: 'vi-VN'
      },
      inputConfig: {
        label: 'Giá trị tài sản (tỷ VNĐ):',
        icon: 'fas fa-home',
        placeholder: 'Nhập giá trị...'
      },
      sliderConfig: {
        label: 'Kéo để điều chỉnh giá mong muốn (tỷ VNĐ):',
        showQuickValues: true,
        thumbIcon: '/imgs/logoTHG.png',
        thumbSize: 32
      },
      resultConfig: {
        title: 'Phí dịch vụ ước tính:',
        icon: 'fas fa-money-bill-wave',
        showCurrency: true
      },
      styles: {
        gradientStart: '#3b82f6',
        gradientEnd: '#1e40af',
        primaryColor: '#ffffff',
        secondaryColor: 'rgba(255, 255, 255, 0.3)',
        cardBackground: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '20px',
        shadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
      }
    })
  }
})

const emit = defineEmits(['valueChanged'])

// Reactive state
const inputValue = ref(props.config.calculatorConfig.defaultValue)
const calculatedFee = ref(0)

// Computed properties
const sliderQuickValues = computed(() => [
  ...props.config.calculatorConfig.quickValues,
  props.config.calculatorConfig.maxValue
])

const containerStyles = computed(() => ({
  background: `linear-gradient(135deg, ${props.config.styles.gradientStart} 0%, ${props.config.styles.gradientEnd} 100%)`,
  borderRadius: props.config.styles.borderRadius,
  boxShadow: props.config.styles.shadow,
  color: props.config.styles.primaryColor
}))

const sliderStyles = computed(() => {
  const progress = ((inputValue.value - props.config.calculatorConfig.minValue) /
      (props.config.calculatorConfig.maxValue - props.config.calculatorConfig.minValue)) * 100

  return {
    '--slider-progress': `${progress}%`,
    '--thumb-size': `${props.config.sliderConfig.thumbSize}px`,
    '--thumb-icon': `url('${baseImgaeUrl+props.config.sliderConfig.thumbIcon}')`
  }
})

const resultCardStyles = computed(() => ({
  background: props.config.styles.cardBackground,
  border: `1px solid ${props.config.styles.secondaryColor.replace('0.3', '0.2')}`
}))

// Methods
const calculatePosition = (value) => {
  const min = props.config.calculatorConfig.minValue
  const max = props.config.calculatorConfig.maxValue
  return ((value - min) / (max - min)) * 100
}

const getLabelPosition = (value) => ({
  left: `${calculatePosition(value)}%`
})

const calculateFee = (value) => {
  const numericValue = parseFloat(value)

  // Kiểm tra nếu không có feeRates
  if (!props.feeRates || props.feeRates.length === 0) {
    console.warn('No fee rates provided from parent')
    return 0
  }

  // Tìm mức phí phù hợp từ feeRates được truyền từ cha
  const rate = props.feeRates.find(rate => {
    if (rate.max === null) {
      // Mức cuối cùng (không có max)
      return numericValue >= rate.min
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
  const min = props.config.calculatorConfig.minValue
  const max = props.config.calculatorConfig.maxValue

  if (!isNaN(value) && value >= min && value <= max) {
    inputValue.value = value
    calculatedFee.value = calculateFee(value)
    emit('valueChanged', value)
  }
}

const handleSliderChange = (event) => {
  const value = parseFloat(event.target.value)
  inputValue.value = value
  calculatedFee.value = calculateFee(value)
  emit('valueChanged', value)
}

const selectQuickValue = (value) => {
  inputValue.value = value
  calculatedFee.value = calculateFee(value)
  emit('valueChanged', value)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat(props.config.calculatorConfig.locale).format(amount)
}

// Watch feeRates để tính toán lại phí khi dữ liệu thay đổi
watch(
    () => props.feeRates,
    () => {
      calculatedFee.value = calculateFee(inputValue.value)
    },
    { deep: true }
)

// Lifecycle
onMounted(() => {
  // Tính toán phí ban đầu dựa trên feeRates từ cha
  calculatedFee.value = calculateFee(inputValue.value)
})
</script>

<style scoped>
.qfc-quick-calculator {
  padding: 25px;
  margin-bottom: 40px;
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
}

.qfc-value-input:focus {
  outline: 2px solid var(--primary-color, #3b82f6);
  outline-offset: 2px;
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
  padding: 0 16px;
}

.qfc-value-slider {
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: linear-gradient(
      to right,
      var(--primary-color, #ffffff) var(--slider-progress, 0%),
      var(--secondary-color, rgba(255, 255, 255, 0.3)) var(--slider-progress, 0%)
  );
  outline: none;
  margin: 15px 0;
  -webkit-appearance: none;
}

/* Thumb cho Webkit browsers */
.qfc-value-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: var(--thumb-size, 32px);
  height: var(--thumb-size, 32px);
  border-radius: 50%;
  background: var(--thumb-icon, url('/imgs/logoTHG.png')) center/contain no-repeat;
  background-color: var(--primary-color, #ffffff);
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.qfc-value-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

/* Thumb cho Firefox */
.qfc-value-slider::-moz-range-thumb {
  width: var(--thumb-size, 32px);
  height: var(--thumb-size, 32px);
  border-radius: 50%;
  background: var(--thumb-icon, url('/imgs/logoTHG.png')) center/contain no-repeat;
  background-color: var(--primary-color, #ffffff);
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  border: none;
  transition: transform 0.2s ease;
}

.qfc-value-slider::-moz-range-thumb:hover {
  transform: scale(1.1);
}

/* Track cho Firefox */
.qfc-value-slider::-moz-range-track {
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: var(--secondary-color, rgba(255, 255, 255, 0.3));
  border: none;
}

.qfc-value-slider::-moz-range-progress {
  background: var(--primary-color, #ffffff);
  height: 6px;
  border-radius: 5px;
}

/* Thumb cho Edge */
.qfc-value-slider::-ms-thumb {
  width: var(--thumb-size, 32px);
  height: var(--thumb-size, 32px);
  border-radius: 50%;
  background: var(--thumb-icon, url('/imgs/logoTHG.png')) center/contain no-repeat;
  background-color: var(--primary-color, #ffffff);
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.qfc-slider-labels {
  position: relative;
  width: calc(100% - var(--thumb-size, 32px));
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
  user-select: none;
}

.qfc-slider-label-value:hover {
  background: rgba(255, 255, 255, 0.2);
}

.qfc-slider-label-value.active {
  background: var(--primary-color, #ffffff);
  color: var(--gradient-end, #1e40af);
  font-weight: 600;
}

.qfc-result-card {
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.qfc-result-icon {
  font-size: 1.5rem;
  color: var(--primary-color, #ffffff);
}

.qfc-result-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.qfc-result-content h3 {
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
}

.qfc-fee-result {
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--primary-color, #ffffff);
  display: flex;
  align-items: center;
  gap: 5px;
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
    padding: 1px 4px;
  }

  .qfc-result-card {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .qfc-result-content {
    flex-direction: column;
    text-align: center;
  }

  .qfc-fee-result {
    font-size: 1.4rem;
  }

  .qfc-value-slider::-webkit-slider-thumb {
    width: calc(var(--thumb-size, 32px) * 0.875);
    height: calc(var(--thumb-size, 32px) * 0.875);
  }

  .qfc-value-slider::-moz-range-thumb {
    width: calc(var(--thumb-size, 32px) * 0.875);
    height: calc(var(--thumb-size, 32px) * 0.875);
  }

  .qfc-value-slider::-ms-thumb {
    width: calc(var(--thumb-size, 32px) * 0.875);
    height: calc(var(--thumb-size, 32px) * 0.875);
  }
}
</style>