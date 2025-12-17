<template>
  <div class="recruitment-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Form ứng tuyển</h2>
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
        <i class="fas fa-cog"></i> Nội dung chung
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'form' }"
          @click="activeTab = 'form'"
      >
        <i class="fas fa-list-alt"></i> Trường form
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'images' }"
          @click="activeTab = 'images'"
      >
        <i class="fas fa-images"></i> Hình ảnh
      </button>
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
      <!-- Tab Nội dung chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Thông tin văn bản -->
          <div class="setting-section">
            <h3><i class="fas fa-font"></i> Văn bản hiển thị</h3>

            <div class="form-group">
              <label for="section-title">Tiêu đề section</label>
              <input
                  type="text"
                  id="section-title"
                  v-model="content.textContent.sectionTitle"
                  placeholder="HÌNH ẢNH CÔNG TY"
              />
            </div>

            <div class="form-group">
              <label for="form-title">Tiêu đề form</label>
              <input
                  type="text"
                  id="form-title"
                  v-model="content.textContent.formTitle"
                  placeholder="ĐĂNG KÝ ỨNG TUYỂN"
              />
            </div>

            <div class="form-group">
              <label for="file-placeholder">Placeholder file</label>
              <input
                  type="text"
                  id="file-placeholder"
                  v-model="content.textContent.filePlaceholder"
                  placeholder="Chọn file"
              />
            </div>

            <div class="form-group">
              <label for="submit-btn-text">Text nút gửi</label>
              <input
                  type="text"
                  id="submit-btn-text"
                  v-model="content.textContent.submitBtnText"
                  placeholder="ỨNG TUYỂN"
              />
            </div>

            <div class="form-group">
              <label for="recruitment-message">Thông điệp tuyển dụng</label>
              <textarea
                  id="recruitment-message"
                  v-model="content.textContent.recruitmentMessage"
                  rows="3"
                  placeholder="Nơi đây không chỉ có Job, mà còn có cơ hội để bạn tỏa sáng..."
              ></textarea>
            </div>

            <div class="form-group">
              <label for="success-message">Thông báo thành công</label>
              <input
                  type="text"
                  id="success-message"
                  v-model="content.textContent.successMessage"
                  placeholder="Đã gửi đơn ứng tuyển thành công!"
              />
            </div>
          </div>

          <!-- Các loại file được chấp nhận -->
          <div class="setting-section">
            <h3><i class="fas fa-file-upload"></i> Cài đặt file</h3>

            <div class="form-group">
              <label for="accepted-file-types">Loại file được chấp nhận</label>
              <input
                  type="text"
                  id="accepted-file-types"
                  v-model="content.acceptedFileTypes"
                  placeholder=".pdf,.doc,.docx"
              />
              <small class="form-hint">Các loại file cách nhau bởi dấu phẩy</small>
            </div>

            <div class="form-group">
              <label for="validation-file-type">Thông báo lỗi loại file</label>
              <input
                  type="text"
                  id="validation-file-type"
                  v-model="content.validationMessages.fileType"
                  placeholder="Chỉ chấp nhận file PDF, DOC, DOCX"
              />
            </div>

            <div class="form-group">
              <label for="validation-file-size">Thông báo lỗi kích thước file</label>
              <input
                  type="text"
                  id="validation-file-size"
                  v-model="content.validationMessages.fileSize"
                  placeholder="File quá lớn. Kích thước tối đa là 5MB"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Trường form -->
      <div v-if="activeTab === 'form'" class="form-settings">
        <div class="form-header">
          <h3><i class="fas fa-list-alt"></i> Quản lý trường form</h3>
          <button class="btn btn-primary" @click="addField">
            <i class="fas fa-plus"></i> Thêm trường mới
          </button>
        </div>

        <div class="fields-list">
          <div
              v-for="(field, index) in content.formFields"
              :key="field.id || index"
              class="field-item"
              :class="{ 'editing': editingField === field.id }"
          >
            <div class="field-header" @click="toggleFieldEdit(field.id)">
              <div class="field-icon">
                <i :class="getFieldIcon(field.type)"></i>
              </div>
              <div class="field-info">
                <div class="field-title">{{ field.label }}</div>
                <div class="field-type">{{ getFieldTypeLabel(field.type) }}</div>
              </div>
              <div class="field-actions">
                <button class="btn-icon" @click.stop="moveFieldUp(index)" :disabled="index === 0" title="Di chuyển lên">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click.stop="moveFieldDown(index)"
                        :disabled="index === content.formFields.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-delete" @click.stop="removeField(index)" title="Xóa trường">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn-icon" @click.stop="toggleFieldEdit(field.id)"
                        :title="editingField === field.id ? 'Đóng chỉnh sửa' : 'Chỉnh sửa'">
                  <i :class="editingField === field.id ? 'fas fa-chevron-up' : 'fas fa-edit'"></i>
                </button>
              </div>
            </div>

            <!-- Field Edit Form -->
            <div v-if="editingField === field.id" class="field-edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="field-id">ID trường</label>
                  <input
                      type="text"
                      :id="'field-id-' + index"
                      v-model="field.id"
                      placeholder="fullName"
                  />
                </div>
                <div class="form-group">
                  <label for="field-type">Loại trường</label>
                  <select :id="'field-type-' + index" v-model="field.type" @change="onFieldTypeChange(field)">
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="tel">Số điện thoại</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Dropdown</option>
                    <option value="file">File upload</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="field-label">Nhãn trường</label>
                <input
                    type="text"
                    :id="'field-label-' + index"
                    v-model="field.label"
                    placeholder="Họ và tên"
                />
              </div>

              <div class="form-group">
                <label for="field-placeholder">Placeholder</label>
                <input
                    type="text"
                    :id="'field-placeholder-' + index"
                    v-model="field.placeholder"
                    :placeholder="getPlaceholderHint(field.type)"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="field.required"/>
                    <span>Bắt buộc</span>
                  </label>
                </div>
                <div class="form-group" v-if="field.type === 'textarea'">
                  <label for="field-rows">Số dòng</label>
                  <input
                      type="number"
                      :id="'field-rows-' + index"
                      v-model.number="field.rows"
                      min="1"
                      max="10"
                      placeholder="4"
                  />
                </div>
              </div>

              <!-- Options for select field -->
              <div v-if="field.type === 'select'" class="form-group">
                <label>Danh sách lựa chọn</label>
                <div class="options-list">
                  <div v-for="(option, optIndex) in field.options" :key="optIndex" class="option-item">
                    <input
                        type="text"
                        v-model="option.value"
                        :placeholder="'Giá trị ' + (optIndex + 1)"
                        class="option-value"
                    />
                    <input
                        type="text"
                        v-model="option.label"
                        :placeholder="'Nhãn hiển thị ' + (optIndex + 1)"
                        class="option-label"
                    />
                    <button class="btn-icon btn-delete" @click="removeOption(field, optIndex)" title="Xóa">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <button class="btn btn-secondary btn-sm" @click="addOption(field)">
                    <i class="fas fa-plus"></i> Thêm lựa chọn
                  </button>
                </div>
              </div>

              <!-- File settings -->
              <div v-if="field.type === 'file'" class="form-group">
                <label for="field-accept">File types (accept)</label>
                <input
                    type="text"
                    :id="'field-accept-' + index"
                    v-model="field.accept"
                    placeholder=".pdf,.doc,.docx"
                />
              </div>

              <!-- Validation settings -->
              <div class="form-group">
                <label>Validation rules</label>
                <div class="validation-settings">
                  <div class="form-row" v-if="field.type === 'text' || field.type === 'textarea'">
                    <div class="form-group">
                      <label for="min-length">Min length</label>
                      <input
                          type="number"
                          :id="'min-length-' + index"
                          v-model.number="field.validation.minLength"
                          min="0"
                          placeholder="2"
                      />
                    </div>
                    <div class="form-group">
                      <label for="max-length">Max length</label>
                      <input
                          type="number"
                          :id="'max-length-' + index"
                          v-model.number="field.validation.maxLength"
                          min="1"
                          placeholder="100"
                      />
                    </div>
                  </div>
                  <div v-if="field.type === 'email' || field.type === 'tel'" class="form-group">
                    <label for="validation-pattern">Pattern regex</label>
                    <input
                        type="text"
                        :id="'validation-pattern-' + index"
                        v-model="field.validation.pattern"
                        :placeholder="field.type === 'email' ? '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' : '^[0-9]{10,11}$'"
                    />
                  </div>
                  <div v-if="field.type === 'email' || field.type === 'tel'" class="form-group">
                    <label for="validation-message">Thông báo lỗi</label>
                    <input
                        type="text"
                        :id="'validation-message-' + index"
                        v-model="field.validation.message"
                        :placeholder="field.type === 'email' ? 'Email không hợp lệ' : 'Số điện thoại không hợp lệ'"
                    />
                  </div>
                  <div v-if="field.type === 'file'" class="form-group">
                    <label for="max-size">Max size (bytes)</label>
                    <input
                        type="number"
                        :id="'max-size-' + index"
                        v-model.number="field.validation.maxSize"
                        placeholder="5242880"
                    />
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button class="btn btn-secondary" @click="toggleFieldEdit(field.id)">
                  <i class="fas fa-times"></i> Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Hình ảnh -->
      <div v-if="activeTab === 'images'" class="images-settings">
        <div class="settings-grid">
          <!-- Illustration -->
          <div class="setting-section">
            <h3><i class="fas fa-image"></i> Hình minh họa</h3>

            <div class="file-upload">
              <div class="file-upload-area" @click="triggerIllustrationInput" @dragover.prevent
                   @drop.prevent="handleIllustrationDrop">
                <input
                    type="file"
                    ref="illustrationInput"
                    @change="handleIllustrationUpload"
                    accept="image/*"
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả ảnh minh họa vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Kích thước đề xuất: 400x400px</p>
              </div>

              <div v-if="illustrationPreview || content.images.recruitmentIllustration" class="upload-preview">
                <img :src="getImageUrl(content.images.recruitmentIllustration)" alt="Illustration Preview"/>
                <div class="preview-actions">
                  <button class="btn-preview-action" @click="previewImage(content.images.recruitmentIllustration)"
                          title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeIllustration" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group" v-if="!illustrationPreview && !content.images.recruitmentIllustration">
              <label for="illustration-url">Hoặc nhập URL ảnh</label>
              <input
                  type="text"
                  id="illustration-url"
                  v-model="content.images.recruitmentIllustration"
                  placeholder="/imgs/helping-a-partner-animate.svg"
              />
            </div>
          </div>

          <!-- Gallery Images -->
          <div class="setting-section">
            <h3><i class="fas fa-images"></i> Thư viện hình ảnh công ty</h3>
            <p class="section-description">Danh sách hình ảnh hiển thị trong gallery</p>

            <div class="gallery-upload">
              <div class="file-upload-area" @click="triggerGalleryInput" @dragover.prevent
                   @drop.prevent="handleGalleryDrop">
                <input
                    type="file"
                    ref="galleryInput"
                    @change="handleGalleryUpload"
                    accept="image/*"
                    multiple
                    style="display: none"
                />
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Kéo thả nhiều ảnh vào đây hoặc <span>chọn từ máy</span></p>
                <p class="file-hint">Hỗ trợ upload nhiều ảnh cùng lúc</p>
              </div>
            </div>

            <div class="gallery-preview">
              <div v-for="(image, index) in content.images.gallery" :key="index" class="gallery-item">
                <img :src="getImageUrl(image)" alt="Gallery Image"/>
                <div class="gallery-item-actions">
                  <button class="btn-preview-action" @click="previewImage(image)" title="Xem trước">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-preview-action" @click="removeGalleryImage(index)" title="Xóa ảnh">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                  <button class="btn-preview-action" @click="moveGalleryImage(index, -1)"
                          :disabled="index === 0" title="Di chuyển lên">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-preview-action" @click="moveGalleryImage(index, 1)"
                          :disabled="index === content.images.gallery.length - 1" title="Di chuyển xuống">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                </div>
                <div class="gallery-item-name">{{ getFilename(image) }}</div>
              </div>
            </div>

            <div class="form-group" v-if="content.images.gallery.length === 0">
              <label for="gallery-urls">Hoặc nhập URLs (mỗi URL một dòng)</label>
              <textarea
                  id="gallery-urls"
                  v-model="galleryUrlsText"
                  @input="updateGalleryFromUrls"
                  rows="4"
                  placeholder="/imgs/hd1.jpg&#10;/imgs/hd2.jpg"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Giao diện & Màu sắc -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="style-tabs">
          <button
              class="style-tab-btn"
              :class="{ active: styleSubTab === 'colors' }"
              @click="styleSubTab = 'colors'"
          >
            <i class="fas fa-palette"></i> Màu sắc
          </button>
          <button
              class="style-tab-btn"
              :class="{ active: styleSubTab === 'gradients' }"
              @click="styleSubTab = 'gradients'"
          >
            <i class="fas fa-gradient"></i> Gradient
          </button>
          <button
              class="style-tab-btn"
              :class="{ active: styleSubTab === 'sizes' }"
              @click="styleSubTab = 'sizes'"
          >
            <i class="fas fa-ruler"></i> Kích thước
          </button>
          <button
              class="style-tab-btn"
              :class="{ active: styleSubTab === 'effects' }"
              @click="styleSubTab = 'effects'"
          >
            <i class="fas fa-magic"></i> Hiệu ứng
          </button>
        </div>

        <!-- Tab Màu sắc -->
        <div v-if="styleSubTab === 'colors'" class="style-tab-content">
          <div class="settings-grid style-grid-2x2">
            <!-- Nhóm màu chính -->
            <div class="setting-section">
              <h4><i class="fas fa-star"></i> Màu chính</h4>
              <div class="compact-color-grid">
                <div class="compact-color-item" v-for="colorKey in ['primary', 'primaryDark', 'secondary']" :key="colorKey">
                  <label>{{ getColorLabel(colorKey) }}</label>
                  <div class="compact-color-input color-input">
                    <input
                        type="color"
                        :value="content.colors[colorKey]"
                        @input="content.colors[colorKey] = $event.target.value"
                        :title="content.colors[colorKey]"
                    />
                    <input
                        type="text"
                        v-model="content.colors[colorKey]"
                        :placeholder="getColorPlaceholder(colorKey)"
                        class="color-hex"
                        @focus="$event.target.select()"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Nhóm màu văn bản -->
            <div class="setting-section">
              <h4><i class="fas fa-font"></i> Màu văn bản</h4>
              <div class="compact-color-grid">
                <div class="compact-color-item" v-for="colorKey in ['textDark', 'darkGray', 'gray']" :key="colorKey">
                  <label>{{ getColorLabel(colorKey) }}</label>
                  <div class="compact-color-input">
                    <input type="color" :value="content.colors[colorKey]"
                           @input="content.colors[colorKey] = $event.target.value"/>
                    <input type="text" v-model="content.colors[colorKey]"
                           :placeholder="getColorPlaceholder(colorKey)" class="color-hex"/>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nhóm màu nền & đường viền -->
            <div class="setting-section">
              <h4><i class="fas fa-layer-group"></i> Nền & Viền</h4>
              <div class="compact-color-grid">
                <div class="compact-color-item" v-for="colorKey in ['white', 'lightGray']" :key="colorKey">
                  <label>{{ getColorLabel(colorKey) }}</label>
                  <div class="compact-color-input">
                    <input type="color" :value="content.colors[colorKey]"
                           @input="content.colors[colorKey] = $event.target.value"/>
                    <input type="text" v-model="content.colors[colorKey]"
                           :placeholder="getColorPlaceholder(colorKey)" class="color-hex"/>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nhóm màu trạng thái -->
            <div class="setting-section">
              <h4><i class="fas fa-exclamation-circle"></i> Trạng thái</h4>
              <div class="compact-color-grid">
                <div class="compact-color-item" v-for="colorKey in ['error', 'success']" :key="colorKey">
                  <label>{{ getColorLabel(colorKey) }}</label>
                  <div class="compact-color-input">
                    <input type="color" :value="content.colors[colorKey]"
                           @input="content.colors[colorKey] = $event.target.value"/>
                    <input type="text" v-model="content.colors[colorKey]"
                           :placeholder="getColorPlaceholder(colorKey)" class="color-hex"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Gradient -->
        <div v-if="styleSubTab === 'gradients'" class="style-tab-content">
          <div class="settings-grid style-grid-2x2">
            <div class="setting-section" v-for="(gradient, key) in gradientTypes" :key="key">
              <div class="gradient-header">
                <h4>{{ gradient.label }}</h4>
                <div class="gradient-preview"
                     :style="{ background: content.gradients[key] }"></div>
              </div>

              <div class="gradient-controls">
                <div class="color-picker-group">
                  <div class="color-picker">
                    <label>Màu 1</label>
                    <input type="color" v-model="gradientColors[key].color1"
                           @change="updateGradient(key)"/>
                  </div>
                  <div class="color-picker">
                    <label>Màu 2</label>
                    <input type="color" v-model="gradientColors[key].color2"
                           @change="updateGradient(key)"/>
                  </div>
                </div>

                <div class="form-group">
                  <label>Mã gradient</label>
                  <input type="text" v-model="content.gradients[key]"
                         @input="updateGradientFromText(key)"
                         :placeholder="gradient.placeholder"/>
                </div>

                <div class="form-group" v-if="key !== 'container'">
                  <label>Hướng gradient</label>
                  <select v-model="gradientDirections[key]" @change="updateGradientDirection(key)">
                    <option value="to right">Sang phải</option>
                    <option value="to left">Sang trái</option>
                    <option value="to bottom">Xuống dưới</option>
                    <option value="to top">Lên trên</option>
                    <option value="to bottom right">Xuống góc phải</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Kích thước -->
        <div v-if="styleSubTab === 'sizes'" class="style-tab-content">
          <div class="settings-grid style-grid-2x2">
            <!-- Container -->
            <div class="setting-section">
              <h4><i class="fas fa-square"></i> Container</h4>
              <div class="size-grid">
                <div class="size-item" v-for="sizeKey in ['containerBorderRadius', 'containerPaddingTop', 'containerPaddingBottom']" :key="sizeKey">
                  <label>{{ getSizeLabel(sizeKey) }}</label>
                  <input type="text" v-model="content.sizes[sizeKey]"
                         :placeholder="getSizePlaceholder(sizeKey)"
                         class="size-input"/>
                </div>
              </div>
            </div>

            <!-- Văn bản -->
            <div class="setting-section">
              <h4><i class="fas fa-text-height"></i> Văn bản</h4>
              <div class="size-grid">
                <div class="size-item" v-for="sizeKey in ['titleFontSize', 'messageFontSize', 'inputFontSize', 'labelFontSize']" :key="sizeKey">
                  <label>{{ getSizeLabel(sizeKey) }}</label>
                  <input type="text" v-model="content.sizes[sizeKey]"
                         :placeholder="getSizePlaceholder(sizeKey)"
                         class="size-input"/>
                </div>
              </div>
            </div>

            <!-- Hình ảnh -->
            <div class="setting-section">
              <h4><i class="fas fa-image"></i> Hình ảnh</h4>
              <div class="size-grid">
                <div class="size-item" v-for="sizeKey in ['mainImageHeight', 'queueImageHeight']" :key="sizeKey">
                  <label>{{ getSizeLabel(sizeKey) }}</label>
                  <input type="text" v-model="content.sizes[sizeKey]"
                         :placeholder="getSizePlaceholder(sizeKey)"
                         class="size-input"/>
                </div>
              </div>
            </div>

            <!-- Nút bấm -->
            <div class="setting-section">
              <h4><i class="fas fa-hand-pointer"></i> Nút bấm</h4>
              <div class="size-grid">
                <div class="size-item" v-for="sizeKey in ['buttonFontSize', 'buttonPadding']" :key="sizeKey">
                  <label>{{ getSizeLabel(sizeKey) }}</label>
                  <input type="text" v-model="content.sizes[sizeKey]"
                         :placeholder="getSizePlaceholder(sizeKey)"
                         class="size-input"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Hiệu ứng -->
        <div v-if="styleSubTab === 'effects'" class="style-tab-content">
          <div class="settings-grid style-grid-2x2">
            <!-- Shadow -->
            <div class="setting-section">
              <h4><i class="fas fa-box-shadow"></i> Đổ bóng</h4>
              <div class="effect-grid">
                <div class="effect-item" v-for="effectKey in ['buttonHoverShadow', 'buttonActiveShadow']" :key="effectKey">
                  <label>{{ getEffectLabel(effectKey) }}</label>
                  <input type="text" v-model="content.effects[effectKey]"
                         :placeholder="getEffectPlaceholder(effectKey)"
                         class="effect-input"/>
                </div>
              </div>
            </div>

            <!-- Chuyển tiếp -->
            <div class="setting-section">
              <h4><i class="fas fa-exchange-alt"></i> Chuyển tiếp</h4>
              <div class="effect-grid">
                <div class="effect-item" v-for="effectKey in ['transitionDuration', 'transitionTiming']" :key="effectKey">
                  <label>{{ getEffectLabel(effectKey) }}</label>
                  <input type="text" v-model="content.effects[effectKey]"
                         :placeholder="getEffectPlaceholder(effectKey)"
                         class="effect-input"/>
                </div>
              </div>
            </div>

            <!-- Hiệu ứng đặc biệt -->
            <div class="setting-section">
              <h4><i class="fas fa-sparkles"></i> Hiệu ứng khác</h4>
              <div class="effect-grid">
                <div class="effect-item" v-for="effectKey in ['blur']" :key="effectKey">
                  <label>{{ getEffectLabel(effectKey) }}</label>
                  <input type="text" v-model="content.effects[effectKey]"
                         :placeholder="getEffectPlaceholder(effectKey)"
                         class="effect-input"/>
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
import {ref, reactive, onMounted, computed} from 'vue'
import api from '../../../../api/api.js'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)
const editingField = ref(null)

