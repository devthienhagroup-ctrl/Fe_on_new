<template>
  <div class="news-container">
    <div class="news-layout">
      <!-- Cột trái (66.67%) -->
      <div class="left-column">
        <!-- Thanh danh mục -->
        <div class="categories-container">
          <div class="categories-wrapper">
            <button class="nav-arrow nav-arrow-left" @click="scrollCategories(-1)"   v-if="showArrows">
              <svg data-v-b4c27b63="" width="24" height="24" viewBox="0 0 24 24" fill="none"><path data-v-b4c27b63="" d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>

            <nav class="categories-nav" ref="categoriesNav">
              <div
                  v-for="(category, index) in categories"
                  :key="index"
                  class="category-item"
                  :class="{ active: index === activeCategoryIndex }"
              >
                {{ category }}
              </div>
            </nav>

            <button class="nav-arrow nav-arrow-right" @click="scrollCategories(1)"   v-if="showArrows">
              <svg data-v-b4c27b63="" width="24" height="24" viewBox="0 0 24 24" fill="none"><path data-v-b4c27b63="" d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>
          </div>
          <div class="nav-divider"></div>
        </div>

        <!-- Danh sách tin tức -->
        <div class="news-list">
          <div
              v-for="(news, index) in newsList"
              :key="index"
              class="news-item"
          >
            <div class="news-image">
              <img :src="news.image" :alt="news.title">
            </div>
            <div class="news-content">
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-subtitle">{{ news.subtitle }}</p>
              <span class="news-date">{{ news.date }}</span>
            </div>
            <div class="news-divider"></div>
          </div>
        </div>

        <!-- Phân trang -->
        <div class="pagination">
          <button class="page-btn"><i class="fa-solid fa-arrow-left"></i></button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>

      <!-- Cột phải (33.33%) -->
      <div class="right-column">
        <!-- Thanh tìm kiếm -->
        <div class="search-container">
          <div class="search-box">
            <input
                type="text"
                placeholder="Nhập từ khóa để tìm kiếm"
                class="search-input"
            >
            <button class="search-btn">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        <!-- Box "Đã xem gần đây" -->
        <div class="recently-viewed">
          <h3 class="recently-viewed-title">Đã xem gần đây</h3>
          <div class="recently-viewed-list">
            <div
                v-for="(news, index) in recentlyViewed"
                :key="index"
                class="recently-viewed-item"
            >
              <div class="recently-viewed-image">
                <img :src="news.image" :alt="news.title">
              </div>
              <div class="recently-viewed-content">
                <h4 class="recently-viewed-title-item">{{ news.title }}</h4>
                <span class="recently-viewed-date">{{ news.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Refs
const categoriesNav = ref(null)

// Dữ liệu danh mục
const categories = ref([
  'Tất cả',
  'Thời sự',
  'Kinh tế',
  'Xã hội',
  'Giáo dục',
  'Khoa học',
  'Công nghệ',
  'Thể thao',
  'Giải trí',
  'Văn hóa',
  'Du lịch',
  'Sức khỏe',
  'Pháp luật',
  'Đời sống',
  'Công nghệ mới'
])

// Dữ liệu danh sách tin tức
const newsList = ref([
  {
    title: "Bất động sản Thiên Hà Group vinh dự đón nhận giải thưởng top 10 thương hiệu xuất sắc châu á 2024",
    subtitle: "Giải thưởng danh giá này là minh chứng cho nỗ lực không ngừng của Thiên Hà Group trong việc phát triển các dự án bền vững, mang lại giá trị thật cho khách hàng và đóng góp tích cực cho sự phát triển của ngành bất động sản Việt Nam....",
    category: "Tin tức | Hoạt động",
    date: "12/11/2024",
    image: "/imgs/hd6.jpg"
  },
  {
    title: "Thị trường bất động sản phục hồi mạnh mẽ cuối năm 2025",
    subtitle: "Sau giai đoạn trầm lắng, thị trường đang ghi nhận tín hiệu tích cực với sự quay trở lại của dòng vốn đầu tư và nhu cầu nhà ở tăng cao......",
    category: "Giải pháp Bất động sản",
    date: "12/10/2024",
    image: "/imgs/bannhanhbds.png"
  },
  {
    title: "Dòng tiền đầu tư quay lại bất động sản: Cơ hội vàng cho DN Việt",
    subtitle: "Các chính sách hỗ trợ, cùng tín hiệu tích cực từ thị trường tài chính, đang mở ra giai đoạn tăng trưởng mới cho ngành bất động sản trong nước....",
    category: "Đăng tin Bất động sản",
    date: "12/10/2024",
    image: "/imgs/bannhanhbds.png"
  },
  {
    title: "Người trẻ chuộng mua nhà sẵn nội thất thay vì tự xây",
    subtitle: "Xu hướng 'sống tiện nghi ngay khi nhận nhà' đang được thế hệ trẻ ưa chuộng. Các dự án căn hộ bàn giao hoàn thiện nội thất trở thành....",
    category: "Định giá Bất động sản",
    date: "12/10/2024",
    image: "/imgs/bannhanhbds.png"
  },
  {
    title: "Bất động sản xanh – Xu hướng mới dẫn đầu cuối năm 2025",
    subtitle: "Mô hình đô thị xanh, thân thiện môi trường đang trở thành lựa chọn hàng đầu của người mua nhà....",
    category: "Bất động sản",
    date: "12/10/2024",
    image: "/imgs/bannhanhbds.png"
  }
])

// Dữ liệu tin đã xem gần đây
const recentlyViewed = ref([
  {
    title: 'Công nghệ AI đang thay đổi ngành công nghiệp như thế nào',
    date: '15/10/2023',
    image: 'https://picsum.photos/300/200?random=1'
  },
  {
    title: 'Xu hướng du lịch bền vững năm 2023',
    date: '14/10/2023',
    image: 'https://picsum.photos/300/200?random=2'
  },
  {
    title: 'Thị trường chứng khoán có dấu hiệu phục hồi',
    date: '13/10/2023',
    image: 'https://picsum.photos/300/200?random=3'
  }
])

// Danh mục đang chọn
const activeCategoryIndex = ref(0)

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
  // Nếu nội dung không vượt quá chiều rộng => không cần nút
  showArrows.value = el.scrollWidth > el.clientWidth
}

onMounted(() => {
  checkScrollButtons()
  window.addEventListener('resize', checkScrollButtons)
})
</script>

<style scoped>

 .news-container {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Ubuntu', sans-serif;
}

.news-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

.news-layout {
  display: flex;
  gap: 30px;
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
  gap: 25px;
  padding-bottom: 10px;
  width: 100%;
  scrollbar-width: none; /* Ẩn scrollbar trên Firefox */
  -ms-overflow-style: none; /* Ẩn scrollbar trên IE và Edge */
}

/* Ẩn scrollbar trên Webkit browsers (Chrome, Safari) */
.categories-nav::-webkit-scrollbar {
  display: none;
}

.nav-arrow {
  width: 40px;
  height: 40px;
  border: 2px solid #031358;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #031358;
  font-size: 16px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  z-index: 2;
}

.nav-arrow:hover {
  background: #031358;
  color: white;
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
  font-size: 20px;
  font-weight: 700;
  color: #031358;
  white-space: nowrap;
  cursor: pointer;
  padding-bottom: 10px;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;
}

.category-item.active {
  color: #0030FF;
  border-bottom: 3px solid #0030FF;
}

.category-item:hover {
  color: #0030FF;
}

.nav-divider {
  height: 3px;
  background-color: #e0e0e0;
  width: 100%;
  margin-top: -3px;
}

/* Danh sách tin tức */
.news-list {
  margin-bottom: 30px;
  width: 100%;
}

.news-item {
  display: flex;
  padding: 20px 0;
  position: relative;
  width: 100%;
}

.news-image {
  width: 33%;
  margin-right: 20px;
  flex-shrink: 0;
}

.news-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.news-content {
  flex: 1;
  width: 67%;
}

.news-title {
  font-size: 20px;
  font-weight: 700;
  color: #031358;
  margin-bottom: 10px;
  line-height: 1.3;
}

.news-subtitle {
  font-size: 15px;
  color: #6B7280;
  margin-bottom: 10px;
  line-height: 1.5;
}

.news-date {
  font-size: 14px;
  color: #9CA3AF;
}

.news-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
}

