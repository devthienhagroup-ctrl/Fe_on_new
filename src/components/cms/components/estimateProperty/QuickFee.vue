<template>
  <div class="calculator-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Tính phí nhanh</h2>
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
        <i class="fas fa-cog"></i> Cấu hình chung
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'slider' }"
          @click="activeTab = 'slider'"
      >
        <i class="fas fa-sliders-h"></i> Thanh trượt
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'fees' }"
          @click="activeTab = 'fees'"
      >
        <i class="fas fa-money-bill-wave"></i> Mức phí
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-palette"></i> Giao diện
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Cấu hình chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-info-circle"></i> Thông tin chung</h3>

            <div class="form-group">
              <label for="calculator-title">Tiêu đề máy tính</label>
              <input
                  type="text"
                  id="calculator-title"
                  v-model="content.calculatorConfig.title"
                  placeholder="Tính nhanh phí định giá sơ bộ"
              />
            </div>

            <div class="form-group">
              <label for="calculator-icon">Icon máy tính (Font Awesome)</label>
              <input
                  type="text"
                  id="calculator-icon"
                  v-model="content.calculatorConfig.icon"
                  placeholder="fas fa-calculator"
              />
              <small class="form-hint">Ví dụ: fas fa-calculator, fas fa-calculator-alt</small>
            </div>

            <div class="form-group">
              <label for="result-title">Tiêu đề kết quả</label>
              <input
                  type="text"
                  id="result-title"
                  v-model="content.resultConfig.title"
                  placeholder="Phí dịch vụ ước tính:"
              />
            </div>

            <div class="form-group">
              <label for="result-icon">Icon kết quả</label>
              <IconPicker
                  v-model="content.resultConfig.icon"
              />
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-wrench"></i> Cấu hình đầu vào</h3>

            <div class="form-group">
              <label for="input-label">Nhãn đầu vào</label>
              <input
                  type="text"
                  id="input-label"
                  v-model="content.inputConfig.label"
                  placeholder="Giá trị tài sản (tỷ VNĐ):"
              />
            </div>

            <div class="form-group">
              <label for="input-icon">Icon đầu vào</label>
              <IconPicker
                  v-model="content.inputConfig.icon"
              />
            </div>

            <div class="form-group">
              <label for="input-placeholder">Placeholder đầu vào</label>
              <input
                  type="text"
                  id="input-placeholder"
                  v-model="content.inputConfig.placeholder"
                  placeholder="Nhập giá trị..."
              />
            </div>

            <div class="form-group">
              <label for="unit">Đơn vị</label>
              <input
                  type="text"
                  id="unit"
                  v-model="content.calculatorConfig.unit"
                  placeholder="tỷ"
              />
            </div>

            <div class="form-group">
              <label for="currency">Đơn vị tiền tệ</label>
              <input
                  type="text"
                  id="currency"
                  v-model="content.calculatorConfig.currency"
                  placeholder="VNĐ"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Thanh trượt -->
      <div v-if="activeTab === 'slider'" class="slider-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-sliders-h"></i> Cấu hình thanh trượt</h3>

            <div class="form-group">
              <label for="slider-label">Nhãn thanh trượt</label>
              <input
                  type="text"
                  id="slider-label"
                  v-model="content.sliderConfig.label"
                  placeholder="Kéo để điều chỉnh giá mong muốn (tỷ VNĐ):"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="min-value">Giá trị tối thiểu</label>
                <div class="input-with-unit">
                  <input
                      type="number"
                      id="min-value"
                      v-model.number="content.calculatorConfig.minValue"
                      step="0.1"
                      min="0"
                  />
                  <span class="unit">{{ content.calculatorConfig.unit }}</span>
                </div>
              </div>
              <div class="form-group">
                <label for="max-value">Giá trị tối đa</label>
                <div class="input-with-unit">
                  <input
                      type="number"
                      id="max-value"
                      v-model.number="content.calculatorConfig.maxValue"
                      step="0.1"
                      min="0"
                  />
                  <span class="unit">{{ content.calculatorConfig.unit }}</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="step">Bước nhảy</label>
                <div class="input-with-unit">
                  <input
                      type="number"
                      id="step"
                      v-model.number="content.calculatorConfig.step"
                      step="0.1"
                      min="0.1"
                  />
                  <span class="unit">{{ content.calculatorConfig.unit }}</span>
                </div>
              </div>
              <div class="form-group">
                <label for="default-value">Giá trị mặc định</label>
                <div class="input-with-unit">
                  <input
                      type="number"
                      id="default-value"
                      v-model.number="content.calculatorConfig.defaultValue"
                      step="0.1"
                      :min="content.calculatorConfig.minValue"
                      :max="content.calculatorConfig.maxValue"
                  />
                  <span class="unit">{{ content.calculatorConfig.unit }}</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="quick-values">Giá trị nhanh (phân cách bằng dấu phẩy)</label>
              <input
                  type="text"
                  id="quick-values"
                  v-model="quickValuesText"
                  placeholder="1,5,10,20,50,100"
                  @change="updateQuickValues"
              />
              <small class="form-hint">Nhập các giá trị cách nhau bằng dấu phẩy</small>
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-thumbtack"></i> Cấu hình thumb (nút trượt)</h3>

            <div class="file-upload compact">
              <label><i class="fas fa-upload"></i> Tải lên ảnh thumb</label>
              <div class="file-upload-area" @click="triggerThumbInput" @dragover.prevent @drop.prevent="handleThumbDrop">
                <input
                    type="file"
                    ref="thumbInput"
                    @change="handleThumbUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây</p>
              </div>

              <div v-if="thumbPreview || content.sliderConfig.thumbIcon" class="upload-preview">
                <img :src="getImageUrl(content.sliderConfig.thumbIcon)" alt="Thumb Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewThumb" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeThumb" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!thumbPreview && !content.sliderConfig.thumbIcon">
              <label for="thumb-url">URL ảnh thumb</label>
              <input
                  type="text"
                  id="thumb-url"
                  v-model="content.sliderConfig.thumbIcon"
                  placeholder="/imgs/logoTHG.png"
              />
            </div>

            <div class="form-group">
              <label for="thumb-size">Kích thước thumb</label>
              <div class="input-with-unit">
                <input
                    type="number"
                    id="thumb-size"
                    v-model.number="content.sliderConfig.thumbSize"
                    min="16"
                    max="100"
                />
                <span class="unit">px</span>
              </div>
            </div>

            <!-- CHECKBOX BÌNH THƯỜNG -->
            <div class="form-check-inline">
              <input
                  type="checkbox"
                  v-model="content.sliderConfig.showQuickValues"
              />
              <label>
                Hiển thị giá trị nhanh
              </label>
            </div>

            <!-- CHECKBOX BÌNH THƯỜNG -->
            <div class="form-check-inline">
              <input
                  type="checkbox"
                  v-model="content.resultConfig.showCurrency"
              />
              <label>
                Hiển thị đơn vị tiền tệ
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Mức phí -->
      <div v-if="activeTab === 'fees'" class="fees-settings">
        <div class="settings-grid">
          <div class="setting-section full-width">
            <h3><i class="fas fa-money-bill-wave"></i> Quản lý mức phí</h3>
            <p class="section-description">
              Cấu hình các mức phí dựa trên giá trị tài sản. Mức cuối cùng có thể để <code>max: null</code> cho mở.
            </p>

            <div class="table-container">
              <table class="fees-table">
                <thead>
                <tr>
                  <th>STT</th>
                  <th>Từ (tỷ)</th>
                  <th>Đến (tỷ)</th>
                  <th>Phí dịch vụ (VNĐ)</th>
                  <th>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(rate, index) in content.feeRates" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <input
                        type="number"
                        v-model.number="rate.min"
                        step="0.1"
                        min="0"
                        class="table-input"
                    />
                  </td>
                  <td>
                    <input
                        type="number"
                        v-model.number="rate.max"
                        step="0.1"
                        min="0"
                        class="table-input"
                        :placeholder="index === content.feeRates.length - 1 ? 'Mở' : ''"
                    />
                  </td>
                  <td>
                    <div class="input-with-unit compact">
                      <input
                          type="number"
                          v-model.number="rate.fee"
                          min="0"
                          step="100000"
                          class="table-input"
                      />
                      <span class="unit">VNĐ</span>
                    </div>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button
                          class="btn-icon btn-table-action"
                          @click="moveRateUp(index)"
                          :disabled="index === 0"
                          title="Di chuyển lên"
                      >
                        <i class="fas fa-arrow-up"></i>
                      </button>
                      <button
                          class="btn-icon btn-table-action"
                          @click="moveRateDown(index)"
                          :disabled="index === content.feeRates.length - 1"
                          title="Di chuyển xuống"
                      >
                        <i class="fas fa-arrow-down"></i>
                      </button>
                      <button
                          class="btn-icon btn-table-action btn-danger"
                          @click="removeRate(index)"
                          :disabled="content.feeRates.length <= 1"
                          title="Xóa"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <div class="form-actions">
              <button class="btn btn-secondary" @click="addRate">
                <i class="fas fa-plus"></i> Thêm mức phí
              </button>
              <button class="btn btn-secondary" @click="resetRates">
                <i class="fas fa-redo"></i> Đặt lại mặc định
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Giao diện -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>

            <div class="color-input-group">
              <label>Màu gradient bắt đầu</label>
              <div class="color-input form-group">
                <input
                    type="color"
                    v-model="colorPickerGradientStart"
                    @input="updateGradientStartFromPicker"
                />
                <input
                    type="text"
                    v-model="content.styles.gradientStart"
                    placeholder="#3b82f6"
                    @input="updateGradientStartFromText"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu gradient kết thúc</label>
              <div class="color-input form-group">
                <input
                    type="color"
                    v-model="colorPickerGradientEnd"
                    @input="updateGradientEndFromPicker"
                />
                <input
                    type="text"
                    v-model="content.styles.gradientEnd"
                    placeholder="#1e40af"
                    @input="updateGradientEndFromText"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chính (text)</label>
              <div class="color-input form-group">
                <input
                    type="color"
                    v-model="colorPickerPrimary"
                    @input="updatePrimaryFromPicker"
                />
                <input
                    type="text"
                    v-model="content.styles.primaryColor"
                    placeholder="#ffffff"
                    @input="updatePrimaryFromText"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu phụ</label>
              <div class="color-input-with-opacity form-group">
                <div class="color-opacity-row">
                  <input
                      type="color"
                      v-model="colorPickerSecondary"
                      @input="updateSecondaryFromPicker"
                  />
                  <input
                      type="text"
                      v-model="secondaryHex"
                      placeholder="#ffffff"
                      @input="updateSecondaryFromHex"
                  />
                </div>
                <div class="opacity-slider">
                  <label>Độ trong suốt: {{ Math.round(secondaryOpacity * 100) }}%</label>
                  <input
                      type="range"
                      v-model.number="secondaryOpacity"
                      min="0"
                      max="1"
                      step="0.01"
                      @input="updateSecondaryFromOpacity"
                  />
                </div>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu nền card</label>
              <div class="color-input-with-opacity form-group">
                <div class="color-opacity-row">
                  <input
                      type="color"
                      v-model="colorPickerCardBg"
                      @input="updateCardBgFromPicker"
                  />
                  <input
                      type="text"
                      v-model="cardBgHex"
                      placeholder="#ffffff"
                      @input="updateCardBgFromHex"
                  />
                </div>
                <div class="opacity-slider">
                  <label>Độ trong suốt: {{ Math.round(cardBgOpacity * 100) }}%</label>
                  <input
                      type="range"
                      v-model.number="cardBgOpacity"
                      min="0"
                      max="1"
                      step="0.01"
                      @input="updateCardBgFromOpacity"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-border-style"></i> Hiệu ứng</h3>

            <div class="form-group">
              <label for="border-radius">Bo góc</label>
              <div class="input-with-unit">
                <input
                    type="text"
                    id="border-radius"
                    v-model="content.styles.borderRadius"
                    placeholder="20px"
                />
                <span class="unit">px</span>
              </div>
            </div>

            <!-- ĐỔ BÓNG VỚI INPUT COLOR VÀ OPACITY -->
            <div class="form-group">
              <label for="shadow">Đổ bóng</label>
              <div class="shadow-input-group">
                <div class="shadow-input-row">
                  <div class="shadow-color-input">
                    <label>Màu bóng:</label>
                    <input
                        type="color"
                        v-model="shadowColor"
                        @input="updateShadowFromColorPicker"
                    />
                    <input
                        type="text"
                        v-model="shadowHex"
                        placeholder="#3b82f6"
                        @input="updateShadowFromHex"
                        class="shadow-hex-input"
                    />
                  </div>
                  <div class="shadow-opacity-slider">
                    <label>Độ trong suốt: {{ Math.round(shadowOpacity * 100) }}%</label>
                    <input
                        type="range"
                        v-model.number="shadowOpacity"
                        min="0"
                        max="1"
                        step="0.01"
                        @input="updateShadowFromOpacity"
                    />
                  </div>
                </div>
                <div class="shadow-properties">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Offset X</label>
                      <div class="input-with-unit">
                        <input
                            type="number"
                            v-model.number="shadowOffsetX"
                            step="1"
                            @input="updateShadowProperties"
                        />
                        <span class="unit">px</span>
                      </div>
                    </div>
                    <div class="form-group">
                      <label>Offset Y</label>
                      <div class="input-with-unit">
                        <input
                            type="number"
                            v-model.number="shadowOffsetY"
                            step="1"
                            @input="updateShadowProperties"
                        />
                        <span class="unit">px</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Độ mờ</label>
                      <div class="input-with-unit">
                        <input
                            type="number"
                            v-model.number="shadowBlur"
                            step="1"
                            min="0"
                            @input="updateShadowProperties"
                        />
                        <span class="unit">px</span>
                      </div>
                    </div>
                    <div class="form-group">
                      <label>Độ lan</label>
                      <div class="input-with-unit">
                        <input
                            type="number"
                            v-model.number="shadowSpread"
                            step="1"
                            @input="updateShadowProperties"
                        />
                        <span class="unit">px</span>
                      </div>
                    </div>
                  </div>
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
            <img :src="previewImageUrl" alt="Xem trước" v-if="previewImageUrl" />
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
import { ref, reactive, onMounted, computed, watch } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Content structure based on JSON data
const content = reactive({
  calculatorConfig: {
    title: 'Tính nhanh phí định giá sơ bộ',
    icon: 'fas fa-calculator',
    minValue: 1,
    maxValue: 150,
    step: 0.1,
    defaultValue: 5,
    quickValues: [1, 5, 10, 20, 50, 100],
    unit: 'tỷ',
    currency: 'VNĐ',
    locale: 'vi-VN'
  },
  inputConfig: {
    label: 'Giá trị tài sản (tỷ VNĐ):',
    icon: 'fas fa-home',
    placeholder: 'Nhập giá trị...'
  },
  sliderConfig: {
    label: 'Kéo để điều chỉnh giá mong muốn (tỷ VNĐ):',
    showQuickValues: true,
    thumbIcon: '/imgs/logoTHG.png',
    thumbSize: 32
  },
  resultConfig: {
    title: 'Phí dịch vụ ước tính:',
    icon: 'fas fa-money-bill-wave',
    showCurrency: true
  },
  styles: {
    gradientStart: '#3b82f6',
    gradientEnd: '#1e40af',
    primaryColor: '#ffffff',
    secondaryColor: 'rgba(255, 255, 255, 0.3)',
    cardBackground: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '20px',
    shadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
  },
  feeRates: [
    { min: 0, max: 5, fee: 350000 },
    { min: 5, max: 10, fee: 650000 },
    { min: 10, max: 20, fee: 850000 },
    { min: 20, max: 50, fee: 1250000 },
    { min: 50, max: 100, fee: 2050000 },
    { min: 100, max: null, fee: 3500000 }
  ]
})

