<template>
  <div class="reasons-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Nội dung chính - Giải pháp bán nhanh nhà phố</h2>
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
          :class="{ active: activeTab === 'timeline' }"
          @click="activeTab = 'timeline'"
      >
        <i class="fas fa-road"></i> Lộ trình 30 ngày
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'services' }"
          @click="activeTab = 'services'"
      >
        <i class="fas fa-cog"></i> Dịch vụ
      </button>
      <!--      <button-->
      <!--          class="tab-button"-->
      <!--          :class="{ active: activeTab === 'projects' }"-->
      <!--          @click="activeTab = 'projects'"-->
      <!--      >-->
      <!--        <i class="fas fa-building"></i> Dự án đã bán-->
      <!--      </button>-->
      <button
          class="tab-button"
          :class="{ active: activeTab === 'process' }"
          @click="activeTab = 'process'"
      >
        <i class="fas fa-list-ol"></i> Quy trình
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
                  placeholder="GIẢI PHÁP CÔNG NGHỆ THIÊN HÀ GROUP"
              />
            </div>

            <div class="form-group">
              <label for="heroTitle">Tiêu đề chính</label>
              <input
                  type="text"
                  id="heroTitle"
                  v-model="content.hero.title"
                  placeholder="Bán nhanh"
              />
            </div>

            <div class="form-group">
              <label for="heroHighlightedText1">Văn bản nổi bật 1</label>
              <input
                  type="text"
                  id="heroHighlightedText1"
                  v-model="content.hero.highlightedText1"
                  placeholder="nhà phố"
              />
            </div>

            <div class="form-group">
              <label for="heroSubtitle">Phụ đề</label>
              <input
                  type="text"
                  id="heroSubtitle"
                  v-model="content.hero.subtitle"
                  placeholder="trong"
              />
            </div>

            <div class="form-group">
              <label for="heroHighlightedText2">Văn bản nổi bật 2</label>
              <input
                  type="text"
                  id="heroHighlightedText2"
                  v-model="content.hero.highlightedText2"
                  placeholder="30 ngày"
              />
            </div>

            <div class="form-group">
              <label for="heroDescription">Mô tả</label>
              <textarea
                  id="heroDescription"
                  v-model="content.hero.description"
                  rows="3"
                  placeholder="Chuẩn hoá quy trình bán + dữ liệu thị trường..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Tags</label>
              <div v-for="(tag, index) in content.hero.tags" :key="index" class="form-row">
                <input type="text" v-model="content.hero.tags[index]" :placeholder="'Tag ' + (index + 1)" />
                <button class="btn-icon btn-danger" @click="removeTag(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <button class="btn btn-secondary" @click="addTag">
                <i class="fas fa-plus"></i> Thêm tag
              </button>
            </div>
          </div>

          <!-- Nút bấm -->
          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm</h3>

            <div class="button-settings">
              <div class="form-group">
                <label>Nút Xem giải pháp</label>
                <div class="form-row">
                  <input type="text" v-model="content.buttons.solution.text" placeholder="Xem giải pháp"/>
                  <input type="text" v-model="content.buttons.solution.href" placeholder="#giai-phap"/>
                </div>
              </div>

              <div class="form-group">
                <label>Nút Đăng ký bán ngay</label>
                <div class="form-row">
                  <input type="text" v-model="content.buttons.register.text" placeholder="Đăng ký bán ngay"/>
                  <input type="text" v-model="content.buttons.register.href" placeholder="#lien-he"/>
                </div>
              </div>

              <div class="form-group">
                <label>Nút Nhận tư vấn</label>
                <div class="form-row">
                  <input type="text" v-model="content.buttons.consult.text" placeholder="Nhận tư vấn"/>
                  <input type="text" v-model="content.buttons.consult.href" placeholder="#lien-he"/>
                </div>
              </div>

              <div class="form-group">
                <label>Nút Tra cứu thời gian bán</label>
                <input type="text" v-model="content.buttons.search.text" placeholder="Tra cứu thời gian bán"/>
              </div>

              <div class="form-group">
                <label>Nút Đăng nhập để xem</label>
                <input type="text" v-model="content.buttons.loginToView.text" placeholder="Đăng nhập để xem phân tích chi tiết"/>
              </div>

              <div class="form-group">
                <label>Nút Xem chi tiết</label>
                <input type="text" v-model="content.buttons.viewDetails.text" placeholder="Xem chi tiết phân tích"/>
              </div>

              <div class="form-group">
                <label>Nút Dashboard</label>
                <div class="form-row">
                  <input type="text" v-model="content.buttons.dashboard.text" placeholder="Mở dashboard tiến độ"/>
                  <input type="text" v-model="content.buttons.dashboard.href" placeholder="#"/>
                </div>
              </div>

              <div class="form-group">
                <label>Nút Gửi đăng ký</label>
                <input type="text" v-model="content.buttons.submit.text" placeholder="Gửi đăng ký"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Lộ trình 30 ngày -->
      <div v-if="activeTab === 'timeline'" class="timeline-settings">
        <div class="setting-section">
          <h3><i class="fas fa-road"></i> Lộ trình 30 ngày</h3>

          <div class="form-group">
            <label for="timelineTitle">Tiêu đề</label>
            <input type="text" id="timelineTitle" v-model="content.timeline.title" placeholder="Tóm tắt lộ trình 30 ngày" />
          </div>

          <div class="form-group">
            <label for="timelineDescription">Mô tả</label>
            <textarea id="timelineDescription" v-model="content.timeline.description" rows="2" placeholder="Theo dõi từng bước, cập nhật minh bạch..."></textarea>
          </div>

          <div v-for="(step, index) in content.timeline.steps" :key="step.id" class="timeline-step-item">
            <div class="step-header">
              <h4>Bước #{{ index + 1 }}</h4>
              <button class="btn-icon btn-danger" @click="removeTimelineStep(index)">
                <i class="fas fa-trash"></i>
              </button>
            </div>

            <div class="form-group">
              <label>Số thứ tự</label>
              <input type="text" v-model="step.number" placeholder="1" />
            </div>

            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" v-model="step.title" placeholder="Ngày 1–3: Khảo sát & định giá" />
            </div>

            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="step.description" rows="2" placeholder="Chốt mức giá mục tiêu + chiến lược thương lượng."></textarea>
            </div>
          </div>

          <button class="btn btn-secondary" @click="addTimelineStep">
            <i class="fas fa-plus"></i> Thêm bước
          </button>
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
                  <button class="btn-icon" @click="moveServiceDown(index)"
                          :disabled="index === content.services.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeService(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="service.title" placeholder="Định giá theo dữ liệu"/>
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="service.description" rows="3"
                          placeholder="Phân tích thị trường, so sánh giao dịch thực tế..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Màu sắc</label>
                  <select v-model="service.color" @change="handleServiceColorChange(index, $event)">
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="teal">Teal</option>
                    <option value="pink">Pink</option>
                    <option value="amber">Amber</option>
                    <option value="orange">Orange</option>
                    <option value="sky">Sky</option>
                    <option value="cyan">Cyan</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                  <ColorInputWithGlobalColors
                      v-if="service.color === 'custom'"
                      v-model="service.customColor"
                      placeholder="Nhập mã màu tùy chỉnh"
                      return-type="key" :colors="globalColors"
                  />
                </div>
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="service.iconName"/>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Văn bản truy cập nhanh</label>
                  <input type="text" v-model="service.quickAccessText" placeholder="Đăng ký bán ngay"/>
                </div>
                <div class="form-group">
                  <label>URL truy cập nhanh</label>
                  <input type="text" v-model="service.quickAccessUrl" placeholder="#"/>
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

      <!-- Tab Dự án đã bán -->
      <div v-if="activeTab === 'projects'" class="projects-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-building"></i> Dự án đã bán thành công</h3>
            <button class="btn btn-primary" @click="addProject">
              <i class="fas fa-plus"></i> Thêm dự án
            </button>
          </div>

          <div class="form-group">
            <label for="soldProjectsTitle">Tiêu đề</label>
            <input type="text" id="soldProjectsTitle" v-model="content.soldProjects.title" placeholder="Dự án đã bán thành công" />
          </div>

          <div class="form-group">
            <label for="soldProjectsDescription">Mô tả</label>
            <textarea id="soldProjectsDescription" v-model="content.soldProjects.description" rows="2" placeholder="Khách hàng tin tưởng – Nhà phố được bán nhanh trong 30 ngày..."></textarea>
          </div>

          <div class="projects-list">
            <div v-for="(project, index) in content.soldProjects.items" :key="project.id" class="project-item">
              <div class="project-header">
                <h4>Dự án #{{ index + 1 }} - {{ project.type || 'Chưa có loại' }}</h4>
                <div class="project-actions">
                  <button class="btn-icon" @click="moveProjectUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveProjectDown(index)"
                          :disabled="index === content.soldProjects.items.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeProject(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Loại</label>
                <input type="text" v-model="project.type" placeholder="Nhà phố 4 tầng" />
              </div>

              <div class="form-group">
                <label>Vị trí</label>
                <input type="text" v-model="project.location" placeholder="Quận 2, TP.HCM" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Trạng thái</label>
                  <input type="text" v-model="project.status" placeholder="ĐÃ BÁN" />
                </div>
                <div class="form-group">
                  <label>Giá (tỷ VNĐ)</label>
                  <input type="text" v-model="project.price" placeholder="14.5" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Thời gian bán</label>
                  <input type="text" v-model="project.saleTime" placeholder="28 ngày" />
                </div>
                <div class="form-group">
                  <label>Chênh lệch giá (%)</label>
                  <input type="text" v-model="project.priceDifference" placeholder="8" />
                </div>
              </div>

              <!-- Ảnh dự án - Updated to match MainContent -->
              <div class="form-group">
                <div class="label" style="display: flex; justify-content: space-between">
                  <label>Ảnh dự án</label>
                  <button class="btn-icon btn-preview-action" @click="previewProjectImage(index)" title="Xem trước"
                          v-if="project.imageUrl">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
                <div class="file-upload">
                  <div class="file-upload-area" @click="triggerProjectImageInput(index)" @dragover.prevent
                       @drop.prevent="(event) => handleProjectImageDrop(event, index)">
                    <input
                        type="file"
                        :ref="el => projectImageInputs[index] = el"
                        @change="(event) => handleProjectImageUpload(event, index)"
                        accept="image/*"
                        style="display: none"
                    />
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                    <p class="file-hint">Kích thước đề xuất: 800x600px</p>
                  </div>

                  <div v-if="projectImagePreviews[index] || project.imageUrl" class="upload-preview">
                    <img :src="getImageUrl(project.imageUrl)" alt="Project Image Preview"/>
                    <div class="preview-actions">
                      <button class="btn-preview-action" @click="previewProjectImage(index)" title="Xem trước">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-preview-action" @click="removeProjectImage(index)" title="Xóa ảnh">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!--                <div v-if="!projectImagePreviews[index] && !project.imageUrl" class="form-group">-->
                <!--                  <label :for="`project-image-url-${index}`">Hoặc nhập URL ảnh</label>-->
                <!--                  <input-->
                <!--                      type="text"-->
                <!--                      :id="`project-image-url-${index}`"-->
                <!--                      v-model="project.imageUrl"-->
                <!--                      placeholder="https://example.com/image.jpg"-->
                <!--                  />-->
                <!--                </div>-->
              </div>

              <div class="form-group">
                <label>Class ảnh</label>
                <input type="text" v-model="project.imageClass" placeholder="bg-gradient-to-br from-purple-500/20 to-blue-500/10" />
              </div>
            </div>

            <div v-if="content.soldProjects.items.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Chưa có dự án nào. Hãy thêm dự án đầu tiên!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Quy trình -->
      <div v-if="activeTab === 'process'" class="process-settings">
        <div class="setting-section">
          <h3><i class="fas fa-list-ol"></i> Quy trình chuẩn hoá</h3>

          <div class="form-group">
            <label for="processTitle">Tiêu đề</label>
            <input type="text" id="processTitle" v-model="content.process.title" placeholder="Quy trình chuẩn hoá" />
          </div>

          <div class="form-group">
            <label for="processDescription">Mô tả</label>
            <textarea id="processDescription" v-model="content.process.description" rows="2" placeholder="Từ khảo sát tài sản đến công chứng..."></textarea>
          </div>

          <div v-for="(step, index) in content.process.steps" :key="step.id" class="process-step-item">
            <div class="step-header">
              <h4>Bước #{{ index + 1 }}</h4>
              <button class="btn-icon btn-danger" @click="removeProcessStep(index)">
                <i class="fas fa-trash"></i>
              </button>
            </div>

            <div class="form-group">
              <label>Nhãn</label>
              <input type="text" v-model="step.label" placeholder="Bước 1" />
            </div>

            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" v-model="step.title" placeholder="Chuẩn hoá thông tin nhà phố" />
            </div>

            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="step.description" rows="2" placeholder="Pháp lý, hiện trạng, ưu điểm vị trí..."></textarea>
            </div>
          </div>

          <button class="btn btn-secondary" @click="addProcessStep">
            <i class="fas fa-plus"></i> Thêm bước quy trình
          </button>
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

          <div class="form-group">
            <label for="testimonialsTitle">Tiêu đề</label>
            <input type="text" id="testimonialsTitle" v-model="content.testimonials.title" placeholder="Khách hàng nói gì về chúng tôi" />
          </div>

          <div class="form-group">
            <label for="testimonialsDescription">Mô tả</label>
            <textarea id="testimonialsDescription" v-model="content.testimonials.description" rows="2" placeholder="Hàng trăm chủ nhà đã tin tưởng..."></textarea>
          </div>

          <div class="testimonials-list">
            <div v-for="(testimonial, index) in content.testimonials.items" :key="testimonial.id" class="testimonial-item">
              <div class="testimonial-header">
                <h4>Đánh giá #{{ index + 1 }} - {{ testimonial.name || 'Chưa có tên' }}</h4>
                <div class="testimonial-actions">
                  <button class="btn-icon" @click="moveTestimonialUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveTestimonialDown(index)"
                          :disabled="index === content.testimonials.items.length - 1">
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
                  <input type="text" v-model="testimonial.name" placeholder="Nguyễn Thị Mai"/>
                </div>
                <div class="form-group">
                  <label>Vị trí</label>
                  <input type="text" v-model="testimonial.position" placeholder="Chủ nhà phố, Q.2"/>
                </div>
              </div>

              <div class="form-group">
                <label>Trích dẫn</label>
                <textarea v-model="testimonial.quote" rows="3"
                          placeholder="Tôi đã thử bán tự do 6 tháng không được..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Chữ viết tắt</label>
                  <input type="text" v-model="testimonial.initials" placeholder="NM"/>
                </div>
                <div class="form-group">
                  <label>Màu sắc</label>
                  <select v-model="testimonial.color" @change="handleTestimonialColorChange(index, $event)">
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="emerald">Emerald</option>
                    <option value="indigo">Indigo</option>
                    <option value="pink">Pink</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                  <ColorInputWithGlobalColors
                      v-if="testimonial.color === 'custom'"
                      v-model="testimonial.customColor"
                      placeholder="Nhập mã màu tùy chỉnh"
                      return-type="key" :colors="globalColors"
                  />
                </div>
                <div class="form-group">
                  <label>Đánh giá (sao)</label>
                  <input type="number" v-model="testimonial.rating" min="1" max="5" placeholder="5"/>
                </div>
              </div>
            </div>

            <div v-if="content.testimonials.items.length === 0" class="empty-state">
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
import ColorInputWithGlobalColors from "../homeNew/ColorInputWithGlobalColors.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('styles')
const isLoading = ref(false)

