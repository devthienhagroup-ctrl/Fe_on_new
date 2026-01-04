<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <button class="close-btn" @click="closeModal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="modal-header">
        <h2>{{ title }}</h2>
        <p class="subtitle">{{ subtitle }}</p>
      </div>

      <div class="progress-steps" v-if="showSteps">
        <div class="step completed">
          <div class="step-number">1</div>
          <div class="step-label">{{ step1Label }}</div>
        </div>
        <div class="step-line completed"></div>
        <div class="step active">
          <div class="step-number">2</div>
          <div class="step-label">{{ step2Label }}</div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="step-form">
        <div class="verification-instruction" v-if="!showNewPassword && email">
          <p>{{ instructionText }}</p>
          <p class="email-display">{{ maskedEmail }}</p>
          <p class="resend-text">
            Không nhận được mã?
            <button type="button" class="resend-btn" @click="resendCode" :disabled="resendCooldown > 0">
              Gửi lại {{ resendCooldown > 0 ? `(${resendCooldown}s)` : '' }}
            </button>
          </p>
        </div>

        <div class="verification-code" v-if="!showNewPassword">
          <input
              v-for="i in 6"
              :key="i"
              :ref="el => { codeInputs[i-1] = el }"
              v-model="verificationCode[i-1]"
              type="text"
              maxlength="1"
              @input="onCodeInput(i-1)"
              @keydown.delete="onCodeDelete(i-1)"
              @paste="onPaste"
              @focus="onCodeFocus(i-1)"
          />
        </div>

        <div class="new-password-section" v-if="showNewPassword && mode === 'forgot-password'">
          <div class="form-group">
            <label for="new-password">Mật khẩu mới</label>
            <input
                id="new-password"
                v-model="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                required
                :autofocus="showNewPassword"
            >
          </div>

          <div class="form-group">
            <label for="confirm-new-password">Xác nhận mật khẩu</label>
            <input
                id="confirm-new-password"
                v-model="confirmNewPassword"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                required
            >
          </div>
        </div>

        <slot name="additional-content" v-if="showNewPassword && mode !== 'forgot-password'"></slot>

        <button type="submit" class="submit-btn" :disabled="!isCodeComplete || isLoading">
          {{ isLoading ? 'Đang xử lý...' : submitButtonText }}
        </button>
      </form>

      <div class="back-to-login" v-if="showBackButton">
        <button type="button" class="back-btn" @click="$emit('back')">
          ← {{ backButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import api from '/src/api/api.js'
import Swal from 'sweetalert2'

const props = defineProps({
  // Cấu hình cơ bản
  mode: {
    type: String,
    default: 'forgot-password',
  },
  email: {
    type: String,
    default: '',
  },
  registerData: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: 'Xác thực OTP',
  },
  subtitle: {
    type: String,
    default: 'Nhập mã xác nhận 6 số',
  },
  instructionText: {
    type: String,
    default: 'Chúng tôi đã gửi mã xác nhận 6 số đến email:',
  },
  submitButtonText: {
    type: String,
    default: 'Xác nhận',
  },
  backButtonText: {
    type: String,
    default: 'Quay lại',
  },
  step1Label: {
    type: String,
    default: 'Nhập email',
  },
  step2Label: {
    type: String,
    default: 'Nhập mã xác nhận',
  },
  showSteps: {
    type: Boolean,
    default: true,
  },
  showBackButton: {
    type: Boolean,
    default: true,
  },
  showPasswordSection: {
    type: Boolean,
    default: false,
  },
  autoSubmitOnComplete: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close', 'verify', 'resend', 'back', 'success', 'register-success'])

// State
const verificationCode = reactive(Array(6).fill(''))
const codeInputs = ref([])
const newPassword = ref('')
const confirmNewPassword = ref('')
const showNewPassword = ref(props.showPasswordSection)
const resendCooldown = ref(0)
const isLoading = ref(false)

// Computed
const maskedEmail = computed(() => {
  if (!props.email) return ''
  const [local, domain] = props.email.split('@')
  const maskedLocal = local.length > 3
      ? local.substring(0, 3) + '*'.repeat(local.length - 3)
      : '*'.repeat(local.length)
  return `${maskedLocal}@${domain}`
})

const isCodeComplete = computed(() => {
  return verificationCode.every(code => code !== '')
})

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

// Methods
const closeModal = () => {
  emit('close')
}

const onCodeInput = (index) => {
  const value = verificationCode[index]

  // Only allow numbers
  if (value && !/^\d$/.test(value)) {
    verificationCode[index] = ''
    return
  }

  // Move to next input if value entered
  if (value && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }

  // If all digits entered, auto-submit
  if (index === 5 && isCodeComplete.value && props.autoSubmitOnComplete) {
    handleAutoVerify()
  }
}

const onCodeDelete = (index) => {
  if (!verificationCode[index] && index > 0) {
    // Move to previous input on backspace
    codeInputs.value[index - 1]?.focus()
  }
}

const onCodeFocus = (index) => {
  // Select all text when focused
  codeInputs.value[index]?.select()
}

const onPaste = (event) => {
  event.preventDefault()
  const pasteData = event.clipboardData.getData('text').slice(0, 6)

  if (/^\d+$/.test(pasteData)) {
    // Fill in the code
    for (let i = 0; i < pasteData.length; i++) {
      if (i < 6) {
        verificationCode[i] = pasteData[i]
      }
    }

    // Focus last input
    const lastIndex = Math.min(pasteData.length - 1, 5)
    codeInputs.value[lastIndex]?.focus()

    // Auto-submit if complete
    if (pasteData.length === 6 && props.autoSubmitOnComplete) {
      handleAutoVerify()
    }
  }
}

const handleAutoVerify = () => {
  if (props.mode === 'forgot-password') {
    showNewPassword.value = true
    nextTick(() => {
      document.getElementById('new-password')?.focus()
    })
  } else if (props.mode === 'register') {
    handleSubmit()
  } else {
    emit('verify', verificationCode.join(''))
  }
}

const handleSubmit = async () => {
  if (!isCodeComplete.value) return
  if (isLoading.value) return

  isLoading.value = true

  try {
    // ============================================
    // 1. MODE: FORGOT PASSWORD (Có nhập password mới)
    // ============================================
    if (showNewPassword.value && props.mode === 'forgot-password') {
      if (newPassword.value !== confirmNewPassword.value) {
        showErrorAlert('Mật khẩu không khớp!', 'Mật khẩu xác nhận không khớp với mật khẩu mới.')
        isLoading.value = false
        return
      }

      if (newPassword.value.length < 8) {
        showErrorAlert('Mật khẩu quá ngắn!', 'Mật khẩu phải có ít nhất 8 ký tự.')
        isLoading.value = false
        return
      }

      const otpCode = verificationCode.join('')
      showLoadingAlert('Đang đổi mật khẩu...')

      const response = await api.post("/thg/api/auth/reset-password", {
        email: props.email,
        otp: otpCode,
        newPassword: newPassword.value,
        confirmNewPassword: confirmNewPassword.value
      })

      if (response.data.success) {
        Swal.close()
        showSuccessAlert("Đổi mật khẩu thành công!")
        emit('success', {
          email: props.email,
          code: otpCode,
          newPassword: newPassword.value,
        })
        emit('close')
      } else {
        Swal.close()
        showErrorAlert("Đổi mật khẩu thất bại!", response.data.message || "Không thể đổi mật khẩu.")
      }
    }

        // ============================================
        // 2. MODE: REGISTER (Đăng ký tài khoản)
    // ============================================
    else if (props.mode === 'register' && props.registerData) {
      const otpCode = verificationCode.join('')

      const registerData = {
        ...props.registerData,
        otp: otpCode
      }

      showLoadingAlert('Đang đăng ký...')

      const response = await api.post("/thg/api/auth/register", registerData)

      if (response.data.success) {
        Swal.close()
        showSuccessAlert("Đăng ký thành công!")

        emit('register-success', {
          ...response.data,
          email: props.email,
          otp: otpCode
        })
      } else {
        Swal.close()
        showErrorAlert("Đăng ký thất bại!", response.data.message || "Không thể đăng ký.")
      }
    }

        // ============================================
        // 3. MODE: VERIFY EMAIL (Xác thực email)
    // ============================================
    else if (props.mode === 'verify-email') {
      const otpCode = verificationCode.join('')

      showLoadingAlert('Đang xác thực email...')

      const response = await api.post("/thg/api/auth/verify-email", {
        email: props.email,
        otp: otpCode
      })

      if (response.data.success) {
        Swal.close()
        showSuccessAlert("Xác thực email thành công!")
        emit('verify', otpCode)
        emit('close')
      } else {
        Swal.close()
        showErrorAlert("Xác thực email thất bại!", response.data.message || "Không thể xác thực email.")
      }
    }

        // ============================================
        // 4. MODE: TWO-FACTOR (Xác thực 2 lớp)
    // ============================================
    else if (props.mode === 'two-factor') {
      const otpCode = verificationCode.join('')

      showLoadingAlert('Đang xác thực 2 lớp...')

      const response = await api.post("/thg/api/auth/verify-2fa", {
        code: otpCode
      })

      if (response.data.success) {
        Swal.close()
        showSuccessAlert("Xác thực 2 lớp thành công!")
        emit('verify', otpCode)
        emit('close')
      } else {
        Swal.close()
        showErrorAlert("Xác thực 2 lớp thất bại!", response.data.message || "Không thể xác thực 2 lớp.")
      }
    }

        // ============================================
        // 5. MODE: FORGOT PASSWORD (Bước 1 - Chỉ xác thực OTP)
    // ============================================
    else if (props.mode === 'forgot-password') {
      const otpCode = verificationCode.join('')

      showLoadingAlert('Đang xác thực OTP...')

      const verifyResponse = await api.post("/thg/api/auth/verify-otp", {
        email: props.email,
        otp: otpCode,
        type: 'reset-password'
      })

      if (verifyResponse.data.success) {
        Swal.close()
        // Không hiển thị alert ở đây vì sẽ chuyển sang nhập mật khẩu
        showNewPassword.value = true
        nextTick(() => {
          document.getElementById('new-password')?.focus()
        })
      } else {
        Swal.close()
        showErrorAlert("OTP không hợp lệ!", verifyResponse.data.message || "Mã OTP không đúng.")
      }
    }

        // ============================================
        // 6. MODE KHÁC VỚI PASSWORD SECTION
    // ============================================
    else if (showNewPassword.value) {
      const otpCode = verificationCode.join('')

      if (newPassword.value !== confirmNewPassword.value) {
        showErrorAlert('Mật khẩu không khớp!', 'Mật khẩu xác nhận không khớp với mật khẩu mới.')
        isLoading.value = false
        return
      }

      Swal.close()
      emit('verify', {
        code: otpCode,
        password: newPassword.value,
        confirmPassword: confirmNewPassword.value,
      })
    }

        // ============================================
        // 7. MODE MẶC ĐỊNH (Chỉ xác thực OTP)
    // ============================================
    else {
      const otpCode = verificationCode.join('')
      Swal.close()
      emit('verify', otpCode)
    }

  } catch (error) {
    console.error("OTP verification error:", error)
    Swal.close()

    // Xử lý lỗi chi tiết
    if (error.response) {
      const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          "Xác minh OTP thất bại!"
      showErrorAlert("Lỗi xác thực!", errorMessage)

      // Nếu OTP sai, clear các input và focus vào ô đầu
      if (error.response.status === 400 || error.response.status === 401) {
        verificationCode.fill('')
        nextTick(() => {
          if (codeInputs.value[0]) {
            codeInputs.value[0].focus()
          }
        })
      }
    } else if (error.request) {
      showErrorAlert("Lỗi kết nối!", "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!")
    } else {
      showErrorAlert("Lỗi không xác định!", "Đã xảy ra lỗi không xác định!")
    }
  } finally {
    isLoading.value = false
  }
}

const resendCode = async () => {
  if (resendCooldown.value > 0) return

  const result = await showConfirmAlert(
      'Gửi lại OTP',
      'Bạn có chắc muốn gửi lại mã OTP?',
      'Gửi lại'
  )

  if (!result.isConfirmed) return

  try {
    // Reset code
    verificationCode.fill('')
    showNewPassword.value = props.showPasswordSection

    // Focus first input
    nextTick(() => {
      if (codeInputs.value[0]) {
        codeInputs.value[0].focus()
      }
    })

    startResendCooldown()

    // Gửi lại OTP
    if (props.mode === 'register') {
      showLoadingAlert('Đang gửi lại OTP...')
      await api.post("/thg/api/auth/send-otp", {
        email: props.email,
        phone: props.registerData?.phone || ''
      })
      Swal.close()
      showSuccessAlert("OTP mới đã được gửi!")
    }

    emit('resend', props.email)
  } catch (error) {
    Swal.close()
    showErrorAlert("Lỗi gửi OTP!", error.response?.data?.message || "Không thể gửi lại OTP")
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(interval)
    }
  }, 1000)
}

const resetForm = () => {
  verificationCode.fill('')
  newPassword.value = ''
  confirmNewPassword.value = ''
  showNewPassword.value = props.showPasswordSection
}

const focusFirstInput = () => {
  nextTick(() => {
    if (codeInputs.value[0]) {
      codeInputs.value[0].focus()
    }
  })
}

// Expose methods for parent component
defineExpose({
  resetForm,
  focusFirstInput,
  startResendCooldown,
})

onMounted(() => {
  focusFirstInput()

  // Tự động bắt đầu đếm ngược nếu là chế độ đăng ký
  if (props.mode === 'register') {
    startResendCooldown()
  }
})
</script>

<style scoped>
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
  z-index: 999 !important;
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
  z-index: 999 !important;
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

.step-line.completed {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

/* Step Form */
.step-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.verification-instruction {
  text-align: center;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.email-display {
  font-weight: 600;
  color: #1e293b;
  font-size: 16px;
  margin: 8px 0;
}

.resend-text {
  margin-top: 16px;
  font-size: 13px;
}

.resend-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
  padding: 4px;
  border-radius: 4px;
  font-size: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.resend-btn:hover:not(:disabled) {
  color: #1e40af;
}

.resend-btn:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
  text-decoration: none;
}

/* Verification Code Inputs */
.verification-code {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 20px 0;
  transition: all 0.3s ease;
}

.verification-code input {
  width: 56px;
  height: 64px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.03);
}

.verification-code input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  transform: translateY(-2px);
}

.verification-code input.filled {
  border-color: #fbbf24;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(251, 191, 36, 0.05));
}

/* New Password Section */
.new-password-section {
  background: rgba(59, 130, 246, 0.03);
  border-radius: 12px;
  padding: 20px;
  border: 1px dashed #e2e8f0;
  margin-top: 20px;
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
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

.submit-btn:hover::after {
  left: 100%;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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

  .verification-code {
    gap: 8px;
  }

  .verification-code input {
    width: 48px;
    height: 56px;
    font-size: 24px;
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

/* Khi hiện password section, ẩn OTP */
.step-form:has(.new-password-section) .verification-code {
  opacity: 0;
  height: 0;
  overflow: hidden;
  margin: 0;
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