<template>
  <section class="success-sales-section" :class="{ 'no-scroll': lightboxVisible }">
    <div class="ellipse-bg"></div>
    <div class="container">
      <!-- Phần elip trên cùng -->
      <div class="ellipse-section">
        <div class="section-header">
          <h2 class="section-title">{{ cmsConfig.title }}</h2>
          <p class="section-subtitle">{{ cmsConfig.subtitle }}</p>
        </div>

        <div class="stats-overview">
          <div class="stat-card" v-for="(stat, index) in cmsConfig.stats" :key="stat.title" :id="'stat'+index">
            <div class="stat-icon"><i :class="stat.icon"></i></div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
          </div>
        </div>
      </div>

      <!-- Phần dự án -->
      <h2 class="project-title">{{ cmsConfig.projectsTitle }}</h2>

      <div class="projects-grid" :style="{ 'grid-template-columns': `repeat(${cmsConfig.columns}, 1fr)` }">
        <div
            class="project-card"
            v-for="project in projectsWithIndex"
            :key="project.name"
            @mouseenter="hoverProject = project.name"
            @mouseleave="hoverProject = null"
            @click="openLightbox(project)"

        >
          <div class="project-image">
            <img
                class="main-image"
                :src="getImageUrl(getCurrentImage(project).src)"
                :alt="project.name"
            />
            <img class="sold-badge" :src="baseImgaeUrl + cmsConfig.soldBadgeImage" :alt="cmsConfig.soldBadgeText">

            <!-- Navigation buttons -->
            <div class="image-nav-buttons" v-if="hoverProject === project.name && project.images.length > 1">
              <button class="nav-btn prev-btn" @click.stop="prevImage(project)">
                <i :class="cmsConfig.prevButtonIcon"></i>
              </button>
              <button class="nav-btn next-btn" @click.stop="nextImage(project)">
                <i :class="cmsConfig.nextButtonIcon"></i>
              </button>
            </div>

            <div class="image-overlay" :class="{ active: hoverProject === project.name }"></div>
          </div>

          <div class="project-info">
            <h3 class="project-name">{{ project.name }}</h3>
            <p class="project-location">{{ project.service }}</p>

            <div class="project-details">
              <div class="detail-item">
                <span class="detail-label">{{ cmsConfig.priceLabel }}:</span>
                <span class="detail-value">{{ getPrice(project.price) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">{{ cmsConfig.viewCountLabel }}:</span>
                <span class="detail-value">{{ project.viewCount }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">{{ cmsConfig.offerCountLabel }}:</span>
                <span class="detail-value">{{ project.offerCount }}</span>
              </div>
            </div>

            <div class="progress-info">
              <div class="progress-label">{{ cmsConfig.interestLevelLabel }}</div>
              <div class="progress-bar">
                <div
                    class="progress-fill"
                    :style="{ width: calculateInterestLevel(project) + '%' }"
                ></div>
              </div>
              <div class="progress-percent">{{ calculateInterestLevel(project) }}%</div>
            </div>

            <!-- Nút xem chi tiết -->
            <button class="detail-button" @click="viewDetails(project)">
              {{ cmsConfig.detailButtonText }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Overlay -->
    <div class="lightbox-overlay" v-if="lightboxVisible" @click="closeLightbox">
      <div class="lightbox-container" @click.stop>
        <!-- Nút đóng -->
        <button class="lightbox-close" @click="closeLightbox">
          <i :class="cmsConfig.closeButtonIcon"></i>
        </button>

        <!-- Ảnh lớn -->
        <div class="lightbox-image-container">
          <img
              class="lightbox-image"
              :src="getImageUrl(getCurrentImage(lightboxProject).src)"
              :alt="lightboxProject.name"
          />
        </div>

        <!-- Nút điều hướng -->
        <button class="lightbox-nav lightbox-prev" @click="prevImage(lightboxProject)" v-if="lightboxProject.images.length > 1">
          <i :class="cmsConfig.prevButtonIcon"></i>
        </button>
        <button class="lightbox-nav lightbox-next" @click="nextImage(lightboxProject)" v-if="lightboxProject.images.length > 1">
          <i :class="cmsConfig.nextButtonIcon"></i>
        </button>

        <!-- Thông tin và thumbnails -->
        <div class="lightbox-info">
          <div class="lightbox-text">
            <h3>{{ lightboxProject.name }}</h3>
            <p>{{ lightboxProject.service }} - {{ getPrice(lightboxProject.price) }}</p>
          </div>
          <div class="lightbox-thumbnails" v-if="lightboxProject.images.length > 1">
            <div
                v-for="(img, index) in lightboxProject.images"
                :key="index"
                class="thumbnail-item"
                :class="{ active: getCurrentImageIndex(lightboxProject) === index }"
                @click="goToImage(lightboxProject, index)"
            >
              <img :src="getImageUrl(img.src)" :alt="lightboxProject.name" />
            </div>
          </div>
        </div>

        <!-- Counter -->
        <div class="lightbox-counter" v-if="lightboxProject.images.length > 1">
          {{ getCurrentImageIndex(lightboxProject) + 1 }} / {{ lightboxProject.images.length }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import {baseImgaeUrl} from "../../../../assets/js/global.js";
import api from "../../../../api/api.js";

const props = defineProps(
  {
  content: Object,
  title: String
  });

// Khởi tạo cấu hình mặc định
const cmsConfig = ref({
  // Tiêu đề chính
  title: "DỰ ÁN ĐÃ BÁN THÀNH CÔNG",
  subtitle: "Tổng hợp các dự án đã bán thành công nhờ định giá đúng",
  projectsTitle: "Một số dự án đã bán thành công trong năm 2025",

  // Số cột hiển thị (mặc định 3)
  columns: 3,

  // Các thống kê
  stats: [
    { icon: "fa-solid fa-house", value: '1,250+', title: 'Bất động sản đã bán' },
    { icon: "fa-solid fa-star", value: '4.9/5', title: 'Đánh giá từ khách hàng' },
    { icon: "fa-solid fa-users", value: '2,500+', title: 'Khách hàng hài lòng' },
    { icon: "fa-solid fa-trophy", value: '15+', title: 'Giải thưởng uy tín' }
  ],

  // Nhãn hiển thị
  priceLabel: "Giá bán",
  viewCountLabel: "Lượt xem",
  offerCountLabel: "Lượt đề nghị",
  interestLevelLabel: "Mức độ quan tâm",
  detailButtonText: "Xem Chi Tiết",

  // Nhãn đã bán
  soldBadgeText: "sold-out",
  soldBadgeImage: "/imgs/sold-out.png",

  // Icon buttons
  prevButtonIcon: "fa-solid fa-angle-left",
  nextButtonIcon: "fa-solid fa-angle-right",
  closeButtonIcon: "fa-solid fa-times",
  lightboxPrevIcon: "fa-solid fa-chevron-left",
  lightboxNextIcon: "fa-solid fa-chevron-right",

  // Kích thước các nút
  buttonSizes: {
    navButton: "40px",
    lightboxNavButton: "60px",
    lightboxCloseButton: "45px",
    detailButtonPadding: "12px 20px",
    thumbnailSize: "60px"
  },

  // Kích thước chữ
  fontSizes: {
    title: "2.5rem",
    subtitle: "1.2rem",
    projectTitle: "1.4rem",
    statValue: "2.2rem",
    statTitle: "1rem",
    detailLabel: "1rem",
    detailValue: "1rem",
    progressLabel: "0.9rem",
    progressPercent: "0.9rem",
    buttonText: "1rem"
  },

  // Màu sắc chữ
  textColors: {
    primary: "#031358",
    secondary: "#5a6ab1",
    white: "#ffffff",
    lightText: "rgba(255, 255, 255, 0.9)",
    buttonText: "#ffffff",
    statValue: "#031358",
    statTitle: "#5a6ab1"
  },

  // Màu sắc nền
  colors: {
    primary: "#031358",
    secondary: "#5a6ab1",
    gradientStart: "#031358",
    gradientEnd: "#012cd3",
    backgroundStart: "#f8f9ff",
    backgroundEnd: "#eef1ff",
    cardShadow: "rgba(3, 19, 88, 0.15)",
    hoverShadow: "rgba(3, 19, 88, 0.2)",
    progressBar: "#e0e5ff",
    progressFillStart: "#031358",
    progressFillEnd: "#2d44b0"
  },

  // Kích thước
  sizes: {
    projectImageHeight: "300px",
    statCardPadding: "30px 20px",
    borderRadius: "16px",
    cardBorderRadius: "20px",
    progressBarHeight: "8px",
    ellipseHeight: "400px"
  },

  // Dữ liệu dự án đã bán
  soldProjects: [
    {
      name: "Anh Nhân - Quận 9",
      price: 1.15,
      service: "Bán nhanh 30 ngày",
      viewCount: 17,
      offerCount: 11,
      images: [
        { src: "nhan-q9-maifdsfslmkdmlksgfsmmlksfdlmn.jpg", isMain: true },
        { src: "nhan-q9-1.jpg", isMain: false },
        { src: "nhan-q9-2.jpg", isMain: false }
      ]
    },
    {
      name: "Chị Thủy - Vĩnh Long",
      price: 6,
      service: "Bán nhanh 30 ngày",
      viewCount: 9,
      offerCount: 5,
      images: [
        { src: "thuy-vinhlong-main.jpg", isMain: true },
        { src: "thuy-vinhlong-1.jpg", isMain: false },
        { src: "thuy-vinhlong-2.jpg", isMain: false },
        { src: "thuy-vinhlong-3.jpg", isMain: false },
        { src: "thuy-vinhlong-4.jpg", isMain: false },
      ]
    },
    {
      name: "Chị Nguyên - Đồng Tháp",
      price: 4.5,
      service: "Bán nhanh 30 ngày",
      viewCount: 11,
      offerCount: 6,
      images: [
        { src: "nguyen-dongthap-main.jpg", isMain: true },
        { src: "nguyen-dongthap-1.jpg", isMain: false },
        { src: "nguyen-dongthap-2.jpg", isMain: false },
        { src: "nguyen-dongthap-3.jpg", isMain: false },
        { src: "nguyen-dongthap-4.jpg", isMain: false },
        { src: "nguyen-dongthap-5.jpg", isMain: false },
      ]
    },
    {
      name: "Anh Phước - Dĩ An",
      price: 5.2,
      service: "Giải pháp 3-6 tháng",
      viewCount: 15,
      offerCount: 10,
      images: [
        { src: "phuoc-dian-main.jpg", isMain: true },
        { src: "phuoc-dian-1.jpg", isMain: false },
        { src: "phuoc-dian-2.jpg", isMain: false },
        { src: "phuoc-dian-3.jpg", isMain: false },
        { src: "phuoc-dian-4.jpg", isMain: false },
        { src: "phuoc-dian-5.jpg", isMain: false },
      ]
    },
    {
      name: "Chị Hà - Quận 12",
      price: 7,
      service: "Giải pháp 3-6 tháng",
      viewCount: 10,
      offerCount: 4,
      images: [
        { src: "ha-q12-main.jpg", isMain: true },
        { src: "ha-q12-1.jpg", isMain: false },
        { src: "ha-q12-2.jpg", isMain: false },
        { src: "ha-q12-3.jpg", isMain: false },
        { src: "ha-q12-4.jpg", isMain: false },
        { src: "ha-q12-5.jpg", isMain: false }
      ]
    },
    {
      name: "Chú Thanh - Bình Dương",
      price: 10,
      service: "Giải pháp 3-6 tháng",
      viewCount: 12,
      offerCount: 7,
      images: [
        { src: "thanh-binhduong-main.jpg", isMain: true },
        { src: "thanh-binhduong-1.jpg", isMain: false },
        { src: "thanh-binhduong-2.jpg", isMain: false }
      ]
    }
  ]
});

const hoverProject = ref(null);
const lightboxVisible = ref(false);
const lightboxProject = ref(null);
const projectsWithIndex = ref([]);
const isLoading = ref(false);

// Hàm load dữ liệu từ API
const loadDataFromServer = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/thg/public/cms/contentSection/7');
    const apiData = JSON.parse(response.data.contentJson);

    // Gộp dữ liệu API với cấu hình mặc định
    cmsConfig.value = {
      ...cmsConfig.value,  // Giữ cấu hình mặc định
      ...apiData           // Ghi đè bằng dữ liệu API
    };

    console.log("Gọi API thành công");
    console.log("Dữ liệu từ API:", apiData);
    console.log("Cấu hình sau khi gộp:", cmsConfig.value);

    // Khởi tạo projectsWithIndex
    if (cmsConfig.value.soldProjects && Array.isArray(cmsConfig.value.soldProjects)) {
      projectsWithIndex.value = cmsConfig.value.soldProjects.map(project => ({
        ...project,
        currentImageIndex: 0
      }));
    }

    return true;
  } catch (e) {
    console.log("Không gọi được API, lỗi:", e);
    return false;
  } finally {
    isLoading.value = false;
  }
};

// Hàm khởi tạo dữ liệu
const initializeData = async () => {
  // Ưu tiên dữ liệu từ props
  if (props.content && props.content.contentJson) {
    try {
      const contentJson = typeof props.content.contentJson === 'string'
          ? JSON.parse(props.content.contentJson)
          : props.content.contentJson;

      cmsConfig.value = {
        ...cmsConfig.value,
        ...contentJson
      };
      console.log("Sử dụng dữ liệu từ props:", contentJson);
    } catch (error) {
      console.error("Lỗi parse JSON từ props:", error);
      await loadDataFromServer();
    }
  } else {
    // Nếu không có props thì gọi API
    await loadDataFromServer();
  }

  // Ghi đè title nếu có
  if (props.title) {
    cmsConfig.value.title = props.title;
  }

  // Đảm bảo projectsWithIndex được khởi tạo
  if (!projectsWithIndex.value.length && cmsConfig.value.soldProjects) {
    projectsWithIndex.value = cmsConfig.value.soldProjects.map(project => ({
      ...project,
      currentImageIndex: 0
    }));
  }
};

// Khởi tạo khi component mounted
onMounted(async () => {
  await initializeData();
  document.addEventListener('keydown', handleKeydown);
});

// Nếu có prop title từ bên ngoài, ghi đè lên config
if (props.title) {
  cmsConfig.value.title = props.title;
}

const getPrice = (price) => {
  return price + " tỷ VNĐ";
}

// Tính toán mức độ quan tâm dựa trên lượt xem và đề nghị
const calculateInterestLevel = (project) => {
  const maxViews = Math.max(...cmsConfig.value.soldProjects.map(p => p.viewCount));
  const maxOffers = Math.max(...cmsConfig.value.soldProjects.map(p => p.offerCount));

  const viewRatio = (project.viewCount / maxViews) * 50;
  const offerRatio = (project.offerCount / maxOffers) * 50;

  return Math.min(Math.round(viewRatio + offerRatio), 100);
}

// Lấy URL ảnh
const getImageUrl = (filename) => {
  return baseImgaeUrl+filename;
}

// Lấy ảnh hiện tại của project
const getCurrentImage = (project) => {
  const projectWithIndex = projectsWithIndex.value.find(p => p.name === project.name);
  return projectWithIndex.images[projectWithIndex.currentImageIndex];
}

// Lấy index ảnh hiện tại
const getCurrentImageIndex = (project) => {
  const projectWithIndex = projectsWithIndex.value.find(p => p.name === project.name);
  return projectWithIndex.currentImageIndex;
}

// Chuyển đến ảnh tiếp theo
const nextImage = (project) => {
  const projectWithIndex = projectsWithIndex.value.find(p => p.name === project.name);
  projectWithIndex.currentImageIndex = (projectWithIndex.currentImageIndex + 1) % projectWithIndex.images.length;
}

// Chuyển đến ảnh trước
const prevImage = (project) => {
  const projectWithIndex = projectsWithIndex.value.find(p => p.name === project.name);
  projectWithIndex.currentImageIndex = projectWithIndex.currentImageIndex === 0
      ? projectWithIndex.images.length - 1
      : projectWithIndex.currentImageIndex - 1;
}

// Chuyển đến ảnh cụ thể
const goToImage = (project, index) => {
  const projectWithIndex = projectsWithIndex.value.find(p => p.name === project.name);
  projectWithIndex.currentImageIndex = index;
}

// Mở lightbox
const openLightbox = (project) => {
  lightboxProject.value = project;
  lightboxVisible.value = true;
  document.body.style.overflow = 'hidden';
}

// Đóng lightbox
const closeLightbox = () => {
  lightboxVisible.value = false;
  lightboxProject.value = null;
  document.body.style.overflow = '';
}

// Xử lý sự kiện keyboard
const handleKeydown = (event) => {
  if (!lightboxVisible.value || !lightboxProject.value) return;

  switch(event.key) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowLeft':
      prevImage(lightboxProject.value);
      break;
    case 'ArrowRight':
      nextImage(lightboxProject.value);
      break;
  }
}

// Thêm event listener cho keyboard
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

const viewDetails = (project) => {
  console.log(`Xem chi tiết dự án: ${project.name}`);
  // Có thể thêm logic điều hướng hoặc hiển thị modal chi tiết ở đây
}
</script>

<style scoped>
.success-sales-section {
  background: linear-gradient(135deg, v-bind('cmsConfig.colors.backgroundStart') 0%, v-bind('cmsConfig.colors.backgroundEnd') 100%);
  position: relative;
  overflow: visible;
  padding: 0 20px 60px;
}

.success-sales-section.no-scroll {
  overflow: hidden;
  height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  padding: 0 20px;
}

/* Phần elip */
.ellipse-section {
  position: relative;
  margin-bottom: 100px;
  padding-top: 60px;
}

.ellipse-bg {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: v-bind('cmsConfig.sizes.ellipseHeight');
  background: linear-gradient(135deg, v-bind('cmsConfig.colors.gradientStart') 0%, v-bind('cmsConfig.colors.gradientEnd') 100%);
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 180px;
  position: relative;
  z-index: 2;
}

.project-title {
  text-align: center;
  color: v-bind('cmsConfig.textColors.primary');
  font-size: v-bind('cmsConfig.fontSizes.title');
}

.section-title {
  font-size: v-bind('cmsConfig.fontSizes.title');
  color: v-bind('cmsConfig.textColors.white');
  margin-bottom: 15px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.section-subtitle {
  font-size: v-bind('cmsConfig.fontSizes.subtitle');
  color: v-bind('cmsConfig.textColors.lightText');
  max-width: 600px;
  margin: 0 auto;
}

/* Stats nằm trên viền elip */
#stat0, #stat3 {
  transform: translateY(20px);
}

#stat1, #stat2 {
  transform: translateY(60px);
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 50px;
  position: relative;
  z-index: 3;
  margin-top: -100px;
}

.stat-card {
  background: white;
  border-radius: v-bind('cmsConfig.sizes.borderRadius');
  padding: v-bind('cmsConfig.sizes.statCardPadding');
  text-align: center;
  box-shadow: 0 15px 35px v-bind('cmsConfig.colors.cardShadow');
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(3, 19, 88, 0.08);
  position: relative;
  z-index: 4;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px v-bind('cmsConfig.colors.hoverShadow');
}

.stat-icon {
  font-size: v-bind('cmsConfig.fontSizes.statValue');
  margin-bottom: 15px;
  color: v-bind('cmsConfig.textColors.statValue');
}

.stat-value {
  font-size: v-bind('cmsConfig.fontSizes.statValue');
  font-weight: 700;
  color: v-bind('cmsConfig.textColors.statValue');
  margin-bottom: 8px;
}

.stat-title {
  color: v-bind('cmsConfig.textColors.statTitle');
  font-size: v-bind('cmsConfig.fontSizes.statTitle');
  font-weight: 500;
}

/* Phần dự án */
.projects-grid {
  display: grid;
  gap: 30px;
  margin-bottom: 60px;
  padding-top: 40px;
}

.project-card {
  background: white;
  border-radius: v-bind('cmsConfig.sizes.cardBorderRadius');
  overflow: hidden;
  box-shadow: 0 10px 30px v-bind('cmsConfig.colors.cardShadow');
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  border: 1px solid rgba(3, 19, 88, 0.05);
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px v-bind('cmsConfig.colors.hoverShadow');
}

.project-image {
  position: relative;
  height: v-bind('cmsConfig.sizes.projectImageHeight');
  overflow: hidden;
  cursor: pointer;
}

.project-image .main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .project-image .main-image {
  transform: scale(1.05);
}

.sold-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 3;
  width: 70px;
}

