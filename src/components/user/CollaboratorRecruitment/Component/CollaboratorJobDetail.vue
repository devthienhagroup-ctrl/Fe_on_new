<template>
  <div class="job-detail-page">
    <div class="container">
      <!-- Tiêu đề -->
      <h1 class="page-title">ỨNG TUYỂN CỘNG TÁC VIÊN THIÊN HÀ GROUP</h1>

      <div class="main-content">
        <!-- Cột trái -->
        <div class="left-column">
          <!-- Ảnh lớn -->
          <div class="main-image">
            <img :src="jobData.image" :alt="jobData.title" />
          </div>

          <!-- Thông tin công việc -->
          <div class="job-info-grid">
            <div class="info-item" v-for="item in jobInfoItems" :key="item.title">
              <div class="info-icon">
                <i v-if="item.iconClass" :class="item.iconClass"></i>
                <img v-else :src="item.icon" :alt="item.title" />
              </div>
              <div class="info-content">
                <div class="info-title">{{ item.title }}</div>
                <div class="info-value">{{ item.value }}</div>
              </div>
            </div>
          </div>

          <!-- Mô tả công việc -->
          <div class="job-description" v-html="jobData.jobDescription"></div>
        </div>

        <!-- Cột phải -->
        <div class="right-column">
          <!-- Ô trên - Đăng ký -->
          <div class="register-card">
            <h3 class="register-title">Bắt đầu hành trình cùng Thiên Hà Group</h3>
            <button class="register-btn">Đăng ký ngay</button>
            <div class="register-image">
              <img src="/imgs/Click here-pana.svg" alt="Click here" />
            </div>
          </div>

          <!-- Ô dưới - Thông tin -->
          <div class="info-card">
            <!-- Logo -->
            <div class="logo-section">
              <img src="/imgs/logoTHG.png" alt="Thiên Hà Group" class="company-logo" />
            </div>

            <!-- Liên kết nhanh -->
            <div class="quick-links">
              <QuickLink
                  v-for="link in quickLinks"
                  :key="link.title"
                  :title="link.title"
                  :items="link.items"
                  :type="link.type"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Nút quay lại -->
      <router-link to="/cong-viec-cong-tac-vien" class="back-btn">
        Quay lại
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QuickLink from './QuickLink.vue'

const getRandomImage = (width, heghit, seed) => {
  return `https://picsum.photos/${width}/${heghit}?random=${seed}`
}

// Dữ liệu công việc
const jobData = ref({
  id: 4,
  title: 'Cộng tác viên dự án Vinhomes',
  salary: 20000000,
  salaryVisible: false,
  location: 'Quận 2, TP.HCM',
  date: '30/10/2023',
  image: getRandomImage(927,580, 4),
  creator: 'Tập đoàn Vingroup',
  creatorAvatar: getRandomImage(60, 60, 6),
  income: '20-50 triệu',
  applicants: 25,
  jobDescription: `
    <h3>Mô tả công việc</h3>
    <ul>
      <li>Giới thiệu và tư vấn các sản phẩm của Vinhomes</li>
      <li>Kết nối khách hàng với chủ đầu tư</li>
      <li>Tổ chức tour tham quan dự án</li>
      <li>Hỗ trợ khách hàng hoàn thiện hồ sơ</li>
    </ul>

    <h3>Quyền lợi</h3>
    <ul>
      <li>Hoa hồng lên đến 3% giá trị giao dịch</li>
      <li>Được training bài bản từ chuyên gia</li>
      <li>Làm việc tại văn phòng hiện đại</li>
      <li>Cơ hội trở thành nhân viên chính thức</li>
    </ul>

    <h3>Yêu cầu</h3>
    <ul>
      <li>Có kinh nghiệm CTV BĐS là lợi thế</li>
      <li>Kỹ năng giao tiếp tự tin</li>
      <li>Có khả năng làm việc độc lập</li>
      <li>Cam kết làm việc lâu dài</li>
    </ul>
  `
})

// Danh sách thông tin công việc
const jobInfoItems = computed(() => [
  {
    title: 'Người tạo',
    value: jobData.value.creator,
    icon: jobData.value.creatorAvatar
  },
  {
    title: 'Địa điểm',
    value: jobData.value.location,
    iconClass: 'fas fa-map-marker-alt'
  },
  {
    title: 'Thu nhập',
    value: jobData.value.income,
    iconClass: 'fas fa-money-bill-wave'
  },
  {
    title: 'Hạn nộp',
    value: jobData.value.date,
    iconClass: 'fas fa-calendar-alt'
  },
  {
    title: 'Ứng viên',
    value: `${jobData.value.applicants} người`,
    iconClass: 'fas fa-users'
  },
  {
    title: 'Trạng thái',
    value: 'Đang tuyển',
    iconClass: 'fas fa-briefcase'
  }
])

