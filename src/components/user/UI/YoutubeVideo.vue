<template>
  <!-- Video Demo -->
  <div class="max-w-4xl mx-auto" data-aos="fade-up">
    <div class="glass-card rounded-3xl p-8">
      <h3 class="text-2xl font-bold text-white mb-6 text-center">Xem hệ thống hoạt động</h3>
      <div class="video-container relative">
        <!-- Placeholder hiển thị trước khi phát video -->
        <div
            v-if="!videoStarted"
            class="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            @click="startVideo"
        >
          <div class="text-center">
            <div class="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-play text-white text-2xl"></i>
            </div>
            <p class="text-white font-semibold">Video Demo Hệ Thống</p>
            <p class="text-slate-300 text-sm mt-2">Xem tất cả tính năng trong 3 phút</p>
          </div>
        </div>

        <!-- Iframe YouTube -->
        <div
            v-show="videoStarted"
            class="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
        >
          <iframe
              ref="youtubeIframe"
              class="w-full h-full"
              :src="embedUrl"
              title="Video Demo Hệ Thống"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  videoId: {
    type: String,
    default: 'YOUR_VIDEO_ID' // Thay bằng ID video thực tế
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  showControls: {
    type: Boolean,
    default: true
  },
  loop: {
    type: Boolean,
    default: false
  },
  mute: {
    type: Boolean,
    default: false
  }
})

// Refs
const videoStarted = ref(true)
const youtubeIframe = ref(null)
const player = ref(null)

// Computed
const embedUrl = computed(() => {
  const params = new URLSearchParams({
    rel: 0,
    modestbranding: 1,
    playsinline: 1,
    ...(props.showControls ? {} : { controls: 0 }),
    ...(props.loop ? { loop: 1, playlist: props.videoId } : {}),
    ...(props.mute ? { mute: 1 } : {}),
    ...(videoStarted.value && props.autoplay ? { autoplay: 1 } : {})
  })

  return `https://www.youtube.com/embed/${props.videoId}?${params.toString()}`
})

// Methods
const startVideo = () => {
  videoStarted.value = true
}

const stopVideo = () => {
  videoStarted.value = false
  if (player.value) {
    // Có thể sử dụng YouTube API nếu cần điều khiển player
    console.log('Video stopped')
  }
}

// Hàm điều khiển YouTube Player nếu cần
const loadYouTubeAPI = () => {
  // Chỉ load nếu cần sử dụng YouTube Player API
  const tag = document.createElement('script')
  tag.src = 'https://www.youtube.com/iframe_api'
  const firstScriptTag = document.getElementsByTagName('script')[0]
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
}

// Lifecycle hooks
onMounted(() => {
  if (props.autoplay) {
    startVideo()
  }

  // Nếu cần sử dụng YouTube Player API:
  // loadYouTubeAPI()
})

onUnmounted(() => {
  // Cleanup nếu cần
})
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.video-container > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .glass-card {
    padding: 1.5rem;
  }
}
</style>