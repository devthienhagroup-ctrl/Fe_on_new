<!-- GlassCard.vue -->
<template>
  <div
      :class="cardClasses"
      class="glass-card-base flex flex-col h-full"
      :data-aos="aos"
      :data-aos-delay="aosDelay"
      :style="cardStyles"
  >
    <!-- Icon Container -->
    <div v-if="iconClass" :class="iconClass" :style="iconContainerStyles">
      <i :class="iconName" class="transition" :style="iconStyles"></i>
    </div>

    <!-- Title -->
    <h3 v-if="title" :class="titleClasses" :style="titleStyles">
      {{ title }}
    </h3>

    <!-- Content - flex-grow để chiếm không gian còn lại -->
    <div class="text-slate-400 text-sm leading-relaxed flex-grow text-justify">
      <slot></slot>
    </div>

    <!-- Link - luôn ở dưới cùng -->
    <div class="mt-6 space-y-3">
      <!-- Container cho 2 nút hiển thị cùng hàng -->
      <!-- Link chính -->
      <div class="flex flex-row gap-3">
        <a
            v-if="link"
            :href="link"
            :class="linkClasses"
            class="inline-flex items-center gap-2 justify-center flex-1 text-center"
            :style="linkStyles"
        >
          {{ linkText }}
          <i class="fas fa-chevron-right text-xs transition"></i>
        </a>

        <!-- Nút Truy cập nhanh -->
        <router-link
            v-if="quickAccessUrl"
            :to="quickAccessUrl"
            :class="quickAccessClasses"
            class="inline-flex items-center gap-2 justify-center flex-1 text-center"
            :style="quickAccessStyles"
        >
          <i class="fas fa-bolt text-xs transition"></i>
          {{ quickAccessText }}
        </router-link>
      </div>
      <slot name="link"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from "../../../stores/authStore.js";

const auth = useAuthStore();

const props = defineProps({
  title: String,
  iconName: String,
  iconClass: String,
  link: String,
  linkText: {
    type: String,
    default: 'Xem chi tiết'
  },
  // Thêm props cho truy cập nhanh
  quickAccessUrl: String,
  quickAccessText: {
    type: String,
    default: 'Truy cập nhanh'
  },
  color: {
    type: String,
    default: 'purple',
    validator: (value) => {
      // Cho phép cả preset màu và mã hex
      return ['blue', 'purple', 'teal'].includes(value) || /^#[0-9A-F]{6}$/i.test(value);
    }
  },
  padding: {
    type: String,
    default: 'large', // 'small' | 'medium' | 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  hoverEffect: {
    type: Boolean,
    default: true
  },
  aos: String,
  aosDelay: String
})

// Check if color is a preset or hex
const isHexColor = computed(() => {
  return /^#[0-9A-F]{6}$/i.test(props.color);
});

// Preset color classes (unchanged)
const presetColorClasses = {
  blue: {
    title: 'group-hover:text-blue-400',
    icon: 'text-blue-400 group-hover:text-blue-300',
    link: 'bg-blue-500/10 text-blue-300 border-blue-500/20 hover:text-white hover:border-blue-500',
    quickAccess: 'text-blue-400 hover:bg-blue-700 hover:text-white border-blue-600'
  },
  purple: {
    title: 'group-hover:text-purple-400',
    icon: 'text-purple-400 group-hover:text-purple-300',
    link: 'bg-purple-500/10 text-purple-300 border-purple-500/20 hover:text-white hover:border-purple-500',
    quickAccess: 'text-purple-400 hover:bg-purple-500 hover:text-white border-purple-600'
  },
  teal: {
    title: 'group-hover:text-teal-400',
    icon: 'text-teal-400 group-hover:text-teal-300',
    link: 'bg-teal-500/10 text-teal-300 border-teal-500/20 hover:text-white hover:border-teal-500',
    quickAccess: 'text-teal-400 hover:bg-teal-500 hover:text-white border-teal-600'
  }
}

// Base classes for hex colors
const hexBaseClasses = {
  title: 'group-hover:opacity-90',
  icon: 'opacity-90 group-hover:opacity-100',
  link: 'border-opacity-20 hover:text-white hover:border-opacity-100',
  quickAccess: 'hover:text-white border-opacity-50'
}

const paddingClasses = {
  small: 'p-4',
  medium: 'p-6',
  large: 'p-8'
}

const cardClasses = computed(() => {
  return [
    paddingClasses[props.padding],
    props.hoverEffect ? 'group' : '',
    'rounded-2xl'
  ].join(' ')
})

// Dynamic styles cho các thành phần
const hexColor = computed(() => props.color);

// Icon styles
const iconStyles = computed(() => {
  if (!isHexColor.value) return {};
  return {
    '--icon-color': hexColor.value,
    '--icon-hover-color': adjustColor(hexColor.value, 20) // Làm sáng hơn 20% khi hover
  };
});

