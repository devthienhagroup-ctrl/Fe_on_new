<template>
  <footer class="footer">
    <!-- Hàng 1: Google Map -->
    <div class="map-section" v-if="showMap">
      <div id="map"></div>
    </div>

    <!-- Hàng 2: Thông tin footer -->
    <div class="footer-main">
      <div class="footer-container">
        <div class="footer-columns">
          <!-- Cột 1: Thông tin liên hệ -->
          <div class="column contact-column">
            <div class="logo-section">
              <img
                  src="/imgs/logoTHG.png"
                  alt="Thiên Hà Group Logo"
                  class="logo"
              />
            </div>
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-map-marker-alt contact-icon"></i>
                <div>
                  <strong>Trụ sở:</strong>
                  <p>14 đường 15, KĐT Vạn Phúc, Phường Hiệp Bình Phước, TP. Thủ Đức, TP. Hồ Chí Minh</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="fas fa-building contact-icon"></i>
                <div>
                  <strong>Chi nhánh:</strong>
                  <p>01 Hoa Lài, Phường 7, Quận Phú Nhuận, TP. Hồ Chí Minh</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="fas fa-phone contact-icon"></i>
                <div>
                  <strong>Điện thoại:</strong>
                  <p>091.123.1882</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="fas fa-envelope contact-icon"></i>
                <div>
                  <strong>Email:</strong>
                  <p>thienhagroup@gmail.com</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="fas fa-comment contact-icon"></i>
                <div>
                  <strong>Zalo:</strong>
                  <p>091.123.1882</p>
                </div>
              </div>
              <div class="contact-item">
                <i class="fas fa-globe contact-icon"></i>
                <div>
                  <strong>Website:</strong>
                  <p>thienhaland.vn</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Cột 2: Dịch vụ -->
          <div class="column service-column">
            <h3 class="column-title">DỊCH VỤ</h3>
            <ul class="link-list">
              <li><a href="#" class="footer-link">Khảo sát bất động sản</a></li>
              <li><a href="#" class="footer-link">Đăng tin bất động sản</a></li>
              <li><a href="#" class="footer-link">Giải pháp bán gấp BĐS</a></li>
              <li><a href="#" class="footer-link">Định giá bất động sản</a></li>
              <li><a href="#" class="footer-link">Bán nhanh BĐS 30 ngày</a></li>
              <li><a href="#" class="footer-link">Truyền thông bất động sản</a></li>
            </ul>
          </div>

          <!-- Cột 3: Liên kết nhanh -->
          <div class="column link-column">
            <h3 class="column-title">LIÊN KẾT NHANH</h3>
            <ul class="link-list">
              <li><a href="#" class="footer-link">Mua</a></li>
              <li><a href="#" class="footer-link">Ký gửi</a></li>
              <li><a href="#" class="footer-link">Định giá</a></li>
              <li><a href="#" class="footer-link">Tin tức</a></li>
            </ul>
          </div>

          <!-- Cột 4: Chính sách -->
          <div class="column policy-column">
            <h3 class="column-title">CHÍNH SÁCH</h3>
            <ul class="link-list">
              <li><a href="#" class="footer-link">Chính sách bảo mật</a></li>
              <li><a href="#" class="footer-link">Điều khoản sử dụng</a></li>
              <li><a href="#" class="footer-link">Chính sách thanh toán</a></li>
              <li><a href="#" class="footer-link">Chính sách hoàn tiền</a></li>
              <li><a href="#" class="footer-link">Chính sách vận chuyển</a></li>
              <li><a href="#" class="footer-link">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          <!-- Cột 5: Facebook & Social -->
          <div class="column facebook-column">
            <div class="facebook-section">
              <!--              <iframe-->
              <!--                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D61557872978828&tabs=timeline&width=400&height=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"-->
              <!--                  class="facebook-iframe"-->
              <!--                  scrolling="no"-->
              <!--                  frameborder="0"-->
              <!--                  allowfullscreen="true"-->
              <!--                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">-->
              <!--              </iframe>-->
              <FacebookSDK></FacebookSDK>
            </div>

            <div class="social-section">
              <h3 class="column-title">THEO DÕI CHÚNG TÔI</h3>
              <div class="social-icons">
                <a
                    href="https://www.facebook.com/profile.php?id=61557872978828"
                    target="_blank"
                    class="social-icon"
                >
                  <i class="fa-brands fa-facebook"></i>
                </a>
                <a
                    href="https://www.youtube.com/channel/UCGC_o-bDRF8xT3riQRw9g6A"
                    target="_blank"
                    class="social-icon"
                >
                  <i class="fa-brands fa-youtube"></i>
                </a>
                <a
                    href="https://maps.app.goo.gl/R6hF1jWKM3HASqKPA?g_st=ipc"
                    target="_blank"
                    class="social-icon"
                >
                  <i class="fa-brands fa-google"></i>
                </a>
                <a
                    href="#"
                    target="_blank"
                    class="social-icon"
                >
                  <i class="fa-solid fa-comment"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onMounted } from "vue";
