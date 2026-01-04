<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Chi tiết - Nổi bật</h2>
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
          :class="{ active: activeTab === 'content' }"
          @click="activeTab = 'content'"
      >
        <i class="fas fa-font"></i> Nội dung & Văn bản
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-palette"></i> Màu sắc & Giao diện
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'notifications' }"
          @click="activeTab = 'notifications'"
      >
        <i class="fas fa-bell"></i> Thông báo
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'advanced' }"
          @click="activeTab = 'advanced'"
      >
        <i class="fas fa-sliders-h"></i> Nâng cao
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Thông tin chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Thông tin cơ bản -->
          <div class="setting-section">
            <h3><i class="fas fa-info-circle"></i> Thông tin cơ bản</h3>

            <div class="form-group">
              <label for="header-icon">Icon Header</label>
              <IconPicker v-model="content.headerIcon"/>
              <small class="form-hint">VD: fa-solid fa-hand-holding-dollar</small>
            </div>

            <div class="form-group">
              <label for="header-title">Tiêu đề header</label>
              <input
                  type="text"
                  id="header-title"
                  v-model="content.headerTitle"
                  placeholder="Cùng Thiên Hà Group mở rộng chi nhánh"
              />
            </div>

            <div class="form-group">
              <label for="progress-label">Nhãn tiến độ</label>
              <input
                  type="text"
                  id="progress-label"
                  v-model="content.progressLabel"
                  placeholder="Tiến độ hiện tại"
              />
            </div>

            <div class="form-group">
              <label for="animation-duration">Thời gian animation (ms)</label>
              <input
                  type="number"
                  id="animation-duration"
                  v-model.number="content.animationDuration"
                  min="500"
                  max="5000"
                  placeholder="1500"
              />
            </div>

            <!-- Hiển thị thông tin hình ảnh cố định -->
          </div>
        </div>
      </div>

      <!-- Tab Nội dung & Văn bản -->
      <div v-if="activeTab === 'content'" class="content-settings">
        <div class="settings-grid">
          <!-- Typography -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Typography</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="main-title-size">Kích thước tiêu đề chính</label>
                <div class="input-with-unit">
                  <input type="text" id="main-title-size" v-model="content.typography.mainTitleSize" placeholder="33px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="header-size">Kích thước header</label>
                <div class="input-with-unit">
                  <input type="text" id="header-size" v-model="content.typography.headerSize" placeholder="20px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="stat-number-size">Kích thước số thống kê</label>
                <div class="input-with-unit">
                  <input type="text" id="stat-number-size" v-model="content.typography.statNumberSize" placeholder="20px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="stat-label-size">Kích thước nhãn thống kê</label>
                <div class="input-with-unit">
                  <input type="text" id="stat-label-size" v-model="content.typography.statLabelSize" placeholder="12px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="progress-percent-size">Kích thước % tiến độ</label>
                <div class="input-with-unit">
                  <input type="text" id="progress-percent-size" v-model="content.typography.progressPercentSize" placeholder="18px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="icon-size">Kích thước icon</label>
                <div class="input-with-unit">
                  <input type="text" id="icon-size" v-model="content.typography.iconSize" placeholder="30px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Spacing -->
          <div class="setting-section">
            <h3><i class="fas fa-arrows-alt"></i> Khoảng cách</h3>

            <div class="form-group">
              <label for="section-padding">Padding section</label>
              <input type="text" id="section-padding" v-model="content.spacing.sectionPadding" placeholder="20px"/>
            </div>

            <div class="form-group">
              <label for="card-padding">Padding card</label>
              <input type="text" id="card-padding" v-model="content.spacing.cardPadding" placeholder="30px 20px"/>
            </div>

            <div class="form-group">
              <label for="text-padding">Padding text</label>
              <input type="text" id="text-padding" v-model="content.spacing.textPadding" placeholder="20px 30px"/>
            </div>

            <div class="form-group">
              <label for="stat-padding">Padding thống kê</label>
              <input type="text" id="stat-padding" v-model="content.spacing.statPadding" placeholder="30px 10px"/>
            </div>

            <div class="form-group">
              <label for="header-padding">Padding header</label>
              <input type="text" id="header-padding" v-model="content.spacing.headerPadding" placeholder="15px 20px"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Màu sắc & Giao diện -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Màu sắc cơ bản -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu sắc cơ bản</h3>

            <div class="color-input-group">
              <label>Primary Dark</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.primaryDark"/>
                <input type="text" v-model="content.colors.primaryDark" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Primary</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.primary"/>
                <input type="text" v-model="content.colors.primary" placeholder="#2a5298"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Primary Light</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.primaryLight"/>
                <input type="text" v-model="content.colors.primaryLight" placeholder="#4a7bd6"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Accent</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.accent"/>
                <input type="text" v-model="content.colors.accent" placeholder="#0030ff"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Text Dark</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.textDark"/>
                <input type="text" v-model="content.colors.textDark" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Text Light</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.textLight"/>
                <input type="text" v-model="content.colors.textLight" placeholder="#ffffff"/>
              </div>
            </div>
          </div>

          <!-- Gradient -->
          <div class="setting-section">
            <h3><i class="fas fa-fill-drip"></i> Gradient</h3>

            <div class="color-input-group">
              <label>Title Gradient</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.title.color1" @change="updateTitleGradient()"/>
                <input type="color" v-model="gradientColors.title.color2" @change="updateTitleGradient()"/>
                <input
                    type="text"
                    v-model="content.gradients.title"
                    placeholder="linear-gradient(135deg, #031358, #2a5298)"
                    @input="updateTitleColorsFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Progress Gradient</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.progress.color1" @change="updateProgressGradient()"/>
                <input type="color" v-model="gradientColors.progress.color2" @change="updateProgressGradient()"/>
                <input type="color" v-model="gradientColors.progress.color3" @change="updateProgressGradient()"/>
                <input
                    type="text"
                    v-model="content.gradients.progress"
                    placeholder="linear-gradient(90deg, #0030ff, #2a5298, #4a7bd6)"
                    @input="updateProgressColorsFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Divider Gradient</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.divider.color" @change="updateDividerGradient()"/>
                <div class="opacity-input">
                  <input type="range" v-model.number="gradientColors.divider.opacity" min="0" max="1" step="0.1" @input="updateDividerGradient()"/>
                  <span>{{ (gradientColors.divider.opacity * 100).toFixed(0) }}%</span>
                </div>
                <input
                    type="text"
                    v-model="content.gradients.divider"
                    placeholder="linear-gradient(90deg, transparent, #2a5298, transparent)"
                    @input="updateDividerColorFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Light Sweep Gradient</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.lightSweep.color" @change="updateLightSweepGradient()"/>
                <div class="opacity-input">
                  <input type="range" v-model.number="gradientColors.lightSweep.opacity" min="0" max="1" step="0.1" @input="updateLightSweepGradient()"/>
                  <span>{{ (gradientColors.lightSweep.opacity * 100).toFixed(0) }}%</span>
                </div>
                <input
                    type="text"
                    v-model="content.gradients.lightSweep"
                    placeholder="linear-gradient(90deg, transparent, rgba(200, 220, 255, 0.6), transparent)"
                    @input="updateLightSweepColorFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Progress Shine Gradient</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.progressShine.color" @change="updateProgressShineGradient()"/>
                <div class="opacity-input">
                  <input type="range" v-model.number="gradientColors.progressShine.opacity" min="0" max="1" step="0.1" @input="updateProgressShineGradient()"/>
                  <span>{{ (gradientColors.progressShine.opacity * 100).toFixed(0) }}%</span>
                </div>
                <input
                    type="text"
                    v-model="content.gradients.progressShine"
                    placeholder="linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)"
                    @input="updateProgressShineColorFromGradient()"
                />
              </div>
            </div>
          </div>

          <!-- Màu nền với opacity -->
          <div class="setting-section">
            <h3><i class="fas fa-layer-group"></i> Màu nền với Opacity</h3>

            <div class="color-input-group">
              <label>Background Light</label>
              <div class="color-input form-group">
                <input type="color" v-model="backgroundColorLight.hex" @input="updateBackgroundLightFromColor()"/>
                <div class="opacity-input">
                  <input type="range" v-model.number="backgroundColorLight.opacity" min="0" max="1" step="0.1" @input="updateBackgroundLightFromColor()"/>
                  <span>{{ (backgroundColorLight.opacity * 100).toFixed(0) }}%</span>
                </div>
                <input
                    type="text"
                    v-model="content.colors.backgroundLight"
                    placeholder="rgba(240, 245, 255, 0.7)"
                    @input="updateBackgroundLightColorFromRGBA()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Card Background</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.cardBackground"/>
                <input type="text" v-model="content.colors.cardBackground" placeholder="#e6f0ff"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Stat Background</label>
              <div class="color-input form-group">
                <input type="color" v-model="backgroundColorStat.hex" @input="updateStatBackgroundFromColor()"/>
                <div class="opacity-input">
                  <input type="range" v-model.number="backgroundColorStat.opacity" min="0" max="1" step="0.1" @input="updateStatBackgroundFromColor()"/>
                  <span>{{ (backgroundColorStat.opacity * 100).toFixed(0) }}%</span>
                </div>
                <input
                    type="text"
                    v-model="content.colors.statBackground"
                    placeholder="rgba(230, 240, 255, 0.5)"
                    @input="updateStatBackgroundColorFromRGBA()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Thông báo -->
      <div v-if="activeTab === 'notifications'" class="notifications-settings">
        <div class="settings-grid">
          <div class="setting-section" style="grid-column: 1 / -1;">
            <div class="notifications-header">
              <h3><i class="fas fa-bell"></i> Quản lý Thông báo</h3>
              <button class="btn btn-primary" @click="addNotification">
                <i class="fas fa-plus"></i> Thêm Thông báo
              </button>
            </div>

            <div class="notifications-list">
              <div v-for="(notification, index) in content.notifications" :key="index" class="notification-item">
                <div class="notification-header" @click="toggleNotificationEdit(index)">
                  <div class="notification-preview">
                    <div class="notification-icon">
                      <i :class="notification.icon"></i>
                    </div>
                    <div class="notification-message-preview">
                      {{ notification.message.length > 100 ? notification.message.substring(0, 100) + '...' : notification.message }}
                    </div>
                  </div>
                  <div class="notification-actions">
                    <button class="btn-icon" @click.stop="moveNotificationUp(index)" :disabled="index === 0">
                      <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="btn-icon" @click.stop="moveNotificationDown(index)" :disabled="index === content.notifications.length - 1">
                      <i class="fas fa-arrow-down"></i>
                    </button>
                    <button class="btn-icon btn-delete" @click.stop="removeNotification(index)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div v-if="editingNotificationIndex === index" class="notification-edit-form">
                  <div class="form-group">
                    <label for="notification-icon">Icon</label>
                    <IconPicker v-model="notification.icon"/>
                    <small class="form-hint">VD: fa-solid fa-house</small>
                  </div>

                  <div class="form-group">
                    <label for="notification-message">Nội dung thông báo</label>
                    <textarea
                        id="notification-message"
                        v-model="notification.message"
                        placeholder="Nguyễn Văn Sơn vừa chốt thành công căn hộ 2PN tại Quận 7 với giá 3.2 tỷ."
                        rows="3"
                    ></textarea>
                  </div>

                  <div class="form-actions">
                    <button class="btn btn-secondary" @click="cancelNotificationEdit">
                      Hủy
                    </button>
                    <button class="btn btn-primary" @click="saveNotificationEdit">
                      Lưu
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="content.notifications.length === 0" class="empty-notifications">
                <i class="fas fa-bell-slash"></i>
                <p>Chưa có thông báo nào được thêm</p>
                <button class="btn btn-primary" @click="addNotification">
                  <i class="fas fa-plus"></i> Thêm thông báo đầu tiên
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Nâng cao -->
      <div v-if="activeTab === 'advanced'" class="advanced-settings">
        <div class="settings-grid">
          <!-- Border Radius -->
          <div class="setting-section">
            <h3><i class="fas fa-border-all"></i> Border Radius</h3>

            <div class="form-group">
              <label for="card-border-radius">Card</label>
              <input type="text" id="card-border-radius" v-model="content.borderRadius.card" placeholder="20px"/>
            </div>

            <div class="form-group">
              <label for="progress-bar-border-radius">Progress Bar</label>
              <input type="text" id="progress-bar-border-radius" v-model="content.borderRadius.progressBar" placeholder="6px"/>
            </div>

            <div class="form-group">
              <label for="stat-item-border-radius">Stat Item</label>
              <input type="text" id="stat-item-border-radius" v-model="content.borderRadius.statItem" placeholder="8px"/>
            </div>

            <div class="form-group">
              <label for="logo-container-border-radius">Logo Container</label>
              <input type="text" id="logo-container-border-radius" v-model="content.borderRadius.logoContainer" placeholder="15px"/>
            </div>
          </div>

          <!-- Kích thước -->
          <div class="setting-section">
            <h3><i class="fas fa-expand-arrows-alt"></i> Kích thước</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="logo-width">Chiều rộng Logo</label>
                <div class="input-with-unit">
                  <input type="text" id="logo-width" v-model="content.sizes.logoWidth" placeholder="100px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="logo-height">Chiều cao Logo</label>
                <div class="input-with-unit">
                  <input type="text" id="logo-height" v-model="content.sizes.logoHeight" placeholder="100px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="progress-bar-height">Chiều cao Progress Bar</label>
              <input type="text" id="progress-bar-height" v-model="content.sizes.progressBarHeight" placeholder="12px"/>
            </div>

            <div class="form-group">
              <label for="left-line-width">Độ rộng đường bên trái</label>
              <input type="text" id="left-line-width" v-model="content.sizes.leftLineWidth" placeholder="4px"/>
            </div>
          </div>

          <!-- Animation -->
          <div class="setting-section">
            <h3><i class="fas fa-play-circle"></i> Animation</h3>

            <div class="form-group">
              <label for="sweep-duration">Sweep Duration</label>
              <input type="text" id="sweep-duration" v-model="content.animations.sweepDuration" placeholder="6s"/>
            </div>

            <div class="form-group">
              <label for="progress-pulse-duration">Progress Pulse Duration</label>
              <input type="text" id="progress-pulse-duration" v-model="content.animations.progressPulseDuration" placeholder="2s"/>
            </div>

            <div class="form-group">
              <label for="shine-duration">Shine Duration</label>
              <input type="text" id="shine-duration" v-model="content.animations.shineDuration" placeholder="2s"/>
            </div>
          </div>

          <!-- Responsive -->
          <div class="setting-section">
            <h3><i class="fas fa-mobile-alt"></i> Responsive</h3>

            <div class="form-group">
              <label for="mobile-breakpoint">Mobile Breakpoint</label>
              <input type="text" id="mobile-breakpoint" v-model="content.responsive.mobileBreakpoint" placeholder="768px"/>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="mobile-logo-width">Logo Width (Mobile)</label>
                <input type="text" id="mobile-logo-width" v-model="content.responsive.mobileLogoWidth" placeholder="80px"/>
              </div>
              <div class="form-group">
                <label for="mobile-logo-height">Logo Height (Mobile)</label>
                <input type="text" id="mobile-logo-height" v-model="content.responsive.mobileLogoHeight" placeholder="80px"/>
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
import IconPicker from "../../../RichTextEditor/IconPicker.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)
const editingNotificationIndex = ref(-1)

