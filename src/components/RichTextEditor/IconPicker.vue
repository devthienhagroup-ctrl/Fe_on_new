<template>
  <div>
    <!-- Input để chọn icon -->
    <div class="input-with-preview">
      <button class="btn-icon-select" type="button" @click="openModal">
        <i class="fa-solid fa-icons me-1"></i>
        Chọn icon
      </button>
      <div class="icon-preview">
        <i :class="modelValue"></i>
      </div>
    </div>

    <!-- Modal chọn icon -->
    <div v-if="showModal" class="icon-modal-backdrop" @click.self="closeModal">
      <div class="icon-modal card">
        <div class="icon-modal-header">
          <div class="icon-modal-title">
            <i class="fa-solid fa-icons me-2"></i>
            Chọn icon Font Awesome 6
          </div>
          <button type="button" class="btn-close" @click="closeModal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <!-- Search box -->
        <div class="icon-modal-search">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-search search-icon"></i>
            <input
                type="text"
                v-model="searchQuery"
                class="search-input"
                placeholder="Tìm kiếm icon... (ví dụ: home, user, star)"
                @input="handleSearch"
            />
            <button
                v-if="searchQuery"
                class="btn-clear-search"
                @click="clearSearch"
            >
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="search-count" v-if="searchQuery">
            Tìm thấy {{ searchResults.length }} icon
          </div>
        </div>

        <div class="icon-modal-body">
          <!-- Search results -->
          <div v-if="searchQuery && searchResults.length > 0">
            <div class="icon-category-title">
              <i class="fa-solid fa-search me-2"></i>
              Kết quả tìm kiếm
            </div>
            <div class="icon-grid">
              <button
                  v-for="icon in searchResults"
                  :key="icon"
                  type="button"
                  class="icon-option"
                  :class="{ active: icon === modelValue }"
                  @click="selectIcon(icon)"
              >
                <i :class="icon"></i>
              </button>
            </div>
          </div>

          <!-- Empty search state -->
          <div v-if="searchQuery && searchResults.length === 0" class="empty-search">
            <i class="fa-solid fa-search empty-search-icon"></i>
            <p class="empty-search-text">Không tìm thấy icon phù hợp</p>
          </div>

          <!-- All icons by category (only show when not searching) -->
          <div v-if="!searchQuery">
            <div v-for="entry in iconEntries" :key="entry.key" class="mb-4">
              <div class="icon-category-title">
                <i class="fa-solid fa-folder me-2"></i>
                {{ formatCategoryName(entry.key) }}
                <span class="category-count">({{ entry.icons.length }})</span>
              </div>
              <div class="icon-grid">
                <button
                    v-for="icon in entry.icons"
                    :key="icon"
                    type="button"
                    class="icon-option"
                    :class="{ active: icon === modelValue }"
                    @click="selectIcon(icon)"
                >
                  <i :class="icon"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="icon-modal-footer">
          <div class="selected-icon-info" v-if="modelValue">
            <div class="selected-icon-preview">
              <i :class="modelValue"></i>
            </div>
            <div class="selected-icon-text">
              <div class="selected-icon-name">{{ modelValue }}</div>
              <div class="selected-icon-hint">Click để chọn icon này</div>
            </div>
          </div>
          <button class="btn-close-modal" @click="closeModal">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FA6 from '../../assets/js/FA6icons.json'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// State
const showModal = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const allIcons = ref([])
const fuse = ref(null)

// Icon entries
const iconEntries = computed(() =>
    Object.entries(FA6 || {}).map(([key, icons]) => ({ key, icons }))
)

// Initialize all icons list and Fuse.js
onMounted(async () => {
  // Flatten all icons for search
  allIcons.value = Object.values(FA6 || {}).flat()

  // Dynamically load Fuse.js from CDN
  if (typeof window.Fuse === 'undefined') {
    await loadFuseJS()
  }

  initializeFuse()
})

// Load Fuse.js from CDN
const loadFuseJS = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.Fuse !== 'undefined') {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.min.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Fuse.js'))
    document.head.appendChild(script)
  })
}

