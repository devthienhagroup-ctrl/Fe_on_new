<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Khảo sát</h2>
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
        <i class="fas fa-heading"></i> Tiêu đề & Nội dung
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'decor' }"
          @click="activeTab = 'decor'"
      >
        <i class="fas fa-palette"></i> Trang trí & Border
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Layout & Hình ảnh -->
      <div v-if="activeTab === 'layout'" class="layout-settings">
        <div class="settings-grid">
          <!-- Layout Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Cấu trúc Layout</h3>

            <div class="form-group">
              <label for="gap">Khoảng cách giữa cột</label>
              <div class="input-with-unit">
                <input type="text" id="gap" v-model="content.layout.gap" placeholder="30px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="imageTranslateX">Dịch chuyển hình ảnh (X)</label>
              <div class="input-with-unit">
                <input type="text" id="imageTranslateX" v-model="content.layout.imageTranslateX" placeholder="70px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="rightSectionPadding">Padding khu vực phải</label>
              <input
                  type="text"
                  id="rightSectionPadding"
                  v-model="content.layout.rightSectionPadding"
                  placeholder="0 70px"
              />
            </div>

            <div class="form-group">
              <label for="textPaddingRight">Padding phải của văn bản</label>
              <div class="input-with-unit">
                <input type="text" id="textPaddingRight" v-model="content.layout.textPaddingRight" placeholder="60px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Hình ảnh chính -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Hình ảnh chính</h3>

            <div class="file-upload">
              <div class="file-upload-area" @click="triggerImageInput" @dragover.prevent @drop.prevent="handleImageDrop">
                <input
                    type="file"
                    ref="imageInput"
                    @change="handleImageUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Kích thước đề xuất: 600x400px</p>
              </div>

              <div v-if="imagePreview || content.image.src" class="upload-preview">
                <img :src="getImageUrl(content.image.src)" alt="Preview" />
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

            <div class="form-group" v-if="!imagePreview && !content.image.src">
              <label for="image-url">Hoặc nhập URL ảnh</label>
              <input
                  type="text"
                  id="image-url"
                  v-model="content.image.src"
                  placeholder="/imgs/anh-khao-sat-1.png"
              />
            </div>

            <div class="form-group">
              <label for="image-alt">Alt text cho ảnh</label>
              <input
                  type="text"
                  id="image-alt"
                  v-model="content.image.alt"
                  placeholder="Khảo sát bất động sản"
              />
            </div>

            <div class="form-group">
              <label for="image-border-radius">Bo góc ảnh</label>
              <div class="input-with-unit">
                <input type="text" id="image-border-radius" v-model="content.image.borderRadius" placeholder="10px" />
                <span class="unit">px</span>
              </div>
            </div>

            <!-- Responsive Settings -->
            <h4 style="margin-top: 25px; margin-bottom: 15px;"><i class="fas fa-mobile-alt"></i> Responsive</h4>

            <div class="form-row">
              <div class="form-group">
                <label for="tabletImageMaxHeight">Chiều cao tối đa (Tablet)</label>
                <div class="input-with-unit">
                  <input type="text" id="tabletImageMaxHeight" v-model="content.responsive.tabletImageMaxHeight" placeholder="400px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="mobileImageMaxHeight">Chiều cao tối đa (Mobile)</label>
                <div class="input-with-unit">
                  <input type="text" id="mobileImageMaxHeight" v-model="content.responsive.mobileImageMaxHeight" placeholder="300px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="smallMobileImageMaxHeight">Chiều cao tối đa (Mobile nhỏ)</label>
              <div class="input-with-unit">
                <input type="text" id="smallMobileImageMaxHeight" v-model="content.responsive.smallMobileImageMaxHeight" placeholder="250px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Tiêu đề & Nội dung -->
      <div v-if="activeTab === 'title'" class="title-content-settings">
        <div class="settings-grid">
          <!-- Icon & Tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-icons"></i> Icon & Tiêu đề</h3>

            <div class="file-upload compact">
              <label><i class="fas fa-upload"></i> Tải lên icon tiêu đề</label>
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

              <div v-if="iconPreview || content.iconUrl" class="upload-preview">
                <img :src="getImageUrl(content.iconUrl)" alt="Icon Preview" />
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

            <div class="form-group" v-if="!iconPreview && !content.iconUrl">
              <label for="icon-url">URL icon</label>
              <input
                  type="text"
                  id="icon-url"
                  v-model="content.iconUrl"
                  placeholder="/imgs/icon-khao-sat.png"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="icon-width">Chiều rộng icon</label>
                <div class="input-with-unit">
                  <input type="number" id="icon-width" v-model.number="content.iconWidth" min="50" max="200" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="icon-height">Chiều cao icon</label>
                <div class="input-with-unit">
                  <input type="number" id="icon-height" v-model.number="content.iconHeight" min="50" max="200" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="circle-size">Kích thước vòng tròn nền</label>
              <div class="input-with-unit">
                <input type="number" id="circle-size" v-model.number="content.circleSize" min="50" max="200" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="title-text">Tiêu đề</label>
              <input
                  type="text"
                  id="title-text"
                  v-model="content.title"
                  placeholder="Khảo sát"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="title-height">Chiều cao component</label>
                <div class="input-with-unit">
                  <input type="text" id="title-height" v-model="content.componentHeight" placeholder="80px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="title-width">Chiều rộng component</label>
                <div class="input-with-unit">
                  <input type="text" id="title-width" v-model="content.componentWidth" placeholder="100%" />
                  <span class="unit">%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Nội dung chính -->
          <div class="setting-section">
            <h3><i class="fas fa-align-left"></i> Nội dung chính</h3>

            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label for="card-content">Nội dung thẻ</label>
                <AdvancedEditModal
                    v-model="content.content.text"
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
                <div class="tiptap" v-html="content.content.text"></div>
              </div>
            </div>

            <div class="form-group">
              <label for="content-font-size">Kích thước chữ</label>
              <div class="input-with-unit">
                <input type="text" id="content-font-size" v-model="content.content.fontSize" placeholder="17px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="content-line-height">Độ cao dòng</label>
                <input
                    type="number"
                    id="content-line-height"
                    v-model.number="content.content.lineHeight"
                    step="0.1"
                    min="1"
                    max="3"
                    placeholder="1.6"
                />
              </div>
              <div class="color-input-group">
                <label>Màu chữ</label>
                <div class="color-input form-group">
                  <input type="color" v-model="content.content.color" />
                  <input type="text" v-model="content.content.color" placeholder="#000000" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="content-text-align">Căn chỉnh văn bản</label>
              <select id="content-text-align" v-model="content.content.textAlign">
                <option value="left">Trái</option>
                <option value="right">Phải</option>
                <option value="center">Giữa</option>
                <option value="justify">Căn đều</option>
              </select>
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
                <input type="color" v-model="content.border.color" />
                <input type="text" v-model="content.border.color" placeholder="#c2cbf0" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="border-width">Độ dày border</label>
                <div class="input-with-unit">
                  <input type="text" id="border-width" v-model="content.border.width" placeholder="5px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="border-style">Kiểu border</label>
                <select id="border-style" v-model="content.border.style">
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                  <option value="groove">Groove</option>
                </select>
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
import { ref, reactive, onMounted } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const activeTab = ref('layout')
const isLoading = ref(false)

