<template>
  <div class="newsletter-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Đăng ký Nhận tin</h2>
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
        <i class="fas fa-cog"></i> Nội dung
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-palette"></i> Giao diện
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Nội dung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Thông tin nội dung -->
          <div class="setting-section">
            <h3><i class="fas fa-align-left"></i> Văn bản</h3>

            <div class="form-group">
              <label for="title">
                <i class="fas fa-heading"></i> Tiêu đề chính
              </label>
              <input
                  type="text"
                  id="title"
                  v-model="content.content.title"
                  placeholder="Luôn đồng hành cùng bạn qua mỗi bản tin mới"
                  class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="subtitle">
                <i class="fas fa-text-height"></i> Phụ đề
              </label>
              <textarea
                  id="subtitle"
                  v-model="content.content.subtitle"
                  placeholder="Hãy để chúng tôi gửi đến bạn những nội dung hữu ích và cập nhật theo từng giai đoạn phát triển."
                  class="form-input"
                  rows="3"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="placeholder">
                  <i class="fas fa-keyboard"></i> Placeholder
                </label>
                <input
                    type="text"
                    id="placeholder"
                    v-model="content.content.placeholder"
                    placeholder="Nhập địa chỉ email của bạn"
                    class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="buttonText">
                  <i class="fas fa-square"></i> Nút đăng ký
                </label>
                <input
                    type="text"
                    id="buttonText"
                    v-model="content.content.buttonText"
                    placeholder="Đăng ký nhận tin"
                    class="form-input"
                />
              </div>
            </div>
          </div>

          <!-- Hình ảnh -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Hình ảnh</h3>

            <div class="image-upload-container">
              <div class="u">
                <div class="upload-placeholder" @click="triggerImageInput" @dragover.prevent @drop.prevent="handleImageDrop">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p class="upload-text">Kéo thả hình ảnh vào đây hoặc <span class="highlight">nhấn để chọn file</span></p>
                  <p class="upload-hint">Hỗ trợ: JPG, PNG, GIF, SVG • Tối đa 5MB</p>
                </div>
              </div>

              <input
                  type="file"
                  ref="imageInput"
                  @change="handleImageUpload"
                  accept="image/*"
                  style="display: none"
              />

              <!-- Preview area -->
              <div v-if="content.content.imageSrc || imagePreview" class="image-preview-area">
                <div class="preview-header">
                  <span>Xem trước hình ảnh:</span>
                  <div class="preview-actions">
                    <button class="btn-icon-small" @click="previewImage" title="Xem toàn màn hình">
                      <i class="fas fa-expand"></i>
                    </button>
                    <button class="btn-icon-small btn-danger" @click="removeImage" title="Xóa ảnh">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="preview-image">
                  <img :src="getImageUrl(content.content.imageSrc)" alt="Preview" v-if="content.content.imageSrc"/>
                  <img :src="imagePreview" alt="Preview" v-else-if="imagePreview"/>
                  <div v-else class="no-preview">
                    <i class="fas fa-image"></i>
                    <p>Không có ảnh để xem trước</p>
                  </div>
                </div>
                <div class="image-info">
                  <div class="info-item">
                    <i class="fas fa-tag"></i>
                    <input
                        type="text"
                        v-model="content.content.imageAlt"
                        placeholder="Mô tả hình ảnh (alt text)"
                        class="alt-input"
                    />
                  </div>
                  <div class="info-item">
                    <i class="fas fa-link"></i>
                    <input
                        type="text"
                        v-model="content.content.imageSrc"
                        placeholder="Đường dẫn hình ảnh"
                        class="path-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div v-else class="upload-placeholder" @click="triggerImageInput" @dragover.prevent @drop.prevent="handleImageDrop">
                <i class="fas fa-cloud-upload-alt"></i>
                <p class="upload-text">Kéo thả hình ảnh vào đây hoặc <span class="highlight">nhấn để chọn file</span></p>
                <p class="upload-hint">Hỗ trợ: JPG, PNG, GIF, SVG • Tối đa 5MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Giao diện -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Bố cục -->
          <div class="setting-section">
            <h3><i class="fas fa-border-all"></i> Bố cục</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="maxWidth">
                  <i class="fas fa-arrows-alt-h"></i> Chiều rộng tối đa
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="maxWidth"
                      v-model="content.layout.maxWidth"
                      placeholder="1400px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="gap">
                  <i class="fas fa-space-shuttle"></i> Khoảng cách
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="gap"
                      v-model="content.layout.gap"
                      placeholder="20px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="padding">
                <i class="fas fa-border-style"></i> Khoảng cách đệm
              </label>
              <input
                  type="text"
                  id="padding"
                  v-model="content.layout.padding"
                  placeholder="0 20px"
                  class="form-input"
              />
            </div>
          </div>

          <!-- Nền container -->
          <div class="setting-section">
            <h3><i class="fas fa-square-full"></i> Nền container</h3>

            <div class="gradient-editor">
              <div class="gradient-preview" :style="{
                background: content.styles.container.backgroundGradient,
                height: '80px',
                borderRadius: '8px',
                marginBottom: '15px',
                border: '1px solid #ddd'
              }"></div>

              <div class="color-pickers">
                <div class="color-picker-group">
                  <label>Màu chính:</label>
                  <input type="color" v-model="gradientColors.color1" @input="updateContainerGradient()" class="color-picker"/>
                </div>
                <div class="color-picker-group">
                  <label>Màu phụ:</label>
                  <input type="color" v-model="gradientColors.color2" @input="updateContainerGradient()" class="color-picker"/>
                </div>
                <div class="color-picker-group">
                  <label>Màu đậm:</label>
                  <input type="color" v-model="gradientColors.color3" @input="updateContainerGradient()" class="color-picker"/>
                </div>
              </div>

              <div class="form-group">
                <label>
                  <i class="fas fa-code"></i> Mã gradient
                </label>
                <textarea
                    v-model="content.styles.container.backgroundGradient"
                    placeholder="linear-gradient(135deg, #0629BE 7%, #031358 22%, #0629BE 56%, #031358 81%, #0628B9 100%)"
                    class="form-input code-input"
                    rows="2"
                    @input="updateGradientFromCode()"
                ></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="paddingTop">
                  <i class="fas fa-arrow-up"></i> Đệm trên
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="paddingTop"
                      v-model="content.styles.container.paddingTop"
                      placeholder="30px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="paddingBottom">
                  <i class="fas fa-arrow-down"></i> Đệm dưới
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="paddingBottom"
                      v-model="content.styles.container.paddingBottom"
                      placeholder="30px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="shadow-editor">
              <label>
                <i class="fas fa-cloud"></i> Đổ bóng
              </label>
              <div class="shadow-controls">
                <div class="color-picker-group">
                  <label>Màu bóng:</label>
                  <input type="color" v-model="shadowColor" @input="updateBoxShadow()" class="color-picker"/>
                </div>
                <div class="range-group">
                  <label>Độ mờ:</label>
                  <input type="range" v-model="shadowOpacity" min="0" max="1" step="0.05" @input="updateBoxShadow()" class="range-slider"/>
                  <span class="range-value">{{ shadowOpacity }}</span>
                </div>
              </div>
              <input
                  type="text"
                  v-model="content.styles.container.boxShadow"
                  placeholder="0 4px 12px rgba(0, 0, 0, 0.1)"
                  class="form-input"
                  @input="updateShadowFromCode()"
              />
            </div>
          </div>

          <!-- Tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề</h3>

            <div class="color-picker-with-preview">
              <div class="color-picker-group">
                <label>Màu chữ:</label>
                <div class="color-input">
                  <input type="color" v-model="titleColorHex" @input="updateTitleColor()" class="color-picker"/>
                  <input type="text" v-model="content.styles.title.color" placeholder="#FFFFFF" class="form-input color-code" @input="updateTitleColorFromCode()"/>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="titleFontSize">
                  <i class="fas fa-text-height"></i> Kích thước
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="titleFontSize"
                      v-model="content.styles.title.fontSize"
                      placeholder="33px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="titleFontWeight">
                  <i class="fas fa-bold"></i> Độ đậm
                </label>
                <select id="titleFontWeight" v-model="content.styles.title.fontWeight" class="form-input">
                  <option value="300">Thin (300)</option>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semi Bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="titleLineHeight">
                  <i class="fas fa-arrows-alt-v"></i> Chiều cao dòng
                </label>
                <input
                    type="text"
                    id="titleLineHeight"
                    v-model="content.styles.title.lineHeight"
                    placeholder="1.2"
                    class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="titleMarginBottom">
                  <i class="fas fa-arrow-down"></i> Cách dưới
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="titleMarginBottom"
                      v-model="content.styles.title.marginBottom"
                      placeholder="15px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Phụ đề -->
          <div class="setting-section">
            <h3><i class="fas fa-comment-alt"></i> Phụ đề</h3>

            <div class="color-picker-with-preview">
              <div class="color-picker-group">
                <label>Màu chữ:</label>
                <div class="color-input">
                  <input type="color" v-model="subtitleColorHex" @input="updateSubtitleColor()" class="color-picker"/>
                  <input type="text" v-model="content.styles.subtitle.color" placeholder="#FFFFFF" class="form-input color-code" @input="updateSubtitleColorFromCode()"/>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="subtitleFontSize">
                  <i class="fas fa-text-height"></i> Kích thước
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="subtitleFontSize"
                      v-model="content.styles.subtitle.fontSize"
                      placeholder="20px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="subtitleOpacity">
                  <i class="fas fa-low-vision"></i> Độ mờ
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="subtitleOpacity"
                      v-model="content.styles.subtitle.opacity"
                      placeholder="0.9"
                      class="form-input"
                  />
                  <span class="unit">%</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="subtitleLineHeight">
                <i class="fas fa-arrows-alt-v"></i> Chiều cao dòng
              </label>
              <input
                  type="text"
                  id="subtitleLineHeight"
                  v-model="content.styles.subtitle.lineHeight"
                  placeholder="1.4"
                  class="form-input"
              />
            </div>
          </div>

          <!-- Input -->
          <div class="setting-section">
            <h3><i class="fas fa-keyboard"></i> Ô nhập liệu</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="inputPadding">
                  <i class="fas fa-expand-alt"></i> Khoảng cách đệm
                </label>
                <input
                    type="text"
                    id="inputPadding"
                    v-model="content.styles.input.padding"
                    placeholder="12px 16px"
                    class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="inputBorderRadius">
                  <i class="fas fa-circle"></i> Bo góc
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="inputBorderRadius"
                      v-model="content.styles.input.borderRadius"
                      placeholder="6px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="inputFontSize">
                  <i class="fas fa-text-height"></i> Kích thước chữ
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="inputFontSize"
                      v-model="content.styles.input.fontSize"
                      placeholder="16px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="inputPlaceholderColor">
                  <i class="fas fa-tint"></i> Màu placeholder
                </label>
                <div class="color-input">
                  <input type="color" v-model="placeholderColorHex" @input="updatePlaceholderColor()" class="color-picker"/>
                  <input type="text" v-model="content.styles.input.placeholderColor" placeholder="#999" class="form-input color-code" @input="updatePlaceholderColorFromCode()"/>
                </div>
              </div>
            </div>
          </div>

          <!-- Nút -->
          <div class="setting-section">
            <h3><i class="fas fa-square"></i> Nút đăng ký</h3>

            <div class="color-picker-with-preview">
              <div class="color-picker-group">
                <label>Màu nền:</label>
                <div class="color-input">
                  <input type="color" v-model="buttonBgColorHex" @input="updateButtonBgColor()" class="color-picker"/>
                  <input type="text" v-model="content.styles.button.backgroundColor" placeholder="#C2CBF0" class="form-input color-code" @input="updateButtonBgColorFromCode()"/>
                </div>
              </div>
            </div>

            <div class="color-picker-with-preview" style="margin-top: 15px;">
              <div class="color-picker-group">
                <label>Màu chữ:</label>
                <div class="color-input">
                  <input type="color" v-model="buttonColorHex" @input="updateButtonColor()" class="color-picker"/>
                  <input type="text" v-model="content.styles.button.color" placeholder="#031358" class="form-input color-code" @input="updateButtonColorFromCode()"/>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="buttonPadding">
                  <i class="fas fa-expand-alt"></i> Khoảng cách đệm
                </label>
                <input
                    type="text"
                    id="buttonPadding"
                    v-model="content.styles.button.padding"
                    placeholder="12px 16px"
                    class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="buttonBorderRadius">
                  <i class="fas fa-circle"></i> Bo góc
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="buttonBorderRadius"
                      v-model="content.styles.button.borderRadius"
                      placeholder="6px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="buttonFontSize">
                  <i class="fas fa-text-height"></i> Kích thước chữ
                </label>
                <div class="input-with-unit">
                  <input
                      type="text"
                      id="buttonFontSize"
                      v-model="content.styles.button.fontSize"
                      placeholder="16px"
                      class="form-input"
                  />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="buttonFontWeight">
                  <i class="fas fa-bold"></i> Độ đậm
                </label>
                <select id="buttonFontWeight" v-model="content.styles.button.fontWeight" class="form-input">
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semi Bold (600)</option>
                  <option value="700">Bold (700)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="buttonHoverBgColor">
                  <i class="fas fa-mouse-pointer"></i> Màu nền khi hover
                </label>
                <div class="color-input">
                  <input type="color" v-model="buttonHoverColorHex" @input="updateButtonHoverColor()" class="color-picker"/>
                  <input type="text" v-model="content.styles.button.hoverBackgroundColor" placeholder="#b0b9e8" class="form-input color-code" @input="updateButtonHoverColorFromCode()"/>
                </div>
              </div>
              <div class="form-group">
                <label for="buttonWidth">
                  <i class="fas fa-arrows-alt-h"></i> Chiều rộng
                </label>
                <input
                    type="text"
                    id="buttonWidth"
                    v-model="content.styles.button.width"
                    placeholder="100%"
                    class="form-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="closePreviewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xem trước hình ảnh</h3>
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
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)

