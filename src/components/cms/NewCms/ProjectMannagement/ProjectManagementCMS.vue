<template>
  <div class="reasons-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Nội dung chính - Quản lý dự án thông minh</h2>
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
          :class="{ active: activeTab === 'stats' }"
          @click="activeTab = 'stats'"
      >
        <i class="fas fa-chart-bar"></i> Thống kê
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'features' }"
          @click="activeTab = 'features'"
      >
        <i class="fas fa-cogs"></i> Tính năng
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'showcases' }"
          @click="activeTab = 'showcases'"
      >
        <i class="fas fa-eye"></i> Showcase
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'kanban' }"
          @click="activeTab = 'kanban'"
      >
        <i class="fas fa-columns"></i> Kanban
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'benefits' }"
          @click="activeTab = 'benefits'"
      >
        <i class="fas fa-trophy"></i> Lợi ích
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'timeline' }"
          @click="activeTab = 'timeline'"
      >
        <i class="fas fa-road"></i> Timeline
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'cta' }"
          @click="activeTab = 'cta'"
      >
        <i class="fas fa-bullhorn"></i> CTA
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
            <div class="color-input-group" v-for="(colorValue, colorKey) in content.colors" :key="colorKey">
              <label>{{ colorKey }}</label>
              <ColorInputWithGlobalColors
                  v-model="content.colors[colorKey]"
                  :placeholder="colorValue"
                  return-type="key"
                  :colors="globalColors"
              />
            </div>
          </div>

          <!-- Gradients -->
          <div class="setting-section">
            <h3><i class="fas fa-gradient"></i> Gradients</h3>
            <div class="form-group" v-for="(gradient, gradientKey) in content.gradients" :key="gradientKey">
              <label :for="`gradient-${gradientKey}`">{{ gradientKey }}</label>
              <input
                  type="text"
                  :id="`gradient-${gradientKey}`"
                  v-model="content.gradients[gradientKey]"
                  :placeholder="gradient"
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

            <!-- Badge -->
            <div class="form-group">
              <label>Badge Icon</label>
              <IconPicker v-model="content.hero.badge.icon" />
            </div>

            <div class="form-group">
              <label>Badge Text</label>
              <input
                  type="text"
                  v-model="content.hero.badge.text"
                  placeholder="CÔNG NGHỆ ĐỘT PHÁ 2024"
              />
            </div>

            <!-- Title Parts -->
            <div class="form-group">
              <label>Title Part 1</label>
              <input
                  type="text"
                  v-model="content.hero.title.part1"
                  placeholder="Quản Lý Dự Án"
              />
            </div>

            <div class="form-group">
              <label>Title Part 2</label>
              <input
                  type="text"
                  v-model="content.hero.title.part2"
                  placeholder="Thông Minh Với"
              />
            </div>

            <div class="form-group">
              <label>Title Part 3</label>
              <input
                  type="text"
                  v-model="content.hero.title.part3"
                  placeholder="AI & Thời Gian Thực"
              />
            </div>

            <!-- Description -->
            <div class="form-group">
              <label>Description Highlight</label>
              <input
                  type="text"
                  v-model="content.hero.description.highlight"
                  placeholder="Dự Án & Tiến Độ"
              />
            </div>

            <div class="form-group">
              <label>Description Text</label>
              <textarea
                  v-model="content.hero.description.text"
                  rows="3"
                  placeholder="- Công cụ quản lý dự án..."
              ></textarea>
            </div>
          </div>

          <!-- Hero Buttons -->
          <div class="setting-section">
            <h3><i class="fas fa-mouse-pointer"></i> Nút bấm Hero</h3>

            <!-- Demo Button -->
            <div class="form-group">
              <label>Demo Button Icon</label>
              <IconPicker v-model="content.hero.buttons.demo.icon" />
            </div>
            <div class="form-group">
              <label>Demo Button Text</label>
              <input
                  type="text"
                  v-model="content.hero.buttons.demo.text"
                  placeholder="TRẢI NGHIỆM DEMO"
              />
            </div>

            <!-- Consultation Button -->
            <div class="form-group">
              <label>Consultation Button Icon</label>
              <IconPicker v-model="content.hero.buttons.consultation.icon" />
            </div>
            <div class="form-group">
              <label>Consultation Button Text</label>
              <input
                  type="text"
                  v-model="content.hero.buttons.consultation.text"
                  placeholder="ĐẶT LỊCH TƯ VẤN"
              />
            </div>
          </div>

          <!-- Floating Elements -->
          <div class="setting-section">
            <h3><i class="fas fa-shapes"></i> Floating Elements</h3>

            <!-- Rocket -->
            <div class="form-group">
              <label>Rocket Icon</label>
              <IconPicker v-model="content.floatingElements.rocket.icon" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Rocket Size</label>
                <input type="text" v-model="content.floatingElements.rocket.size" placeholder="150px" />
              </div>
              <div class="form-group">
                <label>Animation Delay</label>
                <input type="text" v-model="content.floatingElements.rocket.animationDelay" placeholder="0s" />
              </div>
            </div>

            <!-- Chart -->
            <div class="form-group">
              <label>Chart Icon</label>
              <IconPicker v-model="content.floatingElements.chart.icon" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Chart Size</label>
                <input type="text" v-model="content.floatingElements.chart.size" placeholder="150px" />
              </div>
              <div class="form-group">
                <label>Animation Delay</label>
                <input type="text" v-model="content.floatingElements.chart.animationDelay" placeholder="1s" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Thống kê -->
      <div v-if="activeTab === 'stats'" class="stats-settings">
        <div class="settings-grid">
          <!-- Desktop Left Stats -->
          <div class="setting-section">
            <h3><i class="fas fa-desktop"></i> Thống kê bên trái (Desktop)</h3>

            <div v-for="(stat, index) in content.stats.desktopLeft" :key="index" class="stat-item">
              <div class="stat-header">
                <h4>Thống kê #{{ index + 1 }}</h4>
              </div>

              <div class="form-group">
                <label>Giá trị</label>
                <input type="number" v-model.number="stat.value" placeholder="12500" />
              </div>

              <div class="form-group">
                <label>Nhãn</label>
                <input type="text" v-model="stat.label" placeholder="Dự Án Đang Chạy" />
              </div>

              <div class="form-group">
                <label>Icon</label>
                <IconPicker v-model="stat.icon" />
              </div>

              <div class="form-group">
                <label>Icon Color</label>
                <input type="text" v-model="stat.iconColor" placeholder="text-blue-500/20" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Width</label>
                  <input type="text" v-model="stat.size.width" placeholder="300px" />
                </div>
                <div class="form-group">
                  <label>Height</label>
                  <input type="text" v-model="stat.size.height" placeholder="150px" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Top Position</label>
                  <input type="text" v-model="stat.position.top" placeholder="25%" />
                </div>
                <div class="form-group">
                  <label>Left Position</label>
                  <input type="text" v-model="stat.position.left" placeholder="7%" />
                </div>
              </div>

              <div class="form-group">
                <label>Animation Delay</label>
                <input type="text" v-model="stat.animationDelay" placeholder="0.5s" />
              </div>
            </div>
          </div>

          <!-- Desktop Right Stats -->
          <div class="setting-section">
            <h3><i class="fas fa-desktop"></i> Thống kê bên phải (Desktop)</h3>

            <div v-for="(stat, index) in content.stats.desktopRight" :key="index" class="stat-item">
              <div class="stat-header">
                <h4>Thống kê #{{ index + 1 }}</h4>
              </div>

              <div class="form-group">
                <label>Giá trị</label>
                <input type="number" v-model.number="stat.value" placeholder="62" />
              </div>

              <div class="form-group">
                <label>Nhãn</label>
                <input type="text" v-model="stat.label" placeholder="Tăng Năng Suất" />
              </div>

              <div class="form-group">
                <label>Icon</label>
                <IconPicker v-model="stat.icon" />
              </div>

              <div class="form-group">
                <label>Icon Color</label>
                <input type="text" v-model="stat.iconColor" placeholder="text-cyan-400/20" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Width</label>
                  <input type="text" v-model="stat.size.width" placeholder="300px" />
                </div>
                <div class="form-group">
                  <label>Height</label>
                  <input type="text" v-model="stat.size.height" placeholder="150px" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Top Position</label>
                  <input type="text" v-model="stat.position.top" placeholder="5%" />
                </div>
                <div class="form-group">
                  <label>Right Position</label>
                  <input type="text" v-model="stat.position.right" placeholder="10%" />
                </div>
              </div>

              <div class="form-group">
                <label>Animation Delay</label>
                <input type="text" v-model="stat.animationDelay" placeholder="1s" />
              </div>
            </div>
          </div>

          <!-- Mobile Stats -->
          <div class="setting-section">
            <h3><i class="fas fa-mobile-alt"></i> Thống kê (Mobile)</h3>

            <div v-for="(stat, index) in content.stats.mobile" :key="index" class="stat-item">
              <div class="stat-header">
                <h4>Thống kê #{{ index + 1 }}</h4>
              </div>

              <div class="form-group">
                <label>Giá trị</label>
                <input type="number" v-model.number="stat.value" placeholder="12500" />
              </div>

              <div class="form-group">
                <label>Nhãn</label>
                <input type="text" v-model="stat.label" placeholder="Dự Án Đang Chạy" />
              </div>

              <div class="form-group">
                <label>Icon</label>
                <IconPicker v-model="stat.icon" />
              </div>

              <div class="form-group">
                <label>Icon Color</label>
                <input type="text" v-model="stat.iconColor" placeholder="text-blue-500/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Features -->
      <div v-if="activeTab === 'features'" class="features-settings">
        <div class="setting-section">
          <h3><i class="fas fa-cogs"></i> Phần Tính năng</h3>

          <div class="form-group">
            <label>Badge Icon</label>
            <IconPicker v-model="content.features.badge.icon" />
          </div>

          <div class="form-group">
            <label>Badge Text</label>
            <input type="text" v-model="content.features.badge.text" placeholder="TÍNH NĂNG ĐỘT PHÁ" />
          </div>

          <div class="form-group">
            <label>Title Part 1</label>
            <input type="text" v-model="content.features.title.part1" placeholder="Công Nghệ" />
          </div>

          <div class="form-group">
            <label>Title Part 2</label>
            <input type="text" v-model="content.features.title.part2" placeholder="Làm Thay Đổi Cuộc Chơi" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea
                v-model="content.features.description"
                rows="3"
                placeholder="Khám phá bộ công cụ quản lý dự án..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Tab Showcases -->
      <div v-if="activeTab === 'showcases'" class="showcases-settings">
        <div class="settings-grid">
          <!-- AI Showcase -->
          <div class="setting-section">
            <h3><i class="fas fa-brain"></i> AI Showcase</h3>

            <div class="form-group">
              <label>Badge</label>
              <input type="text" v-model="content.showcases.ai.badge" placeholder="AI THÔNG MINH" />
            </div>

            <div class="form-group">
              <label>Title Part 1</label>
              <input type="text" v-model="content.showcases.ai.title.part1" placeholder="Dự Đoán Tiến Độ Với" />
            </div>

            <div class="form-group">
              <label>Title Part 2</label>
              <input type="text" v-model="content.showcases.ai.title.part2" placeholder="Trí Tuệ Nhân Tạo" />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea
                  v-model="content.showcases.ai.description"
                  rows="4"
                  placeholder="Hệ thống AI của chúng tôi..."
              ></textarea>
            </div>

            <!-- Features -->
            <div v-for="(feature, index) in content.showcases.ai.features" :key="index" class="feature-item">
              <div class="feature-header">
                <h5>Feature #{{ index + 1 }}</h5>
              </div>

              <div class="form-group">
                <label>Icon</label>
                <IconPicker v-model="feature.icon" />
              </div>

              <div class="form-group">
                <label>Text</label>
                <input type="text" v-model="feature.text" placeholder="Phân tích dự đoán rủi ro tự động" />
              </div>
            </div>

            <!-- Visual -->
            <div class="form-group">
              <label>Visual Icon</label>
              <IconPicker v-model="content.showcases.ai.visual.icon" />
            </div>

            <div class="form-group">
              <label>Visual Value</label>
              <input type="text" v-model="content.showcases.ai.visual.value" placeholder="94%" />
            </div>

            <div class="form-group">
              <label>Visual Label</label>
              <input type="text" v-model="content.showcases.ai.visual.label" placeholder="Độ chính xác dự đoán" />
            </div>
          </div>

          <!-- Kanban Showcase -->
          <div class="setting-section">
            <h3><i class="fas fa-columns"></i> Kanban Showcase</h3>

            <div class="form-group">
              <label>Badge</label>
              <input type="text" v-model="content.showcases.kanban.badge" placeholder="KANBAN 3D" />
            </div>

            <div class="form-group">
              <label>Title Part 1</label>
              <input type="text" v-model="content.showcases.kanban.title.part1" placeholder="Quản Lý Công Việc" />
            </div>

            <div class="form-group">
              <label>Title Part 2</label>
              <input type="text" v-model="content.showcases.kanban.title.part2" placeholder="Trực Quan Nhất" />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea
                  v-model="content.showcases.kanban.description"
                  rows="4"
                  placeholder="Bảng Kanban 3D với hiệu ứng hình ảnh sống động..."
              ></textarea>
            </div>

            <!-- Button -->
            <div class="form-group">
              <label>Button Icon</label>
              <IconPicker v-model="content.showcases.kanban.button.icon" />
            </div>

            <div class="form-group">
              <label>Button Text</label>
              <input type="text" v-model="content.showcases.kanban.button.text" placeholder="TRẢI NGHIỆM KANBAN 3D" />
            </div>

            <!-- Visual -->
            <div class="form-group">
              <label>Visual Icon</label>
              <IconPicker v-model="content.showcases.kanban.visual.icon" />
            </div>

            <div class="form-group">
              <label>Visual Value</label>
              <input type="text" v-model="content.showcases.kanban.visual.value" placeholder="75%" />
            </div>

            <div class="form-group">
              <label>Visual Label</label>
              <input type="text" v-model="content.showcases.kanban.visual.label" placeholder="Giảm thời gian quản lý" />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Kanban -->
      <div v-if="activeTab === 'kanban'" class="kanban-settings">
        <div class="setting-section">
          <h3><i class="fas fa-columns"></i> Kanban Columns</h3>

          <div v-for="(column, columnIndex) in content.kanban.columns" :key="columnIndex" class="kanban-column-item">
            <div class="column-header">
              <h4>Cột #{{ columnIndex + 1 }} - {{ column.title }}</h4>
            </div>

            <div class="form-group">
              <label>Status</label>
              <input type="text" v-model="column.status" placeholder="todo" />
            </div>

            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="column.title" placeholder="Cần Làm" />
            </div>

            <div class="form-group">
              <label>Title Color</label>
              <input type="text" v-model="column.titleColor" placeholder="text-blue-400" />
            </div>

            <div class="form-group">
              <label>Task Offset</label>
              <input type="number" v-model.number="column.taskOffset" placeholder="0" />
            </div>

            <!-- Tasks -->
            <div v-for="(task, taskIndex) in column.tasks" :key="taskIndex" class="task-item">
              <div class="task-header">
                <h5>Task #{{ taskIndex + 1 }}</h5>
              </div>

              <div class="form-group">
                <label>Task Title</label>
                <input type="text" v-model="task.title" placeholder="Tìm khách hàng" />
              </div>

              <div class="form-group">
                <label>Status Text</label>
                <input type="text" v-model="task.statusText" placeholder="Hạn: 15/11" />
              </div>

              <div class="form-group">
                <label>Classes</label>
                <input type="text" v-model="task.classes" placeholder="bg-blue-500/10" />
              </div>

              <div class="form-group">
                <label>Status Color</label>
                <input type="text" v-model="task.statusColor" placeholder="text-blue-400" />
              </div>
            </div>
          </div>

          <!-- Instruction -->
          <div class="form-group">
            <label>Instruction Highlight</label>
            <input type="text" v-model="content.kanban.instruction.highlight" placeholder="Kéo và thả" />
          </div>

          <div class="form-group">
            <label>Instruction Text</label>
            <input type="text" v-model="content.kanban.instruction.text" placeholder="các task giữa các cột để trải nghiệm!" />
          </div>
        </div>
      </div>

      <!-- Tab Benefits -->
      <div v-if="activeTab === 'benefits'" class="benefits-settings">
        <div class="setting-section">
          <h3><i class="fas fa-trophy"></i> Lợi ích</h3>

          <div class="form-group">
            <label>Badge Icon</label>
            <IconPicker v-model="content.benefits.badge.icon" />
          </div>

          <div class="form-group">
            <label>Badge Text</label>
            <input type="text" v-model="content.benefits.badge.text" placeholder="LỢI ÍCH NỔI BẬT" />
          </div>

          <div class="form-group">
            <label>Title Part 1</label>
            <input type="text" v-model="content.benefits.title.part1" placeholder="Tại Sao" />
          </div>

          <div class="form-group">
            <label>Title Part 2</label>
            <input type="text" v-model="content.benefits.title.part2" placeholder="Hơn 8.500 Môi Giới" />
          </div>

          <!-- Benefits Items -->
          <div v-for="(item, index) in content.benefits.items" :key="item.id" class="benefit-item">
            <div class="benefit-header">
              <h4>Lợi ích #{{ index + 1 }}</h4>
            </div>

            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="item.title" placeholder="Tăng 62% Năng Suất" />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea
                  v-model="item.description"
                  rows="2"
                  placeholder="Tự động hóa 80% công việc..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Icon</label>
              <IconPicker v-model="item.icon" />
            </div>

            <div class="form-group">
              <label>Color</label>
              <ColorInputWithGlobalColors
                  v-model="item.color"
                  placeholder="#60a5fa"
                  return-type="hex"
                  :colors="globalColors"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Số lượng carousel bullets</label>
            <input type="number" v-model.number="content.benefits.carouselBullets" min="1" max="10" />
          </div>
        </div>
      </div>

      <!-- Tab Timeline -->
      <div v-if="activeTab === 'timeline'" class="timeline-settings">
        <div class="setting-section">
          <h3><i class="fas fa-road"></i> Timeline</h3>

          <div class="form-group">
            <label>Badge Icon</label>
            <IconPicker v-model="content.timeline.badge.icon" />
          </div>

          <div class="form-group">
            <label>Badge Text</label>
            <input type="text" v-model="content.timeline.badge.text" placeholder="HÀNH TRÌNH TRIỂN KHAI" />
          </div>

          <div class="form-group">
            <label>Title Part 1</label>
            <input type="text" v-model="content.timeline.title.part1" placeholder="Bắt Đầu Trong" />
          </div>

          <div class="form-group">
            <label>Title Part 2</label>
            <input type="text" v-model="content.timeline.title.part2" placeholder="Chưa Đầy 48 Giờ" />
          </div>

          <!-- Timeline Items -->
          <div v-for="(item, index) in content.timeline.items" :key="index" class="timeline-item">
            <div class="timeline-header">
              <h4>Bước #{{ index + 1 }}</h4>
            </div>

            <div class="form-group">
              <label>Number</label>
              <input type="text" v-model="item.number" placeholder="01" />
            </div>

            <div class="form-group">
              <label>Title</label>
              <input type="text" v-model="item.title" placeholder="Đăng Ký & Thiết Lập" />
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea
                  v-model="item.description"
                  rows="2"
                  placeholder="Tạo tài khoản và thiết lập workspace..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Time Label</label>
              <input type="text" v-model="item.timeLabel" placeholder="Thời gian: 10 phút" />
            </div>

            <div class="form-group">
              <label>Time Color</label>
              <input type="text" v-model="item.timeColor" placeholder="text-blue-400" />
            </div>
          </div>

          <!-- Button -->
          <div class="form-group">
            <label>Button Icon</label>
            <IconPicker v-model="content.timeline.button.icon" />
          </div>

          <div class="form-group">
            <label>Button Text</label>
            <input type="text" v-model="content.timeline.button.text" placeholder="ĐĂNG KÝ TRIỂN KHAI NGAY" />
          </div>
        </div>
      </div>

      <!-- Tab CTA -->
      <div v-if="activeTab === 'cta'" class="cta-settings">
        <div class="settings-grid">
          <div class="setting-section">
            <h3><i class="fas fa-bullhorn"></i> Nội dung CTA</h3>

            <div class="form-group">
              <label>Badge Text</label>
              <input type="text" v-model="content.cta.badge.text" placeholder="ƯU ĐÃI ĐẶC BIỆT" />
            </div>

            <div class="form-group">
              <label>Title Line 1</label>
              <input type="text" v-model="content.cta.title.line1" placeholder="Sẵn Sàng" />
            </div>

            <div class="form-group">
              <label>Title Line 2</label>
              <input type="text" v-model="content.cta.title.line2" placeholder="Cách Mạng Hóa" />
            </div>

            <div class="form-group">
              <label>Title Line 3</label>
              <input type="text" v-model="content.cta.title.line3" placeholder="Quy Trình Quản Lý Dự Án?" />
            </div>

            <div class="form-group">
              <label>Description Part 1</label>
              <input type="text" v-model="content.cta.description.part1" placeholder="Đăng ký ngay hôm nay để nhận" />
            </div>

            <div class="form-group">
              <label>Description Highlight</label>
              <input type="text" v-model="content.cta.description.highlight" placeholder="30 NGÀY DÙNG THỬ MIỄN PHÍ" />
            </div>

            <div class="form-group">
              <label>Description Part 2</label>
              <input type="text" v-model="content.cta.description.part2" placeholder="và tặng kèm gói tư vấn..." />
            </div>
          </div>

          <div class="setting-section">
            <h3><i class="fas fa-gift"></i> Features & Buttons</h3>

            <!-- Features -->
            <div v-for="(feature, index) in content.cta.features" :key="index" class="cta-feature-item">
              <div class="feature-header">
                <h5>Feature #{{ index + 1 }}</h5>
              </div>

              <div class="form-group">
                <label>Icon</label>
                <IconPicker v-model="feature.icon" />
              </div>

              <div class="form-group">
                <label>Background Gradient</label>
                <input type="text" v-model="feature.bgGradient" placeholder="linear-gradient(...)" />
              </div>

              <div class="form-group">
                <label>Text</label>
                <input type="text" v-model="feature.text" placeholder="30 ngày dùng thử" />
              </div>
            </div>

            <!-- Buttons -->
            <div class="form-group">
              <label>Primary Button Icon</label>
              <IconPicker v-model="content.cta.buttons.primary.icon" />
            </div>
            <div class="form-group">
              <label>Primary Button Text</label>
              <input type="text" v-model="content.cta.buttons.primary.text" placeholder="BẮT ĐẦU DÙNG THỬ MIỄN PHÍ" />
            </div>

            <div class="form-group">
              <label>Secondary Button Icon</label>
              <IconPicker v-model="content.cta.buttons.secondary.icon" />
            </div>
            <div class="form-group">
              <label>Secondary Button Text</label>
              <input type="text" v-model="content.cta.buttons.secondary.text" placeholder="GỌI TƯ VẤN: 1900 1001" />
            </div>

            <!-- Guarantee -->
            <div class="form-group">
              <label>Guarantee Icon</label>
              <IconPicker v-model="content.cta.guarantee.icon" />
            </div>
            <div class="form-group">
              <label>Guarantee Text</label>
              <textarea
                  v-model="content.cta.guarantee.text"
                  rows="2"
                  placeholder="Cam kết hoàn tiền 100% trong 14 ngày..."
              ></textarea>
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

