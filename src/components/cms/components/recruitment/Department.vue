<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Vị trí Tuyển dụng</h2>
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
          :class="{ active: activeTab === 'departments' }"
          @click="activeTab = 'departments'"
      >
        <i class="fas fa-building"></i> Phòng ban tuyển dụng
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
          <!-- Thông tin header -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề & Mô tả</h3>

            <div class="form-group">
              <label for="header-title">Tiêu đề chính</label>
              <input
                  type="text"
                  id="header-title"
                  v-model="content.header.title"
                  placeholder="TUYỂN DỤNG - VỊ TRÍ ĐANG MỞ"
              />
            </div>

            <div class="form-group">
              <label for="header-subtitle">Tiêu đề phụ</label>
              <input
                  type="text"
                  id="header-subtitle"
                  v-model="content.header.subtitle"
                  placeholder="Khám phá cơ hội nghề nghiệp tại công ty chúng tôi"
              />
            </div>
          </div>

          <!-- Thông tin card -->
          <div class="setting-section">
            <h3><i class="fas fa-id-card"></i> Thông tin thẻ</h3>

            <div class="form-group">
              <label for="hover-text">Văn bản khi hover</label>
              <input
                  type="text"
                  id="hover-text"
                  v-model="content.card.hoverIndicatorText"
                  placeholder="Xem chi tiết"
              />
            </div>

            <div class="form-group">
              <label for="apply-button-text">Văn bản nút ứng tuyển</label>
              <input
                  type="text"
                  id="apply-button-text"
                  v-model="content.card.applyButtonText"
                  placeholder="Ứng tuyển ngay"
              />
            </div>
          </div>

          <!-- Hình ảnh nền -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Hình ảnh nền</h3>

            <div class="file-upload">
              <div class="file-upload-area" @click="triggerImageInput" @dragover.prevent
                   @drop.prevent="handleImageDrop">
                <input
                    type="file"
                    ref="imageInput"
                    @change="handleImageUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Kích thước đề xuất: 1920x1080px</p>
              </div>

              <div v-if="imagePreview || content.styles.background.image" class="upload-preview">
                <img :src="getImageUrl(content.styles.background.image)" alt="Preview"/>
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

            <div class="form-group" v-if="!imagePreview && !content.styles.background.image">
              <label for="image-url">Hoặc nhập URL ảnh</label>
              <input
                  type="text"
                  id="image-url"
                  v-model="content.styles.background.image"
                  placeholder="file_20251215_110030_179.jpg"
              />
            </div>

            <div class="color-input-group">
              <label>Gradient overlay</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.background.color1" @change="updateBackgroundGradient()"/>
                <input type="color" v-model="gradientColors.background.color2" @change="updateBackgroundGradient()"/>
                <input type="color" v-model="gradientColors.background.color3" @change="updateBackgroundGradient()"/>
                <input
                    type="text"
                    v-model="content.styles.background.gradient"
                    placeholder="linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0) 100%)"
                    @input="updateBackgroundColorsFromGradient()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Phòng ban -->
      <div v-if="activeTab === 'departments'" class="departments-settings">
        <div class="departments-header">
          <h3><i class="fas fa-building"></i> Quản lý phòng ban tuyển dụng</h3>
          <button class="btn btn-primary" @click="addDepartment">
            <i class="fas fa-plus"></i> Thêm phòng ban mới
          </button>
        </div>

        <div class="departments-list">
          <div
              v-for="(department, index) in content.departments"
              :key="department.id || index"
              class="department-item"
              :class="{ 'editing': editingDepartment === department.id }"
          >
            <div class="department-header" @click="toggleDepartmentEdit(department.id)">
              <div class="department-number">
                {{ index + 1 }}
              </div>
              <div class="department-name-preview">
                <i class="fas fa-building"></i>
                <span>{{ department.name }}</span>
              </div>
              <div class="department-actions">
                <button class="btn-icon" @click.stop="moveDepartmentUp(index)" :disabled="index === 0" title="Di chuyển lên">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click.stop="moveDepartmentDown(index)"
                        :disabled="index === content.departments.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-delete" @click.stop="removeDepartment(index)" title="Xóa phòng ban">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn-icon" @click.stop="toggleDepartmentEdit(department.id)"
                        :title="editingDepartment === department.id ? 'Đóng chỉnh sửa' : 'Chỉnh sửa'">
                  <i :class="editingDepartment === department.id ? 'fas fa-chevron-up' : 'fas fa-edit'"></i>
                </button>
              </div>
            </div>

            <!-- Department Edit Form -->
            <div v-if="editingDepartment === department.id" class="department-edit-form">
              <div class="form-group">
                <label :for="'department-name-' + index">Tên phòng ban</label>
                <input
                    type="text"
                    :id="'department-name-' + index"
                    v-model="department.name"
                    placeholder="Phòng Marketing"
                />
              </div>

              <div class="form-group">
                <div class="label" style="display: flex; justify-content: space-between">
                  <label :for="'department-description-' + index">Mô tả phòng ban</label>
                  <AdvancedEditModal
                      v-model="department.description"
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
                  <div class="tiptap" v-html="department.description"></div>
                </div>
              </div>

              <div class="form-actions">
                <button class="btn btn-secondary" @click="toggleDepartmentEdit(department.id)">
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
          <!-- Header styles -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Giao diện Header</h3>

            <div class="color-input-group">
              <label>Gradient background header</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.header.color1" @change="updateHeaderGradient()"/>
                <input type="color" v-model="gradientColors.header.color2" @change="updateHeaderGradient()"/>
                <input
                    type="text"
                    v-model="content.styles.header.rectangleGradient"
                    placeholder="linear-gradient(135deg, rgba(3, 19, 88, 0.85) 0%, rgba(0, 48, 255, 0.7) 100%)"
                    @input="updateHeaderColorsFromGradient()"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="rectangle-height">Chiều cao header</label>
                <div class="input-with-unit">
                  <input type="text" id="rectangle-height" v-model="content.styles.header.rectangleHeight"
                         placeholder="220px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="border-radius">Bo góc header</label>
                <input
                    type="text"
                    id="border-radius"
                    v-model="content.styles.header.rectangleBorderRadius"
                    placeholder="0 0 50% 50% / 0 0 100px 100px"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="title-font-size">Kích thước tiêu đề</label>
                <div class="input-with-unit">
                  <input type="text" id="title-font-size" v-model="content.styles.header.titleFontSize"
                         placeholder="40px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="title-color">Màu tiêu đề</label>
                <div class="color-input">
                  <input type="color" v-model="titleColorHex" @input="updateTitleColor()"/>
                  <input type="text" v-model="content.styles.header.titleColor" placeholder="#ffffff"/>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="subtitle-font-size">Kích thước phụ đề</label>
                <div class="input-with-unit">
                  <input type="text" id="subtitle-font-size" v-model="content.styles.header.subtitleFontSize"
                         placeholder="18px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="subtitle-color">Màu phụ đề</label>
                <div class="color-input">
                  <input type="color" v-model="subtitleColorHex" @input="updateSubtitleColor()"/>
                  <input type="text" v-model="content.styles.header.subtitleColor" placeholder="rgba(255, 255, 255, 0.85)"/>
                </div>
              </div>
            </div>
          </div>

          <!-- Card styles -->
          <div class="setting-section">
            <h3><i class="fas fa-border-style"></i> Giao diện Thẻ</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="normal-height">Chiều cao thẻ bình thường</label>
                <div class="input-with-unit">
                  <input type="text" id="normal-height" v-model="content.styles.card.normalHeight"
                         placeholder="200px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="expanded-height">Chiều cao khi mở rộng</label>
                <div class="input-with-unit">
                  <input type="text" id="expanded-height" v-model="content.styles.card.expandedHeight"
                         placeholder="350px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="dept-name-font-size">Kích thước tên phòng</label>
                <div class="input-with-unit">
                  <input type="text" id="dept-name-font-size" v-model="content.styles.card.departmentNameFontSize"
                         placeholder="26px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="dept-name-color">Màu tên phòng</label>
                <div class="color-input">
                  <input type="color" v-model="deptNameColorHex" @input="updateDeptNameColor()"/>
                  <input type="text" v-model="content.styles.card.departmentNameColor" placeholder="#f0f0f0"/>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="desc-font-size">Kích thước mô tả</label>
                <div class="input-with-unit">
                  <input type="text" id="desc-font-size" v-model="content.styles.card.descriptionFontSize"
                         placeholder="16px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="desc-color">Màu mô tả</label>
                <div class="color-input">
                  <input type="color" v-model="descColorHex" @input="updateDescColor()"/>
                  <input type="text" v-model="content.styles.card.descriptionColor" placeholder="#f8f8f8"/>
                </div>
              </div>
            </div>

            <div class="color-input-group">
              <label>Gradient nút ứng tuyển</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.applyButton.color1" @change="updateApplyButtonGradient()"/>
                <input type="color" v-model="gradientColors.applyButton.color2" @change="updateApplyButtonGradient()"/>
                <input
                    type="text"
                    v-model="content.styles.card.applyButtonGradient"
                    placeholder="linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)"
                    @input="updateApplyButtonColorsFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu viền nút ứng tuyển</label>
              <div class="color-input form-group">
                <input type="color" v-model="borderColorHex" @input="updateBorderColor()"/>
                <input
                    type="text"
                    v-model="content.styles.card.applyButtonBorder"
                    placeholder="2px solid rgba(255, 255, 255, 0.4)"
                />
              </div>
            </div>
          </div>

          <!-- Glass layer styles -->
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
import {ref, reactive, onMounted, computed} from 'vue'
import api from '../../../../api/api.js'
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)
const editingDepartment = ref(null)