// UI State
const thumbPreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')
const quickValuesText = ref('')

// Color pickers for solid colors
const colorPickerGradientStart = ref('#3b82f6')
const colorPickerGradientEnd = ref('#1e40af')
const colorPickerPrimary = ref('#ffffff')

// Color pickers with opacity
const colorPickerSecondary = ref('#ffffff')
const colorPickerCardBg = ref('#ffffff')

// Shadow color and properties
const shadowColor = ref('#3b82f6')
const shadowHex = ref('#3b82f6')
const shadowOpacity = ref(0.3)
const shadowOffsetX = ref(0)
const shadowOffsetY = ref(10)
const shadowBlur = ref(30)
const shadowSpread = ref(0)

// Hex values for colors with opacity
const secondaryHex = ref('#ffffff')
const secondaryOpacity = ref(0.3)

const cardBgHex = ref('#ffffff')
const cardBgOpacity = ref(0.15)

// File inputs refs
const thumbInput = ref(null)

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
import { baseImgaeUrl } from "../../../../assets/js/global.js";
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 32

// ========== COMPUTED PROPERTIES ==========
const previewStyle = computed(() => ({
  background: `linear-gradient(135deg, ${content.styles.gradientStart} 0%, ${content.styles.gradientEnd} 100%)`,
  color: content.styles.primaryColor,
  borderRadius: content.styles.borderRadius,
  boxShadow: content.styles.shadow
}))

