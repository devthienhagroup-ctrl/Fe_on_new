<template>
  <FeaturedNews></FeaturedNews>
  <LatestNews></LatestNews>
  <CategoryNews></CategoryNews>
  <EmailSubscribe></EmailSubscribe>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";
import FeaturedNews from "./Component/FeaturedNews.vue";
import LatestNews from "./Component/LatestNews.vue";
import CategoryNews from "./Component/CategoryNews.vue";
import EmailSubscribe from "./Component/EmailSubscribe.vue";
import { removeJsonLd, setJsonLd } from "../../../utils/structuredData.js";

const newsJsonLdId = "jsonld-news-itemlist";

onMounted(() => {
  setJsonLd(newsJsonLdId, {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        url: "http://localhost:8084/tin-tuc"
      },
      {
        "@type": "ListItem",
        position: 2,
        url: "http://localhost:8084/tin-tuc/1"
      },
      {
        "@type": "ListItem",
        position: 3,
        url: "http://localhost:8084/tin-tuc/2"
      },
      {
        "@type": "ListItem",
        position: 4,
        url: "http://localhost:8084/tin-tuc/3"
      }
    ]
  });
});

onBeforeUnmount(() => removeJsonLd(newsJsonLdId));
</script>