// Gradient colors state
const gradientColors = reactive({
  background: {
    color1: '#000000',
    color2: '#000000',
    color3: '#000000'
  },
  header: {
    color1: '#031358',
    color2: '#0030ff'
  },
  applyButton: {
    color1: '#ffffff',
    color2: '#ffffff'
  },
  glassLayer1: {
    color1: '#ffffff',
    color2: '#ffffff',
    color3: '#ffffff',
    color4: '#ffffff'
  }
})

// Color states
const titleColorHex = ref('#ffffff')
const subtitleColorHex = ref('#ffffff')
const deptNameColorHex = ref('#f0f0f0')
const descColorHex = ref('#f8f8f8')
const borderColorHex = ref('#ffffff')

// Content structure based on new JSON data
const content = reactive({
  header: {
    title: 'TUYỂN DỤNG - VỊ TRÍ ĐANG MỞ',
    subtitle: 'Khám phá cơ hội nghề nghiệp tại công ty chúng tôi'
  },
  card: {
    hoverIndicatorText: 'Xem chi tiết',
    applyButtonText: 'Ứng tuyển ngay'
  },
  departments: [
    {
      id: 1,
      name: 'Phòng Marketing',
      description: 'Chúng tôi tìm kiếm những chuyên gia sáng tạo với khả năng xây dựng chiến lược marketing hiệu quả. Bạn sẽ tham gia vào các chiến dịch quảng bá thương hiệu, phân tích thị trường và phát triển nội dung đa kênh để thu hút khách hàng mục tiêu.'
    },
    {
      id: 2,
      name: 'Phòng Giải pháp',
      description: 'Đội ngũ giải pháp của chúng tôi chuyên nghiên cứu và phát triển các giải pháp công nghệ tiên tiến. Chúng tôi cần những kỹ sư tài năng với tư duy đổi mới và khả năng giải quyết vấn đề phức tạp trong môi trường đa dạng.'
    },
    {
      id: 3,
      name: 'Phòng Telesale',
      description: 'Gia nhập đội ngũ telesale năng động của chúng tôi để phát triển kỹ năng giao tiếp và thuyết phục. Bạn sẽ có cơ hội làm việc với khách hàng tiềm năng và đóng góp trực tiếp vào doanh thu của công ty thông qua các chiến dịch bán hàng.'
    },
    {
      id: 4,
      name: 'Phòng Bán nhanh',
      description: 'Đội ngũ bán hàng nhanh của chúng tôi chuyên xử lý các giao dịch với tốc độ cao và hiệu quả tối ưu. Chúng tôi tìm kiếm những cá nhân có khả năng làm việc dưới áp lực và đạt được mục tiêu doanh số đề ra.'
    },
    {
      id: 5,
      name: 'Phòng Thông tin',
      description: 'Phòng thông tin đảm bảo luồng thông tin nội bộ và đối ngoại được truyền tải chính xác và kịp thời. Chúng tôi cần những chuyên gia có khả năng phân tích và tổng hợp thông tin đa chiều từ nhiều nguồn khác nhau.'
    },
    {
      id: 6,
      name: 'Phòng Định giá',
      description: 'Đội ngũ định giá của chúng tôi chịu trách nhiệm phân tích thị trường và xác định chiến lược giá cả cạnh tranh. Chúng tôi tìm kiếm những chuyên gia với kiến thức sâu về tài chính và thị trường để đưa ra quyết định chính xác.'
    }
  ],
  styles: {
    background: {
      image: 'file_20251215_110030_179.jpg',
      gradient: 'linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0) 100%)'
    },
    header: {
      rectangleGradient: 'linear-gradient(135deg, rgba(3, 19, 88, 0.85) 0%, rgba(0, 48, 255, 0.7) 100%)',
      rectangleHeight: '220px',
      rectangleBorderRadius: '0 0 50% 50% / 0 0 100px 100px',
      titleFontSize: '40px',
      titleColor: '#ffffff',
      subtitleFontSize: '18px',
      subtitleColor: 'rgba(255, 255, 255, 0.85)'
    },
    card: {
      normalHeight: '200px',
      expandedHeight: '350px',
      departmentNameFontSize: '26px',
      departmentNameColor: '#f0f0f0',
      descriptionFontSize: '16px',
      descriptionColor: '#f8f8f8',
      applyButtonGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
      applyButtonBorder: '2px solid rgba(255, 255, 255, 0.4)'
    },
    glassLayers: {
      layer1Gradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 30%, rgba(255, 255, 255, 0.15) 70%, rgba(255, 255, 255, 0.08) 100%)',
      layer2Gradient: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
      layer3Gradient: 'linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.12) 50%, transparent 100%)'
    }
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
const SECTION_ID = 40

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

const getOpacityFromRgba = (rgba) => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  return match && match[4] ? parseFloat(match[4]) : 1;
};

// Update color functions
const updateTitleColor = () => {
  content.styles.header.titleColor = titleColorHex.value;
};

const updateSubtitleColor = () => {
  const opacity = getOpacityFromRgba(content.styles.header.subtitleColor);
  content.styles.header.subtitleColor = hexToRgba(subtitleColorHex.value, opacity);
};

const updateDeptNameColor = () => {
  content.styles.card.departmentNameColor = deptNameColorHex.value;
};

const updateDescColor = () => {
  content.styles.card.descriptionColor = descColorHex.value;
};

const updateBorderColor = () => {
  const match = content.styles.card.applyButtonBorder.match(/rgba?\([^)]+\)/);
  if (match) {
    const opacity = getOpacityFromRgba(match[0]);
    content.styles.card.applyButtonBorder = content.styles.card.applyButtonBorder.replace(
        /rgba?\([^)]+\)/,
        hexToRgba(borderColorHex.value, opacity)
    );
  }
};

