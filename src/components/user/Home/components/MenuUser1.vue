<template>
  <nav class="navbar fixed-menu" ref="menuRef">
    <div class="logo" @click="router.push('/')"><img src="/imgs/logoTHG.png"></div>
    <ul class="nav-links" id="nav-links">
      <!--ĐÁNH DẤU-->
      <li class="nav-item home-item">
        <router-link to="/" class="nav-link" exact>
          <i class="fa-solid fa-house"></i> Trang chủ
        </router-link>
      </li>

      <!-- GIẢI PHÁP Submenu -->
      <li class="nav-item dropdown solution-item" :class="{ 'active': isSolutionActive }">
        <router-link to="/giai-phap" class="nav-link" id="solution-link" @click.prevent="toggleSubmenu('solution')" data-text="Giải pháp">
          <i class="fa-solid fa-lightbulb"></i> Giải pháp
          <span class="dropdown-arrow">▼</span>
        </router-link>
        <div class="submenu" id="solution-submenu">
          <!-- Mobile Header for Submenu -->
          <div class="submenu-mobile-header">
            <button class="back-button" id="solution-back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#031358" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </button>
            <span class="submenu-mobile-title">Giải pháp</span>
          </div>
          <div class="divider-line"></div>

          <div class="submenu-columns">
            <div class="submenu-column">
              <h3>Giải pháp</h3>
              <ul class="submenu-links">
                <li>
                  <router-link to="/giai-phap-ban-nhanh" class="submenu-link" @click="closeAllSubmenus">
                    <i class="fa-solid fa-bolt"></i> Bán nhanh 30N
                  </router-link>
                </li>
                <li>
                  <router-link to="/dinh-gia-bds" class="submenu-link" @click="closeAllSubmenus">
                    <i class="fa-solid fa-fire"></i> Định giá
                  </router-link>
                </li>
                <li>
                  <a href="#" class="submenu-link" @click.prevent="closeAllSubmenus">
                    <i class="fa-solid fa-bullhorn"></i> Truyền thông
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>

      <li class="nav-item consignment-item">
        <router-link to="/san-pham-thien-ha" class="nav-link">
          <i class="fa-solid fa-box"></i> Mua và bán
        </router-link>
      </li>
      <li class="nav-item project-item">
        <router-link to="/tinh-nang-dang-phat-trien" class="nav-link">
          <i class="fas fa-project-diagram column-icon"></i> Dự án
        </router-link>
      </li>

      <!-- TUYỂN DỤNG Submenu -->
      <li class="nav-item dropdown recruitment-item" :class="{ 'active': isRecruitmentActive }">
        <router-link to="/tuyen-dung-menu" class="nav-link" id="recruitment-link" @click.prevent="toggleSubmenu('recruitment')" data-text="Tuyển dụng">
          <i class="fas fa-users"></i> Tuyển dụng
          <span class="dropdown-arrow">▼</span>
        </router-link>
        <div class="submenu" id="recruitment-submenu">
          <!-- Mobile Header for Submenu -->
          <div class="submenu-mobile-header">
            <button class="back-button" id="recruitment-back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#031358" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </button>
            <span class="submenu-mobile-title">Tuyển dụng</span>
          </div>
          <div class="divider-line"></div>

          <div class="submenu-columns">
            <div class="submenu-column">
              <h3>Tuyển dụng</h3>
              <ul class="submenu-links">
                <li>
                  <router-link to="/tuyen-dung" class="submenu-link" @click="closeAllSubmenus">
                    <i class="fas fa-users"></i> Tuyển dụng THG
                  </router-link>
                </li>
                <li>
                  <router-link to="/cong-viec-cong-tac-vien" class="submenu-link" @click="closeAllSubmenus">
                    <i class="fa-solid fa-clipboard-user"></i> Ứng tuyển CTV
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>

      <li class="nav-item news-item">
        <router-link to="/tin-tuc" class="nav-link">
          <i class="fas fa-newspaper"></i> Tin tức
        </router-link>
      </li>
      <li class="nav-item contact-item">
        <router-link to="/lien-he" class="nav-link">
          <i class="fas fa-address-book"></i> Liên hệ
        </router-link>
      </li>
      <li class="divider">|</li>
    </ul>
    <div class="nav-right">
      <div class="nav-icons">
        <router-link to="/tinh-nang-dang-phat-trien" class="icon-link">
          <i class="fas fa-search"></i>
        </router-link>

        <!-- User Icon with Submenu -->
        <div class="user-menu-container">
          <a href="#" class="icon-link user-icon" id="user-icon">
            <i class="fa-solid fa-user"></i>
          </a>
          <div class="user-submenu" id="user-submenu">
            <router-link to="/ho-so/trung-tam-tai-khoan" class="user-submenu-link">
              <i class="fas fa-user-circle"></i> Cá nhân
            </router-link>
            <router-link v-if="auth.userInfo == null" to="/dang-nhap" class="user-submenu-link">
              <i class="fas fa-sign-in-alt"></i> Đăng nhập
            </router-link>
            <a v-else href="#" class="user-submenu-link" @click.prevent="handleLogout">
              <i class="fas fa-sign-out-alt"></i> Đăng xuất
            </a>
          </div>
        </div>
      </div>

      <!-- Mobile Hamburger MenuUser -->
      <div class="hamburger" id="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>
  <div class="main-content">
    <router-view></router-view>
  </div>
  <Footer :showMap="!route.meta.hideFooterMap" />
  <PopupQuickSale v-if="showQSPopup" @close="closePopup"></PopupQuickSale>
</template>

<script setup>
import {ref, onMounted, onUnmounted, nextTick, computed, watch, onBeforeUnmount} from "vue";
import {useRoute, useRouter} from 'vue-router'
import Footer from "./Footer.vue";
import {useAuthStore} from "../../../../stores/authStore.js";
import PopupQuickSale from "../../QuickSaleSolution/Components/PopupQuickSale.vue";

const auth = useAuthStore();
const menuRef = ref(null);
const navLinks = ref(null);
const hamburger = ref(null);
const solutionSubmenu = ref(null);
const recruitmentSubmenu = ref(null);
const userSubmenu = ref(null);
const userMenuContainer = ref(null);

