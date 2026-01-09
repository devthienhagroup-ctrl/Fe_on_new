<!-- CustomButton.vue -->
<template>
  <a
      v-if="href"
      :href="href"
      :target="target"
      :class="buttonClasses"
      @click="handleClick"
  >
    <slot></slot>
  </a>
  <button
      v-else
      :class="buttonClasses"
      @click="handleClick"
      :type="type"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  href: String,
  target: {
    type: String,
    default: '_self'
  },
  variant: {
    type: String,
    default: 'gradient', // 'gradient' | 'outline' | 'fill'
    validator: (value) => ['gradient', 'outline', 'fill'].includes(value)
  },
  color: {
    type: String,
    default: 'blue', // 'blue' | 'purple' | 'teal' | 'white'
    validator: (value) => ['blue', 'purple', 'teal', 'white'].includes(value)
  },
  size: {
    type: String,
    default: 'medium', // 'small' | 'medium' | 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  rounded: {
    type: String,
    default: 'lg', // 'none' | 'lg' | 'full'
    validator: (value) => ['none', 'lg', 'full'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  hoverScale: {
    type: Boolean,
    default: true
  },
  shadow: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const variantClasses = {
  gradient: {
    blue: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-slate-50',
    purple: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-slate-50',
    teal: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-slate-50',
    white: 'bg-gradient-to-r from-white to-slate-200 hover:from-slate-100 hover:to-slate-300 text-slate-900'
  },
  outline: {
    blue: 'border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-slate-50',
    purple: 'border border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-slate-50',
    teal: 'border border-teal-500 text-teal-400 hover:bg-teal-600 hover:text-slate-50',
    white: 'border border-white text-slate-50 hover:bg-white hover:text-slate-900'
  },
  fill: {
    blue: 'bg-blue-600 hover:bg-blue-500 text-slate-50',
    purple: 'bg-purple-600 hover:bg-purple-500 text-slate-50',
    teal: 'bg-teal-600 hover:bg-teal-500 text-slate-50',
    white: 'bg-white hover:bg-slate-100 text-slate-900'
  }
}

const sizeClasses = {
  small: 'px-4 py-2 text-sm',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-4 text-lg'
}

const roundedClasses = {
  none: 'rounded-none',
  lg: 'rounded-lg',
  full: 'rounded-full'
}

const buttonClasses = computed(() => {
  return [
    variantClasses[props.variant][props.color],
    sizeClasses[props.size],
    roundedClasses[props.rounded],
    props.hoverScale ? 'transform hover:scale-105' : '',
    props.shadow ? 'shadow-lg shadow-blue-500/30' : '',
    'transition duration-300 inline-flex items-center justify-center gap-2'
  ].join(' ')
})

const handleClick = (event) => {
  emit('click', event)
}
</script>

<style scoped>

.py-4 {
  padding-top: 1rem!important;
  padding-bottom: 1rem!important;
}

</style>
