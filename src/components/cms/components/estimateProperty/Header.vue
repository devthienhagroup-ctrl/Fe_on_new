<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Header Định giá</h2>
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
          :class="{ active: activeTab === 'banner' }"
          @click="activeTab = 'banner'"
      >
        <i class="fas fa-image"></i> Banner & Hình ảnh
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'card' }"
          @click="activeTab = 'card'"
      >
        <i class="fas fa-id-card"></i> Card & Icon
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'stats' }"
          @click="activeTab = 'stats'"
      >
        <i class="fas fa-chart-bar"></i> Thống kê
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'button' }"
          @click="activeTab = 'button'"
      >
        <i class="fas fa-mouse-pointer"></i> Nút bấm
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-palette"></i> Kiểu dáng
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Banner & Hình ảnh -->
      <div v-if="activeTab === 'banner'" class="banner-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Banner</h3>

            <div class="file-upload">
              <div class="file-upload-area" @click="triggerBannerInput" @dragover.prevent @drop.prevent="handleBannerDrop">
                <input
                    type="file"
                    ref="bannerInput"
                    @change="handleBannerUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh banner vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Kích thước đề xuất: 1920x600px</p>
              </div>

              <div v-if="bannerPreview || content.banner.imageUrl" class="upload-preview">
                <img :src="getImageUrl(content.banner.imageUrl)" alt="Banner Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewBanner" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeBanner" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!bannerPreview && !content.banner.imageUrl">
              <label for="banner-url">Hoặc nhập URL ảnh banner</label>
              <input
                  type="text"
                  id="banner-url"
                  v-model="content.banner.imageUrl"
                  placeholder="/imgs/Banner-dinh-gia.png"
              />
            </div>

            <div class="form-group">
              <label for="banner-alt">Alt text cho banner</label>
              <input
                  type="text"
                  id="banner-alt"
                  v-model="content.banner.altText"
                  placeholder="Banner định giá bất động sản"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Card & Icon -->
      <div v-if="activeTab === 'card'" class="card-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-id-card"></i> Card Thông tin</h3>

            <div class="file-upload compact">
              <label><i class="fas fa-upload"></i> Tải lên icon card</label>
              <div class="file-upload-area" @click="triggerIconInput" @dragover.prevent @drop.prevent="handleIconDrop">
                <input
                    type="file"
                    ref="iconInput"
                    @change="handleIconUpload"
                    accept="image/*,.svg"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả icon vào đây</p>
                <p class="file-hint">Chấp nhận SVG, PNG, JPG</p>
              </div>

              <div v-if="iconPreview || content.card.iconUrl" class="upload-preview">
                <img :src="getImageUrl(content.card.iconUrl)" alt="Icon Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewIcon" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeIcon" title="Xóa icon">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!iconPreview && !content.card.iconUrl">
              <label for="icon-url">URL icon card</label>
              <input
                  type="text"
                  id="icon-url"
                  v-model="content.card.iconUrl"
                  placeholder="/imgs/svg-dinh-gia.svg"
              />
            </div>

            <div class="form-group">
              <label for="icon-alt">Alt text icon</label>
              <input
                  type="text"
                  id="icon-alt"
                  v-model="content.card.iconAlt"
                  placeholder="icon định giá"
              />
            </div>

            <div class="form-group">
              <label for="card-title">Tiêu đề card</label>
              <input
                  type="text"
                  id="card-title"
                  v-model="content.card.title"
                  placeholder="Xác định giá trị bất động sản nhanh và chính xác nhất"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Thống kê -->
      <div v-if="activeTab === 'stats'" class="stats-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-chart-bar"></i> Thống kê 1</h3>

            <div class="form-group">
              <label for="stat1-number">Số</label>
              <input
                  type="text"
                  id="stat1-number"
                  v-model="content.stats[0].number"
                  placeholder="500"
              />
            </div>

            <div class="form-group">
              <label for="stat1-plusSign">Dấu cộng</label>
              <input
                  type="text"
                  id="stat1-plusSign"
                  v-model="content.stats[0].plusSign"
                  placeholder="+"
              />
            </div>

            <div class="form-group">
              <label for="stat1-label">Nhãn</label>
              <input
                  type="text"
                  id="stat1-label"
                  v-model="content.stats[0].label"
                  placeholder="Dự án"
              />
            </div>

            <div class="color-input-group">
              <label>Màu sắc</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.stats[0].color" />
                <input type="text" v-model="content.stats[0].color" placeholder="#002FFF" />
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-chart-bar"></i> Thống kê 2</h3>

            <div class="form-group">
              <label for="stat2-number">Số</label>
              <input
                  type="text"
                  id="stat2-number"
                  v-model="content.stats[1].number"
                  placeholder="5Tr"
              />
            </div>

            <div class="form-group">
              <label for="stat2-plusSign">Dấu cộng</label>
              <input
                  type="text"
                  id="stat2-plusSign"
                  v-model="content.stats[1].plusSign"
                  placeholder="+"
              />
            </div>

            <div class="form-group">
              <label for="stat2-label">Nhãn</label>
              <input
                  type="text"
                  id="stat2-label"
                  v-model="content.stats[1].label"
                  placeholder="BĐS đã xác thực"
              />
            </div>

            <div class="color-input-group">
              <label>Màu sắc</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.stats[1].color" />
                <input type="text" v-model="content.stats[1].color" placeholder="#002FFF" />
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-chart-bar"></i> Thống kê 3</h3>

            <div class="form-group">
              <label for="stat3-number">Số</label>
              <input
                  type="text"
                  id="stat3-number"
                  v-model="content.stats[2].number"
                  placeholder="2Tr"
              />
            </div>

            <div class="form-group">
              <label for="stat3-plusSign">Dấu cộng</label>
              <input
                  type="text"
                  id="stat3-plusSign"
                  v-model="content.stats[2].plusSign"
                  placeholder="+"
              />
            </div>

            <div class="form-group">
              <label for="stat3-label">Nhãn</label>
              <input
                  type="text"
                  id="stat3-label"
                  v-model="content.stats[2].label"
                  placeholder="Lượt định giá"
              />
            </div>

            <div class="color-input-group">
              <label>Màu sắc</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.stats[2].color" />
                <input type="text" v-model="content.stats[2].color" placeholder="#002FFF" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Nút bấm -->
      <div v-if="activeTab === 'button'" class="button-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm chính</h3>

            <div class="form-group">
              <label for="button-text">Văn bản nút</label>
              <input
                  type="text"
                  id="button-text"
                  v-model="content.button.text"
                  placeholder="Định giá ngay"
              />
            </div>

            <div class="form-group">
              <label for="button-link">URL liên kết</label>
              <input
                  type="text"
                  id="button-link"
                  v-model="content.button.link"
                  placeholder="/bao-cao-dinh-gia"
              />
            </div>

            <div class="form-group">
              <label for="button-icon">Icon</label>
              <IconPicker
                  v-model="content.button.icon"
              />
              <small class="form-text text-muted">Sử dụng class icon từ Font Awesome (ví dụ: fa-solid fa-paper-plane)</small>
            </div>

            <div class="color-input-group">
              <label>Màu gradient bắt đầu</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.button.gradient.start" />
                <input type="text" v-model="content.button.gradient.start" placeholder="#667eea" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu gradient giữa</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.button.gradient.middle" />
                <input type="text" v-model="content.button.gradient.middle" placeholder="#0a2463" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu gradient kết thúc</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.button.gradient.end" />
                <input type="text" v-model="content.button.gradient.end" placeholder="#0030ff" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Kiểu dáng (ĐÃ SỬA) -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Kiểu dáng Card</h3>

            <div class="form-group">
              <label for="card-background">Màu nền card (RGBA)</label>
              <div class="color-input-with-opacity">
                <input type="color" :value="getSolidColor(content.styles.cardBackground)" @input="updateColorWithOpacity('cardBackground', $event.target.value)" />
                <input
                    type="text"
                    id="card-background"
                    v-model="content.styles.cardBackground"
                    placeholder="rgba(255, 255, 255, 0.15)"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="card-blur">Độ mờ (blur)</label>
              <div class="input-with-unit">
                <input type="text" id="card-blur" v-model="content.styles.cardBlur" placeholder="10px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="border-color">Màu viền card (RGBA)</label>
              <div class="color-input-with-opacity">
                <input type="color" :value="getSolidColor(content.styles.borderColor)" @input="updateColorWithOpacity('borderColor', $event.target.value)" />
                <input
                    type="text"
                    id="border-color"
                    v-model="content.styles.borderColor"
                    placeholder="rgba(255, 255, 255, 0.2)"
                />
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-border-style"></i> Kiểu dáng Nút</h3>

            <div class="form-group">
              <label for="button-border-color">Màu viền nút (RGBA)</label>
              <div class="color-input-with-opacity">
                <input type="color" :value="getSolidColor(content.styles.buttonBorderColor)" @input="updateColorWithOpacity('buttonBorderColor', $event.target.value)" />
                <input
                    type="text"
                    id="button-border-color"
                    v-model="content.styles.buttonBorderColor"
                    placeholder="rgba(255, 255, 255, 0.6)"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="button-border-width">Độ dày viền nút</label>
              <div class="input-with-unit">
                <input type="text" id="button-border-width" v-model="content.styles.buttonBorderWidth" placeholder="4px" />
                <span class="unit">px</span>
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
const activeTab = ref('banner')
const isLoading = ref(false)

