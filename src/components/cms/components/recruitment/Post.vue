<template>
  <div class="related-posts-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Các bài viết tuyển dụng liên quan</h2>
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
<!--      <button-->
<!--          class="tab-button"-->
<!--          :class="{ active: activeTab === 'posts' }"-->
<!--          @click="activeTab = 'posts'"-->
<!--      >-->
<!--        <i class="fas fa-newspaper"></i> Quản lý bài viết-->
<!--      </button>-->
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
          <!-- Thông tin tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề & Nút bấm</h3>

            <div class="form-group">
              <label for="section-title">Tiêu đề section</label>
              <input
                  type="text"
                  id="section-title"
                  v-model="content.config.sectionTitle"
                  placeholder="CÁC BÀI VIẾT LIÊN QUAN"
              />
            </div>

            <div class="form-group">
              <label for="button-text">Văn bản nút bấm</label>
              <input
                  type="text"
                  id="button-text"
                  v-model="content.config.buttonText"
                  placeholder="Xem chi tiết"
              />
            </div>
          </div>

          <!-- Cài đặt khoảng cách -->
          <div class="setting-section">
            <h3><i class="fas fa-arrows-alt"></i> Khoảng cách & Kích thước</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="section-padding">Padding section</label>
                <input
                    type="text"
                    id="section-padding"
                    v-model="content.config.spacing.sectionPadding"
                    placeholder="60px 20px"
                />
              </div>

              <div class="form-group">
                <label for="card-padding">Padding card</label>
                <input
                    type="text"
                    id="card-padding"
                    v-model="content.config.spacing.cardPadding"
                    placeholder="20px"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="card-gap">Khoảng cách card</label>
                <div class="input-with-unit">
                  <input type="number" id="card-gap" v-model.number="content.config.spacing.cardGap" placeholder="20"/>
                  <span class="unit">px</span>
                </div>
              </div>

              <div class="form-group">
                <label for="card-border-radius">Bo góc card</label>
                <div class="input-with-unit">
                  <input type="number" id="card-border-radius" v-model.number="content.config.spacing.cardBorderRadius" placeholder="12"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="card-width">Chiều rộng card (desktop)</label>
                <div class="input-with-unit">
                  <input type="number" id="card-width" v-model.number="content.config.sizes.cardWidth" placeholder="400"/>
                  <span class="unit">px</span>
                </div>
              </div>

              <div class="form-group">
                <label for="image-height">Chiều cao ảnh</label>
                <div class="input-with-unit">
                  <input type="number" id="image-height" v-model.number="content.config.sizes.imageHeight" placeholder="200"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Đổ bóng -->
          <div class="setting-section">
            <h3><i class="fas fa-box-shadow"></i> Hiệu ứng đổ bóng</h3>

            <div class="form-group">
              <label for="card-shadow">Đổ bóng card</label>
              <input
                  type="text"
                  id="card-shadow"
                  v-model="content.config.shadows.cardShadow"
                  placeholder="0 4px 12px rgba(3, 19, 88, 0.1)"
              />
            </div>

            <div class="form-group">
              <label for="card-hover-shadow">Đổ bóng khi hover</label>
              <input
                  type="text"
                  id="card-hover-shadow"
                  v-model="content.config.shadows.cardHoverShadow"
                  placeholder="0 12px 24px rgba(3, 19, 88, 0.15)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Quản lý bài viết -->
      <div v-if="activeTab === 'posts'" class="posts-settings">
        <div class="posts-header">
          <h3><i class="fas fa-newspaper"></i> Quản lý các bài viết</h3>
          <button class="btn btn-primary" @click="addPost">
            <i class="fas fa-plus"></i> Thêm bài viết mới
          </button>
        </div>

        <div class="posts-list">
          <div
              v-for="(post, index) in content.config.posts"
              :key="index"
              class="post-item"
              :class="{ 'editing': editingPostIndex === index }"
          >
            <div class="post-header" @click="togglePostEdit(index)">
              <div class="post-preview">
                <div class="post-image-preview" v-if="post.image">
                  <img :src="getImageUrl(post.image)" alt="Preview"/>
                </div>
                <div class="post-details">
                  <div class="post-title-preview">{{ post.title }}</div>
                  <div class="post-date-preview"><i class="far fa-calendar"></i> {{ post.date }}</div>
                </div>
              </div>
              <div class="post-actions">
                <button class="btn-icon" @click.stop="movePostUp(index)" :disabled="index === 0" title="Di chuyển lên">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click.stop="movePostDown(index)"
                        :disabled="index === content.config.posts.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-delete" @click.stop="removePost(index)" title="Xóa bài viết">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn-icon" @click.stop="togglePostEdit(index)"
                        :title="editingPostIndex === index ? 'Đóng chỉnh sửa' : 'Chỉnh sửa'">
                  <i :class="editingPostIndex === index ? 'fas fa-chevron-up' : 'fas fa-edit'"></i>
                </button>
              </div>
            </div>

            <!-- Post Edit Form -->
            <div v-if="editingPostIndex === index" class="post-edit-form">
              <div class="form-group">
                <label for="post-title">Tiêu đề bài viết</label>
                <input
                    type="text"
                    :id="'post-title-' + index"
                    v-model="post.title"
                    placeholder="Tuyển Dụng Chuyên Viên Tư Vấn Bất Động Sản Cao Cấp"
                />
              </div>

              <div class="form-group">
                <label for="post-excerpt">Mô tả ngắn</label>
                <textarea
                    :id="'post-excerpt-' + index"
                    v-model="post.excerpt"
                    rows="3"
                    placeholder="Tìm kiếm ứng viên có kinh nghiệm trong lĩnh vực BĐS cao cấp..."
                ></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="post-date">Ngày đăng</label>
                  <input
                      type="text"
                      :id="'post-date-' + index"
                      v-model="post.date"
                      placeholder="15/10/2023"
                  />
                </div>
              </div>

              <!-- Hình ảnh bài viết -->
              <div class="form-group">
                <h4><i class="fas fa-image"></i> Hình ảnh bài viết</h4>
                <div class="file-upload">
                  <div class="file-upload-area" @click="() => triggerImageInputForPost(index)" @dragover.prevent
                       @drop.prevent="(e) => handleImageDropForPost(e, index)">
                    <input
                        type="file"
                        :ref="el => setImageInputRef(el, index)"
                        @change="(e) => handleImageUploadForPost(e, index)"
                        accept="image/*"
                        style="display: none"
                    />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                    <p class="file-hint">Kích thước đề xuất: 400x200px</p>
                  </div>

                  <div v-if="post.image && !post.image.startsWith('data:')" class="upload-preview">
                    <img :src="getImageUrl(post.image)" alt="Preview"/>
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewPostImage(post.image)" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="() => removePostImage(index)" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>

                  <div v-if="post.image && post.image.startsWith('data:')" class="upload-preview">
                    <img :src="post.image" alt="Preview"/>
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewPostImage(post.image)" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="() => removePostImage(index)" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="form-group" v-if="!post.image">
                  <label for="post-image-url">Hoặc nhập URL ảnh</label>
                  <input
                      type="text"
                      :id="'post-image-url-' + index"
                      v-model="post.image"
                      placeholder="/imgs/hr1.jpg"
                  />
                </div>
              </div>

              <div class="form-actions">
                <button class="btn btn-secondary" @click="togglePostEdit(index)">
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
          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu sắc</h3>

            <div class="color-input-group">
              <label>Màu chủ đạo (Primary)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.config.colors.primary"/>
                <input type="text" v-model="content.config.colors.primary" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu phụ (Secondary)</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.config.colors.secondary"/>
                <input type="text" v-model="content.config.colors.secondary" placeholder="#0030FF"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ đậm</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.config.colors.textDark"/>
                <input type="text" v-model="content.config.colors.textDark" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ nhạt</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.config.colors.textLight"/>
                <input type="text" v-model="content.config.colors.textLight" placeholder="#555"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu nền card</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.config.colors.background"/>
                <input type="text" v-model="content.config.colors.background" placeholder="#ffffff"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu nút khi hover</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.config.colors.buttonHover"/>
                <input type="text" v-model="content.config.colors.buttonHover" placeholder="#0030FF"/>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Typography</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="section-title-size">Kích thước tiêu đề section</label>
                <div class="input-with-unit">
                  <input type="number" id="section-title-size" v-model.number="content.config.typography.sectionTitleSize" placeholder="40"/>
                  <span class="unit">px</span>
                </div>
              </div>

              <div class="form-group">
                <label for="post-title-size">Kích thước tiêu đề bài viết</label>
                <div class="input-with-unit">
                  <input type="number" id="post-title-size" v-model.number="content.config.typography.postTitleSize" placeholder="20"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="excerpt-size">Kích thước mô tả</label>
                <div class="input-with-unit">
                  <input type="number" id="excerpt-size" v-model.number="content.config.typography.excerptSize" placeholder="17"/>
                  <span class="unit">px</span>
                </div>
              </div>

              <div class="form-group">
                <label for="date-size">Kích thước ngày tháng</label>
                <div class="input-with-unit">
                  <input type="number" id="date-size" v-model.number="content.config.typography.dateSize" placeholder="14"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="button-size">Kích thước nút bấm</label>
              <div class="input-with-unit">
                <input type="number" id="button-size" v-model.number="content.config.typography.buttonSize" placeholder="16"/>
                <span class="unit">px</span>
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
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)
const editingPostIndex = ref(null)

