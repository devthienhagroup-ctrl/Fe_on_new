<template>
  <div class="color-picker-wrapper">
    <!-- Preview và nút chọn màu -->
    <div class="color-preview-container">
      <div
          class="color-preview"
          :style="{
          backgroundColor: previewColor,
          borderColor: getBorderColor(previewColor)
        }"
          @click="openModal"
      ></div>
      <input
          type="text"
          :value="displayValue"
          readonly
          class="color-value-input"
          :title="displayValue"
          @click="openModal"
      />
      <button
          @click="openModal"
          class="color-picker-button"
          :disabled="isLoading"
      >
        <span v-if="!isLoading">Chọn màu</span>
        <span v-else class="loading-spinner">...</span>
      </button>
    </div>

    <!-- Modal chọn màu -->
    <Teleport to="body" v-if="showModal">
      <div class="color-picker-modal">
        <div class="modal-overlay" @click="showModal = false"></div>
        <div class="modal-content">
          <!-- Header modal -->
          <div class="modal-header">
            <h3>Chọn màu</h3>
            <button @click="showModal = false" class="close-button">×</button>
          </div>

          <!-- Current selection preview -->
          <div class="current-selection" v-if="previewColor">
            <div class="current-color-preview" :style="{ backgroundColor: previewColor }"></div>
            <div class="current-color-info">
              <div class="current-color-label" v-if="isColorKey(props.modelValue)">
                {{ props.modelValue }}
              </div>
              <div class="current-color-value">
                {{ displayValue }}
              </div>
            </div>
          </div>

          <!-- Tabs chọn màu -->
          <div class="modal-tabs">
            <button
                @click="activeTab = 'preset'"
                :class="{ active: activeTab === 'preset' }"
            >
              Màu có sẵn
            </button>
            <button
                @click="activeTab = 'custom'"
                :class="{ active: activeTab === 'custom' }"
            >
              Màu tự chọn
            </button>
            <button
                v-if="props.returnType === 'rgba'"
                @click="activeTab = 'rgba'"
                :class="{ active: activeTab === 'rgba' }"
            >
              RGBA
            </button>
          </div>

          <!-- Loading state -->
          <div v-if="isLoading && activeTab === 'preset' && !availableColors" class="loading">
            <div class="spinner"></div>
            <p>Đang tải danh sách màu...</p>
          </div>

          <!-- Error state -->
          <div v-if="error && activeTab === 'preset' && !availableColors" class="error">
            <p>{{ error }}</p>
            <button @click="fetchGlobalColors" class="retry-button">Thử lại</button>
          </div>

          <!-- Nội dung tab màu có sẵn -->
          <div v-if="activeTab === 'preset' && availableColors && !isLoading" class="preset-colors">
            <div class="search-box" v-if="Object.keys(availableColors).length > 10">
              <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Tìm kiếm màu..."
                  class="search-input"
              />
            </div>

            <div class="color-grid">
              <div
                  v-for="(colorValue, colorKey) in filteredColors"
                  :key="colorKey"
                  class="color-option"
                  :class="{ selected: isSelectedColor(colorKey, colorValue) }"
                  :style="{ backgroundColor: colorValue }"
                  :title="`${colorKey}: ${colorValue}`"
                  @click="selectPresetColor(colorKey, colorValue)"
              >
                <span class="color-label">{{ colorKey }}</span>
                <span class="color-hex">{{ colorValue }}</span>
                <div v-if="isSelectedColor(colorKey, colorValue)" class="selected-indicator">
                  ✓
                </div>
              </div>
            </div>

            <div v-if="Object.keys(filteredColors).length === 0" class="no-results">
              Không tìm thấy màu phù hợp
            </div>
          </div>

          <!-- Nội dung tab màu tự chọn -->
          <div v-if="activeTab === 'custom'" class="custom-color">
            <div class="color-picker-container">
              <input
                  type="color"
                  v-model="customColor"
                  class="native-color-picker"
              />
              <div class="custom-color-details">
                <div
                    class="custom-color-preview"
                    :style="{ backgroundColor: customColor }"
                ></div>
                <div class="custom-color-hex">{{ customColor }}</div>
              </div>
            </div>
            <div class="custom-color-inputs">
              <div class="input-group">
                <label for="color-input">Mã màu HEX:</label>
                <input
                    id="color-input"
                    type="text"
                    v-model="customColor"
                    placeholder="#000000"
                    class="color-input"
                    @keyup.enter="selectCustomColor"
                    pattern="^#[0-9A-Fa-f]{6}$"
                    maxlength="7"
                />
              </div>
              <button
                  @click="selectCustomColor"
                  class="apply-button"
              >
                Áp dụng màu
              </button>
            </div>

            <!-- Recent custom colors -->
            <div class="recent-colors" v-if="recentColors.length > 0">
              <h4>Màu đã chọn gần đây:</h4>
              <div class="recent-colors-grid">
                <div
                    v-for="color in recentColors"
                    :key="color"
                    class="recent-color"
                    :style="{ backgroundColor: color }"
                    :title="color"
                    @click="selectCustomColorDirect(color)"
                ></div>
              </div>
            </div>
          </div>

          <!-- Nội dung tab RGBA -->
          <div v-if="activeTab === 'rgba'" class="rgba-color">
            <div class="rgba-preview-container">
              <div
                  class="rgba-color-preview"
                  :style="{ backgroundColor: rgbaPreview }"
              ></div>
              <div class="rgba-color-value">
                {{ rgbaValue }}
              </div>
            </div>

            <div class="rgba-inputs">
              <div class="input-row">
                <div class="input-group">
                  <label for="rgba-r">R (0-255):</label>
                  <input
                      id="rgba-r"
                      type="number"
                      v-model.number="rgbaR"
                      min="0"
                      max="255"
                      class="rgba-input"
                      @input="updateRgbaFromInputs"
                  />
                </div>
                <div class="input-group">
                  <label for="rgba-g">G (0-255):</label>
                  <input
                      id="rgba-g"
                      type="number"
                      v-model.number="rgbaG"
                      min="0"
                      max="255"
                      class="rgba-input"
                      @input="updateRgbaFromInputs"
                  />
                </div>
                <div class="input-group">
                  <label for="rgba-b">B (0-255):</label>
                  <input
                      id="rgba-b"
                      type="number"
                      v-model.number="rgbaB"
                      min="0"
                      max="255"
                      class="rgba-input"
                      @input="updateRgbaFromInputs"
                  />
                </div>
                <div class="input-group">
                  <label for="rgba-a">Alpha (0-1):</label>
                  <input
                      id="rgba-a"
                      type="number"
                      v-model.number="rgbaA"
                      min="0"
                      max="1"
                      step="0.01"
                      class="rgba-input"
                      @input="updateRgbaFromInputs"
                  />
                </div>
              </div>

              <div class="input-row">
                <div class="input-group">
                  <label for="rgba-hex">HEX Color:</label>
                  <input
                      id="rgba-hex"
                      type="text"
                      v-model="rgbaHex"
                      placeholder="#000000"
                      class="rgba-input hex-input"
                      @change="updateRgbaFromHex"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      maxlength="7"
                  />
                </div>
                <div class="input-group">
                  <label for="rgba-opacity">Opacity:</label>
                  <div class="opacity-slider-container">
                    <input
                        id="rgba-opacity"
                        type="range"
                        v-model.number="rgbaA"
                        min="0"
                        max="1"
                        step="0.01"
                        class="opacity-slider"
                        @input="updateRgbaFromInputs"
                    />
                    <span class="opacity-value">{{ (rgbaA * 100).toFixed(0) }}%</span>
                  </div>
                </div>
              </div>

              <div class="rgba-actions">
                <button
                    @click="applyRgbaColor"
                    class="apply-button"
                >
                  Áp dụng RGBA
                </button>
                <button
                    @click="convertCurrentToRgba"
                    class="convert-button"
                >
                  Chuyển màu hiện tại
                </button>
              </div>
            </div>

            <!-- Preset opacities -->
            <div class="opacity-presets" v-if="props.returnType === 'rgba'">
              <h4>Độ trong suốt thường dùng:</h4>
              <div class="opacity-buttons">
                <button
                    v-for="opacity in opacityPresets"
                    :key="opacity.value"
                    @click="setOpacity(opacity.value)"
                    class="opacity-button"
                >
                  {{ opacity.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Footer modal -->
          <div class="modal-footer">
            <button @click="showModal = false" class="cancel-button">
              Hủy
            </button>
            <button
                v-if="activeTab === 'custom'"
                @click="selectCustomColor"
                class="confirm-button"
            >
              Chọn màu
            </button>
            <button
                v-if="activeTab === 'rgba'"
                @click="applyRgbaColor"
                class="confirm-button"
            >
              Chọn RGBA
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '../../../../api/api.js'

const props = defineProps({
  modelValue: {
    type: [String, null],
    default: null
  },
  // Prop để xác định trả về key hay value
  returnType: {
    type: String,
    default: 'value',
    validator: (value) => ['value', 'key', 'rgba'].includes(value)
  },
  // Nhận colors từ component cha để giảm API calls
  colors: {
    type: Object,
    default: null
  },
  // Có thể tắt hoàn toàn việc gọi API nếu không cần
  disableApiCall: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// State
const showModal = ref(false)
const activeTab = ref('preset')
const globalColors = ref(null) // Colors từ API
const customColor = ref('#000000')
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const recentColors = ref([])
const globalColorsLoaded = ref(false) // Đánh dấu đã load từ API

// RGBA state
const rgbaR = ref(0)
const rgbaG = ref(0)
const rgbaB = ref(0)
const rgbaA = ref(1)
const rgbaHex = ref('#000000')

// Opacity presets
const opacityPresets = [
  { label: '100%', value: 1 },
  { label: '90%', value: 0.9 },
  { label: '75%', value: 0.75 },
  { label: '50%', value: 0.5 },
  { label: '25%', value: 0.25 },
  { label: '10%', value: 0.1 },
  { label: '0%', value: 0 }
]

// Computed properties
// Danh sách màu sẵn có (ưu tiên từ props, sau đó từ API)
const availableColors = computed(() => {
  // Ưu tiên sử dụng colors từ props
  if (props.colors && typeof props.colors === 'object') {
    return props.colors
  }

  // Nếu không có từ props, dùng từ API
  return globalColors.value
})

const previewColor = computed(() => {
  // Nếu modelValue là null hoặc empty
  if (!props.modelValue) return '#ffffff'

  // Nếu modelValue là key của màu (bắt đầu với --)
  if (isColorKey(props.modelValue)) {
    // Tìm trong availableColors trước
    if (availableColors.value && availableColors.value[props.modelValue]) {
      return availableColors.value[props.modelValue]
    }

    // Nếu không tìm thấy, thử trong globalColors nếu có
    if (globalColors.value && globalColors.value[props.modelValue]) {
      return globalColors.value[props.modelValue]
    }

    return '#ffffff'
  }

  // Nếu modelValue là mã màu hex
  if (isHexColor(props.modelValue)) {
    return props.modelValue
  }

  // Nếu modelValue là RGBA
  if (isRgbaColor(props.modelValue)) {
    return props.modelValue
  }

  return '#ffffff'
})

const displayValue = computed(() => {
  if (!props.modelValue) return 'Chưa chọn màu'

  // Nếu là key màu
  if (isColorKey(props.modelValue)) {
    const colorValue = previewColor.value
    return colorValue !== '#ffffff'
        ? `${props.modelValue} (${colorValue})`
        : props.modelValue
  }

  // Nếu là mã màu hex
  if (isHexColor(props.modelValue)) {
    return props.modelValue
  }

  // Nếu là RGBA
  if (isRgbaColor(props.modelValue)) {
    return props.modelValue
  }

  return props.modelValue
})

const filteredColors = computed(() => {
  if (!availableColors.value) return {}

  if (!searchQuery.value.trim()) {
    return availableColors.value
  }

  const query = searchQuery.value.toLowerCase()
  return Object.fromEntries(
      Object.entries(availableColors.value).filter(([key, value]) =>
          key.toLowerCase().includes(query) ||
          value.toLowerCase().includes(query)
      )
  )
})

// RGBA computed properties
const rgbaValue = computed(() => {
  return `rgba(${rgbaR.value}, ${rgbaG.value}, ${rgbaB.value}, ${rgbaA.value})`
})

const rgbaPreview = computed(() => {
  return `rgba(${rgbaR.value}, ${rgbaG.value}, ${rgbaB.value}, ${rgbaA.value})`
})

// Methods
const isColorKey = (value) => {
  return typeof value === 'string' && value.startsWith('--')
}

const isHexColor = (value) => {
  return typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value)
}

const isRgbaColor = (value) => {
  if (typeof value !== 'string') return false
  const rgbaRegex = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/
  if (!rgbaRegex.test(value)) return false

  const match = value.match(rgbaRegex)
  if (!match) return false

  const r = parseInt(match[1])
  const g = parseInt(match[2])
  const b = parseInt(match[3])

  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255
}

const isSelectedColor = (colorKey, colorValue) => {
  if (!props.modelValue) return false

  if (props.returnType === 'key') {
    return props.modelValue === colorKey
  } else if (props.returnType === 'value') {
    return props.modelValue === colorValue
  } else if (props.returnType === 'rgba') {
    // For RGBA mode, compare the hex part
    if (isHexColor(props.modelValue)) {
      return props.modelValue === colorValue
    } else if (isRgbaColor(props.modelValue)) {
      // Extract hex from RGBA for comparison
      const hex = rgbaToHex(props.modelValue)
      return hex === colorValue
    }
  }

  return false
}

const getBorderColor = (backgroundColor) => {
  if (!backgroundColor || backgroundColor === '#ffffff') return '#ccc'

  try {
    // Handle RGBA colors
    if (backgroundColor.startsWith('rgba')) {
      const match = backgroundColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
      if (match) {
        const r = parseInt(match[1])
        const g = parseInt(match[2])
        const b = parseInt(match[3])
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
        return luminance > 0.7 ? '#ccc' : 'transparent'
      }
    }

    // Handle HEX colors
    const hex = backgroundColor.replace('#', '')
    if (hex.length !== 6) return '#ccc'

    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)

    // Tính độ sáng (luminance)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    return luminance > 0.7 ? '#ccc' : 'transparent'
  } catch {
    return '#ccc'
  }
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

const rgbaToHex = (rgba) => {
  if (!rgba.startsWith('rgba')) return rgba

  const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
  if (match) {
    const r = parseInt(match[1])
    const g = parseInt(match[2])
    const b = parseInt(match[3])
    return rgbToHex(r, g, b)
  }

  return '#000000'
}

const parseRgba = (rgbaString) => {
  if (!rgbaString || !rgbaString.startsWith('rgba')) {
    return { r: 0, g: 0, b: 0, a: 1 }
  }

  const match = rgbaString.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: parseFloat(match[4])
    }
  }

  return { r: 0, g: 0, b: 0, a: 1 }
}

const openModal = async () => {
  showModal.value = true

  // Reset search
  searchQuery.value = ''

  // Set active tab based on current value
  if (props.modelValue) {
    if (isHexColor(props.modelValue)) {
      activeTab.value = 'custom'
      customColor.value = props.modelValue
      // Also update RGBA tab
      const rgb = hexToRgb(props.modelValue)
      rgbaR.value = rgb.r
      rgbaG.value = rgb.g
      rgbaB.value = rgb.b
      rgbaA.value = 1
      rgbaHex.value = props.modelValue
    } else if (isRgbaColor(props.modelValue)) {
      activeTab.value = 'rgba'
      const rgba = parseRgba(props.modelValue)
      rgbaR.value = rgba.r
      rgbaG.value = rgba.g
      rgbaB.value = rgba.b
      rgbaA.value = rgba.a
      rgbaHex.value = rgbToHex(rgba.r, rgba.g, rgba.b)
    } else {
      activeTab.value = 'preset'
    }
  } else {
    activeTab.value = 'preset'
  }

  // Chỉ gọi API nếu:
  // 1. Không có colors từ props
  // 2. Chưa load từ API trước đó
  // 3. Không bị disable API call
  if (!props.colors && !globalColorsLoaded.value && !props.disableApiCall) {
    await fetchGlobalColors()
  }
}

const fetchGlobalColors = async () => {
  // Nếu đã có colors từ props, không cần gọi API
  if (props.colors) {
    console.log('Using colors from props, skipping API call')
    return
  }

  // Nếu đã load rồi, không gọi lại
  if (globalColorsLoaded.value) {
    console.log('Colors already loaded from API')
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const response = await api.get('/cms/getSection/55')
    console.log("đã gọi API lấy màu")
    const parsedJSON = JSON.parse(response.data.contentJson)
    globalColors.value = parsedJSON.colors || {}
    globalColorsLoaded.value = true

    console.log('Loaded colors from API:', Object.keys(globalColors.value).length, 'colors')
  } catch (err) {
    console.error('Error fetching colors:', err)
    error.value = 'Không thể tải danh sách màu. Vui lòng thử lại.'
  } finally {
    isLoading.value = false
  }
}

const selectPresetColor = (colorKey, colorValue) => {
  let selectedValue

  if (props.returnType === 'key') {
    selectedValue = colorKey
  } else if (props.returnType === 'value') {
    selectedValue = colorValue
  } else if (props.returnType === 'rgba') {
    // For RGBA mode, convert hex to rgba with full opacity
    const rgb = hexToRgb(colorValue)
    selectedValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`
  }

  emit('update:modelValue', selectedValue)
  showModal.value = false

  // Thêm vào recent colors nếu là màu hex
  if (!isColorKey(colorValue) && props.returnType !== 'rgba') {
    addToRecentColors(colorValue)
  }
}

const selectCustomColor = () => {
  if (customColor.value && /^#[0-9A-Fa-f]{6}$/.test(customColor.value)) {
    let selectedValue

    if (props.returnType === 'rgba') {
      const rgb = hexToRgb(customColor.value)
      selectedValue = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`
    } else {
      selectedValue = customColor.value
    }

    emit('update:modelValue', selectedValue)
    addToRecentColors(customColor.value)
    showModal.value = false
  } else {
    alert('Mã màu không hợp lệ. Vui lòng nhập mã màu HEX (ví dụ: #FF0000)')
  }
}

