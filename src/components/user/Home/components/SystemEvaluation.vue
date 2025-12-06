<template>
  <div class="system-evaluation">
    <div class="container">

      <div class="columns-wrapper">
        <!-- Left Column (Foreground Card) -->
        <div class="left-column">
          <h2 class="title">ĐÁNH GIÁ HỆ THỐNG</h2>
          <ol class="numbered-list">
            <li>"Chúng tôi đánh giá toàn diện hệ thống hiện tại của bạn"</li>
            <li>"Phân tích các điểm mạnh và điểm cần cải thiện"</li>
            <li>"Đề xuất giải pháp tối ưu phù hợp với nhu cầu"</li>
            <li>"Triển khai công nghệ hiện đại và hiệu quả"</li>
            <li>"Hỗ trợ và bảo trì liên tục sau triển khai"</li>
          </ol>
          <img class="left-img" alt="" src="/imgs/anhnencot.png">
        </div>

        <!-- Right Column (Background Card) -->
        <div class="right-column">
          <div class="right-column-content">
            <p>Với kinh nghiệm 15 năm trong lĩnh vực mua bán, đầu tư bất động sản với hơn 130 căn bán gấp 30 ngày trong năm 2024 với giá cao nhất thị trường, cùng với đó là 329 bất động sản đã cho thuê thành công trong năm 2024.</p>
            <p>Và chúng tôi tin rằng con số đó sẽ còn tăng mạnh mẽ hơn nữa trong những năm tiếp theo. Từ nền tảng vững chắc tại TP.HCM, Thiên Hà Group đang mở rộng hành trình chinh phục thị trường bất động sản Việt Nam.</p>
            <p>Với đội ngũ chuyên nghiệp và quy trình bán nhanh tối ưu, chúng tôi cam kết mang lại giá trị thực cho khách hàng ở nhiều tỉnh thành hơn trong tương lai gần.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.system-evaluation {
  font-family: 'Ubuntu', sans-serif;
  width: 100%;
  padding: 60px 20px;
  box-sizing: border-box;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.columns-wrapper {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: flex-start;
}

/* Left Column Styles */
.left-column {
  width: 45%;
  background-color: #F3F5FC;
  color: #031358;
  padding: 60px 40px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 2;
  box-sizing: border-box;
  position: relative;
  margin-top: 0;
}

/* Image Styles */
.left-column .left-img {
  position: absolute;
  margin-top: 20px;
  right: -70px;
  bottom: -30px;
  width: 250px;
  height: auto;
  max-width: 100%;
  object-fit: contain;
}

/* Right Column Styles */
.right-column {
  width: 65%;
  background-color: #031358;
  color: #FFFFFF;
  padding: 80px 40px 50px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 1;
  box-sizing: border-box;
  margin-left: -10%;
  margin-top: 60px;
  position: relative;
}

.right-column-content {
  margin-left: 20%;
}

/* Typography Styles */
.title {
  font-size: 33px;
  font-weight: bold;
  text-transform: uppercase;
  color: #031358;
  margin-bottom: 25px;
  margin-top: 0;
  line-height: 1.2;
}

.numbered-list {
  font-size: 17px;
  line-height: 1.8;
  margin: 0;
  padding-left: 20px;
}

.numbered-list li {
  margin-bottom: 12px;
}

.numbered-list li:last-child {
  margin-bottom: 0;
}

.right-column p {
  font-size: 17px;
  line-height: 1.8;
  margin-bottom: 20px;
  margin-top: 0;
}

.right-column p:last-child {
  margin-bottom: 0;
}


.arrow-container {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.arrow {
  position: absolute;
  transition: all 0.8s ease-in-out;
  width: 60px;
  height: 60px;
}

.arrow-before {
  opacity: 1;
  transform: translateY(0);
}

.arrow-after {
  opacity: 0;
  transform: translateY(20px);
}

.fade-out {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-in {
  opacity: 1;
  transform: translateY(10px);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .right-column-content {
    margin-left: 15%;
  }

  .left-column .left-img {
    right: -30px;
    bottom: -20px;
    width: 160px;
  }
}

@media (max-width: 992px) {
  .columns-wrapper {
    flex-direction: column;
    min-height: auto;
  }

  .left-column {
    width: 100%;
    margin-bottom: 20px;
    padding: 40px;
    position: relative;
  }

  .left-column .left-img {
    position: relative;
    right: auto;
    bottom: auto;
    width: 200px;
    margin: 30px auto 0 auto;
    display: block;
  }

  .right-column {
    width: 100%;
    margin-left: 0;
    margin-top: 0;
    padding: 40px;
  }

  .right-column-content {
    margin-left: 0;
  }

  .system-evaluation {
    padding: 40px 15px;
  }
}

@media (max-width: 768px) {
  .left-column,
  .right-column {
    padding: 30px 25px;
  }

  .title {
    font-size: 28px;
  }

  .numbered-list,
  .right-column p {
    font-size: 16px;
    line-height: 1.6;
  }

  .left-column .left-img {
    width: 180px;
    margin-top: 25px;
  }
}

@media (max-width: 480px) {
  .left-column,
  .right-column {
    padding: 25px 20px;
  }

  .title {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .numbered-list,
  .right-column p {
    font-size: 15px;
    line-height: 1.5;
  }

  .left-column .left-img {
    width: 150px;
    margin-top: 20px;
  }
}

/* Extra small devices */
@media (max-width: 360px) {
  .left-column .left-img {
    width: 130px;
    margin-top: 15px;
  }
}
</style>