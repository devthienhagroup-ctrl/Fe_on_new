<template>
  <div class="service-list-tab">
    <!-- Add Service Button -->
    <div class="add-service-header">
      <button class="btn btn-primary" @click="addNewService" :disabled="isLoading">
        <i class="fas fa-plus"></i> Thêm Dịch vụ Mới
      </button>
      <div class="service-count">
        Tổng: {{ services.length }} dịch vụ
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="two-column-layout">
      <!-- Left Column: Service List -->
      <div class="service-list-column">
        <div class="service-list-container">
          <div
              v-for="(service, index) in services"
              :key="service.id"
              class="service-list-item"
              :class="{ active: activeServiceIndex === index }"
              @click="selectService(index)"
          >
            <div class="service-item-content">
              <div class="service-item-header">
                <span class="service-number">Dịch vụ {{ index + 1 }}</span>
                <div class="service-actions">
                  <button
                      class="btn-icon btn-move-up"
                      @click.stop="moveServiceUp(index)"
                      :disabled="index === 0 || isLoading"
                      title="Di chuyển lên"
                  >
                    <i class="fas fa-chevron-up"></i>
                  </button>
                  <button
                      class="btn-icon btn-move-down"
                      @click.stop="moveServiceDown(index)"
                      :disabled="index === services.length - 1 || isLoading"
                      title="Di chuyển xuống"
                  >
                    <i class="fas fa-chevron-down"></i>
                  </button>
                  <button
                      class="btn-icon btn-remove"
                      @click.stop="removeService(index)"
                      :disabled="services.length <= 1 || isLoading"
                      title="Xóa dịch vụ"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
              <h4 class="service-title">{{ service.title || 'Dịch vụ chưa có tên' }}</h4>
              <p class="service-content-preview">{{ truncateText(service.content, 80) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Service Editor -->
      <div class="service-editor-column" v-if="activeService !== null">
        <div class="editor-header">
          <h3><i class="fas fa-edit"></i> Chỉnh sửa Dịch vụ {{ activeServiceIndex + 1 }}</h3>
          <div class="editor-actions">
            <button class="btn btn-sm" @click="copyService" title="Sao chép dịch vụ">
              <i class="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <div class="editor-content">
          <!-- Service Information -->
          <div class="form-group">
            <label for="service-title">
              <i class="fas fa-tag"></i> Tiêu đề dịch vụ
              <span class="required-mark">*</span>
            </label>
            <input
                type="text"
                id="service-title"
                v-model="activeService.title"
                placeholder="Khảo sát bất động sản"
                @input="updateService"
            />
          </div>

          <div class="form-group">
            <label for="service-content">
              <i class="fas fa-align-left"></i> Nội dung dịch vụ
              <span class="required-mark">*</span>
            </label>
            <textarea
                id="service-content"
                v-model="activeService.content"
                placeholder="Mô tả chi tiết về dịch vụ..."
                rows="4"
                @input="updateService"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="service-icon">
              <i class="fas fa-icons"></i> Icon dịch vụ
            </label>
            <IconPicker v-model="activeService.icon" @update:modelValue="updateService"></IconPicker>
          </div>

          <!-- Image Upload with Preview -->
          <div class="form-group">
            <label for="service-image">
              <i class="fas fa-image"></i> Ảnh dịch vụ
            </label>
            <div class="image-upload-section">
              <div class="image-upload-preview">
                <!-- Upload Area -->
                <div class="image-upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                  <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none" />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây</p>
                  <p class="upload-hint">hoặc <span>chọn từ máy</span></p>
                </div>

                <!-- Preview Area -->
                <div v-if="showImagePreview" class="preview-container">
                  <img :src="imagePreviewUrl" alt="Preview" />
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeUploadedImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              <p class="input-hint">Kích thước đề xuất: 800x600px. Định dạng: JPG, PNG, GIF, WebP</p>
            </div>
          </div>

          <!-- Quick Info -->
          <div class="quick-info">
            <div class="info-item">
              <span class="info-label">Ký tự tiêu đề:</span>
              <span class="info-value">{{ activeService.title?.length || 0 }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Ký tự nội dung:</span>
              <span class="info-value">{{ activeService.content?.length || 0 }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Có ảnh:</span>
              <span class="info-value">{{ activeService.image ? 'Có' : 'Không' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-editor-column">
        <div class="empty-state">
          <i class="fas fa-concierge-bell"></i>
          <h3>Chọn một dịch vụ để chỉnh sửa</h3>
          <p>Nhấn vào dịch vụ trong danh sách bên trái để bắt đầu chỉnh sửa</p>
          <button class="btn btn-primary" @click="addNewService">
            <i class="fas fa-plus"></i> Thêm dịch vụ đầu tiên
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import IconPicker from "../../../RichTextEditor/IconPicker.vue"

const props = defineProps({
  servicesData: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:servicesData'])

const TEMP_PREFIX = 'temp_'

const generateTempName = (filename) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${TEMP_PREFIX}${timestamp}_${random}_${filename}`
}

// Local copy
const localData = reactive({ ...props.servicesData })

// Khởi tạo files array nếu chưa có
if (!localData.files) {
  localData.files = []
}

// Update local data when props change
watch(() => props.servicesData, (newData) => {
  Object.assign(localData, newData)
  if (!localData.files) {
    localData.files = []
  }
  // Đảm bảo tất cả file đều có status EXISTING khi load từ props
  localData.files.forEach(file => {
    if (!file.status || file.status === 'NEW') {
      file.status = 'EXISTING'
    }
  })
}, { deep: true })

// Services list
const services = computed(() => localData.services || [])

// Active service management
const activeServiceIndex = ref(0)
const activeService = computed(() => {
  if (activeServiceIndex.value === null || services.value.length === 0) {
    return null
  }
  return services.value[activeServiceIndex.value]
})

// Image preview
const fileInput = ref(null)
const showImagePreview = computed(() => {
  return activeService.value?.image || uploadedImagePreview.value
})
const imagePreviewUrl = computed(() => {
  if (uploadedImagePreview.value) {
    return uploadedImagePreview.value
  }
  return getImageUrl(activeService.value?.image)
})
const uploadedImagePreview = ref(null)

// Helper functions
const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getImageUrl = (filename) => {
  if (!filename) return ''
  if (filename.startsWith('data:image')) return filename
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename
  return `https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${filename}`
}

// Service management
const createNewService = () => ({
  id: Date.now() + Math.random(),
  title: "Dịch vụ mới",
  content: "Mô tả dịch vụ mới...",
  image: "",
  icon: "fa-solid fa-star"
})

const addNewService = () => {
  const newService = createNewService()
  localData.services.push(newService)
  activeServiceIndex.value = localData.services.length - 1
  emitUpdate()
}

const selectService = (index) => {
  activeServiceIndex.value = index
  uploadedImagePreview.value = null
}

const moveServiceUp = (index) => {
  if (index > 0) {
    const temp = localData.services[index]
    localData.services[index] = localData.services[index - 1]
    localData.services[index - 1] = temp
    activeServiceIndex.value = index - 1
    emitUpdate()
  }
}

const moveServiceDown = (index) => {
  if (index < localData.services.length - 1) {
    const temp = localData.services[index]
    localData.services[index] = localData.services[index + 1]
    localData.services[index + 1] = temp
    activeServiceIndex.value = index + 1
    emitUpdate()
  }
}

const removeService = (index) => {
  if (localData.services.length <= 1) {
    alert('Không thể xóa dịch vụ cuối cùng')
    return
  }

  if (confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
    // Nếu service có ảnh, đánh dấu file để xóa
    const serviceToRemove = localData.services[index]
    if (serviceToRemove.image) {
      handleFileRemoval(serviceToRemove.image)
    }

    localData.services.splice(index, 1)

    if (activeServiceIndex.value >= localData.services.length) {
      activeServiceIndex.value = localData.services.length - 1
    }

    emitUpdate()
  }
}

const copyService = () => {
  if (!activeService.value) return

  const copiedService = {
    ...activeService.value,
    id: Date.now() + Math.random(),
    title: activeService.value.title + ' (Copy)'
  }

  localData.services.splice(activeServiceIndex.value + 1, 0, copiedService)
  activeServiceIndex.value = activeServiceIndex.value + 1
  emitUpdate()
}

const updateService = () => {
  emitUpdate()
}

const emitUpdate = () => {
  emit('update:servicesData', { ...localData })
}

// Image upload functions
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file || !activeService.value) return

  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  if (!validTypes.includes(file.type)) {
    alert('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const tempName = generateTempName(file.name)
    const dataUrl = e.target.result

    uploadedImagePreview.value = dataUrl

    // Nếu service đang có ảnh cũ, đánh dấu xóa
    const oldImage = activeService.value.image
    if (oldImage && oldImage !== tempName) {
      handleFileRemoval(oldImage)
    }

    // Cập nhật ảnh cho service - dùng tempName
    activeService.value.image = tempName

    // Thêm file mới vào danh sách files với status NEW
    addOrUpdateFile(tempName, dataUrl, 'NEW', file)

    emitUpdate()
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleFileUpload(fakeEvent)
  }
}

const removeUploadedImage = () => {
  if (activeService.value) {
    const currentImage = activeService.value.image
    if (currentImage) {
      handleFileRemoval(currentImage)
    }

    uploadedImagePreview.value = null
    activeService.value.image = ''
    emitUpdate()
  }
}

const previewImage = () => {
  if (imagePreviewUrl.value) {
    window.open(imagePreviewUrl.value, '_blank')
  }
}

// File management functions
// File management functions - UPDATED
const addOrUpdateFile = (tempName, dataUrl, status, file) => {
  // Tìm file có cùng tempName hoặc mappingRealUrl
  const existingFileIndex = localData.files.findIndex(f =>
      f.tempName === tempName ||
      f.mappingRealUrl === tempName
  )

  if (existingFileIndex >= 0) {
    const existingFile = localData.files[existingFileIndex]

    // Nếu file đang là REMOVE, đổi thành EXISTING (update ảnh mới)
    if (existingFile.status === 'REMOVE') {
      existingFile.status = 'EXISTING'
    }

    // Cập nhật thông tin file
    localData.files[existingFileIndex] = {
      ...existingFile,
      filename: file.name,
      status: status,
      tempName: tempName,
      mappingTempUrl: dataUrl,
      mappingRealUrl: status === 'NEW' ? '' : existingFile.mappingRealUrl,
      realFilenameForSearch: file.name
    }
  } else {
    // Thêm file mới
    localData.files.push({
      id: null,
      filename: file.name,
      status: status,
      tempName: tempName,
      mappingTempUrl: dataUrl,
      mappingRealUrl: '', // Sẽ được BE gán khi upload thành công
      realFilenameForSearch: file.name
    })
  }
}


const handleFileRemoval = (imageIdentifier) => {
  if (!imageIdentifier) return

  // Tìm file trong danh sách bằng tempName hoặc mappingRealUrl
  const fileIndex = localData.files.findIndex(f =>
      f.tempName === imageIdentifier ||
      f.mappingRealUrl === imageIdentifier
  )

  if (fileIndex >= 0) {
    const file = localData.files[fileIndex]

    if (file.status === 'NEW') {
      // Xóa file mới khỏi danh sách (chưa upload lên BE)
      localData.files.splice(fileIndex, 1)
    } else if (file.status === 'EXISTING') {
      // Đánh dấu file cũ để xóa (BE sẽ xóa file thực)
      localData.files[fileIndex].status = 'REMOVE'
    }
  } else {
    // Nếu không tìm thấy trong files nhưng có mappingRealUrl (URL từ BE)
    // Tạo file mới với status REMOVE để BE xóa
    if (imageIdentifier && !imageIdentifier.startsWith('data:')) {
      const filename = imageIdentifier.split('/').pop()
      localData.files.push({
        id: null,
        filename: filename,
        status: 'REMOVE',
        tempName: imageIdentifier,
        mappingTempUrl: imageIdentifier,
        mappingRealUrl: imageIdentifier,
        realFilenameForSearch: filename
      })
    }
  }
}
</script>

<style scoped>
.service-list-tab {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Add Service Header */
.add-service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding: 15px 20px;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.service-count {
  font-size: 0.95rem;
  color: #6c757d;
  font-weight: 600;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

/* Two Column Layout */
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  min-height: 600px;
}

@media (max-width: 1200px) {
  .two-column-layout {
    grid-template-columns: 1fr 1.5fr;
  }
}

@media (max-width: 992px) {
  .two-column-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Left Column: Service List */
.service-list-column {
  background-color: white;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.service-list-container {
  max-height: 700px;
  overflow-y: auto;
}

.service-list-item {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.service-list-item:hover {
  background-color: #f8f9fa;
}

.service-list-item.active {
  background-color: #f0f2ff;
  border-left: 4px solid #4a6cf7;
  position: relative;
}

.service-list-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #4a6cf7;
}

.service-item-content {
  position: relative;
}

.service-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.service-number {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 600;
  background-color: #f1f3f9;
  padding: 4px 10px;
  border-radius: 12px;
}

.service-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.service-list-item:hover .service-actions,
.service-list-item.active .service-actions {
  opacity: 1;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
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
  background-color: #e9ecef;
  border-color: #adb5bd;
  color: #031358;
  transform: scale(1.1);
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-remove:hover:not(:disabled) {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.service-title {
  margin: 0 0 10px 0;
  color: #031358;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
}

.service-content-preview {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Right Column: Service Editor */
.service-editor-column {
  background-color: white;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.editor-header {
  padding: 20px 25px;
  background: linear-gradient(to right, #f8f9ff, #ffffff);
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-header h3 i {
  color: #4a6cf7;
  font-size: 1.1rem;
}

.editor-actions {
  display: flex;
  gap: 10px;
}

.btn-sm {
  padding: 8px 12px;
  font-size: 0.85rem;
}

.editor-content {
  padding: 25px;
  flex: 1;
  overflow-y: auto;
}

/* Form Groups */
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

.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

.form-group input[type="text"],
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

.form-group textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.5;
}

/* Image Upload Section */
.image-upload-section {
  margin-bottom: 10px;
}

.image-upload-preview {
  display: flex;
  gap: 20px;
  align-items: stretch;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .image-upload-preview {
    flex-direction: column;
  }
}

.image-upload-area {
  flex: 1;
  border: 2px dashed #ced4da;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.image-upload-area:hover {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  transform: translateY(-2px);
}

.image-upload-area i {
  font-size: 2.5rem;
  color: #6c757d;
  margin-bottom: 15px;
  display: block;
  transition: all 0.3s ease;
}

.image-upload-area:hover i {
  color: #4a6cf7;
  transform: scale(1.1);
}

.image-upload-area p {
  margin: 5px 0;
  color: #495057;
  font-size: 1rem;
}

.upload-hint {
  font-size: 0.9rem;
  color: #6c757d;
}

.image-upload-area span {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
}

.preview-container {
  flex: 1;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 200px;
  background-color: #f8f9fa;
}

.preview-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
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

.preview-container:hover .preview-actions {
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

.input-hint {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 5px;
}

/* Quick Info */
.quick-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.info-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.info-value {
  font-weight: 600;
  color: #031358;
}

/* Empty State */
.empty-editor-column {
  background-color: white;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  max-width: 400px;
}

.empty-state i {
  font-size: 4rem;
  color: #e9ecef;
  margin-bottom: 20px;
  display: block;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #6c757d;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0 0 25px 0;
  color: #adb5bd;
  font-size: 1rem;
  line-height: 1.5;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Scrollbar Styling */
.service-list-container::-webkit-scrollbar,
.editor-content::-webkit-scrollbar {
  width: 6px;
}

.service-list-container::-webkit-scrollbar-track,
.editor-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.service-list-container::-webkit-scrollbar-thumb,
.editor-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.service-list-container::-webkit-scrollbar-thumb:hover,
.editor-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive */
@media (max-width: 768px) {
  .add-service-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .service-count {
    text-align: center;
  }

  .service-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .service-actions {
    opacity: 1;
    align-self: flex-end;
  }

  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .editor-actions {
    align-self: flex-end;
  }
}
</style>