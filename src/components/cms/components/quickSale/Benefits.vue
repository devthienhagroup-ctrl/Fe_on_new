<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Lợi ích</h2>
      <div class="header-controls">
        <button class="btn btn-primary" @click="saveChanges" :disabled="isLoading">
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
          :class="{ active: activeTab === 'benefits' }"
          @click="activeTab = 'benefits'"
      >
        <i class="fas fa-star"></i> Danh sách lợi ích
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'style' }"
          @click="activeTab = 'style'"
      >
        <i class="fas fa-palette"></i> Phong cách & Màu sắc
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Cài đặt chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Tiêu đề chính -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề chính</h3>

            <div class="form-group">
              <label for="sectionTitle">Tiêu đề section</label>
              <input
                  type="text"
                  id="sectionTitle"
                  v-model="content.sectionTitle"
                  placeholder="LỢI ÍCH KHI CHỌN DỊCH VỤ BÁN NHANH BĐS CỦA THIÊN HÀ GROUP?"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="titleColor">Màu tiêu đề</label>
                <div class="color-input">
                  <input type="color" v-model="content.titleColor" />
                  <input type="text" v-model="content.titleColor" placeholder="#031358" />
                </div>
              </div>
              <div class="form-group">
                <label for="titleFontSize">Kích thước chữ</label>
                <div class="input-with-unit">
                  <input type="text" id="titleFontSize" v-model="content.titleFontSize" placeholder="40px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Container hình ảnh -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Container hình ảnh</h3>

            <div class="form-group">
              <label for="imageContainerHeight">Chiều cao container</label>
              <div class="input-with-unit">
                <input type="text" id="imageContainerHeight" v-model="content.imageContainerHeight" placeholder="500px" />
                <span class="unit">px</span>
              </div>
            </div>

            <!-- Gradient Overlay -->
            <div class="form-group">
              <label>Gradient overlay</label>
              <div class="gradient-input">
                <div class="gradient-colors">
                  <div class="color-input-with-preview">
                    <input type="color" v-model="gradientColors[0]" @change="updateGradientOverlay" />
                    <span class="color-label">Màu 1</span>
                  </div>
                  <div class="color-input-with-preview">
                    <input type="color" v-model="gradientColors[1]" @change="updateGradientOverlay" />
                    <span class="color-label">Màu 2</span>
                  </div>
                  <div class="color-input-with-preview">
                    <input type="color" v-model="gradientColors[2]" @change="updateGradientOverlay" />
                    <span class="color-label">Màu 3</span>
                  </div>
                  <input
                      type="text"
                      id="imageOverlayGradient"
                      v-model="content.imageOverlayGradient"
                      placeholder="linear-gradient(to top, rgba(3, 19, 88, 0.8) 0%, rgba(3, 19, 88, 0.4) 50%, rgba(3, 19, 88, 0.2) 100%)"
                      @input="parseGradientOverlay"
                  />
                </div>
              </div>
            </div>

            <!-- Placeholder Background -->
            <div class="form-group">
              <label>Màu nền placeholder</label>
              <div class="gradient-input">
                <div class="gradient-colors">
                  <div class="color-input-with-preview">
                    <input type="color" v-model="placeholderColors[0]" @change="updatePlaceholderBackground" />
                    <span class="color-label">Màu 1</span>
                  </div>
                  <div class="color-input-with-preview">
                    <input type="color" v-model="placeholderColors[1]" @change="updatePlaceholderBackground" />
                    <span class="color-label">Màu 2</span>
                  </div>
                </div>
                <input
                    type="text"
                    id="placeholderBackground"
                    v-model="content.placeholderBackground"
                    placeholder="linear-gradient(135deg, #031358 0%, #002FFF 100%)"
                    @input="parsePlaceholderBackground"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Danh sách lợi ích -->
      <div v-if="activeTab === 'benefits'" class="benefits-settings">
        <div class="benefits-header">
          <h3><i class="fas fa-list"></i> Quản lý lợi ích</h3>
          <button class="btn btn-primary" @click="addBenefit">
            <i class="fas fa-plus"></i> Thêm lợi ích
          </button>
        </div>

        <div class="benefits-list">
          <div v-for="(benefit, index) in content.benefits" :key="benefit.id || index" class="benefit-item">
            <div class="benefit-header" @click="toggleBenefit(index)">
              <div class="benefit-title">
                <i class="fas fa-grip-vertical handle"></i>
                <span class="benefit-number">#{{ index + 1 }}</span>
                <i :class="benefit.icon || 'fas fa-star'"></i>
                <span class="benefit-text">{{ benefit.title || 'Lợi ích chưa có tiêu đề' }}</span>
              </div>
              <div class="benefit-actions">
                <button class="btn-icon" @click.stop="toggleBenefit(index)">
                  <i :class="benefit.expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                </button>
                <button class="btn-icon btn-trash" @click.stop="removeBenefit(index)" title="Xóa">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div v-if="benefit.expanded" class="benefit-content">
              <div class="form-row">
                <div class="form-group">
                  <label :for="`benefit-title-${index}`">Tiêu đề</label>
                  <input
                      type="text"
                      :id="`benefit-title-${index}`"
                      v-model="benefit.title"
                      placeholder="Bán nhanh bất động sản trong thời gian ngắn"
                  />
                </div>
                <div class="form-group">
                  <label :for="`benefit-icon-${index}`">Icon</label>
                  <IconPicker v-model="benefit.icon" />
                </div>
              </div>

              <div class="form-group">
                <label :for="`benefit-desc-${index}`">Mô tả</label>
                <textarea
                    :id="`benefit-desc-${index}`"
                    v-model="benefit.description"
                    rows="3"
                    placeholder="Mô tả chi tiết về lợi ích..."
                ></textarea>
              </div>

              <div class="form-group">
                <label>Hình ảnh</label>
                <div class="file-upload compact">
                  <div class="file-upload-area" @click="triggerBenefitImageInput(index)" @dragover.prevent @drop.prevent="(e) => handleBenefitImageDrop(e, index)">
                    <input
                        type="file"
                        :id="`benefit-image-file-${index}`"
                        @change="(e) => handleBenefitImageUpload(e, index)"
                        accept="image/*"
                        style="display: none"
                    />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                  </div>

                  <div v-if="benefit.imagePreview || benefit.image" class="upload-preview">
                    <img :src="getImageUrl(benefit.image)" alt="Benefit Preview" />
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewBenefitImage(index)" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="removeBenefitImage(index)" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group" v-if="!benefit.imagePreview && !benefit.image">
                <label :for="`benefit-image-url-${index}`">URL hình ảnh</label>
                <input
                    type="text"
                    :id="`benefit-image-url-${index}`"
                    v-model="benefit.image"
                    placeholder="benefit1.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="content.benefits.length === 0" class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>Chưa có lợi ích nào được thêm</p>
          <button class="btn btn-primary" @click="addBenefit">
            <i class="fas fa-plus"></i> Thêm lợi ích đầu tiên
          </button>
        </div>
      </div>

      <!-- Tab Phong cách & Màu sắc -->
      <div v-if="activeTab === 'style'" class="style-settings">
        <div class="settings-grid">
          <!-- Border & Progress Bar -->
          <div class="setting-section">
            <h3><i class="fas fa-border-style"></i> Border & Progress Bar</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="borderColor">Màu border thường</label>
                <div class="color-input">
                  <input type="color" v-model="content.borderColor" />
                  <input type="text" v-model="content.borderColor" placeholder="#e8ecff" />
                </div>
              </div>
              <div class="form-group">
                <label for="activeBorderColor">Màu border active</label>
                <div class="color-input">
                  <input type="color" v-model="content.activeBorderColor" />
                  <input type="text" v-model="content.activeBorderColor" placeholder="#002FFF" />
                </div>
              </div>
            </div>

              <div class="form-group">
                <label for="progressBarColor">Màu nền progress bar</label>
                <div class="color-input">
                  <input type="color" v-model="content.progressBarColor" />
                  <input type="text" v-model="content.progressBarColor" placeholder="#e8ecff" />
                </div>
              </div>
              <div class="form-group">
                <label for="progressFillColor">Màu fill progress bar</label>
                <div class="gradient-input">
                  <div class="gradient-colors">
                    <div class="color-input-with-preview">
                      <input type="color" v-model="progressFillColors[0]" @change="updateProgressFillColor" />
                      <span class="color-label">Màu 1</span>
                    </div>
                    <div class="color-input-with-preview">
                      <input type="color" v-model="progressFillColors[1]" @change="updateProgressFillColor" />
                      <span class="color-label">Màu 2</span>
                    </div>
                  </div>
                  <input
                      type="text"
                      id="progressFillColor"
                      v-model="content.progressFillColor"
                      placeholder="linear-gradient(90deg, #002FFF 0%, #4d74ff 100%)"
                      @input="parseProgressFillColor"
                  />
                </div>
              </div>
          </div>

          <!-- Hover & Active Effects -->
          <div class="setting-section">
            <h3><i class="fas fa-magic"></i> Hiệu ứng Hover & Active</h3>

            <div class="form-group">
              <label for="benefitItemHoverShadow">Box shadow khi hover</label>
              <input
                  type="text"
                  id="benefitItemHoverShadow"
                  v-model="content.benefitItemHoverShadow"
                  placeholder="0 8px 25px rgba(3, 19, 88, 0.1)"
              />
            </div>

            <div class="form-group">
              <label for="activeBackground">Nền active item</label>
              <div class="gradient-input">
                <div class="gradient-colors">
                  <div class="color-input-with-preview">
                    <input type="color" v-model="activeBgColors[0]" @change="updateActiveBackground" />
                    <span class="color-label">Màu 1</span>
                  </div>
                  <div class="color-input-with-preview">
                    <input type="color" v-model="activeBgColors[1]" @change="updateActiveBackground" />
                    <span class="color-label">Màu 2</span>
                  </div>
                </div>
                <input
                    type="text"
                    id="activeBackground"
                    v-model="content.activeBackground"
                    placeholder="linear-gradient(135deg, #f8faff 0%, #ffffff 100%)"
                    @input="parseActiveBackground"
                />
              </div>
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

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Content structure based on the new JSON data
const content = reactive({
  sectionTitle: "LỢI ÍCH KHI CHỌN DỊCH VỤ BÁN NHANH BĐS CỦA THIÊN HÀ GROUP?",
  titleColor: "#031358",
  titleFontSize: "40px",
  borderColor: "#e8ecff",
  activeBorderColor: "#002FFF",
  progressBarColor: "#e8ecff",
  progressFillColor: "linear-gradient(90deg, #002FFF 0%, #4d74ff 100%)",
  benefitItemHoverShadow: "0 8px 25px rgba(3, 19, 88, 0.1)",
  activeBackground: "linear-gradient(135deg, #f8faff 0%, #ffffff 100%)",
  imageOverlayGradient: "linear-gradient(to top, rgba(3, 19, 88, 0.8) 0%, rgba(3, 19, 88, 0.4) 50%, rgba(3, 19, 88, 0.2) 100%)",
  placeholderBackground: "linear-gradient(135deg, #031358 0%, #002FFF 100%)",
  imageContainerHeight: "500px",
  benefits: []
})

