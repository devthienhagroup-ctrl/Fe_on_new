<script setup>

import { onBeforeUnmount, onMounted } from "vue";
import HeroSection from "./Components/HeroSection.vue";
import InvestmentPackages from "./Components/InvestmentPackages.vue";
import InvestorsList from "./Components/InvestorsList.vue";
import { removeJsonLd, setJsonLd } from "../../../utils/structuredData.js";

const investmentDetailJsonLdId = "jsonld-investment-detail-itemlist";

onMounted(() => {
  setJsonLd(investmentDetailJsonLdId, {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: "http://localhost:8084/hop-tac/1"
      },
      {
        "@type": "ListItem",
        position: 2,
        url: "http://localhost:8084/hop-tac/2"
      },
      {
        "@type": "ListItem",
        position: 3,
        url: "http://localhost:8084/hop-tac/3"
      }
    ]
  });
});

onBeforeUnmount(() => removeJsonLd(investmentDetailJsonLdId));
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