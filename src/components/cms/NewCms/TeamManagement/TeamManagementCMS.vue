<template>
  <div class="reasons-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Nội dung chính - Quản lý đội nhóm môi giới</h2>
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
          :class="{ active: activeTab === 'hero' }"
          @click="activeTab = 'hero'"
      >
        <i class="fas fa-star"></i> Hero Section
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'dashboard' }"
          @click="activeTab = 'dashboard'"
      >
        <i class="fas fa-tachometer-alt"></i> Dashboard
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
          :class="{ active: activeTab === 'tools' }"
          @click="activeTab = 'tools'"
      >
        <i class="fas fa-tools"></i> Công cụ
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
          :class="{ active: activeTab === 'testimonials' }"
          @click="activeTab = 'testimonials'"
      >
        <i class="fas fa-comments"></i> Đánh giá
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'sections' }"
          @click="activeTab = 'sections'"
      >
        <i class="fas fa-layer-group"></i> Các phần
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'css' }"
          @click="activeTab = 'css'"
      >
        <i class="fas fa-palette"></i> CSS & Màu sắc
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Hero Section -->
      <div v-if="activeTab === 'hero'" class="hero-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-star"></i> Nội dung Hero</h3>

            <div class="form-group">
              <label for="heroBadgeText">Badge Text</label>
              <input
                  type="text"
                  id="heroBadgeText"
                  v-model="content.hero.badgeText"
                  placeholder="GIẢI PHÁP SỐ 1 CHO ĐỘI NHÓM MÔI GIỚI"
              />
            </div>

            <div class="form-group">
              <label for="heroTitleLine1">Tiêu đề dòng 1</label>
              <input
                  type="text"
                  id="heroTitleLine1"
                  v-model="content.hero.titleLine1"
                  placeholder="Quản lý đội nhóm"
              />
            </div>

            <div class="form-group">
              <label for="heroTitleLine2">Tiêu đề dòng 2</label>
              <input
                  type="text"
                  id="heroTitleLine2"
                  v-model="content.hero.titleLine2"
                  placeholder="môi giới chuyên nghiệp"
              />
            </div>

            <div class="form-group">
              <label for="heroDescription">Mô tả</label>
              <textarea
                  id="heroDescription"
                  v-model="content.hero.description"
                  rows="4"
                  placeholder="Tất cả công cụ bạn cần để xây dựng, quản lý và phát triển đội nhóm môi giới thành công trong một nền tảng duy nhất..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Nút 1</label>
              <div class="form-row">
                <div class="form-group">
                  <input type="text" v-model="content.hero.button1.text" placeholder="Bắt đầu miễn phí 14 ngày"/>
                </div>
                <div class="form-group">
                  <IconPicker v-model="content.hero.button1.icon"/>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Nút 2</label>
              <div class="form-row">
                <div class="form-group">
                  <input type="text" v-model="content.hero.button2.text" placeholder="Xem video demo"/>
                </div>
                <div class="form-group">
                  <IconPicker v-model="content.hero.button2.icon"/>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Thống kê</label>
              <div v-for="(stat, index) in content.hero.stats" :key="index" class="form-row"
                   style="margin-bottom: 15px;">
                <div class="form-group">
                  <input type="text" v-model="stat.value" :placeholder="'Giá trị ' + (index + 1)"/>
                </div>
                <div class="form-group flex flex-row gap-2">
                  <input type="text" v-model="stat.label" :placeholder="'Nhãn ' + (index + 1)"/>
                  <button class="btn-icon btn-danger" @click="removeHeroStat(index)" style="margin-top: 5px;">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <button class="btn btn-secondary" @click="addHeroStat">
                <i class="fas fa-plus"></i> Thêm thống kê
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Dashboard -->
      <div v-if="activeTab === 'dashboard'" class="dashboard-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-tachometer-alt"></i> Dashboard</h3>

            <div class="form-group">
              <label for="dashboardTitle">Tiêu đề</label>
              <input
                  type="text"
                  id="dashboardTitle"
                  v-model="content.dashboard.title"
                  placeholder="Dashboard Quản Lý"
              />
            </div>

            <div class="form-group">
              <label for="dashboardSubtitle">Phụ đề</label>
              <input
                  type="text"
                  id="dashboardSubtitle"
                  v-model="content.dashboard.subtitle"
                  placeholder="Xem trước hệ thống thông minh"
              />
            </div>

            <div class="form-group">
              <label>Thống kê Dashboard</label>
              <div v-for="(stat, index) in content.dashboard.stats" :key="index" class="form-row"
                   style="margin-bottom: 15px;">
                <div class="form-group">
                  <input type="text" v-model="stat.value" :placeholder="'Giá trị ' + (index + 1)"/>
                </div>
                <div class="form-group flex flex-row gap-2">
                  <input type="text" v-model="stat.label" :placeholder="'Nhãn ' + (index + 1)"/>
                  <button class="btn-icon btn-danger" @click="removeDashboardStat(index)" style="margin-top: 5px;">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <button class="btn btn-secondary" @click="addDashboardStat">
                <i class="fas fa-plus"></i> Thêm thống kê
              </button>
            </div>

            <div class="form-group">
              <label>Hiệu suất đội nhóm</label>
              <div class="form-row">
                <div class="form-group">
                  <input type="text" v-model="content.dashboard.performance.label" placeholder="Hiệu suất đội nhóm"/>
                </div>
                <div class="form-group">
                  <input type="text" v-model="content.dashboard.performance.value" placeholder="+35%"/>
                </div>
                <div class="form-group">
                  <input type="text" v-model="content.dashboard.performance.width" placeholder="85%"/>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Cấu trúc đội nhóm</label>
              <div class="form-group">
                <label>Trưởng nhóm</label>
                <div class="form-row">
                  <div class="form-group">
                    <input type="text" v-model="content.dashboard.teamStructure.leader.title"
                           placeholder="Trưởng nhóm"/>
                  </div>
                  <div class="form-group">
                    <input type="text" v-model="content.dashboard.teamStructure.leader.name"
                           placeholder="Nguyễn Văn A"/>
                  </div>
                </div>
              </div>

              <label>Nhóm</label>
              <div v-for="(team, index) in content.dashboard.teamStructure.teams" :key="index"
                   class="form-row border-bottom mt-5" style="margin-bottom: 15px;">
                <div class="form-group">
                  <input type="text" v-model="team.title" :placeholder="'Tên nhóm ' + (index + 1)"/>
                </div>
                <div class="form-group">
                  <input type="text" v-model="team.members" :placeholder="'Thành viên ' + (index + 1)"/>
                </div>
                <div class="form-group">
                  <input type="text" v-model="team.gradient" :placeholder="'Gradient ' + (index + 1)"/>

                </div>
                <button class="btn-icon btn-danger" @click="removeTeam(index)" style="margin-top: 5px;">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <button class="btn btn-secondary" @click="addTeam">
                <i class="fas fa-plus"></i> Thêm nhóm
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Features -->
      <div v-if="activeTab === 'features'" class="features-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-cog"></i> Danh sách tính năng</h3>
            <button class="btn btn-primary" @click="addFeature">
              <i class="fas fa-plus"></i> Thêm tính năng
            </button>
          </div>

          <div class="features-list">
            <div v-for="(feature, index) in content.features" :key="feature.id" class="feature-item">
              <div class="feature-header">
                <h4>Tính năng #{{ index + 1 }} - {{ feature.title || 'Chưa có tiêu đề' }}</h4>
                <div class="feature-actions">
                  <button class="btn-icon" @click="moveFeatureUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveFeatureDown(index)"
                          :disabled="index === content.features.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeFeature(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="feature.title" placeholder="Tuyển Dụng & Onboarding"/>
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="feature.description" rows="3"
                          placeholder="Hệ thống tuyển dụng thông minh, tự động onboarding và đào tạo thành viên mới với quy trình chuẩn hóa."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Màu sắc</label>
                  <select v-model="feature.color" @change="handleFeatureColorChange(index, $event)">
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
                      v-if="feature.color === 'custom'"
                      v-model="feature.customColor"
                      placeholder="Nhập mã màu tùy chỉnh"
                      return-type="hex" :colors="globalColors"
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
                  <label>AOS Delay</label>
                  <input type="text" v-model="feature.aosDelay" placeholder="0"/>
                </div>
              </div>

              <div class="form-group">
                <label>Nội dung danh sách</label>
                <div v-for="(item, itemIndex) in feature.listContent" :key="itemIndex" class="form-row"
                     style="margin-bottom: 10px;">
                  <input type="text" v-model="feature.listContent[itemIndex]" :placeholder="'Mục ' + (itemIndex + 1)"/>
                  <button class="btn-icon btn-danger" @click="removeFeatureListItem(index, itemIndex)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
                <button class="btn btn-secondary" @click="addFeatureListItem(index)">
                  <i class="fas fa-plus"></i> Thêm mục
                </button>
              </div>

              <div class="form-group">
                <label>Class biểu tượng danh sách</label>
                <IconPicker v-model="feature.listDotIconClass"/>
              </div>
            </div>

            <div v-if="content.features.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Chưa có tính năng nào. Hãy thêm tính năng đầu tiên!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Tools -->
      <div v-if="activeTab === 'tools'" class="tools-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-tools"></i> Danh sách công cụ</h3>
            <button class="btn btn-primary" @click="addTool">
              <i class="fas fa-plus"></i> Thêm công cụ
            </button>
          </div>

          <div class="tools-list">
            <div v-for="(tool, index) in content.tools" :key="tool.id" class="tool-item">
              <div class="tool-header">
                <h4>Công cụ #{{ index + 1 }} - {{ tool.value || 'Chưa có tiêu đề' }}</h4>
                <div class="tool-actions">
                  <button class="btn-icon" @click="moveToolUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveToolDown(index)"
                          :disabled="index === content.tools.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeTool(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="tool.value" placeholder="Quản Lý Tài Sản"/>
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <input type="text" v-model="tool.label" placeholder="Quản lý danh sách BĐS, phân phối và theo dõi"/>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Màu sắc</label>
                  <select v-model="tool.color">
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="emerald">Emerald</option>
                    <option value="green">Green</option>
                    <option value="amber">Amber</option>
                    <option value="red">Red</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <IconPicker v-model="tool.icon"/>
                </div>
              </div>
            </div>

            <div v-if="content.tools.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Chưa có công cụ nào. Hãy thêm công cụ đầu tiên!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Benefits -->
      <div v-if="activeTab === 'benefits'" class="benefits-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-chart-line"></i> Danh sách lợi ích</h3>
            <button class="btn btn-primary" @click="addBenefit">
              <i class="fas fa-plus"></i> Thêm lợi ích
            </button>
          </div>

          <div class="benefits-list">
            <div v-for="(benefit, index) in content.benefits" :key="benefit.id" class="benefit-item">
              <div class="benefit-header">
                <h4>Lợi ích #{{ index + 1 }} - {{ benefit.title || 'Chưa có tiêu đề' }}</h4>
                <div class="benefit-actions">
                  <button class="btn-icon" @click="moveBenefitUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveBenefitDown(index)"
                          :disabled="index === content.benefits.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeBenefit(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="benefit.title" placeholder="Tăng 300% Hiệu Suất"/>
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="benefit.description" rows="3"
                          placeholder="Đội nhóm hoạt động hiệu quả hơn với công cụ quản lý chuyên nghiệp và tự động hóa quy trình."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Màu sắc</label>
                  <select v-model="benefit.color" @change="handleBenefitColorChange(index, $event)">
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
                      v-if="benefit.color === 'custom'"
                      v-model="benefit.customColor"
                      placeholder="Nhập mã màu tùy chỉnh"
                      return-type="hex" :colors="globalColors"
                  />
                </div>
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <IconPicker v-model="benefit.iconName"/>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Số thống kê</label>
                  <input type="text" v-model="benefit.statNumber" placeholder="+300%"/>
                </div>
                <div class="form-group">
                  <label>Nhãn thống kê</label>
                  <input type="text" v-model="benefit.statLabel" placeholder="Thống kê thực tế:"/>
                </div>
              </div>

              <div class="form-group">
                <label>AOS Delay</label>
                <input type="text" v-model="benefit.aosDelay" placeholder="0"/>
              </div>
            </div>

            <div v-if="content.benefits.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Chưa có lợi ích nào. Hãy thêm lợi ích đầu tiên!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Testimonials -->
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
                  <button class="btn-icon" @click="moveTestimonialDown(index)"
                          :disabled="index === content.testimonials.length - 1">
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
                  <input type="text" v-model="testimonial.name" placeholder="Nguyễn Minh Tâm"/>
                </div>
                <div class="form-group">
                  <label>Vị trí</label>
                  <input type="text" v-model="testimonial.position" placeholder="Trưởng nhóm BĐS Q.2"/>
                </div>
              </div>

              <div class="form-group">
                <label>Trích dẫn</label>
                <textarea v-model="testimonial.quote" rows="3"
                          placeholder="Từ 3 thành viên ban đầu, sau 6 tháng đội nhóm tôi đã phát triển lên 15 người..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Chữ viết tắt</label>
                  <input type="text" v-model="testimonial.initials" placeholder="NT"/>
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
                      return-type="hex" :colors="globalColors"
                  />
                </div>
                <div class="form-group">
                  <label>Đánh giá (sao)</label>
                  <input type="number" v-model="testimonial.rating" min="1" max="5" placeholder="5"/>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>AOS</label>
                  <input type="text" v-model="testimonial.aos" placeholder="fade-up"/>
                </div>
                <div class="form-group">
                  <label>AOS Delay</label>
                  <input type="text" v-model="testimonial.aosDelay" placeholder="0"/>
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

      <!-- Tab Sections -->
      <div v-if="activeTab === 'sections'" class="sections-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-layer-group"></i> Tiêu đề các phần</h3>

            <div class="form-group">
              <label for="featuresTitle">Tính năng - Tiêu đề</label>
              <input type="text" id="featuresTitle" v-model="content.sections.features.title"
                     placeholder="Tất cả công cụ bạn cần trong"/>
            </div>

            <div class="form-group">
              <label for="featuresTitleHighlight">Tính năng - Tiêu đề nổi bật</label>
              <input type="text" id="featuresTitleHighlight" v-model="content.sections.features.titleHighlight"
                     placeholder="một nền tảng"/>
            </div>

            <div class="form-group">
              <label for="featuresDescription">Tính năng - Mô tả</label>
              <textarea id="featuresDescription" v-model="content.sections.features.description" rows="2"
                        placeholder="Hệ thống quản lý đội nhóm toàn diện với đầy đủ tính năng chuyên nghiệp"></textarea>
            </div>

            <div class="form-group">
              <label for="toolsTitle">Công cụ - Tiêu đề</label>
              <input type="text" id="toolsTitle" v-model="content.sections.tools.title"
                     placeholder="Bộ công cụ"/>
            </div>

            <div class="form-group">
              <label for="toolsTitleHighlight">Công cụ - Tiêu đề nổi bật</label>
              <input type="text" id="toolsTitleHighlight" v-model="content.sections.tools.titleHighlight"
                     placeholder="toàn diện"/>
            </div>

            <div class="form-group">
              <label for="toolsDescription">Công cụ - Mô tả</label>
              <textarea id="toolsDescription" v-model="content.sections.tools.description" rows="2"
                        placeholder="Khám phá tất cả công cụ chuyên nghiệp được tích hợp trong hệ thống"></textarea>
            </div>

            <div class="form-group">
              <label for="benefitsTitle">Lợi ích - Tiêu đề</label>
              <input type="text" id="benefitsTitle" v-model="content.sections.benefits.title"
                     placeholder="Lợi ích khi"/>
            </div>

            <div class="form-group">
              <label for="benefitsTitleHighlight">Lợi ích - Tiêu đề nổi bật</label>
              <input type="text" id="benefitsTitleHighlight" v-model="content.sections.benefits.titleHighlight"
                     placeholder="sử dụng"/>
            </div>

            <div class="form-group">
              <label for="benefitsDescription">Lợi ích - Mô tả</label>
              <textarea id="benefitsDescription" v-model="content.sections.benefits.description" rows="2"
                        placeholder="Những giá trị thực tế mang lại cho đội nhóm của bạn"></textarea>
            </div>

            <div class="form-group">
              <label for="testimonialsTitle">Đánh giá - Tiêu đề</label>
              <input type="text" id="testimonialsTitle" v-model="content.sections.testimonials.title"
                     placeholder="Được tin dùng bởi"/>
            </div>

            <div class="form-group">
              <label for="testimonialsTitleHighlight">Đánh giá - Tiêu đề nổi bật</label>
              <input type="text" id="testimonialsTitleHighlight" v-model="content.sections.testimonials.titleHighlight"
                     placeholder="2,500+ đội nhóm"/>
            </div>

            <div class="form-group">
              <label for="testimonialsDescription">Đánh giá - Mô tả</label>
              <textarea id="testimonialsDescription" v-model="content.sections.testimonials.description" rows="2"
                        placeholder="Những đội nhóm môi giới thành công đã tin tưởng lựa chọn chúng tôi"></textarea>
            </div>

            <div class="form-group">
              <label for="contactTitle">Liên hệ - Tiêu đề</label>
              <input type="text" id="contactTitle" v-model="content.sections.contact.title"
                     placeholder="Sẵn sàng phát triển đội nhóm của bạn?"/>
            </div>

            <div class="form-group">
              <label for="contactDescription">Liên hệ - Mô tả</label>
              <textarea id="contactDescription" v-model="content.sections.contact.description" rows="3"
                        placeholder="Đăng ký ngay để được tư vấn và trải nghiệm miễn phí hệ thống quản lý đội nhóm chuyên nghiệp"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Liên hệ - Nút</label>
                <input type="text" v-model="content.sections.contact.buttonText" placeholder="Đăng ký tư vấn miễn phí"/>
              </div>
              <div class="form-group">
                <label>Liên hệ - SĐT</label>
                <input type="text" v-model="content.sections.contact.phone" placeholder="1900 1234"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab CSS -->
      <div v-if="activeTab === 'css'" class="css-settings">
        <div class="settings-grid">
          <!-- Gradients -->
          <div class="setting-section">
            <h3><i class="fas fa-gradient"></i> Gradients</h3>

            <div class="form-group" v-for="(gradient, gradientKey) in content.css.gradients" :key="gradientKey">
              <label :for="`gradient-${gradientKey}`">{{ gradientKey }}</label>
              <div class="flex flex-col gap-3">
                <ColorInputWithGlobalColors
                    v-model="gradient.color1"
                    :placeholder="'Màu 1'"
                    return-type="hex"
                    :colors="globalColors"
                />
                <ColorInputWithGlobalColors
                    v-model="gradient.color2"
                    :placeholder="'Màu 2'"
                    return-type="hex"
                    :colors="globalColors"
                />
                <div class="gradient-preview"
                     :style="`background: linear-gradient(135deg, ${gradient.color1}, ${gradient.color2});`"></div>
              </div>
            </div>
          </div>

          <!-- Colors -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc</h3>

            <div class="color-input-group" v-for="(colorValue, colorKey) in content.css.colors" :key="colorKey">
              <label>{{ colorKey }}</label>
              <ColorInputWithGlobalColors
                  v-model="content.css.colors[colorKey]"
                  :placeholder="colorValue"
                  return-type="rgba"
                  :colors="globalColors"
              />
            </div>
          </div>

          <!-- Sizes -->
          <div class="setting-section">
            <h3><i class="fas fa-ruler"></i> Kích thước</h3>

            <div class="form-group" v-for="(sizeValue, sizeKey) in content.css.sizes" :key="sizeKey">
              <label :for="`size-${sizeKey}`">{{ sizeKey }}</label>
              <input
                  type="text"
                  :id="`size-${sizeKey}`"
                  v-model="content.css.sizes[sizeKey]"
                  :placeholder="sizeValue"
              />
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-video"></i> Video</h3>
            <div class="form-group">
              <label for="videoId">Youtube VideoID</label>
              <input
                  type="text"
                  id="videoId"
                  v-model="content.videoId"
                  placeholder="JZ1YvvYo2hA"
              />
              <button class="btn btn-secondary mt-3" @click="useLink =!useLink">
                <i class="fas fa-link"></i> Lấy bằng link
              </button>
              <div v-if="useLink" class="mt-2.5">
                <label for="videoId">Youtube Video Link</label>
                <input
                    type="text"
                    v-model="videoLink"
                    placeholder="JZ1YvvYo2hA"
                />
              </div>
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
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, watch} from 'vue'
import api from '../../../../api/api.js'
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
import ColorInputWithGlobalColors from "../homeNew/ColorInputWithGlobalColors.vue";

