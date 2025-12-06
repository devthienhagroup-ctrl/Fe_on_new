<template>
  <section class="hero-section">
    <div class="hero-content">
      <!-- Hình chữ nhật chứa logo -->
      <div class="logo-container fade-left">
        <img src="/imgs/logoTHG.png" alt="Thiên Hà Group Logo" class="company-logo">
      </div>

      <!-- Ô chứa text -->
      <div class="text-container">
        <div class="text-content fade-right">
          <p class="company-description">
            <b>Thiên Hà Group</b> tự hào là đơn vị hoạt động trong lĩnh vực mua — bán — đầu tư bất động sản với bề dày kinh nghiệm và phương châm "Bất Động Sản Thật — Giá Trị Thật". Chúng tôi nổi bật với giải pháp bán gấp bất động sản siêu tốc và cam kết tối ưu hoá giá trị cho khách hàng, góp phần tạo ra hàng nghìn giao dịch thành công. Nếu ông là người năng động, thích môi trường mục tiêu rõ ràng và muốn cùng đội ngũ hiện thực hoá những giao dịch lớn — hãy gia nhập Thiên Hà Group ngay hôm nay; chúng tôi có chế độ đãi ngộ cạnh tranh, lộ trình thăng tiến rõ ràng và phúc lợi theo quy định.
          </p>
        </div>

        <!-- Hình ảnh bên phải -->
        <img src="/imgs/building-hero-section.png" alt="Thiên Hà Group" class="hero-image fade-right">
      </div>

    </div>

  </section>
</template>

<script setup>
// Component logic có thể thêm ở đây nếu cần
import ApplyButton from "./ApplyButton.vue";
</script>

<style scoped>
.apply-btn {
  position: absolute;
  right: 0;
  bottom: 0;
}


.hero-section {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}

.hero-content {
  max-width: 1400px;
  width: 100%;
  position: relative;
  padding: 0 20px;
}

/* Hình chữ nhật chứa logo */
.logo-container {
  width: 900px;
  height: 500px;
  background: linear-gradient(to right, #031358, #0827AF, #031358);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 25px;
}

.company-logo {
  max-width: 33%;
  object-fit: contain;
}

/* Ô chứa text */
.text-container {
  margin-left: 200px;
  padding-right: 320px;
  transform: translateY(-150px);
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.text-content {
  color: #031358;
  font-family: 'Ubuntu', sans-serif;
  font-size: 20px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  text-align: justify;
}

.text-content::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 70%;
  background-color: #0827AF;
}

.company-name {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 24px;
  font-weight: 800;
}

.company-description {
  margin: 0;
  line-height: 1.6;
}

/* Hình ảnh bên phải */
.hero-image {
  position: absolute;
  right: 0;
  bottom: -10px;
  max-width: 400px;
  z-index: 2;
  transform: scaleX(-1);
  height: 700px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {


  .text-container {
    margin-left: 100px;
    padding-right: 250px;
  }

  .hero-image {
    max-width: 300px;
  }
}

@media (max-width: 800px) {
  .hero-section {
    padding-bottom: 50px;
  }

  .logo-container {
    width: 90%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-items: center;
  }

  .text-container {
    margin-left: 20px;
    padding-right: 20px;
    transform: translateY(-150px);
  }

  .text-content {
    font-size: 16px;
    padding: 20px;
  }


  .hero-image {
    top: -250px;
    max-width: 250px;
    margin: 0 auto;
    display: none;
  }

  .text-container {
    transform: translateY(0);
    display: block;
    margin: 0 auto;
  }

  .logo-container {
    width: 100%;
    padding: 0;
  }

  .company-logo {
    display: block;
    margin: 0 auto;
  }

  .text-content::before {
    display: none;
  }
  .hero-content {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>