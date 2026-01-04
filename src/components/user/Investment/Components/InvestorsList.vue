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
            <!-- Top 1 (bên trái) -->
            <div
                v-if="topInvestors.length > 0"
                :key="topInvestors[0].id"
                class="top-investor-compact"
                :class="['top-1']"
                :style="getTopInvestorStyle(0)"
            >
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar" :style="getAvatarStyle(0)">
                  <img :src="getAvatarUrl(topInvestors[0].avatar)" :alt="topInvestors[0].fullName"/>
                  <i class="fas fa-crown crown-icon" :style="crownIconStyle"></i>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name" :style="getNameStyle(0)">{{ topInvestors[0].fullName || 'N/A' }}</h4>
                <p class="compact-package" :style="compactPackageStyle">
                  <span>{{ config.packageLabel }}</span>
                  {{ topInvestors[0].invmName || 'N/A' }} - {{ topInvestors[0].profitPercent || 0 }}%
                </p>
              </div>
              <div class="compact-badge" :style="getBadgeStyle(0)">
                {{ config.top1Badge }}
              </div>
            </div>

            <!-- Placeholder cho top 1 nếu không có -->
            <div
                v-else
                :key="'placeholder-1'"
                class="top-investor-compact placeholder"
                :style="getPlaceholderStyle(0)"
            >
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar placeholder-avatar" :style="compactAvatarStyle">
                  <i class="fas fa-user placeholder-icon"></i>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name placeholder-text" :style="compactNameStyle">Chưa có nhà đầu tư</h4>
                <p class="compact-package placeholder-text" :style="compactPackageStyle">
                  <span>{{ config.packageLabel }}</span>Chưa có
                </p>
              </div>
              <div class="compact-badge placeholder-badge" :style="getPlaceholderBadgeStyle(0)">
                1
              </div>
            </div>

            <!-- Top 2 (ở giữa) -->
            <div
                v-if="topInvestors.length > 1"
                :key="topInvestors[1].id"
                class="top-investor-compact"
                :class="['top-2']"
                :style="getTopInvestorStyle(1)"
            >
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar" :style="getAvatarStyle(1)">
                  <img :src="getAvatarUrl(topInvestors[1].avatar)" :alt="topInvestors[1].fullName"/>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name" :style="getNameStyle(1)">{{ topInvestors[1].fullName || 'N/A' }}</h4>
                <p class="compact-package" :style="compactPackageStyle">
                  <span>{{ config.packageLabel }}</span>
                  {{ topInvestors[1].invmName || 'N/A' }} - {{ topInvestors[1].profitPercent || 0 }}%
                </p>
              </div>
              <div class="compact-badge" :style="getBadgeStyle(1)">
                {{ config.top2Badge }}
              </div>
            </div>

            <!-- Placeholder cho top 2 nếu không có -->
            <div
                v-else-if="placeholderCount >= 2"
                :key="'placeholder-2'"
                class="top-investor-compact placeholder"
                :style="getPlaceholderStyle(1)"
            >
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar placeholder-avatar" :style="compactAvatarStyle">
                  <i class="fas fa-user placeholder-icon"></i>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name placeholder-text" :style="compactNameStyle">Chưa có nhà đầu tư</h4>
                <p class="compact-package placeholder-text" :style="compactPackageStyle">
                  <span>{{ config.packageLabel }}</span>Chưa có
                </p>
              </div>
              <div class="compact-badge placeholder-badge" :style="getPlaceholderBadgeStyle(1)">
                2
              </div>
            </div>

            <!-- Top 3 (bên phải) -->
            <div
                v-if="topInvestors.length > 2"
                :key="topInvestors[2].id"
                class="top-investor-compact"
                :class="['top-3']"
                :style="getTopInvestorStyle(2)"
            >
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar" :style="getAvatarStyle(2)">
                  <img :src="getAvatarUrl(topInvestors[2].avatar)" :alt="topInvestors[2].fullName"/>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name" :style="getNameStyle(2)">{{ topInvestors[2].fullName || 'N/A' }}</h4>
                <p class="compact-package" :style="compactPackageStyle">
                  <span>{{ config.packageLabel }}</span>
                  {{ topInvestors[2].invmName || 'N/A' }} - {{ topInvestors[2].profitPercent || 0 }}%
                </p>
              </div>
              <div class="compact-badge" :style="getBadgeStyle(2)">
                {{ config.top3Badge }}
              </div>
            </div>

            <!-- Placeholder cho top 3 nếu không có -->
            <div
                v-else-if="placeholderCount >= 3"
                :key="'placeholder-3'"
                class="top-investor-compact placeholder"
                :style="getPlaceholderStyle(2)"
            >
              <div class="compact-avatar-wrapper">
                <div class="compact-avatar placeholder-avatar" :style="compactAvatarStyle">
                  <i class="fas fa-user placeholder-icon"></i>
                </div>
              </div>
              <div class="compact-info">
                <h4 class="compact-name placeholder-text" :style="compactNameStyle">Chưa có nhà đầu tư</h4>
                <p class="compact-package placeholder-text" :style="compactPackageStyle">
                  <span>{{ config.packageLabel }}</span>Chưa có
                </p>
              </div>
              <div class="compact-badge placeholder-badge" :style="getPlaceholderBadgeStyle(2)">
                3
              </div>
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
            <tr v-for="(investor, index) in investorsContent" :key="investor.id">
              <td>{{ (pageInfo.number * pageInfo.size) + index + 1 }}</td>
              <td>{{ investor.fullName || 'N/A' }}</td>
              <td>{{ formatDate(investor.investedAt) }}</td>
              <td>{{investor.invmName}}</td>
              <td>{{ formatCurrency(investor.invmAmount) }}</td>
              <td>{{ investor.profitPercent || 0 }}%</td>
            </tr>

            <!-- Hiển thị placeholder nếu không có dữ liệu -->
            <tr v-if="investorsContent.length === 0">
              <td :colspan="config.tableHeaders.length" class="no-data">Chưa có nhà đầu tư nào</td>
            </tr>
            </tbody>
          </table>

          <!-- Phân trang -->
          <div class="pagination-container" v-if="pageInfo.totalPages > 1">
            <button
                @click="prevPage"
                :disabled="pageInfo.number === 0"
                class="pagination-btn"
            >
              ←
            </button>
            <span class="page-info">
              Trang {{ pageInfo.number + 1 }} / {{ pageInfo.totalPages }}
            </span>
            <button
                @click="nextPage"
                :disabled="pageInfo.number >= pageInfo.totalPages - 1"
                class="pagination-btn"
            >
              →
            </button>
            <select v-model="pageInfo.size" @change="onPageSizeChange" class="page-size-select">
              <option value="5">5 dòng/trang</option>
              <option value="10">10 dòng/trang</option>
              <option value="20">20 dòng/trang</option>
              <option value="50">50 dòng/trang</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Bên phải: Form đăng ký đơn giản -->
      <div class="right-section">
        <div class="form-container" :style="formContainerStyle">
          <h2 class="form-title" :style="formTitleStyle">{{ config.formTitle }}</h2>

          <div class="simple-form" v-if="!isFormDisabled">
            <div class="form-group">
              <label for="package" :style="labelStyle">
                {{ config.packageSelectLabel }} <span class="required" :style="requiredStyle">*</span>
              </label>
              <div class="custom-select">
                <select
                    id="package"
                    v-model="selectedPackage"
                    :style="inputStyle"
                    required
                >
                  <option value="" disabled>{{ config.packagePlaceholder }}</option>
                  <option
                      v-for="pkg in packages"
                      :key="pkg.id"
                      :value="pkg.id"
                  >
                    {{ pkg.name }} - {{ formatCurrency(pkg.amount) }} - {{ pkg.profitPercent }}%
                  </option>
                </select>
                <div class="select-arrow" :style="selectArrowStyle">▼</div>
              </div>
            </div>

            <button @click="registerInvestment" class="submit-btn" :style="submitBtnStyle">
              {{ config.submitButtonText }}
            </button>

            <div class="call-to-action" :style="callToActionStyle">
              <span class="check-icon" :style="checkIconStyle">{{ config.checkIcon }}</span>
              <span>{{ config.callToActionText }}</span>
            </div>
          </div>

          <!-- Hiển thị khi user đã đăng ký -->
          <div v-else class="already-registered">
            <div class="already-registered-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <h3 class="already-registered-title">Bạn đã đăng ký đầu tư</h3>
            <p class="already-registered-message">Cảm ơn bạn đã tham gia đầu tư.</p>
            <button class="already-registered-btn" disabled>
              <i class="fas fa-check"></i> Đã đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed, defineEmits} from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// Khai báo emits
