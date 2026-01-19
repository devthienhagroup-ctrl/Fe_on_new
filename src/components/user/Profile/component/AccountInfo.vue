<template>
  <div class="personal-info">
    <!-- Thông tin cá nhân -->
    <div class="info-container">
      <!-- Ảnh hồ sơ -->
      <div class="info-item">
        <div class="avatar-section">
          <div class="avatar-container">
            <img
                :src="'https://s3.cloudfly.vn/thg-storage/uploads-public/'+ (user_info.avatar || 'default-avatar.png')"
                alt="Avatar"
                class="avatar"
            />
          </div>
          <div class="avatar-info">
            <h3 class="title">Ảnh hồ sơ</h3>
            <p class="subtitle">Thêm ảnh hồ sơ để cá nhân hóa tài khoản của bạn</p>
          </div>
        </div>
      </div>

      <!-- Họ tên -->
      <div class="info-item">
        <div class="item-content">
          <div class="icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="text-content">
            <p class="label">Họ tên</p>
            <p class="value">{{ user_info.fullName }}</p>
          </div>
        </div>
      </div>

      <!-- Loại hình đăng ký -->
      <div class="info-item">
        <div class="item-content">
          <div class="icon">
            <i class="fas fa-id-card"></i>
          </div>
          <div class="text-content">
            <p class="label">Loại hình đăng ký</p>
            <p class="value">{{ user_info.role }}</p>
          </div>
        </div>
      </div>

      <!-- Giới tính -->
      <div class="info-item">
        <div class="item-content">
          <div class="icon">
            <i class="fas fa-venus-mars"></i>
          </div>
          <div class="text-content">
            <p class="label">Giới tính</p>
            <p class="value">{{ user_info.gender ? 'Nam' : 'Nữ' }}</p>
          </div>
        </div>
      </div>

      <!-- Số điện thoại -->
      <div class="info-item">
        <div class="item-content">
          <div class="icon">
            <i class="fas fa-phone"></i>
          </div>
          <div class="text-content">
            <p class="label">Số điện thoại</p>
            <p class="value">{{ user_info.phone }}</p>
          </div>
        </div>
      </div>

      <!-- Địa chỉ - Gộp thành 1 ô chia 2 cột -->
      <div class="info-item">
        <div class="address-container">
          <!-- Cột trái - Địa chỉ hiện tại -->
          <div class="address-column current-address">
            <div class="address-header">
              <i class="fas fa-map-marker-alt"></i>
              <span class="address-title">Địa chỉ hiện tại</span>
            </div>
            <div class="address-content">
              <div class="address-field">
                <span class="field-label">Tỉnh/Thành phố:</span>
                <span class="field-value">{{user_info.province }}</span>
              </div>
              <div class="address-field">
                <span class="field-label">Phường/Xã:</span>
                <span class="field-value">{{user_info.ward }}</span>
              </div>
              <div class="address-field">
                <span class="field-label">Địa chỉ cụ thể:</span>
                <span class="field-value">{{ user_info.address }}</span>
              </div>
            </div>
          </div>

          <!-- Cột phải - Địa chỉ cũ -->
          <div class="address-column old-address">
            <div class="address-header">
              <i class="fas fa-history"></i>
              <span class="address-title">Địa chỉ cũ (không bắt buộc)</span>
            </div>
            <div class="address-content">
              <p class="old-address-text">{{ user_info.oldAddress || 'Không có' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Button chỉnh sửa - Canh phải -->
    <div class="action-section">
      <button class="edit-btn" @click="showModal = true">
        <i class="fas fa-edit"></i>
        Chỉnh sửa thông tin
      </button>
    </div>

    <!-- Modal chỉnh sửa -->
    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Chỉnh sửa thông tin cá nhân</h3>
          <button class="close-btn" @click="showModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- Ảnh hồ sơ -->
            <div class="form-group">
              <label>Ảnh hồ sơ</label>
              <div class="avatar-upload">
                <img
                    :src="avatarUrl"
                    alt="Avatar"
                    class="avatar-preview"
                />
                <input
                    type="file"
                    accept="image/*"
                    @change="handleAvatarChange"
                    class="avatar-input"
                />
              </div>
              <div v-if="errors.avatar" class="error-message">{{ errors.avatar }}</div>
            </div>

            <!-- Các trường thông tin -->
            <div class="form-group">
              <label>Họ tên</label>
              <input
                  type="text"
                  v-model="editedInfo.fullName"
                  class="form-input"
                  :class="{ 'error': errors.fullName }"
              />
              <div v-if="errors.fullName" class="error-message">{{ errors.fullName }}</div>
            </div>

            <div class="form-group">
              <label>Giới tính</label>
              <select v-model="editedInfo.gender" class="form-input" :class="{ 'error': errors.gender }">
                <option :value="true">Nam</option>
                <option :value="false">Nữ</option>
              </select>
              <div v-if="errors.gender" class="error-message">{{ errors.gender }}</div>
            </div>

            <div class="form-group">
              <label>Số điện thoại</label>
              <input
                  type="tel"
                  v-model="editedInfo.phone"
                  class="form-input"
                  :class="{ 'error': errors.phone }"
              />
              <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
            </div>

            <!-- Địa chỉ trong modal - Chia 2 cột -->
            <div class="form-group">
              <label class="section-label">Thông tin địa chỉ</label>
              <div class="address-form-container">
                <div class="address-form-column">
                  <h4 class="column-title">
                    <i class="fas fa-map-marker-alt"></i>
                    Địa chỉ hiện tại
                  </h4>

                  <!-- Sử dụng AddressSelect2 cho Tỉnh/Thành phố và Phường/Xã -->
                  <AddressSelector3
                      v-model="currentAddress"
                  />
                  <div v-if="errors.address" class="error-message">{{ errors.address }}</div>
                  <div v-if="errors.ward" class="error-message">{{ errors.ward }}</div>
                  <div v-if="errors.province" class="error-message">{{ errors.province }}</div>

                </div>

                <div class="address-form-column">
                  <h4 class="column-title">
                    <i class="fas fa-history"></i>
                    Địa chỉ cũ
                  </h4>
                  <div class="form-group">
                    <textarea
                        v-model="editedInfo.oldAddress"
                        class="form-input"
                        rows="8"
                        placeholder="Nhập địa chỉ cũ..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button
              class="cancel-btn"
              @click="showModal = false"
              :disabled="isLoading"
          >
            Hủy
          </button>
          <button
              class="save-btn"
              @click="handleSave"
              :disabled="isLoading"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin"></i>
              Đang lưu...
            </span>
            <span v-else>
              Lưu thông tin
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import addressData from "/src/assets/js/address.json";
import AddressSelector3 from "../../../land/my-valuation/components/AddressSelector2.vue";
import api from "../../../../api/api.js";
import {eventBus} from "../../../../assets/js/event-bus.js";

const ADDRESS_DELIMITER = '/!!'

// Props nhận từ component cha
const props = defineProps({
  user_info: {
    type: Object,
    required: true,
    default: () => ({
      avatar: '',
      fullName: '',
      role: '',
      gender: true,
      phone: '',
      province: '',
      ward: '',
      address: '',
      oldAddress: ''
    })
  }
})

// Emit để thông báo cập nhật thành công
const emit = defineEmits(['update-success'])

const showModal = ref(false)
const editedInfo = reactive({})
const isLoading = ref(false)
const currentAddress = ref('')
const errors = reactive({})

// Thêm computed property cho avatar URL
const avatarUrl = computed(() => {
  if (editedInfo.avatarFile) {
    return URL.createObjectURL(editedInfo.avatarFile)
  } else {
    return 'https://s3.cloudfly.vn/thg-storage/uploads-public/' + (editedInfo.avatar || props.user_info.avatar)
  }
})

// Hàm validate dữ liệu
const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  // Validate Họ tên
  if (!editedInfo.fullName || editedInfo.fullName.trim() === '') {
    errors.fullName = 'Họ tên không được để trống'
    isValid = false
  } else if (editedInfo.fullName.length < 2) {
    errors.fullName = 'Họ tên phải có ít nhất 2 ký tự'
    isValid = false
  } else if (editedInfo.fullName.length > 50) {
    errors.fullName = 'Họ tên không được vượt quá 50 ký tự'
    isValid = false
  }

  // Validate Giới tính
  if (editedInfo.gender === undefined || editedInfo.gender === null) {
    errors.gender = 'Vui lòng chọn giới tính'
    isValid = false
  }

  // Validate Số điện thoại
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
  if (!editedInfo.phone || editedInfo.phone.trim() === '') {
    errors.phone = 'Số điện thoại không được để trống'
    isValid = false
  } else if (!phoneRegex.test(editedInfo.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ. Ví dụ: 0912345678'
    isValid = false
  }

  // Validate Avatar (nếu có file mới)
  if (editedInfo.avatarFile) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(editedInfo.avatarFile.type)) {
      errors.avatar = 'Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, GIF)'
      isValid = false
    } else if (editedInfo.avatarFile.size > maxSize) {
      errors.avatar = 'Kích thước file không được vượt quá 5MB'
      isValid = false
    }
  }

  // Validate Địa chỉ
  if (!currentAddress.value || currentAddress.value.trim() === '') {
    errors.province = 'Vui lòng chọn đầy đủ tỉnh/thành phố và phường/xã'
    isValid = false
  } else {
    const parts = currentAddress.value.split(ADDRESS_DELIMITER).map(part => part.trim())

    // Kiểm tra có đủ 3 phần
    if (parts.length < 3) {
      errors.address = 'Vui lòng nhập đầy đủ địa chỉ cụ thể, phường/xã và tỉnh/thành phố'
      isValid = false
    } else {
      const address = parts[0] || ''
      const ward = parts[1] || ''
      const province = parts[2] || ''

      // Validate từng phần
      if (!province) {
        errors.province = 'Tỉnh/thành phố không được để trống'
        isValid = false
      }

      if (!ward) {
        errors.ward = 'Phường/xã không được để trống'
        isValid = false
      }

      if (!address || address.trim() === '') {
        errors.address = 'Địa chỉ cụ thể không được để trống'
        isValid = false
      } else if (address.length < 5) {
        errors.address = 'Địa chỉ cụ thể phải có ít nhất 5 ký tự'
        isValid = false
      }
    }
  }

  return isValid
}

