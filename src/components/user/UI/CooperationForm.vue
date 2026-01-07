<!-- CooperationForm.vue -->
<template>
  <div class="bg-blue-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden" data-aos="zoom-in" data-aos-duration="1000">
    <!-- Decorative Circles (exact like original) -->
    <div class="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
    <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black opacity-10 rounded-full"></div>

    <h2 class="text-3xl md:text-5xl font-display font-bold text-white mb-6">{{ title }}</h2>
    <p class="text-blue-100 mb-10 max-w-2xl mx-auto text-lg">{{ description }}</p>

    <div class="flex flex-col md:flex-row justify-center gap-4 max-w-xl mx-auto">
      <input
          type="email"
          v-model="email"
          :placeholder="placeholder"
          class="px-6 py-4 rounded-full w-full text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-300"
      />
      <button
          @click="handleSubmit"
          class="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition shadow-lg whitespace-nowrap"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Sẵn sàng hợp tác cùng Thiên Hà Group?'
  },
  description: {
    type: String,
    default: 'Hãy để lại thông tin, đội ngũ chuyên gia của chúng tôi sẽ liên hệ tư vấn giải pháp tốt nhất cho bạn.'
  },
  placeholder: {
    type: String,
    default: 'Nhập email của bạn...'
  },
  buttonText: {
    type: String,
    default: 'Đăng ký ngay'
  }
})

const emit = defineEmits(['submit'])

const email = ref('')

const handleSubmit = () => {
  if (email.value) {
    emit('submit', email.value)
    email.value = ''
  }
}
</script>