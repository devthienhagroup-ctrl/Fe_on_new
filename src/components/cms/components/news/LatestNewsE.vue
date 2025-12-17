<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Tin mới</h2>
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
            <h3><i class="fas fa-heading"></i> Tiêu đề section</h3>

            <div class="form-group">
              <label for="section-title">Tiêu đề chính</label>
              <input
                  type="text"
                  id="section-title"
                  v-model="content.sectionTitle"
                  placeholder="TIN TỨC MỚI NHẤT"
              />
            </div>
          </div>

          <!-- Kích thước và khoảng cách -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Kích thước & Khoảng cách</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="news-item-width">Chiều rộng thẻ tin</label>
                <div class="input-with-unit">
                  <input type="text" id="news-item-width" v-model="content.sizes.newsItemWidth"
                         placeholder="500px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="news-image-height">Chiều cao ảnh tin</label>
                <div class="input-with-unit">
                  <input type="text" id="news-image-height" v-model="content.sizes.newsImageHeight"
                         placeholder="300px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="control-btn-size">Kích thước nút điều khiển</label>
                <div class="input-with-unit">
                  <input type="text" id="control-btn-size" v-model="content.sizes.controlBtnSize"
                         placeholder="50px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="progress-bar-height">Chiều cao thanh tiến trình</label>
                <div class="input-with-unit">
                  <input type="text" id="progress-bar-height" v-model="content.sizes.progressBarHeight"
                         placeholder="4px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="section-padding">Padding section</label>
              <input
                  type="text"
                  id="section-padding"
                  v-model="content.spacing.sectionPadding"
                  placeholder="60px 20px"
              />
            </div>

            <div class="form-group">
              <label for="carousel-gap">Khoảng cách carousel</label>
              <div class="input-with-unit">
                <input type="text" id="carousel-gap" v-model="content.spacing.carouselGap"
                       placeholder="30px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Bo góc -->
          <div class="setting-section">
            <h3><i class="fas fa-circle"></i> Bo góc</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="news-item-border-radius">Bo góc thẻ tin</label>
                <div class="input-with-unit">
                  <input type="text" id="news-item-border-radius" v-model="content.borderRadius.newsItem"
                         placeholder="12px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="image-wrapper-border-radius">Bo góc wrapper ảnh</label>
                <div class="input-with-unit">
                  <input type="text" id="image-wrapper-border-radius" v-model="content.borderRadius.imageWrapper"
                         placeholder="10px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="control-btn-border-radius">Bo góc nút điều khiển</label>
                <div class="input-with-unit">
                  <input type="text" id="control-btn-border-radius" v-model="content.borderRadius.controlBtn"
                         placeholder="50%"/>
                  <span class="unit"></span>
                </div>
              </div>
              <div class="form-group">
                <label for="progress-bar-border-radius">Bo góc thanh tiến trình</label>
                <div class="input-with-unit">
                  <input type="text" id="progress-bar-border-radius" v-model="content.borderRadius.progressBar"
                         placeholder="10px"/>
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

            <div class="form-row">
              <div class="form-group">
                <label for="primary-color">Màu chính (Primary)</label>
                <div class="color-input">
                  <input type="color" v-model="primaryColorHex" @input="updatePrimaryColor()"/>
                  <input type="text" v-model="content.colors.primary" placeholder="#031358"/>
                </div>
              </div>
              <div class="form-group">
                <label for="secondary-color">Màu phụ (Secondary)</label>
                <div class="color-input">
                  <input type="color" v-model="secondaryColorHex" @input="updateSecondaryColor()"/>
                  <input type="text" v-model="content.colors.secondary" placeholder="#0629BE"/>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="tertiary-color">Màu thứ ba (Tertiary)</label>
                <div class="color-input">
                  <input type="color" v-model="tertiaryColorHex" @input="updateTertiaryColor()"/>
                  <input type="text" v-model="content.colors.tertiary" placeholder="#0628B9"/>
                </div>
              </div>
              <div class="form-group">
                <label for="white-color">Màu trắng</label>
                <div class="color-input">
                  <input type="color" v-model="whiteColorHex" @input="updateWhiteColor()"/>
                  <input type="text" v-model="content.colors.white" placeholder="#ffffff"/>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="overlay-color">Màu overlay</label>
                <div class="color-input">
                  <input type="color" v-model="overlayColorHex" @input="updateOverlayColor()"/>
                  <input type="text" v-model="content.colors.overlay" placeholder="rgba(0, 0, 0, 0.7)"/>
                </div>
              </div>
              <div class="form-group">
                <label for="category-bg-color">Màu nền category</label>
                <div class="color-input">
                  <input type="color" v-model="categoryBgColorHex" @input="updateCategoryBgColor()"/>
                  <input type="text" v-model="content.colors.categoryBg" placeholder="rgba(3, 19, 88, 0.1)"/>
                </div>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Typography</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="section-title-size">Kích thước tiêu đề section</label>
                <div class="input-with-unit">
                  <input type="text" id="section-title-size" v-model="content.typography.sectionTitleSize"
                         placeholder="40px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="section-title-weight">Độ đậm tiêu đề section</label>
                <input
                    type="text"
                    id="section-title-weight"
                    v-model="content.typography.sectionTitleWeight"
                    placeholder="700"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="news-title-size">Kích thước tiêu đề tin</label>
                <div class="input-with-unit">
                  <input type="text" id="news-title-size" v-model="content.typography.newsTitleSize"
                         placeholder="20px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="news-title-weight">Độ đậm tiêu đề tin</label>
                <input
                    type="text"
                    id="news-title-weight"
                    v-model="content.typography.newsTitleWeight"
                    placeholder="600"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category-size">Kích thước category</label>
                <div class="input-with-unit">
                  <input type="text" id="category-size" v-model="content.typography.categorySize"
                         placeholder="14px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="category-weight">Độ đậm category</label>
                <input
                    type="text"
                    id="category-weight"
                    v-model="content.typography.categoryWeight"
                    placeholder="500"
                />
              </div>
            </div>
          </div>

          <!-- Gradient -->
          <div class="setting-section">
            <h3><i class="fas fa-gradient"></i> Gradient</h3>

            <div class="color-input-group">
              <label>Gradient nền section</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.sectionBackground.color1" @change="updateSectionBackgroundGradient()"/>
                <input type="color" v-model="gradientColors.sectionBackground.color2" @change="updateSectionBackgroundGradient()"/>
                <input type="color" v-model="gradientColors.sectionBackground.color3" @change="updateSectionBackgroundGradient()"/>
                <input type="color" v-model="gradientColors.sectionBackground.color4" @change="updateSectionBackgroundGradient()"/>
                <input type="color" v-model="gradientColors.sectionBackground.color5" @change="updateSectionBackgroundGradient()"/>
                <input
                    type="text"
                    v-model="content.gradients.sectionBackground"
                    placeholder="linear-gradient(135deg, #0629BE 7%, #031358 22%, #0629BE 56%, #031358 81%, #0628B9 100%)"
                    @input="updateSectionBackgroundColorsFromGradient()"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="image-hover-glow">Hiệu ứng glow khi hover ảnh</label>
              <input
                  type="text"
                  id="image-hover-glow"
                  v-model="content.gradients.imageHoverGlow"
                  placeholder="0 0 20px rgba(255, 255, 255, 0.4)"
              />
            </div>
          </div>

          <!-- Shadow & Transitions -->
          <div class="setting-section">
            <h3><i class="fas fa-box-shadow"></i> Shadow & Transitions</h3>

            <div class="form-group">
              <label for="news-item-shadow">Shadow thẻ tin</label>
              <input
                  type="text"
                  id="news-item-shadow"
                  v-model="content.shadows.newsItem"
                  placeholder="0 4px 12px rgba(0, 0, 0, 0.1)"
              />
            </div>

            <div class="form-group">
              <label for="news-item-hover-shadow">Shadow khi hover thẻ tin</label>
              <input
                  type="text"
                  id="news-item-hover-shadow"
                  v-model="content.shadows.newsItemHover"
                  placeholder="0 8px 20px rgba(0, 0, 0, 0.15)"
              />
            </div>

            <div class="form-group">
              <label for="default-transition">Transition mặc định</label>
              <input
                  type="text"
                  id="default-transition"
                  v-model="content.transitions.default"
                  placeholder="all 0.3s ease"
              />
            </div>

            <div class="form-group">
              <label for="hover-transform">Transform khi hover</label>
              <input
                  type="text"
                  id="hover-transform"
                  v-model="content.transitions.hoverTransform"
                  placeholder="translateY(-5px)"
              />
            </div>
          </div>

          <!-- Responsive -->
          <div class="setting-section">
            <h3><i class="fas fa-mobile-alt"></i> Responsive</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="tablet-breakpoint">Breakpoint tablet</label>
                <div class="input-with-unit">
                  <input type="text" id="tablet-breakpoint" v-model="content.responsive.tabletBreakpoint"
                         placeholder="768px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="mobile-breakpoint">Breakpoint mobile</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-breakpoint" v-model="content.responsive.mobileBreakpoint"
                         placeholder="480px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="tablet-section-title-size">Kích thước tiêu đề tablet</label>
              <div class="input-with-unit">
                <input type="text" id="tablet-section-title-size" v-model="content.responsive.tablet.sectionTitleSize"
                       placeholder="32px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="mobile-section-title-size">Kích thước tiêu đề mobile</label>
              <div class="input-with-unit">
                <input type="text" id="mobile-section-title-size" v-model="content.responsive.mobile.sectionTitleSize"
                       placeholder="28px"/>
                <span class="unit">px</span>
              </div>
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
const activeTab = ref('general')
const isLoading = ref(false)

