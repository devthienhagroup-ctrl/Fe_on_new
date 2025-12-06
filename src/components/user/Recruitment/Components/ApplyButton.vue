<template>
  <button
      class="apply-button"
      :class="{ 'apply-button--clicked': isClicked }"
      @click="handleClick"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
  >
    <span class="apply-button__text">Ứng tuyển ngay</span>
    <div class="apply-button__pulse"></div>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const isHovered = ref(false)
const isClicked = ref(false)

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
  padding: 12px 32px;
  background: linear-gradient(135deg, #031358 0%, #0827AF 50%, #031358 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-family: 'Ubuntu', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(3, 19, 88, 0.3);
}

.apply-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(3, 19, 88, 0.4);
}

.apply-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(3, 19, 88, 0.3);
}

.apply-button--clicked {
  transform: scale(0.95);
  box-shadow: 0 2px 8px rgba(3, 19, 88, 0.2);
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
  border-radius: 12px;
  background: linear-gradient(135deg, #0827AF 0%, #031358 100%);
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