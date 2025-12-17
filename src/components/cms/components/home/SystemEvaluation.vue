<template>
  <div class="services-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Đánh giá Hệ thống</h2>
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
          :class="{ active: activeTab === 'content' }"
          @click="activeTab = 'content'"
      >
        <i class="fas fa-align-left"></i> Nội dung
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'styling' }"
          @click="activeTab = 'styling'"
      >
        <i class="fas fa-palette"></i> Giao diện
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab nội dung -->
      <div v-if="activeTab === 'content'" class="content-management">
        <div class="content-container">
          <div class="form-group">
            <label for="section-title">
              <i class="fas fa-heading"></i> Tiêu đề chính
              <span class="required-mark">*</span>
            </label>
            <input
                type="text"
                id="section-title"
                v-model="content.title"
                placeholder="ĐÁNH GIÁ HỆ THỐNG"
            />
          </div>

          <!-- Danh sách mục -->
          <div class="form-group">
            <label style="display:flex; justify-content: space-between">
              <span><i class="fas fa-list"></i> Danh sách đánh giá</span>
              <AdvancedEditModal v-model="content.listItems"></AdvancedEditModal>
            </label>
            <div class="list-items-container rich-text-editor-wrapper">
              <div class="tiptap" v-html="content.listItems"></div>
            </div>
          </div>

          <!-- Đoạn văn bản -->
          <div class="form-group">
            <label style="display:flex; justify-content: space-between">
              <span><i class="fas fa-list"></i> Đoạn văn bản</span>
              <AdvancedEditModal v-model="content.paragraphs"></AdvancedEditModal>
            </label>
            <div class="list-items-container rich-text-editor-wrapper">
              <div class="tiptap" v-html="content.paragraphs"></div>
            </div>
          </div>

          <!-- Hình ảnh -->
          <div class="form-group">
            <label><i class="fas fa-image"></i> Hình ảnh chính</label>
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
              </div>

              <div v-if="content.imageUrl || uploadedImagePreview" class="upload-preview">
                <img :src="getImageUrl(content.imageUrl)" alt="Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewMainImage" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeMainImage" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>

              <div class="input-hint" v-if="!content.imageUrl && !uploadedImagePreview">
                <input
                    type="text"
                    v-model="content.imageUrl"
                    placeholder="/imgs/anhnencot.png"
                    class="image-url-input"
                />
                <p class="hint-text">Nhập URL hoặc tải ảnh lên từ máy tính</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab giao diện -->
      <div v-if="activeTab === 'styling'" class="styling-management">
        <div class="styling-container">
          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>
            <div class="color-grid">
              <div class="color-input-group">
                <label>Màu chính</label>
                <div class="color-input">
                  <input type="color" v-model="styles.colors.primary" />
                  <input type="text" v-model="styles.colors.primary" placeholder="#031358" />
                </div>
              </div>
              <div class="color-input-group">
                <label>Nền sáng</label>
                <div class="color-input">
                  <input type="color" v-model="styles.colors.lightBackground" />
                  <input type="text" v-model="styles.colors.lightBackground" placeholder="#F3F5FC" />
                </div>
              </div>
              <div class="color-input-group">
                <label>Chữ sáng</label>
                <div class="color-input">
                  <input type="color" v-model="styles.colors.lightText" />
                  <input type="text" v-model="styles.colors.lightText" placeholder="#FFFFFF" />
                </div>
              </div>
            </div>
          </div>

          <!-- Khoảng cách Desktop -->
          <div class="setting-section">
            <h3><i class="fas fa-desktop"></i> Khoảng cách - Desktop</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Padding trái</label>
                <input type="text" v-model="styles.spacing.desktop.leftPadding" placeholder="60px 40px" />
              </div>
              <div class="form-group">
                <label>Padding phải</label>
                <input type="text" v-model="styles.spacing.desktop.rightPadding" placeholder="80px 40px 50px 40px" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Margin trái (phải)</label>
                <input type="text" v-model="styles.spacing.desktop.rightMarginLeft" placeholder="-10%" />
              </div>
              <div class="form-group">
                <label>Margin top (phải)</label>
                <input type="text" v-model="styles.spacing.desktop.rightMarginTop" placeholder="60px" />
              </div>
            </div>
          </div>

          <!-- Khoảng cách Tablet -->
          <div class="setting-section">
            <h3><i class="fas fa-tablet-alt"></i> Khoảng cách - Tablet</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Padding</label>
                <input type="text" v-model="styles.spacing.tablet.padding" placeholder="40px" />
              </div>
              <div class="form-group">
                <label>Chiều rộng ảnh</label>
                <div class="input-with-unit">
                  <input type="text" v-model="styles.spacing.tablet.imageWidth" placeholder="200px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Khoảng cách Mobile -->
          <div class="setting-section">
            <h3><i class="fas fa-mobile-alt"></i> Khoảng cách - Mobile</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Padding</label>
                <input type="text" v-model="styles.spacing.mobile.padding" placeholder="30px 25px" />
              </div>
              <div class="form-group">
                <label>Chiều rộng ảnh</label>
                <div class="input-with-unit">
                  <input type="text" v-model="styles.spacing.mobile.imageWidth" placeholder="180px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Kiểu chữ</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Kích thước tiêu đề</label>
                <div class="input-with-unit">
                  <input type="text" v-model="styles.typography.titleSize" placeholder="33px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label>Kích thước chữ</label>
                <div class="input-with-unit">
                  <input type="text" v-model="styles.typography.textSize" placeholder="17px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Chiều cao dòng</label>
              <input type="text" v-model="styles.typography.lineHeight" placeholder="1.8" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem trước ảnh chính -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="closePreviewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xem trước ảnh chính</h3>
          <button class="btn-icon btn-close-modal" @click="closePreviewModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="getImageUrl(content.imageUrl)" alt="Xem trước ảnh" />
            <div v-if="!content.imageUrl" class="preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Chưa có ảnh để xem trước</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closePreviewModal">Đóng</button>
            <button class="btn btn-primary" @click="triggerImageInput">Thay đổi ảnh</button>
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
const activeTab = ref('content')

