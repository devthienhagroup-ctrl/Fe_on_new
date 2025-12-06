<template>
  <div class="team-invites card border-0 shadow-sm">
    <div class="card-header bg-transparent border-0">
      <h6 class="mb-0 fw-semibold text-dark">Lời mời</h6>
      <small class="text-muted">Gửi email kết nối đồng đội & nhận thư mời</small>
    </div>
    <div class="card-body">
      <form class="mb-3" @submit.prevent="handleInvite">
        <div class="input-group rounded bg-light">
          <span class="input-group-text bg-transparent border-0 ps-3">
            <i class="fa-solid fa-envelope text-muted"></i>
          </span>
          <input v-model="email" type="email" class="form-control border-0 bg-transparent" placeholder="Nhập email" required />
          <button
              class="btn btn-send btn-sm me-1"
              type="submit"
              :disabled="props.loadingInvite || !isValidEmail"
              :class="{'btn-active': isValidEmail}"
          >
            <i class="fa-solid fa-paper-plane me-1"></i>Gửi
          </button>
        </div>
      </form>

      <!-- Phần lời mời đã gửi - có thể thu gọn -->
      <div class="sent-section mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <p class="fw-semibold mb-0">Lời mời đã gửi</p>
          <button
              class="btn btn-sm btn-toggle"
              @click="toggleSentSection"
              :aria-expanded="sentSectionExpanded"
          >
            <i class="fa-solid" :class="sentSectionExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
        </div>

        <div class="collapse" :class="{'show': sentSectionExpanded}">
          <div class="invite-list">
            <div v-if="props.loading" class="text-center text-muted py-3">
              <i class="fa-solid fa-spinner fa-spin me-1"></i>Đang tải lời mời...
            </div>
            <div v-else-if="!props.invites.length" class="text-center text-muted py-3">
              Chưa có lời mời nào
            </div>
            <div v-else class="list-group list-group-flush">
              <div
                  v-for="invite in props.invites"
                  :key="invite.id"
                  class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div class="fw-semibold">{{ invite.email }}</div>
                  <small class="text-muted">{{ formatRelativeTime(invite.createdAt) }} · {{ statusText(invite.status) }}</small>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-action btn-sm" @click="$emit('resend', invite)">
                    Gửi lại
                  </button>
                  <button class="btn btn-action btn-sm btn-cancel" @click="$emit('cancel', invite)">
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Phần lời mời tham gia nhóm -->
      <div class="incoming-section">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div class="d-flex align-items-center">
            <p class="fw-semibold mb-0 me-2">Thư mời tham gia nhóm</p>
            <span v-if="incoming.length > 0" class="badge badge-notification">{{ incoming.length }}</span>
          </div>
          <button
              class="btn btn-sm btn-toggle"
              @click="toggleIncomingSection"
              :aria-expanded="incomingSectionExpanded"
          >
            <i class="fa-solid" :class="incomingSectionExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>
        </div>

        <div class="collapse" :class="{'show': incomingSectionExpanded}">
          <div v-if="!incoming.length" class="text-muted small">Bạn chưa có lời mời nào.</div>
          <div v-else class="incoming-list">
            <div v-for="invite in incoming" :key="invite.id" class="incoming-card">
              <div class="incoming-content">
                <p class="mb-0 text-dark fw-semibold">{{ invite.teamName }}</p>
                <small class="text-muted">Mời bởi {{ invite.inviter?.fullName }} · {{ formatRelativeTime(invite.createdAt) }}</small>
              </div>
              <div class="incoming-actions">
                <button class="btn btn-sm btn-accept" @click.prevent="$emit('respond', { invite, status: 'ACCEPTED' })">
                  Chấp nhận
                </button>
                <button class="btn btn-sm btn-reject" @click.prevent="$emit('respond', { invite, status: 'REJECTED' })">
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  invites: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  loadingInvite: { type: Boolean, default: false },
  incoming: { type: Array, default: () => [] },
})

const emit = defineEmits(['invite', 'resend', 'cancel', 'respond'])

const email = ref('')
const sentSectionExpanded = ref(false)
const incomingSectionExpanded = ref(true) // Mở mặc định phần thư mời

const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const handleInvite = () => {
  if (!email.value || !isValidEmail.value) return
  emit('invite', email.value)
  email.value = ''
}

const toggleSentSection = () => {
  sentSectionExpanded.value = !sentSectionExpanded.value
}

const toggleIncomingSection = () => {
  incomingSectionExpanded.value = !incomingSectionExpanded.value
}

