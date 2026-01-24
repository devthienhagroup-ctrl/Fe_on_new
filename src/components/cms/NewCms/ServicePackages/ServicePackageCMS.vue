<template>
  <div class="reasons-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Nội dung gói dịch vụ - Thiên Hà Group</h2>
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
        <i class="fas fa-palette"></i> Màu sắc & CSS
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
          :class="{ active: activeTab === 'packages' }"
          @click="activeTab = 'packages'"
      >
        <i class="fas fa-box"></i> Gói dịch vụ
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
          :class="{ active: activeTab === 'comparison' }"
          @click="activeTab = 'comparison'"
      >
        <i class="fas fa-chart-bar"></i> So sánh
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'finalCta' }"
          @click="activeTab = 'finalCta'"
      >
        <i class="fas fa-rocket"></i> Kêu gọi hành động
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'buttons' }"
          @click="activeTab = 'buttons'"
      >
        <i class="fas fa-mouse-pointer"></i> Nút bấm
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'modal' }"
          @click="activeTab = 'modal'"
      >
        <i class="fas fa-window-maximize"></i> Modal
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Màu sắc & CSS -->
      <div v-if="activeTab === 'css'" class="styles-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc CSS</h3>

            <!-- Color variables section - rendered with v-for -->
            <div class="color-input-group" v-for="(colorValue, colorKey) in filteredCssColors" :key="colorKey">
              <label>{{ colorKey }}</label>
              <ColorInputWithGlobalColors
                  v-model="content.css[colorKey]"
                  :placeholder="colorValue"
                  return-type="key"
                  :colors="globalColors"
              />
            </div>

            <!-- Non-color values section - manually written -->
            <div class="input-group">
              <label>Border Opacity</label>
              <input
                  v-model="content.css.borderOpacity"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="0.08"
              />
            </div>

            <div class="input-group">
              <label>Float Duration</label>
              <input
                  v-model="content.css.floatDuration"
                  type="text"
                  placeholder="6s"
              />
            </div>

            <div class="input-group">
              <label>Pulse Duration</label>
              <input
                  v-model="content.css.pulseDuration"
                  type="text"
                  placeholder="2s"
              />
            </div>

            <div class="input-group">
              <label>Glow Duration</label>
              <input
                  v-model="content.css.glowDuration"
                  type="text"
                  placeholder="3s"
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
              <label for="heroBadgeIcon">Biểu tượng Badge</label>
              <div class="input-with-icon">
                <IconPicker v-model="heroBadgeIconBase" />
              </div>
              <input
                  type="text"
                  v-model="heroBadgeIconStyle"
                  placeholder="text-purple-400 mr-2"
                  class="mt-2"
              />
              <small class="form-text">Icon: {{ heroBadgeIconBase }} {{ heroBadgeIconStyle }}</small>
            </div>

            <div class="form-group">
              <label for="heroBadgeText">Văn bản Badge</label>
              <input
                  type="text"
                  id="heroBadgeText"
                  v-model="content.hero.badge.text"
                  placeholder="CÔNG CỤ SỐ 1 CHO MÔI GIỚI BĐS VIỆT NAM"
              />
            </div>

            <div class="form-group">
              <label for="heroTitleLine1">Tiêu đề dòng 1</label>
              <input
                  type="text"
                  id="heroTitleLine1"
                  v-model="content.hero.title.line1"
                  placeholder="Chọn gói phù hợp"
              />
            </div>

            <div class="form-group">
              <label for="heroTitleLine2">Tiêu đề dòng 2</label>
              <input
                  type="text"
                  id="heroTitleLine2"
                  v-model="content.hero.title.line2"
                  placeholder="cho sự nghiệp của bạn"
              />
            </div>

            <div class="form-group">
              <label for="heroDescription">Mô tả</label>
              <textarea
                  id="heroDescription"
                  v-model="content.hero.description"
                  rows="4"
                  placeholder="Không phải gói nào cũng phù hợp với mọi người..."
              ></textarea>
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-chart-line"></i> Thống kê Hero</h3>

            <div class="form-group">
              <label for="heroStatsUsersCount">Số lượng người dùng</label>
              <input
                  type="text"
                  id="heroStatsUsersCount"
                  v-model="content.hero.stats.users.count"
                  placeholder="5,000+"
              />
            </div>

            <div class="form-group">
              <label for="heroStatsUsersLabel">Nhãn người dùng</label>
              <input
                  type="text"
                  id="heroStatsUsersLabel"
                  v-model="content.hero.stats.users.label"
                  placeholder="Môi giới đã lựa chọn"
              />
            </div>

            <div class="form-group">
              <label for="heroSecurityIcon">Biểu tượng bảo mật</label>
              <div class="input-with-icon">
                <IconPicker v-model="heroSecurityIconBase" />
              </div>
              <input
                  type="text"
                  v-model="heroSecurityIconStyle"
                  placeholder="text-emerald-400 text-xl mr-3"
                  class="mt-2"
              />
              <small class="form-text">Icon: {{ heroSecurityIconBase }} {{ heroSecurityIconStyle }}</small>
            </div>

            <div class="form-group">
              <label for="heroSecurityTitle">Tiêu đề bảo mật</label>
              <input
                  type="text"
                  id="heroSecurityTitle"
                  v-model="content.hero.stats.security.title"
                  placeholder="Bảo mật tuyệt đối"
              />
            </div>

            <div class="form-group">
              <label for="heroSecurityDescription">Mô tả bảo mật</label>
              <input
                  type="text"
                  id="heroSecurityDescription"
                  v-model="content.hero.stats.security.description"
                  placeholder="Dữ liệu được mã hóa"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Gói dịch vụ -->
      <div v-if="activeTab === 'packages'" class="packages-settings">
        <div class="settings-grid">
          <!-- Gói Plus -->
          <div class="setting-section">
            <div class="section-header">
              <h3><i class="fas fa-star"></i> Gói Plus</h3>
            </div>

            <div class="form-group">
              <label>Icon</label>
              <div class="input-with-icon">
                <IconPicker v-model="content.packages.plus.icon" />
              </div>
            </div>

            <div class="form-group">
              <label>Tagline</label>
              <input type="text" v-model="content.packages.plus.tagline" placeholder="Khởi đầu vững chắc" />
            </div>

            <div class="form-group">
              <label>Mô tả xem trước</label>
              <textarea v-model="content.packages.plus.previewDescription" rows="3" placeholder="Dành cho môi giới mới bắt đầu..."></textarea>
            </div>

            <div class="form-group">
              <label>Features (mỗi dòng 1 feature)</label>
              <textarea v-model="packageFeatures.plus" rows="4" placeholder="• 50 BĐS được quản lý"></textarea>
              <small class="form-text">Mỗi tính năng trên một dòng, bắt đầu bằng •</small>
            </div>

            <div class="form-group">
              <label>Giá</label>
              <input type="text" v-model="content.packages.plus.price" placeholder="199.000đ/tháng" />
            </div>

            <div class="form-group">
              <label>Chi tiết mô tả</label>
              <textarea v-model="content.packages.plus.detailDescription" rows="3" placeholder="Dành cho môi giới mới bắt đầu..."></textarea>
            </div>

            <div class="form-group">
              <label>Text CTA</label>
              <input type="text" v-model="content.packages.plus.cta" placeholder="Đăng ký Gói Plus" />
            </div>
          </div>

          <!-- Gói Pro -->
          <div class="setting-section">
            <div class="section-header">
              <h3><i class="fas fa-gem"></i> Gói Pro</h3>
            </div>

            <div class="form-group">
              <label>Icon</label>
              <div class="input-with-icon">
                <IconPicker v-model="content.packages.pro.icon" />
              </div>
            </div>

            <div class="form-group">
              <label>Tagline</label>
              <input type="text" v-model="content.packages.pro.tagline" placeholder="Lựa chọn thông minh" />
            </div>

            <div class="form-group">
              <label>Badge</label>
              <input type="text" v-model="content.packages.pro.badge" placeholder="PHỔ BIẾN NHẤT" />
            </div>

            <div class="form-group">
              <label>Mô tả xem trước</label>
              <textarea v-model="content.packages.pro.previewDescription" rows="3" placeholder="Đầy đủ công cụ cho môi giới chuyên nghiệp..."></textarea>
            </div>

            <div class="form-group">
              <label>Features (mỗi dòng 1 feature)</label>
              <textarea v-model="packageFeatures.pro" rows="4" placeholder="• 100 BĐS được quản lý"></textarea>
              <small class="form-text">Mỗi tính năng trên một dòng, bắt đầu bằng •</small>
            </div>

            <div class="form-group">
              <label>Giá</label>
              <input type="text" v-model="content.packages.pro.price" placeholder="499.000đ/tháng" />
            </div>

            <div class="form-group">
              <label>Text CTA</label>
              <input type="text" v-model="content.packages.pro.cta" placeholder="CHỌN GÓI PRO - THÔNG MINH NHẤT" />
            </div>
          </div>

          <!-- Gói Premium -->
          <div class="setting-section">
            <div class="section-header">
              <h3><i class="fas fa-crown"></i> Gói Premium</h3>
            </div>

            <div class="form-group">
              <label>Icon</label>
              <div class="input-with-icon">
                <IconPicker v-model="content.packages.premium.icon" />
              </div>
            </div>

            <div class="form-group">
              <label>Tagline</label>
              <input type="text" v-model="content.packages.premium.tagline" placeholder="Dành cho người dẫn đầu" />
            </div>

            <div class="form-group">
              <label>Mô tả xem trước</label>
              <textarea v-model="content.packages.premium.previewDescription" rows="3" placeholder="Tất cả tính năng cao cấp..."></textarea>
            </div>

            <div class="form-group">
              <label>Features (mỗi dòng 1 feature)</label>
              <textarea v-model="packageFeatures.premium" rows="4" placeholder="• 150 BĐS được quản lý"></textarea>
              <small class="form-text">Mỗi tính năng trên một dòng, bắt đầu bằng •</small>
            </div>

            <div class="form-group">
              <label>Giá</label>
              <input type="text" v-model="content.packages.premium.price" placeholder="599.000đ/tháng" />
            </div>

            <div class="form-group">
              <label>Text CTA</label>
              <input type="text" v-model="content.packages.premium.cta" placeholder="NÂNG CẤP LÊN PREMIUM" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Lợi ích -->
      <div v-if="activeTab === 'benefits'" class="benefits-settings">
        <div class="setting-section">
          <h3><i class="fas fa-gift"></i> Lợi ích</h3>

          <div class="form-group">
            <label>Tiêu đề dòng 1</label>
            <input type="text" v-model="content.benefits.title.line1" placeholder="Vì sao nên đầu tư vào" />
          </div>

          <div class="form-group">
            <label>Tiêu đề dòng 2</label>
            <input type="text" v-model="content.benefits.title.line2" placeholder="công cụ này?" />
          </div>

          <div class="form-group">
            <label>Phụ đề</label>
            <input type="text" v-model="content.benefits.subtitle" placeholder="Không phải là chi phí..." />
          </div>

          <div class="section-header">
            <h4>Danh sách lợi ích</h4>
            <button class="btn btn-primary" @click="addBenefit">
              <i class="fas fa-plus"></i> Thêm lợi ích
            </button>
          </div>

          <div v-for="(benefit, index) in content.benefits.items" :key="index" class="benefit-item">
            <div class="benefit-header">
              <h5>Lợi ích #{{ index + 1 }}</h5>
              <button class="btn-icon btn-danger" @click="removeBenefit(index)">
                <i class="fas fa-trash"></i>
              </button>
            </div>

            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" v-model="benefit.title" placeholder="Tiết kiệm 15 giờ/tuần" />
            </div>

            <div class="form-group">
              <label>Icon</label>
              <div class="input-with-icon">
                <IconPicker v-model="benefit.icon" />
              </div>
            </div>

            <div class="form-group">
              <label>Màu sắc</label>
              <select v-model="benefit.color" class="color-select" @change="handleBenefitColorChange(benefit)">
                <option v-for="color in benefitColors" :value="color">{{ color }}</option>
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

            <div class="form-group">
              <label>Thống kê số</label>
              <input type="text" v-model="benefit.stat.number" placeholder="15 giờ/tuần" />
            </div>

            <div class="form-group">
              <label>Nhãn thống kê</label>
              <input type="text" v-model="benefit.stat.label" placeholder="Thời gian tiết kiệm:" />
            </div>

            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="benefit.description" rows="3" placeholder="Tự động hóa công việc thủ công..."></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab So sánh -->
      <div v-if="activeTab === 'comparison'" class="comparison-settings">
        <div class="">
          <div class="setting-section">
            <h3><i class="fas fa-chart-bar"></i> So sánh gói</h3>

            <div class="form-group">
              <label>Tiêu đề dòng 1</label>
              <input type="text" v-model="content.comparison.title.line1" placeholder="So sánh để thấy" />
            </div>

            <div class="form-group">
              <label>Tiêu đề dòng 2</label>
              <input type="text" v-model="content.comparison.title.line2" placeholder="sự khác biệt rõ ràng" />
            </div>

            <div class="form-group">
              <label>Phụ đề</label>
              <input type="text" v-model="content.comparison.subtitle" placeholder="Lựa chọn gói phù hợp..." />
            </div>

            <div class="form-group">
              <label>Tiêu đề cột tính năng</label>
              <input type="text" v-model="content.comparison.tableHeaders.feature" placeholder="Tính năng" />
            </div>

            <div class="form-group">
              <label>Icon lời khuyên</label>
              <div class="input-with-icon">
                <IconPicker v-model="comparisonTipIconBase" />
              </div>
              <input
                  type="text"
                  v-model="comparisonTipIconStyle"
                  placeholder="text-amber-400 mr-2"
                  class="mt-2"
              />
            </div>

            <div class="form-group">
              <label>Lời khuyên - Nhãn</label>
              <input type="text" v-model="content.comparison.tip.label" placeholder="Lời khuyên:" />
            </div>

            <div class="form-group">
              <label>Lời khuyên - Nội dung</label>
              <input type="text" v-model="content.comparison.tip.text" placeholder="Nếu bạn nghiêm túc với nghề..." />
            </div>

            <div class="section-header">
              <h4>Danh sách tính năng so sánh</h4>
              <button class="btn btn-primary" @click="addComparisonFeature">
                <i class="fas fa-plus"></i> Thêm tính năng
              </button>
            </div>

            <div v-for="(feature, index) in content.comparison.features" :key="index" class="feature-item">
              <div class="feature-header">
                <h5>Tính năng #{{ index + 1 }}</h5>
                <button class="btn-icon btn-danger" @click="removeComparisonFeature(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <div class="form-group">
                <label>Tên tính năng</label>
                <input type="text" v-model="feature.name" placeholder="Định giá BĐS" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Gói Plus</label>
                  <input type="text" v-model="feature.plus.value" placeholder="10 lượt/tháng" />
                  <input type="text" v-model="feature.plus.class" placeholder="text-slate-50 font-semibold" class="mt-1" />
                </div>
                <div class="form-group">
                  <label>Gói Pro</label>
                  <input type="text" v-model="feature.pro.value" placeholder="50 lượt/tháng" />
                  <input type="text" v-model="feature.pro.class" placeholder="text-slate-50 font-semibold" class="mt-1" />
                  <input type="text" v-model="feature.pro.note" placeholder="+400% giá trị" class="mt-1" />
                </div>
                <div class="form-group">
                  <label>Gói Premium</label>
                  <input type="text" v-model="feature.premium.value" placeholder="150 lượt/tháng" />
                  <input type="text" v-model="feature.premium.class" placeholder="text-slate-50 font-semibold" class="mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Kêu gọi hành động -->
      <div v-if="activeTab === 'finalCta'" class="finalcta-settings">
        <div class="">
          <div class="setting-section">
            <h3><i class="fas fa-rocket"></i> Kêu gọi hành động</h3>

            <div class="form-group">
              <label>Icon</label>
              <div class="input-with-icon">
                <IconPicker v-model="finalCtaIconBase" />
              </div>
              <input
                  type="text"
                  v-model="finalCtaIconStyle"
                  placeholder="text-slate-50 text-3xl"
                  class="mt-2"
              />
            </div>

            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" v-model="content.finalCta.title" placeholder="Bạn có 2 lựa chọn:" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Lựa chọn 1 - Tiêu đề</label>
                <input type="text" v-model="content.finalCta.options[0].title" placeholder="Tiếp tục cách cũ" />
              </div>
              <div class="form-group">
                <label>Lựa chọn 2 - Tiêu đề</label>
                <input type="text" v-model="content.finalCta.options[1].title" placeholder="Đầu tư thông minh" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Lựa chọn 1 - Mô tả</label>
                <textarea v-model="content.finalCta.options[0].description" rows="3" placeholder="Mất thêm 15 giờ/tuần..."></textarea>
              </div>
              <div class="form-group">
                <label>Lựa chọn 2 - Mô tả</label>
                <textarea v-model="content.finalCta.options[1].description" rows="3" placeholder="Tiết kiệm 15 giờ/tuần..."></textarea>
              </div>
            </div>

            <div class="form-group">
              <label>Câu hỏi - Tiêu đề</label>
              <input type="text" v-model="content.finalCta.question.title" placeholder="Lựa chọn nào thông minh hơn?" />
            </div>

            <div class="form-group">
              <label>Câu hỏi - Mô tả</label>
              <input type="text" v-model="content.finalCta.question.description" placeholder="Đầu tư 499K để thu về..." />
            </div>

            <div class="form-group">
              <label>Câu hỏi - Highlight</label>
              <input type="text" v-model="content.finalCta.question.highlight" placeholder="Đây không phải là chi phí..." />
            </div>

            <div class="form-group">
              <label>Nút CTA - Text</label>
              <input type="text" v-model="content.finalCta.button.text" placeholder="ĐĂNG KÝ GÓI PRO NGAY - 499.000đ/tháng" />
            </div>

            <div class="form-group">
              <label>Nút CTA - Icon</label>
              <div class="input-with-icon">
                <IconPicker v-model="finalCtaButtonIconBase" />
              </div>
              <input
                  type="text"
                  v-model="finalCtaButtonIconStyle"
                  placeholder="mr-3"
                  class="mt-2"
              />
            </div>

            <div class="form-group">
              <label>Nhãn</label>
              <input type="text" v-model="content.finalCta.contact.label" placeholder="Hoặc liên hệ ngay: " />
            </div>

            <div class="form-group">
              <label>Số điện thoại liên hệ</label>
              <input type="text" v-model="content.finalCta.contact.phone" placeholder="1900 888 999" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Nút bấm -->
      <div v-if="activeTab === 'buttons'" class="buttons-settings">
        <div class="">
          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm chung</h3>

            <div class="form-group">
              <label>Nút Xem chi tiết</label>
              <input type="text" v-model="content.buttons.viewDetails" placeholder="Xem chi tiết →" />
            </div>

            <div class="form-group">
              <label>Nút Đăng ký - Icon</label>
              <div class="input-with-icon">
                <IconPicker v-model="registerIconBase" />
              </div>
              <input
                  type="text"
                  v-model="registerIconStyle"
                  placeholder="mr-2"
                  class="mt-2"
              />
            </div>

            <div class="form-group">
              <label>Nút Pro CTA - Icon</label>
              <div class="input-with-icon">
                <IconPicker v-model="proCtaIconBase" />
              </div>
              <input
                  type="text"
                  v-model="proCtaIconStyle"
                  placeholder="mr-2"
                  class="mt-2"
              />
            </div>

            <div class="form-group">
              <label>Nút Premium CTA - Icon</label>
              <div class="input-with-icon">
                <IconPicker v-model="premiumCtaIconBase" />
              </div>
              <input
                  type="text"
                  v-model="premiumCtaIconStyle"
                  placeholder="mr-2"
                  class="mt-2"
              />
            </div>

            <div class="form-group">
              <label>Nút Hủy</label>
              <input type="text" v-model="content.buttons.cancel" placeholder="Hủy" />
            </div>

            <div class="form-group">
              <label>Nút Thanh toán ngay</label>
              <input type="text" v-model="content.buttons.payNow" placeholder="Thanh toán ngay" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Modal -->
      <div v-if="activeTab === 'modal'" class="modal-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-window-maximize"></i> Modal thông báo</h3>

            <div class="form-group">
              <label>Tiêu đề thành công</label>
              <input type="text" v-model="content.modal.successTitle" placeholder="Đăng ký thành công!" />
            </div>

            <div class="form-group">
              <label>Text đã chọn</label>
              <input type="text" v-model="content.modal.selectedText" placeholder="Bạn đã chọn" />
            </div>

            <div class="form-group">
              <label>Text chuyển hướng</label>
              <input type="text" v-model="content.modal.redirectText" placeholder="Chúng tôi sẽ chuyển hướng bạn..." />
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
import {ref, reactive, onMounted, computed, watch} from 'vue'
import api from '../../../../api/api.js'
import IconPicker from "../../../RichTextEditor/IconPicker.vue";
import ColorInputWithGlobalColors from "../homeNew/ColorInputWithGlobalColors.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('css')
const isLoading = ref(false)

