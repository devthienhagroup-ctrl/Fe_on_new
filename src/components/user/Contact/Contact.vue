<template>
  <!-- Template giữ nguyên không thay đổi -->
  <div class="contact-page" :style="{ marginTop: config.styles.marginTop }">
    <!-- Header Section -->
    <header class="contact-header" :style="headerStyles">
      <div class="header-content">
        <h1 class="header-title" :style="{ fontSize: config.styles.headerTitle.fontSize, fontWeight: config.styles.headerTitle.fontWeight }">
          {{ config.content.header.title }}
        </h1>
        <p class="header-subtitle" :style="{ fontSize: config.styles.headerSubtitle.fontSize, fontWeight: config.styles.headerSubtitle.fontWeight }">
          {{ config.content.header.subtitle }}
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="contact-main" :style="{ maxWidth: config.styles.mainMaxWidth, padding: config.styles.mainPadding }">
      <div class="contact-container">
        <!-- Left Column -->
        <div class="contact-left">
          <div class="contact-info">
            <!-- Address Section -->
            <div class="address-section" :style="{ height: config.styles.addressSectionHeight }">
              <div class="address-card main-address-card" :style="addressCardStyles">
                <div v-for="location in config.departments.locations" :key="location.id"
                     class="address-item"
                     :class="{ active: activeLocation === location.id }"
                     @click="setActiveLocation(location.id)"
                     :style="addressItemStyles">
                  <i class="fas fa-map-marker-alt address-icon"
                     :class="{ 'active': activeLocation === location.id }"
                     :style="getAddressIconStyles(location.id)"></i>
                  <span>{{ location.address }}</span>
                </div>
              </div>

              <!-- Contact Details -->
              <div class="contact-details">
                <div v-for="contact in config.departments.contacts" :key="contact.id"
                     class="contact-card"
                     @click="copyToClipboard(contact.value)"
                     :style="contactCardStyles">
                  <i :class="contact.icon" class="contact-icon" :style="contactIconStyles"></i>
                  <span>{{ contact.value }}</span>
                </div>
              </div>
            </div>

            <!-- Map Container -->
            <div class="map-container" :style="mapContainerStyles">
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
<!--          <div class="support-form" :style="supportFormStyles">
            <h2 class="form-title" :style="{ fontSize: config.styles.formTitle.fontSize, color: config.colors.primary, fontWeight: config.styles.formTitle.fontWeight }">
              {{ config.content.form.title }}
            </h2>
            <form @submit.prevent="submitForm">
              <div class="form-group" v-for="field in config.content.form.fields" :key="field.name">
                <input
                    v-if="field.type !== 'textarea'"
                    :type="field.type"
                    v-model="formData[field.name]"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    class="form-input"
                    :style="formInputStyles"
                >
                <textarea
                    v-else
                    v-model="formData[field.name]"
                    :placeholder="field.placeholder"
                    :required="field.required"
                    class="form-textarea"
                    :style="formTextareaStyles"
                ></textarea>
              </div>
              <button type="submit" class="submit-btn" :style="submitBtnStyles">
                {{ config.content.form.submitText }}
              </button>
            </form>
          </div>

          <div class="rich-text-editor-wrapper" :style="thankYouMessageStyles">
            <div class="tiptap" v-html="config.content.thankYouMessage"></div>
          </div>-->
          <cooperation-form/>
        </div>
      </div>
    </main>

    <!-- Notification Toast -->
    <div v-if="showNotification" class="notification-toast" :style="notificationToastStyles">
      <span>{{ notificationMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted} from 'vue'
import api from "../../../api/api.js";
import CooperationForm from "../UI/CooperationForm.vue";

// Configuration object - CHỈNH FONT SIZE NHỎ HƠN Ở ĐÂY
let config = {
  content: {
    header: {
      title: 'Liên hệ với Thiên Hà Group',
      subtitle: 'Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn!'
    },
    form: {
      title: 'Chúng tôi luôn ở đây để hỗ trợ bạn!',
      fields: [
        {
          name: 'fullName',
          type: 'text',
          placeholder: 'Họ và tên',
          required: true
        },
        {
          name: 'phone',
          type: 'tel',
          placeholder: 'Số điện thoại',
          required: true
        },
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email (không bắt buộc)',
          required: false
        },
        {
          name: 'message',
          type: 'textarea',
          placeholder: 'Vấn đề của bạn',
          required: true
        }
      ],
      submitText: 'Gửi thông tin'
    },
    thankYouMessage: 'Cảm ơn bạn đã tin tưởng, kết nối cùng <b>Thiên Hà Group</b>!<br>Chúng tôi rất mong được lắng nghe và hỗ trợ bạn trong thời gian sớm nhất.'
  },
  departments: {
    locations: [
      {
        id: 'headquarters',
        address: 'Trụ sở: 14 đường 15, KĐT Vạn Phúc, Phường Hiệp Bình Phước, TP. Thủ Đức, TP. Hồ Chí Minh',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31348.906870926585!2d106.70607739528673!3d10.84087193956894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175295a6c0ebc8b%3A0xc51466fa5345ab8c!2zQ8O0bmcgVHkgQ-G7lSBQaOG6p24gxJDhuqd1IFTGsCBC4bqldCDEkOG7mW5nIFPhuqNuIFRoacOqbiBIw6AgR3JvdXA!5e0!3m2!1svi!2s!4v1763093883591!5m2!1svi!2s'
      },
      {
        id: 'branch',
        address: 'Chi nhánh: 01 Hoa Lài, Phường 7, Quận Phú Nhuận, TP. Hồ Chí Minh',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1747235012276!2d106.68906221148586!3d10.797926389307754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175290063ccdf0f%3A0x6171a166d6b789b7!2zQ2hpIE5ow6FuaCBUaGnDqm4gSMOgIEdyb3VwIFBow7ogTmh14bqtbiAtIEdp4bqjaSBQaMOhcCBCw6FuIEfhuqVwIELhuqV0IMSQ4buZbmcgU-G6o24!5e0!3m2!1svi!2s!4v1763094237511!5m2!1svi!2s'
      }
    ],
    contacts: [
      {
        id: 'email',
        icon: 'fas fa-envelope',
        value: 'thienhalandgroupvn@gmail.com'
      },
      {
        id: 'phone',
        icon: 'fas fa-phone',
        value: '0911 2318 82'
      }
    ]
  },
  colors: {
    primary: '#031358',
    secondary: '#0629BE',
    gradientStart: '#0629BE',
    gradientMiddle: '#031358',
    gradientEnd: '#0628B9',
    white: '#ffffff',
    grayLight: '#e0e0e0',
    grayLighter: '#f5f5f5'
  },
  styles: {
    marginTop: '60px',
    mainMaxWidth: '1400px',
    mainPadding: '40px 20px',
    headerTitle: {
      fontSize: '32px', // Giảm từ 40px xuống 32px
      fontWeight: '700'
    },
    headerSubtitle: {
      fontSize: '18px', // Giảm từ 20px xuống 18px
      fontWeight: '300'
    },
    formTitle: {
      fontSize: '32px', // Giảm từ 40px xuống 32px
      fontWeight: '700'
    },
    addressSectionHeight: '250px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    boxShadowHover: '0 6px 12px rgba(0, 0, 0, 0.15)',
    transitionDuration: '0.3s'
  }
}

