<template>
  <button
      class="apply-button"
      :class="{ 'apply-button--clicked': isClicked }"
      @click="handleClick"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      :style="buttonStyles"
  >
    <span class="apply-button__text">{{ config.textContent.buttonText }}</span>
    <div
        class="apply-button__pulse"
        :style="pulseStyles"
    ></div>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'

const config = {
  textContent: {
    buttonText: 'Ứng tuyển ngay'
  },
  departments: [],
  styles: {
    button: {
      padding: '12px 32px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '500',
      fontFamily: "'Ubuntu', sans-serif",
      gradient: {
        start: '#031358',
        middle: '#0827AF',
        end: '#031358'
      },
      gradientDirection: '135deg',
      hoverTransform: 'translateY(-3px)',
      activeTransform: 'translateY(1px)',
      clickedTransform: 'scale(0.95)',
      shadowColor: 'rgba(3, 19, 88, 0.3)',
      hoverShadowColor: 'rgba(3, 19, 88, 0.4)',
      activeShadowColor: 'rgba(3, 19, 88, 0.3)',
      clickedShadowColor: 'rgba(3, 19, 88, 0.2)',
      shadowSizes: {
        normal: '0 4px 15px',
        hover: '0 6px 20px',
        active: '0 2px 10px',
        clicked: '0 2px 8px'
      },
      transition: 'all 0.3s ease'
    },
    pulse: {
      gradientStart: '#0827AF',
      gradientEnd: '#031358',
      gradientDirection: '135deg',
      borderRadius: '12px'
    }
  }
}

const isHovered = ref(false)
const isClicked = ref(false)

const buttonStyles = computed(() => {
  return {
    '--button-gradient': `linear-gradient(${config.styles.button.gradientDirection}, ${config.styles.button.gradient.start} 0%, ${config.styles.button.gradient.middle} 50%, ${config.styles.button.gradient.end} 100%)`,
    '--button-shadow': `${config.styles.button.shadowSizes.normal} ${config.styles.button.shadowColor}`,
    '--button-hover-shadow': `${config.styles.button.shadowSizes.hover} ${config.styles.button.hoverShadowColor}`,
    '--button-active-shadow': `${config.styles.button.shadowSizes.active} ${config.styles.button.activeShadowColor}`,
    '--button-clicked-shadow': `${config.styles.button.shadowSizes.clicked} ${config.styles.button.clickedShadowColor}`,
    '--button-hover-transform': config.styles.button.hoverTransform,
    '--button-active-transform': config.styles.button.activeTransform,
    '--button-clicked-transform': config.styles.button.clickedTransform,
    '--button-transition': config.styles.button.transition,
    '--button-padding': config.styles.button.padding,
    '--button-border-radius': config.styles.button.borderRadius,
    '--button-font-size': config.styles.button.fontSize,
    '--button-font-weight': config.styles.button.fontWeight,
    '--button-font-family': config.styles.button.fontFamily
  }
})

const pulseStyles = computed(() => {
  return {
    '--pulse-gradient': `linear-gradient(${config.styles.pulse.gradientDirection}, ${config.styles.pulse.gradientStart} 0%, ${config.styles.pulse.gradientEnd} 100%)`,
    '--pulse-border-radius': config.styles.pulse.borderRadius
  }
})

const handleClick = () => {
  isClicked.value = true
  setTimeout(() => {
    isClicked.value = false
  }, 150)
}
</script>

<style scoped>
.apply-button {
  position: relative;
  padding: var(--button-padding);
  background: var(--button-gradient);
  border: none;
  border-radius: var(--button-border-radius);
  color: white;
  font-family: var(--button-font-family);
  font-size: var(--button-font-size);
  font-weight: var(--button-font-weight);
  cursor: pointer;
  overflow: hidden;
  transition: var(--button-transition);
  transform: translateY(0);
  box-shadow: var(--button-shadow);
}

.apply-button:hover {
  transform: var(--button-hover-transform);
  box-shadow: var(--button-hover-shadow);
}

.apply-button:active {
  transform: var(--button-active-transform);
  box-shadow: var(--button-active-shadow);
}

.apply-button--clicked {
  transform: var(--button-clicked-transform);
  box-shadow: var(--button-clicked-shadow);
}

.apply-button__text {
  position: relative;
  z-index: 2;
}

.apply-button__pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: var(--pulse-border-radius);
  background: var(--pulse-gradient);
  opacity: 0;
  animation: pulse 2s infinite;
  z-index: 1;
}

@keyframes pulse {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.05);
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
  }
}

.apply-button:hover .apply-button__pulse {
  animation-duration: 1s;
}
</style>