<template>
  <div class="popup-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Popup</h2>
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
        <i class="fas fa-align-left"></i> Nội dung
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
      <!-- Tab Thông tin chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Logo -->

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
                <p class="file-hint">Kích thước đề xuất: 400x300px</p>
              </div>

              <div v-if="imagePreview || content.image.src" class="upload-preview">
                <img :src="getImageUrl(content.image.src)" alt="Image Preview" />
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
              <label for="image-url">URL ảnh</label>
              <input
                  type="text"
                  id="image-url"
                  v-model="content.image.src"
                  placeholder="/imgs/house-searching-animate.svg"
              />
            </div>

            <div class="form-group">
              <label for="image-alt">Alt text cho ảnh</label>
              <input
                  type="text"
                  id="image-alt"
                  v-model="content.image.alt"
                  placeholder="House Searching"
              />
            </div>
          </div>

          <!-- Tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề</h3>

            <div class="form-group">
              <label for="title-text">Tiêu đề popup</label>
              <input
                  type="text"
                  id="title-text"
                  v-model="content.title"
                  placeholder="Bán nhanh 30 ngày"
              />
            </div>

            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label for="main-text">Nội dung chính</label>
                <AdvancedEditModal
                    v-model="content.mainText"
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
                <div class="tiptap" v-html="content.mainText"></div>
              </div>
            </div>

            <div class="form-group">
              <label for="sub-text">Văn bản phụ</label>
              <input
                  type="text"
                  id="sub-text"
                  v-model="content.subText"
                  placeholder="Việc đồng thuận về giá ngay từ đầu sẽ giúp:"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Nội dung -->
      <div v-if="activeTab === 'content'" class="content-settings">
        <div class="settings-grid">
          <!-- Lợi ích -->
          <div class="setting-section">
            <h3><i class="fas fa-list-check"></i> Danh sách lợi ích</h3>

            <div class="benefits-list">
              <div class="benefit-item" v-for="(benefit, index) in content.benefits" :key="index">
                <div class="benefit-header">
                  <h4>Lợi ích {{ index + 1 }}</h4>
                  <button class="btn-icon btn-remove-benefit" @click="removeBenefit(index)" v-if="content.benefits.length > 1">
                    <i class="fas fa-times"></i>
                  </button>
                </div>

                <div class="form-group">
                  <label :for="`benefit-icon-${index}`">Icon</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="benefit.icon"/>
                  </div>
                </div>

                <div class="form-group">
                  <label :for="`benefit-text-${index}`">Nội dung lợi ích</label>
                  <textarea
                      :id="`benefit-text-${index}`"
                      v-model="benefit.text"
                      placeholder="Mô tả lợi ích"
                      rows="3"
                  ></textarea>
                </div>

                <div class="form-group">
                  <div class="color-input-group">
                    <label>Màu icon</label>
                    <div class="color-input">
                      <input type="color" v-model="content.styles.iconColor" />
                      <input type="text" v-model="content.styles.iconColor" placeholder="#0030ff" />
                    </div>
                  </div>
                </div>
              </div>

              <button class="btn btn-secondary" @click="addBenefit">
                <i class="fas fa-plus"></i> Thêm lợi ích
              </button>
            </div>
          </div>

          <!-- Nút bấm -->
        </div>
      </div>

      <!-- Tab Giao diện -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>

            <div class="color-input-group">
              <label>Màu chủ đạo</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.primaryColor" />
                <input type="text" v-model="content.styles.primaryColor" placeholder="#031358" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu nền popup</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.backgroundColor" />
                <input type="text" v-model="content.styles.backgroundColor" placeholder="#f8f9fa" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu hover</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.hoverColor" />
                <input type="text" v-model="content.styles.hoverColor" placeholder="#0056b3" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu icon</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.iconColor" />
                <input type="text" v-model="content.styles.iconColor" placeholder="#0030ff" />
              </div>
            </div>
          </div>

          <!-- Kích thước & Khoảng cách -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Kích thước & Khoảng cách</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="popup-width">Chiều rộng popup</label>
                <div class="input-with-unit">
                  <input type="text" id="popup-width" v-model="popupWidth" placeholder="800px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="popup-padding">Padding popup</label>
                <input
                    type="text"
                    id="popup-padding"
                    v-model="popupPadding"
                    placeholder="40px"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="popup-border-radius">Bo góc popup</label>
                <div class="input-with-unit">
                  <input type="text" id="popup-border-radius" v-model="popupBorderRadius" placeholder="12px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="popup-shadow">Đổ bóng</label>
                <input
                    type="text"
                    id="popup-shadow"
                    v-model="popupShadow"
                    placeholder="0 10px 40px rgba(0, 0, 0, 0.1)"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="image-max-width">Chiều rộng tối đa ảnh</label>
              <div class="input-with-unit">
                <input type="text" id="image-max-width" v-model="imageMaxWidth" placeholder="300px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Typography</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="title-font-size">Kích thước tiêu đề</label>
                <div class="input-with-unit">
                  <input type="text" id="title-font-size" v-model="titleFontSize" placeholder="28px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="title-font-weight">Độ đậm tiêu đề</label>
                <select id="title-font-weight" v-model="titleFontWeight">
                  <option value="400">Bình thường</option>
                  <option value="500">Vừa</option>
                  <option value="600">Đậm vừa</option>
                  <option value="700">Đậm</option>
                  <option value="800">Rất đậm</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="text-font-size">Kích thước chữ chính</label>
                <div class="input-with-unit">
                  <input type="text" id="text-font-size" v-model="textFontSize" placeholder="16px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="benefit-font-size">Kích thước chữ lợi ích</label>
                <div class="input-with-unit">
                  <input type="text" id="benefit-font-size" v-model="benefitFontSize" placeholder="14px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm</h3>

            <div class="form-group">
              <label for="button-text">Văn bản nút</label>
              <input
                  type="text"
                  id="button-text"
                  v-model="content.buttonText"
                  placeholder="OK"
              />
            </div>

            <div class="color-input-group">
              <label>Màu nền nút</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.primaryColor" />
                <input type="text" v-model="content.styles.primaryColor" placeholder="#031358" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu hover nút</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.styles.hoverColor" />
                <input type="text" v-model="content.styles.hoverColor" placeholder="#0056b3" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="button-font-size">Kích thước chữ</label>
                <div class="input-with-unit">
                  <input type="text" id="button-font-size" v-model="buttonFontSize" placeholder="16px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="button-padding">Padding nút</label>
                <input
                    type="text"
                    id="button-padding"
                    v-model="buttonPadding"
                    placeholder="12px 24px"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="button-border-radius">Bo góc nút</label>
              <div class="input-with-unit">
                <input type="text" id="button-border-radius" v-model="buttonBorderRadius" placeholder="8px" />
                <span class="unit">px</span>
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
import { ref, reactive, onMounted, computed } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Content structure based on JSON data
const content = reactive({
  logo: '/imgs/logoTHG.png',
  logoAlt: 'Logo',
  title: 'Bán nhanh 30 ngày',
  mainText: 'Để đảm bảo quá trình bán được thực hiện nhanh chóng và hiệu quả, chúng tôi chỉ triển khai dịch vụ <b>\'bán nhanh trong 30 ngày\'</b> khi quý khách đưa ra mức giá kỳ vọng phù hợp với mặt bằng giá thị trường.',
  subText: 'Việc đồng thuận về giá ngay từ đầu sẽ giúp:',
  image: {
    src: '/imgs/house-searching-animate.svg',
    alt: 'House Searching'
  },
  benefits: [
    {
      icon: 'fas fa-check-circle',
      text: 'Quy trình thẩm định được thực hiện nhanh chóng và rõ ràng'
    },
    {
      icon: 'fas fa-chart-line',
      text: 'Hoạt động marketing được triển khai tập trung và hiệu quả hơn'
    },
    {
      icon: 'fas fa-users',
      text: 'Tiếp cận đúng nhóm khách mua thực, hạn chế mất thời gian'
    },
    {
      icon: 'fas fa-bullseye',
      text: 'Tối ưu tỷ lệ chốt giao dịch trong thời gian cam kết'
    }
  ],
  buttonText: 'OK',
  styles: {
    primaryColor: '#031358',
    hoverColor: '#0056b3',
    iconColor: '#0030ff',
    backgroundColor: '#f8f9fa'
  }
})