const route = useRoute()
const router = useRouter();

const showQSPopup = ref(route.meta.showQSPopup || false);

const resetMobileMenuState = () => {
  if (menuRef.value) {
    menuRef.value.classList.remove('hide-menu');
  }
  lastY = 0;
  upDistance = 0;

  if (window.innerWidth > 1024) return;

  if (solutionSubmenu.value) {
    solutionSubmenu.value.classList.remove('active');
  }
  if (recruitmentSubmenu.value) {
    recruitmentSubmenu.value.classList.remove('active');
  }
  if (userSubmenu.value) {
    userSubmenu.value.classList.remove('active');
  }
  if (navLinks.value) {
    navLinks.value.classList.remove('active');
  }
  if (hamburger.value) {
    hamburger.value.classList.remove('active');
  }
};

// Computed properties for active state - Cập nhật để bao gồm cả route giả
const isSolutionActive = computed(() => {
  return route.path === '/giai-phap' ||
      route.path === '/giai-phap-ban-nhanh' ||
      route.path === '/dinh-gia-bds' ||
      route.path.startsWith('/giai-phap');
});

const isRecruitmentActive = computed(() => {
  return route.path === '/tuyen-dung-menu' ||
      route.path === '/tuyen-dung' ||
      route.path === '/cong-viec-cong-tac-vien' ||
      route.path.startsWith('/tuyen-dung');
});

// Watch route changes
watch(
    () => route.fullPath,
    () => {
      showQSPopup.value = route.meta.showQSPopup || false;
      resetMobileMenuState();
    }
);

const closePopup = () => {
  showQSPopup.value = false;
};

let lastY = 0;
let upDistance = 0;
const needUp = 500;

// Biến để quản lý timeout
let userSubmenuTimeout = null;
let solutionSubmenuTimeout = null;
let recruitmentSubmenuTimeout = null;

// Hàm xử lý đăng xuất
const handleLogout =async () => {
  const store = useAuthStore();
  await store.logout();
};

const toggleSubmenu = (type) => {
  if (window.innerWidth <= 1024) {
    // Mobile behavior
    if (type === 'solution' && solutionSubmenu.value) {
      solutionSubmenu.value.classList.toggle('active');
      if (recruitmentSubmenu.value) {
        recruitmentSubmenu.value.classList.remove('active');
      }
    } else if (type === 'recruitment' && recruitmentSubmenu.value) {
      recruitmentSubmenu.value.classList.toggle('active');
      if (solutionSubmenu.value) {
        solutionSubmenu.value.classList.remove('active');
      }
    }
  } else {
    // Desktop: chỉ active submenu, không thực sự chuyển route
    // Chúng ta sẽ dùng @click.prevent nên không chuyển hướng
  }
};

// Hàm đóng tất cả submenus
const closeAllSubmenus = () => {
  resetMobileMenuState();
};

// Hàm ẩn menu khi click router-link
const hideMenuOnLinkClick = () => {
  if (!navLinks.value) return;

  const allRouterLinks = navLinks.value.querySelectorAll('.nav-link, .submenu-link, .user-submenu-link');

  allRouterLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      // Chỉ xử lý trên mobile
      if (window.innerWidth <= 1024) {
        const isDropdownToggle = link.classList.contains('nav-link') && link.closest('.dropdown');
        if (!isDropdownToggle) {
          closeAllSubmenus();
        }
      }
    });
  });
};

// Hàm xử lý đóng menu khi cuộn trên mobile
const handleScrollForMobileMenu = () => {
  if (window.innerWidth <= 1024) {
    // Đóng menu chính và các submenu khi cuộn
    if (navLinks.value?.classList.contains('active')) {
      navLinks.value.classList.remove('active');
    }

    if (hamburger.value?.classList.contains('active')) {
      hamburger.value.classList.remove('active');
    }

    if (solutionSubmenu.value?.classList.contains('active')) {
      solutionSubmenu.value.classList.remove('active');
    }

    if (recruitmentSubmenu.value?.classList.contains('active')) {
      recruitmentSubmenu.value.classList.remove('active');
    }

    if (userSubmenu.value?.classList.contains('active')) {
      userSubmenu.value.classList.remove('active');
    }
  }
};

const handleScroll = () => {
  const y = window.scrollY;

  if (y === 0) {
    menuRef.value?.classList.remove("hide-menu");
    upDistance = 0;
    lastY = y;
    return;
  }

  if (y > lastY) {
    upDistance = 0;
    menuRef.value?.classList.add("hide-menu");
  } else {
    upDistance += lastY - y;
    if (upDistance >= needUp) {
      menuRef.value?.classList.remove("hide-menu");
      upDistance = 0;
    }
  }

  lastY = y;
};

// Hàm kết hợp cả xử lý ẩn menu và đóng menu mobile
const combinedScrollHandler = () => {
  handleScroll(); // Giữ nguyên chức năng ẩn menu khi cuộn
  handleScrollForMobileMenu(); // Đóng menu trên mobile
};

// Hàm xử lý submenu hover
const setupSubmenuHover = (container, submenu) => {
  if (!container || !submenu) return;

  let timeout = null;

  container.addEventListener('mouseenter', function () {
    if (window.innerWidth > 1024) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      submenu.classList.add('active');
    }
  });

  container.addEventListener('mouseleave', function (e) {
    if (window.innerWidth > 1024) {
      const relatedTarget = e.relatedTarget;
      if (relatedTarget && submenu.contains(relatedTarget)) {
        return;
      }

      timeout = setTimeout(function () {
        submenu.classList.remove('active');
        timeout = null;
      }, 300);
    }
  });

  submenu.addEventListener('mouseenter', function () {
    if (window.innerWidth > 1024) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    }
  });

  submenu.addEventListener('mouseleave', function (e) {
    if (window.innerWidth > 1024) {
      const relatedTarget = e.relatedTarget;
      if (relatedTarget && container.contains(relatedTarget)) {
        return;
      }

      timeout = setTimeout(function () {
        submenu.classList.remove('active');
        timeout = null;
      }, 200);
    }
  });

  return timeout;
};

