<template>
  <div class="appliers-box p-3">

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold mb-0">Danh sách ứng tuyển Cộng tác viên</h5>

      <!-- 🔄 BUTTON REFRESH -->
      <button
          class="btn btn-outline-primary btn-sm d-flex align-items-center"
          @click="$emit('refresh')"
      >
        <i class="fa-solid fa-rotate-right me-1"></i>
        Làm mới
      </button>
    </div>

    <div
        class="applier-item"
        v-for="u in appliers"
        :key="u.id"
    >
      <!-- Avatar -->
      <img
          :src="avatarUrl(u.avatar)"
          class="avatar"
      />

      <div class="info">
        <div class="name">
          {{ u.fullName }}

          <span
              class="badge ms-1"
              :class="u.hasReferral ? 'bg-primary' : 'bg-secondary'"
          >
            {{ u.hasReferral ? "Có mã GT" : "Tự do" }}
          </span>

        </div>

        <div class="email text-muted small">{{ u.email }}</div>

        <div class="address small">
          <i class="fa-solid fa-location-dot text-danger me-1"></i>
          {{ formatAddress(u.address) }}
        </div>
      </div>

      <div class="actions">
        <button
            class="btn btn-success btn-sm me-1"
            @click="$emit('approve', u)"
        >
          Duyệt
        </button>

        <button
            class="btn btn-outline-danger btn-sm"
            @click="$emit('reject', u)"
        >
          Từ chối
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  appliers: { type: Array, required: true },
});

// Format địa chỉ
const formatAddress = (addr) => {
  if (!addr) return "";
  return addr.replaceAll("/", ", ");
};

// Xử lý avatar
const avatarUrl = (img) => {
  if (!img) return "/imgs/default-avatar.png"; // fallback
  return `https://s3.cloudfly.vn/thg-storage/uploads-public/${img}`;
};
</script>
<style scoped>
.appliers-box {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.applier-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.applier-item:last-child {
  border-bottom: none;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  flex: 1;
}

.name {
  font-weight: 600;
}

.actions {
  display: flex;
  align-items: center;
}
</style>

