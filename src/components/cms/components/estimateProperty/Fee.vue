<template>
  <div class="pricing-guide-editor">
    <!-- Header -->
    <div class="editor-header">
      <h2>Quản lý Bảng giá & HDSD</h2>
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
          :class="{ active: activeTab === 'config' }"
          @click="activeTab = 'config'"
      >
        <i class="fas fa-cog"></i> Cấu hình Trang
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'fees' }"
          @click="activeTab = 'fees'"
      >
        <i class="fas fa-table"></i> Bảng giá
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'guide' }"
          @click="activeTab = 'guide'"
      >
        <i class="fas fa-book"></i> Hướng dẫn
      </button>
      <button
          class="tab-button"
          :class="{ active: activeTab === 'style' }"
          @click="activeTab = 'style'"
      >
        <i class="fas fa-palette"></i> Giao diện
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="tab-content">
      <!-- Tab Cấu hình Trang -->
      <div v-if="activeTab === 'config'" class="config-settings">
        <div class="settings-grid">
          <div class="setting-section full-width">
            <h3><i class="fas fa-file-alt"></i> Cấu hình trang</h3>

            <div class="form-group">
              <label for="page-title">Tiêu đề trang</label>
              <input
                  type="text"
                  id="page-title"
                  v-model="content.pageConfig.title"
                  placeholder="Biểu phí định giá sơ bộ"
              />
            </div>

            <div class="form-group">
              <label>Màu nền gradient</label>
              <div class="gradient-input-group">
                <input type="color" v-model="backgroundFromColor" @change="updateBackgroundGradient" />
                <input type="color" v-model="backgroundToColor" @change="updateBackgroundGradient" />
                <input
                    type="text"
                    v-model="content.pageConfig.backgroundGradient"
                    placeholder="linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="login-link">Link đăng nhập</label>
              <input
                  type="text"
                  id="login-link"
                  v-model="content.links.login"
                  placeholder="/login-user"
              />
            </div>

            <div class="form-group">
              <label for="valuation-link">Link định giá</label>
              <input
                  type="text"
                  id="valuation-link"
                  v-model="content.links.valuation"
                  placeholder="/valuation"
              />
            </div>

            <div class="form-group">
              <label for="default-value">Giá trị mặc định (tỷ đồng)</label>
              <input
                  type="number"
                  id="default-value"
                  v-model.number="content.defaultValues.currentValue"
                  step="0.1"
                  min="1"
                  max="200"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Bảng giá -->
      <div v-if="activeTab === 'fees'" class="fees-settings">
        <div class="settings-grid">
          <div class="setting-section full-width">
            <h3><i class="fas fa-money-bill-wave"></i> Quản lý bảng giá</h3>

            <div class="table-controls">
              <button class="btn btn-secondary btn-sm" @click="addFeeRate">
                <i class="fas fa-plus"></i> Thêm mức giá
              </button>
            </div>

            <div class="fee-rates-table">
              <table>
                <thead>
                <tr>
                  <th>STT</th>
                  <th>Giá trị tối thiểu (tỷ)</th>
                  <th>Giá trị tối đa (tỷ)</th>
                  <th>Hiển thị</th>
                  <th>Phí (VNĐ)</th>
                  <th>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(rate, index) in content.feeRates" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <input
                        type="number"
                        v-model.number="rate.min"
                        step="1"
                        min="0"
                        class="table-input"
                    />
                  </td>
                  <td>
                    <input
                        type="number"
                        v-model.number="rate.max"
                        step="1"
                        min="0"
                        class="table-input"
                        placeholder="Để trống nếu không giới hạn"
                    />
                  </td>
                  <td>
                    <input
                        type="text"
                        v-model="rate.desiredValue"
                        class="table-input"
                        placeholder="1 - 3 tỷ"
                    />
                  </td>
                  <td>
                    <input
                        type="number"
                        v-model.number="rate.fee"
                        step="10000"
                        min="0"
                        class="table-input"
                    />
                  </td>
                  <td>
                    <div class="table-actions">
                      <button
                          class="btn-icon btn-sm"
                          @click="moveRateUp(index)"
                          :disabled="index === 0"
                      >
                        <i class="fas fa-arrow-up"></i>
                      </button>
                      <button
                          class="btn-icon btn-sm"
                          @click="moveRateDown(index)"
                          :disabled="index === content.feeRates.length - 1"
                      >
                        <i class="fas fa-arrow-down"></i>
                      </button>
                      <button
                          class="btn-icon btn-sm btn-danger"
                          @click="removeFeeRate(index)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <div class="form-group">
              <label>Tổng số mức giá: {{ content.feeRates.length }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Hướng dẫn -->
      <div v-if="activeTab === 'guide'" class="guide-settings">
        <div class="settings-grid">
          <div class="setting-section full-width">
            <h3><i class="fas fa-graduation-cap"></i> Hướng dẫn sử dụng</h3>

            <div class="form-group">
              <label for="guide-title">Tiêu đề hướng dẫn</label>
              <input
                  type="text"
                  id="guide-title"
                  v-model="content.guideConfig.title"
                  placeholder="Hướng dẫn sử dụng công cụ định giá"
              />
            </div>

            <div class="table-controls">
              <button class="btn btn-secondary btn-sm" @click="addStep">
                <i class="fas fa-plus"></i> Thêm bước
              </button>
            </div>

            <div class="steps-container">
              <div v-for="(step, index) in content.guideConfig.steps" :key="index" class="step-card">
                <div class="step-header">
                  <h4>Bước {{ index + 1 }}</h4>
                  <div class="step-actions">
                    <button
                        class="btn-icon btn-sm"
                        @click="moveStepUp(index)"
                        :disabled="index === 0"
                    >
                      <i class="fas fa-arrow-up"></i>
                    </button>
                    <button
                        class="btn-icon btn-sm"
                        @click="moveStepDown(index)"
                        :disabled="index === content.guideConfig.steps.length - 1"
                    >
                      <i class="fas fa-arrow-down"></i>
                    </button>
                    <button
                        class="btn-icon btn-sm btn-danger"
                        @click="removeStep(index)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label>Số thứ tự</label>
                  <input
                      type="text"
                      v-model="step.number"
                      placeholder="Bước 1"
                  />
                </div>

                <div class="form-group">
                  <label>Tiêu đề bước</label>
                  <input
                      type="text"
                      v-model="step.title"
                      placeholder="Đăng ký tài khoản chủ nhà"
                  />
                </div>

                <div class="form-group">
                  <label>Hành động (tùy chọn)</label>
                  <input
                      type="text"
                      v-model="step.action"
                      placeholder="Điền form thông tin và cung cấp hình ảnh, giấy tờ cần thiết"
                  />
                </div>

                <div class="form-group">
                  <label>Chi tiết</label>
                  <textarea
                      v-model="step.detail"
                      rows="3"
                      placeholder="Quá trình đăng ký đơn giản, chỉ cần cung cấp email, số điện thoại và thông tin cá nhân cơ bản."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Giao diện -->
      <div v-if="activeTab === 'style'" class="style-settings">
        <div class="settings-grid">
          <!-- Bảng giá -->
          <div class="setting-section full-width">
            <h3><i class="fas fa-table"></i> Giao diện bảng giá</h3>

            <div class="form-group">
              <label>Gradient header</label>
              <div class="gradient-input-group">
                <input type="color" v-model="headerFromColor" @change="updateHeaderGradient" />
                <input type="color" v-model="headerToColor" @change="updateHeaderGradient" />
                <input
                    type="text"
                    v-model="content.styleConfig.table.headerGradient"
                    placeholder="linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Màu chữ header</label>
              <div class="single-color-input">
                <input type="color" :value="getColorWithoutOpacity(content.styleConfig.table.headerTextColor)" @input="updateHeaderTextColor($event.target.value)" />
                <input type="text" v-model="content.styleConfig.table.headerTextColor" placeholder="#ffffff" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Màu hàng chẵn</label>
                <div class="single-color-input">
                  <input type="color" :value="getColorWithoutOpacity(content.styleConfig.table.evenRowBgColor)" @input="updateEvenRowBgColor($event.target.value)" />
                  <input type="text" v-model="content.styleConfig.table.evenRowBgColor" placeholder="#f8fafc" />
                </div>
              </div>
              <div class="form-group">
                <label>Màu hàng lẻ</label>
                <div class="single-color-input">
                  <input type="color" :value="getColorWithoutOpacity(content.styleConfig.table.oddRowBgColor)" @input="updateOddRowBgColor($event.target.value)" />
                  <input type="text" v-model="content.styleConfig.table.oddRowBgColor" placeholder="#ffffff" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Gradient hàng active</label>
              <div class="gradient-input-group">
                <input type="color" v-model="activeFromColor" @change="updateActiveGradient" />
                <input type="color" v-model="activeToColor" @change="updateActiveGradient" />
                <input
                    type="text"
                    v-model="content.styleConfig.table.activeGradient"
                    placeholder="linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Màu border active</label>
                <div class="single-color-input">
                  <input type="color" :value="getColorWithoutOpacity(content.styleConfig.table.activeBorderColor)" @input="updateActiveBorderColor($event.target.value)" />
                  <input type="text" v-model="content.styleConfig.table.activeBorderColor" placeholder="#3b82f6" />
                </div>
              </div>
              <div class="form-group">
                <label>Màu border hover</label>
                <div class="single-color-input">
                  <input type="color" :value="getColorWithoutOpacity(content.styleConfig.table.hoverBorderColor)" @input="updateHoverBorderColor($event.target.value)" />
                  <input type="text" v-model="content.styleConfig.table.hoverBorderColor" placeholder="#60a5fa" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Màu shadow active</label>
              <div class="single-color-input">
                <input type="color" :value="getColorWithoutOpacity(content.styleConfig.table.activeShadowColor)" @input="updateActiveShadowColor($event.target.value)" />
                <input type="text" v-model="content.styleConfig.table.activeShadowColor" placeholder="rgba(59, 130, 246, 0.2)" />
              </div>
            </div>
          </div>

          <!-- Hướng dẫn -->
          <div class="setting-section full-width">
            <h3><i class="fas fa-book"></i> Giao diện hướng dẫn</h3>

            <div class="form-group">
              <label>Gradient số bước</label>
              <div class="gradient-input-group">
                <input type="color" v-model="stepFromColor" @change="updateStepGradient" />
                <input type="color" v-model="stepToColor" @change="updateStepGradient" />
                <input
                    type="text"
                    v-model="content.styleConfig.guide.stepNumberGradient"
                    placeholder="linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Màu chữ số bước</label>
              <div class="single-color-input">
                <input type="color" :value="getColorWithoutOpacity(content.styleConfig.guide.stepNumberTextColor)" @input="updateStepNumberTextColor($event.target.value)" />
                <input type="text" v-model="content.styleConfig.guide.stepNumberTextColor" placeholder="#ffffff" />
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
import { ref, reactive, onMounted } from 'vue'
import api from '../../../../api/api.js'

// ========== STATE MANAGEMENT ==========
const activeTab = ref('config')
const isLoading = ref(false)

// Extract gradient colors for color pickers
const backgroundFromColor = ref('#f0f8ff')
const backgroundToColor = ref('#e6f3ff')
const headerFromColor = ref('#1e3a8a')
const headerToColor = ref('#3b82f6')
const activeFromColor = ref('#dbeafe')
const activeToColor = ref('#eff6ff')
const stepFromColor = ref('#1e3a8a')
const stepToColor = ref('#3b82f6')

// Content structure based on JSON data
const content = reactive({
  pageConfig: {
    title: 'Biểu phí định giá sơ bộ',
    backgroundGradient: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)'
  },
  feeRates: [
    {
      min: 1,
      max: 3,
      desiredValue: '1 - 3 tỷ',
      fee: 250000
    },
    {
      min: 3,
      max: 5,
      desiredValue: '3 - 5 tỷ',
      fee: 300000
    },
    {
      min: 5,
      max: 7,
      desiredValue: '5 - 7 tỷ',
      fee: 350000
    },
    {
      min: 7,
      max: 10,
      desiredValue: '7 - 10 tỷ',
      fee: 400000
    },
    {
      min: 10,
      max: 15,
      desiredValue: '10 - 15 tỷ',
      fee: 450000
    },
    {
      min: 15,
      max: 20,
      desiredValue: '15 - 20 tỷ',
      fee: 450000
    },
    {
      min: 20,
      max: 30,
      desiredValue: '20 - 30 tỷ',
      fee: 500000
    },
    {
      min: 30,
      max: 50,
      desiredValue: '30 - 50 tỷ',
      fee: 550000
    },
    {
      min: 50,
      max: 100,
      desiredValue: '50 - 100 tỷ',
      fee: 1200000
    },
    {
      min: 100,
      max: null,
      desiredValue: '> 100 tỷ',
      fee: 1500000
    }
  ],
  guideConfig: {
    title: 'Hướng dẫn sử dụng công cụ định giá',
    steps: [
      {
        number: 'Bước 1',
        title: 'Đăng ký tài khoản chủ nhà',
        detail: 'Quá trình đăng ký đơn giản, chỉ cần cung cấp email, số điện thoại và thông tin cá nhân cơ bản.'
      },
      {
        number: 'Bước 2',
        title: 'Truy cập trang định giá',
        detail: 'Giao diện thân thiện, dễ sử dụng với các bước hướng dẫn rõ ràng và xem trước biểu phí.'
      },
      {
        number: 'Bước 3',
        title: 'Thêm thông tin tài sản',
        action: 'Điền form thông tin và cung cấp hình ảnh, giấy tờ cần thiết',
        detail: 'Chuẩn bị sẵn giấy chứng nhận quyền sử dụng đất, sổ đỏ, hình ảnh tài sản từ nhiều góc độ.'
      },
      {
        number: 'Bước 4',
        title: 'Kiểm tra thông tin',
        action: 'Xác nhận lại thông tin cá nhân và địa chỉ email',
        detail: 'Kiểm tra kỹ thông tin liên hệ, đặc biệt là email vì kết quả sẽ được gửi đến địa chỉ này.'
      },
      {
        number: 'Bước 5',
        title: 'Thanh toán phí dịch vụ',
        action: 'Thanh toán trực tuyến bằng QR code hoặc tại văn phòng',
        detail: 'Hỗ trợ đa dạng phương thức: chuyển khoản, ví điện tử, thẻ tín dụng và QR code tiện lợi.'
      },
      {
        number: 'Bước 6',
        title: 'Nhận kết quả định giá',
        action: 'Theo dõi email hoặc truy cập website để nhận kết quả',
        detail: 'Thời gian xử lý 3-5 ngày, kết quả bao gồm báo cáo chi tiết và có thể tải về bản PDF.'
      }
    ]
  },
  styleConfig: {
    table: {
      headerGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      headerTextColor: '#ffffff',
      evenRowBgColor: '#f8fafc',
      oddRowBgColor: '#ffffff',
      activeGradient: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
      activeBorderColor: '#3b82f6',
      hoverBorderColor: '#60a5fa',
      activeShadowColor: 'rgba(59, 130, 246, 0.2)'
    },
    guide: {
      stepNumberGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      stepNumberTextColor: '#ffffff'
    }
  },
  links: {
    login: '/login-user',
    valuation: '/valuation'
  },
  defaultValues: {
    currentValue: 5,
    expandedSteps: [false, false, false, false, false, false]
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
const SECTION_ID = 33

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

const extractGradientColors = (gradient) => {
  if (!gradient) return { from: '#f0f8ff', to: '#e6f3ff' }

  const matches = gradient.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g)
  if (matches && matches.length >= 2) {
    return { from: matches[0], to: matches[1] }
  }
  return { from: '#f0f8ff', to: '#e6f3ff' }
}

// Helper function to extract hex color from rgba/rgb string
const getColorWithoutOpacity = (colorString) => {
  if (!colorString) return '#000000'

  // If it's a hex color
  if (colorString.startsWith('#')) {
    return colorString
  }

  // If it's rgb/rgba color
  const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1])
    const g = parseInt(rgbMatch[2])
    const b = parseInt(rgbMatch[3])

    // Convert to hex
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  return '#000000'
}