const initializeMenu = () => {
  const hamburgerEl = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');
  const userIcon = document.getElementById('user-icon');
  const userSubmenuEl = document.getElementById('user-submenu');
  const userMenuContainerEl = document.querySelector('.user-menu-container');
  const solutionLink = document.getElementById('solution-link');
  const solutionSubmenuEl = document.getElementById('solution-submenu');
  const solutionBack = document.getElementById('solution-back');
  const recruitmentLink = document.getElementById('recruitment-link');
  const recruitmentSubmenuEl = document.getElementById('recruitment-submenu');
  const recruitmentBack = document.getElementById('recruitment-back');

  if (!hamburgerEl || !navLinksEl || !userIcon || !userSubmenuEl || !userMenuContainerEl) {
    console.log('Một hoặc nhiều phần tử không được tìm thấy, hàm initializeMenu bị dừng');
    return;
  }

  // Gán refs
  hamburger.value = hamburgerEl;
  navLinks.value = navLinksEl;
  userSubmenu.value = userSubmenuEl;
  userMenuContainer.value = userMenuContainerEl;
  solutionSubmenu.value = solutionSubmenuEl;
  recruitmentSubmenu.value = recruitmentSubmenuEl;

  // Desktop submenu behavior for User
  userMenuContainerEl.addEventListener('mouseenter', function () {
    if (window.innerWidth > 1024) {
      if (userSubmenuTimeout) {
        clearTimeout(userSubmenuTimeout);
        userSubmenuTimeout = null;
      }
      userSubmenuEl.classList.add('active');
    }
  });

  userMenuContainerEl.addEventListener('mouseleave', function (e) {
    if (window.innerWidth > 1024) {
      const relatedTarget = e.relatedTarget;
      if (relatedTarget && userSubmenuEl.contains(relatedTarget)) {
        return;
      }

      userSubmenuTimeout = setTimeout(function () {
        userSubmenuEl.classList.remove('active');
        userSubmenuTimeout = null;
      }, 300);
    }
  });

  userSubmenuEl.addEventListener('mouseenter', function () {
    if (window.innerWidth > 1024) {
      if (userSubmenuTimeout) {
        clearTimeout(userSubmenuTimeout);
        userSubmenuTimeout = null;
      }
    }
  });

  userSubmenuEl.addEventListener('mouseleave', function (e) {
    if (window.innerWidth > 1024) {
      const relatedTarget = e.relatedTarget;
      if (relatedTarget && userMenuContainerEl.contains(relatedTarget)) {
        return;
      }

      userSubmenuTimeout = setTimeout(function () {
        userSubmenuEl.classList.remove('active');
        userSubmenuTimeout = null;
      }, 200);
    }
  });

  // Setup submenu hover for Solution
  if (solutionLink && solutionSubmenuEl) {
    solutionSubmenuTimeout = setupSubmenuHover(solutionLink.parentElement, solutionSubmenuEl);
  }

  // Setup submenu hover for Recruitment
  if (recruitmentLink && recruitmentSubmenuEl) {
    recruitmentSubmenuTimeout = setupSubmenuHover(recruitmentLink.parentElement, recruitmentSubmenuEl);
  }

  // Mobile menu toggle
  hamburgerEl.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    navLinksEl.classList.toggle('active');
    hamburgerEl.classList.toggle('active');

    if (!navLinksEl.classList.contains('active')) {
      userSubmenuEl.classList.remove('active');
      if (solutionSubmenuEl) solutionSubmenuEl.classList.remove('active');
      if (recruitmentSubmenuEl) recruitmentSubmenuEl.classList.remove('active');
    }
  });

  // Mobile submenu toggle for Solution (sử dụng hàm toggleSubmenu)
  if (solutionBack && solutionSubmenuEl) {
    solutionBack.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      solutionSubmenuEl.classList.remove('active');
    });
  }

  // Mobile submenu toggle for Recruitment (sử dụng hàm toggleSubmenu)
  if (recruitmentBack && recruitmentSubmenuEl) {
    recruitmentBack.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      recruitmentSubmenuEl.classList.remove('active');
    });
  }

  // Mobile submenu toggle for User
  userIcon.addEventListener('click', function (e) {
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      e.stopPropagation();
      userSubmenuEl.classList.toggle('active');
      // Đóng các submenu khác
      if (solutionSubmenuEl) solutionSubmenuEl.classList.remove('active');
      if (recruitmentSubmenuEl) recruitmentSubmenuEl.classList.remove('active');
    }
  });

  // Close menu when clicking outside on mobile
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 1024) {
      const isClickInsideMenu =
          navLinksEl.contains(e.target) ||
          hamburgerEl.contains(e.target) ||
          (solutionSubmenuEl && solutionSubmenuEl.contains(e.target)) ||
          (recruitmentSubmenuEl && recruitmentSubmenuEl.contains(e.target)) ||
          userSubmenuEl.contains(e.target);

      if (!isClickInsideMenu) {
        navLinksEl.classList.remove('active');
        hamburgerEl.classList.remove('active');
        if (solutionSubmenuEl) solutionSubmenuEl.classList.remove('active');
        if (recruitmentSubmenuEl) recruitmentSubmenuEl.classList.remove('active');
        userSubmenuEl.classList.remove('active');
      }
    }
  });

  // Gọi hàm ẩn menu khi click router-link
  hideMenuOnLinkClick();

  // Adjust behavior on window resize
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
      navLinksEl.classList.remove('active');
      hamburgerEl.classList.remove('active');
      userSubmenuEl.classList.remove('active');
      if (solutionSubmenuEl) solutionSubmenuEl.classList.remove('active');
      if (recruitmentSubmenuEl) recruitmentSubmenuEl.classList.remove('active');
    }
  });
};

let chatScript = null

// Trong onMounted, thay đổi sự kiện scroll
onMounted(() => {
  window.addEventListener("scroll", combinedScrollHandler); // Thay handleScroll bằng combinedScrollHandler

  nextTick(() => {
    initializeMenu();
  });

  chatScript = document.createElement('script')
  chatScript.src = 'https://api.sale.ai.vn/static/widget.js?chatbotId=MjIz'
  chatScript.async = true
  chatScript.id = 'botchat-script'
  document.body.appendChild(chatScript)
});

