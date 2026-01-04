<template>
  <div class="create-edit-modal">
    <div v-if="modalLoading" class="modal-loading-overlay">
      <div class="modal-loading-content">
        <div class="modal-spinner"></div>
        <p>Đang tải dữ liệu chi nhánh...</p>
      </div>
    </div>

    <div v-else class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-left">
            <div class="modal-icon">
              <i class="fas" :class="isEditing ? 'fa-edit' : 'fa-plus-circle'"></i>
            </div>
            <div>
              <h2>{{ isEditing ? 'Chỉnh sửa' : 'Tạo mới' }} chi nhánh</h2>
              <p class="modal-subtitle">Nhập thông tin chi tiết cho chi nhánh đầu tư</p>
            </div>
          </div>
          <button class="btn-close" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">

          <div
              v-if="isEditing && formData.canReopen && !formData.parentId"
              class="reopen-section"
          >
            <div class="reopen-card">
              <div class="reopen-header">
                <div class="reopen-icon">
                  <i class="fas fa-redo"></i>
                </div>
                <div class="reopen-info">
                  <h4>Mở lại chi nhánh</h4>
                  <p class="reopen-description">
                    Chi nhánh này có thể được mở lại với các thiết lập mới.
                  </p>
                </div>
              </div>
              <button
                  type="button"
                  class="btn-reopen"
                  @click="handleReopenBranch"
              >
                <i class="fas fa-external-link-alt"></i>
                <span>Mở lại chi nhánh</span>
              </button>
            </div>
          </div>
          <!-- Thông tin đợt mở lại -->
          <div v-if="formData.parentId && isEditing" class="reopened-branch-info">
            <div class="reopened-badge">
              <i class="fas fa-redo"></i>
              <span>Đợt mở lại</span>
            </div>
            <div class="reopened-actions">
              <button
                  type="button"
                  class="btn-view-original"
                  @click="goToParentBranch"
              >
                <i class="fas fa-external-link-alt"></i>
                <span>Xem đợt gốc</span>
              </button>
            </div>
          </div>

          <!-- Danh sách chi nhánh con -->
          <div v-if="formData.children && formData.children.length > 0" class="children-branches-section">
            <div class="section-card">
              <div class="section-header">
                <div class="section-title">
                  <i class="fas fa-code-branch"></i>
                  <h3>Các đợt mở lại</h3>
                </div>
                <div class="section-decor"></div>
              </div>

              <div class="children-list">
                <div
                    v-for="child in formData.children"
                    :key="child.id"
                    class="child-branch-item"
                >
                  <div class="child-info">
                    <div class="child-icon">
                      <i class="fas fa-sitemap"></i>
                    </div>
                    <div class="child-details">
                      <h4>{{ child.name }}</h4>
                      <p class="child-id">ID: {{ child.id }}</p>
                    </div>
                  </div>
                  <button
                      type="button"
                      class="btn-view-child"
                      @click="goToChildBranch(child.id)"
                  >
                    <i class="fas fa-eye"></i>
                    <span>Xem chi tiết</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit">
            <!-- Branch Information -->
            <div class="section-card">
              <div class="section-header">
                <div class="section-title">
                  <i class="fas fa-building"></i>
                  <h3>Thông tin chi nhánh</h3>
                </div>
                <div class="section-decor"></div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <span class="label-text">Tên chi nhánh</span>
                    <span class="required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-signature input-icon"></i>
                    <input
                        v-model="formData.name"
                        type="text"
                        required
                        placeholder="Nhập tên chi nhánh"
                        class="form-input"
                        @input="generateSlugFromName"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="label-text">Slug</span>
                    <span class="required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-link input-icon"></i>
                    <input
                        v-model="formData.slug"
                        type="text"
                        required
                        placeholder="ten-chi-nhanh"
                        class="form-input"
                        @click="handleSlugClick"
                        @input="clearSlugWarning"
                    />
                    <div v-if="!isEditing" class="slug-actions">
                      <button
                          type="button"
                          class="btn-slug-generate"
                          @click="generateSlugFromName"
                          title="Lấy slug từ tiêu đề"
                      >
                        <i class="fas fa-magic"></i>
                      </button>
                    </div>
                  </div>
                  <div class="slug-hint" :class="{ 'warning': isEditing }">
                    <i v-if="isEditing" class="fas fa-exclamation-triangle"></i>
                    {{ isEditing
                      ? 'Slug được dùng cho URL, hạn chế sửa. Nếu sửa các link đã chia sẻ sẽ mất, ảnh hưởng SEO.'
                      : 'Đường dẫn URL cho chi nhánh'
                    }}
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="label-text">Mục tiêu đầu tư (VNĐ)</span>
                    <span class="required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-bullseye input-icon"></i>
                    <input
                        :value="targetAmountFormatted"
                        @input="handleTargetAmountInput"
                        type="text"
                        required
                        placeholder="1,000,000,000"
                        class="form-input"
                        @blur="formatTargetAmount"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="label-text">Trạng thái</span>
                    <span class="required">*</span>
                  </label>
                  <div class="status-select">
                    <div
                        v-for="status in availableStatusOptions"
                        :key="status.value"
                        :class="['status-option', { active: formData.status === status.value }]"
                        @click="handleStatusChange(status.value)"
                    >
                      <div class="status-dot" :style="{ backgroundColor: status.color }"></div>
                      <span>{{ status.label }}</span>
                    </div>
                  </div>
                </div>

                <!-- Ngày bắt đầu và kết thúc cho TẠO MỚI -->
                <div v-if="!isEditing && formData.status === 'OPEN'" class="form-group">
                  <label class="form-label">
                    <span class="label-text">Ngày bắt đầu</span>
                    <span class="required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-calendar-plus input-icon"></i>
                    <input
                        v-model="formData.startDate"
                        type="text"
                        readonly
                        disabled
                        class="form-input readonly-input"
                    />
                    <div class="readonly-overlay"></div>
                  </div>
                  <div class="date-hint">
                    <i class="fas fa-info-circle"></i>
                    <span>Ngày bắt đầu được tự động set là ngày hiện tại</span>
                  </div>
                </div>

                <div v-if="!isEditing && formData.status === 'OPEN'" class="form-group">
                  <label class="form-label">
                    <span class="label-text">Ngày kết thúc</span>
                    <span class="required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-calendar-minus input-icon"></i>
                    <input
                        v-model="formData.endDate"
                        type="datetime-local"
                        required
                        class="form-input"
                        :min="getTomorrowDate()"
                        @change="calculateDateDifference"
                    />
                  </div>
                  <div v-if="dateDifference.days !== null" class="date-difference">
                    <i class="fas fa-clock"></i>
                    <span>Khoảng cách: {{ dateDifference.days }} ngày ({{ dateDifference.months }} tháng)</span>
                  </div>
                  <div class="date-hint">
                    <i class="fas fa-info-circle"></i>
                    <span>Ngày kết thúc phải sau ngày hiện tại</span>
                  </div>
                </div>

                <!-- Khi CHỈNH SỬA và đang là OPEN hoặc đang chuyển sang OPEN -->
                <div v-if="isEditing && showOpenDateFields" class="form-group">
                  <label class="form-label">
                    <span class="label-text">Ngày bắt đầu</span>
                    <span class="required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-calendar-plus input-icon"></i>
                    <input
                        v-model="formData.startDate"
                        type="text"
                        readonly
                        disabled
                        class="form-input readonly-input"
                    />
                    <div class="readonly-overlay"></div>
                  </div>
                  <div class="date-hint">
                    <i class="fas fa-info-circle"></i>
                    <span>Ngày bắt đầu được tự động set là ngày hiện tại</span>
                  </div>
                </div>

                <div v-if="isEditing && showOpenDateFields" class="form-group">
                  <label class="form-label">
                    <span class="label-text">Ngày kết thúc</span>
                    <span class="required">*</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-calendar-minus input-icon"></i>
                    <input
                        v-model="formData.endDate"
                        type="datetime-local"
                        required
                        class="form-input"
                        :min="getTomorrowDate()"
                        @change="calculateDateDifference"
                    />
                  </div>
                  <div v-if="dateDifference.days !== null" class="date-difference">
                    <i class="fas fa-clock"></i>
                    <span>Khoảng cách: {{ dateDifference.days }} ngày ({{ dateDifference.months }} tháng)</span>
                  </div>
                  <div class="date-hint">
                    <i class="fas fa-info-circle"></i>
                    <span>Ngày kết thúc phải sau ngày hiện tại</span>
                  </div>
                </div>

                <!-- Khi CHỈNH SỬA và KHÔNG phải OPEN (hiển thị readonly) -->
                <div v-if="isEditing && !showOpenDateFields && formData.startDate" class="form-group">
                  <label class="form-label">
                    <span class="label-text">Ngày bắt đầu</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-calendar-plus input-icon"></i>
                    <input
                        v-model="displayStartDate"
                        type="text"
                        readonly
                        class="form-input readonly-input"
                    />
                    <div class="readonly-overlay"></div>
                  </div>
                </div>

                <div v-if="isEditing && !showOpenDateFields && formData.endDate" class="form-group">
                  <label class="form-label">
                    <span class="label-text">Ngày kết thúc</span>
                  </label>
                  <div class="input-wrapper">
                    <i class="fas fa-calendar-minus input-icon"></i>
                    <input
                        v-model="displayEndDate"
                        type="text"
                        readonly
                        class="form-input readonly-input"
                    />
                    <div class="readonly-overlay"></div>
                  </div>
                  <div v-if="dateDifference.days !== null" class="date-difference">
                    <i class="fas fa-clock"></i>
                    <span>Khoảng: {{ dateDifference.days }} ngày</span>
                  </div>
                </div>

                <div class="form-group full-width">
                  <label class="form-label">
                    <span class="label-text">Mô tả chi nhánh</span>
                    <span class="required">*</span>
                  </label>
                  <div class="textarea-wrapper">
                  <textarea
                      v-model="formData.description"
                      rows="4"
                      required
                      placeholder="Mô tả chi tiết về chi nhánh, mục tiêu đầu tư, lợi ích..."
                      class="form-textarea"
                  ></textarea>
                    <div class="textarea-counter">
                      <span>{{ formData.description?.length || 0 }}/500</span>
                    </div>
                  </div>
                </div>

                <!-- Image Upload -->
                <div class="form-group full-width">
                  <label class="form-label">
                    <span class="label-text">Hình ảnh đại diện</span>
                  </label>
                  <div class="image-upload">
                    <input
                        type="file"
                        ref="fileInput"
                        @change="handleFileChange"
                        accept="image/*"
                        class="file-input"
                    />

                    <div v-if="!previewUrl" class="upload-area" @click="triggerFileInput">
                      <div class="upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                      </div>
                      <div class="upload-text">
                        <p class="upload-title">Click để tải ảnh lên</p>
                        <p class="upload-subtitle">Hỗ trợ JPG, PNG, GIF • Tối đa 5MB</p>
                      </div>
                      <div class="upload-actions">
                        <button type="button" class="btn-upload">
                          <i class="fas fa-folder-open"></i>
                          Chọn ảnh
                        </button>
                      </div>
                    </div>

                    <div v-else class="image-preview">
                      <div class="preview-container">
                        <img :src="getImgUrl(previewUrl)" alt="Preview" class="preview-image"/>
                        <div class="preview-overlay">
                          <button type="button" class="btn-preview-action" @click="triggerFileInput">
                            <i class="fas fa-sync-alt"></i>
                          </button>
                          <button type="button" class="btn-preview-action danger" @click="removeImage">
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div class="preview-info">
                        <span class="file-name">{{ selectedFile?.name || 'Ảnh đã tải lên' }}</span>
                        <span class="file-size">{{ formatFileSize(selectedFile?.size) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Packages Management -->
            <div class="section-card">
              <div class="section-header">
                <div class="section-title">
                  <i class="fas fa-box-open"></i>
                  <h3>Quản lý gói đầu tư</h3>
                </div>
                <div class="section-actions">
                  <button type="button" class="btn-add-package" @click="addNewPackage">
                    <i class="fas fa-plus-circle"></i>
                    <span>Thêm gói</span>
                  </button>
                </div>
              </div>

              <div v-if="formData.packages.length === 0" class="empty-packages">
                <div class="empty-icon">
                  <i class="fas fa-inbox"></i>
                </div>
                <p class="empty-text">Chưa có gói đầu tư nào</p>
                <button type="button" class="btn-empty-action" @click="addNewPackage">
                  Thêm gói đầu tiên
                </button>
              </div>

              <div v-else class="packages-list">
                <div
                    v-for="(pkg, index) in formData.packages"
                    :key="index"
                    class="package-card"
                >
                  <div class="package-header">
                    <div class="package-title">
                      <div class="package-number">Gói {{ index + 1 }}</div>
                      <div class="package-badge" :class="{ active: pkg.isActive }">
                        {{ pkg.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}
                      </div>
                    </div>
                    <button
                        type="button"
                        class="btn-remove-package"
                        @click="removePackage(index)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>

                  <div class="package-form">
                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">
                          <span class="label-text">Tên gói</span>
                          <span class="required">*</span>
                        </label>
                        <div class="input-wrapper">
                          <i class="fas fa-tag input-icon"></i>
                          <input
                              v-model="pkg.name"
                              type="text"
                              required
                              placeholder="Ví dụ: Gói Cơ bản, Gói Vip..."
                              class="form-input"
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">
                          <span class="label-text">Số tiền (VNĐ)</span>
                          <span class="required">*</span>
                        </label>
                        <div class="input-wrapper">
                          <i class="fas fa-money-bill-wave input-icon"></i>
                          <input
                              :value="getPackageAmountFormatted(index)"
                              @input="handlePackageAmountInput(index, $event.target.value)"
                              type="text"
                              required
                              placeholder="10,000,000"
                              class="form-input"
                              @blur="formatPackageAmount(index)"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label class="form-label">
                          <span class="label-text">Lợi nhuận (%)</span>
                          <span class="required">*</span>
                        </label>
                        <div class="input-wrapper">
                          <i class="fas fa-chart-line input-icon"></i>
                          <input
                              v-model.number="pkg.profitPercent"
                              type="number"
                              required
                              min="0"
                              max="100"
                              step="0.1"
                              placeholder="10.5"
                              class="form-input"
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="form-label">
                          <span class="label-text">Thời hạn (tháng)</span>
                          <span class="required">*</span>
                        </label>
                        <div class="input-wrapper">
                          <i class="fas fa-clock input-icon"></i>
                          <input
                              v-model.number="pkg.durationMonths"
                              type="number"
                              required
                              min="1"
                              placeholder="12"
                              class="form-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="package-switch">
                      <label class="switch-label">
                        <input
                            type="checkbox"
                            v-model="pkg.isActive"
                            class="switch-input"
                        />
                        <div class="switch-slider">
                          <div class="switch-knob"></div>
                        </div>
                        <span class="switch-text">Gói đang hoạt động</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">
                <i class="fas fa-times"></i>
                <span>Hủy</span>
              </button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <i class="fas" :class="submitting ? 'fa-spinner fa-spin' : isEditing ? 'fa-save' : 'fa-check'"></i>
                <span>{{ submitting ? 'Đang xử lý...' : isEditing ? 'Cập nhật' : 'Tạo mới' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import {baseImgaeUrl} from "../../assets/js/global.js";

const props = defineProps({
  isEditing: Boolean,
  formData: {
    type: Object,
    required: true,
    default: () => ({})
  },
  submitting: Boolean,
  modalLoading: Boolean
})

const emit = defineEmits([
  'close',
  'submit',
  'addPackage',
  'removePackage',
  'fileUpload',
  'removeImage',
  'showWarning',
  'goToBranch',
  'ReopenBranch'
])

// Khởi tạo reactive form data với cấu trúc đầy đủ
const formData = reactive({
  id: null,
  name: '',
  slug: '',
  description: '',
  targetAmount: 0,
  status: 'DRAFT',
  startDate: '',
  endDate: '',
  thumbnail: '',
  packages: [],
  parentId: null,
  children: [],
  canReopen: false
})

// Thêm hàm xử lý chuyển đến chi nhánh cha
const goToParentBranch = () => {
  if (formData.parentId) {
    emit('goToBranch', formData.parentId)
  }
}

// Thêm hàm xử lý chuyển đến chi nhánh con
const goToChildBranch = (childId) => {
  emit('goToBranch', childId)
}

const selectedFile = ref(null)
const previewUrl = ref('')
const fileInput = ref(null)
const slugWarningShown = ref(false)
const originalStatus = ref('DRAFT') // Lưu status ban đầu khi chỉnh sửa
const isTransitioningToOpen = ref(false) // Theo dõi trạng thái chuyển sang OPEN

// Tính khoảng cách ngày
const dateDifference = reactive({
  days: null,
  months: null
})

// Biến riêng để lưu ngày hiển thị (khi chỉnh sửa)
const displayStartDate = ref('')
const displayEndDate = ref('')

const allStatusOptions = [
  {value: 'DRAFT', label: 'Nháp', color: '#f59e0b'},
  {value: 'OPEN', label: 'Đang mở', color: '#10b981'},
  {value: 'CLOSED', label: 'Đã đóng', color: '#ef4444'},
  {value: 'FULL', label: 'Đã đầy', color: '#8b5cf6'}
]

// Computed property để kiểm tra xem có hiển thị field ngày cho OPEN không
const showOpenDateFields = computed(() => {
  if (!props.isEditing) {
    // Khi tạo mới, chỉ hiện khi status là OPEN
    return formData.status === 'OPEN'
  } else {
    // Khi chỉnh sửa, hiện khi:
    // 1. Đang là OPEN và đang có startDate (đã được set)
    // 2. Hoặc đang chuyển từ status khác sang OPEN (formData.status là OPEN nhưng originalStatus không phải OPEN)
    return formData.status === 'OPEN' &&
        (formData.startDate || formData.status !== originalStatus.value)
  }
})

// Computed property cho available status options
const availableStatusOptions = computed(() => {
  if (!props.isEditing) {

    if(props.formData.parentId != null) return allStatusOptions.filter(status => status.value === 'OPEN');

    // Khi tạo mới: chỉ cho phép DRAFT và OPEN
    return allStatusOptions.filter(status =>
        status.value === 'DRAFT' || status.value === 'OPEN'
    )
  } else {
    // Khi chỉnh sửa: dựa trên originalStatus, không dựa trên formData.status
    switch(originalStatus.value) {
      case 'DRAFT':
        return allStatusOptions.filter(status =>
            status.value === 'DRAFT' || status.value === 'OPEN'
        )
      case 'OPEN':
        return allStatusOptions.filter(status =>
            status.value === 'OPEN' || status.value === 'CLOSED'
        )
      case 'CLOSED':
      case 'FULL':
        // Các status khác không được sửa, chỉ hiện đúng status hiện tại
        return allStatusOptions.filter(status => status.value === originalStatus.value)
      default:
        return allStatusOptions.filter(status => status.value === originalStatus.value)
    }
  }
})

// Computed property cho target amount đã định dạng
const targetAmountFormatted = computed({
  get() {
    return formatNumberWithCommas(formData.targetAmount)
  },
  set(value) {
    // Không cần setter nữa vì đã xử lý bằng handleTargetAmountInput
  }
})

// ============ CÁC HÀM CẦN ĐƯỢC ĐỊNH NGHĨA TRƯỚC KHI watch ============

// Hàm lấy ngày giờ hiện tại
const getCurrentDateTime = () => {
  const now = new Date()
  // Format: YYYY-MM-DDTHH:mm
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Hàm lấy ngày mai (cho min date của endDate)
const getTomorrowDate = () => {
  const now = new Date()
  now.setDate(now.getDate() + 1)
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Hàm format ngày để hiển thị (dùng cho chỉnh sửa)
const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''

  // Nếu đã là định dạng hiển thị rồi (chứa /) thì giữ nguyên
  if (dateString.includes('/')) return dateString

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

// Hàm parse ngày từ string sang Date object
const parseDate = (dateString) => {
  if (!dateString) return null

  try {
    // Thử parse trực tiếp
    const date = new Date(dateString)
    if (!isNaN(date.getTime())) return date

    // Thử parse định dạng dd/mm/yyyy
    if (dateString.includes('/')) {
      const parts = dateString.split(/[/ :]/)
      if (parts.length >= 3) {
        const day = parseInt(parts[0])
        const month = parseInt(parts[1]) - 1
        const year = parseInt(parts[2])
        return new Date(year, month, day)
      }
    }

    return null
  } catch (error) {
    console.error('Error parsing date:', error)
    return null
  }
}

// Hàm định dạng số với dấu phẩy
const formatNumberWithCommas = (value) => {
  if (!value && value !== 0) return ''
  const num = value.toString().replace(/[^\d]/g, '')
  if (!num) return ''
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Hàm parse số từ chuỗi đã định dạng
const parseFormattedNumber = (formattedValue) => {
  if (!formattedValue) return 0
  const num = formattedValue.replace(/[^\d]/g, '')
  return num ? parseInt(num, 10) : 0
}

// Hàm xử lý input target amount
const handleTargetAmountInput = (event) => {
  const value = event.target.value
  // Chỉ cho phép nhập số và xóa ký tự không phải số
  const numericValue = value.replace(/[^\d]/g, '')
  // Cập nhật trực tiếp vào formData.targetAmount
  formData.targetAmount = numericValue ? parseInt(numericValue, 10) : 0
}

// Hàm format target amount khi blur
const formatTargetAmount = () => {
  // Đảm bảo targetAmount là số
  if (typeof formData.targetAmount === 'string') {
    formData.targetAmount = parseFloat(formData.targetAmount) || 0
  }
}

// Hàm xử lý input cho package amount
const handlePackageAmountInput = (index, value) => {
  // Chỉ cho phép nhập số và xóa ký tự không phải số
  const numericValue = value.replace(/[^\d]/g, '')
  // Cập nhật trực tiếp vào formData.packages
  formData.packages[index].amount = numericValue ? parseInt(numericValue, 10) : 0
}

// Hàm lấy giá trị đã định dạng của package amount
const getPackageAmountFormatted = (index) => {
  const amount = formData.packages[index]?.amount || 0
  return formatNumberWithCommas(amount)
}

// Hàm format package amount khi blur
const formatPackageAmount = (index) => {
  // Đảm bảo amount là số
  if (typeof formData.packages[index].amount === 'string') {
    formData.packages[index].amount = parseFloat(formData.packages[index].amount) || 0
  }
}

// Hàm tính khoảng cách ngày
const calculateDateDifference = () => {
  if (!formData.startDate || !formData.endDate) {
    dateDifference.days = null
    dateDifference.months = null
    return
  }

  const start = parseDate(formData.startDate)
  const end = parseDate(formData.endDate)

  if (!start || !end) {
    dateDifference.days = null
    dateDifference.months = null
    return
  }

  if (end < start) {
    dateDifference.days = 0
    dateDifference.months = 0
    return
  }

  // Tính số ngày
  const timeDiff = end.getTime() - start.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  // Tính số tháng xấp xỉ
  const monthsDiff = Math.round(daysDiff / 30.44)

  dateDifference.days = daysDiff
  dateDifference.months = monthsDiff
}

// Hàm generate slug từ tên
const generateSlugFromName = () => {
  if (!props.isEditing) {
    const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

    if (slug) {
      formData.slug = slug
    }
  }
}

// Hàm xử lý click vào slug
const handleSlugClick = () => {
  if (props.isEditing && !slugWarningShown.value) {
    slugWarningShown.value = true
    emit('showWarning', {
      type: 'warning',
      message: 'Slug được dùng cho URL, hạn chế sửa. Nếu sửa các link đã chia sẻ sẽ mất, ảnh hưởng SEO.',
      title: 'Cảnh báo thay đổi Slug'
    })
  }
}

// Hàm clear cảnh báo slug
const clearSlugWarning = () => {
  slugWarningShown.value = false
}

// Hàm xử lý thay đổi status
const handleStatusChange = (newStatus) => {
  if (props.isEditing) {
    // Khi chỉnh sửa: chỉ cho phép chuyển status hợp lệ dựa trên originalStatus
    const isValidTransition =
        (originalStatus.value === 'DRAFT' && newStatus === 'OPEN') ||
        (originalStatus.value === 'OPEN' && newStatus === 'CLOSED') ||
        newStatus === originalStatus.value // Cho phép chọn lại status hiện tại

    if (isValidTransition) {
      // Nếu đang từ DRAFT chuyển sang OPEN
      if (originalStatus.value === 'DRAFT' && newStatus === 'OPEN') {
        // Set startDate = hiện tại (disable)
        formData.startDate = getCurrentDateTime()
        // Clear endDate để người dùng nhập
        formData.endDate = ''

        // Show confirmation dialog
          formData.status = newStatus
          isTransitioningToOpen.value = true
      } else {
        formData.status = newStatus
      }
    }
  } else {
    // Khi tạo mới: xử lý logic ngày tháng
    formData.status = newStatus

    if (newStatus === 'OPEN') {
      // Khi chọn OPEN: set ngày bắt đầu là hiện tại (disable)
      formData.startDate = getCurrentDateTime()
      // Clear endDate để người dùng nhập
      formData.endDate = ''
    } else if (newStatus === 'DRAFT') {
      // Khi chọn DRAFT: clear cả startDate và endDate
      formData.startDate = ''
      formData.endDate = ''
    }
  }
}

// ============ WATCH VÀ CÁC HÀM KHÁC ============

// Watch để cập nhật formData từ props
// Sửa watch ở dòng ~540
watch(() => props.formData, (newFormData) => {
  if (newFormData) {
    // Cập nhật tất cả các trường từ props (BAO GỒM ID và canReopen)
    formData.id = newFormData.id || null
    formData.name = newFormData.name || ''
    formData.slug = newFormData.slug || ''
    formData.description = newFormData.description || ''
    formData.targetAmount = newFormData.targetAmount || 0
    formData.status = newFormData.status || 'DRAFT'
    formData.startDate = newFormData.startDate || ''
    formData.endDate = newFormData.endDate || ''
    formData.thumbnail = newFormData.thumbnail || ''
    formData.parentId = newFormData.parentId || null
    formData.children = newFormData.children || []

    // THÊM DÒNG NÀY - cập nhật canReopen
    formData.canReopen = newFormData.canReopen || false

    // Lưu original status khi chỉnh sửa
    if (props.isEditing) {
      originalStatus.value = newFormData.status || 'DRAFT'
      isTransitioningToOpen.value = false

      // Nếu chỉnh sửa và đang là DRAFT, clear date fields
      if (newFormData.status === 'DRAFT') {
        formData.startDate = ''
        formData.endDate = ''
      }
    }

    // DEEP CLONE packages - QUAN TRỌNG
    if (Array.isArray(newFormData.packages)) {
      formData.packages = newFormData.packages.map(pkg => ({
        id: pkg.id || null,
        name: pkg.name || '',
        amount: pkg.amount || 0,
        profitPercent: pkg.profitPercent || '',
        durationMonths: pkg.durationMonths || '',
        isActive: pkg.isActive !== undefined ? pkg.isActive : true
      }))
    } else {
      formData.packages = []
    }

    // Format ngày tháng cho hiển thị khi chỉnh sửa
    if (props.isEditing && formData.startDate && !isTransitioningToOpen.value) {
      displayStartDate.value = formatDateForDisplay(formData.startDate)
      displayEndDate.value = formatDateForDisplay(formData.endDate)
    }

    // Cập nhật preview image
    if (newFormData.thumbnail) {
      previewUrl.value = newFormData.thumbnail
    }

    // Tính khoảng cách ngày
    calculateDateDifference()
  }
}, { immediate: true, deep: true })

// Watch để cập nhật previewUrl khi formData.thumbnail thay đổi
watch(() => formData.thumbnail, (newThumbnail) => {
  if (newThumbnail && !selectedFile.value) {
    previewUrl.value = newThumbnail
  }
})

// Watch để tính lại khoảng cách ngày khi ngày thay đổi
watch(() => [formData.startDate, formData.endDate], () => {
  calculateDateDifference()
})

// Trong handleSubmit method của CreateEditModal.vue
const handleSubmit = () => {
  // Validate dữ liệu
  if (!validateForm()) return

  // Chuẩn bị dữ liệu gửi đi
  const formDataToSubmit = {
    id: formData.id,
    name: formData.name,
    slug: formData.slug,
    description: formData.description,
    targetAmount: formData.targetAmount.toString(),
    status: formData.status,
    startDate: formData.startDate,
    endDate: formData.endDate,
    thumbnail: formData.thumbnail,
    packages: formData.packages.map(pkg => ({
      id: pkg.id || null, // Giữ lại id
      name: pkg.name,
      amount: pkg.amount.toString(),
      profitPercent: pkg.profitPercent.toString(),
      durationMonths: pkg.durationMonths.toString(),
      isActive: pkg.isActive
    })),
    parentId: formData.parentId,
  }

  console.log('Form data để gửi:', JSON.stringify(formDataToSubmit, null, 2))

  // Debug: Kiểm tra ID khi là update
  if (props.isEditing) {
    console.log('📝 Modal đang ở chế độ EDIT, ID:', formDataToSubmit.id)
  }

  emit('submit', formDataToSubmit, selectedFile.value)
}

// Thêm hàm validate
const validateForm = () => {
  if (!formData.name?.trim()) {
    alert('Vui lòng nhập tên chi nhánh')
    return false
  }

  if (!formData.slug?.trim()) {
    alert('Vui lòng nhập slug')
    return false
  }

  if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
    alert('Vui lòng nhập số tiền mục tiêu hợp lệ')
    return false
  }

  // Validate ngày tháng khi status là OPEN
  if (formData.status === 'OPEN') {
    if (!formData.startDate) {
      alert('Vui lòng chọn ngày bắt đầu')
      return false
    }

    if (!formData.endDate) {
      alert('Vui lòng chọn ngày kết thúc')
      return false
    }

    // Kiểm tra ngày kết thúc phải sau ngày hiện tại
    const endDate = parseDate(formData.endDate)
    const now = new Date()
    if (endDate <= now) {
      alert('Ngày kết thúc phải sau ngày hiện tại')
      return false
    }
  }

  if (formData.packages.length === 0) {
    alert('Vui lòng thêm ít nhất một gói đầu tư')
    return false
  }

  // Validate từng package
  for (const pkg of formData.packages) {
    if (!pkg.name?.trim()) {
      alert('Vui lòng nhập tên cho tất cả các gói')
      return false
    }
    if (!pkg.amount || parseFloat(pkg.amount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ cho tất cả các gói')
      return false
    }
  }

  return true
}

const handleOverlayClick = (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    emit('close')
  }
}

const addNewPackage = () => {
  const newPackage = {
    id: null, // Thêm id để nhất quán
    name: '',
    amount: 0,
    profitPercent: '',
    durationMonths: '',
    isActive: true
  }
  formData.packages.push(newPackage)
}

const removePackage = (index) => {
  formData.packages.splice(index, 1)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB.')
      return
    }

    selectedFile.value = file
    emit('fileUpload', file)

    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedFile.value = null
  previewUrl.value = ''
  formData.thumbnail = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('removeImage')
}

const formatCurrency = (amount) => {
  if (!amount) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

// Thêm vào phần methods
const handleReopenBranch = () => {
    // Emit sự kiện về component cha
    console.log("reopen", formData.id)
    emit('ReopenBranch', formData.id)
}

onMounted(() => {
  // Khởi tạo dữ liệu từ props
  if (props.formData.thumbnail) {
    previewUrl.value = props.formData.thumbnail
  }

  // Nếu là tạo mới, set default status là DRAFT
  if (!props.isEditing) {
    formData.status = 'DRAFT'
  }

  // Debug - kiểm tra giá trị canReopen
  console.log("📦 CreateEditModal mounted - canReopen:", {
    propsFromParent: props.formData.canReopen,
    localFormData: formData.canReopen
  })

  setTimeout(() => {
    console.log("📦 FormData sau khi load modal", formData)
  }, 1000)
})

const getImgUrl = (img ='')=> {
  if(img.startsWith('blob:')) return img;
  if(img.startsWith('data')) return img;
  return baseImgaeUrl+img;
}
</script>


<style scoped>
/* Thêm style cho readonly input */
.readonly-input {
  background-color: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
}

.readonly-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  cursor: not-allowed;
}

.date-hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-hint i {
  font-size: 14px;
}

.modal-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: inherit;
}

.modal-loading-content {
  text-align: center;
}

.modal-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  padding: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px 24px 0 0;
  position: relative;
  overflow: hidden;
}

.modal-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.modal-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-subtitle {
  color: rgba(255, 255, 255, 0.9);
  margin: 4px 0 0;
  font-size: 14px;
}

.btn-close {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Modal Body */
.modal-body {
  padding: 32px;
  background: #f8fafc;
}

.section-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: transform 0.3s ease;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  position: relative;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title i {
  font-size: 20px;
  color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-title h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.section-decor {
  position: absolute;
  bottom: -12px;
  left: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
}

.section-actions {
  display: flex;
  gap: 12px;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.required {
  color: #ef4444;
  font-weight: bold;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
  font-size: 16px;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

.input-helper {
  position: absolute;
  right: 16px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  pointer-events: none;
}

/* Slug hint */
.slug-hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.slug-hint.warning {
  color: #f59e0b;
}

.slug-hint i {
  font-size: 14px;
}

.slug-actions {
  position: absolute;
  right: 16px;
}

.btn-slug-generate {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid #cbd5e1;
  background: white;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-slug-generate:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
  transform: scale(1.1);
}

/* Date difference */
.date-difference {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-difference i {
  font-size: 14px;
}

/* Status Select */
.status-select {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.status-option {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.status-option:hover {
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.status-option.active {
  border-color: transparent;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.status-option.active .status-dot {
  background: white !important;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* Textarea */
.textarea-wrapper {
  position: relative;
}

.form-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  background: #f8fafc;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.textarea-counter {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 12px;
  color: #94a3b8;
}

/* Image Upload */
.image-upload {
  margin-top: 4px;
}

.file-input {
  display: none;
}

.upload-area {
  border: 3px dashed #cbd5e1;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.upload-area:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-2px);
}

.upload-icon {
  font-size: 48px;
  color: #94a3b8;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.upload-area:hover .upload-icon {
  color: #667eea;
  transform: scale(1.1);
}

.upload-text {
  margin-bottom: 24px;
}

.upload-title {
  font-size: 18px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
}

.upload-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

.btn-upload {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-upload:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

/* Image Preview */
.image-preview {
  animation: fadeIn 0.5s ease;
}

.preview-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid #e2e8f0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-container:hover .preview-overlay {
  opacity: 1;
}

.btn-preview-action {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.btn-preview-action:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.btn-preview-action.danger:hover {
  background: rgba(239, 68, 68, 0.8);
}

.preview-info {
  text-align: center;
}

.file-name {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
}

.file-size {
  font-size: 12px;
  color: #94a3b8;
}

/* Packages */
.empty-packages {
  text-align: center;
  padding: 60px 32px;
  background: #f8fafc;
  border-radius: 16px;
  border: 3px dashed #cbd5e1;
}

.empty-icon {
  font-size: 48px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 24px;
}

.btn-empty-action {
  padding: 12px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-empty-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.packages-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.package-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.package-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}

.package-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
}

.package-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.package-number {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.package-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #e2e8f0;
  color: #64748b;
}

.package-badge.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-remove-package {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 2px solid #fecaca;
  background: #fff5f5;
  color: #ef4444;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove-package:hover {
  background: #fed7d7;
  transform: rotate(90deg);
}

.package-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.package-switch {
  margin-top: 8px;
}

.switch-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.switch-input {
  display: none;
}

.switch-slider {
  position: relative;
  width: 52px;
  height: 28px;
  background: #cbd5e1;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.switch-slider::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.switch-input:checked + .switch-slider {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.switch-input:checked + .switch-slider::after {
  left: 28px;
}

.switch-text {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

/* Add Package Button */
.btn-add-package {
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-add-package:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

/* Modal Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 2px solid #e2e8f0;
}

.btn {
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  min-width: 140px;
  justify-content: center;
}

.btn-secondary {
  background: #e2e8f0;
  color: #475569;
}

.btn-secondary:hover:not(:disabled) {
  background: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(148, 163, 184, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-content {
    max-height: 95vh;
    margin: 10px;
  }

  .modal-header {
    padding: 24px 24px 0;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .header-left {
    flex-direction: column;
    text-align: center;
  }

  .form-grid,
  .form-row {
    grid-template-columns: 1fr;
  }

  .status-select {
    grid-template-columns: repeat(2, 1fr);
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-body {
    padding: 20px;
  }

  .section-card {
    padding: 20px;
  }

  .status-select {
    grid-template-columns: 1fr;
  }
}

/* Custom Scrollbar for Modal Content */
.modal-content {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
  margin-top: 96px;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4090 100%);
}

.modal-content::-webkit-scrollbar-corner {
  background: transparent;
}

/* Đảm bảo chỉ phần body có scroll */
.modal-body {
  max-height: calc(90vh - 96px);
  overflow-y: auto;
  padding-right: 20px;
}

/* Responsive cho scrollbar */
@media (max-width: 768px) {
  .modal-content::-webkit-scrollbar-track {
    margin-top: 80px;
  }

  .modal-body {
    max-height: calc(95vh - 80px);
  }
}

/* Style cho input tiền tệ */
.form-input[type="text"]:not([placeholder*="@"]) {
  letter-spacing: 0.5px;
  font-weight: 600;
  color: #1e293b;
}

/* Animation khi nhập số */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.form-input:focus {
  animation: pulse 0.3s ease;
}

/* Placeholder cho input số */
.form-input::placeholder {
  color: #94a3b8;
  font-weight: normal;
}

/* Style cho thông tin đợt mở lại */
.reopened-branch-info {
  background: linear-gradient(135deg, #fef3c7 0%, #fffce5 100%);
  border-radius: 16px;
  padding: 8px 12px;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #fbbf24;
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reopened-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(251, 191, 36, 0.2);
  border-radius: 20px;
  color: #92400e;
  font-weight: 600;
  font-size: 14px;
}

.reopened-badge i {
  font-size: 16px;
  color: #d97706;
}

.btn-view-original {
  padding: 10px 20px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-view-original:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
}

/* Style cho danh sách chi nhánh con */
.children-branches-section {
  margin: 20px 0;
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.child-branch-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.child-branch-item:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.child-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.child-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.child-details h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.child-id {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.btn-view-child {
  padding: 8px 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-view-child:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

/* Responsive styles */
@media (max-width: 768px) {
  .reopened-branch-info,
  .children-branches-section {
    margin: 0 20px 20px;
  }

  .reopened-branch-info {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .child-branch-item {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .child-info {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .reopened-branch-info,
  .children-branches-section {
    margin: 0 16px 16px;
  }
}

/* Style cho phần mở lại */
.reopen-section {
  margin: 20px 0;
}

.reopen-card {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #3b82f6;
  transition: all 0.3s ease;
}

.reopen-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.reopen-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.reopen-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.reopen-info h4 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.reopen-description {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  max-width: 400px;
}

.btn-reopen {
  padding: 14px 28px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
}

.btn-reopen:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}





/* Responsive cho phần mở lại */
@media (max-width: 768px) {
  .reopen-card {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .reopen-header {
    flex-direction: column;
    text-align: center;
  }

  .btn-reopen {
    width: 100%;
    justify-content: center;
  }
}
</style>