// Color states
const titleColorHex = ref('#FFFFFF')
const subtitleColorHex = ref('#FFFFFF')
const buttonBgColorHex = ref('#C2CBF0')
const buttonColorHex = ref('#031358')
const buttonHoverColorHex = ref('#b0b9e8')
const placeholderColorHex = ref('#999999')

// Gradient colors
const gradientColors = reactive({
  color1: '#0629BE',
  color2: '#031358',
  color3: '#0628B9'
})

// Shadow
const shadowColor = ref('#000000')
const shadowOpacity = ref(0.1)

// Content structure
const content = reactive({
  styles: {
    container: {
      backgroundGradient: "linear-gradient(135deg, #0629BE 7%, #031358 22%, #0629BE 56%, #031358 81%, #0628B9 100%)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      paddingBottom: "30px",
      paddingTop: "30px"
    },
    title: {
      color: "#FFFFFF",
      fontSize: "33px",
      fontWeight: "700",
      lineHeight: "1.2",
      marginBottom: "15px"
    },
    subtitle: {
      color: "#FFFFFF",
      fontSize: "20px",
      lineHeight: "1.4",
      opacity: "0.9"
    },
    input: {
      padding: "12px 16px",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
      transition: "box-shadow 0.3s ease",
      placeholderColor: "#999"
    },
    button: {
      backgroundColor: "#C2CBF0",
      color: "#031358",
      border: "none",
      padding: "12px 16px",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "600",
      transition: "background-color 0.3s ease",
      width: "100%",
      hoverBackgroundColor: "#b0b9e8"
    }
  },
  content: {
    title: "Luôn đồng hành cùng bạn qua mỗi bản tin mới",
    subtitle: "Hãy để chúng tôi gửi đến bạn những nội dung hữu ích và cập nhật theo từng giai đoạn phát triển.",
    placeholder: "Nhập địa chỉ email của bạn",
    buttonText: "Đăng ký nhận tin",
    imageSrc: "/imgs/mail-sent-animate.svg",
    imageAlt: "Đăng ký nhận tin"
  },
  layout: {
    maxWidth: "1400px",
    gap: "20px",
    padding: "0 20px"
  }
})

