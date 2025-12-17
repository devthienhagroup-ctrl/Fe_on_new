<template>
  <div class="impressive-numbers-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Những con số ấn tượng</h2>
      <div class="header-controls">
        <button class="btn btn-primary" @click="addNewAchievement">
          <i class="fas fa-plus"></i> Thêm Thành tựu Mới
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
          :class="{ active: activeTab === 'achievements' }"
          @click="activeTab = 'achievements'"
      >
        <i class="fas fa-chart-line"></i> Danh sách thành tựu ({{ achievements.length }})
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab cài đặt chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Tiêu đề & Mô tả -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề & Mô tả</h3>
            <div class="form-group">
              <label for="section-title">Tiêu đề chính</label>
              <input
                  type="text"
                  id="section-title"
                  v-model="settings.sectionTitle"
                  placeholder="NHỮNG CON SỐ ẤN TƯỢNG"
              />
            </div>
            <div class="form-group">
              <label for="section-subtitle">Mô tả phụ</label>
              <textarea
                  id="section-subtitle"
                  v-model="settings.sectionSubtitle"
                  rows="3"
                  placeholder="Thiên Hà Group tự hào về những thành tựu đã đạt được..."
              ></textarea>
            </div>
          </div>

          <!-- Màu sắc chính -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc chính</h3>
            <div class="color-grid">
              <div class="color-input-group form-group">
                <label>Màu nền</label>
                <div class="color-input">
                  <input type="color" v-model="backgroundColorHex" @change="updateBackgroundColor" />
                  <input type="text" v-model="settings.backgroundColor" placeholder="rgb(10, 36, 99)" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu chữ</label>
                <div class="color-input">
                  <input type="color" v-model="textColorHex" @change="updateTextColor" />
                  <input type="text" v-model="settings.textColor" placeholder="#ffffff" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu icon</label>
                <div class="color-input">
                  <input type="color" v-model="iconColorHex" @change="updateIconColor" />
                  <input type="text" v-model="settings.iconColor" placeholder="#ffffff" />
                </div>
              </div>
            </div>
          </div>

          <!-- Màu sắc Card -->
          <div class="setting-section">
            <h3><i class="fas fa-layer-group"></i> Màu sắc Card</h3>
            <div class="color-grid">
              <div class="color-input-group form-group">
                <label>Nền card</label>
                <div class="color-input">
                  <input type="color" v-model="cardBgColorHex" @change="updateCardBgColor" />
                  <input type="text" v-model="settings.cardBackgroundColor" placeholder="rgba(255, 255, 255, 0.1)" />
                </div>
                <p class="hint-text">Opacity gợi ý: 0.1</p>
              </div>
              <div class="color-input-group form-group">
                <label>Viền card</label>
                <div class="color-input">
                  <input type="color" v-model="cardBorderColorHex" @change="updateCardBorderColor" />
                  <input type="text" v-model="settings.cardBorderColor" placeholder="rgba(255, 255, 255, 0.2)" />
                </div>
                <p class="hint-text">Opacity gợi ý: 0.2</p>
              </div>
              <div class="color-input-group form-group">
                <label>Đổ bóng card</label>
                <div class="color-input">
                  <input type="color" v-model="cardShadowColorHex" @change="updateCardShadowColor" />
                  <input type="text" v-model="settings.cardShadowColor" placeholder="rgba(0, 0, 0, 0.3)" />
                </div>
                <p class="hint-text">Opacity gợi ý: 0.3</p>
              </div>
            </div>
          </div>

          <!-- Kích thước chữ -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Kích thước chữ</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="title-font-size">Tiêu đề</label>
                <div class="input-with-unit">
                  <input type="text" id="title-font-size" v-model="settings.titleFontSize" placeholder="33px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="subtitle-font-size">Mô tả phụ</label>
                <div class="input-with-unit">
                  <input type="text" id="subtitle-font-size" v-model="settings.subtitleFontSize" placeholder="20px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="number-font-size">Số</label>
                <div class="input-with-unit">
                  <input type="text" id="number-font-size" v-model="settings.numberFontSize" placeholder="48px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="description-font-size">Mô tả</label>
                <div class="input-with-unit">
                  <input type="text" id="description-font-size" v-model="settings.descriptionFontSize" placeholder="16px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="icon-size">Kích thước icon</label>
              <div class="input-with-unit">
                <input type="text" id="icon-size" v-model="settings.iconSize" placeholder="70px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Card & Layout -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Card & Layout</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="card-main-width">Card chính - Rộng</label>
                <div class="input-with-unit">
                  <input type="text" id="card-main-width" v-model="settings.cardMainWidth" placeholder="450px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="card-main-height">Card chính - Cao</label>
                <div class="input-with-unit">
                  <input type="text" id="card-main-height" v-model="settings.cardMainHeight" placeholder="350px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="card-side-width">Card phụ - Rộng</label>
                <div class="input-with-unit">
                  <input type="text" id="card-side-width" v-model="settings.cardSideWidth" placeholder="120px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="card-side-height">Card phụ - Cao</label>
                <div class="input-with-unit">
                  <input type="text" id="card-side-height" v-model="settings.cardSideHeight" placeholder="120px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="card-border-radius">Bo góc card</label>
                <div class="input-with-unit">
                  <input type="text" id="card-border-radius" v-model="settings.cardBorderRadius" placeholder="20px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="background-opacity">Độ mờ nền</label>
                <div class="slider-with-value">
                  <input
                      type="range"
                      id="background-opacity"
                      v-model="settings.backgroundOpacity"
                      min="0"
                      max="1"
                      step="0.1"
                  />
                  <span class="slider-value">{{ settings.backgroundOpacity }}</span>
                </div>
                <p class="hint-text">Gợi ý: 0.7</p>
              </div>
            </div>
          </div>

          <!-- Hình nền -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Hình nền</h3>
            <div class="form-group">
              <label for="background-alt">Alt hình nền</label>
              <input
                  type="text"
                  id="background-alt"
                  v-model="settings.backgroundAlt"
                  placeholder="Background"
              />
            </div>

            <!-- Upload hình nền -->
            <div class="file-upload-section">
              <label><i class="fas fa-upload"></i> Tải lên hình nền mới</label>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerBackgroundImageInput" @dragover.prevent @drop.prevent="handleBackgroundImageDrop">
                  <input type="file" ref="backgroundImageInput" @change="handleBackgroundImageUpload" accept="image/*" style="display: none" />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                </div>
                <div v-if="settings.backgroundImage && !settings.backgroundImage.startsWith('http')" class="upload-preview">
                  <img :src="getImageUrl(settings.backgroundImage)" alt="Background Preview" />
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewBackgroundImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeBackgroundImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              <p class="input-hint">Tải ảnh lên từ máy tính của bạn (JPG, PNG, GIF, WebP)</p>
            </div>
          </div>

          <!-- Hiệu ứng & Carousel -->
          <div class="setting-section">
            <h3><i class="fas fa-magic"></i> Hiệu ứng & Carousel</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="transition-duration">Thời gian chuyển tiếp</label>
                <div class="input-with-unit">
                  <input type="text" id="transition-duration" v-model="settings.transitionDuration" placeholder="0.6s" />
                  <span class="unit">s</span>
                </div>
              </div>
              <div class="form-group">
                <label for="auto-play-interval">Tự động chạy</label>
                <div class="input-with-unit">
                  <input type="number" id="auto-play-interval" v-model="settings.autoPlayInterval" placeholder="4000" />
                  <span class="unit">ms</span>
                </div>
              </div>
            </div>
            <div class="color-grid">
              <div class="color-input-group form-group">
                <label>Màu indicator</label>
                <div class="color-input">
                  <input type="color" v-model="indicatorColorHex" @change="updateIndicatorColor" />
                  <input type="text" v-model="settings.indicatorColor" placeholder="rgba(255, 255, 255, 0.3)" />
                </div>
                <p class="hint-text">Opacity gợi ý: 0.3</p>
              </div>
              <div class="color-input-group form-group">
                <label>Màu indicator active</label>
                <div class="color-input">
                  <input type="color" v-model="indicatorActiveColorHex" @change="updateIndicatorActiveColor" />
                  <input type="text" v-model="settings.indicatorActiveColor" placeholder="#ffffff" />
                </div>
              </div>
            </div>
            <div class="color-grid">
              <div class="color-input-group form-group">
                <label>Nút điều hướng - Nền</label>
                <div class="color-input">
                  <input type="color" v-model="navButtonBgHex" @change="updateNavButtonBg" />
                  <input type="text" v-model="settings.navButtonBg" placeholder="rgba(255, 255, 255, 0.2)" />
                </div>
                <p class="hint-text">Opacity gợi ý: 0.2</p>
              </div>
              <div class="color-input-group form-group">
                <label>Nút điều hướng - Viền</label>
                <div class="color-input">
                  <input type="color" v-model="navButtonBorderHex" @change="updateNavButtonBorder" />
                  <input type="text" v-model="settings.navButtonBorder" placeholder="rgba(255, 255, 255, 0.3)" />
                </div>
                <p class="hint-text">Opacity gợi ý: 0.3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab danh sách thành tựu -->
      <div v-if="activeTab === 'achievements'" class="achievements-management">
        <div class="achievements-container">
          <!-- Danh sách thành tựu -->
          <div class="achievements-list">
            <div
                v-for="(achievement, index) in achievements"
                :key="achievement.id"
                class="achievement-item"
                :class="{ active: activeAchievementIndex === index, 'top-achievement': hasTopAchievement && index === topAchievementIndex }"
                @mouseenter="hoveredAchievementIndex = index"
                @mouseleave="hoveredAchievementIndex = -1"
                @click="selectAchievement(index)"
            >
              <div class="achievement-content">
                <div class="achievement-icon" v-if="achievement.icon">
                  <i :class="achievement.icon"></i>
                </div>
                <div class="achievement-info">
                  <h4>{{ achievement.title || 'Thành tựu chưa có tên' }}</h4>
                  <p class="achievement-number">{{ achievement.number || 0 }}</p>
                  <p class="achievement-index">Thành tựu {{ index + 1 }}</p>
                </div>
              </div>
              <div class="achievement-actions" v-show="hoveredAchievementIndex === index">
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeAchievement(index)"
                    :disabled="achievements.length <= 1"
                    title="Xóa thành tựu"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
              <div v-if="hasTopAchievement && index === topAchievementIndex" class="top-badge">
                <i class="fas fa-crown"></i> Top
              </div>
            </div>
          </div>

          <!-- Form chỉnh sửa thành tựu -->
          <div v-if="activeAchievement !== null" class="achievement-editor">
            <div class="editor-header">
              <h3>Chỉnh sửa thành tựu {{ activeAchievementIndex + 1 }}</h3>
              <div class="editor-actions">
                <button class="btn btn-secondary" @click="duplicateAchievement">
                  <i class="fas fa-copy"></i> Nhân bản
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveAchievementUp(activeAchievementIndex)"
                    :disabled="activeAchievementIndex === 0"
                    title="Di chuyển lên"
                >
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveAchievementDown(activeAchievementIndex)"
                    :disabled="activeAchievementIndex === achievements.length - 1"
                    title="Di chuyển xuống"
                >
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="achievement-icon">
                <i class="fas fa-icons"></i> Biểu tượng
                <span class="required-mark">*</span>
              </label>
              <IconPicker v-model="activeAchievement.icon" title="Chọn biểu tượng cho thành tựu" />
            </div>

            <div class="form-group">
              <label for="achievement-number">
                <i class="fas fa-hashtag"></i> Con số
                <span class="required-mark">*</span>
              </label>
              <input
                  type="number"
                  id="achievement-number"
                  v-model.number="activeAchievement.number"
                  placeholder="Nhập con số..."
                  min="0"
              />
            </div>

            <div class="form-group">
              <label for="achievement-title">
                <i class="fas fa-heading"></i> Tiêu đề
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="achievement-title"
                  v-model="activeAchievement.title"
                  placeholder="Nhập tiêu đề thành tựu..."
              />
            </div>

            <div class="form-group">
              <label for="achievement-description">
                <i class="fas fa-align-left"></i> Mô tả chi tiết
                <span class="required-mark">*</span>
              </label>
              <textarea
                  id="achievement-description"
                  v-model="activeAchievement.description"
                  rows="4"
                  placeholder="Nhập mô tả chi tiết về thành tựu..."
              ></textarea>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                    type="checkbox"
                    v-model="activeAchievement.isTop"
                    :disabled="hasTopAchievement && !activeAchievement.isTop"
                    @change="handleTopAchievementChange"
                />
                <span class="checkmark"></span>
                Đây là thành tựu nổi bật (Top)
              </label>
              <p class="input-hint" v-if="hasTopAchievement && !activeAchievement.isTop">
                Chỉ có thể có 1 thành tựu Top. Hãy bỏ chọn thành tựu Top hiện tại trước.
              </p>
              <p class="input-hint" v-else>
                Thành tựu nổi bật sẽ được hiển thị nổi bật hơn (chỉ có 1 thành tựu Top)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem trước ảnh nền -->
    <div v-if="showBackgroundPreviewModal" class="modal-overlay" @click="closeBackgroundPreviewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xem trước ảnh nền</h3>
          <button class="btn-icon btn-close-modal" @click="closeBackgroundPreviewModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="getImageUrl(settings.backgroundImage)" alt="Xem trước ảnh nền" />
            <div v-if="!settings.backgroundImage" class="preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Chưa có ảnh nền để xem trước</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closeBackgroundPreviewModal">Đóng</button>
            <button class="btn btn-primary" @click="triggerBackgroundImageInput">Thay đổi ảnh</button>
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
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
import { baseImgaeUrl } from "../../../../assets/js/global.js";

