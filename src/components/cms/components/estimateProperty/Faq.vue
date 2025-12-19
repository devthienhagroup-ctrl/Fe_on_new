<template>
  <div class="faq-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý FAQ</h2>
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
          :class="{ active: activeTab === 'header' }"
          @click="activeTab = 'header'"
      >
        <i class="fas fa-heading"></i> Header & Cấu hình
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'items' }"
          @click="activeTab = 'items'"
      >
        <i class="fas fa-question-circle"></i> Câu hỏi ({{ content.faqConfig.items.length }})
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'style' }"
          @click="activeTab = 'style'"
      >
        <i class="fas fa-palette"></i> Kiểu dáng & Style
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Header & Cấu hình -->
      <div v-if="activeTab === 'header'" class="header-settings">
        <div class="">
          <div class="setting-section">
            <h3><i class="fas fa-cog"></i> Cấu hình Header</h3>

            <div class="form-group">
              <label for="header-title">Tiêu đề FAQ</label>
              <input
                  type="text"
                  id="header-title"
                  v-model="content.faqConfig.header.title"
                  placeholder="Các câu hỏi thường gặp"
              />
            </div>

            <div class="color-input-group">
              <label>Màu tiêu đề</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.faqConfig.header.titleColor" />
                <input type="text" v-model="content.faqConfig.header.titleColor" placeholder="#002FFF" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu border</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.faqConfig.header.borderColor" />
                <input type="text" v-model="content.faqConfig.header.borderColor" placeholder="#002FFF" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ dấu hỏi (?):</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.faqConfig.header.questionMarkColor" />
                <input type="text" v-model="content.faqConfig.header.questionMarkColor" placeholder="#002FFF" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ bên trong dấu hỏi</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.faqConfig.header.questionMarkTextColor" />
                <input type="text" v-model="content.faqConfig.header.questionMarkTextColor" placeholder="#FFFFFF" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Câu hỏi -->
      <div v-if="activeTab === 'items'" class="items-settings">
        <div class="">
          <!-- Danh sách câu hỏi -->
          <div class="setting-section full-width">
            <h3><i class="fas fa-list"></i> Quản lý Câu hỏi</h3>

            <div class="faq-items-list">
              <div
                  v-for="(item, index) in content.faqConfig.items"
                  :key="item.id || index"
                  class="faq-item-editor"
                  :class="{ 'is-active': item.isOpen }"
              >
                <div class="faq-item-header" @click="toggleFAQItem(index)">
                  <div class="faq-item-title">
                    <span class="item-number">{{ index + 1 }}.</span>
                    <input
                        type="text"
                        v-model="item.text"
                        placeholder="Nhập câu hỏi..."
                        @click.stop
                        class="faq-question-input"
                    />
                  </div>
                  <div class="faq-item-actions">
                    <button
                        class="btn-icon btn-move-up"
                        @click.stop="moveItemUp(index)"
                        :disabled="index === 0"
                        title="Di chuyển lên"
                    >
                      <i class="fas fa-arrow-up"></i>
                    </button>
                    <button
                        class="btn-icon btn-move-down"
                        @click.stop="moveItemDown(index)"
                        :disabled="index === content.faqConfig.items.length - 1"
                        title="Di chuyển xuống"
                    >
                      <i class="fas fa-arrow-down"></i>
                    </button>
                    <button
                        class="btn-icon btn-delete"
                        @click.stop="removeFAQItem(index)"
                        title="Xóa câu hỏi"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                    <button
                        class="btn-icon btn-toggle"
                        @click.stop="toggleFAQItem(index)"
                        :title="item.isOpen ? 'Thu gọn' : 'Mở rộng'"
                    >
                      <i :class="item.isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                    </button>
                  </div>
                </div>

                <div class="faq-item-content" v-show="item.isOpen">
                  <div class="form-group">
                    <div class="label" style="display: flex; justify-content: space-between">
                      <label for="card-content">Câu trả lời</label>
                      <AdvancedEditModal
                          v-model="item.answer"
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
                      <div class="tiptap" v-html="item.answer"></div>
                    </div>
                  </div>

                  <!-- Action Settings -->
                  <div class="action-settings">
                    <h4><i class="fas fa-link"></i> Cấu hình Action/Link</h4>

                    <div class="form-check-inline">
                      <input
                          type="checkbox"
                          v-model="item.hasAction"
                          @change="toggleActionField(item)"
                      />
                      <label>

                        <span>Có action/link trong câu trả lời</span>
                      </label>
                    </div>

                    <div v-if="item.hasAction" class="action-fields">
                      <div class="form-row">
                        <div class="form-group">
                          <label for="action-type">Loại Action</label>
                          <select
                              id="action-type"
                              v-model="item.action.type"
                              @change="updateActionLinkText(item)"
                          >
                            <option value="">-- Chọn loại action --</option>
                            <option value="valuation">Định giá</option>
                            <option value="contact">Liên hệ</option>
                            <option value="criteria">Tiêu chí</option>
                            <option value="pricing">Bảng giá</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>

                        <div class="form-group">
                          <label for="action-link-text">Văn bản link</label>
                          <input
                              type="text"
                              id="action-link-text"
                              v-model="item.action.linkText"
                              placeholder="Nhập văn bản hiển thị..."
                          />
                        </div>
                      </div>

                      <div class="form-row">

                        <div class="form-group">
                          <label for="action-position">Vị trí link</label>
                          <select id="action-position" v-model="item.action.position">
                            <option value="end">Cuối câu trả lời</option>
                            <option value="start">Đầu câu trả lời</option>
                            <option value="custom">Vị trí tùy chỉnh</option>
                          </select>
                        </div>

                        <div class="form-group">
                          <label for="action-target">Target</label>
                          <select id="action-target" v-model="item.action.target">
                            <option value="_self">Mở trong tab hiện tại</option>
                            <option value="_blank">Mở tab mới</option>
                          </select>
                        </div>
                      </div>

                      <div class="form-group" v-if="item.action.type === 'custom'">
                        <label for="action-url">URL (nếu là custom)</label>
                        <input
                            type="text"
                            id="action-url"
                            v-model="item.action.url"
                            placeholder="https://..."
                        />
                      </div>



                    </div>
                  </div>

                  <div class="form-row">
                    <div class="color-input-group">
                      <label>Màu nền mặc định</label>
                      <div class="color-input form-group">
                        <input type="color" v-model="item.backgroundColor" />
                        <input type="text" v-model="item.backgroundColor" placeholder="#FFFFFF" />
                      </div>
                    </div>

                    <div class="color-input-group">
                      <label>Màu chữ mặc định</label>
                      <div class="color-input form-group">
                        <input type="color" v-model="item.textColor" />
                        <input type="text" v-model="item.textColor" placeholder="#333333" />
                      </div>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="color-input-group">
                      <label>Màu nền khi active</label>
                      <div class="color-input form-group">
                        <input type="color" v-model="item.activeBackgroundColor" />
                        <input type="text" v-model="item.activeBackgroundColor" placeholder="#FFFFFF" />
                      </div>
                    </div>

                    <div class="color-input-group">
                      <label>Màu chữ khi active</label>
                      <div class="color-input form-group">
                        <input type="color" v-model="item.activeTextColor" />
                        <input type="text" v-model="item.activeTextColor" placeholder="#031358" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="content.faqConfig.items.length === 0" class="empty-state">
                <i class="fas fa-question-circle"></i>
                <p>Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!</p>
                <button class="btn btn-primary" @click="addFAQItem">
                  <i class="fas fa-plus"></i> Thêm Câu Hỏi
                </button>
              </div>
            </div>

            <div class="add-item-footer">
              <button class="btn btn-primary" @click="addFAQItem">
                <i class="fas fa-plus"></i> Thêm Câu Hỏi Mới
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Kiểu dáng & Style -->
      <div v-if="activeTab === 'style'" class="style-settings">
        <div class="">
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Cài đặt Style</h3>

            <div class="form-group">
              <label for="container-max-width">Chiều rộng tối đa container</label>
              <div class="input-with-unit">
                <input
                    type="text"
                    id="container-max-width"
                    v-model="content.faqConfig.style.containerMaxWidth"
                    placeholder="1400px"
                />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="item-border-radius">Bo góc item</label>
              <div class="input-with-unit">
                <input
                    type="text"
                    id="item-border-radius"
                    v-model="content.faqConfig.style.itemBorderRadius"
                    placeholder="20px"
                />
                <span class="unit">px</span>
              </div>
            </div>

            <!-- Trong phần Tab Kiểu dáng & Style -->
            <div class="form-group">
              <label for="item-shadow">Box shadow item</label>
              <div class="simple-shadow-inputs">
                <div class="color-input">
                  <input
                      type="color"
                      v-model="shadowColor"
                      @input="updateBoxShadowFromColor"
                  />
                  <input
                      type="text"
                      v-model="content.faqConfig.style.itemShadow"
                      placeholder="0 2px 10px rgba(0, 0, 0, 0.1)"
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="transition-duration">Thời gian transition</label>
              <div class="input-with-unit">
                <input
                    type="text"
                    id="transition-duration"
                    v-model="content.faqConfig.style.transitionDuration"
                    placeholder="0.3s"
                />
                <span class="unit">s</span>
              </div>
            </div>


            <div class="color-input-group">
              <label>Màu link</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.faqConfig.style.linkColor" />
                <input type="text" v-model="content.faqConfig.style.linkColor" placeholder="#002FFF" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu link hover</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.faqConfig.style.linkHoverColor" />
                <input type="text" v-model="content.faqConfig.style.linkHoverColor" placeholder="#0020CC" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu đường gạch ngang</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.faqConfig.style.dashedLineColor" />
                <input type="text" v-model="content.faqConfig.style.dashedLineColor" placeholder="#2F56AE" />
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
import { ref, reactive, onMounted, watch } from 'vue'
import api from '../../../../api/api.js'
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";

