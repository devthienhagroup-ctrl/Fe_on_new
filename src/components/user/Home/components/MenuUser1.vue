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
      <li class="nav-item quick-sale-item">
        <router-link to="/giai-phap-ban-nhanh" class="nav-link">
          <i class="fa-solid fa-bolt"></i> Bán nhanh 30N
        </router-link>
      </li>
      <li class="nav-item consignment-item">
        <router-link to="/tinh-nang-dang-phat-trien" class="nav-link">
          <i class="fas fa-handshake"></i> Ký gửi
        </router-link>
      </li>
      <li class="nav-item project-item">
        <router-link to="/tinh-nang-dang-phat-trien" class="nav-link">
          <i class="fas fa-project-diagram column-icon"></i> Dự án
        </router-link>
      </li>
      <li class="nav-item estimate-item">
        <router-link to="/dinh-gia-bds" class="nav-link">
          <i class="fa-solid fa-fire fa-beat-fade" style="color: #ff6a00 !important; font-size: 20px"></i> Định giá
        </router-link>
      </li>
      <li class="nav-item recruitment-item">
        <router-link to="/tuyen-dung" class="nav-link">
          <i class="fas fa-users"></i> Tuyển dụng
        </router-link>
      </li>
      <li class="nav-item collaborator-item">
        <router-link to="/cong-viec-cong-tac-vien" class="nav-link">
          <i class="fa-solid fa-clipboard-user"></i> Ứng tuyển CTV
        </router-link>
      </li>
      <li class="nav-item ivm-item">
        <router-link to="/investments" class="nav-link">
          <i class="fa-solid fa-sack-dollar"></i> Góp vốn
        </router-link>
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
      <!--      <li class="nav-item dropdown">-->
      <!--        <router-link to="/tinh-nang-dang-phat-trien" class="nav-link" id="mua-link">-->
      <!--          <i class="fa-solid fa-coins"></i> Mua-->
      <!--          <span class="dropdown-arrow">▼</span>-->
      <!--        </router-link>-->
      <!--        <div class="submenu" id="mua-submenu">-->
      <!--          &lt;!&ndash; Mobile Header for Submenu &ndash;&gt;-->
      <!--          <div class="submenu-mobile-header">-->
      <!--            <button class="back-button" id="submenu-back">-->
      <!--              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">-->
      <!--                <path d="M15 18L9 12L15 6" stroke="#031358" stroke-width="2" stroke-linecap="round"-->
      <!--                      stroke-linejoin="round"/>-->
      <!--              </svg>-->
      <!--            </button>-->
      <!--            <span class="submenu-mobile-title">Mua</span>-->
      <!--          </div>-->
      <!--          <div class="divider-line"></div>-->

      <!--          <div class="submenu-columns">-->
      <!--            <div class="submenu-column">-->
      <!--              <h3>Mua chung cư</h3>-->
      <!--              <ul class="submenu-links">-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-building"></i> Nhà-->
      <!--                    liên kế Biệt thự (trong dự án)-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-home"></i> Mua nhà đất-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-concierge-bell"></i>-->
      <!--                    Tiện ích-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-water"></i> Vinhomes-->
      <!--                    Ocean Park-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-empire"></i> Vinhomes-->
      <!--                    Ocean Park 2 - The Empire-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--              </ul>-->
      <!--            </div>-->
      <!--            <div class="submenu-column">-->
      <!--              <h3>Khu vực</h3>-->
      <!--              <ul class="submenu-links">-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-map-marker-alt"></i>-->
      <!--                    Quận Cầu Giấy-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-map-marker-alt"></i>-->
      <!--                    Quận Bắc Từ Liêm-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-map-marker-alt"></i>-->
      <!--                    Quận Long Biên-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-map-marker-alt"></i>-->
      <!--                    Quận Tây Hồ-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--              </ul>-->
      <!--            </div>-->
      <!--            <div class="submenu-column">-->
      <!--              <h3>Dự án</h3>-->
      <!--              <ul class="submenu-links">-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-city"></i> Vinhomes-->
      <!--                    Smart City-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-building"></i> Masteri-->
      <!--                    West Heights-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-building"></i> Masteri-->
      <!--                    Waterfront-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--              </ul>-->
      <!--            </div>-->
      <!--            <div class="submenu-column">-->
      <!--              <h3>Dịch vụ</h3>-->
      <!--              <ul class="submenu-links">-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-chart-line"></i> Định-->
      <!--                    giá-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-handshake"></i> Ký gửi-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-percentage"></i> Ưu-->
      <!--                    đãi-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--                <li>-->
      <!--                  <router-link to="/tinh-nang-dang-phat-trien" class="submenu-link"><i class="fas fa-phone-alt"></i> Liên-->
      <!--                    hệ-->
      <!--                  </router-link>-->
      <!--                </li>-->
      <!--              </ul>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </li>-->
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
import {ref, onMounted, onUnmounted, nextTick, computed, watch} from "vue";
import {useRoute, useRouter} from 'vue-router'
import Footer from "./Footer.vue";
import {useAuthStore} from "../../../../stores/authStore.js";
import PopupQuickSale from "../../QuickSaleSolution/Components/PopupQuickSale.vue"; useAuthStore()

