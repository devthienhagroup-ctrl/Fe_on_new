<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container" :class="{ 'shake': showShake }">
      <!-- Nút đóng -->
      <button class="close-btn" @click="closeModal">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Header với logo và tiêu đề -->
      <div class="modal-header">
        <div class="company-logo">
          <img src="/imgs/logoTHG.png" alt="Thiên Hà Group" @error="handleImageError">
        </div>
        <div></div>
        <div class="title-section">
          <h2>{{ isLoginMode ? 'Đăng nhập' : 'Đăng ký' }}</h2>
        </div>
      </div>

      <!-- Tabs chuyển đổi -->
      <div class="tabs-container">
        <div class="tab-slider" :class="{ 'login': isLoginMode, 'register': !isLoginMode }"></div>
        <button
            class="tab-btn"
            :class="{ 'active': !isLoginMode }"
            @click="switchToRegister"
        >
          Đăng ký
        </button>
        <button
            class="tab-btn"
            :class="{ 'active': isLoginMode }"
            @click="switchToLogin"
        >
          Đăng nhập
        </button>
      </div>

      <!-- Form đăng nhập -->
      <form v-if="isLoginMode" @submit.prevent="handleLogin" class="form-container">
        <!-- Giữ nguyên form đăng nhập... -->
        <div class="form-group">
          <label for="login-identifier">
            <span class="required">*</span> Số điện thoại/Email
          </label>
          <input
              id="login-identifier"
              v-model="loginForm.identifier"
              type="text"
              placeholder="Nhập số điện thoại hoặc email"
              required
          />
        </div>

        <div class="form-group">
          <label for="login-password">
            <span class="required">*</span> Mật khẩu
          </label>
          <div class="password-input">
            <input
                id="login-password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu"
                required
            />
            <button
                type="button"
                class="toggle-password"
                @click="togglePasswordVisibility"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="loginForm.rememberMe">
            <span class="checkmark"></span>
            Ghi nhớ đăng nhập
          </label>
          <button type="button" class="forgot-password" @click="openForgotPassword">
            Quên mật khẩu?
          </button>
        </div>

        <button type="submit" class="submit-btn">Đăng Nhập</button>

        <div class="terms-notice" v-if="!isLoginMode">
          Bằng việc đăng nhập, bạn đồng ý với
          <a href="#" class="terms-link">Điều khoản sử dụng</a>
          và
          <a href="#" class="terms-link">Chính sách bảo mật</a>
        </div>
      </form>

      <!-- Form đăng ký -->
      <form v-else @submit.prevent="handleRegisterSubmit" class="form-container">
        <!-- Thông tin cơ bản -->
        <div class="form-section">
          <h3 class="section-title">Thông tin cơ bản</h3>

          <div class="form-group">
            <label for="register-email">
              <span class="required">*</span> Email
            </label>
            <input
                id="register-email"
                v-model="registerForm.email"
                type="email"
                placeholder="example@email.com"
                required
                :class="{ 'error-input': registerErrors.email }"
            />
            <span v-if="registerErrors.email" class="error-message">{{ registerErrors.email }}</span>
          </div>

          <div class="form-group">
            <label for="full-name">
              <span class="required">*</span> Họ và tên
            </label>
            <input
                id="full-name"
                v-model="registerForm.fullName"
                type="text"
                placeholder="Nhập họ và tên đầy đủ"
                required
                :class="{ 'error-input': registerErrors.fullName }"
            />
            <span v-if="registerErrors.fullName" class="error-message">{{ registerErrors.fullName }}</span>
          </div>

          <div class="form-group">
            <label for="phone">
              <span class="required">*</span> Số điện thoại
            </label>
            <input
                id="phone"
                v-model="registerForm.phone"
                type="tel"
                placeholder="0912 345 678"
                required
                :class="{ 'error-input': registerErrors.phone }"
            />
            <span v-if="registerErrors.phone" class="error-message">{{ registerErrors.phone }}</span>
          </div>

          <div class="form-group">
            <label for="gender">
              <span class="required">*</span> Giới tính
            </label>
            <select id="gender" v-model="registerForm.gender" required :class="{ 'error-input': registerErrors.gender }">
              <option value="">Chọn giới tính</option>
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
            </select>
            <span v-if="registerErrors.gender" class="error-message">{{ registerErrors.gender }}</span>
          </div>
        </div>

        <!-- Địa chỉ -->
        <div class="form-section">
          <h3 class="section-title">Địa chỉ</h3>

          <AddressSelector
              v-model:addressData="registerForm.address"
              @update:addressData="handleAddressUpdate"
          />

          <div class="form-group full-width">
            <label for="old-address">Địa chỉ cũ (nếu có)</label>
            <input
                id="old-address"
                v-model="registerForm.address.old"
                type="text"
                placeholder="Địa chỉ cũ của bạn"
            />
          </div>
          <span v-if="registerErrors.address" class="error-message">{{ registerErrors.address }}</span>
        </div>

        <!-- Loại người dùng -->
        <div class="form-section">
          <div class="form-group">
            <label for="user-type">
              <span class="required">*</span> Bạn là ai?
            </label>
            <select id="user-type" v-model="registerForm.userType" required
                    :class="{ 'error-input': registerErrors.userType }"
                    @change="onUserTypeChange">
              <option value="">Chọn loại người dùng</option>
              <option value="BROKER">Môi giới</option>
              <option value="HOST">Chủ nhà</option>
            </select>
            <span v-if="registerErrors.userType" class="error-message">{{ registerErrors.userType }}</span>
          </div>

          <!-- Thông tin môi giới -->
          <div v-if="registerForm.userType === 'BROKER'" class="broker-fields">
            <div class="form-group">
              <label for="referral-code">Mã giới thiệu</label>
              <input
                  id="referral-code"
                  v-model="registerForm.brokerInfo.referralCode"
                  type="text"
                  placeholder="Nhập mã giới thiệu (nếu có)"
              />
            </div>

            <div class="form-group">
              <label for="experience">
                <span class="required">*</span> Năm kinh nghiệm
              </label>
              <select id="experience" v-model="registerForm.brokerInfo.experience" required>
                <option value="">Chọn số năm kinh nghiệm</option>
                <option value="1">Dưới 1 năm</option>
                <option value="1-3">1-3 năm</option>
                <option value="3-5">3-5 năm</option>
                <option value="5+">Trên 5 năm</option>
              </select>
            </div>

            <div class="form-group">
              <label for="slogan">Slogan của bản thân</label>
              <textarea
                  id="slogan"
                  v-model="registerForm.brokerInfo.slogan"
                  placeholder="Giới thiệu ngắn gọn về bản thân..."
                  rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Mật khẩu -->
        <div class="form-section">
          <h3 class="section-title">Bảo mật</h3>

          <div class="form-group">
            <label for="register-password">
              <span class="required">*</span> Mật khẩu
            </label>
            <div class="password-input">
              <input
                  id="register-password"
                  v-model="registerForm.password"
                  :type="showRegisterPassword ? 'text' : 'password'"
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  :class="{ 'error-input': registerErrors.password }"
              />
              <button
                  type="button"
                  class="toggle-password"
                  @click="showRegisterPassword = !showRegisterPassword"
              >
                <i :class="showRegisterPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span v-if="registerErrors.password" class="error-message">{{ registerErrors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirm-password">
              <span class="required">*</span> Xác minh mật khẩu
            </label>
            <div class="password-input">
              <input
                  id="confirm-password"
                  v-model="registerForm.confirmPassword"
                  :type="showRegisterConfirmPassword ? 'text' : 'password'"
                  placeholder="Nhập lại mật khẩu"
                  required
                  :class="{ 'error-input': registerErrors.confirmPassword }"
              />
              <button
                  type="button"
                  class="toggle-password"
                  @click="showRegisterConfirmPassword = !showRegisterConfirmPassword"
              >
                <i :class="showRegisterConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span v-if="registerErrors.confirmPassword" class="error-message">{{ registerErrors.confirmPassword }}</span>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Đang xử lý...' : 'Đăng ký' }}
        </button>

        <div class="terms-notice">
          Bằng việc đăng ký, bạn đồng ý với
          <a href="#" class="terms-link">Điều khoản sử dụng</a>
          và
          <a href="#" class="terms-link">Chính sách bảo mật</a>
        </div>
      </form>
    </div>

    <!-- OTP Modal (tự mở trong AuthModal) -->
    <OTPVerifyModal
        v-if="showOtpModal"
        :mode="otpMode"
        :email="otpEmail"
        :registerData="otpRegisterData"
        @close="handleOtpClose"
        @register-success="handleRegisterSuccess"
        @back="handleOtpBack"
        @resend="handleResendOtp"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import AddressSelector from "./AddressSelector.vue";
