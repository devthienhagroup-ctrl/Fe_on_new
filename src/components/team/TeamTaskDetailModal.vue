<template>
  <transition name="fade">
    <div v-if="visible" class="task-modal-backdrop" @click.self="close">
      <div class="task-modal">

        <!-- Nút đóng -->
        <button class="close-btn" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="task-modal-content">

          <!-- HEADER -->
          <header class="task-modal__header">
            <div>
              <p class="task-code">NVN-{{ task?.id || 'N/A' }}</p>
              <h4 class="task-title">{{ task?.title || 'Chưa có tiêu đề' }}</h4>
              <small class="text-muted">Người tạo: {{ task?.creator?.fullName }}</small>
            </div>
          </header>

          <!-- BODY -->
          <div class="task-modal__body">

            <!-- Mô tả + hạn chót -->
            <div class="description-row">
              <section class="description-section">
                <h6 class="section-label">Mô tả</h6>
                <p v-html="task?.description"></p>
              </section>

              <section class="deadline-section">
                <h6 class="section-label">Hạn chót ứng tuyển</h6>
                <div class="deadline-box">
                  <strong>{{ formatDeadlineFuture(task?.applyDeadline) }}</strong>
                </div>
              </section>
            </div>

            <!-- META -->
            <section class="meta-grid">
              <div>
                <p class="section-label mb-1">Trạng thái</p>
                <span class="status-badge" :class="getStatusClass(task?.status)">
                  {{ getStatusText(task?.status) }}
                </span>
              </div>

              <div>
                <p class="section-label mb-1">Hạn xử lý</p>
                <strong>{{ formatDeadlineFuture(task?.dueAt) }}</strong>
              </div>

              <div>
                <p class="section-label mb-1">Người thực hiện</p>
                <div class="d-flex align-items-center gap-2">
                  <img
                      v-if="task.assignee?.avatar"
                      :src="fileUrl(task.assignee.avatar)"
                      class="avatar-img"
                  />
                  <span>{{ task.assignee?.fullName || 'Chưa có người được giao' }}</span>
                </div>
              </div>
            </section>

            <!-- ATTACHMENTS -->
            <section v-if="task?.attachments?.length">
              <h6 class="section-label">Tệp đính kèm</h6>

              <FileGallery
                  :fileList="task.attachments"
                  :entityId="task.id"
                  entityType="teamtask"
                  :can-edit="false"
              />
            </section>

            <!-- APPLICANTS -->
            <section>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="section-label mb-0">Ứng viên</h6>
                <small class="text-muted">{{ task?.applicants?.length || 0 }} yêu cầu</small>
              </div>

              <div class="applicant-list">

                <template v-if="task?.applicants?.length && authStore.hasTeamPermission('TEAMTASK_DECISION')
                || authStore.hasPermission('TEAMTASK_DECISION')">

                  <div
                      v-for="applicant in task.applicants"
                      :key="applicant.id"
                      class="applicant-item d-flex justify-content-between align-items-center"
                  >
                    <!-- LEFT: Avatar + Name + Message -->
                    <div class="d-flex align-items-start gap-2">
                      <img
                          v-if="applicant.avatar"
                          :src="fileUrl(applicant.avatar)"
                          class="avatar-img"
                      />

                      <div>
                        <div class="d-flex justify-content-between align-items-center w-100">
                          <p class="mb-0 fw-semibold">{{ applicant.memberName }}</p>
                          <small class="text-muted ms-2">{{ formatDateAt(applicant.appliedAt) }}</small>
                        </div>

                        <small class="text-muted" v-html="applicant.message"></small>
                      </div>
                    </div>

                    <!-- RIGHT: Action -->
                    <div class="d-flex align-items-center gap-2">

                      <!-- Nếu PENDING → Hiện 2 nút -->
                      <template v-if="applicant.status === 'PENDING'">
                        <button class="btn btn-success btn-sm" @click="approve(applicant)">
                          Duyệt
                        </button>
                        <button class="btn btn-outline-secondary btn-sm" @click="reject(applicant)">
                          Từ chối
                        </button>
                      </template>

                      <!-- Nếu APPROVED -->
                      <span v-else-if="applicant.status === 'APPROVED'" class="badge bg-success">
            Đã được chấp nhận
          </span>

                      <!-- Nếu REJECTED -->
                      <span v-else-if="applicant.status === 'REJECTED'" class="badge bg-secondary">
            Đã bị từ chối
          </span>

                    </div>
                  </div>

                </template>

                <p v-else class="text-muted pt-3 ps-3">Chưa có yêu cầu tham gia nào.</p>

              </div>
            </section>


            <!-- APPLY -->
            <section v-if="canApply" class="apply-box">
              <h6 class="section-label">Yêu cầu tham gia</h6>

              <textarea
                  class="form-control"
                  rows="3"
                  v-model="note"
                  placeholder="Mô tả ngắn về đóng góp của bạn"
              ></textarea>

              <div class="text-end mt-2">
                <button class="btn btn-primary" @click="submit" :disabled="!note.trim()">
                  Gửi yêu cầu
                </button>
              </div>
            </section>

          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import FileGallery from "../FileGallery.vue"
import { useAuthStore } from "/src/stores/authStore.js"

const props = defineProps({
  visible: Boolean,
  task: Object
})

const emit = defineEmits(["close", "apply", "approve", "reject"])

const authStore = useAuthStore()
const currentUserId = computed(() => authStore.info?.id)

const note = ref("")

// URL helper
const fileUrl = (fileName) => `https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${fileName}`