// Gradient colors state với opacity
const gradientColors = reactive({
  title: {
    color1: '#031358',
    color2: '#2a5298'
  },
  progress: {
    color1: '#0030ff',
    color2: '#2a5298',
    color3: '#4a7bd6'
  },
  divider: {
    color: '#2a5298',
    opacity: 1.0
  },
  lightSweep: {
    color: '#c8dcff',
    opacity: 0.6
  },
  progressShine: {
    color: '#ffffff',
    opacity: 0.4
  }
})

// Background colors với opacity
const backgroundColorLight = reactive({
  hex: '#f0f5ff',
  opacity: 0.7
})

const backgroundColorStat = reactive({
  hex: '#e6f0ff',
  opacity: 0.5
})

// Content structure based on new JSON data
const content = reactive({
  headerIcon: 'fa-solid fa-hand-holding-dollar',
  headerTitle: 'Cùng Thiên Hà Group mở rộng chi nhánh',
  progressLabel: 'Tiến độ hiện tại',
  animationDuration: 1500,
  colors: {
    primaryDark: '#031358',
    primary: '#2a5298',
    primaryLight: '#4a7bd6',
    accent: '#0030ff',
    backgroundLight: 'rgba(240, 245, 255, 0.7)',
    cardBackground: '#e6f0ff',
    textDark: '#031358',
    textLight: '#ffffff',
    statBackground: 'rgba(230, 240, 255, 0.5)'
  },
  gradients: {
    title: 'linear-gradient(135deg, #031358, #2a5298)',
    progress: 'linear-gradient(90deg, #0030ff, #2a5298, #4a7bd6)',
    divider: 'linear-gradient(90deg, transparent, #2a5298, transparent)',
    lightSweep: 'linear-gradient(90deg, transparent, rgba(200, 220, 255, 0.6), transparent)',
    progressShine: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
  },
  typography: {
    mainTitleSize: '33px',
    headerSize: '20px',
    statNumberSize: '20px',
    statLabelSize: '12px',
    progressPercentSize: '18px',
    iconSize: '30px'
  },
  spacing: {
    sectionPadding: '20px',
    cardPadding: '30px 20px',
    textPadding: '20px 30px',
    statPadding: '30px 10px',
    headerPadding: '15px 20px'
  },
  borderRadius: {
    card: '20px',
    progressBar: '6px',
    statItem: '8px',
    logoContainer: '15px'
  },
  sizes: {
    logoWidth: '100px',
    logoHeight: '100px',
    progressBarHeight: '12px',
    leftLineWidth: '4px'
  },
  animations: {
    sweepDuration: '6s',
    progressPulseDuration: '2s',
    shineDuration: '2s'
  },
  responsive: {
    mobileBreakpoint: '768px',
    mobileLogoWidth: '80px',
    mobileLogoHeight: '80px'
  },
  notifications: [
    {
      icon: 'fa-solid fa-house',
      message: 'Nguyễn Văn Sơn vừa chốt thành công căn hộ 2PN tại Quận 7 với giá 3.2 tỷ.'
    }
  ]
})

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// ========== CONSTANTS ==========
const SECTION_ID = 52

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

