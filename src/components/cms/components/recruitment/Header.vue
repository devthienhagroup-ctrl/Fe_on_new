<template>
  <div class="header-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Header Tuyển dụng</h2>
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
          :class="{ active: activeTab === 'highlights' }"
          @click="activeTab = 'highlights'"
      >
        <i class="fas fa-star"></i> Điểm nổi bật
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
        <div class="" style="display: flex; flex-direction: column; gap: 10px">
          <!-- Banner Title -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề Banner</h3>

            <div class="form-group">
              <label for="banner-title">Tiêu đề chính</label>
              <textarea
                  id="banner-title"
                  v-model="content.bannerTitle"
                  rows="3"
                  placeholder="Nhập tiêu đề banner..."
              ></textarea>
            </div>
          </div>

          <!-- Nút ứng tuyển -->
          <div class="setting-section">
            <h3><i class="fas fa-hand-point-right"></i> Nút ứng tuyển</h3>

            <div class="form-group">
              <label for="apply-button-text">Văn bản nút</label>
              <input
                  type="text"
                  id="apply-button-text"
                  v-model="content.applyButton.text"
                  placeholder="Ứng tuyển ngay"
              />
            </div>

            <div class="form-group">
              <label for="apply-button-icon">Icon</label>
              <IconPicker v-model="content.applyButton.icon"/>
              <small class="form-hint">VD: fa-solid fa-hand-point-right</small>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Màu nền</label>
                <div class="color-input">
                  <input type="color" v-model="applyButtonColors.backgroundColor"/>
                  <input type="text" v-model="content.applyButton.backgroundColor" placeholder="#ffffff" @input="updateApplyButtonColor()"/>
                </div>
              </div>

              <div class="form-group">
                <label>Màu chữ</label>
                <div class="color-input">
                  <input type="color" v-model="applyButtonColors.textColor"/>
                  <input type="text" v-model="content.applyButton.textColor" placeholder="#031358" @input="updateApplyButtonTextColor()"/>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="apply-button-shadow">Đổ bóng khi hover</label>
              <div class="color-input">
                <input type="color" v-model="applyButtonShadow.hex" @input="updateApplyButtonShadowFromColor()"/>
                <input
                    type="text"
                    id="apply-button-shadow"
                    v-model="content.applyButton.hoverShadow"
                    placeholder="0 4px 12px rgba(0, 0, 0, 0.15)"
                    @input="updateApplyButtonShadowColorFromText()"
                />
              </div>
            </div>
          </div>

          <!-- Subtitle Items -->
          <div class="setting-section">
            <h3><i class="fas fa-list"></i> Mục giới thiệu</h3>

            <div v-for="(item, index) in content.subtitleItems" :key="index" class="subtitle-item">
              <div class="subtitle-header">
                <h4>Mục {{ index + 1 }}</h4>
                <button class="btn-icon btn-delete" @click="removeSubtitleItem(index)" title="Xóa mục">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>

              <div class="form-group">
                <label :for="'subtitle-icon-' + index">Icon</label>
                <div class="file-upload">
                  <div class="file-upload-area" @click="triggerSubtitleIconInput(index)" @dragover.prevent
                       @drop.prevent="handleSubtitleIconDrop($event, index)">
                    <input
                        type="file"
                        :ref="el => subtitleIconInputs[index] = el"
                        @change="handleSubtitleIconUpload($event, index)"
                        accept="image/*"
                        style="display: none"
                    />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                    <p class="file-hint">SVG, PNG, JPG (Tối đa 5MB)</p>
                  </div>

                  <div v-if="subtitleIconPreviews[index] || item.icon" class="upload-preview">
                    <img :src="getImageUrl(item.icon)" alt="Preview"/>
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewSubtitleIcon(index)" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="removeSubtitleIcon(index)" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-group" v-if="!subtitleIconPreviews[index] && !item.icon">
                  <label :for="'subtitle-icon-url-' + index">Hoặc nhập URL ảnh</label>
                  <input
                      type="text"
                      :id="'subtitle-icon-url-' + index"
                      v-model="item.icon"
                      placeholder="/imgs/icon-bling.svg"
                  />
                </div>
              </div>

              <div class="form-group">
                <label :for="'subtitle-icon-alt-' + index">Alt text cho icon</label>
                <input
                    type="text"
                    :id="'subtitle-icon-alt-' + index"
                    v-model="item.iconAlt"
                    placeholder="Mô tả icon"
                />
              </div>

              <div class="form-group">
                <div class="label" style="display: flex; justify-content: space-between">
                  <label :for="'subtitle-text-' + index">Nội dung</label>
                  <AdvancedEditModal
                      v-model="item.text"
                  ></AdvancedEditModal>
                </div>
                <div class="rich-text-editor-wrapper">
                  <div class="tiptap" v-html="item.text"></div>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary" @click="addSubtitleItem">
              <i class="fas fa-plus"></i> Thêm mục giới thiệu
            </button>
          </div>


        </div>
      </div>

      <!-- Tab Điểm nổi bật -->
      <div v-if="activeTab === 'highlights'" class="highlights-settings">
        <div class="highlights-header">
          <h3><i class="fas fa-star"></i> Quản lý các điểm nổi bật</h3>
          <button class="btn btn-primary" @click="addHighlightItem">
            <i class="fas fa-plus"></i> Thêm điểm nổi bật
          </button>
        </div>

        <div class="highlights-list">
          <div
              v-for="(item, index) in content.highlightItems"
              :key="index"
              class="highlight-item"
              :class="{ 'editing': editingHighlight === index }"
          >
            <div class="highlight-header" @click="toggleHighlightEdit(index)">
              <div class="highlight-number">
                {{ index + 1 }}
              </div>
              <div class="highlight-title-preview">
                <span>{{ item.title }}</span>
              </div>
              <div class="highlight-actions">
                <button class="btn-icon" @click.stop="moveHighlightUp(index)" :disabled="index === 0" title="Di chuyển lên">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click.stop="moveHighlightDown(index)"
                        :disabled="index === content.highlightItems.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-delete" @click.stop="removeHighlightItem(index)" title="Xóa điểm nổi bật">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn-icon" @click.stop="toggleHighlightEdit(index)"
                        :title="editingHighlight === index ? 'Đóng chỉnh sửa' : 'Chỉnh sửa'">
                  <i :class="editingHighlight === index ? 'fas fa-chevron-up' : 'fas fa-edit'"></i>
                </button>
              </div>
            </div>

            <!-- Highlight Edit Form -->
            <div v-if="editingHighlight === index" class="highlight-edit-form">
              <div class="form-group">
                <label :for="'highlight-title-' + index">Tiêu đề</label>
                <input
                    type="text"
                    :id="'highlight-title-' + index"
                    v-model="item.title"
                    placeholder="Không yêu cầu kinh nghiệm"
                />
              </div>

              <div class="form-group">
                <label :for="'highlight-description-' + index">Mô tả</label>
                <textarea
                    :id="'highlight-description-' + index"
                    v-model="item.description"
                    rows="3"
                    placeholder="Chỉ cần bạn có tinh thần học hỏi..."
                ></textarea>
              </div>

              <div class="form-group">
                <label :for="'highlight-image-' + index">Hình ảnh</label>
                <div class="file-upload">
                  <div class="file-upload-area" @click="triggerHighlightImageInput(index)" @dragover.prevent
                       @drop.prevent="handleHighlightImageDrop($event, index)">
                    <input
                        type="file"
                        :ref="el => highlightImageInputs[index] = el"
                        @change="handleHighlightImageUpload($event, index)"
                        accept="image/*"
                        style="display: none"
                    />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                    <p class="file-hint">SVG, PNG, JPG (Tối đa 5MB)</p>
                  </div>

                  <div v-if="highlightImagePreviews[index] || item.image" class="upload-preview">
                    <img :src="getImageUrl(item.image)" alt="Preview"/>
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewHighlightImage(index)" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="removeHighlightImage(index)" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-group" v-if="!highlightImagePreviews[index] && !item.image">
                  <label :for="'highlight-image-url-' + index">Hoặc nhập URL ảnh</label>
                  <input
                      type="text"
                      :id="'highlight-image-url-' + index"
                      v-model="item.image"
                      placeholder="/imgs/team-work-animate.svg"
                  />
                </div>
              </div>

              <div class="form-actions">
                <button class="btn btn-secondary" @click="toggleHighlightEdit(index)">
                  <i class="fas fa-times"></i> Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Giao diện & Màu sắc -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Particle Background -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Nền Particle</h3>

            <div class="form-group">
              <label for="particle-image-url">Hình nền</label>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerParticleImageInput" @dragover.prevent
                     @drop.prevent="handleParticleImageDrop">
                  <input
                      type="file"
                      ref="particleImageInput"
                      @change="handleParticleImageUpload"
                      accept="image/*"
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                  <p class="file-hint">SVG, PNG, JPG (Tối đa 5MB)</p>
                </div>

                <div v-if="particleImagePreview || content.particleBackground.imageUrl" class="upload-preview">
                  <img :src="getImageUrl(content.particleBackground.imageUrl)" alt="Preview"/>
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewParticleImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeParticleImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group" v-if="!particleImagePreview && !content.particleBackground.imageUrl">
                <label for="particle-image-url">Hoặc nhập URL ảnh</label>
                <input
                    type="text"
                    id="particle-image-url"
                    v-model="content.particleBackground.imageUrl"
                    placeholder="/imgs/tuyen-dung-banner.png"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="particle-alt-text">Alt text</label>
              <input
                  type="text"
                  id="particle-alt-text"
                  v-model="content.particleBackground.altText"
                  placeholder="Mô tả ảnh"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="max-particle-size">Kích thước particle tối đa</label>
                <div class="input-with-unit">
                  <input type="number" id="max-particle-size" v-model.number="content.particleBackground.maxParticleSize" min="1" max="100"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Màu particle</label>
                <div class="color-input">
                  <input type="color" v-model="content.particleBackground.particleColor"/>
                  <input type="text" v-model="content.particleBackground.particleColor" placeholder="#3C4980"/>
                </div>
              </div>

              <div class="form-group">
                <label>Màu đường kẻ</label>
                <div class="color-input">
                  <input type="color" v-model="content.particleBackground.lineColor"/>
                  <input type="text" v-model="content.particleBackground.lineColor" placeholder="#031358"/>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="line-width">Độ dày đường kẻ</label>
              <input
                  type="number"
                  id="line-width"
                  v-model.number="content.particleBackground.lineWidth"
                  step="0.1"
                  min="0.1"
                  max="5"
              />
            </div>
          </div>

          <!-- Styles -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Kiểu dáng</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="banner-min-height">Chiều cao tối thiểu banner</label>
                <div class="input-with-unit">
                  <input type="text" id="banner-min-height" v-model="content.styles.bannerMinHeight" placeholder="90vh"/>
                  <span class="unit">vh</span>
                </div>
              </div>

              <div class="form-group">
                <label for="banner-max-height">Chiều cao tối đa banner</label>
                <div class="input-with-unit">
                  <input type="text" id="banner-max-height" v-model="content.styles.bannerMaxHeight" placeholder="900px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>


            <div class="form-group">
              <label for="hover-background-gradient">Gradient nền hover</label>
              <div class="color-input-group">
                <div class="gradient-colors">
                  <div class="color-input-wrapper">
                    <div class="color-label">Màu bắt đầu</div>
                    <div class="color-input">
                      <input type="color" v-model="hoverBackgroundGradientColors.color1" @change="updateHoverBackgroundGradient()"/>
                      <input type="text" v-model="hoverBackgroundGradientColors.color1" class="gradient-input"/>
                    </div>
                  </div>
                  <div class="color-input-wrapper">
                    <div class="color-label">Màu kết thúc</div>
                    <div class="color-input">
                      <input type="color" v-model="hoverBackgroundGradientColors.color2" @change="updateHoverBackgroundGradient()"/>
                      <input type="text" v-model="hoverBackgroundGradientColors.color2" class="gradient-input"/>
                    </div>
                  </div>
                </div>
                <input
                    type="text"
                    id="hover-background-gradient"
                    v-model="content.styles.hoverBackgroundGradient"
                    placeholder="135deg, #ffffff 0%, #f8f9fa 100%"
                    @input="updateHoverBackgroundColorsFromGradient()"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Màu tiêu đề điểm nổi bật</label>
                <div class="color-input">
                  <input type="color" v-model="content.styles.highlightTitleColor"/>
                  <input type="text" v-model="content.styles.highlightTitleColor" placeholder="#ffffff"/>
                </div>
              </div>

              <div class="form-group">
                <label>Màu tiêu đề khi hover</label>
                <div class="color-input">
                  <input type="color" v-model="content.styles.highlightTitleHoverColor"/>
                  <input type="text" v-model="content.styles.highlightTitleHoverColor" placeholder="#031358"/>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Màu mô tả điểm nổi bật</label>
              <div class="color-input">
                <input type="color" v-model="highlightDescriptionColor.hex" @input="updateHighlightDescriptionColorFromHex()"/>
                <input
                    type="text"
                    v-model="content.styles.highlightDescriptionColor"
                    placeholder="rgba(0, 0, 0, 0.8)"
                    @input="updateHighlightDescriptionColorFromText()"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="highlight-text-shadow">Đổ bóng chữ điểm nổi bật</label>
              <div class="color-input">
                <input type="color" v-model="highlightTextShadowColor.hex" @input="updateHighlightTextShadowFromColor()"/>
                <input
                    type="text"
                    id="highlight-text-shadow"
                    v-model="content.styles.highlightTextShadow"
                    placeholder="0 2px 4px rgba(0, 0, 0, 0.3)"
                    @input="updateHighlightTextShadowColorFromText()"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="image-shadow">Đổ bóng ảnh</label>
              <div class="color-input">
                <input type="color" v-model="imageShadowColor.hex" @input="updateImageShadowFromColor()"/>
                <input
                    type="text"
                    id="image-shadow"
                    v-model="content.styles.imageShadow"
                    placeholder="0 4px 8px rgba(0, 0, 0, 0.2)"
                    @input="updateImageShadowColorFromText()"
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
          <h3>Xem trước ảnh</h3>
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
import {ref, reactive, onMounted, nextTick} from 'vue'
import api from '../../../../api/api.js'
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";
import {baseImgaeUrl} from "../../../../assets/js/global.js";
import IconPicker from "../../../RichTextEditor/IconPicker.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)
const editingHighlight = ref(null)

