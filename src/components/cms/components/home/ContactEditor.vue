<template>
  <div class="services-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Mục Liên hệ</h2>
      <div class="header-controls">
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
          :class="{ active: activeTab === 'reasons' }"
          @click="activeTab = 'reasons'"
      >
        <i class="fas fa-list"></i> Lý do chọn ({{ reasons.length }})
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'form' }"
          @click="activeTab = 'form'"
      >
        <i class="fas fa-edit"></i> Cấu hình Form
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab cài đặt chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Tiêu đề & Nút -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Nội dung chính</h3>
            <div class="form-group">
              <label for="section-slogan">Slogan/khẩu hiệu</label>
              <textarea
                  id="section-slogan"
                  v-model="settings.slogan"
                  rows="2"
                  placeholder="Kết nối hợp tác – Cùng kiến tạo giá trị bất động sản bền vững"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="reasons-title">Tiêu đề lý do</label>
              <input
                  type="text"
                  id="reasons-title"
                  v-model="settings.reasonsTitle"
                  placeholder="Tại sao chọn Thiên Hà Group?"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="submit-button-text">Văn bản nút gửi</label>
                <input
                    type="text"
                    id="submit-button-text"
                    v-model="settings.submitButtonText"
                    placeholder="Gửi thông tin"
                />
              </div>
              <div class="form-group">
                <label for="success-message">Thông báo thành công</label>
                <input
                    type="text"
                    id="success-message"
                    v-model="settings.successMessage"
                    placeholder="Gửi thông tin thành công!"
                />
              </div>
            </div>
          </div>

          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc & Giao diện</h3>
            <div class="color-grid">
              <div class="color-input-group form-group">
                <label>Màu chính</label>
                <div class="color-input">
                  <input type="color" v-model="settings.primaryColor" />
                  <input type="text" v-model="settings.primaryColor" placeholder="#031358" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu phụ</label>
                <div class="color-input">
                  <input type="color" v-model="settings.secondaryColor" />
                  <input type="text" v-model="settings.secondaryColor" placeholder="#0629BE" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu nhấn</label>
                <div class="color-input">
                  <input type="color" v-model="settings.accentColor" />
                  <input type="text" v-model="settings.accentColor" placeholder="#FFD700" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu văn bản</label>
                <div class="color-input">
                  <input type="color" v-model="settings.textColor" />
                  <input type="text" v-model="settings.textColor" placeholder="#FFFFFF" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu nền</label>
                <div class="color-input">
                  <input type="color" v-model="settings.backgroundColor" />
                  <input type="text" v-model="settings.backgroundColor" placeholder="#FFFFFF" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu lỗi</label>
                <div class="color-input">
                  <input type="color" v-model="settings.errorColor" />
                  <input type="text" v-model="settings.errorColor" placeholder="#e53e3e" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu thành công</label>
                <div class="color-input">
                  <input type="color" v-model="settings.successColor" />
                  <input type="text" v-model="settings.successColor" placeholder="#48bb78" />
                </div>
              </div>
            </div>
            <div class="form-row" style="margin-top: 15px;">
              <div class="form-group">
                <label>Gradient bắt đầu</label>
                <div class="color-input">
                  <input type="color" v-model="settings.gradientStart" />
                  <input type="text" v-model="settings.gradientStart" placeholder="#031358" />
                </div>
              </div>
              <div class="form-group">
                <label>Gradient kết thúc</label>
                <div class="color-input">
                  <input type="color" v-model="settings.gradientEnd" />
                  <input type="text" v-model="settings.gradientEnd" placeholder="#0629BE" />
                </div>
              </div>
            </div>

            <!-- Các thuộc tính giao diện bổ sung -->
            <div class="form-row" style="margin-top: 15px;">
              <div class="form-group">
                <label for="font-family">Font chữ</label>
                <select id="font-family" v-model="settings.fontFamily">
                  <option value="'Inter', 'Segoe UI', sans-serif">Inter</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                  <option value="'Montserrat', sans-serif">Montserrat</option>
                  <option value="'Poppins', sans-serif">Poppins</option>
                </select>
              </div>
              <div class="form-group">
                <label for="border-radius">Border Radius</label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="border-radius"
                      v-model="settings.borderRadius"
                      placeholder="1rem"
                  />
                  <span class="unit">rem</span>
                </div>
              </div>
            </div>

            <div class="form-row" style="margin-top: 15px;">
              <div class="form-group">
                <label for="input-border-color">Màu viền input</label>
                <div class="color-input">
                  <input type="color" v-model="settings.inputBorderColor" />
                  <input type="text" v-model="settings.inputBorderColor" placeholder="#e2e8f0" />
                </div>
              </div>
              <div class="form-group">
                <label for="input-focus-color">Màu viền focus</label>
                <div class="color-input">
                  <input type="color" v-model="settings.inputFocusBorderColor" />
                  <input type="text" v-model="settings.inputFocusBorderColor" placeholder="#031358" />
                </div>
              </div>
            </div>

            <div class="form-row" style="margin-top: 15px;">
              <div class="form-group">
                <label for="label-color">Màu nhãn</label>
                <div class="color-input">
                  <input type="color" v-model="settings.labelColor" />
                  <input type="text" v-model="settings.labelColor" placeholder="#64748b" />
                </div>
              </div>
              <div class="form-group">
                <label for="button-hover">Màu nút hover</label>
                <div class="color-input">
                  <input type="color" v-model="settings.buttonHoverColor" />
                  <input type="text" v-model="settings.buttonHoverColor" placeholder="#0629BE" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab danh sách lý do -->
      <div v-if="activeTab === 'reasons'" class="services-management">
        <div class="services-container">
          <!-- Danh sách lý do -->
          <div class="services-list">
            <div
                v-for="(reason, index) in reasons"
                :key="reason.id"
                class="service-item"
                :class="{ active: activeReasonIndex === index }"
                @mouseenter="hoveredReasonIndex = index"
                @mouseleave="hoveredReasonIndex = -1"
                @click="selectReason(index)"
            >
              <div class="service-content">
                <div class="service-icon" v-if="reason.icon">
                  <i :class="reason.icon"></i>
                </div>
                <div class="service-info">
                  <h4>{{ reason.title || 'Lý do chưa có tên' }}</h4>
                  <p class="service-index">Lý do {{ index + 1 }}</p>
                </div>
              </div>
              <div class="service-actions" v-show="hoveredReasonIndex === index">
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeReason(index)"
                    title="Xóa lý do"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <button class="btn btn-primary" @click="addNewReason" style="margin-top: 10px;">
              <i class="fas fa-plus"></i> Thêm Lý do Mới
            </button>
          </div>

          <!-- Form chỉnh sửa lý do -->
          <div v-if="activeReason !== null" class="service-editor">
            <div class="editor-header">
              <h3>Chỉnh sửa lý do {{ activeReasonIndex + 1 }}</h3>
              <div class="editor-actions">
                <button class="btn btn-secondary" @click="duplicateReason">
                  <i class="fas fa-copy"></i> Nhân bản
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveReasonUp(activeReasonIndex)"
                    :disabled="activeReasonIndex === 0"
                    title="Di chuyển lên"
                >
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveReasonDown(activeReasonIndex)"
                    :disabled="activeReasonIndex === reasons.length - 1"
                    title="Di chuyển xuống"
                >
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="reason-title">
                <i class="fas fa-heading"></i> Tiêu đề lý do
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="reason-title"
                  v-model="activeReason.title"
                  placeholder="Nhập tiêu đề lý do..."
              />
            </div>

            <div class="form-group">
              <label for="reason-description">
                <i class="fas fa-align-left"></i> Mô tả chi tiết
                <span class="required-mark">*</span>
              </label>
              <textarea
                  id="reason-description"
                  v-model="activeReason.description"
                  rows="4"
                  placeholder="Nhập mô tả chi tiết về lý do..."
              ></textarea>
            </div>

            <div class="form-group">
              <label for="reason-icon">
                <i class="fas fa-icons"></i> Biểu tượng
              </label>
              <IconPicker v-model="activeReason.icon" title="Chọn biểu tượng cho lý do" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab cấu hình form -->
      <div v-if="activeTab === 'form'" class="form-settings">
        <div class="settings-grid">
          <!-- Danh sách các trường -->
          <div class="setting-section">
            <h3><i class="fas fa-list-alt"></i> Các trường Form</h3>
            <p class="section-description">Quản lý các trường thông tin trong form liên hệ</p>

            <div class="fields-list">
              <div
                  v-for="(fieldKey, index) in formFieldsOrder"
                  :key="fieldKey"
                  class="field-item"
                  @click="editField(fieldKey)"
                  :class="{ 'selected': editingField === fieldKey }"
              >
                <div class="field-header">
                  <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                  </div>
                  <div class="field-info">
                    <h4>{{ getFieldLabel(fieldKey) }}</h4>
                    <div class="field-meta">
                      <span class="field-type">{{ getFieldTypeLabel(formFields[fieldKey].type) }}</span>
                      <span class="field-required">{{ formFields[fieldKey].required ? 'Bắt buộc' : 'Không bắt buộc' }}</span>
                    </div>
                  </div>
                  <div class="field-actions">
                    <button
                        class="btn-icon"
                        @click.stop="toggleFieldActive(fieldKey)"
                        :title="formFields[fieldKey].active ? 'Ẩn trường' : 'Hiện trường'"
                    >
                      <i :class="formFields[fieldKey].active ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                    </button>
                    <button
                        class="btn-icon"
                        @click.stop="editField(fieldKey)"
                        title="Chỉnh sửa"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                        class="btn-icon btn-remove"
                        @click.stop="removeField(index)"
                        title="Xóa trường"
                        v-if="!isDefaultField(fieldKey)"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button class="btn btn-primary" @click="addNewField" style="margin-top: 15px;">
              <i class="fas fa-plus"></i> Thêm trường mới
            </button>
          </div>

          <!-- Form chỉnh sửa trường -->
          <div class="setting-section" v-if="editingField">
            <h3><i class="fas fa-edit"></i> Chỉnh sửa trường: {{ getFieldLabel(editingField) }}</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="field-label">Nhãn trường</label>
                <input
                    type="text"
                    id="field-label"
                    v-model="formFields[editingField].label"
                    placeholder="Nhập nhãn trường..."
                />
              </div>
              <div class="form-group">
                <label for="field-type">Loại trường</label>
                <select id="field-type" v-model="formFields[editingField].type">
                  <option value="text">Text</option>
                  <option value="tel">Số điện thoại</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="select">Dropdown/Select</option>
                  <option value="textarea">Textarea</option>
                  <option value="date">Ngày tháng</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="field-placeholder">Placeholder</label>
              <input
                  type="text"
                  id="field-placeholder"
                  v-model="formFields[editingField].placeholder"
                  placeholder="Nhập placeholder..."
              />
            </div>

            <div class="form-group">
              <label for="field-error-message">Thông báo lỗi</label>
              <input
                  type="text"
                  id="field-error-message"
                  v-model="formFields[editingField].errorMessage"
                  placeholder="Nhập thông báo lỗi..."
              />
            </div>

            <!-- Cấu hình cho trường có options (select) -->
            <div v-if="formFields[editingField].type === 'select'" class="form-group">
              <label for="field-options">Danh sách lựa chọn (mỗi dòng một option)</label>
              <textarea
                  id="field-options"
                  v-model="optionsText"
                  rows="4"
                  placeholder="Mỗi dòng là một lựa chọn..."
                  @input="updateOptions"
              ></textarea>
              <p class="input-hint">Nhập mỗi lựa chọn trên một dòng riêng</p>
            </div>

            <!-- Cấu hình validation cho các loại trường đặc biệt -->
            <div v-if="formFields[editingField].type === 'tel'" class="form-group">
              <label for="field-validation">Thông báo validation số điện thoại</label>
              <input
                  type="text"
                  id="field-validation"
                  v-model="formFields[editingField].validationMessage"
                  placeholder="Số điện thoại phải có 10 chữ số"
              />
            </div>

            <div v-if="formFields[editingField].type === 'number'" class="form-group">
              <label for="field-min">Giá trị tối thiểu</label>
              <input
                  type="number"
                  id="field-min"
                  v-model.number="formFields[editingField].min"
                  placeholder="0"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                      type="checkbox"
                      v-model="formFields[editingField].required"
                  />
                  <span class="checkmark"></span>
                  <span>Trường bắt buộc</span>
                </label>
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                      type="checkbox"
                      v-model="formFields[editingField].active"
                  />
                  <span class="checkmark"></span>
                  <span>Hiển thị trường</span>
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn btn-success" @click="saveFieldChanges">
                <i class="fas fa-save"></i> Lưu thay đổi
              </button>
              <button class="btn btn-secondary" @click="cancelFieldEdit">
                <i class="fas fa-times"></i> Hủy
              </button>
            </div>
          </div>

          <!-- Cấu hình chung form -->
          <div class="setting-section">
            <h3><i class="fas fa-sliders-h"></i> Cấu hình chung</h3>

            <div class="form-group">
              <label for="form-shadow">Độ bóng form</label>
              <div class="color-input">
                <input
                    type="color"
                    id="form-shadow-color"
                    v-model="settings.formShadowColor"
                    @change="updateFormShadow"
                />
                <input
                    type="text"
                    id="form-shadow"
                    v-model="settings.formShadow"
                    placeholder="0 10px 30px rgba(0, 0, 0, 0.2)"
                    @input="updateFormShadowWithColor"
                />
              </div>

            </div>

            <div class="form-group">
              <label for="button-shadow">Độ bóng nút</label>
              <div class="color-input">
                <input
                    type="color"
                    id="button-shadow-color"
                    v-model="settings.buttonShadowColor"
                    @change="updateButtonShadow"
                />
                <input
                    type="text"
                    id="button-shadow"
                    v-model="settings.buttonShadow"
                    placeholder="0 5px 15px rgba(0, 0, 0, 0.3)"
                    @input="updateButtonShadowWithColor"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="reasons-bg">Màu nền lý do</label>
              <div class="color-input">
                <input type="color" v-model="settings.reasonsBackground" />
                <input type="text" v-model="settings.reasonsBackground" placeholder="rgba(255, 255, 255, 0.1)" />
              </div>
            </div>

            <div class="form-group">
              <label for="tooltip-bg">Màu nền tooltip</label>
              <div class="color-input">
                <input type="color" v-model="settings.tooltipBackground" />
                <input type="text" v-model="settings.tooltipBackground" placeholder="#FFFFFF" />
              </div>
            </div>

            <div class="form-group">
              <label for="tooltip-text">Màu chữ tooltip</label>
              <div class="color-input">
                <input type="color" v-model="settings.tooltipTextColor" />
                <input type="text" v-model="settings.tooltipTextColor" placeholder="#031358" />
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import api from '../../../../api/api.js'
import IconPicker from "../../../RichTextEditor/IconPicker.vue";

