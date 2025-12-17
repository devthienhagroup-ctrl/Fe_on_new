<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="title-section">
            <div class="title-icon">
              <i class="fas fa-user-edit"></i>
            </div>
            <div>
              <h2 class="modal-title">
                Cập nhật {{ type === 'HOST' ? 'chủ nhà' : 'môi giới' }}
              </h2>

              <p class="modal-subtitle">
                Chỉnh sửa thông tin {{ type === 'HOST' ? 'chủ nhà' : 'môi giới' }}
              </p>

            </div>
          </div>
          <button class="close-button" @click="handleClose">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Form Content -->
      <div class="modal-content">
        <form @submit.prevent="handleSubmit" class="host-form">
          <!-- Basic Information Section -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon section-icon-blue">
                <i class="fas fa-id-card"></i>
              </div>
              <h3>Thông tin cơ bản</h3>
            </div>

            <div class="basic-info-layout">
              <!-- Left side - Avatar -->
              <div class="avatar-side">
                <div class="avatar-upload">
                  <div class="upload-container">
                    <div class="avatar-preview-container" @click="triggerFileInput">
                      <div class="upload-area">
                        <img
                            v-if="avatarPreview"
                            :src="avatarPreview"
                            alt="Avatar preview"
                            class="avatar-preview"
                            @error="handlePreviewError"
                        />
                        <div v-else class="upload-placeholder">
                          <i class="fas fa-cloud-upload-alt"></i>
                          <p>Tải ảnh lên</p>
                        </div>
                      </div>
                    </div>
                    <div class="upload-info">
                      <span class="upload-hint">JPG, PNG, WEBP</span>
                      <span class="upload-hint">Tối đa 2MB</span>
                      <button type="button" class="change-btn" @click="triggerFileInput">
                        <i class="fas fa-exchange-alt"></i>
                        Thay đổi
                      </button>
                    </div>
                    <input
                        ref="fileInput"
                        type="file"
                        class="file-input"
                        accept="image/jpeg,image/png,image/webp"
                        @change="onAvatarChange"
                    />
                  </div>
                  <div v-if="avatarError" class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    {{ avatarError }}
                  </div>
                </div>
              </div>

              <!-- Right side - Form fields -->
              <div class="form-fields-container">
                <div class="form-fields-grid">
                  <!-- Row 1 -->
                  <div class="form-row">
                    <!-- Full Name -->
                    <div class="form-group">
                      <label class="form-label">
                        <i class="fas fa-user text-sky"></i>
                        Họ và tên
                      </label>
                      <div class="input-wrapper">
                        <i class="input-icon fas fa-user"></i>
                        <input
                            v-model.trim="fullName"
                            type="text"
                            class="form-input"
                            placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div v-if="fieldErrors.fullName" class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        {{ fieldErrors.fullName }}
                      </div>
                    </div>
                  </div>

                  <!-- Row 2 -->
                  <div class="form-row">
                    <!-- Phone -->
                    <div class="form-group">
                      <label class="form-label">
                        <i class="fas fa-phone text-emerald"></i>
                        Số điện thoại
                      </label>
                      <div class="input-wrapper">
                        <i class="input-icon fas fa-phone"></i>
                        <input
                            v-model="phone"
                            type="tel"
                            class="form-input"
                            placeholder="098xxxxxxx"
                            @input="formatPhone"
                        />
                      </div>
                      <div v-if="fieldErrors.phone" class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        {{ fieldErrors.phone }}
                      </div>
                    </div>
                  </div>

                  <!-- Row 3 -->
                  <div class="form-row">
                    <!-- Gender -->
                    <div class="form-group">
                      <label class="form-label">
                        <i class="fas fa-venus-mars text-pink"></i>
                        Giới tính
                      </label>
                      <div class="gender-selector">
                        <button
                            type="button"
                            class="gender-option"
                            :class="{ 'active': gender === true }"
                            @click="gender = true"
                        >
                          <i class="fas fa-mars"></i>
                          <span>Nam</span>
                        </button>
                        <button
                            type="button"
                            class="gender-option"
                            :class="{ 'active': gender === false }"
                            @click="gender = false"
                        >
                          <i class="fas fa-venus"></i>
                          <span>Nữ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Section -->
          <div class="form-section address-section">
            <div class="section-header">
              <div class="section-icon section-icon-green">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <h3>Địa chỉ</h3>
            </div>

            <div class="address-grid">
              <!-- Province -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-city text-indigo"></i>
                  Tỉnh/Thành phố
                </label>
                <div class="select-wrapper">
                  <i class="input-icon fas fa-city"></i>
                  <select
                      v-model="province"
                      class="form-select"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option v-for="p in provinces" :key="p.code" :value="p.name">
                      {{ p.name }}
                    </option>
                  </select>
                  <i class="select-arrow fas fa-chevron-down"></i>
                </div>
                <div v-if="fieldErrors.province" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ fieldErrors.province }}
                </div>
              </div>

              <!-- Ward -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-map-signs text-orange"></i>
                  Phường/Xã
                </label>
                <div class="select-wrapper">
                  <i class="input-icon fas fa-map-signs"></i>
                  <select
                      v-model="ward"
                      class="form-select"
                      :class="{ 'disabled': !province }"
                      :disabled="!province"
                  >
                    <option value="">Chọn phường/xã</option>
                    <option v-for="w in wards" :key="w.code" :value="w.name">
                      {{ w.name }}
                    </option>
                  </select>
                  <i class="select-arrow fas fa-chevron-down"></i>
                </div>
                <div v-if="fieldErrors.ward" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ fieldErrors.ward }}
                </div>
              </div>

              <!-- Detail Address -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-home text-purple"></i>
                  Địa chỉ chi tiết
                </label>
                <div class="input-wrapper">
                  <i class="input-icon fas fa-home"></i>
                  <input
                      v-model.trim="detailAddress"
                      type="text"
                      class="form-input"
                      placeholder="123 Đường Lê Lợi"
                  />
                </div>
                <div v-if="fieldErrors.detailAddress" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ fieldErrors.detailAddress }}
                </div>
              </div>

              <!-- Old Address -->
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-history text-gray"></i>
                  Địa chỉ cũ
                </label>
                <div class="input-wrapper">
                  <i class="input-icon fas fa-history"></i>
                  <input
                      v-model.trim="oldAddress"
                      type="text"
                      class="form-input"
                      placeholder="Nhập địa chỉ cũ (nếu có)"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <div class="footer-actions">
          <button type="button" class="btn btn-secondary" @click="handleClose">
            <i class="fas fa-times"></i>
            Huỷ
          </button>
          <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
              @click="handleSubmit"
          >
            <i class="fas fa-save"></i>
            <span v-if="isSubmitting">Đang lưu...</span>
            <span v-else>Cập nhật</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import addressJson from '/src/assets/js/address.json'

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