// UI State
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File input refs
const subtitleIconInputs = ref([])
const highlightImageInputs = ref([])
const particleImageInput = ref(null)

// Preview states
const subtitleIconPreviews = ref([])
const highlightImagePreviews = ref([])
const particleImagePreview = ref(null)

// Color states
const applyButtonColors = reactive({
  backgroundColor: '#ffffff',
  textColor: '#031358'
})

const applyButtonShadow = reactive({
  hex: '#000000',
  opacity: 0.15,
  rgba: 'rgba(0, 0, 0, 0.15)'
})

const liquidGlassHoverBorderColor = reactive({
  hex: '#ffffff',
  opacity: 0.3,
  rgba: 'rgba(255, 255, 255, 0.3)'
})

const hoverBackgroundGradientColors = reactive({
  color1: '#ffffff',
  color2: '#f8f9fa'
})

const highlightDescriptionColor = reactive({
  hex: '#000000',
  opacity: 0.8,
  rgba: 'rgba(0, 0, 0, 0.8)'
})

const highlightTextShadowColor = reactive({
  hex: '#000000',
  opacity: 0.3,
  rgba: 'rgba(0, 0, 0, 0.3)'
})

const imageShadowColor = reactive({
  hex: '#000000',
  opacity: 0.2,
  rgba: 'rgba(0, 0, 0, 0.2)'
})

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
const SECTION_ID = 36

