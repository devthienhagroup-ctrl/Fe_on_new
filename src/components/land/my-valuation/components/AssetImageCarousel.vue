<template>
  <div v-if="images?.length" class="image-carousel-wrapper position-relative">
    <div class="image-carousel overflow-hidden">
      <div
          ref="carouselTrack"
          class="image-carousel-track"
          :style="trackStyle"
          @scroll="onCarouselScroll"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
      >
        <div
            v-for="(image, index) in images"
            :key="image.id || index"
            class="carousel-image-item"
        >
          <div class="image-card position-relative h-100">
            <img
                :src="image.tempUrl || '/placeholder-image.jpg'"
                class="img-fluid rounded-4 object-cover w-100 h-100"
                :alt="image.alt || image.fileName || 'image'"
                :loading="index < imagesPerView ? 'eager' : 'lazy'"
                @load="handleImageLoad"
                @click="emitOpen(image)"
            >

          </div>
        </div>
      </div>
    </div>

    <!-- NAVIGATION -->
    <div v-if="showNavigation" class="carousel-progress text-center mt-3">
      <span class="badge rounded-pill text-bg-light small">{{ progressText }}</span>
    </div>
  </div>

  <div v-else class="text-muted small fst-italic">Chưa có hình ảnh cho tài sản này.</div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  images: { type: Array, default: () => [] }
});

const emit = defineEmits(["open-image"]);

const carouselTrack = ref(null);
const currentImageIndex = ref(0);
const carouselStride = ref(0);
const windowWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1200);
const touchStartX = ref(0);
const touchDeltaX = ref(0);
let scrollAnimationFrame = null;

/* ===========================================================
   🔥 PHẦN LAZY LOAD, API, CACHE – ĐÃ BỎ HOÀN TOÀN
   =========================================================== */

/* ===========================================================
   RESPONSIVE SLIDES PER VIEW
   =========================================================== */
const imagesPerView = computed(() => {
  if (windowWidth.value < 768) return 1;
  if (windowWidth.value < 1200) return 2;
  return 3;
});

const showNavigation = computed(() => (props.images?.length || 0) > imagesPerView.value);

const progressText = computed(() => {
  if (!props.images?.length) return "0 / 0";
  const start = currentImageIndex.value + 1;
  const end = Math.min(currentImageIndex.value + imagesPerView.value, props.images.length);
  return `${start}-${end} / ${props.images.length}`;
});

/* ===========================================================
   STYLE DYNAMIC
   =========================================================== */
const trackStyle = computed(() => ({
  "--items-per-view": String(imagesPerView.value),
  "--carousel-gap": "1.25rem"
}));

function emitOpen(image) {
  emit("open-image", image);
}

function clampIndex(index) {
  const maxIndex = Math.max(0, (props.images?.length || 0) - imagesPerView.value);
  return Math.min(Math.max(index, 0), maxIndex);
}

function scrollToIndex(index) {
  const clamped = clampIndex(index);
  if (!carouselTrack.value || carouselStride.value <= 0) {
    currentImageIndex.value = clamped;
    return;
  }

  currentImageIndex.value = clamped;
  carouselTrack.value.scrollTo({
    left: clamped * carouselStride.value,
    behavior: "smooth"
  });
}

function nextImage() {
  scrollToIndex(currentImageIndex.value + 1);
}

function prevImage() {
  scrollToIndex(currentImageIndex.value - 1);
}

/* ===========================================================
   SCROLL LISTENER
   =========================================================== */
function onCarouselScroll() {
  if (!carouselTrack.value || carouselStride.value <= 0) return;

  if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame);

  scrollAnimationFrame = requestAnimationFrame(() => {
    const rawIndex = carouselTrack.value.scrollLeft / carouselStride.value;
    currentImageIndex.value = clampIndex(Math.round(rawIndex));
    scrollAnimationFrame = null;
  });
}

/* ===========================================================
   TOUCH HANDLING (SWIPE)
   =========================================================== */
function onTouchStart(event) {
  if (!event.touches?.length) return;
  touchStartX.value = event.touches[0].clientX;
  touchDeltaX.value = 0;
}

