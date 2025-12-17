<template>
  <div class="register-container">
    <div class="form-container">

      <!-- HEADER -->
      <div class="form-header">
        <button class="back-btn" @click="handleBack">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 class="form-title">
          {{ showOtpStep ? "Xác Minh OTP" : "Đăng Ký" }}
        </h2>
      </div>

      <!-- ===================================================== -->
      <!-- =============== BƯỚC 2: NHẬP OTP ==================== -->
      <!-- ===================================================== -->
      <OTPVerify
          v-if="showOtpStep"
          :email="registerForm.email"
          :error="errors.otp"
          @verify-otp="verifyOtp"
          @resend-otp="resendOtp"
          ref="otpComponentRef"
      />

      <!-- ===================================================== -->
      <!-- =============== BƯỚC 1: ĐĂNG KÝ ====================== -->
      <!-- ===================================================== -->
      <form v-else @submit.prevent="handleSendOtp" class="register-form" ref="formRef">
        <!-- Email -->
        <div class="form-group" ref="emailRef">
          <label for="register-email">Email</label>
          <input id="register-email" v-model="registerForm.email" type="text" placeholder="Nhập email" />
          <p class="error" v-if="errors.email">{{ errors.email }}</p>
        </div>

        <!-- Name -->
        <div class="form-group" ref="nameRef">
          <label for="register-name">Họ và tên</label>
          <input id="register-name" v-model="registerForm.name" type="text" placeholder="Nhập họ và tên" />
          <p class="error" v-if="errors.name">{{ errors.name }}</p>
        </div>

        <!-- Phone + Gender -->
        <div class="form-row">
          <div class="form-group form-group-half" ref="phoneRef">
            <label for="register-phone">Số điện thoại</label>
            <input id="register-phone" v-model="registerForm.phone" type="tel" placeholder="Nhập số điện thoại" />
            <p class="error" v-if="errors.phone">{{ errors.phone }}</p>
          </div>

          <div class="form-group form-group-half" ref="genderRef">
            <label for="register-gender">Giới tính</label>
            <select id="register-gender" v-model="registerForm.gender">
              <option value="" disabled>Chọn giới tính</option>
              <option :value="true">Nam</option>
              <option :value="false">Nữ</option>
            </select>
            <p class="error" v-if="errors.gender">{{ errors.gender }}</p>
          </div>
        </div>

        <!-- Address -->
        <div class="form-group" ref="addressRef">
          <label>Địa chỉ</label>
          <AddressSelector2 v-model="registerForm.address" />
          <p class="error" v-if="errors.address">{{ errors.address }}</p>
        </div>

        <!-- Old Address -->
        <div class="form-group">
          <label>Địa chỉ cũ (không bắt buộc)</label>
          <input v-model="registerForm.oldAddress" type="text" placeholder="Nhập địa chỉ cũ" />
        </div>

        <!-- Role -->
        <div class="form-group" ref="roleRef">
          <label>Bạn là ai?</label>
          <select v-model="registerForm.role">
            <option value="" disabled>Chọn loại hình đăng ký</option>
            <option value="BROKER">Môi giới</option>
            <option value="HOST">Chủ nhà</option>
          </select>
          <p class="error" v-if="errors.role">{{ errors.role }}</p>
        </div>

        <!-- Referral -->
        <div class="form-group" v-if="registerForm.role === 'BROKER'">
          <label>Mã giới thiệu (nếu có)</label>
          <input v-model="registerForm.referralCode" type="text" placeholder="Nhập mã giới thiệu" />
        </div>

        <!-- Password -->
        <div class="form-group password-wrapper" ref="passwordRef">
          <label>Mật khẩu</label>
          <div class="password-input">
            <input
                :type="showPassword ? 'text' : 'password'"
                v-model="registerForm.password"
                placeholder="Nhập mật khẩu"
                @focus="showPasswordConditions = true"
                @blur="onPasswordBlur"
            />
            <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" class="toggle-eye" @click="showPassword = !showPassword"></i>
          </div>

          <!-- Password validation conditions -->
          <div class="password-conditions" v-show="showPasswordConditions">
            <div class="condition-item" :class="getConditionClass(passwordConditions.minLength)">
              <span class="condition-icon">{{ passwordConditions.minLength ? '✓' : '•' }}</span>
              <span class="condition-text">Độ dài tối thiểu: Ít nhất 6 ký tự</span>
            </div>
            <div class="condition-item" :class="getConditionClass(passwordConditions.lowercase)">
              <span class="condition-icon">{{ passwordConditions.lowercase ? '✓' : '•' }}</span>
              <span class="condition-text">Phải chứa ít nhất 1 ký tự viết thường</span>
            </div>
            <div class="condition-item" :class="getConditionClass(passwordConditions.uppercase)">
              <span class="condition-icon">{{ passwordConditions.uppercase ? '✓' : '•' }}</span>
              <span class="condition-text">Phải chứa ít nhất 1 ký tự viết hoa</span>
            </div>
            <div class="condition-item" :class="getConditionClass(passwordConditions.digit)">
              <span class="condition-icon">{{ passwordConditions.digit ? '✓' : '•' }}</span>
              <span class="condition-text">Phải chứa ít nhất 1 chữ số</span>
            </div>
            <div class="condition-item" :class="getConditionClass(passwordConditions.special)">
              <span class="condition-icon">{{ passwordConditions.special ? '✓' : '•' }}</span>
              <span class="condition-text">Phải chứa ít nhất 1 ký tự đặc biệt</span>
            </div>
          </div>

          <p class="error" v-if="errors.password">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <div class="form-group password-wrapper" ref="confirmPasswordRef">
          <label>Xác minh mật khẩu</label>
          <div class="password-input">
            <input :type="showConfirm ? 'text' : 'password'" v-model="registerForm.confirmPassword" placeholder="Nhập lại mật khẩu" />
            <i :class="showConfirm ? 'fas fa-eye' : 'fas fa-eye-slash'" class="toggle-eye" @click="showConfirm = !showConfirm"></i>
          </div>
          <p class="error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</p>
        </div>

        <button type="submit" class="switch-btn register-btn">Tạo tài khoản</button>
      </form>

      <div v-if="!showOtpStep" class="divider"><span>hoặc</span></div>
      <button v-if="!showOtpStep" class="switch-btn login-switch-btn" @click="$emit('switch-to-login')">
        Đăng nhập
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, watch } from "vue";
import api from "/src/api/api.js";
import AddressSelector2 from "../../../land/my-valuation/components/AddressSelector2.vue";
import { showLoading, updateAlertSuccess, updateAlertError } from "/src/assets/js/alertService.js";
import OTPVerify from "./OTPVerify.vue";

