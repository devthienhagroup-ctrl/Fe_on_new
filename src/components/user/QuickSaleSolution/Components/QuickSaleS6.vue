<template>
  <div class="section section6">
    <div class="st-title">
      <TitleComponent
          :circle-size="100"
          :icon-height="109"
          :icon-width="109"
          :order-number="6"
          component-height="120px"
          component-width="100%"
          icon-url="/imgs/icon-len-y-tuong.png"
          title="Lên ý tưởng chiến lược trên từng bất động sản"
          :is-right="true"
      >
      </TitleComponent>
    </div>
    <div class="main-content-wrapper">
      <div class="left-content-section fade-left">
        <img src="/imgs/anh-len-y-tuong-1.png" alt="dgsb">
      </div>

      <div class="right-content-section">
        <div class="text-content-wrapper">
          <div class="text-content fade-up">
            <p>
              Đội ngũ marketing sẽ xây dựng <b>kế hoạch truyền thông chuyên biệt cho từng bất động sản</b>, bao gồm:
            </p>
            <ul>
              <li><b>Sáng tạo nội dung quảng cáo hấp dẫn</b>, đánh trúng tâm lý người mua.</li>
              <li><b>Thiết kế hình ảnh và video chuyên nghiệp</b>, làm nổi bật giá trị thật của sản phẩm.</li>
              <li><b>Triển khai chiến dịch quảng bá đa kênh</b> (Facebook, Google, Zalo, sàn BĐS, website).</li>
            </ul>
            <p>
               <b>Mục tiêu:</b> Tối đa hóa lượng khách hàng tiềm năng và đẩy nhanh giao dịch trong <b>30 ngày</b>.
            </p>
          </div>
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
}

.section {
  padding: 50px  20px;
  position: relative;
  overflow: visible;
}

.title-component {
  z-index: 1;

}

.st-title {
  display: block;
  width: 100%;
  margin-left: auto;
}


.text-content-wrapper {
  margin-top: 50px;
  position: relative;
  padding: 30px 60px;
  border-left: 0;
  border-radius: 20px;
  min-height: 80%;


  /* thêm phần này nè */
  background-image: url("/imgs/anh-len-y-tuong-2.png");
  background-size: cover; /* hoặc contain nếu muốn thấy toàn ảnh */
  background-position: center;
  background-repeat: no-repeat;

}


.section6::before {
  content: "";
  position: absolute;
  border-right: 5px dashed #C2CBF0;
  border-bottom: 5px dashed #C2CBF0;
  width: 80%;
  height: 106.5%;
  right: 68px;
  top: 0;
}



.right-content-section {
  position: relative;
}

/*
.right-content-section::before {
  content: "";
  position: absolute;
  border-right: 5px dashed #C2CBF0;
  width: 100%;
  height: 120%;
  right: 75px;
  top: -70px;
}
*/

.section6 .title-component {
  transform: translateY(-70px);
}


.main-content-wrapper {
  display: flex;
}

.left-content-section {
  flex: 1;
  min-width: 0;
  z-index: 3;
}

.right-content-section {
  flex: 1;
  min-width: 0;
  z-index: 2;
  padding-right: 10%;
}

.left-content-section img {
  transform: translate(130px, -50px);
  width: 90%;
}

.section6 .text-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 17px;
  color: #333;
  text-align: justify;
}

.st-title {
  width: 45%;
}

.right-content-section img {
  width: 100%;
  transform: translate(40px, 40px);
}

/* Responsive Design */



@media (max-width: 1400px) {
  .st-title {
    width: 100%;
  }
}

@media (max-width: 1308px) {
  .img-right::before {
    display: none;

  }

  .text-content-wrapper::before {
    border-bottom: 0;
    height: 300%;
  }

  .img-right img {
    transform: translate(0,0);
    height: 100%;
  }

  .img-right {
    height: 145px;
  }




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

  .text-content-wrapper {
  }

  .right-content-section::before {
    display: none;
  }

  .section6 {
    position: relative;
  }

  .section6::before {
    content: "";
    position: absolute;
    width: 1%;
    height: 106%;
    border-right: 5px dashed #C2CBF0;
    right: 96px;
  }

  .text-content-wrapper {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
  }

  .text-content-wrapper::before {
    display: none;
  }

  .img-right img {
    border-radius: 50px;
    height: 100%;
  }

  .img-right {
    height: 100%;
  }

  .left-content-section img {
    transform: translate(0px, 0px);


  }

  .right-content-section {
    padding-right: 10px;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 20px;
    margin-bottom: 30px;
  }

  .text-content-wrapper {
    padding: 20px;
  }

  /* Tăng chiều cao cho TitleComponent trên mobile */
  .section5 .st-title :deep(.title-component) {
    height: 150px !important;
  }

  .section6::before {
    right: 67px;
  }
}

</style>