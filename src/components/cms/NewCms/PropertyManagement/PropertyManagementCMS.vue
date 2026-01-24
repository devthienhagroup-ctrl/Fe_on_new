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
          :class="{ active: activeTab === 'css' }"
          @click="activeTab = 'css'"
      >
        <i class="fas fa-palette"></i> CSS & Styling
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
          :class="{ active: activeTab === 'features' }"
          @click="activeTab = 'features'"
      >
        <i class="fas fa-cog"></i> Tính năng
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'benefits' }"
          @click="activeTab = 'benefits'"
      >
        <i class="fas fa-chart-line"></i> Lợi ích
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'integration' }"
          @click="activeTab = 'integration'"
      >
        <i class="fas fa-puzzle-piece"></i> Tích hợp
      </button>
<!--      <button
          class="tab-button"
          :class="{ active: activeTab === 'cta' }"
          @click="activeTab = 'cta'"
      >
        <i class="fas fa-bullhorn"></i> Call to Action
      </button>-->
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab CSS & Styling -->
      <div v-if="activeTab === 'css'" class="css-settings">
        <div class="settings-grid">
          <!-- Màu sắc -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc CSS</h3>

            <div class="color-input-group" v-for="(colorValue, colorKey) in content.css.colors" :key="colorKey">
              <label>{{ colorKey }}</label>
              <ColorInputWithGlobalColors
                  v-model="content.css.colors[colorKey]"
                  :placeholder="colorValue"
                  return-type="key" :colors="globalColors"
              />
            </div>
          </div>

          <!-- Gradients -->
          <div class="setting-section">
            <h3><i class="fas fa-gradient"></i> Gradients</h3>

            <div class="gradient-input-group" v-for="(gradient, gradientKey) in content.css.gradients" :key="gradientKey">
              <label :for="`gradient-${gradientKey}`">{{ gradientKey }}</label>
              <div class="gradient-picker">
                <div class="">
                  <div class="form-group">
                    <label>Màu bắt đầu</label>
                    <ColorInputWithGlobalColors
                        v-model="gradientColors[gradientKey].start"
                        placeholder="Chọn màu bắt đầu"
                        return-type="key"
                        :colors="globalColors"
                        @update:modelValue="updateGradient(gradientKey)"
                    />
                  </div>
                  <div class="form-group">
                    <label>Màu kết thúc</label>
                    <ColorInputWithGlobalColors
                        v-model="gradientColors[gradientKey].end"
                        placeholder="Chọn màu kết thúc"
                        return-type="key"
                        :colors="globalColors"
                        @update:modelValue="updateGradient(gradientKey)"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>Kết quả</label>
                  <input
                      type="text"
                      :id="`gradient-${gradientKey}`"
                      v-model="content.css.gradients[gradientKey]"
                      readonly
                      class="gradient-result"
                  />
                </div>
              </div>
            </div>

            <!-- Hero Background -->
            <div class="form-group">
              <label>Hero Background</label>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerHeroBackgroundInput" @dragover.prevent
                     @drop.prevent="handleHeroBackgroundDrop">
                  <input
                      type="file"
                      ref="heroBackgroundInput"
                      @change="handleHeroBackgroundUpload"
                      accept="image/*"
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                  <p class="file-hint">Kích thước đề xuất: 1920x1080px</p>
                </div>

                <div v-if="heroBackgroundPreview || hasHeroBackgroundImage" class="upload-preview">
                  <img :src="getImageUrl(getHeroBackgroundImage())" alt="Hero Background Preview"/>
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewHeroBackground" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeHeroBackground" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="!heroBackgroundPreview && !hasHeroBackgroundImage" class="form-group">
                <label for="hero-background-url">Hoặc nhập URL ảnh</label>
                <input
                    type="text"
                    id="hero-background-url"
                    v-model="content.css.heroBackground"
                    placeholder="url('https://example.com/hero-bg.jpg')"
                />
              </div>
            </div>
          </div>

          <!-- Animations -->
          <div class="setting-section">
            <h3><i class="fas fa-play-circle"></i> Animations</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="counterDuration">Counter Duration (ms)</label>
                <input
                    type="number"
                    id="counterDuration"
                    v-model.number="content.css.animations.counterDuration"
                    placeholder="2000"
                />
              </div>
              <div class="form-group">
                <label for="counterSteps">Counter Steps</label>
                <input
                    type="number"
                    id="counterSteps"
                    v-model.number="content.css.animations.counterSteps"
                    placeholder="60"
                />
              </div>
            </div>
          </div>

          <!-- Sizes -->
          <div class="setting-section">
            <h3><i class="fas fa-text-height"></i> Kích thước</h3>

            <div class="form-group" v-for="(size, sizeKey) in content.css.sizes" :key="sizeKey">
              <label :for="`size-${sizeKey}`">{{ sizeKey }}</label>
              <input
                  type="text"
                  :id="`size-${sizeKey}`"
                  v-model="content.css.sizes[sizeKey]"
                  placeholder="110px"
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
              <label for="heroSubtitle">Phụ đề</label>
              <input
                  type="text"
                  id="heroSubtitle"
                  v-model="content.hero.subtitle"
                  placeholder="QUẢN LÝ TÀI SẢN THÔNG MINH"
              />
            </div>

            <div class="form-group">
              <label for="heroTitleLine1">Dòng tiêu đề 1</label>
              <input
                  type="text"
                  id="heroTitleLine1"
                  v-model="content.hero.titleLine1"
                  placeholder="Quản Lý Tài Sản"
              />
            </div>

            <div class="form-group">
              <label for="heroTitleLine2">Dòng tiêu đề 2</label>
              <input
                  type="text"
                  id="heroTitleLine2"
                  v-model="content.hero.titleLine2"
                  placeholder="Đẳng Cấp Thời Đại Số"
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
                  placeholder="giới thiệu nền tảng quản lý tài sản bất động sản toàn diện..."
              ></textarea>
            </div>

            <!-- Info Card -->
            <div class="form-group">
              <label for="infoCardTitle">Tiêu đề thẻ thông tin</label>
              <input
                  type="text"
                  id="infoCardTitle"
                  v-model="content.hero.infoCard.title"
                  placeholder="Tăng 73% Hiệu Suất"
              />
            </div>

            <div class="form-group">
              <label for="infoCardDescription">Mô tả thẻ thông tin</label>
              <textarea
                  id="infoCardDescription"
                  v-model="content.hero.infoCard.description"
                  rows="2"
                  placeholder="Các môi giới sử dụng nền tảng của chúng tôi..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Biểu tượng thẻ thông tin</label>
              <div class="input-with-icon">
                <IconPicker v-model="content.hero.infoCard.icon"/>
              </div>
            </div>

            <!-- Scroll Indicator -->
            <div class="form-group">
              <label>Biểu tượng scroll indicator</label>
              <div class="input-with-icon">
                <IconPicker v-model="content.hero.scrollIndicator.icon"/>
              </div>
            </div>
          </div>

          <!-- Buttons & Stats -->
          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm</h3>

            <div class="button-settings">
              <div class="form-group">
                <label>Nút Khám phá</label>
                <div class="form-row">
                  <div class="form-group">
                    <label>Văn bản</label>
                    <input type="text" v-model="content.hero.buttons.explore.text" placeholder="Khám Phá Công Cụ"/>
                  </div>
                  <div class="form-group">
                    <label>Biểu tượng</label>
                    <div class="input-with-icon">
                      <IconPicker v-model="content.hero.buttons.explore.icon"/>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Liên kết</label>
                  <input type="text" v-model="content.hero.buttons.explore.link" placeholder="#features"/>
                </div>
              </div>

              <div class="form-group">
                <label>Nút Demo</label>
                <div class="form-row">
                  <div class="form-group">
                    <label>Văn bản</label>
                    <input type="text" v-model="content.hero.buttons.demo.text" placeholder="Xem Demo"/>
                  </div>
                  <div class="form-group">
                    <label>Biểu tượng</label>
                    <div class="input-with-icon">
                      <IconPicker v-model="content.hero.buttons.demo.icon"/>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Liên kết</label>
                  <input type="text" v-model="content.hero.buttons.demo.link" placeholder="#demo"/>
                </div>
              </div>
            </div>

            <h3 class="mt-4"><i class="fas fa-chart-bar"></i> Thống kê Hero</h3>
            <div v-for="(stat, index) in content.hero.stats" :key="stat.id" class="stat-item">
              <div class="stat-header">
                <h4>Thống kê #{{ index + 1 }}</h4>
                <button class="btn-icon btn-danger" @click="removeHeroStat(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Giá trị</label>
                  <input type="number" v-model.number="stat.count" placeholder="10000"/>
                </div>
                <div class="form-group">
                  <label>Nhãn</label>
                  <input type="text" v-model="stat.label" placeholder="Môi Giới Hợp Tác"/>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Biểu tượng chính</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="stat.icon"/>
                  </div>
                </div>
                <div class="form-group">
                  <label>Biểu tượng phụ</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="stat.bottomIcon"/>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Animation Delay</label>
                  <input type="text" v-model="stat.animationDelay" placeholder="0s"/>
                </div>
                <div class="form-group">
                  <label>AOS Delay</label>
                  <input type="text" v-model="stat.aosDelay" placeholder="200"/>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary mt-2" @click="addHeroStat">
              <i class="fas fa-plus"></i> Thêm thống kê
            </button>
          </div>

          <!-- Benefits -->
          <div class="setting-section">
            <h3><i class="fas fa-check-circle"></i> Lợi ích Hero</h3>

            <div v-for="(benefit, index) in content.hero.benefits" :key="index" class="benefit-item">
              <div class="benefit-header">
                <h4>Lợi ích #{{ index + 1 }}</h4>
                <button class="btn-icon btn-danger" @click="removeHeroBenefit(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div class="form-group">
                <label>Văn bản</label>
                <input type="text" v-model="benefit.text" placeholder="Quản lý đa tài sản"/>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="benefit.icon"/>
                  </div>
                </div>
                <div class="form-group">
                  <label>Màu biểu tượng</label>
                  <input type="text" v-model="benefit.iconColor" placeholder="text-blue-400"/>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>AOS</label>
                  <input type="text" v-model="benefit.aos" placeholder="fade-up"/>
                </div>
                <div class="form-group">
                  <label>AOS Delay</label>
                  <input type="text" v-model="benefit.aosDelay" placeholder="800"/>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary mt-2" @click="addHeroBenefit">
              <i class="fas fa-plus"></i> Thêm lợi ích
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Tính năng -->
      <div v-if="activeTab === 'features'" class="features-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-cog"></i> Phần tính năng</h3>
          </div>

          <div class="form-group">
            <label for="featuresSubtitle">Phụ đề</label>
            <input
                type="text"
                id="featuresSubtitle"
                v-model="content.features.section.subtitle"
                placeholder="Tính Năng Đột Phá"
            />
          </div>

          <div class="form-group">
            <label for="featuresTitleLine1">Dòng tiêu đề 1</label>
            <input
                type="text"
                id="featuresTitleLine1"
                v-model="content.features.section.titleLine1"
                placeholder="Quản Lý Nhiều Tài Sản"
            />
          </div>

          <div class="form-group">
            <label for="featuresTitleLine2">Dòng tiêu đề 2</label>
            <input
                type="text"
                id="featuresTitleLine2"
                v-model="content.features.section.titleLine2"
                placeholder="Tiện Lợi Trên Một Nền Tảng"
            />
          </div>

          <div class="form-group">
            <label for="featuresDescription">Mô tả</label>
            <textarea
                id="featuresDescription"
                v-model="content.features.section.description"
                rows="3"
                placeholder="Tích hợp tất cả công cụ cần thiết..."
            ></textarea>
          </div>

          <div class="section-header mt-4">
            <h3><i class="fas fa-list"></i> Danh sách tính năng</h3>
            <button class="btn btn-primary" @click="addFeature">
              <i class="fas fa-plus"></i> Thêm tính năng
            </button>
          </div>

          <div class="features-list">
            <div v-for="(feature, index) in content.features.items" :key="feature.id" class="feature-item">
              <div class="feature-header">
                <h4>Tính năng #{{ index + 1 }} - {{ feature.title || 'Chưa có tiêu đề' }}</h4>
                <div class="feature-actions">
                  <button class="btn-icon" @click="moveFeatureUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveFeatureDown(index)"
                          :disabled="index === content.features.items.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeFeature(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="feature.title" placeholder="Kho dữ liệu tập trung"/>
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="feature.description" rows="3"
                          placeholder="Lưu trữ và quản lý thông tin chi tiết..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Màu sắc</label>
                  <select v-model="feature.color" class="color-select" @change="handleFeatureColorChange(feature, $event)">
                    <option v-for="color in serviceColors" :value="color">{{ color }}</option>
                    <option disabled value="custom">Tùy chỉnh</option>
                  </select>
                  <ColorInputWithGlobalColors
                      v-if="feature.color === 'custom'"
                      v-model="feature.customColor"
                      placeholder="Nhập mã màu tùy chỉnh"
                      return-type="hex"
                      :colors="globalColors"
                      class="mt-2"
                      @update:modelValue="handleCustomColorChange(feature)"
                  />
                </div>
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="feature.iconName"/>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Liên kết</label>
                  <input type="text" v-model="feature.link" placeholder="#"/>
                </div>
                <div class="form-group">
                  <label>Văn bản liên kết</label>
                  <input type="text" v-model="feature.linkText" placeholder="Khám phá ngay"/>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>AOS</label>
                  <input type="text" v-model="feature.aos" placeholder="fade-up"/>
                </div>
                <div class="form-group">
                  <label>AOS Delay</label>
                  <input type="text" v-model="feature.aosDelay" placeholder="0"/>
                </div>
              </div>
            </div>

            <div v-if="content.features.items.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Chưa có tính năng nào. Hãy thêm tính năng đầu tiên!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Lợi ích -->
      <div v-if="activeTab === 'benefits'" class="benefits-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-chart-line"></i> Phần lợi ích</h3>

            <div class="form-group">
              <label for="benefitsSubtitle">Phụ đề</label>
              <input
                  type="text"
                  id="benefitsSubtitle"
                  v-model="content.benefits.section.subtitle"
                  placeholder="Lợi Ích Vượt Trội"
              />
            </div>

            <div class="form-group">
              <label for="benefitsTitleLine1">Dòng tiêu đề 1</label>
              <input
                  type="text"
                  id="benefitsTitleLine1"
                  v-model="content.benefits.section.titleLine1"
                  placeholder="Một Công Cụ –"
              />
            </div>

            <div class="form-group">
              <label for="benefitsTitleLine2">Dòng tiêu đề 2</label>
              <input
                  type="text"
                  id="benefitsTitleLine2"
                  v-model="content.benefits.section.titleLine2"
                  placeholder="Tối Ưu Cả Quy Trình Môi Giới"
              />
            </div>

            <div class="form-group">
              <label for="benefitsQuestion">Câu hỏi</label>
              <input
                  type="text"
                  id="benefitsQuestion"
                  v-model="content.benefits.question"
                  placeholder="Tại Sao Chọn Nền Tảng Quản Lý Tài Sản Của Thiên Hà Group?"
              />
            </div>

            <!-- Badge -->
            <div class="form-row">
              <div class="form-group">
                <label>Giá trị badge</label>
                <input type="text" v-model="content.benefits.badge.value" placeholder="73%"/>
              </div>
              <div class="form-group">
                <label>Nhãn badge</label>
                <input type="text" v-model="content.benefits.badge.label" placeholder="Tăng hiệu suất làm việc"/>
              </div>
            </div>

            <!-- CTA -->
            <div class="form-group">
              <label>CTA Text</label>
              <input type="text" v-model="content.benefits.cta.text" placeholder="Đăng Ký Trải Nghiệm Miễn Phí"/>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>CTA Icon</label>
                <div class="input-with-icon">
                  <IconPicker v-model="content.benefits.cta.icon"/>
                </div>
              </div>
              <div class="form-group">
                <label>CTA Link</label>
                <input type="text" v-model="content.benefits.cta.link" placeholder="#contact"/>
              </div>
            </div>
          </div>

          <!-- Benefits Items -->
          <div class="setting-section">
            <h3><i class="fas fa-list-check"></i> Danh sách lợi ích</h3>

            <div v-for="(item, index) in content.benefits.items" :key="index" class="benefit-item">
              <div class="benefit-header">
                <h4>Lợi ích #{{ index + 1 }}</h4>
                <button class="btn-icon btn-danger" @click="removeBenefitItem(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="item.title" placeholder="Lưu Trữ và Quản Trị Tập Trung"/>
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="item.description" rows="2"
                          placeholder="Tất cả thông tin khách hàng..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="item.icon"/>
                  </div>
                </div>
                <div class="form-group">
                  <label>Màu biểu tượng</label>
                  <input type="text" v-model="item.iconColor" placeholder="text-blue-400"/>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary mt-2" @click="addBenefitItem">
              <i class="fas fa-plus"></i> Thêm lợi ích
            </button>

            <!-- Image Upload -->
            <div class="form-group mt-4">
              <div class="label" style="display: flex; justify-content: space-between">
                <label>Ảnh lợi ích</label>
                <button class="btn-icon btn-preview-action" @click="previewBenefitsImage" title="Xem trước"
                        v-if="content.benefits.image.src">
                  <i class="fas fa-eye"></i>
                </button>
              </div>
              <div class="file-upload">
                <div class="file-upload-area" @click="triggerBenefitsImageInput" @dragover.prevent
                     @drop.prevent="handleBenefitsImageDrop">
                  <input
                      type="file"
                      ref="benefitsImageInput"
                      @change="handleBenefitsImageUpload"
                      accept="image/*"
                      style="display: none"
                  />
                  <i class="fas fa-cloud-upload-alt"></i>
                  <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
                  <p class="file-hint">Kích thước đề xuất: 800x600px</p>
                </div>

                <div v-if="benefitsImagePreview || content.benefits.image.src" class="upload-preview">
                  <img :src="getImageUrl(content.benefits.image.src)" alt="Benefits Image Preview"/>
                  <div class="preview-actions">
                    <button class="btn-preview-action" @click="previewBenefitsImage" title="Xem trước">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-preview-action" @click="removeBenefitsImage" title="Xóa ảnh">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!benefitsImagePreview && !content.benefits.image.src" class="form-group">
                <label for="benefits-image-url">Hoặc nhập URL ảnh</label>
                <input
                    type="text"
                    id="benefits-image-url"
                    v-model="content.benefits.image.src"
                    placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Tích hợp -->
      <div v-if="activeTab === 'integration'" class="integration-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-puzzle-piece"></i> Phần tích hợp</h3>

            <div class="form-group">
              <label for="integrationSubtitle">Phụ đề</label>
              <input
                  type="text"
                  id="integrationSubtitle"
                  v-model="content.integration.section.subtitle"
                  placeholder="Tích Hợp Công Nghệ"
              />
            </div>

            <div class="form-group">
              <label for="integrationTitleLine1">Dòng tiêu đề 1</label>
              <input
                  type="text"
                  id="integrationTitleLine1"
                  v-model="content.integration.section.titleLine1"
                  placeholder="Nền Tảng"
              />
            </div>

            <div class="form-group">
              <label for="integrationTitleLine2">Dòng tiêu đề 2</label>
              <input
                  type="text"
                  id="integrationTitleLine2"
                  v-model="content.integration.section.titleLine2"
                  placeholder="Tích Hợp Đa Công Cụ Cho Môi Giới Hiện Đại"
              />
            </div>

            <div class="form-group">
              <label for="integrationDescription">Mô tả</label>
              <textarea
                  id="integrationDescription"
                  v-model="content.integration.section.description"
                  rows="3"
                  placeholder="Kết hợp sức mạnh của nhiều công cụ công nghệ..."
              ></textarea>
            </div>

            <!-- CTA -->
            <div class="form-group">
              <label>CTA Text</label>
              <input type="text" v-model="content.integration.cta.text" placeholder="Bắt Đầu Tích Hợp Ngay"/>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>CTA Icon</label>
                <div class="input-with-icon">
                  <IconPicker v-model="content.integration.cta.icon"/>
                </div>
              </div>
              <div class="form-group">
                <label>CTA Link</label>
                <input type="text" v-model="content.integration.cta.link" placeholder="#contact"/>
              </div>
            </div>

            <!-- Timeline -->
            <h3 class="mt-4"><i class="fas fa-stream"></i> Timeline</h3>
            <div class="form-group">
              <label for="timelineTitle">Tiêu đề timeline</label>
              <input
                  type="text"
                  id="timelineTitle"
                  v-model="content.integration.timeline.title"
                  placeholder="Quy Trình Tích Hợp Chỉ Trong 3 Bước"
              />
            </div>

            <div v-for="(step, index) in content.integration.timeline.steps" :key="index" class="timeline-step">
              <div class="step-header">
                <h4>Bước #{{ index + 1 }}</h4>
                <button class="btn-icon btn-danger" @click="removeTimelineStep(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Số thứ tự</label>
                  <input type="text" v-model="step.number" placeholder="01"/>
                </div>
                <div class="form-group">
                  <label>Màu số</label>
                  <input type="text" v-model="step.numberColor" placeholder="text-blue-400"/>
                </div>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="step.title" placeholder="Đăng Ký & Cài Đặt"/>
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="step.description" rows="2"
                          placeholder="Tạo tài khoản và cài đặt nền tảng..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>AOS</label>
                  <input type="text" v-model="step.aos" placeholder="fade-right"/>
                </div>
                <div class="form-group">
                  <label>AOS Delay</label>
                  <input type="text" v-model="step.aosDelay" placeholder="100"/>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary mt-2" @click="addTimelineStep">
              <i class="fas fa-plus"></i> Thêm bước
            </button>
          </div>

          <!-- Integration Items -->
          <div class="setting-section">
            <h3><i class="fas fa-list"></i> Danh sách tích hợp</h3>

            <div v-for="(item, index) in content.integration.items" :key="item.id" class="integration-item">
              <div class="integration-header">
                <h4>Tích hợp #{{ index + 1 }}</h4>
                <div class="integration-actions">
                  <button class="btn-icon" @click="moveIntegrationItemUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveIntegrationItemDown(index)"
                          :disabled="index === content.integration.items.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeIntegrationItem(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="item.title" placeholder="AI phân tích thông minh"/>
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="item.description" rows="2"
                          placeholder="Trí tuệ nhân tạo phân tích hành vi khách hàng..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Màu sắc</label>
                  <ColorInputWithGlobalColors
                      v-model="item.color"
                      placeholder="#60a5fa"
                      return-type="hex"
                      :colors="globalColors"
                  />
                </div>
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="item.iconName"/>
                  </div>
                </div>
              </div>
            </div>

            <button class="btn btn-secondary mt-2" @click="addIntegrationItem">
              <i class="fas fa-plus"></i> Thêm tích hợp
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Call to Action -->
      <div v-if="activeTab === 'cta'" class="cta-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-bullhorn"></i> Nội dung CTA</h3>

            <div class="form-group">
              <label for="ctaBackground">Background</label>
              <textarea
                  id="ctaBackground"
                  v-model="content.cta.background"
                  rows="2"
                  placeholder="linear-gradient(to bottom right, var(--color-slate-900), rgba(30, 64, 175, 0.3))"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="ctaTitle">Tiêu đề</label>
              <input
                  type="text"
                  id="ctaTitle"
                  v-model="content.cta.title"
                  placeholder="Sẵn Sàng Nâng Tầm Quản Lý Tài Sản Của Bạn?"
              />
            </div>

            <div class="form-group">
              <label for="ctaDescription">Mô tả</label>
              <textarea
                  id="ctaDescription"
                  v-model="content.cta.description"
                  rows="3"
                  placeholder="Đăng ký ngay hôm nay để trải nghiệm..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Màu nền thẻ</label>
              <input type="text" v-model="content.cta.card.bgColor" placeholder="bg-blue-600"/>
            </div>

            <!-- Footer -->
            <div class="form-group">
              <label>Footer Icon</label>
              <div class="input-with-icon">
                <IconPicker v-model="content.cta.footer.icon"/>
              </div>
            </div>

            <div class="form-group">
              <label>Footer Text</label>
              <textarea
                  v-model="content.cta.footer.text"
                  rows="2"
                  placeholder="Cam kết bảo mật thông tin 100% • Hỗ trợ 24/7 • Cập nhật miễn phí trọn đời"
              ></textarea>
            </div>
          </div>

          <!-- Buttons -->
          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm CTA</h3>

            <div class="button-settings">
              <div class="form-group">
                <label>Nút Tư vấn</label>
                <div class="form-row">
                  <div class="form-group">
                    <label>Văn bản</label>
                    <input type="text" v-model="content.cta.buttons.consultation.text" placeholder="Đặt Lịch Tư Vấn"/>
                  </div>
                  <div class="form-group">
                    <label>Biểu tượng</label>
                    <div class="input-with-icon">
                      <IconPicker v-model="content.cta.buttons.consultation.icon"/>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Class</label>
                    <input type="text" v-model="content.cta.buttons.consultation.class"
                           placeholder="bg-slate-900 text-white px-8 py-4 rounded-full font-bold"/>
                  </div>
                  <div class="form-group">
                    <label>Liên kết</label>
                    <input type="text" v-model="content.cta.buttons.consultation.link" placeholder="#"/>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Nút Điện thoại</label>
                <div class="form-row">
                  <div class="form-group">
                    <label>Văn bản</label>
                    <input type="text" v-model="content.cta.buttons.phone.text" placeholder="Gọi Ngay: 1900 1000"/>
                  </div>
                  <div class="form-group">
                    <label>Biểu tượng</label>
                    <div class="input-with-icon">
                      <IconPicker v-model="content.cta.buttons.phone.icon"/>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Class</label>
                    <input type="text" v-model="content.cta.buttons.phone.class"
                           placeholder="bg-transparent border text-slate-50 px-8 py-4 rounded-full font-bold"/>
                  </div>
                  <div class="form-group">
                    <label>Liên kết</label>
                    <input type="text" v-model="content.cta.buttons.phone.link" placeholder="tel:19001000"/>
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
import {ref, reactive, onMounted, computed, watch} from 'vue'
import api from '../../../../api/api.js'
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
import ColorInputWithGlobalColors from "../homeNew/ColorInputWithGlobalColors.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('css')
const isLoading = ref(false)

