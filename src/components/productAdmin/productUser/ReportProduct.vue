<template>
  <div class="report-listing">
    <!-- Button kích hoạt modal -->
    <button
        class="report-button"
        @click="openModal"
        :disabled="isSubmitting"
    >
      <span v-if="!isSubmitting"><i class="fa-solid fa-triangle-exclamation"></i> Báo cáo tin này</span>
      <span v-else class="loading-text">Đang xử lý...</span>
    </button>

    <!-- Modal overlay -->
    <transition name="fade">
      <div
          v-if="isModalOpen"
          class="modal-overlay"
          @click.self="closeModal"
      >
        <!-- Modal content -->
        <transition name="modal">
          <div class="modal-container" v-if="isModalOpen">
            <!-- Modal header -->
            <div class="modal-header">
              <h2 class="modal-title">Báo cáo tin đăng</h2>
              <button class="close-button" @click="closeModal" :disabled="isSubmitting">
                &times;
              </button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
              <form @submit.prevent="submitReport">
                <!-- Lý do báo cáo -->
                <div class="form-group">
                  <label class="form-label" for="reason">Lý do báo cáo</label>
                  <select
                      id="reason"
                      v-model="form.reason"
                      class="form-select"
                      :class="{ 'error': validationErrors.reason }"
                      :disabled="isSubmitting"
                  >
                    <option value="" disabled>Vui lòng chọn lý do</option>
                    <option
                        v-for="reason in reportReasons"
                        :key="reason.value"
                        :value="reason.value"
                    >
                      {{ reason.text }}
                    </option>
                  </select>
                  <div v-if="validationErrors.reason" class="error-message">
                    {{ validationErrors.reason }}
                  </div>
                </div>

                <!-- Mô tả chi tiết -->
                <div class="form-group">
                  <label class="form-label" for="description">Mô tả chi tiết</label>
                  <textarea
                      id="description"
                      v-model="form.description"
                      class="form-textarea"
                      placeholder="Vui lòng cung cấp thông tin chi tiết về vấn đề bạn gặp phải..."
                      rows="4"
                      :disabled="isSubmitting"
                  ></textarea>
                </div>

                <!-- Checkbox liên hệ -->
                <div class="form-group checkbox-group" v-if="!isLoggedIn">
                  <input
                      type="checkbox"
                      id="contactOptIn"
                      v-model="form.contactOptIn"
                      class="form-checkbox"
                      :disabled="isSubmitting"
                  />
                  <label for="contactOptIn" class="checkbox-label">
                    Bạn có muốn để lại thông tin để chúng tôi liên hệ xác minh?
                  </label>
                </div>

                <!-- Thông tin liên hệ (chỉ hiển thị khi chưa đăng nhập và checkbox được chọn) -->
                <div v-if="form.contactOptIn && !isLoggedIn" class="contact-info">
                  <div class="form-group">
                    <label class="form-label" for="email">Email</label>
                    <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        class="form-input"
                        :class="{ 'error': validationErrors.email }"
                        placeholder="Nhập email của bạn"
                        :disabled="isSubmitting"
                    />
                    <div v-if="validationErrors.email" class="error-message">
                      {{ validationErrors.email }}
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="phone">Số điện thoại</label>
                    <input
                        id="phone"
                        v-model="form.phone"
                        type="tel"
                        class="form-input"
                        placeholder="Nhập số điện thoại của bạn"
                        :disabled="isSubmitting"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="fullname">Họ và tên</label>
                    <input
                        id="fullname"
                        v-model="form.reporterName"
                        type="text"
                        class="form-input"
                        placeholder="Nhập họ và tên của bạn"
                        :disabled="isSubmitting"
                    />
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
                    Huỷ
                  </button>
                  <button
                      type="submit"
                      class="submit-button"
                      :disabled="isSubmitting"
                  >
                    <span v-if="!isSubmitting">Gửi báo cáo</span>
                    <div v-else class="spinner"></div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Success message -->
    <transition name="fade">
      <div v-if="showSuccessMessage" class="success-message">
        <div class="success-content">
          <div class="success-icon">✓</div>
          <h3>Báo cáo đã được gửi thành công!</h3>
          <p>Cảm ơn bạn đã đóng góp. Chúng tôi sẽ xem xét báo cáo của bạn trong thời gian sớm nhất.</p>
          <button class="success-button" @click="showSuccessMessage = false">Đóng</button>
        </div>
      </div>
    </transition>

    <!-- Error message -->
    <transition name="fade">
      <div v-if="showErrorMessage" class="success-message">
        <div class="success-content">
          <div class="success-icon" style="background-color: #f44336;">✕</div>
          <h3>Có lỗi xảy ra!</h3>
          <p>{{ errorMessage }}</p>
          <button class="success-button" @click="showErrorMessage = false">Đóng</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from "../../../stores/authStore.js";
import api from "../../../api/api.js";

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
const showSuccessMessage = ref(false)
const showErrorMessage = ref(false)
const errorMessage = ref('')

// API endpoint - cập nhật đường dẫn API của bạn
const API_URL = '/thg/public-view/product-report/save-report'