// ========== GRADIENT FUNCTIONS ==========
const parseGradientColors = (gradientStr, expectedCount = 2) => {
  if (!gradientStr) {
    const defaultColors = ['#000000', '#000000', '#000000', '#000000'].slice(0, expectedCount);
    return defaultColors.reduce((acc, color, index) => {
      acc[`color${index + 1}`] = color;
      return acc;
    }, {});
  }

  const rgbaMatches = gradientStr.match(/rgba?\([^)]+\)/g);
  if (rgbaMatches) {
    const hexColors = rgbaMatches.map(rgba => rgbaToHex(rgba));
    return hexColors.reduce((acc, color, index) => {
      if (index < expectedCount) {
        acc[`color${index + 1}`] = color;
      }
      return acc;
    }, {});
  }

  const hexMatches = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (hexMatches) {
    return hexMatches.reduce((acc, color, index) => {
      if (index < expectedCount) {
        acc[`color${index + 1}`] = color;
      }
      return acc;
    }, {});
  }

  const defaultColors = ['#000000', '#000000', '#000000', '#000000'].slice(0, expectedCount);
  return defaultColors.reduce((acc, color, index) => {
    acc[`color${index + 1}`] = color;
    return acc;
  }, {});
};

const createGradientString = (colors, template) => {
  // Extract opacity values from template
  const rgbaMatches = template.match(/rgba?\([^)]+\)/g);
  const opacities = rgbaMatches ? rgbaMatches.map(match => getOpacityFromRgba(match)) : [0.5, 0.3, 0];

  // Convert hex colors to rgba with opacities
  const rgbaColors = Object.values(colors).map((hex, index) => {
    const opacity = opacities[index] || (index === 0 ? 0.5 : index === 1 ? 0.3 : 0);
    return hexToRgba(hex, opacity);
  });

  // Replace colors in template
  let result = template;
  rgbaMatches?.forEach((match, index) => {
    if (rgbaColors[index]) {
      result = result.replace(match, rgbaColors[index]);
    }
  });

  return result;
};

