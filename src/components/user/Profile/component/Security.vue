<template>
  <div class="security-container">
    <!-- Header với ảnh SVG -->
    <div class="security-header">
      <img src="/imgs/security-animate.svg" alt="Security" class="security-image">
      <h1 class="security-title">Mật khẩu và đăng nhập</h1>
      <p class="security-subtitle">Giữ tài khoản luôn an toàn — chỉnh thông tin, siết bảo mật, yên tâm dùng hệ thống.</p>
    </div>

    <!-- Danh sách các chức năng -->
    <div class="security-features">
      <!-- Đổi mật khẩu -->
      <div class="feature-item" @click="openModal('password')">
        <div class="feature-content">
          <h3 class="feature-title">Đổi mật khẩu</h3>
          <p class="feature-subtitle">Đặt mật khẩu mạnh hơn để tăng mức độ an toàn cho tài khoản của bạn.</p>
        </div>
        <div class="feature-icon">
          <span>&gt;</span>
        </div>
      </div>

      <!-- Quên mật khẩu -->
      <div class="feature-item" @click="openModal('forgot')">
        <div class="feature-content">
          <h3 class="feature-title">Quên mật khẩu</h3>
          <p class="feature-subtitle">Khôi phục lại quyền truy cập tài khoản qua email xác minh.</p>
        </div>
        <div class="feature-icon">
          <span>&gt;</span>
        </div>
      </div>
    </div>

    <!-- Modal Đổi mật khẩu -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Đổi mật khẩu</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="input-group" v-if="!oldPasswordVerified">
            <label for="old-password">Mật khẩu hiện tại</label>
            <input
                type="password"
                id="old-password"
                v-model="oldPassword"
                :disabled="checkingPassword"
            >
            <button class="check-btn" @click="verifyOldPassword" :disabled="checkingPassword || !oldPassword">
              {{ checkingPassword ? 'Đang kiểm tra...' : 'Kiểm tra' }}
            </button>
            <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
          </div>
          <div v-if="oldPasswordVerified">
            <div class="input-group">
              <label for="new-password">Mật khẩu mới</label>
              <input
                  type="password"
                  id="new-password"
                  v-model="newPassword"
                  @input="validatePassword"
                  :disabled="changingPassword"
              >
              <!-- Password validation conditions -->
              <div class="password-conditions">
                <div class="condition-item" :class="{ 'valid': conditions.minLength }">
                  <span class="condition-icon">{{ conditions.minLength ? '✓' : '•' }}</span>
                  <span class="condition-text">Độ dài tối thiểu: Ít nhất 6 ký tự</span>
                </div>
                <div class="condition-item" :class="{ 'valid': conditions.lowercase }">
                  <span class="condition-icon">{{ conditions.lowercase ? '✓' : '•' }}</span>
                  <span class="condition-text">Phải chứa ít nhất 1 ký tự viết thường</span>
                </div>
                <div class="condition-item" :class="{ 'valid': conditions.uppercase }">
                  <span class="condition-icon">{{ conditions.uppercase ? '✓' : '•' }}</span>
                  <span class="condition-text">Phải chứa ít nhất 1 ký tự viết hoa</span>
                </div>
                <div class="condition-item" :class="{ 'valid': conditions.digit }">
                  <span class="condition-icon">{{ conditions.digit ? '✓' : '•' }}</span>
                  <span class="condition-text">Phải chứa ít nhất 1 chữ số</span>
                </div>
                <div class="condition-item" :class="{ 'valid': conditions.special }">
                  <span class="condition-icon">{{ conditions.special ? '✓' : '•' }}</span>
                  <span class="condition-text">Phải chứa ít nhất 1 ký tự đặc biệt</span>
                </div>
              </div>
            </div>
            <div class="input-group">
              <label for="confirm-password">Nhập lại mật khẩu mới</label>
              <input
                  type="password"
                  id="confirm-password"
                  v-model="confirmPassword"
                  :disabled="changingPassword"
              >
              <p v-if="confirmPassword && newPassword !== confirmPassword" class="error-message">Mật khẩu không khớp</p>
            </div>
            <button class="confirm-btn" @click="changePassword" :disabled="!isPasswordValid || changingPassword">
              {{ changingPassword ? 'Đang đổi mật khẩu...' : 'Xác nhận' }}
            </button>
            <p v-if="changePasswordError" class="error-message">{{ changePasswordError }}</p>
            <p v-if="changePasswordSuccess" class="success-message">{{ changePasswordSuccess }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nhập email cho quên mật khẩu -->
    <div v-if="showForgotModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Quên mật khẩu</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <label for="forgot-email">Email của bạn</label>
            <input
                type="email"
                id="forgot-email"
                v-model="forgotEmail"
                :placeholder="maskEmail"
            >
          </div>
          <button class="confirm-btn" @click="sendForgotOTP" :disabled="sendingOTP">
            {{ sendingOTP ? 'Đang gửi OTP...' : 'Gửi OTP' }}
          </button>
          <p v-if="forgotEmailError" class="error-message">{{ forgotEmailError }}</p>
          <p v-if="forgotEmailSuccess" class="success-message">{{ forgotEmailSuccess }}</p>
        </div>
      </div>
    </div>

    <!-- Modal OTP cho quên mật khẩu -->
    <div v-if="showForgotOTPModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Xác thực OTP</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <p class="otp-instruction">Nhập mã OTP đã được gửi đến email của bạn</p>
          <div class="otp-timer" v-if="otpTimer > 0">
            Mã OTP sẽ hết hạn sau: {{ formatTime(otpTimer) }}
          </div>
          <div class="otp-timer expired" v-else>
            Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.
          </div>
          <div class="otp-inputs">
            <input
                v-for="(digit, index) in otpDigits"
                :key="index"
                type="text"
                maxlength="1"
                v-model="otpDigits[index]"
                @input="handleOtpInput(index, $event)"
                @keydown="handleOtpKeydown(index, $event)"
                @paste="handleOtpPaste"
                ref="otpInputs"
                class="otp-input"
                :disabled="otpTimer <= 0"
            >
          </div>
          <button class="confirm-btn" @click="verifyForgotOTP" :disabled="verifyingOTP || otpTimer <= 0">
            {{ verifyingOTP ? 'Đang xác thực...' : 'Xác nhận' }}
          </button>
          <p v-if="otpError" class="error-message">{{ otpError }}</p>
          <div class="resend-otp" v-if="otpTimer <= 0">
            <button class="resend-btn" @click="resendOTP" :disabled="resendingOTP">
              {{ resendingOTP ? 'Đang gửi lại...' : 'Gửi lại OTP' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Đặt lại mật khẩu -->
    <div v-if="showResetPasswordModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Đặt lại mật khẩu</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="input-group">
            <label for="reset-password">Mật khẩu mới</label>
            <input
                type="password"
                id="reset-password"
                v-model="resetPassword"
                @input="validateResetPassword"
            >
            <!-- Password validation conditions for reset password -->
            <div class="password-conditions">
              <div class="condition-item" :class="{ 'valid': resetConditions.minLength }">
                <span class="condition-icon">{{ resetConditions.minLength ? '✓' : '•' }}</span>
                <span class="condition-text">Độ dài tối thiểu: Ít nhất 6 ký tự</span>
              </div>
              <div class="condition-item" :class="{ 'valid': resetConditions.lowercase }">
                <span class="condition-icon">{{ resetConditions.lowercase ? '✓' : '•' }}</span>
                <span class="condition-text">Phải chứa ít nhất 1 ký tự viết thường</span>
              </div>
              <div class="condition-item" :class="{ 'valid': resetConditions.uppercase }">
                <span class="condition-icon">{{ resetConditions.uppercase ? '✓' : '•' }}</span>
                <span class="condition-text">Phải chứa ít nhất 1 ký tự viết hoa</span>
              </div>
              <div class="condition-item" :class="{ 'valid': resetConditions.digit }">
                <span class="condition-icon">{{ resetConditions.digit ? '✓' : '•' }}</span>
                <span class="condition-text">Phải chứa ít nhất 1 chữ số</span>
              </div>
              <div class="condition-item" :class="{ 'valid': resetConditions.special }">
                <span class="condition-icon">{{ resetConditions.special ? '✓' : '•' }}</span>
                <span class="condition-text">Phải chứa ít nhất 1 ký tự đặc biệt</span>
              </div>
            </div>
          </div>
          <div class="input-group">
            <label for="reset-confirm-password">Nhập lại mật khẩu mới</label>
            <input
                type="password"
                id="reset-confirm-password"
                v-model="resetConfirmPassword"
            >
            <p v-if="resetConfirmPassword && resetPassword !== resetConfirmPassword" class="error-message">Mật khẩu không khớp</p>
          </div>
          <button class="confirm-btn" @click="resetPasswordAction" :disabled="!isResetPasswordValid || resettingPassword">
            {{ resettingPassword ? 'Đang đặt lại mật khẩu...' : 'Xác nhận' }}
          </button>
          <p v-if="resetPasswordError" class="error-message">{{ resetPasswordError }}</p>
          <p v-if="resetPasswordSuccess" class="success-message">{{ resetPasswordSuccess }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, nextTick, onMounted, onUnmounted} from 'vue'
import api from "../../../../api/api.js";

const props = defineProps({
  maskEmail: String
});

// State cho các modal
const showPasswordModal = ref(false)
const showForgotModal = ref(false)
const showForgotOTPModal = ref(false)
const showResetPasswordModal = ref(false)

// State cho các input
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const forgotEmail = ref('')
const resetPassword = ref('')
const resetConfirmPassword = ref('')
const oldPasswordVerified = ref(false)

// State cho loading và errors
const checkingPassword = ref(false)
const changingPassword = ref(false)
const sendingOTP = ref(false)
const verifyingOTP = ref(false)
const resendingOTP = ref(false)
const resettingPassword = ref(false)
const passwordError = ref('')
const changePasswordError = ref('')
const changePasswordSuccess = ref('')
const forgotEmailError = ref('')
const forgotEmailSuccess = ref('')
const otpError = ref('')
const resetPasswordError = ref('')
const resetPasswordSuccess = ref('')

// State cho OTP
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputs = ref([])
const otpTimer = ref(0)
let otpInterval = null

// Mở modal tương ứng
const openModal = (type) => {
  closeAllModals()
  switch (type) {
    case 'password':
      showPasswordModal.value = true
      break
    case 'forgot':
      showForgotModal.value = true
      break
  }
}

// Đóng tất cả modal
const closeAllModals = () => {
  showPasswordModal.value = false
  showForgotModal.value = false
  showForgotOTPModal.value = false
  showResetPasswordModal.value = false
  resetFormData()
  clearOtpTimer()
}

// Đóng modal
const closeModal = () => {
  closeAllModals()
}

// Reset dữ liệu form
const resetFormData = () => {
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  forgotEmail.value = ''
  resetPassword.value = ''
  resetConfirmPassword.value = ''
  oldPasswordVerified.value = false
  otpDigits.value = ['', '', '', '', '', '']

  // Reset loading và error states
  checkingPassword.value = false
  changingPassword.value = false
  sendingOTP.value = false
  verifyingOTP.value = false
  resendingOTP.value = false
  resettingPassword.value = false
  passwordError.value = ''
  changePasswordError.value = ''
  changePasswordSuccess.value = ''
  forgotEmailError.value = ''
  forgotEmailSuccess.value = ''
  otpError.value = ''
  resetPasswordError.value = ''
  resetPasswordSuccess.value = ''

  // Reset password conditions
  conditions.value = {
    minLength: false,
    lowercase: false,
    uppercase: false,
    digit: false,
    special: false
  }

  resetConditions.value = {
    minLength: false,
    lowercase: false,
    uppercase: false,
    digit: false,
    special: false
  }
}

// Kiểm tra mật khẩu cũ với API
const verifyOldPassword = async () => {
  if (!oldPassword.value) {
    passwordError.value = 'Vui lòng nhập mật khẩu hiện tại'
    return
  }

  checkingPassword.value = true
  passwordError.value = ''

  try {
    const response = await api.post("/profile/checkPassword", null, {
      params: {
        password: oldPassword.value
      }
    })

    if (response.data) {
      oldPasswordVerified.value = true
      passwordError.value = ''
    } else {
      passwordError.value = 'Mật khẩu hiện tại không chính xác'
    }
  } catch (error) {
    console.error('Error checking password:', error)
    passwordError.value = 'Đã xảy ra lỗi khi kiểm tra mật khẩu'
  } finally {
    checkingPassword.value = false
  }
}

// Đổi mật khẩu với API
const changePassword = async () => {
  if (!isPasswordValid.value) {
    changePasswordError.value = 'Vui lòng kiểm tra lại thông tin mật khẩu mới'
    return
  }

  changingPassword.value = true
  changePasswordError.value = ''
  changePasswordSuccess.value = ''

  try {
    const response = await api.post("/profile/changePassword", null, {
      params: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value
      }
    })

    if (response.status === 200) {
      changePasswordSuccess.value = response.data.message || 'Đổi mật khẩu thành công!'
      // Tự động đóng modal sau 2 giây
      setTimeout(() => {
        closeModal()
      }, 2000)
    }
  } catch (error) {
    console.error('Error changing password:', error)
    if (error.response && error.response.data && error.response.data.message) {
      changePasswordError.value = error.response.data.message
    } else {
      changePasswordError.value = 'Đã xảy ra lỗi khi đổi mật khẩu'
    }
  } finally {
    changingPassword.value = false
  }
}

// Gửi OTP cho quên mật khẩu
const sendForgotOTP = async () => {
  if (!forgotEmail.value) {
    forgotEmailError.value = 'Vui lòng nhập email'
    return
  }

  sendingOTP.value = true
  forgotEmailError.value = ''
  forgotEmailSuccess.value = ''

  try {
    const response = await api.post("/thg/api/auth/forgot-password", {
      email: forgotEmail.value
    })

    if (response.data.success) {
      forgotEmailSuccess.value = response.data.message
      showForgotModal.value = false
      showForgotOTPModal.value = true
      startOtpTimer()
      focusFirstOtpInput()
    } else {
      forgotEmailError.value = response.data.message
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    if (error.response && error.response.data && error.response.data.message) {
      forgotEmailError.value = error.response.data.message
    } else {
      forgotEmailError.value = 'Đã xảy ra lỗi khi gửi OTP'
    }
  } finally {
    sendingOTP.value = false
  }
}

// Gửi lại OTP
const resendOTP = async () => {
  resendingOTP.value = true
  otpError.value = ''

  try {
    const response = await api.post("/thg/api/auth/forgot-password", {
      email: forgotEmail.value
    })

    if (response.data.success) {
      otpDigits.value = ['', '', '', '', '', '']
      startOtpTimer()
      focusFirstOtpInput()
    } else {
      otpError.value = response.data.message
    }
  } catch (error) {
    console.error('Error resending OTP:', error)
    if (error.response && error.response.data && error.response.data.message) {
      otpError.value = error.response.data.message
    } else {
      otpError.value = 'Đã xảy ra lỗi khi gửi lại OTP'
    }
  } finally {
    resendingOTP.value = false
  }
}

// Xác thực OTP cho quên mật khẩu
const verifyForgotOTP = async () => {
  const otp = otpDigits.value.join('')

  if (otp.length !== 6) {
    otpError.value = 'Vui lòng nhập đủ 6 chữ số OTP'
    return
  }

  verifyingOTP.value = true
  otpError.value = ''

  try {
    const response = await api.post("/thg/api/auth/verify-otp", {
      email: forgotEmail.value,
      otp: otp
    })

    if (response.data.success) {
      showForgotOTPModal.value = false
      showResetPasswordModal.value = true
      clearOtpTimer()
    } else {
      otpError.value = response.data.message
    }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    if (error.response && error.response.data && error.response.data.message) {
      otpError.value = error.response.data.message
    } else {
      otpError.value = 'Đã xảy ra lỗi khi xác thực OTP'
    }
  } finally {
    verifyingOTP.value = false
  }
}

// Đặt lại mật khẩu
const resetPasswordAction = async () => {
  if (!isResetPasswordValid.value) {
    resetPasswordError.value = 'Vui lòng kiểm tra lại thông tin mật khẩu mới'
    return
  }

  const otp = otpDigits.value.join('')
  resettingPassword.value = true
  resetPasswordError.value = ''
  resetPasswordSuccess.value = ''

  try {
    const response = await api.post("/thg/api/auth/reset-password", {
      email: forgotEmail.value,
      otp: otp,
      newPassword: resetPassword.value
    })

    if (response.data.success) {
      resetPasswordSuccess.value = response.data.message
      // Tự động đóng modal sau 2 giây
      setTimeout(() => {
        closeModal()
      }, 2000)
    } else {
      resetPasswordError.value = response.data.message
    }
  } catch (error) {
    console.error('Error resetting password:', error)
    if (error.response && error.response.data && error.response.data.message) {
      resetPasswordError.value = error.response.data.message
    } else {
      resetPasswordError.value = 'Đã xảy ra lỗi khi đặt lại mật khẩu'
    }
  } finally {
    resettingPassword.value = false
  }
}

// Xử lý nhập OTP
const handleOtpInput = (index, event) => {
  const value = event.target.value

  // Chỉ cho phép nhập số
  if (!/^\d*$/.test(value)) {
    otpDigits.value[index] = ''
    return
  }

  // Nếu có giá trị và chưa phải ô cuối, chuyển đến ô tiếp theo
  if (value && index < 5) {
    nextTick(() => {
      otpInputs.value[index + 1].focus()
    })
  }
}

// Xử lý sự kiện phím trong OTP
const handleOtpKeydown = (index, event) => {
  // Xử lý phím Backspace
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    nextTick(() => {
      otpInputs.value[index - 1].focus()
    })
  }

  // Xử lý phím mũi tên trái
  if (event.key === 'ArrowLeft' && index > 0) {
    nextTick(() => {
      otpInputs.value[index - 1].focus()
    })
  }

  // Xử lý phím mũi tên phải
  if (event.key === 'ArrowRight' && index < 5) {
    nextTick(() => {
      otpInputs.value[index + 1].focus()
    })
  }
}

// Xử lý dán OTP
const handleOtpPaste = (event) => {
  event.preventDefault()
  const pasteData = event.clipboardData.getData('text').trim()

  // Kiểm tra nếu dữ liệu dán là số và có đúng 6 ký tự
  if (/^\d{6}$/.test(pasteData)) {
    const digits = pasteData.split('')
    digits.forEach((digit, index) => {
      if (index < 6) {
        otpDigits.value[index] = digit
      }
    })

    // Focus vào ô cuối cùng
    nextTick(() => {
      otpInputs.value[5].focus()
    })
  }
}

// Focus vào ô OTP đầu tiên
const focusFirstOtpInput = () => {
  nextTick(() => {
    if (otpInputs.value && otpInputs.value.length > 0) {
      otpInputs.value[0].focus()
    }
  })
}

// Bắt đầu đếm ngược OTP (5 phút = 300 giây)
const startOtpTimer = () => {
  otpTimer.value = 300 // 5 phút
  clearOtpTimer()
  otpInterval = setInterval(() => {
    if (otpTimer.value > 0) {
      otpTimer.value--
    } else {
      clearOtpTimer()
    }
  }, 1000)
}

// Xóa timer OTP
const clearOtpTimer = () => {
  if (otpInterval) {
    clearInterval(otpInterval)
    otpInterval = null
  }
}

// Định dạng thời gian
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Password validation conditions
const conditions = ref({
  minLength: false,
  lowercase: false,
  uppercase: false,
  digit: false,
  special: false
})

const resetConditions = ref({
  minLength: false,
  lowercase: false,
  uppercase: false,
  digit: false,
  special: false
})

// Computed properties for password validity
const isPasswordValid = computed(() => {
  return conditions.value.minLength &&
      conditions.value.lowercase &&
      conditions.value.uppercase &&
      conditions.value.digit &&
      conditions.value.special &&
      newPassword.value === confirmPassword.value &&
      newPassword.value.length > 0
})

const isResetPasswordValid = computed(() => {
  return resetConditions.value.minLength &&
      resetConditions.value.lowercase &&
      resetConditions.value.uppercase &&
      resetConditions.value.digit &&
      resetConditions.value.special &&
      resetPassword.value === resetConfirmPassword.value
})

// Password validation function
const validatePassword = () => {
  const password = newPassword.value

  conditions.value.minLength = password.length >= 6
  conditions.value.lowercase = /[a-z]/.test(password)
  conditions.value.uppercase = /[A-Z]/.test(password)
  conditions.value.digit = /[0-9]/.test(password)
  conditions.value.special = /[!@#$%^&*(),.?":{}|<>]/.test(password)
}

// Reset password validation function
const validateResetPassword = () => {
  const password = resetPassword.value

  resetConditions.value.minLength = password.length >= 6
  resetConditions.value.lowercase = /[a-z]/.test(password)
  resetConditions.value.uppercase = /[A-Z]/.test(password)
  resetConditions.value.digit = /[0-9]/.test(password)
  resetConditions.value.special = /[!@#$%^&*(),.?":{}|<>]/.test(password)
}

// Cleanup khi component unmount
onUnmounted(() => {
  clearOtpTimer()
})
</script>

<style scoped>
.security-container {
  width: 95%;
  height: 100%;

  padding: 0px;
  box-sizing: border-box;
  margin: 0 auto;
}

.security-header {
  text-align: center;
  margin-bottom: 40px;
}

.security-image {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
}

.security-title {
  font-size: 33px;
  background: linear-gradient(to right, #031358, #0030FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 15px 0;
}

.security-subtitle {
  font-size: 17px;
  color: #333;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.5;
}

.security-features {
  margin: 0 auto;
}

.feature-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 20px;
  font-weight: bold;
  color: #031358;
  margin: 0 0 10px 0;
}

.feature-subtitle {
  font-size: 17px;
  color: #000;
  margin: 0;
  line-height: 1.4;
}

.feature-icon {
  font-size: 24px;
  color: #0030FF;
  font-weight: bold;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #031358;
  font-size: 24px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #000;
}

.modal-body {
  padding: 20px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #031358;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.input-group input:focus {
  border-color: #0030FF;
  outline: none;
}

.input-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.check-btn, .confirm-btn, .resend-btn {
  background: linear-gradient(to right, #031358, #0030FF);
  color: white;
  border: none;
  border-radius: 4px !important;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.check-btn:hover:not(:disabled), .confirm-btn:hover:not(:disabled), .resend-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.check-btn {
  margin-top: 30px;
  width: 100%;
}

.confirm-btn {
  width: 100%;
  margin-top: 10px;
}

.resend-btn {
  width: 100%;
  margin-top: 10px;
  background: #6c757d;
}

/* OTP Styles */
.otp-instruction {
  text-align: center;
  margin-bottom: 10px;
  color: #666;
}

.otp-timer {
  text-align: center;
  margin-bottom: 15px;
  font-weight: bold;
  color: #dc3545;
}

.otp-timer.expired {
  color: #dc3545;
}

.otp-inputs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.otp-input {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.otp-input:focus {
  border-color: #0030FF;
  outline: none;
}

.otp-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.resend-otp {
  margin-top: 15px;
  text-align: center;
}

/* Password Conditions Styles */
.password-conditions {
  margin-top: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 12px;
}

.condition-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  color: #888;
  transition: color 0.3s ease;
}

.condition-item.valid {
  color: #28a745; /* Success color */
}

.condition-icon {
  display: inline-block;
  width: 16px;
  text-align: center;
  margin-right: 8px;
  font-weight: bold;
}

.condition-item.valid .condition-icon {
  color: #28a745;
}

.condition-text {
  font-size: 12px;
}

/* Disable confirm button when invalid */
.confirm-btn:disabled, .check-btn:disabled, .resend-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.confirm-btn:disabled:hover, .check-btn:disabled:hover, .resend-btn:disabled:hover {
  opacity: 0.6;
}

/* Error and Success Messages */
.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.success-message {
  color: #28a745;
  font-size: 14px;
  margin-top: 5px;
  text-align: center;
  font-weight: bold;
}
</style>