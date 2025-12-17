<template>
  <section
      class="gia-tri-section"
      :style="{
      maxWidth: sectionStyles.maxWidth,
      padding: sectionStyles.padding,
      backgroundColor: sectionStyles.backgroundColor
    }"
  >
    <h2
        class="section-title"
        :style="{
        fontSize: titleStyles.fontSize,
        color: titleStyles.color,
        marginBottom: titleStyles.marginBottom
      }"
    >
      {{ sectionData.sectionTitle }}
    </h2>

    <div class="gia-tri-list">
      <div
          v-for="item in sectionData.items"
          :key="item.id"
          class="gia-tri-item"
          :class="item.animationClass || (item.id % 2 === 0 ? 'fade-right' : 'fade-left')"
          :style="{
            borderRadius: itemStyles.borderRadius,
            boxShadow: itemStyles.boxShadow
          }"
          @mouseenter="itemStyles.boxShadow = itemStyles.hoverShadow"
          @mouseleave="itemStyles.boxShadow = itemStyles.boxShadow"
      >
        <button
            class="gia-tri-button"
            @click="toggleContent(item.id)"
        >
          <img
              :src="getImageUrl(item.imageTitle)"
              :alt="item.title"
          >
        </button>

        <div
            class="gia-tri-content"
            :class="{ active: activeItem === item.id }"
        >
          <div
              class="content-wrapper"
              :style="{
              padding: contentStyles.padding,
              gap: contentStyles.gap
            }"
          >
            <div class="text-content">
              <h3
                  class="content-title"
                  :style="{
                  fontSize: contentTitleStyles.fontSize,
                  color: contentTitleStyles.color
                }"
              >
                {{ item.title }}
              </h3>
              <p
                  class="content-description"
                  :style="{
                  fontSize: contentDescriptionStyles.fontSize,
                  color: contentDescriptionStyles.color,
                  lineHeight: contentDescriptionStyles.lineHeight
                }"
              >
                {{ item.description }}
              </p>
            </div>
            <div class="image-content">
              <img
                  :src="getImageUrl(item.imageContent)"
                  :alt="item.title"
                  class="content-image"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import {baseImgaeUrl} from "../../../../assets/js/global.js";

const activeItem = ref(null)


// Dữ liệu động có thể được fetch từ API hoặc import từ file JSON
let sectionData = reactive({
  sectionTitle: "GIÁ TRỊ BẤT ĐỘNG SẢN ĐƯỢC DỰA TRÊN",
  items: [
    {
      id: 1,
      title: "Vị trí và đặc điểm",
      description: "Vị trí và đặc điểm là yếu tố then chốt ảnh hưởng trực tiếp đến giá trị của bất động sản. Một căn hộ nằm trong khu đô thị phát triển, gần trung tâm hoặc có tầm nhìn đẹp sẽ có giá trị cao hơn. Ngoài ra, các yếu tố như vị trí phân khu, tòa nhà, số tầng, diện tích căn hộ, số phòng ngủ và hướng ban công cũng góp phần định hình mức giá. Bất động sản sở hữu vị trí thuận tiện cho giao thông, gần tiện ích công cộng và môi trường sống trong lành luôn được khách hàng ưu tiên lựa chọn.",
      imageTitle: "gia-tri-1.png",
      imageContent: "anh-gia-tri-1.png",
      animationClass: "fade-left"
    },
    {
      id: 2,
      title: "Giá trị tham chiếu",
      description: "Giá trị tham chiếu được xác định dựa trên các bất động sản tương tự trong cùng khu vực. Đây là cơ sở quan trọng giúp người mua và nhà đầu tư đưa ra quyết định hợp lý. Việc so sánh giá với các dự án có vị trí, quy mô và tiện ích tương đồng giúp đánh giá mức độ cạnh tranh và tiềm năng tăng giá. Một bất động sản có mức giá phù hợp với mặt bằng chung nhưng sở hữu thêm yếu tố nổi bật sẽ có lợi thế rõ rệt trên thị trường.",
      imageTitle: "gia-tri-2.png",
      imageContent: "anh-gia-tri-2.png",
      animationClass: "fade-right"
    },
    {
      id: 3,
      title: "Tiện ích xung quanh",
      description: "Các tiện ích xung quanh đóng vai trò quan trọng trong việc nâng cao chất lượng cuộc sống và giá trị của bất động sản. Những khu vực có hệ thống tiện ích đồng bộ như bãi đỗ xe, công viên cây xanh, trung tâm thương mại, trường học, bệnh viện và khu vui chơi giải trí luôn được đánh giá cao. Một môi trường sống tiện nghi, hiện đại và thuận tiện cho sinh hoạt hàng ngày không chỉ thu hút cư dân mà còn làm tăng giá trị dài hạn của bất động sản.",
      imageTitle: "gia-tri-3.png",
      imageContent: "anh-gia-tri-3.png",
      animationClass: "fade-left"
    },
    {
      id: 4,
      title: "Xu hướng thị trường",
      description: "Xu hướng phát triển của thị trường bất động sản và kế hoạch mở rộng đô thị, hạ tầng kinh tế là yếu tố ảnh hưởng trực tiếp đến giá trị tài sản. Những khu vực nằm trong quy hoạch phát triển, có tiềm năng tăng trưởng về thương mại, dịch vụ và hạ tầng giao thông thường có khả năng sinh lời cao. Theo dõi xu hướng thị trường giúp nhà đầu tư nắm bắt thời điểm vàng để mua vào hoặc bán ra nhằm tối đa hóa lợi nhuận.",
      imageTitle: "gia-tri-4.png",
      imageContent: "anh-gia-tri-4.png",
      animationClass: "fade-right"
    },
    {
      id: 5,
      title: "Thời điểm bàn giao",
      description: "Thời điểm bàn giao căn hộ là yếu tố tác động đến cả giá trị và khả năng sử dụng của bất động sản. Dự án được bàn giao đúng tiến độ thể hiện uy tín của chủ đầu tư và đảm bảo quyền lợi cho người mua. Ngoài ra, thời điểm bàn giao còn ảnh hưởng đến khả năng khai thác cho thuê hoặc chuyển nhượng. Một dự án sắp bàn giao thường có giá trị cao hơn vì người mua có thể nhanh chóng sử dụng hoặc đầu tư sinh lợi.",
      imageTitle: "gia-tri-5.png",
      imageContent: "anh-gia-tri-5.png",
      animationClass: "fade-left"
    },
  ]
})