// Additional style properties (not in original JSON, but useful for editor)
const buttonFontSize = ref('16px')
const buttonPadding = ref('12px 24px')
const buttonBorderRadius = ref('8px')
const popupWidth = ref('800px')
const popupPadding = ref('40px')
const popupBorderRadius = ref('12px')
const popupShadow = ref('0 10px 40px rgba(0, 0, 0, 0.1)')
const imageMaxWidth = ref('300px')
const titleFontSize = ref('28px')
const titleFontWeight = ref('600')
const textFontSize = ref('16px')
const benefitFontSize = ref('14px')

// UI State
const logoPreview = ref(null)
const imagePreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const logoInput = ref(null)
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
import { baseImgaeUrl } from "../../../../assets/js/global.js";
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 26

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

      // Assuming data structure has popupConfig
      const popupData = data.popupConfig || data

      // Update content with loaded data
      Object.keys(popupData).forEach(key => {
        if (content[key] !== undefined) {
          if (key === 'styles' && popupData[key]) {
            Object.assign(content.styles, popupData[key])
          } else {
            content[key] = popupData[key]
          }
        }
      })

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

    // Prepare content data with popupConfig wrapper
    const contentData = {
      popupConfig: { ...content }
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Popup',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 12,
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
      logoPreview.value = null
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
  if (content.logo === tempUrl) {
    content.logo = realUrl
  }
  if (content.image.src === tempUrl) {
    content.image.src = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
// Logo
const triggerLogoInput = () => {
  logoInput.value?.click()
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Logo', logoPreview, 'logo')
  }
  event.target.value = ''
}

const handleLogoDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Logo', logoPreview, 'logo')
  }
}

