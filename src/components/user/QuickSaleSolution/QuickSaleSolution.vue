<template>
  <div class="app-container">
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

    <div class="header-container">
      <img class="bg" src="/imgs/BannerQS.jpg" alt="Background">

      <!-- Layout 2 cột ngang -->
      <div class="two-column-layout">
        <!-- Cột trái: Search bar -->
        <div class="left-column">
          <div class="search-wrapper">
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
                    <path
                        d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                        stroke="#031358" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
        </div>

        <!-- Cột phải: Header content với card liquid glass -->
        <div class="right-column">
          <div class="liquid-glass-card">
            <div class="card-image">
              <img src="/imgs/quick-sale.svg" alt="Quick Sale"/>
            </div>
            <div class="card-content">
              <p>
                <b>Chỉ 30 ngày</b> – bất động sản của bạn có thể tìm được chủ mới!
                Với quy trình tối ưu từ định giá, quảng bá đến chốt giao dịch,
                <b style="color: #031358">Thiên Hà Group</b> giúp bạn 'bán nhanh – đúng giá – không rủi ro'.
                Giải pháp thực chiến, kết quả thật – xem ngay cách chúng tôi làm được điều đó.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-container">
      <h2 class="subtitle">GIẢI PHÁP BÁN NHANH BẤT ĐỘNG SẢN TRONG 30 NGÀY</h2>
      <QuickSaleS1></QuickSaleS1>
      <div class="section23">
        <img class="right-img" src="/imgs/bg-s1.png" alt="">
        <QuickSaleS2></QuickSaleS2>
        <QuickSaleS3></QuickSaleS3>
      </div>
      <QuickSaleS4></QuickSaleS4>
      <QuickSaleS5></QuickSaleS5>
      <QuickSaleS6></QuickSaleS6>
      <div class="section78">
<!--        <img src="/imgs/bg-s2.png" alt="">-->
        <QuickSaleS7></QuickSaleS7>
        <QuickSaleS8></QuickSaleS8>
      </div>
      <QuickSaleS9></QuickSaleS9>
      <QuickSaleS10></QuickSaleS10>
      <QSbenefits></QSbenefits>
    </div>
    <SoldSection></SoldSection>
    <ContactForm></ContactForm>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import QuickSaleS1 from "./Components/QuickSaleS1.vue";
import QuickSaleS2 from "./Components/QuickSaleS2.vue";
import QuickSaleS3 from "./Components/QuickSaleS3.vue";
import QuickSaleS4 from "./Components/QuickSaleS4.vue";
import QuickSaleS5 from "./Components/QuickSaleS5.vue";
import QuickSaleS6 from "./Components/QuickSaleS6.vue";
import QuickSaleS7 from "./Components/QuickSaleS7.vue";
import QuickSaleS8 from "./Components/QuickSaleS8.vue";
import QuickSaleS9 from "./Components/QuickSaleS9.vue";
import QuickSaleS10 from "./Components/QuickSaleS10.vue";
import SoldSection from "../Home/components/SoldSection.vue";
import ContactForm from "../Home/components/ContactForm.vue";
import Footer from "../Home/components/Footer.vue";
import QSbenefits from "./Components/QSbenefits.vue";

// Tab state
const activeTab = ref('dinhgia')
const tabSliderStyle = computed(() => ({
  transform: activeTab.value === 'dinhgia' ? 'translateX(0)' : 'translateX(100%)'
}))

// Property type dropdown state
const isPropertyTypeExpanded = ref(false)
const selectedPropertyType = ref({value: 'all', label: 'Tất cả'})
const propertyTypes = ref([
  {value: 'all', label: 'Tất cả'},
  {value: 'house', label: 'Nhà phố'},
  {value: 'apartment', label: 'Chung cư'},
  {value: 'project', label: 'Dự án'}
])

// Search state
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

// Bubble effect
const bubbles = ref<{ left: number; size: number; delay: number; duration: number; color: string }[]>([])

onMounted(() => {
  const count = 30 // Tăng số lượng bong bóng
  for (let i = 0; i < count; i++) {
    bubbles.value.push({
      left: Math.random() * 100,              // vị trí ngang
      size: 5 + Math.random() * 20,           // kích thước 5–25px
      delay: Math.random() * 15,              // trễ 0–15s
      duration: 10 + Math.random() * 10,      // thời gian bay 10–20s
      color: `rgba(10, 36, 99, ${0.2 + Math.random() * 0.5})`, // độ trong khác nhau
    })
  }
})

onMounted(() => {
  const animatedElements = document.querySelectorAll(
      ".fade-left, .fade-right, .fade-in, .fade-up"
  );

  const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            // Nếu chỉ muốn chạy 1 lần, unobserve sau khi hiện
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5, // phần tử hiện 20% là kích hoạt
      }
  );

  animatedElements.forEach((el) => observer.observe(el));

  // cleanup
  onBeforeUnmount(() => observer.disconnect());
});
</script>

<style scoped>

.subtitle {
  font-size: 40px;
  color: #031358;
  font-weight: 700;
  text-align: center;
  margin: 30px auto;
  margin-bottom: 100px;
}

.section23 {
  position: relative;
  width: 100%;
}


.section23 > .right-img {
  position: absolute;
  width: auto;
  height: 70%;
  z-index: 0;
  bottom: 0;
  left: -260px;
  opacity: 0.9;
  transform: scaleX(-1);

}

.section78 {
  position: relative;
}

.section78 img {
  position: absolute;
  opacity: 0.9;
  width: 70%;
  left: -700px;
  transform: scaleX(-1);
}

