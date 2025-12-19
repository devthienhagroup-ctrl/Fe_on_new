<template>
  <div class="faq-container" :style="containerStyle">
    <div class="faq-header fade-left" :style="headerStyle">
      <div class="question-mark" :style="questionMarkStyle">?</div>
      <h1 class="faq-title" :style="{ color: config.header.titleColor }">
        {{ config.header.title }}
      </h1>
    </div>

    <div class="faq-content" :style="contentStyle">
      <ul class="faq-list">
        <li
            class="faq-item fade-right"
            v-for="(item, index) in config.items"
            :key="item.id || index"
            :style="getItemStyle(item)"
        >
          <div
              class="item-content"
              @click="toggleItem(index)"
              :class="{ active: item.isOpen }"
              :style="getItemContentStyle(item)"
          >
            <span class="item-text" :style="getItemTextStyle(item)">{{ item.text }}</span>
            <span class="triangle" :class="{ rotated: item.isOpen }" :style="triangleStyle">▶</span>
          </div>
          <div
              class="answer-wrapper"
              :style="{
              maxHeight: item.isOpen ? getMaxHeight(index) + 'px' : '0px',
              transition: `max-height ${config.style.transitionDuration} cubic-bezier(0.4, 0, 0.2, 1)`
            }"
          >
            <div class="answer-content rich-text-editor-wrapper" ref="answerElements">
              <p>{{ getAnswerText(item) }}</p>
              <p
                  v-if="item.action && item.action.type"
                  :class="item.action.linkClass || 'highlight-link'"
                  :target="item.action.target || '_self'"
                  :rel="item.action.rel || 'noopener noreferrer'"
                  @click.prevent="handleAction(item.action.type, $event)"
                  class="action-link tiptap"
              >
                {{ item.action.linkText }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const emit = defineEmits(['navigateToValuation', 'navigateToCriteria', 'navigateToPricing'])

// Nhận props từ component cha
const props = defineProps({
  sectionData: String
})

// Cấu hình mặc định mới
const defaultConfig = {
  header: {
    title: "Các câu hỏi thường gặp",
    borderColor: "#002FFF",
    titleColor: "#002FFF",
    questionMarkColor: "#002FFF",
    questionMarkTextColor: "#FFFFFF"
  },
  items: [
    {
      id: 1,
      text: "Hướng dẫn sử dụng công cụ định giá?",
      answer: "Quý khách hãy truy cập vào trang định giá (ngay trên menu của bạn hoặc nhấn vào nút dưới đây), Quý khách tiếp tục nhấn vào nút 'Định giá ngay'. Tại đó quý khách cần cung cấp đầy đủ các thông tin được yêu cầu về tài sản để nhận được kết quả định giá tài sản.",
      isOpen: true,
      backgroundColor: "#FFFFFF",
      textColor: "#333333",
      activeTextColor: "#031358",
      activeBackgroundColor: "#FFFFFF",
      action: {
        type: "valuation",
        linkText: "Đến trang định giá ngay bât giờ!!!!",
        linkClass: "highlight-link",
        position: "end",
        url: "",
        target: "_self",
        rel: "noopener noreferrer"
      }
    },
    {
      id: 2,
      text: "Biểu phí tư vấn giá?",
      answer: "Nếu quý khách đang nói về tư vấn cơ bản, việc trao đổi qua form hoặc liên hệ trực tiếp thường không mất phí. Riêng các gói tư vấn chuyên sâu sẽ có báo giá cụ thể khi quý khách để lại thông tin.",
      isOpen: false,
      backgroundColor: "#FFFFFF",
      textColor: "#333333",
      activeTextColor: "#031358",
      activeBackgroundColor: "#FFFFFF",
      action: {
        type: "contact",
        linkText: "Liên hệ ngay",
        linkClass: "highlight-link",
        position: "end",
        url: "",
        target: "_self",
        rel: "noopener noreferrer"
      }
    },
    {
      id: 3,
      text: "Định giá bất động sản trực tuyến là gì",
      answer: "Là hình thức định giá thông qua website bằng cách nhập thông tin tài sản. Hệ thống sẽ dựa trên dữ liệu và thị trường để đưa ra mức giá ước tính giúp quý khách tham khảo nhanh mà không cần gặp trực tiếp.",
      isOpen: false,
      backgroundColor: "#FFFFFF",
      textColor: "#333333",
      activeTextColor: "#031358",
      activeBackgroundColor: "#FFFFFF",
      action: null
    },
    {
      id: 4,
      text: "Các tiêu chí định giá bất động sản?",
      answer: "Một số yếu tố thường xuyên được dùng để định giá gồm: vị trí, diện tích, giấy tờ pháp lý, tình trạng nhà đất, tiện ích xung quanh, giao thông, và mặt bằng giá khu vực.",
      isOpen: false,
      backgroundColor: "#FFFFFF",
      textColor: "#333333",
      activeTextColor: "#031358",
      activeBackgroundColor: "#FFFFFF",
      action: {
        type: "criteria",
        linkText: "Xem chi tiết",
        linkClass: "highlight-link",
        position: "end",
        url: "",
        target: "_self",
        rel: "noopener noreferrer"
      }
    },
    {
      id: 5,
      text: "Việc sử dụng công cụ định giá bất động sản có mất phí không?",
      answer: "Sẽ mất một khoảng phí nhỏ để định giá sơ bộ, Quý khách có thể xem bảng giá chi tiết",
      isOpen: false,
      backgroundColor: "#FFFFFF",
      textColor: "#333333",
      activeTextColor: "#031358",
      activeBackgroundColor: "#FFFFFF",
      action: {
        type: "pricing",
        linkText: "tại đây",
        linkClass: "highlight-link",
        position: "end",
        url: "",
        target: "_self",
        rel: "noopener noreferrer"
      }
    },
    {
      id: 6,
      text: "Tôi có thể thanh toán phí bằng các hình thức nào?",
      answer: "Quý khách có thể thanh toán bằng QR code trên website hoặc đến trực tiếp tại công ty để thanh toán bằng tiền mặt hay chuyển khoản.",
      isOpen: false,
      backgroundColor: "#FFFFFF",
      textColor: "#333333",
      activeTextColor: "#031358",
      activeBackgroundColor: "#FFFFFF",
      action: null
    }
  ],
  style: {
    containerMaxWidth: "1400px",
    itemBorderRadius: "20px",
    itemShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    linkColor: "#002FFF",
    linkHoverColor: "#0020CC",
    dashedLineColor: "#2F56AE",
    transitionDuration: "0.3s",
    mobileBreakpoint: "768px"
  }
}

// Config chính
const config = ref({ ...defaultConfig })

// Khởi tạo config từ props hoặc dùng default
if(props.sectionData) {
  try {
    const propsData = JSON.parse(props.sectionData);
    if (propsData.faqConfig) {
      // Merge config từ props với default config
      config.value = propsData.faqConfig;
      console.log("Đã nhận props từ cha", config.value);
    }
  } catch (error) {
    console.error("Lỗi khi parse JSON từ props:", error);
    config.value = defaultConfig;
  }
} else {
  config.value = defaultConfig;
  console.log("Không có props, sử dụng config mặc định mới");
}

// Hàm merge config sâu (deep merge)
const deepMerge = (target, source) => {
  const result = { ...target }

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (key in result && result[key] && typeof result[key] === 'object') {
        result[key] = deepMerge(result[key], source[key])
      } else {
        result[key] = { ...source[key] }
      }
    } else if (Array.isArray(source[key])) {
      // Đối với mảng items, chúng ta muốn giữ lại isOpen state
      if (key === 'items' && Array.isArray(result[key])) {
        const mergedItems = [...source[key]]

        // Giữ lại trạng thái isOpen nếu item có cùng id
        mergedItems.forEach((newItem, index) => {
          const existingItem = result[key].find(item => item.id === newItem.id)
          if (existingItem) {
            mergedItems[index].isOpen = existingItem.isOpen
          } else {
            mergedItems[index].isOpen = false
          }
        })

        result[key] = mergedItems
      } else {
        result[key] = [...source[key]]
      }
    } else {
      result[key] = source[key]
    }
  }

  return result
}

