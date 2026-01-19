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
          :class="{ active: activeTab === 'jobs' }"
          @click="activeTab = 'jobs'"
      >
        <i class="fas fa-briefcase"></i> Vị trí tuyển dụng
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'benefits' }"
          @click="activeTab = 'benefits'"
      >
        <i class="fas fa-gift"></i> Lợi ích
      </button>
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
      <!--      <button
                class="tab-button"
                :class="{ active: activeTab === 'form' }"
                @click="activeTab = 'form'"
            >
              <i class="fas fa-file-alt"></i> Form đăng ký
            </button>-->
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Màu sắc & Kiểu dáng -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>
            <div class="color-input-group" v-for="(colorValue, colorKey) in content.style.colors" :key="colorKey">
              <label>{{ colorKey }}</label>
              <ColorInputWithGlobalColors
                  v-model="content.style.colors[colorKey]"
                  :placeholder="colorValue"
                  return-type="key"
                  :colors="globalColors"
              />
            </div>
          </div>

          <!-- Gradients -->
          <div class="setting-section">
            <h3><i class="fas fa-gradient"></i> Gradients</h3>

            <!-- Primary Gradient -->
            <div class="form-group">
              <label>Primary Gradient</label>
              <div class="gradient-input-group">
                <div class="color-inputs">
                  <div class="color-input">
                    <label>Màu bắt đầu</label>
                    <input
                        type="color"
                        :value="getGradientStartColor('primary')"
                        @change="updateGradientColor('primary', 'start', $event)"
                    />
                    <span class="color-hex">{{ getGradientStartColor('primary') }}</span>
                  </div>
                  <div class="color-input">
                    <label>Màu kết thúc</label>
                    <input
                        type="color"
                        :value="getGradientEndColor('primary')"
                        @change="updateGradientColor('primary', 'end', $event)"
                    />
                    <span class="color-hex">{{ getGradientEndColor('primary') }}</span>
                  </div>
                </div>
                <div class="gradient-preview" :style="`background: ${content.style.gradients.primary}`"></div>
              </div>
            </div>

            <!-- Hero Gradient -->
<!--            <div class="form-group">
              <label>Hero Gradient</label>
              <div class="gradient-input-group">
                <div class="color-inputs">
                  <div class="color-input">
                    <label>Màu bắt đầu</label>
                    <input
                        type="color"
                        :value="getGradientStartColor('hero')"
                        @change="updateGradientColor('hero', 'start', $event)"
                    />
                    <span class="color-hex">{{ getGradientStartColor('hero') }}</span>
                  </div>
                  <div class="color-input">
                    <label>Màu kết thúc</label>
                    <input
                        type="color"
                        :value="getGradientEndColor('hero')"
                        @change="updateGradientColor('hero', 'end', $event)"
                    />
                    <span class="color-hex">{{ getGradientEndColor('hero') }}</span>
                  </div>
                </div>
                <div class="gradient-preview" :style="`background: ${content.style.gradients.hero}`"></div>
              </div>
            </div>-->

            <!-- Earnings Badge Gradient -->
            <div class="form-group">
              <label>Earnings Badge Gradient</label>
              <div class="gradient-input-group">
                <div class="color-inputs">
                  <div class="color-input">
                    <label>Màu 1</label>
                    <input
                        type="color"
                        :value="getGradientColorByIndex('earningsBadge', 0)"
                        @change="updateGradientColorByIndex('earningsBadge', 0, $event)"
                    />
                    <span class="color-hex">{{ getGradientColorByIndex('earningsBadge', 0) }}</span>
                  </div>
                  <div class="color-input">
                    <label>Màu 2</label>
                    <input
                        type="color"
                        :value="getGradientColorByIndex('earningsBadge', 1)"
                        @change="updateGradientColorByIndex('earningsBadge', 1, $event)"
                    />
                    <span class="color-hex">{{ getGradientColorByIndex('earningsBadge', 1) }}</span>
                  </div>
                  <div class="color-input">
                    <label>Màu 3</label>
                    <input
                        type="color"
                        :value="getGradientColorByIndex('earningsBadge', 2)"
                        @change="updateGradientColorByIndex('earningsBadge', 2, $event)"
                    />
                    <span class="color-hex">{{ getGradientColorByIndex('earningsBadge', 2) }}</span>
                  </div>
                </div>
                <div class="gradient-preview" :style="`background: ${content.style.gradients.earningsBadge}`"></div>
              </div>
            </div>

            <!-- Form Background Gradient -->