// Background gradient
const updateBackgroundGradient = () => {
  content.styles.background.gradient = createGradientString(
      gradientColors.background,
      'linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0) 100%)'
  );
};

const updateBackgroundColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.background.gradient, 3);
  gradientColors.background.color1 = colors.color1 || '#000000';
  gradientColors.background.color2 = colors.color2 || '#000000';
  gradientColors.background.color3 = colors.color3 || '#000000';
};

// Header gradient
const updateHeaderGradient = () => {
  content.styles.header.rectangleGradient = `linear-gradient(135deg, ${hexToRgba(gradientColors.header.color1, 0.85)} 0%, ${hexToRgba(gradientColors.header.color2, 0.7)} 100%)`;
};

const updateHeaderColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.header.rectangleGradient, 2);
  gradientColors.header.color1 = colors.color1 || '#031358';
  gradientColors.header.color2 = colors.color2 || '#0030ff';
};

// Apply button gradient
const updateApplyButtonGradient = () => {
  content.styles.card.applyButtonGradient = `linear-gradient(135deg, ${hexToRgba(gradientColors.applyButton.color1, 0.25)} 0%, ${hexToRgba(gradientColors.applyButton.color2, 0.15)} 100%)`;
};

const updateApplyButtonColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.card.applyButtonGradient, 2);
  gradientColors.applyButton.color1 = colors.color1 || '#ffffff';
  gradientColors.applyButton.color2 = colors.color2 || '#ffffff';
};

