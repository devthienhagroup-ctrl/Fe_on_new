<template>
  <div class="faq-container">
    <div class="faq-header fade-left">
      <div class="question-mark">?</div>
      <h1 class="faq-title">Các câu hỏi thường gặp</h1>
    </div>

    <div class="faq-content">
      <ul class="faq-list">
        <li class="faq-item fade-right" v-for="(item, index) in faqItems" :key="index">
          <div class="item-content" @click="toggleItem(index)" :class="{ active: item.isOpen }">
            <span class="item-text">{{ item.text }}</span>
            <span class="triangle" :class="{ rotated: item.isOpen }">▶</span>
          </div>
          <div class="answer-wrapper" :style="{ maxHeight: item.isOpen ? getMaxHeight(index) + 'px' : '0px' }">
            <div class="answer-content" ref="answerElements" v-html="item.answer" v-highlight-links></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['navigateToValuation', 'navigateToCriteria', 'navigateToPricing'])

// Directive tùy chỉnh để xử lý click trên các link trong v-html
const vHighlightLinks = {
  mounted(el) {
    el.addEventListener('click', (event) => {
      const link = event.target.closest('.highlight-link')
      if (link) {
        event.preventDefault()
        event.stopPropagation()

        const actionType = link.dataset.action
        if (actionType) {
          handleAction(actionType, event)
        }
      }
    })
  }
}

const faqItems = ref([
  {
    text: 'Hướng dẫn sử dụng công cụ định giá?',
    answer: `
      Quý khách hãy truy cập vào trang định giá (ngay trên menu của bạn hoặc nhấn vào nút dưới đây),
      Quý khách tiếp tục nhấn vào nút "Định giá ngay".
      Tại đó quý khách cần cung cấp đầy đủ các thông tin được yêu cầu về tài sản để nhận được kết quả định giá tài sản.
      <span class="highlight-link" data-action="valuation">Đến trang định giá</span>
    `,
    isOpen: false
  },
  {
    text: 'Biểu phí tư vấn giá?',
    answer: `
      Nếu quý khách đang nói về tư vấn cơ bản, việc trao đổi qua form hoặc liên hệ trực tiếp thường không mất phí.
      Riêng các gói tư vấn chuyên sâu sẽ có báo giá cụ thể khi quý khách để lại thông tin.
      <span class="highlight-link" data-action="contact">Liên hệ ngay</span>
    `,
    isOpen: false
  },
  {
    text: 'Định giá bất động sản trực tuyến là gì',
    answer: `
      Là hình thức định giá thông qua website bằng cách nhập thông tin tài sản.
      Hệ thống sẽ dựa trên dữ liệu và thị trường để đưa ra mức giá ước tính giúp quý khách tham khảo nhanh mà không cần gặp trực tiếp.
    `,
    isOpen: false
  },
  {
    text: 'Các tiêu chí định giá bất động sản?',
    answer: `
      Một số yếu tố thường xuyên được dùng để định giá gồm: vị trí, diện tích, giấy tờ pháp lý, tình trạng nhà đất, tiện ích xung quanh, giao thông, và mặt bằng giá khu vực.
      <span class="highlight-link" data-action="criteria">Xem chi tiết</span>
    `,
    isOpen: false
  },
  {
    text: 'Việc sử dụng công cụ định giá bất động sản có mất phí không?',
    answer: `
      Sẽ mất một khoảng phí nhỏ để định giá sơ bộ, Quý khách có thể xem bảng giá chi tiết
      <span class="highlight-link" data-action="pricing">tại đây</span>
    `,
    isOpen: false
  },
  {
    text: 'Tôi có thể thanh toán phí bằng các hình thức nào?',
    answer: `
      Quý khách có thể thanh toán bằng QR code trên website hoặc đến trực tiếp tại công ty để thanh toán bằng tiền mặt hay chuyển khoản.
    `,
    isOpen: false
  }
])

const answerElements = ref([])
const contentHeights = ref([])

const getMaxHeight = (index) => {
  return contentHeights.value[index] || 0
}

const toggleItem = async (index) => {
  const item = faqItems.value[index]

  // Nếu đang mở item này, đóng nó lại
  if (item.isOpen) {
    item.isOpen = false
  } else {
    // Nếu mở item mới, đóng tất cả item khác trước
    // faqItems.value.forEach((faqItem, i) => {
    //   if (i !== index) {
    //     faqItem.isOpen = false
    //   }
    // })

    // Tính toán chiều cao trước khi mở
    await nextTick()
    const answerEl = answerElements.value[index]
    if (answerEl) {
      contentHeights.value[index] = answerEl.scrollHeight
    }

    // Mở item sau khi đã có chiều cao
    item.isOpen = true
  }
}

