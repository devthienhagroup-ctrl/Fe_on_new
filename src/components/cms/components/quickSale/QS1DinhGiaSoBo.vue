<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Định giá sơ bộ</h2>
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
          :class="{ active: activeTab === 'layout' }"
          @click="activeTab = 'layout'"
      >
        <i class="fas fa-columns"></i> Layout & Hình ảnh
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'title' }"
          @click="activeTab = 'title'"
      >
        <i class="fas fa-heading"></i> Tiêu đề & Nội dung
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'decor' }"
          @click="activeTab = 'decor'"
      >
        <i class="fas fa-palette"></i> Trang trí & Border
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Layout & Hình ảnh -->
      <div v-if="activeTab === 'layout'" class="layout-settings">
        <div class="settings-grid">
          <!-- Layout Settings -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Cấu trúc Layout</h3>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="content.layout.reverseColumns" />
                <span class="checkmark"></span>
                Đảo ngược thứ tự cột (Hình ảnh bên trái)
              </label>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="leftColumnWidth">Tỷ lệ cột trái</label>
                <div class="input-with-unit">
                  <input type="number" id="leftColumnWidth" v-model.number="content.layout.leftColumnWidth" step="0.1" min="0.5" max="3" />
                  <span class="unit">fr</span>
                </div>
              </div>
              <div class="form-group">
                <label for="rightColumnWidth">Tỷ lệ cột phải</label>
                <div class="input-with-unit">
                  <input type="number" id="rightColumnWidth" v-model.number="content.layout.rightColumnWidth" step="0.1" min="0.5" max="3" />
                  <span class="unit">fr</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="gap">Khoảng cách giữa cột</label>
              <div class="input-with-unit">
                <input type="text" id="gap" v-model="content.layout.gap" placeholder="30px" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>

          <!-- Hình ảnh chính -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Hình ảnh chính</h3>

            <div class="file-upload">
              <div class="file-upload-area" @click="triggerImageInput" @dragover.prevent @drop.prevent="handleImageDrop">
                <input
                    type="file"
                    ref="imageInput"
                    @change="handleImageUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Kích thước đề xuất: 600x400px</p>
              </div>

              <div v-if="imagePreview || content.image.src" class="upload-preview">
                <img :src="getImageUrl(content.image.src)" alt="Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewImage" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeImage" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!imagePreview && !content.image.src">
              <label for="image-url">Hoặc nhập URL ảnh</label>
              <input
                  type="text"
                  id="image-url"
                  v-model="content.image.src"
                  placeholder="/imgs/anh-dinh-gia-so-bo.png"
              />
            </div>

            <div class="form-group">
              <label for="image-alt">Alt text cho ảnh</label>
              <input
                  type="text"
                  id="image-alt"
                  v-model="content.image.alt"
                  placeholder="Mô tả hình ảnh"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="image-border-radius">Bo góc ảnh</label>
                <div class="input-with-unit">
                  <input type="text" id="image-border-radius" v-model="content.image.css.borderRadius" placeholder="10px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Tiêu đề & Nội dung -->
      <div v-if="activeTab === 'title'" class="title-content-settings">
        <div class="settings-grid">
          <!-- Icon & Tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-icons"></i> Icon & Tiêu đề</h3>

            <div class="file-upload compact">
              <label><i class="fas fa-upload"></i> Tải lên icon tiêu đề</label>
              <div class="file-upload-area" @click="triggerIconInput" @dragover.prevent @drop.prevent="handleIconDrop">
                <input
                    type="file"
                    ref="iconInput"
                    @change="handleIconUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả icon vào đây</p>
              </div>

              <div v-if="iconPreview || content.title.iconUrl" class="upload-preview">
                <img :src="getImageUrl(content.title.iconUrl)" alt="Icon Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewIcon" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeIcon" title="Xóa icon">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!iconPreview && !content.title.iconUrl">
              <label for="icon-url">URL icon</label>
              <input
                  type="text"
                  id="icon-url"
                  v-model="content.title.iconUrl"
                  placeholder="/imgs/icon-dinh-gia-so-bo.png"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="icon-width">Chiều rộng icon</label>
                <div class="input-with-unit">
                  <input type="number" id="icon-width" v-model.number="content.title.iconWidth" min="50" max="200" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="icon-height">Chiều cao icon</label>
                <div class="input-with-unit">
                  <input type="number" id="icon-height" v-model.number="content.title.iconHeight" min="50" max="200" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="circle-size">Kích thước vòng tròn nền</label>
              <div class="input-with-unit">
                <input type="number" id="circle-size" v-model.number="content.title.circleSize" min="50" max="200" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="order-number">Số thứ tự</label>
              <input
                  type="number"
                  id="order-number"
                  v-model.number="content.title.orderNumber"
                  min="1"
                  max="10"
              />
            </div>

            <div class="form-group">
              <label for="title-text">Tiêu đề</label>
              <input
                  type="text"
                  id="title-text"
                  v-model="content.title.titleText"
                  placeholder="Định giá sơ bộ"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="title-height">Chiều cao component</label>
                <div class="input-with-unit">
                  <input type="text" id="title-height" v-model="content.title.componentHeight" placeholder="80px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="title-width">Chiều rộng component</label>
                <div class="input-with-unit">
                  <input type="text" id="title-width" v-model="content.title.componentWidth" placeholder="100%" />
                  <span class="unit">%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Nội dung chính -->
          <div class="setting-section">
            <h3><i class="fas fa-align-left"></i> Nội dung chính</h3>

            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label for="card-content">Nội dung thẻ</label>
                <AdvancedEditModal
                    v-model="content.content.text"
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
                <div class="tiptap" v-html="content.content.text"></div>
              </div>
            </div>



            <div class="form-group">
              <label for="content-padding">Padding nội dung</label>
              <input
                  type="text"
                  id="content-padding"
                  v-model="content.content.css.padding"
                  placeholder="50px 50px 10px"
              />
            </div>

            <div class="form-group">
              <label for="content-border-radius">Bo góc nội dung</label>
              <div class="input-with-unit">
                <input type="text" id="content-border-radius" v-model="content.content.css.borderRadius" placeholder="150px" />
                <span class="unit">px</span>
              </div>
            </div>

            <!-- Link -->
            <div class="form-group">
              <label for="link-text">Văn bản link</label>
              <input
                  type="text"
                  id="link-text"
                  v-model="content.content.link.text"
                  placeholder="Xem chi tiết"
              />
            </div>

            <div class="form-group">
              <label for="link-to">URL link</label>
              <input
                  type="text"
                  id="link-to"
                  v-model="content.content.link.to"
                  placeholder="/dinh-gia-bds"
              />
            </div>
          </div>

          <!-- Button -->
          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm</h3>

            <div class="form-group">
              <label for="button-text">Văn bản nút</label>
              <input
                  type="text"
                  id="button-text"
                  v-model="content.button.text"
                  placeholder="Đăng ký ngay"
              />
            </div>

            <div class="color-input-group">
              <label>Màu nền nút</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.button.backgroundColor" />
                <input type="text" v-model="content.button.backgroundColor" placeholder="#0827af" />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu hover nút</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.button.hoverColor" />
                <input type="text" v-model="content.button.hoverColor" placeholder="#041b6a" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="button-font-size">Kích thước chữ</label>
                <div class="input-with-unit">
                  <input type="text" id="button-font-size" v-model="content.button.fontSize" placeholder="17px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="button-width">Chiều rộng nút</label>
                <input
                    type="text"
                    id="button-width"
                    v-model="content.button.width"
                    placeholder="40%"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="button-min-width">Chiều rộng tối thiểu</label>
              <div class="input-with-unit">
                <input type="text" id="button-min-width" v-model="content.button.minWidth" placeholder="150px" />
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="button-padding">Padding nút</label>
                <input
                    type="text"
                    id="button-padding"
                    v-model="content.button.css.padding"
                    placeholder="12px 24px"
                />
              </div>
              <div class="form-group">
                <label for="button-border-radius">Bo góc nút</label>
                <div class="input-with-unit">
                  <input type="text" id="button-border-radius" v-model="content.button.css.borderRadius" placeholder="50px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Trang trí & Border -->
      <div v-if="activeTab === 'decor'" class="decor-settings">
        <div class="settings-grid">
          <!-- Trang trí 1 -->
          <div class="setting-section">
            <h3><i class="fas fa-star"></i> Trang trí 1 (Trái dưới)</h3>

            <div class="file-upload compact">
              <div class="file-upload-area" @click="triggerDecor1Input" @dragover.prevent @drop.prevent="handleDecor1Drop">
                <input
                    type="file"
                    ref="decor1Input"
                    @change="handleDecor1Upload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh trang trí</p>
              </div>

              <div v-if="decor1Preview || content.decor1.src" class="upload-preview">
                <img :src="getImageUrl(content.decor1.src)" alt="Decor 1 Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewDecor1" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeDecor1" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!decor1Preview && !content.decor1.src">
              <label for="decor1-url">URL ảnh trang trí</label>
              <input
                  type="text"
                  id="decor1-url"
                  v-model="content.decor1.src"
                  placeholder="/imgs/trang-tri-1.png"
              />
            </div>

            <div class="form-group">
              <label for="decor1-alt">Alt text</label>
              <input
                  type="text"
                  id="decor1-alt"
                  v-model="content.decor1.alt"
                  placeholder=""
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="decor1-width">Chiều rộng</label>
                <input
                    type="text"
                    id="decor1-width"
                    v-model="content.decor1.css.width"
                    placeholder="auto"
                />
              </div>
              <div class="form-group">
                <label for="decor1-height">Chiều cao</label>
                <div class="input-with-unit">
                  <input type="text" id="decor1-height" v-model="content.decor1.css.height" placeholder="100px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Vị trí</label>
              <div class="position-controls">
                <div class="position-row">
                  <div class="position-input">
                    <label>Left</label>
                    <input type="text" v-model="content.decor1.position.left" placeholder="0" />
                  </div>
                  <div class="position-input">
                    <label>Right</label>
                    <input type="text" v-model="content.decor1.position.right" placeholder="auto" />
                  </div>
                </div>
                <div class="position-row">
                  <div class="position-input">
                    <label>Top</label>
                    <input type="text" v-model="content.decor1.position.top" placeholder="auto" />
                  </div>
                  <div class="position-input">
                    <label>Bottom</label>
                    <input type="text" v-model="content.decor1.position.bottom" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Trang trí 2 -->
          <div class="setting-section">
            <h3><i class="fas fa-star"></i> Trang trí 2 (Phải dưới)</h3>

            <div class="file-upload compact">
              <div class="file-upload-area" @click="triggerDecor2Input" @dragover.prevent @drop.prevent="handleDecor2Drop">
                <input
                    type="file"
                    ref="decor2Input"
                    @change="handleDecor2Upload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh trang trí</p>
              </div>

              <div v-if="decor2Preview || content.decor2.src" class="upload-preview">
                <img :src="getImageUrl(content.decor2.src)" alt="Decor 2 Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewDecor2" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeDecor2" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!decor2Preview && !content.decor2.src">
              <label for="decor2-url">URL ảnh trang trí</label>
              <input
                  type="text"
                  id="decor2-url"
                  v-model="content.decor2.src"
                  placeholder="/imgs/trang-tri-2.png"
              />
            </div>

            <div class="form-group">
              <label for="decor2-alt">Alt text</label>
              <input
                  type="text"
                  id="decor2-alt"
                  v-model="content.decor2.alt"
                  placeholder=""
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="decor2-width">Chiều rộng</label>
                <input
                    type="text"
                    id="decor2-width"
                    v-model="content.decor2.css.width"
                    placeholder="auto"
                />
              </div>
              <div class="form-group">
                <label for="decor2-height">Chiều cao</label>
                <div class="input-with-unit">
                  <input type="text" id="decor2-height" v-model="content.decor2.css.height" placeholder="700px" />
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Vị trí</label>
              <div class="position-controls">
                <div class="position-row">
                  <div class="position-input">
                    <label>Left</label>
                    <input type="text" v-model="content.decor2.position.left" placeholder="auto" />
                  </div>
                  <div class="position-input">
                    <label>Right</label>
                    <input type="text" v-model="content.decor2.position.right" placeholder="0" />
                  </div>
                </div>
                <div class="position-row">
                  <div class="position-input">
                    <label>Top</label>
                    <input type="text" v-model="content.decor2.position.top" placeholder="auto" />
                  </div>
                  <div class="position-input">
                    <label>Bottom</label>
                    <input type="text" v-model="content.decor2.position.bottom" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Border -->
          <div class="setting-section">
            <h3><i class="fas fa-border-style"></i> Border (Đường viền)</h3>

            <div class="color-input-group">
              <label>Màu border</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.border.color" />
                <input type="text" v-model="content.border.color" placeholder="#c2cbf0" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="border-width">Độ dày border</label>
                <div class="input-with-unit">
                  <input type="text" id="border-width" v-model="content.border.width" placeholder="5px" />
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="border-style">Kiểu border</label>
                <select id="border-style" v-model="content.border.style">
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                  <option value="groove">Groove</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Vị trí & Kích thước</label>
              <div class="position-controls">
                <div class="position-row">
                  <div class="position-input">
                    <label>Top</label>
                    <input type="text" v-model="content.border.position.top" placeholder="-10px" />
                  </div>
                  <div class="position-input">
                    <label>Right</label>
                    <input type="text" v-model="content.border.position.right" placeholder="0" />
                  </div>
                </div>
                <div class="position-row">
                  <div class="position-input">
                    <label>Width</label>
                    <input type="text" v-model="content.border.position.width" placeholder="80%" />
                  </div>
                  <div class="position-input">
                    <label>Height</label>
                    <input type="text" v-model="content.border.position.height" placeholder="110%" />
                  </div>
                </div>
                <div class="position-row">
                  <div class="position-input full-width">
                    <label>Margin Right</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.border.position.marginRight" placeholder="75px" />
                      <span class="unit">px</span>
                    </div>
                  </div>
                </div>
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
          <h3>Xem trước ảnh</h3>
          <button class="btn-icon btn-close-modal" @click="closePreviewModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="previewImageUrl" alt="Xem trước" v-if="previewImageUrl" />
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
import { ref, reactive, onMounted } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const activeTab = ref('layout')
const isLoading = ref(false)