onUnmounted(() => {
  window.removeEventListener("scroll", combinedScrollHandler); // Cũng thay ở đây

  // Clear timeout khi component unmount
  if (userSubmenuTimeout) {
    clearTimeout(userSubmenuTimeout);
  }
  if (solutionSubmenuTimeout) {
    clearTimeout(solutionSubmenuTimeout);
  }
  if (recruitmentSubmenuTimeout) {
    clearTimeout(recruitmentSubmenuTimeout);
  }
});

onBeforeUnmount(() => {
  if (chatScript) {
    document.body.removeChild(chatScript)
  }
})
</script>

<style scoped>
/* ===== BREAKPOINTS CHUẨN ===== */
/*
  - Mobile: 0-767px
  - Tablet: 768px-1023px
  - Desktop nhỏ: 1024px-1279px
  - Desktop trung bình: 1280px-1439px
  - Desktop lớn: 1440px trở lên
*/

/* ===== HIỆU ỨNG HOVER MỚI - TRƯỢT TỪ TRÁI SANG PHẢI ===== */
.nav-item > .nav-link {
  border-radius: 14px;
  padding: 8px 16px;
  transition: color 0.3s ease;
  position: relative;
  overflow: hidden;
  z-index: 1;
  margin: 0 2px;
}

/* Hiệu ứng nền trượt từ trái sang phải */
.nav-item > .nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  border-radius: 14px;
  z-index: -1;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hide-menu {
  transform: translateY(-60px);
  transition: transform 0.5s ease;
}

nav {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  align-items: center;
}

nav {
  font-family: 'Ubuntu', sans-serif;
  background-color: #f8f9fa;
}

ul {
  margin: 0;
  padding: 0;
}

.navbar {
  height: 60px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.logo {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: 4px;
  z-index: 1001;
}

.logo img {
  height: 100%;
  width: 100%;
}

.nav-links {
  display: flex;
  list-style: none;
  height: 100%;
  align-items: center;
  transition: all 1s ease;
  gap: 2px;
}

.nav-item {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 15px;
  height: 85%;
  position: relative;
  transition: all 0.3s ease;
  color: #333;
  white-space: nowrap;
  font-weight: normal;
}

.nav-link img, .nav-link i {
  margin-right: 8px;
  font-size: 16px;
}

.logo img {
  width: auto;
  height: 80%;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  width: 0;
  height: 50px;
  transform: translateX(-50%);
  transition: width 0.3s ease;
  z-index: -1;
  border-radius: 4px;
  margin-top: 15px;
  top: -10px;
}

/* ===== ACTIVE STATE - KHÔNG IN ĐẬM, DÙNG MÀU TƯƠNG ỨNG ===== */
.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  font-weight: normal;
  position: relative;
  color: inherit;
}

.nav-link.router-link-active::after,
.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  width: calc(100% - 32px);
  height: 3px;
  background-color: currentColor;
  border-radius: 2px;
  left: 50%;
  transform: translateX(-50%);
  bottom: -8px;
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animation cho thanh active */
@keyframes slideIn {
  from {
    width: 0;
  }
  to {
    width: calc(100% - 32px);
  }
}

/* Responsive từ 1024px đến 1279px - Desktop nhỏ */
@media (min-width: 1024px) and (max-width: 1279px) {
  .nav-link {
    position: relative;
    padding: 8px 12px;
  }

  .nav-link:not(.router-link-active):not(.router-link-exact-active):not(:hover) {
    font-size: 0;
  }

  .nav-link:not(.router-link-active):not(.router-link-exact-active):not(:hover) i,
  .nav-link:not(.router-link-active):not(.router-link-exact-active):not(:hover) img {
    font-size: 16px;
    margin-right: 0;
    opacity: 1;
    visibility: visible;
  }

  .nav-link.router-link-active,
  .nav-link.router-link-exact-active {
    font-size: 15px;
  }

  .nav-link.router-link-active i,
  .nav-link.router-link-exact-active i {
    margin-right: 8px;
  }

  .nav-link:hover {
    font-size: 15px;
  }

  .nav-link:hover i {
    margin-right: 8px;
  }

  .nav-item {
    margin: 0 4px;
  }

  .logo img {
    height: 70%;
  }
}

/* Desktop trung bình */
@media (min-width: 1280px) and (max-width: 1439px) {
  .navbar {
    padding: 0 30px;
  }
}

/* Mobile & Tablet */
@media (max-width: 1023px) {
  .navbar {
    padding: 0 20px;
  }

  .nav-link.router-link-active::after,
  .nav-link.router-link-exact-active::after {
    bottom: 5px;
    width: calc(100% - 30px);
  }

  .submenu-link {
    padding: 12px 16px;
    font-size: 14px;
    margin: 0;
    border-radius: 0;
    border-bottom: 1px solid #ddd !important;
  }
}


.divider {
  color: #ddd;
  font-size: 20px;
  margin: 0 5px;
}

/* Nav Right Section */
.nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-icons {
  display: flex;
  align-items: center;
}

.icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #031358;
  font-size: 18px;
  margin-left: 3px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.icon-link:hover {
  background-color: #f0f0f0;
}

.submenu {
  width: auto;
  min-width: 200px;
  max-width: none;
  padding: 16px 24px;
  border-radius: 14px;
  display: none;
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  padding: 8px 0;
  color: #333;
  text-decoration: none;
  border-bottom: 0.4px solid rgba(31, 31, 31, 0.13) !important;
}

.submenu-link:last-child {
  border-bottom: none;
}

