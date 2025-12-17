<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Nổi bật</h2>
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
          :class="{ active: activeTab === 'benefits' }"
          @click="activeTab = 'benefits'"
      >
        <i class="fas fa-list-ol"></i> Lợi ích
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
              <label for="title-line1">Dòng tiêu đề 1</label>
              <input
                  type="text"
                  id="title-line1"
                  v-model="content.titleLine1"
                  placeholder="Cùng Thiên Hà Group mở rộng mạng lưới –"
              />
            </div>

            <div class="form-group">
              <label for="title-line2">Dòng tiêu đề 2</label>
              <input
                  type="text"
                  id="title-line2"
                  v-model="content.titleLine2"
                  placeholder="Chung tay phát triển hệ thống chi nhánh BĐS trên toàn quốc"
              />
            </div>

            <div class="form-group">
              <label for="benefits-title">Tiêu đề lợi ích</label>
              <input
                  type="text"
                  id="benefits-title"
                  v-model="content.benefitsTitle"
                  placeholder="Vì sao nên góp vốn cùng Thiên Hà Group?"
              />
            </div>

            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label for="content-html">Nội dung HTML</label>
                <AdvancedEditModal
                    v-model="content.contentHTML"
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
                <div class="tiptap" v-html="content.contentHTML"></div>
              </div>
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
                <p class="file-hint">Kích thước đề xuất: 1920x1080px</p>
              </div>

              <div v-if="imagePreview || content.backgroundImage" class="upload-preview">
                <img :src="getImageUrl(content.backgroundImage)" alt="Preview"/>
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

            <div class="form-group" v-if="!imagePreview && !content.backgroundImage">
              <label for="image-url">Hoặc nhập URL ảnh</label>
              <input
                  type="text"
                  id="image-url"
                  v-model="content.backgroundImage"
                  placeholder="/imgs/bg-investment.jpg"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Lợi ích -->
      <div v-if="activeTab === 'benefits'" class="benefits-settings">
        <div class="benefits-header">
          <h3><i class="fas fa-list-ol"></i> Quản lý lợi ích</h3>
          <button class="btn btn-primary" @click="addBenefit">
            <i class="fas fa-plus"></i> Thêm lợi ích mới
          </button>
        </div>

        <div class="benefits-list">
          <div
              v-for="(benefit, index) in content.benefits"
              :key="benefit.id || index"
              class="benefit-item"
              :class="{ 'editing': editingBenefit === benefit.id }"
          >
            <div class="benefit-header" @click="toggleBenefitEdit(benefit.id)">
              <div class="benefit-number">
                {{ index + 1 }}
              </div>
              <div class="benefit-title-preview">
                <i :class="'fas ' + benefit.icon"></i>
                <span>{{ benefit.heading }}</span>
              </div>
              <div class="benefit-actions">
                <button class="btn-icon" @click.stop="moveBenefitUp(index)" :disabled="index === 0" title="Di chuyển lên">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click.stop="moveBenefitDown(index)"
                        :disabled="index === content.benefits.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-delete" @click.stop="removeBenefit(index)" title="Xóa lợi ích">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn-icon" @click.stop="toggleBenefitEdit(benefit.id)"
                        :title="editingBenefit === benefit.id ? 'Đóng chỉnh sửa' : 'Chỉnh sửa'">
                  <i :class="editingBenefit === benefit.id ? 'fas fa-chevron-up' : 'fas fa-edit'"></i>
                </button>
              </div>
            </div>

            <!-- Benefit Edit Form -->
            <div v-if="editingBenefit === benefit.id" class="benefit-edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="benefit-icon">Icon</label>
                  <IconPicker v-model="benefit.icon"/>
                </div>
              </div>

              <div class="form-group">
                <label for="benefit-heading">Tiêu đề lợi ích</label>
                <input
                    type="text"
                    :id="'benefit-heading-' + index"
                    v-model="benefit.heading"
                    placeholder="Mở rộng chi nhánh tiềm năng"
                />
              </div>

              <div class="form-group">
                <label for="benefit-description">Mô tả lợi ích</label>
                <textarea
                    :id="'benefit-description-' + index"
                    v-model="benefit.description"
                    placeholder="Mở rộng chi nhánh ở các khu vực tiềm năng..."
                    rows="3"
                ></textarea>
              </div>

              <div class="form-actions">
                <button class="btn btn-secondary" @click="toggleBenefitEdit(benefit.id)">
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
          <!-- Màu sắc chính -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu sắc chính</h3>

            <div class="color-input-group">
              <label>Màu chính (Primary Color)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.primaryColor"/>
                <input type="text" v-model="content.styles.primaryColor" placeholder="#fbbf24"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ (Text Color)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.textColor"/>
                <input type="text" v-model="content.styles.textColor" placeholder="white"/>
              </div>
            </div>
          </div>

          <!-- Độ trong suốt -->
          <div class="setting-section">
            <h3><i class="fas fa-layer-group"></i> Độ trong suốt</h3>

            <div class="form-group">
              <label for="overlay-opacity">Độ mờ lớp phủ (0-1)</label>
              <div class="input-with-unit">
                <input type="number" id="overlay-opacity" v-model.number="content.styles.overlayOpacity" step="0.1" min="0" max="1"/>
                <span class="unit">(0-1)</span>
              </div>
            </div>

            <div class="form-group">
              <label for="content-bg-opacity">Độ mờ nền nội dung (0-1)</label>
              <div class="input-with-unit">
                <input type="number" id="content-bg-opacity" v-model.number="content.styles.contentBgOpacity" step="0.1" min="0" max="1"/>
                <span class="unit">(0-1)</span>
              </div>
            </div>

            <div class="form-group">
              <label for="content-border-opacity">Độ mờ viền nội dung (0-1)</label>
              <div class="input-with-unit">
                <input type="number" id="content-border-opacity" v-model.number="content.styles.contentBorderOpacity" step="0.1" min="0" max="1"/>
                <span class="unit">(0-1)</span>
              </div>
            </div>
          </div>

          <!-- Kích thước & Khoảng cách -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler"></i> Kích thước & Khoảng cách</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="section-padding">Padding Section</label>
                <input type="text" id="section-padding" v-model="content.styles.sectionPadding" placeholder="50px 0"/>
              </div>
              <div class="form-group">
                <label for="mobile-section-padding">Padding Section (Mobile)</label>
                <input type="text" id="mobile-section-padding" v-model="content.styles.mobileSectionPadding" placeholder="30px 0"/>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="content-padding">Padding Nội dung</label>
                <input type="text" id="content-padding" v-model="content.styles.contentPadding" placeholder="30px"/>
              </div>
              <div class="form-group">
                <label for="mobile-content-padding">Padding Nội dung (Mobile)</label>
                <input type="text" id="mobile-content-padding" v-model="content.styles.mobileContentPadding" placeholder="20px"/>
              </div>
            </div>
          </div>

          <!-- Kích thước font -->
          <div class="setting-section">
            <h3><i class="fas fa-text-height"></i> Kích thước Font</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="title-font-size">Font Size Tiêu đề</label>
                <input type="text" id="title-font-size" v-model="content.styles.titleFontSize" placeholder="2.2rem"/>
              </div>
              <div class="form-group">
                <label for="mobile-title-font-size">Font Size Tiêu đề (Mobile)</label>
                <input type="text" id="mobile-title-font-size" v-model="content.styles.mobileTitleFontSize" placeholder="1.6rem"/>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="small-mobile-title-font-size">Font Size Tiêu đề (Small Mobile)</label>
                <input type="text" id="small-mobile-title-font-size" v-model="content.styles.smallMobileTitleFontSize" placeholder="1.4rem"/>
              </div>
              <div class="form-group">
                <label for="text-font-size">Font Size Văn bản</label>
                <input type="text" id="text-font-size" v-model="content.styles.textFontSize" placeholder="1.1rem"/>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="mobile-text-font-size">Font Size Văn bản (Mobile)</label>
                <input type="text" id="mobile-text-font-size" v-model="content.styles.mobileTextFontSize" placeholder="1rem"/>
              </div>
              <div class="form-group">
                <label for="benefits-title-font-size">Font Size Tiêu đề Lợi ích</label>
                <input type="text" id="benefits-title-font-size" v-model="content.styles.benefitsTitleFontSize" placeholder="1.4rem"/>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="benefit-heading-font-size">Font Size Tiêu đề Lợi ích</label>
                <input type="text" id="benefit-heading-font-size" v-model="content.styles.benefitHeadingFontSize" placeholder="1.1rem"/>
              </div>
              <div class="form-group">
                <label for="benefit-description-font-size">Font Size Mô tả Lợi ích</label>
                <input type="text" id="benefit-description-font-size" v-model="content.styles.benefitDescriptionFontSize" placeholder="0.95rem"/>
              </div>
            </div>
          </div>

          <!-- Kích thước Icon & Ảnh -->
          <div class="setting-section">
            <h3><i class="fas fa-images"></i> Kích thước Icon & Ảnh</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="logo-height">Chiều cao Logo</label>
                <input type="text" id="logo-height" v-model="content.styles.logoHeight" placeholder="80px"/>
              </div>
              <div class="form-group">
                <label for="mobile-logo-height">Chiều cao Logo (Mobile)</label>
                <input type="text" id="mobile-logo-height" v-model="content.styles.mobileLogoHeight" placeholder="60px"/>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="benefit-card-max-height">Chiều cao tối đa Card Lợi ích</label>
                <input type="text" id="benefit-card-max-height" v-model="content.styles.benefitCardMaxHeight" placeholder="150px"/>
              </div>
              <div class="form-group">
                <label for="benefit-icon-size">Kích thước Icon Lợi ích</label>
                <input type="text" id="benefit-icon-size" v-model="content.styles.benefitIconSize" placeholder="1.8rem"/>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="mobile-benefit-icon-size">Kích thước Icon Lợi ích (Mobile)</label>
                <input type="text" id="mobile-benefit-icon-size" v-model="content.styles.mobileBenefitIconSize" placeholder="1.5rem"/>
              </div>
              <div class="form-group">
                <label for="blur-intensity">Độ mờ hiệu ứng</label>
                <input type="text" id="blur-intensity" v-model="content.styles.blurIntensity" placeholder="10px"/>
              </div>
            </div>

            <div class="form-group">
              <label for="hover-transform">Hiệu ứng hover</label>
              <input type="text" id="hover-transform" v-model="content.styles.hoverTransform" placeholder="translateY(-5px)"/>
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
const editingBenefit = ref(null)