<!--            <div class="form-group">
              <label>Form Background Gradient</label>
              <div class="gradient-input-group">
                <div class="color-inputs">
                  <div class="color-input">
                    <label>Màu bắt đầu</label>
                    <input
                        type="color"
                        :value="getGradientStartColor('formBg')"
                        @change="updateGradientColor('formBg', 'start', $event)"
                    />
                    <span class="color-hex">{{ getGradientStartColor('formBg') }}</span>
                  </div>
                  <div class="color-input">
                    <label>Màu kết thúc</label>
                    <input
                        type="color"
                        :value="getGradientEndColor('formBg')"
                        @change="updateGradientColor('formBg', 'end', $event)"
                    />
                    <span class="color-hex">{{ getGradientEndColor('formBg') }}</span>
                  </div>
                </div>
                <div class="gradient-preview" :style="`background: ${content.style.gradients.formBg}`"></div>
              </div>
            </div>-->
          </div>

          <!-- Shadows & Border Radius -->
          <div class="setting-section">
            <h3><i class="fas fa-shadow"></i> Shadows & Border Radius</h3>

            <div class="form-group">
              <label>Shadow Glow</label>
              <input
                  type="text"
                  v-model="content.style.shadows.glow"
                  placeholder="0 10px 25px rgba(59, 130, 246, 0.3)"
              />
            </div>

            <div class="form-group">
              <label>Card Hover Shadow</label>
              <input
                  type="text"
                  v-model="content.style.shadows.cardHover"
                  placeholder="0 20px 40px rgba(0, 0, 0, 0.4)"
              />
            </div>

            <div class="form-group">
              <label>Border Radius Small</label>
              <input
                  type="text"
                  v-model="content.style.borderRadius.small"
                  placeholder="8px"
              />
            </div>

            <div class="form-group">
              <label>Border Radius Medium</label>
              <input
                  type="text"
                  v-model="content.style.borderRadius.medium"
                  placeholder="12px"
              />
            </div>

            <div class="form-group">
              <label>Border Radius Large</label>
              <input
                  type="text"
                  v-model="content.style.borderRadius.large"
                  placeholder="16px"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Hero Section -->
      <div v-if="activeTab === 'hero'" class="hero-settings">
        <div class="settings-grid">
          <!-- Thông tin công ty -->
          <div class="setting-section">
            <h3><i class="fas fa-building"></i> Thông tin công ty</h3>

            <div class="form-group">
              <label for="companyName">Tên công ty</label>
              <input
                  type="text"
                  id="companyName"
                  v-model="content.company.name"
                  placeholder="Thiên Hà Group"
              />
            </div>

            <div class="form-group">
              <label for="companyEmail">Email</label>
              <input
                  type="email"
                  id="companyEmail"
                  v-model="content.company.email"
                  placeholder="thienhagroup@gmail.com"
              />
            </div>

            <div class="form-group">
              <label for="companyPhone">Điện thoại</label>
              <input
                  type="text"
                  id="companyPhone"
                  v-model="content.company.phone"
                  placeholder="091.123.1882"
              />
            </div>
          </div>

          <!-- Nội dung Hero -->
          <div class="setting-section">
            <h3><i class="fas fa-star"></i> Nội dung Hero</h3>

            <div class="form-group">
              <label>Tiêu đề dòng 1</label>
              <input
                  type="text"
                  v-model="content.hero.title.line1"
                  placeholder="Cơ Hội Việc Làm"
              />
            </div>

            <div class="form-group">
              <label>Tiêu đề dòng 2</label>
              <input
                  type="text"
                  v-model="content.hero.title.line2"
                  placeholder="Linh Hoạt 1-2 Tiếng/Lần"
              />
            </div>

            <div class="form-group">
              <label>Mô tả</label>
              <textarea
                  v-model="content.hero.description"
                  rows="4"
                  placeholder="đang tuyển Cộng Tác Viên bất động sản trên toàn quốc..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Badge tuyển dụng</label>
              <input
                  type="text"
                  v-model="content.hero.recruitmentBadge"
                  placeholder="ĐANG TUYỂN CỘNG TÁC VIÊN"
              />
            </div>
          </div>

          <!-- Thu nhập -->
          <div class="setting-section">
            <h3><i class="fas fa-money-bill-wave"></i> Thu nhập</h3>

            <div class="form-group">
              <label>Badge thu nhập</label>
              <input
                  type="text"
                  v-model="content.hero.earnings.badge"
                  placeholder="THU NHẬP HẤP DẪN"
              />
            </div>

            <div class="form-group">
              <label>Khoảng thu nhập</label>
              <input
                  type="text"
                  v-model="content.hero.earnings.range"
                  placeholder="200K - 500K"
              />
            </div>

            <div class="form-group">
              <label>Đơn vị thu nhập</label>
              <input
                  type="text"
                  v-model="content.hero.earnings.unit"
                  placeholder="Mỗi nhiệm vụ hoàn thành"
              />
            </div>

            <div class="form-group">
              <label>Bonus 1</label>
              <input
                  type="text"
                  v-model="content.hero.earnings.bonuses[0].text"
                  placeholder="+ Thưởng hiệu suất"
              />
            </div>

            <div class="form-group">
              <label>Bonus 2</label>
              <input
                  type="text"
                  v-model="content.hero.earnings.bonuses[1].text"
                  placeholder="+ Hoa hồng theo giao dịch"
              />
            </div>
          </div>

          <!-- Nút bấm Hero -->
          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm</h3>

            <div class="form-group">
              <label>Nút Đăng ký</label>
              <input type="text" v-model="content.hero.buttons.apply" placeholder="Đăng Ký Ngay"/>
            </div>

            <div class="form-group">
              <label>Nút Xem vị trí</label>
              <input type="text" v-model="content.hero.buttons.viewJobs" placeholder="Xem Vị Trí Tuyển Dụng"/>
            </div>
          </div>

          <!-- Đặc điểm nổi bật -->
          <div class="setting-section">
            <h3><i class="fas fa-check-circle"></i> Đặc điểm nổi bật</h3>

            <div v-for="(feature, index) in content.hero.features" :key="index" class="feature-item">
              <div class="form-row">
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="feature.iconClass"/>
                  </div>
                </div>
                <div class="form-group">
                  <label>Nền biểu tượng</label>
                  <input type="text" v-model="feature.iconBgClass" placeholder="bg-blue-500/10 p-2 rounded-lg mr-3"/>
                </div>
              </div>
              <div class="form-group">
                <label>Nội dung</label>
                <input type="text" v-model="feature.text" placeholder="Linh hoạt thời gian"/>
              </div>
            </div>
          </div>

          <!-- Ảnh Hero -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Ảnh Hero</h3>

            <div class="form-group">
              <div class="label" style="display: flex; justify-content: space-between">
                <label>URL ảnh Hero</label>
                <button class="btn-icon btn-preview-action" @click="previewHeroImage" title="Xem trước"
                        v-if="content.hero.image.url">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerHeroImageInput" @dragover.prevent
                     @drop.prevent="handleHeroImageDrop">
                  <input
                      type="file"
                      ref="heroImageInput"
                      @change="handleHeroImageUpload"
                      accept="image/*"
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                  <p class="file-hint">Kích thước đề xuất: 1200x800px</p>
                </div>

                <div v-if="heroImagePreview || content.hero.image.url" class="upload-preview">
                  <img :src="getImageUrl(content.hero.image.url)" alt="Hero Image Preview"/>
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewHeroImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeHeroImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!heroImagePreview && !content.hero.image.url" class="form-group">
                <label for="hero-image-url">Hoặc nhập URL ảnh</label>
                <input
                    type="text"
                    id="hero-image-url"
                    v-model="content.hero.image.url"
                    placeholder="https://example.com/hero.jpg"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Alt text cho ảnh</label>
              <input
                  type="text"
                  v-model="content.hero.image.alt"
                  placeholder="Cộng tác viên bất động sản"
              />
            </div>
          </div>

          <!-- Thống kê Hero -->
          <div class="setting-section">
            <h3><i class="fas fa-chart-bar"></i> Thống kê Hero</h3>

            <div class="form-group">
              <label>Overlay stats</label>
              <input
                  type="text"
                  v-model="content.hero.overlay.stats"
                  placeholder="Hơn 5,000 CTV đang hợp tác"
              />
            </div>

            <div class="form-group">
              <label>Overlay title</label>
              <input
                  type="text"
                  v-model="content.hero.overlay.title"
                  placeholder="Gia nhập đội ngũ CTV hàng đầu Việt Nam"
              />
            </div>

            <div v-for="(stat, index) in content.hero.stats" :key="index" class="stat-item">
              <h4>Thống kê #{{ index + 1 }}</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <input type="text" v-model="stat.icon" placeholder="fas fa-user-plus"/>
                </div>
                <div class="form-group">
                  <label>Class biểu tượng</label>
                  <input type="text" v-model="stat.iconClass" placeholder="stats-icon bg-blue-500/10 text-blue-400"/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Giá trị</label>
                  <input type="text" v-model="stat.value" placeholder="1,200+"/>
                </div>
                <div class="form-group">
                  <label>Nhãn</label>
                  <input type="text" v-model="stat.label" placeholder="CTV mới mỗi tháng"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Vị trí tuyển dụng -->
      <div v-if="activeTab === 'jobs'" class="jobs-settings">
        <div class="settings-grid">
          <!-- Tiêu đề section -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề section</h3>

            <div class="form-group">
              <label>Phụ đề</label>
              <input
                  type="text"
                  v-model="content.jobs.section.subtitle"
                  placeholder="Vị Trí Tuyển Dụng"
              />
            </div>

            <div class="form-group">
              <label>Tiêu đề dòng 1</label>
              <input
                  type="text"
                  v-model="content.jobs.section.title.line1"
                  placeholder="Các Công Việc"
              />
            </div>

            <div class="form-group">
              <label>Tiêu đề dòng 2</label>
              <input
                  type="text"
                  v-model="content.jobs.section.title.line2"
                  placeholder="CTV Đang Cần Tuyển"
              />
            </div>

            <div class="form-group">
              <label>Mô tả</label>
              <textarea
                  v-model="content.jobs.section.description"
                  rows="3"
                  placeholder="Thiên Hà Group cần tuyển hàng trăm CTV..."
              ></textarea>
            </div>
          </div>

          <!-- Danh sách công việc -->
          <div class="setting-section">
            <div class="section-header">
              <h3><i class="fas fa-briefcase"></i> Danh sách công việc</h3>
              <button class="btn btn-primary" @click="addJob">
                <i class="fas fa-plus"></i> Thêm công việc
              </button>
            </div>

            <div class="jobs-list">
              <div v-for="(job, index) in content.jobs.list" :key="job.id" class="job-item">
                <div class="job-header">
                  <h4>Công việc #{{ index + 1 }} - {{ job.title || 'Chưa có tiêu đề' }}</h4>
                  <div class="job-actions">
                    <button class="btn-icon" @click="moveJobUp(index)" :disabled="index === 0">
                      <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="btn-icon" @click="moveJobDown(index)"
                            :disabled="index === content.jobs.list.length - 1">
                      <i class="fas fa-arrow-down"></i>
                    </button>
                    <button class="btn-icon btn-danger" @click="removeJob(index)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label>Tiêu đề</label>
                  <input type="text" v-model="job.title" placeholder="CTV Chụp Ảnh BĐS"/>
                </div>

                <div class="">
                  <div class="form-group">
                    <label>Biểu tượng</label>
                    <div class="input-with-icon">
                      <IconPicker v-model="job.icon"/>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Màu sắc</label>
                    <ColorInputWithGlobalColors
                        v-model="job.color"
                        placeholder="#60a5fa"
                        return-type="value"
                        :colors="globalColors"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Giá</label>
                    <input type="text" v-model="job.price" placeholder="300K"/>
                  </div>
                  <div class="form-group">
                    <label>Đơn vị</label>
                    <input type="text" v-model="job.unit" placeholder="/tài sản"/>
                  </div>
                </div>

                <div class="form-group">
                  <label>Mô tả</label>
                  <textarea v-model="job.description" rows="3"
                            placeholder="Chụp ảnh bất động sản theo yêu cầu..."></textarea>
                </div>

                <div class="form-group">
                  <label>Tags (cách nhau bằng dấu phẩy)</label>
                  <input type="text" v-model="job.tagsString" placeholder="Làm tại nhà, 1-2 tiếng/lần, Không yêu cầu kinh nghiệm"/>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Liên kết</label>
                    <input type="text" v-model="job.link" placeholder="#"/>
                  </div>
                  <div class="form-group">
                    <label>Văn bản liên kết</label>
                    <input type="text" v-model="job.linkText" placeholder="Xem chi tiết"/>
                  </div>
                </div>
              </div>

              <div v-if="content.jobs.list.length === 0" class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Chưa có công việc nào. Hãy thêm công việc đầu tiên!</p>
              </div>
            </div>

            <div class="form-group">
              <label>Nút đăng ký</label>
              <input type="text" v-model="content.jobs.applyButton" placeholder="Đăng Ký Ngay!"/>
            </div>

            <div class="form-group">
              <label>Ghi chú footer</label>
              <input type="text" v-model="content.jobs.footerNote"
                     placeholder="*Nhận ngay để nhận phản hồi nhanh nhất từ Thiên Hà Group"/>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Lợi ích -->
      <div v-if="activeTab === 'benefits'" class="benefits-settings">
        <div class="settings-grid">
          <!-- Tiêu đề section -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề section</h3>

            <div class="form-group">
              <label>Phụ đề</label>
              <input
                  type="text"
                  v-model="content.benefits.section.subtitle"
                  placeholder="Lợi Ích Khi Làm CTV"
              />
            </div>

            <div class="form-group">
              <label>Tiêu đề dòng 1</label>
              <input
                  type="text"
                  v-model="content.benefits.section.title.line1"
                  placeholder="Tại Sao Nên Làm Cộng Tác Viên Tại"
              />
            </div>

            <div class="form-group">
              <label>Tiêu đề dòng 2</label>
              <input
                  type="text"
                  v-model="content.benefits.section.title.line2"
                  placeholder="Thiên Hà Group?"
              />
            </div>
          </div>

          <!-- Danh sách lợi ích -->
          <div class="setting-section">
            <div class="section-header">
              <h3><i class="fas fa-gift"></i> Danh sách lợi ích</h3>
              <button class="btn btn-primary" @click="addBenefit">
                <i class="fas fa-plus"></i> Thêm lợi ích
              </button>
            </div>

            <div class="benefits-list">
              <div v-for="(benefit, index) in content.benefits.list" :key="index" class="benefit-item">
                <div class="benefit-header">
                  <h4>Lợi ích #{{ index + 1 }} - {{ benefit.title || 'Chưa có tiêu đề' }}</h4>
                  <div class="benefit-actions">
                    <button class="btn-icon" @click="moveBenefitUp(index)" :disabled="index === 0">
                      <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="btn-icon" @click="moveBenefitDown(index)"
                            :disabled="index === content.benefits.list.length - 1">
                      <i class="fas fa-arrow-down"></i>
                    </button>
                    <button class="btn-icon btn-danger" @click="removeBenefit(index)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label>Tiêu đề</label>
                  <input type="text" v-model="benefit.title" placeholder="Thu Nhập Hấp Dẫn"/>
                </div>

                <div class="">
                  <div class="form-group">
                    <label>Biểu tượng</label>
                    <div class="input-with-icon">
                      <IconPicker v-model="benefit.iconName"/>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Màu sắc</label>
                    <select v-model="benefit.color" class="color-select" @change="handleBenefitColorChange(benefit)">
                      <option v-for="color in serviceColors" :value="color">{{ color }}</option>
                      <option value="custom">Tùy chỉnh</option>
                    </select>
                    <ColorInputWithGlobalColors
                        v-if="benefit.color === 'custom'"
                        v-model="benefit.customColor"
                        placeholder="Nhập mã màu tùy chỉnh"
                        return-type="value"
                        :colors="globalColors"
                        class="mt-2"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Mô tả</label>
                  <textarea v-model="benefit.description" rows="3"
                            placeholder="200K - 500K cho mỗi nhiệm vụ hoàn thành..."></textarea>
                </div>

                <div class="form-group">
                  <label>Animation Delay (ms)</label>
                  <input type="number" v-model="benefit.aosDelay" placeholder="100"/>
                </div>
              </div>

              <div v-if="content.benefits.list.length === 0" class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Chưa có lợi ích nào. Hãy thêm lợi ích đầu tiên!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Quy trình -->
      <div v-if="activeTab === 'process'" class="process-settings">
        <div class="settings-grid">
          <!-- Tiêu đề section -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề section</h3>

            <div class="form-group">
              <label>Tiêu đề</label>
              <input
                  type="text"
                  v-model="content.process.title"
                  placeholder="Quy Trình Làm Việc Của CTV"
              />
            </div>

            <div class="form-group">
              <label>Nút bắt đầu</label>
              <input
                  type="text"
                  v-model="content.process.startButton"
                  placeholder="Bắt Đầu Ngay Từ Bước 1"
              />
            </div>

            <div class="form-group">
              <label>Ghi chú footer</label>
              <input
                  type="text"
                  v-model="content.process.footerNote"
                  placeholder="Hoàn thành 4 bước đơn giản để bắt đầu kiếm thu nhập ngay hôm nay"
              />
            </div>
          </div>

          <!-- Các bước quy trình -->
          <div class="setting-section">
            <div class="section-header">
              <h3><i class="fas fa-list-ol"></i> Các bước quy trình</h3>
              <button class="btn btn-primary" @click="addProcessStep">
                <i class="fas fa-plus"></i> Thêm bước
              </button>
            </div>

            <div class="process-steps">
              <div v-for="(step, index) in content.process.steps" :key="index" class="process-step">
                <div class="step-header">
                  <h4>Bước #{{ index + 1 }} - {{ step.title || 'Chưa có tiêu đề' }}</h4>
                  <div class="step-actions">
                    <button class="btn-icon" @click="moveStepUp(index)" :disabled="index === 0">
                      <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="btn-icon" @click="moveStepDown(index)"
                            :disabled="index === content.process.steps.length - 1">
                      <i class="fas fa-arrow-down"></i>
                    </button>
                    <button class="btn-icon btn-danger" @click="removeProcessStep(index)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label>Tiêu đề</label>
                  <input type="text" v-model="step.title" placeholder="Đăng Ký & Đào Tạo"/>
                </div>

                <div class="form-group">
                  <label>Badge text</label>
                  <input type="text" v-model="step.badgeText" placeholder="Bắt đầu"/>
                </div>

                <div class="form-group">
                  <label>Badge class</label>
                  <input type="text" v-model="step.badgeClass"
                         placeholder="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full"/>
                </div>

                <div class="form-group">
                  <label>Mô tả</label>
                  <textarea v-model="step.description" rows="4"
                            placeholder="Đăng ký online chỉ trong 5 phút..."></textarea>
                </div>

                <div class="form-group">
                  <label>Tags (cách nhau bằng dấu phẩy)</label>
                  <input type="text" v-model="step.tagsString"
                         placeholder="Đăng ký online, Đào tạo miễn phí, Hỗ trợ 1:1"/>
                </div>
              </div>

              <div v-if="content.process.steps.length === 0" class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Chưa có bước nào. Hãy thêm bước đầu tiên!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Đánh giá -->
      <div v-if="activeTab === 'testimonials'" class="testimonials-settings">
        <div class="settings-grid">
          <!-- Tiêu đề section -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề section</h3>

            <div class="form-group">
              <label>Phụ đề</label>
              <input
                  type="text"
                  v-model="content.testimonials.section.subtitle"
                  placeholder="Trải Nghiệm Thực Tế"
              />
            </div>

            <div class="form-group">
              <label>Tiêu đề dòng 1</label>
              <input
                  type="text"
                  v-model="content.testimonials.section.title.line1"
                  placeholder="CTV Nói Gì Về"
              />
            </div>

            <div class="form-group">
              <label>Tiêu đề dòng 2</label>
              <input
                  type="text"
                  v-model="content.testimonials.section.title.line2"
                  placeholder="Thiên Hà Group?"
              />
            </div>
          </div>

          <!-- Danh sách đánh giá -->
          <div class="setting-section">
            <div class="section-header">
              <h3><i class="fas fa-comments"></i> Danh sách đánh giá</h3>
              <button class="btn btn-primary" @click="addTestimonial">
                <i class="fas fa-plus"></i> Thêm đánh giá
              </button>
            </div>

            <div class="testimonials-list">
              <div v-for="(testimonial, index) in content.testimonials.list" :key="testimonial.id" class="testimonial-item">
                <div class="testimonial-header">
                  <h4>Đánh giá #{{ index + 1 }} - {{ testimonial.name || 'Chưa có tên' }}</h4>
                  <div class="testimonial-actions">
                    <button class="btn-icon" @click="moveTestimonialUp(index)" :disabled="index === 0">
                      <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="btn-icon" @click="moveTestimonialDown(index)"
                            :disabled="index === content.testimonials.list.length - 1">
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
                    <input type="text" v-model="testimonial.name" placeholder="Nguyễn Thị Hương"/>
                  </div>
                  <div class="form-group">
                    <label>Vị trí</label>
                    <input type="text" v-model="testimonial.position" placeholder="Sinh viên - CTV 8 tháng"/>
                  </div>
                </div>

                <div class="form-group">
                  <label>Trích dẫn</label>
                  <textarea v-model="testimonial.quote" rows="3"
                            placeholder="Mình là sinh viên, làm CTV chụp ảnh BĐS được 8 tháng..."></textarea>
                </div>

                <div class="">
                  <div class="form-group">
                    <label>Chữ viết tắt</label>
                    <input type="text" v-model="testimonial.initials" placeholder="NH"/>
                  </div>
                  <div class="form-group">
                    <label>Màu sắc</label>
                    <select v-model="testimonial.color" class="color-select" @change="handleTestimonialColorChange(testimonial)">
                      <option v-for="color in testimonialColors" :value="color">{{ color }}</option>
                      <option value="custom">Tùy chỉnh</option>
                    </select>
                    <ColorInputWithGlobalColors
                        v-if="testimonial.color === 'custom'"
                        v-model="testimonial.customColor"
                        placeholder="Nhập mã màu tùy chỉnh"
                        return-type="value"
                        :colors="globalColors"
                        class="mt-2"
                    />
                  </div>
                  <div class="form-group">
                    <label>Đánh giá (sao)</label>
                    <input type="number" v-model="testimonial.rating" min="1" max="5" placeholder="5"/>
                  </div>
                </div>
              </div>

              <div v-if="content.testimonials.list.length === 0" class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Chưa có đánh giá nào. Hãy thêm đánh giá đầu tiên!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Form đăng ký -->
      <div v-if="activeTab === 'form'" class="form-settings">
        <div class="settings-grid">
          <!-- Thông tin form -->
          <div class="setting-section">
            <h3><i class="fas fa-info-circle"></i> Thông tin form</h3>

            <div class="form-group">
              <label>Tiêu đề form</label>
              <input
                  type="text"
                  v-model="content.form.title"
                  placeholder="Đăng Ký Làm Cộng Tác Viên Ngay"
              />
            </div>

            <div class="form-group">
              <label>Mô tả form</label>
              <textarea
                  v-model="content.form.description"
                  rows="3"
                  placeholder="Điền thông tin đăng ký để nhận tư vấn chi tiết..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Tiêu đề phần thông tin</label>
              <input
                  type="text"
                  v-model="content.form.sections.info.title"
                  placeholder="Thông Tin Đăng Ký"
              />
            </div>

            <div class="form-group">
              <label>Tiêu đề phần hỗ trợ</label>
              <input
                  type="text"
                  v-model="content.form.sections.support.title"
                  placeholder="Hỗ Trợ & Tư Vấn"
              />
            </div>

            <div class="form-group">
              <label>Nhãn thời gian làm việc</label>
              <input
                  type="text"
                  v-model="content.form.timeLabel"
                  placeholder="Thời gian có thể làm việc *"
              />
            </div>

            <div class="form-group">
              <label>Nút gửi</label>
              <input
                  type="text"
                  v-model="content.form.submitButton"
                  placeholder="Gửi Đăng Ký Ngay"
              />
            </div>

            <div class="form-group">
              <label>Văn bản điều khoản</label>
              <input
                  type="text"
                  v-model="content.form.terms.text"
                  placeholder="Bằng việc đăng ký, bạn đồng ý với"
              />
            </div>

            <div class="form-group">
              <label>Liên kết điều khoản</label>
              <input
                  type="text"
                  v-model="content.form.terms.linkText"
                  placeholder="Điều khoản & Chính sách"
              />
            </div>
          </div>

          <!-- Lưu ý quan trọng -->
          <div class="setting-section">
            <h3><i class="fas fa-exclamation-circle"></i> Lưu ý quan trọng</h3>

            <div class="form-group">
              <label>Tiêu đề lưu ý</label>
              <input
                  type="text"
                  v-model="content.form.notes.title"
                  placeholder="Lưu ý quan trọng"
              />
            </div>

            <div v-for="(note, index) in content.form.notes.list" :key="index" class="note-item">
              <div class="form-row">
                <div class="form-group" style="flex: 1">
                  <label>Lưu ý #{{ index + 1 }}</label>
                  <input type="text" v-model="content.form.notes.list[index]"
                         placeholder="Không yêu cầu kinh nghiệm, đào tạo từ đầu"/>
                </div>
                <div class="form-group" style="width: 60px; margin-top: 25px">
                  <button class="btn-icon btn-danger" @click="removeFormNote(index)" :disabled="content.form.notes.list.length <= 1">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary" @click="addFormNote">
              <i class="fas fa-plus"></i> Thêm lưu ý
            </button>
          </div>

          <!-- Thời gian làm việc -->
          <div class="setting-section">
            <h3><i class="fas fa-clock"></i> Thời gian làm việc</h3>

            <div v-for="(workTime, index) in content.form.workTimes" :key="workTime.id" class="work-time-item">
              <div class="form-row">
                <div class="form-group" style="flex: 1">
                  <label>ID</label>
                  <input type="text" v-model="workTime.id" placeholder="weekday"/>
                </div>
                <div class="form-group" style="flex: 2">
                  <label>Nhãn</label>
                  <input type="text" v-model="workTime.label" placeholder="Ngày thường"/>
                </div>
                <div class="form-group" style="width: 60px; margin-top: 25px">
                  <button class="btn-icon btn-danger" @click="removeWorkTime(index)" :disabled="content.form.workTimes.length <= 1">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary" @click="addWorkTime">
              <i class="fas fa-plus"></i> Thêm thời gian
            </button>
          </div>

          <!-- Thông tin liên hệ -->
          <div class="setting-section">
            <h3><i class="fas fa-phone-alt"></i> Thông tin liên hệ</h3>

            <div v-for="(contact, index) in content.form.contact" :key="index" class="contact-item">
              <h4>Liên hệ #{{ index + 1 }}</h4>

              <div class="form-group">
                <label>Loại</label>
                <input type="text" v-model="contact.type" placeholder="phone"/>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="contact.title" placeholder="Hotline Tuyển Dụng"/>
              </div>

              <div class="form-group">
                <label>Giá trị</label>
                <input type="text" v-model="contact.value" placeholder="091.123.1882"/>
              </div>

              <div class="form-group">
                <label>Ghi chú (nếu có)</label>
                <input type="text" v-model="contact.note" placeholder="(Phản hồi trong 2h)"/>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <input type="text" v-model="contact.iconClass" placeholder="fas fa-phone-alt text-blue-400"/>
                </div>
                <div class="form-group">
                  <label>Nền biểu tượng</label>
                  <input type="text" v-model="contact.iconBgClass" placeholder="bg-blue-500/10 p-3 rounded-lg mr-4"/>
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
import {ref, reactive, onMounted, watch, computed} from 'vue'
import api from '../../../../api/api.js'
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
import ColorInputWithGlobalColors from "../homeNew/ColorInputWithGlobalColors.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('styles')
const isLoading = ref(false)