// ------------------ TIME FORMAT ------------------
const formatDateAt = (str) => {
  if (!str) return ""

  const d = new Date(str)
  const now = new Date()

  const diff = now - d
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  if (mins < 1) return "Vừa xong"
  if (mins < 60) return `${mins} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 7) return `${days} ngày trước`

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(d)
}
const formatDeadlineFuture = (str) => {
  if (!str) return ""

  const d = new Date(str)
  const now = new Date()

  const diff = d - now
  if (diff <= 0) return "Đã hết hạn"

  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  if (mins < 60) return `Còn ${mins} phút`
  if (hours < 24) return `Còn ${hours} giờ`
  if (days < 7) return `Còn ${days} ngày`

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(d)
}


// ------------------ STATUS ------------------
const getStatusText = (s) =>
    ({
      TODO: "Cần làm",
      IN_PROGRESS: "Đang làm",
      IN_PREVIEW: "Chờ duyệt",
      DONE: "Hoàn thành"
    }[s] || s)

const getStatusClass = (s) =>
    ({
      TODO: "status-todo",
      IN_PROGRESS: "status-in-progress",
      IN_PREVIEW: "status-review",
      DONE: "status-done"
    }[s] || "status-default")

// ------------------ APPLY LOGIC ------------------
const isOwner = computed(() => props.task?.creatorId === currentUserId.value)

const canApply = computed(() => {
  const deadline = props.task?.applyDeadline
  const notExpired = deadline ? new Date(deadline) > new Date() : true

  const hasAssignee = !!props.task?.assigneeId

  const currentId = Number(currentUserId.value)

  const sp = authStore.hasTeamPermission('TEAMTASK_DECISION') || authStore.hasPermission('TEAMTASK_DECISION')

  const alreadyApplied = computed(() =>
      (props.task?.applicants || []).some(a => Number(a.memberId) === currentId)
  )

  return (
      notExpired && sp &&
      !hasAssignee &&
      !alreadyApplied &&   // 🔥 nếu đã nộp đơn → khóa apply
      !isOwner.value
  )
})



watch(() => props.task?.id, () => (note.value = ""))

const close = () => emit("close")

const submit = () => {
  emit("apply", { note: note.value.trim() })
  note.value = ""
}

// ------------------ APPROVE / REJECT ------------------
const approve = (applicant) => {
  emit("approve", { applicantId: applicant.id })
}

// REJECT
const reject = (applicant) => {
  emit("reject", { applicantId: applicant.id })
}
</script>

<style scoped>
.applicant-item p {
  font-size: 0.95rem;
}

.applicant-item small {
  font-size: 0.8rem;
}

.applicant-item .text-muted {
  line-height: 1.3;
}

.avatar-img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(0, 48, 255, 0.2);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.task-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.42); /* đen mờ nhẹ */
  backdrop-filter: blur(5px);      /* 🔥 mờ nền phía sau */
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  overflow: hidden;
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

/* Layout cho mô tả và hạn chót ứng tuyển nằm ngang */
.description-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.description-section p {
  color: #031358;
  line-height: 1.6;
}

.deadline-section {
  display: flex;
  flex-direction: column;
}

.deadline-box {
  background: rgba(0, 48, 255, 0.05);
  border: 1px solid rgba(0, 48, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deadline-box strong {
  font-size: 1.1rem;
  color: #031358;
  font-weight: 600;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: rgba(3, 19, 88, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(3, 19, 88, 0.1);
}

/* Style cho các badge trạng thái */
.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
}

.status-todo {
  background: rgba(0, 48, 255, 0.1);
  color: #0030FF;
  border: 1px solid rgba(0, 48, 255, 0.3);
}

.status-in-progress {
  background: rgba(255, 153, 0, 0.1);
  color: #FF9900;
  border: 1px solid rgba(255, 153, 0, 0.3);
}

.status-review {
  background: rgba(255, 102, 0, 0.1);
  color: #FF6600;
  border: 1px solid rgba(255, 102, 0, 0.3);
}

.status-done {
  background: rgba(0, 200, 83, 0.1);
  color: #00C853;
  border: 1px solid rgba(0, 200, 83, 0.3);
}

.status-default {
  background: rgba(3, 19, 88, 0.1);
  color: #031358;
  border: 1px solid rgba(3, 19, 88, 0.3);
}

.avatars img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-right: -10px;
  box-shadow: 0 2px 4px rgba(3, 19, 88, 0.2);
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.attachment-item {
  width: 100%;
}

.attachment-link {
  display: flex;
  width: 100%;
  color: inherit;
  text-decoration: none;
}

.file-chip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(3, 19, 88, 0.15);
  border-radius: 12px;
  width: 100%;
  transition: all 0.2s ease;
  background: #fff;
}

.file-chip:hover {
  background: rgba(0, 48, 255, 0.05);
  border-color: #0030FF;
  transform: translateY(-1px);
}

.file-chip i {
  color: #0030FF;
  font-size: 1.2rem;
}

.applicant-list {
  border: 1px solid rgba(3, 19, 88, 0.1);
  border-radius: 12px;
  max-height: 180px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  background: #fff;
}

.applicant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(3, 19, 88, 0.05);
}

.applicant-item:last-child {
  border-bottom: none;
}

.apply-box {
  background: linear-gradient(135deg, rgba(0, 48, 255, 0.05), rgba(3, 19, 88, 0.08));
  border: 1px solid rgba(0, 48, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.apply-box .section-label {
  color: #031358;
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
}

.form-select:focus {
  border-color: #0030FF;
  box-shadow: 0 0 0 0.2rem rgba(0, 48, 255, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #031358, #0030FF);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 48, 255, 0.3);
}

.btn-primary:disabled {
  background: rgba(3, 19, 88, 0.3);
  cursor: not-allowed;
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
  .description-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .meta-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .task-modal {
    margin: 1rem;
  }
}
</style>