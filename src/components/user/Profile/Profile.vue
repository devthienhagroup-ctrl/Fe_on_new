<!-- Trong Profile.vue -->
<template>
  <div class="container">
    <!-- Nút toggle menu cho mobile -->
    <button class="menu-toggle" @click="toggleMobileMenu" @mouseenter="showMenuToggle">
      <i class="fa-solid" :class="isMobileMenuOpen ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
    </button>

    <div class="row">
      <div class="left-col" :class="{ 'mobile-open': isMobileMenuOpen }">
        <!-- Thêm @link-clicked để xử lý đóng menu -->
        <LeftMenu @link-clicked="closeMobileMenu"></LeftMenu>
      </div>
      <div class="right-col" :class="{ 'mobile-hidden': isMobileMenuOpen }">
        <router-view
            :user_card="user_card"
            :user_info="user_info"
            :maskEmail="user.email"
        ></router-view>
      </div>
    </div>

    <!-- Overlay cho mobile -->
    <div v-if="isMobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>
  </div>
</template>

<script setup>
import LeftMenu from "./component/LeftMenu.vue";
import {onMounted, onUnmounted, ref} from "vue";
import api from "../../../api/api.js";
import {eventBus} from "../../../assets/js/event-bus.js";

// State cho menu mobile
const isMobileMenuOpen = ref(false);

const user = ref({
  employeeID: "",
  fullName: "",
  roleName: "",
  gender: "",
  phone: "",
  address: "",
  oldAddress: "",
  email: "",
  subscriptionPlan: "",
  avatar: '',
  status: true
})

const user_card = ref({
  fullName: user.value.fullName,
  avatar: user.value.avatar,
  role: user.value.roleName,
  subscriptionPlan: user.value.subscriptionPlan
})

const user_info = ref({
  avatar: user.value.avatar,
  fullName: user.value.fullName,
  role: user.value.roleName,
  gender: user.value.gender,
  phone: user.value.phone,
  province: "",
  ward: "",
  detailAddress: "",
  address: user.value.address,
  oldAddress: user.value.oldAddress,
  email: user.value.email,
  status: user.value.status
})

// Hàm tách địa chỉ thành các phần
const parseAddress = (address) => {
  if (!address) return { detailAddress: "", ward: "", province: "" };

  const parts = address.split('/!!').map(part => part.trim());
  return {
    detailAddress: parts[0] || "",
    ward: parts[1] || "",
    province: parts[2] || ""
  }
}

const fetchUserData = async () => {
  try {
    const userData = await api.get("/profile/info");
    console.log(userData.data);

    // Cập nhật user data từ API
    user.value = { ...userData.data };

    // Tách địa chỉ thành các phần
    const parsedAddress = parseAddress(user.value.address);
    const parsedOldAddress = parseAddress(user.value.oldAddress);

    // Cập nhật user_card
    user_card.value = {
      fullName: user.value.fullName,
      avatar: user.value.avatar,
      role: user.value.roleName,
      subscriptionPlan: user.value.subscriptionPlan
    }

    // Cập nhật user_info với địa chỉ đã được tách
    user_info.value = {
      avatar: user.value.avatar,
      fullName: user.value.fullName,
      role: user.value.roleName,
      gender: user.value.gender,
      phone: user.value.phone,
      province: parsedAddress.province,
      ward: parsedAddress.ward,
      address:  parsedAddress.detailAddress,
      oldAddress: user.value.oldAddress,
      email: user.value.email,
      status: user.value.status
    }

  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Hàm toggle menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  showMenuToggle(); // Hiển thị nút khi click
}

// Hàm đóng menu mobile
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
}

// Timer để tự động ẩn nút
let hideTimer = null;

// Hàm hiển thị nút menu-toggle
const showMenuToggle = () => {
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.classList.add('active');

    // Xóa timer cũ nếu có
    if (hideTimer) {
      clearTimeout(hideTimer);
    }

    // Đặt timer mới để ẩn nút sau 3 giây
    hideTimer = setTimeout(() => {
      menuToggle.classList.remove('active');
    }, 3000);
  }
}

// Hàm ẩn nút menu-toggle ngay lập tức
const hideMenuToggle = () => {
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle) {
    menuToggle.classList.remove('active');
  }
}

onMounted(async () => {
  await fetchUserData();
})

const handleUpdateSuccess = async () => {
  console.log('Cập nhật thành công!')
  await fetchUserData();
}

onMounted(() => {
  eventBus.on('update-success', handleUpdateSuccess);

  // Ẩn nút ngay khi component được mount
  setTimeout(hideMenuToggle, 100);
})

onUnmounted(() => {
  eventBus.off('update-success', handleUpdateSuccess);

  // Xóa timer khi component unmount
  if (hideTimer) {
    clearTimeout(hideTimer);
  }
})
</script>

<style scoped>
.container {
  max-width: 100%;
  margin-left: 0;
  background-color: #f8f9fa;
  padding: 80px 12px;
  min-height: 100vh;
  position: relative;
}

.row {
  padding: 0;
  position: relative;
}

.left-col {
  width: 25%;
  transition: transform 0.3s ease;
}

.right-col {
  width: 75%;
  transition: opacity 0.3s ease;
}

.member-card {
  margin: 0 auto;
}

/* Nút toggle menu cho mobile */
.menu-toggle {
  display: none;
  position: fixed;
  bottom: 20px;
  left: 10px;
  z-index: 1002;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  color: white;
  font-size: 16px;
  width: 60px;
  height: 50px;
  transition: all 0.3s ease;
  transform: translateX(-45px);
}

.menu-toggle.active {
  transform: translateX(0);
}

.menu-toggle:hover {
  background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
  box-shadow: 0 6px 16px rgba(0,0,0,0.2);
}

/* Overlay cho mobile */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
}

/* Responsive styles */
@media (max-width: 768px) {
  .container {
    padding: 60px 8px;
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left-col {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1000;
    background: white;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .left-col.mobile-open {
    transform: translateY(0);
  }

  .right-col {
    width: 100%;
  }

  .right-col.mobile-hidden {
    opacity: 0.3;
    pointer-events: none;
  }

  .mobile-overlay {
    display: block;
  }
}
</style>