// Color options
const serviceColors = ['blue', 'purple', 'teal', 'pink', 'amber', 'orange', 'sky', 'cyan', 'emerald', 'indigo']
const testimonialColors = ['blue', 'purple', 'emerald', 'indigo', 'pink']

// Content structure based on new JSON data
const content = reactive({
  company: {
    name: "Thiên Hà Group",
    email: "thienhagroup@gmail.com",
    phone: "091.123.1882"
  },
  hero: {
    title: {
      line1: "Cơ Hội Việc Làm",
      line2: "Linh Hoạt 1-2 Tiếng/Lần"
    },
    description: "đang tuyển Cộng Tác Viên bất động sản trên toàn quốc. Bạn có thể làm việc linh hoạt chỉ với 1-2 tiếng mỗi lần, không yêu cầu kinh nghiệm, thu nhập hấp dẫn từ 200K - 500K cho mỗi nhiệm vụ hoàn thành.",
    earnings: {
      badge: "THU NHẬP HẤP DẪN",
      range: "200K - 500K",
      unit: "Mỗi nhiệm vụ hoàn thành",
      bonuses: [
        {
          text: "+ Thưởng hiệu suất",
          class: "text-lg text-emerald-400 font-semibold"
        },
        {
          text: "+ Hoa hồng theo giao dịch",
          class: "text-lg text-purple-400 font-semibold"
        }
      ]
    },
    buttons: {
      apply: "Đăng Ký Ngay",
      viewJobs: "Xem Vị Trí Tuyển Dụng"
    },
    features: [
      {
        iconClass: "fas fa-clock text-blue-400",
        iconBgClass: "bg-blue-500/10 p-2 rounded-lg mr-3",
        text: "Linh hoạt thời gian"
      },
      {
        iconClass: "fas fa-map-marker-alt text-purple-400",
        iconBgClass: "bg-purple-500/10 p-2 rounded-lg mr-3",
        text: "Làm việc tại nhà"
      },
      {
        iconClass: "fas fa-graduation-cap text-emerald-400",
        iconBgClass: "bg-emerald-500/10 p-2 rounded-lg mr-3",
        text: "Không yêu cầu kinh nghiệm"
      },
      {
        iconClass: "fas fa-money-bill-wave text-blue-400",
        iconBgClass: "bg-blue-500/10 p-2 rounded-lg mr-3",
        text: "Thanh toán nhanh 24h"
      }
    ],
    image: {
      url: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      alt: "Cộng tác viên bất động sản"
    },
    overlay: {
      stats: "Hơn 5,000 CTV đang hợp tác",
      title: "Gia nhập đội ngũ CTV hàng đầu Việt Nam"
    },
    stats: [
      {
        icon: "fas fa-user-plus",
        iconClass: "stats-icon bg-blue-500/10 text-blue-400",
        value: "1,200+",
        label: "CTV mới mỗi tháng"
      },
      {
        icon: "fas fa-money-check-alt",
        iconClass: "stats-icon bg-purple-500/10 text-purple-400",
        value: "8.2 tỷ",
        label: "Thanh toán cho CTV/năm"
      }
    ],
    recruitmentBadge: "ĐANG TUYỂN CỘNG TÁC VIÊN"
  },
  jobs: {
    section: {
      subtitle: "Vị Trí Tuyển Dụng",
      title: {
        line1: "Các Công Việc",
        line2: "CTV Đang Cần Tuyển"
      },
      description: "Thiên Hà Group cần tuyển hàng trăm CTV cho các vị trí khác nhau tại 63 tỉnh thành. Bạn có thể lựa chọn công việc phù hợp với thời gian và kỹ năng của mình."
    },
    list: [
      {
        id: 1,
        icon: "fas fa-camera",
        color: "#60a5fa",
        title: "CTV Chụp Ảnh BĐS",
        price: "300K",
        unit: "/tài sản",
        description: "Chụp ảnh bất động sản theo yêu cầu (căn hộ, nhà phố, đất nền). Chỉ cần smartphone chất lượng tốt, không cần máy ảnh chuyên nghiệp.",
        tags: [
          "Làm tại nhà",
          "1-2 tiếng/lần",
          "Không yêu cầu kinh nghiệm"
        ],
        link: "#",
        linkText: "Xem chi tiết"
      }
    ],
    applyButton: "Đăng Ký Ngay!",
    footerNote: "*Nhận ngay để nhận phản hồi nhanh nhất từ Thiên Hà Group"
  },
  benefits: {
    section: {
      subtitle: "Lợi Ích Khi Làm CTV",
      title: {
        line1: "Tại Sao Nên Làm Cộng Tác Viên Tại",
        line2: "Thiên Hà Group?"
      }
    },
    list: [
      {
        title: "Thu Nhập Hấp Dẫn",
        iconName: "fas fa-money-bill-wave",
        color: "blue",
        aosDelay: 100,
        description: "200K - 500K cho mỗi nhiệm vụ hoàn thành. Thanh toán nhanh trong 24h qua ví điện tử hoặc tài khoản ngân hàng."
      }
    ]
  },
  process: {
    title: "Quy Trình Làm Việc Của CTV",
    steps: [
      {
        title: "Đăng Ký & Đào Tạo",
        badgeText: "Bắt đầu",
        badgeClass: "text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full",
        description: "Đăng ký online chỉ trong 5 phút. Sau đó, tham gia khóa đào tạo miễn phí 2 buổi được thiết kế riêng cho CTV mới. Bạn sẽ được hướng dẫn chi tiết về quy trình làm việc và các công cụ hỗ trợ.",
        tags: [
          {
            text: "Đăng ký online",
            class: "text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full"
          }
        ]
      }
    ],
    startButton: "Bắt Đầu Ngay Từ Bước 1",
    footerNote: "Hoàn thành 4 bước đơn giản để bắt đầu kiếm thu nhập ngay hôm nay"
  },
  testimonials: {
    section: {
      subtitle: "Trải Nghiệm Thực Tế",
      title: {
        line1: "CTV Nói Gì Về",
        line2: "Thiên Hà Group?"
      }
    },
    list: [
      {
        id: 1,
        name: "Nguyễn Thị Hương",
        position: "Sinh viên - CTV 8 tháng",
        quote: "Mình là sinh viên, làm CTV chụp ảnh BĐS được 8 tháng. Thu nhập trung bình 4-5 triệu/tháng, đủ trang trải học phí và sinh hoạt. Công việc linh hoạt, không ảnh hưởng việc học.",
        initials: "NH",
        color: "blue",
        rating: 5
      }
    ]
  },
  stats: [
    {
      label: "CTV Đang Hợp Tác",
      count: 5200
    },
    {
      label: "Tỷ Thanh Toán/Năm",
      count: 8.2
    },
    {
      label: "% Hài Lòng",
      count: 98
    },
    {
      label: "Tỉnh Thành Phủ Sóng",
      count: 34
    }
  ],
  form: {
    title: "Đăng Ký Làm Cộng Tác Viên Ngay",
    description: "Điền thông tin đăng ký để nhận tư vấn chi tiết về công việc phù hợp với bạn. Chúng tôi sẽ liên hệ trong vòng 2 giờ làm việc.",
    sections: {
      info: {
        title: "Thông Tin Đăng Ký"
      },
      support: {
        title: "Hỗ Trợ & Tư Vấn"
      }
    },
    fields: [
      {
        name: "name",
        label: "Họ và tên *",
        type: "text",
        placeholder: "Nguyễn Văn A",
        required: true
      }
    ],
    timeLabel: "Thời gian có thể làm việc *",
    workTimes: [
      {
        id: "weekday",
        label: "Ngày thường"
      }
    ],
    submitButton: "Gửi Đăng Ký Ngay",
    terms: {
      text: "Bằng việc đăng ký, bạn đồng ý với",
      linkText: "Điều khoản & Chính sách"
    },
    contact: [
      {
        type: "phone",
        title: "Hotline Tuyển Dụng",
        value: "091.123.1882",
        iconClass: "fas fa-phone-alt text-blue-400",
        iconBgClass: "bg-blue-500/10 p-3 rounded-lg mr-4"
      }
    ],
    notes: {
      title: "Lưu ý quan trọng",
      list: [
        "Không yêu cầu kinh nghiệm, đào tạo từ đầu"
      ]
    }
  },
  style: {
    colors: {
      slate900: "--color-slate-900",
      slate800: "--color-slate-800",
      slate700: "--color-slate-700",
      slate300: "--color-slate-300",
      slate400: "--color-slate-400",
      blue400: "--color-blue-400",
      blue500: "--color-blue-500",
      blue600: "--color-blue-600",
      purple400: "--color-purple-400",
      purple500: "--color-purple-500",
      purple600: "--color-purple-600",
      emerald400: "--color-emerald-400",
      emerald500: "--color-emerald-500",
      pink400: "--color-pink-400",
      cyan400: "--color-cyan-400",
      amber400: "--color-amber-400",
      white: "#ffffff"
    },
    gradients: {
      primary: "linear-gradient(90deg, #60a5fa, #8b5cf6)",
      hero: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
      earningsBadge: "linear-gradient(90deg, #10b981, #3b82f6, #10b981)",
      formBg: "linear-gradient(to bottom right, #0f172a, rgba(30, 58, 138, 0.3))"
    },
    shadows: {
      glow: "0 10px 25px rgba(59, 130, 246, 0.3)",
      cardHover: "0 20px 40px rgba(0, 0, 0, 0.4)"
    },
    borderRadius: {
      small: "8px",
      medium: "12px",
      large: "16px",
      xlarge: "20px",
      full: "9999px"
    }
  }
})

