<script setup>
import { ref, computed } from 'vue'

// Dữ liệu gói dịch vụ
const servicePackage = ref({
  name: 'Gói VIP',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  remainingDays: 45
})

// Dữ liệu dịch vụ còn lại
const remainingServices = ref([
  { id: 1, name: 'Tư vấn pháp lý', used: 2, total: 5 },
  { id: 2, name: 'Định giá bất động sản', used: 1, total: 3 },
  { id: 3, name: 'Chụp ảnh chuyên nghiệp', used: 0, total: 2 },
  { id: 4, name: 'Quảng cáo đa kênh', used: 1, total: 4 },
  { id: 5, name: 'Hỗ trợ đăng tin', used: 3, total: 6 }
])

// Dữ liệu lịch sử sử dụng
const serviceHistory = ref([
  { id: 1, serviceName: 'Tư vấn pháp lý', date: '2024-05-15', details: 'Tư vấn hợp đồng mua bán' },
  { id: 2, serviceName: 'Định giá bất động sản', date: '2024-05-10', details: 'Định giá căn hộ chung cư' },
  { id: 3, serviceName: 'Quảng cáo đa kênh', date: '2024-05-08', details: 'Đăng tin trên 5 nền tảng' },
  { id: 4, serviceName: 'Hỗ trợ đăng tin', date: '2024-05-05', details: 'Viết mô tả và đăng tin' },
  { id: 5, serviceName: 'Tư vấn pháp lý', date: '2024-04-20', details: 'Tư vấn thủ tục sang tên' },
  { id: 6, serviceName: 'Chụp ảnh chuyên nghiệp', date: '2024-04-15', details: 'Chụp ảnh căn hộ 2 phòng ngủ' },
  { id: 7, serviceName: 'Hỗ trợ đăng tin', date: '2024-04-10', details: 'Chỉnh sửa và tối ưu tin đăng' },
  { id: 8, serviceName: 'Định giá bất động sản', date: '2024-04-05', details: 'Định giá nhà phố mặt tiền' },
  { id: 9, serviceName: 'Quảng cáo đa kênh', date: '2024-03-28', details: 'Quảng cáo trên 3 nền tảng' },
  { id: 10, serviceName: 'Hỗ trợ đăng tin', date: '2024-03-20', details: 'Đăng tin cho nhà cho thuê' }
])

// Phân trang
const currentPage = ref(1)
const itemsPerPage = 5

// Tính toán số trang
const totalPages = computed(() => {
  return Math.ceil(serviceHistory.value.length / itemsPerPage)
})

// Dữ liệu phân trang
const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return serviceHistory.value.slice(start, end)
})

// Chuyển trang
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Định dạng ngày
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Tính phần trăm sử dụng
const getUsagePercentage = (used, total) => {
  return (used / total) * 100
}

// Màu sắc cho phần trăm sử dụng
const getUsageColor = (used, total) => {
  const percentage = getUsagePercentage(used, total)
  if (percentage >= 80) return '#ff4444'
  if (percentage >= 50) return '#ffa500'
  return '#00a86b'
}
</script>