const auth = useAuthStore();
const menuRef = ref(null);
const navLinks = ref(null);
const hamburger = ref(null);
const muaSubmenu = ref(null);
const userSubmenu = ref(null);
const userMenuContainer = ref(null);

const route = useRoute()
const router = useRouter();

const showQSPopup = ref(route.meta.showQSPopup || false);

// Watch route changes
watch(
    () => route.fullPath,
    () => {
      showQSPopup.value = route.meta.showQSPopup || false;
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

// Hàm xử lý đăng xuất
const handleLogout =async () => {
  const store = useAuthStore();
  await store.logout();
};

// Hàm ẩn menu khi click router-link
const hideMenuOnLinkClick = () => {
  if (!navLinks.value) return;

  const allRouterLinks = navLinks.value.querySelectorAll('.nav-link, .submenu-link, .user-submenu-link');

  allRouterLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      // Chỉ xử lý trên mobile
      if (window.innerWidth <= 1024) {
        // Đóng submenu nếu có
        if (muaSubmenu.value) {
          muaSubmenu.value.classList.remove('active');
        }
        if (userSubmenu.value) {
          userSubmenu.value.classList.remove('active');
        }

        // Đóng main menu
        if (navLinks.value) {
          navLinks.value.classList.remove('active');
        }

        // Reset hamburger icon
        if (hamburger.value) {
          hamburger.value.classList.remove('active');
        }
      }
    });
  });
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