// Glass layer 1 gradient
const updateGlassLayer1Gradient = () => {
  content.styles.glassLayers.layer1Gradient = `linear-gradient(135deg, ${hexToRgba(gradientColors.glassLayer1.color1, 0.15)} 0%, ${hexToRgba(gradientColors.glassLayer1.color2, 0.08)} 30%, ${hexToRgba(gradientColors.glassLayer1.color3, 0.15)} 70%, ${hexToRgba(gradientColors.glassLayer1.color4, 0.08)} 100%)`;
};

const updateGlassLayer1ColorsFromGradient = () => {
  const colors = parseGradientColors(content.styles.glassLayers.layer1Gradient, 4);
  gradientColors.glassLayer1.color1 = colors.color1 || '#ffffff';
  gradientColors.glassLayer1.color2 = colors.color2 || '#ffffff';
  gradientColors.glassLayer1.color3 = colors.color3 || '#ffffff';
  gradientColors.glassLayer1.color4 = colors.color4 || '#ffffff';
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

    // Update content - navigate to styles.background.image
    const path = 'styles.background.image'
    const pathParts = path.split('.')
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

// ========== DEPARTMENT MANAGEMENT ==========
const addDepartment = () => {
  const newId = Date.now()

  content.departments.push({
    id: newId,
    name: 'Phòng ban mới',
    description: 'Nhập mô tả cho phòng ban này...'
  })

  editingDepartment.value = newId
  showToast('Đã thêm phòng ban mới', 'success')
}

const removeDepartment = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
    const department = content.departments[index]
    content.departments.splice(index, 1)

    if (editingDepartment.value === department.id) {
      editingDepartment.value = null
    }

    showToast('Đã xóa phòng ban', 'success')
  }
}