// Gradient color extraction
const gradientColors = ref(['#031358', '#031358', '#031358'])
const placeholderColors = ref(['#031358', '#002FFF'])
const progressFillColors = ref(['#002FFF', '#4d74ff'])
const activeBgColors = ref(['#f8faff', '#ffffff'])

// UI State
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// Files management
const files = ref([])
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
const SECTION_ID = 25

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

// ========== GRADIENT PARSING FUNCTIONS ==========
const parseGradientOverlay = () => {
  const gradient = content.imageOverlayGradient
  const rgbaRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g
  const matches = [...gradient.matchAll(rgbaRegex)]

  if (matches.length >= 3) {
    gradientColors.value[0] = rgbaToHex(matches[0])
    gradientColors.value[1] = rgbaToHex(matches[1])
    gradientColors.value[2] = rgbaToHex(matches[2])
  }
}

const updateGradientOverlay = () => {
  const colors = gradientColors.value
  content.imageOverlayGradient = `linear-gradient(to top, ${hexToRgba(colors[0], 0.8)} 0%, ${hexToRgba(colors[1], 0.4)} 50%, ${hexToRgba(colors[2], 0.2)} 100%)`
}

const parsePlaceholderBackground = () => {
  const gradient = content.placeholderBackground
  const hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g
  const matches = gradient.match(hexRegex)

  if (matches && matches.length >= 2) {
    placeholderColors.value[0] = matches[0]
    placeholderColors.value[1] = matches[1]
  }
}

