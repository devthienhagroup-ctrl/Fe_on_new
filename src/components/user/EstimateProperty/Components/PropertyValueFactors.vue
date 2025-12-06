<template>
  <section class="gia-tri-section">
    <h2 class="section-title">GIÁ TRỊ BẤT ĐỘNG SẢN ĐƯỢC DỰA TRÊN</h2>

    <div class="gia-tri-list">
      <div
          v-for="item in giaTriBatDongSan"
          :key="item.id"
          class="gia-tri-item"
          :class="item.id % 2 === 0 ? 'fade-right' : 'fade-left'"
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
          <div class="content-wrapper">
            <div class="text-content">
              <h3 class="content-title">{{ item.title }}</h3>
              <p class="content-description">{{ item.description }}</p>
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
import {onMounted, ref} from 'vue'

const activeItem = ref(null)

const giaTriBatDongSan = [
  {
    id: 1,
    title: "Vị trí và đặc điểm",
    description: "Vị trí và đặc điểm là yếu tố then chốt ảnh hưởng trực tiếp đến giá trị của bất động sản. Một căn hộ nằm trong khu đô thị phát triển, gần trung tâm hoặc có tầm nhìn đẹp sẽ có giá trị cao hơn. Ngoài ra, các yếu tố như vị trí phân khu, tòa nhà, số tầng, diện tích căn hộ, số phòng ngủ và hướng ban công cũng góp phần định hình mức giá. Bất động sản sở hữu vị trí thuận tiện cho giao thông, gần tiện ích công cộng và môi trường sống trong lành luôn được khách hàng ưu tiên lựa chọn.",
    imageTitle: "gia-tri-1.png",
    imageContent: "anh-gia-tri-1.png",
  },
  {
    id: 2,
    title: "Giá trị tham chiếu",
    description: "Giá trị tham chiếu được xác định dựa trên các bất động sản tương tự trong cùng khu vực. Đây là cơ sở quan trọng giúp người mua và nhà đầu tư đưa ra quyết định hợp lý. Việc so sánh giá với các dự án có vị trí, quy mô và tiện ích tương đồng giúp đánh giá mức độ cạnh tranh và tiềm năng tăng giá. Một bất động sản có mức giá phù hợp với mặt bằng chung nhưng sở hữu thêm yếu tố nổi bật sẽ có lợi thế rõ rệt trên thị trường.",
    imageTitle: "gia-tri-2.png",
    imageContent: "anh-gia-tri-2.png",
  },
  {
    id: 3,
    title: "Tiện ích xung quanh",
    description: "Các tiện ích xung quanh đóng vai trò quan trọng trong việc nâng cao chất lượng cuộc sống và giá trị của bất động sản. Những khu vực có hệ thống tiện ích đồng bộ như bãi đỗ xe, công viên cây xanh, trung tâm thương mại, trường học, bệnh viện và khu vui chơi giải trí luôn được đánh giá cao. Một môi trường sống tiện nghi, hiện đại và thuận tiện cho sinh hoạt hàng ngày không chỉ thu hút cư dân mà còn làm tăng giá trị dài hạn của bất động sản.",
    imageTitle: "gia-tri-3.png",
    imageContent: "anh-gia-tri-3.png",
  },
  {
    id: 4,
    title: "Xu hướng thị trường",
    description: "Xu hướng phát triển của thị trường bất động sản và kế hoạch mở rộng đô thị, hạ tầng kinh tế là yếu tố ảnh hưởng trực tiếp đến giá trị tài sản. Những khu vực nằm trong quy hoạch phát triển, có tiềm năng tăng trưởng về thương mại, dịch vụ và hạ tầng giao thông thường có khả năng sinh lời cao. Theo dõi xu hướng thị trường giúp nhà đầu tư nắm bắt thời điểm vàng để mua vào hoặc bán ra nhằm tối đa hóa lợi nhuận.",
    imageTitle: "gia-tri-4.png",
    imageContent: "anh-gia-tri-4.png",
  },
  {
    id: 5,
    title: "Thời điểm bàn giao",
    description: "Thời điểm bàn giao căn hộ là yếu tố tác động đến cả giá trị và khả năng sử dụng của bất động sản. Dự án được bàn giao đúng tiến độ thể hiện uy tín của chủ đầu tư và đảm bảo quyền lợi cho người mua. Ngoài ra, thời điểm bàn giao còn ảnh hưởng đến khả năng khai thác cho thuê hoặc chuyển nhượng. Một dự án sắp bàn giao thường có giá trị cao hơn vì người mua có thể nhanh chóng sử dụng hoặc đầu tư sinh lợi.",
    imageTitle: "gia-tri-5.png",
    imageContent: "anh-gia-tri-5.png",
  },
]

const toggleContent = (id) => {
  if (activeItem.value === id) {
    activeItem.value = null
  } else {
    activeItem.value = id
  }
}


const getImageUrl = (imageName) => {
  // Thay đổi đường dẫn này theo cấu trúc thư mục của bạn
  return `/imgs/${imageName}`
}

onMounted(() => {
  // Delay the toggleContent until after fade animations complete
  // Adjust the timeout duration to match your fade animation duration
  setTimeout(() => {
    toggleContent(1);
  }, 1000); // 1000ms = 1 second delay
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.gia-tri-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px;
  font-family: 'Ubuntu', sans-serif;
}

.section-title {
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 50px;
  color: #1a365d;
}

.gia-tri-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gia-tri-item {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  /* Thêm dòng này để đảm bảo không có khoảng trắng */
  line-height: 0;
}

.gia-tri-item:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.gia-tri-button {
  width: 100%;
  height: auto;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.3s ease;
  /* Thêm dòng này */
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
  /* Quan trọng: đảm bảo ảnh không có khoảng trắng */
  vertical-align: bottom;
}

.gia-tri-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
}

.gia-tri-content.active {
  max-height: 1000px;
  /* Reset line-height khi content active */
  line-height: normal;
}

.content-wrapper {
  display: flex;
  flex-wrap: wrap;
  padding: 30px;
  gap: 30px;
}

.text-content {
  flex: 0 0 calc(40% - 15px);
}

.image-content {
  flex: 0 0 calc(60% - 15px);
}

.content-title {
  font-size: 33px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #2d3748;
  line-height: 1.3;
}

.content-description {
  font-size: 20px;
  line-height: 1.6;
  color: #4a5568;
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
    font-size: 28px;
  }

  .content-description {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 32px;
  }

  .content-title {
    font-size: 24px;
  }

  .content-description {
    font-size: 16px;
  }

  .content-wrapper {
    padding: 20px;
    gap: 20px;
  }
}

@media (max-width: 478px) {
  .gia-tri-list {
    gap: 5px;
  }

  .gia-tri-section {
    padding-right: 5px;
    padding-left: 5px;
  }
}
</style>