// ========== STATE MANAGEMENT ==========
const reasons = ref([])
const activeReasonIndex = ref(0)
const activeReason = computed(() =>
    activeReasonIndex.value !== null && reasons.value.length > 0
        ? reasons.value[activeReasonIndex.value]
        : null
)

const activeTab = ref('general')
const hoveredReasonIndex = ref(-1)

// Form fields management
const formFieldsOrder = ref([])
const editingField = ref(null)
const optionsText = ref('')

// Settings object with structure from JSON
const settings = reactive({
  slogan: "Kết nối hợp tác – Cùng kiến tạo giá trị bất động sản bền vững",
  reasonsTitle: "Tại sao chọn Thiên Hà Group?",
  submitButtonText: "Gửi thông tin",
  successMessage: "Gửi thông tin thành công!",
  primaryColor: "#031358",
  secondaryColor: "#0629BE",
  accentColor: "#FFD700",
  textColor: "#FFFFFF",
  backgroundColor: "#FFFFFF",
  errorColor: "#e53e3e",
  successColor: "#48bb78",
  gradientStart: "#031358",
  gradientEnd: "#0629BE",
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  borderRadius: "1rem",
  inputBorderColor: "#e2e8f0",
  inputFocusBorderColor: "#031358",
  labelColor: "#64748b",
  tooltipBackground: "#FFFFFF",
  tooltipTextColor: "#031358",
  buttonHoverColor: "#0629BE",
  buttonShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  formShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  reasonsBackground: "rgba(255, 255, 255, 0.1)",
  // Thêm 2 thuộc tính mới cho màu bóng
  formShadowColor: "#000000",
  buttonShadowColor: "#000000"
})

