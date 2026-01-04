<template>
  <div class="service-payment-container">
    <div class="security-header">
      <h1 class="security-title">Gói dịch vụ và thanh toán</h1>
    </div>
    <div class="main-content">
      <MembershipCard class="member-ship-card" :member-data="user_card"/>

      <!-- Balance and Actions Section -->
      <div class="balance-actions-section">
        <div class="balance-card">
          <div class="balance-header">
            <h3 class="balance-title">Số dư tài khoản</h3>
            <button class="eye-toggle" @click="toggleBalanceVisibility">
              <i class="fas" :class="balanceVisible ? 'fa-eye' : 'fa-eye-slash'"></i>
            </button>
          </div>
          <div class="balance-amount">
            <span class="amount" v-if="balanceVisible">1,250,000 VNĐ</span>
            <span class="amount hidden" v-else>****** VNĐ</span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="action-btn deposit">
            <i class="fas fa-sign-in-alt"></i>
            <span>Nạp tiền</span>
          </button>
          <button class="action-btn withdraw">
            <i class="fas fa-sign-out-alt"></i>
            <span>Rút tiền</span>
          </button>
          <button class="action-btn history" @click="router.push({name: 'transaction-history'})">
            <i class="fas fa-history"></i>
            <span>Lịch sử giao dịch</span>
          </button>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="chart-section">
        <div class="chart-header">
          <div class="chart-controls-left">
            <select v-model="selectedMonth" class="month-select">
              <option value="1">Tháng 1</option>
              <option value="2">Tháng 2</option>
              <option value="3">Tháng 3</option>
              <option value="4">Tháng 4</option>
              <option value="5">Tháng 5</option>
              <option value="6">Tháng 6</option>
              <option value="7">Tháng 7</option>
              <option value="8">Tháng 8</option>
              <option value="9">Tháng 9</option>
              <option value="10">Tháng 10</option>
              <option value="11">Tháng 11</option>
              <option value="12">Tháng 12</option>
            </select>
          </div>
          <div class="chart-controls-right">
            <button class="chart-btn download" @click="downloadChart">
              <i class="fas fa-download"></i>
              Tải xuống
            </button>
            <button class="chart-btn table-view" @click="toggleTableView">
              <i class="fas fa-table"></i>
              Xem dạng bảng
            </button>
          </div>
        </div>

        <div class="chart-container">
          <Line v-if="!tableView" :data="chartData" :options="chartOptions" />
          <div v-else class="table-view">
            <table class="transaction-table">
              <thead>
              <tr>
                <th>Ngày</th>
                <th>Giao dịch</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in tableData" :key="item.id">
                <td>{{ item.date }}</td>
                <td>{{ item.transaction }}</td>
                <td>{{ item.amount }}</td>
                <td :class="item.status">
                  <i v-if="item.status === 'success'" class="fas fa-check-circle status-icon success"></i>
                  <i v-else-if="item.status === 'pending'" class="fas fa-clock status-icon pending"></i>
                  {{ item.statusText }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Additional Services Section -->
      <div class="services-section">
        <div class="service-item" @click="router.push({name: 'service-package'})">
          <div class="service-info">
            <h3 class="service-title">Nâng cấp gói thành viên</h3>
            <p class="service-subtitle">Chọn gói phù hợp để tận hưởng thêm quyền lợi và tính năng ưu việt.</p>
          </div>
          <button class="service-arrow">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <div class="service-item" @click="router.push({name: 'package-benefits'})">
          <div class="service-info">
            <h3 class="service-title">Quyền lợi</h3>
            <p class="service-subtitle">Xem lại còn lại của mỗi dịch vụ</p>
          </div>
          <button class="service-arrow">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <div class="service-item">
          <div class="service-info">
            <h3 class="service-title">Hủy đăng ký gói hiện tại</h3>
            <p class="service-subtitle">Dừng dịch vụ không cần thiết một cách nhanh chóng và an toàn.</p>
          </div>
          <button class="service-arrow">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {useRouter} from "vue-router";
import MembershipCard from "./MembershipCard.vue";
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Đăng ký các thành phần ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const props = defineProps({
  user_card: Object
});
const router = useRouter()

// Balance visibility
const balanceVisible = ref(false);

const toggleBalanceVisibility = () => {
  balanceVisible.value = !balanceVisible.value;
};

// Chart data and options
const selectedMonth = ref('6');
const tableView = ref(false);

const chartData = ref({
  labels: ['1', '5', '10', '15', '20', '25', '30'],
  datasets: [
    {
      label: 'Chi tiêu (VND)',
      data: [1200000, 1900000, 1500000, 2500000, 2200000, 3000000, 2800000],
      borderColor: '#031358',
      backgroundColor: 'rgba(3, 19, 88, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#031358',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 5,
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: true,
      text: 'Biểu đồ chi tiêu tháng ' + selectedMonth.value
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return value.toLocaleString('vi-VN') + ' VND';
        }
      }
    }
  }
});

