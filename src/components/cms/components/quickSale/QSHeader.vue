<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Header QuickSale</h2>
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
          :class="{ active: activeTab === 'header' }"
          @click="activeTab = 'header'"
      >
        <i class="fas fa-image"></i> Header & Background
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'bubbles' }"
          @click="activeTab = 'bubbles'"
      >
        <i class="fas fa-bubbles"></i> Bubbles Animation
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'content' }"
          @click="activeTab = 'content'"
      >
        <i class="fas fa-cogs"></i> Nội dung & Giao diện
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Header & Background -->
      <div v-if="activeTab === 'header'" class="header-settings">
        <div class="settings-grid">
          <!-- Header Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-header"></i> Cài đặt Header</h3>

            <!-- Background Image -->
            <div class="file-upload">
              <label>Ảnh nền Header</label>
              <div class="file-upload-area" @click="triggerBackgroundInput" @dragover.prevent
                   @drop.prevent="handleBackgroundDrop">
                <input
                    type="file"
                    ref="backgroundInput"
                    @change="handleBackgroundUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Kích thước đề xuất: 1920x600px (landscape)</p>
              </div>

              <div v-if="backgroundPreview || content.header.backgroundImage" class="upload-preview">
                <img :src="getImageUrl(content.header.backgroundImage)" alt="Background Preview"/>
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewBackground" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeBackground" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!backgroundPreview && !content.header.backgroundImage">
              <label for="background-url">Hoặc nhập URL ảnh nền</label>
              <input
                  type="text"
                  id="background-url"
                  v-model="content.header.backgroundImage"
                  placeholder="BannerQS.jpg"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="min-height">Chiều cao tối thiểu (Desktop)</label>
                <div class="input-with-unit">
                  <input type="text" id="min-height" v-model="content.header.minHeight" placeholder="600px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="mobile-min-height">Chiều cao tối thiểu (Mobile)</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-min-height" v-model="content.header.mobileMinHeight"
                         placeholder="500px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Card Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-id-card"></i> Thẻ thông tin bên phải</h3>

            <!-- Card Image -->
            <div class="file-upload">
              <label>Ảnh trong thẻ</label>
              <div class="file-upload-area" @click="triggerCardImageInput" @dragover.prevent
                   @drop.prevent="handleCardImageDrop">
                <input
                    type="file"
                    ref="cardImageInput"
                    @change="handleCardImageUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
              </div>

              <div v-if="cardImagePreview || content.rightCard.image" class="upload-preview">
                <img :src="getImageUrl(content.rightCard.image)" alt="Card Image Preview"/>
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewCardImage" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeCardImage" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!cardImagePreview && !content.rightCard.image">
              <label for="card-image-url">URL ảnh thẻ</label>
              <input
                  type="text"
                  id="card-image-url"
                  v-model="content.rightCard.image"
                  placeholder="quick-sale.svg"
              />
            </div>

            <div class="form-group">
              <label for="card-alt-text">Alt text cho ảnh</label>
              <input
                  type="text"
                  id="card-alt-text"
                  v-model="content.rightCard.altText"
                  placeholder="Quick Sale"
              />
            </div>

            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label for="card-content">Nội dung thẻ</label>
                <AdvancedEditModal
                    v-model="content.rightCard.content"
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
                <div class="tiptap" v-html="content.rightCard.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Bubbles Animation -->
      <div v-if="activeTab === 'bubbles'" class="bubbles-settings">
        <div class="settings-grid">
          <!-- Bubbles Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-bubbles"></i> Cài đặt hiệu ứng Bubbles</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="bubbles-count">Số lượng bubbles</label>
                <input
                    type="number"
                    id="bubbles-count"
                    v-model.number="content.bubbles.count"
                    min="10"
                    max="100"
                />
              </div>
              <div class="form-group">
                <label for="bubble-animation">Kiểu animation</label>
                <select id="bubble-animation" v-model="content.animations.bubbleAnimation">
                  <option value="floatUp">Float Up (nổi lên)</option>
                  <option value="floatDown">Float Down (chìm xuống)</option>
                  <option value="floatLeft">Float Left (trôi sang trái)</option>
                  <option value="floatRight">Float Right (trôi sang phải)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="min-size">Kích thước nhỏ nhất</label>
                <div class="input-with-unit">
                  <input type="number" id="min-size" v-model.number="content.bubbles.minSize" min="1" max="50"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="max-size">Kích thước lớn nhất</label>
                <div class="input-with-unit">
                  <input type="number" id="max-size" v-model.number="content.bubbles.maxSize" min="10" max="100"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="min-opacity">Độ mờ tối thiểu</label>
                <input
                    type="number"
                    id="min-opacity"
                    v-model.number="content.bubbles.minOpacity"
                    min="0.1"
                    max="1"
                    step="0.1"
                />
              </div>
              <div class="form-group">
                <label for="max-opacity">Độ mờ tối đa</label>
                <input
                    type="number"
                    id="max-opacity"
                    v-model.number="content.bubbles.maxOpacity"
                    min="0.1"
                    max="1"
                    step="0.1"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="base-duration">Thời gian cơ bản</label>
                <div class="input-with-unit">
                  <input type="number" id="base-duration" v-model.number="content.bubbles.baseDuration" min="5"
                         max="30"/>
                  <span class="unit">giây</span>
                </div>
              </div>
              <div class="form-group">
                <label for="duration-variation">Biến thiên thời gian</label>
                <div class="input-with-unit">
                  <input type="number" id="duration-variation" v-model.number="content.bubbles.durationVariation"
                         min="0" max="30"/>
                  <span class="unit">giây</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="max-delay">Độ trễ tối đa</label>
              <div class="input-with-unit">
                <input type="number" id="max-delay" v-model.number="content.bubbles.maxDelay" min="0" max="30"/>
                <span class="unit">giây</span>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu cơ bản bubbles (RGB)</label>
              <div class="color-input form-group">
                <input type="color" v-model="rgbColor" @input="updateBubbleColor"/>
                <input type="text" v-model="content.bubbles.baseColor" placeholder="10, 36, 99"/>
                <small class="hint-text">Định dạng: R, G, B (không có dấu ngoặc)</small>
              </div>
            </div>
          </div>

          <!-- Animations Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-play-circle"></i> Cài đặt Animation</h3>

            <div class="form-group">
              <label for="transition-speed">Tốc độ chuyển đổi</label>
              <div class="input-with-unit">
                <input type="text" id="transition-speed" v-model="content.animations.transitionSpeed"
                       placeholder="0.3s"/>
                <span class="unit">giây</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Nội dung & Giao diện -->
      <div v-if="activeTab === 'content'" class="content-settings">
        <div class="settings-grid">
          <!-- Tabs Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-tasks"></i> Tabs điều hướng</h3>

            <div class="form-group">
              <label>Danh sách tabs</label>
              <div class="array-items">
                <div v-for="(tab, index) in content.tabs" :key="index" class="array-item">
                  <div class="array-item-content">
                    <div class="form-row">
                      <div class="form-group">
                        <label>ID tab</label>
                        <input type="text" v-model="tab.id" placeholder="dinhgia"/>
                      </div>
                      <div class="form-group">
                        <label>Nhãn tab</label>
                        <input type="text" v-model="tab.label" placeholder="Định giá"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="tab.active"/>
                        <span class="checkmark"></span>
                        Tab mặc định (active)
                      </label>
                    </div>
                  </div>
                  <div class="array-item-actions">
                    <button class="btn-icon" @click="removeTab(index)" title="Xóa tab">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Property Types Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-building"></i> Loại bất động sản</h3>

            <div class="form-group">
              <label>Danh sách loại BĐS</label>
              <div class="array-items">
                <div v-for="(type, index) in content.propertyTypes" :key="index" class="array-item">
                  <div class="array-item-content">
                    <div class="form-row">
                      <div class="form-group">
                        <label>Giá trị</label>
                        <input type="text" v-model="type.value" placeholder="all"/>
                      </div>
                      <div class="form-group">
                        <label>Nhãn hiển thị</label>
                        <input type="text" v-model="type.label" placeholder="Tất cả"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="type.default"/>
                        <span class="checkmark"></span>
                        Mặc định chọn
                      </label>
                    </div>
                  </div>
                  <div class="array-item-actions">
                    <button class="btn-icon" @click="removePropertyType(index)" title="Xóa loại BĐS">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              <button class="btn btn-secondary" @click="addPropertyType">
                <i class="fas fa-plus"></i> Thêm loại BĐS mới
              </button>
            </div>
          </div>

          <!-- Search Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-search"></i> Tìm kiếm</h3>

            <div class="form-group">
              <label for="search-placeholder">Placeholder</label>
              <input
                  type="text"
                  id="search-placeholder"
                  v-model="content.search.placeholder"
                  placeholder="Nhập thông tin"
              />
            </div>

            <div class="form-group">
              <label for="search-button-text">Văn bản nút tìm kiếm</label>
              <input
                  type="text"
                  id="search-button-text"
                  v-model="content.search.buttonText"
                  placeholder="Tìm kiếm"
              />
            </div>

            <div class="form-group">
              <label for="search-submit-text">Văn bản submit</label>
              <input
                  type="text"
                  id="search-submit-text"
                  v-model="content.search.submitText"
                  placeholder="Tìm kiếm"
              />
            </div>
          </div>

          <!-- Colors Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>

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
                <input type="text" v-model="content.colors.secondary" placeholder="#0629BE"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu nền tab</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.tabBg"/>
                <input type="text" v-model="content.colors.tabBg" placeholder="#EFF0F5"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu nền loại BĐS</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.propertyTypeBg"/>
                <input type="text" v-model="content.colors.propertyTypeBg" placeholder="#B9C0DF"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu hover loại BĐS</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.propertyTypeHover"/>
                <input type="text" v-model="content.colors.propertyTypeHover" placeholder="#a0a8cc"/>
              </div>
            </div>
          </div>

          <!-- Typography & Spacing -->
          <div class="setting-section">
            <h3><i class="fas fa-text-height"></i> Typography & Spacing</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="base-font-size">Font size (Desktop)</label>
                <div class="input-with-unit">
                  <input type="text" id="base-font-size" v-model="content.typography.baseFontSize" placeholder="17px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="mobile-font-size">Font size (Mobile)</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-font-size" v-model="content.typography.mobileFontSize"
                         placeholder="14px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="row-height">Chiều cao hàng (Desktop)</label>
                <div class="input-with-unit">
                  <input type="text" id="row-height" v-model="content.spacing.rowHeight" placeholder="58px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="mobile-row-height">Chiều cao hàng (Mobile)</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-row-height" v-model="content.spacing.mobileRowHeight"
                         placeholder="40px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="card-padding">Padding thẻ (Desktop)</label>
                <div class="input-with-unit">
                  <input type="text" id="card-padding" v-model="content.spacing.cardPadding" placeholder="20px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="mobile-card-padding">Padding thẻ (Mobile)</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-card-padding" v-model="content.spacing.mobileCardPadding"
                         placeholder="15px"/>
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
import {ref, reactive, onMounted, computed} from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const activeTab = ref('header')
const isLoading = ref(false)

