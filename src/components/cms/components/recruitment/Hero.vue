<template>
  <div class="hero-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Hero Section</h2>
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
        <i class="fas fa-cog"></i> Thông tin chung
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'images' }"
          @click="activeTab = 'images'"
      >
        <i class="fas fa-images"></i> Hình ảnh
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-palette"></i> Giao diện & Màu sắc
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Thông tin chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Thông tin công ty -->
          <div class="setting-section">
            <h3><i class="fas fa-building"></i> Thông tin công ty</h3>

            <div class="form-group">
              <label for="company-name">Tên công ty</label>
              <input
                  type="text"
                  id="company-name"
                  v-model="content.companyName"
                  placeholder="Thiên Hà Group"
              />
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center;">
              <label for="description">Mô tả</label>
                <AdvancedEditModal v-model="content.description"></AdvancedEditModal>
              </div>
              <div class="rich-text-editor-wrapper">
              <div style="
                        width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    background-color: white;

                  "
                  class="tiptap"
                  v-html="content.description"
              ></div>
              </div>
            </div>
          </div>

          <!-- Cài đặt container -->
          <div class="setting-section">
            <h3><i class="fas fa-square"></i> Cài đặt Container</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="max-width">Chiều rộng tối đa</label>
                <div class="input-with-unit">
                  <input type="text" id="max-width" v-model="content.container.maxWidth" placeholder="1400px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="container-padding">Padding</label>
                <input type="text" id="container-padding" v-model="content.container.padding" placeholder="0 20px"/>
              </div>
            </div>

            <div class="form-group">
              <label for="text-font-size">Kích thước chữ</label>
              <div class="input-with-unit">
                <input type="text" id="text-font-size" v-model="content.textContent.fontSize" placeholder="20px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="text-line-height">Chiều cao dòng</label>
              <input type="text" id="text-line-height" v-model="content.textContent.lineHeight" placeholder="1.6"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Hình ảnh -->
      <div v-if="activeTab === 'images'" class="images-settings">
        <div class="settings-grid">
          <!-- Logo công ty -->
          <div class="setting-section">
            <div class="form-group" v-if="!logoPreview && !content.logo.src">
              <label for="logo-url">Hoặc nhập URL logo</label>
              <input
                  type="text"
                  id="logo-url"
                  v-model="content.logo.src"
                  placeholder="/imgs/logoTHG.png"
              />
            </div>

            <div class="form-group">
              <label for="logo-alt">Alt text cho logo</label>
              <input
                  type="text"
                  id="logo-alt"
                  v-model="content.logo.alt"
                  placeholder="Thiên Hà Group Logo"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="logo-width">Chiều rộng logo container</label>
                <div class="input-with-unit">
                  <input type="text" id="logo-width" v-model="content.logoContainer.width" placeholder="900px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="logo-height">Chiều cao logo container</label>
                <div class="input-with-unit">
                  <input type="text" id="logo-height" v-model="content.logoContainer.height" placeholder="500px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="logo-border-radius">Bo góc</label>
                <div class="input-with-unit">
                  <input type="text" id="logo-border-radius" v-model="content.logoContainer.borderRadius" placeholder="10px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="logo-padding-top">Padding top</label>
                <div class="input-with-unit">
                  <input type="text" id="logo-padding-top" v-model="content.logoContainer.paddingTop" placeholder="25px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Hình ảnh Hero</h3>

            <div class="file-upload">
              <div class="file-upload-area" @click="triggerHeroInput" @dragover.prevent
                   @drop.prevent="handleHeroDrop">
                <input
                    type="file"
                    ref="heroInput"
                    @change="handleHeroUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh hero vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Kích thước đề xuất: 800x600px</p>
              </div>

              <div v-if="heroPreview || content.heroImage.src" class="upload-preview">
                <img :src="getImageUrl(content.heroImage.src)" alt="Hero Preview"/>
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewHero" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeHero" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!heroPreview && !content.heroImage.src">
              <label for="hero-url">Hoặc nhập URL ảnh hero</label>
              <input
                  type="text"
                  id="hero-url"
                  v-model="content.heroImage.src"
                  placeholder="/imgs/building-hero-section.png"
              />
            </div>

            <div class="form-group">
              <label for="hero-alt">Alt text cho ảnh hero</label>
              <input
                  type="text"
                  id="hero-alt"
                  v-model="content.heroImage.alt"
                  placeholder="Thiên Hà Group"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="hero-max-width">Chiều rộng tối đa</label>
                <div class="input-with-unit">
                  <input type="text" id="hero-max-width" v-model="content.heroImageStyle.maxWidth" placeholder="400px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="hero-height">Chiều cao</label>
                <div class="input-with-unit">
                  <input type="text" id="hero-height" v-model="content.heroImageStyle.height" placeholder="700px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Giao diện & Màu sắc -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Màu sắc chính -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu sắc chính</h3>

            <div class="color-input-group">
              <label>Màu chính (Primary)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.primary"/>
                <input type="text" v-model="content.colors.primary" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu phụ (Secondary)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.secondary"/>
                <input type="text" v-model="content.colors.secondary" placeholder="#0827AF"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu trắng (White)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.white"/>
                <input type="text" v-model="content.colors.white" placeholder="#FFFFFF"/>
              </div>
            </div>
          </div>

          <!-- Cài đặt text container -->
          <div class="setting-section">
            <h3><i class="fas fa-border-style"></i> Text Container</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="text-margin-left">Margin left</label>
                <div class="input-with-unit">
                  <input type="text" id="text-margin-left" v-model="content.textContainer.marginLeft" placeholder="200px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="text-padding-right">Padding right</label>
                <div class="input-with-unit">
                  <input type="text" id="text-padding-right" v-model="content.textContainer.paddingRight" placeholder="320px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="text-transform">Transform</label>
              <input type="text" id="text-transform" v-model="content.textContainer.transform" placeholder="translateY(-150px)"/>
            </div>

            <div class="form-group">
              <label for="text-border-radius">Bo góc</label>
              <div class="input-with-unit">
                <input type="text" id="text-border-radius" v-model="content.textContainer.borderRadius" placeholder="10px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="text-box-shadow">Đổ bóng</label>
              <div class="color-input">
                <input type="color" v-model="shadowColor.hex" @input="updateShadowFromColor()"/>
                <input
                    type="text"
                    id="text-box-shadow"
                    v-model="content.textContainer.boxShadow"
                    placeholder="0 4px 20px rgba(0, 0, 0, 0.15)"
                    @input="updateColorFromShadow()"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="text-padding">Padding nội dung</label>
              <input type="text" id="text-padding" v-model="content.textContent.padding" placeholder="40px"/>
            </div>
          </div>

          <!-- Breakpoints -->
          <div class="setting-section">
            <h3><i class="fas fa-desktop"></i> Breakpoints</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="desktop-breakpoint">Desktop</label>
                <div class="input-with-unit">
                  <input type="text" id="desktop-breakpoint" v-model="content.breakpoints.desktop" placeholder="1200px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="tablet-breakpoint">Tablet</label>
                <div class="input-with-unit">
                  <input type="text" id="tablet-breakpoint" v-model="content.breakpoints.tablet" placeholder="800px"/>
                  <span class="unit">px</span>
                </div>
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
          <h3>Xem trước hình ảnh</h3>
          <button class="btn-icon btn-close-modal" @click="closePreviewModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="previewImageUrl" alt="Xem trước" v-if="previewImageUrl"/>
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
import {ref, reactive, onMounted} from 'vue'
import api from '../../../../api/api.js'
import {baseImgaeUrl} from "../../../../assets/js/global.js";
import RichTextEditor from "../../../RichTextEditor/RichTextEditor.vue";
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Shadow color state
const shadowColor = reactive({
  hex: '#000000',
  opacity: 0.15,
  rgba: 'rgba(0, 0, 0, 0.15)'
})