// Color options
const benefitColors = ['pink', 'blue', 'amber', 'purple', 'green', 'teal', 'indigo', 'red', 'orange', 'sky', 'cyan']

// Content structure based on new JSON data
const content = reactive({
  hero: {
    badge: {
      icon: "fas fa-bolt text-purple-400 mr-2",
      text: "CÔNG CỤ SỐ 1 CHO MÔI GIỚI BĐS VIỆT NAM"
    },
    title: {
      line1: "Chọn gói phù hợp",
      line2: "cho sự nghiệp của bạn"
    },
    description: "Không phải gói nào cũng phù hợp với mọi người. Chúng tôi thiết kế 3 gói dịch vụ với các tính năng và giới hạn khác biệt, giúp bạn lưạ chọn chính xác gói phù hợp nhất với quy mô và định hướng phát triển của mình. Dù bạn mới bắt đầu hay đã là chuyên gia, luôn có một gói dành cho bạn.",
    stats: {
      users: {
        count: "5,000+",
        label: "Môi giới đã lựa chọn"
      },
      security: {
        icon: "fas fa-shield-alt text-emerald-400 text-xl mr-3",
        title: "Bảo mật tuyệt đối",
        description: "Dữ liệu được mã hóa"
      }
    }
  },
  packages: {
    plus: {
      name: "Plus",
      fullName: "Gói Plus",
      icon: "fa-regular fa-star",
      tagline: "Khởi đầu vững chắc",
      previewDescription: "Dành cho môi giới mới bắt đầu muốn trải nghiệm hệ thống với đầy đủ tính năng cơ bản.",
      features: [
        "• 50 BĐS được quản lý"
      ],
      detailBadge: "GÓI KHỞI ĐẦU THÔNG MINH",
      detailTitle: "Plus",
      price: "199.000đ/tháng",
      priceNumber: "199",
      priceDecimal: ".000đ",
      detailDescription: "Dành cho môi giới mới bắt đầu muốn thử nghiệm hệ thống mà không rủi ro tài chính.",
      highlight: "Hoàn hảo để khởi nghiệp với ngân sách thấp.",
      sections: {
        target: {
          title: "Ai nên chọn gói này?",
          icon: "fas fa-check-circle",
          items: [
            "Môi giới mới vào nghề, cần công cụ cơ bản để khởi đầu",
            "Người muốn thử nghiệm hệ thống trước khi đầu tư lớn",
            "Môi giới bán thời gian hoặc có số lượng BĐS ít"
          ]
        },
        features: {
          title: "Bạn sẽ nhận được gì?",
          items: [
            {
              icon: "fas fa-home",
              title: "Quản lý 50 BĐS",
              description: "Đủ để bắt đầu với một danh mục nhỏ và học cách sử dụng hệ thống"
            },
            {
              icon: "fas fa-calculator",
              title: "10 lượt định giá/tháng",
              description: "Định giá sơ bộ cho 10 BĐS mỗi tháng"
            },
            {
              icon: "fas fa-unlock",
              title: "20 lượt mở khóa",
              description: "Tiếp cận thông tin chi tiết của 20 BĐS tiềm năng"
            }
          ]
        },
        keyFeatures: {
          title: "Tính năng chính:",
          icon: "fas fa-check",
          items: [
            "Quản lý tối đa 50 BĐS",
            "10 lượt định giá sơ bộ/tháng",
            "20 lượt mở khóa sản phẩm/tháng",
            "Đội nhóm cá nhân: 25 thành viên",
            "Đăng tin: 20 tin/tháng"
          ]
        }
      },
      cta: "Đăng ký Gói Plus",
      roi: {
        title: "ROI dự kiến:",
        investment: {
          label: "Chi phí đầu tư:",
          value: "199.000đ/tháng"
        },
        profit: {
          label: "Lợi nhuận tối thiểu:",
          value: "+2.000.000đ/tháng"
        },
        progress: "65%",
        ratio: "Tỷ lệ đầu tư : lợi nhuận ≈ 1:10"
      }
    },
    pro: {
      name: "Pro",
      fullName: "Gói Pro",
      icon: "fa-solid fa-gem",
      tagline: "Lựa chọn thông minh",
      badge: "PHỔ BIẾN NHẤT",
      subBadge: "Lựa chọn thông minh nhất",
      previewDescription: "Đầy đủ công cụ cho môi giới chuyên nghiệp, tối ưu hiệu suất và tăng doanh thu đáng kể.",
      stats: "85% môi giới thành công chọn gói này",
      features: [
        "• 100 BĐS được quản lý"
      ],
      detailBadge: "LỰA CHỌN THÔNG MINH NHẤT",
      detailTitle: "Pro",
      price: "499.000đ/tháng",
      priceNumber: "499",
      priceDecimal: ".000đ",
      detailDescription: {
        before: "Được ",
        highlight: "85% môi giới thành công",
        after: " lựa chọn vì hiệu quả vượt trội so với chi phí."
      },
      detailSubdescription: "Khoản đầu tư thông minh nhất cho sự nghiệp môi giới của bạn.",
      sections: {
        whyBest: {
          title: "Vì sao đây là lựa chọn tốt nhất?",
          icon: "fas fa-check-circle",
          items: [
            {
              highlight: "ROI ấn tượng:",
              text: " Đầu tư 499K, thu về ít nhất 5 triệu/tháng"
            },
            {
              highlight: "Đầy đủ tính năng:",
              text: " Mọi công cụ cần thiết cho môi giới chuyên nghiệp"
            },
            {
              highlight: "Hỗ trợ 24/7:",
              text: " Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ"
            },
            {
              highlight: "Không giới hạn tiềm năng:",
              text: " Đủ tài nguyên để phát triển mạnh mẽ"
            }
          ]
        },
        privileges: {
          title: "Đặc quyền của gói Pro",
          items: [
            {
              icon: "fa-solid fa-diagram-project",
              title: "Quản lý 100 BĐS",
              description: "Đủ để xây dựng danh mục đầu tư đa dạng và phát triển mạnh mẽ"
            },
            {
              icon: "fas fa-calculator",
              title: "50 lượt định giá/tháng",
              description: "Định giá chuyên sâu cho 50 BĐS mỗi tháng"
            },
            {
              icon: "fas fa-unlock",
              title: "50 lượt mở khóa",
              description: "Tiếp cận thông tin chi tiết của 50 BĐS tiềm năng mỗi tháng"
            }
          ]
        },
        premiumFeatures: {
          title: "Tính năng cao cấp:",
          icon: "fas fa-check",
          items: [
            "Quản lý tối đa 100 BĐS",
            "50 lượt định giá chuyên sâu/tháng",
            "50 lượt mở khóa sản phẩm/tháng",
            "Đội nhóm cá nhân: 100 thành viên",
            "Đăng tin không giới hạn",
            "Hỗ trợ ưu tiên 24/7"
          ]
        }
      },
      cta: "CHỌN GÓI PRO - THÔNG MINH NHẤT",
      statsTitle: "Thống kê người dùng gói Pro:",
      userStats: {
        percentage: "85%",
        label: "Môi giới chọn",
        roi: "1:10",
        roiLabel: "Tỷ lệ ROI",
        description: {
          before: "Trung bình mỗi người tăng ",
          highlight: "5-8 triệu/tháng",
          after: " sau khi dùng"
        }
      }
    },
    premium: {
      name: "Premium",
      fullName: "Gói Premium",
      icon: "fa-solid fa-crown",
      tagline: "Dành cho người dẫn đầu",
      previewDescription: "Tất cả tính năng cao cấp, không giới hạn, dành cho những ai muốn thống lĩnh thị trường.",
      features: [
        "• 150 BĐS được quản lý"
      ],
      detailBadge: "GÓI CAO CẤP DÀNH CHO NGƯỜI DẪN ĐẦU",
      detailTitle: "Premium",
      price: "599.000đ/tháng",
      priceNumber: "599",
      priceDecimal: ".000đ",
      detailDescription: {
        before: "Dành cho những người muốn ",
        highlight: "thống lĩnh thị trường",
        after: " và vượt mặt đối thủ."
      },
      detailSubdescription: "Mọi tính năng cao cấp nhất, hỗ trợ VIP 24/7, và công cụ để bạn trở thành số 1.",
      sections: {
        privileges: {
          title: "Đặc quyền chỉ có ở Premium",
          icon: "fas fa-crown",
          items: [
            {
              highlight: "Hỗ trợ VIP 24/7:",
              text: " Đội ngũ chuyên gia riêng luôn sẵn sàng"
            },
            {
              highlight: "Không giới hạn mọi thứ:",
              text: " Từ định giá, mở khóa đến quản lý BĐS"
            },
            {
              highlight: "Đào tạo chuyên sâu:",
              text: " Các khóa học đặc biệt chỉ dành cho Premium"
            },
            {
              highlight: "Tính năng độc quyền:",
              text: " Công cụ phân tích nâng cao chỉ có ở Premium"
            }
          ]
        },
        features: {
          title: "Bạn sẽ nhận được gì?",
          items: [
            {
              icon: "fas fa-infinity",
              title: "Quản lý 150 BĐS",
              description: "Xây dựng danh mục đầu tư khủng, thống lĩnh thị trường"
            },
            {
              icon: "fas fa-calculator",
              title: "150 lượt định giá/tháng",
              description: "Định giá chuyên sâu không giới hạn cho mọi BĐS"
            },
            {
              icon: "fas fa-unlock",
              title: "200 lượt mở khóa",
              description: "Tiếp cận không giới hạn thông tin BĐS tiềm năng"
            }
          ]
        },
        exclusiveFeatures: {
          title: "Tính năng độc quyền:",
          icon: "fas fa-check",
          items: [
            "Quản lý 150 BĐS (không giới hạn nâng cấp)",
            "150 lượt định giá chuyên sâu/tháng",
            "200 lượt mở khóa sản phẩm/tháng",
            "Đội nhóm cá nhân: 200 thành viên",
            "Hỗ trợ VIP 24/7 với chuyên gia riêng"
          ]
        }
      },
      cta: "NÂNG CẤP LÊN PREMIUM",
      resultsTitle: "Kết quả người dùng Premium:",
      results: [
        {
          label: "Thu nhập tăng trung bình:",
          value: "+15-20 triệu/tháng"
        },
        {
          label: "Tỷ lệ chốt deal:",
          value: "85%+"
        },
        {
          label: "Thời gian hoàn vốn:",
          value: "1.5 tháng"
        }
      ],
      resultsDescription: {
        before: "Premium dành cho người muốn ",
        highlight: "dẫn đầu thị trường",
        after: ""
      }
    }
  },
  benefits: {
    title: {
      line1: "Vì sao nên đầu tư vào",
      line2: "công cụ này?"
    },
    subtitle: "Không phải là chi phí, mà là khoản đầu tư sinh lời ít nhất 1:5 mỗi tháng",
    items: [
      {
        title: "Tiết kiệm 15 giờ/tuần",
        icon: "fas fa-clock",
        color: "pink",
        customColor: "",
        stat: {
          number: "15 giờ/tuần",
          label: "Thời gian tiết kiệm:"
        },
        description: "Tự động hóa công việc thủ công, giúp bạn tập trung vào việc tạo ra doanh thu thay vì quản lý giấy tờ."
      },
      {
        title: "Tăng 40% doanh thu",
        icon: "fas fa-chart-line",
        color: "blue",
        customColor: "",
        stat: {
          number: "+40%",
          label: "Tăng trưởng trung bình:"
        },
        description: "Phân tích thông minh giúp bạn xác định đúng khách hàng tiềm năng và tối ưu chiến lược bán hàng."
      },
      {
        title: "Chuyên nghiệp hóa hình ảnh",
        icon: "fas fa-user-check",
        color: "amber",
        customColor: "",
        stat: {
          number: "4.8/5 sao",
          label: "Đánh giá khách hàng:"
        },
        description: "Hệ thống quản lý chuyên nghiệp giúp bạn tạo ấn tượng tốt và xây dựng niềm tin với khách hàng."
      }
    ]
  },
  comparison: {
    title: {
      line1: "So sánh để thấy",
      line2: "sự khác biệt rõ ràng"
    },
    subtitle: "Lựa chọn gói phù hợp với mục tiêu và ngân sách của bạn",
    tableHeaders: {
      feature: "Tính năng"
    },
    packages: {
      plus: {
        name: "Gói Plus",
        price: "199.000đ/tháng",
        priceClass: "text-purple-300 font-semibold"
      },
      pro: {
        name: "Gói Pro",
        price: "499.000đ/tháng",
        priceClass: "gradient-text font-bold",
        note: "(Lựa chọn thông minh nhất)"
      },
      premium: {
        name: "Gói Premium",
        price: "599.000đ/tháng",
        priceClass: "text-amber-300 font-semibold"
      }
    },
    features: [
      {
        name: "Định giá BĐS",
        plus: {
          value: "10 lượt/tháng",
          class: "text-slate-50 font-semibold"
        },
        pro: {
          value: "50 lượt/tháng",
          class: "text-slate-50 font-semibold",
          note: "+400% giá trị"
        },
        premium: {
          value: "150 lượt/tháng",
          class: "text-slate-50 font-semibold"
        }
      },
      {
        name: "Quản lý kho BĐS",
        plus: {
          value: "50 BĐS",
          class: ""
        },
        pro: {
          value: "100 BĐS",
          class: "text-slate-50 font-semibold",
          note: "Đủ để kinh doanh chuyên nghiệp"
        },
        premium: {
          value: "150 BĐS",
          class: ""
        }
      },
      {
        name: "Mở khóa cơ hội",
        plus: {
          value: "20 lượt/tháng",
          class: ""
        },
        pro: {
          value: "50 lượt/tháng",
          class: "text-slate-50 font-semibold"
        },
        premium: {
          value: "200 lượt/tháng",
          class: ""
        }
      },
      {
        name: "Hỗ trợ khách hàng",
        plus: {
          value: "Qua email",
          class: ""
        },
        pro: {
          value: "Hỗ trợ ưu tiên 24/7",
          class: "text-slate-50 font-semibold",
          note: "Giải đáp mọi thắc mắc"
        },
        premium: {
          value: "Hỗ trợ VIP 24/7",
          class: ""
        }
      },
      {
        name: "Đào tạo chuyên sâu",
        plus: {
          value: "Cơ bản",
          class: ""
        },
        pro: {
          value: "2 buổi đào tạo miễn phí",
          class: "text-slate-50 font-semibold",
          note: "Trị giá 2 triệu"
        },
        premium: {
          value: "Khóa học đặc biệt",
          class: ""
        }
      }
    ],
    tip: {
      icon: "fas fa-lightbulb text-amber-400 mr-2",
      label: "Lời khuyên:",
      text: "Nếu bạn nghiêm túc với nghề môi giới, Gói Pro mang lại giá trị tốt nhất so với chi phí bỏ ra"
    }
  },
  finalCta: {
    icon: "fas fa-rocket text-slate-50 text-3xl",
    title: "Bạn có 2 lựa chọn:",
    options: [
      {
        number: "1",
        numberClass: "text-6xl text-slate-500 mb-4",
        title: "Tiếp tục cách cũ",
        description: "Mất thêm 15 giờ/tuần cho công việc thủ công, bỏ lỡ cơ hội, đối thủ vượt mặt bạn mỗi ngày.",
        priceLabel: "Chi phí: 0đ",
        priceClass: "text-2xl font-bold text-slate-500",
        priceNote: "(Nhưng mất cơ hội vô giá)",
        noteClass: "text-sm text-slate-500 mt-2",
        class: "p-8 rounded-2xl glass-card-custom border-2 border-white/10"
      },
      {
        number: "2",
        numberClass: "text-6xl gradient-text mb-4",
        title: "Đầu tư thông minh",
        description: "Tiết kiệm 15 giờ/tuần, tăng 40% doanh thu, chốt deal nhanh gấp 3 lần, vượt mặt đối thủ.",
        priceLabel: "Chi phí: 499.000đ/tháng",
        priceClass: "text-2xl font-bold gradient-text",
        priceNote: "(Hoàn vốn chỉ sau 2.5 tháng)",
        noteClass: "text-sm text-emerald-400 mt-2",
        class: "p-8 rounded-2xl border-2 border-purple-500 bg-gradient-to-b from-purple-900/10 to-transparent"
      }
    ],
    question: {
      title: "Lựa chọn nào thông minh hơn?",
      description: "Đầu tư 499K để thu về ít nhất 5 triệu mỗi tháng.",
      highlight: "Đây không phải là chi phí, mà là khoản đầu tư sinh lời."
    },
    button: {
      icon: "fas fa-gem mr-3",
      text: "ĐĂNG KÝ GÓI PRO NGAY - 499.000đ/tháng"
    },
    guarantees: [
      {
        label: "Không rủi ro",
        value: "7 ngày hoàn tiền"
      },
      {
        label: "Không ràng buộc",
        value: "Hủy bất kỳ lúc nào"
      },
      {
        label: "Dùng thử miễn phí",
        value: "14 ngày đầu tiên"
      }
    ],
    contact: {
      label: "Hoặc gọi ngay:",
      phone: "1900 888 999"
    }
  },
  buttons: {
    viewDetails: "Xem chi tiết →",
    register: {
      icon: "fas fa-shopping-cart mr-2"
    },
    proCta: {
      icon: "fas fa-bolt mr-2"
    },
    premiumCta: {
      icon: "fas fa-crown mr-2"
    },
    cancel: "Hủy",
    payNow: "Thanh toán ngay"
  },
  modal: {
    successTitle: "Đăng ký thành công!",
    selectedText: "Bạn đã chọn",
    redirectText: "Chúng tôi sẽ chuyển hướng bạn đến trang thanh toán an toàn."
  },
  css: {
    purple500: "--color-purple-500",
    pink500: "--color-pink-500",
    blue500: "--color-blue-500",
    emerald500: "--color-emerald-500",
    amber500: "--color-amber-500",
    gradientFrom: "--color-purple-500",
    gradientTo: "--color-pink-500",
    slate50: "--color-slate-50",
    slate300: "--color-slate-300",
    slate400: "--color-slate-400",
    slate800: "--color-slate-800",
    borderOpacity: "0.08",
    floatDuration: "6s",
    pulseDuration: "2s",
    glowDuration: "3s"
  }
})


