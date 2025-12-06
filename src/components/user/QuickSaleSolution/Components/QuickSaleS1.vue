<template>

  <div class="section section1">
    <div class="decor1">
      <img src="/imgs/trang-tri-1.png" alt="">
    </div>

    <div class="decor2">
      <img src="/imgs/trang-tri-2.png" alt="">
    </div>
    <div class="st-title fade-right">
      <TitleComponent
          :circle-size="100"
          :icon-height="109"
          :icon-width="109"
          :order-number="1"
          component-height="80px"
          component-width="100%"
          icon-url="/imgs/icon-dinh-gia-so-bo.png"
          title="Định giá sơ bộ"
      />
    </div>

    <div class="main-content-wrapper">
      <!-- Hiệu ứng xuất hiện -->
      <div class="left-content-section fade-left">
        <div class="text-content">
          <p>
            Đây là nền tảng đầu tiên và quan trọng nhất trong quy trình. Đội ngũ chuyên viên sẽ tiến hành định giá sơ
            bộ
            thông qua hệ thống chuyên nghiệp, giúp khách hàng biết được giá trị thật của bất động sản trước khi bán.
          </p>
          <router-link to='/dinh-gia-bds' class="detail-button">Xem chi tiết</router-link>
        </div>
      </div>

      <div class="right-content-section fade-right">
        <img src="/imgs/anh-dinh-gia-so-bo.png" alt="dgsb">
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import TitleComponent from "./TitleQickSale.vue";

</script>
<style scoped>

/****************************************/
.decor1{
  position: absolute;
  z-index: -1;
  width: auto;
  bottom: 0;
 height: 100px;
}

.decor1 img, .decor2 img {
  width: 100%;
  height: 100%;
}

.decor2 {
  position: absolute;
  z-index: -1;
  width: auto;
  bottom: 0;
  height: 700px;
  right: 0;
}



/****************************************/
.section {
  position: relative;
  padding: 20px;
  margin-bottom: 40px;
  overflow: visible;

}

.title-component {
  z-index: 1;
}

/* Viền nửa trên bên phải */
.section1::before {
  content: "";
  position: absolute;
  top: -10px;
  right: 0;
  width: 80%;
  height: 123%;
  border-top: 5px dashed #c2cbf0;
  border-right: 5px dashed #c2cbf0;
  margin-right: 75px;
  z-index: -1;
}

.section1 .title-component {
  transform: translateY(-70px);
}

.main-content-wrapper {
  display: flex;
  align-items: center;
  gap: 30px;
}

.left-content-section {
  flex: 1;
  min-width: 0;
  z-index: 2;
}

.right-content-section {
  flex: 1.4;
  min-width: 0;
  z-index: 2;
}

.right-content-section img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.section1 .text-content {
  border: 2px #0827af solid;
  padding: 50px 50px 10px;
  border-top-left-radius: 150px;
  border-bottom-left-radius: 150px;
  border-right: 0;
}

.section1 .text-content p {
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 17px;
  color: #333;
  text-align: justify;
  padding-right: 30px;
}

.detail-button {
  background-color: #0827af;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 17px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin-left: auto;
  margin-right: 30px;
  text-decoration: none;
  text-align: center;
  width: 40%;
  min-width: 150px;
}

.detail-button:hover {
  background-color: #041b6a;
}

.st-title {
  width: 40%;
}


/* Responsive */
@media (max-width: 1400px) {
  .st-title {
    width: 100%;
  }
  .section1::before {
    width: 2px;
    height: 115%;
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

  .section1::before {
  }
}

@media (max-width: 768px) {
  .section {
    padding: 20px;
    margin-bottom: 30px;
  }

  .decor2 {
    display: none;
  }



}
</style>
