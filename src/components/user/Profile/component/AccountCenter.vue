<template>
  <div class="account-center">
    <MembershipCard class="member-ship-card" :member-data="user_card"/>

    <!-- Thanh tìm kiếm -->
    <div class="search-container">
      <div class="search-box">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm..."
            class="search-input"
            @input="handleSearch"
        />
        <button class="search-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Lịch sử tìm kiếm -->
      <div v-if="searchHistory.length > 0 && !searchQuery" class="search-history">
        <div class="history-title">Lịch sử tìm kiếm:</div>
        <div class="history-items">
          <div
              v-for="item in searchHistory"
              :key="item.path"
              class="history-item"
          >
            <span class="history-text" @click="navigateTo(item.path)">{{ item.name }}</span>
            <button class="delete-btn" @click="removeFromHistory(item.path)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Kết quả tìm kiếm -->
      <div v-if="searchQuery && searchResults.length > 0" class="search-results">
        <div
            v-for="result in searchResults"
            :key="result.item.path"
            class="result-item"
            @click="navigateTo(result.item.path)"
        >
          <span class="result-text">{{ result.item.name }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- Không tìm thấy kết quả -->
      <div v-else-if="searchQuery && searchResults.length === 0" class="no-results">
        Không tìm thấy kết quả phù hợp
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MembershipCard from "./MembershipCard.vue";

const props = defineProps({
  user_card: Object
});

const router = useRouter()
const searchQuery = ref('')
const Fuse = ref(null)
const searchHistory = ref([])

// Kiểm tra và load Fuse.js từ CDN
onMounted(() => {
  if (window.Fuse) {
    Fuse.value = window.Fuse
  } else {
    // Fallback: load CDN nếu chưa có
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0'
    script.onload = () => {
      Fuse.value = window.Fuse
    }
    document.head.appendChild(script)
  }

  // Load lịch sử tìm kiếm từ localStorage
  loadSearchHistory()
})

// Load lịch sử tìm kiếm từ localStorage
const loadSearchHistory = () => {
  const savedHistory = localStorage.getItem('searchHistory')
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory)
  }
}

// Lưu lịch sử tìm kiếm vào localStorage
const saveSearchHistory = () => {
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// Lấy tất cả routes từ router
const allRoutes = computed(() => {
  return router.getRoutes().filter(route =>
      route.meta && route.meta.keywords && route.meta.keywords.length > 0
  ).map(route => ({
    path: route.path,
    name: route.meta.feature || route.path,
    keywords: route.meta.keywords || []
  }))
})

// Cấu hình Fuse.js cho tên
const nameFuseOptions = {
  keys: ['name'],
  threshold: 0.5,
  includeScore: true,
  includeMatches: true
}

// Cấu hình Fuse.js cho tên và keywords
const fullFuseOptions = {
  keys: ['keywords', 'name'],
  threshold: 0.5,
  includeScore: true,
  includeMatches: true
}

// Fuse instance cho tìm kiếm tên
const nameFuseInstance = computed(() => {
  if (!Fuse.value || !allRoutes.value.length) return null
  return new Fuse.value(allRoutes.value, nameFuseOptions)
})

// Fuse instance cho tìm kiếm đầy đủ
const fullFuseInstance = computed(() => {
  if (!Fuse.value || !allRoutes.value.length) return null
  return new Fuse.value(allRoutes.value, fullFuseOptions)
})

// Kết quả tìm kiếm
const searchResults = ref([])

// Xử lý tìm kiếm
const handleSearch = () => {
  const query = searchQuery.value.trim()

  if (!query) {
    searchResults.value = []
    return
  }

  let results = []

  if (query.length === 1) {
    // Chỉ tìm kiếm theo tên khi chỉ có 1 ký tự
    if (nameFuseInstance.value) {
      results = nameFuseInstance.value.search(query)
    }
  } else {
    // Tìm kiếm theo cả tên và keywords khi có từ 2 ký tự trở lên
    if (fullFuseInstance.value) {
      results = fullFuseInstance.value.search(query)
    }
  }

  searchResults.value = results.slice(0, 5) // Giới hạn 5 kết quả
}

// Điều hướng đến route
const navigateTo = (path) => {
  // Tìm thông tin route từ allRoutes
  const routeInfo = allRoutes.value.find(route => route.path === path)
  if (routeInfo) {
    // Thêm vào lịch sử nếu chưa tồn tại
    const existingIndex = searchHistory.value.findIndex(item => item.path === path)
    if (existingIndex !== -1) {
      // Nếu đã tồn tại, xóa và thêm lại để đưa lên đầu
      searchHistory.value.splice(existingIndex, 1)
    }

    // Thêm vào đầu mảng
    searchHistory.value.unshift({
      path: routeInfo.path,
      name: routeInfo.name
    })

    // Giới hạn số lượng lịch sử (ví dụ: 10 mục)
    if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10)
    }

    // Lưu vào localStorage
    saveSearchHistory()
  }

  router.push(path)
  searchQuery.value = ''
  searchResults.value = []
}

// Xóa khỏi lịch sử
const removeFromHistory = (path) => {
  searchHistory.value = searchHistory.value.filter(item => item.path !== path)
  saveSearchHistory()
}

console.log("User", props.user_card);
</script>

<style scoped>
.account-center {
  width: 100%;
  padding-top: 50px;
}

.member-ship-card {
  margin: 0 auto;
  width: 95%;
  height: auto;
}

.search-container {
  margin: 20px auto 0;
  width: 95%;
  position: relative;
}

.search-box {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: none;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
  background: transparent;
}

.search-input::placeholder {
  color: #999;
}

.search-button {
  padding: 12px 16px;
  border: none;
  background: white;
  color: #666;
  cursor: pointer;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  color: #007bff;
}

/* Lịch sử tìm kiếm */
.search-history {
  margin-top: 10px;
}

.history-title {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.history-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-item {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: 1px solid #031358;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  color: #031358;
  transition: all 0.2s ease;
}

.history-text {
  cursor: pointer;
  margin-right: 6px;
}

.history-text:hover {
  text-decoration: underline;
}

.delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #031358;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.delete-btn:hover {
  background-color: rgba(3, 19, 88, 0.1);
}

/* Kết quả tìm kiếm */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 2px;
  overflow: hidden;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: #f8f9fa;
}

.result-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.no-results {
  padding: 16px;
  text-align: center;
  color: #666;
  font-size: 14px;
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>