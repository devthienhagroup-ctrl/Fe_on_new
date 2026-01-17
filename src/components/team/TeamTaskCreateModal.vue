<template>
  <transition name="fade">
    <div v-if="visible" class="task-modal-backdrop" @click.self="close">
      <div class="task-modal">

        <!-- NÚT ĐÓNG -->
        <button class="close-btn" @click="close">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- CONTENT -->
        <div class="task-modal-content">
          <header class="task-modal__header">
            <div>
              <p class="text-uppercase text-muted small mb-1">Nhiệm vụ mới</p>
              <h4 class="task-title">Tạo công việc</h4>
              <small class="text-muted">Nhập thông tin cơ bản trước khi giao việc</small>
            </div>
          </header>

          <div class="task-modal__body">
            <form @submit.prevent="submit">

              <!-- TIÊU ĐỀ + MÔ TẢ -->
              <section class="mb-4">
                <div class="mb-3">
                  <label class="section-label">Tiêu đề</label>
                  <input v-model="form.title" type="text" class="form-control"
                         placeholder="VD: Chuẩn bị triển khai dự án" required />
                </div>

                <div class="mb-3">
                  <label class="section-label">Mô tả</label>
                  <DescriptionEditor v-model="form.description" />
                </div>
              </section>

              <!-- DUE DATE + DEADLINE + MEMBERS -->
              <section class="meta-grid mb-4">
                <div>
                  <label class="section-label">Hạn xử lý</label>
                  <input v-model="form.dueAt" type="datetime-local" class="form-control" required />
                </div>

                <div>
                  <label class="section-label">Hạn chót ứng tuyển</label>
                  <input v-model="form.applicationDeadline" type="datetime-local" class="form-control" />
                </div>

                <!-- MEMBERS -->
                <!-- MEMBERS -->
                <div class="member-select-container">
                  <label class="section-label">Người thực hiện</label>

                  <div class="multi-select" @click="openDropdown">
                    <div class="selected-box">

      <span v-if="selectedMember" class="tag">
        <img :src="fileUrl(selectedMember.avatar)" class="tag-avatar" />
        {{ selectedMember.fullName }}
        <i class="fa-solid fa-xmark remove-tag" @click.stop="clearAssignee"></i>
      </span>

                      <span v-else class="placeholder">Chọn 1 người...</span>
                    </div>

                    <button class="expand-btn" type="button" @click.stop="toggleDropdown">
                      <i class="fa-solid fa-chevron-down" :class="{ rotated: dropdownOpen }"></i>
                    </button>
                  </div>

                  <!-- DROPDOWN -->
                  <div class="dropdown" v-if="dropdownOpen" ref="dropdownRef">
                    <input
                        type="text"
                        class="search-box"
                        v-model="search"
                        placeholder="Tìm thành viên..."
                    />

                    <div class="dropdown-item"
                         v-for="member in filteredMembers"
                         :key="member.idE"
                         @click="selectMember(member.idE)">
                      <img :src="fileUrl(member.avatar)" class="avatar" />
                      <span>{{ member.fullName }}</span>
                      <i class="fa-solid fa-check check-icon"
                         v-if="Number(form.assigneeId) === Number(member.idE)"></i>
                    </div>
                  </div>
                </div>

              </section>

              <!-- FILE INPUT -->
              <section class="mb-3">
                <label class="section-label">Tệp đính kèm</label>

                <input type="file" ref="fileInput" multiple class="d-none"
                       @change="handleFileSelect" />

                <div class="file-drop"
                     @click="$refs.fileInput.click()"
                     @dragover.prevent="onDragOver"
                     @dragleave.prevent="onDragLeave"
                     @drop.prevent="onDrop">

                  <i class="fa-solid fa-upload"></i>
                  <p>Kéo thả file hoặc chọn file</p>
                </div>

                <div class="file-list">
                  <div v-for="(file, i) in form.attachments" :key="i" class="file-item">
                    <i class="fa-solid fa-file"></i>
                    <span class="file-name">{{ file.name }}</span>
                    <i class="fa-solid fa-xmark remove-file" @click="removeAttachment(i)"></i>
                  </div>
                </div>

              </section>

              <section class="d-flex justify-content-end gap-2 mt-4">
                <button type="button" class="btn btn-outline-secondary" @click="close">Hủy</button>
                <button type="submit" class="btn btn-primary" :disabled="!canSubmit">Tạo nhiệm vụ</button>
              </section>

            </form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { reactive, ref, computed } from "vue"
import DescriptionEditor from "../common/DescriptionEditor.vue"

const props = defineProps({
  visible: Boolean,
  members: Array
})

const emit = defineEmits(["close", "submit"])

