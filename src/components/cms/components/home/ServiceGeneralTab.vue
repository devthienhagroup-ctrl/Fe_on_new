<template>
  <div class="service-general-tab">
    <!-- Quick Actions Bar -->
    <div class="quick-actions">
      <div class="quick-actions-inner">
        <span class="quick-actions-label">Nhanh:</span>
        <button class="btn-quick" @click="toggleAllSections(true)">
          <i class="fas fa-expand"></i> Mở tất cả
        </button>
        <button class="btn-quick" @click="toggleAllSections(false)">
          <i class="fas fa-compress"></i> Đóng tất cả
        </button>
        <button class="btn-quick" @click="scrollToTop">
          <i class="fas fa-chevron-up"></i> Lên đầu
        </button>
        <button class="btn-quick" @click="copySettings">
          <i class="fas fa-copy"></i> Sao chép cài đặt
        </button>
      </div>
    </div>

    <!-- 1. Thông tin chung -->
    <div class="editor-section main-section">
      <div class="section-header" @click="toggleSection('general')">
        <div class="header-left">
          <h3><i class="fas fa-cog"></i> Thông tin chung</h3>
          <p class="section-description">Cấu hình tiêu đề và nút hành động</p>
        </div>
        <div class="header-right">
          <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.general }"></i>
        </div>
      </div>
      <div v-if="isSectionOpen.general" class="section-content">
        <div class="form-row">
          <div class="form-group">
            <label for="section-title">
              <i class="fas fa-heading"></i> Tiêu đề section
              <span class="required-mark">*</span>
            </label>
            <input
                type="text"
                id="section-title"
                v-model="localData.title"
                placeholder="DỊCH VỤ NỔI BẬT"
                @input="emitUpdate"
            />
          </div>
          <div class="form-group">
            <label for="button-text">
              <i class="fas fa-button"></i> Văn bản nút
            </label>
            <input
                type="text"
                id="button-text"
                v-model="localData.buttonText"
                placeholder="Tìm hiểu thêm"
                @input="emitUpdate"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="button-icon">
              <i class="fas fa-icons"></i> Icon nút
            </label>
            <IconPicker v-model="localData.buttonIcon" @update:modelValue="emitUpdate"></IconPicker>
          </div>
          <div class="form-group">
            <label for="menu-arrow-icon">
              <i class="fas fa-chevron-right"></i> Icon mũi tên menu
            </label>
            <IconPicker v-model="localData.menuArrowIcon" @update:modelValue="emitUpdate"></IconPicker>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="mobile-expand-icon">
              <i class="fas fa-mobile-alt"></i> Icon mở rộng (mobile)
            </label>
            <IconPicker v-model="localData.mobileExpandIcon" @update:modelValue="emitUpdate"></IconPicker>
          </div>
          <div class="form-group">
            <label for="mobile-collapse-icon">
              <i class="fas fa-mobile-alt"></i> Icon thu gọn (mobile)
            </label>
            <IconPicker v-model="localData.mobileCollapseIcon" @update:modelValue="emitUpdate"></IconPicker>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Layout -->
    <div class="editor-section main-section">
      <div class="section-header" @click="toggleSection('layout')">
        <div class="header-left">
          <h3><i class="fas fa-th-large"></i> Bố cục</h3>
          <p class="section-description">Điều chỉnh bố cục và khoảng cách</p>
        </div>
        <div class="header-right">
          <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.layout }"></i>
        </div>
      </div>
      <div v-if="isSectionOpen.layout" class="section-content">
        <div class="form-group">
          <label for="column-ratio">
            <i class="fas fa-columns"></i> Tỉ lệ cột
          </label>
          <input
              type="text"
              id="column-ratio"
              v-model="localData.layout.columnRatio"
              placeholder="2fr 1fr"
              @input="emitUpdate"
          />
          <p class="input-hint">CSS grid column ratio (ví dụ: 2fr 1fr cho 2:1)</p>
        </div>

        <div class="form-group">
          <label for="menu-gap">
            <i class="fas fa-arrows-alt-h"></i> Khoảng cách menu
          </label>
          <div class="input-with-unit">
            <input
                type="text"
                id="menu-gap"
                v-model="localData.layout.menuGap"
                placeholder="12px"
                @input="emitUpdate"
            />
            <span class="unit">px</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Màu sắc -->
    <div class="editor-section main-section">
      <div class="section-header" @click="toggleSection('colors')">
        <div class="header-left">
          <h3><i class="fas fa-palette"></i> Màu sắc</h3>
          <p class="section-description">Tùy chỉnh bảng màu cho section</p>
        </div>
        <div class="header-right">
          <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.colors }"></i>
        </div>
      </div>
      <div v-if="isSectionOpen.colors" class="section-content">
        <div class="color-settings-grid">
          <div class="color-setting">
            <label>Màu chính</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.primary" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.primary" placeholder="#031358" @input="emitUpdate" />
            </div>
          </div>
          <div class="color-setting">
            <label>Màu phụ</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.secondary" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.secondary" placeholder="#3a53b9" @input="emitUpdate" />
            </div>
          </div>
          <div class="color-setting">
            <label>Màu sáng</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.light" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.light" placeholder="#ffffff" @input="emitUpdate" />
            </div>
          </div>
          <div class="color-setting">
            <label>Màu tối</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.dark" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.dark" placeholder="#031358" @input="emitUpdate" />
            </div>
          </div>
        </div>

        <h4 class="subsection-title">Màu văn bản</h4>
        <div class="color-settings-grid">
          <div class="color-setting">
            <label>Tiêu đề</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.text.title" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.text.title" placeholder="#031358" @input="emitUpdate" />
            </div>
          </div>
          <div class="color-setting">
            <label>Văn bản thường</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.text.normal" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.text.normal" placeholder="#333333" @input="emitUpdate" />
            </div>
          </div>
          <div class="color-setting">
            <label>Văn bản sáng</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.text.light" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.text.light" placeholder="#ffffff" @input="emitUpdate" />
            </div>
          </div>
        </div>

        <h4 class="subsection-title">Màu nền</h4>
        <div class="color-settings-grid">
          <div class="color-setting">
            <label>Overlay sáng</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.background.overlayLight" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.background.overlayLight" placeholder="rgba(255, 255, 255, 0)" @input="emitUpdate" />
            </div>
          </div>
          <div class="color-setting">
            <label>Overlay tối</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.background.overlayDark" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.background.overlayDark" placeholder="rgba(0, 0, 0, 0)" @input="emitUpdate" />
            </div>
          </div>
          <div class="color-setting">
            <label>Nút sáng</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.background.buttonLight" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.background.buttonLight" placeholder="rgba(255, 255, 255, 0.2)" @input="emitUpdate" />
            </div>
          </div>
          <div class="color-setting">
            <label>Nút tối</label>
            <div class="color-input">
              <input type="color" v-model="localData.colors.background.buttonDark" @input="emitUpdate" />
              <input type="text" v-model="localData.colors.background.buttonDark" placeholder="rgba(3, 19, 88, 0.9)" @input="emitUpdate" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Kiểu chữ -->
    <div class="editor-section main-section">
      <div class="section-header" @click="toggleSection('typography')">
        <div class="header-left">
          <h3><i class="fas fa-font"></i> Kiểu chữ</h3>
          <p class="section-description">Cấu hình typography</p>
        </div>
        <div class="header-right">
          <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.typography }"></i>
        </div>
      </div>
      <div v-if="isSectionOpen.typography" class="section-content">
        <div class="form-row">
          <div class="form-group">
            <label for="title-size">Kích thước tiêu đề</label>
            <div class="input-with-unit">
              <input
                  type="text"
                  id="title-size"
                  v-model="localData.typography.title.size"
                  placeholder="33px"
                  @input="emitUpdate"
              />
              <span class="unit">px</span>
            </div>
          </div>
          <div class="form-group">
            <label for="title-weight">Độ đậm tiêu đề</label>
            <input
                type="text"
                id="title-weight"
                v-model="localData.typography.title.weight"
                placeholder="bolder"
                @input="emitUpdate"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="title-family">Font family tiêu đề</label>
          <input
              type="text"
              id="title-family"
              v-model="localData.typography.title.family"
              placeholder="'Ubuntu', sans-serif"
              @input="emitUpdate"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="service-title-size">Kích thước tiêu đề dịch vụ</label>
            <div class="input-with-unit">
              <input
                  type="text"
                  id="service-title-size"
                  v-model="localData.typography.serviceTitle.size"
                  placeholder="28px"
                  @input="emitUpdate"
              />
              <span class="unit">px</span>
            </div>
          </div>
          <div class="form-group">
            <label for="service-title-weight">Độ đậm tiêu đề dịch vụ</label>
            <input
                type="text"
                id="service-title-weight"
                v-model="localData.typography.serviceTitle.weight"
                placeholder="700"
                @input="emitUpdate"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="content-size">Kích thước nội dung</label>
            <div class="input-with-unit">
              <input
                  type="text"
                  id="content-size"
                  v-model="localData.typography.content.size"
                  placeholder="16px"
                  @input="emitUpdate"
              />
              <span class="unit">px</span>
            </div>
          </div>
          <div class="form-group">
            <label for="content-mobile-size">Kích thước nội dung (mobile)</label>
            <div class="input-with-unit">
              <input
                  type="text"
                  id="content-mobile-size"
                  v-model="localData.typography.content.mobileSize"
                  placeholder="14px"
                  @input="emitUpdate"
              />
              <span class="unit">px</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="content-line-height">Chiều cao dòng nội dung</label>
          <input
              type="text"
              id="content-line-height"
              v-model="localData.typography.content.lineHeight"
              placeholder="1.6"
              @input="emitUpdate"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="button-size">Kích thước nút</label>
            <div class="input-with-unit">
              <input
                  type="text"
                  id="button-size"
                  v-model="localData.typography.button.size"
                  placeholder="14px"
                  @input="emitUpdate"
              />
              <span class="unit">px</span>
            </div>
          </div>
          <div class="form-group">
            <label for="button-weight">Độ đậm nút</label>
            <input
                type="text"
                id="button-weight"
                v-model="localData.typography.button.weight"
                placeholder="600"
                @input="emitUpdate"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 6. Khoảng cách -->
    <div class="editor-section main-section">
      <div class="section-header" @click="toggleSection('spacing')">
        <div class="header-left">
          <h3><i class="fas fa-ruler"></i> Khoảng cách</h3>
          <p class="section-description">Điều chỉnh padding và margin</p>
        </div>
        <div class="header-right">
          <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.spacing }"></i>
        </div>
      </div>
      <div v-if="isSectionOpen.spacing" class="section-content">
        <div class="form-row">
          <div class="form-group">
            <label for="title-bottom">Khoảng cách dưới tiêu đề</label>
            <div class="input-with-unit">
              <input
                  type="text"
                  id="title-bottom"
                  v-model="localData.spacing.titleBottom"
                  placeholder="60px"
                  @input="emitUpdate"
              />
              <span class="unit">px</span>
            </div>
          </div>
          <div class="form-group">
            <label for="column-gap">Khoảng cách cột</label>
            <div class="input-with-unit">
              <input
                  type="text"
                  id="column-gap"
                  v-model="localData.spacing.columnGap"
                  placeholder="40px"
                  @input="emitUpdate"
              />
              <span class="unit">px</span>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="overlay-padding">Padding overlay</label>
            <div class="input-with-unit">
              <input
                  type="text"
                  id="overlay-padding"
                  v-model="localData.spacing.overlayPadding"
                  placeholder="40px"
                  @input="emitUpdate"
              />
              <span class="unit">px</span>
            </div>
          </div>
          <div class="form-group">
            <label for="button-padding">Padding nút</label>
            <input
                type="text"
                id="button-padding"
                v-model="localData.spacing.buttonPadding"
                placeholder="12px 24px"
                @input="emitUpdate"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="menu-padding">Padding menu</label>
            <input
                type="text"
                id="menu-padding"
                v-model="localData.spacing.menuPadding"
                placeholder="20px 25px"
                @input="emitUpdate"
            />
          </div>
          <div class="form-group">
            <label for="collapse-item-margin">Margin item collapse</label>
            <div class="input-with-unit">
              <input
                  type="text"
                  id="collapse-item-margin"
                  v-model="localData.spacing.collapseItemMargin"
                  placeholder="10px"
                  @input="emitUpdate"
              />
              <span class="unit">px</span>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="mobile-title-bottom">Khoảng cách dưới tiêu đề (mobile)</label>
            <div class="input-with-unit">
              <input
                  type="text"
                  id="mobile-title-bottom"
                  v-model="localData.spacing.mobileTitleBottom"
                  placeholder="40px"
                  @input="emitUpdate"
              />
              <span class="unit">px</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 7. Trang trí -->
    <div class="editor-section main-section">
      <div class="section-header" @click="toggleSection('decorations')">
        <div class="header-left">
          <h3><i class="fas fa-magic"></i> Trang trí</h3>
          <p class="section-description">Hiệu ứng và hình ảnh trang trí</p>
        </div>
        <div class="header-right">
          <div class="toggle-switch">
            <input type="checkbox" id="enable-circle" v-model="localData.decorations.rotatingCircle.enabled" @change="emitUpdate" />
            <label for="enable-circle" class="toggle-label"></label>
          </div>
          <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.decorations }"></i>
        </div>
      </div>
      <div v-if="isSectionOpen.decorations" class="section-content">
        <div v-if="localData.decorations.rotatingCircle.enabled" class="form-group">
          <label for="circle-image">
            <i class="fas fa-circle"></i> Hình ảnh vòng tròn xoay
          </label>
          <div class="circle-image-upload">
            <div class="image-upload-preview">
              <div class="image-upload-area" @click="triggerCircleImageInput" @dragover.prevent @drop.prevent="handleCircleImageDrop">
                <input type="file" ref="circleImageInput" @change="handleCircleImageUpload" accept="image/*" style="display: none" />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
              </div>
              <div v-if="circleImagePreview" class="preview-container">
                <img :src="circleImagePreview" alt="Circle Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewCircleImage" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeCircleImage" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
            <p class="input-hint">Ảnh SVG cho hiệu ứng vòng tròn xoay</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, reactive, watch } from 'vue'
