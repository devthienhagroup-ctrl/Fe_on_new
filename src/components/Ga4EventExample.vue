<template>
  <section class="ga4-demo">
    <h2>GA4 Event Demo</h2>
    <p>Nhấn các nút bên dưới để bắn sự kiện GA4 dùng module chung.</p>
    <div class="ga4-demo__actions">
      <button class="ga4-demo__button primary" @click="handlePrimaryClick">
        Gửi sự kiện CTA
      </button>
      <button class="ga4-demo__button secondary" @click="handleSecondaryClick">
        Gửi sự kiện tùy chỉnh
      </button>
    </div>
    <div class="ga4-demo__status" v-if="lastEvent">
      <strong>Đã gửi:</strong>
      <span>{{ lastEvent }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { event as gaEvent } from '../ga4'

const lastEvent = ref('')

const handlePrimaryClick = () => {
  gaEvent('cta_click', {
    section: 'GA4 demo',
    label: 'CTA đăng ký nhanh',
    timestamp: Date.now(),
  })
  lastEvent.value = 'cta_click'
}

const handleSecondaryClick = () => {
  gaEvent('custom_action', {
    feature: 'GA4 demo',
    description: 'Ví dụ bắn event tùy chỉnh',
    random_value: Math.random(),
  })
  lastEvent.value = 'custom_action'
}
</script>

<style scoped>
.ga4-demo {
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  max-width: 520px;
  margin: 24px auto;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.ga4-demo__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 16px;
}

.ga4-demo__button {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ga4-demo__button.primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.ga4-demo__button.secondary {
  background: #f3f4f6;
  color: #111827;
  border-color: #e5e7eb;
}

.ga4-demo__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.ga4-demo__status {
  margin-top: 16px;
  font-size: 14px;
  color: #111827;
}
</style>