/* ===== SUBMENU DESKTOP - FIX LỖI XUỐNG DÒNG ===== */
@media (min-width: 1024px) {
  .submenu {
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%) translateY(-10px) scale(0.98);
    width: auto;
    padding: 20px 24px;
    border-radius: 16px;
    background: linear-gradient(180deg, #ffffff, #f8fafc);
    box-shadow: 0 20px 40px rgba(0,0,0,.12),
    inset 0 0 0 1px rgba(99,102,241,.12);
    display: none;
    z-index: 1001;
    white-space: nowrap;
    animation: submenuFade .25s ease;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .submenu.active {
    display: block;
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
    pointer-events: auto;
  }

  .submenu-columns {
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    gap: 8px;
  }

  .submenu-column {
    min-width: 0;
  }

  .submenu-column h3 {
    color: #031358;
    font-size: 16px;
    margin-bottom: 15px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .submenu-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .submenu-link {
    overflow: visible;
    text-overflow: unset;
  }

  .submenu-link:hover {
    color: #031358;
    background-color: #f8f9fa;
  }

  /* MENU CÓ CON - HIỆU ỨNG HOVER ĐẶC BIỆT */
  .nav-item.dropdown .nav-link {
    position: relative;
    padding-right: 30px !important;
  }

  /* Dropdown arrow cho menu có con - FIX VỊ TRÍ CHÍNH XÁC */
  .dropdown-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%) rotate(0deg);
    font-size: 10px;
    transition: transform 0.3s ease;
    line-height: 1;
    pointer-events: none;
  }

  .nav-item.dropdown.active .nav-link {
    padding-right: 30px !important;
  }

  .nav-item.dropdown.active .dropdown-arrow {
    transform: translateY(-50%) rotate(180deg);
    right: 12px;
    top: 50%;
  }

  /* Khi hover vào menu có con, hiển thị submenu */
  .nav-item.dropdown:hover .submenu {
    display: block;
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
    pointer-events: auto;
  }

  .nav-item.dropdown:hover .dropdown-arrow {
    transform: translateY(-50%) rotate(180deg);
  }

  /* Khi menu active được hover - MẤT HIỆU ỨNG ACTIVE */
  .nav-link.router-link-active:hover::after,
  .nav-link.router-link-exact-active:hover::after,
  .nav-item.active .nav-link:hover::after {
    opacity: 0;
    width: 0;
  }

  .nav-link.router-link-active:hover,
  .nav-link.router-link-exact-active:hover,
  .nav-item.active:not(.solution-item) .nav-link:hover {
    color: #333 !important;
    font-weight: normal;
  }

  /* ===== ICON MENU CON CÓ MÀU ===== */
  .submenu-link i {
    width: 18px;
    margin-right: 8px;
    transition: transform .2s ease, filter .2s ease;
  }

  .submenu-link .fa-bolt { color: #f59e0b; }
  .submenu-link .fa-fire { color: #ef4444; }
  .submenu-link .fa-bullhorn { color: #6366f1; }
  .submenu-link .fa-users { color: #10b981; }
  .submenu-link .fa-clipboard-user { color: #8b5cf6; }

  .submenu-link:hover i {
    transform: scale(1.15);
    filter: drop-shadow(0 0 6px currentColor);
  }

  /* ===== HIỆU ỨNG HOVER DESKTOP - TRƯỢT TỪ TRÁI ===== */
  .home-item .nav-link:hover::before {
    width: 100%;
    background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(236, 254, 255, 0.1));
  }

  .quick-sale-item .nav-link:hover::before {
    width: 100%;
    background: linear-gradient(135deg, rgba(245, 166, 35, 0.1), rgba(255, 233, 201, 0.1));
  }

  .consignment-item .nav-link:hover::before {
    width: 100%;
    background: linear-gradient(135deg, rgba(126, 211, 33, 0.1), rgba(232, 245, 232, 0.1));
  }

  .solution-item .nav-link:hover::before {
    width: 100%;
    background: linear-gradient(135deg, rgba(245, 166, 35, 0.1), rgba(255, 233, 201, 0.1));
  }

  .project-item .nav-link:hover::before {
    width: 100%;
    background: linear-gradient(135deg, rgba(80, 227, 194, 0.1), rgba(209, 236, 236, 0.1));
  }

  .recruitment-item .nav-link:hover::before {
    width: 100%;
    background: linear-gradient(135deg, rgba(74, 74, 74, 0.1), rgba(240, 240, 240, 0.1));
  }

  .news-item .nav-link:hover::before {
    width: 100%;
    background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(217, 235, 253, 0.1));
  }

  .contact-item .nav-link:hover::before {
    width: 100%;
    background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(223, 240, 223, 0.1));
  }

  /* FIX: Hover vào dropdown */
  /*  .nav-item.dropdown .nav-link:hover::before {
      width: 100%;
      background: linear-gradient(135deg, rgba(3, 19, 88, 0.08), rgba(236, 254, 255, 0.08));
    }*/
}

.submenu.active {
  display: block;
}

/* Hamburger menu */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  z-index: 1001;
  position: relative;
  padding: 10px;
  background: none;
  border: none;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background-color: #031358;
  margin: 3px 0;
  transition: 0.3s;
}

/* Dropdown arrow cơ bản */
.dropdown-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  transition: transform 0.3s ease;
  line-height: 1;
  pointer-events: none;
}

.dropdown.active .dropdown-arrow {
  transform: translateY(-50%) rotate(180deg);
}

/* Mobile Submenu Header */
.submenu-mobile-header {
  display: none;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 1;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #f0f0f0;
}

.submenu-mobile-title {
  font-size: 18px;
  font-weight: 600;
  color: #031358;
}

.divider-line {
  display: none;
  height: 1px;
  background-color: #e0e0e0;
  margin: 0 20px;
}

.fixed-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Responsive styles */
@media (max-width: 1439px) {
  .navbar {
    padding: 0 30px;
  }

  .nav-item {
    margin: 0 2px;
  }
}

@media (max-width: 1279px) {
  .nav-links {
    gap: 0;
  }
}

@media (max-width: 1199px) {
  .nav-item>a {
    font-size: 15px;
  }
  .nav-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 15px;
    height: 85%;
    position: relative;
    transition: all 0.3s ease;
    color: #333;
    white-space: nowrap;
  }
}

/* Desktop hover cũng xoay */
@media (min-width: 1024px) {
  .nav-item.dropdown:hover .dropdown-arrow {
    transform: translateY(-50%) rotate(180deg);
  }
}