/* Navigation buttons */
.image-nav-buttons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  z-index: 2;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.8);
  border: none;
  width: v-bind('cmsConfig.buttonSizes.navButton');
  height: v-bind('cmsConfig.buttonSizes.navButton');
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: v-bind('cmsConfig.textColors.primary');
  font-size: 1.2rem;
}

.nav-btn:hover {
  background: white;
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, transparent 60%, rgba(3, 19, 88, 0.7));
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.image-overlay.active {
  opacity: 1;
}

.project-info {
  padding: 25px;
}

.project-name {
  font-size: v-bind('cmsConfig.fontSizes.projectTitle');
  color: v-bind('cmsConfig.textColors.primary');
  margin-bottom: 8px;
  font-weight: 700;
}

.project-location {
  color: v-bind('cmsConfig.textColors.secondary');
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.project-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(3, 19, 88, 0.1);
}

.detail-label {
  color: v-bind('cmsConfig.textColors.secondary');
  font-weight: 500;
  font-size: v-bind('cmsConfig.fontSizes.detailLabel');
}

.detail-value {
  color: v-bind('cmsConfig.textColors.primary');
  font-weight: 600;
  font-size: v-bind('cmsConfig.fontSizes.detailValue');
}

.progress-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.progress-label {
  color: v-bind('cmsConfig.textColors.secondary');
  font-size: v-bind('cmsConfig.fontSizes.progressLabel');
  flex: 1;
}

