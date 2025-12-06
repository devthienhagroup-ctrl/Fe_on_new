<template>
  <div class="forgot-password-container">
    <div class="form-card">
      <div class="form-header">
        <button class="back-btn" type="button" @click="handleBack">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div>
          <p class="eyebrow">Bảo mật tài khoản</p>
          <h2>Khôi phục mật khẩu</h2>
        </div>
      </div>

      <div class="steps">
        <div
            v-for="(label, index) in steps"
            :key="label"
            class="step"
        >
          <div
              class="step-indicator"
              :class="{ 'is-active': currentStep === index + 1, 'is-complete': currentStep > index + 1 }"
          >
            <span v-if="currentStep <= index + 1">{{ index + 1 }}</span>
            <i v-else class="fas fa-check"></i>
          </div>
          <p>{{ label }}</p>
        </div>
      </div>

      <p class="step-description">{{ stepDescription }}</p>

      <div v-if="statusMessage" :class="['status-message', statusType]">
        {{ statusMessage }}
      </div>

      <form v-if="currentStep === 1" class="form" @submit.prevent="handleSendOtp">
        <label for="recover-email">Địa chỉ email đã đăng ký</label>
        <div class="input-with-icon">
          <i class="fas fa-envelope"></i>
          <input
              id="recover-email"
              v-model="email"
              type="email"
              placeholder="nhanvien@thienha.vn"
              required
          />
        </div>
        <button class="primary-btn" type="submit">Gửi mã OTP</button>
        <p class="helper-text">
          Mã xác thực sẽ được gửi trong vòng 60 giây. Vui lòng kiểm tra cả hộp thư spam.
        </p>
      </form>

      <form v-else-if="currentStep === 2" class="form" @submit.prevent="handleVerifyOtp">
        <label>Mã OTP gồm 6 chữ số</label>
        <div class="otp-inputs">
          <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="1"
              class="otp-input"
              :value="digit"
              :ref="el => otpRefs[index] = el"
              @input="event => handleOtpInput(event, index)"
              @keydown.backspace.prevent="handleOtpBackspace(index)"
          />
        </div>
        <button class="primary-btn" type="submit" :disabled="!isOtpComplete">
          Xác minh OTP
        </button>
        <p class="helper-text">
          Không nhận được mã?
          <button class="text-btn" type="button" :disabled="isCountingDown" @click="handleResend">
            Gửi lại {{ isCountingDown ? `(${countdown}s)` : '' }}
          </button>
        </p>
      </form>

      <form v-else class="form" @submit.prevent="handleResetPassword">
        <label for="new-password">Mật khẩu mới</label>
        <div class="input-with-icon">
          <i class="fas fa-lock"></i>
          <input
              id="new-password"
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              minlength="8"
              placeholder="Ít nhất 8 ký tự, bao gồm số và chữ"
              required
          />
          <button type="button" class="toggle-visibility" @click="showNewPassword = !showNewPassword">
            <i :class="showNewPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
          </button>
        </div>

        <label for="confirm-password">Xác nhận mật khẩu mới</label>
        <div class="input-with-icon">
          <i class="fas fa-check-circle"></i>
          <input
              id="confirm-password"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              minlength="8"
              placeholder="Nhập lại mật khẩu mới"
              required
          />
          <button type="button" class="toggle-visibility" @click="showConfirmPassword = !showConfirmPassword">
            <i :class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
          </button>
        </div>

        <button class="primary-btn" type="submit">Cập nhật mật khẩu</button>
        <p class="helper-text">
          Hoàn tất bước này và bạn có thể đăng nhập lại ngay lập tức.
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue"
import api from "/src/api/api.js"
import { showLoading, updateAlertError, updateAlertSuccess } from "/src/assets/js/alertService.js"

const emit = defineEmits(["switch-to-login"])

const steps = ["Nhập email", "Nhập mã OTP", "Đổi mật khẩu"]
const currentStep = ref(1)