// ========== STATE MANAGEMENT ==========
const achievements = ref([])
const activeAchievementIndex = ref(0)
const activeAchievement = computed(() =>
    activeAchievementIndex.value !== null && achievements.value.length > 0
        ? achievements.value[activeAchievementIndex.value]
        : null
)

const activeTab = ref('general')
const hoveredAchievementIndex = ref(-1)

// Color hex values for color inputs
const backgroundColorHex = ref('#0a2463')
const textColorHex = ref('#ffffff')
const iconColorHex = ref('#ffffff')
const cardBgColorHex = ref('#ffffff')
const cardBorderColorHex = ref('#ffffff')
const cardShadowColorHex = ref('#000000')
const indicatorColorHex = ref('#ffffff')
const indicatorActiveColorHex = ref('#ffffff')
const navButtonBgHex = ref('#ffffff')
const navButtonBorderHex = ref('#ffffff')

// Settings object with structure from JSON
const settings = reactive({
  sectionTitle: "NHỮNG CON SỐ ẤN TƯỢNG",
  sectionSubtitle: "Thiên Hà Group tự hào về những thành tựu đã đạt được trong những năm qua. Dưới đây là một số thành tựu nổi bật:",
  backgroundImage: "/imgs/building.jpg",
  backgroundAlt: "Background",
  backgroundColor: "rgb(10, 36, 99)",
  backgroundOpacity: 0.7,
  cardBackgroundColor: "rgba(255, 255, 255, 0.1)",
  cardBorderColor: "rgba(255, 255, 255, 0.2)",
  cardShadowColor: "rgba(0, 0, 0, 0.3)",
  cardBorderRadius: "20px",
  cardMainWidth: "450px",
  cardMainHeight: "350px",
  cardSideWidth: "120px",
  cardSideHeight: "120px",
  textColor: "white",
  titleFontSize: "33px",
  subtitleFontSize: "20px",
  numberFontSize: "48px",
  descriptionFontSize: "16px",
  iconColor: "white",
  iconSize: "70px",
  navButtonBg: "rgba(255, 255, 255, 0.2)",
  navButtonBorder: "rgba(255, 255, 255, 0.3)",
  indicatorColor: "rgba(255, 255, 255, 0.3)",
  indicatorActiveColor: "white",
  transitionDuration: "0.6s",
  autoPlayInterval: 4000
})

