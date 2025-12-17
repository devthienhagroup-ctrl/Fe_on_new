<template>
  <div class="news-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Tin tức</h2>
      <div class="header-controls">
        <button class="btn btn-primary" @click="addSolutionItem" v-if="activeTab === 'solutions'">
          <i class="fas fa-plus"></i> Thêm Giải pháp Mới
        </button>
        <button class="btn btn-primary" @click="addNewsItem" v-if="activeTab === 'news'">
          <i class="fas fa-plus"></i> Thêm Tin tức Mới
        </button>
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
          :class="{ active: activeTab === 'solutions' }"
          @click="activeTab = 'solutions'"
      >
        <i class="fas fa-lightbulb"></i> Giải pháp ({{ settings.solutionItems.length }})
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'news' }"
          @click="activeTab = 'news'"
      >
        <i class="fas fa-newspaper"></i> Tin tức ({{ settings.newsItems.length }})
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab cài đặt chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề</h3>
            <div class="form-group">
              <label for="left-column-title">Tiêu đề cột trái</label>
              <input
                  type="text"
                  id="left-column-title"
                  v-model="settings.leftColumnTitle"
                  placeholder="Giải pháp bán bất động sản"
              />
            </div>
            <div class="form-group">
              <label for="right-column-title">Tiêu đề cột phải</label>
              <input
                  type="text"
                  id="right-column-title"
                  v-model="settings.rightColumnTitle"
                  placeholder="Tin tức"
              />
            </div>
          </div>

          <!-- Văn bản -->
<!--          <div class="setting-section">-->
<!--            <h3><i class="fas fa-font"></i> Văn bản</h3>-->
<!--            <div class="form-group">-->
<!--              <label for="view-all-text">Xem tất cả</label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  id="view-all-text"-->
<!--                  v-model="settings.viewAllText"-->
<!--                  placeholder="Xem tất cả"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="form-group">-->
<!--              <label for="read-more-text">Xem thêm</label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  id="read-more-text"-->
<!--                  v-model="settings.readMoreText"-->
<!--                  placeholder="Xem thêm"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="form-group">-->
<!--              <label for="new-tag-text">Nhãn Tin mới</label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  id="new-tag-text"-->
<!--                  v-model="settings.newTagText"-->
<!--                  placeholder="Tin mới"-->
<!--              />-->
<!--            </div>-->
<!--            <div class="form-group">-->
<!--              <label for="hot-tag-text">Nhãn Tin nổi bật</label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  id="hot-tag-text"-->
<!--                  v-model="settings.hotTagText"-->
<!--                  placeholder="Tin nổi bật"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->

          <!-- Liên kết -->
