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
    <div v-if="iconName" :class="iconContainerClasses" :style="iconContainerStyles">
      <i :class="iconName" class="transition" :style="iconStyles"></i>
    </div>

    <!-- Title -->
    <h3 v-if="title" :class="titleClasses" :style="titleStyles">
      {{ title }}
    </h3>

    <!-- Content - flex-grow để chiếm không gian còn lại -->
    <div class="text-slate-400 text-sm leading-relaxed flex-grow text-justify font-open-sans">
      <slot></slot>
    </div>

    <!-- List Content -->
    <ul v-if="hasListContent" class="space-y-2 mt-4 p-0">
      <li v-for="(item, index) in listContent" :key="index" class="flex items-center text-sm text-slate-400">
        <i :class="listItemIconClass" class="mr-2" :style="listItemIconStyles" style="font-size: 14px"></i>
        {{ item }}
      </li>
    </ul>

    <!-- Link - chỉ hiển thị khi có link hoặc quickAccessUrl hoặc slot link -->
    <div v-if="hasLinkSection" class="mt-6 space-y-3">
      <!-- Container cho 2 nút hiển thị cùng hàng -->
      <!-- Link chính -->
      <div class="flex flex-row gap-3">
        <router-link
            v-if="link"
            :to="link"
            :class="linkClasses"
            class="glass-card-link inline-flex items-center gap-2 justify-center flex-1 text-center"
            :style="linkStyles"
        >
          {{ linkText }}
          <i class="fas fa-chevron-right text-xs transition"></i>
        </router-link>

        <!-- Nút Truy cập nhanh -->
        <router-link
            v-if="quickAccessUrl"
            :to="quickAccessUrl"
            :class="quickAccessClasses"
            class="glass-card-quick-access inline-flex items-center gap-2 justify-center flex-1 text-center"
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
  aosDelay: String,
  // Thêm props cho danh sách nội dung
  listContent: {
    type: Array,
    default: () => []
  },
  listDotIconClass: {
    type: String,
    default: 'fas fa-circle text-xs' // Mặc định là dấu chấm tròn
  }
})

// Check if color is a preset or hex
const isHexColor = computed(() => {
  return /^#[0-9A-F]{6}$/i.test(props.color);
});

// Kiểm tra xem có nội dung danh sách không
const hasListContent = computed(() => {
  return props.listContent && props.listContent.length > 0;
});

// Class cho icon trong danh sách
const listItemIconClass = computed(() => {
  return props.listDotIconClass;
});

// Styles cho icon trong danh sách (áp dụng màu cho hex colors)
const listItemIconStyles = computed(() => {
  if (!isHexColor.value) return {};

  // Nếu là icon mặc định (fas fa-circle), áp dụng màu
  if (props.listDotIconClass === 'fas fa-circle text-xs') {
    return {
      'color': hexColor.value
    };
  }

  return {};
});

// Sửa preset color classes để điều chỉnh hover effect
const presetColorClasses = {
  blue: {
    title: 'group-hover:text-blue-400',
    iconContainer: 'bg-blue-500/10 group-hover:bg-blue-700 text-blue-400 group-hover:text-white',
    icon: 'text-blue-400 group-hover:text-white',
    // Sửa: Nút "Xem chi tiết" có hiệu ứng hover solid fill
    link: 'text-blue-400 glass-card-border glass-card-border-blue hover:bg-blue-700 hover:text-white hover:border-blue-700',
    // Sửa: Nút "Truy cập nhanh" có hiệu ứng gradient từ trái sang phải
    quickAccess: 'text-blue-400 glass-card-border glass-card-border-blue hover:text-white hover:border-blue-700 glass-card-quick-access-base'
  },
  purple: {
    title: 'group-hover:text-purple-400',
    iconContainer: 'bg-purple-500/10 group-hover:bg-purple-500 text-purple-400 group-hover:text-white',
    icon: 'text-purple-400 group-hover:text-white',
    link: 'text-purple-400 glass-card-border glass-card-border-purple hover:bg-purple-500 hover:text-white hover:border-purple-500',
    quickAccess: 'text-purple-400 glass-card-border glass-card-border-purple hover:text-white hover:border-purple-500 glass-card-quick-access-base'
  },
  teal: {
    title: 'group-hover:text-teal-400',
    iconContainer: 'bg-teal-500/10 group-hover:bg-teal-500 text-teal-400 group-hover:text-white',
    icon: 'text-teal-400 group-hover:text-white',
    link: 'text-teal-400 glass-card-border glass-card-border-teal hover:bg-teal-500 hover:text-white hover:border-teal-500',
    quickAccess: 'text-teal-400 glass-card-border glass-card-border-teal hover:text-white hover:border-teal-500 glass-card-quick-access-base'
  }
}

