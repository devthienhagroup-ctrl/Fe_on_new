

<template>
  <div class="transaction-history-container">
    <div class="security-header">
      <h1 class="security-title">Lịch sử giao dịch</h1>
    </div>

    <div class="main-content">
      <!-- Bộ lọc ngày -->
      <div class="filter-section">
        <div class="date-filter">
          <div class="filter-icon">

          </div>
          <div class="date-inputs">
            <div class="date-input-group">
              <span class="date-label">Từ ngày</span>
              <input
                  type="date"
                  v-model="filterDates.startDate"
                  @change="handleDateChange"
                  class="date-input"
              >
            </div>
            <div class="date-input-group">
              <span class="date-label">Đến ngày</span>
              <input
                  type="date"
                  v-model="filterDates.endDate"
                  @change="handleDateChange"
                  class="date-input"
              >
            </div>
          </div>
        </div>

        <div class="transaction-count">
          <div class="ticket-icon">
            <i class="fas fa-ticket-alt"></i>
          </div>
          <span class="count-text">{{ transactions.length }} giao dịch</span>
        </div>
      </div>

      <!-- Đường phân cách -->
      <div class="divider"></div>

      <!-- Danh sách giao dịch theo ngày -->
      <div class="transactions-by-date">
        <div
            v-for="(dayTransactions, date) in groupedTransactions"
            :key="date"
            class="day-group"
        >
          <h3 class="date-header">{{ formatDisplayDate(date) }}</h3>

          <div class="transactions-list">
            <div
                v-for="transaction in dayTransactions"
                :key="transaction.id"
                class="transaction-item"
            >
              <div class="transaction-icon">
                <i :class="getTransactionIconClass(transaction.type)"></i>
              </div>

              <div class="transaction-details">
                <h4 class="transaction-title">{{ transaction.title }}</h4>
                <div class="transaction-meta">
                  <span class="transaction-time">{{ transaction.time }}</span>
                  <span
                      :class="[
                      'transaction-status',
                      transaction.status === 'success' ? 'status-success' : 'status-failed'
                    ]"
                  >
                    {{ transaction.status === 'success' ? 'Thành công' : 'Thất bại' }}
                  </span>
                </div>
                <div class="transaction-balance">
                  SD: {{ formatCurrency(transaction.balance) }}
                </div>
              </div>

              <div
                  class="transaction-amount"
                  :style="{ color: getAmountColor(transaction.amount) }"
              >
                {{ transaction.amount >= 0 ? '+' : '' }}{{ formatCurrency(transaction.amount) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Dữ liệu mẫu cho lịch sử giao dịch
const transactions = ref([
  {
    id: 1,
    date: '2024-05-15',
    type: 'deposit',
    title: 'Nạp tiền vào ví',
    amount: 5000000,
    status: 'success',
    time: '2024-05-15 14:30:25',
    balance: 15000000
  },
  {
    id: 2,
    date: '2024-05-15',
    type: 'payment',
    title: 'Thanh toán hóa đơn điện',
    amount: -350000,
    status: 'success',
    time: '2024-05-15 09:15:10',
    balance: 14650000
  },
  {
    id: 3,
    date: '2024-05-14',
    type: 'withdraw',
    title: 'Rút tiền về ngân hàng',
    amount: -2000000,
    status: 'failed',
    time: '2024-05-14 16:45:30',
    balance: 12650000
  },
  {
    id: 4,
    date: '2024-05-14',
    type: 'deposit',
    title: 'Nhận chuyển khoản',
    amount: 3000000,
    status: 'success',
    time: '2024-05-14 11:20:15',
    balance: 15650000
  }
])

// Tính toán ngày mặc định (hôm nay và 1 tháng trước)
const getDefaultDates = () => {
  const today = new Date()
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(today.getMonth() - 1)

  return {
    startDate: formatDateForInput(oneMonthAgo),
    endDate: formatDateForInput(today)
  }
}

// Định dạng ngày thành yyyy-MM-dd cho input
const formatDateForInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Định dạng ngày thành dd/MM/yyyy để hiển thị
const formatDisplayDate = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// Lọc giao dịch theo ngày
const filterDates = ref(getDefaultDates())

// Nhóm giao dịch theo ngày
const groupedTransactions = ref({})

// Hàm nhóm giao dịch theo ngày
const groupTransactionsByDate = () => {
  const grouped = {}

  transactions.value.forEach(transaction => {
    if (!grouped[transaction.date]) {
      grouped[transaction.date] = []
    }
    grouped[transaction.date].push(transaction)
  })

  groupedTransactions.value = grouped
}

// Lấy icon class theo loại giao dịch
const getTransactionIconClass = (type) => {
  const icons = {
    deposit: 'fas fa-arrow-up',
    withdraw: 'fas fa-arrow-down',
    payment: 'fas fa-tag'
  }
  return icons[type] || 'fas fa-question'
}

// Lấy màu cho số tiền
const getAmountColor = (amount) => {
  return amount >= 0 ? '#00a86b' : '#ff4444'
}

// Xử lý thay đổi ngày
const handleDateChange = () => {
  // Ở đây bạn có thể thêm logic lọc giao dịch theo khoảng ngày
  console.log('Date range changed:', filterDates.value)
}

// Khởi tạo
onMounted(() => {
  groupTransactionsByDate()
})
</script>

<style scoped>
.security-header {
  text-align: center;
  margin-bottom: 40px;
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
  font-family: 'Ubuntu', sans-serif;
}

/* Bộ lọc ngày */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-icon {
  font-size: 20px;
  color: #031358;
}

.filter-icon i {
  width: 20px;
  text-align: center;
}

.date-inputs {
  display: flex;
  gap: 20px;
}

.date-input-group {
  display: flex;
  flex-direction: column;
}

.date-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
  min-width: 140px;
  font-family: 'Ubuntu', sans-serif;
  font-size: 14px;
  color: #333;
}

.date-input:focus {
  outline: none;
  border-color: #0030FF;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(0, 48, 255, 0.1);
}

.transaction-count {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ticket-icon {
  font-size: 18px;
  color: #031358;
}

.ticket-icon i {
  width: 18px;
  text-align: center;
}

.count-text {
  font-weight: 500;
  color: #333;
}

/* Đường phân cách */
.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 20px 0 30px 0;
}

/* Nhóm giao dịch theo ngày */
.day-group {
  margin-bottom: 30px;
}

.date-header {
  text-align: left;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 4px solid #0030FF;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Item giao dịch */
.transaction-item {
  display: flex;
  align-items: flex-start;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.transaction-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.transaction-icon {
  font-size: 18px;
  margin-right: 15px;
  color: #031358;
  width: 24px;
  text-align: center;
}

.transaction-icon i {
  width: 18px;
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  font-size: 20px;
  color: #000;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.transaction-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.transaction-time {
  font-size: 14px;
  color: #666;
}

.transaction-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.status-success {
  background-color: #00a86b;
}

.status-failed {
  background-color: #ff4444;
}

.transaction-balance {
  font-size: 14px;
  color: #AFAFAF;
}

.transaction-amount {
  font-size: 20px;
  font-weight: 600;
  position: absolute;
  right: 15px;
  top: 15px;
}

/* Responsive */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .date-inputs {
    flex-direction: column;
    gap: 10px;
  }

  .transaction-title {
    font-size: 18px;
  }

  .transaction-amount {
    font-size: 18px;
  }
}
</style>