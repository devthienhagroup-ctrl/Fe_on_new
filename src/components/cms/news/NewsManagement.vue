<template>
  <div class="news-management-container">
    <!-- Toast Notification -->
    <div class="toast-container" :class="{ 'active': toast.show }">
      <div class="toast" :class="toast.type">
        <i :class="toast.icon"></i>
        <span>{{ toast.message }}</span>
        <i class="fas fa-times close-toast" @click="hideToast"></i>
      </div>
      <div v-if="loading" class="loading-spinner"></div>
    </div>

    <!-- Header -->
    <header class="header">
      <h1><i class="fas fa-newspaper"></i> Quản lý Tin tức</h1>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showCategoryModal = true">
          <i class="fas fa-plus"></i> Thêm danh mục
        </button>
      </div>
    </header>

    <!-- Category Navigation (Horizontal) -->
    <div class="category-nav">
      <div class="category-nav-wrapper">
        <div class="category-tabs">
          <button
              class="category-tab"
              :class="{ 'active': !selectedCategoryId }"
              @click="selectAllCategories"
          >
            <i class="fas fa-layer-group"></i>
            <span>Tất cả danh mục</span>
<!--            <span class="category-count">{{ allNews.length }}</span>-->
          </button>

          <button
              v-for="category in categories"
              :key="category.id"
              class="category-tab"
              :class="{ 'active': selectedCategoryId === category.id }"
              @click="selectCategory(category)"
          >
            <i class="fa-solid fa-newspaper"></i>
            <span>{{ category.name }}</span>
