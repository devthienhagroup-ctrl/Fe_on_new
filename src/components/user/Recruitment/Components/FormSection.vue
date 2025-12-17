<template>
  <div
      class="recruitment-container"
      :style="containerStyle"
  >
    <div
        class="recruitment-wrapper"
        :style="wrapperStyle"
    >
      <!-- Phần hình ảnh công ty -->
      <div
          class="company-section"
          :style="companySectionStyle"
      >
        <div
            class="section-title fade-left"
            :style="sectionTitleStyle"
        >
          <h2>{{ config.textContent.sectionTitle }}</h2>
        </div>

        <div class="main-image-container fade-left">
          <img
              :src="getImageUrl(currentImage)"
              :alt="'Company image ' + currentImage"
              class="main-image"
          />
          <button
              class="nav-btn prev-btn"
              @click="prevImage"
              :style="navBtnStyle"
          >‹</button>
          <button
              class="nav-btn next-btn"
              @click="nextImage"
              :style="navBtnStyle"
          >›</button>
        </div>

        <div class="image-queue fade-up">
          <div
              v-for="(img, index) in queueImages"
              :key="img"
              class="queue-image-container"
              @click="selectImage(img)"
          >
            <img
                :src="getImageUrl(img)"
                :alt="'Company image ' + img"
                class="queue-image"
            />
          </div>
          <div
              class="logo-container"
              :style="logoContainerStyle"
          >
            <img
                :src="config.images.logo"
                alt="Company logo"
                class="company-logo"
            />
          </div>
        </div>
      </div>

      <!-- Phần form ứng tuyển -->
      <div class="form-section fade-right">
        <div
            class="application-form"
            :style="applicationFormStyle"
        >
          <h2 class="form-title" :style="formTitleStyle">{{ config.textContent.formTitle }}</h2>

          <form @submit.prevent="submitForm">
            <!-- Render dynamic form fields -->
            <div
                v-for="field in config.formFields"
                :key="field.id"
                class="form-group"
                :class="{
                'file-group': field.type === 'file',
                'select-group': field.type === 'select',
                'textarea-group': field.type === 'textarea'
              }"
            >
              <!-- Text input -->
              <input
                  v-if="field.type === 'text' || field.type === 'tel' || field.type === 'email'"
                  :type="field.type"
                  :id="field.id"
                  v-model="formData[field.id]"
                  :required="field.required"
              />

              <!-- File input -->
              <template v-else-if="field.type === 'file'">
                <label :for="field.id" class="file-label">{{ field.label }}</label>
                <input
                    :type="field.type"
                    :id="field.id"
                    @change="handleFileUpload"
                    :accept="field.accept || config.acceptedFileTypes"
                    :required="field.required"
                />
                <span class="file-name">{{ formData[field.id] ? formData[field.id].name : field.placeholder || config.textContent.filePlaceholder }}</span>
              </template>

              <!-- Select input -->
              <select
                  v-else-if="field.type === 'select'"
                  :id="field.id"
                  v-model="formData[field.id]"
                  :required="field.required"
              >
                <option value="" disabled selected></option>
                <option
                    v-for="option in field.options"
                    :key="option.value"
                    :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>

              <!-- Textarea input -->
              <textarea
                  v-else-if="field.type === 'textarea'"
                  :id="field.id"
                  v-model="formData[field.id]"
                  :rows="field.rows || 4"
                  :required="field.required"
              ></textarea>

              <label
                  v-if="field.type !== 'file'"
                  :for="field.id"
              >
                {{ field.label }}
              </label>
            </div>

            <button
                type="submit"
                class="submit-btn"
                :style="submitBtnStyle"
            >
              {{ config.textContent.submitBtnText }}
            </button>
          </form>
        </div>

        <div
            class="recruitment-message"
            :style="recruitmentMessageStyle"
        >
          <p>{{ config.textContent.recruitmentMessage }}</p>
          <img
              :src="getImageUrl(config.images.recruitmentIllustration)"
              alt="Recruitment illustration"
              class="recruitment-illustration"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Config object chứa tất cả dữ liệu
