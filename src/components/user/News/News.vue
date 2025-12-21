<template>
  <div v-if="isLoaded">
    <FeaturedNews
        :sectionData="JSON.parse(configData.sections[0].contentJson)"
        :featureNews="newsData.featureNews"
        @goToNews="handleGoToNews"
    />
    <LatestNews
        :sectionData="JSON.parse(configData.sections[1].contentJson)"
        :latestNews="newsData.latestNews"
        @goToNews="handleGoToNews"
    />
    <CategoryNews
        :sectionData="JSON.parse(configData.sections[2].contentJson)"
        :news="newsData.news"
        :categories="newsData.categories"
        @goToNews="handleGoToNews"
        :recentNews="recentNewsList"
    />
    <EmailSubscribe :sectionData="JSON.parse(configData.sections[3].contentJson)"/>
  </div>
</template>

<script setup>
import FeaturedNews from "./Component/FeaturedNews.vue";
import LatestNews from "./Component/LatestNews.vue";
import CategoryNews from "./Component/CategoryNews.vue";
import EmailSubscribe from "./Component/EmailSubscribe.vue";
import api from "../../../api/api.js";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useRecentNews} from "../../../stores/useRecentNews.js"; // Sửa đường dẫn

const router = useRouter();
const { addRecentNews, getRecentNews } = useRecentNews();

// Lấy danh sách tin đã xem
const recentNewsList = ref(getRecentNews());

const handleGoToNews = (newsDTO) => {
  // console.log("handleNews", newsDTO)
  // Lưu tin vào localStorage
  // recentNewsList.value = addRecentNews(newsDTO);

  // Điều hướng đến trang tin tức
  router.push("/tin-tuc/" + newsDTO.slug);
}

const isLoaded = ref(false);
const configData = ref({});

const fetchConfig = async () => {
  const response = await api.get('/thg/public/cms/contentPage/news')
  if (response.status===200) {
    configData.value = response.data;
  }
}

const newsData = ref({});
const fetchNews = async () => {
  const response = await api.get("/thg/public/news/getNewsPage");
  if (response.status===200) {
    newsData.value = response.data;
  }
}

onMounted(async () => {
  await fetchConfig();
  await fetchNews();
  isLoaded.value = true;
  console.log("Đã gọi API", configData.value);
})
</script>