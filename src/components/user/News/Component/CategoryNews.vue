<template>
  <div class="news-container">
    <div class="news-layout">
      <!-- Cột trái (66.67%) -->
      <div class="left-column">
        <!-- Thanh danh mục -->
        <div class="categories-container">
          <div class="categories-wrapper">
            <button
                class="nav-arrow nav-arrow-left"
                @click="scrollCategories(-1)"
                v-if="showArrows"
                :style="{
                borderColor: config.colors.primary,
                color: config.colors.primary
              }"
            >
              <svg data-v-b4c27b63="" width="24" height="24" viewBox="0 0 24 24" fill="none"><path data-v-b4c27b63="" d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>

            <nav class="categories-nav" ref="categoriesNav">
              <div
                  v-for="(category, index) in categoryList"
                  :key="category.id"
                  class="category-item"
                  :class="{ active: category.id === activeCategoryId }"
                  @click="selectCategory(category.id)"
                  :style="{
                    color: category.id === activeCategoryId ? config.colors.active : config.colors.primary
                  }"
              >
                {{ category.name }}
              </div>
            </nav>

            <button
                class="nav-arrow nav-arrow-right"
                @click="scrollCategories(1)"
                v-if="showArrows"
                :style="{
                borderColor: config.colors.primary,
                color: config.colors.primary
              }"
            >
              <svg data-v-b4c27b63="" width="24" height="24" viewBox="0 0 24 24" fill="none"><path data-v-b4c27b63="" d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>
          </div>
          <div class="nav-divider"></div>
        </div>

        <!-- Bộ lọc -->
        <div class="filter-container">
          <div class="filter-row">
            <select v-model="filter.sortBy" class="filter-select" @change="applyFilter">
              <option value="" disabled>Sắp xếp theo</option>
              <option value="VIEW_COUNT">Lượt xem</option>
              <option value="CREATED_AT">Ngày đăng</option>
              <option value="UPDATED_AT">Ngày cập nhật</option>
            </select>

            <select v-model="filter.sortDirection" class="filter-select" @change="applyFilter">
              <option value="DESC">Giảm dần</option>
              <option value="ASC">Tăng dần</option>
            </select>

            <button class="filter-btn" @click="applyFilter" :style="{ backgroundColor: config.colors.primary }">
              <i class="fa-solid fa-filter"></i> Lọc
            </button>
          </div>
        </div>

        <!-- Danh sách tin tức -->
        <div class="news-list">
          <div
              v-for="(news, index) in newsList"
              :key="news.id"
              class="news-item"
              @click="goToNews(news)"
          >
            <div class="news-image">
              <img :src="news.thumbnail || '/imgs/default-news.jpg'" :alt="news.title">
            </div>
            <div class="news-content">
              <div class="news-meta">
                <span class="news-category">{{ news.categoryName }}</span>
                <span class="news-dot">•</span>
                <span class="news-date">{{ formatDate(news.createAt || news.updateAt) }}</span>
                <span class="news-dot">•</span>
                <span class="news-views">{{ news.viewCount }} lượt xem</span>
              </div>
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-subtitle">{{ news.summary }}</p>
              <div class="news-footer">
                <span class="news-author">Tác giả: {{ news.employeeName }}</span>
              </div>
            </div>
            <div class="news-divider"></div>
          </div>

          <!-- Trạng thái loading -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Đang tải tin tức...</p>
          </div>

          <!-- Trạng thái không có dữ liệu -->
          <div v-if="!loading && newsList.length === 0" class="empty-state">
            <p>Không có tin tức nào được tìm thấy.</p>
          </div>
        </div>

        <!-- Phân trang -->
        <div class="pagination" v-if="totalPages > 1">
          <button
              class="page-btn"
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :style="{
              borderColor: config.colors.primary,
              color: config.colors.primary
            }"
          >
            <i class="fa-solid fa-arrow-left"></i>
          </button>

          <button
              v-for="page in visiblePages"
              :key="page"
              class="page-btn"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
              :style="{
              backgroundColor: page === currentPage ? config.colors.primary : 'white',
              borderColor: config.colors.primary,
              color: page === currentPage ? config.colors.white : config.colors.primary
            }"
          >
            {{ page }}
          </button>

          <button
              class="page-btn"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :style="{
              borderColor: config.colors.primary,
              color: config.colors.primary
            }"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Cột phải (33.33%) -->
      <div class="right-column">
        <!-- Thanh tìm kiếm -->
        <div class="search-container">
          <div
              class="search-box"
              :style="{ borderColor: config.colors.primary }"
          >
            <input
                type="text"
                v-model="searchKeyword"
                placeholder="Nhập từ khóa để tìm kiếm"
                class="search-input"
                @keyup.enter="performSearch"
            >
            <button
                class="search-btn"
                @click="performSearch"
                :style="{ backgroundColor: config.colors.primary }"
            >
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        <!-- Box "Đã xem gần đây / Kết quả tìm kiếm" -->
        <div
            class="recently-viewed"
            :style="{ boxShadow: config.shadows.default }"
        >
          <!-- Tab chuyển đổi - Chỉ hiển thị khi có cả 2 dữ liệu -->
          <div class="tab-container">
            <button
                class="tab-btn"
                :class="{ active: activeTab === 'recent' }"
                @click="activeTab = 'recent'"
                :style="{
                color: activeTab === 'recent' ? config.colors.active : config.colors.primary,
                borderBottomColor: activeTab === 'recent' ? config.colors.active : 'transparent'
              }"
            >
              Đã xem gần đây
            </button>
            <button
                class="tab-btn"
                :class="{ active: activeTab === 'search' }"
                @click="activeTab = 'search'"
                :style="{
                color: activeTab === 'search' ? config.colors.active : config.colors.primary,
                borderBottomColor: activeTab === 'search' ? config.colors.active : 'transparent'
              }"
            >
              Kết quả tìm kiếm
            </button>

          </div>

          <!-- Tiêu đề -->
          <h3 class="recently-viewed-title">
            {{ activeTab === 'search' ? 'Kết quả tìm kiếm' : 'Đã xem gần đây' }}
          </h3>

          <!-- Danh sách kết quả tìm kiếm -->
          <div class="recently-viewed-list" v-if="activeTab === 'search'">
            <div
                v-for="(news, index) in searchResults"
                :key="index"
                class="recently-viewed-item"
                @click="goToNews(news)"
            >
              <div class="recently-viewed-image">
                <img :src="news.thumbnail || '/imgs/default-news.jpg'" :alt="news.title">
              </div>
              <div class="recently-viewed-content">
                <h4 class="recently-viewed-title-item">{{ news.title }}</h4>
                <span class="recently-viewed-date">{{ formatDate(news.createAt) }}</span>
              </div>
            </div>

            <!-- Trạng thái không có kết quả tìm kiếm -->
            <div v-if="searchResults.length === 0 && searchPerformed" class="empty-search">
              <p>Không tìm thấy kết quả nào.</p>
            </div>

            <!-- Trạng thái chưa tìm kiếm -->
            <div v-if="searchResults.length === 0 && !searchPerformed" class="empty-search">
              <p>Nhập từ khóa để tìm kiếm tin tức.</p>
            </div>
          </div>

          <!-- Danh sách đã xem gần đây -->
          <div class="recently-viewed-list" v-if="activeTab === 'recent'">
            <div
                v-for="(news, index) in recentNewsList"
                :key="'recent-' + news.id"
                class="recently-viewed-item"
                @click="goToNews(news)"
            >
              <div class="recently-viewed-image">
                <img :src="news.thumbnail || '/imgs/default-news.jpg'" :alt="news.title">
              </div>
              <div class="recently-viewed-content">
                <h4 class="recently-viewed-title-item">{{ news.title }}</h4>
                <span class="recently-viewed-date">{{ formatTime(news.viewedAt) }}</span>
              </div>
            </div>

            <!-- Trạng thái không có tin đã xem -->
            <div v-if="recentNewsList.length === 0" class="empty-search">
              <p>Chưa có tin nào được xem gần đây.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from "../../../../api/api.js";

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