const filteredCssColors = computed(() => {
    const nonColorKeys = ['borderOpacity', 'floatDuration', 'pulseDuration', 'glowDuration'];
    const result = {};

    for (const [key, value] of Object.entries(content.css)) {
      if (!nonColorKeys.includes(key)) {
        result[key] = value;
      }
    }

    return result;
  });


// Computed property để xử lý features dạng mảng thành text
const packageFeatures = computed({
  get() {
    return {
      plus: content.packages.plus.features?.join('\n') || '',
      pro: content.packages.pro.features?.join('\n') || '',
      premium: content.packages.premium.features?.join('\n') || ''
    }
  },
  set(value) {
    if (value.plus !== undefined) {
      content.packages.plus.features = value.plus.split('\n').filter(line => line.trim() !== '')
    }
    if (value.pro !== undefined) {
      content.packages.pro.features = value.pro.split('\n').filter(line => line.trim() !== '')
    }
    if (value.premium !== undefined) {
      content.packages.premium.features = value.premium.split('\n').filter(line => line.trim() !== '')
    }
  }
})

// Computed properties để tách icon và style
const heroBadgeIconBase = computed({
  get() {
    const icon = content.hero.badge.icon || ''
    return icon.split(' ')[0] + ' ' + icon.split(' ')[1] || 'fas fa-bolt'
  },
  set(newValue) {
    const style = heroBadgeIconStyle.value || 'text-purple-400 mr-2'
    content.hero.badge.icon = `${newValue} ${style}`
  }
})