// UI State
const imagePreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const imageInput = ref(null)

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
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 47

// ========== COLOR HELPERS ==========
const hexToRgba = (hex, opacity = 1) => {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const rgbaToHex = (rgba) => {
  if (rgba.startsWith('#')) return rgba;

  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  return '#ffffff';
};

// Gradient functions
const updateContainerGradient = () => {
  content.styles.container.backgroundGradient =
      `linear-gradient(135deg, ${gradientColors.color1} 7%, ${gradientColors.color2} 22%, ${gradientColors.color1} 56%, ${gradientColors.color2} 81%, ${gradientColors.color3} 100%)`;
};

const updateGradientFromCode = () => {
  // Extract colors from gradient string
  const gradient = content.styles.container.backgroundGradient;
  const colorMatches = gradient.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);

  if (colorMatches) {
    gradientColors.color1 = colorMatches[0] || '#0629BE';
    gradientColors.color2 = colorMatches[1] || '#031358';
    gradientColors.color3 = colorMatches[2] || '#0628B9';
  }
};

const updateBoxShadow = () => {
  content.styles.container.boxShadow = `0 4px 12px ${hexToRgba(shadowColor.value, shadowOpacity.value)}`;
};

const updateShadowFromCode = () => {
  const shadow = content.styles.container.boxShadow;
  const rgbaMatch = shadow.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);

  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 0.1;

    shadowColor.value = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    shadowOpacity.value = opacity;
  }
};