// ========== GRADIENT HANDLERS ==========
const parseGradientColors = (gradientString) => {
  if (!gradientString) return { colors: [], angle: '90deg', type: 'linear' }

  // Parse linear-gradient(90deg, #60a5fa, #8b5cf6)
  const match = gradientString.match(/(linear|radial)-gradient\(([^)]+)\)/)
  if (!match) return { colors: [], angle: '90deg', type: 'linear' }

  const type = match[1]
  const content = match[2]

  // Extract angle if exists
  let angle = '90deg'
  let colorsString = content

  if (type === 'linear') {
    const angleMatch = content.match(/(\d+)deg/)
    if (angleMatch) {
      angle = angleMatch[0]
      colorsString = content.replace(angle, '').replace(/^\s*,\s*/, '')
    }
  }

  // Extract colors
  const colors = []
  const colorMatches = colorsString.matchAll(/#[0-9a-fA-F]{6}|rgba?\([^)]+\)/g)
  for (const match of colorMatches) {
    colors.push(match[0])
  }

  return { colors, angle, type }
}

const updateGradient = (gradientKey, colors, angle = '90deg', type = 'linear') => {
  if (type === 'linear') {
    content.style.gradients[gradientKey] = `linear-gradient(${angle}, ${colors.join(', ')})`
  }
}

