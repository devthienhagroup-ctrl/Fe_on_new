<template>
  <div class="job-detail-page">
    <div class="container">
      <!-- Tiêu đề -->
      <h1 class="page-title">ỨNG TUYỂN CỘNG TÁC VIÊN THIÊN HÀ GROUP</h1>

      <div class="main-content">
        <!-- Cột trái -->
        <div class="left-column">
          <!-- Ảnh lớn -->
          <div class="main-image">
            <img :src="resolveImage(jobData.image)" :alt="jobData.title" />
          </div>

          <!-- Thông tin công việc -->
          <div class="job-info-grid">
            <div class="info-item" v-for="item in jobInfoItems" :key="item.title">
              <div class="info-icon">
                <i v-if="item.iconClass" :class="item.iconClass"></i>
                <img v-else :src="item.icon" :alt="item.title" />
              </div>
              <div class="info-content">
                <div class="info-title">{{ item.title }}</div>
                <div class="info-value">{{ item.value }}</div>
              </div>
            </div>
          </div>

          <!-- Mô tả công việc -->
          <div class="job-description" v-html="jobDescription"></div>
        </div>

        <!-- Cột phải -->
        <div class="right-column">
          <!-- Ô trên - Đăng ký -->
          <div class="register-card">
            <h3 class="register-title">Bắt đầu hành trình cùng Thiên Hà Group</h3>
            <button class="register-btn" @click="openApplyModal">Ứng tuyển ngay</button>
            <div class="register-image">
              <img src="/imgs/Click here-pana.svg" alt="Click here" />
            </div>
          </div>

          <!-- Ô dưới - Thông tin -->
          <div class="info-card">
            <!-- Logo -->
            <div class="logo-section">
              <img src="/imgs/logoTHG.png" alt="Thiên Hà Group" class="company-logo" />
            </div>

            <!-- Liên kết nhanh -->
            <div class="quick-links">
              <QuickLink
                  v-for="link in quickLinks"
                  :key="link.title"
                  :title="link.title"
                  :items="link.items"
                  :type="link.type"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Nút quay lại -->
      <router-link to="/cong-viec-cong-tac-vien" class="back-btn">
        Quay lại
      </router-link>
    </div>

    <div v-if="showApplyModal" class="job-modal">
      <div class="modal-overlay" @click="closeApplyModal"></div>
      <div class="modal-card modal-apply">
        <button class="modal-close" @click="closeApplyModal">
          <i class="fa-solid fa-times"></i>
        </button>
        <div class="modal-body">
          <h3 class="modal-title">Ứng tuyển công việc</h3>
          <p class="modal-subtitle">{{ jobData.title }}</p>

          <div class="file-upload">
            <label class="file-label" for="cv-upload-detail">
              <i class="fa-solid fa-upload"></i>
              <span>Upload CV (tối đa 1 file)</span>
            </label>
            <input
                id="cv-upload-detail"
                type="file"
                accept=".pdf,.doc,.docx"
                @change="handleFileChange"
            >
            <p v-if="selectedFile" class="file-name">Đã chọn: {{ selectedFile.name }}</p>
          </div>

          <div class="modal-actions">
            <button class="btn-register" :disabled="!selectedFile || isSubmitting" @click="submitApplication">
              <i class="fa-solid fa-paper-plane"></i> Gửi ứng tuyển
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Swal from "sweetalert2";
import api from "../../../../api/api.js";
import addressData from '/src/assets/js/address.json';
import QuickLink from './QuickLink.vue'

const route = useRoute()
const logoTHG = '/imgs/logoTHG.png'
const ASSET_BASE_URL = 'https://s3.cloudfly.vn/thg-storage/uploads-public/'

const jobData = ref({})
const showApplyModal = ref(false)
const selectedFile = ref(null)
const isSubmitting = ref(false)

const resolveImage = (image) => {
  if (!image) return logoTHG
  if (image.startsWith('http') || image.startsWith('/')) return image
  return `${ASSET_BASE_URL}${image}`
}

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Chưa cập nhật'
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

const formatSalary = (salary) => {
  if (!salary) return 'Chưa cập nhật'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(salary)
}