const emit = defineEmits(['page-change', 'payment'])

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
  packageSelectLabel: 'Gói đầu tư dự kiến đăng ký',
  packagePlaceholder: 'Chọn gói đầu tư',
  submitButtonText: 'Đăng ký ngay',
  checkIcon: '✓',
  callToActionText: 'Đăng ký ngay để được liên hệ tư vấn sớm nhất',
  tableHeaders: ['STT', 'Họ Tên', 'Ngày góp vốn', 'Số tiền đầu tư', 'Lợi nhuận (%)'],

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
  placeholderColor: '#a0aec0',
  successColor: '#10b981',

  // Gradients
  primaryGradient: 'linear-gradient(135deg, #031358, #2a5298)',
  goldGradient: 'linear-gradient(135deg, gold, #ffd700)',
  silverGradient: 'linear-gradient(135deg, #c0c0c0, #d9d9d9)',
  bronzeGradient: 'linear-gradient(135deg, #cd7f32, #d98c3a)',

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
  top2Background: 'linear-gradient(135deg, #f7f7f7, #fff)',
  top3Background: 'linear-gradient(135deg, #fef4e8, #fff)',
  placeholderBackground: 'linear-gradient(135deg, #f8f9fa, #fff)',

  // Avatar sizes
  compactAvatarSize: '50px',
  top1CompactAvatarSize: '55px',

  // Badge sizes
  compactBadgeSize: '35px',

  // Height cho các container top
  top1Height: '180px',
  top2Height: '160px',
  top3Height: '160px',
  placeholderHeight: '150px'
})

