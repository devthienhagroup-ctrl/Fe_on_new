<template>
  <div class="featured-section-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Section Nổi bật</h2>
      <div class="header-controls">
        <button class="btn btn-success" @click="saveChanges" :disabled="isLoading">
          <i class="fas fa-save"></i> {{ isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
        </button>
      </div>
    </div>

    <!-- Form chỉnh sửa -->
    <div class="editor-content">
      <!-- 1. Background -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('background')">
          <div class="header-left">
            <h3><i class="fas fa-image"></i> Background</h3>
            <p class="section-description">Hình nền cho section nổi bật</p>
          </div>
          <div class="header-right">
            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.background }"></i>
          </div>
        </div>
        <div v-if="isSectionOpen.background" class="section-content">
          <div class="form-group">
            <label for="background-image">
              <i class="fas fa-image"></i> Hình nền
              <span class="required-mark">*</span>
            </label>
            <div class="file-upload">
              <div class="file-upload-area" @click="triggerBackgroundInput" @dragover.prevent @drop.prevent="handleBackgroundDrop">
                <input type="file" ref="backgroundInput" @change="handleBackgroundUpload" accept="image/*" style="display: none" />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</p>
              </div>
              <div v-if="sectionData.background.image || backgroundPreview" class="upload-preview">
                <img :src="getImageUrl(sectionData.background.image)" alt="Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewBackground" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeBackgroundImage" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
            <p class="input-hint">Tải ảnh nền lên từ máy tính của bạn</p>
          </div>
        </div>
      </div>

      <!-- 2. Video -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('video')">
          <div class="header-left">
            <h3><i class="fas fa-video"></i> Video</h3>
            <p class="section-description">Cấu hình video và khung hiển thị</p>
          </div>
          <div class="header-right">
            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.video }"></i>
          </div>
        </div>
        <div v-if="isSectionOpen.video" class="section-content">
          <!-- Video Frame -->
          <div class="form-subsection">
            <h4><i class="fas fa-square"></i> Khung video</h4>
            <div class="form-row">
              <div class="form-group compact">
                <label for="frame-width">Chiều rộng</label>
                <div class="input-with-unit">
                  <input type="text" id="frame-width" v-model="sectionData.video.frame.width" placeholder="640px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group compact">
                <label for="frame-height">Chiều cao</label>
                <div class="input-with-unit">
                  <input type="text" id="frame-height" v-model="sectionData.video.frame.height" placeholder="380px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="frame-image">
                <i class="fas fa-crop"></i> Ảnh khung video
              </label>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerFrameInput" @dragover.prevent @drop.prevent="handleFrameDrop">
                  <input type="file" ref="frameInput" @change="handleFrameUpload" accept="image/*" style="display: none" />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh khung vào đây</p>
                </div>
                <div v-if="sectionData.video.frame.image || framePreview" class="upload-preview">
                  <img :src="getImageUrl(sectionData.video.frame.image)" alt="Frame Preview" />
                </div>
              </div>
            </div>
          </div>

          <!-- Video Embed -->
          <div class="form-subsection">
            <h4><i class="fab fa-youtube"></i> Video nhúng</h4>
            <div class="form-row">
              <div class="form-group compact">
                <label for="embed-width">Chiều rộng</label>
                <div class="input-with-unit">
                  <input type="number" id="embed-width" v-model.number="sectionData.video.embed.width" placeholder="640" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group compact">
                <label for="embed-height">Chiều cao</label>
                <div class="input-with-unit">
                  <input type="number" id="embed-height" v-model.number="sectionData.video.embed.height" placeholder="360" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="video-url">URL Video (YouTube)</label>
              <input type="text" id="video-url" v-model="sectionData.video.embed.url" placeholder="https://www.youtube.com/embed/..." />
            </div>

            <div class="form-group">
              <label for="video-title">Tiêu đề video</label>
              <input type="text" id="video-title" v-model="sectionData.video.embed.title" placeholder="YouTube video player" />
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Nội dung -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('content')">
          <div class="header-left">
            <h3><i class="fas fa-align-left"></i> Nội dung</h3>
            <p class="section-description">Tiêu đề và các đoạn văn bản</p>
          </div>
          <div class="header-right">