import IconPicker from "../../../RichTextEditor/IconPicker.vue"

const TEMP_PREFIX = 'temp_'

const generateTempName = (filename) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${TEMP_PREFIX}${timestamp}_${random}_${filename}`
}

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

// Local copy với giá trị mặc định
const localData = reactive({
  ...props.servicesData,
  services: props.servicesData.services || [],
  files: props.servicesData.files || []
})

// Khởi tạo files array nếu chưa có
if (!localData.files) {
  localData.files = []
}

// Update local data when props change
watch(() => props.servicesData, (newData) => {
  // Deep merge
  Object.keys(newData).forEach(key => {
    if (typeof newData[key] === 'object' && newData[key] !== null && !Array.isArray(newData[key])) {
      if (!localData[key]) localData[key] = {}
      Object.assign(localData[key], newData[key])
    } else if (Array.isArray(newData[key])) {
      localData[key] = [...newData[key]]
    } else {
      localData[key] = newData[key]
    }
  })

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

// Emit updates
const emitUpdate = () => {
  emit('update:servicesData', { ...localData })
}

// Collapsible sections
const isSectionOpen = reactive({
  general: true,
  layout: true,
  colors: true,
  typography: true,
  spacing: true,
  decorations: true
})

// Circle image preview
const circleImagePreview = ref(null)
const circleImageInput = ref(null)

// Functions
const toggleSection = (section) => {
  isSectionOpen[section] = !isSectionOpen[section]
}

const toggleAllSections = (open) => {
  Object.keys(isSectionOpen).forEach(key => {
    isSectionOpen[key] = open
  })
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const copySettings = () => {
  const settings = JSON.stringify(localData, null, 2)
  navigator.clipboard.writeText(settings)
      .then(() => alert('Đã sao chép cài đặt vào clipboard'))
      .catch(() => alert('Không thể sao chép cài đặt'))
}

const triggerCircleImageInput = () => {
  circleImageInput.value?.click()
}

const handleCircleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  const validTypes = ['image/svg+xml', 'image/jpeg', 'image/png', 'image/gif']
  const maxSize = 2 * 1024 * 1024 // 2MB

  if (!validTypes.includes(file.type)) {
    alert('Chỉ chấp nhận file SVG, JPG, PNG, GIF')
    return
  }

  if (file.size > maxSize) {
    alert('Kích thước file không được vượt quá 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const tempName = generateTempName(file.name)
    const dataUrl = e.target.result

    circleImagePreview.value = dataUrl

    // Nếu có ảnh cũ, đánh dấu xóa
    const oldImage = localData.decorations.rotatingCircle.image
    if (oldImage && oldImage !== tempName) {
      handleCircleFileRemoval(oldImage)
    }

    // Cập nhật ảnh cho circle - dùng tempName
    localData.decorations.rotatingCircle.image = tempName

    // Thêm file mới vào danh sách với status NEW
    addOrUpdateCircleFile(tempName, dataUrl, 'NEW', file)

    emitUpdate()
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const handleCircleImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleCircleImageUpload(fakeEvent)
  }
}

const removeCircleImage = () => {
  const currentImage = localData.decorations.rotatingCircle.image
  if (currentImage) {
    handleCircleFileRemoval(currentImage)
  }

  circleImagePreview.value = null
  localData.decorations.rotatingCircle.image = ''
  emitUpdate()
}


const previewCircleImage = () => {
  if (circleImagePreview.value) {
    window.open(circleImagePreview.value, '_blank')
  }
}

// Circle file management functions
// Circle file management functions - UPDATED
const addOrUpdateCircleFile = (tempName, dataUrl, status, file) => {
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

const handleCircleFileRemoval = (imageIdentifier) => {
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
.service-general-tab {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Quick Actions */
.quick-actions {
  background-color: white;
  padding: 10px 0;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.quick-actions-inner {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 0 20px;
}

.quick-actions-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.btn-quick {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: white;
  color: #495057;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-quick:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
  color: #031358;
}

/* Main Sections */
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

.header-left {
  flex: 1;
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

.header-left h3 i {
  font-size: 1.2rem;
  color: #4a6cf7;
}

.section-description {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
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

.fa-chevron-up:before {
  content: "▲";
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-label {
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
}

input:checked + .toggle-label:before {
  transform: translateX(24px);
}

/* Section Content */
.section-content {
  padding: 25px;
  background-color: white;
  animation: fadeIn 0.3s ease;
}

/* Form Groups */
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

.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

/* Form Inputs */
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
  box-sizing: border-box;
  background-color: white;
  color: #495057;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
  background-color: #f8f9ff;
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

/* Input with Unit */
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

/* Color Input */
.color-input {
  display: flex;
  gap: 12px;
  align-items: center;
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

.color-input input[type="color"]:hover {
  border-color: #4a6cf7;
  transform: scale(1.05);
}

.color-input input[type="text"] {
  flex: 1;
  min-width: 0;
}

/* Color Settings Grid */
.color-settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 10px;
}

.color-setting {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-setting label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0;
}

/* Subsection Title */
.subsection-title {
  margin: 20px 0 15px 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
}

/* Circle Image Upload */
.circle-image-upload {
  margin-bottom: 20px;
}

.image-upload-preview {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.image-upload-area {
  flex: 1;
  border: 2px dashed #ced4da;
  border-radius: 12px;
  padding: 40px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.image-upload-area:hover {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  transform: translateY(-2px);
}

.image-upload-area i {
  font-size: 3rem;
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
  margin: 8px 0;
  color: #495057;
  font-size: 1rem;
}

.image-upload-area span {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
}

.preview-container {
  flex: 1;
  position: relative;
  max-width: 50%;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #f8f9fa;
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
  margin-top: 10px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .quick-actions-inner {
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .section-content {
    padding: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .color-settings-grid {
    grid-template-columns: 1fr;
  }

  .image-upload-preview {
    flex-direction: column;
  }

  .preview-container {
    max-width: 100%;
    height: 200px;
  }
}
</style>