<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">

      <!-- HEADER -->
      <div class="modal-header">
        <h5 class="modal-title text-primary">
          <i class="fas fa-users text-primary"></i>
          Chọn nhóm & gửi thư ngỏ
        </h5>

        <button class="close-btn" @click="$emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- BODY -->
      <div class="modal-content">
        <div><label class="form-label fs-6">🤝 Nhóm người này được thêm vào( không bắt buộc):</label></div>

        <!-- GROUP LIST -->
        <div class="group-list">
          <div
              v-for="g in groups"
              :key="g.id"
              class="group-item"
              :title="`Nhóm ${g.name} • ${g.totalMembers} thành viên`"
              :class="{ active: selectedGroupId === g.id }"
              @click="selectGroup(g)"
          >
          <img :src="g.avatar" class="group-avatar"/>

            <div class="group-info">
              <div class="group-name">{{ g.name }}</div>
              <div class="group-meta">
                {{ g.totalMembers }} thành viên
              </div>
            </div>

            <i
                v-if="selectedGroupId === g.id"
                class="fas fa-check-circle text-success"
                title="Đang chọn nhóm này"
            />

          </div>

        </div>

        <!-- MESSAGE -->
        <label class="form-label mt-3 fs-6">
         💌 Thư chào mừng
        </label>

        <textarea
            v-model="message"
            class="form-control reject-textarea"
            rows="4"
            placeholder="Nhập nội dung thư chào mừng..."
            title="Thư ngỏ gửi cho người đề nghị (không bắt buộc)"
        />


      </div>

      <!-- FOOTER -->
      <div class="modal-footer">
        <button class="btn btn-cancel" @click="$emit('close')">
          <i class="fas fa-arrow-left"></i>
          Hủy
        </button>

        <button class="btn btn-primary" @click="confirm">
          <i class="fas fa-paper-plane"></i>
          Xác nhận
        </button>
      </div>

    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'confirm'])

const selectedGroupId = ref(null)
const message = ref('')

import { onMounted } from 'vue'
import api from "/src/api/api.js"

const groups = ref([])
const loadingGroups = ref(false)
const loadGroups = async () => {
  loadingGroups.value = true
  try {
    const res = await api.get('/admin/api/de-nghi-hop-tac/danh-sach-nhom')
    console.log('BE tã về: ', res )
    groups.value = (res.data || []).map(g => ({
      id: g.id,
      name: g.tenNhom,
      totalMembers: g.tongThanhVien,
      avatar: g.avatar
          ? `https://s3.cloudfly.vn/thg-storage/uploads-public/${g.avatar}`
          : 'https://s3.cloudfly.vn/thg-storage/uploads-public/vat-default.jpg'
    }))
  } catch (e) {
    console.error('Lỗi load nhóm', e)
    groups.value = []
  } finally {
    loadingGroups.value = false
  }
}
onMounted(() => {
  loadGroups()
})


const selectGroup = (g) => {
  // 👉 click lại chính nó → bỏ chọn
  if (selectedGroupId.value === g.id) {
    selectedGroupId.value = null
    return
  }

  selectedGroupId.value = g.id

  // auto fill thư ngỏ lần đầu
  if (!message.value) {
    message.value = g.welcomeMessage
  }
}


const confirm = () => {
  emit('confirm', {
    groupId: selectedGroupId.value,
    message: message.value
  })
}
</script>
<style scoped>
/* =========================
   OVERLAY – GIẢM MỜ + BỚT XANH
========================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;

  background: rgba(15, 23, 42, 0.45);  /* dịu – không xanh gắt */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  display: flex;
  align-items: center;
  justify-content: center;
}

/* =========================
   MODAL CONTAINER
========================= */
.modal-container {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: slideUp .25s ease;
}

/* =========================
   HEADER
========================= */
.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: #64748b;
}

.close-btn:hover {
  color: #0f172a;
}

/* =========================
   BODY
========================= */
.modal-content {
  padding: 20px;
}

.form-label {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 6px;
  display: block;
}

.reject-textarea {
  border-radius: 12px;
  resize: none;
  font-size: 14px;
}

.reject-textarea:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

/* =========================
   FOOTER
========================= */
.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;

  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* =========================
   BUTTONS
========================= */
.modal-footer .btn {
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  transition: all .2s ease;
  cursor: pointer;
}

/* HỦY */
.btn-cancel {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

/* TỪ CHỐI */
.btn-reject {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #ffffff;
  border: none;
  box-shadow: 0 10px 24px rgba(239, 68, 68, 0.25);
}

.btn-reject:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.btn-reject:active:not(:disabled) {
  transform: scale(0.96);
}

.btn-reject:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* =========================
   ANIMATION
========================= */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.group-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all .2s ease;
}

.group-item:hover {
  background: #f8fafc;
}

.group-item.active {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
}

.group-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.group-info {
  flex: 1;
}

.group-name {
  font-weight: 700;
  font-size: 14px;
}

.group-meta {
  font-size: 12px;
  color: #64748b;
}

.group-skip {
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
}

.group-skip:hover {
  color: #ef4444;
}

</style>