// Color states
const primaryColorHex = ref('#031358')
const secondaryColorHex = ref('#0629BE')
const tertiaryColorHex = ref('#0628B9')
const whiteColorHex = ref('#ffffff')
const overlayColorHex = ref('#000000')
const categoryBgColorHex = ref('#031358')

// Gradient colors state
const gradientColors = reactive({
  sectionBackground: {
    color1: '#0629BE',
    color2: '#031358',
    color3: '#0629BE',
    color4: '#031358',
    color5: '#0628B9'
  }
})

// Content structure based on new JSON data
const content = reactive({
  sectionTitle: 'TIN TỨC MỚI NHẤT',
  colors: {
    primary: '#031358',
    secondary: '#0629BE',
    tertiary: '#0628B9',
    white: '#ffffff',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
    categoryBg: 'rgba(3, 19, 88, 0.1)',
    progressBarBg: 'rgba(255, 255, 255, 0.3)',
    controlBtnBg: 'rgba(255, 255, 255, 0.9)',
    newsItemBg: 'rgba(255, 255, 255, 0.95)'
  },
  typography: {
    sectionTitleSize: '40px',
    sectionTitleWeight: '700',
    newsTitleSize: '20px',
    newsTitleWeight: '600',
    categorySize: '14px',
    categoryWeight: '500',
    dateLabelSize: '12px',
    dateLabelWeight: '500'
  },
  spacing: {
    sectionPadding: '60px 20px',
    dividerWidth: '50%',
    dividerMargin: '0 auto 40px auto',
    carouselGap: '30px',
    carouselPadding: '10px 20px',
    newsItemPadding: '10px',
    infoMarginTop: '12px',
    categoryPadding: '4px 10px',
    controlsGap: '20px',
    controlsMarginTop: '20px',
    progressBarMarginTop: '20px'
  },
  sizes: {
    newsItemWidth: '500px',
    newsImageHeight: '300px',
    controlBtnSize: '50px',
    progressBarHeight: '4px'
  },
  borderRadius: {
    newsItem: '12px',
    imageWrapper: '10px',
    dateLabel: '6px',
    category: '20px',
    controlBtn: '50%',
    progressBar: '10px'
  },
  shadows: {
    sectionTitle: '0 2px 4px rgba(0, 0, 0, 0.2)',
    newsItem: '0 4px 12px rgba(0, 0, 0, 0.1)',
    newsItemHover: '0 8px 20px rgba(0, 0, 0, 0.15)',
    controlBtn: '0 2px 8px rgba(0, 0, 0, 0.15)',
    controlBtnHover: '0 4px 12px rgba(0, 0, 0, 0.2)',
    progress: '0 0 8px rgba(255, 255, 255, 0.5)'
  },
  transitions: {
    default: 'all 0.3s ease',
    image: '0.35s ease',
    progress: 'width 0.2s ease',
    hoverTransform: 'translateY(-5px)',
    imageHoverTransform: 'scale(1.05)',
    controlBtnHoverTransform: 'scale(1.05)',
    controlBtnActiveTransform: 'scale(0.95)'
  },
  gradients: {
    sectionBackground: 'linear-gradient(135deg, #0629BE 7%, #031358 22%, #0629BE 56%, #031358 81%, #0628B9 100%)',
    imageHoverGlow: '0 0 20px rgba(255, 255, 255, 0.4)'
  },
  opacity: {
    divider: '0.7',
    backdropFilter: 'blur(4px)'
  },
  responsive: {
    tabletBreakpoint: '768px',
    mobileBreakpoint: '480px',
    tablet: {
      sectionPadding: '40px 15px',
      sectionTitleSize: '32px',
      dividerWidth: '70%',
      carouselGap: '20px',
      carouselPadding: '10px',
      newsItemMinWidth: '280px',
      newsTitleSize: '18px',
      controlBtnSize: '44px'
    },
    mobile: {
      sectionTitleSize: '28px',
      newsItemMinWidth: '260px',
      newsImageHeight: '180px'
    }
  }
})

