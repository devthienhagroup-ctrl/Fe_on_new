<template>
  <div class="stats-container">
    <div
        class="stat-item"
        v-for="(stat, index) in statsConfig.content"
        :key="index"
        @mouseenter="hoveredStat = index"
        @mouseleave="hoveredStat = null"
        :class="{
        hovered: hoveredStat === index,
        'auto-expanded': autoExpandedIndex === index
      }"
        :style="{
        background: gradientStyle,
        backgroundSize: '400% 400%'
      }"
    >
      <div
          class="stat-expanded"
          :class="{ active: hoveredStat === index || autoExpandedIndex === index }"
      >
        <div class="expanded-content">
          {{ stat.description }}
        </div>
        <div class="divider"></div>
      </div>
      <div class="stat-content">
        <div class="stat-icon">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-info">
          <div class="stat-number">
            {{ stat.number }}<sup>+</sup>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const props = defineProps({
  contentStats: Object
});

const hoveredStat = ref(null);
const autoExpandedIndex = ref(null);

// OBJECT CẤU HÌNH DUY NHẤT
let statsConfig = {
  // 1. NỘI DUNG VÀ ICON
  content: [
    {
      number: '1,000',
      label: 'Dự án đã triển khai',
      icon: 'fas fa-project-diagram',
      description: 'Chúng tôi đã triển khai thành công hơn 1,000 dự án bất động sản trên khắp cả nước, mang đến giải pháp tối ưu cho khách hàng.'
    },
    {
      number: '100',
      label: 'Chiến dịch',
      icon: 'fas fa-chart-line',
      description: 'Với hơn 100 chiến dịch marketing hiệu quả, chúng tôi đã giúp hàng ngàn khách hàng tiếp cận thị trường bất động sản một cách tối ưu nhất.'
    },
    {
      number: '500',
      label: 'Khách hàng',
      icon: 'fas fa-users',
      description: 'Hơn 500 khách hàng đã tin tưởng và lựa chọn dịch vụ của chúng tôi, mang lại sự hài lòng tuyệt đối về chất lượng và hiệu quả.'
    },
    {
      number: '200',
      label: 'Đối tác tiêu biểu',
      icon: 'fas fa-handshake',
      description: 'Chúng tôi tự hào hợp tác với hơn 200 đối tác uy tín trong ngành, tạo nên mạng lưới đa dạng và chất lượng cao.'
    }
  ],

  // 2. MÀU SẮC
  colors: {
    // Màu gradient cho background
    gradient: {
      color1: '#00C2FF',
      color2: '#031358',
      color3: '#0629BE'
    },

    // Màu chữ
    text: {
      number: '#FFFFFF',
      label: 'rgba(255, 255, 255, 0.9)',
      description: '#e1f2ff',
      sup: 'rgba(255, 255, 255, 0.8)'
    },

    // Màu icon
    icon: {
      default: '#FFFFFF',
      hover: '#FFFFFF'
    },

    // Màu divider
    divider: {
      color: '#FFFFFF',
      opacity: 0.7
    }
  },

  // 3. KÍCH THƯỚC VÀ TYPOGRAPHY
  typography: {
    number: {
      fontSize: '32px',
      fontWeight: '700',
      lineHeight: '1'
    },
    sup: {
      fontSize: '18px',
      fontWeight: '600'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500'
    },
    description: {
      fontSize: '13px',
      lineHeight: '1.4'
    },
    icon: {
      fontSize: '48px'
    }
  },

  // 4. KÍCH THƯỚC VÀ LAYOUT
  layout: {
    container: {
      maxWidth: '1400px',
      padding: '0 20px'
    },

    item: {
      height: '120px',
      expandedHeight: '220px',
      margin: '0 10px',
      borderRadius: '10px',
      shadow: '0 -5px 15px rgba(0, 0, 0, 0.1)',
      shadowHover: '0 -10px 25px rgba(0, 0, 0, 0.15)',
      translateY: '-20px'
    },

    expandedSection: {
      height: '100px'
    },

    contentPadding: '20px',

    // Khoảng cách giữa các phần tử
    spacing: {
      iconMargin: '15px',
      numberMargin: '5px',
      dividerMargin: '10px',
      dividerWidth: '40px',
      dividerHeight: '3px'
    },

    // Responsive
    tablet: {
      itemHeight: '110px',
      itemExpandedHeight: '200px',
      numberSize: '28px',
      supSize: '16px',
      iconSize: '42px'
    },

    mobile: {
      itemHeight: '100px',
      itemExpandedHeight: '180px',
      itemMargin: '20px',
      itemFlexBasis: 'calc(50% - 20px)',
      numberSize: '24px',
      supSize: '14px',
      iconSize: '36px',
      labelSize: '12px',
      descriptionSize: '12px',
      contentPadding: '15px'
    },

    smallMobile: {
      itemFlexBasis: '100%',
      numberSize: '22px',
      supSize: '12px',
      iconSize: '32px',
      labelSize: '11px'
    },

    tinyMobile: {
      numberSize: '20px',
      supSize: '11px',
      iconSize: '28px',
      labelSize: '10px',
      descriptionSize: '11px'
    }
  }
};
// console.log("Stats nhận được",props.contentStats)
if(props.contentStats) statsConfig = props.contentStats.contentJson;
else console.log("stats đang lấy dữ liệu mẫu")
// console.log(JSON.stringify(statsConfig));
// Sử dụng gradient từ config
const gradientColors = ref({ ...statsConfig.colors.gradient });

