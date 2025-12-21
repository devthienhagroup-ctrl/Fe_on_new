<template>
  <div class="banner-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Banner</h2>
      <div class="header-controls">
        <button class="btn btn-primary" @click="addNewBanner">
          <i class="fas fa-plus"></i> Thêm Banner Mới
        </button>
        <button class="btn btn-success" @click="saveChanges" :disabled="isLoading">
          <i class="fas fa-save"></i> {{ isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
        </button>
      </div>
    </div>

    <!-- Quick Actions Bar -->
    <div class="quick-actions" v-if="activeBanner !== null">
      <div class="quick-actions-inner">
        <span class="quick-actions-label">Nhanh:</span>
        <button class="btn-quick" @click="toggleAllSections(true)">
          <i class="fas fa-expand"></i> Mở tất cả
        </button>
        <button class="btn-quick" @click="toggleAllSections(false)">
          <i class="fas fa-compress"></i> Đóng tất cả
        </button>
        <button class="btn-quick" @click="scrollToTop">
          <i class="fas fa-chevron-up"></i> Lên đầu
        </button>
        <button class="btn-quick" @click="copySettings">
          <i class="fas fa-copy"></i> Sao chép cài đặt
        </button>
      </div>
    </div>

    <!-- Danh sách banner -->
    <div class="banners-list">
      <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          class="banner-item"
          :class="{ active: activeBannerIndex === index }"
          @click="selectBanner(index)"
      >
        <div class="banner-thumbnail">
          <img :src="getImageUrl(banner.imageUrl)" :alt="banner.altText || 'Banner'" />
          <span class="banner-number">Banner {{ index + 1 }}</span>
          <div v-if="!banner.imageUrl" class="banner-warning">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
        </div>
        <div class="banner-actions">
          <button
              class="btn-icon btn-move-up"
              @click.stop="moveBannerUp(index)"
              :disabled="index === 0"
              title="Di chuyển lên"
          >
            <i class="fas fa-chevron-up"></i>
          </button>
          <button
              class="btn-icon btn-move-down"
              @click.stop="moveBannerDown(index)"
              :disabled="index === banners.length - 1"
              title="Di chuyển xuống"
          >
            <i class="fas fa-chevron-down"></i>
          </button>
          <button
              class="btn-icon btn-remove"
              @click.stop="removeBanner(index)"
              :disabled="banners.length <= 1"
              title="Xóa banner"
          >
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Form chỉnh sửa -->
    <div v-if="activeBanner !== null" class="editor-content">

      <!-- Search Results Notification -->
      <div v-if="searchResults.length > 0 && searchQuery" class="search-notification">
        <div class="notification-content">
          <i class="fas fa-search"></i>
          <span>Tìm thấy <strong>{{ searchResults.length }}</strong> kết quả cho "<strong>{{ searchQuery }}</strong>"</span>
          <button class="btn-notification-close" @click="clearSearch">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- 1. Thông tin cơ bản - Luôn hiển thị -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('basic')">
          <div class="header-left">
            <h3><i class="fas fa-info-circle"></i> Thông tin cơ bản</h3>
            <p class="section-description">Cấu hình ảnh banner và mô tả</p>
          </div>
          <div class="header-right">
            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.basic }"></i>
          </div>
        </div>
        <div v-if="isSectionOpen.basic" class="section-content">
          <div class="form-group">
            <label for="image-upload">
              <i class="fas fa-image"></i> Ảnh banner
              <span class="required-mark">*</span>
            </label>
            <div class="file-upload">
              <div class="file-upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" style="display: none" />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh vào đây hoặc <span>chọn từ máy</span></p>
              </div>
              <div v-if="activeBanner.imageUrl || uploadedImagePreview" class="upload-preview">
                <img :src="getImageUrl(activeBanner.imageUrl)" alt="Preview" />
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewImage" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeUploadedImage" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
            <p class="input-hint">Tải ảnh lên từ máy tính của bạn</p>
          </div>

          <div class="form-group">
            <label for="alt-text">
              <i class="fas fa-font"></i> Mô tả ảnh (cho SEO)
            </label>
            <textarea id="alt-text" v-model="activeBanner.altText" placeholder="Nhập mô tả ảnh banner cho SEO..." rows="3"></textarea>
            <p class="input-hint">Mô tả này giúp cải thiện SEO và hỗ trợ người dùng khiếm thị</p>
          </div>
        </div>
      </div>

      <!-- 2. Vị trí thanh tìm kiếm -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('position')">
          <div class="header-left">
            <h3><i class="fas fa-crosshairs"></i> Vị trí thanh tìm kiếm</h3>
            <p class="section-description">Điều chỉnh vị trí ô tìm kiếm trên banner</p>
          </div>
          <div class="header-right">
            <span class="section-badge" v-if="isSearchMatch('position') || isSearchMatch('vị trí')">Tìm thấy</span>
            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.position }"></i>
          </div>
        </div>
        <div v-if="isSectionOpen.position" class="section-content">
          <p class="section-description-detail">Điều chỉnh vị trí ô tìm kiếm trên banner cho các kích thước màn hình</p>

          <div class="responsive-inputs compact">
            <div class="input-group form-group" :class="{ highlighted: isSearchMatch('desktop') || isSearchMatch('máy tính') }">
              <label for="search-desktop" class="input-label-with-icon">
                <i class="fas fa-desktop"></i> Máy tính để bàn
              </label>
              <div class="input-with-unit">
                <input type="text" id="search-desktop" v-model="activeBanner.searchWrapperPosition.desktop" placeholder="55%" />
                <span class="unit">% hoặc px</span>
              </div>
            </div>

            <div class="input-group form-group" :class="{ highlighted: isSearchMatch('tablet') || isSearchMatch('máy tính bảng') }">
              <label for="search-tablet" class="input-label-with-icon">
                <i class="fas fa-tablet-alt"></i> Máy tính bảng
              </label>
              <div class="input-with-unit">
                <input type="text" id="search-tablet" v-model="activeBanner.searchWrapperPosition.tablet" placeholder="40%" />
                <span class="unit">% hoặc px</span>
              </div>
            </div>

            <div class="input-group form-group" :class="{ highlighted: isSearchMatch('mobile') || isSearchMatch('điện thoại') }">
              <label for="search-mobile" class="input-label-with-icon">
                <i class="fas fa-mobile-alt"></i> Điện thoại
              </label>
              <div class="input-with-unit">
                <input type="text" id="search-mobile" v-model="activeBanner.searchWrapperPosition.mobile" placeholder="120px" />
                <span class="unit">% hoặc px</span>
              </div>
            </div>

            <div class="input-group form-group" :class="{ highlighted: isSearchMatch('mobile small') || isSearchMatch('điện thoại nhỏ') }">
              <label for="search-mobile-small" class="input-label-with-icon">
                <i class="fas fa-mobile"></i> Điện thoại nhỏ
              </label>
              <div class="input-with-unit">
                <input type="text" id="search-mobile-small" v-model="activeBanner.searchWrapperPosition.mobileSmall" placeholder="100px" />
                <span class="unit">% hoặc px</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Cấu hình thanh tìm kiếm - GOM NHÓM -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('searchConfig')">
          <div class="header-left">
            <h3><i class="fas fa-search"></i> Cấu hình thanh tìm kiếm</h3>
            <p class="section-description">Tùy chỉnh toàn bộ thanh tìm kiếm trên banner</p>
          </div>
          <div class="header-right">
            <span class="section-badge" v-if="isSearchMatch('search') || isSearchMatch('tìm kiếm')">Tìm thấy</span>
            <span class="section-count">6 phần</span>
            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.searchConfig }"></i>
          </div>
        </div>

        <div v-if="isSectionOpen.searchConfig" class="section-content">
          <!-- Sub-sections với accordion -->
          <div class="sub-sections">

            <!-- 3.1 Tab tìm kiếm -->
            <div class="editor-subsection">
              <div class="subsection-header" @click="toggleSubSection('tabs')">
                <h4><i class="fas fa-folder"></i> Tab Tìm kiếm</h4>
                <i class="subsection-collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSubSectionOpen.tabs }"></i>
              </div>
              <div v-if="isSubSectionOpen.tabs" class="subsection-content">
                <div class="form-group compact">
                  <label>Tab mặc định</label>
                  <div class="radio-group">
                    <div class="radio-option">
                      <input type="radio" id="tab-dinhgia" value="dinhgia" v-model="searchForm.tabs.activeTab" />
                      <label for="tab-dinhgia" class="radio-label">Định giá</label>
                    </div>
                    <div class="radio-option">
                      <input type="radio" id="tab-kygui" value="kygui" v-model="searchForm.tabs.activeTab" />
                      <label for="tab-kygui" class="radio-label">Ký gửi</label>
                    </div>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group compact">
                    <label for="tab1-label">Tên Tab 1</label>
                    <input type="text" id="tab1-label" v-model="searchForm.tabs.tab1.label" placeholder="Định giá" />
                  </div>
                  <div class="form-group compact">
                    <label for="tab2-label">Tên Tab 2</label>
                    <input type="text" id="tab2-label" v-model="searchForm.tabs.tab2.label" placeholder="Ký gửi" />
                  </div>
                </div>

                <!-- Responsive settings cho tab -->
                <div class="responsive-settings">
                  <h5><i class="fas fa-mobile-alt"></i> Cài đặt responsive cho tab</h5>

                  <div class="setting-group">
                    <h6>Chiều cao tab</h6>
                    <div class="responsive-inputs compact">
                      <div class="input-group form-group" v-for="device in responsiveDevices" :key="device.key">
                        <label :for="`tab-height-${device.key}`" class="input-label-with-icon">
                          <i :class="device.icon"></i> {{ device.label }}
                        </label>
                        <div class="input-with-unit">
                          <input
                              :id="`tab-height-${device.key}`"
                              type="text"
                              v-model="searchForm.tabs.height[device.key]"
                              :placeholder="device.placeholder"
                          />
                          <span class="unit">px</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="setting-group">
                    <h6>Kích thước chữ tab</h6>
                    <div class="responsive-inputs compact">
                      <div class="input-group form-group" v-for="device in responsiveDevices" :key="device.key">
                        <label :for="`tab-font-${device.key}`" class="input-label-with-icon">
                          <i :class="device.icon"></i> {{ device.label }}
                        </label>
                        <div class="input-with-unit">
                          <input
                              :id="`tab-font-${device.key}`"
                              type="text"
                              v-model="searchForm.tabs.fontSize[device.key]"
                              :placeholder="device.fontPlaceholder"
                          />
                          <span class="unit">px</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Màu sắc tab -->
                  <div class="setting-group">
                    <h6>Màu sắc tab</h6>
                    <div class="color-settings-grid">
                      <div class="color-setting">
                        <label>Tab không active</label>
                        <div class="color-input form-group compact">
                          <input type="color" v-model="searchForm.tabs.colors.inactiveBackground" />
                          <input type="text" v-model="searchForm.tabs.colors.inactiveBackground" placeholder="#EFF0F5" />
                        </div>
                      </div>
                      <div class="color-setting">
                        <label>Tab active</label>
                        <div class="color-input form-group compact">
                          <input type="color" v-model="searchForm.tabs.colors.activeBackground" />
                          <input type="text" v-model="searchForm.tabs.colors.activeBackground" placeholder="#031358" />
                        </div>
                      </div>
                      <div class="color-setting">
                        <label>Chữ không active</label>
                        <div class="color-input form-group compact">
                          <input type="color" v-model="searchForm.tabs.colors.inactiveText" />
                          <input type="text" v-model="searchForm.tabs.colors.inactiveText" placeholder="#000000" />
                        </div>
                      </div>
                      <div class="color-setting">
                        <label>Chữ active</label>
                        <div class="color-input form-group compact">
                          <input type="color" v-model="searchForm.tabs.colors.activeText" />
                          <input type="text" v-model="searchForm.tabs.colors.activeText" placeholder="#FFFFFF" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3.2 Dropdown loại BĐS -->
            <div class="editor-subsection">
              <div class="subsection-header" @click="toggleSubSection('propertyType')">
                <h4><i class="fas fa-caret-down"></i> Dropdown Loại Bất Động Sản</h4>
                <i class="subsection-collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSubSectionOpen.propertyType }"></i>
              </div>
              <div v-if="isSubSectionOpen.propertyType" class="subsection-content">
                <div class="form-group compact">
                  <label>Loại mặc định</label>
                  <select v-model="searchForm.propertyType.selected.value" class="form-select compact">
                    <option v-for="option in searchForm.propertyType.options" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>

                <!-- Danh sách options -->
                <div class="form-group compact">
                  <label>Danh sách loại bất động sản</label>
                  <div class="options-list compact">
                    <div v-for="(option, index) in searchForm.propertyType.options" :key="index" class="option-item compact">
                      <input type="text" v-model="option.label" placeholder="Tên loại" class="option-label" />
                      <input type="text" v-model="option.value" placeholder="Giá trị" class="option-value" />
                      <button
                          class="btn-icon btn-remove-option"
                          @click="removePropertyTypeOption(index)"
                          :disabled="searchForm.propertyType.options.length <= 1"
                          title="Xóa loại"
                      >
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                    <button class="btn btn-sm" @click="addPropertyTypeOption">
                      <i class="fas fa-plus"></i> Thêm loại
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3.3 Input tìm kiếm -->
            <div class="editor-subsection">
              <div class="subsection-header" @click="toggleSubSection('searchInput')">
                <h4><i class="fas fa-search"></i> Input Tìm Kiếm</h4>
                <i class="subsection-collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSubSectionOpen.searchInput }"></i>
              </div>
              <div v-if="isSubSectionOpen.searchInput" class="subsection-content">
                <div class="form-group compact">
                  <label>Placeholder</label>
                  <input type="text" v-model="searchForm.searchInput.placeholder" placeholder="Tìm kiếm theo từ khóa..." />
                </div>

                <!-- Kích thước input -->
                <div class="setting-group">
                  <h6><i class="fas fa-ruler"></i> Kích thước input</h6>
                  <div class="responsive-inputs compact">
                    <div class="input-group form-group" v-for="device in responsiveDevices" :key="device.key">
                      <label :for="`input-height-${device.key}`" class="input-label-with-icon">
                        <i :class="device.icon"></i> {{ device.label }}
                      </label>
                      <div class="input-with-unit">
                        <input
                            :id="`input-height-${device.key}`"
                            type="text"
                            v-model="searchForm.searchInput.height[device.key]"
                            placeholder="50px"
                        />
                        <span class="unit">px</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Màu sắc input -->
                <div class="setting-group">
                  <h6><i class="fas fa-palette"></i> Màu sắc input</h6>
                  <div class="color-settings-grid">
                    <div class="color-setting">
                      <label>Background</label>
                      <div class="color-input form-group compact">
                        <input type="color" v-model="searchForm.searchInput.colors.background" />
                        <input type="text" v-model="searchForm.searchInput.colors.background" placeholder="#FFFFFF" />
                      </div>
                    </div>
                    <div class="color-setting">
                      <label>Border</label>
                      <div class="color-input form-group compact">
                        <input type="color" v-model="searchForm.searchInput.colors.border" />
                        <input type="text" v-model="searchForm.searchInput.colors.border" placeholder="#E6E6E6" />
                      </div>
                    </div>
                    <div class="color-setting">
                      <label>Text</label>
                      <div class="color-input form-group compact">
                        <input type="color" v-model="searchForm.searchInput.colors.text" />
                        <input type="text" v-model="searchForm.searchInput.colors.text" placeholder="#333333" />
                      </div>
                    </div>
                    <div class="color-setting">
                      <label>Placeholder</label>
                      <div class="color-input form-group compact">
                        <input type="color" v-model="searchForm.searchInput.colors.placeholder" />
                        <input type="text" v-model="searchForm.searchInput.colors.placeholder" placeholder="#999999" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3.4 Nút tìm kiếm -->
            <div class="editor-subsection">
              <div class="subsection-header" @click="toggleSubSection('searchButton')">
                <h4><i class="fas fa-search-location"></i> Nút Tìm Kiếm</h4>
                <i class="subsection-collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSubSectionOpen.searchButton }"></i>
              </div>
              <div v-if="isSubSectionOpen.searchButton" class="subsection-content">
                <div class="form-group compact">
                  <label>Text nút</label>
                  <input type="text" v-model="searchForm.searchButton.text" placeholder="Tìm kiếm" />
                </div>

                <!-- Kích thước button -->
                <div class="setting-group">
                  <h6><i class="fas fa-expand-alt"></i> Kích thước button</h6>
                  <div class="responsive-inputs compact">
                    <div class="input-group form-group" v-for="device in responsiveDevices" :key="device.key">
                      <label :for="`btn-width-${device.key}`" class="input-label-with-icon">
                        <i :class="device.icon"></i> {{ device.label }}
                      </label>
                      <div class="input-with-unit">
                        <input
                            :id="`btn-width-${device.key}`"
                            type="text"
                            v-model="searchForm.searchButton.size[device.key]"
                            placeholder="120px"
                        />
                        <span class="unit">px</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Màu sắc button -->
                <div class="setting-group">
                  <h6><i class="fas fa-palette"></i> Màu sắc button</h6>
                  <div class="color-settings-grid">
                    <div class="color-setting">
                      <label>Background</label>
                      <div class="color-input form-group compact">
                        <input type="color" v-model="searchForm.searchButton.colors.background" />
                        <input type="text" v-model="searchForm.searchButton.colors.background" placeholder="#031358" />
                      </div>
                    </div>
                    <div class="color-setting">
                      <label>Hover Background</label>
                      <div class="color-input form-group compact">
                        <input type="color" v-model="searchForm.searchButton.colors.hoverBackground" />
                        <input type="text" v-model="searchForm.searchButton.colors.hoverBackground" placeholder="#020D3A" />
                      </div>
                    </div>
                    <div class="color-setting">
                      <label>Text</label>
                      <div class="color-input form-group compact">
                        <input type="color" v-model="searchForm.searchButton.colors.text" />
                        <input type="text" v-model="searchForm.searchButton.colors.text" placeholder="#FFFFFF" />
                      </div>
                    </div>
                    <div class="color-setting">
                      <label>Hover Text</label>
                      <div class="color-input form-group compact">
                        <input type="color" v-model="searchForm.searchButton.colors.hoverText" />
                        <input type="text" v-model="searchForm.searchButton.colors.hoverText" placeholder="#FFFFFF" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 4. Hiệu ứng hạt động (Particles) -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('particles')">
          <div class="header-left">
            <h3><i class="fas fa-dot-circle"></i> Hiệu ứng hạt động (Particles)</h3>
            <p class="section-description">Tùy chỉnh hiệu ứng các hạt động chuyển động trên banner</p>
          </div>
          <div class="header-right">
            <div class="toggle-switch">
              <input type="checkbox" id="enable-particles" v-model="activeBanner.particleSettings.enabled" />
              <label for="enable-particles" class="toggle-label"></label>
            </div>
            <span class="section-badge" v-if="isSearchMatch('particle') || isSearchMatch('hạt')">Tìm thấy</span>
            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.particles }"></i>
          </div>
        </div>
        <div v-if="isSectionOpen.particles && activeBanner.particleSettings.enabled" class="section-content">
          <div class="particle-settings-grid">
            <div class="particle-color-settings">
              <div class="form-group compact">
                <label for="particle-color">Màu sắc hạt</label>
                <div class="color-input form-group compact">
                  <input type="color" id="particle-color" v-model="activeBanner.particleSettings.particleColor" />
                  <input type="text" v-model="activeBanner.particleSettings.particleColor" placeholder="#031358" />
                </div>
              </div>
              <div class="form-group compact">
                <label for="line-color">Màu đường kết nối</label>
                <div class="color-input form-group compact">
                  <input type="color" id="line-color" v-model="activeBanner.particleSettings.lineColor" />
                  <input type="text" v-model="activeBanner.particleSettings.lineColor" placeholder="#031358" />
                </div>
              </div>
            </div>

            <!-- Số lượng hạt -->
            <div class="setting-group">
              <h5><i class="fas fa-sort-amount-up"></i> Số lượng hạt</h5>
              <div class="responsive-inputs compact">
                <div class="input-group form-group" v-for="device in particleDevices" :key="device.key">
                  <label :for="`count-${device.key}`" class="input-label-with-icon">
                    <i :class="device.icon"></i> {{ device.label }}
                  </label>
                  <div class="input-with-unit">
                    <input
                        :id="`count-${device.key}`"
                        type="number"
                        v-model.number="activeBanner.particleSettings.particleCount[device.key]"
                        :min="device.min"
                        :max="device.max"
                        step="1"
                    />
                    <span class="unit">hạt</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Kích thước hạt -->
            <div class="setting-group">
              <h5><i class="fas fa-expand-alt"></i> Kích thước hạt</h5>
              <div class="responsive-inputs compact">
                <!-- Trong phần Kích thước hạt -->
                <div class="input-group form-group" v-for="device in particleDevices" :key="device.key">
                  <label :for="`size-${device.key}`" class="input-label-with-icon">
                    <i :class="device.icon"></i> {{ device.label }}
                  </label>
                  <div class="input-with-unit">
                    <input
                        :id="`size-${device.key}`"
                        type="text"
                        v-model="activeBanner.particleSettings.maxParticleSize[device.key]"
                        placeholder="3px"
                    />
                    <span class="unit">px</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tốc độ di chuyển -->
            <div class="setting-group">
              <h5><i class="fas fa-tachometer-alt"></i> Tốc độ di chuyển</h5>
              <div class="responsive-inputs compact">
                <div class="input-group form-group" v-for="device in particleDevices" :key="device.key">
                  <label :for="`speed-${device.key}`" class="input-label-with-icon">
                    <i :class="device.icon"></i> {{ device.label }}
                  </label>
                  <div class="input-with-unit">
                    <input
                        :id="`speed-${device.key}`"
                        type="text"
                        v-model="activeBanner.particleSettings.moveSpeed[device.key]"
                        placeholder="1.5"
                    />
                    <span class="unit">px/frame</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Mũi tên chuyển slide -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('arrows')">
          <div class="header-left">
            <h3><i class="fas fa-arrow-right"></i> Mũi tên chuyển slide</h3>
            <p class="section-description">Tùy chỉnh giao diện các nút mũi tên</p>
          </div>
          <div class="header-right">
            <div class="toggle-switch">
              <input type="checkbox" id="enable-arrows" v-model="sliderArrows.enabled" />
              <label for="enable-arrows" class="toggle-label"></label>
            </div>
            <span class="section-badge" v-if="isSearchMatch('arrow') || isSearchMatch('mũi tên')">Tìm thấy</span>
            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.arrows }"></i>
          </div>
        </div>
        <div v-if="isSectionOpen.arrows && sliderArrows.enabled" class="section-content">
          <div class="form-group">
            <label for="enable-arrows">Hiển thị mũi tên</label>
            <!--            <div class="checkbox-input">-->
            <!--              <input type="checkbox" id="enable-arrows" v-model="sliderArrows.enabled" />-->
            <!--              <label for="enable-arrows" class="checkbox-label">Kích hoạt</label>-->
            <!--            </div>-->
          </div>

          <div v-if="sliderArrows.enabled" class="arrow-settings">
            <div class="form-group">
              <label for="arrow-color">Màu sắc mũi tên</label>
              <div class="color-input form-group">
                <input type="color" id="arrow-color" v-model="sliderArrows.color" />
                <input type="text" v-model="sliderArrows.color" placeholder="#031358" />
              </div>
            </div>

            <div class="form-subsection">
              <h4>Kích thước mũi tên</h4>
              <div class="responsive-inputs">
                <div class="input-group form-group">
                  <label for="arrow-size-desktop">Máy tính để bàn</label>
                  <div class="input-with-unit">
                    <input type="text" id="arrow-size-desktop" v-model="sliderArrows.size.desktop" placeholder="40px" />
                    <span class="unit">px</span>
                  </div>
                </div>

                <div class="input-group form-group">
                  <label for="arrow-size-tablet">Máy tính bảng</label>
                  <div class="input-with-unit">
                    <input type="text" id="arrow-size-tablet" v-model="sliderArrows.size.tablet" placeholder="35px" />
                    <span class="unit">px</span>
                  </div>
                </div>

                <div class="input-group form-group">
                  <label for="arrow-size-mobile">Điện thoại</label>
                  <div class="input-with-unit">
                    <input type="text" id="arrow-size-mobile" v-model="sliderArrows.size.mobile" placeholder="30px" />
                    <span class="unit">px</span>
                  </div>
                </div>

                <div class="input-group form-group">
                  <label for="arrow-size-mobile-small">Điện thoại nhỏ</label>
                  <div class="input-with-unit">
                    <input type="text" id="arrow-size-mobile-small" v-model="sliderArrows.size.mobileSmall" placeholder="25px" />
                    <span class="unit">px</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-subsection">
              <h4>Màu nền mũi tên</h4>
              <div class="responsive-inputs">
                <div class="input-group form-group">
                  <label for="arrow-bg-desktop">Máy tính để bàn</label>
                  <div class="color-input form-group">
                    <input type="color" id="arrow-bg-desktop" v-model="sliderArrows.backgroundColor.desktop" />
                    <input type="text" v-model="sliderArrows.backgroundColor.desktop" placeholder="rgba(255, 255, 255, 0.7)" />
                  </div>
                </div>

                <div class="input-group form-group">
                  <label for="arrow-bg-mobile">Điện thoại</label>
                  <div class="color-input form-group">
                    <input type="color" id="arrow-bg-mobile" v-model="sliderArrows.backgroundColor.mobile" />
                    <input type="text" v-model="sliderArrows.backgroundColor.mobile" placeholder="rgba(255, 255, 255, 0.8)" />
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="arrow-hover-bg">Màu nền khi di chuột</label>
              <div class="color-input form-group">
                <input type="color" id="arrow-hover-bg" v-model="sliderArrows.hoverBackgroundColor" />
                <input type="text" v-model="sliderArrows.hoverBackgroundColor" placeholder="rgba(255, 255, 255, 0.9)" />
              </div>
            </div>

            <div class="form-subsection">
              <h4>Khoảng cách từ viền</h4>
              <div class="responsive-inputs">
                <div class="input-group form-group">
                  <label for="arrow-position-desktop">Máy tính để bàn</label>
                  <div class="input-with-unit">
                    <input type="text" id="arrow-position-desktop" v-model="sliderArrows.position.desktop" placeholder="20px" />
                    <span class="unit">px</span>
                  </div>
                </div>

                <div class="input-group form-group">
                  <label for="arrow-position-tablet">Máy tính bảng</label>
                  <div class="input-with-unit">
                    <input type="text" id="arrow-position-tablet" v-model="sliderArrows.position.tablet" placeholder="15px" />
                    <span class="unit">px</span>
                  </div>
                </div>

                <div class="input-group form-group">
                  <label for="arrow-position-mobile">Điện thoại</label>
                  <div class="input-with-unit">
                    <input type="text" id="arrow-position-mobile" v-model="sliderArrows.position.mobile" placeholder="10px" />
                    <span class="unit">px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Chấm chỉ mục (dots) -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('dots')">
          <div class="header-left">
            <h3><i class="fas fa-circle"></i> Chấm chỉ mục (Dots)</h3>
            <p class="section-description">Tùy chỉnh các chấm chỉ mục</p>
          </div>
          <div class="header-right">
            <div class="toggle-switch">
              <input type="checkbox" id="enable-dots" v-model="sliderDots.enabled" />
              <label for="enable-dots" class="toggle-label"></label>
            </div>
            <span class="section-badge" v-if="isSearchMatch('dot') || isSearchMatch('chấm')">Tìm thấy</span>
            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.dots }"></i>
          </div>
        </div>
        <div v-if="isSectionOpen.dots && sliderDots.enabled" class="section-content">
          <div class="form-group">
            <label for="enable-dots">Hiển thị chấm chỉ mục</label>
            <!--            <div class="checkbox-input">-->
            <!--              <input type="checkbox" id="enable-dots" v-model="sliderDots.enabled" />-->
            <!--              <label for="enable-dots" class="checkbox-label">Kích hoạt</label>-->
            <!--            </div>-->
          </div>

          <div v-if="sliderDots.enabled" class="dots-settings">
            <div class="form-group">
              <label for="dots-color">Màu sắc chấm</label>
              <div class="color-input form-group">
                <input type="color" id="dots-color" v-model="sliderDots.color" />
                <input type="text" v-model="sliderDots.color" placeholder="rgba(255, 255, 255, 0.5)" />
              </div>
            </div>

            <div class="form-group">
              <label for="dots-active-color">Màu chấm đang active</label>
              <div class="color-input form-group">
                <input type="color" id="dots-active-color" v-model="sliderDots.activeColor" />
                <input type="text" v-model="sliderDots.activeColor" placeholder="#4a6cf7" />
              </div>
            </div>

            <div class="form-subsection">
              <h4>Kích thước chấm</h4>
              <div class="responsive-inputs">
                <div class="input-group form-group">
                  <label for="dots-size-desktop">Máy tính để bàn</label>
                  <div class="input-with-unit">
                    <input type="text" id="dots-size-desktop" v-model="sliderDots.size.desktop" placeholder="12px" />
                    <span class="unit">px</span>
                  </div>
                </div>

                <div class="input-group form-group">
                  <label for="dots-size-mobile">Điện thoại</label>
                  <div class="input-with-unit">
                    <input type="text" id="dots-size-mobile" v-model="sliderDots.size.mobile" placeholder="10px" />
                    <span class="unit">px</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-subsection">
              <h4>Vị trí chấm</h4>
              <div class="responsive-inputs">
                <div class="input-group form-group">
                  <label for="dots-position-desktop">Máy tính để bàn</label>
                  <div class="input-with-unit">
                    <input type="text" id="dots-position-desktop" v-model="sliderDots.position.desktop" placeholder="20px" />
                    <span class="unit">px</span>
                  </div>
                </div>

                <div class="input-group form-group">
                  <label for="dots-position-mobile">Điện thoại</label>
                  <div class="input-with-unit">
                    <input type="text" id="dots-position-mobile" v-model="sliderDots.position.mobile" placeholder="15px" />
                    <span class="unit">px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Tự động chuyển slide -->
      <div class="editor-section main-section">
        <div class="section-header" @click="toggleSection('autoplay')">
          <div class="header-left">
            <h3><i class="fas fa-play-circle"></i> Tự động chuyển slide</h3>
            <p class="section-description">Cài đặt tự động chuyển giữa các banner</p>
          </div>
          <div class="header-right">
            <div class="toggle-switch">
              <input type="checkbox" id="enable-autoplay" v-model="sliderSettings.autoplay" />
              <label for="enable-autoplay" class="toggle-label"></label>
            </div>
            <span class="section-badge" v-if="isSearchMatch('autoplay') || isSearchMatch('tự động')">Tìm thấy</span>
            <i class="collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': isSectionOpen.autoplay }"></i>
          </div>
        </div>
        <div v-if="isSectionOpen.autoplay" class="section-content">
          <div class="form-group">
            <label for="enable-autoplay">Bật tự động chuyển</label>
            <!--            <div class="checkbox-input">-->
            <!--              <input type="checkbox" id="enable-autoplay" v-model="sliderSettings.autoplay" />-->
            <!--              <label for="enable-autoplay" class="checkbox-label">Kích hoạt</label>-->
            <!--            </div>-->
          </div>

          <div v-if="sliderSettings.autoplay" class="autoplay-settings">
            <div class="form-group">
              <label for="autoplay-speed">Tốc độ chuyển (ms)</label>
              <div class="input-with-unit">
                <input type="number" id="autoplay-speed" v-model.number="sliderSettings.autoplaySpeed" min="1000" max="10000" step="500" />
                <span class="unit">ms</span>
              </div>
            </div>

            <div class="form-group">
              <label for="pause-on-hover">Tạm dừng khi hover</label>
              <!--              <div class="checkbox-input">-->
              <!--                <input type="checkbox" id="pause-on-hover" v-model="sliderSettings.pauseOnHover" />-->
              <!--                <label for="pause-on-hover" class="checkbox-label">Kích hoạt</label>-->
              <!--              </div>-->
            </div>
          </div>

          <div class="form-group">
            <label for="transition-speed">Tốc độ chuyển tiếp (ms)</label>
            <div class="input-with-unit">
              <input type="number" id="transition-speed" v-model.number="sliderSettings.transitionSpeed" min="100" max="2000" step="100" />
              <span class="unit">ms</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Preview Panel -->
      <div class="quick-preview-panel">
        <div class="preview-header" @click="togglePreviewPanel">
          <h4><i class="fas fa-eye"></i> Xem trước nhanh</h4>
          <i class="preview-collapse-icon fas fa-chevron-down" :class="{ 'fa-chevron-up': showQuickPreview }"></i>
        </div>
        <div v-if="showQuickPreview" class="preview-content">
          <div class="preview-summary">
            <div class="summary-item">
              <span class="summary-label">Tổng số banner:</span>
              <span class="summary-value">{{ banners.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Banner hiện tại:</span>
              <span class="summary-value">{{ activeBannerIndex + 1 }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Hiệu ứng:</span>
              <span class="summary-value">{{ activeBanner.particleSettings.enabled ? 'Bật' : 'Tắt' }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Tự động chuyển:</span>
              <span class="summary-value">{{ sliderSettings.autoplay ? 'Bật' : 'Tắt' }}</span>
            </div>
          </div>
          <button class="btn btn-preview" @click="previewImage">
            <i class="fas fa-eye"></i> Xem trước đầy đủ
          </button>
        </div>
      </div>

    </div>

    <!-- Modal xem trước ảnh -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="closePreviewModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Xem trước ảnh banner</h3>
          <button class="btn-icon btn-close-modal" @click="closePreviewModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="image-preview-container">
            <img :src="getImageUrl(activeBanner.imageUrl)" alt="Xem trước ảnh" />
            <div v-if="!activeBanner.imageUrl" class="preview-placeholder">
              <i class="fas fa-image"></i>
              <p>Chưa có ảnh để xem trước</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closePreviewModal">Đóng</button>
            <button class="btn btn-primary" @click="triggerFileInput">Thay đổi ảnh</button>
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
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const banners = ref([])
const activeBannerIndex = ref(0)
const activeBanner = computed(() =>
    activeBannerIndex.value !== null && banners.value.length > 0
        ? banners.value[activeBannerIndex.value]
        : null
)

// Search form configuration
const searchForm = reactive({
  tabs: {
    activeTab: 'dinhgia',
    tab1: { label: 'Định giá', value: 'dinhgia' },
    tab2: { label: 'Ký gửi', value: 'kygui' },
    colors: {
      inactiveBackground: '#EFF0F5',
      activeBackground: '#031358',
      inactiveText: '#000000',
      activeText: '#FFFFFF'
    },
    height: { desktop: '58px', tablet: '48px', mobile: '40px', mobileSmall: '35px' },
    fontSize: { desktop: '17px', tablet: '15px', mobile: '14px', mobileSmall: '13px' }
  },
  propertyType: {
    selected: { value: 'all', label: 'Tất cả' },
    options: [
      { value: 'all', label: 'Tất cả' },
      { value: 'house', label: 'Nhà phố' },
      { value: 'apartment', label: 'Chung cư' },
      { value: 'villa', label: 'Biệt thự' },
      { value: 'land', label: 'Đất nền' }
    ],
    colors: {
      background: '#B9C0DF',
      hoverBackground: '#a0a8cc',
      text: '#000000'
    },
    height: { desktop: '58px', tablet: '48px', mobile: '40px', mobileSmall: '35px' },
    fontSize: { desktop: '17px', tablet: '15px', mobile: '14px', mobileSmall: '13px' }
  },
  searchInput: {
    placeholder: 'Nhập thông tin tìm kiếm...',
    colors: {
      background: '#EFF0F5',
      text: '#000000',
      border: 'none'
    },
    height: { desktop: '58px', tablet: '48px', mobile: '40px', mobileSmall: '35px' },
    fontSize: { desktop: '17px', tablet: '15px', mobile: '14px', mobileSmall: '13px' }
  },
  searchButton: {
    colors: {
      background: '#EFF0F5',
      hoverBackground: '#e0e1e9',
      activeBackground: '#d1d2dc',
      icon: '#031358'
    },
    size: { desktop: '58px', tablet: '48px', mobile: '40px', mobileSmall: '35px' }
  },
  submitButton: {
    label: 'Tìm kiếm',
    colors: {
      background: 'linear-gradient(to right, #031358, #0629BE)',
      text: '#FFFFFF',
      hoverShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    },
    height: { desktop: '58px', tablet: '48px', mobile: '40px', mobileSmall: '35px' },
    fontSize: { desktop: '17px', tablet: '15px', mobile: '14px', mobileSmall: '13px' },
    fontWeight: '600'
  },
  container: {
    maxWidth: '1400px',
    leftOffset: { desktop: '60px', tablet: '30px', mobile: '15px', mobileSmall: '10px' },
    width: { desktop: '50%', tablet: '70%', mobile: '90%', mobileSmall: '95%' }
  }
})

// Slider settings
const sliderArrows = reactive({
  enabled: true,
  size: { desktop: '40px', tablet: '35px', mobile: '30px', mobileSmall: '25px' },
  backgroundColor: { desktop: 'rgba(255, 255, 255, 0.7)', mobile: 'rgba(255, 255, 255, 0.8)' },
  hoverBackgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#031358',
  position: { desktop: '20px', tablet: '15px', mobile: '10px' },
  fontSize: { desktop: '20px', tablet: '18px', mobile: '16px', mobileSmall: '14px' }
})

const sliderDots = reactive({
  enabled: true,
  size: { desktop: '12px', mobile: '10px' },
  color: 'rgba(255, 255, 255, 0.5)',
  activeColor: '#4a6cf7',
  position: { desktop: '20px', mobile: '15px' }
})

const sliderSettings = reactive({
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  transitionSpeed: 500
})

// UI State
const isLoading = ref(false)
const expandSearch = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const uploadedImagePreview = ref(null)
const showPreviewModal = ref(false)
const showQuickPreview = ref(true)

// File management
const files = ref([]) // Store file DTOs
const fileInput = ref(null)
const uploadedFiles = ref([]) // Store multiple uploaded files

// Collapsible sections
const isSectionOpen = reactive({
  basic: true,
  position: true,
  searchConfig: true,
  particles: true,
  arrows: true,
  dots: true,
  autoplay: true
})

const isSubSectionOpen = reactive({
  tabs: true,
  propertyType: true,
  searchInput: true,
  searchButton: true
})

// Toast notification
const toast = reactive({
  show: false,
  message: '',
  type: 'info', // success, error, warning, info
  icon: 'fas fa-info-circle'
})

// ========== CONSTANTS ==========
const responsiveDevices = [
  { key: 'desktop', label: 'Máy tính', icon: 'fas fa-desktop', placeholder: '58px', fontPlaceholder: '17px' },
  { key: 'tablet', label: 'Máy tính bảng', icon: 'fas fa-tablet-alt', placeholder: '48px', fontPlaceholder: '15px' },
  { key: 'mobile', label: 'Điện thoại', icon: 'fas fa-mobile-alt', placeholder: '40px', fontPlaceholder: '14px' },
  { key: 'mobileSmall', label: 'Điện thoại nhỏ', icon: 'fas fa-mobile', placeholder: '35px', fontPlaceholder: '13px' }
]

const particleDevices = [
  { key: 'desktop', label: 'Máy tính', icon: 'fas fa-desktop', min: 10, max: 200 },
  { key: 'tablet', label: 'Máy tính bảng', icon: 'fas fa-tablet-alt', min: 5, max: 150 },
  { key: 'mobile', label: 'Điện thoại', icon: 'fas fa-mobile-alt', min: 0, max: 100 }
]
import {baseImgaeUrl} from "../../../../assets/js/global.js";
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'

// ========== HELPER FUNCTIONS ==========
const getImageUrl = (filename) => {
  if (!filename) return ''

  // Check if it's a temp file
  if (filename.startsWith(TEMP_PREFIX)) {
    // For temp files, use the preview URL from uploadedFiles
    const tempName = filename.replace(TEMP_PREFIX, '')
    const uploadedFile = uploadedFiles.value.find(f => f.tempName === tempName)
    if (uploadedFile && uploadedFile.previewUrl) {
      return uploadedFile.previewUrl
    }
    return '' // Temp file not uploaded yet
  }

  // Real file from server
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

// Generate unique temp name
// Generate unique temp name
const generateTempName = (originalFilename) => {
  if (!originalFilename) return `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.jpg`;

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalFilename.split('.').pop() || 'jpg';
  return `temp_${timestamp}_${random}.${extension}`;
}

// ========== API INTEGRATION ==========
// Load data from API
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/cms/getSection/1')

    if (response.data && response.data.contentJson) {
      const content = JSON.parse(response.data.contentJson)

      // Initialize banners with proper structure
      banners.value = content.banners.map(banner => ({
        id: banner.id || Date.now() + Math.random(),
        imageUrl: banner.imageUrl || '',
        altText: banner.altText || '',
        searchWrapperPosition: banner.searchWrapperPosition || {
          desktop: '55%',
          tablet: '40%',
          mobile: '120px',
          mobileSmall: '100px'
        },
        particleSettings: {
          enabled: banner.particleSettings?.enabled ?? true,
          particleCount: banner.particleSettings?.particleCount || { desktop: 80, tablet: 60, mobile: 40 },
          maxParticleSize: banner.particleSettings?.maxParticleSize || { desktop: '8px', tablet: '6px', mobile: '4px' },
          particleColor: banner.particleSettings?.particleColor || '#031358',
          lineColor: banner.particleSettings?.lineColor || '#031358',
          lineWidth: banner.particleSettings?.lineWidth || { desktop: 1, tablet: 0.8, mobile: 0.6 },
          moveSpeed: banner.particleSettings?.moveSpeed || { desktop: 1.5, tablet: 1.2, mobile: 1 }
        }
      }))

      // Initialize search form
      if (content.searchForm) {
        Object.assign(searchForm, content.searchForm)
      }

      // Initialize slider settings
      if (content.sliderArrows) Object.assign(sliderArrows, content.sliderArrows)
      if (content.sliderDots) Object.assign(sliderDots, content.sliderDots)
      if (content.sliderSettings) Object.assign(sliderSettings, content.sliderSettings)

      // Xử lý files từ API response
      if (response.data.files && response.data.files.length > 0) {
        files.value = response.data.files.map(file => ({
          id: file.id,
          filename: file.filename || file.realFilenameForSearch || '',
          status: 'EXISTING', // Luôn là EXISTING cho files từ server
          tempName: file.tempName || generateTempName(file.filename),
          mappingTempUrl: file.mappingTempUrl || `temp/${file.tempName || generateTempName(file.filename)}`,
          mappingRealUrl: file.mappingRealUrl || file.filename,
          effectiveTempUrl: file.effectiveTempUrl || BASE_IMAGE_URL + (file.mappingRealUrl || file.filename),
          realFilenameForSearch: file.realFilenameForSearch || file.filename
        }));

        // Cập nhật banner image URLs từ files EXISTING
        banners.value.forEach(banner => {
          if (banner.imageUrl) {
            // Tìm file tương ứng với imageUrl của banner
            const existingFile = files.value.find(file =>
                file.mappingRealUrl === banner.imageUrl ||
                file.filename === banner.imageUrl ||
                file.tempName === banner.imageUrl.replace(TEMP_PREFIX, '')
            );

          }
        });
      } else {
        // Nếu không có files trong response, tạo từ banners
        files.value = [];

        banners.value.forEach(banner => {
          if (banner.imageUrl && !banner.imageUrl.startsWith(TEMP_PREFIX)) {
            // Đây là file EXISTING từ server
            const filename = banner.imageUrl;
            const tempName = generateTempName(filename);

            files.value.push({
              id: null, // Sẽ được cập nhật khi save
              filename: filename,
              status: 'EXISTING',
              tempName: tempName,
              mappingTempUrl: TEMP_PREFIX + tempName,
              mappingRealUrl: filename,
              effectiveTempUrl: BASE_IMAGE_URL + filename,
              realFilenameForSearch: filename
            });
          }
        });
      }

      console.log('Loaded EXISTING files:', files.value);

      // Initialize uploadedFiles array
      uploadedFiles.value = []

      showToast('Dữ liệu đã được tải thành công', 'success')

      // Debug log
      console.log('Loaded files:', files.value)
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showToast('Không thể tải dữ liệu từ server', 'error')

    // Fallback to default data
    banners.value = [createNewBanner()]
  } finally {
    isLoading.value = false
  }
}

// Save changes to API
const saveChanges = async () => {
  try {
    isLoading.value = true

    // DEBUG: Check data before saving
    debugCheckBeforeSave()

    // Prepare the content data object
    const contentData = {
      banners: banners.value.map(banner => {
        // Convert temp URLs back to temp names in contentJson
        let imageUrl = banner.imageUrl
        if (imageUrl.startsWith(TEMP_PREFIX)) {
          // Keep as temp URL in contentJson
          imageUrl = imageUrl
        }

        return {
          id: banner.id,
          imageUrl: imageUrl,
          altText: banner.altText,
          searchWrapperPosition: banner.searchWrapperPosition,
          particleSettings: banner.particleSettings
        }
      }),
      searchForm: searchForm,
      sliderArrows: sliderArrows,
      sliderDots: sliderDots,
      sliderSettings: sliderSettings
    }

    // Prepare FormData for file upload
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data with files array
    const sectionData = {
      id: 1,
      name: 'Banner',
      contentJson: JSON.stringify(contentData, null, 2),
      sortOrder: 0,
      files: filesToSend
    }

    console.log('Section data to send:', sectionData)
    console.log('Files to send:', filesToSend)

    // Add section data as JSON
    formData.append('section', new Blob([JSON.stringify(sectionData)], {
      type: 'application/json'
    }))

    // Add actual file binaries for NEW files
    const newFiles = filesToSend.filter(file => file.status === 'NEW')
    console.log('New files to upload:', newFiles.length)

    newFiles.forEach((fileDTO, index) => {
      // Find the corresponding uploaded file
      const tempName = fileDTO.mappingTempUrl?.replace(TEMP_PREFIX, '') || fileDTO.tempName
      const uploadedFile = uploadedFiles.value.find(f => f.tempName === tempName)

      if (uploadedFile && uploadedFile.file) {
        formData.append('files', uploadedFile.file)
        console.log(`Adding file ${index + 1}:`, uploadedFile.file.name)
      } else {
        console.warn(`File not found for upload: ${tempName}`)
      }
    })

    console.log("Lưu:", sectionData)
    // Send to API
    const response = await api.post('/cms/saveChange', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data) {
      showToast('Thay đổi đã được lưu thành công', 'success')

      // Update file statuses after successful save
      files.value.forEach(file => {
        if (file.status === 'NEW') {
          file.status = 'EXISTING'
          // Update from response if available
          if (response.data.files) {
            const savedFile = response.data.files.find(f => f.filename === file.filename)
            if (savedFile) {
              file.id = savedFile.id
              file.mappingRealUrl = savedFile.mappingRealUrl
              // Update banner image URL from temp to real
              banners.value.forEach(banner => {
                if (banner.imageUrl === TEMP_PREFIX + file.tempName) {
                  banner.imageUrl = savedFile.filename
                }
              })
            }
          }
        } else if (file.status === 'REMOVE') {
          // Remove from local array
          const index = files.value.findIndex(f => f.id === file.id)
          if (index !== -1) {
            files.value.splice(index, 1)
          }
        }
      })

      // Clear uploaded files
      uploadedFiles.value = []
      uploadedImagePreview.value = null

      // Reload data to get updated file info
      await loadData()
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Lỗi khi lưu thay đổi: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    isLoading.value = false
  }
}

// ========== BANNER MANAGEMENT ==========
const createNewBanner = () => ({
  id: Date.now() + Math.random(),
  imageUrl: '',
  altText: '',
  searchWrapperPosition: {
    desktop: '55%',
    tablet: '40%',
    mobile: '120px',
    mobileSmall: '100px'
  },
  particleSettings: {
    enabled: true,
    particleCount: { desktop: 80, tablet: 60, mobile: 40 },
    maxParticleSize: { desktop: '8px', tablet: '6px', mobile: '4px' },
    particleColor: '#031358',
    lineColor: '#031358',
    lineWidth: { desktop: 1, tablet: 0.8, mobile: 0.6 },
    moveSpeed: { desktop: 1.5, tablet: 1.2, mobile: 1 }
  }
})

const addNewBanner = () => {
  const newBanner = createNewBanner()
  banners.value.push(newBanner)
  activeBannerIndex.value = banners.value.length - 1
  showToast('Đã thêm banner mới', 'success')
}

const selectBanner = (index) => {
  activeBannerIndex.value = index
  // Clear uploaded image preview when switching banners
  uploadedImagePreview.value = null
}

const moveBannerUp = (index) => {
  if (index > 0) {
    const temp = banners.value[index]
    banners.value[index] = banners.value[index - 1]
    banners.value[index - 1] = temp
    activeBannerIndex.value = index - 1
  }
}

const moveBannerDown = (index) => {
  if (index < banners.value.length - 1) {
    const temp = banners.value[index]
    banners.value[index] = banners.value[index + 1]
    banners.value[index + 1] = temp
    activeBannerIndex.value = index + 1
  }
}

const removeBanner = (index) => {
  if (banners.value.length <= 1) {
    showToast('Không thể xóa banner cuối cùng', 'warning')
    return
  }

  const banner = banners.value[index]

  // Mark associated file as REMOVE if it exists
  if (banner.imageUrl) {
    // Check if it's a temp file
    if (banner.imageUrl.startsWith(TEMP_PREFIX)) {
      const tempName = banner.imageUrl.replace(TEMP_PREFIX, '')
      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)

        // Also remove from uploadedFiles
        const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
        if (uploadedIndex !== -1) {
          uploadedFiles.value.splice(uploadedIndex, 1)
        }
      }
    } else {
      // Real file from server
      const fileIndex = files.value.findIndex(f => f.filename === banner.imageUrl)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
        console.log('Marked file for removal:', files.value[fileIndex])
      }
    }
  }

  banners.value.splice(index, 1)

  if (activeBannerIndex.value >= banners.value.length) {
    activeBannerIndex.value = banners.value.length - 1
  }

  showToast('Đã xóa banner', 'success')
}

// ========== FILE UPLOAD MANAGEMENT ==========
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    showToast('Chỉ chấp nhận file ảnh JPG, PNG, GIF, WebP', 'error')
    return
  }

  if (file.size > maxSize) {
    showToast('Kích thước file không được vượt quá 5MB', 'error')
    return
  }

  if (!activeBanner.value) {
    showToast('Vui lòng chọn một banner trước', 'warning')
    return
  }

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    const previewUrl = e.target.result

    // Generate temp name and URL
    const tempName = generateTempName(file.name)
    const tempUrl = TEMP_PREFIX + tempName

    // If banner already has an image, handle the old file
    if (activeBanner.value.imageUrl) {
      const oldImageUrl = activeBanner.value.imageUrl

      if (oldImageUrl.startsWith(TEMP_PREFIX)) {
        // Old file is also temp - remove it
        const oldTempName = oldImageUrl.replace(TEMP_PREFIX, '')
        const fileIndex = files.value.findIndex(f => f.tempName === oldTempName)
        if (fileIndex !== -1) {
          files.value.splice(fileIndex, 1)
        }

        const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === oldTempName)
        if (uploadedIndex !== -1) {
          uploadedFiles.value.splice(uploadedIndex, 1)
        }
      } else {
        // Old file is from server - mark as REMOVE
        const fileIndex = files.value.findIndex(f => f.filename === oldImageUrl)
        if (fileIndex !== -1) {
          files.value[fileIndex].status = 'REMOVE'
        }
      }
    }

    // Update banner with temp URL
    activeBanner.value.imageUrl = tempUrl
    uploadedImagePreview.value = previewUrl

    // Create file DTO for NEW file
    const fileDTO = {
      id: null, // Will be set by server
      filename: file.name,
      status: 'NEW',
      tempName: tempName,
      mappingTempUrl: tempUrl, // Full temp URL
      mappingRealUrl: null, // Will be set by server after upload
      effectiveTempUrl: previewUrl, // Base64 preview for frontend
      realFilenameForSearch: file.name
    }

    // Store file binary and preview in uploadedFiles
    uploadedFiles.value.push({
      tempName: tempName,
      file: file,
      previewUrl: previewUrl
    })

    // Add to files array
    files.value.push(fileDTO)

    console.log('Added new temp file:', {
      tempName: tempName,
      tempUrl: tempUrl,
      fileDTO: fileDTO,
      uploadedFiles: uploadedFiles.value
    })

    showToast('Ảnh đã được tải lên thành công', 'success')
  }

  reader.onerror = (error) => {
    console.error('Error reading file:', error)
    showToast('Lỗi khi đọc file', 'error')
  }

  reader.readAsDataURL(file)

  // Reset file input
  event.target.value = ''
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    const fakeEvent = { target: { files: [file] } }
    handleFileUpload(fakeEvent)
  }
}

