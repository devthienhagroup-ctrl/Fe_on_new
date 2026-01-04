<template>
  <div v-if="isLoaded">
    <!-- Sử dụng component IntroSection -->
    <InvestmentIntro :sectionData="JSON.parse(pageData.sections[0].contentJson)" />

    <!-- Sử dụng component FundingSection -->
    <Funding :sectionData="JSON.parse(pageData.sections[1].contentJson)"
        @open-modal="openModal"
        @view-details="viewDetails"
    />

    <!-- Modal component -->
    <InvestmentModal :sectionData="JSON.parse(pageData.sections[2].contentJson)"
        :visible="showModal"
        :project-data="selectedProject"
        @close="closeModal"
        @payment="handlePayment"
    />
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import { useRouter } from "vue-router";
import InvestmentModal from "./Components/InvestmentModal.vue";
import InvestmentIntro from "./Components/InvestmentIntro.vue";
import Funding from "./Components/Funding.vue";
import api from "../../../api/api.js";

// Lấy API
const isLoaded = ref(false);
const pageData = ref({});
const fecthData = async () => {
  const response = await api.get('/thg/public/cms/contentPage/investment');
  if(response.status===200){
    pageData.value = response.data;
    isLoaded.value=true;
  }
}

onMounted(async () =>{
  await fecthData();
  console.log("Đã lấy được data");
})



// ========================================================================
const router = useRouter();

// State cho modal
const showModal = ref(false)
const selectedProject = ref(null)

// Hàm mở modal
const openModal = (branch) => {
  console.log("open modal with:", branch)
  selectedProject.value = branch
  showModal.value = true
}

// Hàm đóng modal
const closeModal = () => {
  showModal.value = false
  selectedProject.value = null
}

// Hàm xử lý thanh toán
const handlePayment = (packageId) => {
  console.log('Payment data:', packageId)
  router.push('/hop-tac/thanh-toan/'+packageId)
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