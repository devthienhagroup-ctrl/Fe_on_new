<template>
  <div class="news-detail-container">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải tin tức...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <h2>Đã xảy ra lỗi</h2>
      <p>{{ error }}</p>
      <button @click="fetchNewsDetail" class="retry-btn">
        <i class="fas fa-redo"></i> Thử lại
      </button>
    </div>

    <!-- News content -->
    <div v-else-if="news" class="news-content">
      <!-- Basic info card -->
      <div class="basic-info-card">
        <div class="thumbnail-container" v-if="news.thumbnail">
          <img :src="news.thumbnail" :alt="news.title" class="thumbnail" />
        </div>

        <div class="info-content">
          <!-- Featured badge -->

          <button @click="goBack" class="back-btn">
            <i class="fas fa-arrow-left"></i>
            <span>Quay lại</span>
          </button>

          <div v-if="news.isFeatured" class="featured-badge">
            <i class="fas fa-star"></i>
            <span>Tin nổi bật</span>
          </div>

          <h1 class="news-title">{{ news.title }}</h1>

          <p class="news-summary">{{ news.summary }}</p>

          <div class="meta-info">
            <div class="meta-item">
              <i class="fas fa-folder meta-icon"></i>
              <span class="meta-label">Chuyên mục:</span>
              <span class="meta-value category-name">{{ news.categoryName }}</span>
            </div>

            <div class="meta-item">
              <i class="fas fa-user meta-icon"></i>
              <span class="meta-label">Tác giả:</span>
              <span class="meta-value">{{ news.employeeName }}</span>
            </div>

            <div class="meta-item" :title="formatFullDate(news.createAt)">
              <i class="fas fa-clock meta-icon"></i>
              <span class="meta-label">Đăng:</span>
              <span class="meta-value">{{ timeAgo(news.createAt) }}</span>
            </div>

            <div v-if="news.updateAt && !isSameDate(news.createAt, news.updateAt)"
                 class="meta-item"
                 :title="formatFullDate(news.updateAt)">
              <i class="fas fa-sync-alt meta-icon"></i>
              <span class="meta-label">Cập nhật:</span>
              <span class="meta-value">{{ timeAgo(news.updateAt) }}</span>
            </div>

            <div class="meta-item">
              <i class="fas fa-eye meta-icon"></i>
              <span class="meta-label">Lượt xem:</span>
              <span class="meta-value">{{ formatViewCount(news.viewCount || 0) }}</span>
            </div>

            <div v-if="news.status" class="meta-item">
              <i :class="getStatusIcon(news.status) + ' meta-icon'"></i>
              <span class="meta-label">Trạng thái:</span>
              <span class="meta-value status-badge" :class="getStatusClass(news.status)">
                {{ getStatusText(news.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- HTML content -->
      <div class="content-section">
        <h2 class="section-title">
          <i class="fas fa-file-alt section-icon"></i>
          Nội dung chi tiết
        </h2>
        <div class="rich-text-preview rich-text-editor-wrapper">
          <div class="tiptap-preview tiptap" v-html="news.contentHTML"></div>
        </div>
      </div>

      <!-- Related news slider -->
      <div v-if="relatedNews.length > 0" class="related-news-section">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-newspaper section-icon"></i>
            Tin cùng danh mục
          </h2>
          <div class="slider-controls">
            <button @click="prevSlide" class="slider-btn prev-btn">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button @click="nextSlide" class="slider-btn next-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="slider-container">
          <div class="slider-track" :style="{ transform: `translateX(-${currentSlide * 25}%)` }">
            <div
                v-for="item in relatedNews"
                :key="item.id"
                class="slider-item"
                @click="goToNews(item.slug)"
            >
              <div class="news-card">
                <div class="card-thumbnail">
                  <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" />
                  <div v-else class="no-thumbnail">
                    <i class="fas fa-image"></i>
                  </div>
                  <div v-if="item.isFeatured" class="card-featured-badge">
                    <i class="fas fa-star"></i>
                  </div>
                </div>
                <div class="card-content">
                  <div class="card-category">
                    <i class="fas fa-tag"></i>
                    <span>{{ item.categoryName || 'Không có' }}</span>
                  </div>
                  <h3 class="card-title">{{ item.title }}</h3>
                  <p class="card-summary">{{ truncateText(item.summary, 100) }}</p>
                  <div class="card-meta">
                    <div class="card-meta-item">
                      <i class="fas fa-clock"></i>
                      <span>{{ timeAgo(item.createAt) }}</span>
                    </div>
                    <div class="card-meta-item">
                      <i class="fas fa-eye"></i>
                      <span>{{ formatViewCount(item.viewCount) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="slider-dots">
          <button
              v-for="index in slideCount"
              :key="index"
              :class="['slider-dot', { active: currentSlide === index - 1 }]"
              @click="goToSlide(index - 1)"
          >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from "../../../api/api.js"
import {useRecentNews} from "../../../stores/useRecentNews.js";

const { addRecentNews } = useRecentNews();

const route = useRoute()
const router = useRouter()

const news = ref(null)
const relatedNews = ref([])
const loading = ref(true)
const error = ref(null)
const currentSlide = ref(0)
const itemsPerPage = 4

// Thêm method goBack
const goBack = () => {
  router.back()
}

// Computed properties
const slideCount = computed(() => {
  return Math.ceil(relatedNews.value.length / itemsPerPage)
})

// Extract newsId from URL path like /tin-tuc/1
const extractNewsSlugFromPath = () => {
  const path = route.path
  const segments = path.split('/')
  const slug = segments[segments.length - 1]
  return slug || null
}

// Fetch news detail
const fetchNewsDetail = async () => {
  const slug = extractNewsSlugFromPath()

  if (!slug) {
    error.value = 'ID tin tức không hợp lệ'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null

    const response = await api.get(`/thg/public/news/getNewsDetail/${slug}`)

    if (response.data) {
      news.value = response.data
      // Fetch related news after getting news detail
      await fetchRelatedNews(news.value.categoryId)
    } else {
      throw new Error('Không có dữ liệu trả về')
    }

  } catch (err) {
    console.error('Error fetching news detail:', err)

    if (err.response && err.response.status === 404) {
      router.push("/khong-tim-thay")
      return
    }

    error.value = err.message || 'Đã xảy ra lỗi khi tải tin tức'
  } finally {
    loading.value = false
  }
}

// Fetch related news
const fetchRelatedNews = async (categoryId, pageNumber = 0) => {
  if (!categoryId) return

  try {
    const response = await api.get(`/thg/public/news/getNewsCategories/${categoryId}/${pageNumber}`)

    if (response.data && response.data.content) {
      console.log("Đã lấy api", response.data.content)
      // Filter out current news from related news
      relatedNews.value = response.data.content.filter(item => item.id !== news.value?.id)
    }
  } catch (err) {
    console.error('Error fetching related news:', err)
  }
}

// Time formatting functions
const timeAgo = (dateString) => {
  if (!dateString) return 'Không có ngày'

  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 0) return 'Vừa xong'

  const intervals = {
    năm: 31536000,
    tháng: 2592000,
    tuần: 604800,
    ngày: 86400,
    giờ: 3600,
    phút: 60,
    giây: 1
  }

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value)
    if (interval >= 1) {
      return `${interval} ${key} trước`
    }
  }

  return 'Vừa xong'
}

const isSameDate = (dateString1, dateString2) => {
  if (!dateString1 || !dateString2) return false
  const date1 = new Date(dateString1).toDateString()
  const date2 = new Date(dateString2).toDateString()
  return date1 === date2
}

const formatFullDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }
    return date.toLocaleDateString('vi-VN', options)
  } catch {
    return dateString
  }
}

const formatViewCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K'
  }
  return count.toString()
}

// Status helpers
const getStatusText = (status) => {
  const statusMap = {
    'PUBLISHED': 'Đã xuất bản',
    'DRAFT': 'Bản nháp',
    'PENDING': 'Chờ duyệt'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    'PUBLISHED': 'status-published',
    'DRAFT': 'status-draft',
    'PENDING': 'status-pending'
  }
  return classMap[status] || ''
}

const getStatusIcon = (status) => {
  const iconMap = {
    'PUBLISHED': 'fas fa-check-circle',
    'DRAFT': 'fas fa-edit',
    'PENDING': 'fas fa-hourglass-half'
  }
  return iconMap[status] || 'fas fa-circle'
}

// Text helper
const truncateText = (text, length) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Slider functions
const nextSlide = () => {
  if (currentSlide.value < slideCount.value - 1) {
    currentSlide.value++
  } else {
    currentSlide.value = 0
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else {
    currentSlide.value = slideCount.value - 1
  }
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const goToNews = (slug) => {
  router.push(`/tin-tuc/${slug}`)
}

const increamentView = async () =>{
  const response = await api.get(`/thg/public/news/${extractNewsSlugFromPath()}/increment-view`)
  console.log("Đang gọi tăng view", `/thg/public/news/${extractNewsSlugFromPath()}/increment-view`)
  if(response.status===200) {
    console.log(response.data)
  }
}

const saveRecentNews = async () => {
    const newsDTO = {
      id: news.value.id,
      slug: news.value.slug,
      title: news.value.title,
      thumbnail: news.value.thumbnail,
      viewAt: new Date().toISOString()
    }

    addRecentNews(newsDTO);
}

// Fetch news on component mount
onMounted(async () => {
  try {
    await increamentView();
    await fetchNewsDetail();
    await saveRecentNews();
  }catch (e) {
    console.log(e);
    // await router.push('/khong-tim-thay')
  }
})

// Watch for route changes
watch(() => route.path, () => {
  if (route.path.includes('/tin-tuc/')) {
    fetchNewsDetail()
  }
})
</script>

<style scoped>
.news-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

/* Nút quay lại */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95em;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.2);
  margin-right:5px;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 153, 225, 0.3);
  background: linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%);
}

