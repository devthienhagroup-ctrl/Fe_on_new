<template>
  <div class="investor-editor">
    <!-- Header -->
    <div class="editor-header">
      <div class="header-content">
        <h1><i class="fas fa-users"></i> Quản lý Danh sách Người Góp Vốn</h1>
        <p class="header-subtitle">Tùy chỉnh nội dung, giao diện và màu sắc cho phần hiển thị nhà đầu tư</p>
      </div>
      <div class="header-actions">
        <button class="btn-save" @click="saveChanges" :disabled="isLoading">
          <i class="fas" :class="isLoading ? 'fa-spinner fa-spin' : 'fa-save'"></i>
          {{ isLoading ? 'Đang lưu...' : 'Lưu thay đổi' }}
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="editor-main">
      <!-- Sidebar Navigation -->
      <div class="editor-sidebar">
        <div class="sidebar-section">
          <h3><i class="fas fa-bars"></i> Điều hướng</h3>
          <nav class="sidebar-nav">
            <a href="#" :class="{ active: activeSection === 'content' }" @click.prevent="activeSection = 'content'">
              <i class="fas fa-font"></i>
              <span>Nội dung</span>
            </a>
            <a href="#" :class="{ active: activeSection === 'colors' }" @click.prevent="activeSection = 'colors'">
              <i class="fas fa-palette"></i>
              <span>Màu sắc</span>
            </a>
            <a href="#" :class="{ active: activeSection === 'styles' }" @click.prevent="activeSection = 'styles'">
              <i class="fas fa-brush"></i>
              <span>Kiểu dáng</span>
            </a>
          </nav>
        </div>
      </div>

      <!-- Content Area -->
      <div class="editor-content">
        <!-- CONTENT SECTION -->
        <div v-if="activeSection === 'content'" class="content-section">
          <div class="section-header">
            <h2><i class="fas fa-font"></i> Nội dung hiển thị</h2>
            <p class="section-description">Tùy chỉnh văn bản và thông tin hiển thị trên giao diện</p>
          </div>

          <div class="content-grid">
            <!-- Column 1: Main Titles -->
            <div class="content-card">
              <div class="card-header">
                <h3><i class="fas fa-heading"></i> Tiêu đề chính</h3>
              </div>
              <div class="card-body">
                <div class="form-field">
                  <label>
                    <i class="fas fa-text-width"></i>
                    <span>Tiêu đề chính</span>
                    <span class="field-hint">Tiêu đề lớn nhất trên trang</span>
                  </label>
                  <input type="text" v-model="content.mainTitle" placeholder="NHÓM ĐẦU TƯ">
                </div>
                <div class="form-field">
                  <label>
                    <i class="fas fa-trophy"></i>
                    <span>Tiêu đề top nhà đầu tư</span>
                  </label>
                  <input type="text" v-model="content.topInvestorsTitle" placeholder="TOP NHÀ ĐẦU TƯ">
                </div>
                <div class="form-field">
                  <label>
                    <i class="fas fa-file-alt"></i>
                    <span>Tiêu đề form đăng ký</span>
                  </label>
                  <input type="text" v-model="content.formTitle" placeholder="Đăng ký góp vốn ngay">
                </div>
              </div>
            </div>

            <!-- Column 2: Form Labels -->
            <div class="content-card">
              <div class="card-header">
                <h3><i class="fas fa-edit"></i> Nhãn Form</h3>
              </div>
              <div class="card-body">
                <div class="form-row">
                  <div class="form-field">
                    <label>
                      <i class="fas fa-user"></i>
                      <span>Họ tên</span>
                    </label>
                    <input type="text" v-model="content.nameLabel" placeholder="Họ và tên">
                  </div>
                  <div class="form-field">
                    <label>
                      <i class="fas fa-phone"></i>
                      <span>Số điện thoại</span>
                    </label>
                    <input type="text" v-model="content.phoneLabel" placeholder="Số điện thoại">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-field">
                    <label>
                      <i class="fas fa-envelope"></i>
                      <span>Email</span>
                    </label>
                    <input type="text" v-model="content.emailLabel" placeholder="Email">
                  </div>
                  <div class="form-field">
                    <label>
                      <i class="fas fa-tags"></i>
                      <span>Gói đầu tư</span>
                    </label>
                    <input type="text" v-model="content.packageLabel" placeholder="Gói: ">
                  </div>
                </div>
                <div class="form-field">
                  <label>
                    <i class="fas fa-list"></i>
                    <span>Nhãn chọn gói</span>
                  </label>
                  <input type="text" v-model="content.packageSelectLabel" placeholder="Gói đầu tư dự kiến đăng ký">
                </div>
              </div>
            </div>

            <!-- Column 3: Form Additional -->
            <div class="content-card wide">
              <div class="card-header">
                <h3><i class="fas fa-cog"></i> Form bổ sung</h3>
              </div>
              <div class="card-body">
                <div class="form-field">
                  <label>
                    <i class="fas fa-question-circle"></i>
                    <span>Placeholder chọn gói</span>
                  </label>
                  <input type="text" v-model="content.packagePlaceholder" placeholder="Chọn gói đầu tư">
                </div>
                <div class="form-field">
                  <label>
                    <i class="fas fa-sticky-note"></i>
                    <span>Nhãn ghi chú</span>
                  </label>
                  <input type="text" v-model="content.noteLabel" placeholder="Ghi chú">
                </div>
                <div class="form-field">
                  <label>
                    <i class="fas fa-paper-plane"></i>
                    <span>Nút đăng ký</span>
                  </label>
                  <input type="text" v-model="content.submitButtonText" placeholder="Đăng ký ngay">
                </div>
              </div>
            </div>

            <!-- Column 4: Table Settings -->
            <div class="content-card wide">
              <div class="card-header">
                <h3><i class="fas fa-table"></i> Cài đặt Bảng</h3>
                <button class="btn-add" @click="addTableHeader">
                  <i class="fas fa-plus"></i> Thêm cột
                </button>
              </div>
              <div class="card-body">
                <div class="table-headers-grid">
                  <div v-for="(header, index) in content.tableHeaders" :key="index" class="header-field">
                    <div class="header-field-header">
                      <span class="header-number">Cột {{ index + 1 }}</span>
                      <button v-if="content.tableHeaders.length > 1"
                              @click="removeTableHeader(index)"
                              class="btn-remove">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    <input type="text" v-model="content.tableHeaders[index]" :placeholder="'Tiêu đề cột ' + (index + 1)">
                    <div class="header-preview">{{ header || 'Trống' }}</div>
                  </div>
                </div>
                <div class="form-field">
                  <label>
                    <i class="fas fa-check"></i>
                    <span>Icon check</span>
                  </label>
                  <input type="text" v-model="content.checkIcon" placeholder="✓">
                </div>
              </div>
            </div>

            <!-- Column 5: Badges & Call to Action -->
            <div class="content-card wide">
              <div class="card-header">
                <h3><i class="fas fa-award"></i> Badges</h3>
              </div>
              <div class="card-body">
                <div class="badge-fields">
                  <div class="badge-field gold">
                    <label>Top 1</label>
                    <input type="text" v-model="content.top1Badge" placeholder="Top 1">
                  </div>
                  <div class="badge-field silver">
                    <label>Top 2</label>
                    <input type="text" v-model="content.top2Badge" placeholder="2">
                  </div>
                  <div class="badge-field bronze">
                    <label>Top 3</label>
                    <input type="text" v-model="content.top3Badge" placeholder="3">
                  </div>
                </div>
                <div class="form-field">
                  <label>
                    <i class="fas fa-bullhorn"></i>
                    <span>Lời kêu gọi hành động</span>
                  </label>
                  <textarea v-model="content.callToActionText"
                            placeholder="Đăng ký ngay để được liên hệ tư vấn sớm nhất"
                            rows="3"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- COLORS SECTION -->
        <div v-if="activeSection === 'colors'" class="colors-section">
          <div class="section-header">
            <h2><i class="fas fa-palette"></i> Màu sắc & Gradient</h2>
            <p class="section-description">Tùy chỉnh bảng màu và hiệu ứng gradient cho giao diện</p>
          </div>

          <div class="colors-grid">
            <!-- Primary Colors -->
            <div class="color-card">
              <div class="color-card-header">
                <h3><i class="fas fa-star"></i> Màu chính</h3>
                <div class="color-preview-large" :style="{ background: content.primaryColor }"></div>
              </div>
              <div class="color-fields">
                <div class="color-field">
                  <div class="color-field-label">
                    <span class="color-name">Primary</span>
                    <span class="color-value">{{ content.primaryColor }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="content.primaryColor" @change="updateGradientColors">
                    <input type="text" v-model="content.primaryColor" placeholder="#031358">
                  </div>
                </div>
                <div class="color-field">
                  <div class="color-field-label">
                    <span class="color-name">Secondary</span>
                    <span class="color-value">{{ content.secondaryColor }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="content.secondaryColor" @change="updateGradientColors">
                    <input type="text" v-model="content.secondaryColor" placeholder="#2a5298">
                  </div>
                </div>
                <div class="color-field">
                  <div class="color-field-label">
                    <span class="color-name">Accent</span>
                    <span class="color-value">{{ content.accentColor }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="content.accentColor">
                    <input type="text" v-model="content.accentColor" placeholder="#e53e3e">
                  </div>
                </div>
              </div>
            </div>

            <!-- Medal Colors -->
            <div class="color-card">
              <div class="color-card-header">
                <h3><i class="fas fa-medal"></i> Màu huy chương</h3>
              </div>
              <div class="color-fields">
                <div class="color-field medal gold">
                  <div class="color-field-label">
                    <span class="color-name">Gold</span>
                    <span class="color-value">{{ content.goldColor }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="content.goldColor">
                    <input type="text" v-model="content.goldColor" placeholder="gold">
                  </div>
                </div>
                <div class="color-field medal silver">
                  <div class="color-field-label">
                    <span class="color-name">Silver</span>
                    <span class="color-value">{{ content.silverColor }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="content.silverColor">
                    <input type="text" v-model="content.silverColor" placeholder="#c0c0c0">
                  </div>
                </div>
                <div class="color-field medal bronze">
                  <div class="color-field-label">
                    <span class="color-name">Bronze</span>
                    <span class="color-value">{{ content.bronzeColor }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="content.bronzeColor">
                    <input type="text" v-model="content.bronzeColor" placeholder="#cd7f32">
                  </div>
                </div>
                <div class="color-field">
                  <div class="color-field-label">
                    <span class="color-name">White</span>
                    <span class="color-value">{{ content.whiteColor }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="content.whiteColor">
                    <input type="text" v-model="content.whiteColor" placeholder="#ffffff">
                  </div>
                </div>
              </div>
            </div>

            <!-- Text Colors -->
            <div class="color-card">
              <div class="color-card-header">
                <h3><i class="fas fa-font"></i> Màu văn bản</h3>
              </div>
              <div class="color-fields">
                <div class="color-field">
                  <div class="color-field-label">
                    <span class="color-name">Text Color</span>
                    <span class="color-value">{{ content.textColor }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="content.textColor">
                    <input type="text" v-model="content.textColor" placeholder="#031358">
                  </div>
                </div>
                <div class="color-field">
                  <div class="color-field-label">
                    <span class="color-name">Required Color</span>
                    <span class="color-value">{{ content.requiredColor }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="content.requiredColor">
                    <input type="text" v-model="content.requiredColor" placeholder="#e53e3e">
                  </div>
                </div>
              </div>
            </div>

            <!-- Background Colors -->
            <div class="color-card">
              <div class="color-card-header">
                <h3><i class="fas fa-fill-drip"></i> Màu nền</h3>
              </div>
              <div class="color-fields">
                <div class="color-field with-opacity">
                  <div class="color-field-label">
                    <span class="color-name">Light Blue Bg</span>
                    <span class="color-value">{{ content.lightBlueBg }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="lightBlueBg.hex" @input="updateLightBlueBgFromColor">
                    <div class="opacity-control">
                      <input type="range" v-model.number="lightBlueBg.opacity" min="0" max="1" step="0.05"
                             @input="updateLightBlueBgFromColor">
                      <span>{{ (lightBlueBg.opacity * 100).toFixed(0) }}%</span>
                    </div>
                  </div>
                </div>
                <div class="color-field with-opacity">
                  <div class="color-field-label">
                    <span class="color-name">Hover Blue Bg</span>
                    <span class="color-value">{{ content.hoverBlueBg }}</span>
                  </div>
                  <div class="color-controls">
                    <input type="color" v-model="hoverBlueBg.hex" @input="updateHoverBlueBgFromColor">
                    <div class="opacity-control">
                      <input type="range" v-model.number="hoverBlueBg.opacity" min="0" max="1" step="0.05"
                             @input="updateHoverBlueBgFromColor">
                      <span>{{ (hoverBlueBg.opacity * 100).toFixed(0) }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gradient -->
            <div class="color-card wide">
              <div class="color-card-header">
                <h3><i class="fas fa-sliders-h"></i> Gradient</h3>
                <div class="gradient-preview-large" :style="{ background: content.primaryGradient }"></div>
              </div>
              <div class="gradient-controls">
                <div class="gradient-colors">
                  <div class="gradient-color">
                    <label>Màu bắt đầu</label>
                    <div class="color-controls">
                      <input type="color" v-model="gradientColors.primary.color1" @change="updatePrimaryGradient">
                      <input type="text" v-model="gradientColors.primary.color1" placeholder="#031358">
                    </div>
                  </div>
                  <div class="gradient-color">
                    <label>Màu kết thúc</label>
                    <div class="color-controls">
                      <input type="color" v-model="gradientColors.primary.color2" @change="updatePrimaryGradient">
                      <input type="text" v-model="gradientColors.primary.color2" placeholder="#2a5298">
                    </div>
                  </div>
                </div>
                <div class="gradient-output">
                  <label>Kết quả Gradient</label>
                  <input type="text" v-model="content.primaryGradient"
                         @input="updatePrimaryColorsFromGradient"
                         placeholder="linear-gradient(135deg, #031358, #2a5298)">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STYLES SECTION -->
        <div v-if="activeSection === 'styles'" class="styles-section">
          <div class="section-header">
            <h2><i class="fas fa-brush"></i> Kiểu dáng & Kích thước</h2>
            <p class="section-description">Tùy chỉnh font chữ, padding, border và shadow cho giao diện</p>
          </div>

          <div class="styles-grid">
            <!-- Typography -->
            <div class="style-card">
              <div class="style-card-header">
                <h3><i class="fas fa-text-height"></i> Typography</h3>
              </div>
              <div class="style-fields">
                <div class="style-field">
                  <label>Tiêu đề chính</label>
                  <div class="input-with-unit">
                    <input type="text" v-model="content.mainTitleFontSize" placeholder="33px">
                    <span>px</span>
                  </div>
                </div>
                <div class="style-field">
                  <label>Tiêu đề form</label>
                  <div class="input-with-unit">
                    <input type="text" v-model="content.formTitleFontSize" placeholder="25px">
                    <span>px</span>
                  </div>
                </div>
                <div class="style-field">
                  <label>Tiêu đề bảng</label>
                  <div class="input-with-unit">
                    <input type="text" v-model="content.tableHeaderFontSize" placeholder="20px">
                    <span>px</span>
                  </div>
                </div>
                <div class="style-field">
                  <label>Tiêu đề top đầu tư</label>
                  <div class="input-with-unit">
                    <input type="text" v-model="content.topInvestorsTitleFontSize" placeholder="20px">
                    <span>px</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Font Sizes -->
            <div class="style-card">
              <div class="style-card-header">
                <h3><i class="fas fa-font"></i> Kích thước chữ</h3>
              </div>
              <div class="style-fields">
                <div class="style-row">
                  <div class="style-field">
                    <label>Tên (Compact)</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.compactNameFontSize" placeholder="16px">
                      <span>px</span>
                    </div>
                  </div>
                  <div class="style-field">
                    <label>Gói (Compact)</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.compactPackageFontSize" placeholder="12px">
                      <span>px</span>
                    </div>
                  </div>
                </div>
                <div class="style-row">
                  <div class="style-field">
                    <label>Tên (Top 1)</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.top1CompactNameFontSize" placeholder="18px">
                      <span>px</span>
                    </div>
                  </div>
                  <div class="style-field">
                    <label>Gói (Top 1)</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.top1CompactPackageFontSize" placeholder="13px">
                      <span>px</span>
                    </div>
                  </div>
                </div>
                <div class="style-row">
                  <div class="style-field">
                    <label>Nhãn form</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.labelFontSize" placeholder="12px">
                      <span>px</span>
                    </div>
                  </div>
                  <div class="style-field">
                    <label>Lời kêu gọi</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.callToActionFontSize" placeholder="10px">
                      <span>px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Spacing & Sizing -->
            <div class="style-card">
              <div class="style-card-header">
                <h3><i class="fas fa-arrows-alt"></i> Spacing</h3>
              </div>
              <div class="style-fields">
                <div class="style-field">
                  <label>Container Padding</label>
                  <input type="text" v-model="content.containerPadding" placeholder="30px 20px">
                </div>
                <div class="style-field">
                  <label>Form Padding</label>
                  <input type="text" v-model="content.formPadding" placeholder="30px">
                </div>
                <div class="style-field">
                  <label>Table Cell Padding</label>
                  <input type="text" v-model="content.tableCellPadding" placeholder="15px">
                </div>
                <div class="style-field">
                  <label>Table Header Padding</label>
                  <input type="text" v-model="content.tableHeaderPadding" placeholder="18px 15px">
                </div>
              </div>
            </div>

            <!-- Sizing -->
            <div class="style-card">
              <div class="style-card-header">
                <h3><i class="fas fa-expand-alt"></i> Sizing</h3>
              </div>
              <div class="style-fields">
                <div class="style-row">
                  <div class="style-field">
                    <label>Ảnh đại diện</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.compactAvatarSize" placeholder="50px">
                      <span>px</span>
                    </div>
                  </div>
                  <div class="style-field">
                    <label>Ảnh Top 1</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.top1CompactAvatarSize" placeholder="55px">
                      <span>px</span>
                    </div>
                  </div>
                </div>
                <div class="style-row">
                  <div class="style-field">
                    <label>Badge Size</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.compactBadgeSize" placeholder="35px">
                      <span>px</span>
                    </div>
                  </div>
                  <div class="style-field">
                    <label>Viền ảnh</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.avatarBorderWidth" placeholder="2px">
                      <span>px</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Borders -->
            <div class="style-card">
              <div class="style-card-header">
                <h3><i class="fas fa-border-style"></i> Borders</h3>
              </div>
              <div class="style-fields">
                <div class="style-row">
                  <div class="style-field">
                    <label>Border Radius</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.borderRadius" placeholder="15px">
                      <span>px</span>
                    </div>
                  </div>
                  <div class="style-field">
                    <label>Input Radius</label>
                    <div class="input-with-unit">
                      <input type="text" v-model="content.inputBorderRadius" placeholder="6px">
                      <span>px</span>
                    </div>
                  </div>
                </div>
                <div class="style-field">
                  <label>Ảnh Radius</label>
                  <input type="text" v-model="content.avatarBorderRadius" placeholder="50%">
                </div>
                <div class="style-field">
                  <label>Viền trái</label>
                  <div class="input-with-unit">
                    <input type="text" v-model="content.borderLeftWidth" placeholder="4px">
                    <span>px</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shadows -->
            <div class="style-card">
              <div class="style-card-header">
                <h3><i class="fas fa-cloud"></i> Shadows</h3>
              </div>
              <div class="style-fields">
                <div class="style-field shadow-field">
                  <label>Box Shadow</label>
                  <div class="shadow-controls">
                    <input type="color" v-model="shadowColor.hex" @input="updateShadowFromColor">
                    <div class="opacity-control">
                      <input type="range" v-model.number="shadowColor.opacity" min="0" max="1" step="0.05"
                             @input="updateShadowFromColor">
                      <span>{{ (shadowColor.opacity * 100).toFixed(0) }}%</span>
                    </div>
                    <input type="text" v-model="content.boxShadow"
                           @input="updateColorFromShadow"
                           placeholder="0 4px 15px rgba(0, 0, 0, 0.1)">
                  </div>
                </div>
                <div class="style-field shadow-field">
                  <label>Hover Shadow</label>
                  <div class="shadow-controls">
                    <input type="color" v-model="hoverShadowColor.hex" @input="updateHoverShadowFromColor">
                    <div class="opacity-control">
                      <input type="range" v-model.number="hoverShadowColor.opacity" min="0" max="1" step="0.05"
                             @input="updateHoverShadowFromColor">
                      <span>{{ (hoverShadowColor.opacity * 100).toFixed(0) }}%</span>
                    </div>
                    <input type="text" v-model="content.hoverShadow"
                           @input="updateColorFromHoverShadow"
                           placeholder="0 4px 8px rgba(3, 19, 88, 0.15)">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="slide-up">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <i :class="toast.icon"></i>
        <span>{{ toast.message }}</span>
        <button @click="toast.show = false">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import api from '../../../../api/api.js'
import { baseImgaeUrl } from "../../../../assets/js/global.js";

// ========== STATE MANAGEMENT ==========
const activeSection = ref('content')
const isLoading = ref(false)

// Gradient colors state
const gradientColors = reactive({
  primary: {
    color1: '#031358',
    color2: '#2a5298'
  }
})

// RGBA colors state
const lightBlueBg = reactive({
  hex: '#f0f5ff',
  opacity: 0.7
})

const hoverBlueBg = reactive({
  hex: '#dbeafe',
  opacity: 0.7
})

// Shadow colors state
const shadowColor = reactive({
  hex: '#000000',
  opacity: 0.1
})

const hoverShadowColor = reactive({
  hex: '#031358',
  opacity: 0.15
})

// Content structure
const content = reactive({
  mainTitle: 'NHÓM ĐẦU TƯ',
  topInvestorsTitle: 'TOP NHÀ ĐẦU TƯ',
  packageLabel: 'Gói: ',
  top1Badge: 'Top 1',
  top2Badge: '2',
  top3Badge: '3',
  formTitle: 'Đăng ký góp vốn ngay',
  nameLabel: 'Họ và tên',
  phoneLabel: 'Số điện thoại',
  emailLabel: 'Email',
  packageSelectLabel: 'Gói đầu tư dự kiến đăng ký',
  packagePlaceholder: 'Chọn gói đầu tư',
  noteLabel: 'Ghi chú',
  submitButtonText: 'Đăng ký ngay',
  checkIcon: '✓',
  callToActionText: 'Đăng ký ngay để được liên hệ tư vấn sớm nhất',
  tableHeaders: ['STT', 'Họ Tên', 'Ngày góp vốn', 'Gói góp vốn', 'Tỷ lệ'],
  primaryColor: '#031358',
  secondaryColor: '#2a5298',
  accentColor: '#e53e3e',
  goldColor: 'gold',
  silverColor: '#c0c0c0',
  bronzeColor: '#cd7f32',
  whiteColor: '#ffffff',
  lightBlueBg: 'rgba(240, 245, 255, 0.7)',
  hoverBlueBg: 'rgba(219, 234, 254, 0.7)',
  textColor: '#031358',
  requiredColor: '#e53e3e',
  primaryGradient: 'linear-gradient(135deg, #031358, #2a5298)',
  mainTitleFontSize: '33px',
  formTitleFontSize: '25px',
  tableHeaderFontSize: '20px',
  topInvestorsTitleFontSize: '20px',
  compactNameFontSize: '16px',
  compactPackageFontSize: '12px',
  top1CompactNameFontSize: '18px',
  top1CompactPackageFontSize: '13px',
  labelFontSize: '12px',
  callToActionFontSize: '10px',
  containerPadding: '30px 20px',
  formPadding: '30px',
  tableCellPadding: '15px',
  tableHeaderPadding: '18px 15px',
  compactPadding: '12px',
  borderLeftWidth: '4px',
  borderLeftColor: '#2a5298',
  avatarBorderWidth: '2px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  hoverShadow: '0 4px 8px rgba(3, 19, 88, 0.15)',
  submitBtnHoverShadow: '0 6px 12px rgba(3, 19, 88, 0.3)',
  borderRadius: '15px',
  inputBorderRadius: '6px',
  avatarBorderRadius: '50%',
  transitionDuration: '0.3s',
  compactAvatarSize: '50px',
  top1CompactAvatarSize: '55px',
  compactBadgeSize: '35px'
})

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

// Computed
const contentFields = computed(() => {
  return Object.keys(content).filter(key => typeof content[key] === 'string')
})

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
  // FIXED: Cập nhật show thành true
  toast.show = true
  setTimeout(() => { toast.show = false }, 3000)
}

const addTableHeader = () => {
  content.tableHeaders.push(`Cột ${content.tableHeaders.length + 1}`)
}

const removeTableHeader = (index) => {
  if (content.tableHeaders.length > 1) {
    content.tableHeaders.splice(index, 1)
  }
}

// ========== GRADIENT FUNCTIONS ==========
const parseGradientColors = (gradientStr) => {
  if (!gradientStr) return { color1: '#031358', color2: '#2a5298' }

  // Tìm tất cả các màu trong gradient string
  const colorMatches = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)|\b[a-zA-Z]+\b/g)

  if (colorMatches && colorMatches.length >= 2) {
    // Lấy 2 màu đầu tiên (bỏ qua các từ khóa như "linear-gradient", "deg", v.v.)
    const colors = colorMatches.filter(match => {
      // Loại bỏ các từ khóa không phải màu
      const lower = match.toLowerCase()
      return !['linear', 'gradient', 'to', 'top', 'bottom', 'left', 'right', 'deg', '135deg'].includes(lower)
    })

    if (colors.length >= 2) {
      return { color1: colors[0], color2: colors[1] }
    }
  }

  return { color1: '#031358', color2: '#2a5298' }
}

// Hàm để khởi tạo gradient từ primary và secondary colors
const initializeGradientFromColors = () => {
  gradientColors.primary.color1 = content.primaryColor
  gradientColors.primary.color2 = content.secondaryColor
  updatePrimaryGradient()
}

const updatePrimaryGradient = () => {
  content.primaryGradient = `linear-gradient(135deg, ${gradientColors.primary.color1}, ${gradientColors.primary.color2})`
}

const updatePrimaryColorsFromGradient = () => {
  const colors = parseGradientColors(content.primaryGradient)
  gradientColors.primary.color1 = colors.color1
  gradientColors.primary.color2 = colors.color2
}

const updateGradientColors = () => {
  updatePrimaryGradient()
}

// Watch primary and secondary colors để đồng bộ với gradient
watch(() => [content.primaryColor, content.secondaryColor], () => {
  gradientColors.primary.color1 = content.primaryColor
  gradientColors.primary.color2 = content.secondaryColor
  updatePrimaryGradient()
})

// ========== RGBA COLOR FUNCTIONS ==========
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return { r, g, b }
}

const parseRgbaColor = (rgbaStr) => {
  if (!rgbaStr) return { hex: '#f0f5ff', opacity: 0.7 }
  const rgbaMatch = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i)
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1])
    const g = parseInt(rgbaMatch[2])
    const b = parseInt(rgbaMatch[3])
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 0.7
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    return { hex, opacity }
  }
  return { hex: '#f0f5ff', opacity: 0.7 }
}

const updateLightBlueBgFromColor = () => {
  const rgb = hexToRgb(lightBlueBg.hex)
  content.lightBlueBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${lightBlueBg.opacity})`
}

const updateHoverBlueBgFromColor = () => {
  const rgb = hexToRgb(hoverBlueBg.hex)
  content.hoverBlueBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${hoverBlueBg.opacity})`
}

// ========== SHADOW FUNCTIONS ==========
const parseShadowColor = (shadowStr) => {
  if (!shadowStr) return { hex: '#000000', opacity: 0.1 }
  const rgbaMatch = shadowStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i)
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1])
    const g = parseInt(rgbaMatch[2])
    const b = parseInt(rgbaMatch[3])
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 0.1
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    return { hex, opacity }
  }
  return { hex: '#000000', opacity: 0.1 }
}

