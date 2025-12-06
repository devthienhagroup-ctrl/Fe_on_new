<template>
  <transition name="fade">
    <div v-if="visible" class="task-modal-backdrop" @click.self="close">
      <div class="task-modal">
        <!-- Nút đóng -->
        <button class="close-btn" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- Container chứa nội dung -->
        <div class="task-modal-content">
          <header class="task-modal__header">
            <div>
              <p class="task-code">Phân chia nhiệm vụ</p>
              <h4 class="task-title">{{ task?.title || 'Chưa có tiêu đề' }}</h4>
              <small class="text-muted">{{ task?.assignees?.length || 0 }} thành viên đang tham gia</small>
            </div>
          </header>
          <div class="task-modal__body">
            <section>
              <h6 class="section-label mb-2">Ứng viên đang chờ</h6>
              <div v-if="task?.applicants?.length" class="applicant-grid">
                <div v-for="applicant in task.applicants" :key="applicant.id" class="applicant-card">
                  <div>

                    <!-- Avatar + Tên Nằm Ngang -->
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <img
                          v-if="applicant.avatar"
                          :src="'https://s3.cloudfly.vn/thg-storage/uploads-public/' + applicant.avatar"
                          class="rounded-circle shadow-sm"
                          width="32"
                          height="32"
                          alt="avatar"
                      />
                      <p class="mb-0 fw-semibold">{{ applicant.memberName }}</p>
                    </div>

                    <!-- Message -->
                    <small class="text-muted">{{ applicant.message }}</small><br>

                    <!-- Applied time -->
                    <small class="text-muted">{{ formatAppliedAt(applicant.appliedAt) }}</small>

                  </div>

                  <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-success btn-sm flex-fill" @click="approve(applicant)">
                      Duyệt
                    </button>
                    <button class="btn btn-outline-secondary btn-sm flex-fill" @click="reject(applicant)">
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
              <p v-else class="text-muted">Chưa có yêu cầu mới.</p>
            </section>
            <section class="mt-4">
              <h6 class="section-label mb-2">Thành viên đang tham gia</h6>

              <div v-if="task?.assignee" class="participant-list">
                <div class="participant-item">
                  <div class="d-flex align-items-center gap-3">
                    <!-- Avatar -->
                    <img
                        v-if="task.assignee?.avatar"
                        :src="'https://s3.cloudfly.vn/thg-storage/uploads-public/' + task.assignee.avatar"
                        class="rounded-circle shadow-sm"
                        width="35"
                        height="35"
                        alt="avatar"
                    />
                    <!-- Tên -->
                    <p class="mb-0 fw-semibold">{{ task.assignee.fullName }}</p>
                  </div>
                </div>
              </div>

              <p v-else class="text-muted">Chưa có thành viên nào được giao.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  task: { type: Object, default: null },
})

const emit = defineEmits(['close', 'decision'])

const close = () => emit('close')

// Khi task thay đổi → không cần sync role nữa
watch(() => props.task, () => {}, { immediate: true })

const approve = (applicant) => {
  emit('decision', {
    applicantId: applicant.id,
    status: 'APPROVED'
  })
}

const reject = (applicant) => {
  emit('decision', {
    applicantId: applicant.id,
    status: 'REJECTED'
  })
}

const formatAppliedAt = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()

  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  // < 1 phút
  if (diffMinutes < 1) return "Vừa xong"

  // < 60 phút
  if (diffMinutes < 60) return `${diffMinutes} phút trước`

  // < 24 giờ
  if (diffHours < 24) return `${diffHours} giờ trước`

  // < 7 ngày
  if (diffDays < 7) return `${diffDays} ngày trước`

  // >= 7 ngày → trả ngày + giờ chi tiết
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date)
}

</script>


<style scoped>
.task-modal-backdrop {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.39); /* Mờ đen dịu */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}


.task-modal {
  position: relative;
  width: min(840px, 94vw);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 24px;
  padding: 2px;
  scrollbar-width: thin;
}

.task-modal-content {
  background: #fff;
  border-radius: 22px;
  padding: 1.5rem;
  color: #031358;
  height: 100%;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #0030FF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0030FF;
  z-index: 10;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
}

.close-btn:hover {
  background: #0030FF;
  color: #fff;
  transform: scale(1.05);
}

.task-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(3, 19, 88, 0.1);
}

.task-code {
  color: #0030FF;
  margin-bottom: 0.2rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.task-title {
  margin: 0;
  color: #031358;
  font-weight: 700;
}

.section-label {
  color: #001793;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.applicant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.applicant-card {
  background: rgba(0, 48, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(0, 48, 255, 0.1);
  padding: 1.2rem;
  transition: all 0.2s ease;
}

.applicant-card:hover {
  background: rgba(0, 48, 255, 0.05);
  border-color: rgba(0, 48, 255, 0.2);
  transform: translateY(-2px);
}

.participant-list {
  border: 1px solid rgba(3, 19, 88, 0.1);
  border-radius: 16px;
  background: rgba(3, 19, 88, 0.02);
  overflow: hidden;
}

.participant-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid rgba(3, 19, 88, 0.05);
  transition: background-color 0.2s ease;
}

.participant-item:hover {
  background: rgba(0, 48, 255, 0.03);
}

.participant-item:last-child {
  border-bottom: none;
}

.form-control {
  border: 1px solid rgba(3, 19, 88, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
}

.form-control:focus {
  border-color: #0030FF;
  box-shadow: 0 0 0 0.2rem rgba(0, 48, 255, 0.1);
}

.form-select {
  border: 1px solid rgba(3, 19, 88, 0.2);
  border-radius: 8px;
  font-size: 0.85rem;
}

.form-select:focus {
  border-color: #0030FF;
  box-shadow: 0 0 0 0.2rem rgba(0, 48, 255, 0.1);
}

.btn-success {
  background: linear-gradient(135deg, #00C853, #009624);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 200, 83, 0.3);
}

.btn-outline-secondary {
  border: 1px solid rgba(3, 19, 88, 0.3);
  color: rgba(3, 19, 88, 0.7);
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-outline-secondary:hover {
  background: rgba(3, 19, 88, 0.05);
  border-color: rgba(3, 19, 88, 0.5);
  transform: translateY(-1px);
}

.text-muted {
  color: rgba(3, 19, 88, 0.6) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .applicant-grid {
    grid-template-columns: 1fr;
  }

  .participant-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .participant-item select {
    width: 100%;
  }

  .task-modal {
    margin: 1rem;
  }
}
</style>