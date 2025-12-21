<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Cơ hội Việc làm</h2>
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
          :class="{ active: activeTab === 'positions' }"
          @click="activeTab = 'positions'"
      >
        <i class="fas fa-briefcase"></i> Vị trí tuyển dụng
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
          <!-- Thông tin tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề & Nút bấm</h3>

            <div class="form-group">
              <label for="main-title">Tiêu đề chính</label>
              <input
                  type="text"
                  id="main-title"
                  v-model="content.title"
                  placeholder="CƠ HỘI VIỆC LÀM"
              />
            </div>

            <div class="form-group">
              <label for="apply-button-text">Nút "Ứng tuyển"</label>
              <input
                  type="text"
                  id="apply-button-text"
                  v-model="content.applyButtonText"
                  placeholder="ỨNG TUYỂN NGAY"
              />
            </div>

            <div class="form-group">
              <label for="detail-button-text">Nút "Chi tiết"</label>
              <input
                  type="text"
                  id="detail-button-text"
                  v-model="content.detailButtonText"
                  placeholder="XEM CHI TIẾT"
              />
            </div>
          </div>

          <!-- Hình ảnh nền -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Hình ảnh nền</h3>

            <div class="file-upload">
              <div class="file-upload-area" @click="triggerImageInput" @dragover.prevent
                   @drop.prevent="handleImageDrop">
                <input
                    type="file"
                    ref="imageInput"
                    @change="handleImageUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Kích thước đề xuất: 1200x600px</p>
              </div>

              <div v-if="imagePreview || content.imageUrl" class="upload-preview">
                <img :src="getImageUrl(content.imageUrl)" alt="Preview"/>
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewImage" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeImage" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!imagePreview && !content.imageUrl">
              <label for="image-url">Hoặc nhập URL ảnh</label>
              <input
                  type="text"
                  id="image-url"
                  v-model="content.imageUrl"
                  placeholder="/imgs/coi-hoi-viec-lam.png"
              />
            </div>

            <div class="form-group">
              <label for="image-alt">Alt text cho ảnh</label>
              <input
                  type="text"
                  id="image-alt"
                  v-model="content.imageAlt"
                  placeholder="Cơ hội việc làm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Vị trí tuyển dụng -->
      <div v-if="activeTab === 'positions'" class="positions-settings">
        <div class="positions-header">
          <h3><i class="fas fa-briefcase"></i> Quản lý vị trí tuyển dụng</h3>
          <button class="btn btn-primary" @click="addPosition">
            <i class="fas fa-plus"></i> Thêm vị trí mới
          </button>
        </div>

        <div class="positions-list">
          <div
              v-for="(position, index) in content.positions"
              :key="index"
              class="position-item"
          >
            <div class="position-content">
              <div class="position-number">
                {{ index + 1 }}
              </div>

              <div class="position-inputs">
                <div class="position-input-group">
                  <label>Tên vị trí</label>
                  <input
                      type="text"
                      class="position-input"
                      v-model="position.title"
                      :placeholder="'Vị trí ' + (index + 1)"
                  />
                </div>

                <div class="position-input-group">
                  <label>Link URL</label>
                  <input
                      type="text"
                      class="position-input"
                      v-model="position.link"
                      placeholder="https://example.com/vitri"
                  />
                </div>
              </div>

              <div class="position-actions">
                <button class="btn-icon" @click="movePositionUp(index)" :disabled="index === 0" title="Di chuyển lên">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click="movePositionDown(index)"
                        :disabled="index === content.positions.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-delete" @click="removePosition(index)" title="Xóa vị trí">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Giao diện & Màu sắc -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Màu sắc cơ bản -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu sắc cơ bản</h3>

            <div class="color-input-group">
              <label>Màu chính (Primary)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.primaryColor"/>
                <input type="text" v-model="content.primaryColor" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu phụ (Secondary)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.secondaryColor"/>
                <input type="text" v-model="content.secondaryColor" placeholder="#0827AF"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu nền (Background)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.backgroundColor"/>
                <input type="text" v-model="content.backgroundColor" placeholder="#ffffff"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ nút bấm</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.buttonTextColor"/>
                <input type="text" v-model="content.buttonTextColor" placeholder="#ffffff"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Gradient nút bấm</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.button.color1" @change="updateButtonGradient()"/>
                <input type="color" v-model="gradientColors.button.color2" @change="updateButtonGradient()"/>
                <input
                    type="text"
                    v-model="content.buttonGradient"
                    placeholder="linear-gradient(135deg, #031358, #0827AF)"
                    @input="updateButtonColorsFromGradient()"
                />
              </div>
            </div>
          </div>

          <!-- Kích thước & Khoảng cách -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Kích thước & Khoảng cách</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="title-font-size">Cỡ chữ tiêu đề</label>
                <div class="input-with-unit">
                  <input type="text" id="title-font-size" v-model="content.titleFontSize" placeholder="40px"/>
                  <span class="unit">px</span>
                </div>
              </div>

              <div class="form-group">
                <label for="position-font-size">Cỡ chữ vị trí</label>
                <div class="input-with-unit">
                  <input type="text" id="position-font-size" v-model="content.positionFontSize" placeholder="20px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="button-font-size">Cỡ chữ nút bấm</label>
                <div class="input-with-unit">
                  <input type="text" id="button-font-size" v-model="content.buttonFontSize" placeholder="14px"/>
                  <span class="unit">px</span>
                </div>
              </div>

              <div class="form-group">
                <label for="container-height">Chiều cao container</label>
                <div class="input-with-unit">
                  <input type="text" id="container-height" v-model="content.containerHeight" placeholder="600px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="position-spacing">Khoảng cách vị trí</label>
              <div class="input-with-unit">
                <input type="number" id="position-spacing" v-model.number="content.positionSpacing" placeholder="80"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Padding & Border Radius -->
          <div class="setting-section">
            <h3><i class="fas fa-square"></i> Padding & Border Radius</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="position-padding">Padding vị trí</label>
                <input type="text" id="position-padding" v-model="content.positionPadding" placeholder="25px"/>
              </div>

              <div class="form-group">
                <label for="button-padding">Padding nút bấm</label>
                <input type="text" id="button-padding" v-model="content.buttonPadding" placeholder="12px 18px"/>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="position-border-radius">Border radius vị trí</label>
                <input type="text" id="position-border-radius" v-model="content.positionBorderRadius" placeholder="20px 0 0 0"/>
              </div>

              <div class="form-group">
                <label for="button-border-radius">Border radius nút</label>
                <input type="text" id="button-border-radius" v-model="content.buttonBorderRadius" placeholder="6px"/>
              </div>
            </div>

            <div class="form-group">
              <label for="button-gap">Khoảng cách giữa các nút</label>
              <input type="text" id="button-gap" v-model="content.buttonGap" placeholder="12px"/>
            </div>
          </div>

          <!-- Shadow & Effects -->
          <div class="setting-section">
            <h3><i class="fas fa-box-shadow"></i> Hiệu ứng đổ bóng</h3>

            <div class="form-group">
              <label for="container-shadow">Bóng container</label>
              <div class="color-input">
                <input type="color" v-model="shadowColors.container.hex" @input="updateContainerShadowFromColor()"/>
                <input
                    type="text"
                    id="container-shadow"
                    v-model="content.containerShadow"
                    placeholder="0 5px 15px rgba(0, 0, 0, 0.1)"
                    @input="updateContainerColorFromShadow()"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="position-shadow">Bóng vị trí</label>
              <div class="color-input">
                <input type="color" v-model="shadowColors.position.hex" @input="updatePositionShadowFromColor()"/>
                <input
                    type="text"
                    id="position-shadow"
                    v-model="content.positionShadow"
                    placeholder="0 -2px 10px rgba(0, 0, 0, 0.1)"
                    @input="updatePositionColorFromShadow()"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="button-shadow">Bóng nút bấm</label>
              <div class="color-input">
                <input type="color" v-model="shadowColors.button.hex" @input="updateButtonShadowFromColor()"/>
                <input
                    type="text"
                    id="button-shadow"
                    v-model="content.buttonShadow"
                    placeholder="0 4px 12px rgba(3, 19, 88, 0.3)"
                    @input="updateButtonColorFromShadow()"
                />
              </div>
            </div>
          </div>

          <!-- Transitions -->
          <div class="setting-section">
            <h3><i class="fas fa-exchange-alt"></i> Hiệu ứng chuyển động</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="position-transition">Transition vị trí</label>
                <input type="text" id="position-transition" v-model="content.positionTransition" placeholder="all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"/>
              </div>

              <div class="form-group">
                <label for="button-transition">Transition nút bấm</label>
                <input type="text" id="button-transition" v-model="content.buttonTransition" placeholder="all 0.3s ease"/>
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

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Gradient colors state
const gradientColors = reactive({
  button: {
    color1: '#031358',
    color2: '#0827AF'
  }
})

