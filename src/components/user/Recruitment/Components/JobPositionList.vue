<template>
  <div class="career-opportunities">
    <h1 class="title">{{ config.title }}</h1>

    <div class="content-container">
      <div class="left-column fade-left">
        <div class="positions-container">
          <div
              v-for="(position, index) in config.positions"
              :key="index"
              :class="['position-item', { 'hovered': hoveredIndex >= index }]"
              :style="{
                height: `calc(100% - ${index * config.positionSpacing}px)`,
              }"
              @mouseenter="setHoveredIndex(index)"
              @mouseleave="resetHoveredIndex"
          >
            <div class="position-content">
              <h3>{{ position.title }}</h3>
              <div class="button-container">
                <button
                    class="btn apply-btn"
                    @click="emit('applyClick')"
                    :style="{
                    background: config.buttonGradient,
                    color: config.buttonTextColor
                  }"
                >
                  {{ config.applyButtonText }}
                </button>
                <router-link
                    :to="position.link || '#'"
                    custom
                    v-slot="{ navigate, href, isActive, isExactActive }"
                >
                  <button
                      class="btn detail-btn"
                      :style="{
                      'border-color': config.primaryColor,
                      color: config.primaryColor
                    }"
                      @click="navigate"
                      :href="href"
                  >
                    {{ config.detailButtonText }}
                  </button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="right-column fade-right">
        <img
            :src="baseImgaeUrl+config.imageUrl"
            :alt="config.imageAlt"
            class="career-image"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, defineEmits} from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";
import { RouterLink } from 'vue-router'

const emit = defineEmits(['applyClick'])

let config = {
  // Text content
  title: 'CƠ HỘI VIỆC LÀM',
  applyButtonText: 'ỨNG TUYỂN NGAY',
  detailButtonText: 'XEM CHI TIẾT',
  imageUrl: '/imgs/coi-hoi-viec-lam.png',
  imageAlt: 'Cơ hội việc làm',

  // Positions data với link
  positions: [
    { title: 'Nhân viên telesale', link: '' },
    { title: 'Nhân viên văn phòng', link: '' },
    { title: 'Chuyên viên tư vấn', link: '' },
    { title: 'Chuyên viên định giá BĐS', link: '' },
    { title: 'Nhân viên khảo sát thị trường', link: '' },
    { title: 'Môi giới bất động sản', link: '' },
    { title: 'Cộng tác viên THG', link: '' }
  ],

  // Colors
  primaryColor: '#031358',
  secondaryColor: '#0827AF',
  backgroundColor: '#ffffff',
  buttonTextColor: '#ffffff',

  // Gradients
  buttonGradient: 'linear-gradient(135deg, #031358, #0827AF)',

  // Sizes
  titleFontSize: '40px',
  positionFontSize: '20px',
  buttonFontSize: '14px',
  containerHeight: '600px',
  positionSpacing: 80,

  // Spacing
  positionPadding: '25px',
  buttonPadding: '12px 18px',
  buttonGap: '12px',

  // Border radius
  positionBorderRadius: '20px 0 0 0',
  buttonBorderRadius: '6px',

  // Shadows
  containerShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  positionShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
  buttonShadow: '0 4px 12px rgba(3, 19, 88, 0.3)',

  // Transitions
  positionTransition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  buttonTransition: 'all 0.3s ease',

  // Responsive breakpoints
  responsiveBreakpoints: {
    tablet: '1024px',
    mobile: '768px',
    smallMobile: '441px'
  }
}

const props = defineProps({
  sectionData: Object
})

if(props.sectionData) {
  config = props.sectionData;
  console.log("Đã nhận props từ cha", config);
}

const hoveredIndex = ref(-1)

const setHoveredIndex = (index) => {
  hoveredIndex.value = index
}

const resetHoveredIndex = () => {
  hoveredIndex.value = -1
}

// Computed styles for CSS
const cssVars = computed(() => ({
  '--primary-color': config.primaryColor,
  '--secondary-color': config.secondaryColor,
  '--background-color': config.backgroundColor,
  '--button-text-color': config.buttonTextColor,
  '--button-gradient': config.buttonGradient,
  '--title-font-size': config.titleFontSize,
  '--position-font-size': config.positionFontSize,
  '--button-font-size': config.buttonFontSize,
  '--container-height': config.containerHeight + 'px',
  '--position-padding': config.positionPadding,
  '--button-padding': config.buttonPadding,
  '--button-gap': config.buttonGap,
  '--position-border-radius': config.positionBorderRadius,
  '--button-border-radius': config.buttonBorderRadius,
  '--container-shadow': config.containerShadow,
  '--position-shadow': config.positionShadow,
  '--button-shadow': config.buttonShadow,
  '--position-transition': config.positionTransition,
  '--button-transition': config.buttonTransition
}))
</script>

<style scoped>
.career-opportunities {
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Ubuntu', sans-serif;
  padding: 20px;
}

.title {
  font-size: v-bind('config.titleFontSize');
  color: v-bind('config.primaryColor');
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
}

.content-container {
  display: flex;
  gap: 0;
  height: v-bind('config.containerHeight');
  overflow: hidden;
  border-radius: 10px;
  box-shadow: v-bind('config.containerShadow');
}

.left-column {
  flex: 4;
  position: relative;
}

.right-column {
  flex: 8;
}

.career-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.positions-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.position-item {
  position: absolute;
  width: 100%;
  bottom: 0;
  background: v-bind('config.backgroundColor');
  color: v-bind('config.primaryColor');
  font-size: v-bind('config.positionFontSize');
  box-shadow: v-bind('config.positionShadow');
  border-radius: v-bind('config.positionBorderRadius');
  transform: translateY(54px);
  transition: v-bind('config.positionTransition');
  overflow: hidden;
  cursor: pointer;
}

.position-item.hovered {
  transform: translateY(0);
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.15);
}

.position-item:not(.hovered):hover {
  transform: translateY(20px);
}

.position-content {
  padding: v-bind('config.positionPadding');
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.position-content h3 {
  margin: 0;
  font-size: v-bind('config.positionFontSize');
  font-weight: 600;
  transition: all 0.3s ease;
}

.position-item:hover .position-content h3 {
  transform: translateY(-5px);
}

.position-item:hover .position-content {
  gap: 12px;
}

.button-container {
  display: flex;
  gap: v-bind('config.buttonGap');
  animation: fadeInUp 0.3s ease;
}

.button-container a {
  text-decoration: none;
  display: contents;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn {
  padding: v-bind('config.buttonPadding');
  border: none;
  border-radius: v-bind('config.buttonBorderRadius');
  font-weight: 600;
  cursor: pointer;
  transition: v-bind('config.buttonTransition');
  flex: 1;
  font-size: v-bind('config.buttonFontSize');
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.apply-btn {
  background: v-bind('config.buttonGradient');
  color: v-bind('config.buttonTextColor');
}

.detail-btn {
  background: transparent;
  border: 2px solid v-bind('config.primaryColor');
  color: v-bind('config.primaryColor');
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: v-bind('config.buttonShadow');
}

/* Responsive */
@media (max-width: 1024px) {
  .content-container {
    flex-direction: column;
    height: auto;
  }

  .left-column, .right-column {
    flex: none;
  }

  .positions-container {
    height: 600px;
  }

  .career-image {
    transform: translateY(0px);
  }

  .position-item {
    border-top-right-radius: 20px;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 32px;
  }

  .position-content h3 {
    font-size: 18px;
  }

  .btn {
    padding: 10px 15px;
  }
}

@media (max-width: 441px) {
  .btn {
    font-size: 12px;
  }
}
</style>