/*************************/

* {
  font-family: 'Ubuntu', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

/* Bubble container chiếm toàn bộ màn hình */
.bubble-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
}

.bubble {
  position: absolute;
  bottom: -50px;
  border-radius: 50%;
  animation-name: floatUp;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
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
  min-height: 600px;
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
  background-color: #EFF0F5;
  height: 58px;
  width: 100%;
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
  width: 50%;
  height: 100%;
  background-color: #B9C0DF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  cursor: pointer;
  transition: height 0.3s ease;
  overflow: hidden;
  border-radius: 10px;
}

.property-type.expanded {
  height: 250px;
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
  border-radius: 20px;
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
  width:40%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 15px;
  font-size: 17px;
  background-color: #EFF0F5;
  font-family: 'Ubuntu', sans-serif;
}

.search-button {
  width: 10%;
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
  font-family: 'Ubuntu', sans-serif;
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
  padding: 20px;
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
  background: rgba(255, 255, 255, 0.3);
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
  font-size: 17px;
  color: #333;
  text-align: justify;
}

/* Main Container Styles */
.main-container {
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 100px;
  position: relative;
  z-index: 2;
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 1400px) {
  .section23 > .right-img {
    display: none;
  }
}


/* Tablet (768px - 992px) */
@media (max-width: 992px) {
  .two-column-layout {
    max-width: 90%;
  }

  .property-type {
    width: 50%; /* Tăng width lên 50% */
  }

  .tab-row {
    height: 50px;
  }

  .tab {
    font-size: 16px;
  }

  .search-submit {
    height: 50px;
    font-size: 16px;
  }
  .search-row {
    height: 50px;
  }
}

/* Mobile (576px - 768px) */
@media (max-width: 768px) {
  .header-container {
    min-height: 500px;
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

  .search-input-row {
    height: 50px;
  }

  .property-type {
    width: 50%;
    height: 50px;
  }

  .property-type .selected {
    font-size: 16px;
  }

  .property-option {
    height: 45px;
    font-size: 16px;
  }

  .search-input {
    height: 100%;
    font-size: 16px;
  }

  .search-button {
    height: 100%;
  }

  .tab-row {
    height: 45px;
  }

  .tab {
    font-size: 15px;
  }

  .search-submit {
    height: 45px;
    font-size: 15px;
  }

  .main-container {
    margin: 80px auto 0;
    padding: 0 15px;
  }
}

/* Small Mobile (dưới 576px) */
@media (max-width: 576px) {
  .search-input-row {
    height: 45px;
  }

  .property-type {
    width: 50%;
    height: 45px;
  }

  .property-type .selected {
    font-size: 15px;
  }

  .property-option {
    height: 42px;
    font-size: 15px;
  }

  .search-input {
    font-size: 15px;
  }


  .tab-row {
    height: 40px;
  }

  .tab {
    font-size: 14px;
  }

  .search-submit {
    height: 40px;
    font-size: 14px;
  }

  .two-column-layout {
    margin-top: 75px;
  }
}

/* Extra Small Mobile (dưới 400px) */
@media (max-width: 400px) {
  .property-type .selected {
    font-size: 14px;
  }

  .property-option {
    font-size: 14px;
  }

  .search-input {
    font-size: 14px;
    padding: 0 10px;
  }

  .property-type {
    padding: 0 10px;
  }

  .tab {
    font-size: 13px;
  }

  .search-submit {
    font-size: 13px;
  }

  /* Giảm số lượng bong bóng trên mobile để tối ưu hiệu suất */
  .bubble {
    animation-duration: 8s !important;
  }

  .liquid-glass-card {
    padding: 15px;
  }

  .card-content p {
    font-size: 16px;
  }
}

.section01 {
  z-index: 0;
}

.section2 {
  z-index: 2;
  margin-top: 100px;
}

.section3 {
  z-index: 3;
}

.section4 {
  z-index: 4;
}

.section5 {
  z-index: 5;
}

.section6 {
  z-index: 6;
}

.section7 {
  z-index: 7;
}

.section8 {
  z-index: 8;
}

.section9 {
  z-index: 9;
}

.section10 {
  z-index: 10;
}
</style>

<style>

/* ========== HIỆU ỨNG XUẤT HIỆN ========== */
.fade-left,
.fade-right,
.fade-up,
.fade-in {
  opacity: 0;
  visibility: hidden;
}

.fade-left.show,
.fade-right.show,
.fade-up.show,
.fade-in.show {
  opacity: 1 !important;
  visibility: visible;
  animation-fill-mode: forwards !important;
}

/* Bounce từ trái */
.fade-left.show {
  animation: bounceInLeft 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Bounce từ phải */
.fade-right.show {
  animation: bounceInRight 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Từ dưới lên (fade + bounce) */
.fade-up.show {
  animation: bounceInUp 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Fade nhẹ vô */
.fade-in.show {
  animation: fadeIn 1.2s ease-out;
}

/* Keyframes */
@keyframes bounceInLeft {
  0% {
    opacity: 0;
    transform: translateX(-500px);
  }
  60% {
    opacity: 1;
    transform: translateX(15px);
  }
  80% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes bounceInRight {
  0% {
    opacity: 0;
    transform: translateX(500px);
  }
  60% {
    opacity: 1;
    transform: translateX(-15px);
  }
  80% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes bounceInUp {
  0% {
    opacity: 0;
    transform: translateY(500px);
  }
  60% {
    opacity: 1;
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>