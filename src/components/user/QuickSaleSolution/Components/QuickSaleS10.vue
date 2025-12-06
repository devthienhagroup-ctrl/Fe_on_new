<template>
  <div class="section section10">
    <div class="st-title">
      <TitleComponent
          :circle-size="100"
          :icon-height="90"
          :icon-width="109"
          :order-number="10"
          component-height="120px"
          component-width="100%"
          icon-url="/imgs/icon-phap-ly.png"
          title="Hỗ trợ pháp lý 100% đến khi hoàn tất giao dịch"
          :is-right="true"
      >
      </TitleComponent>
    </div>
    <div class="main-content-wrapper">
      <div class="left-content-section">
        <div class="left-img fade-left">
          <img src="/imgs/anh-phap-ly-1.png" alt="">
        </div>
        <div class="text-content-wrapper fade-up">
          <div class="text-content">
            <p>
              Đơn vị hỗ trợ trọn gói hồ sơ pháp lý: công chứng, sang tên, kiểm tra quy hoạch, hoàn tất thủ tục chuyển
              nhượng.
              Khách hàng chỉ cần ký hợp đồng và nhận tiền — mọi thủ tục còn lại đều được xử lý chuyên nghiệp, an toàn,
              đúng quy định pháp luật.
            </p>
          </div>
        </div>
        <div class="center-img">
          <img class="fade-up" src="/imgs/anh-phap-ly-3.png" alt="">
        </div>
      </div>

      <div class="right-content-section">
        <div class="right-img">
          <img class="fade-right" src="/imgs/anh-phap-ly-2.png" alt="">
        </div>
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
  font-size: 17px;
  box-sizing: border-box;
}

.section {
  margin-top: 50px;
  padding: 50px 20px;
  position: relative;
  margin-bottom: 50px;
}

.title-component {
  z-index: 1;
}

.st-title {
  display: block;
  width: 100%;
  margin-left: auto;
}

.st-title::before {
  content: "";
  position: absolute;
  border-top: 5px dashed #C2CBF0;
  border-right: 5px dashed #C2CBF0;
  width: 29.7%;
  height: 20%;
  top: -130px;
  right: 68px;
}

.text-content-wrapper {
  border-left: 0;
  border-radius: 20px;
  position: absolute;
  width: 80%;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  right: -25%;
  bottom: -10%;
  z-index: 2;
}

.left-img img, .right-img img {
  border-radius: 20px;
  width: 100%;
  height: auto;
  display: block;
}

.left-img img {
  margin-left: auto;
}

.right-content-section {
  position: relative;
}

.center-img img {
  width: 100%;
  border-radius: 20px;
  height: auto;
}

.center-img {
  width: 300px;
  position: absolute;
  top: -70px;
  right: -150px;
  z-index: 3;
}

/* Vòng tròn nét đứt */
.center-img::before {
  content: "";
  width: 350px;
  height: 350px;
  border: 5px dashed #C2CBF0;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.right-img {
  margin-top: 50px;
}

.section10::before {
  content: "";
  position: absolute;
  border-right: 5px dashed #C2CBF0;
  border-bottom: 5px dashed #C2CBF0;
  width: 35%;
  height: 20%;
  right: 68px;
  top: 0;
}

.section10 .title-component {
  transform: translateY(-70px);
}

.main-content-wrapper {
  display: flex;
  gap: 0;
  position: relative;
}

.left-content-section {
  flex: 1;
  min-width: 0;
  z-index: 3;
  position: relative;
}

.right-content-section {
  flex: 1;
  min-width: 0;
  z-index: 2;
  padding-right: 0;
}

.section10 .text-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 17px;
  color: #333;
  text-align: justify;
}

.st-title {
  width: 43%;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .main-content-wrapper {
    margin-top: 50px;
  }

  .st-title {
    width: 100%;
  }

  .text-content-wrapper {
    width: 90%;
    right: -20%;
  }

  .center-img {
    width: 280px;
    right: -120px;
  }

  .center-img::before {
    width: 320px;
    height: 320px;
  }

  .section10::before {
    height: 24%;
    width: 39%;
  }
  .st-title::before {
    display: none;
  }

}

@media (max-width: 1200px) {
  .section {
    padding: 40px 30px;
  }


  .text-content-wrapper {
    width: 95%;
    right: -15%;
    padding: 18px;
  }

  .center-img {
    width: 250px;
    right: -100px;
    top: -50px;
  }

  .center-img::before {
    width: 290px;
    height: 290px;
  }
}

@media (max-width: 992px) {
  .main-content-wrapper {
    flex-direction: column;
    gap: 30px;
    margin-top: 30px;
  }

  .left-content-section,
  .right-content-section {
    flex: none;
    width: 100%;
  }

  .st-title {
    width: 100%;
  }

  .st-title::before {
    display: none;
  }

  .section10::before {
    display: none;
  }

  .text-content-wrapper {
    position: relative;
    width: 100%;
    right: 0;
    bottom: 0;
    margin-top: 20px;
    padding: 25px;
  }

  .center-img {
    position: relative;
    width: 300px;
    top: 0;
    right: 0;
    margin: 30px auto;
  }

  .center-img::before {
    width: 340px;
    height: 340px;
  }

  .left-img img {
    margin-left: 0;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: block;
  }

  .right-img {
    margin-top: 20px;
  }

  .section10 .title-component {
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .section {
    padding: 30px 20px;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .text-content-wrapper {
    padding: 20px;
    margin-top: 15px;
  }

  .center-img {
    width: 250px;
    margin: 20px auto;
  }

  .center-img::before {
    width: 280px;
    height: 280px;
  }

  .section10 .text-content p {
    font-size: 16px;
    line-height: 1.5;
  }

  .left-img img,
  .right-img img {
    border-radius: 15px;
  }
}

@media (max-width: 576px) {
  .section {
    padding: 20px 15px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .text-content-wrapper {
    padding: 15px;
    border-radius: 15px;
    margin-top: 15px;
  }

  .center-img {
    width: 200px;
    margin: 15px auto;
  }

  .center-img::before {
    width: 230px;
    height: 230px;
  }

  .section10 .text-content p {
    font-size: 15px;
    line-height: 1.4;
    text-align: left;
  }

  .main-content-wrapper {
    gap: 20px;
  }

  .right-img {
    margin-top: 10px;
  }
}

@media (max-width: 400px) {
  .section {
    padding: 15px 10px;
  }

  .text-content-wrapper {
    padding: 12px;
  }

  .center-img {
    width: 180px;
  }

  .center-img::before {
    width: 210px;
    height: 210px;
  }

  .section10 .text-content p {
    font-size: 14px;
  }
}

/* Đảm bảo hình ảnh không vượt quá container */
img {
  max-width: 100%;
  height: auto;
}

/* Fix cho các thiết bị rất nhỏ */
@media (max-width: 360px) {
  .center-img {
    width: 160px;
  }

  .center-img::before {
    width: 190px;
    height: 190px;
  }

  .text-content-wrapper {
    padding: 10px;
  }
}
</style>