<!--            <span class="category-count">{{ getNewsCount(category.id) }}</span>-->
            <div class="category-actions">
              <button class="btn-icon small" @click.stop="editCategory(category)" title="Sửa">
                <i class="fas fa-edit"></i>
              </button>
              <button
                  class="btn-icon small btn-danger"
                  @click.stop="confirmDeleteCategory(category)"
                  :disabled="getNewsCount(category.id) > 0"
                  :title="getNewsCount(category.id) > 0 ? 'Không thể xóa danh mục có tin' : 'Xóa'"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Area with Tabs -->
    <main class="main-content">
      <div class="content-tabs">
        <button
            class="content-tab"
            :class="{ 'active': activeContentTab === 'list' }"
            @click="activeContentTab = 'list'"
        >
          <i class="fas fa-list"></i> Danh sách tin tức
          <span class="badge">{{ filteredNews.length }}</span>
        </button>
        <button
            class="content-tab"
            :class="{ 'active': activeContentTab === 'edit' }"
            @click="activeContentTab = 'edit'"
            @click.middle="resetNewsForm()" >
        <i class="fas fa-edit"></i> {{ editingNews.id ? 'Chỉnh sửa tin' : 'Thêm tin mới' }}
        </button>
      </div>

      <!-- List Tab Content -->
      <div v-show="activeContentTab === 'list'" class="tab-content list-tab">
        <!-- Featured News Banner -->
        <div v-if="featuredNews.length > 0" class="featured-news-section">
          <div class="section-header">
            <h3><i class="fas fa-star"></i> Tin nổi bật</h3>
            <div class="section-actions">
              <button class="btn btn-sm btn-secondary" @click="toggleFeaturedView">
                <i class="fas" :class="showAllFeatured ? 'fa-compress' : 'fa-expand'"></i>
                {{ showAllFeatured ? 'Thu gọn' : 'Xem tất cả' }}
              </button>
            </div>
          </div>
          <div class="featured-news-list">
            <div
                v-for="news in (showAllFeatured ? featuredNews : featuredNews.slice(0, 3))"
                :key="news.id"
                class="featured-news-item"
                @click="editSelectedNews(news)"
            >
              <div class="featured-thumbnail">
                <img
                    :src="news.thumbnail || 'https://via.placeholder.com/300x180?text=No+Image'"
                    :alt="news.title"
                />
                <div class="featured-badge">
                  <i class="fas fa-star"></i>
                </div>
              </div>
              <div class="featured-content">
                <div class="news-status" :class="news.status.toLowerCase()">
                  {{ getStatusText(news.status) }}
                </div>
                <h4 class="news-title">{{ news.title }}</h4>
                <p class="news-summary">{{ news.summary }}</p>
                <div class="news-meta">
                  <span><i class="far fa-user"></i> {{ news.employeeName }}</span>
                  <span><i class="far fa-eye"></i> {{ news.viewCount }} lượt xem</span>
                  <span><i class="far fa-calendar"></i> {{ formatDate(news.updateAt) }}</span>
                  <span v-if="news.priority" class="priority-badge">
                    <i class="fas fa-flag"></i> Ưu tiên {{ news.priority }}
                  </span>
                </div>
              </div>
              <div class="featured-actions">
                <button
                    class="btn-icon"
                    :class="{ 'active': news.isFeatured }"
                    @click.stop="toggleFeatured(news)"
                    :title="news.isFeatured ? 'Bỏ đánh dấu nổi bật' : 'Đánh dấu nổi bật'"
                >
                  <i class="fas fa-star"></i>
                </button>
                <button class="btn-icon" @click.stop="editSelectedNews(news)" title="Sửa">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-danger" @click.stop="confirmDeleteNews(news)" title="Xóa">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- News List Controls -->
        <div class="news-list-controls">
          <div class="search-filters">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Tìm kiếm tin tức..."
                  @input="filterNews"
              />
              <button v-if="searchQuery" class="btn-icon small" @click="searchQuery = ''; filterNews()">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="filter-group">
              <select v-model="statusFilter" @change="filterNews" class="filter-select">
                <option value="">Tất cả trạng thái</option>
                <option value="PUBLISHED">Đã xuất bản</option>
                <option value="DRAFT">Bản nháp</option>
                <option value="ARCHIVED">Đã lưu trữ</option>
              </select>

              <select v-model="sortBy" @change="sortNews" class="filter-select">
                <option value="createAt">Mới nhất</option>
                <option value="updateAt">Cập nhật gần nhất</option>
                <option value="priority">Ưu tiên cao</option>
                <option value="viewCount">Lượt xem nhiều</option>
                <option value="title">Tiêu đề A-Z</option>
              </select>
            </div>
          </div>

          <div class="list-actions">
            <button class="btn btn-primary" @click="activeContentTab = 'edit'; resetNewsForm()">
              <i class="fas fa-plus"></i> Thêm tin mới
            </button>
          </div>
        </div>

        <!-- News List -->
        <div class="news-list-section">
          <div class="news-grid">
            <div
                v-for="news in paginatedNews"
                :key="news.id"
                class="news-card"
                :class="{ 'featured': news.isFeatured }"
                @click="editSelectedNews(news)"
            >
              <div class="news-card-header">
                <div class="news-status" :class="news.status.toLowerCase()">
                  {{ getStatusText(news.status) }}
                </div>
                <div class="news-actions">
                  <button
                      class="btn-icon small"
                      :class="{ 'active': news.isFeatured }"
                      @click.stop="toggleFeatured(news)"
                      :title="news.isFeatured ? 'Bỏ đánh dấu nổi bật' : 'Đánh dấu nổi bật'"
                  >
                    <i class="fas fa-star"></i>
                  </button>
                  <button class="btn-icon small" @click.stop="editSelectedNews(news)" title="Sửa">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </div>

              <div class="news-thumbnail">
                <img
                    :src="news.thumbnail || 'https://via.placeholder.com/400x200?text=No+Image'"
                    :alt="news.title"
                />
                <div v-if="news.isFeatured" class="featured-indicator">
                  <i class="fas fa-star"></i> Nổi bật
                </div>
              </div>

              <div class="news-card-body">
                <h4 class="news-title">{{ news.title }}</h4>
                <p class="news-summary">{{ news.summary }}</p>

                <div class="news-meta">
                  <div class="meta-item">
                    <i class="far fa-user"></i>
                    <span>{{ news.employeeName }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="far fa-eye"></i>
                    <span>{{ news.viewCount }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="far fa-calendar"></i>
                    <span>{{ formatDate(news.updateAt) }}</span>
                  </div>
                  <div v-if="news.isFeatured && news.priority" class="meta-item priority">
                    <i class="fas fa-flag"></i>
                    <span>Ưu tiên {{ news.priority }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredNews.length === 0" class="empty-state">
            <i class="fas fa-newspaper"></i>
            <p>Không có tin tức nào</p>
            <button class="btn btn-primary" @click="activeContentTab = 'edit'; resetNewsForm()">
              <i class="fas fa-plus"></i> Thêm tin tức đầu tiên
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="filteredNews.length > 0" class="pagination">
            <div class="pagination-info">
              Hiển thị {{ startItem }}-{{ endItem }} của {{ filteredNews.length }} tin
            </div>
            <div class="pagination-controls">
              <button
                  class="btn-icon"
                  @click="prevPage"
                  :disabled="currentPage === 1"
              >
                <i class="fas fa-chevron-left"></i>
              </button>

              <div class="page-numbers">
                <button
                    v-for="page in visiblePages"
                    :key="page"
                    class="page-number"
                    :class="{ 'active': page === currentPage }"
                    @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <span v-if="showEllipsis" class="page-ellipsis">...</span>
              </div>

              <button
                  class="btn-icon"
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            <div class="page-size-selector">
              <select v-model="pageSize" @change="resetPagination" class="page-size-select">
                <option value="6">6 tin/trang</option>
                <option value="12">12 tin/trang</option>
                <option value="24">24 tin/trang</option>
                <option value="48">48 tin/trang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Tab Content -->
      <div v-show="activeContentTab === 'edit'" class="tab-content edit-tab">
        <form @submit.prevent="saveNews" class="news-edit-form">
          <div class="form-header">
            <h3>{{ editingNews.id ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới' }}</h3>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="activeContentTab = 'list'">
                <i class="fas fa-times"></i> Hủy
              </button>
              <button type="submit" class="btn btn-success" :disabled="!canSaveNews">
                <i class="fas fa-save"></i> Lưu tin tức
              </button>
            </div>
          </div>

          <div class="form-grid">
            <!-- Left Column -->
            <div class="form-column">
              <div class="form-section">
                <h4><i class="fas fa-info-circle"></i> Thông tin cơ bản</h4>
                <div class="form-group">
                  <label for="newsTitle">Tiêu đề *</label>
                  <input
                      type="text"
                      id="newsTitle"
                      v-model="editingNews.title"
                      placeholder="Nhập tiêu đề tin tức"
                      class="form-control"
                      required
                  />
                </div>

                <div class="form-group">
                  <label for="newsCategory">Danh mục *</label>
                  <select
                      id="newsCategory"
                      v-model="editingNews.categoryId"
                      class="form-control"
                      required
                  >
                    <option value="">Chọn danh mục</option>
                    <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="newsSummary">Tóm tắt</label>
                  <textarea
                      id="newsSummary"
                      v-model="editingNews.summary"
                      placeholder="Nhập tóm tắt tin tức"
                      class="form-control"
                      rows="4"
                      maxlength="500"
                  ></textarea>
                  <div class="char-count">{{ editingNews.summary.length }}/500</div>
                </div>
              </div>

              <div class="form-section">
                <h4><i class="fas fa-cog"></i> Cài đặt</h4>
                <div class="settings-grid">
                  <div class="form-group">
                    <label for="newsStatus">Trạng thái</label>
                    <select
                        id="newsStatus"
                        v-model="editingNews.status"
                        class="form-control"
                    >
                      <option value="DRAFT">Bản nháp</option>
                      <option value="PUBLISHED">Xuất bản</option>
                      <option value="ARCHIVED">Lưu trữ</option>
                    </select>
                  </div>

                  <div class="form-group checkbox-group">
                    <label class="checkbox-label">
                      <input
                          type="checkbox"
                          v-model="editingNews.isFeatured"
                          class="checkbox"
                      />
                      <span class="checkbox-text">Tin nổi bật</span>
                    </label>
                  </div>

                  <div v-if="editingNews.isFeatured" class="form-group">
                    <label for="newsPriority">Độ ưu tiên (1-10)</label>
                    <div class="priority-input">
                      <input
                          type="number"
                          id="newsPriority"
                          v-model="editingNews.priority"
                          min="1"
                          max="10"
                          class="form-control"
                          :class="{ 'disabled': !editingNews.isFeatured }"
                          :disabled="!editingNews.isFeatured"
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Ảnh đại diện</label>
                    <div class="file-upload-area" @click="triggerFileInput('thumbnail')">
                      <div v-if="!thumbnailFile && !editingNews.thumbnail" class="upload-placeholder">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Nhấn để chọn ảnh đại diện</p>
                        <small>Kích thước đề xuất: 1200x630px</small>
                      </div>
                      <div v-else class="upload-preview">
                        <img
                            :src="thumbnailPreview || editingNews.thumbnail"
                            alt="Thumbnail preview"
                        />
                        <button
                            class="btn-icon btn-danger remove-file"
                            @click.stop="removeThumbnail"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      <input
                          type="file"
                          ref="thumbnailInput"
                          @change="handleThumbnailUpload"
                          accept="image/*"
                          class="file-input"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="form-column">
              <div class="" style="width: 100%;">
                <h4><i class="fas fa-edit"></i> Nội dung</h4>
                <div class="editor-wrapper">
                  <!-- AdvancedEditor Component -->
                  <AdvancedEditModal v-model="editingNews.contentHTML" />
                </div>

                <!-- Preview Section -->
                <div class="preview-section">
                  <h5><i class="fas fa-eye"></i> Xem trước</h5>
                  <div class="rich-text-preview rich-text-editor-wrapper">
                    <div class="tiptap-preview tiptap" v-html="editingNews.contentHTML"></div>
                    <div v-if="!editingNews.contentHTML" class="preview-placeholder">
                      <i class="fas fa-paragraph"></i>
                      <p>Nội dung sẽ hiển thị tại đây</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="modal-overlay" @click.self="showCategoryModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingCategory.id ? 'Sửa' : 'Thêm' }} danh mục</h3>
          <button class="btn-icon" @click="showCategoryModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="categoryName">Tên danh mục *</label>
            <input
                type="text"
                id="categoryName"
                v-model="editingCategory.name"
                placeholder="Nhập tên danh mục"
                class="form-control"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showCategoryModal = false">
            Hủy
          </button>
          <button
              class="btn btn-primary"
              @click="saveCategory"
              :disabled="!editingCategory.name"
          >
            <i class="fas fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal confirmation-modal">
        <div class="modal-header">
          <h3>Xác nhận xóa</h3>
          <button class="btn-icon" @click="showDeleteModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="confirmation-content">
            <i class="fas fa-exclamation-triangle warning-icon"></i>
            <p>{{ deleteMessage }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDeleteModal = false">
            Hủy
          </button>
          <button
              class="btn btn-danger"
              @click="deleteModalAction === 'category' ? deleteCategory() : deleteNews()"
          >
            <i class="fas fa-trash"></i> Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import AdvancedEditModal from "../../RichTextEditor/AdvancedEditModal.vue";
import api from "../../../api/api.js";
import {baseImgaeUrl} from "../../../assets/js/global.js";

// Toast notification state
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

const loading = ref(false)

// Categories state
const categories = ref([])
const selectedCategoryId = ref(null)

// News state - thay đổi cấu trúc để hỗ trợ phân trang từ API
const newsData = ref({
  content: [],
  page: {
    size: 12,
    number: 0,
    totalElements: 0,
    totalPages: 1
  }
})

const filteredNews = computed(() => newsData.value.content || [])
const allNews = computed(() => filteredNews.value) // Giữ tương thích với code cũ

const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('createAt')

// Tab states
const activeContentTab = ref('list')
const showAllFeatured = ref(false)

// Pagination
const currentPage = ref(1)
const pageSize = ref(12)
const totalPages = computed(() => Math.ceil((newsData.value.page?.totalElements || 0) / pageSize.value))
const startItem = computed(() => {
  const pageNum = newsData.value.page?.number || 0
  return pageNum * pageSize.value + 1
})
const endItem = computed(() => {
  const pageNum = newsData.value.page?.number || 0
  const totalOnPage = newsData.value.content?.length || 0
  return pageNum * pageSize.value + totalOnPage
})

const paginatedNews = computed(() => newsData.value.content || [])

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const showEllipsis = computed(() => totalPages.value > visiblePages.value.length)

// Modal states
const showCategoryModal = ref(false)
const showDeleteModal = ref(false)

// Form states
const editingCategory = reactive({
  id: null,
  name: ''
})

const editingNews = reactive({
  id: null,
  title: '',
  summary: '',
  contentHTML: '',
  thumbnail: '',
  isFeatured: false,
  priority: null,
  status: 'DRAFT',
  categoryId: null,
  files: []
})

// File states
const thumbnailFile = ref(null)
const thumbnailPreview = ref('')

// UI state
const deleteModalAction = ref('')
const deleteMessage = ref('')

// Refs for file inputs
const thumbnailInput = ref(null)

// Computed properties
const selectedCategory = computed(() => {
  return categories.value.find(cat => cat.id === selectedCategoryId.value)
})

const featuredNews = computed(() => {
  return filteredNews.value.filter(news => news.isFeatured)
})

const canSaveNews = computed(() => {
  return editingNews.title.trim() && editingNews.categoryId
})

// Methods
const showToast = (message, type = 'info') => {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  }

  toast.message = message
  toast.type = type
  toast.icon = icons[type] || icons.info
  toast.show = true

  setTimeout(() => {
    toast.show = false
  }, 3000)
}

const hideToast = () => {
  toast.show = false
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const getStatusText = (status) => {
  const statusMap = {
    'DRAFT': 'Bản nháp',
    'PUBLISHED': 'Đã xuất bản',
    'ARCHIVED': 'Đã lưu trữ'
  }
  return statusMap[status] || status
}

const getNewsCount = (categoryId) => {
  // Sẽ được cập nhật khi fetch dữ liệu
  return 0 // Tạm thời
}

const selectAllCategories = () => {
  selectedCategoryId.value = null
  filterNews()
}

const selectCategory = (category) => {
  selectedCategoryId.value = category.id
  filterNews()
}

const editSelectedNews = (news) => {
  Object.assign(editingNews, news)
  activeContentTab.value = 'edit'
}

const toggleFeaturedView = () => {
  showAllFeatured.value = !showAllFeatured.value
}

// Phương thức filterNews mới sử dụng API filter
const filterNews = async () => {
  loading.value = true
  try {
    const pageNumber = currentPage.value - 1 // Chuyển từ 1-based sang 0-based

    // Xây dựng FilterDTO
    const filterDTO = {
      keyword: searchQuery.value || null,
      categoryId: selectedCategoryId.value || null,
      status: statusFilter.value || null,
      featured: null, // Có thể thêm toggle cho featured
      recentlyCreated: null,
      recentlyUpdated: null,
      sorts: buildSortItems()
    }

    // Gọi API filter
    const response = await api.post(`/news/filter?page=${pageNumber}&size=${pageSize.value}`, filterDTO)

    if (response.data) {
      newsData.value = response.data
    }
  } catch (error) {
    console.error('Error filtering news:', error)
    showToast('Lỗi khi tải tin tức', 'error')
  } finally {
    loading.value = false
  }
}

// Xây dựng danh sách sort items từ sortBy
const buildSortItems = () => {
  const sortMap = {
    'createAt': { sortBy: 'CREATED_AT', sortDirection: 'DESC' },
    'updateAt': { sortBy: 'UPDATED_AT', sortDirection: 'DESC' },
    'priority': { sortBy: 'VIEW_COUNT', sortDirection: 'DESC' }, // Tạm thời
    'viewCount': { sortBy: 'VIEW_COUNT', sortDirection: 'DESC' },
    'title': { sortBy: 'TITLE', sortDirection: 'ASC' }
  }

  const sortConfig = sortMap[sortBy.value]
  if (!sortConfig) return null

  return [{
    sortBy: sortConfig.sortBy,
    sortDirection: sortConfig.sortDirection
  }]
}

const sortNews = () => {
  filterNews() // Sử dụng API sort thay vì sort client-side
}

// Pagination methods
const resetPagination = () => {
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    filterNews()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    filterNews()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPage = (page) => {
  currentPage.value = page
  filterNews()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Category CRUD - giữ nguyên
const editCategory = (category) => {
  Object.assign(editingCategory, category)
  showCategoryModal.value = true
}

const saveCategory = async () => {
  if (!editingCategory.name.trim()) {
    showToast('Vui lòng nhập tên danh mục', 'error')
    return
  }

  loading.value = true
  try {
    const response = await fetch('/news/saveCategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editingCategory)
    })

    if (response.ok) {
      showToast('Lưu danh mục thành công', 'success')
      showCategoryModal.value = false
      fetchCategories()
      resetCategoryForm()
    } else {
      showToast('Lỗi khi lưu danh mục', 'error')
    }
  } catch (error) {
    showToast('Lỗi kết nối', 'error')
  } finally {
    loading.value = false
  }
}

const confirmDeleteCategory = (category) => {
  if (getNewsCount(category.id) > 0) {
    showToast('Không thể xóa danh mục có chứa tin tức', 'warning')
    return
  }

  editingCategory.id = category.id
  editingCategory.name = category.name
  deleteModalAction.value = 'category'
  deleteMessage.value = `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`
  showDeleteModal.value = true
}

const deleteCategory = async () => {
  loading.value = true
  try {
    const response = await fetch('/news/deleteCategory', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: editingCategory.id })
    })

    if (response.ok) {
      showToast('Xóa danh mục thành công', 'success')
      showDeleteModal.value = false
      fetchCategories()
    } else {
      const error = await response.json()
      showToast(error.message || 'Lỗi khi xóa danh mục', 'error')
    }
  } catch (error) {
    showToast('Lỗi kết nối', 'error')
  } finally {
    loading.value = false
  }
}

// News CRUD - cập nhật để sử dụng api service
const saveNews = async () => {
  if (!canSaveNews.value) {
    showToast('Vui lòng nhập đầy đủ thông tin bắt buộc', 'error')
    return
  }

  // Reset priority if not featured
  if (!editingNews.isFeatured) {
    editingNews.priority = null
  }

  loading.value = true

  // Prepare form data
  const formData = new FormData()

  // Add news data
  formData.append('news', JSON.stringify(editingNews))

  // Add thumbnail if exists
  if (thumbnailFile.value) {
    formData.append('thumbnail', thumbnailFile.value)
  }

  try {
    const response = await api.post('/news/saveNews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data) {
      showToast('Lưu tin tức thành công', 'success')
      await filterNews() // Load lại dữ liệu sau khi save
      resetNewsForm()
      activeContentTab.value = 'list'
    }
  } catch (error) {
    console.error('Error saving news:', error)
    showToast('Lỗi khi lưu tin tức', 'error')
  } finally {
    loading.value = false
  }
}

const confirmDeleteNews = (news) => {
  editingNews.id = news.id
  editingNews.title = news.title
  deleteModalAction.value = 'news'
  deleteMessage.value = `Bạn có chắc chắn muốn xóa tin tức "${news.title}"?`
  showDeleteModal.value = true
}

const deleteNews = async () => {
  loading.value = true
  try {
    const response = await api.post('/news/deleteNews', {
      id: editingNews.id
    })

    if (response.data) {
      showToast('Xóa tin tức thành công', 'success')
      showDeleteModal.value = false
      await filterNews() // Load lại dữ liệu
      resetNewsForm()
      activeContentTab.value = 'list'
    }
  } catch (error) {
    console.error('Error deleting news:', error)
    showToast('Lỗi khi xóa tin tức', 'error')
  } finally {
    loading.value = false
  }
}

const toggleFeatured = async (news) => {
  const updatedNews = {
    ...news,
    isFeatured: !news.isFeatured,
    priority: !news.isFeatured ? (news.priority || 1) : null
  }

  try {
    const response = await api.post('/news/saveNews', { news: updatedNews })

    if (response.data) {
      showToast(`Đã ${updatedNews.isFeatured ? 'đánh dấu' : 'bỏ đánh dấu'} tin nổi bật`, 'success')
      await filterNews() // Refresh data
    }
  } catch (error) {
    console.error('Error toggling featured:', error)
    showToast('Lỗi khi cập nhật', 'error')
  }
}

// File handling - giữ nguyên
const triggerFileInput = (type) => {
  if (type === 'thumbnail') {
    thumbnailInput.value.click()
  }
}

const handleThumbnailUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    thumbnailFile.value = file
    thumbnailPreview.value = URL.createObjectURL(file)
  }
}

const removeThumbnail = () => {
  thumbnailFile.value = null
  thumbnailPreview.value = ''
  editingNews.thumbnail = ''
}

// Form reset - giữ nguyên
const resetCategoryForm = () => {
  editingCategory.id = null
  editingCategory.name = ''
}

const resetNewsForm = () => {
  Object.assign(editingNews, {
    id: null,
    title: '',
    summary: '',
    contentHTML: '',
    thumbnail: '',
    isFeatured: false,
    priority: null,
    status: 'DRAFT',
    categoryId: selectedCategoryId.value
  })

  thumbnailFile.value = null
  thumbnailPreview.value = ''
}

// API calls - cập nhật để sử dụng api service
const fetchCategories = async () => {
  loading.value = true
  try {
    // Gọi API để lấy cả categories và news
    const response = await api.get('/news/getNewsCategories/all/0')

    if (response.data) {
      categories.value = response.data.categories || []

      // Nếu có dữ liệu news trong response (API cũ)
      if (response.data.news) {
        newsData.value = response.data.news
      }

      if (categories.value.length > 0 && !selectedCategoryId.value) {
        selectedCategoryId.value = categories.value[0].id
      }

      // Sử dụng API filter mới để lấy dữ liệu
      await filterNews()
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    showToast('Lỗi khi tải danh mục', 'error')
  } finally {
    loading.value = false
  }
}

const fetchNews = async () => {
  if (!selectedCategoryId.value) return

  loading.value = true
  try {
    // Sử dụng API filter thay vì API cũ
    await filterNews()
  } catch (error) {
    console.error('Error fetching news:', error)
    showToast('Lỗi khi tải tin tức', 'error')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchCategories()
})

// Watchers
watch(selectedCategoryId, () => {
  if (selectedCategoryId.value) {
    fetchNews()
  }
})

watch(pageSize, () => {
  resetPagination()
  filterNews()
})

watch([searchQuery, statusFilter, sortBy], () => {
  resetPagination()
  filterNews()
})

watch(() => editingNews.isFeatured, (newVal) => {
  if (!newVal) {
    editingNews.priority = null
  } else if (!editingNews.priority) {
    editingNews.priority = 1
  }
})
</script>
<style scoped>
.news-management-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Toast Notification */
.toast-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(100px);
}

.toast-container.active {
  opacity: 1;
  transform: translateY(0);
}

.toast {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 400px;
  animation: slideIn 0.3s ease;
}

.toast.success {
  border-left: 4px solid #10b981;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast.warning {
  border-left: 4px solid #f59e0b;
}

.toast.info {
  border-left: 4px solid #3b82f6;
}

.toast i:first-child {
  font-size: 20px;
}

.toast.success i:first-child {
  color: #10b981;
}

.toast.error i:first-child {
  color: #ef4444;
}

.toast.warning i:first-child {
  color: #f59e0b;
}

.toast.info i:first-child {
  color: #3b82f6;
}

.close-toast {
  margin-left: auto;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.close-toast:hover {
  opacity: 1;
}

.loading-spinner {
  position: fixed;
  bottom: 80px;
  left: 20px;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 1000;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Header */
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Category Navigation (Horizontal) */
.category-nav {
  background: white;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.category-nav-wrapper {
  padding: 16px;
  overflow-x: auto;
}

/* Thanh scrollbar */
.category-nav-wrapper::-webkit-scrollbar {
  height: 6px; /* vì là scroll ngang */
}

/* Track (nền scrollbar) */
.category-nav-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

/* Thumb (phần kéo) */
.category-nav-wrapper::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; /* xám nhạt */
  border-radius: 999px;
}

/* Hover cho dễ kéo */
.category-nav-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

.category-nav-wrapper::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.category-nav-wrapper:hover::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
}


.category-tabs {
  display: flex;
  gap: 8px;
  min-width: min-content;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
  min-width: fit-content;
}

.category-tab:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.category-tab.active {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
}

.category-tab i {
  font-size: 16px;
}

.category-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.category-tab:not(.active) .category-count {
  background: #e5e7eb;
  color: #6b7280;
}

.category-actions {
  display: flex;
  gap: 4px;
  margin-left: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.category-tab:hover .category-actions {
  opacity: 1;
}

/* Main Content Tabs */
.content-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 16px;
}

.content-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.content-tab:hover {
  color: #374151;
}

.content-tab.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
  background: #f5f5ff;
  border-radius: 8px 8px 0 0;
}

.content-tab .badge {
  background: #6366f1;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.content-tab.active .badge {
  background: white;
  color: #6366f1;
}

/* Tab Content */
.tab-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* List Tab */
.list-tab {
  padding: 0;
}

/* Featured News Section */
.featured-news-section {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
  border: 1px solid #fdba74;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
}

.featured-news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.featured-news-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
}

.featured-news-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #6366f1;
}