import OTPVerifyModal from "./OTPVerifyModal.vue";
import api from '/src/api/api.js'
import { useAuthStore } from '/src/stores/authStore.js'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

// Props và emits
const emit = defineEmits(['close', 'open-forgot'])

// Store và router
const authStore = useAuthStore()
const router = useRouter()

// State - giữ nguyên
const isLoginMode = ref(true)
const showShake = ref(false)
const showPassword = ref(false)
const showRegisterPassword = ref(false)
const showRegisterConfirmPassword = ref(false)
const isSubmitting = ref(false)

// OTP Modal State - giữ nguyên
const showOtpModal = ref(false)
const otpMode = ref('register')
const otpEmail = ref('')
const otpRegisterData = ref(null)

// Form data - giữ nguyên
const loginForm = reactive({
  identifier: '',
  password: '',
  rememberMe: false
})

const registerForm = reactive({
  email: '',
  fullName: '',
  phone: '',
  gender: '', // true/false as string
  address: {
    city: '',
    ward: '',
    specific: '',
    old: ''
  },
  userType: '', // BROKER/HOST
  brokerInfo: {
    referralCode: '',
    experience: '',
    slogan: ''
  },
  password: '',
  confirmPassword: ''
})

const registerErrors = reactive({
  email: '',
  fullName: '',
  phone: '',
  gender: '',
  address: '',
  userType: '',
  password: '',
  confirmPassword: ''
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
  // Không cần return gì cả
}

const closeLoadingAlert = () => {
  Swal.close()
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

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const closeModal = () => {
  emit('close')
  localStorage.removeItem('redirectUrl')
}

const switchToLogin = () => {
  if (!isLoginMode.value) {
    isLoginMode.value = true
    resetRegisterForm()
  }
}

const switchToRegister = () => {
  if (isLoginMode.value) {
    isLoginMode.value = false
  }
}

const resetRegisterForm = () => {
  Object.keys(registerForm).forEach(key => {
    if (key === 'address') {
      registerForm.address = {
        city: '',
        district: '',
        ward: '',
        specific: '',
        old: ''
      }
    } else if (key === 'brokerInfo') {
      registerForm.brokerInfo = {
        referralCode: '',
        experience: '',
        slogan: ''
      }
    } else {
      registerForm[key] = ''
    }
  })

  Object.keys(registerErrors).forEach(key => {
    registerErrors[key] = ''
  })

  showRegisterPassword.value = false
  showRegisterConfirmPassword.value = false
}

// ============================================
// XỬ LÝ ĐĂNG NHẬP
// ============================================
const handleLogin = async () => {
  const body = {
    email: loginForm.identifier,
    password: loginForm.password,
    rememberMe: loginForm.rememberMe
  };

  showLoadingAlert('Đang đăng nhập...');

  try {
    const res = await api.post('/thg/api/auth/login', body);

    // Đóng loading
    closeLoadingAlert();

    localStorage.setItem('remember', String(loginForm.rememberMe))

    const { accessToken, userInfo, listPermission, listAuthority } = res.data;

    // Lưu token + user
    authStore.setToken(accessToken);
    authStore.setuserEmail(body.email);
    if (userInfo) authStore.setUserInfo(userInfo);
    if (listPermission) authStore.setListPermission(listPermission);
    if (listAuthority) authStore.setListAuthority(listAuthority);

    showSuccessAlert("Đăng nhập thành công!");

    setTimeout(() => {
      console.log("Chuẩn bị lấy redirtectUrl")
      const redirectPath = localStorage.getItem("redirectUrl");
      console.log("Đã lấy redirectUrl", redirectPath)

      // Xóa để tránh dùng nhầm lần sau
      localStorage.removeItem("redirectUrl");
      console.log("Đã xóa redirectUrl")

      if (redirectPath) {
        router.push(redirectPath);
      }

      closeModal();
    }, 1200)

  } catch (err) {
    // Đóng loading nếu có lỗi
    closeLoadingAlert();

    showErrorAlert("Sai thông tin đăng nhập!", "Sai email hoặc mật khẩu");
  }
};

// Logic xác thực form đăng ký
const validateRegisterForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(registerErrors).forEach(key => {
    registerErrors[key] = '';
  });

  // Email validation
  if (!registerForm.email) {
    registerErrors.email = "Email không được để trống";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    registerErrors.email = "Email không hợp lệ";
    isValid = false;
  }

  // Full name validation
  if (!registerForm.fullName) {
    registerErrors.fullName = "Vui lòng nhập họ tên";
    isValid = false;
  }

  // Phone validation
  if (!registerForm.phone) {
    registerErrors.phone = "Số điện thoại không được để trống";
    isValid = false;
  } else if (!/^(0[0-9]{9})$/.test(registerForm.phone)) {
    registerErrors.phone = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)";
    isValid = false;
  }

  // Gender validation
  if (!registerForm.gender) {
    registerErrors.gender = "Vui lòng chọn giới tính";
    isValid = false;
  }

  // Address validation
  if (!registerForm.address.specific || !registerForm.address.city || !registerForm.address.ward) {
    registerErrors.address = "Vui lòng nhập đầy đủ địa chỉ";
    isValid = false;
  }

  // User type validation
  if (!registerForm.userType) {
    registerErrors.userType = "Vui lòng chọn loại hình đăng ký";
    isValid = false;
  }

  // Password validation
  if (!registerForm.password) {
    registerErrors.password = "Mật khẩu không được để trống";
    isValid = false;
  } else if (registerForm.password.length < 6) {
    registerErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    isValid = false;
  }

  // Confirm password validation
  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    isValid = false;
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = "Mật khẩu không khớp";
    isValid = false;
  }

  return isValid;
};

