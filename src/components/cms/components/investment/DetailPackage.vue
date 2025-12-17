<template>
  <div class="pricing-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Chi tiết - Gói góp vốn</h2>
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
        <i class="fas fa-cog"></i> Thông tin chung
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
          :class="{ active: activeTab === 'styles' }"
          @click="activeTab = 'styles'"
      >
        <i class="fas fa-palette"></i> Giao diện & Màu sắc
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'layout' }"
          @click="activeTab = 'layout'"
      >
        <i class="fas fa-ruler-combined"></i> Bố cục & Khoảng cách
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Thông tin chung -->
      <div v-if="activeTab === 'general'" class="general-settings">
        <div class="settings-grid">
          <!-- Thông tin tiêu đề -->
          <div class="setting-section">
            <h3><i class="fas fa-heading"></i> Tiêu đề & Nhãn</h3>

            <div class="form-group">
              <label for="section-title">Tiêu đề section</label>
              <input
                  type="text"
                  id="section-title"
                  v-model="content.texts.sectionTitle"
                  placeholder="CÁC GÓI GÓP VỐN"
              />
            </div>

            <div class="form-group">
              <label for="toggle-label">Nhãn toggle hiển thị số</label>
              <input
                  type="text"
                  id="toggle-label"
                  v-model="content.texts.toggleLabel"
                  placeholder="Hiển thị số: "
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="toggle-short">Text toggle ngắn</label>
                <input
                    type="text"
                    id="toggle-short"
                    v-model="content.texts.toggleFormatShort"
                    placeholder="Chữ viết"
                />
              </div>
              <div class="form-group">
                <label for="toggle-long">Text toggle dài</label>
                <input
                    type="text"
                    id="toggle-long"
                    v-model="content.texts.toggleFormatLong"
                    placeholder="Số nguyên"
                />
              </div>
            </div>
          </div>

          <!-- Tiêu đề bảng -->
          <div class="setting-section">
            <h3><i class="fas fa-table"></i> Tiêu đề bảng</h3>

            <div class="form-group" v-for="(header, index) in content.texts.tableHeaders" :key="index">
              <label :for="'table-header-' + index">Tiêu đề cột {{ index + 1 }}</label>
              <input
                  type="text"
                  :id="'table-header-' + index"
                  v-model="content.texts.tableHeaders[index]"
                  :placeholder="'Tiêu đề ' + (index + 1)"
              />
            </div>

            <button class="btn btn-secondary" @click="addTableHeader">
              <i class="fas fa-plus"></i> Thêm cột
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Lợi ích -->
      <div v-if="activeTab === 'benefits'" class="benefits-settings">
        <div class="benefits-header">
          <h3><i class="fas fa-gift"></i> Quản lý các lợi ích</h3>
          <button class="btn btn-primary" @click="addBenefit">
            <i class="fas fa-plus"></i> Thêm lợi ích mới
          </button>
        </div>

        <div class="benefits-list">
          <div
              v-for="(benefit, index) in content.benefits"
              :key="benefit.id || index"
              class="benefit-item"
              :class="{ 'editing': editingBenefit === index }"
          >
            <div class="benefit-header" @click="toggleBenefitEdit(index)">
              <div class="benefit-icon-preview">
                <i :class="benefit.icon"></i>
              </div>
              <div class="benefit-title-preview">
                <span>{{ benefit.title }}</span>
              </div>
              <div class="benefit-actions">
                <button class="btn-icon" @click.stop="moveBenefitUp(index)" :disabled="index === 0" title="Di chuyển lên">
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-icon" @click.stop="moveBenefitDown(index)"
                        :disabled="index === content.benefits.length - 1" title="Di chuyển xuống">
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button class="btn-icon btn-delete" @click.stop="removeBenefit(index)" title="Xóa lợi ích">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button class="btn-icon" @click.stop="toggleBenefitEdit(index)"
                        :title="editingBenefit === index ? 'Đóng chỉnh sửa' : 'Chỉnh sửa'">
                  <i :class="editingBenefit === index ? 'fas fa-chevron-up' : 'fas fa-edit'"></i>
                </button>
              </div>
            </div>

            <!-- Benefit Edit Form -->
            <div v-if="editingBenefit === index" class="benefit-edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label :for="'benefit-icon-' + index">Icon</label>
                  <IconPicker v-model="benefit.icon"/>
                  <small class="form-hint">VD: fa-chart-line, fa-shield-alt</small>
                </div>
              </div>

              <div class="form-group">
                <label :for="'benefit-title-' + index">Tiêu đề lợi ích</label>
                <input
                    type="text"
                    :id="'benefit-title-' + index"
                    v-model="benefit.title"
                    placeholder="Nhận lợi nhuận hấp dẫn theo từng gói"
                />
              </div>

              <div class="form-group">
                <div class="label" style="display: flex; justify-content: space-between">
                  <label :for="'benefit-content-' + index">Nội dung lợi ích</label>
                  <AdvancedEditModal
                      v-model="benefit.content"
                  ></AdvancedEditModal>
                </div>
                <div class="rich-text-editor-wrapper" style="
                margin-top: 10px;
                padding: 12px 16px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                background-color: white;
                ">
                  <div class="tiptap" v-html="benefit.content"></div>
                </div>
              </div>

              <div class="form-actions">
                <button class="btn btn-secondary" @click="toggleBenefitEdit(index)">
                  <i class="fas fa-times"></i> Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Giao diện & Màu sắc -->
      <div v-if="activeTab === 'styles'" class="styles-settings">
        <div class="settings-grid">
          <!-- Màu sắc chính -->
          <div class="setting-section">
            <h3><i class="fas fa-paint-brush"></i> Màu sắc chính</h3>

            <div class="color-input-group">
              <label>Gradient bắt đầu</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.gradientStart"/>
                <input type="text" v-model="content.colors.gradientStart" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Gradient kết thúc</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.gradientEnd"/>
                <input type="text" v-model="content.colors.gradientEnd" placeholder="#2a5298"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Nền lợi ích</label>
              <div class="color-input form-group">
                <input type="color" v-model="tempColors.benefitsBg" @input="updateBenefitsBg()"/>
                <input type="text" v-model="content.colors.benefitsBg" placeholder="rgba(240, 245, 255, 0.7)"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Viền thẻ</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.cardBorder"/>
                <input type="text" v-model="content.colors.cardBorder" placeholder="#0030ff"/>
              </div>
            </div>
          </div>

          <!-- Màu sắc phụ -->
          <div class="setting-section">
            <h3><i class="fas fa-palette"></i> Màu sắc phụ</h3>

            <div class="color-input-group">
              <label>Tiêu đề lợi ích</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.benefitTitle"/>
                <input type="text" v-model="content.colors.benefitTitle" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Icon</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.icon"/>
                <input type="text" v-model="content.colors.icon" placeholder="#2a5298"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Icon active</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.iconActive"/>
                <input type="text" v-model="content.colors.iconActive" placeholder="#031358"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu nút mở rộng</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.expandButton"/>
                <input type="text" v-model="content.colors.expandButton" placeholder="#2a5298"/>
              </div>
            </div>
          </div>

          <!-- Màu sắc bảng -->
          <div class="setting-section">
            <h3><i class="fas fa-table"></i> Màu sắc bảng</h3>

            <div class="color-input-group">
              <label>Nền bảng</label>
              <div class="color-input form-group">
                <input type="color" v-model="tempColors.tableBg" @input="updateTableBg()"/>
                <input type="text" v-model="content.colors.tableBg" placeholder="rgba(240, 245, 255, 0.7)"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Gradient header bắt đầu</label>
              <div class="color-input form-group">
                <input type="color" v-model="gradientColors.tableHeader.color1" @change="updateTableHeaderGradient()"/>
                <input type="color" v-model="gradientColors.tableHeader.color2" @change="updateTableHeaderGradient()"/>
                <input
                    type="text"
                    v-model="content.colors.tableHeaderGradientStart"
                    placeholder="#031358"
                    @input="updateTableHeaderColorsFromGradient()"
                />
                <input
                    type="text"
                    v-model="content.colors.tableHeaderGradientEnd"
                    placeholder="#2a5298"
                    @input="updateTableHeaderColorsFromGradient()"
                />
              </div>
            </div>

            <div class="color-input-group">
              <label>Viền bảng</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.tableBorder"/>
                <input type="text" v-model="content.colors.tableBorder" placeholder="#e2e8f0"/>
              </div>
            </div>

            <div class="color-input-group">
              <label>Màu chữ ô bảng</label>
              <div class="color-input form-group">
                <input type="color" v-model="content.colors.tableCell"/>
                <input type="text" v-model="content.colors.tableCell" placeholder="#031358"/>
              </div>
            </div>
          </div>

          <!-- Đổ bóng -->
          <div class="setting-section">
            <h3><i class="fas fa-box-shadow"></i> Đổ bóng</h3>

            <div class="form-group">
              <label for="benefits-shadow">Đổ bóng lợi ích</label>
              <div class="color-input">
                <input type="color" v-model="shadowColors.benefits.hex" @input="updateBenefitsShadowFromColor()"/>
                <input
                    type="text"
                    id="benefits-shadow"
                    v-model="content.shadows.benefits"
                    placeholder="0 4px 15px rgba(0, 0, 0, 0.1)"
                    @input="updateColorFromBenefitsShadow()"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="card-shadow">Đổ bóng thẻ</label>
              <div class="color-input">
                <input type="color" v-model="shadowColors.card.hex" @input="updateCardShadowFromColor()"/>
                <input
                    type="text"
                    id="card-shadow"
                    v-model="content.shadows.card"
                    placeholder="0 4px 12px rgba(3, 19, 88, 0.08)"
                    @input="updateColorFromCardShadow()"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="table-shadow">Đổ bóng bảng</label>
              <div class="color-input">
                <input type="color" v-model="shadowColors.table.hex" @input="updateTableShadowFromColor()"/>
                <input
                    type="text"
                    id="table-shadow"
                    v-model="content.shadows.table"
                    placeholder="0 4px 15px rgba(0, 0, 0, 0.1)"
                    @input="updateColorFromTableShadow()"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Bố cục & Khoảng cách -->
      <div v-if="activeTab === 'layout'" class="layout-settings">
        <div class="settings-grid">
          <!-- Kích thước -->
          <div class="setting-section">
            <h3><i class="fas fa-text-height"></i> Kích thước</h3>

            <div class="form-group">
              <label for="section-title-size">Cỡ chữ tiêu đề section</label>
              <div class="input-with-unit">
                <input type="text" id="section-title-size" v-model="content.sizes.sectionTitle" placeholder="33px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="benefit-title-size">Cỡ chữ tiêu đề lợi ích</label>
              <div class="input-with-unit">
                <input type="text" id="benefit-title-size" v-model="content.sizes.benefitTitle" placeholder="1.1rem"/>
                <span class="unit">rem</span>
              </div>
            </div>

            <div class="form-group">
              <label for="benefit-icon-size">Cỡ icon lợi ích</label>
              <div class="input-with-unit">
                <input type="text" id="benefit-icon-size" v-model="content.sizes.benefitIcon" placeholder="1.2rem"/>
                <span class="unit">rem</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="table-header-size">Cỡ chữ header bảng</label>
                <div class="input-with-unit">
                  <input type="text" id="table-header-size" v-model="content.sizes.tableHeader" placeholder="1.05rem"/>
                  <span class="unit">rem</span>
                </div>
              </div>
              <div class="form-group">
                <label for="table-cell-size">Cỡ chữ ô bảng</label>
                <div class="input-with-unit">
                  <input type="text" id="table-cell-size" v-model="content.sizes.tableCell" placeholder="1rem"/>
                  <span class="unit">rem</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Khoảng cách -->
          <div class="setting-section">
            <h3><i class="fas fa-arrows-alt-h"></i> Khoảng cách</h3>

            <div class="form-group">
              <label for="section-margin">Margin section</label>
              <input
                  type="text"
                  id="section-margin"
                  v-model="content.spacing.sectionMargin"
                  placeholder="40px auto"
              />
            </div>

            <div class="form-group">
              <label for="section-padding">Padding section</label>
              <input
                  type="text"
                  id="section-padding"
                  v-model="content.spacing.sectionPadding"
                  placeholder="0 20px"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="container-gap">Khoảng cách container</label>
                <div class="input-with-unit">
                  <input type="text" id="container-gap" v-model="content.spacing.containerGap" placeholder="30px"/>
                  <span class="unit">px</span>
                </div>
              </div>
              <div class="form-group">
                <label for="benefits-margin">Margin lợi ích</label>
                <div class="input-with-unit">
                  <input type="text" id="benefits-margin" v-model="content.spacing.benefitsMargin" placeholder="39px"/>
                  <span class="unit">px</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="benefits-padding">Padding lợi ích</label>
              <input
                  type="text"
                  id="benefits-padding"
                  v-model="content.spacing.benefitsPadding"
                  placeholder="25px 30px"
              />
            </div>
          </div>

          <!-- Bo góc -->
          <div class="setting-section">
            <h3><i class="fas fa-circle"></i> Bo góc</h3>

            <div class="form-group">
              <label for="benefits-radius">Bo góc cột lợi ích</label>
              <div class="input-with-unit">
                <input type="text" id="benefits-radius" v-model="content.borderRadius.benefitsColumn" placeholder="15px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="benefit-card-radius">Bo góc thẻ lợi ích</label>
              <div class="input-with-unit">
                <input type="text" id="benefit-card-radius" v-model="content.borderRadius.benefitCard" placeholder="10px"/>
                <span class="unit">px</span>
              </div>
            </div>

            <div class="form-group">
              <label for="table-radius">Bo góc bảng</label>
              <div class="input-with-unit">
                <input type="text" id="table-radius" v-model="content.borderRadius.investmentTable" placeholder="15px"/>
                <span class="unit">px</span>
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
import AdvancedEditModal from "../../../RichTextEditor/AdvancedEditModal.vue";
import IconPicker from "../../../RichTextEditor/IconPicker.vue";

