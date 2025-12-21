<template>
  <div class="news-container">
    <!-- Tiêu đề chính -->
    <h1 class="main-title" :style="{ color: config.colors.primary }">TIN TỨC NỔI BẬT</h1>

    <div class="content-wrapper">
      <!-- Cột trái - Tin tức -->
      <div class="left-column">
        <!-- Tin nổi bật nhất -->
        <div class="featured-news" v-if="sortedNews.length > 0" @click="goToNews(sortedNews[0])">
          <div class="featured-image-container">
            <img :src="sortedNews[0].thumbnail" :alt="sortedNews[0].title" class="featured-image">
            <div class="date-overlay"
                 :style="{ backgroundColor: config.colors.dateOverlayBg, color: config.colors.primary }">
              {{ formatDate(sortedNews[0].createAt) }}
            </div>
          </div>
          <div class="featured-info">
            <h2 class="featured-title" :style="{ color: config.colors.primary }">{{ sortedNews[0].title }}</h2>
            <p class="featured-subtitle" :style="{ color: config.colors.textSecondary }">{{ sortedNews[0].summary }}</p>
            <div class="featured-meta">
              <span class="meta-item">
                <i class="fa-regular fa-newspaper"></i>
                {{ sortedNews[0].categoryName }}
              </span>
              <span class="meta-item">
                <i class="fa-solid fa-user-pen"></i>
                {{ sortedNews[0].employeeName }}
              </span>
              <span class="meta-item">
                <i class="fa-regular fa-eye"></i>
                {{ sortedNews[0].viewCount }} lượt xem
              </span>
            </div>
            <div class="category-tag" :style="{ color: config.colors.primary }">{{ sortedNews[0].categoryName }}</div>
          </div>
        </div>

        <!-- Các tin nổi bật khác -->
        <div class="other-news" v-if="sortedNews.length > 1">
          <div
              v-for="(article, index) in sortedNews.slice(1)"
              :key="article.id || index"
              class="news-item"
              @click="goToNews(article)"
          >
            <div class="news-image-container">
              <img :src="article.thumbnail" :alt="article.title" class="news-image">
              <div class="date-overlay"
                   :style="{ backgroundColor: config.colors.dateOverlayBg, color: config.colors.primary }">
                {{ formatDate(article.createAt) }}
              </div>
            </div>
            <div class="news-info">
              <div class="info-wrapper">
                <h3 class="news-title" :style="{ color: config.colors.primary }">{{ article.title }}</h3>
                <p class="news-subtitle" :style="{ color: config.colors.textSecondary }">{{ article.summary }}</p>
              </div>
              <div class="meta-wrapper">
                <div class="news-meta">
                <span class="meta-item">
                  <i class="fa-regular fa-newspaper"></i>
                  {{ article.categoryName }}
                </span>
                  <span class="meta-item">
                  <i class="fa-solid fa-user-pen"></i>
                  {{ article.employeeName }}
                </span>
                  <span class="meta-item">
                  <i class="fa-regular fa-eye"></i>
                  {{ article.viewCount }}
                </span>
                </div>
                <div class="category-tag" :style="{ color: config.colors.primary }">{{ article.categoryName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải - Form liên hệ -->
      <div class="right-column">
        <div class="form-wrapper">
          <div class="form-container">
            <h2 class="form-title" :style="{ color: config.colors.primary }">Liên hệ hợp tác ngay!</h2>

            <form @submit.prevent="submitForm" class="contact-form">
              <div class="form-group">
                <input
                    type="text"
                    id="fullName"
                    v-model="formData.fullName"
                    required
                    class="form-input"
                    placeholder=" "
                >
                <label for="fullName" class="form-label" :style="{ color: config.colors.primary }">Họ và tên</label>
              </div>

              <div class="form-group">
                <input
                    type="tel"
                    id="phone"
                    v-model="formData.phone"
                    required
                    class="form-input"
                    placeholder=" "
                >
                <label for="phone" class="form-label" :style="{ color: config.colors.primary }">Số điện thoại</label>
              </div>

              <div class="form-group">
                <select
                    id="needs"
                    v-model="formData.needs"
                    required
                    class="form-input"
                >
                  <option value="" disabled selected></option>
                  <option value="buy">Mua</option>
                  <option value="rent">Bán gấp</option>
                  <option value="consult">Bán giá mong muốn</option>
                </select>
                <label for="needs" class="form-label" :style="{ color: config.colors.primary }">Nhu cầu</label>
              </div>

              <div class="form-group">
                <input
                    type="text"
                    id="price"
                    v-model="formData.price"
                    required
                    class="form-input"
                    placeholder=" "
                >
                <label for="price" class="form-label" :style="{ color: config.colors.primary }">Giá bán</label>
              </div>

              <div class="form-group">
                <input
                    type="text"
                    id="area"
                    v-model="formData.area"
                    required
                    class="form-input"
                    placeholder=" "
                >
                <label for="area" class="form-label" :style="{ color: config.colors.primary }">Khu vực</label>
              </div>

              <button type="submit" class="submit-btn">Gửi thông tin</button>
            </form>
          </div>

          <img src="/imgs/building-hero-section.png" alt="Building" class="form-image">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed} from 'vue'


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


// Object config cho CMS
let config = {}

const props = defineProps({
  sectionData: Object,
  featureNews: Object
})

if (props.sectionData) {
  config = props.sectionData;
  console.log("Đã nhận props", config)
}

// Tính toán danh sách tin tức đã sắp xếp
const sortedNews = computed(() => {
  if (!props.featureNews || !Array.isArray(props.featureNews)) {
    return []
  }

  // Sắp xếp theo priority tăng dần
  return [...props.featureNews]
      .filter(news => news.status === 'PUBLISHED' && news.isFeatured)
      .sort((a, b) => a.priority - b.priority)
})

// Hàm format ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formData = reactive({
  fullName: '',
  phone: '',
  needs: '',
  price: '',
  area: ''
})