// ========== NOTIFICATION FUNCTIONS ==========
const addNotification = () => {
  content.notifications.push({
    icon: 'fa-solid fa-bell',
    message: 'Thông báo mới'
  })
  editingNotificationIndex.value = content.notifications.length - 1
  showToast('Đã thêm thông báo mới', 'success')
}

const removeNotification = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
    content.notifications.splice(index, 1)
    if (editingNotificationIndex.value === index) {
      editingNotificationIndex.value = -1
    } else if (editingNotificationIndex.value > index) {
      editingNotificationIndex.value--
    }
    showToast('Đã xóa thông báo', 'success')
  }
}

const moveNotificationUp = (index) => {
  if (index > 0) {
    const temp = content.notifications[index]
    content.notifications[index] = content.notifications[index - 1]
    content.notifications[index - 1] = temp

    if (editingNotificationIndex.value === index) {
      editingNotificationIndex.value = index - 1
    } else if (editingNotificationIndex.value === index - 1) {
      editingNotificationIndex.value = index
    }
  }
}

const moveNotificationDown = (index) => {
  if (index < content.notifications.length - 1) {
    const temp = content.notifications[index]
    content.notifications[index] = content.notifications[index + 1]
    content.notifications[index + 1] = temp

    if (editingNotificationIndex.value === index) {
      editingNotificationIndex.value = index + 1
    } else if (editingNotificationIndex.value === index + 1) {
      editingNotificationIndex.value = index
    }
  }
}

