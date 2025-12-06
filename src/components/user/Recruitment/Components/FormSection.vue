<template>
  <div class="recruitment-container">
    <div class="recruitment-wrapper">
      <!-- Phần hình ảnh công ty -->
      <div class="company-section">
        <div class="section-title fade-left">
          <h2>HÌNH ẢNH CÔNG TY</h2>
        </div>

        <div class="main-image-container fade-left">
          <img
              :src="getImageUrl(currentImage)"
              :alt="'Company image ' + currentImage"
              class="main-image"
          />
          <button class="nav-btn prev-btn" @click="prevImage">‹</button>
          <button class="nav-btn next-btn" @click="nextImage">›</button>
        </div>

        <div class="image-queue fade-up">
          <div
              v-for="(img, index) in queueImages"
              :key="img"
              class="queue-image-container"
              @click="selectImage(img)"
          >
            <img
                :src="getImageUrl(img)"
                :alt="'Company image ' + img"
                class="queue-image"
            />
          </div>
          <div class="logo-container">
            <img
                src="/imgs/logoTHG.png"
                alt="Company logo"
                class="company-logo"
            />
          </div>
        </div>
      </div>

      <!-- Phần form ứng tuyển -->
      <div class="form-section fade-right">
        <div class="application-form">
          <h2 class="form-title">ĐĂNG KÝ ỨNG TUYỂN</h2>

          <form @submit.prevent="submitForm">
            <div class="form-group">
              <input
                  type="text"
                  id="fullName"
                  v-model="formData.fullName"
                  required
              />
              <label for="fullName">Họ và tên</label>
            </div>

            <div class="form-group">
              <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  required
              />
              <label for="phone">Số điện thoại</label>
            </div>

            <div class="form-group">
              <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  required
              />
              <label for="email">Email</label>
            </div>

            <div class="form-group file-group">
              <label for="cv" class="file-label">CV</label>
              <input
                  type="file"
                  id="cv"
                  @change="handleFileUpload"
                  accept=".pdf,.doc,.docx"
                  required
              />
              <span class="file-name">{{ formData.cv ? formData.cv.name : 'Chọn file' }}</span>
            </div>

            <div class="form-group select-group">
              <select id="position" v-model="formData.position" required>
                <option value="" disabled selected></option>
                <option value="frontend">Nhân viên telesale</option>
                <option value="backend">Nhân viên văn phòng</option>
                <option value="fullstack">Chuyên viên tư vấn</option>
                <option value="designer">Chuyên viên định giá BĐS</option>
                <option value="designer">Nhân viên khảo sát thị trường</option>
                <option value="designer">Môi giới bất động sản</option>
                <option value="designer">Cộng tác viên THG</option>

              </select>
              <label for="position">Vị trí ứng tuyển</label>
            </div>

            <div class="form-group textarea-group">
              <textarea
                  id="coverLetter"
                  v-model="formData.coverLetter"
                  rows="4"
                  required
              ></textarea>
              <label for="coverLetter">Thư ứng tuyển (Cover letter)</label>
            </div>

            <button type="submit" class="submit-btn">ỨNG TUYỂN</button>
          </form>
        </div>

        <div class="recruitment-message">
          <p>Nơi đây không chỉ có Job, mà còn có cơ hội để bạn tỏa sáng. Bạn sẵn sàng tham gia cùng chúng tôi chưa?</p>
          <img src="/imgs/helping-a-partner-animate.svg" alt="Recruitment illustration" class="recruitment-illustration" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// State cho hình ảnh
const currentImage = ref('hd1.jpg')
const allImages = ref(['hd1.jpg', 'hd2.jpg', 'hd3.jpg', 'hd4.jpg', 'hd5.jpg', 'hd6.jpg', 'hd7.jpg', 'hd8.jpg'])

// State cho form
const formData = reactive({
  fullName: '',
  phone: '',
  email: '',
  cv: null,
  position: '',
  coverLetter: ''
})

// Computed property để lấy 2 ảnh tiếp theo trong hàng đợi
const queueImages = computed(() => {
  const currentIndex = allImages.value.indexOf(currentImage.value)
  const nextImages = []

  for (let i = 1; i <= 2; i++) {
    const nextIndex = (currentIndex + i) % allImages.value.length
    nextImages.push(allImages.value[nextIndex])
  }

  return nextImages
})

// Hàm lấy đường dẫn ảnh
const getImageUrl = (imageName) => {
  return `/imgs/${imageName}`
}

// Hàm chuyển đến ảnh tiếp theo
const nextImage = () => {
  const currentIndex = allImages.value.indexOf(currentImage.value)
  const nextIndex = (currentIndex + 1) % allImages.value.length
  currentImage.value = allImages.value[nextIndex]
}

// Hàm quay lại ảnh trước
const prevImage = () => {
  const currentIndex = allImages.value.indexOf(currentImage.value)
  const prevIndex = (currentIndex - 1 + allImages.value.length) % allImages.value.length
  currentImage.value = allImages.value[prevIndex]
}