const selectCustomColorDirect = (color) => {
  customColor.value = color
  selectCustomColor()
}

// RGBA methods
const updateRgbaFromInputs = () => {
  // Ensure values are within valid ranges
  rgbaR.value = Math.min(255, Math.max(0, rgbaR.value))
  rgbaG.value = Math.min(255, Math.max(0, rgbaG.value))
  rgbaB.value = Math.min(255, Math.max(0, rgbaB.value))
  rgbaA.value = Math.min(1, Math.max(0, rgbaA.value))

  // Update hex value
  rgbaHex.value = rgbToHex(rgbaR.value, rgbaG.value, rgbaB.value)
}

const updateRgbaFromHex = () => {
  if (/^#[0-9A-Fa-f]{6}$/.test(rgbaHex.value)) {
    const rgb = hexToRgb(rgbaHex.value)
    rgbaR.value = rgb.r
    rgbaG.value = rgb.g
    rgbaB.value = rgb.b
  }
}

const applyRgbaColor = () => {
  const rgbaString = `rgba(${rgbaR.value}, ${rgbaG.value}, ${rgbaB.value}, ${rgbaA.value})`
  emit('update:modelValue', rgbaString)

  // Add to recent colors (as hex)
  addToRecentColors(rgbaHex.value)
  showModal.value = false
}

