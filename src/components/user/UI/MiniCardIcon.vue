<!-- MiniCardIcon.vue -->
<template>
  <div
      class="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 transition-colors duration-300 group"
      :class="{
      'hover:border-blue-500': color === 'blue',
      'hover:border-purple-500': color === 'purple',
      'hover:border-emerald-500': color === 'emerald',
      'hover:border-green-500': color === 'green',
      'hover:border-amber-500': color === 'amber',
      'hover:border-red-500': color === 'red'
    }"
      :data-aos="aos"
      :data-aos-delay="aosDelay"
  >
    <div class="flex items-center gap-4">
      <!-- Icon Container -->
      <div
          class="w-12 h-12 rounded-lg flex items-center justify-center transition duration-300"
          :class="iconContainerClass"
      >
        <i :class="iconClass"></i>
      </div>

      <!-- Content -->
      <div>
        <h4 class="text-3xl font-bold text-white">{{ value }}</h4>
        <p class="text-slate-400 text-sm">{{ label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'purple', 'emerald', 'green', 'amber', 'red'].includes(value)
  },
  iconClass: {
    type: String,
    default: 'fas fa-chart-line'
  },
  iconName: {
    type: String,
    default: 'text-lg'
  },
  aos: {
    type: String,
    default: ''
  },
  aosDelay: {
    type: String,
    default: ''
  }
})

// Computed class for icon container
const iconContainerClass = computed(() => {
  const baseClasses = 'group-hover:text-white transition'

  switch (props.color) {
    case 'blue':
      return `bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 ${baseClasses}`
    case 'purple':
      return `bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 ${baseClasses}`
    case 'emerald':
      return `bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 ${baseClasses}`
    case 'green':
      return `bg-green-500/20 text-green-400 group-hover:bg-green-500 ${baseClasses}`
    case 'amber':
      return `bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 ${baseClasses}`
    case 'red':
      return `bg-red-500/20 text-red-400 group-hover:bg-red-500 ${baseClasses}`
    default:
      return `bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 ${baseClasses}`
  }
})
</script>