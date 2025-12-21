<template>
  <footer class="footer">
    <!-- Hàng 1: Google Map -->
    <div class="map-section" v-if="showMap">
      <div id="map"></div>
    </div>

    <!-- Hàng 2: Nội dung chính footer -->
    <div class="footer-main">
      <div class="footer-container">
        <!-- Cột 1: Thông tin liên hệ -->
        <div class="footer-column contact-column">
          <div class="logo-section">
            <img
                src="/imgs/logoTHG.png"
                alt="Thiên Hà Group Logo"
                class="logo"
            />
          </div>

          <h4 class="column-title">
            <i class="icon fas fa-map-marker-alt"></i> LIÊN HỆ
          </h4>

          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-building"></i>
              </div>
              <div class="contact-text">
                <strong>Trụ sở chính:</strong>
                <p>14 đường 15, KĐT Vạn Phúc, Phường Hiệp Bình Phước, TP. Thủ Đức, TP.HCM</p>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-building"></i>
              </div>
              <div class="contact-text">
                <strong>Chi nhánh:</strong>
                <p>01 Hoa Lài, Phường 7, Quận Phú Nhuận, TP. Hồ Chí Minh</p>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="contact-text">
                <strong>Giờ làm việc:</strong>
                <p>Thứ 2 - Thứ 7: 8:30 - 17:00</p></div>
            </div>

            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-headset"></i>
              </div>
              <div class="contact-text">
                <strong>Hotline hỗ trợ:</strong>
                <p>091.123.1882</p>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="contact-text">
                <strong>Email:</strong>
                <p>thienhagroup@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Cột 2: Dịch vụ -->
        <div class="footer-column services-column">
          <h4 class="column-title">
            <i class="icon fas fa-concierge-bell"></i> DỊCH VỤ
          </h4>
          <ul class="footer-links">
            <li><a href="#"><i class="link-icon fas fa-search"></i> Khảo sát & Định giá BĐS</a></li>
            <li><a href="#"><i class="link-icon fas fa-home"></i> Mua bán Nhà đất chính chủ</a></li>
            <li><a href="#"><i class="link-icon fas fa-file-signature"></i> Ký gửi BĐS</a></li>
            <li><a href="#"><i class="link-icon fas fa-chart-line"></i> Tư vấn đầu tư</a></li>
            <li><a href="#"><i class="link-icon fas fa-handshake"></i> Cho thuê BĐS cao cấp</a></li>
            <li><a href="#"><i class="link-icon fas fa-gavel"></i> Hỗ trợ pháp lý</a></li>
          </ul>
        </div>

        <!-- Cột 3: Thông tin & Chính sách -->
        <div class="footer-column info-column">
          <div class="info-section">
            <h4 class="column-title">
              <i class="icon fas fa-info-circle"></i> THÔNG TIN
            </h4>
            <ul class="footer-links">
              <li><a href="#"><i class="link-icon fas fa-user-tie"></i> Về Thiên Hà Group</a></li>
              <li><a href="#"><i class="link-icon fas fa-newspaper"></i> Tin tức thị trường</a></li>
              <li><a href="#"><i class="link-icon fas fa-project-diagram"></i> Dự án triển khai</a></li>
              <li><a href="#"><i class="link-icon fas fa-handshake"></i> Cơ hội hợp tác</a></li>
              <li><a href="#"><i class="link-icon fas fa-briefcase"></i> Tuyển dụng</a></li>
            </ul>
          </div>

          <div class="policy-section">
            <h4 class="column-title">
              <i class="icon fas fa-file-contract"></i> CHÍNH SÁCH
            </h4>
            <ul class="footer-links">
              <li><a href="#"><i class="link-icon fas fa-user-shield"></i> Bảo mật</a></li>
              <li><a href="#"><i class="link-icon fas fa-balance-scale"></i> Điều khoản</a></li>
              <li><a href="#"><i class="link-icon fas fa-question-circle"></i> FAQ</a></li>
              <li><a href="#"><i class="link-icon fas fa-exchange-alt"></i> Hoàn tiền</a></li>
            </ul>
          </div>
        </div>

        <!-- Cột 4: Đăng ký nhận tin & Mạng xã hội -->
        <div class="footer-column newsletter-column">
          <!-- Form đăng ký nhận tin -->
          <div class="newsletter-section">
            <h4 class="column-title">
              <i class="icon fas fa-newspaper"></i> NHẬN BẢN TIN
            </h4>
            <p class="newsletter-description">Cập nhật tin thị trường và ưu đãi đặc biệt</p>
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <div class="form-group">
                <input
                    type="email"
                    v-model="email"
                    placeholder="Nhập email của bạn"
                    required
                />
                <button type="submit">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
              <p class="form-note">Cam kết không spam. Hủy đăng ký bất cứ lúc nào.</p>
            </form>
          </div>

          <!-- Liên hệ nhanh -->
          <div class="contact-form-section">
            <h4 class="column-title">
              <i class="icon fas fa-comments"></i> LIÊN HỆ NHANH
            </h4>
            <form @submit.prevent="submitContact" class="contact-form">
              <input type="text" v-model="contact.name" placeholder="Họ và tên" required>
              <input type="tel" v-model="contact.phone" placeholder="Số điện thoại" required>
              <button type="submit">
                <i class="fas fa-paper-plane"></i> Yêu cầu gọi lại
              </button>
            </form>
            <p class="response-time">
              <i class="fas fa-clock"></i> Phản hồi trong 15 phút
            </p>
          </div>

          <!-- Mạng xã hội -->
          <div class="social-section">
            <h4 class="column-title">
              <i class="icon fas fa-share-alt"></i> KẾT NỐI
            </h4>
            <div class="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61557872978828" class="social-icon facebook" target="_blank">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon zalo" target="_blank">
                <i class="fas fa-comment-dots"></i>
              </a>
              <a href="https://www.youtube.com/channel/UCGC_o-bDRF8xT3riQRw9g6A" class="social-icon youtube" target="_blank">
                <i class="fab fa-youtube"></i>
              </a>
              <a href="#" class="social-icon tiktok" target="_blank">
                <i class="fab fa-tiktok"></i>
              </a>
              <a href="https://maps.app.goo.gl/R6hF1jWKM3HASqKPA?g_st=ipc" class="social-icon map" target="_blank">
                <i class="fab fa-google"></i>
              </a>
              <a href="tel:19001234" class="social-icon phone">
                <i class="fas fa-phone-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer bottom -->
    <div class="footer-bottom">
      <div class="footer-container">
        <div class="footer-bottom-content">
          <div class="copyright">
            <p>&copy; 2015-2024 <b>THIÊN HÀ GROUP</b>. Bảo lưu mọi quyền.</p>
            <p>Giấy phép kinh doanh số: 0123456789 do Sở Kế hoạch & Đầu tư TP.HCM cấp</p>
          </div>

          <div class="payment-methods">
            <span>Phương thức thanh toán:</span>
            <div class="payment-icons">
              <i class="fab fa-cc-visa" title="Visa"></i>
              <i class="fab fa-cc-mastercard" title="MasterCard"></i>
              <i class="fab fa-cc-paypal" title="PayPal"></i>
              <i class="fas fa-qrcode" title="QR Code"></i>
            </div>
          </div>

          <div class="back-to-top">
            <button @click="scrollToTop" class="back-to-top-btn">
              <i class="fas fa-chevron-up"></i>
              <span>Lên đầu trang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  showMap: {
    type: Boolean,
    default: true
  }
})

