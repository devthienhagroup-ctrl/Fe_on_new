<template>
  <div v-if="isLoaded" class="main-content">
    <Header :sectionData="sectionDatas.sections[0].contentJson" ref="headerRef" />
    <ProcessEP  :sectionData="sectionDatas.sections[1].contentJson"
                :sectionDataForChild="sectionDatas.sections[7].contentJson"
    ></ProcessEP>
    <PropertyValueFactors :sectionData="sectionDatas.sections[2].contentJson" id="propertyValueFactors"></PropertyValueFactors>
    <Reason :sectionData="sectionDatas.sections[3].contentJson"></Reason>
    <FeeEP
        id="feeEP" @navigateToValuation="scrollToValuation"
        :sectionData="sectionDatas.sections[5].contentJson"
        :sectionDataForChild="sectionDatas.sections[4].contentJson"
    ></FeeEP>
    <SoldSection title="DỰ ÁN ĐÃ BÁN THÀNH CÔNG NHỜ ĐỊNH GIÁ ĐÚNG"></SoldSection>
    <Faq @navigateToCriteria="scrollToCriteria"
         @navigateToPricing="scrollToPricing"
         @navigateToValuation="scrollToValuation"
         :sectionData="sectionDatas.sections[6].contentJson"
    ></Faq>
    <ContactForm></ContactForm>
  </div>
</template>

<script setup>
import ProcessEP from "./Components/ProcessEP.vue";
import PropertyValueFactors from "./Components/PropertyValueFactors.vue";
import Reason from "./Components/Reason.vue";
import Faq from "./Components/Faq.vue";
import SoldSection from "../Home/components/SoldSection.vue";
import ContactForm from "../Home/components/ContactForm.vue";
import FeeEP from "./Components/FeeEP.vue";
import Header from "./Components/Header.vue"; // Import component Header mới
import {onMounted, ref} from "vue";
import api from "../../../api/api.js";

const isLoaded = ref(false);
const sectionDatas =ref({})

const init = async () => {
  const response = await api.get('/thg/public/cms/contentPage/estimateProperty')
  if(response.status === 200) {
    sectionDatas.value = response.data;
    isLoaded.value=true
    console.log("Load API xong", sectionDatas.value)
  }else console.log("Lỗi lấy dữ liệu")
}

onMounted(async () => {
  await init();
})

const headerRef = ref(null);

// Hàm cuộn đến phần tiêu chí định giá
const scrollToCriteria = () => {
  const element = document.getElementById('propertyValueFactors');
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Hàm cuộn đến phần bảng giá
const scrollToPricing = () => {
  const element = document.getElementById('feeEP');
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Hàm cuộn lên đầu trang và làm nổi bật nút
const scrollToValuation = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

  // Kích hoạt hiệu ứng nổi bật sau khi cuộn lên
  setTimeout(() => {
    if (headerRef.value && headerRef.value.highlightValuationButton) {
      headerRef.value.highlightValuationButton();
    }
  }, 500);
};
</script>

<style scoped>
.main-content {
  /* Add any styles you need for the main content container */
}
</style>