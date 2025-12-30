<template>
  <div class="login-container">
    <div class="form-container">
      <div class="form-header">
        <button class="back-btn" @click="$emit('close-form')">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 class="form-title">Đăng Nhập</h2>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="login-identifier">Số điện thoại/Email</label>
          <input
              id="login-identifier"
              v-model="loginForm.identifier"
              type="text"
              placeholder="Nhập số điện thoại hoặc email"
              required
          />
        </div>

        <div class="form-group">
          <label for="login-password">Mật khẩu</label>
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
          <div class="remember-me">
            <input
                id="remember-me"
                v-model="loginForm.rememberMe"
                type="checkbox"
            />
            <label for="remember-me">Ghi nhớ đăng nhập</label>
          </div>
          <button
              type="button"
              class="forgot-password"
              @click="$emit('forgot-password')"
          >
            Quên mật khẩu?
          </button>
        </div>

        <button type="submit" class="submit-btn">Đăng Nhập</button>
      </form>

      <div class="divider">
        <span> hoặc </span>
      </div>

      <button class="switch-btn" @click="$emit('switch-to-register')">
        Đăng ký tài khoản mới
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '/src/api/api.js'
import { useAuthStore } from '/src/stores/authStore.js'
import { useRouter } from 'vue-router'
import { showLoading, updateAlertError, updateAlertSuccess } from '/src/assets/js/alertService.js'

const emit = defineEmits(['switch-to-register', 'close-form', 'forgot-password'])

const authStore = useAuthStore()
const router = useRouter()

const loginForm = ref({
  identifier: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  const body = {
    email: loginForm.value.identifier,
    password: loginForm.value.password,
    rememberMe: loginForm.value.rememberMe
  };

  try {
    // ❗ KHÔNG BAO HÀM POST TRONG showLoading NỮA
    const res = await showLoading(api.post('/thg/api/auth/login', body));
    localStorage.setItem('remember', String(loginForm.value.rememberMe))

    const { accessToken, userInfo, listPermission, listAuthority } = res.data;


    // Lưu token + user
    authStore.setToken(accessToken);
    authStore.setuserEmail(body.email);
    if (userInfo) authStore.setUserInfo(userInfo);
    if (listPermission) authStore.setListPermission(listPermission);
    if (listAuthority) authStore.setListAuthority(listAuthority);

    updateAlertSuccess("Đăng nhập thành công!");
    setTimeout(() => {
      const redirectPath = localStorage.getItem("redirectAfterLogin");

// Xóa để tránh dùng nhầm lần sau
      localStorage.removeItem("redirectAfterLogin");

      if (redirectPath) {
        router.push(redirectPath);
      } else {
        const flag = localStorage.getItem("loginFrom");

        router.push("/");


         // hoặc / cho user
      }
    }, 1200)

  } catch (err) {
    // ❗ BẮT LẤY LỖI DÙ BE TRẢ CÁI GÌ
    updateAlertError("Sai thông tin đăng nhập!", "Sai email hoặc mật khẩu");
  }
};

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.form-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 600px;
  margin: 20px;
}

.form-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.back-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: #f5f5f5;
}

.form-title {
  text-align: center;
  color: #333;
  font-size: 28px;
  font-weight: 600;
  flex: 1;
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  color: #000;
  font-size: 20px;
  margin-bottom: 8px;
  text-align: left;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  width: 100%;
  padding: 15px;
  background-color: #EEF1FF;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  transition: all 0.3s ease;
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="email"]:focus {
  outline: none;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
}

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
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  background-color: #EEF1FF;
  box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.forgot-password {
  color: #666;
  text-decoration: none;
  font-size: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #EEF1FF, #BDC9FE);
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.submit-btn:active {
  transform: translateY(0);
}

.divider {
  text-align: center;
  margin: 25px 0;
  color: #666;
  font-size: 16px;
}

.google-btn {
  width: 100%;
  padding: 15px;
  background-color: white;
  color: #000;
  border: 1px solid #000;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.google-btn:hover {
  background-color: #f5f5f5;
}

.google-btn img {
  width: 20px;
  height: 20px;
}

.switch-btn {
  width: 100%;
  padding: 15px;
  background-color: #031358;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-btn:hover {
  background-color: #020c3a;
}
</style>