let config = {
  // Text content
  textContent: {
    sectionTitle: "HÌNH ẢNH CÔNG TY",
    formTitle: "ĐĂNG KÝ ỨNG TUYỂN",
    filePlaceholder: "Chọn file",
    submitBtnText: "ỨNG TUYỂN",
    recruitmentMessage: "Nơi đây không chỉ có Job, mà còn có cơ hội để bạn tỏa sáng. Bạn sẵn sàng tham gia cùng chúng tôi chưa?",
    successMessage: "Đã gửi đơn ứng tuyển thành công!"
  },

  // Form fields configuration
  formFields: [
    {
      id: 'fullName',
      type: 'text',
      label: 'Họ và tên',
      placeholder: '',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      id: 'phone',
      type: 'tel',
      label: 'Số điện thoại',
      placeholder: '',
      required: true,
      validation: {
        pattern: '^[0-9]{10,11}$',
        message: 'Số điện thoại không hợp lệ'
      }
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      placeholder: '',
      required: true,
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        message: 'Email không hợp lệ'
      }
    },
    {
      id: 'cv',
      type: 'file',
      label: 'CV',
      placeholder: 'Chọn file CV',
      required: true,
      accept: '.pdf,.doc,.docx',
      validation: {
        maxSize: 5242880, // 5MB
        allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      }
    },
    {
      id: 'position',
      type: 'select',
      label: 'Vị trí ứng tuyển',
      required: true,
      options: [
        { value: 'telesale', label: 'Nhân viên telesale' },
        { value: 'office', label: 'Nhân viên văn phòng' },
        { value: 'consultant', label: 'Chuyên viên tư vấn' },
        { value: 'pricing_specialist', label: 'Chuyên viên định giá BĐS' },
        { value: 'market_research', label: 'Nhân viên khảo sát thị trường' },
        { value: 'real_estate_broker', label: 'Môi giới bất động sản' },
        { value: 'collaborator', label: 'Cộng tác viên THG' }
      ]
    },
    {
      id: 'coverLetter',
      type: 'textarea',
      label: 'Thư ứng tuyển (Cover letter)',
      placeholder: 'Viết thư ứng tuyển của bạn tại đây...',
      rows: 4,
      required: true,
      validation: {
        minLength: 50,
        maxLength: 2000
      }
    }
  ],

  // Images
  images: {
    logo: "/imgs/logoTHG.png",
    recruitmentIllustration: "/imgs/helping-a-partner-animate.svg",
    gallery: ['hd1.jpg', 'hd2.jpg', 'hd3.jpg', 'hd4.jpg', 'hd5.jpg', 'hd6.jpg', 'hd7.jpg', 'hd8.jpg']
  },

  // Accepted file types (fallback)
  acceptedFileTypes: ".pdf,.doc,.docx",

  // CSS Properties
  colors: {
    primary: "#0030FF",
    primaryDark: "#031358",
    secondary: "#4CAF50",
    white: "#FFFFFF",
    lightGray: "#DDDDDD",
    gray: "#999999",
    darkGray: "#666666",
    textDark: "#333333",
    error: "#FF4444",
    success: "#00C851"
  },

  gradients: {
    container: "linear-gradient(to bottom, #031358, #0030FF)",
    button: "linear-gradient(to right, #031358, #0030FF)",
    buttonHover: "linear-gradient(to right, #0030FF, #031358)"
  },

  sizes: {
    containerBorderRadius: "50% 50% 0 0/100px 100px 0 0",
    containerPaddingTop: "150px",
    containerPaddingBottom: "60px",
    titleFontSize: "40px",
    mainImageHeight: "500px",
    queueImageHeight: "160px",
    buttonFontSize: "18px",
    buttonPadding: "18px 40px",
    messageFontSize: "20px",
    inputFontSize: "16px",
    labelFontSize: "16px"
  },

  effects: {
    blur: "20px",
    buttonHoverShadow: "0 8px 20px rgba(0, 48, 255, 0.4)",
    buttonActiveShadow: "0 3px 10px rgba(0, 48, 255, 0.3)",
    transitionDuration: "0.3s",
    transitionTiming: "ease"
  },

  // Validation messages
  validationMessages: {
    required: "Trường này là bắt buộc",
    email: "Vui lòng nhập email hợp lệ",
    phone: "Vui lòng nhập số điện thoại hợp lệ",
    fileSize: "File quá lớn. Kích thước tối đa là 5MB",
    fileType: "Chỉ chấp nhận file PDF, DOC, DOCX"
  }
}

