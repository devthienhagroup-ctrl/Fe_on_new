<template>
  <div class="statistics-section-editor">
    <!-- Fixed Header -->
    <div class="editor-header gradient-bg fixed-header">
      <div class="header-content">
        <div class="left-header-wrapper">
          <i class="fas fa-chart-bar header-icon"></i>
          <div class="header-text">
            <h2 class="section-title">Số liệu thống kê</h2>
            <p class="section-subtitle">Quản lý nội dung phần thống kê</p>
          </div>
        </div>

        <div class="header-actions">
          <button
              @click="addContentItem"
              class="btn-add primary-gradient me-1"
          >
            <i class="fas fa-plus"></i>
            Thêm mục
          </button>

          <button
              @click="saveChanges"
              class="btn-save success-gradient"
              :disabled="isSaving"
          >
            <i class="fas fa-save"></i>
            {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="editor-main">
      <!-- Left Panel - Content Items -->
      <div class="content-panel">
        <div class="panel-header">
          <h3 class="panel-title">
            <i class="fas fa-list-ul"></i>
            Mục thống kê
          </h3>
        </div>

        <div class="content-items">
          <div
              v-for="(item, index) in contentData.content"
              :key="index"
              class="content-item-card"
              :class="{ 'active': activeItemIndex === index }"
              @click="activeItemIndex = index"
          >
            <div class="item-header">
              <div class="item-icon">
                <i :class="item.icon" :style="{ color: item.iconColor || contentData.colors.icon.default }"></i>
              </div>
              <div class="item-info">
                <h4 class="item-label">{{ item.label }}</h4>
                <p class="item-number">{{ item.number }}</p>
              </div>
              <div class="item-actions">
                <button
                    @click.stop="removeContentItem(index)"
                    class="btn-icon danger"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - Editor -->
      <div class="editor-panel">
        <div class="panel-header">
          <h3 class="panel-title">
            <i class="fas fa-edit"></i>
            Chỉnh sửa chi tiết
          </h3>
        </div>

        <div class="editor-form">
          <!-- Content Editor -->
          <div class="form-section" v-if="activeItemIndex !== null && contentData.content[activeItemIndex]">
            <h4 class="section-subtitle">
              <i class="fas fa-cube"></i>
              Nội dung mục {{ activeItemIndex + 1 }}
            </h4>

            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-hashtag"></i>
                Số liệu
              </label>
              <input
                  type="text"
                  v-model="contentData.content[activeItemIndex].number"
                  class="form-input"
                  placeholder="Ví dụ: 1,000"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-tag"></i>
                Nhãn
              </label>
              <input
                  type="text"
                  v-model="contentData.content[activeItemIndex].label"
                  class="form-input"
                  placeholder="Ví dụ: Dự án đã triển khai"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-icons"></i>
                Icon (FontAwesome)
              </label>
              <!-- Sử dụng IconPicker component -->
              <IconPicker
                  v-model="contentData.content[activeItemIndex].icon"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-palette"></i>
                Màu icon
              </label>
              <div class="color-input-group">
                <input
                    type="color"
                    v-model="contentData.content[activeItemIndex].iconColor"
                    class="color-input"
                />
                <input
                    type="text"
                    v-model="contentData.content[activeItemIndex].iconColor"
                    class="form-input"
                    placeholder="#FFFFFF"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-align-left"></i>
                Mô tả
              </label>
              <textarea
                  v-model="contentData.content[activeItemIndex].description"
                  class="form-textarea"
                  rows="4"
                  placeholder="Mô tả chi tiết..."
              ></textarea>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <div class="empty-state-content">
              <i class="fas fa-mouse-pointer empty-icon"></i>
              <p class="empty-text">Vui lòng chọn một mục để chỉnh sửa</p>
            </div>
          </div>

          <!-- Colors Editor -->
          <div class="form-section">
            <h4 class="section-subtitle">
              <i class="fas fa-palette"></i>
              Màu sắc
            </h4>

            <div class="collapse-group">
              <div
                  class="collapse-header"
                  @click="toggleCollapse('gradient')"
              >
                <span>Gradient</span>
                <i :class="collapsedSections.gradient ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
              </div>
              <div v-if="!collapsedSections.gradient" class="collapse-content">
                <div class="form-group">
                  <label class="form-label">Màu 1</label>
                  <div class="color-input-group">
                    <input
                        type="color"
                        v-model="contentData.colors.gradient.color1"
                        class="color-input"
                    />
                    <input
                        type="text"
                        v-model="contentData.colors.gradient.color1"
                        class="form-input"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Màu 2</label>
                  <div class="color-input-group">
                    <input
                        type="color"
                        v-model="contentData.colors.gradient.color2"
                        class="color-input"
                    />
                    <input
                        type="text"
                        v-model="contentData.colors.gradient.color2"
                        class="form-input"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Màu 3</label>
                  <div class="color-input-group">
                    <input
                        type="color"
                        v-model="contentData.colors.gradient.color3"
                        class="color-input"
                    />
                    <input
                        type="text"
                        v-model="contentData.colors.gradient.color3"
                        class="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="collapse-group">
              <div
                  class="collapse-header"
                  @click="toggleCollapse('textColors')"
              >
                <span>Màu văn bản</span>
                <i :class="collapsedSections.textColors ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
              </div>
              <div v-if="!collapsedSections.textColors" class="collapse-content">
                <div class="color-grid">
                  <div class="color-item">
                    <label>Số liệu</label>
                    <div class="color-input-group">
                      <input
                          type="color"
                          v-model="contentData.colors.text.number"
                          class="color-input"
                      />
                      <input
                          type="text"
                          v-model="contentData.colors.text.number"
                          class="form-input"
                      />
                    </div>
                  </div>
                  <div class="color-item">
                    <label>Nhãn</label>
                    <div class="color-input-group">
                      <input
                          type="color"
                          v-model="contentData.colors.text.label"
                          class="color-input"
                      />
                      <input
                          type="text"
                          v-model="contentData.colors.text.label"
                          class="form-input"
                      />
                    </div>
                  </div>
                  <div class="color-item">
                    <label>Mô tả</label>
                    <div class="color-input-group">
                      <input
                          type="color"
                          v-model="contentData.colors.text.description"
                          class="color-input"
                      />
                      <input
                          type="text"
                          v-model="contentData.colors.text.description"
                          class="form-input"
                      />
                    </div>
                  </div>
                  <div class="color-item">
                    <label>Sup (số nhỏ)</label>
                    <div class="color-input-group">
                      <input
                          type="color"
                          v-model="contentData.colors.text.sup"
                          class="color-input"
                      />
                      <input
                          type="text"
                          v-model="contentData.colors.text.sup"
                          class="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="collapse-group">
              <div
                  class="collapse-header"
                  @click="toggleCollapse('iconColors')"
              >
                <span>Màu icon mặc định</span>
                <i :class="collapsedSections.iconColors ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
              </div>
              <div v-if="!collapsedSections.iconColors" class="collapse-content">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Màu mặc định</label>
                    <div class="color-input-group">
                      <input
                          type="color"
                          v-model="contentData.colors.icon.default"
                          class="color-input"
                      />
                      <input
                          type="text"
                          v-model="contentData.colors.icon.default"
                          class="form-input"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Màu hover</label>
                    <div class="color-input-group">
                      <input
                          type="color"
                          v-model="contentData.colors.icon.hover"
                          class="color-input"
                      />
                      <input
                          type="text"
                          v-model="contentData.colors.icon.hover"
                          class="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Typography Editor -->
          <div class="form-section">
            <h4 class="section-subtitle">
              <i class="fas fa-font"></i>
              Typography
            </h4>

            <div class="collapse-group">
              <div
                  class="collapse-header"
                  @click="toggleCollapse('numberTypography')"
              >
                <span>Số liệu</span>
                <i :class="collapsedSections.numberTypography ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
              </div>
              <div v-if="!collapsedSections.numberTypography" class="collapse-content">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Font Size</label>
                    <input
                        type="text"
                        v-model="contentData.typography.number.fontSize"
                        class="form-input"
                        placeholder="32px"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Font Weight</label>
                    <input
                        type="text"
                        v-model="contentData.typography.number.fontWeight"
                        class="form-input"
                        placeholder="700"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Line Height</label>
                    <input
                        type="text"
                        v-model="contentData.typography.number.lineHeight"
                        class="form-input"
                        placeholder="1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="collapse-group">
              <div
                  class="collapse-header"
                  @click="toggleCollapse('labelTypography')"
              >
                <span>Nhãn</span>
                <i :class="collapsedSections.labelTypography ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
              </div>
              <div v-if="!collapsedSections.labelTypography" class="collapse-content">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Font Size</label>
                    <input
                        type="text"
                        v-model="contentData.typography.label.fontSize"
                        class="form-input"
                        placeholder="14px"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Font Weight</label>
                    <input
                        type="text"
                        v-model="contentData.typography.label.fontWeight"
                        class="form-input"
                        placeholder="500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="collapse-group">
              <div
                  class="collapse-header"
                  @click="toggleCollapse('iconTypography')"
              >
                <span>Icon</span>
                <i :class="collapsedSections.iconTypography ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
              </div>
              <div v-if="!collapsedSections.iconTypography" class="collapse-content">
                <div class="form-group">
                  <label class="form-label">Font Size</label>
                  <input
                      type="text"
                      v-model="contentData.typography.icon.fontSize"
                      class="form-input"
                      placeholder="48px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal chọn icon -->
    <div v-if="showIconModal" class="icon-modal-backdrop" @click.self="closeIconModal">
      <div class="icon-modal card">
        <div class="icon-modal-header">
          <span class="icon-modal-title">Chọn icon Font Awesome 6</span>
          <button type="button" class="btn-close" @click="closeIconModal"></button>
        </div>
        <div class="icon-modal-body">
          <div v-for="entry in iconEntries" :key="entry.key" class="mb-4">
            <div class="icon-category-title">{{ entry.key }}</div>
            <div class="icon-grid">
              <button
                  v-for="icon in entry.icons"
                  :key="icon"
                  type="button"
                  class="icon-option"
                  :class="{ active: icon === selectedIcon }"
                  @click="selectIcon(icon)"
              >
                <i :class="icon" :style="{ color: activeIconColor }"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast notification -->
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
import {ref, reactive, onMounted, computed} from 'vue'
import api from "../../../../api/api.js"
import FA6 from "../../../../assets/js/FA6icons.json"
import IconPicker from "../../../RichTextEditor/IconPicker.vue";

const toast = ref({
  show: false,
  message: '',
  type: 'success',
  icon: 'icon-check'
})

// Icon modal state
const showIconModal = ref(false)
const selectedIcon = ref('')

// Icon entries from JSON
const iconEntries = computed(() =>
    Object.entries(FA6 || {}).map(([key, icons]) => ({ key, icons }))
)

// Active icon color
const activeIconColor = computed(() => {
  if (activeItemIndex.value !== null) {
    return contentData.content[activeItemIndex.value].iconColor || contentData.colors.icon.default
  }
  return contentData.colors.icon.default
})

// Refs
const sectionData = ref(null)
const activeItemIndex = ref(null)
const isSaving = ref(false)

// Content data structure
const contentData = reactive({
  content: [],
  colors: {
    gradient: {
      color1: '#00C2FF',
      color2: '#031358',
      color3: '#0629BE'
    },
    text: {
      number: '#FFFFFF',
      label: 'rgba(255, 255, 255, 0.9)',
      description: '#e1f2ff',
      sup: 'rgba(255, 255, 255, 0.8)'
    },
    icon: {
      default: '#FFFFFF',
      hover: '#FFFFFF'
    },
    divider: {
      color: '#FFFFFF',
      opacity: 0.7
    }
  },
  typography: {
    number: {
      fontSize: '32px',
      fontWeight: '700',
      lineHeight: '1'
    },
    sup: {
      fontSize: '18px',
      fontWeight: '600'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500'
    },
    description: {
      fontSize: '13px',
      lineHeight: '1.4'
    },
    icon: {
      fontSize: '48px'
    }
  },
  layout: {
    container: {
      maxWidth: '1400px',
      padding: '0 20px'
    },
    item: {
      height: '120px',
      expandedHeight: '220px',
      margin: '0 10px',
      borderRadius: '10px',
      shadow: '0 -5px 15px rgba(0, 0, 0, 0.1)',
      shadowHover: '0 -10px 25px rgba(0, 0, 0, 0.15)',
      translateY: '-20px'
    },
    expandedSection: {
      height: '100px'
    },
    contentPadding: '20px',
    spacing: {
      iconMargin: '15px',
      numberMargin: '5px',
      dividerMargin: '10px',
      dividerWidth: '40px',
      dividerHeight: '3px'
    }
  }
})

// Collapsed sections state
const collapsedSections = reactive({
  gradient: true,
  textColors: true,
  iconColors: true,
  numberTypography: true,
  labelTypography: true,
  iconTypography: true,
  container: true,
  item: true
})

// Methods
const loadSectionData = async () => {
  try {
    const response = await api.get("/cms/getSection/2")
    sectionData.value = response.data

    if (sectionData.value?.contentJson) {
      const parsedData = JSON.parse(sectionData.value.contentJson)

      // Merge với default structure để đảm bảo tất cả fields tồn tại
      Object.assign(contentData, parsedData)

      // Set active item index nếu có content
      if (contentData.content && contentData.content.length > 0) {
        activeItemIndex.value = 0
        // Initialize icon color if not exists
        contentData.content.forEach(item => {
          if (!item.iconColor) {
            item.iconColor = '#FFFFFF'
          }
        })
      }
    }
  } catch (error) {
    console.error('Error loading section data:', error)
    showToast('Không thể tải dữ liệu section', 'error')
  }
}

const saveChanges = async () => {
  try {
    isSaving.value = true

    if (!sectionData.value) {
      showToast('Không tìm thấy dữ liệu section', 'error')
      return
    }

    // Update contentJson
    sectionData.value.contentJson = JSON.stringify(contentData)

    const form = new FormData();
    form.append(
        "section",
        new Blob([JSON.stringify(sectionData.value)], {type: "application/json"})
    );

    const response = await api.post("/cms/saveChange", form);
    console.log(response.data.status);
    if (response.status === 200) {
      showToast('Đã lưu thay đổi thành công', 'success')
    } else {
      showToast('Lưu thay đổi thất bại', 'error')
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Có lỗi xảy ra khi lưu', 'error')
  } finally {
    isSaving.value = false
  }
}

const addContentItem = () => {
  const newItem = {
    number: '0',
    label: 'Mục mới',
    icon: 'fas fa-star',
    iconColor: '#FFFFFF',
    description: 'Mô tả cho mục mới'
  }

  contentData.content.push(newItem)
  activeItemIndex.value = contentData.content.length - 1
}

const removeContentItem = (index) => {
  if (contentData.content.length <= 1) {
    showToast('Phải có ít nhất một mục thống kê', 'warning')
    return
  }

  contentData.content.splice(index, 1)

  // Adjust active index
  if (activeItemIndex.value >= index) {
    activeItemIndex.value = Math.max(0, activeItemIndex.value - 1)
  }
}

const toggleCollapse = (section) => {
  collapsedSections[section] = !collapsedSections[section]
}

// Icon modal functions
const openIconModal = () => {
  if (activeItemIndex.value !== null) {
    selectedIcon.value = contentData.content[activeItemIndex.value].icon
    showIconModal.value = true
  } else {
    showToast('Vui lòng chọn một mục thống kê trước', 'warning')
  }
}

const closeIconModal = () => {
  showIconModal.value = false
}

const selectIcon = (icon) => {
  if (activeItemIndex.value !== null) {
    contentData.content[activeItemIndex.value].icon = icon
    showToast(`Đã chọn icon: ${icon}`, 'success')
  }
  closeIconModal()
}

const showToast = (message, type = 'info') => {
  toast.value = {
    show: true,
    message,
    type,
    icon: type === 'success' ? 'fas fa-check' :
        type === 'error' ? 'fas fa-times-circle' :
            type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'
  }

  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Lifecycle
onMounted(() => {
  loadSectionData()
})
</script>

<style scoped>
.statistics-section-editor {
  background: #f8f9fa;
  min-height: 100vh;
}

/* Cập nhật style cho form group chứa IconPicker */
.form-group:has(.input-with-preview) {
  margin-bottom: 25px;
}

/* Đảm bảo IconPicker hiển thị đúng */
.input-with-preview {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-with-preview .form-input {
  flex: 1;
}

/* Fixed Header Styles */
.editor-header {
  background: linear-gradient(135deg, #031358, #0629BE);
  color: white;
  padding: 20px 30px;
  border-bottom: 1px solid #e9ecef;
}

.left-header-wrapper {
  display: flex;
  gap: 10px;
}

.fixed-header {
  position: sticky;
  top: -20px;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
}

.header-icon {
  font-size: 2.5rem;
  color: #4a6cf7;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(to right, #4a6cf7, #6a8cff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
}

/* Button Styles */
.btn-save {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-gradient {
  background: linear-gradient(135deg, #28a745, #34ce57);
  color: white;
}

.primary-gradient {
  background: linear-gradient(135deg, #4a6cf7, #6a8cff);
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-icon {
  padding: 6px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.btn-icon.danger {
  color: #dc3545;
}

.btn-icon.danger:hover {
  background: rgba(220, 53, 69, 0.1);
}

.btn-add {
  padding: 8px 16px;
}

/* Icon Select Button */
.btn-icon-select {
  background: linear-gradient(135deg, #4a6cf7, #6a8cff);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.btn-icon-select:hover {
  background: linear-gradient(135deg, #3a5ce5, #5a7cff);
  transform: translateY(-1px);
}

/* Main Content Layout */
.editor-main {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  padding: 20px;
  min-height: 600px;
}

/* Panel Styles */
.content-panel, .editor-panel {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: 1.2rem;
  color: #031358;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Content Items */
.content-items {
  padding: 20px;
}

.content-item-card {
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.content-item-card:hover {
  border-color: #4a6cf7;
  background: #f8f9ff;
}

.content-item-card.active {
  border-color: #4a6cf7;
  background: #f8f9ff;
  box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.1);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.item-icon {
  font-size: 1.5rem;
  color: #4a6cf7;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(74, 108, 247, 1);
  border-radius: 8px;
}

.item-info {
  flex: 1;
}

.item-label {
  font-size: 0.95rem;
  color: #495057;
  margin: 0 0 5px 0;
  font-weight: 500;
}

.item-number {
  font-size: 1.1rem;
  color: #0629BE;
  margin: 0;
  font-weight: 600;
}

.item-actions {
  display: flex;
  gap: 5px;
}

/* Editor Form */
.editor-form {
  padding: 20px;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.form-section:last-child {
  border-bottom: none;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Empty State */
.empty-state {
  padding: 40px 20px;
  text-align: center;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.empty-icon {
  font-size: 3rem;
  color: #6c757d;
  opacity: 0.5;
}

.empty-text {
  color: #6c757d;
  font-size: 0.95rem;
  margin: 0;
}

/* Color Input */
.input-with-preview {
  display: flex;
  gap: 10px;
  align-items: center;
}

.icon-preview {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 1.5rem;
}

.color-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-input {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.color-item label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.85rem;
  color: #6c757d;
}

/* Collapse Groups */
.collapse-group {
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.collapse-header {
  padding: 12px 15px;
  background: #f8f9fa;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: #495057;
  transition: background 0.3s ease;
}

.collapse-header:hover {
  background: #e9ecef;
}

.collapse-content {
  padding: 15px;
  background: white;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
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
  flex-shrink: 0;
}

.btn-toast-close:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

/* Icon Modal Styles */
.icon-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

.icon-modal {
  background: white;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.icon-modal-header {
  background: #3b82f6;
  padding: 16px 20px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.icon-modal-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.icon-modal-header .btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.icon-modal-header .btn-close:hover {
  opacity: 1;
}

.icon-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.icon-category-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 10px;
  text-transform: capitalize;
  padding-bottom: 5px;
  border-bottom: 1px solid #e9ecef;
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.icon-option {
  width: 50px;
  height: 50px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-option:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
}

.icon-option.active {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
}

.icon-option i {
  transition: color 0.2s ease;
}

.icon-modal-body::-webkit-scrollbar {
  width: 8px;
}

.icon-modal-body::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.icon-modal-body::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

/* Animations */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .editor-main {
    grid-template-columns: 1fr;
  }

  .icon-modal {
    width: 90%;
  }
}

@media (max-width: 768px) {
  .fixed-header {
    padding: 15px 20px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 10px;
    margin-bottom: 15px;
  }

  .editor-main {
    margin-top: 180px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .input-with-preview {
    flex-direction: column;
    align-items: stretch;
  }

  .icon-modal {
    width: 95%;
    max-height: 90vh;
  }

  .icon-grid {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .editor-main {
    padding: 10px;
    margin-top: 180px;
  }

  .color-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    justify-content: center;
  }

  .btn-save {
    width: 100%;
    justify-content: center;
  }

  .icon-option {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>