// Initialize Fuse.js
const initializeFuse = () => {
  if (typeof window.Fuse === 'undefined') return

  fuse.value = new window.Fuse(allIcons.value, {
    keys: [''],
    threshold: 0.3,
    distance: 100,
    includeScore: true,
    shouldSort: true,
    includeMatches: true,
    minMatchCharLength: 2,
    findAllMatches: true
  })
}

// Handle search
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  if (!fuse.value) {
    // Fallback: simple filter if Fuse.js not loaded
    searchResults.value = allIcons.value.filter(icon =>
        icon.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    return
  }

  const results = fuse.value.search(searchQuery.value)
  searchResults.value = results.map(result => result.item)
}

// Format category name
const formatCategoryName = (key) => {
  const names = {
    'regular': 'Regular Icons',
    'solid': 'Solid Icons',
    'brands': 'Brand Icons',
    'light': 'Light Icons',
    'thin': 'Thin Icons',
    'duotone': 'Duotone Icons',
    'sharp': 'Sharp Icons'
  }
  return names[key] || key.charAt(0).toUpperCase() + key.slice(1)
}

// Open modal
const openModal = () => {
  showModal.value = true
  searchQuery.value = ''
  searchResults.value = []
}

// Close modal
const closeModal = () => {
  showModal.value = false
}

// Select icon
const selectIcon = (icon) => {
  emit('update:modelValue', icon)
  closeModal()
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}
</script>

<style scoped>
/* Input with preview */
.input-with-preview {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-icon-select {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-icon-select:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-1px);
}

.icon-preview {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.5rem;
  color: #5a6cf7; /* Màu xám cho icon mặc định */
}

/* Modal backdrop */
.icon-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  backdrop-filter: blur(2px);
}

/* Modal */
.icon-modal {
  background: white;
  width: 85%;
  max-width: 900px;
  max-height: 85vh;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

/* Modal header */
.icon-modal-header {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  padding: 18px 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.icon-modal-title {
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}

.icon-modal-header .btn-close {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-modal-header .btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* Search section */
.icon-modal-search {
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e9ecef;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: #94a3b8;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-clear-search {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.btn-clear-search:hover {
  color: #64748b;
  background: #f1f5f9;
}

.search-count {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #64748b;
  text-align: right;
}

/* Modal body */
.icon-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: white;
}

/* Icon category */
.icon-category-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1e293b;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.category-count {
  margin-left: 6px;
  color: #64748b;
  font-weight: normal;
}

/* Icon grid */
.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.icon-option {
  width: 54px;
  height: 54px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.icon-option:hover {
  border-color: #3b82f6;
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.icon-option.active {
  border-color: #3b82f6;
  background: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* Tạo viền trắng cho icon khi active để dễ nhìn */
.icon-option.active::before {
  content: '';
  position: absolute;
  inset: 2px;
  border: 2px solid white;
  border-radius: 6px;
  pointer-events: none;
}

.icon-option i {
  transition: color 0.2s ease;
  position: relative;
  z-index: 1;
  color: #6b7280; /* Màu icon mặc định */
}

.icon-option:hover i {
  color: #3b82f6; /* Màu icon khi hover */
}

.icon-option.active i {
  color: white !important; /* Màu icon khi active */
}

/* Empty search state */
.empty-search {
  text-align: center;
  padding: 40px 20px;
}

.empty-search-icon {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-search-text {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* Modal footer */
.icon-modal-footer {
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-icon-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-icon-preview {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  font-size: 1.5rem;
  color: #6b7280; /* Màu icon mặc định */
}

.selected-icon-text {
  display: flex;
  flex-direction: column;
}

.selected-icon-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1e293b;
}

.selected-icon-hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}

.btn-close-modal {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close-modal:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* Scrollbar styling */
.icon-modal-body::-webkit-scrollbar {
  width: 8px;
}

.icon-modal-body::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 4px;
}

.icon-modal-body::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

.icon-modal-body::-webkit-scrollbar-track {
  background-color: #f1f5f9;
}

/* Responsive */
@media (max-width: 768px) {
  .icon-modal {
    width: 95%;
    max-height: 90vh;
  }

  .input-with-preview {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-icon-select {
    width: 100%;
    justify-content: center;
  }

  .icon-grid {
    justify-content: center;
  }

  .icon-option {
    width: 46px;
    height: 46px;
    font-size: 1.4rem;
  }

  .icon-modal-footer {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .selected-icon-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>