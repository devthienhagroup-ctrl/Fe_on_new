<template>
  <section class="investment-section">
    <h2 class="section-title" :style="{
      '--gradient-start': config.colors.gradientStart,
      '--gradient-end': config.colors.gradientEnd
    }">{{ config.texts.sectionTitle }}</h2>

    <div class="container" :class="{ 'single-column': !hasPackages }">

      <!-- Cột trái - Quyền lợi -->
      <div class="benefits-column" :style="{
        '--benefits-bg': config.colors.benefitsBg,
        '--benefits-shadow': config.shadows.benefits,
        'flex': hasPackages ? '1' : 'none',
        'width': hasPackages ? 'auto' : '100%'
      }">
        <div
            v-for="(benefit, index) in config.benefits"
            :key="index"
            class="benefit-card"
            :class="{ active: activeBenefit === index }"
            :style="{
              '--card-border-color': config.colors.cardBorder,
              '--card-shadow': config.shadows.card,
              '--card-hover-shadow': config.shadows.cardHover,
              '--card-gradient-start': config.colors.cardGradientStart,
              '--card-gradient-end': config.colors.cardGradientEnd
            }"
        >
          <div class="benefit-header" @click="toggleBenefit(index)">
            <div class="benefit-title" :style="{
              '--benefit-color': config.colors.benefitTitle,
              '--icon-color': config.colors.icon,
              '--icon-active-color': config.colors.iconActive
            }">
              <i :class="`fas ${benefit.icon} benefit-icon ${activeBenefit === index ? 'fa-bounce' : ''}`"></i>
              <span>{{ benefit.title }}</span>
            </div>
            <button class="expand-btn" :style="{
              '--expand-btn-color': config.colors.expandButton
            }">
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
          <div class="benefit-content" :style="{
            '--content-color': config.colors.contentText
          }">
            <div v-html="benefit.content"></div>
          </div>
        </div>
      </div>

      <!-- Cột phải - Bảng gói đầu tư (chỉ hiển thị khi có packages) -->
      <div v-if="hasPackages" class="packages-column" :style="{
        'flex': '1',
        'min-width': hasFewPackages ? '400px' : 'auto'
      }">
        <div class="format-toggle">
          <span class="toggle-label" :style="{
            '--toggle-label-color': config.colors.toggleLabel
          }">{{ config.texts.toggleLabel }}</span>
          <label class="toggle-switch" :style="{
            '--slider-bg': config.colors.sliderBg,
            '--slider-checked-gradient-start': config.colors.sliderGradientStart,
            '--slider-checked-gradient-end': config.colors.sliderGradientEnd
          }">
            <input type="checkbox" v-model="useShortFormat">
            <span class="slider"></span>
          </label>
          <span class="toggle-label" :style="{
            '--toggle-label-color': config.colors.toggleLabel
          }">{{ useShortFormat ? config.texts.toggleFormatShort : config.texts.toggleFormatLong }}</span>
        </div>

        <div class="table-container" :class="{ 'few-rows': hasFewPackages }">
          <table class="investment-table" :style="{
            '--table-bg': config.colors.tableBg,
            '--table-shadow': config.shadows.table,
            '--table-header-gradient-start': config.colors.tableHeaderGradientStart,
            '--table-header-gradient-end': config.colors.tableHeaderGradientEnd,
            '--table-border-color': config.colors.tableBorder,
            '--table-row-even-bg': config.colors.tableRowEven,
            '--table-row-hover-bg': config.colors.tableRowHover,
            '--highlight-gradient-start': config.colors.highlightGradientStart,
            '--highlight-gradient-end': config.colors.highlightGradientEnd,
            'margin-bottom': hasFewPackages ? '25px' : '0'
          }">
            <thead>
            <tr>
              <th v-for="(header, index) in config.texts.tableHeaders" :key="index">{{ header }}</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="(pkg, index) in packagesData"
                :key="pkg.id"
                :class="{ 'highlight-row': index === packagesData.length - 1 }"
            >
              <td :style="{
                '--cell-color': config.colors.tableCell
              }">{{ pkg.name }}</td>
              <td>
                <transition name="number-transition" mode="out-in">
                  <span :key="formatCurrency(pkg.amount, useShortFormat)" :style="{
                    '--cell-color': config.colors.tableCell
                  }">
                    {{ formatCurrency(pkg.amount, useShortFormat) }}
                  </span>
                </transition>
              </td>
              <td :style="{
                '--cell-color': config.colors.tableCell
              }">{{ pkg.profitPercent }}%</td>
              <td :style="{
                '--cell-color': config.colors.tableCell
              }">{{ pkg.durationMonths }} tháng</td>
            </tr>
            </tbody>
          </table>

          <!-- Form đăng ký khi có ít gói (<=3) -->
          <div v-if="hasFewPackages" class="registration-form" :style="{
            '--form-bg': config.colors.formBg || 'rgba(240, 245, 255, 0.9)',
            '--form-border': config.colors.formBorder || '#0030ff',
            '--form-title-color': config.colors.formTitleColor || '#031358',
            '--form-label-color': config.colors.formLabelColor || '#2a5298',
            '--input-border': config.colors.inputBorder || '#cbd5e1',
            '--input-focus-border': config.colors.inputFocusBorder || '#0030ff',
            '--button-bg': config.colors.buttonBg || 'linear-gradient(135deg, #0030ff, #2a5298)',
            '--button-hover-bg': config.colors.buttonHoverBg || 'linear-gradient(135deg, #0026cc, #1e3a8a)',
            '--button-color': config.colors.buttonColor || 'white'
          }">
            <h3 class="form-title">
              <i class="fas fa-user-check form-icon"></i>
              {{ config.texts.formTitle || 'ĐĂNG KÝ NHẬN TƯ VẤN' }}
            </h3>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-user"></i>
                  {{ config.texts.nameLabel || 'Họ và tên' }}
                </label>
                <input
                    type="text"
                    v-model="registrationForm.name"
                    class="form-input"
                    :placeholder="config.texts.namePlaceholder || 'Nhập họ và tên của bạn'"
                >
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-phone"></i>
                  {{ config.texts.phoneLabel || 'Số điện thoại' }}
                </label>
                <input
                    type="tel"
                    v-model="registrationForm.phone"
                    class="form-input"
                    :placeholder="config.texts.phonePlaceholder || 'Nhập số điện thoại'"
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-envelope"></i>
                  {{ config.texts.emailLabel || 'Email' }}
                </label>
                <input
                    type="email"
                    v-model="registrationForm.email"
                    class="form-input"
                    :placeholder="config.texts.emailPlaceholder || 'Nhập email của bạn'"
                >
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-box-open"></i>
                  {{ config.texts.packageLabel || 'Chọn gói đầu tư' }}
                </label>
                <select
                    v-model="registrationForm.selectedPackage"
                    class="form-select"
                >
                  <option value="">-- {{ config.texts.selectPlaceholder || 'Chọn gói' }} --</option>
                  <option
                      v-for="pkg in packagesData"
                      :key="pkg.id"
                      :value="pkg.id"
                  >
                    {{ pkg.name }} - {{ formatCurrency(pkg.amount, useShortFormat) }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">
                <i class="fas fa-comment-alt"></i>
                {{ config.texts.messageLabel || 'Tin nhắn / Câu hỏi' }}
              </label>
              <textarea
                  v-model="registrationForm.message"
                  class="form-textarea"
                  :placeholder="config.texts.messagePlaceholder || 'Nhập tin nhắn hoặc câu hỏi của bạn...'"
                  rows="3"
              ></textarea>
            </div>

            <div class="form-submit">
              <button
                  class="submit-button"
                  @click="submitRegistration"
                  :disabled="isSubmitting"
              >
                <i class="fas" :class="isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
                {{ isSubmitting ? (config.texts.submittingText || 'Đang gửi...') : (config.texts.submitButton || 'GỬI ĐĂNG KÝ') }}
              </button>

              <p v-if="config.texts.formNote" class="form-note">
                <i class="fas fa-shield-alt"></i>
                {{ config.texts.formNote }}
              </p>
            </div>

            <!-- Thông báo thành công/ lỗi -->
            <div v-if="submitMessage" class="submit-message" :class="submitStatus">
              <i :class="submitStatus === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
              {{ submitMessage }}
            </div>
          </div>
        </div>
      </div>

      <!-- Thông báo khi không có gói đầu tư -->
      <div v-else class="no-packages-section">
        <div class="no-packages-content" :style="{
          '--notice-bg': config.colors.noticeBg || 'rgba(240, 245, 255, 0.9)',
          '--notice-border': config.colors.noticeBorder || '#0030ff',
          '--notice-color': config.colors.noticeColor || '#031358'
        }">
          <i class="fas fa-clock no-packages-icon"></i>
          <h3>{{ config.texts.noPackagesTitle || 'Các gói đầu tư đang được cập nhật' }}</h3>
          <p>{{ config.texts.noPackagesMessage || 'Hiện tại chúng tôi đang nâng cấp và cập nhật các gói đầu tư mới với nhiều ưu đãi hấp dẫn. Vui lòng quay lại sau hoặc liên hệ để được tư vấn trực tiếp.' }}</p>
          <button v-if="config.texts.contactButton" class="contact-button" :style="{
            '--button-bg': config.colors.buttonBg || 'linear-gradient(135deg, #0030ff, #2a5298)',
            '--button-color': config.colors.buttonColor || 'white'
          }">
            {{ config.texts.contactButton }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// CONFIG OBJECT - Quản lý qua CMS
let config = {
  texts: {
    sectionTitle: "CÁC GÓI GÓP VỐN",
    toggleLabel: "Hiển thị số: ",
    toggleFormatShort: "Chữ viết",
    toggleFormatLong: "Số nguyên",
    tableHeaders: ["Tên gói", "Gói đầu tư (VNĐ)", "Phần trăm gói (%)", "Kỳ hạn đầu tư (tháng)"],
    noPackagesTitle: "Các gói đầu tư đang được cập nhật",
    noPackagesMessage: "Hiện tại chúng tôi đang nâng cấp và cập nhật các gói đầu tư mới với nhiều ưu đãi hấp dẫn. Vui lòng quay lại sau hoặc liên hệ để được tư vấn trực tiếp.",
    contactButton: "Liên hệ ngay",

    // Form texts
    formTitle: "ĐĂNG KÝ NHẬN TƯ VẤN",
    nameLabel: "Họ và tên",
    namePlaceholder: "Nhập họ và tên của bạn",
    phoneLabel: "Số điện thoại",
    phonePlaceholder: "Nhập số điện thoại",
    emailLabel: "Email",
    emailPlaceholder: "Nhập email của bạn",
    packageLabel: "Chọn gói đầu tư",
    selectPlaceholder: "Chọn gói",
    messageLabel: "Tin nhắn / Câu hỏi",
    messagePlaceholder: "Nhập tin nhắn hoặc câu hỏi của bạn...",
    submitButton: "GỬI ĐĂNG KÝ",
    submittingText: "Đang gửi...",
    formNote: "Thông tin của bạn sẽ được bảo mật và chỉ sử dụng cho mục đích tư vấn",
    successMessage: "Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
    errorMessage: "Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp."
  },

  benefits: [
    // ... (giữ nguyên mảng benefits từ file gốc)
  ],

  colors: {
    // ... (giữ nguyên colors từ file gốc)
    // Thêm các màu mới cho form
    formBg: "rgba(240, 245, 255, 0.9)",
    formBorder: "#0030ff",
    formTitleColor: "#031358",
    formLabelColor: "#2a5298",
    inputBorder: "#cbd5e1",
    inputFocusBorder: "#0030ff",
    buttonBg: "linear-gradient(135deg, #0030ff, #2a5298)",
    buttonHoverBg: "linear-gradient(135deg, #0026cc, #1e3a8a)",
    buttonColor: "white",
    noticeBg: "rgba(240, 245, 255, 0.9)",
    noticeBorder: "#0030ff",
    noticeColor: "#031358"
  },

  // ... (giữ nguyên các phần shadows, sizes, spacing, borderRadius, animations)
}

const props = defineProps({
  sectionConfig: Object,
  packages: Array,
  // Prop mới để xử lý submit form
  onSubmitRegistration: {
    type: Function,
    default: null
  }
});

if(props.sectionConfig) {
  config = props.sectionConfig;
  console.log("Đã lấy data từ cha");
}

// State
const activeBenefit = ref(0)
const useShortFormat = ref(false)
const isSubmitting = ref(false)
const submitMessage = ref('')
const submitStatus = ref('') // 'success' hoặc 'error'

// Form data
const registrationForm = reactive({
  name: '',
  phone: '',
  email: '',
  selectedPackage: '',
  message: ''
})

// Computed properties
const packagesData = computed(() => {
  if (props.packages && Array.isArray(props.packages)) {
    return [...props.packages]
        .filter(pkg => pkg.isActive)
        .sort((a, b) => a.amount - b.amount);
  }
  return []; // Trả về mảng rỗng để test UI không có gói
});

const hasPackages = computed(() => {
  return packagesData.value && packagesData.value.length > 0;
});

const hasFewPackages = computed(() => {
  return packagesData.value && packagesData.value.length > 0 && packagesData.value.length <= 3;
});

// Methods
const toggleBenefit = (index) => {
  activeBenefit.value = activeBenefit.value === index ? -1 : index
}

const formatCurrency = (amount, useShortFormat) => {
  if (useShortFormat) {
    let result;
    if (amount >= 1000000000) {
      result = (amount / 1000000000).toFixed(1);
      result = parseFloat(result) + ' tỷ';
    } else if (amount >= 1000000) {
      result = (amount / 1000000).toFixed(1);
      result = parseFloat(result) + ' triệu';
    } else if (amount >= 1000) {
      result = (amount / 1000).toFixed(1);
      result = parseFloat(result) + ' nghìn';
    } else {
      result = amount.toString();
    }
    return result.replace('.', ',');
  } else {
    return amount.toLocaleString('vi-VN');
  }
}

const validateForm = () => {
  if (!registrationForm.name.trim()) {
    return 'Vui lòng nhập họ và tên';
  }
  if (!registrationForm.phone.trim()) {
    return 'Vui lòng nhập số điện thoại';
  }
  // Basic phone validation
  const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
  if (!phoneRegex.test(registrationForm.phone)) {
    return 'Số điện thoại không hợp lệ';
  }
  if (!registrationForm.selectedPackage) {
    return 'Vui lòng chọn gói đầu tư';
  }
  return null;
}

const submitRegistration = async () => {
  // Validate
  const error = validateForm();
  if (error) {
    submitMessage.value = error;
    submitStatus.value = 'error';
    setTimeout(() => {
      submitMessage.value = '';
      submitStatus.value = '';
    }, 3000);
    return;
  }

  isSubmitting.value = true;
  submitMessage.value = '';

  try {
    // Tạo payload
    const selectedPkg = packagesData.value.find(p => p.id === registrationForm.selectedPackage);
    const payload = {
      ...registrationForm,
      packageName: selectedPkg?.name || '',
      packageAmount: selectedPkg?.amount || 0,
      timestamp: new Date().toISOString()
    };

    // Nếu có callback từ parent component
    if (props.onSubmitRegistration && typeof props.onSubmitRegistration === 'function') {
      await props.onSubmitRegistration(payload);
    } else {
      // Fallback: log ra console
      console.log('Registration submitted:', payload);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Success
    submitMessage.value = config.texts.successMessage || 'Đăng ký thành công!';
    submitStatus.value = 'success';

    // Reset form
    Object.keys(registrationForm).forEach(key => {
      registrationForm[key] = '';
    });

    // Auto clear success message
    setTimeout(() => {
      submitMessage.value = '';
      submitStatus.value = '';
    }, 5000);

  } catch (error) {
    console.error('Registration error:', error);
    submitMessage.value = config.texts.errorMessage || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    submitStatus.value = 'error';

    setTimeout(() => {
      submitMessage.value = '';
      submitStatus.value = '';
    }, 3000);
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
/* CSS cơ bản giữ nguyên, thêm styles cho form */

.investment-section {
  max-width: 1400px;
  margin: v-bind('config.spacing.sectionMargin');
  padding: v-bind('config.spacing.sectionPadding');
  font-family: 'Ubuntu', sans-serif;
}

.section-title {
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-size: v-bind('config.sizes.sectionTitle');
  font-weight: bold;
  margin-bottom: 30px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  border-radius: v-bind('config.borderRadius.sectionTitleLine');
}

.container {
  display: flex;
  gap: v-bind('config.spacing.containerGap');
  align-items: flex-start;
  max-width: 100%;
  padding: 0;
  transition: all 0.3s ease;
}

.container.single-column {
  justify-content: center;
}

/* Cột trái - Quyền lợi */
.benefits-column {
  background-color: var(--benefits-bg);
  padding: v-bind('config.spacing.benefitsPadding');
  margin-top: v-bind('config.spacing.benefitsMargin');
  border-radius: v-bind('config.borderRadius.benefitsColumn');
  box-shadow: var(--benefits-shadow);
  transition: all 0.3s ease;
}

/* Cột phải - Bảng gói đầu tư */
.packages-column {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

/* Khi có ít gói */
.table-container.few-rows {
  display: flex;
  flex-direction: column;
}

.table-container {
  position: relative;
  display: flex;
  flex-direction: column;
}

.investment-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--table-bg);
  border-radius: v-bind('config.borderRadius.investmentTable');
  overflow: hidden;
  box-shadow: var(--table-shadow);
  flex-shrink: 0;
}

/* Form đăng ký */
.registration-form {
  width: 100%;
  background-color: var(--form-bg);
  border: 2px solid var(--form-border);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 6px 20px rgba(3, 19, 88, 0.1);
  margin-top: 10px;
}

.form-title {
  color: var(--form-title-color);
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.form-icon {
  color: #0030ff;
  font-size: 1.1rem;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  margin-bottom: 15px;
}

.form-group.full-width {
  flex: 0 0 100%;
}

.form-label {
  display: block;
  color: var(--form-label-color);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-label i {
  font-size: 0.85rem;
  opacity: 0.8;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--input-border);
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: 'Ubuntu', sans-serif;
  transition: all 0.3s ease;
  background-color: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 3px rgba(0, 48, 255, 0.1);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-submit {
  margin-top: 25px;
  text-align: center;
}

.submit-button {
  background: var(--button-bg);
  color: var(--button-color);
  border: none;
  padding: 14px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-button:hover:not(:disabled) {
  background: var(--button-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 48, 255, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.form-note {
  margin-top: 12px;
  font-size: 0.85rem;
  color: #666;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.form-note i {
  color: #2a5298;
  font-size: 0.9rem;
}

/* Thông báo submit */
.submit-message {
  margin-top: 15px;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

.submit-message.success {
  background-color: rgba(34, 197, 94, 0.1);
  color: #166534;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.submit-message.error {
  background-color: rgba(239, 68, 68, 0.1);
  color: #991b1b;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.submit-message i {
  font-size: 1rem;
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

/* Khi không có gói đầu tư */
.no-packages-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 20px;
}

.no-packages-content {
  background-color: var(--notice-bg);
  border: 2px solid var(--notice-border);
  border-radius: 15px;
  padding: 40px 30px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 8px 25px rgba(3, 19, 88, 0.1);
}

.no-packages-icon {
  font-size: 3rem;
  color: #2a5298;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

.no-packages-content h3 {
  color: var(--notice-color);
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.no-packages-content p {
  color: var(--notice-color);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 25px;
  opacity: 0.9;
}

.contact-button {
  background: var(--button-bg);
  color: var(--button-color);
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 48, 255, 0.3);
}

/* Animation cho icon */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 992px) {
  .container {
    flex-direction: column;
  }

  .container.single-column {
    flex-direction: column;
  }

  .benefits-column, .packages-column, .no-packages-section {
    width: 100%;
  }

  .no-packages-content {
    padding: 30px 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }
}

@media (max-width: 768px) {
  .investment-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .investment-table th,
  .investment-table td {
    min-width: 120px;
  }

  .no-packages-icon {
    font-size: 2.5rem;
  }

  .no-packages-content h3 {
    font-size: 1.3rem;
  }

  .registration-form {
    padding: 20px 15px;
  }
}

/* Animation cho transition component */
.number-transition-enter-active {
  animation: slideInFade v-bind('config.animations.numberEnter');
}

.number-transition-leave-active {
  animation: slideOutFade v-bind('config.animations.numberLeave');
}

@keyframes slideInFade {
  0% {
    opacity: 0;
    transform: translateY(-15px) scale(0.9);
  }
  60% {
    transform: translateY(3px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideOutFade {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(15px) scale(0.9);
  }
}

.investment-table td span {
  display: inline-block;
}


.investment-section {
  max-width: 1400px;
  margin: v-bind('config.spacing.sectionMargin');
  padding: v-bind('config.spacing.sectionPadding');
  font-family: 'Ubuntu', sans-serif;
}

.section-title {
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-size: v-bind('config.sizes.sectionTitle');
  font-weight: bold;
  margin-bottom: 30px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  border-radius: v-bind('config.borderRadius.sectionTitleLine');
}

.container {
  display: flex;
  gap: v-bind('config.spacing.containerGap');
  align-items: flex-start;
  max-width: 100%;
  padding: 0;
  transition: all 0.3s ease;
}

.container.single-column {
  justify-content: center;
}

/* Cột trái - Quyền lợi */
.benefits-column {
  background-color: var(--benefits-bg);
  padding: v-bind('config.spacing.benefitsPadding');
  margin-top: v-bind('config.spacing.benefitsMargin');
  border-radius: v-bind('config.borderRadius.benefitsColumn');
  box-shadow: var(--benefits-shadow);
  transition: all 0.3s ease;
}

/* Cột phải - Bảng gói đầu tư */
.packages-column {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

/* Khi có ít gói */
.table-container.few-rows {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.table-container {
  position: relative;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.investment-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--table-bg);
  border-radius: v-bind('config.borderRadius.investmentTable');
  overflow: hidden;
  box-shadow: var(--table-shadow);
  flex-grow: 1;
  min-height: v-bind('packagesData.length <= 2 ? "200px" : "auto"');
}

/* Thông báo khi có ít gói */
.few-packages-notice {
  margin-top: 20px;
  padding: 15px;
  background: rgba(3, 19, 88, 0.05);
  border-radius: 8px;
  border-left: 3px solid #2a5298;
  text-align: center;
  width: 100%;
}

.few-packages-notice i {
  color: #2a5298;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.few-packages-notice p {
  color: #031358;
  font-size: 0.9rem;
  margin: 0;
}

/* Khi không có gói đầu tư */
.no-packages-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 20px;
}

.no-packages-content {
  background-color: var(--notice-bg);
  border: 2px solid var(--notice-border);
  border-radius: 15px;
  padding: 40px 30px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 8px 25px rgba(3, 19, 88, 0.1);
}

.no-packages-icon {
  font-size: 3rem;
  color: #2a5298;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

.no-packages-content h3 {
  color: var(--notice-color);
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.no-packages-content p {
  color: var(--notice-color);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 25px;
  opacity: 0.9;
}

.contact-button {
  background: var(--button-bg);
  color: var(--button-color);
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 48, 255, 0.3);
}

/* Animation cho icon */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 992px) {
  .container {
    flex-direction: column;
  }

  .container.single-column {
    flex-direction: column;
  }

  .benefits-column, .packages-column, .no-packages-section {
    width: 100%;
  }

  .no-packages-content {
    padding: 30px 20px;
  }
}

@media (max-width: 768px) {
  .investment-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .investment-table th,
  .investment-table td {
    min-width: 120px;
  }

  .no-packages-icon {
    font-size: 2.5rem;
  }

  .no-packages-content h3 {
    font-size: 1.3rem;
  }
}

/* Animation cho transition component */
.number-transition-enter-active {
  animation: slideInFade v-bind('config.animations.numberEnter');
}

.number-transition-leave-active {
  animation: slideOutFade v-bind('config.animations.numberLeave');
}

@keyframes slideInFade {
  0% {
    opacity: 0;
    transform: translateY(-15px) scale(0.9);
  }
  60% {
    transform: translateY(3px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideOutFade {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(15px) scale(0.9);
  }
}

.investment-table td span {
  display: inline-block;
}

/* CSS giữ nguyên - chỉ cần thêm width cho các cột */
.investment-section {
  max-width: 1400px;
  margin: v-bind('config.spacing.sectionMargin');
  padding: v-bind('config.spacing.sectionPadding');
  font-family: 'Ubuntu', sans-serif;
}

.section-title {
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-size: v-bind('config.sizes.sectionTitle');
  font-weight: bold;
  margin-bottom: 30px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  border-radius: v-bind('config.borderRadius.sectionTitleLine');
}

.container {
  display: flex;
  gap: v-bind('config.spacing.containerGap');
  align-items: stretch;
  max-width: 100%;
  padding: 0;
}

/* Cột trái - Quyền lợi */
.benefits-column {
  flex: 1;
  background-color: var(--benefits-bg);
  padding: v-bind('config.spacing.benefitsPadding');
  margin-top: v-bind('config.spacing.benefitsMargin');
  border-radius: v-bind('config.borderRadius.benefitsColumn');
  box-shadow: var(--benefits-shadow);
}

.benefit-card {
  background-color: #ffffff;
  border-radius: v-bind('config.borderRadius.benefitCard');
  box-shadow: var(--card-shadow);
  margin-bottom: v-bind('config.spacing.benefitCardMargin');
  overflow: hidden;
  border-left: 4px solid var(--card-border-color);
  transition: v-bind('config.animations.cardTransition');
}

.benefit-card:hover {
  box-shadow: var(--card-hover-shadow);
  transform: translateY(-2px);
}

.benefit-header {
  padding: v-bind('config.spacing.benefitHeaderPadding');
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, var(--card-gradient-start), var(--card-gradient-end));
}

.benefit-title {
  font-size: v-bind('config.sizes.benefitTitle');
  font-weight: 600;
  color: var(--benefit-color);
  display: flex;
  align-items: center;
  gap: 12px;
}

.benefit-icon {
  color: var(--icon-color);
  font-size: v-bind('config.sizes.benefitIcon');
  width: 24px;
  text-align: center;
  transition: v-bind('config.animations.cardTransition');
}

.benefit-icon.fa-bounce {
  color: var(--icon-active-color);
}

.expand-btn {
  background: none;
  border: none;
  color: var(--expand-btn-color);
  font-size: v-bind('config.sizes.expandBtn');
  cursor: pointer;
  transition: transform v-bind('config.animations.cardTransition');
}

.benefit-content {
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: v-bind('config.animations.contentTransition');
  background-color: #ffffff;
}

.benefit-card.active .benefit-content {
  max-height: 500px;
  padding: v-bind('config.spacing.benefitContentPadding');
}

.benefit-card.active .expand-btn {
  transform: rotate(180deg);
}

.benefit-content p, .benefit-content ul {
  margin-bottom: 10px;
  color: var(--content-color);
}

.benefit-content ul {
  padding-left: 20px;
}

.benefit-content li {
  margin-bottom: 8px;
  color: var(--content-color);
}

/* Cột phải - Bảng gói đầu tư */
.packages-column {
  flex: 1;
}

.format-toggle {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 15px;
  gap: 10px;
}

.toggle-label {
  font-weight: 500;
  color: var(--toggle-label-color);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: v-bind('config.sizes.toggleSwitchWidth');
  height: v-bind('config.sizes.toggleSwitchHeight');
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--slider-bg);
  transition: v-bind('config.animations.sliderTransition');
  border-radius: v-bind('config.borderRadius.toggleSwitch');
}

.slider:before {
  position: absolute;
  content: "";
  height: v-bind('config.sizes.sliderSize');
  width: v-bind('config.sizes.sliderSize');
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: v-bind('config.animations.sliderTransition');
  border-radius: v-bind('config.borderRadius.slider');
}

input:checked + .slider {
  background: linear-gradient(135deg, var(--slider-checked-gradient-start), var(--slider-checked-gradient-end));
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.investment-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--table-bg);
  border-radius: v-bind('config.borderRadius.investmentTable');
  overflow: hidden;
  box-shadow: var(--table-shadow);
}

.investment-table thead {
  background: linear-gradient(135deg, var(--table-header-gradient-start), var(--table-header-gradient-end));
}

.investment-table th {
  color: white;
  padding: v-bind('config.spacing.tableHeaderPadding');
  text-align: center;
  font-weight: 600;
  font-size: v-bind('config.sizes.tableHeader');
}

.investment-table td {
  padding: v-bind('config.spacing.tableCellPadding');
  text-align: center;
  border-bottom: 1px solid var(--table-border-color);
  font-size: v-bind('config.sizes.tableCell');
  color: var(--cell-color);
}

.investment-table tr:last-child td {
  border-bottom: none;
}

.investment-table tbody tr:nth-child(even) {
  background-color: var(--table-row-even-bg);
}

/* CHỈ áp dụng hover cho các hàng trong tbody */
.investment-table tbody tr:hover {
  background-color: var(--table-row-hover-bg);
}

/* Đảm bảo các hàng trong thead không có hover */
.investment-table thead tr:hover {
  background-color: transparent !important;
}

.highlight-row {
  background: linear-gradient(to right, var(--highlight-gradient-start), var(--highlight-gradient-end)) !important;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 992px) {
  .container {
    flex-direction: column;
  }

  .benefits-column, .packages-column {
    width: 100%;
  }

  /* Responsive table trên mobile */
  @media (max-width: 768px) {
    .investment-table {
      display: block;
      overflow-x: auto;
      white-space: nowrap;
    }

    .investment-table th,
    .investment-table td {
      min-width: 120px;
    }
  }
}

/* Animation cho transition component */
.number-transition-enter-active {
  animation: slideInFade v-bind('config.animations.numberEnter');
}

.number-transition-leave-active {
  animation: slideOutFade v-bind('config.animations.numberLeave');
}

@keyframes slideInFade {
  0% {
    opacity: 0;
    transform: translateY(-15px) scale(0.9);
  }
  60% {
    transform: translateY(3px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideOutFade {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(15px) scale(0.9);
  }
}

/* Đảm bảo span trong td có display inline-block để animation hoạt động */
.investment-table td span {
  display: inline-block;
}
</style>