// UI State
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// ========== CONSTANTS ==========
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 45

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

// Update color functions
const updatePrimaryColor = () => {
  content.colors.primary = primaryColorHex.value;
};

const updateSecondaryColor = () => {
  content.colors.secondary = secondaryColorHex.value;
};

const updateTertiaryColor = () => {
  content.colors.tertiary = tertiaryColorHex.value;
};

const updateWhiteColor = () => {
  content.colors.white = whiteColorHex.value;
};

const updateOverlayColor = () => {
  const opacity = getOpacityFromRgba(content.colors.overlay);
  content.colors.overlay = hexToRgba(overlayColorHex.value, opacity);
};

const updateCategoryBgColor = () => {
  const opacity = getOpacityFromRgba(content.colors.categoryBg);
  content.colors.categoryBg = hexToRgba(categoryBgColorHex.value, opacity);
};

// ========== GRADIENT FUNCTIONS ==========
const parseGradientColors = (gradientStr, expectedCount = 5) => {
  if (!gradientStr) {
    const defaultColors = ['#0629BE', '#031358', '#0629BE', '#031358', '#0628B9'].slice(0, expectedCount);
    return defaultColors.reduce((acc, color, index) => {
      acc[`color${index + 1}`] = color;
      return acc;
    }, {});
  }

  const hexMatches = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (hexMatches) {
    return hexMatches.reduce((acc, color, index) => {
      if (index < expectedCount) {
        acc[`color${index + 1}`] = color;
      }
      return acc;
    }, {});
  }

  const defaultColors = ['#0629BE', '#031358', '#0629BE', '#031358', '#0628B9'].slice(0, expectedCount);
  return defaultColors.reduce((acc, color, index) => {
    acc[`color${index + 1}`] = color;
    return acc;
  }, {});
};