// Content structure based on Header JSON data
const content = reactive({
  bannerTitle: '"Không chỉ là công việc, đây là cơ hội để bạn phát triển sự nghiệp!"',
  subtitleItems: [
    {
      icon: '/imgs/icon-bling.svg',
      iconAlt: 'Icon Bling',
      text: 'Gia nhập <strong>Thiên Hà Group</strong>, bạn sẽ có trải nghiệm làm việc tốt hơn!'
    },
    {
      icon: '/imgs/icon-kinh-lup.svg',
      iconAlt: 'Icon Kính Lúp',
      text: 'Chúng tôi tin rằng đầu tư cho nhân viên chính là cách mang đến cho khách hàng những sản phẩm tốt nhất. Tại THG, luôn có hơn một chiếc ghế trống ẩn chứa những điều thú vị đang chờ đợi bạn. Đừng bỏ lỡ cuộc hẹn hôm nay!'
    }
  ],
  applyButton: {
    text: 'Ứng tuyển ngay',
    icon: 'fa-solid fa-hand-point-right',
    backgroundColor: '#ffffff',
    textColor: '#031358',
    hoverShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  highlightItems: [
    {
      title: 'Không yêu cầu kinh nghiệm',
      description: 'Chỉ cần bạn có tinh thần học hỏi, Thiên Hà Group sẽ giúp bạn phát triển từ con số 0.',
      image: '/imgs/team-work-animate.svg'
    },
    {
      title: 'Môi trường trẻ trung, năng động',
      description: 'Làm việc cùng đội ngũ nhiệt huyết, sẵn sàng chia sẻ và hỗ trợ nhau mỗi ngày.',
      image: '/imgs/experts-animate.svg'
    },
    {
      title: 'Cơ hội thăng tiến rõ ràng',
      description: 'Chúng tôi đánh giá dựa trên năng lực và kết quả, không phải thâm niên.',
      image: '/imgs/growth-curve-animate.svg'
    },
    {
      title: 'Thu nhập và phúc lợi hấp dẫn',
      description: 'Mức thưởng cạnh tranh, chế độ đãi ngộ tốt – xứng đáng với nỗ lực của bạn.',
      image: '/imgs/make-it-rain-animate.svg'
    }
  ],
  particleBackground: {
    imageUrl: '/imgs/tuyen-dung-banner.png',
    altText: 'Mô tả ảnh',
    maxParticleSize: 20,
    particleColor: '#3C4980',
    lineColor: '#031358',
    lineWidth: 0.5
  },
  styles: {
    bannerMinHeight: '90vh',
    bannerMaxHeight: '900px',
    liquidGlassGradient: '135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.1) 100%',
    liquidGlassBorder: '1px solid rgba(255, 255, 255, 0.2)',
    liquidGlassHoverGradient: '135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 25%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.08) 75%, rgba(255, 255, 255, 0.15) 100%',
    liquidGlassHoverBorder: 'rgba(255, 255, 255, 0.3)',
    hoverBackgroundGradient: '135deg, #ffffff 0%, #f8f9fa 100%',
    highlightTitleColor: '#ffffff',
    highlightTitleHoverColor: '#031358',
    highlightDescriptionColor: 'rgba(0, 0, 0, 0.8)',
    highlightTextShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    imageShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  }
})

// Files management
const files = ref([])
const uploadedFiles = ref([])

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

const handleFileUpload = (file, type, previewRef, contentPath, index = null, previewArray = null) => {
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

    // Update content based on path
    if (index !== null && previewArray) {
      // For array items like highlight images or subtitle icons
      const pathParts = contentPath.split('.')
      let target = content
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (pathParts[i].includes('[')) {
          const arrayName = pathParts[i].split('[')[0]
          const arrayIndex = parseInt(pathParts[i].split('[')[1].split(']')[0])
          target = target[arrayName][arrayIndex]
        } else {
          target = target[pathParts[i]]
        }
      }
      target[pathParts[pathParts.length - 1]] = tempUrl

      // Update preview array
      previewArray[index] = previewUrl
    } else if (previewRef) {
      // For single file uploads like particle image
      const pathParts = contentPath.split('.')
      let target = content
      for (let i = 0; i < pathParts.length - 1; i++) {
        target = target[pathParts[i]]
      }
      target[pathParts[pathParts.length - 1]] = tempUrl
      previewRef.value = previewUrl
    }

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

// ========== COLOR PARSING FUNCTIONS ==========
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
}

