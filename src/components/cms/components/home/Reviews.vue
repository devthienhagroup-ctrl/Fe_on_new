<template>
  <div class="services-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Đánh giá của Khách hàng</h2>
      <div class="header-controls">
        <button class="btn btn-primary" @click="addNewCustomer">
          <i class="fas fa-plus"></i> Thêm Đánh giá Mới
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
          :class="{ active: activeTab === 'customers' }"
          @click="activeTab = 'customers'"
      >
        <i class="fas fa-users"></i> Danh sách đánh giá ({{ customers.length }})
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab cài đặt chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề</h3>
            <div class="form-group">
              <label for="section-title">Tiêu đề chính</label>
              <input
                  type="text"
                  id="section-title"
                  v-model="settings.title"
                  placeholder="KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI"
              />
            </div>
          </div>

          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>
            <div class="color-grid">
              <div class="color-input-group form-group">
                <label>Màu chính</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.primary" />
                  <input type="text" v-model="settings.colors.primary" placeholder="#031358" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu phụ</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.secondary" />
                  <input type="text" v-model="settings.colors.secondary" placeholder="#f8f9ff" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Văn bản tối</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.textDark" />
                  <input type="text" v-model="settings.colors.textDark" placeholder="#000000" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Văn bản sáng</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.textLight" />
                  <input type="text" v-model="settings.colors.textLight" placeholder="#ffffff" />
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
                  <input type="text" id="title-size" v-model="settings.fonts.titleSize" placeholder="33px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="text-size">Kích thước văn bản</label>
                <div class="input-with-unit">
                  <input type="text" id="text-size" v-model="settings.fonts.textSize" placeholder="17px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="author-size">Kích thước tác giả</label>
                <div class="input-with-unit">
                  <input type="text" id="author-size" v-model="settings.fonts.authorSize" placeholder="20px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="button-size">Kích thước nút</label>
                <div class="input-with-unit">
                  <input type="text" id="button-size" v-model="settings.fonts.buttonSize" placeholder="18px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Spacing -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Khoảng cách</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="container-padding">Container padding</label>
                <input type="text" id="container-padding" v-model="settings.spacing.containerPadding" placeholder="60px 20px" />
              </div>
              <div class="form-group">
                <label for="review-box-padding">Review box padding</label>
                <input type="text" id="review-box-padding" v-model="settings.spacing.reviewBoxPadding" placeholder="25px" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="gap-columns">Khoảng cách cột</label>
                <div class="input-with-unit">
                  <input type="text" id="gap-columns" v-model="settings.spacing.gapColumns" placeholder="40px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="button-padding">Button padding</label>
                <input type="text" id="button-padding" v-model="settings.spacing.buttonPadding" placeholder="8px" />
              </div>
            </div>
          </div>

          <!-- Border & Effects -->
          <div class="setting-section">
            <h3><i class="fas fa-border-style"></i> Hiệu ứng viền</h3>
              <div class="form-group">
                <label for="border-radius">Border radius</label>
                <div class="input-with-unit">
                  <input type="text" id="border-radius" v-model="settings.borderEffects.borderRadius" placeholder="20px" />
                  <span class="unit">px</span>
                </div>
              </div>


              <div class="form-group">
                <label for="shadow">Shadow</label>
                <div class="color-input">
                  <input type="color" v-model="settings.borderEffects.shadowColor" />
                  <input type="text" v-model="settings.borderEffects.shadow" placeholder="0 10px 30px rgba(3, 19, 88, 0.1)" />
                </div>
              </div>