function onTouchEnd(event) {
  if (!carouselStride.value || !event.changedTouches?.length) return;

  touchDeltaX.value = event.changedTouches[0].clientX - touchStartX.value;

  if (Math.abs(touchDeltaX.value) < carouselStride.value * 0.2) return;

  if (touchDeltaX.value < 0) nextImage();
  else prevImage();
}

/* ===========================================================
   CALCULATE METRICS
   =========================================================== */
function handleImageLoad() {
  calculateMetrics();
}

function calculateMetrics() {
  nextTick(() => {
    if (!carouselTrack.value) {
      carouselStride.value = 0;
      return;
    }

    const items = carouselTrack.value.querySelectorAll(".carousel-image-item");
    if (!items.length) {
      carouselStride.value = 0;
      return;
    }

    const firstRect = items[0].getBoundingClientRect();
    let stride = firstRect.width;

    if (items.length > 1) {
      const secondRect = items[1].getBoundingClientRect();
      stride = secondRect.left - firstRect.left;
    } else {
      stride = carouselTrack.value.clientWidth;
    }

    carouselStride.value = stride > 0 ? stride : carouselTrack.value.clientWidth;

    currentImageIndex.value = clampIndex(currentImageIndex.value);
  });
}

function resetPosition() {
  currentImageIndex.value = 0;
  nextTick(() => {
    carouselTrack.value?.scrollTo({ left: 0, behavior: "auto" });
    calculateMetrics();
  });
}

function updateWindowWidth() {
  if (typeof window !== "undefined") {
    windowWidth.value = window.innerWidth;
  }
}

/* ===========================================================
   LIFECYCLE
   =========================================================== */
onMounted(() => {
  updateWindowWidth();

  if (typeof window !== "undefined") {
    window.addEventListener("resize", updateWindowWidth);
  }

  resetPosition();
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateWindowWidth);
  }
  if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame);
});

watch(() => props.images, resetPosition, { deep: true, immediate: true });
watch(imagesPerView, resetPosition);
watch(windowWidth, calculateMetrics);
</script>


<style scoped>

  .image-carousel-wrapper {
    padding: 0.5rem 0;
  }

  .image-carousel {
    position: relative;
    background: linear-gradient(180deg, rgba(248, 250, 252, 0.9) 0%, rgba(255, 255, 255, 0.85) 100%);
  }

  .image-carousel-track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: calc((100% - (var(--carousel-gap) * (var(--items-per-view) - 1))) / var(--items-per-view));
    gap: var(--carousel-gap);
    padding: 0.25rem 1.25rem;
    margin: 0 -1.25rem;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    scroll-padding: 1.25rem;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
    touch-action: pan-y;
  }

  .image-carousel-track::-webkit-scrollbar {
    height: 6px;
  }

  .image-carousel-track::-webkit-scrollbar-track {
    background: transparent;
  }

  .image-carousel-track::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 999px;
  }

  .carousel-image-item {
    scroll-snap-align: start;
  }

  .image-card {
    overflow: hidden;
    border-radius: 1.25rem;
    background: linear-gradient(135deg, rgba(226, 232, 240, 0.4), rgba(226, 232, 240, 0));
  }

  .image-card img {
    aspect-ratio: 4 / 3;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .image-card img:hover {
    transform: scale(1.02);
  }

  .carousel-nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    background-color: rgba(255, 255, 255, 0.92);
    border: 0;
  }

  .carousel-nav-button.start-edge {
    left: 1rem;
  }

  .carousel-nav-button.end-edge {
    right: 1rem;
  }

  .carousel-nav-button:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 0.5rem 1.25rem rgba(15, 23, 42, 0.15);
  }

  .carousel-nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: rgba(255, 255, 255, 0.68);
  }

  .carousel-nav-button i {
    color: #0d6efd;
  }

  .carousel-progress {
    margin-top: 1rem;
  }

  @media (max-width: 767.98px) {
    .image-carousel-track {
      padding: 0.25rem 0.75rem;
      margin: 0 -0.75rem;
    }

    .carousel-nav-button {
      width: 2.25rem;
      height: 2.25rem;
      box-shadow: 0 0.5rem 1rem rgba(15, 23, 42, 0.12);
    }

    .carousel-nav-button.start-edge {
      left: 0.6rem;
    }

    .carousel-nav-button.end-edge {
      right: 0.6rem;
    }
  }
  </style>
