<template>
  <transition name="fade">
    <div v-if="visible" class="settings-backdrop" @click.self="close">
      <div class="settings-modal">
        <!-- Container chứa nội dung -->
        <div class="settings-modal-content">
          <header class="settings-modal__header">
            <div class="header-content">
              <p class="text-uppercase text-muted small mb-1">Quy chuẩn nhóm</p>
              <h4 class="settings-title">Cấu hình quyền & tham gia</h4>
              <small class="text-muted">Điều chỉnh lời mời và phạm vi chia sẻ</small>
            </div>
            <div class="header-actions">
              <button class="refresh-btn" @click="$emit('refresh')" title="Làm mới">
                <i class="fa-solid fa-rotate"></i>
              </button>
              <button class="close-btn" @click="close" title="Đóng">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </header>

          <div class="settings-modal__body">
            <section class="settings-section">
              <div class="setting-item" v-for="setting in settingItems" :key="setting.key">
                <div class="setting-info">
                  <p class="setting-title">{{ setting.title }}</p>
                  <small class="setting-description">{{ setting.description }}</small>
                </div>
                <div class="setting-control">
                  <select
                      v-if="setting.type === 'select'"
                      v-model="localSettings[setting.key]"
                      class="form-select"
                  >
                    <option v-for="option in setting.options" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                  <div v-else-if="setting.type === 'toggle'" class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="localSettings[setting.key]" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <footer class="settings-modal__footer">
            <small class="text-muted">Thay đổi áp dụng cho toàn bộ thành viên.</small>
            <button class="btn btn-primary" @click="handleSave">
              <i class="fa-solid fa-floppy-disk me-1"></i>Lưu cấu hình
            </button>
          </footer>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  settings: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update', 'refresh', 'close'])

const localSettings = reactive({
  inviteMode: 'LEAD_ONLY',
  memberVisibility: 'TEAM',
  archivePolicy: '30D',
})

watch(
    () => props.settings,
    (value) => {
      Object.assign(localSettings, value || {})
    },
    { immediate: true, deep: true },
)

const settingItems = [
  {
    key: 'inviteMode',
    title: 'Mời tham gia',
    description: 'Kiểm soát cách thức thành viên mới được thêm vào nhóm',
    type: 'select',
    options: [
      { value: 'OPEN', label: 'Bất kỳ ai có link' },
      { value: 'LEAD_ONLY', label: 'Chỉ trưởng nhóm gửi lời mời' },
      { value: 'ADMIN', label: 'Ban quản trị duyệt từng lời mời' },
    ],
  },
  {
    key: 'memberVisibility',
    title: 'Hiển thị danh sách thành viên',
    description: 'Giới hạn phạm vi xem thông tin nhân sự trong nhóm',
    type: 'select',
    options: [
      { value: 'PUBLIC', label: 'Toàn bộ tổ chức' },
      { value: 'TEAM', label: 'Chỉ thành viên nhóm' },
      { value: 'LEAD', label: 'Chỉ quản lý' },
    ],
  },
  {
    key: 'archivePolicy',
    title: 'Chu kỳ lưu trữ',
    description: 'Tự động lưu trữ cuộc trò chuyện & tài liệu cũ',
    type: 'select',
    options: [
      { value: '15D', label: '15 ngày' },
      { value: '30D', label: '30 ngày' },
      { value: '90D', label: '90 ngày' },
    ],
  },
]

const handleSave = () => {
  emit('update', { ...localSettings })
  emit('close')
}

const close = () => emit('close')
</script>

<style scoped>
.settings-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 19, 88, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  overflow: hidden;
}

.settings-modal {
  position: relative;
  width: min(720px, 94vw);
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 24px;
  padding: 2px;
  scrollbar-width: thin;
}

.settings-modal-content {
  background: #fff;
  border-radius: 22px;
  padding: 1.5rem;
  color: #031358;
  height: 100%;
}

.settings-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(3, 19, 88, 0.1);
  position: relative;
}

.header-content {
  flex: 1;
  padding-right: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #0030FF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0030FF;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.close-btn:hover {
  background: #0030FF;
  color: #fff;
  transform: scale(1.05);
}

.refresh-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #0030FF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0030FF;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  flex-shrink: 0;
}

.refresh-btn:hover {
  background: #0030FF;
  color: #fff;
  transform: scale(1.05);
}

.settings-title {
  margin: 0;
  color: #031358;
  font-weight: 700;
}

.settings-modal__body {
  margin: 1.5rem 0;
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(3, 19, 88, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(3, 19, 88, 0.1);
}

.setting-info {
  flex: 1;
}

.setting-title {
  color: #001793;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.setting-description {
  color: rgba(3, 19, 88, 0.7);
  line-height: 1.4;
}

.setting-control {
  min-width: 200px;
}

.form-select {
  border: 1px solid rgba(3, 19, 88, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  color: #031358;
  background: #fff;
}

.form-select:focus {
  border-color: #0030FF;
  box-shadow: 0 0 0 0.2rem rgba(0, 48, 255, 0.1);
  outline: none;
}

/* Form Switch Customization */
.form-check-input {
  width: 3rem;
  height: 1.5rem;
  background-color: rgba(3, 19, 88, 0.2);
  border: 1px solid rgba(3, 19, 88, 0.3);
}

.form-check-input:checked {
  background-color: #0030FF;
  border-color: #0030FF;
}

.form-check-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 48, 255, 0.25);
  border-color: #0030FF;
}

.settings-modal__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(3, 19, 88, 0.1);
  gap: 1rem;
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
  .setting-item {
    flex-direction: column;
    gap: 1rem;
  }

  .setting-control {
    width: 100%;
    min-width: auto;
  }

  .settings-modal__footer {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .settings-modal {
    margin: 1rem;
  }
}

@media (max-width: 576px) {
  .settings-modal-content {
    padding: 1rem;
  }

  .setting-item {
    padding: 1rem;
  }

  .settings-modal__header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-actions {
    align-self: flex-end;
  }

  .header-content {
    padding-right: 0;
  }
}
</style>