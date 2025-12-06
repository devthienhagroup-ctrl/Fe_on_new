<template>
  <div
      class="membership-card"
      :class="cardClass"
  >
    <!-- Free Card -->
    <div v-if="subscriptionPlan === 'Free'" class="free-card">
      <div class="card-content">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img
                :src="'https://s3.cloudfly.vn/thg-storage/uploads-public/' + memberData.avatar"
                :alt="memberData.fullName"
                class="avatar"
            />
            <div class="camera-icon">
              <i class="fa-solid fa-star"></i>
            </div>
          </div>
        </div>
        <div class="info-section">
          <h3 class="member-name">{{ memberData.fullName }}</h3>
          <p class="member-role">Vai trò: {{ memberData.role }}</p>
          <p class="subscription-plan">Free Plan</p>
        </div>
      </div>
    </div>

    <!-- VIP Card -->
    <div v-else-if="subscriptionPlan === 'VIP'" class="vip-card">
      <img src="/imgs/circle-member-card.svg" alt="" class="circle c1">
      <img src="/imgs/circle-member-card.svg" alt="" class="circle c2">
      <img src="/imgs/circle-member-card.svg" alt="" class="circle c3">
      <img src="/imgs/circle-member-card.svg" alt="" class="circle c4">
      <div class="card-content">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img
                :src="'https://s3.cloudfly.vn/thg-storage/uploads-public/' + memberData.avatar"
                :alt="memberData.fullName"
                class="avatar"
            />
            <div class="camera-icon">
              <i class="fa-solid fa-star fa-beat"></i>
            </div>
          </div>
        </div>
        <div class="info-section">
          <h3 class="member-name">{{ memberData.fullName }}</h3>
          <p class="member-role">Vai trò: {{ memberData.role }}</p>
          <p class="subscription-plan">VIP Plan</p>
        </div>
      </div>
    </div>

    <!-- VVIP Card -->
    <div v-else-if="subscriptionPlan === 'VVIP'" class="vvip-card">
      <div class="crown-icon">
        <img src="/imgs/crown.svg" alt="">
      </div>
      <div class="card-content">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <img
                :src="'https://s3.cloudfly.vn/thg-storage/uploads-public/' + memberData.avatar"
                :alt="memberData.fullName"
                class="avatar"
            />
            <div class="camera-icon">
              <i class="fa-solid fa-star fa-bounce"></i>
            </div>
          </div>
        </div>
        <div class="info-section">
          <h3 class="member-name">{{ memberData.fullName }}</h3>
          <p class="member-role">Vai trò: {{ memberData.role }}</p>
          <p class="subscription-plan">VVIP Plan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  memberData: {
    type: Object,
    required: true,
    default: () => ({
      fullName: '',
      avatar: '',
      role: '',
      subscriptionPlan: 'Free'
    })
  }
})

const subscriptionPlan = computed(() => props.memberData.subscriptionPlan)

const cardClass = computed(() => {
  return {
    'free-card-style': subscriptionPlan.value === 'Free',
    'vip-card-style': subscriptionPlan.value === 'VIP',
    'vvip-card-style': subscriptionPlan.value === 'VVIP'
  }
})
</script>

<style scoped>
.membership-card {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  position: relative;
  min-height: 150px;
}

/* Common Card Layout */
.card-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 20px;
  gap: 20px;
}

.avatar-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Free Card Styles */
.free-card-style {
  background: white;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* VIP Card Styles */
.vip-card-style {
  background: #031358;
  border-radius: 12px;
}

.vip-card {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.vip-card .circle {
  position: absolute;
  z-index: 1;
}

.vip-card .c1 {
  top: -200px;
  right: -102px;
  width: 283px;
}

.vip-card .c2 {
  top: -230px;
  right: 0px;
  width: 283px;
}

.vip-card .c3 {
  bottom: -233px;
  right: -17px;
  width: 283px;
}

.vip-card .c4 {
  left: -124px;
  right: 12px;
}

.vip-card .card-content {
  position: relative;
  z-index: 2;
}

/* VVIP Card Styles */
.vvip-card-style {
  background: linear-gradient(135deg, #0030FF, #031358);
  border-radius: 12px;
  position: relative;
}

.vvip-card-style::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0030FF, #031358, #0030FF);
  background-size: 200% 200%;
  border-radius: 12px;
  animation: smoothGradient 6s ease-in-out infinite;
  z-index: 1;
}

.vvip-card-style > * {
  position: relative;
  z-index: 2;
}

.vvip-card {
  height: 100%;
  position: relative;
}

.crown-icon {
  position: absolute;
  top: -60px;
  right: -40px;
  z-index: 10;
}

.crown-icon  img{
  width: 120px;
}

/* Common Styles */
.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
}

.free-card-style .avatar {
  border-color: #e0e0e0;
}

.vip-card-style .avatar,
.vvip-card-style .avatar {
  border-color: rgba(255, 255, 255, 0.3);
}

.camera-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #031358, #0030FF);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 17px;
  color: white;
}

.member-name {
  font-family: 'Ubuntu', sans-serif;
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.free-card-style .member-name {
  color: #333;
  font-size: 24px;
}

.vip-card-style .member-name,
.vvip-card-style .member-name {
  color: white;
  font-size: 24px;
}

.member-role {
  font-size: 16px;
  margin: 5px 0 10px 0;
  opacity: 0.8;
}

.free-card-style .member-role {
  color: #666;
}

.vip-card-style .member-role,
.vvip-card-style .member-role {
  color: rgba(255, 255, 255, 0.8);
}

.subscription-plan {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  padding: 5px 15px;
  border-radius: 10px;
  display: inline-block;
  width: fit-content;
  margin-left: auto;
}

.free-card-style .subscription-plan {
  background-color: #f0f0f0;
  color: #333;
}

.vip-card-style .subscription-plan {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.vvip-card-style .subscription-plan {
  background: linear-gradient(135deg, #ffffff, #9f9f9f);
  color: #031358;
}

/* Hiệu ứng gradient mượt mà hơn */
@keyframes smoothGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .card-content {
    flex-direction: column;
    text-align: center;
    gap: 15px;
    padding: 15px;
  }

  .info-section {
    align-items: center;
    text-align: center;
  }

  .member-name {
    font-size: 20px;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .subscription-plan {
    font-size: 16px;
    margin: 0 auto;
  }
  .crown-icon {
    right: -10px;
    top: -40px;
  }
}
</style>