// Content structure based on new JSON data
const content = reactive({
  colors: {
    blue400: "var(--color-blue-400)",
    blue500: "var(--color-blue-500)",
    blue600: "var(--color-blue-600)",
    blue700: "var(--color-blue-700)",
    purple500: "var(--color-purple-500)",
    purple600: "var(--color-purple-600)",
    slate300: "var(--color-slate-300)",
    slate400: "var(--color-slate-400)",
    slate700: "var(--color-slate-700)",
    slate900: "var(--color-slate-900)",
    emerald500: "var(--color-emerald-500)",
    emerald600: "var(--color-emerald-600)",
    cyan400: "var(--color-cyan-400)",
    pink500: "var(--color-pink-500)"
  },
  gradients: {
    primary: "linear-gradient(90deg, #60a5fa, #8b5cf6)",
    secondary: "linear-gradient(90deg, #22d3ee, #ec4899)",
    heroBg: "linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.92) 50%, rgba(15, 23, 42, 0.95) 100%), radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)",
    ctaBg: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(15, 23, 42, 0.95) 100%), radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)"
  },
  hero: {
    badge: {
      icon: "fas fa-star",
      text: "CÔNG NGHỆ ĐỘT PHÁ 2024"
    },
    title: {
      part1: "Quản Lý Dự Án",
      part2: "Thông Minh Với",
      part3: "AI & Thời Gian Thực"
    },
    description: {
      highlight: "Dự Án & Tiến Độ",
      text: "- Công cụ quản lý dự án bất động sản thế hệ mới, tích hợp trí tuệ nhân tạo và công nghệ thời gian thực, giúp bạn kiểm soát mọi khía cạnh của dự án chỉ với một cú nhấp chuột."
    },
    buttons: {
      demo: {
        icon: "fas fa-play-circle",
        text: "TRẢI NGHIỆM DEMO"
      },
      consultation: {
        icon: "fas fa-calendar-alt",
        text: "ĐẶT LỊCH TƯ VẤN"
      }
    }
  },
  stats: {
    desktopLeft: [
      {
        value: 12500,
        displayValue: "0",
        label: "Dự Án Đang Chạy",
        icon: "fas fa-project-diagram",
        iconColor: "text-blue-500/20",
        size: {
          width: "300px",
          height: "150px"
        },
        position: {
          top: "25%",
          left: "7%"
        },
        animationDelay: "0.5s"
      },
      {
        value: 94.3,
        displayValue: "0",
        label: "Đúng Tiến Độ",
        icon: "fas fa-chart-line",
        iconColor: "text-purple-500/20",
        size: {
          width: "300px",
          height: "150px"
        },
        position: {
          top: "42%",
          left: "7%"
        },
        animationDelay: "0s"
      }
    ],
    desktopRight: [
      {
        value: 62,
        displayValue: "0",
        label: "Tăng Năng Suất",
        icon: "fas fa-bolt",
        iconColor: "text-cyan-400/20",
        size: {
          width: "300px",
          height: "150px"
        },
        position: {
          top: "5%",
          right: "10%"
        },
        animationDelay: "1s"
      },
      {
        value: 8500,
        displayValue: "0",
        label: "Môi Giới Tin Dùng",
        icon: "fas fa-user-check",
        iconColor: "text-emerald-500/20",
        size: {
          width: "300px",
          height: "150px"
        },
        position: {
          top: "25%",
          right: "10%"
        },
        animationDelay: "1.5s"
      }
    ],
    mobile: [
      {
        value: 12500,
        displayValue: "0",
        label: "Dự Án Đang Chạy",
        icon: "fas fa-project-diagram",
        iconColor: "text-blue-500/20"
      },
      {
        value: 94.3,
        displayValue: "0",
        label: "Đúng Tiến Độ",
        icon: "fas fa-chart-line",
        iconColor: "text-purple-500/20"
      },
      {
        value: 8500,
        displayValue: "0",
        label: "Môi Giới Tin Dùng",
        icon: "fas fa-user-check",
        iconColor: "text-emerald-500/20"
      },
      {
        value: 62,
        displayValue: "0",
        label: "Tăng Năng Suất",
        icon: "fas fa-bolt",
        iconColor: "text-cyan-400/20"
      }
    ]
  },
  floatingElements: {
    rocket: {
      icon: "fas fa-rocket text-4xl text-gradient-primary",
      size: "150px",
      position: {
        top: "5%",
        left: "7%"
      },
      animationDelay: "0s"
    },
    chart: {
      icon: "fas fa-chart-line text-3xl text-gradient-primary",
      size: "150px",
      position: {
        top: "42%",
        right: "10%"
      },
      animationDelay: "1s"
    }
  },
  particles: [
    {
      size: "20px",
      position: "10%",
      delay: "0s"
    },
    {
      size: "15px",
      position: "25%",
      delay: "5s"
    },
    {
      size: "25px",
      position: "50%",
      delay: "10s"
    },
    {
      size: "18px",
      position: "75%",
      delay: "15s"
    },
    {
      size: "22px",
      position: "90%",
      delay: "20s"
    }
  ],
  features: {
    badge: {
      icon: "fas fa-star",
      text: "TÍNH NĂNG ĐỘT PHÁ"
    },
    title: {
      part1: "Công Nghệ",
      part2: "Làm Thay Đổi Cuộc Chơi"
    },
    description: "Khám phá bộ công cụ quản lý dự án đầu tiên tại Việt Nam được thiết kế riêng cho ngành bất động sản"
  },
  showcases: {
    ai: {
      badge: "AI THÔNG MINH",
      title: {
        part1: "Dự Đoán Tiến Độ Với",
        part2: "Trí Tuệ Nhân Tạo"
      },
      description: "Hệ thống AI của chúng tôi phân tích hàng nghìn dự án tương tự để dự đoán chính xác tiến độ, cảnh báo rủi ro và đề xuất giải pháp tối ưu. Độ chính xác lên đến 94% giúp bạn luôn đi trước một bước.",
      features: [
        {
          icon: "fas fa-check-circle text-emerald-500",
          text: "Phân tích dự đoán rủi ro tự động"
        },
        {
          icon: "fas fa-check-circle text-emerald-500",
          text: "Đề xuất điều chỉnh kế hoạch thông minh"
        },
        {
          icon: "fas fa-check-circle text-emerald-500",
          text: "Tối ưu hóa phân bổ nguồn lực"
        }
      ],
      visual: {
        icon: "fas fa-brain",
        value: "94%",
        label: "Độ chính xác dự đoán",
        dots: [
          {
            color: "bg-blue-400",
            delay: "0s"
          },
          {
            color: "bg-purple-400",
            delay: "0.2s"
          },
          {
            color: "bg-blue-400",
            delay: "0.4s"
          }
        ]
      }
    },
    kanban: {
      badge: "KANBAN 3D",
      title: {
        part1: "Quản Lý Công Việc",
        part2: "Trực Quan Nhất"
      },
      description: "Bảng Kanban 3D với hiệu ứng hình ảnh sống động, cho phép kéo thả công việc giữa các cột trạng thái. Tích hợp timeline tương tác và thông báo thời gian thực.",
      button: {
        icon: "fas fa-hand-pointer",
        text: "TRẢI NGHIỆM KANBAN 3D"
      },
      visual: {
        icon: "fas fa-columns",
        value: "75%",
        label: "Giảm thời gian quản lý"
      }
    }
  },
  kanban: {
    columns: [
      {
        status: "todo",
        title: "Cần Làm",
        titleColor: "text-blue-400",
        taskOffset: 0,
        tasks: [
          {
            title: "Tìm khách hàng",
            statusText: "Hạn: 15/11",
            classes: "bg-blue-500/10",
            statusColor: "text-blue-400"
          },
          {
            title: "Chuẩn bị tài liệu",
            statusText: "Hạn: 16/11",
            classes: "bg-blue-500/10",
            statusColor: "text-blue-400"
          }
        ]
      },
      {
        status: "doing",
        title: "Đang Làm",
        titleColor: "text-amber-400",
        taskOffset: 2,
        tasks: [
          {
            title: "Đàm phán HĐ",
            statusText: "Đang thực hiện",
            classes: "bg-amber-500/10",
            statusColor: "text-amber-400"
          }
        ]
      },
      {
        status: "review",
        title: "Xem Xét",
        titleColor: "text-emerald-400",
        taskOffset: 3,
        tasks: [
          {
            title: "Kiểm tra tài liệu",
            statusText: "Chờ duyệt",
            classes: "bg-emerald-500/10",
            statusColor: "text-emerald-400"
          }
        ]
      },
      {
        status: "done",
        title: "Hoàn Thành",
        titleColor: "text-green-400",
        taskOffset: 4,
        tasks: [
          {
            title: "Khảo sát thị trường",
            statusText: "Hoàn thành 10/11",
            classes: "bg-green-500/10",
            statusColor: "text-green-400"
          },
          {
            title: "Phân tích đối thủ",
            statusText: "Hoàn thành 08/11",
            classes: "bg-green-500/10",
            statusColor: "text-green-400"
          }
        ]
      }
    ],
    instruction: {
      highlight: "Kéo và thả",
      text: "các task giữa các cột để trải nghiệm!"
    }
  },
  benefits: {
    badge: {
      icon: "fas fa-trophy",
      text: "LỢI ÍCH NỔI BẬT"
    },
    title: {
      part1: "Tại Sao",
      part2: "Hơn 8.500 Môi Giới"
    },
    items: [
      {
        id: 1,
        title: "Tăng 62% Năng Suất",
        description: "Tự động hóa 80% công việc quản lý dự án, giúp môi giới tập trung vào bán hàng và chốt giao dịch.",
        icon: "fas fa-bolt",
        color: "#60a5fa"
      },
      {
        id: 2,
        title: "94.3% Dự Án Đúng Tiến Độ",
        description: "Hệ thống cảnh báo thông minh giúp phát hiện và xử lý rủi ro từ sớm, đảm bảo tiến độ dự án.",
        icon: "fas fa-chart-line",
        color: "#a78bfa"
      },
      {
        id: 3,
        title: "Hợp Tác Nhóm Liền Mạch",
        description: "Kết nối mọi thành viên trong một nền tảng, giảm 75% email nội bộ và họp không cần thiết.",
        icon: "fas fa-users",
        color: "#34d399"
      },
      {
        id: 4,
        title: "Đa Nền Tảng",
        description: "Truy cập từ mọi thiết bị: Web, iOS, Android. Đồng bộ thời gian thực, làm việc mọi lúc mọi nơi.",
        icon: "fas fa-mobile-alt",
        color: "#06b6d4"
      },
      {
        id: 5,
        title: "Báo Cáo Thông Minh",
        description: "Hơn 50 mẫu báo cáo tự động, phân tích dữ liệu theo thời gian thực, hỗ trợ ra quyết định nhanh chóng.",
        icon: "fas fa-chart-pie",
        color: "#ec4899"
      },
      {
        id: 6,
        title: "Bảo Mật Tuyệt Đối",
        description: "Mã hóa end-to-end, xác thực 2 lớp, backup tự động hàng ngày đảm bảo an toàn dữ liệu tuyệt đối.",
        icon: "fas fa-shield-alt",
        color: "#22d3ee"
      }
    ],
    carouselBullets: 6
  },
  timeline: {
    badge: {
      icon: "fas fa-road",
      text: "HÀNH TRÌNH TRIỂN KHAI"
    },
    title: {
      part1: "Bắt Đầu Trong",
      part2: "Chưa Đầy 48 Giờ"
    },
    items: [
      {
        number: "01",
        title: "Đăng Ký & Thiết Lập",
        description: "Tạo tài khoản và thiết lập workspace trong 10 phút. Nhập dự án hiện có hoặc bắt đầu từ template.",
        timeLabel: "Thời gian: 10 phút",
        timeColor: "text-blue-400"
      },
      {
        number: "02",
        title: "Nhập Dữ Liệu & Đào Tạo",
        description: "Nhập dữ liệu dự án và tham gia buổi đào tạo trực tuyến với chuyên gia của chúng tôi.",
        timeLabel: "Thời gian: 15 phút",
        timeColor: "text-purple-400"
      },
      {
        number: "03",
        title: "Vận Hành & Tối Ưu",
        description: "Bắt đầu quản lý dự án thực tế. Nhận phân tích và tối ưu hóa tự động từ hệ thống AI.",
        timeLabel: "Thời gian: 24 giờ",
        timeColor: "text-emerald-400"
      }
    ],
    button: {
      icon: "fas fa-calendar-check",
      text: "ĐĂNG KÝ TRIỂN KHAI NGAY"
    }
  },
  cta: {
    badge: {
      text: "ƯU ĐÃI ĐẶC BIỆT"
    },
    title: {
      line1: "Sẵn Sàng",
      line2: "Cách Mạng Hóa",
      line3: "Quy Trình Quản Lý Dự Án?"
    },
    description: {
      part1: "Đăng ký ngay hôm nay để nhận",
      highlight: "30 NGÀY DÙNG THỬ MIỄN PHÍ",
      part2: "và tặng kèm gói tư vấn chuyển đổi số trị giá 15 triệu đồng."
    },
    features: [
      {
        icon: "fas fa-gift",
        bgGradient: "linear-gradient(to bottom right, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
        text: "30 ngày dùng thử"
      },
      {
        icon: "fas fa-headset",
        bgGradient: "linear-gradient(to bottom right, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))",
        text: "Hỗ trợ 24/7 chuyên nghiệp"
      },
      {
        icon: "fas fa-lock",
        bgGradient: "linear-gradient(to bottom right, rgba(16, 185, 129, 0.2), rgba(34, 211, 238, 0.2))",
        text: "Bảo mật tuyệt đối"
      }
    ],
    buttons: {
      primary: {
        icon: "fas fa-rocket",
        text: "BẮT ĐẦU DÙNG THỬ MIỄN PHÍ"
      },
      secondary: {
        icon: "fas fa-phone-alt",
        text: "GỌI TƯ VẤN: 1900 1001"
      }
    },
    guarantee: {
      icon: "fas fa-shield-alt",
      text: "Cam kết hoàn tiền 100% trong 14 ngày nếu không hài lòng"
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
const SECTION_ID = 62

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

    // Prepare FormData
    const formData = new FormData()

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Nội dung chính',
      contentJson: JSON.stringify(content, null, 2),
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

const globalColors = ref({});

const loadDataColors = async () => {
  try {
    const response = await api.get('/cms/getSection/55')
    if (response.data && response.data.contentJson) {
      const parsedJSON = typeof response.data.contentJson === 'string'
          ? JSON.parse(response.data.contentJson)
          : response.data.contentJson
      globalColors.value = parsedJSON.colors || {}
    }
  } catch (error) {
    console.error('Error loading colors:', error)
    globalColors.value = {}
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

/* Stat, Feature, Kanban Items */
.stat-item,
.feature-item,
.kanban-column-item,
.task-item,
.benefit-item,
.timeline-item,
.cta-feature-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.stat-item:hover,
.feature-item:hover,
.kanban-column-item:hover,
.task-item:hover,
.benefit-item:hover,
.timeline-item:hover,
.cta-feature-item:hover {
  border-color: #4a6cf7;
  box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
}

.stat-header,
.feature-header,
.kanban-column-item .column-header,
.task-header,
.benefit-header,
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.stat-header h4,
.feature-header h5,
.column-header h4,
.task-header h5,
.benefit-header h4,
.timeline-header h4 {
  margin: 0;
  color: #031358;
  font-size: 0.95rem;
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
    padding: 12px 20px;
    font-size: 0.9rem;
    justify-content: center;
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
</style>