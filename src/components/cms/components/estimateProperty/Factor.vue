<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Yếu tố ảnh hưởng</h2>
      <div class="header-controls">
        <button class="btn btn-primary" @click="saveChanges" :disabled="isLoading">
          <i class="fas fa-save"></i> {{ isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
        </button>
        <button class="btn btn-secondary" @click="addNewItem" :disabled="isLoading">
          <i class="fas fa-plus"></i> Thêm Yếu tố
        </button>
      </div>
    </div>

    <!-- Tab điều hướng -->
    <div class="navigation-tabs">
      <button
          class="tab-button"
          :class="{ active: activeTab === 'general' }"
          @click="activeTab = 'general'"
      >
        <i class="fas fa-cog"></i> Cấu hình chung
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'items' }"
          @click="activeTab = 'items'"
      >
        <i class="fas fa-list"></i> Danh sách Yếu tố ({{ content.items.length }})
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-palette"></i> Kiểu dáng & Giao diện
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Cấu hình chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Tiêu đề section -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề Section</h3>
            <div class="form-group">
              <label for="sectionTitle">Tiêu đề chính</label>
              <input
                  type="text"
                  id="sectionTitle"
                  v-model="content.sectionTitle"
                  placeholder="GIÁ TRỊ BẤT ĐỘNG SẢN ĐƯỢC DỰA TRÊN"
              />
            </div>
          </div>

          <!-- Cấu hình chung -->
          <div class="setting-section">
            <h3><i class="fas fa-sliders-h"></i> Cấu hình chung</h3>
            <div class="form-group">
              <label for="sortOrder">Thứ tự sắp xếp</label>
              <input
                  type="number"
                  id="sortOrder"
                  v-model.number="content.sortOrder"
                  min="1"
                  max="100"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Danh sách Yếu tố -->
      <div v-if="activeTab === 'items'" class="items-settings">
        <div class="items-container">
          <div v-for="(item, index) in content.items" :key="item.id || index" class="item-card">
            <div class="item-header">
              <div class="item-title">
                <h4>{{ item.title || 'Yếu tố mới' }}</h4>
                <span class="item-id">ID: {{ item.id || 'Tạo mới' }}</span>
              </div>
              <div class="item-actions">
                <button class="btn-icon" @click="toggleItemActive(index)" :title="item.isActive ? 'Đang hiển thị' : 'Đang ẩn'">
                  <i class="fas" :class="item.isActive ? 'fa-eye' : 'fa-eye-slash'"></i>
                </button>
                <button class="btn-icon" @click="moveItemUp(index)" :disabled="index === 0">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click="moveItemDown(index)" :disabled="index === content.items.length - 1">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-danger" @click="removeItem(index)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <div class="item-content">
              <!-- Tiêu đề yếu tố -->
              <div class="form-group">
                <label>Tiêu đề yếu tố</label>
                <input
                    type="text"
                    v-model="item.title"
                    :placeholder="'Tiêu đề yếu tố ' + (index + 1)"
                />
              </div>

              <!-- Mô tả -->
              <div class="form-group">
                <div class="label" style="display: flex; justify-content: space-between">
                  <label>Mô tả chi tiết</label>
                  <AdvancedEditModal
                      v-model="item.description"
                  ></AdvancedEditModal>
                </div>
                <div class="rich-text-editor-wrapper" style="
                margin-top: 10px;
                padding: 12px 16px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                background-color: white;
                ">
                  <div class="tiptap" v-html="item.description"></div>
                </div>
              </div>

              <!-- Hình ảnh tiêu đề -->
              <div class="form-group">
                <label>Hình ảnh tiêu đề</label>
                <div class="file-upload compact">
                  <div class="file-upload-area" @click="triggerTitleImageInput(index)" @dragover.prevent @drop.prevent="(e) => handleTitleImageDrop(e, index)">
                    <input
                        type="file"
                        :ref="el => setImageInputRef(el, index, 'title')"
                        @change="(e) => handleTitleImageUpload(e, index)"
                        accept="image/*"
                        style="display: none"
                    />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh tiêu đề hoặc <span>click để chọn file</span></p>
                  </div>

                  <div v-if="item.imageTitle" class="upload-preview">
                    <img :src="getImageUrl(item.imageTitle)" alt="Title Image Preview" />
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewTitleImage(index)" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="removeTitleImage(index)" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-group" v-if="!item.imageTitle">
                  <label>Hoặc nhập tên file</label>
                  <input
                      type="text"
                      v-model="item.imageTitle"
                      :placeholder="'gia-tri-' + (index + 1) + '.png'"
                  />
                </div>
              </div>

              <!-- Hình ảnh nội dung -->
              <div class="form-group">
                <label>Hình ảnh nội dung</label>
                <div class="file-upload compact">
                  <div class="file-upload-area" @click="triggerContentImageInput(index)" @dragover.prevent @drop.prevent="(e) => handleContentImageDrop(e, index)">
                    <input
                        type="file"
                        :ref="el => setImageInputRef(el, index, 'content')"
                        @change="(e) => handleContentImageUpload(e, index)"
                        accept="image/*"
                        style="display: none"
                    />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh nội dung hoặc <span>click để chọn file</span></p>
                  </div>

                  <div v-if="item.imageContent" class="upload-preview">
                    <img :src="getImageUrl(item.imageContent)" alt="Content Image Preview" />
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewContentImage(index)" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="removeContentImage(index)" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-group" v-if="!item.imageContent">
                  <label>Hoặc nhập tên file</label>
                  <input
                      type="text"
                      v-model="item.imageContent"
                      :placeholder="'anh-gia-tri-' + (index + 1) + '.png'"
                  />
                </div>
              </div>

              <!-- Animation class -->
              <div class="form-group">
                <label for="animationClass">Hiệu ứng hiển thị</label>
                <select id="animationClass" v-model="item.animationClass">
                  <option value="fade-left">Fade In Left</option>
                  <option value="fade-right">Fade In Right</option>
                  <option value="fade-up">Fade In Up</option>
                  <option value="fade-down">Fade In Down</option>
                  <option value="zoom-in">Zoom In</option>
                  <option value="none">Không có hiệu ứng</option>
                </select>
              </div>

              <!-- Trạng thái hiển thị -->
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="item.isActive" />
                  <span class="checkmark"></span>
                  Hiển thị yếu tố này
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Kiểu dáng & Giao diện -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Section Styles -->
          <div class="setting-section">
            <h3><i class="fas fa-object-group"></i> Section Styles</h3>

            <div class="form-group">
              <label for="sectionMaxWidth">Chiều rộng tối đa</label>
              <div class="input-with-unit">
                <input type="text" id="sectionMaxWidth" v-model="content.styles.section.maxWidth" placeholder="1400px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="sectionPadding">Padding</label>
              <input
                  type="text"
                  id="sectionPadding"
                  v-model="content.styles.section.padding"
                  placeholder="60px 20px"
              />
            </div>

            <div class="color-input-group">
              <label>Màu nền section</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.section.backgroundColor" />
                <input type="text" v-model="content.styles.section.backgroundColor" placeholder="#ffffff" />
              </div>
            </div>
          </div>

          <!-- Title Styles -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Title Styles</h3>

            <div class="form-group">
              <label for="titleFontSize">Kích thước chữ</label>
              <div class="input-with-unit">
                <input type="text" id="titleFontSize" v-model="content.styles.title.fontSize" placeholder="40px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.title.color" />
                <input type="text" v-model="content.styles.title.color" placeholder="#1a365d" />
              </div>
            </div>

            <div class="form-group">
              <label for="titleMarginBottom">Margin bottom</label>
              <div class="input-with-unit">
                <input type="text" id="titleMarginBottom" v-model="content.styles.title.marginBottom" placeholder="50px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Item Styles -->
          <div class="setting-section">
            <h3><i class="fas fa-square"></i> Item Styles</h3>

            <div class="form-group">
              <label for="itemBorderRadius">Bo góc</label>
              <div class="input-with-unit">
                <input type="text" id="itemBorderRadius" v-model="content.styles.item.borderRadius" placeholder="12px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="itemBoxShadow">Box shadow</label>
              <input
                  type="text"
                  id="itemBoxShadow"
                  v-model="content.styles.item.boxShadow"
                  placeholder="0 4px 15px rgba(0, 0, 0, 0.08)"
              />
            </div>

            <div class="form-group">
              <label for="itemHoverShadow">Hover shadow</label>
              <input
                  type="text"
                  id="itemHoverShadow"
                  v-model="content.styles.item.hoverShadow"
                  placeholder="0 8px 25px rgba(0, 0, 0, 0.12)"
              />
            </div>
          </div>

          <!-- Content Styles -->
          <div class="setting-section">
            <h3><i class="fas fa-align-left"></i> Content Styles</h3>

            <div class="form-group">
              <label for="contentPadding">Padding</label>
              <input
                  type="text"
                  id="contentPadding"
                  v-model="content.styles.content.padding"
                  placeholder="30px"
              />
            </div>

            <div class="form-group">
              <label for="contentGap">Gap</label>
              <div class="input-with-unit">
                <input type="text" id="contentGap" v-model="content.styles.content.gap" placeholder="30px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="contentTitleFontSize">Kích thước chữ tiêu đề</label>
              <div class="input-with-unit">
                <input type="text" id="contentTitleFontSize" v-model="content.styles.contentTitle.fontSize" placeholder="33px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ tiêu đề</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.contentTitle.color" />
                <input type="text" v-model="content.styles.contentTitle.color" placeholder="#2d3748" />
              </div>
            </div>

            <div class="form-group">
              <label for="contentDescriptionFontSize">Kích thước chữ mô tả</label>
              <div class="input-with-unit">
                <input type="text" id="contentDescriptionFontSize" v-model="content.styles.contentDescription.fontSize" placeholder="20px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ mô tả</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.contentDescription.color" />
                <input type="text" v-model="content.styles.contentDescription.color" placeholder="#4a5568" />
              </div>
            </div>

            <div class="form-group">
              <label for="contentDescriptionLineHeight">Line height mô tả</label>
              <input
                  type="text"
                  id="contentDescriptionLineHeight"
                  v-model="content.styles.contentDescription.lineHeight"
                  placeholder="1.6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="closePreviewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xem trước ảnh</h3>
          <button class="btn-icon btn-close-modal" @click="closePreviewModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="previewImageUrl" alt="Xem trước" v-if="previewImageUrl" />
            <div v-else class="preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Chưa có ảnh để xem trước</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closePreviewModal">Đóng</button>
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
import { ref, reactive, onMounted } from 'vue'
import api from '../../../../api/api.js'
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue"

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Content structure based on JSON data
const content = reactive({
  sectionTitle: 'GIÁ TRỊ BẤT ĐỘNG SẢN ĐƯỢC DỰA TRÊN',
  sortOrder: 2,
  items: [
    {
      id: 1,
      title: 'Vị trí và đặc điểm',
      description: 'Vị trí và đặc điểm là yếu tố then chốt ảnh hưởng trực tiếp đến giá trị của bất động sản...',
      imageTitle: 'gia-tri-1.png',
      imageContent: 'anh-gia-tri-1.png',
      animationClass: 'fade-left',
      isActive: true
    },
    {
      id: 2,
      title: 'Giá trị tham chiếu',
      description: 'Giá trị tham chiếu được xác định dựa trên các bất động sản tương tự trong cùng khu vực...',
      imageTitle: 'gia-tri-2.png',
      imageContent: 'anh-gia-tri-2.png',
      animationClass: 'fade-right',
      isActive: false
    }
  ],
  styles: {
    section: {
      maxWidth: '1400px',
      padding: '60px 20px',
      backgroundColor: '#ffffff'
    },
    title: {
      fontSize: '40px',
      color: '#1a365d',
      marginBottom: '50px'
    },
    item: {
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      hoverShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
    },
    content: {
      padding: '30px',
      gap: '30px'
    },
    contentTitle: {
      fontSize: '33px',
      color: '#2d3748'
    },
    contentDescription: {
      fontSize: '20px',
      color: '#4a5568',
      lineHeight: '1.6'
    }
  }
})

// UI State
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// Files management
const files = ref([])
const uploadedFiles = ref([])

// Refs for file inputs
const imageInputs = ref({})

// ========== CONSTANTS ==========
import { baseImgaeUrl } from "../../../../assets/js/global.js";
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 30

// ========== HELPER FUNCTIONS ==========
const getImageUrl = (filename) => {
  if (!filename) return ''

  if (filename.startsWith(TEMP_PREFIX)) {
    const tempName = filename.replace(TEMP_PREFIX, '')
    const uploadedFile = uploadedFiles.value.find(f => f.tempName === tempName)
    if (uploadedFile && uploadedFile.previewUrl) {
      return uploadedFile.previewUrl
    }
    return ''
  }

  // Check if it's already a full URL
  if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('data:')) {
    return filename
  }

  return BASE_IMAGE_URL + filename
}

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

