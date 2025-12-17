<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Hỗ trợ đàm phán</h2>
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
          :class="{ active: activeTab === 'layout' }"
          @click="activeTab = 'layout'"
      >
        <i class="fas fa-columns"></i> Layout & Hình ảnh
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'title' }"
          @click="activeTab = 'title'"
      >
        <i class="fas fa-heading"></i> Tiêu đề & Icon
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'decor' }"
          @click="activeTab = 'decor'"
      >
        <i class="fas fa-palette"></i> Trang trí & Border
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'images' }"
          @click="activeTab = 'images'"
      >
        <i class="fas fa-images"></i> Gallery ảnh
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Layout & Hình ảnh -->
      <div v-if="activeTab === 'layout'" class="layout-settings">
        <div class="settings-grid">
          <!-- Layout Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Cấu trúc Section</h3>

            <div class="form-group">
              <label for="section-padding">Padding section</label>
              <input
                  type="text"
                  id="section-padding"
                  v-model="content.section9.styles.sectionPadding"
                  placeholder="50px 50px 0"
              />
            </div>

            <div class="form-group">
              <label for="section-margin-top">Margin top section</label>
              <div class="input-with-unit">
                <input type="text" id="section-margin-top" v-model="content.section9.styles.sectionMarginTop" placeholder="250px" />
                <span class="unit">px</span>
              </div>
            </div>

            <!-- Background Images -->
            <h3><i class="fas fa-layer-group"></i> Hình nền</h3>

            <div class="form-group">
              <label for="bg-left">Hình nền trái</label>
              <div class="file-upload compact">
                <div class="file-upload-area" @click="triggerBgLeftInput" @dragover.prevent @drop.prevent="handleBgLeftDrop">
                  <input
                      type="file"
                      ref="bgLeftInput"
                      @change="handleBgLeftUpload"
                      accept="image/*"
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh nền trái</p>
                </div>

                <div v-if="bgLeftPreview || content.section9.backgroundImages.left" class="upload-preview">
                  <img :src="getImageUrl(content.section9.backgroundImages.left)" alt="Bg Left Preview" />
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewBgLeft" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeBgLeft" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group" v-if="!bgLeftPreview && !content.section9.backgroundImages.left">
                <label for="bg-left-url">URL hình nền trái</label>
                <input
                    type="text"
                    id="bg-left-url"
                    v-model="content.section9.backgroundImages.left"
                    placeholder="/imgs/bg-s4.png"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="bg-right">Hình nền phải</label>
              <div class="file-upload compact">
                <div class="file-upload-area" @click="triggerBgRightInput" @dragover.prevent @drop.prevent="handleBgRightDrop">
                  <input
                      type="file"
                      ref="bgRightInput"
                      @change="handleBgRightUpload"
                      accept="image/*"
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh nền phải</p>
                </div>

                <div v-if="bgRightPreview || content.section9.backgroundImages.right" class="upload-preview">
                  <img :src="getImageUrl(content.section9.backgroundImages.right)" alt="Bg Right Preview" />
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewBgRight" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeBgRight" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group" v-if="!bgRightPreview && !content.section9.backgroundImages.right">
                <label for="bg-right-url">URL hình nền phải</label>
                <input
                    type="text"
                    id="bg-right-url"
                    v-model="content.section9.backgroundImages.right"
                    placeholder="/imgs/bg-s3.png"
                />
              </div>
            </div>
          </div>

          <!-- Nội dung chính -->
          <div class="setting-section">
            <h3><i class="fas fa-align-left"></i> Nội dung chính</h3>

            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label for="card-content">Nội dung</label>
                <AdvancedEditModal
                    v-model="content.section9.content.text"
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
                <div class="tiptap" v-html="content.section9.content.text"></div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="content-max-width">Chiều rộng tối đa</label>
                <div class="input-with-unit">
                  <input type="text" id="content-max-width" v-model="content.section9.content.styles.maxWidth" placeholder="500px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="content-font-size">Kích thước chữ</label>
                <div class="input-with-unit">
                  <input type="text" id="content-font-size" v-model="content.section9.content.styles.fontSize" placeholder="17px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="content-line-height">Chiều cao dòng</label>
                <input
                    type="text"
                    id="content-line-height"
                    v-model="content.section9.content.styles.lineHeight"
                    placeholder="1.6"
                />
              </div>
              <div class="form-group">
                <label for="content-color">Màu chữ</label>
                <div class="color-input">
                  <input type="color" v-model="content.section9.content.styles.color" />
                  <input type="text" v-model="content.section9.content.styles.color" placeholder="#333" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="content-bg-color">Màu nền nội dung</label>
              <div class="color-input">
                <input type="color" v-model="content.section9.content.styles.backgroundColor" />
                <input type="text" v-model="content.section9.content.styles.backgroundColor" placeholder="white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Tiêu đề & Icon -->
      <div v-if="activeTab === 'title'" class="title-content-settings">
        <div class="settings-grid">
          <!-- Icon & Tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-icons"></i> Icon & Tiêu đề</h3>

            <div class="form-group">
              <label for="order-number">Số thứ tự</label>
              <input
                  type="number"
                  id="order-number"
                  v-model.number="content.section9.orderNumber"
                  min="1"
                  max="10"
              />
            </div>

            <div class="form-group">
              <label for="title-text">Tiêu đề</label>
              <input
                  type="text"
                  id="title-text"
                  v-model="content.section9.title"
                  placeholder="Hỗ trợ đàm phán để bán được giá cao nhất"
              />
            </div>

            <div class="file-upload compact">
              <label><i class="fas fa-upload"></i> Tải lên icon</label>
              <div class="file-upload-area" @click="triggerIconInput" @dragover.prevent @drop.prevent="handleIconDrop">
                <input
                    type="file"
                    ref="iconInput"
                    @change="handleIconUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả icon vào đây</p>
              </div>

              <div v-if="iconPreview || content.section9.icon.url" class="upload-preview">
                <img :src="getImageUrl(content.section9.icon.url)" alt="Icon Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewIcon" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeIcon" title="Xóa icon">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!iconPreview && !content.section9.icon.url">
              <label for="icon-url">URL icon</label>
              <input
                  type="text"
                  id="icon-url"
                  v-model="content.section9.icon.url"
                  placeholder="/imgs/icon-ho-tro.png"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="icon-width">Chiều rộng icon</label>
                <div class="input-with-unit">
                  <input type="number" id="icon-width" v-model.number="content.section9.icon.width" min="50" max="200" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="icon-height">Chiều cao icon</label>
                <div class="input-with-unit">
                  <input type="number" id="icon-height" v-model.number="content.section9.icon.height" min="50" max="200" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="circle-size">Kích thước vòng tròn nền</label>
              <div class="input-with-unit">
                <input type="number" id="circle-size" v-model.number="content.section9.circleSize" min="50" max="200" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Trang trí & Border -->
      <div v-if="activeTab === 'decor'" class="decor-settings">
        <div class="settings-grid">
          <!-- Border -->
          <div class="setting-section">
            <h3><i class="fas fa-border-style"></i> Border (Đường viền)</h3>

            <div class="color-input-group">
              <label>Màu border</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.section9.styles.borderColor" />
                <input type="text" v-model="content.section9.styles.borderColor" placeholder="#c2cbf0" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="border-width">Độ dày border</label>
                <div class="input-with-unit">
                  <input type="text" id="border-width" v-model="content.section9.styles.borderWidth" placeholder="5px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="border-style">Kiểu border</label>
                <select id="border-style" v-model="content.section9.styles.borderStyle">
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                  <option value="groove">Groove</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Responsive Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-mobile-alt"></i> Responsive Settings</h3>

            <div class="form-group">
              <label>Breakpoints (px)</label>
              <div class="position-controls">
                <div class="position-row">
                  <div class="position-input">
                    <label>XL</label>
                    <input type="number" v-model.number="content.section9.responsive.breakpoints.xl" min="0" />
                  </div>
                  <div class="position-input">
                    <label>LG</label>
                    <input type="number" v-model.number="content.section9.responsive.breakpoints.lg" min="0" />
                  </div>
                </div>
                <div class="position-row">
                  <div class="position-input">
                    <label>MD</label>
                    <input type="number" v-model.number="content.section9.responsive.breakpoints.md" min="0" />
                  </div>
                  <div class="position-input">
                    <label>SM</label>
                    <input type="number" v-model.number="content.section9.responsive.breakpoints.sm" min="0" />
                  </div>
                </div>
                <div class="position-row">
                  <div class="position-input full-width">
                    <label>XS</label>
                    <input type="number" v-model.number="content.section9.responsive.breakpoints.xs" min="0" />
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="image2-transform">Transform image 2 (tablet)</label>
              <input
                  type="text"
                  id="image2-transform"
                  v-model="content.section9.responsive.tabletTransforms.image2"
                  placeholder="translate(30px, -30px)"
              />
            </div>

            <div class="form-group">
              <label for="image3-transform">Transform image 3 (tablet)</label>
              <input
                  type="text"
                  id="image3-transform"
                  v-model="content.section9.responsive.tabletTransforms.image3"
                  placeholder="translate(60px, -60px)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Gallery ảnh -->
      <div v-if="activeTab === 'images'" class="images-settings">
        <div class="settings-grid">
          <!-- Quản lý gallery ảnh -->
          <div class="setting-section">
            <h3><i class="fas fa-images"></i> Quản lý Gallery ảnh</h3>
            <p class="section-description">Quản lý các ảnh hiển thị trong section này. Có thể thêm, xóa hoặc chỉnh sửa từng ảnh.</p>

            <!-- Danh sách ảnh -->
            <div class="images-list">
              <div v-for="(image, index) in content.section9.images" :key="image.id" class="image-item">
                <div class="image-item-header">
                  <h4>Ảnh {{ index + 1 }} ({{ image.class || 'Chưa có class' }})</h4>
                  <button class="btn-icon btn-delete" @click="removeImage(index)" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>

                <div class="image-item-content">
                  <!-- Upload ảnh -->
                  <div class="file-upload compact">
                    <div class="file-upload-area" @click="() => triggerImageInput(index)" @dragover.prevent @drop.prevent="(event) => handleImageDrop(event, index)">
                      <input
                          type="file"
                          :ref="(el) => setImageInputRef(el, index)"
                          @change="(event) => handleImageUpload(event, index)"
                          accept="image/*"
                          style="display: none"
                      />
                      <i class="fas fa-cloud-upload-alt"></i>
                      <p>Kéo thả ảnh {{ index + 1 }}</p>
                    </div>

                    <div v-if="imagePreviews[index] || image.src" class="upload-preview">
                      <img :src="getImageUrl(image.src)" :alt="image.alt" />
                      <div class="preview-actions">
                        <button class="btn-preview-action" @click="previewGalleryImage(index)" title="Xem trước">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-preview-action" @click="removeGalleryImage(index)" title="Xóa ảnh">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- URL ảnh (nếu không upload) -->
                  <div class="form-group" v-if="!imagePreviews[index] && !image.src">
                    <label :for="`image-url-${index}`">URL ảnh</label>
                    <input
                        type="text"
                        :id="`image-url-${index}`"
                        v-model="image.src"
                        :placeholder="`/imgs/anh-ho-tro-${index + 1}.png`"
                    />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label :for="`image-alt-${index}`">Alt text</label>
                      <input
                          type="text"
                          :id="`image-alt-${index}`"
                          v-model="image.alt"
                          :placeholder="`Hỗ trợ đàm phán ${index + 1}`"
                      />
                    </div>
                    <div class="form-group">
                      <label :for="`image-class-${index}`">CSS Class</label>
                      <input
                          type="text"
                          :id="`image-class-${index}`"
                          v-model="image.class"
                          :placeholder="index === 0 ? 'top-img fade-left' : index === 3 ? 'right-img fade-up' : 'mid-img fade-left'"
                      />
                    </div>
                  </div>

                  <div class="form-group" v-if="index === 1 || index === 2">
                    <label :for="`image-transform-${index}`">Transform (desktop)</label>
                    <input
                        type="text"
                        :id="`image-transform-${index}`"
                        v-model="image.transform"
                        :placeholder="index === 1 ? 'translate(100px, -100px)' : 'translate(200px, -200px)'"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Nút thêm ảnh -->
            <div class="add-image-section">
              <button class="btn btn-secondary" @click="addNewImage">
                <i class="fas fa-plus"></i> Thêm ảnh mới
              </button>
              <p class="hint-text">Tối đa 8 ảnh cho mỗi section</p>
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
import { ref, reactive, onMounted } from 'vue'
import api from '../../../../api/api.js'
import { baseImgaeUrl } from "../../../../assets/js/global.js";
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('layout')
const isLoading = ref(false)