// Hàm chọn ảnh từ hàng đợi
const selectImage = (imageName) => {
  currentImage.value = imageName
}

// Hàm xử lý upload file
const handleFileUpload = (event) => {
  formData.cv = event.target.files[0]
}

// Hàm submit form
const submitForm = () => {
  console.log('Form data:', formData)
  // Xử lý submit form ở đây
  alert('Đã gửi đơn ứng tuyển thành công!')

  // Reset form
  Object.assign(formData, {
    fullName: '',
    phone: '',
    email: '',
    cv: null,
    position: '',
    coverLetter: ''
  })
}

// Khởi tạo component
onMounted(() => {
  // Có thể thêm các tác vụ khởi tạo ở đây nếu cần
})
</script>

<style scoped>
.recruitment-container {
  background: linear-gradient(to bottom, #031358, #0030FF);
  border-radius: 50% 50% 0 0/100px 100px 0 0;
  padding: 60px 0px;
  padding-top: 150px;
  font-family: 'Ubuntu', sans-serif;
}

.recruitment-wrapper {
  max-width: 1400px;
  padding: 0 20px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

/* Phần hình ảnh công ty */
.company-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  justify-content: space-between;
}

.section-title {
  border-radius: 15px;
  padding: 20px;
  text-align: center;
}

.section-title h2 {
  font-size: 40px;
  color: white;
  margin: 0;
  font-weight: 600;
}

.main-image-container {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.main-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  display: block;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.prev-btn {
  left: 15px;
}

.next-btn {
  right: 15px;
}

.image-queue {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
}

.queue-image-container {
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.queue-image-container:hover {
  transform: translateY(-5px);
}

.queue-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
}

.logo-container {
  background: transparent;
  border: 2px solid white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.logo-container:hover {
  transform: translateY(-5px);
}

.company-logo {
  max-width: 80%;
  max-height: 80%;
  filter: brightness(0) invert(1); /* Chuyển logo thành màu trắng */
}

/* Phần form ứng tuyển */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.application-form, .recruitment-message {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 40px;
  color: #0030FF;
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
  font-weight: 600;
}

.form-group {
  position: relative;
  margin-bottom: 30px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid #ddd;
  background: transparent;
  font-size: 16px;
  font-family: 'Ubuntu', sans-serif;
  transition: all 0.3s ease;
  outline: none;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-bottom-color: #0030FF;
}

.form-group label {
  position: absolute;
  top: 10px;
  left: 0;
  font-size: 16px;
  color: #999;
  pointer-events: none;
  transition: all 0.3s ease;
}

.form-group input:focus ~ label,
.form-group input:valid ~ label,
.form-group select:focus ~ label,
.form-group select:valid ~ label,
.form-group textarea:focus ~ label,
.form-group textarea:valid ~ label {
  top: -20px;
  font-size: 14px;
  color: #0030FF;
}

/* Style cho input file */
.file-group {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 2px solid #ddd;
  transition: all 0.3s ease;
}

.file-group:focus-within {
  border-bottom-color: #0030FF;
}

.file-label {
  position: static !important;
  color: #999;
  font-size: 16px;
  pointer-events: auto;
  transition: all 0.3s ease;
}

.file-group:focus-within .file-label {
  color: #0030FF;
}

.file-group input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-name {
  flex: 1;
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.textarea-group textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  background: linear-gradient(to right, #031358, #0030FF);
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 50px;
  font-size: 18px;
  font-family: 'Ubuntu', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  width: 100%;
  box-shadow: 0 5px 15px rgba(0, 48, 255, 0.3);
  font-weight: 600;
  letter-spacing: 1px;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 48, 255, 0.4);
}

.submit-btn:active {
  transform: translateY(1px);
  box-shadow: 0 3px 10px rgba(0, 48, 255, 0.3);
}

.recruitment-message {
  position: relative;
  padding-right: 250px;
  text-align: justify;
}

.recruitment-message img {
  position: absolute;
  transform: scaleX(-1);
  bottom: 0;
  right: 0;
  width: 250px;
}



.recruitment-message p {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.5;
}

.recruitment-illustration {
  max-width: 100%;
  height: auto;
}

/* Responsive */
@media (max-width: 1200px) {
  .recruitment-wrapper {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .main-image {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .recruitment-container {
    padding: 40px 15px;
    border-radius: 0 0 30% 30% / 0 0 50px 50px;
  }

  .section-title h2, .form-title {
    font-size: 32px;
  }

  .main-image {
    height: 300px;
  }

  .image-queue {
    grid-template-columns: 1fr 1fr;
  }

  .logo-container {
    grid-column: span 2;
    margin-top: 10px;
  }

  .application-form, .recruitment-message {
    padding: 20px;
  }

  .recruitment-message img {
    display: block;
    margin: 0 auto;
    position: static;
  }
}

@media (max-width: 480px) {
  .section-title h2, .form-title {
    font-size: 28px;
  }

  .main-image {
    height: 250px;
  }

  .queue-image {
    height: 120px;
  }

  .recruitment-message p {
    font-size: 18px;
  }

  .company-section {
    padding: 15px;
  }
}
</style>