// Content structure based on JSON data for section 41
const content = reactive({
  config: {
    sectionTitle: 'CÁC BÀI VIẾT LIÊN QUAN',
    buttonText: 'Xem chi tiết',
    colors: {
      primary: '#031358',
      secondary: '#0030FF',
      textDark: '#031358',
      textLight: '#555',
      background: '#ffffff',
      progressBg: '#e0e0e0',
      buttonHover: '#0030FF'
    },
    typography: {
      fontFamily: "'Ubuntu', sans-serif",
      sectionTitleSize: '40',
      postTitleSize: '20',
      excerptSize: '17',
      dateSize: '14',
      buttonSize: '16'
    },
    spacing: {
      sectionPadding: '60px 20px',
      cardPadding: '20px',
      cardGap: '20',
      cardBorderRadius: '12',
      buttonBorderRadius: '6'
    },
    sizes: {
      cardWidth: '400',
      cardWidthMobile: '280',
      cardWidthSmallMobile: '260',
      imageHeight: '200',
      progressBarHeight: '6',
      buttonWidth: '36',
      buttonWidthMobile: '32',
      buttonWidthSmallMobile: '28'
    },
    shadows: {
      cardShadow: '0 4px 12px rgba(3, 19, 88, 0.1)',
      cardHoverShadow: '0 12px 24px rgba(3, 19, 88, 0.15)'
    },
    posts: [
      {
        title: 'Tuyển Dụng Chuyên Viên Tư Vấn Bất Động Sản Cao Cấp',
        excerpt: 'Tìm kiếm ứng viên có kinh nghiệm trong lĩnh vực BĐS cao cấp, khả năng giao tiếp tốt và am hiểu thị trường.',
        image: '/imgs/hr1.jpg',
        date: '15/10/2023'
      },
      {
        title: 'Cơ Hội Nghề Nghiệp: Quản Lý Dự Án Bất Động Sản',
        excerpt: 'Vị trí quản lý dự án yêu cầu kinh nghiệm 3+ năm, kỹ năng lãnh đạo và kiến thức chuyên sâu về pháp lý BĐS.',
        image: '/imgs/hr2.jpg',
        date: '12/10/2023'
      },
      {
        title: 'Tuyển Gấp Nhân Viên Kinh Doanh Bất Động Sản',
        excerpt: 'Công ty mở rộng quy mô, cần tuyển nhân viên kinh doanh có đam mê, năng động và mong muốn thu nhập cao.',
        image: '/imgs/hr3.png',
        date: '10/10/2023'
      },
      {
        title: 'Chuyên Viên Pháp Lý Bất Động Sản - Mức Lương Hấp Dẫn',
        excerpt: 'Tìm kiếm chuyên viên pháp lý có kinh nghiệm xử lý hồ sơ, hợp đồng và các vấn đề pháp lý liên quan đến BĐS.',
        image: '/imgs/hr4.jpg',
        date: '08/10/2023'
      },
      {
        title: 'Trưởng Phòng Kinh Doanh Bất Động Sản Thương Mại',
        excerpt: 'Vị trí lãnh đạo đội ngũ kinh doanh BĐS thương mại, yêu cầu kinh nghiệm quản lý và thành tích bán hàng ấn tượng.',
        image: '/imgs/hr5.jpg',
        date: '05/10/2023'
      },
      {
        title: 'Nhân Viên Marketing Bất Động Sản - Môi Trường Năng Động',
        excerpt: 'Tuyển dụng chuyên viên marketing có kinh nghiệm trong ngành BĐS, sáng tạo và am hiểu digital marketing.',
        image: '/imgs/hr6.jpg',
        date: '01/10/2023'
      }
    ]
  }
})