// Function để cập nhật config từ bên ngoài
const updateConfig = (newConfig) => {
  config.value = deepMerge(config.value, newConfig)
}

// Computed styles
const containerStyle = computed(() => ({
  maxWidth: config.value.style.containerMaxWidth
}))

const headerStyle = computed(() => ({
  borderBottomColor: config.value.header.borderColor
}))

const questionMarkStyle = computed(() => ({
  backgroundColor: config.value.header.questionMarkColor,
  color: config.value.header.questionMarkTextColor
}))

const triangleStyle = computed(() => ({
  color: config.value.style.linkColor
}))

const contentStyle = computed(() => ({
  '--dashed-line-color': config.value.style.dashedLineColor
}))

const getItemStyle = (item) => ({
  borderRadius: config.value.style.itemBorderRadius,
  boxShadow: config.value.style.itemShadow,
  backgroundColor: item.backgroundColor || '#FFFFFF'
})

const getItemContentStyle = (item) => ({
  borderRadius: item.isOpen
      ? `${config.value.style.itemBorderRadius} ${config.value.style.itemBorderRadius} 0 0`
      : config.value.style.itemBorderRadius,
  backgroundColor: item.isOpen
      ? (item.activeBackgroundColor || '#FFFFFF')
      : 'transparent'
})

