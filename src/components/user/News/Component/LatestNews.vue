<template>
  <div class="news-section" :style="sectionStyle">
    <h2 class="section-title" :style="titleStyle">{{ sectionTitle }}</h2>
    <div class="divider" :style="dividerStyle"></div>

    <div class="carousel-wrapper" :style="carouselWrapperStyle">
      <div class="carousel" ref="carouselRef" @scroll="updateProgress" :style="carouselStyle">
        <div v-for="(item, index) in newsArticles" :key="index" class="news-item" :style="newsItemStyle">
          <div class="image-wrapper" :style="imageWrapperStyle">
            <img :src="item.image" :alt="item.title" class="news-image" :style="newsImageStyle" />
            <span class="date-label" :style="dateLabelStyle">{{ item.date }}</span>
          </div>

          <div class="info" :style="infoStyle">
            <h3 class="news-title" :style="newsTitleStyle">{{ item.title }}</h3>
            <span class="category" :style="categoryStyle">{{ item.category }}</span>
          </div>
        </div>
      </div>

      <div class="carousel-controls" :style="carouselControlsStyle">
        <button class="control-btn prev" @click="scrollCarousel(-1)" aria-label="Previous" :style="controlBtnStyle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="control-btn next" @click="scrollCarousel(1)" aria-label="Next" :style="controlBtnStyle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="progress-bar" :style="progressBarStyle">
        <div class="progress" :style="progressStyle"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Config object - có thể quản lý qua CMS
let config = {
  sectionTitle: "TIN TỨC MỚI NHẤT",
  // Colors
  colors: {
    primary: '#031358',
    secondary: '#0629BE',
    tertiary: '#0628B9',
    white: '#ffffff',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
    categoryBg: 'rgba(3, 19, 88, 0.1)',
    progressBarBg: 'rgba(255, 255, 255, 0.3)',
    controlBtnBg: 'rgba(255, 255, 255, 0.9)',
    newsItemBg: 'rgba(255, 255, 255, 0.95)'
  },

  // Typography
  typography: {
    sectionTitleSize: '40px',
    sectionTitleWeight: '700',
    newsTitleSize: '20px',
    newsTitleWeight: '600',
    categorySize: '14px',
    categoryWeight: '500',
    dateLabelSize: '12px',
    dateLabelWeight: '500'
  },

  // Spacing
  spacing: {
    sectionPadding: '60px 20px',
    dividerWidth: '50%',
    dividerMargin: '0 auto 40px auto',
    carouselGap: '30px',
    carouselPadding: '10px 20px',
    newsItemPadding: '10px',
    infoMarginTop: '12px',
    categoryPadding: '4px 10px',
    controlsGap: '20px',
    controlsMarginTop: '20px',
    progressBarMarginTop: '20px'
  },

  // Sizes
  sizes: {
    newsItemWidth: '500px',
    newsImageHeight: '300px',
    controlBtnSize: '50px',
    progressBarHeight: '4px'
  },

  // Border Radius
  borderRadius: {
    newsItem: '12px',
    imageWrapper: '10px',
    dateLabel: '6px',
    category: '20px',
    controlBtn: '50%',
    progressBar: '10px'
  },

  // Shadows
  shadows: {
    sectionTitle: '0 2px 4px rgba(0, 0, 0, 0.2)',
    newsItem: '0 4px 12px rgba(0, 0, 0, 0.1)',
    newsItemHover: '0 8px 20px rgba(0, 0, 0, 0.15)',
    controlBtn: '0 2px 8px rgba(0, 0, 0, 0.15)',
    controlBtnHover: '0 4px 12px rgba(0, 0, 0, 0.2)',
    progress: '0 0 8px rgba(255, 255, 255, 0.5)'
  },

  // Transitions
  transitions: {
    default: 'all 0.3s ease',
    image: '0.35s ease',
    progress: 'width 0.2s ease',
    hoverTransform: 'translateY(-5px)',
    imageHoverTransform: 'scale(1.05)',
    controlBtnHoverTransform: 'scale(1.05)',
    controlBtnActiveTransform: 'scale(0.95)'
  },

  // Gradients
  gradients: {
    sectionBackground: 'linear-gradient(135deg, #0629BE 7%, #031358 22%, #0629BE 56%, #031358 81%, #0628B9 100%)',
    imageHoverGlow: '0 0 20px rgba(255, 255, 255, 0.4)'
  },

  // Opacity
  opacity: {
    divider: '0.7',
    backdropFilter: 'blur(4px)'
  },

  // Responsive
  responsive: {
    tabletBreakpoint: '768px',
    mobileBreakpoint: '480px',
    tablet: {
      sectionPadding: '40px 15px',
      sectionTitleSize: '32px',
      dividerWidth: '70%',
      carouselGap: '20px',
      carouselPadding: '10px',
      newsItemMinWidth: '280px',
      newsTitleSize: '18px',
      controlBtnSize: '44px'
    },
    mobile: {
      sectionTitleSize: '28px',
      newsItemMinWidth: '260px',
      newsImageHeight: '180px'
    }
  }
}

const props = defineProps({
  sectionData: Object
})

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã nhận props", config)
}