const heroBadgeIconStyle = computed({
  get() {
    const icon = content.hero.badge.icon || ''
    const parts = icon.split(' ')
    return parts.slice(2).join(' ') || 'text-purple-400 mr-2'
  },
  set(newValue) {
    const base = heroBadgeIconBase.value || 'fas fa-bolt'
    content.hero.badge.icon = `${base} ${newValue}`
  }
})

const heroSecurityIconBase = computed({
  get() {
    const icon = content.hero.stats.security.icon || ''
    return icon.split(' ')[0] + ' ' + icon.split(' ')[1] || 'fas fa-shield-alt'
  },
  set(newValue) {
    const style = heroSecurityIconStyle.value || 'text-emerald-400 text-xl mr-3'
    content.hero.stats.security.icon = `${newValue} ${style}`
  }
})

const heroSecurityIconStyle = computed({
  get() {
    const icon = content.hero.stats.security.icon || ''
    const parts = icon.split(' ')
    return parts.slice(2).join(' ') || 'text-emerald-400 text-xl mr-3'
  },
  set(newValue) {
    const base = heroSecurityIconBase.value || 'fas fa-shield-alt'
    content.hero.stats.security.icon = `${base} ${newValue}`
  }
})

const comparisonTipIconBase = computed({
  get() {
    const icon = content.comparison.tip.icon || ''
    return icon.split(' ')[0] + ' ' + icon.split(' ')[1] || 'fas fa-lightbulb'
  },
  set(newValue) {
    const style = comparisonTipIconStyle.value || 'text-amber-400 mr-2'
    content.comparison.tip.icon = `${newValue} ${style}`
  }
})