const otpComponentRef = ref(null);
const emit = defineEmits(["switch-to-login", "close-form", "scrollToError", "scrollTop"]);

const showOtpStep = ref(false);

const otpBoxes = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);

// Refs for form elements
const formRef = ref(null);
const emailRef = ref(null);
const nameRef = ref(null);
const phoneRef = ref(null);
const genderRef = ref(null);
const addressRef = ref(null);
const roleRef = ref(null);
const passwordRef = ref(null);
const confirmPasswordRef = ref(null);

// Password conditions
const showPasswordConditions = ref(false);
const passwordSubmitted = ref(false);

const passwordConditions = reactive({
  minLength: false,
  lowercase: false,
  uppercase: false,
  digit: false,
  special: false
});

const handleBack = () => {
  if (showOtpStep.value) {
    showOtpStep.value = false;
    resetOtp();
  } else {
    emit('close-form');
  }
};

const registerForm = reactive({
  email: "",
  name: "",
  phone: "",
  gender: "",
  address: "",
  oldAddress: "",
  role: "",
  referralCode: "",
  password: "",
  confirmPassword: ""
});

const errors = reactive({
  email: "",
  name: "",
  phone: "",
  gender: "",
  address: "",
  role: "",
  password: "",
  confirmPassword: "",
  otp: ""
});

const showPassword = ref(false);
const showConfirm = ref(false);

// Watch password changes to update conditions
watch(() => registerForm.password, (newPassword) => {
  checkPasswordConditions(newPassword);
});

const checkPasswordConditions = (password) => {
  passwordConditions.minLength = password.length >= 6;
  passwordConditions.lowercase = /[a-z]/.test(password);
  passwordConditions.uppercase = /[A-Z]/.test(password);
  passwordConditions.digit = /\d/.test(password);
  passwordConditions.special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
};

