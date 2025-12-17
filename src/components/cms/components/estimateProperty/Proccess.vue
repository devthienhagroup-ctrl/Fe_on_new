<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Quy trình Định giá</h2>
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
          :class="{ active: activeTab === 'steps' }"
          @click="activeTab = 'steps'"
      >
        <i class="fas fa-list-ol"></i> Các bước quy trình
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
            <h3><i class="fas fa-heading"></i> Tiêu đề & Mô tả</h3>

            <div class="form-group">
              <label for="main-title">Tiêu đề chính</label>
              <input
                  type="text"
                  id="main-title"
                  v-model="content.title"
                  placeholder="Quy trình"
              />
            </div>

            <div class="form-group">
              <label for="subtitle">Tiêu đề phụ</label>
              <input
                  type="text"
                  id="subtitle"
                  v-model="content.subtitle"
                  placeholder="7 BƯỚC ĐỊNH GIÁ SƠ BỘ BẤT ĐỘNG SẢN"
              />
            </div>
          </div>

          <!-- Hình ảnh nền -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Hình ảnh nền</h3>

            <div class="file-upload">
              <div class="file-upload-area" @click="triggerImageInput" @dragover.prevent
                   @drop.prevent="handleImageDrop">
                <input
                    type="file"
                    ref="imageInput"
                    @change="handleImageUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Kích thước đề xuất: 1200x600px</p>
              </div>

              <div v-if="imagePreview || content.image" class="upload-preview">
                <img :src="getImageUrl(content.image)" alt="Preview"/>
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewImage" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeImage" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!imagePreview && !content.image">
              <label for="image-url">Hoặc nhập URL ảnh</label>
              <input
                  type="text"
                  id="image-url"
                  v-model="content.image"
                  placeholder="/imgs/bg-quy-trinh-7.png"
              />
            </div>

            <div class="form-group">
              <label for="image-alt">Alt text cho ảnh</label>
              <input
                  type="text"
                  id="image-alt"
                  v-model="content.imageAlt"
                  placeholder="Quy trình định giá bất động sản"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="image-border-radius">Bo góc ảnh</label>
                <div class="input-with-unit">
                  <input type="text" id="image-border-radius" v-model="content.styles.imageBorderRadius"
                         placeholder="12px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Các bước quy trình -->
      <div v-if="activeTab === 'steps'" class="steps-settings">
        <div class="steps-header">
          <h3><i class="fas fa-list-ol"></i> Quản lý các bước quy trình</h3>
          <button class="btn btn-primary" @click="addStep">
            <i class="fas fa-plus"></i> Thêm bước mới
          </button>
        </div>

        <div class="steps-list">
          <div
              v-for="(step, index) in content.steps"
              :key="step.id || index"
              class="step-item"
              :class="{ 'editing': editingStep === step.id }"
          >
            <div class="step-header" @click="toggleStepEdit(step.id)">
              <div class="step-number">
                {{ step.order }}
              </div>
              <div class="step-title-preview">
                <i :class="step.icon"></i>
                <span>{{ step.title }}</span>
              </div>
              <div class="step-actions">
                <button class="btn-icon" @click.stop="moveStepUp(index)" :disabled="index === 0" title="Di chuyển lên">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click.stop="moveStepDown(index)"
                        :disabled="index === content.steps.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-delete" @click.stop="removeStep(index)" title="Xóa bước">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn-icon" @click.stop="toggleStepEdit(step.id)"
                        :title="editingStep === step.id ? 'Đóng chỉnh sửa' : 'Chỉnh sửa'">
                  <i :class="editingStep === step.id ? 'fas fa-chevron-up' : 'fas fa-edit'"></i>
                </button>
              </div>
            </div>

            <!-- Step Edit Form -->
            <div v-if="editingStep === step.id" class="step-edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="step-order">Thứ tự</label>
                  <input
                      type="number"
                      :id="'step-order-' + index"
                      v-model.number="step.order"
                      min="1"
                      max="20"
                  />
                </div>
                <div class="form-group">
                  <label for="step-icon">Icon</label>
                  <IconPicker v-model="step.icon"/>
                  <small class="form-hint">VD: fas fa-user-plus, fas fa-building</small>
                </div>
              </div>

              <div class="form-group">
                <label for="step-title">Tiêu đề bước</label>
                <input
                    type="text"
                    :id="'step-title-' + index"
                    v-model="step.title"
                    placeholder="Khách hàng đăng ký tài khoản"
                />
              </div>

              <div class="form-group">
                <div class="label" style="display: flex; justify-content: space-between">
                  <label :for="'step-content-' + index">Nội dung bước</label>
                  <AdvancedEditModal
                      v-model="step.content"
                  ></AdvancedEditModal>
                </div>
                <div class="rich-text-editor-wrapper" style="
                margin-top: 10px;
                padding: 12px 16px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                background-color: white;
                ">
                  <div class="tiptap" v-html="step.content"></div>
                </div>
              </div>

              <div class="form-actions">
                <button class="btn btn-secondary" @click="toggleStepEdit(step.id)">
                  <i class="fas fa-times"></i> Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Giao diện & Màu sắc -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Màu sắc tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu sắc tiêu đề</h3>

            <div class="color-input-group">
              <label>Nền tiêu đề chính</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.mainTitle.color1" @change="updateMainTitleGradient()"/>
                <input type="color" v-model="gradientColors.mainTitle.color2" @change="updateMainTitleGradient()"/>
                <input
                    type="text"
                    v-model="content.styles.mainTitleBg"
                    placeholder="linear-gradient(90deg, #031358, #000a85)"
                    @input="updateMainTitleColorsFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ tiêu đề chính</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.mainTitleColor"/>
                <input type="text" v-model="content.styles.mainTitleColor" placeholder="#fff"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ tiêu đề phụ</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.subtitleColor"/>
                <input type="text" v-model="content.styles.subtitleColor" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu gạch chân</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.underline.color1" @change="updateUnderlineGradient()"/>
                <input type="color" v-model="gradientColors.underline.color2" @change="updateUnderlineGradient()"/>
                <input
                    type="text"
                    v-model="content.styles.underlineBg"
                    placeholder="linear-gradient(90deg, #031358, #000a85)"
                    @input="updateUnderlineColorsFromGradient()"
                />
              </div>
            </div>
          </div>

          <!-- Đường viền & Hiệu ứng -->
          <div class="setting-section">
            <h3><i class="fas fa-border-style"></i> Đường viền & Hiệu ứng</h3>

            <div class="color-input-group">
              <label>Màu đường đứt đoạn</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.dashedLineColor"/>
                <input type="text" v-model="content.styles.dashedLineColor" placeholder="#002FFF"/>
              </div>
            </div>

            <div class="form-group">
              <label for="image-shadow">Đổ bóng ảnh</label>
              <div class="color-input">
                <input type="color" v-model="shadowColor.hex" @input="updateShadowFromColor()"/>
                <input
                    type="text"
                    id="image-shadow"
                    v-model="content.styles.imageShadow"
                    placeholder="0 4px 20px rgba(0, 0, 0, 0.1)"
                    @input="updateColorFromShadow()"
                />
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
            <img :src="previewImageUrl" alt="Xem trước" v-if="previewImageUrl"/>
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
import {ref, reactive, onMounted} from 'vue'
import api from '../../../../api/api.js'
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";
import {baseImgaeUrl} from "../../../../assets/js/global.js";
import IconPicker from "../../../RichTextEditor/IconPicker.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)
const editingStep = ref(null)