const sectionTitle = ref(config.sectionTitle);
// Computed properties for styles
const sectionStyle = computed(() => ({
  fontFamily: "'Ubuntu', sans-serif",
  padding: config.spacing.sectionPadding,
  background: config.gradients.sectionBackground,
  textAlign: 'center',
  color: config.colors.white,
  position: 'relative'
}))

const titleStyle = computed(() => ({
  fontSize: config.typography.sectionTitleSize,
  fontWeight: config.typography.sectionTitleWeight,
  marginBottom: '10px',
  textShadow: config.shadows.sectionTitle
}))

const dividerStyle = computed(() => ({
  width: config.spacing.dividerWidth,
  height: '1px',
  background: config.colors.white,
  margin: config.spacing.dividerMargin,
  opacity: config.opacity.divider,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
}))

const carouselWrapperStyle = computed(() => ({
  width: '100%',
  maxWidth: '1360px',
  margin: '0 auto',
  position: 'relative'
}))

const carouselStyle = computed(() => ({
  display: 'flex',
  gap: config.spacing.carouselGap,
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  padding: config.spacing.carouselPadding,
  scrollbarWidth: 'none',
  msOverflowStyle: 'none'
}))

const newsItemStyle = computed(() => ({
  width: config.sizes.newsItemWidth,
  background: config.colors.newsItemBg,
  borderRadius: config.borderRadius.newsItem,
  padding: config.spacing.newsItemPadding,
  transition: config.transitions.default,
  boxShadow: config.shadows.newsItem,
  cursor: 'pointer',
  flexShrink: '0',
  position: 'relative'
}))

const imageWrapperStyle = computed(() => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: config.borderRadius.imageWrapper
}))

const newsImageStyle = computed(() => ({
  width: '100%',
  height: config.sizes.newsImageHeight,
  objectFit: 'cover',
  transition: config.transitions.image,
  display: 'block'
}))

const dateLabelStyle = computed(() => ({
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  background: config.colors.overlay,
  padding: '6px 10px',
  borderRadius: config.borderRadius.dateLabel,
  color: config.colors.white,
  fontSize: config.typography.dateLabelSize,
  fontWeight: config.typography.dateLabelWeight,
  backdropFilter: `blur(${config.opacity.backdropFilter})`
}))

const infoStyle = computed(() => ({
  marginTop: config.spacing.infoMarginTop,
  textAlign: 'left',
  padding: '0 5px'
}))

const newsTitleStyle = computed(() => ({
  color: config.colors.primary,
  fontSize: config.typography.newsTitleSize,
  fontWeight: config.typography.newsTitleWeight,
  lineHeight: '1.3',
  marginBottom: '20px',
  display: '-webkit-box',
  WebkitLineClamp: '3',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
}))

const categoryStyle = computed(() => ({
  display: 'inline-block',
  marginTop: '6px',
  fontSize: config.typography.categorySize,
  color: config.colors.primary,
  fontWeight: config.typography.categoryWeight,
  padding: config.spacing.categoryPadding,
  background: config.colors.categoryBg,
  borderRadius: config.borderRadius.category,
  position: 'absolute',
  bottom: '5px',
  right: '5px'
}))

const carouselControlsStyle = computed(() => ({
  display: 'flex',
  justifyContent: 'center',
  gap: config.spacing.controlsGap,
  marginTop: config.spacing.controlsMarginTop
}))

const controlBtnStyle = computed(() => ({
  background: config.colors.controlBtnBg,
  border: 'none',
  borderRadius: config.borderRadius.controlBtn,
  width: config.sizes.controlBtnSize,
  height: config.sizes.controlBtnSize,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: config.transitions.default,
  color: config.colors.primary,
  boxShadow: config.shadows.controlBtn
}))

const progressBarStyle = computed(() => ({
  width: '100%',
  height: config.sizes.progressBarHeight,
  background: config.colors.progressBarBg,
  marginTop: config.spacing.progressBarMarginTop,
  borderRadius: config.borderRadius.progressBar,
  overflow: 'hidden'
}))

const progressStyle = computed(() => ({
  height: '100%',
  background: config.colors.white,
  borderRadius: config.borderRadius.progressBar,
  transition: config.transitions.progress,
  boxShadow: config.shadows.progress,
  width: `${progress.value}%`
}))

