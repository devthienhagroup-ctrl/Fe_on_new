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
            <h2 class="host-name">
              {{ host.fullName }}
              <span
                  class="gender-inline"
                  :class="host.gender ? 'male' : 'female'"
              >
                {{ host.gender ? 'Nam' : 'Nữ' }}
              </span>
            </h2>
            <div class="host-meta">
              <span class="email">
                <i class="fa-solid fa-envelope"></i>
                {{ host.email }}
              </span>
              <span class="divider">•</span>
              <span class="phone" v-if="host.phone">
                <i class="fa-solid fa-phone"></i>
                {{ formatPhone(host.phone) }}
              </span>
            </div>
          </div>
        </div>

        <button class="close-btn" @click="$emit('close')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="modal-content">
        <!-- Personal Information Section -->
        <section class="info-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="fa-solid fa-id-card-clip"></i>
              Thông tin cá nhân
            </h3>
          </div>

          <div class="info-columns">
            <div
                v-for="(column, columnIndex) in infoColumns"
                :key="columnIndex"
                class="info-column"
            >
              <div
                  v-for="item in column"
                  :key="item.label || columnIndex"
                  class="info-card"
                  :class="{ placeholder: item.placeholder, highlight: item.highlight }"
              >
                <template v-if="!item.placeholder">
                  <div class="info-card-header">
                    <div class="info-icon" :class="item.iconColor">
                      <i class="fa-solid" :class="item.icon"></i>
                    </div>
                    <div class="info-title">{{ item.label }}</div>
                  </div>

                  <div class="info-card-value" :class="{ muted: item.muted }">
                    <template v-if="item.type === 'email'">
                      <a :href="`mailto:${host.email}`" class="link">{{ item.value }}</a>
                    </template>
                    <template v-else-if="item.type === 'phone'">
                      <a v-if="host.phone" :href="`tel:${host.phone}`" class="link">{{ item.value }}</a>
                      <span v-else class="empty-state">—</span>
                    </template>
                    <template v-else-if="item.type === 'status'">
                      <span class="status-pill" :class="host.status ? 'active' : 'inactive'">
                        <span class="status-dot"></span>
                        {{ item.value }}
                      </span>
                    </template>
                    <template v-else-if="item.type === 'gender'">
                      <span class="gender-badge" :class="host.gender ? 'male' : 'female'">
                        {{ item.value }}
                      </span>
                    </template>
                    <template v-else>
                      {{ item.value }}
                    </template>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </section>

        <!-- Assets Section -->
        <section class="assets-section">
          <div class="section-header">
            <h3 class="section-title">
              <i class="fa-solid fa-warehouse"></i>

              {{ props.type === 'HOST'
                ? 'Tài sản đang quản lý'
                : 'Các căn đã bán thành công'
              }}

              <span class="asset-count">{{ host.assets?.length || 0 }}</span>
            </h3>

          </div>

          <div v-if="!host.assets || host.assets.length === 0" class="empty-assets">
            <i class="fa-regular fa-folder-open"></i>
            <p>Chưa có tài sản nào</p>
          </div>

          <div v-else class="assets-list">
            <div
                v-for="(asset, index) in host.assets"
                :key="asset.id"
                class="asset-card"
                :class="{ highlight: index % 2 === 0 }"
                @click="goToAsset(asset)"
            >
              <div class="asset-main">
                <div class="asset-icon">
                  <i class="fa-solid fa-house"></i>
                </div>
                <div class="asset-meta">
                  <p class="asset-label">Địa chỉ</p>
                  <div class="asset-title-row">
                    <h4 class="asset-title">{{ formatAddress(asset.address) }}</h4>

                    <div class="asset-prices inline">
                      <div class="price-tag expected">
                        <span class="label">Giá mong mốn</span>
                        <span class="value">{{ formatMoney(asset.giaMongMuon) }}</span>
                      </div>
                      <div class="price-tag current">
                        <span class="label">Giá bán</span>
                        <span class="value">{{ formatMoney(asset.giaBan) }}</span>
                      </div>
                      <!-- HOST -->
                      <template v-if="props.type === 'HOST'">
                        <div class="status-tag violet">
                          <span class="value">{{ asset.trangThai || 'Chưa rõ' }}</span>
                        </div>
                      </template>

                      <!-- MÔI GIỚI -->
                      <template v-else>
                        <div class="price-tag success sold-inline">
                          <span class="label">
                            <i class="fa-solid fa-sack-dollar me-1"></i>
                            Giá bán thành công:
                          </span>
                                                  <span class="value">
                            {{ formatMoney(asset.giaBanThanhCong) }}
                          </span>
                        </div>

                      </template>

                    </div>
                  </div>

                </div>
              </div>

              <div class="asset-stats" v-if="props.type === 'HOST'">
                <div class="stat-box">
                  <div class="stat-icon compact">
                    <i class="fa-solid fa-clipboard-check"></i>
                  </div>
                  <div>
                    <div class="stat-value">{{ asset.soLanYeuCauDinhGia || 0 }}</div>
                    <div class="stat-label">Yêu cầu định giá</div>
                  </div>
                </div>
                <div class="stat-box">
                  <div class="stat-icon compact success">
                    <i class="fa-solid fa-scale-balanced"></i>
                  </div>
                  <div>
                    <div class="stat-value">{{ asset.soLanDinhGia || 0 }}</div>
                    <div class="stat-label">Đã định giá</div>
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
            <i class="fa-solid fa-xmark"></i>
            Đóng
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
  },
  type: {
    type: String,
    default: 'HOST' // HOST | MOI_GIOI
  }
})

