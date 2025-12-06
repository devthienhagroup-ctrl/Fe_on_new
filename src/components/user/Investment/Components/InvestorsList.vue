<template>
  <div class="investment-group">
    <h1 class="main-title">NHÓM ĐẦU TƯ</h1>

    <div class="content-wrapper">
      <!-- Bên trái: Top investors và bảng -->
      <div class="left-section">
        <!-- Phần top 3 nhà đầu tư thu gọn -->
        <div class="top-investors-compact">
          <div class="top-investors-title">TOP NHÀ ĐẦU TƯ</div>
          <div class="top-investors-grid">
            <div class="top-investor-compact top-1">
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar">
                  <img :src="topInvestors[0].avatar" alt="Avatar"/>
                  <i class="fas fa-crown crown-icon"></i>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name">{{ topInvestors[0].name }}</h4>
                <p class="compact-package"><span>Gói: </span>{{topInvestors[0].package + ' - ' + topInvestors[0].rate }}</p>
              </div>
              <div class="compact-badge">Top 1</div>
            </div>

            <div class="top-investor-compact top-2">
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar">
                  <img :src="topInvestors[1].avatar" alt="Avatar"/>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name">{{ topInvestors[1].name }}</h4>
                <p class="compact-package"><span>Gói: </span>{{topInvestors[0].package + ' - ' + topInvestors[0].rate }}</p>
              </div>
              <div class="compact-badge">2</div>
            </div>

            <div class="top-investor-compact top-3">
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar">
                  <img :src="topInvestors[2].avatar" alt="Avatar"/>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name">{{ topInvestors[2].name }}</h4>
                <p class="compact-package"><span>Gói: </span>{{topInvestors[0].package + ' - ' + topInvestors[0].rate }}</p>
              </div>
              <div class="compact-badge">3</div>
            </div>
          </div>
        </div>

        <!-- Bảng thông tin -->
        <div class="table-container">
          <table>
            <thead>
            <tr>
              <th>STT</th>
              <th>Họ Tên</th>
              <th>Ngày góp vốn</th>
              <th>Gói góp vốn</th>
              <th>Tỷ lệ</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(person, index) in investors" :key="index">
              <td>{{ index + 4 }}</td>
              <td>{{ person.name }}</td>
              <td>{{ person.date }}</td>
              <td>{{ person.package }}</td>
              <td>{{ person.rate }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bên phải: Form đăng ký -->
      <div class="right-section">
        <div class="form-container">
          <h2 class="form-title">Đăng ký góp vốn ngay</h2>

          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Họ và tên <span class="required">*</span></label>
              <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  required
              >
            </div>

            <div class="form-group">
              <label for="phone">Số điện thoại <span class="required">*</span></label>
              <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  required
              >
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                  type="email"
                  id="email"
                  v-model="formData.email"
              >
            </div>

            <div class="form-group">
              <label for="package">Gói đầu tư dự kiến đăng ký <span class="required">*</span></label>
              <div class="custom-select">
                <select
                    id="package"
                    v-model="formData.selectedPackage"
                    required
                    @focus="showOptions = true"
                    @blur="hideOptions"
                >
                  <option value="" disabled>Chọn gói đầu tư</option>
                  <option
                      v-for="(pkg, index) in packagesText"
                      :key="index"
                      :value="pkg"
                  >
                    {{ pkg }}
                  </option>
                </select>
                <div class="select-arrow" :class="{ rotated: showOptions }">▼</div>
              </div>
            </div>

            <div class="form-group">
              <label for="note">Ghi chú</label>
              <textarea
                  id="note"
                  v-model="formData.note"
                  rows="4"
              ></textarea>
            </div>

            <button type="submit" class="submit-btn">Đăng ký ngay</button>

            <div class="call-to-action">
              <span class="check-icon">✓</span>
              <span>Đăng ký ngay để được liên hệ tư vấn sớm nhất</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed} from 'vue'

