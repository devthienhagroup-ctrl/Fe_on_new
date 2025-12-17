<template>
  <div class="funding-modal-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Hộp thoại Góp vốn</h2>
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
          :class="{ active: activeTab === 'labels' }"
          @click="activeTab = 'labels'"
      >
        <i class="fas fa-tag"></i> Nhãn & Văn bản
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'colors' }"
          @click="activeTab = 'colors'"
      >
        <i class="fas fa-palette"></i> Màu sắc
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'gradients' }"
          @click="activeTab = 'gradients'"
      >
        <i class="fas fa-gradient"></i> Gradient
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-brush"></i> Kiểu dáng
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Thông tin chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Tiêu đề modal -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề Modal</h3>
            <div class="form-group">
              <label for="modal-title">Tiêu đề</label>
              <input
                  type="text"
                  id="modal-title"
                  v-model="content.modalTitle"
                  placeholder="Góp vốn đầu tư"
              />
            </div>
          </div>

          <!-- Nút bấm -->
          <div class="setting-section">
            <h3><i class="fas fa-hand-pointer"></i> Nút bấm</h3>
            <div class="form-group">
              <label for="btn-cancel">Văn bản nút Hủy</label>
              <input
                  type="text"
                  id="btn-cancel"
                  v-model="content.buttons.cancel"
                  placeholder="Hủy bỏ"
              />
            </div>
            <div class="form-group">
              <label for="btn-payment">Văn bản nút Thanh toán</label>
              <input
                  type="text"
                  id="btn-payment"
                  v-model="content.buttons.payment"
                  placeholder="Thanh toán ngay"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Nhãn & Văn bản -->
      <div v-if="activeTab === 'labels'" class="labels-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Nhãn thời gian & tiến độ</h3>
            <div class="form-group">
              <label for="label-time-left">Thời gian còn lại</label>
              <input
                  type="text"
                  id="label-time-left"
                  v-model="content.labels.timeLeft"
                  placeholder="Thời gian còn lại"
              />
            </div>
            <div class="form-group">
              <label for="label-total-capital">Tổng vốn cần</label>
              <input
                  type="text"
                  id="label-total-capital"
                  v-model="content.labels.totalCapital"
                  placeholder="Tổng vốn cần"
              />
            </div>
            <div class="form-group">
              <label for="label-progress">Tiến độ</label>
              <input
                  type="text"
                  id="label-progress"
                  v-model="content.labels.progress"
                  placeholder="Tiến độ"
              />
            </div>
            <div class="form-group">
              <label for="label-contributors">Người đã góp</label>
              <input
                  type="text"
                  id="label-contributors"
                  v-model="content.labels.contributors"
                  placeholder="người đã góp"
              />
            </div>
            <div class="form-group">
              <label for="label-funding-progress">Tiến độ góp vốn</label>
              <input
                  type="text"
                  id="label-funding-progress"
                  v-model="content.labels.fundingProgress"
                  placeholder="Tiến độ góp vốn"
              />
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-credit-card"></i> Nhãn gói đầu tư & thanh toán</h3>
            <div class="form-group">
              <label for="label-choose-package">Chọn gói đầu tư</label>
              <input
                  type="text"
                  id="label-choose-package"
                  v-model="content.labels.choosePackage"
                  placeholder="Chọn gói đầu tư"
              />
            </div>
            <div class="form-group">
              <label for="label-display-format">Hiển thị số</label>
              <input
                  type="text"
                  id="label-display-format"
                  v-model="content.labels.displayFormat"
                  placeholder="Hiển thị số"
              />
            </div>
            <div class="form-group">
              <label for="label-word-format">Chữ viết</label>
              <input
                  type="text"
                  id="label-word-format"
                  v-model="content.labels.wordFormat"
                  placeholder="Chữ viết"
              />
            </div>
            <div class="form-group">
              <label for="label-number-format">Số nguyên</label>
              <input
                  type="text"
                  id="label-number-format"
                  v-model="content.labels.numberFormat"
                  placeholder="Số nguyên"
              />
            </div>
            <div class="form-group">
              <label for="label-investment-package">Gói đầu tư</label>
              <input
                  type="text"
                  id="label-investment-package"
                  v-model="content.labels.investmentPackage"
                  placeholder="Gói đầu tư"
              />
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-percentage"></i> Nhãn tỷ lệ sở hữu</h3>
            <div class="form-group">
              <label for="label-ownership-percentage">Phần trăm sở hữu</label>
              <input
                  type="text"
                  id="label-ownership-percentage"
                  v-model="content.labels.ownershipPercentage"
                  placeholder="Phần trăm sở hữu"
              />
            </div>
            <div class="form-group">
              <label for="label-payment-info">Thông tin thanh toán</label>
              <input
                  type="text"
                  id="label-payment-info"
                  v-model="content.labels.paymentInfo"
                  placeholder="Thông tin thanh toán"
              />
            </div>
            <div class="form-group">
              <label for="label-selected-package">Gói đã chọn</label>
              <input
                  type="text"
                  id="label-selected-package"
                  v-model="content.labels.selectedPackage"
                  placeholder="Gói đã chọn"
              />
            </div>
            <div class="form-group">
              <label for="label-contribution-amount">Số tiền góp</label>
              <input
                  type="text"
                  id="label-contribution-amount"
                  v-model="content.labels.contributionAmount"
                  placeholder="Số tiền góp"
              />
            </div>
            <div class="form-group">
              <label for="label-ownership-rate">Tỷ lệ sở hữu</label>
              <input
                  type="text"
                  id="label-ownership-rate"
                  v-model="content.labels.ownershipRate"
                  placeholder="Tỷ lệ sở hữu"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Màu sắc -->
      <div v-if="activeTab === 'colors'" class="colors-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-fill-drip"></i> Màu sắc chính</h3>
            <div class="color-grid">
              <div class="color-input-group">
                <label>Màu chính</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.styles.colors.primary" @change="updateGradientColors()"/>
                  <input type="text" v-model="content.styles.colors.primary" placeholder="#2563eb"/>
                </div>
              </div>
              <div class="color-input-group">
                <label>Màu chính đậm</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.styles.colors.primaryDark" @change="updateGradientColors()"/>
                  <input type="text" v-model="content.styles.colors.primaryDark" placeholder="#031358"/>
                </div>
              </div>
              <div class="color-input-group">
                <label>Màu phụ</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.styles.colors.secondary"/>
                  <input type="text" v-model="content.styles.colors.secondary" placeholder="#f1f5f9"/>
                </div>
              </div>
              <div class="color-input-group">
                <label>Màu thành công</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.styles.colors.success"/>
                  <input type="text" v-model="content.styles.colors.success" placeholder="#10b981"/>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu văn bản</h3>
            <div class="color-grid">
              <div class="color-input-group">
                <label>Văn bản chính</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.styles.colors.textPrimary"/>
                  <input type="text" v-model="content.styles.colors.textPrimary" placeholder="#031358"/>
                </div>
              </div>
              <div class="color-input-group">
                <label>Văn bản phụ</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.styles.colors.textSecondary"/>
                  <input type="text" v-model="content.styles.colors.textSecondary" placeholder="#475569"/>
                </div>
              </div>
              <div class="color-input-group">
                <label>Văn bản mờ</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.styles.colors.textMuted"/>
                  <input type="text" v-model="content.styles.colors.textMuted" placeholder="#64748b"/>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-border-style"></i> Màu nền & viền</h3>
            <div class="color-grid">
              <div class="color-input-group">
                <label>Viền</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.styles.colors.border"/>
                  <input type="text" v-model="content.styles.colors.border" placeholder="#e2e8f0"/>
                </div>
              </div>
              <div class="color-input-group">
                <label>Nền</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.styles.colors.background"/>
                  <input type="text" v-model="content.styles.colors.background" placeholder="#f8faff"/>
                </div>
              </div>
              <div class="color-input-group">
                <label>Trắng</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.styles.colors.white"/>
                  <input type="text" v-model="content.styles.colors.white" placeholder="#ffffff"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Gradient -->
      <div v-if="activeTab === 'gradients'" class="gradients-settings">
        <div class="settings-grid">
          <!-- Gradient Header -->
          <div class="setting-section">
            <h3><i class="fas fa-object-group"></i> Gradient Header</h3>
            <div class="gradient-preview" :style="{ background: content.styles.gradients.header }">
              <span>Header Gradient</span>
            </div>
            <div class="color-input-group">
              <label>Màu 1</label>
              <div class="gradient-colors">
                <div class="color-input-wrapper">
                  <span class="color-label">Màu bắt đầu</span>
                  <div class="color-input form-group">
                    <input type="color" v-model="gradientColors.header.color1" @change="updateHeaderGradient()"/>
                    <input type="text" v-model="gradientColors.header.color1"/>
                  </div>
                </div>
                <div class="color-input-wrapper">
                  <span class="color-label">Màu kết thúc</span>
                  <div class="color-input form-group">
                    <input type="color" v-model="gradientColors.header.color2" @change="updateHeaderGradient()"/>
                    <input type="text" v-model="gradientColors.header.color2"/>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <input
                    type="text"
                    id="gradient-header"
                    v-model="content.styles.gradients.header"
                    placeholder="linear-gradient(135deg, #031358, #2563eb)"
                    @input="updateHeaderColorsFromGradient()"
                />
              </div>
            </div>
          </div>

          <!-- Gradient Button -->
          <div class="setting-section">
            <h3><i class="fas fa-square"></i> Gradient Nút bấm</h3>
            <div class="gradient-preview" :style="{ background: content.styles.gradients.button }">
              <span>Button Gradient</span>
            </div>
            <div class="gradient-preview" :style="{ background: content.styles.gradients.buttonHover }">
              <span>Button Hover Gradient</span>
            </div>
            <div class="color-input-group">
              <label>Gradient bình thường</label>
              <div class="gradient-colors">
                <div class="color-input-wrapper">
                  <span class="color-label">Màu 1</span>
                  <div class="color-input form-group">
                    <input type="color" v-model="gradientColors.button.color1" @change="updateButtonGradient()"/>
                    <input type="text" v-model="gradientColors.button.color1"/>
                  </div>
                </div>
                <div class="color-input-wrapper">
                  <span class="color-label">Màu 2</span>
                  <div class="color-input form-group">
                    <input type="color" v-model="gradientColors.button.color2" @change="updateButtonGradient()"/>
                    <input type="text" v-model="gradientColors.button.color2"/>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <input
                    type="text"
                    id="gradient-button"
                    v-model="content.styles.gradients.button"
                    placeholder="linear-gradient(135deg, #2563eb, #031358)"
                    @input="updateButtonColorsFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Gradient hover</label>
              <div class="gradient-colors">
                <div class="color-input-wrapper">
                  <span class="color-label">Màu 1</span>
                  <div class="color-input form-group">
                    <input type="color" v-model="gradientColors.buttonHover.color1" @change="updateButtonHoverGradient()"/>
                    <input type="text" v-model="gradientColors.buttonHover.color1"/>
                  </div>
                </div>
                <div class="color-input-wrapper">
                  <span class="color-label">Màu 2</span>
                  <div class="color-input form-group">
                    <input type="color" v-model="gradientColors.buttonHover.color2" @change="updateButtonHoverGradient()"/>
                    <input type="text" v-model="gradientColors.buttonHover.color2"/>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <input
                    type="text"
                    id="gradient-button-hover"
                    v-model="content.styles.gradients.buttonHover"
                    placeholder="linear-gradient(135deg, #1e40af, #031358)"
                    @input="updateButtonHoverColorsFromGradient()"
                />
              </div>
            </div>
          </div>

          <!-- Gradient Progress Bar -->
          <div class="setting-section">
            <h3><i class="fas fa-chart-line"></i> Gradient Thanh tiến độ</h3>
            <div class="gradient-preview" :style="{ background: content.styles.gradients.progressBar }">
              <span>Progress Bar Gradient</span>
            </div>
            <div class="color-input-group">
              <label>Gradient thanh tiến độ</label>
              <div class="gradient-colors">
                <div class="color-input-wrapper">
                  <span class="color-label">Màu bắt đầu</span>
                  <div class="color-input form-group">
                    <input type="color" v-model="gradientColors.progressBar.color1" @change="updateProgressBarGradient()"/>
                    <input type="text" v-model="gradientColors.progressBar.color1"/>
                  </div>
                </div>
                <div class="color-input-wrapper">
                  <span class="color-label">Màu kết thúc</span>
                  <div class="color-input form-group">
                    <input type="color" v-model="gradientColors.progressBar.color2" @change="updateProgressBarGradient()"/>
                    <input type="text" v-model="gradientColors.progressBar.color2"/>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <input
                    type="text"
                    id="gradient-progress-bar"
                    v-model="content.styles.gradients.progressBar"
                    placeholder="linear-gradient(90deg, #2563eb, #031358)"
                    @input="updateProgressBarColorsFromGradient()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Kiểu dáng -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Kích thước -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Kích thước & Bo góc</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="border-radius">Bo góc chính</label>
                <div class="input-with-unit">
                  <input type="text" id="border-radius" v-model="content.styles.sizes.borderRadius" placeholder="12px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="border-radius-small">Bo góc nhỏ</label>
                <div class="input-with-unit">
                  <input type="text" id="border-radius-small" v-model="content.styles.sizes.borderRadiusSmall" placeholder="8px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="border-radius-round">Bo góc tròn</label>
              <div class="input-with-unit">
                <input type="text" id="border-radius-round" v-model="content.styles.sizes.borderRadiusRound" placeholder="50%"/>
                <span class="unit">%</span>
              </div>
            </div>
          </div>

          <!-- Kích thước chữ -->
          <div class="setting-section">
            <h3><i class="fas fa-text-height"></i> Kích thước chữ</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="font-size-title">Tiêu đề</label>
                <div class="input-with-unit">
                  <input type="text" id="font-size-title" v-model="content.styles.sizes.fontSizeTitle" placeholder="1.5rem"/>
                  <span class="unit">rem</span>
                </div>
              </div>
              <div class="form-group">
                <label for="font-size-section">Phần</label>
                <div class="input-with-unit">
                  <input type="text" id="font-size-section" v-model="content.styles.sizes.fontSizeSection" placeholder="1.2rem"/>
                  <span class="unit">rem</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="font-size-normal">Bình thường</label>
                <div class="input-with-unit">
                  <input type="text" id="font-size-normal" v-model="content.styles.sizes.fontSizeNormal" placeholder="0.95rem"/>
                  <span class="unit">rem</span>
                </div>
              </div>
              <div class="form-group">
                <label for="font-size-small">Nhỏ</label>
                <div class="input-with-unit">
                  <input type="text" id="font-size-small" v-model="content.styles.sizes.fontSizeSmall" placeholder="0.85rem"/>
                  <span class="unit">rem</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Shadow -->
          <div class="setting-section">
            <h3><i class="fas fa-box-shadow"></i> Hiệu ứng đổ bóng</h3>

            <div class="color-input-group">
              <label>Bóng modal</label>
              <div class="shadow-input form-group">
                <input type="color" v-model="shadowColors.modal.hex" @input="updateModalShadowFromColor()"/>
                <input
                    type="range"
                    v-model="shadowColors.modal.opacity"
                    min="0"
                    max="1"
                    step="0.05"
                    @input="updateModalShadowFromColor()"
                    class="opacity-slider"
                />
                <input
                    type="text"
                    v-model="content.styles.shadows.modal"
                    placeholder="0 20px 60px rgba(0, 0, 0, 0.3)"
                    @input="updateModalColorFromShadow()"
                />
              </div>
              <div class="shadow-preview" :style="{ boxShadow: content.styles.shadows.modal }"></div>
            </div>

            <div class="color-input-group">
              <label>Bóng nút bấm</label>
              <div class="shadow-input">
                <input type="color" v-model="shadowColors.button.hex" @input="updateButtonShadowFromColor()"/>
                <input
                    type="range"
                    v-model="shadowColors.button.opacity"
                    min="0"
                    max="1"
                    step="0.05"
                    @input="updateButtonShadowFromColor()"
                    class="opacity-slider"
                />
                <input
                    type="text"
                    v-model="content.styles.shadows.button"
                    placeholder="0 4px 12px rgba(37, 99, 235, 0.3)"
                    @input="updateButtonColorFromShadow()"
                />
              </div>
              <div class="shadow-preview" :style="{ boxShadow: content.styles.shadows.button }"></div>
            </div>

            <div class="color-input-group">
              <label>Bóng gói (hover)</label>
              <div class="shadow-input">
                <input type="color" v-model="shadowColors.packageHover.hex" @input="updatePackageHoverShadowFromColor()"/>
                <input
                    type="range"
                    v-model="shadowColors.packageHover.opacity"
                    min="0"
                    max="1"
                    step="0.05"
                    @input="updatePackageHoverShadowFromColor()"
                    class="opacity-slider"
                />
                <input
                    type="text"
                    v-model="content.styles.shadows.packageHover"
                    placeholder="0 4px 12px rgba(37, 99, 235, 0.1)"
                    @input="updatePackageHoverColorFromShadow()"
                />
              </div>
              <div class="shadow-preview" :style="{ boxShadow: content.styles.shadows.packageHover }"></div>
            </div>

            <div class="color-input-group">
              <label>Bóng gói (selected)</label>
              <div class="shadow-input">
                <input type="color" v-model="shadowColors.packageSelected.hex" @input="updatePackageSelectedShadowFromColor()"/>
                <input
                    type="range"
                    v-model="shadowColors.packageSelected.opacity"
                    min="0"
                    max="1"
                    step="0.05"
                    @input="updatePackageSelectedShadowFromColor()"
                    class="opacity-slider"
                />
                <input
                    type="text"
                    v-model="content.styles.shadows.packageSelected"
                    placeholder="0 4px 15px rgba(37, 99, 235, 0.15)"
                    @input="updatePackageSelectedColorFromShadow()"
                />
              </div>
              <div class="shadow-preview" :style="{ boxShadow: content.styles.shadows.packageSelected }"></div>
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
import { ref, reactive, onMounted, computed } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Gradient colors state
const gradientColors = reactive({
  header: {
    color1: '#031358',
    color2: '#2563eb'
  },
  button: {
    color1: '#2563eb',
    color2: '#031358'
  },
  buttonHover: {
    color1: '#1e40af',
    color2: '#031358'
  },
  progressBar: {
    color1: '#2563eb',
    color2: '#031358'
  },
  selectedPackage: {
    color1: '#f0f7ff',
    color2: '#e6f0ff'
  }
})