const email = ref("")
const otpDigits = ref(["", "", "", "", "", ""])
const otpRefs = ref([])
const isCountingDown = ref(false)
const countdown = ref(60)
let timer = null

const newPassword = ref("")
const confirmPassword = ref("")
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const statusMessage = ref("")
const statusType = ref("info")

// ✔ Status
const resetStatus = () => {
  statusMessage.value = ""
  statusType.value = "info"
}
const setStatus = (type, message) => {
  statusType.value = type
  statusMessage.value = message
}

// ✔ Mô tả step
const stepDescription = computed(() => {
  switch (currentStep.value) {
    case 1:
      return "Nhập email đã đăng ký để chúng tôi gửi mã xác nhận bảo mật."
    case 2:
      return "Nhập mã OTP vừa nhận được để xác thực bạn là chủ tài khoản."
    default:
      return "Tạo mật khẩu mới đủ mạnh để bảo vệ tài khoản của bạn."
  }
})

// ✔ Đủ 6 số OTP?
const isOtpComplete = computed(() =>
    otpDigits.value.every((digit) => digit !== "")
)

// 🔙 Quay lại
const handleBack = () => {
  resetStatus()
  if (currentStep.value === 1) return emit("switch-to-login")
  currentStep.value -= 1
}

/* ============================================
   1️⃣ GỬI OTP – CALL API: /forgot-password
============================================ */
const handleSendOtp = async () => {
  resetStatus()

  const isEmailValid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email.value)
  if (!isEmailValid) return setStatus("error", "Email không hợp lệ.")

  try {
    await showLoading(
        api.post("/thg/api/auth/forgot-password", { email: email.value })
    )

    updateAlertSuccess("Đã gửi OTP!", "Hãy kiểm tra email của bạn.")

    currentStep.value = 2
    startCountdown()
  } catch (err) {
    const msg = err.response?.data?.message || "Không gửi được OTP."
    updateAlertError("Lỗi gửi OTP!", msg)
  }
}

/* ============================================
   2️⃣ XÁC THỰC OTP – /verify-otp
============================================ */
const handleVerifyOtp = async () => {
  resetStatus()

  if (!isOtpComplete.value)
    return setStatus("error", "Bạn cần nhập đủ 6 chữ số.")

  const otp = otpDigits.value.join("")

  try {
    await showLoading(
        api.post("/thg/api/auth/verify-otp", {
          email: email.value,
          otp: otp,
        })
    )

    updateAlertSuccess("Xác thực thành công!")
    currentStep.value = 3
  } catch (err) {
    const msg = err.response?.data?.message || "OTP không đúng!"
    updateAlertError("Xác thực thất bại", msg)
  }
}

/* ============================================
   3️⃣ ĐỔI MẬT KHẨU – /reset-password
============================================ */
const handleResetPassword = async () => {
  resetStatus()

  if (newPassword.value.length < 8)
    return setStatus("error", "Mật khẩu phải ít nhất 8 ký tự.")
  if (newPassword.value !== confirmPassword.value)
    return setStatus("error", "Mật khẩu xác nhận không khớp.")

  const otp = otpDigits.value.join("")

  try {
    await showLoading(
        api.post("/thg/api/auth/reset-password", {
          email: email.value,
          otp: otp,
          newPassword: newPassword.value,
          confirmPassword: confirmPassword.value,
        })
    )

    updateAlertSuccess("Đặt mật khẩu mới thành công!")

    setTimeout(() => emit("switch-to-login"), 1300)
  } catch (err) {
    const msg = err.response?.data?.message || "Không thể cập nhật mật khẩu!"
    updateAlertError("Lỗi cập nhật mật khẩu", msg)
  }
}

/* ============================================
   OTP INPUT HANDLERS
============================================ */
const handleOtpInput = (event, index) => {
  resetStatus()
  const value = event.target.value.replace(/\D/g, "")
  otpDigits.value[index] = value.slice(-1)

  if (value && index < 5) otpRefs.value[index + 1]?.focus()
}

