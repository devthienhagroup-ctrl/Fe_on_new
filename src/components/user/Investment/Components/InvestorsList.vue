<template>
  <div class="investment-group">
    <h1 class="main-title" :style="mainTitleStyle">{{ config.mainTitle }}</h1>

    <div class="content-wrapper">
      <!-- Bên trái: Top investors và bảng -->
      <div class="left-section">
        <!-- Phần top 3 nhà đầu tư thu gọn -->
        <div class="top-investors-compact" :style="topInvestorsCompactStyle">
          <div class="top-investors-title" :style="topInvestorsTitleStyle">
            {{ config.topInvestorsTitle }}
          </div>
          <div class="top-investors-grid">
            <div class="top-investor-compact top-1" :style="top1Style">
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar" :style="compactAvatarStyle">
                  <img :src="topInvestors[0].avatar" alt="Avatar"/>
                  <i class="fas fa-crown crown-icon" :style="crownIconStyle"></i>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name" :style="compactNameStyle">{{ topInvestors[0].name }}</h4>
                <p class="compact-package" :style="compactPackageStyle">
                  <span>{{ config.packageLabel }}</span>{{ topInvestors[0].package + ' - ' + topInvestors[0].rate }}
                </p>
              </div>
              <div class="compact-badge" :style="top1BadgeStyle">{{ config.top1Badge }}</div>
            </div>

            <div class="top-investor-compact top-2" :style="top2Style">
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar" :style="compactAvatarStyle">
                  <img :src="topInvestors[1].avatar" alt="Avatar"/>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name" :style="compactNameStyle">{{ topInvestors[1].name }}</h4>
                <p class="compact-package" :style="compactPackageStyle">
                  <span>{{ config.packageLabel }}</span>{{ topInvestors[1].package + ' - ' + topInvestors[1].rate }}
                </p>
              </div>
              <div class="compact-badge" :style="top2BadgeStyle">{{ config.top2Badge }}</div>
            </div>

            <div class="top-investor-compact top-3" :style="top3Style">
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar" :style="compactAvatarStyle">
                  <img :src="topInvestors[2].avatar" alt="Avatar"/>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name" :style="compactNameStyle">{{ topInvestors[2].name }}</h4>
                <p class="compact-package" :style="compactPackageStyle">
                  <span>{{ config.packageLabel }}</span>{{ topInvestors[2].package + ' - ' + topInvestors[2].rate }}
                </p>
              </div>
              <div class="compact-badge" :style="top3BadgeStyle">{{ config.top3Badge }}</div>
            </div>
          </div>
        </div>

        <!-- Bảng thông tin -->
        <div class="table-container" :style="tableContainerStyle">
          <table>
            <thead :style="tableHeadStyle">
            <tr>
              <th v-for="header in config.tableHeaders" :key="header">{{ header }}</th>
            </tr>
            </thead>
            <tbody :style="tableBodyStyle">
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
        <div class="form-container" :style="formContainerStyle">
          <h2 class="form-title" :style="formTitleStyle">{{ config.formTitle }}</h2>

          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name" :style="labelStyle">
                {{ config.nameLabel }} <span class="required" :style="requiredStyle">*</span>
              </label>
              <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  :style="inputStyle"
                  required
              >
            </div>

            <div class="form-group">
              <label for="phone" :style="labelStyle">
                {{ config.phoneLabel }} <span class="required" :style="requiredStyle">*</span>
              </label>
              <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  :style="inputStyle"
                  required
              >
            </div>

            <div class="form-group">
              <label for="email" :style="labelStyle">{{ config.emailLabel }}</label>
              <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  :style="inputStyle"
              >
            </div>

            <div class="form-group">
              <label for="package" :style="labelStyle">
                {{ config.packageSelectLabel }} <span class="required" :style="requiredStyle">*</span>
              </label>
              <div class="custom-select">
                <select
                    id="package"
                    v-model="formData.selectedPackage"
                    :style="inputStyle"
                    required
                    @focus="showOptions = true"
                    @blur="hideOptions"
                >
                  <option value="" disabled>{{ config.packagePlaceholder }}</option>
                  <option
                      v-for="(pkg, index) in packagesText"
                      :key="index"
                      :value="pkg"
                  >
                    {{ pkg }}
                  </option>
                </select>
                <div class="select-arrow" :class="{ rotated: showOptions }" :style="selectArrowStyle">▼</div>
              </div>
            </div>

            <div class="form-group">
              <label for="note" :style="labelStyle">{{ config.noteLabel }}</label>
              <textarea
                  id="note"
                  v-model="formData.note"
                  rows="4"
                  :style="textareaStyle"
              ></textarea>
            </div>

            <button type="submit" class="submit-btn" :style="submitBtnStyle">
              {{ config.submitButtonText }}
            </button>

            <div class="call-to-action" :style="callToActionStyle">
              <span class="check-icon" :style="checkIconStyle">{{ config.checkIcon }}</span>
              <span>{{ config.callToActionText }}</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed} from 'vue'