// Shadow colors state
const shadowColors = reactive({
  modal: {
    hex: '#000000',
    opacity: 0.3,
    rgba: 'rgba(0, 0, 0, 0.3)'
  },
  button: {
    hex: '#2563eb',
    opacity: 0.3,
    rgba: 'rgba(37, 99, 235, 0.3)'
  },
  packageHover: {
    hex: '#2563eb',
    opacity: 0.1,
    rgba: 'rgba(37, 99, 235, 0.1)'
  },
  packageSelected: {
    hex: '#2563eb',
    opacity: 0.15,
    rgba: 'rgba(37, 99, 235, 0.15)'
  }
})

// Content structure based on new JSON data
const content = reactive({
  modalTitle: 'Góp vốn đầu tư',
  labels: {
    timeLeft: 'Thời gian còn lại',
    totalCapital: 'Tổng vốn cần',
    progress: 'Tiến độ',
    contributors: 'người đã góp',
    fundingProgress: 'Tiến độ góp vốn',
    choosePackage: 'Chọn gói đầu tư',
    displayFormat: 'Hiển thị số',
    wordFormat: 'Chữ viết',
    numberFormat: 'Số nguyên',
    investmentPackage: 'Gói đầu tư',
    ownershipPercentage: 'Phần trăm sở hữu',
    paymentInfo: 'Thông tin thanh toán',
    selectedPackage: 'Gói đã chọn',
    contributionAmount: 'Số tiền góp',
    ownershipRate: 'Tỷ lệ sở hữu'
  },
  buttons: {
    cancel: 'Hủy bỏ',
    payment: 'Thanh toán ngay'
  },
  styles: {
    colors: {
      primary: '#2563eb',
      primaryDark: '#031358',
      secondary: '#f1f5f9',
      success: '#10b981',
      successDark: '#059669',
      danger: '#dc2626',
      textPrimary: '#031358',
      textSecondary: '#475569',
      textMuted: '#64748b',
      border: '#e2e8f0',
      background: '#f8faff',
      white: '#ffffff'
    },
    gradients: {
      header: 'linear-gradient(135deg, #031358, #2563eb)',
      button: 'linear-gradient(135deg, #2563eb, #031358)',
      buttonHover: 'linear-gradient(135deg, #1e40af, #031358)',
      progressBar: 'linear-gradient(90deg, #2563eb, #031358)',
      selectedPackage: 'linear-gradient(135deg, #f0f7ff, #e6f0ff)'
    },
    sizes: {
      borderRadius: '12px',
      borderRadiusSmall: '8px',
      borderRadiusRound: '50%',
      fontSizeTitle: '1.5rem',
      fontSizeSection: '1.2rem',
      fontSizeNormal: '0.95rem',
      fontSizeSmall: '0.85rem'
    },
    shadows: {
      modal: '0 20px 60px rgba(0, 0, 0, 0.3)',
      button: '0 4px 12px rgba(37, 99, 235, 0.3)',
      packageHover: '0 4px 12px rgba(37, 99, 235, 0.1)',
      packageSelected: '0 4px 15px rgba(37, 99, 235, 0.15)'
    }
  }
})

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// ========== CONSTANTS ==========
const SECTION_ID = 51

