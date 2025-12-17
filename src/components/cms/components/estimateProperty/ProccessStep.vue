<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Các bước quy trình - CSS Config</h2>
      <div class="header-controls">
        <button class="btn btn-primary" @click="saveChanges" :disabled="isLoading">
          <i class="fas fa-save"></i> {{ isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="tab-content">
      <div class="settings-grid">
        <!-- Circle Settings -->
        <div class="setting-section">
          <h3><i class="fas fa-circle"></i> Vòng tròn số thứ tự</h3>

          <div class="color-input-group">
            <label>Màu viền vòng tròn</label>
            <div class="color-input form-group">
              <input type="color" v-model="content.circle.borderColor" />
              <input type="text" v-model="content.circle.borderColor" placeholder="#002FFF" />
            </div>
          </div>

          <div class="color-input-group">
            <label>Màu số thứ tự</label>
            <div class="color-input form-group">
              <input type="color" v-model="content.circle.color" />
              <input type="text" v-model="content.circle.color" placeholder="#002FFF" />
            </div>
          </div>

          <div class="color-input-group">
            <label>Màu nền vòng tròn</label>
            <div class="color-input form-group">
              <input type="color" v-model="content.circle.backgroundColor" />
              <input type="text" v-model="content.circle.backgroundColor" placeholder="white" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="circle-border-width">Độ dày viền</label>
              <div class="input-with-unit">
                <input type="text" id="circle-border-width" v-model="content.circle.borderWidth" placeholder="2px" />
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="circle-font-size">Kích thước chữ</label>
              <div class="input-with-unit">
                <input type="text" id="circle-font-size" v-model="content.circle.fontSize" placeholder="20px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="circle-width">Chiều rộng</label>
              <div class="input-with-unit">
                <input type="text" id="circle-width" v-model="content.circle.width" placeholder="60px" />
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="circle-height">Chiều cao</label>
              <div class="input-with-unit">
                <input type="text" id="circle-height" v-model="content.circle.height" placeholder="60px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Title Settings -->
        <div class="setting-section">
          <h3><i class="fas fa-heading"></i> Tiêu đề bước</h3>

          <div class="color-input-group">
            <label>Màu chữ tiêu đề</label>
            <div class="color-input form-group">
              <input type="color" v-model="content.title.color" />
              <input type="text" v-model="content.title.color" placeholder="#031358" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="title-font-size">Kích thước chữ</label>
              <div class="input-with-unit">
                <input type="text" id="title-font-size" v-model="content.title.fontSize" placeholder="20px" />
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="title-height">Chiều cao</label>
              <div class="input-with-unit">
                <input type="text" id="title-height" v-model="content.title.height" placeholder="68px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="title-padding-left">Padding trái</label>
            <div class="input-with-unit">
              <input type="text" id="title-padding-left" v-model="content.title.paddingLeft" placeholder="70px" />
              <span class="unit">px</span>
            </div>
          </div>
        </div>

        <!-- Border Settings -->
        <div class="setting-section">
          <h3><i class="fas fa-border-style"></i> Border tiêu đề</h3>

          <div class="color-input-group">
            <label>Màu border dưới</label>
            <div class="color-input form-group">
              <input type="color" v-model="content.border.borderBottomColor" />
              <input type="text" v-model="content.border.borderBottomColor" placeholder="#002FFF" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="border-bottom-width">Độ dày border dưới</label>
              <div class="input-with-unit">
                <input type="text" id="border-bottom-width" v-model="content.border.borderBottomWidth" placeholder="5px" />
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="border-height">Chiều cao</label>
              <div class="input-with-unit">
                <input type="text" id="border-height" v-model="content.border.height" placeholder="68px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="border-radius-right-bottom">Bo góc phải dưới</label>
            <div class="input-with-unit">
              <input type="text" id="border-radius-right-bottom" v-model="content.border.borderBottomRightRadius" placeholder="32px" />
              <span class="unit">px</span>
            </div>
          </div>
        </div>

        <!-- Icon Settings -->
        <div class="setting-section">
          <h3><i class="fas fa-icons"></i> Icon</h3>

          <div class="color-input-group">
            <label>Màu icon</label>
            <div class="color-input form-group">
              <input type="color" v-model="content.icon.color" />
              <input type="text" v-model="content.icon.color" placeholder="#002FFF" />
            </div>
          </div>

          <div class="form-group">
            <label for="icon-font-size">Kích thước icon</label>
            <div class="input-with-unit">
              <input type="text" id="icon-font-size" v-model="content.icon.fontSize" placeholder="40px" />
              <span class="unit">px</span>
            </div>
          </div>
        </div>

        <!-- Dashed Line Settings -->
        <div class="setting-section">
          <h3><i class="fas fa-grip-lines-vertical"></i> Đường kẻ đứt nối bước</h3>

          <div class="color-input-group">
            <label>Màu đường kẻ</label>
            <div class="color-input form-group">
              <input type="color" v-model="dashedLineColor" />
              <input type="text" v-model="dashedLineColor" placeholder="#002FFF" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="dashed-line-height">Chiều cao</label>
              <div class="input-with-unit">
                <input type="text" id="dashed-line-height" v-model="content.dashedLine.height" placeholder="50px" />
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="dashed-line-left">Vị trí trái</label>
              <div class="input-with-unit">
                <input type="text" id="dashed-line-left" v-model="content.dashedLine.left" placeholder="76px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="dashed-line-top">Vị trí trên</label>
            <div class="input-with-unit">
              <input type="text" id="dashed-line-top" v-model="content.dashedLine.top" placeholder="-30px" />
              <span class="unit">px</span>
            </div>
          </div>
        </div>

        <!-- Content Settings -->
        <div class="setting-section">
          <h3><i class="fas fa-align-left"></i> Nội dung bước</h3>

          <div class="color-input-group">
            <label>Màu nền nội dung</label>
            <div class="color-input form-group">
              <input type="color" v-model="content.content.backgroundColor" />
              <input type="text" v-model="content.content.backgroundColor" placeholder="white" />
            </div>
          </div>

          <div class="color-input-group">
            <label>Màu chữ nội dung</label>
            <div class="color-input form-group">
              <input type="color" v-model="content.content.color" />
              <input type="text" v-model="content.content.color" placeholder="#031358" />
            </div>
          </div>

          <div class="form-group">
            <label for="content-font-size">Kích thước chữ</label>
            <div class="input-with-unit">
              <input type="text" id="content-font-size" v-model="content.content.fontSize" placeholder="17px" />
              <span class="unit">px</span>
            </div>
          </div>

          <div class="form-group">
            <label for="content-padding">Padding</label>
            <input
                type="text"
                id="content-padding"
                v-model="content.content.padding"
                placeholder="20px"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="content-margin-top">Khoảng cách trên</label>
              <div class="input-with-unit">
                <input type="text" id="content-margin-top" v-model="content.content.marginTop" placeholder="30px" />
                <span class="unit">px</span>
              </div>
            </div>
            <div class="form-group">
              <label for="content-margin-left">Khoảng cách trái</label>
              <div class="input-with-unit">
                <input type="text" id="content-margin-left" v-model="content.content.marginLeft" placeholder="30px" />
                <span class="unit">px</span>
              </div>
            </div>
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
const isLoading = ref(false)

// Parse dashedLine border to get color
const parseDashedLineColor = (borderLeft) => {
  if (!borderLeft) return '#002FFF'
  const match = borderLeft.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/)
  return match ? match[0] : '#002FFF'
}

// Extract border properties from dashedLine
const extractDashedLineProperties = (dashedLine) => {
  if (!dashedLine) return { height: '50px', left: '76px', top: '-30px', borderLeft: '2px dashed #002FFF' }

  return {
    height: dashedLine.height || '50px',
    left: dashedLine.left || '76px',
    top: dashedLine.top || '-30px',
    borderLeft: dashedLine.borderLeft || '2px dashed #002FFF'
  }
}

// Content structure based on new JSON data
const content = reactive({
  circle: {
    borderColor: '#002FFF',
    color: '#002FFF',
    backgroundColor: 'white',
    borderWidth: '2px',
    fontSize: '20px',
    width: '60px',
    height: '60px'
  },
  title: {
    color: '#031358',
    fontSize: '20px',
    height: '68px',
    paddingLeft: '70px'
  },
  border: {
    borderBottomColor: '#002FFF',
    borderBottomWidth: '5px',
    borderBottomRightRadius: '32px',
    height: '68px'
  },
  icon: {
    fontSize: '40px',
    color: '#002FFF'
  },
  dashedLine: {
    borderLeft: '2px dashed #002FFF',
    height: '50px',
    left: '76px',
    top: '-30px'
  },
  content: {
    backgroundColor: 'white',
    color: '#031358',
    fontSize: '17px',
    padding: '20px',
    marginTop: '30px',
    marginLeft: '30px'
  }
})

// Computed property for dashed line color
const dashedLineColor = computed({
  get() {
    return parseDashedLineColor(content.dashedLine.borderLeft)
  },
  set(value) {
    const parts = content.dashedLine.borderLeft.split(' ')
    if (parts.length >= 3) {
      parts[2] = value
      content.dashedLine.borderLeft = parts.join(' ')
    } else {
      content.dashedLine.borderLeft = `2px dashed ${value}`
    }
  }
})

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// ========== CONSTANTS ==========
const SECTION_ID = 35

// ========== HELPER FUNCTIONS ==========
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

      // Ensure dashedLine is properly parsed
      if (data.dashedLine) {
        const dashedLineProps = extractDashedLineProperties(data.dashedLine)
        content.dashedLine = dashedLineProps
      }

      showToast('Dữ liệu CSS đã được tải thành công', 'success')
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

    // Prepare content data - chỉ lưu CSS config
    const contentData = { ...content }

    // Prepare FormData
    const formData = new FormData()

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Các bước quy trình',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 7,
      files: []
    }

    // Add section data
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }))

    // Send to API
    const response = await api.post('/cms/saveChange', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data) {
      showToast('Cấu hình CSS đã được lưu thành công', 'success')
      await loadData()
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Lỗi khi lưu thay đổi: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    isLoading.value = false
  }
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
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