const generateTempName = (originalFilename, prefix = '') => {
  if (!originalFilename) return `${prefix}temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.jpg`;

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalFilename.split('.').pop() || 'jpg';
  return `${prefix}temp_${timestamp}_${random}.${extension}`;
}

// ========== FIXED: Tạo file DTO riêng biệt cho từng ảnh ==========
const handleFileUpload = (file, itemIndex, imageType) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const maxSize = 5 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP, SVG', 'error')
    return false
  }

  if (file.size > maxSize) {
    showToast('Kích thước file không được vượt quá 5MB', 'error')
    return false
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result

    // Tạo temp name với prefix để phân biệt giữa các loại ảnh
    const prefix = `${imageType}_item${itemIndex}_`
    const tempName = generateTempName(file.name, prefix)
    const tempUrl = TEMP_PREFIX + tempName

    // Update item's image property
    if (imageType === 'title') {
      content.items[itemIndex].imageTitle = tempUrl
    } else if (imageType === 'content') {
      content.items[itemIndex].imageContent = tempUrl
    }

    // Tạo một bản sao của File object để tránh tham chiếu chung
    const fileCopy = new File([file], file.name, {
      type: file.type,
      lastModified: file.lastModified
    })

    // SỬA LỖI: Sử dụng filename đơn giản như QS1DinhGiaSoBo.vue
    const fileDTO = {
      id: null,
      filename: `${imageType}_${file.name}`, // Sửa thành đơn giản
      status: 'NEW',
      tempName: tempName,
      mappingTempUrl: tempUrl,
      mappingRealUrl: null,
      effectiveTempUrl: previewUrl,
      realFilenameForSearch: file.name
    }

    // Store in uploadedFiles với thông tin đầy đủ
    uploadedFiles.value.push({
      tempName: tempName,
      file: fileCopy,
      previewUrl: previewUrl,
      itemIndex: itemIndex,
      imageType: imageType,
      fileDTO: fileDTO
    })

    // Add to files array
    files.value.push(fileDTO)

    showToast(`Ảnh ${imageType === 'title' ? 'tiêu đề' : 'nội dung'} đã được tải lên thành công`, 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  return true
}

// ========== ITEM MANAGEMENT ==========
const addNewItem = () => {
  const newId = Math.max(...content.items.map(item => item.id || 0), 0) + 1
  content.items.push({
    id: newId,
    title: `Yếu tố mới ${newId}`,
    description: 'Mô tả yếu tố mới...',
    imageTitle: '',
    imageContent: '',
    animationClass: 'fade-left',
    isActive: true
  })
  showToast('Đã thêm yếu tố mới', 'success')
}

const removeItem = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa yếu tố này?')) {
    const item = content.items[index]

    // Mark associated files for removal
    if (item.imageTitle) {
      handleRemoveFile(item.imageTitle, 'title', index)
    }
    if (item.imageContent) {
      handleRemoveFile(item.imageContent, 'content', index)
    }

    content.items.splice(index, 1)
    showToast('Đã xóa yếu tố', 'success')
  }
}

