<template>
  <section class="form-section" :style="sectionStyle">
    <h2 class="slogan" :style="{ color: config.textColor }">{{ config.slogan }}</h2>
    <div class="container">
      <!-- Phần lý do chọn Thiên Hà Group -->
      <div class="reasons-container" :style="reasonsContainerStyle">
        <h2 class="reasons-title" :style="{ color: config.textColor }">{{ config.reasonsTitle }}</h2>
        <div class="reasons-list">
          <div
              v-for="(reason, index) in config.reasons"
              :key="index"
              class="reason-item"
              @mouseenter="activeReason = index"
              @mouseleave="activeReason = null"
              :style="reasonItemStyle"
          >
            <div class="reason-icon" :style="{ color: config.accentColor }">
              <i :class="reason.icon"></i>
            </div>
            <div class="reason-content">
              <h3 class="reason-title" :style="{ color: config.textColor }">{{ reason.title }}</h3>
              <div class="reason-tooltip" :class="{ 'active': activeReason === index }" :style="tooltipStyle">
                <p>{{ reason.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form liên hệ -->
      <div class="form-content">
        <div class="form-container" :style="formContainerStyle">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <!-- Render dynamic form fields based on config -->
            <div
                v-for="(fieldConfig, fieldName) in config.formFields"
                :key="fieldName"
                class="form-group"
            >
              <!-- Text, Tel, Number, Email inputs -->
              <div
                  v-if="['text', 'tel', 'number', 'email'].includes(fieldConfig.type)"
                  class="input-wrapper"
              >
                <input
                    v-model="formData[fieldName]"
                    :type="fieldConfig.type"
                    :id="fieldName"
                    class="form-input"
                    :class="{ 'error': errors[fieldName] }"
                    @focus="handleFocus($event, fieldName)"
                    @blur="handleBlur($event, fieldName)"
                    :style="inputStyle"
                    :min="fieldConfig.min"
                    :max="fieldConfig.max"
                    :step="fieldConfig.step"
                    :placeholder="fieldConfig.placeholder"
                >
                <label
                    :for="fieldName"
                    class="form-label"
                    :class="{ 'focused': isFocused[fieldName] || formData[fieldName] }"
                    :style="labelStyle"
                >
                  {{ fieldConfig.label }}
                  <span v-if="fieldConfig.required" class="required-asterisk">*</span>
                </label>
              </div>

              <!-- Select dropdown -->
              <div
                  v-else-if="fieldConfig.type === 'select'"
                  class="select-wrapper"
              >
                <select
                    v-model="formData[fieldName]"
                    :id="fieldName"
                    class="form-select"
                    :class="{ 'error': errors[fieldName], 'has-value': formData[fieldName] }"
                    @focus="isSelectOpen = true; handleFocus($event, fieldName)"
                    @blur="isSelectOpen = false; handleBlur($event, fieldName)"
                    @change="handleSelectChange"
                    :style="selectStyle"
                >
                  <option value="" disabled selected hidden>{{ fieldConfig.placeholder }}</option>
                  <option v-for="(option, index) in fieldConfig.options" :key="index" :value="option">
                    {{ option }}
                  </option>
                </select>
                <label
                    :for="fieldName"
                    class="form-label select-label"
                    :class="{ 'focused': isFocused[fieldName] || formData[fieldName] }"
                    :style="labelStyle"
                >
                  {{ fieldConfig.label }}
                  <span v-if="fieldConfig.required" class="required-asterisk">*</span>
                </label>
                <span class="dropdown-arrow" :class="{ 'rotated': isSelectOpen }" :style="{ color: config.primaryColor }">▼</span>
              </div>

              <!-- Textarea -->
              <div
                  v-else-if="fieldConfig.type === 'textarea'"
                  class="input-wrapper"
              >
                <textarea
                    v-model="formData[fieldName]"
                    :id="fieldName"
                    class="form-input form-textarea"
                    :class="{ 'error': errors[fieldName] }"
                    @focus="handleFocus($event, fieldName)"
                    @blur="handleBlur($event, fieldName)"
                    :style="textareaStyle"
                    :rows="fieldConfig.rows || 3"
                    :maxlength="fieldConfig.maxlength"
                    :placeholder="fieldConfig.placeholder"
                ></textarea>
                <label
                    :for="fieldName"
                    class="form-label"
                    :class="{ 'focused': isFocused[fieldName] || formData[fieldName] }"
                    :style="labelStyle"
                >
                  {{ fieldConfig.label }}
                  <span v-if="fieldConfig.required" class="required-asterisk">*</span>
                </label>
              </div>

              <!-- Checkbox -->
              <div
                  v-else-if="fieldConfig.type === 'checkbox'"
                  class="checkbox-wrapper"
              >
                <input
                    v-model="formData[fieldName]"
                    type="checkbox"
                    :id="fieldName"
                    class="form-checkbox"
                    :class="{ 'error': errors[fieldName] }"
                    @focus="handleFocus($event, fieldName)"
                    @blur="handleBlur($event, fieldName)"
                >
                <label
                    :for="fieldName"
                    class="checkbox-label"
                    :style="labelStyle"
                >
                  {{ fieldConfig.label }}
                  <span v-if="fieldConfig.required" class="required-asterisk">*</span>
                </label>
              </div>

              <!-- Radio button group -->
              <div
                  v-else-if="fieldConfig.type === 'radio'"
                  class="radio-group"
              >
                <p class="radio-group-label" :style="labelStyle">
                  {{ fieldConfig.label }}
                  <span v-if="fieldConfig.required" class="required-asterisk">*</span>
                </p>
                <div
                    v-for="(option, index) in fieldConfig.options"
                    :key="index"
                    class="radio-option"
                >
                  <input
                      v-model="formData[fieldName]"
                      type="radio"
                      :id="`${fieldName}-${index}`"
                      :name="fieldName"
                      :value="option"
                      class="form-radio"
                      :class="{ 'error': errors[fieldName] }"
                      @focus="handleFocus($event, fieldName)"
                      @blur="handleBlur($event, fieldName)"
                  >
                  <label
                      :for="`${fieldName}-${index}`"
                      class="radio-label"
                      :style="labelStyle"
                  >
                    {{ option }}
                  </label>
                </div>
              </div>

              <!-- Date input -->
              <div
                  v-else-if="fieldConfig.type === 'date'"
                  class="input-wrapper"
              >
                <input
                    v-model="formData[fieldName]"
                    type="date"
                    :id="fieldName"
                    class="form-input"
                    :class="{ 'error': errors[fieldName] }"
                    @focus="handleFocus($event, fieldName)"
                    @blur="handleBlur($event, fieldName)"
                    :style="inputStyle"
                    :min="fieldConfig.min"
                    :max="fieldConfig.max"
                >
                <label
                    :for="fieldName"
                    class="form-label"
                    :class="{ 'focused': isFocused[fieldName] || formData[fieldName] }"
                    :style="labelStyle"
                >
                  {{ fieldConfig.label }}
                  <span v-if="fieldConfig.required" class="required-asterisk">*</span>
                </label>
              </div>

              <!-- Error message -->
              <span v-if="errors[fieldName]" class="error-message" :style="{ color: config.errorColor }">
                {{ errors[fieldName] }}
              </span>
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                class="submit-btn"
                :class="{ 'clicked': isButtonClicked }"
                @mousedown="isButtonClicked = true"
                @mouseup="isButtonClicked = false"
                @mouseleave="isButtonClicked = false"
                :style="buttonStyle"
            >
              {{ config.submitButtonText }}
            </button>

            <!-- Success Message -->
            <div v-if="isSubmitted" class="success-message" :style="successMessageStyle">
              {{ config.successMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
// Import API
import api from "../../../../api/api.js"

const props = defineProps({
  content: Object,
})

// Dữ liệu mẫu mặc định
const defaultConfig = {
  slogan: 'Kết nối hợp tác – Cùng kiến tạo giá trị bất động sản bền vững',
  reasonsTitle: 'Tại sao chọn Thiên Hà Group?',
  submitButtonText: 'Gửi thông tin',
  successMessage: 'Gửi thông tin thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.',
  primaryColor: '#031358',
  secondaryColor: '#0629BE',
  accentColor: '#FFD700',
  textColor: '#FFFFFF',
  backgroundColor: '#FFFFFF',
  errorColor: '#e53e3e',
  successColor: '#48bb78',
  gradientStart: '#031358',
  gradientEnd: '#0629BE',
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  borderRadius: '1rem',
  inputBorderColor: '#e2e8f0',
  inputFocusBorderColor: '#031358',
  labelColor: '#64748b',
  tooltipBackground: '#FFFFFF',
  tooltipTextColor: '#031358',
  buttonHoverColor: '#0629BE',
  buttonShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  formShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  reasonsBackground: 'rgba(255, 255, 255, 0.1)',

  // Field types definition
  fieldTypes: {
    text: { component: 'input', attributes: { type: 'text' } },
    tel: { component: 'input', attributes: { type: 'tel' } },
    number: { component: 'input', attributes: { type: 'number' } },
    email: { component: 'input', attributes: { type: 'email' } },
    select: { component: 'select', attributes: {} },
    textarea: { component: 'textarea', attributes: { rows: '3' } },
    checkbox: { component: 'checkbox', attributes: { type: 'checkbox' } },
    radio: { component: 'radio', attributes: { type: 'radio' } },
    date: { component: 'input', attributes: { type: 'date' } }
  },

  reasons: [
    {
      title: 'Bán nhanh trong 30 ngày',
      icon: 'fas fa-bolt',
      description: 'Với hệ thống tiếp cận khách hàng rộng khắp và chiến lược marketing hiệu quả, chúng tôi cam kết giúp bạn bán được bất động sản trong vòng 30 ngày.'
    },
    {
      title: 'Định giá chính xác & kiểm tra quy hoạch minh bạch',
      icon: 'fas fa-chart-line',
      description: 'Đội ngũ chuyên gia của chúng tôi phân tích thị trường sâu rộng để định giá chính xác và cung cấp thông tin quy hoạch minh bạch, đảm bảo quyền lợi tốt nhất cho khách hàng.'
    },
    {
      title: 'Gói dịch vụ ký gửi – Marketing toàn diện',
      icon: 'fas fa-rocket',
      description: 'Dịch vụ ký gửi chuyên nghiệp kết hợp chiến lược marketing toàn diện trên đa nền tảng, giúp tài sản của bạn tiếp cận đúng đối tượng khách hàng tiềm năng.'
    },
    {
      title: 'Đội ngũ chuyên môn & kinh nghiệm thực tế',
      icon: 'fas fa-users',
      description: 'Đội ngũ nhân viên giàu kinh nghiệm, am hiểu thị trường bất động sản, được đào tạo bài bản và luôn sẵn sàng hỗ trợ khách hàng 24/7.'
    },
    {
      title: 'Minh bạch pháp lý & uy tín thương hiệu',
      icon: 'fas fa-shield-alt',
      description: 'Cam kết minh bạch mọi thủ tục pháp lý, đảm bảo an toàn trong giao dịch. Uy tín thương hiệu được xây dựng qua hàng ngàn giao dịch thành công.'
    },
    {
      title: 'Hệ thống portal dành cho đối tác & khách hàng',
      icon: 'fas fa-desktop',
      description: 'Cung cấp hệ thống portal hiện đại, giúp đối tác và khách hàng dễ dàng theo dõi tiến độ giao dịch, quản lý thông tin và kết nối mọi lúc, mọi nơi.'
    },
    {
      title: 'Dịch vụ truyền thông & xây dựng thương hiệu bất động sản',
      icon: 'fas fa-bullhorn',
      description: 'Đội ngũ truyền thông chuyên nghiệp giúp xây dựng và quảng bá thương hiệu bất động sản cá nhân, tăng giá trị và khả năng tiếp cận thị trường.'
    },
    {
      title: 'Hỗ trợ tài chính & tư vấn đầu tư',
      icon: 'fas fa-hand-holding-usd',
      description: 'Cung cấp giải pháp tài chính linh hoạt và tư vấn đầu tư chiến lược, giúp khách hàng tối ưu hóa lợi nhuận và quản lý rủi ro hiệu quả.'
    }
  ],

  formFields: {
    fullName: {
      type: 'text',
      label: 'Họ và tên',
      placeholder: 'Nhập họ và tên đầy đủ',
      required: true,
      errorMessage: 'Vui lòng nhập họ và tên'
    },
    phone: {
      type: 'tel',
      label: 'Số điện thoại',
      placeholder: 'Nhập số điện thoại',
      required: true,
      errorMessage: 'Vui lòng nhập số điện thoại',
      validationMessage: 'Số điện thoại phải có 10 chữ số'
    },
    need: {
      type: 'select',
      label: 'Nhu cầu',
      placeholder: 'Chọn nhu cầu của bạn',
      required: true,
      errorMessage: 'Vui lòng chọn nhu cầu',
      options: ['Mua', 'Bán gấp', 'Bán giá mong muốn']
    },
    price: {
      type: 'number',
      label: 'Giá bán (VNĐ)',
      placeholder: 'Nhập giá bán',
      required: true,
      errorMessage: 'Vui lòng nhập giá bán',
      min: 0
    },
    area: {
      type: 'text',
      label: 'Khu vực',
      placeholder: 'Nhập khu vực',
      required: true,
      errorMessage: 'Vui lòng nhập khu vực'
    },
    note: {
      type: 'textarea',
      label: 'Ghi chú',
      placeholder: 'Nhập ghi chú thêm (nếu có)',
      required: false,
      errorMessage: ''
    }
  }
}

// Biến config chứa tất cả các thuộc tính có thể chỉnh sửa qua CMS
let config = reactive({ ...defaultConfig })

// Form data, errors and focus states
const formData = reactive({})
const errors = reactive({})
const isFocused = reactive({})

// Other reactive states
const isSelectOpen = ref(false)
const isButtonClicked = ref(false)
const isSubmitted = ref(false)
const activeReason = ref(null)
const isLoading = ref(false)
const hasApiError = ref(false)

// Khởi tạo dữ liệu form
const initializeFormData = () => {
  const formFields = config.formFields
  Object.keys(formFields).forEach(fieldName => {
    // Initialize form data based on field type
    switch (formFields[fieldName].type) {
      case 'checkbox':
        formData[fieldName] = false
        break
      case 'select':
      case 'radio':
        formData[fieldName] = ''
        break
      default:
        formData[fieldName] = ''
    }

    // Initialize errors
    errors[fieldName] = ''

    // Initialize focus state
    isFocused[fieldName] = false
  })
}

// Hàm gọi API để lấy dữ liệu
const fetchDataFromAPI = async () => {
  isLoading.value = true
  hasApiError.value = false

  try {
    console.log('ContactForm đang gọi API...')
    const response = await api.get('/thg/public/cms/contentSection/7')

    if (response.data && response.data.contentJson) {
      const apiData = JSON.parse(response.data.contentJson)
      console.log('ContactForm nhận dữ liệu từ API:', apiData)

      // Ghi đè config với dữ liệu từ API
      Object.assign(config, apiData)
    } else {
      console.warn('ContactForm: API response không có dữ liệu contentJson')
      hasApiError.value = true
    }
  } catch (error) {
    console.error('ContactForm: Lỗi khi gọi API:', error)
    hasApiError.value = true
  } finally {
    isLoading.value = false
  }
}

// Hàm khởi tạo dữ liệu
const initializeData = async () => {
  // 1. Nếu có props -> lấy data từ props
  if (props.content && props.content.contentJson) {
    console.log('ContactForm lấy dữ liệu từ props')
    Object.assign(config, props.content.contentJson)
  }
  // 2. Nếu không có props -> tự gọi API
  else {
    console.log('ContactForm không có props, đang gọi API...')
    await fetchDataFromAPI()

    // 3. Nếu gọi API thất bại -> sử dụng dữ liệu mẫu
    if (hasApiError.value) {
      console.log('ContactForm gọi API thất bại, sử dụng dữ liệu mẫu')
      // Config đã được khởi tạo với defaultConfig
    }
  }

  // Khởi tạo form data sau khi có config
  initializeFormData()
}

// Khởi tạo khi component mounted
onMounted(async () => {
  await initializeData()
})

// Các computed properties để bind với CSS
const sectionStyle = computed(() => ({
  background: `linear-gradient(45deg, ${config.gradientStart}, ${config.gradientEnd})`,
  fontFamily: config.fontFamily
}))

const reasonsContainerStyle = computed(() => ({
  background: config.reasonsBackground,
  backdropFilter: 'blur(10px)',
  borderRadius: config.borderRadius
}))

const reasonItemStyle = computed(() => ({
  transition: 'all 0.3s ease',
  borderRadius: config.borderRadius
}))

const tooltipStyle = computed(() => ({
  background: config.tooltipBackground,
  color: config.tooltipTextColor,
  borderRadius: config.borderRadius
}))

const formContainerStyle = computed(() => ({
  background: config.backgroundColor,
  borderRadius: config.borderRadius,
  boxShadow: config.formShadow
}))

const inputStyle = computed(() => ({
  color: config.primaryColor,
  borderBottomColor: config.inputBorderColor,
  fontFamily: config.fontFamily
}))

const selectStyle = computed(() => ({
  ...inputStyle.value,
  color: formData.need ? config.primaryColor : 'transparent'
}))

const textareaStyle = computed(() => ({
  ...inputStyle.value,
  resize: 'vertical'
}))

const labelStyle = computed(() => ({
  color: config.labelColor,
  fontFamily: config.fontFamily
}))

const buttonStyle = computed(() => ({
  background: config.primaryColor,
  color: config.textColor,
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius
}))

const successMessageStyle = computed(() => ({
  background: config.successColor,
  color: config.textColor,
  borderRadius: config.borderRadius
}))

const validateForm = () => {
  let isValid = true
  const formFields = config.formFields

  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  // Validate each field
  Object.keys(formFields).forEach(fieldName => {
    const field = formFields[fieldName]
    const value = formData[fieldName]

    if (field.required) {
      if (field.type === 'checkbox' && !value) {
        errors[fieldName] = field.errorMessage
        isValid = false
      } else if ((field.type !== 'checkbox' && field.type !== 'radio') && !value && value !== 0) {
        errors[fieldName] = field.errorMessage
        isValid = false
      } else if (field.type === 'radio' && !value) {
        errors[fieldName] = field.errorMessage
        isValid = false
      }
    }

    // Type-specific validations
    if (value) {
      switch (field.type) {
        case 'tel':
          if (!/^\d{10}$/.test(value)) {
            errors[fieldName] = field.validationMessage || 'Số điện thoại không hợp lệ'
            isValid = false
          }
          break
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors[fieldName] = field.validationMessage || 'Email không hợp lệ'
            isValid = false
          }
          break
        case 'number':
          if (isNaN(value) || Number(value) < (field.min || 0)) {
            errors[fieldName] = field.validationMessage || `Giá trị phải lớn hơn hoặc bằng ${field.min || 0}`
            isValid = false
          }
          break
      }
    }
  })

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    // Simulate form submission
    isSubmitted.value = true
    setTimeout(() => {
      isSubmitted.value = false
      // Reset form
      initializeFormData()
    }, 3000)
  }
}

const handleFocus = (event, fieldName) => {
  isFocused[fieldName] = true
  // Change border color on focus
  if (event.target) {
    event.target.style.borderBottomColor = config.inputFocusBorderColor
  }
}

const handleBlur = (event, fieldName) => {
  isFocused[fieldName] = false
  // Reset border color on blur
  if (event.target) {
    event.target.style.borderBottomColor = config.inputBorderColor
  }
}

const handleSelectChange = () => {
  isSelectOpen.value = false
}
</script>

<style scoped>
.form-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-top-left-radius: 50% 20%;
  border-top-right-radius: 50% 20%;
  position: relative;
}

.container {
  display: flex;
  max-width: 1400px;
  width: 100%;
  gap: 1rem;
  align-items: flex-start;
  margin-top: 200px;
  padding: 0 20px;
}

.reasons-container {
  flex: 1;
  padding: 2rem;
  min-height: 600px;
}

.reasons-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.reasons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reason-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  cursor: pointer;
  position: relative;
  font-size: 17px;
}