// CONFIG OBJECT
let config = {
  colors: {
    primary: '#031358',
    active: '#0030FF',
    white: '#FFFFFF',
    text: {
      primary: '#031358',
      secondary: '#6B7280',
      light: '#9CA3AF',
    },
    border: '#e0e0e0',
    background: {
      hover: '#f0f0f0',
      searchBtn: '#031358',
    }
  },
  typography: {
    fontFamily: "'Ubuntu', sans-serif",
    sizes: {
      category: '20px',
      title: '20px',
      subtitle: '15px',
      date: '14px',
      recentlyViewedTitle: '33px',
      recentlyViewedItemTitle: '18px'
    },
    weights: {
      bold: 700,
      medium: 500
    }
  },
  spacing: {
    container: '1400px',
    padding: '20px',
    gap: '30px',
    categoriesGap: '25px',
    itemGap: '15px'
  },
  borders: {
    radius: {
      small: '4px',
      medium: '8px',
      round: '50%'
    },
    width: {
      categoryActive: '3px',
      divider: '1px'
    }
  },
  shadows: {
    default: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    default: 'all 0.3s ease'
  },
  sizes: {
    arrow: '40px',
    newsImageHeight: '150px',
    recentlyViewedImage: {
      width: '80px',
      height: '60px'
    }
  },
  sections: {
    recentlyViewed: {
      title: 'Đã xem gần đây'
    }
  },
  responsive: {
    breakpoints: {
      desktop: '1024px',
      tablet: '768px',
      mobile: '480px',
      smallMobile: '640px'
    }
  }
}