const removeUploadedImage = () => {
  if (activeBanner.value && activeBanner.value.imageUrl) {
    const imageUrl = activeBanner.value.imageUrl

    if (imageUrl.startsWith(TEMP_PREFIX)) {
      // Temp file - remove completely
      const tempName = imageUrl.replace(TEMP_PREFIX, '')

      // Remove from files array
      const fileIndex = files.value.findIndex(f => f.tempName === tempName)
      if (fileIndex !== -1) {
        files.value.splice(fileIndex, 1)
      }

      // Remove from uploadedFiles
      const uploadedIndex = uploadedFiles.value.findIndex(f => f.tempName === tempName)
      if (uploadedIndex !== -1) {
        uploadedFiles.value.splice(uploadedIndex, 1)
      }
    } else {
      // Real file from server - mark as REMOVE
      const fileIndex = files.value.findIndex(f => f.filename === imageUrl)
      if (fileIndex !== -1) {
        files.value[fileIndex].status = 'REMOVE'
      }
    }

    // Clear banner image
    activeBanner.value.imageUrl = ''
    uploadedImagePreview.value = null

    showToast('Đã xóa ảnh', 'success')
  }
}

// ========== UI FUNCTIONS ==========
const toggleSection = (section) => {
  isSectionOpen[section] = !isSectionOpen[section]
}