.reason-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.reason-icon {
  font-size: 17px;
  width: 30px;
  display: flex;
  justify-content: center;
  margin-top: 0.2rem;
}

.reason-content {
  flex: 1;
  position: relative;
}

.reason-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.reason-tooltip {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 300px;
  padding: 1rem;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  pointer-events: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.reason-tooltip.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(-10px);
}

.reason-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 20px;
  border-width: 8px;
  border-style: solid;
  border-color: inherit;
  border-top-color: inherit;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
}

.reason-tooltip p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.form-content {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slogan {
  font-size: 33px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.3;
  position: absolute;
  top: 10%;
}

.form-container {
  padding: 2.5rem;
  width: 100%;
  height: 100%;
  min-height: 600px;
  display: flex;
  align-items: center;
}

.contact-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input-wrapper,
.select-wrapper,
.checkbox-wrapper,
.radio-group {
  position: relative;
  margin-bottom: 0.25rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 1.5rem 0 0.5rem 0;
  border: none;
  border-bottom: 2px solid;
  background: transparent;
  font-size: 17px;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
}

/* Ẩn placeholder khi không focus */
.form-input::placeholder,
.form-textarea::placeholder {
  color: transparent;
  opacity: 0;
}

/* Hiển thị placeholder khi focus */
.form-input:focus::placeholder,
.form-textarea:focus::placeholder {
  color: #a0aec0;
  opacity: 1;
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-bottom-width: 3px;
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-bottom-color: var(--error-color, #e53e3e);
}

.form-label {
  position: absolute;
  top: 1rem;
  left: 0;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.3s ease;
  transform-origin: left center;
}

.form-label.focused {
  top: 0.25rem;
  font-size: 0.75rem;
  transform: translateY(0);
}

.select-label.focused {
  top: 0.25rem;
  font-size: 0.75rem;
  transform: translateY(0);
}

.select-wrapper {
  position: relative;
}

.dropdown-arrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  transition: transform 0.3s ease;
  pointer-events: none;
  z-index: 2;
}

.dropdown-arrow.rotated {
  transform: translateY(-50%) rotate(180deg);
}

.form-select {
  appearance: none;
  cursor: pointer;
  position: relative;
  z-index: 1;
  background: transparent;
  color: transparent; /* Ẩn text khi chưa chọn */
}

.form-select.has-value {
  color: inherit; /* Hiện text khi đã chọn */
}

.form-select option {
  padding: 0.5rem;
  background: white;
  color: #333;
}

/* Style cho option đầu tiên (placeholder) */
.form-select option:first-child {
  color: #a0aec0;
  font-style: italic;
}

/* Style cho các option khác */
.form-select option:not(:first-child) {
  color: #333;
}

/* Checkbox styles */
.form-checkbox {
  margin-right: 0.5rem;
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
}

/* Radio styles */
.radio-group-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.form-radio {
  margin-right: 0.5rem;
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
}

.radio-label {
  cursor: pointer;
  font-size: 1rem;
}

/* Date input styles */
input[type="date"] {
  color-scheme: light;
}

.required-asterisk {
  color: #e53e3e;
  margin-left: 2px;
}

.error-message {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  min-height: 1.25rem;
}

.submit-btn {
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: v-bind('config.buttonShadow');
  background-color: v-bind('config.buttonHoverColor');
}

.submit-btn:active,
.submit-btn.clicked {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-btn:hover::before {
  left: 100%;
}

.success-message {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  margin-top: 1rem;
  animation: slideIn 0.3s ease;
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

/* Responsive design */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
    gap: 2rem;
  }

  .reasons-container{
    width: 100%;
    margin-top: 30px;
  }

  .form-content {
    width: 100%;
  }

  .form-container{
    width: 100%;
  }

  .form-section {
    border-top-left-radius: 25% 5%;
    border-top-right-radius: 25% 5%;
  }
}

@media (max-width: 768px) {
  .form-section {
    padding: 1rem;
  }

  .slogan {
    font-size: 2rem;
    margin: 0 2rem;
    top: 5%;
  }

  .form-container {
    padding: 2rem;
  }

  .reason-tooltip {
    width: 250px;
  }
}

@media (max-width: 480px) {
  .slogan {
    font-size: 1.5rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 1.25rem 0 0.5rem 0;
  }

  .form-label.focused {
    top: 0.15rem;
    font-size: 0.7rem;
  }

  .reason-tooltip {
    width: 200px;
  }
}
</style>