<template>
  <div class="section section9">
    <div class="st-title">
      <TitleComponent
          :circle-size="100"
          :icon-height="109"
          :icon-width="109"
          :order-number="9"
          component-height="100px"
          component-width="100%"
          icon-url="/imgs/icon-ho-tro.png"
          title="Hỗ trợ đàm phán để bán được giá cao nhất"
      />
    </div>

    <div class="main-content-wrapper">
      <div class="left-content-section">
        <div class="top-img"><img class="fade-left" src="/imgs/anh-ho-tro-1.png" alt=""></div>
        <div class="mid-img"><img class="fade-left" src="/imgs/anh-ho-tro-2.png" alt=""></div>
        <div class="bot-img"><img class="fade-left" src="/imgs/anh-ho-tro-3.png" alt=""></div>
        <img src="/imgs/bg-s4.png" alt="" class="bottom-left-img">
      </div>

      <div class="right-content-section">
        <div class="right-img fade-up"><img src="/imgs/anh-ho-tro-4.png" alt=""></div>
        <div class="text-content-wrapper">
          <div class="text-content fade-right">
            <p>
              Các chuyên viên giàu kinh nghiệm đại diện chủ nhà tham gia đàm phán, giúp thương lượng giá tối ưu nhất
              dựa trên dữ liệu thị trường, đảm bảo giao dịch nhanh mà vẫn có lợi nhất cho khách hàng.
            </p>
          </div>
        </div>
        <img class="bottom-right-img" src="/imgs/bg-s3.png" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComponent from "./TitleQickSale.vue";
</script>

<style scoped>
.section {
  padding: 50px 50px 0;
  margin-top: 250px;
  position: relative;
  overflow: visible;
}

.title-component { z-index: 1; }

.st-title {
  position: relative;
  width: 40%;
}
.st-title::before {
  content: "";
  position: absolute;
  border-left: 5px dashed #C2CBF0;
  width: 100%;
  height: 243%;
  bottom: 070px;
  left: 45px;
}
.st-title::after {
  content: "";
  position: absolute;
  border-right: 5px dashed #C2CBF0;
  width: 100%;
  height: 175%;
  top: -30px;
  left: 0;
}

.bottom-right-img {
  position: absolute;
  width: 70%;
  right: 0;
}

.bottom-left-img {
  position: absolute;
  bottom: -0px;
  left: 0px;
  width: 100%;
  border-radius: 10px;
  z-index: -1;
}

.top-img::before,
.mid-img::before,
.bot-img::before {
  content: "";
  position: absolute;
  border-top: 5px dashed #C2CBF0;
  border-right: 5px dashed #C2CBF0;
}
.top-img::before { width: 21%; height: 34%; top: 50px; right: 0; }
.mid-img::before { width: 18%; height: 62.7%; top: -20px; right: -20px; }
.bot-img::before { width: 15%; height: 177%; top: -20px; right: -20px; }

.top-img img,
.mid-img img,
.bot-img img {
  display: block;
  margin-left: auto;
}
.mid-img { transform: translate(100px, -100px); }
.bot-img { transform: translate(200px, -200px); }

.right-img img {
  display: block;
  margin: 0 auto;
}
.right-img { position: relative; }

.text-content-wrapper {
  position: relative;
  border-left: 0;
  border-top-right-radius: 50px;
  display: block;
  margin: 5px auto;
  max-width: 500px;
  background-color: white;
}
.section9 .text-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 17px;
  color: #333;
  text-align: justify;

}

.section9 .title-component { transform: translateY(-70px); }

.main-content-wrapper {
  display: flex;
}
.left-content-section,
.right-content-section {
  flex: 1;
  min-width: 0;
  position: relative;
}
.left-content-section {
  z-index: 3;
  padding-top: 50px;
}
.right-content-section {
  z-index: 2;
  transform: translateY(-50px);
}

/* Responsive */
@media (max-width: 1400px) {

  .section9::before {
    content: "";
    position: absolute;
    height: 105%;
    width: 2px;
    border-left: 5px dashed #C2CBF0;
    top: 0;
    left: 100px;
  }

  .st-title {
    width: 100%;
  }
  .st-title::before, .st-title::after {
    display: none !important;
  }

  /* Ẩn tất cả các đường viền dashed */
  .st-title::before,
  .st-title::after,
  .top-img::before,
  .mid-img::before,
  .bot-img::before {
    display: none;
  }

  /* Chỉ giữ lại border-left */
  .st-title {
    position: relative;
  }
  .st-title::after {
    display: block;
    content: "";
    position: absolute;
    border-left: 2px dashed #C2CBF0;
    width: 2px;
    height: 100%;
    left: 0;
    top: 0;
    bottom: 0;
  }

  /* Điều chỉnh kích thước và vị trí ảnh */
  .top-img img,
  .mid-img img,
  .bot-img img {
    max-width: 80%;
    height: auto;
  }

  .mid-img {
    transform: translate(50px, -50px);
  }
  .bot-img {
    transform: translate(100px, -100px);
  }

  .right-img img {
    max-width: 90%;
    height: auto;
  }
}

@media (max-width: 1308px) {
  .img-right::before,
  .text-content-wrapper::before { display: none }
  .text-content-wrapper::before { height: 300%; }
  .right-imgimg { transform: translate(0, 0); height: 100%; }
  .right-img { height: 145px; }
}

@media (max-width: 992px) {
  .main-content-wrapper {
    flex-direction: column;
    gap: 20px;
  }
  .left-content-section,
  .right-content-section {
    flex: none;
    width: 100%;
  }

  .right-content-section::before,
  .text-content-wrapper::before { display: none }

  .section9 {
    position: relative;
  }
  .bottom-right-img {
    display: none;
  }
  .text-content-wrapper {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 20px;
  }
  .right-imgimg {
    border-radius: 50px;
    height: 100%;
  }
  .right-img { height: 100%; }

  /* Điều chỉnh vị trí ảnh cho tablet */
  .mid-img {
    transform: translate(30px, -30px);
  }
  .bot-img {
    transform: translate(60px, -60px);
  }
}

@media (max-width: 768px) {
  .section {
    padding: 20px;
    margin-bottom: 30px;
    margin-top: 150px;
  }
  /* Điều chỉnh vị trí ảnh cho mobile */
  .top-img,
  .mid-img,
  .bot-img {
    text-align: center;
  }

  .top-img img,
  .mid-img img,
  .bot-img img {
    margin: 0 auto;
    max-width: 100%;
    transform: none !important;
  }

  .mid-img,
  .bot-img {
    transform: none !important;
    margin-top: 20px;
  }

  .right-content-section {
    transform: none;
  }

  .text-content-wrapper {
    margin-top: 20px;
  }
}

@media (max-width: 576px) {
  .section {
    padding: 15px;
    margin-top: 100px;
  }

  .section9 .title-component {
    transform: translateY(-30px);
  }

  .left-content-section {
    padding-top: 20px;
  }

  .section9::before {
    left: 63px;
    top: 0;
  }
}
</style>