.featured-thumbnail {
  width: 200px;
  position: relative;
  flex-shrink: 0;
}

.featured-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #f59e0b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.featured-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.featured-content .news-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.featured-content .news-summary {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  flex: 1;
}

.featured-content .news-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
  align-items: center;
  flex-wrap: wrap;
}

.featured-content .news-meta i {
  margin-right: 4px;
}

.featured-content .priority-badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.featured-actions {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 1px solid #e5e7eb;
}

/* News List Controls */
.news-list-controls {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.search-filters {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  width: 100%;
  padding: 10px 36px 10px 36px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.2s;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #6366f1;
}

/* News Grid */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
}

.news-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  border-color: #6366f1;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.news-card.featured {
  border-color: #f59e0b;
  background: #fffbeb;
}

.news-card-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.news-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.news-status.draft {
  background: #f3f4f6;
  color: #6b7280;
}

.news-status.published {
  background: #d1fae5;
  color: #065f46;
}

.news-status.archived {
  background: #f3f4f6;
  color: #6b7280;
}

.news-thumbnail {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.news-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.news-card:hover .news-thumbnail img {
  transform: scale(1.05);
}

.featured-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #f59e0b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.news-card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-summary {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item.priority {
  grid-column: span 2;
  justify-content: center;
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-numbers {
  display: flex;
  gap: 4px;
  align-items: center;
}

.page-number {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.page-number.active {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
}

.page-ellipsis {
  color: #6b7280;
  padding: 0 8px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  cursor: pointer;
}

/* Edit Tab */
.edit-tab {
  padding: 0;
}

.news-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
}

.form-grid {
  gap: 0;
  min-height: 800px;
}

.form-column {
  padding: 24px;
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.form-column:first-child {
  border-right: 1px solid #e5e7eb;
}

.form-column.full-height {
  height: 100%;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 50%;
}

.form-section h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.priority-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority-input .form-control {
  flex: 1;
}

.priority-input .form-control.disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.char-count {
  font-size: 12px;
  color: #6b7280;
  text-align: right;
  margin-top: 4px;
}

/* Editor Wrapper */
.editor-wrapper {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
}

.preview-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
  margin-top: 24px;
}

.preview-section h5 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rich-text-preview {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: white;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.tiptap-preview {
  min-height: 160px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #374151;
}

.tiptap-preview h1, .tiptap-preview h2, .tiptap-preview h3 {
  color: #1f2937;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.tiptap-preview p {
  margin-bottom: 1em;
}

.tiptap-preview ul, .tiptap-preview ol {
  padding-left: 2em;
  margin-bottom: 1em;
}

.tiptap-preview blockquote {
  border-left: 3px solid #e5e7eb;
  padding-left: 1em;
  margin-left: 0;
  margin-right: 0;
  font-style: italic;
  color: #6b7280;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 160px;
  color: #9ca3af;
}

.preview-placeholder i {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.file-upload-area:hover {
  border-color: #6366f1;
  background: #f9fafb;
}

.upload-placeholder {
  color: #6b7280;
}

.upload-placeholder i {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.6;
}

.upload-placeholder p {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
}

.upload-placeholder small {
  font-size: 12px;
  color: #9ca3af;
}

.upload-preview {
  position: relative;
  max-width: 300px;
  margin: 0 auto;
}

.upload-preview img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.remove-file {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white;
  border: 1px solid #e5e7eb;
}

.file-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 24px;
  color: #9ca3af;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0 0 24px 0;
  font-size: 18px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirmation-modal {
  max-width: 400px;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.confirmation-content {
  text-align: center;
  padding: 24px;
}

.warning-icon {
  font-size: 48px;
  color: #f59e0b;
  margin-bottom: 16px;
}

.confirmation-content p {
  font-size: 16px;
  color: #374151;
  line-height: 1.5;
  margin: 0;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-primary {
  background: #6366f1;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #4f46e5;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #059669;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.btn-icon.active {
  background: #fef3c7;
  border-color: #fbbf24;
  color: #92400e;
}

.btn-icon.btn-danger {
  border-color: #fca5a5;
  color: #ef4444;
}

.btn-icon.btn-danger:hover {
  background: #fef2f2;
  border-color: #f87171;
  color: #dc2626;
}

.btn-icon.small {
  width: 28px;
  height: 28px;
  font-size: 12px;
}

.form-control {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  width: 100%;
}

.form-control:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-text {
  font-size: 14px;
  color: #374151;
}

/* Responsive */
@media (max-width: 1200px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-column:first-child {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
}

@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  .featured-news-item {
    flex-direction: column;
  }

  .featured-thumbnail {
    width: 100%;
    height: 200px;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }

  .category-nav-wrapper {
    padding: 12px;
  }

  .category-tabs {
    flex-wrap: nowrap;
    overflow-x: auto;
  }

  .content-tabs {
    flex-direction: column;
  }

  .news-list-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }

  .filter-group {
    flex-direction: column;
  }

  .pagination {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .pagination-controls {
    justify-content: center;
  }

  .form-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .form-actions {
    justify-content: center;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .modal {
    width: 95%;
    margin: 10px;
  }
}

@media (max-width: 480px) {
  .news-grid {
    grid-template-columns: 1fr;
  }

  .form-column {
    padding: 16px;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>