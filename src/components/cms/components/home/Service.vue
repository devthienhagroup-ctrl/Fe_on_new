<template>
  <div class="services-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Dịch vụ Nổi bật</h2>
      <div class="header-controls">
        <button class="btn btn-primary" @click="addNewService">
          <i class="fas fa-plus"></i> Thêm Dịch vụ Mới
        </button>
        <button class="btn btn-success" @click="saveChanges" :disabled="isLoading">
          <i class="fas fa-save"></i> {{ isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
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
        <i class="fas fa-cog"></i> Cài đặt chung
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'services' }"
          @click="activeTab = 'services'"
      >
        <i class="fas fa-list"></i> Danh sách dịch vụ ({{ services.length }})
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab cài đặt chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Tiêu đề & Nút -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề & Nút</h3>
            <div class="form-group">
              <label for="section-title">Tiêu đề chính</label>
              <input
                  type="text"
                  id="section-title"
                  v-model="settings.title"
                  placeholder="DỊCH VỤ NỔI BẬT"
              />
            </div>
            <div class="form-group">
              <label for="button-text">Văn bản nút</label>
              <input
                  type="text"
                  id="button-text"
                  v-model="settings.buttonText"
                  placeholder="Tìm hiểu thêm"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="button-icon">Biểu tượng nút</label>
                <IconPicker v-model="settings.buttonIcon"/>
              </div>
              <div class="form-group">
                <label for="menu-arrow">Biểu tượng menu</label>
                <IconPicker v-model="settings.menuArrowIcon"/>
              </div>
            </div>
          </div>

          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>
            <div class="color-grid">
              <div class="color-input-group">
                <label>Màu chính</label>
                <div class="color-input form-group">
                  <input type="color" v-model="settings.colors.primary" />
                  <input type="text" v-model="settings.colors.primary" placeholder="#031358" />
                </div>
              </div>
              <div class="color-input-group">
                <label>Màu phụ</label>
                <div class="color-input form-group">
                  <input type="color" v-model="settings.colors.secondary" />
                  <input type="text" v-model="settings.colors.secondary" placeholder="#3a53b9" />
                </div>
              </div>
              <div class="color-input-group">
                <label>Màu sáng</label>
                <div class="color-input form-group">
                  <input type="color" v-model="settings.colors.light" />
                  <input type="text" v-model="settings.colors.light" placeholder="#ffffff" />
                </div>
              </div>
              <div class="color-input-group">
                <label>Màu tối</label>
                <div class="color-input form-group">
                  <input type="color" v-model="settings.colors.dark" />
                  <input type="text" v-model="settings.colors.dark" placeholder="#031358" />
                </div>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Typography</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="title-size">Kích thước tiêu đề</label>
                <div class="input-with-unit">
                  <input type="text" id="title-size" v-model="settings.typography.title.size" placeholder="33px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="service-title-size">Kích thước dịch vụ</label>
                <div class="input-with-unit">
                  <input type="text" id="service-title-size" v-model="settings.typography.serviceTitle.size" placeholder="28px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="content-size">Kích thước nội dung</label>
                <div class="input-with-unit">
                  <input type="text" id="content-size" v-model="settings.typography.content.size" placeholder="16px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="mobile-content-size">Mobile nội dung</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-content-size" v-model="settings.typography.content.mobileSize" placeholder="14px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Layout & Spacing -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Layout & Spacing</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="column-ratio">Tỷ lệ cột</label>
                <input type="text" id="column-ratio" v-model="settings.layout.columnRatio" placeholder="2fr 1fr" />
              </div>
              <div class="form-group">
                <label for="menu-gap">Khoảng cách menu</label>
                <div class="input-with-unit">
                  <input type="text" id="menu-gap" v-model="settings.layout.menuGap" placeholder="12px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="title-bottom">Dưới tiêu đề</label>
                <div class="input-with-unit">
                  <input type="text" id="title-bottom" v-model="settings.spacing.titleBottom" placeholder="60px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="mobile-title-bottom">Mobile dưới tiêu đề</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-title-bottom" v-model="settings.spacing.mobileTitleBottom" placeholder="40px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Decorations -->
          <div class="setting-section">
            <h3><i class="fas fa-magic"></i> Hiệu ứng</h3>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="settings.decorations.rotatingCircle.enabled" />
                <span class="checkmark"></span>
                Hiển thị vòng xoay
              </label>
            </div>

            <div v-if="settings.decorations.rotatingCircle.enabled" class="circle-image-upload">
              <div class="form-group">
                <label><i class="fas fa-image"></i> Hình vòng xoay</label>
                <div class="file-upload compact">
                  <div class="file-upload-area" @click="triggerCircleImageInput" @dragover.prevent @drop.prevent="handleCircleImageDrop">
                    <input
                        type="file"
                        ref="circleImageInput"
                        @change="handleCircleImageUpload"
                        accept="image/*"
                        style="display: none"
                    />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                  </div>

                  <div v-if="circleImagePreview || settings.decorations.rotatingCircle.image" class="upload-preview">
                    <img :src="getImageUrl(settings.decorations.rotatingCircle.image)" alt="Preview" />
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewCircleImage" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="removeCircleImage" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="input-hint" v-if="!circleImagePreview && !settings.decorations.rotatingCircle.image">
                  <input
                      type="text"
                      v-model="settings.decorations.rotatingCircle.image"
                      placeholder="/imgs/Circle.svg"
                      class="image-url-input"
                  />
                  <p class="hint-text">Nhập URL hoặc tải ảnh lên từ máy tính</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab danh sách dịch vụ -->
      <div v-if="activeTab === 'services'" class="services-management">
        <div class="services-container">
          <!-- Danh sách dịch vụ -->
          <div class="services-list">
            <div
                v-for="(service, index) in services"
                :key="service.id"
                class="service-item"
                :class="{ active: activeServiceIndex === index }"
                @mouseenter="hoveredServiceIndex = index"
                @mouseleave="hoveredServiceIndex = -1"
                @click="selectService(index)"
            >
              <div class="service-content">
                <div class="service-icon" v-if="service.icon">
                  <i :class="service.icon"></i>
                </div>
                <div class="service-info">
                  <h4>{{ service.title || 'Dịch vụ chưa có tên' }}</h4>
                  <p class="service-index">Dịch vụ {{ index + 1 }}</p>
                </div>
              </div>
              <div class="service-actions" v-show="hoveredServiceIndex === index">
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeService(index)"
                    :disabled="services.length <= 1"
                    title="Xóa dịch vụ"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Form chỉnh sửa dịch vụ -->
          <div v-if="activeService !== null" class="service-editor">
            <div class="editor-header">
              <h3>Chỉnh sửa dịch vụ {{ activeServiceIndex + 1 }}</h3>
              <div class="editor-actions">
                <button class="btn btn-secondary" @click="duplicateService">
                  <i class="fas fa-copy"></i> Nhân bản
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveServiceUp(activeServiceIndex)"
                    :disabled="activeServiceIndex === 0"
                    title="Di chuyển lên"
                >
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveServiceDown(activeServiceIndex)"
                    :disabled="activeServiceIndex === services.length - 1"
                    title="Di chuyển xuống"
                >
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="service-title">
                <i class="fas fa-heading"></i> Tiêu đề dịch vụ
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="service-title"
                  v-model="activeService.title"
                  placeholder="Nhập tiêu đề dịch vụ..."
              />
            </div>

            <div class="form-group">
              <label for="service-content">
                <i class="fas fa-align-left"></i> Nội dung mô tả
                <span class="required-mark">*</span>
              </label>
              <textarea
                  id="service-content"
                  v-model="activeService.content"
                  rows="4"
                  placeholder="Nhập mô tả chi tiết về dịch vụ..."
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="service-icon">
                  <i class="fas fa-icons"></i> Biểu tượng
                </label>
                <IconPicker v-model="activeService.icon" title="Chọn biểu tượng cho dịch vụ" />
              </div>
<!--              <div class="form-group">-->
<!--                <label for="service-image">-->
<!--                  <i class="fas fa-image"></i> Hình ảnh (URL)-->
<!--                </label>-->
<!--                <input-->
<!--                    type="text"-->
<!--                    id="service-image"-->
<!--                    v-model="activeService.image"-->
<!--                    placeholder="/imgs/service-image.jpg"-->
<!--                />-->
<!--              </div>-->
            </div>

            <div class="file-upload-section">
              <label><i class="fas fa-upload"></i> Tải lên hình ảnh mới</label>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                  <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none" />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                </div>
                <div v-if="activeService.image || uploadedImagePreview" class="upload-preview">
                  <img :src="getImageUrl(activeService.image)" alt="Preview" />
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeUploadedImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              <p class="input-hint">Tải ảnh lên từ máy tính của bạn</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem trước ảnh dịch vụ -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="closePreviewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xem trước ảnh dịch vụ</h3>
          <button class="btn-icon btn-close-modal" @click="closePreviewModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="getImageUrl(activeService?.image)" alt="Xem trước ảnh" />
            <div v-if="!activeService?.image" class="preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Chưa có ảnh để xem trước</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closePreviewModal">Đóng</button>
            <button class="btn btn-primary" @click="triggerFileInput">Thay đổi ảnh</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem trước ảnh vòng xoay -->
    <div v-if="showCircleImageModal" class="modal-overlay" @click="closeCircleImageModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xem trước ảnh vòng xoay</h3>
          <button class="btn-icon btn-close-modal" @click="closeCircleImageModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="getImageUrl(settings.decorations.rotatingCircle.image)" alt="Xem trước ảnh vòng xoay" />
            <div v-if="!settings.decorations.rotatingCircle.image" class="preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Chưa có ảnh để xem trước</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closeCircleImageModal">Đóng</button>
            <button class="btn btn-primary" @click="triggerCircleImageInput">Thay đổi ảnh</button>
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const services = ref([])
const activeServiceIndex = ref(0)
const activeService = computed(() =>
    activeServiceIndex.value !== null && services.value.length > 0
        ? services.value[activeServiceIndex.value]
        : null
)

const activeTab = ref('general')
const hoveredServiceIndex = ref(-1)

// Settings object with structure from JSON
const settings = reactive({
  title: "DỊCH VỤ NỔI BẬT",
  buttonText: "Tìm hiểu thêm",
  buttonIcon: "fas fa-arrow-right",
  menuArrowIcon: "fas fa-chevron-right",
  mobileExpandIcon: "fa-chevron-up",
  mobileCollapseIcon: "fa-chevron-down",
  layout: {
    columnRatio: "2fr 1fr",
    menuGap: "12px"
  },
  colors: {
    primary: "#031358",
    secondary: "#3a53b9",
    light: "#ffffff",
    dark: "#031358",
    text: {
      title: "#031358",
      normal: "#333333",
      light: "#ffffff"
    },
    background: {
      overlayLight: "rgba(255, 255, 255, 0)",
      overlayDark: "rgba(0, 0, 0, 0)",
      buttonLight: "rgba(255, 255, 255, 0.2)",
      buttonDark: "rgba(3, 19, 88, 0.9)"
    }
  },
  typography: {
    title: {
      size: "33px",
      weight: "bolder",
      family: "'Ubuntu', sans-serif"
    },
    serviceTitle: {
      size: "28px",
      weight: "700"
    },
    content: {
      size: "16px",
      mobileSize: "14px",
      lineHeight: "1.6"
    },
    button: {
      size: "14px",
      weight: "600"
    }
  },
  spacing: {
    titleBottom: "60px",
    columnGap: "40px",
    overlayPadding: "40px",
    buttonPadding: "12px 24px",
    menuPadding: "20px 25px",
    mobileTitleBottom: "40px",
    collapseItemMargin: "10px"
  },
  decorations: {
    rotatingCircle: {
      enabled: true,
      image: "/imgs/Circle.svg"
    }
  }
})

// UI State
const isLoading = ref(false)
const uploadedImagePreview = ref(null)
const circleImagePreview = ref(null)
const showPreviewModal = ref(false)
const showCircleImageModal = ref(false)

// File management
const files = ref([])
const fileInput = ref(null)
const circleImageInput = ref(null)
const uploadedFiles = ref([])

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// ========== CONSTANTS ==========
import { baseImgaeUrl } from "../../../../assets/js/global.js";
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'

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

const generateTempName = (originalFilename) => {
  if (!originalFilename) return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.jpg`;

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalFilename.split('.').pop() || 'jpg';
  return `temp_${timestamp}_${random}.${extension}`;
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/4')

    if (response.data && response.data.contentJson) {
      const content = JSON.parse(response.data.contentJson)

      // Load settings
      if (content.title) settings.title = content.title
      if (content.buttonText) settings.buttonText = content.buttonText
      if (content.buttonIcon) settings.buttonIcon = content.buttonIcon
      if (content.menuArrowIcon) settings.menuArrowIcon = content.menuArrowIcon
      if (content.mobileExpandIcon) settings.mobileExpandIcon = content.mobileExpandIcon
      if (content.mobileCollapseIcon) settings.mobileCollapseIcon = content.mobileCollapseIcon
      if (content.layout) Object.assign(settings.layout, content.layout)
      if (content.colors) Object.assign(settings.colors, content.colors)
      if (content.typography) Object.assign(settings.typography, content.typography)
      if (content.spacing) Object.assign(settings.spacing, content.spacing)
      if (content.decorations) Object.assign(settings.decorations, content.decorations)

      // Load services
      if (content.services && Array.isArray(content.services)) {
        services.value = content.services.map((service, index) => ({
          id: service.id || `service-${Date.now()}-${index}`,
          title: service.title || '',
          content: service.content || '',
          image: service.image || '',
          icon: service.icon || ''
        }))
      } else {
        services.value = []
      }

      // Handle files from API response
      if (response.data.files && response.data.files.length > 0) {
        files.value = response.data.files.map(file => ({
          id: file.id,
          filename: file.filename || file.realFilenameForSearch || '',
          status: 'EXISTING',
          tempName: file.tempName || generateTempName(file.filename),
          mappingTempUrl: file.mappingTempUrl || `temp/${file.tempName || generateTempName(file.filename)}`,
          mappingRealUrl: file.mappingRealUrl || file.filename,
          effectiveTempUrl: file.effectiveTempUrl || BASE_IMAGE_URL + (file.mappingRealUrl || file.filename),
          realFilenameForSearch: file.realFilenameForSearch || file.filename
        }))
      } else {
        files.value = []

        services.value.forEach(service => {
          if (service.image && !service.image.startsWith(TEMP_PREFIX)) {
            const filename = service.image
            const tempName = generateTempName(filename)

            files.value.push({
              id: null,
              filename: filename,
              status: 'EXISTING',
              tempName: tempName,
              mappingTempUrl: TEMP_PREFIX + tempName,
              mappingRealUrl: filename,
              effectiveTempUrl: BASE_IMAGE_URL + filename,
              realFilenameForSearch: filename
            })
          }
        })
      }

      uploadedFiles.value = []
      showToast('Dữ liệu đã được tải thành công', 'success')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu từ server', 'error')

    // Fallback to default services
    if (services.value.length === 0) {
      services.value = [createNewService()]
    }
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare content data
    const contentData = {
      ...settings,
      services: services.value.map(service => {
        let imageUrl = service.image
        if (imageUrl.startsWith(TEMP_PREFIX)) {
          imageUrl = imageUrl
        }

        return {
          id: service.id,
          title: service.title,
          content: service.content,
          image: imageUrl,
          icon: service.icon
        }
      })
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: 4,
      name: 'Dịch vụ nổi bật',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 0,
      files: filesToSend
    }

    // Add section data
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }))

    // Add actual file binaries for NEW files
    const newFiles = filesToSend.filter(file => file.status === 'NEW')

    newFiles.forEach((fileDTO, index) => {
      const tempName = fileDTO.mappingTempUrl?.replace(TEMP_PREFIX, '') || fileDTO.tempName
      const uploadedFile = uploadedFiles.value.find(f => f.tempName === tempName)

      if (uploadedFile && uploadedFile.file) {
        formData.append('files', uploadedFile.file)
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
            const savedFile = response.data.files.find(f => f.filename === file.filename)
            if (savedFile) {
              file.id = savedFile.id
              file.mappingRealUrl = savedFile.mappingRealUrl
              // Update service image URL from temp to real
              services.value.forEach(service => {
                if (service.image === TEMP_PREFIX + file.tempName) {
                  service.image = savedFile.filename
                }
              })
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
      uploadedImagePreview.value = null
      circleImagePreview.value = null

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

// ========== SERVICE MANAGEMENT ==========
const createNewService = () => ({
  id: `service-${Date.now()}-${Math.random()}`,
  title: '',
  content: '',
  image: '',
  icon: ''
})

const addNewService = () => {
  const newService = createNewService()
  services.value.push(newService)
  activeServiceIndex.value = services.value.length - 1
  activeTab.value = 'services'
  showToast('Đã thêm dịch vụ mới', 'success')
}

const selectService = (index) => {
  activeServiceIndex.value = index
  uploadedImagePreview.value = null
}

const moveServiceUp = (index) => {
  if (index > 0) {
    const temp = services.value[index]
    services.value[index] = services.value[index - 1]
    services.value[index - 1] = temp
    activeServiceIndex.value = index - 1
    showToast('Đã di chuyển dịch vụ lên', 'success')
  }
}

const moveServiceDown = (index) => {
  if (index < services.value.length - 1) {
    const temp = services.value[index]
    services.value[index] = services.value[index + 1]
    services.value[index + 1] = temp
    activeServiceIndex.value = index + 1
    showToast('Đã di chuyển dịch vụ xuống', 'success')
  }
}

const removeService = (index) => {
  if (services.value.length <= 1) {
    showToast('Không thể xóa dịch vụ cuối cùng', 'warning')
    return
  }

  const service = services.value[index]

  // Handle associated file
  if (service.image) {
    if (service.image.startsWith(TEMP_PREFIX)) {
      const tempName = service.image.replace(TEMP_PREFIX, '')
      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else {
      const fileIndex = files.value.findIndex(f => f.filename === service.image)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }
  }

  services.value.splice(index, 1)

  if (activeServiceIndex.value >= services.value.length) {
    activeServiceIndex.value = services.value.length - 1
  }

  showToast('Đã xóa dịch vụ', 'success')
}

const duplicateService = () => {
  if (!activeService.value) return

  const duplicate = {
    ...JSON.parse(JSON.stringify(activeService.value)),
    id: `service-${Date.now()}-${Math.random()}`
  }

  services.value.splice(activeServiceIndex.value + 1, 0, duplicate)
  activeServiceIndex.value += 1
  showToast('Đã nhân bản dịch vụ', 'success')
}

// ========== FILE UPLOAD MANAGEMENT ==========
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP', 'error')
    return
  }


  if (!activeService.value) {
    showToast('Vui lòng chọn một dịch vụ trước', 'warning')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Handle old image
    if (activeService.value.image) {
      const oldImageUrl = activeService.value.image

      if (oldImageUrl.startsWith(TEMP_PREFIX)) {
        const oldTempName = oldImageUrl.replace(TEMP_PREFIX, '')
        const fileIndex = files.value.findIndex(f => f.tempName === oldTempName)
        if (fileIndex !== -1) {
          files.value.splice(fileIndex, 1)
        }

        const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === oldTempName)
        if (uploadedIndex !== -1) {
          uploadedFiles.value.splice(uploadedIndex, 1)
        }
      } else {
        const fileIndex = files.value.findIndex(f => f.filename === oldImageUrl)
        if (fileIndex !== -1) {
          files.value[fileIndex].status = 'REMOVE'
        }
      }
    }

    // Update service
    activeService.value.image = tempUrl
    uploadedImagePreview.value = previewUrl

    // Create file DTO
    const fileDTO = {
      id: null,
      filename: file.name,
      status: 'NEW',
      tempName: tempName,
      mappingTempUrl: tempUrl,
      mappingRealUrl: null,
      effectiveTempUrl: previewUrl,
      realFilenameForSearch: file.name
    }

    // Store in uploadedFiles
    uploadedFiles.value.push({
      tempName: tempName,
      file: file,
      previewUrl: previewUrl
    })

    // Add to files array
    files.value.push(fileDTO)

    showToast('Ảnh đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleFileUpload(fakeEvent)
  }
}

const removeUploadedImage = () => {
  if (activeService.value && activeService.value.image) {
    const imageUrl = activeService.value.image

    if (imageUrl.startsWith(TEMP_PREFIX)) {
      const tempName = imageUrl.replace(TEMP_PREFIX, '')

      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else {
      const fileIndex = files.value.findIndex(f => f.filename === imageUrl)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    activeService.value.image = ''
    uploadedImagePreview.value = null

    showToast('Đã xóa ảnh', 'success')
  }
}

// ========== CIRCLE IMAGE UPLOAD MANAGEMENT ==========
const triggerCircleImageInput = () => {
  circleImageInput.value?.click()
}

const handleCircleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const maxSize = 5 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP, SVG', 'error')
    return
  }

  if (file.size > maxSize) {
    showToast('Kích thước file không được vượt quá 5MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Clear previous circle image if exists
    circleImagePreview.value = null

    // Update settings
    settings.decorations.rotatingCircle.image = tempUrl
    circleImagePreview.value = previewUrl

    // Create file DTO for circle image
    const fileDTO = {
      id: null,
      filename: `circle_${file.name}`,
      status: 'NEW',
      tempName: tempName,
      mappingTempUrl: tempUrl,
      mappingRealUrl: null,
      effectiveTempUrl: previewUrl,
      realFilenameForSearch: file.name
    }

    // Store in uploadedFiles
    uploadedFiles.value.push({
      tempName: tempName,
      file: file,
      previewUrl: previewUrl
    })

    // Add to files array
    files.value.push(fileDTO)

    showToast('Ảnh vòng xoay đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const handleCircleImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleCircleImageUpload(fakeEvent)
  }
}

const removeCircleImage = () => {
  const imageUrl = settings.decorations.rotatingCircle.image

  if (imageUrl) {
    if (imageUrl.startsWith(TEMP_PREFIX)) {
      const tempName = imageUrl.replace(TEMP_PREFIX, '')

      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else {
      const fileIndex = files.value.findIndex(f => f.filename === imageUrl)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    settings.decorations.rotatingCircle.image = ''
    circleImagePreview.value = null

    showToast('Đã xóa ảnh vòng xoay', 'success')
  }
}

const previewCircleImage = () => {
  if (settings.decorations.rotatingCircle.image) {
    showCircleImageModal.value = true
  } else {
    showToast('Không có ảnh vòng xoay để xem trước', 'warning')
  }
}

const closeCircleImageModal = () => {
  showCircleImageModal.value = false
}

// ========== UI FUNCTIONS ==========
const previewImage = () => {
  if (activeService.value && activeService.value.image) {
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})

watch(() => services.value, (newServices) => {
  console.log('Services updated:', newServices.length)
}, { deep: true })
</script>

<style scoped>
.file-upload {
  width: 100%;
  display: flex;
  gap: 10px;
}

/* Circle Image Upload */
.circle-image-upload {
  margin-top: 15px;
}

.file-upload.compact .file-upload-area {
  padding: 20px;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.file-upload.compact .file-upload-area i {
  font-size: 2rem;
  margin-bottom: 8px;
}

.file-upload.compact .file-upload-area p {
  font-size: 0.9rem;
}

.image-url-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 8px;
}

.hint-text {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 4px;
  margin-bottom: 0;
}

/* Modal specific styles */
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

.services-editor {
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

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #34ce57 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #868e96 100%);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6268 0%, #727b84 100%);
}

.btn-icon-only {
  padding: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  color: #495057;
}

.btn-icon-only:hover:not(:disabled) {
  background: #dee2e6;
  color: #031358;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
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

.tab-button i {
  font-size: 1.1rem;
}

/* Tab Content */
.tab-content {
  padding: 30px;
  background-color: white;
}

/* General Settings */
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

.setting-section h3 i {
  color: #4a6cf7;
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

.form-group input[type="text"],
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

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Color Input - FIXED */
.color-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.color-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-input-group label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0;
}

.color-input {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: nowrap;
}

.color-input input[type="color"] {
  width: 50px;
  height: 40px;
  padding: 0;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  overflow: hidden;
  box-sizing: border-box;
}

.color-input input[type="color"]:hover {
  border-color: #4a6cf7;
}

.color-input input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-input input[type="color"]::-moz-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-input input[type="color"]::-moz-focus-inner {
  border: none;
  padding: 0;
}

.color-input input[type="text"] {
  width: 100%;
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

/* Required Mark */
.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

/* Services Management */
.services-management {
  display: flex;
  gap: 30px;
}

.services-container {
  display: flex;
  gap: 30px;
  width: 100%;
}

.services-list {
  flex: 1;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.service-editor {
  flex: 2;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e9ecef;
}

/* Service Item - Simplified List */
.service-item {
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
}

.service-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e9ecef;
}

.service-item.active {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.service-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.service-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
}

.service-info {
  flex: 1;
  min-width: 0;
}

.service-info h4 {
  margin: 0 0 4px 0;
  color: #031358;
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.service-index {
  margin: 0;
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: 500;
}

.service-actions {
  flex-shrink: 0;
  margin-left: 10px;
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

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Service Editor */
.service-editor .editor-header {
  background: none;
  color: inherit;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-editor .editor-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
}

.editor-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* File Upload */
.file-upload-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.file-upload {
  margin-bottom: 15px;
}

.file-upload-area {
  border: 2px dashed #ced4da;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.file-upload-area:hover {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
}

.file-upload-area i {
  font-size: 2.5rem;
  color: #6c757d;
  margin-bottom: 10px;
  display: block;
}

.file-upload-area p {
  margin: 0;
  color: #495057;
}

.file-upload-area span {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
}

.input-hint {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 5px;
}

.upload-preview {
  position: relative;
  width: 50%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e9ecef;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* Quick Preview */
.quick-preview {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.quick-preview h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.preview-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.preview-content {
  flex: 1;
}

.preview-content h5 {
  margin: 0 0 8px 0;
  color: #031358;
  font-size: 1.1rem;
  font-weight: 600;
}

.preview-content p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
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
  .services-container {
    flex-direction: column;
  }

  .services-list {
    max-width: 100%;
    max-height: 300px;
  }

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

  .color-grid {
    grid-template-columns: 1fr;
  }

  .navigation-tabs {
    padding: 0 20px;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.9rem;
  }

  .service-editor .editor-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .editor-actions {
    width: 100%;
    justify-content: flex-start;
  }

  /* Responsive fix cho input color */
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

  .service-item {
    padding: 10px 12px;
  }

  .service-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
}
</style>