const getItemTextStyle = (item) => ({
  color: item.isOpen
      ? (item.activeTextColor || '#031358')
      : (item.textColor || '#333333'),
  fontWeight: item.isOpen ? '700' : '400'
})

// Helper để lấy text answer
const getAnswerText = (item) => {
  return item.answer || '';
}

const answerElements = ref([])
const contentHeights = ref([])

const getMaxHeight = (index) => {
  return contentHeights.value[index] || 0
}

const toggleItem = async (index) => {
  const item = config.value.items[index]

  if (item.isOpen) {
    item.isOpen = false
  } else {
    await nextTick()
    const answerEl = answerElements.value[index]
    if (answerEl) {
      contentHeights.value[index] = answerEl.scrollHeight
    }

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
      router.push('/lien-he')
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
    config.value.items.forEach((item, index) => {
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

defineExpose({
  updateConfig,
  config
})
</script>

<style scoped>
.faq-container {
  font-family: 'Ubuntu', sans-serif;
  margin: 50px auto;
  padding: 20px;
  position: relative;
}

.faq-header {
  position: relative;
  border-bottom: 5px solid;
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
  border-left: 2px dashed var(--dashed-line-color, #2F56AE);
  z-index: -1;
  display: none;
}

.question-mark {
  position: absolute;
  left: -25px;
  bottom: -5px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  z-index: 5;
}

.faq-title {
  font-size: 33px;
  font-weight: 600;
  margin: 0;
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
  margin-bottom: 15px;
  width: calc(100% - 100px);
  position: relative;
  margin-left: 100px;
  overflow: hidden;
  transition: border-radius v-bind('config.style.transitionDuration') ease;
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
  border-bottom: 2px dashed var(--dashed-line-color, #2F56AE);
  z-index: 10;
}

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  cursor: pointer;
  transition: all v-bind('config.style.transitionDuration') ease;
}

.item-content:hover:not(.active) {
  background: #f8f9fa !important;
}

.item-text {
  font-size: 16px;
  flex: 1;
  transition: all v-bind('config.style.transitionDuration') ease;
}

.triangle {
  font-size: 20px;
  margin-left: 15px;
  transition: transform v-bind('config.style.transitionDuration') ease;
}

.triangle.rotated {
  transform: rotate(90deg);
}

.answer-wrapper {
  overflow: hidden;
}

.answer-content {
  padding: 0 30px 10px;
}

.answer-content p {
  margin: 0;
  color: #555;
  line-height: 1.5;
}

.action-link {
  display: inline-block;
  margin-top: 10px;
  color: v-bind('config.style.linkColor');
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  transition: color v-bind('config.style.transitionDuration') ease;
}

.action-link:hover {
  color: v-bind('config.style.linkHoverColor');
}

/* Đảm bảo transition hoạt động tốt trên mobile */
@media (max-width: 768px ) {
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