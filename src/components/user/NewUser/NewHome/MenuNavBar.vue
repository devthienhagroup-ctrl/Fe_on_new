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

      <!-- Desktop Menu -->
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

      <!-- Hamburger Button for Mobile -->
      <button
          class="hamburger md:hidden"
          id="hamburger"
          :class="{ 'active': isMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="Menu"
          aria-expanded="isMenuOpen"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div
        class="mobile-menu-overlay fixed inset-0 bg-brand-dark/95 z-40 md:hidden transition-all duration-300"
        :class="{ 'opacity-0 invisible': !isMenuOpen, 'opacity-100 visible': isMenuOpen }"
        @click="closeMobileMenu"
    >
      <div
          class="mobile-menu-content absolute top-20 left-0 w-full p-6 transform transition-transform duration-300"
          :class="{ '-translate-y-4': !isMenuOpen, 'translate-y-0': isMenuOpen }"
          @click.stop
      >
        <div class="flex flex-col space-y-6 text-center">
          <router-link
              to="/"
              class="text-white hover:text-blue-400 transition text-lg font-semibold uppercase tracking-widest py-3"
              @click="closeMobileMenu"
          >
            Trang chủ
          </router-link>
          <a
              href="#about"
              class="text-white hover:text-blue-400 transition text-lg font-semibold uppercase tracking-widest py-3"
              @click="closeMobileMenu"
          >
            Về chúng tôi
          </a>
          <a
              href="#services"
              class="text-white hover:text-blue-400 transition text-lg font-semibold uppercase tracking-widest py-3"
              @click="closeMobileMenu"
          >
            Lĩnh vực
          </a>
          <a
              href="#contact"
              class="text-white hover:text-blue-400 transition text-lg font-semibold uppercase tracking-widest py-3"
              @click="closeMobileMenu"
          >
            Liên hệ
          </a>

          <!-- Mobile Auth Buttons -->
          <div class="pt-6 border-t border-gray-700">
            <button
                v-if="auth.userInfo == null"
                class="w-full px-6 py-3 rounded-full border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition duration-300"
                @click="openMobileLogin"
            >
              <i class="fa fa-user mr-2"></i> Đăng nhập
            </button>

            <button
                v-else
                class="w-full px-6 py-3 rounded-full border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition duration-300"
                @click="handleMobileLogout"
            >
              <i class="fa-solid fa-right-from-bracket mr-2"></i> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../../../../stores/authStore.js";

const auth = useAuthStore();
const isMenuOpen = ref(false);

const openLoginModal = () => {
  window.dispatchEvent(new Event('open-login-modal'));
  closeMobileMenu();
};

const openMobileLogin = () => {
  openLoginModal();
  closeMobileMenu();
};

// Hàm xử lý đăng xuất
const handleLogout = async () => {
  const store = useAuthStore();
  await store.logout();
  closeMobileMenu();
};

const handleMobileLogout = async () => {
  await handleLogout();
};

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  // Prevent body scrolling when menu is open
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
};

// Close mobile menu
const closeMobileMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};

// Close menu on ESC key
onMounted(() => {
  const handleEscKey = (e) => {
    if (e.key === 'Escape' && isMenuOpen.value) {
      closeMobileMenu();
    }
  };

  window.addEventListener('keydown', handleEscKey);

  return () => {
    window.removeEventListener('keydown', handleEscKey);
  };
});
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

/* Hamburger Styles */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  z-index: 1001;
  position: relative;
  padding: 10px;
  background: none;
  border: none;
  margin: -10px;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 3px 0;
  transition: 0.3s;
  pointer-events: none;
}

/* Hamburger Animation */
.hamburger.active span:nth-child(1) {
  transform: rotate(-45deg) translate(-5px, 6px);
  background-color: #60a5fa; /* blue-400 */
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(45deg) translate(-5px, -6px);
  background-color: #60a5fa; /* blue-400 */
}

/* Mobile Responsive */
@media (max-width: 767px) {
  .hamburger {
    display: flex;
  }

  .mobile-menu-overlay {
    backdrop-filter: blur(5px);
  }
}

/* Smooth transitions for mobile menu */
.mobile-menu-content {
  will-change: transform;
}

.mobile-menu-overlay {
  will-change: opacity;
}
</style>