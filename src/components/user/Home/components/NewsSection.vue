<template>
  <div class="solution-news-container">
    <div class="content-wrapper">
      <!-- Left Column - Giải pháp bán bất động sản -->
      <div class="column left-column" @mouseenter="startProgress('left')" @mouseleave="stopProgress('left')">
        <div class="section-header">
          <h2 class="section-title">{{ config.leftColumnTitle }}</h2>
          <a href="#" class="view-all-link">
            {{ config.viewAllText }}
            <i :class="config.arrowIcon"></i>
          </a>
        </div>
        <div class="progress-bar">
          <div
              class="progress-fill"
              :class="{ 'progress-active': leftProgressActive }"
              :style="{ backgroundColor: config.progressColor }"
          ></div>
        </div>

        <div class="solution-items">
          <div
              v-for="(item, index) in featureNews"
              :key="index"
              class="solution-item"
          >
            <router-link :to="'/tin-tuc/' + item.slug" class="solution-link">
              <div class="image-container">
                <img
                    :src="item.thumbnail"
                    :alt="item.title"
                    class="solution-image"
                />
                <div class="image-overlay" :style="{ background: config.imageOverlayGradient }"></div>
              </div>

              <div class="solution-content">
                <h3 class="solution-title">{{ item.title }}</h3>
                <p class="solution-summary">{{ item.summary }}</p>

                <div class="solution-meta">
                  <p class="posted-date">
                    <i :class="config.calendarIcon" class="meta-icon"></i>
                    Đăng ngày: {{ formatDate(item.createAt) }}
                  </p>
                  <p class="author">
                    <i :class="config.userIcon" class="meta-icon"></i>
                    Tác giả: {{ item.employeeName || 'Admin' }}
                  </p>
                  <!-- Bổ sung lượt xem -->
                  <p class="views-count">
                    <i class="meta-icon fa-regular fa-eye" ></i>
                    Lượt xem: {{ formatViews(item.viewCount) }}
                  </p>
                </div>

                <button class="view-more-btn" :style="{ background: config.buttonGradient }">
                  {{ config.readMoreText }}
                  <i :class="config.arrowRightIcon" class="btn-icon"></i>
                </button>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Right Column - Tin tức -->
      <div class="column right-column" @mouseenter="startProgress('right')" @mouseleave="stopProgress('right')">
        <div class="section-header">
          <h2 class="section-title">{{ config.rightColumnTitle }}</h2>
          <a :href="config.newsLink" class="view-all-link">
            {{ config.viewAllText }}
            <i :class="config.arrowIcon"></i>
          </a>
        </div>
        <div class="progress-bar">
          <div
              class="progress-fill"
              :class="{ 'progress-active': rightProgressActive }"
              :style="{ backgroundColor: config.progressColor }"
          ></div>
        </div>

        <div class="news-grid">
          <div class="news-column">
            <div
                v-for="(item, index) in latestNews.slice(0, 2)"
                :key="index"
                class="news-item"
            >
              <router-link :to="'/tin-tuc/' + item.slug" class="news-link">
                <div class="news-image-container">
                  <img
                      :src="item.thumbnail"
                      :alt="item.title"
                      class="news-image"
                  />
                  <div class="news-overlay" :style="{ background: config.newsOverlayGradient }"></div>
                </div>
                <div class="news-content">
                  <div class="news-tag" :style="{ background: config.tagGradient }">
                    <i :class="config.newIcon" class="tag-icon"></i>
                    {{ config.newTagText }}
                  </div>
                  <h3 class="news-title">{{ item.title }}</h3>
                  <p class="news-summary">{{ item.summary }}</p>

                  <!-- Bổ sung thông tin lượt xem và ngày đăng -->
                  <div class="news-meta-info">
                    <div class="news-meta-left">
                      <p class="news-date">
                        <i :class="config.calendarIcon" class="meta-icon"></i>
                        {{ formatDate(item.createAt) }}
                      </p>
                      <p class="news-views">
                        <i  class="meta-icon fa-regular fa-eye"></i>
                        {{ formatViews(item.viewCount) }}
                      </p>
                    </div>
                  </div>

                  <div class="news-footer">
                    <button class="news-read-btn">
                      {{ config.readMoreText }}
                      <i :class="config.arrowRightIcon"></i>
                    </button>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <div class="news-column">
            <div
                v-for="(item, index) in latestNews.slice(2, 4)"
                :key="index + 2"
                class="news-item"
            >
              <router-link :to="'/tin-tuc/' + item.slug" class="news-link">
                <div class="news-image-container">
                  <img
                      :src="item.thumbnail"
                      :alt="item.title"
                      class="news-image"
                  />
                  <div class="news-overlay" :style="{ background: config.newsOverlayGradient }"></div>
                </div>
                <div class="news-content">
                  <div class="news-tag" :style="{ background: config.tagGradient }">
                    <i :class="config.hotIcon" class="tag-icon"></i>
                    {{ config.newTagText }}
                  </div>
                  <h3 class="news-title">{{ item.title }}</h3>
                  <p class="news-summary">{{ item.summary }}</p>

                  <!-- Bổ sung thông tin lượt xem và ngày đăng -->
                  <div class="news-meta-info">
                    <div class="news-meta-left">
                      <p class="news-date">
                        <i :class="config.calendarIcon" class="meta-icon"></i>
                        {{ formatDate(item.createAt) }}
                      </p>
                      <p class="news-views">
                        <i class="fa-regular fa-eye"></i>
                        {{ formatViews(item.viewCount) }}
                      </p>
                    </div>
                  </div>

                  <div class="news-footer">
                    <button class="news-read-btn">
                      {{ config.readMoreText }}
                      <i :class="config.arrowRightIcon"></i>
                    </button>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from "../../../../api/api.js";

