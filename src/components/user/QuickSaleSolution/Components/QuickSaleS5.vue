<template>
  <div class="section section5">
    <div class="st-title">
      <TitleComponent
          :circle-size="100"
          :icon-height="80"
          :icon-width="90"
          :order-number="5"
          component-height="120px"
          component-width="100%"
          icon-url="/imgs/icon-thoa-thuan.png"
          title="Thỏa thuận & ký kết hợp đồng triển khai bán trong 30 ngày"
      ></TitleComponent>
    </div>
    <div class="main-content-wrapper">
      <div class="text-content fade-in">
        <p>
          Khách hàng và đơn vị triển khai thống nhất ký kết hợp đồng dịch vụ trong 30 ngày. Hợp đồng nêu rõ lộ trình,
          cam kết và quyền lợi của khách hàng, đảm bảo tính minh bạch và hiệu quả xuyên suốt quá trình bán.
        </p>

        <img class="img1 fade-up" src="/imgs/anh-thoa-thuan-2.png" alt="">
        <img class="img2 fade-right" src="/imgs/anh-thoa-thuan-1.png" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComponent from "./TitleQickSale.vue";
</script>

<style scoped>
* {
  font-family: 'Ubuntu', sans-serif;
}

.main-content-wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
}

.section5::before {
  content: "";
  position: absolute;
  top: 0;
  left: -8px;
  width: 80%;
  height: 120%;
  border-left: 5px dashed #C2CBF0;
  border-bottom: 5px dashed #C2CBF0;
  margin-left: 75px;
  z-index: 0;
}

.section5 {
  position: relative;
  overflow: visible;
  padding: 20px;
  padding-bottom: 100px;
  margin-bottom: 80px;
}

.section5 .title-component {
  transform: translateY(-70px);
}

.section5 .st-title {
  width: 50%;
}

.section5 .img1 {
  position: absolute;
  z-index: 2;
  width: 50%%;
}

.section5 .img2 {
  position: absolute;
  right: -300px;
  top: -100px;
  width: 60%;
}

.section5 .main-content-wrapper {
  margin-top: 50px;
}

.section5 p {
  font-size: 17px;
  text-align: justify;
}

.section5 .text-content {
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  width: 100%;
  margin-left: 12%;
  margin-right: 25%;
  padding: 40px 25% 10% 40px;
  z-index: 2;
  position: relative;
}

/* Tablet */
@media (max-width: 1400px) {
  .st-title {
    width: 100% !important;
  }

  .section5 {
    margin-bottom: 30px;
    padding: 20px;
    padding-bottom: 60px;
  }

  .section5::before {
    left: -7px;
    height: 110%;
    width: 2px;
  }

  .section5 .st-title {
    width: 70%;
  }

  .section5 .text-content {
    margin-left: 8%;
    margin-right: 15%;
    padding: 30px 20% 8% 30px;
  }

  .section5 .img1 {
    width: 30%;
  }

  .section5 .img2 {
    right: -150px;
    top: -80px;
    width: 40%;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .section5 {
    padding: 15px;
    padding-bottom: 40px;
    margin-bottom: 20px;
  }





  /* Tăng chiều cao cho TitleComponent trên mobile */
  .section5 .st-title :deep(.title-component) {
    height: 150px !important;
  }

  /* Đặt tất cả về static trên mobile */
  .section5 .img1,
  .section5 .img2,
  .section5 .text-content {
    position: static;
  }

  /* Canh giữa và điều chỉnh kích thước ảnh */
  .section5 .img1 {
    display: block;
    margin: 20px auto 0;
    max-width: 100%;
    width: 80%;
  }

  .section5 .img2 {
    display: block;
    margin: 20px auto 0;
    max-width: 100%;
    width: 80%;
  }

  /* Điều chỉnh text-content */
  .section5 .text-content {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
  }

  /* Điều chỉnh main content wrapper */
  .main-content-wrapper {
    flex-direction: column;
    gap: 15px;
  }

  .section5 p {
    font-size: 15px;
    text-align: left;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .section5 {
    padding: 10px;
    padding-bottom: 30px;
  }

  .section5 .st-title :deep(.title-component) {
    height: 140px !important;
  }

  .section5 .text-content {
    padding: 15px;
  }

  .section5 p {
    font-size: 14px;
  }

  .section5 .img1,
  .section5 .img2 {
    width: 90%;
  }
}
</style>