// Content structure based on JSON
const content = reactive({
  styles: {
    colors: {
      blue400: "var(--color-blue-400)",
      blue500: "var(--color-blue-500)",
      blue600: "var(--color-blue-600)",
      purple400: "var(--color-purple-500)",
      purple500: "var(--color-purple-500)",
      purple600: "var(--color-purple-600)",
      teal500: "var(--color-teal-500)",
      slate300: "var(--color-slate-300)",
      slate400: "var(--color-slate-400)",
      slate500: "#64748b",
      slate700: "var(--color-slate-700)",
      slate800: "var(--color-slate-800)",
      slate900: "var(--color-slate-900)",
      emerald500: "var(--color-emerald-500)",
      rose500: "#f43f5e"
    },
    gradients: {
      hero: "from-blue-400 to-purple-500",
      solutions: "from-blue-500 to-purple-600",
      soldProjects: "from-blue-400 to-purple-500"
    }
  },
  hero: {
    tagline: "GIẢI PHÁP CÔNG NGHỆ THIÊN HÀ GROUP",
    title: "Bán nhanh",
    highlightedText1: "nhà phố",
    subtitle: "trong",
    highlightedText2: "30 ngày",
    description: "Chuẩn hoá quy trình bán + dữ liệu thị trường + theo dõi tiến độ real-time giúp bạn định giá đúng, tiếp cận đúng tệp khách và chốt nhanh – minh bạch.",
    tags: [
      "Định giá theo dữ liệu",
      "Lọc khách chất lượng",
      "Hỗ trợ pháp lý"
    ]
  },
  timeline: {
    title: "Tóm tắt lộ trình 30 ngày",
    description: "Theo dõi từng bước, cập nhật minh bạch, tối ưu liên tục theo phản hồi thị trường.",
    steps: [
      {
        id: 1,
        number: "1",
        title: "Ngày 1–3: Khảo sát & định giá",
        description: "Chốt mức giá mục tiêu + chiến lược thương lượng."
      },
      {
        id: 2,
        number: "2",
        title: "Ngày 4–10: Chuẩn hoá hồ sơ & marketing",
        description: "Ảnh/clip, mô tả chuẩn, phân phối đa kênh đúng tệp."
      },
      {
        id: 3,
        number: "3",
        title: "Ngày 11–25: Dẫn khách & tối ưu",
        description: "Lọc khách, tăng lịch hẹn, tối ưu theo phản hồi thực."
      },
      {
        id: 4,
        number: "4",
        title: "Ngày 26–30: Đàm phán & chốt",
        description: "Check pháp lý, đặt cọc, công chứng sang tên."
      }
    ]
  },
  buttons: {
    solution: {
      text: "Xem giải pháp",
      href: "#giai-phap"
    },
    register: {
      text: "Đăng ký bán ngay",
      href: "#lien-he"
    },
    consult: {
      text: "Nhận tư vấn",
      href: "#lien-he"
    },
    search: {
      text: "Tra cứu thời gian bán"
    },
    loginToView: {
      text: "Đăng nhập để xem phân tích chi tiết"
    },
    viewDetails: {
      text: "Xem chi tiết phân tích"
    },
    dashboard: {
      text: "Mở dashboard tiến độ",
      href: "#"
    },
    submit: {
      text: "Gửi đăng ký"
    }
  },
  services: [
    {
      id: 1,
      title: "Định giá theo dữ liệu",
      description: "Phân tích thị trường, so sánh giao dịch thực tế, đề xuất mức giá tối ưu theo mục tiêu chốt nhanh.",
      color: "blue",
      customColor: "",
      link: null,
      linkText: null,
      iconName: "fa-solid fa-chart-line",
      iconClass: "w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white",
      padding: "large",
      hoverEffect: true,
      aos: "fade-up",
      aosDelay: "100",
      quickAccessText: "Đăng ký bán ngay",
      quickAccessUrl: "#"
    },
    {
      id: 2,
      title: "Marketing đa kênh thông minh",
      description: "Chuẩn hoá nội dung, ảnh/clip, phân phối đúng tệp khách mua nhà phố — tăng lịch hẹn, giảm khách ảo.",
      color: "purple",
      customColor: "",
      link: null,
      linkText: null,
      iconName: "fa-solid fa-bullhorn",
      iconClass: "w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white",
      padding: "large",
      hoverEffect: true,
      aos: "fade-up",
      aosDelay: "200",
      quickAccessText: "Đăng ký bán ngay",
      quickAccessUrl: "#lien-he"
    },
    {
      id: 3,
      title: "Dự án & Tiến độ (Real-time)",
      description: "Theo dõi lượt xem – phản hồi – lịch dẫn khách – đàm phán – checklist pháp lý. Rõ ràng từng ngày.",
      color: "teal",
      customColor: "",
      link: null,
      linkText: null,
      iconName: "fa-solid fa-chart-gantt",
      iconClass: "w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white",
      padding: "large",
      hoverEffect: true,
      aos: "fade-up",
      aosDelay: "300",
      quickAccessText: "Đăng ký bán ngay",
      quickAccessUrl: "#"
    },
    {
      id: 4,
      title: "Chuẩn hoá hồ sơ pháp lý",
      description: "Kiểm tra và hoàn thiện giấy tờ pháp lý, đảm bảo giao dịch minh bạch, nhanh chóng và an toàn.",
      color: "teal",
      customColor: "",
      link: null,
      linkText: null,
      iconName: "fa-solid fa-file-contract",
      iconClass: "w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white",
      padding: "large",
      hoverEffect: true,
      aos: "fade-up",
      aosDelay: "100",
      quickAccessText: "Đăng ký bán ngay",
      quickAccessUrl: "#"
    },
    {
      id: 5,
      title: "Lọc khách chất lượng",
      description: "Hệ thống sàng lọc và phân loại khách hàng tiềm năng, tập trung vào khách có nhu cầu thực.",
      color: "blue",
      customColor: "",
      link: null,
      linkText: null,
      iconName: "fa-solid fa-filter",
      iconClass: "w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white",
      padding: "large",
      hoverEffect: true,
      aos: "fade-up",
      aosDelay: "200",
      quickAccessText: "Đăng ký bán ngay",
      quickAccessUrl: "#lien-he"
    },
    {
      id: 6,
      title: "Hỗ trợ đàm phán & chốt deal",
      description: "Tư vấn chiến lược đàm phán, hỗ trợ thương lượng và hoàn tất thủ tục chuyển nhượng.",
      color: "purple",
      customColor: "",
      link: null,
      linkText: null,
      iconName: "fa-solid fa-handshake",
      iconClass: "w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white",
      padding: "large",
      hoverEffect: true,
      aos: "fade-up",
      aosDelay: "300",
      quickAccessText: "Đăng ký bán ngay",
      quickAccessUrl: "#"
    }
  ],
  soldProjects: {
    title: "Dự án đã bán thành công",
    description: "Khách hàng tin tưởng – Nhà phố được bán nhanh trong 30 ngày. Dưới đây là các giao dịch tiêu biểu.",
    items: [
      {
        id: 1,
        type: "Nhà phố 4 tầng",
        location: "Quận 2, TP.HCM",
        status: "ĐÃ BÁN",
        price: 14.5,
        saleTime: "28 ngày",
        priceDifference: 8,
        imageUrl: "",
        imageClass: "bg-gradient-to-br from-purple-500/20 to-blue-500/10"
      },
      {
        id: 2,
        type: "Nhà mặt tiền",
        location: "Quận 7, TP.HCM",
        status: "ĐÃ BÁN",
        price: 9.2,
        saleTime: "22 ngày",
        priceDifference: 12,
        imageUrl: "",
        imageClass: "bg-gradient-to-br from-blue-500/20 to-purple-500/10"
      },
      {
        id: 3,
        type: "Nhà phố Shophouse",
        location: "Quận Bình Thạnh",
        status: "ĐÃ BÁN",
        price: "22 tỷ VNĐ",
        saleTime: "30 ngày",
        priceDifference: 5,
        imageUrl: "",
        imageClass: "bg-gradient-to-br from-purple-500/20 to-pink-500/10"
      },
      {
        id: 4,
        type: "Nhà phố cao cấp",
        location: "Thủ Đức, TP.HCM",
        status: "ĐÃ BÁN",
        price: 18.7,
        saleTime: "25 ngày",
        priceDifference: 10,
        imageUrl: "",
        imageClass: "bg-gradient-to-br from-amber-500/20 to-orange-500/10"
      }
    ]
  },
  process: {
    title: "Quy trình chuẩn hoá",
    description: "Từ khảo sát tài sản đến công chứng — mọi bước được quản lý trên hệ thống, giảm rủi ro và tăng tốc chốt.",
    steps: [
      {
        id: 1,
        label: "Bước 1",
        title: "Chuẩn hoá thông tin nhà phố",
        description: "Pháp lý, hiện trạng, ưu điểm vị trí, công năng, lộ giới/hẻm, tiện ích xung quanh."
      },
      {
        id: 2,
        label: "Bước 2",
        title: "Thiết lập chiến dịch bán",
        description: "Mức giá mục tiêu, thông điệp, tệp khách, kịch bản tư vấn & bộ câu hỏi sàng lọc."
      },
      {
        id: 3,
        label: "Bước 3",
        title: "Dẫn khách & cập nhật phản hồi",
        description: "Ghi nhận phản hồi theo từng lượt xem để tối ưu giá/chiến lược và tăng tỷ lệ chốt."
      },
      {
        id: 4,
        label: "Bước 4",
        title: "Đàm phán – đặt cọc – công chứng",
        description: "Checklist giấy tờ rõ ràng, giảm sai sót và đảm bảo an toàn giao dịch."
      }
    ]
  },
  testimonials: {
    title: "Khách hàng nói gì về chúng tôi",
    description: "Hàng trăm chủ nhà đã tin tưởng và bán thành công nhà phố trong 30 ngày.",
    items: [
      {
        id: 1,
        name: "Nguyễn Thị Mai",
        position: "Chủ nhà phố, Q.2",
        quote: "Tôi đã thử bán tự do 6 tháng không được. Nhờ Thiên Hà Group, nhà bán được sau 24 ngày với giá cao hơn dự kiến 10%. Rất chuyên nghiệp!",
        initials: "NM",
        color: "blue",
        customColor: "",
        rating: 5
      },
      {
        id: 2,
        name: "Trần Văn Minh",
        position: "Chủ shophouse, Bình Thạnh",
        quote: "Dịch vụ định giá theo dữ liệu rất chuẩn. Team marketing đa kênh giúp tôi tiếp cận đúng khách thiệt, giảm 90% khách ảo. Highly recommend!",
        initials: "TM",
        color: "purple",
        customColor: "",
        rating: 5
      },
      {
        id: 3,
        name: "Lê Thị Hương",
        position: "Chủ nhà phố, Thủ Đức",
        quote: "Dashboard theo dõi tiến độ real-time giúp tôi yên tâm. Mọi thứ minh bạch, hỗ trợ pháp lý rất tận tình. Cảm ơn Thiên Hà Group!",
        initials: "LT",
        color: "emerald",
        customColor: "",
        rating: 5
      }
    ]
  }
})

