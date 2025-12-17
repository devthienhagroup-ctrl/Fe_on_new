<template>
  <div class="sold-projects-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Dự án Đã Bán</h2>
      <div class="header-controls">
        <button class="btn btn-primary" @click="addNewProject">
          <i class="fas fa-plus"></i> Thêm Dự án Mới
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
          :class="{ active: activeTab === 'projects' }"
          @click="activeTab = 'projects'"
      >
        <i class="fas fa-building"></i> Danh sách dự án ({{ soldProjects.length }})
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'stats' }"
          @click="activeTab = 'stats'"
      >
        <i class="fas fa-chart-bar"></i> Thống kê ({{ stats.length }})
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab cài đặt chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Tiêu đề & Văn bản -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề & Văn bản</h3>
            <div class="form-group">
              <label for="section-title">Tiêu đề chính</label>
              <input
                  type="text"
                  id="section-title"
                  v-model="settings.title"
                  placeholder="DỰ ÁN ĐÃ BÁN THÀNH CÔNG"
              />
            </div>
            <div class="form-group">
              <label for="subtitle">Phụ đề</label>
              <input
                  type="text"
                  id="subtitle"
                  v-model="settings.subtitle"
                  placeholder="Tổng hợp các dự án đã bán thành công nhờ định giá đúng"
              />
            </div>
            <div class="form-group">
              <label for="projects-title">Tiêu đề danh sách dự án</label>
              <input
                  type="text"
                  id="projects-title"
                  v-model="settings.projectsTitle"
                  placeholder="Một số dự án đã bán thành công trong năm 2025"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="price-label">Nhãn giá bán</label>
                <input
                    type="text"
                    id="price-label"
                    v-model="settings.priceLabel"
                    placeholder="Giá bán"
                />
              </div>
              <div class="form-group">
                <label for="view-count-label">Nhãn lượt xem</label>
                <input
                    type="text"
                    id="view-count-label"
                    v-model="settings.viewCountLabel"
                    placeholder="Lượt xem"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="offer-count-label">Nhãn lượt đề nghị</label>
                <input
                    type="text"
                    id="offer-count-label"
                    v-model="settings.offerCountLabel"
                    placeholder="Lượt đề nghị"
                />
              </div>
              <div class="form-group">
                <label for="interest-level-label">Nhãn mức độ quan tâm</label>
                <input
                    type="text"
                    id="interest-level-label"
                    v-model="settings.interestLevelLabel"
                    placeholder="Mức độ quan tâm"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="detail-button-text">Văn bản nút chi tiết</label>
              <input
                  type="text"
                  id="detail-button-text"
                  v-model="settings.detailButtonText"
                  placeholder="Xem Chi Tiết"
              />
            </div>
          </div>

          <!-- Biểu tượng & Hình ảnh -->
          <div class="setting-section">
            <h3><i class="fas fa-icons"></i> Biểu tượng & Hình ảnh</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="prev-button-icon">Biểu tượng nút trước</label>
                <IconPicker v-model="settings.prevButtonIcon"/>
              </div>
              <div class="form-group">
                <label for="next-button-icon">Biểu tượng nút sau</label>
                <IconPicker v-model="settings.nextButtonIcon"/>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="close-button-icon">Biểu tượng đóng</label>
                <IconPicker v-model="settings.closeButtonIcon"/>
              </div>
              <div class="form-group">
                <label for="lightbox-prev-icon">Biểu tượng lightbox trước</label>
                <IconPicker v-model="settings.lightboxPrevIcon"/>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="lightbox-next-icon">Biểu tượng lightbox sau</label>
                <IconPicker v-model="settings.lightboxNextIcon"/>
              </div>
              <div class="form-group">
                <label for="columns">Số cột hiển thị</label>
                <input
                    type="number"
                    id="columns"
                    v-model="settings.columns"
                    placeholder="3"
                    min="1"
                    max="4"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="sold-badge-text">Văn bản badge đã bán</label>
              <input
                  type="text"
                  id="sold-badge-text"
                  v-model="settings.soldBadgeText"
                  placeholder="sold-out"
              />
            </div>
            <div class="form-group">
              <label><i class="fas fa-image"></i> Hình ảnh badge đã bán</label>
              <div class="file-upload compact">
                <div class="file-upload-area" @click="triggerBadgeImageInput" @dragover.prevent @drop.prevent="handleBadgeImageDrop">
                  <input
                      type="file"
                      ref="badgeImageInput"
                      @change="handleBadgeImageUpload"
                      accept="image/*"
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                </div>

                <div v-if="badgeImagePreview || settings.soldBadgeImage" class="upload-preview">
                  <img :src="getImageUrl(settings.soldBadgeImage)" alt="Preview" />
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewBadgeImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeBadgeImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="input-hint" v-if="!badgeImagePreview && !settings.soldBadgeImage">
                <input
                    type="text"
                    v-model="settings.soldBadgeImage"
                    placeholder="/imgs/sold-out.png"
                    class="image-url-input"
                />
                <p class="hint-text">Nhập URL hoặc tải ảnh lên từ máy tính</p>
              </div>
            </div>
          </div>

          <!-- Kích thước phông chữ -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Kích thước phông chữ</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="title-size">Tiêu đề chính</label>
                <input type="text" id="title-size" v-model="settings.fontSizes.title" placeholder="2.5rem" />
              </div>
              <div class="form-group">
                <label for="subtitle-size">Phụ đề</label>
                <input type="text" id="subtitle-size" v-model="settings.fontSizes.subtitle" placeholder="1.2rem" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="project-title-size">Tiêu đề dự án</label>
                <input type="text" id="project-title-size" v-model="settings.fontSizes.projectTitle" placeholder="1.4rem" />
              </div>
              <div class="form-group">
                <label for="stat-value-size">Giá trị thống kê</label>
                <input type="text" id="stat-value-size" v-model="settings.fontSizes.statValue" placeholder="2.2rem" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="stat-title-size">Tiêu đề thống kê</label>
                <input type="text" id="stat-title-size" v-model="settings.fontSizes.statTitle" placeholder="1rem" />
              </div>
              <div class="form-group">
                <label for="button-text-size">Văn bản nút</label>
                <input type="text" id="button-text-size" v-model="settings.fontSizes.buttonText" placeholder="1rem" />
              </div>
            </div>
          </div>

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
                  <input type="text" v-model="settings.colors.secondary" placeholder="#5a6ab1" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu văn bản chính</label>
                <div class="color-input">
                  <input type="color" v-model="settings.textColors.primary" />
                  <input type="text" v-model="settings.textColors.primary" placeholder="#031358" />
                </div>
              </div>
              <div class="color-input-group form-group">
                <label>Màu văn bản phụ</label>
                <div class="color-input">
                  <input type="color" v-model="settings.textColors.secondary" />
                  <input type="text" v-model="settings.textColors.secondary" placeholder="#5a6ab1" />
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="gradient-start">Gradient bắt đầu</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.gradientStart" />
                  <input type="text" v-model="settings.colors.gradientStart" placeholder="#031358" />
                </div>
              </div>
              <div class="form-group">
                <label for="gradient-end">Gradient kết thúc</label>
                <div class="color-input">
                  <input type="color" v-model="settings.colors.gradientEnd" />
                  <input type="text" v-model="settings.colors.gradientEnd" placeholder="#012cd3" />
                </div>
              </div>
            </div>
          </div>

          <!-- Kích thước & Khoảng cách -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler-combined"></i> Kích thước & Khoảng cách</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="project-image-height">Chiều cao ảnh dự án</label>
                <input type="text" id="project-image-height" v-model="settings.sizes.projectImageHeight" placeholder="300px" />
              </div>
              <div class="form-group">
                <label for="border-radius">Bo góc</label>
                <input type="text" id="border-radius" v-model="settings.sizes.borderRadius" placeholder="16px" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="card-border-radius">Bo góc thẻ</label>
                <input type="text" id="card-border-radius" v-model="settings.sizes.cardBorderRadius" placeholder="20px" />
              </div>
              <div class="form-group">
                <label for="ellipse-height">Chiều cao ellipse</label>
                <input type="text" id="ellipse-height" v-model="settings.sizes.ellipseHeight" placeholder="400px" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="nav-button-size">Kích thước nút điều hướng</label>
                <input type="text" id="nav-button-size" v-model="settings.buttonSizes.navButton" placeholder="40px" />
              </div>
              <div class="form-group">
                <label for="thumbnail-size">Kích thước thumbnail</label>
                <input type="text" id="thumbnail-size" v-model="settings.buttonSizes.thumbnailSize" placeholder="60px" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab danh sách dự án -->
      <div v-if="activeTab === 'projects'" class="projects-management">
        <div class="projects-container">
          <!-- Danh sách dự án -->
          <div class="projects-list">
            <div
                v-for="(project, index) in soldProjects"
                :key="project.id"
                class="project-item"
                :class="{ active: activeProjectIndex === index }"
                @mouseenter="hoveredProjectIndex = index"
                @mouseleave="hoveredProjectIndex = -1"
                @click="selectProject(index)"
            >
              <div class="project-content">
                <div class="project-icon" v-if="project.images && project.images.length > 0">
                  <i class="fas fa-image"></i>
                </div>
                <div class="project-info">
                  <h4>{{ project.name || 'Dự án chưa có tên' }}</h4>
                  <p class="project-details">
                    Giá: {{ project.price }} tỷ • {{ project.service }}
                  </p>
                  <p class="project-index">Dự án {{ index + 1 }}</p>
                </div>
              </div>
              <div class="project-actions" v-show="hoveredProjectIndex === index">
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeProject(index)"
                    :disabled="soldProjects.length <= 1"
                    title="Xóa dự án"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Form chỉnh sửa dự án -->
          <div v-if="activeProject !== null" class="project-editor">
            <div class="editor-header">
              <h3>Chỉnh sửa dự án {{ activeProjectIndex + 1 }}</h3>
              <div class="editor-actions">
                <button class="btn btn-secondary" @click="duplicateProject">
                  <i class="fas fa-copy"></i> Nhân bản
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveProjectUp(activeProjectIndex)"
                    :disabled="activeProjectIndex === 0"
                    title="Di chuyển lên"
                >
                  <i class="fas fa-chevron-up"></i>
                </button>
                <button
                    class="btn btn-icon-only"
                    @click="moveProjectDown(activeProjectIndex)"
                    :disabled="activeProjectIndex === soldProjects.length - 1"
                    title="Di chuyển xuống"
                >
                  <i class="fas fa-chevron-down"></i>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="project-name">
                <i class="fas fa-tag"></i> Tên dự án
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="project-name"
                  v-model="activeProject.name"
                  placeholder="Nhập tên dự án..."
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="project-price">
                  <i class="fas fa-money-bill-wave"></i> Giá bán (tỷ VND)
                  <span class="required-mark">*</span>
                </label>
                <input
                    type="number"
                    id="project-price"
                    v-model.number="activeProject.price"
                    placeholder="1.15"
                    step="0.01"
                    min="0"
                />
              </div>
              <div class="form-group">
                <label for="project-service">
                  <i class="fas fa-cogs"></i> Dịch vụ
                  <span class="required-mark">*</span>
                </label>
                <input
                    type="text"
                    id="project-service"
                    v-model="activeProject.service"
                    placeholder="Bán nhanh 30 ngày"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="view-count">
                  <i class="fas fa-eye"></i> Lượt xem
                  <span class="required-mark">*</span>
                </label>
                <input
                    type="number"
                    id="view-count"
                    v-model.number="activeProject.viewCount"
                    placeholder="17"
                    min="0"
                />
              </div>
              <div class="form-group">
                <label for="offer-count">
                  <i class="fas fa-handshake"></i> Lượt đề nghị
                  <span class="required-mark">*</span>
                </label>
                <input
                    type="number"
                    id="offer-count"
                    v-model.number="activeProject.offerCount"
                    placeholder="11"
                    min="0"
                />
              </div>
            </div>

            <!-- Quản lý hình ảnh dự án -->
            <div class="images-management">
              <h4><i class="fas fa-images"></i> Hình ảnh dự án</h4>

              <!-- Danh sách ảnh -->
              <div class="images-list">
                <div
                    v-for="(image, imgIndex) in activeProject.images"
                    :key="imgIndex"
                    class="image-item"
                    :class="{ 'main-image': image.isMain }"
                >
                  <div class="image-tooltip" v-if="!image.isMain">
                    Click để đổi ảnh
                  </div>
                  <div class="image-tooltip" v-else>
                    Ảnh chính - Click để đổi ảnh
                  </div>

                  <div class="image-preview" @click="changeProjectImage(imgIndex)">
                    <img :src="getImageUrl(image.src)" alt="Project image" v-if="image.src" />
                    <div v-else class="no-image">
                      <i class="fas fa-image"></i>
                    </div>
                    <div class="image-actions">
                      <button
                          class="btn-icon-small"
                          @click.stop="previewProjectImage(imgIndex)"
                          title="Xem trước"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button
                          class="btn-icon-small"
                          @click.stop="setMainImage(imgIndex)"
                          :disabled="image.isMain"
                          title="Đặt làm ảnh chính"
                      >
                        <i class="fas fa-star"></i>
                      </button>
                      <button
                          class="btn-icon-small"
                          @click.stop="removeProjectImage(imgIndex)"
                          title="Xóa ảnh"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>

                    <!-- Hiển thị icon ngôi sao cho ảnh chính -->
                    <div v-if="image.isMain" class="main-image-badge">
                      <i class="fas fa-star"></i>
                    </div>
                  </div>

                  <!-- Hiển thị tên file hoặc trạng thái -->
                  <div class="image-info">
                    <p class="image-name">{{ getImageName(image.src) }}</p>
                    <span class="image-status" v-if="image.isMain">Ảnh chính</span>
                  </div>
                </div>
              </div>

              <div class="add-image-section">
                <button class="btn btn-outline" @click="addProjectImage">
                  <i class="fas fa-plus"></i> Thêm ảnh mới
                </button>
                <div class="file-upload-area compact" @click="triggerProjectImageInput" @dragover.prevent @drop.prevent="handleProjectImageDrop">
                  <input
                      type="file"
                      ref="projectImageInput"
                      @change="handleProjectImageUpload"
                      accept="image/*"
                      multiple
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Hoặc kéo thả nhiều ảnh vào đây</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab thống kê -->
      <div v-if="activeTab === 'stats'" class="stats-management">
        <div class="stats-container">
          <div class="stats-list">
            <div
                v-for="(stat, index) in stats"
                :key="stat.id"
                class="stat-item"
                :class="{ active: activeStatIndex === index }"
                @click="selectStat(index)"
            >
              <div class="stat-content">
                <div class="stat-icon">
                  <i :class="stat.icon || 'fas fa-chart-bar'"></i>
                </div>
                <div class="stat-info">
                  <h4>{{ stat.title || 'Thống kê chưa có tên' }}</h4>
                  <p class="stat-value">{{ stat.value }}</p>
                </div>
              </div>
              <div class="stat-actions">
                <button
                    class="btn-icon btn-remove"
                    @click.stop="removeStat(index)"
                    title="Xóa thống kê"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <div class="editor-actions">
              <button class="btn btn-primary" @click="addNewStat" style="width: 100%;">
                <i class="fas fa-plus"></i> Thêm thống kê mới
              </button>
            </div>
          </div>

          <div class="stat-editor" v-if="activeStat !== null">
            <div class="editor-header">
              <h3>Chỉnh sửa thống kê {{ activeStatIndex + 1 }}</h3>
            </div>

            <div class="form-group">
              <label for="stat-icon">
                <i class="fas fa-icons"></i> Biểu tượng
                <span class="required-mark">*</span>
              </label>
              <IconPicker v-model="activeStat.icon" title="Chọn biểu tượng cho thống kê" />
            </div>

            <div class="form-group">
              <label for="stat-value">
                <i class="fas fa-hashtag"></i> Giá trị
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="stat-value"
                  v-model="activeStat.value"
                  placeholder="1,250+"
              />
            </div>

            <div class="form-group">
              <label for="stat-title">
                <i class="fas fa-heading"></i> Tiêu đề
                <span class="required-mark">*</span>
              </label>
              <input
                  type="text"
                  id="stat-title"
                  v-model="activeStat.title"
                  placeholder="Bất động sản đã bán"
              />
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
            <img :src="previewImageUrl" alt="Xem trước ảnh" v-if="previewImageUrl" />
            <div v-else class="preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Chưa có ảnh để xem trước</p>
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

    <!-- Input file ẩn cho đổi ảnh -->
    <input
        type="file"
        ref="changeImageInput"
        @change="handleChangeImage"
        accept="image/*"
        style="display: none"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const soldProjects = ref([])
