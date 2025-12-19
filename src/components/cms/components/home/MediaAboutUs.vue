<template>
  <div class="media-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Truyền thông</h2>
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
          :class="{ active: activeTab === 'media' }"
          @click="activeTab = 'media'"
      >
        <i class="fas fa-newspaper"></i> Ảnh truyền thông ({{ mediaLogos.length }})
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'gallery' }"
          @click="activeTab = 'gallery'"
      >
        <i class="fas fa-images"></i> Ảnh công ty ({{ galleryImages.length }})
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab cài đặt chung (giữ nguyên) -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Thông tin chung -->
          <div class="setting-section">
            <h3><i class="fas fa-info-circle"></i> Thông tin chung</h3>
            <div class="form-group">
              <label for="section-title">Tiêu đề chính</label>
              <input
                  type="text"
                  id="section-title"
                  v-model="settings.title"
                  placeholder="TRUYỀN THÔNG NÓI VỀ CHÚNG TÔI"
              />
            </div>
            <div class="form-group">
              <label for="section-subtitle">Phụ đề</label>
              <textarea
                  id="section-subtitle"
                  v-model="settings.subtitle"
                  rows="3"
                  placeholder="Nhập phụ đề..."
              ></textarea>
              <p class="input-hint">Có thể sử dụng thẻ &lt;br&gt; để xuống dòng</p>
            </div>
          </div>

          <!-- Ảnh nền -->

          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>
            <div class="color-grid">
              <div class="color-input-group form-group">
                <label>Màu chính</label>
                <div class="color-input">
                  <input type="color" v-model="settings.primaryColor" />
                  <input type="text" v-model="settings.primaryColor" placeholder="#031358" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu chữ</label>
                <div class="color-input">
                  <input type="color" v-model="settings.textColor" />
                  <input type="text" v-model="settings.textColor" placeholder="#000000" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu nền</label>
                <div class="color-input">
                  <input type="color" v-model="settings.backgroundColor" />
                  <input type="text" v-model="settings.backgroundColor" placeholder="#ffffff" />
                </div>
              </div>
            </div>
          </div>

          <!-- Kích thước -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Kích thước</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="title-font-size">Kích thước tiêu đề</label>
                <div class="input-with-unit">
                  <input type="text" id="title-font-size" v-model="settings.titleFontSize" placeholder="33px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="subtitle-font-size">Kích thước phụ đề</label>
                <div class="input-with-unit">
                  <input type="text" id="subtitle-font-size" v-model="settings.subtitleFontSize" placeholder="17px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="logo-height">Chiều cao logo</label>
                <div class="input-with-unit">
                  <input type="text" id="logo-height" v-model="settings.logoHeight" placeholder="60px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="logo-max-width">Rộng tối đa logo</label>
                <div class="input-with-unit">
                  <input type="text" id="logo-max-width" v-model="settings.logoMaxWidth" placeholder="150px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Gallery Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-photo-video"></i> Cài đặt gallery</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="gallery-width">Rộng ảnh gallery</label>
                <div class="input-with-unit">
                  <input type="text" id="gallery-width" v-model="settings.galleryItemWidth" placeholder="300px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="gallery-height">Cao ảnh gallery</label>
                <div class="input-with-unit">
                  <input type="text" id="gallery-height" v-model="settings.galleryItemHeight" placeholder="200px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="gallery-gap">Khoảng cách gallery</label>
                <div class="input-with-unit">
                  <input type="text" id="gallery-gap" v-model="settings.galleryGap" placeholder="20px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="gallery-alt-prefix">Tiền tố alt text</label>
                <input
                    type="text"
                    id="gallery-alt-prefix"
                    v-model="settings.galleryAltPrefix"
                    placeholder="Hoạt động"
                />
              </div>
            </div>
          </div>

          <!-- Animation Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-running"></i> Tốc độ chạy</h3>
              <div class="form-group">
                <label for="media-duration">Tốc độ logo truyền thông</label>
                <div class="input-with-unit">
                  <input type="number" id="media-duration" v-model="settings.marqueeDuration" placeholder="30" min="10" max="100" />
                  <span class="unit">giây</span>
                </div>
                <p class="input-hint">Thời gian để chạy hết 1 vòng</p>
              <div class="form-group" style="margin-top: 10px">
                <label for="gallery-duration">Tốc độ gallery</label>
                <div class="input-with-unit">
                  <input type="number" id="gallery-duration" v-model="settings.galleryMarqueeDuration" placeholder="40" min="10" max="100" />
                  <span class="unit">giây</span>
                </div>
                <p class="input-hint">Thời gian để chạy hết 1 vòng</p>
              </div>
            </div>
          </div>

          <!-- Mobile Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-mobile-alt"></i> Cài đặt mobile</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="mobile-title-size">Kích thước tiêu đề (mobile)</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-title-size" v-model="settings.mobileTitleFontSize" placeholder="28px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="mobile-logo-height">Cao logo (mobile)</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-logo-height" v-model="settings.mobileLogoHeight" placeholder="40px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="mobile-gallery-width">Rộng gallery (mobile)</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-gallery-width" v-model="settings.mobileGalleryItemWidth" placeholder="250px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="mobile-gallery-height">Cao gallery (mobile)</label>
                <div class="input-with-unit">
                  <input type="text" id="mobile-gallery-height" v-model="settings.mobileGalleryItemHeight" placeholder="170px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-expand"></i> Cài đặt modal</h3>
            <div class="color-grid">
              <div class="color-input-group form-group">
                <label>Màu nền modal</label>
                <div class="color-input">
                  <input type="color" v-model="settings.modalBackgroundColor" />
                  <input type="text" v-model="settings.modalBackgroundColor" placeholder="rgba(0, 0, 0, 0.9)" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu nút modal</label>
                <div class="color-input">
                  <input type="color" v-model="settings.modalButtonColor" />
                  <input type="text" v-model="settings.modalButtonColor" placeholder="rgba(255, 255, 255, 0.2)" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu nút modal (hover)</label>
                <div class="color-input">
                  <input type="color" v-model="settings.modalButtonHoverColor" />
                  <input type="text" v-model="settings.modalButtonHoverColor" placeholder="rgba(255, 255, 255, 0.4)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab ảnh truyền thông -->
      <div v-if="activeTab === 'media'" class="images-management">
        <div class="management-header">
          <h3>Quản lý logo truyền thông</h3>
          <div class="header-actions">
            <button class="btn btn-primary" @click="addMediaLogo">
              <i class="fas fa-plus"></i> Thêm logo
            </button>
            <div class="images-count">{{ mediaLogos.length }} logo</div>
          </div>
        </div>

        <div class="images-grid-container">
          <div class="images-grid">
            <!-- Ô thêm ảnh mới -->
            <div class="add-image-card" @click="addMediaLogo">
              <div class="add-image-content">
                <i class="fas fa-plus-circle"></i>
                <span>Thêm logo mới</span>
              </div>
            </div>

            <!-- Grid hiển thị các ảnh -->
            <div
                v-for="(logo, index) in mediaLogos"
                :key="index"
                class="image-card"
                @click="changeMediaLogo(index)"
            >
              <div class="image-container">
                <img
                    :src="getImageUrl(logo)"
                    :alt="`Logo truyền thông ${index + 1}`"
                    v-if="logo"
                />
                <div v-else class="image-placeholder">
                  <i class="fas fa-image"></i>
                  <span>Chưa có ảnh</span>
                </div>

                <!-- Overlay khi hover -->
                <div class="image-overlay">
                  <div class="overlay-content">
                    <i class="fas fa-exchange-alt"></i>
                    <span>Click để đổi ảnh</span>
                  </div>
                </div>
              </div>

              <div class="image-info">
                <span class="image-index">Logo {{ index + 1 }}</span>
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeMediaLogo(index)"
                    title="Xóa logo"
                    :disabled="mediaLogos.length <= 1"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="grid-actions">
            <button
                class="btn btn-secondary"
                @click="reorderMediaLogos"
                :disabled="mediaLogos.length <= 1"
            >
              <i class="fas fa-random"></i> Xáo trộn thứ tự
            </button>
            <p class="input-hint">Kéo thả ảnh để thay đổi thứ tự hoặc click để đổi ảnh</p>
          </div>
        </div>
      </div>

      <!-- Tab ảnh công ty -->
      <div v-if="activeTab === 'gallery'" class="images-management">
        <div class="management-header">
          <h3>Quản lý ảnh hoạt động công ty</h3>
          <div class="header-actions">
            <button class="btn btn-primary" @click="addGalleryImage">
              <i class="fas fa-plus"></i> Thêm ảnh
            </button>
            <div class="images-count">{{ galleryImages.length }} ảnh</div>
          </div>
        </div>

        <div class="images-grid-container">
          <div class="images-grid">
            <!-- Ô thêm ảnh mới -->
            <div class="add-image-card" @click="addGalleryImage">
              <div class="add-image-content">
                <i class="fas fa-plus-circle"></i>
                <span>Thêm ảnh mới</span>
              </div>
            </div>

            <!-- Grid hiển thị các ảnh -->
            <div
                v-for="(image, index) in galleryImages"
                :key="index"
                class="image-card"
                @click="changeGalleryImage(index)"
            >
              <div class="image-container">
                <img
                    :src="getImageUrl(image)"
                    :alt="`${settings.galleryAltPrefix} ${index + 1}`"
                    v-if="image"
                />
                <div v-else class="image-placeholder">
                  <i class="fas fa-image"></i>
                  <span>Chưa có ảnh</span>
                </div>

                <!-- Overlay khi hover -->
                <div class="image-overlay">
                  <div class="overlay-content">
                    <i class="fas fa-exchange-alt"></i>
                    <span>Click để đổi ảnh</span>
                  </div>
                </div>
              </div>

              <div class="image-info">
                <span class="image-index">{{ settings.galleryAltPrefix }} {{ index + 1 }}</span>
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeGalleryImage(index)"
                    title="Xóa ảnh"
                    :disabled="galleryImages.length <= 1"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="grid-actions">
            <button
                class="btn btn-secondary"
                @click="reorderGalleryImages"
                :disabled="galleryImages.length <= 1"
            >
              <i class="fas fa-random"></i> Xáo trộn thứ tự
            </button>
            <p class="input-hint">Kéo thả ảnh để thay đổi thứ tự hoặc click để đổi ảnh</p>
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
const mediaLogos = ref([])
const galleryImages = ref([])
const activeTab = ref('general')

