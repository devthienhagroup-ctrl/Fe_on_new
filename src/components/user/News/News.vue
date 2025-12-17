<template>
  <div v-if="isLoaded">
    <FeaturedNews :sectionData="JSON.parse(pageData.sections[0].contentJson)"></FeaturedNews>
    <LatestNews :sectionData="JSON.parse(pageData.sections[1].contentJson)"></LatestNews>
    <CategoryNews :sectionData="JSON.parse(pageData.sections[2].contentJson)"></CategoryNews>
    <EmailSubscribe :sectionData="JSON.parse(pageData.sections[3].contentJson)"></EmailSubscribe>
  </div>
</template>

<script setup>
import FeaturedNews from "./Component/FeaturedNews.vue";
import LatestNews from "./Component/LatestNews.vue";
import CategoryNews from "./Component/CategoryNews.vue";
import EmailSubscribe from "./Component/EmailSubscribe.vue";
import api from "../../../api/api.js";
import {onMounted, ref} from "vue";

const isLoaded = ref(false);
const pageData = ref({});
const fetchData = async () => {
  const response = await api.get('/thg/public/cms/contentPage/news')

  if (response.status===200) {
    pageData.value= response.data;
    isLoaded.value=true;
  }
}

onMounted(async () => {
  await fetchData();
  console.log("Đã gọi API", pageData.value)
})

</script>