<template>
  <div class="benefits-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Lợi ích</h2>
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
        <i class="fas fa-cog"></i> Thiết lập chung
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'benefits' }"
          @click="activeTab = 'benefits'"
      >
        <i class="fas fa-gift"></i> Danh sách lợi ích
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
      <!-- Tab Thiết lập chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Cài đặt section -->
          <div class="setting-section">
            <h3><i class="fas fa-sliders-h"></i> Cài đặt Section</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="max-width">Chiều rộng tối đa</label>
                <input
                    type="text"
                    id="max-width"
                    v-model="content.section.maxWidth"
                    placeholder="1400px"
                />
              </div>
              <div class="form-group">
                <label for="grid-gap">Khoảng cách lưới</label>
                <input
                    type="text"
                    id="grid-gap"
                    v-model="content.section.gridGap"
                    placeholder="40px"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="column-gap">Khoảng cách cột</label>
                <input
                    type="text"
                    id="column-gap"
                    v-model="content.section.columnGap"
                    placeholder="40px"
                />
              </div>
              <div class="form-group">
                <label for="container-padding">Padding container</label>
                <input
                    type="text"
                    id="container-padding"
                    v-model="content.spacing.containerPadding"
                    placeholder="0 20px"
                />
              </div>
            </div>
          </div>

          <!-- Cài đặt item -->
          <div class="setting-section">
            <h3><i class="fas fa-cube"></i> Cài đặt Item</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="item-height">Chiều cao item</label>
                <input
                    type="text"
                    id="item-height"
                    v-model="content.item.height"
                    placeholder="700px"
                />
              </div>
              <div class="form-group">
                <label for="item-radius">Bo góc item</label>
                <input
                    type="text"
                    id="item-radius"
                    v-model="content.item.borderRadius"
                    placeholder="8px"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="shadow-normal">Đổ bóng bình thường</label>
              <div class="color-input">
                <input type="color" v-model="shadowNormalColor.hex" @input="updateNormalShadowFromColor()"/>
                <input
                    type="text"
                    id="shadow-normal"
                    v-model="content.item.shadow.normal"
                    placeholder="0 4px 6px rgba(0, 0, 0, 0.1)"
                    @input="updateColorFromNormalShadow()"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="shadow-hover">Đổ bóng khi hover</label>
              <div class="color-input">
                <input type="color" v-model="shadowHoverColor.hex" @input="updateHoverShadowFromColor()"/>
                <input
                    type="text"
                    id="shadow-hover"
                    v-model="content.item.shadow.hover"
                    placeholder="0 10px 25px rgba(0, 0, 0, 0.2)"
                    @input="updateColorFromHoverShadow()"
                />
              </div>
            </div>
          </div>

          <!-- Cài đặt cột -->
          <div class="setting-section">
            <h3><i class="fas fa-columns"></i> Cài đặt Cột</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="right-padding-top">Padding top cột phải</label>
                <input
                    type="text"
                    id="right-padding-top"
                    v-model="content.columns.rightPaddingTop"
                    placeholder="145px"
                />
              </div>
              <div class="form-group">
                <label for="left-padding-top">Padding top cột trái</label>
                <input
                    type="text"
                    id="left-padding-top"
                    v-model="content.columns.leftPaddingTop"
                    placeholder="0"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="content-padding">Padding nội dung</label>
                <input
                    type="text"
                    id="content-padding"
                    v-model="content.spacing.contentPadding"
                    placeholder="40px"
                />
              </div>
              <div class="form-group">
                <label for="content-padding-bottom">Padding bottom nội dung</label>
                <input
                    type="text"
                    id="content-padding-bottom"
                    v-model="content.spacing.contentPaddingBottom"
                    placeholder="60px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Danh sách lợi ích -->
      <div v-if="activeTab === 'benefits'" class="benefits-settings">
        <div class="benefits-header">
          <h3><i class="fas fa-gift"></i> Quản lý danh sách lợi ích</h3>
          <button class="btn btn-primary" @click="addBenefit">
            <i class="fas fa-plus"></i> Thêm lợi ích mới
          </button>
        </div>

        <div class="benefits-list">
          <div
              v-for="(benefit, index) in content.benefits"
              :key="benefit.id || index"
              class="benefit-item"
              :class="{ 'editing': editingBenefit === benefit.id }"
          >
            <div class="benefit-header" @click="toggleBenefitEdit(benefit.id)">
              <div class="benefit-number">
                {{ index + 1 }}
              </div>
              <div class="benefit-preview">
                <div class="benefit-title-preview">
                  <i class="fas fa-star"></i>
                  <span>{{ benefit.title }}</span>
                </div>
                <div class="benefit-image-preview">
                  <span v-if="benefit.image" class="image-badge">
                    <i class="fas fa-image"></i>
                  </span>
                  <span v-else class="image-badge no-image">
                    <i class="fas fa-exclamation-circle"></i> Chưa có ảnh
                  </span>
                </div>
              </div>
              <div class="benefit-actions">
                <button class="btn-icon" @click.stop="moveBenefitUp(index)" :disabled="index === 0" title="Di chuyển lên">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click.stop="moveBenefitDown(index)"
                        :disabled="index === content.benefits.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-delete" @click.stop="removeBenefit(index)" title="Xóa lợi ích">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn-icon" @click.stop="toggleBenefitEdit(benefit.id)"
                        :title="editingBenefit === benefit.id ? 'Đóng chỉnh sửa' : 'Chỉnh sửa'">
                  <i :class="editingBenefit === benefit.id ? 'fas fa-chevron-up' : 'fas fa-edit'"></i>
                </button>
              </div>
            </div>

            <!-- Benefit Edit Form -->
            <div v-if="editingBenefit === benefit.id" class="benefit-edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label :for="'benefit-title-' + index">Tiêu đề lợi ích</label>
                  <input
                      type="text"
                      :id="'benefit-title-' + index"
                      v-model="benefit.title"
                      placeholder="Ví dụ: Khen thưởng"
                  />
                </div>
              </div>

              <div class="form-group">
                <label :for="'benefit-image-' + index">Hình ảnh</label>
                <div class="file-upload">
                  <div class="file-upload-area" @click="triggerImageInput(index)" @dragover.prevent
                       @drop.prevent="(e) => handleImageDrop(e, index)">
                    <input
                        type="file"
                        :ref="el => { if (el) imageInputs[index] = el }"
                        @change="(e) => handleImageUpload(e, index)"
                        accept="image/*"
                        style="display: none"
                    />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                    <p class="file-hint">Kích thước đề xuất: 800x600px</p>
                  </div>

                  <div v-if="benefit.imagePreview || benefit.image" class="upload-preview">
                    <img :src="getImageUrl(benefit.image)" alt="Preview"/>
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewBenefitImage(benefit)" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="removeBenefitImage(index)" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="!benefit.imagePreview && !benefit.image" class="form-group" style="margin-top: 10px;">
                  <label :for="'image-url-' + index">Hoặc nhập URL/tên file ảnh</label>
                  <input
                      type="text"
                      :id="'image-url-' + index"
                      v-model="benefit.image"
                      placeholder="khen-thuong.jpg"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="label" style="display: flex; justify-content: space-between">
                  <label :for="'benefit-description-' + index">Mô tả lợi ích</label>
                  <AdvancedEditModal
                      v-model="benefit.description"
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
                  <div class="tiptap" v-html="benefit.description"></div>
                </div>
              </div>

              <div class="form-actions">
                <button class="btn btn-secondary" @click="toggleBenefitEdit(benefit.id)">
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
          <!-- Typography -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Typography</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="title-size">Kích thước tiêu đề</label>
                <input
                    type="text"
                    id="title-size"
                    v-model="content.typography.title.fontSize"
                    placeholder="33px"
                />
              </div>
              <div class="form-group">
                <label for="title-weight">Độ đậm tiêu đề</label>
                <input
                    type="text"
                    id="title-weight"
                    v-model="content.typography.title.fontWeight"
                    placeholder="bolder"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="desc-size">Kích thước mô tả</label>
                <input
                    type="text"
                    id="desc-size"
                    v-model="content.typography.description.fontSize"
                    placeholder="20px"
                />
              </div>
              <div class="form-group">
                <label for="desc-line-height">Line height mô tả</label>
                <input
                    type="text"
                    id="desc-line-height"
                    v-model="content.typography.description.lineHeight"
                    placeholder="1.6"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="desc-max-width">Chiều rộng tối đa mô tả</label>
              <input
                  type="text"
                  id="desc-max-width"
                  v-model="content.typography.description.maxWidth"
                  placeholder="700px"
              />
            </div>
          </div>

          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu sắc</h3>

            <div class="color-input-group">
              <label>Màu chủ đạo</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.primary"/>
                <input type="text" v-model="content.colors.primary" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu overlay</label>
              <div class="color-input form-group">
                <input type="color" v-model="overlayColor.hex" @input="updateOverlayFromColor()"/>
                <input
                    type="text"
                    v-model="content.colors.overlay"
                    placeholder="rgba(255, 255, 255, 0.95)"
                    @input="updateColorFromOverlay()"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="title-color">Màu tiêu đề (bình thường)</label>
                <div class="color-input">
                  <input type="color" v-model="content.typography.title.color"/>
                  <input type="text" v-model="content.typography.title.color" placeholder="white"/>
                </div>
              </div>
              <div class="form-group">
                <label for="title-hover-color">Màu tiêu đề (hover)</label>
                <div class="color-input">
                  <input type="color" v-model="content.typography.title.hoverColor"/>
                  <input type="text" v-model="content.typography.title.hoverColor" placeholder="#031358"/>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="desc-color">Màu mô tả (bình thường)</label>
                <div class="color-input">
                  <input type="color" v-model="content.typography.description.color"/>
                  <input type="text" v-model="content.typography.description.color" placeholder="white"/>
                </div>
              </div>
              <div class="form-group">
                <label for="desc-hover-color">Màu mô tả (hover)</label>
                <div class="color-input">
                  <input type="color" v-model="content.typography.description.hoverColor"/>
                  <input type="text" v-model="content.typography.description.hoverColor" placeholder="#031358"/>
                </div>
              </div>
            </div>
          </div>

          <!-- Khoảng cách & Đường kẻ -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Khoảng cách & Đường kẻ</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="line-width">Chiều rộng đường kẻ</label>
                <input
                    type="text"
                    id="line-width"
                    v-model="content.spacing.lineWidth"
                    placeholder="50px"
                />
              </div>
              <div class="form-group">
                <label for="line-height">Chiều cao đường kẻ</label>
                <input
                    type="text"
                    id="line-height"
                    v-model="content.spacing.lineHeight"
                    placeholder="2px"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="line-margin">Margin đường kẻ</label>
                <input
                    type="text"
                    id="line-margin"
                    v-model="content.spacing.lineMargin"
                    placeholder="0 auto 20px"
                />
              </div>
              <div class="form-group">
                <label for="title-margin">Margin bottom tiêu đề (bình thường)</label>
                <input
                    type="text"
                    id="title-margin"
                    v-model="content.spacing.titleMarginBottom.normal"
                    placeholder="0px"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="title-margin-hover">Margin bottom tiêu đề (hover)</label>
                <input
                    type="text"
                    id="title-margin-hover"
                    v-model="content.spacing.titleMarginBottom.hover"
                    placeholder="30px"
                />
              </div>
              <div class="form-group">
                <label for="line-color">Màu đường kẻ (bình thường)</label>
                <div class="color-input">
                  <input type="color" v-model="content.colors.descriptionLine.normal"/>
                  <input type="text" v-model="content.colors.descriptionLine.normal" placeholder="white"/>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="line-hover-color">Màu đường kẻ (hover)</label>
              <div class="color-input">
                <input type="color" v-model="content.colors.descriptionLine.hover"/>
                <input type="text" v-model="content.colors.descriptionLine.hover" placeholder="#031358"/>
              </div>
            </div>
          </div>

          <!-- Responsive & Animation -->
          <div class="setting-section">
            <h3><i class="fas fa-mobile-alt"></i> Responsive & Animation</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="animation-duration">Thời gian animation</label>
                <input
                    type="text"
                    id="animation-duration"
                    v-model="content.animations.duration"
                    placeholder="0.5s"
                />
              </div>
              <div class="form-group">
                <label for="animation-timing">Timing function</label>
                <input
                    type="text"
                    id="animation-timing"
                    v-model="content.animations.timing"
                    placeholder="ease"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="responsive-max-width">Max width responsive</label>
                <input
                    type="text"
                    id="responsive-max-width"
                    v-model="content.responsive.maxWidth"
                    placeholder="1200px"
                />
              </div>
              <div class="form-group">
                <label for="responsive-item-height">Chiều cao item responsive</label>
                <input
                    type="text"
                    id="responsive-item-height"
                    v-model="content.responsive.itemHeight"
                    placeholder="400px"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="responsive-title-size">Kích thước tiêu đề responsive</label>
                <input
                    type="text"
                    id="responsive-title-size"
                    v-model="content.responsive.titleFontSize"
                    placeholder="28px"
                />
              </div>
              <div class="form-group">
                <label for="responsive-desc-size">Kích thước mô tả responsive</label>
                <input
                    type="text"
                    id="responsive-desc-size"
                    v-model="content.responsive.descriptionFontSize"
                    placeholder="18px"
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
import {ref, reactive, onMounted} from 'vue'
import api from '../../../../api/api.js'
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)
const editingBenefit = ref(null)

