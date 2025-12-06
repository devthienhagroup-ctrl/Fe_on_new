<template>
  <div class="address-select-container">
    <label v-if="label" :for="id">{{ label }}</label>

    <!-- Chế độ select -->
    <select
        v-if="!enableSearch"
        :id="id"
        :value="modelValue"
        @change="handleSelectChange"
        :disabled="disabled"
        class="address-select"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
          v-for="option in options"
          :key="option.id"
          :value="option.id"
      >
        {{ option.name }}
      </option>
    </select>

    <!-- Chế độ search + select -->
    <div v-else class="search-select-wrapper">
      <div class="search-input-container">
        <input
            :id="id"
            ref="searchInputRef"
            v-model="searchQuery"
            @input="handleSearchInput"
            @focus="openDropdown"
            @keydown="handleKeydown"
            @blur="handleBlur"
            :placeholder="placeholder"
            :disabled="disabled"
            class="search-input"
            type="text"
            autocomplete="off"
        />
        <i class="fas fa-chevron-down search-arrow" @click="toggleDropdown"></i>
      </div>

      <!-- Dropdown menu -->
      <div
          v-show="showDropdown"
          ref="dropdownRef"
          class="dropdown-menu"
      >
        <div
            v-for="(option, index) in filteredOptions"
            :key="option.id"
            ref="dropdownItemsRef"
            @click="selectOption(option)"
            class="dropdown-item"
            :class="{
            'selected': option.id === modelValue,
            'highlighted': index === highlightedIndex
          }"
        >
          {{ option.name }}
        </div>

        <div
            v-if="filteredOptions.length === 0 && searchQuery"
            class="dropdown-item no-results"
        >
          Không tìm thấy kết quả cho "{{ searchQuery }}"
        </div>

        <div
            v-else-if="filteredOptions.length === 0"
            class="dropdown-item no-results"
        >
          Không có dữ liệu
        </div>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Chọn...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  enableSearch: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  nextFocusId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'selected'])

// Refs
const searchInputRef = ref(null)
const dropdownRef = ref(null)
const dropdownItemsRef = ref([])
const searchQuery = ref('')
const showDropdown = ref(false)
const highlightedIndex = ref(-1)
const isScrolling = ref(false)
const isSelecting = ref(false) // Thêm ref để theo dõi trạng thái đang chọn

// Filter options based on search query
const filteredOptions = computed(() => {
  if (!searchQuery.value) {
    return props.options
  }

  const query = removeDiacritics(searchQuery.value.toLowerCase())
  return props.options.filter(option => {
    const optionName = removeDiacritics(option.name.toLowerCase())
    return optionName.includes(query)
  })
})

// Hàm remove dấu tiếng Việt
const removeDiacritics = (str) => {
  return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
}

// Scroll đến item được highlight
const scrollToHighlightedItem = async () => {
  if (isScrolling.value) return
  await nextTick()

  if (highlightedIndex.value < 0 ||
      !dropdownRef.value ||
      !dropdownItemsRef.value[highlightedIndex.value]) {
    return
  }

  isScrolling.value = true

  const element = dropdownItemsRef.value[highlightedIndex.value]
  const dropdown = dropdownRef.value

  const itemTop = element.offsetTop
  const itemBottom = itemTop + element.offsetHeight
  const dropdownTop = dropdown.scrollTop
  const dropdownBottom = dropdownTop + dropdown.clientHeight

  const offset = 1

  if (itemTop < dropdownTop + offset) {
    dropdown.scrollTo({
      top: itemTop - offset,
      behavior: 'smooth'
    })
  } else if (itemBottom > dropdownBottom - offset) {
    dropdown.scrollTo({
      top: itemBottom - dropdown.clientHeight + offset,
      behavior: 'smooth'
    })
  }

  setTimeout(() => {
    isScrolling.value = false
  }, 150)
}

// Handle select change (non-search mode)
const handleSelectChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}

// Handle search input
const handleSearchInput = (event) => {
  searchQuery.value = event.target.value
  showDropdown.value = true
  highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : -1
}

// Open dropdown
const openDropdown = () => {
  if (props.disabled) return
  showDropdown.value = true
  highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : -1

  // Reset scroll position khi mở dropdown
  if (dropdownRef.value) {
    dropdownRef.value.scrollTop = 0
  }
}

