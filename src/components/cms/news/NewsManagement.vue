<template>
  <div class="news-management-container">
    <!-- Header -->
    <header class="header">
      <h1><i class="fas fa-newspaper"></i> Quản lý Tin tức</h1>
      <div class="header-actions">
        <button class="btn btn-primary" @click="addNewCategory">
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
          </button>

          <button
              v-for="category in categories"
              :key="category.id"
              class="category-tab"
              :class="{
                'active': selectedCategoryId === category.id,
                'inactive': !category.isActive
              }"
              @click="selectCategory(category)"
          >
            <i class="fa-solid fa-newspaper"></i>
            <span>{{ category.name }}</span>
            <span v-if="!category.isActive" class="inactive-badge">Ẩn</span>
            <div class="category-actions">
              <button class="btn-icon small" @click.stop="editCategory(category)" title="Sửa">
                <i class="fas fa-edit"></i>
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
                  <span><i class="far fa-calendar"></i> {{ formatDate(news.createAt || news.updateAt) }}</span>
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
                <!-- Đã bỏ DRAFT -->
                <option value="PUBLISHED">Đã xuất bản</option>
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
                    <span>{{ formatDate(news.createAt || news.updateAt) }}</span>
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
            <!-- Thêm phần bulk actions -->
            <div class="bulk-actions" v-if="selectedCategoryId">
              <button
                  class="btn btn-danger btn-sm"
                  @click="confirmDeleteAllByCategory"
                  :disabled="loading"
              >
                <i class="fas fa-trash"></i> Xóa tất cả tin trong danh mục
              </button>
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
                <i class="fas fa-times"></i> Quay lại
              </button>
              <button
                  v-if="editingNews.id"
                  type="button"
                  class="btn btn-danger"
                  @click="confirmDeleteNews(editingNews)"
                  :disabled="loading"
              >
                <i class="fas fa-trash"></i> Xóa tin
              </button>
              <button type="submit" class="btn btn-success" :disabled="!canSaveNews">
                <i class="fas fa-save"></i> Lưu tin tức
              </button>
            </div>
          </div>

          <div class="form-grid">
            <!-- Warning message khi danh mục đang ẩn -->
            <div v-if="showCategoryWarning" class="category-warning">
              <i class="fas fa-exclamation-triangle"></i>
              <span>Bạn đang chỉnh sửa tin của danh mục tin đang ẩn, nếu muốn xuất bản vui lòng mở danh mục tin hiện tại trước.</span>
            </div>

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
                    <option value="" disabled>Chọn danh mục</option>
                    <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                    >
                      {{category.name}} {{ category.isActive? "" : "(Đang ẩn)"}}
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
                        :disabled="disableStatusSelect"
                    >
                      <!-- Đã bỏ DRAFT -->
                      <option value="PUBLISHED">Xuất bản</option>
                      <option value="ARCHIVED">Lưu trữ</option>
                    </select>
                    <small v-if="disableStatusSelect" class="status-disabled-text">
                      Không thể thay đổi trạng thái khi danh mục đang ẩn
                    </small>
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
              <div style="width: 100%;">
                <h4><i class="fas fa-edit"></i> Nội dung</h4>
                <div class="editor-wrapper">
                  <!-- AdvancedEditor Component -->
                  <AdvancedEditModal v-model="editingNews.contentHTML"
                                     v-model:fileDTOs="fileDTOs"
                                     v-model:rawFiles="realFiles"
                  />
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
    <div v-if="showCategoryModal" class="modal-overlay-news" @click.self="showCategoryModal = false">
      <div class="modal-news">
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
          <div class="form-group">
            <label class="checkbox-label">
              <input
                  type="checkbox"
                  v-model="editingCategory.isActive"
                  class="checkbox"
              />
              <span class="checkbox-text">Hiển thị danh mục</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showCategoryModal = false">
            Hủy
          </button>
          <button
              class="btn btn-danger"
              @click="confirmDeleteCategoryModal"
              :disabled="loading"
          >
            <i class="fas fa-trash"></i> Xóa
          </button>
          <button
              class="btn btn-primary"
              @click="saveCategory"
              :disabled="!editingCategory.name || loading"
          >
            <i class="fas fa-save"></i> Lưu
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay-news" @click.self="showDeleteModal = false">
      <div class="modal-news confirmation-modal">
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
              @click="handleDeleteAction"
              :disabled="loading"
          >
            <i class="fas fa-trash"></i> Xóa
          </button>
        </div>
      </div>
    </div>
    <div v-if="toast.show" class="toast-notification" :class="toast.type">
      <i :class="toast.icon"></i>
      <span>{{ toast.message }}</span>
      <button class="btn-toast-close" @click="toast.show = false">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, watch, onUnmounted} from 'vue'
