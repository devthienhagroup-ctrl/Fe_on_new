<!-- MiniCardIcon.vue -->
<template>
  <div
      class="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-slate-700 transition-colors duration-300 group"
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
    <!-- Layout khi align-center = true -->
    <div v-if="alignCenter" class="flex flex-col items-center text-center">
      <!-- Icon Container -->
      <div
          class="w-16 h-16 rounded-lg flex items-center justify-center transition duration-300 mb-4"
          :class="iconContainerClass"
      >
        <i :class="iconClass" class="text-xl"></i>
      </div>

      <!-- Content -->
      <div>
        <h4 class="text-2xl font-bold text-white mb-2">{{ value }}</h4>
        <p class="text-slate-400 text-sm">{{ label }}</p>
      </div>
    </div>

    <!-- Layout mặc định (align-center = false) -->
    <div v-else class="flex items-center gap-4">
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
  alignCenter: {
    type: Boolean,
    default: false
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

// Computed class for icon container với gradient
const iconContainerClass = computed(() => {
  const baseClasses = 'group-hover:text-white transition group-hover:scale-105'

  switch (props.color) {
    case 'blue':
      return `bg-gradient-to-br from-blue-500/30 via-blue-500/20 to-blue-600/30 text-blue-400 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:via-blue-400 group-hover:to-blue-600 ${baseClasses}`
    case 'purple':
      return `bg-gradient-to-br from-purple-500/30 via-purple-500/20 to-purple-600/30 text-purple-400 group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:via-purple-400 group-hover:to-purple-600 ${baseClasses}`
    case 'emerald':
      return `bg-gradient-to-br from-emerald-500/30 via-emerald-500/20 to-emerald-600/30 text-emerald-400 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:via-emerald-400 group-hover:to-emerald-600 ${baseClasses}`
    case 'green':
      return `bg-gradient-to-br from-green-500/30 via-green-500/20 to-green-600/30 text-green-400 group-hover:bg-gradient-to-br group-hover:from-green-500 group-hover:via-green-400 group-hover:to-green-600 ${baseClasses}`
    case 'amber':
      return `bg-gradient-to-br from-amber-500/30 via-amber-500/20 to-amber-600/30 text-amber-400 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:via-amber-400 group-hover:to-amber-600 ${baseClasses}`
    case 'red':
      return `bg-gradient-to-br from-red-500/30 via-red-500/20 to-red-600/30 text-red-400 group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:via-red-400 group-hover:to-red-600 ${baseClasses}`
    default:
      return `bg-gradient-to-br from-blue-500/30 via-blue-500/20 to-blue-600/30 text-blue-400 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:via-blue-400 group-hover:to-blue-600 ${baseClasses}`
  }
})
</script>