// Dữ liệu bảng nhà đầu tư
const allInvestors = ref([
  {name: 'Nguyễn Thanh Tùng', date: '10/03/2024', package: '300.000.000', rate: '15%'},
  {name: 'Trần Minh Tuyết', date: '15/03/2024', package: '30.000.000', rate: '1.5%'},
  {name: 'Lê Quang Khải', date: '22/03/2024', package: '50.000.000', rate: '2.5%'},
  {name: 'Phạm Bảo Trâm', date: '27/03/2024', package: '70.000.000', rate: '3.5%'},
  {name: 'Hoàng Đức Thiện', date: '05/04/2024', package: '100.000.000', rate: '5%'},
  {name: 'Đỗ Ngọc Phương', date: '12/04/2024', package: '150.000.000', rate: '7.5%'},
  {name: 'Vũ Quốc Đạt', date: '18/04/2024', package: '200.000.000', rate: '10%'},
  {name: 'Vũ Hoàng Minh', date: '25/04/2024', package: '300.000.000', rate: '15%'},

  {name: 'Nguyễn Thanh Bình', date: '02/05/2024', package: '50.000.000', rate: '2.5%'},
  {name: 'Phạm Minh Khang', date: '08/05/2024', package: '70.000.000', rate: '3.5%'},
  {name: 'Lê Thảo Nhi', date: '14/05/2024', package: '150.000.000', rate: '7.5%'},
  {name: 'Đặng Anh Tuấn', date: '20/05/2024', package: '200.000.000', rate: '10%'}
])

// Sắp xếp danh sách theo gói góp vốn giảm dần
const sortedInvestors = computed(() => {
  return [...allInvestors.value].sort((a, b) => {
    const aValue = parseInt(a.package.replace(/\./g, ''));
    const bValue = parseInt(b.package.replace(/\./g, ''));
    return bValue - aValue;
  });
})

// Lấy top 3 nhà đầu tư
const topInvestors = computed(() => {
  return sortedInvestors.value.slice(0, 3).map(investor => ({
    ...investor,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
  }));
})

// Lấy danh sách từ người thứ 4 trở đi
const investors = computed(() => {
  return sortedInvestors.value.slice(3);
})

// Dữ liệu gói đầu tư
const packagesText = ref([
  "Gói 20 triệu - 1%",
  "Gói 30 triệu - 1,5%",
  "Gói 50 triệu - 2,5%",
  "Gói 70 triệu - 3,5%",
  "Gói 100 triệu - 5%",
  "Gói 150 triệu - 7,5%",
  "Gói 200 triệu - 10%",
  "Gói 300 triệu - 15%"
])

// Dữ liệu form
const formData = reactive({
  name: '',
  phone: '',
  email: '',
  selectedPackage: '',
  note: ''
})

// State cho hiệu ứng select
const showOptions = ref(false)

// Hàm ẩn options với delay để cho phép click
const hideOptions = () => {
  setTimeout(() => {
    showOptions.value = false
  }, 150)
}