const emit = defineEmits(['close', 'reload'])

const fullName = ref('')
const phone = ref('')
const gender = ref(true)
const province = ref('')
const ward = ref('')
const detailAddress = ref('')
const oldAddress = ref('')

const avatarFile = ref(null)
const avatarPreview = ref('')
const avatarError = ref('')
const fileInput = ref(null)

const DEFAULT_AVATAR = 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/vat-default.jpg'

const fieldErrors = ref({
  fullName: '',
  phone: '',
  province: '',
  ward: '',
  detailAddress: ''
})

const isSubmitting = ref(false)

const addressData = ref(addressJson)
const provinces = computed(() => addressData.value)
const selectedProvince = computed(() =>
    addressData.value.find(p => p.name === province.value)
)
const wards = computed(() => selectedProvince.value?.wards || [])

const formatPhone = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length > 0) {
    if (value.startsWith('84')) {
      value = '0' + value.slice(2)
    }
    value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  phone.value = value
}

const parseAddress = (address) => {
  if (!address) return { detail: '', ward: '', province: '' }
  const [detail = '', wardValue = '', provinceValue = ''] = address.split('/!!')
  return { detail, ward: wardValue, province: provinceValue }
}

const populateData = () => {
  const parsed = parseAddress(props.host?.address)
  fullName.value = props.host?.fullName || ''
  phone.value = props.host?.phone ? props.host.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3') : ''
  gender.value = props.host?.gender ?? true
  province.value = parsed.province
  ward.value = parsed.ward
  detailAddress.value = parsed.detail
  oldAddress.value = props.host?.oldAddress || ''
  avatarPreview.value = props.host?.avatar
      ? `https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${props.host.avatar}`
      : DEFAULT_AVATAR
  fieldErrors.value = { fullName: '', phone: '', province: '', ward: '', detailAddress: '' }
}

watch(() => props.host, populateData, { immediate: true, deep: true })

