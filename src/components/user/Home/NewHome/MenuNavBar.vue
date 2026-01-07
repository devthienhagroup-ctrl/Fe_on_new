<!-- Layout/MainNavbar.vue -->
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
        <a href="#home" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-widest">Trang chủ</a>
        <a href="#about" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-widest">Về chúng tôi</a>
        <a href="#services" class="hover:text-blue-400 transition text-sm font-semibold uppercase tracking-widest">Lĩnh vực</a>
        <a href="#contact" class="px-6 py-2 rounded-full border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition duration-300">Liên hệ</a>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Component logic có thể thêm vào đây nếu cần
</script>

<style scoped>
/* Style cụ thể cho Navbar nếu cần */
</style>