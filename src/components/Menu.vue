<template>
  <div
      class="d-flex vh-100 sidebar-layout"
      :class="{ 'layout-collapsed': !sidebar.isExpanded }"
      :style="{
      backgroundImage: `linear-gradient(145deg, rgba(5,25,45,0.95), rgba(1,10,25,0.98)), url(${backgroundImage})`
    }"
  >
    <!-- ========== SIDEBAR FIXED OVERLAY ========== -->
    <aside
        class="sidebar-fixed"
        :class="{ collapsed: !sidebar.isExpanded }"
        @mouseenter="handleSidebarEnter"
        @mouseleave="handleSidebarLeave"
    >
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
                @mouseenter="(e) => setHoveredItem(item.route, e)"
                @mouseleave="setHoveredItem(null)"
            >
            <i :class="item.icon" class="menu-icon"></i>
              <span
                  class="menu-tooltip"
                  v-show="hoveredItem === item.route"
                            >
                {{ item.title }}
              </span>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- ===== LOGOUT BUTTON ===== -->
      <div class="logout-wrapper">
        <button class="btn-logout" @click="authStore.logout()">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span class="logout-text">Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- Main content (chiếm toàn bộ width) -->
    <main class="flex-grow-1 bg-white overflow-auto py-2">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import backgroundImage from '/imgs/background_login.png'
import logoImage from '/imgs/logo.png'

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useSidebarStore } from '../stores/sidebarStore'

const authStore = useAuthStore()
const listPermission = authStore.listPermission

const hoveredItem = ref(null)

/* ===== MENU ===== */
const allMenuItems = [
  { label: 'PROJECT', route: '/-thg/du-an', icon: 'fa-solid fa-diagram-project text-info fs-5', title: 'Dự án' },
  { label: 'DEPARTMENT', route: '/-thg/phong-ban', icon: 'fa-solid fa-building-user text-primary fs-5', title: 'Phòng ban' },
  { label: 'TEAM', route: '/-thg/nhom', icon: 'fa-solid fa-people-group text-success fs-5', title: 'Nhóm' },
  { label: 'EMPLOYEE', route: '/-thg/nhan-vien', icon: 'fa-solid fa-user-tie text-warning fs-5', title: 'Nhân sự' },
  { label: 'TYPE', route: '/-thg/loai-hinh', icon: 'fa-solid fa-layer-group text-danger fs-5', title: 'Phân loại' },
  { label: 'PRODUCT', route: '/-thg/quan-ly-san-pham', icon: 'fa-solid fa-mountain-sun text-primary fs-5', title: 'Sản phẩm' },
  { label: 'SYSCUSTOMER', route: '/-thg/quan-ly-nguoi-dung', icon: 'fa-solid fa-address-book text-info fs-5', title: 'Người dùng' },
  { label: 'AUDIT', route: '/-thg/lich-su-he-thong', icon: 'fa-solid fa-clock-rotate-left text-danger fs-5', title: 'Audit Log' },
  { label: 'ROLE', route: '/-thg/phan-quyen', icon: 'fa-solid fa-shield-halved text-warning fs-5', title: 'Phân quyền' },
  { label: 'ADMIN', route: '/-thg/dinh-gia', icon: 'fa-solid fa-scale-balanced text-danger fs-5', title: 'Định giá' },
  { label: 'SERVICESYS', route: '/-thg/goi-he-thong', icon: 'fa-solid fa-boxes-stacked text-primary fs-5', title: 'Gói dịch vụ' },
  { label: 'APPOINTMENT', route: '/-thg/quan-ly-lich-hen', icon: 'fa-solid fa-calendar-check text-primary fs-5', title: 'Lịch hẹn' },
  { label: 'HOPDONG', route: '/-thg/quan-ly-hop-dong', icon: 'fa-solid fa-file-contract text-success fs-5', title: 'Hợp đồng' },
  { label: 'EDITER', route: '/-thg/quan-tri-noi-dung/trang-chu/noi-bat', icon: 'fa-solid fa-file-lines text-primary fs-5', title: 'Nội dung' },
  { label: 'RUT', route: '/-thg/yeu-cau-rut-tien', icon: 'fa-solid fa-money-bill-transfer text-success fs-5', title: 'Tài chính' },
  { label: 'YCHT', route: '/-thg/yeu-cau-hop-tac', icon: 'fa-solid fa-handshake text-primary fs-5', title: 'YC hợp tác' },
  { label: 'MRAKETINGINSERT', route: '/-thg/nhap-lieu', icon: 'fa-solid fa-file-import text-success fs-5', title: 'Nhập liệu KH' },
  { label: 'TELESALEUPDATE', route: '/-thg/telesale-lien-he-khach-hang', icon: 'fa-solid fa-database text-warning fs-5', title: 'Dữ liệu' },
  { label: 'CUSTOMERADMINALL', route: '/-thg/quan-tri-du-lieu', icon: 'fa-solid fa-users-gear text-danger fs-5', title: 'Quản trị KH' },
  { label: 'CONTACTMANAGE', route: '/-thg/quan-ly-lien-he', icon: 'fa-solid fa-address-book text-emerald-500 fs-5', title: 'KH liên hệ' },
  { label: 'REPORTMANAGE', route: '/-thg/quan-ly-bao-cao', icon: 'fa-solid fa-flag text-amber-500 fs-5', title: 'Báo cáo SP' }
]