.back-btn i {
  font-size: 0.9em;
}

/* Hoặc nếu muốn nút cố định ở góc trên trái */
.back-btn.fixed {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  margin-bottom: 0;
}


/* Responsive cho nút quay lại */
@media (max-width: 768px) {
  .back-btn {
    padding: 8px 16px;
    font-size: 0.9em;
  }

  .back-btn.fixed {
    top: 15px;
    left: 15px;
  }
}

/* Loading styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error styles */
.error-container {
  text-align: center;
  padding: 40px;
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  border-radius: 12px;
  color: #721c24;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.1);
}

.error-container h2 {
  margin-bottom: 15px;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(220, 53, 69, 0.2);
}

.retry-btn i {
  font-size: 0.9em;
}

/* Basic info card */
.basic-info-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 40px;
  padding: 40px;
  border: 1px solid #e9ecef;
}

.thumbnail-container {
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.thumbnail {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.thumbnail:hover {
  transform: scale(1.02);
}

.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  color: #8b4513;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.95em;
  font-weight: 700;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.2);
}

.featured-badge i {
  color: #8b4513;
  font-size: 0.9em;
}

.news-title {
  font-size: 2.5em;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 20px;
  line-height: 1.3;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.news-summary {
  font-size: 1.2em;
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 500;
}

/* Enhanced meta info */
.meta-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
  background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  cursor: default;
}

.meta-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  border-color: #4299e1;
}

.meta-item[title]:hover:after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #2d3748;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85em;
  white-space: nowrap;
  z-index: 1000;
  margin-bottom: 8px;
}

.meta-item[title]:hover:before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #2d3748;
  margin-bottom: -5px;
  z-index: 1000;
}

.meta-icon {
  color: #4299e1;
  font-size: 1.1em;
  width: 20px;
  text-align: center;
}

.meta-label {
  font-weight: 700;
  color: #4a5568;
  font-size: 0.95em;
  min-width: 80px;
}

.meta-value {
  color: #2d3748;
  font-weight: 600;
  font-size: 0.95em;
}

.category-name {
  color: #4299e1;
  font-weight: 700;
  padding: 4px 12px;
  background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
  border-radius: 6px;
}