// Default field keys that cannot be removed
const DEFAULT_FIELDS = ['fullName', 'phone', 'need', 'price', 'area', 'note']

// Form fields configuration with updated structure
const formFields = reactive({
  fullName: {
    type: "text",
    label: "Họ và tên",
    placeholder: "Nhập họ và tên đầy đủ",
    required: true,
    errorMessage: "Vui lòng nhập họ và tên",
    active: true
  },
  phone: {
    type: "tel",
    label: "Số điện thoại",
    placeholder: "Nhập số điện thoại",
    required: true,
    errorMessage: "Vui lòng nhập số điện thoại",
    validationMessage: "Số điện thoại phải có 10 chữ số",
    active: true
  },
  need: {
    type: "select",
    label: "Nhu cầu",
    placeholder: "Chọn nhu cầu của bạn",
    required: true,
    errorMessage: "Vui lòng chọn nhu cầu",
    options: [
      "Mua",
      "Bán gấp",
      "Bán giá mong muốn",
      "Cho thuê",
      "Cần tư vấn"
    ],
    active: true
  },
  price: {
    type: "number",
    label: "Giá bán (VNĐ)",
    placeholder: "Nhập giá bán",
    required: true,
    errorMessage: "Vui lòng nhập giá bán",
    min: 0,
    active: true
  },
  area: {
    type: "text",
    label: "Khu vực",
    placeholder: "Nhập khu vực",
    required: true,
    errorMessage: "Vui lòng nhập khu vực",
    active: true
  },
  note: {
    type: "textarea",
    label: "Ghi chú thêm",
    placeholder: "Nhập thông tin bổ sung về bất động sản hoặc yêu cầu khác...",
    required: false,
    errorMessage: "",
    active: true
  }
})