const convertCurrentToRgba = () => {
  if (!props.modelValue) return

  if (isHexColor(props.modelValue)) {
    const rgb = hexToRgb(props.modelValue)
    rgbaR.value = rgb.r
    rgbaG.value = rgb.g
    rgbaB.value = rgb.b
    rgbaA.value = 1
    rgbaHex.value = props.modelValue
  } else if (isColorKey(props.modelValue)) {
    const colorValue = previewColor.value
    if (isHexColor(colorValue)) {
      const rgb = hexToRgb(colorValue)
      rgbaR.value = rgb.r
      rgbaG.value = rgb.g
      rgbaB.value = rgb.b
      rgbaA.value = 1
      rgbaHex.value = colorValue
    }
  } else if (isRgbaColor(props.modelValue)) {
    const rgba = parseRgba(props.modelValue)
    rgbaR.value = rgba.r
    rgbaG.value = rgba.g
    rgbaB.value = rgba.b
    rgbaA.value = rgba.a
    rgbaHex.value = rgbToHex(rgba.r, rgba.g, rgba.b)
  }
}

const setOpacity = (opacity) => {
  rgbaA.value = opacity
  updateRgbaFromInputs()
}

const addToRecentColors = (color) => {
  // Thêm màu vào đầu mảng
  recentColors.value = [color, ...recentColors.value.filter(c => c !== color)]

  // Giữ tối đa 8 màu
  if (recentColors.value.length > 8) {
    recentColors.value = recentColors.value.slice(0, 8)
  }

  // Lưu vào localStorage
  localStorage.setItem('colorPickerRecentColors', JSON.stringify(recentColors.value))
}

