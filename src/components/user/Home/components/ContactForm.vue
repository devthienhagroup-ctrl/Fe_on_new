<template>
  <section class="form-section">
    <h2 class="slogan">{{ slogan }}</h2>
    <div class="container">
      <!-- Phần lý do chọn Thiên Hà Group -->
      <div class="reasons-container">
        <h2 class="reasons-title">Tại sao chọn Thiên Hà Group?</h2>
        <div class="reasons-list">
          <div
              v-for="(reason, index) in reasons"
              :key="index"
              class="reason-item"
              @mouseenter="activeReason = index"
              @mouseleave="activeReason = null"
          >
            <div class="reason-icon">
              <i :class="reason.icon"></i>
            </div>
            <div class="reason-content">
              <h3 class="reason-title">{{ reason.title }}</h3>
              <div class="reason-tooltip" :class="{ 'active': activeReason === index }">
                <p>{{ reason.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form liên hệ hiện có -->
      <div class="form-content">

        <div class="form-container">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <!-- Họ và tên -->
            <div class="form-group">
              <div class="input-wrapper">
                <input
                    v-model="formData.fullName"
                    type="text"
                    id="fullName"
                    class="form-input"
                    :class="{ 'error': errors.fullName }"
                    @focus="handleFocus($event, 'fullName')"
                    @blur="handleBlur($event, 'fullName')"
                >
                <label for="fullName" class="form-label" :class="{ 'focused': isFocused.fullName || formData.fullName }">Họ và tên</label>
              </div>
              <span v-if="errors.fullName" class="error-message">{{ errors.fullName }}</span>
            </div>

            <!-- Số điện thoại -->
            <div class="form-group">
              <div class="input-wrapper">
                <input
                    v-model="formData.phone"
                    type="tel"
                    id="phone"
                    class="form-input"
                    :class="{ 'error': errors.phone }"
                    @focus="handleFocus($event, 'phone')"
                    @blur="handleBlur($event, 'phone')"
                >
                <label for="phone" class="form-label" :class="{ 'focused': isFocused.phone || formData.phone }">Số điện thoại</label>
              </div>
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>

            <!-- Nhu cầu -->
            <div class="form-group">
              <div class="select-wrapper">
                <select
                    v-model="formData.need"
                    id="need"
                    class="form-select"
                    :class="{ 'error': errors.need, 'has-value': formData.need }"
                    @focus="isSelectOpen = true; handleFocus($event, 'need')"
                    @blur="isSelectOpen = false; handleBlur($event, 'need')"
                    @change="handleSelectChange"
                >
                  <option value="Mua">Mua</option>
                  <option value="Bán gấp">Bán gấp</option>
                  <option value="Bán giá mong muốn">Bán giá mong muốn</option>
                </select>
                <label for="need" class="form-label select-label" :class="{ 'focused': isFocused.need || formData.need }">Nhu cầu</label>
                <span class="dropdown-arrow" :class="{ 'rotated': isSelectOpen }">▼</span>
              </div>
              <span v-if="errors.need" class="error-message">{{ errors.need }}</span>
            </div>

            <!-- Giá bán -->
            <div class="form-group">
              <div class="input-wrapper">
                <input
                    v-model="formData.price"
                    type="number"
                    id="price"
                    class="form-input"
                    :class="{ 'error': errors.price }"
                    @focus="handleFocus($event, 'price')"
                    @blur="handleBlur($event, 'price')"
                >
                <label for="price" class="form-label" :class="{ 'focused': isFocused.price || formData.price }">Giá bán (VNĐ)</label>
              </div>
              <span v-if="errors.price" class="error-message">{{ errors.price }}</span>
            </div>

            <!-- Khu vực -->
            <div class="form-group">
              <div class="input-wrapper">
                <input
                    v-model="formData.area"
                    type="text"
                    id="area"
                    class="form-input"
                    :class="{ 'error': errors.area }"
                    @focus="handleFocus($event, 'area')"
                    @blur="handleBlur($event, 'area')"
                >
                <label for="area" class="form-label" :class="{ 'focused': isFocused.area || formData.area }">Khu vực</label>
              </div>
              <span v-if="errors.area" class="error-message">{{ errors.area }}</span>
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                class="submit-btn"
                :class="{ 'clicked': isButtonClicked }"
                @mousedown="isButtonClicked = true"
                @mouseup="isButtonClicked = false"
                @mouseleave="isButtonClicked = false"
            >
              Gửi thông tin
            </button>

            <!-- Success Message -->
            <div v-if="isSubmitted" class="success-message">
              Gửi thông tin thành công!
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive } from 'vue'

const slogan = 'Kết nối hợp tác – Cùng kiến tạo giá trị bất động sản bền vững'

const formData = reactive({
  fullName: '',
  phone: '',
  need: '',
  price: '',
  area: ''
})

const errors = reactive({
  fullName: '',
  phone: '',
  need: '',
  price: '',
  area: ''
})

const isFocused = reactive({
  fullName: false,
  phone: false,
  need: false,
  price: false,
  area: false
})

const isSelectOpen = ref(false)
const isButtonClicked = ref(false)
const isSubmitted = ref(false)
const activeReason = ref(null)

const reasons = ref([
  {
    title: 'Bán nhanh trong 30 ngày',
    icon: 'fas fa-bolt',
    description: 'Với hệ thống tiếp cận khách hàng rộng khắp và chiến lược marketing hiệu quả, chúng tôi cam kết giúp bạn bán được bất động sản trong vòng 30 ngày.'
  },
  {
    title: 'Định giá chính xác & kiểm tra quy hoạch minh bạch',
    icon: 'fas fa-chart-line',
    description: 'Đội ngũ chuyên gia của chúng tôi phân tích thị trường sâu rộng để định giá chính xác và cung cấp thông tin quy hoạch minh bạch, đảm bảo quyền lợi tốt nhất cho khách hàng.'
  },
  {
    title: 'Gói dịch vụ ký gửi – Marketing toàn diện',
    icon: 'fas fa-rocket',
    description: 'Dịch vụ ký gửi chuyên nghiệp kết hợp chiến lược marketing toàn diện trên đa nền tảng, giúp tài sản của bạn tiếp cận đúng đối tượng khách hàng tiềm năng.'
  },
  {
    title: 'Đội ngũ chuyên môn & kinh nghiệm thực tế',
    icon: 'fas fa-users',
    description: 'Đội ngũ nhân viên giàu kinh nghiệm, am hiểu thị trường bất động sản, được đào tạo bài bản và luôn sẵn sàng hỗ trợ khách hàng 24/7.'
  },
  {
    title: 'Minh bạch pháp lý & uy tín thương hiệu',
    icon: 'fas fa-shield-alt',
    description: 'Cam kết minh bạch mọi thủ tục pháp lý, đảm bảo an toàn trong giao dịch. Uy tín thương hiệu được xây dựng qua hàng ngàn giao dịch thành công.'
  },
  {
    title: 'Hệ thống portal dành cho đối tác & khách hàng',
    icon: 'fas fa-desktop',
    description: 'Cung cấp hệ thống portal hiện đại, giúp đối tác và khách hàng dễ dàng theo dõi tiến độ giao dịch, quản lý thông tin và kết nối mọi lúc, mọi nơi.'
  },
  {
    title: 'Dịch vụ truyền thông & xây dựng thương hiệu bất động sản',
    icon: 'fas fa-bullhorn',
    description: 'Đội ngũ truyền thông chuyên nghiệp giúp xây dựng và quảng bá thương hiệu bất động sản cá nhân, tăng giá trị và khả năng tiếp cận thị trường.'
  },
  {
    title: 'Hỗ trợ tài chính & tư vấn đầu tư',
    icon: 'fas fa-hand-holding-usd',
    description: 'Cung cấp giải pháp tài chính linh hoạt và tư vấn đầu tư chiến lược, giúp khách hàng tối ưu hóa lợi nhuận và quản lý rủi ro hiệu quả.'
  }
])

const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  // Full name validation
  if (!formData.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên'
    isValid = false
  }

  // Phone validation
  if (!formData.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại'
    isValid = false
  } else if (!/^\d{10}$/.test(formData.phone)) {
    errors.phone = 'Số điện thoại phải có 10 chữ số'
    isValid = false
  }

  // Need validation
  if (!formData.need) {
    errors.need = 'Vui lòng chọn nhu cầu'
    isValid = false
  }

  // Price validation
  if (!formData.price) {
    errors.price = 'Vui lòng nhập giá bán'
    isValid = false
  } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
    errors.price = 'Giá bán phải là số hợp lệ'
    isValid = false
  }

  // Area validation
  if (!formData.area.trim()) {
    errors.area = 'Vui lòng nhập khu vực'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    // Simulate form submission
    isSubmitted.value = true
    setTimeout(() => {
      isSubmitted.value = false
      // Reset form
      Object.keys(formData).forEach(key => formData[key] = '')
      Object.keys(isFocused).forEach(key => isFocused[key] = false)
    }, 3000)
  }
}