const shadowColor = ref('#000000')

// Tách màu từ rgba
const updateBoxShadowFromColor = () => {
  const shadowText = content.faqConfig.style.itemShadow
  // Tìm phần rgba trong shadow
  const rgbaMatch = shadowText.match(/rgba?\(([^)]+)\)/)

  if (rgbaMatch) {
    const rgba = rgbaMatch[0]
    // Lấy opacity từ rgba cũ
    const oldParts = rgba.replace('rgba(', '').replace(')', '').split(',')
    const opacity = oldParts.length === 4 ? oldParts[3].trim() : '0.1'

    // Chuyển hex sang RGB
    const hex = shadowColor.value.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    // Tạo rgba mới
    const newRgba = `rgba(${r}, ${g}, ${b}, ${opacity})`

    // Thay thế rgba cũ bằng mới
    content.faqConfig.style.itemShadow = shadowText.replace(rgba, newRgba)
  } else {
    // Nếu không có rgba, tạo mới với opacity 0.1
    const hex = shadowColor.value.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    content.faqConfig.style.itemShadow = `0 2px 10px rgba(${r}, ${g}, ${b}, 0.1)`
  }
}

// ========== STATE MANAGEMENT ==========
const activeTab = ref('header')
const isLoading = ref(false)

// Content structure based on FAQ JSON data
const content = reactive({
  faqConfig: {
    header: {
      title: "Các câu hỏi thường gặp",
      borderColor: "#002FFF",
      titleColor: "#002FFF",
      questionMarkColor: "#002FFF",
      questionMarkTextColor: "#FFFFFF"
    },
    items: [
      {
        id: 1,
        text: "Hướng dẫn sử dụng công cụ định giá?",
        answer: "Quý khách hãy truy cập vào trang định giá (ngay trên menu của bạn hoặc nhấn vào nút dưới đây), Quý khách tiếp tục nhấn vào nút \"Định giá ngay\". Tại đó quý khách cần cung cấp đầy đủ các thông tin được yêu cầu về tài sản để nhận được kết quả định giá tài sản.",
        isOpen: false,
        backgroundColor: "#FFFFFF",
        textColor: "#333333",
        activeTextColor: "#031358",
        activeBackgroundColor: "#FFFFFF",
        hasAction: true,
        action: {
          type: "valuation",
          linkText: "Đến trang định giá",
          linkClass: "highlight-link",
          position: "end",
          url: "",
          target: "_self",
          rel: "noopener noreferrer"
        }
      },
      {
        id: 2,
        text: "Biểu phí tư vấn giá?",
        answer: "Nếu quý khách đang nói về tư vấn cơ bản, việc trao đổi qua form hoặc liên hệ trực tiếp thường không mất phí. Riêng các gói tư vấn chuyên sâu sẽ có báo giá cụ thể khi quý khách để lại thông tin.",
        isOpen: false,
        backgroundColor: "#FFFFFF",
        textColor: "#333333",
        activeTextColor: "#031358",
        activeBackgroundColor: "#FFFFFF",
        hasAction: true,
        action: {
          type: "contact",
          linkText: "Liên hệ ngay",
          linkClass: "highlight-link",
          position: "end",
          url: "",
          target: "_self",
          rel: "noopener noreferrer"
        }
      }
    ],
    style: {
      containerMaxWidth: "1400px",
      itemBorderRadius: "20px",
      itemShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      linkColor: "#002FFF",
      linkHoverColor: "#0020CC",
      dashedLineColor: "#2F56AE",
      transitionDuration: "0.3s",
      mobileBreakpoint: "768px"
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
const SECTION_ID = 34

// Action type mapping to default link texts
const actionTypeDefaults = {
  valuation: "Đến trang định giá",
  contact: "Liên hệ ngay",
  criteria: "Xem chi tiết",
  pricing: "tại đây",
  custom: "Tìm hiểu thêm"
}

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

// Cập nhật văn bản link mặc định khi chọn loại action
const updateActionLinkText = (item) => {
  if (item.action.type && actionTypeDefaults[item.action.type]) {
    if (!item.action.linkText || item.action.linkText === '') {
      item.action.linkText = actionTypeDefaults[item.action.type]
    }
  }
}

// Bật/tắt action field
const toggleActionField = (item) => {
  if (item.hasAction) {
    // Nếu bật action, khởi tạo object action nếu chưa có
    if (!item.action) {
      item.action = {
        type: "",
        linkText: "",
        linkClass: "highlight-link",
        position: "end",
        url: "",
        target: "_self",
        rel: "noopener noreferrer"
      }
    }
  } else {
    // Nếu tắt action, xóa object action
    item.action = null
  }
}

// ========== API INTEGRATION ==========

// Khi load data, set màu từ shadow hiện tại
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get(`/cms/getSection/${SECTION_ID}`)

    if (response.data && response.data.contentJson) {
      const data = typeof response.data.contentJson === 'string'
          ? JSON.parse(response.data.contentJson)
          : response.data.contentJson

      if (data.faqConfig) {
        Object.assign(content.faqConfig, data.faqConfig)

        // Set màu từ shadow
        const shadowText = content.faqConfig.style.itemShadow || '0 2px 10px rgba(0, 0, 0, 0.1)'
        const rgbaMatch = shadowText.match(/rgba?\(([^)]+)\)/)
        if (rgbaMatch) {
          const rgba = rgbaMatch[1].split(',')
          if (rgba.length >= 3) {
            const r = parseInt(rgba[0].trim())
            const g = parseInt(rgba[1].trim())
            const b = parseInt(rgba[2].trim())
            shadowColor.value = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
          }
        }

        // Xử lý các item - thêm hasAction property
        content.faqConfig.items.forEach(item => {
          // Kiểm tra nếu có action object
          if (item.action) {
            item.hasAction = true
            // Đảm bảo action có đầy đủ các field
            item.action = {
              type: item.action.type || "",
              linkText: item.action.linkText || "",
              linkClass: item.action.linkClass || "highlight-link",
              position: item.action.position || "end",
              url: item.action.url || "",
              target: item.action.target || "_self",
              rel: item.action.rel || "noopener noreferrer"
            }
          } else {
            item.hasAction = false
          }
        })
      }

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

    // Prepare content data - tạo bản sao sâu để tránh thay đổi trực tiếp
    const contentData = JSON.parse(JSON.stringify(content))

    // Đặt tất cả isOpen = false trước khi lưu
    contentData.faqConfig.items.forEach(item => {
      item.isOpen = false

      // Clean up data before saving - remove hasAction property
      if (item.hasOwnProperty('hasAction')) {
        delete item.hasAction
      }
      // Nếu không có action, đặt thành null
      if (!item.action || Object.keys(item.action).length === 0) {
        item.action = null
      }
    })

    // Prepare FormData
    const formData = new FormData()

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'FAQ',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 6,
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
      showToast('Thay đổi đã được lưu thành công', 'success')

      // Reload data to get latest from server
      await loadData()
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Lỗi khi lưu thay đổi: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    isLoading.value = false
  }
}

// ========== FAQ ITEMS MANAGEMENT ==========
const addFAQItem = () => {
  const newId = content.faqConfig.items.length > 0
      ? Math.max(...content.faqConfig.items.map(item => item.id || 0)) + 1
      : 1

  const newItem = {
    id: newId,
    text: `Câu hỏi mới ${newId}`,
    answer: "Nhập nội dung câu trả lời...",
    isOpen: true, // Open when adding new
    backgroundColor: "#FFFFFF",
    textColor: "#333333",
    activeTextColor: "#031358",
    activeBackgroundColor: "#FFFFFF",
    hasAction: false,
    action: null
  }

  content.faqConfig.items.push(newItem)
  showToast('Đã thêm câu hỏi mới', 'success')
}

const removeFAQItem = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
    content.faqConfig.items.splice(index, 1)
    showToast('Đã xóa câu hỏi', 'success')
  }
}