import FacebookSDK from "./FacebookSDK.vue";

const props = defineProps({
  showMap: {
    type: Boolean,
    default: true
  }
})

const initMap = () => {
  // Khởi tạo bản đồ với scroll wheel zoom bị vô hiệu hóa
  const map = L.map('map', {
    scrollWheelZoom: false // Tắt scroll zoom mặc định
  }).setView([10.840568825680299, 106.70976902627369], 130);

  // Thêm tile layer từ OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // Tọa độ chính xác của 2 địa điểm
  const headOfficeCoords = [10.840568825680299, 106.70976902627369]; // Trụ sở chính
  const branchCoords = [10.798316327341794, 106.69152447838239]; // Chi nhánh

  // Marker 1 - Trụ sở chính
  const headOfficeMarker = L.marker(headOfficeCoords)
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center;">
          <h5 style="margin: 0 0 8px 0; color: #0066cc;">TRỤ SỞ CHÍNH</h5>
          <p style="margin: 0; font-size: 14px;">14 đường 15, KĐT Vạn Phúc<br>Phường Hiệp Bình Phước, TP. Thủ Đức<br>TP. Hồ Chí Minh</p>
        </div>
      `)
      .openPopup(); // Mở popup ngay khi load

  // Marker 2 - Chi nhánh
  const branchMarker = L.marker(branchCoords)
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center;">
          <h5 style="margin: 0 0 8px 0; color: #0066cc;">CHI NHÁNH</h5>
          <p style="margin: 0; font-size: 14px;">01 Hoa Lài, Phường 7<br>Quận Phú Nhuận<br>TP. Hồ Chí Minh</p>
        </div>
      `);

  // Thêm đường nối giữa 2 marker với tọa độ chính xác
  const polyline = L.polyline([
    headOfficeCoords,
    branchCoords
  ], {
    color: '#0066cc',
    weight: 4,
    opacity: 0.7,
    dashArray: '8, 8',
    lineJoin: 'round'
  }).addTo(map);

  // Fit bounds để hiển thị cả 2 marker và đường nối
  const bounds = L.latLngBounds([headOfficeCoords, branchCoords]);
  map.fitBounds(bounds, { padding: [20, 20] });

  // Xử lý sự kiện scroll với Ctrl
  let isCtrlPressed = false;

  // Lắng nghe sự kiện keydown để phát hiện Ctrl
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
      isCtrlPressed = true;
      map.scrollWheelZoom.enable(); // Bật scroll zoom khi nhấn Ctrl
    }
  });

  // Lắng nghe sự kiện keyup để tắt khi nhả Ctrl
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Control') {
      isCtrlPressed = false;
      map.scrollWheelZoom.disable(); // Tắt scroll zoom khi nhả Ctrl
    }
  });

  // Tự động tắt scroll zoom khi chuột rời khỏi map
  map.on('mouseout', () => {
    map.scrollWheelZoom.disable();
  });
}

