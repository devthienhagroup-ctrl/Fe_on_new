<template>
  <div class="overview-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Tổng quan</h2>
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
          :class="{ active: activeTab === 'navItems' }"
          @click="activeTab = 'navItems'"
      >
        <i class="fas fa-list"></i> Mục điều hướng ({{ navItems.length }})
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab cài đặt chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">

          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>
            <div class="color-grid">
              <div class="color-input-group form-group">
                <label>Màu chính</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.primary" />
                  <input type="text" v-model="settings.colors.primary" placeholder="#031358" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu phụ</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.secondary" />
                  <input type="text" v-model="settings.colors.secondary" placeholder="#0629BE" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu nhấn</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.accent" />
                  <input type="text" v-model="settings.colors.accent" placeholder="#6C63FF" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu chữ</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.text" />
                  <input type="text" v-model="settings.colors.text" placeholder="#333" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu trắng</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.white" />
                  <input type="text" v-model="settings.colors.white" placeholder="#FFFFFF" />
                </div>
              </div>
            </div>
          </div>

          <!-- Layout -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Layout</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="containerHeight">Chiều cao container</label>
                <input
                    type="text"
                    id="containerHeight"
                    v-model="settings.layout.containerHeight"
                    placeholder="90vh"
                />
              </div>
              <div class="form-group">
                <label for="containerMinHeight">Chiều cao tối thiểu</label>
                <input
                    type="text"
                    id="containerMinHeight"
                    v-model="settings.layout.containerMinHeight"
                    placeholder="600px"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="containerMaxHeight">Chiều cao tối đa</label>
                <input
                    type="text"
                    id="containerMaxHeight"
                    v-model="settings.layout.containerMaxHeight"
                    placeholder="800px"
                />
              </div>
              <div class="form-group">
                <label for="containerMaxWidth">Chiều rộng tối đa</label>
                <input
                    type="text"
                    id="containerMaxWidth"
                    v-model="settings.layout.containerMaxWidth"
                    placeholder="1400px"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="leftColumnWidth">Chiều rộng cột trái</label>
                <input
                    type="text"
                    id="leftColumnWidth"
                    v-model="settings.layout.leftColumnWidth"
                    placeholder="400px"
                />
              </div>
              <div class="form-group">
                <label for="textMaxWidth">Chiều rộng tối đa văn bản</label>
                <input
                    type="text"
                    id="textMaxWidth"
                    v-model="settings.layout.textMaxWidth"
                    placeholder="900px"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="svgMaxWidth">Chiều rộng SVG tối đa</label>
                <input
                    type="text"
                    id="svgMaxWidth"
                    v-model="settings.layout.svgMaxWidth"
                    placeholder="500px"
                />
              </div>
              <div class="form-group">
                <label for="svgHeight">Chiều cao SVG</label>
                <input
                    type="text"
                    id="svgHeight"
                    v-model="settings.layout.svgHeight"
                    placeholder="250px"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="navItemHeight">Chiều cao mục điều hướng</label>
              <input
                  type="text"
                  id="navItemHeight"
                  v-model="settings.layout.navItemHeight"
                  placeholder="85px"
              />
            </div>
          </div>

          <!-- Font sizes -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Kích thước chữ</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="titleFontSize">Tiêu đề</label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="titleFontSize"
                      v-model="settings.fontSizes.title"
                      placeholder="26px"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="navItemFontSize">Mục điều hướng</label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="navItemFontSize"
                      v-model="settings.fontSizes.navItem"
                      placeholder="20px"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="textContentFontSize">Nội dung văn bản</label>
              <div class="input-with-unit">
                <input
                    type="text"
                    id="textContentFontSize"
                    v-model="settings.fontSizes.textContent"
                    placeholder="18px"
                />
                <span class="unit">px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab danh sách mục điều hướng -->
      <div v-if="activeTab === 'navItems'" class="nav-items-management">
        <div class="nav-items-container">
          <!-- Danh sách mục điều hướng -->
          <div class="nav-items-list">
            <div
                v-for="(item, index) in navItems"
                :key="item.key"
                class="nav-item"
                :class="{ active: activeNavItemIndex === index }"
                @mouseenter="hoveredNavItemIndex = index"
                @mouseleave="hoveredNavItemIndex = -1"
                @click="selectNavItem(index)"
            >
              <div class="nav-item-content">
                <div class="nav-item-icon">
                  <i class="fas fa-star"></i>
                </div>
                <div class="nav-item-info">
                  <h4>{{ item.label || 'Chưa có tên' }}</h4>
                  <p class="nav-item-key">Key: {{ item.key }}</p>
                </div>
              </div>
              <div class="nav-item-actions" v-show="hoveredNavItemIndex === index">
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeNavItem(index)"
                    :disabled="navItems.length <= 1"
                    title="Xóa mục"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div class="add-nav-item-section">
              <button class="btn btn-primary btn-add" @click="addNewNavItem">
                <i class="fas fa-plus-circle"></i> Thêm mục mới
              </button>
              <p class="add-hint">Thêm mục điều hướng mới vào hệ thống</p>
            </div>
          </div>



          <!-- Form chỉnh sửa mục điều hướng -->
          <div v-if="activeNavItem !== null" class="nav-item-editor">
            <div class="editor-header">
              <h3>Chỉnh sửa {{ activeNavItem.label || 'Mục điều hướng' }}</h3>
              <div class="editor-actions">
                <button class="btn btn-icon-only" @click="moveNavItemUp(activeNavItemIndex)"
                        :disabled="activeNavItemIndex === 0" title="Di chuyển lên">
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button class="btn btn-icon-only" @click="moveNavItemDown(activeNavItemIndex)"
                        :disabled="activeNavItemIndex === navItems.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="nav-item-key">
                <i class="fas fa-key"></i> Key
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="nav-item-key"
                  v-model="activeNavItem.key"
                  placeholder="tamnhin, sumenh, giatri"
                  :disabled="activeNavItemIndex < 3"
              />
              <p class="input-hint" v-if="activeNavItemIndex < 3">Key của 3 mục mặc định không thể thay đổi</p>
            </div>

            <div class="form-group">
              <label for="nav-item-label">
                <i class="fas fa-tag"></i> Nhãn hiển thị
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="nav-item-label"
                  v-model="activeNavItem.label"
                  placeholder="Tầm nhìn, Sứ mệnh, Giá trị cốt lõi"
              />
            </div>

            <div class="form-group">
              <label for="nav-item-title">
                <i class="fas fa-heading"></i> Tiêu đề
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="nav-item-title"
                  v-model="activeNavItem.title"
                  placeholder="Khát vọng vươn tầm – Dẫn đầu thị trường BĐS Việt Nam"
              />
            </div>

            <div class="form-group">
              <div class="label-wrapper" style="display: flex; justify-content: space-between; margin-bottom: 10px">
              <label for="nav-item-content">
                <i class="fas fa-align-left"></i> Nội dung (HTML)
                <span class="required-mark">*</span>
              </label>
              <AdvancedEditModal v-model="activeNavItem.content"/>
              </div>
              <div class="rich-text-editor-wrapper form-input">
                <div class="tiptap" v-html="activeNavItem.content"></div>
              </div>
            </div>

            <!-- SVG upload -->
            <div class="file-upload-section">
              <h4><i class="fas fa-image"></i> Hình ảnh SVG</h4>
              <div class="form-row">
                <div class="form-group">
                  <label for="svg-from">SVG ban đầu</label>
                </div>
                <div class="form-group">
                  <label for="svg-to">SVG khi hover</label>
                </div>
              </div>

              <div class="file-upload">
                <div class="file-upload-area" @click="triggerSvgInput('from')" @dragover.prevent @drop.prevent="handleSvgDrop('from')">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Tải lên SVG ban đầu</p>
                  <input type="file" ref="svgFromInput" @change="handleSvgUpload('from')" accept=".svg,image/svg+xml" style="display: none" />
                </div>

                <div class="file-upload-area" @click="triggerSvgInput('to')" @dragover.prevent @drop.prevent="handleSvgDrop('to')">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Tải <lê></lê>n SVG khi hover</p>
                  <input type="file" ref="svgToInput" @change="handleSvgUpload('to')" accept=".svg,image/svg+xml" style="display: none" />
                </div>
              </div>

              <div class="svg-previews">
                <div class="svg-preview">
                  <h5>SVG ban đầu:</h5>
                  <div class="preview-container">
                    <img :src="getImageUrl(settings.svgPaths[activeNavItem.key].from)" alt="SVG From" />
                  </div>
                </div>
                <div class="svg-preview">
                  <h5>SVG khi hover:</h5>
                  <div class="preview-container">
                    <img :src="getImageUrl(settings.svgPaths[activeNavItem.key].to)" alt="SVG To" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem trước logo -->
    <div v-if="showLogoModal" class="modal-overlay" @click="closeLogoModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xem trước logo</h3>
          <button class="btn-icon btn-close-modal" @click="closeLogoModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="getImageUrl(settings.logo)" alt="Xem trước logo" />
            <div v-if="!settings.logo" class="preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Chưa có logo để xem trước</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closeLogoModal">Đóng</button>
            <button class="btn btn-primary" @click="triggerLogoInput">Thay đổi logo</button>
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
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const navItems = ref([])
const activeNavItemIndex = ref(0)
const activeNavItem = computed(() =>
    activeNavItemIndex.value !== null && navItems.value.length > 0
        ? navItems.value[activeNavItemIndex.value]
        : null
)

