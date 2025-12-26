<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">

      <!-- HEADER -->
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fas fa-ban text-danger"></i>
          Từ chối đề nghị
        </h5>

        <button class="close-btn" @click="$emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- BODY -->
      <div class="modal-content">
        <label class="form-label">
          Lý do từ chối
        </label>

        <textarea
            v-model="reason"
            class="form-control reject-textarea"
            rows="4"
            placeholder="Ví dụ: Không phù hợp thời điểm hiện tại..."
        />
      </div>

      <!-- FOOTER -->
      <div class="modal-footer">
        <button class="btn btn-cancel" @click="$emit('close')">
          <i class="fas fa-arrow-left"></i>
          Hủy
        </button>

        <button
            class="btn btn-reject"
            :disabled="!reason.trim()"
            @click="confirm"
        >
          <i class="fas fa-times-circle"></i>
          Xác nhận
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'confirm'])
const reason = ref('')

const confirm = () => {
  if (!reason.value.trim()) return
  emit('confirm', reason.value)
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
</style>
