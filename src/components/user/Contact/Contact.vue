<template>
  <div class="contact-page">
    <!-- Header Section -->
    <header class="contact-header">
      <div class="header-content">
        <h1 class="header-title">Liên hệ với Thiên Hà Group</h1>
        <p class="header-subtitle">Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn!</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="contact-main">
      <div class="contact-container">
        <!-- Left Column -->
        <div class="contact-left">
          <div class="contact-info">
            <!-- Address Section -->
            <div class="address-section">
              <div class="address-card main-address-card">
                <div class="address-item"
                     :class="{ active: activeLocation === 'headquarters' }"
                     @click="setActiveLocation('headquarters')">
                  <i class="fas fa-map-marker-alt address-icon"
                     :class="{ 'active': activeLocation === 'headquarters' }"></i>
                  <span>Trụ sở: 14 đường 15, KĐT Vạn Phúc, Phường Hiệp Bình Phước, TP. Thủ Đức, TP. Hồ Chí Minh</span>
                </div>
                <div class="address-item"
                     :class="{ active: activeLocation === 'branch' }"
                     @click="setActiveLocation('branch')">
                  <i class="fas fa-map-marker-alt address-icon"
                     :class="{ 'active': activeLocation === 'branch' }"></i>
                  <span>Chi nhánh: 01 Hoa Lài, Phường 7, Quận Phú Nhuận, TP. Hồ Chí Minh</span>
                </div>
              </div>

              <!-- Contact Details -->
              <div class="contact-details">
                <div class="contact-card" @click="copyToClipboard('thienhagroup@gmail.com')">
                  <i class="fas fa-envelope contact-icon"></i>
                  <span>thienhagroup@gmail.com</span>
                </div>
                <div class="contact-card" @click="copyToClipboard('0911 2318 82')">
                  <i class="fas fa-phone contact-icon"></i>
                  <span>0911 2318 82</span>
                </div>
              </div>
            </div>

            <!-- Map Container -->
            <div class="map-container">
              <iframe
                  :src="activeMapUrl"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="contact-right">
          <div class="support-form">
            <h2 class="form-title">Chúng tôi luôn ở đây để hỗ trợ bạn!</h2>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <input
                    type="text"
                    v-model="formData.fullName"
                    placeholder="Họ và tên"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <input
                    type="tel"
                    v-model="formData.phone"
                    placeholder="Số điện thoại"
                    required
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <input
                    type="email"
                    v-model="formData.email"
                    placeholder="Email (không bắt buộc)"
                    class="form-input"
                >
              </div>
              <div class="form-group">
                <textarea
                    v-model="formData.message"
                    placeholder="Vấn đề của bạn"
                    required
                    class="form-textarea"
                ></textarea>
              </div>
              <button type="submit" class="submit-btn">Gửi thông tin</button>
            </form>
          </div>

          <div class="thank-you-message">
            <p>Cảm ơn bạn đã tin tưởng, kết nối cùng <b>Thiên Hà Group</b>!</p>
            <p>Chúng tôi rất mong được lắng nghe và hỗ trợ bạn trong thời gian sớm nhất.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Notification Toast -->
    <div v-if="showNotification" class="notification-toast">
      <span>{{ notificationMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { removeJsonLd, setJsonLd } from "../../../utils/structuredData.js";

const contactJsonLdId = "jsonld-contact-itemlist";

onMounted(() => {
  setJsonLd(contactJsonLdId, {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: "http://localhost:8084/lien-he"
      }
    ]
  });
});

onBeforeUnmount(() => removeJsonLd(contactJsonLdId));

// Active location state
const activeLocation = ref('headquarters')

// Form data
const formData = reactive({
  fullName: '',
  phone: '',
  email: '',
  message: ''
})

// Notification state
const showNotification = ref(false)
const notificationMessage = ref('')
// Map URLs
const mapUrls = {
  headquarters: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31348.906870926585!2d106.70607739528673!3d10.84087193956894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175295a6c0ebc8b%3A0xc51466fa5345ab8c!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gxJDhuqd1IFTGsCBC4bqldCDEkOG7mW5nIFPhuqNuIFRoacOqbiBIw6AgR3JvdXA!5e0!3m2!1svi!2s!4v1763093883591!5m2!1svi!2s',
  branch: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1747235012276!2d106.68906221148586!3d10.797926389307754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175290063ccdf0f%3A0x6171a166d6b789b7!2zQ2hpIE5ow6FuaCBUaGnDqm4gSMOgIEdyb3VwIFBow7ogTmh14bqtbiAtIEdp4bqjaSBQaMOhcCBCw6FuIEfhuqVwIELhuqV0IMSQ4buZbmcgU-G6o24!5e0!3m2!1svi!2s!4v1763094237511!5m2!1svi!2s'
}