const handleOtpBackspace = (index) => {
  if (otpDigits.value[index]) {
    otpDigits.value[index] = ""
    return
  }
  if (index > 0) {
    otpDigits.value[index - 1] = ""
    otpRefs.value[index - 1]?.focus()
  }
}

/* ============================================
   GỬI LẠI OTP
============================================ */
const handleResend = async () => {
  if (isCountingDown.value) return

  otpDigits.value = ["", "", "", "", "", ""]

  try {
    await showLoading(api.post("/thg/api/auth/forgot-password", { email: email.value }))
    updateAlertSuccess("Đã gửi lại OTP!")
    startCountdown()
  } catch (err) {
    updateAlertError("Lỗi gửi lại OTP!", err.response?.data?.message)
  }
}

/* ============================================
   COUNTDOWN
============================================ */
const startCountdown = () => {
  isCountingDown.value = true
  countdown.value = 60
  clearInterval(timer)

  timer = setInterval(() => {
    if (countdown.value === 0) {
      isCountingDown.value = false
      clearInterval(timer)
    } else {
      countdown.value--
    }
  }, 1000)
}

onBeforeUnmount(() => clearInterval(timer))
</script>


<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.form-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 25px 65px rgba(8, 15, 52, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 640px;
  margin: 20px;
}

.form-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.back-btn {
  background: #f3f6ff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  font-size: 18px;
  color: #031358;
  cursor: pointer;
  box-shadow: inset 2px 2px 6px rgba(3, 19, 88, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.back-btn:hover {
  transform: translateX(-2px);
  box-shadow: inset 1px 1px 3px rgba(3, 19, 88, 0.2);
}

.eyebrow {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1.6px;
  color: #7a869a;
  margin: 0 0 4px;
}

h2 {
  margin: 0;
  font-size: 28px;
  color: #031358;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.step {
  text-align: center;
}

.step-indicator {
  width: 42px;
  height: 42px;
  margin: 0 auto 6px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #cbd5f5;
  color: #98a1c2;
  font-weight: 600;
  font-size: 18px;
}

.step-indicator.is-active {
  background: linear-gradient(120deg, #eef1ff, #c6d0ff);
  border-color: transparent;
  color: #031358;
}

.step-indicator.is-complete {
  background: #031358;
  color: #fff;
  border: none;
}

.step-description {
  color: #4d5670;
  margin-bottom: 20px;
  line-height: 1.5;
}

.status-message {
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: 500;
}

.status-message.info {
  background: #f4f6ff;
  color: #031358;
}

.status-message.success {
  background: #e6fbef;
  color: #0a7a48;
}

.status-message.error {
  background: #ffecec;
  color: #a61b20;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  font-weight: 600;
  color: #031358;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  color: #7a869a;
}

.input-with-icon input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border-radius: 12px;
  border: 1px solid #e0e5ff;
  background: #f7f8ff;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.input-with-icon input:focus {
  outline: none;
  border-color: #031358;
}

.toggle-visibility {
  position: absolute;
  right: 8%;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  cursor: pointer;
  color: #7a869a;
}

.otp-inputs {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.otp-input {
  width: 56px;
  height: 56px;
  border: 2px solid #e0e5ff;
  border-radius: 14px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  background: #f7f8ff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.otp-input:focus {
  outline: none;
  border-color: #031358;
  box-shadow: 0 0 0 3px rgba(3, 19, 88, 0.08);
}

.primary-btn {
  margin-top: 10px;
  padding: 15px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(120deg, #031358, #2c5bff);
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(44, 91, 255, 0.25);
}

.helper-text {
  color: #7a869a;
  font-size: 14px;
  text-align: center;
}

.text-btn {
  border: none;
  background: none;
  color: #2c5bff;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 640px) {
  .form-card {
    padding: 24px;
  }

  .otp-input {
    width: 48px;
    height: 48px;
  }
}
</style>