// Content structure based on JSON data
const content = reactive({
  id: 'section1',
  layout: {
    reverseColumns: false,
    leftColumnWidth: 1,
    rightColumnWidth: 1.4,
    gap: '30px'
  },
  decor1: {
    src: '/imgs/trang-tri-1.png',
    alt: '',
    position: {
      left: '0',
      right: 'auto',
      bottom: '0',
      top: 'auto'
    },
    css: {
      height: '100px',
      width: 'auto'
    }
  },
  decor2: {
    src: '/imgs/trang-tri-2.png',
    alt: '',
    position: {
      left: 'auto',
      right: '0',
      bottom: '0',
      top: 'auto'
    },
    css: {
      height: '700px',
      width: 'auto'
    }
  },
  title: {
    circleSize: 100,
    iconHeight: 109,
    iconWidth: 109,
    orderNumber: 1,
    componentHeight: '80px',
    componentWidth: '100%',
    iconUrl: '/imgs/icon-dinh-gia-so-bo.png',
    titleText: 'Định giá sơ bộ'
  },
  content: {
    text: 'Đây là nền tảng đầu tiên và quan trọng nhất trong quy trình. Đội ngũ chuyên viên sẽ tiến hành định giá sơ bộ thông qua hệ thống chuyên nghiệp, giúp khách hàng biết được giá trị thật của bất động sản trước khi bán.',
    link: {
      to: '/dinh-gia-bds',
      text: 'Xem chi tiết'
    },
    css: {
      borderRadius: '150px',
      padding: '50px 50px 10px',
      fontSize: '17px'
    }
  },
  image: {
    src: '/imgs/anh-dinh-gia-so-bo.png',
    alt: 'dgsb',
    css: {
      borderRadius: '10px'
    }
  },
  button: {
    text: 'Đăng ký ngay',
    backgroundColor: '#0827af',
    hoverColor: '#041b6a',
    fontSize: '17px',
    width: '40%',
    minWidth: '150px',
    css: {
      borderRadius: '50px',
      padding: '12px 24px'
    }
  },
  border: {
    color: '#c2cbf0',
    width: '5px',
    style: 'dashed',
    position: {
      top: '-10px',
      right: '0',
      width: '80%',
      height: '110%',
      marginRight: '75px'
    }
  }
})