const toggleSubSection = (subsection) => {
  isSubSectionOpen[subsection] = !isSubSectionOpen[subsection]
}

const toggleAllSections = (open) => {
  Object.keys(isSectionOpen).forEach(key => {
    isSectionOpen[key] = open
  })
  Object.keys(isSubSectionOpen).forEach(key => {
    isSubSectionOpen[key] = open
  })
}

const togglePreviewPanel = () => {
  showQuickPreview.value = !showQuickPreview.value
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const copySettings = () => {
  const settings = JSON.stringify({
    activeBanner: activeBanner.value,
    searchForm: searchForm,
    sliderSettings: sliderSettings
  }, null, 2)

  navigator.clipboard.writeText(settings)
      .then(() => showToast('Đã sao chép cài đặt vào clipboard', 'success'))
      .catch(() => showToast('Không thể sao chép cài đặt', 'error'))
}

const previewImage = () => {
  if (activeBanner.value && activeBanner.value.imageUrl) {
    showPreviewModal.value = true
  } else {
    showToast('Không có ảnh để xem trước', 'warning')
  }
}

const closePreviewModal = () => {
  showPreviewModal.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const handleSearch = () => {
  // Implement search functionality if needed
  // This is currently commented out in the template
}

const isSearchMatch = (text) => {
  return searchQuery.value && text.toLowerCase().includes(searchQuery.value.toLowerCase())
}

// ========== PROPERTY TYPE MANAGEMENT ==========
const addPropertyTypeOption = () => {
  searchForm.propertyType.options.push({
    value: '',
    label: ''
  })
}

const removePropertyTypeOption = (index) => {
  if (searchForm.propertyType.options.length > 1) {
    searchForm.propertyType.options.splice(index, 1)
  } else {
    showToast('Phải có ít nhất một loại bất động sản', 'warning')
  }
}

// ========== DEBUG FUNCTIONS ==========
const debugCheckBeforeSave = () => {
  console.log('=== DEBUG CHECK BEFORE SAVE ===')

  // Check banners
  console.log('1. Banners count:', banners.value.length)
  banners.value.forEach((banner, index) => {
    const isTemp = banner.imageUrl?.startsWith(TEMP_PREFIX)
    console.log(`   Banner ${index + 1}:`, {
      id: banner.id,
      hasImage: !!banner.imageUrl,
      imageUrl: banner.imageUrl,
      isTemp: isTemp,
      altText: banner.altText
    })
  })

  // Check files
  console.log('2. Files status (total:', files.value.length, '):')
  files.value.forEach((file, index) => {
    console.log(`   File ${index + 1}:`, {
      id: file.id,
      filename: file.filename,
      tempName: file.tempName,
      mappingTempUrl: file.mappingTempUrl,
      status: file.status,
      isTemp: file.mappingTempUrl?.startsWith(TEMP_PREFIX)
    })
  })

  // Check file status breakdown
  const statusCount = {
    EXISTING: files.value.filter(f => f.status === 'EXISTING').length,
    NEW: files.value.filter(f => f.status === 'NEW').length,
    REMOVE: files.value.filter(f => f.status === 'REMOVE').length
  }
  console.log('3. File status breakdown:', statusCount)

  // Check which files will be sent (only changed ones)
  const filesToSend = files.value.filter(file => file.status !== 'EXISTING')
  console.log('4. Files to send to server:', filesToSend.length)
  filesToSend.forEach((file, index) => {
    console.log(`   File ${index + 1} to send:`, {
      id: file.id,
      filename: file.filename,
      mappingTempUrl: file.mappingTempUrl,
      status: file.status
    })
  })

  // Check uploaded files (binaries)
  console.log('5. Uploaded files (binaries):', uploadedFiles.value.length)
  uploadedFiles.value.forEach((file, index) => {
    console.log(`   Uploaded file ${index + 1}:`, {
      tempName: file.tempName,
      filename: file.file?.name,
      size: file.file?.size
    })
  })

  // Check temp files in banners
  const tempBanners = banners.value.filter(b => b.imageUrl?.startsWith(TEMP_PREFIX))
  console.log('6. Banners with temp files:', tempBanners.length)

  // Preview contentJson structure
  const contentData = {
    banners: banners.value.map(banner => ({
      id: banner.id,
      imageUrl: banner.imageUrl, // Will contain temp/temp_xxx.jpg for new files
      altText: banner.altText,
      searchWrapperPosition: banner.searchWrapperPosition,
      particleSettings: banner.particleSettings
    }))
  }
  console.log('7. Sample banner data in contentJson:', contentData.banners[0])

  showToast('Đã kiểm tra dữ liệu, xem console để biết chi tiết', 'info')
}

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()

  // Add debug function to window for testing
  window.debugBanner = debugCheckBeforeSave
  window.showFiles = () => {
    console.log('Current files:', files.value)
    console.log('Uploaded files:', uploadedFiles.value)
    console.log('Banners:', banners.value.map(b => ({ imageUrl: b.imageUrl, isTemp: b.imageUrl?.startsWith(TEMP_PREFIX) })))
  }
  window.clearTempFiles = () => {
    uploadedFiles.value = []
    console.log('Cleared temp files')
  }
})