// Computed property để tạo gradient string
const gradientStyle = computed(() => {
  return `linear-gradient(135deg, ${gradientColors.value.color1}, ${gradientColors.value.color2}, ${gradientColors.value.color3})`;
});

// Hàm để thay đổi màu từ bên ngoài
const setGradientColors = (color1, color2, color3) => {
  gradientColors.value = {
    color1: color1 || gradientColors.value.color1,
    color2: color2 || gradientColors.value.color2,
    color3: color3 || gradientColors.value.color3
  };
};

// Xuất hàm này để có thể gọi từ component cha
defineExpose({
  setGradientColors,
  gradientColors,
  statsConfig
});

// Tự động mở ngẫu nhiên một item khi component được tạo
onMounted(() => {
  // Thêm delay nhỏ để đảm bảo DOM đã render xong
  setTimeout(() => {
    autoExpandedIndex.value = Math.floor(Math.random() * statsConfig.content.length);

    // Tự động đóng sau 5 giây
    setTimeout(() => {
      autoExpandedIndex.value = null;
    }, 5000);
  }, 100);
});
</script>

<style scoped>
/* Container cho 4 ô thống kê */
.stats-container {
  position: absolute;
  bottom: -220px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: v-bind('statsConfig.layout.container.maxWidth');
  display: flex;
  justify-content: space-between;
  z-index: 3;
  padding: v-bind('statsConfig.layout.container.padding');
  align-items: flex-end;
}

.stat-item {
  position: relative;
  flex: 1;
  margin: v-bind('statsConfig.layout.item.margin');
  border-radius: v-bind('statsConfig.layout.item.borderRadius');
  box-shadow: v-bind('statsConfig.layout.item.shadow');
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  height: v-bind('statsConfig.layout.item.height');
  display: flex;
  flex-direction: column;
  transform: translateY(0);
  animation: gradientShift 8s ease infinite;
}

/* Chỉ còn animation cho background-position */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.stat-item.hovered,
.stat-item.auto-expanded {
  height: v-bind('statsConfig.layout.item.expandedHeight');
  box-shadow: v-bind('statsConfig.layout.item.shadowHover');
  transform: translateY(v-bind('statsConfig.layout.item.translateY'));
}

.stat-content {
  padding: v-bind('statsConfig.layout.contentPadding');
  display: flex;
  align-items: center;
  flex-shrink: 0;
  order: 2;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: v-bind('statsConfig.layout.item.height');
  pointer-events: none;
  transition: transform 0.3s ease;
}

.stat-item.hovered .stat-content,
.stat-item.auto-expanded .stat-content {
  transform: translateY(-10px);
}

.stat-content > * {
  pointer-events: auto;
}

.stat-icon {
  font-size: v-bind('statsConfig.typography.icon.fontSize');
  color: v-bind('statsConfig.colors.icon.default');
  margin-right: v-bind('statsConfig.layout.spacing.iconMargin');
  flex-shrink: 0;
  width: 60px;
  text-align: center;
  transition: transform 0.3s ease, color 0.3s ease;
}

.stat-item.hovered .stat-icon,
.stat-item.auto-expanded .stat-icon {
  transform: scale(1.1);
  color: v-bind('statsConfig.colors.icon.hover');
}

.stat-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: transform 0.3s ease;
}

.stat-item.hovered .stat-info,
.stat-item.auto-expanded .stat-info {
  transform: translateY(-5px);
}

.stat-number {
  font-size: v-bind('statsConfig.typography.number.fontSize');
  font-weight: v-bind('statsConfig.typography.number.fontWeight');
  color: v-bind('statsConfig.colors.text.number');
  margin-bottom: v-bind('statsConfig.layout.spacing.numberMargin');
  line-height: v-bind('statsConfig.typography.number.lineHeight');
  transition: transform 0.3s ease;
}

.stat-number sup {
  font-size: v-bind('statsConfig.typography.sup.fontSize');
  font-weight: v-bind('statsConfig.typography.sup.fontWeight');
  color: v-bind('statsConfig.colors.text.sup');
}