const updateBackgroundGradient = () => {
  content.pageConfig.backgroundGradient = `linear-gradient(135deg, ${backgroundFromColor.value} 0%, ${backgroundToColor.value} 100%)`
}

const updateHeaderGradient = () => {
  content.styleConfig.table.headerGradient = `linear-gradient(135deg, ${headerFromColor.value} 0%, ${headerToColor.value} 100%)`
}

const updateActiveGradient = () => {
  content.styleConfig.table.activeGradient = `linear-gradient(135deg, ${activeFromColor.value} 0%, ${activeToColor.value} 100%)`
}

const updateStepGradient = () => {
  content.styleConfig.guide.stepNumberGradient = `linear-gradient(135deg, ${stepFromColor.value} 0%, ${stepToColor.value} 100%)`
}

// Color update functions for single colors with opacity support
const updateHeaderTextColor = (hexColor) => {
  content.styleConfig.table.headerTextColor = hexColor
}

const updateEvenRowBgColor = (hexColor) => {
  content.styleConfig.table.evenRowBgColor = hexColor
}

const updateOddRowBgColor = (hexColor) => {
  content.styleConfig.table.oddRowBgColor = hexColor
}

const updateActiveBorderColor = (hexColor) => {
  content.styleConfig.table.activeBorderColor = hexColor
}

