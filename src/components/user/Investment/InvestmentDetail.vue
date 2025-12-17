<template>
  <div v-if="isLoaded" class="investment-container">
    <HeroSection :sectionData="JSON.parse(pageData.sections[0].contentJson)"></HeroSection>
    <InvestmentPackages :sectionData="JSON.parse(pageData.sections[1].contentJson)"></InvestmentPackages>
    <InvestorsList :sectionData="JSON.parse(pageData.sections[2].contentJson)"></InvestorsList>
  </div>
</template>

<script setup>
import HeroSection from "./Components/HeroSection.vue";
import InvestmentPackages from "./Components/InvestmentPackages.vue";
import InvestorsList from "./Components/InvestorsList.vue";
import {onMounted, ref} from "vue";
import api from "../../../api/api.js";

const isLoaded = ref(false);
const pageData = ref({});
const fetchData = async () =>{
  const response = await api.get('/thg/public/cms/contentPage/investmentDetail')
  if(response.status===200){
    pageData.value = response.data;
    isLoaded.value=true
  }
}

onMounted( async () => {
  await fetchData();
  console.log("Đã lấy API")
})
</script>

<style scoped>
  .investment-container {
    padding-top: 80px;
  }
</style>