// Content structure based on provided JSON
const content = reactive({
  header: {
    backgroundImage: 'BannerQS.jpg',
    minHeight: '600px',
    mobileMinHeight: '500px'
  },
  bubbles: {
    count: 30,
    minSize: 5,
    maxSize: 25,
    minOpacity: 0.2,
    maxOpacity: 0.7,
    baseDuration: 10,
    durationVariation: 10,
    maxDelay: 15,
    baseColor: '10, 36, 99'
  },
  tabs: [
    {
      id: 'dinhgia',
      label: 'Định giá',
      active: true
    },
    {
      id: 'kygui',
      label: 'Ký gửi',
      active: false
    }
  ],
  propertyTypes: [
    {
      value: 'all',
      label: 'Tất cả',
      default: true
    },
    {
      value: 'house',
      label: 'Nhà phố'
    },
    {
      value: 'apartment',
      label: 'Chung cư'
    },
    {
      value: 'project',
      label: 'Dự án'
    }
  ],
  search: {
    placeholder: 'Nhập thông tin',
    buttonText: 'Tìm kiếm',
    submitText: 'Tìm kiếm'
  },
  rightCard: {
    image: 'quick-sale.svg',
    altText: 'Quick Sale',
    content: 'Chỉ 30 ngày – bất động sản của bạn có thể tìm được chủ mới! Với quy trình tối ưu từ định giá, quảng bá đến chốt giao dịch, <b>Thiên Hà Group</b> giúp bạn bán nhanh – đúng giá – không rủi ro. Giải pháp thực chiến, kết quả thật – xem ngay cách chúng tôi làm được điều đó.'
  },
  colors: {
    primary: '#031358',
    secondary: '#0629BE',
    tabBg: '#EFF0F5',
    propertyTypeBg: '#B9C0DF',
    propertyTypeHover: '#a0a8cc'
  },
  typography: {
    baseFontSize: '17px',
    mobileFontSize: '14px'
  },
  spacing: {
    rowHeight: '58px',
    mobileRowHeight: '40px',
    cardPadding: '20px',
    mobileCardPadding: '15px'
  },
  animations: {
    bubbleAnimation: 'floatUp',
    transitionSpeed: '0.3s'
  }
})

