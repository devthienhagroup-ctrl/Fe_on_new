<template>
  <div class="broker-management">
    <!-- Header section -->
    <div class="management-header">
      <div class="header-left">
        <i class="fa-solid fa-users"></i>
        <h2 class="page-title">Môi giới đã hợp tác</h2>
      </div>

      <div class="header-right">
        <div class="search-box">
          <i class="fa-solid fa-search search-icon"></i>
          <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Tìm theo tên, email hoặc địa chỉ..."
              @input="handleSearch"
          />
          <button v-if="searchQuery" class="clear-search" @click="clearSearch">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Broker List -->
    <div class="broker-list-container">
      <div class="table-responsive">
        <table class="broker-table">
          <thead>
          <tr>
            <th class="avatar-col ps-4"> # </th>
            <th class="name-col">Tên môi giới</th>
            <th class="contact-col">Liên hệ</th>
            <th class="address-col">Địa chỉ</th>
            <th class="group-col">Nhóm được thêm vào</th>
            <th class="date-col">Hợp tác từ</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="broker in brokers" :key="broker.id" class="broker-row">
            <td class="avatar-col">
              <div class="broker-avatar">
                <img
                    :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'
                + (broker.avatar == null ? 'vat-default.jpg': broker.avatar )"
                    :alt="broker.name"
                    @error="handleImageError"
                    class="avatar-img"
                >
              </div>
            </td>
            <td class="name-col">
              <div class="broker-name">{{ broker.name }}</div>
              <div class="broker-id">ID: MG-{{ broker.id }}</div>
            </td>
            <td class="contact-col">
              <div class="contact-item">
                <i class="fa-solid fa-envelope contact-icon"></i>
                <a :href="`mailto:${broker.email}`" class="contact-link">{{ broker.email }}</a>
              </div>
              <div class="contact-item">
                <i class="fa-solid fa-phone contact-icon"></i>
                <a :href="`tel:${broker.phone}`" class="contact-link">{{ broker.phone }}</a>
              </div>
            </td>
            <td class="address-col">
              <div class="address-text" :title=" formatAddress(broker.address) ">
                {{ formatAddress(broker.address) }}
              </div>
            </td>
            <td class="group-col">
              <div v-if="broker.idTeam" class="group-info">
                <div class="group-avatar">
                  <img
                      :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'
                + (broker.avatarTeam == null ? 'vat-default.jpg': broker.avatarTeam )"
                      :alt="broker.nameTeam"
                      @error="handleGroupImageError"
                      class="group-avatar-img"
                  >
                </div>
                <div class="group-name">{{ broker.nameTeam }}</div>
              </div>
              <div v-else class="no-group">
                <i class="fa-solid fa-user-minus"></i>
                <span>Không có nhóm</span>
              </div>
            </td>
            <td class="date-col">
              <div class="date-info">
                <div class="date-badge">
                  <i class="fa-solid fa-calendar-days"></i>
                  {{ formatDate(broker.cooperationDate) }}
                </div>
                <div class="duration">{{ calculateDuration(broker.cooperationDate) }}</div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="brokers.length === 0" class="empty-state">
        <div class="empty-icon-wrapper">
          <i class="fa-solid fa-users-line empty-icon"></i>
        </div>
        <h3>Không tìm thấy môi giới</h3>
        <p v-if="searchQuery">Không có môi giới nào phù hợp với tìm kiếm "{{ searchQuery }}"</p>
        <p v-else>Chưa có môi giới nào hợp tác</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="brokers.length > 0" class="pagination-container">
      <div class="pagination-info">
        Hiển thị {{ startIndex }}–{{ endIndex }} trong tổng {{ totalElements }} môi giới
      </div>
      <div class="pagination-controls">
        <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <div class="page-numbers">
          <button
              v-for="page in visiblePages"
              :key="page"
              class="page-number"
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
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      <div class="page-size-selector">
        <label for="pageSize">Hiển thị:</label>
        <select id="pageSize" v-model="pageSize" @change="resetPagination" class="page-size-select">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '/src/api/api.js'

/* ===================== ROUTE ===================== */
const route = useRoute()

/* ===================== STATE ===================== */
const brokers = ref([])

const searchQuery = ref('')
const currentPage = ref(1)     // FE 1-based
const pageSize = ref(10)

const totalElements = ref(0)
const totalPages = ref(0)
const landId = route.params.id;
const startIndex = computed(() => {
  if (totalElements.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const endIndex = computed(() => {
  if (totalElements.value === 0) return 0
  return Math.min(
      startIndex.value + brokers.value.length - 1,
      totalElements.value
  )
})
/* ===================== API ===================== */
const loadBrokers = async () => {
  try {
    console.log('Hàm được chạy')
    const res = await api.get(
        '/admin.thg/product/admin/danh-sach-moi-gioi',
        {
          params: {
            landId,
            pageNo: currentPage.value - 1, // BE 0-based
            pageSize: pageSize.value,
            search: searchQuery.value || null
          }
        }
    )

    brokers.value = res.data.content || []
    totalElements.value = res.data.page.totalElements || 0
    totalPages.value = res.data.page.totalPages || 0
  } catch (e) {
    console.error('Load brokers error', e)
    brokers.value = []
    totalElements.value = 0
    totalPages.value = 0
  }
}
function formatAddress(address) {
  if (!address) return "";
  return address.replace(/\/!!/g, ", ");
}
/* ===================== PAGINATION ===================== */
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5

  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    let start = Math.max(1, currentPage.value - 2)
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) pages.push(i)
  }
  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadBrokers()
  }
}