// Settings object from JSON structure
const settings = reactive({
  backgroundImage: "logoTHG.png",
  backgroundAlt: "Logo nền",
  title: "TRUYỀN THÔNG NÓI VỀ CHÚNG TÔI",
  subtitle: "Thiên Hà Group tự hào được các phương tiện truyền thông phản ánh tích cực trong thời gian qua.<br>Cùng điểm lại một số tin bài online về Thiên Hà Group nhé!",
  marqueeDuration: 30,
  galleryMarqueeDuration: 40,
  primaryColor: "#031358",
  textColor: "#000000",
  backgroundColor: "#ffffff",
  titleFontSize: "33px",
  subtitleFontSize: "17px",
  logoHeight: "60px",
  logoMaxWidth: "150px",
  galleryItemWidth: "300px",
  galleryItemHeight: "200px",
  galleryGap: "20px",
  galleryAltPrefix: "Hoạt động",
  modalBackgroundColor: "rgba(0, 0, 0, 0.9)",
  modalButtonColor: "rgba(255, 255, 255, 0.2)",
  modalButtonHoverColor: "rgba(255, 255, 255, 0.4)",
  mobileBreakpoint: "768px",
  mobileTitleFontSize: "28px",
  mobileLogoHeight: "40px",
  mobileGalleryItemWidth: "250px",
  mobileGalleryItemHeight: "170px"
})