// ========== STATE MANAGEMENT ==========
const activeTab = ref('general')
const isLoading = ref(false)
const editingBenefit = ref(null)

// Gradient colors state
const gradientColors = reactive({
  tableHeader: {
    color1: '#031358',
    color2: '#2a5298'
  }
})

// Shadow colors state
const shadowColors = reactive({
  benefits: {
    hex: '#000000',
    rgba: 'rgba(0, 0, 0, 0.1)'
  },
  card: {
    hex: '#031358',
    rgba: 'rgba(3, 19, 88, 0.08)'
  },
  table: {
    hex: '#000000',
    rgba: 'rgba(0, 0, 0, 0.1)'
  }
})

// Temp colors for rgba inputs
const tempColors = reactive({
  benefitsBg: '#f0f5ff',
  tableBg: '#f0f5ff'
})

// Files management (vẫn giữ cho FormData)
const files = ref([])

// Content structure based on JSON data
const content = reactive({
  texts: {
    sectionTitle: 'CÁC GÓI GÓP VỐN',
    toggleLabel: 'Hiển thị số: ',
    toggleFormatShort: 'Chữ viết',
    toggleFormatLong: 'Số nguyên',
    tableHeaders: [
      'Số tiền góp vốn (VNĐ)',
      'Gói đầu tư (VNĐ)',
      'Phần trăm gói (%)'
    ]
  },
  benefits: [
    {
      id: 1,
      title: 'Nhận lợi nhuận hấp dẫn theo từng gói',
      content: '<p>Nhà đầu tư được hưởng mức lợi nhuận cố định, tăng dần theo gói lựa chọn — từ <strong>1% đến 15%</strong> tùy số tiền góp vốn.</p><p>Lợi nhuận được chi trả đều đặn theo chu kỳ cam kết.</p>',
      icon: 'fa-chart-line'
    },
    {
      id: 2,
      title: 'Cam kết bảo toàn vốn',
      content: '<p>Số tiền góp vốn được đảm bảo theo điều khoản hợp đồng.</p><ul><li>Có thể rút vốn khi hết kỳ hạn.</li><li>Hỗ trợ rút vốn linh hoạt tùy chính sách.</li></ul>',
      icon: 'fa-shield-alt'
    },
    {
      id: 3,
      title: 'Minh bạch trong báo cáo tài chính',
      content: '<p>Nhà đầu tư được cung cấp báo cáo chi tiết theo định kỳ.</p><ul><li>Báo cáo doanh thu.</li><li>Báo cáo chi phí.</li><li>Báo cáo lợi nhuận.</li></ul>',
      icon: 'fa-file-invoice-dollar'
    },
    {
      id: 4,
      title: 'Quyền theo dõi hiệu quả đầu tư',
      content: '<p>Thông tin được cập nhật liên tục:</p><ul><li>Tổng vốn đã góp.</li><li>Lãi đã nhận.</li><li>Lãi dự kiến kỳ tới.</li><li>Hiệu suất theo tháng/quý.</li></ul>',
      icon: 'fa-chart-bar'
    },
    {
      id: 5,
      title: 'Chính sách ưu đãi & hỗ trợ linh hoạt',
      content: '<p>Nhà đầu tư được hưởng nhiều quyền lợi đặc biệt và hỗ trợ tối đa:</p><ul><li>Tham gia sự kiện nội bộ.</li><li>Ưu tiên dự án mới.</li><li>Cơ hội nâng cấp gói để nhận lãi cao hơn.</li><li>Hỗ trợ tư vấn 24/7: giải đáp thắc mắc, hướng dẫn gói đầu tư, tư vấn nâng lợi nhuận.</li><li>Linh hoạt chọn gói theo khả năng tài chính: từ 20 triệu đến 300 triệu, đầu tư nhiều gói cùng lúc.</li></ul>',
      icon: 'fa-award'
    },
    {
      id: 6,
      title: 'Hợp đồng pháp lý rõ ràng',
      content: '<p>Toàn bộ quá trình góp vốn và nhận lãi đều được thể hiện trong hợp đồng minh bạch.</p><ul><li>Cam kết quyền lợi.</li><li>Điều khoản rõ ràng.</li><li>Bảo đảm tính pháp lý.</li></ul>',
      icon: 'fa-file-contract'
    }
  ],
  colors: {
    gradientStart: '#031358',
    gradientEnd: '#2a5298',
    benefitsBg: 'rgba(240, 245, 255, 0.7)',
    cardBorder: '#0030ff',
    cardGradientStart: '#ffffff',
    cardGradientEnd: '#f0f7ff',
    benefitTitle: '#031358',
    icon: '#2a5298',
    iconActive: '#031358',
    expandButton: '#2a5298',
    contentText: '#031358',
    toggleLabel: '#031358',
    sliderBg: '#cbd5e1',
    sliderGradientStart: '#0030ff',
    sliderGradientEnd: '#2a5298',
    tableBg: 'rgba(240, 245, 255, 0.7)',
    tableHeaderGradientStart: '#031358',
    tableHeaderGradientEnd: '#2a5298',
    tableBorder: '#e2e8f0',
    tableRowEven: 'rgba(230, 240, 255, 0.5)',
    tableRowHover: 'rgba(219, 234, 254, 0.7)',
    tableCell: '#031358',
    highlightGradientStart: '#e6f0ff',
    highlightGradientEnd: '#dbeafe'
  },
  shadows: {
    benefits: '0 4px 15px rgba(0, 0, 0, 0.1)',
    card: '0 4px 12px rgba(3, 19, 88, 0.08)',
    cardHover: '0 6px 16px rgba(3, 19, 88, 0.12)',
    table: '0 4px 15px rgba(0, 0, 0, 0.1)'
  },
  sizes: {
    sectionTitle: '33px',
    benefitTitle: '1.1rem',
    benefitIcon: '1.2rem',
    expandBtn: '1.2rem',
    tableHeader: '1.05rem',
    tableCell: '1rem',
    toggleSwitchWidth: '50px',
    toggleSwitchHeight: '24px',
    sliderSize: '18px'
  },
  spacing: {
    sectionMargin: '40px auto',
    sectionPadding: '0 20px',
    containerGap: '30px',
    benefitsPadding: '25px 30px',
    benefitsMargin: '39px',
    benefitCardMargin: '15px',
    benefitHeaderPadding: '18px 20px',
    benefitContentPadding: '20px',
    tableHeaderPadding: '18px 15px',
    tableCellPadding: '18px 15px'
  },
  borderRadius: {
    sectionTitleLine: '2px',
    benefitsColumn: '15px',
    benefitCard: '10px',
    toggleSwitch: '24px',
    slider: '50%',
    investmentTable: '15px'
  },
  animations: {
    cardTransition: 'all 0.3s ease',
    contentTransition: 'max-height 0.3s ease, padding 0.3s ease',
    sliderTransition: '0.4s',
    numberEnter: '0.5s ease-out',
    numberLeave: '0.3s ease-in'
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
const SECTION_ID = 53

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

// ========== GRADIENT FUNCTIONS ==========
const updateTableHeaderGradient = () => {
  content.colors.tableHeaderGradientStart = gradientColors.tableHeader.color1
  content.colors.tableHeaderGradientEnd = gradientColors.tableHeader.color2
}

const updateTableHeaderColorsFromGradient = () => {
  gradientColors.tableHeader.color1 = content.colors.tableHeaderGradientStart
  gradientColors.tableHeader.color2 = content.colors.tableHeaderGradientEnd
}

// ========== SHADOW FUNCTIONS ==========
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return {r, g, b}
}

const parseShadowColor = (shadowStr) => {
  if (!shadowStr) return {hex: '#000000', rgba: 'rgba(0, 0, 0, 0.1)'}

  const rgbaMatch = shadowStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i)
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1])
    const g = parseInt(rgbaMatch[2])
    const b = parseInt(rgbaMatch[3])
    const opacity = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 0.1
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
    const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`
    return {hex, opacity, rgba}
  }
  return {hex: '#000000', rgba: 'rgba(0, 0, 0, 0.1)'}
}

const updateBenefitsShadowFromColor = () => {
  const shadowRegex = /([\d.-]+px\s+){3,4}/
  const match = content.shadows.benefits.match(shadowRegex)
  const rgb = hexToRgb(shadowColors.benefits.hex)
  const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`

  if (match) {
    content.shadows.benefits = `${match[0].trim()} ${newRgba}`
  } else {
    content.shadows.benefits = `0 4px 15px ${newRgba}`
  }
  shadowColors.benefits.rgba = newRgba
}