const stats = ref([])
const activeProjectIndex = ref(0)
const activeStatIndex = ref(0)

const activeProject = computed(() =>
    activeProjectIndex.value !== null && soldProjects.value.length > 0
        ? soldProjects.value[activeProjectIndex.value]
        : null
)

const activeStat = computed(() =>
    activeStatIndex.value !== null && stats.value.length > 0
        ? stats.value[activeStatIndex.value]
        : null
)

const activeTab = ref('general')
const hoveredProjectIndex = ref(-1)

// Settings object with structure from JSON
const settings = reactive({
  title: "DỰ ÁN ĐÃ BÁN THÀNH CÔNG",
  subtitle: "Tổng hợp các dự án đã bán thành công nhờ định giá đúng",
  projectsTitle: "Một số dự án đã bán thành công trong năm 2025",
  columns: 3,
  priceLabel: "Giá bán",
  viewCountLabel: "Lượt xem",
  offerCountLabel: "Lượt đề nghị",
  interestLevelLabel: "Mức độ quan tâm",
  detailButtonText: "Xem Chi Tiết",
  soldBadgeText: "sold-out",
  soldBadgeImage: "/imgs/sold-out.png",
  prevButtonIcon: "fa-solid fa-angle-left",
  nextButtonIcon: "fa-solid fa-angle-right",
  closeButtonIcon: "fa-solid fa-times",
  lightboxPrevIcon: "fa-solid fa-chevron-left",
  lightboxNextIcon: "fa-solid fa-chevron-right",
  buttonSizes: {
    navButton: "40px",
    lightboxNavButton: "60px",
    lightboxCloseButton: "45px",
    detailButtonPadding: "12px 20px",
    thumbnailSize: "60px"
  },
  fontSizes: {
    title: "2.5rem",
    subtitle: "1.2rem",
    projectTitle: "1.4rem",
    statValue: "2.2rem",
    statTitle: "1rem",
    detailLabel: "1rem",
    detailValue: "1rem",
    progressLabel: "0.9rem",
    progressPercent: "0.9rem",
    buttonText: "1rem"
  },
  textColors: {
    primary: "#031358",
    secondary: "#5a6ab1",
    white: "#ffffff",
    lightText: "rgba(255, 255, 255, 0.9)",
    buttonText: "#ffffff",
    statValue: "#031358",
    statTitle: "#5a6ab1"
  },
  colors: {
    primary: "#031358",
    secondary: "#5a6ab1",
    gradientStart: "#031358",
    gradientEnd: "#012cd3",
    backgroundStart: "#f8f9ff",
    backgroundEnd: "#eef1ff",
    cardShadow: "rgba(3, 19, 88, 0.15)",
    hoverShadow: "rgba(3, 19, 88, 0.2)",
    progressBar: "#e0e5ff",
    progressFillStart: "#031358",
    progressFillEnd: "#2d44b0"
  },
  sizes: {
    projectImageHeight: "300px",
    statCardPadding: "30px 20px",
    borderRadius: "16px",
    cardBorderRadius: "20px",
    progressBarHeight: "8px",
    ellipseHeight: "400px"
  }
})

