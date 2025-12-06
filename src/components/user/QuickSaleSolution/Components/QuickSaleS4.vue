<template>
  <div class="section section4">
    <div class="st-title">
      <TitleComponent
          :circle-size="100"
          :icon-height="109"
          :icon-width="109"
          :order-number="4"
          component-height="80px"
          component-width="100%"
          icon-url="/imgs/icon-danh-gia-giao-dich.png"
          title="Đánh giá giao dịch thực tế"
          :is-right="true"
      >
      </TitleComponent>
    </div>
    <div class="main-content-wrapper">
      <div class="left-content-section fade-left">
        <img src="/imgs/anh-danh-gia-giao-dich-1.png" alt="dgsb">
      </div>

      <div class="right-content-section">
        <div class="text-content-wrapper">
          <div class="text-content fade-right">
            <p>
              Sau khi khảo sát, đội ngũ chuyên môn sẽ cập nhật lại giá trị thực tế của bất động sản – đảm bảo mức giá
              vừa cạnh tranh, vừa giúp chủ nhà đạt lợi nhuận tối ưu khi giao dịch.
            </p>
          </div>
        </div>
        <div class="img-right fade-up">
          <img src="/imgs/anh-danh-gia-giao-dich-2.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TitleComponent from "./TitleQickSale.vue";
</script>

<style scoped>
.section {
  padding: 50px 20px;
  margin-bottom: 40px;
  position: relative;
  overflow: visible;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.main-content-wrapper {
  box-sizing: border-box;
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
  margin-top: 5px;
  position: relative;
  padding: 30px 40px;
  border: 3px solid #031358;
  border-left: 0;
  border-top-right-radius: 50px;
  background-color: white;
}

.text-content-wrapper::before {
  content: "";
  position: absolute;
  border-right: 5px dashed #C2CBF0;
  border-bottom: 5px dashed #C2CBF0;
  width: 109%;
  height: 155%;
  right: -85px;
  top: -60px;

}

.img-right {
  position: relative;
}

.img-right::before {
  content: "";
  position: absolute;
  border-left: 5px dashed #C2CBF0;
  width: 113%;
  height: 125%;
  left: 24px;
  top: 21px;

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

.section4 .title-component {
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
  padding-right: 130px;
}

.left-content-section img {
  width: 100%;
}

.section4 .text-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 17px;
  color: #333;
  text-align: justify;
}

.st-title {
  width: 40%;
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

  .left-content-section img {
    width: auto;
    max-width: 80%;
  }

  /* ĐÃ SỬA: Bỏ display: none và thay bằng hiển thị bình thường */
  .text-content-wrapper {
    display: block;
    margin-bottom: 20px;
    border: 3px solid #031358;
    border-radius: 20px;
    padding: 20px;
  }

  .right-content-section::before {
    display: none;
  }

  .section4 {
    position: relative;
  }

  .section4::before {
    content: "";
    position: absolute;
    width: 1%;
    height: 100%;
    border-right: 5px dashed #C2CBF0;
    right: 70px;
    z-index: -1;
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

  /* Thêm style cho text trên mobile */
  .text-content p {
    font-size: 16px;
    line-height: 1.5;
    text-align: left;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 20px;
    margin-bottom: 30px;
  }

  .right-content-section {
    padding-right: 0;
    z-index: 2;
  }

  .section4::before{
    right: 69px;
  }

  /* Tối ưu cho mobile nhỏ */
  .text-content-wrapper {
    padding: 15px;
    margin-bottom: 15px;
  }

  .text-content p {
    font-size: 15px;
  }
}
</style>