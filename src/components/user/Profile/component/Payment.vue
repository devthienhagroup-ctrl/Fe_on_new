<template>
  <div class="service-payment-container">
    <div class="security-header">
      <h1 class="security-title">Thanh toán và ví cá nhân</h1>
    </div>
    <div class="main-content">
      <MembershipCard class="member-ship-card" :member-data="user_card"/>

      <!-- Balance and Actions Section -->
      <div class="balance-actions-section">
        <div class="balance-card">
          <div class="balance-header">
            <h3 class="balance-title">Số dư khả dụng</h3>
            <button class="eye-toggle" @click="toggleBalanceVisibility">
              <i class="fas" :class="balanceVisible ? 'fa-eye' : 'fa-eye-slash'"></i>
            </button>
          </div>
          <div class="balance-amount">
            <span class="amount" v-if="balanceVisible">{{ formattedAvailableBalance }} VNĐ</span>
            <span class="amount hidden" v-else>****** VNĐ</span>
          </div>
          <div class="pending-amount">
            <span class="pending-label">Chờ rút</span>
            <span class="pending-value" v-if="balanceVisible">{{ formattedPendingBalance }} VNĐ</span>
            <span class="pending-value hidden" v-else>****** VNĐ</span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="action-btn deposit" @click="$router.push('/nap-tien-ca-nhan')">
            <i class="fas fa-sign-in-alt"></i>
            <span>Nạp tiền</span>
          </button>
          <button class="action-btn withdraw" @click="openWithdrawModal">
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
            <select v-model="selectedYear" class="year-select">
              <option v-for="year in yearOptions" :key="year" :value="year">
                Năm {{ year }}
              </option>
            </select>
          </div>
        </div>

        <div class="chart-container">
          <Line :data="chartData" :options="chartOptions"/>
        </div>
      </div>
    </div>
  </div>
  <!-- WITHDRAW MODAL -->
  <div v-if="showWithdrawModal" class="withdraw-overlay">
    <div class="withdraw-modal">

      <h3 class="modal-title">Rút tiền từ ví</h3>

      <div class="modal-body">
        <!-- BANK SELECT -->
        <div class="bank-section">
          <label>Ngân hàng</label>

          <div class="bank-slider">
            <div
                v-for="bank in banks"
                :key="bank.code"
                class="bank-item"
                :class="{ active: selectedBank?.code === bank.code }"
                @click="selectBank(bank)"
            >
              <img :src="bank.logo" :alt="bank.name"/>
            </div>
          </div>
        </div>

        <!-- ACCOUNT NUMBER -->
        <div class="bank-account">
          <label>Số tài khoản ngân hàng</label>
          <input
              type="text"
              v-model="bankAccountNumber"
              placeholder="Nhập số tài khoản"
          />
        </div>

        <label>Số tiền muốn rút</label>

        <input
            type="text"
            inputmode="numeric"
            :value="withdrawAmountDisplay"
            @input="onWithdrawInput"
            placeholder="Nhập số tiền"
        />


        <div class="hint">
          Số dư khả dụng:
          <b style="color: blue">{{ formattedAvailableBalance }} VNĐ</b>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn cancel" @click="closeWithdrawModal">
          Hủy
        </button>

        <button
            class="btn submit"
            :disabled="!canSubmitWithdraw"
            @click="submitWithdraw"
        >
          Xác nhận rút
        </button>
      </div>

    </div>
  </div>

</template>

