<template>
  <transition name="fade">
    <div v-if="visible" class="team-create-overlay" @click.self="$emit('close')">
      <div class="team-create">
        <!-- Nút đóng tinh tế -->
        <button class="close-btn" @click="$emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- Container chứa nội dung -->
        <div class="team-create-content">
          <header class="team-create__header">
            <div class="header-content">
              <h4 class="team-create-title">Tạo nhóm mới</h4>
              <small class="text-muted">Xây dựng không gian làm việc chuyên nghiệp</small>
            </div>
          </header>

          <div class="team-create__body">
            <form @submit.prevent="handleSubmit">
              <!-- Phần ảnh đại diện và tên nhóm -->
              <section class="form-section avatar-name-section">
                <div class="avatar-name-container">
                  <div class="avatar-section">
                    <div
                        class="avatar-preview"
                        :class="{ 'has-image': avatarPreview }"
                        :style="{ backgroundImage: `url(${avatarPreview})` }"
                        @click="$refs.avatarInput.click()"
                    >
                      <div v-if="!avatarPreview" class="avatar-placeholder">
                        <i class="fa-solid fa-camera"></i>
                        <span class="avatar-text">Thêm ảnh</span>
                      </div>
                      <div class="avatar-overlay">
                        <i class="fa-solid fa-camera"></i>
                        <span>Ảnh nhóm</span>
                      </div>
                    </div>
                    <small class="avatar-hint">Nhấp để chọn hoặc thay ảnh</small>
                  </div>

                  <div class="name-input-container">
                    <div class="form-group">
                      <label class="form-label">
                        Tên nhóm
                        <span class="required">*</span>
                      </label>
                      <input
                          v-model="form.teamName"
                          type="text"
                          class="form-control"
                          placeholder="Nhập tên nhóm..."
                          required
                      />
                      <small class="helper-text">Tên nhóm nên ngắn gọn và dễ nhận biết</small>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Mô tả nhóm -->
              <section class="form-section">
                <div class="form-group">
                  <label class="form-label">Mô tả nhóm</label>
                  <DescriptionEditor v-model="form.teamDesc" />
                  <small class="helper-text">{{ form.teamDesc.length }}/200 ký tự</small>
                </div>
              </section>

              <!-- Nút hành động -->
              <section class="action-section">
                <div class="action-buttons">
                  <button
                      class="btn btn-outline"
                      type="button"
                      @click="$emit('close')"
                  >
                    Hủy bỏ
                  </button>
                  <button
                      class="btn btn-primary"
                      type="submit"
                      :disabled="!canSubmit"
                  >
                    <i class="fa-solid fa-circle-check me-1"></i>
                    Tạo nhóm
                  </button>
                </div>
              </section>
            </form>
          </div>
        </div>
      </div>

      <!-- Input file ẩn -->
      <input
          id="avatar-upload"
          ref="avatarInput"
          type="file"
          accept="image/*"
          class="d-none"
          @change="handleAvatarUpload"
      />
    </div>
  </transition>
</template>

<script setup>
import { reactive, ref } from 'vue'
import DescriptionEditor from "../common/DescriptionEditor.vue"

import { computed } from "vue";

const canSubmit = computed(() =>
    form.teamName.trim().length > 0 &&
    form.teamDesc.trim().length > 0 &&
    form.avatarFile !== null
);

const props = defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  teamName: '',
  teamDesc: '',
  avatarFile: null,
})

const avatarPreview = ref('')

const handleSubmit = () => {
  emit('submit', { ...form })
  resetForm()
}

const resetForm = () => {
  form.teamName = ''
  form.teamDesc = ''
  form.avatarFile = null
  avatarPreview.value = ''
}

const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Kiểm tra kích thước file (tối đa 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Kích thước ảnh không được vượt quá 5MB')
    return
  }

  // Kiểm tra định dạng file
  if (!file.type.match('image.*')) {
    alert('Vui lòng chọn file ảnh (JPG, PNG)')
    return
  }

  form.avatarFile = file

  // Tạo preview
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

import { watch } from "vue";

watch(
    () => props.visible,
    (val) => {
      if (!val) {
        resetForm();   // ⭐ Khi modal tắt → reset
      }
    }
);

</script>

<style scoped>
.team-create-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.42); /* đen mờ nhẹ */
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.team-create {
  position: relative;
  width: min(680px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(3, 19, 88, 0.15);
}

.team-create-content {
  padding: 2rem;
  color: #031358;
}

/* Nút đóng tinh tế */
.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(3, 19, 88, 0.05);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #031358;
  z-index: 10;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.close-btn:hover {
  background: rgba(3, 19, 88, 0.1);
  transform: scale(1.05);
}

/* Header */
.team-create__header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(3, 19, 88, 0.08);
}

.team-create-title {
  margin: 0 0 0.5rem 0;
  color: #031358;
  font-weight: 700;
  font-size: 1.5rem; /* Giảm kích thước chữ */
}

/* Sections */
.form-section {
  margin-bottom: 2rem;
}

.avatar-name-section {
  padding: 0;
  background: none;
  border: none;
}

