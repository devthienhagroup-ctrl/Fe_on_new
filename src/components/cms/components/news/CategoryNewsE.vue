<template>
  <div class="category-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Danh mục tin</h2>
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
          :class="{ active: activeTab === 'layout' }"
          @click="activeTab = 'layout'"
      >
        <i class="fas fa-th-large"></i> Bố cục
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'sections' }"
          @click="activeTab = 'sections'"
      >
        <i class="fas fa-columns"></i> Các mục
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Màu sắc -->
      <div v-if="activeTab === 'colors'" class="settings-grid">
        <!-- Màu chính -->
        <div class="setting-section">
          <h3><i class="fas fa-fill-drip"></i> Màu chính</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="primary-color">Màu chính</label>
              <div class="color-input">
                <input type="color" id="primary-color" v-model="primaryColorHex" @input="updatePrimaryColor()"/>
                <input type="text" v-model="content.colors.primary" placeholder="#031358"/>
              </div>
            </div>
            <div class="form-group">
              <label for="active-color">Màu khi active</label>
              <div class="color-input">
                <input type="color" id="active-color" v-model="activeColorHex" @input="updateActiveColor()"/>
                <input type="text" v-model="content.colors.active" placeholder="#0030FF"/>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="white-color">Màu trắng</label>
              <div class="color-input">
                <input type="color" id="white-color" v-model="whiteColorHex" @input="updateWhiteColor()"/>
                <input type="text" v-model="content.colors.white" placeholder="#FFFFFF"/>
              </div>
            </div>
            <div class="form-group">
              <label for="border-color">Màu viền</label>
              <div class="color-input">
                <input type="color" id="border-color" v-model="borderColorHex" @input="updateBorderColor()"/>
                <input type="text" v-model="content.colors.border" placeholder="#e0e0e0"/>
              </div>
            </div>
          </div>
        </div>

        <!-- Màu chữ -->
        <div class="setting-section">
          <h3><i class="fas fa-text-height"></i> Màu chữ</h3>

          <div class="form-group">
            <label for="text-primary-color">Màu chữ chính</label>
            <div class="color-input">
              <input type="color" id="text-primary-color" v-model="textPrimaryColorHex" @input="updateTextPrimaryColor()"/>
              <input type="text" v-model="content.colors.text.primary" placeholder="#031358"/>
            </div>
          </div>

          <div class="form-group">
            <label for="text-secondary-color">Màu chữ phụ</label>
            <div class="color-input">
              <input type="color" id="text-secondary-color" v-model="textSecondaryColorHex" @input="updateTextSecondaryColor()"/>
              <input type="text" v-model="content.colors.text.secondary" placeholder="#6B7280"/>
            </div>
          </div>

          <div class="form-group">
            <label for="text-light-color">Màu chữ sáng</label>
            <div class="color-input">
              <input type="color" id="text-light-color" v-model="textLightColorHex" @input="updateTextLightColor()"/>
              <input type="text" v-model="content.colors.text.light" placeholder="#9CA3AF"/>
            </div>
          </div>
        </div>

        <!-- Màu nền -->
        <div class="setting-section">
          <h3><i class="fas fa-layer-group"></i> Màu nền</h3>

          <div class="form-group">
            <label for="bg-hover-color">Màu nền hover</label>
            <div class="color-input">
              <input type="color" id="bg-hover-color" v-model="bgHoverColorHex" @input="updateBgHoverColor()"/>
              <input type="text" v-model="content.colors.background.hover" placeholder="#f0f0f0"/>
            </div>
          </div>

          <div class="form-group">
            <label for="bg-search-color">Màu nút tìm kiếm</label>
            <div class="color-input">
              <input type="color" id="bg-search-color" v-model="bgSearchColorHex" @input="updateBgSearchColor()"/>
              <input type="text" v-model="content.colors.background.searchBtn" placeholder="#031358"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Kiểu chữ -->
      <div v-if="activeTab === 'typography'" class="settings-grid">
        <!-- Font chữ -->

        <!-- Kích thước chữ -->
        <div class="setting-section">
          <h3><i class="fas fa-text-width"></i> Kích thước chữ</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="category-size">Danh mục</label>
              <div class="input-with-unit">
                <input type="text" id="category-size" v-model="content.typography.sizes.category" placeholder="20px"/>
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="title-size">Tiêu đề</label>
              <div class="input-with-unit">
                <input type="text" id="title-size" v-model="content.typography.sizes.title" placeholder="20px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="subtitle-size">Phụ đề</label>
              <div class="input-with-unit">
                <input type="text" id="subtitle-size" v-model="content.typography.sizes.subtitle" placeholder="15px"/>
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="date-size">Ngày tháng</label>
              <div class="input-with-unit">
                <input type="text" id="date-size" v-model="content.typography.sizes.date" placeholder="14px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="recent-title-size">Tiêu đề "Đã xem"</label>
              <div class="input-with-unit">
                <input type="text" id="recent-title-size" v-model="content.typography.sizes.recentlyViewedTitle" placeholder="33px"/>
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="recent-item-size">Tiêu đề item "Đã xem"</label>
              <div class="input-with-unit">
                <input type="text" id="recent-item-size" v-model="content.typography.sizes.recentlyViewedItemTitle" placeholder="18px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Độ đậm chữ -->
        <div class="setting-section">
          <h3><i class="fas fa-bold"></i> Độ đậm chữ</h3>

          <div class="form-group">
            <label for="bold-weight">Độ đậm (Bold)</label>
            <input
                type="number"
                id="bold-weight"
                v-model.number="content.typography.weights.bold"
                min="100"
                max="900"
                step="100"
                placeholder="700"
            />
          </div>

          <div class="form-group">
            <label for="medium-weight">Độ đậm (Medium)</label>
            <input
                type="number"
                id="medium-weight"
                v-model.number="content.typography.weights.medium"
                min="100"
                max="900"
                step="100"
                placeholder="500"
            />
          </div>
        </div>
      </div>

      <!-- Tab Bố cục -->
      <div v-if="activeTab === 'layout'" class="settings-grid">
        <!-- Khoảng cách -->
        <div class="setting-section">
          <h3><i class="fas fa-arrows-alt-h"></i> Khoảng cách</h3>

          <div class="form-group">
            <label for="container-width">Chiều rộng container</label>
            <div class="input-with-unit">
              <input type="text" id="container-width" v-model="content.spacing.container" placeholder="1400px"/>
              <span class="unit">px</span>
            </div>
          </div>

          <div class="form-group">
            <label for="padding-size">Padding</label>
            <div class="input-with-unit">
              <input type="text" id="padding-size" v-model="content.spacing.padding" placeholder="20px"/>
              <span class="unit">px</span>
            </div>
          </div>

          <div class="form-group">
            <label for="gap-size">Khoảng cách chung</label>
            <div class="input-with-unit">
              <input type="text" id="gap-size" v-model="content.spacing.gap" placeholder="30px"/>
              <span class="unit">px</span>
            </div>
          </div>

          <div class="form-group">
            <label for="categories-gap">Khoảng cách danh mục</label>
            <div class="input-with-unit">
              <input type="text" id="categories-gap" v-model="content.spacing.categoriesGap" placeholder="25px"/>
              <span class="unit">px</span>
            </div>
          </div>

          <div class="form-group">
            <label for="item-gap">Khoảng cách item</label>
            <div class="input-with-unit">
              <input type="text" id="item-gap" v-model="content.spacing.itemGap" placeholder="15px"/>
              <span class="unit">px</span>
            </div>
          </div>
        </div>

        <!-- Bo góc -->
        <div class="setting-section">
          <h3><i class="fas fa-circle-notch"></i> Bo góc</h3>

          <div class="form-group">
            <label for="radius-small">Bo góc nhỏ</label>
            <input
                type="text"
                id="radius-small"
                v-model="content.borders.radius.small"
                placeholder="4px"
            />
          </div>

          <div class="form-group">
            <label for="radius-medium">Bo góc trung bình</label>
            <input
                type="text"
                id="radius-medium"
                v-model="content.borders.radius.medium"
                placeholder="8px"
            />
          </div>

          <div class="form-group">
            <label for="radius-round">Bo góc tròn</label>
            <input
                type="text"
                id="radius-round"
                v-model="content.borders.radius.round"
                placeholder="50%"
            />
          </div>
        </div>

        <!-- Độ dày viền -->
        <div class="setting-section">
          <h3><i class="fas fa-square"></i> Độ dày viền</h3>

          <div class="form-group">
            <label for="border-active">Viền danh mục active</label>
            <div class="input-with-unit">
              <input type="text" id="border-active" v-model="content.borders.width.categoryActive" placeholder="3px"/>
              <span class="unit">px</span>
            </div>
          </div>

          <div class="form-group">
            <label for="border-divider">Viền divider</label>
            <div class="input-with-unit">
              <input type="text" id="border-divider" v-model="content.borders.width.divider" placeholder="1px"/>
              <span class="unit">px</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Các mục -->
      <div v-if="activeTab === 'sections'" class="settings-grid">
        <!-- Kích thước -->
        <div class="setting-section">
          <h3><i class="fas fa-ruler-combined"></i> Kích thước</h3>

          <div class="form-group">
            <label for="arrow-size">Kích thước mũi tên</label>
            <div class="input-with-unit">
              <input type="text" id="arrow-size" v-model="content.sizes.arrow" placeholder="40px"/>
              <span class="unit">px</span>
            </div>
          </div>

          <div class="form-group">
            <label for="news-image-height">Chiều cao ảnh tin</label>
            <div class="input-with-unit">
              <input type="text" id="news-image-height" v-model="content.sizes.newsImageHeight" placeholder="150px"/>
              <span class="unit">px</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="recent-image-width">Rộng ảnh "Đã xem"</label>
              <div class="input-with-unit">
                <input type="text" id="recent-image-width" v-model="content.sizes.recentlyViewedImage.width" placeholder="80px"/>
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="recent-image-height">Cao ảnh "Đã xem"</label>
              <div class="input-with-unit">
                <input type="text" id="recent-image-height" v-model="content.sizes.recentlyViewedImage.height" placeholder="60px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Hiệu ứng -->
        <div class="setting-section">
          <h3><i class="fas fa-magic"></i> Hiệu ứng</h3>

          <div class="form-group">
            <label for="shadow">Đổ bóng</label>
            <input
                type="text"
                id="shadow"
                v-model="content.shadows.default"
                placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
            />
          </div>

          <div class="form-group">
            <label for="transition">Transition</label>
            <input
                type="text"
                id="transition"
                v-model="content.transitions.default"
                placeholder="all 0.3s ease"
            />
          </div>
        </div>

        <!-- Các mục -->
        <div class="setting-section">
          <h3><i class="fas fa-th-list"></i> Các mục</h3>

          <div class="form-group">
            <label for="recently-viewed-title">Tiêu đề "Đã xem gần đây"</label>
            <input
                type="text"
                id="recently-viewed-title"
                v-model="content.sections.recentlyViewed.title"
                placeholder="Đã xem gần đây"
            />
          </div>
        </div>

        <!-- Responsive -->
        <div class="setting-section">
          <h3><i class="fas fa-mobile-alt"></i> Responsive</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="desktop-breakpoint">Desktop</label>
              <div class="input-with-unit">
                <input type="text" id="desktop-breakpoint" v-model="content.responsive.breakpoints.desktop" placeholder="1024px"/>
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="tablet-breakpoint">Tablet</label>
              <div class="input-with-unit">
                <input type="text" id="tablet-breakpoint" v-model="content.responsive.breakpoints.tablet" placeholder="768px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="mobile-breakpoint">Mobile</label>
              <div class="input-with-unit">
                <input type="text" id="mobile-breakpoint" v-model="content.responsive.breakpoints.mobile" placeholder="480px"/>
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="small-mobile-breakpoint">Small Mobile</label>
              <div class="input-with-unit">
                <input type="text" id="small-mobile-breakpoint" v-model="content.responsive.breakpoints.smallMobile" placeholder="640px"/>
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

