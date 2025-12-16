<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">

      <!-- Header -->
      <div class="modal-header">
        <div class="host-profile">
          <div class="avatar-wrapper">
            <img
                :src="avatarUrl"
                :alt="host.fullName"
                class="avatar"
                @error="handleImageError"
            />
            <div class="status-indicator" :class="host.status ? 'active' : 'inactive'"></div>
          </div>
          <div class="host-info">
            <h2 class="host-name">{{ host.fullName }}</h2>
            <div class="host-meta">
              <span class="email">
                <i class="icon icon-email"></i>
                {{ host.email }}
              </span>
              <span class="divider">•</span>
              <span class="phone" v-if="host.phone">
                <i class="icon icon-phone"></i>
                {{ formatPhone(host.phone) }}
              </span>
            </div>
          </div>
        </div>

        <button class="close-btn" @click="$emit('close')">
          <i class="icon icon-close"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Personal Information Section -->
        <section class="info-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="icon icon-user"></i>
              Thông tin cá nhân
            </h3>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <label class="info-label">Họ và tên</label>
              <div class="info-value">{{ host.fullName }}</div>
            </div>

            <div class="info-item">
              <label class="info-label">Giới tính</label>
              <div class="info-value">
                <span class="gender-badge" :class="host.gender ? 'male' : 'female'">
                  {{ host.gender ? 'Nam' : 'Nữ' }}
                </span>
              </div>
            </div>

            <div class="info-item">
              <label class="info-label">Email</label>
              <div class="info-value">
                <a :href="`mailto:${host.email}`" class="email-link">
                  {{ host.email }}
                </a>
              </div>
            </div>

            <div class="info-item">
              <label class="info-label">Điện thoại</label>
              <div class="info-value">
                <a v-if="host.phone" :href="`tel:${host.phone}`" class="phone-link">
                  {{ formatPhone(host.phone) }}
                </a>
                <span v-else class="empty-state">—</span>
              </div>
            </div>

            <div class="info-item full-width">
              <label class="info-label">Địa chỉ hiện tại</label>
              <div class="info-value with-icon">
                <i class="icon icon-location"></i>
                {{ formatAddress(host.address) }}
              </div>
            </div>

            <div class="info-item full-width">
              <label class="info-label">Địa chỉ trước đó</label>
              <div class="info-value with-icon muted">
                <i class="icon icon-history"></i>
                {{ formatAddress(host.oldAddress) || 'Không có dữ liệu' }}
              </div>
            </div>

            <div class="info-item">
              <label class="info-label">Trạng thái tài khoản</label>
              <div class="info-value">
                <div class="status-badge" :class="host.status ? 'active' : 'inactive'">
                  <span class="status-dot"></span>
                  {{ host.status ? 'Đang hoạt động' : 'Đã khoá' }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Assets Section -->
        <section class="assets-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="icon icon-properties"></i>
              Tài sản đang quản lý
              <span class="asset-count">{{ host.assets?.length || 0 }}</span>
            </h3>
          </div>

          <div v-if="!host.assets || host.assets.length === 0" class="empty-assets">
            <i class="icon icon-empty"></i>
            <p>Chưa có tài sản nào</p>
          </div>

          <div v-else class="assets-grid">
            <div
                v-for="(asset, index) in host.assets"
                :key="asset.id"
                class="asset-card"
                :class="{ 'highlight': index % 2 === 0 }"
            >
              <div class="asset-header">
                <h4 class="asset-title">
                  <i class="icon icon-home"></i>
                  {{ formatAddress(asset.address) }}
                </h4>
                <div class="asset-actions">
                  <button class="action-btn" title="Xem chi tiết">
                    <i class="icon icon-view"></i>
                  </button>
                </div>
              </div>

              <div class="asset-details">
                <div class="detail-row">
                  <div class="detail-item">
                    <label>Giá mong muốn</label>
                    <div class="price expected">
                      {{ formatMoney(asset.giaMongMuon) }}
                    </div>
                  </div>

                  <div class="detail-item">
                    <label>Giá bán hiện tại</label>
                    <div class="price current">
                      {{ formatMoney(asset.giaBan) }}
                    </div>
                  </div>
                </div>

                <div class="detail-row stats">
                  <div class="stat-item">
                    <div class="stat-icon">
                      <i class="icon icon-request"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ asset.soLanYeuCauDinhGia || 0 }}</div>
                      <div class="stat-label">Yêu cầu định giá</div>
                    </div>
                  </div>

                  <div class="stat-item">
                    <div class="stat-icon">
                      <i class="icon icon-valuation"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ asset.soLanDinhGia || 0 }}</div>
                      <div class="stat-label">Đã định giá</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <div class="footer-actions">
          <button class="btn btn-secondary" @click="$emit('close')">
            <i class="icon icon-close"></i>
            Đóng
          </button>
          <button class="btn btn-primary" @click="handleContact">
            <i class="icon icon-contact"></i>
            Liên hệ
          </button>
          <button
              v-if="!host.status"
              class="btn btn-success"
              @click="handleActivate"
          >
            <i class="icon icon-activate"></i>
            Kích hoạt
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  host: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'contact', 'activate'])