const props = defineProps({
  sectionConfig: Object,
  packages: Array,
  investors: Object, // Nhận Page object từ cha
  currentUserHasInvested: {
    type: Boolean,
    default: null // null = chưa đăng nhập hoặc chưa xác định
  }
});

if(props.sectionConfig) {
  Object.assign(config, props.sectionConfig);
  console.log("Đã lấy config từ cha");
}

// Kiểm tra form có bị disable không
const isFormDisabled = computed(() => {
  return props.currentUserHasInvested === true;
})

// Xử lý investors Page object
const pageInfo = reactive({
  size: props.investors?.page?.size || 10,
  number: props.investors?.page?.number || 0,
  totalElements: props.investors?.page?.totalElements || 0,
  totalPages: props.investors?.page?.totalPages || 1
})

// Computed để lấy content từ investors
const investorsContent = computed(() => {
  return props.investors?.content || [];
})

// Computed để lấy top 3 investors (content đã được sắp xếp từ API)
const topInvestors = computed(() => {
  if (!investorsContent.value || investorsContent.value.length === 0) return [];
  return investorsContent.value.slice(0, 3);
})

// Computed để tính placeholder count
const placeholderCount = computed(() => {
  return Math.max(0, 3 - topInvestors.value.length);
})

// Format packages từ API
const packages = computed(() => {
  return props.packages || [];
})

