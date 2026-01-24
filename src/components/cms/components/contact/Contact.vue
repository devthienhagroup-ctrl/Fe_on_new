<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Trang Liên hệ</h2>
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
          :class="{ active: activeTab === 'form' }"
          @click="activeTab = 'form'"
      >
        <i class="fas fa-list-alt"></i> Form liên hệ
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'locations' }"
          @click="activeTab = 'locations'"
      >
        <i class="fas fa-map-marker-alt"></i> Địa điểm
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-palette"></i> Giao diện & Màu sắc
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Thông tin chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Thông tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề & Mô tả</h3>

            <div class="form-group">
              <label for="main-title">Tiêu đề chính</label>
              <input
                  type="text"
                  id="main-title"
                  v-model="content.header.title"
                  placeholder="Liên hệ với Thiên Hà Group"
              />
            </div>

            <div class="form-group">
              <label for="subtitle">Tiêu đề phụ</label>
              <input
                  type="text"
                  id="subtitle"
                  v-model="content.header.subtitle"
                  placeholder="Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn!"
              />
            </div>
          </div>

          <!-- Thông báo cảm ơn -->
          <div class="setting-section">
            <h3><i class="fas fa-comment-alt"></i> Thông báo cảm ơn</h3>
            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label for="thank-you-message">Nội dung thông báo cảm ơn</label>
                <AdvancedEditModal
                    v-model="content.thankYouMessage"
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
                <div class="tiptap" v-html="content.thankYouMessage"></div>
              </div>
            </div>
          </div>

          <!-- Thông tin liên hệ -->
          <div class="setting-section">
            <h3><i class="fas fa-address-book"></i> Thông tin liên hệ</h3>

            <div class="contacts-list">
              <div
                  v-for="(contact, index) in content.departments.contacts"
                  :key="contact.id"
                  class="contact-item"
              >
                <div class="contact-header">
                  <div class="contact-title">
                    <i :class="contact.icon"></i>
                    <span>{{ getContactLabel(contact.id) }}</span>
                  </div>
                  <div class="contact-actions">
                    <button class="btn-icon btn-delete" @click="removeContact(index)" title="Xóa">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label>Giá trị</label>
                  <input
                      type="text"
                      v-model="contact.value"
                      :placeholder="getContactPlaceholder(contact.id)"
                  />
                </div>
                <div class="form-group">
                  <label>Icon</label>
                  <IconPicker v-model="contact.icon"/>
                  <small class="form-hint">VD: fas fa-envelope, fas fa-phone</small>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary" @click="addContact">
              <i class="fas fa-plus"></i> Thêm thông tin liên hệ
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Form liên hệ -->
      <div v-if="activeTab === 'form'" class="form-settings">
        <div class="form-settings-header">
          <h3><i class="fas fa-list-alt"></i> Quản lý Form liên hệ</h3>
        </div>

        <div class="setting-section">
          <h3><i class="fas fa-heading"></i> Tiêu đề form</h3>
          <div class="form-group">
            <input
                type="text"
                v-model="content.form.title"
                placeholder="Chúng tôi luôn ở đây để hỗ trợ bạn!"
            />
          </div>
        </div>

        <div class="setting-section">
          <h3><i class="fas fa-edit"></i> Các trường form</h3>
          <button class="btn btn-primary" @click="addField">
            <i class="fas fa-plus"></i> Thêm trường mới
          </button>

          <div class="fields-list">
            <div
                v-for="(field, index) in content.form.fields"
                :key="field.name"
                class="field-item"
            >
              <div class="field-header">
                <div class="field-title">
                  <i class="fas fa-field"></i>
                  <span>{{ field.name }} ({{ field.type }})</span>
                  <span v-if="field.required" class="required-badge">Bắt buộc</span>
                </div>
                <div class="field-actions">
                  <button class="btn-icon" @click="moveFieldUp(index)" :disabled="index === 0" title="Di chuyển lên">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveFieldDown(index)"
                          :disabled="index === content.form.fields.length - 1" title="Di chuyển xuống">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-delete" @click="removeField(index)" title="Xóa trường">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>

              <div class="field-edit-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>Tên trường</label>
                    <input
                        type="text"
                        v-model="field.name"
                        placeholder="fullName"
                    />
                    <small class="form-hint">Tên sử dụng trong code (không dấu, không khoảng cách)</small>
                  </div>
                  <div class="form-group">
                    <label>Kiểu trường</label>
                    <select v-model="field.type">
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="tel">Số điện thoại</option>
                      <option value="textarea">Textarea</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Placeholder</label>
                  <input
                      type="text"
                      v-model="field.placeholder"
                      placeholder="Họ và tên"
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="field.required"/>
                      <span>Trường bắt buộc</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="setting-section">
          <h3><i class="fas fa-paper-plane"></i> Nút gửi</h3>
          <div class="form-group">
            <label>Text nút gửi</label>
            <input
                type="text"
                v-model="content.form.submitText"
                placeholder="Gửi thông tin"
            />
          </div>
        </div>
      </div>

      <!-- Tab Địa điểm -->
      <div v-if="activeTab === 'locations'" class="locations-settings">
        <div class="locations-header">
          <h3><i class="fas fa-map-marker-alt"></i> Quản lý Địa điểm</h3>
          <button class="btn btn-primary" @click="addLocation">
            <i class="fas fa-plus"></i> Thêm địa điểm mới
          </button>
        </div>

        <div class="locations-list">
          <div
              v-for="(location, index) in content.departments.locations"
              :key="location.id"
              class="location-item"
          >
            <div class="location-header">
              <div class="location-title">
                <i class="fas fa-map-pin"></i>
                <span>{{ getLocationLabel(location.id) }}</span>
              </div>
              <div class="location-actions">
                <button class="btn-icon" @click="moveLocationUp(index)" :disabled="index === 0" title="Di chuyển lên">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click="moveLocationDown(index)"
                        :disabled="index === content.departments.locations.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-delete" @click="removeLocation(index)" title="Xóa địa điểm">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <div class="location-edit-form">
              <div class="form-group">
                <label>ID địa điểm</label>
                <input
                    type="text"
                    v-model="location.id"
                    placeholder="headquarters"
                />
                <small class="form-hint">ID sử dụng trong code (không dấu, không khoảng cách)</small>
              </div>

              <div class="form-group">
                <label>Địa chỉ</label>
                <textarea
                    v-model="location.address"
                    rows="3"
                    placeholder="Trụ sở: 14 đường 15, KĐT Vạn Phúc..."
                ></textarea>
              </div>

              <div class="form-group">
                <label>Google Maps URL (Embed)</label>
                <textarea
                    v-model="location.mapUrl"
                    rows="3"
                    placeholder="https://www.google.com/maps/embed?pb=..."
                ></textarea>
                <small class="form-hint">Lấy từ Google Maps > Chia sẻ > Nhúng bản đồ</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Giao diện & Màu sắc -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu sắc</h3>

            <div class="color-input-group">
              <label>Màu chính (Primary)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.primary"/>
                <input type="text" v-model="content.colors.primary" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu phụ (Secondary)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.secondary"/>
                <input type="text" v-model="content.colors.secondary" placeholder="#0629BE"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu trắng</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.white"/>
                <input type="text" v-model="content.colors.white" placeholder="#ffffff"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu xám nhạt</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.grayLight"/>
                <input type="text" v-model="content.colors.grayLight" placeholder="#e0e0e0"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu xám rất nhạt</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.grayLighter"/>
                <input type="text" v-model="content.colors.grayLighter" placeholder="#f5f5f5"/>
              </div>
            </div>
          </div>

          <!-- Kiểu chữ -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Kiểu chữ</h3>

            <div class="form-row">
              <div class="form-group">
                <label>Tiêu đề chính (Font size)</label>
                <div class="input-with-unit">
                  <input type="text" v-model="content.styles.headerTitle.fontSize" placeholder="40px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label>Font weight</label>
                <input type="text" v-model="content.styles.headerTitle.fontWeight" placeholder="700"/>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Tiêu đề phụ (Font size)</label>
                <div class="input-with-unit">
                  <input type="text" v-model="content.styles.headerSubtitle.fontSize" placeholder="20px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label>Font weight</label>
                <input type="text" v-model="content.styles.headerSubtitle.fontWeight" placeholder="300"/>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Tiêu đề form (Font size)</label>
                <div class="input-with-unit">
                  <input type="text" v-model="content.styles.formTitle.fontSize" placeholder="40px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label>Font weight</label>
                <input type="text" v-model="content.styles.formTitle.fontWeight" placeholder="700"/>
              </div>
            </div>
          </div>

          <!-- Layout & Spacing -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Layout & Spacing</h3>

            <div class="form-group">
              <label>Margin top</label>
              <div class="input-with-unit">
                <input type="text" v-model="content.styles.marginTop" placeholder="60px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label>Main max width</label>
              <div class="input-with-unit">
                <input type="text" v-model="content.styles.mainMaxWidth" placeholder="1400px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label>Main padding</label>
              <input type="text" v-model="content.styles.mainPadding" placeholder="40px 20px"/>
            </div>

            <div class="form-group">
              <label>Chiều cao section địa chỉ</label>
              <div class="input-with-unit">
                <input type="text" v-model="content.styles.addressSectionHeight" placeholder="250px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label>Border radius</label>
              <div class="input-with-unit">
                <input type="text" v-model="content.styles.borderRadius" placeholder="10px"/>
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Hiệu ứng -->
          <div class="setting-section">
            <h3><i class="fas fa-magic"></i> Hiệu ứng</h3>

            <div class="form-group">
              <label>Box shadow</label>
              <input type="text" v-model="content.styles.boxShadow" placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"/>
            </div>

            <div class="form-group">
              <label>Box shadow (hover)</label>
              <input type="text" v-model="content.styles.boxShadowHover" placeholder="0 6px 12px rgba(0, 0, 0, 0.15)"/>
            </div>

            <div class="form-group">
              <label>Transition duration</label>
              <div class="input-with-unit">
                <input type="text" v-model="content.styles.transitionDuration" placeholder="0.3s"/>
                <span class="unit">s</span>
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
import {ref, reactive, onMounted} from 'vue'
import api from '../../../../api/api.js'
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";
import IconPicker from "../../../RichTextEditor/IconPicker.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Content structure based on new JSON data (Contact section)
const content = reactive({
  header: {
    title: "Liên hệ với Thiên Hà Group",
    subtitle: "Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn!"
  },
  form: {
    title: "Chúng tôi luôn ở đây để hỗ trợ bạn!",
    fields: [
      {
        name: "fullName",
        type: "text",
        placeholder: "Họ và tên",
        required: true
      },
      {
        name: "phone",
        type: "tel",
        placeholder: "Số điện thoại",
        required: true
      },
      {
        name: "email",
        type: "email",
        placeholder: "Email (không bắt buộc)",
        required: false
      },
      {
        name: "message",
        type: "textarea",
        placeholder: "Vấn đề của bạn",
        required: true
      }
    ],
    submitText: "Gửi thông tin"
  },
  thankYouMessage: "Cảm ơn bạn đã tin tưởng, kết nối cùng <b>Thiên Hà Group</b>!<br>Chúng tôi rất mong được lắng nghe và hỗ trợ bạn trong thời gian sớm nhất.",
  departments: {
    locations: [
      {
        id: "headquarters",
        address: "Trụ sở: 14 đường 15, KĐT Vạn Phúc, Phường Hiệp Bình Phước, TP. Thủ Đức, TP. Hồ Chí Minh",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31348.906870926585!2d106.70607739528673!3d10.84087193956894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175295a6c0ebc8b%3A0xc51466fa5345ab8c!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gxJDhuqd1IFTGsCBC4bqldCDEkOG7mW5nIFPhuqNuIFRoacOqbiBIw6AgR3JvdXA!5e0!3m2!1svi!2s!4v1763093883591!5m2!1svi!2s"
      },
      {
        id: "branch",
        address: "Chi nhánh: 01 Hoa Lài, Phường 7, Quận Phú Nhuận, TP. Hồ Chí Minh",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1747235012276!2d106.68906221148586!3d10.797926389307754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175290063ccdf0f%3A0x6171a166d6b789b7!2zQ2hpIE5ow6FuaCBUaGnDqm4gSMOgIEdyb3VwIFBow7ogTmh14bqtbiAtIEdp4bqjaSBQaMOhcCBCw6FuIEfhuqVwIELhuqV0IMSQ4buZbmcgU-G6o24!5e0!3m2!1svi!2s!4v1763094237511!5m2!1svi!2s"
      }
    ],
    contacts: [
      {
        id: "email",
        icon: "fas fa-envelope",
        value: "thienhalandgroupvn@gmail.com"
      },
      {
        id: "phone",
        icon: "fas fa-phone",
        value: "0911 2318 82"
      }
    ]
  },
  colors: {
    primary: "#031358",
    secondary: "#0629BE",
    gradientStart: "#0629BE",
    gradientMiddle: "#031358",
    gradientEnd: "#0628B9",
    white: "#ffffff",
    grayLight: "#e0e0e0",
    grayLighter: "#f5f5f5"
  },
  styles: {
    marginTop: "60px",
    mainMaxWidth: "1400px",
    mainPadding: "40px 20px",
    headerTitle: {
      fontSize: "40px",
      fontWeight: "700"
    },
    headerSubtitle: {
      fontSize: "20px",
      fontWeight: "300"
    },
    formTitle: {
      fontSize: "40px",
      fontWeight: "700"
    },
    addressSectionHeight: "250px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    boxShadowHover: "0 6px 12px rgba(0, 0, 0, 0.15)",
    transitionDuration: "0.3s"
  }
})