import AdvancedEditModal from "../../RichTextEditor/AdvancedEditModal.vue";
import api from "../../../api/api.js";

const fileDTOs= ref([])
const realFiles = ref([]);

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

// Thêm timeout ref để quản lý
const toastTimeout = ref(null)

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
  name: '',
  isActive: true
})

const editingNews = reactive({
  id: null,
  title: '',
  summary: '',
  contentHTML: '',
  thumbnail: '',
  isFeatured: false,
  priority: null,
  status: 'PUBLISHED', // Mặc định là PUBLISHED thay vì DRAFT
  categoryId: null,
  createAt: '',
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

// Tính toán danh mục hiện tại của tin đang chỉnh sửa
const currentNewsCategory = computed(() => {
  if (!editingNews.categoryId) return null
  return categories.value.find(cat => cat.id === editingNews.categoryId)
})

// Kiểm tra xem có cần hiển thị cảnh báo không
const showCategoryWarning = computed(() => {
  return editingNews.id && currentNewsCategory.value && !currentNewsCategory.value.isActive
})

// Vô hiệu hóa select trạng thái khi danh mục đang ẩn
const disableStatusSelect = computed(() => {
  return currentNewsCategory.value && !currentNewsCategory.value.isActive
})

const featuredNews = computed(() => {
  return filteredNews.value.filter(news => news.isFeatured)
})

const canSaveNews = computed(() => {
  return editingNews.title.trim() && editingNews.categoryId
})

// Methods
const showToast = (message, type = 'info') => {
  toast.message = message
  toast.type = type

  switch (type) {
    case 'success':
      toast.icon = 'fas fa-check-circle'
      break
    case 'error':
      toast.icon = 'fas fa-exclamation-circle'
      break
    case 'warning':
      toast.icon = 'fas fa-exclamation-triangle'
      break
    default:
      toast.icon = 'fas fa-info-circle'
  }

  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

const hideToast = () => {
  toast.show = false
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
    toastTimeout.value = null
  }
}
// Đảm bảo dọn dẹp khi component unmount
onUnmounted(() => {
  if (toastTimeout.value) {
    clearTimeout(toastTimeout.value)
  }
})

const formatDate = (dateString) => {
  if (!dateString) return ''

  try {
    let date;

    if (dateString instanceof Date) {
      date = dateString
    } else if (typeof dateString === 'string') {
      date = new Date(dateString)
    } else if (typeof dateString === 'number') {
      date = new Date(dateString)
    } else {
      return ''
    }

    // Kiểm tra date hợp lệ
    if (isNaN(date.getTime())) {
      return ''
    }

    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

// Sửa hàm formatDateForInput
const formatDateForInput = (dateString) => {
  if (!dateString) return ''

  // Nếu dateString là Date object
  if (dateString instanceof Date) {
    return dateString.toISOString().slice(0, 16)
  }

  // Nếu là string
  if (typeof dateString === 'string') {
    // Nếu dateString không có timezone, thêm 'Z' để parse thành UTC
    if (!dateString.includes('Z') && !dateString.includes('+')) {
      // Đối với LocalDateTime từ Spring Boot (format: "2024-01-15T10:30:00")
      // Chuyển thành format mà Date() có thể hiểu đúng
      return dateString.slice(0, 16) // Lấy "YYYY-MM-DDTHH:mm"
    }

    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  // Nếu là number (timestamp)
  if (typeof dateString === 'number') {
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  return ''
}

const getStatusText = (status) => {
  const statusMap = {
    'PUBLISHED': 'Đã xuất bản',
    'ARCHIVED': 'Đã lưu trữ'
  }
  return statusMap[status] || status
}

const getNewsCount = (categoryId) => {
  if (!categoryId) return 0
  return filteredNews.value.filter(news => news.categoryId === categoryId).length
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
  console.log('Edit news:', news)
  console.log('createAt value:', news.createAt)
  console.log('createAt type:', typeof news.createAt)

  // Copy news data
  Object.assign(editingNews, news)

  // Format ngày đăng cho input datetime-local - XỬ LÝ AN TOÀN
  if (news.createAt) {
    try {
      editingNews.createAt = formatDateForInput(news.createAt)
      console.log('Formatted createAt:', editingNews.createAt)
    } catch (error) {
      console.error('Error formatting date:', error)
      editingNews.createAt = formatDateForInput(new Date())
    }
  } else {
    // Nếu không có ngày, set ngày hiện tại
    editingNews.createAt = formatDateForInput(new Date())
  }

  // Đảm bảo files được copy
  if (news.files) {
    fileDTOs.value = [...news.files]
  } else {
    fileDTOs.value = []
  }

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
      featured: null,
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
    'priority': { sortBy: 'PRIORITY', sortDirection: 'DESC' },
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
  filterNews()
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

// Category CRUD
const addNewCategory = () => {
  resetCategoryForm()
  editingCategory.isActive = true
  showCategoryModal.value = true
}

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
    let response

    if (editingCategory.id) {
      // Gọi API PUT để cập nhật danh mục
      response = await api.put(`/news/newsCategory/${editingCategory.id}`, editingCategory)
    } else {
      // Gọi API POST để tạo mới danh mục
      response = await api.post('/news/newsCategory', editingCategory)
    }

    if (response.data) {
      showToast(editingCategory.id ? 'Cập nhật danh mục thành công' : 'Tạo danh mục thành công', 'success')
      showCategoryModal.value = false
      await fetchCategories()
      resetCategoryForm()
    }
  } catch (error) {
    console.error('Error saving category:', error)
    showToast(error.response?.data?.message || 'Lỗi khi lưu danh mục', 'error')
  } finally {
    loading.value = false
  }
}

const confirmDeleteCategoryModal = () => {
  if (getNewsCount(editingCategory.id) > 0) {
    showToast('Không thể xóa danh mục đã có tin tức. Vui lòng xóa hết tin trong danh mục trước.', 'error')
    return
  }

  deleteModalAction.value = 'category'
  deleteMessage.value = `Bạn có chắc chắn muốn xóa danh mục "${editingCategory.name}"?`
  showDeleteModal.value = true
}

const deleteCategory = async () => {
  loading.value = true
  try {
    const response = await api.delete(`/news/newsCategory/${editingCategory.id}`)

    if (response.status === 204) {
      showToast('Xóa danh mục thành công', 'success')
      showDeleteModal.value = false
      showCategoryModal.value = false
      await fetchCategories()
      resetCategoryForm()
    }
  } catch (error) {
    console.error('Error deleting category:', error)

    // Kiểm tra nếu lỗi là 400 Bad Request (có tin trong danh mục)
    if (error.response?.status === 400) {
      showToast('Không thể xóa danh mục đã có tin tức. Vui lòng xóa hết tin trong danh mục trước.', 'error')
    } else {
      showToast(error.response?.data?.message || 'Lỗi khi xóa danh mục', 'error')
    }
  } finally {
    loading.value = false
  }
}

// Sửa hàm khi lưu news (trong saveNews)
const saveNews = async () => {
  if (!canSaveNews.value) {
    showToast('Vui lòng nhập đầy đủ thông tin bắt buộc', 'error')
    return
  }

  // Reset priority if not featured
  if (!editingNews.isFeatured) {
    editingNews.priority = null
  }

  // Format ngày đăng trước khi gửi - XỬ LÝ date an toàn
  const newsToSave = {
    ...editingNews
  }

  // Xử lý createAt an toàn
  if (editingNews.createAt) {
    try {
      let dateObj;

      // Kiểm tra loại dữ liệu
      if (editingNews.createAt instanceof Date) {
        dateObj = editingNews.createAt
      } else if (typeof editingNews.createAt === 'string') {
        dateObj = new Date(editingNews.createAt)
      } else {
        dateObj = new Date()
      }

      // Format thành ISO string (Spring Boot có thể parse)
      newsToSave.createAt = dateObj.toISOString()
    } catch (error) {
      console.error('Error parsing date:', error)
      newsToSave.createAt = new Date().toISOString()
    }
  }

  // Lưu fileDTOs
  newsToSave.files = fileDTOs.value;

  loading.value = true

  // Prepare form data
  const formData = new FormData()

  // Add news data - Dùng Blob để đảm bảo JSON được xử lý đúng
  const newsBlob = new Blob([JSON.stringify(newsToSave)], {
    type: 'application/json'
  })
  formData.append('news', newsBlob)

  // Add thumbnail if exists
  if (thumbnailFile.value) {
    formData.append('thumbnail', thumbnailFile.value)
  }

  // Gửi files từ rich text editor
  if (realFiles.value && realFiles.value.length > 0) {
    realFiles.value.forEach(file => {
      if (file instanceof File) {
        formData.append('files', file)
      }
    })
  }

  console.log("SaveNEWs: ", newsToSave);

  // Debug: Log FormData
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value, typeof value)
  }

  try {
    const response = await api.post('/news/saveNews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data) {
      showToast('Lưu tin tức thành công', 'success')
      await filterNews()
      resetNewsForm()
      activeContentTab.value = 'list'
    }
  } catch (error) {
    console.error('Error saving news:', error)

    // Log chi tiết lỗi
    if (error.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response.data)
      console.error('Response headers:', error.response.headers)
    }

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
    const response = await api.delete(`/news/deleteNews/${editingNews.id}`)

    if (response.data) {
      showToast('Xóa tin tức thành công', 'success')
      showDeleteModal.value = false
      await filterNews()
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
      await filterNews()
    }
  } catch (error) {
    console.error('Error toggling featured:', error)
    showToast('Lỗi khi cập nhật', 'error')
  }
}

// File handling
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

// Form reset
const resetCategoryForm = () => {
  editingCategory.id = null
  editingCategory.name = ''
  editingCategory.isActive = true
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
    status: 'PUBLISHED', // Mặc định là PUBLISHED
    categoryId: selectedCategoryId.value,
    createAt: null // Khởi tạo null
  })

  // Nếu muốn set ngày hiện tại
  editingNews.createAt = formatDateForInput(new Date())

  thumbnailFile.value = null
  thumbnailPreview.value = ''
}