<!--            <div class="form-group">-->
<!--              <label>Gradient colors</label>-->
<!--              <div class="color-grid">-->
<!--                <div class="color-input-group form-group">-->
<!--                  <label>Màu 1</label>-->
<!--                  <div class="color-input">-->
<!--                    <input type="color" v-model="settings.borderEffects.gradientColor1" />-->
<!--                    <input type="text" v-model="settings.borderEffects.gradientColor1" placeholder="rgba(3, 19, 88, 0.1)" />-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="color-input-group form-group">-->
<!--                  <label>Màu 2</label>-->
<!--                  <div class="color-input">-->
<!--                    <input type="color" v-model="settings.borderEffects.gradientColor2" />-->
<!--                    <input type="text" v-model="settings.borderEffects.gradientColor2" placeholder="rgba(194, 203, 240, 0.3)" />-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="color-input-group form-group">-->
<!--                  <label>Màu 3</label>-->
<!--                  <div class="color-input">-->
<!--                    <input type="color" v-model="settings.borderEffects.gradientColor3" />-->
<!--                    <input type="text" v-model="settings.borderEffects.gradientColor3" placeholder="rgba(3, 19, 88, 0.1)" />-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
          </div>

          <!-- Navigation -->
          <div class="setting-section">
            <h3><i class="fas fa-sliders-h"></i> Điều hướng</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="nav-position">Vị trí</label>
                <select id="nav-position" v-model="settings.navigation.position">
                  <option value="left">Trái</option>
                  <option value="center">Giữa</option>
                  <option value="right">Phải</option>
                </select>
              </div>
              <div class="form-group">
                <label for="button-size">Kích thước nút</label>
                <div class="input-with-unit">
                  <input type="text" id="nav-button-size" v-model="settings.navigation.buttonSize" placeholder="40px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="settings.navigation.showDots" />
                  <span class="checkmark"></span>
                  Hiển thị dots
                </label>
              </div>
              <div class="form-group">
                <label for="icon-size">Kích thước icon</label>
                <div class="input-with-unit">
                  <input type="text" id="icon-size" v-model="settings.navigation.iconSize" placeholder="18px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab danh sách khách hàng -->
      <div v-if="activeTab === 'customers'" class="services-management">
        <div class="services-container">
          <!-- Danh sách khách hàng -->
          <div class="services-list">
            <div
                v-for="(customer, index) in customers"
                :key="customer.id"
                class="service-item"
                :class="{ active: activeCustomerIndex === index }"
                @mouseenter="hoveredCustomerIndex = index"
                @mouseleave="hoveredCustomerIndex = -1"
                @click="selectCustomer(index)"
            >
              <div class="service-content">
                <div class="service-icon">
                  <i class="fas fa-user"></i>
                </div>
                <div class="service-info">
                  <h4>{{ customer.name || 'Khách hàng chưa có tên' }}</h4>
                  <p class="service-index">Đánh giá {{ index + 1 }}</p>
                </div>
              </div>
              <div class="service-actions" v-show="hoveredCustomerIndex === index">
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeCustomer(index)"
                    :disabled="customers.length <= 1"
                    title="Xóa đánh giá"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Form chỉnh sửa đánh giá -->
          <div v-if="activeCustomer !== null" class="service-editor">
            <div class="editor-header">
              <h3>Chỉnh sửa đánh giá {{ activeCustomerIndex + 1 }}</h3>
              <div class="editor-actions">
                <button class="btn btn-secondary" @click="duplicateCustomer">
                  <i class="fas fa-copy"></i> Nhân bản
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveCustomerUp(activeCustomerIndex)"
                    :disabled="activeCustomerIndex === 0"
                    title="Di chuyển lên"
                >
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveCustomerDown(activeCustomerIndex)"
                    :disabled="activeCustomerIndex === customers.length - 1"
                    title="Di chuyển xuống"
                >
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="customer-name">
                <i class="fas fa-user"></i> Tên khách hàng
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="customer-name"
                  v-model="activeCustomer.name"
                  placeholder="Nhập tên khách hàng..."
              />
            </div>

            <div class="form-group">
              <label for="customer-text">
                <i class="fas fa-comment"></i> Nội dung đánh giá
                <span class="required-mark">*</span>
              </label>
              <textarea
                  id="customer-text"
                  v-model="activeCustomer.text"
                  rows="4"
                  placeholder="Nhập nội dung đánh giá của khách hàng..."
              ></textarea>
            </div>
            <div class="file-upload-wrapper" style="display: flex; gap: 10px;">
              <!-- Upload base image -->
              <div class="file-upload-section">
                <label><i class="fas fa-upload"></i> Hình ảnh</label>
                <div class="file-upload">
                  <div class="file-upload-area" @click="triggerBaseImageInput" @dragover.prevent @drop.prevent="handleBaseImageDrop">
                    <input type="file" ref="baseImageInput" @change="handleBaseImageUpload" accept="image/*" style="display: none" />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                  </div>
                  <div v-if="activeCustomer.baseImage || baseImagePreview" class="upload-preview">
                    <img :src="getImageUrl(activeCustomer.baseImage)" alt="Preview" />
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewBaseImage" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="removeBaseImage" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="input-hint">Tải ảnh nền lên từ máy tính của bạn</p>
              </div>

              <!-- Upload foreground image -->
              <div class="file-upload-section">
                <label><i class="fas fa-upload"></i> Hình ảnh đã tách nền</label>
                <div class="file-upload">
                  <div class="file-upload-area" @click="triggerForegroundImageInput" @dragover.prevent @drop.prevent="handleForegroundImageDrop">
                    <input type="file" ref="foregroundImageInput" @change="handleForegroundImageUpload" accept="image/*" style="display: none" />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                  </div>
                  <div v-if="activeCustomer.foregroundImage || foregroundImagePreview" class="upload-preview">
                    <img :src="getImageUrl(activeCustomer.foregroundImage)" alt="Preview" />
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewForegroundImage" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="removeForegroundImage" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <p class="input-hint">Tải ảnh tiền cảnh lên từ máy tính của bạn</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem trước ảnh nền -->
    <div v-if="showBaseImageModal" class="modal-overlay" @click="closeBaseImageModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xem trước ảnh nền</h3>
          <button class="btn-icon btn-close-modal" @click="closeBaseImageModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="getImageUrl(activeCustomer?.baseImage)" alt="Xem trước ảnh nền" />
            <div v-if="!activeCustomer?.baseImage" class="preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Chưa có ảnh để xem trước</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closeBaseImageModal">Đóng</button>
            <button class="btn btn-primary" @click="triggerBaseImageInput">Thay đổi ảnh</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem trước ảnh tiền cảnh -->
    <div v-if="showForegroundImageModal" class="modal-overlay" @click="closeForegroundImageModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xem trước ảnh tiền cảnh</h3>
          <button class="btn-icon btn-close-modal" @click="closeForegroundImageModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="getImageUrl(activeCustomer?.foregroundImage)" alt="Xem trước ảnh tiền cảnh" />
            <div v-if="!activeCustomer?.foregroundImage" class="preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Chưa có ảnh để xem trước</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closeForegroundImageModal">Đóng</button>
            <button class="btn btn-primary" @click="triggerForegroundImageInput">Thay đổi ảnh</button>
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
const customers = ref([])
const activeCustomerIndex = ref(0)
const activeCustomer = computed(() =>
    activeCustomerIndex.value !== null && customers.value.length > 0
        ? customers.value[activeCustomerIndex.value]
        : null
)