const handleFocus = (event, fieldName) => {
  isFocused[fieldName] = true
}

const handleBlur = (event, fieldName) => {
  isFocused[fieldName] = false
}

const handleSelectChange = () => {
  isSelectOpen.value = false
}
</script>

<style scoped>

.form-section {
  min-height: 100vh;
  background: linear-gradient(45deg, #031358, #0629BE);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-top-left-radius: 50% 20%;
  border-top-right-radius: 50% 20%;
  position: relative;
  font-family: 'Ubuntu', sans-serif;
}

.container {
  display: flex;
  max-width: 1400px;
  width: 100%;
  gap: 1rem;
  align-items: flex-start;
  margin-top: 200px;
}

.reasons-container {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  min-height: 600px;
}

.reasons-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.reasons-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reason-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  font-size: 17px;
}

.reason-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.reason-icon {
  font-size: 17px;
  color: #FFD700;
  width: 30px;
  display: flex;
  justify-content: center;
  margin-top: 0.2rem;
}

.reason-content {
  flex: 1;
  position: relative;
}

.reason-title {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.reason-tooltip {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 300px;
  background: white;
  color: #031358;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  pointer-events: none;
}

.reason-tooltip.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(-10px);
}

.reason-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 20px;
  border-width: 8px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

.reason-tooltip p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.form-content {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.slogan {
  color: white;
  font-size: 33px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.3;
  position: absolute;
  top: 10%;
}

.form-container {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;

  height: 100%; /* Thêm dòng này */
  min-height: 600px; /* Thêm chiều cao tối thiểu */
  display: flex; /* Thêm flex để căn giữa nội dung */
  align-items: center; /* Căn giữa theo chiều dọc */
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%; /* Đảm bảo form chiếm toàn bộ chiều rộng */
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input-wrapper,
.select-wrapper {
  position: relative;
  margin-bottom: 0.25rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 1.5rem 0 0.5rem 0;
  border: none;
  border-bottom: 2px solid #e2e8f0;
  background: transparent;
  font-size: 17px;
  color: #031358;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus {
  border-bottom-width: 3px;
  border-bottom-color: #031358;
}

.form-input.error,
.form-select.error {
  border-bottom-color: #e53e3e;
}

.form-label {
  position: absolute;
  top: 1rem;
  left: 0;
  color: #64748b;
  font-size: 1rem;
  pointer-events: none;
  transition: all 0.3s ease;
  transform-origin: left center;
}

.form-label.focused {
  top: 0.25rem;
  font-size: 0.75rem;
  color: #031358;
  transform: translateY(0);
}

.select-label.focused {
  top: 0.25rem;
  font-size: 0.75rem;
  color: #031358;
  transform: translateY(0);
}

.select-wrapper {
  position: relative;
}

.dropdown-arrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #031358;
  font-size: 0.75rem;
  transition: transform 0.3s ease;
  pointer-events: none;
  z-index: 2;
}

.dropdown-arrow.rotated {
  transform: translateY(-50%) rotate(180deg);
}

.form-select {
  appearance: none;
  cursor: pointer;
  position: relative;
  z-index: 1;
  background: transparent;
}

.form-select option {
  color: #031358;
  padding: 0.5rem;
  background: white;
}

.form-select.has-value {
  color: #031358;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  min-height: 1.25rem;
}

.submit-btn {
  background: #031358;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  font-family: inherit;
}

.submit-btn:hover {
  background: #0629BE;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(3, 19, 88, 0.3);
}

.submit-btn:active,
.submit-btn.clicked {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(3, 19, 88, 0.3);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-btn:hover::before {
  left: 100%;
}

.success-message {
  background: #48bb78;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 600;
  margin-top: 1rem;
  animation: slideIn 0.3s ease;
}


@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 1024px) {
  .container {
    flex-direction: column;
    gap: 2rem;
  }

  .reasons-container{
    width: 100%;
    margin-top: 30px;
  }

  .form-content {
    width: 100%;
  }

  .form-container{
    width: 100%;
  }

  .form-section {
    border-top-left-radius: 25% 5%;
    border-top-right-radius: 25% 5%;
  }
}

@media (max-width: 768px) {
  .form-section {
    padding: 1rem;
  }

  .slogan {
    font-size: 2rem;
    margin: 0 2rem;
    top: 5%;
  }

  .form-container {
    padding: 2rem;
  }

  .reason-tooltip {
    width: 250px;
  }
}

@media (max-width: 480px) {
  .slogan {
    font-size: 1.5rem;
  }

  .form-container {
    padding: 1.5rem;
  }

  .form-input,
  .form-select {
    padding: 1.25rem 0 0.5rem 0;
  }

  .form-label.focused {
    top: 0.15rem;
    font-size: 0.7rem;
  }

  .reason-tooltip {
    width: 200px;
  }
}
</style>