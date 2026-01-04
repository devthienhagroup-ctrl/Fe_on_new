<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="delete-modal" @click.stop>
      <!-- Animated Icon -->
      <div class="modal-icon">
        <div class="icon-circle">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="icon-pulse"></div>
      </div>

      <!-- Modal Content -->
      <div class="modal-content">
        <h2 class="modal-title">Xác nhận xóa</h2>

        <div class="warning-text">
          <i class="fas fa-exclamation-circle"></i>
          <span>Hành động này không thể hoàn tác</span>
        </div>

        <p class="modal-message">
          Bạn có chắc chắn muốn xóa chi nhánh <br>
          <span class="branch-name">{{ branch?.name }}</span>
          ?
        </p>

        <div class="warning-details">
          <div class="warning-item">
            <i class="fas fa-boxes"></i>
            <span>Tất cả {{ branch?.packagesCount || 0 }} gói đầu tư trong chi nhánh sẽ bị xóa</span>
          </div>
          <div class="warning-item">
            <i class="fas fa-history"></i>
            <span>Không thể khôi phục dữ liệu sau khi xóa</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="handleCancel" :disabled="deleting">
            <i class="fas fa-times"></i>
            <span>Hủy (Không xóa)</span>
          </button>
          <button class="btn btn-delete" @click="handleConfirm" :disabled="deleting">
            <i class="fas" :class="deleting ? 'fa-spinner fa-spin' : 'fa-trash-alt'"></i>
            <span>{{ deleting ? 'Đang xóa...' : 'Xác nhận xóa' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  branch: Object,
  deleting: Boolean
})

const emit = defineEmits(['cancel', 'confirm'])

const handleOverlayClick = (e) => {
  if (e.target.classList.contains('modal-overlay') && !props.deleting) {
    emit('cancel')
  }
}

const handleCancel = () => {
  if (!props.deleting) {
    emit('cancel')
  }
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
  padding: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.delete-modal {
  background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 25px 50px rgba(239, 68, 68, 0.2);
  border: 2px solid #fecaca;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Modal Icon */
.modal-icon {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 40px 0 20px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
  animation: pulseIcon 2s infinite;
}

@keyframes pulseIcon {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.icon-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%);
  border-radius: 50%;
  animation: pulseRing 2s infinite;
}

@keyframes pulseRing {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

/* Modal Content */
.modal-content {
  padding: 0 40px 40px;
  text-align: center;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
}

.warning-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fee2e2;
  border-radius: 12px;
  margin-bottom: 24px;
}

.warning-text i {
  color: #ef4444;
  font-size: 16px;
}

.warning-text span {
  font-size: 14px;
  font-weight: 600;
  color: #991b1b;
}

.modal-message {
  font-size: 16px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 24px;
}

.branch-name {
  font-weight: 700;
  color: #ef4444;
  background: #fee2e2;
  padding: 2px 8px;
  border-radius: 6px;
  margin: 0 4px;
}

.warning-details {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  border: 2px solid #fecaca;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-align: left;
  margin-bottom: 12px;
}

.warning-item:last-child {
  margin-bottom: 0;
}

.warning-item i {
  color: #ef4444;
  font-size: 18px;
  margin-top: 2px;
}

.warning-item span {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

/* Action Buttons */
.modal-actions {
  display: flex;
  gap: 16px;
}

.btn {
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: none;
  min-height: 52px;
}

.btn-cancel {
  background: #e2e8f0;
  color: #475569;
}

.btn-cancel:hover:not(:disabled) {
  background: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(148, 163, 184, 0.2);
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-delete:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive */
@media (max-width: 640px) {
  .delete-modal {
    max-width: 100%;
    margin: 10px;
  }

  .modal-content {
    padding: 0 24px 32px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-title {
    font-size: 24px;
  }

  .icon-circle {
    width: 70px;
    height: 70px;
    font-size: 30px;
  }

  .icon-pulse {
    width: 100px;
    height: 100px;
  }
}
</style>