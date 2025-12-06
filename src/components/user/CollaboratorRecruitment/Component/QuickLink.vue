<template>
  <div class="quick-link">
    <div class="link-header" @click="toggleExpand">
      <h4 class="link-title">{{ title }}</h4>
      <i class="expand-icon" :class="isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
    </div>
    <transition
        name="expand"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @leave="onLeave"
    >
      <div class="link-content" v-show="isExpanded">
        <div
            v-for="(item, index) in items"
            :key="index"
            class="link-item"
            @click="handleItemClick(item)"
        >
          {{ item.title }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {useRouter} from "vue-router";

const router = useRouter()

const props = defineProps({
  title: String,
  items: Array,
  type: String
})

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const handleItemClick = (item) => {
  // Xử lý các action khác nhau
  if (item.action === 'copy' && item.value) {
    navigator.clipboard.writeText(item.value)
    // Có thể thêm thông báo copy thành công
  } else if (item.action === 'external' && item.link) {
    window.open(item.link, '_blank')
  } else if (item.link) {
    router.push(item.link);
  }
}

// Animation methods
const onEnter = (el) => {
  el.style.height = '0'
  el.style.opacity = '0'
  el.style.overflow = 'hidden'

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const height = el.scrollHeight + 'px'
      el.style.height = height
      el.style.opacity = '1'
    })
  })
}

const onAfterEnter = (el) => {
  el.style.height = 'auto'
  el.style.overflow = 'visible'
}

const onLeave = (el) => {
  el.style.height = el.scrollHeight + 'px'
  el.style.overflow = 'hidden'

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.height = '0'
      el.style.opacity = '0'
    })
  })
}
</script>

<style scoped>
.quick-link {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.link-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  background: white;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.link-header:hover {
  background: #f8f9fa;
}

.link-header:active {
  transform: scale(0.98);
}

.link-title {
  font-size: 16px;
  font-weight: 600;
  color: #031358;
  margin: 0;
  transition: color 0.3s ease;
}

.link-header:hover .link-title {
  color: #0030FF;
}

.expand-icon {
  color: #031358;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
}

.link-header:hover .expand-icon {
  color: #0030FF;
  transform: scale(1.1);
}

.link-content {
  background: #f8f9fa;
  transform-origin: top;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Height transition for smooth expand/collapse */
.expand-enter-active .link-content,
.expand-leave-active .link-content {
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.link-item {
  padding: 12px 20px;
  cursor: pointer;
  border-top: 1px solid #e9ecef;
  transition: all 0.3s ease;
  font-size: 14px;
  position: relative;
  overflow: hidden;
}

.link-item:hover {
  background: #e9ecef;
  padding-left: 25px;
}

.link-item:hover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #031358;
  animation: slideIn 0.3s ease;
}

.link-item:first-child {
  border-top: none;
}

@keyframes slideIn {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Pulse animation for the header when expanded */
.quick-link:has(.link-content:not([style*="height: 0"])) .link-header {
  background: linear-gradient(135deg, #f8f9fa 0%, white 100%);
  border-bottom-color: #e9ecef;
  box-shadow: 0 2px 10px rgba(3, 19, 88, 0.1);
}
</style>