const useLink = ref(false)
const videoLink = ref("")

const getYtbId = (link) => {
  const match = link?.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

// Khi nhập link -> tự lấy ID
watch(videoLink, (newLink) => {
  if (!useLink.value) return

  const id = getYtbId(newLink)
  if (id) {
    content.videoId = id
  }
})

// Khi tắt chế độ dùng link thì clear link
watch(useLink, (val) => {
  if (!val) {
    videoLink.value = ""
  }
})
// ========== STATE MANAGEMENT ==========
const activeTab = ref('hero')
const isLoading = ref(false)

// Content structure based on JSON
const content = reactive({
  hero: {
    badgeText: "GIẢI PHÁP SỐ 1 CHO ĐỘI NHÓM MÔI GIỚI",
    titleLine1: "Quản lý đội nhóm",
    titleLine2: "môi giới chuyên nghiệp",
    description: "Tất cả công cụ bạn cần để xây dựng, quản lý và phát triển đội nhóm môi giới thành công trong một nền tảng duy nhất. Tối ưu hiệu suất, tăng doanh thu và mở rộng không giới hạn.",
    button1: {
      text: "Bắt đầu miễn phí 14 ngày",
      icon: "fas fa-play-circle"
    },
    button2: {
      text: "Xem video demo",
      icon: "fas fa-video"
    },
    stats: [
      {
        value: "2500",
        label: "Đội nhóm tin dùng"
      },
      {
        value: "98",
        label: "% Hài lòng"
      },
      {
        value: "300",
        label: "% Tăng hiệu suất"
      }
    ]
  },
  dashboard: {
    title: "Dashboard Quản Lý",
    subtitle: "Xem trước hệ thống thông minh",
    stats: [
      {
        value: "24",
        label: "Thành viên"
      },
      {
        value: "68",
        label: "BĐS đang bán"
      },
      {
        value: "42",
        label: "Giao dịch"
      }
    ],
    performance: {
      label: "Hiệu suất đội nhóm",
      value: "+35%",
      width: "85%"
    },
    teamStructure: {
      leader: {
        title: "Trưởng nhóm",
        name: "Nguyễn Văn A"
      },
      teams: [
        {
          title: "Nhóm 1",
          members: "8 thành viên",
          gradient: "secondary-gradient"
        },
        {
          title: "Nhóm 2",
          members: "12 thành viên",
          gradient: "info-gradient"
        }
      ]
    }
  },
  sections: {
    features: {
      title: "Tất cả công cụ bạn cần trong",
      titleHighlight: "một nền tảng",
      description: "Hệ thống quản lý đội nhóm toàn diện với đầy đủ tính năng chuyên nghiệp"
    },
    tools: {
      title: "Bộ công cụ",
      titleHighlight: "toàn diện",
      description: "Khám phá tất cả công cụ chuyên nghiệp được tích hợp trong hệ thống"
    },
    benefits: {
      title: "Lợi ích khi",
      titleHighlight: "sử dụng",
      description: "Những giá trị thực tế mang lại cho đội nhóm của bạn"
    },
    testimonials: {
      title: "Được tin dùng bởi",
      titleHighlight: "2,500+ đội nhóm",
      description: "Những đội nhóm môi giới thành công đã tin tưởng lựa chọn chúng tôi"
    },
    contact: {
      title: "Sẵn sàng phát triển đội nhóm của bạn?",
      description: "Đăng ký ngay để được tư vấn và trải nghiệm miễn phí hệ thống quản lý đội nhóm chuyên nghiệp",
      buttonText: "Đăng ký tư vấn miễn phí",
      phone: "1900 1234"
    }
  },
  features: [
    {
      id: 1,
      title: "Tuyển Dụng & Onboarding",
      iconName: "fas fa-user-plus",
      color: "purple",
      aosDelay: "0",
      description: "Hệ thống tuyển dụng thông minh, tự động onboarding và đào tạo thành viên mới với quy trình chuẩn hóa.",
      listContent: [
        "Portal tuyển dụng riêng",
        "Onboarding tự động",
        "Đào tạo E-learning"
      ],
      listDotIconClass: "fas fa-check-circle",
      customColor: ""
    },
    {
      id: 2,
      title: "Phân Cấp Đội Nhóm",
      iconName: "fas fa-sitemap",
      color: "blue",
      aosDelay: "100",
      description: "Thiết lập cơ cấu tổ chức linh hoạt với nhiều cấp độ quản lý, phân quyền chi tiết cho từng vị trí.",
      listContent: [
        "Cơ cấu đa cấp",
        "Phân quyền chi tiết",
        "Quản lý nhóm con"
      ],
      listDotIconClass: "fas fa-check-circle",
      customColor: ""
    },
    {
      id: 3,
      title: "Theo Dõi Hiệu Suất",
      iconName: "fas fa-chart-line",
      color: "teal",
      aosDelay: "200",
      description: "Dashboard real-time theo dõi KPI, doanh số và hiệu suất từng thành viên với báo cáo chi tiết.",
      listContent: [
        "KPI cá nhân & đội nhóm",
        "Báo cáo real-time",
        "Cảnh báo tự động"
      ],
      listDotIconClass: "fas fa-check-circle",
      customColor: ""
    },
    {
      id: 4,
      title: "Tính Hoa Hồng Tự Động",
      iconName: "fas fa-money-bill-wave",
      color: "amber",
      aosDelay: "0",
      description: "Hệ thống tính hoa hồng thông minh với nhiều mô hình, tự động tính toán và thanh toán minh bạch.",
      listContent: [
        "Nhiều mô hình hoa hồng",
        "Tính toán tự động",
        "Thanh toán online"
      ],
      listDotIconClass: "fas fa-check-circle",
      customColor: ""
    },
    {
      id: 5,
      title: "Giao Tiếp & Cộng Tác",
      iconName: "fas fa-comments",
      color: "pink",
      aosDelay: "100",
      description: "Nền tảng giao tiếp nội bộ, chia sẻ kiến thức và cộng tác hiệu quả trong đội nhóm.",
      listContent: [
        "Chat nhóm & riêng tư",
        "Thư viện kiến thức",
        "Meeting online"
      ],
      listDotIconClass: "fas fa-check-circle",
      customColor: ""
    },
    {
      id: 6,
      title: "Mobile App Quản Lý",
      iconName: "fas fa-mobile-alt",
      color: "purple",
      aosDelay: "200",
      description: "Ứng dụng di động đầy đủ tính năng, quản lý đội nhóm mọi lúc mọi nơi trên iOS và Android.",
      listContent: [
        "iOS & Android",
        "Push notification",
        "Quản lý offline"
      ],
      listDotIconClass: "fas fa-check-circle",
      customColor: ""
    }
  ],
  tools: [
    {
      id: 1,
      value: "Quản Lý Tài Sản",
      label: "Quản lý danh sách BĐS, phân phối và theo dõi",
      color: "blue",
      icon: "fas fa-home"
    },
    {
      id: 2,
      value: "Lịch Dẫn Khách",
      label: "Lên lịch, nhắc nhở và quản lý lịch trình",
      color: "purple",
      icon: "fas fa-calendar-alt"
    },
    {
      id: 3,
      value: "Báo Cáo & Phân Tích",
      label: "Báo cáo chi tiết, phân tích xu hướng",
      color: "emerald",
      icon: "fas fa-chart-pie"
    },
    {
      id: 4,
      value: "Quản Lý Hợp Đồng",
      label: "Tạo, lưu trữ và theo dõi hợp đồng",
      color: "amber",
      icon: "fas fa-file-contract"
    }
  ],
  testimonials: [
    {
      id: 1,
      name: "Nguyễn Minh Tâm",
      position: "Trưởng nhóm BĐS Q.2",
      quote: "Từ 3 thành viên ban đầu, sau 6 tháng đội nhóm tôi đã phát triển lên 15 người. Hệ thống quản lý của Thiên Hà giúp tôi tiết kiệm 70% thời gian quản lý.",
      initials: "NT",
      color: "purple",
      rating: 5,
      aos: "fade-up",
      aosDelay: "0",
      customColor: ""
    },
    {
      id: 2,
      name: "Công ty BĐS Sài Gòn Land",
      position: "50+ thành viên",
      quote: "Sau khi triển khai hệ thống, hiệu suất đội nhóm tăng 300%, chi phí quản lý giảm 60%. Tính minh bạch trong hoa hồng giúp giữ chân nhân tài tốt hơn.",
      initials: "SGL",
      color: "blue",
      rating: 5,
      aos: "fade-up",
      aosDelay: "100",
      customColor: ""
    },
    {
      id: 3,
      name: "Lê Thị Hồng",
      position: "Startup môi giới",
      quote: "Khởi nghiệp với 2 người, nhờ hệ thống onboarding và đào tạo tự động, tôi đã mở rộng lên 8 thành viên chỉ trong 3 tháng mà không cần nhiều kinh nghiệm quản lý.",
      initials: "LH",
      color: "emerald",
      rating: 5,
      aos: "fade-up",
      aosDelay: "200",
      customColor: ""
    }
  ],
  benefits: [
    {
      id: 1,
      title: "Tăng 300% Hiệu Suất",
      iconName: "fas fa-chart-line",
      color: "pink",
      aosDelay: "0",
      statNumber: "+300%",
      statLabel: "Thống kê thực tế:",
      description: "Đội nhóm hoạt động hiệu quả hơn với công cụ quản lý chuyên nghiệp và tự động hóa quy trình.",
      customColor: ""
    },
    {
      id: 2,
      title: "Giảm 80% Chi Phí",
      iconName: "fas fa-money-bill-wave",
      color: "purple",
      aosDelay: "100",
      statNumber: "80%",
      statLabel: "Tiết kiệm trung bình:",
      description: "Tiết kiệm chi phí quản lý, đào tạo và vận hành đội nhóm với hệ thống tự động hóa.",
      customColor: ""
    },
    {
      id: 3,
      title: "0% Turnover Rate",
      iconName: "fas fa-users",
      color: "blue",
      aosDelay: "200",
      statNumber: "0%",
      statLabel: "Tỷ lệ nghỉ việc:",
      description: "Tính minh bạch trong hoa hồng và môi trường làm việc chuyên nghiệp giúp giữ chân nhân tài.",
      customColor: ""
    }
  ],
  videoId: "JZ1YvvYo2hA",
  css: {
    gradients: {
      primary: {
        color1: "#8b5cf6",
        color2: "#ec4899"
      },
      secondary: {
        color1: "#6366f1",
        color2: "#8b5cf6"
      },
      success: {
        color1: "#10b981",
        color2: "#34d399"
      },
      warning: {
        color1: "#f59e0b",
        color2: "#fbbf24"
      },
      info: {
        color1: "#3b82f6",
        color2: "#60a5fa"
      }
    },
    colors: {
      darkBg: "#0f172a",
      darkerBg: "#020617",
      purpleLight: "rgba(139, 92, 246, 0.1)",
      pinkLight: "rgba(236, 72, 153, 0.1)"
    },
    sizes: {
      heroCardWidth: "200px",
      featureIconSize: "70px"
    }
  }
})

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// ========== CONSTANTS ==========
const SECTION_ID = 60

// ========== HELPER FUNCTIONS ==========
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

const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000)
}