const comparisonTipIconStyle = computed({
  get() {
    const icon = content.comparison.tip.icon || ''
    const parts = icon.split(' ')
    return parts.slice(2).join(' ') || 'text-amber-400 mr-2'
  },
  set(newValue) {
    const base = comparisonTipIconBase.value || 'fas fa-lightbulb'
    content.comparison.tip.icon = `${base} ${newValue}`
  }
})

const finalCtaIconBase = computed({
  get() {
    const icon = content.finalCta.icon || ''
    return icon.split(' ')[0] + ' ' + icon.split(' ')[1] || 'fas fa-rocket'
  },
  set(newValue) {
    const style = finalCtaIconStyle.value || 'text-slate-50 text-3xl'
    content.finalCta.icon = `${newValue} ${style}`
  }
})

const finalCtaIconStyle = computed({
  get() {
    const icon = content.finalCta.icon || ''
    const parts = icon.split(' ')
    return parts.slice(2).join(' ') || 'text-slate-50 text-3xl'
  },
  set(newValue) {
    const base = finalCtaIconBase.value || 'fas fa-rocket'
    content.finalCta.icon = `${base} ${newValue}`
  }
})

const finalCtaButtonIconBase = computed({
  get() {
    const icon = content.finalCta.button.icon || ''
    return icon.split(' ')[0] + ' ' + icon.split(' ')[1] || 'fas fa-gem'
  },
  set(newValue) {
    const style = finalCtaButtonIconStyle.value || 'mr-3'
    content.finalCta.button.icon = `${newValue} ${style}`
  }
})