// Hàm submit form
const submitForm = () => {
  // Xử lý submit form ở đây
  console.log('Form data:', formData)
  alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.')

  // Reset form sau khi submit
  Object.assign(formData, {
    name: '',
    phone: '',
    email: '',
    selectedPackage: '',
    note: ''
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.investment-group {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Ubuntu', sans-serif;
}

.main-title {
  font-size: 33px;
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #031358, #2a5298);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  position: relative;
}

.main-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(135deg, #031358, #2a5298);
  border-radius: 2px;
}

.content-wrapper {
  display: flex;
  gap: 30px;
}

.left-section {
  flex: 0 0 66.66%;
}

.right-section {
  flex: 0 0 33.33%;
}

/* Phần top investors thu gọn */
.top-investors-compact {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.top-investors-title {
  font-size: 20px;
  text-align: center;
  margin-bottom: 15px;
  color: #031358;
  font-weight: 700;
  position: relative;
}

.top-investors-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(135deg, #031358, #2a5298);
  border-radius: 1px;
}

.top-investors-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
}

.top-investor-compact {
  display: flex;
  align-items: center;
  background: rgba(240, 245, 255, 0.7);
  border-radius: 10px;
  padding: 12px;
  position: relative;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.top-investor-compact:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(3, 19, 88, 0.15);
}

.top-investor-compact.top-1 {
  background: linear-gradient(135deg, #fff9e6, #fff);
  border-color: gold;
  order: 2;
}

.top-investor-compact.top-2 {
  order: 1;
  margin-top: 30px;
  border-color: #0030ff;
}

.top-investor-compact.top-3 {
  order: 3;
  margin-top: 40px;
  border-color: #031358;
}

.compact-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #2a5298;
  flex-shrink: 0;
}

.compact-avatar-wrapper {
  position: relative;
  margin-right: 12px;
}

.top-1 .compact-avatar {
  border-color: gold;
  width: 55px;
  height: 55px;
}

.compact-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.crown-icon {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  color: gold;
  font-size: 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.compact-info {
  flex: 1;
  min-width: 0;
}

.compact-name {
  color: #031358;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-1 .compact-name {
  font-size: 18px;
}

.compact-package {
  color: #e53e3e;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-1 .compact-package {
  font-size: 13px;
}

.compact-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, #031358, #2a5298);
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.top-1 .compact-badge {
  background: linear-gradient(135deg, gold, #ffd700);
  color: #031358;
}

.table-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: linear-gradient(135deg, #031358, #2a5298);
}

thead th {
  color: white;
  font-size: 20px;
  padding: 18px 15px;
  text-align: left;
  font-weight: 500;
}

tbody {
  background-color: rgba(240, 245, 255, 0.7);
}

tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

tbody tr:hover {
  background-color: rgba(219, 234, 254, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(3, 19, 88, 0.1);
}

tbody td {
  padding: 15px;
  color: #031358;
}

.form-container {
  background-color: rgba(240, 245, 255, 0.7);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  min-height: 100%;
}

.form-title {
  font-size: 25px;
  color: #031358;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  color: #031358;
  font-size: 12px;
  margin-bottom: 5px;
  text-align: left;
  font-weight: 500;
}

.required {
  color: #e53e3e;
}

input, textarea, select {
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-left: 4px solid #2a5298;
  border-radius: 6px;
  background-color: white;
  font-family: 'Ubuntu', sans-serif;
  transition: all 0.3s ease;
  color: #031358;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  box-shadow: 0 1px 1px 2px rgba(42, 82, 152, 0.2);
  transform: translateY(-4px);
}

.custom-select {
  position: relative;
}

.custom-select select {
  appearance: none;
  cursor: pointer;
}

.select-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  transition: transform 0.3s ease;
  color: #2a5298;
}

.select-arrow.rotated {
  transform: translateY(-50%) rotate(180deg);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #031358, #2a5298);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(3, 19, 88, 0.3);
}

.submit-btn:active {
  transform: translateY(-1px);
}

.call-to-action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  font-size: 10px;
  color: #031358;
}

.check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #031358, #2a5298);
  color: white;
  border-radius: 50%;
  margin-right: 8px;
  font-size: 8px;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .left-section, .right-section {
    flex: 0 0 100%;
  }
}

@media (max-width: 768px) {
  .investment-group {
    padding: 20px 15px;
  }

  .main-title {
    font-size: 28px;
  }

  .top-investors-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .top-investor-compact {
    padding: 10px;
  }

  .compact-avatar {
    width: 45px;
    height: 45px;
  }

  .top-1 .compact-avatar {
    width: 50px;
    height: 50px;
  }

  .compact-name {
    font-size: 13px;
  }

  .compact-package {
    font-size: 11px;
  }

  thead th {
    font-size: 16px;
    padding: 12px 8px;
  }

  tbody td {
    padding: 10px 8px;
    font-size: 14px;
  }

  .form-container {
    padding: 20px;
  }

  .form-title {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .top-investors-compact {
    padding: 15px;
  }

  .top-investors-title {
    font-size: 18px;
  }
}
</style>