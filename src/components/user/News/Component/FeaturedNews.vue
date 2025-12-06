<template>
  <div class="news-container">
    <!-- Tiêu đề chính -->
    <h1 class="main-title">TIN TỨC NỔI BẬT</h1>

    <div class="content-wrapper">
      <!-- Cột trái - Tin tức -->
      <div class="left-column">
        <!-- Tin nổi bật nhất -->
        <div class="featured-news" v-if="newsArticles.length > 0">
          <div class="featured-image-container">
            <img :src="newsArticles[0].image" :alt="newsArticles[0].title" class="featured-image">
            <div class="date-overlay">{{ newsArticles[0].date }}</div>
          </div>
          <div class="featured-info">
            <h2 class="featured-title">{{ newsArticles[0].title }}</h2>
            <p class="featured-subtitle">{{ newsArticles[0].subtitle }}</p>
            <div class="category-tag">{{ newsArticles[0].category }}</div>
          </div>
        </div>

        <!-- Các tin nổi bật khác -->
        <div class="other-news" v-if="newsArticles.length > 1">
          <div
              v-for="(article, index) in newsArticles.slice(1)"
              :key="index"
              class="news-item"
          >
            <div class="news-image-container">
              <img :src="article.image" :alt="article.title" class="news-image">
              <div class="date-overlay">{{ article.date }}</div>
            </div>
            <div class="news-info">
              <h3 class="news-title">{{ article.title }}</h3>
              <p class="news-subtitle">{{ article.subtitle }}</p>
              <div class="category-tag">{{ article.category }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cột phải - Form liên hệ -->
      <div class="right-column">
        <div class="form-wrapper">
          <div class="form-container">
            <h2 class="form-title">Liên hệ hợp tác ngay!</h2>

            <form @submit.prevent="submitForm" class="contact-form">
              <div class="form-group">
                <input
                    type="text"
                    id="fullName"
                    v-model="formData.fullName"
                    required
                    class="form-input"
                    placeholder=" "
                >
                <label for="fullName" class="form-label">Họ và tên</label>
              </div>

              <div class="form-group">
                <input
                    type="tel"
                    id="phone"
                    v-model="formData.phone"
                    required
                    class="form-input"
                    placeholder=" "
                >
                <label for="phone" class="form-label">Số điện thoại</label>
              </div>

              <div class="form-group">
                <select
                    id="needs"
                    v-model="formData.needs"
                    required
                    class="form-input"
                >
                  <option value="" disabled selected></option>
                  <option value="buy">Mua</option>
                  <option value="rent">Bán gấp</option>
                  <option value="consult">Bán giá mong muốn</option>
                </select>
                <label for="needs" class="form-label">Nhu cầu</label>
              </div>

              <div class="form-group">
                <input
                    type="text"
                    id="price"
                    v-model="formData.price"
                    required
                    class="form-input"
                    placeholder=" "
                >
                <label for="price" class="form-label">Giá bán</label>
              </div>

              <div class="form-group">
                <input
                    type="text"
                    id="area"
                    v-model="formData.area"
                    required
                    class="form-input"
                    placeholder=" "
                >
                <label for="area" class="form-label">Khu vực</label>
              </div>

              <button type="submit" class="submit-btn">Gửi thông tin</button>
            </form>
          </div>

          <img src="/imgs/building-hero-section.png" alt="Building" class="form-image">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Dữ liệu tin tức
const newsArticles = ref([
  {
    title: "Bất động sản Thiên Hà Group vinh dự đón nhận giải thưởng top 10 thương hiệu xuất sắc châu á 2024",
    subtitle: "Giải thưởng danh giá này là minh chứng cho nỗ lực không ngừng của Thiên Hà Group trong việc phát triển các dự án bền vững, mang lại giá trị thật cho khách hàng và đóng góp tích cực cho sự phát triển của ngành bất động sản Việt Nam....",
    category: "Tin tức | Hoạt động",
    date: "12/11/2024",
    image: "/imgs/hd6.jpg"
  },
  {
    title: "Thị trường bất động sản phục hồi mạnh mẽ cuối năm 2025",
    subtitle: "Sau giai đoạn trầm lắng, thị trường đang ghi nhận tín hiệu tích cực với sự quay trở lại của dòng vốn đầu tư và nhu cầu nhà ở tăng cao......",
    category: "Giải pháp Bất động sản",
    date: "12/10/2024",
    image: "/imgs/bannhanhbds.png"
  },
  {
    title: "Dòng tiền đầu tư quay lại bất động sản: Cơ hội vàng cho DN Việt",
    subtitle: "Các chính sách hỗ trợ, cùng tín hiệu tích cực từ thị trường tài chính, đang mở ra giai đoạn tăng trưởng mới cho ngành bất động sản trong nước....",
    category: "Đăng tin Bất động sản",
    date: "12/10/2024",
    image: "/imgs/bannhanhbds.png"
  },
  {
    title: "Người trẻ chuộng mua nhà sẵn nội thất thay vì tự xây",
    subtitle: "Xu hướng 'sống tiện nghi ngay khi nhận nhà' đang được thế hệ trẻ ưa chuộng. Các dự án căn hộ bàn giao hoàn thiện nội thất trở thành....",
    category: "Định giá Bất động sản",
    date: "12/10/2024",
    image: "/imgs/bannhanhbds.png"
  },
  {
    title: "Bất động sản xanh – Xu hướng mới dẫn đầu cuối năm 2025",
    subtitle: "Mô hình đô thị xanh, thân thiện môi trường đang trở thành lựa chọn hàng đầu của người mua nhà....",
    category: "Bất động sản",
    date: "12/10/2024",
    image: "/imgs/bannhanhbds.png"
  }
]);

const formData = reactive({
  fullName: '',
  phone: '',
  needs: '',
  price: '',
  area: ''
})

// Xử lý submit form
const submitForm = () => {
  console.log('Form submitted:', formData)
  // Xử lý gửi form ở đây
  alert('Thông tin đã được gửi thành công!')

  // Reset form
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Ubuntu', sans-serif;
}

.news-container {
  max-width: 1400px;
  margin: 80px auto 0;
  padding: 20px;
}

.main-title {
  text-align: center;
  color: #031358;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 40px;
}

.content-wrapper {
  display: flex;
  gap: 30px;
}

/* Cột trái - Tin tức */
.left-column {
  flex: 8;
}

.featured-news {
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.featured-image-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.date-overlay {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  color: #031358;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.featured-info {
  background-color: white;
  padding: 25px;
  position: relative;
}

.featured-title {
  color: #031358;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.3;
}

.featured-subtitle {
  color: #6B7280;
  font-size: 20px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.category-tag {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: #031358;
  font-size: 14px;
  font-weight: 500;
}

/* Các tin nổi bật khác - không có đổ bóng và nền */
.other-news {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.news-item {
  /* Loại bỏ đổ bóng và nền */
  background: transparent;
  border-radius: 0;
  overflow: hidden;
}

.news-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-info {
  /* Loại bỏ nền trắng */
  background: transparent;
  padding: 15px 0;
  position: relative;
  height: auto;
  display: flex;
  flex-direction: column;
}

.news-title {
  color: #031358;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.3;
}

.news-subtitle {
  color: #6B7280;
  font-size: 16px;
  line-height: 1.4;
  margin-bottom: 25px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Cột phải - Form liên hệ */
.right-column {
  flex: 4;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
}

.form-container {
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 25px;
}

.form-title {
  color: #031358;
  font-size: 33px;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
}

.contact-form {
  margin-bottom: 0;
}

.form-group {
  position: relative;
  margin-bottom: 30px;
}

.form-input {
  width: 100%;
  padding: 15px 0 10px 0;
  border: none;
  border-bottom: 1px solid #031358;
  background-color: transparent;
  font-size: 16px;
  color: #031358;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-bottom: 1px solid #031358;
}

.form-label {
  position: absolute;
  top: 50%;
  left: 0;
  font-size: 16px;
  color: #031358;
  pointer-events: none;
  transition: all 0.3s ease;
  transform: translateY(-50%);
  opacity: 0.5;
}

/* Hiệu ứng focus - label thu nhỏ và di chuyển lên trên */
.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label {
  top: 0;
  font-size: 12px;
  color: #031358;
  transform: translateY(0);
  opacity: 1;
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23031358' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #031358, #0030FF);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.3);
}

.form-image {
  margin-top: auto;
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-wrapper {
    gap: 20px;
  }

  .news-container {
    padding: 15px;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
  }

  .other-news {
    grid-template-columns: 1fr;
  }

  .form-wrapper {
    flex-direction: row;
    gap: 20px;
  }

  .form-container {
    flex: 1;
  }

  .form-image {
    flex: 1;
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .form-wrapper {
    flex-direction: column;
  }

  .form-image {
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .main-title {
    font-size: 28px;
  }

  .featured-title {
    font-size: 22px;
  }

  .featured-subtitle {
    font-size: 18px;
  }

  .form-title {
    font-size: 28px;
  }

  .featured-image-container {
    height: 300px;
  }

  .news-image-container {
    height: 150px;
  }
}
</style>