const moveItemUp = (index) => {
  if (index > 0) {
    const item = content.items[index]
    content.items.splice(index, 1)
    content.items.splice(index - 1, 0, item)
  }
}

const moveItemDown = (index) => {
  if (index < content.items.length - 1) {
    const item = content.items[index]
    content.items.splice(index, 1)
    content.items.splice(index + 1, 0, item)
  }
}

const toggleItemActive = (index) => {
  content.items[index].isActive = !content.items[index].isActive
  showToast(`Đã ${content.items[index].isActive ? 'bật' : 'tắt'} hiển thị yếu tố`, 'success')
}

// ========== IMAGE INPUT REFS MANAGEMENT ==========
const setImageInputRef = (el, index, type) => {
  if (el) {
    const key = `${type}_${index}`
    imageInputs.value[key] = el
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
// Title Image handlers
const triggerTitleImageInput = (index) => {
  const key = `title_${index}`
  if (imageInputs.value[key]) {
    imageInputs.value[key].click()
  }
}

const handleTitleImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, index, 'title')
  }
  event.target.value = ''
}

const handleTitleImageDrop = (event, index) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, index, 'title')
  }
}

const removeTitleImage = (index) => {
  if (content.items[index].imageTitle) {
    handleRemoveFile(content.items[index].imageTitle, 'title', index)
  }
}