// Color options (giống dịch vụ)
const serviceColors = ['blue', 'purple', 'teal', 'pink', 'amber', 'orange', 'sky', 'cyan']

// Gradient colors management
const gradientColors = reactive({
  textGradient: { start: '--color-blue-400', end: '--color-purple-500' },
  sectionDivider: { start: '--color-blue-500', end: '--color-purple-600' },
  gradientBorder: { start: '--color-blue-500', end: '--color-purple-500' }
})

// Content structure based on new JSON data
const content = reactive({
  hero: {
    subtitle: "QUẢN LÝ TÀI SẢN THÔNG MINH",
    titleLine1: "Quản Lý Tài Sản",
    titleLine2: "Đẳng Cấp Thời Đại Số",
    companyName: "Thiên Hà Group",
    description: "giới thiệu nền tảng quản lý tài sản bất động sản toàn diện, kết hợp trí tuệ nhân tạo và công nghệ blockchain để tối ưu hóa quy trình môi giới, gia tăng hiệu suất và nâng tầm giá trị đầu tư của bạn.",
    buttons: {
      explore: {
        text: "Khám Phá Công Cụ",
        icon: "fas fa-rocket",
        link: "#features"
      },
      demo: {
        text: "Xem Demo",
        icon: "fas fa-play-circle",
        link: "#demo"
      }
    },
    benefits: [
      {
        text: "Quản lý đa tài sản",
        icon: "fa-solid fa-building-circle-check",
        iconColor: "text-blue-400",
        iconBgClass: "bg-blue-500/10",
        aos: "fade-up",
        aosDelay: "800"
      },
      {
        text: "Bảo mật tuyệt đối",
        icon: "fa-solid fa-building-shield",
        iconColor: "text-purple-400",
        iconBgClass: "bg-purple-500/10",
        aos: "fade-up",
        aosDelay: "900"
      },
      {
        text: "Cập nhật thời gian thực",
        icon: "fa-solid fa-repeat",
        iconColor: "text-emerald-400",
        iconBgClass: "bg-emerald-500/10",
        aos: "fade-up",
        aosDelay: "1000"
      },
      {
        text: "Hỗ trợ 24/7",
        icon: "fa-solid fa-headset",
        iconColor: "text-blue-400",
        iconBgClass: "bg-blue-500/10",
        aos: "fade-up",
        aosDelay: "1100"
      }
    ],
    stats: [
      {
        id: 1,
        count: 10000,
        initialValue: "0",
        label: "Môi Giới Hợp Tác",
        icon: "fas fa-users",
        iconWrapperClass: "bg-blue-500/10 text-blue-400",
        bottomIcon: "fas fa-network-wired",
        bottomIconColor: "text-blue-400/30",
        aos: "zoom-in",
        aosDelay: "200",
        animationDelay: "0s"
      },
      {
        id: 2,
        count: 85000,
        initialValue: "0",
        label: "Tài Sản Quản Lý",
        icon: "fas fa-building",
        iconWrapperClass: "bg-purple-500/10 text-purple-400",
        bottomIcon: "fas fa-chart-line",
        bottomIconColor: "text-purple-400/30",
        aos: "zoom-in",
        aosDelay: "400",
        animationDelay: "0.5s"
      },
      {
        id: 3,
        count: 98.5,
        initialValue: "0",
        label: "Độ Chính Xác Dữ Liệu",
        icon: "fas fa-percentage",
        iconWrapperClass: "bg-emerald-500/10 text-emerald-400",
        bottomIcon: "fas fa-bullseye",
        bottomIconColor: "text-emerald-400/30",
        aos: "zoom-in",
        aosDelay: "600",
        animationDelay: "1s"
      },
      {
        id: 4,
        count: 45,
        initialValue: "0",
        label: "Tỉnh Thành Phủ Sóng",
        icon: "fas fa-map-marked-alt",
        iconWrapperClass: "bg-blue-500/10 text-blue-400",
        bottomIcon: "fas fa-globe-asia",
        bottomIconColor: "text-blue-400/30",
        aos: "zoom-in",
        aosDelay: "800",
        animationDelay: "1.5s"
      }
    ],
    infoCard: {
      title: "Tăng 73% Hiệu Suất",
      description: "Các môi giới sử dụng nền tảng của chúng tôi tăng hiệu suất làm việc trung bình 73%",
      icon: "fas fa-bolt text-white",
      iconBgClass: "bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg mr-4"
    },
    scrollIndicator: {
      icon: "fas fa-chevron-down w-6 h-6"
    }
  },
  features: {
    section: {
      subtitle: "Tính Năng Đột Phá",
      titleLine1: "Quản Lý Nhiều Tài Sản",
      titleLine2: "Tiện Lợi Trên Một Nền Tảng",
      description: "Tích hợp tất cả công cụ cần thiết cho quy trình môi giới bất động sản chuyên nghiệp, từ quản lý khách hàng, theo dõi tài sản đến phân tích thị trường và tự động hóa tiếp cận."
    },
    items: [
      {
        id: 1,
        title: "Kho dữ liệu tập trung",
        description: "Lưu trữ và quản lý thông tin chi tiết của hàng nghìn tài sản bất động sản với đầy đủ hình ảnh, video 360°, tài liệu pháp lý và lịch sử giao dịch. Truy cập mọi lúc, mọi nơi trên đa thiết bị.",
        iconName: "fas fa-database",
        color: "blue",
        customColor: "",
        link: "#",
        linkText: "Khám phá ngay",
        padding: "large",
        hoverEffect: true,
        aos: "fade-up",
        aosDelay: "0",
        quickAccessUrl: "#"
      },
      {
        id: 2,
        title: "Nguồn khách hàng uy tính",
        description: "Kết nối với hơn 10.000 môi giới uy tín trên toàn quốc và hệ thống khách hàng tiềm năng được xác minh. Tự động đề xuất khách hàng phù hợp với từng loại tài sản, tăng tỷ lệ chốt giao dịch lên đến 67%.",
        iconName: "fas fa-user-friends",
        color: "purple",
        customColor: "",
        link: "#",
        linkText: "Tìm hiểu thêm",
        padding: "large",
        hoverEffect: true,
        aos: "fade-up",
        aosDelay: "200",
        quickAccessUrl: "#"
      },
      {
        id: 3,
        title: "Mở khóa thông tin chi tiết",
        description: "Truy cập thông tin chi tiết về tài sản đang đăng bán của các môi giới khác với mức phí hợp lý. Xem lịch sử giá, thời gian tồn kho, đánh giá của chuyên gia và dự báo xu hướng thị trường.",
        iconName: "fas fa-lock-open",
        color: "teal",
        customColor: "",
        link: "#",
        linkText: "Trải nghiệm ngay",
        padding: "large",
        hoverEffect: true,
        aos: "fade-up",
        aosDelay: "400",
        quickAccessUrl: "#"
      }
    ]
  },
  benefits: {
    section: {
      subtitle: "Lợi Ích Vượt Trội",
      titleLine1: "Một Công Cụ –",
      titleLine2: "Tối Ưu Cả Quy Trình Môi Giới"
    },
    image: {
      src: "https://images.unsplash.com/photo-1597733336794-12d05021d510?fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHx8&ixlib=rb-4.1.0&q=60&w=3000",
      alt: "Quản lý tài sản bất động sản"
    },
    badge: {
      value: "73%",
      label: "Tăng hiệu suất làm việc"
    },
    question: "Tại Sao Chọn Nền Tảng Quản Lý Tài Sản Của Thiên Hà Group?",
    items: [
      {
        title: "Lưu Trữ và Quản Trị Tập Trung",
        description: "Tất cả thông tin khách hàng, sản phẩm và lịch sử giao dịch được lưu trữ tập trung trên nền tảng đám mây bảo mật cao, đồng bộ hóa đa thiết bị theo thời gian thực.",
        icon: "fas fa-database",
        iconColor: "text-blue-400",
        iconBgClass: "bg-blue-500/10"
      },
      {
        title: "Cập Nhật Thời Gian Thực",
        description: "Nhận thông báo ngay lập tức khi có khách hàng quan tâm, tài sản mới phù hợp hoặc biến động thị trường quan trọng. Không bỏ lỡ bất kỳ cơ hội nào.",
        icon: "fas fa-bolt",
        iconColor: "text-purple-400",
        iconBgClass: "bg-purple-500/10"
      },
      {
        title: "Đề Xuất Sản Phẩm 'Đúng Gu'",
        description: "Thuật toán AI phân tích hành vi và sở thích của khách hàng để đề xuất chính xác các tài sản phù hợp, tăng tỷ lệ chốt giao dịch lên đến 45% so với phương pháp truyền thống.",
        icon: "fas fa-brain",
        iconColor: "text-emerald-400",
        iconBgClass: "bg-emerald-500/10"
      },
      {
        title: "Mạng Lưới Hợp Tác 10.000+ Môi Giới",
        description: "Kết nối và chia sẻ thông tin với mạng lưới môi giới uy tín trên toàn quốc, mở rộng phạm vi tiếp cận và tối ưu hóa cơ hội hợp tác, chia sẻ hoa hồng linh hoạt.",
        icon: "fas fa-handshake",
        iconColor: "text-blue-400",
        iconBgClass: "bg-blue-500/10"
      }
    ],
    cta: {
      text: "Đăng Ký Trải Nghiệm Miễn Phí",
      icon: "fas fa-calendar-check",
      link: "#contact"
    }
  },
  integration: {
    section: {
      subtitle: "Tích Hợp Công Nghệ",
      titleLine1: "Nền Tảng",
      titleLine2: "Tích Hợp Đa Công Cụ Cho Môi Giới Hiện Đại",
      description: "Kết hợp sức mạnh của nhiều công cụ công nghệ tiên tiến trong một nền tảng duy nhất, giúp môi giới tối ưu hóa mọi khía cạnh của quy trình làm việc."
    },
    items: [
      {
        id: 1,
        title: "AI phân tích thông minh",
        description: "Trí tuệ nhân tạo phân tích hành vi khách hàng, dự đoán xu hướng thị trường và đề xuất chiến lược tiếp cận tối ưu, giúp tăng tỷ lệ chốt giao dịch lên đến 58%.",
        iconName: "fas fa-robot",
        color: "#60a5fa",
        hoverEffect: true
      },
      {
        id: 2,
        title: "Ứng dụng đa nền tảng",
        description: "Truy cập nền tảng từ mọi thiết bị: desktop, tablet, smartphone. Đồng bộ hóa dữ liệu theo thời gian thực, cho phép làm việc linh hoạt mọi lúc, mọi nơi.",
        iconName: "fas fa-mobile-alt",
        color: "#a78bfa",
        hoverEffect: true
      },
      {
        id: 3,
        title: "Bảo mật blockchain",
        description: "Ứng dụng công nghệ blockchain để bảo mật thông tin giao dịch, hợp đồng điện tử và lịch sử tài sản. Đảm bảo tính minh bạch, không thể thay đổi và an toàn tuyệt đối.",
        iconName: "fas fa-shield-alt",
        color: "#34d399",
        hoverEffect: true
      }
    ],
    timeline: {
      title: "Quy Trình Tích Hợp Chỉ Trong 3 Bước",
      steps: [
        {
          number: "01",
          numberColor: "text-blue-400",
          title: "Đăng Ký & Cài Đặt",
          description: "Tạo tài khoản và cài đặt nền tảng trong 5 phút. Nhập dữ liệu tài sản hiện có hoặc bắt đầu từ đầu.",
          aos: "fade-right",
          aosDelay: "100"
        },
        {
          number: "02",
          numberColor: "text-purple-400",
          title: "Kết Nối & Đồng Bộ",
          description: "Kết nối với các công cụ hiện có và đồng bộ dữ liệu tự động. Tích hợp với CRM, email marketing, và hệ thống quản lý khác.",
          aos: "fade-up",
          aosDelay: "200"
        },
        {
          number: "03",
          numberColor: "text-emerald-400",
          title: "Vận Hành & Tối Ưu",
          description: "Bắt đầu vận hành hệ thống. Nhận phân tích hiệu suất và tối ưu hóa tự động dựa trên dữ liệu thực tế.",
          aos: "fade-left",
          aosDelay: "300"
        }
      ]
    },
    cta: {
      text: "Bắt Đầu Tích Hợp Ngay",
      icon: "fas fa-cogs",
      link: "#contact"
    }
  },
  cta: {
    background: "linear-gradient(to bottom right, var(--color-slate-900), rgba(30, 64, 175, 0.3))",
    title: "Sẵn Sàng Nâng Tầm Quản Lý Tài Sản Của Bạn?",
    description: "Đăng ký ngay hôm nay để trải nghiệm 14 ngày dùng thử miễn phí nền tảng quản lý tài sản bất động sản đẳng cấp từ Thiên Hà Group. Tối ưu hóa quy trình, gia tăng hiệu suất và mở rộng mạng lưới hợp tác.",
    card: {
      bgColor: "bg-blue-600"
    },
    buttons: {
      consultation: {
        text: "Đặt Lịch Tư Vấn",
        icon: "fas fa-calendar-alt",
        class: "bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition shadow-lg whitespace-nowrap",
        link: "#"
      },
      phone: {
        text: "Gọi Ngay: 1900 1000",
        icon: "fas fa-phone-alt",
        class: "bg-transparent border text-slate-50 px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition shadow-lg whitespace-nowrap",
        link: "tel:19001000"
      }
    },
    footer: {
      icon: "fas fa-shield-alt",
      text: "Cam kết bảo mật thông tin 100% • Hỗ trợ 24/7 • Cập nhật miễn phí trọn đời"
    }
  },
  css: {
    heroBackground: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1473&q=80')",
    colors: {
      blue400: "var(--color-blue-400)",
      blue500: "var(--color-blue-500)",
      blue600: "var(--color-blue-600)",
      purple500: "var(--color-purple-500)",
      purple600: "var(--color-purple-600)",
      emerald500: "var(--color-emerald-500)",
      slate900: "var(--color-slate-900)"
    },
    gradients: {
      textGradient: "linear-gradient(90deg, var(--color-blue-400), var(--color-purple-500))",
      sectionDivider: "linear-gradient(90deg, var(--color-blue-500), var(--color-purple-600))",
      gradientBorder: "linear-gradient(45deg, var(--color-blue-500), var(--color-purple-500), var(--color-emerald-500), var(--color-blue-500))"
    },
    animations: {
      counterDuration: 2000,
      counterSteps: 60
    },
    sizes: {
      heroPaddingTop: "110px",
      statIconSize: "60px",
      featureIconSize: "72px"
    }
  }
})