/* ===== MOBILE & TABLET (0-1023px) ===== */
@media (max-width: 1023px) {
  .hamburger {
    display: flex;
    padding: 10px;
    margin: -10px;
  }

  .hamburger span {
    pointer-events: none;
  }

  .nav-links {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: white;
    flex-direction: column;
    height: auto;
    align-items: flex-start;
    padding: 0;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: transform 0.5s ease, opacity 0.5s ease, visibility 0.5s ease;
    z-index: 998;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    scrollbar-width: none;
  }

  .nav-links.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-item {
    margin: 0;
    height: auto;
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
    overflow: hidden;
  }

  .nav-item:last-child {
    border-bottom: none;
  }

  .nav-link {
    height: auto;
    width: 100%;
    padding: 16px 20px !important;
    margin: 0 !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0 !important;
  }

  /* Trên mobile, mũi tên dropdown */
  .dropdown-arrow {
    position: static;
    margin-left: auto;
    transform: translateY(0);
  }

  .dropdown.active .dropdown-arrow {
    transform: rotate(180deg);
  }

  .nav-links {
    z-index: 999;
  }

  .submenu {
    z-index: 1000;
  }

  .nav-link::after {
    display: none;
  }

  .divider {
    display: none;
  }

  /* ===== FIX HOVER MOBILE - NỀN TOÀN ROW ===== */
  .nav-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    z-index: -1;
    transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Màu nền khi hover/active trên mobile */
  .home-item .nav-link:hover::before,
  .home-item .nav-link.router-link-active::before,
  .home-item .nav-link.router-link-exact-active::before {
    left: 0;
    background: linear-gradient(90deg, rgba(74, 144, 226, 0.1), rgba(236, 254, 255, 0.1));
  }

  .solution-item .nav-link:hover::before,
  .solution-item .nav-link.router-link-active::before,
  .solution-item .nav-link.router-link-exact-active::before {
    left: 0;
    background: linear-gradient(90deg, rgba(245, 166, 35, 0.1), rgba(255, 233, 201, 0.1));
  }

  .consignment-item .nav-link:hover::before,
  .consignment-item .nav-link.router-link-active::before,
  .consignment-item .nav-link.router-link-exact-active::before {
    left: 0;
    background: linear-gradient(90deg, rgba(126, 211, 33, 0.1), rgba(232, 245, 232, 0.1));
  }

  .project-item .nav-link:hover::before,
  .project-item .nav-link.router-link-active::before,
  .project-item .nav-link.router-link-exact-active::before {
    left: 0;
    background: linear-gradient(90deg, rgba(80, 227, 194, 0.1), rgba(209, 236, 236, 0.1));
  }

  .recruitment-item .nav-link:hover::before,
  .recruitment-item .nav-link.router-link-active::before,
  .recruitment-item .nav-link.router-link-exact-active::before {
    left: 0;
    background: linear-gradient(90deg, rgba(74, 74, 74, 0.1), rgba(240, 240, 240, 0.1));
  }

  .news-item .nav-link:hover::before,
  .news-item .nav-link.router-link-active::before,
  .news-item .nav-link.router-link-exact-active::before {
    left: 0;
    background: linear-gradient(90deg, rgba(52, 152, 219, 0.1), rgba(217, 235, 253, 0.1));
  }

  .contact-item .nav-link:hover::before,
  .contact-item .nav-link.router-link-active::before,
  .contact-item .nav-link.router-link-exact-active::before {
    left: 0;
    background: linear-gradient(90deg, rgba(46, 204, 113, 0.1), rgba(223, 240, 223, 0.1));
  }

  /* FIX: Màu chữ khi hover trên mobile */
  .nav-link:hover {
    color: inherit !important;
  }

  .home-item .nav-link:hover {
    color: #4A90E2 !important;
  }

  .solution-item .nav-link:hover {
    color: #F5A623 !important;
  }

  .consignment-item .nav-link:hover {
    color: #7ED321 !important;
  }

  .project-item .nav-link:hover {
    color: #50E3C2 !important;
  }

  .recruitment-item .nav-link:hover {
    color: #4A4A4A !important;
  }

  .news-item .nav-link:hover {
    color: #3498DB !important;
  }

  .contact-item .nav-link:hover {
    color: #2ECC71 !important;
  }

  /* Mobile Submenu Overlay */
  .submenu {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100vh;
    border-radius: 0;
    padding: 0;
    background-color: white;
    overflow-y: auto;
  }

  .submenu.active {
    display: block;
  }

  .submenu-mobile-header {
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .divider-line {
    display: block;
  }

  .submenu-columns {
    display: block;
    padding: 0;
  }

  .submenu-column {
    margin-bottom: 0;
  }

  .submenu-column h3 {
    font-size: 16px;
    margin: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #f8f9fa;
  }

  .submenu-links {
    padding-left: 0;
  }

  .submenu-link {
    padding: 16px 20px !important;
    font-size: 15px;
    margin: 0;
    border-radius: 0;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
  }

  .submenu-link:last-child {
    border-bottom: none;
  }

  .hamburger.active span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }

  .hamburger.active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.active span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  }

  /* Trên mobile - menu có con */
  .nav-item.dropdown .nav-link {
    padding-right: 20px !important;
  }
}

/* Đảm bảo không có element nào che hamburger */
.nav-right {
  position: relative;
  z-index: 1001;
}

/* Tablet (768px-1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .navbar {
    padding: 0 20px;
  }
}

/* Mobile (0-767px) */
@media (max-width: 767px) {
  .navbar {
    height: 60px;
    padding: 0 15px;
  }

  .nav-links {
    top: 60px;
  }

  .submenu {
    top: 0;
  }

  /* Giữ nguyên nav-icons trên mobile */
  .nav-icons {
    display: flex;
  }

  .icon-link {
    width: 36px;
    height: 36px;
    margin-left: 8px;
    font-size: 16px;
  }

  .nav-right {
    gap: 8px;
  }

  .logo img {
    height: 30px;
  }
}

