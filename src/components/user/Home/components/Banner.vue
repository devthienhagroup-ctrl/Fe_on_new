<template>
  <!-- Banner section (conditionally rendered) -->
  <div v-if="showBanner" class="banner-container">
    <!-- Slider với ParticleBackground components -->
    <div class="slider">
      <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          class="slide"
          :class="{ active: currentSlide === index }"
      >
        <ParticleBackground
            :image-url="baseUrlImg+ banner.imageUrl"
            :alt-text="banner.altText"
            :max-particle-size="getResponsiveValue(banner.particleSettings.maxParticleSize)"
            :particle-color="banner.particleSettings.particleColor"
            :line-color="banner.particleSettings.lineColor"
            :line-width="getResponsiveValue(banner.particleSettings.lineWidth)"
        />
      </div>
    </div>

    <!-- Container cho form tìm kiếm với max-width từ config -->
    <div class="search-wrapper" :style="searchWrapperStyle">
      <div class="search-container" :style="{ width: searchContainerWidth, maxWidth: containerMaxWidth }">
        <!-- Dòng 1: Tab Định giá/Ký gửi -->
        <div class="search-row tab-row" :style="tabRowStyle">
          <div
              class="tab-slider"
              :style="tabSliderStyle"
          ></div>
          <div
              class="tab"
              :class="{ active: activeTab === 'dinhgia' }"
              @click="setActiveTab('dinhgia')"
              :style="tabStyle('dinhgia')"
          >
            {{ searchConfig.tabs.tab1.label }}
          </div>
          <div
              class="tab"
              :class="{ active: activeTab === 'kygui' }"
              @click="setActiveTab('kygui')"
              :style="tabStyle('kygui')"
          >
            {{ searchConfig.tabs.tab2.label }}
          </div>
        </div>

        <!-- Dòng 2: Select box và tìm kiếm -->
        <div class="search-row search-input-row" :style="searchInputRowStyle">
          <div
              class="property-type"
              :class="{ expanded: isPropertyTypeExpanded }"
              @click="togglePropertyType"
              :style="propertyTypeStyle"
          >
            <div class="selected">{{ selectedPropertyType.label }}</div>
            <div class="arrow">▼</div>
            <div class="property-options">
              <div
                  v-for="option in propertyTypes"
                  :key="option.value"
                  class="property-option"
                  @click.stop="selectPropertyType(option)"
                  :style="propertyOptionStyle"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
          <input
              type="text"
              class="search-input"
              :placeholder="searchInputPlaceholder"
              v-model="searchQuery"
              @focus="onInputFocus"
              @blur="onInputBlur"
              :style="searchInputStyle"
          >
          <button
              class="search-button"
              @click="handleSearch"
              :style="searchButtonStyle"
              @mouseenter="searchButtonHover = true"
              @mouseleave="searchButtonHover = false"
          >
            <svg :width="searchButtonIconSize" :height="searchButtonIconSize" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" :stroke="searchButtonIconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Dòng 3: Button tìm kiếm -->
        <div class="search-row">
          <button
              class="search-submit"
              @click="handleSubmit"
              :style="submitButtonStyle"
              @mouseenter="submitButtonHover = true"
              @mouseleave="submitButtonHover = false"
          >
            {{ submitButtonLabel }}
          </button>
        </div>
      </div>
    </div>

    <!-- Điều khiển slider (chỉ hiện khi enabled) -->
    <div
        v-if="sliderArrowsConfig.enabled"
        class="slider-arrow prev"
        @click="prevSlide"
        :style="sliderArrowPrevStyle"
    >
      <svg :width="sliderArrowIconSize" :height="sliderArrowIconSize" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" :stroke="sliderArrowsColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div
        v-if="sliderArrowsConfig.enabled"
        class="slider-arrow next"
        @click="nextSlide"
        :style="sliderArrowNextStyle"
    >
      <svg :width="sliderArrowIconSize" :height="sliderArrowIconSize" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" :stroke="sliderArrowsColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Dot indicators (chỉ hiện khi enabled) -->
    <div
        v-if="sliderDotsConfig.enabled"
        class="slider-controls"
        :style="sliderControlsStyle"
    >
      <div
          v-for="(banner, index) in banners"
          :key="banner.id"
          class="slider-dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
          :style="sliderDotStyle(index)"
      ></div>
    </div>
  </div>

  <!-- Stats section (conditionally rendered) -->
  <div v-if="showStats" class="stat-container">
    <Stats :contentStats="contentStats"></Stats>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import ParticleBackground from '../../ParticleBackground.vue'