// Lifecycle
onMounted(() => {
  // Load recent colors từ localStorage
  const savedRecentColors = localStorage.getItem('colorPickerRecentColors')
  if (savedRecentColors) {
    try {
      recentColors.value = JSON.parse(savedRecentColors)
    } catch (e) {
      console.error('Error loading recent colors:', e)
    }
  }

  // Initialize RGBA from current value if exists
  if (props.modelValue) {
    if (isHexColor(props.modelValue)) {
      customColor.value = props.modelValue
      const rgb = hexToRgb(props.modelValue)
      rgbaR.value = rgb.r
      rgbaG.value = rgb.g
      rgbaB.value = rgb.b
      rgbaHex.value = props.modelValue
    } else if (isRgbaColor(props.modelValue)) {
      const rgba = parseRgba(props.modelValue)
      rgbaR.value = rgba.r
      rgbaG.value = rgba.g
      rgbaB.value = rgba.b
      rgbaA.value = rgba.a
      rgbaHex.value = rgbToHex(rgba.r, rgba.g, rgba.b)
    }
  }

  // Nếu có colors từ props, không cần preload API
  if (props.colors) {
    console.log('ColorPicker: Using colors from props, no API preload needed')
  } else if (!props.disableApiCall) {
    // Có thể preload API nếu muốn (optional)
    // fetchGlobalColors()
  }
})