// ========== COMPUTED PROPERTIES ==========
const previewStyles = computed(() => {
  return {
    borderRadius: content.styles.sizes.borderRadius,
    backgroundColor: content.styles.colors.background,
    border: `1px solid ${content.styles.colors.border}`,
    color: content.styles.colors.textPrimary,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  }
})

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

// ========== GRADIENT FUNCTIONS ==========
const parseGradientColors = (gradientStr) => {
  if (!gradientStr) return { color1: '#031358', color2: '#2563eb' };

  const matches = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (matches && matches.length >= 2) {
    return { color1: matches[0], color2: matches[1] };
  }
  return { color1: '#031358', color2: '#2563eb' };
};

const updateHeaderGradient = () => {
  content.styles.gradients.header = `linear-gradient(135deg, ${gradientColors.header.color1}, ${gradientColors.header.color2})`;
};

const updateHeaderColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.gradients.header);
  gradientColors.header.color1 = colors.color1;
  gradientColors.header.color2 = colors.color2;
};

const updateButtonGradient = () => {
  content.styles.gradients.button = `linear-gradient(135deg, ${gradientColors.button.color1}, ${gradientColors.button.color2})`;
};

const updateButtonColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.gradients.button);
  gradientColors.button.color1 = colors.color1;
  gradientColors.button.color2 = colors.color2;
};