// Handle keyboard navigation - ĐÃ SỬA
const handleKeydown = async (event) => {
  if (!showDropdown.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (filteredOptions.value.length === 0) return

      const nextIndex = highlightedIndex.value < filteredOptions.value.length - 1
          ? highlightedIndex.value + 1
          : 0

      highlightedIndex.value = nextIndex
      break

    case 'ArrowUp':
      event.preventDefault()
      if (filteredOptions.value.length === 0) return

      const prevIndex = highlightedIndex.value > 0
          ? highlightedIndex.value - 1
          : filteredOptions.value.length - 1

      highlightedIndex.value = prevIndex
      break

    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && filteredOptions.value[highlightedIndex.value]) {
        await selectOption(filteredOptions.value[highlightedIndex.value])
      } else if (filteredOptions.value.length === 1) {
        await selectOption(filteredOptions.value[0])
      } else if (filteredOptions.value.length > 0 && highlightedIndex.value === -1) {
        highlightedIndex.value = 0
        await selectOption(filteredOptions.value[0])
      }
      break

    case 'Escape':
      event.preventDefault()
      closeDropdown()
      break

    case 'Tab':
      closeDropdown()
      break

    case 'Home':
      event.preventDefault()
      if (filteredOptions.value.length > 0) {
        highlightedIndex.value = 0
      }
      break

    case 'End':
      event.preventDefault()
      if (filteredOptions.value.length > 0) {
        highlightedIndex.value = filteredOptions.value.length - 1
      }
      break

    case 'PageDown':
      event.preventDefault()
      if (filteredOptions.value.length > 0) {
        const pageSize = Math.max(1, Math.floor(dropdownRef.value?.clientHeight / 44) || 5)
        highlightedIndex.value = Math.min(
            highlightedIndex.value + pageSize,
            filteredOptions.value.length - 1
        )
      }
      break

    case 'PageUp':
      event.preventDefault()
      if (filteredOptions.value.length > 0) {
        const pageSize = Math.max(1, Math.floor(dropdownRef.value?.clientHeight / 44) || 5)
        highlightedIndex.value = Math.max(highlightedIndex.value - pageSize, 0)
      }
      break
  }
}

// Đóng dropdown
const closeDropdown = () => {
  showDropdown.value = false
  highlightedIndex.value = -1
}

// Handle blur với delay - ĐÃ SỬA
const handleBlur = () => {
  // Nếu đang trong quá trình chọn, không thực hiện blur
  if (isSelecting.value) return

  setTimeout(() => {
    if (!isSelecting.value) {
      closeDropdown()

      // Khôi phục tên đã chọn nếu có
      if (props.modelValue) {
        const selected = props.options.find(opt => opt.id === props.modelValue)
        if (selected) {
          searchQuery.value = selected.name
        }
      } else {
        searchQuery.value = ''
      }
    }
  }, 150)
}

// Select option from dropdown - ĐÃ SỬA
const selectOption = async (option) => {
  isSelecting.value = true // Đánh dấu đang chọn

  emit('update:modelValue', option.id)
  emit('change', option.id)
  emit('selected', option.id)
  searchQuery.value = option.name
  closeDropdown()

  // Focus đến element tiếp theo nếu có nextFocusId
  if (props.nextFocusId) {
    await nextTick()
    const nextElement = document.getElementById(props.nextFocusId)
    if (nextElement && !nextElement.disabled) {
      nextElement.focus()
    }
  }

  // Reset trạng thái sau khi chọn
  setTimeout(() => {
    isSelecting.value = false
  }, 200)
}