const props = defineProps({
  sectionData: Object,
  news: Object,
  categories: Array,
  recentNews: Array // Nhận props recentNews
})

console.log("props.news", props.news)
console.log("props.categories", props.categories)
console.log("props.recentNews", props.recentNews)

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã nhận props", config)
}

// Refs
const categoriesNav = ref(null)
const loading = ref(false)
const searchPerformed = ref(false)

// Dữ liệu danh mục
const categoryList = ref(props.categories || [])


// Dữ liệu tin tức
const newsList = ref([])
const searchResults = ref([]) // Kết quả tìm kiếm
const recentNewsList = ref(props.recentNews || []) // Tin đã xem gần đây

// Tab control
const activeTab = ref('recent') // 'search' hoặc 'recent'

// Tính toán có nên hiển thị tab không
const showTabs = computed(() => {
  return searchPerformed.value && recentNewsList.value.length > 0
})

// Phân trang
const currentPage = ref(1)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)

// Bộ lọc
const filter = ref({
  keyword: '',
  categoryId: 0,
  sortBy: '',
  sortDirection: 'DESC'
})

// Tìm kiếm
const searchKeyword = ref('')

// Danh mục đang chọn
const activeCategoryId = ref(0)

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

// Format thời gian đã xem
const formatTime = (isoString) => {
  if (!isoString) return '';

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else {
    return `${diffDays} ngày trước`;
  }
}

// Hàm cuộn danh mục
const scrollCategories = (direction) => {
  if (!categoriesNav.value) return

  const scrollAmount = 200
  const newScrollLeft = categoriesNav.value.scrollLeft + (direction * scrollAmount)

  categoriesNav.value.scrollTo({
    left: newScrollLeft,
    behavior: 'smooth'
  })
}

const showArrows = ref(true)

// Kiểm tra xem có thể cuộn không
const checkScrollButtons = () => {
  if (!categoriesNav.value) return

  const el = categoriesNav.value
  showArrows.value = el.scrollWidth > el.clientWidth
}

// Chọn danh mục
const selectCategory = (categoryId) => {
  activeCategoryId.value = categoryId
  filter.value.categoryId = categoryId
  currentPage.value = 1
  fetchNews()
}

// Áp dụng bộ lọc
const applyFilter = () => {
  currentPage.value = 1
  fetchNews()
}

