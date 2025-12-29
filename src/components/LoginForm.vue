<template>
  <div
      class="d-flex align-items-center justify-content-center vh-100 bg-cover bg-center"
      :style="{ backgroundImage: 'url(' + backgroundImage + ')' }"
  >
    <div class="card p-4 shadow-lg" style="max-width: 400px; width: 100%; background: rgba(0, 0, 0, 0.6); border-radius: 25px;">
      <div class="text-center mb-3">
        <img :src="logoImage" alt="Logo" class="mb-3" style="width: 150px;" />
        <h3 class="text-white fw-bold">Đăng nhập</h3>
      </div>

      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="mb-3 text-white text-start">
          <label for="email" class="form-label">Email</label>
          <div class="input-group">
            <input
                type="email"
                id="email"
                v-model="email"
                class="form-control"
                placeholder="Nhập địa chỉ email của bạn"
                required
                style="border-radius: 12px;"
            />

          </div>
        </div>

        <!-- Mật khẩu -->
        <div class="mb-3 text-white text-start position-relative">
          <label for="password" class="form-label">Mật khẩu</label>

          <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="form-control pe-5"
              placeholder="Hãy nhập mật khẩu của bạn"
              required
              style="border-radius: 12px;"
          />

          <!-- Nút con mắt nằm đè -->
          <button
              type="button"
              class="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
              @click="showPassword = !showPassword"
              title="Hiện/Ẩn mật khẩu"
              style="z-index: 5; margin-top: 1.5px;"
          >
            <i
                :class="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
                class="text-secondary fs-5"
            ></i>
          </button>

          <div class="text-end mt-2">
            <a href="#" class="text-info small text-decoration-none">Quên mật khẩu?</a>
          </div>
        </div>

        <!-- Ghi nhớ -->
        <div class="form-check text-white mb-3 text-start">
          <input
              type="checkbox"
              id="remember"
              v-model="remember"
              class="form-check-input"
              style="border-radius: 5px;"
          />
          <label for="remember" class="form-check-label">Ghi nhớ tài khoản</label>
        </div>

        <!-- Nút đăng nhập -->
        <button type="submit" class="btn btn-primary w-100 fw-semibold" style="border-radius: 12px;">
          <i class="fa-solid fa-right-to-bracket me-2"></i>Đăng nhập
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore.js'
import api from '../api/api.js'
import backgroundImage from '/imgs/background_login.png'
import logoImage from '/imgs/logo.png'
import { showLoading, updateAlertSuccess, updateAlertError } from "../assets/js/alertService.js";

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')



// Khởi tạo store Pinia
import { useRouter } from 'vue-router'
const authStore = useAuthStore()
const router = useRouter()
console.log('Access Token:', authStore.accessToken);
// ✅ Hàm gọi API đăng nhập khớp với BE Spring Boot
const login = async () => {
  try {
    loading.value = true
    errorMsg.value = ''

    // 🔥 Gọi hàm showLoading để hiển thị SweetAlert trong lúc chờ
    const res = await showLoading(
        api.post('/thg/api/auth/login', {
          email: email.value,
          password: password.value,
          rememberMe: remember.value,
        })
    )

    localStorage.setItem('remember', String(remember.value))

    const accessToken = res.data?.accessToken
    if (accessToken) {
      // ✅ Lưu token & email vào Pinia store
      authStore.setToken(accessToken)
      authStore.setuserEmail(email.value)
      const userInfo = res.data?.userInfo
      const listPermission = res.data?.listPermission
      const listAuthority = res.data?.listAuthority

      if (userInfo) authStore.setUserInfo(userInfo)
      if ( listPermission ) authStore.setListPermission(listPermission)
      if ( listAuthority ) authStore.setListAuthority(listAuthority)


      console.log('✅ User info:', userInfo)
      console.log('Access Token:', accessToken)
      console.log('Email:', email.value)
      console.log('ListPermission:', listPermission)
      console.log('ListAuthority: ', listAuthority )

      // ✅ Hiển thị thông báo thành công
      updateAlertSuccess('Đăng nhập thành công!', 'Đang chuyển hướng...')

      // ⏳ Chờ một chút để người dùng thấy alert, sau đó điều hướng
      setTimeout(() => {
        const redirectPath = localStorage.getItem("redirectAfterLogin");

// Xóa để tránh dùng nhầm lần sau
        localStorage.removeItem("redirectAfterLogin");

        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/-thg/quan-ly"); // hoặc / cho user
        }
      }, 1200)
    } else {
      updateAlertError('Đăng nhập thất bại', 'Không nhận được access token.')
    }
  } catch (err) {
    console.error('Login error:', err)
    const msg = err.response?.data?.message || 'Sai email hoặc mật khẩu.'
    errorMsg.value = msg

    updateAlertError('Đăng nhập thất bại', msg)
  } finally {
    loading.value = false
  }
}

// Hàm xử lý khi submit form
const handleLogin = () => {
  if (!email.value || !password.value) {
    errorMsg.value = 'Vui lòng nhập đầy đủ email và mật khẩu.'
    return
  }
  login()
}


</script>



<style scoped>
.bg-cover {
  background-size: cover;
  background-position: center;
}
.card {
  backdrop-filter: blur(10px);
}
</style>
