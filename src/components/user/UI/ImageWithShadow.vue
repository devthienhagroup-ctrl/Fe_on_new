<!-- ImageWithShadow.vue -->
<template>
  <div class="relative" :class="containerClasses">
    <!-- Shadow/Glow Effect -->
    <div
        v-if="showShadow"
        :style="shadowStyle"
        class="absolute -inset-4 rounded-2xl blur-lg opacity-30"
    ></div>

    <!-- Image -->
    <img
        ref="imageRef"
        :src="src"
        :alt="alt"
        :class="imageClasses"
        class="relative rounded-2xl shadow-2xl border border-slate-700"
    />

    <!-- Optional Badge -->
    <slot name="badge"></slot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Image'
  },
  showShadow: {
    type: Boolean,
    default: true
  },
  rounded: {
    type: String,
    default: '2xl',
    validator: (value) => ['none', 'lg', 'xl', '2xl', 'full'].includes(value)
  },
  border: {
    type: Boolean,
    default: true
  },
  hoverEffect: {
    type: Boolean,
    default: false
  }
})

const imageRef = ref(null)

// Sử dụng màu mặc định thay vì trích xuất từ ảnh
const defaultColors = {
  primary: 'rgb(59, 130, 246)',    // blue-500
  secondary: 'rgb(147, 51, 234)'   // purple-600
}

// Style cho shadow với màu mặc định
const shadowStyle = computed(() => {
  return {
    background: `linear-gradient(to right, ${defaultColors.primary}, ${defaultColors.secondary})`
  }
})

const imageClasses = computed(() => {
  return [
    `rounded-${props.rounded}`,
    props.border ? 'border border-slate-700' : 'border-0',
    props.hoverEffect ? 'hover:scale-[1.02] transition-transform duration-300' : ''
  ].join(' ')
})

const containerClasses = computed(() => {
  return props.hoverEffect ? 'group' : ''
})
</script>