// Computed properties từ config (giữ nguyên)
const cssVars = computed(() => ({
  '--color-primary': config.colors?.primary || '#031358',
  '--color-secondary': config.colors?.secondary || '#ff6b35',
  '--color-text-secondary': config.colors?.textSecondary || '#666',
  '--color-white': config.colors?.white || '#fff',
  '--color-date-overlay-bg': config.colors?.dateOverlayBg || 'rgba(255, 255, 255, 0.9)',
  '--color-button-shadow': config.colors?.buttonShadow || 'rgba(0, 0, 0, 0.2)',

  '--font-size-main-title': config.typography?.mainTitle?.fontSize || '36px',
  'font-weight-main-title': config.typography?.mainTitle?.fontWeight || '700',
  '--font-size-featured-title': config.typography?.featuredTitle?.fontSize || '28px',
  'font-weight-featured-title': config.typography?.featuredTitle?.fontWeight || '600',
  '--font-size-featured-subtitle': config.typography?.featuredSubtitle?.fontSize || '16px',
  '--font-size-news-title': config.typography?.newsTitle?.fontSize || '20px',
  'font-weight-news-title': config.typography?.newsTitle?.fontWeight || '600',
  '--font-size-news-subtitle': config.typography?.newsSubtitle?.fontSize || '14px',
  '--font-size-form-title': config.typography?.formTitle?.fontSize || '24px',
  'font-weight-form-title': config.typography?.formTitle?.fontWeight || '600',
  '--font-size-form-label': config.typography?.formLabel?.fontSize || '16px',
  '--font-size-form-label-focus': config.typography?.formLabel?.focusFontSize || '12px',
  '--font-size-button': config.typography?.button?.fontSize || '18px',
  'font-weight-button': config.typography?.button?.fontWeight || '600',
  '--font-size-category-tag': config.typography?.categoryTag?.fontSize || '12px',
  'font-weight-category-tag': config.typography?.categoryTag?.fontWeight || '500',

  '--spacing-container-max-width': config.spacing?.containerMaxWidth || '1200px',
  '--spacing-container-margin-top': config.spacing?.containerMarginTop || '50px',
  '--spacing-container-padding': config.spacing?.containerPadding || '20px',
  '--spacing-content-gap': config.spacing?.contentGap || '30px',
  '--spacing-featured-image-height': config.spacing?.featuredImageHeight || '400px',
  '--spacing-news-image-height': config.spacing?.newsImageHeight || '200px',
  '--spacing-form-padding': config.spacing?.formPadding || '30px',
  '--spacing-button-padding': config.spacing?.buttonPadding || '15px',

  '--border-radius-small': config.borderRadius?.small || '8px',
  '--border-radius-medium': config.borderRadius?.medium || '12px',

  '--shadow-card': config.shadows?.card || '0 4px 20px rgba(0, 0, 0, 0.1)',
  '--shadow-button-hover': config.shadows?.buttonHover || '0 6px 25px rgba(0, 0, 0, 0.15)',

  '--gradient-button': config.gradients?.button || 'linear-gradient(135deg, #031358 0%, #ff6b35 100%)',

  '--transition-default': config.transitions?.default || '0.3s ease',
  '--transition-form-label': config.transitions?.formLabel || 'all 0.3s ease'
}))

