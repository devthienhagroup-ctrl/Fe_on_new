<template>
  <div
      class="menu-container d-flex flex-column justify-content-center align-items-center"
      :style="{
      backgroundImage: `linear-gradient(145deg, rgba(5,25,45,0.95), rgba(1,10,25,0.98)), url(${backgroundImage})`
    }"
  >
    <!-- Top Bar -->
    <div class="top-bar d-flex justify-content-between align-items-center w-100 px-5 py-3">
      <!-- Logo -->
      <div class="d-flex align-items-center">
        <img :src="logoImage" alt="Logo" height="52" class="me-3" />
        <span class="fw-bold fs-5 text-light">Thiên Hà Group</span>
      </div>

      <!-- User Info -->
      <div class="d-flex align-items-center">
        <div class="text-end me-3">
          <div class="fw-semibold text-light"> {{ info.fullName }}</div>
          <div class="text-secondary small"> {{ info.role}} </div>
        </div>
        <img
        :src="' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + info.avatarUrl"
        alt="Avatar"
            class="rounded-circle border border-light-subtle"
            width="46"
            height="46"
        />
      </div>
    </div>

    <!-- Main Content -->
    <div class="container text-center mt-4 animate-fadein">
      <!-- Header -->
      <div class="mb-5">
        <h2 class="fw-bold text-light d-flex align-items-center justify-content-center mb-2">
          HỆ THỐNG QUẢN TRỊ THIÊN HÀ GROUP
        </h2>
        <p class="text-light-emphasis small mb-0">
          Nền tảng quản lý tích hợp giúp giám sát, điều hành và tối ưu vận hành toàn diện
        </p>
      </div>

      <!-- MenuUser Cards -->
      <div class="d-flex flex-wrap justify-content-center gap-4">
        <router-link
            v-for="item in menuItems"
            :key="item.route"
            :to="item.route"
            class="card menu-card text-decoration-none shadow-sm"
        >
          <div class="card-body text-center">
            <i :class="item.icon" class="icon mb-4"></i>
            <h5 class="fw-semibold text-light mb-2">{{ item.title }}</h5>
            <p class="text-secondary small mb-0">{{ item.desc }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import backgroundImage from '/imgs/background_login.png'
import logoImage from '/imgs/logo.png'

import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const info = authStore.userInfo

const allMenuItems = [
  { label: 'PROJECT', route: '/-thg/du-an', icon: 'fa-solid fa-diagram-project text-info fs-2', title: 'Dự án', desc: 'Theo dõi tiến độ, chi phí và hiệu quả triển khai' },
  { label: 'DEPARTMENT', route: '/-thg/phong-ban', icon: 'fa-solid fa-building-user text-primary fs-2', title: 'Phòng ban', desc: 'Quản lý cơ cấu tổ chức và phân quyền công việc' },
  { label: 'TEAM', route: '/-thg/nhom', icon: 'fa-solid fa-people-group text-success fs-2', title: 'Nhóm làm việc', desc: 'Tổ chức nhóm, theo dõi hiệu suất và cộng tác nội bộ' },
  { label: 'EMPLOYEE', route: '/-thg/nhan-vien', icon: 'fa-solid fa-user-tie text-warning fs-2', title: 'Nhân sự', desc: 'Quản lý hồ sơ, năng lực và lịch sử công tác' },
  { label: 'TYPE', route: '/-thg/loai-hinh', icon: 'fa-solid fa-layer-group text-danger fs-2', title: 'Phân loại', desc: 'Cấu hình loại công việc, dự án và hạng mục' },
  {
    label: 'PRODUCT',
    route: '/-thg/quan-ly-san-pham',
    icon: 'fa-solid fa-mountain-sun text-primary fs-2',
    title: 'Sản phẩm',
    desc: 'Quản lý danh mục đất đai, nhà ở và tài sản bất động sản'
  },


  { label: 'CUSTOMER', route: '/-thg/khach-hang', icon: 'fa-solid fa-address-book text-info fs-2', title: 'Khách hàng', desc: 'Theo dõi thông tin, lịch sử và chăm sóc khách hàng' },
  { label: 'AUDIT', route: '/-thg/lich-su-he-thong', icon: 'fa-solid fa-clock-rotate-left text-danger fs-2', title: 'Audit Log', desc: 'Ghi nhận và giám sát toàn bộ thao tác hệ thống' },
  { label: 'ROLE', route: '/-thg/phan-quyen', icon: 'fa-solid fa-shield-halved text-warning fs-2', title: 'Phân quyền Role', desc: 'Quản lý & cấu hình quyền truy cập cho vai trò trong hệ thống'
  },
  {
    label: 'ADMIN',
    route: '/-thg/dinh-gia',
    icon: 'fa-solid fa-scale-balanced text-danger fs-2',
    title: 'Quản lý định giá',
    desc: 'Tiếp nhận & xử lý các yêu cầu định giá của khách hàng'
  },{
    label: 'SERVICESYS',
    route: '/-thg/goi-he-thong',
    icon: 'fa-solid fa-boxes-stacked text-primary fs-2',
    title: 'Dịch vụ hệ thống',
    desc: 'QUản lý các gói dịch vụ của hệ thống'
  },
  {
    label: 'APPOINTMENT',
    route: '/-thg/lich-hen',
    icon: 'fa-solid fa-calendar-check text-primary fs-2',
    title: 'Lịch hẹn',
    desc: 'Quản lý lịch hẹn, phân công và theo dõi kết quả'
  }


]


const listPermission = authStore.listPermission // 👈 quyền lấy từ backend

// Lọc theo listPermission.value === true
const menuItems = computed(() => {
  if (!listPermission || listPermission.length === 0) return []

  const allowedLabels = listPermission
      .filter(p => p.value === true)
      .map(p => p.label)

  // Trả về các menu có label nằm trong allowedLabels
  return allMenuItems.filter(item => allowedLabels.includes(item.label))
})

</script>

<style scoped>
.menu-container {
  min-height: 100vh;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

/* Top Bar */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 72px;
  z-index: 2;
}

/* Card style */
.menu-card {
  flex: 1 1 calc(25% - 2rem); /* Tối đa 4 card mỗi hàng */
  max-width: 250px;
  min-width: 250px;
  height: 22vh;
  border-radius: 18px;
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.35s ease;
  padding: 8px;
}
.menu-card:hover {
  transform: translateY(-8px);
  background-color: rgba(0, 255, 255, 0.12);
  box-shadow: 0 0 20px rgba(0, 180, 255, 0.25);
  border-color: rgba(0, 200, 255, 0.35);
}

/* Animation */
@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadein {
  animation: fadein 0.8s ease;
}

/* Text improvements */
.text-light-emphasis {
  color: rgba(220, 230, 240, 0.75);
}
/* ============ MOBILE (<= 768px) ============ */
@media (max-width: 768px) {

  .menu-container {
    padding-top: 95px !important;
    justify-content: flex-start !important;
  }

  /* ----- TOP BAR (LOGO + TITLE NGANG HÀNG, NHỎ GỌN) ----- */
  .top-bar {
    position: relative;
    width: 100%;
    height: auto;
    padding: 10px 12px !important;

    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 6px;
  }

  /* Logo + chữ nhỏ */
  .top-bar .d-flex.align-items-center:first-child {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  .top-bar img {
    height: 38px !important;
  }

  .top-bar .fw-bold {
    font-size: 13px !important;
    margin: 0;
    line-height: 1.1;
    white-space: nowrap;
  }

  /* User info + avatar */
  .top-bar .d-flex.align-items-center:last-child {
    flex-direction: row;
    align-items: center;
    gap: 6px;
    margin: 0;
  }

  .top-bar img.rounded-circle {
    width: 38px !important;
    height: 38px !important;
  }

  .top-bar .text-end div {
    font-size: 11px !important;
    line-height: 1.1;
  }

  /* ----- MAIN TITLE ----- */
  .container h2 {
    font-size: 17px !important;
    line-height: 1.2;
  }

  .container p {
    font-size: 12px !important;
  }

  /* --- MENU: MOBILE 1 HÀNG 1 CHỨC NĂNG --- */
  .d-flex.flex-wrap.justify-content-center.gap-4 {
    display: flex !important;
    flex-direction: column !important;
    align-items: center;
    gap: 14px !important;
    padding: 0 12px;
  }

  .menu-card {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 100% !important;

    height: auto !important;
    padding: 16px !important;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .menu-card .icon {
    font-size: 28px !important;
    margin-bottom: 8px !important;
  }

  .menu-card h5 {
    font-size: 15px !important;
    margin-bottom: 6px !important;
  }

  /* 👉 HIỆN MÔ TẢ TRÊN MOBILE */
  .menu-card p {
    display: block !important;
    font-size: 12px !important;
    text-align: center;
    opacity: 0.8;
    margin: 0;
    line-height: 1.2;
  }
}

/* ============ TABLET (769px – 1024px) ============ */
@media (min-width: 769px) and (max-width: 1024px) {

  /* Top bar giữ nguyên layout ngang */
  .top-bar {
    padding: 20px 40px !important;
  }

  .top-bar img {
    height: 60px !important;
  }

  .top-bar .fw-bold {
    font-size: 22px !important;
  }

  /* Header */
  .container h2 {
    font-size: 26px !important;
  }

  .container p {
    font-size: 14px !important;
  }

  .container {
    margin-top: 70px !important;
  }

  /* Card 2 cột */
  .menu-card {
    flex: 1 1 calc(45% - 1rem) !important;
    max-width: 45% !important;
    padding: 18px !important;
  }

  .menu-card .icon {
    font-size: 36px !important;
  }

  /* 👉 Hiện lại mô tả trên iPad */
  .menu-card p {
    display: block !important;
    font-size: 13px !important;
    margin-top: 6px;
    opacity: 0.85;
  }
}




</style>