// UI State
const isLoading = ref(false)
const backgroundImagePreview = ref(null)
const showBackgroundPreviewModal = ref(false)

// File management
const files = ref([])
const backgroundImageInput = ref(null)
const uploadedFiles = ref([])

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// ========== COMPUTED PROPERTIES ==========
const hasTopAchievement = computed(() => {
  return achievements.value.some(a => a.isTop)
})

const topAchievementIndex = computed(() => {
  return achievements.value.findIndex(a => a.isTop)
})

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

// Color conversion helpers
const rgbToHex = (rgb) => {
  if (!rgb || !rgb.startsWith('rgb')) return '#ffffff';

  try {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return '#ffffff';

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return '#ffffff';
  }
}

const hexToRgb = (hex, opacity = 1) => {
  if (!hex || !hex.startsWith('#')) return `rgba(255, 255, 255, ${opacity})`;

  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch {
    return `rgba(255, 255, 255, ${opacity})`;
  }
}

// Color update functions
const updateBackgroundColor = () => {
  settings.backgroundColor = hexToRgb(backgroundColorHex.value, 1);
}

const updateTextColor = () => {
  settings.textColor = backgroundColorHex.value;
}

const updateIconColor = () => {
  settings.iconColor = iconColorHex.value;
}

const updateCardBgColor = () => {
  settings.cardBackgroundColor = hexToRgb(cardBgColorHex.value, 0.1);
}