// Update color functions
const updateTitleColor = () => {
  content.styles.title.color = titleColorHex.value;
};

const updateTitleColorFromCode = () => {
  titleColorHex.value = content.styles.title.color;
};

const updateSubtitleColor = () => {
  content.styles.subtitle.color = subtitleColorHex.value;
};

const updateSubtitleColorFromCode = () => {
  subtitleColorHex.value = content.styles.subtitle.color;
};

const updateButtonBgColor = () => {
  content.styles.button.backgroundColor = buttonBgColorHex.value;
};

const updateButtonBgColorFromCode = () => {
  buttonBgColorHex.value = content.styles.button.backgroundColor;
};

const updateButtonColor = () => {
  content.styles.button.color = buttonColorHex.value;
};

const updateButtonColorFromCode = () => {
  buttonColorHex.value = content.styles.button.color;
};

const updateButtonHoverColor = () => {
  content.styles.button.hoverBackgroundColor = buttonHoverColorHex.value;
};

const updateButtonHoverColorFromCode = () => {
  buttonHoverColorHex.value = content.styles.button.hoverBackgroundColor;
};

const updatePlaceholderColor = () => {
  content.styles.input.placeholderColor = placeholderColorHex.value;
};

const updatePlaceholderColorFromCode = () => {
  placeholderColorHex.value = content.styles.input.placeholderColor;
};

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

  if (filename.startsWith('/')) {
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

const handleFileUpload = (file, type) => {
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

    content.content.imageSrc = tempUrl
    imagePreview.value = previewUrl

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

    uploadedFiles.value.push({
      tempName: tempName,
      file: file,
      previewUrl: previewUrl
    })

    files.value.push(fileDTO)

    showToast('Hình ảnh đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  return true
}

// ========== IMAGE UPLOAD HANDLERS ==========
const triggerImageInput = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh')
  }
  event.target.value = ''
}

const handleImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh')
  }
}

const removeImage = () => {
  if (content.content.imageSrc || imagePreview.value) {
    content.content.imageSrc = ''
    imagePreview.value = null
    showToast('Đã xóa ảnh', 'success')
  }
}

// ========== PREVIEW FUNCTIONS ==========
const previewImage = () => {
  if (content.content.imageSrc || imagePreview.value) {
    previewImageUrl.value = content.content.imageSrc ? getImageUrl(content.content.imageSrc) : imagePreview.value
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
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

      Object.assign(content, data)

      // Initialize colors
      titleColorHex.value = content.styles.title.color || '#FFFFFF'
      subtitleColorHex.value = content.styles.subtitle.color || '#FFFFFF'
      buttonBgColorHex.value = content.styles.button.backgroundColor || '#C2CBF0'
      buttonColorHex.value = content.styles.button.color || '#031358'
      buttonHoverColorHex.value = content.styles.button.hoverBackgroundColor || '#b0b9e8'
      placeholderColorHex.value = content.styles.input.placeholderColor || '#999999'

      // Initialize gradient colors
      updateGradientFromCode()

      // Initialize shadow
      updateShadowFromCode()

      // Handle files
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

    const contentData = {...content}
    const formData = new FormData()
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    const sectionData = {
      id: SECTION_ID,
      name: 'Đăng ký nhận tin',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 3,
      files: filesToSend
    }

    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }))

    const newFiles = filesToSend.filter(file => file.status === 'NEW')
    newFiles.forEach((fileDTO, index) => {
      const tempName = fileDTO.mappingTempUrl?.replace(TEMP_PREFIX, '') || fileDTO.tempName
      const uploadedFile = uploadedFiles.value.find(f => f.tempName === tempName)

      if (uploadedFile && uploadedFile.file) {
        formData.append('files', uploadedFile.file)
      }
    })

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

      uploadedFiles.value = []
      imagePreview.value = null
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
.newsletter-editor {
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
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 30px;
}