// Gradient colors state
const gradientColors = reactive({
  container: {
    color1: '#031358',
    color2: '#0030FF'
  },
  button: {
    color1: '#031358',
    color2: '#0030FF'
  },
  buttonHover: {
    color1: '#0030FF',
    color2: '#031358'
  }
})

// Content structure based on new JSON data
const content = reactive({
  textContent: {
    sectionTitle: 'HÌNH ẢNH CÔNG TY',
    formTitle: 'ĐĂNG KÝ ỨNG TUYỂN',
    filePlaceholder: 'Chọn file',
    submitBtnText: 'ỨNG TUYỂN',
    recruitmentMessage: 'Nơi đây không chỉ có Job, mà còn có cơ hội để bạn tỏa sáng. Bạn sẵn sàng tham gia cùng chúng tôi chưa?',
    successMessage: 'Đã gửi đơn ứng tuyển thành công!'
  },
  formFields: [
    {
      id: 'fullName',
      type: 'text',
      label: 'Họ và tên',
      placeholder: '',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      id: 'phone',
      type: 'tel',
      label: 'Số điện thoại',
      placeholder: '',
      required: true,
      validation: {
        pattern: '^[0-9]{10,11}$',
        message: 'Số điện thoại không hợp lệ'
      }
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      placeholder: '',
      required: true,
      validation: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        message: 'Email không hợp lệ'
      }
    },
    {
      id: 'cv',
      type: 'file',
      label: 'CV',
      placeholder: 'Chọn file CV',
      required: true,
      accept: '.pdf,.doc,.docx',
      validation: {
        maxSize: 5242880,
        allowedTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
      }
    },
    {
      id: 'position',
      type: 'select',
      label: 'Vị trí ứng tuyển',
      required: true,
      options: [
        {
          value: 'telesale',
          label: 'Nhân viên telesale'
        },
        {
          value: 'office',
          label: 'Nhân viên văn phòng'
        },
        {
          value: 'consultant',
          label: 'Chuyên viên tư vấn'
        },
        {
          value: 'pricing_specialist',
          label: 'Chuyên viên định giá BĐS'
        },
        {
          value: 'market_research',
          label: 'Nhân viên khảo sát thị trường'
        },
        {
          value: 'real_estate_broker',
          label: 'Môi giới bất động sản'
        },
        {
          value: 'collaborator',
          label: 'Cộng tác viên THG'
        }
      ]
    },
    {
      id: 'coverLetter',
      type: 'textarea',
      label: 'Thư ứng tuyển (Cover letter)',
      placeholder: 'Viết thư ứng tuyển của bạn tại đây...',
      rows: 4,
      required: true,
      validation: {
        minLength: 50,
        maxLength: 2000
      }
    }
  ],
  images: {
    logo: '/imgs/logoTHG.png',
    recruitmentIllustration: '/imgs/helping-a-partner-animate.svg',
    gallery: [
      'hd1.jpg',
      'hd2.jpg',
      'hd3.jpg',
      'hd4.jpg',
      'hd5.jpg',
      'hd6.jpg',
      'hd7.jpg',
      'hd8.jpg'
    ]
  },
  acceptedFileTypes: '.pdf,.doc,.docx',
  colors: {
    primary: '#0030FF',
    primaryDark: '#031358',
    secondary: '#4CAF50',
    white: '#FFFFFF',
    lightGray: '#DDDDDD',
    gray: '#999999',
    darkGray: '#666666',
    textDark: '#333333',
    error: '#FF4444',
    success: '#00C851'
  },
  gradients: {
    container: 'linear-gradient(to bottom, #031358, #0030FF)',
    button: 'linear-gradient(to right, #031358, #0030FF)',
    buttonHover: 'linear-gradient(to right, #0030FF, #031358)'
  },
  sizes: {
    containerBorderRadius: '50% 50% 0 0/100px 100px 0 0',
    containerPaddingTop: '150px',
    containerPaddingBottom: '60px',
    titleFontSize: '40px',
    mainImageHeight: '500px',
    queueImageHeight: '160px',
    buttonFontSize: '18px',
    buttonPadding: '18px 40px',
    messageFontSize: '20px',
    inputFontSize: '16px',
    labelFontSize: '16px'
  },
  effects: {
    blur: '20px',
    buttonHoverShadow: '0 8px 20px rgba(0, 48, 255, 0.4)',
    buttonActiveShadow: '0 3px 10px rgba(0, 48, 255, 0.3)',
    transitionDuration: '0.3s',
    transitionTiming: 'ease'
  },
  validationMessages: {
    required: 'Trường này là bắt buộc',
    email: 'Vui lòng nhập email hợp lệ',
    phone: 'Vui lòng nhập số điện thoại hợp lệ',
    fileSize: 'File quá lớn. Kích thước tối đa là 5MB',
    fileType: 'Chỉ chấp nhận file PDF, DOC, DOCX'
  }
})