const updateCardBorderColor = () => {
  settings.cardBorderColor = hexToRgb(cardBorderColorHex.value, 0.2);
}

const updateCardShadowColor = () => {
  settings.cardShadowColor = hexToRgb(cardShadowColorHex.value, 0.3);
}

const updateIndicatorColor = () => {
  settings.indicatorColor = hexToRgb(indicatorColorHex.value, 0.3);
}

const updateIndicatorActiveColor = () => {
  settings.indicatorActiveColor = indicatorActiveColorHex.value;
}

const updateNavButtonBg = () => {
  settings.navButtonBg = hexToRgb(navButtonBgHex.value, 0.2);
}

const updateNavButtonBorder = () => {
  settings.navButtonBorder = hexToRgb(navButtonBorderHex.value, 0.3);
}

// Initialize color hex values from settings
const initializeColorHexValues = () => {
  backgroundColorHex.value = rgbToHex(settings.backgroundColor);
  textColorHex.value = rgbToHex(settings.textColor);
  iconColorHex.value = rgbToHex(settings.iconColor);
  cardBgColorHex.value = rgbToHex(settings.cardBackgroundColor);
  cardBorderColorHex.value = rgbToHex(settings.cardBorderColor);
  cardShadowColorHex.value = rgbToHex(settings.cardShadowColor);
  indicatorColorHex.value = rgbToHex(settings.indicatorColor);
  indicatorActiveColorHex.value = rgbToHex(settings.indicatorActiveColor);
  navButtonBgHex.value = rgbToHex(settings.navButtonBg);
  navButtonBorderHex.value = rgbToHex(settings.navButtonBorder);
}

