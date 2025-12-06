<template>
  <div class="support-container">
    <div class="support-header">
      <img src="/imgs/active-support-animate.svg" alt="Support" class="support-image">
      <h1 class="support-title">Thiên Hà Support</h1>
      <p class="support-subtitle">Luôn sẵn sàng đồng hành và giải đáp mọi thắc mắc của bạn.</p>
    </div>

    <div class="support-sections">
      <div
          v-for="(section, index) in supportSections"
          :key="index"
          class="support-section"
      >
        <h2 class="section-title">{{ section.title }}</h2>

        <!-- FAQ Section -->
        <div v-if="section.title === 'FAQ'" class="faq-container">
          <div
              v-for="(item, itemIndex) in section.items"
              :key="itemIndex"
              class="faq-item"
          >
            <div class="faq-question" @click="toggleFAQ(itemIndex)">
              <span>{{ item.question }}</span>
              <span class="faq-icon">{{ activeFAQ === itemIndex ? '−' : '+' }}</span>
            </div>
            <transition name="faq-slide">
              <div v-if="activeFAQ === itemIndex" class="faq-answer">
                <div v-if="item.steps" class="steps-container">
                  <ol>
                    <li v-for="(step, stepIndex) in item.steps" :key="stepIndex">
                      <span v-html="formatStepText(step)"></span>
                    </li>
                  </ol>
                </div>
                <div v-if="item.note" class="note-container">
                  <p class="note-text">{{ item.note }}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Contact Section -->
        <div v-else-if="section.link" class="contact-section">
          <p class="section-description">{{ section.description }}</p>
          <router-link :to="section.link" class="contact-link outline">
            <span>Gửi yêu cầu hỗ trợ</span>
            <span class="link-icon">→</span>
          </router-link>
        </div>

        <!-- Other Sections -->
        <div v-else class="other-section">
          <p class="section-description">{{ section.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeFAQ = ref(null)

const toggleFAQ = (index) => {
  activeFAQ.value = activeFAQ.value === index ? null : index
}

const formatStepText = (step) => {
  let formattedStep = step

  // Thay thế "Mật khẩu và đăng nhập" bằng link
  if (step.includes("Mật khẩu và đăng nhập")) {
    formattedStep = formattedStep.replace(
        "Mật khẩu và đăng nhập",
        `<a href="#" class="bold-link" data-route="/ho-so/bao-mat">Mật khẩu và đăng nhập</a>`
    )
  }

  // Thay thế "Thông tin cá nhân" bằng link
  if (step.includes("Thông tin cá nhân")) {
    formattedStep = formattedStep.replace(
        "Thông tin cá nhân",
        `<a href="#" class="bold-link" data-route="/ho-so/thong-tin-tai-khoan">Thông tin cá nhân</a>`
    )
  }

  // Xóa phần (/profile/security) và (/profile/info) trong ngoặc
  formattedStep = formattedStep.replace(/\s*\/(profile|ho-so)\/(security|info|bao-mat|thong-tin-tai-khoan)\)?/g, '')

  return formattedStep
}

// Hàm xử lý navigation
const navigateToRoute = (route) => {
  router.push(route)
}

// Xử lý click cho các link
const handleLinkClick = (event) => {
  if (event.target.classList.contains('bold-link')) {
    event.preventDefault()
    const route = event.target.getAttribute('data-route')
    if (route) {
      navigateToRoute(route)
    }
  }
}

// Thêm event listener khi component mounted
onMounted(() => {
  document.addEventListener('click', handleLinkClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleLinkClick)
})

const supportSections = [
  {
    "title": "FAQ",
    "items": [
      {
        "question": "Quên mật khẩu phải làm sao?",
        "steps": [
          "Trong phần cá nhân truy cập Mật khẩu và đăng nhập",
          "Chọn mục 'Quên mật khẩu'.",
          "Nhập email hiện tại của tài khoản và tiến hành xác thực OTP.",
          "Nhập mật khẩu mới và nhập lại mật khẩu mới.",
          "Lưu ý: Mật khẩu phải đủ mạnh để bảo vệ tài khoản của bạn."
        ]
      },
      {
        "question": "Cách cập nhật thông tin cá nhân?",
        "steps": [
          "Truy cập mục Thông tin cá nhân",
          "Cập nhật các thông tin bạn muốn thay đổi.",
          "Nhấn lưu để hoàn tất."
        ]
      },
      {
        "question": "Làm sao để thanh toán gói dịch vụ?",
        "note": "Tính năng đang phát triển."
      },
      {
        "question": "Có thể hủy gói đăng ký hiện tại không?",
        "note": "Tính năng đang phát triển."
      }
    ]
  },
  {
    "title": "Gửi yêu cầu hỗ trợ / Báo lỗi",
    "description": "Nếu bạn gặp vấn đề hoặc cần hỗ trợ, vui lòng gửi yêu cầu thông qua trang liên hệ.",
    "link": "/lien-he"
  },
  {
    "title": "Hướng dẫn sử dụng",
    "description": "Tổng hợp các hướng dẫn giúp bạn hiểu và sử dụng hệ thống dễ dàng hơn."
  }
]
</script>

<style scoped>
.support-container {
  width: 95%;
  height: 100%;
  font-family: 'Ubuntu', sans-serif;
  padding: 20px;
  box-sizing: border-box;
  margin: 0 auto;
}

.support-header {
  text-align: center;
  margin-bottom: 40px;
}

.support-image {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
}

.support-title {
  font-size: 33px;
  background: linear-gradient(to right, #031358, #0030FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 15px 0;
}

.support-subtitle {
  font-size: 17px;
  color: #333;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.5;
}

.support-sections {
  margin: 0 auto;
}

.support-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  color: #031358;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

/* FAQ Styles */
.faq-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.faq-item {
  border-bottom: 1px solid #eee;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.faq-question:hover {
  background-color: #f9f9f9;
}

.faq-icon {
  font-size: 20px;
  font-weight: bold;
  color: #0030FF;
  transition: transform 0.3s ease;
}

.faq-item.active .faq-icon {
  transform: rotate(180deg);
}

.faq-answer {
  overflow: hidden;
}

/* Animation for FAQ */
.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.faq-slide-enter-from,
.faq-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.faq-slide-enter-to,
.faq-slide-leave-from {
  max-height: 500px;
  opacity: 1;
}

.steps-container {
  padding: 0 20px 20px;
  background-color: #f9f9f9;
}

.steps-container ol {
  margin: 0;
  padding-left: 20px;
}

.steps-container li {
  margin-bottom: 10px;
  line-height: 1.5;
}

/* Bold link style */
:deep(.bold-link) {
  font-weight: bold;
  color: #0030FF;
  text-decoration: none;
  cursor: pointer;
}


.note-container {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 15px;
  margin: 10px 20px 20px;
}

.note-text {
  margin: 0;
  color: #856404;
  font-style: italic;
}

/* Contact Section Styles */
.contact-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-description {
  font-size: 17px;
  color: #000;
  margin-bottom: 20px;
  line-height: 1.5;
}

.contact-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  padding: 15px 20px;
  border-radius: 8px;
  transition: all 0.2s;
  border: 2px solid #0030FF;
  color: #0030FF;
  background: transparent;
}

.contact-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 48, 255, 0.2);
  background: rgba(0, 48, 255, 0.05);
}

.link-icon {
  font-size: 20px;
  font-weight: bold;
}

/* Other Sections Styles */
.other-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>