const handleAction = (actionType, event) => {
  console.log("Phát sự kiện", actionType)
  switch (actionType) {
    case 'valuation':
      emit('navigateToValuation')
      break
    case 'contact':
      router.push('/contact')
      break
    case 'criteria':
      emit('navigateToCriteria')
      break
    case 'pricing':
      emit('navigateToPricing')
      break
  }
}

// Tính toán lại chiều cao khi cửa sổ thay đổi kích thước
onMounted(() => {
  window.addEventListener('resize', () => {
    faqItems.value.forEach((item, index) => {
      if (item.isOpen) {
        nextTick(() => {
          const answerEl = answerElements.value[index]
          if (answerEl) {
            contentHeights.value[index] = answerEl.scrollHeight
          }
        })
      }
    })
  })
})
</script>

<style scoped>
.faq-container {
  font-family: 'Ubuntu', sans-serif;
  max-width: 1400px;
  margin: 50px auto;
  padding: 20px;
  position: relative;
}

.faq-header {
  position: relative;
  border-bottom: 5px solid #002FFF;
  height: 68px;
  border-bottom-right-radius: 34px;
  padding-left: 60px;
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  width: 40%;
  margin-left: 25px;
}

.faq-content::before {
  content: '';
  position: absolute;
  top: -90px;
  left: 35.5px;
  width: 2px;
  height: 110%;
  border-left: 2px dashed #2F56AE;
  z-index: -1;
  display: none;
}

.question-mark {
  position: absolute;
  left: -25px;
  bottom: -5px;
  width: 70px;
  height: 70px;
  background: #002FFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
  z-index: 5;
}
.faq-title {
  font-size: 33px;
  font-weight: 600;
  margin: 0;
  color: #002FFF;
}

.faq-content {
  position: relative;
}

.faq-list {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
}

.faq-item {
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  width: calc(100% - 100px);
  position: relative;
  margin-left: 100px;
  overflow: hidden;
  transition: border-radius 0.3s ease;
  z-index: 1;
}

.faq-item::before {
  content: '';
  position: absolute;
  left: -60px;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 1px;
  border-bottom: 2px dashed #2F56AE;
  z-index: 10;
}

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 20px;
}

.item-content:hover:not(.active) {
  background: #f8f9fa;
}

.item-content.active {
  background: white;
  border-radius: 20px 20px 0 0;
  font-weight: bold;
}
.item-content.active .item-text {
  color: #031358;
  font-weight: 700;
}

.item-text {
  font-size: 16px;
  color: #333;
  flex: 1;
  transition: all 0.3s ease;
}

.triangle {
  font-size: 20px;
  color: #002FFF;
  margin-left: 15px;
  transition: transform 0.3s ease;
}

.triangle.rotated {
  transform: rotate(90deg);
}

.answer-wrapper {
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.answer-content {
  padding: 0 30px 10px;
}

.answer-content p {
  margin: 0;
  color: #555;
  line-height: 1.5;
  padding: 20px 0;
}

/* Style cho các link highlight */
.answer-content :deep(.highlight-link) {
  color: #002FFF;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease;
}

.answer-content :deep(.highlight-link:hover) {
  color: #0020CC;
}

/* Đảm bảo transition hoạt động tốt trên mobile */
@media (max-width: 768px) {
  .answer-wrapper {
    transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .faq-header {
    padding-left: 80px;
  }

  .faq-title {
    font-size: 30px;
  }

  .question-mark {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }

  .item-content {
    padding: 15px 20px;
  }

  .faq-item {
    width: calc(100% - 60px);
    margin-left: 60px;
  }

  .faq-item::before {
    left: -40px;
    width: 40px;
  }

  .faq-content::before {
    left: 15px;
  }

  .answer-content {
    padding: 0 20px;
  }

  .answer-content p {
    padding: 0 0 15px 0;
  }

  .item-content.active {
    border-radius: 20px 20px 0 0;
  }
  .faq-item::before {
    left: -40px;
    width: 40px;
  }

  .faq-content::before {
    left: 15px;
  }
}
</style>