const allowedLabels = computed(() =>
    listPermission.filter((p) => p.value === true).map((p) => p.label)
)

const filteredMenu = computed(() =>
    allMenuItems.filter((item) => allowedLabels.value.includes(item.label))
)

/* ===== SIDEBAR EDGE HOVER ===== */
const sidebar = useSidebarStore()
const isPointerInsideSidebar = ref(false)
const edgeThreshold = 10

const showSidebar = () => {
  if (!sidebar.isExpanded) sidebar.open()
}
const hideSidebar = () => {
  if (sidebar.isExpanded) sidebar.close()
}

const handleEdgeHover = (event) => {
  if (event.clientX <= edgeThreshold) {
    showSidebar()
    return
  }
  if (!isPointerInsideSidebar.value) hideSidebar()
}

const handleSidebarEnter = () => {
  isPointerInsideSidebar.value = true
  showSidebar()
}

const handleSidebarLeave = (event) => {
  isPointerInsideSidebar.value = false
  if (event.clientX > edgeThreshold) hideSidebar()
}

onMounted(() => {
  window.addEventListener('mousemove', handleEdgeHover)
  hideSidebar()
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleEdgeHover)
})

const tooltipY = ref(0)

const setHoveredItem = (route, event) => {
  hoveredItem.value = route
  if (event) {
    const rect = event.currentTarget.getBoundingClientRect()
    tooltipY.value = rect.top + rect.height / 2 -10
    document.documentElement.style.setProperty(
        '--tooltip-y',
        `${tooltipY.value}px`
    )
  }
}

</script>

<style scoped>
/* ==== LAYOUT ==== */
.sidebar-layout {
  background-position: left center;
  background-size: cover;
  transition: background-position 0.45s ease;
}
.sidebar-layout.layout-collapsed {
  background-position: -60px center;
}

/* ==== SIDEBAR FIXED (ĐÈ LÊN GIAO DIỆN) ==== */
.sidebar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 999999;

  margin: 10px;
  border-radius: 25px;

  width: 80px;
  min-width: 80px;
  max-width: 100px;

  background-image: linear-gradient(
      145deg,
      rgba(5, 25, 45, 0.95),
      rgba(1, 10, 25, 0.98)
  );

  color: white;
  backdrop-filter: blur(14px);

  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 16px;

  /* ✅ SHADOW ĐÚNG */
  box-shadow: 0 10px 28px rgb(0, 0, 0);

  transform: translateX(0);
  transition: transform 0.7s cubic-bezier(.3,.1,.2,1),
  opacity 0.5s ease;
}


/* ==== COLLAPSED ==== */
.sidebar-fixed.collapsed {
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
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
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.8) !important;
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
  color: white;
  cursor: pointer;
  transition: all .25s ease;
  border-radius: 10px;
}
.btn-logout:hover {
  background: white;
  transform: translateY(-2px);
}
.btn-logout i {
  color: white;
  transition: transform .25s ease, color .25s ease;
}
.btn-logout:hover i,
.btn-logout:hover .logout-text {
  color:  #ff4d4d;
}
.logout-text {
  white-space: nowrap;
  font-size: 10px;
}

/* scrollbar */
.menu-container::-webkit-scrollbar {
  width: 3px;
}
.menu-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

/* ==== MAIN CONTENT ==== */
main {
  width: 100%;
  margin-left: 0;
}
.menu-tooltip{
  position: fixed;
  left: 108px;
  top: var(--tooltip-y);
  transform: translateY(-50%);

  background: #fff;
  color: #111827;

  padding: 10px 14px 10px 8px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;

  /* phải bo tròn, trái ít bo */
  border-radius: 6px 14px 14px 6px;

  z-index: 1000000;
  pointer-events: none;

  /* BÓNG ĐEN – 4 PHÍA */
  box-shadow:
      0 0 0 1px rgba(0,0,0,0.06),
      0 10px 28px rgba(0,0,0,0.28),
      0 2px 8px rgba(0,0,0,0.18);

  animation: tooltipFadeIn .18s ease-out;
}

/* “mũi nhọn” bên trái = đúng chiều cao tooltip */
.menu-tooltip::before{
  content: "";
  position: absolute;
  top: 0;
  left: -11.5px;          /* độ dài mũi nhọn */
  width: 14px;
  height: 100%;         /* ✅ bằng chiều cao tooltip */
  background: #fff;

  /* tạo hình tam giác dài theo chiều cao */
  clip-path: polygon(100% 0, 0 50%, 100% 100%);

  /* bóng đen cho mũi nhọn để liền khối */
  filter: drop-shadow(-2px 0 6px rgba(0,0,0,0.22));
}

@keyframes tooltipFadeIn{
  from { opacity: 0; transform: translate(8px, -50%); }
  to   { opacity: 1; transform: translate(0, -50%); }
}


</style>