<!-- TestimonialCard.vue -->
<template>
  <div :class="cardClasses">
    <!-- Avatar & Info (exact like original) -->
    <div class="flex items-center gap-3 mb-3">
      <div
          :style="avatarCustomStyle"
          :class="[avatarBaseClasses, isCustomColor ? '' : avatarGradientClasses]"
          class="flex items-center justify-center text-white font-bold"
      >
        {{ initials }}
      </div>
      <div>
        <div class="font-semibold text-white">{{ name }}</div>
        <div class="text-xs text-slate-300">{{ position }}</div>
      </div>
    </div>

    <!-- Rating (exact like original with filled circles) -->
    <div class="flex items-center mb-2">
      <span
          v-for="n in rating"
          :key="n"
          class="text-yellow-300 mr-0.5"
      >
        <i class="fa-solid fa-star"></i>
      </span>
    </div>

    <!-- Quote (exact like original) -->
    <p class="mt-3 text-slate-300/90 italic ">
      "{{ quote }}"
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  quote: {
    type: String,
    required: true
  },
  initials: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'blue', // 'blue' | 'purple' | 'emerald' | 'indigo' | 'pink' | custom hex color
  },
  rating: {
    type: Number,
    default: 5,
    validator: (value) => value >= 1 && value <= 5
  }
})

const colorPresets = ['blue', 'purple', 'emerald', 'indigo', 'pink']

const isCustomColor = computed(() => {
  return !colorPresets.includes(props.color)
})

const colorClasses = {
  blue: {
    avatar: 'bg-gradient-to-r from-blue-500 to-indigo-400',
    border: 'hover:border-blue-500'
  },
  purple: {
    avatar: 'bg-gradient-to-r from-purple-500 to-pink-500',
    border: 'hover:border-purple-500'
  },
  emerald: {
    avatar: 'bg-gradient-to-r from-green-400 to-teal-500',
    border: 'hover:border-emerald-500'
  },
  indigo: {
    avatar: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    border: 'hover:border-indigo-500'
  },
  pink: {
    avatar: 'bg-gradient-to-r from-pink-500 to-rose-500',
    border: 'hover:border-pink-500'
  }
}

const initials = computed(() => {
  if (props.initials) return props.initials
  return props.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
})

const cardClasses = computed(() => {
  const baseClasses = 'bg-slate-800/60 backdrop-blur-sm p-4 rounded-xl shadow border-2 border-slate-700 transition-colors duration-300'

  if (isCustomColor.value) {
    return `${baseClasses} hover:border-opacity-70`
  }

  return [
    baseClasses,
    colorClasses[props.color].border
  ].join(' ')
})

const avatarBaseClasses = 'w-10 h-10 rounded-full'

const avatarGradientClasses = computed(() => {
  if (isCustomColor.value) return ''
  return colorClasses[props.color].avatar
})

const avatarCustomStyle = computed(() => {
  if (isCustomColor.value) {
    return {
      backgroundColor: props.color
    }
  }
  return {}
})

const cardHoverStyle = computed(() => {
  if (isCustomColor.value) {
    return {
      borderColor: props.color
    }
  }
  return {}
})
</script>