import Stats from "./Stats.vue";

const baseUrlImg = 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/';

// Props với giá trị mặc định
const props = defineProps({
  showBanner: {
    type: Boolean,
    default: true
  },
  showStats: {
    type: Boolean,
    default: true
  },
  content: {
    type: Object
  },
  contentStats: Object
})

// console.log("Banner nhận được ", props.contentStats)

// Slider state - dùng dữ liệu từ contentJson
const banners = computed(() => props.content?.contentJson?.banners || [
  {
    id: 0,
    imageUrl: "/imgs/banner1.jpg",
    altText: "Mô tả ảnh",
    searchWrapperPosition: {
      desktop: "55%",
      tablet: "40%",
      mobile: "120px",
      mobileSmall: "100px"
    },
    particleSettings: {
      enabled: true,
      particleCount: { desktop: 80, tablet: 60, mobile: 40 },
      maxParticleSize: { desktop: 8, tablet: 6, mobile: 4 },
      particleColor: "#031358",
      lineColor: "#031358",
      lineWidth: { desktop: 1, tablet: 0.8, mobile: 0.6 },
      moveSpeed: { desktop: 1.5, tablet: 1.2, mobile: 1 }
    }
  },
  {
    id: 1,
    imageUrl: "/imgs/banner2.jpg",
    altText: "Mô tả ảnh",
    searchWrapperPosition: {
      desktop: "75%",
      tablet: "120px",
      mobile: "100px",
      mobileSmall: "80px"
    },
    particleSettings: {
      enabled: true,
      particleCount: { desktop: 80, tablet: 60, mobile: 40 },
      maxParticleSize: { desktop: 8, tablet: 6, mobile: 4 },
      particleColor: "#031358",
      lineColor: "#031358",
      lineWidth: { desktop: 1, tablet: 0.8, mobile: 0.6 },
      moveSpeed: { desktop: 1.5, tablet: 1.2, mobile: 1 }
    }
  }
])

// Slider configuration với giá trị mặc định đầy đủ
const sliderArrowsConfig = computed(() => props.content?.contentJson?.sliderArrows || {
  enabled: true,
  size: { desktop: "40px", tablet: "35px", mobile: "30px", mobileSmall: "25px" },
  backgroundColor: { desktop: "rgba(255, 255, 255, 0.7)", mobile: "rgba(255, 255, 255, 0.8)" },
  hoverBackgroundColor: "rgba(255, 255, 255, 0.9)",
  color: "#031358",
  position: { desktop: "20px", tablet: "15px", mobile: "10px" },
  fontSize: { desktop: "20px", tablet: "18px", mobile: "16px", mobileSmall: "14px" }
})

const sliderDotsConfig = computed(() => props.content?.contentJson?.sliderDots || {
  enabled: true,
  size: { desktop: "12px", mobile: "10px" },
  color: "rgba(255, 255, 255, 0.5)",
  activeColor: "#4a6cf7",
  position: { desktop: "20px", mobile: "15px" }
})

const sliderSettings = computed(() => props.content?.contentJson?.sliderSettings || {
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  transitionSpeed: 500
})