const router = useRouter()

const props = defineProps({
  content: Object,
});

// ==================== CONFIGURATION OBJECT ====================
// Người dùng có thể sửa các giá trị này mà không cần biết code
let config = {
  // Tiêu đề
  leftColumnTitle: "Giải pháp bán bất động sản",
  rightColumnTitle: "Tin tức",
  viewAllText: "Xem tất cả",
  readMoreText: "Xem thêm",

  // Liên kết
  newsLink: "/tin-tuc",

  // Tags
  newTagText: "Tin mới",
  hotTagText: "Tin nổi bật",

  // Màu sắc & Gradient
  primaryColor: "#031358",
  secondaryColor: "#0629BE",
  progressColor: "#031358",
  buttonGradient: "linear-gradient(to bottom, #031358, #0629BE)",
  tagGradient: "linear-gradient(135deg, #031358, #0629BE)",
  imageOverlayGradient: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
  newsOverlayGradient: "linear-gradient(to bottom, transparent 0%, rgba(3, 19, 88, 0.1) 100%)",

  // Icons (FontAwesome classes)
  arrowIcon: "fas fa-chevron-right",
  arrowRightIcon: "fas fa-arrow-right",
  calendarIcon: "far fa-calendar",
  userIcon: "far fa-user",
  eyeIcon: "far fa-eye", // Icon cho lượt xem
  newIcon: "fas fa-bolt",
  hotIcon: "fas fa-fire",
}

if(props.content) config = props.content.contentJson;
else console.log("News không có props lấy dữ liệu mặc định")

// ==================== DATA FROM API ====================
const featureNews = ref([])
const latestNews = ref([])