const updatePlaceholderBackground = () => {
  const colors = placeholderColors.value
  content.placeholderBackground = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`
}

const parseProgressFillColor = () => {
  const gradient = content.progressFillColor
  const hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g
  const matches = gradient.match(hexRegex)

  if (matches && matches.length >= 2) {
    progressFillColors.value[0] = matches[0]
    progressFillColors.value[1] = matches[1]
  }
}

const updateProgressFillColor = () => {
  const colors = progressFillColors.value
  content.progressFillColor = `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`
}

const parseActiveBackground = () => {
  const gradient = content.activeBackground
  const hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/g
  const matches = gradient.match(hexRegex)

  if (matches && matches.length >= 2) {
    activeBgColors.value[0] = matches[0]
    activeBgColors.value[1] = matches[1]
  }
}

const updateActiveBackground = () => {
  const colors = activeBgColors.value
  content.activeBackground = `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`
}

const rgbaToHex = (rgbaMatch) => {
  const r = parseInt(rgbaMatch[1]).toString(16).padStart(2, '0')
  const g = parseInt(rgbaMatch[2]).toString(16).padStart(2, '0')
  const b = parseInt(rgbaMatch[3]).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
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
      Object.keys(data).forEach(key => {
        if (key === 'benefits' && Array.isArray(data[key])) {
          // Add expanded property for each benefit for UI
          content[key] = data[key].map(benefit => ({
            ...benefit,
            expanded: false,
            imagePreview: null
          }))
        } else {
          content[key] = data[key]
        }
      })

      // Parse gradient colors
      parseGradientOverlay()
      parsePlaceholderBackground()
      parseProgressFillColor()
      parseActiveBackground()

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

    // Prepare content data without UI properties
    const contentData = { ...content }

    // Remove UI properties from benefits
    contentData.benefits = content.benefits.map(benefit => {
      const { expanded, imagePreview, ...cleanBenefit } = benefit
      return cleanBenefit
    })

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Lợi ích',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 11,
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

  // Check benefit images
  content.benefits.forEach(benefit => {
    if (benefit.image === tempUrl) {
      benefit.image = realUrl
    }
  })
}

// ========== BENEFIT IMAGE HANDLERS ==========
const triggerBenefitImageInput = (index) => {
  const inputId = `benefit-image-file-${index}`
  const inputElement = document.getElementById(inputId)
  if (inputElement) {
    inputElement.click()
  }
}

const handleBenefitImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    handleBenefitFileUpload(file, index)
  }
  event.target.value = ''
}

const handleBenefitImageDrop = (event, index) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleBenefitFileUpload(file, index)
  }
}

const handleBenefitFileUpload = (file, index) => {
  const benefit = content.benefits[index]
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const maxSize = 5 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP, SVG', 'error')
    return false
  }


  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Update benefit
    benefit.image = tempUrl
    benefit.imagePreview = previewUrl

    // Create file DTO
    const fileDTO = {
      id: null,
      filename: `benefit_${index}_${file.name}`,
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

    showToast(`Ảnh lợi ích #${index + 1} đã được tải lên thành công`, 'success')
  }

  reader.readAsDataURL(file)
  return true
}