// ========== STATE MANAGEMENT ==========
const activeTab = ref('colors')
const isLoading = ref(false)

// Color states
const primaryColorHex = ref('#031358')
const activeColorHex = ref('#0030FF')
const whiteColorHex = ref('#FFFFFF')
const borderColorHex = ref('#e0e0e0')
const textPrimaryColorHex = ref('#031358')
const textSecondaryColorHex = ref('#6B7280')
const textLightColorHex = ref('#9CA3AF')
const bgHoverColorHex = ref('#f0f0f0')
const bgSearchColorHex = ref('#031358')

// Content structure based on new JSON data
const content = reactive({
  colors: {
    primary: '#031358',
    active: '#0030FF',
    white: '#FFFFFF',
    text: {
      primary: '#031358',
      secondary: '#6B7280',
      light: '#9CA3AF'
    },
    border: '#e0e0e0',
    background: {
      hover: '#f0f0f0',
      searchBtn: '#031358'
    }
  },
  typography: {
    fontFamily: "'Ubuntu', sans-serif",
    sizes: {
      category: '20px',
      title: '20px',
      subtitle: '15px',
      date: '14px',
      recentlyViewedTitle: '33px',
      recentlyViewedItemTitle: '18px'
    },
    weights: {
      bold: 700,
      medium: 500
    }
  },
  spacing: {
    container: '1400px',
    padding: '20px',
    gap: '30px',
    categoriesGap: '25px',
    itemGap: '15px'
  },
  borders: {
    radius: {
      small: '4px',
      medium: '8px',
      round: '50%'
    },
    width: {
      categoryActive: '3px',
      divider: '1px'
    }
  },
  shadows: {
    default: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    default: 'all 0.3s ease'
  },
  sizes: {
    arrow: '40px',
    newsImageHeight: '150px',
    recentlyViewedImage: {
      width: '80px',
      height: '60px'
    }
  },
  sections: {
    recentlyViewed: {
      title: 'Đã xem gần đây'
    }
  },
  responsive: {
    breakpoints: {
      desktop: '1024px',
      tablet: '768px',
      mobile: '480px',
      smallMobile: '640px'
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
const SECTION_ID = 46

// ========== COLOR UTILITY FUNCTIONS ==========
// Chuyển đổi từ hex sang rgba
const hexToRgba = (hex, opacity = 1) => {
  if (!hex) return `rgba(0, 0, 0, ${opacity})`;

  // Remove # if present
  hex = hex.replace('#', '');

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Chuyển đổi từ rgba sang hex
const rgbaToHex = (rgba) => {
  if (!rgba) return '#000000';

  // If already hex, return as is
  if (rgba.startsWith('#')) {
    // Ensure 6-digit hex
    if (rgba.length === 4) {
      // Convert #abc to #aabbcc
      return '#' + rgba.slice(1).split('').map(c => c + c).join('');
    }
    return rgba;
  }

  // Parse rgba string
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);

  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  }

  // Try to parse as simple hex or color name
  if (rgba.includes('#')) {
    return rgba;
  }

  // Default fallback
  return '#000000';
};

// ========== COLOR FUNCTIONS ==========
const updatePrimaryColor = () => {
  content.colors.primary = primaryColorHex.value;
};

const updateActiveColor = () => {
  content.colors.active = activeColorHex.value;
};

const updateWhiteColor = () => {
  content.colors.white = whiteColorHex.value;
};

const updateBorderColor = () => {
  content.colors.border = borderColorHex.value;
};

const updateTextPrimaryColor = () => {
  content.colors.text.primary = textPrimaryColorHex.value;
};

const updateTextSecondaryColor = () => {
  content.colors.text.secondary = textSecondaryColorHex.value;
};

const updateTextLightColor = () => {
  content.colors.text.light = textLightColorHex.value;
};

const updateBgHoverColor = () => {
  content.colors.background.hover = bgHoverColorHex.value;
};

const updateBgSearchColor = () => {
  content.colors.background.searchBtn = bgSearchColorHex.value;
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
      activeColorHex.value = rgbaToHex(content.colors.active);
      whiteColorHex.value = rgbaToHex(content.colors.white);
      borderColorHex.value = rgbaToHex(content.colors.border);
      textPrimaryColorHex.value = rgbaToHex(content.colors.text.primary);
      textSecondaryColorHex.value = rgbaToHex(content.colors.text.secondary);
      textLightColorHex.value = rgbaToHex(content.colors.text.light);
      bgHoverColorHex.value = rgbaToHex(content.colors.background.hover);
      bgSearchColorHex.value = rgbaToHex(content.colors.background.searchBtn);

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

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Danh mục tin',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 2,
      files: []
    }

    // Send to API
    const response = await api.post('/cms/saveChange', sectionData)

    if (response.data) {
      showToast('Thay đổi đã được lưu thành công', 'success')
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
.category-editor {
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
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
}

.form-group input:focus {
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