// Config object
let config = reactive({
  // Text content
  mainTitle: 'NHÓM ĐẦU TƯ',
  topInvestorsTitle: 'TOP NHÀ ĐẦU TƯ',
  packageLabel: 'Gói: ',
  top1Badge: 'Top 1',
  top2Badge: '2',
  top3Badge: '3',
  formTitle: 'Đăng ký góp vốn ngay',
  nameLabel: 'Họ và tên',
  phoneLabel: 'Số điện thoại',
  emailLabel: 'Email',
  packageSelectLabel: 'Gói đầu tư dự kiến đăng ký',
  packagePlaceholder: 'Chọn gói đầu tư',
  noteLabel: 'Ghi chú',
  submitButtonText: 'Đăng ký ngay',
  checkIcon: '✓',
  callToActionText: 'Đăng ký ngay để được liên hệ tư vấn sớm nhất',
  tableHeaders: ['STT', 'Họ Tên', 'Ngày góp vốn', 'Gói góp vốn', 'Tỷ lệ'],

  // Colors
  primaryColor: '#031358',
  secondaryColor: '#2a5298',
  accentColor: '#e53e3e',
  goldColor: 'gold',
  silverColor: '#c0c0c0',
  bronzeColor: '#cd7f32',
  whiteColor: '#ffffff',
  lightBlueBg: 'rgba(240, 245, 255, 0.7)',
  hoverBlueBg: 'rgba(219, 234, 254, 0.7)',
  textColor: '#031358',
  requiredColor: '#e53e3e',

  // Gradients
  primaryGradient: 'linear-gradient(135deg, #031358, #2a5298)',
  goldGradient: 'linear-gradient(135deg, gold, #ffd700)',

  // Sizes
  mainTitleFontSize: '33px',
  formTitleFontSize: '25px',
  tableHeaderFontSize: '20px',
  topInvestorsTitleFontSize: '20px',
  compactNameFontSize: '16px',
  compactPackageFontSize: '12px',
  top1CompactNameFontSize: '18px',
  top1CompactPackageFontSize: '13px',
  labelFontSize: '12px',
  callToActionFontSize: '10px',

  // Spacing
  containerPadding: '30px 20px',
  formPadding: '30px',
  tableCellPadding: '15px',
  tableHeaderPadding: '18px 15px',
  compactPadding: '12px',

  // Border
  borderLeftWidth: '4px',
  borderLeftColor: '#2a5298',
  avatarBorderWidth: '2px',

  // Shadows
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  hoverShadow: '0 4px 8px rgba(3, 19, 88, 0.15)',
  submitBtnHoverShadow: '0 6px 12px rgba(3, 19, 88, 0.3)',

  // Borders
  borderRadius: '15px',
  inputBorderRadius: '6px',
  avatarBorderRadius: '50%',

  // Animation
  transitionDuration: '0.3s',

  // Specific styles
  top1Background: 'linear-gradient(135deg, #fff9e6, #fff)',
  top2BorderColor: '#0030ff',
  top3BorderColor: '#031358',

  // Avatar sizes
  compactAvatarSize: '50px',
  top1CompactAvatarSize: '55px',

  // Badge sizes
  compactBadgeSize: '35px'
})

const props = defineProps({
  sectionData: Object
});

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã lấy data từ cha");
}

// Computed styles
const mainTitleStyle = computed(() => ({
  fontSize: config.mainTitleFontSize,
  background: config.primaryGradient,
  color: 'transparent'
}))

const topInvestorsCompactStyle = computed(() => ({
  background: config.whiteColor,
  borderRadius: config.borderRadius,
  boxShadow: config.boxShadow,
  padding: '20px'
}))

const topInvestorsTitleStyle = computed(() => ({
  fontSize: config.topInvestorsTitleFontSize,
  color: config.primaryColor
}))

