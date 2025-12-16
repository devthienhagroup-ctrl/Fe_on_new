<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <!-- Header -->
      <div class="modal-header">
        <div class="header-content">
          <div class="title-section">
            <div class="title-icon">
              <i class="fas fa-user-plus"></i>
            </div>
            <div>
              <h2 class="modal-title">Tạo Host mới</h2>
              <p class="modal-subtitle">Thêm chủ nhà vào hệ thống</p>
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
              <div class="section-icon">
                <i class="fas fa-id-card"></i>
              </div>
              <h3>Thông tin cơ bản</h3>
            </div>

            <div class="form-grid">
              <!-- Email -->
              <div class="form-group" :class="{ 'error': emailError }">
                <label class="form-label">
                  Email <span class="required">*</span>
                </label>
                <div class="input-wrapper">
                  <i class="input-icon fas fa-envelope"></i>
                  <input
                      v-model.trim="email"
                      type="email"
                      class="form-input"
                      placeholder="email@example.com"
                      :class="{ 'error': emailError }"
                  />
                </div>
                <div v-if="emailError" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ emailError }}
                </div>
              </div>

              <!-- Full Name -->
              <div class="form-group" :class="{ 'error': fullNameError }">
                <label class="form-label">
                  Họ và tên <span class="required">*</span>
                </label>
                <div class="input-wrapper">
                  <i class="input-icon fas fa-user"></i>
                  <input
                      v-model.trim="fullName"
                      type="text"
                      class="form-input"
                      placeholder="Nguyễn Văn A"
                      :class="{ 'error': fullNameError }"
                  />
                </div>
                <div v-if="fullNameError" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ fullNameError }}
                </div>
              </div>

              <!-- Phone -->
              <div class="form-group" :class="{ 'error': phoneError }">
                <label class="form-label">
                  Số điện thoại <span class="required">*</span>
                </label>
                <div class="input-wrapper">
                  <i class="input-icon fas fa-phone"></i>
                  <input
                      v-model="phone"
                      type="tel"
                      class="form-input"
                      placeholder="098xxxxxxx"
                      :class="{ 'error': phoneError }"
                      @input="formatPhone"
                  />
                </div>
                <div v-if="phoneError" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ phoneError }}
                </div>
              </div>

              <!-- Gender -->
              <div class="form-group">
                <label class="form-label">Giới tính</label>
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

              <!-- Avatar -->
              <div class="form-group avatar-upload" :class="{ 'error': avatarError }">
                <label class="form-label">Avatar</label>
                <div class="upload-area" @click="triggerFileInput">
                  <div class="upload-content">
                    <img
                        v-if="avatarPreview"
                        :src="avatarPreview"
                        alt="Avatar preview"
                        class="avatar-preview"
                    />
                    <div v-else class="upload-placeholder">
                      <i class="fas fa-cloud-upload-alt"></i>
                      <p>Tải ảnh lên</p>
                      <span class="upload-hint">JPG, PNG, WEBP • Tối đa 2MB</span>
                    </div>
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
          </div>

          <!-- Address Section -->
          <div class="form-section">
            <div class="section-header">
              <div class="section-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <h3>Địa chỉ</h3>
            </div>

            <div class="form-grid">
              <!-- Province -->
              <div class="form-group" :class="{ 'error': provinceError }">
                <label class="form-label">
                  Tỉnh/Thành phố <span class="required">*</span>
                </label>
                <div class="select-wrapper">
                  <i class="input-icon fas fa-city"></i>
                  <select
                      v-model="province"
                      class="form-select"
                      :class="{ 'error': provinceError }"
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option v-for="p in provinces" :key="p.code" :value="p.name">
                      {{ p.name }}
                    </option>
                  </select>
                  <i class="select-arrow fas fa-chevron-down"></i>
                </div>
                <div v-if="provinceError" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ provinceError }}
                </div>
              </div>

              <!-- Ward -->
              <div class="form-group" :class="{ 'error': wardError }">
                <label class="form-label">
                  Phường/Xã <span class="required">*</span>
                </label>
                <div class="select-wrapper">
                  <i class="input-icon fas fa-map-signs"></i>
                  <select
                      v-model="ward"
                      class="form-select"
                      :class="{ 'error': wardError, 'disabled': !province }"
                      :disabled="!province"
                  >
                    <option value="">Chọn phường/xã</option>
                    <option v-for="w in wards" :key="w.code" :value="w.name">
                      {{ w.name }}
                    </option>
                  </select>
                  <i class="select-arrow fas fa-chevron-down"></i>
                </div>
                <div v-if="wardError" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ wardError }}
                </div>
              </div>

              <!-- Detail Address -->
              <div class="form-group" :class="{ 'error': detailAddressError }">
                <label class="form-label">
                  Địa chỉ chi tiết <span class="required">*</span>
                </label>
                <div class="input-wrapper">
                  <i class="input-icon fas fa-home"></i>
                  <input
                      v-model.trim="detailAddress"
                      type="text"
                      class="form-input"
                      placeholder="123 Đường Lê Lợi"
                      :class="{ 'error': detailAddressError }"
                  />
                </div>
                <div v-if="detailAddressError" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ detailAddressError }}
                </div>
              </div>

              <!-- Old Address -->
              <div class="form-group">
                <label class="form-label">Địa chỉ cũ</label>
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
              :disabled="isSubmitting || !isFormValid"
              @click="handleSubmit"
          >
            <i class="fas fa-plus"></i>
            <span v-if="isSubmitting">Đang tạo...</span>
            <span v-else>Tạo Host</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const emit = defineEmits(['close', 'created'])

