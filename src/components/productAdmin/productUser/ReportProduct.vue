<template>
  <div class="report-listing">
    <!-- Button kích hoạt modal -->
    <button
        class="report-button"
        @click="openModal"
        :disabled="isSubmitting"
    >
      <span v-if="!isSubmitting"><i class="fa-solid fa-flag"></i> Báo cáo tin này</span>
      <span v-else class="loading-text">
        <i class="fa-solid fa-spinner fa-spin"></i> Đang xử lý...
      </span>
    </button>

    <!-- Modal overlay -->
    <transition name="fade">
      <div
          v-if="isModalOpen"
          class="modal-overlay"
          @click.self="closeModal"
      >
        <!-- Modal content -->
        <transition name="modal-slide">
          <div class="modal-container" v-if="isModalOpen">
            <!-- Modal header -->
            <div class="modal-header">
              <div class="modal-icon">
                <i class="fa-solid fa-flag"></i>
              </div>
              <div class="modal-title-wrapper">
                <h2 class="modal-title">Báo cáo tin đăng</h2>
                <p class="modal-subtitle">Giúp chúng tôi cải thiện chất lượng cộng đồng</p>
              </div>
              <button class="close-button" @click="closeModal" :disabled="isSubmitting">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
              <form @submit.prevent="submitReport" class="report-form">
                <!-- Lý do báo cáo -->
                <div class="form-group">
                  <label class="form-label" for="reason">
                    <span class="label-text">Lý do báo cáo</span>
                    <span class="required">*</span>
                  </label>
                  <div class="select-wrapper">
                    <select
                        id="reason"
                        v-model="form.reason"
                        class="form-select"
                        :class="{ 'error': validationErrors.reason }"
                        :disabled="isSubmitting"
                        @change="clearValidationError('reason')"
                    >
                      <option value="" disabled>Chọn lý do báo cáo</option>
                      <option
                          v-for="reason in reportReasons"
                          :key="reason.value"
                          :value="reason.value"
                      >
                        {{ reason.text }}
                      </option>
                    </select>
                    <i class="fa-solid fa-chevron-down select-icon"></i>
                  </div>
                  <div v-if="validationErrors.reason" class="validation-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    {{ validationErrors.reason }}
                  </div>
                </div>

                <!-- Mô tả chi tiết -->
                <div class="form-group">
                  <label class="form-label" for="description">
                    <span class="label-text">Mô tả chi tiết</span>
                    <span class="optional">(Tùy chọn)</span>
                  </label>
                  <div class="textarea-wrapper">
                    <textarea
                        id="description"
                        v-model="form.description"
                        class="form-textarea"
                        placeholder="Vui lòng cung cấp thêm thông tin chi tiết về vấn đề bạn gặp phải. Điều này giúp chúng tôi xử lý nhanh hơn."
                        rows="4"
                        :disabled="isSubmitting"
                    ></textarea>
                    <div class="char-count">
                      {{ form.description.length }}/500
                    </div>
                  </div>