// UI State
const isLoading = ref(false)
const currentMediaInput = ref(null)
const currentGalleryInput = ref(null)

// File management
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

const createFileInput = (type) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'

  input.onchange = (event) => {
    handleImageUpload(event, type)
  }

  return input
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/10')

    if (response.data && response.data.contentJson) {
      const content = JSON.parse(response.data.contentJson)

      // Load settings
      Object.assign(settings, content)

      // Load media logos
      if (content.mediaLogos && Array.isArray(content.mediaLogos)) {
        mediaLogos.value = [...content.mediaLogos]
      }

      // Load gallery images
      if (content.galleryImages && Array.isArray(content.galleryImages)) {
        galleryImages.value = [...content.galleryImages]
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

        // Add existing files from arrays
        const allImages = [
          settings.backgroundImage,
          ...mediaLogos.value,
          ...galleryImages.value
        ].filter(img => img && !img.startsWith(TEMP_PREFIX))

        allImages.forEach(filename => {
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
        })
      }

      uploadedFiles.value = []
      showToast('Dữ liệu đã được tải thành công', 'success')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu từ server', 'error')

    // Initialize with empty arrays
    mediaLogos.value = []
    galleryImages.value = []
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare content data
    const contentData = {
      ...settings,
      mediaLogos: mediaLogos.value,
      galleryImages: galleryImages.value
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: 10,
      name: 'Truyền thông',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 9,
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

              // Update image URLs from temp to real
              if (settings.backgroundImage === TEMP_PREFIX + file.tempName) {
                settings.backgroundImage = savedFile.filename
              }

              mediaLogos.value = mediaLogos.value.map(logo =>
                  logo === TEMP_PREFIX + file.tempName ? savedFile.filename : logo
              )

              galleryImages.value = galleryImages.value.map(img =>
                  img === TEMP_PREFIX + file.tempName ? savedFile.filename : img
              )
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
      await loadData();
      showToast('Thay đổi đã được lưu thành công', 'success')
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Lỗi khi lưu thay đổi: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    isLoading.value = false
  }
}

