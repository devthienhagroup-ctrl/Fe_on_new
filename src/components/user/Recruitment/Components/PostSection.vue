<template>
  <section class="related-posts">
    <h2 class="section-title fade-up">{{ config.sectionTitle }}</h2>
    <div class="carousel-container">
      <div class="carousel" ref="carousel">
        <router-link
            v-for="(post, index) in posts"
            :key="index"
            :to="'/tin-tuc/' + post.slug"
            class="post-card"
            @mouseenter="hoverIndex = index"
            @mouseleave="hoverIndex = -1"
            :style="postCardStyle"
        >
          <div class="image-container" :style="imageContainerStyle">
            <img :src="post.thumbnail" :alt="post.title" class="post-image" />
            <div class="date-badge" :style="dateBadgeStyle">{{ formatDate(post.createAt) }}</div>
          </div>
          <div class="post-content" :style="postContentStyle">
            <div class="post-meta" :style="postMetaStyle">
              <span class="post-category">{{ post.categoryName }}</span>
              <span class="post-views">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" :stroke="config.colors.textLight" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" :stroke="config.colors.textLight" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ post.viewCount }}
              </span>
            </div>
            <h3 class="post-title" :style="postTitleStyle">{{ post.title }}</h3>
            <p class="post-excerpt" :style="postExcerptStyle">{{ post.summary }}</p>
            <button
                class="read-more-btn"
                :class="{ 'hovered': hoverIndex === index }"
                :style="readMoreBtnStyle"
                @click.prevent="$router.push('/tin-tuc/' + post.slug)"
            >
              {{ config.buttonText }}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.3335 8H12.6668" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 3.33331L12.6667 7.99998L8 12.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Progress indicator with navigation buttons -->
    <div class="progress-container" :style="progressContainerStyle">
      <button class="carousel-btn prev" @click="scrollCarousel(-1)" :style="carouselBtnStyle">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" :stroke="config.colors.primary" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="progress-bar" :style="progressBarStyle">
        <div
            class="progress-fill"
            :style="progressFillStyle"
        ></div>
      </div>

      <button class="carousel-btn next" @click="scrollCarousel(1)" :style="carouselBtnStyle">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" :stroke="config.colors.primary" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {baseImgaeUrl} from "../../../../assets/js/global.js";
import api from "../../../../api/api.js";

const router = useRouter()

// CONFIG OBJECT - Có thể quản lý qua CMS
let config = {
  // Text content
  sectionTitle: "CÁC BÀI VIẾT LIÊN QUAN",
  buttonText: "Xem chi tiết",

  // Colors
  colors: {
    primary: "#031358",
    secondary: "#0030FF",
    textDark: "#031358",
    textLight: "#555",
    background: "#ffffff",
    progressBg: "#e0e0e0",
    buttonHover: "#0030FF"
  },

  // Typography
  typography: {
    fontFamily: "'Ubuntu', sans-serif",
    sectionTitleSize: "40px",
    postTitleSize: "20px",
    excerptSize: "17px",
    dateSize: "14px",
    buttonSize: "16px",
    metaSize: "12px"
  },

  // Spacing
  spacing: {
    sectionPadding: "60px 20px",
    cardPadding: "20px",
    cardGap: "20px",
    cardBorderRadius: "12px",
    buttonBorderRadius: "6px"
  },

  // Sizes
  sizes: {
    cardWidth: "400px",
    cardWidthMobile: "280px",
    cardWidthSmallMobile: "260px",
    imageHeight: "200px",
    progressBarHeight: "6px",
    buttonWidth: "36px",
    buttonWidthMobile: "32px",
    buttonWidthSmallMobile: "28px"
  },

  // Shadows
  shadows: {
    cardShadow: "0 4px 12px rgba(3, 19, 88, 0.1)",
    cardHoverShadow: "0 12px 24px rgba(3, 19, 88, 0.15)"
  },

  // Posts data - Để trống vì sẽ lấy từ API
  posts: []
}