// ============================================
// XỬ LÝ ĐĂNG KÝ
// ============================================
const handleRegisterSubmit = async () => {
  if (isSubmitting.value) return;

  if (!validateRegisterForm()) {
    triggerShake();
    return;
  }

  isSubmitting.value = true;
  showLoadingAlert('Đang xử lý...');

  try {
    // Gửi OTP trước
    const otpResponse = await api.post("/thg/api/auth/send-otp", {
      email: registerForm.email,
      phone: registerForm.phone
    });

    // Đóng loading
    closeLoadingAlert();

    if (!otpResponse.data.success) {
      showErrorAlert("Gửi OTP thất bại", otpResponse.data.message || "Không thể gửi OTP");
      isSubmitting.value = false;
      return;
    }

    showSuccessAlert("OTP đã được gửi!", "Vui lòng kiểm tra email của bạn.");

    // Chuẩn bị dữ liệu đăng ký
    otpRegisterData.value = {
      email: registerForm.email,
      name: registerForm.fullName,
      phone: registerForm.phone,
      gender: registerForm.gender === 'true', // Chuyển string sang boolean
      address: `${registerForm.address.specific}/!! ${registerForm.address.ward}/!! ${registerForm.address.city}`,
      oldAddress: registerForm.address.old || null,
      role: registerForm.userType, // BROKER hoặc HOST
      password: registerForm.password,
      referralCode: registerForm.userType === 'BROKER' ? registerForm.brokerInfo.referralCode || null : null
    };

    // Mở modal OTP
    otpMode.value = 'register';
    otpEmail.value = registerForm.email;
    showOtpModal.value = true;

  } catch (error) {
    // Đóng loading nếu có lỗi
    closeLoadingAlert();

    showErrorAlert("Gửi OTP thất bại!", error.response?.data?.message || "Không thể gửi OTP");
  } finally {
    isSubmitting.value = false;
  }
};