// Xử lý submit form
const submitForm = () => {
  console.log('Form submitted:', formData)
  // Xử lý gửi form ở đây
  alert('Thông tin đã được gửi thành công!')

  // Reset form
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.meta-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.news-container {
  :root {
    v-bind: cssVars;
  }

  max-width: v-bind('config.spacing?.containerMaxWidth || "1200px"');
  margin: v-bind('config.spacing?.containerMarginTop || "50px"') auto 0;
  padding: v-bind('config.spacing?.containerPadding || "20px"');
}

.main-title {
  text-align: center;
  color: v-bind('config.colors?.primary || "#031358"');
  font-size: v-bind('config.typography?.mainTitle?.fontSize || "36px"');
  font-weight: v-bind('config.typography?.mainTitle?.fontWeight || "700"');
  margin-bottom: 40px;
}

.content-wrapper {
  display: flex;
  gap: v-bind('config.spacing?.contentGap || "30px"');
}

/* Cột trái - Tin tức */
.left-column {
  flex: 8;
}

.featured-news {
  margin-bottom: 30px;
  box-shadow: v-bind('config.shadows?.card || "0 4px 20px rgba(0, 0, 0, 0.1)"');
  border-radius: v-bind('config.borderRadius?.medium || "12px"');
  overflow: hidden;
  background-color: v-bind('config.colors?.white || "#fff"');
  transition: all v-bind('config.transitions?.default || "0.3s ease"');
  cursor: pointer;
  position: relative;
}

.featured-news:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.featured-news:hover .featured-image {
  transform: scale(1.05);
}

.featured-news:hover .featured-title {
  color: v-bind('config.colors?.secondary || "#ff6b35"');
}

.featured-image-container {
  position: relative;
  width: 100%;
  height: v-bind('config.spacing?.featuredImageHeight || "400px"');
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform v-bind('config.transitions?.default || "0.3s ease"');
}

.date-overlay {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background-color: v-bind('config.colors?.dateOverlayBg || "rgba(255, 255, 255, 0.9)"');
  color: v-bind('config.colors?.primary || "#031358"');
  padding: 5px 10px;
  border-radius: v-bind('config.borderRadius?.small || "8px"');
  font-size: 14px;
  font-weight: 500;
  transition: all v-bind('config.transitions?.default || "0.3s ease"');
  z-index: 2;
}

.featured-news:hover .date-overlay {
  background-color: v-bind('config.colors?.primary || "#031358"');
  color: v-bind('config.colors?.white || "#fff"');
}

.featured-info {
  background-color: v-bind('config.colors?.white || "#fff"');
  padding: 25px;
  position: relative;
}

.featured-title {
  color: v-bind('config.colors?.primary || "#031358"');
  font-size: v-bind('config.typography?.featuredTitle?.fontSize || "28px"');
  font-weight: v-bind('config.typography?.featuredTitle?.fontWeight || "600"');
  margin-bottom: 15px;
  line-height: 1.3;
  transition: color v-bind('config.transitions?.default || "0.3s ease"');
}

.featured-subtitle {
  color: v-bind('config.colors?.textSecondary || "#666"');
  font-size: v-bind('config.typography?.featuredSubtitle?.fontSize || "16px"');
  line-height: 1.5;
  margin-bottom: 20px;
}

/* Metadata cho tin nổi bật */
.featured-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
  transition: color v-bind('config.transitions?.default || "0.3s ease"');
}

