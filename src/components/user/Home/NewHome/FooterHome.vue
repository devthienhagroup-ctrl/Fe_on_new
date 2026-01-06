<!-- Layout/MainFooter.vue -->
<template>
  <footer class="bg-[#020617] text-slate-400 border-t border-slate-800 relative">
    <div class="container mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Cột 1: Thông tin công ty & Mạng xã hội -->
        <div class="space-y-6">
          <div>
            <span class="text-3xl font-bold text-white tracking-wider">THIENHA<span class="text-blue-500">GROUP</span></span>
            <p class="mt-4 text-sm leading-relaxed opacity-80">
              Chúng tôi cung cấp các giải pháp công nghệ và dịch vụ hàng đầu, mang lại giá trị bền vững cho khách hàng và đối tác trên toàn cầu.
            </p>
          </div>

          <!-- Social Icons -->
          <div class="flex space-x-4">
            <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 group">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-sky-500 hover:-translate-y-1 transition-all duration-300">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300">
              <i class="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <!-- Cột 2: Liên kết nhanh -->
        <div>
          <TitleWithBeforeLine align="left">
            Liên Kết Nhanh
          </TitleWithBeforeLine>
          <ul class="space-y-3">
            <li><a href="#" class="hover:text-blue-500 hover:translate-x-1 transition-transform inline-block">Trang Chủ</a></li>
            <li><a href="#" class="hover:text-blue-500 hover:translate-x-1 transition-transform inline-block">Về Chúng Tôi</a></li>
            <li><a href="#" class="hover:text-blue-500 hover:translate-x-1 transition-transform inline-block">Dịch Vụ</a></li>
            <li><a href="#" class="hover:text-blue-500 hover:translate-x-1 transition-transform inline-block">Dự Án</a></li>
            <li><a href="#" class="hover:text-blue-500 hover:translate-x-1 transition-transform inline-block">Tuyển Dụng</a></li>
          </ul>
        </div>

        <!-- Cột 3: Thông tin liên hệ -->
        <div>
          <TitleWithBeforeLine align="left">
            Liên Hệ
          </TitleWithBeforeLine>
          <ul class="space-y-4">
            <li class="flex items-start">
              <i class="fas fa-map-marker-alt w-6 h-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0"></i>
              <span><b>Trụ sở: </b>14 đường 15, KĐT Vạn Phúc, Phường Hiệp Bình Phước, TP. Thủ Đức, TP.HCM</span>
            </li>
            <li class="flex items-start">
              <i class="fas fa-map-marker-alt w-6 h-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0"></i>
              <span><b>Chi nhánh: </b>01 Hoa Lài, Phường 7, Quận Phú Nhuận, TP. Hồ Chí Minh</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-phone w-6 h-6 text-blue-500 mr-3 flex-shrink-0"></i>
              <span>091.123.1882</span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-envelope w-6 h-6 text-blue-500 mr-3 flex-shrink-0"></i>
              <span>thienhagroup@gmail.com</span>
            </li>
          </ul>
        </div>

        <!-- Cột 4: Facebook Embed -->
        <div>
          <TitleWithBeforeLine align="left">
            Fanpage
          </TitleWithBeforeLine>
          <div class="rounded-lg overflow-hidden border border-slate-700 w-full shadow-lg">
            <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61557872978828&tabs=timeline&width=340&height=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                width="100%"
                height="300"
                style="border:none;overflow:hidden;"
                scrolling="no"
                frameborder="0"
                allowfullscreen="true"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                class="map-filter hover:filter-none transition-all duration-500">

            </iframe>
          </div>
        </div>
      </div>

      <!-- Bản đồ di chuyển xuống dưới cùng -->
      <div class="mt-12 pt-8 border-t border-slate-800">
        <TitleWithBeforeLine align="left">
          Bản Đồ
        </TitleWithBeforeLine>
        <div class="rounded-lg overflow-hidden border border-slate-700 w-full shadow-lg">
          <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.618570795994!2d106.70710827481905!3d10.840473989312184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175295a6c0ebc8b%3A0xc51466fa5345ab8c!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gxJDhuqd1IFTGsCBC4bqldCDEkOG7mW5nIFPhuqNuIFRoacOqbiBIw6AgR3JvdXA!5e0!3m2!1svi!2s!4v1767605793459!5m2!1svi!2s"
              width="100%"
              height="400"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              class="map-filter hover:filter-none transition-all duration-500">

          </iframe>
        </div>
      </div>

      <!-- Dòng bản quyền & Links phụ -->
      <div class="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p class="opacity-60 mb-4 md:mb-0">© 2024 <span class="text-white font-semibold">THIENHA GROUP</span>. All Rights Reserved.</p>
        <div class="flex space-x-6">
          <a href="#" class="hover:text-white transition">Điều khoản</a>
          <a href="#" class="hover:text-white transition">Bảo mật</a>
          <a href="#" class="hover:text-white transition">Hỗ trợ</a>
        </div>
      </div>
    </div>

    <!-- Nút Back To Top -->
    <button
        id="backToTop"
        @click="emit('scrollToTop')"
        style="right: 85px;"
        :class="[
        'fixed bottom-8 z-50 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform group',
        showBackToTop ? 'translate-y-0 opacity-100 visible' : 'translate-y-10 opacity-0 invisible'
      ]">
      <i class="fas fa-chevron-up w-6 h-6 group-hover:-translate-y-1 transition-transform"></i>
    </button>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import TitleWithBeforeLine from "../../UI/TitleWithBeforeLine.vue";

const emit = defineEmits(['scrollToTop']);
const showBackToTop = ref(false);

const handleScroll = () => {
  // Hiển thị nút khi cuộn xuống quá 300px
  showBackToTop.value = window.scrollY > 300;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Kiểm tra ngay khi component được mount
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Map filter */
.map-filter {
  filter: grayscale(100%) invert(90%) contrast(85%);
  transition: filter 0.5s ease;
}
.map-filter:hover {
  filter: none;
}
</style>