// UI State
const logoPreview = ref(null)
const illustrationPreview = ref(null)
const galleryPreviews = ref([])
const showPreviewModal = ref(false)
const previewImageUrl = ref('')

// File inputs refs
const logoInput = ref(null)
const illustrationInput = ref(null)
const galleryInput = ref(null)

// Files management
const files = ref([])
const uploadedFiles = ref([])

// Gallery URLs text
const galleryUrlsText = computed({
  get() {
    return content.images.gallery.join('\n')
  },
  set(value) {
    // This is handled by updateGalleryFromUrls
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
const BASE_IMAGE_URL = baseImgaeUrl;
const TEMP_PREFIX = 'temp/'
const SECTION_ID = 42

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

const getFilename = (path) => {
  if (!path) return ''
  return path.split('/').pop() || path
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

    // Update content
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

const handleMultipleFilesUpload = (fileList, type, contentPath) => {
  const validFiles = Array.from(fileList).filter(file => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const maxSize = 5 * 1024 * 1024

    if (!validTypes.includes(file.type)) {
      showToast(`File ${file.name} không phải là ảnh hợp lệ`, 'error')
      return false
    }

    if (file.size > maxSize) {
      showToast(`File ${file.name} vượt quá 5MB`, 'error')
      return false
    }

    return true
  })

  if (validFiles.length === 0) {
    return
  }

  validFiles.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const previewUrl = e.target.result
      const tempName = generateTempName(file.name)
      const tempUrl = TEMP_PREFIX + tempName

      // Add to gallery
      content.images.gallery.push(tempUrl)

      // Create file DTO
      const fileDTO = {
        id: null,
        filename: `gallery_${file.name}`,
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
    }

    reader.readAsDataURL(file)
  })

  showToast(`Đã thêm ${validFiles.length} ảnh vào gallery`, 'success')
}

// ========== GRADIENT FUNCTIONS ==========
const parseGradientColors = (gradientStr) => {
  if (!gradientStr) return {color1: '#031358', color2: '#0030FF'};

  const matches = gradientStr.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g);
  if (matches && matches.length >= 2) {
    return {color1: matches[0], color2: matches[1]};
  }
  return {color1: '#031358', color2: '#0030FF'};
};

