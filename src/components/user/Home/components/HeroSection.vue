<template>
  <div class="real-estate-solution">
    <!-- Phần trên với background -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="video-content">
          <div class="video-frame">
            <!-- Khung video -->
            <img
                src="/imgs/khungVideo.svg"
                alt="Video frame"
                class="frame-image"
            />
            <!-- Video container -->
            <div class="video-container">
              <iframe
                  width="640"
                  height="360"
                  src="https://www.youtube.com/embed/JZ1YvvYo2hA?si=x9rywQQBLi_1Vcf8"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>

        <div class="text-content">
          <h1 class="title">GIẢI PHÁP BÁN GẤP BẤT ĐỘNG SẢN TRONG 30 NGÀY</h1>
          <p class="description">
            Thiên Hà Group tự hào là đơn vị có hơn 15 năm kinh nghiệm hoạt động
            trong lĩnh vực mua bán và đầu tư bất động sản tại Việt Nam.
          </p>
          <p class="description">
            Với phương châm
            <strong class="highlight">"Bất Động Sản Thật – Giá Trị Thật"</strong>,
            Thiên Hà Group luôn nỗ lực đồng hành cùng Quý khách hàng trong quá
            trình mua bán, kiến tạo nên những giá trị thật sự cho cả người mua
            và người bán.
          </p>
          <p class="description">
            Liên hệ ngay <b>Thiên Hà Group</b> để nhận tư vấn và hỗ trợ nhanh
            nhất!
          </p>
          <p class="description button-group">
            <button class="btn btn-primary">Về chúng tôi ></button>
            <router-link to="/giai-phap-ban-nhanh" class="btn btn-outline">Xem chi tiết</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Có thể thêm logic xử lý sự kiện cho các nút ở đây
</script>

<style scoped>
.real-estate-solution {
  font-family: "Ubuntu", sans-serif;
}

.hero-section {
  background-image: url("/imgs/bg-tin-tuc.png");
  background-size: cover;
  background-position: center;
  padding: 80px 0 40px;
}

.hero-content {
  margin: auto;
  display: flex;
  align-items: center;
  gap: 70px;
  max-width: 1400px;
  padding: 0 20px;
}

.video-content {
  flex: 0 0 auto;
}

.video-frame {
  position: relative;
  width: 640px;
  height: 380px;
}

/* Khung video */
.frame-image {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;
  pointer-events: none;
}

/* Video container */
.video-container {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.video-container iframe {
  width: 88%;
  height: 88%;
  border-radius: 12px;
}

.text-content {
  flex: 1;
  color: #031358;
}

.title {
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.3;
}

.description {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 15px;
  text-align: justify;
}

.highlight {
  color: #f8bd0d;
}

.button-group {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  border-radius: 25px;
  padding: 10px 45px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: 0.3s;
  font-size: 16px;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background-color: #031358;
  color: white;
}

.btn-primary:hover {
  background-color: #0a2463;
  color: white;
}

.btn-outline {
  background-color: transparent;
  color: #031358;
  border: 2px solid #031358;
}

.btn-outline:hover {
  background-color: #031358;
  color: white;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    gap: 40px;
  }

  .video-frame {
    width: 520px;
    height: 310px;
  }

  .title {
    font-size: 32px;
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    gap: 30px;
  }

  .title {
    font-size: 28px;
  }

  .description {
    font-size: 17px;
  }

  .button-group {
    justify-content: center;
  }
}

/* Thêm breakpoint cho màn hình nhỏ hơn 640px */
@media (max-width: 640px) {
  .video-frame {
    width: 100%;
    max-width: 500px;
    height: auto;
    aspect-ratio: 16/9;
    margin: 0 auto;
  }

  .video-container iframe {
    width: 90%;
    height: 90%;
  }
}

/* Điều chỉnh cho màn hình rất nhỏ */
@media (max-width: 480px) {
  .hero-section {
    padding: 50px 15px;
  }

  .video-frame {
    max-width: 100%;
  }

  .title {
    font-size: 24px;
    text-align: center;
  }

  .description {
    text-align: left;
  }

  .btn {
    padding: 10px 30px;
    width: 100%;
    max-width: 200px;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
  }
}

/* Điều chỉnh cho màn hình rất nhỏ (dưới 360px) */
@media (max-width: 360px) {
  .video-frame {
    max-width: 100%;
  }

  .video-container iframe {
    width: 92%;
    height: 92%;
  }

  .title {
    font-size: 22px;
  }

  .description {
    font-size: 16px;
  }
}
</style>