// Content structure based on JSON data
const content = reactive({
  banner: {
    imageUrl: '/imgs/Banner-dinh-gia.png',
    altText: 'Banner định giá bất động sản'
  },
  card: {
    iconUrl: '/imgs/svg-dinh-gia.svg',
    iconAlt: 'icon định giá',
    title: 'Xác định giá trị bất động sản nhanh và chính xác nhất'
  },
  stats: [
    {
      number: '500',
      plusSign: '+',
      label: 'Dự án',
      color: '#002FFF'
    },
    {
      number: '5Tr',
      plusSign: '+',
      label: 'BĐS đã xác thực',
      color: '#002FFF'
    },
    {
      number: '2Tr',
      plusSign: '+',
      label: 'Lượt định giá',
      color: '#002FFF'
    }
  ],
  button: {
    text: 'Định giá ngay',
    link: '/bao-cao-dinh-gia',
    icon: 'fa-solid fa-paper-plane',
    gradient: {
      start: '#667eea',
      middle: '#0a2463',
      end: '#0030ff'
    }
  },
  styles: {
    cardBackground: 'rgba(255, 255, 255, 0.15)',
    cardBlur: '10px',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    buttonBorderColor: 'rgba(255, 255, 255, 0.6)',
    buttonBorderWidth: '4px'
  }
})