const props = defineProps({
  sectionData: Object
})

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã nhận props từ cha", config);
}

// Computed properties cho styles
const containerStyle = computed(() => ({
  background: config.gradients.container,
  borderRadius: config.sizes.containerBorderRadius,
  paddingTop: config.sizes.containerPaddingTop,
  paddingBottom: config.sizes.containerPaddingBottom
}))

const wrapperStyle = computed(() => ({
  maxWidth: "1400px",
  padding: "0 20px",
  margin: "0 auto"
}))

const companySectionStyle = computed(() => ({
  background: `rgba(255, 255, 255, 0.1)`,
  backdropFilter: `blur(${config.effects.blur})`,
  border: `1px solid rgba(255, 255, 255, 0.2)`
}))

const sectionTitleStyle = computed(() => ({
  color: config.colors.white
}))

const formTitleStyle = computed(() => ({
  color: config.colors.primary,
  fontSize: config.sizes.titleFontSize
}))

const navBtnStyle = computed(() => ({
  background: "rgba(0, 0, 0, 0.5)",
  color: config.colors.white
}))

const logoContainerStyle = computed(() => ({
  border: `2px solid ${config.colors.white}`
}))

const applicationFormStyle = computed(() => ({
  background: config.colors.white
}))

const submitBtnStyle = computed(() => ({
  background: config.gradients.button,
  color: config.colors.white,
  fontSize: config.sizes.buttonFontSize,
  padding: config.sizes.buttonPadding
}))

const recruitmentMessageStyle = computed(() => ({
  background: config.colors.white
}))

// State cho hình ảnh
const currentImage = ref(config.images.gallery[0])
const allImages = ref(config.images.gallery)

// Khởi tạo form data từ config
const initializeFormData = () => {
  const initialData = {}
  config.formFields.forEach(field => {
    initialData[field.id] = field.type === 'file' ? null : ''
  })
  return initialData
}

// State cho form
const formData = reactive(initializeFormData())

// Computed property để lấy 2 ảnh tiếp theo trong hàng đợi
const queueImages = computed(() => {
  const currentIndex = allImages.value.indexOf(currentImage.value)
  const nextImages = []

  for (let i = 1; i <= 2; i++) {
    const nextIndex = (currentIndex + i) % allImages.value.length
    nextImages.push(allImages.value[nextIndex])
  }

  return nextImages
})

// Hàm lấy đường dẫn ảnh
const getImageUrl = (imageName) => {
  return baseImgaeUrl+ imageName;
}

// Hàm chuyển đến ảnh tiếp theo
const nextImage = () => {
  const currentIndex = allImages.value.indexOf(currentImage.value)
  const nextIndex = (currentIndex + 1) % allImages.value.length
  currentImage.value = allImages.value[nextIndex]
}

// Hàm quay lại ảnh trước
const prevImage = () => {
  const currentIndex = allImages.value.indexOf(currentImage.value)
  const prevIndex = (currentIndex - 1 + allImages.value.length) % allImages.value.length
  currentImage.value = allImages.value[prevIndex]
}