const props = defineProps({
  sectionData: Object
})

if(props.sectionData) {
  config = props.sectionData.config;
  console.log("Đã nhận props từ cha", config);
}

// State
const carousel = ref(null)
const hoverIndex = ref(-1)
const scrollProgress = ref(0)
const currentSlide = ref(1)
const totalSlides = ref(0)
const posts = ref([])

// Computed styles - GIỮ NGUYÊN
const postCardStyle = computed(() => ({
  width: config.sizes.cardWidth,
  borderRadius: config.spacing.cardBorderRadius,
  boxShadow: config.shadows.cardShadow
}))

const imageContainerStyle = computed(() => ({
  height: config.sizes.imageHeight
}))

const dateBadgeStyle = computed(() => ({
  color: config.colors.primary,
  fontSize: config.typography.dateSize
}))

const postContentStyle = computed(() => ({
  padding: config.spacing.cardPadding
}))

const postMetaStyle = computed(() => ({
  fontSize: config.typography.metaSize,
  color: config.colors.textLight
}))

const postTitleStyle = computed(() => ({
  color: config.colors.textDark,
  fontSize: config.typography.postTitleSize
}))

const postExcerptStyle = computed(() => ({
  color: config.colors.textLight,
  fontSize: config.typography.excerptSize
}))

const readMoreBtnStyle = computed(() => ({
  backgroundColor: config.colors.primary,
  borderRadius: config.spacing.buttonBorderRadius,
  fontSize: config.typography.buttonSize
}))

const progressContainerStyle = computed(() => ({
  maxWidth: '400px'
}))

const progressBarStyle = computed(() => ({
  height: config.sizes.progressBarHeight,
  backgroundColor: config.colors.progressBg
}))

const progressFillStyle = computed(() => ({
  background: `linear-gradient(90deg, ${config.colors.primary}, ${config.colors.secondary})`,
  width: `${scrollProgress.value}%`
}))

const carouselBtnStyle = computed(() => ({
  width: config.sizes.buttonWidth,
  height: config.sizes.buttonWidth,
  border: `2px solid ${config.colors.primary}`
}))

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Update progress and current slide
const updateProgress = () => {
  if (!carousel.value) return

  const scrollLeft = carousel.value.scrollLeft
  const scrollWidth = carousel.value.scrollWidth - carousel.value.clientWidth

  if (scrollWidth > 0) {
    scrollProgress.value = (scrollLeft / scrollWidth) * 100
  } else {
    scrollProgress.value = 0
  }

  // Calculate current slide based on scroll position
  const cardWidth = 320 // Width of each card including gap
  const slidePosition = Math.round(scrollLeft / cardWidth) + 1
  currentSlide.value = Math.min(slidePosition, posts.value.length)
}

// Carousel navigation
const scrollCarousel = (direction) => {
  if (carousel.value) {
    const cardWidth = 320 // Width of each card including margin
    const scrollAmount = cardWidth * direction
    carousel.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })

    // Update progress after scroll animation
    setTimeout(updateProgress, 300)
  }
}

// Fetch posts from API
const fetchPosts = async () => {
  try {
    const response = await api.get("/thg/public/news/getNewsByCategorySlug/tuyen-dung")
    posts.value = response.data
    totalSlides.value = posts.value.length
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu bài viết:", error)
    posts.value = []
  }
}

// Initialize
onMounted(() => {
  fetchPosts()

  if (carousel.value) {
    carousel.value.addEventListener('scroll', updateProgress)
    updateProgress() // Initial progress calculation
  }
})

onUnmounted(() => {
  if (carousel.value) {
    carousel.value.removeEventListener('scroll', updateProgress)
  }
})
</script>

<style scoped>

