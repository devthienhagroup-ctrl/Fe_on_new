<template>
  <div>
    <!-- Header Component -->

    <!-- Nội dung chính -->
    <div class="main-content" v-if="isLoaded">
      <Header :sectionData="parseJSON(pageData.sections[0].contentJson)" @apply-click="scrollToFormSection" />
      <HeroSection :sectionData="parseJSON(pageData.sections[1].contentJson)"></HeroSection>
      <BenefitsSection :sectionData="parseJSON(pageData.sections[2].contentJson)"></BenefitsSection>
      <JobPositionList :sectionData="parseJSON(pageData.sections[3].contentJson)"></JobPositionList>
      <DepartmentSection :sectionData="parseJSON(pageData.sections[4].contentJson)"></DepartmentSection>
      <PostSection :sectionData="parseJSON(pageData.sections[5].contentJson)"></PostSection>
      <FormSection :sectionData="parseJSON(pageData.sections[6].contentJson)" ref="formSection"></FormSection>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import Header from "./Components/Header.vue";
import HeroSection from "./Components/HeroSection.vue";
import BenefitsSection from "./Components/BenefitsSection.vue";
import JobPositionList from "./Components/JobPositionList.vue";
import DepartmentSection from "./Components/DepartmentSection.vue";
import PostSection from "./Components/PostSection.vue";
import FormSection from "./Components/FormSection.vue";
import api from "../../../api/api.js";


// Reference đến FormSection
const formSection = ref(null)

// Xử lý scroll đến form section
const scrollToFormSection = () => {
  formSection.value?.$el.scrollIntoView({ behavior: 'smooth' })
}

const isLoaded = ref(false);
const pageData = ref({});

const fetchData = async () =>{
  const response =await api.get("/thg/public/cms/contentPage/recruitment");

  if(response.status ===200){
    pageData.value = response.data;
    isLoaded.value=true;
  }
}

const parseJSON = (jsonString) => {
  let j = {}
  try {
    j= JSON.parse(jsonString);
    return j;
  }catch (e) {
    console.log("lỗi parse JSON",e);
    return null;
  }
}

onMounted(async () => {
  await fetchData();
  console.log(pageData.value);
})


</script>

<style scoped>
.main-content {
  margin: 60px 0;
}
</style>

<style>
/* ========== HIỆU ỨNG XUẤT HIỆN ========== */
.fade-left,
.fade-right,
.fade-up,
.fade-in {
  opacity: 0;
  visibility: hidden;
}

.fade-left.show,
.fade-right.show,
.fade-up.show,
.fade-in.show {
  opacity: 1 !important;
  visibility: visible;
  animation-fill-mode: forwards !important;
}

/* Bounce từ trái */
.fade-left.show {
  animation: bounceInLeft 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Bounce từ phải */
.fade-right.show {
  animation: bounceInRight 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Từ dưới lên (fade + bounce) */
.fade-up.show {
  animation: bounceInUp 1.1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

/* Fade nhẹ vô */
.fade-in.show {
  animation: fadeIn 1.2s ease-out;
}

/* Keyframes */
@keyframes bounceInLeft {
  0% {
    opacity: 0;
    transform: translateX(-500px);
  }
  60% {
    opacity: 1;
    transform: translateX(15px);
  }
  80% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes bounceInRight {
  0% {
    opacity: 0;
    transform: translateX(500px);
  }
  60% {
    opacity: 1;
    transform: translateX(-15px);
  }
  80% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes bounceInUp {
  0% {
    opacity: 0;
    transform: translateY(500px);
  }
  60% {
    opacity: 1;
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>