const compactAvatarStyle = computed(() => ({
  width: config.compactAvatarSize,
  height: config.compactAvatarSize,
  borderRadius: config.avatarBorderRadius,
  border: `${config.avatarBorderWidth} solid ${config.secondaryColor}`
}))

const crownIconStyle = computed(() => ({
  color: config.goldColor
}))

const compactNameStyle = computed(() => ({
  color: config.textColor,
  fontSize: config.compactNameFontSize
}))

const compactPackageStyle = computed(() => ({
  color: config.accentColor,
  fontSize: config.compactPackageFontSize
}))

const top1Style = computed(() => ({
  background: config.top1Background,
  borderColor: config.goldColor
}))

const top2Style = computed(() => ({
  borderColor: config.top2BorderColor
}))

const top3Style = computed(() => ({
  borderColor: config.top3BorderColor
}))

const top1BadgeStyle = computed(() => ({
  background: config.goldGradient,
  color: config.textColor,
  width: config.compactBadgeSize,
  height: config.compactBadgeSize
}))

const top2BadgeStyle = computed(() => ({
  background: config.primaryGradient,
  color: config.whiteColor,
  width: config.compactBadgeSize,
  height: config.compactBadgeSize
}))

const top3BadgeStyle = computed(() => ({
  background: config.primaryGradient,
  color: config.whiteColor,
  width: config.compactBadgeSize,
  height: config.compactBadgeSize
}))

const tableContainerStyle = computed(() => ({
  background: config.whiteColor,
  borderRadius: config.borderRadius,
  boxShadow: config.boxShadow
}))

const tableHeadStyle = computed(() => ({
  background: config.primaryGradient
}))

const tableBodyStyle = computed(() => ({
  backgroundColor: config.lightBlueBg
}))

const formContainerStyle = computed(() => ({
  backgroundColor: config.lightBlueBg,
  borderRadius: config.borderRadius,
  boxShadow: config.boxShadow,
  padding: config.formPadding
}))

const formTitleStyle = computed(() => ({
  fontSize: config.formTitleFontSize,
  color: config.textColor
}))

const labelStyle = computed(() => ({
  color: config.textColor,
  fontSize: config.labelFontSize
}))

const requiredStyle = computed(() => ({
  color: config.requiredColor
}))

const inputStyle = computed(() => ({
  borderLeft: `${config.borderLeftWidth} solid ${config.borderLeftColor}`,
  borderRadius: config.inputBorderRadius,
  backgroundColor: config.whiteColor,
  color: config.textColor
}))

const textareaStyle = computed(() => ({
  borderLeft: `${config.borderLeftWidth} solid ${config.borderLeftColor}`,
  borderRadius: config.inputBorderRadius,
  backgroundColor: config.whiteColor,
  color: config.textColor
}))

const selectArrowStyle = computed(() => ({
  color: config.secondaryColor
}))

const submitBtnStyle = computed(() => ({
  background: config.primaryGradient,
  color: config.whiteColor,
  borderRadius: config.inputBorderRadius
}))

const callToActionStyle = computed(() => ({
  fontSize: config.callToActionFontSize,
  color: config.textColor
}))

const checkIconStyle = computed(() => ({
  background: config.primaryGradient,
  color: config.whiteColor
}))

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
  padding: v-bind('config.containerPadding');
  font-family: 'Ubuntu', sans-serif;
}

.main-title {
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
  position: relative;
  -webkit-background-clip: text;
  background-clip: text;
  font-size: v-bind('config.mainTitleFontSize');
  background: v-bind('config.primaryGradient');
  color: transparent;
}

.main-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: v-bind('config.primaryGradient');
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
  background: v-bind('config.whiteColor');
  border-radius: v-bind('config.borderRadius');
  box-shadow: v-bind('config.boxShadow');
  padding: 20px;
  margin-bottom: 20px;
}

.top-investors-title {
  font-size: v-bind('config.topInvestorsTitleFontSize');
  text-align: center;
  margin-bottom: 15px;
  color: v-bind('config.primaryColor');
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
  background: v-bind('config.primaryGradient');
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
  background: v-bind('config.lightBlueBg');
  border-radius: 10px;
  padding: v-bind('config.compactPadding');
  position: relative;
  transition: all v-bind('config.transitionDuration') ease;
  border: 2px solid transparent;
}

.top-investor-compact:hover {
  transform: translateY(-2px);
  box-shadow: v-bind('config.hoverShadow');
}