const updateButtonHoverGradient = () => {
  content.styles.gradients.buttonHover = `linear-gradient(135deg, ${gradientColors.buttonHover.color1}, ${gradientColors.buttonHover.color2})`;
};

const updateButtonHoverColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.gradients.buttonHover);
  gradientColors.buttonHover.color1 = colors.color1;
  gradientColors.buttonHover.color2 = colors.color2;
};

const updateProgressBarGradient = () => {
  content.styles.gradients.progressBar = `linear-gradient(90deg, ${gradientColors.progressBar.color1}, ${gradientColors.progressBar.color2})`;
};

const updateProgressBarColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.gradients.progressBar);
  gradientColors.progressBar.color1 = colors.color1;
  gradientColors.progressBar.color2 = colors.color2;
};

const updateGradientColors = () => {
  // Update gradients when primary colors change
  updateHeaderGradient();
  updateButtonGradient();
  updateButtonHoverGradient();
  updateProgressBarGradient();
};

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
  if (!shadowStr) return { hex: '#000000', opacity: 0.3, rgba: 'rgba(0, 0, 0, 0.3)' };

  const rgbaMatch = shadowStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 0.3;

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    return { hex, opacity, rgba };
  }

  // Try to find hex in shadow string
  const hexMatch = shadowStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/);
  if (hexMatch) {
    return { hex: hexMatch[0], opacity: 0.3, rgba: `rgba(0, 0, 0, 0.3)` };
  }

  return { hex: '#000000', opacity: 0.3, rgba: 'rgba(0, 0, 0, 0.3)' };
};

