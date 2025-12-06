<template>
  <section class="related-posts">
    <h2 class="section-title fade-up">CÁC BÀI VIẾT LIÊN QUAN</h2>
    <div class="carousel-container">
      <div class="carousel" ref="carousel">
        <div
            v-for="(post, index) in posts"
            :key="index"
            class="post-card fade-up"
            @mouseenter="hoverIndex = index"
            @mouseleave="hoverIndex = -1"
        >
          <div class="image-container">
            <img :src="post.image" :alt="post.title" class="post-image" />
            <div class="date-badge">{{ post.date }}</div>
          </div>
          <div class="post-content">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <button class="read-more-btn" :class="{ 'hovered': hoverIndex === index }">
              Xem chi tiết
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.3335 8H12.6668" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 3.33331L12.6667 7.99998L8 12.6666" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress indicator with navigation buttons -->
    <div class="progress-container">
      <button class="carousel-btn prev" @click="scrollCarousel(-1)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="#031358" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="progress-bar">
        <div
            class="progress-fill"
            :style="{ width: scrollProgress + '%' }"
        ></div>
      </div>

      <button class="carousel-btn next" @click="scrollCarousel(1)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="#031358" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// State
const carousel = ref(null)
const hoverIndex = ref(-1)
const scrollProgress = ref(0)
const currentSlide = ref(1)
const totalSlides = ref(0)
const getImgUrl =(filename, tag) => {
  if(tag) return "/imgs/"+ filename + tag;
  return "/imgs/"+ filename;
}
// Sample data for real estate recruitment posts
const posts = ref([
  {
    title: "Tuyển Dụng Chuyên Viên Tư Vấn Bất Động Sản Cao Cấp",
    excerpt: "Tìm kiếm ứng viên có kinh nghiệm trong lĩnh vực BĐS cao cấp, khả năng giao tiếp tốt và am hiểu thị trường.",
    image: getImgUrl("hr1",".jpg"),
    date: "15/10/2023"
  },
  {
    title: "Cơ Hội Nghề Nghiệp: Quản Lý Dự Án Bất Động Sản",
    excerpt: "Vị trí quản lý dự án yêu cầu kinh nghiệm 3+ năm, kỹ năng lãnh đạo và kiến thức chuyên sâu về pháp lý BĐS.",
    image: getImgUrl("hr2",".jpg"),
    date: "12/10/2023"
  },
  {
    title: "Tuyển Gấp Nhân Viên Kinh Doanh Bất Động Sản",
    excerpt: "Công ty mở rộng quy mô, cần tuyển nhân viên kinh doanh có đam mê, năng động và mong muốn thu nhập cao.",
    image: getImgUrl("hr3",".png"),
    date: "10/10/2023"
  },
  {
    title: "Chuyên Viên Pháp Lý Bất Động Sản - Mức Lương Hấp Dẫn",
    excerpt: "Tìm kiếm chuyên viên pháp lý có kinh nghiệm xử lý hồ sơ, hợp đồng và các vấn đề pháp lý liên quan đến BĐS.",
    image: getImgUrl("hr4",".jpg"),
    date: "08/10/2023"
  },
  {
    title: "Trưởng Phòng Kinh Doanh Bất Động Sản Thương Mại",
    excerpt: "Vị trí lãnh đạo đội ngũ kinh doanh BĐS thương mại, yêu cầu kinh nghiệm quản lý và thành tích bán hàng ấn tượng.",
    image: getImgUrl("hr5",".jpg"),
    date: "05/10/2023"
  },
  {
    title: "Nhân Viên Marketing Bất Động Sản - Môi Trường Năng Động",
    excerpt: "Tuyển dụng chuyên viên marketing có kinh nghiệm trong ngành BĐS, sáng tạo và am hiểu digital marketing.",
    image: getImgUrl("hr6",".jpg"),
    date: "01/10/2023"
  },
  {
    title: "Tuyển Dụng Chuyên Viên Tư Vấn Bất Động Sản Cao Cấp",
    excerpt: "Tìm kiếm ứng viên có kinh nghiệm trong lĩnh vực BĐS cao cấp, khả năng giao tiếp tốt và am hiểu thị trường.",
    image: getImgUrl("hr1",".jpg"),
    date: "15/10/2023"
  },
  {
    title: "Cơ Hội Nghề Nghiệp: Quản Lý Dự Án Bất Động Sản",
    excerpt: "Vị trí quản lý dự án yêu cầu kinh nghiệm 3+ năm, kỹ năng lãnh đạo và kiến thức chuyên sâu về pháp lý BĐS.",
    image: getImgUrl("hr2",".jpg"),
    date: "12/10/2023"
  },
  {
    title: "Tuyển Gấp Nhân Viên Kinh Doanh Bất Động Sản",
    excerpt: "Công ty mở rộng quy mô, cần tuyển nhân viên kinh doanh có đam mê, năng động và mong muốn thu nhập cao.",
    image: getImgUrl("hr3",".png"),
    date: "10/10/2023"
  },
  {
    title: "Chuyên Viên Pháp Lý Bất Động Sản - Mức Lương Hấp Dẫn",
    excerpt: "Tìm kiếm chuyên viên pháp lý có kinh nghiệm xử lý hồ sơ, hợp đồng và các vấn đề pháp lý liên quan đến BĐS.",
    image: getImgUrl("hr4",".jpg"),
    date: "08/10/2023"
  },
  {
    title: "Trưởng Phòng Kinh Doanh Bất Động Sản Thương Mại",
    excerpt: "Vị trí lãnh đạo đội ngũ kinh doanh BĐS thương mại, yêu cầu kinh nghiệm quản lý và thành tích bán hàng ấn tượng.",
    image: getImgUrl("hr5",".jpg"),
    date: "05/10/2023"
  },
  {
    title: "Nhân Viên Marketing Bất Động Sản - Môi Trường Năng Động",
    excerpt: "Tuyển dụng chuyên viên marketing có kinh nghiệm trong ngành BĐS, sáng tạo và am hiểu digital marketing.",
    image: getImgUrl("hr6",".jpg"),
    date: "01/10/2023"
  }
])