// Search Form Configuration
const searchConfig = computed(() => props.content?.contentJson?.searchForm || {
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
    leftOffset: { desktop: '40px', tablet: '30px', mobile: '15px', mobileSmall: '10px' },
    width: { desktop: '50%', tablet: '70%', mobile: '90%', mobileSmall: '95%' }
  }
})

// Slider state
const currentSlide = ref(0)
const slideCount = computed(() => banners.value.length)

// Search state
const activeTab = ref(searchConfig.value.tabs.activeTab)
const isPropertyTypeExpanded = ref(false)
const selectedPropertyType = ref(searchConfig.value.propertyType.selected)
const propertyTypes = ref(searchConfig.value.propertyType.options)
const searchQuery = ref('')
const searchButtonHover = ref(false)
const submitButtonHover = ref(false)

// Tính toán responsive values
const getResponsiveValue = (responsiveObj) => {
  if (!responsiveObj) return ''
  const width = window.innerWidth
  if (width <= 480) return responsiveObj.mobileSmall || responsiveObj.mobile || responsiveObj.desktop
  if (width <= 768) return responsiveObj.mobile || responsiveObj.desktop
  if (width <= 1024) return responsiveObj.tablet || responsiveObj.desktop
  return responsiveObj.desktop
}

// Tính toán style cho search-wrapper
const searchWrapperStyle = computed(() => {
  const banner = banners.value[currentSlide.value]
  if (!banner) return { top: '55%', left: '40px' }

  const topValue = getResponsiveValue(banner.searchWrapperPosition) || '55%'
  const leftValue = getResponsiveValue(searchConfig.value.container.leftOffset) || '40px'

  return {
    top: topValue,
    left: leftValue,
    transition: 'top 0.5s ease'
  }
})

// Tính toán các giá trị responsive cho search form
const tabHeight = computed(() => getResponsiveValue(searchConfig.value.tabs.height) || '58px')
const tabFontSize = computed(() => getResponsiveValue(searchConfig.value.tabs.fontSize) || '17px')
const propertyTypeHeight = computed(() => getResponsiveValue(searchConfig.value.propertyType.height) || '58px')
const propertyTypeFontSize = computed(() => getResponsiveValue(searchConfig.value.propertyType.fontSize) || '17px')
const searchInputHeight = computed(() => getResponsiveValue(searchConfig.value.searchInput.height) || '58px')
const searchInputFontSize = computed(() => getResponsiveValue(searchConfig.value.searchInput.fontSize) || '17px')
const searchButtonSize = computed(() => getResponsiveValue(searchConfig.value.searchButton.size) || '58px')
const searchButtonIconSize = computed(() => '24px') // Fixed icon size, bạn có thể thêm vào config nếu muốn
const submitButtonHeight = computed(() => getResponsiveValue(searchConfig.value.submitButton.height) || '58px')
const submitButtonFontSize = computed(() => getResponsiveValue(searchConfig.value.submitButton.fontSize) || '17px')

// Container styles
const containerMaxWidth = computed(() => searchConfig.value.container.maxWidth || '1400px')
const searchContainerWidth = computed(() => getResponsiveValue(searchConfig.value.container.width) || '50%')

// Slider arrows style
const sliderArrowSize = computed(() => getResponsiveValue(sliderArrowsConfig.value.size))
const sliderArrowIconSize = computed(() => getResponsiveValue(sliderArrowsConfig.value.fontSize))
const sliderArrowsColor = computed(() => sliderArrowsConfig.value.color)
const sliderArrowBgColor = computed(() => {
  const width = window.innerWidth
  if (width <= 768) {
    return sliderArrowsConfig.value.backgroundColor.mobile || sliderArrowsConfig.value.backgroundColor.desktop
  }
  return sliderArrowsConfig.value.backgroundColor.desktop
})
const sliderArrowPosition = computed(() => getResponsiveValue(sliderArrowsConfig.value.position))