// Thực hiện tìm kiếm
const performSearch = async () => {
  searchPerformed.value = true
  loading.value = true
  activeTab.value = 'search' // Chuyển sang tab tìm kiếm

  try {
    const response = await api.post("/thg/public/news/filter", {
      keyword: searchKeyword.value,
      categoryId: null,
      status: null,
      featured: null,
      recentlyCreated: null,
      recentlyUpdated: null,
      sorts: filter.value.sortBy ? [{
        sortBy: filter.value.sortBy,
        sortDirection: filter.value.sortDirection
      }] : []
    }, {
      params: {
        page: 0,
        size: 5
      }
    })

    searchResults.value = response.data.content || []
  } catch (error) {
    console.error('Lỗi tìm kiếm:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// Lấy tin tức
const fetchNews = async () => {
  loading.value = true

  try {
    const sortArray = []

    if (filter.value.sortBy) {
      sortArray.push({
        sortBy: filter.value.sortBy,
        sortDirection: filter.value.sortDirection
      })
    }

    const response = await api.post("/thg/public/news/filter", {
      keyword: filter.value.keyword,
      categoryId: filter.value.categoryId === 0 ? null : filter.value.categoryId,
      status: null,
      featured: null,
      recentlyCreated: null,
      recentlyUpdated: null,
      sorts: sortArray
    }, {
      params: {
        page: currentPage.value - 1,
        size: pageSize.value
      }
    })

    const data = response.data
    newsList.value = data.content || []
    totalPages.value = data.page?.totalPages || 0
    totalElements.value = data.page?.totalElements || 0

  } catch (error) {
    console.error('Lỗi lấy tin tức:', error)
    newsList.value = []
  } finally {
    loading.value = false
  }
}

// Chuyển trang
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchNews()
}

// Tính toán các trang hiển thị
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Khởi tạo dữ liệu từ props
const initializeFromProps = () => {
  if (props.news?.content) {
    newsList.value = props.news.content
    totalPages.value = props.news.page?.totalPages || 0
    totalElements.value = props.news.page?.totalElements || 0
    currentPage.value = (props.news.page?.number || 0) + 1
    pageSize.value = props.news.page?.size || 10
  }

  if (props.categories) {
    categoryList.value = [...props.categories]
    if (categoryList.value.length > 0) {
      categoryList.value.unshift({
        id: 0,
        name: 'Tất cả',
        isActive: true
      })
    }
  }

  // Khởi tạo recentNews từ props
  if (props.recentNews) {
    recentNewsList.value = props.recentNews
  }
}

onMounted(() => {
  initializeFromProps()
  checkScrollButtons()
  window.addEventListener('resize', checkScrollButtons)

  // Tự động load tin tức nếu chưa có
  if (newsList.value.length === 0) {
    fetchNews()
  }
})

// Watch props changes
watch(() => props.news, initializeFromProps)
watch(() => props.categories, initializeFromProps)
watch(() => props.recentNews, (newVal) => {
  recentNewsList.value = newVal || []
})
</script>

<style scoped>
/* Các style hiện tại giữ nguyên... */

/* Tab Container */
.tab-container {
  display: flex;
  border-bottom: 1px solid v-bind('config.colors.border');
  margin-bottom: 20px;
  width: 100%;
}

.tab-btn {
  flex: 1;
  padding: 12px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: v-bind('config.typography.weights.medium');
  color: v-bind('config.colors.primary');
  transition: v-bind('config.transitions.default');
  border-bottom: 3px solid transparent;
  text-align: center;
}

.tab-btn:hover {
  color: v-bind('config.colors.active');
  background-color: rgba(0, 48, 255, 0.05);
}

.tab-btn.active {
  color: v-bind('config.colors.active');
  border-bottom-color: v-bind('config.colors.active');
  font-weight: v-bind('config.typography.weights.bold');
}

/* Điều chỉnh tiêu đề khi có tab */
.tab-container + .recently-viewed-title {
  margin-top: 0;
  margin-bottom: 20px;
}

/* Responsive cho tab */
@media (max-width: 768px) {
  .tab-btn {
    font-size: 14px;
    padding: 10px 0;
  }
}

@media (max-width: 480px) {
  .tab-btn {
    font-size: 12px;
    padding: 8px 0;
  }
}

/* Các style khác giữ nguyên... */
.news-container {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: v-bind('config.typography.fontFamily');
}

.news-container {
  max-width: v-bind('config.spacing.container');
  margin: 0 auto;
  padding: v-bind('config.spacing.padding');
  width: 100%;
}

.news-layout {
  display: flex;
  gap: v-bind('config.spacing.gap');
  width: 100%;
}

/* Cột trái (66.67% - tương đương 8/12) */
.left-column {
  width: 66.67%;
}

/* Cột phải (33.33% - tương đương 4/12) */
.right-column {
  width: 33.33%;
}

/* Thanh danh mục */
.categories-container {
  margin-bottom: 30px;
  width: 100%;
  position: relative;
}

.categories-wrapper {
  display: flex;
  gap: 10px;
  position: relative;
}

.categories-nav {
  display: flex;
  overflow-x: auto;
  gap: v-bind('config.spacing.categoriesGap');
  padding-bottom: 10px;
  width: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.categories-nav::-webkit-scrollbar {
  display: none;
}

.nav-arrow {
  width: v-bind('config.sizes.arrow');
  height: v-bind('config.sizes.arrow');
  border: 2px solid v-bind('config.colors.primary');
  background: white;
  border-radius: v-bind('config.borders.radius.round');
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: v-bind('config.colors.primary');
  font-size: 16px;
  transition: v-bind('config.transitions.default');
  flex-shrink: 0;
  z-index: 2;
}

.nav-arrow:hover {
  background: v-bind('config.colors.primary');
  color: v-bind('config.colors.white');
  transform: scale(1.05);
}

.nav-arrow:active {
  transform: scale(0.95);
}

.nav-arrow-left {
  order: 1;
}

.nav-arrow-right {
  order: 3;
}

.categories-nav {
  order: 2;
}

.category-item {
  font-size: v-bind('config.typography.sizes.category');
  font-weight: v-bind('config.typography.weights.bold');
  color: v-bind('config.colors.primary');
  white-space: nowrap;
  cursor: pointer;
  padding-bottom: 10px;
  border-bottom: 3px solid transparent;
  transition: v-bind('config.transitions.default');
  flex-shrink: 0;
  position: relative;
}

.category-item.active {
  color: v-bind('config.colors.active');
  border-bottom: v-bind('config.borders.width.categoryActive') solid v-bind('config.colors.active');
}

.category-item:hover {
  color: v-bind('config.colors.active');
}

.nav-divider {
  height: v-bind('config.borders.width.categoryActive');
  background-color: v-bind('config.colors.border');
  width: 100%;
  margin-top: -3px;
}

/* Bộ lọc */
.filter-container {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: v-bind('config.borders.radius.medium');
}

.filter-row {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.filter-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid v-bind('config.colors.border');
  border-radius: v-bind('config.borders.radius.small');
  font-size: 14px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid v-bind('config.colors.border');
  border-radius: v-bind('config.borders.radius.small');
  font-size: 14px;
  background-color: white;
  min-width: 150px;
}

.filter-btn {
  padding: 8px 20px;
  background-color: v-bind('config.colors.primary');
  color: white;
  border: none;
  border-radius: v-bind('config.borders.radius.small');
  cursor: pointer;
  font-weight: v-bind('config.typography.weights.medium');
  transition: v-bind('config.transitions.default');
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-btn:hover {
  background-color: v-bind('config.colors.active');
  transform: translateY(-1px);
}

/* Danh sách tin tức */
.news-list {
  margin-bottom: 30px;
  width: 100%;
  min-height: 300px;
}

.news-item {
  display: flex;
  padding: 20px 0;
  position: relative;
  width: 100%;
  transition: v-bind('config.transitions.default');
  cursor: pointer;
}

.news-item:hover {
  background-color: rgba(3, 19, 88, 0.05);
}

.news-image {
  width: 33%;
  margin-right: 20px;
  flex-shrink: 0;
}

.news-image img {
  width: 100%;
  height: v-bind('config.sizes.newsImageHeight');
  object-fit: cover;
  border-radius: v-bind('config.borders.radius.medium');
}

.news-content {
  flex: 1;
  width: 67%;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.news-category {
  font-size: 12px;
  font-weight: v-bind('config.typography.weights.medium');
  color: v-bind('config.colors.active');
  background-color: rgba(0, 48, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

.news-dot {
  color: v-bind('config.colors.text.light');
  font-size: 10px;
}

.news-date {
  font-size: 12px;
  color: v-bind('config.colors.text.light');
}

.news-views {
  font-size: 12px;
  color: v-bind('config.colors.text.light');
}

.news-title {
  font-size: v-bind('config.typography.sizes.title');
  font-weight: v-bind('config.typography.weights.bold');
  color: v-bind('config.colors.text.primary');
  margin-bottom: 10px;
  line-height: 1.3;
}

.news-subtitle {
  font-size: v-bind('config.typography.sizes.subtitle');
  color: v-bind('config.colors.text.secondary');
  margin-bottom: 10px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-footer {
  margin-top: 10px;
}

.news-author {
  font-size: 13px;
  color: v-bind('config.colors.text.light');
  font-style: italic;
}

.news-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: v-bind('config.borders.width.divider');
  background-color: v-bind('config.colors.border');
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid v-bind('config.colors.border');
  border-top: 3px solid v-bind('config.colors.primary');
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: v-bind('config.colors.text.secondary');
}

/* Empty state */
.empty-state, .empty-search {
  text-align: center;
  padding: 40px 20px;
  color: v-bind('config.colors.text.secondary');
  font-size: 16px;
}

/* Phân trang */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  margin-top: 30px;
}

.page-btn {
  padding: 8px 15px;
  border: 1px solid v-bind('config.colors.primary');
  background-color: white;
  color: v-bind('config.colors.primary');
  border-radius: v-bind('config.borders.radius.small');
  cursor: pointer;
  font-weight: v-bind('config.typography.weights.medium');
  transition: v-bind('config.transitions.default');
  min-width: 40px;
}

.page-btn.active {
  background-color: v-bind('config.colors.primary');
  color: v-bind('config.colors.white');
}

.page-btn:hover:not(:disabled) {
  background-color: v-bind('config.colors.background.hover');
  transform: translateY(-1px);
}

.page-btn.active:hover:not(:disabled) {
  background-color: v-bind('config.colors.primary');
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Thanh tìm kiếm */
.search-container {
  margin-bottom: 30px;
  width: 100%;
}

.search-box {
  display: flex;
  border: 1px solid v-bind('config.colors.primary');
  border-radius: v-bind('config.borders.radius.small');
  overflow: hidden;
  width: 100%;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%;
}

.search-input::placeholder {
  color: v-bind('config.colors.text.light');
}

.search-btn {
  padding: 10px 15px;
  background-color: v-bind('config.colors.primary');
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}

.search-btn:hover {
  background-color: v-bind('config.colors.active');
}

/* Box "Đã xem gần đây" */
.recently-viewed {
  background-color: white;
  border-radius: v-bind('config.borders.radius.medium');
  box-shadow: v-bind('config.shadows.default');
  padding: 20px;
  width: 100%;
}

.recently-viewed-title {
  font-size: v-bind('config.typography.sizes.recentlyViewedTitle');
  font-weight: v-bind('config.typography.weights.bold');
  color: v-bind('config.colors.primary');
  margin-bottom: 20px;
  line-height: 1.2;
}

.recently-viewed-list {
  display: flex;
  flex-direction: column;
  gap: v-bind('config.spacing.itemGap');
  width: 100%;
}

.recently-viewed-item {
  display: flex;
  gap: v-bind('config.spacing.itemGap');
  padding: 15px;
  border-bottom: v-bind('config.borders.width.divider') solid v-bind('config.colors.border');
  width: 100%;
  cursor: pointer;
}

.recently-viewed-item:hover {
  background-color: rgba(3, 19, 88, 0.05);
}

.recently-viewed-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.recently-viewed-image {
  width: v-bind('config.sizes.recentlyViewedImage.width');
  flex-shrink: 0;
}

.recently-viewed-image img {
  width: 100%;
  height: v-bind('config.sizes.recentlyViewedImage.height');
  object-fit: cover;
  border-radius: v-bind('config.borders.radius.small');
}

.recently-viewed-content {
  flex: 1;
  width: calc(100% - 95px);
}

.recently-viewed-title-item {
  font-size: v-bind('config.typography.sizes.recentlyViewedItemTitle');
  font-weight: v-bind('config.typography.weights.bold');
  color: v-bind('config.colors.primary');
  margin-bottom: 5px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recently-viewed-date {
  font-size: v-bind('config.typography.sizes.date');
  color: v-bind('config.colors.text.light');
}

/* Responsive */
@media (max-width: 1024px) {
  .news-layout {
    flex-direction: column;
    gap: 20px;
  }

  .left-column, .right-column {
    width: 100%;
  }

  .search-container {
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .news-container {
    padding: 15px;
  }

  .categories-wrapper {
    gap: 5px;
  }

  .nav-arrow {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }

  .news-item {
    flex-direction: column;
  }

  .news-image {
    width: 100%;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .news-content {
    width: 100%;
  }

  .categories-nav {
    gap: 15px;
  }

  .category-item {
    font-size: 18px;
  }

  .recently-viewed-title {
    font-size: 28px;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-input, .filter-select, .filter-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .news-container {
    padding: 10px;
  }

  .nav-arrow {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .category-item {
    font-size: 16px;
  }

  .news-title {
    font-size: 18px;
  }

  .recently-viewed-title {
    font-size: 24px;
  }

  .recently-viewed-title-item {
    font-size: 16px;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .news-meta {
    font-size: 11px;
  }
}

/* Ẩn nút mũi tên trên mobile nếu không cần thiết */
@media (max-width: 640px) {
  .nav-arrow {
    display: none;
  }

  .categories-wrapper {
    gap: 0;
  }
}
</style>