const finalCtaButtonIconStyle = computed({
  get() {
    const icon = content.finalCta.button.icon || ''
    const parts = icon.split(' ')
    return parts.slice(2).join(' ') || 'mr-3'
  },
  set(newValue) {
    const base = finalCtaButtonIconBase.value || 'fas fa-gem'
    content.finalCta.button.icon = `${base} ${newValue}`
  }
})

const registerIconBase = computed({
  get() {
    const icon = content.buttons.register.icon || ''
    return icon.split(' ')[0] + ' ' + icon.split(' ')[1] || 'fas fa-shopping-cart'
  },
  set(newValue) {
    const style = registerIconStyle.value || 'mr-2'
    content.buttons.register.icon = `${newValue} ${style}`
  }
})

const registerIconStyle = computed({
  get() {
    const icon = content.buttons.register.icon || ''
    const parts = icon.split(' ')
    return parts.slice(2).join(' ') || 'mr-2'
  },
  set(newValue) {
    const base = registerIconBase.value || 'fas fa-shopping-cart'
    content.buttons.register.icon = `${base} ${newValue}`
  }
})

const proCtaIconBase = computed({
  get() {
    const icon = content.buttons.proCta.icon || ''
    return icon.split(' ')[0] + ' ' + icon.split(' ')[1] || 'fas fa-bolt'
  },
  set(newValue) {
    const style = proCtaIconStyle.value || 'mr-2'
    content.buttons.proCta.icon = `${newValue} ${style}`
  }
})