// Xử lý khi OTP modal đóng
const handleOtpClose = () => {
  showOtpModal.value = false;
}

// Xử lý khi đăng ký thành công qua OTP
const handleRegisterSuccess = async (responseData) => {
  showSuccessAlert("Đăng ký thành công!", "Đang đăng nhập...");

  // Tự động đăng nhập sau khi đăng ký thành công
  showLoadingAlert('Đang đăng nhập...');

  try {
    const loginRes = await api.post('/thg/api/auth/login', {
      email: registerForm.email,
      password: registerForm.password,
      rememberMe: false
    });

    // Đóng loading
    closeLoadingAlert();

    const { accessToken, userInfo, listPermission, listAuthority } = loginRes.data;

    authStore.setToken(accessToken);
    authStore.setuserEmail(registerForm.email);
    if (userInfo) authStore.setUserInfo(userInfo);
    if (listPermission) authStore.setListPermission(listPermission);
    if (listAuthority) authStore.setListAuthority(listAuthority);

    // Đóng cả OTP modal và Auth modal
    showOtpModal.value = false;
    closeModal();

    // Chuyển hướng
    // setTimeout(() => {
    //   const flag = localStorage.getItem("loginFrom");
    //   if(flag === 'user'){
    //     router.push("/");
    //   }else{
    //     router.push("/-thg/quan-ly")
    //   }
    // }, 1000);
    showSuccessAlert("Đăng ký thành công!", "Đã tự động đăng nhập");

  } catch (loginError) {
    // Đóng loading nếu có lỗi
    closeLoadingAlert();

    // Nếu không tự động đăng nhập được, chỉ đóng modal và thông báo
    showOtpModal.value = false;
    showSuccessAlert("Đăng ký thành công!", "Vui lòng đăng nhập.");
    switchToLogin();
  }
}

