<template>
  <!-- ForgotPassword Modal - Bước 1: Nhập email -->
  <div v-if="currentStep === 1" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <button class="close-btn" @click="closeModal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="modal-header">
        <h2>Quên mật khẩu</h2>
        <p class="subtitle">Nhập email để nhận mã xác nhận</p>
      </div>

      <div class="progress-steps">
        <div class="step active">
          <div class="step-number">1</div>
          <div class="step-label">Nhập email</div>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-label">Nhập mã xác nhận</div>
        </div>
      </div>

      <form @submit.prevent="handleSendOtp" class="step-form">
        <div class="form-group">
          <label for="forgot-email">Email đăng ký</label>
          <input
              id="forgot-email"
              v-model="email"
              type="email"
              placeholder="Nhập email của bạn"
              required
              autofocus
          >
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Đang gửi...' : 'Gửi mã xác nhận' }}
        </button>
      </form>

      <div class="back-to-login">
        <button type="button" class="back-btn" @click="handleBackToLogin">
          ← Quay lại đăng nhập
        </button>
      </div>
    </div>
  </div>

  <!-- OTPVerifyModal - Bước 2: Chỉ nhập OTP, KHÔNG auto-submit -->
  <OTPVerifyModal
      v-else-if="currentStep === 2"
      :mode="'forgot-password'"
      :email="email"
      :title="'Xác thực OTP'"
      :subtitle="'Nhập mã xác nhận 6 số'"
      :instruction-text="'Chúng tôi đã gửi mã xác nhận 6 số đến email:'"
      :submit-button-text="'Xác nhận OTP'"
      :back-button-text="'Quay lại nhập email'"
      :step1-label="'Nhập email'"
      :step2-label="'Xác nhận OTP'"
      :show-steps="true"
      :show-back-button="true"
      :show-password-section="false"
      :auto-submit-on-complete="false"
      @close="handleCloseOTPModal"
      @verify="handleVerifyOTP"
      @resend="handleResendOTP"
      @back="handleBackToEmail"
  />

  <!-- OTPVerifyModal - Bước 3: Nhập mật khẩu mới sau khi OTP đã được xác thực -->
  <OTPVerifyModal
      v-else-if="currentStep === 3"
      :mode="'forgot-password'"
      :email="email"
      :title="'Đặt mật khẩu mới'"
      :subtitle="'Tạo mật khẩu mới cho tài khoản của bạn'"
      :instruction-text="'OTP đã được xác thực. Vui lòng tạo mật khẩu mới:'"
      :submit-button-text="'Đổi mật khẩu'"
      :back-button-text="'Quay lại nhập OTP'"
      :step1-label="'Nhập email'"
      :step2-label="'Đổi mật khẩu'"
      :show-steps="true"
      :show-back-button="true"
      :show-password-section="true"
      :auto-submit-on-complete="false"
      @close="handleCloseOTPModal"
      @verify="handleResetPassword"
      @resend="handleResendOTP"
      @back="handleBackToOTP"
      @success="handleResetSuccess"
  />
</template>

<script setup>
import { ref } from 'vue'
import api from '/src/api/api.js'
import Swal from 'sweetalert2'
import OTPVerifyModal from './OTPVerifyModal.vue'

const emit = defineEmits(['close', 'back-to-login'])

// State
const currentStep = ref(1) // 1: Nhập email, 2: Xác thực OTP, 3: Đổi mật khẩu
const email = ref('')
const otpCode = ref('') // Lưu OTP đã xác thực
const isLoading = ref(false)

// ============================================
// SweetAlert2 Helper Functions
// ============================================
const showLoadingAlert = (title = 'Đang xử lý...') => {
  Swal.fire({
    title: title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading()
    }
  })
}

const showSuccessAlert = (title, text = '') => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: text,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false
  })
}

const showErrorAlert = (title, text = '') => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
    confirmButtonText: 'OK',
    confirmButtonColor: '#f59e0b'
  })
}

const showConfirmAlert = (title, text, confirmText = 'Xác nhận') => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#64748b'
  })
}

// ============================================
// 1️⃣ BƯỚC 1: GỬI OTP QUA EMAIL
// ============================================
const handleSendOtp = async () => {
  const isEmailValid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email.value)
  if (!isEmailValid) {
    showErrorAlert('Email không hợp lệ!', 'Vui lòng nhập địa chỉ email hợp lệ.')
    return
  }

  isLoading.value = true
  showLoadingAlert('Đang gửi OTP...')

  try {
    const response = await api.post("/thg/api/auth/forgot-password", {
      email: email.value
    })

    if (response.data?.success) {
      Swal.close() // Đóng loading
      showSuccessAlert('Đã gửi OTP!', 'Hãy kiểm tra email của bạn.')
      currentStep.value = 2
    } else {
      Swal.close() // Đóng loading
      showErrorAlert('Lỗi gửi OTP!', response.data?.message || 'Không gửi được OTP.')
    }
  } catch (err) {
    console.error('Send OTP error:', err)
    const msg = err.response?.data?.message || "Không gửi được OTP."

    Swal.close() // Đóng loading
    showErrorAlert('Lỗi gửi OTP!', msg)
  } finally {
    isLoading.value = false
  }
}

