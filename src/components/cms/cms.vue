<template>
  <div class="cms-modern">
    <!-- Mobile Menu Toggle -->
    <button class="mobile-menu-toggle" @click="toggleMobileMenu" v-if="isMobile">
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" :class="{ active: showMobileMenu }" @click="closeMobileMenu"></div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{
      collapsed: isCollapsed && !isMobile,
      'mobile-active': showMobileMenu
    }">
      <!-- Logo Section -->
      <div class="sidebar-header">
        <div class="logo" v-if="!isCollapsed || isMobile">
          <img src="/imgs/logoTHG.png" alt="logoTHG" width="50px" height="50px">
          <span style="color:#374151;">QT. Nội dung</span>
        </div>
        <div class="logo-collapsed" v-else>
          <i class="fas fa-cube"></i>
        </div>
        <button class="collapse-toggle" @click="toggleCollapse" v-if="!isMobile">
          <i class="fas" :class="isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h4 class="section-label" v-if="!isCollapsed || isMobile">ĐIỀU HƯỚNG CHÍNH</h4>

          <ul class="nav-menu">
            <li v-for="item in menuData" :key="item.id">
              <div
                  class="nav-item"
                  :class="{
                  active: isMenuActive(item),
                  'has-children': hasChildren(item),
                  'expanded': isExpanded(item)
                }"
                  @click="toggleMenuItem(item)"
              >
                <div class="nav-link">
                  <i class="nav-icon" :class="getMenuIcon(item.slug)"></i>
                  <span class="nav-text" v-if="!isCollapsed || isMobile">{{ item.name }}</span>
                  <i
                      class="nav-chevron fas fa-chevron-down"
                      v-if="hasChildren(item) && (!isCollapsed || isMobile)"
                  ></i>
                </div>

                <!-- Submenu -->
                <ul
                    class="submenu"
                    v-if="hasChildren(item) && isExpanded(item) && (!isCollapsed || isMobile)"
                >
                  <li
                      v-for="(sectionName, sectionSlug) in item.sections"
                      :key="sectionSlug"
                      :class="{ active: isSectionActive(item.slug, sectionSlug) }"
                  >
                    <router-link
                        :to="getSectionPath(item.slug, sectionSlug)"
                        class="submenu-link"
                        @click="navigateToSection(item, sectionSlug, sectionName)"
                    >
                      <i class="fas fa-circle"></i>
                      <span>{{ sectionName }}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <!-- Active Page Info -->
<!--        <div class="active-page-info" v-if="(!isCollapsed || isMobile) && activePage">-->
<!--          <div class="info-card">-->
<!--            <div class="info-header">-->
<!--              <h5>Trang đang chỉnh sửa</h5>-->
<!--              <i class="fas fa-edit"></i>-->
<!--            </div>-->
<!--            <div class="info-content">-->
<!--              <h6>{{ activePage.name }}</h6>-->
<!--              <p>{{ activePage.type === 'parent' ? 'Trang chính' : 'Mục con' }}</p>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'sidebar-collapsed': isCollapsed && !isMobile }">
      <!-- Top Bar -->
      <header class="top-bar">
        <div class="breadcrumbs">
          <router-link to="/-thg/quan-tri-noi-dung" class="breadcrumb-item">
            <i class="fas fa-home"></i>
            <span>Trang quản trị</span>
          </router-link>
          <template v-if="activePage">
            <i class="fas fa-chevron-right breadcrumb-separator"></i>
            <span class="breadcrumb-item">{{ activePage.parentName || activePage.name }}</span>
            <template v-if="activePage.type === 'child'">
              <i class="fas fa-chevron-right breadcrumb-separator"></i>
              <span class="breadcrumb-item current">{{ activePage.name }}</span>
            </template>
          </template>
        </div>

<!--        <div class="top-actions">-->
<!--          <button class="btn btn-outline" @click="previewPage">-->
<!--            <i class="fas fa-eye"></i>-->
<!--            <span>Xem trước</span>-->
<!--          </button>-->
<!--          <button class="btn btn-primary" @click="saveChanges">-->
<!--            <i class="fas fa-save"></i>-->
<!--            <span>Lưu thay đổi</span>-->
<!--          </button>-->
<!--        </div>-->
      </header>

      <!-- Page Content -->
      <div class="page-content">
        <div class="content-wrapper">
          <router-view v-slot="{ Component }">
            <transition name="slide-fade" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// State
const isCollapsed = ref(false)
const showMobileMenu = ref(false)
const expandedItems = ref(new Set())
const activePage = ref(null)

