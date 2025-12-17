<template>
  <section class="investment-section">
    <h2 class="section-title" :style="{
      '--gradient-start': config.colors.gradientStart,
      '--gradient-end': config.colors.gradientEnd
    }">{{ config.texts.sectionTitle }}</h2>

    <div class="container">

      <!-- Cột trái - Quyền lợi -->
      <div class="benefits-column" :style="{
        '--benefits-bg': config.colors.benefitsBg,
        '--benefits-shadow': config.shadows.benefits
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

      <!-- Cột phải - Bảng gói đầu tư -->
      <div class="packages-column">
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

        <table class="investment-table" :style="{
          '--table-bg': config.colors.tableBg,
          '--table-shadow': config.shadows.table,
          '--table-header-gradient-start': config.colors.tableHeaderGradientStart,
          '--table-header-gradient-end': config.colors.tableHeaderGradientEnd,
          '--table-border-color': config.colors.tableBorder,
          '--table-row-even-bg': config.colors.tableRowEven,
          '--table-row-hover-bg': config.colors.tableRowHover,
          '--highlight-gradient-start': config.colors.highlightGradientStart,
          '--highlight-gradient-end': config.colors.highlightGradientEnd
        }">
          <thead>
          <tr>
            <th v-for="(header, index) in config.texts.tableHeaders" :key="index">{{ header }}</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(pkg, index) in packagesData"
              :key="index"
              :class="{ 'highlight-row': index === packagesData.length - 1 }"
          >
            <td>
              <transition name="number-transition" mode="out-in">
                <span :key="formatCurrency(pkg.soTienGopVon, useShortFormat)" :style="{
                  '--cell-color': config.colors.tableCell
                }">
                  {{ formatCurrency(pkg.soTienGopVon, useShortFormat) }}
                </span>
              </transition>
            </td>
            <td>
              <transition name="number-transition" mode="out-in">
                <span :key="formatCurrency(pkg.goiDauTu, useShortFormat)" :style="{
                  '--cell-color': config.colors.tableCell
                }">
                  {{ formatCurrency(pkg.goiDauTu, useShortFormat) }}
                </span>
              </transition>
            </td>
            <td :style="{
              '--cell-color': config.colors.tableCell
            }">{{ pkg.phanTramGoi }}%</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// CONFIG OBJECT - Quản lý qua CMS