// ============================================
// 2️⃣ BƯỚC 2: XÁC THỰC OTP
// ============================================
const handleVerifyOTP = async (otp) => {
  showLoadingAlert('Đang xác thực OTP...')

  try {
    const response = await api.post("/thg/api/auth/verify-otp", {
      email: email.value,
      otp: otp,
      type: 'reset-password'
    })

    if (response.data?.success) {
      Swal.close() // Đóng loading
      showSuccessAlert('Xác thực OTP thành công!')

      // Đợi thông báo hiển thị trước khi chuyển bước
      setTimeout(() => {
        otpCode.value = otp
        currentStep.value = 3
      }, 1500)

    } else {
      Swal.close() // Đóng loading
      showErrorAlert('OTP không hợp lệ!', response.data?.message || 'Mã OTP sai.')
    }
  } catch (err) {
    console.error('Verify OTP error:', err)
    const msg = err.response?.data?.message || "Xác thực OTP thất bại."

    Swal.close() // Đóng loading
    showErrorAlert('Lỗi xác thực!', msg)
  }
}

// ============================================
// 3️⃣ BƯỚC 3: ĐỔI MẬT KHẨU
// ============================================
const handleResetPassword = async ({ code, password, confirmPassword }) => {
  if (password.length < 8) {
    showErrorAlert('Mật khẩu quá ngắn!', 'Mật khẩu phải có ít nhất 8 ký tự.')
    return
  }

  if (password !== confirmPassword) {
    showErrorAlert('Mật khẩu không khớp!', 'Mật khẩu xác nhận không khớp với mật khẩu mới.')
    return
  }

  showLoadingAlert('Đang đổi mật khẩu...')

  try {
    const response = await api.post("/thg/api/auth/reset-password", {
      email: email.value,
      otp: otpCode.value,
      newPassword: password,
      confirmNewPassword: confirmPassword
    })

    if (response.data?.success) {
      Swal.close() // Đóng loading
      showSuccessAlert('Đổi mật khẩu thành công!', 'Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.')

      setTimeout(() => {
        closeModal()
        emit('back-to-login')
      }, 2000)
    } else {
      Swal.close() // Đóng loading
      showErrorAlert('Đổi mật khẩu thất bại!', response.data?.message || 'Không thể đổi mật khẩu.')
    }
  } catch (err) {
    console.error('Reset password error:', err)
    const msg = err.response?.data?.message || "Không thể đổi mật khẩu."

    Swal.close() // Đóng loading
    showErrorAlert('Lỗi đổi mật khẩu!', msg)
  }
}

// ============================================
// 4️⃣ GỬI LẠI OTP
// ============================================
const handleResendOTP = async (emailToResend) => {
  const result = await showConfirmAlert(
      'Gửi lại OTP',
      'Bạn có chắc muốn gửi lại mã OTP?',
      'Gửi lại'
  )

  if (!result.isConfirmed) return

  showLoadingAlert('Đang gửi lại OTP...')

  try {
    const response = await api.post("/thg/api/auth/forgot-password", {
      email: emailToResend || email.value
    })

    if (response.data?.success) {
      Swal.close() // Đóng loading
      showSuccessAlert('Đã gửi lại OTP!', 'Vui lòng kiểm tra email của bạn.')
    } else {
      Swal.close() // Đóng loading
      showErrorAlert('Lỗi gửi lại OTP!', response.data?.message || 'Không thể gửi lại OTP.')
    }
  } catch (err) {
    console.error('Resend OTP error:', err)
    Swal.close() // Đóng loading
    showErrorAlert('Lỗi gửi lại OTP!', err.response?.data?.message || 'Không thể gửi lại OTP.')
  }
}

// ============================================
// 5️⃣ NAVIGATION HANDLERS
// ============================================
const handleBackToEmail = () => {
  currentStep.value = 1
}

const handleBackToOTP = () => {
  currentStep.value = 2
}

const handleBackToLogin = () => {
  closeModal()
  emit('back-to-login')
}

const handleCloseOTPModal = () => {
  closeModal()
}

const handleResetSuccess = (data) => {
  showSuccessAlert('Đổi mật khẩu thành công!', 'Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.')

  setTimeout(() => {
    closeModal()
    emit('back-to-login')
  }, 2000)
}

const closeModal = () => {
  // Reset state
  currentStep.value = 1
  email.value = ''
  otpCode.value = ''
  isLoading.value = false
  emit('close')
}
</script>

<style scoped>
/* Giữ nguyên tất cả style từ ForgotPassword.vue gốc */
/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 800;
  animation: fadeIn 0.3s ease;
}

/* Modal container */
.modal-container {
  background: #f8fafc;
  border-radius: 16px;
  padding: 40px;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08),
  0 10px 10px -5px rgba(0, 0, 0, 0.02);
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Close button */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1e293b;
  transform: rotate(90deg);
}

/* Header */
.modal-header {
  display: block;
  text-align: center;
  margin-bottom: 32px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.modal-header .subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Progress Steps */
.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-width: 100px;
  opacity: 0.5;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step.active {
  opacity: 1;
}

.step.completed .step-number {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05),
  0 8px 10px -6px rgba(0, 0, 0, 0.01);
}

.step-label {
  font-size: 12px;
  color: #64748b;
  text-align: center;
  font-weight: 500;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  max-width: 80px;
}

.step.active .step-line {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

/* Step Form */
.step-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Form styles */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 4px;
}

input {
  padding: 14px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  background: #ffffff;
  color: #1e293b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.03);
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

/* Submit button */
.submit-btn {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  position: relative;
  overflow: hidden;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.submit-btn:hover:not(:disabled)::after {
  left: 100%;
}

/* Back to Login */
.back-to-login {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.back-btn {
  background: none;
  border: none;
  color: #64748b;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-btn:hover {
  color: #1e293b;
  background: rgba(0, 0, 0, 0.05);
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    padding: 24px;
    width: 95%;
    margin: 16px;
  }

  .progress-steps {
    margin-bottom: 32px;
  }

  .step {
    min-width: 80px;
  }

  .step-line {
    max-width: 40px;
  }
}

/* Scrollbar styling */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>