// UI State
const imagePreview = ref(null)
const iconPreview = ref(null)
const decor1Preview = ref(null)
const decor2Preview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const imageInput = ref(null)
const iconInput = ref(null)
const decor1Input = ref(null)
const decor2Input = ref(null)

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
import { baseImgaeUrl } from "../../../../assets/js/global.js";
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 15

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

      // Assuming data structure has section1
      const sectionData = data.section1 || data

      // Update content with loaded data
      Object.assign(content, sectionData)

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
      section1: { ...content }
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Định giá sơ bộ',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 1,
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
      imagePreview.value = null
      iconPreview.value = null
      decor1Preview.value = null
      decor2Preview.value = null

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
  if (content.image.src === tempUrl) {
    content.image.src = realUrl
  }
  if (content.title.iconUrl === tempUrl) {
    content.title.iconUrl = realUrl
  }
  if (content.decor1.src === tempUrl) {
    content.decor1.src = realUrl
  }
  if (content.decor2.src === tempUrl) {
    content.decor2.src = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
// Main image
const triggerImageInput = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh chính', imagePreview, 'image.src')
  }
  event.target.value = ''
}

const handleImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh chính', imagePreview, 'image.src')
  }
}

const removeImage = () => {
  if (content.image.src) {
    handleRemoveFile(content.image.src, 'image.src', imagePreview)
  }
}