const moveDepartmentUp = (index) => {
  if (index > 0) {
    const temp = content.departments[index]
    content.departments[index] = content.departments[index - 1]
    content.departments[index - 1] = temp
  }
}

const moveDepartmentDown = (index) => {
  if (index < content.departments.length - 1) {
    const temp = content.departments[index]
    content.departments[index] = content.departments[index + 1]
    content.departments[index + 1] = temp
  }
}

const toggleDepartmentEdit = (departmentId) => {
  editingDepartment.value = editingDepartment.value === departmentId ? null : departmentId
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

      // Initialize gradient colors
      const backgroundColors = parseGradientColors(content.styles.background.gradient, 3);
      gradientColors.background.color1 = backgroundColors.color1 || '#000000';
      gradientColors.background.color2 = backgroundColors.color2 || '#000000';
      gradientColors.background.color3 = backgroundColors.color3 || '#000000';

      const headerColors = parseGradientColors(content.styles.header.rectangleGradient, 2);
      gradientColors.header.color1 = headerColors.color1 || '#031358';
      gradientColors.header.color2 = headerColors.color2 || '#0030ff';

      const applyButtonColors = parseGradientColors(content.styles.card.applyButtonGradient, 2);
      gradientColors.applyButton.color1 = applyButtonColors.color1 || '#ffffff';
      gradientColors.applyButton.color2 = applyButtonColors.color2 || '#ffffff';

      const glassLayer1Colors = parseGradientColors(content.styles.glassLayers.layer1Gradient, 4);
      gradientColors.glassLayer1.color1 = glassLayer1Colors.color1 || '#ffffff';
      gradientColors.glassLayer1.color2 = glassLayer1Colors.color2 || '#ffffff';
      gradientColors.glassLayer1.color3 = glassLayer1Colors.color3 || '#ffffff';
      gradientColors.glassLayer1.color4 = glassLayer1Colors.color4 || '#ffffff';

      // Initialize color inputs
      titleColorHex.value = rgbaToHex(content.styles.header.titleColor);
      subtitleColorHex.value = rgbaToHex(content.styles.header.subtitleColor);
      deptNameColorHex.value = rgbaToHex(content.styles.card.departmentNameColor);
      descColorHex.value = rgbaToHex(content.styles.card.descriptionColor);

      // Extract border color
      const borderMatch = content.styles.card.applyButtonBorder.match(/rgba?\([^)]+\)/);
      borderColorHex.value = borderMatch ? rgbaToHex(borderMatch[0]) : '#ffffff';

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
    const contentData = {...content}

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Vị trí đang tuyển',
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

  // Check image property in content
  if (content.styles.background.image === tempUrl) {
    content.styles.background.image = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
const triggerImageInput = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh nền', imagePreview, 'styles.background.image')
  }
  event.target.value = ''
}

const handleImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Hình ảnh nền', imagePreview, 'styles.background.image')
  }
}

const removeImage = () => {
  if (content.styles.background.image) {
    handleRemoveFile(content.styles.background.image, 'styles.background.image', imagePreview)
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
  if (content.styles.background.image) {
    previewImageUrl.value = getImageUrl(content.styles.background.image)
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

/* Departments Management */
.departments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.departments-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.departments-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.department-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.department-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.department-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.department-header:hover {
  background-color: #e9ecef;
}

.department-number {
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

.department-name-preview {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.department-name-preview i {
  color: #4a6cf7;
  width: 20px;
}

.department-actions {
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

.department-edit-form {
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
  width: 40px;
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

  .departments-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .department-header {
    flex-wrap: wrap;
  }

  .department-actions {
    margin-left: auto;
  }

  .color-input {
    flex-wrap: wrap;
  }

  .color-input input[type="color"] {
    width: 35px;
    height: 35px;
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

  .department-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .department-actions {
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
</style>