const toggleNotificationEdit = (index) => {
  if (editingNotificationIndex.value === index) {
    editingNotificationIndex.value = -1
  } else {
    editingNotificationIndex.value = index
  }
}

const saveNotificationEdit = () => {
  editingNotificationIndex.value = -1
  showToast('Đã lưu thông báo', 'success')
}

const cancelNotificationEdit = () => {
  editingNotificationIndex.value = -1
}

// ========== COLOR CONVERSION FUNCTIONS ==========
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

const rgbToHex = (r, g, b) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

const parseRGBA = (rgbaStr) => {
  if (!rgbaStr) return { hex: '#f0f5ff', opacity: 0.7 };

  const match = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const opacity = match[4] ? parseFloat(match[4]) : 1.0;
    const hex = rgbToHex(r, g, b);
    return { hex, opacity };
  }
  return { hex: '#f0f5ff', opacity: 0.7 };
};

const parseSingleColorGradient = (gradientStr) => {
  if (!gradientStr) return { color: '#2a5298', opacity: 1.0 };

  // Tìm màu rgba trong gradient string
  const rgbaMatch = gradientStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1.0;
    const hex = rgbToHex(r, g, b);
    return { hex, opacity };
  }

  // Tìm hex color trong gradient string
  const hexMatch = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (hexMatch && hexMatch.length > 0) {
    return { hex: hexMatch[0], opacity: 1.0 };
  }

  return { color: '#2a5298', opacity: 1.0 };
};

