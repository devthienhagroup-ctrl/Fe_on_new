<!-- ImageWithShadow.vue -->
<template>
  <div class="relative" :class="containerClasses">
    <!-- Shadow/Glow Effect -->
    <div
        v-if="showShadow"
        class="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30"
    ></div>

    <!-- Image -->
    <img
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
import { computed } from 'vue'

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
    default: '2xl', // 'none' | 'lg' | 'xl' | '2xl' | 'full'
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