<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Tin nổi bật</h2>
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
          :class="{ active: activeTab === 'colors' }"
          @click="activeTab = 'colors'"
      >
        <i class="fas fa-palette"></i> Màu sắc
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'typography' }"
          @click="activeTab = 'typography'"
      >
        <i class="fas fa-font"></i> Kiểu chữ
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'spacing' }"
          @click="activeTab = 'spacing'"
      >
        <i class="fas fa-ruler-combined"></i> Khoảng cách
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'other' }"
          @click="activeTab = 'other'"
      >
        <i class="fas fa-cog"></i> Khác
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Màu sắc -->
      <div v-if="activeTab === 'colors'" class="colors-settings">
        <div class="settings-grid">
          <!-- Màu chính -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu sắc chính</h3>

            <div class="form-group">
              <label for="primary-color">Màu chính</label>
              <div class="color-input">
                <input type="color" v-model="primaryColorHex" @input="updatePrimaryColor"/>
                <input type="text" v-model="content.colors.primary" placeholder="#031358"/>
              </div>
            </div>

            <div class="form-group">
              <label for="secondary-color">Màu phụ</label>
              <div class="color-input">
                <input type="color" v-model="secondaryColorHex" @input="updateSecondaryColor"/>
                <input type="text" v-model="content.colors.secondary" placeholder="#0030FF"/>
              </div>
            </div>

            <div class="form-group">
              <label for="text-secondary-color">Màu chữ phụ</label>
              <div class="color-input">
                <input type="color" v-model="textSecondaryColorHex" @input="updateTextSecondaryColor"/>
                <input type="text" v-model="content.colors.textSecondary" placeholder="#6B7280"/>
              </div>
            </div>
          </div>

          <!-- Màu nền và overlay -->
          <div class="setting-section">
            <h3><i class="fas fa-layer-group"></i> Màu nền & Overlay</h3>

            <div class="form-group">
              <label for="white-color">Màu trắng</label>
              <div class="color-input">
                <input type="color" v-model="whiteColorHex" @input="updateWhiteColor"/>
                <input type="text" v-model="content.colors.white" placeholder="#FFFFFF"/>
              </div>
            </div>

            <div class="form-group">
              <label for="date-overlay-bg">Nền overlay ngày</label>
              <div class="color-input">
                <input type="color" v-model="dateOverlayBgHex" @input="updateDateOverlayBg"/>
                <input type="text" v-model="content.colors.dateOverlayBg" placeholder="rgba(255, 255, 255, 0.8)"/>
              </div>
            </div>

            <div class="form-group">
              <label for="button-shadow">Đổ bóng nút</label>
              <div class="color-input">
                <input type="color" v-model="buttonShadowHex" @input="updateButtonShadow"/>
                <input type="text" v-model="content.colors.buttonShadow" placeholder="rgba(3, 19, 88, 0.3)"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Kiểu chữ -->
      <div v-if="activeTab === 'typography'" class="typography-settings">
        <div class="settings-grid">
          <!-- Tiêu đề chính -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề chính</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="main-title-font-size">Kích thước chữ</label>
                <div class="input-with-unit">
                  <input type="text" id="main-title-font-size" v-model="content.typography.mainTitle.fontSize" placeholder="36px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="main-title-font-weight">Độ đậm</label>
                <input
                    type="text"
                    id="main-title-font-weight"
                    v-model="content.typography.mainTitle.fontWeight"
                    placeholder="700"
                />
              </div>
            </div>
          </div>

          <!-- Tiêu đề nổi bật -->
          <div class="setting-section">
            <h3><i class="fas fa-star"></i> Tiêu đề nổi bật</h3>

            <div class="form-group">
              <label for="featured-title-font-size">Kích thước tiêu đề</label>
              <div class="input-with-unit">
                <input type="text" id="featured-title-font-size" v-model="content.typography.featuredTitle.fontSize" placeholder="25px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="featured-title-font-weight">Độ đậm tiêu đề</label>
              <input
                  type="text"
                  id="featured-title-font-weight"
                  v-model="content.typography.featuredTitle.fontWeight"
                  placeholder="700"
              />
            </div>

            <div class="form-group">
              <label for="featured-subtitle-font-size">Kích thước phụ đề</label>
              <div class="input-with-unit">
                <input type="text" id="featured-subtitle-font-size" v-model="content.typography.featuredSubtitle.fontSize" placeholder="20px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Tin tức -->
          <div class="setting-section">
            <h3><i class="fas fa-newspaper"></i> Tin tức</h3>

            <div class="form-group">
              <label for="news-title-font-size">Kích thước tiêu đề tin</label>
              <div class="input-with-unit">
                <input type="text" id="news-title-font-size" v-model="content.typography.newsTitle.fontSize" placeholder="18px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="news-title-font-weight">Độ đậm tiêu đề tin</label>
              <input
                  type="text"
                  id="news-title-font-weight"
                  v-model="content.typography.newsTitle.fontWeight"
                  placeholder="700"
              />
            </div>

            <div class="form-group">
              <label for="news-subtitle-font-size">Kích thước phụ đề tin</label>
              <div class="input-with-unit">
                <input type="text" id="news-subtitle-font-size" v-model="content.typography.newsSubtitle.fontSize" placeholder="16px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="setting-section">
            <h3><i class="fas fa-edit"></i> Form</h3>

            <div class="form-group">
              <label for="form-title-font-size">Kích thước tiêu đề form</label>
              <div class="input-with-unit">
                <input type="text" id="form-title-font-size" v-model="content.typography.formTitle.fontSize" placeholder="33px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="form-title-font-weight">Độ đậm tiêu đề form</label>
              <input
                  type="text"
                  id="form-title-font-weight"
                  v-model="content.typography.formTitle.fontWeight"
                  placeholder="700"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="form-label-font-size">Kích thước nhãn</label>
                <div class="input-with-unit">
                  <input type="text" id="form-label-font-size" v-model="content.typography.formLabel.fontSize" placeholder="16px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="form-label-focus-font-size">Kích thước khi focus</label>
                <div class="input-with-unit">
                  <input type="text" id="form-label-focus-font-size" v-model="content.typography.formLabel.focusFontSize" placeholder="12px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Nút và nhãn -->
          <div class="setting-section">
            <h3><i class="fas fa-tag"></i> Nút & Nhãn</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="button-font-size">Kích thước nút</label>
                <div class="input-with-unit">
                  <input type="text" id="button-font-size" v-model="content.typography.button.fontSize" placeholder="18px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="button-font-weight">Độ đậm nút</label>
                <input
                    type="text"
                    id="button-font-weight"
                    v-model="content.typography.button.fontWeight"
                    placeholder="700"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category-tag-font-size">Kích thước nhãn danh mục</label>
                <div class="input-with-unit">
                  <input type="text" id="category-tag-font-size" v-model="content.typography.categoryTag.fontSize" placeholder="14px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="category-tag-font-weight">Độ đậm nhãn danh mục</label>
                <input
                    type="text"
                    id="category-tag-font-weight"
                    v-model="content.typography.categoryTag.fontWeight"
                    placeholder="500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Khoảng cách -->
      <div v-if="activeTab === 'spacing'" class="spacing-settings">
        <div class="settings-grid">
          <!-- Container -->
          <div class="setting-section">
            <h3><i class="fas fa-container-storage"></i> Container</h3>

            <div class="form-group">
              <label for="container-max-width">Chiều rộng tối đa</label>
              <div class="input-with-unit">
                <input type="text" id="container-max-width" v-model="content.spacing.containerMaxWidth" placeholder="1400px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="container-margin-top">Margin top</label>
              <div class="input-with-unit">
                <input type="text" id="container-margin-top" v-model="content.spacing.containerMarginTop" placeholder="80px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="container-padding">Padding</label>
              <div class="input-with-unit">
                <input type="text" id="container-padding" v-model="content.spacing.containerPadding" placeholder="20px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Khoảng cách nội dung -->
          <div class="setting-section">
            <h3><i class="fas fa-arrows-alt-h"></i> Khoảng cách nội dung</h3>

            <div class="form-group">
              <label for="content-gap">Khoảng cách nội dung</label>
              <div class="input-with-unit">
                <input type="text" id="content-gap" v-model="content.spacing.contentGap" placeholder="30px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="button-padding">Padding nút</label>
              <div class="input-with-unit">
                <input type="text" id="button-padding" v-model="content.spacing.buttonPadding" placeholder="15px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="form-padding">Padding form</label>
              <div class="input-with-unit">
                <input type="text" id="form-padding" v-model="content.spacing.formPadding" placeholder="25px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Chiều cao ảnh -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Chiều cao ảnh</h3>

            <div class="form-group">
              <label for="featured-image-height">Ảnh nổi bật</label>
              <div class="input-with-unit">
                <input type="text" id="featured-image-height" v-model="content.spacing.featuredImageHeight" placeholder="400px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="news-image-height">Ảnh tin tức</label>
              <div class="input-with-unit">
                <input type="text" id="news-image-height" v-model="content.spacing.newsImageHeight" placeholder="200px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Khác -->
      <div v-if="activeTab === 'other'" class="other-settings">
        <div class="settings-grid">
          <!-- Bo góc -->
          <div class="setting-section">
            <h3><i class="fas fa-circle"></i> Bo góc</h3>

            <div class="form-group">
              <label for="border-radius-small">Bo góc nhỏ</label>
              <input
                  type="text"
                  id="border-radius-small"
                  v-model="content.borderRadius.small"
                  placeholder="4px"
              />
            </div>

            <div class="form-group">
              <label for="border-radius-medium">Bo góc vừa</label>
              <input
                  type="text"
                  id="border-radius-medium"
                  v-model="content.borderRadius.medium"
                  placeholder="8px"
              />
            </div>
          </div>

          <!-- Đổ bóng -->
          <div class="setting-section">
            <h3><i class="fas fa-box-shadow"></i> Đổ bóng</h3>

            <div class="form-group">
              <div class="color-input-group">
                <label for="card-shadow">Đổ bóng thẻ</label>
                <div class="color-input">
                  <input type="color" v-model="cardShadowColor1Hex" @input="updateCardShadow"/>
                  <input type="color" v-model="cardShadowColor2Hex" @input="updateCardShadow"/>
                  <input
                      type="text"
                      id="card-shadow"
                      v-model="content.shadows.card"
                      placeholder="0 4px 12px rgba(0, 0, 0, 0.1)"
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="color-input-group">
                <label for="button-hover-shadow">Đổ bóng nút hover</label>
                <div class="color-input">
                  <input type="color" v-model="buttonHoverShadowColor1Hex" @input="updateButtonHoverShadow"/>
                  <input type="color" v-model="buttonHoverShadowColor2Hex" @input="updateButtonHoverShadow"/>
                  <input
                      type="text"
                      id="button-hover-shadow"
                      v-model="content.shadows.buttonHover"
                      placeholder="0 4px 12px rgba(3, 19, 88, 0.3)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Gradient -->
          <div class="setting-section">
            <h3><i class="fas fa-sliders-h"></i> Gradient</h3>

            <div class="form-group">
              <div class="color-input-group">
                <label for="button-gradient">Gradient nút</label>
                <div class="color-input">
                  <input type="color" v-model="buttonGradientColor1Hex" @input="updateButtonGradient"/>
                  <input type="color" v-model="buttonGradientColor2Hex" @input="updateButtonGradient"/>
                  <input
                      type="text"
                      id="button-gradient"
                      v-model="content.gradients.button"
                      placeholder="linear-gradient(to right, #031358, #0030FF)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Transition -->
          <div class="setting-section">
            <h3><i class="fas fa-exchange-alt"></i> Transition</h3>

            <div class="form-group">
              <label for="default-transition">Transition mặc định</label>
              <input
                  type="text"
                  id="default-transition"
                  v-model="content.transitions.default"
                  placeholder="0.3s"
              />
            </div>

            <div class="form-group">
              <label for="form-label-transition">Transition nhãn form</label>
              <input
                  type="text"
                  id="form-label-transition"
                  v-model="content.transitions.formLabel"
                  placeholder="all 0.3s ease"
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
import {ref, reactive, onMounted} from 'vue'
import api from '../../../../api/api.js'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('colors')
const isLoading = ref(false)

