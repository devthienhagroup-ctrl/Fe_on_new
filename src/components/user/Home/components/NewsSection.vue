<template>
  <div class="solution-news-container">
    <div class="content-wrapper">
      <!-- Left Column - Giải pháp bán bất động sản -->
      <div class="column left-column" @mouseenter="startProgress('left')" @mouseleave="stopProgress('left')">
        <div class="section-header">
          <h2 class="section-title">Giải pháp bán bất động sản</h2>
          <a href="#" class="view-all-link">Xem tất cả &gt;&gt;</a>
        </div>
        <div class="progress-bar">
          <div
              class="progress-fill"
              :class="{ 'progress-active': leftProgressActive }"
          ></div>
        </div>

        <div class="solution-items">
          <div
              v-for="(item, index) in solutionItems"
              :key="index"
              class="solution-item"
          >
            <div class="image-container">
              <!-- Replace with actual image path -->
              <img
                  :src="item.image"
                  :alt="item.title"
                  class="solution-image"
              />
              <div class="image-overlay"></div>
            </div>

            <div class="solution-content">
              <h3 class="solution-title">{{ item.title }}</h3>

              <div class="solution-meta">
                <p class="posted-date">Posted on: {{ item.postedDate }}</p>
                <p class="author">By: {{ item.author }}</p>
              </div>

              <button class="view-more-btn">Xem thêm</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Tin tức -->
      <div class="column right-column" @mouseenter="startProgress('right')" @mouseleave="stopProgress('right')">
        <div class="section-header">
          <h2 class="section-title">Tin tức</h2>
          <a href="/tin-tuc" class="view-all-link">Xem tất cả &gt;&gt;</a>
        </div>
        <div class="progress-bar">
          <div
              class="progress-fill"
              :class="{ 'progress-active': rightProgressActive }"
          ></div>
        </div>

        <div class="news-grid">
          <div class="news-column">
            <div
                v-for="(item, index) in newsItems.slice(0, 2)"
                :key="index"
                class="news-item"
            >
              <div class="news-image-container">
                <!-- Replace with actual image path -->
                <img
                    :src="item.image"
                    :alt="item.title"
                    class="news-image"
                />
                <div class="news-overlay"></div>
              </div>
              <div class="news-content">
                <div class="news-tag">Tin mới</div>
                <h3 class="news-title">{{ item.title }}</h3>
                <div class="news-footer">
                  <p class="news-date">{{ item.postedDate }}</p>
                  <button class="news-read-btn">Đọc tiếp →</button>
                </div>
              </div>
            </div>
          </div>

          <div class="news-column">
            <div
                v-for="(item, index) in newsItems.slice(2, 4)"
                :key="index + 2"
                class="news-item"
            >
              <div class="news-image-container">
                <!-- Replace with actual image path -->
                <img
                    :src="item.image"
                    :alt="item.title"
                    class="news-image"
                />
                <div class="news-overlay"></div>
              </div>
              <div class="news-content">
                <div class="news-tag">Tin nổi bật</div>
                <h3 class="news-title">{{ item.title }}</h3>
                <div class="news-footer">
                  <p class="news-date">{{ item.postedDate }}</p>
                  <button class="news-read-btn">Đọc tiếp →</button>
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

// Progress bar state
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

// Solution items data
const solutionItems = [
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
]

// News items data
const newsItems = [
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
  align-items: stretch; /* Đảm bảo 2 cột cao bằng nhau */
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
  color: #031358;
  margin: 0;
}

.view-all-link {
  color: #031358;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.view-all-link:hover {
  text-decoration: underline;
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
  background-color: #031358;
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
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
}

.solution-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  color: white;
  transition: transform 0.3s ease;
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
}

.solution-meta p {
  margin: 0.25rem 0;
  font-size: 14px;
}

.view-more-btn {
  opacity: 0;
  transform: translateY(20px);
  background: linear-gradient(to bottom, #031358, #0629BE);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
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

/* Right Column Styles - Đã cải thiện */
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
  min-height: 280px; /* Đảm bảo chiều cao tối thiểu */
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
  background: linear-gradient(to bottom, transparent 0%, rgba(3, 19, 88, 0.1) 100%);
}

.news-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.news-tag {
  background: linear-gradient(135deg, #031358, #0629BE);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 1rem;
  align-self: flex-start;
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
}

.news-read-btn {
  background: transparent;
  color: #031358;
  border: none;
  padding: 0.5rem 0;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.news-read-btn:hover {
  color: #0629BE;
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
  color: #0629BE;
  transform: translateX(3px);
}

/* Responsive Design */
@media (max-width: 1200px) {

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
    height: 140px;
  }
}
</style>