// Format currency
const formatCurrency = (amount) => {
  if (!amount) return '0 VNĐ';
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)} tỷ`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)} triệu`;
  }
  return amount.toLocaleString('vi-VN') + ' VNĐ';
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  } catch {
    return dateString;
  }
}

// Lấy URL avatar
const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return 'https://i.pravatar.cc/150?img=0';
  if (avatarPath.startsWith('http')) return avatarPath;
  return baseImgaeUrl+avatarPath; // Thay bằng base URL thực tế
}

// Selected package
const selectedPackage = ref('');

// Đăng ký đầu tư
const registerInvestment = () => {
  if (!selectedPackage.value) {
    alert('Vui lòng chọn gói đầu tư!')
    return
  }

  // Emit sự kiện với packageId
  emit('payment', selectedPackage.value)
}

// Xử lý phân trang
const prevPage = () => {
  if (pageInfo.number > 0) {
    pageInfo.number--;
    emitPageChange();
  }
}

const nextPage = () => {
  if (pageInfo.number < pageInfo.totalPages - 1) {
    pageInfo.number++;
    emitPageChange();
  }
}

const onPageSizeChange = () => {
  pageInfo.number = 0; // Reset về trang đầu khi thay đổi kích thước trang
  emitPageChange();
}

const emitPageChange = () => {
  emit('page-change', {
    page: pageInfo.number,
    size: pageInfo.size
  });
}

// Computed styles
const getTopInvestorStyle = (index) => {
  const baseStyle = {
    height: config.top2Height,
    background: config.top2Background,
    borderColor: config.silverColor,
    alignSelf: 'flex-end'
  };

  if (index === 0) {
    // Top 1: bên trái, cao nhất
    return {
      ...baseStyle,
      height: config.top1Height,
      background: config.top1Background,
      borderColor: config.goldColor,
      order: 1, // Trái
      alignSelf: 'flex-start'
    };
  } else if (index === 1) {
    // Top 2: ở giữa, thấp hơn
    return {
      ...baseStyle,
      height: config.top2Height,
      background: config.top2Background,
      borderColor: config.silverColor,
      order: 2, // Giữa
      alignSelf: 'center'
    };
  } else if (index === 2) {
    // Top 3: bên phải, thấp hơn
    return {
      ...baseStyle,
      height: config.top3Height,
      background: config.top3Background,
      borderColor: config.bronzeColor,
      order: 3, // Phải
      alignSelf: 'flex-end'
    };
  }

  return baseStyle;
}

const getAvatarStyle = (index) => {
  const baseStyle = {
    width: config.compactAvatarSize,
    height: config.compactAvatarSize,
    borderRadius: config.avatarBorderRadius,
    border: `${config.avatarBorderWidth} solid ${config.secondaryColor}`
  };

  if (index === 0) {
    baseStyle.width = config.top1CompactAvatarSize;
    baseStyle.height = config.top1CompactAvatarSize;
    baseStyle.borderColor = config.goldColor;
  } else if (index === 1) {
    baseStyle.borderColor = config.silverColor;
  } else if (index === 2) {
    baseStyle.borderColor = config.bronzeColor;
  }

  return baseStyle;
}

const getNameStyle = (index) => ({
  color: config.textColor,
  fontSize: index === 0 ? config.top1CompactNameFontSize : config.compactNameFontSize
})

const getBadgeStyle = (index) => {
  const baseStyle = {
    width: config.compactBadgeSize,
    height: config.compactBadgeSize
  };

  if (index === 0) {
    return {
      ...baseStyle,
      background: config.goldGradient,
      color: config.textColor
    };
  } else if (index === 1) {
    return {
      ...baseStyle,
      background: config.silverGradient,
      color: config.whiteColor
    };
  } else {
    return {
      ...baseStyle,
      background: config.bronzeGradient,
      color: config.whiteColor
    };
  }
}