// Color states
const primaryColorHex = ref('#031358')
const secondaryColorHex = ref('#0030FF')
const textSecondaryColorHex = ref('#6B7280')
const whiteColorHex = ref('#FFFFFF')
const dateOverlayBgHex = ref('#FFFFFF')
const buttonShadowHex = ref('#031358')

// Shadow color states
const cardShadowColor1Hex = ref('#000000')
const cardShadowColor2Hex = ref('#000000')
const buttonHoverShadowColor1Hex = ref('#031358')
const buttonHoverShadowColor2Hex = ref('#031358')

// Gradient color states
const buttonGradientColor1Hex = ref('#031358')
const buttonGradientColor2Hex = ref('#0030FF')

// Content structure based on new JSON data
const content = reactive({
  colors: {
    primary: "#031358",
    secondary: "#0030FF",
    textSecondary: "#6B7280",
    white: "#FFFFFF",
    dateOverlayBg: "rgba(255, 255, 255, 0.8)",
    buttonShadow: "rgba(3, 19, 88, 0.3)"
  },
  typography: {
    mainTitle: {
      fontSize: "36px",
      fontWeight: "700"
    },
    featuredTitle: {
      fontSize: "25px",
      fontWeight: "700"
    },
    featuredSubtitle: {
      fontSize: "20px"
    },
    newsTitle: {
      fontSize: "18px",
      fontWeight: "700"
    },
    newsSubtitle: {
      fontSize: "16px"
    },
    formTitle: {
      fontSize: "33px",
      fontWeight: "700"
    },
    formLabel: {
      fontSize: "16px",
      focusFontSize: "12px"
    },
    button: {
      fontSize: "18px",
      fontWeight: "700"
    },
    categoryTag: {
      fontSize: "14px",
      fontWeight: "500"
    }
  },
  spacing: {
    containerMaxWidth: "1400px",
    containerMarginTop: "80px",
    containerPadding: "20px",
    contentGap: "30px",
    featuredImageHeight: "400px",
    newsImageHeight: "200px",
    formPadding: "25px",
    buttonPadding: "15px"
  },
  borderRadius: {
    small: "4px",
    medium: "8px"
  },
  shadows: {
    card: "0 4px 12px rgba(0, 0, 0, 0.1)",
    buttonHover: "0 4px 12px rgba(3, 19, 88, 0.3)"
  },
  gradients: {
    button: "linear-gradient(to right, #031358, #0030FF)"
  },
  transitions: {
    default: "0.3s",
    formLabel: "all 0.3s ease"
  }
})

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
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 44

