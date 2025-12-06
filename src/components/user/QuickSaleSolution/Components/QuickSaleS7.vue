<template>
  <div class="section section7">
    <div class="st-title">
      <TitleComponent
          :circle-size="100"
          :icon-height="80"
          :icon-width="90"
          :order-number="7"
          component-height="100px"
          component-width="100%"
          icon-url="/imgs/icon-trien-khai.png"
          title="Triển khai bán nhanh bất động sản"

      ></TitleComponent>
    </div>
    <div class="main-content-wrapper">

      <div class="text-content fade-right">
        <p>
          Các chiến dịch được triển khai đồng bộ. Đội ngũ môi giới, chăm sóc khách hàng liên tục tiếp nhận phản hồi, lọc
          khách thật và sắp xếp lịch xem nhà nhanh nhất — rút ngắn thời gian chốt giao dịch.
        </p>

        <img class="img2 fade-left" src="/imgs/anh-trien-khai-1.png" alt="">
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


.section7::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 80%; /* nửa chiều rộng */
  height: 132%;
  border-left: 5px dashed #C2CBF0;
  border-bottom: 5px dashed #C2CBF0;

  margin-left: 75px;
  z-index: 0;
}

.section7 {
  margin-top: 60px;
  position: relative;
  overflow: visible;
  padding: 30px 20px;
  padding-bottom: 100px;
  margin-bottom: 80px;
}

.section7 .title-component {
  transform: translateY(-70px);
}

.section7 .st-title {

  width: 40%;
}


.section7 .img2 {
  width: 40%;
  position: absolute;
  right: 0px;
  top: -100px;
}

.section7 .main-content-wrapper {
  margin-top: 50px;
}

.section7 p {
  font-size: 17px;
  text-align: justify;
  margin: 0;
}

.section7 .text-content {
  background-color: white;
  border: 2px solid #031358;
  border-radius: 20px;
  width: 100%;
  margin-left: 12%;
  margin-right: 12%;
  padding-right: 42%;
  padding-left: 50px;
  z-index: 2;
  position: relative;

  /* Thêm các thuộc tính này để căn giữa theo chiều dọc */
  display: flex;
  align-items: center; /* Căn giữa theo chiều dọc */
  min-height: 200px; /* Đặt chiều cao tối thiểu để thấy rõ hiệu ứng */
}




/* Responsive Design */
@media (max-width: 1400px) {
  .section7 {
    margin-bottom: 30px;
  }

  .section7::before {
    border-bottom: 0;
    height: 130%;
  }

  /* Điều chỉnh text-content */
  .section7 .text-content {
    margin: 20px 0 0 0;
    padding: 20px;
    padding-right: 40%;
    width: 100%;
    box-sizing: border-box;
  }

  /* Điều chỉnh main content wrapper */
  .main-content-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .section7 .st-title {
    display: block;
    margin-left: auto;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .img2 {
    left: 35%;
  }

  .section7 .text-content {
    padding-right: 20px;
  }

  .section7::before {
    border-bottom: 0;
    height: 105%;
  }

  .section7 .img2 {
    top: -130px;
  }
}

</style>