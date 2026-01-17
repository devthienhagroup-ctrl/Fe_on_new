<!-- SimpleGlassCard.vue -->
<template>
  <div
      class="integration-card"
      :class="{ 'has-hover': hoverEffect }"
      :style="cardStyle"
      data-aos="fade-up"
  >
    <!-- Icon -->
    <div
        class="integration-icon"
        :style="iconStyle"
    >
      <i :class="icon"></i>
    </div>

    <!-- Title section - có thể có 2 dạng -->
    <div v-if="price && unit" class="flex justify-between items-start mb-4">
      <h4 class="text-xl font-bold text-white job-title">{{ title }}</h4>
      <div class="text-right">
        <p class="text-2xl font-bold text-white">{{ formatPrice }}</p>
        <p class="text-slate-400 text-sm">{{ unit }}</p>
      </div>
    </div>
    <h4 v-else class="text-xl font-bold text-white mb-4">
      {{ title }}
    </h4>

    <!-- Description -->
    <p class="text-slate-400 mb-6 description">
      {{ description }}
    </p>

    <!-- Tags section -->
    <div v-if="listTags && listTags.length > 0" class="mb-6 tags-container">
      <span
          v-for="(tag, index) in listTags"
          :key="index"
          class="job-tag"
          :style="tagStyle"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Link section -->
    <div v-if="link && linkText" class="mt-auto">
      <a
          :href="link"
          class="flex items-center font-medium hover:font-bold transition-colors duration-300"
      >
        {{ linkText }}
        <i class="fas fa-arrow-right ml-2"></i>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#3b82f6' // Mặc định blue-500
  },
  hoverEffect: {
    type: Boolean,
    default: true
  },
  // New props
  price: {
    type: [String, Number],
    default: null
  },
  unit: {
    type: String,
    default: ''
  },
  listTags: {
    type: Array,
    default: () => []
  },
  link: {
    type: String,
    default: ''
  },
  linkText: {
    type: String,
    default: ''
  }
})

// Tính toán màu sắc cho hiệu ứng
const computedColor = computed(() => {
  // Nếu là màu hex, chuyển đổi sang rgba
  if (props.color.startsWith('#')) {
    const r = parseInt(props.color.slice(1, 3), 16)
    const g = parseInt(props.color.slice(3, 5), 16)
    const b = parseInt(props.color.slice(5, 7), 16)
    return {
      hex: props.color,
      rgb: `${r}, ${g}, ${b}`,
      rgba10: `rgba(${r}, ${g}, ${b}, 0.1)`,
      rgba15: `rgba(${r}, ${g}, ${b}, 0.15)`,
      rgba20: `rgba(${r}, ${g}, ${b}, 0.2)`,
      rgba30: `rgba(${r}, ${g}, ${b}, 0.3)`
    }
  }
  return {
    hex: '#3b82f6',
    rgb: '59, 130, 246',
    rgba10: 'rgba(59, 130, 246, 0.1)',
    rgba15: 'rgba(59, 130, 246, 0.15)',
    rgba20: 'rgba(59, 130, 246, 0.2)',
    rgba30: 'rgba(59, 130, 246, 0.3)'
  }
})

// Format price
const formatPrice = computed(() => {
  if (typeof props.price === 'number') {
    return props.price.toLocaleString() + 'K'
  }
  return props.price
})

// Style cho thẻ
const cardStyle = computed(() => ({
  '--card-color': computedColor.value.hex,
  '--card-color-rgb': computedColor.value.rgb,
  '--card-border-color': computedColor.value.rgba15,
  '--card-hover-border-color': computedColor.value.rgba30
}))

// Style cho icon
const iconStyle = computed(() => ({
  color: computedColor.value.hex,
  background: computedColor.value.rgba10
}))

// Style cho tag
const tagStyle = computed(() => ({
  background: computedColor.value.rgba15,
  color: computedColor.value.hex
}))
</script>

<style scoped>
.integration-card {
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8));
  border: 1px solid var(--card-border-color, rgba(59, 130, 246, 0.15));
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow, border-color;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  min-height: 300px; /* Đảm bảo chiều cao tối thiểu đồng đều */
  height: 100%;
}

.integration-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--card-color, #3b82f6), rgba(139, 92, 246, 0.8));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease;
}

.integration-card.has-hover:hover {
  transform: translateY(-8px);
  box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.3),
      0 0 0 1px var(--card-hover-border-color, rgba(59, 130, 246, 0.3)),
      0 0 30px var(--card-hover-border-color, rgba(59, 130, 246, 0.1));
  border-color: var(--card-hover-border-color, rgba(59, 130, 246, 0.3));
}

.integration-card.has-hover:hover::before {
  transform: scaleX(1);
}

.integration-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg,
  rgba(var(--card-color-rgb, 59, 130, 246), 0.1),
  rgba(139, 92, 246, 0.1));
  transition: all 0.4s ease;
}

.integration-card.has-hover:hover .integration-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg,
  rgba(var(--card-color-rgb, 59, 130, 246), 0.2),
  rgba(139, 92, 246, 0.2));
}

/* Tag styling */
.job-tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.tags-container {
  margin-top: auto;
}

.description {
  flex-grow: 1;
}

/* Text styles */
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

.text-white {
  color: white;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.text-slate-400 {
  color: #94a3b8;
}

.text-blue-400 {
  color: #60a5fa;
}

.text-right {
  text-align: right;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-start {
  align-items: flex-start;
}

.items-center {
  align-items: center;
}

.mt-auto {
  margin-top: auto;
}

.ml-2 {
  margin-left: 0.5rem;
}

.hover\:text-blue-300:hover {
  color: #93c5fd;
}

.transition-colors {
  transition-property: color;
}

.duration-300 {
  transition-duration: 300ms;
}
</style>