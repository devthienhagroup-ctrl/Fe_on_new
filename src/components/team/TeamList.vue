<template>
  <div class="team-list card shadow-sm border-0 thg-card">
    <div class="card-header bg-transparent border-0 d-flex align-items-center justify-content-between">
      <div>
        <button class="btn-back-profile" @click="router.push('/ho-so')">
          <i class="fa-solid fa-arrow-left-long"></i>
          <span>Quay về trang cá nhân</span>
        </button>
        <h5 class="mb-0 fw-semibold text-dark">Nhóm của tôi</h5>
        <small class="text-muted">{{ filteredTeams.length }} nhóm đang hiển thị</small>
      </div>

      <button v-if="authStore.hasTeamPermission('TEAMUSER_CREATE')
         || authStore.hasPermission('TEAMUSER_CREATE')"
              class="btn btn-sm btn-thg" @click="$emit('create')">
        <i class="fa-solid fa-plus me-1"></i>Tạo nhóm
      </button>


    </div>

    <div class="px-3 pb-3">
      <div class="input-group input-group-sm search-container">
        <input
            v-model="search"
            type="search"
            class="form-control search-input"
            placeholder="Tìm theo tên nhóm, mã nhóm"
        />
        <span class="input-group-text search-icon">
          <i class="fa-solid fa-search text-muted"></i>
        </span>
      </div>
    </div>

    <div class="list-group list-group-flush team-scroll">
      <div v-if="loading" class="py-4 text-center text-muted">
        <i class="fa-solid fa-spinner fa-spin me-1"></i>Đang tải danh sách nhóm...
      </div>

      <div v-else-if="!filteredTeams.length" class="py-4 text-center text-muted">
        Không tìm thấy nhóm phù hợp
      </div>

      <button
          v-for="team in filteredTeams"
          :key="team.teamId"
          type="button"
          class="list-group-item list-group-item-action border-0 rounded-0"
          :class="{ active: selectedId === team.teamId }"
          @click="$emit('select', team)"
      >
        <div class="d-flex align-items-center">
          <div class="avatar flex-shrink-0 me-3">
            <img :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'+ team.urlAvatar || getDefaultAvatar(team.teamId)" :alt="team.teamName" />

          </div>

          <div class="flex-grow-1 text-start team-info">
            <!-- Tên nhóm với màu #031358 -->
            <div class="team-name text-primary-dark mb-1">{{ team.teamName }}<span
                v-if="team.unreadCount > 0"
                class="unread-badge"
            >
                  {{ team.unreadCount }}
                </span></div>

            <!-- Mô tả nhóm -->
            <div
                class="team-description text-muted small mb-2 clamp-1"
                v-html="team.teamDescription || 'Không có mô tả'"
            ></div>

            <!-- Số thành viên -->
            <div class="team-members text-muted small">
              <i class="fa-solid fa-users me-1"></i>
              {{ team.countMembers }} {{ team.countMembers === 1 ? 'thành viên' : 'thành viên' }}
            </div>
          </div>
        </div>

        <!-- Hiệu ứng gradient cho item được chọn -->
        <div v-if="selectedId === team.teamId" class="active-gradient-overlay"></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import {useAuthStore} from "../../stores/authStore.js";
const authStore = useAuthStore();
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  teams: Array,
  loading: Boolean,
  selectedId: [String, Number, null]
})

const search = ref("")

const filteredTeams = computed(() => {
  if (!search.value) return props.teams
  const keyword = search.value.toLowerCase()
  return props.teams.filter((team) =>
      [team.teamName, team.teamCode, team.teamDescription]
          .filter(Boolean)
          .some((f) => f.toLowerCase().includes(keyword))
  )
})


// Hàm lấy avatar mặc định dựa trên teamId
const getDefaultAvatar = (teamId) => {
  const avatarOptions = [
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'
  ]

  const index = Math.abs(teamId.toString().split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)) % avatarOptions.length

  return avatarOptions[index]
}
</script>

<style scoped>
.team-list {
  border-radius: 18px;
  overflow: hidden;
  padding: 0;
}