// Content structure based on Hero JSON data
const content = reactive({
  logo: {
    src: '/imgs/logoTHG.png',
    alt: 'Thiên Hà Group Logo'
  },
  companyName: 'Thiên Hà Group',
  description: 'tự hào là đơn vị hoạt động trong lĩnh vực mua — bán — đầu tư bất động sản với bề dày kinh nghiệm và phương châm "Bất Động Sản Thật — Giá Trị Thật". Chúng tôi nổi bật với giải pháp bán gấp bất động sản siêu tốc và cam kết tối ưu hoá giá trị cho khách hàng, góp phần tạo ra hàng nghìn giao dịch thành công. Nếu ông là người năng động, thích môi trường mục tiêu rõ ràng và muốn cùng đội ngũ hiện thực hoá những giao dịch lớn — hãy gia nhập Thiên Hà Group ngay hôm nay; chúng tôi có chế độ đãi ngộ cạnh tranh, lộ trình thăng tiến rõ ràng và phúc lợi theo quy định.',
  heroImage: {
    src: '/imgs/building-hero-section.png',
    alt: 'Thiên Hà Group'
  },
  colors: {
    primary: '#031358',
    secondary: '#0827AF',
    white: '#FFFFFF'
  },
  container: {
    maxWidth: '1400px',
    padding: '0 20px'
  },
  logoContainer: {
    width: '900px',
    height: '500px',
    borderRadius: '10px',
    paddingTop: '25px'
  },
  textContainer: {
    marginLeft: '200px',
    paddingRight: '320px',
    transform: 'translateY(-150px)',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  },
  textContent: {
    fontSize: '20px',
    padding: '40px',
    lineHeight: '1.6'
  },
  heroImageStyle: {
    maxWidth: '400px',
    height: '700px'
  },
  breakpoints: {
    desktop: '1200px',
    tablet: '800px'
  }
})

// UI State
const logoPreview = ref(null)
const heroPreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const logoInput = ref(null)
const heroInput = ref(null)

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
const SECTION_ID = 37

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