<!--            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.content }"></i>-->
            <AdvancedEditModal v-model="sectionData.content"></AdvancedEditModal>
          </div>
        </div>

        <div
             class="section-content">
          <div class="rich-text-editor-wrapper">
            <div class="tiptap" v-html="sectionData.content"></div>
          </div>
        </div>
      </div>

      <!-- 4. Nút bấm -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('buttons')">
          <div class="header-left">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm</h3>
            <p class="section-description">Cấu hình các nút hành động</p>
          </div>
          <div class="header-right">
            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.buttons }"></i>
          </div>
        </div>
        <div v-if="isSectionOpen.buttons" class="section-content">
          <!-- Primary Button -->
          <div class="form-subsection">
            <h4><i class="fas fa-star"></i> Nút chính</h4>
            <div class="form-row">
              <div class="form-group compact">
                <label for="primary-text">Text</label>
                <input type="text" id="primary-text" v-model="sectionData.buttons.primary.text" placeholder="Về chúng tôi >" />
              </div>
              <div class="form-group compact">
                <label for="primary-link">Link</label>
                <input type="text" id="primary-link" v-model="sectionData.buttons.primary.link" placeholder="/ve-chung-toi" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group compact">
                <label for="primary-bg">Màu nền</label>
                <div class="color-input compact">
                  <input type="color" id="primary-bg" v-model="sectionData.buttons.primary.backgroundColor" />
                  <input type="text" v-model="sectionData.buttons.primary.backgroundColor" placeholder="#031358" />
                </div>
              </div>
              <div class="form-group compact">
                <label for="primary-hover-bg">Màu nền hover</label>
                <div class="color-input compact">
                  <input type="color" id="primary-hover-bg" v-model="sectionData.buttons.primary.hoverBackgroundColor" />
                  <input type="text" v-model="sectionData.buttons.primary.hoverBackgroundColor" placeholder="#0a2463" />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group compact">
                <label for="primary-color">Màu chữ</label>
                <div class="color-input compact">
                  <input type="color" id="primary-color" v-model="sectionData.buttons.primary.color" />
                  <input type="text" v-model="sectionData.buttons.primary.color" placeholder="white" />
                </div>
              </div>
              <div class="form-group compact">
                <label for="primary-border">Màu viền</label>
                <div class="color-input compact">
                  <input type="color" id="primary-border" v-model="sectionData.buttons.primary.borderColor" />
                  <input type="text" v-model="sectionData.buttons.primary.borderColor" placeholder="#031358" />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group compact">
                <label for="primary-radius">Border radius</label>
                <div class="input-with-unit">
                  <input type="text" id="primary-radius" v-model="sectionData.buttons.primary.borderRadius" placeholder="25px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group compact">
                <label for="primary-padding">Padding</label>
                <input type="text" id="primary-padding" v-model="sectionData.buttons.primary.padding" placeholder="10px 45px" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group compact">
                <label for="primary-font-size">Font size</label>
                <div class="input-with-unit">
                  <input type="text" id="primary-font-size" v-model="sectionData.buttons.primary.fontSize" placeholder="16px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group compact">
                <label for="primary-font-weight">Font weight</label>
                <input type="text" id="primary-font-weight" v-model="sectionData.buttons.primary.fontWeight" placeholder="bold" />
              </div>
            </div>
          </div>

          <!-- Outline Button -->
          <div class="form-subsection">
            <h4><i class="far fa-square"></i> Nút outline</h4>
            <div class="form-row">
              <div class="form-group compact">
                <label for="outline-text">Text</label>
                <input type="text" id="outline-text" v-model="sectionData.buttons.outline.text" placeholder="Xem chi tiết" />
              </div>
              <div class="form-group compact">
                <label for="outline-link">Link</label>
                <input type="text" id="outline-link" v-model="sectionData.buttons.outline.link" placeholder="/giai-phap-ban-nhanh" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group compact">
                <label for="outline-color">Màu chữ</label>
                <div class="color-input compact">
                  <input type="color" id="outline-color" v-model="sectionData.buttons.outline.color" />
                  <input type="text" v-model="sectionData.buttons.outline.color" placeholder="#031358" />
                </div>
              </div>
              <div class="form-group compact">
                <label for="outline-hover-color">Màu chữ hover</label>
                <div class="color-input compact">
                  <input type="color" id="outline-hover-color" v-model="sectionData.buttons.outline.hoverColor" />
                  <input type="text" v-model="sectionData.buttons.outline.hoverColor" placeholder="white" />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group compact">
                <label for="outline-border">Màu viền</label>
                <div class="color-input compact">
                  <input type="color" id="outline-border" v-model="sectionData.buttons.outline.borderColor" />
                  <input type="text" v-model="sectionData.buttons.outline.borderColor" placeholder="#031358" />
                </div>
              </div>
              <div class="form-group compact">
                <label for="outline-border-width">Độ dày viền</label>
                <div class="input-with-unit">
                  <input type="text" id="outline-border-width" v-model="sectionData.buttons.outline.borderWidth" placeholder="2px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group compact">
                <label for="outline-hover-bg">Màu nền hover</label>
                <div class="color-input compact">
                  <input type="color" id="outline-hover-bg" v-model="sectionData.buttons.outline.hoverBackgroundColor" />
                  <input type="text" v-model="sectionData.buttons.outline.hoverBackgroundColor" placeholder="#031358" />
                </div>
              </div>
              <div class="form-group compact">
                <label for="outline-radius">Border radius</label>
                <div class="input-with-unit">
                  <input type="text" id="outline-radius" v-model="sectionData.buttons.outline.borderRadius" placeholder="25px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Preview Panel -->
      <div class="quick-preview-panel">
        <div class="preview-header" @click="togglePreviewPanel">
          <h4><i class="fas fa-eye"></i> Xem trước nhanh</h4>
          <i class="preview-collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': showQuickPreview }"></i>
        </div>
