<template>
  <div class="section section3">
    <div class="st-title">
      <TitleComponent
          :circle-size="100"
          :icon-height="109"
          :icon-width="109"
          :order-number="3"
          component-height="80px"
          component-width="100%"
          icon-url="/imgs/icon-khao-sat.png"
          title="Khảo sát"
      >
      </TitleComponent>
    </div>
    <div class="main-content-wrapper ">
      <div class="left-content-section">
        <img src="/imgs/anh-khao-sat-1.png" alt="dgsb">
      </div>

      <div class="right-content-section">
        <div class="text-content-wrapper">
          <div class="text-content fade-up">
            <p>
              Chuyên viên tiến hành khảo sát trực tiếp bất động sản để xác minh tình trạng, pháp lý, vị trí, môi
              trường
              sống và giá trị xung quanh. Bước này giúp củng cố tính chính xác của giá định và nâng cao niềm tin của
              người
              mua.
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
.section {
  padding: 20px;
  margin-bottom: 40px;
  position: relative;
  overflowY: visible;
}

.title-component {
  z-index: 1;
}

/* tạo viền nửa trên bên phải */
.section3::before {
  content: "";
  position: absolute;
  top: -10px;
  right: 30px;
  width: 60%;
  height: 350px;
  border-top: 5px dashed #C2CBF0;
  border-right: 5px dashed #C2CBF0;
  border-bottom: 5px dashed #C2CBF0;
  z-index: 1;
}

.text-content-wrapper {
  position: relative;
  padding: 30px 40px;
}


.text-content-wrapper::before {
  content: "";
  position: absolute;
  top: -70px;
  left: 0;
  border-left: 5px dashed #C2CBF0;
  border-top: 5px dashed #C2CBF0;
  width: 103.5%;
  height: 350px;
  z-index: -1;
}

.right-content-section {
  position: relative;
}

.right-content-section::before {
  content: "";
  position: absolute;
  border-right: 5px dashed #C2CBF0;
  width: 100%;
  height: 130%;
  right: 48px;
  top: -70px;
}


.section3 .title-component {
  transform: translateY(-70px);
}

.main-content-wrapper {
  display: flex;
  gap: 30px;
}

.left-content-section {
  flex: 1;
  min-width: 0;
  z-index: 3;
  transform: translateX(70px);
}

/* CSS cho ảnh - đã thêm responsive */
.left-content-section img {
  width: 100%;
  height: auto;
  display: block;
  max-width: 100%;
  object-fit: cover;
  border-radius: 10px;
  transform: translateX(60px);
}

.right-content-section {
  flex: 1;
  min-width: 0;
  z-index: 2;
  padding: 0 70px;
}

.section3 .text-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 17px;
  color: #000000;
  text-align: justify;
  padding-right: 60px;
}

.detail-button {
  background-color: #0827AF;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 17px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin-left: auto;
}

.detail-button:hover {
  background-color: #041b6a;
}

.st-title {
  width: 40%;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .st-title {
    width: 100%;
  }


}

@media (max-width: 1200px) {
  .left-content-section img {
    max-height: 400px;
    object-fit: cover;
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
    transform: none;
  }

  .left-content-section {
    text-align: center;
  }

  .left-content-section img {
    max-height: 350px;
    width: auto;
    max-width: 100%;
    margin: 0 auto;
  }

  .text-content-wrapper::before {
    display: none;
  }

  .right-content-section::before {
    display: none;
  }

  .section3::before {
    border-bottom: 0;
    height: 110%;
    right: 70px;
  }

  .text-content-wrapper {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
  }
}

@media (max-width: 768px) {
  .section {
    padding: 20px;
  }

  .right-content-section{
    padding: 0 20px;
  }

  .section3 .text-content p {
    padding: 5px;
    font-size: 16px;
  }

  .left-content-section img {
    max-height: 300px;
    width: 100%;
    transform: translateX(0);
  }
}

@media (max-width: 576px) {
  .left-content-section img {
    max-height: 250px;
    transform: translateX(0);
  }

  .text-content-wrapper {
    padding: 20px;
    background-color: white;
  }
}
</style>