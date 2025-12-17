<template>
  <div class="reasons-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Lý do nên định giá tại Thiên Hà Group</h2>
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
          :class="{ active: activeTab === 'advantages' }"
          @click="activeTab = 'advantages'"
      >
        <i class="fas fa-star"></i> Ưu điểm
      </button>

    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Thông tin chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Thông tin chính -->
          <div class="setting-section">
            <h3><i class="fas fa-info-circle"></i> Thông tin chính</h3>

            <div class="form-group">
              <label for="sectionTitle">Tiêu đề section</label>
              <input
                  type="text"
                  id="sectionTitle"
                  v-model="content.sectionTitle"
                  placeholder="Tại sao nên định giá tại Thiên Hà Group?"
              />
            </div>


            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label>Hình nền section</label>
                <button class="btn-icon btn-preview-action" @click="previewBackground" title="Xem trước"
                        v-if="content.backgroundImage">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerBackgroundInput" @dragover.prevent
                     @drop.prevent="handleBackgroundDrop">
                  <input
                      type="file"
                      ref="backgroundInput"
                      @change="handleBackgroundUpload"
                      accept="image/*"
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh nền vào đây hoặc <span>chọn từ máy</span></p>
                  <p class="file-hint">Kích thước đề xuất: 1920x1080px</p>
                </div>

                <div v-if="backgroundPreview || content.backgroundImage" class="upload-preview">
                  <img :src="getImageUrl(content.backgroundImage)" alt="Background Preview"/>
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewBackground" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeBackground" title="Xóa ảnh nền">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!backgroundPreview && !content.backgroundImage" class="form-group">
                <label for="bg-url">Hoặc nhập URL ảnh nền</label>
                <input
                    type="text"
                    id="bg-url"
                    v-model="content.backgroundImage"
                    placeholder="/imgs/bg-gia-tri.jpg"
                />
              </div>
            </div>
          </div>

          <!-- Màu sắc chủ đề -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc chủ đề</h3>

            <div class="color-input-group">
              <label>Màu chính (Primary)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.themeColors.primary"/>
                <input type="text" v-model="content.themeColors.primary" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu phụ (Secondary)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.themeColors.secondary"/>
                <input type="text" v-model="content.themeColors.secondary" placeholder="#F8BD0D"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ sáng (Text Light)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.themeColors.textLight"/>
                <input type="text" v-model="content.themeColors.textLight" placeholder="#FFFFFF"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ tối (Text Dark)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.themeColors.textDark"/>
                <input type="text" v-model="content.themeColors.textDark" placeholder="#031358"/>
              </div>
            </div>
          </div>

          <!-- Cấu trúc layout -->
          <div class="setting-section">
            <h3><i class="fas fa-columns"></i> Cấu trúc layout</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="leftColumnItems">Số ưu điểm cột trái</label>
                <input
                    type="number"
                    id="leftColumnItems"
                    v-model.number="content.layout.leftColumnItems"
                    min="1"
                    max="10"
                />
                <small class="form-text">Số lượng ưu điểm hiển thị ở cột bên trái</small>
              </div>
              <div class="form-group">
                <label for="rightColumnItems">Số ưu điểm cột phải</label>
                <input
                    type="number"
                    id="rightColumnItems"
                    v-model.number="content.layout.rightColumnItems"
                    min="1"
                    max="10"
                />
                <small class="form-text">Số lượng ưu điểm hiển thị ở cột bên phải</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Ưu điểm -->
      <div v-if="activeTab === 'advantages'" class="advantages-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-star"></i> Danh sách ưu điểm</h3>
            <button class="btn btn-primary" @click="addAdvantage">
              <i class="fas fa-plus"></i> Thêm ưu điểm
            </button>
          </div>

          <div class="advantages-list">
            <div v-for="(advantage, index) in content.advantages" :key="index" class="advantage-item">
              <div class="advantage-header">
                <h4>Ưu điểm #{{ index + 1 }}</h4>
                <div class="advantage-actions">
                  <button class="btn-icon" @click="moveUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveDown(index)" :disabled="index === content.advantages.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeAdvantage(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label :for="`icon-${index}`">Biểu tượng</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="advantage.icon"/>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label :for="`title-${index}`">Tiêu đề ưu điểm</label>
                <input
                    type="text"
                    :id="`title-${index}`"
                    v-model="advantage.title"
                    placeholder="Tiện lợi đánh giá mọi lúc mọi nơi"
                />
              </div>

              <div class="form-group">
                <label :for="`content-${index}`">Nội dung ưu điểm</label>
                <textarea
                    :id="`content-${index}`"
                    v-model="advantage.content"
                    rows="3"
                    placeholder="Không cần phải hẹn chuyên viên hay di chuyển..."
                ></textarea>
              </div>
            </div>

            <div v-if="content.advantages.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Chưa có ưu điểm nào. Hãy thêm ưu điểm đầu tiên!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Thiết kế & Hiệu ứng -->
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

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Content structure based on new JSON data
const content = reactive({
  sectionTitle: "Tại sao nên định giá tại Thiên Hà Group?",
  logoUrl: "/imgs/logoTHG.png",
  backgroundImage: "/imgs/bg-gia-tri.jpg",
  themeColors: {
    primary: "#031358",
    secondary: "#F8BD0D",
    textLight: "#FFFFFF",
    textDark: "#031358"
  },
  advantages: [
    {
      icon: "fa-solid fa-laptop-house",
      title: "Tiện lợi đánh giá mọi lúc mọi nơi",
      content: "Không cần phải hẹn chuyên viên hay di chuyển, người dùng chỉ cần nhập thông tin tài sản (vị trí, diện tích, số tầng, hướng...) là có thể nhận được kết quả định giá ngay lập tức — tiết kiệm thời gian và công sức."
    },
    {
      icon: "fa-solid fa-bolt",
      title: "Nhanh chóng có kết quả trong vài giây",
      content: "Hệ thống tự động phân tích dữ liệu thị trường, so sánh với các bất động sản tương tự để đưa ra mức giá ước tính tức thì và chính xác — nhanh hơn hàng chục lần so với định giá thủ công."
    },
    {
      icon: "fa-solid fa-database",
      title: "Độ chính xác cao nhờ dữ liệu lớn",
      content: "Công cụ sử dụng dữ liệu thực tế từ hàng nghìn giao dịch, tin rao và giá trị trung cấp nhất liên tục — giúp kết quả phản ánh sát với giá trị thật của tài sản."
    },
    {
      icon: "fa-solid fa-chart-line",
      title: "Hỗ trợ ra quyết định đầu tư hiệu quả",
      content: "Kết quả định giá giúp người dùng so sánh giá bán, xác định cơ hội đầu tư hoặc thương lượng tốt hơn, tránh mua hớ hoặc bán lỗ."
    },
    {
      icon: "fa-solid fa-shield-halved",
      title: "Bảo mật và minh bạch thông tin",
      content: "Thông tin cá nhân và dữ liệu bất động sản của người dùng được mã hóa, chỉ phục vụ cho mục đích định giá — đảm bảo tính riêng tư và bảo mật."
    }
  ],
  floatingIcons: {
    enabled: true,
    count: 5,
    minSize: 20,
    maxSize: 40,
    minOpacity: 0.2,
    maxOpacity: 0.5,
    minDuration: 10,
    maxDuration: 20
  },
  layout: {
    leftColumnItems: 3,
    rightColumnItems: 2
  },
  customCSS: ""
})