// Content structure based on new JSON data
const content = reactive({
  section9: {
    id: 'section9',
    orderNumber: 9,
    title: 'Hỗ trợ đàm phán để bán được giá cao nhất',
    icon: {
      url: '/imgs/icon-ho-tro.png',
      width: 109,
      height: 109
    },
    circleSize: 100,
    backgroundImages: {
      left: '/imgs/bg-s4.png',
      right: '/imgs/bg-s3.png'
    },
    images: [
      {
        id: 'image1',
        src: '/imgs/anh-ho-tro-1.png',
        alt: 'Hỗ trợ đàm phán 1',
        class: 'top-img fade-left'
      },
      {
        id: 'image2',
        src: '/imgs/anh-ho-tro-2.png',
        alt: 'Hỗ trợ đàm phán 2',
        class: 'mid-img fade-left',
        transform: 'translate(100px, -100px)'
      },
      {
        id: 'image3',
        src: '/imgs/anh-ho-tro-3.png',
        alt: 'Hỗ trợ đàm phán 3',
        class: 'bot-img fade-left',
        transform: 'translate(200px, -200px)'
      },
      {
        id: 'image4',
        src: '/imgs/anh-ho-tro-4.png',
        alt: 'Hỗ trợ đàm phán 4',
        class: 'right-img fade-up'
      }
    ],
    content: {
      text: 'Các chuyên viên giàu kinh nghiệm đại diện chủ nhà tham gia đàm phán, giúp thương lượng giá tối ưu nhất dựa trên dữ liệu thị trường, đảm bảo giao dịch nhanh mà vẫn có lợi nhất cho khách hàng.',
      styles: {
        backgroundColor: 'white',
        maxWidth: '500px',
        fontSize: '17px',
        lineHeight: '1.6',
        color: '#333'
      }
    },
    styles: {
      borderColor: '#C2CBF0',
      borderWidth: '5px',
      borderStyle: 'dashed',
      sectionPadding: '50px 50px 0',
      sectionMarginTop: '250px'
    },
    responsive: {
      breakpoints: {
        xl: 1400,
        lg: 1308,
        md: 992,
        sm: 768,
        xs: 576
      },
      tabletTransforms: {
        image2: 'translate(30px, -30px)',
        image3: 'translate(60px, -60px)'
      }
    }
  }
})