// Sửa base classes cho hex colors
const hexBaseClasses = {
  title: 'group-hover:opacity-90',
  iconContainer: '',
  icon: 'opacity-90 group-hover:opacity-100',
  // Sửa: Nút "Xem chi tiết" có hiệu ứng hover solid fill
  link: 'glass-card-border glass-card-border-hex hover:text-white',
  // Sửa: Nút "Truy cập nhanh" có hiệu ứng gradient từ trái sang phải
  quickAccess: 'glass-card-border glass-card-border-hex hover:text-white glass-card-quick-access-base'
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

// Kiểm tra xem có phần link không
const hasLinkSection = computed(() => {
  return props.link || props.quickAccessUrl || hasSlotLink.value;
});

// Kiểm tra xem có slot link không
const hasSlotLink = computed(() => {
  // Giả sử bạn có cách để kiểm tra slot
  // Nếu không thể kiểm tra slot, bạn có thể dùng một prop khác
  return false; // Thay đổi nếu có cách kiểm tra slot
});

// Dynamic styles cho các thành phần
const hexColor = computed(() => props.color);

// Icon container classes
const iconContainerClasses = computed(() => {
  // Base classes cho icon container
  const baseClasses = [
    'w-16 h-16 rounded-xl flex items-center justify-center mb-4',
    'bg-gradient-to-br from-white/5 to-transparent',
    'transition duration-300'
  ].join(' ');

  if (isHexColor.value) {
    return baseClasses;
  }

  // Nếu là preset color, thêm các class tương ứng
  return [
    baseClasses,
    presetColorClasses[props.color].iconContainer
  ].join(' ');
});

// Icon classes
const iconClasses = computed(() => {
  if (isHexColor.value) {
    return [
      'transition duration-300',
      hexBaseClasses.icon
    ].join(' ')
  }

  return [
    'transition duration-300',
    presetColorClasses[props.color].icon
  ].join(' ')
});

// Icon styles cho hex colors
const iconStyles = computed(() => {
  if (!isHexColor.value) return {};
  return {
    'color': hexColor.value,
  };
});

// Icon container styles cho hex colors - SỬA LẠI Ở ĐÂY
const iconContainerStyles = computed(() => {
  if (!isHexColor.value) return {};

  // Chuyển hex sang rgba để có opacity
  const hex = hexColor.value;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return {
    '--icon-bg-color': `rgba(${r}, ${g}, ${b}, 0.1)`,
    '--icon-color': hexColor.value,
  };
});

const titleClasses = computed(() => {
  const baseClasses = [
    'text-xl font-bold text-white transition duration-300',
    'font-open-sans'
  ];

  // Thêm margin-bottom dựa trên padding
  if (props.padding === 'small') {
    baseClasses.push('mb-1', 'text-left');
  } else if (props.padding === 'large') {
    baseClasses.push('mb-3');
  } else {
    baseClasses.push('mb-3');
  }

  if (isHexColor.value) {
    return [
      ...baseClasses,
      hexBaseClasses.title
    ].join(' ')
  }

  return [
    ...baseClasses,
    presetColorClasses[props.color].title
  ].join(' ')
})

const linkClasses = computed(() => {
  if (isHexColor.value) {
    return [
      'px-4 py-2 rounded-xl text-sm font-semibold transition duration-300',
      hexBaseClasses.link,
      'font-open-sans'
    ].join(' ')
  }

  return [
    'px-4 py-2 rounded-xl text-sm font-semibold transition duration-300',
    presetColorClasses[props.color].link,
    'font-open-sans'
  ].join(' ')
})

// Thêm computed cho nút truy cập nhanh
const quickAccessClasses = computed(() => {
  if (isHexColor.value) {
    return [
      'px-4 py-2 rounded-xl text-sm font-semibold transition duration-300',
      hexBaseClasses.quickAccess,
      'font-open-sans'
    ].join(' ')
  }

  return [
    'px-4 py-2 rounded-xl text-sm font-semibold transition duration-300',
    presetColorClasses[props.color].quickAccess,
    'font-open-sans'
  ].join(' ')
})

// Dynamic styles for hex colors
// Sửa linkStyles cho hex colors (nút "Xem chi tiết")
const linkStyles = computed(() => {
  if (!isHexColor.value) return {};

  return {
    'color': hexColor.value,
    '--border-color': hexColor.value,
    '--hover-bg-color': hexColor.value,
    '--hover-border-color': adjustColor(hexColor.value, -10), // Màu đậm hơn 1 chút
  };
});

// Sửa quickAccessStyles cho hex colors (nút "Truy cập nhanh")
const quickAccessStyles = computed(() => {
  if (!isHexColor.value) return {};

  // Tạo gradient từ màu chính sang màu đậm hơn
  const mainColor = hexColor.value;
  const darkerColor = adjustColor(hexColor.value, -15); // Đậm hơn 15%

  return {
    'color': hexColor.value,
    '--border-color': hexColor.value,
    '--gradient-from': mainColor,
    '--gradient-to': darkerColor,
    '--hover-border-color': darkerColor,
  };
});

const titleStyles = computed(() => {
  if (!isHexColor.value) return {};

  return {
    '--hover-color': adjustColor(hexColor.value, 40),
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
/* Font Open Sans */
.font-open-sans {
  font-family: 'Open Sans', sans-serif;
}

i {
  font-size: 24px;
  transition: color 0.3s ease, transform 0.3s ease;
}

/* Icon container transition */
.glass-card-base > div:first-child {
  transition: all 0.3s ease;
}

/* Icon hover effect cho preset colors */
.glass-card-base:hover > div:first-child i {
  transform: scale(1.1);
}

/* Hex color icon container styles - ĐÃ SỬA */
.glass-card-base[style*="--card-color"] > div:first-child {
  background-color: var(--icon-bg-color, inherit) !important;
}

.glass-card-base[style*="--card-color"]:hover > div:first-child {
  background-color: var(--card-color) !important;
}

/* Icon color cho hex colors */
.glass-card-base[style*="--card-color"] > div:first-child i {
  color: var(--icon-color, inherit) !important;
  transition: color 0.3s ease, transform 0.3s ease;
}

.glass-card-base[style*="--card-color"]:hover > div:first-child i {
  color: white !important;
  transform: scale(1.1);
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

/* Custom border classes để tránh xung đột với Bootstrap */
.glass-card-border {
  border-width: 1px !important;
  border-style: solid !important;
}

.glass-card-border-blue {
  border-color: rgb(96 165 250) !important;
}

.glass-card-border-purple {
  border-color: rgb(192 132 252) !important;
}

.glass-card-border-teal {
  border-color: rgb(45 212 191) !important;
}

.glass-card-border-hex {
  border-color: var(--border-color, currentColor) !important;
}

/* Link button styles - GIỮ NGUYÊN HIỆU ỨNG CŨ */
.glass-card-link {
  transition: all 0.3s ease;
  background-color: transparent;
}

.glass-card-link:hover {
  color: white !important;
}

.glass-card-link:hover i {
  color: white !important;
}

/* Link button styles cho nút "Xem chi tiết" với hex colors - HIỆU ỨNG FILL */
.glass-card-link[style*="--hover-bg-color"] {
  transition: all 0.3s ease;
  background-color: transparent;
}

.glass-card-link[style*="--hover-bg-color"]:hover {
  background-color: var(--hover-bg-color) !important;
  border-color: var(--hover-border-color) !important;
  color: white !important;
}

/* Preset color styles cho nút "Xem chi tiết" - HIỆU ỨNG FILL */
.glass-card-link.text-blue-400:hover {
  background-color: rgb(37 99 235) !important;
  border-color: rgb(37 99 235) !important;
}

.glass-card-link.text-purple-400:hover {
  background-color: rgb(147 51 234) !important;
  border-color: rgb(147 51 234) !important;
}

.glass-card-link.text-teal-400:hover {
  background-color: rgb(13 148 136) !important;
  border-color: rgb(13 148 136) !important;
}

/* Base class cho nút truy cập nhanh */
.glass-card-quick-access-base {
  position: relative;
  overflow: hidden;
  z-index: 1;
  background-color: transparent;
  transition: all 0.3s ease;
}

/* Hiệu ứng gradient fill từ trái sang phải cho nút "Truy cập nhanh" với hex colors */
.glass-card-quick-access[style*="--gradient-from"] {
  position: relative;
  z-index: 1;
}

.glass-card-quick-access[style*="--gradient-from"]::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--gradient-from) 0%, var(--gradient-to) 100%);
  transition: left 0.3s ease;
  z-index: -1;
}

.glass-card-quick-access[style*="--gradient-from"]:hover::before {
  left: 0;
}

.glass-card-quick-access[style*="--gradient-from"]:hover {
  border-color: var(--hover-border-color) !important;
  color: white !important;
}

/* Preset color cho nút "Truy cập nhanh" - HIỆU ỨNG GRADIENT FILL TỪ TRÁI SANG PHẢI */
.glass-card-quick-access.text-blue-400::before {
  background: linear-gradient(90deg, rgb(59 130 246) 0%, rgb(37 99 235) 100%);
}

.glass-card-quick-access.text-purple-400::before {
  background: linear-gradient(90deg, rgb(168 85 247) 0%, rgb(147 51 234) 100%);
}

.glass-card-quick-access.text-teal-400::before {
  background: linear-gradient(90deg, rgb(20 184 166) 0%, rgb(13 148 136) 100%);
}

/* Đảm bảo icon trong nút cũng đổi màu khi hover */
.glass-card-quick-access:hover i {
  color: white !important;
}

/* Preset color fallbacks */
.bg-blue-500\/10 {
  background-color: rgb(59 130 246 / 0.1);
}
.bg-purple-500\/10 {
  background-color: rgb(168 85 247 / 0.1);
}
.bg-teal-500\/10 {
  background-color: rgb(20 184 166 / 0.1);
}

.group-hover\:bg-blue-700:hover {
  background-color: rgb(29 78 216 / 1) !important;
}

.group-hover\:bg-purple-500:hover {
  background-color: rgb(168 85 247 / 1) !important;
}

.group-hover\:bg-teal-500:hover {
  background-color: rgb(20 184 166 / 1) !important;
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

.group-hover\:text-white:hover {
  color: white !important;
}

/* Thêm styles cho preset quick access buttons để đảm bảo hiệu ứng gradient */
.glass-card-quick-access-base::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  transition: left 0.3s ease;
  z-index: -1;
}

.glass-card-quick-access-base:hover::before {
  left: 0;
}

/* Đảm bảo text và icon nổi lên trên gradient */
.glass-card-quick-access-base > * {
  position: relative;
  z-index: 2;
}

/* Hiệu ứng cho preset quick access khi hover */
.glass-card-quick-access.text-blue-400:hover {
  border-color: rgb(37 99 235) !important;
}

.glass-card-quick-access.text-purple-400:hover {
  border-color: rgb(147 51 234) !important;
}

.glass-card-quick-access.text-teal-400:hover {
  border-color: rgb(13 148 136) !important;
}
</style>