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
              v-for="(item, index) in config.solutionItems"
              :key="index"
              class="solution-item"
          >
            <div class="image-container">
              <img
                  :src="baseImgaeUrl+item.image"
                  :alt="item.title"
                  class="solution-image"
              />
              <div class="image-overlay" :style="{ background: config.imageOverlayGradient }"></div>
            </div>

            <div class="solution-content">
              <h3 class="solution-title">{{ item.title }}</h3>

              <div class="solution-meta">
                <p class="posted-date">
                  <i :class="config.calendarIcon" class="meta-icon"></i>
                  Posted on: {{ item.postedDate }}
                </p>
                <p class="author">
                  <i :class="config.userIcon" class="meta-icon"></i>
                  By: {{ item.author }}
                </p>
              </div>

              <button class="view-more-btn" :style="{ background: config.buttonGradient }">
                {{ config.readMoreText }}
                <i :class="config.arrowRightIcon" class="btn-icon"></i>
              </button>
            </div>
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
                v-for="(item, index) in config.newsItems.slice(0, 2)"
                :key="index"
                class="news-item"
            >
              <div class="news-image-container">
                <img
                    :src="baseImgaeUrl+item.image"
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
                <div class="news-footer">
                  <p class="news-date">
                    <i :class="config.calendarIcon" class="meta-icon"></i>
                    {{ item.postedDate }}
                  </p>
                  <button class="news-read-btn">
                    {{ config.readMoreText }}
                    <i :class="config.arrowRightIcon"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="news-column">
            <div
                v-for="(item, index) in config.newsItems.slice(2, 4)"
                :key="index + 2"
                class="news-item"
            >
              <div class="news-image-container">
                <img
                    :src="baseImgaeUrl+ item.image"
                    :alt="item.title"
                    class="news-image"
                />
                <div class="news-overlay" :style="{ background: config.newsOverlayGradient }"></div>
              </div>
              <div class="news-content">
                <div class="news-tag" :style="{ background: config.tagGradient }">
                  <i :class="config.hotIcon" class="tag-icon"></i>
                  {{ config.hotTagText }}
                </div>
                <h3 class="news-title">{{ item.title }}</h3>
                <div class="news-footer">
                  <p class="news-date">
                    <i :class="config.calendarIcon" class="meta-icon"></i>
                    {{ item.postedDate }}
                  </p>
                  <button class="news-read-btn">
                    {{ config.readMoreText }}
                    <i :class="config.arrowRightIcon"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

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
  newIcon: "fas fa-bolt",
  hotIcon: "fas fa-fire",

  // Dữ liệu giải pháp
  solutionItems: [
    {
      title: "BẤT ĐỘNG SẢN THIÊN HÀ GROUP VINH DỰ ĐÓN NHẬN GIẢI THƯỞNG TOP 10 THƯƠNG HIỆU XUẤT SẮC CHÂU Á 2024",
      postedDate: "12/10/2024",
      author: "Nguyễn Thanh Tùng",
      image: "/imgs/gp1.jpg"
    },
    {
      title: "Giải pháp đầu tư bất động sản hiệu quả?",
      postedDate: "05/08/2025",
      author: "Lê Thị Hạnh",
      image: "/imgs/gp2.png"
    },
    {
      title: "Làm sao để bán nhanh bất động sản trong 30 ngày?",
      postedDate: "21/03/2025",
      author: "Phạm Văn Duy",
      image: "/imgs/gp3.jpg"
    }
  ],

  // Dữ liệu tin tức
  newsItems: [
    {
      title: "Thị trường bất động sản phục hồi mạnh mẽ cuối năm 2025",
      postedDate: "21/10/2025",
      image: '/imgs/tt1.png'
    },
    {
      title: "Người trẻ chuộng mua nhà sẵn nội thất thay vì tự xây",
      postedDate: "15/10/2025",
      image: "/imgs/tt2.jpg"
    },
    {
      title: "Bất động sản xanh – Xu hướng mới dẫn cuối năm 2025",
      postedDate: "19/10/2025",
      image: "/imgs/tt3.png"
    },
    {
      title: "Người trẻ chuộng mua nhà sẵn nội thất thay vì tự xây",
      postedDate: "14/10/2025",
      image: "/imgs/tt4.png"
    }
  ]
}
if(props.content) config = props.content.contentJson;
else console.log("News không có props lấy dữ liệu mặc định")
// console.log(JSON.stringify(config));

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
  margin: 0 0 1rem 0;
  transition: transform 0.3s ease;
  line-height: 1.4;
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
  margin: 0 0 1rem 0;
  line-height: 1.5;
  color: #333;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.news-date {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

  .news-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .news-read-btn {
    align-self: flex-end;
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