const updateContainerGradient = () => {
  content.gradients.container = `linear-gradient(to bottom, ${gradientColors.container.color1}, ${gradientColors.container.color2})`;
};

const updateContainerColorsFromGradient = () => {
  const colors = parseGradientColors(content.gradients.container);
  gradientColors.container.color1 = colors.color1;
  gradientColors.container.color2 = colors.color2;
};

const updateButtonGradient = () => {
  content.gradients.button = `linear-gradient(to right, ${gradientColors.button.color1}, ${gradientColors.button.color2})`;
};

const updateButtonColorsFromGradient = () => {
  const colors = parseGradientColors(content.gradients.button);
  gradientColors.button.color1 = colors.color1;
  gradientColors.button.color2 = colors.color2;
};

const updateButtonHoverGradient = () => {
  content.gradients.buttonHover = `linear-gradient(to right, ${gradientColors.buttonHover.color1}, ${gradientColors.buttonHover.color2})`;
};

const updateButtonHoverColorsFromGradient = () => {
  const colors = parseGradientColors(content.gradients.buttonHover);
  gradientColors.buttonHover.color1 = colors.color1;
  gradientColors.buttonHover.color2 = colors.color2;
};

// ========== FIELD MANAGEMENT ==========
const getFieldIcon = (type) => {
  switch (type) {
    case 'text':
      return 'fas fa-font'
    case 'email':
      return 'fas fa-envelope'
    case 'tel':
      return 'fas fa-phone'
    case 'textarea':
      return 'fas fa-align-left'
    case 'select':
      return 'fas fa-caret-down'
    case 'file':
      return 'fas fa-file-upload'
    default:
      return 'fas fa-question'
  }
}