// Gradient colors state
const gradientColors = reactive({
  mainTitle: {
    color1: '#031358',
    color2: '#000a85'
  },
  underline: {
    color1: '#031358',
    color2: '#000a85'
  }
})

// Shadow color state
const shadowColor = reactive({
  hex: '#000000',
  opacity: 0.1,
  rgba: 'rgba(0, 0, 0, 0.1)'
})

// Content structure based on new JSON data
const content = reactive({
  title: 'Quy trình',
  subtitle: '7 BƯỚC ĐỊNH GIÁ SƠ BỘ BẤT ĐỘNG SẢN',
  image: '/imgs/bg-quy-trinh-7.png',
  imageAlt: 'Quy trình định giá bất động sản',
  steps: [
    {
      id: 1,
      order: 1,
      icon: 'fas fa-user-plus',
      title: 'Khách hàng đăng ký tài khoản',
      content: 'Khách hàng bắt đầu bằng việc tạo tài khoản trên hệ thống. Việc này giúp quản lý thông tin, lịch sử định giá và hỗ trợ quá trình thanh toán nhanh và tiện lợi. Đây là bước đầu tiên để đảm bảo mọi giao dịch đều minh bạch, chuyên nghiệp.'
    },
    {
      id: 2,
      order: 2,
      icon: 'fas fa-building',
      title: 'Nhập thông tin bất động sản',
      content: 'Khách hàng cung cấp các thông tin cơ bản về bất động sản như địa chỉ, diện tích, loại hình (đất nền, căn hộ, nhà phố, biệt thự...), hình trong thực tế và hiện trạng. Các dữ liệu này giúp đội ngũ định giá có cơ sở để tiến hành phân tích và đánh giá chính xác.'
    },
    {
      id: 3,
      order: 3,
      icon: 'fas fa-scale-balanced',
      title: 'Định giá sơ bộ',
      content: 'Sau khi nhận được kết quả định giá, khách hàng và chuyên viên thống nhất mức giá đề xuất. Việc đồng thuận này giúp toàn bộ kế hoạch triển khai bán hàng sau đó được xây dựng trên cơ sở chính xác, phù hợp với thị trường.'
    },
    {
      id: 4,
      order: 4,
      icon: 'fas fa-credit-card',
      title: 'Thanh toán phí',
      content: 'Khách hàng tiến hành thanh toán chi phí định giá theo quy định. Quy trình thanh toán được bảo mật tuyệt đối và hỗ trợ nhiều hình thức khác nhau, đảm bảo thuận tiện – nhanh chóng – an toàn.'
    },
    {
      id: 5,
      order: 5,
      icon: 'fas fa-file-download',
      title: 'Nhận file trên tài khoản',
      content: 'Khách hàng tiến hành thanh toán chi phí định giá theo quy định. Quy trình thanh toán được bảo mật tuyệt đối và hỗ trợ nhiều hình thức khác nhau, đảm bảo thuận tiện – nhanh chóng – an toàn.'
    },
    {
      id: 6,
      order: 6,
      icon: 'fas fa-comment-dots',
      title: 'Nhận file qua Zalo',
      content: 'Để thuận tiện hơn, khách hàng sẽ được gửi thêm bản báo cáo định giá qua Zalo. Hình thức này giúp người dùng dễ dàng lưu trữ, tra cứu và theo dõi thông tin chuyển đến ở bất cứ đâu.'
    },
    {
      id: 7,
      order: 7,
      icon: 'fas fa-bolt',
      title: 'Đăng ký bán nhanh 30 ngày',
      content: 'Khi đã có giá trị định hướng rõ ràng, khách hàng có thể chọn gói dịch vụ "Đăng ký gói Định giá và Bán Nhanh Bất Động Sản Trong 30 Ngày". Đây là chương trình hỗ trợ toàn diện giúp khách hàng tiếp cận đúng đối tượng và chốt giao dịch nhanh chóng.'
    }
  ],
  styles: {
    mainTitleBg: 'linear-gradient(90deg, #031358, #000a85)',
    mainTitleColor: '#fff',
    subtitleColor: '#031358',
    underlineBg: 'linear-gradient(90deg, #031358, #000a85)',
    dashedLineColor: '#002FFF',
    imageBorderRadius: '12px',
    imageShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
  }
})