// UI State for image previews
const heroBackgroundPreview = ref(null)
const benefitsImagePreview = ref(null)
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const heroBackgroundInput = ref(null)
const benefitsImageInput = ref(null)

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
const SECTION_ID = 61

// ========== COMPUTED PROPERTIES ==========
const hasHeroBackgroundImage = computed(() => {
  return content.css.heroBackground && content.css.heroBackground.includes("url('")
})

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

const getHeroBackgroundImage = () => {
  if (!content.css.heroBackground) return ''
  const match = content.css.heroBackground.match(/url\(['"]([^'"]+)['"]\)/)
  return match ? match[1] : ''
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

const updateGradient = (gradientKey) => {
  const start = gradientColors[gradientKey].start
  const end = gradientColors[gradientKey].end

  if (gradientKey === 'gradientBorder') {
    // Special handling for 4-color gradient
    const third = gradientColors[gradientKey].third || '--color-emerald-500'
    const fourth = gradientColors[gradientKey].fourth || '--color-blue-500'
    content.css.gradients[gradientKey] = `linear-gradient(45deg, var(${start}), var(${end}), var(${third}), var(${fourth}))`
  } else {
    content.css.gradients[gradientKey] = `linear-gradient(90deg, var(${start}), var(${end}))`
  }
}

const handleFileUpload = (file, type, previewRef, contentPath, isHeroBackground = false) => {
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

    if (isHeroBackground) {
      // For hero background, update the URL in the gradient string
      const baseGradient = "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), "
      content.css.heroBackground = baseGradient + `url('${tempUrl}')`
    } else {
      // For other images, update content path
      const pathParts = contentPath.split('.')
      let target = content
      for (let i = 0; i < pathParts.length - 1; i++) {
        target = target[pathParts[i]]
      }
      target[pathParts[pathParts.length - 1]] = tempUrl
    }

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

const handleRemoveFile = (imageUrl, contentPath, previewRef, isHeroBackground = false) => {
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

    if (isHeroBackground) {
      // For hero background, remove the URL from the gradient string
      const baseGradient = "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)"
      content.css.heroBackground = baseGradient
    } else {
      // For other images, update content path
      const pathParts = contentPath.split('.')
      let target = content
      for (let i = 0; i < pathParts.length - 1; i++) {
        target = target[pathParts[i]]
      }
      target[pathParts[pathParts.length - 1]] = ''
    }

    previewRef.value = null

    showToast('Đã xóa ảnh', 'success')
  }
}

const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000)
}

