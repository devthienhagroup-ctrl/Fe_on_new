<template>
  <div
      class="d-flex vh-100 sidebar-layout"
      :style="{
      backgroundImage: `linear-gradient(145deg, rgba(5,25,45,0.95), rgba(1,10,25,0.98)), url(${backgroundImage})`
    }"
  >
    <!-- ========== SIDEBAR ========== -->
    <aside class="sidebar" :class="{ collapsed: sidebar.isExpanded }">


      <!-- Logo -->
      <div class="logo mb-3">
        <router-link to="/">
          <img :src="logoImage" alt="Logo" height="60" />
        </router-link>
      </div>


      <!-- ===== ICON MENU ===== -->
      <div class="menu-container px-2">
        <ul class="nav flex-column align-items-center sidebar-menu">
          <li
              v-for="item in filteredMenu"
              :key="item.route"
              class="nav-item w-100 mb-3"
          >
            <router-link
                :to="item.route"
                class="nav-link sidebar-link"
                active-class="active-link"
                @mouseenter="setHoveredItem(item.route)"
                @mouseleave="setHoveredItem(null)"
            >
              <i :class="item.icon" class="menu-icon" ></i>

              <span
                  class="menu-text"
                  :class="{ 'show-text': hoveredItem === item.route }"
              >
                {{ item.title }}
              </span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- ===== LOGOUT BUTTON ===== -->
      <div class="logout-wrapper">
        <button
            class="btn-logout"
            @click="authStore.logout()"
        >
          <i class="fa-solid fa-right-from-bracket"></i>
          <span class="logout-text">Đăng xuất</span>
        </button>
      </div>

    </aside>

    <!-- Main content -->
    <main class="flex-grow-1 bg-white overflow-auto py-2">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import backgroundImage from '/imgs/background_login.png'
import logoImage from '/imgs/logo.png'

import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const listPermission = authStore.listPermission
const hoveredItem = ref(null)

const setHoveredItem = (route) => {
  hoveredItem.value = route
}

/* ===== MENU ===== */
const allMenuItems = [
  { label: 'PROJECT', route: '/-thg/du-an', icon: 'fa-solid fa-diagram-project text-info fs-5', title: 'Dự án' },
  { label: 'DEPARTMENT', route: '/-thg/phong-ban', icon: 'fa-solid fa-building-user text-primary fs-5', title: 'Phòng ban' },
  { label: 'TEAM', route: '/-thg/nhom', icon: 'fa-solid fa-people-group text-success fs-5', title: 'Nhóm' },
  { label: 'EMPLOYEE', route: '/-thg/nhan-vien', icon: 'fa-solid fa-user-tie text-warning fs-5', title: 'Nhân sự' },
  { label: 'TYPE', route: '/-thg/loai-hinh', icon: 'fa-solid fa-layer-group text-danger fs-5', title: 'Phân loại' },
  {
    label: 'PRODUCT',
    route: '/-thg/quan-ly-san-pham',
    icon: 'fa-solid fa-mountain-sun text-primary fs-5',
    title: 'Sản phẩm'
  },
  { label: 'SYSCUSTOMER', route: '/-thg/quan-ly-nguoi-dung', icon: 'fa-solid fa-address-book text-info fs-5', title: 'Người dùng' },
  { label: 'AUDIT', route: '/-thg/lich-su-he-thong', icon: 'fa-solid fa-clock-rotate-left text-danger fs-5', title: 'Audit Log' },
  { label: 'ROLE', route: '/-thg/phan-quyen', icon: 'fa-solid fa-shield-halved text-warning fs-5', title: 'Phân quyền' },
  { label: 'ADMIN', route: '/-thg/dinh-gia', icon: 'fa-solid fa-scale-balanced text-danger fs-5', title: 'Định giá' },
  { label: 'SERVICESYS', route: '/-thg/goi-he-thong', icon: 'fa-solid fa-boxes-stacked text-primary fs-5', title: 'Gói dịch vụ' },
  {
    label: 'APPOINTMENT',
    route: '/-thg/lich-hen',
    icon: 'fa-solid fa-calendar-check text-primary fs-5',
    title: 'Lịch hẹn'
  },
  {
    label: 'EDITER',
    route: '/-thg/quan-tri-noi-dung/trang-chu/noi-bat',
    icon: 'fa-solid fa-file-lines text-primary fs-5',
    title: 'Nội dung'
  }

]

const allowedLabels = computed(() =>
    listPermission.filter(p => p.value === true).map(p => p.label)
)

const filteredMenu = computed(() =>
    allMenuItems.filter(item => allowedLabels.value.includes(item.label))
)

import { useSidebarStore } from "../stores/sidebarStore";
const sidebar = useSidebarStore();

</script>

<style scoped>
/* ==== SIDEBAR ==== */
.sidebar {
  min-width: 100px;
  max-width: 100px;
  background: rgba(255, 255, 255, 0.04);
  color: white;
  backdrop-filter: blur(14px);
  border-right: 1px solid rgba(255, 255, 255, 0.12);

  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 16px;
  padding-bottom: 0;
}

/* ==== MENU CONTAINER ==== */
.menu-container {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  margin-bottom: 0;
  padding-bottom: 0;
}

/* ==== MENU ITEM ==== */
.sidebar-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 6px;
  border-radius: 8px;
  color: rgba(255,255,255,0.8) !important;
  transition: all .25s;
}

.menu-icon {
  font-size: 22px;
  transition: all .25s;
}

.menu-text {
  font-size: 14px;
  opacity: 0;
  height: 0;
  margin-top: 0;
  white-space: nowrap;

  transform: translateY(-6px);
  transition: all .25s;
}

.menu-text.show-text,
.active-link .menu-text {
  opacity: 1;
  height: auto;
  margin-top: 4px;
  transform: translateY(0);
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.15);
}


/* ==== ACTIVE MENU ==== */
.active-link {
  background: rgba(255, 255, 255, 0.22);
  color: #fff !important;

  backdrop-filter: blur(10px) brightness(1.2);
  -webkit-backdrop-filter: blur(10px) brightness(1.2);

  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);

  transition: all 0.25s ease;
  border-radius: 10px;

}

.active-icon {
  color: whitesmoke !important;
}

/* ==== LOGOUT AREA ==== */
.logout-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
}

/* ==== LOGOUT BUTTON ==== */
.btn-logout {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;

  background: transparent;
  border: none;

  padding: 6px;

  font-size: 15px;
  font-weight: 600;
  color: #ff4d4d;

  cursor: pointer;
  transition: all .25s ease;
}

.btn-logout:hover {
  background: rgba(255, 77, 77, 0.42);
  transform: translateY(-2px);
}

.btn-logout i {
  color: #ff4d4d;
  transition: transform .25s ease, color .25s ease;
}

.btn-logout:hover i,
.btn-logout:hover .logout-text {
  color: white !important;
}

.logout-text {
  white-space: nowrap;
}

/* scrollbar */
.menu-container::-webkit-scrollbar { width: 3px; }
.menu-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}
/* Thu gọn menu */
/* Sidebar bình thường */
.sidebar {
  width: 100px;
  min-width: 100px;
  max-width: 100px;

  background: rgba(255, 255, 255, 0.04);
  color: white;
  backdrop-filter: blur(14px);
  border-right: 1px solid rgba(255, 255, 255, 0.12);

  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 16px;
  padding-bottom: 0;

  transition: width .25s ease;
}

/* Thu gọn */
.sidebar.collapsed {
  width: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;

  padding: 0 !important;
  overflow: hidden !important;
}



</style>