// Form Data
const email = ref('')
const fullName = ref('')
const phone = ref('')
const gender = ref(true)
const province = ref('')
const ward = ref('')
const detailAddress = ref('')
const oldAddress = ref('')

// Avatar
const avatarFile = ref(null)
const avatarPreview = ref('')
const avatarError = ref('')
const fileInput = ref(null)

// Loading state
const isSubmitting = ref(false)

const selectedProvince = computed(() =>
    addressData.value.find(p => p.name === province.value)
)
const wards = computed(() => selectedProvince.value?.wards || [])

// Watch province change
watch(province, () => {
  ward.value = ''
})

// Validation
const emailError = computed(() => {
  if (!email.value.trim()) return 'Email là bắt buộc'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) return 'Email không hợp lệ'
  return ''
})

const fullNameError = computed(() => {
  if (!fullName.value.trim()) return 'Họ và tên là bắt buộc'
  if (fullName.value.length < 2) return 'Họ tên quá ngắn'
  return ''
})

const phoneError = computed(() => {
  if (!phone.value.trim()) return 'Số điện thoại là bắt buộc'
  const phoneRegex = /^(0[3-9][0-9]{8}|84[3-9][0-9]{8})$/
  const cleanPhone = phone.value.replace(/\s/g, '')
  if (!phoneRegex.test(cleanPhone)) return 'Số điện thoại không hợp lệ'
  return ''
})

const provinceError = computed(() => {
  return province.value ? '' : 'Vui lòng chọn tỉnh/thành phố'
})

const wardError = computed(() => {
  return ward.value ? '' : 'Vui lòng chọn phường/xã'
})

const detailAddressError = computed(() => {
  return detailAddress.value.trim() ? '' : 'Địa chỉ chi tiết là bắt buộc'
})

const isFormValid = computed(() => {
  return (
      !emailError.value &&
      !fullNameError.value &&
      !phoneError.value &&
      !provinceError.value &&
      !wardError.value &&
      !detailAddressError.value &&
      !avatarError.value
  )
})

// Methods
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

const triggerFileInput = () => {
  fileInput.value.click()
}

