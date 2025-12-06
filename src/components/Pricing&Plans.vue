<template>
  <div class="upgrade-service" style="margin-top: 130px; margin-bottom: 100px" >
    <div class="development-notice">
      <div class="notice-content">
        <div class="icon-wrapper">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="notice-title">Tính năng đang phát triển</h2>
        <p class="notice-description">
          Chức năng nâng cấp gói dịch vụ hiện đang được phát triển và sẽ sớm có mặt.
          Chúng tôi đang nỗ lực để mang đến trải nghiệm tốt nhất cho bạn.
        </p>
        <div class="progress-indicator">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
          <span class="progress-text">Đang phát triển...</span>
        </div>
        <button class="back-button" @click="$router.back()">
          Quay lại
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceUpgrade',
  data() {
    return {
      // Component data sẽ được thêm sau khi tính năng hoàn thiện
    }
  },
  methods: {
    // Methods sẽ được thêm sau khi tính năng hoàn thiện
  }
}
</script>

<style scoped>
.upgrade-service {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.development-notice {
  background: white;
  border-radius: 12px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.notice-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.icon-wrapper {
  color: #3b82f6;
  margin-bottom: 1rem;
}

.notice-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.notice-description {
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

.progress-indicator {
  width: 100%;
  max-width: 300px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 3px;
  animation: progressAnimation 2s ease-in-out infinite;
}

.progress-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.back-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.back-button:hover {
  background-color: #2563eb;
}

@keyframes progressAnimation {
  0% {
    width: 0%;
    transform: translateX(-100%);
  }
  50% {
    width: 60%;
    transform: translateX(0%);
  }
  100% {
    width: 100%;
    transform: translateX(100%);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .upgrade-service {
    padding: 1rem;
  }

  .development-notice {
    padding: 2rem 1.5rem;
  }

  .notice-title {
    font-size: 1.25rem;
  }
}
</style>