const activeTab = ref('general')
const hoveredCustomerIndex = ref(-1)

// Settings object with structure from JSON
const settings = reactive({
  title: "KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI",
  colors: {
    primary: "#031358",
    secondary: "#f8f9ff",
    textDark: "#000000",
    textLight: "#ffffff",
    buttonBg: "transparent",
    buttonHoverBg: "rgba(3, 19, 88, 0.05)",
    buttonDisabled: "rgba(3, 19, 88, 0.3)"
  },
  fonts: {
    titleSize: "33px",
    titleWeight: "600",
    textSize: "17px",
    authorSize: "20px",
    authorWeight: "600",
    buttonSize: "18px"
  },
  spacing: {
    containerPadding: "60px 20px",
    reviewBoxPadding: "25px",
    bubblePadding: "25px",
    gapColumns: "40px",
    buttonPadding: "8px",
    buttonMarginTop: "20px",
    buttonGap: "10px"
  },
  borderEffects: {
    borderRadius: "20px",
    shadow: "0 10px 30px rgba(3, 19, 88, 0.1)",
    shadowColor: "#031358",
    gradientColors: "rgba(3, 19, 88, 0.1), rgba(194, 203, 240, 0.3), rgba(3, 19, 88, 0.1)",
    gradientColor1: "rgba(3, 19, 88, 0.1)",
    gradientColor2: "rgba(194, 203, 240, 0.3)",
    gradientColor3: "rgba(3, 19, 88, 0.1)"
  },
  animation: {
    borderLightSpeed: 3,
    borderLightColors: "rgba(194, 203, 240, 0.8), rgba(3, 19, 88, 0.6), rgba(194, 203, 240, 0.8)"
  },
  navigation: {
    position: "right",
    buttonSize: "40px",
    buttonBorderRadius: "50%",
    buttonColor: "#031358",
    buttonHoverColor: "#031358",
    buttonBgColor: "transparent",
    buttonHoverBgColor: "rgba(3, 19, 88, 0.05)",
    buttonDisabledColor: "rgba(3, 19, 88, 0.3)",
    iconSize: "18px",
    showDots: true,
    dotsSize: "8px",
    dotsActiveSize: "10px",
    dotsColor: "rgba(3, 19, 88, 0.2)",
    dotsActiveColor: "#031358",
    dotsSpacing: "6px"
  },
  responsive: {
    tablet: {
      titleSize: "26px",
      containerPadding: "40px 15px",
      reviewBoxPadding: "20px",
      bubblePadding: "20px",
      reviewTextSize: "16px",
      authorSize: "18px",
      buttonSize: "36px",
      iconSize: "16px",
      buttonPosition: "center",
      dotsSize: "7px",
      dotsActiveSize: "9px"
    },
    mobile: {
      titleSize: "22px",
      containerPadding: "30px 10px",
      reviewBoxPadding: "15px",
      bubblePadding: "15px",
      reviewTextSize: "15px",
      authorSize: "16px",
      buttonSize: "32px",
      iconSize: "14px",
      buttonPosition: "center",
      dotsSize: "6px",
      dotsActiveSize: "8px",
      dotsSpacing: "5px"
    },
    smallMobile: {
      titleSize: "20px",
      containerPadding: "25px 8px",
      reviewBoxPadding: "12px",
      bubblePadding: "12px",
      reviewTextSize: "14px",
      authorSize: "15px",
      buttonSize: "30px",
      iconSize: "13px",
      dotsSize: "5px",
      dotsActiveSize: "7px"
    },
    xSmallMobile: {
      titleSize: "18px",
      buttonSize: "28px",
      iconSize: "12px"
    }
  }
})

