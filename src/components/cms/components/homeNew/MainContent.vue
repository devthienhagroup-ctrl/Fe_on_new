<template>
  <div class="reasons-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Nội dung chi tiết - Thiên Hà Group</h2>
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
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-palette"></i> Màu sắc & Kiểu dáng
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'hero' }"
          @click="activeTab = 'hero'"
      >
        <i class="fas fa-star"></i> Hero Section
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'about' }"
          @click="activeTab = 'about'"
      >
        <i class="fas fa-info-circle"></i> Về chúng tôi
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'services' }"
          @click="activeTab = 'services'"
      >
        <i class="fas fa-cog"></i> Dịch vụ
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'stats' }"
          @click="activeTab = 'stats'"
      >
        <i class="fas fa-chart-bar"></i> Thống kê
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'testimonials' }"
          @click="activeTab = 'testimonials'"
      >
        <i class="fas fa-comments"></i> Đánh giá
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Màu sắc & Kiểu dáng -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>

            <div class="color-input-group" v-for="(colorValue, colorKey) in content.styles.colors" :key="colorKey">
              <label>{{ colorKey }}</label>
              <ColorInputWithGlobalColors
                  v-model="content.styles.colors[colorKey]"
                  :placeholder="colorValue"
                  return-type="key" :colors="globalColors"
              />
            </div>
          </div>

          <!-- Gradients -->
          <div class="setting-section">
            <h3><i class="fas fa-gradient"></i> Gradients</h3>

            <div class="form-group" v-for="(gradient, gradientKey) in content.styles.gradients" :key="gradientKey">
              <label :for="`gradient-${gradientKey}`">{{ gradientKey }}</label>
              <input
                  type="text"
                  :id="`gradient-${gradientKey}`"
                  v-model="content.styles.gradients[gradientKey]"
                  placeholder="from-blue-400 to-purple-500"
              />
            </div>
          </div>

          <!-- Kích thước -->
          <div class="setting-section">
            <h3><i class="fas fa-text-height"></i> Kích thước chữ</h3>

            <div class="form-group" v-for="(size, sizeKey) in content.styles.sizes" :key="sizeKey">
              <label :for="`size-${sizeKey}`">{{ sizeKey }}</label>
              <input
                  type="text"
                  :id="`size-${sizeKey}`"
                  v-model="content.styles.sizes[sizeKey]"
                  placeholder="text-5xl md:text-7xl"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Hero Section -->
      <div v-if="activeTab === 'hero'" class="hero-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-star"></i> Nội dung Hero</h3>

            <div class="form-group">
              <label for="heroTagline">Tagline</label>
              <input
                  type="text"
                  id="heroTagline"
                  v-model="content.hero.tagline"
                  placeholder="Kiến tạo tương lai"
              />
            </div>

            <div class="form-group">
              <label for="heroTitle">Tiêu đề chính</label>
              <input
                  type="text"
                  id="heroTitle"
                  v-model="content.hero.title"
                  placeholder="Vươn Tầm"
              />
            </div>

            <div class="form-group">
              <label for="heroHighlightedText">Văn bản nổi bật</label>
              <input
                  type="text"
                  id="heroHighlightedText"
                  v-model="content.hero.highlightedText"
                  placeholder="Đẳng Cấp Quốc Tế"
              />
            </div>

            <div class="form-group">
              <label for="heroCompanyName">Tên công ty</label>
              <input
                  type="text"
                  id="heroCompanyName"
                  v-model="content.hero.companyName"
                  placeholder="Thiên Hà Group"
              />
            </div>

            <div class="form-group">
              <label for="heroDescription">Mô tả</label>
              <textarea
                  id="heroDescription"
                  v-model="content.hero.description"
                  rows="3"
                  placeholder="mang đến giải pháp bất động sản toàn diện..."
              ></textarea>
            </div>
          </div>

          <!-- Nút bấm Hero -->
          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm</h3>

            <div class="button-settings">
              <div class="form-group">
                <label>Nút Khám phá</label>
                <div class="form-row">
                  <input type="text" v-model="content.buttons.explore.text" placeholder="Khám phá ngay" />
                  <input type="text" v-model="content.buttons.explore.href" placeholder="#services" />
                </div>
              </div>

              <div class="form-group">
                <label>Nút Xem hồ sơ</label>
                <div class="form-row">
                  <input type="text" v-model="content.buttons.profile.text" placeholder="Xem hồ sơ" />
                  <input type="text" v-model="content.buttons.profile.href" placeholder="https://..." />
                </div>
              </div>

              <div class="form-group">
                <label>Nút Liên hệ</label>
                <div class="form-row">
                  <input type="text" v-model="content.buttons.contact.text" placeholder="Liên hệ để được tư vấn" />
                  <input type="text" v-model="content.buttons.contact.href" placeholder="#contact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Về chúng tôi -->
      <div v-if="activeTab === 'about'" class="about-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-info-circle"></i> Thông tin về chúng tôi</h3>

            <div class="form-group">
              <label for="aboutSubtitle">Phụ đề</label>
              <input
                  type="text"
                  id="aboutSubtitle"
                  v-model="content.about.subtitle"
                  placeholder="Về chúng tôi"
              />
            </div>

            <div class="form-group">
              <label for="aboutTitle">Tiêu đề</label>
              <input
                  type="text"
                  id="aboutTitle"
                  v-model="content.about.title"
                  placeholder="Đối tác tin cậy cho sự"
              />
            </div>

            <div class="form-group">
              <label for="aboutHighlightedText">Văn bản nổi bật</label>
              <input
                  type="text"
                  id="aboutHighlightedText"
                  v-model="content.about.highlightedText"
                  placeholder="thịnh vượng bền vững"
              />
            </div>

            <div class="form-group">
              <label for="aboutDescription">Mô tả</label>
              <textarea
                  id="aboutDescription"
                  v-model="content.about.description"
                  rows="4"
                  placeholder="Tại Thiên Hà Group..."
              ></textarea>
            </div>

            <!-- Image upload for about section -->
            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label>Ảnh về chúng tôi</label>
                <button class="btn-icon btn-preview-action" @click="previewAboutImage" title="Xem trước"
                        v-if="content.about.image.src">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerAboutImageInput" @dragover.prevent
                     @drop.prevent="handleAboutImageDrop">
                  <input
                      type="file"
                      ref="aboutImageInput"
                      @change="handleAboutImageUpload"
                      accept="image/*"
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                  <p class="file-hint">Kích thước đề xuất: 800x600px</p>
                </div>

                <div v-if="aboutImagePreview || content.about.image.src" class="upload-preview">
                  <img :src="getImageUrl(content.about.image.src)" alt="About Image Preview"/>
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewAboutImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeAboutImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!aboutImagePreview && !content.about.image.src" class="form-group">
                <label for="about-image-url">Hoặc nhập URL ảnh</label>
                <input
                    type="text"
                    id="about-image-url"
                    v-model="content.about.image.src"
                    placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <!-- Thống kê nhanh -->
          <div class="setting-section">
            <h3><i class="fas fa-chart-line"></i> Thống kê nhanh</h3>

            <div v-for="(stat, index) in content.about.quickStats" :key="stat.id" class="quick-stat-item">
              <div class="stat-header">
                <h4>Thống kê #{{ index + 1 }}</h4>
                <button class="btn-icon btn-danger" @click="removeQuickStat(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Giá trị</label>
                  <input type="text" v-model="stat.value" placeholder="200+" />
                </div>
                <div class="form-group">
                  <label>Nhãn</label>
                  <input type="text" v-model="stat.label" placeholder="Dự án hoàn thành" />
                </div>
              </div>

              <div class="form-group">
                <label>Màu sắc</label>
                <ColorInputWithGlobalColors
                    v-model="stat.color"
                    placeholder="blue"
                    return-type="key" :colors="globalColors"
                />
              </div>
            </div>

            <button class="btn btn-secondary" @click="addQuickStat">
              <i class="fas fa-plus"></i> Thêm thống kê
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Dịch vụ -->
      <div v-if="activeTab === 'services'" class="services-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-cog"></i> Danh sách dịch vụ</h3>
            <button class="btn btn-primary" @click="addService">
              <i class="fas fa-plus"></i> Thêm dịch vụ
            </button>
          </div>

          <div class="services-list">
            <div v-for="(service, index) in content.services" :key="service.id" class="service-item">
              <div class="service-header">
                <h4>Dịch vụ #{{ index + 1 }} - {{ service.title || 'Chưa có tiêu đề' }}</h4>
                <div class="service-actions">
                  <button class="btn-icon" @click="moveServiceUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveServiceDown(index)" :disabled="index === content.services.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeService(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="service.title" placeholder="Phát triển đội nhóm" />
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="service.description" rows="3" placeholder="Tạo dựng và mở rộng đội nhóm..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Màu sắc</label>
                  <ColorInputWithGlobalColors
                      v-model="service.color"
                      placeholder="blue"
                      return-type="key" :colors="globalColors"
                  />
                </div>
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="service.iconName" />
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>URL truy cập nhanh</label>
                  <input type="text" v-model="service.quickAccessUrl" placeholder="/nhom-cua-toi" />
                </div>
                <div class="form-group">
                  <label>Link văn bản</label>
                  <input type="text" v-model="service.linkText" placeholder="Xem chi tiết" />
                </div>
              </div>
            </div>

            <div v-if="content.services.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Chưa có dịch vụ nào. Hãy thêm dịch vụ đầu tiên!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Thống kê -->
      <div v-if="activeTab === 'stats'" class="stats-settings">
        <div class="settings-grid">
          <!-- Thẻ thống kê -->
          <div class="setting-section">
            <h3><i class="fas fa-chart-bar"></i> Thẻ thống kê</h3>

            <div v-for="(card, index) in content.statsCards" :key="card.id" class="stat-card-item">
              <div class="card-header">
                <h4>Thẻ #{{ index + 1 }}</h4>
                <button class="btn-icon btn-danger" @click="removeStatCard(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Giá trị</label>
                  <input type="text" v-model="card.value" placeholder="359 Căn" />
                </div>
                <div class="form-group">
                  <label>Nhãn</label>
                  <input type="text" v-model="card.label" placeholder="Đã bán trong năm 2025" />
                </div>
              </div>


                <div class="form-group">
                  <label>Màu sắc</label>
                  <ColorInputWithGlobalColors
                      v-model="card.color"
                      placeholder="blue"
                      return-type="key" :colors="globalColors"
                  />
                </div>
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="card.icon" />
                  </div>
                </div>

            </div>

            <button class="btn btn-secondary" @click="addStatCard">
              <i class="fas fa-plus"></i> Thêm thẻ thống kê
            </button>
          </div>

          <!-- Map Locations -->
          <div class="setting-section">
            <h3><i class="fas fa-map-marker-alt"></i> Vị trí trên bản đồ</h3>

            <!-- Map Image Upload -->
            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label>Ảnh bản đồ</label>
                <button class="btn-icon btn-preview-action" @click="previewMapImage" title="Xem trước"
                        v-if="content.map.imageUrl">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerMapImageInput" @dragover.prevent
                     @drop.prevent="handleMapImageDrop">
                  <input
                      type="file"
                      ref="mapImageInput"
                      @change="handleMapImageUpload"
                      accept="image/*"
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh bản đồ vào đây hoặc <span>chọn từ máy</span></p>
                  <p class="file-hint">Kích thước đề xuất: 800x600px</p>
                </div>

                <div v-if="mapImagePreview || content.map.imageUrl" class="upload-preview">
                  <img :src="getImageUrl(content.map.imageUrl)" alt="Map Image Preview"/>
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewMapImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeMapImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!mapImagePreview && !content.map.imageUrl" class="form-group">
                <label for="map-image-url">Hoặc nhập URL ảnh bản đồ</label>
                <input
                    type="text"
                    id="map-image-url"
                    v-model="content.map.imageUrl"
                    placeholder="https://example.com/map.jpg"
                />
              </div>
            </div>

            <div v-for="(location, index) in content.map.locations" :key="location.id" class="location-item">
              <div class="location-header">
                <h4>Vị trí #{{ index + 1 }} - {{ location.name }}</h4>
                <button class="btn-icon btn-danger" @click="removeLocation(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div class="form-group">
                <label>Tên</label>
                <input type="text" v-model="location.name" placeholder="Hồ Chí Minh (HQ)" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Vị trí top (%)</label>
                  <input type="text" v-model="location.position.top" placeholder="55%" />
                </div>
                <div class="form-group">
                  <label>Vị trí left (%)</label>
                  <input type="text" v-model="location.position.left" placeholder="78%" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Màu sắc</label>
                  <ColorInputWithGlobalColors
                      v-model="location.color"
                      placeholder="blue-500"
                      return-type="key" :colors="globalColors"
                  />
                </div>
                <div class="form-group">
                  <label>Kích thước</label>
                  <input type="text" v-model="location.size" placeholder="6" />
                </div>
              </div>
            </div>

            <button class="btn btn-secondary" @click="addLocation">
              <i class="fas fa-plus"></i> Thêm vị trí
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Đánh giá -->
      <div v-if="activeTab === 'testimonials'" class="testimonials-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-comments"></i> Đánh giá từ khách hàng</h3>
            <button class="btn btn-primary" @click="addTestimonial">
              <i class="fas fa-plus"></i> Thêm đánh giá
            </button>
          </div>

          <div class="testimonials-list">
            <div v-for="(testimonial, index) in content.testimonials" :key="testimonial.id" class="testimonial-item">
              <div class="testimonial-header">
                <h4>Đánh giá #{{ index + 1 }} - {{ testimonial.name || 'Chưa có tên' }}</h4>
                <div class="testimonial-actions">
                  <button class="btn-icon" @click="moveTestimonialUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveTestimonialDown(index)" :disabled="index === content.testimonials.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeTestimonial(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Tên</label>
                  <input type="text" v-model="testimonial.name" placeholder="Nguyễn Văn Nam" />
                </div>
                <div class="form-group">
                  <label>Vị trí</label>
                  <input type="text" v-model="testimonial.position" placeholder="CTO, Công ty ABC" />
                </div>
              </div>

              <div class="form-group">
                <label>Trích dẫn</label>
                <textarea v-model="testimonial.quote" rows="3" placeholder="Thiên Hà Group mang đến giải pháp..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Chữ viết tắt</label>
                  <input type="text" v-model="testimonial.initials" placeholder="NV" />
                </div>
                <div class="form-group">
                  <label>Màu sắc</label>
                  <ColorInputWithGlobalColors
                      v-model="testimonial.color"
                      placeholder="blue"
                      return-type="key" :colors="globalColors"
                  />
                </div>
                <div class="form-group">
                  <label>Đánh giá (sao)</label>
                  <input type="number" v-model="testimonial.rating" min="1" max="5" placeholder="5" />
                </div>
              </div>
            </div>

            <div v-if="content.testimonials.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Chưa có đánh giá nào. Hãy thêm đánh giá đầu tiên!</p>
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
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
import ColorInputWithGlobalColors from "./ColorInputWithGlobalColors.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('styles')
const isLoading = ref(false)

