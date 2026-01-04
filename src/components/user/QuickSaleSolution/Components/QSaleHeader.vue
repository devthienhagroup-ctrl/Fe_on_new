<!-- QuickSaleHeader.vue -->
<template>
  <div class="header-section">
    <!-- Bubble container bao phủ toàn bộ màn hình -->
    <div class="bubble-container">
      <div
          v-for="(bubble, i) in bubbles"
          :key="i"
          class="bubble"
          :style="{
          left: bubble.left + '%',
          width: bubble.size + 'px',
          height: bubble.size + 'px',
          animationDelay: bubble.delay + 's',
          animationDuration: bubble.duration + 's',
          backgroundColor: bubble.color,
        }"
      ></div>
    </div>

    <div class="header-container" :style="headerStyle">
      <img class="bg" :src="baseImgaeUrl + config.header.backgroundImage" :alt="'Background'">

      <!-- Layout 2 cột ngang -->
      <div class="two-column-layout">
        <!-- Cột trái: Search bar -->
        <div class="left-column">
          <div class="search-wrapper">
            <div class="search-container">
              <!-- Dòng 1: Tab Định giá/Ký gửi -->
              <div class="search-row tab-row" :style="tabRowStyle">
                <div class="tab-slider" :style="tabSliderStyle"></div>
                <div
                    v-for="tab in config.tabs"
                    :key="tab.id"
                    class="tab"
                    :class="{ active: activeTab === tab.id }"
                    @click="setActiveTab(tab.id)"
                    :style="tabStyle"
                >
                  {{ tab.label }}
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
                  <div class="selected" :style="selectedPropertyTypeStyle">{{ selectedPropertyType.label }}</div>
                  <div class="arrow" :style="arrowStyle">▼</div>
                  <div class="property-options" :style="propertyOptionsStyle">
                    <div
                        v-for="option in config.propertyTypes"
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
                    :placeholder="config.search.placeholder"
                    v-model="searchQuery"
                    @focus="onInputFocus"
                    @blur="onInputBlur"
                    :style="searchInputStyle"
                >
                <button class="search-button" @click="handleSearch" :style="searchButtonStyle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                        :stroke="config.colors.primary" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>

              <!-- Dòng 3: Button tìm kiếm -->
              <div class="search-row">
                <button class="search-submit" @click="handleSubmit" :style="searchSubmitStyle">
                  {{ config.search.submitText }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cột phải: Header content với card liquid glass -->
        <div class="right-column">
          <div class="liquid-glass-card" :style="liquidGlassCardStyle">
            <div class="card-image" :style="cardImageStyle">
              <img :src="baseImgaeUrl + config.rightCard.image" :alt="config.rightCard.altText"/>
            </div>
            <div class="card-content">
              <p v-html="config.rightCard.content"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

const props = defineProps({
  sectionData: Object
})

// Config data from CMS
let config = {
  header: {
    backgroundImage: "BannerQS.jpg",
    minHeight: "95vh",
    mobileMinHeight: "500px"
  },
  tabs: [
    {
      id: "dinhgia",
      label: "Định giá",
      active: true
    },
    {
      id: "kygui",
      label: "Ký gửi",
      active: false
    }
  ],
  propertyTypes: [
    {
      value: "all",
      label: "Tất cả",
      default: true
    },
    {
      value: "house",
      label: "Nhà phố"
    },
    {
      value: "apartment",
      label: "Chung cư"
    },
    {
      value: "project",
      label: "Dự án"
    }
  ],
  search: {
    placeholder: "Nhập thông tin",
    buttonText: "Tìm kiếm",
    submitText: "Tìm kiếm"
  },
  rightCard: {
    image: "quick-sale.svg",
    altText: "Quick Sale",
    content: "Chỉ 30 ngày – bất động sản của bạn có thể tìm được chủ mới! Với quy trình tối ưu từ định giá, quảng bá đến chốt giao dịch, <b style='color: #031358'>Thiên Hà Group</b> giúp bạn 'bán nhanh – đúng giá – không rủi ro'. Giải pháp thực chiến, kết quả thật – xem ngay cách chúng tôi làm được điều đó."
  },
  colors: {
    primary: "#031358",
    secondary: "#0629BE",
    tabBg: "#EFF0F5",
    propertyTypeBg: "#B9C0DF",
    propertyTypeHover: "#a0a8cc"
  },
  typography: {
    fontFamily: "'Ubuntu', sans-serif",
    baseFontSize: "17px",
    mobileFontSize: "14px"
  },
  spacing: {
    rowHeight: "58px",
    mobileRowHeight: "40px",
    cardPadding: "20px",
    mobileCardPadding: "15px"
  },
  animations: {
    transitionSpeed: "0.3s"
  }
}

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã nhận được data từ cha")
}