// UI State
const isLoading = ref(false)
const badgeImagePreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')
const previewImageIndex = ref(-1)

// File management
const files = ref([])
const badgeImageInput = ref(null)
const projectImageInput = ref(null)
const changeImageInput = ref(null)
const uploadedFiles = ref([])
const changingImageIndex = ref(-1)

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

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

// Hàm lấy tên file từ URL
const getImageName = (imageUrl) => {
  if (!imageUrl) return 'Chưa có ảnh'

  if (imageUrl.startsWith(TEMP_PREFIX)) {
    const tempName = imageUrl.replace(TEMP_PREFIX, '')
    const uploadedFile = uploadedFiles.value.find(f => f.tempName === tempName)
    return uploadedFile?.file?.name || 'Ảnh mới tải lên'
  }

  // Lấy tên file từ URL
  const parts = imageUrl.split('/')
  return parts[parts.length - 1] || 'Ảnh dự án'
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/7')

    if (response.data && response.data.contentJson) {
      const content = JSON.parse(response.data.contentJson)

      // Load settings
      if (content.title) settings.title = content.title
      if (content.subtitle) settings.subtitle = content.subtitle
      if (content.projectsTitle) settings.projectsTitle = content.projectsTitle
      if (content.columns) settings.columns = content.columns
      if (content.priceLabel) settings.priceLabel = content.priceLabel
      if (content.viewCountLabel) settings.viewCountLabel = content.viewCountLabel
      if (content.offerCountLabel) settings.offerCountLabel = content.offerCountLabel
      if (content.interestLevelLabel) settings.interestLevelLabel = content.interestLevelLabel
      if (content.detailButtonText) settings.detailButtonText = content.detailButtonText
      if (content.soldBadgeText) settings.soldBadgeText = content.soldBadgeText
      if (content.soldBadgeImage) settings.soldBadgeImage = content.soldBadgeImage
      if (content.prevButtonIcon) settings.prevButtonIcon = content.prevButtonIcon
      if (content.nextButtonIcon) settings.nextButtonIcon = content.nextButtonIcon
      if (content.closeButtonIcon) settings.closeButtonIcon = content.closeButtonIcon
      if (content.lightboxPrevIcon) settings.lightboxPrevIcon = content.lightboxPrevIcon
      if (content.lightboxNextIcon) settings.lightboxNextIcon = content.lightboxNextIcon
      if (content.buttonSizes) Object.assign(settings.buttonSizes, content.buttonSizes)
      if (content.fontSizes) Object.assign(settings.fontSizes, content.fontSizes)
      if (content.textColors) Object.assign(settings.textColors, content.textColors)
      if (content.colors) Object.assign(settings.colors, content.colors)
      if (content.sizes) Object.assign(settings.sizes, content.sizes)

      // Load projects
      if (content.soldProjects && Array.isArray(content.soldProjects)) {
        soldProjects.value = content.soldProjects.map((project, index) => ({
          id: project.id || `project-${Date.now()}-${index}`,
          name: project.name || '',
          price: project.price || 0,
          service: project.service || '',
          viewCount: project.viewCount || 0,
          offerCount: project.offerCount || 0,
          images: project.images ? project.images.map(img => ({
            src: img.src || '',
            isMain: img.isMain || false
          })) : []
        }))
      } else {
        soldProjects.value = []
      }

      // Load stats
      if (content.stats && Array.isArray(content.stats)) {
        stats.value = content.stats.map((stat, index) => ({
          id: stat.id || `stat-${Date.now()}-${index}`,
          icon: stat.icon || '',
          value: stat.value || '',
          title: stat.title || ''
        }))
      } else {
        stats.value = []
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

        // Add badge image to files
        if (settings.soldBadgeImage && !settings.soldBadgeImage.startsWith(TEMP_PREFIX)) {
          const tempName = generateTempName(settings.soldBadgeImage)
          files.value.push({
            id: null,
            filename: settings.soldBadgeImage,
            status: 'EXISTING',
            tempName: tempName,
            mappingTempUrl: TEMP_PREFIX + tempName,
            mappingRealUrl: settings.soldBadgeImage,
            effectiveTempUrl: BASE_IMAGE_URL + settings.soldBadgeImage,
            realFilenameForSearch: settings.soldBadgeImage
          })
        }

        // Add project images to files
        soldProjects.value.forEach(project => {
          if (project.images) {
            project.images.forEach(image => {
              if (image.src && !image.src.startsWith(TEMP_PREFIX)) {
                const tempName = generateTempName(image.src)
                files.value.push({
                  id: null,
                  filename: image.src,
                  status: 'EXISTING',
                  tempName: tempName,
                  mappingTempUrl: TEMP_PREFIX + tempName,
                  mappingRealUrl: image.src,
                  effectiveTempUrl: BASE_IMAGE_URL + image.src,
                  realFilenameForSearch: image.src
                })
              }
            })
          }
        })
      }

      uploadedFiles.value = []
      badgeImagePreview.value = null
      showToast('Dữ liệu đã được tải thành công', 'success')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu từ server', 'error')

    // Fallback to default data
    if (soldProjects.value.length === 0) {
      soldProjects.value = [createNewProject()]
    }
    if (stats.value.length === 0) {
      stats.value = [createNewStat()]
    }
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
      soldProjects: soldProjects.value.map(project => ({
        id: project.id,
        name: project.name,
        price: project.price,
        service: project.service,
        viewCount: project.viewCount,
        offerCount: project.offerCount,
        images: project.images.map(image => ({
          src: image.src,
          isMain: image.isMain
        }))
      })),
      stats: stats.value.map(stat => ({
        id: stat.id,
        icon: stat.icon,
        value: stat.value,
        title: stat.title
      }))
    }

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: 7,
      name: 'Dự án đã bán',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 6,
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

              // Update image URLs from temp to real
              if (settings.soldBadgeImage === TEMP_PREFIX + file.tempName) {
                settings.soldBadgeImage = savedFile.filename
              }

              // Update project image URLs
              soldProjects.value.forEach(project => {
                project.images.forEach(image => {
                  if (image.src === TEMP_PREFIX + file.tempName) {
                    image.src = savedFile.filename
                  }
                })
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
      badgeImagePreview.value = null

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

// ========== PROJECT MANAGEMENT ==========
const createNewProject = () => ({
  id: `project-${Date.now()}-${Math.random()}`,
  name: '',
  price: 0,
  service: '',
  viewCount: 0,
  offerCount: 0,
  images: [{ src: '', isMain: true }]
})

const addNewProject = () => {
  const newProject = createNewProject()
  soldProjects.value.push(newProject)
  activeProjectIndex.value = soldProjects.value.length - 1
  activeTab.value = 'projects'
  showToast('Đã thêm dự án mới', 'success')
}

const selectProject = (index) => {
  activeProjectIndex.value = index
}

const moveProjectUp = (index) => {
  if (index > 0) {
    const temp = soldProjects.value[index]
    soldProjects.value[index] = soldProjects.value[index - 1]
    soldProjects.value[index - 1] = temp
    activeProjectIndex.value = index - 1
    showToast('Đã di chuyển dự án lên', 'success')
  }
}

const moveProjectDown = (index) => {
  if (index < soldProjects.value.length - 1) {
    const temp = soldProjects.value[index]
    soldProjects.value[index] = soldProjects.value[index + 1]
    soldProjects.value[index + 1] = temp
    activeProjectIndex.value = index + 1
    showToast('Đã di chuyển dự án xuống', 'success')
  }
}

const removeProject = (index) => {
  if (soldProjects.value.length <= 1) {
    showToast('Không thể xóa dự án cuối cùng', 'warning')
    return
  }

  const project = soldProjects.value[index]

  // Handle associated files
  project.images.forEach(image => {
    if (image.src) {
      handleImageRemoval(image.src)
    }
  })

  soldProjects.value.splice(index, 1)

  if (activeProjectIndex.value >= soldProjects.value.length) {
    activeProjectIndex.value = soldProjects.value.length - 1
  }

  showToast('Đã xóa dự án', 'success')
}

const duplicateProject = () => {
  if (!activeProject.value) return

  const duplicate = {
    ...JSON.parse(JSON.stringify(activeProject.value)),
    id: `project-${Date.now()}-${Math.random()}`
  }

  // Reset image URLs for duplicated project (they will be uploaded as new)
  duplicate.images.forEach(image => {
    if (image.src && image.src.startsWith(TEMP_PREFIX)) {
      image.src = ''
    }
  })

  soldProjects.value.splice(activeProjectIndex.value + 1, 0, duplicate)
  activeProjectIndex.value += 1
  showToast('Đã nhân bản dự án', 'success')
}

const addProjectImage = () => {
  if (!activeProject.value) return
  activeProject.value.images.push({ src: '', isMain: false })
}

const removeProjectImage = (index) => {
  if (!activeProject.value || activeProject.value.images.length <= 1) {
    showToast('Dự án phải có ít nhất một ảnh', 'warning')
    return
  }

  const image = activeProject.value.images[index]
  const wasMain = image.isMain

  // Handle file removal
  if (image.src) {
    handleImageRemoval(image.src)
  }

  activeProject.value.images.splice(index, 1)

  // If we removed the main image, set the first image as main
  if (wasMain && activeProject.value.images.length > 0) {
    activeProject.value.images[0].isMain = true
  }

  showToast('Đã xóa ảnh', 'success')
}

const setMainImage = (index) => {
  if (!activeProject.value) return

  activeProject.value.images.forEach((image, i) => {
    image.isMain = (i === index)
  })
  showToast('Đã đặt làm ảnh chính', 'success')
}

// Helper function to handle image removal from files array
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

// ========== STAT MANAGEMENT ==========
const createNewStat = () => ({
  id: `stat-${Date.now()}-${Math.random()}`,
  icon: 'fas fa-chart-bar',
  value: '',
  title: ''
})

const addNewStat = () => {
  const newStat = createNewStat()
  stats.value.push(newStat)
  activeStatIndex.value = stats.value.length - 1
  showToast('Đã thêm thống kê mới', 'success')
}

const selectStat = (index) => {
  activeStatIndex.value = index
}

const removeStat = (index) => {
  stats.value.splice(index, 1)

  if (activeStatIndex.value >= stats.value.length) {
    activeStatIndex.value = stats.value.length - 1
  }

  showToast('Đã xóa thống kê', 'success')
}

// ========== CHANGE PROJECT IMAGE ==========
const changeProjectImage = (imageIndex) => {
  if (!activeProject.value) return

  // Kiểm tra xem imageIndex có hợp lệ không
  if (imageIndex < 0 || imageIndex >= activeProject.value.images.length) {
    showToast('Vị trí ảnh không hợp lệ', 'error')
    return
  }

  changingImageIndex.value = imageIndex
  changeImageInput.value?.click()
}

const handleChangeImage = (event) => {
  if (!activeProject.value || changingImageIndex.value === -1) return

  // Kiểm tra lại tính hợp lệ của index
  if (changingImageIndex.value < 0 || changingImageIndex.value >= activeProject.value.images.length) {
    showToast('Vị trí ảnh không hợp lệ', 'error')
    changingImageIndex.value = -1
    return
  }

  const file = event.target.files[0]
  if (!file) {
    changingImageIndex.value = -1
    return
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP', 'error')
    changingImageIndex.value = -1
    return
  }

  if (file.size > maxSize) {
    showToast('Kích thước file không được vượt quá 5MB', 'error')
    changingImageIndex.value = -1
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Lấy thông tin ảnh cũ để xử lý file - KIỂM TRA TỒN TẠI TRƯỚC KHI TRUY CẬP
    const oldImage = activeProject.value.images[changingImageIndex.value]

    // Chỉ xử lý removal nếu ảnh cũ tồn tại và có src
    if (oldImage && oldImage.src) {
      handleImageRemoval(oldImage.src)
    }

    // Tạo object ảnh mới với isMain giữ nguyên từ ảnh cũ (nếu có)
    const isMain = oldImage ? oldImage.isMain : false

    // Cập nhật ảnh mới trực tiếp vào mảng
    activeProject.value.images[changingImageIndex.value] = {
      src: tempUrl,
      isMain: isMain
    }

    // Tạo file DTO mới
    const fileDTO = {
      id: null,
      filename: file.name,
      status: 'NEW',
      tempName: tempName,
      mappingTempUrl: tempUrl,
      mappingRealUrl: null,
      effectiveTempUrl: previewUrl,
      realFilenameForSearch: file.name
    }

    // Lưu vào uploadedFiles
    uploadedFiles.value.push({
      tempName: tempName,
      file: file,
      previewUrl: previewUrl
    })

    // Thêm vào files array
    files.value.push(fileDTO)

    showToast('Đã thay đổi ảnh thành công', 'success')
    changingImageIndex.value = -1
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
    changingImageIndex.value = -1
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}
// ========== BADGE IMAGE UPLOAD ==========
const triggerBadgeImageInput = () => {
  badgeImageInput.value?.click()
}

const handleBadgeImageUpload = (event) => {
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

  // Handle previous badge image removal
  if (settings.soldBadgeImage) {
    handleImageRemoval(settings.soldBadgeImage)
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // Update settings
    settings.soldBadgeImage = tempUrl
    badgeImagePreview.value = previewUrl

    // Create file DTO
    const fileDTO = {
      id: null,
      filename: file.name,
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

    showToast('Ảnh badge đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  event.target.value = ''
}

const handleBadgeImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleBadgeImageUpload(fakeEvent)
  }
}

const removeBadgeImage = () => {
  const imageUrl = settings.soldBadgeImage

  if (imageUrl) {
    handleImageRemoval(imageUrl)

    settings.soldBadgeImage = ''
    badgeImagePreview.value = null

    showToast('Đã xóa ảnh badge', 'success')
  }
}

const previewBadgeImage = () => {
  if (settings.soldBadgeImage) {
    previewImageUrl.value = getImageUrl(settings.soldBadgeImage)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh badge để xem trước', 'warning')
  }
}

// ========== PROJECT IMAGE UPLOAD ==========
const triggerProjectImageInput = () => {
  projectImageInput.value?.click()
}

const handleProjectImageUpload = (event) => {
  if (!activeProject.value) {
    showToast('Vui lòng chọn một dự án trước', 'warning')
    return
  }

  const uploadedFilesList = Array.from(event.target.files)
  if (uploadedFilesList.length === 0) return

  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024

  let uploadedCount = 0

  uploadedFilesList.forEach(file => {
    if (!validTypes.includes(file.type)) {
      showToast(`File ${file.name} không phải là ảnh hợp lệ`, 'error')
      return
    }

    if (file.size > maxSize) {
      showToast(`File ${file.name} vượt quá 5MB`, 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const previewUrl = e.target.result
      const tempName = generateTempName(file.name)
      const tempUrl = TEMP_PREFIX + tempName

      // Add new image to project
      const isMain = activeProject.value.images.length === 0
      activeProject.value.images.push({
        src: tempUrl,
        isMain: isMain
      })

      // Create file DTO
      const fileDTO = {
        id: null,
        filename: file.name,
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

      uploadedCount++

      if (uploadedCount === uploadedFilesList.length) {
        showToast(`Đã tải lên ${uploadedCount} ảnh`, 'success')
      }
    }

    reader.onerror = (error) => {
      console.error('Error reading file:', error)
      showToast(`Lỗi khi đọc file ${file.name}`, 'error')
    }

    reader.readAsDataURL(file)
  })

  event.target.value = ''
}

const handleProjectImageDrop = (event) => {
  event.preventDefault()
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const fakeEvent = { target: { files: files } }
    handleProjectImageUpload(fakeEvent)
  }
}

const previewProjectImage = (imageIndex) => {
  if (!activeProject.value || !activeProject.value.images[imageIndex]) {
    showToast('Không có ảnh để xem trước', 'warning')
    return
  }

  const image = activeProject.value.images[imageIndex]
  if (image.src) {
    previewImageUrl.value = getImageUrl(image.src)
    previewImageIndex.value = imageIndex
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

// ========== UI FUNCTIONS ==========
const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
  previewImageIndex.value = -1
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.sold-projects-editor {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
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

.btn-outline {
  padding: 10px 20px;
  border: 2px solid #4a6cf7;
  background-color: white;
  color: #4a6cf7;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background-color: #4a6cf7;
  color: white;
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
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-icon-only:hover:not(:disabled) {
  background: #dee2e6;
  color: #031358;
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

.btn-icon-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.btn-icon-small:hover {
  background-color: white;
  transform: scale(1.1);
}

.btn-icon-small:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn:disabled,
.btn-icon-only:disabled,
.btn-icon:disabled {
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
.form-group input[type="number"],
.form-group input[type="url"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
  font-family: inherit;
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
  font-weight: 500;
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
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent;
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
  flex: 1;
  min-width: 0;
}

/* Required Mark */
.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

/* Projects Management */
.projects-management,
.stats-management {
  display: flex;
  gap: 30px;
  height: 100%;
}

.projects-container,
.stats-container {
  display: flex;
  gap: 30px;
  width: 100%;
}

.projects-list,
.stats-list {
  flex: 1;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-right: 10px;
  border-right: 1px solid #e9ecef;
}

.project-editor,
.stat-editor {
  flex: 2;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  border: 1px solid #e9ecef;
}

.project-editor .editor-header,
.stat-editor .editor-header {
  background: none;
  color: inherit;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-editor .editor-header h3,
.stat-editor .editor-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
}

.editor-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Project Item */
.project-item,
.stat-item {
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 70px;
}

.project-item:hover,
.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #e9ecef;
}

.project-item.active,
.stat-item.active {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.project-content,
.stat-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.project-icon,
.stat-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.project-info,
.stat-info {
  flex: 1;
  min-width: 0;
}

.project-info h4,
.stat-info h4 {
  margin: 0 0 4px 0;
  color: #031358;
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-details {
  margin: 0 0 4px 0;
  color: #6c757d;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-index,
.stat-value {
  margin: 0;
  color: #4a6cf7;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.project-actions,
.stat-actions {
  flex-shrink: 0;
  margin-left: 10px;
}

/* Images Management */
.images-management {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.images-management h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.images-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.image-item {
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  position: relative;
}

.image-item.main-image {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.15);
}

.image-item.main-image .image-preview {
  border: 2px solid #4a6cf7;
}

/* Tooltip */
.image-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  margin-bottom: 5px;
  z-index: 10;
}

.image-tooltip:after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

.image-item:hover .image-tooltip {
  opacity: 1;
  visibility: visible;
}

/* Image Preview */
.image-preview {
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f8f9fa;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.image-preview:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.image-preview:hover::after {
  content: 'Click để đổi ảnh';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(2, 26, 108, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 1;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-preview .no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  font-size: 2rem;
}

.image-actions {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.image-preview:hover .image-actions {
  opacity: 1;
}

/* Hiển thị icon ngôi sao cho ảnh chính */
.main-image-badge {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 24px;
  height: 24px;
  background-color: #ffc107;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #856404;
  font-size: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
}

/* Hiển thị thông tin ảnh */
.image-info {
  padding: 5px 0;
  text-align: center;
}

.image-name {
  margin: 0 0 3px 0;
  font-size: 0.8rem;
  color: #495057;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.image-status {
  display: inline-block;
  background-color: #ffc107;
  color: #856404;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.image-url-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.add-image-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
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

.file-upload.compact .file-upload-area {
  padding: 20px;
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

.input-hint {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 5px;
  margin-bottom: 0;
}

.hint-text {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 4px;
  margin-bottom: 0;
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
  border: none;
  border-radius: 50%;
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

/* Scrollbar Styling */
.projects-list::-webkit-scrollbar,
.stats-list::-webkit-scrollbar,
.project-editor::-webkit-scrollbar,
.stat-editor::-webkit-scrollbar {
  width: 6px;
}

.projects-list::-webkit-scrollbar-track,
.stats-list::-webkit-scrollbar-track,
.project-editor::-webkit-scrollbar-track,
.stat-editor::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.projects-list::-webkit-scrollbar-thumb,
.stats-list::-webkit-scrollbar-thumb,
.project-editor::-webkit-scrollbar-thumb,
.stat-editor::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.projects-list::-webkit-scrollbar-thumb:hover,
.stats-list::-webkit-scrollbar-thumb:hover,
.project-editor::-webkit-scrollbar-thumb:hover,
.stat-editor::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .projects-container,
  .stats-container {
    flex-direction: column;
    height: auto;
  }

  .projects-list,
  .stats-list {
    max-width: 100%;
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }

  .project-editor,
  .stat-editor {
    width: 100%;
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
    justify-content: center;
  }

  .project-editor .editor-header,
  .stat-editor .editor-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .editor-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .images-list {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
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

@media (max-width: 576px) {
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
    min-width: 100px;
  }

  .project-item,
  .stat-item {
    padding: 10px 12px;
    min-height: 60px;
  }

  .project-icon,
  .stat-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .project-info h4,
  .stat-info h4 {
    font-size: 0.9rem;
  }

  .project-details {
    font-size: 0.8rem;
  }

  .project-index,
  .stat-value {
    font-size: 0.8rem;
  }

  .images-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .image-preview {
    height: 100px;
  }

  .modal-content {
    width: 95%;
    margin: 10px;
  }

  .toast-notification {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .editor-header {
    padding: 15px 20px;
  }

  .tab-content {
    padding: 15px;
  }

  .setting-section {
    padding: 15px;
  }

  .project-editor,
  .stat-editor {
    padding: 15px;
  }

  .navigation-tabs {
    padding: 0 15px;
  }

  .tab-button {
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .images-list {
    grid-template-columns: 1fr;
  }

  .btn-icon {
    width: 32px;
    height: 32px;
  }

  .btn-icon-small {
    width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  .sold-projects-editor {
    background-color: #1a1d28;
    color: #e9ecef;
  }

  .setting-section,
  .project-editor,
  .stat-editor {
    background-color: #2d3748;
    border-color: #4a5568;
  }

  .project-item,
  .stat-item,
  .image-item {
    background-color: #2d3748;
    border-color: #4a5568;
  }

  .form-group input[type="text"],
  .form-group input[type="number"],
  .form-group input[type="url"],
  .form-group textarea,
  .form-group select {
    background-color: #4a5568;
    border-color: #718096;
    color: #e9ecef;
  }

  .form-group label {
    color: #cbd5e0;
  }

  .file-upload-area {
    background-color: #4a5568;
    border-color: #718096;
  }

  .image-preview {
    background-color: #4a5568;
  }

  .image-url-input {
    background-color: #4a5568;
    border-color: #718096;
    color: #e9ecef;
  }
}
</style>