<template>
  <div class="news-section" :style="sectionStyle">
    <h2 class="section-title" :style="titleStyle">{{ sectionTitle }}</h2>
    <div class="divider" :style="dividerStyle"></div>

    <div class="carousel-wrapper" :style="carouselWrapperStyle">
      <div class="carousel" ref="carouselRef" @scroll="updateProgress" :style="carouselStyle">
        <div
            v-for="(news, index) in displayNews"
            :key="news.id || index"
            class="news-item"
            :style="newsItemStyle"
            @click="goToNews(news)"
        >
          <div class="image-wrapper" :style="imageWrapperStyle">
            <img
                :src="news.thumbnail || defaultImage"
                :alt="news.title"
                class="news-image"
                :style="newsImageStyle"
                @error="handleImageError"
            />
            <span class="date-label" :style="dateLabelStyle">
              {{ formatDate(news.createAt) }}
            </span>
            <div v-if="news.isFeatured" class="featured-badge" :style="featuredBadgeStyle">
              <i class="fa-solid fa-star"></i> Nổi bật
            </div>
          </div>

          <div class="news-content" :style="newsContentStyle">
            <div class="content-wrapper">
              <h3 class="news-title" :style="newsTitleStyle">{{ news.title }}</h3>
              <p class="news-summary" :style="newsSummaryStyle">{{ news.summary }}</p>
            </div>

            <div class="bottom-section">
              <div class="news-meta" :style="newsMetaStyle">
                <span class="category" :style="categoryStyle">
                  {{ news.categoryName || 'Chưa phân loại' }}
                </span>
                <div class="meta-stats" :style="metaStatsStyle">
                  <span class="view-count" :style="viewCountStyle">
                    <i class="fa-regular fa-eye"></i> {{ news.viewCount || 0 }}
                  </span>
                </div>
              </div>

              <div class="news-footer" :style="newsFooterStyle">
                <span class="author" :style="authorStyle">
                  <i class="fa fa-user"/> {{ news.employeeName || 'Ẩn danh' }}
                </span>
              </div>
            </div>
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

const emit = defineEmits(['goToNews'])

const goToNews = (news) => {
  const newsDTO = {
    id: news.id,
    slug: news.slug,
    title: news.title,
    thumbnail: news.thumbnail,
    viewAt: new Date().toISOString()
  }

  emit('goToNews', newsDTO)
}

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
    newsItemBg: 'rgba(255, 255, 255, 0.95)',
    featuredBadgeBg: '#ff4757',
    statusDraft: '#ffa502',
    statusPublished: '#2ed573',
    statusArchived: '#57606f'
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
    dateLabelWeight: '500',
    summarySize: '14px',
    summaryWeight: '400',
    metaSize: '12px',
    metaWeight: '400'
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
    progressBarMarginTop: '20px',
    summaryMarginTop: '8px',
    metaMarginTop: '10px',
    footerMarginTop: '12px'
  },

  // Sizes
  sizes: {
    newsItemWidth: '500px',
    newsItemHeight: '650px',
    newsItemHeightTablet: '580px',
    newsItemHeightMobile: '520px',
    newsImageHeight: '300px',
    controlBtnSize: '50px',
    progressBarHeight: '4px',
    featuredBadgeHeight: '24px'
  },

  // Border Radius
  borderRadius: {
    newsItem: '12px',
    imageWrapper: '10px',
    dateLabel: '6px',
    category: '20px',
    controlBtn: '50%',
    progressBar: '10px',
    featuredBadge: '4px'
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
  sectionData: Object,
  latestNews: {
    type: Array,
    default: () => []
  }
})

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã nhận props", config)
}

const sectionTitle = ref(config.sectionTitle);
const defaultImage = '/imgs/dangtinbds.png';

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
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: config.sizes.newsItemHeight
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

const featuredBadgeStyle = computed(() => ({
  position: 'absolute',
  top: '10px',
  left: '10px',
  background: config.colors.featuredBadgeBg,
  color: config.colors.white,
  padding: '2px 8px',
  borderRadius: config.borderRadius.featuredBadge,
  fontSize: '11px',
  fontWeight: 'bold',
  zIndex: 2
}))

const newsContentStyle = computed(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  flexGrow: '1',
  marginTop: config.spacing.infoMarginTop,
  textAlign: 'left',
  padding: '0 5px'
}))

const newsTitleStyle = computed(() => ({
  color: config.colors.primary,
  fontSize: config.typography.newsTitleSize,
  fontWeight: config.typography.newsTitleWeight,
  lineHeight: '1.3',
  marginBottom: '10px',
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
}))

const newsSummaryStyle = computed(() => ({
  color: '#555',
  fontSize: config.typography.summarySize,
  fontWeight: config.typography.summaryWeight,
  lineHeight: '1.5',
  marginTop: config.spacing.summaryMarginTop,
  display: '-webkit-box',
  WebkitLineClamp: '3',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
}))

const newsMetaStyle = computed(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: '10px'
}))

const categoryStyle = computed(() => ({
  display: 'inline-block',
  fontSize: config.typography.categorySize,
  color: config.colors.primary,
  fontWeight: config.typography.categoryWeight,
  padding: config.spacing.categoryPadding,
  background: config.colors.categoryBg,
  borderRadius: config.borderRadius.category
}))

const metaStatsStyle = computed(() => ({
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
}))

