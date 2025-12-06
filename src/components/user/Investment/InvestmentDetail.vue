<script setup>

import HeroSection from "./Components/HeroSection.vue";
import InvestmentPackages from "./Components/InvestmentPackages.vue";
import InvestorsList from "./Components/InvestorsList.vue";
</script>

<template>
  <div class="investment-container">
    <HeroSection></HeroSection>
    <InvestmentPackages></InvestmentPackages>
    <InvestorsList></InvestorsList>
  </div>
</template>

<style scoped>
  .investment-container {
    padding-top: 80px;
  }
</style>