const removeLogo = () => {
  if (content.logo) {
    handleRemoveFile(content.logo, 'logo', logoPreview)
  }
}

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

// ========== BENEFITS MANAGEMENT ==========
const addBenefit = () => {
  content.benefits.push({
    icon: 'fas fa-check-circle',
    text: 'Mô tả lợi ích mới'
  })
  showToast('Đã thêm lợi ích mới', 'success')
}

const removeBenefit = (index) => {
  if (content.benefits.length > 1) {
    content.benefits.splice(index, 1)
    showToast('Đã xóa lợi ích', 'success')
  } else {
    showToast('Cần ít nhất một lợi ích', 'warning')
  }
}

// ========== PREVIEW FUNCTIONS ==========
const previewLogo = () => {
  if (content.logo) {
    previewImageUrl.value = getImageUrl(content.logo)
    showPreviewModal.value = true
  } else {
    showToast('Không có logo để xem trước', 'warning')
  }
}

const previewImage = () => {
  if (content.image.src) {
    previewImageUrl.value = getImageUrl(content.image.src)
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
.popup-editor {
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

/* Benefits List */
.benefits-list {
  margin-top: 20px;
}

.benefit-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.benefit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.benefit-header h4 {
  margin: 0;
  color: #495057;
  font-size: 1rem;
}

.btn-remove-benefit {
  width: 28px;
  height: 28px;
  background-color: #f8f9fa;
  color: #dc3545;
}

.btn-remove-benefit:hover {
  background-color: #dc3545;
  color: white;
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

.input-with-icon {
  position: relative;
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