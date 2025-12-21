<template>
  <div class="account-sidebar">
    <div class="menu-container">
      <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="menu-item"
          :class="{ active: isActive(item.link) }"
          @click="navigateTo(item)"
      >
        <div class="item-content">
          <div class="icon-wrapper">
            <i :class="item.icon" class="icon"></i>
          </div>
          <span class="label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Define emits
const emit = defineEmits(['link-clicked'])

const menuItems = ref([
  {
    label: "Trung tâm tài khoản",
    icon: "fa-solid fa-house-user",
    link: "/trung-tam-tai-khoan"
  },
  {
    label: "Thông tin cá nhân",
    icon: "fa-solid fa-user-gear",
    link: "/thong-tin-tai-khoan"
  },
  {
    label: "Mật khẩu và đăng nhập",
    icon: "fas fa-shield-alt",
    link: "/bao-mat"
  },
  {
    label: "Phát triển đội nhóm của bạn",
    icon: "fa-solid fa-people-group",
    link: "/nhom-cua-toi",
    notParentRoute: true
  },
  {
    label: "Hợp tác",
    icon: "fa-solid fa-sack-dollar",
    link: "/hop-tac",
    notParentRoute: true
  },
  {
    label: "Thanh toán",
    icon: "fa-solid fa-credit-card",
    link: "/thanh-toan"
  },
  {
    label: "Gói dịch vụ",
    icon: "fa-solid fa-gem",
    link: "/goi-dich-vu"
  },
  {
    label: "Quản lý tài sản",
    icon: "fa-solid fa-city",
    link: "/bao-cao-dinh-gia",
    notParentRoute: true
  },
  {
    label: "Hỗ trợ",
    icon: "fa-solid fa-headset",
    link: "/ho-tro"
  }

])

const isActive = (link) => {
  if (link === "/nhom-cua-toi") {
    return route.path.startsWith("/nhom-cua-toi");
  }
  return route.path.startsWith("/ho-so" + link);
};

const navigateTo = (item) => {

  if (item.notParentRoute) {
    router.push(item.link);
  } else {
    router.push("/ho-so" + item.link);
  }

  emit("link-clicked");
};

</script>

<style scoped>
.account-sidebar {
  width: 100%;
  height: 100%;
}

.menu-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.menu-item {
  width: 100%;
  padding: 15px;
  background: white;
  border-radius: 50px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: #E5EAFF;
  transition: left 0.3s ease;
  z-index: 1;
}

.menu-item:hover::before {
  left: 0;
}

.menu-item.active {
  background: #E5EAFF;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.menu-item.active::before {
  display: none;
}

.item-content {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(202, 212, 254, 0.77);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
}

.icon {
  font-size: 20px;
  color: #0030FF;
}

.label {
  color: #031358;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.4;
}

/* Responsive styles cho mobile */
@media (max-width: 768px) {
  .menu-container {
    padding: 30px 15px;
    border-radius: 0;
    height: 100%;
  }

  .menu-item {
    margin-bottom: 12px;
  }

  .icon-wrapper {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }

  .icon {
    font-size: 18px;
  }

  .label {
    font-size: 16px;
  }
}
</style>