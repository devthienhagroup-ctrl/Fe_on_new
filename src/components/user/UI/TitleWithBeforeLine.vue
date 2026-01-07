<!-- TitleWithBeforeLine.vue -->
<template>
  <div :class="alignmentClass">
    <h3 class="text-white font-semibold text-lg mb-6 border-l-4 border-blue-500 pl-3">
      <slot></slot>
    </h3>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  align: {
    type: String,
    default: 'left', // 'left' | 'center' | 'right'
    validator: (value) => ['left', 'center', 'right'].includes(value)
  }
})

const alignmentClass = computed(() => {
  return {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[props.align]
})
</script>