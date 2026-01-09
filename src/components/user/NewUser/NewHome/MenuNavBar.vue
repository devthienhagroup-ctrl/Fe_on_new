<!-- src/components/user/NewUser/NewHome/MenuNavBar.vue -->
<template>
  <nav class="fixed w-full z-50 transition-all duration-300 bg-brand-dark/90" id="navbar">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <a href="#" class="text-2xl font-display font-black tracking-wider text-white flex items-center gap-2" data-aos="fade-down">
        <div class="w-12 h-12 rounded-full animate-pulse">
          <img src="/imgs/logoTHG.png" alt="logoTHG"/>
        </div>
        THIÊN HÀ<span class="text-blue-400">GROUP</span>
      </a>
      <div class="hidden md:flex space-x-8 items-center" data-aos="fade-down" data-aos-delay="100">
        <router-link to="/" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-widest">Trang chủ</router-link>
        <a href="#about" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-widest">Về chúng tôi</a>
        <a href="#services" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-widest">Lĩnh vực</a>
        <a href="#contact" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-widest">Liên hệ</a>
        <button v-if="auth.userInfo == null"  class="px-6 py-2 rounded-full border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition duration-300"
                @click="openLoginModal" ><i class="fa fa-user"/> Đăng nhập</button>

        <!-- Logout button: icon always visible, text hidden until hover/focus -->
        <button
            v-else
            class="login-btn rounded-full border border-blue-500 text-blue-400 hover:text-white transition duration-300"
            style="padding: 5px 15px;"
            @click="handleLogout"
            aria-label="Đăng xuất"
        >
          <i class="fa-solid fa-right-from-bracket logout-icon"></i>
          <span class="logout-text">Đăng xuất</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {onMounted} from "vue";
import {useAuthStore} from "../../../../stores/authStore.js";
const auth = useAuthStore();

const openLoginModal = () => {
  window.dispatchEvent(new Event('open-login-modal'))
}

// Hàm xử lý đăng xuất
const handleLogout =async () => {
  const store = useAuthStore();
  await store.logout();
};

onMounted(() => {

})
</script>

<style scoped lang="css">
/* Button layout: keep icon visible, collapse text initially */
.login-btn {
  display: inline-flex;
  align-items: center;
  gap: 0;
  padding: 0.375rem 0.375rem; /* small horizontal padding to look like icon-only */
  overflow: hidden;
  background: transparent;
  cursor: pointer;
  transition: padding 0.5s ease;
}

/* Icon size and stable spacing */
.login-btn .logout-icon {
  font-size: 1rem;
  line-height: 1;
  display: inline-block;
  width: 1em;
  text-align: center;
}

/* Text is hidden initially by max-width + opacity */
.login-btn .logout-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  max-width: 0;              /* collapsed */
  opacity: 0;
  margin-left: 0;
  transition: max-width 0.25s ease, opacity 0.25s ease, margin-left 0.25s ease;
  vertical-align: middle;
}

/* On hover or keyboard focus, expand text */
.login-btn:hover,
.login-btn:focus {
  padding-right: 0.75rem;    /* allow space for text */
  padding-left: 0.5rem;
}

.login-btn:hover .logout-text,
.login-btn:focus .logout-text {
  max-width: 140px;          /* enough to show the label */
  opacity: 1;
  margin-left: 0.5rem;
}

/* Improve keyboard accessibility */
.login-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
}
</style>