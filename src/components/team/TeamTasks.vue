<template>
  <div class="team-tasks card border-0 shadow">
    <div class="card-header bg-transparent border-0 d-flex flex-column flex-md-row justify-content-between gap-3">
      <div>
        <p class="text-uppercase text-muted small mb-1">Bảng nhiệm vụ</p>
        <h5 class="mb-0 fw-semibold text-dark">Tiến độ công việc</h5>
        <small class="text-muted">{{ tasks.length }} công việc đang theo dõi</small>
      </div>
      <div class="d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
        <!-- Toggle switch phân chia theo nhãn -->
        <div class="toggle-container d-flex align-items-center me-3">
          <span class="toggle-label me-2 small text-muted">Phân chia theo nhãn</span>
          <div class="form-check form-switch mb-0">
            <input
                class="form-check-input"
                type="checkbox"
                id="labelToggle"
                v-model="groupByLabel"
                @change="$emit('filter-change', { groupByLabel, selectedLabels })"
            />
            <label class="form-check-label" for="labelToggle"></label>
          </div>
        </div>

        <!-- Dropdown chọn nhãn -->
        <div class="label-filter-container" v-if="groupByLabel">
          <div class="dropdown">
            <button class="btn btn-outline-dark btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
              <i class="fa-solid fa-tags me-1"></i>
              Lọc nhãn
              <span v-if="selectedLabels.length > 0" class="badge bg-primary ms-1">{{ selectedLabels.length }}</span>
            </button>
            <div class="dropdown-menu dropdown-menu-end p-3" style="min-width: 250px;">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Chọn nhãn</h6>
                <button
                    class="btn btn-link btn-sm p-0 text-decoration-none"
                    @click="toggleAllLabels"
                >
                  {{ selectedLabels.length === columns.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}
                </button>
              </div>
              <div class="label-options">
                <div class="form-check mb-2" v-for="column in columns" :key="column.status">
                  <input
                      class="form-check-input"
                      type="checkbox"
                      :value="column.status"
                      v-model="selectedLabels"
                      @change="$emit('filter-change', { groupByLabel, selectedLabels })"
                  />
                  <label class="form-check-label d-flex align-items-center" :for="`label-${column.status}`">
                    <span class="status-indicator me-2" :class="statusBadgeClass(column.status)"></span>
                    {{ column.label }}
                    <span class="badge ms-2" :class="statusBadgeClass(column.status)">
                      {{ getTotalTasksByStatus(column.status) }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="btn btn-outline-dark btn-sm" @click="$emit('refresh')">
          <i class="fa-solid fa-rotate me-1"></i>Làm mới
        </button>
        <button v-if="authStore.hasTeamPermission('TEAMTASK_CREATE') || authStore.hasPermission('TEAMTASK_CREATE')"
                class="btn btn-gradient btn-sm" @click="$emit('create')">
          <i class="fa-solid fa-plus me-1"></i>Tạo nhiệm vụ
        </button>
      </div>
    </div>

    <div class="card-body">
      <div v-if="loading" class="text-center text-muted py-4">
        <i class="fa-solid fa-spinner fa-spin me-1"></i> Đang tải nhiệm vụ...
      </div>

      <!-- Chế độ phân chia theo nhãn -->
      <div v-else-if="groupByLabel">
        <div class="row g-4">
          <!-- Cột Nhiệm vụ đã tạo -->
          <div class="col-12 col-md-6">
            <div class="task-column">
              <div class="column-header">
                <h6 class="mb-0 fw-semibold">Nhiệm vụ trong nhóm</h6>
                <span class="badge rounded-pill bg-light text-dark">{{ tasks.length }}</span>
              </div>

              <div class="status-section" v-for="column in filteredColumns" :key="column.status">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-semibold">{{ column.label }}</span>
                  <span class="badge rounded-pill" :class="statusBadgeClass(column.status)">
                    {{ columnTasks(column.status, 'created').length }}
                  </span>
                </div>

                <div class="task-card" v-for="task in columnTasks(column.status, 'created')" :key="task.id" @click="$emit('view', task)">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="flex-grow-1">
                      <strong class="task-title">{{ task.title }}</strong>
                      <p class="mb-0 small text-muted" v-html="task.description || 'Không có mô tả'"></p>
                    </div>
                    <span class="badge ms-2" :class="statusClass(task.status)">{{ statusText(task.status) }}</span>
                  </div>
                  <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <div class="avatars">
                      <img
                          v-if="task.assignee"
                          :src="buildPublicAvatarUrl(task.assignee.avatar)"
                          :alt="task.assignee.fullName"
                          class="avatar"
                      />
                    </div>
                    <span class="badge bg-soft-dark">{{ task.dueAt ? formatDue(task.dueAt) : 'Chưa có hạn' }}</span>
                  </div>
                  <div v-if="task.attachments?.length" class="attachment-preview mt-2">
                    <div
                        v-for="file in task.attachments.slice(0, 2)"
                        :key="file.id || file.url"
                        class="attachment-chip"
                        @click.stop
                        :ref="(el) => observeAttachment(file, el)"
                    >
                      <!-- ⭐ Tự nhận ra file ảnh -->
                      <img
                          v-if="isImageFile(file)"
                          :src="getAttachmentViewUrl(file) || '/placeholder-image.jpg'"
                          :alt="file.fileName"
                      />

                      <!-- ⭐ File thường -->
                      <div v-else class="file-chip">
                        <i class="fa-solid fa-paperclip me-1"></i>
                        <span>{{ file.fileName }}</span>
                      </div>
                    </div>
                    <span v-if="task.attachments.length > 2" class="extra" @click.stop>+{{ task.attachments.length - 2 }}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <button
                        class="btn btn-link btn-sm px-0 text-decoration-none"
                        @click.stop="$emit('manage-applicants', task)"
                    >
                      <i class="fa-solid fa-users-gear me-1"></i>Ứng viên ({{ task.applicants?.length || 0 }})
                    </button>
                    <div class="dropdown" @click.stop>
                      <button class="btn btn-link btn-sm text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fa-solid fa-ellipsis"></i>
                      </button>
                      <div class="dropdown-menu dropdown-menu-end" v-if="authStore.hasTeamPermission('TEAMCHAT_UPDATE_STATUS')
                      || authStore.hasPermission('TEAMCHAT_UPDATE_STATUS')">
                        <button  class="dropdown-item" v-for="option in statusOptions" :key="option.value" @click="$emit('update-status', { task, status: option.value })">
                          {{ option.label }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="!columnTasks(column.status, 'created').length" class="empty text-muted">Không có công việc</div>
              </div>
            </div>
          </div>

          <!-- Cột Nhiệm vụ đã nhận -->
          <div class="col-12 col-md-6">
            <div class="task-column">
              <div class="column-header">
                <h6 class="mb-0 fw-semibold">Nhiệm vụ đã nhận</h6>
                <span class="badge rounded-pill bg-light text-dark">{{ getFilteredReceivedTasks().length }}</span>
              </div>

              <div class="status-section" v-for="column in filteredColumns" :key="column.status">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-semibold">{{ column.label }}</span>
                  <span class="badge rounded-pill" :class="statusBadgeClass(column.status)">
                    {{ columnTasks(column.status, 'received').length }}
                  </span>
                </div>

                <div class="task-card" v-for="task in columnTasks(column.status, 'received')" :key="task.id" @click="$emit('view', task)">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="flex-grow-1">
                      <strong class="task-title">{{ task.title }}</strong>
                      <p class="mb-0 small text-muted" v-html="task.description || 'Không có mô tả'"></p>
                    </div>
                    <span class="badge ms-2" :class="statusClass(task.status)">{{ statusText(task.status) }}</span>
                  </div>
                  <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <div class="avatars">
                      <img
                          v-for="member in task.assignees || []"
                          :key="member.id || member.employeeID"
                          :src="buildPublicAvatarUrl(member.avatar)"
                          :alt="member.fullName"
                          class="avatar"
                      />
                    </div>
                    <span class="badge bg-soft-dark">{{ task.dueAt ? formatDue(task.dueAt) : 'Chưa có hạn' }}</span>
                  </div>
                  <div v-if="task.attachments?.length" class="attachment-preview mt-2">
                    <div
                        v-for="file in task.attachments.slice(0, 2)"
                        :key="file.id || file.url"
                        class="attachment-chip"
                        @click.stop
                        :ref="(el) => observeAttachment(file, el)"
                    >
                      <img
                          v-if="isImageFile(file)"
                          :src="getAttachmentViewUrl(file) || '/placeholder-image.jpg'"
                          :alt="file.fileName"
                      />
                      <div v-else class="file-chip">
                        <i class="fa-solid fa-paperclip me-1"></i>
                        <span>{{ file.fileName }}</span>
                      </div>
                    </div>
                    <span v-if="task.attachments.length > 2" class="extra" @click.stop>+{{ task.attachments.length - 2 }}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <button
                        class="btn btn-link btn-sm px-0 text-decoration-none"
                        @click.stop="$emit('manage-applicants', task)"
                    >
                      <i class="fa-solid fa-users-gear me-1"></i>Ứng viên ({{ task.applicants?.length || 0 }})
                    </button>
                    <div class="dropdown" @click.stop>
                      <button class="btn btn-link btn-sm text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fa-solid fa-ellipsis"></i>
                      </button>
                      <div class="dropdown-menu dropdown-menu-end" v-if="authStore.hasTeamPermission('TEAMCHAT_UPDATE_STATUS')
                        || authStore.hasPermission('TEAMCHAT_UPDATE_STATUS')">
                        <button class="dropdown-item" v-for="option in statusOptions" :key="option.value" @click="$emit('update-status', { task, status: option.value })">
                          {{ option.label }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="!columnTasks(column.status, 'received').length" class="empty text-muted">Không có công việc</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chế độ xem thông thường (không phân chia theo nhãn) -->
      <div v-else>
        <div class="row g-4">
          <!-- Cột Nhiệm vụ đã tạo -->
          <div class="col-12 col-md-6">
            <div class="task-column">
              <div class="column-header">
                <h6 class="mb-0 fw-semibold">Nhiệm vụ trong nhóm</h6>
                <span class="badge rounded-pill bg-light text-dark">{{ tasks.length }}</span>
              </div>

              <div class="task-card" v-for="task in tasks" :key="task.id" @click="$emit('view', task)">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="flex-grow-1">
                    <strong class="task-title">{{ task.title }}</strong>
                    <p class="mb-0 small text-muted" v-html="task.description || 'Không có mô tả'"></p>
                  </div>
                  <span class="badge ms-2" :class="statusClass(task.status)">{{ statusText(task.status) }}</span>
                </div>
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                  <div class="avatars">
                    <img
                        v-if="task.assignee"
                        :src="buildPublicAvatarUrl(task.assignee.avatar)"
                        :alt="task.assignee.fullName"
                        class="avatar"
                    />
                  </div>
                  <span class="badge bg-soft-dark">{{ task.dueAt ? formatDue(task.dueAt) : 'Chưa có hạn' }}</span>
                </div>
                <div v-if="task.attachments?.length" class="attachment-preview mt-2">
                  <div
                      v-for="file in task.attachments.slice(0, 2)"
                      :key="file.id || file.url"
                      class="attachment-chip"
                      @click.stop
                      :ref="(el) => observeAttachment(file, el)"
                  >
                    <!-- ⭐ Tự nhận ra file ảnh -->
                    <img
                        v-if="isImageFile(file)"
                        :src="getAttachmentViewUrl(file) || '/placeholder-image.jpg'"
                        :alt="file.fileName"
                    />

                    <!-- ⭐ File thường -->
                    <div v-else class="file-chip">
                      <i class="fa-solid fa-paperclip me-1"></i>
                      <span>{{ file.fileName }}</span>
                    </div>
                  </div>

                  <span v-if="task.attachments.length > 2" class="extra" @click.stop>+{{ task.attachments.length - 2 }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <button
                      class="btn btn-link btn-sm px-0 text-decoration-none"
                      @click.stop="$emit('manage-applicants', task)"
                  >
                    <i class="fa-solid fa-users-gear me-1"></i>Ứng viên ({{ task.applicants?.length || 0 }})
                  </button>
                  <div class="dropdown" @click.stop>
                    <button class="btn btn-link btn-sm text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
                      <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end"
                         v-if="authStore.hasTeamPermission('TEAMCHAT_UPDATE_STATUS') || authStore.hasPermission('TEAMCHAT_UPDATE_STATUS')" >
                      <button class="dropdown-item" v-for="option in statusOptions" :key="option.value" @click="$emit('update-status', { task, status: option.value })">
                        {{ option.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="!tasks.length" class="empty text-muted">Không có công việc</div>
            </div>
          </div>

          <!-- Cột Nhiệm vụ đã nhận -->
          <div class="col-12 col-md-6">
            <div class="task-column">
              <div class="column-header">
                <h6 class="mb-0 fw-semibold">Nhiệm vụ đã nhận</h6>
                <span class="badge rounded-pill bg-light text-dark">{{ receivedTasks.length }}</span>
              </div>

              <div class="task-card" v-for="task in receivedTasks" :key="task.id" @click="$emit('view', task)">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="flex-grow-1">
                    <strong class="task-title">{{ task.title }}</strong>
                    <p class="mb-0 small text-muted" v-html="task.description || 'Không có mô tả'"></p>
                  </div>
                  <span class="badge ms-2" :class="statusClass(task.status)">{{ statusText(task.status) }}</span>
                </div>
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                  <div class="avatars">
                    <img
                        v-for="member in task.assignees || []"
                        :key="member.id || member.employeeID"
                        :src="buildPublicAvatarUrl(member.avatar)"
                        :alt="member.fullName"
                        class="avatar"
                    />
                  </div>
                  <span class="badge bg-soft-dark">{{ task.dueAt ? formatDue(task.dueAt) : 'Chưa có hạn' }}</span>
                </div>
                <div v-if="task.attachments?.length" class="attachment-preview mt-2">
                  <div
                      v-for="file in task.attachments.slice(0, 2)"
                      :key="file.id || file.url"
                      class="attachment-chip"
                      @click.stop
                  >
                    <img
                        v-if="isImageFile(file)"
                        :src="getAttachmentViewUrl(file) || '/placeholder-image.jpg'"
                        :alt="file.fileName"
                        :ref="(el) => observeAttachment(file, el)"
                    />
                    <div v-else class="file-chip">
                      <i class="fa-solid fa-paperclip me-1"></i>
                      <span>{{ file.fileName }}</span>
                    </div>
                  </div>
                  <span v-if="task.attachments.length > 2" class="extra" @click.stop>+{{ task.attachments.length - 2 }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <button
                      class="btn btn-link btn-sm px-0 text-decoration-none"
                      @click.stop="$emit('manage-applicants', task)"
                  >
                    <i class="fa-solid fa-users-gear me-1"></i>Ứng viên ({{ task.applicants?.length || 0 }})
                  </button>
                  <div class="dropdown" @click.stop>
                    <button class="btn btn-link btn-sm text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
                      <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end"
                          v-if="authStore.hasTeamPermission('TEAMCHAT_UPDATE_STATUS') || authStore.hasPermission('TEAMCHAT_UPDATE_STATUS')" >
                      <button class="dropdown-item" v-for="option in statusOptions" :key="option.value" @click="$emit('update-status', { task, status: option.value })">
                        {{ option.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="!receivedTasks.length" class="empty text-muted">Không có công việc</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { buildPublicAvatarUrl, isImageFile } from '../../utils/fileUrl.js'
import { useAuthStore } from "../../stores/authStore.js";
import {getCachedFileDataUrl, loadPrivateFileDataUrl, resolveFileId} from "../../api/fileApi.js";

const props = defineProps({
  tasks: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  currentUser: { type: Object, default: () => ({}) }
})

const emit = defineEmits([
  'refresh',
  'update-status',
  'view',
  'create',
  'manage-applicants',
  'filter-change'
])


// Biến để điều khiển toggle
const groupByLabel = ref(true)

// Danh sách nhãn được chọn
const selectedLabels = ref(['TODO', 'IN_PROGRESS', 'IN_PREVIEW', 'DONE'])
const attachmentUrls = ref({})
const attachmentPromises = new Map()
const attachmentElements = new Map()

const columns = [
  { status: 'TODO', label: 'Cần làm' },
  { status: 'IN_PROGRESS', label: 'Đang làm' },
  { status: 'IN_PREVIEW', label: 'Chờ duyệt' },
  { status: 'DONE', label: 'Hoàn thành' },
]

const statusOptions = [
  { value: 'TODO', label: 'Đánh dấu cần làm' },
  { value: 'IN_PROGRESS', label: 'Đánh dấu đang làm' },
  { value: 'IN_PREVIEW', label: 'Đánh dấu chờ duyệt' },
  { value: 'DONE', label: 'Đánh dấu hoàn thành' },
]

// Các cột đã được lọc theo nhãn được chọn
const filteredColumns = computed(() => {
  return columns.filter(column => selectedLabels.value.includes(column.status))
})

// Phân loại nhiệm vụ đã tạo và đã nhận
const tasks = computed(() => {
  return props.tasks
})

const authStore = useAuthStore();
const info = authStore.userInfo;


const receivedTasks = computed(() => {
  return props.tasks.filter(task =>
      task.assigneeId && (task.assigneeId === info.id)
  )
})

// Lấy nhiệm vụ đã nhận đã được lọc
const getFilteredReceivedTasks = () => {
  return receivedTasks.value.filter(task => selectedLabels.value.includes(task.status))
}

const columnTasks = (status, type) => {
  const taskList = type === 'created' ? tasks.value : receivedTasks.value
  return taskList.filter((task) => task.status === status)
}

// Tổng số task theo trạng thái
const getTotalTasksByStatus = (status) => {
  const created = tasks.value.filter(task => task.status === status).length
  const received = receivedTasks.value.filter(task => task.status === status).length
  return created + received
}


// Chọn/bỏ chọn tất cả nhãn
const toggleAllLabels = () => {
  if (selectedLabels.value.length === columns.length) {
    selectedLabels.value = []
  } else {
    selectedLabels.value = columns.map(column => column.status)
  }

  // 🔥 Emit ra ngoài khi chọn/bỏ tất cả
  emit("filter-change", {
    groupByLabel: groupByLabel.value,
    selectedLabels: selectedLabels.value
  })
}


const formatDue = (date) => {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(date))
}

const statusText = (status) => {
  switch (status) {
    case 'DONE':
      return 'Hoàn thành'
    case 'IN_PROGRESS':
      return 'Đang làm'
    case 'IN_PREVIEW':
      return 'Chờ duyệt'
    default:
      return 'Cần làm'
  }
}

const statusClass = (status) => {
  return {
    'badge-done': status === 'DONE',
    'badge-progress': status === 'IN_PROGRESS',
    'badge-pending': status === 'IN_PREVIEW',
    'badge-todo': status === 'TODO',
  }
}

const statusBadgeClass = (status) => {
  return {
    'badge-todo-bg': status === 'TODO',
    'badge-progress-bg': status === 'IN_PROGRESS',
    'badge-pending-bg': status === 'IN_PREVIEW',
    'badge-done-bg': status === 'DONE',
  }
}
const setAttachmentUrl = (id, value) => {
  attachmentUrls.value = { ...attachmentUrls.value, [id]: value || '' }
}

const loadAttachment = (file) => {
  if (file?.tempUrl) return file.tempUrl

  const id = resolveFileId(file)
  if (!id) return null

  const cached = attachmentUrls.value[id] || getCachedFileDataUrl(id)
  if (cached) {
    setAttachmentUrl(id, cached)
    return cached
  }

  if (attachmentPromises.has(id)) return attachmentPromises.get(id)

  const promise = loadPrivateFileDataUrl(id)
      .then((dataUrl) => {
        setAttachmentUrl(id, dataUrl || '')
        return dataUrl
      })
      .catch(() => null)
      .finally(() => attachmentPromises.delete(id))

  attachmentPromises.set(id, promise)
  return promise
}
const attachmentObserver = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        const file = attachmentElements.get(entry.target)
        if (file) {
          loadAttachment(file)
          attachmentObserver.unobserve(entry.target)
          attachmentElements.delete(entry.target)
        }
      })
    }, { rootMargin: '200px' })
    : null
const getAttachmentViewUrl = (file) => {
  if (file?.tempUrl) return file.tempUrl

  const id = resolveFileId(file)
  if (!id) return null

  const cached = attachmentUrls.value[id] || getCachedFileDataUrl(id)
  if (cached) {
    setAttachmentUrl(id, cached)
    return cached
  }

  return null
}

const observeAttachment = (file, el) => {
  const id = resolveFileId(file)
  if (!id) return

  if (!attachmentObserver) {
    loadAttachment(file)
    return
  }

  if (el) {
    attachmentElements.set(el, file)
    attachmentObserver.observe(el)
  } else {
    attachmentElements.delete(el)
  }
}
onBeforeUnmount(() => {
  attachmentObserver?.disconnect()
  attachmentElements.clear()
})

</script>

<style scoped>
.team-tasks {
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-gradient {
  background: linear-gradient(135deg, #0030FF, #031358);
  border: none;
  color: #fff;
  font-weight: 600;
}

.task-column {
  border-radius: 12px;
  padding: 1.25rem;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(3, 19, 88, 0.08);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(3, 19, 88, 0.1);
}

.status-section {
  margin-bottom: 1.5rem;
}

.status-section:last-child {
  margin-bottom: 0;
}

.task-card {
  border: 1px solid rgba(3, 19, 88, 0.08);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(3, 19, 88, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.task-card:last-child {
  margin-bottom: 0;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.1);
  border-color: rgba(0, 48, 255, 0.2);
}

.avatars {
  display: flex;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  margin-left: -8px;
}

.avatar:first-child {
  margin-left: 0;
}

.bg-soft-dark {
  background-color: rgba(3, 19, 88, 0.08);
  color: #031358;
}

.empty {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  padding: 1rem;
  background: rgba(3, 19, 88, 0.03);
  border-radius: 8px;
  display: none;
}

/* Toggle switch styles */
.toggle-container {
  background: rgba(3, 19, 88, 0.03);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(3, 19, 88, 0.1);
}

.form-check-input:checked {
  background-color: #0030FF;
  border-color: #0030FF;
}

.form-check-input:focus {
  border-color: #0030FF;
  box-shadow: 0 0 0 0.25rem rgba(0, 48, 255, 0.25);
}

.toggle-label {
  font-weight: 500;
  color: #031358 !important;
}

/* Label filter dropdown styles */
.label-filter-container {
  margin-right: 1rem;
}

.label-options .form-check-label {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

/* Badge styles for task status */
.badge-todo {
  background: rgba(0, 48, 255, 0.1);
  color: #0030FF;
}

.badge-progress {
  background: rgba(255, 153, 0, 0.1);
  color: #FF9900;
}

.badge-pending {
  background: rgba(255, 102, 0, 0.1);
  color: #FF6600;
}

.badge-done {
  background: rgba(0, 200, 83, 0.1);
  color: #00C853;
}

/* Badge styles for status counts */
.badge-todo-bg {
  background: rgba(0, 48, 255, 0.1);
  color: #0030FF;
}

.badge-progress-bg {
  background: rgba(255, 153, 0, 0.1);
  color: #FF9900;
}

.badge-pending-bg {
  background: rgba(255, 102, 0, 0.1);
  color: #FF6600;
}

.badge-done-bg {
  background: rgba(0, 200, 83, 0.1);
  color: #00C853;
}

.attachment-preview {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.attachment-chip {
  width: 64px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(3, 19, 88, 0.1);
  background: rgba(3, 19, 88, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
}

.attachment-chip img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-chip {
  font-size: 0.75rem;
  color: #031358;
  padding: 0.2rem;
  text-align: center;
}

.extra {
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .task-column {
    margin-bottom: 1.5rem;
  }

  .toggle-container {
    margin-bottom: 1rem;
    width: 100%;
    justify-content: space-between;
  }

  .label-filter-container {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 100%;
  }

  .label-filter-container .dropdown {
    width: 100%;
  }

  .label-filter-container .dropdown-toggle {
    width: 100%;
    justify-content: space-between;
  }
}

/* =====================================
   ⭐ MỖI CỘT CHỈ 1 THANH SCROLL DUY NHẤT
   ===================================== */

.task-column {
  display: flex;
  flex-direction: column;
  height: 60vh;         /* Chiều cao cố định */
  overflow-y: auto;     /* Chỉ scroll ở đây */
  padding-right: 6px;
}

/* Không cho task-card hoặc status-section tự scroll */
.status-section,
.task-card {
  overflow: visible !important;
  max-height: unset !important;
}

/* Scrollbar đẹp */
.task-column::-webkit-scrollbar {
  width: 6px;
}

.task-column::-webkit-scrollbar-thumb {
  background: rgba(3, 19, 88, 0.3);
  border-radius: 6px;
}

.task-column::-webkit-scrollbar-thumb:hover {
  background: rgba(3, 19, 88, 0.45);
}

/* Header giữ cố định */
.column-header {
  flex-shrink: 0;
  position: sticky;
  top: -25px;
  background: #fff;
  z-index: 5;
  padding-top: 10px;
  padding-bottom: 12px;
}


</style>