// ========== GRADIENT FUNCTIONS ==========
const parseGradientColors = (gradientStr) => {
  if (!gradientStr) return {color1: '#031358', color2: '#2a5298'};

  const matches = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (matches && matches.length >= 2) {
    if (matches.length >= 3) {
      return {color1: matches[0], color2: matches[1], color3: matches[2]};
    }
    return {color1: matches[0], color2: matches[1]};
  }
  return {color1: '#031358', color2: '#2a5298'};
};

const updateTitleGradient = () => {
  content.gradients.title = `linear-gradient(135deg, ${gradientColors.title.color1}, ${gradientColors.title.color2})`;
};

const updateTitleColorsFromGradient = () => {
  const colors = parseGradientColors(content.gradients.title);
  gradientColors.title.color1 = colors.color1 || '#031358';
  gradientColors.title.color2 = colors.color2 || '#2a5298';
};

const updateProgressGradient = () => {
  content.gradients.progress = `linear-gradient(90deg, ${gradientColors.progress.color1}, ${gradientColors.progress.color2}, ${gradientColors.progress.color3})`;
};

const updateProgressColorsFromGradient = () => {
  const colors = parseGradientColors(content.gradients.progress);
  gradientColors.progress.color1 = colors.color1 || '#0030ff';
  gradientColors.progress.color2 = colors.color2 || '#2a5298';
  gradientColors.progress.color3 = colors.color3 || '#4a7bd6';
};