const updateColorFromBenefitsShadow = () => {
  const parsed = parseShadowColor(content.shadows.benefits)
  shadowColors.benefits.hex = parsed.hex
  shadowColors.benefits.rgba = parsed.rgba
}

const updateCardShadowFromColor = () => {
  const shadowRegex = /([\d.-]+px\s+){3,4}/
  const match = content.shadows.card.match(shadowRegex)
  const rgb = hexToRgb(shadowColors.card.hex)
  const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`

  if (match) {
    content.shadows.card = `${match[0].trim()} ${newRgba}`
  } else {
    content.shadows.card = `0 4px 12px ${newRgba}`
  }
  shadowColors.card.rgba = newRgba
}

const updateColorFromCardShadow = () => {
  const parsed = parseShadowColor(content.shadows.card)
  shadowColors.card.hex = parsed.hex
  shadowColors.card.rgba = parsed.rgba
}

const updateTableShadowFromColor = () => {
  const shadowRegex = /([\d.-]+px\s+){3,4}/
  const match = content.shadows.table.match(shadowRegex)
  const rgb = hexToRgb(shadowColors.table.hex)
  const newRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`

  if (match) {
    content.shadows.table = `${match[0].trim()} ${newRgba}`
  } else {
    content.shadows.table = `0 4px 15px ${newRgba}`
  }
  shadowColors.table.rgba = newRgba
}