// Content structure based on the new JSON data
const content = reactive({
  id: 3,
  title: 'Khảo sát',
  iconUrl: '/imgs/icon-khao-sat.png',
  iconWidth: 109,
  iconHeight: 109,
  circleSize: 100,
  componentHeight: '80px',
  componentWidth: '100%',
  image: {
    src: '/imgs/anh-khao-sat-1.png',
    alt: 'Khảo sát bất động sản',
    borderRadius: '10px'
  },
  content: {
    text: 'Chuyên viên tiến hành khảo sát trực tiếp bất động sản để xác minh tình trạng, pháp lý, vị trí, môi trường sống và giá trị xung quanh. Bước này giúp củng cố tính chính xác của giá định và nâng cao niềm tin của người mua.',
    fontSize: '17px',
    lineHeight: 1.6,
    color: '#000000',
    textAlign: 'justify'
  },
  border: {
    color: '#C2CBF0',
    width: '5px',
    style: 'dashed'
  },
  layout: {
    gap: '30px',
    imageTranslateX: '70px',
    rightSectionPadding: '0 70px',
    textPaddingRight: '60px'
  },
  responsive: {
    tabletImageMaxHeight: '400px',
    mobileImageMaxHeight: '300px',
    smallMobileImageMaxHeight: '250px'
  }
})

// UI State
const imagePreview = ref(null)
const iconPreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const imageInput = ref(null)
const iconInput = ref(null)

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
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 17

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

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get(`/cms/getSection/${SECTION_ID}`)

    if (response.data && response.data.contentJson) {
      const data = typeof response.data.contentJson === 'string'
          ? JSON.parse(response.data.contentJson)
          : response.data.contentJson

      // The JSON structure has section3
      const sectionData = data.section3 || data

      // Update content with loaded data
      Object.assign(content, sectionData)

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
      section3: { ...content }
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Khảo sát',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 3,
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
      iconPreview.value = null

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
  if (content.image.src === tempUrl) {
    content.image.src = realUrl
  }
  if (content.iconUrl === tempUrl) {
    content.iconUrl = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
// Main image
const triggerImageInput = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh chính', imagePreview, 'image.src')
  }
  event.target.value = ''
}

const handleImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh chính', imagePreview, 'image.src')
  }
}

const removeImage = () => {
  if (content.image.src) {
    handleRemoveFile(content.image.src, 'image.src', imagePreview)
  }
}

// Icon
const triggerIconInput = () => {
  iconInput.value?.click()
}

const handleIconUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Icon', iconPreview, 'iconUrl')
  }
  event.target.value = ''
}

const handleIconDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Icon', iconPreview, 'iconUrl')
  }
}

const removeIcon = () => {
  if (content.iconUrl) {
    handleRemoveFile(content.iconUrl, 'iconUrl', iconPreview)
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
  if (content.image.src) {
    previewImageUrl.value = getImageUrl(content.image.src)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const previewIcon = () => {
  if (content.iconUrl) {
    previewImageUrl.value = getImageUrl(content.iconUrl)
    showPreviewModal.value = true
  } else {
    showToast('Không có icon để xem trước', 'warning')
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
/* Giữ nguyên tất cả CSS từ file gốc */
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