const getGradientStartColor = (gradientKey) => {
  const gradient = content.style.gradients[gradientKey]
  const parsed = parseGradientColors(gradient)
  return parsed.colors[0] || '#60a5fa'
}

const getGradientEndColor = (gradientKey) => {
  const gradient = content.style.gradients[gradientKey]
  const parsed = parseGradientColors(gradient)
  return parsed.colors[parsed.colors.length - 1] || '#8b5cf6'
}

const getGradientColorByIndex = (gradientKey, index) => {
  const gradient = content.style.gradients[gradientKey]
  const parsed = parseGradientColors(gradient)
  return parsed.colors[index] || '#60a5fa'
}

const updateGradientColor = (gradientKey, position, event) => {
  const newColor = event.target.value
  const gradient = content.style.gradients[gradientKey]
  const parsed = parseGradientColors(gradient)

  if (position === 'start') {
    parsed.colors[0] = newColor
  } else if (position === 'end') {
    parsed.colors[parsed.colors.length - 1] = newColor
  }

  updateGradient(gradientKey, parsed.colors, parsed.angle, parsed.type)
}

const updateGradientColorByIndex = (gradientKey, index, event) => {
  const newColor = event.target.value
  const gradient = content.style.gradients[gradientKey]
  const parsed = parseGradientColors(gradient)

  if (parsed.colors[index]) {
    parsed.colors[index] = newColor
  } else {
    // If index doesn't exist, add color at that position
    while (parsed.colors.length <= index) {
      parsed.colors.push('#60a5fa')
    }
    parsed.colors[index] = newColor
  }

  updateGradient(gradientKey, parsed.colors, parsed.angle, parsed.type)
}