// Table data
const tableData = ref([
  { id: 1, date: '01/06/2024', transaction: 'Nạp tiền', amount: '2,000,000 VND', status: 'success', statusText: 'Thành công' },
  { id: 2, date: '05/06/2024', transaction: 'Mua gói Premium', amount: '500,000 VND', status: 'success', statusText: 'Thành công' },
  { id: 3, date: '10/06/2024', transaction: 'Rút tiền', amount: '1,000,000 VND', status: 'pending', statusText: 'Đang xử lý' },
  { id: 4, date: '15/06/2024', transaction: 'Nạp tiền', amount: '1,500,000 VND', status: 'success', statusText: 'Thành công' },
  { id: 5, date: '20/06/2024', transaction: 'Thanh toán hóa đơn', amount: '350,000 VND', status: 'success', statusText: 'Thành công' },
]);

const downloadChart = () => {
  // Logic để tải biểu đồ dưới dạng PNG
  console.log('Download chart as PNG');
};

const toggleTableView = () => {
  tableView.value = !tableView.value;
};

onMounted(() => {
  // Khởi tạo dữ liệu ngẫu nhiên cho biểu đồ
  const randomData = Array.from({length: 7}, () => Math.floor(Math.random() * 3000000) + 1000000);
  chartData.value.datasets[0].data = randomData;
});
</script>

<style scoped>
.security-header {
  text-align: center;
  margin-bottom: 40px;
  margin-top:60px  ;
}

.security-title {
  font-size: 33px;
  background: linear-gradient(to right, #031358, #0030FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 15px 0;
}

.main-content {
  max-width: 95%;
  margin: 0 auto;

}

/* Balance and Actions Section */
.balance-actions-section {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.balance-card {
  flex: 40%;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.balance-title {
  font-size: 18px;
  color: #000;
  margin: 0;
}

.eye-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #031358;
  font-size: 18px;
  padding: 5px;
}

.balance-amount {
  font-size: 28px;
  font-weight: bold;
  color: #031358;
}

.hidden {
  letter-spacing: 3px;
}

.action-buttons {
  flex: 60%;
  display: flex;
  gap: 15px;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 12px;
  padding: 20px 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn i {
  font-size: 24px;
  color: #031358;
  margin-bottom: 10px;
}

.action-btn span {
  color: #000;
  font-size: 14px;
  font-weight: 500;
}

/* Chart Section */
.chart-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.month-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;

}

.chart-controls-right {
  display: flex;
  gap: 10px;
}

.chart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border: 1px solid #031358;
  border-radius: 6px;
  background: white;
  color: #031358;
  cursor: pointer;

  transition: all 0.2s;
}

.chart-btn:hover {
  background: #031358;
  color: white;
}

.chart-container {
  height: 400px;
  position: relative;
}

.table-view {
  height: 100%;
  overflow-y: auto;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
}

.transaction-table th,
.transaction-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.transaction-table th {
  font-weight: bold;
  color: #000;
}

.status-icon {
  margin-right: 5px;
}

.transaction-table td.success {
  color: green;
}

.transaction-table td.success .status-icon {
  color: green;
}

.transaction-table td.pending {
  color: orange;
}

.transaction-table td.pending .status-icon {
  color: orange;
}

/* Services Section */
.services-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.service-info {
  flex: 1;
}

.service-title {
  font-size: 20px;
  color: #000;
  margin: 0 0 5px 0;
}

.service-subtitle {
  font-size: 15px;
  color: #666;
  margin: 0;
}

.service-arrow {
  background: none;
  border: none;
  color: #031358;
  font-size: 18px;
  cursor: pointer;
  padding: 5px 10px;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .security-title {
    font-size: 24px;
  }

  .balance-actions-section {
    flex-direction: column;
    gap: 15px;
  }

  .balance-card {
    flex: none;
    width: 100%;
  }

  .action-buttons {
    flex: none;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .action-btn {
    padding: 15px 5px;
    min-height: 80px;
  }

  .action-btn i {
    font-size: 20px;
    margin-bottom: 5px;
  }

  .action-btn span {
    font-size: 12px;
    text-align: center;
  }

  .chart-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .chart-controls-left,
  .chart-controls-right {
    width: 100%;
  }

  .chart-controls-right {
    justify-content: space-between;
  }

  .chart-btn {
    flex: 1;
    justify-content: center;
  }

  .chart-container {
    height: 300px;
  }

  .service-item {
    padding: 15px;
  }

  .service-title {
    font-size: 18px;
  }

  .service-subtitle {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .security-title {
    font-size: 20px;
  }

  .balance-amount {
    font-size: 24px;
  }

  .action-buttons {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .action-btn {
    flex-direction: row;
    justify-content: flex-start;
    padding: 12px 15px;
    min-height: auto;
  }

  .action-btn i {
    margin-bottom: 0;
    margin-right: 10px;
    font-size: 18px;
  }

  .chart-btn {
    font-size: 14px;
    padding: 8px 10px;
  }

  .transaction-table {
    font-size: 14px;
  }

  .transaction-table th,
  .transaction-table td {
    padding: 8px;
  }
}
</style>