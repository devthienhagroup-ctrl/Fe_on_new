<!-- UI/ModalYoutube.vue -->
<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="closeModal">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/70" @click="closeModal"></div>

    <!-- Modal Container -->
    <div class="relative w-full max-w-4xl mx-auto z-10">
      <!-- Modal Content -->
      <div class="bg-gradient-to-br from-gray-900 to-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
        <!-- Header -->
        <div class="flex items-center justify-between p-5 border-b border-slate-700/50">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-red-500/10 rounded-lg">
              <i class="fas fa-play text-red-500 text-lg"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Hồ sơ Thiên Hà Group</h3>
              <p class="text-sm text-slate-400">Giới thiệu công ty và tầm nhìn</p>
            </div>
          </div>

          <!-- Close Button -->
          <button
              @click="closeModal"
              class="p-2 hover:bg-slate-800 rounded-lg transition-all duration-300 hover:scale-110 group"
          >
            <i class="fas fa-times text-slate-400 group-hover:text-white text-xl transition-colors"></i>
          </button>
        </div>

        <!-- YouTube Iframe -->
        <div class="relative pt-[45%] bg-black">
          <!-- Iframe hiển thị ngay nhưng có opacity 0 khi loading -->
          <iframe
              v-if="isOpen"
              :key="youtubeUrl"
              :src="youtubeUrl"
              :class="{'opacity-0': loading, 'opacity-100': !loading}"
              class="absolute top-0 left-0 w-full h-full transition-opacity duration-300"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
              @load="handleIframeLoad"
          ></iframe>

          <!-- Loading Spinner -->
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black">
            <div class="flex flex-col items-center gap-4">
              <div class="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p class="text-slate-400 text-sm">Đang tải video...</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-5 bg-slate-900/50 border-t border-slate-700/50">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <i class="fas fa-building text-white text-sm"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-white">Thiên Hà Group</p>
                <p class="text-xs text-slate-400">Kênh chính thức</p>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                  @click="openInNewTab"
                  class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                <i class="fab fa-youtube text-red-500 group-hover:scale-110 transition-transform"></i>
                <span class="text-sm font-medium">Mở trên YouTube</span>
              </button>

              <button
                  @click="copyLink"
                  class="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-300 flex items-center gap-2 group"
              >
                <i class="fas fa-link group-hover:rotate-12 transition-transform"></i>
                <span class="text-sm font-medium">Sao chép link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute -top-6 -left-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      <div class="absolute -bottom-6 -right-6 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  youtubeUrl: {
    type: String,
    default: 'https://www.youtube.com/embed/JZ1YvvYo2hA'
  }
})

const emit = defineEmits(['close'])

const loading = ref(true)

const openInNewTab = () => {
  window.open(props.youtubeUrl.replace('embed/', 'watch?v='), '_blank')
}

const copyLink = async () => {
  const url = props.youtubeUrl.replace('embed/', 'watch?v=')
  try {
    await navigator.clipboard.writeText(url)
    alert('Đã sao chép link vào clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const closeModal = () => {
  emit('close')
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

const handleIframeLoad = () => {
  loading.value = false
  console.log('YouTube iframe loaded successfully')
}

// Reset loading khi mở modal
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loading.value = true
  } else {
    loading.value = true // Reset khi đóng modal
  }
})

// Reset loading khi URL thay đổi
watch(() => props.youtubeUrl, () => {
  loading.value = true
})

// Thêm sự kiện keydown
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped>
/* Chỉ giữ loading animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transition for iframe */
iframe {
  transition: opacity 0.3s ease-in-out;
}
</style>