const parseRgbaColor = (rgbaStr) => {
  if (!rgbaStr) return { hex: '#000000', opacity: 0.1, rgba: 'rgba(0, 0, 0, 0.1)' };

  const rgbaMatch = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    return { hex, opacity, rgba };
  }

  // Try to parse hex color
  const hexMatch = rgbaStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/);
  if (hexMatch) {
    return { hex: hexMatch[0], opacity: 1, rgba: hexMatch[0] };
  }

  return { hex: '#000000', opacity: 0.1, rgba: 'rgba(0, 0, 0, 0.1)' };
}

const parseShadowColor = (shadowStr) => {
  if (!shadowStr) return { hex: '#000000', opacity: 0.1, rgba: 'rgba(0, 0, 0, 0.1)' };

  // Find rgba color in shadow string
  const rgbaMatch = shadowStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 0.1;

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    return { hex, opacity, rgba };
  }

  return { hex: '#000000', opacity: 0.1, rgba: 'rgba(0, 0, 0, 0.1)' };
}

const parseGradientColors = (gradientStr) => {
  if (!gradientStr) return { color1: '#ffffff', color2: '#f8f9fa' };

  const matches = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (matches && matches.length >= 2) {
    return { color1: matches[0], color2: matches[1] };
  }
  return { color1: '#ffffff', color2: '#f8f9fa' };
}