<!--        <div v-if="showQuickPreview" class="preview-content">-->
<!--          <div class="preview-summary">-->
<!--            <div class="summary-item">-->
<!--              <span class="summary-label">Tiêu đề:</span>-->
<!--              <span class="summary-value">{{ sectionData.content.title.substring(0, 30) }}...</span>-->
<!--            </div>-->
<!--            <div class="summary-item">-->
<!--              <span class="summary-label">Số đoạn văn:</span>-->
<!--              <span class="summary-value">{{ sectionData.content.paragraphs.length }}</span>-->
<!--            </div>-->
<!--            <div class="summary-item">-->
<!--              <span class="summary-label">Video URL:</span>-->
<!--              <span class="summary-value">{{ sectionData.video.embed.url ? 'Có' : 'Không' }}</span>-->
<!--            </div>-->
<!--            <div class="summary-item">-->
<!--              <span class="summary-label">Nút bấm:</span>-->
<!--              <span class="summary-value">2</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
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
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const sectionData = reactive({
  background: {
    image: "/imgs/bg-tin-tuc.png"
  },
  video: {
    frame: {
      width: "640px",
      height: "380px",
      image: "/imgs/khungVideo.svg"
    },
    embed: {
      width: 640,
      height: 360,
      url: "https://www.youtube.com/embed/JZ1YvvYo2hA?si=x9rywQQBLi_1Vcf8",
      title: "YouTube video player"
    }
  },
  content: {
    title: "GIẢI PHÁP BÁN GẤP BẤT ĐỘNG SẢN TRONG 30 NGÀY",
    paragraphs: [
      "Thiên Hà Group tự hào là đơn vị có hơn 15 năm kinh nghiệm hoạt động trong lĩnh vực mua bán và đầu tư bất động sản tại Việt Nam.",
      "Với phương châm <strong class=\"highlight\">\"Bất Động Sản Thật – Giá Trị Thật\"</strong>, Thiên Hà Group luôn nỗ lực đồng hành cùng Quý khách hàng trong quá trình mua bán, kiến tạo nên những giá trị thật sự cho cả người mua và người bán.",
      "Liên hệ ngay <b>Thiên Hà Group</b> để nhận tư vấn và hỗ trợ nhanh nhất!"
    ]
  },
  buttons: {
    primary: {
      text: "Về chúng tôi >",
      link: "/ve-chung-toi",
      backgroundColor: "#031358",
      hoverBackgroundColor: "#0a2463",
      color: "white",
      borderColor: "#031358",
      borderWidth: "0",
      borderRadius: "25px",
      padding: "10px 45px",
      margin: "0",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      clickTransform: "scale(0.95)",
      clickBoxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      type: "internal"
    },
    outline: {
      text: "Xem chi tiết",
      link: "/giai-phap-ban-nhanh",
      backgroundColor: "transparent",
      hoverBackgroundColor: "#031358",
      color: "#031358",
      hoverColor: "white",
      borderColor: "#031358",
      borderWidth: "2px",
      borderRadius: "25px",
      padding: "10px 45px",
      margin: "0",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "all 0.3s ease",
      clickTransform: "scale(0.95)",
      clickBoxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      type: "internal"
    }
  }
})