// Hàm hiển thị thông báo lỗi
const showErrorAlert = (message) => {
  if (typeof alertSweet2 === 'function') {
    alertSweet2('error', 'Lỗi', message)
  } else {
    // Fallback nếu alertSweet2 không tồn tại
    Swal.fire({
      title: 'Lỗi!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33'
    })
  }
}

// Hàm handleAvatarChange
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    editedInfo.avatarFile = file
  }
}

// Hàm tìm province CODE từ NAME
const findProvinceCode = (provinceName) => {
  if (!provinceName) return ''
  const province = addressData.find(p => p.name === provinceName)
  return province ? province.code : ''
}

// Hàm tìm ward CODE từ NAME và province CODE
const findWardCode = (provinceCode, wardName) => {
  if (!provinceCode || !wardName) return ''
  const selectedProvince = addressData.find((p) => p.code === provinceCode)
  if (!selectedProvince || !selectedProvince.wards) return ''
  const ward = selectedProvince.wards.find(w => w.name === wardName)
  return ward ? ward.code : ''
}

// Khởi tạo dữ liệu chỉnh sửa
const initializeEditedInfo = () => {
  Object.assign(editedInfo, { ...props.user_info })

  // Parse địa chỉ hiện tại từ props.user_info để đưa vào AddressSelect2
  if (props.user_info.province && props.user_info.ward && props.user_info.address) {
    const addressParts = [
      props.user_info.address,
      props.user_info.ward,
      props.user_info.province
    ].filter(Boolean)

    currentAddress.value = addressParts.join(ADDRESS_DELIMITER)
  } else {
    currentAddress.value = ''
  }
}