const shadowPreviewStyle = computed(() => ({
  boxShadow: content.styles.shadow,
  backgroundColor: '#f8f9fa',
  width: '100%',
  height: '80px',
  borderRadius: '8px',
  border: '1px solid #dee2e6'
}))

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

const updateQuickValues = () => {
  if (!quickValuesText.value.trim()) return

  const values = quickValuesText.value
      .split(',')
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v))
      .sort((a, b) => a - b)

  content.calculatorConfig.quickValues = values
  showToast('Đã cập nhật giá trị nhanh', 'success')
}

// ========== COLOR HANDLING FUNCTIONS ==========

// Solid colors (no opacity)
const updateGradientStartFromPicker = () => {
  content.styles.gradientStart = colorPickerGradientStart.value
}

const updateGradientStartFromText = () => {
  if (content.styles.gradientStart.match(/^#[0-9A-Fa-f]{6}$/)) {
    colorPickerGradientStart.value = content.styles.gradientStart
  }
}

const updateGradientEndFromPicker = () => {
  content.styles.gradientEnd = colorPickerGradientEnd.value
}

const updateGradientEndFromText = () => {
  if (content.styles.gradientEnd.match(/^#[0-9A-Fa-f]{6}$/)) {
    colorPickerGradientEnd.value = content.styles.gradientEnd
  }
}

const updatePrimaryFromPicker = () => {
  content.styles.primaryColor = colorPickerPrimary.value
}

const updatePrimaryFromText = () => {
  if (content.styles.primaryColor.match(/^#[0-9A-Fa-f]{6}$/)) {
    colorPickerPrimary.value = content.styles.primaryColor
  }
}

// Colors with opacity (secondary color)
const updateSecondaryFromPicker = () => {
  secondaryHex.value = colorPickerSecondary.value
  updateSecondaryColor()
}

const updateSecondaryFromHex = () => {
  if (secondaryHex.value.match(/^#[0-9A-Fa-f]{6}$/)) {
    colorPickerSecondary.value = secondaryHex.value
    updateSecondaryColor()
  }
}

const updateSecondaryFromOpacity = () => {
  updateSecondaryColor()
}

const updateSecondaryColor = () => {
  const hex = colorPickerSecondary.value
  if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    content.styles.secondaryColor = `rgba(${r}, ${g}, ${b}, ${secondaryOpacity.value})`
  }
}

// Colors with opacity (card background)
const updateCardBgFromPicker = () => {
  cardBgHex.value = colorPickerCardBg.value
  updateCardBgColor()
}

const updateCardBgFromHex = () => {
  if (cardBgHex.value.match(/^#[0-9A-Fa-f]{6}$/)) {
    colorPickerCardBg.value = cardBgHex.value
    updateCardBgColor()
  }
}

const updateCardBgFromOpacity = () => {
  updateCardBgColor()
}

const updateCardBgColor = () => {
  const hex = colorPickerCardBg.value
  if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    content.styles.cardBackground = `rgba(${r}, ${g}, ${b}, ${cardBgOpacity.value})`
  }
}

// ========== SHADOW HANDLING FUNCTIONS ==========
const updateShadowFromColorPicker = () => {
  shadowHex.value = shadowColor.value
  updateShadow()
}

const updateShadowFromHex = () => {
  if (shadowHex.value.match(/^#[0-9A-Fa-f]{6}$/)) {
    shadowColor.value = shadowHex.value
    updateShadow()
  }
}

const updateShadowFromOpacity = () => {
  updateShadow()
}

const updateShadowProperties = () => {
  updateShadow()
}

const updateShadow = () => {
  const hex = shadowColor.value
  if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    content.styles.shadow = `${shadowOffsetX.value}px ${shadowOffsetY.value}px ${shadowBlur.value}px ${shadowSpread.value}px rgba(${r}, ${g}, ${b}, ${shadowOpacity.value})`
  }
}

const parseShadowFromString = (shadowString) => {
  // Parse shadow string like "0 10px 30px rgba(59, 130, 246, 0.3)"
  const regex = /(-?\d+)px\s+(-?\d+)px\s+(-?\d+)px\s+(-?\d+)px\s+rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/
  const match = shadowString.match(regex)

  if (match) {
    return {
      offsetX: parseInt(match[1]),
      offsetY: parseInt(match[2]),
      blur: parseInt(match[3]),
      spread: parseInt(match[4]),
      r: parseInt(match[5]),
      g: parseInt(match[6]),
      b: parseInt(match[7]),
      a: parseFloat(match[8])
    }
  }

  // Return default values if parsing fails
  return {
    offsetX: 0,
    offsetY: 10,
    blur: 30,
    spread: 0,
    r: 59,
    g: 130,
    b: 246,
    a: 0.3
  }
}

const copyShadowToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(content.styles.shadow)
    showToast('Đã sao chép giá trị đổ bóng vào clipboard', 'success')
  } catch (err) {
    console.error('Failed to copy: ', err)
    showToast('Không thể sao chép', 'error')
  }
}

const addRate = () => {
  const lastRate = content.feeRates[content.feeRates.length - 1]
  const newMin = lastRate.max || lastRate.min + 10
  content.feeRates.push({
    min: newMin,
    max: newMin + 10,
    fee: lastRate.fee * 1.5
  })
  showToast('Đã thêm mức phí mới', 'success')
}

const removeRate = (index) => {
  if (content.feeRates.length > 1) {
    content.feeRates.splice(index, 1)
    showToast('Đã xóa mức phí', 'success')
  }
}

const moveRateUp = (index) => {
  if (index > 0) {
    const temp = content.feeRates[index]
    content.feeRates[index] = content.feeRates[index - 1]
    content.feeRates[index - 1] = temp
  }
}

const moveRateDown = (index) => {
  if (index < content.feeRates.length - 1) {
    const temp = content.feeRates[index]
    content.feeRates[index] = content.feeRates[index + 1]
    content.feeRates[index + 1] = temp
  }
}

const resetRates = () => {
  content.feeRates = [
    { min: 0, max: 5, fee: 350000 },
    { min: 5, max: 10, fee: 650000 },
    { min: 10, max: 20, fee: 850000 },
    { min: 20, max: 50, fee: 1250000 },
    { min: 50, max: 100, fee: 2050000 },
    { min: 100, max: null, fee: 3500000 }
  ]
  showToast('Đã đặt lại mức phí mặc định', 'success')
}

// ========== FILE UPLOAD HANDLERS ==========
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

    previewRef.value = null

    const pathParts = contentPath.split('.')
    let target = content
    for (let i = 0; i < pathParts.length - 1; i++) {
      target = target[pathParts[i]]
    }
    target[pathParts[pathParts.length - 1]] = tempUrl

    previewRef.value = previewUrl

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

    uploadedFiles.value.push({
      tempName: tempName,
      file: file,
      previewUrl: previewUrl
    })

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

const triggerThumbInput = () => {
  thumbInput.value?.click()
}

const handleThumbUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Thumb', thumbPreview, 'sliderConfig.thumbIcon')
  }
  event.target.value = ''
}

const handleThumbDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Thumb', thumbPreview, 'sliderConfig.thumbIcon')
  }
}

const removeThumb = () => {
  if (content.sliderConfig.thumbIcon) {
    handleRemoveFile(content.sliderConfig.thumbIcon, 'sliderConfig.thumbIcon', thumbPreview)
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

const previewThumb = () => {
  if (content.sliderConfig.thumbIcon) {
    previewImageUrl.value = getImageUrl(content.sliderConfig.thumbIcon)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
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

      Object.assign(content, data)

      // Initialize quick values text
      quickValuesText.value = content.calculatorConfig.quickValues?.join(', ') || ''

      // Initialize color pickers for solid colors
      colorPickerGradientStart.value = content.styles.gradientStart
      colorPickerGradientEnd.value = content.styles.gradientEnd
      colorPickerPrimary.value = content.styles.primaryColor

      // Parse colors with opacity (secondary color)
      const secondaryMatch = content.styles.secondaryColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
      if (secondaryMatch) {
        const r = parseInt(secondaryMatch[1])
        const g = parseInt(secondaryMatch[2])
        const b = parseInt(secondaryMatch[3])
        secondaryOpacity.value = parseFloat(secondaryMatch[4])

        // Convert to hex
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        colorPickerSecondary.value = hex
        secondaryHex.value = hex
      }

      // Parse colors with opacity (card background)
      const cardBgMatch = content.styles.cardBackground.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
      if (cardBgMatch) {
        const r = parseInt(cardBgMatch[1])
        const g = parseInt(cardBgMatch[2])
        const b = parseInt(cardBgMatch[3])
        cardBgOpacity.value = parseFloat(cardBgMatch[4])

        // Convert to hex
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        colorPickerCardBg.value = hex
        cardBgHex.value = hex
      }

      // Parse shadow properties
      const shadowProps = parseShadowFromString(content.styles.shadow)
      shadowOffsetX.value = shadowProps.offsetX
      shadowOffsetY.value = shadowProps.offsetY
      shadowBlur.value = shadowProps.blur
      shadowSpread.value = shadowProps.spread
      shadowOpacity.value = shadowProps.a

      // Convert RGB to hex for shadow color
      const shadowHexColor = `#${shadowProps.r.toString(16).padStart(2, '0')}${shadowProps.g.toString(16).padStart(2, '0')}${shadowProps.b.toString(16).padStart(2, '0')}`
      shadowColor.value = shadowHexColor
      shadowHex.value = shadowHexColor

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

    // Update shadow before saving
    updateShadow()

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Tính phí nhanh',
      contentJson: JSON.stringify(content, null, 2),
      sortOrder: 4,
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
      thumbPreview.value = null

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

  if (content.sliderConfig.thumbIcon === tempUrl) {
    content.sliderConfig.thumbIcon = realUrl
  }
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.calculator-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Header */
.editor-header {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
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
  color: #3b82f6;
  background-color: #f8f9fa;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
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

/* Setting Section - Đảm bảo section lẻ chiếm full width */
.setting-section.full-width {
  grid-column: 1 / -1;
}

.setting-section:only-child {
  grid-column: 1 / -1;
}

/* Kiểm tra nếu có section lẻ trong fees-settings và styles-settings */
.fees-settings .setting-section,
.styles-settings .setting-section:first-child:nth-last-child(1),
.styles-settings .setting-section:first-child:nth-last-child(2):nth-child(1),
.styles-settings .setting-section:first-child:nth-last-child(2):nth-child(2) {
  /* Khi có 1 hoặc 2 section, vẫn giữ layout 2 cột */
}

/* Chỉ khi có 1 section trong fees-settings */
.fees-settings .setting-section {
  grid-column: 1 / -1;
}

.setting-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.setting-section h3 {
  margin: 0 0 20px 0;
  color: #1e40af;
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

.form-hint {
  display: block;
  margin-top: 5px;
  color: #6c757d;
  font-size: 0.85rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.section-description {
  color: #6c757d;
  margin-bottom: 20px;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Fees Table */
.table-container {
  overflow-x: auto;
  margin: 20px 0;
}

.fees-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fees-table th {
  background: #3b82f6;
  color: white;
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.fees-table td {
  padding: 10px 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.fees-table tr:last-child td {
  border-bottom: none;
}

.fees-table tr:hover {
  background-color: #f8f9fa;
}

.table-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
}

.table-actions {
  display: flex;
  gap: 5px;
}

.btn-table-action {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background-color: #f8f9fa;
  color: #495057;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-table-action:hover:not(:disabled) {
  background-color: #e9ecef;
  transform: translateY(-1px);
}

.btn-table-action.btn-danger:hover:not(:disabled) {
  background-color: #dc3545;
  color: white;
}

.btn-table-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

/* Preview Box */
.preview-box {
  padding: 25px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  font-size: 1.2rem;
  font-weight: 600;
}

.preview-header i {
  font-size: 1.8rem;
}

.preview-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.preview-input,
.preview-result {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.preview-input i,
.preview-result i {
  font-size: 1.5rem;
  opacity: 0.8;
}

.preview-value,
.preview-fee {
  margin-left: auto;
  font-weight: 700;
  font-size: 1.1rem;
}

.preview-slider {
  position: relative;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin: 15px 0;
}

.preview-slider-track {
  position: absolute;
  top: 50%;
  left: 20px;
  right: 20px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  transform: translateY(-50%);
}

.preview-slider-thumb {
  position: absolute;
  top: 50%;
  left: 30%;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -50%);
}

.preview-quick-values {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 0.9rem;
  opacity: 0.8;
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
  border-color: #3b82f6;
  background-color: #f8f9ff;
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
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}

.btn-preview-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-preview-action:hover {
  background-color: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.btn-preview-action i {
  font-size: 0.9rem;
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
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
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
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.btn-close-modal {
  color: #6c757d;
  font-size: 1.2rem;
}

.btn-close-modal:hover {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
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
  padding: 20px 30px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  color: #1e40af;
  font-size: 1.3rem;
}

.modal-body {
  padding: 30px;
  flex: 1;
  overflow-y: auto;
}

.image-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  max-height: 500px;
  overflow: auto;
  margin-bottom: 20px;
}

.image-preview-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-placeholder {
  text-align: center;
  color: #6c757d;
  padding: 40px;
}

.preview-placeholder i {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #dee2e6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

/* Toast */
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

.toast-notification.info {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
}

.toast-notification.warning {
  background: linear-gradient(135deg, #ffc107 0%, #ffca2c 100%);
  color: #212529;
}

.btn-toast-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
  opacity: 0.8;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.btn-toast-close:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

.toast-notification.success .btn-toast-close:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.toast-notification.error .btn-toast-close:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Color Input */
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

/* Color Input with Opacity */
.color-input-with-opacity {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color-opacity-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-opacity-row input[type="color"] {
  width: 50px;
  height: 40px;
  padding: 0;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.color-opacity-row input[type="text"] {
  flex: 1;
}

.opacity-slider {
  width: 100%;
}

.opacity-slider label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #495057;
}

.opacity-slider input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
}

.opacity-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.opacity-slider input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Shadow Input Group */
.shadow-input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.shadow-input-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.shadow-color-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.shadow-color-input label {
  min-width: 80px;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.shadow-color-input input[type="color"] {
  width: 50px;
  height: 40px;
  padding: 0;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
}

.shadow-hex-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
}

.shadow-opacity-slider {
  width: 100%;
}

.shadow-opacity-slider label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #495057;
}

.shadow-opacity-slider input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
}

.shadow-opacity-slider input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.shadow-properties {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.shadow-preview {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.shadow-preview label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.shadow-preview-box {
  margin-bottom: 15px;
  transition: box-shadow 0.3s ease;
}

.shadow-final-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background-color: white;
  font-family: monospace;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.shadow-final-input:hover {
  border-color: #3b82f6;
  background-color: #f8f9ff;
}

.shadow-final-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

.input-with-unit.compact input {
  padding-right: 60px;
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
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(30px);
  }
}

/* Responsive */
@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-section.full-width {
    grid-column: 1;
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

  .form-row {
    grid-template-columns: 1fr;
  }

  .navigation-tabs {
    flex-wrap: wrap;
    padding: 0 20px;
  }

  .tab-button {
    flex: 1;
    min-width: 150px;
    justify-content: center;
  }

  .shadow-color-input {
    flex-direction: column;
    align-items: flex-start;
  }

  .shadow-color-input label {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .editor-header h2 {
    font-size: 1.5rem;
    text-align: center;
  }

  .tab-content {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .toast-notification {
    left: 20px;
    right: 20px;
    max-width: none;
  }

  .color-input,
  .color-opacity-row {
    flex-direction: column;
    align-items: stretch;
  }

  .color-input input[type="color"],
  .color-opacity-row input[type="color"] {
    width: 100%;
    height: 40px;
  }
}
</style>