// Color states
const shadowNormalColor = reactive({
  hex: '#000000',
  opacity: 0.1,
  rgba: 'rgba(0, 0, 0, 0.1)'
})

const shadowHoverColor = reactive({
  hex: '#000000',
  opacity: 0.2,
  rgba: 'rgba(0, 0, 0, 0.2)'
})

const overlayColor = reactive({
  hex: '#ffffff',
  opacity: 0.95,
  rgba: 'rgba(255, 255, 255, 0.95)'
})

// Content structure based on new JSON data
const content = reactive({
  section: {
    maxWidth: '1400px',
    gridGap: '40px',
    columnGap: '40px'
  },
  benefits: [
    {
      id: 1,
      title: 'Khen thưởng',
      image: 'khen-thuong.jpg',
      description: 'Tại Thiên Hà Group, mọi nỗ lực và thành tích đều được ghi nhận xứng đáng. Những phần thưởng hấp dẫn, kịp thời dành cho các cá nhân có đóng góp nổi bật hay ý tưởng sáng tạo được áp dụng thành công – chính là cách chúng tôi lan tỏa tinh thần cống hiến và khuyến khích sự khác biệt.',
      imagePreview: null
    },
    {
      id: 2,
      title: 'Phát triển sự nghiệp',
      image: 'phat-trien.jpg',
      description: 'Thiên Hà Group tin rằng con người là nền tảng của mọi thành công. Chúng tôi xây dựng lộ trình phát triển rõ ràng, cơ hội thăng tiến rộng mở cùng các khóa đào tạo chuyên sâu giúp bạn không ngừng hoàn thiện bản thân. Cùng chúng tôi, bạn không chỉ có công việc – mà còn là một hành trình sự nghiệp bền vững.',
      imagePreview: null
    },
    {
      id: 3,
      title: 'Môi trường làm việc',
      image: 'moi-truong.png',
      description: 'Chúng tôi mang đến không gian làm việc hiện đại, trang thiết bị đầy đủ, cùng văn hóa thân thiện và đội ngũ quản lý chuyên nghiệp. Thiên Hà Group là nơi bạn có thể phát huy năng lực, học hỏi không ngừng và tận hưởng bầu không khí làm việc năng động – hiệu quả mỗi ngày.',
      imagePreview: null
    },
    {
      id: 4,
      title: 'Chăm sóc sức khỏe',
      image: 'suc-khoe.png',
      description: 'Sức khỏe luôn là ưu tiên hàng đầu. Nhân viên Thiên Hà Group được hưởng các quyền lợi như bảo hiểm xã hội, bảo hiểm quốc tế, chương trình khám sức khỏe định kỳ cùng nhiều hoạt động thể thao – giúp giữ gìn cân bằng cuộc sống. Chúng tôi mong muốn mỗi thành viên đều an tâm, khỏe mạnh và tràn đầy năng lượng để phát triển lâu dài.',
      imagePreview: null
    }
  ],
  item: {
    height: '700px',
    borderRadius: '8px',
    shadow: {
      normal: '0 4px 6px rgba(0, 0, 0, 0.1)',
      hover: '0 10px 25px rgba(0, 0, 0, 0.2)'
    }
  },
  columns: {
    rightPaddingTop: '145px',
    leftPaddingTop: '0'
  },
  typography: {
    fontFamily: "'Ubuntu', sans-serif",
    title: {
      fontSize: '33px',
      color: 'white',
      hoverColor: '#031358',
      fontWeight: 'bolder'
    },
    description: {
      fontSize: '20px',
      color: 'white',
      hoverColor: '#031358',
      lineHeight: '1.6',
      maxWidth: '700px'
    }
  },
  colors: {
    primary: '#031358',
    overlay: 'rgba(255, 255, 255, 0.95)',
    descriptionLine: {
      normal: 'white',
      hover: '#031358'
    }
  },
  spacing: {
    containerPadding: '0 20px',
    contentPadding: '40px',
    contentPaddingBottom: '60px',
    titleMarginBottom: {
      normal: '0px',
      hover: '30px'
    },
    lineWidth: '50px',
    lineHeight: '2px',
    lineMargin: '0 auto 20px'
  },
  animations: {
    duration: '0.5s',
    timing: 'ease'
  },
  responsive: {
    maxWidth: '1200px',
    itemHeight: '400px',
    titleFontSize: '28px',
    descriptionFontSize: '18px'
  }
})