// Toggle dropdown - ĐÃ SỬA
const toggleDropdown = () => {
  if (props.disabled) return

  if (showDropdown.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

// Close dropdown when clicking outside - ĐÃ SỬA
const handleClickOutside = (event) => {
  const wrapper = event.target.closest('.address-select-container')
  if (!wrapper && !isSelecting.value) {
    closeDropdown()

    // Khôi phục tên đã chọn nếu có
    if (props.modelValue) {
      const selected = props.options.find(opt => opt.id === props.modelValue)
      if (selected) {
        searchQuery.value = selected.name
      }
    } else {
      searchQuery.value = ''
    }
  }
}

// Watch for modelValue changes to update search query
watch(() => props.modelValue, (newValue) => {
  if (props.enableSearch) {
    if (newValue) {
      const selected = props.options.find(opt => opt.id === newValue)
      if (selected) {
        searchQuery.value = selected.name
      }
    } else {
      searchQuery.value = ''
    }
  }
})

// Watch for options changes - GIỮ LẠI 1 WATCHER DUY NHẤT
watch(() => props.options, (newOptions) => {
  if (props.enableSearch && props.modelValue) {
    const selected = newOptions.find(opt => opt.id === props.modelValue)
    if (selected) {
      searchQuery.value = selected.name
    } else {
      searchQuery.value = ''
    }
  }
}, { deep: true })

// Watch filtered options để reset highlight và scroll position - WATCHER DUY NHẤT
watch(filteredOptions, (newOptions, oldOptions) => {
  // Chỉ reset highlight khi filtered options thực sự thay đổi
  if (JSON.stringify(newOptions) !== JSON.stringify(oldOptions)) {
    if (newOptions.length > 0) {
      highlightedIndex.value = 0
      // Reset scroll position khi filter thay đổi
      if (dropdownRef.value) {
        dropdownRef.value.scrollTop = 0
      }
    } else {
      highlightedIndex.value = -1
    }
  }
})

// Watch highlighted index để scroll
watch(highlightedIndex, (newIndex, oldIndex) => {
  if (newIndex !== oldIndex && newIndex >= 0 && !isScrolling.value) {
    scrollToHighlightedItem()
  }
})

// Initialize
onMounted(() => {
  if (props.enableSearch && props.modelValue) {
    const selected = props.options.find(opt => opt.id === props.modelValue)
    if (selected) {
      searchQuery.value = selected.name
    }
  }

  document.addEventListener('click', handleClickOutside)
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose focus method
defineExpose({
  focus: () => {
    if (searchInputRef.value) {
      searchInputRef.value.focus()
    }
  }
})
</script>

<style scoped>
.address-select-container {
  margin-bottom: 20px;
  width: 100%;
  position: relative;
}

label {
  display: block;
  color: #000;
  font-size: 16px;
  margin-bottom: 8px;
  text-align: left;
  font-weight: 500;
}

/* Base select styles */
.address-select {
  width: 100%;
  padding: 14px;
  background-color: #EEF1FF;
  border: none;
  border-radius: 13px;
  font-size: 16px;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 18px;
  padding-right: 45px !important;
}

.address-select:focus {
  outline: none;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
  background-color: #e6e9ff;
}

.address-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Search select styles */
.search-select-wrapper {
  position: relative;
  width: 100%;
}

.search-input-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 14px;
  background-color: #EEF1FF;
  border: none;
  border-radius: 13px;
  font-size: 16px;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  transition: all 0.3s ease;
  padding-right: 45px !important;
}

.search-input:focus {
  outline: none;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
  background-color: #e6e9ff;
}

.search-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #555;
  cursor: pointer;
  font-size: 14px;
  z-index: 5;
}

/* DROPDOWN MENU - CẢI THIỆN */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 13px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-height: 250px;
  overflow-y: auto;
  z-index: 9999;
  margin-top: 8px;
  border: 1px solid #e0e0e0;
  display: block;

  /* Cải thiện scroll behavior */
  scroll-behavior: smooth;
  scroll-padding: 5px;

  /* Webkit scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
}

/* Tùy chỉnh scrollbar cho Webkit browsers */
.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}


.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.2s ease;
  font-size: 15px;
  color: #333;
  min-height: 44px;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  /* Đảm bảo không bị select text khi scroll */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #000;
}

.dropdown-item.selected {
  background-color: #EEF1FF;
  color: #031358;
  font-weight: 500;
}

.dropdown-item.highlighted {
  background-color: #031358;
  color: white;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item.no-results {
  color: #999;
  cursor: default;
  text-align: center;
  font-style: italic;
}

.dropdown-item.no-results:hover {
  background-color: white;
  color: #999;
}

.error {
  font-size: 14px;
  color: red;
  margin-top: 4px;
  text-align: left;
}

/* Responsive styles */
@media (max-width: 768px) {
  .address-select,
  .search-input {
    padding: 12px;
    font-size: 15px;
  }

  label {
    font-size: 15px;
  }

  .dropdown-item {
    padding: 10px 14px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .address-select,
  .search-input {
    padding: 11px;
    font-size: 14px;
  }

  label {
    font-size: 14px;
  }

  .dropdown-item {
    padding: 8px 12px;
    font-size: 13px;
  }

  .dropdown-menu {
    max-height: 200px;
  }
}
</style>