// UI State
const isLoading = ref(false)

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// ========== CONSTANTS ==========
const BASE_IMAGE_URL = ''

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

const getFieldLabel = (fieldKey) => {
  return formFields[fieldKey]?.label || fieldKey
}

const getFieldTypeLabel = (type) => {
  const typeLabels = {
    'text': 'Text',
    'tel': 'Số điện thoại',
    'email': 'Email',
    'number': 'Số',
    'select': 'Dropdown',
    'textarea': 'Textarea',
    'date': 'Ngày'
  }
  return typeLabels[type] || type
}

const isDefaultField = (fieldKey) => {
  return DEFAULT_FIELDS.includes(fieldKey)
}

// ========== SHADOW COLOR MANAGEMENT ==========
const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

const updateFormShadow = () => {
  // Cập nhật giá trị formShadow với màu mới
  const shadowValue = settings.formShadow
  const parts = shadowValue.split('rgba')

  if (parts.length > 1) {
    // Nếu có rgba, thay thế phần màu
    const alphaMatch = shadowValue.match(/rgba\([^)]+\)/)
    let alpha = 0.2
    if (alphaMatch) {
      const alphaPart = alphaMatch[0].match(/\d+(\.\d+)?\)$/)
      if (alphaPart) {
        alpha = parseFloat(alphaPart[0].replace(')', ''))
      }
    }

    const newRgba = hexToRgba(settings.formShadowColor, alpha)
    settings.formShadow = `${parts[0]}${newRgba}`
  } else {
    // Nếu không có rgba, thêm mới
    settings.formShadow = `0 10px 30px ${hexToRgba(settings.formShadowColor, 0.2)}`
  }
}