// ========== COLOR UPDATE FUNCTIONS ==========
// Apply Button Colors
const updateApplyButtonColor = () => {
  applyButtonColors.backgroundColor = content.applyButton.backgroundColor;
}

const updateApplyButtonTextColor = () => {
  applyButtonColors.textColor = content.applyButton.textColor;
}

// Apply Button Shadow
const updateApplyButtonShadowFromColor = () => {
  const shadowRegex = /([\d.-]+px\s+){3,4}/;
  const match = content.applyButton.hoverShadow.match(shadowRegex);

  if (match) {
    const rgb = hexToRgb(applyButtonShadow.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${applyButtonShadow.opacity})`;
    content.applyButton.hoverShadow = `${match[0].trim()} ${newRgba}`;
    applyButtonShadow.rgba = newRgba;
  } else {
    const rgb = hexToRgb(applyButtonShadow.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${applyButtonShadow.opacity})`;
    content.applyButton.hoverShadow = `0 4px 12px ${newRgba}`;
    applyButtonShadow.rgba = newRgba;
  }
}

const updateApplyButtonShadowColorFromText = () => {
  const parsed = parseShadowColor(content.applyButton.hoverShadow);
  applyButtonShadow.hex = parsed.hex;
  applyButtonShadow.opacity = parsed.opacity;
  applyButtonShadow.rgba = parsed.rgba;
}

// Liquid Glass Hover Border
const updateLiquidGlassHoverBorderFromColor = () => {
  const rgb = hexToRgb(liquidGlassHoverBorderColor.hex);
  const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${liquidGlassHoverBorderColor.opacity})`;
  content.styles.liquidGlassHoverBorder = newRgba;
  liquidGlassHoverBorderColor.rgba = newRgba;
}

const updateLiquidGlassHoverBorderColorFromText = () => {
  const parsed = parseRgbaColor(content.styles.liquidGlassHoverBorder);
  liquidGlassHoverBorderColor.hex = parsed.hex;
  liquidGlassHoverBorderColor.opacity = parsed.opacity;
  liquidGlassHoverBorderColor.rgba = parsed.rgba;
}

// Hover Background Gradient
const updateHoverBackgroundGradient = () => {
  content.styles.hoverBackgroundGradient = `135deg, ${hoverBackgroundGradientColors.color1} 0%, ${hoverBackgroundGradientColors.color2} 100%`;
}

const updateHoverBackgroundColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.hoverBackgroundGradient);
  hoverBackgroundGradientColors.color1 = colors.color1;
  hoverBackgroundGradientColors.color2 = colors.color2;
}

// Highlight Description Color
const updateHighlightDescriptionColorFromHex = () => {
  const rgb = hexToRgb(highlightDescriptionColor.hex);
  const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${highlightDescriptionColor.opacity})`;
  content.styles.highlightDescriptionColor = newRgba;
  highlightDescriptionColor.rgba = newRgba;
}

const updateHighlightDescriptionColorFromText = () => {
  const parsed = parseRgbaColor(content.styles.highlightDescriptionColor);
  highlightDescriptionColor.hex = parsed.hex;
  highlightDescriptionColor.opacity = parsed.opacity;
  highlightDescriptionColor.rgba = parsed.rgba;
}

// Highlight Text Shadow
const updateHighlightTextShadowFromColor = () => {
  const shadowRegex = /([\d.-]+px\s+){3,4}/;
  const match = content.styles.highlightTextShadow.match(shadowRegex);

  if (match) {
    const rgb = hexToRgb(highlightTextShadowColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${highlightTextShadowColor.opacity})`;
    content.styles.highlightTextShadow = `${match[0].trim()} ${newRgba}`;
    highlightTextShadowColor.rgba = newRgba;
  } else {
    const rgb = hexToRgb(highlightTextShadowColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${highlightTextShadowColor.opacity})`;
    content.styles.highlightTextShadow = `0 2px 4px ${newRgba}`;
    highlightTextShadowColor.rgba = newRgba;
  }
}

