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
    <div class="step-content">
      <div class="dashed-line"></div>
      <div class="content-text" v-html="content"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
.process-step {
  width: 100%;
  margin-bottom: 20px;
}

/* Title Section Styles */
.step-title {
  width: 100%;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 16px;
}



.circle-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #002FFF;
  background-color: white;
  color: #002FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 20px;
}

.title-content {
  position: relative;
  flex-grow: 1;
}

.title-text {
  height: 68px;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #031358;
  font-weight: bold;
  padding-left: 70px;
}

.rectangle-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 68px;
  border-bottom: 5px solid #002FFF;
  border-bottom-right-radius: 32px;
  pointer-events: none;
}

.icon-wrapper {
  position: absolute;
  bottom: -10pxpx;
  left: 0;
  height: 68px;
  display: flex;
  align-items: center;
  padding-right: 16px;
}

.step-icon {
  font-size: 40px;
  color: #002FFF;
}

/* Content Section Styles */
.step-content {
  position: relative;
  margin-top: 10px;
  padding-left: 25px;
}

.dashed-line {
  position: absolute;
  left: 76px;
  top: -30px;
  width: 2px;
  border-left: 2px dashed #002FFF;
  height: 50px;
}

.content-text {
  margin-top: 30px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 17px;
  color: #031358;
  line-height: 1.5;
  margin-left: 30px;
  position: relative;
  z-index: 1;
}

/* Optional: Add some responsive design */
@media (max-width: 768px) {
  .title-left {
    gap: 12px;
  }

  .circle-number {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .title-text {
    font-size: 18px;
    height: 60px;
  }

  .rectangle-border {
    height: 60px;
    border-bottom-right-radius: 60px;
  }

  .icon-wrapper {
    height: 60px;
  }

  .content-text {
    font-size: 16px;
    padding: 16px;
  }
}
</style>