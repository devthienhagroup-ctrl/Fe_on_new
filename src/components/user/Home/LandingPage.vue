<template>
  <div v-if="contentData.length > 0" class="main-container">
    <Banner :content="contentData[0]" :contentStats="contentData[1]"></Banner>
    <HeroSection :content="contentData[2]"></HeroSection>
    <ServiceSection :content="contentData[3]"></ServiceSection>
    <OverviewSection :content="contentData[4]"></OverviewSection>
    <ImpressiveNumbers :content="contentData[5]"></ImpressiveNumbers>
    <SoldSection :content="contentData[6]"></SoldSection>
    <div class="reviews">
      <ParticleBackground
          class="image"
          :image-url="baseImgaeUrl+contentData[12].contentJson.imageUrl"
          alt-text="Mô tả ảnh"
          :max-particle-size="20"
          particle-color="#3C4980"
          line-color="#031358"
          :line-width="0.5"
      ></ParticleBackground>
      <Reviews :content="contentData[7]"></Reviews>
      <SystemEvaluation :content="contentData[8]"></SystemEvaluation>
    </div>
    <MediaAboutUs :content="contentData[9]"></MediaAboutUs>
    <NewsSection :content="contentData[10]"></NewsSection>
    <ContactForm :content="contentData[11]"></ContactForm>
  </div>

  <!-- Thêm loading state nếu muốn -->
  <div v-else class="loading-container">
    <div class="loading-spinner"></div>
    <p>Đang tải dữ liệu...</p>
  </div>
</template>


<script setup>
import Banner from "./components/Banner.vue";
import HeroSection from "./components/HeroSection.vue";
import ServiceSection from "./components/ServiceSection.vue";
import OverviewSection from "./components/OverviewSection.vue";
import ImpressiveNumbers from "./components/ImpressiveNumbers.vue";
import Reviews from "./components/Reviews.vue";
import SystemEvaluation from "./components/SystemEvaluation.vue";
import MediaAboutUs from "./components/MediaAboutUs.vue";
import NewsSection from "./components/NewsSection.vue";
import ContactForm from "./components/ContactForm.vue";
import Footer from "./components/Footer.vue";
import Stats from "./components/Stats.vue";
import SoldSection from "./components/SoldSection.vue";
import ParticleBackground from "../ParticleBackground.vue";
import api from "../../../api/api.js";
import {baseImgaeUrl} from "../../../assets/js/global.js";

import {onMounted, ref} from "vue";

let contentData = ref([]);

const init = async () => {
  const response =  await api.get("/thg/public/cms/contentPage/home");
  console.log(response.data);
  contentData.value = response.data.sections.map(sec => ({
    ...sec,
    contentJson: JSON.parse(sec.contentJson)
  }));
  console.log(contentData.value);
}

onMounted(() => {
  init();

})
</script>


<style scoped>
.main-container {
  max-width: 100%;
  padding-top: 60px;
  align-items: center;
}

.reviews .image {
  position: absolute;
  height: 130%;
  z-index: 0;
}

/* Thêm style cho loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3C4980;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>