<!--                  <div class="form-hint">-->
<!--                    <i class="fa-solid fa-lightbulb"></i>-->
<!--                    Càng cung cấp nhiều thông tin, chúng tôi càng xử lý nhanh hơn-->
<!--                  </div>-->
                </div>

                <!-- Thông tin liên hệ (chỉ hiển thị khi chưa đăng nhập) -->
                <div v-if="!isLoggedIn" class="contact-section">
                  <div class="section-header">
                    <h3 class="section-title">
                      <i class="fa-solid fa-user-circle"></i>
                      Thông tin liên hệ
                    </h3>
                    <p class="section-subtitle">Để chúng tôi có thể phản hồi kết quả cho bạn</p>
                  </div>

                  <!-- Checkbox liên hệ -->
                  <div class="form-group checkbox-group">
                    <div class="checkbox-wrapper">
                      <input
                          type="checkbox"
                          id="contactOptIn"
                          v-model="form.contactOptIn"
                          class="form-checkbox"
                          :disabled="isSubmitting"
                      />
                      <label for="contactOptIn" class="checkbox-label">
                        <div class="checkbox-box">
                          <i class="fa-solid fa-check" v-if="form.contactOptIn"></i>
                        </div>
                        <span class="checkbox-text">Để lại thông tin liên hệ để nhận phản hồi</span>
                      </label>
                    </div>
                  </div>

                  <!-- Thông tin liên hệ chi tiết -->
                  <transition name="expand">
                    <div v-if="form.contactOptIn" class="contact-details">
                      <div class="form-group">
                        <label class="form-label" for="email">
                          <span class="label-text">Email</span>
                          <span class="required">*</span>
                        </label>
                        <div class="input-wrapper">
                          <i class="fa-solid fa-envelope input-icon"></i>
                          <input
                              id="email"
                              v-model="form.email"
                              type="email"
                              class="form-input"
                              :class="{ 'error': validationErrors.email }"
                              placeholder="email@example.com"
                              :disabled="isSubmitting"
                              @input="clearValidationError('email')"
                          />
                        </div>
                        <div v-if="validationErrors.email" class="validation-error">
                          <i class="fa-solid fa-circle-exclamation"></i>
                          {{ validationErrors.email }}
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="form-label" for="phone">
                          <span class="label-text">Số điện thoại</span>
                          <span class="optional">(Tùy chọn)</span>
                        </label>
                        <div class="input-wrapper">
                          <i class="fa-solid fa-phone input-icon"></i>
                          <input
                              id="phone"
                              v-model="form.phone"
                              type="tel"
                              class="form-input"
                              placeholder="0123 456 789"
                              :disabled="isSubmitting"
                          />
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="form-label" for="fullname">
                          <span class="label-text">Họ và tên</span>
                          <span class="optional">(Tùy chọn)</span>
                        </label>
                        <div class="input-wrapper">
                          <i class="fa-solid fa-user input-icon"></i>
                          <input
                              id="fullname"
                              v-model="form.reporterName"
                              type="text"
                              class="form-input"
                              placeholder="Nguyễn Văn A"
                              :disabled="isSubmitting"
                          />
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>

                <!-- Thông báo cho người đã đăng nhập -->
                <div v-else class="logged-in-notice">
                  <div class="notice-content">
                    <i class="fa-solid fa-user-check"></i>
                    <div class="notice-text">
                      <strong>Bạn đang đăng nhập</strong>
                      <p>Chúng tôi sẽ sử dụng thông tin từ tài khoản của bạn để liên hệ khi cần</p>
                    </div>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="modal-actions">
                  <button
                      type="button"
                      class="cancel-button"
                      @click="closeModal"
                      :disabled="isSubmitting"
                  >
                    <i class="fa-solid fa-times"></i>
                    Huỷ
                  </button>
                  <button
                      type="submit"
                      class="submit-button"
                      :disabled="isSubmitting"
                  >
                    <template v-if="!isSubmitting">
                      <i class="fa-solid fa-paper-plane"></i>
                      Gửi báo cáo
                    </template>
                    <template v-else>
                      <i class="fa-solid fa-spinner fa-spin"></i>
                      Đang gửi...
                    </template>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from "../../../stores/authStore.js";
import api from "../../../api/api.js";
import Swal from 'sweetalert2';

// Props
const props = defineProps({
  listingId: {
    type: [String, Number],
    required: true
  }
})

// Auth store
const auth = useAuthStore()

// State
const isModalOpen = ref(false)
const isSubmitting = ref(false)

// API endpoint
const API_URL = '/thg/public-view/product-report/save-report'

// Danh sách lý do báo cáo
const reportReasons = ref([
  { value: 'sold_still_posted', text: 'Tin đã bán nhưng vẫn đăng' },
  { value: 'incorrect_info', text: 'Thông tin sai lệch (giá, diện tích, hình ảnh)' },
  { value: 'spam', text: 'Tin spam / quảng cáo không liên quan' },
  { value: 'scam', text: 'Có dấu hiệu lừa đảo (scam)' },
  { value: 'legal_violation', text: 'Vi phạm pháp lý / giả mạo' },
  { value: 'other', text: 'Lý do khác' }
])

// Form data
const form = reactive({
  reason: '',
  description: '',
  contactOptIn: false,
  email: '',
  phone: '',
  reporterName: ''
})

// Validation errors
const validationErrors = reactive({
  reason: '',
  email: ''
})

// Computed
const isLoggedIn = computed(() => {
  return auth.userInfo !== null
})

// Methods
const openModal = () => {
  isModalOpen.value = true
  // Reset form khi mở modal
  resetForm()
  // Focus vào select đầu tiên khi modal mở
  setTimeout(() => {
    const reasonSelect = document.getElementById('reason')
    if (reasonSelect) reasonSelect.focus()
  }, 300)
}

const closeModal = () => {
  if (!isSubmitting.value) {
    isModalOpen.value = false
  }
}

const resetForm = () => {
  form.reason = ''
  form.description = ''
  form.contactOptIn = false
  form.email = ''
  form.phone = ''
  form.reporterName = ''

  validationErrors.reason = ''
  validationErrors.email = ''
}

const clearValidationError = (field) => {
  if (validationErrors[field]) {
    validationErrors[field] = ''
  }
}