watch(province, () => {
  ward.value = ''
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const onAvatarChange = (event) => {
  const file = event.target.files[0]
  avatarError.value = ''

  if (!file) {
    resetAvatar()
    return
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    avatarError.value = 'Chỉ chấp nhận file JPG, PNG hoặc WEBP'
    resetAvatar()
    return
  }

  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    avatarError.value = 'Kích thước file không được vượt quá 2MB'
    resetAvatar()
    return
  }

  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const resetAvatar = () => {
  avatarFile.value = null
  avatarPreview.value = props.host?.avatar
      ? `https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${props.host.avatar}`
      : DEFAULT_AVATAR
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handlePreviewError = () => {
  avatarPreview.value = DEFAULT_AVATAR
}

const handleClose = () => {
  emit('close')
}

const validateForm = () => {
  fieldErrors.value = { fullName: '', phone: '', province: '', ward: '', detailAddress: '' }
  let isValid = true

  if (!fullName.value.trim()) {
    fieldErrors.value.fullName = 'Vui lòng nhập họ và tên'
    isValid = false
  }

  const rawPhone = phone.value.replace(/\s/g, '')
  if (!rawPhone) {
    fieldErrors.value.phone = 'Vui lòng nhập số điện thoại'
    isValid = false
  } else if (!/^0\d{9}$/.test(rawPhone)) {
    fieldErrors.value.phone = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0'
    isValid = false
  }

  if (!province.value) {
    fieldErrors.value.province = 'Chọn tỉnh/thành phố'
    isValid = false
  }

  if (!ward.value) {
    fieldErrors.value.ward = 'Chọn phường/xã'
    isValid = false
  }

  if (!detailAddress.value.trim()) {
    fieldErrors.value.detailAddress = 'Nhập địa chỉ chi tiết'
    isValid = false
  }

  return isValid
}

import api from '/src/api/api.js'
import {
  showCenterSuccess,
  showCenterWarning
} from '/src/assets/js/alertService.js'

const handleSubmit = async () => {
  if (isSubmitting.value) return
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    const jsonPayload = {
      id: props.host.id,
      fullName: fullName.value.trim(),
      phone: phone.value.replace(/\s/g, ''),
      gender: gender.value,
      address: `${detailAddress.value.trim()}/!!${ward.value}/!!${province.value}`,
      oldAddress: oldAddress.value.trim()
    }

    const formData = new FormData()
    formData.append('dto', new Blob([JSON.stringify(jsonPayload)], { type: 'application/json' }))

    if (avatarFile.value) {
      formData.append('file', avatarFile.value)
    }

    const res = await api.post(
        `/host/update`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
    )

    const result = res.data;

    // ❌ Trùng SĐT
    if (!result.success && result.message === "PHONE_ALREADY_EXISTS") {
      showCenterWarning(
          "Số điện thoại đã tồn tại",
          "Số điện thoại này đã được sử dụng trong hệ thống"
      )
      return
    }


    // ✅ Thành công
    showCenterSuccess(
        "Cập nhật thành công",
        "Thông tin đã được ghi nhận!"
    )

    emit('reload')
    emit('close')
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật:', err)
    showCenterWarning(
        "Có lỗi xảy ra",
        "Vui lòng thử lại sau!"
    )
  } finally {
    isSubmitting.value = false
  }
}


const handleEsc = (event) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
})
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 24px;
}

.modal-container {
  width: min(1100px, 95vw);
  background: #f8fafc;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 48px);
  overflow: hidden;
}

.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.25);
}

.modal-title {
  margin: 0;
  font-size: 20px;
  color: #0f172a;
}

.modal-subtitle {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 14px;
}

.close-button {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f8fafc;
  color: #1e293b;
  transform: translateY(-1px);
}

.modal-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.host-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  background: white;
  border-radius: 18px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-icon-blue { background: #e0f2fe; color: #0ea5e9; }
.section-icon-green { background: #dcfce7; color: #16a34a; }

.section-header h3 {
  margin: 0;
  color: #0f172a;
  font-size: 16px;
  font-weight: 600;
}

/* Basic Info Layout */
.basic-info-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* Avatar Side - Bên trái */
.avatar-side {
  flex-shrink: 0;
  width: 220px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.avatar-preview-container {
  display: flex;
  justify-content: center;
}

.upload-area {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 2px dashed #cbd5e1;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  position: relative;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #eff6ff;
  transform: translateY(-2px);
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.upload-placeholder {
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
}

.upload-placeholder i {
  font-size: 32px;
}

.upload-placeholder p {
  margin: 0;
  font-size: 14px;
  text-align: center;
}

.upload-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  line-height: 1.4;
}

.change-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.change-btn:hover {
  background: #eff6ff;
}

/* Form Fields - Bên phải */
.form-fields-container {
  flex: 1;
  min-width: 0;
}

.form-fields-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
}

.text-sky { color: #0284c7; }
.text-emerald { color: #059669; }
.text-pink { color: #db2777; }
.text-amber { color: #d97706; }
.text-indigo { color: #4f46e5; }
.text-orange { color: #ea580c; }
.text-purple { color: #7c3aed; }
.text-gray { color: #6b7280; }

.input-wrapper, .select-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 16px;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 14px 14px 14px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  transition: all 0.2s ease;
  height: 48px;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select {
  width: 100%;
  padding: 14px 40px 14px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 48px;
  box-sizing: border-box;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select.disabled {
  background: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.6;
}

.select-arrow {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
  font-size: 12px;
}

.gender-selector {
  display: flex;
  gap: 10px;
  height: 48px;
}

.gender-option {
  flex: 1;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  height: 100%;
  box-sizing: border-box;
}

.gender-option:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.gender-option.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.15);
}

/* Address Section - Thu nhỏ bằng với phần trên */
.address-section {
  width: 100%;
}

.address-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 20px;
}

.file-input {
  display: none;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ef4444;
  font-size: 13px;
  margin-top: 4px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: white;
  display: flex;
  justify-content: flex-end;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: white;
  box-shadow: 0 12px 30px rgba(79, 70, 229, 0.25);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 40px rgba(79, 70, 229, 0.35);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f8fafc;
  color: #0f172a;
}

@media (max-width: 768px) {
  .modal-container {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }

  .modal-overlay {
    padding: 0;
  }

  .modal-content {
    padding: 16px;
  }

  .basic-info-layout {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .avatar-side {
    width: 100%;
    max-width: 220px;
  }

  .upload-area {
    width: 160px;
    height: 160px;
  }

  .address-section {
    max-width: 100%;
  }

  .address-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 1024px) {
  .address-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