const updateShadowFromColor = () => {
  const rgb = hexToRgb(shadowColor.hex)
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowColor.opacity})`
  const shadowMatch = content.boxShadow.match(/^([^\(]+)\(/)
  if (shadowMatch) {
    content.boxShadow = `${shadowMatch[1].trim()} ${rgba}`
  } else {
    content.boxShadow = `0 4px 15px ${rgba}`
  }
}

const updateColorFromShadow = () => {
  const parsed = parseShadowColor(content.boxShadow)
  shadowColor.hex = parsed.hex
  shadowColor.opacity = parsed.opacity
}

const updateHoverShadowFromColor = () => {
  const rgb = hexToRgb(hoverShadowColor.hex)
  const rgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${hoverShadowColor.opacity})`
  const shadowMatch = content.hoverShadow.match(/^([^\(]+)\(/)
  if (shadowMatch) {
    content.hoverShadow = `${shadowMatch[1].trim()} ${rgba}`
  } else {
    content.hoverShadow = `0 4px 8px ${rgba}`
  }
}

const updateColorFromHoverShadow = () => {
  const parsed = parseShadowColor(content.hoverShadow)
  hoverShadowColor.hex = parsed.hex
  hoverShadowColor.opacity = parsed.opacity
}

// ========== API FUNCTIONS ==========
const SECTION_ID = 54

const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get(`/cms/getSection/${SECTION_ID}`)

    if (response.data?.contentJson) {
      const data = typeof response.data.contentJson === 'string'
          ? JSON.parse(response.data.contentJson)
          : response.data.contentJson

      Object.assign(content, data)

      // Khởi tạo gradient từ primary và secondary colors
      initializeGradientFromColors()

      // Cập nhật gradient colors từ primaryGradient nếu có
      const primaryColors = parseGradientColors(content.primaryGradient)
      if (primaryColors.color1 && primaryColors.color2) {
        gradientColors.primary.color1 = primaryColors.color1
        gradientColors.primary.color2 = primaryColors.color2
      }

      // Initialize RGBA colors
      const lightBlueParsed = parseRgbaColor(content.lightBlueBg)
      lightBlueBg.hex = lightBlueParsed.hex
      lightBlueBg.opacity = lightBlueParsed.opacity

      const hoverBlueParsed = parseRgbaColor(content.hoverBlueBg)
      hoverBlueBg.hex = hoverBlueParsed.hex
      hoverBlueBg.opacity = hoverBlueParsed.opacity

      // Initialize shadows
      const shadowParsed = parseShadowColor(content.boxShadow)
      shadowColor.hex = shadowParsed.hex
      shadowColor.opacity = shadowParsed.opacity

      const hoverShadowParsed = parseShadowColor(content.hoverShadow)
      hoverShadowColor.hex = hoverShadowParsed.hex
      hoverShadowColor.opacity = hoverShadowParsed.opacity

      showToast('Đã tải dữ liệu thành công', 'success')
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu', 'error')
  } finally {
    isLoading.value = false
  }
}