// Shadow colors state
const shadowColors = reactive({
  container: {
    hex: '#000000',
    opacity: 0.1,
    rgba: 'rgba(0, 0, 0, 0.1)'
  },
  position: {
    hex: '#000000',
    opacity: 0.1,
    rgba: 'rgba(0, 0, 0, 0.1)'
  },
  button: {
    hex: '#031358',
    opacity: 0.3,
    rgba: 'rgba(3, 19, 88, 0.3)'
  }
})

// Content structure based on new JSON data
const content = reactive({
  title: 'CƠ HỘI VIỆC LÀM',
  applyButtonText: 'ỨNG TUYỂN NGAY',
  detailButtonText: 'XEM CHI TIẾT',
  imageUrl: '/imgs/coi-hoi-viec-lam.png',
  imageAlt: 'Cơ hội việc làm',
  positions: [
    {
      title: 'Nhân viên telesale',
      link: ''
    },
    {
      title: 'Nhân viên văn phòng',
      link: ''
    },
    {
      title: 'Chuyên viên tư vấn',
      link: ''
    },
    {
      title: 'Chuyên viên định giá BĐS',
      link: ''
    },
    {
      title: 'Nhân viên khảo sát thị trường',
      link: ''
    },
    {
      title: 'Môi giới bất động sản',
      link: ''
    },
    {
      title: 'Cộng tác viên THG',
      link: ''
    }
  ],
  primaryColor: '#031358',
  secondaryColor: '#0827AF',
  backgroundColor: '#ffffff',
  buttonTextColor: '#ffffff',
  buttonGradient: 'linear-gradient(135deg, #031358, #0827AF)',
  titleFontSize: '40px',
  positionFontSize: '20px',
  buttonFontSize: '14px',
  containerHeight: '600px',
  positionSpacing: 80,
  positionPadding: '25px',
  buttonPadding: '12px 18px',
  buttonGap: '12px',
  positionBorderRadius: '20px 0 0 0',
  buttonBorderRadius: '6px',
  containerShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  positionShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
  buttonShadow: '0 4px 12px rgba(3, 19, 88, 0.3)',
  positionTransition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  buttonTransition: 'all 0.3s ease',
  responsiveBreakpoints: {
    tablet: '1024px',
    mobile: '768px',
    smallMobile: '441px'
  }
})