const parseAddressFromJson = (addressValue) => {
  if (!addressValue) return ''
  if (typeof addressValue === 'string') {
    if (addressValue.includes('|')) {
      const [provinceCode, wardCode, streetDetail] = addressValue.split('|').map((item) => item.trim())
      const province = addressData.find((item) => `${item.code}` === provinceCode)
      const ward = province?.wards?.find((item) => `${item.code}` === wardCode)
      return [streetDetail, ward?.name, province?.name].filter(Boolean).join(', ')
    }

    try {
      const parsed = JSON.parse(addressValue)
      return parseAddressFromJson(parsed)
    } catch (error) {
      return addressValue
    }
  }

  if (typeof addressValue === 'object') {
    const province =
        addressData.find((item) => item.code === addressValue.provinceCode || item.name === addressValue.province) ||
        null
    const ward =
        province?.wards?.find((item) => item.code === addressValue.wardCode || item.name === addressValue.ward) || null
    return [addressValue.street, ward?.name, province?.name].filter(Boolean).join(', ')
  }

  return ''
}

const jobAddress = computed(() => {
  const addressValue = jobData.value?.address || jobData.value?.location || ''
  const parsed = parseAddressFromJson(addressValue)
  return parsed || addressValue || 'Chưa cập nhật'
})

const jobDescription = computed(() => {
  return jobData.value?.description || jobData.value?.jobDescription || ''
})

const jobInfoItems = computed(() => [
  {
    title: 'Địa chỉ',
    value: jobAddress.value,
    iconClass: 'fas fa-map-marker-alt'
  },
  {
    title: 'Mức lương',
    value: formatSalary(jobData.value?.salary),
    iconClass: 'fas fa-money-bill-wave'
  },
  {
    title: 'Hạn ứng tuyển',
    value: formatDate(jobData.value?.endDate || jobData.value?.deadline),
    iconClass: 'fas fa-calendar-alt'
  },
  {
    title: 'Ứng viên',
    value: jobData.value?.applicants ? `${jobData.value.applicants} người` : 'Chưa cập nhật',
    iconClass: 'fas fa-users'
  }
])

const quickLinks = ref([
  {
    title: 'Về Thiên Hà Group',
    type: 'router',
    items: [
      { title: 'Trang chủ', link: '/' }
    ]
  },
  {
    title: 'Thông tin liên hệ',
    type: 'action',
    items: [
      {
        title: 'Email: thienhagroup@gmail.com',
        action: 'copy',
        value: 'thienhagroup@gmail.com'
      },
      {
        title: 'Hotline: 091.123.1882',
        action: 'copy',
        value: '0911231882'
      },
      {
        title: 'Fanpage',
        action: 'external',
        link: 'https://www.facebook.com/profile.php?id=61557872978828'
      }
    ]
  },
  {
    title: 'Các vị trí tuyển dụng khác',
    type: 'router',
    items: [
      { title: 'Tuyển dụng', link: '/tuyen-dung' }
    ]
  },
  {
    title: 'Các câu hỏi thường gặp',
    type: 'faq',
    items: [
      { title: 'Làm thế nào để trở thành CTV?' },
      { title: 'Thu nhập trung bình của CTV là bao nhiêu?' },
      { title: 'Có cần kinh nghiệm không?' },
      { title: 'Thời gian làm việc linh hoạt thế nào?' },
      { title: 'Có được training không?' }
    ]
  },
  {
    title: 'Tin tức về Thiên Hà Group',
    type: 'router',
    items: [
      { title: 'Tin tức', link: '/tin-tuc' }
    ]
  }
])

const fetchJobDetail = async () => {
  if (!route.params.id) return
  try {
    const res = await api.get(`/admin.thg/project/work/view_detail/${route.params.id}`, {
      withCredentials: true,
    })
    jobData.value = res.data || {}
  } catch (error) {
    console.error('Error fetching work item detail:', error)
    Swal.fire('Lỗi', 'Không thể tải chi tiết công việc. Vui lòng thử lại sau.', 'error')
  }
}