// UI State
const isLoading = ref(false)
const baseImagePreview = ref(null)
const foregroundImagePreview = ref(null)
const showBaseImageModal = ref(false)
const showForegroundImageModal = ref(false)

// File management
const files = ref([])
const baseImageInput = ref(null)
const foregroundImageInput = ref(null)
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
    const response = await api.get('/cms/getSection/8')

    if (response.data && response.data.contentJson) {
      const content = JSON.parse(response.data.contentJson)

      // Load settings
      if (content.title) settings.title = content.title
      if (content.colors) Object.assign(settings.colors, content.colors)
      if (content.fonts) Object.assign(settings.fonts, content.fonts)
      if (content.spacing) Object.assign(settings.spacing, content.spacing)
      if (content.borderEffects) Object.assign(settings.borderEffects, content.borderEffects)
      if (content.animation) Object.assign(settings.animation, content.animation)
      if (content.navigation) Object.assign(settings.navigation, content.navigation)
      if (content.responsive) Object.assign(settings.responsive, content.responsive)

      // Load customers
      if (content.customers && Array.isArray(content.customers)) {
        customers.value = content.customers.map((customer, index) => ({
          id: customer.id || `customer-${Date.now()}-${index}`,
          name: customer.name || '',
          text: customer.text || '',
          baseImage: customer.baseImage || '',
          foregroundImage: customer.foregroundImage || ''
        }))
      } else {
        customers.value = []
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

        customers.value.forEach(customer => {
          // Handle base image
          if (customer.baseImage && !customer.baseImage.startsWith(TEMP_PREFIX)) {
            const filename = customer.baseImage
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

          // Handle foreground image
          if (customer.foregroundImage && !customer.foregroundImage.startsWith(TEMP_PREFIX)) {
            const filename = customer.foregroundImage
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

    // Fallback to default customers
    if (customers.value.length === 0) {
      customers.value = [createNewCustomer()]
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
      customers: customers.value.map(customer => {
        let baseImageUrl = customer.baseImage
        let foregroundImageUrl = customer.foregroundImage

        if (baseImageUrl.startsWith(TEMP_PREFIX)) {
          baseImageUrl = baseImageUrl
        }

        if (foregroundImageUrl.startsWith(TEMP_PREFIX)) {
          foregroundImageUrl = foregroundImageUrl
        }

        return {
          id: customer.id,
          name: customer.name,
          text: customer.text,
          baseImage: baseImageUrl,
          foregroundImage: foregroundImageUrl
        }
      })
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: 8,
      name: 'Đánh giá của khách hàng',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 7,
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
              // Update customer image URLs from temp to real
              customers.value.forEach(customer => {
                if (customer.baseImage === TEMP_PREFIX + file.tempName) {
                  customer.baseImage = savedFile.filename
                }
                if (customer.foregroundImage === TEMP_PREFIX + file.tempName) {
                  customer.foregroundImage = savedFile.filename
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
      baseImagePreview.value = null
      foregroundImagePreview.value = null

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

// ========== CUSTOMER MANAGEMENT ==========
const createNewCustomer = () => ({
  id: `customer-${Date.now()}-${Math.random()}`,
  name: '',
  text: '',
  baseImage: '',
  foregroundImage: ''
})

const addNewCustomer = () => {
  const newCustomer = createNewCustomer()
  customers.value.push(newCustomer)
  activeCustomerIndex.value = customers.value.length - 1
  activeTab.value = 'customers'
  showToast('Đã thêm đánh giá mới', 'success')
}

const selectCustomer = (index) => {
  activeCustomerIndex.value = index
  baseImagePreview.value = null
  foregroundImagePreview.value = null
}

const moveCustomerUp = (index) => {
  if (index > 0) {
    const temp = customers.value[index]
    customers.value[index] = customers.value[index - 1]
    customers.value[index - 1] = temp
    activeCustomerIndex.value = index - 1
    showToast('Đã di chuyển đánh giá lên', 'success')
  }
}

const moveCustomerDown = (index) => {
  if (index < customers.value.length - 1) {
    const temp = customers.value[index]
    customers.value[index] = customers.value[index + 1]
    customers.value[index + 1] = temp
    activeCustomerIndex.value = index + 1
    showToast('Đã di chuyển đánh giá xuống', 'success')
  }
}

const removeCustomer = (index) => {
  if (customers.value.length <= 1) {
    showToast('Không thể xóa đánh giá cuối cùng', 'warning')
    return
  }

  const customer = customers.value[index]

  // Handle associated files
  const handleImageFile = (imageUrl) => {
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
    }
  }

  handleImageFile(customer.baseImage)
  handleImageFile(customer.foregroundImage)

  customers.value.splice(index, 1)

  if (activeCustomerIndex.value >= customers.value.length) {
    activeCustomerIndex.value = customers.value.length - 1
  }

  showToast('Đã xóa đánh giá', 'success')
}

const duplicateCustomer = () => {
  if (!activeCustomer.value) return

  const duplicate = {
    ...JSON.parse(JSON.stringify(activeCustomer.value)),
    id: `customer-${Date.now()}-${Math.random()}`
  }

  customers.value.splice(activeCustomerIndex.value + 1, 0, duplicate)
  activeCustomerIndex.value += 1
  showToast('Đã nhân bản đánh giá', 'success')
}

// ========== BASE IMAGE UPLOAD MANAGEMENT ==========
const triggerBaseImageInput = () => {
  baseImageInput.value?.click()
}

const handleBaseImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP', 'error')
    return
  }

  if (!activeCustomer.value) {
    showToast('Vui lòng chọn một đánh giá trước', 'warning')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Handle old image
    if (activeCustomer.value.baseImage) {
      const oldImageUrl = activeCustomer.value.baseImage

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

    // Update customer
    activeCustomer.value.baseImage = tempUrl
    baseImagePreview.value = previewUrl

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

    showToast('Ảnh nền đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const handleBaseImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleBaseImageUpload(fakeEvent)
  }
}

const removeBaseImage = () => {
  if (activeCustomer.value && activeCustomer.value.baseImage) {
    const imageUrl = activeCustomer.value.baseImage

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

    activeCustomer.value.baseImage = ''
    baseImagePreview.value = null

    showToast('Đã xóa ảnh nền', 'success')
  }
}

// ========== FOREGROUND IMAGE UPLOAD MANAGEMENT ==========
const triggerForegroundImageInput = () => {
  foregroundImageInput.value?.click()
}

const handleForegroundImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP', 'error')
    return
  }

  if (!activeCustomer.value) {
    showToast('Vui lòng chọn một đánh giá trước', 'warning')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Handle old image
    if (activeCustomer.value.foregroundImage) {
      const oldImageUrl = activeCustomer.value.foregroundImage

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

    // Update customer
    activeCustomer.value.foregroundImage = tempUrl
    foregroundImagePreview.value = previewUrl

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

    showToast('Ảnh tiền cảnh đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const handleForegroundImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleForegroundImageUpload(fakeEvent)
  }
}

const removeForegroundImage = () => {
  if (activeCustomer.value && activeCustomer.value.foregroundImage) {
    const imageUrl = activeCustomer.value.foregroundImage

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

    activeCustomer.value.foregroundImage = ''
    foregroundImagePreview.value = null

    showToast('Đã xóa ảnh tiền cảnh', 'success')
  }
}

// ========== UI FUNCTIONS ==========
const previewBaseImage = () => {
  if (activeCustomer.value && activeCustomer.value.baseImage) {
    showBaseImageModal.value = true
  } else {
    showToast('Không có ảnh nền để xem trước', 'warning')
  }
}

const closeBaseImageModal = () => {
  showBaseImageModal.value = false
}

const previewForegroundImage = () => {
  if (activeCustomer.value && activeCustomer.value.foregroundImage) {
    showForegroundImageModal.value = true
  } else {
    showToast('Không có ảnh tiền cảnh để xem trước', 'warning')
  }
}

const closeForegroundImageModal = () => {
  showForegroundImageModal.value = false
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})

// Watch for shadow color changes to update shadow string
watch(() => settings.borderEffects.shadowColor, (newColor) => {
  // Extract the current shadow values from the shadow string
  const shadowMatch = settings.borderEffects.shadow.match(/^(.*rgba?\([^)]+\))/)
  if (shadowMatch && shadowMatch[1]) {
    const shadowWithoutColor = shadowMatch[1].replace(/rgba?\([^)]+\)/, '').trim()
    // Convert hex to rgba
    const hexToRgba = (hex, alpha = 0.1) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    settings.borderEffects.shadow = `${shadowWithoutColor}${hexToRgba(newColor, 0.1)}`
  }
})

// Watch for gradient color changes to update gradient string
watch(() => [
  settings.borderEffects.gradientColor1,
  settings.borderEffects.gradientColor2,
  settings.borderEffects.gradientColor3
], ([color1, color2, color3]) => {
  settings.borderEffects.gradientColors = `${color1}, ${color2}, ${color3}`
}, { deep: true })

watch(() => customers.value, (newCustomers) => {
  console.log('Customers updated:', newCustomers.length)
}, { deep: true })
</script>

<style scoped>
/* File Upload */
.file-upload {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Circle Image Upload */
.circle-image-upload {
  margin-top: 15px;
}

.file-upload.compact .file-upload-area {
  padding: 20px;
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

/* Main Container */
.services-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin: 20px;
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
  outline: none;
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
  outline: none;
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
  min-height: 600px;
}

/* General Settings */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.setting-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.setting-section:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
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
.form-group input[type="number"],
.form-group input[type="email"],
.form-group input[type="password"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23495057' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
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
  transition: border-color 0.3s ease;
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
  min-width: 120px;
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
  font-weight: normal;
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
  flex-shrink: 0;
}

.checkbox-label:hover .checkmark {
  border-color: #4a6cf7;
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
  height: 100%;
}

.services-container {
  display: flex;
  gap: 30px;
  width: 100%;
  height: 100%;
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
  outline: none;
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
  font-size: 0.9rem;
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
  margin-bottom: 0;
}

.upload-preview {
  position: relative;
  width: 100%;
  min-height: 200px;
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
  outline: none;
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
  animation: fadeIn 0.3s ease;
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
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  outline: none;
}

.btn-close-modal:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
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
  outline: none;
}

.btn-toast-close:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

/* Scrollbar Styling */
.services-list::-webkit-scrollbar,
.service-editor::-webkit-scrollbar,
.tab-content::-webkit-scrollbar {
  width: 6px;
}

.services-list::-webkit-scrollbar-track,
.service-editor::-webkit-scrollbar-track,
.tab-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.services-list::-webkit-scrollbar-thumb,
.service-editor::-webkit-scrollbar-thumb,
.tab-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.services-list::-webkit-scrollbar-thumb:hover,
.service-editor::-webkit-scrollbar-thumb:hover,
.tab-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

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

  .service-editor {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    padding: 20px;
  }

  .header-controls {
    flex-direction: row;
    gap: 10px;
    justify-content: stretch;
  }

  .header-controls .btn {
    flex: 1;
    justify-content: center;
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
    overflow-x: auto;
    white-space: nowrap;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .service-editor .editor-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .editor-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
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

  /* Responsive modal */
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .image-preview-container {
    min-height: 300px;
  }
}

@media (max-width: 576px) {
  .editor-header h2 {
    font-size: 1.5rem;
    text-align: center;
  }

  .header-controls {
    flex-direction: column;
  }

  .header-controls .btn {
    width: 100%;
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

  .upload-preview {
    width: 150px;
    height: 150px;
  }

  .modal-content {
    width: 98%;
    margin: 10px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .services-editor {
    margin: 10px;
    border-radius: 8px;
  }

  .tab-content {
    padding: 15px;
  }

  .setting-section {
    padding: 15px;
  }

  .service-editor {
    padding: 15px;
  }

  .toast-notification {
    left: 10px;
    right: 10px;
    bottom: 10px;
    max-width: none;
  }
}

/* Custom styles for better UX */
.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #adb5bd;
  opacity: 0.8;
}

.form-group input:disabled,
.form-group textarea:disabled,
.form-group select:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn:focus {
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.3);
}

.btn-icon:focus {
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.3);
}

/* Loading state */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4a6cf7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #adb5bd;
  display: block;
}

.empty-state h4 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 1.2rem;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

/* Validation states */
.form-group .error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-group input.error,
.form-group textarea.error,
.form-group select.error {
  border-color: #dc3545;
}

.form-group input.error:focus,
.form-group textarea.error:focus,
.form-group select.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}
</style>