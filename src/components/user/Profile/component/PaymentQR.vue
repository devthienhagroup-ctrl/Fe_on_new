<template>
  <div class="checkout-wrapper" style="margin-top: 30px !important;">

    <!-- EFFECTS + SHIP -->
    <div class="wave-container">
      <div class="wave"></div>
      <div class="ship">
        <div class="ship-body"></div>
        <div class="ship-cabin"></div>
        <div class="ship-window"></div>
        <div class="ship-mast"></div>
        <div class="ship-sail"></div>
        <div class="ship-flag"></div>
        <img src="/imgs/logo.png" class="ship-logo" />
      </div>
    </div>

    <div class="floating-particles">
      <div
          class="particle"
          v-for="i in 50"
          :key="i"
          :style="particleStyle(i)"
      ></div>
    </div>

    <!-- CARD -->
    <div class="checkout-card">
      <button class="btn-back-top" @click="router.back()">
        <i class="fa-solid fa-arrow-left"></i>
        Quay lại
      </button>
      <!-- LEFT SIDE -->
      <div class="left-section">
        <div class="bank-logos">
          <img src="/imgs/Logo_MB_new.png" class="bank-logo" />
          <img src="/imgs/logo-napas.png" class="bank-logo" />
          <img src="/imgs/MasterCard_Logo.svg.png" class="bank-logo" />
          <img src="/imgs/Visa_Inc._logo.svg.png" class="bank-logo" />
        </div>

        <div class="section-title">
          <h2>Thông tin thanh toán</h2>
        </div>

        <div class="info-list">

          <div class="info-row">
            <span class="info-label">Số tiền</span>
            <strong class="price text-muted">
              Người dùng tự nhập khi chuyển khoản
            </strong>
          </div>


          <div class="info-row">
            <span class="info-label">Ngân hàng nhận</span>
            <strong>{{ bank }}</strong>
          </div>

          <div class="info-row">
            <span class="info-label">Số tài khoản</span>
            <strong>{{ accountNumber }}</strong>
          </div>

          <div class="info-row">
            <span class="info-label">Chủ tài khoản</span>
            <strong>{{ accountName }}</strong>
          </div>
        </div>

        <!-- HƯỚNG DẪN -->
        <div class="manual-guide">
          <h4 class="guide-title">
            <i class="fas fa-info-circle"></i> Nếu không quét được QR
          </h4>

          <ul>
            <li>Chuyển khoản thủ công qua app.</li>
            <li>Số tài khoản: <strong>{{ accountNumber }}</strong></li>
            <li>Ngân hàng: <strong>{{ bank }}</strong></li>
            <li>Nội dung CK: <strong>{{ transactionCode }}</strong></li>

            <li class="warning">
              <i class="fas fa-exclamation-triangle"></i>
              <b>Lưu ý:</b> Sai nội dung → không xác nhận được giao dịch.
            </li>
          </ul>
        </div>
      </div>

      <!-- RIGHT SIDE QR -->
      <div class="right-section">
        <h3 class="qr-title">Quét mã QR để nạp tiền vào ví</h3>

        <div class="qr-container">
          <div class="qr-box">
            <img :src="qrUrl" class="qr-img" />
            <div class="scan-line"></div>
            <div class="qr-shine"></div>
          </div>
        </div>
        <div class="sepay-container">
          <img src="/imgs/logo-sepay-color-in-white.png" class="sepay-logo" />
        </div>
      </div>
    </div>
    <AppointmentModal
        v-if="showModal"
        :landAssetId="currentLandAssetId"
        :valuationId="currentValuationId"
        :asset-address="currentAddress"
        :purpose="currenPurpose"
        :show="showModal"
        @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "/src/api/api.js";