// ========== MEDIA LOGOS MANAGEMENT ==========
const addMediaLogo = () => {
  const input = createFileInput('media')
  input.click()
}

const changeMediaLogo = (index) => {
  const input = createFileInput('media')

  input.onchange = (event) => {
    handleImageUpload(event, 'media', index)
  }

  input.click()
}

const removeMediaLogo = (index) => {
  if (mediaLogos.value.length <= 1) {
    showToast('Cần ít nhất 1 logo truyền thông', 'warning')
    return
  }

  const logo = mediaLogos.value[index]

  // Handle associated file
  if (logo) {
    if (logo.startsWith(TEMP_PREFIX)) {
      const tempName = logo.replace(TEMP_PREFIX, '')
      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else {
      const fileIndex = files.value.findIndex(f => f.filename === logo)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }
  }

  mediaLogos.value.splice(index, 1)
  showToast('Đã xóa logo', 'success')
}

const reorderMediaLogos = () => {
  // Shuffle array randomly
  for (let i = mediaLogos.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mediaLogos.value[i], mediaLogos.value[j]] = [mediaLogos.value[j], mediaLogos.value[i]];
  }
  showToast('Đã xáo trộn thứ tự logo', 'success')
}

// ========== GALLERY IMAGES MANAGEMENT ==========
const addGalleryImage = () => {
  const input = createFileInput('gallery')
  input.click()
}

const changeGalleryImage = (index) => {
  const input = createFileInput('gallery')

  input.onchange = (event) => {
    handleImageUpload(event, 'gallery', index)
  }

  input.click()
}