<template>
  <div class="benefits-container">
    <!-- Thêm FontAwesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <div class="security-header">
      <h1 class="security-title">Quyền lợi</h1>
    </div>

    <div class="main-content">
      <!-- Thông tin gói dịch vụ - Đã sửa đổi -->
      <div class="package-info-section">
        <div class="package-header">
          <div class="package-icon">

          </div>
          <div class="package-details">
            <h2 class="package-name">{{ servicePackage.name }}</h2>
            <div class="package-period">
              <span class="period-label">Thời gian còn lại:</span>
              <span class="remaining-days">{{ servicePackage.remainingDays }} ngày</span>
            </div>
            <div class="date-range">
              {{ formatDate(servicePackage.startDate) }} - {{ formatDate(servicePackage.endDate) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Đường phân cách -->
      <div class="divider"></div>

      <!-- Bảng dịch vụ còn lại -->
      <div class="services-section">
        <h3 class="section-title">
          <i class="fas fa-list-alt"></i>
          Số lần sử dụng dịch vụ còn lại
        </h3>

        <div class="table-container">
          <table class="services-table">
            <thead>
            <tr>
              <th>STT</th>
              <th>Tên dịch vụ</th>
              <th>Số lần đã dùng</th>
              <th>Số lần còn lại</th>
              <th>Tỷ lệ sử dụng</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(service, index) in remainingServices" :key="service.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="service-name">
                <i class="fas fa-home"></i>
                {{ service.name }}
              </td>
              <td class="text-center">{{ service.used }}/{{ service.total }}</td>
              <td class="text-center">{{ service.total - service.used }}</td>
              <td>
                <div class="progress-container">
                  <div
                      class="progress-bar"
                      :style="{
                        width: `${getUsagePercentage(service.used, service.total)}%`,
                        backgroundColor: getUsageColor(service.used, service.total)
                      }"
                  ></div>
                  <span class="progress-text">
                      {{ Math.round(getUsagePercentage(service.used, service.total)) }}%
                    </span>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Đường phân cách -->
      <div class="divider"></div>

      <!-- Lịch sử sử dụng dịch vụ -->
      <div class="history-section">
        <h3 class="section-title">
          <i class="fas fa-history"></i>
          Lịch sử sử dụng dịch vụ
        </h3>

        <div class="table-container">
          <table class="history-table">
            <thead>
            <tr>
              <th>STT</th>
              <th>Tên dịch vụ</th>
              <th>Ngày tháng sử dụng</th>
              <th>Chi tiết</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(history, index) in paginatedHistory" :key="history.id">
              <td class="text-center">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="service-name">
                <i class="fas fa-building"></i>
                {{ history.serviceName }}
              </td>
              <td class="text-center">{{ formatDate(history.date) }}</td>
              <td class="text-center">
                <button class="detail-btn">
                  <i class="fas fa-eye"></i>
                  Xem chi tiết
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Phân trang -->
        <div class="pagination">
          <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
          >
            <i class="fas fa-chevron-left"></i>
            Trước
          </button>

          <div class="page-numbers">
            <button
                v-for="page in totalPages"
                :key="page"
                class="page-btn"
                :class="{ active: page === currentPage }"
                @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
          >
            Sau
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.benefits-container {
  font-family: 'Ubuntu', sans-serif;
}

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
}

/* Thông tin gói dịch vụ - Đã sửa đổi */
.package-info-section {
  padding: 20px 0;
  margin-bottom: 20px;
}

.package-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.package-icon {
  font-size: 48px;
  color: #0030FF;
}

.package-details {
  flex: 1;
}

.package-name {
  font-size: 28px;
  margin: 0 0 10px 0;
  font-weight: 700;
  color: #031358;
}

.package-period {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.period-label {
  font-size: 16px;
  color: #666;
}

.remaining-days {
  font-size: 18px;
  font-weight: 600;
  color: #0030FF;
}

.date-range {
  font-size: 14px;
  color: #888;
}

/* Đường phân cách */
.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 30px 0;
}

/* Section title */
.section-title {
  font-size: 22px;
  color: #031358;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #0030FF;
}

/* Tables */
.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.services-table,
.history-table {
  width: 100%;
  border-collapse: collapse;
}

.services-table th,
.history-table th {
  color: white;
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
}

.services-table thead,
.history-table thead {
  background: linear-gradient(to right, #031358, #0030FF);
}

.services-table th:first-child,
.history-table th:first-child {
  border-top-left-radius: 8px;
}

.services-table th:last-child,
.history-table th:last-child {
  border-top-right-radius: 8px;
}

.services-table td,
.history-table td {
  padding: 15px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.services-table tr:last-child td,
.history-table tr:last-child td {
  border-bottom: none;
}

.services-table tbody>tr:hover,
.history-table tbody>tr:hover {
  background-color: #f8f9fa;
}

/* Service name */
.service-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.service-name i {
  color: #0030FF;
  width: 16px;
}

/* Text center */
.text-center {
  text-align: center;
}

/* Progress bar */
.progress-container {
  position: relative;
  background: #e0e0e0;
  border-radius: 10px;
  height: 20px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: 600;
  color: #333;
}

/* Detail button */
.detail-btn {
  background: white;
  color: #031358;
  border: 2px solid #031358;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.detail-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgb(10, 36, 99, 0.4);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination-btn {
  background: #031358;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.pagination-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.pagination-btn:not(:disabled):hover {
  background: #0030FF;
  transform: translateY(-1px);
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-btn {
  background: #f0f0f0;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.page-btn.active {
  background: linear-gradient(to right, #031358, #0030FF);
  color: white;
}

.page-btn:not(.active):hover {
  background: #e0e0e0;
}

/* Responsive */
@media (max-width: 768px) {
  .package-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .package-period {
    justify-content: center;
  }

  .table-container {
    overflow-x: auto;
  }

  .services-table,
  .history-table {
    min-width: 600px;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>