// Slider dots style
const sliderDotSize = computed(() => {
  const width = window.innerWidth
  if (width <= 768) {
    return sliderDotsConfig.value.size.mobile || sliderDotsConfig.value.size.desktop
  }
  return sliderDotsConfig.value.size.desktop
})
const sliderDotPosition = computed(() => {
  const width = window.innerWidth
  if (width <= 768) {
    return sliderDotsConfig.value.position.mobile || sliderDotsConfig.value.position.desktop
  }
  return sliderDotsConfig.value.position.desktop
})

// Slider styles
const sliderArrowPrevStyle = computed(() => ({
  width: sliderArrowSize.value,
  height: sliderArrowSize.value,
  left: sliderArrowPosition.value
}))

const sliderArrowNextStyle = computed(() => ({
  width: sliderArrowSize.value,
  height: sliderArrowSize.value,
  right: sliderArrowPosition.value
}))

const sliderControlsStyle = computed(() => ({
  bottom: sliderDotPosition.value
}))

const sliderDotStyle = (index) => ({
  width: sliderDotSize.value,
  height: sliderDotSize.value,
  backgroundColor: currentSlide.value === index
      ? sliderDotsConfig.value.activeColor
      : sliderDotsConfig.value.color
})

// Search form computed styles
const tabRowStyle = computed(() => ({
  height: tabHeight.value,
  backgroundColor: searchConfig.value.tabs.colors.inactiveBackground
}))

const tabSliderStyle = computed(() => ({
  transform: activeTab.value === 'dinhgia' ? 'translateX(0)' : 'translateX(100%)',
  backgroundColor: searchConfig.value.tabs.colors.activeBackground
}))

const tabStyle = (tabValue) => ({
  fontSize: tabFontSize.value,
  color: activeTab.value === tabValue
      ? searchConfig.value.tabs.colors.activeText
      : searchConfig.value.tabs.colors.inactiveText
});

const searchInputRowStyle = computed(() => ({
  height: searchInputHeight.value,
  backgroundColor: searchConfig.value.searchInput.colors.background
}))

const propertyTypeStyle = computed(() => ({
  height: isPropertyTypeExpanded.value ? 'auto' : propertyTypeHeight.value,
  backgroundColor: searchConfig.value.propertyType.colors.background,
  fontSize: propertyTypeFontSize.value,
  color: searchConfig.value.propertyType.colors.text
}))

const propertyOptionStyle = computed(() => ({
  height: propertyTypeHeight.value,
  fontSize: propertyTypeFontSize.value,
  color: searchConfig.value.propertyType.colors.text
}))

const searchInputPlaceholder = computed(() => searchConfig.value.searchInput.placeholder)
const searchInputStyle = computed(() => ({
  fontSize: searchInputFontSize.value,
  color: searchConfig.value.searchInput.colors.text,
  backgroundColor: searchConfig.value.searchInput.colors.background,
  border: searchConfig.value.searchInput.colors.border
}))

const searchButtonStyle = computed(() => ({
  width: searchButtonSize.value,
  height: searchButtonSize.value,
  backgroundColor: searchButtonHover.value
      ? searchConfig.value.searchButton.colors.hoverBackground
      : searchButtonHover.value === false && searchButtonHover.value !== null
          ? searchConfig.value.searchButton.colors.activeBackground
          : searchConfig.value.searchButton.colors.background
}))

const searchButtonIconColor = computed(() => searchConfig.value.searchButton.colors.icon)

const submitButtonLabel = computed(() => searchConfig.value.submitButton.label)
const submitButtonStyle = computed(() => ({
  height: submitButtonHeight.value,
  background: searchConfig.value.submitButton.colors.background,
  color: searchConfig.value.submitButton.colors.text,
  fontSize: submitButtonFontSize.value,
  fontWeight: searchConfig.value.submitButton.fontWeight,
  boxShadow: submitButtonHover.value ? searchConfig.value.submitButton.colors.hoverShadow : 'none',
  transform: submitButtonHover.value ? 'translateY(-2px)' : 'translateY(0)',
  transition: 'all 0.3s ease'
}))