// UI State
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const imageInputs = ref([])

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
const SECTION_ID = 38 // Updated to 38 for benefits section

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

const handleFileUpload = (file, type, benefitIndex, contentPath) => {
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

    // Update benefit
    const benefit = content.benefits[benefitIndex]
    benefit.image = tempUrl
    benefit.imagePreview = previewUrl

    // Create file DTO
    const fileDTO = {
      id: null,
      filename: `${type}_${file.name}`,
      status: 'NEW',
      tempName: tempName,
      mappingTempUrl: tempUrl,
      mappingRealUrl: null,
      effectiveTempUrl: previewUrl,
      realFilenameForSearch: file.name,
      benefitIndex: benefitIndex // Store which benefit this file belongs to
    }

    // Store in uploadedFiles
    uploadedFiles.value.push({
      tempName: tempName,
      file: file,
      previewUrl: previewUrl,
      benefitIndex: benefitIndex
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

// ========== SHADOW & OVERLAY FUNCTIONS ==========
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};

const parseColorFromString = (colorStr) => {
  if (!colorStr) return {hex: '#000000', opacity: 0.1, rgba: 'rgba(0, 0, 0, 0.1)'};

  // Try to find rgba/rgb
  const rgbaMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

    return {hex, opacity, rgba};
  }

  // Try to find hex color
  const hexMatch = colorStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (hexMatch && hexMatch[0]) {
    return {hex: hexMatch[0], opacity: 1, rgba: hexMatch[0]};
  }

  return {hex: '#000000', opacity: 0.1, rgba: 'rgba(0, 0, 0, 0.1)'};
};

const updateNormalShadowFromColor = () => {
  const shadowRegex = /([\d.-]+px\s+){3,4}/;
  const match = content.item.shadow.normal.match(shadowRegex);

  if (match) {
    const rgb = hexToRgb(shadowNormalColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowNormalColor.opacity})`;
    content.item.shadow.normal = `${match[0].trim()} ${newRgba}`;
    shadowNormalColor.rgba = newRgba;
  } else {
    const rgb = hexToRgb(shadowNormalColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowNormalColor.opacity})`;
    content.item.shadow.normal = `0 4px 6px ${newRgba}`;
    shadowNormalColor.rgba = newRgba;
  }
};