.thg-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12) !important;
}

/* HEADER */
.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* BUTTON */
.btn-thg {
  background: linear-gradient(135deg, #031358, #0030FF);
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(3, 19, 88, 0.3);
}

.btn-thg:hover {
  filter: brightness(1.05);
}

/* SEARCH CONTAINER */
.search-container {
  height: 44px; /* Tăng height */
  border-radius: 10px; /* Giảm bo góc */
  background: #f8f9fa;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  overflow: hidden;
}

.search-container:focus-within {
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 48, 255, 0.1);
}

/* SEARCH INPUT */
.search-input {
  height: 100%;
  border: none;
  background: transparent;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  box-shadow: none;
  background: transparent;
}

/* SEARCH ICON */
.search-icon {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Ẩn dấu x mặc định của input search */
.search-input::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
}

/* SCROLL */
.team-scroll {
  max-height: 55vh;
  overflow-y: auto;
}

/* LIST ITEM */
.list-group-item {
  background: #fff;
  border: none !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 1rem;
}

/* Hover thay đổi màu nền */
.list-group-item:hover {
  background: rgba(3, 19, 88, 0.05);
  transform: none;
}

/* Active với màu xanh sáng hơn */
.list-group-item.active {
  background: linear-gradient(135deg, rgba(0, 48, 255, 0.15), rgba(3, 19, 88, 0.1));
  border-left: 4px solid #0030FF;
  font-weight: 600;
}

.list-group-item.active .team-name {
  color: #001793 !important;  /* màu chữ tên nhóm */
}

/* Hiệu ứng gradient chuyển động cho item được chọn */
.active-gradient-overlay {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 48, 255, 0.1),
      rgba(3, 19, 88, 0.15),
      rgba(0, 48, 255, 0.1),
      transparent
  );
  animation: shimmer 2s infinite;
  z-index: 1;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* AVATAR */
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.2s ease;
  border: 2px solid rgba(3, 19, 88, 0.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Hiệu ứng nhẹ cho avatar khi hover */
.list-group-item:hover .avatar {
  transform: scale(1.05);
  border-color: rgba(0, 48, 255, 0.3);
}

/* Team Info Layout */
.team-info {
  display: flex;
  flex-direction: column;
}

/* Tên nhóm với màu #031358 */
.team-name {
  color: #031358 !important;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.2;
}

/* Mô tả nhóm */
.team-description * {
  margin: 0 !important;
  padding: 0 !important;
}


/* Số thành viên */
.team-members {
  line-height: 1.4;
}

/* Màu custom cho text */
.text-primary-dark {
  color: #031358 !important;
}

.setting-btn {
  display: block;
  margin-left: auto;
  margin-top: 5px;
}
.clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.unread-badge {
  position: absolute;
  margin-left: 5px;
  transform: translate(0, 0); /* ⭐ Không lệch nữa */
  background: #dc3545;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 50px;
  min-width: 18px;
  text-align: center;
  line-height: 1;
  box-shadow: 0 0 4px rgba(0,0,0,0.25);
  z-index: 5;
}

.team-scroll {
  max-height: 60vh;        /* ⭐ Giới hạn chiều cao */
  overflow-y: auto;        /* ⭐ Bật thanh cuộn */
  padding-right: 2px;      /* để tránh đè nội dung */
}

/* ⭐ Scrollbar đẹp */
.team-scroll::-webkit-scrollbar {
  width: 6px;
}

.team-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.team-scroll::-webkit-scrollbar-thumb {
  background: rgba(3, 19, 88, 0.25); /* màu xanh đậm dạng mờ */
  border-radius: 10px;
}

.team-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(3, 19, 88, 0.45);
}
.btn-back-profile {
  background: transparent;
  border: none;
  color: #031358;             /* màu xanh THG */
  font-size: 15px;
  font-weight: 600;
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-back-profile i {
  color: #031358;             /* icon xanh */
  font-size: 16px;
}

.btn-back-profile:hover {
  color: #020c3a;             /* xanh đậm hơn */
}

.btn-back-profile:hover i {
  color: #020c3a;
}

</style>