import { socketService } from "/src/services/socketService.js";
import { SOCKET_CONFIG } from "/src/config/socketConfig.js";
import { useAuthStore } from "/src/stores/authStore.js";
import { useRouter } from "vue-router";
function particleStyle(i) {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const top = Math.random() * 100
  const animationDuration = Math.random() * 12 + 8
  const animationDelay = Math.random() * 2

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`,
  }
}

const router = useRouter();
const authStore = useAuthStore();

// =======================
// 🔥 STATE
// =======================
const amount = ref(null); // nạp ví: user tự nhập
const accountName = ref("");
const accountNumber = ref("");
const bank = ref("");
const bankCode = ref("");
const transactionCode = ref("");

const qrUrl = ref("");
const loading = ref(true);

// =======================
// 🔥 GỌI API NẠP VÍ
// =======================
async function loadPaymentInfo() {
  try {
    const res = await api.get("/profile/wallet/payment-info");
    const data = res.data;

    accountName.value = data.accountName;
    accountNumber.value = data.accountNumber;
    bank.value = data.bankName;
    bankCode.value = data.bankCode;
    transactionCode.value = data.transferContent;

    // ❗ QR KHÔNG TRUYỀN AMOUNT (user tự nhập)
    qrUrl.value =
        `https://qr.sepay.vn/img?acc=${accountNumber.value}` +
        `&bank=${bankCode.value}` +
        `&des=${transactionCode.value}`;

  } catch (e) {
    console.error("Lỗi tải PaymentInfoDTO (nạp ví)", e);
  } finally {
    loading.value = false;
  }
}

// =======================
// 🔥 SOCKET
// =======================
const status = ref("processing"); // processing | success | failed

onMounted(async () => {
  await loadPaymentInfo();

  const token = () => authStore.accessToken;
  socketService.connect(token);

  const employeeId = authStore.userInfo?.id;

  socketService.subscribe(
      SOCKET_CONFIG.walletTopic(employeeId), // 👉 topic ví
      (event) => {
        console.log("📥 [WALLET EVENT]", event);

        if (!event || event.domain !== "WALLET") return;

        if (event.type === "TOPUP_SUCCESS") {
          status.value = "success";
          setTimeout(() => {
            router.push("/vi-ca-nhan"); // hoặc trang profile
          }, 2000);
        }

        if (event.type === "TOPUP_FAILED") {
          status.value = "failed";
        }
      }
  );
});

// =======================
// 🔥 FORMAT
// =======================
const formattedAmount = computed(() => {
  if (!amount.value) return "—";
  return amount.value.toLocaleString("vi-VN");
});

// =======================
// 🔥 TRẠNG THÁI
// =======================
const statusText = computed(() => {
  switch (status.value) {
    case "processing":
      return "Đang chờ nạp tiền...";
    case "success":
      return "Nạp tiền thành công ✔";
    case "failed":
      return "Nạp tiền thất bại ✖";
  }
});
</script>


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");