.featured-news:hover .meta-item {
  color: v-bind('config.colors?.primary || "#031358"');
}

.meta-icon {
  font-size: 14px;
}

.category-tag {
  display: block;
  text-align: right;
  color: v-bind('config.colors?.primary || "#031358"');
  font-size: v-bind('config.typography?.categoryTag?.fontSize || "12px"');
  font-weight: v-bind('config.typography?.categoryTag?.fontWeight || "500"');
  transition: color v-bind('config.transitions?.default || "0.3s ease"');
}

.featured-news:hover .category-tag {
  color: v-bind('config.colors?.secondary || "#ff6b35"');
}

/* Các tin nổi bật khác */
.other-news {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.news-item {
  background: transparent;
  border-radius: 0;
  overflow: hidden;
  cursor: pointer;
  transition: all v-bind('config.transitions?.default || "0.3s ease"');
  border-bottom: 2px solid transparent;
  padding-bottom: 10px;
}

.news-item:hover {
  transform: translateY(-3px);
  border-bottom: 2px solid v-bind('config.colors?.secondary || "#ff6b35"');
}

.news-item:hover .news-image {
  transform: scale(1.05);
}

.news-item:hover .news-title {
  color: v-bind('config.colors?.secondary || "#ff6b35"');
}

.news-item:hover .date-overlay {
  background-color: v-bind('config.colors?.primary || "#031358"');
  color: v-bind('config.colors?.white || "#fff"');
}

.news-item:hover .category-tag {
  color: v-bind('config.colors?.secondary || "#ff6b35"');
}

.news-image-container {
  position: relative;
  width: 100%;
  height: v-bind('config.spacing?.newsImageHeight || "200px"');
  overflow: hidden;
  border-radius: v-bind('config.borderRadius?.small || "8px"');
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform v-bind('config.transitions?.default || "0.3s ease"');
}

.news-info {
  background: transparent;
  padding: 15px 0;
  position: relative;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  min-height: 200px; /* THÊM DÒNG NÀY */
}

.info-wrapper {
  flex: 1; /* THÊM DÒNG NÀY - chiếm không gian còn lại */
}

.news-title {
  color: v-bind('config.colors?.primary || "#031358"');
  font-size: v-bind('config.typography?.newsTitle?.fontSize || "20px"');
  font-weight: v-bind('config.typography?.newsTitle?.fontWeight || "600"');
  margin-bottom: 10px;
  line-height: 1.3;
  transition: color v-bind('config.transitions?.default || "0.3s ease"');
}

.news-subtitle {
  color: v-bind('config.colors?.textSecondary || "#666"');
  font-size: v-bind('config.typography?.newsSubtitle?.fontSize || "14px"');
  line-height: 1.4;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Metadata cho tin thường */
.news-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 12px;
}

.news-item:hover .news-meta .meta-item {
  color: v-bind('config.colors?.primary || "#031358"');
}

/* Cột phải - Form liên hệ */
.right-column {
  flex: 4;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
}

.form-container {
  background-color: v-bind('config.colors?.white || "#fff"');
  box-shadow: v-bind('config.shadows?.card || "0 4px 20px rgba(0, 0, 0, 0.1)"');
  border-radius: v-bind('config.borderRadius?.medium || "12px"');
  padding: v-bind('config.spacing?.formPadding || "30px"');
  transition: all v-bind('config.transitions?.default || "0.3s ease"');
}

.form-container:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.form-title {
  color: v-bind('config.colors?.primary || "#031358"');
  font-size: v-bind('config.typography?.formTitle?.fontSize || "24px"');
  font-weight: v-bind('config.typography?.formTitle?.fontWeight || "600"');
  margin-bottom: 25px;
  text-align: center;
  transition: color v-bind('config.transitions?.default || "0.3s ease"');
}

.form-container:hover .form-title {
  color: v-bind('config.colors?.secondary || "#ff6b35"');
}

.contact-form {
  margin-bottom: 0;
}

.form-group {
  position: relative;
  margin-bottom: 30px;
}

.form-input {
  width: 100%;
  padding: v-bind('config.spacing?.buttonPadding || "15px"') 0 10px 0;
  border: none;
  border-bottom: 1px solid v-bind('config.colors?.primary || "#031358"');
  background-color: transparent;
  font-size: v-bind('config.typography?.formLabel?.fontSize || "16px"');
  color: v-bind('config.colors?.primary || "#031358"');
  outline: none;
  transition: border-color v-bind('config.transitions?.default || "0.3s ease"');
}

.form-input:hover {
  border-bottom: 1px solid v-bind('config.colors?.secondary || "#ff6b35"');
}

.form-input:focus {
  border-bottom: 2px solid v-bind('config.colors?.secondary || "#ff6b35"');
}

.form-label {
  position: absolute;
  top: 50%;
  left: 0;
  font-size: v-bind('config.typography?.formLabel?.fontSize || "16px"');
  color: v-bind('config.colors?.primary || "#031358"');
  pointer-events: none;
  transition: v-bind('config.transitions?.formLabel || "all 0.3s ease"');
  transform: translateY(-50%);
  opacity: 0.5;
}

.form-group:hover .form-label {
  opacity: 0.8;
}

/* Hiệu ứng focus - label thu nhỏ và di chuyển lên trên */
.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label {
  top: 0;
  font-size: v-bind('config.typography?.formLabel?.focusFontSize || "12px"');
  color: v-bind('config.colors?.secondary || "#ff6b35"');
  transform: translateY(0);
  opacity: 1;
}

.form-group:hover .form-input:focus + .form-label,
.form-group:hover .form-input:not(:placeholder-shown) + .form-label {
  color: v-bind('config.colors?.secondary || "#ff6b35"');
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23031358' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  transition: all v-bind('config.transitions?.default || "0.3s ease"');
}

select.form-input:hover {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ff6b35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
}

.submit-btn {
  width: 100%;
  padding: v-bind('config.spacing?.buttonPadding || "15px"');
  background: v-bind('config.gradients?.button || "linear-gradient(135deg, #031358 0%, #ff6b35 100%)"');
  color: v-bind('config.colors?.white || "#fff"');
  border: none;
  border-radius: v-bind('config.borderRadius?.medium || "12px"');
  font-size: v-bind('config.typography?.button?.fontSize || "18px"');
  font-weight: v-bind('config.typography?.button?.fontWeight || "600"');
  cursor: pointer;
  transition: transform v-bind('config.transitions?.default || "0.3s ease"'),
  box-shadow v-bind('config.transitions?.default || "0.3s ease"'),
  background v-bind('config.transitions?.default || "0.3s ease"');
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: v-bind('config.shadows?.buttonHover || "0 6px 25px rgba(0, 0, 0, 0.15)"');
  background: linear-gradient(135deg, #031358 0%, #ff6b35 100%);
}

.submit-btn:hover::before {
  left: 100%;
}

.form-image {
  margin-top: auto;
  width: 100%;
  height: auto;
  border-radius: v-bind('config.borderRadius?.medium || "12px"');
  transition: all v-bind('config.transitions?.default || "0.3s ease"');
  cursor: pointer;
}

.form-image:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 1200px) {
  .content-wrapper {
    gap: 20px;
  }

  .news-container {
    padding: 15px;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
  }

  .other-news {
    grid-template-columns: 1fr;
  }

  .form-wrapper {
    flex-direction: row;
    gap: 20px;
  }

  .form-container {
    flex: 1;
  }

  .form-image {
    flex: 1;
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .form-wrapper {
    flex-direction: column;
  }

  .form-image {
    max-width: 100%;
  }

  .featured-meta {
    gap: 10px;
  }

  .meta-item {
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .main-title {
    font-size: 28px;
  }

  .featured-title {
    font-size: 22px;
  }

  .featured-subtitle {
    font-size: 16px;
  }

  .form-title {
    font-size: 28px;
  }

  .featured-image-container {
    height: 300px;
  }

  .news-image-container {
    height: 150px;
  }

  .featured-meta {
    flex-direction: column;
    gap: 8px;
  }

  .news-meta {
    flex-direction: column;
    gap: 5px;
  }
}
</style>