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
        @load="extractColor"
    />

    <!-- Optional Badge -->
    <slot name="badge"></slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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
const dominantColor = ref(null)
const secondaryColor = ref(null)

const extractColor = () => {
  if (!imageRef.value) return

  const colorThief = new ColorThief()

  try {
    // Lấy palette màu (mảng các màu chính)
    const palette = colorThief.getPalette(imageRef.value, 2) // Lấy 2 màu chính

    if (palette && palette.length >= 2) {
      dominantColor.value = palette[0]
      secondaryColor.value = palette[1]
    } else {
      // Fallback mặc định nếu không lấy được
      dominantColor.value = [59, 130, 246] // blue-500
      secondaryColor.value = [147, 51, 234] // purple-600
    }
  } catch (error) {
    console.error('Error extracting color:', error)
    // Fallback màu mặc định
    dominantColor.value = [59, 130, 246]
    secondaryColor.value = [147, 51, 234]
  }
}

// Chuyển đổi mảng RGB thành chuỗi CSS
const rgbToString = (rgbArray) => {
  return `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`
}

// Style cho shadow với màu động
const shadowStyle = computed(() => {
  if (!dominantColor.value || !secondaryColor.value) {
    return {
      background: 'linear-gradient(to right, rgb(59, 130, 246), rgb(147, 51, 234))'
    }
  }

  return {
    background: `linear-gradient(to right, ${rgbToString(dominantColor.value)}, ${rgbToString(secondaryColor.value)})`
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

// Tự động extract màu khi component được mount
onMounted(() => {
  if (imageRef.value && imageRef.value.complete) {
    extractColor()
  }
})
</script>