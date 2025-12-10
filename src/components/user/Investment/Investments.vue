<template>
  <div>
    <!-- Sử dụng component IntroSection -->
    <InvestmentIntro />

    <!-- Sử dụng component FundingSection -->
    <Funding
        @open-modal="openModal"
        @view-details="viewDetails"
    />

    <!-- Modal component -->
    <InvestmentModal
        :visible="showModal"
        :project-data="selectedProject"
        @close="closeModal"
        @payment="handlePayment"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";
import InvestmentModal from "./Components/InvestmentModal.vue";
import InvestmentIntro from "./Components/InvestmentIntro.vue";
import Funding from "./Components/Funding.vue";



const router = useRouter();

// State cho modal
const showModal = ref(false)
const selectedProject = ref(null)

// Hàm mở modal
const openModal = (branch) => {
  selectedProject.value = branch
  showModal.value = true
}

// Hàm đóng modal
const closeModal = () => {
  showModal.value = false
  selectedProject.value = null
}

// Hàm xử lý thanh toán
const handlePayment = (paymentData) => {
  console.log('Payment data:', paymentData)
  // Xử lý thanh toán ở đây
  closeModal()
}

// Hàm xem chi tiết
const viewDetails = (index) => {
  router.push('/hop-tac/' + index)
}
</script>

<style scoped>
/* Các style toàn cục nếu cần */
.body-no-scroll {
  overflow: hidden;
}
</style>