// UI State
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// File management (kept for compatibility but not used in contact page)
const files = ref([])
const uploadedFiles = ref([])

// ========== CONSTANTS ==========
const SECTION_ID = 48

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

const getContactLabel = (id) => {
  const labels = {
    email: "Email",
    phone: "Số điện thoại",
    facebook: "Facebook",
    zalo: "Zalo",
    website: "Website"
  }
  return labels[id] || id.charAt(0).toUpperCase() + id.slice(1)
}

const getContactPlaceholder = (id) => {
  const placeholders = {
    email: "email@example.com",
    phone: "0911 2318 82",
    facebook: "https://facebook.com/username",
    zalo: "0911 2318 82",
    website: "https://example.com"
  }
  return placeholders[id] || "Nhập giá trị..."
}

const getLocationLabel = (id) => {
  const labels = {
    headquarters: "Trụ sở chính",
    branch: "Chi nhánh",
    office: "Văn phòng",
    store: "Cửa hàng"
  }
  return labels[id] || id.charAt(0).toUpperCase() + id.slice(1)
}

// ========== CONTACT MANAGEMENT ==========
const addContact = () => {
  const newId = `contact_${Date.now()}`
  content.departments.contacts.push({
    id: newId,
    icon: 'fas fa-info-circle',
    value: ''
  })
  showToast('Đã thêm thông tin liên hệ mới', 'success')
}