.related-posts {
  padding: v-bind('config.spacing.sectionPadding');
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: v-bind('config.typography.sectionTitleSize');
  color: v-bind('config.colors.primary');
  margin-bottom: 40px;
  text-align: center;
  font-weight: 700;
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: v-bind('config.spacing.cardGap');
  padding: 10px 0;
  scrollbar-width: none; /* Firefox */
  width: 100%;
}

.carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

/* FIX: Đảm bảo post-card có width cố định */
.post-card {
  display: block;
  width: v-bind('config.sizes.cardWidth');
  flex: 0 0 auto; /* Quan trọng: không cho phép co giãn */
  background: v-bind('config.colors.background');
  border-radius: v-bind('config.spacing.cardBorderRadius');
  overflow: hidden;
  box-shadow: v-bind('config.shadows.cardShadow');
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
}

.post-card:hover {
  transform: translateY(-8px);
  box-shadow: v-bind('config.shadows.cardHoverShadow');
}

.image-container {
  position: relative;
  height: v-bind('config.sizes.imageHeight');
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.post-card:hover .post-image {
  transform: scale(1.05);
}

.date-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: v-bind('config.typography.dateSize');
  color: v-bind('config.colors.primary');
  font-weight: 500;
}

.post-content {
  padding: v-bind('config.spacing.cardPadding');
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: v-bind('config.typography.metaSize');
  color: v-bind('config.colors.textLight');
}

.post-category {
  background: rgba(3, 19, 88, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.post-views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-title {
  font-size: v-bind('config.typography.postTitleSize');
  color: v-bind('config.colors.textDark');
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 1.3;
}

.post-excerpt {
  font-size: v-bind('config.typography.excerptSize');
  color: v-bind('config.colors.textLight');
  margin-bottom: 20px;
  line-height: 1.5;
}

.read-more-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: v-bind('config.colors.primary');
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: v-bind('config.spacing.buttonBorderRadius');
  font-size: v-bind('config.typography.buttonSize');
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.read-more-btn.hovered {
  background: v-bind('config.colors.buttonHover');
  transform: translateX(5px);
}

/* Progress indicator with navigation buttons */
.progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  max-width: v-bind('progressContainerStyle.maxWidth');
  margin-left: auto;
  margin-right: auto;
}

.progress-bar {
  flex: 1;
  height: v-bind('config.sizes.progressBarHeight');
  background: v-bind('config.colors.progressBg');
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, v-bind('config.colors.primary'), v-bind('config.colors.secondary'));
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 2px;
  background: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

/* Updated carousel buttons - smaller and positioned around progress bar */
.carousel-btn {
  background: white;
  border: v-bind('carouselBtnStyle.border');
  border-radius: 50%;
  width: v-bind('config.sizes.buttonWidth');
  height: v-bind('config.sizes.buttonWidth');
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.carousel-btn:hover {
  background: v-bind('config.colors.primary');
}

.carousel-btn:hover svg path {
  stroke: white;
}

/* Responsive design */
@media (max-width: 768px) {
  .section-title {
    font-size: 32px;
  }

  .post-card {
    width: v-bind('config.sizes.cardWidthMobile');
  }

  .progress-container {
    gap: 12px;
    max-width: 300px;
  }

  .carousel-btn {
    width: v-bind('config.sizes.buttonWidthMobile');
    height: v-bind('config.sizes.buttonWidthMobile');
  }

  .carousel-btn svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 28px;
  }

  .post-card {
    width: v-bind('config.sizes.cardWidthSmallMobile');
  }

  .post-title {
    font-size: 18px;
  }

  .post-excerpt {
    font-size: 16px;
  }

  .post-meta {
    font-size: 11px;
  }

  .progress-container {
    gap: 10px;
    max-width: 250px;
  }

  .progress-bar {
    height: 4px;
  }

  .carousel-btn {
    width: v-bind('config.sizes.buttonWidthSmallMobile');
    height: v-bind('config.sizes.buttonWidthSmallMobile');
  }

  .carousel-btn svg {
    width: 12px;
    height: 12px;
  }
}
</style>