// UI State
const imagePreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const imageInput = ref(null)

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
const SECTION_ID = 29

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

    // Clear previous preview
    previewRef.value = null

    // Update content
    const pathParts = contentPath.split('.')
    let target = content
    for (let i = 0; i < pathParts.length - 1; i++) {
      target = target[pathParts[i]]
    }
    target[pathParts[pathParts.length - 1]] = tempUrl

    previewRef.value = previewUrl

    // Create file DTO
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

    // Store in uploadedFiles
    uploadedFiles.value.push({
      tempName: tempName,
      file: file,
      previewUrl: previewUrl
    })

    // Add to files array
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

// ========== GRADIENT FUNCTIONS ==========
const parseGradientColors = (gradientStr) => {
  if (!gradientStr) return {color1: '#031358', color2: '#000a85'};

  const matches = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (matches && matches.length >= 2) {
    return {color1: matches[0], color2: matches[1]};
  }
  return {color1: '#031358', color2: '#000a85'};
};

const updateMainTitleGradient = () => {
  content.styles.mainTitleBg = `linear-gradient(90deg, ${gradientColors.mainTitle.color1}, ${gradientColors.mainTitle.color2})`;
};

const updateMainTitleColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.mainTitleBg);
  gradientColors.mainTitle.color1 = colors.color1;
  gradientColors.mainTitle.color2 = colors.color2;
};

const updateUnderlineGradient = () => {
  content.styles.underlineBg = `linear-gradient(90deg, ${gradientColors.underline.color1}, ${gradientColors.underline.color2})`;
};

const updateUnderlineColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.underlineBg);
  gradientColors.underline.color1 = colors.color1;
  gradientColors.underline.color2 = colors.color2;
};

// ========== SHADOW FUNCTIONS ==========
const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex color
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};

