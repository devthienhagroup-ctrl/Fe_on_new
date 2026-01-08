<template>
  <div class="global-css-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý CSS Toàn cục</h2>
      <div class="header-controls">
        <button class="btn btn-success" @click="saveChanges" :disabled="isLoading">
          <i class="fas fa-save"></i> {{ isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
        </button>
      </div>
    </div>

    <!-- Nội dung chính -->
    <div class="main-content">
      <!-- Quản lý Colors -->
      <div class="setting-section">
        <div class="section-header">
          <h3><i class="fas fa-palette"></i> Colors</h3>
          <button class="btn btn-primary" @click="addColor">
            <i class="fas fa-plus"></i> Thêm màu
          </button>
        </div>

        <div class="colors-grid">
          <div v-for="(colorValue, colorName, index) in settings.colors" :key="colorName" class="color-item">
            <div class="color-header">
              <div class="color-name-display">
                <span>{{ colorName }}</span>
                <small>{{ colorValue }}</small>
              </div>
              <button
                  class="btn-icon btn-remove"
                  @click="removeColor(colorName)"
                  title="Xóa màu"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <div class="color-input">
              <input
                  type="color"
                  :value="extractHexFromColor(colorValue)"
                  @input="updateColorValue(colorName, $event.target.value)"
              />
              <input
                  type="text"
                  v-model="settings.colors[colorName]"
                  placeholder="#000000 hoặc rgba(...)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Glass Effects -->
      <div class="setting-section">
        <h3><i class="fas fa-wine-glass"></i> Glass Effects</h3>
        <div class="glass-grid">
          <div class="form-group">
            <label for="glass-bg-opacity">Background Opacity</label>
            <div class="input-with-color">
              <input type="color" :value="extractHexFromRgba(settings.glass['--glass-bg-opacity'])" disabled />
              <input
                  type="text"
                  id="glass-bg-opacity"
                  v-model="settings.glass['--glass-bg-opacity']"
                  placeholder="0.05"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="glass-bg-hover-opacity">Hover Opacity</label>
            <div class="input-with-color">
              <input type="color" :value="extractHexFromRgba(settings.glass['--glass-bg-hover-opacity'])" disabled />
              <input
                  type="text"
                  id="glass-bg-hover-opacity"
                  v-model="settings.glass['--glass-bg-hover-opacity']"
                  placeholder="0.1"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="glass-border-opacity">Border Opacity</label>
            <div class="input-with-color">
              <input type="color" :value="extractHexFromRgba(settings.glass['--glass-border-opacity'])" disabled />
              <input
                  type="text"
                  id="glass-border-opacity"
                  v-model="settings.glass['--glass-border-opacity']"
                  placeholder="0.1"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="glass-border-hover">Border Hover</label>
            <div class="input-with-color">
              <input type="color" :value="extractHexFromRgba(settings.glass['--glass-border-hover'])" />
              <input
                  type="text"
                  id="glass-border-hover"
                  v-model="settings.glass['--glass-border-hover']"
                  placeholder="rgba(139, 92, 246, 0.5)"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="glass-blur">Blur</label>
            <div class="input-with-color">
              <input type="color" value="#ffffff" disabled />
              <input
                  type="text"
                  id="glass-blur"
                  v-model="settings.glass['--glass-blur']"
                  placeholder="10px"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="glass-shadow-hover">Shadow Hover</label>
            <div class="input-with-color">
              <input type="color" :value="extractHexFromRgba(settings.glass['--glass-shadow-hover'])" />
              <input
                  type="text"
                  id="glass-shadow-hover"
                  v-model="settings.glass['--glass-shadow-hover']"
                  placeholder="0 20px 40px -15px rgba(139, 92, 246, 0.3)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Gradients -->
      <div class="setting-section">
        <h3><i class="fas fa-fill-drip"></i> Gradients</h3>
        <div class="gradients-grid">
          <div class="form-group">
            <label for="gradient-primary">Gradient Primary</label>
            <div class="gradient-input input-with-color">
              <div class="color-pickers">
                <input
                    type="color"
                    :value="extractFirstColorFromGradient(settings.gradients['--gradient-primary'])"
                    @input="updateGradientColor('--gradient-primary', 0, $event.target.value)"
                />
                <input
                    type="color"
                    :value="extractSecondColorFromGradient(settings.gradients['--gradient-primary'])"
                    @input="updateGradientColor('--gradient-primary', 1, $event.target.value)"
                />
              </div>
              <input
                  id="gradient-primary"
                  v-model="gradientsPrimaryText"
                  @input="updateGradientPrimary"
                  type="text"
                  placeholder='["#3b82f6", "#8b5cf6"]'
              >
            </div>
          </div>
          <div class="form-group">
            <label for="gradient-text">Gradient Text</label>
            <div class="gradient-input input-with-color">
              <div class="color-pickers">
                <input
                    type="color"
                    :value="extractFirstColorFromGradient(settings.gradients['--gradient-text'])"
                    @input="updateGradientColor('--gradient-text', 0, $event.target.value)"
                />
                <input
                    type="color"
                    :value="extractSecondColorFromGradient(settings.gradients['--gradient-text'])"
                    @input="updateGradientColor('--gradient-text', 1, $event.target.value)"
                />
              </div>
              <input
                  id="gradient-text"
                  v-model="gradientsTextText"
                  @input="updateGradientText"
                  type="text"
                  placeholder='["#60a5fa", "#c084fc"]'
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Map Filter -->
      <div class="setting-section">
        <h3><i class="fas fa-map"></i> Map Filter</h3>
        <div class="map-grid">
          <div class="form-group">
            <label for="map-grayscale">Grayscale</label>
            <div class="input-with-color">
              <input type="color" value="#808080" disabled />
              <input
                  type="text"
                  id="map-grayscale"
                  v-model="settings.mapFilter['--map-grayscale']"
                  placeholder="100%"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="map-invert">Invert</label>
            <div class="input-with-color">
              <input type="color" value="#808080" disabled />
              <input
                  type="text"
                  id="map-invert"
                  v-model="settings.mapFilter['--map-invert']"
                  placeholder="90%"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="map-contrast">Contrast</label>
            <div class="input-with-color">
              <input type="color" value="#808080" disabled />
              <input
                  type="text"
                  id="map-contrast"
                  v-model="settings.mapFilter['--map-contrast']"
                  placeholder="85%"
              />
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
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../../../../api/api.js'


// ========== STATE MANAGEMENT ==========
const settings = reactive({
  fontFamily: "'Inter', sans-serif",
  colors: {},
  glass: {},
  gradients: {},
  mapFilter: {}
})

// UI State
const isLoading = ref(false)

// File management (đồng bộ với Service.vue)
const files = ref([])
const uploadedFiles = ref([])

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// Computed properties for gradients
const gradientsPrimaryText = computed({
  get() {
    return JSON.stringify(settings.gradients['--gradient-primary'] || [])
  },
  set(value) {
    updateGradientPrimary({ target: { value } })
  }
})

const gradientsTextText = computed({
  get() {
    return JSON.stringify(settings.gradients['--gradient-text'] || [])
  },
  set(value) {
    updateGradientText({ target: { value } })
  }
})

// ========== CONSTANTS ==========
const TEMP_PREFIX = 'temp/'

// ========== HELPER FUNCTIONS ==========
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
  if (!originalFilename) return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalFilename.split('.').pop() || '';
  return `temp_${timestamp}_${random}${extension ? '.' + extension : ''}`;
}

// Extract hex from color value
const extractHexFromColor = (colorValue) => {
  if (!colorValue) return '#000000'

  // If it's already a hex color
  if (colorValue.startsWith('#')) {
    return colorValue
  }

  // If it's rgba
  if (colorValue.startsWith('rgba')) {
    const matches = colorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (matches) {
      const r = parseInt(matches[1])
      const g = parseInt(matches[2])
      const b = parseInt(matches[3])
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
  }

  // If it's rgb
  if (colorValue.startsWith('rgb')) {
    const matches = colorValue.match(/rgb?\((\d+),\s*(\d+),\s*(\d+)/)
    if (matches) {
      const r = parseInt(matches[1])
      const g = parseInt(matches[2])
      const b = parseInt(matches[3])
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
  }

  return '#000000'
}

// Extract hex from rgba value (for glass effects)
const extractHexFromRgba = (rgbaValue) => {
  if (!rgbaValue || typeof rgbaValue !== 'string') return '#ffffff'

  // For opacity values, show white color
  if (rgbaValue.includes('opacity') || /^\d+(\.\d+)?$/.test(rgbaValue)) {
    return '#ffffff'
  }

  // For rgba colors
  const matches = rgbaValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (matches) {
    const r = parseInt(matches[1])
    const g = parseInt(matches[2])
    const b = parseInt(matches[3])
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  return '#ffffff'
}

// Extract first color from gradient array
const extractFirstColorFromGradient = (gradientArray) => {
  if (!Array.isArray(gradientArray) || gradientArray.length === 0) return '#3b82f6'
  return extractHexFromColor(gradientArray[0])
}

// Extract second color from gradient array
const extractSecondColorFromGradient = (gradientArray) => {
  if (!Array.isArray(gradientArray) || gradientArray.length < 2) return '#8b5cf6'
  return extractHexFromColor(gradientArray[1])
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/55')

    if (response.data && response.data.contentJson) {
      const content = JSON.parse(response.data.contentJson)

      // Update settings from API response
      Object.assign(settings, content)

      // Handle files from API response (đồng bộ với Service.vue)
      if (response.data.files && response.data.files.length > 0) {
        files.value = response.data.files.map(file => ({
          id: file.id,
          filename: file.filename || file.realFilenameForSearch || '',
          status: 'EXISTING',
          tempName: file.tempName || generateTempName(file.filename),
          mappingTempUrl: file.mappingTempUrl || `temp/${file.tempName || generateTempName(file.filename)}`,
          mappingRealUrl: file.mappingRealUrl || file.filename,
          effectiveTempUrl: file.effectiveTempUrl || (file.filename ? '' : ''), // CSS không có base image URL
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

    // Fallback to default data structure
    Object.assign(settings, {
      fontFamily: "'Inter', sans-serif",
      colors: {
        "--color-brand-dark": "#020617",
        "--color-blue-400": "#60a5fa",
        "--color-blue-500": "#3b82f6",
        "--color-blue-600": "#2563eb"
      },
      glass: {
        "--glass-bg-opacity": "0.05",
        "--glass-bg-hover-opacity": "0.1",
        "--glass-border-opacity": "0.1",
        "--glass-border-hover": "rgba(139, 92, 246, 0.5)",
        "--glass-blur": "10px",
        "--glass-shadow-hover": "0 20px 40px -15px rgba(139, 92, 246, 0.3)"
      },
      gradients: {
        "--gradient-primary": ["#3b82f6", "#8b5cf6"],
        "--gradient-text": ["#60a5fa", "#c084fc"]
      },
      mapFilter: {
        "--map-grayscale": "100%",
        "--map-invert": "90%",
        "--map-contrast": "85%"
      }
    })
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare content data
    const contentData = { ...settings }

    // Prepare FormData (đồng bộ với Service.vue)
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: 55,
      name: 'CSS Toàn cục',
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

      // Update file statuses (đồng bộ với Service.vue)
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

// ========== COLOR MANAGEMENT ==========
const addColor = () => {
  const newColorName = `--color-new-${Object.keys(settings.colors).length + 1}`
  const newColorValue = '#000000'

  // Using Vue's reactive methods
  settings.colors[newColorName] = newColorValue
  showToast('Đã thêm màu mới', 'success')
}

const updateColorValue = (colorName, hexValue) => {
  // Get current value
  const currentValue = settings.colors[colorName]

  // If current value is rgba/rgb, update only the color part
  if (currentValue && currentValue.startsWith('rgba')) {
    const matches = currentValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*[\d.]+)?\)/)
    if (matches) {
      const opacity = matches[4] || ', 1)'
      const hex = hexValue.replace('#', '')
      const r = parseInt(hex.substring(0, 2), 16)
      const g = parseInt(hex.substring(2, 4), 16)
      const b = parseInt(hex.substring(4, 6), 16)
      settings.colors[colorName] = `rgba(${r}, ${g}, ${b}${opacity}`
      return
    }
  }

  // Otherwise, update wit  h hex value
  settings.colors[colorName] = hexValue
}

const removeColor = (colorName) => {
  // Prevent removal of important colors

  // Hiển thị cảnh báo bằng SweetAlert2 (swal)
  Swal.fire({
    title: 'Xác nhận xóa màu',
    html: `
      <div style="text-align: left; padding: 10px 0;">
        <p style="margin-bottom: 15px; font-size: 16px;">
          Bạn có chắc chắn muốn xóa màu <strong style="color: #dc3545;">${colorName}</strong>?
        </p>
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin-bottom: 15px; border-radius: 4px;">
          <div style="display: flex; align-items: center; gap: 8px; color: #856404;">
            <i class="fas fa-exclamation-triangle" style="font-size: 18px;"></i>
            <strong>Cảnh báo:</strong>
          </div>
          <p style="margin: 8px 0 0 0; color: #856404; font-size: 14px;">
            Nếu xóa màu này có thể làm mất màu các phần đã sử dụng trong giao diện!
          </p>
        </div>
        <div style="background-color: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 10px;">
          <p style="margin: 0; font-size: 14px;">
            <strong>Giá trị hiện tại:</strong>
            <code style="background: #e9ecef; padding: 3px 8px; border-radius: 3px; margin-left: 8px; font-family: monospace;">
              ${settings.colors[colorName]}
            </code>
          </p>
          <div style="display: flex; align-items: center; margin-top: 10px;">
            <span style="font-size: 14px; margin-right: 10px;"><strong>Xem trước:</strong></span>
            <div style="width: 40px; height: 40px; background-color: ${settings.colors[colorName]}; border: 2px solid #dee2e6; border-radius: 4px;"></div>
          </div>
        </div>
      </div>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa màu',
    cancelButtonText: 'Hủy bỏ',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    width: 550,
    padding: '20px',
    backdrop: 'rgba(0,0,0,0.4)',
    customClass: {
      container: 'custom-swal-container',
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      htmlContainer: 'custom-swal-html'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Thực hiện xóa nếu người dùng xác nhận
      delete settings.colors[colorName]
      showToast(`Đã xóa màu "${colorName}" thành công`, 'success')
    }
  })
}

// ========== GRADIENT MANAGEMENT ==========
const updateGradientPrimary = (event) => {
  try {
    const value = JSON.parse(event.target.value)
    if (Array.isArray(value)) {
      settings.gradients['--gradient-primary'] = value
    }
  } catch (error) {
    console.error('Invalid JSON for gradient primary:', error)
  }
}

const updateGradientText = (event) => {
  try {
    const value = JSON.parse(event.target.value)
    if (Array.isArray(value)) {
      settings.gradients['--gradient-text'] = value
    }
  } catch (error) {
    console.error('Invalid JSON for gradient text:', error)
  }
}

const updateGradientColor = (gradientName, index, hexValue) => {
  if (!settings.gradients[gradientName]) {
    settings.gradients[gradientName] = ['#3b82f6', '#8b5cf6']
  }

  settings.gradients[gradientName][index] = hexValue
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.global-css-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Header - Giữ nguyên màu như component trước */
.editor-header {
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  border-radius: 12px 12px 0 0;
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

/* Main Content */
.main-content {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Setting Section */
.setting-section {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.setting-section h3 {
  margin: 0;
  color: #031358;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-section h3 i {
  color: #4a6cf7;
}

/* Colors Grid */
.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.color-item {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.color-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.color-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.color-name-display {
  flex: 1;
}

.color-name-display span {
  display: block;
  font-family: monospace;
  font-weight: 600;
  color: #031358;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.color-name-display small {
  display: block;
  color: #6c757d;
  font-size: 0.8rem;
  font-family: monospace;
  word-break: break-all;
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
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.color-input input[type="color"]:hover {
  border-color: #4a6cf7;
}

.color-input input[type="text"] {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: monospace;
}

.color-input input[type="text"]:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

/* Input with Color Picker */
.input-with-color {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-with-color input[type="color"] {
  width: 50px;
  height: 40px;
  padding: 0;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  flex-shrink: 0;
}

.input-with-color input[type="color"]:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.input-with-color input[type="text"] {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: monospace;
}

/* Gradient Input */
.gradient-input {
  /* Add any specific styles for gradient input */
}

.color-pickers {
  display: flex;
  gap: 10px;
}

.color-pickers input[type="color"] {
  width: 50px;
  height: 40px;
  padding: 0;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
}

.gradient-input textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: monospace;
  resize: vertical;
  min-height: 80px;
}

/* Grid Layouts */
.glass-grid,
.map-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.gradients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* Form Styles */
.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
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
  background-color: #e9ecef;
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

  .main-content {
    padding: 20px;
  }

  .colors-grid,
  .glass-grid,
  .map-grid {
    grid-template-columns: 1fr;
  }

  .gradients-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .input-with-color,
  .color-input {
    flex-wrap: wrap;
  }

  .input-with-color input[type="color"],
  .color-input input[type="color"] {
    width: 40px;
    height: 35px;
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

  .setting-section {
    padding: 20px;
  }
}
</style>