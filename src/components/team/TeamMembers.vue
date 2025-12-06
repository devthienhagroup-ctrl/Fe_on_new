<template>
  <div class="team-members">

    <!-- TITLE -->
    <div class="header">
      <h5 class="title">Thành viên nhóm</h5>
    </div>

    <!-- LIST MEMBERS -->
    <div
        v-for="m in members"
        :key="m.idE"
        class="member-item"
    >
      <img :src="'https://s3.cloudfly.vn/thg-storage/uploads-public/' + m.avatar" class="avatar" />

      <div class="info">
        <div class="name">{{ m.fullName }}</div>
        <div class="email">{{ m.email }}</div>

        <div class="role">
          <span v-if="leaderId === m.idE" class="leader-badge">
            Trưởng nhóm
          </span>
        </div>
      </div>

      <!-- DELETE BUTTON -->
      <button
          v-if="leaderId !== m.idE && authStore.hasTeamPermission('TEAMUSER_REMOVE_MEMBER')
             || authStore.hasPermission('TEAMUSER_REMOVE_MEMBER')"
          class="btn-delete"
          @click="$emit('remove-member', m)"
      >
        <i class="fa-solid fa-user-minus"></i>
      </button>
    </div>

    <hr class="divider">

    <!-- CHANGE LEADER -->
    <h6 class="label" v-if="authStore.hasTeamPermission('TEAMUSER_CHANGE_LEADER')
            || authStore.hasPermission('TEAMUSER_CHANGE_LEADER')">Chọn trưởng nhóm mới</h6>
    <div class="leader-row"  v-if="authStore.hasTeamPermission('TEAMUSER_CHANGE_LEADER') || authStore.hasPermission('TEAMUSER_CHANGE_LEADER')">
      <input
          v-model="newLeaderEmail"
          type="email"
          class="input"
          placeholder="Nhập email thành viên..."
      />
      <button class="btn-primary" @click="submitLeader">
        Cập nhật
      </button>
    </div>

    <hr class="divider">

    <!-- DISBAND TEAM -->
    <button class="btn-danger" style="background-color: rgba(196,6,6,0.73)" @click="$emit('disband')"
            v-if="authStore.hasTeamPermission('TEAMUSER_REMOVE_MEMBER')
            || authStore.hasPermission('TEAMUSER_REMOVE_MEMBER')">
      <i class="fa-solid fa-triangle-exclamation me-1"></i>
      Giải tán nhóm
    </button>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {useAuthStore} from "../../stores/authStore.js";
const authStore = useAuthStore();


const props = defineProps({
  members: { type: Array, required: true },
  leaderId: { type: Number }
})

const emit = defineEmits(["remove-member", "change-leader", "disband"])

const newLeaderEmail = ref("")

const submitLeader = () => {
  if (!newLeaderEmail.value.trim()) return
  emit("change-leader", newLeaderEmail.value.trim())
  newLeaderEmail.value = ""
}
</script>

<style scoped>
/* Container */
.team-members {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(3, 19, 88, 0.08);
}

/* Title */
.header {
  margin-bottom: 16px;
}
.title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #031358;
}

/* Member Item */
.member-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 6px;
  border-radius: 10px;
  transition: background 0.2s ease, transform 0.15s ease;
  cursor: default;
}
.member-item:hover {
  background: rgba(3, 19, 88, 0.04);
  transform: translateX(2px);
}

/* Avatar */
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

/* Info */
.info {
  flex-grow: 1;
}
.name {
  font-weight: 600;
  color: #031358;
  font-size: 0.95rem;
}
.email {
  font-size: 0.8rem;
  color: rgba(3, 19, 88, 0.55);
}
.role {
  margin-top: 4px;
  font-size: 0.8rem;
  color: #0030FF;
  font-weight: 600;
}

/* Leader Badge */
.leader-badge {
  background: #28a745;
  color: #fff;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.7rem;
  margin-left: 8px;
}

/* Delete button */
.btn-delete {
  border: none;
  background: #ffe5e7;
  color: #d93025;
  padding: 6px 10px;
  font-size: 0.8rem;
  border-radius: 8px;
  transition: all 0.15s ease;
}
.btn-delete:hover {
  background: #ffcccc;
  transform: scale(1.05);
}

/* Divider */
.divider {
  margin: 22px 0;
  opacity: 0.12;
}

/* Change Leader */
.label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #031358;
  margin-bottom: 8px;
}
.leader-row {
  display: flex;
  gap: 10px;
}
.input {
  flex-grow: 1;
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  border: 1.5px solid rgba(3, 19, 88, 0.15);
  font-size: 0.9rem;
}
.input:focus {
  border-color: #0030FF;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 48, 255, 0.15);
}

.btn-primary {
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #0030FF, #00158a);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,48,255,0.3);
}

/* Disband */
.btn-danger {
  width: 100%;
  padding: 0.7rem;
  background: #d93025;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  transition: 0.2s ease;
}
.btn-danger:hover {
  background: #b3271e;
  transform: translateY(-2px);
}
</style>