// Content structure matching the JSON
const content = reactive({
  title: "ĐÁNH GIÁ HỆ THỐNG",
  listItems: [
    "Chúng tôi đánh giá toàn diện hệ thống hiện tại của bạn",
    "Phân tích các điểm mạnh và điểm cần cải thiện",
    "Đề xuất giải pháp tối ưu phù hợp với nhu cầu",
    "Triển khai công nghệ hiện đại và hiệu quả",
    "Hỗ trợ và bảo trì liên tục sau triển khai"
  ],
  paragraphs: [
    "Với kinh nghiệm 15 năm trong lĩnh vực mua bán, đầu tư bất động sản với hơn 130 căn bán gấp 30 ngày trong năm 2024 với giá cao nhất thị trường, cùng với đó là 329 bất động sản đã cho thuê thành công trong năm 2024.",
    "Và chúng tôi tin rằng con số đó sẽ còn tăng mạnh mẽ hơn nữa trong những năm tiếp theo. Từ nền tảng vững chắc tại TP.HCM, Thiên Hà Group đang mở rộng hành trình chinh phục thị trường bất động sản Việt Nam.",
    "Với đội ngũ chuyên nghiệp và quy trình bán nhanh tối ưu, chúng tôi cam kết mang lại giá trị thực cho khách hàng ở nhiều tỉnh thành hơn trong tương lai gần."
  ],
  imageUrl: "/imgs/anhnencot.png"
})

// Styles structure matching the JSON
const styles = reactive({
  colors: {
    primary: "#031358",
    lightBackground: "#F3F5FC",
    lightText: "#FFFFFF"
  },
  spacing: {
    desktop: {
      leftPadding: "60px 40px",
      rightPadding: "80px 40px 50px 40px",
      rightMarginLeft: "-10%",
      rightMarginTop: "60px"
    },
    tablet: {
      padding: "40px",
      imageWidth: "200px"
    },
    mobile: {
      padding: "30px 25px",
      imageWidth: "180px"
    }
  },
  typography: {
    titleSize: "33px",
    textSize: "17px",
    lineHeight: "1.8"
  }
})

// UI State
const isLoading = ref(false)
const uploadedImagePreview = ref(null)
const showPreviewModal = ref(false)