// Dynamic styles computed from config
const headerStyle = computed(() => ({
  minHeight: config.header.minHeight
}))

const tabRowStyle = computed(() => ({
  height: config.spacing.rowHeight,
  backgroundColor: config.colors.tabBg
}))

const tabSliderStyle = computed(() => ({
  transform: activeTab.value === 'dinhgia' ? 'translateX(0)' : 'translateX(100%)',
  backgroundColor: config.colors.primary,
  transition: `transform ${config.animations.transitionSpeed} ease`
}))

const tabStyle = computed(() => ({
  fontSize: config.typography.baseFontSize,
  fontFamily: config.typography.fontFamily
}))

const searchInputRowStyle = computed(() => ({
  height: config.spacing.rowHeight,
  backgroundColor: config.colors.tabBg
}))

const propertyTypeStyle = computed(() => ({
  backgroundColor: config.colors.propertyTypeBg,
  height: config.spacing.rowHeight
}))

const selectedPropertyTypeStyle = computed(() => ({
  fontSize: config.typography.baseFontSize,
  fontFamily: config.typography.fontFamily
}))

const arrowStyle = computed(() => ({
  transition: `transform ${config.animations.transitionSpeed} ease`
}))

const propertyOptionsStyle = computed(() => ({
  backgroundColor: config.colors.propertyTypeBg,
  top: config.spacing.rowHeight
}))

const propertyOptionStyle = computed(() => ({
  height: `calc(${config.spacing.rowHeight} - 10px)`,
  fontSize: config.typography.baseFontSize,
  fontFamily: config.typography.fontFamily,
  '--hover-bg': config.colors.propertyTypeHover
}))

const searchInputStyle = computed(() => ({
  fontSize: config.typography.baseFontSize,
  fontFamily: config.typography.fontFamily,
  backgroundColor: config.colors.tabBg
}))

const searchButtonStyle = computed(() => ({
  backgroundColor: config.colors.tabBg,
  height: config.spacing.rowHeight
}))

const searchSubmitStyle = computed(() => ({
  height: config.spacing.rowHeight,
  background: `linear-gradient(to right, ${config.colors.primary}, ${config.colors.secondary})`,
  fontSize: config.typography.baseFontSize,
  fontFamily: config.typography.fontFamily,
  transition: `all ${config.animations.transitionSpeed} ease`
}))

const liquidGlassCardStyle = computed(() => ({
  padding: config.spacing.cardPadding
}))

const cardImageStyle = computed(() => ({
  backgroundColor: 'rgba(255, 255, 255, 0.3)'
}))

// Component state
const activeTab = ref(config.tabs.find(t => t.active)?.id || 'dinhgia')
const isPropertyTypeExpanded = ref(false)
const selectedPropertyType = ref(config.propertyTypes.find(pt => pt.default) || config.propertyTypes[0])
const searchQuery = ref('')

// Emit events
const emit = defineEmits(['search', 'submit', 'focus', 'blur'])

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
  emit('search', searchQuery.value)
}

const handleSubmit = () => {
  emit('submit', {
    tab: activeTab.value,
    propertyType: selectedPropertyType.value,
    query: searchQuery.value
  })
}

const onInputFocus = () => {
  emit('focus')
}

const onInputBlur = () => {
  emit('blur')
}

// Bubble effect với cấu hình cứng
const bubbles = ref([])

onMounted(() => {
  const bubbleCount = 30
  const minSize = 5
  const maxSize = 25
  const minOpacity = 0.2
  const maxOpacity = 0.7
  const baseDuration = 10
  const durationVariation = 10
  const maxDelay = 15
  const baseColor = "10, 36, 99"

  for (let i = 0; i < bubbleCount; i++) {
    bubbles.value.push({
      left: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      delay: Math.random() * maxDelay,
      duration: baseDuration + Math.random() * durationVariation,
      color: `rgba(${baseColor}, ${minOpacity + Math.random() * (maxOpacity - minOpacity)})`,
    })
  }
})
</script>