.progress-bar {
  flex: 2;
  height: v-bind('cmsConfig.sizes.progressBarHeight');
  background: v-bind('cmsConfig.colors.progressBar');
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, v-bind('cmsConfig.colors.progressFillStart'), v-bind('cmsConfig.colors.progressFillEnd'));
  border-radius: 10px;
  transition: width 1s ease;
}

.progress-percent {
  color: v-bind('cmsConfig.textColors.primary');
  font-weight: 700;
  font-size: v-bind('cmsConfig.fontSizes.progressPercent');
  min-width: 40px;
}

/* Nút xem chi tiết */
.detail-button {
  width: 100%;
  background: linear-gradient(135deg, v-bind('cmsConfig.colors.primary'), v-bind('cmsConfig.colors.secondary'));
  color: v-bind('cmsConfig.textColors.buttonText');
  border: none;
  padding: v-bind('cmsConfig.buttonSizes.detailButtonPadding');
  border-radius: 10px;
  font-weight: 600;
  font-size: v-bind('cmsConfig.fontSizes.buttonText');
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  box-shadow: 0 4px 10px rgba(3, 19, 88, 0.2);
  min-width: 120px;
}

.detail-button:hover {
  background: linear-gradient(135deg, v-bind('cmsConfig.colors.secondary'), v-bind('cmsConfig.colors.primary'));
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(3, 19, 88, 0.3);
}