const removeGalleryImage = (index) => {
  if (galleryImages.value.length <= 1) {
    showToast('Cần ít nhất 1 ảnh hoạt động', 'warning')
    return
  }

  const image = galleryImages.value[index]

  // Handle associated file
  if (image) {
    if (image.startsWith(TEMP_PREFIX)) {
      const tempName = image.replace(TEMP_PREFIX, '')
      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else {
      const fileIndex = files.value.findIndex(f => f.filename === image)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }
  }

  galleryImages.value.splice(index, 1)
  showToast('Đã xóa ảnh', 'success')
}

const reorderGalleryImages = () => {
  // Shuffle array randomly
  for (let i = galleryImages.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [galleryImages.value[i], galleryImages.value[j]] = [galleryImages.value[j], galleryImages.value[i]];
  }
  showToast('Đã xáo trộn thứ tự ảnh', 'success')
}

// ========== GENERIC IMAGE HANDLING ==========
const handleImageUpload = (event, type, index = null) => {
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

    let oldImageUrl = ''

    // Determine where to add/update the image
    if (type === 'media') {
      if (index === null) {
        // Add new logo
        mediaLogos.value.push(tempUrl)
      } else {
        // Update existing logo
        oldImageUrl = mediaLogos.value[index]
        mediaLogos.value[index] = tempUrl
      }
    } else if (type === 'gallery') {
      if (index === null) {
        // Add new gallery image
        galleryImages.value.push(tempUrl)
      } else {
        // Update existing gallery image
        oldImageUrl = galleryImages.value[index]
        galleryImages.value[index] = tempUrl
      }
    }

    // Handle old image
    if (oldImageUrl) {
      handleImageRemoval(oldImageUrl)
    }

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
}

const handleImageRemoval = (imageUrl) => {
  if (!imageUrl) return

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
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.media-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-height: 100vh;
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
  border-radius: 12px 12px 0 0;
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

/* Header Controls */
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
  border-radius: 0;
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
  position: relative;
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
  min-height: 500px;
  border-radius: 0 0 12px 12px;
}

/* General Settings Styles */
.general-settings {
  width: 100%;
}

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
  transition: all 0.3s ease;
}

.setting-section:hover {
  border-color: #ced4da;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.setting-section h3 {
  margin: 0 0 20px 0;
  color: #031358;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.setting-section h3 i {
  color: #4a6cf7;
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
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
  font-family: inherit;
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
  line-height: 1.5;
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
  font-weight: 500;
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
  flex: 1;
  min-width: 0;
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
  font-weight: 500;
}

/* File Upload Styles */
.file-upload-section {
  margin-top: 10px;
}

.file-upload-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-upload {
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 10px;
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
  font-size: 0.95rem;
}

.file-upload-area span {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
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

.btn-preview-action.btn-danger:hover {
  color: #dc3545;
}

/* Input Hint */
.input-hint {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 5px;
  margin-bottom: 0;
  line-height: 1.4;
}

/* Images Management */
.images-management {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
}

.management-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  font-weight: 700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.images-count {
  background-color: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  border: 1px solid #e9ecef;
}

/* Images Grid Container */
.images-grid-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Images Grid */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 10px;
}

/* Add Image Card */
.add-image-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px dashed #ced4da;
  border-radius: 12px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.add-image-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(74, 108, 247, 0.1) 0%, rgba(106, 140, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.add-image-card:hover {
  border-color: #4a6cf7;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.15);
}

.add-image-card:hover::before {
  opacity: 1;
}

.add-image-content {
  text-align: center;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.add-image-content i {
  font-size: 2.8rem;
  color: #4a6cf7;
  transition: transform 0.3s ease;
}

.add-image-card:hover .add-image-content i {
  transform: scale(1.1);
}

.add-image-content span {
  font-size: 0.95rem;
  font-weight: 600;
  color: #495057;
}

/* Image Card */
.image-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
}

.image-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #e9ecef;
}

.image-container {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-card:hover .image-container img {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  gap: 12px;
  padding: 20px;
}

.image-placeholder i {
  font-size: 2.8rem;
  opacity: 0.7;
}

.image-placeholder span {
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.4;
}

/* Image Overlay */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(3, 19, 88, 0.85) 0%, rgba(6, 41, 190, 0.85) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.image-card:hover .overlay-content {
  transform: translateY(0);
}

.overlay-content i {
  font-size: 2rem;
  color: white;
  margin-bottom: 5px;
}

.overlay-content span {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Image Info */
.image-info {
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-top: 1px solid #e9ecef;
  min-height: 60px;
}

.image-index {
  font-size: 0.9rem;
  color: #495057;
  font-weight: 600;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 108, 247, 0.4);
  background: linear-gradient(135deg, #3a5ce5 0%, #5a7cff 100%);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #34ce57 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
  background: linear-gradient(135deg, #218838 0%, #2db84d 100%);
}

.btn-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #868e96 100%);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6268 0%, #727b84 100%);
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Icon Buttons */
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
  flex-shrink: 0;
}

.btn-icon:hover:not(:disabled) {
  transform: scale(1.1);
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-remove:hover:not(:disabled) {
  background-color: #dc3545;
  color: white;
}

/* Grid Actions */
.grid-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  margin-top: 10px;
}

/* Toast notification */
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
  backdrop-filter: blur(10px);
}

.toast-notification.success {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.95) 0%, rgba(52, 206, 87, 0.95) 100%);
  color: white;
  border-left: 4px solid #28a745;
}

