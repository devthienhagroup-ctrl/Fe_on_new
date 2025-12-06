<template>
  <div class="personal-info">
    <!-- Thông tin cá nhân -->
    <div class="info-container">
      <!-- Ảnh hồ sơ -->
      <div class="info-item">
        <div class="avatar-section">
          <div class="avatar-container">
            <img
                :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'+user_info.avatar || '/default-avatar.png'"
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
              <p class="old-address-text">{{ user_info.oldAddress }}</p>
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
            </div>

            <!-- Các trường thông tin -->
            <div class="form-group">
              <label>Họ tên</label>
              <input
                  type="text"
                  v-model="editedInfo.fullName"
                  class="form-input"
              />
            </div>

            <div class="form-group">
              <label>Giới tính</label>
              <select v-model="editedInfo.gender" class="form-input">
                <option :value="true">Nam</option>
                <option :value="false">Nữ</option>
              </select>
            </div>

            <div class="form-group">
              <label>Số điện thoại</label>
              <input
                  type="tel"
                  v-model="editedInfo.phone"
                  class="form-input"
              />
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
                  <AddressSelector2
                      v-model="currentAddress"
                  />

                  <div class="form-group">
                    <label>Địa chỉ cụ thể</label>
                    <textarea
                        v-model="editedInfo.address"
                        class="form-input"
                        rows="3"
                        placeholder="Nhập địa chỉ cụ thể..."
                    ></textarea>
                  </div>
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
import AddressSelector2 from "../../../land/my-valuation/components/AddressSelector2.vue";
import api from "../../../../api/api.js";
import {eventBus} from "../../../../assets/js/event-bus.js";

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

// Thêm computed property cho avatar URL
const avatarUrl = computed(() => {
  if (editedInfo.avatarFile) {
    return URL.createObjectURL(editedInfo.avatarFile)
  } else {
    return ' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + (editedInfo.avatar || props.user_info.avatar)
  }
})

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

    currentAddress.value = addressParts.join('/')
  } else {
    currentAddress.value = ''
  }
}

// Watch cho currentAddress từ AddressSelect2
watch(currentAddress, (newAddress) => {
  if (newAddress) {
    const parts = newAddress.split('/')
    if (parts.length >= 3) {
      editedInfo.address = parts[0] || ''
      editedInfo.ward = parts[1] || ''
      editedInfo.province = parts[2] || ''
    }
  } else {
    editedInfo.address = ''
    editedInfo.ward = ''
    editedInfo.province = ''
    // Nếu không, dùng ảnh từ server
    return 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + (editedInfo.avatar || props.user_info.avatar)
  }
})

// Xử lý lưu thông tin
const handleSave = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();
    formData.append('fullName', editedInfo.fullName);
    formData.append('gender', editedInfo.gender);
    formData.append('phone', editedInfo.phone);

    // Format địa chỉ theo định dạng mong muốn
    const formattedAddress = `${editedInfo.address}/${editedInfo.ward}/${editedInfo.province}`
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
  font-family: 'Ubuntu', sans-serif;
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
  font-family: 'Ubuntu', sans-serif;
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
  font-family: 'Ubuntu', sans-serif;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #031358;
  box-shadow: 0 0 0 2px rgba(3, 19, 88, 0.1);
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
  font-family: 'Ubuntu', sans-serif;
}

.save-btn {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Ubuntu', sans-serif;
}

.cancel-btn:hover,
.save-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
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

/* Thêm vào phần style hiện có */
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
</style>