<template>
  <div class="section section2">
    <div class="st-title">
      <TitleComponent
          :circle-size="100"
          :icon-height="80"
          :icon-width="90"
          :order-number="2"
          component-height="80px"
          component-width="100%"
          icon-url="/imgs/icon-dong-y-gia-so-bo.png"
          title="Đồng ý giá sơ bộ"
          :is-right="true"
      ></TitleComponent>
    </div>
    <div class="main-content-wrapper">

      <img class="img1 fade-left" src="/imgs/anh-dong-y-1.png" alt="">
      <img class="img1rb fade-left" src="/imgs/anh-dong-y-1-rb.png" alt="">

      <div class="text-content fade-right">
        <p>
          Sau khi nhận được kết quả định giá, khách hàng và chuyên viên thống nhất mức giá đề xuất. Việc đồng thuận
          này giúp toàn bộ kế hoạch triển khai bán hàng sau đó được xây dựng trên cơ sở chính xác, phù hợp với thị
          trường.
        </p>
        <img class="img2" src="/imgs/anh-dong-y-2.png" alt="">
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


.section2::before {
  content: "";
  position: absolute;
  top: 0;
  left: -7px;
  width: 80%; /* nửa chiều rộng */
  height: 100%;
  border-top: 5px dashed #C2CBF0; /* màu và độ dày viền */
  border-left: 5px dashed #C2CBF0;
  margin-left: 75px;
  z-index: 0;
}

.section2 {
  margin-bottom: 40px;
  position: relative;
  overflow: visible;
  padding: 30px 20px 200px;
}

.section2 .title-component {
  transform: translateY(-70px);
}

.section2 .st-title {
  display: block;
  margin-left: auto;
  width: 40%;
}

.section2 .img1 {
  position: absolute;
  z-index: 1;
}

.section2 .img1rb {
  position: absolute;
  z-index: 3;
}

.section2 .img2 {
  position: absolute;
  bottom: -200px;
  right: -100px;
}

.section2 .main-content-wrapper {
  margin-top: 50px;
}

.section2 p {
  font-size: 17px;
  text-align: justify;
}

.section2 .text-content {
  background-color: white;
  /* bóng ngoài bình thường */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  width: 100%;
  margin-left: 25%;
  margin-right: 12.5%;
  padding: 20px 20px 20px 20%;
  z-index: 2;
  margin-top: 20px;
  position: relative;
}


@media (max-width: 768px) {

}

/* Responsive Design */
@media (max-width: 1400px) {
  .section2 {
    margin-bottom: 30px;
    padding: 20px 20px 150px;
  }

  .section2::before {
    width: 2px;
  }

  .section2  .img1, .section2 .img1rb {
    position: static;
  }

  /* Ẩn img1rb khi thu nhỏ */
  .section2 .img1rb {
    display: none;
  }

  /* Đặt tất cả về static */
  .section2 .img1,
  .section2 .img2,
  .section2 .text-content {
    position: static;
  }

  /* Canh giữa img1 */
  .section2 .img1 {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }

  /* Canh giữa img2 */
  .section2 .img2 {
    display: block;
    margin: 20px auto 0;
    max-width: 100%;
    position: static;
  }

  /* Điều chỉnh text-content */
  .section2 .text-content {
    margin: 20px 0 0 0;
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
  }

  /* Điều chỉnh main content wrapper */
  .main-content-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .section2 .st-title {
    display: block;
    margin-left: auto;
    width: 100%;
  }
}

</style>