const parseShadowColor = (shadowStr) => {
  if (!shadowStr) return {hex: '#000000', opacity: 0.1, rgba: 'rgba(0, 0, 0, 0.1)'};

  // Tìm màu rgba trong shadow string
  const rgbaMatch = shadowStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 0.1;

    // Convert RGB to hex
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    return {hex, opacity, rgba};
  }

  return {hex: '#000000', opacity: 0.1, rgba: 'rgba(0, 0, 0, 0.1)'};
};

const updateShadowFromColor = () => {
  // Extract shadow values from current shadow string
  const shadowRegex = /([\d.-]+px\s+){3,4}/;
  const match = content.styles.imageShadow.match(shadowRegex);

  if (match) {
    // Parse RGB from hex
    const rgb = hexToRgb(shadowColor.hex);
    // Create new rgba string
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowColor.opacity})`;
    // Keep the shadow values and update the color
    content.styles.imageShadow = `${match[0].trim()} ${newRgba}`;
    // Update rgba in shadowColor object
    shadowColor.rgba = newRgba;
  } else {
    // Default shadow values
    const rgb = hexToRgb(shadowColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowColor.opacity})`;
    content.styles.imageShadow = `0 4px 20px ${newRgba}`;
    shadowColor.rgba = newRgba;
  }
};

const updateColorFromShadow = () => {
  const parsed = parseShadowColor(content.styles.imageShadow);
  shadowColor.hex = parsed.hex;
  shadowColor.opacity = parsed.opacity;
  shadowColor.rgba = parsed.rgba;
};

// ========== STEP MANAGEMENT ==========
const addStep = () => {
  const newId = Date.now()
  const newOrder = content.steps.length > 0 ? Math.max(...content.steps.map(s => s.order)) + 1 : 1

  content.steps.push({
    id: newId,
    order: newOrder,
    icon: 'fas fa-plus-circle',
    title: 'Bước mới',
    content: 'Nhập nội dung cho bước này...'
  })

  editingStep.value = newId
  showToast('Đã thêm bước mới', 'success')
}

const removeStep = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa bước này?')) {
    const step = content.steps[index]

    // Remove any file references related to this step if needed
    content.steps.splice(index, 1)

    // Reorder remaining steps
    content.steps.forEach((step, idx) => {
      step.order = idx + 1
    })

    if (editingStep.value === step.id) {
      editingStep.value = null
    }

    showToast('Đã xóa bước', 'success')
  }
}

const moveStepUp = (index) => {
  if (index > 0) {
    const temp = content.steps[index]
    content.steps[index] = content.steps[index - 1]
    content.steps[index - 1] = temp

    // Update order numbers
    content.steps.forEach((step, idx) => {
      step.order = idx + 1
    })
  }
}

const moveStepDown = (index) => {
  if (index < content.steps.length - 1) {
    const temp = content.steps[index]
    content.steps[index] = content.steps[index + 1]
    content.steps[index + 1] = temp

    // Update order numbers
    content.steps.forEach((step, idx) => {
      step.order = idx + 1
    })
  }
}

const toggleStepEdit = (stepId) => {
  editingStep.value = editingStep.value === stepId ? null : stepId
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

      // Assuming data structure has processData
      const processData = data.processData || data

      // Update content with loaded data
      Object.assign(content, processData)

      // Initialize gradient colors
      const mainTitleColors = parseGradientColors(content.styles.mainTitleBg);
      gradientColors.mainTitle.color1 = mainTitleColors.color1;
      gradientColors.mainTitle.color2 = mainTitleColors.color2;

      const underlineColors = parseGradientColors(content.styles.underlineBg);
      gradientColors.underline.color1 = underlineColors.color1;
      gradientColors.underline.color2 = underlineColors.color2;

      // Initialize shadow color
      const shadowColors = parseShadowColor(content.styles.imageShadow);
      shadowColor.hex = shadowColors.hex;
      shadowColor.opacity = shadowColors.opacity;
      shadowColor.rgba = shadowColors.rgba;

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

    // Prepare content data with processData wrapper
    const contentData = {
      processData: {...content}
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Quy trình',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 1,
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
      imagePreview.value = null

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

  // Check all image properties in content
  if (content.image === tempUrl) {
    content.image = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
const triggerImageInput = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh nền', imagePreview, 'image')
  }
  event.target.value = ''
}

const handleImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh nền', imagePreview, 'image')
  }
}

const removeImage = () => {
  if (content.image) {
    handleRemoveFile(content.image, 'image', imagePreview)
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

    // Update content
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

// ========== PREVIEW FUNCTIONS ==========
const previewImage = () => {
  if (content.image) {
    previewImageUrl.value = getImageUrl(content.image)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
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