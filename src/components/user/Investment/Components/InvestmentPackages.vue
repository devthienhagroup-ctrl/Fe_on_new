<template>
  <section class="investment-section">
    <h2 class="section-title">CÁC GÓI GÓP VỐN</h2>

    <div class="container">

      <!-- Cột trái - Quyền lợi -->
      <div class="benefits-column">
        <div
            v-for="(benefit, index) in benefitsData"
            :key="index"
            class="benefit-card"
            :class="{ active: activeBenefit === index }"
        >
          <div class="benefit-header" @click="toggleBenefit(index)">
            <div class="benefit-title">
              <i :class="`fas ${benefit.icon} benefit-icon ${activeBenefit === index ? 'fa-bounce' : ''}`"></i>
              <span>{{ benefit.title }}</span>
            </div>
            <button class="expand-btn">
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
          <div class="benefit-content">
            <div v-html="benefit.content"></div>
          </div>
        </div>
      </div>

      <!-- Cột phải - Bảng gói đầu tư -->
      <div class="packages-column">
        <div class="format-toggle">
          <span class="toggle-label">Hiển thị số: </span>
          <label class="toggle-switch">
            <input type="checkbox" v-model="useShortFormat">
            <span class="slider"></span>
          </label>
          <span class="toggle-label">{{ useShortFormat ? 'Chữ viết' : 'Số nguyên' }}</span>
        </div>

        <table class="investment-table">
          <thead>
          <tr>
            <th>Số tiền góp vốn (VNĐ)</th>
            <th>Gói đầu tư (VNĐ)</th>
            <th>Phần trăm gói (%)</th>
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
          <span :key="formatCurrency(pkg.soTienGopVon, useShortFormat)">
            {{ formatCurrency(pkg.soTienGopVon, useShortFormat) }}
          </span>
              </transition>
            </td>
            <td>
              <transition name="number-transition" mode="out-in">
          <span :key="formatCurrency(pkg.goiDauTu, useShortFormat)">
            {{ formatCurrency(pkg.goiDauTu, useShortFormat) }}
          </span>
              </transition>
            </td>
            <td>{{ pkg.phanTramGoi }}%</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// State
const activeBenefit = ref(0)
const useShortFormat = ref(false)

const benefitsData = [
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
]

// Dữ liệu gói đầu tư
const packagesData = [
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
]

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
    // Thay dấu chấm bằng dấu phẩy
    return result.replace('.', ',');
  } else {
    return amount.toLocaleString('vi-VN');
  }
}

</script>

<style scoped>
.investment-section {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: 'Ubuntu', sans-serif;
}

.section-title {
  background: linear-gradient(135deg, #031358, #2a5298);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-size: 33px;
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
  background: linear-gradient(135deg, #031358, #2a5298);
  border-radius: 2px;
}

.container {
  display: flex;
  gap: 30px;
  align-items: stretch;
  max-width: 100%;
  padding: 0;
}

/* Cột trái - Quyền lợi */
.benefits-column {
  flex: 1;
  background-color: rgba(240, 245, 255, 0.7);
  padding: 25px 30px;
  margin-top: 39px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.benefit-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.08);
  margin-bottom: 15px;
  overflow: hidden;
  border-left: 4px solid #0030ff;
  transition: all 0.3s ease;
}

.benefit-card:hover {
  box-shadow: 0 6px 16px rgba(3, 19, 88, 0.12);
  transform: translateY(-2px);
}

.benefit-header {
  padding: 18px 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #ffffff, #f0f7ff);
}

.benefit-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #031358;
  display: flex;
  align-items: center;
  gap: 12px;
}

.benefit-icon {
  color: #2a5298;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.benefit-icon.fa-bounce {
  color: #031358;
}

.expand-btn {
  background: none;
  border: none;
  color: #2a5298;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.benefit-content {
  padding: 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  background-color: #ffffff;
}

.benefit-card.active .benefit-content {
  max-height: 500px;
  padding: 20px;
}

.benefit-card.active .expand-btn {
  transform: rotate(180deg);
}

.benefit-content p, .benefit-content ul {
  margin-bottom: 10px;
  color: #031358;
}

.benefit-content ul {
  padding-left: 20px;
}

.benefit-content li {
  margin-bottom: 8px;
  color: #031358;
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
  color: #031358;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
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
  background-color: #cbd5e1;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(135deg, #0030ff, #2a5298);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.investment-table {
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(240, 245, 255, 0.7);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.investment-table thead {
  background: linear-gradient(135deg, #031358, #2a5298);
}

.investment-table th {
  color: white;
  padding: 18px 15px;
  text-align: center;
  font-weight: 600;
  font-size: 1.05rem;
}

.investment-table td {
  padding: 18px 15px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
  font-size: 1rem;
  color: #031358;
}

.investment-table tr:last-child td {
  border-bottom: none;
}

.investment-table tbody tr:nth-child(even) {
  background-color: rgba(230, 240, 255, 0.5);
}

/* CHỈ áp dụng hover cho các hàng trong tbody */
.investment-table tbody tr:hover {
  background-color: rgba(219, 234, 254, 0.7);
}

/* Đảm bảo các hàng trong thead không có hover */
.investment-table thead tr:hover {
  background-color: transparent !important;
}

.highlight-row {
  background: linear-gradient(to right, #e6f0ff, #dbeafe) !important;
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
  animation: slideInFade 0.5s ease-out;
}

.number-transition-leave-active {
  animation: slideOutFade 0.3s ease-in;
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