:root {
  --primary: #3f2bd8;
  --primary-dark: #271aa8;
  --secondary: #8a36ff;
  --accent: #0ea5e9;
  --gold: #d1a322;
  --gold-strong: #b88406;
  --bg: linear-gradient(150deg, #e4e9ff 0%, #e5e6ff 40%, #f1e4ff 100%);
  --card-bg: rgba(255, 255, 255, 0.9);
  --text: #1f274d;
  --text-light: #6b7393;
  --border: #dfe4ff;
  --success: #0fa678;
  --warning: #f39c12;
  --gradient-primary: linear-gradient(135deg, #3f2bd8 0%, #8a36ff 100%);
  --gradient-secondary: linear-gradient(135deg, #0ea5e9 0%, #3f2bd8 100%);
  --gradient-gold: linear-gradient(135deg, #f6d66b 0%, #d7a824 45%, #b88406 100%);
}

.checkout-wrapper {
  min-height: 100vh;
  background: var(--bg);
  padding: 18px 12px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Inter", sans-serif;
  position: relative;
  overflow: hidden;
}

.checkout-card {
  background: var(--card-bg);
  width: 100%;
  max-width: 1024px;
  border-radius: 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 22px;
  padding: 26px;
  box-shadow: 0 18px 40px rgba(85, 96, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 10;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.floating-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  background: rgba(122, 92, 255, 0.16);
  border-radius: 50%;
  animation: floatParticle linear infinite;
}

@keyframes floatParticle {
  0% {
    transform: translateY(90vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.55;
  }
  90% {
    opacity: 0.55;
  }
  100% {
    transform: translateY(-120px) rotate(360deg);
    opacity: 0;
  }
}

.wave {
  position: absolute;
  left: 0;
  width: 300%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg%20viewBox%3D%270%200%201200%20120%27%20xmlns%3D%27http://www.w3.org/2000/svg%27%3E%3Cpath%20d%3D%27M0%200%20C%20300%2090,%20900%20-90,%201200%200%20V120%20H0%20Z%27%20fill%3D%27%233f2bd8%27%20opacity%3D%270.28%27/%3E%3C/svg%3E");
  background-size: 1200px 100%;
  background-repeat: repeat-x;
  animation: waveMove 8s linear infinite;
}

.wave::after {
  content: "";
  position: absolute;
  inset: 0;
  background: inherit;
  background-size: 1200px 100%;
  background-repeat: repeat-x;
  opacity: 0.6;
  animation: waveMove 12s linear infinite;
  animation-delay: -3s;
}

@keyframes waveMove {
  from { transform: translateX(0); }
  to { transform: translateX(-1200px); }
}


/* CẢI THIỆN CON TÀU - ĐÈ LÊN TẤT CẢ VÀ LÀM ĐẸP ĐÁY TÀU */
.ship {
  position: absolute;
  bottom: 28px;
  left: -90px;
  animation: ship-sail 22s linear infinite;
  z-index: 20; /* Tăng z-index để đè lên tất cả */
}

.ship-body {
  width: 86px;
  height: 18px;
  background: linear-gradient(90deg, #25168d, #3f2bd8);
  border-radius: 4px 4px 0 0;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.22);
}

/* CẢI THIỆN ĐÁY TÀU - THÊM HIỆU ỨNG SÓNG VỖ */
.ship-body:before {
  content: "";
  position: absolute;
  top: -14px;
  left: 14px;
  border-left: 26px solid transparent;
  border-right: 26px solid transparent;
  border-bottom: 14px solid #24146f;
}

.ship-body:after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg,
  rgba(37, 22, 141, 0.8) 0%,
  rgba(63, 43, 216, 0.9) 30%,
  rgba(138, 54, 255, 0.8) 70%,
  rgba(37, 22, 141, 0.8) 100%);
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.ship-cabin {
  position: absolute;
  right: 10px;
  top: -10px;
  width: 22px;
  height: 12px;
  background: #1d1847;
  border-radius: 6px 6px 2px 2px;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.08);
}

.ship-window {
  position: absolute;
  right: 16px;
  top: -6px;
  width: 6px;
  height: 6px;
  background: #f5d46b;
  border-radius: 50%;
  box-shadow: 10px 0 0 #f5d46b;
}

.ship-mast {
  position: absolute;
  left: 32px;
  top: -52px;
  width: 4px;
  height: 60px;
  background: linear-gradient(180deg, #f8d878, #d1a322);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
}

.ship-sail {
  position: absolute;
  top: -50px;
  left: 36px;
  width: 32px;
  height: 40px;
  background: linear-gradient(135deg, #8a36ff, #3f2bd8);
  clip-path: polygon(0 0, 100% 0, 45% 100%);
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.18);
}

.ship-flag {
  position: absolute;
  top: -60px;
  left: 35px;
  width: 16px;
  height: 10px;
  background: linear-gradient(90deg, #f6d66b, #d1a322);
  clip-path: polygon(0 0, 100% 50%, 0 100%);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.18);
}

@keyframes ship-sail {
  0% { left: -90px; }
  100% { left: calc(100% + 90px); }
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.bank-logos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 10px;
}

.bank-logo {
  width: 100%;
  height: 36px;
  object-fit: contain;
  filter: grayscale(10%) brightness(0.96);
  transition: all 0.25s ease;
  border-radius: 8px;
  padding: 6px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.bank-logo:hover {
  filter: grayscale(0%) brightness(1);
  transform: translateY(-2px);
}

.section-title h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
}

.section-title p {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--text-light);
}

.info-list {
  border-radius: 14px;
  padding: 14px 16px;
  background: rgba(245, 247, 255, 0.82);
  border: 1px solid rgba(223, 228, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  font-size: 14px;
  border-bottom: 1px dashed var(--border);
  color: var(--text);
  gap: 10px;
}

.info-row:last-child { border-bottom: none; }

.info-label {
  color: var(--text-light);
  font-weight: 600;
  font-size: 13px;
}

.highlight {
  color: var(--gold-strong);
  font-weight: 700;
  background: var(--gradient-gold);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.price {
  font-size: 16px;
  color: var(--gold-strong);
  font-weight: 700;
}

.time-limit {
  color: var(--warning);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.manual-guide {
  background: linear-gradient(135deg, #f7f8ff 0%, #f0f3ff 100%);
  padding: 14px 16px;
  border-radius: 12px;
  border-left: 4px solid var(--secondary);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}

.guide-title {
  font-size: 14px;
  margin: 0 0 10px;
  font-weight: 700;
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.manual-guide ul {
  margin: 0;
  padding-left: 16px;
  display: grid;
  gap: 8px;
}

.manual-guide li {
  color: var(--text-light);
  font-size: 13px;
  line-height: 1.45;
}

.manual-guide li.warning {
  color: #e34d4d;
  font-weight: 600;
}

.security-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--success);
  font-weight: 600;
  padding: 8px 10px;
  background: rgba(15, 166, 120, 0.08);
  border-radius: 8px;
}

.right-section {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  justify-content: center;
}

.qr-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
}

.qr-container { position: relative; }

.qr-box {
  width: 250px;
  height: 250px;
  background: white;
  padding: 14px;
  margin-top: 30px;
  border-radius: 16px;
  position: relative;
  box-shadow: 0 10px 24px rgba(85, 96, 255, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  overflow: hidden;
}

.qr-img { width: 100%; height: 100%; border-radius: 10px; }

.scan-line {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 12px;
  background: linear-gradient(
      to bottom,
      transparent,
      rgba(14, 165, 233, 0.45),
      transparent
  );
  animation: scanMove 2.6s infinite linear;
  border-radius: 4px;
  pointer-events: none;
}

@keyframes scanMove {
  0% {
    transform: translateY(-12px);
  }
  100% {
    transform: translateY(220px); /* bằng chiều cao qr-img */
  }
}

.qr-overlay { position: absolute; inset: 0; pointer-events: none; }

.qr-corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid var(--secondary);
}

.qr-corner-tl { top: 0; left: 0; border-right: none; border-bottom: none; border-radius: 6px 0 0 0; }
.qr-corner-tr { top: 0; right: 0; border-left: none; border-bottom: none; border-radius: 0 6px 0 0; }
.qr-corner-bl { bottom: 0; left: 0; border-right: none; border-top: none; border-radius: 0 0 0 6px; }
.qr-corner-br { bottom: 0; right: 0; border-left: none; border-top: none; border-radius: 0 0 6px 0; }

.qr-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: skewX(-20deg);
  animation: qrShine 3.2s infinite;
}

@keyframes qrShine {
  0% { left: -100%; }
  100% { left: 200%; }
}

.code-box {
  margin-top: 4px;
  background: linear-gradient(135deg, #eaf0ff 0%, #e6e1ff 100%);
  color: var(--accent);
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.28s ease;
  border: 1px solid rgba(85, 96, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.code-box:hover {
  background: linear-gradient(135deg, #e0e7ff 0%, #d9d1ff 100%);
  transform: translateY(-2px);
}

.tap-copy {
  margin: 0;
  font-size: 11px;
  color: var(--text-light);
  font-weight: 500;
}

.payment-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: 100%;
  gap: 10px;
  margin-top: 6px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  position: relative;
  box-shadow: 0 3px 10px rgba(85, 96, 255, 0.3);
}

.step-pulse {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--gradient-primary);
  animation: stepPulse 2s infinite;
  z-index: -1;
}

@keyframes stepPulse {
  0% { transform: scale(1); opacity: 0.6; }
  70% { transform: scale(1.3); opacity: 0; }
  100% { transform: scale(1.3); opacity: 0; }
}

.step:nth-child(2) .step-number, .step:nth-child(2) .step-pulse { background: var(--gradient-secondary); }
.step:nth-child(3) .step-number, .step:nth-child(3) .step-pulse { background: linear-gradient(135deg, #6a4dfd 0%, #8c7aff 100%); }

.step p {
  font-size: 11px;
  color: var(--text);
  text-align: center;
  line-height: 1.3;
  font-weight: 600;
  margin: 0;
}

.sepay-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.sepay-logo { width: 108px; opacity: 0.95; }

.verified-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--success);
  font-weight: 600;
  padding: 6px 10px;
  background: rgba(15, 166, 120, 0.12);
  border-radius: 14px;
}

.copy-notification {
  position: fixed;
  top: 22px;
  right: 22px;
  background: var(--success);
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  transform: translateX(140%);
  transition: transform 0.3s ease;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.copy-notification.show { transform: translateX(0); }

@media (max-width: 900px) {
  .checkout-card { padding: 22px; }
  .right-section { order: -1; }
  .qr-box { width: 190px; height: 190px; }
}

@media (max-width: 520px) {
  .checkout-card { padding: 18px; }
  .info-row { flex-direction: column; align-items: flex-start; }
  .bank-logos { grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); }
}
.btn-premium {
  background: linear-gradient(135deg, #9b5bff 0%, #7a32ff 40%, #3f2bd8 100%);
  color: #fff;
  padding: 10px 20px;
  border-radius: 14px;
  font-size: 15px;
  margin-top: 10px;
  width: 100%;
  font-weight: 800;
  border: none;
  text-align: center !important;
  cursor: pointer;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 18px rgba(63, 43, 216, 0.35);
  letter-spacing: 0.5px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

/* ánh sáng lướt */
.btn-premium::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.45),
      transparent
  );
  transform: skewX(-20deg);
  animation: shine 3s infinite;
}

.btn-premium:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 22px rgba(63, 43, 216, 0.45);
}

.btn-premium i {
  font-size: 16px;
}


/* ánh sáng lướt */
.btn-premium::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
  transform: skewX(-20deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -120%; }
  100% { left: 140%; }
}


.payment-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(0,0,0,0.08);
  width: fit-content;
  margin-top: 10px;
}

.status-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* trạng thái xoay */
.spinner {
  border: 3px solid rgba(0,0,0,0.15);
  border-top-color: var(--accent);
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* đã thanh toán */
.success {
  background: #0fa678;
  color: white;
  font-size: 12px;
}

/* thất bại */
.failed {
  background: #e34d4d;
  color: white;
  font-size: 12px;
}

.status-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}
.ship-logo {
  position: absolute;
  bottom: 4px;
  left: 6px;
  width: 28px;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.25);
  background: rgba(255,255,255,0.9);
  padding: 2px;
}
.btn-premium-blue {
  background: linear-gradient(135deg, #6a5cff 0%, #5145e6 40%, #3a8dff 100%); /* tím → indigo → xanh */
  color: #fff;
  padding: 10px 20px;
  border-radius: 14px;
  font-size: 15px;
  margin-top: 10px;
  width: 100%;
  font-weight: 800;
  border: none;
  text-align: center !important;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-shadow: 0 6px 20px rgba(81, 69, 230, 0.35);
  letter-spacing: 0.5px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

/* ✨ hiệu ứng ánh sáng */
.btn-premium-blue::after {
  content: "";
  position: absolute;
  top: 0;
  left: -130%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.55),
      transparent
  );
  transform: skewX(-20deg);
  animation: shinePremiumBlue 2.8s infinite ease-in-out;
}

@keyframes shinePremiumBlue {
  0%   { left: -130%; }
  60%  { left: 120%; }
  100% { left: 160%; }
}

.btn-premium,
.btn-premium-blue {
  transition: all 0.25s ease !important;
}

.btn-premium:hover,
.btn-premium-blue:hover {
  transform: translateY(-3px) scale(1.04) !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25) !important; /* bóng đều */
}
.btn-premium::after,
.btn-premium-blue::after {
  animation-duration: 2.2s !important;
}

/* icon máy bay */
.btn-premium-blue i {
  color: rgba(255,255,255,0.98);
  font-size: 16px;
}
.premium-button-row {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

@media (max-width: 576px) {
  .premium-button-row {
    flex-direction: column;
  }
}
/* NÚT TRỞ VỀ ĐẸP – FLOAT TRÊN ĐẦU CARD */
.btn-back-top {
  position: absolute;
  top: -50px;
  left: 0;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.7);   /* glass */
  backdrop-filter: blur(6px);
  color: #3f2bd8;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
}

.btn-back-top:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(63, 43, 216, 0.25);
}

.btn-back-top i {
  font-size: 14px;
}



</style>