const updateColorFromTableShadow = () => {
  const parsed = parseShadowColor(content.shadows.table)
  shadowColors.table.hex = parsed.hex
  shadowColors.table.rgba = parsed.rgba
}

// ========== RGBA COLOR FUNCTIONS ==========
const hexToRgba = (hex, opacity = 0.7) => {
  hex = hex.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const rgbaToHex = (rgba) => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i)
  if (match) {
    const r = parseInt(match[1])
    const g = parseInt(match[2])
    const b = parseInt(match[3])
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
  return '#f0f5ff'
}

const updateBenefitsBg = () => {
  content.colors.benefitsBg = hexToRgba(tempColors.benefitsBg, 0.7)
}

const updateTableBg = () => {
  content.colors.tableBg = hexToRgba(tempColors.tableBg, 0.7)
}

// ========== BENEFIT MANAGEMENT ==========
const addBenefit = () => {
  const newId = Date.now()

  content.benefits.push({
    id: newId,
    title: 'Lợi ích mới',
    content: '<p>Nhập nội dung lợi ích...</p>',
    icon: 'fa-plus-circle'
  })

  editingBenefit.value = content.benefits.length - 1
  showToast('Đã thêm lợi ích mới', 'success')
}

const removeBenefit = (index) => {
  if (confirm('Bạn có chắc chắn muốn xóa lợi ích này?')) {
    content.benefits.splice(index, 1)

    if (editingBenefit.value === index) {
      editingBenefit.value = null
    } else if (editingBenefit.value > index) {
      editingBenefit.value--
    }

    showToast('Đã xóa lợi ích', 'success')
  }
}