const email = ref('');
const contact = ref({
  name: '',
  phone: '',
  service: ''
});

const subscribeNewsletter = () => {
  console.log('Subscribing:', email.value);
  alert('Cảm ơn bạn đã đăng ký nhận tin!');
  email.value = '';
};

const submitContact = () => {
  console.log('Contact request:', contact.value);
  alert('Yêu cầu của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ trong thời gian sớm nhất!');
  contact.value = { name: '', phone: '', service: '' };
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

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
  if (props.showMap) {
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
  }
});
</script>

<style scoped>
/* ========== Biến màu chuyên nghiệp ========== */
.footer {
  --primary-color: #2c3e50;       /* Xanh đen chuyên nghiệp */
  --secondary-color: #3498db;     /* Xanh dương nhẹ */
  --accent-color: #031358;        /* Xanh ngọc hiện đại */
  --light-color: #f8f9fa;
  --dark-color: #2c3e50;
  --text-color: #555;
  --border-color: #eaeaea;
  --hover-color: #f1f8ff;
  font-family: 'Segoe UI', 'Inter', -apple-system, sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: #f7f7f7;
}

.contact-column .logo-section {
  display: flex;
}

.contact-column .logo-section img{
  margin: 0 auto;
}

/* ========== Map Section ========== */
.map-section {
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  height: 450px;
  position: relative;
}

#map {
  width: 100%;
  height: 100%;
}

.map-section::after {
  content: "Giữ Ctrl + cuộn chuột để zoom bản đồ";
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  pointer-events: none;
  white-space: nowrap;
}