// UI State
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

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

// Image input refs
const imageInputRefs = ref([])

// ========== CONSTANTS ==========
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 41

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

  // Check if it's already a full URL or data URL
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

const handleFileUploadForPost = (file, postIndex) => {
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

    // Update post image
    content.config.posts[postIndex].image = previewUrl // Store as data URL temporarily

    // Create file DTO
    const fileDTO = {
      id: null,
      filename: `post_image_${postIndex}_${file.name}`,
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
      previewUrl: previewUrl,
      postIndex: postIndex
    })

    // Add to files array
    files.value.push(fileDTO)

    showToast('Ảnh bài viết đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  return true
}

// ========== POST MANAGEMENT ==========
const addPost = () => {
  content.config.posts.push({
    title: 'Bài viết mới',
    excerpt: 'Mô tả cho bài viết mới...',
    image: '',
    date: new Date().toLocaleDateString('vi-VN')
  })

  editingPostIndex.value = content.config.posts.length - 1
  showToast('Đã thêm bài viết mới', 'success')
}

const removePost = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
    const post = content.config.posts[index]

    // Remove any file references related to this post if needed
    if (post.image && post.image.startsWith(TEMP_PREFIX)) {
      const tempName = post.image.replace(TEMP_PREFIX, '')
      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    }

    content.config.posts.splice(index, 1)

    if (editingPostIndex.value === index) {
      editingPostIndex.value = null
    } else if (editingPostIndex.value > index) {
      editingPostIndex.value--
    }

    showToast('Đã xóa bài viết', 'success')
  }
}

