<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Danh sách Góp vốn</h2>
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
        <i class="fas fa-font"></i> Văn bản & Nút
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'steps' }"
          @click="activeTab = 'steps'"
      >
        <i class="fas fa-icons"></i> Icon
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-palette"></i> Màu sắc & Animation
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Văn bản & Nút -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Văn bản -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Văn bản hiển thị</h3>

            <div class="form-group">
              <label for="page-title">Tiêu đề trang</label>
              <input
                  type="text"
                  id="page-title"
                  v-model="content.text.pageTitle"
                  placeholder="Danh sách chi nhánh cần góp vốn"
              />
            </div>

            <div class="form-group">
              <label for="total-capital">Văn bản tổng vốn</label>
              <input
                  type="text"
                  id="total-capital"
                  v-model="content.text.totalCapital"
                  placeholder="Tổng vốn cần:"
              />
            </div>

            <div class="form-group">
              <label for="progress-text">Văn bản tiến độ</label>
              <input
                  type="text"
                  id="progress-text"
                  v-model="content.text.progress"
                  placeholder="Tiến độ:"
              />
            </div>

            <div class="form-group">
              <label for="contributors-text">Văn bản người góp</label>
              <input
                  type="text"
                  id="contributors-text"
                  v-model="content.text.contributorsText"
                  placeholder="người đã góp"
              />
            </div>
          </div>

          <!-- Nút bấm -->
          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm</h3>

            <div class="form-group">
              <label for="contribute-btn">Nút Góp vốn</label>
              <input
                  type="text"
                  id="contribute-btn"
                  v-model="content.buttons.contribute"
                  placeholder="Góp vốn"
              />
            </div>

            <div class="form-group">
              <label for="details-btn">Nút Xem chi tiết</label>
              <input
                  type="text"
                  id="details-btn"
                  v-model="content.buttons.details"
                  placeholder="Xem chi tiết"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Icon -->
      <div v-if="activeTab === 'steps'" class="steps-settings">
        <div class="steps-header">
          <h3><i class="fas fa-icons"></i> Quản lý Icon</h3>
        </div>

        <div class="steps-grid">
          <div class="step-item">
            <div class="step-header">
              <div class="step-number">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="step-title-preview">
                <span>Icon Tiến độ</span>
              </div>
            </div>
            <div class="step-edit-form">
              <div class="form-group">
                <label for="progress-icon">Icon Tiến độ</label>
                <IconPicker v-model="content.icons.progress"/>
                <small class="form-hint">VD: fas fa-chart-line</small>
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-header">
              <div class="step-number">
                <i class="fas fa-clock"></i>
              </div>
              <div class="step-title-preview">
                <span>Icon Thời gian</span>
              </div>
            </div>
            <div class="step-edit-form">
              <div class="form-group">
                <label for="time-icon">Icon Thời gian</label>
                <IconPicker v-model="content.icons.time"/>
                <small class="form-hint">VD: fas fa-clock</small>
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-header">
              <div class="step-number">
                <i class="fas fa-users"></i>
              </div>
              <div class="step-title-preview">
                <span>Icon Người góp</span>
              </div>
            </div>
            <div class="step-edit-form">
              <div class="form-group">
                <label for="contributors-icon">Icon Người góp</label>
                <IconPicker v-model="content.icons.contributors"/>
                <small class="form-hint">VD: fas fa-users</small>
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-header">
              <div class="step-number">
                <i class="fas fa-hand-holding-usd"></i>
              </div>
              <div class="step-title-preview">
                <span>Icon Góp vốn</span>
              </div>
            </div>
            <div class="step-edit-form">
              <div class="form-group">
                <label for="contribute-icon">Icon Góp vốn</label>
                <IconPicker v-model="content.icons.contribute"/>
                <small class="form-hint">VD: fas fa-hand-holding-usd</small>
              </div>
            </div>
          </div>

          <!-- Icon thứ 5 - sẽ full width -->
          <div class="step-item step-item-full">
            <div class="step-header">
              <div class="step-number">
                <i class="fas fa-info-circle"></i>
              </div>
              <div class="step-title-preview">
                <span>Icon Chi tiết</span>
              </div>
            </div>
            <div class="step-edit-form">
              <div class="form-group">
                <label for="details-icon">Icon Chi tiết</label>
                <IconPicker v-model="content.icons.details"/>
                <small class="form-hint">VD: fas fa-info-circle</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Màu sắc & Gradient -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Màu sắc cơ bản -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc cơ bản</h3>

            <div class="color-input-group">
              <label>Màu chính</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.primary"/>
                <input type="text" v-model="content.colors.primary" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu phụ</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.secondary"/>
                <input type="text" v-model="content.colors.secondary" placeholder="#64748b"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu đường viền</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.border"/>
                <input type="text" v-model="content.colors.border" placeholder="#e2e8f0"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu nền thanh tiến độ</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.progressBg"/>
                <input type="text" v-model="content.colors.progressBg" placeholder="#e2e8f0"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ nút phụ</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.buttonSecondaryText"/>
                <input type="text" v-model="content.colors.buttonSecondaryText" placeholder="#475569"/>
              </div>
            </div>
          </div>

          <!-- Gradient -->
          <div class="setting-section">
            <h3><i class="fas fa-gradient"></i> Gradient</h3>

            <div class="color-input-group">
              <label>Gradient chữ</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.text.color1" @change="updateTextGradient()"/>
                <input type="color" v-model="gradientColors.text.color2" @change="updateTextGradient()"/>
                <input
                    type="text"
                    v-model="content.gradient.text"
                    placeholder="linear-gradient(135deg, #031358, #283593)"
                    @input="updateTextColorsFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Gradient thanh tiến độ</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.progress.color1" @change="updateProgressGradient()"/>
                <input type="color" v-model="gradientColors.progress.color2" @change="updateProgressGradient()"/>
                <input
                    type="text"
                    v-model="content.gradient.progress"
                    placeholder="linear-gradient(90deg, #283593, #031358)"
                    @input="updateProgressColorsFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Gradient nút phụ</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.buttonSecondary.color1" @change="updateButtonSecondaryGradient()"/>
                <input type="color" v-model="gradientColors.buttonSecondary.color2" @change="updateButtonSecondaryGradient()"/>
                <input
                    type="text"
                    v-model="content.gradient.buttonSecondary"
                    placeholder="linear-gradient(135deg, #f1f5f9, #e2e8f0)"
                    @input="updateButtonSecondaryColorsFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Gradient nút phụ (hover)</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.buttonSecondaryHover.color1" @change="updateButtonSecondaryHoverGradient()"/>
                <input type="color" v-model="gradientColors.buttonSecondaryHover.color2" @change="updateButtonSecondaryHoverGradient()"/>
                <input
                    type="text"
                    v-model="content.gradient.buttonSecondaryHover"
                    placeholder="linear-gradient(135deg, #e2e8f0, #cbd5e1)"
                    @input="updateButtonSecondaryHoverColorsFromGradient()"
                />
              </div>
            </div>
          </div>

          <!-- Animation -->
          <div class="setting-section">
            <h3><i class="fas fa-film"></i> Animation</h3>

            <div class="form-group">
              <label for="animation-duration">Thời gian animation (ms)</label>
              <input
                  type="number"
                  id="animation-duration"
                  v-model.number="content.animation.duration"
                  min="100"
                  max="5000"
                  step="100"
              />
              <small class="form-hint">Thời gian hoàn thành animation (100-5000ms)</small>
            </div>

            <div class="form-group">
              <label for="animation-reset-delay">Thời gian reset (ms)</label>
              <input
                  type="number"
                  id="animation-reset-delay"
                  v-model.number="content.animation.resetDelay"
                  min="0"
                  max="1000"
                  step="10"
              />
              <small class="form-hint">Thời gian delay trước khi reset animation</small>
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
import {ref, reactive, onMounted} from 'vue'
import api from '../../../../api/api.js'
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Gradient colors state
const gradientColors = reactive({
  text: {
    color1: '#031358',
    color2: '#283593'
  },
  progress: {
    color1: '#283593',
    color2: '#031358'
  },
  buttonSecondary: {
    color1: '#f1f5f9',
    color2: '#e2e8f0'
  },
  buttonSecondaryHover: {
    color1: '#e2e8f0',
    color2: '#cbd5e1'
  }
})