// File management
const files = ref([])
const uploadedFiles = ref([])
const backgroundInput = ref(null)
const frameInput = ref(null)
const backgroundPreview = ref(null)
const framePreview = ref(null)

// UI State
const isLoading = ref(false)
const showQuickPreview = ref(true)

// Collapsible sections
const isSectionOpen = reactive({
  background: true,
  video: true,
  content: true,
  buttons: true
})

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// ========== DEBUG FUNCTIONS ==========
const debugLog = (action, data) => {
  console.log(`[DEBUG] ${action}:`, data)
  console.log(`[DEBUG] Current files list:`, JSON.parse(JSON.stringify(files.value)))
  console.log(`[DEBUG] Current uploadedFiles:`, JSON.parse(JSON.stringify(uploadedFiles.value)))
  console.log(`[DEBUG] Current sectionData:`, {
    background: sectionData.background.image,
    frame: sectionData.video.frame.image
  })
  console.log('---')
}

// ========== HELPER FUNCTIONS ==========
import {baseImgaeUrl} from "../../../../assets/js/global.js";
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'

const getImageUrl = (filename) => {
  if (!filename) return ''

  // Nếu là file tạm (temp) -> dùng preview URL
  if (filename.startsWith(TEMP_PREFIX)) {
    const tempName = filename.replace(TEMP_PREFIX, '')
    const uploadedFile = uploadedFiles.value.find(f => f.tempName === tempName)
    if (uploadedFile && uploadedFile.previewUrl) {
      return uploadedFile.previewUrl
    }
    return ''
  }

  // Nếu là file thực -> dùng BASE_IMAGE_URL
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
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  const extension = originalFilename.split('.').pop()
  return `temp_${timestamp}_${random}.${extension}`
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/3')

    console.log('[DEBUG] API Response:', response.data)

    if (response.data && response.data.contentJson) {
      const content = JSON.parse(response.data.contentJson)

      // Update section data
      Object.assign(sectionData, content)

      // Reset files array trước khi load mới
      files.value = []

      // Kiểm tra các file trong content và tạo FileDTO
      checkAndAddFile(sectionData.background.image, 'background')
      checkAndAddFile(sectionData.video.frame.image, 'frame')

      // Nếu BE trả về files từ API response, sử dụng nó
      if (response.data.files && response.data.files.length > 0) {
        files.value = response.data.files.map(file => ({
          id: file.id,
          filename: file.filename,
          status: 'EXISTING',
          tempName: file.tempName || file.filename,
          mappingTempUrl: file.mappingTempUrl || file.filename,
          mappingRealUrl: file.mappingRealUrl || file.filename,
          dataPath: file.dataPath || getDataPathFromUrl(file.mappingRealUrl || file.filename)
        }))
      }

      debugLog('After loadData', {
        filesCount: files.value.length,
        backgroundImage: sectionData.background.image,
        frameImage: sectionData.video.frame.image
      })

      showToast('Dữ liệu đã được tải thành công', 'success')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu từ server', 'error')
  } finally {
    isLoading.value = false
  }
}

// Hàm xác định dataPath từ URL
const getDataPathFromUrl = (url) => {
  if (url.includes('bg-tin-tuc')) return 'background'
  if (url.includes('khungVideo')) return 'frame'
  return ''
}

