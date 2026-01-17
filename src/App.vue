<template>
  <div id="app">
    <router-view />
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
import {watch, onMounted, onBeforeUnmount, ref} from 'vue'
import { useRoute } from 'vue-router'
import {useAuthStore} from "./stores/authStore.js";
import AuthModal from "./components/user/Login/Modal/AuthModal.vue";
import ForgotPassword from "./components/user/Login/Modal/ForgotPassword.vue";

const route = useRoute()

const updateScroll = () => {
  if (route.path === '/-thg/quan-tri-du-lieu') {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}


//Đăng nhập
const auth = useAuthStore();
const showForgotPassword = ref(false)

const closeLoginModal = () => {
  auth.closeLoginModal();
}

const backToLoginFromForgot = () => {
  showForgotPassword.value = false
  auth.openLoginModal();
}

window.addEventListener('forgotPassword', () => {
  showForgotPassword.value = true
});

watch(
    () => route.path,
    () => {
      updateScroll()
    },
    { immediate: true }
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<style>
body {
  margin: 0;
  font-family: "Segoe UI", Roboto, sans-serif;
  background-color: #f9f9f9;
}
</style>