const getFieldTypeLabel = (type) => {
  switch (type) {
    case 'text':
      return 'Văn bản'
    case 'email':
      return 'Email'
    case 'tel':
      return 'Số điện thoại'
    case 'textarea':
      return 'Văn bản dài'
    case 'select':
      return 'Lựa chọn'
    case 'file':
      return 'File upload'
    default:
      return type
  }
}

const getPlaceholderHint = (type) => {
  switch (type) {
    case 'text':
      return 'Nhập họ và tên'
    case 'email':
      return 'email@example.com'
    case 'tel':
      return '0987654321'
    case 'textarea':
      return 'Nhập nội dung...'
    case 'file':
      return 'Chọn file'
    default:
      return ''
  }
}

const getColorLabel = (key) => {
  const labels = {
    primary: 'Màu chính',
    primaryDark: 'Màu chính đậm',
    secondary: 'Màu phụ',
    white: 'Màu trắng',
    lightGray: 'Xám nhạt',
    gray: 'Xám',
    darkGray: 'Xám đậm',
    textDark: 'Màu chữ đậm',
    error: 'Màu lỗi',
    success: 'Màu thành công'
  }
  return labels[key] || key
}

const getColorPlaceholder = (key) => {
  const placeholders = {
    primary: '#0030FF',
    primaryDark: '#031358',
    secondary: '#4CAF50',
    white: '#FFFFFF',
    lightGray: '#DDDDDD',
    gray: '#999999',
    darkGray: '#666666',
    textDark: '#333333',
    error: '#FF4444',
    success: '#00C851'
  }
  return placeholders[key] || '#000000'
}