const openApplyModal = () => {
  showApplyModal.value = true
  selectedFile.value = null
}

const closeApplyModal = () => {
  showApplyModal.value = false
  selectedFile.value = null
  isSubmitting.value = false
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  selectedFile.value = file || null
}

const submitApplication = async () => {
  if (!route.params.id || !selectedFile.value || isSubmitting.value) return
  isSubmitting.value = true
  try {
    const formData = new FormData()
    formData.append('cv', selectedFile.value)

    await api.post(`/thg/public/work-items/${route.params.id}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    Swal.fire('Thành công', 'Ứng tuyển thành công!', 'success')
    closeApplyModal()
  } catch (error) {
    console.error('Error submitting application:', error)
    Swal.fire('Lỗi', 'Không thể gửi ứng tuyển. Vui lòng thử lại sau.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => route.params.id,
  () => {
    fetchJobDetail()
  }
)

onMounted(() => {
  fetchJobDetail()
})
</script>

<style scoped>
.job-detail-page {
  font-family: 'Ubuntu', sans-serif;
  margin: 0 auto 20px;
  padding-top: 80px;
  background-color: #f8f9fa;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  font-size: 40px;
  color: #031358;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
}

.main-content {
  display: grid;
  grid-template-columns: 8fr 4fr;
  gap: 30px;
  margin-bottom: 30px;
}

/* Cột trái */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: auto;
  display: block;
}

.job-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.info-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.info-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #031358;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon i {
  font-size: 24px;
  color: white;
}

.info-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-content {
  flex: 1;
}

.info-title {
  font-size: 15px;
  color: #000;
  text-align: left;
  margin-bottom: 5px;
}

.info-value {
  font-size: 17px;
  color: #000;
  font-weight: 700;
}

.job-description {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.job-description :deep(h3) {
  color: #031358;
  margin: 20px 0 15px 0;
  font-size: 20px;
}

.job-description :deep(ul) {
  padding-left: 20px;
}

.job-description :deep(li) {
  margin-bottom: 8px;
  line-height: 1.6;
}

/* Cột phải */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  position: relative;
  padding-bottom: 120px;
}

.register-title {
  font-size: 33px;
  color: #000;
  margin-bottom: 25px;
  font-weight: 700;
  line-height: 1.3;
}

.register-btn {
  background: linear-gradient(90deg, #031358, #0030FF, #031358);
  background-size: 200% 100%;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  animation: gradientMove 3s linear infinite;
  margin-bottom: 20px;
  transition: transform 0.2s;
  width: 70%;
}

.register-btn:hover {
  transform: translateY(-2px);
}

@keyframes gradientMove {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.register-image {
  margin-top: 15px;
  position: absolute;
  width: 60%;
  right: 0;
  bottom: -50px;
  pointer-events: none;
}

.register-image img {
  width: 100%;
  height: auto;
  pointer-events: none;
}

.info-card {
  background: rgba(204, 214, 255, 0.2);
  border-radius: 12px;
  padding: 25px;
}

.logo-section {
  text-align: center;
  margin-bottom: 25px;
}

.company-logo {
  width: 50%;
  margin: 0 auto;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.back-btn {
  display: block;
  width: 100%;
  background: #031358;
  color: white;
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #002244;
}

.job-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.job-modal .modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.job-modal .modal-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: min(700px, 92vw);
  max-height: 90vh;
  overflow-y: auto;
  z-index: 2;
}

.job-modal .modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-apply .file-upload {
  margin-top: 20px;
  border: 1px dashed #cfd4da;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.modal-apply .file-label {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #031358;
  font-weight: 600;
}

.modal-apply input[type="file"] {
  display: none;
}

.modal-apply .file-name {
  margin-top: 10px;
  font-size: 13px;
  color: #6c757d;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .job-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .register-image {
    width: auto;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .job-info-grid {
    grid-template-columns: 1fr;
  }

  .register-title {
    font-size: 28px;
  }
  .register-image {
    width: 40%;
  }
}

@media (max-width: 492px) {
  .register-image {
    bottom: -30px;
  }
  
}
</style>