const updateModalShadowFromColor = () => {
  const rgb = hexToRgb(shadowColors.modal.hex);
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowColors.modal.opacity})`;

  // Extract shadow values from current string
  const shadowValues = content.styles.shadows.modal.replace(/rgba?\([^)]+\)/, '').trim();
  content.styles.shadows.modal = `${shadowValues} ${rgba}`;
  shadowColors.modal.rgba = rgba;
};

const updateModalColorFromShadow = () => {
  const parsed = parseShadowColor(content.styles.shadows.modal);
  shadowColors.modal.hex = parsed.hex;
  shadowColors.modal.opacity = parsed.opacity;
  shadowColors.modal.rgba = parsed.rgba;
};

const updateButtonShadowFromColor = () => {
  const rgb = hexToRgb(shadowColors.button.hex);
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowColors.button.opacity})`;

  const shadowValues = content.styles.shadows.button.replace(/rgba?\([^)]+\)/, '').trim();
  content.styles.shadows.button = `${shadowValues} ${rgba}`;
  shadowColors.button.rgba = rgba;
};

const updateButtonColorFromShadow = () => {
  const parsed = parseShadowColor(content.styles.shadows.button);
  shadowColors.button.hex = parsed.hex;
  shadowColors.button.opacity = parsed.opacity;
  shadowColors.button.rgba = parsed.rgba;
};