const updateHighlightTextShadowColorFromText = () => {
  const parsed = parseShadowColor(content.styles.highlightTextShadow);
  highlightTextShadowColor.hex = parsed.hex;
  highlightTextShadowColor.opacity = parsed.opacity;
  highlightTextShadowColor.rgba = parsed.rgba;
}

// Image Shadow
const updateImageShadowFromColor = () => {
  const shadowRegex = /([\d.-]+px\s+){3,4}/;
  const match = content.styles.imageShadow.match(shadowRegex);

  if (match) {
    const rgb = hexToRgb(imageShadowColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${imageShadowColor.opacity})`;
    content.styles.imageShadow = `${match[0].trim()} ${newRgba}`;
    imageShadowColor.rgba = newRgba;
  } else {
    const rgb = hexToRgb(imageShadowColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${imageShadowColor.opacity})`;
    content.styles.imageShadow = `0 4px 8px ${newRgba}`;
    imageShadowColor.rgba = newRgba;
  }
}

const updateImageShadowColorFromText = () => {
  const parsed = parseShadowColor(content.styles.imageShadow);
  imageShadowColor.hex = parsed.hex;
  imageShadowColor.opacity = parsed.opacity;
  imageShadowColor.rgba = parsed.rgba;
}

// ========== SUBTITLE ITEMS MANAGEMENT ==========
const addSubtitleItem = () => {
  content.subtitleItems.push({
    icon: '',
    iconAlt: 'Icon mới',
    text: 'Nhập nội dung mục giới thiệu...'
  });

  // Initialize preview array
  nextTick(() => {
    subtitleIconPreviews.value.push(null);
  });

  showToast('Đã thêm mục giới thiệu mới', 'success');
}

const removeSubtitleItem = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa mục giới thiệu này?')) {
    // Remove any file references
    const iconUrl = content.subtitleItems[index].icon;
    if (iconUrl) {
      handleRemoveFile(iconUrl, `subtitleItems[${index}].icon`, null, index, subtitleIconPreviews);
    }

    content.subtitleItems.splice(index, 1);
    subtitleIconPreviews.value.splice(index, 1);
    showToast('Đã xóa mục giới thiệu', 'success');
  }
}

// Subtitle Icon Handlers
const triggerSubtitleIconInput = (index) => {
  const input = subtitleIconInputs.value[index];
  if (input) {
    input.click();
  }
}

const handleSubtitleIconUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    handleFileUpload(file, `Subtitle Icon ${index + 1}`, null, `subtitleItems[${index}].icon`, index, subtitleIconPreviews);
  }
  event.target.value = '';
}

const handleSubtitleIconDrop = (event, index) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    handleFileUpload(file, `Subtitle Icon ${index + 1}`, null, `subtitleItems[${index}].icon`, index, subtitleIconPreviews);
  }
}

const removeSubtitleIcon = (index) => {
  const iconUrl = content.subtitleItems[index].icon;
  if (iconUrl) {
    handleRemoveFile(iconUrl, `subtitleItems[${index}].icon`, null, index, subtitleIconPreviews);
    subtitleIconPreviews.value[index] = null;
  }
}

const previewSubtitleIcon = (index) => {
  const iconUrl = content.subtitleItems[index].icon;
  if (iconUrl) {
    previewImageUrl.value = getImageUrl(iconUrl);
    showPreviewModal.value = true;
  } else {
    showToast('Không có icon để xem trước', 'warning');
  }
}

// ========== HIGHLIGHT ITEMS MANAGEMENT ==========
const addHighlightItem = () => {
  const newItem = {
    title: 'Điểm nổi bật mới',
    description: 'Nhập mô tả cho điểm nổi bật này...',
    image: ''
  };

  content.highlightItems.push(newItem);
  highlightImagePreviews.value.push(null);

  editingHighlight.value = content.highlightItems.length - 1;
  showToast('Đã thêm điểm nổi bật mới', 'success');
}

const removeHighlightItem = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa điểm nổi bật này?')) {
    // Remove any file references related to this highlight
    const imageUrl = content.highlightItems[index].image;
    if (imageUrl) {
      handleRemoveFile(imageUrl, `highlightItems[${index}].image`, null, index, highlightImagePreviews);
    }

    content.highlightItems.splice(index, 1);
    highlightImagePreviews.value.splice(index, 1);

    if (editingHighlight.value === index) {
      editingHighlight.value = null;
    } else if (editingHighlight.value > index) {
      editingHighlight.value--;
    }

    showToast('Đã xóa điểm nổi bật', 'success');
  }
}

const moveHighlightUp = (index) => {
  if (index > 0) {
    const temp = content.highlightItems[index];
    content.highlightItems[index] = content.highlightItems[index - 1];
    content.highlightItems[index - 1] = temp;

    // Also swap previews
    const tempPreview = highlightImagePreviews.value[index];
    highlightImagePreviews.value[index] = highlightImagePreviews.value[index - 1];
    highlightImagePreviews.value[index - 1] = tempPreview;
  }
}