/* Status badges */
.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-published {
  background: linear-gradient(135deg, #c6f6d5 0%, #9ae6b4 100%);
  color: #22543d;
  border: 1px solid #68d391;
}

.status-draft {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  color: #742a2a;
  border: 1px solid #fc8181;
}

.status-pending {
  background: linear-gradient(135deg, #feebc8 0%, #fbd38d 100%);
  color: #744210;
  border: 1px solid #f6ad55;
}

/* Content section */
.content-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 40px;
  margin-bottom: 40px;
  border: 1px solid #e9ecef;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.8em;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 3px solid #4299e1;
}

.section-icon {
  color: #4299e1;
  font-size: 1.4em;
}

/* Related news slider */
.related-news-section {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 40px;
  border: 1px solid #e9ecef;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.slider-controls {
  display: flex;
  gap: 10px;
}

.slider-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1.2em;
}

.slider-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(66, 153, 225, 0.3);
}

.slider-container {
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 30px;
}

.slider-track {
  display: flex;
  transition: transform 0.5s ease;
}

.slider-item {
  flex: 0 0 25%;
  padding: 0 10px;
  cursor: pointer;
}

.news-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  border: 1px solid #e2e8f0;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.card-thumbnail {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .card-thumbnail img {
  transform: scale(1.1);
}

.no-thumbnail {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  font-size: 2em;
}

.card-featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  color: #8b4513;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
}

.card-content {
  padding: 20px;
}

.card-category {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4299e1;
  font-size: 0.85em;
  font-weight: 600;
  margin-bottom: 10px;
}

.card-category i {
  font-size: 0.9em;
}

.card-title {
  font-size: 1.1em;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  color: #718096;
  font-size: 0.95em;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
}

.card-meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #718096;
  font-size: 0.85em;
}

.card-meta-item i {
  color: #a0aec0;
  font-size: 0.9em;
}

.slider-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cbd5e0;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.slider-dot.active {
  background: #4299e1;
  transform: scale(1.2);
}

.slider-dot:hover {
  background: #3182ce;
}

/* Rich text content */
.rich-text-preview {
  max-width: 100%;
}

:deep(.tiptap-preview) {
  font-size: 1.1em;
  line-height: 1.8;
  color: #2d3748;
}

:deep(.tiptap-preview h1),
:deep(.tiptap-preview h2),
:deep(.tiptap-preview h3) {
  color: #2d3748;
  margin-top: 1.5em;
  margin-bottom: 0.8em;
}

:deep(.tiptap-preview p) {
  margin-bottom: 1.2em;
}

:deep(.tiptap-preview img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5em 0;
}

:deep(.tiptap-preview ul),
:deep(.tiptap-preview ol) {
  margin: 1em 0;
  padding-left: 2em;
}

:deep(.tiptap-preview a) {
  color: #4299e1;
  text-decoration: none;
  font-weight: 600;
}

:deep(.tiptap-preview a:hover) {
  text-decoration: underline;
}

:deep(.tiptap-preview blockquote) {
  border-left: 4px solid #4299e1;
  padding-left: 1.5em;
  margin: 2em 0;
  color: #4a5568;
  font-style: italic;
  background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
  padding: 1.5em;
  border-radius: 0 8px 8px 0;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .slider-item {
    flex: 0 0 33.333%;
  }
}

@media (max-width: 992px) {
  .news-title {
    font-size: 2em;
  }

  .slider-item {
    flex: 0 0 50%;
  }
}

@media (max-width: 768px) {
  .news-detail-container {
    padding: 15px;
  }

  .basic-info-card,
  .content-section,
  .related-news-section {
    padding: 25px;
  }

  .news-title {
    font-size: 1.8em;
  }

  .meta-info {
    grid-template-columns: 1fr;
  }

  .thumbnail-container {
    max-height: 300px;
  }

  .slider-item {
    flex: 0 0 100%;
  }

  .section-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .slider-controls {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .news-title {
    font-size: 1.5em;
  }

  .news-summary {
    font-size: 1em;
  }

  .basic-info-card,
  .content-section,
  .related-news-section {
    padding: 20px;
  }

  .meta-item {
    padding: 10px 15px;
  }
}
</style>