/* Phân trang */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

.page-btn {
  padding: 8px 15px;
  border: 1px solid #031358;
  background-color: white;
  color: #031358;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.page-btn.active {
  background-color: #031358;
  color: white;
}

.page-btn:hover {
  background-color: #f0f0f0;
}

.page-btn.active:hover {
  background-color: #031358;
}

/* Thanh tìm kiếm */
.search-container {
  margin-bottom: 30px;
  width: 100%;
}

.search-box {
  display: flex;
  border: 1px solid #031358;
  border-radius: 4px;
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
  color: #9CA3AF;
}

.search-btn {
  padding: 10px 15px;
  background-color: #031358;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}

.search-btn:hover {
  background-color: #0030FF;
}

/* Box "Đã xem gần đây" */
.recently-viewed {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
}

.recently-viewed-title {
  font-size: 33px;
  font-weight: 700;
  color: #031358;
  margin-bottom: 20px;
  line-height: 1.2;
}

.recently-viewed-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.recently-viewed-item {
  display: flex;
  gap: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
}

.recently-viewed-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.recently-viewed-image {
  width: 80px;
  flex-shrink: 0;
}

.recently-viewed-image img {
  width: 100%;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.recently-viewed-content {
  flex: 1;
  width: calc(100% - 95px);
}

.recently-viewed-title-item {
  font-size: 18px;
  font-weight: 700;
  color: #031358;
  margin-bottom: 5px;
  line-height: 1.3;
}

.recently-viewed-date {
  font-size: 14px;
  color: #9CA3AF;
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