let config = {
  texts: {
    sectionTitle: "CÁC GÓI GÓP VỐN",
    toggleLabel: "Hiển thị số: ",
    toggleFormatShort: "Chữ viết",
    toggleFormatLong: "Số nguyên",
    tableHeaders: ["Số tiền góp vốn (VNĐ)", "Gói đầu tư (VNĐ)", "Phần trăm gói (%)"]
  },

  benefits: [
    {
      title: "Nhận lợi nhuận hấp dẫn theo từng gói",
      content: `
        <p>Nhà đầu tư được hưởng mức lợi nhuận cố định, tăng dần theo gói lựa chọn — từ <strong>1% đến 15%</strong> tùy số tiền góp vốn.</p>
        <p>Lợi nhuận được chi trả đều đặn theo chu kỳ cam kết.</p>
      `,
      icon: "fa-chart-line"
    },
    {
      title: "Cam kết bảo toàn vốn",
      content: `
        <p>Số tiền góp vốn được đảm bảo theo điều khoản hợp đồng.</p>
        <ul>
          <li>Có thể rút vốn khi hết kỳ hạn.</li>
          <li>Hỗ trợ rút vốn linh hoạt tùy chính sách.</li>
        </ul>
      `,
      icon: "fa-shield-alt"
    },
    {
      title: "Minh bạch trong báo cáo tài chính",
      content: `
        <p>Nhà đầu tư được cung cấp báo cáo chi tiết theo định kỳ.</p>
        <ul>
          <li>Báo cáo doanh thu.</li>
          <li>Báo cáo chi phí.</li>
          <li>Báo cáo lợi nhuận.</li>
        </ul>
      `,
      icon: "fa-file-invoice-dollar"
    },
    {
      title: "Quyền theo dõi hiệu quả đầu tư",
      content: `
        <p>Thông tin được cập nhật liên tục:</p>
        <ul>
          <li>Tổng vốn đã góp.</li>
          <li>Lãi đã nhận.</li>
          <li>Lãi dự kiến kỳ tới.</li>
          <li>Hiệu suất theo tháng/quý.</li>
        </ul>
      `,
      icon: "fa-chart-bar"
    },
    {
      title: "Chính sách ưu đãi & hỗ trợ linh hoạt",
      content: `
        <p>Nhà đầu tư được hưởng nhiều quyền lợi đặc biệt và hỗ trợ tối đa:</p>
        <ul>
          <li>Tham gia sự kiện nội bộ.</li>
          <li>Ưu tiên dự án mới.</li>
          <li>Cơ hội nâng cấp gói để nhận lãi cao hơn.</li>
          <li>Hỗ trợ tư vấn 24/7: giải đáp thắc mắc, hướng dẫn gói đầu tư, tư vấn nâng lợi nhuận.</li>
          <li>Linh hoạt chọn gói theo khả năng tài chính: từ 20 triệu đến 300 triệu, đầu tư nhiều gói cùng lúc.</li>
        </ul>
      `,
      icon: "fa-award"
    },
    {
      title: "Hợp đồng pháp lý rõ ràng",
      content: `
        <p>Toàn bộ quá trình góp vốn và nhận lãi đều được thể hiện trong hợp đồng minh bạch.</p>
        <ul>
          <li>Cam kết quyền lợi.</li>
          <li>Điều khoản rõ ràng.</li>
          <li>Bảo đảm tính pháp lý.</li>
        </ul>
      `,
      icon: "fa-file-contract"
    }
  ],

  colors: {
    gradientStart: "#031358",
    gradientEnd: "#2a5298",
    benefitsBg: "rgba(240, 245, 255, 0.7)",
    cardBorder: "#0030ff",
    cardGradientStart: "#ffffff",
    cardGradientEnd: "#f0f7ff",
    benefitTitle: "#031358",
    icon: "#2a5298",
    iconActive: "#031358",
    expandButton: "#2a5298",
    contentText: "#031358",
    toggleLabel: "#031358",
    sliderBg: "#cbd5e1",
    sliderGradientStart: "#0030ff",
    sliderGradientEnd: "#2a5298",
    tableBg: "rgba(240, 245, 255, 0.7)",
    tableHeaderGradientStart: "#031358",
    tableHeaderGradientEnd: "#2a5298",
    tableBorder: "#e2e8f0",
    tableRowEven: "rgba(230, 240, 255, 0.5)",
    tableRowHover: "rgba(219, 234, 254, 0.7)",
    tableCell: "#031358",
    highlightGradientStart: "#e6f0ff",
    highlightGradientEnd: "#dbeafe"
  },

  shadows: {
    benefits: "0 4px 15px rgba(0, 0, 0, 0.1)",
    card: "0 4px 12px rgba(3, 19, 88, 0.08)",
    cardHover: "0 6px 16px rgba(3, 19, 88, 0.12)",
    table: "0 4px 15px rgba(0, 0, 0, 0.1)"
  },

  sizes: {
    sectionTitle: "33px",
    benefitTitle: "1.1rem",
    benefitIcon: "1.2rem",
    expandBtn: "1.2rem",
    tableHeader: "1.05rem",
    tableCell: "1rem",
    toggleSwitchWidth: "50px",
    toggleSwitchHeight: "24px",
    sliderSize: "18px"
  },

  spacing: {
    sectionMargin: "40px auto",
    sectionPadding: "0 20px",
    containerGap: "30px",
    benefitsPadding: "25px 30px",
    benefitsMargin: "39px",
    benefitCardMargin: "15px",
    benefitHeaderPadding: "18px 20px",
    benefitContentPadding: "20px",
    tableHeaderPadding: "18px 15px",
    tableCellPadding: "18px 15px"
  },

  borderRadius: {
    sectionTitleLine: "2px",
    benefitsColumn: "15px",
    benefitCard: "10px",
    toggleSwitch: "24px",
    slider: "50%",
    investmentTable: "15px"
  },

  animations: {
    cardTransition: "all 0.3s ease",
    contentTransition: "max-height 0.3s ease, padding 0.3s ease",
    sliderTransition: "0.4s",
    numberEnter: "0.5s ease-out",
    numberLeave: "0.3s ease-in"
  }
}

const props = defineProps({
  sectionData: Object
});

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã lấy data từ cha");
}

// State
const activeBenefit = ref(0)
const useShortFormat = ref(false)

// Dữ liệu gói đầu tư - Sẽ load từ DB
const packagesData = ref([
  {
    soTienGopVon: 300000000,
    goiDauTu: 20000000,
    phanTramGoi: 1.0
  },
  {
    soTienGopVon: 300000000,
    goiDauTu: 30000000,
    phanTramGoi: 1.5
  },
  {
    soTienGopVon: 300000000,
    goiDauTu: 50000000,
    phanTramGoi: 2.5
  },
  {
    soTienGopVon: 300000000,
    goiDauTu: 70000000,
    phanTramGoi: 3.5
  },
  {
    soTienGopVon: 300000000,
    goiDauTu: 100000000,
    phanTramGoi: 5.0
  },
  {
    soTienGopVon: 300000000,
    goiDauTu: 150000000,
    phanTramGoi: 7.5
  },
  {
    soTienGopVon: 300000000,
    goiDauTu: 200000000,
    phanTramGoi: 10.0
  },
  {
    soTienGopVon: 300000000,
    goiDauTu: 300000000,
    phanTramGoi: 15.0
  }
])

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

// Giả sử có function để load packages từ DB
const loadPackagesFromDB = async () => {
  // Simulate API call
  // const response = await fetch('/api/investment-packages')
  // packagesData.value = await response.json()
}

// Load packages khi component mounted (nếu cần)
// onMounted(() => {
//   loadPackagesFromDB()
// })

</script>

<style scoped>
/* CSS giữ nguyên */
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