const fetchData = async () => {
  const response = await api.get('/thg/public/cms/contentPage/contact');
  if(response.status ===200) {
    let dataJson = response.data.sections[0].contentJson;
    config = JSON.parse(dataJson);
    console.log("Đã lấy được data", config);
  }
}

onMounted(async ()=> {
  await fetchData();
})

// Computed styles - CHỈNH FONT SIZE Ở CÁC COMPUTED STYLES
const headerStyles = computed(() => ({
  height: '300px',
  background: `linear-gradient(135deg,
    ${config.colors.gradientStart} 7%,
    ${config.colors.gradientMiddle} 22%,
    ${config.colors.gradientStart} 56%,
    ${config.colors.gradientMiddle} 81%,
    ${config.colors.gradientEnd} 100%)`,
  borderBottomLeftRadius: '50% 40%',
  borderBottomRightRadius: '50% 40%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: config.colors.white
}))

const addressCardStyles = computed(() => ({
  flex: '5',
  background: config.colors.white,
  border: 'none',
  borderRadius: config.styles.borderRadius,
  boxShadow: config.styles.boxShadow,
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}))

const addressItemStyles = computed(() => ({
  fontSize: '18px', // Giảm từ 20px xuống 18px
  cursor: 'pointer',
  padding: '10px',
  borderRadius: '5px',
  transition: `all ${config.styles.transitionDuration} ease`,
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  position: 'relative',
  minHeight: '60px'
}))

const contactCardStyles = computed(() => ({
  background: config.colors.white,
  border: 'none',
  borderRadius: config.styles.borderRadius,
  boxShadow: config.styles.boxShadow,
  padding: '20px',
  fontSize: '18px', // Giảm từ 20px xuống 18px
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  cursor: 'pointer',
  transition: `all ${config.styles.transitionDuration} ease`,
  flex: '1'
}))

const contactIconStyles = computed(() => ({
  color: config.colors.primary,
  fontSize: '22px', // Giảm từ 24px xuống 22px
  flexShrink: '0'
}))

const mapContainerStyles = computed(() => ({
  flex: '1',
  background: config.colors.white,
  border: 'none',
  borderRadius: config.styles.borderRadius,
  boxShadow: config.styles.boxShadow,
  overflow: 'hidden'
}))

const supportFormStyles = computed(() => ({
  background: config.colors.white,
  border: 'none',
  borderRadius: config.styles.borderRadius,
  boxShadow: config.styles.boxShadow,
  padding: '30px'
}))