// UI State
const bannerPreview = ref(null)
const iconPreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const bannerInput = ref(null)
const iconInput = ref(null)

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
const SECTION_ID = 28

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

// Hàm chuyển đổi RGBA sang HEX (bỏ qua opacity)
const getSolidColor = (rgbaColor) => {
  if (!rgbaColor || !rgbaColor.startsWith('rgba')) {
    // Nếu không phải RGBA, trả về chính nó hoặc màu mặc định
    return rgbaColor || '#ffffff'
  }

  try {
    // Lấy giá trị RGB từ RGBA (bỏ qua alpha)
    const match = rgbaColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match) {
      const r = parseInt(match[1])
      const g = parseInt(match[2])
      const b = parseInt(match[3])

      // Chuyển đổi sang HEX
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
  } catch (e) {
    console.error('Error converting color:', e)
  }

  return '#ffffff'
}

// Hàm cập nhật màu với opacity
const updateColorWithOpacity = (property, hexColor) => {
  if (!hexColor) return

  // Giữ nguyên opacity cũ hoặc dùng mặc định
  let opacity = 1
  const currentColor = content.styles[property]

  if (currentColor && currentColor.startsWith('rgba')) {
    const match = currentColor.match(/rgba?\([^)]+,\s*([\d.]+)\)/)
    if (match) {
      opacity = parseFloat(match[1])
    }
  }

  // Chuyển HEX sang RGB
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)

  // Tạo RGBA mới với opacity cũ
  content.styles[property] = `rgba(${r}, ${g}, ${b}, ${opacity})`
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

    // Clear previous preview
    previewRef.value = null

    // Update content
    const pathParts = contentPath.split('.')
    let target = content
    for (let i = 0; i < pathParts.length - 1; i++) {
      target = target[pathParts[i]]
    }
    target[pathParts[pathParts.length - 1]] = tempUrl

    previewRef.value = previewUrl

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

    // Prepare content data
    const contentData = { ...content }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Header',
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
      bannerPreview.value = null
      iconPreview.value = null

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

  // Check all image properties in content
  if (content.banner.imageUrl === tempUrl) {
    content.banner.imageUrl = realUrl
  }
  if (content.card.iconUrl === tempUrl) {
    content.card.iconUrl = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
// Banner
const triggerBannerInput = () => {
  bannerInput.value?.click()
}

const handleBannerUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Banner', bannerPreview, 'banner.imageUrl')
  }
  event.target.value = ''
}

const handleBannerDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Banner', bannerPreview, 'banner.imageUrl')
  }
}

const removeBanner = () => {
  if (content.banner.imageUrl) {
    handleRemoveFile(content.banner.imageUrl, 'banner.imageUrl', bannerPreview)
  }
}

// Icon
const triggerIconInput = () => {
  iconInput.value?.click()
}

const handleIconUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Icon', iconPreview, 'card.iconUrl')
  }
  event.target.value = ''
}

const handleIconDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Icon', iconPreview, 'card.iconUrl')
  }
}

const removeIcon = () => {
  if (content.card.iconUrl) {
    handleRemoveFile(content.card.iconUrl, 'card.iconUrl', iconPreview)
  }
}

const handleRemoveFile = (imageUrl, contentPath, previewRef) => {
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

    // Update content
    const pathParts = contentPath.split('.')
    let target = content
    for (let i = 0; i < pathParts.length - 1; i++) {
      target = target[pathParts[i]]
    }
    target[pathParts[pathParts.length - 1]] = ''

    previewRef.value = null

    showToast('Đã xóa ảnh', 'success')
  }
}

// ========== PREVIEW FUNCTIONS ==========
const previewBanner = () => {
  if (content.banner.imageUrl) {
    previewImageUrl.value = getImageUrl(content.banner.imageUrl)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh banner để xem trước', 'warning')
  }
}

const previewIcon = () => {
  if (content.card.iconUrl) {
    previewImageUrl.value = getImageUrl(content.card.iconUrl)
    showPreviewModal.value = true
  } else {
    showToast('Không có icon để xem trước', 'warning')
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
/* Giữ nguyên toàn bộ CSS từ component cũ */
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
  flex-wrap: wrap;
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
  white-space: nowrap;
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

/* Color Input - Cập nhật cho opacity */
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

/* Color Input with Opacity (NEW) */
.color-input-with-opacity {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-input-with-opacity input[type="color"] {
  width: 50px;
  height: 40px;
  padding: 0;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.color-input-with-opacity input[type="text"] {
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

  .color-input-with-opacity {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .color-input-with-opacity input[type="color"] {
    width: 100%;
    height: 40px;
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

  .color-input-with-opacity {
    flex-wrap: wrap;
  }
}

.form-text.text-muted {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 4px;
  display: block;
}
</style>