// ========== COLOR HELPERS ==========
const hexToRgba = (hex, opacity = 1) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const rgbaToHex = (rgba) => {
  if (rgba.startsWith('#')) return rgba;

  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  return '#ffffff';
};

const getOpacityFromRgba = (rgba) => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  return match && match[4] ? parseFloat(match[4]) : 1;
};

// Extract color from shadow/gradient string
const extractColorsFromShadow = (shadowStr) => {
  const rgbaMatches = shadowStr.match(/rgba?\([^)]+\)/g);
  if (!rgbaMatches || rgbaMatches.length < 2) {
    return ['#000000', '#000000'];
  }
  return rgbaMatches.map(rgba => rgbaToHex(rgba)).slice(0, 2);
};

const extractColorsFromGradient = (gradientStr) => {
  const colorMatches = gradientStr.match(/#[0-9a-fA-F]{6}|rgba?\([^)]+\)/g);
  if (!colorMatches || colorMatches.length < 2) {
    return ['#031358', '#0030FF'];
  }
  return colorMatches.map(color => rgbaToHex(color)).slice(0, 2);
};

// Update color functions
const updatePrimaryColor = () => {
  content.colors.primary = primaryColorHex.value;
};

const updateSecondaryColor = () => {
  content.colors.secondary = secondaryColorHex.value;
};

const updateTextSecondaryColor = () => {
  content.colors.textSecondary = textSecondaryColorHex.value;
};

const updateWhiteColor = () => {
  content.colors.white = whiteColorHex.value;
};

const updateDateOverlayBg = () => {
  const opacity = getOpacityFromRgba(content.colors.dateOverlayBg);
  content.colors.dateOverlayBg = hexToRgba(dateOverlayBgHex.value, opacity);
};

const updateButtonShadow = () => {
  const opacity = getOpacityFromRgba(content.colors.buttonShadow);
  content.colors.buttonShadow = hexToRgba(buttonShadowHex.value, opacity);
};

// Update shadow functions
const updateCardShadow = () => {
  const opacity1 = 0.1; // Default opacity for card shadow
  const rgba1 = hexToRgba(cardShadowColor1Hex.value, opacity1);
  const rgba2 = hexToRgba(cardShadowColor2Hex.value, opacity1);
  content.shadows.card = `0 4px 12px ${rgba1}`;

  // Update second color if different
  if (cardShadowColor1Hex.value !== cardShadowColor2Hex.value) {
    content.shadows.card = `0 4px 12px ${rgba1}, 0 2px 6px ${rgba2}`;
  }
};

const updateButtonHoverShadow = () => {
  const opacity = 0.3; // Default opacity for button hover shadow
  const rgba1 = hexToRgba(buttonHoverShadowColor1Hex.value, opacity);
  const rgba2 = hexToRgba(buttonHoverShadowColor2Hex.value, opacity);
  content.shadows.buttonHover = `0 4px 12px ${rgba1}`;

  // Update second color if different
  if (buttonHoverShadowColor1Hex.value !== buttonHoverShadowColor2Hex.value) {
    content.shadows.buttonHover = `0 4px 12px ${rgba1}, 0 2px 6px ${rgba2}`;
  }
};

// Update gradient function
const updateButtonGradient = () => {
  content.gradients.button = `linear-gradient(to right, ${buttonGradientColor1Hex.value}, ${buttonGradientColor2Hex.value})`;
};

// Initialize shadow and gradient colors from content
const initializeShadowAndGradientColors = () => {
  // Card shadow colors
  const cardColors = extractColorsFromShadow(content.shadows.card);
  cardShadowColor1Hex.value = cardColors[0];
  cardShadowColor2Hex.value = cardColors[1] || cardColors[0];

  // Button hover shadow colors
  const buttonHoverColors = extractColorsFromShadow(content.shadows.buttonHover);
  buttonHoverShadowColor1Hex.value = buttonHoverColors[0];
  buttonHoverShadowColor2Hex.value = buttonHoverColors[1] || buttonHoverColors[0];

  // Button gradient colors
  const gradientColors = extractColorsFromGradient(content.gradients.button);
  buttonGradientColor1Hex.value = gradientColors[0];
  buttonGradientColor2Hex.value = gradientColors[1] || gradientColors[0];
};

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

      // Initialize color inputs
      primaryColorHex.value = rgbaToHex(content.colors.primary);
      secondaryColorHex.value = rgbaToHex(content.colors.secondary);
      textSecondaryColorHex.value = rgbaToHex(content.colors.textSecondary);
      whiteColorHex.value = rgbaToHex(content.colors.white);
      dateOverlayBgHex.value = rgbaToHex(content.colors.dateOverlayBg);
      buttonShadowHex.value = rgbaToHex(content.colors.buttonShadow);

      // Initialize shadow and gradient colors
      initializeShadowAndGradientColors();

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

const generateTempName = (originalFilename) => {
  if (!originalFilename) return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.jpg`;

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalFilename.split('.').pop() || 'jpg';
  return `temp_${timestamp}_${random}.${extension}`;
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare content data
    const contentData = {...content}

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Tin nổi bật',
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

  // Check if any property in content contains the temp URL
  // This would need to be adapted based on actual content structure
  const contentStr = JSON.stringify(content)
  if (contentStr.includes(tempUrl)) {
    // This is a simplified approach - in reality you'd need to find and replace specific properties
    console.log('File URL needs updating:', tempUrl, '->', realUrl)
  }
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
  width: 40px;
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

  .color-input {
    flex-wrap: wrap;
  }

  .color-input input[type="color"] {
    width: 35px;
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

  .tab-button {
    padding: 10px 15px;
    font-size: 0.85rem;
  }
}
</style>