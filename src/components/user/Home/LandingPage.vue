
<template>

  <div class="main-container">
    <Banner></Banner>

    <HeroSection></HeroSection>
    <ServiceSection></ServiceSection>
    <OverviewSection></OverviewSection>
    <ImpressiveNumbers></ImpressiveNumbers>
    <SoldSection></SoldSection>
    <div class="reviews">
      <ParticleBackground class="image" image-url="/imgs/background_building.jpg"
                          alt-text="Mô tả ảnh"
                          :max-particle-size="20"
                          particle-color="#3C4980"
                          line-color="#031358"
                          :line-width="0.5"
      ></ParticleBackground>
      <Reviews></Reviews>
      <SystemEvaluation></SystemEvaluation>
    </div>
    <MediaAboutUs></MediaAboutUs>
    <NewsSection></NewsSection>
    <ContactForm></ContactForm>
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
</script>


<style scoped>

.main-container {
  padding-top: 60px;
  align-items: center; /* căn giữa ngang */
}

.reviews .image {
  position: absolute;
  height: 130%;
  z-index: 0;
}


</style>