// Watch cho modelValue để update các state khi cần
watch(() => props.modelValue, (newValue) => {
  if (newValue && isHexColor(newValue)) {
    customColor.value = newValue
    const rgb = hexToRgb(newValue)
    rgbaR.value = rgb.r
    rgbaG.value = rgb.g
    rgbaB.value = rgb.b
    rgbaHex.value = newValue
  } else if (newValue && isRgbaColor(newValue)) {
    const rgba = parseRgba(newValue)
    rgbaR.value = rgba.r
    rgbaG.value = rgba.g
    rgbaB.value = rgba.b
    rgbaA.value = rgba.a
    rgbaHex.value = rgbToHex(rgba.r, rgba.g, rgba.b)
  }
})

// Watch cho colors props để cập nhật khi props thay đổi
watch(() => props.colors, (newColors) => {
  if (newColors) {
    console.log('ColorPicker: Colors props updated', Object.keys(newColors).length, 'colors')
  }
})
</script>

<style scoped>
/* Các styles giữ nguyên từ phiên bản trước, thêm styles cho RGBA */

/* RGBA tab styles */
.rgba-color {
  padding: 20px;
}

.rgba-preview-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.rgba-color-preview {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid #cbd5e1;
  flex-shrink: 0;
  background-image:
      linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
      linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
      linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.rgba-color-value {
  font-size: 16px;
  font-family: monospace;
  font-weight: 600;
  color: #1e293b;
  padding: 12px 16px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  flex: 1;
}

.rgba-inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-row {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

.input-row .input-group {
  flex: 1;
}

.rgba-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.rgba-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.hex-input {
  font-family: monospace;
}

.opacity-slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.opacity-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1));
  -webkit-appearance: none;
  appearance: none;
}