// Computed for RGB color picker
const rgbColor = computed({
  get() {
    const rgb = content.bubbles.baseColor.split(',').map(num => parseInt(num.trim()))
    if (rgb.length === 3 && rgb.every(num => !isNaN(num))) {
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    }
    return '#0a2463'
  },
  set(value) {
    const match = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (match) {
      content.bubbles.baseColor = `${match[1]}, ${match[2]}, ${match[3]}`
    }
  }
})

const updateBubbleColor = (event) => {
  const rgb = event.target.value
  const match = rgb.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (match) {
    const r = parseInt(match[1], 16)
    const g = parseInt(match[2], 16)
    const b = parseInt(match[3], 16)
    content.bubbles.baseColor = `${r}, ${g}, ${b}`
  }
}

// UI State
const backgroundPreview = ref(null)
const cardImagePreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const backgroundInput = ref(null)
const cardImageInput = ref(null)

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
import {baseImgaeUrl} from "../../../../assets/js/global.js";
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";

const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 14

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

// ========== ARRAY MANAGEMENT FUNCTIONS ==========
const addTab = () => {
  content.tabs.push({
    id: `tab${content.tabs.length + 1}`,
    label: 'Tab mới',
    active: false
  })
}

const removeTab = (index) => {
  if (content.tabs.length > 1) {
    content.tabs.splice(index, 1)
  } else {
    showToast('Phải có ít nhất một tab', 'warning')
  }
}