const updateHoverBorderColor = (hexColor) => {
  content.styleConfig.table.hoverBorderColor = hexColor
}

const updateActiveShadowColor = (hexColor) => {
  // Keep the opacity if it was rgba, otherwise use default opacity
  const oldColor = content.styleConfig.table.activeShadowColor
  if (oldColor && oldColor.startsWith('rgba')) {
    const opacityMatch = oldColor.match(/rgba?\([^)]+,\s*([^)]+)\)/)
    const opacity = opacityMatch ? opacityMatch[1] : '0.2'

    // Convert hex to rgb
    const hex = hexColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)

    content.styleConfig.table.activeShadowColor = `rgba(${r}, ${g}, ${b}, ${opacity})`
  } else {
    content.styleConfig.table.activeShadowColor = hexColor
  }
}

const updateStepNumberTextColor = (hexColor) => {
  content.styleConfig.guide.stepNumberTextColor = hexColor
}

// Fee rates management
const addFeeRate = () => {
  const lastRate = content.feeRates[content.feeRates.length - 1]
  const newMin = lastRate.max || lastRate.min + 1
  const newMax = newMin + 1

  content.feeRates.push({
    min: newMin,
    max: newMax,
    desiredValue: `${newMin} - ${newMax} tỷ`,
    fee: 500000
  })

  showToast('Đã thêm mức giá mới', 'success')
}