// Slider methods
const goToSlide = (index) => {
  currentSlide.value = index
  resetSliderInterval() // Reset interval khi chuyển slide thủ công
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slideCount.value
  resetSliderInterval() // Reset interval khi chuyển slide thủ công
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slideCount.value) % slideCount.value
  resetSliderInterval() // Reset interval khi chuyển slide thủ công
}

const startSlider = () => {
  if (sliderSettings.value.autoplay && slideCount.value > 1) {
    slideInterval = setInterval(nextSlide, sliderSettings.value.autoplaySpeed || 5000)
  }
}

const stopSlider = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
}

// Reset slider interval (dừng và bắt đầu lại)
const resetSliderInterval = () => {
  stopSlider()
  startSlider()
}

// Tab methods
const setActiveTab = (tab) => {
  activeTab.value = tab
}

// Property type methods
const togglePropertyType = () => {
  isPropertyTypeExpanded.value = !isPropertyTypeExpanded.value
}

const selectPropertyType = (option) => {
  selectedPropertyType.value = option
  isPropertyTypeExpanded.value = false
}

// Search methods
const handleSearch = () => {
  console.log('Tìm kiếm:', searchQuery.value)
  // Xử lý tìm kiếm ở đây
}

const handleSubmit = () => {
  console.log('Submit search:', {
    tab: activeTab.value,
    propertyType: selectedPropertyType.value,
    query: searchQuery.value
  })
  // Xử lý submit form ở đây
}

const onInputFocus = () => {
  if (sliderSettings.value.pauseOnHover) {
    stopSlider()
  }
}

const onInputBlur = () => {
  if (sliderSettings.value.pauseOnHover) {
    startSlider()
  }
}

// Lifecycle - chỉ chạy slider nếu có banner
onMounted(() => {
  if (props.showBanner) {
    startSlider()
  }
})

onUnmounted(() => {
  stopSlider()
})

let slideInterval = null
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.banner-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding-bottom: 55%; /* Tỷ lệ khung hình (5:2) - bạn có thể điều chỉnh theo nhu cầu */
  border-bottom-left-radius: 30% 10%;
  border-bottom-right-radius: 30% 10%;
  overflow: visible;
  margin-bottom: 120px;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity v-bind('sliderSettings.transitionSpeed + "ms"') ease;
}

.slide.active {
  opacity: 1;
}

.overlay {
  position: absolute;
  inset: 0; /* phủ toàn bộ container */
  width: 50%; /* vẫn giữ nửa trái */
  background: linear-gradient(to right, rgba(3, 19, 88, 1), rgba(255, 255, 255, 0));
  z-index: 1;
  pointer-events: none; /* để không chặn click nếu cần */
}

/* Wrapper cho form tìm kiếm với max-width từ config */
.search-wrapper {
  position: absolute;
  transform: translateY(-50%);
  width: 100%;
  z-index: 2;
  max-width: 1400px;
}

.search-container {
  max-width: v-bind(containerMaxWidth);
  width: v-bind(searchContainerWidth);
}

.search-row {
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: visible;
}

.tab-row {
  display: flex;
  background-color: #EFF0F5;
  width: 60%;
  position: relative;
}

.tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
}

.tab.active {
  font-weight: 700;
}

.tab-slider {
  position: absolute;
  height: 100%;
  width: 50%;
  background-color: #031358;
  border-radius: 10px;
  transition: transform 0.3s ease;
  z-index: 0;
}

.search-input-row {
  display: flex;
  width: 100%;
  background-color: #EFF0F5;
}

.property-type {
  position: relative;
  width: 30%;
  background-color: #B9C0DF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  cursor: pointer;
  transition: height 0.3s ease;
  overflow: hidden;
  border-radius: 10px ;
}

.property-type.expanded {
  height: auto;
}

.property-type .selected {
  font-weight: 500;
}

.property-type .arrow {
  transition: transform 0.3s ease;
}