const validateForm = () => {
  let isValid = true

  // Reset validation errors
  validationErrors.reason = ''
  validationErrors.email = ''

  // Kiểm tra lý do
  if (!form.reason.trim()) {
    validationErrors.reason = 'Vui lòng chọn lý do báo cáo'
    isValid = false
  }

  // Kiểm tra email nếu chưa đăng nhập và muốn liên hệ
  if (form.contactOptIn && !isLoggedIn.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email.trim()) {
      validationErrors.email = 'Vui lòng nhập email để nhận phản hồi'
      isValid = false
    } else if (!emailRegex.test(form.email)) {
      validationErrors.email = 'Email không hợp lệ'
      isValid = false
    }
  }

  // Giới hạn độ dài mô tả
  if (form.description.length > 500) {
    form.description = form.description.substring(0, 500)
  }

  return isValid
}

const submitReport = async () => {
  // Validate form
  if (!validateForm()) {
    // Scroll đến lỗi đầu tiên
    const firstError = Object.keys(validationErrors).find(key => validationErrors[key])
    if (firstError) {
      const errorElement = document.getElementById(firstError)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        errorElement.focus()
      }
    }
    return
  }

  // Bắt đầu submit
  isSubmitting.value = true

  // Tạo payload theo định dạng API
  const payload = {
    listingId: props.listingId,
    reason: form.reason,
    description: form.description.trim(),
    contactOptIn: form.contactOptIn,
  }

  // Nếu đã đăng nhập, backend sẽ tự lấy thông tin từ auth
  // Nếu chưa đăng nhập và muốn liên hệ, gửi thêm thông tin liên hệ
  if (!isLoggedIn.value && form.contactOptIn) {
    payload.email = form.email.trim()
    payload.phone = form.phone.trim()
    payload.reporterName = form.reporterName.trim()
  }

  try {
    // Gọi API
    const response = await api.post(API_URL, payload)

    // Kiểm tra response
    if (response.status === 200) {
      // Lấy message từ backend
      const successMessage = response.data?.status === 'success'
          ? response.data.message
          : response.data

      // Đóng modal
      isModalOpen.value = false
      isSubmitting.value = false

      // Hiển thị thông báo thành công bằng SweetAlert
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: successMessage || 'Báo cáo đã được gửi thành công',
          confirmButtonText: 'Đóng',
          confirmButtonColor: '#2196f3',
          timer: 3000,
          timerProgressBar: true,
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
        })
      }, 100)

    } else {
      throw new Error(response.data?.message || 'Có lỗi xảy ra')
    }

  } catch (error) {
    console.error('Lỗi khi gửi báo cáo:', error)

    let errorMessage = 'Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.'
    let icon = 'error'
    let title = 'Lỗi!'

    // Kiểm tra lỗi spam (status 429)
    if (error.response?.status === 429) {
      errorMessage = error.response.data?.message || 'Bạn đã báo cáo sản phẩm này trước đó. Vui lòng không spam báo cáo.'
      icon = 'warning'
      title = 'Thông báo'
    }
    // Các lỗi khác
    else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    // Hiển thị thông báo lỗi bằng SweetAlert
    Swal.fire({
      icon: icon,
      title: title,
      text: errorMessage,
      confirmButtonText: 'Đóng',
      confirmButtonColor: icon === 'warning' ? '#ff9800' : '#f44336',
      showClass: {
        popup: 'animate__animated animate__shakeX'
      }
    })

    isSubmitting.value = false
  }
}

// Đóng modal bằng phím ESC
const handleKeydown = (e) => {
  if (e.key === 'Escape' && isModalOpen.value && !isSubmitting.value) {
    closeModal()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.report-listing {
  display: inline-block;
}

/* Button styles */
.report-button {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.2);
}

.report-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.report-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.report-button:active:not(:disabled) {
  transform: translateY(0);
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal container */
.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease;
  position: relative;
  margin: auto;
}

/* Tạo lớp bảo vệ border-radius */
.modal-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 1;
}

/* Tùy chỉnh scrollbar */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 0 16px 16px 0;
  margin: 16px 0;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Cho Firefox */
.modal-container {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal header */
.modal-header {
  display: flex;
  align-items: flex-start;
  padding: 24px 32px 20px;
  border-bottom: 1px solid #eaeaea;
  background: linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%);
  border-radius: 16px 16px 0 0;
  position: relative;
}

.modal-icon {
  background: linear-gradient(135deg, #f44336 0%, #ff9800 100%);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 16px;
  flex-shrink: 0;
}

.modal-title-wrapper {
  flex: 1;
}

.modal-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
}

.modal-subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.close-button {
  background: #f5f5f5;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 16px;
}