const updateDividerGradient = () => {
  const rgb = hexToRgb(gradientColors.divider.color);
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${gradientColors.divider.opacity})`;
  content.gradients.divider = `linear-gradient(90deg, transparent, ${rgba}, transparent)`;
};

const updateDividerColorFromGradient = () => {
  const parsed = parseSingleColorGradient(content.gradients.divider);
  gradientColors.divider.color = parsed.hex;
  gradientColors.divider.opacity = parsed.opacity;
};

const updateLightSweepGradient = () => {
  const rgb = hexToRgb(gradientColors.lightSweep.color);
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${gradientColors.lightSweep.opacity})`;
  content.gradients.lightSweep = `linear-gradient(90deg, transparent, ${rgba}, transparent)`;
};

const updateLightSweepColorFromGradient = () => {
  const parsed = parseSingleColorGradient(content.gradients.lightSweep);
  gradientColors.lightSweep.color = parsed.hex;
  gradientColors.lightSweep.opacity = parsed.opacity;
};

const updateProgressShineGradient = () => {
  const rgb = hexToRgb(gradientColors.progressShine.color);
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${gradientColors.progressShine.opacity})`;
  content.gradients.progressShine = `linear-gradient(90deg, transparent, ${rgba}, transparent)`;
};

const updateProgressShineColorFromGradient = () => {
  const parsed = parseSingleColorGradient(content.gradients.progressShine);
  gradientColors.progressShine.color = parsed.hex;
  gradientColors.progressShine.opacity = parsed.opacity;
};

// ========== BACKGROUND COLOR FUNCTIONS ==========
const updateBackgroundLightFromColor = () => {
  const rgb = hexToRgb(backgroundColorLight.hex);
  content.colors.backgroundLight = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundColorLight.opacity})`;
};