// Hàm kiểm tra và thêm file vào danh sách
const checkAndAddFile = (imageUrl, type) => {
  if (!imageUrl || imageUrl.startsWith(TEMP_PREFIX)) return

  // Kiểm tra xem file đã tồn tại trong danh sách chưa
  const existingFile = files.value.find(f => f.filename === imageUrl || f.mappingRealUrl === imageUrl)
  if (existingFile) return

  // Tạo FileDTO cho file EXISTING
  const fileDTO = {
    id: null, // ID sẽ được BE cung cấp
    filename: imageUrl,
    status: 'EXISTING',
    tempName: imageUrl,
    mappingTempUrl: imageUrl,
    mappingRealUrl: imageUrl,
    dataPath: type
  }

  files.value.push(fileDTO)
  console.log(`[DEBUG] Added EXISTING file for ${type}:`, imageUrl)
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    debugLog('Before saveChanges', {
      filesToSend: files.value.filter(f => f.status !== 'EXISTING'),
      allFiles: files.value
    })

    // Prepare FormData for file upload
    const formData = new FormData()

    // Filter files to send only changed ones (NEW và REMOVE)
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Chuẩn bị section data với files array
    const sectionDataForSave = {
      id: 3,
      name: 'Nổi bật',
      contentJson: JSON.stringify(sectionData, null, 2),
      sortOrder: 2,
      files: filesToSend
    }

    console.log('[DEBUG] Section data to save:', sectionDataForSave)
    console.log('[DEBUG] Files to send:', filesToSend)

    // Add section data as JSON
    formData.append('section', new Blob([JSON.stringify(sectionDataForSave)], {
      type: 'application/json'
    }))

    // Add actual file binaries for NEW files
    const newFiles = filesToSend.filter(file => file.status === 'NEW')
    newFiles.forEach((fileDTO) => {
      const tempName = fileDTO.tempName
      const uploadedFile = uploadedFiles.value.find(f => f.tempName === tempName)

      if (uploadedFile && uploadedFile.file) {
        console.log(`[DEBUG] Adding file to FormData:`, fileDTO.filename)
        formData.append('files', uploadedFile.file, fileDTO.filename)
      }
    })

    // Send to API
    const response = await api.post('/cms/saveChange', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log('[DEBUG] Save response:', response.data)

    if (response.data) {
      showToast('Thay đổi đã được lưu thành công', 'success')

      // Update file statuses after successful save
      files.value.forEach(file => {
        if (file.status === 'NEW') {
          file.status = 'EXISTING'
          // Cập nhật mappingRealUrl từ response nếu có
          if (response.data.updatedFiles) {
            const updatedFile = response.data.updatedFiles.find(f => f.tempName === file.tempName)
            if (updatedFile) {
              file.mappingRealUrl = updatedFile.url
              file.id = updatedFile.id
            }
          }
        } else if (file.status === 'REMOVE') {
          // Xóa file đã được đánh dấu REMOVE khỏi danh sách
          const index = files.value.findIndex(f => f.id === file.id)
          if (index !== -1) {
            console.log(`[DEBUG] Removing file with REMOVE status:`, file)
            files.value.splice(index, 1)
          }
        }
      })

      // Clear uploaded files
      uploadedFiles.value = []
      backgroundPreview.value = null
      framePreview.value = null

      debugLog('After saveChanges', {
        updatedFiles: files.value,
        uploadedFilesCleared: true
      })

      // Load lại data để cập nhật state mới nhất từ BE
      await loadData()
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Lỗi khi lưu thay đổi: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    isLoading.value = false
  }
}

// ========== FILE UPLOAD FUNCTIONS ==========
const triggerBackgroundInput = () => {
  console.log('[DEBUG] triggerBackgroundInput called')
  backgroundInput.value?.click()
}

const triggerFrameInput = () => {
  console.log('[DEBUG] triggerFrameInput called')
  frameInput.value?.click()
}

const handleBackgroundUpload = (event) => {
  console.log('[DEBUG] handleBackgroundUpload called')
  handleFileUpload(event, 'background')
}

const handleFrameUpload = (event) => {
  console.log('[DEBUG] handleFrameUpload called')
  handleFileUpload(event, 'frame')
}

const handleBackgroundDrop = (event) => {
  console.log('[DEBUG] handleBackgroundDrop called')
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    console.log('[DEBUG] Dropped file:', file.name)
    const fakeEvent = { target: { files: [file] } }
    handleFileUpload(fakeEvent, 'background')
  }
}

const handleFrameDrop = (event) => {
  console.log('[DEBUG] handleFrameDrop called')
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    console.log('[DEBUG] Dropped file:', file.name)
    const fakeEvent = { target: { files: [file] } }
    handleFileUpload(fakeEvent, 'frame')
  }
}