// UI State
const iconPreview = ref(null)
const bgLeftPreview = ref(null)
const bgRightPreview = ref(null)
const imagePreviews = ref([])
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const iconInput = ref(null)
const bgLeftInput = ref(null)
const bgRightInput = ref(null)
const imageInputs = ref({})

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
const SECTION_ID = 23

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
    if (previewRef) {
      previewRef.value = null
    }

    // Update content - handle nested paths
    const pathParts = contentPath.split('.')
    let target = content
    for (let i = 0; i < pathParts.length - 1; i++) {
      target = target[pathParts[i]]
    }
    target[pathParts[pathParts.length - 1]] = tempUrl

    if (previewRef) {
      previewRef.value = previewUrl
    }

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
      if (data.section9) {
        Object.assign(content.section9, data.section9)
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
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare content data
    const contentData = {
      section9: { ...content.section9 }
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: content.section9.title,
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: content.section9.orderNumber,
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
      iconPreview.value = null
      bgLeftPreview.value = null
      bgRightPreview.value = null
      imagePreviews.value = []

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

  // Check icon
  if (content.section9.icon.url === tempUrl) {
    content.section9.icon.url = realUrl
  }

  // Check background images
  if (content.section9.backgroundImages.left === tempUrl) {
    content.section9.backgroundImages.left = realUrl
  }
  if (content.section9.backgroundImages.right === tempUrl) {
    content.section9.backgroundImages.right = realUrl
  }

  // Check gallery images
  content.section9.images.forEach((image, index) => {
    if (image.src === tempUrl) {
      image.src = realUrl
    }
  })
}

// ========== IMAGE UPLOAD HANDLERS ==========
// Icon
const triggerIconInput = () => {
  iconInput.value?.click()
}

const handleIconUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Icon', iconPreview, 'section9.icon.url')
  }
  event.target.value = ''
}

const handleIconDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Icon', iconPreview, 'section9.icon.url')
  }
}

const removeIcon = () => {
  if (content.section9.icon.url) {
    handleRemoveFile(content.section9.icon.url, 'section9.icon.url', iconPreview)
  }
}

// Background Left
const triggerBgLeftInput = () => {
  bgLeftInput.value?.click()
}

const handleBgLeftUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Background Left', bgLeftPreview, 'section9.backgroundImages.left')
  }
  event.target.value = ''
}

const handleBgLeftDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Background Left', bgLeftPreview, 'section9.backgroundImages.left')
  }
}

const removeBgLeft = () => {
  if (content.section9.backgroundImages.left) {
    handleRemoveFile(content.section9.backgroundImages.left, 'section9.backgroundImages.left', bgLeftPreview)
  }
}

// Background Right
const triggerBgRightInput = () => {
  bgRightInput.value?.click()
}

const handleBgRightUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Background Right', bgRightPreview, 'section9.backgroundImages.right')
  }
  event.target.value = ''
}

const handleBgRightDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Background Right', bgRightPreview, 'section9.backgroundImages.right')
  }
}

const removeBgRight = () => {
  if (content.section9.backgroundImages.right) {
    handleRemoveFile(content.section9.backgroundImages.right, 'section9.backgroundImages.right', bgRightPreview)
  }
}