// Content structure based on new JSON data
const content = reactive({
  styles: {
    colors: {
      blue400: "var(--color-blue-400)",
      blue500: "var(--color-blue-500)",
      blue600: "var(--color-blue-600)",
      purple500: "var(--color-purple-500)",
      purple600: "var(--color-purple-600)",
      slate300: "var(--color-slate-300)",
      slate400: "var(--color-slate-400)",
      slate700: "var(--color-slate-700)",
      slate900: "var(--color-slate-900)",
      emerald500: "#10b981"
    },
    gradients: {
      hero: "from-blue-400 to-purple-500",
      services: "from-blue-500 to-purple-600",
      locations: "from-blue-400 to-purple-500"
    },
    sizes: {
      heroTitle: "text-5xl md:text-7xl",
      sectionTitle: "text-4xl"
    }
  },
  hero: {
    tagline: "Kiến tạo tương lai",
    title: "Vươn Tầm",
    highlightedText: "Đẳng Cấp Quốc Tế",
    companyName: "Thiên Hà Group",
    description: "mang đến giải pháp bất động sản toàn diện, kết hợp công nghệ tiên tiến và tư duy đột phá để nâng tầm giá trị giá trị bất động sản của bạn."
  },
  buttons: {
    explore: {
      text: "Khám phá ngay",
      href: "#services",
      variant: "gradient",
      color: "blue",
      size: "large",
      rounded: "lg",
      hoverScale: true,
      shadow: true
    },
    profile: {
      text: "Xem hồ sơ",
      href: "https://www.youtube.com/watch?v=JPedlPJSBkg",
      target: "_blank",
      variant: "outline",
      color: "white",
      size: "large",
      rounded: "lg"
    },
    contact: {
      text: "Liên hệ để được tư vấn",
      href: "#contact",
      variant: "gradient",
      color: "blue",
      size: "medium",
      rounded: "lg"
    }
  },
  about: {
    subtitle: "Về chúng tôi",
    title: "Đối tác tin cậy cho sự",
    highlightedText: "thịnh vượng bền vững",
    description: "Tại Thiên Hà Group, chúng tôi không chỉ xây dựng các dự án, chúng tôi xây dựng những biểu tượng. Với triết lý kinh doanh lấy con người làm trọng tâm và công nghệ làm bệ phóng, chúng tôi cam kết mang lại giá trị vượt trội.",
    image: {
      src: "https://kienviet.net/wp-content/uploads/2015/08/21.jpg",
      alt: "Office",
      showShadow: true
    },
    stats: {
      years: {
        value: "15+",
        label: "Năm kinh nghiệm"
      }
    },
    quickStats: [
      {
        id: 1,
        value: "200+",
        label: "Dự án hoàn thành",
        color: "blue",
        padding: "small",
        hoverEffect: true
      },
      {
        id: 2,
        value: "98%",
        label: "Khách hàng hài lòng",
        color: "purple",
        padding: "small",
        hoverEffect: true
      }
    ]
  },
  sections: {
    services: {
      title: "Dịch vụ của chúng tôi"
    },
    locations: {
      subtitle: "Mạng Lưới Hoạt Động",
      title: "Dấu Ấn",
      highlightedText: "Thiên Hà Group",
      description: "Không chỉ dẫn đầu thị trường về giải pháp bán nhanh bất động sản, chúng tôi đang vươn mình mạnh mẽ hướng đến hệ sinh thái toàn diện trong ngành bất động sản."
    },
    testimonials: {
      subtitle: "Khách hàng nói gì",
      title: "Đánh giá từ khách hàng",
      description: "Những phản hồi chân thực từ các đối tác và khách hàng đã đồng hành cùng Thiên Hà Group."
    }
  },
  services: [
    {
      id: 1,
      title: "Phát triển đội nhóm",
      description: "Tạo dựng và mở rộng đội nhóm của bạn trên một hệ sinh thái duy nhất. Thiên Hà Group tiên phong giải pháp hợp tác toàn diện cho môi giới toàn quốc, cung cấp nguồn hàng chất lượng, tiềm năng cao.",
      color: "blue",
      link: "#",
      linkText: "Xem chi tiết",
      iconName: "fas fa-building",
      iconClass: "w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition duration-300 text-blue-400 group-hover:text-white",
      padding: "large",
      hoverEffect: true,
      aos: "fade-up",
      aosDelay: "0",
      quickAccessUrl: "/nhom-cua-toi"
    },
    {
      id: 2,
      title: "Quản lý tài sản",
      description: "Một công cụ – tối ưu cả quy trình môi giới. Lưu trữ và quản trị khách hàng/sản phẩm tập trung, cập nhật theo thời gian thực, nhận thông báo sản phẩm 'đúng gu' và tăng tỷ lệ chốt nhờ mạng lưới hợp tác 10.000+ môi giới.",
      color: "purple",
      link: "#",
      linkText: "Xem chi tiết",
      iconName: "fas fa-chart-bar",
      iconClass: "w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-400 group-hover:text-white",
      padding: "large",
      hoverEffect: true,
      aos: "fade-up",
      aosDelay: "200",
      quickAccessUrl: "/bao-cao-dinh-gia"
    }
  ],
  statsCards: [
    {
      id: 1,
      value: "359 Căn",
      label: "Đã bán trong năm 2025",
      color: "blue",
      icon: "fas fa-globe"
    },
    {
      id: 2,
      value: "4.394 Môi giới",
      label: "Đang hoạt động tại Thiên Hà Group",
      color: "purple",
      icon: "fas fa-users"
    },
    {
      id: 3,
      value: "2.234 Căn",
      label: "Đã bán từ định giá THG",
      color: "emerald",
      icon: "fas fa-building"
    }
  ],
  map: {
    imageUrl: "https://radanhadat.vn/edutech/wp-content/uploads/2025/01/2.-Ra-mat-SAAS-popup-web-800-x-600-px-3.png",
    locations: [
      {
        id: 1,
        name: "Hồ Chí Minh (HQ)",
        position: {
          top: "55%",
          left: "78%"
        },
        color: "blue-500",
        size: "6",
        iconClass: "fas fa-location-arrow text-white text-xs",
        animationDelay: ""
      }
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Nguyễn Văn Nam",
      position: "CTO, Công ty ABC",
      quote: "Thiên Hà Group mang đến giải pháp tích hợp công nghệ rất hiệu quả. Đội ngũ tư vấn tận tâm, triển khai nhanh và ROI tốt.",
      initials: "NV",
      color: "blue",
      rating: 5
    }
  ]
})