.opacity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.opacity-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.opacity-value {
  min-width: 40px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.rgba-actions {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.convert-button {
  padding: 12px 24px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  font-weight: 500;
  flex: 1;
}

.convert-button:hover {
  background: #7c3aed;
}

.opacity-presets {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.opacity-presets h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #334155;
  font-weight: 600;
}

.opacity-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.opacity-button {
  padding: 8px 12px;
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  font-weight: 500;
}

.opacity-button:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

/* Giữ nguyên tất cả styles khác từ phiên bản trước */
.color-picker-wrapper {
  font-family: Arial, sans-serif;
}

.color-preview-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 2px solid;
  cursor: pointer;
  flex-shrink: 0;
}

.color-value-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
  cursor: pointer;
  min-width: 200px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.color-picker-button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  min-width: 100px;
}

.color-picker-button:hover:not(:disabled) {
  background: #2563eb;
}

.color-picker-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.color-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #1e293b;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-button:hover {
  color: #1e293b;
  background: #f1f5f9;
}

.current-selection {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  gap: 12px;
}

.current-color-preview {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 2px solid #cbd5e1;
  flex-shrink: 0;
}

.current-color-info {
  flex: 1;
  overflow: hidden;
}

.current-color-label {
  font-size: 14px;
  color: #334155;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current-color-value {
  font-size: 13px;
  color: #64748b;
  font-family: monospace;
  margin-top: 2px;
}