// Watch cho currentAddress từ AddressSelect2
watch(currentAddress, (newAddress) => {
  if (newAddress) {
    const parts = newAddress.split(ADDRESS_DELIMITER).map(part => part.trim())
    if (parts.length >= 3) {
      editedInfo.address = parts[0] || ''
      editedInfo.ward = parts[1] || ''
      editedInfo.province = parts[2] || ''
    }
  } else {
    editedInfo.address = ''
    editedInfo.ward = ''
    editedInfo.province = ''
  }
})

// Xử lý lưu thông tin
const handleSave = async () => {
  try {
    // Validate form trước khi gửi
    if (!validateForm()) {
      showErrorAlert('Vui lòng kiểm tra lại thông tin đã nhập')
      return
    }

    isLoading.value = true;

    const formData = new FormData();
    formData.append('fullName', editedInfo.fullName);
    formData.append('gender', editedInfo.gender);
    formData.append('phone', editedInfo.phone);

    // Format địa chỉ theo định dạng mong muốn
    const formattedAddress = `${editedInfo.address}${ADDRESS_DELIMITER}${editedInfo.ward}${ADDRESS_DELIMITER}${editedInfo.province}`
    formData.append('address', formattedAddress);

    formData.append('oldAddress', editedInfo.oldAddress);

    if (editedInfo.avatarFile) {
      formData.append('avatar', editedInfo.avatarFile);
    }

    const result = await Swal.fire({
      title: 'Xác nhận lưu thông tin?',
      text: "Bạn có chắc chắn muốn lưu thông tin cá nhân?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#031358',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Lưu',
      cancelButtonText: 'Hủy'
    })

    if (result.isConfirmed) {
      const resp = await api.post("/profile/update", formData);

      await Swal.fire({
        title: 'Thành công!',
        text: 'Thông tin cá nhân đã được cập nhật.',
        icon: 'success',
        confirmButtonColor: '#031358'
      })

      eventBus.emit('update-success')
      showModal.value = false
    }
  } catch (error) {
    Swal.fire({
      title: 'Lỗi!',
      text: error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin.',
      icon: 'error',
      confirmButtonColor: '#d33'
    })
  } finally {
    isLoading.value = false
  }
}