// Computed properties for string conversion
watch(() => content.jobs.list, (newJobs) => {
  newJobs.forEach(job => {
    if (job.tags && !job.tagsString) {
      job.tagsString = job.tags.join(', ')
    }
  })
}, { deep: true })

watch(() => content.process.steps, (newSteps) => {
  newSteps.forEach(step => {
    if (step.tags && !step.tagsString) {
      step.tagsString = step.tags.map(tag => tag.text).join(', ')
    }
  })
}, { deep: true })

// UI State for image previews
const heroImagePreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const heroImageInput = ref(null)

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
import {baseImgaeUrl} from "../../../../assets/js/global.js";

const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 63

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

// Color change handlers
const handleBenefitColorChange = (benefit) => {
  if (benefit.color !== 'custom') {
    benefit.customColor = ''
  }
}

const handleTestimonialColorChange = (testimonial) => {
  if (testimonial.color !== 'custom') {
    testimonial.customColor = ''
  }
}

// Process color values for saving
const processColorForSave = (colorValue) => {
  if (!colorValue) return ''

  // If it's a hex color, return as is
  if (colorValue.startsWith('#')) {
    return colorValue
  }

  // If it's a color key from global colors, add var() prefix
  if (colorValue in globalColors.value && !colorValue.startsWith('var(')) {
    return `var(--color-${colorValue})`
  }

  // If it already has var(), return as is
  if (colorValue.startsWith('var(')) {
    return colorValue
  }

  // Otherwise, check if it's a color key like "blue-500"
  if (colorValue.includes('-')) {
    return `var(--color-${colorValue})`
  }

  return colorValue
}