// ==================== API CALL ====================
const fetchNews = async () => {
  try {
    const response = await api.get('/thg/public/news/getNewsHome')
    if (response.data) {
      // Đảm bảo dữ liệu có viewCount và summary
      featureNews.value = (response.data.featureNews || []).map(news => ({
        ...news,
        viewCount: news.viewCount || 0,
        summary: news.summary || ''
      }))
      latestNews.value = (response.data.latestNews || []).map(news => ({
        ...news,
        viewCount: news.viewCount || 0,
        summary: news.summary || ''
      }))
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu tin tức:", error)
    // Giữ dữ liệu mặc định nếu API fail
    featureNews.value = [
      {
        title: "BẤT ĐỘNG SẢN THIÊN HÀ GROUP VINH DỰ ĐÓN NHẬN GIẢI THƯỞNG TOP 10 THƯƠNG HIỆU XUẤT SẮC CHÂU Á 2024",
        summary: "Thành tựu nổi bật của Thiên Hà Group trong năm 2024",
        createAt: "2024-10-12T00:00:00",
        employeeName: "Nguyễn Thanh Tùng",
        thumbnail: "/imgs/gp1.jpg",
        slug: "default-feature-1",
        viewCount: 1250
      },
      {
        title: "Giải pháp đầu tư bất động sản hiệu quả?",
        summary: "Các chiến lược đầu tư bất động sản thông minh",
        createAt: "2025-08-05T00:00:00",
        employeeName: "Lê Thị Hạnh",
        thumbnail: "/imgs/gp2.png",
        slug: "default-feature-2",
        viewCount: 980
      },
      {
        title: "Làm sao để bán nhanh bất động sản trong 30 ngày?",
        summary: "Bí quyết bán nhanh bất động sản với giá tốt",
        createAt: "2025-03-21T00:00:00",
        employeeName: "Phạm Văn Duy",
        thumbnail: "/imgs/gp3.jpg",
        slug: "default-feature-3",
        viewCount: 1560
      }
    ]
    latestNews.value = [
      {
        title: "Thị trường bất động sản phục hồi mạnh mẽ cuối năm 2025",
        summary: "Phân tích xu hướng thị trường bất động sản cuối năm",
        createAt: "2025-10-21T00:00:00",
        thumbnail: '/imgs/tt1.png',
        slug: "default-news-1",
        viewCount: 890
      },
      {
        title: "Người trẻ chuộng mua nhà sẵn nội thất thay vì tự xây",
        summary: "Xu hướng mua nhà của thế hệ trẻ hiện nay",
        createAt: "2025-10-15T00:00:00",
        thumbnail: "/imgs/tt2.jpg",
        slug: "default-news-2",
        viewCount: 1120
      },
      {
        title: "Bất động sản xanh – Xu hướng mới dẫn cuối năm 2025",
        summary: "Xu hướng bất động sản xanh và bền vững",
        createAt: "2025-10-19T00:00:00",
        thumbnail: "/imgs/tt3.png",
        slug: "default-news-3",
        viewCount: 750
      },
      {
        title: "Người trẻ chuộng mua nhà sẵn nội thất thay vì tự xây",
        summary: "Phân tích thị hiếu mua nhà của giới trẻ",
        createAt: "2025-10-14T00:00:00",
        thumbnail: "/imgs/tt4.png",
        slug: "default-news-4",
        viewCount: 940
      }
    ]
  }
}

// ==================== HELPER FUNCTIONS ====================
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Hàm định dạng lượt xem (thêm dấu phân cách hàng nghìn)
const formatViews = (views) => {
  if (!views && views !== 0) return '0'
  return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// ==================== PROGRESS BAR LOGIC ====================
const leftProgressActive = ref(false)
const rightProgressActive = ref(false)

const startProgress = (column) => {
  if (column === 'left') {
    leftProgressActive.value = true
  } else {
    rightProgressActive.value = true
  }
}

const stopProgress = (column) => {
  if (column === 'left') {
    leftProgressActive.value = false
  } else {
    rightProgressActive.value = false
  }
}

// ==================== LIFECYCLE HOOKS ====================
onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.solution-news-container {
  font-family: 'Ubuntu', sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  align-items: stretch;
}

.column {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 20px;
  color: v-bind('config.primaryColor');
  margin: 0;
}

.view-all-link {
  color: v-bind('config.primaryColor');
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.view-all-link:hover {
  text-decoration: underline;
}

.view-all-link i {
  font-size: 12px;
}

.progress-bar {
  width: 100%;
  height: 2px;
  background-color: #e2e8f0;
  position: relative;
  overflow: hidden;
  margin-bottom: 2rem;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  transition: width 0.3s ease-out;
}

.progress-active {
  width: 100%;
  transition: width 1s linear;
}

/* Link styles */
.solution-link,
.news-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

/* Left Column Styles */
.solution-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.solution-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  flex: 1;
  height: 100%;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  overflow: hidden;
}

.solution-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.solution-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  color: white;
  transition: transform 0.3s ease;
  z-index: 2;
}

.solution-title {
  font-size: 18px;
  margin: 0 0 0.5rem 0;
  transition: transform 0.3s ease;
  line-height: 1.4;
}

.solution-summary {
  font-size: 14px;
  margin: 0 0 1rem 0;
  opacity: 0.9;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.solution-meta {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.solution-meta p {
  margin: 0;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-icon {
  font-size: 12px;
  opacity: 0.8;
}

.view-more-btn {
  opacity: 0;
  transform: translateY(20px);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

/* Right Column Styles */
.news-grid {
  display: flex;
  gap: 1.5rem;
  flex: 1;
}

.news-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.news-item {
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 280px;
  height: 100%;
}

.news-image-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.news-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.news-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.news-tag {
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-self: flex-start;
  z-index: 2;
  position: relative;
}

.tag-icon {
  font-size: 10px;
}

.news-title {
  font-size: 16px;
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
  color: #333;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 0 0 auto;
}

.news-summary {
  font-size: 14px;
  margin: 0 0 1rem 0;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

/* News meta info (ngày đăng + lượt xem) */
.news-meta-info {
  margin-bottom: 1rem;
}

.news-meta-left {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.news-date, .news-views {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.news-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
}

.news-read-btn {
  background: transparent;
  color: v-bind('config.primaryColor');
  border: none;
  padding: 0.5rem 0;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.news-read-btn i {
  font-size: 12px;
  transition: transform 0.3s ease;
}

/* Left Column Hover Effects */
.solution-item:hover .solution-image {
  transform: scale(1.05);
}

.solution-item:hover .solution-content {
  transform: translateY(-10px);
}

.solution-item:hover .solution-title {
  transform: translateY(-10px);
}

.solution-item:hover .solution-meta,
.solution-item:hover .view-more-btn {
  opacity: 1;
  transform: translateY(0);
}

.solution-item:hover .view-more-btn {
  transition-delay: 0.1s;
}

.solution-item:hover .btn-icon {
  transform: translateX(3px);
}

/* Right Column Hover Effects */
.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(3, 19, 88, 0.15);
}

.news-item:hover .news-image {
  transform: scale(1.08);
}

.news-item:hover .news-read-btn {
  color: v-bind('config.secondaryColor');
}

.news-item:hover .news-read-btn i {
  transform: translateX(3px);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .news-image-container {
    height: 350px;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
    gap: 3rem;
  }

  .news-grid {
    flex-direction: column;
  }

  .news-item {
    min-height: 250px;
  }

  .news-image-container {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .view-all-link {
    align-self: flex-end;
  }

  .news-meta-left {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .news-footer {
    justify-content: flex-start;
  }

  .news-image-container {
    height: 250px;
  }
}

@media (max-width: 576px) {
  .solution-news-container {
    padding: 1rem 0.5rem;
  }

  .news-content {
    padding: 1.25rem;
  }

  .news-title {
    font-size: 15px;
  }

  .news-image-container {
    height: 200px;
  }

  .image-container {
    min-height: 180px;
  }
}
</style>