// Computed property for active map URL
const activeMapUrl = ref(mapUrls.headquarters)

// Set active location
const setActiveLocation = (location) => {
  activeLocation.value = location
  activeMapUrl.value = mapUrls[location]
}

// Copy to clipboard function
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    notificationMessage.value = `Đã sao chép: ${text}`
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 3000)
  })
}

// Form submission
const submitForm = () => {
  // Here you would typically send the form data to a server
  console.log('Form submitted:', formData)

  // Reset form
  Object.keys(formData).forEach(key => {
    formData[key] = ''
  })

  // Show success message
  notificationMessage.value = 'Cảm ơn bạn! Thông tin đã được gửi thành công.'
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}
</script>

<style scoped>
/* Font import and base styles */
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.contact-page {
  font-family: 'Ubuntu', sans-serif;
  color: #031358;
  margin-top: 60px;
}

/* Header Styles */
.contact-header {
  height: 300px;
  background: linear-gradient(135deg,
  #0629BE 7%,
  #031358 22%,
  #0629BE 56%,
  #031358 81%,
  #0628B9 100%);
  border-bottom-left-radius: 50% 40%;
  border-bottom-right-radius: 50% 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.header-content {
  max-width: 800px;
  padding: 0 20px;
}

.header-title {
  font-size: 40px;
  margin-bottom: 15px;
  font-weight: 700;
}

.header-subtitle {
  font-size: 20px;
  font-weight: 300;
}

/* Main Content Styles */
.contact-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.contact-container {
  display: flex;
  gap: 30px;
  align-items: stretch;
}

/* Left Column Styles */
.contact-left {
  flex: 7;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 100%;
}

.address-section {
  display: flex;
  gap: 20px;
  height: 250px; /* Updated height */
}

.main-address-card {
  flex: 5;
  background: white;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.address-item {
  font-size: 20px;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  min-height: 60px; /* Ensure consistent height */
}

.address-item:hover {
  background-color: #f5f5f5;
}

.address-item.active {
  color: #0629BE;
  font-weight: 500;
}

.address-icon {
  color: #e0e0e0; /* Default gray color for inactive state */
  font-size: 20px;
  width: 20px;
  height: 20px;
  margin-top: 3px;
  transition: all 0.3s ease;
  flex-shrink: 0; /* Prevent icon from shrinking */
}

.address-icon.active {
  color: #0629BE; /* Blue color for active state */
}

.contact-details {
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-card {
  background: white;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.contact-icon {
  color: #031358;
  font-size: 24px;
  flex-shrink: 0;
}

.map-container {
  flex: 1;
  background: white;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.map-container iframe{
  width: 100%;
  height: 100%;
}

/* Right Column Styles */
.contact-right {
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.support-form {
  background: white;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.form-title {
  font-size: 40px;
  margin-bottom: 30px;
  color: #031358;
  font-weight: 700;
}

.form-group {
  margin-bottom: 25px;
}

.form-input, .form-textarea {
  width: 100%;
  font-size: 20px;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  background: transparent;
  color: #031358;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-bottom-color: #031358;
}

.form-input:hover, .form-textarea:hover {
  border-bottom-color: #031358;
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(to right, #031358, #0030FF);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.thank-you-message {
  background: white;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  font-size: 20px;
  line-height: 1.6;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #031358;
  color: white;
  padding: 15px 25px;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; transform: translateY(20px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .contact-container {
    flex-direction: column;
  }

  .address-section {
    flex-direction: column;
    height: auto;
  }

  .header-title {
    font-size: 32px;
  }

  .form-title {
    font-size: 32px;
  }

  .map-container {
    height: 400px;
    flex: none  ;
  }
}

@media (max-width: 768px) {
  .header-title {
    font-size: 28px;
  }

  .header-subtitle {
    font-size: 18px;
  }

  .form-title {
    font-size: 28px;
  }

  .contact-card, .address-item {
    font-size: 18px;
  }

  .form-input, .form-textarea {
    font-size: 18px;
  }

  .submit-btn {
    font-size: 18px;
  }

  .thank-you-message {
    font-size: 18px;
  }

  .address-section {
    height: auto;
  }
}
</style>