// UI State for image previews - THÊM CHO PROJECTS
const projectImageInputs = ref([])
const projectImagePreviews = ref([])
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// Files management (giống component MainContent)
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
const SECTION_ID = 58

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

const handleFileUpload = (file, type, projectIndex) => {
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

    // Update project image URL
    content.soldProjects.items[projectIndex].imageUrl = tempUrl

    // Update preview
    projectImagePreviews.value[projectIndex] = previewUrl

    // Create file DTO
    const fileDTO = {
      id: null,
      filename: `${type}_${Date.now()}_${file.name}`,
      status: 'NEW',
      tempName: tempName,
      mappingTempUrl: tempUrl,
      mappingRealUrl: null,
      effectiveTempUrl: previewUrl,
      realFilenameForSearch: file.name,
      metadata: {
        type: 'project',
        projectIndex: projectIndex,
        projectId: content.soldProjects.items[projectIndex].id
      }
    }

    // Store in uploadedFiles
    uploadedFiles.value.push({
      tempName: tempName,
      file: file,
      previewUrl: previewUrl,
      metadata: { projectIndex }
    })

    // Add to files array
    files.value.push(fileDTO)

    showToast(`Ảnh dự án đã được tải lên thành công`, 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)
  return true
}

const handleRemoveFile = (imageUrl, projectIndex) => {
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
      const fileIndex = files.value.findIndex(f => f.mappingRealUrl === imageUrl || f.filename === imageUrl)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    // Update project image URL
    content.soldProjects.items[projectIndex].imageUrl = ''

    // Clear preview
    projectImagePreviews.value[projectIndex] = null

    showToast('Đã xóa ảnh dự án', 'success')
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

      // Initialize project image previews array
      projectImagePreviews.value = new Array(content.soldProjects.items.length).fill(null)

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
          realFilenameForSearch: file.realFilenameForSearch || file.filename,
          metadata: file.metadata || {}
        }))

        // Set previews for existing project images
        content.soldProjects.items.forEach((project, index) => {
          if (project.imageUrl) {
            const file = files.value.find(f =>
                f.mappingRealUrl === project.imageUrl ||
                f.mappingTempUrl === project.imageUrl ||
                f.filename === project.imageUrl
            )
            if (file && file.effectiveTempUrl) {
              projectImagePreviews.value[index] = file.effectiveTempUrl
            }
          }
        })
      } else {
        files.value = []
      }

      uploadedFiles.value = []

      // Initialize custom colors for services and testimonials
      initializeCustomColors()

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

    // Prepare content data - convert custom colors to proper format
    const contentData = JSON.parse(JSON.stringify(content))

    // Convert service colors
    contentData.services = contentData.services.map(service => {
      const serviceCopy = { ...service }
      if (serviceCopy.color === 'custom' && serviceCopy.customColor) {
        serviceCopy.color = serviceCopy.customColor
      }
      delete serviceCopy.customColor
      return serviceCopy
    })

    // Convert testimonial colors
    contentData.testimonials.items = contentData.testimonials.items.map(testimonial => {
      const testimonialCopy = { ...testimonial }
      if (testimonialCopy.color === 'custom' && testimonialCopy.customColor) {
        testimonialCopy.color = testimonialCopy.customColor
      }
      delete testimonialCopy.customColor
      return testimonialCopy
    })

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Nội dung chính',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 0,
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

      // Update file statuses (giống component MainContent)
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
      projectImagePreviews.value = new Array(content.soldProjects.items.length).fill(null)

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

  // Check all project image URLs
  content.soldProjects.items.forEach((project, index) => {
    if (project.imageUrl === tempUrl) {
      project.imageUrl = realUrl
    }
  })
}