const handleFileUpload = (event, type) => {
  console.log(`[DEBUG] handleFileUpload called for ${type}`, event.target.files[0])
  const file = event.target.files[0]
  if (!file) return

  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP, SVG', 'error')
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

    console.log(`[DEBUG] File read successful for ${type}:`, {
      fileName: file.name,
      tempName,
      tempUrl,
      previewUrlLength: previewUrl.length
    })

    // Xác định vị trí của file trong sectionData
    let oldImageUrl = ''
    let dataPath = ''

    if (type === 'background') {
      oldImageUrl = sectionData.background.image
      sectionData.background.image = tempUrl
      backgroundPreview.value = previewUrl
      dataPath = 'background'
      console.log(`[DEBUG] Updated background image from "${oldImageUrl}" to "${tempUrl}"`)
    } else if (type === 'frame') {
      oldImageUrl = sectionData.video.frame.image
      sectionData.video.frame.image = tempUrl
      framePreview.value = previewUrl
      dataPath = 'frame'
      console.log(`[DEBUG] Updated frame image from "${oldImageUrl}" to "${tempUrl}"`)
    }

    // Xử lý file cũ nếu có
    if (oldImageUrl) {
      console.log(`[DEBUG] Handling old file for ${type}:`, oldImageUrl)
      if (oldImageUrl.startsWith(TEMP_PREFIX)) {
        // Nếu file cũ là file tạm -> xóa hoàn toàn khỏi danh sách
        const oldTempName = oldImageUrl.replace(TEMP_PREFIX, '')
        console.log(`[DEBUG] Removing temp file:`, oldTempName)
        removeTempFile(oldTempName)
      } else {
        // Nếu file cũ là file thực -> đánh dấu REMOVE
        console.log(`[DEBUG] Marking real file for removal:`, oldImageUrl)
        markFileForRemoval(oldImageUrl, dataPath)
      }
    } else {
      console.log(`[DEBUG] No old file found for ${type}`)
    }

    // Tạo FileDTO cho file mới
    const fileDTO = {
      id: null,
      filename: file.name,
      status: 'NEW',
      tempName: tempName,
      mappingTempUrl: tempUrl,
      mappingRealUrl: null,
      dataPath: dataPath
    }

    console.log(`[DEBUG] Created NEW file DTO:`, fileDTO)

    // Lưu file binary và preview
    uploadedFiles.value.push({
      tempName: tempName,
      file: file,
      previewUrl: previewUrl
    })

    console.log(`[DEBUG] Added to uploadedFiles:`, {
      tempName,
      fileName: file.name,
      previewUrlLength: previewUrl.length
    })

    // Thêm vào danh sách files
    files.value.push(fileDTO)
    console.log(`[DEBUG] Added to files array. Total files:`, files.value.length)

    // Debug chi tiết
    debugLog(`After uploading ${type} image`, {
      newFile: fileDTO,
      oldImageUrl,
      sectionDataImage: type === 'background' ? sectionData.background.image : sectionData.video.frame.image
    })

    showToast('Ảnh đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('[DEBUG] Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const removeBackgroundImage = () => {
  console.log('[DEBUG] removeBackgroundImage called')

  if (sectionData.background.image) {
    const imageUrl = sectionData.background.image

    console.log(`[DEBUG] Removing background image:`, imageUrl)

    if (imageUrl.startsWith(TEMP_PREFIX)) {
      // Nếu là file tạm -> xóa hoàn toàn
      const tempName = imageUrl.replace(TEMP_PREFIX, '')
      console.log(`[DEBUG] Removing temp file:`, tempName)
      removeTempFile(tempName)
    } else {
      // Nếu là file thực -> đánh dấu REMOVE
      console.log(`[DEBUG] Marking real file for removal:`, imageUrl)
      markFileForRemoval(imageUrl, 'background')
    }

    // Xóa ảnh khỏi sectionData
    sectionData.background.image = ''
    backgroundPreview.value = null

    debugLog('After removing background image', {
      removedImage: imageUrl,
      sectionDataBackground: sectionData.background.image
    })

    showToast('Đã xóa ảnh nền', 'success')
  } else {
    console.log('[DEBUG] No background image to remove')
    showToast('Không có ảnh nền để xóa', 'warning')
  }
}

const removeTempFile = (tempName) => {
  console.log(`[DEBUG] removeTempFile called for:`, tempName)

  // Xóa khỏi files array
  const fileIndex = files.value.findIndex(f => f.tempName === tempName)
  if (fileIndex !== -1) {
    console.log(`[DEBUG] Removing from files array at index ${fileIndex}:`, files.value[fileIndex])
    files.value.splice(fileIndex, 1)
  } else {
    console.log(`[DEBUG] File not found in files array:`, tempName)
  }

  // Xóa khỏi uploadedFiles
  const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
  if (uploadedIndex !== -1) {
    console.log(`[DEBUG] Removing from uploadedFiles at index ${uploadedIndex}:`, uploadedFiles.value[uploadedIndex])
    uploadedFiles.value.splice(uploadedIndex, 1)
  } else {
    console.log(`[DEBUG] File not found in uploadedFiles:`, tempName)
  }
}

const markFileForRemoval = (filename, dataPath) => {
  console.log(`[DEBUG] markFileForRemoval called for:`, { filename, dataPath })

  // Tìm file trong danh sách
  const fileIndex = files.value.findIndex(f =>
      (f.filename === filename || f.mappingRealUrl === filename) &&
      f.dataPath === dataPath
  )

  if (fileIndex !== -1) {
    // Đánh dấu status là REMOVE
    console.log(`[DEBUG] Found existing file at index ${fileIndex}:`, files.value[fileIndex])
    files.value[fileIndex].status = 'REMOVE'
    console.log(`[DEBUG] Updated status to REMOVE:`, files.value[fileIndex])
  } else {
    // Nếu file chưa có trong danh sách, thêm mới với status REMOVE
    console.log(`[DEBUG] File not found, creating new with REMOVE status`)
    const fileDTO = {
      id: null,
      filename: filename,
      status: 'REMOVE',
      tempName: filename,
      mappingTempUrl: filename,
      mappingRealUrl: filename,
      dataPath: dataPath
    }
    files.value.push(fileDTO)
    console.log(`[DEBUG] Added new file with REMOVE status:`, fileDTO)
  }
}

// ========== CONTENT MANAGEMENT ==========
const addParagraph = () => {
  console.log('[DEBUG] addParagraph called')
  sectionData.content.paragraphs.push('')
  console.log(`[DEBUG] Added paragraph. Total:`, sectionData.content.paragraphs.length)
}

const removeParagraph = (index) => {
  console.log(`[DEBUG] removeParagraph called for index ${index}`)
  if (sectionData.content.paragraphs.length > 1) {
    console.log(`[DEBUG] Removing paragraph at index ${index}:`, sectionData.content.paragraphs[index])
    sectionData.content.paragraphs.splice(index, 1)
    console.log(`[DEBUG] Remaining paragraphs:`, sectionData.content.paragraphs.length)
  } else {
    console.log('[DEBUG] Cannot remove last paragraph')
    showToast('Phải có ít nhất một đoạn văn', 'warning')
  }
}

// ========== UI FUNCTIONS ==========
const toggleSection = (section) => {
  console.log(`[DEBUG] toggleSection called for:`, section)
  isSectionOpen[section] = !isSectionOpen[section]
  console.log(`[DEBUG] ${section} is now:`, isSectionOpen[section])
}

const togglePreviewPanel = () => {
  console.log('[DEBUG] togglePreviewPanel called')
  showQuickPreview.value = !showQuickPreview.value
  console.log(`[DEBUG] showQuickPreview is now:`, showQuickPreview.value)
}

const previewBackground = () => {
  console.log('[DEBUG] previewBackground called')
  if (sectionData.background.image) {
    const url = getImageUrl(sectionData.background.image)
    console.log(`[DEBUG] Opening background preview:`, url)
    window.open(url, '_blank')
  } else {
    console.log('[DEBUG] No background image to preview')
    showToast('Không có ảnh nền để xem trước', 'warning')
  }
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  console.log('[DEBUG] Component mounted')
  loadData()
})
</script>

<style scoped>
/* Giữ nguyên tất cả CSS styles từ file trước */
.featured-section-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

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

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #34ce57 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.editor-content {
  padding: 30px;
  background-color: white;
}