// Xử lý khi nhấn nút back trong OTP modal
const handleOtpBack = () => {
  showOtpModal.value = false;
}

// Xử lý khi gửi lại OTP
const handleResendOtp = async (email) => {
  showLoadingAlert('Đang gửi lại OTP...');

  try {
    await api.post("/thg/api/auth/send-otp", {
      email: email,
      phone: registerForm.phone
    });

    // Đóng loading
    closeLoadingAlert();

    showSuccessAlert("OTP mới đã được gửi!", "Vui lòng kiểm tra email.");
  } catch (error) {
    // Đóng loading nếu có lỗi
    closeLoadingAlert();

    showErrorAlert("Gửi OTP thất bại!", error.response?.data?.message || "Không thể gửi lại OTP");
  }
}

// Xử lý khi address thay đổi từ AddressSelector
const handleAddressUpdate = (addressData) => {
  Object.assign(registerForm.address, addressData);
}

const onUserTypeChange = () => {
  if (registerForm.userType !== 'BROKER') {
    registerForm.brokerInfo = {
      referralCode: '',
      experience: '',
      slogan: ''
    }
  }
}

const openForgotPassword = () => {
  emit('open-forgot')
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}

const triggerShake = () => {
  showShake.value = true
  setTimeout(() => {
    showShake.value = false
  }, 500)
}

// Handle ESC key
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    if (showOtpModal.value) {
      handleOtpClose();
    } else {
      closeModal();
    }
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Thêm CSS cho lỗi */
.error-input {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Password toggles cho form đăng ký */
.form-group .password-input {
  position: relative;
}

.form-group .toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
}

