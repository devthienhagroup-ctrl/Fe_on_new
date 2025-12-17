<template>
  <div class="process-step fade-left">
    <!-- Title Section -->
    <div class="step-title">
      <div class="title-left">
        <div class="circle-number">{{ number }}</div>
        <div class="title-content">
          <div class="title-text">{{ title }}</div>
          <div class="rectangle-border">
            <div class="icon-wrapper">
              <i :class="icon" v-if="icon" class="step-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="step-content rich-text-editor-wrapper">
      <div class="dashed-line"></div>
      <div class="content-text tiptap" v-html="content"></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  number: {
    type: [String, Number],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
/* CHỈ GIỮ LẠI CSS LAYOUT CƠ BẢN, không có giá trị cụ thể */
.process-step {
  width: 100%;
  margin-bottom: 20px;
}

.step-title {
  width: 100%;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-content {
  position: relative;
  flex-grow: 1;
}

.icon-wrapper {
  position: absolute;
  bottom: -10px;
  left: 0;
  height: 68px;
  display: flex;
  align-items: center;
  padding-right: 16px;
}

.step-content {
  position: relative;
  margin-top: 10px;
  padding-left: 25px;
}

/* Responsive - chỉ layout */
@media (max-width: 768px) {
  .title-left {
    gap: 12px;
  }

  .icon-wrapper {
    height: 60px;
  }
}
</style>