// Color change handlers
const handleFeatureColorChange = (feature, event) => {
  if (feature.color !== 'custom') {
    feature.customColor = ''
  }
}

const handleCustomColorChange = (feature) => {
  if (feature.customColor && feature.color === 'custom') {
    feature.color = feature.customColor
  }
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

      // Extract gradient colors from existing gradients
      Object.keys(content.css.gradients).forEach(key => {
        const gradient = content.css.gradients[key]
        const colors = gradient.match(/var\(([^)]+)\)/g)
        if (colors && colors.length >= 2) {
          gradientColors[key] = {
            start: colors[0].replace('var(', '').replace(')', ''),
            end: colors[1].replace('var(', '').replace(')', '')
          }
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
      heroBackgroundPreview.value = null
      benefitsImagePreview.value = null

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
      heroBackgroundPreview.value = null
      benefitsImagePreview.value = null

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
  if (content.css.heroBackground.includes(tempUrl)) {
    content.css.heroBackground = content.css.heroBackground.replace(tempUrl, realUrl)
  }
  if (content.benefits.image.src === tempUrl) {
    content.benefits.image.src = realUrl
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
// Hero Background
const triggerHeroBackgroundInput = () => {
  heroBackgroundInput.value?.click()
}

const handleHeroBackgroundUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'HeroBackground', heroBackgroundPreview, '', true)
  }
  event.target.value = ''
}

const handleHeroBackgroundDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'HeroBackground', heroBackgroundPreview, '', true)
  }
}