// Gallery Images
const setImageInputRef = (el, index) => {
  if (el) {
    imageInputs.value[index] = el
  }
}

const triggerImageInput = (index) => {
  if (imageInputs.value[index]) {
    imageInputs.value[index].click()
  }
}

const handleImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    handleGalleryFileUpload(file, index, `Gallery Image ${index + 1}`)
  }
  event.target.value = ''
}

const handleImageDrop = (event, index) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleGalleryFileUpload(file, index, `Gallery Image ${index + 1}`)
  }
}

const handleGalleryFileUpload = (file, index, type) => {
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

    // Update image preview
    imagePreviews.value[index] = previewUrl

    // Update content
    content.section9.images[index].src = tempUrl

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

const removeGalleryImage = (index) => {
  const image = content.section9.images[index]
  if (image && image.src) {
    handleRemoveFile(image.src, `section9.images[${index}].src`, null, index)
  }
}

const handleRemoveFile = (imageUrl, contentPath, previewRef, galleryIndex = null) => {
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
    if (galleryIndex !== null) {
      content.section9.images[galleryIndex].src = ''
      if (imagePreviews.value[galleryIndex]) {
        imagePreviews.value[galleryIndex] = null
      }
    } else {
      const pathParts = contentPath.split('.')
      let target = content
      for (let i = 0; i < pathParts.length - 1; i++) {
        target = target[pathParts[i]]
      }
      target[pathParts[pathParts.length - 1]] = ''

      if (previewRef) {
        previewRef.value = null
      }
    }

    showToast('Đã xóa ảnh', 'success')
  }
}