// Section background gradient
const updateSectionBackgroundGradient = () => {
  const colors = [
    gradientColors.sectionBackground.color1,
    gradientColors.sectionBackground.color2,
    gradientColors.sectionBackground.color3,
    gradientColors.sectionBackground.color4,
    gradientColors.sectionBackground.color5
  ];

  content.gradients.sectionBackground = `linear-gradient(135deg, ${colors[0]} 7%, ${colors[1]} 22%, ${colors[2]} 56%, ${colors[3]} 81%, ${colors[4]} 100%)`;
};

const updateSectionBackgroundColorsFromGradient = () => {
  const colors = parseGradientColors(content.gradients.sectionBackground, 5);
  gradientColors.sectionBackground.color1 = colors.color1 || '#0629BE';
  gradientColors.sectionBackground.color2 = colors.color2 || '#031358';
  gradientColors.sectionBackground.color3 = colors.color3 || '#0629BE';
  gradientColors.sectionBackground.color4 = colors.color4 || '#031358';
  gradientColors.sectionBackground.color5 = colors.color5 || '#0628B9';
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
      primaryColorHex.value = content.colors.primary;
      secondaryColorHex.value = content.colors.secondary;
      tertiaryColorHex.value = content.colors.tertiary;
      whiteColorHex.value = content.colors.white;

      // Extract base colors from rgba
      overlayColorHex.value = rgbaToHex(content.colors.overlay);
      categoryBgColorHex.value = rgbaToHex(content.colors.categoryBg);

      // Initialize gradient colors
      const sectionColors = parseGradientColors(content.gradients.sectionBackground, 5);
      gradientColors.sectionBackground.color1 = sectionColors.color1 || '#0629BE';
      gradientColors.sectionBackground.color2 = sectionColors.color2 || '#031358';
      gradientColors.sectionBackground.color3 = sectionColors.color3 || '#0629BE';
      gradientColors.sectionBackground.color4 = sectionColors.color4 || '#031358';
      gradientColors.sectionBackground.color5 = sectionColors.color5 || '#0628B9';

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
    const contentData = {...content}

    // Prepare FormData
    const formData = new FormData()

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Tin mới',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 1,
      files: []
    }

    // Add section data
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }))

    // Send to API
    const response = await api.post('/cms/saveChange', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data) {
      showToast('Thay đổi đã được lưu thành công', 'success')

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
/* Các style giữ nguyên từ file gốc */
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

.setting-section:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .setting-section:last-child:nth-child(odd) {
    max-width: 100%;
  }
}

@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-section:last-child:nth-child(odd) {
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
</style>