.toast-notification.error {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.95) 0%, rgba(228, 96, 109, 0.95) 100%);
  color: white;
  border-left: 4px solid #dc3545;
}

.toast-notification.warning {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.95) 0%, rgba(255, 213, 79, 0.95) 100%);
  color: #856404;
  border-left: 4px solid #ffc107;
}

.toast-notification.info {
  background: linear-gradient(135deg, rgba(23, 162, 184, 0.95) 0%, rgba(77, 192, 209, 0.95) 100%);
  color: white;
  border-left: 4px solid #17a2b8;
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

/* Animations */
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

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(74, 108, 247, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(74, 108, 247, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(74, 108, 247, 0);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .settings-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media (max-width: 992px) {
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .color-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    padding: 20px;
  }

  .header-controls {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .header-controls .btn {
    width: 100%;
    justify-content: center;
  }

  .navigation-tabs {
    padding: 0 15px;
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    -webkit-overflow-scrolling: touch;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .tab-content {
    padding: 20px;
  }

  .management-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
  }

  .grid-actions {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .images-count {
    order: -1;
    width: 100%;
    text-align: center;
  }

  .management-header h3 {
    width: 100%;
    text-align: center;
  }

  .setting-section {
    padding: 15px;
  }

  .image-container {
    height: 140px;
  }

  .add-image-card {
    height: 140px;
  }
}

@media (max-width: 576px) {
  .editor-header h2 {
    font-size: 1.5rem;
    text-align: center;
  }

  .navigation-tabs {
    justify-content: center;
  }

  .tab-button {
    padding: 10px 15px;
    font-size: 0.85rem;
    min-width: auto;
    flex: 0 0 auto;
  }

  .images-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .image-container {
    height: 120px;
  }

  .add-image-card {
    height: 120px;
  }

  .overlay-content {
    padding: 10px;
  }

  .overlay-content i {
    font-size: 1.5rem;
  }

  .overlay-content span {
    font-size: 0.8rem;
  }

  .image-info {
    padding: 8px 10px;
    min-height: 50px;
  }

  .image-index {
    font-size: 0.8rem;
  }

  .btn-icon {
    width: 28px;
    height: 28px;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .color-input input[type="color"] {
    width: 40px;
    height: 35px;
  }

  .toast-notification {
    left: 20px;
    right: 20px;
    bottom: 20px;
    max-width: none;
  }
}

@media (max-width: 375px) {
  .images-grid {
    grid-template-columns: 1fr;
  }

  .image-container {
    height: 150px;
  }

  .add-image-card {
    height: 150px;
  }

  .tab-button {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .tab-button i {
    font-size: 0.9rem;
  }
}

/* Custom Scrollbar */
.images-grid-container::-webkit-scrollbar,
.images-grid::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.images-grid-container::-webkit-scrollbar-track,
.images-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.images-grid-container::-webkit-scrollbar-thumb,
.images-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.images-grid-container::-webkit-scrollbar-thumb:hover,
.images-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Loading state */
.btn:disabled {
  position: relative;
  overflow: hidden;
}

.btn:disabled::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* Focus styles for accessibility */
.btn:focus-visible,
.tab-button:focus-visible,
.btn-icon:focus-visible,
.btn-preview-action:focus-visible {
  outline: 2px solid #4a6cf7;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .media-editor {
    box-shadow: none;
    background-color: white;
  }

  .editor-header,
  .navigation-tabs,
  .header-controls,
  .btn,
  .btn-icon,
  .image-overlay,
  .grid-actions {
    display: none;
  }

  .tab-content {
    padding: 0;
    box-shadow: none;
  }

  .images-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .image-card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>