const getConditionClass = (condition) => {
  if (passwordSubmitted.value && !condition) {
    return 'invalid';
  }
  return condition ? 'valid' : '';
};

const onPasswordBlur = () => {
  // Keep conditions visible if there are errors after submission
  if (!passwordSubmitted.value) {
    setTimeout(() => {
      showPasswordConditions.value = false;
    }, 200);
  }
};

// Get first error element reference
const getFirstErrorRef = () => {
  const errorFields = [
    { field: 'email', ref: emailRef },
    { field: 'name', ref: nameRef },
    { field: 'phone', ref: phoneRef },
    { field: 'gender', ref: genderRef },
    { field: 'address', ref: addressRef },
    { field: 'role', ref: roleRef },
    { field: 'password', ref: passwordRef },
    { field: 'confirmPassword', ref: confirmPasswordRef }
  ];

  for (const { field, ref } of errorFields) {
    if (errors[field]) {
      return ref;
    }
  }
  return null;
};

// Show validation error message and scroll to first error
const showValidationError = async () => {
  const firstErrorRef = getFirstErrorRef();

  // Use SweetAlert2 if available, otherwise use native alert
  if (typeof Swal !== 'undefined') {
    await Swal.fire({
      icon: 'warning',
      title: 'Thông báo',
      text: 'Quý khách vui lòng điền đầy đủ thông tin cần thiết và đúng định dạng',
      confirmButtonText: 'OK',
      confirmButtonColor: '#031358'
    });
  } else {
    alert('Quý khách vui lòng điền đầy đủ thông tin cần thiết và đúng định dạng');
  }

  // Scroll to first error
  if (firstErrorRef && firstErrorRef.value) {
    emit('scrollToError', firstErrorRef.value);
  }
};
// ===============================
// VALIDATE
// ===============================
const validate = () => {
  let ok = true;
  passwordSubmitted.value = true;

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key] = "";
  });

  if (!registerForm.email) {
    errors.email = "Email không được để trống";
    ok = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    errors.email = "Email không hợp lệ";
    ok = false;
  }

  if (!registerForm.name) {
    errors.name = "Vui lòng nhập họ tên";
    ok = false;
  }

  if (!/^(0[0-9]{9})$/.test(registerForm.phone)) {
    errors.phone = "Vui lòng nhập đủ số điện thoại của bạn (10 số)";
    ok = false;
  }

  if (registerForm.gender === "") {
    errors.gender = "Vui lòng chọn giới tính";
    ok = false;
  }

  if (!registerForm.address) {
    errors.address = "Vui lòng nhập đầy đủ địa chỉ";
    ok = false;
  }

  if (!registerForm.role) {
    errors.role = "Vui lòng chọn loại hình đăng ký";
    ok = false;
  }

  // Password validation with detailed conditions
  const isPasswordValid = Object.values(passwordConditions).every(condition => condition);
  if (!registerForm.password) {
    errors.password = "Mật khẩu không được để trống";
    ok = false;
  } else if (!isPasswordValid) {
    errors.password = "Mật khẩu chưa đáp ứng yêu cầu bảo mật";
    ok = false;
  }
  if (registerForm.confirmPassword !== registerForm.password) {
    errors.confirmPassword = "Mật khẩu không khớp";
    ok = false;
  }

  if (!ok) {
    showValidationError();
  }

  return ok;
};

// ===================================================
// STEP 1: GỬI OTP
// ===================================================
const handleSendOtp = async () => {
  if (!validate()) return;

  try {
    await showLoading(api.post("/thg/api/auth/send-otp", { email: registerForm.email }));
    updateAlertSuccess("OTP đã được gửi đến email!");

    showOtpStep.value = true;
  } catch (err) {
    updateAlertError(err.response?.data?.message || "Gửi OTP thất bại!");
  }
};