const getSizeLabel = (key) => {
  const labels = {
    containerBorderRadius: 'Bo góc container',
    containerPaddingTop: 'Padding top container',
    containerPaddingBottom: 'Padding bottom container',
    titleFontSize: 'Kích thước chữ tiêu đề',
    mainImageHeight: 'Chiều cao ảnh chính',
    queueImageHeight: 'Chiều cao ảnh gallery',
    buttonFontSize: 'Kích thước chữ nút',
    buttonPadding: 'Padding nút',
    messageFontSize: 'Kích thước chữ thông điệp',
    inputFontSize: 'Kích thước chữ input',
    labelFontSize: 'Kích thước chữ label'
  }
  return labels[key] || key
}

const getSizePlaceholder = (key) => {
  const placeholders = {
    containerBorderRadius: '50% 50% 0 0/100px 100px 0 0',
    containerPaddingTop: '150px',
    containerPaddingBottom: '60px',
    titleFontSize: '40px',
    mainImageHeight: '500px',
    queueImageHeight: '160px',
    buttonFontSize: '18px',
    buttonPadding: '18px 40px',
    messageFontSize: '20px',
    inputFontSize: '16px',
    labelFontSize: '16px'
  }
  return placeholders[key] || ''
}

const getEffectLabel = (key) => {
  const labels = {
    blur: 'Độ mờ',
    buttonHoverShadow: 'Đổ bóng nút (hover)',
    buttonActiveShadow: 'Đổ bóng nút (active)',
    transitionDuration: 'Thời gian chuyển tiếp',
    transitionTiming: 'Kiểu chuyển tiếp'
  }
  return labels[key] || key
}

const getEffectPlaceholder = (key) => {
  const placeholders = {
    blur: '20px',
    buttonHoverShadow: '0 8px 20px rgba(0, 48, 255, 0.4)',
    buttonActiveShadow: '0 3px 10px rgba(0, 48, 255, 0.3)',
    transitionDuration: '0.3s',
    transitionTiming: 'ease'
  }
  return placeholders[key] || ''
}

const addField = () => {
  const newId = `field_${Date.now()}`
  const fieldTypes = ['text', 'email', 'tel', 'textarea', 'select', 'file']
  const randomType = fieldTypes[Math.floor(Math.random() * fieldTypes.length)]

  const baseField = {
    id: newId,
    type: randomType,
    label: 'Trường mới',
    placeholder: '',
    required: true,
    validation: {}
  }

  // Add type-specific properties
  switch (randomType) {
    case 'textarea':
      baseField.rows = 4
      baseField.validation.minLength = 1
      baseField.validation.maxLength = 1000
      break
    case 'select':
      baseField.options = [
        {value: 'option1', label: 'Lựa chọn 1'},
        {value: 'option2', label: 'Lựa chọn 2'}
      ]
      break
    case 'file':
      baseField.accept = '.pdf,.doc,.docx'
      baseField.validation.maxSize = 5242880
      baseField.validation.allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      break
    case 'email':
      baseField.validation.pattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
      baseField.validation.message = 'Email không hợp lệ'
      break
    case 'tel':
      baseField.validation.pattern = '^[0-9]{10,11}$'
      baseField.validation.message = 'Số điện thoại không hợp lệ'
      break
    default:
      baseField.validation.minLength = 1
      baseField.validation.maxLength = 100
  }

  content.formFields.push(baseField)
  editingField.value = newId
  showToast('Đã thêm trường mới', 'success')
}