// Placeholder styles
const getPlaceholderStyle = (position) => {
  const baseStyle = {
    height: config.placeholderHeight,
    background: config.placeholderBackground,
    borderColor: config.placeholderColor,
    opacity: 0.7,
    alignSelf: 'flex-end'
  };

  if (position === 0) {
    return {
      ...baseStyle,
      order: 1,
      height: config.top1Height,
      alignSelf: 'flex-start'
    };
  } else if (position === 1) {
    return {
      ...baseStyle,
      order: 2,
      height: config.top2Height,
      alignSelf: 'center'
    };
  } else {
    return {
      ...baseStyle,
      order: 3,
      height: config.top3Height,
      alignSelf: 'flex-end'
    };
  }
}

const getPlaceholderBadgeStyle = (position) => ({
  background: config.primaryGradient,
  color: config.whiteColor,
  width: config.compactBadgeSize,
  height: config.compactBadgeSize,
  opacity: 0.5
})

// Các computed styles khác (giữ nguyên)
const mainTitleStyle = computed(() => ({
  fontSize: config.mainTitleFontSize,
  color: config.primaryColor,
  background: 'transparent'
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
  margin-bottom: 25px;
  color: v-bind('config.primaryColor');
  font-weight: 700;
  position: relative;
}

.top-investors-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: v-bind('config.primaryGradient');
  border-radius: 2px;
}

.top-investors-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  align-items: end;
  min-height: 200px;
}

.top-investor-compact {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: v-bind('config.lightBlueBg');
  border-radius: 10px;
  padding: v-bind('config.compactPadding');
  position: relative;
  transition: all v-bind('config.transitionDuration') ease;
  border: 2px solid transparent;
  height: v-bind('config.top2Height');
}

.top-investor-compact:hover:not(.placeholder) {
  transform: translateY(-5px);
  box-shadow: v-bind('config.hoverShadow');
}

.top-investor-compact.placeholder {
  opacity: 0.7;
  cursor: default;
}

.top-investor-compact.top-1 {
  background: v-bind('config.top1Background');
  border-color: v-bind('config.goldColor');
  order: 1;
  height: v-bind('config.top1Height');
  align-self: flex-start;
}

.top-investor-compact.top-2 {
  background: v-bind('config.top2Background');
  border-color: v-bind('config.silverColor');
  order: 2;
  height: v-bind('config.top2Height');
  align-self: center;
}

.top-investor-compact.top-3 {
  background: v-bind('config.top3Background');
  border-color: v-bind('config.bronzeColor');
  order: 3;
  height: v-bind('config.top3Height');
  align-self: flex-end;
}

.compact-avatar-wrapper {
  position: relative;
  margin-bottom: 10px;
}

.compact-avatar {
  width: v-bind('config.compactAvatarSize');
  height: v-bind('config.compactAvatarSize');
  border-radius: v-bind('config.avatarBorderRadius');
  overflow: hidden;
  border: v-bind('config.avatarBorderWidth') solid v-bind('config.secondaryColor');
}

.top-1 .compact-avatar {
  border-color: v-bind('config.goldColor');
  width: v-bind('config.top1CompactAvatarSize');
  height: v-bind('config.top1CompactAvatarSize');
}

.top-2 .compact-avatar {
  border-color: v-bind('config.silverColor');
}

.top-3 .compact-avatar {
  border-color: v-bind('config.bronzeColor');
}

.compact-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.compact-avatar.placeholder-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border-color: v-bind('config.placeholderColor');
}

.placeholder-icon {
  font-size: 20px;
  color: v-bind('config.placeholderColor');
}

.crown-icon {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  color: v-bind('config.goldColor');
  font-size: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 15;
}