/* Submit button khi disabled */
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Các style khác giữ nguyên... */
/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 700 !important; /* <-- FIX CỨNG CAO HƠN MENU */
  animation: fadeIn 0.3s ease;
  overflow: hidden;
}

/* Đảm bảo OTP modal cao hơn AuthModal */
:deep(.modal-overlay) {
  z-index: 999 !important;
}

:deep(.modal-container) {
  z-index: 999 !important;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal container */
.modal-container {
  background: #f8fafc;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08),
  0 10px 10px -5px rgba(0, 0, 0, 0.02);
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: hidden;
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

.modal-container.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
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

.company-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.company-logo img {
  height: 48px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.company-name {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
}

.title-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 400;
}

/* Tabs */
.tabs-container {
  display: flex;
  background: rgba(241, 245, 249, 0.8);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
  position: relative;
}

.tab-btn {
  flex: 1;
  padding: 14px 24px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
  position: relative;
  overflow: hidden;
  z-index: 2;
}

.tab-slider {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 8px);
  height: calc(100% - 8px);
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 12px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05),
  0 8px 10px -6px rgba(0, 0, 0, 0.01);
  z-index: 1;
}

.tab-slider.login {
  transform: translateX(calc(100% + 8px));
}

.tab-slider.register {
  transform: translateX(0);
}

.tab-btn.active {
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.tab-btn:not(.active):hover {
  color: #1e40af;
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-1px);
}

/* Forms */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-section {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 24px;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(226, 232, 240, 0.6);
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(59, 130, 246, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 640px) {
  .address-grid {
    grid-template-columns: 1fr;
  }
}

/* Labels và required */
.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #ef4444;
  font-size: 18px;
  line-height: 1;
}

/* Inputs và selects */
input, select, textarea {
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

input::placeholder,
select:invalid {
  color: #94a3b8;
  font-weight: 300;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 20px;
  padding-right: 48px;
}

textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

/* Password input styling từ LoginForm */
.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 18px;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.toggle-password:hover {
  background-color: #f5f5f5;
}

/* Form options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  user-select: none;
}

.checkbox-label input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.checkbox-label input:checked + .checkmark {
  background: #1e40af;
  border-color: #1e40af;
}

.checkbox-label input:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.forgot-password {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 4px 8px;
  border-radius: 6px;
}

.forgot-password:hover {
  color: #1e40af;
  background: rgba(59, 130, 246, 0.1);
}

.password-input input {
  width: 100%;
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

/* Terms notice */
.terms-notice {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.terms-link {
  color: #3b82f6;
  text-decoration: underline;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.terms-link:hover {
  color: #1e40af;
}

/* Broker fields */
.broker-fields {
  background: rgba(59, 130, 246, 0.03);
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
  border: 1px dashed #e2e8f0;
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

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    padding: 24px;
    width: 95%;
    margin: 16px;
  }

  .company-logo {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .company-name {
    font-size: 20px;
  }

  .title-section h2 {
    font-size: 24px;
  }

  .tabs-container {
    margin-bottom: 24px;
  }

  .tab-btn {
    padding: 12px 16px;
    font-size: 15px;
  }

  .form-section {
    padding: 20px;
  }

  .tab-slider {
    width: calc(50% - 4px);
    left: 2px;
    top: 2px;
    height: calc(100% - 4px);
  }

  .tab-slider.login {
    transform: translateX(calc(100% + 4px));
  }
}

/* Address Selector trong AuthModal */
.address-selector {
  margin-bottom: 16px;
}

/* Đảm bảo các input trong address selector phù hợp với modal */
.address-selector .input-box,
.address-selector .select-box {
  font-size: 15px;
  padding: 14px 16px;
}

/* Responsive cho address selector trong modal */
@media (max-width: 640px) {
  .address-selector .address-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .address-selector .input-box,
  .address-selector .select-box {
    padding: 12px 14px;
    font-size: 14px;
  }
}

/* Thêm vào cuối file AuthModal.vue */
.error-input {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

/* Password visibility toggles cho form đăng ký */
.form-group .password-input {
  position: relative;
}

.form-group .toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
}
</style>