// ========== CONSTANTS ==========
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/6')

    if (response.data && response.data.contentJson) {
      const content = JSON.parse(response.data.contentJson)

      // Load settings
      Object.assign(settings, content)

      // Remove achievements from settings as they will be handled separately
      if (content.achievements) {
        delete settings.achievements
      }

      // Initialize color hex values
      initializeColorHexValues()

      // Load achievements
      if (content.achievements && Array.isArray(content.achievements)) {
        achievements.value = content.achievements.map((achievement, index) => ({
          id: achievement.id || `achievement-${Date.now()}-${index}`,
          icon: achievement.icon || '',
          title: achievement.title || '',
          description: achievement.description || '',
          number: achievement.number || 0,
          isTop: achievement.isTop || false
        }))
      } else {
        achievements.value = []
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
      }

      uploadedFiles.value = []
      showToast('Dữ liệu đã được tải thành công', 'success')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu từ server', 'error')

    // Fallback to default achievements
    if (achievements.value.length === 0) {
      achievements.value = [createNewAchievement()]
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
      achievements: achievements.value.map(achievement => ({
        id: achievement.id,
        icon: achievement.icon,
        title: achievement.title,
        description: achievement.description,
        number: achievement.number,
        isTop: achievement.isTop
      }))
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: 6,
      name: 'Những con số ấn tượng',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 5,
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
              // Update background image URL from temp to real
              if (settings.backgroundImage === TEMP_PREFIX + file.tempName) {
                settings.backgroundImage = savedFile.filename
              }
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
      backgroundImagePreview.value = null

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

// ========== ACHIEVEMENT MANAGEMENT ==========
const createNewAchievement = () => ({
  id: `achievement-${Date.now()}-${Math.random()}`,
  icon: '',
  title: '',
  description: '',
  number: 0,
  isTop: false
})

const addNewAchievement = () => {
  const newAchievement = createNewAchievement()
  achievements.value.push(newAchievement)
  activeAchievementIndex.value = achievements.value.length - 1
  activeTab.value = 'achievements'
  showToast('Đã thêm thành tựu mới', 'success')
}

const selectAchievement = (index) => {
  activeAchievementIndex.value = index
}

const moveAchievementUp = (index) => {
  if (index > 0) {
    const temp = achievements.value[index]
    achievements.value[index] = achievements.value[index - 1]
    achievements.value[index - 1] = temp
    activeAchievementIndex.value = index - 1
    showToast('Đã di chuyển thành tựu lên', 'success')
  }
}

const moveAchievementDown = (index) => {
  if (index < achievements.value.length - 1) {
    const temp = achievements.value[index]
    achievements.value[index] = achievements.value[index + 1]
    achievements.value[index + 1] = temp
    activeAchievementIndex.value = index + 1
    showToast('Đã di chuyển thành tựu xuống', 'success')
  }
}

const removeAchievement = (index) => {
  if (achievements.value.length <= 1) {
    showToast('Không thể xóa thành tựu cuối cùng', 'warning')
    return
  }

  const achievement = achievements.value[index]

  // If removing the top achievement, clear the top flag
  if (achievement.isTop) {
    achievement.isTop = false
  }

  achievements.value.splice(index, 1)

  if (activeAchievementIndex.value >= achievements.value.length) {
    activeAchievementIndex.value = achievements.value.length - 1
  }

  showToast('Đã xóa thành tựu', 'success')
}

const duplicateAchievement = () => {
  if (!activeAchievement.value) return

  const duplicate = {
    ...JSON.parse(JSON.stringify(activeAchievement.value)),
    id: `achievement-${Date.now()}-${Math.random()}`
  }

  // Don't duplicate the top flag
  duplicate.isTop = false

  achievements.value.splice(activeAchievementIndex.value + 1, 0, duplicate)
  activeAchievementIndex.value += 1
  showToast('Đã nhân bản thành tựu', 'success')
}

const handleTopAchievementChange = () => {
  if (activeAchievement.value.isTop) {
    // Unset top flag from other achievements
    achievements.value.forEach((achievement, index) => {
      if (index !== activeAchievementIndex.value && achievement.isTop) {
        achievement.isTop = false
      }
    })
  }
}

// ========== BACKGROUND IMAGE UPLOAD MANAGEMENT ==========
const triggerBackgroundImageInput = () => {
  backgroundImageInput.value?.click()
}

const handleBackgroundImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP', 'error')
    return
  }

  if (file.size > maxSize) {
    showToast('Kích thước file không được vượt quá 5MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Handle old background image
    if (settings.backgroundImage) {
      const oldImageUrl = settings.backgroundImage

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

    // Update settings
    settings.backgroundImage = tempUrl
    backgroundImagePreview.value = previewUrl

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

const handleBackgroundImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleBackgroundImageUpload(fakeEvent)
  }
}

const removeBackgroundImage = () => {
  const imageUrl = settings.backgroundImage

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

    settings.backgroundImage = ''
    backgroundImagePreview.value = null

    showToast('Đã xóa ảnh nền', 'success')
  }
}

const previewBackgroundImage = () => {
  if (settings.backgroundImage) {
    showBackgroundPreviewModal.value = true
  } else {
    showToast('Không có ảnh nền để xem trước', 'warning')
  }
}

const closeBackgroundPreviewModal = () => {
  showBackgroundPreviewModal.value = false
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})