<!--          <div class="setting-section">-->
<!--            <h3><i class="fas fa-link"></i> Liên kết</h3>-->
<!--            <div class="form-group">-->
<!--              <label for="news-link">Liên kết tin tức</label>-->
<!--              <input-->
<!--                  type="text"-->
<!--                  id="news-link"-->
<!--                  v-model="settings.newsLink"-->
<!--                  placeholder="/tin-tuc"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->

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
                <label>Màu phụ</label>
                <div class="color-input">
                  <input type="color" v-model="settings.secondaryColor" />
                  <input type="text" v-model="settings.secondaryColor" placeholder="#0629BE" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu tiến trình</label>
                <div class="color-input">
                  <input type="color" v-model="settings.progressColor" />
                  <input type="text" v-model="settings.progressColor" placeholder="#031358" />
                </div>
              </div>
            </div>
          </div>

          <!-- Gradient -->
          <!-- NewsEditor.vue - phần Gradient trong template -->

          <!-- Gradient -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Gradient</h3>

            <!-- Gradient nút -->
            <div class="form-group">
              <label for="button-gradient">Gradient nút</label>
              <div class="gradient-picker-group">
                <div class="color-pair-inputs">
                  <div class="color-input">
                    <label>Màu bắt đầu</label>
                    <input type="color" v-model="buttonGradientStart" @input="updateButtonGradient" />
                    <input type="text" v-model="buttonGradientStart" placeholder="#031358" @input="updateButtonGradient" />
                  </div>
                  <div class="color-input">
                    <label>Màu kết thúc</label>
                    <input type="color" v-model="buttonGradientEnd" @input="updateButtonGradient" />
                    <input type="text" v-model="buttonGradientEnd" placeholder="#0629BE" @input="updateButtonGradient" />
                  </div>
                </div>
                <div class="gradient-preview" :style="{ background: settings.buttonGradient }"></div>
                <input
                    type="text"
                    id="button-gradient"
                    v-model="settings.buttonGradient"
                    placeholder="linear-gradient(to bottom, #031358, #0629BE)"
                    @input="parseButtonGradient"
                    style="margin-top: 10px;"
                />
              </div>
            </div>

            <!-- Gradient nhãn -->
            <div class="form-group">
              <label for="tag-gradient">Gradient nhãn</label>
              <div class="gradient-picker-group">
                <div class="color-pair-inputs">
                  <div class="color-input">
                    <label>Màu bắt đầu</label>
                    <input type="color" v-model="tagGradientStart" @input="updateTagGradient" />
                    <input type="text" v-model="tagGradientStart" placeholder="#031358" @input="updateTagGradient" />
                  </div>
                  <div class="color-input">
                    <label>Màu kết thúc</label>
                    <input type="color" v-model="tagGradientEnd" @input="updateTagGradient" />
                    <input type="text" v-model="tagGradientEnd" placeholder="#0629BE" @input="updateTagGradient" />
                  </div>
                </div>
                <div class="gradient-preview" :style="{ background: settings.tagGradient }"></div>
                <input
                    type="text"
                    id="tag-gradient"
                    v-model="settings.tagGradient"
                    placeholder="linear-gradient(135deg, #031358, #0629BE)"
                    @input="parseTagGradient"
                    style="margin-top: 10px;"
                />
              </div>
            </div>

            <!-- Gradient phủ ảnh -->
            <div class="form-group">
              <label for="image-overlay-gradient">Gradient phủ ảnh</label>
              <div class="gradient-picker-group">
                <div class="color-pair-inputs">
                  <div class="color-input">
                    <label>Màu trên (có opacity)</label>
                    <input type="color" v-model="imageOverlayStartColor" @input="updateImageOverlayGradient" />
                    <input type="text" v-model="imageOverlayStart" placeholder="rgba(0,0,0,0.3)" @input="updateImageOverlayGradient" />
                  </div>
                  <div class="color-input">
                    <label>Màu dưới (có opacity)</label>
                    <input type="color" v-model="imageOverlayEndColor" @input="updateImageOverlayGradient" />
                    <input type="text" v-model="imageOverlayEnd" placeholder="rgba(0,0,0,0.7)" @input="updateImageOverlayGradient" />
                  </div>
                </div>
                <div class="gradient-preview" :style="{ background: settings.imageOverlayGradient }"></div>
                <input
                    type="text"
                    id="image-overlay-gradient"
                    v-model="settings.imageOverlayGradient"
                    placeholder="linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))"
                    @input="parseImageOverlayGradient"
                    style="margin-top: 10px;"
                />
              </div>
            </div>

            <!-- Gradient phủ tin tức -->
            <div class="form-group">
              <label for="news-overlay-gradient">Gradient phủ tin tức</label>
              <div class="gradient-picker-group">
                <div class="color-pair-inputs">
                  <div class="color-input">
                    <label>Màu bắt đầu</label>
                    <input type="color" v-model="newsOverlayStartColor" @input="updateNewsOverlayGradient" />
                    <input type="text" v-model="newsOverlayStart" placeholder="transparent" @input="updateNewsOverlayGradient" />
                  </div>
                  <div class="color-input">
                    <label>Màu kết thúc</label>
                    <input type="color" v-model="newsOverlayEndColor" @input="updateNewsOverlayGradient" />
                    <input type="text" v-model="newsOverlayEnd" placeholder="rgba(3, 19, 88, 0.1)" @input="updateNewsOverlayGradient" />
                  </div>
                </div>
                <div class="gradient-preview" :style="{ background: settings.newsOverlayGradient }"></div>
                <input
                    type="text"
                    id="news-overlay-gradient"
                    v-model="settings.newsOverlayGradient"
                    placeholder="linear-gradient(to bottom, transparent 0%, rgba(3, 19, 88, 0.1) 100%)"
                    @input="parseNewsOverlayGradient"
                    style="margin-top: 10px;"
                />
              </div>
            </div>
          </div>

          <!-- Biểu tượng -->
          <div class="setting-section">
            <h3><i class="fas fa-icons"></i> Biểu tượng</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="arrow-icon">Biểu tượng mũi tên</label>
                <IconPicker v-model="settings.arrowIcon"/>
              </div>
              <div class="form-group">
                <label for="arrow-right-icon">Biểu tượng mũi tên phải</label>
                <IconPicker
                    v-model="settings.arrowRightIcon"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="calendar-icon">Biểu tượng lịch</label>
                <IconPicker
                    v-model="settings.calendarIcon"
                />
              </div>
              <div class="form-group">
                <label for="user-icon">Biểu tượng người dùng</label>
                <IconPicker
                    v-model="settings.userIcon"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="new-icon">Biểu tượng tin mới</label>
                <IconPicker
                    v-model="settings.newIcon"
                />
              </div>
              <div class="form-group">
                <label for="hot-icon">Biểu tượng tin nổi bật</label>
                <IconPicker
                    v-model="settings.hotIcon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab danh sách giải pháp -->
      <div v-if="activeTab === 'solutions'" class="items-management">
        <div class="items-container">
          <!-- Danh sách giải pháp -->
          <div class="items-list">
            <div
                v-for="(item, index) in settings.solutionItems"
                :key="item.id"
                class="item-item"
                :class="{ active: activeSolutionIndex === index }"
                @mouseenter="hoveredSolutionIndex = index"
                @mouseleave="hoveredSolutionIndex = -1"
                @click="selectSolution(index)"
            >
              <div class="item-content">
                <div class="item-image" v-if="item.image">
                  <img :src="getImageUrl(item.image)" alt="Preview" />
                </div>
                <div class="item-info">
                  <h4>{{ item.title || 'Giải pháp chưa có tên' }}</h4>
                  <p class="item-details">Ngày: {{ item.postedDate }} • Tác giả: {{ item.author }}</p>
                </div>
              </div>
              <div class="item-actions" v-show="hoveredSolutionIndex === index">
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeSolutionItem(index)"
                    :disabled="settings.solutionItems.length <= 1"
                    title="Xóa giải pháp"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Form chỉnh sửa giải pháp -->
          <div v-if="activeSolutionItem !== null" class="item-editor">
            <div class="editor-header">
              <h3>Chỉnh sửa giải pháp {{ activeSolutionIndex + 1 }}</h3>
              <div class="editor-actions">
                <button class="btn btn-secondary" @click="duplicateSolutionItem">
                  <i class="fas fa-copy"></i> Nhân bản
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveSolutionItemUp(activeSolutionIndex)"
                    :disabled="activeSolutionIndex === 0"
                    title="Di chuyển lên"
                >
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveSolutionItemDown(activeSolutionIndex)"
                    :disabled="activeSolutionIndex === settings.solutionItems.length - 1"
                    title="Di chuyển xuống"
                >
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="solution-title">
                <i class="fas fa-heading"></i> Tiêu đề
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="solution-title"
                  v-model="activeSolutionItem.title"
                  placeholder="Nhập tiêu đề giải pháp..."
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="solution-date">
                  <i class="far fa-calendar"></i> Ngày đăng
                </label>
                <input
                    type="text"
                    id="solution-date"
                    v-model="activeSolutionItem.postedDate"
                    placeholder="12/10/2024"
                />
              </div>
              <div class="form-group">
                <label for="solution-author">
                  <i class="far fa-user"></i> Tác giả
                </label>
                <input
                    type="text"
                    id="solution-author"
                    v-model="activeSolutionItem.author"
                    placeholder="Nguyễn Thanh Tùng"
                />
              </div>
            </div>

            <div class="file-upload-section">
              <label><i class="fas fa-upload"></i> Hình ảnh giải pháp</label>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerSolutionImageInput" @dragover.prevent @drop.prevent="handleSolutionImageDrop">
                  <input type="file" ref="solutionImageInput" @change="handleSolutionImageUpload" accept="image/*" style="display: none" />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                </div>
                <div v-if="activeSolutionItem.image || solutionImagePreview" class="upload-preview">
                  <img :src="getImageUrl(activeSolutionItem.image)" alt="Preview" />
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewSolutionImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeSolutionImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              <p class="input-hint">Tải ảnh lên từ máy tính của bạn</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab danh sách tin tức -->
      <div v-if="activeTab === 'news'" class="items-management">
        <div class="items-container">
          <!-- Danh sách tin tức -->
          <div class="items-list">
            <div
                v-for="(item, index) in settings.newsItems"
                :key="item.id"
                class="item-item"
                :class="{ active: activeNewsIndex === index }"
                @mouseenter="hoveredNewsIndex = index"
                @mouseleave="hoveredNewsIndex = -1"
                @click="selectNews(index)"
            >
              <div class="item-content">
                <div class="item-image" v-if="item.image">
                  <img :src="getImageUrl(item.image)" alt="Preview" />
                </div>
                <div class="item-info">
                  <h4>{{ item.title || 'Tin tức chưa có tên' }}</h4>
                  <p class="item-details">Ngày: {{ item.postedDate }}</p>
                </div>
              </div>
              <div class="item-actions" v-show="hoveredNewsIndex === index">
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeNewsItem(index)"
                    :disabled="settings.newsItems.length <= 1"
                    title="Xóa tin tức"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Form chỉnh sửa tin tức -->
          <div v-if="activeNewsItem !== null" class="item-editor">
            <div class="editor-header">
              <h3>Chỉnh sửa tin tức {{ activeNewsIndex + 1 }}</h3>
              <div class="editor-actions">
                <button class="btn btn-secondary" @click="duplicateNewsItem">
                  <i class="fas fa-copy"></i> Nhân bản
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveNewsItemUp(activeNewsIndex)"
                    :disabled="activeNewsIndex === 0"
                    title="Di chuyển lên"
                >
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveNewsItemDown(activeNewsIndex)"
                    :disabled="activeNewsIndex === settings.newsItems.length - 1"
                    title="Di chuyển xuống"
                >
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="news-title">
                <i class="fas fa-heading"></i> Tiêu đề
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="news-title"
                  v-model="activeNewsItem.title"
                  placeholder="Nhập tiêu đề tin tức..."
              />
            </div>

            <div class="form-group">
              <label for="news-date">
                <i class="far fa-calendar"></i> Ngày đăng
              </label>
              <input
                  type="text"
                  id="news-date"
                  v-model="activeNewsItem.postedDate"
                  placeholder="21/10/2025"
              />
            </div>

            <div class="file-upload-section">
              <label><i class="fas fa-upload"></i> Hình ảnh tin tức</label>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerNewsImageInput" @dragover.prevent @drop.prevent="handleNewsImageDrop">
                  <input type="file" ref="newsImageInput" @change="handleNewsImageUpload" accept="image/*" style="display: none" />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                </div>
                <div v-if="activeNewsItem.image || newsImagePreview" class="upload-preview">
                  <img :src="getImageUrl(activeNewsItem.image)" alt="Preview" />
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewNewsImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeNewsImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              <p class="input-hint">Tải ảnh lên từ máy tính của bạn</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xem trước ảnh -->
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
            <img :src="getImageUrl(previewImageUrl)" alt="Xem trước ảnh" />
            <div v-if="!previewImageUrl" class="preview-placeholder">
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
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../../../../api/api.js'