const updateButtonShadow = () => {
  // Tương tự cho button shadow
  const shadowValue = settings.buttonShadow
  const parts = shadowValue.split('rgba')

  if (parts.length > 1) {
    const alphaMatch = shadowValue.match(/rgba\([^)]+\)/)
    let alpha = 0.3
    if (alphaMatch) {
      const alphaPart = alphaMatch[0].match(/\d+(\.\d+)?\)$/)
      if (alphaPart) {
        alpha = parseFloat(alphaPart[0].replace(')', ''))
      }
    }

    const newRgba = hexToRgba(settings.buttonShadowColor, alpha)
    settings.buttonShadow = `${parts[0]}${newRgba}`
  } else {
    settings.buttonShadow = `0 5px 15px ${hexToRgba(settings.buttonShadowColor, 0.3)}`
  }
}

const updateFormShadowWithColor = () => {
  // Khi người dùng chỉnh sửa trực tiếp input formShadow
  // Cập nhật màu từ giá trị mới
  const rgbaMatch = settings.formShadow.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1])
    const g = parseInt(rgbaMatch[2])
    const b = parseInt(rgbaMatch[3])

    settings.formShadowColor = rgbToHex(r, g, b)
  }
}

const updateButtonShadowWithColor = () => {
  // Tương tự cho button shadow
  const rgbaMatch = settings.buttonShadow.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1])
    const g = parseInt(rgbaMatch[2])
    const b = parseInt(rgbaMatch[3])

    settings.buttonShadowColor = rgbToHex(r, g, b)
  }
}