const handleFileUpload = (file, type, previewRef, contentPath, altPath = null) => {
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

    // Update content path
    const pathParts = contentPath.split('.')
    let target = content
    for (let i = 0; i < pathParts.length - 1; i++) {
      target = target[pathParts[i]]
    }
    target[pathParts[pathParts.length - 1]] = tempUrl

    // Update alt text if path provided
    if (altPath) {
      const altParts = altPath.split('.')
      let altTarget = content
      for (let i = 0; i < altParts.length - 1; i++) {
        altTarget = altTarget[altParts[i]]
      }
      altTarget[altParts[altParts.length - 1]] = file.name.split('.')[0]
    }

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

// ========== SHADOW FUNCTIONS ==========
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};

const parseShadowColor = (shadowStr) => {
  if (!shadowStr) return {hex: '#000000', opacity: 0.15, rgba: 'rgba(0, 0, 0, 0.15)'};

  const rgbaMatch = shadowStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 0.15;

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    return {hex, opacity, rgba};
  }

  return {hex: '#000000', opacity: 0.15, rgba: 'rgba(0, 0, 0, 0.15)'};
};

const updateShadowFromColor = () => {
  const shadowRegex = /([\d.-]+(?:px|em|rem|%)\s+){3,4}/;
  const match = content.textContainer.boxShadow.match(shadowRegex);

  if (match) {
    const rgb = hexToRgb(shadowColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowColor.opacity})`;
    content.textContainer.boxShadow = `${match[0].trim()} ${newRgba}`;
    shadowColor.rgba = newRgba;
  } else {
    const rgb = hexToRgb(shadowColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowColor.opacity})`;
    content.textContainer.boxShadow = `0 4px 20px ${newRgba}`;
    shadowColor.rgba = newRgba;
  }
};

const updateColorFromShadow = () => {
  const parsed = parseShadowColor(content.textContainer.boxShadow);
  shadowColor.hex = parsed.hex;
  shadowColor.opacity = parsed.opacity;
  shadowColor.rgba = parsed.rgba;
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

      // Initialize shadow color
      const shadowColors = parseShadowColor(content.textContainer.boxShadow);
      shadowColor.hex = shadowColors.hex;
      shadowColor.opacity = shadowColors.opacity;
      shadowColor.rgba = shadowColors.rgba;

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
      name: 'Hero Section',
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
      logoPreview.value = null
      heroPreview.value = null

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

  // Update logo URL
  if (content.logo.src === tempUrl) {
    content.logo.src = realUrl
  }

  // Update hero image URL
  if (content.heroImage.src === tempUrl) {
    content.heroImage.src = realUrl
  }
}

// ========== LOGO UPLOAD HANDLERS ==========
const triggerLogoInput = () => {
  logoInput.value?.click()
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Logo', logoPreview, 'logo.src', 'logo.alt')
  }
  event.target.value = ''
}

const handleLogoDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Logo', logoPreview, 'logo.src', 'logo.alt')
  }
}

const removeLogo = () => {
  if (content.logo.src) {
    handleRemoveFile(content.logo.src, 'logo.src', logoPreview, 'logo.alt')
  }
}

// ========== HERO IMAGE UPLOAD HANDLERS ==========
const triggerHeroInput = () => {
  heroInput.value?.click()
}

const handleHeroUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Hero Image', heroPreview, 'heroImage.src', 'heroImage.alt')
  }
  event.target.value = ''
}

const handleHeroDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Hero Image', heroPreview, 'heroImage.src', 'heroImage.alt')
  }
}

const removeHero = () => {
  if (content.heroImage.src) {
    handleRemoveFile(content.heroImage.src, 'heroImage.src', heroPreview, 'heroImage.alt')
  }
}

const handleRemoveFile = (imageUrl, contentPath, previewRef, altPath = null) => {
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

    // Update content path
    const pathParts = contentPath.split('.')
    let target = content
    for (let i = 0; i < pathParts.length - 1; i++) {
      target = target[pathParts[i]]
    }
    target[pathParts[pathParts.length - 1]] = ''

    // Update alt text if path provided
    if (altPath) {
      const altParts = altPath.split('.')
      let altTarget = content
      for (let i = 0; i < altParts.length - 1; i++) {
        altTarget = altTarget[altParts[i]]
      }
      altTarget[altParts[altParts.length - 1]] = ''
    }

    previewRef.value = null

    showToast('Đã xóa ảnh', 'success')
  }
}

// ========== PREVIEW FUNCTIONS ==========
const previewLogo = () => {
  if (content.logo.src) {
    previewImageUrl.value = getImageUrl(content.logo.src)
    showPreviewModal.value = true
  } else {
    showToast('Không có logo để xem trước', 'warning')
  }
}

const previewHero = () => {
  if (content.heroImage.src) {
    previewImageUrl.value = getImageUrl(content.heroImage.src)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh hero để xem trước', 'warning')
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
/* Giữ nguyên toàn bộ CSS từ file gốc */
.hero-editor {
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

/* File Upload */
.file-upload {
  margin-bottom: 20px;
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