// Process color values for display
const processColorForDisplay = (colorValue) => {
  if (!colorValue) return ''

  // Remove var() prefix if present
  if (colorValue.startsWith('var(--color-')) {
    return colorValue.replace('var(--color-', '').replace(')', '')
  }

  return colorValue
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

      // Process colors for display
      if (data.style && data.style.colors) {
        Object.keys(data.style.colors).forEach(key => {
          // data.style.colors[key] = processColorForDisplay(data.style.colors[key])
          data.style.colors[key] =data.style.colors[key]
        })
      }

      // Update content with loaded data
      Object.assign(content, data)

      // Convert tags to string for editing
      content.jobs.list.forEach(job => {
        if (job.tags && Array.isArray(job.tags)) {
          job.tagsString = job.tags.join(', ')
        }
      })

      content.process.steps.forEach(step => {
        if (step.tags && Array.isArray(step.tags)) {
          step.tagsString = step.tags.map(tag => tag.text).join(', ')
        }
      })

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
      heroImagePreview.value = null

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

    // Prepare content data - deep clone
    const contentData = JSON.parse(JSON.stringify(content))

    // Process colors for saving - add var() prefix
    if (contentData.style && contentData.style.colors) {
      Object.keys(contentData.style.colors).forEach(key => {
        // contentData.style.colors[key] = processColorForSave(contentData.style.colors[key])
        contentData.style.colors[key] = contentData.style.colors[key]
      })
    }

    // Convert string tags back to array
    contentData.jobs.list.forEach(job => {
      if (job.tagsString) {
        job.tags = job.tagsString.split(',').map(tag => tag.trim()).filter(tag => tag)
        delete job.tagsString
      }
    })

    contentData.process.steps.forEach(step => {
      if (step.tagsString) {
        step.tags = step.tagsString.split(',').map(tagText => ({
          text: tagText.trim(),
          class: "text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full"
        })).filter(tag => tag.text)
        delete step.tagsString
      }
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
      heroImagePreview.value = null

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
  if (content.hero.image.url === tempUrl) {
    content.hero.image.url = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
// Hero Image
const triggerHeroImageInput = () => {
  heroImageInput.value?.click()
}

const handleHeroImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'HeroImage', heroImagePreview, 'hero.image.url')
  }
  event.target.value = ''
}

const handleHeroImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'HeroImage', heroImagePreview, 'hero.image.url')
  }
}