// Menu data - giữ nguyên cấu trúc của bạn
const menuData = ref([
  {
    id: 1,
    name: 'Trang chủ',
    slug: 'trang-chu',
    sections: {
      'banner': 'Banner',
      'thong-ke': 'Số liệu thống kê',
      'noi-bat': 'Nổi bật',
      'dich-vu': 'Dịch vụ',
      'tong-quan': 'Tổng quan',
      'con-so-an-tuong': 'Những con số ấn tượng',
      'du-an-da-ban': 'Dự án đã bán',
      'danh-gia-khach-hang': 'Đánh giá của khách hàng',
      'danh-gia-he-thong': 'Đánh giá hệ thống',
      'anh-nen-danh-gia':'Ảnh nền đánh giá',
      'truyen-thong': 'Truyền Thông',
      'tin-tuc': 'Tin tức',
      'lien-he': 'Liên hệ',
    }
  },
  {
    id: 11,
    name: 'Trang chủ mới',
    slug: 'trang-chu-moi',
    sections: {
      'global-css': 'CSS toàn cục',
      'noi-dung-chinh': 'Nội dung chính'
    }
  },
  {
    id: 2,
    name: 'Tin tức',
    slug: 'tin-tuc',
    sections: {
      'tin-noi-bat': 'Tin tức nổi bật',
      'tin-moi-nhat': 'Tin tức mới nhất',
      'danh-muc-tin-tuc': 'Danh mục tin tức',
      'dang-ky-nhan-tin': 'Đăng ký nhận tin'
    }
  },
  {
    id: 3,
    name: 'Liên hệ',
    slug: 'lien-he',
    sections: {}
  },
  {
    id: 4,
    name: 'Bán nhanh',
    slug: 'ban-nhanh',
    sections: {
      'header': 'Header',
      'dinh-gia-so-bo': 'Định giá sơ bộ',
      'dong-y-gia-so-bo': 'Đồng ý giá sơ bộ',
      'khao-sat': 'Khảo sát',
      'danh-gia-giao-dich': 'Đánh giá giao dịch thực tế',
      'thoa-thuan': 'Thỏa thuận và ký kết hợp đồng triển khai bán trong 30 ngày',
      'y-tuong': 'Lên ý tưởng chiến lược trên từng bất động sản',
      'trien-khai': 'Triển khai bán nhanh bất động sản',
      'tu-van-ho-tro': 'Tư vấn hỗ trợ chủ nhà và khách hàng',
      'ho-tro-dam-phan': 'Hỗ trợ đàm phán để bán được giá cao nhất',
      'ho-tro-phap-ly': 'Hỗ trợ pháp lý 100% đến khi hoàn tất giao dịch',
      'loi-ich': 'Lợi ích',
      'popup': 'Popup',
      'anh-nen-3': 'Ảnh nền'
    }
  },
  {
    id: 5,
    name: 'Định giá BĐS',
    slug: 'dinh-gia-bds',
    sections: {
      'header': 'Header',
      'quy-trinh-dinh-gia': 'Quy trình định giá',
      'cac-buoc-trong-quy-trinh':'Các bước trong quy trình',
      'gia-tri-bds-dua-tren': 'Giá trị bất động sản dựa trên',
      'ly-do': 'Lý do',
      'bang-phi': 'Bảng phí',
      'tinh-phi-nhanh': 'Tính phí nhanh',
      'cau-hoi-thuong-gap': 'Các câu hỏi thường gặp'
    }
  },
  {
    id: 6,
    name: 'Tuyển dụng',
    slug: 'tuyen-dung',
    sections: {
      'header':'Header',
      'noi-bat':'Nổi bật',
      'loi-ich':'Lợi ích',
      'co-hoi-viec-lam':'Cơ hội việc làm',
      'vi-tri-dang-tuyen': 'Vị trí đang tuyển',
      'bai-viet-tuyen-dung': 'Bài viết tuyển dụng',
      'form-ung-tuyen': 'Form ứng tuyển'
    }
  },
  {
    id: 7,
    name: 'Cộng tác viên',
    slug: 'cong-tac-vien',
    sections: {}
  },
  {
    id: 8,
    name: 'Hợp tác',
    slug: 'hop-tac',
    sections: {
      'noi-bat': 'Nổi bật',
      'danh-sach': 'Danh sách chi nhánh',
      'hop-thoai': 'Hộp thoại đầu tư',
      'chi-tiet-noi-bat': "Chi tiết - Nổi bật",
      'chi-tiet-goi-dang-ky': 'Chi tiết - Gói đăng ký',
      'chi-tiet-danh-sach-nguoi-hop-tac': 'Chi tiết - Danh sách người hợp tác'
    }
  },
  {
    id: 9,
    name: 'Quản lý tin tức',
    slug: 'quan-ly-tin-tuc'
  }
])