/* Mobile nhỏ (0-480px) */
@media (max-width: 480px) {
  .navbar {
    padding: 0 10px;
  }

  .logo {
    min-width: 100px;
  }

  .logo img {
    height: 25px;
  }

  .nav-link {
    font-size: 14px;
  }

  .submenu-column h3 {
    font-size: 15px;
  }

  .submenu-link {
    font-size: 14px;
  }

  .submenu-mobile-title {
    font-size: 16px;
  }

  .icon-link {
    width: 32px;
    height: 32px;
    margin-left: 5px;
  }

  .nav-right {
    gap: 5px;
  }
}

/* Đảm bảo nav-icons luôn hiển thị và căn phải */
@media (max-width: 1023px) {
  .nav-right {
    margin-left: auto;
  }

  .nav-icons {
    display: flex !important;
  }
}

/* FIX NAVBAR RESPONSIVE */
.navbar {
  flex-wrap: nowrap;
}

.nav-links {
  flex: 1;
  justify-content: center;
  min-width: 0;
}

.nav-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Khi màn hình hẹp (tầm 1200px trở xuống) */
@media (max-width: 1199px) {
  .nav-links {
    flex: 1 1 auto;
    justify-content: center;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .nav-links::-webkit-scrollbar {
    display: none;
  }

  .nav-right {
    flex-shrink: 0;
  }
}

/* ===== USER SUBMENU STYLES - FIXED VERSION ===== */
.user-menu-container {
  position: relative;
  display: inline-block;
}

.user-submenu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background-color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  min-width: 200px;
  padding: 8px 0;
  display: none;
  z-index: 1002;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.user-submenu.active {
  display: block;
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.user-menu-container:hover .user-submenu,
.user-submenu:hover {
  display: block !important;
  opacity: 1 !important;
  transform: translateY(0) !important;
  pointer-events: auto !important;
}

/* Đảm bảo user submenu không bị đóng khi di chuyển chuột */
.user-submenu::before {
  content: '';
  position: absolute;
  top: -10px;
  right: 0;
  width: 100%;
  height: 20px;
  background: transparent;
}

.user-submenu-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 0;
  margin: 0;
  position: relative;
  overflow: hidden;
}

.user-submenu-link:last-child {
  border-bottom: none;
}

/* Hiệu ứng hover cho user submenu links */
.user-submenu-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(3, 19, 88, 0.1), rgba(240, 240, 240, 0.1));
  transition: left 0.3s ease;
  z-index: -1;
}

.user-submenu-link:hover::before {
  left: 0;
}

.user-submenu-link:hover {
  color: #031358;
  padding-left: 24px;
}

.user-submenu-link i {
  margin-right: 12px;
  width: 16px;
  text-align: center;
  color: #031358;
  transition: transform 0.3s ease;
}

.user-submenu-link:hover i {
  transform: scale(1.1);
}

/* Mobile styles for user submenu */
@media (max-width: 1023px) {
  .user-submenu {
    position: fixed !important;
    top: 60px !important;
    left: 0 !important;
    width: 100% !important;
    background-color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 0;
    margin-top: 0;
    display: none;
    z-index: 1002;
  }

  .user-submenu.active {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }

  .user-submenu-link {
    padding: 16px 20px !important;
    font-size: 16px;
    border-bottom: 1px solid #e0e0e0;
    margin: 0;
    border-radius: 0;
  }

  .user-submenu-link:last-child {
    border-bottom: none;
  }
}

@media (max-width: 767px) {
  .user-submenu {
    top: 60px !important;
  }
}

/* ===== MÀU SẮC THEO ICON - CHỈ HOVER BO GÓC ===== */
.home-item .nav-link i { color: #4A90E2; }
.quick-sale-item .nav-link i { color: #F5A623; }
.consignment-item .nav-link i { color: #7ED321; }
.ivm-item .nav-link i { color: #BD10E0; }
.project-item .nav-link i { color: #50E3C2; }
.estimate-item .nav-link i { color: rgb(255, 106, 0); }
.recruitment-item .nav-link i { color: #4A4A4A; }
.collaborator-item .nav-link i { color: #9B59B6; }
.news-item .nav-link i { color: #3498DB; }
.contact-item .nav-link i { color: #2ECC71; }
.solution-item .nav-link i { color: #F5A623; }

/* MÀU CHỮ KHI ACTIVE - KHÔNG IN ĐẬM */
.home-item .nav-link.router-link-active,
.home-item .nav-link.router-link-exact-active {
  color: #4A90E2 !important;
}

.quick-sale-item .nav-link.router-link-active,
.quick-sale-item .nav-link.router-link-exact-active {
  color: #F5A623 !important;
}

.consignment-item .nav-link.router-link-active,
.consignment-item .nav-link.router-link-exact-active {
  color: #7ED321 !important;
}

.ivm-item .nav-link.router-link-active,
.ivm-item .nav-link.router-link-exact-active {
  color: #BD10E0 !important;
}

.project-item .nav-link.router-link-active,
.project-item .nav-link.router-link-exact-active {
  color: #50E3C2 !important;
}

.estimate-item .nav-link.router-link-active,
.estimate-item .nav-link.router-link-exact-active {
  color: rgb(255, 106, 0) !important;
}

.recruitment-item .nav-link.router-link-active,
.recruitment-item .nav-link.router-link-exact-active {
  color: #4A4A4A !important;
}

.collaborator-item .nav-link.router-link-active,
.collaborator-item .nav-link.router-link-exact-active {
  color: #9B59B6 !important;
}

.news-item .nav-link.router-link-active,
.news-item .nav-link.router-link-exact-active {
  color: #3498DB !important;
}

.contact-item .nav-link.router-link-active,
.contact-item .nav-link.router-link-exact-active {
  color: #2ECC71 !important;
}

.solution-item .nav-link.router-link-active,
.solution-item .nav-link.router-link-exact-active {
  color: #F5A623 !important;
}

.recruitment-item .nav-link.router-link-active,
.recruitment-item .nav-link.router-link-exact-active {
  color: #4A4A4A !important;
}

/* ===== HOVER BO GÓC THEO MÀU ICON - DESKTOP ===== */
@media (min-width: 1024px) {
  .home-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: #4A90E2 !important;
  }

  .quick-sale-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: #F5A623 !important;
  }

  .consignment-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: #7ED321 !important;
  }

  .ivm-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: #BD10E0 !important;
  }

  .project-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: #50E3C2 !important;
  }

  .estimate-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: rgb(255, 106, 0) !important;
  }

  .recruitment-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: #4A4A4A !important;
  }

  .collaborator-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: #9B59B6 !important;
  }

  .news-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: #3498DB !important;
  }

  .contact-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: #2ECC71 !important;
  }

  .solution-item .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
    color: #F5A623 !important;
  }
}