const removeHeroImage = () => {
  if (content.hero.image.url) {
    handleRemoveFile(content.hero.image.url, 'hero.image.url', heroImagePreview)
  }
}

const previewHeroImage = () => {
  if (content.hero.image.url) {
    previewImageUrl.value = getImageUrl(content.hero.image.url)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
}

// ========== JOBS MANAGEMENT ==========
const addJob = () => {
  content.jobs.list.push({
    id: generateId(),
    icon: "fas fa-star",
    color: "#60a5fa",
    title: "",
    price: "",
    unit: "",
    description: "",
    tags: [],
    tagsString: "",
    link: "#",
    linkText: "Xem chi tiết"
  })
  showToast('Đã thêm công việc mới', 'success')
}

const removeJob = (index) => {
  if (confirm('Bạn có chắc muốn xóa công việc này?')) {
    content.jobs.list.splice(index, 1)
    showToast('Đã xóa công việc', 'success')
  }
}

const moveJobUp = (index) => {
  if (index > 0) {
    const temp = content.jobs.list[index]
    content.jobs.list[index] = content.jobs.list[index - 1]
    content.jobs.list[index - 1] = temp
  }
}

const moveJobDown = (index) => {
  if (index < content.jobs.list.length - 1) {
    const temp = content.jobs.list[index]
    content.jobs.list[index] = content.jobs.list[index + 1]
    content.jobs.list[index + 1] = temp
  }
}

// ========== BENEFITS MANAGEMENT ==========
const addBenefit = () => {
  content.benefits.list.push({
    title: "",
    iconName: "fas fa-star",
    color: "blue",
    customColor: "",
    aosDelay: 100,
    description: ""
  })
  showToast('Đã thêm lợi ích mới', 'success')
}

const removeBenefit = (index) => {
  if (confirm('Bạn có chắc muốn xóa lợi ích này?')) {
    content.benefits.list.splice(index, 1)
    showToast('Đã xóa lợi ích', 'success')
  }
}

const moveBenefitUp = (index) => {
  if (index > 0) {
    const temp = content.benefits.list[index]
    content.benefits.list[index] = content.benefits.list[index - 1]
    content.benefits.list[index - 1] = temp
  }
}

const moveBenefitDown = (index) => {
  if (index < content.benefits.list.length - 1) {
    const temp = content.benefits.list[index]
    content.benefits.list[index] = content.benefits.list[index + 1]
    content.benefits.list[index + 1] = temp
  }
}

// ========== PROCESS STEPS MANAGEMENT ==========
const addProcessStep = () => {
  content.process.steps.push({
    title: "",
    badgeText: "",
    badgeClass: "text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full",
    description: "",
    tags: [],
    tagsString: ""
  })
  showToast('Đã thêm bước mới', 'success')
}

const removeProcessStep = (index) => {
  if (confirm('Bạn có chắc muốn xóa bước này?')) {
    content.process.steps.splice(index, 1)
    showToast('Đã xóa bước', 'success')
  }
}

const moveStepUp = (index) => {
  if (index > 0) {
    const temp = content.process.steps[index]
    content.process.steps[index] = content.process.steps[index - 1]
    content.process.steps[index - 1] = temp
  }
}

const moveStepDown = (index) => {
  if (index < content.process.steps.length - 1) {
    const temp = content.process.steps[index]
    content.process.steps[index] = content.process.steps[index + 1]
    content.process.steps[index + 1] = temp
  }
}

// ========== FORM MANAGEMENT ==========
const addFormNote = () => {
  content.form.notes.list.push("")
  showToast('Đã thêm lưu ý mới', 'success')
}

const removeFormNote = (index) => {
  if (content.form.notes.list.length > 1) {
    content.form.notes.list.splice(index, 1)
    showToast('Đã xóa lưu ý', 'success')
  }
}

const addWorkTime = () => {
  content.form.workTimes.push({
    id: "",
    label: ""
  })
  showToast('Đã thêm thời gian làm việc mới', 'success')
}

const removeWorkTime = (index) => {
  if (content.form.workTimes.length > 1) {
    content.form.workTimes.splice(index, 1)
    showToast('Đã xóa thời gian làm việc', 'success')
  }
}

// ========== TESTIMONIALS MANAGEMENT ==========
const addTestimonial = () => {
  content.testimonials.list.push({
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
    content.testimonials.list.splice(index, 1)
    showToast('Đã xóa đánh giá', 'success')
  }
}

const moveTestimonialUp = (index) => {
  if (index > 0) {
    const temp = content.testimonials.list[index]
    content.testimonials.list[index] = content.testimonials.list[index - 1]
    content.testimonials.list[index - 1] = temp
  }
}

const moveTestimonialDown = (index) => {
  if (index < content.testimonials.list.length - 1) {
    const temp = content.testimonials.list[index]
    content.testimonials.list[index] = content.testimonials.list[index + 1]
    content.testimonials.list[index + 1] = temp
  }
}

const globalColors = ref({});

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
  gap: 2px;
  overflow-x: auto;
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

/* Gradient Input Styles */
.gradient-input-group {
  margin-bottom: 20px;
}

.color-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.color-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.color-input label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0;
}

.color-input input[type="color"] {
  width: 100%;
  height: 40px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  padding: 2px;
  background: white;
}

.color-hex {
  font-size: 0.8rem;
  color: #495057;
  font-family: monospace;
  text-align: center;
}

.gradient-preview {
  height: 40px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  margin-top: 10px;
  background-size: cover;
}

/* Lists */
.jobs-list,
.benefits-list,
.process-steps,
.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.job-item,
.benefit-item,
.process-step,
.testimonial-item,
.quick-stat-item,
.stat-card-item,
.location-item,
.service-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.job-item:hover,
.benefit-item:hover,
.process-step:hover,
.testimonial-item:hover,
.quick-stat-item:hover,
.stat-card-item:hover,
.location-item:hover,
.service-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.job-header,
.benefit-header,
.step-header,
.testimonial-header,
.stat-header,
.card-header,
.location-header,
.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.job-header h4,
.benefit-header h4,
.step-header h4,
.testimonial-header h4,
.stat-header h4,
.card-header h4,
.location-header h4,
.service-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1rem;
}

.job-actions,
.benefit-actions,
.step-actions,
.testimonial-actions,
.service-actions {
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

/* Color select styles */
.color-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
}

.color-select:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
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

  .job-header,
  .benefit-header,
  .step-header,
  .testimonial-header,
  .stat-header,
  .card-header,
  .location-header,
  .service-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .job-actions,
  .benefit-actions,
  .step-actions,
  .testimonial-actions,
  .service-actions {
    align-self: flex-end;
  }

  .color-inputs {
    grid-template-columns: 1fr 1fr;
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

  .color-inputs {
    grid-template-columns: 1fr;
  }
}
</style>