.modal-tabs {
  display: flex;
  padding: 0;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.modal-tabs button {
  padding: 14px 24px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  flex: 1;
  transition: all 0.2s;
  font-weight: 500;
}

.modal-tabs button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
  background: white;
}

.modal-tabs button:hover:not(.active) {
  color: #334155;
  background: #f1f5f9;
}

.loading {
  padding: 40px 20px;
  text-align: center;
  color: #64748b;
}

.loading .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

.error {
  padding: 20px;
  margin: 20px;
  color: #dc2626;
  background: #fef2f2;
  border-radius: 6px;
  border: 1px solid #fecaca;
  text-align: center;
}

.error p {
  margin: 0 0 10px 0;
}

.retry-button {
  padding: 6px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.retry-button:hover {
  background: #b91c1c;
}

.search-box {
  padding: 15px 20px 0;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.preset-colors {
  padding-bottom: 20px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  max-height: 350px;
  overflow-y: auto;
  padding: 15px 20px;
}

.color-option {
  height: 90px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

.color-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e1;
}

.color-option.selected {
  border-color: #3b82f6;
  border-width: 3px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.color-label {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  color: white;
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.color-hex {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  color: white;
  padding: 4px;
  font-size: 12px;
  font-family: monospace;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
}

.selected-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.no-results {
  padding: 30px;
  text-align: center;
  color: #64748b;
  font-style: italic;
}

.custom-color {
  padding: 20px;
}

.color-picker-container {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.native-color-picker {
  width: 70px;
  height: 70px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
}

.custom-color-details {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
}

.custom-color-preview {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  border: 2px solid #cbd5e1;
  flex-shrink: 0;
}

.custom-color-hex {
  font-size: 18px;
  font-family: monospace;
  font-weight: 600;
  color: #1e293b;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.custom-color-inputs {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 25px;
}

.input-group {
  flex: 1;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #334155;
  font-weight: 500;
}

.color-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: monospace;
  transition: all 0.2s;
}

.color-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.color-input:invalid {
  border-color: #ef4444;
}

.apply-button {
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  font-weight: 500;
  height: 44px;
}

.apply-button:hover {
  background: #0da271;
}

.recent-colors {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.recent-colors h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #334155;
  font-weight: 600;
}

.recent-colors-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 8px;
}

.recent-color {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  transition: all 0.2s;
}

.recent-color:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8fafc;
  border-radius: 0 0 8px 8px;
}

.cancel-button {
  padding: 10px 20px;
  background: #94a3b8;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
}

.cancel-button:hover {
  background: #64748b;
}

.confirm-button {
  padding: 10px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 500;
}

.confirm-button:hover {
  background: #2563eb;
}

.color-grid::-webkit-scrollbar {
  width: 8px;
}

.color-grid::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.color-grid::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.color-grid::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>