// ⭐ GIỮ 1 ID DUY NHẤT
const form = reactive({
  title: "",
  description: "",
  dueAt: "",
  applicationDeadline: "",
  assigneeId: null,
  attachments: []
})

const dropdownOpen = ref(false)
const search = ref("")
const dropdownRef = ref(null)
const fileInput = ref(null)

const fileUrl = (path) =>
    path ? `https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${path}` : ""


const filteredMembers = computed(() =>
    props.members.filter((m) =>
        m.fullName.toLowerCase().includes(search.value.toLowerCase())
    )
)

// ⭐ Single Select
const selectMember = (id) => {
  form.assigneeId = Number(id)
  dropdownOpen.value = false
}


const selectedMember = computed(() =>
    props.members.find(m => Number(m.idE) === Number(form.assigneeId)) || null
)


const clearAssignee = () => {
  form.assigneeId = null
}

// ⭐ File select
const handleFileSelect = (e) => {
  const files = [...e.target.files]
  files.forEach((f) => {
    if (!form.attachments.some((x) => x.name === f.name && x.size === f.size)) {
      form.attachments.push(f)
    }
  })
}

const removeAttachment = (i) => form.attachments.splice(i, 1)

// ⭐ Required fields
const canSubmit = computed(() => {
  if (
      !form.title?.trim() ||
      !form.description?.trim() ||
      !form.dueAt ||
      !form.applicationDeadline
  ) {
    return false;
  }

  const due = new Date(form.dueAt);                 // datetime
  const apply = new Date(form.applicationDeadline); // datetime

  // ⭐ dueAt phải LỚN HƠN applicationDeadline
  if (due.getTime() <= apply.getTime()) {
    return false;
  }

  return true;
});



const submit = () => {
  emit("submit", {
    ...form,
    assigneeId: form.assigneeId,
    attachments: [...form.attachments]
  })
}

const close = () => emit("close")

// ⭐ Dropdown actions
const openDropdown = () => {
  dropdownOpen.value = true
  search.value = ""
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

// ⭐ Drag/drop file
const isDragOver = ref(false)
const onDragOver = () => (isDragOver.value = true)
const onDragLeave = () => (isDragOver.value = false)

const onDrop = (e) => {
  isDragOver.value = false
  const dropped = [...e.dataTransfer.files]
  dropped.forEach((f) => {
    if (!form.attachments.some((x) => x.name === f.name && x.size === f.size))
      form.attachments.push(f)
  })
}

</script>

<style scoped>
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
  width: min(720px, 94vw);
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
  display: block;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(3, 19, 88, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(3, 19, 88, 0.1);
}

.form-control,
.form-select {
  border: 1px solid rgba(3, 19, 88, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  color: #031358;
  background: #fff;
}

.form-control:focus,
.form-select:focus {
  border-color: #0030FF;
  box-shadow: 0 0 0 0.2rem rgba(0, 48, 255, 0.1);
  outline: none;
}

/* Member selection styles */
.member-select-container {
  position: relative;
  grid-column: 1 / -1; /* Chiếm toàn bộ chiều ngang */
}

.member-select-wrapper {
  position: relative;
  height: auto;
  min-height: 60px;
  scrollbar-width: thin;
  overflow-y: visible;
  border-radius: 8px;
  border: 1px solid rgba(3, 19, 88, 0.2);
  background: #fff;
  transition: all 0.3s ease;
}

.member-select-wrapper.drag-over {
  border-color: #0030FF;
  background: rgba(0, 48, 255, 0.05);
}

.multi-select {
  position: relative;
  border: none;
  padding: 0;
  background: #fff;
  cursor: pointer;
}

.selected-tags-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 12px;
  min-height: 44px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}

.tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #031358; /* Màu xanh đậm */
  color: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  cursor: grab;
  user-select: none;
}

.tag:hover {
  background: rgba(0, 23, 147, 0.87);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.tag:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.tag-remove-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  font-size: 0.7rem;
}