/* ===================== SEARCH ===================== */
const handleSearch = () => {
  currentPage.value = 1
  loadBrokers()
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  loadBrokers()
}

/* ===================== HELPERS ===================== */
const getAvatarUrl = (avatarUrl, gender = 'male') => {
  if (avatarUrl && avatarUrl.startsWith('http')) return avatarUrl
  return gender === 'female'
      ? 'https://i.pravatar.cc/150?img=5'
      : 'https://i.pravatar.cc/150?img=1'
}

const getDefaultGroupAvatar = () =>
    'https://ui-avatars.com/api/?name=Group&background=6b7280&color=fff'

const truncateAddress = (address = '') =>
    address.length > 40 ? address.substring(0, 40) + '...' : address

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const calculateDuration = (dateString) => {
  if (!dateString) return ''
  try {
    const start = new Date(dateString)
    const now = new Date()
    const months =
        (now.getFullYear() - start.getFullYear()) * 12 +
        (now.getMonth() - start.getMonth())

    if (months < 1) {
      const days = Math.floor((now - start) / 86400000)
      return `${days} ngày`
    }
    if (months < 12) return `${months} tháng`

    const years = Math.floor(months / 12)
    const remain = months % 12
    return `${years} năm${remain ? ` ${remain} tháng` : ''}`
  } catch {
    return ''
  }
}

const handleImageError = (e) => {
  e.target.src = 'https://i.pravatar.cc/150?img=1'
}

const handleGroupImageError = (e) => {
  e.target.src = getDefaultGroupAvatar()
}

/* ===================== LIFECYCLE ===================== */
onMounted(async () => {
  await loadBrokers()
})


watch(pageSize, () => {
  currentPage.value = 1
  loadBrokers()
})
</script>

<style scoped>
/* ================== TỔNG THỂ ================== */
.broker-management {
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #0f172a;
}

/* ================== HEADER ================== */
.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left i {
  font-size: 32px;
  color: #2563eb;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.5px;
}

.header-right {
  flex: 1;
  max-width: 400px;
}

/* ================== SEARCH ================== */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #64748b;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 14px 48px;
  border: 1.5px solid #cbd5f5;
  border-radius: 12px;
  font-size: 15px;
  background: #ffffff;
  color: #0f172a;
  font-weight: 500;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

.clear-search {
  position: absolute;
  right: 16px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
}

.clear-search:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* ================== TABLE CONTAINER ================== */
.broker-list-container {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);
}

.table-responsive {
  overflow-x: auto;
}

/* ================== TABLE ================== */
.broker-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.broker-table th {
  background: #f1f5f9;
  padding: 18px 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #334155;
  border-bottom: 2px solid #e2e8f0;
  text-align: left;
}

.broker-table td {
  padding: 20px;
  font-size: 15px;
  color: #0f172a;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
}

.broker-row:hover {
  background: #f8fafc;
}

.broker-row:last-child td {
  border-bottom: none;
}

/* ================== AVATAR ================== */
.avatar-col {
  width: 70px;
}

.broker-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e0f2fe;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ================== NAME ================== */
.name-col {
  min-width: 150px;
}

.broker-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.broker-id {
  font-size: 13px;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 999px;
  display: inline-block;
}

/* ================== CONTACT ================== */
.contact-col {
  min-width: 200px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.contact-icon {
  font-size: 14px;
  color: #2563eb;
}

.contact-link {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
  text-decoration: none;
}

.contact-link:hover {
  text-decoration: underline;
  color: #2563eb;
}

/* ================== ADDRESS ================== */
.address-col {
  min-width: 300px;
  max-width: 350px;
}

.address-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
}

/* ================== GROUP ================== */
.group-col {
  min-width: 200px;
}

.group-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-avatar {
  width: 45px;
  height: 45px;
  border-radius: 22px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.group-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50px;
}

.group-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.no-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 8px;
}

/* ================== DATE ================== */
.date-col {
  min-width: 160px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  color: #2563eb;
  background: #e0f2fe;
  border-radius: 999px;
  border: 1px solid #bae6fd;
}

.duration {
  font-size: 13px;
  color: #64748b;
}

/* ================== PAGINATION ================== */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  gap: 16px;
}

.pagination-info {
  font-size: 14px;
  color: #334155;
}

.pagination-btn,
.page-number {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  background: #ffffff;
  font-weight: 600;
  cursor: pointer;
  color: #334155;
}

.page-number.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.page-size-select {
  padding: 8px 14px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;   /* 🔥 quan trọng */
  white-space: nowrap; /* 🔥 giữ 1 hàng */
}

</style>
