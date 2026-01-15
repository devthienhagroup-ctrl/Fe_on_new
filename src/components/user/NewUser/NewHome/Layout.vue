<!-- TestComponent.vue -->
<template>
  <div class="bg-brand-dark text-slate-200 overflow-x-hidden">
    <!-- NAVIGATION -->
    <MenuNavBar />

    <!-- Loading state -->
    <div v-if="!isCssLoaded" class="loading-overlay">
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">Đang tải giao diện...</p>
      </div>
    </div>

    <!-- Chỉ render router-view khi CSS đã load -->
    <div v-else class="router-wrapper">
      <router-view></router-view>
    </div>

    <!-- FOOTER -->
<!--    <FooterHome @scrollToTop="scrollToTop" />-->
    <FloatingContact
      align="left"
    ></FloatingContact>
  </div>

  <!-- Modal đăng nhập/đăng ký -->
  <AuthModal
      v-if="auth.showLoginModal"
      @close="closeLoginModal"
      @open-forgot="showForgotPassword = true"
  />

  <!-- Modal quên mật khẩu -->
  <ForgotPassword
      v-if="showForgotPassword"
      @close="showForgotPassword = false"
      @back-to-login="backToLoginFromForgot"
  />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue"
import AuthModal from "../../Login/Modal/AuthModal.vue";
import ForgotPassword from "../../Login/Modal/ForgotPassword.vue";
import MenuNavBar from "./MenuNavBar.vue";
import FooterHome from "./FooterHome.vue";
import FloatingContact from "../../Home/FloatingContact.vue";
import {useAuthStore} from "../../../../stores/authStore.js";

import api from "../../../../api/api.js";

const isCssLoaded = ref(false)
const isLoading = ref(false)
const showForgotPassword = ref(false)

//Đăng nhập
const auth = useAuthStore();

const closeLoginModal = () => {
  auth.closeLoginModal();
}

// Cách 1: Viết hàm riêng
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Lấy CSS Global từ DB
const getCSSGlobal = async () => {
  try {
    isLoading.value = true;
    console.log('🔄 Bắt đầu load CSS từ API...');

    // Thêm timeout để tránh treo
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('CSS load timeout after 8 seconds')), 8000);
    });

    const response = await Promise.race([
      api.get('/thg/public/cms/contentSection/55'),
      timeoutPromise
    ]);

    if (response.status === 200) {
      const css = JSON.parse(response.data.contentJson);
      console.log('✅ CSS data loaded:', Object.keys(css));

      // Áp dụng CSS variables
      applyCSSVariables(css);

      console.log('✅ CSS variables đã được áp dụng');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Lỗi load CSS:', error);
    // Áp dụng fallback CSS để không bị treo
    applyFallbackCSS();
    return false;
  } finally {
    isLoading.value = false;
  }
}

// Phương thức áp dụng CSS variables
const applyCSSVariables = (css) => {
  Object.entries(css).forEach(([_, group]) => {
    if (typeof group !== 'object') return;

    Object.entries(group).forEach(([key, value]) => {
      if (Array.isArray(value)) return;
      // Chỉ set các biến CSS hợp lệ
      if (key.startsWith('--')) {
        document.documentElement.style.setProperty(key, value);
      }
    });
  });

  // gradient arrays → split
  const primary = css.gradients?.["--gradient-primary"];
  if (primary && Array.isArray(primary) && primary.length >= 2) {
    document.documentElement.style.setProperty("--gradient-primary-from", primary[0]);
    document.documentElement.style.setProperty("--gradient-primary-to", primary[1]);
  }

  const text = css.gradients?.["--gradient-text"];
  if (text && Array.isArray(text) && text.length >= 2) {
    document.documentElement.style.setProperty("--gradient-text-from", text[0]);
    document.documentElement.style.setProperty("--gradient-text-to", text[1]);
  }
}

// CSS fallback khi API fail
const applyFallbackCSS = () => {
  console.log('⚠️ Áp dụng fallback CSS...');

  const fallbackCSS = {
    colors: {
      "--color-primary": "#3b82f6",
      "--color-secondary": "#8b5cf6",
      "--color-blue-400": "#60a5fa",
      "--color-blue-500": "#3b82f6",
      "--color-blue-600": "#2563eb",
      "--color-purple-500": "#8b5cf6",
      "--color-purple-600": "#7c3aed",
      "--color-slate-300": "#cbd5e1",
      "--color-slate-400": "#94a3b8",
      "--color-slate-700": "#334155",
      "--color-slate-900": "#0f172a",
      "--color-emerald-500": "#10b981"
    },
    gradients: {
      "--gradient-primary": ["#3b82f6", "#8b5cf6"],
      "--gradient-text": ["#60a5fa", "#a78bfa"]
    }
  };

  applyCSSVariables(fallbackCSS);
}
let chatScript= null;

onMounted(async () => {
  console.log('🚀 Layout mounted, loading CSS...');

  try {
    // ĐỢI CSS load xong trước
    const success = await getCSSGlobal();

    if (success) {
      console.log('✅ CSS loaded successfully, enabling router-view');
      isCssLoaded.value = true;

      // Phát sự kiện để các component khác biết CSS đã sẵn sàng
      window.dispatchEvent(new CustomEvent('css-variables-ready'));
    } else {
      console.log('⚠️ CSS loaded with fallback, enabling router-view');
      isCssLoaded.value = true;
    }
  } catch (error) {
    console.error('🔥 Lỗi nghiêm trọng khi load CSS:', error);
    // Vẫn enable router-view để không bị treo
    isCssLoaded.value = true;
    applyFallbackCSS();
  }

  // Scroll to top function
  window.scrollToTop = function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Bắt sự kiện mở modal đăng nhập
  window.addEventListener('open-login-modal', () => {
    showAuthModal.value = true
  })

  chatScript = document.createElement('script')
  chatScript.src = 'https://api.sale.ai.vn/static/widget.js?chatbotId=MjIz'
  chatScript.async = true
  chatScript.id = 'botchat-script'
  document.body.appendChild(chatScript)

})

// Cleanup
onBeforeUnmount(() => {
  window.removeEventListener('open-login-modal', () => {
    showAuthModal.value = true
  });
})

const backToLoginFromForgot = () => {
  showForgotPassword.value = false
  showAuthModal.value = true
}
</script>

<style scoped>
/* Import global styles */
@import '../../UI/GlobalUI.css';

/* Loading overlay styles */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: #94a3b8;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Router wrapper */
.router-wrapper {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
  animation-delay: 0.3s;
}

@keyframes fadeIn {
  to { opacity: 1; }
}
</style>