const removeHeroBackground = () => {
  const imageUrl = getHeroBackgroundImage()
  if (imageUrl) {
    handleRemoveFile(imageUrl, '', heroBackgroundPreview, true)
  }
}

const previewHeroBackground = () => {
  const imageUrl = getHeroBackgroundImage()
  if (imageUrl) {
    previewImageUrl.value = getImageUrl(imageUrl)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh hero background để xem trước', 'warning')
  }
}

// Benefits Image
const triggerBenefitsImageInput = () => {
  benefitsImageInput.value?.click()
}

const handleBenefitsImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'BenefitsImage', benefitsImagePreview, 'benefits.image.src')
  }
  event.target.value = ''
}

const handleBenefitsImageDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'BenefitsImage', benefitsImagePreview, 'benefits.image.src')
  }
}

const removeBenefitsImage = () => {
  if (content.benefits.image.src) {
    handleRemoveFile(content.benefits.image.src, 'benefits.image.src', benefitsImagePreview)
  }
}

const previewBenefitsImage = () => {
  if (content.benefits.image.src) {
    previewImageUrl.value = getImageUrl(content.benefits.image.src)
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
  previewImageUrl.value = ''
}

// ========== HERO MANAGEMENT ==========
const addHeroStat = () => {
  content.hero.stats.push({
    id: generateId(),
    count: 0,
    initialValue: "0",
    label: "",
    icon: "fas fa-star",
    iconWrapperClass: "bg-blue-500/10 text-blue-400",
    bottomIcon: "",
    bottomIconColor: "",
    aos: "zoom-in",
    aosDelay: "200",
    animationDelay: "0s"
  })
  showToast('Đã thêm thống kê hero', 'success')
}

const removeHeroStat = (index) => {
  if (confirm('Bạn có chắc muốn xóa thống kê này?')) {
    content.hero.stats.splice(index, 1)
    showToast('Đã xóa thống kê hero', 'success')
  }
}

const addHeroBenefit = () => {
  content.hero.benefits.push({
    text: "",
    icon: "",
    iconColor: "text-blue-400",
    iconBgClass: "bg-blue-500/10",
    aos: "fade-up",
    aosDelay: "800"
  })
  showToast('Đã thêm lợi ích hero', 'success')
}

const removeHeroBenefit = (index) => {
  if (confirm('Bạn có chắc muốn xóa lợi ích này?')) {
    content.hero.benefits.splice(index, 1)
    showToast('Đã xóa lợi ích hero', 'success')
  }
}

// ========== FEATURES MANAGEMENT ==========
const addFeature = () => {
  content.features.items.push({
    id: generateId(),
    title: "",
    description: "",
    iconName: "fas fa-star",
    color: "blue",
    customColor: "",
    link: "#",
    linkText: "Khám phá ngay",
    padding: "large",
    hoverEffect: true,
    aos: "fade-up",
    aosDelay: "0",
    quickAccessUrl: "#"
  })
  showToast('Đã thêm tính năng mới', 'success')
}

const removeFeature = (index) => {
  if (confirm('Bạn có chắc muốn xóa tính năng này?')) {
    content.features.items.splice(index, 1)
    showToast('Đã xóa tính năng', 'success')
  }
}

const moveFeatureUp = (index) => {
  if (index > 0) {
    const temp = content.features.items[index]
    content.features.items[index] = content.features.items[index - 1]
    content.features.items[index - 1] = temp
  }
}

const moveFeatureDown = (index) => {
  if (index < content.features.items.length - 1) {
    const temp = content.features.items[index]
    content.features.items[index] = content.features.items[index + 1]
    content.features.items[index + 1] = temp
  }
}

// ========== BENEFITS MANAGEMENT ==========
const addBenefitItem = () => {
  content.benefits.items.push({
    title: "",
    description: "",
    icon: "",
    iconColor: "text-blue-400",
    iconBgClass: "bg-blue-500/10"
  })
  showToast('Đã thêm lợi ích', 'success')
}

const removeBenefitItem = (index) => {
  if (confirm('Bạn có chắc muốn xóa lợi ích này?')) {
    content.benefits.items.splice(index, 1)
    showToast('Đã xóa lợi ích', 'success')
  }
}

// ========== INTEGRATION MANAGEMENT ==========
const addIntegrationItem = () => {
  content.integration.items.push({
    id: generateId(),
    title: "",
    description: "",
    iconName: "",
    color: "#60a5fa",
    hoverEffect: true
  })
  showToast('Đã thêm tích hợp mới', 'success')
}

const removeIntegrationItem = (index) => {
  if (confirm('Bạn có chắc muốn xóa tích hợp này?')) {
    content.integration.items.splice(index, 1)
    showToast('Đã xóa tích hợp', 'success')
  }
}

const moveIntegrationItemUp = (index) => {
  if (index > 0) {
    const temp = content.integration.items[index]
    content.integration.items[index] = content.integration.items[index - 1]
    content.integration.items[index - 1] = temp
  }
}

const moveIntegrationItemDown = (index) => {
  if (index < content.integration.items.length - 1) {
    const temp = content.integration.items[index]
    content.integration.items[index] = content.integration.items[index + 1]
    content.integration.items[index + 1] = temp
  }
}

// ========== TIMELINE MANAGEMENT ==========
const addTimelineStep = () => {
  content.integration.timeline.steps.push({
    number: "0" + (content.integration.timeline.steps.length + 1),
    numberColor: "text-blue-400",
    title: "",
    description: "",
    aos: "fade-up",
    aosDelay: "100"
  })
  showToast('Đã thêm bước timeline', 'success')
}

const removeTimelineStep = (index) => {
  if (confirm('Bạn có chắc muốn xóa bước này?')) {
    content.integration.timeline.steps.splice(index, 1)
    showToast('Đã xóa bước timeline', 'success')
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
/* Thêm CSS cho gradient picker */
.gradient-input-group {
  margin-bottom: 20px;
}

.gradient-picker {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.gradient-result {
  background-color: #f8f9fa;
  cursor: not-allowed;
  color: #6c757d;
}

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

/* Lists */
.features-list,
.benefits-list,
.integration-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item,
.benefit-item,
.timeline-step,
.integration-item,
.feature-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.stat-item:hover,
.benefit-item:hover,
.timeline-step:hover,
.integration-item:hover,
.feature-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.stat-header,
.benefit-header,
.step-header,
.integration-header,
.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.stat-header h4,
.benefit-header h4,
.step-header h4,
.integration-header h4,
.feature-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1rem;
}

.feature-actions,
.integration-actions {
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
  .benefit-header,
  .step-header,
  .integration-header,
  .feature-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .feature-actions,
  .integration-actions {
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

/* Utility classes */
.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}
</style>