const iconContainerStyles = computed(() => {
  if (!isHexColor.value) return {};
  return {
    '--icon-color': hexColor.value,
  };
});

const titleClasses = computed(() => {
  if (isHexColor.value) {
    return [
      'text-xl font-bold text-white mb-3 transition duration-300',
      hexBaseClasses.title
    ].join(' ')
  }

  return [
    'text-xl font-bold text-white mb-3 transition duration-300',
    presetColorClasses[props.color].title
  ].join(' ')
})

const linkClasses = computed(() => {
  if (isHexColor.value) {
    return [
      'px-4 py-2 rounded-xl text-sm font-semibold border transition duration-300',
      hexBaseClasses.link
    ].join(' ')
  }

  return [
    'px-4 py-2 rounded-xl text-sm font-semibold border transition duration-300',
    presetColorClasses[props.color].link
  ].join(' ')
})

// Thêm computed cho nút truy cập nhanh
const quickAccessClasses = computed(() => {
  if (isHexColor.value) {
    return [
      'px-4 py-2 rounded-xl text-sm font-semibold border transition duration-300',
      hexBaseClasses.quickAccess
    ].join(' ')
  }

  return [
    'px-4 py-2 rounded-xl text-sm font-semibold border transition duration-300',
    presetColorClasses[props.color].quickAccess
  ].join(' ')
})

// Dynamic styles for hex colors
const linkStyles = computed(() => {
  if (!isHexColor.value) return {};

  return {
    'background-color': `${hexColor.value}10`,
    'color': hexColor.value,
    'border-color': `${hexColor.value}20`,
    '--hover-color': hexColor.value,
    '--hover-border-color': hexColor.value
  };
});

const quickAccessStyles = computed(() => {
  if (!isHexColor.value) return {};

  return {
    'color': hexColor.value,
    'border-color': `${hexColor.value}50`,
    '--hover-color': hexColor.value,
    '--hover-bg-color': hexColor.value
  };
});

const titleStyles = computed(() => {
  if (!isHexColor.value) return {};

  return {
    '--hover-color': adjustColor(hexColor.value, 40), // Làm sáng hơn cho title khi hover
    'color': 'white'
  };
});

const cardStyles = computed(() => {
  if (!isHexColor.value) return {};

  return {
    '--card-color': hexColor.value,
    '--card-hover-color': adjustColor(hexColor.value, 30)
  };
});

// Helper function để điều chỉnh độ sáng của màu
function adjustColor(hex, percent) {
  // Chuyển hex sang RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Điều chỉnh độ sáng
  r = Math.min(255, Math.max(0, r + percent * 255 / 100));
  g = Math.min(255, Math.max(0, g + percent * 255 / 100));
  b = Math.min(255, Math.max(0, b + percent * 255 / 100));

  // Chuyển lại thành hex
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}
</script>

<style scoped>
i {
  font-size: 24px;
  transition: color 0.3s ease;
}

/* Base styles for hex colors */
.glass-card-base[style*="--card-color"] {
  & .fas {
    color: var(--icon-color, inherit);
  }

  & i.transition {
    color: var(--icon-color, inherit);
  }

  &:hover {
    & .fas {
      color: var(--icon-hover-color, var(--icon-color));
    }

    & i.transition {
      color: var(--icon-hover-color, var(--icon-color));
    }
  }
}

/* Title hover effect */
.glass-card-base[style*="--hover-color"] {
  & h3 {
    transition: color 0.3s ease;
  }

  &:hover h3 {
    color: var(--hover-color) !important;
  }
}

/* Link button styles */
.glass-card-base[style*="--hover-color"] {
  & a[style*="--hover-color"] {
    transition: all 0.3s ease;

    & i {
      transition: color 0.3s ease;
    }

    &:hover {
      background-color: var(--hover-color) !important;
      border-color: var(--hover-border-color, var(--hover-color)) !important;

      & i {
        color: white !important;
      }
    }
  }
}

/* Quick access button styles */
.glass-card-base[style*="--hover-bg-color"] {
  & .router-link[style*="--hover-bg-color"] {
    transition: all 0.3s ease;

    & i {
      transition: color 0.3s ease;
    }

    &:hover {
      background-color: var(--hover-bg-color) !important;

      & i {
        color: white !important;
      }
    }
  }
}

/* Preset color fallbacks */
.hover\:bg-blue-700:hover {
  background-color: rgb(29 78 216 / 1);
}

.hover\:bg-purple-500:hover {
  background-color: rgb(168 85 247 / 1);
}

.hover\:bg-teal-500:hover {
  background-color: rgb(20 184 166 / 1);
}

/* Icon color adjustments for preset */
.text-blue-400 {
  color: rgb(96 165 250 / 1);
}
.text-purple-400 {
  color: rgb(192 132 252 / 1);
}
.text-teal-400 {
  color: rgb(45 212 191 / 1);
}
</style>