// ========== FORM FIELD MANAGEMENT ==========
const editField = (fieldKey) => {
  editingField.value = fieldKey
  if (formFields[fieldKey].type === 'select' && formFields[fieldKey].options) {
    optionsText.value = Array.isArray(formFields[fieldKey].options)
        ? formFields[fieldKey].options.join('\n')
        : ''
  } else {
    optionsText.value = ''
  }
}

const cancelFieldEdit = () => {
  editingField.value = null
  optionsText.value = ''
}

const saveFieldChanges = () => {
  if (!editingField.value) return

  showToast('Đã cập nhật cấu hình trường', 'success')
  editingField.value = null
  optionsText.value = ''
}

const updateOptions = () => {
  if (editingField.value && formFields[editingField.value].type === 'select') {
    const options = optionsText.value
        .split('\n')
        .map(option => option.trim())
        .filter(option => option.length > 0)

    formFields[editingField.value].options = options
  }
}

const toggleFieldActive = (fieldKey) => {
  formFields[fieldKey].active = !formFields[fieldKey].active
  showToast(
      `${formFields[fieldKey].active ? 'Hiển thị' : 'Ẩn'} trường "${formFields[fieldKey].label}"`,
      'success'
  )
}

const addNewField = () => {
  const fieldKey = `customField_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const newField = {
    type: "text",
    label: "Trường mới",
    placeholder: "Nhập thông tin...",
    required: false,
    errorMessage: "Vui lòng nhập thông tin",
    active: true
  }

  formFields[fieldKey] = newField
  formFieldsOrder.value.push(fieldKey)
  editingField.value = fieldKey
  showToast('Đã thêm trường mới', 'success')
}

const removeField = (index) => {
  const fieldKey = formFieldsOrder.value[index]

  // Check if it's a default field
  if (isDefaultField(fieldKey)) {
    showToast('Không thể xóa trường mặc định', 'warning')
    return
  }

  // Remove from order array
  formFieldsOrder.value.splice(index, 1)

  // Remove from formFields object
  delete formFields[fieldKey]

  // Clear editing if it was the field being edited
  if (editingField.value === fieldKey) {
    editingField.value = null
    optionsText.value = ''
  }

  showToast('Đã xóa trường', 'success')
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/12')

    if (response.data && response.data.contentJson) {
      // Parse lần 1: từ string sang object
      let content = JSON.parse(response.data.contentJson)

      // Nếu content.contentJson tồn tại và là string, parse tiếp
      if (content.contentJson && typeof content.contentJson === 'string') {
        content = JSON.parse(content.contentJson)
      }

      // Load settings
      if (content.slogan) settings.slogan = content.slogan
      if (content.reasonsTitle) settings.reasonsTitle = content.reasonsTitle
      if (content.submitButtonText) settings.submitButtonText = content.submitButtonText
      if (content.successMessage) settings.successMessage = content.successMessage
      if (content.primaryColor) settings.primaryColor = content.primaryColor
      if (content.secondaryColor) settings.secondaryColor = content.secondaryColor
      if (content.accentColor) settings.accentColor = content.accentColor
      if (content.textColor) settings.textColor = content.textColor
      if (content.backgroundColor) settings.backgroundColor = content.backgroundColor
      if (content.errorColor) settings.errorColor = content.errorColor
      if (content.successColor) settings.successColor = content.successColor
      if (content.gradientStart) settings.gradientStart = content.gradientStart
      if (content.gradientEnd) settings.gradientEnd = content.gradientEnd
      if (content.fontFamily) settings.fontFamily = content.fontFamily
      if (content.borderRadius) settings.borderRadius = content.borderRadius
      if (content.inputBorderColor) settings.inputBorderColor = content.inputBorderColor
      if (content.inputFocusBorderColor) settings.inputFocusBorderColor = content.inputFocusBorderColor
      if (content.labelColor) settings.labelColor = content.labelColor
      if (content.tooltipBackground) settings.tooltipBackground = content.tooltipBackground
      if (content.tooltipTextColor) settings.tooltipTextColor = content.tooltipTextColor
      if (content.buttonHoverColor) settings.buttonHoverColor = content.buttonHoverColor
      if (content.buttonShadow) settings.buttonShadow = content.buttonShadow
      if (content.formShadow) settings.formShadow = content.formShadow
      if (content.reasonsBackground) settings.reasonsBackground = content.reasonsBackground

      // Load shadow colors
      if (content.formShadowColor) settings.formShadowColor = content.formShadowColor
      if (content.buttonShadowColor) settings.buttonShadowColor = content.buttonShadowColor

      // Load form fields - QUAN TRỌNG: Khởi tạo formFields với dữ liệu từ API
      if (content.formFields) {
        // Xóa tất cả formFields hiện tại
        Object.keys(formFields).forEach(key => {
          delete formFields[key]
        })

        // Thêm dữ liệu từ API vào formFields
        Object.keys(content.formFields).forEach(key => {
          formFields[key] = {
            ...content.formFields[key],
            // Đảm bảo có thuộc tính active và các thuộc tính mặc định
            active: content.formFields[key].active !== undefined ? content.formFields[key].active : true,
            required: content.formFields[key].required !== undefined ? content.formFields[key].required : false,
            // Đảm bảo options là mảng nếu là select
            options: content.formFields[key].type === 'select' && content.formFields[key].options
                ? [...content.formFields[key].options]
                : []
          }
        })

        // Khởi tạo formFieldsOrder với các key từ formFields
        formFieldsOrder.value = Object.keys(formFields)
      } else {
        // Nếu API không trả về formFields, sử dụng mặc định và khởi tạo order
        formFieldsOrder.value = Object.keys(formFields)
      }

      // Load reasons
      let reasonsData = []

      // Trường hợp 1: reasons ở root
      if (content.reasons && Array.isArray(content.reasons)) {
        reasonsData = content.reasons
      }
      // Trường hợp 2: reasons ở trong nested object
      else if (content.contentJson && content.contentJson.reasons && Array.isArray(content.contentJson.reasons)) {
        reasonsData = content.contentJson.reasons
      }

      console.log('Loaded reasons:', reasonsData)
      console.log('Loaded form fields:', formFields) // Debug log
      console.log('Form fields order:', formFieldsOrder.value) // Debug log

      reasons.value = reasonsData.map((reason, index) => ({
        id: reason.id || `reason-${Date.now()}-${index}`,
        title: reason.title || '',
        description: reason.description || '',
        icon: reason.icon || ''
      }))

      // Nếu không có reasons, tạo mặc định
      if (reasons.value.length === 0) {
        reasons.value = [createNewReason()]
      }

      showToast('Dữ liệu đã được tải thành công', 'success')
    } else {
      // Nếu không có dữ liệu từ API, vẫn khởi tạo formFieldsOrder với dữ liệu mặc định
      formFieldsOrder.value = Object.keys(formFields)
      showToast('Không tìm thấy dữ liệu, sử dụng cấu hình mặc định', 'warning')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu từ server', 'error')

    // Fallback: sử dụng data mẫu
    const fallbackData = {
      "slogan": "Kết nối hợp tác – Cùng kiến tạo giá trị bất động sản bền vững",
      "reasons": [
        {
          "title": "Bán nhanh trong 30 ngày",
          "icon": "fas fa-bolt",
          "description": "Với hệ thống tiếp cận khách hàng rộng khắp và chiến lược marketing hiệu quả, chúng tôi cam kết giúp bạn bán được bất động sản trong vòng 30 ngày."
        }
      ],
      "formFields": formFields,
      "formShadowColor": "#000000",
      "buttonShadowColor": "#000000"
    }

    // Áp dụng fallback data
    Object.assign(settings, fallbackData)
    reasons.value = fallbackData.reasons.map((reason, index) => ({
      id: reason.id || `reason-${Date.now()}-${index}`,
      title: reason.title || '',
      description: reason.description || '',
      icon: reason.icon || ''
    }))

    // Khởi tạo formFieldsOrder với fallback
    formFieldsOrder.value = Object.keys(formFields)
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare form fields data
    const formFieldsData = {}
    formFieldsOrder.value.forEach(key => {
      if (formFields[key]) {
        // Tạo bản sao của field, loại bỏ thuộc tính active không cần thiết trong JSON gửi đi
        const { active, ...fieldData } = formFields[key]
        formFieldsData[key] = { ...fieldData }
      }
    })

    // Prepare content data
    const contentData = {
      ...settings,
      reasons: reasons.value.map(reason => ({
        id: reason.id,
        title: reason.title,
        description: reason.description,
        icon: reason.icon
      })),
      formFields: formFieldsData
    }

    // Prepare FormData
    const formData = new FormData()

    // Prepare section data
    const sectionData = {
      id: 12,
      name: 'Liên hệ',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 11,
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

// ========== REASON MANAGEMENT ==========
const createNewReason = () => ({
  id: `reason-${Date.now()}-${Math.random()}`,
  title: '',
  description: '',
  icon: ''
})

const addNewReason = () => {
  const newReason = createNewReason()
  reasons.value.push(newReason)
  activeReasonIndex.value = reasons.value.length - 1
  activeTab.value = 'reasons'
  showToast('Đã thêm lý do mới', 'success')
}

const selectReason = (index) => {
  activeReasonIndex.value = index
}

const moveReasonUp = (index) => {
  if (index > 0) {
    const temp = reasons.value[index]
    reasons.value[index] = reasons.value[index - 1]
    reasons.value[index - 1] = temp
    activeReasonIndex.value = index - 1
    showToast('Đã di chuyển lý do lên', 'success')
  }
}

const moveReasonDown = (index) => {
  if (index < reasons.value.length - 1) {
    const temp = reasons.value[index]
    reasons.value[index] = reasons.value[index + 1]
    reasons.value[index + 1] = temp
    activeReasonIndex.value = index + 1
    showToast('Đã di chuyển lý do xuống', 'success')
  }
}

const removeReason = (index) => {
  if (reasons.value.length === 0) {
    showToast('Không thể xóa lý do cuối cùng', 'warning')
    return
  }

  reasons.value.splice(index, 1)

  if (activeReasonIndex.value >= reasons.value.length) {
    activeReasonIndex.value = reasons.value.length - 1
  }

  showToast('Đã xóa lý do', 'success')
}

const duplicateReason = () => {
  if (!activeReason.value) return

  const duplicate = {
    ...JSON.parse(JSON.stringify(activeReason.value)),
    id: `reason-${Date.now()}-${Math.random()}`
  }

  reasons.value.splice(activeReasonIndex.value + 1, 0, duplicate)
  activeReasonIndex.value += 1
  showToast('Đã nhân bản lý do', 'success')
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})

watch(() => reasons.value, (newReasons) => {
  console.log('Reasons updated:', newReasons.length)
}, { deep: true })
</script>

<style scoped>
.services-editor {
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

.setting-section h3 i {
  color: #4a6cf7;
}

/* Form Settings Specific */
.section-description {
  color: #6c757d;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field-item {
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.field-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 2px 8px rgba(74, 108, 247, 0.1);
}

.field-item.selected {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.field-header {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  gap: 12px;
}

.drag-handle {
  cursor: move;
  color: #adb5bd;
  padding: 5px;
}

.drag-handle:hover {
  color: #031358;
}

.field-info {
  flex: 1;
}

.field-info h4 {
  margin: 0;
  color: #031358;
  font-size: 0.95rem;
  font-weight: 600;
}

.field-meta {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.field-type {
  font-size: 0.8rem;
  color: #4a6cf7;
  background: #eef2ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.field-required {
  font-size: 0.8rem;
  color: #6c757d;
  background: #f1f3f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.field-actions {
  display: flex;
  gap: 8px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
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
.form-group input[type="tel"],
.form-group input[type="email"],
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
.form-group textarea:focus,
.form-group select:focus {
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

/* Input Hint */
.input-hint {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 5px;
}

/* Services Management */
.services-management {
  display: flex;
  gap: 30px;
}

.services-container {
  display: flex;
  gap: 30px;
  width: 100%;
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
}

.btn-icon:hover:not(:disabled) {
  background-color: #dee2e6;
  color: #031358;
}

.btn-icon.btn-remove:hover:not(:disabled) {
  background-color: #dc3545;
  color: white;
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

  .form-settings .settings-grid {
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

  .service-editor .editor-header {
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

  .field-header {
    flex-wrap: wrap;
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

  .service-item {
    padding: 10px 12px;
  }

  .service-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
}
</style>