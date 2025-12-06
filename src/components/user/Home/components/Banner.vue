<template>
  <div class="banner-container">
    <!-- Slider với ParticleBackground components -->
    <div class="slider">
      <div class="slide" :class="{ active: currentSlide === 0 }">
        <ParticleBackground
            image-url="/imgs/banner1.jpg"
            alt-text="Mô tả ảnh"
            :max-particle-size="8"
            particle-color="#031358"
            line-color="#031358"
            :line-width="1"
        />
      </div>
      <div class="slide" :class="{ active: currentSlide === 1 }">
        <ParticleBackground
            image-url="/imgs/banner2.jpg"
            alt-text="Mô tả ảnh"
            :max-particle-size="8"
            particle-color="#031358"
            line-color="#031358"
            :line-width="1"
        />
      </div>
    </div>

    <!-- Container cho form tìm kiếm với max-width 1400 -->
    <div class="search-wrapper" :style="searchWrapperStyle">
      <div class="search-container">
        <!-- Dòng 1: Tab Định giá/Ký gửi -->
        <div class="search-row tab-row">
          <div class="tab-slider" :style="tabSliderStyle"></div>
          <div
              class="tab"
              :class="{ active: activeTab === 'dinhgia' }"
              @click="setActiveTab('dinhgia')"
          >
            Định giá
          </div>
          <div
              class="tab"
              :class="{ active: activeTab === 'kygui' }"
              @click="setActiveTab('kygui')"
          >
            Ký gửi
          </div>
        </div>

        <!-- Dòng 2: Select box và tìm kiếm -->
        <div class="search-row search-input-row">
          <div
              class="property-type"
              :class="{ expanded: isPropertyTypeExpanded }"
              @click="togglePropertyType"
          >
            <div class="selected">{{ selectedPropertyType.label }}</div>
            <div class="arrow">▼</div>
            <div class="property-options">
              <div
                  v-for="option in propertyTypes"
                  :key="option.value"
                  class="property-option"
                  @click.stop="selectPropertyType(option)"
              >
                {{ option.label }}
              </div>
            </div>
          </div>
          <input
              type="text"
              class="search-input"
              placeholder="Nhập thông tin"
              v-model="searchQuery"
              @focus="onInputFocus"
              @blur="onInputBlur"
          >
          <button class="search-button" @click="handleSearch">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#031358" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <!-- Dòng 3: Button tìm kiếm -->
        <div class="search-row">
          <button class="search-submit" @click="handleSubmit">
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>

    <!-- Điều khiển slider -->
    <div class="slider-arrow prev" @click="prevSlide">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="#031358" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="slider-arrow next" @click="nextSlide">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="#031358" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Dot indicators -->
    <div class="slider-controls">
      <div
          v-for="index in slideCount"
          :key="index"
          class="slider-dot"
          :class="{ active: currentSlide === index - 1 }"
          @click="goToSlide(index - 1)"
      ></div>
    </div>
  </div>

  <div class="stat-container">
    <Stats></Stats>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ParticleBackground from '../../ParticleBackground.vue'
import Stats from "./Stats.vue";

// Slider state
const currentSlide = ref(0)
const slideCount = 2 // Chỉ còn 2 ảnh

// Tính toán style cho search-wrapper dựa trên slide hiện tại
const searchWrapperStyle = computed(() => {
  if (currentSlide.value === 0) {
    // Banner1 active - top 70%
    return { top: '55%' }
  } else {
    // Banner2 active - top 140px
    return { top: '140px' }
  }
})

// Tab state
const activeTab = ref('dinhgia')
const tabSliderStyle = computed(() => ({
  transform: activeTab.value === 'dinhgia' ? 'translateX(0)' : 'translateX(100%)'
}))

// Property type dropdown state
const isPropertyTypeExpanded = ref(false)
const selectedPropertyType = ref({ value: 'all', label: 'Tất cả' })
const propertyTypes = ref([
  { value: 'all', label: 'Tất cả' },
  { value: 'house', label: 'Nhà phố' },
  { value: 'apartment', label: 'Chung cư' }
])

// Search state
const searchQuery = ref('')

// Slider methods
const goToSlide = (index) => {
  currentSlide.value = index
  resetSliderInterval() // Reset interval khi chuyển slide thủ công
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slideCount
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slideCount) % slideCount
  resetSliderInterval() // Reset interval khi chuyển slide thủ công
}

const startSlider = () => {
  slideInterval = setInterval(nextSlide, 4000)
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
  stopSlider()
}

const onInputBlur = () => {
  startSlider()
}

// Lifecycle
onMounted(() => {
  startSlider()
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
  transition: opacity 0.5s ease;
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



/* Wrapper cho form tìm kiếm với max-width 1400px */
.search-wrapper {
  position: absolute;
  /* top sẽ được điều khiển bởi computed property */
  left: 50%;
  transform: translateY(-50%);
  width: 100%;
  max-width: 1400px;
  z-index: 2;
  padding-left: 20px;
  /* Đưa wrapper về bên trái trong container 1400px */
  margin-left: -700px; /* -1400px / 2 */
  transition: top 0.5s ease; /* Thêm transition để chuyển động mượt mà */
}

.search-container {
  width: 50%;
  max-width: 700px;
}

.search-row {
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: visible;
}

.tab-row {
  display: flex;
  background-color: #EFF0F5;
  height: 58px;
  width: 60%;
  position: relative;
}

.tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
}

.tab.active {
  color: white;
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
  height: 58px;
  width: 100%;
  background-color: #EFF0F5;
}

.property-type {
  position: relative;
  width: 30%;
  height: 58px;
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
  height: 210px;
}

.property-type .selected {
  font-size: 17px;
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
  top: 58px;
  left: 0;
  width: 100%;
  background-color: #B9C0DF;
  z-index: 10;
}

.property-option {
  height: 47.5px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.property-option:hover {
  background-color: #a0a8cc;
}

.search-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 15px;
  font-size: 17px;
  background-color: #EFF0F5;
  font-family: 'Ubuntu', sans-serif;
  width: 60%;
}

.search-button {
  width: 58px;
  height: 100%;
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
  background-color: #e0e1e9;
}

.search-button:active {
  background-color: #d1d2dc;
}

.search-submit {
  height: 58px;
  width: 100%;
  border: none;
  border-radius: 10px;
  background: linear-gradient(to right, #031358, #0629BE);
  color: white;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family:'Ubuntu', sans-serif;
}

.search-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.search-submit:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.slider-dot.active {
  background-color: white;
}

.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 2;
  transition: background-color 0.3s ease;
}

.slider-arrow:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.slider-arrow.prev {
  left: 20px;
}

.slider-arrow.next {
  right: 20px;
}


/* Responsive design */
@media (max-width: 1400px) {
  .search-wrapper {
    max-width: calc(100% - 40px);
    margin-left: 0;
    left: 20px;
    transform: translateY(-50%);
    padding-left: 0;
  }

  .stats-container {
    max-width: calc(100% - 40px);
    padding: 0;
  }

  .slider-arrow {
    display: none;
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
    height: 40px;
  }

  .property-type {
    width: 50%;
    height: 40px;
  }

  .tab-row {
    height: 40px;
  }

  .overlay {
    width: 0;
  }
  .tab-row {
    width: 100%;
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