// Danh sách lý do báo cáo
const reportReasons = ref([
  { value: 'sold_still_posted', text: '1. Tin đã bán nhưng vẫn đăng' },
  { value: 'incorrect_info', text: '2. Thông tin sai lệch (giá, diện tích, hình ảnh)' },
  { value: 'spam', text: '3. Tin spam / quảng cáo không liên quan' },
  { value: 'scam', text: '4. Có dấu hiệu lừa đảo (scam)' },
  { value: 'legal_violation', text: '5. Vi phạm pháp lý / giả mạo' },
  { value: 'other', text: '6. Khác' }
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

  // Reset error message
  showErrorMessage.value = false
  errorMessage.value = ''
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
      validationErrors.email = 'Vui lòng nhập email'
      isValid = false
    } else if (!emailRegex.test(form.email)) {
      validationErrors.email = 'Email không hợp lệ'
      isValid = false
    }
  }

  return isValid
}

const submitReport = async () => {
  // Validate form
  if (!validateForm()) {
    return
  }

  // Bắt đầu submit
  isSubmitting.value = true

  // Tạo payload theo định dạng API
  const payload = {
    listingId: props.listingId,
    reason: form.reason,
    description: form.description,
    contactOptIn: form.contactOptIn,
    createdAt: new Date().toISOString()
  }

  // Nếu đã đăng nhập, backend sẽ tự lấy thông tin từ auth
  // Nếu chưa đăng nhập và muốn liên hệ, gửi thêm thông tin liên hệ
  if (!isLoggedIn.value && form.contactOptIn) {
    payload.email = form.email
    payload.phone = form.phone
    payload.reporterName = form.reporterName
  }

  // Nếu đã đăng nhập, có thể thêm thông tin user vào payload nếu backend cần
  if (isLoggedIn.value) {
    payload.userId = auth.userInfo.id // Giả sử auth store có userInfo.id
    payload.email = auth.userInfo.email // Nếu có email trong userInfo
  }

  try {
    // Gọi API bằng api.post
    const response = await api.post(API_URL, payload)

    // Kiểm tra response theo cấu trúc của API của bạn
    if (response.status === 200 || response.data?.status === 'success') {
      // Hiển thị thông báo thành công
      showSuccessMessage.value = true

      // Đóng modal sau 100ms
      setTimeout(() => {
        isModalOpen.value = false
        isSubmitting.value = false
      }, 100)

      // Tự động đóng thông báo thành công sau 5 giây
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 5000)
    } else {
      // Xử lý lỗi từ server
      throw new Error(response.data?.message || 'Có lỗi xảy ra khi gửi báo cáo')
    }

  } catch (error) {
    console.error('Lỗi khi gửi báo cáo:', error)

    // Xử lý lỗi từ api.post (có thể có cấu trúc khác)
    let errorMsg = 'Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.'

    if (error.response?.data?.message) {
      errorMsg = error.response.data.message
    } else if (error.message) {
      errorMsg = error.message
    } else if (error.data?.message) {
      errorMsg = error.data.message
    }

    // Hiển thị thông báo lỗi
    errorMessage.value = errorMsg
    showErrorMessage.value = true

    isSubmitting.value = false

    // Tự động đóng thông báo lỗi sau 5 giây
    setTimeout(() => {
      showErrorMessage.value = false
    }, 5000)
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
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.report-button:hover:not(:disabled) {
  background-color: #d32f2f;
  transform: translateY(-1px);
}

.report-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.report-button:active:not(:disabled) {
  transform: translateY(0);
}

.loading-text {
  display: inline-flex;
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* Modal container */
.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Modal header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  color: #777;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover:not(:disabled) {
  background-color: #f5f5f5;
  color: #333;
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal body */
.modal-body {
  padding: 24px;
}

/* Form styles */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-label::after {
  content: ' *';
  color: #f44336;
  opacity: 0.8;
}

.form-select,
.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.form-select.error,
.form-input.error {
  border-color: #f44336;
}

.form-select:disabled,
.form-input:disabled,
.form-textarea:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

/* Checkbox */
.checkbox-group {
  display: flex;
  align-items: flex-start;
}

.form-checkbox {
  margin-top: 4px;
  margin-right: 10px;
  cursor: pointer;
}

.form-checkbox:disabled {
  cursor: not-allowed;
}

.checkbox-label {
  font-weight: normal;
  cursor: pointer;
  user-select: none;
}

/* Contact info */
.contact-info {
  margin-top: 20px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid #2196f3;
}

/* Modal actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.cancel-button,
.submit-button {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #333;
}

.cancel-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.submit-button {
  background-color: #2196f3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.submit-button:hover:not(:disabled) {
  background-color: #0b7dda;
}

.cancel-button:disabled,
.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Success message */
.success-message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.success-content {
  background-color: white;
  border-radius: 8px;
  padding: 32px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.success-icon {
  width: 60px;
  height: 60px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  margin: 0 auto 20px;
}

.success-content h3 {
  margin: 0 0 12px;
  color: #333;
}

.success-content p {
  margin: 0 0 24px;
  color: #666;
  line-height: 1.5;
}

.success-button {
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.success-button:hover {
  background-color: #0b7dda;
}

/* Animation for modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active {
  animation: modal-enter 0.3s ease-out;
}

.modal-leave-active {
  animation: modal-leave 0.2s ease-in;
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-leave {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
}

/* Responsive */
@media (max-width: 576px) {
  .modal-container {
    max-width: 100%;
    margin: 10px;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .cancel-button,
  .submit-button {
    width: 100%;
  }
}
</style>