const removeBenefitImage = (index) => {
  const benefit = content.benefits[index]
  if (benefit.image) {
    if (benefit.image.startsWith(TEMP_PREFIX)) {
      const tempName = benefit.image.replace(TEMP_PREFIX, '')

      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else {
      const fileIndex = files.value.findIndex(f => f.filename === benefit.image)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    benefit.image = ''
    benefit.imagePreview = null
    showToast('Đã xóa ảnh lợi ích', 'success')
  }
}

// ========== BENEFITS MANAGEMENT ==========
const addBenefit = () => {
  const newId = content.benefits.length > 0
      ? Math.max(...content.benefits.map(b => b.id)) + 1
      : 1

  content.benefits.push({
    id: newId,
    title: '',
    description: '',
    icon: 'fas fa-star',
    image: '',
    expanded: true,
    imagePreview: null
  })
}

const removeBenefit = (index) => {
  const benefit = content.benefits[index]

  // Mark associated file for removal if it exists
  if (benefit.image && !benefit.image.startsWith(TEMP_PREFIX)) {
    const fileIndex = files.value.findIndex(f => f.filename === benefit.image)
    if (fileIndex !== -1) {
      files.value[fileIndex].status = 'REMOVE'
    }
  }

  content.benefits.splice(index, 1)
  showToast('Đã xóa lợi ích', 'success')
}

const toggleBenefit = (index) => {
  content.benefits[index].expanded = !content.benefits[index].expanded
}

// ========== PREVIEW FUNCTIONS ==========
const previewBenefitImage = (index) => {
  const benefit = content.benefits[index]
  if (benefit.image) {
    previewImageUrl.value = getImageUrl(benefit.image)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
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

/* Benefits Management */
.benefits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 10px;
  border: 2px solid #e9ecef;
}

.benefits-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.benefit-item {
  background-color: white;
  border-radius: 10px;
  border: 2px solid #e9ecef;
  overflow: hidden;
  transition: all 0.3s ease;
}

.benefit-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.1);
}

.benefit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  user-select: none;
}