// Content structure based on new JSON data
const content = reactive({
  text: {
    pageTitle: 'Danh sách chi nhánh cần góp vốn',
    totalCapital: 'Tổng vốn cần:',
    progress: 'Tiến độ:',
    contributorsText: 'người đã góp'
  },
  buttons: {
    contribute: 'Góp vốn',
    details: 'Xem chi tiết'
  },
  icons: {
    progress: 'fas fa-chart-line',
    time: 'fas fa-clock',
    contributors: 'fas fa-users',
    contribute: 'fas fa-hand-holding-usd',
    details: 'fas fa-info-circle'
  },
  colors: {
    primary: '#031358',
    secondary: '#64748b',
    border: '#e2e8f0',
    progressBg: '#e2e8f0',
    buttonSecondaryText: '#475569'
  },
  gradient: {
    text: 'linear-gradient(135deg, #031358, #283593)',
    progress: 'linear-gradient(90deg, #283593, #031358)',
    buttonSecondary: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
    buttonSecondaryHover: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)'
  },
  animation: {
    duration: 800,
    resetDelay: 50
  }
})

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
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 50

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

const handleFileUpload = (file, type, previewRef, contentPath) => {
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
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Update content
    const pathParts = contentPath.split('.')
    let target = content
    for (let i = 0; i < pathParts.length - 1; i++) {
      target = target[pathParts[i]]
    }
    target[pathParts[pathParts.length - 1]] = tempUrl

    // Create file DTO
    const fileDTO = {
      id: null,
      filename: `${type}_${file.name}`,
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

    showToast(`${type} đã được tải lên thành công`, 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  return true
}

// ========== GRADIENT FUNCTIONS ==========
const parseGradientColors = (gradientStr) => {
  if (!gradientStr) return {color1: '#031358', color2: '#283593'};

  const matches = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (matches && matches.length >= 2) {
    return {color1: matches[0], color2: matches[1]};
  }
  return {color1: '#031358', color2: '#283593'};
};

const updateTextGradient = () => {
  content.gradient.text = `linear-gradient(135deg, ${gradientColors.text.color1}, ${gradientColors.text.color2})`;
};

const updateTextColorsFromGradient = () => {
  const colors = parseGradientColors(content.gradient.text);
  gradientColors.text.color1 = colors.color1;
  gradientColors.text.color2 = colors.color2;
};

const updateProgressGradient = () => {
  content.gradient.progress = `linear-gradient(90deg, ${gradientColors.progress.color1}, ${gradientColors.progress.color2})`;
};

const updateProgressColorsFromGradient = () => {
  const colors = parseGradientColors(content.gradient.progress);
  gradientColors.progress.color1 = colors.color1;
  gradientColors.progress.color2 = colors.color2;
};

const updateButtonSecondaryGradient = () => {
  content.gradient.buttonSecondary = `linear-gradient(135deg, ${gradientColors.buttonSecondary.color1}, ${gradientColors.buttonSecondary.color2})`;
};

const updateButtonSecondaryColorsFromGradient = () => {
  const colors = parseGradientColors(content.gradient.buttonSecondary);
  gradientColors.buttonSecondary.color1 = colors.color1;
  gradientColors.buttonSecondary.color2 = colors.color2;
};

const updateButtonSecondaryHoverGradient = () => {
  content.gradient.buttonSecondaryHover = `linear-gradient(135deg, ${gradientColors.buttonSecondaryHover.color1}, ${gradientColors.buttonSecondaryHover.color2})`;
};

const updateButtonSecondaryHoverColorsFromGradient = () => {
  const colors = parseGradientColors(content.gradient.buttonSecondaryHover);
  gradientColors.buttonSecondaryHover.color1 = colors.color1;
  gradientColors.buttonSecondaryHover.color2 = colors.color2;
};

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

      // Initialize gradient colors
      const textColors = parseGradientColors(content.gradient.text);
      gradientColors.text.color1 = textColors.color1;
      gradientColors.text.color2 = textColors.color2;

      const progressColors = parseGradientColors(content.gradient.progress);
      gradientColors.progress.color1 = progressColors.color1;
      gradientColors.progress.color2 = progressColors.color2;

      const buttonSecondaryColors = parseGradientColors(content.gradient.buttonSecondary);
      gradientColors.buttonSecondary.color1 = buttonSecondaryColors.color1;
      gradientColors.buttonSecondary.color2 = buttonSecondaryColors.color2;

      const buttonSecondaryHoverColors = parseGradientColors(content.gradient.buttonSecondaryHover);
      gradientColors.buttonSecondaryHover.color1 = buttonSecondaryHoverColors.color1;
      gradientColors.buttonSecondaryHover.color2 = buttonSecondaryHoverColors.color2;

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

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Danh sách',
      contentJson: JSON.stringify(content, null, 2),
      sortOrder: 1,
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

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>
<style scoped>
/* Steps Grid Layout */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.step-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

/* Item thứ 5 và các item lẻ sau đó sẽ chiếm full width */
.step-item-full {
  grid-column: 1 / -1;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .steps-grid {
    grid-template-columns: 1fr;
  }

  .step-item-full {
    grid-column: 1 / 2;
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

/* Steps Management */
.steps-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.steps-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.step-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.step-header:hover {
  background-color: #e9ecef;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.step-title-preview {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.step-title-preview i {
  color: #4a6cf7;
  width: 20px;
}

.step-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #dee2e6;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #495057;
}

.btn-icon:hover:not(:disabled) {
  background-color: #4a6cf7;
  color: white;
  border-color: #4a6cf7;
  transform: scale(1.05);
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete:hover:not(:disabled) {
  background-color: #dc3545;
  border-color: #dc3545;
}

.step-edit-form {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9ff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
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

.form-hint {
  display: block;
  margin-top: 5px;
  font-size: 0.85rem;
  color: #6c757d;
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

  .form-row {
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

  .navigation-tabs {
    padding: 0 20px;
    flex-direction: column;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.9rem;
    justify-content: center;
  }

  .steps-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .step-header {
    flex-wrap: wrap;
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

/* Gradient Colors */
.gradient-colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 10px;
}

.color-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.color-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 3px;
}

.gradient-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: white;
  transition: all 0.3s ease;
}

.gradient-input:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gradient-colors {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>