const updatePackageHoverShadowFromColor = () => {
  const rgb = hexToRgb(shadowColors.packageHover.hex);
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowColors.packageHover.opacity})`;

  const shadowValues = content.styles.shadows.packageHover.replace(/rgba?\([^)]+\)/, '').trim();
  content.styles.shadows.packageHover = `${shadowValues} ${rgba}`;
  shadowColors.packageHover.rgba = rgba;
};

const updatePackageHoverColorFromShadow = () => {
  const parsed = parseShadowColor(content.styles.shadows.packageHover);
  shadowColors.packageHover.hex = parsed.hex;
  shadowColors.packageHover.opacity = parsed.opacity;
  shadowColors.packageHover.rgba = parsed.rgba;
};

const updatePackageSelectedShadowFromColor = () => {
  const rgb = hexToRgb(shadowColors.packageSelected.hex);
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowColors.packageSelected.opacity})`;

  const shadowValues = content.styles.shadows.packageSelected.replace(/rgba?\([^)]+\)/, '').trim();
  content.styles.shadows.packageSelected = `${shadowValues} ${rgba}`;
  shadowColors.packageSelected.rgba = rgba;
};

const updatePackageSelectedColorFromShadow = () => {
  const parsed = parseShadowColor(content.styles.shadows.packageSelected);
  shadowColors.packageSelected.hex = parsed.hex;
  shadowColors.packageSelected.opacity = parsed.opacity;
  shadowColors.packageSelected.rgba = parsed.rgba;
};

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true;
    const response = await api.get(`/cms/getSection/${SECTION_ID}`);

    if (response.data && response.data.contentJson) {
      const data = typeof response.data.contentJson === 'string'
          ? JSON.parse(response.data.contentJson)
          : response.data.contentJson;

      // Update content with loaded data
      Object.assign(content, data);

      // Initialize gradient colors from loaded data
      gradientColors.header = parseGradientColors(content.styles.gradients.header);
      gradientColors.button = parseGradientColors(content.styles.gradients.button);
      gradientColors.buttonHover = parseGradientColors(content.styles.gradients.buttonHover);
      gradientColors.progressBar = parseGradientColors(content.styles.gradients.progressBar);
      gradientColors.selectedPackage = parseGradientColors(content.styles.gradients.selectedPackage);

      // Initialize shadow colors from loaded data
      shadowColors.modal = parseShadowColor(content.styles.shadows.modal);
      shadowColors.button = parseShadowColor(content.styles.shadows.button);
      shadowColors.packageHover = parseShadowColor(content.styles.shadows.packageHover);
      shadowColors.packageSelected = parseShadowColor(content.styles.shadows.packageSelected);

      showToast('Dữ liệu đã được tải thành công', 'success');
    }
  } catch (error) {
    console.error('Error loading data:', error);
    showToast('Không thể tải dữ liệu từ server', 'error');
  } finally {
    isLoading.value = false;
  }
};