const initializeMenu = () => {
  const hamburgerEl = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('nav-links');
  const userIcon = document.getElementById('user-icon');
  const userSubmenuEl = document.getElementById('user-submenu');
  const userMenuContainerEl = document.querySelector('.user-menu-container');

  // THÊM CONSOLE LOG ĐỂ DEBUG
  // console.log('Các phần tử được tìm thấy:');
  // console.log('hamburger:', hamburgerEl);
  // console.log('nav-links:', navLinksEl);
  // console.log('user-icon:', userIcon);
  // console.log('user-submenu:', userSubmenuEl);
  // console.log('user-menu-container:', userMenuContainerEl);

  if (!hamburgerEl || !navLinksEl || !userIcon || !userSubmenuEl || !userMenuContainerEl) {
    console.log('Một hoặc nhiều phần tử không được tìm thấy, hàm initializeMenu bị dừng');
    return;
  }
  console.log('DONE'); // THÊM DÒNG NÀY
  // Gán refs
  hamburger.value = hamburgerEl;
  navLinks.value = navLinksEl;
  userSubmenu.value = userSubmenuEl;
  userMenuContainer.value = userMenuContainerEl;

  // Desktop submenu behavior for User - SỬA LỖI HOVER TRIỆT ĐỂ
  userMenuContainerEl.addEventListener('mouseenter', function () {
    if (window.innerWidth > 1024) {
      // Clear timeout trước đó nếu có
      if (userSubmenuTimeout) {
        clearTimeout(userSubmenuTimeout);
        userSubmenuTimeout = null;
      }
      userSubmenuEl.classList.add('active');
    }
  });

  userMenuContainerEl.addEventListener('mouseleave', function (e) {
    if (window.innerWidth > 1024) {
      // Kiểm tra xem chuột có đang di chuyển sang submenu không
      const relatedTarget = e.relatedTarget;
      if (relatedTarget && userSubmenuEl.contains(relatedTarget)) {
        return; // Nếu chuột di chuyển sang submenu, không ẩn
      }

      // Delay ẩn submenu để người dùng có thời gian di chuột sang
      userSubmenuTimeout = setTimeout(function () {
        userSubmenuEl.classList.remove('active');
        userSubmenuTimeout = null;
      }, 300); // Tăng thời gian delay lên 300ms
    }
  });

  userSubmenuEl.addEventListener('mouseenter', function () {
    if (window.innerWidth > 1024) {
      // Clear timeout khi chuột vào submenu
      if (userSubmenuTimeout) {
        clearTimeout(userSubmenuTimeout);
        userSubmenuTimeout = null;
      }
    }
  });

  userSubmenuEl.addEventListener('mouseleave', function (e) {
    if (window.innerWidth > 1024) {
      // Kiểm tra xem chuột có đang di chuyển sang icon không
      const relatedTarget = e.relatedTarget;
      if (relatedTarget && userMenuContainerEl.contains(relatedTarget)) {
        return; // Nếu chuột di chuyển sang icon, không ẩn
      }

      userSubmenuTimeout = setTimeout(function () {
        userSubmenuEl.classList.remove('active');
        userSubmenuTimeout = null;
      }, 200);
    }
  });

  // Mobile menu toggle
  hamburgerEl.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // THÊM CONSOLE LOG Ở ĐÂY
    console.log('Đã click Hamburger');

    navLinksEl.classList.toggle('active');
    hamburgerEl.classList.toggle('active');

    if (!navLinksEl.classList.contains('active')) {
      userSubmenuEl.classList.remove('active');
    }
  });

  // Mobile submenu toggle for User
  userIcon.addEventListener('click', function (e) {
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      e.stopPropagation();
      userSubmenuEl.classList.toggle('active');
    }
  });

  // Close menu when clicking outside on mobile
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 1024) {
      if (!navLinksEl.contains(e.target) && !hamburgerEl.contains(e.target)) {
        navLinksEl.classList.remove('active');
        hamburgerEl.classList.remove('active');
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
    }
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);

  nextTick(() => {
    initializeMenu();
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  // Clear timeout khi component unmount
  if (userSubmenuTimeout) {
    clearTimeout(userSubmenuTimeout);
  }
});
</script>

<style scoped>

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
  gap: 7px;
}

.nav-item {
  position: relative;
  margin: 0 15px;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 15px;
  height: 100%;
  position: relative;
  padding: 0 3px;
  transition: all 0.3s ease;
  position: relative;
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

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  font-weight: 600;
  position: relative;
}

.nav-link.router-link-active::after,
.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 3px;
  background-color: #0030ff;
  border-radius: 2px;
  animation: ease-in;
}
/* Responsive từ 1024px đến 1230px - Ẩn chữ, chỉ hiện icon */
@media (min-width: 1024px) and (max-width: 1277px) {
  .nav-link {
    position: relative;
    width: auto;
    padding: 0 8px;
  }

  /* Ẩn chữ trong nav-link */
  .nav-link:not(.router-link-active):not(.router-link-exact-active):not(:hover) {
    font-size: 0;
  }

  /* Đảm bảo icon vẫn hiển thị */
  .nav-link:not(.router-link-active):not(.router-link-exact-active):not(:hover) i,
  .nav-link:not(.router-link-active):not(.router-link-exact-active):not(:hover) img {
    font-size: 16px;
    margin-right: 0;
    opacity: 1;
    visibility: visible;
  }

  /* Giữ nguyên hiển thị đầy đủ cho link active */
  .nav-link.router-link-active,
  .nav-link.router-link-exact-active {
    font-size: 15px;
  }

  .nav-link.router-link-active i,
  .nav-link.router-link-exact-active i {
    margin-right: 8px;
  }

  /* Giữ nguyên hiển thị đầy đủ cho link hover */
  .nav-link:hover {
    font-size: 15px;
  }

  .nav-link:hover i {
    margin-right: 8px;
  }

  /* Điều chỉnh khoảng cách giữa các item */
  .nav-item {
    margin: 0 8px;
  }

  /* Điều chỉnh kích thước logo nếu cần */
  .logo img {
    height: 70%;
  }

  /* Đảm bảo dropdown arrow vẫn hiển thị */
  .dropdown-arrow {
    display: none; /* Có thể ẩn dropdown arrow trong khoảng này */
  }

  /* Tooltip hiển thị text khi hover (tùy chọn) */
  .nav-link:not(.router-link-active):not(.router-link-exact-active):hover::after {
    content: attr(data-text);
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
  }

  .nav-link:not(.router-link-active):not(.router-link-exact-active):hover::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #0030FF transparent;
    z-index: 1003;
  }
}