.setting-section {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.setting-section:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
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

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-input:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Input with Unit */
.input-with-unit {
  position: relative;
}

.input-with-unit .form-input {
  padding-right: 50px;
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

/* Image Upload */
.image-upload-container {
  margin-top: 10px;
}

.upload-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.upload-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 2px dashed #ced4da;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.upload-option:hover {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  transform: translateY(-2px);
}

.upload-option i {
  font-size: 2rem;
  color: #4a6cf7;
  margin-bottom: 10px;
}

.upload-option span {
  color: #495057;
  font-weight: 600;
  font-size: 0.9rem;
}

.upload-placeholder {
  border: 3px dashed #ced4da;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.upload-placeholder:hover {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
}

.upload-placeholder i {
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 15px;
  opacity: 0.7;
}

.upload-text {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 8px;
}

.highlight {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
}

.upload-hint {
  font-size: 0.85rem;
  color: #6c757d;
  opacity: 0.8;
}

.image-preview-area {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
}

.preview-header {
  padding: 12px 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header span {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.preview-actions {
  display: flex;
  gap: 8px;
}

.btn-icon-small {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.btn-icon-small:hover {
  background-color: #4a6cf7;
  color: white;
  border-color: #4a6cf7;
  transform: scale(1.05);
}

.btn-icon-small.btn-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}

.preview-image {
  padding: 20px;
  text-align: center;
  background-color: #f8f9fa;
}

.preview-image img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 6px;
}

.no-preview {
  padding: 30px;
  text-align: center;
  color: #6c757d;
}

.no-preview i {
  font-size: 2rem;
  margin-bottom: 10px;
  opacity: 0.5;
}

.image-info {
  padding: 15px;
  background-color: white;
  border-top: 1px solid #e9ecef;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item i {
  color: #6c757d;
  font-size: 0.9rem;
  width: 20px;
}

.alt-input,
.path-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.85rem;
}

/* Color Pickers */
.color-picker-group {
  margin-bottom: 15px;
}

.color-picker-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
}

.color-picker {
  width: 100%;
  height: 40px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px;
  background-color: white;
}

.color-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-input .color-picker {
  width: 50px;
  flex-shrink: 0;
}

.color-input .color-code {
  flex: 1;
}

.color-picker-with-preview {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px;
}

.color-picker-with-preview .color-picker-group {
  flex: 1;
  margin-bottom: 0;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  flex-shrink: 0;
}

/* Gradient Editor */
.gradient-editor .color-pickers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

.code-input {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  background-color: #f8f9fa;
}

/* Shadow Editor */
.shadow-editor {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.shadow-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.range-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.range-group label {
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
}

.range-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e9ecef;
  outline: none;
  -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4a6cf7;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.range-value {
  font-size: 0.85rem;
  color: #6c757d;
  text-align: right;
  margin-top: 5px;
}

/* Select */
.form-input select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: white;
  cursor: pointer;
}

.form-input select:focus {
  border-color: #4a6cf7;
  outline: none;
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

/* Responsive */
@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .form-row,
  .upload-options,
  .shadow-controls,
  .gradient-editor .color-pickers {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .tab-content {
    padding: 20px;
  }

  .navigation-tabs {
    flex-direction: column;
    padding: 0;
  }

  .tab-button {
    padding: 12px 20px;
    justify-content: center;
  }
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
</style>