const onAvatarChange = (event) => {
  const file = event.target.files[0]
  avatarError.value = ''

  if (!file) {
    resetAvatar()
    return
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    avatarError.value = 'Chỉ chấp nhận file JPG, PNG hoặc WEBP'
    resetAvatar()
    return
  }

  // Validate file size (2MB)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    avatarError.value = 'Kích thước file không được vượt quá 2MB'
    resetAvatar()
    return
  }

  // Create preview
  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const resetAvatar = () => {
  avatarFile.value = null
  avatarPreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleClose = () => {
  emit('close')
}

import api from '/src/api/api.js'
import { showCenterSuccess, showCenterWarning } from '/src/assets/js/alertService.js'

const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    const formData = new FormData()

    const hostData = {
      email: email.value.trim(),
      fullName: fullName.value.trim(),
      phone: phone.value.replace(/\s/g, ''),
      gender: gender.value,
      address: `${detailAddress.value.trim()}/!!${ward.value}/!!${province.value}`,
      oldAddress: oldAddress.value.trim() || ""
    }

    formData.append(
        "dto",
        new Blob([JSON.stringify(hostData)], { type: "application/json" })
    )

    if (avatarFile.value) {
      formData.append("file", avatarFile.value)
    }

    const response = await api.post("/host/add", formData, {
      headers: { "Content-Type": "multipart/form-data", "Accept": "application/json" }
    })

    const result = response.data

    // ❌ Trùng EMAIL
    if (!result.success && result.message === "EMAIL_ALREADY_EXISTS") {
      showCenterWarning(
          "Email đã tồn tại",
          "Email này đã được sử dụng trong hệ thống"
      )
      return
    }

    // ❌ Trùng SĐT
    if (!result.success && result.message === "PHONE_ALREADY_EXISTS") {
      showCenterWarning(
          "Số điện thoại đã tồn tại",
          "Số điện thoại này đã được sử dụng trong hệ thống"
      )
      return
    }

    // ❌ Lỗi khác
    if (!result.success) {
      showCenterWarning(
          "Không thể tạo khách hàng",
          "Vui lòng kiểm tra lại thông tin"
      )
      return
    }

    // ✅ Thành công
    showCenterSuccess(
        "Tạo khách hàng thành công",
        "Hệ thống đã ghi nhận dữ liệu!"
    )

    emit("created", result.data)
    emit("close")

  } catch (error) {
    console.error("❌ Error creating host:", error)
    showCenterWarning(
        "Lỗi hệ thống",
        "Không thể kết nối máy chủ"
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

// Load address data
import addressJson from '/src/assets/js/address.json'

const addressData = ref(addressJson)

// 🟢 provinces có thể truy cập trong template
const provinces = computed(() => addressData.value)

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
  // Clean up object URL if exists
  if (avatarPreview.value && avatarPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarPreview.value)
  }
})
</script>

<style scoped>
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
  max-width: 800px;
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
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 0;
}

.close-button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f1f5f9;
  color: #475569;
}

/* Content */
.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.host-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Form Sections */
.form-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* Form Groups */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.form-label .required {
  color: #ef4444;
}

/* Input Wrapper */
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
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.form-input.error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Select Styles */
.form-select {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select.error {
  border-color: #ef4444;
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
}

/* Gender Selector */
.gender-selector {
  display: flex;
  gap: 12px;
}

.gender-option {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gender-option:hover {
  border-color: #3b82f6;
}

.gender-option.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #1d4ed8;
}

.gender-option i {
  font-size: 16px;
}

/* Avatar Upload */
.avatar-upload {
  grid-column: 1 / -1;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-placeholder i {
  font-size: 48px;
  color: #94a3b8;
}

.upload-placeholder p {
  margin: 0;
  font-weight: 500;
  color: #475569;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
}

.file-input {
  display: none;
}

/* Error Messages */
.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

.error-message i {
  font-size: 14px;
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

/* Buttons */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-width: 120px;
  justify-content: center;
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn-secondary:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
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
    margin: 0;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 20px;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .gender-selector {
    flex-direction: column;
  }

  .footer-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
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