watch(() => achievements.value, (newAchievements) => {
  console.log('Achievements updated:', newAchievements.length)
  // Ensure only one top achievement
  const topAchievements = newAchievements.filter(a => a.isTop)
  if (topAchievements.length > 1) {
    // Keep only the first one as top
    let foundFirst = false
    newAchievements.forEach(achievement => {
      if (achievement.isTop) {
        if (!foundFirst) {
          foundFirst = true
        } else {
          achievement.isTop = false
        }
      }
    })
  }
}, { deep: true })
</script>

<style scoped>
.impressive-numbers-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
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
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
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
  min-height: 500px;
}

/* General Settings */
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

.setting-section h3 i {
  color: #4a6cf7;
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

.form-group input[type="range"] {
  width: calc(100% - 50px);
  height: 6px;
  -webkit-appearance: none;
  background: #e9ecef;
  border-radius: 3px;
  outline: none;
  margin-right: 10px;
}

.form-group input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #4a6cf7;
  border-radius: 50%;
  cursor: pointer;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Color Input */
.color-grid {
  display: flex;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  flex-direction: column;
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
}

/* Slider with value */
.slider-with-value {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-value {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
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

/* Hint text */
.hint-text {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 4px;
  margin-bottom: 0;
  font-style: italic;
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

/* Required Mark */
.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

/* Achievements Management */
.achievements-management {
  display: flex;
  gap: 30px;
  height: 100%;
}

.achievements-container {
  display: flex;
  gap: 30px;
  width: 100%;
  height: 600px;
}

.achievements-list {
  flex: 1;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

.achievement-editor {
  flex: 2;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e9ecef;
  max-height: 100%;
  overflow-y: auto;
}

/* Achievement Item */
.achievement-item {
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  position: relative;
}

.achievement-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e9ecef;
}

.achievement-item.active {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.achievement-item.top-achievement {
  border: 2px solid #ffc107;
  background: linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%);
}

.achievement-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.achievement-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.achievement-item.top-achievement .achievement-icon {
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-info h4 {
  margin: 0 0 6px 0;
  color: #031358;
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.achievement-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #031358;
  margin: 4px 0;
  line-height: 1;
}

.achievement-item.top-achievement .achievement-number {
  color: #ff9800;
  font-weight: 800;
}

.achievement-index {
  margin: 0;
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: 500;
}

.achievement-actions {
  flex-shrink: 0;
  margin-left: 10px;
}

/* Top achievement badge */
.top-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: #856404;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
  z-index: 1;
}

.top-badge i {
  font-size: 0.8rem;
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
}

/* Achievement Editor */
.achievement-editor .editor-header {
  background: none;
  color: inherit;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.achievement-editor .editor-header h3 {
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
  display: flex;
  gap: 10px;
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
  max-width: 300px;
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
}

.btn-preview-action:hover {
  background-color: white;
  transform: scale(1.1);
  color: #4a6cf7;
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
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
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
  .achievements-container {
    flex-direction: column;
    height: auto;
  }

  .achievements-list {
    max-width: 100%;
    max-height: 300px;
  }

  .achievement-editor {
    max-height: none;
  }

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

  .color-grid {
    grid-template-columns: 1fr;
  }

  .navigation-tabs {
    padding: 0 20px;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.9rem;
  }

  .achievement-editor .editor-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .editor-actions {
    width: 100%;
    justify-content: flex-start;
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

  .achievement-number {
    font-size: 1.3rem;
  }

  .top-badge {
    font-size: 0.65rem;
    padding: 3px 6px;
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

  .achievement-item {
    padding: 12px 15px;
  }

  .achievement-icon {
    width: 35px;
    height: 35px;
    font-size: 1.1rem;
  }

  .achievement-number {
    font-size: 1.1rem;
  }

  .modal-content {
    width: 95%;
    margin: 10px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
  }
}

/* Custom scrollbar */
.achievements-list::-webkit-scrollbar,
.achievement-editor::-webkit-scrollbar,
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.achievements-list::-webkit-scrollbar-track,
.achievement-editor::-webkit-scrollbar-track,
.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.achievements-list::-webkit-scrollbar-thumb,
.achievement-editor::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.achievements-list::-webkit-scrollbar-thumb:hover,
.achievement-editor::-webkit-scrollbar-thumb:hover,
.modal-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Loading state */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}

.loading-spinner {
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
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}
</style>