// Watch for changes to debug
watch(() => banners.value, (newBanners) => {
  console.log('Banners updated:', newBanners.length)
}, { deep: true })

watch(() => files.value, (newFiles) => {
  console.log('Files array updated:', newFiles.length)
}, { deep: true })
</script>
<style scoped>
/* CSS đầy đủ với tất cả cải tiến UX */
.banner-editor {
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

.fixed-header {
  position: sticky;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  flex: 1;
  justify-content: flex-end;
}

/* Search Box */
.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
  min-width: 250px;
  transition: all 0.3s ease;
}

.search-box.expanded {
  max-width: 500px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.1rem;
}

.search-box input {
  width: 100%;
  padding: 12px 45px 12px 45px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-box input:focus {
  border-color: rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.15);
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.btn-clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-clear-search:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Quick Actions */
.quick-actions {
  background-color: white;
  padding: 10px 30px;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.quick-actions-inner {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.quick-actions-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.btn-quick {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: white;
  color: #495057;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-quick:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
  color: #031358;
}

/* Banners List */
.banners-list {
  display: flex;
  padding: 20px 30px;
  gap: 20px;
  overflow-x: auto;
  background: linear-gradient(to bottom, #f1f3f9, #e9ecef);
  min-height: 180px;
  scrollbar-width: thin;
  scrollbar-color: #4a6cf7 #e9ecef;
}

.banners-list::-webkit-scrollbar {
  height: 8px;
}

.banners-list::-webkit-scrollbar-track {
  background: #e9ecef;
  border-radius: 4px;
}

.banners-list::-webkit-scrollbar-thumb {
  background: #4a6cf7;
  border-radius: 4px;
}

.banner-item {
  flex: 0 0 auto;
  width: 200px;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid transparent;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.banner-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.banner-item.active {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.2), 0 8px 20px rgba(74, 108, 247, 0.3);
}

.banner-thumbnail {
  position: relative;
  height: 120px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f8f9fa;
}

.banner-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.banner-item:hover .banner-thumbnail img {
  transform: scale(1.05);
}

.banner-number {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  text-align: center;
  padding: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.banner-warning {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ffc107;
  color: #856404;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.banner-actions {
  display: flex;
  background-color: white;
  padding: 12px;
  justify-content: space-around;
  margin-top: auto;
  border-top: 1px solid #f1f3f4;
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
  color: #031358;
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Editor Content */
.editor-content {
  padding: 30px;
  background-color: white;
}

/* Search Notification */
.search-notification {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid #90caf9;
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 25px;
  animation: slideDown 0.3s ease;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-content i {
  color: #1976d2;
  font-size: 1.2rem;
}

.notification-content span {
  flex: 1;
  color: #0d47a1;
  font-size: 0.95rem;
}

.btn-notification-close {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-notification-close:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

/* Main Sections */
.main-section {
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.main-section:hover {
  border-color: #d0d7e7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-header {
  padding: 20px 25px;
  background: linear-gradient(to right, #f8f9ff, #ffffff);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  border-bottom: 1px solid transparent;
}

.section-header:hover {
  background: linear-gradient(to right, #f0f2ff, #ffffff);
}

.main-section.open .section-header {
  border-bottom-color: #e9ecef;
}

.header-left {
  flex: 1;
}

.header-left h3 {
  margin: 0 0 6px 0;
  color: #031358;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left h3 i {
  font-size: 1.2rem;
  color: #4a6cf7;
}

.section-description {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.section-badge {
  background: linear-gradient(135deg, #28a745 0%, #34ce57 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);
}

.section-count {
  background-color: #e9ecef;
  color: #495057;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-label {
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
}

input:checked + .toggle-label:before {
  transform: translateX(24px);
}

/* Collapse Icon */
.collapse-icon {
  width: 24px;
  height: 24px;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.collapse-icon:before {
  content: "▼";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: #495057;
  transition: all 0.3s ease;
}

.collapse-icon.open {
  transform: rotate(180deg);
}

.collapse-icon.open:before {
  color: #4a6cf7;
}

/* Section Content */
.section-content {
  padding: 25px;
  background-color: white;
  animation: fadeIn 0.3s ease;
}

/* Form Groups */
.form-group {
  margin-bottom: 20px;
}

.form-group.compact {
  margin-bottom: 15px;
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

.input-label-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.input-label-with-icon i {
  color: #6c757d;
  font-size: 0.9rem;
}

.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

/* Form Inputs */
.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background-color: white;
  color: #495057;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
  background-color: #f8f9ff;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

/* Input with Unit */
.input-with-unit {
  position: relative;
}

.input-with-unit input {
  padding-right: 70px;
  width: 100%;
}

.input-with-unit .unit {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.85rem;
  pointer-events: none;
  background-color: #f8f9fa;
  padding: 2px 8px;
  border-radius: 4px;
}

/* Responsive Inputs */
.responsive-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.responsive-inputs.compact {
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group.highlighted {
  background-color: #fff3cd;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ffc107;
  animation: pulse 2s infinite;
}

/* Form Row */
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

/* Radio Group */
.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.radio-option input[type="radio"] {
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
}

.radio-label {
  margin: 0;
  cursor: pointer;
  font-weight: normal;
  color: #495057;
}

/* Select */
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23495057' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  padding-right: 40px;
}

.form-select.compact {
  padding: 10px 14px;
  font-size: 0.9rem;
}

.form-select:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

/* File Upload */
.file-upload {
  margin-bottom: 20px;
}

.file-upload-area {
  border: 2px dashed #ced4da;
  border-radius: 12px;
  padding: 40px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  position: relative;
  overflow: hidden;
}

.file-upload-area:hover {
  border-color: #4a6cf7;
  background-color: #f8f9ff;
  transform: translateY(-2px);
}

.file-upload-area i {
  font-size: 3rem;
  color: #6c757d;
  margin-bottom: 15px;
  display: block;
  transition: all 0.3s ease;
}

.file-upload-area:hover i {
  color: #4a6cf7;
  transform: scale(1.1);
}

.file-upload-area p {
  margin: 8px 0;
  color: #495057;
  font-size: 1rem;
}

.file-upload-area span {
  color: #4a6cf7;
  font-weight: 600;
  text-decoration: underline;
}

.file-hint {
  font-size: 0.85rem;
  color: #6c757d !important;
  margin-top: 10px !important;
}

.upload-preview {
  margin-top: 20px;
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.upload-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.upload-preview:hover img {
  transform: scale(1.05);
}

.preview-actions {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-preview:hover .preview-actions {
  opacity: 1;
}

.btn-preview-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-preview-action:hover {
  background-color: white;
  transform: scale(1.1);
  color: #4a6cf7;
}

/* Color Input */
.color-input {
  display: flex;
  gap: 12px;
  align-items: center;
}

.color-input.compact {
  gap: 10px;
}

.color-input input[type="color"] {
  width: 60px;
  height: 50px;
  padding: 3px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.color-input.compact input[type="color"] {
  width: 50px;
  height: 40px;
}

.color-input input[type="color"]:hover {
  border-color: #4a6cf7;
  transform: scale(1.05);
}

.color-input input[type="text"] {
  flex: 1;
  min-width: 0;
}

/* Options List */
.options-list {
  margin-top: 10px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.options-list.compact {
  border-radius: 6px;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #e9ecef;
  gap: 12px;
  background-color: white;
  transition: background-color 0.2s ease;
}

.option-item.compact {
  padding: 8px 12px;
}

.option-item:hover {
  background-color: #f8f9fa;
}

.option-item:last-child {
  border-bottom: none;
}

.option-label {
  flex: 2;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
}

.option-value {
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
}

.btn-remove-option {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
}

.btn-sm {
  width: 100%;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #495057;
  transition: all 0.2s ease;
}

.btn-sm:hover {
  background-color: #e9ecef;
  color: #031358;
}

/* Sub Sections */
.sub-sections {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.editor-subsection {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.editor-subsection:hover {
  border-color: #d0d7e7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.subsection-header {
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
}

.subsection-header:hover {
  background-color: #f1f3f9;
}

.subsection-header h4 {
  margin: 0;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.subsection-collapse-icon {
  width: 20px;
  height: 20px;
  position: relative;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.subsection-collapse-icon:before {
  content: "▼";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  color: #6c757d;
}

.subsection-collapse-icon.open {
  transform: rotate(180deg);
}

.subsection-content {
  padding: 20px;
  background-color: white;
  animation: fadeIn 0.3s ease;
}

/* Responsive Settings */
.responsive-settings {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.responsive-settings h5 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-group {
  margin-bottom: 25px;
}

.setting-group h6 {
  margin: 0 0 12px 0;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Color Settings Grid */
.color-settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 10px;
}

.color-setting {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-setting label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0;
}

/* Particle Settings Grid */
.particle-settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.particle-color-settings {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Position Preview */
.position-preview {
  margin-top: 25px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.preview-title {
  font-weight: 600;
  color: #495057;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.preview-container {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #f5f7ff 0%, #e3e8ff 100%);
  border-radius: 8px;
  border: 1px solid #d0d7e7;
  overflow: hidden;
}

.preview-banner {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #031358 0%, #0629BE 100%);
  opacity: 0.7;
}

.preview-search-position {
  position: absolute;
  left: 20%;
  right: 20%;
  height: 4px;
  background-color: #4a6cf7;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(74, 108, 247, 0.5);
  transition: top 0.3s ease;
}

.preview-labels {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.preview-labels span:nth-child(2) {
  text-align: center;
  color: #4a6cf7;
  font-size: 1rem;
}

/* Quick Preview Panel */
.quick-preview-panel {
  margin-top: 30px;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.preview-header {
  padding: 15px 20px;
  background: linear-gradient(to right, #f0f2ff, #ffffff);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.preview-header:hover {
  background: linear-gradient(to right, #e3e8ff, #ffffff);
}

.preview-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-collapse-icon {
  width: 20px;
  height: 20px;
  position: relative;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.preview-collapse-icon:before {
  content: "▼";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  color: #495057;
}

.preview-collapse-icon.open {
  transform: rotate(180deg);
}

.preview-content {
  padding: 20px;
  background-color: white;
  animation: fadeIn 0.3s ease;
}

.preview-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.summary-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.summary-value {
  font-weight: 600;
  color: #031358;
}

.btn-preview {
  width: 100%;
  justify-content: center;
  background: linear-gradient(135deg, #6c757d 0%, #868e96 100%);
}

.btn-preview:hover {
  background: linear-gradient(135deg, #5a6268 0%, #727b84 100%);
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
  animation: fadeIn 0.3s ease;
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
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
  flex-shrink: 0;
}

.btn-toast-close:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

/* Search Highlight */
.search-highlight {
  background-color: #fff3cd !important;
  border-color: #ffc107 !important;
  animation: pulse 1s ease;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
}

/* Icons */
.icon-add:before { content: "➕"; }
.icon-save:before { content: "💾"; }
.icon-up:before { content: "⬆"; }
.icon-down:before { content: "⬇"; }
.icon-delete:before { content: "🗑"; }
.icon-close:before { content: "✕"; }
.icon-image:before { content: "🖼"; }
.icon-upload:before { content: "📤"; }
.icon-search:before { content: "🔍"; }
.icon-search-result:before { content: "📄"; }
.icon-info:before { content: "ℹ"; }
.icon-text:before { content: "📝"; }
.icon-position:before { content: "📍"; }
.icon-search-config:before { content: "⚙"; }
.icon-particles:before { content: "✨"; }
.icon-arrows:before { content: "↔"; }
.icon-dots:before { content: "🔘"; }
.icon-autoplay:before { content: "▶"; }
.icon-tabs:before { content: "📑"; }
.icon-dropdown:before { content: "▼"; }
.icon-responsive:before { content: "📱"; }
.icon-desktop:before { content: "🖥"; }
.icon-tablet:before { content: "📱"; }
.icon-mobile:before { content: "📱"; }
.icon-mobile-small:before { content: "📱"; }
.icon-count:before { content: "🔢"; }
.icon-eye:before { content: "👁"; }
.icon-warning:before { content: "⚠"; }
.icon-check:before { content: "✓"; }
.icon-error:before { content: "✗"; }
.icon-expand:before { content: "⤢"; }
.icon-collapse:before { content: "⤡"; }
.icon-copy:before { content: "📋"; }
.icon-preview:before { content: "👁"; }

/* Responsive Design */
@media (max-width: 1200px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .header-controls {
    flex-direction: column;
    gap: 15px;
  }

  .search-box {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .editor-header {
    padding: 15px 20px;
  }

  .editor-header h2 {
    font-size: 1.5rem;
    text-align: center;
  }

  .editor-content {
    padding: 20px;
  }

  .banners-list {
    padding: 15px 20px;
    gap: 15px;
  }

  .banner-item {
    width: 160px;
  }

  .banner-thumbnail {
    height: 100px;
  }

  .section-header {
    padding: 15px 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .section-content {
    padding: 20px;
  }

  .responsive-inputs {
    grid-template-columns: 1fr;
  }

  .particle-settings-grid {
    grid-template-columns: 1fr;
  }

  .particle-color-settings {
    grid-template-columns: 1fr;
  }

  .color-settings-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .radio-group {
    flex-direction: column;
    gap: 10px;
  }

  .quick-actions-inner {
    justify-content: center;
  }

  .modal-content {
    width: 95%;
    margin: 10px;
  }

  .toast-notification {
    left: 20px;
    right: 20px;
    bottom: 20px;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .banner-item {
    width: 140px;
  }

  .btn {
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .section-header h3 {
    font-size: 1.2rem;
  }

  .section-description {
    font-size: 0.85rem;
  }
}
</style>