.main-section {
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.main-section:hover {
  border-color: #d0d7e7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  padding: 20px 25px;
  background: linear-gradient(to right, #f8f9ff, #ffffff);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  border-bottom: 1px solid transparent;
}

.section-header:hover {
  background: linear-gradient(to right, #f0f2ff, #ffffff);
}

.header-left h3 {
  margin: 0 0 6px 0;
  color: #031358;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-description {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.collapse-icon {
  width: 24px;
  height: 24px;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.collapse-icon:before {
  content: "▼";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: #495057;
  transition: all 0.3s ease;
}

.section-content {
  padding: 25px;
  background-color: white;
  animation: fadeIn 0.3s ease;
}

.form-group {
  margin-bottom: 20px;
}

.form-group.compact {
  margin-bottom: 15px;
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

.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: white;
  color: #495057;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
  background-color: #f8f9ff;
}

.input-with-unit {
  position: relative;
}

.input-with-unit input {
  padding-right: 70px;
  width: 100%;
}

.input-with-unit .unit {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.85rem;
  pointer-events: none;
  background-color: #f8f9fa;
  padding: 2px 8px;
  border-radius: 4px;
}

.file-upload {
  margin-bottom: 20px;
}

.file-upload-area {
  border: 2px dashed #ced4da;
  border-radius: 12px;
  padding: 40px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  position: relative;
  overflow: hidden;
}

.file-upload-area:hover {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  transform: translateY(-2px);
}

.file-upload-area i {
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 15px;
  display: block;
  transition: all 0.3s ease;
}

.file-upload-area:hover i {
  color: #4a6cf7;
  transform: scale(1.1);
}

.file-upload-area p {
  margin: 8px 0;
  color: #495057;
  font-size: 1rem;
}

.file-upload-area span {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
}

.file-hint {
  font-size: 0.85rem;
  color: #6c757d !important;
  margin-top: 10px !important;
}

.upload-preview {
  margin-top: 20px;
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.upload-preview:hover img {
  transform: scale(1.05);
}

.preview-actions {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-preview:hover .preview-actions {
  opacity: 1;
}

.btn-preview-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-preview-action:hover {
  background-color: white;
  transform: scale(1.1);
  color: #4a6cf7;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.color-input {
  display: flex;
  gap: 12px;
  align-items: center;
}

.color-input.compact {
  gap: 10px;
}

.color-input input[type="color"] {
  width: 60px;
  height: 50px;
  padding: 3px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.color-input.compact input[type="color"] {
  width: 50px;
  height: 40px;
}

.color-input input[type="color"]:hover {
  border-color: #4a6cf7;
  transform: scale(1.05);
}

.color-input input[type="text"] {
  flex: 1;
  min-width: 0;
}

.form-subsection {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.form-subsection:last-child {
  border-bottom: none;
}

.form-subsection h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.paragraph-item {
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.paragraph-header {
  background-color: #f8f9fa;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
}

.paragraph-header span {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
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
  color: #031358;
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.paragraph-item textarea {
  width: 100%;
  border: none;
  padding: 15px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.btn-sm {
  width: 100%;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.2s ease;
}

.btn-sm:hover {
  background-color: #e9ecef;
  color: #031358;
}

.quick-preview-panel {
  margin-top: 30px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.preview-header {
  padding: 15px 20px;
  background: linear-gradient(to right, #f0f2ff, #ffffff);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.preview-header:hover {
  background: linear-gradient(to right, #e3e8ff, #ffffff);
}

.preview-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-collapse-icon {
  width: 20px;
  height: 20px;
  position: relative;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.preview-collapse-icon:before {
  content: "▼";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  color: #495057;
}

.preview-content {
  padding: 20px;
  background-color: white;
  animation: fadeIn 0.3s ease;
}

.preview-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.summary-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.summary-value {
  font-weight: 600;
  color: #031358;
}

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
  flex-shrink: 0;
}

.btn-toast-close:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

  .editor-header h2 {
    text-align: center;
  }

  .editor-content {
    padding: 20px;
  }

  .section-header {
    padding: 15px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .section-content {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .btn {
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .section-header h3 {
    font-size: 1.2rem;
  }

  .section-description {
    font-size: 0.85rem;
  }
}
</style>