// ========== GRADIENT MANAGEMENT ==========
// Button Gradient
const buttonGradientStart = ref('#031358')
const buttonGradientEnd = ref('#0629BE')

// Tag Gradient
const tagGradientStart = ref('#031358')
const tagGradientEnd = ref('#0629BE')

// Image Overlay Gradient
const imageOverlayStart = ref('rgba(0,0,0,0.3)')
const imageOverlayEnd = ref('rgba(0,0,0,0.7)')
const imageOverlayStartColor = ref('#000000')
const imageOverlayEndColor = ref('#000000')

// News Overlay Gradient
const newsOverlayStart = ref('transparent')
const newsOverlayEnd = ref('rgba(3, 19, 88, 0.1)')
const newsOverlayStartColor = ref('#ffffff')
const newsOverlayEndColor = ref('#031358')

// Parse gradient từ chuỗi
const parseGradient = (gradientString) => {
  const regex = /linear-gradient\([^,]+,?\s*(rgba?\([^)]+\)|\#[0-9a-fA-F]{3,8}|[a-z]+)\s*,\s*(rgba?\([^)]+\)|\#[0-9a-fA-F]{3,8}|[a-z]+)\)/i
  const match = gradientString.match(regex)
  if (match) {
    return {
      color1: match[1],
      color2: match[2]
    }
  }
  return null
}

// Parse RGBA thành hex
const rgbaToHex = (rgba) => {
  if (rgba === 'transparent') return '#ffffff'

  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0')
    const g = parseInt(match[2]).toString(16).padStart(2, '0')
    const b = parseInt(match[3]).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
  }
  return rgba // Trả về nguyên gốc nếu không phải rgba
}