// Content Image handlers
const triggerContentImageInput = (index) => {
  const key = `content_${index}`
  if (imageInputs.value[key]) {
    imageInputs.value[key].click()
  }
}

const handleContentImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, index, 'content')
  }
  event.target.value = ''
}

const handleContentImageDrop = (event, index) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, index, 'content')
  }
}

const removeContentImage = (index) => {
  if (content.items[index].imageContent) {
    handleRemoveFile(content.items[index].imageContent, 'content', index)
  }
}

const handleRemoveFile = (imageUrl, imageType, itemIndex) => {
  if (imageUrl) {
    if (imageUrl.startsWith(TEMP_PREFIX)) {
      const tempName = imageUrl.replace(TEMP_PREFIX, '')

      // Tìm và xóa file từ files array
      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        const fileToRemove = files.value[fileIndex]
        fileToRemove.status = 'REMOVE'
      }

      // Tìm và xóa từ uploadedFiles
      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else {
      // Đối với file đã tồn tại
      const fileIndex = files.value.findIndex(f =>
          f.mappingRealUrl === imageUrl || f.filename === imageUrl
      )
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    // Update item's image property
    if (imageType === 'title') {
      content.items[itemIndex].imageTitle = ''
    } else if (imageType === 'content') {
      content.items[itemIndex].imageContent = ''
    }

    showToast('Đã xóa ảnh', 'success')
  }
}

// ========== PREVIEW FUNCTIONS ==========
const previewTitleImage = (index) => {
  if (content.items[index].imageTitle) {
    previewImageUrl.value = getImageUrl(content.items[index].imageTitle)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh tiêu đề để xem trước', 'warning')
  }
}

const previewContentImage = (index) => {
  if (content.items[index].imageContent) {
    previewImageUrl.value = getImageUrl(content.items[index].imageContent)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh nội dung để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get(`/cms/getSection/${SECTION_ID}`)

    if (response.data && response.data.contentJson) {
      const data = typeof response.data.contentJson === 'string'
          ? JSON.parse(response.data.contentJson)
          : response.data.contentJson

      // Update content with loaded data
      Object.assign(content, data)

      // Handle files from API response
      if (response.data.files && response.data.files.length > 0) {
        files.value = response.data.files.map(file => ({
          id: file.id,
          filename: file.filename || file.realFilenameForSearch || '',
          status: 'EXISTING',
          tempName: file.tempName || generateTempName(file.filename, 'loaded_'),
          mappingTempUrl: file.mappingTempUrl || `temp/${file.tempName || generateTempName(file.filename, 'loaded_')}`,
          mappingRealUrl: file.mappingRealUrl || file.filename,
          effectiveTempUrl: file.effectiveTempUrl || BASE_IMAGE_URL + (file.mappingRealUrl || file.filename),
          realFilenameForSearch: file.realFilenameForSearch || file.filename
        }))
      } else {
        files.value = []
      }

      uploadedFiles.value = []
      showToast('Dữ liệu đã được tải thành công', 'success')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu từ server', 'error')
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare content data
    const contentData = {
      sectionTitle: content.sectionTitle,
      items: content.items,
      styles: content.styles
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Yếu tố ảnh hưởng',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: content.sortOrder,
      files: filesToSend
    }

    // Add section data
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }))

    // Add actual file binaries for NEW files
    const newFiles = filesToSend.filter(file => file.status === 'NEW')

    newFiles.forEach((fileDTO, index) => {
      const tempName = fileDTO.tempName
      const uploadedFile = uploadedFiles.value.find(f => f.tempName === tempName)

      if (uploadedFile && uploadedFile.file) {
        // Sử dụng file copy đã được tạo
        formData.append('files', uploadedFile.file, fileDTO.filename) // Thêm filename thứ 3
      }
    })

    // Send to API
    const response = await api.post('/cms/saveChange', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data) {
      showToast('Thay đổi đã được lưu thành công', 'success')

      // Update file statuses
      files.value.forEach(file => {
        if (file.status === 'NEW') {
          file.status = 'EXISTING'
          if (response.data.files) {
            const savedFile = response.data.files.find(f =>
                f.filename === file.filename ||
                f.realFilenameForSearch === file.realFilenameForSearch
            )
            if (savedFile) {
              file.id = savedFile.id
              file.mappingRealUrl = savedFile.mappingRealUrl

              // Update content image URLs from temp to real
              updateContentUrls(file)
            }
          }
        } else if (file.status === 'REMOVE') {
          const index = files.value.findIndex(f => f.id === file.id)
          if (index !== -1) {
            files.value.splice(index, 1)
          }
        }
      })

      // Clear uploaded files
      uploadedFiles.value = []

      // Reload data
      await loadData()
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Lỗi khi lưu thay đổi: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    isLoading.value = false
  }
}