// API calls
const fetchCategories = async () => {
  loading.value = true
  try {
    // Gọi API - API này trả về cả news và categories
    const response = await api.get('/news/getNewsCategories/all/0')

    if (response.data) {
      // Lấy categories từ response
      categories.value = response.data.categories || []

      // Lấy news từ response và gán vào newsData
      // Đảm bảo cấu trúc phù hợp với newsData đang sử dụng
      if (response.data.news && response.data.news.content) {
        newsData.value = response.data.news
      } else {
        // Nếu không có news trong response, khởi tạo empty
        newsData.value = {
          content: [],
          page: {
            size: pageSize.value,
            number: 0,
            totalElements: 0,
            totalPages: 1
          }
        }
      }

      // Không cần gọi filterNews() nữa vì đã có dữ liệu news từ API
      // Nhưng vẫn set selectedCategoryId để UI hiển thị đúng
      selectedCategoryId.value = null

      // Show success message
      showToast('Tải dữ liệu thành công', 'success')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    showToast('Lỗi khi tải dữ liệu', 'error')

    // Khởi tạo empty data nếu có lỗi
    categories.value = []
    newsData.value = {
      content: [],
      page: {
        size: pageSize.value,
        number: 0,
        totalElements: 0,
        totalPages: 1
      }
    }
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
  filterNews()
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

// Thêm phương thức xóa tất cả tin trong danh mục
const confirmDeleteAllByCategory = () => {
  if (!selectedCategoryId.value) {
    showToast('Vui lòng chọn một danh mục', 'warning')
    return
  }

  const category = selectedCategory.value
  deleteModalAction.value = 'categoryAll'
  deleteMessage.value = `Bạn có chắc chắn muốn xóa TẤT CẢ tin tức trong danh mục "${category.name}"? Hành động này không thể hoàn tả!`
  showDeleteModal.value = true
}

// Thêm case xử lý trong deleteModal
// Tìm phần deleteModal và thêm case mới
const deleteAllNewsByCategory = async () => {
  if (!selectedCategoryId.value) return

  loading.value = true
  try {
    showToast(`Giả lập Đã xóa tất cả tin tức trong danh mục`, 'warning')

    // const response = await api.delete(`/news/deleteByCategory/${selectedCategoryId.value}`)
    //
    // if (response.data) {
    //   showToast(`Đã xóa tất cả tin tức trong danh mục`, 'warning')
    //   showDeleteModal.value = false
    //   await filterNews() // Load lại danh sách
    // }
  } catch (error) {
    console.error('Error deleting all news by category:', error)
    showToast('Lỗi khi xóa tin tức', 'error')
  } finally {
    loading.value = false
  }
}

const handleDeleteAction = () => {
  switch (deleteModalAction.value) {
    case 'category':
      deleteCategory()
      break
    case 'news':
      deleteNews()
      break
    case 'categoryAll':
      deleteAllNewsByCategory()
      break
  }
}
</script>

<style scoped>
/* Thêm các style mới */
.category-tab.inactive {
  opacity: 0.6;
  background-color: #f3f4f6;
}

.category-tab.inactive:hover {
  background-color: #e5e7eb;
}

.inactive-badge {
  background: #9ca3af;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

/* Cảnh báo danh mục ẩn */
.category-warning {
  background: #fffbeb;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  padding: 12px 16px;
  margin: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #92400e;
}

.category-warning i {
  color: #f59e0b;
  font-size: 18px;
}

.category-warning span {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

/* Text cho trạng thái bị vô hiệu hóa */
.status-disabled-text {
  display: block;
  margin-top: 4px;
  color: #ef4444;
  font-size: 12px;
  font-style: italic;
}

.news-management-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1001;
  animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 400px;
}

.toast-notification.success {
  background: linear-gradient(135deg, #28a745 0%, #34ce57 100%);
  color: white;
}

.toast-notification.error {
  background: linear-gradient(135deg, #dc3545 0%, #e4606d 100%);
  color: white;
}

.toast-notification.warning {
  background: linear-gradient(135deg, #ffc107 0%, #ffd54f 100%);
  color: #856404;
}

.toast-notification.info {
  background: linear-gradient(135deg, #17a2b8 0%, #4dc0d1 100%);
  color: white;
}

.toast-notification i {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-notification span {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
}

.btn-toast-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.btn-toast-close:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

/* Cập nhật status styles - chỉ còn published và archived */
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
/* Modal Overlay */
/* Modal centering fix */
.modal-overlay-news {
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
  padding: 20px;
}

.modal-news {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease;
  margin: auto; /* Thêm để đảm bảo căn giữa */
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

/* Responsive cho datetime input */
@media (max-width: 768px) {
  input[type="datetime-local"] {
    font-size: 14px;
  }
}

/* Thêm vào phần CSS */
.bulk-actions {
  margin-right: auto;
  margin-left: 16px;
}

.bulk-actions .btn-danger {
  background: #ef4444;
  color: white;
  border: 1px solid #dc2626;
  padding: 8px 16px;
  font-size: 13px;
}

.bulk-actions .btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.bulk-actions .btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>