// Icon
const triggerIconInput = () => {
  iconInput.value?.click()
}

const handleIconUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Icon', iconPreview, 'title.iconUrl')
  }
  event.target.value = ''
}

const handleIconDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Icon', iconPreview, 'title.iconUrl')
  }
}

const removeIcon = () => {
  if (content.title.iconUrl) {
    handleRemoveFile(content.title.iconUrl, 'title.iconUrl', iconPreview)
  }
}

// Decor 1
const triggerDecor1Input = () => {
  decor1Input.value?.click()
}

const handleDecor1Upload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Trang trí 1', decor1Preview, 'decor1.src')
  }
  event.target.value = ''
}

const handleDecor1Drop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Trang trí 1', decor1Preview, 'decor1.src')
  }
}

const removeDecor1 = () => {
  if (content.decor1.src) {
    handleRemoveFile(content.decor1.src, 'decor1.src', decor1Preview)
  }
}

// Decor 2
const triggerDecor2Input = () => {
  decor2Input.value?.click()
}

const handleDecor2Upload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Trang trí 2', decor2Preview, 'decor2.src')
  }
  event.target.value = ''
}

const handleDecor2Drop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Trang trí 2', decor2Preview, 'decor2.src')
  }
}

const removeDecor2 = () => {
  if (content.decor2.src) {
    handleRemoveFile(content.decor2.src, 'decor2.src', decor2Preview)
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
const previewImage = () => {
  if (content.image.src) {
    previewImageUrl.value = getImageUrl(content.image.src)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const previewIcon = () => {
  if (content.title.iconUrl) {
    previewImageUrl.value = getImageUrl(content.title.iconUrl)
    showPreviewModal.value = true
  } else {
    showToast('Không có icon để xem trước', 'warning')
  }
}

const previewDecor1 = () => {
  if (content.decor1.src) {
    previewImageUrl.value = getImageUrl(content.decor1.src)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh trang trí để xem trước', 'warning')
  }
}

const previewDecor2 = () => {
  if (content.decor2.src) {
    previewImageUrl.value = getImageUrl(content.decor2.src)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh trang trí để xem trước', 'warning')
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

/* Position Controls */
.position-controls {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
}

.position-row {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.position-input {
  flex: 1;
}

.position-input.full-width {
  flex: 2;
}

.position-input label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.85rem;
  color: #6c757d;
}

.position-input input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* File Upload */
.file-upload {
  margin-bottom: 20px;
}

.file-upload.compact {
  margin-top: 10px;
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
  background-color: #dc3545;
  color: white;
  transform: scale(1.1);
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

  .navigation-tabs {
    padding: 0 20px;
    flex-direction: column;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.9rem;
    justify-content: center;
  }

  .position-row {
    flex-direction: column;
    gap: 10px;
  }

  .position-input.full-width {
    flex: 1;
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