const saveChanges = async () => {
  try {
    isLoading.value = true;

    // Prepare FormData
    const formData = new FormData();

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Hộp thoại góp vốn',
      contentJson: JSON.stringify(content, null, 2),
      sortOrder: 2,
      files: []
    };

    // Add section data
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }));

    // Send to API
    const response = await api.post('/cms/saveChange', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data) {
      showToast('Thay đổi đã được lưu thành công', 'success');
      await loadData();
    }
  } catch (error) {
    console.error('Error saving changes:', error);
    showToast('Lỗi khi lưu thay đổi: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    isLoading.value = false;
  }
};

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData();
});
</script>

<style scoped>
.funding-modal-editor {
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
  overflow-x: auto;
}

.tab-button {
  padding: 15px 20px;
  border: none;
  background: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
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
  min-height: 500px;
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
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
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
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
  gap: 15px;
}

/* Color Input */
.color-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.color-input-group {
  margin-bottom: 15px;
}

.color-input-group label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 8px;
  display: block;
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
  min-width: 0;
}

/* Gradient Preview */
.gradient-preview {
  height: 60px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid #e9ecef;
}

.gradient-colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
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
}

/* Shadow Input */
.shadow-input {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.shadow-input input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.opacity-slider {
  flex: 1;
  min-width: 60px;
}

.shadow-preview {
  width: 100%;
  height: 40px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

/* Preview Section */
.preview-section {
  margin-top: 30px;
  padding: 20px 30px;
  background-color: white;
  border-top: 1px solid #e9ecef;
}

.preview-section h3 {
  margin: 0 0 20px 0;
  color: #031358;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-container {
  display: flex;
  justify-content: center;
}

.modal-preview {
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.modal-header-preview {
  padding: 20px;
  color: white;
}

.modal-header-preview h4 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-body-preview {
  padding: 20px;
}

.preview-item {
  margin-bottom: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-item label {
  font-weight: 600;
  color: #495057;
}

.preview-item span {
  color: #6c757d;
}

.preview-progress {
  margin: 20px 0;
}

.progress-bar {
  height: 8px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 25px;
  justify-content: flex-end;
}

.btn-preview {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.btn-cancel:hover {
  background-color: #e9ecef;
}

.btn-payment {
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-payment:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
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
@media (max-width: 1200px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .color-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .navigation-tabs {
    padding: 0 15px;
  }

  .tab-button {
    padding: 12px 15px;
    font-size: 0.9rem;
  }

  .tab-content {
    padding: 20px;
  }

  .preview-section {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    padding: 15px 20px;
  }

  .header-controls {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .gradient-colors {
    grid-template-columns: 1fr;
  }

  .shadow-input {
    flex-wrap: wrap;
  }

  .button-group {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .editor-header h2 {
    font-size: 1.5rem;
    text-align: center;
  }

  .navigation-tabs {
    flex-wrap: wrap;
  }

  .tab-button {
    flex: 1;
    min-width: 140px;
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
</style>