// ===================================================
// STEP 2: VERIFY OTP & REGISTER
// ===================================================
const verifyOtp = async (otpValue) => {
  if (!otpValue || otpValue.length !== 6) {
    errors.otp = "Vui lòng nhập đủ 6 số OTP";
    return;
  }
  errors.otp = "";

  const dataToSubmit = {
    email: registerForm.email,
    name: registerForm.name,
    phone: registerForm.phone,
    gender: registerForm.gender,
    address: registerForm.address,
    oldAddress: registerForm.oldAddress || null,
    role: registerForm.role,
    password: registerForm.password,
    referralCode: registerForm.role === 'BROKER' ? registerForm.referralCode || null : null,
    otp: otpValue
  };

  try {
    await showLoading(api.post("/thg/api/auth/register", dataToSubmit));
    updateAlertSuccess("Đăng ký thành công!");
    emit("switch-to-login");
  } catch (err) {
    updateAlertError(err.response?.data?.message || "Xác minh OTP thất bại!");
  }
};

// ===================================================
// GỬI LẠI OTP
// ===================================================
const resendOtp = async () => {
  try {
    await showLoading(api.post("/thg/api/auth/send-otp", { email: registerForm.email }));
    updateAlertSuccess("OTP mới đã được gửi!");
    if (otpComponentRef.value) {
      otpComponentRef.value.resetOtp();
    }
    emit("scrollTop");
  } catch (err) {
    updateAlertError(err.response?.data?.message || "Không gửi lại OTP được!");
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.form-container {
  background-color: white;
  border-radius: 22px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 25px;
  width: 100%;
  max-width: 800px;
  margin: 10px;
}

/* Header */
.form-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  position: relative;
}

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 13px;
  transition: background-color 0.3s ease;
  position: absolute;
  left: 5px;
  z-index: 1;
}

.back-btn:hover {
  background-color: #f5f5f5;
}

.form-title {
  text-align: center;
  color: #333;
  font-size: 24px;
  font-weight: 600;
  flex: 1;
}

/* Form group */
.form-group {
  margin-bottom: 20px;
  width: 100%;
}

.form-row {
  display: flex;
  gap: 15px;
  width: 100%;
}

.form-group-half {
  flex: 1;
}

label {
  display: block;
  color: #000;
  font-size: 16px;
  margin-bottom: 8px;
  text-align: left;
  font-weight: 500;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"],
select {
  width: 100%;
  padding: 14px;
  background-color: #EEF1FF;
  border: none;
  border-radius: 13px;
  font-size: 16px;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  transition: 0.3s;
}

/* Thêm padding-right cho select để mũi tên không bị dính lề */
select {
  padding-right: 40px !important;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23031358' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
}

/* Đảm bảo input cũng có padding tương tự cho đồng bộ */
input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"] {
  padding-right: 14px !important;
}

.password-input {
  position: relative;
}

input:focus,
select:focus {
  outline: none;
  background-color: #e6e9ff;
}

/* Error message */
.error {
  color: #FF9AA2;
  font-size: 14px;
  margin-top: 5px;
  text-align: left;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Password eye icon */
.password-wrapper {
  position: relative;
}

.password-input input {
  padding-right: 45px !important;
  width: 100%;
}

.toggle-eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
  cursor: pointer;
  font-size: 18px;
  z-index: 2;
}

/* Password conditions */
.password-conditions {
  margin-top: 10px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.condition-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;
  transition: all 0.3s ease;
}

.condition-item:last-child {
  margin-bottom: 0;
}

.condition-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  font-size: 12px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.condition-item.valid {
  color: #28a745;
}

.condition-item.valid .condition-icon {
  background-color: #28a745;
  color: white;
}

.condition-item:not(.valid):not(.invalid) {
  color: #6c757d;
}

.condition-item:not(.valid):not(.invalid) .condition-icon {
  background-color: #6c757d;
  color: white;
}

.condition-item.invalid {
  color: #dc3545;
  animation: shake 0.5s ease-in-out;
}

.condition-item.invalid .condition-icon {
  background-color: #dc3545;
  color: white;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.condition-text {
  flex: 1;
}
/* Buttons */
.switch-btn {
  width: 100%;
  padding: 15px;
  background-color: #031358;
  color: white;
  border: none;
  border-radius: 13px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s ease;
}

.switch-btn:hover {
  background-color: #020c3a;
}

/* Divider */
.divider {
  text-align: center;
  margin: 25px 0;
  color: #666;
  font-size: 14px;
  position: relative;
}

.divider span {
  background: white;
  padding: 0 15px;
  z-index: 1;
  position: relative;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #ddd;
}

/* Small mobile */
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .back-btn {
    left: 2px;
  }
}
</style>