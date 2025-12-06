<template>
  <div
      class="title-component"
      :class="{ 'right-layout': isRight }"
      :style="{
      width: componentWidth,
      height: componentHeight
    }"
  >
    <!-- Hình tròn -->
    <div
        class="circle-container"
        :style="{
        width: circleSize + 'px',
        height: circleSize + 'px'
      }"
    >
      <!-- Icon bên trong hình tròn -->
      <img
          :src="iconUrl"
          :alt="title"
          class="icon"
          :style="{
          width: iconWidth + 'px',
          height: iconHeight + 'px'
        }"
      />

      <!-- Số thứ tự -->
      <div class="order-number">
        {{ orderNumber }}
      </div>
    </div>

    <!-- Hình chữ nhật -->
    <div
        class="rectangle"
        :class="{ 'right-rectangle': isRight }"
        :style="{
        height: rectangleHeight,
        borderTopRightRadius: isRight ? '0' : borderRadius,
        borderBottomRightRadius: isRight ? '0' : borderRadius,
        borderTopLeftRadius: isRight ? borderRadius : '0',
        borderBottomLeftRadius: isRight ? borderRadius : '0',
        paddingLeft: isRight ? '20px' : ''
      }"
    >
      <h3 class="title" :class="{ 'right-title': isRight }">{{ title }}</h3>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // URL của icon
  iconUrl: {
    type: String,
    required: true
  },
  // Kích thước icon
  iconWidth: {
    type: [String, Number],
    default: 50
  },
  iconHeight: {
    type: [String, Number],
    default: 50
  },
  // Tiêu đề
  title: {
    type: String,
    required: true
  },
  // Kích thước component
  componentWidth: {
    type: String,
    default: '400px'
  },
  componentHeight: {
    type: String,
    default: '100px'
  },
  // Số thứ tự
  orderNumber: {
    type: [String, Number],
    required: true
  },
  // Kích thước hình tròn (tùy chọn)
  circleSize: {
    type: [String, Number],
    default: 100
  },
  // Layout bên phải
  isRight: {
    type: Boolean,
    default: false
  }
})

// Computed properties
const borderRadius = computed(() => {
  // Bo góc bằng chiều cao của hình chữ nhật
  return rectangleHeight.value;
})

const rectangleHeight = computed(() => {
  // Chiều cao = 70% chiều cao component
  const heightValue = parseInt(props.componentHeight);
  const unit = props.componentHeight.replace(heightValue, '');
  return (heightValue * 0.7) + unit;
})
</script>

<style scoped>
.title-component {
  display: flex;
  align-items: center;
  position: relative;
}

.title-component.right-layout {
  flex-direction: row-reverse;
}

.circle-container {
  position: relative;
  border: 2px solid #0827AF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  z-index: 2;
  flex-shrink: 0;
}

.icon {
  object-fit: contain;
  transform: translateY(-20px);
}

.order-number {
  position: absolute;
  bottom: -10px;
  background: #0827AF;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.rectangle {
  flex: 1;
  border: 2px solid #0827AF;
  border-left: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-left: -1px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  background: white;
}

.rectangle.right-rectangle {
  border-left: 2px solid #0827AF;
  border-right: 0;
  border-radius: 5px 0 0 5px;
  margin-left: 0;
  margin-right: -1px;
  padding-left: 20px; /* THÊM PADDING LEFT KHI LÀ RIGHT LAYOUT */
  padding-right: 20px;
}

.title {
  margin: 0;
  color: #031358;
  font-size: 20px;
  font-weight: bolder;
  text-align: left;
}

.title.right-title {
  text-align: right;
  width: 100%;
}
</style>