const moveHighlightDown = (index) => {
  if (index < content.highlightItems.length - 1) {
    const temp = content.highlightItems[index];
    content.highlightItems[index] = content.highlightItems[index + 1];
    content.highlightItems[index + 1] = temp;

    // Also swap previews
    const tempPreview = highlightImagePreviews.value[index];
    highlightImagePreviews.value[index] = highlightImagePreviews.value[index + 1];
    highlightImagePreviews.value[index + 1] = tempPreview;
  }
}

const toggleHighlightEdit = (index) => {
  editingHighlight.value = editingHighlight.value === index ? null : index;
}

// ========== HIGHLIGHT IMAGE HANDLERS ==========
const triggerHighlightImageInput = (index) => {
  const input = highlightImageInputs.value[index];
  if (input) {
    input.click();
  }
}

const handleHighlightImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    handleFileUpload(file, `Hình ảnh điểm nổi bật ${index + 1}`, null, `highlightItems[${index}].image`, index, highlightImagePreviews);
  }
  event.target.value = '';
}

const handleHighlightImageDrop = (event, index) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    handleFileUpload(file, `Hình ảnh điểm nổi bật ${index + 1}`, null, `highlightItems[${index}].image`, index, highlightImagePreviews);
  }
}

const removeHighlightImage = (index) => {
  const imageUrl = content.highlightItems[index].image;
  if (imageUrl) {
    handleRemoveFile(imageUrl, `highlightItems[${index}].image`, null, index, highlightImagePreviews);
    highlightImagePreviews.value[index] = null;
  }
}

const previewHighlightImage = (index) => {
  const imageUrl = content.highlightItems[index].image;
  if (imageUrl) {
    previewImageUrl.value = getImageUrl(imageUrl);
    showPreviewModal.value = true;
  } else {
    showToast('Không có ảnh để xem trước', 'warning');
  }
}

// ========== PARTICLE IMAGE HANDLERS ==========
const triggerParticleImageInput = () => {
  if (particleImageInput.value) {
    particleImageInput.value.click();
  }
}

const handleParticleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    handleFileUpload(file, 'Particle Background', particleImagePreview, 'particleBackground.imageUrl');
  }
  event.target.value = '';
}

const handleParticleImageDrop = (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file) {
    handleFileUpload(file, 'Particle Background', particleImagePreview, 'particleBackground.imageUrl');
  }
}

const removeParticleImage = () => {
  const imageUrl = content.particleBackground.imageUrl;
  if (imageUrl) {
    handleRemoveFile(imageUrl, 'particleBackground.imageUrl', particleImagePreview);
  }
}

const previewParticleImage = () => {
  const imageUrl = content.particleBackground.imageUrl;
  if (imageUrl) {
    previewImageUrl.value = getImageUrl(imageUrl);
    showPreviewModal.value = true;
  } else {
    showToast('Không có ảnh để xem trước', 'warning');
  }
}

// ========== FILE REMOVE FUNCTION ==========
const handleRemoveFile = (imageUrl, contentPath, previewRef, index = null, previewArray = null) => {
  if (imageUrl) {
    if (imageUrl.startsWith(TEMP_PREFIX)) {
      const tempName = imageUrl.replace(TEMP_PREFIX, '');

      const fileIndex = files.value.findIndex(f => f.tempName === tempName);
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1);
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName);
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1);
      }
    } else {
      const fileIndex = files.value.findIndex(f => f.filename === imageUrl);
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE';
      }
    }

    // Update content
    if (index !== null && previewArray) {
      // For array items
      const pathParts = contentPath.split('.');
      let target = content;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (pathParts[i].includes('[')) {
          const arrayName = pathParts[i].split('[')[0];
          const arrayIndex = parseInt(pathParts[i].split('[')[1].split(']')[0]);
          target = target[arrayName][arrayIndex];
        } else {
          target = target[pathParts[i]];
        }
      }
      target[pathParts[pathParts.length - 1]] = '';

      // Clear preview
      previewArray[index] = null;
    } else {
      // For single items
      const pathParts = contentPath.split('.');
      let target = content;
      for (let i = 0; i < pathParts.length - 1; i++) {
        target = target[pathParts[i]];
      }
      target[pathParts[pathParts.length - 1]] = '';

      if (previewRef) previewRef.value = null;
    }

    showToast('Đã xóa ảnh', 'success');
  }
}