onMounted(() => {
  if(!props.showMap)
    return;
  // Đảm bảo Leaflet CSS đã được tải
  if (!document.querySelector('link[href*="leaflet"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }

  // Đảm bảo Leaflet JS đã được tải
  if (typeof L === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = initMap;
    document.head.appendChild(script);
  } else {
    initMap();
  }
});
</script>

<style scoped>
.footer {
  width: 100%;
  background-color: #f7f7f7;
  font-family: 'Ubuntu', sans-serif;
  color: #333;
}

/* Map Section */
.map-section {
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  height: 500px;
}

#map {
  width: 100%;
  height: 100%;
}

/* Footer Main Content */
.footer-main {
  width: 100%;
  padding: 30px 0;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-columns {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 20px;
  align-items: start;
}

/* Column Styles */
.column {
  display: flex;
  flex-direction: column;
}

.column-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #333;
}

/* Logo Section */
.logo-section {
  margin-bottom: 20px;
  text-align: center;
}

.logo {
  max-width: 160px;
  height: auto;
  margin: 0 auto;
}

/* Contact Info */
.contact-info {
  font-size: 14px;
  line-height: 1.4;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.contact-icon {
  color: #0066cc;
  font-size: 14px;
  margin-top: 2px;
  min-width: 16px;
}

.contact-item strong {
  color: #333;
  display: inline;
  margin-right: 5px;
}

.contact-item p {
  margin: 0;
  color: #666;
  line-height: 1.4;
  display: inline;
}

/* Link Lists */
.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li {
  margin-bottom: 10px;
}

.footer-link {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 14px;
  line-height: 1.4;
  display: block;
  padding: 3px 0;
}

.footer-link:hover {
  color: #0066cc;
}

/* Facebook Section */
.facebook-section {
  margin-bottom: 20px;
}

.facebook-iframe {
  width: 100%;
  height: 300px;
  border: none;
  border-radius: 8px;
}

/* Social Icons */
.social-icons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #fff;
  border-radius: 50%;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.social-icon:hover {
  background-color: #0066cc;
  color: #fff;
}

.social-icon i {
  font-size: 18px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .footer-columns {
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 20px;
  }

  .policy-column {
    display: none;
  }
}

@media (max-width: 1024px) {
  .footer-columns {
    grid-template-columns: 1.5fr 1fr 1.5fr;
    gap: 20px;
  }

  .link-column {
    display: none;
  }
}

@media (max-width: 768px) {
  .footer-main {
    padding: 25px 0;
  }

  .footer-columns {
    grid-template-columns: 1fr;
    gap: 25px;
  }

  .map-section {
    height: 350px;
  }

  .facebook-iframe {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .footer-main {
    padding: 20px 0;
  }

  .footer-columns {
    gap: 20px;
  }

  .column-title {
    font-size: 16px;
  }

  .contact-info,
  .footer-link {
    font-size: 13px;
  }

  .logo {
    max-width: 140px;
  }

  .map-section {
    height: 300px;
  }

  .facebook-iframe {
    height: 200px;
  }

  .social-icons {
    gap: 10px;
  }

  .social-icon {
    width: 38px;
    height: 38px;
  }

  .social-icon i {
    font-size: 16px;
  }

  .contact-item {
    padding: 8px;
    margin-bottom: 10px;
  }

  .contact-icon {
    font-size: 13px;
  }
}

/* Leaflet map styles */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

:deep(.leaflet-popup-content) {
  margin: 12px 16px;
  font-family: 'Ubuntu', sans-serif;
}

:deep(.leaflet-popup-tip) {
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
/* Thêm tooltip hướng dẫn */
.map-section {
  position: relative;
}

.map-section::after {
  content: "Giữ Ctrl + cuộn chuột để zoom bản đồ";
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
}
</style>