// Original data and logic (unchanged)
const newsArticles = ref([
  {
    title: "Bất động sản Thiên Hà Group vinh dự đón nhận giải thưởng top 10 thương hiệu xuất sắc châu á 2024",
    category: "Tin tức | Hoạt động",
    date: "12/11/2024",
    image: "/imgs/hd6.jpg"
  },
  {
    title: "Thị trường bất động sản phục hồi mạnh mẽ cuối năm 2025",
    category: "Giải pháp Bất động sản",
    date: "12/10/2024",
    image: "/imgs/dangtinbds.png"
  },
  {
    title: "Dòng tiền đầu tư quay lại bất động sản: Cơ hội vàng cho DN Việt",
    category: "Đăng tin Bất động sản",
    date: "12/10/2024",
    image: "/imgs/dangtinbds.png"
  },
  {
    title: "Người trẻ chuộng mua nhà sẵn nội thất thay vì tự xây",
    category: "Định giá Bất động sản",
    date: "12/10/2024",
    image: "/imgs/dangtinbds.png"
  },
  {
    title: "Bất động sản xanh – Xu hướng mới dẫn đầu cuối năm 2025",
    category: "Bất động sản",
    date: "12/10/2024",
    image: "/imgs/dangtinbds.png"
  },
  {
    title: "Các yếu tố ảnh hưởng đến giá bất động sản năm 2025",
    category: "Phân tích thị trường",
    date: "12/09/2024",
    image: "/imgs/dangtinbds.png"
  },
  {
    title: "Bất động sản Thiên Hà Group vinh dự đón nhận giải thưởng top 10 thương hiệu xuất sắc châu á 2024",
    category: "Tin tức | Hoạt động",
    date: "12/11/2024",
    image: "/imgs/hd6.jpg"
  },
  {
    title: "Thị trường bất động sản phục hồi mạnh mẽ cuối năm 2025",
    category: "Giải pháp Bất động sản",
    date: "12/10/2024",
    image: "/imgs/dangtinbds.png"
  },
  {
    title: "Dòng tiền đầu tư quay lại bất động sản: Cơ hội vàng cho DN Việt",
    category: "Đăng tin Bất động sản",
    date: "12/10/2024",
    image: "/imgs/dangtinbds.png"
  },
  {
    title: "Người trẻ chuộng mua nhà sẵn nội thất thay vì tự xây",
    category: "Định giá Bất động sản",
    date: "12/10/2024",
    image: "/imgs/dangtinbds.png"
  },
  {
    title: "Bất động sản xanh – Xu hướng mới dẫn đầu cuối năm 2025",
    category: "Bất động sản",
    date: "12/10/2024",
    image: "/imgs/dangtinbds.png"
  },
  {
    title: "Các yếu tố ảnh hưởng đến giá bất động sản năm 2025",
    category: "Phân tích thị trường",
    date: "12/09/2024",
    image: "/imgs/dangtinbds.png"
  }
])


const progress = ref(0)
const carouselRef = ref(null)
let autoScrollInterval = null

const updateProgress = () => {
  const el = carouselRef.value
  if (!el) return
  const maxScroll = el.scrollWidth - el.clientWidth
  progress.value = maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0
}

const scrollCarousel = (direction) => {
  const el = carouselRef.value
  if (!el) return

  const scrollAmount = el.clientWidth * 0.8
  el.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  })
}

const startAutoScroll = () => {
  autoScrollInterval = setInterval(() => {
    const el = carouselRef.value
    if (!el) return

    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
      el.scrollTo({
        left: 0,
        behavior: 'smooth'
      })
    } else {
      scrollCarousel(1)
    }
  }, 5000)
}

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
}

onMounted(() => {
  startAutoScroll()

  const el = carouselRef.value
  if (el) {
    el.addEventListener('mouseenter', stopAutoScroll)
    el.addEventListener('mouseleave', startAutoScroll)
  }
})

onUnmounted(() => {
  stopAutoScroll()
})
</script>

<style scoped>
.news-section {
  font-family: v-bind('config.fontFamily || "Ubuntu, sans-serif"');
}

.news-item:hover {
  transform: v-bind('config.transitions.hoverTransform');
  box-shadow: v-bind('config.shadows.newsItemHover');
}

.news-item:hover .news-image {
  transform: v-bind('config.transitions.imageHoverTransform');
  box-shadow: v-bind('config.gradients.imageHoverGlow');
}

.control-btn:hover {
  background: v-bind('config.colors.white');
  transform: v-bind('config.transitions.controlBtnHoverTransform');
  box-shadow: v-bind('config.shadows.controlBtnHover');
}

.control-btn:active {
  transform: v-bind('config.transitions.controlBtnActiveTransform');
}

/* Responsive design */
@media (max-width: 768px) {
  .news-section {
    padding: v-bind('config.responsive.tablet.sectionPadding');
  }

  .section-title {
    font-size: v-bind('config.responsive.tablet.sectionTitleSize');
  }

  .divider {
    width: v-bind('config.responsive.tablet.dividerWidth');
  }

  .carousel {
    gap: v-bind('config.responsive.tablet.carouselGap');
    padding: v-bind('config.responsive.tablet.carouselPadding');
  }

  .news-item {
    min-width: v-bind('config.responsive.tablet.newsItemMinWidth');
  }

  .news-title {
    font-size: v-bind('config.responsive.tablet.newsTitleSize');
  }

  .control-btn {
    width: v-bind('config.responsive.tablet.controlBtnSize');
    height: v-bind('config.responsive.tablet.controlBtnSize');
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: v-bind('config.responsive.mobile.sectionTitleSize');
  }

  .news-item {
    min-width: v-bind('config.responsive.mobile.newsItemMinWidth');
  }

  .news-image {
    height: v-bind('config.responsive.mobile.newsImageHeight');
  }
}

/* Keep existing styles for browser compatibility */
.carousel::-webkit-scrollbar {
  display: none;
}
</style>