.top-investor-compact.top-1 {
  background: v-bind('config.top1Background');
  border-color: v-bind('config.goldColor');
  order: 2;
}

.top-investor-compact.top-2 {
  order: 1;
  margin-top: 30px;
  border-color: v-bind('config.top2BorderColor');
}

.top-investor-compact.top-3 {
  order: 3;
  margin-top: 40px;
  border-color: v-bind('config.top3BorderColor');
}

.compact-avatar {
  width: v-bind('config.compactAvatarSize');
  height: v-bind('config.compactAvatarSize');
  border-radius: v-bind('config.avatarBorderRadius');
  overflow: hidden;
  border: v-bind('config.avatarBorderWidth') solid v-bind('config.secondaryColor');
  flex-shrink: 0;
}

.compact-avatar-wrapper {
  position: relative;
  margin-right: 12px;
}

.top-1 .compact-avatar {
  border-color: v-bind('config.goldColor');
  width: v-bind('config.top1CompactAvatarSize');
  height: v-bind('config.top1CompactAvatarSize');
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
  color: v-bind('config.goldColor');
  font-size: 16px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.compact-info {
  flex: 1;
  min-width: 0;
}

.compact-name {
  color: v-bind('config.textColor');
  font-size: v-bind('config.compactNameFontSize');
  font-weight: 700;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-1 .compact-name {
  font-size: v-bind('config.top1CompactNameFontSize');
}

.compact-package {
  color: v-bind('config.accentColor');
  font-size: v-bind('config.compactPackageFontSize');
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-1 .compact-package {
  font-size: v-bind('config.top1CompactPackageFontSize');
}

.compact-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: v-bind('config.primaryGradient');
  color: v-bind('config.whiteColor');
  width: v-bind('config.compactBadgeSize');
  height: v-bind('config.compactBadgeSize');
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.top-1 .compact-badge {
  background: v-bind('config.goldGradient');
  color: v-bind('config.textColor');
}

.table-container {
  background: v-bind('config.whiteColor');
  border-radius: v-bind('config.borderRadius');
  box-shadow: v-bind('config.boxShadow');
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: v-bind('config.primaryGradient');
}

thead th {
  color: v-bind('config.whiteColor');
  font-size: v-bind('config.tableHeaderFontSize');
  padding: v-bind('config.tableHeaderPadding');
  text-align: left;
  font-weight: 500;
}

tbody {
  background-color: v-bind('config.lightBlueBg');
}

tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all v-bind('config.transitionDuration') ease;
}

tbody tr:hover {
  background-color: v-bind('config.hoverBlueBg');
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(3, 19, 88, 0.1);
}

tbody td {
  padding: v-bind('config.tableCellPadding');
  color: v-bind('config.textColor');
}

.form-container {
  background-color: v-bind('config.lightBlueBg');
  border-radius: v-bind('config.borderRadius');
  box-shadow: v-bind('config.boxShadow');
  padding: v-bind('config.formPadding');
  min-height: 100%;
}

.form-title {
  font-size: v-bind('config.formTitleFontSize');
  color: v-bind('config.textColor');
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  color: v-bind('config.textColor');
  font-size: v-bind('config.labelFontSize');
  margin-bottom: 5px;
  text-align: left;
  font-weight: 500;
}

.required {
  color: v-bind('config.requiredColor');
}

input, textarea, select {
  width: 100%;
  padding: 12px 15px;
  border: none;
  border-left: v-bind('config.borderLeftWidth') solid v-bind('config.borderLeftColor');
  border-radius: v-bind('config.inputBorderRadius');
  background-color: v-bind('config.whiteColor');
  font-family: 'Ubuntu', sans-serif;
  transition: all v-bind('config.transitionDuration') ease;
  color: v-bind('config.textColor');
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
  transition: transform v-bind('config.transitionDuration') ease;
  color: v-bind('config.secondaryColor');
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
  background: v-bind('config.primaryGradient');
  color: v-bind('config.whiteColor');
  border: none;
  border-radius: v-bind('config.inputBorderRadius');
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all v-bind('config.transitionDuration') ease;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: v-bind('config.submitBtnHoverShadow');
}

.submit-btn:active {
  transform: translateY(-1px);
}

.call-to-action {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  font-size: v-bind('config.callToActionFontSize');
  color: v-bind('config.textColor');
}

.check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: v-bind('config.primaryGradient');
  color: v-bind('config.whiteColor');
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