const updateContentUrls = (file) => {
  const tempUrl = TEMP_PREFIX + file.tempName
  const realUrl = file.mappingRealUrl

  // Update all items' image URLs
  content.items.forEach(item => {
    if (item.imageTitle === tempUrl) {
      item.imageTitle = realUrl
    }
    if (item.imageContent === tempUrl) {
      item.imageContent = realUrl
    }
  })
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* All existing styles remain the same, adding new styles for items */

.items-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.item-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

.item-title {
  flex: 1;
}

.item-title h4 {
  margin: 0;
  color: #031358;
  font-size: 1.1rem;
  font-weight: 600;
}

.item-id {
  font-size: 0.8rem;
  color: #6c757d;
  background: white;
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  margin-left: 10px;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.item-content {
  padding: 20px;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* Additional styles for the items tab */
.items-settings .form-group {
  margin-bottom: 15px;
}

.items-settings .file-upload-area {
  padding: 15px;
}

.items-settings .upload-preview img {
  height: 120px;
}

/* Enhanced file upload area */
.file-upload-area span {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload-area span:hover {
  color: #0827af;
  text-decoration: none;
}

.file-upload-area p {
  margin: 0;
  color: #495057;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .item-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .item-actions {
    justify-content: flex-start;
  }
}
.pricing-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Header */
.editor-header {
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.editor-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(to right, #fff, #e3e8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-controls {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* Navigation Tabs */
.navigation-tabs {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #e9ecef;
  padding: 0 30px;
  gap: 2px;
}

.tab-button {
  padding: 15px 25px;
  border: none;
  background: none;
  font-size: 1rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab-button:hover {
  color: #031358;
  background-color: #f8f9fa;
}

.tab-button.active {
  color: #4a6cf7;
  border-bottom-color: #4a6cf7;
  background-color: #f8f9ff;
}

/* Tab Content */
.tab-content {
  padding: 30px;
  background-color: white;
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
}

.settings-grid > .setting-section:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .settings-grid > .setting-section:last-child:nth-child(odd) {
    max-width: 100%;
  }
}

@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-grid > .setting-section:last-child:nth-child(odd) {
    grid-column: 1 / 2;
    max-width: 100%;
  }
}

.setting-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
}


.setting-section h3 {
  margin: 0 0 20px 0;
  color: #031358;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Color Input */
.color-input-group {
  margin-bottom: 15px;
}

.color-input-group label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 8px;
}

.color-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-input input[type="color"] {
  width: 50px;
  height: 40px;
  padding: 0;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.color-input input[type="text"] {
  flex: 1;
}

/* Input with Unit */
.input-with-unit {
  position: relative;
}

.input-with-unit input {
  padding-right: 50px;
  width: 100%;
}

.input-with-unit .unit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.85rem;
  pointer-events: none;
}

/* Position Controls */
.position-controls {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
}

.position-row {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.position-input {
  flex: 1;
}

.position-input.full-width {
  flex: 2;
}

.position-input label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.85rem;
  color: #6c757d;
}

.position-input input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* File Upload */
.file-upload {
  margin-bottom: 20px;
}

.file-upload.compact {
  margin-top: 10px;
}

.file-upload-area {
  border: 2px dashed #ced4da;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  margin-bottom: 15px;
}

.file-upload-area:hover {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
}

.file-upload-area i {
  font-size: 2rem;
  color: #6c757d;
  margin-bottom: 10px;
  display: block;
}

.file-upload-area p {
  margin: 0;
  color: #495057;
  font-size: 0.9rem;
}

.file-upload-area span {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
}

.file-hint {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 5px;
}

.upload-preview {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  margin-top: 10px;
}

.upload-preview img {
  width: 100%;
  height: 150px;
  object-fit: contain;
  background-color: #f8f9fa;
}

.preview-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-preview:hover .preview-actions {
  opacity: 1;
}

.btn-preview-action {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.btn-preview-action:hover {
  background-color: white;
  transform: scale(1.1);
  color: #4a6cf7;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #e9ecef;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-label input:checked + .checkmark {
  background-color: #4a6cf7;
  border-color: #4a6cf7;
}

.checkbox-label input:checked + .checkmark:after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 108, 247, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #868e96 100%);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6268 0%, #727b84 100%);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: #f8f9fa;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #495057;
}

.btn-icon:hover:not(:disabled) {
  background-color: #dc3545;
  color: white;
  transform: scale(1.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px 25px;
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.4rem;
}

.btn-close-modal {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  width: 36px;
  height: 36px;
}

.btn-close-modal:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.modal-body {
  padding: 25px;
  overflow: auto;
  flex: 1;
}

.image-preview-container {
  width: 100%;
  min-height: 400px;
  border: 2px dashed #dee2e6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f8f9fa;
  margin-bottom: 20px;
}

.image-preview-container img {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.preview-placeholder {
  text-align: center;
  color: #6c757d;
}

.preview-placeholder i {
  font-size: 4rem;
  margin-bottom: 15px;
  display: block;
  color: #adb5bd;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
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

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

/* Responsive Design */
@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .header-controls {
    flex-direction: column;
    gap: 10px;
  }

  .tab-content {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .navigation-tabs {
    padding: 0 20px;
    flex-direction: column;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.9rem;
    justify-content: center;
  }

  .position-row {
    flex-direction: column;
    gap: 10px;
  }

  .position-input.full-width {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .editor-header h2 {
    font-size: 1.5rem;
    text-align: center;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .tab-button {
    padding: 10px 15px;
    font-size: 0.85rem;
  }

  .color-input {
    flex-wrap: wrap;
  }

  .color-input input[type="color"] {
    width: 40px;
    height: 35px;
  }

  .color-input input[type="text"] {
    min-width: 100px;
  }
}
</style>