<style scoped>
.header-section {
  position: relative;
  overflow: hidden;
}

* {
  font-family: v-bind('config.typography.fontFamily');
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Bubble container chiếm toàn bộ màn hình */
.bubble-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
  pointer-events: none;
}

.bubble {
  position: absolute;
  bottom: -50px;
  border-radius: 50%;
  animation: floatUp ease-in infinite;
  opacity: 0;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  50% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(-120vh) scale(1.1);
    opacity: 0;
  }
}

.header-container {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 60px;
  z-index: 2;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

/* Layout 2 cột */
.two-column-layout {
  display: flex;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 50px 20px;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

/* Cột trái - Search bar */
.left-column {
  flex: 1;
  max-width: 600px;
}

.search-wrapper {
  width: 100%;
}

.search-container {
  width: 100%;
}

.search-row {
  margin-bottom: 15px;
  border-radius: 10px;
  overflow: visible;
}

.tab-row {
  display: flex;
  width: 100%;
  position: relative;
}

.tab {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  cursor: pointer;
  transition: all v-bind('config.animations.transitionSpeed') ease;
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
  border-radius: 10px;
  z-index: 0;
}

.search-input-row {
  display: flex;
  width: 100%;
}

.property-type {
  position: relative;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  cursor: pointer;
  transition: height v-bind('config.animations.transitionSpeed') ease;
  overflow: hidden;
  border-radius: 10px;
}

.property-type.expanded {
  height: 250px;
}

.property-type.expanded .arrow {
  transform: rotate(180deg);
}

.property-options {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 10;
  border-radius: 20px;
}

.property-option {
  display: flex;
  align-items: center;
  padding: 0 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.property-option:hover {
  background-color: var(--hover-bg);
}

.search-input {
  flex: 1;
  width:40%;
  border: none;
  outline: none;
  padding: 0 15px;
}

.search-button {
  width: 10%;
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
  width: 100%;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.search-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.search-submit:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Cột phải - Liquid Glass Card */
.right-column {
  flex: 1;
  max-width: 700px;
  display: flex;
  justify-content: flex-end;
}

.liquid-glass-card {
  display: flex;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  gap: 20px;
}

.card-image {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.card-content p {
  margin: 0;
  line-height: 1.6;
  text-align: justify;
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet (768px - 992px) */
@media (max-width: 992px) {
  .two-column-layout {
    max-width: 90%;
  }

  .property-type {
    width: 50%;
  }
}

/* Mobile (576px - 768px) */
@media (max-width: 900px) {
  .header-container {
    min-height: v-bind('config.header.mobileMinHeight');
    margin-top: 60px;
  }

  .two-column-layout {
    flex-direction: column;
    gap: 30px;
  }

  .left-column, .right-column {
    width: 100%;
  }

  .liquid-glass-card {
    max-width: 100%;
    flex-direction: column;
    text-align: center;
  }

  .card-image {
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }

  .tab,
  .property-type .selected,
  .property-option,
  .search-input,
  .search-submit {
    font-size: v-bind('config.typography.mobileFontSize');
  }

  .tab-row,
  .search-input-row,
  .property-type,
  .search-submit {
    height: v-bind('config.spacing.mobileRowHeight');
  }

  .property-options {
    top: v-bind('config.spacing.mobileRowHeight');
  }

  .property-option {
    height: calc(v-bind('config.spacing.mobileRowHeight') - 5px);
  }

  .two-column-layout {
    margin-top: 75px;
  }
}

/* Small Mobile (dưới 576px) */
@media (max-width: 576px) {
  .liquid-glass-card {
    padding: v-bind('config.spacing.mobileCardPadding');
  }

  .card-content p {
    font-size: 16px;
  }

  .bubble {
    animation-duration: 8s !important;
  }
}

/* Extra Small Mobile (dưới 400px) */
@media (max-width: 400px) {
  .property-type,
  .search-input {
    padding: 0 10px;
  }
}
</style>