const removeContact = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa thông tin liên hệ này?')) {
    content.departments.contacts.splice(index, 1)
    showToast('Đã xóa thông tin liên hệ', 'success')
  }
}

// ========== FORM FIELD MANAGEMENT ==========
const addField = () => {
  const fieldTypes = ['text', 'email', 'tel', 'textarea', 'number', 'date']
  const newName = `field_${Date.now()}`

  content.form.fields.push({
    name: newName,
    type: 'text',
    placeholder: 'Nhập thông tin...',
    required: true
  })
  showToast('Đã thêm trường mới', 'success')
}

const removeField = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa trường này?')) {
    content.form.fields.splice(index, 1)
    showToast('Đã xóa trường', 'success')
  }
}

const moveFieldUp = (index) => {
  if (index > 0) {
    const temp = content.form.fields[index]
    content.form.fields[index] = content.form.fields[index - 1]
    content.form.fields[index - 1] = temp
  }
}

const moveFieldDown = (index) => {
  if (index < content.form.fields.length - 1) {
    const temp = content.form.fields[index]
    content.form.fields[index] = content.form.fields[index + 1]
    content.form.fields[index + 1] = temp
  }
}

// ========== LOCATION MANAGEMENT ==========
const addLocation = () => {
  const newId = `location_${Date.now()}`
  content.departments.locations.push({
    id: newId,
    address: '',
    mapUrl: ''
  })
  showToast('Đã thêm địa điểm mới', 'success')
}