// UI State for image previews
const aboutImagePreview = ref(null)
const mapImagePreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const aboutImageInput = ref(null)
const mapImageInput = ref(null)

// Files management (giống component gốc)
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
import {baseImgaeUrl} from "../../../../assets/js/global.js";
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 56

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

    // Update content - handle nested paths
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

    // Update content - handle nested paths
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

const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000)
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
      aboutImagePreview.value = null
      mapImagePreview.value = null

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
      name: 'Nội dung chi tiết',
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

      // Update file statuses (giống component gốc)
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
      aboutImagePreview.value = null
      mapImagePreview.value = null

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
  if (content.about.image.src === tempUrl) {
    content.about.image.src = realUrl
  }
  if (content.map.imageUrl === tempUrl) {
    content.map.imageUrl = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
// About Image
const triggerAboutImageInput = () => {
  aboutImageInput.value?.click()
}

const handleAboutImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'AboutImage', aboutImagePreview, 'about.image.src')
  }
  event.target.value = ''
}

const handleAboutImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'AboutImage', aboutImagePreview, 'about.image.src')
  }
}

const removeAboutImage = () => {
  if (content.about.image.src) {
    handleRemoveFile(content.about.image.src, 'about.image.src', aboutImagePreview)
  }
}

const previewAboutImage = () => {
  if (content.about.image.src) {
    previewImageUrl.value = getImageUrl(content.about.image.src)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

// Map Image
const triggerMapImageInput = () => {
  mapImageInput.value?.click()
}

const handleMapImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'MapImage', mapImagePreview, 'map.imageUrl')
  }
  event.target.value = ''
}

const handleMapImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'MapImage', mapImagePreview, 'map.imageUrl')
  }
}

const removeMapImage = () => {
  if (content.map.imageUrl) {
    handleRemoveFile(content.map.imageUrl, 'map.imageUrl', mapImagePreview)
  }
}

const previewMapImage = () => {
  if (content.map.imageUrl) {
    previewImageUrl.value = getImageUrl(content.map.imageUrl)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh bản đồ để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
}

// ========== SERVICES MANAGEMENT ==========
const addService = () => {
  content.services.push({
    id: generateId(),
    title: "",
    description: "",
    color: "blue",
    link: "#",
    linkText: "Xem chi tiết",
    iconName: "fas fa-star",
    iconClass: "",
    padding: "large",
    hoverEffect: true,
    aos: "fade-up",
    aosDelay: "0",
    quickAccessUrl: ""
  })
  showToast('Đã thêm dịch vụ mới', 'success')
}

const removeService = (index) => {
  if (confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
    content.services.splice(index, 1)
    showToast('Đã xóa dịch vụ', 'success')
  }
}

const moveServiceUp = (index) => {
  if (index > 0) {
    const temp = content.services[index]
    content.services[index] = content.services[index - 1]
    content.services[index - 1] = temp
  }
}

const moveServiceDown = (index) => {
  if (index < content.services.length - 1) {
    const temp = content.services[index]
    content.services[index] = content.services[index + 1]
    content.services[index + 1] = temp
  }
}

// ========== QUICK STATS MANAGEMENT ==========
const addQuickStat = () => {
  content.about.quickStats.push({
    id: generateId(),
    value: "",
    label: "",
    color: "blue",
    padding: "small",
    hoverEffect: true
  })
  showToast('Đã thêm thống kê nhanh', 'success')
}

const removeQuickStat = (index) => {
  if (confirm('Bạn có chắc muốn xóa thống kê này?')) {
    content.about.quickStats.splice(index, 1)
    showToast('Đã xóa thống kê', 'success')
  }
}

// ========== STAT CARDS MANAGEMENT ==========
const addStatCard = () => {
  content.statsCards.push({
    id: generateId(),
    value: "",
    label: "",
    color: "blue",
    icon: "fas fa-star"
  })
  showToast('Đã thêm thẻ thống kê', 'success')
}

const removeStatCard = (index) => {
  if (confirm('Bạn có chắc muốn xóa thẻ thống kê này?')) {
    content.statsCards.splice(index, 1)
    showToast('Đã xóa thẻ thống kê', 'success')
  }
}

// ========== LOCATIONS MANAGEMENT ==========
const addLocation = () => {
  content.map.locations.push({
    id: generateId(),
    name: "",
    position: {
      top: "50%",
      left: "50%"
    },
    color: "blue-500",
    size: "3",
    iconClass: "",
    animationDelay: ""
  })
  showToast('Đã thêm vị trí mới', 'success')
}

const removeLocation = (index) => {
  if (confirm('Bạn có chắc muốn xóa vị trí này?')) {
    content.map.locations.splice(index, 1)
    showToast('Đã xóa vị trí', 'success')
  }
}

// ========== TESTIMONIALS MANAGEMENT ==========
const addTestimonial = () => {
  content.testimonials.push({
    id: generateId(),
    name: "",
    position: "",
    quote: "",
    initials: "",
    color: "blue",
    rating: 5
  })
  showToast('Đã thêm đánh giá mới', 'success')
}

const removeTestimonial = (index) => {
  if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
    content.testimonials.splice(index, 1)
    showToast('Đã xóa đánh giá', 'success')
  }
}