const formatRelativeTime = (date) => {
  if (!date) return ''

  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now - targetDate) / 1000)

  if (diffInSeconds < 60) {
    return 'Vừa xong'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} phút trước`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} giờ trước`
  } else if (diffInSeconds < 2592000) { // 30 ngày
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ngày trước`
  } else if (diffInSeconds < 31536000) { // 365 ngày
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} tháng trước`
  } else {
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} năm trước`
  }
}

const statusText = (status) => {
  switch (status) {
    case 'ACCEPTED':
      return 'Đã tham gia'
    case 'EXPIRED':
      return 'Hết hạn'
    default:
      return 'Đang chờ'
  }
}
</script>

<style scoped>
.team-invites {
  border-radius: 18px;
}

/* ===== Nút gửi mail với hiệu ứng chuyển màu linear ===== */
.btn-send {
  background-color: #031358;
  border: none;
  color: #fff;
  font-weight: 600;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  position: relative;
  overflow: hidden;
}

/* Trạng thái mặc định khi email chưa hợp lệ */
.btn-send:not(.btn-active) {
  background-color: #031358;
  opacity: 0.7;
  cursor: not-allowed;
}

/* Hiệu ứng chuyển màu linear khi email hợp lệ */
.btn-active {
  background: linear-gradient(135deg, #0030FF 0%, #031358 50%, #0025cc 100%);
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
  box-shadow: 0 4px 15px rgba(3, 19, 88, 0.4);
  cursor: pointer;
  opacity: 1;
}

/* Hiệu ứng hover khi email hợp lệ */
.btn-active:hover:not(:disabled) {
  animation: gradientShiftHover 1.5s ease infinite;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(3, 19, 88, 0.6);
}

/* Animation chuyển màu linear */
@keyframes gradientShift {
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

@keyframes gradientShiftHover {
  0% {
    background-position: 0% 50%;
    box-shadow: 0 6px 20px rgba(3, 19, 88, 0.6);
  }
  50% {
    background-position: 100% 50%;
    box-shadow: 0 8px 25px rgba(3, 19, 88, 0.8);
  }
  100% {
    background-position: 0% 50%;
    box-shadow: 0 6px 20px rgba(3, 19, 88, 0.6);
  }
}

.btn-send:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  animation: none;
}

/* ===== Input email ===== */
.input-group {
  border-radius: 8px;
  padding: 0.5rem 0;
  height: 50px;
  transition: all 0.3s ease;
}

.input-group:focus-within {
  box-shadow: 0 0 0 2px rgba(3, 19, 88, 0.2);
}

.input-group input {
  height: 100%;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-group input:focus {
  box-shadow: none;
}

/* ===== Nút toggle ===== */
.btn-toggle {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #031358;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s ease;
}

.btn-toggle:hover {
  background: #f8f9fa;
}

/* ===== Badge thông báo ===== */
.badge-notification {
  background: linear-gradient(135deg, #ff4d4f, #ff7a45);
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* ===== Nút hành động ===== */
.btn-action {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #031358;
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-action:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.btn-cancel {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-cancel:hover {
  background: #dc3545;
  color: white;
}

/* ===== Danh sách lời mời đã gửi ===== */
.list-group-item {
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  transition: all 0.3s ease;
}

.list-group-item:last-child {
  border-bottom: none;
}

.list-group-item:hover {
  background: #fafafa;
  transform: translateX(5px);
}

/* ===== Incoming Invites ===== */
.incoming-card {
  border: 1px solid rgba(3, 19, 88, 0.1);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  background: #f8f9ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.incoming-content {
  flex: 1;
  min-width: 0;
}

.incoming-actions {
  flex-shrink: 0;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.incoming-actions .btn {
  white-space: nowrap;
  flex-shrink: 0;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-accept {
  background: linear-gradient(135deg, #0030FF, #031358);
  border: none;
  color: white;
  position: relative;
  overflow: hidden;
}

.btn-accept:hover {
  background: linear-gradient(135deg, #0025cc, #020c3d);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(3, 19, 88, 0.4);
}

.btn-reject {
  background: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
  transition: all 0.3s ease;
}

.btn-reject:hover {
  background: #dc3545;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.incoming-card:hover {
  background: #f0f2ff;
  border-color: rgba(3, 19, 88, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.1);
}

.incoming-card + .incoming-card {
  margin-top: 0.75rem;
}

/* Responsive cho mobile */
@media (max-width: 576px) {
  .incoming-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .incoming-actions {
    align-self: flex-end;
    width: 100%;
    justify-content: flex-end;
  }

  .input-group {
    flex-wrap: nowrap;
  }

  .btn-send {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }

  /* Giảm tốc độ animation trên mobile để tiết kiệm pin */
  .btn-active {
    animation-duration: 4s;
  }
}
</style>