const removeLocation = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa địa điểm này?')) {
    content.departments.locations.splice(index, 1)
    showToast('Đã xóa địa điểm', 'success')
  }
}

const moveLocationUp = (index) => {
  if (index > 0) {
    const temp = content.departments.locations[index]
    content.departments.locations[index] = content.departments.locations[index - 1]
    content.departments.locations[index - 1] = temp
  }
}

const moveLocationDown = (index) => {
  if (index < content.departments.locations.length - 1) {
    const temp = content.departments.locations[index]
    content.departments.locations[index] = content.departments.locations[index + 1]
    content.departments.locations[index + 1] = temp
  }
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
      // Handle both old format (with content property) and new format
      if (data.content) {
        // Old format: data.content contains everything
        Object.assign(content, data.content)
      } else {
        // New format: data is the content directly
        Object.assign(content, data)
      }

      // Handle files from API response (if any)
      if (response.data.files && response.data.files.length > 0) {
        files.value = response.data.files
      } else {
        files.value = []
      }

      uploadedFiles.value = []
      showToast('Dữ liệu đã được tải thành công', 'success')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    // Don't show error toast on initial load if data doesn't exist yet
    if (error.response?.status !== 404) {
      showToast('Không thể tải dữ liệu từ server', 'error')
    }
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare content data
    // Use the exact same structure as the input JSON
    const contentData = {
      content: {
        header: content.header,
        form: content.form,
        thankYouMessage: content.thankYouMessage
      },
      departments: content.departments,
      colors: content.colors,
      styles: content.styles
    }

    // Prepare FormData
    const formData = new FormData()

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Liên hệ',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 0,
      files: files.value.filter(file => file.status !== 'EXISTING')
    }

    // Add section data
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }))

    // Add actual file binaries for NEW files (if any)
    const newFiles = files.value.filter(file => file.status === 'NEW')
    newFiles.forEach((fileDTO, index) => {
      const uploadedFile = uploadedFiles.value.find(f => f.tempName === fileDTO.tempName)
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

      // Update file statuses (if any files were uploaded)
      files.value.forEach(file => {
        if (file.status === 'NEW') {
          file.status = 'EXISTING'
        }
      })

      // Clear uploaded files
      uploadedFiles.value = []

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

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Keep all existing styles, just add new ones for contact-specific components */

.contacts-list,
.fields-list,
.locations-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.contact-item,
.field-item,
.location-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.contact-item:hover,
.field-item:hover,
.location-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.contact-header,
.field-header,
.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.contact-title,
.field-title,
.location-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #031358;
}

.required-badge {
  background-color: #ff6b6b;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 10px;
}

.contact-actions,
.field-actions,
.location-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
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
  background-color: #4a6cf7;
  color: white;
  border-color: #4a6cf7;
  transform: scale(1.05);
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete:hover:not(:disabled) {
  background-color: #dc3545;
  border-color: #dc3545;
}

.contact-edit-form,
.field-edit-form,
.location-edit-form {
  background-color: #f8f9ff;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-settings-header,
.locations-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.form-settings-header h3,
.locations-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .contact-header,
  .field-header,
  .location-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .contact-actions,
  .field-actions,
  .location-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .form-settings-header,
  .locations-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
}
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

/* Steps Management */
.steps-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.steps-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.step-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.step-header:hover {
  background-color: #e9ecef;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.step-title-preview {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.step-title-preview i {
  color: #4a6cf7;
  width: 20px;
}

.step-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
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
  background-color: #4a6cf7;
  color: white;
  border-color: #4a6cf7;
  transform: scale(1.05);
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete:hover:not(:disabled) {
  background-color: #dc3545;
  border-color: #dc3545;
}

.step-edit-form {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9ff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
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
  margin-bottom: 10px;
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

.form-hint {
  display: block;
  margin-top: 5px;
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

  .form-row {
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

  .navigation-tabs {
    padding: 0 20px;
    flex-direction: column;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.9rem;
    justify-content: center;
  }

  .steps-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .step-header {
    flex-wrap: wrap;
  }

  .step-actions {
    margin-left: auto;
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

  .step-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .step-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}

/* Gradient Colors */
.gradient-colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 10px;
}

.color-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.color-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 3px;
}

.gradient-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: white;
  transition: all 0.3s ease;
}

.gradient-input:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

/* Shadow Color */
.shadow-color-input {
  margin-bottom: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gradient-colors {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>