const movePostUp = (index) => {
  if (index > 0) {
    const temp = content.config.posts[index]
    content.config.posts[index] = content.config.posts[index - 1]
    content.config.posts[index - 1] = temp

    if (editingPostIndex.value === index) {
      editingPostIndex.value = index - 1
    } else if (editingPostIndex.value === index - 1) {
      editingPostIndex.value = index
    }
  }
}

const movePostDown = (index) => {
  if (index < content.config.posts.length - 1) {
    const temp = content.config.posts[index]
    content.config.posts[index] = content.config.posts[index + 1]
    content.config.posts[index + 1] = temp

    if (editingPostIndex.value === index) {
      editingPostIndex.value = index + 1
    } else if (editingPostIndex.value === index + 1) {
      editingPostIndex.value = index
    }
  }
}

const togglePostEdit = (index) => {
  editingPostIndex.value = editingPostIndex.value === index ? null : index
}

// ========== IMAGE INPUT REFS MANAGEMENT ==========
const setImageInputRef = (el, index) => {
  if (el) {
    imageInputRefs.value[index] = el
  }
}

// ========== IMAGE UPLOAD HANDLERS FOR POSTS ==========
const triggerImageInputForPost = (postIndex) => {
  const inputRef = imageInputRefs.value[postIndex]
  if (inputRef) {
    inputRef.click()
  }
}

const handleImageUploadForPost = (event, postIndex) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUploadForPost(file, postIndex)
  }
  event.target.value = ''
}

const handleImageDropForPost = (event, postIndex) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUploadForPost(file, postIndex)
  }
}

const removePostImage = (postIndex) => {
  const post = content.config.posts[postIndex]
  if (post.image) {
    if (post.image.startsWith(TEMP_PREFIX)) {
      const tempName = post.image.replace(TEMP_PREFIX, '')

      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else if (!post.image.startsWith('data:')) {
      const fileIndex = files.value.findIndex(f => f.filename === post.image || f.mappingRealUrl === post.image)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    post.image = ''

    showToast('Đã xóa ảnh bài viết', 'success')
  }
}

// ========== PREVIEW FUNCTIONS ==========
const previewPostImage = (imageUrl) => {
  if (imageUrl) {
    previewImageUrl.value = imageUrl.startsWith('data:') ? imageUrl : getImageUrl(imageUrl)
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

      // Update content with loaded data
      Object.assign(content.config, data.config || data)

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
      config: {...content.config}
    }

    // Before saving, convert data URLs back to temp URLs for posts
    contentData.config.posts = content.config.posts.map((post, index) => {
      const postWithImage = {...post}

      // Check if image is a data URL (new upload)
      if (post.image && post.image.startsWith('data:')) {
        const uploadedFile = uploadedFiles.value.find(f => f.postIndex === index)
        if (uploadedFile && uploadedFile.tempName) {
          postWithImage.image = TEMP_PREFIX + uploadedFile.tempName
        }
      }

      return postWithImage
    })

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Các bài viết tuyển dụng liên quan',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 5,
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

              // Update post image URLs from temp to real
              updatePostImageUrls(file)
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

const updatePostImageUrls = (file) => {
  const tempUrl = TEMP_PREFIX + file.tempName
  const realUrl = file.mappingRealUrl

  // Check all post images
  content.config.posts.forEach(post => {
    if (post.image === tempUrl) {
      post.image = realUrl
    }
  })
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.related-posts-editor {
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

/* Posts Management */
.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.posts-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.post-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.post-header:hover {
  background-color: #e9ecef;
}

.post-preview {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.post-image-preview {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.post-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-details {
  flex: 1;
}

.post-title-preview {
  font-weight: 600;
  color: #495057;
  margin-bottom: 5px;
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-date-preview {
  font-size: 0.85rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 5px;
}

.post-actions {
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

.post-edit-form {
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

.setting-section h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
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
.form-group textarea:focus,
.form-group select:focus {
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

  .posts-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .post-header {
    flex-wrap: wrap;
  }

  .post-actions {
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

  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .post-preview {
    width: 100%;
  }

  .post-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>