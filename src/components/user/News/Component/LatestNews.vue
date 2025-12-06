<template>
  <div class="news-section">
    <h2 class="section-title">TIN TỨC MỚI NHẤT</h2>
    <div class="divider"></div>

    <div class="carousel-wrapper">
      <div class="carousel" ref="carouselRef" @scroll="updateProgress">
        <div v-for="(item, index) in newsArticles" :key="index" class="news-item">
          <div class="image-wrapper">
            <img :src="item.image" :alt="item.title" class="news-image" />
            <span class="date-label">{{ item.date }}</span>
          </div>

          <div class="info">
            <h3 class="news-title">{{ item.title }}</h3>
            <span class="category">{{ item.category }}</span>
          </div>
        </div>
      </div>

      <div class="carousel-controls">
        <button class="control-btn prev" @click="scrollCarousel(-1)" aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="control-btn next" @click="scrollCarousel(1)" aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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

    // Kiểm tra xem đã cuộn đến cuối chưa
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
      // Quay lại đầu
      el.scrollTo({
        left: 0,
        behavior: 'smooth'
      })
    } else {
      // Cuộn tiếp
      scrollCarousel(1)
    }
  }, 5000) // Cuộn tự động mỗi 5 giây
}

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
}

onMounted(() => {
  // Bắt đầu tự động cuộn sau khi component được mount
  startAutoScroll()

  // Dừng tự động cuộn khi hover vào carousel
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
  font-family: 'Ubuntu', sans-serif;
  padding: 60px 20px;
  background: linear-gradient(135deg,
  #0629BE 7%,
  #031358 22%,
  #0629BE 56%,
  #031358 81%,
  #0628B9 100%);
  text-align: center;
  color: white;
  position: relative;
}

.section-title {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.divider {
  width: 50%;
  height: 1px;
  background: white;
  margin: 0 auto 40px auto;
  opacity: 0.7;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.carousel-wrapper {
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  position: relative;
}

.carousel {
  display: flex;
  gap: 30px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 20px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.news-item {
  width: 500px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
}

.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
}

.news-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: 0.35s ease;
  display: block;
}

.date-label {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 6px 10px;
  border-radius: 6px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

.news-item:hover .news-image {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4);
}

.info {
  margin-top: 12px;
  text-align: left;
  padding: 0 5px;
}

.news-title {
  color: #031358;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category {
  display: inline-block;
  margin-top: 6px;
  font-size: 14px;
  color: #031358;
  font-weight: 500;
  padding: 4px 10px;
  background: rgba(3, 19, 88, 0.1);
  border-radius: 20px;
  position: absolute;
  bottom: 5px ;
  right: 5px;
}

.carousel-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #031358;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.control-btn:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.control-btn:active {
  transform: scale(0.95);
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: white;
  border-radius: 10px;
  transition: width 0.2s ease;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

/* Responsive design */
@media (max-width: 768px) {
  .news-section {
    padding: 40px 15px;
  }

  .section-title {
    font-size: 32px;
  }

  .divider {
    width: 70%;
  }

  .carousel {
    gap: 20px;
    padding: 10px;
  }

  .news-item {
    min-width: 280px;
  }

  .news-title {
    font-size: 18px;
  }

  .control-btn {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 28px;
  }

  .news-item {
    min-width: 260px;
  }

  .news-image {
    height: 180px;
  }
}
</style>