<script setup>
import {computed, ref, onMounted, watch} from 'vue';
import {useRouter} from "vue-router";
import MembershipCard from "./MembershipCard.vue";
import {Line} from 'vue-chartjs';
import api from "/src/api/api.js";
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
const banks = ref([
  // BIG 4
  { code: 'VCB', name: 'Vietcombank', shortName: 'VCB', logo: 'https://api.vietqr.io/img/VCB.png' },
  { code: 'BIDV', name: 'BIDV', shortName: 'BIDV', logo: 'https://api.vietqr.io/img/BIDV.png' },
  { code: 'MB', name: 'MB Bank', shortName: 'MB', logo: 'https://api.vietqr.io/img/MB.png' },
  { code: 'CTG', name: 'VietinBank', shortName: 'CTG', logo: 'https://fingo.vn/wp-content/uploads/2022/11/vietinbank.png' },
  { code: 'AGRIBANK', name: 'Agribank', shortName: 'AGR', logo: 'https://cdn.luatminhkhue.vn/lmk/article/2023/images%20(9).jpg' },

  // TMCP lớn
  { code: 'TCB', name: 'Techcombank', shortName: 'TCB', logo: 'https://api.vietqr.io/img/TCB.png' },
  { code: 'ACB', name: 'Asia Commercial Bank', shortName: 'ACB', logo: 'https://api.vietqr.io/img/ACB.png' },
  { code: 'VPB', name: 'VPBank', shortName: 'VPB', logo: 'https://api.vietqr.io/img/VPB.png' },
  { code: 'STB', name: 'Sacombank', shortName: 'STB', logo: 'https://api.vietqr.io/img/STB.png' },
  { code: 'TPB', name: 'TPBank', shortName: 'TPB', logo: 'https://api.vietqr.io/img/TPB.png' },
  { code: 'HDB', name: 'HDBank', shortName: 'HDB', logo: 'https://api.vietqr.io/img/HDB.png' },
  { code: 'VIB', name: 'VIB', shortName: 'VIB', logo: 'https://api.vietqr.io/img/VIB.png' },
  { code: 'MSB', name: 'MSB', shortName: 'MSB', logo: 'https://api.vietqr.io/img/MSB.png' },
  { code: 'OCB', name: 'OCB', shortName: 'OCB', logo: 'https://api.vietqr.io/img/OCB.png' },
  { code: 'SCB', name: 'SCB', shortName: 'SCB', logo: 'https://api.vietqr.io/img/SCB.png' },
  { code: 'SHB', name: 'SHB', shortName: 'SHB', logo: 'https://api.vietqr.io/img/SHB.png' },
  { code: 'EXIM', name: 'Eximbank', shortName: 'EIB', logo: 'https://api.vietqr.io/img/EIB.png' },
  { code: 'LPB', name: 'LPBank', shortName: 'LPB', logo: 'https://api.vietqr.io/img/LPB.png' },
  { code: 'BAB', name: 'Bac A Bank', shortName: 'BAB', logo: 'https://api.vietqr.io/img/BAB.png' },
  { code: 'SEAB', name: 'SeABank', shortName: 'SEAB', logo: 'https://api.vietqr.io/img/SEAB.png' },
  { code: 'KLB', name: 'KienlongBank', shortName: 'KLB', logo: 'https://api.vietqr.io/img/KLB.png' },
  { code: 'PGB', name: 'PG Bank', shortName: 'PGB', logo: 'https://api.vietqr.io/img/PGB.png' },
  { code: 'ABB', name: 'ABBANK', shortName: 'ABB', logo: 'https://api.vietqr.io/img/ABB.png' },
  { code: 'NAB', name: 'Nam A Bank', shortName: 'NAB', logo: 'https://api.vietqr.io/img/NAB.png' },
  { code: 'BVB', name: 'BaoViet Bank', shortName: 'BVB', logo: 'https://api.vietqr.io/img/BVB.png' },
  { code: 'VAB', name: 'VietABank', shortName: 'VAB', logo: 'https://api.vietqr.io/img/VAB.png' },

  // NGÂN HÀNG SỐ / VÍ
  { code: 'TPBANK', name: 'TPBank Digital', shortName: 'TPB', logo: 'https://api.vietqr.io/img/TPB.png' }
])

const selectedBank = ref(null)
const bankAccountNumber = ref('')
const selectBank = (bank) => {
  selectedBank.value = bank
}

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
const availableBalance = ref(0);
const pendingBalance = ref(0);

const toggleBalanceVisibility = () => {
  balanceVisible.value = !balanceVisible.value;
};

// Chart data and options
const selectedMonth = ref(`${new Date().getMonth() + 1}`);
const selectedYear = ref(new Date().getFullYear());
const yearOptions = Array.from({length: 5}, (_, index) => new Date().getFullYear() - index);

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Số dư (VND)',
      data: [],
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

const withdrawAmount = ref(0)               // SỐ THẬT (gửi API)
const withdrawAmountDisplay = ref('')       // HIỂN THỊ

const formatNumber = (val) => {
  if (!val) return ''
  return val.toLocaleString('vi-VN')
}

const onWithdrawInput = (e) => {
  let raw = e.target.value

  // bỏ ký tự không phải số
  raw = raw.replace(/\D/g, '')

  if (!raw) {
    withdrawAmount.value = 0
    withdrawAmountDisplay.value = ''
    return
  }

  const number = Number(raw)

  withdrawAmount.value = number
  withdrawAmountDisplay.value = formatNumber(number)
}

watch(
    withdrawAmount,
    (val) => {
      if (!val || val <= 0) {
        withdrawAmountDisplay.value = ''
        return
      }

      // 🔒 KHỐNG CHẾ TRẦN
      if (val > availableBalance.value) {
        withdrawAmount.value = availableBalance.value
        withdrawAmountDisplay.value = formatNumber(availableBalance.value)
        return
      }

      // ✅ bình thường
      withdrawAmountDisplay.value = formatNumber(val)
    },
    { flush: 'post' } // 🔥 bắt buộc
)



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
      text: `Biểu đồ số dư tháng ${selectedMonth.value}/${selectedYear.value}`
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return value.toLocaleString('vi-VN') + ' VND';
        }
      }
    }
  }
});

const formatCurrency = (value) => {
  const numberValue = Number(value || 0);
  return numberValue.toLocaleString('vi-VN');
};

const formattedAvailableBalance = computed(() => formatCurrency(availableBalance.value));
const formattedPendingBalance = computed(() => formatCurrency(pendingBalance.value));

