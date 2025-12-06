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
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from "vue-router";
import InvestmentModal from "./Components/InvestmentModal.vue";
import InvestmentIntro from "./Components/InvestmentIntro.vue";
import Funding from "./Components/Funding.vue";
import { removeJsonLd, setJsonLd } from "../../../utils/structuredData.js";



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

const investmentsJsonLdId = "jsonld-investments-itemlist";

onMounted(() => {
  setJsonLd(investmentsJsonLdId, {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: "http://localhost:8084/hop-tac"
      },
      {
        "@type": "ListItem",
        position: 2,
        url: "http://localhost:8084/hop-tac/1"
      },
      {
        "@type": "ListItem",
        position: 3,
        url: "http://localhost:8084/hop-tac/2"
      },
      {
        "@type": "ListItem",
        position: 4,
        url: "http://localhost:8084/hop-tac/3"
      }
    ]
  });
});

onBeforeUnmount(() => removeJsonLd(investmentsJsonLdId));

// Hàm xem chi tiết
const viewDetails = (index) => {
  router.push('/investments/' + index)
}
</script>

<style scoped>
/* Các style toàn cục nếu cần */
.body-no-scroll {
  overflow: hidden;
}
</style>