/* Lightbox Overlay */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(5px);
}

.lightbox-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.lightbox-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: v-bind('cmsConfig.buttonSizes.lightboxCloseButton');
  height: v-bind('cmsConfig.buttonSizes.lightboxCloseButton');
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  font-size: 1.3rem;
  transition: all 0.3s ease;
}

.lightbox-close:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.lightbox-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  min-height: 60vh;
  max-height: 70vh;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Lightbox Navigation */
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: v-bind('cmsConfig.buttonSizes.lightboxNavButton');
  height: v-bind('cmsConfig.buttonSizes.lightboxNavButton');
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  z-index: 5;
}

.lightbox-nav:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-prev {
  left: 20px;
}

.lightbox-next {
  right: 20px;
}

/* Lightbox Info */
.lightbox-info {
  padding: 20px;
  background: white;
  border-top: 1px solid #eaeaea;
}

.lightbox-text h3 {
  color: v-bind('cmsConfig.textColors.primary');
  margin-bottom: 5px;
  font-size: 1.3rem;
}

.lightbox-text p {
  color: v-bind('cmsConfig.textColors.secondary');
  margin: 0;
}

.lightbox-thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  overflow-x: auto;
  padding: 5px 0;
}

.thumbnail-item {
  width: v-bind('cmsConfig.buttonSizes.thumbnailSize');
  height: v-bind('cmsConfig.buttonSizes.thumbnailSize');
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
  flex-shrink: 0;
  border: 2px solid transparent;
}