const removeFeeRate = (index) => {
  if (content.feeRates.length <= 1) {
    showToast('Phải có ít nhất một mức giá', 'warning')
    return
  }

  content.feeRates.splice(index, 1)
  showToast('Đã xóa mức giá', 'success')
}

const moveRateUp = (index) => {
  if (index > 0) {
    const temp = content.feeRates[index]
    content.feeRates[index] = content.feeRates[index - 1]
    content.feeRates[index - 1] = temp
  }
}

const moveRateDown = (index) => {
  if (index < content.feeRates.length - 1) {
    const temp = content.feeRates[index]
    content.feeRates[index] = content.feeRates[index + 1]
    content.feeRates[index + 1] = temp
  }
}

// Steps management
const addStep = () => {
  const stepNumber = content.guideConfig.steps.length + 1
  content.guideConfig.steps.push({
    number: `Bước ${stepNumber}`,
    title: 'Bước mới',
    detail: 'Chi tiết bước hướng dẫn',
    action: ''
  })

  // Also add to expandedSteps
  content.defaultValues.expandedSteps.push(false)

  showToast('Đã thêm bước hướng dẫn mới', 'success')
}

const removeStep = (index) => {
  if (content.guideConfig.steps.length <= 1) {
    showToast('Phải có ít nhất một bước', 'warning')
    return
  }

  content.guideConfig.steps.splice(index, 1)
  content.defaultValues.expandedSteps.splice(index, 1)
  showToast('Đã xóa bước hướng dẫn', 'success')
}