/* Cập nhật thêm cho responsive nhỏ hơn */
@media (max-width: 1277px) {
  .navbar {
    padding: 0 15px;
  }

  .nav-links {
    gap: 5px;
  }
}

/* Trên mobile */
@media (max-width: 1024px) {
  .nav-link.router-link-active::after,
  .nav-link.router-link-exact-active::after {
    bottom: 5px;
    width: calc(100% - 30px);
  }
}


.nav-link:hover::after {
  width: calc(100% + 20px);
}

.nav-link:hover {
  color: #031358;
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

/* Submenu styles */
.submenu {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  background-color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  display: none;
  padding: 30px 40px;
  z-index: 999;
}

.submenu.active {
  display: block;
}

.submenu-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.submenu-column h3 {
  color: #031358;
  font-size: 16px;
  margin-bottom: 15px;
  font-weight: 600;
}

.submenu-links {
  list-style: none;
}

.submenu-link {
  display: block;
  padding: 8px 0;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.submenu-link:hover {
  color: #031358;
}

.submenu-link i {
  margin-right: 8px;
  color: #031358;
}

/* Hamburger menu */
/* Đảm bảo hamburger button có thể click được */
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

/* Dropdown arrow for mobile */
.dropdown-arrow {
  margin-left: 5px;
  font-size: 10px;
  transition: transform 0.3s;
}

.dropdown.active .dropdown-arrow {
  transform: rotate(180deg);
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
  background-color: white; /* Thêm màu nền nếu cần */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Thêm bóng nếu cần */
}


/* Responsive styles */
@media (max-width: 1600px) {
  .navbar {
    padding: 0 20px;
  }

  .nav-item {
    margin: 0 10px;
  }

  .submenu-columns {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1435px) {
  .nav-links {
    gap: 0;
  }
}

@media (max-width: 1392px) {
  .nav-item>a {
    font-size: 13px;
  }
}


@media (max-width: 1024px) {
  .hamburger {
    display: flex;
    padding: 15px;
    margin: -15px; /* Tăng touch area */
  }

  .hamburger span {
    pointer-events: none; /* Ngăn span cản trở click */
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
    padding: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    /* SỬA CHỖ NÀY - Giảm thời gian transition và chỉ dùng transform */
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
    margin: 10px 0;
    height: auto;
    width: 100%;
  }

  .nav-link {
    height: auto;
    padding: 10px 0;
    width: 100%;
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

  /* Mobile Submenu Overlay */
  .submenu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: white;
    padding: 0;
    display: none;
    z-index: 1002;
    overflow-y: auto;
    scrollbar-width: none;
  }

  .submenu.active {
    display: block;
  }

  .submenu-mobile-header {
    display: flex;
  }

  .divider-line {
    display: block;
  }

  .submenu-columns {
    grid-template-columns: 1fr;
    gap: 0;
    padding: 20px;
  }

  .submenu-column {
    margin-bottom: 20px;
  }

  .submenu-column h3 {
    font-size: 16px;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
  }

  .submenu-links {
    padding-left: 0;
  }

  .submenu-link {
    padding: 12px 0;
    font-size: 14px;
    border-bottom: 1px solid #f5f5f5;
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
}

/* Đảm bảo không có element nào che hamburger */
.nav-right {
  position: relative;
  z-index: 1001;
}

@media (max-width: 768px) {
  .navbar {
    height: 70px;
    padding: 0 15px;
  }


  .nav-links {
    top: 70px;
  }

  .submenu {
    top: 0;
  }

  /* Giữ nguyên nav-icons trên mobile */
  .nav-icons {
    display: flex;
  }

  .icon-link {
    width: 35px;
    height: 35px;
    margin-left: 10px;
  }

  .nav-right {
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 10px;
  }

  .logo {
    width: 70px;
    height: 50px;
  }

  .nav-link {
    font-size: 14px;
  }

  .submenu-column h3 {
    font-size: 15px;
  }

  .submenu-link {
    font-size: 13px;
  }

  .submenu-mobile-title {
    font-size: 16px;
  }

  .icon-link {
    width: 32px;
    height: 32px;
    margin-left: 8px;
  }

  .nav-right {
    gap: 8px;
  }
}

/* Đảm bảo nav-icons luôn hiển thị và căn phải */
@media (max-width: 1024px) {
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
  min-width: 0; /* giúp flex co lại được khi viewport nhỏ */
}

.nav-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  flex-shrink: 0;
}

/* Khi màn hình hẹp (tầm 1200px trở xuống), cho phép nav-links tự co và không đẩy icon rớt hàng */
@media (max-width: 1200px) {

  .nav-links {
    flex: 1 1 auto;
    justify-content: center;
    overflow-x: auto; /* cho phép cuộn ngang nếu quá nhiều mục */
    scrollbar-width: none; /* ẩn thanh cuộn */
  }

  .nav-links::-webkit-scrollbar {
    display: none;
  }

  .nav-right {
    flex-shrink: 0;
  }
}

/* User Submenu Styles - SỬA LỖI HOVER TRIỆT ĐỂ */
.user-menu-container {
  position: relative;
  display: inline-block;
}

.user-submenu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  min-width: 180px;
  padding: 8px 0;
  display: none;
  z-index: 1001;
  margin-top: 0; /* QUAN TRỌNG: Đặt margin-top về 0 */
}

/* Tạo pseudo-element để lấp khoảng cách giữa icon và submenu */
.user-menu-container::after {
  content: '';
  position: absolute;
  bottom: -10px; /* Kéo dài vùng hover xuống dưới */
  left: 0;
  width: 100%;
  height: 20px; /* Tăng chiều cao vùng hover */
  background: transparent;
}

.user-submenu.active {
  display: block;
}

.user-submenu-link {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.user-submenu-link:last-child {
  border-bottom: none;
}

.user-submenu-link:hover {
  background-color: #f8f9fa;
  color: #031358;
}

.user-submenu-link i {
  margin-right: 10px;
  width: 16px;
  text-align: center;
  color: #031358;
}

/* Đảm bảo submenu hiển thị khi hover cả container và submenu */
.user-menu-container:hover .user-submenu,
.user-submenu:hover {
  display: block;
}

/* Mobile styles for user submenu */
@media (max-width: 1024px) {
  .user-submenu {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 0;
    margin-top: 0;
    display: none;
    z-index: 1002;
  }

  .user-menu-container::after {
    display: none; /* Ẩn pseudo-element trên mobile */
  }

  .user-submenu.active {
    display: block;
  }

  .user-submenu-link {
    padding: 15px 20px;
    font-size: 16px;
    border-bottom: 1px solid #e0e0e0;
  }

  .user-submenu-link:last-child {
    border-bottom: none;
  }
}

@media (max-width: 768px) {
  .user-submenu {
    top: 70px;
  }
}

/* Hiệu ứng chuyển màu cho menu active */
.nav-link.router-link-active::after,
.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #0030ff, #667eea, #0030ff);
  background-size: 200% 100%;
  border-radius: 2px;
  animation: gradient-shift 2s ease infinite;
}

/* Hiệu ứng chuyển màu gradient */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Hiệu ứng chuyển màu cho text menu active */
.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: #0030ff !important;
  font-weight: 600;
  position: relative;
  animation: text-color-shift 2s ease-in-out infinite;
}

/* Hiệu ứng chuyển màu cho text */
@keyframes text-color-shift {
  0%, 100% {
    color: #0030ff !important; /* Màu đậm */
  }
  50% {
    color: #667eea !important; /* Màu nhạt */
  }
}

/* Hiệu ứng chuyển màu cho icon trong menu active */
.nav-link.router-link-active i,
.nav-link.router-link-exact-active i {
  animation: icon-color-shift 2s ease-in-out infinite;
}

@keyframes icon-color-shift {
  0%, 100% {
    color: #0030ff; /* Màu đậm */
    transform: scale(1);
  }
  50% {
    color: #667eea; /* Màu nhạt */
    transform: scale(1.05);
  }
}

/* Trên mobile */
@media (max-width: 1024px) {
  .nav-link.router-link-active::after,
  .nav-link.router-link-exact-active::after {
    bottom: 5px;
    width: calc(100% - 30px);
    animation: gradient-shift-mobile 2s ease-in-out infinite;
  }

  /* Hiệu ứng đơn giản hơn cho mobile */
  @keyframes gradient-shift-mobile {
    0%, 100% {
      background-color: #0030ff; /* Màu đậm */
    }
    50% {
      background-color: #667eea; /* Màu nhạt */
    }
  }

  .nav-link.router-link-active,
  .nav-link.router-link-exact-active {
    animation: text-color-shift-mobile 2s ease-in-out infinite;
  }

  @keyframes text-color-shift-mobile {
    0%, 100% {
      color: #0030ff !important;
    }
    50% {
      color: #667eea !important;
    }
  }
}

/* Hiệu ứng chuyển màu cho user menu active */
.user-submenu-link.router-link-active,
.user-submenu-link.router-link-exact-active {
  background: linear-gradient(90deg, #f0f4ff, #e6f0ff, #f0f4ff);
  background-size: 200% 100%;
  color: #0030ff;
  font-weight: 600;
  position: relative;
  animation: background-shift 2s ease-in-out infinite;
}

@keyframes background-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.user-submenu-link.router-link-active::before,
.user-submenu-link.router-link-exact-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(to bottom, #0030ff, #667eea, #0030ff);
  animation: gradient-vertical 2s ease infinite;
}

@keyframes gradient-vertical {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

/* Hiệu ứng chuyển màu cho submenu link active */
.submenu-link.router-link-active,
.submenu-link.router-link-exact-active {
  color: #0030ff;
  font-weight: 600;
  position: relative;
  padding-left: 20px;
  background: linear-gradient(90deg, transparent, #f8f9ff, transparent);
  background-size: 200% 100%;
  animation: submenu-background-shift 1s ease-in-out infinite;
}

@keyframes submenu-background-shift {
  0%, 100% {
    background-position: -100% 0;
  }
  50% {
    background-position: 200% 0;
  }
}

.submenu-link.router-link-active::before,
.submenu-link.router-link-exact-active::before {
  content: '›';
  position: absolute;
  left: 8px;
  color: #0030ff;
  font-size: 16px;
  font-weight: bold;
  animation: arrow-color-shift 2s ease-in-out infinite;
}

@keyframes arrow-color-shift {
  0%, 100% {
    color: #0030ff;
    transform: translateX(0);
  }
  50% {
    color: #667eea;
    transform: translateX(3px);
  }
}

/* Thêm hiệu ứng mượt mà cho tất cả transitions */
.nav-link,
.user-submenu-link,
.submenu-link {
  transition: all 0.4s ease;
}

/* Hiệu ứng hover mượt mà */
.nav-link:hover {
  color: #031358;
  transform: translateY(-1px);
}

.nav-link:hover::after {
  width: calc(100% + 20px);

}

/* Màu sắc cho từng icon bằng class */
.home-item .nav-link i { color: #4A90E2; } /* Trang chủ - Xanh dương */
.quick-sale-item .nav-link i { color: #F5A623; } /* Bán nhanh 30N - Cam */
.consignment-item .nav-link i { color: #7ED321; } /* Ký gửi - Xanh lá */
.ivm-item .nav-link i { color: #BD10E0; } /* Gói dịch vụ - Tím */
.project-item .nav-link i { color: #50E3C2; } /* Dự án - Xanh ngọc */
.estimate-item .nav-link i { color: rgb(255, 106, 0); } /* Định giá - Đỏ cam */
.recruitment-item .nav-link i { color: #4A4A4A; } /* Tuyển dụng - Xám đậm */
.collaborator-item .nav-link i { color: #9B59B6; } /* Ứng tuyển CTV - Tím nhạt */
.news-item .nav-link i { color: #3498DB; } /* Tin tức - Xanh dương nhạt */
.contact-item .nav-link i { color: #2ECC71; } /* Liên hệ - Xanh lá đậm */

/* Màu nền hover nhạt dựa trên màu icon */
.home-item .nav-link:hover::after { background-color: #E3F2FD !important; }
.quick-sale-item .nav-link:hover::after { background-color: #FFF3E0 !important; }
.consignment-item .nav-link:hover::after { background-color: #F1F8E9 !important; }
.ivm-item .nav-link:hover::after { background-color: #F3E5F5 !important; }
.project-item .nav-link:hover::after { background-color: #E0F2F1 !important; }
.estimate-item .nav-link:hover::after { background-color: #FFEBEE !important; }
.recruitment-item .nav-link:hover::after { background-color: #FAFAFA !important; }
.collaborator-item .nav-link:hover::after { background-color: #F3E5F5 !important; }
.news-item .nav-link:hover::after { background-color: #E3F2FD !important; }
.contact-item .nav-link:hover::after { background-color: #E8F5E8 !important; }

/* Màu text khi hover */
.home-item .nav-link:hover { color: #4A90E2 !important; }
.quick-sale-item .nav-link:hover { color: #F5A623 !important; }
.consignment-item .nav-link:hover { color: #7ED321 !important; }
.ivm-item .nav-link:hover { color: #BD10E0 !important; }
.project-item .nav-link:hover { color: #50E3C2 !important; }
.estimate-item .nav-link:hover { color: rgb(255, 106, 0) !important; }
.recruitment-item .nav-link:hover { color: #4A4A4A !important; }
.collaborator-item .nav-link:hover { color: #9B59B6 !important; }
.news-item .nav-link:hover { color: #3498DB !important; }
.contact-item .nav-link:hover { color: #2ECC71 !important; }

/* Màu thanh active trùng với màu icon (sửa gradient) */
.home-item .nav-link.router-link-active::after,
.home-item .nav-link.router-link-exact-active::after {
  background: linear-gradient(90deg, #4A90E2, #7BB4F0, #4A90E2);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

.quick-sale-item .nav-link.router-link-active::after,
.quick-sale-item .nav-link.router-link-exact-active::after {
  background: linear-gradient(90deg, #F5A623, #F8C471, #F5A623);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

.consignment-item .nav-link.router-link-active::after,
.consignment-item .nav-link.router-link-exact-active::after {
  background: linear-gradient(90deg, #7ED321, #A9DF7F, #7ED321);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

.ivm-item .nav-link.router-link-active::after,
.ivm-item .nav-link.router-link-exact-active::after {
  background: linear-gradient(90deg, #BD10E0, #D68EE8, #BD10E0);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

.project-item .nav-link.router-link-active::after,
.project-item .nav-link.router-link-exact-active::after {
  background: linear-gradient(90deg, #50E3C2, #85EDD9, #50E3C2);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

.estimate-item .nav-link.router-link-active::after,
.estimate-item .nav-link.router-link-exact-active::after {
  background: linear-gradient(90deg, #FF6B6B, #FFA8A8, #FF6B6B);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

.recruitment-item .nav-link.router-link-active::after,
.recruitment-item .nav-link.router-link-exact-active::after {
  background: linear-gradient(90deg, #4A4A4A, #7F8C8D, #4A4A4A);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

.collaborator-item .nav-link.router-link-active::after,
.collaborator-item .nav-link.router-link-exact-active::after {
  background: linear-gradient(90deg, #9B59B6, #C39BD3, #9B59B6);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

.news-item .nav-link.router-link-active::after,
.news-item .nav-link.router-link-exact-active::after {
  background: linear-gradient(90deg, #3498DB, #5DADE2, #3498DB);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

.contact-item .nav-link.router-link-active::after,
.contact-item .nav-link.router-link-exact-active::after {
  background: linear-gradient(90deg, #2ECC71, #58D68D, #2ECC71);
  background-size: 200% 100%;
  animation: gradient-shift 3s ease infinite;
}

/* Hiệu ứng chuyển màu gradient */
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Màu text khi active */
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

/* Responsive từ 1024px đến 1230px - Điều chỉnh màu icon */
@media (min-width: 1024px) and (max-width: 1277px) {
  .nav-link:not(.router-link-active):not(.router-link-exact-active):not(:hover) i {
    font-size: 13px;
  }
}

/* Hiệu ứng hover cho icon */
.nav-link:hover i {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

/* Hiệu ứng active cho icon */
.nav-link.router-link-active i,
.nav-link.router-link-exact-active i {
  animation: icon-pulse 2s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Trên mobile - đơn giản hóa hiệu ứng */
@media (max-width: 1024px) {
  .home-item .nav-link.router-link-active::after,
  .home-item .nav-link.router-link-exact-active::after {
    background: #4A90E2;
    animation: none;
  }

  .quick-sale-item .nav-link.router-link-active::after,
  .quick-sale-item .nav-link.router-link-exact-active::after {
    background: #F5A623;
    animation: none;
  }

  .nav-link.router-link-active::after,
  .nav-link.router-link-exact-active::after {
    animation: none !important;
  }
}
</style>