// Gallery management
const addNewImage = () => {
  if (content.section9.images.length >= 8) {
    showToast('Đã đạt tối đa 8 ảnh cho section này', 'warning')
    return
  }

  const newIndex = content.section9.images.length
  const newImage = {
    id: `image${newIndex + 1}`,
    src: '',
    alt: `Hỗ trợ đàm phán ${newIndex + 1}`,
    class: newIndex === 0 ? 'top-img fade-left' : 'mid-img fade-left'
  }

  content.section9.images.push(newImage)
  imagePreviews.value.push(null)
  showToast('Đã thêm ảnh mới vào gallery', 'success')
}

const removeImage = (index) => {
  if (content.section9.images.length <= 1) {
    showToast('Phải có ít nhất 1 ảnh trong gallery', 'warning')
    return
  }

  const image = content.section9.images[index]
  if (image && image.src) {
    handleRemoveFile(image.src, `section9.images[${index}].src`, null, index)
  }

  // Remove the image input ref
  delete imageInputs.value[index]

  // Re-index remaining refs
  const newImageInputs = {}
  Object.keys(imageInputs.value).forEach(key => {
    const numKey = parseInt(key)
    if (numKey > index) {
      newImageInputs[numKey - 1] = imageInputs.value[key]
    } else if (numKey < index) {
      newImageInputs[numKey] = imageInputs.value[key]
    }
  })
  imageInputs.value = newImageInputs

  content.section9.images.splice(index, 1)
  imagePreviews.value.splice(index, 1)
  showToast('Đã xóa ảnh khỏi gallery', 'success')
}

// ========== PREVIEW FUNCTIONS ==========
const previewIcon = () => {
  if (content.section9.icon.url) {
    previewImageUrl.value = getImageUrl(content.section9.icon.url)
    showPreviewModal.value = true
  } else {
    showToast('Không có icon để xem trước', 'warning')
  }
}

const previewBgLeft = () => {
  if (content.section9.backgroundImages.left) {
    previewImageUrl.value = getImageUrl(content.section9.backgroundImages.left)
    showPreviewModal.value = true
  } else {
    showToast('Không có hình nền trái để xem trước', 'warning')
  }
}

const previewBgRight = () => {
  if (content.section9.backgroundImages.right) {
    previewImageUrl.value = getImageUrl(content.section9.backgroundImages.right)
    showPreviewModal.value = true
  } else {
    showToast('Không có hình nền phải để xem trước', 'warning')
  }
}

const previewGalleryImage = (index) => {
  if (content.section9.images[index] && content.section9.images[index].src) {
    previewImageUrl.value = getImageUrl(content.section9.images[index].src)
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
  // Initialize image previews array
  imagePreviews.value = new Array(content.section9.images.length).fill(null)
  loadData()
})
</script>

<style scoped>
/* Thêm styles cho gallery */
.images-settings .section-description {
  color: #6c757d;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.images-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.image-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.image-item-header {
  background: #f8f9fa;
  padding: 12px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.image-item-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #495057;
}

.btn-delete {
  background-color: #f8f9fa;
  color: #dc3545;
}

.btn-delete:hover {
  background-color: #dc3545;
  color: white;
}

.image-item-content {
  padding: 20px;
}

.add-image-section {
  text-align: center;
  padding: 20px;
  border: 2px dashed #ced4da;
  border-radius: 8px;
  background-color: #f8f9ff;
}

.hint-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 8px;
}

/* Đảm bảo các input trong gallery có đủ khoảng cách */
.images-settings .form-group {
  margin-bottom: 15px;
}

.images-settings .form-row {
  margin-bottom: 15px;
}

/* Responsive cho gallery */
@media (max-width: 768px) {
  .image-item-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .image-item-header h4 {
    font-size: 0.95rem;
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

/* Position Controls */
.position-controls {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
}

.position-row {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.position-input {
  flex: 1;
}

.position-input.full-width {
  flex: 2;
}

.position-input label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.85rem;
  color: #6c757d;
}

.position-input input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
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

  .navigation-tabs {
    padding: 0 20px;
    flex-direction: column;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.9rem;
    justify-content: center;
  }

  .position-row {
    flex-direction: column;
    gap: 10px;
  }

  .position-input.full-width {
    flex: 1;
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
}
</style>