/* Avatar và tên nhóm nằm ngang */
.avatar-name-container {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem;
  background: rgba(3, 19, 88, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(3, 19, 88, 0.08);
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 16px;
  border: 2px dashed rgba(3, 19, 88, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(3, 19, 88, 0.03);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.avatar-preview:hover {
  border-color: #0030FF;
  transform: translateY(-2px);
}

.avatar-preview.has-image .avatar-overlay {
  opacity: 0;
}

.avatar-preview.has-image:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(3, 19, 88, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  gap: 0.5rem;
}

.avatar-overlay i {
  font-size: 1.2rem;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(3, 19, 88, 0.4);
  font-size: 0.8rem;
  gap: 0.5rem;
}

.avatar-placeholder i {
  font-size: 1.5rem;
}

.avatar-text {
  font-size: 0.75rem;
}

.avatar-hint {
  color: rgba(3, 19, 88, 0.5);
  font-size: 0.75rem;
  text-align: center;
  max-width: 100px;
}

.name-input-container {
  flex: 1;
  min-width: 0;
}

/* Form Grid */
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-label {
  color: #031358;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.required {
  color: #dc3545;
}

.form-control {
  border: 1.5px solid rgba(3, 19, 88, 0.1);
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fff;
  width: 100%;
}
/* Ô Tên nhóm nhỏ lại */
.name-input-container .form-control {
  padding: 0.55rem 0.9rem !important; /* giảm padding dọc */
  font-size: 0.9rem !important;       /* chữ nhỏ lại 1 chút */
  border-radius: 10px !important;     /* bo nhẹ hơn */
  min-height: 36px !important;        /* chiều cao tổng */
}

.form-control:focus {
  border-color: #0030FF;
  box-shadow: 0 0 0 3px rgba(0, 48, 255, 0.1);
  outline: none;
}

.helper-text {
  color: rgba(3, 19, 88, 0.5);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

/* Buttons */
.action-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(3, 19, 88, 0.08);
}

/* Giảm khoảng cách giữa các nút hành động */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem; /* trước đây 1rem → nay nhỏ lại */
}


.btn {
  padding: 0.6rem 1.4rem; /* Trước: 0.875rem 2rem → quá lớn */
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem; /* Nhỏ lại nhẹ */
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  min-height: 38px; /* Giảm từ 48px → 38px */
}


.btn-primary {
  background: linear-gradient(135deg, #0030FF, #001793);
  color: #fff;
  box-shadow: 0 2px 12px rgba(0, 48, 255, 0.2);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 48, 255, 0.3);
}

.btn-primary:disabled {
  background: rgba(3, 19, 88, 0.3);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-outline {
  background: transparent;
  color: #031358;
  border: 1.5px solid rgba(3, 19, 88, 0.2);
}

.btn-outline:hover {
  background: rgba(3, 19, 88, 0.05);
  border-color: #0030FF;
}

/* Text styles */
.text-muted {
  color: rgba(3, 19, 88, 0.5) !important;
  font-size: 0.95rem;
}

/* Transitions */
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
  .team-create {
    width: min(90vw, 500px);
  }

  .team-create-content {
    padding: 1.5rem;
  }

  .avatar-name-container {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .avatar-section {
    align-self: center;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .team-create-content {
    padding: 1.25rem;
  }

  .team-create-title {
    font-size: 1.25rem;
  }

  .avatar-name-container {
    padding: 1.25rem;
  }

  .avatar-preview {
    width: 80px;
    height: 80px;
  }

  .form-control {
    padding: 0.875rem;
  }
}

/* Ẩn input file */
.d-none {
  display: none !important;
}

.me-1 {
  margin-right: 0.5rem;
}

/* Giảm chiều cao tổng modal *

/* Giảm padding trong modal */
.team-create-content {
  padding: 1.25rem; /* Trước 2rem → giờ thấp hơn rất nhiều */
}

/* Giảm khoảng cách giữa các section */
.form-section {
  margin-bottom: 1.25rem; /* Trước 2rem → giảm 40% chiều cao */
}

/* Giảm padding khối avatar + tên nhóm */
.avatar-name-container {
  padding: 1.25rem; /* Trước 2rem */
  gap: 1.25rem; /* Bớt khoảng cách */
}

/* Thu nhỏ avatar */
.avatar-preview {
  width: 80px;  /* Trước 100px */
  height: 80px;
  border-radius: 12px;
}

/* Thu nhỏ header */
.team-create__header {
  margin-bottom: 1.25rem; /* Trước 2rem */
  padding-bottom: 1rem;   /* Trước 1.5rem */
}

/* Giảm khoảng cách action section */
.action-section {
  margin-top: 1.5rem; /* Trước 2rem */
  padding-top: 1rem;  /* Trước 2rem */
}

/* Nút nhỏ hơn */
.btn {
  padding: 0.55rem 1.4rem;
  font-size: 0.88rem;
  min-height: 36px; /* Trước 48px */
}
/* Loại bỏ hoàn toàn thanh cuộn trong modal */
.team-create {
  overflow-y: auto !important;
}

</style>