const activeTab = ref('general')
const hoveredNavItemIndex = ref(-1)

// ========== NAV ITEM MANAGEMENT ==========
const addNewNavItem = () => {
  // Tạo key duy nhất
  const baseKey = 'mucmoi'
  let key = baseKey
  let counter = 1

  // Kiểm tra xem key đã tồn tại chưa
  while (navItems.value.some(item => item.key === key)) {
    key = `${baseKey}_${counter}`
    counter++
  }

  // Tạo mục mới
  const newItem = {
    key: key,
    label: 'Mục mới',
    title: 'Tiêu đề mục mới',
    content: 'Nội dung mục mới'
  }

  // Thêm vào danh sách
  navItems.value.push(newItem)

  // Khởi tạo SVG paths cho mục mới
  if (!settings.svgPaths[key]) {
    settings.svgPaths[key] = {
      from: '',
      to: ''
    }
  }

  // Chọn mục mới
  activeNavItemIndex.value = navItems.value.length - 1

  // Cuộn đến mục mới
  setTimeout(() => {
    const navItemElement = document.querySelector(`.nav-item:nth-child(${navItems.value.length})`)
    if (navItemElement) {
      navItemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, 100)

  showToast('Đã thêm mục mới thành công', 'success')
}

const removeNavItem = (index) => {
  if (navItems.value.length <= 1) {
    showToast('Không thể xóa mục cuối cùng', 'warning')
    return
  }

  const item = navItems.value[index]

  // Remove SVG paths for this item
  if (settings.svgPaths[item.key]) {
    // Nếu là mục mới với SVG tạm thời, xóa file tạm
    const svgFromPath = settings.svgPaths[item.key].from
    const svgToPath = settings.svgPaths[item.key].to

    if (svgFromPath && svgFromPath.startsWith(TEMP_PREFIX)) {
      removeTempFile(svgFromPath)
    }

    if (svgToPath && svgToPath.startsWith(TEMP_PREFIX)) {
      removeTempFile(svgToPath)
    }

    delete settings.svgPaths[item.key]
  }

  navItems.value.splice(index, 1)

  if (activeNavItemIndex.value >= navItems.value.length) {
    activeNavItemIndex.value = navItems.value.length - 1
  }

  showToast('Đã xóa mục', 'success')
}

// Thêm phương thức helper để xóa file tạm
const removeTempFile = (tempPath) => {
  const tempName = tempPath.replace(TEMP_PREFIX, '')

  // Xóa khỏi files array
  const fileIndex = files.value.findIndex(f => f.tempName === tempName)
  if (fileIndex !== -1) {
    files.value.splice(fileIndex, 1)
  }

  // Xóa khỏi uploadedFiles
  const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
  if (uploadedIndex !== -1) {
    uploadedFiles.value.splice(uploadedIndex, 1)
  }
}

// Settings object with structure from JSON
const settings = reactive({
  logo: "/imgs/logoTHG.png",
  colors: {
    primary: "#031358",
    secondary: "#0629BE",
    accent: "#6C63FF",
    text: "#333",
    white: "#FFFFFF"
  },
  navItems: [],
  svgPaths: {
    tamnhin: {
      from: "/imgs/svg-tamnhin.svg",
      to: "/imgs/svg-tamnhin-1.svg"
    },
    sumenh: {
      from: "/imgs/svg-sumenh.svg",
      to: "/imgs/svg-sumenh-1.svg"
    },
    giatri: {
      from: "/imgs/svg-giatri.svg",
      to: "/imgs/svg-giatri-1.svg"
    }
  },
  layout: {
    containerHeight: "90vh",
    containerMinHeight: "600px",
    containerMaxHeight: "800px",
    containerMaxWidth: "1400px",
    leftColumnWidth: "400px",
    svgMaxWidth: "500px",
    svgHeight: "250px",
    textMaxWidth: "900px",
    navItemHeight: "85px"
  },
  fontSizes: {
    title: "26px",
    navItem: "20px",
    textContent: "18px"
  }
})

// UI State
const isLoading = ref(false)
const logoPreview = ref(null)
const svgPreviews = ref({})
const showLogoModal = ref(false)

// File management
const files = ref([])
const logoInput = ref(null)
const svgFromInput = ref(null)
const svgToInput = ref(null)
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
  if (!originalFilename) return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.svg`;

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalFilename.split('.').pop() || 'svg';
  return `temp_${timestamp}_${random}.${extension}`;
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/5')

    if (response.data && response.data.contentJson) {
      const content = JSON.parse(response.data.contentJson)

      // Load settings
      if (content.logo) settings.logo = content.logo
      if (content.colors) Object.assign(settings.colors, content.colors)
      if (content.svgPaths) Object.assign(settings.svgPaths, content.svgPaths)
      if (content.layout) Object.assign(settings.layout, content.layout)
      if (content.fontSizes) Object.assign(settings.fontSizes, content.fontSizes)

      // Load nav items
      if (content.navItems && Array.isArray(content.navItems)) {
        navItems.value = content.navItems.map(item => ({
          key: item.key || '',
          label: item.label || '',
          title: item.title || '',
          content: item.content || ''
        }))
      } else {
        // Default nav items
        navItems.value = [
          {
            key: 'tamnhin',
            label: 'Tầm nhìn',
            title: 'Khát vọng vươn tầm – Dẫn đầu thị trường BĐS Việt Nam',
            content: '<b>Thiên Hà Group</b> hướng đến trở thành đơn vị tư vấn mua bán và đầu tư bất động sản uy tín hàng đầu Việt Nam, mang đến cho khách hàng những giá trị bền vững và khác biệt.'
          },
          {
            key: 'sumenh',
            label: 'Sứ mệnh',
            title: 'Kiến tạo giá trị thật – Gắn kết niềm tin thật',
            content: 'Với sứ mệnh <b>"Bất động sản thật – Giá trị thật"</b>, Thiên Hà Group cam kết mang đến giải pháp bán nhanh, an toàn và hiệu quả.'
          },
          {
            key: 'giatri',
            label: 'Giá trị cốt lõi',
            title: 'Con người – Kinh nghiệm – Niềm tin tạo nên thành công',
            content: '<b>Thiên Hà Group</b> sở hữu đội ngũ chuyên nghiệp, giàu kinh nghiệm hơn 15 năm cùng hơn 500 giao dịch thành công.'
          }
        ]
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
      ...settings,
      navItems: navItems.value
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: 5,
      name: 'Tổng quan',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 4,
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
      svgPreviews.value = {}

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

// ========== NAV ITEM MANAGEMENT ==========
const selectNavItem = (index) => {
  activeNavItemIndex.value = index
}

const moveNavItemUp = (index) => {
  if (index > 0) {
    const temp = navItems.value[index]
    navItems.value[index] = navItems.value[index - 1]
    navItems.value[index - 1] = temp
    activeNavItemIndex.value = index - 1
    showToast('Đã di chuyển mục lên', 'success')
  }
}

const moveNavItemDown = (index) => {
  if (index < navItems.value.length - 1) {
    const temp = navItems.value[index]
    navItems.value[index] = navItems.value[index + 1]
    navItems.value[index + 1] = temp
    activeNavItemIndex.value = index + 1
    showToast('Đã di chuyển mục xuống', 'success')
  }
}

// const removeNavItem = (index) => {
//   if (navItems.value.length <= 1) {
//     showToast('Không thể xóa mục cuối cùng', 'warning')
//     return
//   }
//
//   const item = navItems.value[index]
//
//   // Remove SVG paths for this item
//   if (settings.svgPaths[item.key]) {
//     delete settings.svgPaths[item.key]
//   }
//
//   navItems.value.splice(index, 1)
//
//   if (activeNavItemIndex.value >= navItems.value.length) {
//     activeNavItemIndex.value = navItems.value.length - 1
//   }
//
//   showToast('Đã xóa mục', 'success')
// }

// ========== LOGO UPLOAD MANAGEMENT ==========
const triggerLogoInput = () => {
  logoInput.value?.click()
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const maxSize = 5 * 1024 * 1024

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

    // Handle old logo
    if (settings.logo && settings.logo.startsWith(TEMP_PREFIX)) {
      const oldTempName = settings.logo.replace(TEMP_PREFIX, '')
      const fileIndex = files.value.findIndex(f => f.tempName === oldTempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === oldTempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else if (settings.logo) {
      const fileIndex = files.value.findIndex(f => f.filename === settings.logo)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    // Update settings
    settings.logo = tempUrl
    logoPreview.value = previewUrl

    // Create file DTO
    const fileDTO = {
      id: null,
      filename: `logo_${file.name}`,
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

    showToast('Logo đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const handleLogoDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleLogoUpload(fakeEvent)
  }
}

const removeLogo = () => {
  if (settings.logo) {
    if (settings.logo.startsWith(TEMP_PREFIX)) {
      const tempName = settings.logo.replace(TEMP_PREFIX, '')

      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else {
      const fileIndex = files.value.findIndex(f => f.filename === settings.logo)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    settings.logo = ''
    logoPreview.value = null

    showToast('Đã xóa logo', 'success')
  }
}

const previewLogo = () => {
  if (settings.logo) {
    showLogoModal.value = true
  } else {
    showToast('Không có logo để xem trước', 'warning')
  }
}

const closeLogoModal = () => {
  showLogoModal.value = false
}

// ========== SVG UPLOAD MANAGEMENT ==========
const triggerSvgInput = (type) => {
  if (type === 'from') {
    svgFromInput.value?.click()
  } else {
    svgToInput.value?.click()
  }
}

const handleSvgUpload = (type) => {
  const fileInput = type === 'from' ? svgFromInput.value : svgToInput.value
  const file = fileInput.files[0]
  if (!file) return

  // Check if it's an SVG file
  if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
    showToast('Chỉ chấp nhận file SVG', 'error')
    return
  }

  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    showToast('Kích thước file SVG không được vượt quá 2MB', 'error')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    if (!activeNavItem.value) {
      showToast('Vui lòng chọn một mục điều hướng trước', 'warning')
      return
    }

    const key = activeNavItem.value.key
    const currentPath = type === 'from' ? settings.svgPaths[key].from : settings.svgPaths[key].to

    // Handle old SVG
    if (currentPath && currentPath.startsWith(TEMP_PREFIX)) {
      const oldTempName = currentPath.replace(TEMP_PREFIX, '')
      const fileIndex = files.value.findIndex(f => f.tempName === oldTempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === oldTempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else if (currentPath) {
      const fileIndex = files.value.findIndex(f => f.filename === currentPath)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    // Update settings
    if (type === 'from') {
      settings.svgPaths[key].from = tempUrl
    } else {
      settings.svgPaths[key].to = tempUrl
    }

    // Initialize svgPreviews for this key if not exists
    if (!svgPreviews.value[key]) {
      svgPreviews.value[key] = {}
    }
    svgPreviews.value[key][type] = previewUrl

    // Create file DTO
    const fileDTO = {
      id: null,
      filename: `${key}_${type}_${file.name}`,
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

    showToast(`SVG ${type === 'from' ? 'ban đầu' : 'hover'} đã được tải lên thành công`, 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file SVG', 'error')
  }

  reader.readAsDataURL(file)
  fileInput.value = ''
}

const handleSvgDrop = (type, event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeInput = document.createElement('input')
    fakeInput.type = 'file'
    fakeInput.files = event.dataTransfer.files
    const fakeEvent = { target: fakeInput }

    if (type === 'from') {
      handleSvgUpload('from')
    } else {
      handleSvgUpload('to')
    }
  }
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.overview-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Add Nav Item Section */
.add-nav-item-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.btn-add {
  width: 100%;
  justify-content: center;
  padding: 14px 20px;
  font-size: 1rem;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
}

.btn-add:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 108, 247, 0.4);
}

.btn-add i {
  font-size: 1.1rem;
}

.add-hint {
  margin-top: 8px;
  color: #6c757d;
  font-size: 0.85rem;
  margin-bottom: 0;
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
  padding: 30px;
  background-color: white;
  min-height: 500px;
}

/* General Settings */
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

.setting-section h3 i {
  color: #4a6cf7;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-group .form-input {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px ;
  background-color: white;
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
.form-group textarea:focus,
.form-group select:focus {
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
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

/* Input Hint */
.input-hint {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 5px;
  margin-bottom: 0;
}

/* Nav Items Management */
.nav-items-management {
  display: flex;
  gap: 30px;
}

.nav-items-container {
  display: flex;
  gap: 30px;
  width: 100%;
}

.nav-items-list {
  flex: 1;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.nav-item-editor {
  flex: 2;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e9ecef;
}

/* Nav Item - Simplified List */
.nav-item {
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
}

.nav-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e9ecef;
}

.nav-item.active {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.nav-item-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
}

.nav-item-info {
  flex: 1;
  min-width: 0;
}

.nav-item-info h4 {
  margin: 0 0 4px 0;
  color: #031358;
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item-key {
  margin: 0;
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: 500;
}

.nav-item-actions {
  flex-shrink: 0;
  margin-left: 10px;
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

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Nav Item Editor */
.nav-item-editor .editor-header {
  background: none;
  color: inherit;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-item-editor .editor-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
}

.editor-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* File Upload */
.file-upload-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.file-upload-section h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-upload {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.file-upload.compact .file-upload-area {
  padding: 20px;
  width: 100%;
}

.file-upload.compact .file-upload-area i {
  font-size: 2rem;
  margin-bottom: 8px;
}

.file-upload.compact .file-upload-area p {
  font-size: 0.9rem;
}

.file-upload-area {
  border: 2px dashed #ced4da;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  flex: 1;
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
  font-size: 0.9rem;
}

.file-upload-area span {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
}

.upload-preview {
  position: relative;
  width: 100%;
  max-width: 300px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  margin-top: 15px;
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: white;
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

/* SVG Upload Section */
.svg-previews {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.svg-preview {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e9ecef;
}

.svg-preview h5 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 600;
}

.preview-container {
  width: 100%;
  height: 150px;
  border: 1px dashed #dee2e6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  overflow: hidden;
}

.preview-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  padding: 10px;
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
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
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
  padding: 20px;
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
  .nav-items-container {
    flex-direction: column;
  }

  .nav-items-list {
    max-width: 100%;
    max-height: 300px;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .svg-previews {
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

  .nav-item-editor .editor-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .editor-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .file-upload {
    flex-direction: column;
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

  .nav-item {
    padding: 10px 12px;
  }

  .nav-item-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .modal-content {
    width: 95%;
    margin: 10px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions .btn {
    width: 100%;
  }

  .toast-notification {
    left: 10px;
    right: 10px;
    bottom: 10px;
    max-width: none;
  }
}

/* Custom scrollbar */
.nav-items-list::-webkit-scrollbar,
.tab-content::-webkit-scrollbar {
  width: 6px;
}

.nav-items-list::-webkit-scrollbar-track,
.tab-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.nav-items-list::-webkit-scrollbar-thumb,
.tab-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.nav-items-list::-webkit-scrollbar-thumb:hover,
.tab-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Loading state */
.btn:disabled {
  position: relative;
}

.btn:disabled::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Focus states for accessibility */
.btn:focus,
.tab-button:focus,
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: 2px solid #4a6cf7;
  outline-offset: 2px;
}

/* Transition for smooth hover effects */
.nav-item,
.btn,
.tab-button,
.file-upload-area,
.color-input input[type="color"] {
  transition: all 0.2s ease-in-out;
}



/* Placeholder styling */
::placeholder {
  color: #adb5bd;
  opacity: 0.8;
}

/* Selection styling */
::selection {
  background-color: rgba(74, 108, 247, 0.2);
  color: #031358;
}
</style>