const viewCountStyle = computed(() => ({
  fontSize: config.typography.metaSize,
  color: '#666'
}))

const newsFooterStyle = computed(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: '8px',
  paddingTop: '8px',
  borderTop: '1px solid #eee',
  width: '100%'
}))

const authorStyle = computed(() => ({
  fontSize: config.typography.metaSize,
  color: '#666',
  fontStyle: 'italic'
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

// Computed property for news data
const displayNews = computed(() => {
  if (!props.latestNews || props.latestNews.length === 0) {
    return newsArticles.value; // Fallback to static data if no props
  }

  return props.latestNews
      .filter(news => news.status === 'PUBLISHED' || news.status === 'published')
      .sort((a, b) => {
        // Sort by featured first, then by priority, then by date
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        if (a.priority !== b.priority) return (b.priority || 0) - (a.priority || 0);
        return new Date(b.createAt) - new Date(a.createAt);
      });
})

// Helper methods
const formatDate = (dateString) => {
  if (!dateString) return 'Không có ngày';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
}

const getStatusText = (status) => {
  const statusMap = {
    'DRAFT': 'Nháp',
    'PUBLISHED': 'Đã xuất bản',
    'ARCHIVED': 'Lưu trữ',
    'published': 'Đã xuất bản',
    'draft': 'Nháp',
    'archived': 'Lưu trữ'
  };
  return statusMap[status] || status || 'Unknown';
}

const getStatusColor = (status) => {
  const statusColorMap = {
    'DRAFT': config.colors.statusDraft,
    'PUBLISHED': config.colors.statusPublished,
    'ARCHIVED': config.colors.statusArchived,
    'published': config.colors.statusPublished,
    'draft': config.colors.statusDraft,
    'archived': config.colors.statusArchived
  };
  return statusColorMap[status] || config.colors.statusDraft;
}

const handleImageError = (event) => {
  event.target.src = defaultImage;
}



// Original static data (fallback)
const newsArticles = ref([
  {
    title: "Bất động sản Thiên Hà Group vinh dự đón nhận giải thưởng top 10 thương hiệu xuất sắc châu á 2024",
    categoryName: "Tin tức | Hoạt động",
    date: "12/11/2024",
    thumbnail: "/imgs/hd6.jpg",
    summary: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.",
    viewCount: 1234,
    employeeName: "Nguyễn Văn A",
    createAt: "2024-12-11",
    isFeatured: true
  },
  {
    title: "Dự án mới tại Quận 7 chính thức ra mắt thị trường",
    categoryName: "Dự án",
    date: "10/11/2024",
    thumbnail: "/imgs/hd5.jpg",
    summary: "Dự án cao cấp tại Quận 7 với nhiều tiện ích hiện đại",
    viewCount: 856,
    employeeName: "Trần Thị B",
    createAt: "2024-11-10",
    isFeatured: false
  },
  {
    title: "Thị trường bất động sản 2025: Xu hướng và dự báo",
    categoryName: "Phân tích",
    date: "05/11/2024",
    thumbnail: "/imgs/hd4.jpg",
    summary: "Phân tích chi tiết về xu hướng thị trường bất động sản trong năm 2025 từ các chuyên gia hàng đầu",
    viewCount: 2456,
    employeeName: "Lê Văn C",
    createAt: "2024-11-05",
    isFeatured: true
  },
  // ... có thể thêm nhiều item khác
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

/* CSS bổ sung cho layout mới */
.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
}

.bottom-section {
  margin-top: auto;
  width: 100%;
}

.news-meta {
  align-items: center;
  min-height: 32px;
}

.news-footer {
  justify-content: flex-end !important;
  min-height: 28px;
}

.news-summary {
  min-height: 60px;
  margin-bottom: 10px;
}

.featured-badge {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-stats {
  font-size: v-bind('config.typography.metaSize');
}

.status {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
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
    height: v-bind('config.sizes.newsItemHeightTablet');
  }

  .news-title {
    font-size: v-bind('config.responsive.tablet.newsTitleSize');
  }

  .control-btn {
    width: v-bind('config.responsive.tablet.controlBtnSize');
    height: v-bind('config.responsive.tablet.controlBtnSize');
  }

  /* Responsive adjustments for additional elements */
  .news-summary {
    font-size: 13px;
    min-height: 52px;
    -webkit-line-clamp: 2;
  }

  .news-meta {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .news-footer {
    justify-content: flex-end !important;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: v-bind('config.responsive.mobile.sectionTitleSize');
  }

  .news-item {
    min-width: v-bind('config.responsive.mobile.newsItemMinWidth');
    height: v-bind('config.sizes.newsItemHeightMobile');
  }

  .news-image {
    height: v-bind('config.responsive.mobile.newsImageHeight');
  }

  /* Mobile adjustments */
  .news-title {
    -webkit-line-clamp: 1;
    font-size: 16px;
    margin-bottom: 8px;
  }

  .news-summary {
    -webkit-line-clamp: 2;
    min-height: 40px;
    font-size: 12px;
  }

  .news-footer {
    justify-content: flex-end !important;
  }

  .category {
    font-size: 12px;
    padding: 3px 8px;
  }

  .view-count {
    font-size: 11px;
  }

  .author {
    font-size: 11px;
  }
}

/* Keep existing styles for browser compatibility */
.carousel::-webkit-scrollbar {
  display: none;
}
</style>