// Parse hex thành rgba
const hexToRgba = (hex, alpha = 1) => {
  if (hex.startsWith('rgba')) return hex

  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Button Gradient Functions
const updateButtonGradient = () => {
  settings.buttonGradient = `linear-gradient(to bottom, ${buttonGradientStart.value}, ${buttonGradientEnd.value})`
}

const parseButtonGradient = () => {
  const result = parseGradient(settings.buttonGradient)
  if (result) {
    buttonGradientStart.value = result.color1
    buttonGradientEnd.value = result.color2
  }
}

// Tag Gradient Functions
const updateTagGradient = () => {
  settings.tagGradient = `linear-gradient(135deg, ${tagGradientStart.value}, ${tagGradientEnd.value})`
}

const parseTagGradient = () => {
  const result = parseGradient(settings.tagGradient)
  if (result) {
    tagGradientStart.value = result.color1
    tagGradientEnd.value = result.color2
  }
}

// Image Overlay Gradient Functions
const updateImageOverlayGradient = () => {
  // Giữ nguyên opacity nếu người dùng chỉ thay đổi màu chính
  const startOpacity = imageOverlayStart.value.includes('rgba') ?
      parseFloat(imageOverlayStart.value.match(/[\d.]+\)$/)?.[0]?.replace(')', '') || 0.3) : 0.3
  const endOpacity = imageOverlayEnd.value.includes('rgba') ?
      parseFloat(imageOverlayEnd.value.match(/[\d.]+\)$/)?.[0]?.replace(')', '') || 0.7) : 0.7

  const startRgba = hexToRgba(imageOverlayStartColor.value, startOpacity)
  const endRgba = hexToRgba(imageOverlayEndColor.value, endOpacity)

  imageOverlayStart.value = startRgba
  imageOverlayEnd.value = endRgba
  settings.imageOverlayGradient = `linear-gradient(to bottom, ${startRgba}, ${endRgba})`
}