// Update progress and current slide
const updateProgress = () => {
  if (!carousel.value) return

  const scrollLeft = carousel.value.scrollLeft
  const scrollWidth = carousel.value.scrollWidth - carousel.value.clientWidth

  if (scrollWidth > 0) {
    scrollProgress.value = (scrollLeft / scrollWidth) * 100
  } else {
    scrollProgress.value = 0
  }

  // Calculate current slide based on scroll position
  const cardWidth = 320 // Width of each card including gap
  const slidePosition = Math.round(scrollLeft / cardWidth) + 1
  currentSlide.value = Math.min(slidePosition, posts.value.length)
}

// Carousel navigation
const scrollCarousel = (direction) => {
  if (carousel.value) {
    const cardWidth = 320 // Width of each card including margin
    const scrollAmount = cardWidth * direction
    carousel.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })

    // Update progress after scroll animation
    setTimeout(updateProgress, 300)
  }
}

// Initialize
onMounted(() => {
  if (carousel.value) {
    carousel.value.addEventListener('scroll', updateProgress)
    totalSlides.value = posts.value.length
    updateProgress() // Initial progress calculation
  }
})

onUnmounted(() => {
  if (carousel.value) {
    carousel.value.removeEventListener('scroll', updateProgress)
  }
})
</script>

<style scoped>

* {
  font-family: 'Ubuntu', sans-serif;
  box-sizing: border-box;
}

.related-posts {
  padding: 60px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: 40px;
  color: #031358;
  margin-bottom: 40px;
  text-align: center;
  font-weight: 700;
}

.carousel-container {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 20px;
  padding: 10px 0;
  scrollbar-width: none; /* Firefox */
  width: 100%;
}

.carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

/* FIX: Đảm bảo post-card có width cố định */
.post-card {
  width: 400px; /* Thay min-width bằng width cố định */
  flex: 0 0 auto; /* Quan trọng: không cho phép co giãn */
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(3, 19, 88, 0.15);
}

.image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.post-card:hover .post-image {
  transform: scale(1.05);
}

.date-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #031358;
  font-weight: 500;
}

.post-content {
  padding: 20px;
}

.post-title {
  font-size: 20px;
  color: #031358;
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 1.3;
}

.post-excerpt {
  font-size: 17px;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.5;
}

.read-more-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #031358;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.read-more-btn.hovered {
  background: #0030FF;
  transform: translateX(5px);
}

/* Progress indicator with navigation buttons */
.progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #031358, #0030FF);
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 2px;
  background: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

/* Updated carousel buttons - smaller and positioned around progress bar */
.carousel-btn {
  background: white;
  border: 2px solid #031358;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.carousel-btn:hover {
  background: #031358;
}

.carousel-btn:hover svg path {
  stroke: white;
}

/* Responsive design */
@media (max-width: 768px) {
  .section-title {
    font-size: 32px;
  }

  .post-card {
    width: 280px; /* Điều chỉnh width cho mobile */
  }

  .progress-container {
    gap: 12px;
    max-width: 300px;
  }

  .carousel-btn {
    width: 32px;
    height: 32px;
  }

  .carousel-btn svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 28px;
  }

  .post-card {
    width: 260px; /* Điều chỉnh width cho mobile nhỏ */
  }

  .post-title {
    font-size: 18px;
  }

  .post-excerpt {
    font-size: 16px;
  }

  .progress-container {
    gap: 10px;
    max-width: 250px;
  }

  .progress-bar {
    height: 4px;
  }

  .carousel-btn {
    width: 28px;
    height: 28px;
  }

  .carousel-btn svg {
    width: 12px;
    height: 12px;
  }
}
</style>