.stat-label {
  font-size: v-bind('statsConfig.typography.label.fontSize');
  color: v-bind('statsConfig.colors.text.label');
  font-weight: v-bind('statsConfig.typography.label.fontWeight');
  transition: transform 0.3s ease;
}

.stat-expanded {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: v-bind('statsConfig.layout.expandedSection.height');
  padding: 15px;
  transform: translateY(-100%);
  transition: transform 0.4s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  order: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  pointer-events: none;
}

.stat-expanded.active {
  transform: translateY(0);
}

.divider {
  width: v-bind('statsConfig.layout.spacing.dividerWidth');
  height: v-bind('statsConfig.layout.spacing.dividerHeight');
  background-color: v-bind('statsConfig.colors.divider.color');
  margin: v-bind('statsConfig.layout.spacing.dividerMargin') auto 0;
  border-radius: 2px;
  opacity: v-bind('statsConfig.colors.divider.opacity');
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.expanded-content {
  font-size: v-bind('statsConfig.typography.description.fontSize');
  color: v-bind('statsConfig.colors.text.description');
  line-height: v-bind('statsConfig.typography.description.lineHeight');
  margin-bottom: 10px;
  text-align: justify;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive cho tablet */
@media (max-width: 1024px) {
  .stats-container {
    max-width: 95%;
  }

  .stat-number {
    font-size: v-bind('statsConfig.layout.tablet.numberSize');
  }

  .stat-number sup {
    font-size: v-bind('statsConfig.layout.tablet.supSize');
  }

  .stat-icon {
    font-size: v-bind('statsConfig.layout.tablet.iconSize');
  }
}

@media (max-width: 1276px) {
  .stats-container {
    bottom: -80px;
  }
}

@media (max-width: 1000px) {
  .stat-expanded {
    height: 150px;
  }

  .stat-item.hovered,
  .stat-item.auto-expanded {
    height: 250px;
    box-shadow: 0 -10px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-15px);
  }
}

/* Responsive cho mobile */
@media (max-width: 900px) {
  .banner-container {
    margin-bottom: 0;
  }

  .stats-container {
    position: static;
    flex-wrap: wrap;
    padding: 20px;
    justify-content: center;
    transform: translateY(-20px);
    display: block;
    margin: 0 auto;
  }

  .stat-item {
    flex: 0 0 v-bind('statsConfig.layout.mobile.itemFlexBasis');
    margin: v-bind('statsConfig.layout.mobile.itemMargin');
    height: v-bind('statsConfig.layout.mobile.itemHeight');
  }

  .stat-item.hovered,
  .stat-item.auto-expanded {
    height: v-bind('statsConfig.layout.mobile.itemExpandedHeight');
    transform: translateY(-10px);
  }

  .stat-content {
    height: v-bind('statsConfig.layout.mobile.itemHeight');
    padding: v-bind('statsConfig.layout.mobile.contentPadding');
  }

  .stat-icon {
    font-size: v-bind('statsConfig.layout.mobile.iconSize');
    margin-right: 10px;
    width: 50px;
  }

  .stat-number {
    font-size: v-bind('statsConfig.layout.mobile.numberSize');
  }

  .stat-number sup {
    font-size: v-bind('statsConfig.layout.mobile.supSize');
  }

  .stat-label {
    font-size: v-bind('statsConfig.layout.mobile.labelSize');
  }

  .stat-expanded {
    height: 80px;
    padding: 10px;
  }

  .expanded-content {
    font-size: v-bind('statsConfig.layout.mobile.descriptionSize');
  }
}

/* Responsive cho mobile nhỏ hơn */
@media (max-width: 480px) {
  .stat-item {
    flex: 0 0 v-bind('statsConfig.layout.smallMobile.itemFlexBasis');
  }

  .stat-number {
    font-size: v-bind('statsConfig.layout.smallMobile.numberSize');
  }

  .stat-number sup {
    font-size: v-bind('statsConfig.layout.smallMobile.supSize');
  }

  .stat-icon {
    font-size: v-bind('statsConfig.layout.smallMobile.iconSize');
    margin-right: 8px;
    width: 45px;
  }

  .stat-label {
    font-size: v-bind('statsConfig.layout.smallMobile.labelSize');
  }
}

/* Responsive cho mobile rất nhỏ */
@media (max-width: 360px) {
  .stat-number {
    font-size: v-bind('statsConfig.layout.tinyMobile.numberSize');
  }

  .stat-number sup {
    font-size: v-bind('statsConfig.layout.tinyMobile.supSize');
  }

  .stat-icon {
    font-size: v-bind('statsConfig.layout.tinyMobile.iconSize');
    width: 40px;
  }

  .stat-label {
    font-size: v-bind('statsConfig.layout.tinyMobile.labelSize');
  }

  .expanded-content {
    font-size: v-bind('statsConfig.layout.tinyMobile.descriptionSize');
  }
}
</style>