.close-button:hover:not(:disabled) {
  background: #e0e0e0;
  color: #333;
  transform: rotate(90deg);
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal body */
.modal-body {
  padding: 24px 32px;
}

/* Form styles */
.report-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.label-text {
  font-size: 15px;
}

.required {
  color: #f44336;
  font-weight: bold;
}

.optional {
  color: #666;
  font-size: 12px;
  font-weight: normal;
}

/* Select */
.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
}

.form-select:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-select.error {
  border-color: #f44336;
  background: #fff5f5;
}

.form-select:disabled {
  background: #f9f9f9;
  cursor: not-allowed;
  opacity: 0.7;
}

.select-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
  font-size: 14px;
}

/* Textarea */
.textarea-wrapper {
  position: relative;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.form-textarea:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-textarea:disabled {
  background: #f9f9f9;
  cursor: not-allowed;
  opacity: 0.7;
}

.char-count {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 12px;
  color: #999;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 10px;
}

.form-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  margin-top: 4px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #ff9800;
}

.form-hint i {
  color: #ff9800;
}

/* Contact section */
.contact-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-top: 8px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px;
  font-size: 16px;
  color: #333;
}

.section-title i {
  color: #2196f3;
}

.section-subtitle {
  margin: 0;
  font-size: 13px;
  color: #666;
}

/* Checkbox */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-checkbox {
  display: none;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.checkbox-box {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: white;
}

.checkbox-box i {
  font-size: 12px;
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.form-checkbox:checked + .checkbox-label .checkbox-box {
  background: #2196f3;
  border-color: #2196f3;
}

.form-checkbox:checked + .checkbox-label .checkbox-box i {
  opacity: 1;
}

.checkbox-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* Contact details */
.contact-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-top: 0;
  padding-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* Input with icon */
.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-input.error {
  border-color: #f44336;
  background: #fff5f5;
}

.form-input:disabled {
  background: #f9f9f9;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Logged in notice */
.logged-in-notice {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
}

.notice-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notice-content i {
  font-size: 24px;
  color: #4caf50;
  flex-shrink: 0;
}

.notice-text {
  flex: 1;
}

.notice-text strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.notice-text p {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* Validation error */
.validation-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #f44336;
  margin-top: 4px;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.validation-error i {
  font-size: 14px;
}

/* Modal actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
  padding: 12px 0;
  border-top: 1px solid #eaeaea;
  position: sticky;
  bottom: 0;
  background-color: white;
}

.cancel-button,
.submit-button {
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 140px;
}

.cancel-button {
  background: #f5f5f5;
  color: #666;
}

.cancel-button:hover:not(:disabled) {
  background: #e0e0e0;
  transform: translateY(-1px);
}

.submit-button {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.cancel-button:disabled,
.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .modal-header {
    padding: 20px 20px 16px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .modal-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-actions {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .cancel-button,
  .submit-button {
    width: 100%;
    min-width: auto;
  }

  .contact-section {
    padding: 16px;
  }

  .section-title {
    font-size: 15px;
  }

  .modal-title {
    font-size: 20px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background: #1e1e1e;
    color: #fff;
  }

  .modal-title {
    color: #fff;
  }

  .modal-subtitle {
    color: #aaa;
  }

  .close-button {
    background: #2d2d2d;
    color: #aaa;
  }

  .form-select,
  .form-input,
  .form-textarea {
    background: #2d2d2d;
    border-color: #444;
    color: #fff;
  }

  .form-select:focus,
  .form-input:focus,
  .form-textarea:focus {
    border-color: #2196f3;
  }

  .contact-section {
    background: #252525;
  }

  .form-hint {
    background: #2d2d2d;
    color: #aaa;
  }

  .logged-in-notice {
    background: linear-gradient(135deg, #252525 0%, #2d2d2d 100%);
  }

  .notice-text strong {
    color: #fff;
  }

  .notice-text p {
    color: #aaa;
  }

  .modal-actions {
    border-top-color: #444;
  }

  .cancel-button {
    background: #2d2d2d;
    color: #fff;
  }

  .checkbox-text {
    color: #fff;
  }

  .checkbox-box {
    background: #2d2d2d;
    border-color: #444;
  }

  .char-count {
    background: rgba(45, 45, 45, 0.9);
    color: #aaa;
  }

  /* Dark mode scrollbar */
  .modal-container::-webkit-scrollbar-track {
    background: #2d2d2d;
  }

  .modal-container::-webkit-scrollbar-thumb {
    background: #555;
  }

  .modal-container::-webkit-scrollbar-thumb:hover {
    background: #666;
  }

  .modal-container {
    scrollbar-color: #555 #2d2d2d;
  }
}
</style>