const formInputStyles = computed(() => ({
  width: '100%',
  fontSize: '18px', // Giảm từ 20px xuống 18px
  padding: '10px 0',
  border: 'none',
  borderBottom: `2px solid ${config.colors.grayLight}`,
  background: 'transparent',
  color: config.colors.primary,
  transition: `border-color ${config.styles.transitionDuration} ease`
}))

const formTextareaStyles = computed(() => ({
  width: '100%',
  fontSize: '18px', // Giảm từ 20px xuống 18px
  padding: '10px 0',
  border: 'none',
  borderBottom: `2px solid ${config.colors.grayLight}`,
  background: 'transparent',
  color: config.colors.primary,
  transition: `border-color ${config.styles.transitionDuration} ease`,
  minHeight: '120px',
  resize: 'vertical'
}))

const submitBtnStyles = computed(() => ({
  width: '100%',
  background: `linear-gradient(to right, ${config.colors.primary}, #0030FF)`,
  color: config.colors.white,
  border: 'none',
  borderRadius: '5px',
  padding: '15px',
  fontSize: '18px', // Giảm từ 20px xuống 18px
  fontWeight: '700',
  cursor: 'pointer',
  transition: `all ${config.styles.transitionDuration} ease`
}))

const thankYouMessageStyles = computed(() => ({
  background: config.colors.white,
  border: 'none',
  borderRadius: config.styles.borderRadius,
  boxShadow: config.styles.boxShadow,
  padding: '20px',
  fontSize: '18px', // Giảm từ 20px xuống 18px
  lineHeight: '1.6'
}))

const notificationToastStyles = computed(() => ({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  background: config.colors.primary,
  color: config.colors.white,
  padding: '15px 25px',
  borderRadius: '5px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  zIndex: '1000'
}))

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

// Computed property for active map URL
const activeMapUrl = ref(config.departments.locations[0].mapUrl)

// Get address icon styles
const getAddressIconStyles = (locationId) => ({
  color: activeLocation.value === locationId ? config.colors.secondary : config.colors.grayLight,
  fontSize: '18px', // Giảm từ 20px xuống 18px
  width: '18px',
  height: '18px',
  marginTop: '3px',
  transition: `all ${config.styles.transitionDuration} ease`,
  flexShrink: '0'
})

// Set active location
const setActiveLocation = (location) => {
  activeLocation.value = location
  const locationData = config.departments.locations.find(loc => loc.id === location)
  activeMapUrl.value = locationData.mapUrl
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
  color: v-bind('config.colors.primary');
}

/* Header Styles */
.contact-header {
  height: v-bind('config.styles.headerHeight || "300px"');
  background: v-bind('headerStyles.background');
  border-bottom-left-radius: v-bind('headerStyles.borderBottomLeftRadius');
  border-bottom-right-radius: v-bind('headerStyles.borderBottomRightRadius');
  display: v-bind('headerStyles.display');
  align-items: v-bind('headerStyles.alignItems');
  justify-content: v-bind('headerStyles.justifyContent');
  text-align: v-bind('headerStyles.textAlign');
  color: v-bind('headerStyles.color');
}

.header-content {
  max-width: 800px;
  padding: 0 20px;
}

/* Main Content Styles */
.contact-main {
  max-width: v-bind('config.styles.mainMaxWidth');
  margin: 0 auto;
  padding: v-bind('config.styles.mainPadding');
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
  height: v-bind('config.styles.addressSectionHeight');
}

.address-item:hover {
  background-color: v-bind('config.colors.grayLighter');
}

.address-item.active {
  color: v-bind('config.colors.secondary');
  font-weight: 500;
}

.contact-details {
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow: v-bind('config.styles.boxShadowHover');
}

.map-container iframe {
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

.form-group {
  margin-bottom: 25px;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-bottom-color: v-bind('config.colors.primary');
}

.form-input:hover, .form-textarea:hover {
  border-bottom-color: v-bind('config.colors.primary');
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: v-bind('config.styles.boxShadowHover');
}

/* Notification Toast */
.notification-toast {
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; transform: translateY(20px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
}

/* Responsive Design - CẬP NHẬT FONT SIZE RESPONSIVE */
@media (max-width: 1200px) {
  .contact-container {
    flex-direction: column;
  }

  .address-section {
    flex-direction: column;
    height: auto;
  }

  .map-container {
    height: 400px;
    flex: none;
  }
}

@media (max-width: 768px) {
  .header-title {
    font-size: 24px; /* Giảm từ 28px xuống 24px */
  }

  .header-subtitle {
    font-size: 16px; /* Giảm từ 18px xuống 16px */
  }

  .form-title {
    font-size: 24px; /* Giảm từ 28px xuống 24px */
  }

  .contact-card, .address-item {
    font-size: 16px; /* Giảm từ 18px xuống 16px */
  }

  .form-input, .form-textarea {
    font-size: 16px; /* Giảm từ 18px xuống 16px */
  }

  .submit-btn {
    font-size: 16px; /* Giảm từ 18px xuống 16px */
  }

  .thank-you-message {
    font-size: 16px; /* Giảm từ 18px xuống 16px */
  }

  .address-section {
    height: auto;
  }
}
</style>