const emit = defineEmits(['close', 'contact', 'activate'])

const BASE_URL = 'https://s3.cloudfly.vn/thg-storage/uploads-public/'

// Format functions
const formatAddress = (raw) => {
  if (!raw) return 'Chưa cập nhật'
  return raw
      .split('/!!')
      .map(s => s.trim())
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

const avatarUrl = computed(() => {
  return props.host?.avatar
      ? BASE_URL + props.host.avatar
      : BASE_URL + 'vat-default.jpg'
})

import { useRouter } from 'vue-router'

const router = useRouter()

const goToAsset = (asset) => {
  if (!asset?.id) return
  router.push(`/-thg/quan-ly-san-pham/${asset.id}`)
}

const infoItems = computed(() => {
  const items = [
    {
      label: 'Họ và tên',
      value: props.host.fullName || '—',
      icon: 'fa-id-badge',
      iconColor: 'info'
    },
    {
      label: 'Email',
      value: props.host.email,
      icon: 'fa-envelope',
      iconColor: 'primary',
      type: 'email'
    },
    {
      label: 'Điện thoại',
      value: props.host.phone ? formatPhone(props.host.phone) : '—',
      icon: 'fa-phone',
      iconColor: 'success',
      type: 'phone'
    },
    {
      label: 'Trạng thái tài khoản',
      value: props.host.status ? 'Đang hoạt động' : 'Đã khoá',
      icon: 'fa-shield-halved',
      iconColor: 'warning',
      type: 'status'
    },
    {
      label: 'Địa chỉ',
      value: formatAddress(props.host.address),
      icon: 'fa-location-dot',
      iconColor: 'danger',
      highlight: true
    },
    {
      label: 'Địa chỉ trước cũ',
      value: formatAddress(props.host.oldAddress) || 'Không có dữ liệu',
      icon: 'fa-clock-rotate-left',
      iconColor: 'muted',
      muted: true
    }
  ]

  if (items.length % 2 !== 0) {
    items.push({ placeholder: true })
  }

  return items
})

const infoColumns = computed(() => {
  const midpoint = infoItems.value.length / 2
  return [
    infoItems.value.slice(0, midpoint),
    infoItems.value.slice(midpoint)
  ]
})

const handleImageError = (e) => {
  e.target.src = BASE_URL + 'vat-default.jpg'
}

const handleActivate = () => {
  emit('activate', props.host)
}
</script>

<style scoped>
.status-tag.violet {
  background-color: #f3e8ff;
  border-radius: 15px;
  padding: 4px 8px;
  display: inline-block;
  font-size: 13px;
  color: #6b21a8;
}

.status-tag.violet .label {
  font-weight: 500;
  font-size: 12px;
  display: block;
  color: #7e22ce;
}

.status-tag.violet .value {
  font-weight: bold;
}

/* Modal Base Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(6, 10, 26, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-count {
  background: #2563eb;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
}

.info-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.info-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 96px;
}

.info-card.highlight {
  background: #eef2ff;
  border-color: #c7d2fe;
}

.info-card.placeholder {
  visibility: hidden;
  padding: 0;
  min-height: 0;
  border: none;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: #1f2937;
  font-size: 14px;
}

.info-icon.primary { background: #e0f2fe; color: #1d4ed8; }
.info-icon.secondary { background: #fce7f3; color: #be185d; }
.info-icon.success { background: #dcfce7; color: #166534; }
.info-icon.warning { background: #fef3c7; color: #d97706; }
.info-icon.danger { background: #fee2e2; color: #b91c1c; }
.info-icon.info { background: #e0f2fe; color: #0369a1; }
.info-icon.muted { background: #f8fafc; color: #94a3b8; }

.info-title {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.info-card-value {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}

.info-card-value .link {
  color: #2563eb;
  text-decoration: none;
}

.info-card-value .link:hover {
  text-decoration: underline;
}

.info-card-value.muted {
  color: #94a3b8;
  font-weight: 500;
}

.gender-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.gender-badge.male { background: #dbeafe; color: #1d4ed8; }
.gender-badge.female { background: #fce7f3; color: #be185d; }

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  background: #f8fafc;
}

.status-pill.active { color: #065f46; }
.status-pill.inactive { color: #475569; }

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.empty-state {
  color: #94a3b8;
}

.empty-assets {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-assets i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.6;
}

.assets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.asset-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
}

.asset-card.highlight {
  background: #f8fafc;
  border-color: #dbeafe;
}

.asset-card:hover {
  border-color: #2563eb;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.12);
}

.asset-main {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.asset-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.asset-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.asset-label {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 11px;
  color: #64748b;
  margin: 0;
}

.asset-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.4;
}

.asset-prices {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.price-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  background: #f1f5f9;
  font-size: 14px;
}

.price-tag .label {
  color: #475569;
  font-weight: 600;
}

.price-tag .value {
  font-weight: 700;
  color: #111827;
}

.price-tag.expected {
  background: #fef3c7;
  color: #b45309;
}

.price-tag.current {
  background: #dcfce7;
  color: #166534;
}

.asset-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  flex: 1;
  min-width: 220px;
}

.stat-icon.compact {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #e0e7ff;
  color: #4338ca;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.compact.success {
  background: #dcfce7;
  color: #166534;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
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
/* =========================
   GIÁ BÁN THÀNH CÔNG – INLINE
========================= */
.sold-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  background: #fee2e2;              /* đỏ nhạt */
  color: #991b1b;

  padding: 6px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

/* label */
.sold-inline .label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

/* icon */
.sold-inline i {
  font-size: 12px;
  color: #b91c1c;
}

/* value */
.sold-inline .value {
  font-weight: 700;
  white-space: nowrap;   /* 👈 KHÔNG XUỐNG DÒNG */
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
  background: #0d44ea;
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

  .info-columns {
    grid-template-columns: 1fr;
  }

  .asset-main {
    flex-direction: column;
  }

  .asset-stats {
    flex-direction: column;
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
.gender-inline {
  margin-left: 10px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  vertical-align: middle;
}

.gender-inline.male {
  background: #dbeafe;
  color: #1d4ed8;
}

.gender-inline.female {
  background: #fce7f3;
  color: #be185d;
}
.asset-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.asset-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.asset-prices.inline {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.price-tag {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.price-tag .label {
  font-size: 11px;
  font-weight: 700;
  margin-right: 4px;
}

</style>