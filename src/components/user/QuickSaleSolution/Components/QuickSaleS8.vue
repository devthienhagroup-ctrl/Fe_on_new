<template>
  <div class="section section8">
    <div class="st-title">
      <TitleComponent
          :circle-size="100"
          :icon-height="80"
          :icon-width="90"
          :order-number="8"
          component-height="80px"
          component-width="100%"
          icon-url="/imgs/icon-tu-van.png"
          title="Tư vấn hỗ trợ chủ nhà và khách hàng"
          :is-right="true"
      ></TitleComponent>
    </div>
    <div class="main-content-wrapper">

      <div class="text-content">
        <div class="text-wrapper fade-left">
          <p>
            Trong suốt quá trình bán, chuyên viên luôn đồng hành, hỗ trợ cả hai bên:
          </p>
          <ul>
            <li>Giải đáp mọi thắc mắc về thủ tục</li>
            <li>Tư vấn chiến lược giá linh hoạt</li>
            <li>Hỗ trợ giao tiếp, thương lượng hiệu quả</li>
          </ul>
        </div>

        <img class="img1 fade-up" src="/imgs/anh-tu-van-1.png" alt="">
      </div>
      <img class="img2 fade-up" src="/imgs/anh-tu-van-2.png" alt="">

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

.st-title {
  display: block;
  margin-left: auto;
}

.main-content-wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
}


.section8::before {
  content: "";
  position: absolute;
  top: 0;
  right: 79px;
  width: 87.6%; /* nửa chiều rộng */
  height: 118%;
  border-right: 5px dashed #C2CBF0;
  border-bottom: 5px dashed #C2CBF0;

  margin-left: 75px;
  z-index: 0;
}

.section8 {
  margin-top: 150px;
  position: relative;
  overflow: visible;
  padding: 30px 20px 100px;
  margin-bottom: 80px;
}

.section8 .title-component {
  transform: translateY(-70px);
}

.section8 .st-title {
  width: 40%;
}


.img2 {
  position: absolute;
  right: 50%;
  top: 90%;
}

.section8 .img1 {
  position: absolute;
  right: -15%;
  top: -15%;
}

.section8 .main-content-wrapper {
  margin-top: 50px;
}

.section8 p {
  font-size: 17px;
  text-align: justify;
}

.section8 .text-content {
  background-color: white;
  border: 2px solid #031358;
  border-radius: 20px;
  width: 100%;
  margin-left: 12%;
  margin-right: 20%;

  padding-left: 10px;
  z-index: 2;
  position: relative;

  /* Thêm các thuộc tính này để căn giữa theo chiều dọc */
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  min-height: 200px; /* Đặt chiều cao tối thiểu để thấy rõ hiệu ứng */
}

@media (max-width: 1400px) {
  .section8 .st-title {
    width: 100% !important;
  }

  .section8::before {
    width: 87.5%;
  }

  .section8::before {
    width: 2px;
    height: 160%;
  }
}

/* Tablet styles */
@media (min-width: 769px) and (max-width: 1200px) {
  .section8 {
    margin-top: 120px;
    padding: 25px 25px 80px;
    margin-bottom: 60px;
  }


  .section8 .text-content {
    margin-left: 8%;
    margin-right: 15%;
    padding-right: 35%;
    padding-left: 20px;
    min-height: 180px;
  }

  .section8 .img1 {
    right: -10%;
    top: -10%;
    max-width: 280px;
  }

  .img2 {
    right: 45%;
    top: 85%;
    max-width: 200px;
  }

  .section8 p {
    font-size: 16px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .section8 {
    margin-top: 80px;
    padding: 20px 15px 60px;
    margin-bottom: 40px;
  }

  .section8::before {
    height: 130%;
  }

  .section8 .st-title {
    width: 100%;
    margin-bottom: 30px;
  }

  .main-content-wrapper {
    flex-direction: column;
    gap: 20px;
    position: relative;
  }

  .section8 .text-content {
    margin: 0;
    padding: 25px 20px;
    width: 100%;
    display: block;
    min-height: auto;
    text-align: center;
  }

  .section8 p {
    font-size: 16px;
    text-align: justify;
    margin-bottom: 15px;
  }

  .section8 ul {
    text-align: justify;
    padding-left: 0;
    list-style-position: inside;
  }

  .section8 .img1 {
    position: static;
    display: block;
    margin: 20px auto 0;
    max-width: 280px;
    width: 100%;
  }

  .img2 {
    position: static;
    display: block;
    margin: 0 auto;
    max-width: 200px;
    width: 100%;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .section8 {
    margin-top: 60px;
    padding: 15px 10px 40px;
    margin-bottom: 30px;
  }

  .section8 .text-content {
    padding: 20px 15px;
  }

  .section8 p {
    font-size: 15px;
  }

  .section8 .img1 {
    max-width: 250px;
  }

  .img2 {
    max-width: 180px;
  }

  .section8::before{
    right: 60px;
    height: 115%;
  }
}

/* Large desktop adjustments */
@media (min-width: 1600px) {
  .section8 .text-content {
    margin-left: 15%;
    margin-right: 25%;
  }

  .section8 .img1 {
    right: -12%;
    top: -12%;
  }
}
</style>