const globalColors = ref({});

const loadDataColors = async () => {
  const response = await api.get('/cms/getSection/55')
  const parsedJSON = JSON.parse(response.data.contentJson)
  globalColors.value = parsedJSON.colors || {}
}

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get(`/thg/public/cms/contentSection/${SECTION_ID}`)

    if (response.data && response.data.contentJson) {
      const data = typeof response.data.contentJson === 'string'
          ? JSON.parse(response.data.contentJson)
          : response.data.contentJson

      // Update content with loaded data
      Object.assign(content, data)

      // Parse gradients to object format
      parseGradients()

      // Initialize custom colors for features, testimonials, and benefits
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

// Parse gradients from string to object format
const parseGradients = () => {
  if (content.css && content.css.gradients) {
    const gradients = content.css.gradients
    for (const key in gradients) {
      if (typeof gradients[key] === 'string') {
        const match = gradients[key].match(/linear-gradient\(135deg,\s*(#[0-9a-fA-F]+)\s*0%,\s*(#[0-9a-fA-F]+)\s*100%\)/)
        if (match) {
          gradients[key] = {
            color1: match[1],
            color2: match[2]
          }
        } else {
          gradients[key] = {
            color1: '#000000',
            color2: '#000000'
          }
        }
      }
    }
  }
}

// Convert gradients object to string for saving
const stringifyGradients = () => {
  if (content.css && content.css.gradients) {
    const gradients = content.css.gradients
    const result = {}
    for (const key in gradients) {
      if (gradients[key].color1 && gradients[key].color2) {
        result[key] = `linear-gradient(135deg, ${gradients[key].color1} 0%, ${gradients[key].color2} 100%)`
      }
    }
    return result
  }
  return {}
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare content data - convert custom colors to proper format
    const contentData = JSON.parse(JSON.stringify(content))

    // Convert feature colors
    contentData.features = contentData.features.map(feature => {
      const featureCopy = {...feature}
      if (featureCopy.color === 'custom' && featureCopy.customColor) {
        featureCopy.color = featureCopy.customColor
      }
      delete featureCopy.customColor
      return featureCopy
    })

    // Convert testimonial colors
    contentData.testimonials = contentData.testimonials.map(testimonial => {
      const testimonialCopy = {...testimonial}
      if (testimonialCopy.color === 'custom' && testimonialCopy.customColor) {
        testimonialCopy.color = testimonialCopy.customColor
      }
      delete testimonialCopy.customColor
      return testimonialCopy
    })

    // Convert benefit colors
    contentData.benefits = contentData.benefits.map(benefit => {
      const benefitCopy = {...benefit}
      if (benefitCopy.color === 'custom' && benefitCopy.customColor) {
        benefitCopy.color = benefitCopy.customColor
      }
      delete benefitCopy.customColor
      return benefitCopy
    })

    // Convert gradients to string format
    contentData.css.gradients = stringifyGradients()

    // Prepare FormData
    const formData = new FormData()

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Nội dung chính',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 0
    }

    // Add section data
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }))

    // Send to API
    const response = await api.post('/cms/saveChange', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data) {
      showToast('Thay đổi đã được lưu thành công', 'success')

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

// Hàm khởi tạo customColor từ dữ liệu hiện có
const initializeCustomColors = () => {
  // Định nghĩa danh sách màu hợp lệ
  const featureColorOptions = ['blue', 'purple', 'teal', 'pink', 'amber', 'orange', 'sky', 'cyan']
  const testimonialColorOptions = ['blue', 'purple', 'emerald', 'indigo', 'pink']
  const benefitColorOptions = ['blue', 'purple', 'teal', 'pink', 'amber', 'orange', 'sky', 'cyan']

  // Khởi tạo cho features
  if (content.features) {
    content.features.forEach(feature => {
      if (!featureColorOptions.includes(feature.color) && feature.color !== 'custom') {
        feature.customColor = feature.color
        feature.color = 'custom'
      }

      if (!feature.customColor) {
        feature.customColor = ''
      }
    })
  }

  // Khởi tạo cho testimonials
  if (content.testimonials) {
    content.testimonials.forEach(testimonial => {
      if (!testimonialColorOptions.includes(testimonial.color) && testimonial.color !== 'custom') {
        testimonial.customColor = testimonial.color
        testimonial.color = 'custom'
      }

      if (!testimonial.customColor) {
        testimonial.customColor = ''
      }
    })
  }

  // Khởi tạo cho benefits
  if (content.benefits) {
    content.benefits.forEach(benefit => {
      if (!benefitColorOptions.includes(benefit.color) && benefit.color !== 'custom') {
        benefit.customColor = benefit.color
        benefit.color = 'custom'
      }

      if (!benefit.customColor) {
        benefit.customColor = ''
      }
    })
  }
}

// ========== COLOR HANDLING FUNCTIONS ==========
const handleFeatureColorChange = (index, event) => {
  const selectedColor = event.target.value
  const feature = content.features[index]

  if (selectedColor !== 'custom') {
    feature.customColor = ''
  }
}

const handleTestimonialColorChange = (index, event) => {
  const selectedColor = event.target.value
  const testimonial = content.testimonials[index]

  if (selectedColor !== 'custom') {
    testimonial.customColor = ''
  }
}

const handleBenefitColorChange = (index, event) => {
  const selectedColor = event.target.value
  const benefit = content.benefits[index]

  if (selectedColor !== 'custom') {
    benefit.customColor = ''
  }
}

// ========== HERO MANAGEMENT ==========
const addHeroStat = () => {
  if (!content.hero.stats) {
    content.hero.stats = []
  }
  content.hero.stats.push({
    value: "",
    label: ""
  })
  showToast('Đã thêm thống kê mới', 'success')
}

const removeHeroStat = (index) => {
  if (confirm('Bạn có chắc muốn xóa thống kê này?')) {
    content.hero.stats.splice(index, 1)
    showToast('Đã xóa thống kê', 'success')
  }
}

// ========== DASHBOARD MANAGEMENT ==========
const addDashboardStat = () => {
  if (!content.dashboard.stats) {
    content.dashboard.stats = []
  }
  content.dashboard.stats.push({
    value: "",
    label: ""
  })
  showToast('Đã thêm thống kê dashboard mới', 'success')
}

const removeDashboardStat = (index) => {
  if (confirm('Bạn có chắc muốn xóa thống kê này?')) {
    content.dashboard.stats.splice(index, 1)
    showToast('Đã xóa thống kê dashboard', 'success')
  }
}

const addTeam = () => {
  if (!content.dashboard.teamStructure.teams) {
    content.dashboard.teamStructure.teams = []
  }
  content.dashboard.teamStructure.teams.push({
    title: "",
    members: "",
    gradient: ""
  })
  showToast('Đã thêm nhóm mới', 'success')
}

const removeTeam = (index) => {
  if (confirm('Bạn có chắc muốn xóa nhóm này?')) {
    content.dashboard.teamStructure.teams.splice(index, 1)
    showToast('Đã xóa nhóm', 'success')
  }
}

// ========== FEATURES MANAGEMENT ==========
const addFeature = () => {
  if (!content.features) {
    content.features = []
  }
  content.features.push({
    id: generateId(),
    title: "",
    description: "",
    color: "blue",
    customColor: "",
    iconName: "fas fa-star",
    aosDelay: "0",
    listContent: [],
    listDotIconClass: "fas fa-check-circle"
  })
  showToast('Đã thêm tính năng mới', 'success')
}

const removeFeature = (index) => {
  if (confirm('Bạn có chắc muốn xóa tính năng này?')) {
    content.features.splice(index, 1)
    showToast('Đã xóa tính năng', 'success')
  }
}

const moveFeatureUp = (index) => {
  if (index > 0) {
    const temp = content.features[index]
    content.features[index] = content.features[index - 1]
    content.features[index - 1] = temp
  }
}

const moveFeatureDown = (index) => {
  if (index < content.features.length - 1) {
    const temp = content.features[index]
    content.features[index] = content.features[index + 1]
    content.features[index + 1] = temp
  }
}

const addFeatureListItem = (featureIndex) => {
  if (!content.features[featureIndex].listContent) {
    content.features[featureIndex].listContent = []
  }
  content.features[featureIndex].listContent.push("")
}

const removeFeatureListItem = (featureIndex, itemIndex) => {
  if (confirm('Bạn có chắc muốn xóa mục này?')) {
    content.features[featureIndex].listContent.splice(itemIndex, 1)
  }
}

// ========== TOOLS MANAGEMENT ==========
const addTool = () => {
  if (!content.tools) {
    content.tools = []
  }
  content.tools.push({
    id: generateId(),
    value: "",
    label: "",
    color: "blue",
    icon: "fas fa-star"
  })
  showToast('Đã thêm công cụ mới', 'success')
}

const removeTool = (index) => {
  if (confirm('Bạn có chắc muốn xóa công cụ này?')) {
    content.tools.splice(index, 1)
    showToast('Đã xóa công cụ', 'success')
  }
}

const moveToolUp = (index) => {
  if (index > 0) {
    const temp = content.tools[index]
    content.tools[index] = content.tools[index - 1]
    content.tools[index - 1] = temp
  }
}

const moveToolDown = (index) => {
  if (index < content.tools.length - 1) {
    const temp = content.tools[index]
    content.tools[index] = content.tools[index + 1]
    content.tools[index + 1] = temp
  }
}

// ========== BENEFITS MANAGEMENT ==========
const addBenefit = () => {
  if (!content.benefits) {
    content.benefits = []
  }
  content.benefits.push({
    id: generateId(),
    title: "",
    description: "",
    color: "blue",
    customColor: "",
    iconName: "fas fa-chart-line",
    aosDelay: "0",
    statNumber: "",
    statLabel: ""
  })
  showToast('Đã thêm lợi ích mới', 'success')
}

const removeBenefit = (index) => {
  if (confirm('Bạn có chắc muốn xóa lợi ích này?')) {
    content.benefits.splice(index, 1)
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

// ========== TESTIMONIALS MANAGEMENT ==========
const addTestimonial = () => {
  if (!content.testimonials) {
    content.testimonials = []
  }
  content.testimonials.push({
    id: generateId(),
    name: "",
    position: "",
    quote: "",
    initials: "",
    color: "blue",
    customColor: "",
    rating: 5,
    aos: "fade-up",
    aosDelay: "0"
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
.features-list,
.tools-list,
.benefits-list,
.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item,
.tool-item,
.benefit-item,
.testimonial-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.feature-item:hover,
.tool-item:hover,
.benefit-item:hover,
.testimonial-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.feature-header,
.tool-header,
.benefit-header,
.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.feature-header h4,
.tool-header h4,
.benefit-header h4,
.testimonial-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1rem;
}

.feature-actions,
.tool-actions,
.benefit-actions,
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

  .feature-header,
  .tool-header,
  .benefit-header,
  .testimonial-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .feature-actions,
  .tool-actions,
  .benefit-actions,
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

.gradient-preview {
  width: 100%;
  height: 50px;
  border-radius: 8px;
  border: 1px solid #e9ecef;

}
</style>