const parseImageOverlayGradient = () => {
  const result = parseGradient(settings.imageOverlayGradient)
  if (result) {
    imageOverlayStart.value = result.color1
    imageOverlayEnd.value = result.color2

    // Extract hex color từ rgba
    imageOverlayStartColor.value = rgbaToHex(result.color1)
    imageOverlayEndColor.value = rgbaToHex(result.color2)
  }
}

// News Overlay Gradient Functions
const updateNewsOverlayGradient = () => {
  // Xử lý transparent đặc biệt
  const startColor = newsOverlayStart.value === 'transparent' ?
      'transparent' :
      hexToRgba(newsOverlayStartColor.value, 0)

  const endOpacity = newsOverlayEnd.value.includes('rgba') ?
      parseFloat(newsOverlayEnd.value.match(/[\d.]+\)$/)?.[0]?.replace(')', '') || 0.1) : 0.1
  const endRgba = hexToRgba(newsOverlayEndColor.value, endOpacity)

  newsOverlayStart.value = startColor
  newsOverlayEnd.value = endRgba
  settings.newsOverlayGradient = `linear-gradient(to bottom, ${startColor} 0%, ${endRgba} 100%)`
}

const parseNewsOverlayGradient = () => {
  const regex = /linear-gradient\([^,]+,?\s*(rgba?\([^)]+\)|\#[0-9a-fA-F]{3,8}|[a-z]+)\s*\d*%?\s*,\s*(rgba?\([^)]+\)|\#[0-9a-fA-F]{3,8}|[a-z]+)\s*\d*%?\)/i
  const match = settings.newsOverlayGradient.match(regex)

  if (match) {
    newsOverlayStart.value = match[1]
    newsOverlayEnd.value = match[2]

    // Extract hex color từ rgba
    newsOverlayStartColor.value = rgbaToHex(match[1])
    newsOverlayEndColor.value = rgbaToHex(match[2])
  }
}

// Initialize gradient values on mount
const initGradients = () => {
  parseButtonGradient()
  parseTagGradient()
  parseImageOverlayGradient()
  parseNewsOverlayGradient()
}


// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')

// Settings object với cấu trúc từ JSON
const settings = reactive({
  leftColumnTitle: "Giải pháp bán bất động sản",
  rightColumnTitle: "Tin tức",
  viewAllText: "Xem tất cả",
  readMoreText: "Xem thêm",
  newsLink: "/tin-tuc",
  newTagText: "Tin mới",
  hotTagText: "Tin nổi bật",
  primaryColor: "#031358",
  secondaryColor: "#0629BE",
  progressColor: "#031358",
  buttonGradient: "linear-gradient(to bottom, #031358, #0629BE)",
  tagGradient: "linear-gradient(135deg, #031358, #0629BE)",
  imageOverlayGradient: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
  newsOverlayGradient: "linear-gradient(to bottom, transparent 0%, rgba(3, 19, 88, 0.1) 100%)",
  arrowIcon: "fas fa-chevron-right",
  arrowRightIcon: "fas fa-arrow-right",
  calendarIcon: "far fa-calendar",
  userIcon: "far fa-user",
  newIcon: "fas fa-bolt",
  hotIcon: "fas fa-fire",
  solutionItems: [],
  newsItems: []
})

// UI State
const isLoading = ref(false)
const solutionImagePreview = ref(null)
const newsImagePreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File management
const files = ref([])
const solutionImageInput = ref(null)
const newsImageInput = ref(null)
const uploadedFiles = ref([])

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// Active items
const activeSolutionIndex = ref(0)
const activeNewsIndex = ref(0)
const hoveredSolutionIndex = ref(-1)
const hoveredNewsIndex = ref(-1)

const activeSolutionItem = computed(() =>
    activeSolutionIndex.value !== null && settings.solutionItems.length > 0
        ? settings.solutionItems[activeSolutionIndex.value]
        : null
)

const activeNewsItem = computed(() =>
    activeNewsIndex.value !== null && settings.newsItems.length > 0
        ? settings.newsItems[activeNewsIndex.value]
        : null
)

// ========== CONSTANTS ==========
import { baseImgaeUrl } from "../../../../assets/js/global.js";
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
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
  if (!originalFilename) return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.jpg`;

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalFilename.split('.').pop() || 'jpg';
  return `temp_${timestamp}_${random}.${extension}`;
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/11')

    if (response.data && response.data.contentJson) {
      const content = JSON.parse(response.data.contentJson)

      // Load all settings
      Object.keys(content).forEach(key => {
        if (key !== 'solutionItems' && key !== 'newsItems') {
          settings[key] = content[key]
        }
      })

      // Load solution items
      if (content.solutionItems && Array.isArray(content.solutionItems)) {
        settings.solutionItems = content.solutionItems.map((item, index) => ({
          id: item.id || `solution-${Date.now()}-${index}`,
          title: item.title || '',
          postedDate: item.postedDate || '',
          author: item.author || '',
          image: item.image || ''
        }))
      } else {
        settings.solutionItems = []
      }

      // Load news items
      if (content.newsItems && Array.isArray(content.newsItems)) {
        settings.newsItems = content.newsItems.map((item, index) => ({
          id: item.id || `news-${Date.now()}-${index}`,
          title: item.title || '',
          postedDate: item.postedDate || '',
          image: item.image || ''
        }))
      } else {
        settings.newsItems = []
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
            // Add existing images to files array
        // Add existing images to files array
        const allItems = settings.solutionItems.concat(settings.newsItems)
        allItems.forEach(item => {
          if (item.image && !item.image.startsWith(TEMP_PREFIX)) {
            const filename = item.image
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
          }
        })
      }

      uploadedFiles.value = []
      showToast('Dữ liệu đã được tải thành công', 'success')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu từ server', 'error')

    // Fallback to default items
    if (settings.solutionItems.length === 0) {
      settings.solutionItems = [createSolutionItem()]
    }
    if (settings.newsItems.length === 0) {
      settings.newsItems = [createNewsItem()]
    }
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare content data
    const contentData = { ...settings }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: 11,
      name: 'Tin tức',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 10,
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
                  // Update item image URL from temp to real
              const allItems = settings.solutionItems.concat(settings.newsItems)
              allItems.forEach(item => {
                if (item.image === TEMP_PREFIX + file.tempName) {
                  item.image = savedFile.filename
                }
              })
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
      solutionImagePreview.value = null
      newsImagePreview.value = null

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

// ========== SOLUTION ITEMS MANAGEMENT ==========
const createSolutionItem = () => ({
  id: `solution-${Date.now()}-${Math.random()}`,
  title: '',
  postedDate: '',
  author: '',
  image: ''
})

const addSolutionItem = () => {
  const newItem = createSolutionItem()
  settings.solutionItems.push(newItem)
  activeSolutionIndex.value = settings.solutionItems.length - 1
  showToast('Đã thêm giải pháp mới', 'success')
}

const selectSolution = (index) => {
  activeSolutionIndex.value = index
  solutionImagePreview.value = null
}

const moveSolutionItemUp = (index) => {
  if (index > 0) {
    const temp = settings.solutionItems[index]
    settings.solutionItems[index] = settings.solutionItems[index - 1]
    settings.solutionItems[index - 1] = temp
    activeSolutionIndex.value = index - 1
    showToast('Đã di chuyển giải pháp lên', 'success')
  }
}

const moveSolutionItemDown = (index) => {
  if (index < settings.solutionItems.length - 1) {
    const temp = settings.solutionItems[index]
    settings.solutionItems[index] = settings.solutionItems[index + 1]
    settings.solutionItems[index + 1] = temp
    activeSolutionIndex.value = index + 1
    showToast('Đã di chuyển giải pháp xuống', 'success')
  }
}

const removeSolutionItem = (index) => {
  if (settings.solutionItems.length <= 1) {
    showToast('Không thể xóa giải pháp cuối cùng', 'warning')
    return
  }

  const item = settings.solutionItems[index]

  // Handle associated file
  if (item.image) {
    handleImageRemoval(item.image)
  }

  settings.solutionItems.splice(index, 1)

  if (activeSolutionIndex.value >= settings.solutionItems.length) {
    activeSolutionIndex.value = settings.solutionItems.length - 1
  }

  showToast('Đã xóa giải pháp', 'success')
}

const duplicateSolutionItem = () => {
  if (!activeSolutionItem.value) return

  const duplicate = {
    ...JSON.parse(JSON.stringify(activeSolutionItem.value)),
    id: `solution-${Date.now()}-${Math.random()}`
  }

  settings.solutionItems.splice(activeSolutionIndex.value + 1, 0, duplicate)
  activeSolutionIndex.value += 1
  showToast('Đã nhân bản giải pháp', 'success')
}

// ========== NEWS ITEMS MANAGEMENT ==========
const createNewsItem = () => ({
  id: `news-${Date.now()}-${Math.random()}`,
  title: '',
  postedDate: '',
  image: ''
})

const addNewsItem = () => {
  const newItem = createNewsItem()
  settings.newsItems.push(newItem)
  activeNewsIndex.value = settings.newsItems.length - 1
  showToast('Đã thêm tin tức mới', 'success')
}

const selectNews = (index) => {
  activeNewsIndex.value = index
  newsImagePreview.value = null
}

const moveNewsItemUp = (index) => {
  if (index > 0) {
    const temp = settings.newsItems[index]
    settings.newsItems[index] = settings.newsItems[index - 1]
    settings.newsItems[index - 1] = temp
    activeNewsIndex.value = index - 1
    showToast('Đã di chuyển tin tức lên', 'success')
  }
}

const moveNewsItemDown = (index) => {
  if (index < settings.newsItems.length - 1) {
    const temp = settings.newsItems[index]
    settings.newsItems[index] = settings.newsItems[index + 1]
    settings.newsItems[index + 1] = temp
    activeNewsIndex.value = index + 1
    showToast('Đã di chuyển tin tức xuống', 'success')
  }
}

const removeNewsItem = (index) => {
  if (settings.newsItems.length <= 1) {
    showToast('Không thể xóa tin tức cuối cùng', 'warning')
    return
  }

  const item = settings.newsItems[index]

  // Handle associated file
  if (item.image) {
    handleImageRemoval(item.image)
  }

  settings.newsItems.splice(index, 1)

  if (activeNewsIndex.value >= settings.newsItems.length) {
    activeNewsIndex.value = settings.newsItems.length - 1
  }

  showToast('Đã xóa tin tức', 'success')
}

const duplicateNewsItem = () => {
  if (!activeNewsItem.value) return

  const duplicate = {
    ...JSON.parse(JSON.stringify(activeNewsItem.value)),
    id: `news-${Date.now()}-${Math.random()}`
  }

  settings.newsItems.splice(activeNewsIndex.value + 1, 0, duplicate)
  activeNewsIndex.value += 1
  showToast('Đã nhân bản tin tức', 'success')
}

// ========== IMAGE UPLOAD MANAGEMENT ==========
const handleImageRemoval = (imageUrl) => {
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

// Solution image upload
const triggerSolutionImageInput = () => {
  solutionImageInput.value?.click()
}

const handleSolutionImageUpload = (event) => {
  handleImageUpload(event, activeSolutionItem, solutionImagePreview, 'solution')
}

const handleSolutionImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleSolutionImageUpload(fakeEvent)
  }
}

const removeSolutionImage = () => {
  if (activeSolutionItem.value && activeSolutionItem.value.image) {
    handleImageRemoval(activeSolutionItem.value.image)
    activeSolutionItem.value.image = ''
    solutionImagePreview.value = null
    showToast('Đã xóa ảnh', 'success')
  }
}

// News image upload
const triggerNewsImageInput = () => {
  newsImageInput.value?.click()
}

const handleNewsImageUpload = (event) => {
  handleImageUpload(event, activeNewsItem, newsImagePreview, 'news')
}

const handleNewsImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleNewsImageUpload(fakeEvent)
  }
}

const removeNewsImage = () => {
  if (activeNewsItem.value && activeNewsItem.value.image) {
    handleImageRemoval(activeNewsItem.value.image)
    activeNewsItem.value.image = ''
    newsImagePreview.value = null
    showToast('Đã xóa ảnh', 'success')
  }
}

// Generic image upload handler
const handleImageUpload = (event, activeItem, previewRef, type) => {
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

  if (!activeItem.value) {
    showToast('Vui lòng chọn một mục trước', 'warning')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Handle old image
    if (activeItem.value.image) {
      handleImageRemoval(activeItem.value.image)
    }

    // Update item
    activeItem.value.image = tempUrl
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

    showToast('Ảnh đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

// ========== UI FUNCTIONS ==========
const previewSolutionImage = () => {
  if (activeSolutionItem.value && activeSolutionItem.value.image) {
    previewImageUrl.value = activeSolutionItem.value.image
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const previewNewsImage = () => {
  if (activeNewsItem.value && activeNewsItem.value.image) {
    previewImageUrl.value = activeNewsItem.value.image
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData().then(() => {
    initGradients()
  })
})
</script>

<style scoped>

/* Thêm vào phần style */

/* Gradient Picker Styles */
.gradient-picker-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.color-pair-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.color-pair-inputs .color-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.color-pair-inputs .color-input label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 0;
}

.color-pair-inputs .color-input input[type="color"] {
  width: 100%;
  height: 40px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.color-pair-inputs .color-input input[type="text"] {
  width: 100%;
  padding: 8px 12px;
  font-size: 0.85rem;
}

.gradient-preview {
  width: 100%;
  height: 60px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  margin-top: 5px;
  transition: all 0.3s ease;
}

.gradient-preview:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .color-pair-inputs {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}


/*---------------------------------------------------------------*/
.news-editor {
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

/* Required Mark */
.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

/* Items Management */
.items-management {
  display: flex;
  gap: 30px;
}

.items-container {
  display: flex;
  gap: 30px;
  width: 100%;
}

.items-list {
  flex: 1;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 600px;
  padding-right: 10px;
}

.item-editor {
  flex: 2;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e9ecef;
}

/* Item Item */
.item-item {
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
}

.item-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e9ecef;
}

.item-item.active {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.item-image {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h4 {
  margin: 0 0 4px 0;
  color: #031358;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-details {
  margin: 0;
  color: #6c757d;
  font-size: 0.75rem;
  font-weight: 500;
}

.item-actions {
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

/* Item Editor */
.item-editor .editor-header {
  background: none;
  color: inherit;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-editor .editor-header h3 {
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

.file-upload {
  margin-bottom: 15px;
  display: flex;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.input-hint {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 5px;
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
  .items-container {
    flex-direction: column;
  }

  .items-list {
    max-width: 100%;
    max-height: 300px;
  }

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

  .color-grid {
    grid-template-columns: 1fr;
  }

  .navigation-tabs {
    padding: 0 20px;
    flex-wrap: wrap;
  }

  .tab-button {
    padding: 12px 20px;
    font-size: 0.9rem;
    flex: 1;
    min-width: 120px;
  }

  .item-editor .editor-header {
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

  .file-upload-area,
  .upload-preview {
    width: 100%;
  }

  .upload-preview {
    height: 150px;
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

  .item-item {
    padding: 10px 12px;
  }

  .item-image {
    width: 40px;
    height: 40px;
  }
}
</style>