.benefit-title {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.handle {
  color: #adb5bd;
  cursor: move;
}

.benefit-number {
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
}

.benefit-title i:not(.handle) {
  color: #4a6cf7;
  font-size: 1.1rem;
  width: 24px;
}

.benefit-text {
  font-weight: 600;
  color: #031358;
  flex: 1;
  font-size: 1rem;
}

.benefit-actions {
  display: flex;
  gap: 10px;
}

.benefit-content {
  padding: 20px;
  background-color: white;
  border-top: 1px solid #e9ecef;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-radius: 10px;
  border: 2px dashed #e9ecef;
}

.empty-state i {
  font-size: 4rem;
  color: #adb5bd;
  margin-bottom: 20px;
}

.empty-state p {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 20px;
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

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Color Input */
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

/* Gradient Input */
.gradient-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gradient-colors {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.color-input-with-preview {
  display: flex;
  align-items: center;
  gap: 5px;
}

.color-input-with-preview input[type="color"] {
  width: 50px;
  height: 40px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
}

.color-label {
  font-size: 0.8rem;
  color: #6c757d;
  text-align: center;
}

.gradient-input input[type="text"] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
}

.gradient-input input[type="text"]:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
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
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #6c757d;
}

.btn-icon:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.btn-icon.btn-trash:hover:not(:disabled) {
  background-color: #dc3545;
  color: white;
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

  .benefits-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .benefit-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .benefit-actions {
    align-self: flex-end;
  }

  .tab-content {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .gradient-colors {
    justify-content: center;
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

  .color-input-with-preview input[type="color"] {
    width: 40px;
    height: 35px;
  }
}
</style>