const updateColorFromNormalShadow = () => {
  const parsed = parseColorFromString(content.item.shadow.normal);
  shadowNormalColor.hex = parsed.hex;
  shadowNormalColor.opacity = parsed.opacity;
  shadowNormalColor.rgba = parsed.rgba;
};

const updateHoverShadowFromColor = () => {
  const shadowRegex = /([\d.-]+px\s+){3,4}/;
  const match = content.item.shadow.hover.match(shadowRegex);

  if (match) {
    const rgb = hexToRgb(shadowHoverColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowHoverColor.opacity})`;
    content.item.shadow.hover = `${match[0].trim()} ${newRgba}`;
    shadowHoverColor.rgba = newRgba;
  } else {
    const rgb = hexToRgb(shadowHoverColor.hex);
    const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowHoverColor.opacity})`;
    content.item.shadow.hover = `0 10px 25px ${newRgba}`;
    shadowHoverColor.rgba = newRgba;
  }
};

const updateColorFromHoverShadow = () => {
  const parsed = parseColorFromString(content.item.shadow.hover);
  shadowHoverColor.hex = parsed.hex;
  shadowHoverColor.opacity = parsed.opacity;
  shadowHoverColor.rgba = parsed.rgba;
};

const updateOverlayFromColor = () => {
  const rgb = hexToRgb(overlayColor.hex);
  const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${overlayColor.opacity})`;
  content.colors.overlay = newRgba;
  overlayColor.rgba = newRgba;
};

const updateColorFromOverlay = () => {
  const parsed = parseColorFromString(content.colors.overlay);
  overlayColor.hex = parsed.hex;
  overlayColor.opacity = parsed.opacity;
  overlayColor.rgba = parsed.rgba;
};

// ========== BENEFIT MANAGEMENT ==========
const addBenefit = () => {
  const newId = Date.now()

  content.benefits.push({
    id: newId,
    title: 'Lợi ích mới',
    image: '',
    description: 'Nhập mô tả cho lợi ích này...',
    imagePreview: null
  })

  editingBenefit.value = newId
  showToast('Đã thêm lợi ích mới', 'success')
}

const removeBenefit = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa lợi ích này?')) {
    const benefit = content.benefits[index]

    // Remove any file references related to this benefit
    if (benefit.image && benefit.image.startsWith(TEMP_PREFIX)) {
      const tempName = benefit.image.replace(TEMP_PREFIX, '')

      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else if (benefit.image) {
      const fileIndex = files.value.findIndex(f => f.filename === benefit.image)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    content.benefits.splice(index, 1)

    if (editingBenefit.value === benefit.id) {
      editingBenefit.value = null
    }

    showToast('Đã xóa lợi ích', 'success')
  }
}

const moveBenefitUp = (index) => {
  if (index > 0) {
    const temp = content.benefits[index]
    content.benefits[index] = content.benefits[index - 1]
    content.benefits[index - 1] = temp
  }
}

const moveBenefitDown = (index) => {
  if (index < content.benefits.length - 1) {
    const temp = content.benefits[index]
    content.benefits[index] = content.benefits[index + 1]
    content.benefits[index + 1] = temp
  }
}

const toggleBenefitEdit = (benefitId) => {
  editingBenefit.value = editingBenefit.value === benefitId ? null : benefitId
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

      // Initialize shadow and overlay colors
      const normalShadow = parseColorFromString(content.item.shadow.normal);
      shadowNormalColor.hex = normalShadow.hex;
      shadowNormalColor.opacity = normalShadow.opacity;
      shadowNormalColor.rgba = normalShadow.rgba;

      const hoverShadow = parseColorFromString(content.item.shadow.hover);
      shadowHoverColor.hex = hoverShadow.hex;
      shadowHoverColor.opacity = hoverShadow.opacity;
      shadowHoverColor.rgba = hoverShadow.rgba;

      const overlay = parseColorFromString(content.colors.overlay);
      overlayColor.hex = overlay.hex;
      overlayColor.opacity = overlay.opacity;
      overlayColor.rgba = overlay.rgba;

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

      // Initialize image previews for benefits
      content.benefits.forEach(benefit => {
        if (benefit.image) {
          benefit.imagePreview = getImageUrl(benefit.image)
        }
      })

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

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Lợi ích',
      contentJson: JSON.stringify(content, null, 2),
      sortOrder: 2,
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

              // Update benefit image URLs from temp to real
              updateBenefitImageUrl(file)
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

const updateBenefitImageUrl = (file) => {
  const tempUrl = TEMP_PREFIX + file.tempName
  const realUrl = file.mappingRealUrl

  // Find which benefit this file belongs to
  const uploadedFile = uploadedFiles.value.find(f => f.tempName === file.tempName)
  if (uploadedFile && uploadedFile.benefitIndex !== undefined) {
    const benefit = content.benefits[uploadedFile.benefitIndex]
    if (benefit && benefit.image === tempUrl) {
      benefit.image = realUrl
      benefit.imagePreview = getImageUrl(realUrl)
    }
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
const triggerImageInput = (index) => {
  if (imageInputs.value[index]) {
    imageInputs.value[index].click()
  }
}

const handleImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'benefit_image', index, `benefits[${index}].image`)
  }
  event.target.value = ''
}

const handleImageDrop = (event, index) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'benefit_image', index, `benefits[${index}].image`)
  }
}

const removeBenefitImage = (index) => {
  const benefit = content.benefits[index]
  if (benefit.image) {
    if (benefit.image.startsWith(TEMP_PREFIX)) {
      const tempName = benefit.image.replace(TEMP_PREFIX, '')

      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else {
      const fileIndex = files.value.findIndex(f => f.filename === benefit.image)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    benefit.image = ''
    benefit.imagePreview = null

    showToast('Đã xóa ảnh', 'success')
  }
}

// ========== PREVIEW FUNCTIONS ==========
const previewBenefitImage = (benefit) => {
  if (benefit.image) {
    previewImageUrl.value = getImageUrl(benefit.image)
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
  loadData()
})
</script>

<style scoped>
.benefits-editor {
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

/* Benefits Management */
.benefits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.benefits-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.benefit-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.benefit-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.benefit-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.benefit-header:hover {
  background-color: #e9ecef;
}

.benefit-number {
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

.benefit-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefit-title-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.benefit-title-preview i {
  color: #4a6cf7;
  width: 20px;
}

.benefit-image-preview {
  font-size: 0.85rem;
}

.image-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: #e9ecef;
  border-radius: 20px;
  color: #6c757d;
}

.image-badge.no-image {
  background-color: #fff3cd;
  color: #856404;
}

.benefit-actions {
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

.benefit-edit-form {
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

  .benefits-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .benefit-header {
    flex-wrap: wrap;
  }

  .benefit-actions {
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

  .benefit-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .benefit-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>