const toggleFAQItem = (index) => {
  content.faqConfig.items[index].isOpen = !content.faqConfig.items[index].isOpen
}

const moveItemUp = (index) => {
  if (index > 0) {
    const item = content.faqConfig.items.splice(index, 1)[0]
    content.faqConfig.items.splice(index - 1, 0, item)
  }
}

const moveItemDown = (index) => {
  if (index < content.faqConfig.items.length - 1) {
    const item = content.faqConfig.items.splice(index, 1)[0]
    content.faqConfig.items.splice(index + 1, 0, item)
  }
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.faq-editor {
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

.setting-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
  width: 100%;
  box-sizing: border-box;
}

.setting-section.full-width {
  grid-column: 1 / -1;
  width: 100%;
}

.setting-section h3 {
  margin: 0 0 20px 0;
  color: #031358;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* FAQ Items List */
.faq-items-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.faq-item-editor {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item-editor.is-active {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-color: #4a6cf7;
}

.faq-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  background-color: #f8f9ff;
  border-bottom: 1px solid #e9ecef;
}

.faq-item-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.item-number {
  font-weight: 600;
  color: #4a6cf7;
  min-width: 25px;
}

.faq-question-input {
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  flex: 1;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.faq-question-input:focus {
  outline: none;
  background-color: white;
  box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
}

.faq-item-actions {
  display: flex;
  gap: 8px;
}

.faq-item-content {
  padding: 20px;
  background-color: white;
}

/* Action Settings */
.action-settings {
  background-color: #f8f9ff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.action-settings h4 {
  margin: 0 0 15px 0;
  color: #4a6cf7;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-fields {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
  margin-top: 15px;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.form-group label input[type="checkbox"] {
  margin-right: 8px;
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
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* Color Input */
.color-input-group {
  margin-bottom: 15px;
  width: 100%;
  box-sizing: border-box;
}

.color-input-group label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 8px;
  display: block;
  width: 100%;
}

.color-input {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
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
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

/* Input with Unit */
.input-with-unit {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.input-with-unit input {
  padding-right: 50px;
  width: 100%;
  box-sizing: border-box;
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

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
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
  background-color: #4a6cf7;
  color: white;
  transform: scale(1.1);
}

.btn-move-up:hover:not(:disabled) {
  background-color: #28a745;
}

.btn-move-down:hover:not(:disabled) {
  background-color: #17a2b8;
}

.btn-delete:hover:not(:disabled) {
  background-color: #dc3545;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  background-color: #f8f9fa;
  width: 100%;
  box-sizing: border-box;
}

.empty-state i {
  font-size: 3rem;
  color: #adb5bd;
  margin-bottom: 15px;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 20px;
}

.add-item-footer {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  width: 100%;
  box-sizing: border-box;
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
@media (max-width: 1200px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-section {
    min-width: 100%;
  }
}

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
    gap: 15px;
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

  .faq-item-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .faq-item-actions {
    align-self: flex-end;
  }

  .color-input {
    flex-wrap: wrap;
  }

  .color-input input[type="color"] {
    width: 50px;
    height: 40px;
  }

  .color-input input[type="text"] {
    flex: 1 1 200px;
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
    flex: 1 1 100%;
  }
}

/* Ensure all inputs are full width */
.setting-section input[type="text"],
.setting-section input[type="color"] + input[type="text"] {
  width: 100%;
  box-sizing: border-box;
}

/* Specific adjustments for items-settings */
.items-settings .color-input {
  width: 100%;
}

.items-settings .color-input input[type="text"] {
  min-width: 150px;
}

.simple-shadow-inputs {
  display: flex;
  gap: 10px;
  align-items: center;
}

.simple-shadow-inputs input[type="color"] {
  width: 50px;
  height: 40px;
  padding: 0;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.simple-shadow-inputs input[type="text"] {
  flex: 1;
  min-width: 0;
}
</style>