// Xử lý submit form
const handleSubmit = (event) => {
  event.preventDefault()
  handleSave()
}

// Watch cho user_info prop
watch(() => props.user_info, (newInfo) => {
  initializeEditedInfo()
}, { immediate: true, deep: true })

// Watch cho showModal
watch(showModal, (newVal) => {
  if (newVal) {
    initializeEditedInfo()
  }
})

onMounted(() => {
  initializeEditedInfo()
})
</script>

<style scoped>
.personal-info {
  width: 100%;
  height: 100%;

  padding: 20px 0;
}

.info-container {
  width: 95%;
  margin: 0 auto;
}

.info-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 15px;
  width: 100%;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-container {
  width: 80px;
  height: 80px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-info .title {
  font-size: 20px;
  color: #000;
  margin: 0 0 5px 0;
  font-weight: bold;
}

.avatar-info .subtitle {
  font-size: 17px;
  color: #000;
  margin: 0;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #031358;
  font-size: 20px;
}

.text-content .label {
  font-size: 15px;
  color: #000;
  margin: 0 0 5px 0;
}

.text-content .value {
  font-size: 20px;
  font-weight: bold;
  color: #031358;
  margin: 0;
}

/* Địa chỉ container */
.address-container {
  display: flex;
  gap: 30px;
  width: 100%;
}

.address-column {
  display: flex;
  flex-direction: column;
  width: 50%;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.address-header i {
  color: #031358;
  font-size: 18px;
}

.address-title {
  font-size: 18px;
  font-weight: bold;
  color: #031358;
}

.address-content {
  flex: 1;
}

.address-field {
  display: flex;
  margin-bottom: 10px;
}

.field-label {
  font-size: 14px;
  color: #666;
  min-width: 120px;
  font-weight: 500;
}

.field-value {
  font-size: 16px;
  font-weight: bold;
  color: #031358;
  flex: 1;
}

.old-address-text {
  font-size: 16px;
  font-weight: bold;
  color: #031358;
  margin: 0;
  line-height: 1.5;
}

/* Button chỉnh sửa - Canh phải */
.action-section {
  width: 95%;
  margin: 20px auto 0;
  text-align: right;
}

.edit-btn {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #031358;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 5px;
}

.close-btn:hover {
  color: #031358;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #000;
  font-size: 15px;
}

.section-label {
  font-size: 18px !important;
  color: #031358 !important;
  margin-bottom: 15px !important;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;

  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #031358;
  box-shadow: 0 0 0 2px rgba(3, 19, 88, 0.1);
}

.form-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
}

.avatar-upload {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-input {
  flex: 1;
}

/* Address form trong modal */
.address-form-container {
  display: flex;
  gap: 30px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.address-form-column {
  display: flex;
  flex-direction: column;
  width: 50%;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #031358;
  font-size: 16px;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.column-title i {
  color: #031358;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;

}

.save-btn {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;

}

.cancel-btn:hover,
.save-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Error message styles */
.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.error-message::before {
  content: "⚠";
  font-size: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .address-container,
  .address-form-container {
    flex-direction: column;
    gap: 20px;
  }

  .address-column,
  .address-form-column {
    width: 100%;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }

  .action-section {
    text-align: center;
  }

  .address-field {
    flex-direction: column;
    gap: 5px;
  }

  .field-label {
    min-width: auto;
  }
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.fa-spin {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Điều chỉnh style cho AddressSelect trong modal */
.address-form-column .address-select-container {
  margin-bottom: 15px;
}

.address-form-column .address-select-container label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #000;
}

/* GHI ĐÈ CSS CHO ADDRESSSELECTOR2 COMPONENT */
.address-form-column :deep(.address-selector) {
  width: 100%;
  font-family: 'Ubuntu', sans-serif !important;
}

/* Ghi đè layout row */
.address-form-column :deep(.form-row) {
  display: block;
  gap: 15px;
  margin-bottom: 15px;
  width: 100%;
}

.address-form-column :deep(.form-group-half) {
  flex: 1;
  min-width: 0; /* Quan trọng: cho phép thu nhỏ */
}

/* Ghi đè label */
.address-form-column :deep(label) {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #000;
  font-size: 15px !important;
  font-family: 'Ubuntu', sans-serif !important;
  white-space: normal !important; /* Cho phép xuống dòng */
}

/* Ghi đè input và select box */
.address-form-column :deep(.input-box),
.address-form-column :deep(.select-box) {
  width: 100% !important;
  padding: 12px !important;
  border: 1px solid #ddd !important;
  border-radius: 6px !important;
  font-size: 16px !important;
  font-family: 'Ubuntu', sans-serif !important;
  box-sizing: border-box !important;
  background-color: white !important;
  box-shadow: none !important;
  cursor: pointer;
  transition: all 0.3s ease !important;
  min-height: 44px;
  display: flex;
  align-items: center;
}

/* Ghi đè focus states */
.address-form-column :deep(.input-box:focus),
.address-form-column :deep(.select-box:focus),
.address-form-column :deep(.search-enabled:focus) {
  outline: none !important;
  border-color: #031358 !important;
  box-shadow: 0 0 0 2px rgba(3, 19, 88, 0.1) !important;
  background-color: white !important;
}

/* Ghi đè search input */
.address-form-column :deep(.search-enabled) {
  cursor: text !important;
  border-color: #031358 !important;
  background-color: white !important;
}

/* Ghi đè disabled state */
.address-form-column :deep(.select-box.disabled) {
  background-color: #f8f9fa !important;
  color: #6c757d !important;
  cursor: not-allowed !important;
  opacity: 0.7 !important;
}

/* Ghi đè dropdown menu */
.address-form-column :deep(.dropdown-menu-box) {
  position: absolute !important;
  z-index: 1000 !important;
  width: 100% !important;
  background: white !important;
  border: 1px solid #ddd !important;
  border-radius: 6px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  max-height: 200px !important;
  overflow-y: auto !important;
  margin-top: 4px !important;
}

/* Ghi đè dropdown items */
.address-form-column :deep(.dropdown-item) {
  padding: 10px 12px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  font-family: 'Ubuntu', sans-serif !important;
  border-bottom: 1px solid #f0f0f0 !important;
  transition: all 0.2s ease !important;
  white-space: normal !important; /* Cho phép xuống dòng */
  line-height: 1.4;
}

.address-form-column :deep(.dropdown-item:hover) {
  background: #031358 !important;
  color: white !important;
}

.address-form-column :deep(.dropdown-item:last-child) {
  border-bottom: none !important;
}

/* Ghi đè empty state */
.address-form-column :deep(.empty) {
  padding: 12px !important;
  text-align: center !important;
  color: #666 !important;
  font-size: 14px !important;
  font-family: 'Ubuntu', sans-serif !important;
}

/* Ghi đè select wrapper */
.address-form-column :deep(.select-wrapper) {
  position: relative !important;
  width: 100% !important;
}

/* ERROR STATES - Đồng bộ với validation cha */
.address-form-column :deep(.input-box.error),
.address-form-column :deep(.select-box.error) {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1) !important;
}

/* Ghi đè cho street input */
.address-form-column :deep(.mt-3) {
  margin-top: 15px !important;
  width: 100%;
}

/* Đảm bảo container không bị overflow */
.address-form-column :deep(.address-selector) {
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .address-form-column :deep(.form-row) {
    flex-direction: column !important;
    gap: 12px !important;
  }

  .address-form-column :deep(.form-group-half) {
    width: 100% !important;
    min-width: 100% !important;
  }

  .address-form-column :deep(.input-box),
  .address-form-column :deep(.select-box) {
    font-size: 14px !important;
    padding: 10px !important;
    min-height: 42px;
  }

  .address-form-column :deep(label) {
    font-size: 14px !important;
  }

  .address-form-column :deep(.dropdown-menu-box) {
    max-height: 180px !important;
  }

  .address-form-column :deep(.dropdown-item) {
    padding: 8px 10px !important;
    font-size: 13px !important;
  }
}

/* Custom scrollbar cho dropdown */
.address-form-column :deep(.dropdown-menu-box) {
  scrollbar-width: thin;
  scrollbar-color: #031358 #f1f1f1;
}

.address-form-column :deep(.dropdown-menu-box::-webkit-scrollbar) {
  width: 6px;
}

.address-form-column :deep(.dropdown-menu-box::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

.address-form-column :deep(.dropdown-menu-box::-webkit-scrollbar-thumb) {
  background: #031358;
  border-radius: 3px;
}

.address-form-column :deep(.dropdown-menu-box::-webkit-scrollbar-thumb:hover) {
  background: #0020CC;
}

/* Placeholder styling */
.address-form-column :deep(.input-box::placeholder),
.address-form-column :deep(.select-box::placeholder) {
  color: #999 !important;
  font-size: 14px !important;
  font-family: 'Ubuntu', sans-serif !important;
}

/* Text ellipsis cho selected values */
.address-form-column :deep(.select-box:not(.search-enabled)) {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

/* Hover states */
.address-form-column :deep(.select-box:not(.disabled):hover) {
  border-color: #031358 !important;
  background-color: #f8f9fa !important;
}

/* Focus-visible for accessibility */
.address-form-column :deep(.input-box:focus-visible),
.address-form-column :deep(.select-box:focus-visible) {
  outline: 2px solid #031358 !important;
  outline-offset: 2px !important;
}

/* Loading state (nếu có) */
.address-form-column :deep(.loading) {
  opacity: 0.7;
  pointer-events: none;
  position: relative;
}

.address-form-column :deep(.loading::after) {
  content: "";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #031358;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: translateY(-50%) rotate(0deg); }
  100% { transform: translateY(-50%) rotate(360deg); }
}
</style>