const BASE_URL = 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'

const avatarUrl = computed(() => {
  return props.host?.avatar
      ? BASE_URL + props.host.avatar
      : BASE_URL + 'vat-default.jpg'
})

// Format functions
const formatAddress = (raw) => {
  if (!raw) return '—'
  return raw
      .replace(/^\d+\/!!/, '')
      .replace(/\/!!/g, ', ')
      .split(', ')
      .filter(Boolean)
      .join(', ')
}

const formatMoney = (value) => {
  if (!value || isNaN(value)) return '—'
  const number = Number(value)
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + ' tỷ'
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + ' triệu'
  }
  return number.toLocaleString('vi-VN') + ' ₫'
}

const formatPhone = (phone) => {
  if (!phone) return '—'
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
}

const handleImageError = (e) => {
  e.target.src = BASE_URL + 'vat-default.jpg'
}

const handleContact = () => {
  emit('contact', props.host)
}

const handleActivate = () => {
  emit('activate', props.host)
}
</script>

<style scoped>
/* Modal Base Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}

.modal-container {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

/* Header */
.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.host-profile {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-indicator {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.active {
  background: #10b981;
}

.status-indicator.inactive {
  background: #94a3b8;
}

.host-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.host-name {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.host-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  font-size: 14px;
}

.email, .phone {
  display: flex;
  align-items: center;
  gap: 6px;
}

.close-btn {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #475569;
}

/* Content */
.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Info Sections */
.info-section, .assets-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-count {
  background: #3b82f6;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  color: #1e293b;
  font-weight: 500;
}

.info-value.with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-value.muted {
  color: #94a3b8;
  font-style: italic;
}

/* Badges */
.gender-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.gender-badge.male {
  background: #dbeafe;
  color: #1d4ed8;
}

.gender-badge.female {
  background: #fce7f3;
  color: #be185d;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: #f8fafc;
}

.status-badge.active {
  color: #065f46;
}

.status-badge.inactive {
  color: #475569;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-badge.active .status-dot {
  background: #10b981;
}

.status-badge.inactive .status-dot {
  background: #94a3b8;
}

/* Links */
.email-link, .phone-link {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s ease;
}

.email-link:hover, .phone-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* Assets Grid */
.empty-assets {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-assets i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.asset-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.asset-card.highlight {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.asset-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.asset-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

/* Asset Details */
.asset-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  gap: 16px;
}

.detail-item {
  flex: 1;
}

.detail-item label {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}

.price {
  font-size: 18px;
  font-weight: 700;
}

.price.expected {
  color: #f59e0b;
}

.price.current {
  color: #10b981;
}

/* Stats */
.stats {
  margin-top: 8px;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

/* Footer */
.modal-footer {
  padding: 24px 32px;
  border-top: 1px solid #e9ecef;
  background: #f8fafc;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

/* Icons (Using Unicode/Emoji for demo) */
.icon {
  display: inline-block;
  font-style: normal;
}

.icon-email::before { content: "✉️"; }
.icon-phone::before { content: "📱"; }
.icon-close::before { content: "×"; }
.icon-user::before { content: "👤"; }
.icon-location::before { content: "📍"; }
.icon-history::before { content: "🕒"; }
.icon-properties::before { content: "🏠"; }
.icon-home::before { content: "🏡"; }
.icon-view::before { content: "👁️"; }
.icon-request::before { content: "📝"; }
.icon-valuation::before { content: "💰"; }
.icon-empty::before { content: "📭"; }
.icon-contact::before { content: "📞"; }
.icon-activate::before { content: "✅"; }

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

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

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    max-height: 95vh;
  }

  .modal-header, .modal-content, .modal-footer {
    padding: 20px;
  }

  .host-profile {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .host-meta {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .assets-grid {
    grid-template-columns: 1fr;
  }

  .detail-row {
    flex-direction: column;
    gap: 12px;
  }

  .footer-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

/* Scrollbar Styling */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>