const moveBenefitUp = (index) => {
  if (index > 0) {
    const temp = content.benefits[index]
    content.benefits[index] = content.benefits[index - 1]
    content.benefits[index - 1] = temp

    if (editingBenefit.value === index) {
      editingBenefit.value = index - 1
    } else if (editingBenefit.value === index - 1) {
      editingBenefit.value = index
    }
  }
}

const moveBenefitDown = (index) => {
  if (index < content.benefits.length - 1) {
    const temp = content.benefits[index]
    content.benefits[index] = content.benefits[index + 1]
    content.benefits[index + 1] = temp

    if (editingBenefit.value === index) {
      editingBenefit.value = index + 1
    } else if (editingBenefit.value === index + 1) {
      editingBenefit.value = index
    }
  }
}

const toggleBenefitEdit = (index) => {
  editingBenefit.value = editingBenefit.value === index ? null : index
}

// ========== TABLE HEADER MANAGEMENT ==========
const addTableHeader = () => {
  content.texts.tableHeaders.push(`Tiêu đề mới ${content.texts.tableHeaders.length + 1}`)
  showToast('Đã thêm cột mới', 'success')
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
      gradientColors.tableHeader.color1 = content.colors.tableHeaderGradientStart
      gradientColors.tableHeader.color2 = content.colors.tableHeaderGradientEnd

      // Initialize shadow colors
      const benefitsShadow = parseShadowColor(content.shadows.benefits)
      shadowColors.benefits.hex = benefitsShadow.hex
      shadowColors.benefits.rgba = benefitsShadow.rgba

      const cardShadow = parseShadowColor(content.shadows.card)
      shadowColors.card.hex = cardShadow.hex
      shadowColors.card.rgba = cardShadow.rgba

      const tableShadow = parseShadowColor(content.shadows.table)
      shadowColors.table.hex = tableShadow.hex
      shadowColors.table.rgba = tableShadow.rgba

      // Initialize temp colors for rgba inputs
      tempColors.benefitsBg = rgbaToHex(content.colors.benefitsBg)
      tempColors.tableBg = rgbaToHex(content.colors.tableBg)

      // Handle files from API response (vẫn giữ cho FormData)
      if (response.data.files && response.data.files.length > 0) {
        files.value = response.data.files.map(file => ({
          id: file.id,
          filename: file.filename || file.realFilenameForSearch || '',
          status: 'EXISTING'
        }))
      } else {
        files.value = []
      }

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

    // Filter files to send only changed ones
    const filesToSend = files.value.filter(file => file.status !== 'EXISTING')

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: content.texts.sectionTitle,
      contentJson: JSON.stringify(content, null, 2),
      sortOrder: 1,
      files: filesToSend
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

      // Update file statuses
      files.value.forEach(file => {
        if (file.status === 'NEW') {
          file.status = 'EXISTING'
          if (response.data.files) {
            const savedFile = response.data.files.find(f => f.filename === file.filename)
            if (savedFile) {
              file.id = savedFile.id
            }
          }
        } else if (file.status === 'REMOVE') {
          const index = files.value.findIndex(f => f.id === file.id)
          if (index !== -1) {
            files.value.splice(index, 1)
          }
        }
      })

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

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Tất cả CSS giữ nguyên từ component gốc */
/* ... (giữ nguyên toàn bộ CSS) ... */

/* Thêm một số style cho benefits */
.benefits-settings {
  padding: 20px;
}

.benefits-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.benefits-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.benefit-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.benefit-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.benefit-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.benefit-header:hover {
  background-color: #e9ecef;
}

.benefit-icon-preview {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.benefit-title-preview {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.benefit-actions {
  display: flex;
  gap: 8px;
}

.benefit-edit-form {
  padding: 20px;
  border-top: 1px solid #e9ecef;
  background-color: #f8f9ff;
}

/* Layout settings */
.layout-settings .settings-grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

/* Gradient colors input specific */
.color-input input[type="text"]:nth-child(3),
.color-input input[type="text"]:nth-child(4) {
  width: 48%;
}
.pricing-editor {
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

/* Steps Management */
.steps-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.steps-header h3 {
  margin: 0;
  color: #031358;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step-item {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.step-item.editing {
  border-color: #4a6cf7;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.step-header:hover {
  background-color: #e9ecef;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a6cf7 0%, #6a8cff 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.step-title-preview {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.step-title-preview i {
  color: #4a6cf7;
  width: 20px;
}

.step-actions {
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

.step-edit-form {
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

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
}

.settings-grid > .setting-section:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .settings-grid > .setting-section:last-child:nth-child(odd) {
    max-width: 100%;
  }
}

@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-grid > .setting-section:last-child:nth-child(odd) {
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

.form-hint {
  display: block;
  margin-top: 5px;
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

.color-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.color-input input[type="color"] {
  width: 50px;
  height: 40px;
  padding: 0;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.color-input input[type="text"] {
  flex: 1;
}

/* Input with Unit */
.input-with-unit {
  position: relative;
}

.input-with-unit input {
  padding-right: 50px;
  width: 100%;
}

.input-with-unit .unit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 0.85rem;
  pointer-events: none;
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
@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
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

  .steps-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .step-header {
    flex-wrap: wrap;
  }

  .step-actions {
    margin-left: auto;
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

  .color-input {
    flex-wrap: wrap;
  }

  .color-input input[type="color"] {
    width: 40px;
    height: 35px;
  }

  .color-input input[type="text"] {
    min-width: 100px;
  }

  .step-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .step-actions {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}

/* Gradient Colors */
.gradient-colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 10px;
}

.color-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.color-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 3px;
}

.gradient-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  background-color: white;
  transition: all 0.3s ease;
}

.gradient-input:focus {
  border-color: #4a6cf7;
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
}

/* Shadow Color */
.shadow-color-input {
  margin-bottom: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .gradient-colors {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>