/* ========== Footer Main ========== */
.footer-main {
  background: white;
  padding: 60px 0 40px;
  border-top: 1px solid var(--border-color);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}

@media (max-width: 992px) {
  .footer-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
}

@media (max-width: 576px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

/* Logo Section */
.contact-column .logo-section {
  margin-bottom: 20px;
  text-align: left;
}

.contact-column .logo {
  max-width: 160px;
  height: auto;
}

/* Column Titles */
.column-title {
  font-size: 16px;
  color: var(--primary-color);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--accent-color);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.column-title .icon {
  color: var(--accent-color);
  font-size: 14px;
}

/* Contact Column */
.contact-info {
  margin-bottom: 25px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.contact-item:hover {
  background-color: var(--hover-color);
}

.contact-icon {
  color: var(--accent-color);
  font-size: 14px;
  margin-top: 3px;
  min-width: 16px;
}

.contact-text strong {
  display: block;
  margin-bottom: 6px;
  color: var(--dark-color);
  font-size: 14px;
}

.contact-text p {
  margin: 4px 0;
  font-size: 13.5px;
  color: #666;
  line-height: 1.5;
}

.hotline {
  color: var(--secondary-color);
  font-weight: 600;
  font-size: 16px;
}

/* Footer Links */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0 0 25px 0;
}

.footer-links li {
}

.footer-links a {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  padding: 6px 0;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.footer-links a:hover {
  color: var(--accent-color);
  padding-left: 5px;
}

.link-icon {
  width: 14px;
  color: var(--accent-color);
  font-size: 12px;
}

/* Newsletter Section */
.newsletter-section {
  margin-bottom: 30px;
}

.newsletter-description {
  font-size: 13.5px;
  color: #666;
  margin-bottom: 18px;
  line-height: 1.5;
}

.newsletter-form .form-group {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.newsletter-form input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.newsletter-form button {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0 18px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.newsletter-form button:hover {
  background: #0f2b7a;
}

.form-note {
  font-size: 12px;
  color: #888;
  line-height: 1.4;
}

/* Contact Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.contact-form input {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.contact-form input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.contact-form button {
  background: var(--secondary-color);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.contact-form button:hover {
  background: #2980b9;
}

.response-time {
  font-size: 12.5px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Social Icons */
.social-icons {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: 15px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 14px;
}

.social-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.social-icon.facebook { background: #1877f2; }
.social-icon.zalo { background: #0068ff; }
.social-icon.youtube { background: #ff0000; }
.social-icon.tiktok { background: #000000; }
.social-icon.phone { background: #25d366; }
.social-icon.map { background: #34a853; }

/* ========== Footer Bottom ========== */
.footer-bottom {
  background: var(--primary-color);
  color: #e0e0e0;
  padding: 20px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.copyright p {
  margin: 4px 0;
  font-size: 13px;
  color: #bbb;
}

.copyright strong {
  color: var(--accent-color);
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-methods span {
  font-size: 13px;
  color: #bbb;
}

.payment-icons {
  display: flex;
  gap: 15px;
  font-size: 20px;
}

.payment-icons i {
  color: #ccc;
  transition: color 0.2s;
}

.payment-icons i:hover {
  color: white;
}

.back-to-top-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.08);
  color: white;
  border: 1px solid rgba(255,255,255,0.15);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.back-to-top-btn:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.2);
}

/* ========== Responsive Design ========== */
@media (max-width: 768px) {
  .footer-main {
    padding: 40px 0 30px;
  }

  .footer-container {
    gap: 30px;
  }

  .column-title {
    font-size: 15px;
  }

  .social-icons {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .social-icon {
    width: 42px;
    height: 42px;
    font-size: 16px;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .map-section {
    height: 350px;
  }

  .contact-column .logo-section {
    text-align: center;
  }

  .contact-column .logo {
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .footer-container {
    gap: 25px;
  }

  .contact-item {
    flex-direction: column;
    text-align: center;
    align-items: center;
    margin-bottom: 5px;
  }

  .contact-icon {
    margin-bottom: 8px;
  }

  .newsletter-form .form-group {
    flex-direction: column;
  }

  .newsletter-form button {
    padding: 12px;
  }

  .map-section {
    height: 300px;
  }

  .map-section::after {
    font-size: 11px;
    padding: 4px 8px;
  }
}

/* Leaflet map styles */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

:deep(.leaflet-popup-content) {
  margin: 12px 16px;
  font-family: 'Segoe UI', 'Inter', sans-serif;
}

:deep(.leaflet-popup-tip) {
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
</style>