const saveChanges = async () => {
  try {
    isLoading.value = true

    const sectionData = {
      id: SECTION_ID,
      name: 'Chi tiết - Danh sách người góp vốn',
      contentJson: JSON.stringify(content, null, 2),
      sortOrder: 2,
      files: []
    }

    const formData = new FormData()
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }))

    const response = await api.post('/cms/saveChange', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (response.data) {
      showToast('Đã lưu thay đổi thành công', 'success')
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Lỗi khi lưu thay đổi', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* ========== BASE STYLES ========== */
.investor-editor {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #f8fafc;
  color: #334155;
}

/* ========== HEADER ========== */
.editor-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-content h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-content h1 i {
  color: #4f46e5;
}

.header-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.btn-save {
  background: linear-gradient(135deg, #4f46e5 0%, #7c73ff 100%);
  color: white;
  border: none;
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

/* ========== MAIN LAYOUT ========== */
.editor-main {
  display: flex;
  min-height: calc(100vh - 90px);
}

/* ========== SIDEBAR ========== */
.editor-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-section h3 {
  font-size: 0.875rem;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.sidebar-nav a:hover {
  background: #f8fafc;
  color: #4f46e5;
}

.sidebar-nav a.active {
  background: #f1f5ff;
  color: #4f46e5;
  font-weight: 600;
}

.sidebar-nav a i {
  width: 20px;
  text-align: center;
}

.nav-badge {
  margin-left: auto;
  background: #e2e8f0;
  color: #64748b;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
}

.sidebar-nav a.active .nav-badge {
  background: #4f46e5;
  color: white;
}

/* Preview Card */
.preview-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.preview-header {
  background: linear-gradient(135deg, #031358, #2a5298);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  text-align: center;
}

.preview-header h4 {
  color: white;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.preview-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.preview-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: white;
}

.preview-badge.gold {
  background: linear-gradient(135deg, gold, #ffd700);
  color: #854d0e;
}

.preview-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #d4d4d4);
  color: #374151;
}

.preview-badge.bronze {
  background: linear-gradient(135deg, #cd7f32, #e69542);
  color: white;
}

.color-dots {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: help;
}

/* ========== CONTENT AREA ========== */
.editor-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-description {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* ========== CONTENT SECTION ========== */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.content-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.content-card.wide {
  grid-column: span 2;
}

@media (max-width: 1200px) {
  .content-card.wide {
    grid-column: span 1;
  }
}

.card-header {
  background: #f8fafc;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-add {
  background: #f1f5ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
}

.btn-add:hover {
  background: #4f46e5;
  color: white;
}

.card-body {
  padding: 1.5rem;
}

.form-field {
  margin-bottom: 1.25rem;
}

.form-field:last-child {
  margin-bottom: 0;
}

.form-field label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #475569;
  font-size: 0.9rem;
}

.form-field label i {
  color: #64748b;
  width: 16px;
  text-align: center;
}

.field-hint {
  margin-left: auto;
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 400;
}

.form-field input,
.form-field textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
  font-family: inherit;
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-field textarea {
  min-height: 80px;
  resize: vertical;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Table Headers */
.table-headers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.header-field {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
}

.header-field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.header-number {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-remove {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background: #fecaca;
  transform: scale(1.1);
}

.header-field input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.header-preview {
  font-size: 0.8rem;
  color: #475569;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Badge Fields */
.badge-fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.badge-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge-field label {
  font-weight: 600;
  font-size: 0.875rem;
  color: #475569;
  text-align: center;
}

.badge-field.gold label {
  color: #854d0e;
}

.badge-field.silver label {
  color: #374151;
}

.badge-field.bronze label {
  color: #92400e;
}

.badge-field input {
  text-align: center;
  font-weight: 600;
}

/* ========== COLORS SECTION ========== */
.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.color-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.color-card.wide {
  grid-column: span 2;
}

@media (max-width: 1200px) {
  .color-card.wide {
    grid-column: span 1;
  }
}

.color-card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
}

.color-card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-preview-large {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gradient-preview-large {
  width: 80px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.color-fields,
.gradient-controls {
  padding: 1.5rem;
}

.color-field {
  margin-bottom: 1.25rem;
}

.color-field:last-child {
  margin-bottom: 0;
}

.color-field-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.color-name {
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
}

.color-value {
  font-family: 'Consolas', monospace;
  font-size: 0.8rem;
  color: #64748b;
  background: #f8fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.color-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.color-controls input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.color-controls input[type="text"] {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Consolas', monospace;
}

.color-field.with-opacity .color-controls {
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
}

.opacity-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.opacity-control input[type="range"] {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  background: linear-gradient(to right, #e2e8f0, #4f46e5);
  border-radius: 3px;
  outline: none;
}

.opacity-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.opacity-control span {
  min-width: 40px;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

/* Gradient Controls */
.gradient-colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.gradient-color {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gradient-color label {
  font-weight: 500;
  color: #475569;
  font-size: 0.9rem;
}

.gradient-output label {
  display: block;
  font-weight: 500;
  color: #475569;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.gradient-output input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Consolas', monospace;
}

/* Medal Colors */
.color-field.medal {
  position: relative;
  padding-left: 48px;
}

.color-field.medal::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-field.medal.gold::before {
  background: linear-gradient(135deg, gold, #ffd700);
}

.color-field.medal.silver::before {
  background: linear-gradient(135deg, #c0c0c0, #d4d4d4);
}

.color-field.medal.bronze::before {
  background: linear-gradient(135deg, #cd7f32, #e69542);
}

/* ========== STYLES SECTION ========== */
.styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.style-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.style-card.wide {
  grid-column: span 2;
}

@media (max-width: 1200px) {
  .style-card.wide {
    grid-column: span 1;
  }
}

.style-card-header {
  background: #f8fafc;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.style-card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.style-fields {
  padding: 1.5rem;
}

.style-field {
  margin-bottom: 1rem;
}

.style-field:last-child {
  margin-bottom: 0;
}

.style-field label {
  display: block;
  font-weight: 500;
  color: #475569;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.style-field input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
}

.input-with-unit {
  position: relative;
}

.input-with-unit input {
  padding-right: 50px;
}

.input-with-unit span {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.style-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

/* Shadow Fields */
.shadow-field .shadow-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.shadow-field .shadow-controls input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.shadow-field .shadow-controls .opacity-control {
  flex: 1;
  max-width: 120px;
}

.shadow-field .shadow-controls input[type="text"] {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Consolas', monospace;
}

/* ========== TOAST ========== */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  max-width: 400px;
  animation: slideInRight 0.3s ease;
}

.toast.success {
  border-left: 4px solid #10b981;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast.warning {
  border-left: 4px solid #f59e0b;
}

.toast.info {
  border-left: 4px solid #3b82f6;
}

.toast i {
  font-size: 1.25rem;
}

.toast.success i {
  color: #10b981;
}

.toast.error i {
  color: #ef4444;
}

.toast.warning i {
  color: #f59e0b;
}

.toast.info i {
  color: #3b82f6;
}

.toast span {
  flex: 1;
  font-weight: 500;
}

.toast button {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toast button:hover {
  color: #64748b;
  background: #f1f5f9;
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ========== RESPONSIVE ========== */
@media (max-width: 1024px) {
  .editor-main {
    flex-direction: column;
  }

  .editor-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .sidebar-nav a {
    flex: 1;
    min-width: 140px;
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1rem;
  }

  .header-content h1 {
    font-size: 1.5rem;
    justify-content: center;
  }

  .editor-content {
    padding: 1rem;
  }

  .content-grid,
  .colors-grid,
  .styles-grid {
    grid-template-columns: 1fr;
  }

  .form-row,
  .gradient-colors,
  .style-row {
    grid-template-columns: 1fr;
  }

  .table-headers-grid {
    grid-template-columns: 1fr;
  }

  .badge-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .sidebar-nav {
    flex-direction: column;
  }

  .sidebar-nav a {
    min-width: 100%;
  }

  .color-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .shadow-field .shadow-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .shadow-field .shadow-controls .opacity-control {
    max-width: 100%;
  }
}

/* ========== UTILITIES ========== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

* {
  box-sizing: border-box;
}
</style>