const addPropertyType = () => {
  content.propertyTypes.push({
    value: `type${content.propertyTypes.length + 1}`,
    label: 'Loại mới',
    default: false
  })
}

const removePropertyType = (index) => {
  if (content.propertyTypes.length > 1) {
    content.propertyTypes.splice(index, 1)
  } else {
    showToast('Phải có ít nhất một loại BĐS', 'warning')
  }
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

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Header',
      contentJson: JSON.stringify(content, null, 2),
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
      backgroundPreview.value = null
      cardImagePreview.value = null

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
  if (content.header.backgroundImage === tempUrl) {
    content.header.backgroundImage = realUrl
  }
  if (content.rightCard.image === tempUrl) {
    content.rightCard.image = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
// Background image
const triggerBackgroundInput = () => {
  backgroundInput.value?.click()
}

const handleBackgroundUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Background', backgroundPreview, 'header.backgroundImage')
  }
  event.target.value = ''
}

const handleBackgroundDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Background', backgroundPreview, 'header.backgroundImage')
  }
}

const removeBackground = () => {
  if (content.header.backgroundImage) {
    handleRemoveFile(content.header.backgroundImage, 'header.backgroundImage', backgroundPreview)
  }
}

// Card image
const triggerCardImageInput = () => {
  cardImageInput.value?.click()
}

const handleCardImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Card Image', cardImagePreview, 'rightCard.image')
  }
  event.target.value = ''
}

const handleCardImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Card Image', cardImagePreview, 'rightCard.image')
  }
}

const removeCardImage = () => {
  if (content.rightCard.image) {
    handleRemoveFile(content.rightCard.image, 'rightCard.image', cardImagePreview)
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
const previewBackground = () => {
  if (content.header.backgroundImage) {
    previewImageUrl.value = getImageUrl(content.header.backgroundImage)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh nền để xem trước', 'warning')
  }
}

const previewCardImage = () => {
  if (content.rightCard.image) {
    previewImageUrl.value = getImageUrl(content.rightCard.image)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh thẻ để xem trước', 'warning')
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
/* Add styles for array items */
.array-items {
  margin-bottom: 15px;
}

.array-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
}

.array-item-content {
  flex: 1;
}

.array-item-actions {
  flex-shrink: 0;
}

.hint-text {
  display: block;
  margin-top: 5px;
  font-size: 0.8rem;
  color: #6c757d;
  font-style: italic;
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