.property-type.expanded .arrow {
  transform: rotate(180deg);
}

.property-options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #B9C0DF;
  z-index: 10;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow: hidden;
}

.property-option {
  display: flex;
  align-items: center;
  padding: 0 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.property-option:hover {
  background-color: v-bind('searchConfig.propertyType.colors.hoverBackground');
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0 15px;
  background-color: #EFF0F5;
  font-family: 'Ubuntu', sans-serif;
  width: 60%;
}

.search-button {
  background-color: #EFF0F5;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
  border-radius: 10px;
}

.search-button:hover {
  background-color: v-bind('searchConfig.searchButton.colors.hoverBackground') !important;
}

.search-button:active {
  background-color: v-bind('searchConfig.searchButton.colors.activeBackground') !important;
}

.search-submit {
  width: 100%;
  border: none;
  border-radius: 10px;
  background: linear-gradient(to right, #031358, #0629BE);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family:'Ubuntu', sans-serif;
}

.search-submit:hover {
  transform: translateY(-2px);
  box-shadow: v-bind('searchConfig.submitButton.colors.hoverShadow');
}

.search-submit:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-controls {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.slider-dot {
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.slider-dot.active {
  background-color: v-bind('sliderDotsConfig.activeColor');
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: v-bind(sliderArrowBgColor);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.3s ease;
}

.slider-arrow:hover {
  background-color: v-bind('sliderArrowsConfig.hoverBackgroundColor');
}

/* Responsive design */
@media (max-width: 1400px) {
  .search-wrapper {
    max-width: calc(100% - 40px);
    margin-left: 0;
    left: 20px;
    transform: translateY(-50%);
  }

  .stats-container {
    max-width: calc(100% - 40px);
    padding: 0;
  }
}

@media (max-width: 1024px) {
  .stat-item.hovered {
    height: 200px;
  }

  .stat-expanded {
    height: 80px;
  }

  .expanded-content {
    font-size: 12px;
    line-height: 1.3;
  }

  .tab-row {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .banner-container {
    padding-bottom: 60%; /* Tỷ lệ cao hơn cho mobile */
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin-bottom: 30px;
  }

  .search-wrapper {
    max-width: calc(100% - 30px);
    left: 15px;
  }

  .search-container {
    width: 100%;
    max-width: 100%;
  }

  .search-input-row,
  .search-submit {
    width: 100%;
  }

  .property-type {
    width: 50%;
  }

  .tab-row {
    width: 100%;
  }

  .overlay {
    width: 0;
  }

  .stats-container {
    flex-wrap: wrap;
    max-width: calc(100% - 30px);
  }

  .stat-item {
    flex: 0 0 calc(50% - 20px);
    margin-bottom: 10px;
    height: 110px;
  }

  .stat-item.hovered {
    height: 180px;
  }

  .stat-content {
    height: 110px;
  }

  .stat-expanded {
    height: 70px;
    padding: 10px;
  }

  .expanded-content {
    font-size: 11px;
    line-height: 1.2;
  }

  .slider-arrow {
    display: none;
  }
}

@media (max-width: 480px) {
  .banner-container {
    padding-bottom: 70%; /* Tỷ lệ cao hơn cho mobile nhỏ */
  }

  .property-type {
    width: 140px;
  }

  .stats-container {
    flex-direction: column;
  }

  .stat-item {
    flex: 1;
    margin: 0 0 10px 0;
    height: 100px;
  }

  .stat-item.hovered {
    height: 160px;
  }

  .stat-content {
    height: 100px;
  }

  .stat-expanded {
    height: 60px;
    padding: 8px;
  }

  .expanded-content {
    font-size: 10px;
    line-height: 1.2;
  }

  .stat-number {
    font-size: 28px;
  }

  .stat-label {
    font-size: 12px;
  }
}

:global(body) {
  font-family: 'Ubuntu', sans-serif;
}
</style>