// Computed
const isMobile = computed(() => window.innerWidth <= 768)

// Methods - Icon mapping
const getMenuIcon = (slug) => {
  const icons = {
    'trang-chu': 'fas fa-home',
    'trang-chu-moi': 'fas fa-home',
    'tin-tuc': 'fas fa-newspaper',
    'lien-he': 'fas fa-envelope',
    'ban-nhanh': 'fas fa-bolt',
    'dinh-gia-bds': 'fas fa-calculator',
    'tuyen-dung': 'fas fa-users',
    'cong-tac-vien': 'fas fa-handshake',
    'dau-tu': 'fas fa-chart-line',
    'hop-tac': 'fa-solid fa-sack-dollar',
    'quan-ly-tin-tuc': 'fa-regular fa-folder-open'
  }
  return icons[slug] || 'fas fa-file'
}

const hasChildren = (item) => {
  return item.sections && Object.keys(item.sections).length > 0
}

const isMenuActive = (item) => {
  if (!activePage.value) return false
  return activePage.value.parentId === item.id || activePage.value.id === item.id
}

const isExpanded = (item) => {
  return expandedItems.value.has(item.id)
}

const isSectionActive = (pageSlug, sectionSlug) => {
  const pathParts = route.path.split('/').filter(part => part.length > 0)
  const currentPageSlug = pathParts[pathParts.length - 2]
  const currentSectionSlug = pathParts[pathParts.length - 1]

  return currentPageSlug === pageSlug && currentSectionSlug === sectionSlug
}

const toggleMenuItem = (item) => {
  // Nếu có submenu thì toggle expand
  if (hasChildren(item)) {
    if (expandedItems.value.has(item.id)) {
      expandedItems.value.delete(item.id)
    } else {
      expandedItems.value.add(item.id)

      // Auto navigate to first section if not already on a section
      if (!isMenuActive(item)) {
        const firstSection = Object.keys(item.sections)[0]
        if (firstSection) {
          navigateToSection(item, firstSection, item.sections[firstSection])
        }
      }
    }
  } else {
    // Menu không có submenu, chỉ cập nhật active state
    activePage.value = {
      id: item.id,
      name: item.name,
      type: 'parent',
      slug: item.slug
    }
    router.push(`/-thg/quan-tri-noi-dung/${item.slug}`)
  }

  if (isMobile.value) {
    closeMobileMenu()
  }
}

const navigateToSection = (parent, sectionSlug, sectionName) => {
  activePage.value = {
    id: sectionSlug,
    name: sectionName,
    type: 'child',
    parentId: parent.id,
    parentName: parent.name,
    parentSlug: parent.slug
  }

  // Đảm bảo menu cha được expanded
  expandedItems.value.add(parent.id)

  if (isMobile.value) {
    closeMobileMenu()
  }
}

const getSectionPath = (pageSlug, sectionSlug) => {
  return `/-thg/quan-tri-noi-dung/${pageSlug}/${sectionSlug}`
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  // Clear expanded items khi collapse
  if (isCollapsed.value) {
    expandedItems.value.clear()
  }
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const previewPage = () => {
  window.open('/', '_blank')
}

const saveChanges = () => {
  console.log('Đã lưu thay đổi')
}

const updateActivePageFromRoute = () => {
  const path = route.path
  const segments = path.split('/').filter(seg => seg && seg !== '-thg' && seg !== 'quan-tri-noi-dung')

  if (segments.length === 0) {
    // Đang ở trang chủ quản trị
    const homeItem = menuData.value.find(item => item.slug === 'trang-chu')
    if (homeItem) {
      activePage.value = {
        id: homeItem.id,
        name: homeItem.name,
        type: 'parent',
        slug: homeItem.slug
      }
      expandedItems.value.add(homeItem.id)
    }
    return
  }

  const pageSlug = segments[0]
  const sectionSlug = segments[1]

  const parent = menuData.value.find(item => item.slug === pageSlug)

  if (parent) {
    if (sectionSlug && parent.sections && parent.sections[sectionSlug]) {
      // Đang ở section con
      activePage.value = {
        id: sectionSlug,
        name: parent.sections[sectionSlug],
        type: 'child',
        parentId: parent.id,
        parentName: parent.name,
        parentSlug: parent.slug
      }
      expandedItems.value.add(parent.id)
    } else {
      // Đang ở trang chính
      activePage.value = {
        id: parent.id,
        name: parent.name,
        type: 'parent',
        slug: parent.slug
      }
      // Nếu có sections thì expand
      if (hasChildren(parent)) {
        expandedItems.value.add(parent.id)
      }
    }
  }
}

// Lifecycle
onMounted(() => {
  updateActivePageFromRoute()

  // Handle resize
  const handleResize = () => {
    if (window.innerWidth > 768) {
      showMobileMenu.value = false
    }
  }

  window.addEventListener('resize', handleResize)
})

watch(() => route.path, updateActivePageFromRoute)
</script>

<style scoped>
.cms-modern {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: #4f46e5;
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);
}