const updateBackgroundLightColorFromRGBA = () => {
  const parsed = parseRGBA(content.colors.backgroundLight);
  backgroundColorLight.hex = parsed.hex;
  backgroundColorLight.opacity = parsed.opacity;
};

const updateStatBackgroundFromColor = () => {
  const rgb = hexToRgb(backgroundColorStat.hex);
  content.colors.statBackground = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundColorStat.opacity})`;
};

const updateStatBackgroundColorFromRGBA = () => {
  const parsed = parseRGBA(content.colors.statBackground);
  backgroundColorStat.hex = parsed.hex;
  backgroundColorStat.opacity = parsed.opacity;
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

      // Ensure notifications array exists
      if (!content.notifications) {
        content.notifications = []
      }

      // Initialize gradient colors
      const titleColors = parseGradientColors(content.gradients.title);
      gradientColors.title.color1 = titleColors.color1;
      gradientColors.title.color2 = titleColors.color2;

      const progressColors = parseGradientColors(content.gradients.progress);
      gradientColors.progress.color1 = progressColors.color1;
      gradientColors.progress.color2 = progressColors.color2;
      gradientColors.progress.color3 = progressColors.color3;

      // Initialize single color gradients
      const dividerColor = parseSingleColorGradient(content.gradients.divider);
      gradientColors.divider.color = dividerColor.hex;
      gradientColors.divider.opacity = dividerColor.opacity;

      const lightSweepColor = parseSingleColorGradient(content.gradients.lightSweep);
      gradientColors.lightSweep.color = lightSweepColor.hex;
      gradientColors.lightSweep.opacity = lightSweepColor.opacity;

      const progressShineColor = parseSingleColorGradient(content.gradients.progressShine);
      gradientColors.progressShine.color = progressShineColor.hex;
      gradientColors.progressShine.opacity = progressShineColor.opacity;

      // Initialize background colors with opacity
      const backgroundLight = parseRGBA(content.colors.backgroundLight);
      backgroundColorLight.hex = backgroundLight.hex;
      backgroundColorLight.opacity = backgroundLight.opacity;

      const statBackground = parseRGBA(content.colors.statBackground);
      backgroundColorStat.hex = statBackground.hex;
      backgroundColorStat.opacity = statBackground.opacity;

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
      name: 'Chi tiết - Nổi bật',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 0,
      files: [] // Không có file để upload
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
/* ... (giữ nguyên tất cả CSS styles từ file gốc) ... */

/* Info Box cho hình ảnh cố định */
.info-box {
  margin-top: 25px;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  border-left: 4px solid #4a6cf7;
}

.info-box h4 {
  margin: 0 0 10px 0;
  color: #031358;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-content p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #495057;
}

.info-content p strong {
  color: #031358;
  min-width: 100px;
  display: inline-block;
}

/* Opacity input styles */
.opacity-input {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 120px;
}

.opacity-input input[type="range"] {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
}

.opacity-input input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4a6cf7;
  cursor: pointer;
}

.opacity-input input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4a6cf7;
  cursor: pointer;
  border: none;
}

.opacity-input span {
  min-width: 40px;
  font-size: 0.85rem;
  color: #6c757d;
  text-align: center;
}

/* Color input với opacity */
.color-input.form-group {
  display: flex;
  gap: 8px;
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

/* Notifications Styles */
.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.notification-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notification-header:hover {
  background-color: #e9ecef;
}

.notification-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notification-message-preview {
  font-size: 0.95rem;
  color: #495057;
  line-height: 1.4;
}

.notification-actions {
  display: flex;
  gap: 8px;
}

.notification-edit-form {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9ff;
}

.empty-notifications {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-notifications i {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
  color: #adb5bd;
}

.empty-notifications p {
  margin: 0 0 20px 0;
  font-size: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .info-content p strong {
    min-width: 80px;
  }

  .color-input.form-group {
    flex-wrap: wrap;
  }

  .opacity-input {
    width: 100%;
    margin-top: 5px;
  }

  .color-input input[type="color"] {
    width: 40px;
    height: 35px;
  }

  .notification-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .notification-actions {
    width: 100%;
    justify-content: flex-end;
  }
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
</style>