// File management
const files = ref([])
const imageInput = ref(null)
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

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/9')  // Changed to section 9

    if (response.data && response.data.contentJson) {
      const sectionData = JSON.parse(response.data.contentJson)

      // Load content data
      if (sectionData.content) {
        Object.assign(content, sectionData.content)
      }

      // Load styles data
      if (sectionData.styles) {
        Object.assign(styles, sectionData.styles)
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

        // Check for main image file
        if (content.imageUrl && !content.imageUrl.startsWith(TEMP_PREFIX)) {
          const filename = content.imageUrl
          const existingFile = files.value.find(f => f.filename === filename)
          if (!existingFile) {
            const tempName = generateTempName(filename)
            files.value.push({
              id: null,
              filename: filename,
              status: 'EXISTING',
              tempName: tempName,
              mappingTempUrl: TEMP_PREFIX + tempName,
              mappingRealUrl: filename,
              effectiveTempUrl: BASE_IMAGE_URL + filename,
              realFilenameForSearch: filename
            })
          }
        }
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

    // Prepare content data matching the JSON structure
    const contentData = {
      content: { ...content },
      styles: { ...styles }
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: 9,  // Changed to section 9
      name: 'Đánh giá hệ thống',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 8,
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
              // Update image URL from temp to real if it matches
              if (content.imageUrl === TEMP_PREFIX + file.tempName) {
                content.imageUrl = savedFile.filename
              }
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
      uploadedImagePreview.value = null

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

// ========== CONTENT MANAGEMENT FUNCTIONS ==========
const addListItem = () => {
  content.listItems.push("")
  showToast('Đã thêm mục mới', 'success')
}

const removeListItem = (index) => {
  if (content.listItems.length <= 1) {
    showToast('Không thể xóa mục cuối cùng', 'warning')
    return
  }

  content.listItems.splice(index, 1)
  showToast('Đã xóa mục', 'success')
}

const addParagraph = () => {
  content.paragraphs.push("")
  showToast('Đã thêm đoạn mới', 'success')
}

const removeParagraph = (index) => {
  if (content.paragraphs.length <= 1) {
    showToast('Không thể xóa đoạn cuối cùng', 'warning')
    return
  }

  content.paragraphs.splice(index, 1)
  showToast('Đã xóa đoạn', 'success')
}

// ========== FILE UPLOAD MANAGEMENT ==========
const triggerImageInput = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP', 'error')
    return
  }

  if (file.size > maxSize) {
    showToast('Kích thước file không được vượt quá 5MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Handle old image
    if (content.imageUrl) {
      const oldImageUrl = content.imageUrl

      if (oldImageUrl.startsWith(TEMP_PREFIX)) {
        const oldTempName = oldImageUrl.replace(TEMP_PREFIX, '')
        const fileIndex = files.value.findIndex(f => f.tempName === oldTempName)
        if (fileIndex !== -1) {
          files.value.splice(fileIndex, 1)
        }

        const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === oldTempName)
        if (uploadedIndex !== -1) {
          uploadedFiles.value.splice(uploadedIndex, 1)
        }
      } else {
        const fileIndex = files.value.findIndex(f => f.filename === oldImageUrl)
        if (fileIndex !== -1) {
          files.value[fileIndex].status = 'REMOVE'
        }
      }
    }

    // Update content
    content.imageUrl = tempUrl
    uploadedImagePreview.value = previewUrl

    // Create file DTO
    const fileDTO = {
      id: null,
      filename: file.name,
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

    showToast('Ảnh đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const handleImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleImageUpload(fakeEvent)
  }
}

const removeMainImage = () => {
  if (content.imageUrl) {
    const imageUrl = content.imageUrl

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

    content.imageUrl = ''
    uploadedImagePreview.value = null

    showToast('Đã xóa ảnh', 'success')
  }
}

// ========== UI FUNCTIONS ==========
const previewMainImage = () => {
  if (content.imageUrl) {
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Add specific styles for list items and paragraphs */
.list-items-container,
.paragraphs-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 10px;
}

.form-group .tiptap {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background-color: white;
}

.list-item-editor,
.paragraph-editor {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.list-item-editor:hover,
.paragraph-editor:hover {
  border-color: #4a6cf7;
  box-shadow: 0 2px 8px rgba(74, 108, 247, 0.1);
}

.list-item-header,
.paragraph-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-number,
.paragraph-number {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.list-item-input,
.paragraph-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.95rem;
  resize: vertical;
  transition: all 0.3s ease;
}

.list-item-input:focus,
.paragraph-input:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.list-item-input {
  min-height: 60px;
}

.paragraph-input {
  min-height: 90px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
  margin-left: 10px;
}

/* File Upload */
.file-upload {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.image-url-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 8px;
}

.hint-text {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 4px;
  margin-bottom: 0;
}

/* Modal specific styles */
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

.services-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
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
  padding: 20px;
  background-color: white;
  min-height: 500px;
}

/* Content Management */
.content-management,
.styling-management {
  width: 100%;
}

.content-container,
.styling-container {
  margin: 0 auto;
}

/* General Settings */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.setting-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
  margin-bottom: 25px;
}

.setting-section:last-child {
  margin-bottom: 0;
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

/* Form Styles */
.form-group {
  margin-bottom: 25px;
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

/* Required Mark */
.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

/* File Upload Section */
.file-upload-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.file-upload {
  margin-bottom: 15px;
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: row;
}

.file-upload-area {
  border: 2px dashed #ced4da;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.file-upload-area:hover {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
}

.file-upload-area i {
  font-size: 2.5rem;
  color: #6c757d;
  margin-bottom: 10px;
  display: block;
}

.file-upload-area p {
  margin: 0;
  color: #495057;
}

.file-upload-area span {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
}

.input-hint {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 5px;
}

.upload-preview {
  position: relative;
  width: 50%;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e9ecef;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* Button Icon */
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

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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
  .content-container,
  .styling-container {
    max-width: 100%;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .color-grid {
    grid-template-columns: 1fr 1fr;
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

  .upload-preview {
    max-width: 100%;
    height: 180px;
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

  .list-item-editor,
  .paragraph-editor {
    padding: 12px;
  }

  .list-item-header,
  .paragraph-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .file-upload-area {
    padding: 20px 15px;
  }

  .file-upload-area i {
    font-size: 2rem;
  }

  .modal-content {
    width: 95%;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
  }
}

/* Scrollbar Styling */
.services-list::-webkit-scrollbar,
.tab-content::-webkit-scrollbar,
.modal-body::-webkit-scrollbar {
  width: 8px;
}

.services-list::-webkit-scrollbar-track,
.tab-content::-webkit-scrollbar-track,
.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.services-list::-webkit-scrollbar-thumb,
.tab-content::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.services-list::-webkit-scrollbar-thumb:hover,
.tab-content::-webkit-scrollbar-thumb:hover,
.modal-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Loading state */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4a6cf7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #adb5bd;
  display: block;
}

.empty-state h4 {
  margin: 0 0 10px 0;
  color: #495057;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

/* Form validation styles */
.form-group.error input,
.form-group.error textarea {
  border-color: #dc3545;
}

.form-group.error .error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 5px;
}

/* Helper text */
.helper-text {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 5px;
  font-style: italic;
}

/* Drag and drop styles */
.drag-over {
  border-color: #4a6cf7 !important;
  background-color: #f8f9ff !important;
}

.drag-over i,
.drag-over p {
  color: #4a6cf7 !important;
}

/* Section preview */
.section-preview {
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  border-radius: 10px;
  padding: 30px;
  margin-top: 30px;
  color: white;
}

.preview-title {
  color: white;
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
}

.preview-content {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.preview-image {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  max-width: 300px;
}

.preview-image img {
  width: 100%;
  height: auto;
  display: block;
}

.preview-text {
  flex: 2;
}

.preview-list {
  margin-bottom: 20px;
}

.preview-list ul {
  padding-left: 20px;
  margin: 0;
}

.preview-list li {
  margin-bottom: 10px;
  line-height: 1.5;
}

.preview-paragraphs p {
  margin-bottom: 15px;
  line-height: 1.6;
}

/* Print styles */
@media print {
  .editor-header,
  .navigation-tabs,
  .header-controls,
  .modal-overlay,
  .toast-notification {
    display: none !important;
  }

  .services-editor {
    box-shadow: none;
    background: white;
  }

  .tab-content {
    padding: 0;
  }
}
</style>