const moveTestimonialUp = (index) => {
  if (index > 0) {
    const temp = content.testimonials[index]
    content.testimonials[index] = content.testimonials[index - 1]
    content.testimonials[index - 1] = temp
  }
}

const moveTestimonialDown = (index) => {
  if (index < content.testimonials.length - 1) {
    const temp = content.testimonials[index]
    content.testimonials[index] = content.testimonials[index + 1]
    content.testimonials[index + 1] = temp
  }
}

const globalColors =ref({});

const loadDataColors = async () => {
  const response = await api.get('/cms/getSection/55')
  const parsedJSON = JSON.parse(response.data.contentJson)
  globalColors.value = parsedJSON.colors || {}
}

// ========== LIFECYCLE HOOKS ==========
onMounted(async () => {
  await loadData()
  await loadDataColors()
})
</script>

<style scoped>
/* Tất cả các style từ component gốc đều được giữ nguyên */
.reasons-editor {
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

.setting-section:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .setting-section:last-child:nth-child(odd) {
    max-width: 100%;
  }
}

@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .setting-section:last-child:nth-child(odd) {
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

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
}

/* Services List */
.services-list,
.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quick-stat-item,
.stat-card-item,
.location-item,
.service-item,
.testimonial-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.quick-stat-item:hover,
.stat-card-item:hover,
.location-item:hover,
.service-item:hover,
.testimonial-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.stat-header,
.card-header,
.location-header,
.service-header,
.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.stat-header h4,
.card-header h4,
.location-header h4,
.service-header h4,
.testimonial-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1rem;
}

.service-actions,
.testimonial-actions {
  display: flex;
  gap: 8px;
}

.btn-danger {
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #c82333 0%, #dc3545 100%);
  color: white !important;
}

/* Input with icon preview */
.input-with-icon {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-with-icon .icon-preview {
  font-size: 1.5rem;
  color: #4a6cf7;
  width: 40px;
  text-align: center;
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

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-text {
  display: block;
  margin-top: 6px;
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

/* Button Settings */
.button-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.button-settings .form-group {
  margin-bottom: 15px;
}

.button-settings .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  border: 2px dashed #dee2e6;
  border-radius: 10px;
  background: #f8f9fa;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 15px;
  display: block;
  color: #adb5bd;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
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
  background-color: #e9ecef;
  transform: scale(1.1);
}

.btn-preview-action {
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.btn-preview-action:hover {
  background-color: white;
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

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .button-settings .form-row {
    grid-template-columns: 1fr;
  }

  .stat-header,
  .card-header,
  .location-header,
  .service-header,
  .testimonial-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .service-actions,
  .testimonial-actions {
    align-self: flex-end;
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
}
</style>