// UI State
const imagePreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const imageInput = ref(null)

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
const SECTION_ID = 39

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

// ========== URL VALIDATION ==========
const validateUrl = (url) => {
  if (!url) return true; // Cho phép để trống

  try {
    // Kiểm tra URL hợp lệ
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ========== GRADIENT FUNCTIONS ==========
const parseGradientColors = (gradientStr) => {
  if (!gradientStr) return {color1: '#031358', color2: '#0827AF'};

  const matches = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (matches && matches.length >= 2) {
    return {color1: matches[0], color2: matches[1]};
  }
  return {color1: '#031358', color2: '#0827AF'};
};

const updateButtonGradient = () => {
  content.buttonGradient = `linear-gradient(135deg, ${gradientColors.button.color1}, ${gradientColors.button.color2})`;
};

const updateButtonColorsFromGradient = () => {
  const colors = parseGradientColors(content.buttonGradient);
  gradientColors.button.color1 = colors.color1;
  gradientColors.button.color2 = colors.color2;
};

// ========== SHADOW FUNCTIONS ==========
const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex color
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};

const parseShadowColor = (shadowStr, defaultHex = '#000000', defaultOpacity = 0.1) => {
  if (!shadowStr) return {hex: defaultHex, opacity: defaultOpacity, rgba: `rgba(${defaultHex === '#000000' ? '0, 0, 0' : '3, 19, 88'}, ${defaultOpacity})`};

  // Tìm màu rgba trong shadow string
  const rgbaMatch = shadowStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : defaultOpacity;

    // Convert RGB to hex
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    return {hex, opacity, rgba};
  }

  return {hex: defaultHex, opacity: defaultOpacity, rgba: `rgba(${defaultHex === '#000000' ? '0, 0, 0' : '3, 19, 88'}, ${defaultOpacity})`};
};

const updateShadowFromColor = (shadowType) => {
  const shadowObj = shadowColors[shadowType];

  // Extract shadow values from current shadow string
  const shadowRegex = /([\d.-]+px\s+){3,4}/;
  const match = content[`${shadowType}Shadow`].match(shadowRegex);

  if (match) {
    // Parse RGB from hex
    const rgb = hexToRgb(shadowObj.hex);
    // Create new rgba string
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowObj.opacity})`;
    // Keep the shadow values and update the color
    content[`${shadowType}Shadow`] = `${match[0].trim()} ${newRgba}`;
    // Update rgba in shadowColor object
    shadowObj.rgba = newRgba;
  } else {
    // Default shadow values based on type
    const defaultValues = {
      container: '0 5px 15px',
      position: '0 -2px 10px',
      button: '0 4px 12px'
    };

    const rgb = hexToRgb(shadowObj.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowObj.opacity})`;
    content[`${shadowType}Shadow`] = `${defaultValues[shadowType]} ${newRgba}`;
    shadowObj.rgba = newRgba;
  }
};