.compact-info {
  text-align: center;
  width: 100%;
  margin-bottom: 10px;
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

.compact-name.placeholder-text,
.compact-package.placeholder-text {
  color: v-bind('config.placeholderColor');
  font-style: italic;
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
  top: -12px;
  right: -12px;
  background: v-bind('config.primaryGradient');
  color: v-bind('config.whiteColor');
  width: v-bind('config.compactBadgeSize');
  height: v-bind('config.compactBadgeSize');
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  z-index: 10;
}

.top-1 .compact-badge {
  background: v-bind('config.goldGradient');
  color: v-bind('config.textColor');
  font-size: 13px;
  width: 40px;
  height: 40px;
}

.top-2 .compact-badge {
  background: v-bind('config.silverGradient');
}

.top-3 .compact-badge {
  background: v-bind('config.bronzeGradient');
}

.compact-badge.placeholder-badge {
  opacity: 0.5;
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

.no-data {
  text-align: center;
  color: v-bind('config.placeholderColor');
  font-style: italic;
  padding: 30px !important;
}

/* Phân trang */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 15px;
  background: v-bind('config.whiteColor');
  border-top: 1px solid #e2e8f0;
}

.pagination-btn {
  padding: 8px 16px;
  background: v-bind('config.primaryGradient');
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: v-bind('config.textColor');
}

.page-size-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 5px;
  background: white;
  color: v-bind('config.textColor');
  margin-left: 20px;
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

.simple-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin-bottom: 0;
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

/* Already registered styles */
.already-registered {
  text-align: center;
  padding: 20px 0;
}

.already-registered-icon {
  font-size: 48px;
  color: v-bind('config.successColor');
  margin-bottom: 20px;
}

.already-registered-title {
  font-size: 20px;
  color: v-bind('config.textColor');
  margin-bottom: 10px;
  font-weight: 700;
}

.already-registered-message {
  font-size: 14px;
  color: v-bind('config.textColor');
  margin-bottom: 25px;
  line-height: 1.5;
}

.already-registered-btn {
  width: 100%;
  padding: 15px;
  background: v-bind('config.successColor');
  color: white;
  border: none;
  border-radius: v-bind('config.inputBorderRadius');
  font-size: 16px;
  font-weight: 500;
  cursor: not-allowed;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.already-registered-btn i {
  font-size: 18px;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .left-section, .right-section {
    flex: 0 0 100%;
  }

  .top-investors-grid {
    gap: 10px;
  }

  .top-investor-compact {
    height: 140px;
  }

  .top-investor-compact.top-1 {
    height: 150px;
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
    gap: 15px;
    align-items: center;
  }

  .top-investor-compact,
  .top-investor-compact.top-1,
  .top-investor-compact.top-2,
  .top-investor-compact.top-3 {
    height: auto;
    order: 0;
    align-self: stretch;
    flex-direction: row;
    align-items: center;
    padding: 15px;
  }

  .compact-avatar-wrapper {
    margin-bottom: 0;
    margin-right: 15px;
  }

  .compact-info {
    text-align: left;
    margin-bottom: 0;
  }

  .top-investors-title {
    font-size: 18px;
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

  .top-1 .compact-name {
    font-size: 15px;
  }

  .top-1 .compact-package {
    font-size: 12px;
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

  .pagination-container {
    flex-wrap: wrap;
    gap: 10px;
  }

  .page-size-select {
    margin-left: 0;
    margin-top: 10px;
  }

  .already-registered-icon {
    font-size: 36px;
  }

  .already-registered-title {
    font-size: 18px;
  }

  .already-registered-message {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .top-investors-compact {
    padding: 15px;
  }

  .top-investors-title {
    font-size: 16px;
  }

  .top-investor-compact {
    padding: 10px;
  }

  .compact-avatar {
    width: 40px;
    height: 40px;
  }

  .top-1 .compact-avatar {
    width: 45px;
    height: 45px;
  }

  .compact-name {
    font-size: 12px;
  }

  .compact-package {
    font-size: 10px;
  }

  .top-1 .compact-name {
    font-size: 14px;
  }

  .top-1 .compact-package {
    font-size: 11px;
  }

  .compact-badge {
    width: 30px;
    height: 30px;
    font-size: 12px;
    top: -8px;
    right: -8px;
  }

  .top-1 .compact-badge {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }

  .crown-icon {
    font-size: 16px;
    top: -12px;
  }
}
</style>