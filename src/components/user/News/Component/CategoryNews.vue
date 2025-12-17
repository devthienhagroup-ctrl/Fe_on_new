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
                  v-for="(category, index) in categories"
                  :key="index"
                  class="category-item"
                  :class="{ active: index === activeCategoryIndex }"
                  :style="{
                    color: index === activeCategoryIndex ? config.colors.active : config.colors.primary
                  }"
              >
                {{ category }}
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
          <button
              class="page-btn"
              :style="{
              borderColor: config.colors.primary,
              color: config.colors.primary
            }"
          >
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button
              class="page-btn active"
              :style="{
              backgroundColor: config.colors.primary,
              color: config.colors.white
            }"
          >
            1
          </button>
          <button
              class="page-btn"
              :style="{
              borderColor: config.colors.primary,
              color: config.colors.primary
            }"
          >
            2
          </button>
          <button
              class="page-btn"
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
                placeholder="Nhập từ khóa để tìm kiếm"
                class="search-input"
            >
            <button
                class="search-btn"
                :style="{ backgroundColor: config.colors.primary }"
            >
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>

        <!-- Box "Đã xem gần đây" -->
        <div
            class="recently-viewed"
            :style="{ boxShadow: config.shadows.default }"
        >
          <h3 class="recently-viewed-title">{{ config.sections.recentlyViewed.title }}</h3>
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
import { ref, onMounted, computed } from 'vue'

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
  sectionData: Object
})

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã nhận props", config)
}

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
  scrollbar-width: none; /* Ẩn scrollbar trên Firefox */
  -ms-overflow-style: none; /* Ẩn scrollbar trên IE và Edge */
}

/* Ẩn scrollbar trên Webkit browsers (Chrome, Safari) */
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
  height: v-bind('config.sizes.newsImageHeight');
  object-fit: cover;
  border-radius: v-bind('config.borders.radius.medium');
}

.news-content {
  flex: 1;
  width: 67%;
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
}

.news-date {
  font-size: v-bind('config.typography.sizes.date');
  color: v-bind('config.colors.text.light');
}

.news-divider {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: v-bind('config.borders.width.divider');
  background-color: v-bind('config.colors.border');
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
  border: 1px solid v-bind('config.colors.primary');
  background-color: white;
  color: v-bind('config.colors.primary');
  border-radius: v-bind('config.borders.radius.small');
  cursor: pointer;
  font-weight: v-bind('config.typography.weights.medium');
  transition: v-bind('config.transitions.default');
}

.page-btn.active {
  background-color: v-bind('config.colors.primary');
  color: v-bind('config.colors.white');
}

.page-btn:hover {
  background-color: v-bind('config.colors.background.hover');
}

.page-btn.active:hover {
  background-color: v-bind('config.colors.primary');
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
  padding-bottom: 15px;
  border-bottom: v-bind('config.borders.width.divider') solid v-bind('config.colors.border');
  width: 100%;
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