const updateColorFromShadow = (shadowType, defaultHex = '#000000', defaultOpacity = 0.1) => {
  const shadowObj = shadowColors[shadowType];
  const parsed = parseShadowColor(content[`${shadowType}Shadow`], defaultHex, defaultOpacity);
  shadowObj.hex = parsed.hex;
  shadowObj.opacity = parsed.opacity;
  shadowObj.rgba = parsed.rgba;
};

// Wrapper functions for each shadow type
const updateContainerShadowFromColor = () => updateShadowFromColor('container');
const updateContainerColorFromShadow = () => updateColorFromShadow('container', '#000000', 0.1);

const updatePositionShadowFromColor = () => updateShadowFromColor('position');
const updatePositionColorFromShadow = () => updateColorFromShadow('position', '#000000', 0.1);

const updateButtonShadowFromColor = () => updateShadowFromColor('button');
const updateButtonColorFromShadow = () => updateColorFromShadow('button', '#031358', 0.3);

// ========== POSITION MANAGEMENT ==========
const addPosition = () => {
  content.positions.push({
    title: 'Vị trí mới',
    link: ''
  })
  showToast('Đã thêm vị trí mới', 'success')
}

const removePosition = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa vị trí này?')) {
    content.positions.splice(index, 1)
    showToast('Đã xóa vị trí', 'success')
  }
}

const movePositionUp = (index) => {
  if (index > 0) {
    const temp = content.positions[index]
    content.positions[index] = content.positions[index - 1]
    content.positions[index - 1] = temp
  }
}

const movePositionDown = (index) => {
  if (index < content.positions.length - 1) {
    const temp = content.positions[index]
    content.positions[index] = content.positions[index + 1]
    content.positions[index + 1] = temp
  }
}

// Hàm xử lý khi load data từ API để chuyển đổi từ array đơn giản sang object có link
const transformPositionsData = (data) => {
  // Nếu positions là array của strings, chuyển thành objects
  if (Array.isArray(data.positions) && data.positions.length > 0) {
    if (typeof data.positions[0] === 'string') {
      data.positions = data.positions.map(title => ({
        title: title,
        link: ''
      }))
    }
  } else {
    data.positions = []
  }
  return data
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

      // Transform positions data if needed
      const transformedData = transformPositionsData(data)

      // Update content with loaded data
      Object.assign(content, transformedData)

      // Initialize gradient colors
      const buttonColors = parseGradientColors(content.buttonGradient);
      gradientColors.button.color1 = buttonColors.color1;
      gradientColors.button.color2 = buttonColors.color2;

      // Initialize shadow colors
      updateContainerColorFromShadow();
      updatePositionColorFromShadow();
      updateButtonColorFromShadow();

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

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Cơ hội việc làm',
      contentJson: JSON.stringify(content, null, 2),
      sortOrder: 3,
      files: files.value.filter(file => file.status !== 'EXISTING')
    }

    // Prepare FormData
    const formData = new FormData()

    // Add section data
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }))

    // Add actual file binaries for NEW files
    const newFiles = files.value.filter(file => file.status === 'NEW')

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
      imagePreview.value = null
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

  // Check imageUrl property in content
  if (content.imageUrl === tempUrl) {
    content.imageUrl = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
const triggerImageInput = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh nền', imagePreview, 'imageUrl')
  }
  event.target.value = ''
}

const handleImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh nền', imagePreview, 'imageUrl')
  }
}

const removeImage = () => {
  if (content.imageUrl) {
    handleRemoveFile(content.imageUrl, 'imageUrl', imagePreview)
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
const previewImage = () => {
  if (content.imageUrl) {
    previewImageUrl.value = getImageUrl(content.imageUrl)
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

  .steps-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .step-header {
    flex-wrap: wrap;
  }

  .step-actions {
    margin-left: auto;
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

  .step-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .step-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
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

/* Shadow Color */
.shadow-color-input {
  margin-bottom: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gradient-colors {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

/* Thêm một số styles đặc thù cho positions */
.positions-settings {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.positions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.positions-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.positions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.position-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 10px;
  transition: all 0.3s ease;
}

.position-item:hover {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
}

.position-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.position-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.position-inputs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.position-input-group {
  width: 100%;
}

.position-input-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
}

.position-input-group .position-input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
}

.position-input-group .position-input:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.url-warning {
  margin-top: 5px;
  font-size: 0.75rem;
  color: #dc3545;
  display: flex;
  align-items: center;
  gap: 5px;
}

.url-warning i {
  font-size: 0.8rem;
}

.position-actions {
  display: flex;
  gap: 5px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .position-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .position-inputs {
    width: 100%;
  }

  .position-actions {
    align-self: flex-end;
  }
}
</style>