// Hàm chọn ảnh từ hàng đợi
const selectImage = (imageName) => {
  currentImage.value = imageName
}

// Hàm xử lý upload file
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  const field = config.formFields.find(f => f.id === 'cv')

  // Validation
  if (field && field.validation) {
    if (field.validation.maxSize && file.size > field.validation.maxSize) {
      alert(config.validationMessages.fileSize)
      event.target.value = ''
      return
    }

    if (field.validation.allowedTypes && !field.validation.allowedTypes.includes(file.type)) {
      alert(config.validationMessages.fileType)
      event.target.value = ''
      return
    }
  }

  formData.cv = file
}

// Hàm validate form
const validateForm = () => {
  for (const field of config.formFields) {
    if (field.required && !formData[field.id]) {
      alert(`${field.label}: ${config.validationMessages.required}`)
      return false
    }

    // Custom validation patterns
    if (field.validation && field.validation.pattern) {
      const regex = new RegExp(field.validation.pattern)
      if (!regex.test(formData[field.id])) {
        alert(field.validation.message || `${field.label} không hợp lệ`)
        return false
      }
    }
  }
  return true
}

// Hàm submit form
const submitForm = () => {
  if (!validateForm()) {
    return
  }

  console.log('Form data:', formData)

  // Simulate API call
  setTimeout(() => {
    alert(config.textContent.successMessage)

    // Reset form
    Object.assign(formData, initializeFormData())
  }, 500)
}

// Khởi tạo component
onMounted(() => {
  // Có thể thêm các tác vụ khởi tạo ở đây nếu cần
})

// Thêm watcher để theo dõi formData
import { watch } from 'vue'

// Watcher để thêm class khi có giá trị
watch(formData, (newValue) => {
  Object.keys(newValue).forEach(key => {
    const inputElement = document.getElementById(key)
    if (inputElement) {
      if (newValue[key] && newValue[key].toString().trim() !== '') {
        inputElement.classList.add('has-value')
      } else {
        inputElement.classList.remove('has-value')
      }
    }
  })
}, { deep: true, immediate: true })
</script>

<style scoped>
.recruitment-container {
  font-family: 'Ubuntu', sans-serif;
}

.recruitment-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

/* Phần hình ảnh công ty */
.company-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 20px;
  padding: 25px;
  justify-content: space-between;
}

.section-title {
  border-radius: 15px;
  padding: 20px;
  text-align: center;
}

.section-title h2 {
  font-size: v-bind('config.sizes.titleFontSize');
  margin: 0;
  font-weight: 600;
}