const removeField = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa trường này?')) {
    const field = content.formFields[index]
    content.formFields.splice(index, 1)

    if (editingField.value === field.id) {
      editingField.value = null
    }

    showToast('Đã xóa trường', 'success')
  }
}

const moveFieldUp = (index) => {
  if (index > 0) {
    const temp = content.formFields[index]
    content.formFields[index] = content.formFields[index - 1]
    content.formFields[index - 1] = temp
  }
}

const moveFieldDown = (index) => {
  if (index < content.formFields.length - 1) {
    const temp = content.formFields[index]
    content.formFields[index] = content.formFields[index + 1]
    content.formFields[index + 1] = temp
  }
}

const toggleFieldEdit = (fieldId) => {
  editingField.value = editingField.value === fieldId ? null : fieldId
}

const onFieldTypeChange = (field) => {
  // Reset validation when type changes
  field.validation = {}

  // Add default validation based on type
  switch (field.type) {
    case 'textarea':
      field.rows = 4
      field.validation.minLength = 1
      field.validation.maxLength = 1000
      break
    case 'select':
      if (!field.options) {
        field.options = [
          {value: 'option1', label: 'Lựa chọn 1'},
          {value: 'option2', label: 'Lựa chọn 2'}
        ]
      }
      break
    case 'file':
      field.accept = '.pdf,.doc,.docx'
      field.validation.maxSize = 5242880
      field.validation.allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      break
    case 'email':
      field.validation.pattern = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
      field.validation.message = 'Email không hợp lệ'
      break
    case 'tel':
      field.validation.pattern = '^[0-9]{10,11}$'
      field.validation.message = 'Số điện thoại không hợp lệ'
      break
    default:
      field.validation.minLength = 1
      field.validation.maxLength = 100
  }
}

const addOption = (field) => {
  if (!field.options) {
    field.options = []
  }
  const nextIndex = field.options.length + 1
  field.options.push({
    value: `option${nextIndex}`,
    label: `Lựa chọn ${nextIndex}`
  })
}

const removeOption = (field, index) => {
  if (field.options && field.options.length > 1) {
    field.options.splice(index, 1)
  } else {
    showToast('Phải có ít nhất 1 lựa chọn', 'warning')
  }
}

// ========== IMAGE MANAGEMENT ==========
const updateGalleryFromUrls = (event) => {
  const urls = event.target.value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)
  content.images.gallery = urls
}

const moveGalleryImage = (index, direction) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < content.images.gallery.length) {
    const temp = content.images.gallery[index]
    content.images.gallery[index] = content.images.gallery[newIndex]
    content.images.gallery[newIndex] = temp
  }
}

const removeGalleryImage = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi gallery?')) {
    const imageUrl = content.images.gallery[index]
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
    }
    content.images.gallery.splice(index, 1)
    showToast('Đã xóa ảnh khỏi gallery', 'success')
  }
}

// ========== IMAGE UPLOAD HANDLERS ==========
const triggerLogoInput = () => {
  logoInput.value?.click()
}

const handleLogoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Logo', logoPreview, 'images.logo')
  }
  event.target.value = ''
}

const handleLogoDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Logo', logoPreview, 'images.logo')
  }
}

const removeLogo = () => {
  if (content.images.logo) {
    handleRemoveFile(content.images.logo, 'images.logo', logoPreview)
  }
}

const triggerIllustrationInput = () => {
  illustrationInput.value?.click()
}

const handleIllustrationUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFileUpload(file, 'Illustration', illustrationPreview, 'images.recruitmentIllustration')
  }
  event.target.value = ''
}

const handleIllustrationDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    handleFileUpload(file, 'Illustration', illustrationPreview, 'images.recruitmentIllustration')
  }
}

const removeIllustration = () => {
  if (content.images.recruitmentIllustration) {
    handleRemoveFile(content.images.recruitmentIllustration, 'images.recruitmentIllustration', illustrationPreview)
  }
}

const triggerGalleryInput = () => {
  galleryInput.value?.click()
}

const handleGalleryUpload = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    handleMultipleFilesUpload(files, 'Gallery', 'images.gallery')
  }
  event.target.value = ''
}