.tag-remove-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.expand-btn {
  background: none;
  border: none;
  color: #031358;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.3s ease;
  margin-left: 8px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.expand-btn:hover {
  background: rgba(3, 19, 88, 0.1);
}

.expand-btn.expanded {
  transform: rotate(180deg);
}

.placeholder {
  color: rgba(3, 19, 88, 0.5);
  align-self: center;
  background-color: white;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  max-height: 260px;
  overflow-y: auto;
  border: 1px solid rgba(3, 19, 88, 0.2);
  border-radius: 8px;
  background: white;
  z-index: 99;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: rgba(3, 19, 88, 0.3) transparent;
}

.dropdown::-webkit-scrollbar {
  width: 6px;
}

.dropdown::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.dropdown::-webkit-scrollbar-thumb {
  background: rgba(3, 19, 88, 0.3);
  border-radius: 3px;
}

.dropdown::-webkit-scrollbar-thumb:hover {
  background: rgba(3, 19, 88, 0.5);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(0, 48, 255, 0.05);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar.placeholder {
  background: linear-gradient(135deg, #0030FF, #031358);
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  margin-left: auto;
  color: #0030FF;
}

/* File Input Area */
.file-input-area {
  border: 2px dashed rgba(3, 19, 88, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(3, 19, 88, 0.02);
}

.file-input-area:hover {
  border-color: #0030FF;
  background: rgba(0, 48, 255, 0.05);
}

.file-input-content {
  color: rgba(3, 19, 88, 0.7);
}

.file-input-content i {
  font-size: 2rem;
  color: #0030FF;
  margin-bottom: 0.5rem;
}

.text-primary {
  color: #0030FF !important;
  font-weight: 600;
}

/* Attachment List */
.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attachment-item {
  width: 100%;
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
  width: 20px;
  text-align: center;
}

.file-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 500;
  color: #031358;
}

.file-size {
  color: rgba(3, 19, 88, 0.6);
  font-size: 0.8rem;
}

.file-actions {
  display: flex;
  align-items: center;
}

.btn-primary {
  background: linear-gradient(135deg, #031358, #0030FF);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 48, 255, 0.3);
}

.btn-primary:disabled {
  background: rgba(3, 19, 88, 0.3);
  cursor: not-allowed;
}

.btn-outline-secondary {
  border: 1px solid rgba(3, 19, 88, 0.3);
  color: #031358;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-outline-secondary:hover {
  background: rgba(3, 19, 88, 0.05);
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

.drag-over {
  border-color: #0030FF;
  background: rgba(0, 48, 255, 0.08);
  transform: scale(1.01);
}

/* Image Preview Modal */
.image-preview-modal {
  position: fixed;
  z-index: 1060;
  width: 200px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 1px solid rgba(3, 19, 88, 0.1);
  animation: fadeIn 0.2s ease;
}

.image-preview-content {
  display: flex;
  flex-direction: column;
}

.image-preview-content img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.image-preview-name {
  padding: 0.5rem;
  font-size: 0.8rem;
  color: #031358;
  text-align: center;
  background: rgba(3, 19, 88, 0.02);
  border-top: 1px solid rgba(3, 19, 88, 0.1);
}

/* Drop Zone Indicator */
.drop-zone-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 120px;
  background: rgba(220, 53, 69, 0.9);
  border: 3px dashed #dc3545;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1070;
  animation: pulse 1.5s infinite;
}

.drop-zone-content {
  text-align: center;
  color: white;
}

.drop-zone-content i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.drop-zone-content p {
  margin: 0;
  font-weight: 600;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.9;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.9;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .meta-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .task-modal {
    margin: 1rem;
  }

  .file-chip {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .file-actions {
    align-self: flex-end;
  }

  .member-select-wrapper {
    height: auto;
  }

  .image-preview-modal {
    display: none; /* Ẩn preview trên mobile */
  }

  .selected-tags-container {
    flex-direction: column;
    gap: 8px;
  }

  .expand-btn {
    align-self: flex-end;
  }

  .drop-zone-indicator {
    width: 160px;
    height: 100px;
  }

  .drop-zone-content i {
    font-size: 1.5rem;
  }

  .drop-zone-content p {
    font-size: 0.9rem;
  }
}


.task-modal {
  position: relative;
  width: min(760px, 94vw);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 22px;
}

.task-modal-content {
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
}

/* Member Select */
.multi-select {
  border: 1px solid #d4d6dd;
  border-radius: 10px;
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.selected-box {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #acbaee;
  padding: 4px 8px;
  border-radius: 8px;
  color: rgba(0, 0, 0, 0.94);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.tag-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.remove-tag {
  cursor: pointer;
  color: #333;
}

.dropdown {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 6px;
  background: white;
  max-height: 240px;
  overflow-y: auto;
  padding: 6px;
}

.search-box {
  width: 100%;
  margin-bottom: 6px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 5px 8px;
}

.dropdown-item {
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f0f3ff;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.check-icon {
  margin-left: auto;
  color: #0030ff;
}

/* File input small */
.file-drop {
  border: 1px dashed #0030ff;
  padding: 18px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
}

.file-list {
  margin-top: 10px;
}

.file-item {
  background: #f4f6ff;
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.remove-file {
  margin-left: auto;
  cursor: pointer;
  color: #d00;
}
.expand-btn i.rotated {
  transform: rotate(180deg);
}
.file-drop.drag {
  border-color: #0030FF;
  background: rgba(0,48,255,0.06);
}

</style>