// UI State
const logoPreview = ref(null)
const backgroundPreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const logoInput = ref(null)
const backgroundInput = ref(null)

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
import {baseImgaeUrl} from "../../../../assets/js/global.js";
import IconPicker from "../../../RichTextEditor/IconPicker.vue";

const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 31

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
      name: 'Lý do',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: content.sortOrder || 3,
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
      backgroundPreview.value = null

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
  if (content.logoUrl === tempUrl) {
    content.logoUrl = realUrl
  }
  if (content.backgroundImage === tempUrl) {
    content.backgroundImage = realUrl
  }
}

// ========== ADVANTAGES MANAGEMENT ==========
const addAdvantage = () => {
  content.advantages.push({
    icon: "fa-solid fa-star",
    title: "",
    content: ""
  })
  showToast('Đã thêm ưu điểm mới', 'success')
}

const removeAdvantage = (index) => {
  if (confirm('Bạn có chắc muốn xóa ưu điểm này?')) {
    content.advantages.splice(index, 1)
    showToast('Đã xóa ưu điểm', 'success')
  }
}

const moveUp = (index) => {
  if (index > 0) {
    const temp = content.advantages[index]
    content.advantages[index] = content.advantages[index - 1]
    content.advantages[index - 1] = temp
  }
}

const moveDown = (index) => {
  if (index < content.advantages.length - 1) {
    const temp = content.advantages[index]
    content.advantages[index] = content.advantages[index + 1]
    content.advantages[index + 1] = temp
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
    handleFileUpload(file, 'Logo', logoPreview, 'logoUrl')
  }
  event.target.value = ''
}

const handleLogoDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Logo', logoPreview, 'logoUrl')
  }
}

const removeLogo = () => {
  if (content.logoUrl) {
    handleRemoveFile(content.logoUrl, 'logoUrl', logoPreview)
  }
}

// Background
const triggerBackgroundInput = () => {
  backgroundInput.value?.click()
}

const handleBackgroundUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Background', backgroundPreview, 'backgroundImage')
  }
  event.target.value = ''
}

const handleBackgroundDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Background', backgroundPreview, 'backgroundImage')
  }
}

const removeBackground = () => {
  if (content.backgroundImage) {
    handleRemoveFile(content.backgroundImage, 'backgroundImage', backgroundPreview)
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
const previewLogo = () => {
  if (content.logoUrl) {
    previewImageUrl.value = getImageUrl(content.logoUrl)
    showPreviewModal.value = true
  } else {
    showToast('Không có logo để xem trước', 'warning')
  }
}

const previewBackground = () => {
  if (content.backgroundImage) {
    previewImageUrl.value = getImageUrl(content.backgroundImage)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh nền để xem trước', 'warning')
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
.reasons-editor {
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

.setting-section:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .setting-section:last-child:nth-child(odd) {
    max-width: 100%;
  }
}

@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-section:last-child:nth-child(odd) {
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

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
}

/* Advantages List */
.advantages-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.advantage-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.advantage-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.advantage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.advantage-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1.1rem;
}

.advantage-actions {
  display: flex;
  gap: 8px;
}

.btn-danger {

}

.btn-danger:hover {
  background: linear-gradient(135deg, #c82333 0%, #dc3545 100%);
  color: white !important;
}

/* Input with icon preview */
.input-with-icon {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-with-icon .icon-preview {
  font-size: 1.5rem;
  color: #4a6cf7;
  width: 40px;
  text-align: center;
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

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-text {
  display: block;
  margin-top: 6px;
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

/* Floating settings */
.floating-settings {
  padding: 15px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-top: 15px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  border: 2px dashed #dee2e6;
  border-radius: 10px;
  background: #f8f9fa;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
  color: #adb5bd;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
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
  background-color: #e9ecef;
  transform: scale(1.1);
}

.btn-preview-action {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.btn-preview-action:hover {
  background-color: white;
  color: #4a6cf7;
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

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .advantage-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .advantage-actions {
    align-self: flex-end;
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