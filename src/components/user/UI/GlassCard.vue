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
    <div v-if="iconName" :class="iconContainerClasses" :style="iconContainerStyles" class="icon">
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

    <!-- Statistics Section - hiển thị nếu có statLabel hoặc statNumber -->
    <div v-if="hasStatistics" class="mt-6 p-4 bg-slate-900/30 rounded-xl">
      <div v-if="statLabel" class="text-sm text-slate-400">{{ statLabel }}</div>
      <div v-if="statNumber" :class="statNumberClasses" :style="statNumberStyles">
        {{ statNumber }}
      </div>
    </div>

    <!-- Link - chỉ hiển thị khi có link hoặc quickAccessUrl hoặc slot link -->
    <div v-if="hasLinkSection" class="mt-6 space-y-3">
      <!-- Container cho 2 nút hiển thị cùng hàng -->
      <!-- Link chính -->
      <div v-if="!useTag_a_Link" class="flex flex-row gap-3">
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

      <div v-else class="flex flex-row gap-3">
        <a
            v-if="link"
            :href="link"
            :class="linkClasses"
            class="glass-card-link inline-flex items-center gap-2 justify-center flex-1 text-center"
            :style="linkStyles"
        >
          {{ linkText }}
          <i class="fas fa-chevron-right text-xs transition"></i>
        </a>

        <!-- Nút Truy cập nhanh -->
        <a
            v-if="quickAccessUrl"
            :href="quickAccessUrl"
            :class="quickAccessClasses"
            class="glass-card-quick-access inline-flex items-center gap-2 justify-center flex-1 text-center"
            :style="quickAccessStyles"
        >
          <i class="fas fa-bolt text-xs transition"></i>
          {{ quickAccessText }}
        </a>
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
      const presetColors = ['blue', 'purple', 'teal', 'pink', 'amber', 'orange', 'sky', 'cyan'];
      return presetColors.includes(value) || /^#[0-9A-F]{6}$/i.test(value);
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
  },
  // Thêm props cho phần thống kê
  statLabel: String,
  statNumber: String,
  // Thêm props cho gradient icon
  gradientClassIcon: {
    type: Boolean,
    default: false
  },

  useTag_a_Link: {
    type: Boolean,
    default: false
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

// Kiểm tra xem có phần thống kê không
const hasStatistics = computed(() => {
  return props.statLabel || props.statNumber;
});

// Class cho icon trong danh sách
const listItemIconClass = computed(() => {
  const baseClass = props.listDotIconClass;

  // Nếu đã có class màu, giữ nguyên
  if (baseClass.includes('text-')) {
    return baseClass;
  }

  // Thêm class màu dựa trên preset color
  if (!isHexColor.value && props.color) {
    // Tạo class màu tương ứng, ví dụ: 'fas fa-circle text-xs text-blue-400'
    return `${baseClass} text-${props.color}-400`;
  }

  return baseClass;
});

// Styles cho icon trong danh sách (áp dụng màu cho hex colors)
const listItemIconStyles = computed(() => {
  if (!isHexColor.value) return {};

  // Áp dụng màu hex cho bất kỳ icon nào trong danh sách
  return {
    'color': hexColor.value
  };
});

// Class cho số thống kê
const statNumberClasses = computed(() => {
  const baseClasses = ['font-bold text-white mt-1'];

  // Thêm kích thước font dựa trên padding
  if (props.padding === 'small') {
    baseClasses.push('text-xl');
  } else {
    baseClasses.push('text-2xl');
  }

  // Thêm màu sắc cho preset colors
  if (!isHexColor.value && props.color) {
    if (props.gradientClassIcon) {
      baseClasses.push(presetGradientColorClasses[props.color].statNumber);
    } else {
      baseClasses.push(presetColorClasses[props.color].statNumber);
    }
  }

  return baseClasses.join(' ');
});

// Styles cho số thống kê
const statNumberStyles = computed(() => {
  if (!isHexColor.value) return {};

  return {
    'color': hexColor.value
  };
});

const presetColorClasses = {
  blue: {
    title: 'group-hover:text-blue-400',
    iconContainer: 'bg-blue-500/10 group-hover:bg-blue-700 text-blue-400 group-hover:text-white',
    icon: 'text-blue-400 group-hover:text-white',
    link: 'text-blue-400 glass-card-border glass-card-border-blue hover:bg-blue-700 hover:text-white hover:border-blue-700',
    quickAccess: 'text-blue-400 glass-card-border glass-card-border-blue hover:text-white hover:border-blue-700 glass-card-quick-access-base',
    statNumber: 'text-blue-400'
  },
  purple: {
    title: 'group-hover:text-purple-400',
    iconContainer: 'bg-purple-500/10 group-hover:bg-purple-500 text-purple-400 group-hover:text-white',
    icon: 'text-purple-400 group-hover:text-white',
    link: 'text-purple-400 glass-card-border glass-card-border-purple hover:bg-purple-500 hover:text-white hover:border-purple-500',
    quickAccess: 'text-purple-400 glass-card-border glass-card-border-purple hover:text-white hover:border-purple-500 glass-card-quick-access-base',
    statNumber: 'text-purple-400'
  },
  teal: {
    title: 'group-hover:text-teal-400',
    iconContainer: 'bg-teal-500/10 group-hover:bg-teal-500 text-teal-400 group-hover:text-white',
    icon: 'text-teal-400 group-hover:text-white',
    link: 'text-teal-400 glass-card-border glass-card-border-teal hover:bg-teal-500 hover:text-white hover:border-teal-500',
    quickAccess: 'text-teal-400 glass-card-border glass-card-border-teal hover:text-white hover:border-teal-500 glass-card-quick-access-base',
    statNumber: 'text-teal-400'
  },
  // Màu hồng (pink)
  pink: {
    title: 'group-hover:text-pink-400',
    iconContainer: 'bg-pink-500/10 group-hover:bg-pink-600 text-pink-400 group-hover:text-white',
    icon: 'text-pink-400 group-hover:text-white',
    link: 'text-pink-400 glass-card-border glass-card-border-pink hover:bg-pink-600 hover:text-white hover:border-pink-600',
    quickAccess: 'text-pink-400 glass-card-border glass-card-border-pink hover:text-white hover:border-pink-600 glass-card-quick-access-base',
    statNumber: 'text-pink-400'
  },
  // Màu vàng cam (amber/orange)
  amber: {
    title: 'group-hover:text-amber-400',
    iconContainer: 'bg-amber-500/10 group-hover:bg-amber-600 text-amber-400 group-hover:text-white',
    icon: 'text-amber-400 group-hover:text-white',
    link: 'text-amber-400 glass-card-border glass-card-border-amber hover:bg-amber-600 hover:text-white hover:border-amber-600',
    quickAccess: 'text-amber-400 glass-card-border glass-card-border-amber hover:text-white hover:border-amber-600 glass-card-quick-access-base',
    statNumber: 'text-amber-400'
  },
  // Màu cam đậm hơn (orange)
  orange: {
    title: 'group-hover:text-orange-400',
    iconContainer: 'bg-orange-500/10 group-hover:bg-orange-600 text-orange-400 group-hover:text-white',
    icon: 'text-orange-400 group-hover:text-white',
    link: 'text-orange-400 glass-card-border glass-card-border-orange hover:bg-orange-600 hover:text-white hover:border-orange-600',
    quickAccess: 'text-orange-400 glass-card-border glass-card-border-orange hover:text-white hover:border-orange-600 glass-card-quick-access-base',
    statNumber: 'text-orange-400'
  },
  // Màu light blue (sky/cyan)
  sky: {
    title: 'group-hover:text-sky-400',
    iconContainer: 'bg-sky-500/10 group-hover:bg-sky-600 text-sky-400 group-hover:text-white',
    icon: 'text-sky-400 group-hover:text-white',
    link: 'text-sky-400 glass-card-border glass-card-border-sky hover:bg-sky-600 hover:text-white hover:border-sky-600',
    quickAccess: 'text-sky-400 glass-card-border glass-card-border-sky hover:text-white hover:border-sky-600 glass-card-quick-access-base',
    statNumber: 'text-sky-400'
  },
  // Alternative: cyan cũng là một lựa chọn tốt cho light blue
  cyan: {
    title: 'group-hover:text-cyan-400',
    iconContainer: 'bg-cyan-500/10 group-hover:bg-cyan-600 text-cyan-400 group-hover:text-white',
    icon: 'text-cyan-400 group-hover:text-white',
    link: 'text-cyan-400 glass-card-border glass-card-border-cyan hover:bg-cyan-600 hover:text-white hover:border-cyan-600',
    quickAccess: 'text-cyan-400 glass-card-border glass-card-border-cyan hover:text-white hover:border-cyan-600 glass-card-quick-access-base',
    statNumber: 'text-cyan-400'
  }
}

//Phiên bản màu sáng hơn
const presetGradientColorClasses = {
  purple: {
    title: 'group-hover:text-purple-300',
    iconContainer: 'bg-gradient-to-br from-purple-300/25 via-purple-300/15 to-purple-500/10 group-hover:from-purple-300 group-hover:via-purple-400 group-hover:to-purple-500 text-purple-300 group-hover:text-white',
    icon: 'text-purple-300 group-hover:text-white',
    link: 'text-purple-300 glass-card-border glass-card-border-purple hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-400 hover:text-white hover:border-purple-400',
    quickAccess: 'text-purple-300 glass-card-border glass-card-border-purple hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-400 hover:text-white hover:border-purple-400 glass-card-quick-access-base',
    statNumber: 'text-purple-300'
  },
  blue: {
    title: 'group-hover:text-blue-300',
    iconContainer: 'bg-gradient-to-br from-blue-300/25 via-blue-300/15 to-blue-500/10 group-hover:from-blue-300 group-hover:via-blue-400 group-hover:to-blue-500 text-blue-300 group-hover:text-white',
    icon: 'text-blue-300 group-hover:text-white',
    link: 'text-blue-300 glass-card-border glass-card-border-blue hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-400 hover:text-white hover:border-blue-400',
    quickAccess: 'text-blue-300 glass-card-border glass-card-border-blue hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-400 hover:text-white hover:border-blue-400 glass-card-quick-access-base',
    statNumber: 'text-blue-300'
  },
  green: {
    title: 'group-hover:text-green-300',
    iconContainer: 'bg-gradient-to-br from-green-300/25 via-green-300/15 to-green-500/10 group-hover:from-green-300 group-hover:via-green-400 group-hover:to-green-500 text-green-300 group-hover:text-white',
    icon: 'text-green-300 group-hover:text-white',
    link: 'text-green-300 glass-card-border glass-card-border-green hover:bg-gradient-to-r hover:from-green-300 hover:to-green-400 hover:text-white hover:border-green-400',
    quickAccess: 'text-green-300 glass-card-border glass-card-border-green hover:bg-gradient-to-r hover:from-green-300 hover:to-green-400 hover:text-white hover:border-green-400 glass-card-quick-access-base',
    statNumber: 'text-green-300'
  },
  amber: {
    title: 'group-hover:text-amber-300',
    iconContainer: 'bg-gradient-to-br from-amber-300/25 via-amber-300/15 to-amber-500/10 group-hover:from-amber-300 group-hover:via-amber-400 group-hover:to-amber-500 text-amber-300 group-hover:text-white',
    icon: 'text-amber-300 group-hover:text-white',
    link: 'text-amber-300 glass-card-border glass-card-border-amber hover:bg-gradient-to-r hover:from-amber-300 hover:to-amber-400 hover:text-white hover:border-amber-400',
    quickAccess: 'text-amber-300 glass-card-border glass-card-border-amber hover:bg-gradient-to-r hover:from-amber-300 hover:to-amber-400 hover:text-white hover:border-amber-400 glass-card-quick-access-base',
    statNumber: 'text-amber-300'
  },
  pink: {
    title: 'group-hover:text-pink-300',
    iconContainer: 'bg-gradient-to-br from-pink-300/25 via-pink-300/15 to-pink-500/10 group-hover:from-pink-300 group-hover:via-pink-400 group-hover:to-pink-500 text-pink-300 group-hover:text-white',
    icon: 'text-pink-300 group-hover:text-white',
    link: 'text-pink-300 glass-card-border glass-card-border-pink hover:bg-gradient-to-r hover:from-pink-300 hover:to-pink-400 hover:text-white hover:border-pink-400',
    quickAccess: 'text-pink-300 glass-card-border glass-card-border-pink hover:bg-gradient-to-r hover:from-pink-300 hover:to-pink-400 hover:text-white hover:border-pink-400 glass-card-quick-access-base',
    statNumber: 'text-pink-300'
  },
  indigo: {
    title: 'group-hover:text-indigo-300',
    iconContainer: 'bg-gradient-to-br from-indigo-300/25 via-indigo-300/15 to-indigo-500/10 group-hover:from-indigo-300 group-hover:via-indigo-400 group-hover:to-indigo-500 text-indigo-300 group-hover:text-white',
    icon: 'text-indigo-300 group-hover:text-white',
    link: 'text-indigo-300 glass-card-border glass-card-border-indigo hover:bg-gradient-to-r hover:from-indigo-300 hover:to-indigo-400 hover:text-white hover:border-indigo-400',
    quickAccess: 'text-indigo-300 glass-card-border glass-card-border-indigo hover:bg-gradient-to-r hover:from-indigo-300 hover:to-indigo-400 hover:text-white hover:border-indigo-400 glass-card-quick-access-base',
    statNumber: 'text-indigo-300'
  },
  teal: {
    title: 'group-hover:text-teal-300',
    iconContainer: 'bg-gradient-to-br from-teal-300/25 via-teal-300/15 to-teal-500/10 group-hover:from-teal-300 group-hover:via-teal-400 group-hover:to-teal-500 text-teal-300 group-hover:text-white',
    icon: 'text-teal-300 group-hover:text-white',
    link: 'text-teal-300 glass-card-border glass-card-border-teal hover:bg-gradient-to-r hover:from-teal-300 hover:to-teal-400 hover:text-white hover:border-teal-400',
    quickAccess: 'text-teal-300 glass-card-border glass-card-border-teal hover:bg-gradient-to-r hover:from-teal-300 hover:to-teal-400 hover:text-white hover:border-teal-400 glass-card-quick-access-base',
    statNumber: 'text-teal-300'
  },
  cyan: {
    title: 'group-hover:text-cyan-300',
    iconContainer: 'bg-gradient-to-br from-cyan-300/25 via-cyan-300/15 to-cyan-500/10 group-hover:from-cyan-300 group-hover:via-cyan-400 group-hover:to-cyan-500 text-cyan-300 group-hover:text-white',
    icon: 'text-cyan-300 group-hover:text-white',
    link: 'text-cyan-300 glass-card-border glass-card-border-cyan hover:bg-gradient-to-r hover:from-cyan-300 hover:to-cyan-400 hover:text-white hover:border-cyan-400',
    quickAccess: 'text-cyan-300 glass-card-border glass-card-border-cyan hover:bg-gradient-to-r hover:from-cyan-300 hover:to-cyan-400 hover:text-white hover:border-cyan-400 glass-card-quick-access-base',
    statNumber: 'text-cyan-300'
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

// Lấy preset color classes dựa trên gradientClassIcon
const getPresetColorClasses = computed(() => {
  return props.gradientClassIcon ? presetGradientColorClasses : presetColorClasses;
});

// Icon container classes
const iconContainerClasses = computed(() => {
  // Base classes cho icon container
  const baseClasses = [
    'w-16 h-16 rounded-xl flex items-center justify-center mb-4',
    'transition duration-300'
  ].join(' ');

  if (isHexColor.value) {
    return [
      baseClasses,
      'bg-gradient-to-br from-white/5 to-transparent'
    ].join(' ');
  }

  // Nếu là preset color, thêm các class tương ứng
  const presetClasses = getPresetColorClasses.value[props.color];
  return [
    baseClasses,
    presetClasses.iconContainer
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

  const presetClasses = getPresetColorClasses.value[props.color];
  return [
    'transition duration-300',
    presetClasses.icon
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

  const presetClasses = getPresetColorClasses.value[props.color];
  return [
    ...baseClasses,
    presetClasses.title
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

  const presetClasses = getPresetColorClasses.value[props.color];
  return [
    'px-4 py-2 rounded-xl text-sm font-semibold transition duration-300',
    presetClasses.link,
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

  const presetClasses = getPresetColorClasses.value[props.color];
  return [
    'px-4 py-2 rounded-xl text-sm font-semibold transition duration-300',
    presetClasses.quickAccess,
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
.glass-card-base .icon:hover {
  transform: scale(1.1) rotate(5deg);
}

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

.glass-card-border-pink {
  border-color: rgb(236 72 153) !important;
}

.glass-card-border-amber {
  border-color: rgb(245 158 11) !important;
}

.glass-card-border-orange {
  border-color: rgb(249 115 22) !important;
}

.glass-card-border-sky {
  border-color: rgb(14 165 233) !important;
}

.glass-card-border-cyan {
  border-color: rgb(6 182 212) !important;
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

.glass-card-link.text-blue-300:hover {
  background-color: rgb(59 130 246) !important;
  border-color: rgb(59 130 246) !important;
}

.glass-card-link.text-purple-400:hover {
  background-color: rgb(147 51 234) !important;
  border-color: rgb(147 51 234) !important;
}

.glass-card-link.text-purple-300:hover {
  background-color: rgb(168 85 247) !important;
  border-color: rgb(168 85 247) !important;
}

.glass-card-link.text-teal-400:hover {
  background-color: rgb(13 148 136) !important;
  border-color: rgb(13 148 136) !important;
}

.glass-card-link.text-teal-300:hover {
  background-color: rgb(20 184 166) !important;
  border-color: rgb(20 184 166) !important;
}

.glass-card-link.text-pink-400:hover {
  background-color: rgb(219 39 119) !important;
  border-color: rgb(219 39 119) !important;
}

.glass-card-link.text-pink-300:hover {
  background-color: rgb(236 72 153) !important;
  border-color: rgb(236 72 153) !important;
}

.glass-card-link.text-amber-400:hover {
  background-color: rgb(217 119 6) !important;
  border-color: rgb(217 119 6) !important;
}

.glass-card-link.text-amber-300:hover {
  background-color: rgb(245 158 11) !important;
  border-color: rgb(245 158 11) !important;
}

.glass-card-link.text-orange-400:hover {
  background-color: rgb(234 88 12) !important;
  border-color: rgb(234 88 12) !important;
}

.glass-card-link.text-orange-300:hover {
  background-color: rgb(249 115 22) !important;
  border-color: rgb(249 115 22) !important;
}

.glass-card-link.text-sky-400:hover {
  background-color: rgb(2 132 199) !important;
  border-color: rgb(2 132 199) !important;
}

.glass-card-link.text-sky-300:hover {
  background-color: rgb(14 165 233) !important;
  border-color: rgb(14 165 233) !important;
}

.glass-card-link.text-cyan-400:hover {
  background-color: rgb(8 145 178) !important;
  border-color: rgb(8 145 178) !important;
}

.glass-card-link.text-cyan-300:hover {
  background-color: rgb(6 182 212) !important;
  border-color: rgb(6 182 212) !important;
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

.glass-card-quick-access.text-blue-300::before {
  background: linear-gradient(90deg, rgb(96 165 250) 0%, rgb(59 130 246) 100%);
}

.glass-card-quick-access.text-purple-400::before {
  background: linear-gradient(90deg, rgb(168 85 247) 0%, rgb(147 51 234) 100%);
}

.glass-card-quick-access.text-purple-300::before {
  background: linear-gradient(90deg, rgb(192 132 252) 0%, rgb(168 85 247) 100%);
}

.glass-card-quick-access.text-teal-400::before {
  background: linear-gradient(90deg, rgb(20 184 166) 0%, rgb(13 148 136) 100%);
}

.glass-card-quick-access.text-teal-300::before {
  background: linear-gradient(90deg, rgb(45 212 191) 0%, rgb(20 184 166) 100%);
}

.glass-card-quick-access.text-pink-400::before {
  background: linear-gradient(90deg, rgb(236 72 153) 0%, rgb(219 39 119) 100%);
}

.glass-card-quick-access.text-pink-300::before {
  background: linear-gradient(90deg, rgb(244 114 182) 0%, rgb(236 72 153) 100%);
}

.glass-card-quick-access.text-amber-400::before {
  background: linear-gradient(90deg, rgb(245 158 11) 0%, rgb(217 119 6) 100%);
}

.glass-card-quick-access.text-amber-300::before {
  background: linear-gradient(90deg, rgb(251 191 36) 0%, rgb(245 158 11) 100%);
}

.glass-card-quick-access.text-orange-400::before {
  background: linear-gradient(90deg, rgb(249 115 22) 0%, rgb(234 88 12) 100%);
}

.glass-card-quick-access.text-orange-300::before {
  background: linear-gradient(90deg, rgb(251 146 60) 0%, rgb(249 115 22) 100%);
}

.glass-card-quick-access.text-sky-400::before {
  background: linear-gradient(90deg, rgb(14 165 233) 0%, rgb(2 132 199) 100%);
}

.glass-card-quick-access.text-sky-300::before {
  background: linear-gradient(90deg, rgb(56 189 248) 0%, rgb(14 165 233) 100%);
}

.glass-card-quick-access.text-cyan-400::before {
  background: linear-gradient(90deg, rgb(6 182 212) 0%, rgb(8 145 178) 100%);
}

.glass-card-quick-access.text-cyan-300::before {
  background: linear-gradient(90deg, rgb(34 211 238) 0%, rgb(6 182 212) 100%);
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
.bg-pink-500\/10 {
  background-color: rgb(236 72 153 / 0.1);
}
.bg-amber-500\/10 {
  background-color: rgb(245 158 11 / 0.1);
}
.bg-orange-500\/10 {
  background-color: rgb(249 115 22 / 0.1);
}
.bg-sky-500\/10 {
  background-color: rgb(14 165 233 / 0.1);
}
.bg-cyan-500\/10 {
  background-color: rgb(6 182 212 / 0.1);
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

.group-hover\:bg-pink-600:hover {
  background-color: rgb(219 39 119 / 1) !important;
}

.group-hover\:bg-amber-600:hover {
  background-color: rgb(217 119 6 / 1) !important;
}

.group-hover\:bg-orange-600:hover {
  background-color: rgb(234 88 12 / 1) !important;
}

.group-hover\:bg-sky-600:hover {
  background-color: rgb(2 132 199 / 1) !important;
}

.group-hover\:bg-cyan-600:hover {
  background-color: rgb(8 145 178 / 1) !important;
}

/* Icon color adjustments for preset */
.text-blue-400 {
  color: rgb(96 165 250 / 1);
}
.text-blue-300 {
  color: rgb(147 197 253 / 1);
}
.text-purple-400 {
  color: rgb(192 132 252 / 1);
}
.text-purple-300 {
  color: rgb(216 180 254 / 1);
}
.text-teal-400 {
  color: rgb(45 212 191 / 1);
}
.text-teal-300 {
  color: rgb(94 234 212 / 1);
}
.text-pink-400 {
  color: rgb(244 114 182 / 1);
}
.text-pink-300 {
  color: rgb(249 168 212 / 1);
}
.text-amber-400 {
  color: rgb(251 191 36 / 1);
}
.text-amber-300 {
  color: rgb(252 211 77 / 1);
}
.text-orange-400 {
  color: rgb(251 146 60 / 1);
}
.text-orange-300 {
  color: rgb(253 186 116 / 1);
}
.text-sky-400 {
  color: rgb(56 189 248 / 1);
}
.text-sky-300 {
  color: rgb(125 211 252 / 1);
}
.text-cyan-400 {
  color: rgb(34 211 238 / 1);
}
.text-cyan-300 {
  color: rgb(103 232 249 / 1);
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

.glass-card-quick-access.text-blue-300:hover {
  border-color: rgb(59 130 246) !important;
}

.glass-card-quick-access.text-purple-400:hover {
  border-color: rgb(147 51 234) !important;
}

.glass-card-quick-access.text-purple-300:hover {
  border-color: rgb(168 85 247) !important;
}

.glass-card-quick-access.text-teal-400:hover {
  border-color: rgb(13 148 136) !important;
}

.glass-card-quick-access.text-teal-300:hover {
  border-color: rgb(20 184 166) !important;
}

.glass-card-quick-access.text-pink-400:hover {
  border-color: rgb(219 39 119) !important;
}

.glass-card-quick-access.text-pink-300:hover {
  border-color: rgb(236 72 153) !important;
}

.glass-card-quick-access.text-amber-400:hover {
  border-color: rgb(217 119 6) !important;
}

.glass-card-quick-access.text-amber-300:hover {
  border-color: rgb(245 158 11) !important;
}

.glass-card-quick-access.text-orange-400:hover {
  border-color: rgb(234 88 12) !important;
}

.glass-card-quick-access.text-orange-300:hover {
  border-color: rgb(249 115 22) !important;
}

.glass-card-quick-access.text-sky-400:hover {
  border-color: rgb(2 132 199) !important;
}

.glass-card-quick-access.text-sky-300:hover {
  border-color: rgb(14 165 233) !important;
}

.glass-card-quick-access.text-cyan-400:hover {
  border-color: rgb(8 145 178) !important;
}

.glass-card-quick-access.text-cyan-300:hover {
  border-color: rgb(6 182 212) !important;
}

/* Styles cho phần thống kê */
.glass-card-base > div:nth-last-child(2) {
  margin-bottom: 0;
}

/* Màu cho các dấu chấm trong danh sách cho preset colors */
.glass-card-base .list-dot-blue {
  color: rgb(96 165 250 / 1) !important;
}

.glass-card-base .list-dot-purple {
  color: rgb(192 132 252 / 1) !important;
}

.glass-card-base .list-dot-teal {
  color: rgb(45 212 191 / 1) !important;
}

.glass-card-base .list-dot-pink {
  color: rgb(244 114 182 / 1) !important;
}

.glass-card-base .list-dot-amber {
  color: rgb(251 191 36 / 1) !important;
}

.glass-card-base .list-dot-orange {
  color: rgb(251 146 60 / 1) !important;
}

.glass-card-base .list-dot-sky {
  color: rgb(56 189 248 / 1) !important;
}

.glass-card-base .list-dot-cyan {
  color: rgb(34 211 238 / 1) !important;
}
</style>