.nav-link:hover i {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .nav-link:not(.router-link-active):not(.router-link-exact-active):not(:hover) i {
    font-size: 13px;
  }

  .nav-item.dropdown .nav-link {
    padding-right: 28px !important;
  }

  .dropdown-arrow {
    right: 10px;
  }
}

/* Màu thanh active cho các menu item */
.home-item .nav-link.router-link-active::after,
.home-item .nav-link.router-link-exact-active::after {
  background: #4A90E2;
}

.quick-sale-item .nav-link.router-link-active::after,
.quick-sale-item .nav-link.router-link-exact-active::after {
  background: #F5A623;
}

.consignment-item .nav-link.router-link-active::after,
.consignment-item .nav-link.router-link-exact-active::after {
  background: #7ED321;
}

.ivm-item .nav-link.router-link-active::after,
.ivm-item .nav-link.router-link-exact-active::after {
  background: #BD10E0;
}

.project-item .nav-link.router-link-active::after,
.project-item .nav-link.router-link-exact-active::after {
  background: #50E3C2;
}

.estimate-item .nav-link.router-link-active::after,
.estimate-item .nav-link.router-link-exact-active::after {
  background: rgb(255, 106, 0);
}

.recruitment-item .nav-link.router-link-active::after,
.recruitment-item .nav-link.router-link-exact-active::after {
  background: #4A4A4A;
}

.collaborator-item .nav-link.router-link-active::after,
.collaborator-item .nav-link.router-link-exact-active::after {
  background: #9B59B6;
}

.news-item .nav-link.router-link-active::after,
.news-item .nav-link.router-link-exact-active::after {
  background: #3498DB;
}

.contact-item .nav-link.router-link-active::after,
.contact-item .nav-link.router-link-exact-active::after {
  background: #2ECC71;
}

.solution-item .nav-link.router-link-active::after,
.solution-item .nav-link.router-link-exact-active::after {
  background: #F5A623;
}

.recruitment-item .nav-link.router-link-active::after,
.recruitment-item .nav-link.router-link-exact-active::after {
  background: #4A4A4A;
}

/* Active state cho menu cha khi trang con được chọn */
.solution-item.active .nav-link,
.recruitment-item.active .nav-link {
  position: relative;
  color: inherit !important;
}

.solution-item.active .nav-link::after,
.recruitment-item.active .nav-link::after {
  content: '';
  position: absolute;
  width: calc(100% - 32px);
  height: 3px;
  border-radius: 2px;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
}

.solution-item.active .nav-link::after {
  background: #F5A623;
}

.recruitment-item.active .nav-link::after {
  background: #4A4A4A;
}

.submenu-link[href="#"] {
  cursor: not-allowed;
  opacity: 0.7;
}

.submenu-link[href="#"]:hover {
  background-color: #f8f9fa;
  color: #666 !important;
}

.submenu-link[href="#"] i {
  color: #999 !important;
}

@keyframes submenuFade {
  from {
    opacity: 0;
    transform: translate(-50%, -10px) scale(.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

.nav-item .nav-link {
  padding: 8px 16px;
  margin: 5px 2px;
}

.nav-item.dropdown .nav-link {
  padding-right: 30px !important;
}

.nav-link {
  width: auto;
  min-width: fit-content;
}

@media (min-width: 1024px) {
  .nav-item.dropdown .nav-link:hover {
    background: transparent !important;
    border-radius: 14px;
  }

  .nav-item.dropdown .nav-link.router-link-active:hover,
  .nav-item.dropdown .nav-link.router-link-exact-active:hover,
  .nav-item.dropdown.active .nav-link:hover {
    background: transparent !important;
    color: #333 !important;
  }

  .nav-item.dropdown .nav-link.router-link-active:hover::after,
  .nav-item.dropdown .nav-link.router-link-exact-active:hover::after,
  .nav-item.dropdown.active .nav-link:hover::after {
    opacity: 0;
    width: 0;
  }
}

/* Desktop lớn (1440px trở lên) */
@media (min-width: 1440px) {
  .navbar {
    padding: 0 60px;
  }

  .nav-link {
    font-size: 16px;
  }

  .submenu {
    padding: 24px 32px;
  }
}

/* ===== HIỆU ỨNG ICON HOVER ===== */
.nav-link i {
  transition: transform 0.3s ease, color 0.3s ease;
}

.nav-link:hover i {
  transform: scale(1.15);
}

/* ===== FIX HOVER ACTIVE STATE DESKTOP ===== */
@media (min-width: 1024px) {
  .nav-item.dropdown.active .nav-link::before {
  }

  .solution-item.active .nav-link::before {
    background: linear-gradient(135deg, rgba(245, 166, 35, 0.1), rgba(255, 233, 201, 0.1));
  }

  .recruitment-item.active .nav-link::before {
    background: linear-gradient(135deg, rgba(74, 74, 74, 0.1), rgba(240, 240, 240, 0.1));
  }
}

/* ===== FIX Z-INDEX ===== */
.submenu {
  z-index: 1001;
}

.user-submenu {
  z-index: 1002;
}

.nav-links {
  z-index: 999;
}

@media (min-width: 1024px) {
  .solution-item .nav-link.router-link-active,
  .solution-item .nav-link.router-link-exact-active {
    color: #F5A623;
  }

  .solution-item .nav-link.router-link-active::after,
  .solution-item .nav-link.router-link-exact-active::after {
    background-color: #F5A623;
  }
}

@media (min-width: 1024px) {
  .solution-item.active .dropdown-arrow {
    color: #F5A623;
  }
}

</style>