.main-image-container {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.main-image {
  width: 100%;
  height: v-bind('config.sizes.mainImageHeight');
  object-fit: cover;
  display: block;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all v-bind('config.effects.transitionDuration') v-bind('config.effects.transitionTiming');
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.prev-btn {
  left: 15px;
}

.next-btn {
  right: 15px;
}

.image-queue {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
}

.queue-image-container {
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform v-bind('config.effects.transitionDuration') v-bind('config.effects.transitionTiming');
}

.queue-image-container:hover {
  transform: translateY(-5px);
}

.queue-image {
  width: 100%;
  height: v-bind('config.sizes.queueImageHeight');
  object-fit: cover;
  display: block;
}

.logo-container {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: transform v-bind('config.effects.transitionDuration') v-bind('config.effects.transitionTiming');
  cursor: pointer;
}

.logo-container:hover {
  transform: translateY(-5px);
}

.company-logo {
  max-width: 80%;
  max-height: 80%;
  filter: brightness(0) invert(1);
}

/* Phần form ứng tuyển */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.application-form, .recruitment-message {
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
  font-weight: 600;
}

.form-group {
  position: relative;
  margin-bottom: 30px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid v-bind('config.colors.lightGray');
  background: transparent;
  font-size: v-bind('config.sizes.inputFontSize');
  font-family: 'Ubuntu', sans-serif;
  transition: all v-bind('config.effects.transitionDuration') v-bind('config.effects.transitionTiming');
  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-bottom-color: v-bind('config.colors.primary');
}

.form-group label {
  position: absolute;
  top: 10px;
  left: 0;
  font-size: v-bind('config.sizes.labelFontSize');
  color: v-bind('config.colors.gray');
  pointer-events: none;
  transition: all v-bind('config.effects.transitionDuration') v-bind('config.effects.transitionTiming');
}

.form-group input:focus ~ label,
.form-group input:valid ~ label, /* Giữ lại cho các input hợp lệ */
.form-group input.has-value ~ label, /* Thêm class này */
.form-group select:focus ~ label,
.form-group select:valid ~ label,
.form-group select.has-value ~ label,
.form-group textarea:focus ~ label,
.form-group textarea:valid ~ label,
.form-group textarea.has-value ~ label {
  top: -20px;
  font-size: 14px;
  color: v-bind('config.colors.primary');
}

/* Style cho input file */
.file-group {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 2px solid v-bind('config.colors.lightGray');
  transition: all v-bind('config.effects.transitionDuration') v-bind('config.effects.transitionTiming');
}

.file-group:focus-within {
  border-bottom-color: v-bind('config.colors.primary');
}

.file-label {
  position: static !important;
  color: v-bind('config.colors.gray');
  font-size: v-bind('config.sizes.labelFontSize');
  pointer-events: auto;
  transition: all v-bind('config.effects.transitionDuration') v-bind('config.effects.transitionTiming');
}

.file-group:focus-within .file-label {
  color: v-bind('config.colors.primary');
}

.file-group input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-name {
  flex: 1;
  color: v-bind('config.colors.darkGray');
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.textarea-group textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  border: none;
  border-radius: 50px;
  font-family: 'Ubuntu', sans-serif;
  cursor: pointer;
  transition: all v-bind('config.effects.transitionDuration') v-bind('config.effects.transitionTiming');
  display: block;
  width: 100%;
  box-shadow: 0 5px 15px rgba(0, 48, 255, 0.3);
  font-weight: 600;
  letter-spacing: 1px;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: v-bind('config.effects.buttonHoverShadow');
  background: v-bind('config.gradients.buttonHover') !important;
}

.submit-btn:active {
  transform: translateY(1px);
  box-shadow: v-bind('config.effects.buttonActiveShadow');
}

.recruitment-message {
  position: relative;
  padding-right: 250px;
  text-align: justify;
}

.recruitment-message img {
  position: absolute;
  transform: scaleX(-1);
  bottom: 0;
  right: 0;
  width: 250px;
}

.recruitment-message p {
  font-size: v-bind('config.sizes.messageFontSize');
  color: v-bind('config.colors.textDark');
  margin-bottom: 20px;
  line-height: 1.5;
}

.recruitment-illustration {
  max-width: 100%;
  height: auto;
}

/* Responsive */
@media (max-width: 1200px) {
  .recruitment-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .main-image {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .recruitment-container {
    padding: 40px 15px;
    border-radius: 0 0 30% 30% / 0 0 50px 50px;
  }

  .section-title h2, .form-title {
    font-size: 32px;
  }

  .main-image {
    height: 300px;
  }

  .image-queue {
    grid-template-columns: 1fr 1fr;
  }

  .logo-container {
    grid-column: span 2;
    margin-top: 10px;
  }

  .application-form, .recruitment-message {
    padding: 20px;
  }

  .recruitment-message img {
    display: block;
    margin: 0 auto;
    position: static;
  }
}

@media (max-width: 480px) {
  .section-title h2, .form-title {
    font-size: 28px;
  }

  .main-image {
    height: 250px;
  }

  .queue-image {
    height: 120px;
  }

  .recruitment-message p {
    font-size: 18px;
  }

  .company-section {
    padding: 15px;
  }
}
</style>