// Liên kết nhanh
const quickLinks = ref([
  {
    title: 'Về Thiên Hà Group',
    type: 'router',
    items: [
      { title: 'Trang chủ', link: '/' }
    ]
  },
  {
    title: 'Thông tin liên hệ',
    type: 'action',
    items: [
      {
        title: 'Email: thienhagroup@gmail.com',
        action: 'copy',
        value: 'thienhagroup@gmail.com'
      },
      {
        title: 'Hotline: 091.123.1882',
        action: 'copy',
        value: '0911231882'
      },
      {
        title: 'Fanpage',
        action: 'external',
        link: 'https://www.facebook.com/profile.php?id=61557872978828'
      }
    ]
  },
  {
    title: 'Các vị trí tuyển dụng khác',
    type: 'router',
    items: [
      { title: 'Tuyển dụng', link: '/tuyen-dung' }
    ]
  },
  {
    title: 'Các câu hỏi thường gặp',
    type: 'faq',
    items: [
      { title: 'Làm thế nào để trở thành CTV?' },
      { title: 'Thu nhập trung bình của CTV là bao nhiêu?' },
      { title: 'Có cần kinh nghiệm không?' },
      { title: 'Thời gian làm việc linh hoạt thế nào?' },
      { title: 'Có được training không?' }
    ]
  },
  {
    title: 'Tin tức về Thiên Hà Group',
    type: 'router',
    items: [
      { title: 'Tin tức', link: '/tin-tuc' }
    ]
  }
])

// Hàm copy text
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
}
</script>

<style scoped>
.job-detail-page {
  font-family: 'Ubuntu', sans-serif;
  margin: 0 auto 20px;
  padding-top: 80px;
  background-color: #f8f9fa;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 40px;
  color: #031358;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
}

.main-content {
  display: grid;
  grid-template-columns: 8fr 4fr;
  gap: 30px;
  margin-bottom: 30px;
}

/* Cột trái */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: auto;
  display: block;
}

.job-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.info-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.info-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #031358;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon i {
  font-size: 24px;
  color: white;
}

.info-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 15px;
  color: #000;
  text-align: left;
  margin-bottom: 5px;
}

.info-value {
  font-size: 17px;
  color: #000;
  font-weight: 700;
}

.job-description {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.job-description :deep(h3) {
  color: #031358;
  margin: 20px 0 15px 0;
  font-size: 20px;
}

.job-description :deep(ul) {
  padding-left: 20px;
}

.job-description :deep(li) {
  margin-bottom: 8px;
  line-height: 1.6;
}

/* Cột phải */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  position: relative;
  padding-bottom: 120px;
}

.register-title {
  font-size: 33px;
  color: #000;
  margin-bottom: 25px;
  font-weight: 700;
  line-height: 1.3;
}

.register-btn {
  background: linear-gradient(90deg, #031358, #0030FF, #031358);
  background-size: 200% 100%;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  animation: gradientMove 3s linear infinite;
  margin-bottom: 20px;
  transition: transform 0.2s;
  width: 70%;
}

.register-btn:hover {
  transform: translateY(-2px);
}

@keyframes gradientMove {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.register-image {
  margin-top: 15px;
  position: absolute;
  width: 60%;
  right: 0;
  bottom: -50px;
  pointer-events: none;
}

.register-image img {
  width: 100%;
  height: auto;
  pointer-events: none;
}

.info-card {
  background: rgba(204, 214, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
}

.logo-section {
  text-align: center;
  margin-bottom: 25px;
}

.company-logo {
  width: 50%;
  margin: 0 auto;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.back-btn {
  display: block;
  width: 100%;
  background: #031358;
  color: white;
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #002244;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .job-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .register-image {
    width: auto;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .job-info-grid {
    grid-template-columns: 1fr;
  }

  .register-title {
    font-size: 28px;
  }
  .register-image {
    width: 40%;
  }
}

@media (max-width: 492px) {
  .register-image {
    bottom: -30px;
  }
  
}
</style>