const moveStepUp = (index) => {
  if (index > 0) {
    const temp = content.guideConfig.steps[index]
    content.guideConfig.steps[index] = content.guideConfig.steps[index - 1]
    content.guideConfig.steps[index - 1] = temp
  }
}

const moveStepDown = (index) => {
  if (index < content.guideConfig.steps.length - 1) {
    const temp = content.guideConfig.steps[index]
    content.guideConfig.steps[index] = content.guideConfig.steps[index + 1]
    content.guideConfig.steps[index + 1] = temp
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

      // Extract gradient colors
      const bgColors = extractGradientColors(content.pageConfig.backgroundGradient)
      backgroundFromColor.value = bgColors.from
      backgroundToColor.value = bgColors.to

      const headerColors = extractGradientColors(content.styleConfig?.table?.headerGradient)
      headerFromColor.value = headerColors.from
      headerToColor.value = headerColors.to

      const activeColors = extractGradientColors(content.styleConfig?.table?.activeGradient)
      activeFromColor.value = activeColors.from
      activeToColor.value = activeColors.to

      const stepColors = extractGradientColors(content.styleConfig?.guide?.stepNumberGradient)
      stepFromColor.value = stepColors.from
      stepToColor.value = stepColors.to

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

    // Prepare section data
    const sectionData = {
      id: SECTION_ID,
      name: 'Bảng giá & HDSD',
      contentJson: JSON.stringify(content, null, 2),
      sortOrder: 5,
      files: []
    }

    // Send to API
    const response = await api.post('/cms/saveChange', sectionData)

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

// ========== LIFECYCLE HOOKS ==========
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.pricing-guide-editor {
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
  grid-template-columns: 1fr;
  gap: 30px;
}

.setting-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

/* Full width section for single sections */
.setting-section.full-width {
  grid-column: 1 / -1;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Gradient Input Group */
.gradient-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.gradient-input-group input[type="color"] {
  width: 60px;
  height: 40px;
  padding: 0;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.gradient-input-group input[type="text"] {
  flex: 1;
}

/* Single Color Input (with opacity support) */
.single-color-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.single-color-input input[type="color"] {
  width: 60px;
  height: 40px;
  padding: 0;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.single-color-input input[type="text"] {
  flex: 1;
}

/* Fee Rates Table */
.table-controls {
  margin-bottom: 20px;
}

.fee-rates-table {
  overflow-x: auto;
  margin-bottom: 20px;
}

.fee-rates-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fee-rates-table th {
  background-color: #f8f9fa;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
}

.fee-rates-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.fee-rates-table tr:hover {
  background-color: #f8f9ff;
}

.table-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
}

.table-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* Steps Container */
.steps-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 10px;
}

.step-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f8f9fa;
}

.step-header h4 {
  margin: 0;
  color: #031358;
  font-size: 1.1rem;
}

.step-actions {
  display: flex;
  gap: 8px;
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
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.85rem;
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

.btn-danger {
  background: linear-gradient(135deg, #dc3545 0%, #e4606d 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #c82333 0%, #d9534f 100%);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
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
  transform: scale(1.05);
}

.btn-icon.btn-danger:hover:not(:disabled) {
  background-color: #dc3545;
  color: white;
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
@media (max-width: 992px) {
  .settings-grid {
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

  .fee-rates-table {
    font-size: 0.9rem;
  }

  .table-actions {
    flex-direction: column;
    gap: 5px;
  }

  .step-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .step-actions {
    align-self: flex-end;
  }

  /* Responsive for gradient and color inputs */
  .gradient-input-group,
  .single-color-input {
    flex-direction: column;
    align-items: stretch;
  }

  .gradient-input-group input[type="color"],
  .single-color-input input[type="color"] {
    width: 100%;
    height: 45px;
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