const props = defineProps({
  sectionData: String
})

if(props.sectionData) {
  sectionData= JSON.parse(props.sectionData);
  console.log("Đã nhận props từ cha", sectionData)
} else console.log("KHông có props")

// Styles động - có thể được config từ CMS
const sectionStyles = reactive({
  maxWidth: "1400px",
  padding: "60px 20px",
  backgroundColor: "#ffffff"
})

const titleStyles = reactive({
  fontSize: "40px",
  color: "#1a365d",
  marginBottom: "50px"
})

const itemStyles = reactive({
  borderRadius: "12px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.08)",
  hoverShadow: "0 8px 25px rgba(0, 0, 0, 0.12)"
})

const contentStyles = reactive({
  padding: "30px",
  gap: "30px"
})

const contentTitleStyles = reactive({
  fontSize: "33px",
  color: "#2d3748"
})

const contentDescriptionStyles = reactive({
  fontSize: "20px",
  color: "#4a5568",
  lineHeight: "1.6"
})

const toggleContent = (id) => {
  if (activeItem.value === id) {
    activeItem.value = null
  } else {
    activeItem.value = id
  }
}

const getImageUrl = (imageName) => {
  // Thay đổi đường dẫn này theo cấu trúc thư mục của bạn
  return `${baseImgaeUrl+imageName}`
}

// Hàm để update data từ CMS (có thể gọi từ API)
const updateSectionData = (newData) => {
  Object.assign(sectionData, newData)
}

const updateStyles = (newStyles) => {
  if (newStyles.section) Object.assign(sectionStyles, newStyles.section)
  if (newStyles.title) Object.assign(titleStyles, newStyles.title)
  if (newStyles.item) Object.assign(itemStyles, newStyles.item)
  if (newStyles.content) Object.assign(contentStyles, newStyles.content)
  if (newStyles.contentTitle) Object.assign(contentTitleStyles, newStyles.contentTitle)
  if (newStyles.contentDescription) Object.assign(contentDescriptionStyles, newStyles.contentDescription)
}

onMounted(() => {
  // Delay the toggleContent until after fade animations complete
  setTimeout(() => {
    toggleContent(1);
  }, 1000);
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.gia-tri-section {
  margin: 0 auto;
  font-family: 'Ubuntu', sans-serif;
}

.section-title {
  font-weight: 700;
  text-align: center;
}

.gia-tri-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gia-tri-item {
  width: 100%;
  overflow: hidden;
  transition: all 0.3s ease;
  line-height: 0;
}

.gia-tri-button {
  width: 100%;
  height: auto;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.3s ease;
  display: block;
}

.gia-tri-button:hover {
  transform: scale(1.01);
}

.gia-tri-button img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  vertical-align: bottom;
}

.gia-tri-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.gia-tri-content.active {
  max-height: 1000px;
  line-height: normal;
}

.content-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.text-content {
  flex: 0 0 calc(40% - 15px);
}

.image-content {
  flex: 0 0 calc(60% - 15px);
}

.content-title {
  font-weight: 600;
  margin-bottom: 20px;
  line-height: 1.3;
}

.content-description {
  text-align: justify;
}

.content-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
  display: block;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .text-content,
  .image-content {
    flex: 0 0 100%;
  }

  .content-title {
    font-size: 28px !important;
  }

  .content-description {
    font-size: 18px !important;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 32px !important;
  }

  .content-title {
    font-size: 24px !important;
  }

  .content-description {
    font-size: 16px !important;
  }

  .content-wrapper {
    padding: 20px !important;
    gap: 20px !important;
  }
}

@media (max-width: 478px) {
  .gia-tri-list {
    gap: 5px;
  }

  .gia-tri-section {
    padding-right: 5px !important;
    padding-left: 5px !important;
  }
}
</style>