const proCtaIconStyle = computed({
  get() {
    const icon = content.buttons.proCta.icon || ''
    const parts = icon.split(' ')
    return parts.slice(2).join(' ') || 'mr-2'
  },
  set(newValue) {
    const base = proCtaIconBase.value || 'fas fa-bolt'
    content.buttons.proCta.icon = `${base} ${newValue}`
  }
})

const premiumCtaIconBase = computed({
  get() {
    const icon = content.buttons.premiumCta.icon || ''
    return icon.split(' ')[0] + ' ' + icon.split(' ')[1] || 'fas fa-crown'
  },
  set(newValue) {
    const style = premiumCtaIconStyle.value || 'mr-2'
    content.buttons.premiumCta.icon = `${newValue} ${style}`
  }
})

const premiumCtaIconStyle = computed({
  get() {
    const icon = content.buttons.premiumCta.icon || ''
    const parts = icon.split(' ')
    return parts.slice(2).join(' ') || 'mr-2'
  },
  set(newValue) {
    const base = premiumCtaIconBase.value || 'fas fa-crown'
    content.buttons.premiumCta.icon = `${base} ${newValue}`
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
const SECTION_ID = 64
const globalColors = ref({});

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

// Color change handlers
const handleBenefitColorChange = (benefit) => {
  if (benefit.color !== 'custom') {
    benefit.customColor = '' // Reset customColor khi chọn màu từ danh sách
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

      // Chuẩn hóa màu sắc benefits
      normalizeBenefitColors()

      showToast('Dữ liệu đã được tải thành công', 'success')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu từ server', 'error')
  } finally {
    isLoading.value = false
  }
}
// Thêm hàm chuẩn hóa màu sắc cho benefits
const normalizeBenefitColors = () => {
  if (!content.benefits || !content.benefits.items) return;

  content.benefits.items.forEach(benefit => {
    // Kiểm tra nếu màu hiện tại là mã hex (bắt đầu bằng #)
    if (benefit.color && benefit.color.startsWith('#')) {
      // Chuyển sang chế độ custom
      benefit.customColor = benefit.color;
      benefit.color = 'custom';
    }
    // Đảm bảo luôn có trường customColor
    if (!benefit.hasOwnProperty('customColor')) {
      benefit.customColor = '';
    }
  });
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    // Prepare content data - tạo bản sao sâu
    const contentData = JSON.parse(JSON.stringify(content))

    // Xử lý benefit colors trước khi lưu
    if (contentData.benefits && contentData.benefits.items) {
      contentData.benefits.items.forEach(benefit => {
        // Nếu đang ở chế độ custom, lấy màu từ customColor
        if (benefit.color === 'custom' && benefit.customColor) {
          benefit.color = benefit.customColor;
        }
        // Xóa trường customColor khỏi dữ liệu lưu
        delete benefit.customColor;
      });
    }

    // Prepare FormData
    const formData = new FormData()

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Nội dung gói dịch vụ',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 0,
      files: []
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
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Lỗi khi lưu thay đổi: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    isLoading.value = false
  }
}
const loadDataColors = async () => {
  try {
    const response = await api.get('/cms/getSection/55')
    const parsedJSON = JSON.parse(response.data.contentJson)
    globalColors.value = parsedJSON.colors || {}
  } catch (error) {
    console.error('Error loading colors:', error)
  }
}

// ========== BENEFITS MANAGEMENT ==========
const addBenefit = () => {
  content.benefits.items.push({
    title: "",
    icon: "fas fa-star",
    color: "blue",
    customColor: "", // Đảm bảo có trường này
    stat: {
      number: "",
      label: ""
    },
    description: ""
  })
  showToast('Đã thêm lợi ích mới', 'success')
}

const removeBenefit = (index) => {
  if (confirm('Bạn có chắc muốn xóa lợi ích này?')) {
    content.benefits.items.splice(index, 1)
    showToast('Đã xóa lợi ích', 'success')
  }
}

// ========== COMPARISON FEATURES MANAGEMENT ==========
const addComparisonFeature = () => {
  content.comparison.features.push({
    name: "",
    plus: {
      value: "",
      class: ""
    },
    pro: {
      value: "",
      class: "",
      note: ""
    },
    premium: {
      value: "",
      class: ""
    }
  })
  showToast('Đã thêm tính năng so sánh', 'success')
}

const removeComparisonFeature = (index) => {
  if (confirm('Bạn có chắc muốn xóa tính năng so sánh này?')) {
    content.comparison.features.splice(index, 1)
    showToast('Đã xóa tính năng so sánh', 'success')
  }
}

// ========== LIFECYCLE HOOKS ==========
onMounted(async () => {
  await loadData()
  await loadDataColors()
})
</script>

<style scoped>
/* Giữ nguyên tất cả các style CSS từ component cũ */
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
  padding: 15px 20px;
  border: none;
  background: none;
  font-size: 0.95rem;
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

@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
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

.section-header h3, .section-header h4 {
  margin: 0;
}

/* Items */
.benefit-item, .feature-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.benefit-item:hover, .feature-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.benefit-header, .feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.benefit-header h5, .feature-header h5 {
  margin: 0;
  color: #031358;
  font-size: 1rem;
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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
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

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #e4606d 100%);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #c82333 0%, #dc3545 100%);
  color: white !important;
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

  .navigation-tabs {
    padding: 0 20px;
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
  }

  .tab-button {
    padding: 12px 15px;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .benefit-header,
  .feature-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
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
    padding: 10px 12px;
    font-size: 0.8rem;
  }
}

/* Color variables */
.element {
  color: var(--color-purple-500);
  background: linear-gradient(
      var(--color-purple-500),
      var(--color-pink-500)
  );
}

/* Direct values */
.element {
  border-opacity: 0.08;
  animation-duration: 6s;
}
</style>