// Content structure based on new JSON data
const content = reactive({
  titleLine1: 'Cùng Thiên Hà Group mở rộng mạng lưới –',
  titleLine2: 'Chung tay phát triển hệ thống chi nhánh BĐS trên toàn quốc',
  backgroundImage: '/imgs/bg-investment.jpg',
  contentHTML: '<p><b>Thiên Hà Group</b> hướng đến mục tiêu phát triển một hệ sinh thái kinh doanh bất động sản bền vững – nơi giá trị tài sản được mở rộng, vận hành minh bạch và tạo ra lợi nhuận ổn định cho nhà đầu tư. Chúng tôi đang mở cơ hội góp vốn mở chi nhánh mới, dành cho những cá nhân & đối tác muốn đồng hành phát triển cùng doanh nghiệp trong giai đoạn mở rộng quy mô.</p><p>Với mỗi chi nhánh triển khai, Thiên Hà Group sẽ công bố kế hoạch kinh doanh, dự toán dòng tiền, tỷ suất lợi nhuận dự kiến và báo cáo theo từng giai đoạn, đảm bảo nhà đầu tư dễ dàng nắm bắt hiệu quả hoạt động của từng dự án. Tỷ lệ lợi nhuận và phương án chia sẽ được quy định rõ trong từng dự án chi tiết – minh bạch, tách bạch, dễ theo dõi.</p><p>Chúng tôi cam kết luôn đặt hiệu quả đầu tư & sự an toàn của nguồn vốn lên hàng đầu. Mọi dự án đều được triển khai theo quy trình rõ ràng, có hợp đồng pháp lý ràng buộc, hệ thống báo cáo minh bạch, cùng chuyên môn vận hành từ đội ngũ giàu kinh nghiệm.</p>',
  benefitsTitle: 'Vì sao nên góp vốn cùng Thiên Hà Group?',
  benefits: [
    {
      id: 1,
      icon: 'fa-chart-line',
      heading: 'Mở rộng chi nhánh tiềm năng',
      description: 'Mở rộng chi nhánh ở các khu vực tiềm năng – dữ liệu cập nhật động theo từng đợt phát hành'
    },
    {
      id: 2,
      icon: 'fa-file-invoice-dollar',
      heading: 'Minh bạch tài chính',
      description: 'Minh bạch dòng tiền, báo cáo định kỳ rõ ràng'
    },
    {
      id: 3,
      icon: 'fa-hand-holding-usd',
      heading: 'Chính sách lợi nhuận rõ ràng',
      description: 'Mỗi dự án đều có chính sách lợi nhuận riêng, tỷ lệ chia cụ thể – công khai ngay trong trang chi tiết'
    },
    {
      id: 4,
      icon: 'fa-handshake',
      heading: 'Đồng hành dài hạn',
      description: 'Đồng hành dài hạn cùng doanh nghiệp bất động sản đang tăng trưởng mạnh'
    },
    {
      id: 5,
      icon: 'fa-sitemap',
      heading: 'Đa dạng hóa đầu tư',
      description: 'Cơ hội sở hữu phần lợi nhuận từ nhiều chi nhánh khác nhau nếu đầu tư đa dự án'
    }
  ],
  styles: {
    primaryColor: '#fbbf24',
    textColor: 'white',
    overlayOpacity: 0.6,
    contentBgOpacity: 0.1,
    contentBorderOpacity: 0.2,
    sectionPadding: '50px 0',
    mobileSectionPadding: '30px 0',
    contentPadding: '30px',
    mobileContentPadding: '20px',
    titleFontSize: '2.2rem',
    mobileTitleFontSize: '1.6rem',
    smallMobileTitleFontSize: '1.4rem',
    textFontSize: '1.1rem',
    mobileTextFontSize: '1rem',
    benefitsTitleFontSize: '1.4rem',
    benefitHeadingFontSize: '1.1rem',
    benefitDescriptionFontSize: '0.95rem',
    logoHeight: '80px',
    mobileLogoHeight: '60px',
    benefitCardMaxHeight: '150px',
    benefitIconSize: '1.8rem',
    mobileBenefitIconSize: '1.5rem',
    blurIntensity: '10px',
    hoverTransform: 'translateY(-5px)'
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
const SECTION_ID = 49

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

// ========== BENEFIT MANAGEMENT ==========
const addBenefit = () => {
  const newId = Date.now()

  content.benefits.push({
    id: newId,
    icon: 'fa-plus-circle',
    heading: 'Lợi ích mới',
    description: 'Mô tả lợi ích...'
  })

  editingBenefit.value = newId
  showToast('Đã thêm lợi ích mới', 'success')
}

const removeBenefit = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa lợi ích này?')) {
    const benefit = content.benefits[index]
    content.benefits.splice(index, 1)

    if (editingBenefit.value === benefit.id) {
      editingBenefit.value = null
    }

    showToast('Đã xóa lợi ích', 'success')
  }
}

const moveBenefitUp = (index) => {
  if (index > 0) {
    const temp = content.benefits[index]
    content.benefits[index] = content.benefits[index - 1]
    content.benefits[index - 1] = temp
  }
}

const moveBenefitDown = (index) => {
  if (index < content.benefits.length - 1) {
    const temp = content.benefits[index]
    content.benefits[index] = content.benefits[index + 1]
    content.benefits[index + 1] = temp
  }
}

const toggleBenefitEdit = (benefitId) => {
  editingBenefit.value = editingBenefit.value === benefitId ? null : benefitId
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

    // Prepare content data
    const contentData = {...content}

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Nổi bật',
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
  if (content.backgroundImage === tempUrl) {
    content.backgroundImage = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
const triggerImageInput = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh nền', imagePreview, 'backgroundImage')
  }
  event.target.value = ''
}

const handleImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh nền', imagePreview, 'backgroundImage')
  }
}

const removeImage = () => {
  if (content.backgroundImage) {
    handleRemoveFile(content.backgroundImage, 'backgroundImage', imagePreview)
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
  if (content.backgroundImage) {
    previewImageUrl.value = getImageUrl(content.backgroundImage)
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
/* Giữ nguyên tất cả CSS cũ, chỉ thêm các class mới cho benefits */

/* Benefits Management */
.benefits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.benefits-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.benefit-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.benefit-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.benefit-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.benefit-header:hover {
  background-color: #e9ecef;
}

.benefit-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.benefit-title-preview {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.benefit-title-preview i {
  color: #0629BE;
  width: 20px;
}

.benefit-actions {
  display: flex;
  gap: 8px;
}

.benefit-edit-form {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9ff;
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