// ========== PROJECT IMAGE UPLOAD HANDLERS ==========
const triggerProjectImageInput = (index) => {
  if (projectImageInputs.value[index]) {
    projectImageInputs.value[index].click()
  }
}

const handleProjectImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, `ProjectImage_${index}`, index)
  }
  event.target.value = ''
}

const handleProjectImageDrop = (event, index) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, `ProjectImage_${index}`, index)
  }
}

const removeProjectImage = (index) => {
  const project = content.soldProjects.items[index]
  if (project && project.imageUrl) {
    handleRemoveFile(project.imageUrl, index)
  }
}

const previewProjectImage = (index) => {
  const project = content.soldProjects.items[index]
  if (project && project.imageUrl) {
    previewImageUrl.value = getImageUrl(project.imageUrl)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
}

const globalColors = ref({});

const loadDataColors = async () => {
  const response = await api.get('/cms/getSection/55')
  const parsedJSON = JSON.parse(response.data.contentJson)
  globalColors.value = parsedJSON.colors || {}
}

// ========== COLOR HANDLING FUNCTIONS ==========
const handleServiceColorChange = (index, event) => {
  const selectedColor = event.target.value
  const service = content.services[index]

  if (selectedColor !== 'custom') {
    service.customColor = ''
  }
}

const handleTestimonialColorChange = (index, event) => {
  const selectedColor = event.target.value
  const testimonial = content.testimonials.items[index]

  if (selectedColor !== 'custom') {
    testimonial.customColor = ''
  }
}

// Hàm khởi tạo customColor từ dữ liệu hiện có
const initializeCustomColors = () => {
  // Định nghĩa danh sách màu hợp lệ
  const serviceColorOptions = ['blue', 'purple', 'teal', 'pink', 'amber', 'orange', 'sky', 'cyan']
  const testimonialColorOptions = ['blue', 'purple', 'emerald', 'indigo', 'pink']

  // Khởi tạo cho services
  content.services.forEach(service => {
    if (!serviceColorOptions.includes(service.color) && service.color !== 'custom') {
      service.customColor = service.color
      service.color = 'custom'
    }

    if (!service.customColor) {
      service.customColor = ''
    }
  })

  // Khởi tạo cho testimonials
  content.testimonials.items.forEach(testimonial => {
    if (!testimonialColorOptions.includes(testimonial.color) && testimonial.color !== 'custom') {
      testimonial.customColor = testimonial.color
      testimonial.color = 'custom'
    }

    if (!testimonial.customColor) {
      testimonial.customColor = ''
    }
  })
}

// ========== HERO TAGS MANAGEMENT ==========
const addTag = () => {
  if (!content.hero.tags) {
    content.hero.tags = []
  }
  content.hero.tags.push("")
  showToast('Đã thêm tag mới', 'success')
}

const removeTag = (index) => {
  if (confirm('Bạn có chắc muốn xóa tag này?')) {
    content.hero.tags.splice(index, 1)
    showToast('Đã xóa tag', 'success')
  }
}

// ========== TIMELINE STEPS MANAGEMENT ==========
const addTimelineStep = () => {
  content.timeline.steps.push({
    id: generateId(),
    number: `${content.timeline.steps.length + 1}`,
    title: "",
    description: ""
  })
  showToast('Đã thêm bước lộ trình', 'success')
}

const removeTimelineStep = (index) => {
  if (confirm('Bạn có chắc muốn xóa bước này?')) {
    content.timeline.steps.splice(index, 1)
    showToast('Đã xóa bước lộ trình', 'success')
  }
}

// ========== SERVICES MANAGEMENT ==========
const addService = () => {
  content.services.push({
    id: generateId(),
    title: "",
    description: "",
    color: "blue",
    customColor: "",
    link: null,
    linkText: null,
    iconName: "fas fa-star",
    iconClass: "w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition duration-300 text-purple-300 group-hover:text-white",
    padding: "large",
    hoverEffect: true,
    aos: "fade-up",
    aosDelay: "0",
    quickAccessText: "Đăng ký bán ngay",
    quickAccessUrl: "#"
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

// ========== PROJECTS MANAGEMENT ==========
const addProject = () => {
  content.soldProjects.items.push({
    id: generateId(),
    type: "",
    location: "",
    status: "ĐÃ BÁN",
    price: "",
    saleTime: "",
    priceDifference: "",
    imageUrl: "",
    imageClass: ""
  })

  // Initialize preview for new project
  projectImagePreviews.value.push(null)

  showToast('Đã thêm dự án mới', 'success')
}

const removeProject = (index) => {
  if (confirm('Bạn có chắc muốn xóa dự án này?')) {
    // Remove associated image file if exists
    const project = content.soldProjects.items[index]
    if (project.imageUrl) {
      handleRemoveFile(project.imageUrl, index)
    }

    content.soldProjects.items.splice(index, 1)
    projectImagePreviews.value.splice(index, 1)

    showToast('Đã xóa dự án', 'success')
  }
}

const moveProjectUp = (index) => {
  if (index > 0) {
    const temp = content.soldProjects.items[index]
    const tempPreview = projectImagePreviews.value[index]

    content.soldProjects.items[index] = content.soldProjects.items[index - 1]
    content.soldProjects.items[index - 1] = temp

    projectImagePreviews.value[index] = projectImagePreviews.value[index - 1]
    projectImagePreviews.value[index - 1] = tempPreview
  }
}

const moveProjectDown = (index) => {
  if (index < content.soldProjects.items.length - 1) {
    const temp = content.soldProjects.items[index]
    const tempPreview = projectImagePreviews.value[index]

    content.soldProjects.items[index] = content.soldProjects.items[index + 1]
    content.soldProjects.items[index + 1] = temp

    projectImagePreviews.value[index] = projectImagePreviews.value[index + 1]
    projectImagePreviews.value[index + 1] = tempPreview
  }
}

// ========== PROCESS STEPS MANAGEMENT ==========
const addProcessStep = () => {
  content.process.steps.push({
    id: generateId(),
    label: `Bước ${content.process.steps.length + 1}`,
    title: "",
    description: ""
  })
  showToast('Đã thêm bước quy trình', 'success')
}

const removeProcessStep = (index) => {
  if (confirm('Bạn có chắc muốn xóa bước này?')) {
    content.process.steps.splice(index, 1)
    showToast('Đã xóa bước quy trình', 'success')
  }
}

// ========== TESTIMONIALS MANAGEMENT ==========
const addTestimonial = () => {
  content.testimonials.items.push({
    id: generateId(),
    name: "",
    position: "",
    quote: "",
    initials: "",
    color: "blue",
    customColor: "",
    rating: 5
  })
  showToast('Đã thêm đánh giá mới', 'success')
}

const removeTestimonial = (index) => {
  if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
    content.testimonials.items.splice(index, 1)
    showToast('Đã xóa đánh giá', 'success')
  }
}

const moveTestimonialUp = (index) => {
  if (index > 0) {
    const temp = content.testimonials.items[index]
    content.testimonials.items[index] = content.testimonials.items[index - 1]
    content.testimonials.items[index - 1] = temp
  }
}

const moveTestimonialDown = (index) => {
  if (index < content.testimonials.items.length - 1) {
    const temp = content.testimonials.items[index]
    content.testimonials.items[index] = content.testimonials.items[index + 1]
    content.testimonials.items[index + 1] = temp
  }
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
  flex-wrap: wrap;
}

.tab-button {
  padding: 12px 20px;
  border: none;
  background: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
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

/* Lists */
.services-list,
.testimonials-list,
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-step-item,
.process-step-item,
.service-item,
.testimonial-item,
.project-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.timeline-step-item:hover,
.process-step-item:hover,
.service-item:hover,
.testimonial-item:hover,
.project-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.step-header,
.service-header,
.testimonial-header,
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.step-header h4,
.service-header h4,
.testimonial-header h4,
.project-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1rem;
}

.service-actions,
.testimonial-actions,
.project-actions {
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

/* File Upload - THÊM VÀO */
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
    padding: 10px 15px;
    font-size: 0.85rem;
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

  .step-header,
  .service-header,
  .testimonial-header,
  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .service-actions,
  .testimonial-actions,
  .project-actions {
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
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}

/* Style cho select */
select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  padding-right: 40px;
  cursor: pointer;
}

select:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

/* Khoảng cách giữa select và ColorInput */
select + .color-input-wrapper {
  margin-top: 10px;
}
</style>