const fetchWalletBalance = async () => {
  try {
    const response = await api.get("/profile/balance");
    availableBalance.value = response.data?.soDuKhaDung ?? 0;
    pendingBalance.value = response.data?.soDuChoRut ?? 0;
  } catch (error) {
    console.error("Không thể tải số dư ví:", error);
  }
};

const fetchChartData = async () => {
  try {
    const response = await api.get("/profile/chart", {
      params: {
        month: Number(selectedMonth.value),
        year: Number(selectedYear.value),
      },
    });

    const labels = (response.data?.labels ?? []).map(String);
    const values = response.data?.values ?? [];

    chartData.value = {
      labels,
      datasets: [
        {
          label: 'Số dư (VND)',
          data: values,
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
    };

    chartOptions.value.plugins.title.text =
        `Biểu đồ số dư tháng ${selectedMonth.value}/${selectedYear.value}`;

  } catch (error) {
    console.error("Không thể tải dữ liệu biểu đồ:", error);

    chartData.value = {
      labels: [],
      datasets: [
        {
          label: 'Số dư (VND)',
          data: [],
        }
      ]
    };
  }
};

watch([selectedMonth, selectedYear], () => {
  fetchChartData();
});

onMounted(() => {
  fetchWalletBalance();
  fetchChartData();
});

import {showCenterError, updateAlertSuccess, showCenterSuccess} from '/src/assets/js/alertService.js'

/* =========================
   WITHDRAW MODAL
========================= */

const showWithdrawModal = ref(false)

const openWithdrawModal = () => {
  withdrawAmount.value = null
  showWithdrawModal.value = true
}

const closeWithdrawModal = () => {
  showWithdrawModal.value = false
}

const canSubmitWithdraw = computed(() => {
  return (
      withdrawAmount.value &&
      withdrawAmount.value > 0 &&
      withdrawAmount.value <= availableBalance.value &&
      selectedBank.value &&
      bankAccountNumber.value &&
      bankAccountNumber.value.length >= 6
  )
})


const submitWithdraw = async () => {
  if (!canSubmitWithdraw.value) return

  try {
    await api.post('/profile/withdraw', {
      amount: withdrawAmount.value,
      bankName: selectedBank.value.name,
      accountNumber: bankAccountNumber.value
    })


    showCenterSuccess('Yêu cầu rút tiền đã được gửi')

    closeWithdrawModal()

    // reload số dư
    await fetchWalletBalance();

  } catch (e) {
    console.error(e)
    showCenterError(
        e.response?.data?.message || 'Rút tiền thất bại'
    )
  }
}

</script>

<style scoped>
.security-header {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 60px;
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

.pending-amount {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  margin-top: 6px;
}

.pending-label {
  font-weight: 600;
}

.pending-value {
  font-weight: 600;
  color: #ff9800;
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

.year-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;

  margin-left: 12px;
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

/* =========================
   WITHDRAW MODAL
========================= */

.withdraw-overlay {
  position: fixed;
  inset: 0;
  background: rgba(18, 25, 54, 0.45);
  backdrop-filter: blur(6px);
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;
}

.withdraw-modal {
  width: 420px;
  max-width: 90%;
  background: white;
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.09);
  animation: modalFade .25s ease;
}

@keyframes modalFade {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.modal-title {
  margin: 0 0 16px;
  font-size: 32px;
  color: #031358;
  font-weight: 700;
}

.modal-body label {
  font-weight: 600;
  font-size: 18px;
}

.modal-body input {
  width: 100%;
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 18px;
  font-weight: 700;
}

.modal-body input:focus {
  outline: none;
  border-color: #031358;
}

.hint {
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.modal-actions .btn {
  padding: 9px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.modal-actions .cancel {
  background: #f3f4f6;
  color: #374151;
}

.modal-actions .submit {
  background: #031358;
  color: white;
}

.modal-actions .submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.bank-section {
  margin-top: 14px;
}

.bank-section label {
  font-weight: 600;
  font-size: 16px;
}

.bank-slider {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.bank-slider::-webkit-scrollbar {
  height: 6px;
}

.bank-slider::-webkit-scrollbar-thumb {
  background: #c7c9d9;
  border-radius: 10px;
}

.bank-item {
  min-width: 90px;
  padding: 8px 6px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  text-align: center;
  transition: all .2s;
  overflow: hidden;
}

.bank-item img {
  width: 38px;
  height: 38px;
  object-fit: contain;

  transform: scale(2.0);          /* 🔥 phóng từ tâm */
  transform-origin: center center; /* 🔒 đảm bảo từ giữa */
}

.bank-item span {
  display: block;
  font-size: 12px;
  font-weight: 600;
}

.bank-item:hover {
  border-color: #031358;
}

.bank-item.active {
  border-color: #031358;
  background: rgba(3, 19, 88, 0.05);
}

/* ACCOUNT INPUT */
.bank-account {
  margin-top: 14px;
}

.bank-account label {
  font-weight: 600;
  font-size: 16px;
}

.bank-account input {
  width: 100%;
  margin-top: 6px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  font-weight: 600;
}

.bank-account input:focus {
  outline: none;
  border-color: #031358;
}

</style>