const handleGalleryDrop = (event) => {
  event.preventDefault()
  const files = event.dataTransfer.files
  if (files && files.length > 0) {
    handleMultipleFilesUpload(files, 'Gallery', 'images.gallery')
  }
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

    // Update content
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

// ========== PREVIEW FUNCTIONS ==========
const previewImage = (imageUrl) => {
  if (imageUrl) {
    previewImageUrl.value = getImageUrl(imageUrl)
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
      Object.assign(content, data)

      // Initialize gradient colors
      const containerColors = parseGradientColors(content.gradients.container);
      gradientColors.container.color1 = containerColors.color1;
      gradientColors.container.color2 = containerColors.color2;

      const buttonColors = parseGradientColors(content.gradients.button);
      gradientColors.button.color1 = buttonColors.color1;
      gradientColors.button.color2 = buttonColors.color2;

      const buttonHoverColors = parseGradientColors(content.gradients.buttonHover);
      gradientColors.buttonHover.color1 = buttonHoverColors.color1;
      gradientColors.buttonHover.color2 = buttonHoverColors.color2;

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
    const contentData = {...content}

    // Prepare FormData
    const formData = new FormData()

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Form ứng tuyển',
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
      logoPreview.value = null
      illustrationPreview.value = null
      galleryPreviews.value = []

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
  if (content.images.logo === tempUrl) {
    content.images.logo = realUrl
  }
  if (content.images.recruitmentIllustration === tempUrl) {
    content.images.recruitmentIllustration = realUrl
  }

  // Check gallery images
  content.images.gallery = content.images.gallery.map(img =>
      img === tempUrl ? realUrl : img
  )
}

// ========== STYLE TAB MANAGEMENT ==========
const styleSubTab = ref('colors')

// Gradient types and directions
const gradientTypes = {
  container: {
    label: 'Container Gradient',
    placeholder: 'linear-gradient(to bottom, #031358, #0030FF)'
  },
  button: {
    label: 'Nút bấm',
    placeholder: 'linear-gradient(to right, #031358, #0030FF)'
  },
  buttonHover: {
    label: 'Nút bấm (hover)',
    placeholder: 'linear-gradient(to right, #0030FF, #031358)'
  }
}

const gradientDirections = reactive({
  container: 'to bottom',
  button: 'to right',
  buttonHover: 'to right'
})

// Gradient update functions
const updateGradient = (key) => {
  const direction = gradientDirections[key]
  content.gradients[key] = `linear-gradient(${direction}, ${gradientColors[key].color1}, ${gradientColors[key].color2})`
}

const updateGradientColors = (key, event, colorProp) => {
  gradientColors[key][colorProp] = event.target.value
  updateGradient(key)
}

const updateGradientFromText = (key) => {
  const colors = parseGradientColors(content.gradients[key])
  gradientColors[key].color1 = colors.color1
  gradientColors[key].color2 = colors.color2

  // Try to extract direction from gradient text
  const directionMatch = content.gradients[key].match(/linear-gradient\(([^,]+),/)
  if (directionMatch && directionMatch[1]) {
    gradientDirections[key] = directionMatch[1].trim()
  }
}

const updateGradientDirection = (key) => {
  updateGradient(key)
}

// Initialize gradient directions
onMounted(() => {
  Object.keys(content.gradients).forEach(key => {
    const directionMatch = content.gradients[key].match(/linear-gradient\(([^,]+),/)
    if (directionMatch && directionMatch[1]) {
      gradientDirections[key] = directionMatch[1].trim()
    }
  })
})

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.recruitment-editor {
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
  min-height: 500px;
}

/* Form Management */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.form-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.field-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.field-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.field-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.field-header:hover {
  background-color: #e9ecef;
}

.field-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.field-info {
  flex: 1;
}

.field-title {
  font-weight: 600;
  color: #495057;
  margin-bottom: 4px;
}

.field-type {
  font-size: 0.85rem;
  color: #6c757d;
}

.field-actions {
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

.field-edit-form {
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

/* Settings Grid - Layout chính */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
}

/* Grid 2x2 cho Style Tab */
.style-grid-2x2 {
  grid-template-columns: repeat(2, 1fr);
}

/* Đảm bảo mục lẻ chiếm full width */
.settings-grid.style-grid-2x2 > .setting-section:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}

.setting-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.setting-section.full-width {
  grid-column: 1 / -1;
}

.setting-section h3,
.setting-section h4 {
  margin: 0 0 20px 0;
  color: #031358;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-section h4 {
  font-size: 1rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f8f9fa;
}

.section-description {
  margin: -15px 0 20px 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 14px;
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
  gap: 15px;
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-top: 8px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

/* Options List */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.option-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.option-value,
.option-label {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.85rem;
  align-self: flex-start;
}

/* Validation Settings */
.validation-settings {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
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

/* Gallery Preview */
.gallery-upload {
  margin-bottom: 20px;
}

.gallery-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.gallery-item {
  position: relative;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.gallery-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.gallery-item-actions {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-item:hover .gallery-item-actions {
  opacity: 1;
}

.gallery-item-name {
  padding: 8px;
  font-size: 0.8rem;
  color: #6c757d;
  text-align: center;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

/* Style Tab Navigation */
.style-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 10px;
}

.style-tab-btn {
  flex: 1;
  min-width: 140px;
  padding: 12px 20px;
  border: 2px solid transparent;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.style-tab-btn:hover {
  border-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.style-tab-btn.active {
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  border-color: #4a6cf7;
  box-shadow: 0 4px 15px rgba(74, 108, 247, 0.3);
}

.style-tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Compact Color Grid */
.compact-color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.compact-color-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.compact-color-item label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.compact-color-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.compact-color-input input[type="color"] {
  width: 40px;
  height: 40px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.compact-color-input input[type="text"].color-hex {
  flex: 1;
  padding: 8px 12px;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  border-radius: 5px;
  width: 50%;
}

/* Gradient Settings */
.gradient-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.gradient-preview {
  width: 60px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid #e9ecef;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
}

.gradient-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.color-picker-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.color-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-picker label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
}

.color-picker input[type="color"] {
  width: 100%;
  height: 40px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
}

.color-picker input[type="text"] {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
}

/* Size Grid & Effect Grid */
.size-grid,
.effect-grid {
  display: grid;
  gap: 12px;
}

.size-item,
.effect-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.size-item label,
.effect-item label {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
}

.size-input,
.effect-input {
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .settings-grid:not(.style-grid-2x2) {
    grid-template-columns: 1fr;
  }

  .style-grid-2x2 {
    grid-template-columns: 1fr;
  }

  .settings-grid.style-grid-2x2 > .setting-section:last-child:nth-child(odd) {
    grid-column: 1;
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

  .form-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .field-header {
    flex-wrap: wrap;
  }

  .field-actions {
    margin-left: auto;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .gallery-preview {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .style-tab-btn {
    min-width: 120px;
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .compact-color-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .color-picker-group {
    grid-template-columns: 1fr;
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

  .compact-color-input {
    flex-wrap: wrap;
  }

  .compact-color-input input[type="color"] {
    width: 40px;
    height: 35px;
  }

  .field-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .field-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }

  .gallery-preview {
    grid-template-columns: repeat(2, 1fr);
  }

  .style-tabs {
    flex-direction: column;
  }

  .style-tab-btn {
    min-width: 100%;
  }
}
</style>