.thumbnail-item.active {
  opacity: 1;
  border-color: v-bind('cmsConfig.colors.primary');
}

.thumbnail-item:hover {
  opacity: 1;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Lightbox Counter */
.lightbox-counter {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 5;
}

/* Responsive */
@media (max-width: 1200px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
    margin-top: -50px;
  }

  .ellipse-bg {
    height: 500px;
  }

  #stat0, #stat1, #stat2, #stat3 {
    transform: translateY(0);
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }

  .ellipse-section {
    margin-bottom: 60px;
    padding-top: 40px;
  }

  .ellipse-bg {
    height: 400px;
  }

  .section-header {
    margin-bottom: 120px;
  }

  .stats-overview {
    grid-template-columns: 1fr;
    position: static;
    margin-top: 30px;
  }

  .stat-card {
    position: static;
  }

  .progress-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .progress-bar {
    width: 100%;
  }

  .lightbox-container {
    max-width: 95vw;
    max-height: 95vh;
  }

  .lightbox-nav {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .lightbox-prev {
    left: 10px;
  }

  .lightbox-next {
    right: 10px;
  }

  .lightbox-thumbnails {
    gap: 8px;
  }

  .thumbnail-item {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .ellipse-bg {
    height: 250px;
  }

  .section-header {
    margin-bottom: 100px;
  }

  .image-nav-buttons {
    padding: 0 10px;
  }

  .nav-btn {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .lightbox-image-container {
    min-height: 50vh;
  }

  .lightbox-info {
    padding: 15px;
  }

  .lightbox-text h3 {
    font-size: 1.1rem;
  }

  .lightbox-thumbnails {
    gap: 5px;
  }

  .thumbnail-item {
    width: 45px;
    height: 45px;
  }
}

/* Responsive cho số cột */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>