// ========== PREVIEW FUNCTIONS ==========
const closePreviewModal = () => {
  showPreviewModal.value = false;
  previewImageUrl.value = '';
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true;
    const response = await api.get(`/cms/getSection/${SECTION_ID}`);

    if (response.data && response.data.contentJson) {
      const data = typeof response.data.contentJson === 'string'
          ? JSON.parse(response.data.contentJson)
          : response.data.contentJson;

      // Update content with loaded data
      Object.assign(content, data);

      // Initialize preview arrays
      subtitleIconPreviews.value = content.subtitleItems.map(() => null);
      highlightImagePreviews.value = content.highlightItems.map(() => null);
      particleImagePreview.value = null;

      // Initialize color states
      applyButtonColors.backgroundColor = content.applyButton.backgroundColor;
      applyButtonColors.textColor = content.applyButton.textColor;

      const applyButtonShadowParsed = parseShadowColor(content.applyButton.hoverShadow);
      Object.assign(applyButtonShadow, applyButtonShadowParsed);

      const liquidGlassHoverBorderParsed = parseRgbaColor(content.styles.liquidGlassHoverBorder);
      Object.assign(liquidGlassHoverBorderColor, liquidGlassHoverBorderParsed);

      const hoverBackgroundColors = parseGradientColors(content.styles.hoverBackgroundGradient);
      Object.assign(hoverBackgroundGradientColors, hoverBackgroundColors);

      const highlightDescriptionColorParsed = parseRgbaColor(content.styles.highlightDescriptionColor);
      Object.assign(highlightDescriptionColor, highlightDescriptionColorParsed);

      const highlightTextShadowParsed = parseShadowColor(content.styles.highlightTextShadow);
      Object.assign(highlightTextShadowColor, highlightTextShadowParsed);

      const imageShadowParsed = parseShadowColor(content.styles.imageShadow);
      Object.assign(imageShadowColor, imageShadowParsed);

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
        }));
      } else {
        files.value = [];
      }

      uploadedFiles.value = [];
      showToast('Dữ liệu đã được tải thành công', 'success');
    }
  } catch (error) {
    console.error('Error loading data:', error);
    showToast('Không thể tải dữ liệu từ server', 'error');
  } finally {
    isLoading.value = false;
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true;

    // Prepare content data
    const contentData = {...content};

    // Prepare FormData
    const formData = new FormData();

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING');

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Header Tuyển dụng',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 0,
      files: filesToSend
    };

    // Add section data
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }));

    // Add actual file binaries for NEW files
    const newFiles = filesToSend.filter(file => file.status === 'NEW');

    newFiles.forEach((fileDTO) => {
      const tempName = fileDTO.mappingTempUrl?.replace(TEMP_PREFIX, '') || fileDTO.tempName;
      const uploadedFile = uploadedFiles.value.find(f => f.tempName === tempName);

      if (uploadedFile && uploadedFile.file) {
        formData.append('files', uploadedFile.file);
      }
    });

    // Send to API
    const response = await api.post('/cms/saveChange', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data) {
      showToast('Thay đổi đã được lưu thành công', 'success');

      // Update file statuses
      files.value.forEach(file => {
        if (file.status === 'NEW') {
          file.status = 'EXISTING';
          if (response.data.files) {
            const savedFile = response.data.files.find(f => f.filename === file.filename);
            if (savedFile) {
              file.id = savedFile.id;
              file.mappingRealUrl = savedFile.mappingRealUrl;

              // Update content image URLs from temp to real
              updateContentUrls(file);
            }
          }
        } else if (file.status === 'REMOVE') {
          const index = files.value.findIndex(f => f.id === file.id);
          if (index !== -1) {
            files.value.splice(index, 1);
          }
        }
      });

      // Clear uploaded files
      uploadedFiles.value = [];
      subtitleIconPreviews.value = content.subtitleItems.map(() => null);
      highlightImagePreviews.value = content.highlightItems.map(() => null);
      particleImagePreview.value = null;

      // Reload data
      await loadData();
    }
  } catch (error) {
    console.error('Error saving changes:', error);
    showToast('Lỗi khi lưu thay đổi: ' + (error.response?.data?.message || error.message), 'error');
  } finally {
    isLoading.value = false;
  }
}

const updateContentUrls = (file) => {
  const tempUrl = TEMP_PREFIX + file.tempName;
  const realUrl = file.mappingRealUrl;

  // Check particle background image
  if (content.particleBackground.imageUrl === tempUrl) {
    content.particleBackground.imageUrl = realUrl;
  }

  // Check subtitle icons
  content.subtitleItems.forEach((item, index) => {
    if (item.icon === tempUrl) {
      item.icon = realUrl;
    }
  });

  // Check highlight images
  content.highlightItems.forEach((item, index) => {
    if (item.image === tempUrl) {
      item.image = realUrl;
    }
  });
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* ... (giữ nguyên tất cả CSS từ phiên bản trước) ... */

/* Thêm style cho gradient colors */
.gradient-colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
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
}

.gradient-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: white;
}

.shadow-color-input {
  margin-bottom: 10px;
}
.header-editor {
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

/* Subtitle Items */
.subtitle-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.subtitle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.subtitle-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1.1rem;
}

/* Highlights Management */
.highlights-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.highlights-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.highlights-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.highlight-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.highlight-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.highlight-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.highlight-header:hover {
  background-color: #e9ecef;
}

.highlight-number {
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

.highlight-title-preview {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.highlight-actions {
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

.highlight-edit-form {
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

/* Rich Text Editor Wrapper */
.rich-text-editor-wrapper {
  margin-top: 10px;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
  min-height: 60px;
}

.rich-text-editor-wrapper:hover {
  border-color: #4a6cf7;
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

  .highlights-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .highlight-header {
    flex-wrap: wrap;
  }

  .highlight-actions {
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

  .highlight-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .highlight-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>