/* Sidebar */
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 1000;
  position: relative;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar.mobile-active {
  transform: translateX(0);
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.logo i {
  color: #4f46e5;
  font-size: 24px;
}

.logo-collapsed {
  width: 100%;
  display: flex;
  justify-content: center;
}

.logo-collapsed i {
  color: #4f46e5;
  font-size: 24px;
}

.collapse-toggle {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.collapse-toggle:hover {
  background: #f3f4f6;
  color: #4f46e5;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 32px;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 4px;
  border-radius: 8px;
  overflow: hidden;
}

.nav-item.active {
  background: #eef2ff;
}

.nav-item.active .nav-link {
  color: #4f46e5;
}

.nav-item.active .nav-icon {
  color: #4f46e5;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  user-select: none;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  background: #f9fafb;
}

.nav-icon {
  width: 20px;
  margin-right: 12px;
  color: #9ca3af;
  text-align: center;
}

.nav-text {
  flex: 1;
}

.nav-chevron {
  font-size: 12px;
  color: #9ca3af;
  transition: transform 0.2s;
}

.nav-item.expanded .nav-chevron {
  transform: rotate(180deg);
}

/* Submenu */
.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.submenu li {
  border-bottom: 1px solid #e5e7eb;
}

.submenu li:last-child {
  border-bottom: none;
}

.submenu li.active {
  background: #e0e7ff;
}

.submenu li.active .submenu-link {
  color: #4f46e5;
}

.submenu-link {
  display: flex;
  align-items: center;
  padding: 10px 16px 10px 48px;
  color: #4b5563;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s;
}

.submenu-link:hover {
  background: #f3f4f6;
}

.submenu-link i {
  font-size: 6px;
  margin-right: 12px;
  color: #9ca3af;
}

/* Active Page Info */
.active-page-info {
  margin-top: auto;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.info-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-header h5 {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  font-weight: 600;
}

.info-header i {
  color: #9ca3af;
}

.info-content h6 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
}

.info-content p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.main-content.sidebar-collapsed {
  margin-left: 0;
}

/* Top Bar */
.top-bar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.breadcrumb-item:hover {
  color: #4f46e5;
}

.breadcrumb-item.current {
  color: #1f2937;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #d1d5db;
  font-size: 12px;
}

.top-actions {
  display: flex;
  gap: 12px;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  border: none;
  outline: none;
}

.btn-outline {
  background: white;
  color: #4f46e5;
  border: 1px solid #e0e7ff;
}

.btn-outline:hover {
  background: #f8fafc;
  border-color: #4f46e5;
}

.btn-primary {
  background: #4f46e5;
  color: white;
}

.btn-primary:hover {
  background: #4338ca;
}

/* Page Content */
.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 280px !important;
  }

  .sidebar.mobile-active {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
  }

  .sidebar-overlay.active {
    opacity: 1;
    visibility: visible;
  }

  .main-content {
    width: 100%;
  }

  .top-bar {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    padding: 20px;
  }

  .top-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

/* Desktop collapsed styles */
@media (min-width: 769px) {
  .sidebar.collapsed .logo span,
  .sidebar.collapsed .section-label,
  .sidebar.collapsed .nav-text,
  .sidebar.collapsed .nav-chevron,
  .sidebar.collapsed .active-page-info,
  .sidebar.collapsed .submenu {
    display: none;
  }

  .sidebar.collapsed .nav-link {
    justify-content: center;
    padding: 12px;
  }

  .sidebar.collapsed .nav-icon {
    margin: 0;
    font-size: 18px;
  }

  .sidebar.collapsed .nav-item {
    position: relative;
  }

  .sidebar.collapsed .nav-item:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    background: #1f2937;
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    white-space: nowrap;
    z-index: 1000;
    pointer-events: none;
    animation: tooltipFade 0.2s ease;
  }

  @keyframes tooltipFade {
    from {
      opacity: 0;
      transform: translateY(-50%) translateX(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
  }
}

/* Scrollbar Styling */
.sidebar-nav::-webkit-scrollbar,
.page-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track,
.page-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar-nav::-webkit-scrollbar-thumb,
.page-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover,
.page-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>