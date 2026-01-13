<template>
  <div class="reasons-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Nội dung chính - Định giá BĐS với AI</h2>
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
          :class="{ active: activeTab === 'features' }"
          @click="activeTab = 'features'"
      >
        <i class="fas fa-cogs"></i> Công nghệ
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'howItWorks' }"
          @click="activeTab = 'howItWorks'"
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
      <button
          class="tab-button"
          :class="{ active: activeTab === 'contact' }"
          @click="activeTab = 'contact'"
      >
        <i class="fas fa-address-card"></i> Liên hệ
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
<!--          <div class="setting-section">-->
<!--            <h3><i class="fas fa-gradient"></i> Gradients</h3>-->

<!--            <div class="gradient-input-group" v-for="(gradient, gradientKey) in content.styles.gradients" :key="gradientKey">-->
<!--              <label>{{ gradientKey }}</label>-->
<!--              <div class="gradient-controls">-->
<!--                <div class="gradient-color-picker">-->
<!--                  <label>Màu bắt đầu</label>-->
<!--                  <ColorInputWithGlobalColors-->
<!--                      v-model="content.styles.gradients[gradientKey].from"-->
<!--                      placeholder="Chọn màu bắt đầu"-->
<!--                      return-type="key"-->
<!--                      :colors="globalColors"-->
<!--                  />-->
<!--                </div>-->
<!--                <div class="gradient-color-picker">-->
<!--                  <label>Màu kết thúc</label>-->
<!--                  <ColorInputWithGlobalColors-->
<!--                      v-model="content.styles.gradients[gradientKey].to"-->
<!--                      placeholder="Chọn màu kết thúc"-->
<!--                      return-type="key"-->
<!--                      :colors="globalColors"-->
<!--                  />-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </div>

      <!-- Tab Hero Section -->
      <div v-if="activeTab === 'hero'" class="hero-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-star"></i> Nội dung Hero</h3>

            <div class="form-group">
              <label for="heroTagline">Tagline</label>
              <div class="form-row">
                <input
                    type="text"
                    id="heroTagline"
                    v-model="content.hero.tagline"
                    placeholder="CÔNG NGHỆ AI TIÊN TIẾN"
                />
                <div class="form-group">
                  <label for="heroTaglineIcon">Icon Tagline</label>
                  <IconPicker v-model="content.hero.taglineIcon"/>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="heroTitle">Tiêu đề chính</label>
              <input
                  type="text"
                  id="heroTitle"
                  v-model="content.hero.title"
                  placeholder="Định giá BĐS chính xác"
              />
            </div>

            <div class="form-group">
              <label for="heroHighlightedText">Văn bản nổi bật</label>
              <input
                  type="text"
                  id="heroHighlightedText"
                  v-model="content.hero.highlightedText"
                  placeholder="với AI & Big Data"
              />
            </div>

            <div class="form-group">
              <label for="heroDescription">Mô tả dòng 1</label>
              <textarea
                  id="heroDescription"
                  v-model="content.hero.description"
                  rows="2"
                  placeholder="Công cụ định giá thông minh của Thiên Hà Group phân tích"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="heroDescriptionContinuation">Mô tả dòng 2</label>
              <textarea
                  id="heroDescriptionContinuation"
                  v-model="content.hero.descriptionContinuation"
                  rows="2"
                  placeholder="mỗi ngày để đưa ra mức giá tối ưu với độ chính xác lên đến"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Highlight Items</label>
              <div v-for="(highlight, index) in content.hero.highlights" :key="index" class="highlight-item relative ">

                <input type="text" v-model="highlight.text" :placeholder="'Text ' + (index + 1)"/>
                <input type="text" v-model="highlight.class" placeholder="text-slate-50 font-semibold"/>
                <button class="btn-icon btn-danger" @click="removeHighlight(index)">
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <button class="btn btn-secondary" @click="addHighlight">
                <i class="fas fa-plus"></i> Thêm highlight
              </button>
            </div>

            <!-- CTA Buttons -->
            <div class="form-group">
              <h4>Nút CTA</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Nút Định giá ngay</label>
                  <div class="form-row">
                    <input type="text" v-model="content.hero.ctaButtons.priceNow.text" placeholder="Định giá ngay"/>
                    <div class="input-with-icon">
                      <IconPicker v-model="content.hero.ctaButtons.priceNow.icon"/>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Nút Xem demo</label>
                  <div class="form-row">
                    <input type="text" v-model="content.hero.ctaButtons.watchDemo.text" placeholder="Xem demo"/>
                    <div class="input-with-icon">
                      <IconPicker v-model="content.hero.ctaButtons.watchDemo.icon"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="form-group">
              <h4>Thống kê</h4>
              <div v-for="(stat, index) in content.hero.stats" :key="index" class="stat-item">

                <div class="form-group">
                  <label>Giá trị</label>
                  <input type="text" v-model="stat.value" :placeholder="'Giá trị ' + (index + 1)"/>
                </div>
                <div class="form-group">
                  <label>Nhãn</label>
                  <input type="text" v-model="stat.label" :placeholder="'Nhãn ' + (index + 1)"/>
                </div>
                <button class="btn-icon btn-danger" @click="removeStat(index)">
                  <i class="fas fa-trash"></i>
                </button>

              </div>
              <button class="btn btn-secondary" @click="addStat">
                <i class="fas fa-plus"></i> Thêm thống kê
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Công nghệ -->
      <div v-if="activeTab === 'features'" class="features-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-cogs"></i> Công nghệ định giá</h3>
          </div>

          <div class="form-group">
            <label for="featuresTitle">Tiêu đề</label>
            <input type="text" id="featuresTitle" v-model="content.features.title" placeholder="Công nghệ"/>
          </div>

          <div class="form-group">
            <label for="featuresTitleHighlight">Tiêu đề nổi bật</label>
            <div class="form-row">
              <input type="text" v-model="content.features.titleHighlight.text" placeholder="định giá vượt trội"/>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="content.features.titleHighlight.hasGradient" />
                  Áp dụng gradient text
                </label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="featuresDescription">Mô tả</label>
            <textarea id="featuresDescription" v-model="content.features.description" rows="2"
                      placeholder="Kết hợp AI, Big Data và Machine Learning để đưa ra mức giá chính xác nhất"></textarea>
          </div>

          <div class="features-list">
            <div v-for="(feature, index) in content.features.items" :key="index" class="feature-item">
              <div class="feature-header">
                <h4>Công nghệ #{{ index + 1 }} - {{ feature.title || 'Chưa có tiêu đề' }}</h4>
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
                <input type="text" v-model="feature.title" placeholder="AI Phân Tích Nâng Cao"/>
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="feature.description" rows="3"
                          placeholder="Hệ thống AI phân tích 50+ yếu tố ảnh hưởng đến giá BĐS..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Biểu tượng</label>
                  <div class="input-with-icon">
                    <IconPicker v-model="feature.iconName"/>
                  </div>
                </div>
                <div class="form-group">
                  <label>Màu sắc</label>
                  <ColorInputWithGlobalColors
                      v-model="feature.color"
                      placeholder="purple"
                      return-type="key" :colors="globalColors"
                  />
                </div>
                <div class="form-group">
                  <label>AOS Delay (ms)</label>
                  <input type="text" v-model="feature.aosDelay" placeholder="0"/>
                </div>
              </div>

              <div class="form-group">
                <label>Nội dung danh sách</label>
                <div v-for="(item, itemIndex) in feature.listContent" :key="itemIndex" class="form-row">
                  <input type="text" v-model="feature.listContent[itemIndex]" :placeholder="'Item ' + (itemIndex + 1)"/>
                  <button class="btn-icon btn-danger" @click="removeFeatureListItem(index, itemIndex)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
                <button class="btn btn-secondary" @click="addFeatureListItem(index)">
                  <i class="fas fa-plus"></i> Thêm item vào danh sách
                </button>
              </div>

              <div class="form-group">
                <label>Class icon danh sách</label>
                <input type="text" v-model="feature.listDotIconClass"
                       placeholder="fas fa-check-circle text-purple-400"/>
              </div>
            </div>

            <div v-if="content.features.items.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Chưa có công nghệ nào. Hãy thêm công nghệ đầu tiên!</p>
            </div>
          </div>

          <button class="btn btn-secondary" @click="addFeature">
            <i class="fas fa-plus"></i> Thêm công nghệ
          </button>
        </div>
      </div>

      <!-- Tab Quy trình -->
      <div v-if="activeTab === 'howItWorks'" class="process-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-list-ol"></i> Quy trình định giá</h3>
          </div>

          <div class="form-group">
            <label for="howItWorksTitle">Tiêu đề</label>
            <input type="text" id="howItWorksTitle" v-model="content.howItWorks.title" placeholder="Quy trình"/>
          </div>

          <div class="form-group">
            <label for="howItWorksTitleHighlight">Tiêu đề nổi bật</label>
            <div class="form-row">
              <input type="text" v-model="content.howItWorks.titleHighlight.text" placeholder="định giá 4 bước"/>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="content.howItWorks.titleHighlight.hasGradient" />
                  Áp dụng gradient text
                </label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="howItWorksDescription">Mô tả</label>
            <textarea id="howItWorksDescription" v-model="content.howItWorks.description" rows="2"
                      placeholder="Đơn giản, nhanh chóng và chính xác chỉ trong 5 phút"></textarea>
          </div>

          <div class="form-group">
            <label>Nút CTA</label>
            <div class="form-row">
              <input type="text" v-model="content.howItWorks.ctaButton.text" placeholder="Bắt đầu định giá miễn phí"/>
              <div class="input-with-icon">
                <IconPicker v-model="content.howItWorks.ctaButton.icon"/>
              </div>
            </div>
          </div>

          <div class="steps-list">
            <div v-for="(step, index) in content.howItWorks.steps" :key="index" class="step-item">
              <div class="step-header">
                <h4>Bước #{{ index + 1 }} - {{ step.title || 'Chưa có tiêu đề' }}</h4>
                <div class="step-actions">
                  <button class="btn-icon" @click="moveStepUp(index)" :disabled="index === 0">
                    <i class="fas fa-arrow-up"></i>
                  </button>
                  <button class="btn-icon" @click="moveStepDown(index)"
                          :disabled="index === content.howItWorks.steps.length - 1">
                    <i class="fas fa-arrow-down"></i>
                  </button>
                  <button class="btn-icon btn-danger" @click="removeStep(index)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Số thứ tự</label>
                  <input type="number" v-model="step.number" min="1" placeholder="1"/>
                </div>
              </div>

              <div class="form-group">
                <label>Tiêu đề</label>
                <input type="text" v-model="step.title" placeholder="Nhập thông tin"/>
              </div>

              <div class="form-group">
                <label>Mô tả</label>
                <textarea v-model="step.description" rows="2"
                          placeholder="Điền thông tin BĐS: vị trí, diện tích, loại hình..."></textarea>
              </div>
            </div>

            <div v-if="content.howItWorks.steps.length === 0" class="empty-state">
              <i class="fas fa-inbox"></i>
              <p>Chưa có bước nào. Hãy thêm bước đầu tiên!</p>
            </div>
          </div>

          <button class="btn btn-secondary" @click="addStep">
            <i class="fas fa-plus"></i> Thêm bước
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
            <input type="text" id="testimonialsTitle" v-model="content.testimonials.title"
                   placeholder="Được tin dùng bởi"/>
          </div>

          <div class="form-group">
            <label for="testimonialsTitleHighlight">Tiêu đề nổi bật</label>
            <div class="form-row">
              <input type="text" v-model="content.testimonials.titleHighlight.text" placeholder="50,000+ khách hàng"/>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="content.testimonials.titleHighlight.hasGradient" />
                  Áp dụng gradient text
                </label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="testimonialsDescription">Mô tả</label>
            <textarea id="testimonialsDescription" v-model="content.testimonials.description" rows="2"
                      placeholder="Những đánh giá từ khách hàng đã sử dụng công cụ định giá của chúng tôi"></textarea>
          </div>

          <div class="testimonials-list">
            <div v-for="(testimonial, index) in content.testimonials.items" :key="testimonial.id"
                 class="testimonial-item">
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
                  <input type="text" v-model="testimonial.name" placeholder="Nguyễn Văn A"/>
                </div>
                <div class="form-group">
                  <label>Vị trí</label>
                  <input type="text" v-model="testimonial.position" placeholder="Chủ nhà phố Q.2"/>
                </div>
              </div>

              <div class="form-group">
                <label>Trích dẫn</label>
                <textarea v-model="testimonial.quote" rows="3"
                          placeholder="Công cụ định giá giúp tôi bán nhà nhanh hơn 30%..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Chữ viết tắt</label>
                  <input type="text" v-model="testimonial.initials" placeholder="NA"/>
                </div>
                <div class="form-group">
                  <label>Màu sắc</label>
                  <ColorInputWithGlobalColors
                      v-model="testimonial.color"
                      placeholder="purple"
                      return-type="key" :colors="globalColors"
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
                  <label>AOS Delay (ms)</label>
                  <input type="text" v-model="testimonial.aosDelay" placeholder="0"/>
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

      <!-- Tab Liên hệ -->
      <div v-if="activeTab === 'contact'" class="contact-settings">
        <div class="setting-section">
          <div class="section-header">
            <h3><i class="fas fa-address-card"></i> Thông tin liên hệ</h3>
          </div>

          <div class="form-group">
            <label for="contactTitle">Tiêu đề</label>
            <input type="text" id="contactTitle" v-model="content.contact.title" placeholder="Liên hệ với"/>
          </div>

          <div class="form-group">
            <label for="contactTitleHighlight">Tiêu đề nổi bật</label>
            <div class="form-row">
              <input type="text" v-model="content.contact.titleHighlight.text" placeholder="chuyên gia"/>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="content.contact.titleHighlight.hasGradient" />
                  Áp dụng gradient text
                </label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="contactDescription">Mô tả</label>
            <textarea id="contactDescription" v-model="content.contact.description" rows="2"
                      placeholder="Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7"></textarea>
          </div>

          <!-- Phone -->
          <div class="contact-info-item">
            <h4><i class="fas fa-phone"></i> Điện thoại</h4>
            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" v-model="content.contact.info.phone.title" placeholder="Hotline"/>
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="text" v-model="content.contact.info.phone.value" placeholder="091.123.1882"/>
            </div>
            <div class="form-group">
              <label>Biểu tượng</label>
              <div class="input-with-icon">
                <IconPicker v-model="content.contact.info.phone.icon"/>
              </div>
            </div>
          </div>

          <!-- Email -->
          <div class="contact-info-item">
            <h4><i class="fas fa-envelope"></i> Email</h4>
            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" v-model="content.contact.info.email.title" placeholder="Email"/>
            </div>
            <div class="form-group">
              <label>Địa chỉ email</label>
              <input type="text" v-model="content.contact.info.email.value" placeholder="thienhagroup@gmail.com"/>
            </div>
            <div class="form-group">
              <label>Thời gian phản hồi</label>
              <input type="text" v-model="content.contact.info.email.responseTime" placeholder="Phản hồi trong 2 giờ"/>
            </div>
            <div class="form-group">
              <label>Biểu tượng</label>
              <div class="input-with-icon">
                <IconPicker v-model="content.contact.info.email.icon"/>
              </div>
            </div>
          </div>

          <!-- Address -->
          <div class="contact-info-item">
            <h4><i class="fas fa-map-marker-alt"></i> Địa chỉ</h4>
            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" v-model="content.contact.info.address.title" placeholder="Văn phòng"/>
            </div>
            <div class="form-group">
              <label>Địa chỉ</label>
              <textarea v-model="content.contact.info.address.value" rows="2"
                        placeholder="14 đường 15, KĐT Vạn Phúc, Phường Hiệp Bình Phước, TP. Thủ Đức, TP.HCM"></textarea>
            </div>
            <div class="form-group">
              <label>Giờ làm việc</label>
              <input type="text" v-model="content.contact.info.address.workHours"
                     placeholder="Làm việc: Thứ 2 - Thứ 7"/>
            </div>
            <div class="form-group">
              <label>Biểu tượng</label>
              <div class="input-with-icon">
                <IconPicker v-model="content.contact.info.address.icon"/>
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
      blue400: "--color-blue-400",
      blue500: "--color-blue-500",
      blue600: "--color-blue-600",
      purple400: "--color-purple-400",
      purple500: "--color-purple-500",
      purple600: "--color-purple-600",
      slate50: "--color-slate-50",
      slate300: "--color-slate-300",
      slate400: "--color-slate-400",
      slate500: "--color-slate-500",
      slate700: "--color-slate-700",
      slate800: "--color-slate-800",
      slate900: "--color-slate-900"
    },
    gradients: {
      heroText: {
        from: "blue400",
        to: "purple500"
      },
      button: {
        from: "blue500",
        to: "purple600"
      },
      sectionTitle: {
        from: "blue400",
        to: "purple500"
      }
    }
  },
  hero: {
    tagline: "CÔNG NGHỆ AI TIÊN TIẾN",
    taglineIcon: "fas fa-bolt",
    title: "Định giá BĐS chính xác",
    highlightedText: "với AI & Big Data",
    description: "Công cụ định giá thông minh của Thiên Hà Group phân tích",
    descriptionContinuation: "mỗi ngày để đưa ra mức giá tối ưu với độ chính xác lên đến",
    highlights: [
      {
        text: "10,000+ dữ liệu thị trường",
        class: "text-slate-50 font-semibold"
      },
      {
        text: "95%",
        class: "text-blue-300 font-bold"
      }
    ],
    ctaButtons: {
      priceNow: {
        text: "Định giá ngay",
        icon: "fas fa-calculator"
      },
      watchDemo: {
        text: "Xem demo",
        icon: "fas fa-play-circle"
      }
    },
    stats: [
      {
        value: "95%",
        label: "Độ chính xác"
      },
      {
        value: "10K+",
        label: "Dữ liệu/ngày"
      },
      {
        value: "50K+",
        label: "Khách hàng"
      }
    ]
  },
  features: {
    title: "Công nghệ",
    titleHighlight: {
      text: "định giá vượt trội",
      hasGradient: true
    },
    description: "Kết hợp AI, Big Data và Machine Learning để đưa ra mức giá chính xác nhất",
    items: [
      {
        title: "AI Phân Tích Nâng Cao",
        iconName: "fas fa-brain",
        color: "purple",
        aosDelay: "0",
        description: "Hệ thống AI phân tích 50+ yếu tố ảnh hưởng đến giá BĐS, từ vị trí đến xu hướng thị trường.",
        listContent: [
          "Phân tích dữ liệu lịch sử",
          "Dự đoán xu hướng giá",
          "So sánh 1000+ BĐS tương tự"
        ],
        listDotIconClass: "fas fa-check-circle text-purple-400"
      },
      {
        title: "Big Data Thời Gian Thực",
        iconName: "fas fa-database",
        color: "blue",
        aosDelay: "100",
        description: "Cập nhật 10,000+ dữ liệu giao dịch mỗi ngày từ các sàn BĐS lớn và cơ quan nhà nước.",
        listContent: [
          "Dữ liệu từ 20+ nguồn uy tín",
          "Cập nhật real-time 24/7",
          "Phân tích đa chiều"
        ],
        listDotIconClass: "fas fa-check-circle text-blue-400"
      },
      {
        title: "Báo Cáo Chi Tiết",
        iconName: "fas fa-chart-line",
        color: "purple",
        aosDelay: "200",
        description: "Xuất báo cáo đầy đủ với biểu đồ, phân tích SWOT và khuyến nghị giá tối ưu.",
        listContent: [
          "Biểu đồ tương tác",
          "So sánh với BĐS tương tự",
          "Dự báo 6-12 tháng"
        ],
        listDotIconClass: "fas fa-check-circle text-purple-400"
      }
    ]
  },
  howItWorks: {
    title: "Quy trình",
    titleHighlight: {
      text: "định giá 4 bước",
      hasGradient: true
    },
    description: "Đơn giản, nhanh chóng và chính xác chỉ trong 5 phút",
    steps: [
      {
        number: 1,
        title: "Nhập thông tin",
        description: "Điền thông tin BĐS: vị trí, diện tích, loại hình, năm xây dựng"
      },
      {
        number: 2,
        title: "AI Phân tích",
        description: "Hệ thống AI phân tích 10,000+ dữ liệu và 50+ yếu tố ảnh hưởng"
      },
      {
        number: 3,
        title: "So sánh thị trường",
        description: "So sánh với 100+ BĐS tương tự đã giao dịch trong 6 tháng gần nhất"
      },
      {
        number: 4,
        title: "Nhận kết quả",
        description: "Nhận báo cáo chi tiết với giá đề xuất và phân tích SWOT"
      }
    ],
    ctaButton: {
      text: "Bắt đầu định giá miễn phí",
      icon: "fas fa-play-circle"
    }
  },
  testimonials: {
    title: "Được tin dùng bởi",
    titleHighlight: {
      text: "50,000+ khách hàng",
      hasGradient: true
    },
    description: "Những đánh giá từ khách hàng đã sử dụng công cụ định giá của chúng tôi",
    items: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        position: "Chủ nhà phố Q.2",
        quote: "Công cụ định giá giúp tôi bán nhà nhanh hơn 30% so với dự kiến.",
        initials: "NA",
        color: "purple",
        rating: 5,
        aos: "fade-up",
        aosDelay: "0"
      },
      {
        id: 2,
        name: "Trần Thị B",
        position: "Môi giới BĐS",
        quote: "Giá đề xuất rất sát thị trường, khách hàng tin tưởng hơn.",
        initials: "TB",
        color: "blue",
        rating: 5,
        aos: "fade-up",
        aosDelay: "100"
      },
      {
        id: 3,
        name: "Lê Văn C",
        position: "Nhà đầu tư BĐS",
        quote: "Phân tích SWOT giúp tôi ra quyết định đầu tư chính xác.",
        initials: "LC",
        color: "purple",
        rating: 5,
        aos: "fade-up",
        aosDelay: "200"
      }
    ]
  },
  contact: {
    title: "Liên hệ với",
    titleHighlight: {
      text: "chuyên gia",
      hasGradient: true
    },
    description: "Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7",
    info: {
      phone: {
        title: "Hotline",
        value: "091.123.1882",
        icon: "fas fa-phone"
      },
      email: {
        title: "Email",
        value: "thienhagroup@gmail.com",
        responseTime: "Phản hồi trong 2 giờ",
        icon: "fas fa-envelope"
      },
      address: {
        title: "Văn phòng",
        value: "14 đường 15, KĐT Vạn Phúc, Phường Hiệp Bình Phước, TP. Thủ Đức, TP.HCM",
        workHours: "Làm việc: Thứ 2 - Thứ 7",
        icon: "fas fa-map-marker-alt"
      }
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
const SECTION_ID = 59

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

// Hàm chuyển đổi gradient string thành object
const parseGradientString = (gradientString) => {
  if (!gradientString) return { from: '', to: '' };

  // Parse từ dạng "from-blue-400 to-purple-500" thành object {from: "blue400", to: "purple500"}
  const regex = /from-([a-zA-Z]+)-(\d+)\s+to-([a-zA-Z]+)-(\d+)/;
  const match = gradientString.match(regex);

  if (match) {
    return {
      from: match[1] + match[2],
      to: match[3] + match[4]
    };
  }

  return { from: '', to: '' };
};

// Hàm chuyển đổi gradient object thành string
const toGradientString = (gradientObj) => {
  if (!gradientObj.from || !gradientObj.to) return '';

  // Chuyển từ dạng "blue400" thành "blue-400"
  const fromMatch = gradientObj.from.match(/([a-zA-Z]+)(\d+)/);
  const toMatch = gradientObj.to.match(/([a-zA-Z]+)(\d+)/);

  if (fromMatch && toMatch) {
    return `from-${fromMatch[1]}-${fromMatch[2]} to-${toMatch[1]}-${toMatch[2]}`;
  }

  return '';
};

// ========== API INTEGRATION ==========
const loadData = async () => {
  try {
    isLoading.value = true
    const response = await api.get(`/cms/getSection/${SECTION_ID}`)

    if (response.data && response.data.contentJson) {
      const data = typeof response.data.contentJson === 'string'
          ? JSON.parse(response.data.contentJson)
          : response.data.contentJson

      // Chuyển đổi gradients từ string sang object
      if (data.styles && data.styles.gradients) {
        Object.keys(data.styles.gradients).forEach(key => {
          if (typeof data.styles.gradients[key] === 'string') {
            data.styles.gradients[key] = parseGradientString(data.styles.gradients[key]);
          }
        });
      }

      // Chuyển đổi titleHighlight từ class sang hasGradient
      const sectionsWithTitleHighlight = ['features', 'howItWorks', 'testimonials', 'contact'];
      sectionsWithTitleHighlight.forEach(section => {
        if (data[section] && data[section].titleHighlight) {
          if (typeof data[section].titleHighlight === 'object') {
            // Kiểm tra xem có trường class không, nếu có thì chuyển thành hasGradient
            if (data[section].titleHighlight.class !== undefined) {
              data[section].titleHighlight.hasGradient = data[section].titleHighlight.class === 'gradient-text';
              // Xóa trường class cũ
              delete data[section].titleHighlight.class;
            }
          }
        }
      });

      // Update content with loaded data
      Object.assign(content, data)

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

    // Prepare content data (copy)
    const contentData = JSON.parse(JSON.stringify(content))

    // Chuyển đổi gradients từ object sang string để lưu
    if (contentData.styles && contentData.styles.gradients) {
      Object.keys(contentData.styles.gradients).forEach(key => {
        if (typeof contentData.styles.gradients[key] === 'object') {
          contentData.styles.gradients[key] = toGradientString(contentData.styles.gradients[key]);
        }
      });
    }

    // Chuyển đổi hasGradient thành class để lưu
    const sectionsWithTitleHighlight = ['features', 'howItWorks', 'testimonials', 'contact'];
    sectionsWithTitleHighlight.forEach(section => {
      if (contentData[section] && contentData[section].titleHighlight) {
        contentData[section].titleHighlight.class = contentData[section].titleHighlight.hasGradient ? 'gradient-text' : '';
        // Xóa hasGradient nếu không cần thiết
        delete contentData[section].titleHighlight.hasGradient;
      }
    });

    // Prepare FormData
    const formData = new FormData()

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Nội dung chính - Định giá BĐS với AI',
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
      await loadData()
    }
  } catch (error) {
    console.error('Error saving changes:', error)
    showToast('Lỗi khi lưu thay đổi: ' + (error.response?.data?.message || error.message), 'error')
  } finally {
    isLoading.value = false
  }
}

const globalColors = ref({});

const loadDataColors = async () => {
  try {
    const response = await api.get('/cms/getSection/55')
    const parsedJSON = JSON.parse(response.data.contentJson)
    globalColors.value = parsedJSON.colors || {}
  } catch (error) {
    console.error('Error loading colors:', error)
  }
}

// ========== HERO MANAGEMENT ==========
const addHighlight = () => {
  if (!content.hero.highlights) {
    content.hero.highlights = []
  }
  content.hero.highlights.push({
    text: "",
    class: ""
  })
  showToast('Đã thêm highlight mới', 'success')
}

const removeHighlight = (index) => {
  if (confirm('Bạn có chắc muốn xóa highlight này?')) {
    content.hero.highlights.splice(index, 1)
    showToast('Đã xóa highlight', 'success')
  }
}

const addStat = () => {
  if (!content.hero.stats) {
    content.hero.stats = []
  }
  content.hero.stats.push({
    value: "",
    label: ""
  })
  showToast('Đã thêm thống kê mới', 'success')
}

const removeStat = (index) => {
  if (confirm('Bạn có chắc muốn xóa thống kê này?')) {
    content.hero.stats.splice(index, 1)
    showToast('Đã xóa thống kê', 'success')
  }
}

// ========== FEATURES MANAGEMENT ==========
const addFeature = () => {
  if (!content.features.items) {
    content.features.items = []
  }
  content.features.items.push({
    title: "",
    iconName: "fas fa-star",
    color: "purple",
    aosDelay: "0",
    description: "",
    listContent: [],
    listDotIconClass: "fas fa-check-circle text-purple-400"
  })
  showToast('Đã thêm công nghệ mới', 'success')
}

const removeFeature = (index) => {
  if (confirm('Bạn có chắc muốn xóa công nghệ này?')) {
    content.features.items.splice(index, 1)
    showToast('Đã xóa công nghệ', 'success')
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

const addFeatureListItem = (featureIndex) => {
  if (!content.features.items[featureIndex].listContent) {
    content.features.items[featureIndex].listContent = []
  }
  content.features.items[featureIndex].listContent.push("")
  showToast('Đã thêm item vào danh sách', 'success')
}

const removeFeatureListItem = (featureIndex, itemIndex) => {
  if (confirm('Bạn có chắc muốn xóa item này?')) {
    content.features.items[featureIndex].listContent.splice(itemIndex, 1)
    showToast('Đã xóa item khỏi danh sách', 'success')
  }
}

// ========== HOW IT WORKS MANAGEMENT ==========
const addStep = () => {
  if (!content.howItWorks.steps) {
    content.howItWorks.steps = []
  }
  content.howItWorks.steps.push({
    number: content.howItWorks.steps.length + 1,
    title: "",
    description: ""
  })
  showToast('Đã thêm bước mới', 'success')
}

const removeStep = (index) => {
  if (confirm('Bạn có chắc muốn xóa bước này?')) {
    content.howItWorks.steps.splice(index, 1)
    showToast('Đã xóa bước', 'success')
  }
}

const moveStepUp = (index) => {
  if (index > 0) {
    const temp = content.howItWorks.steps[index]
    content.howItWorks.steps[index] = content.howItWorks.steps[index - 1]
    content.howItWorks.steps[index - 1] = temp
  }
}

const moveStepDown = (index) => {
  if (index < content.howItWorks.steps.length - 1) {
    const temp = content.howItWorks.steps[index]
    content.howItWorks.steps[index] = content.howItWorks.steps[index + 1]
    content.howItWorks.steps[index + 1] = temp
  }
}

// ========== TESTIMONIALS MANAGEMENT ==========
const addTestimonial = () => {
  if (!content.testimonials.items) {
    content.testimonials.items = []
  }
  content.testimonials.items.push({
    id: generateId(),
    name: "",
    position: "",
    quote: "",
    initials: "",
    color: "purple",
    rating: 5,
    aos: "fade-up",
    aosDelay: "0"
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
/* Giữ nguyên tất cả các style từ component gốc */
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
.steps-list,
.testimonials-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.feature-item,
.step-item,
.testimonial-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.feature-item:hover,
.step-item:hover,
.testimonial-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.feature-header,
.step-header,
.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.feature-header h4,
.step-header h4,
.testimonial-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1rem;
}

.feature-actions,
.step-actions,
.testimonial-actions {
  display: flex;
  gap: 8px;
}

/* Contact info items */
.contact-info-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.contact-info-item h4 {
  margin: 0 0 15px 0;
  color: #031358;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Highlight items */
.highlight-item, .stat-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.highlight-item input {
  width: 45% !important;
}

.stat-item .form-group {
  width: 45% !important;
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
}

.form-group h4 {
  margin: 0 0 15px 0;
  color: #031358;
  font-size: 1.1rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 10px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 10px;
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

/* Gradient Controls */
.gradient-input-group {
  margin-bottom: 20px;
}

.gradient-input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
}

.gradient-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.gradient-color-picker label {
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 5px;
  display: block;
}

/* Checkbox Styles */
.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: normal;
  margin: 0;
  font-size: 0.9rem;
  color: #495057;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
  cursor: pointer;
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

.btn-danger {
  color: white;
  background: linear-gradient(135deg, #c82333 0%, #dc3545 100%);
}

.btn-danger:hover {
  background: linear-gradient(135deg, #bd2130 0%, #c82333 100%);
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

  .form-row {
    grid-template-columns: 1fr;
  }

  .gradient-controls {
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
  .step-header,
  .testimonial-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .feature-actions,
  .step-actions,
  .testimonial-actions {
    align-self: flex-end;
  }

  .checkbox-group {
    margin-top: 10px;
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
</style>