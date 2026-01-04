<template>
  <div v-if="isLoaded" class="investment-container">
    <HeroSection
        :sectionConfig="JSON.parse(pageConfig.sections[0].contentJson)"
        :contributionData="contributionData"
        :packages="investmentDetail.packages"
        @payment="handlePayment"
    />
    <InvestmentPackages
        :sectionConfig="JSON.parse(pageConfig.sections[1].contentJson)"
        :packages="investmentDetail.packages"
    />
    <InvestorsList
        :sectionConfig="JSON.parse(pageConfig.sections[2].contentJson)"
        :packages="investmentDetail.packages"
        :investors="investmentDetail.investors"
        :currentUserHasInvested="currentUserHasInvested"
        @page-change="handlePageChange"
        @payment="handlePayment"
    />
  </div>
</template>

<script setup>
import HeroSection from "./Components/HeroSection.vue";
import InvestmentPackages from "./Components/InvestmentPackages.vue";
import InvestorsList from "./Components/InvestorsList.vue";
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../../api/api.js";
import InvestmentModal from "./Components/InvestmentModal.vue";

const isLoaded = ref(false);
const pageConfig = ref({});
const investmentDetail = ref({});
const contributionData = ref({});
const route = useRoute();
const router =useRouter();

const currentUserHasInvested = ref(null);

// Thêm biến phân trang
const pagination = ref({
  page: 0,
  size: 10
});

const handlePayment = (packageId) => {
  console.log('Payment data:', packageId)
  router.push('/hop-tac/thanh-toan/'+packageId)
}


// Hàm lấy slug từ path hiện tại
const getSlugFromPath = () => {
  const path = route.path; // Ví dụ: /hop-tac/dau-tu-nha-pho-binh-thanh
  const segments = path.split('/').filter(segment => segment);
  // Slug là phần cuối cùng của path
  return segments[segments.length - 1] || '';
};

const fetchConfig = async () => {
  const response = await api.get('/thg/public/cms/contentPage/investmentDetail')
  if (response.status === 200) {
    pageConfig.value = response.data;
  }
}

// Cập nhật hàm fetchInvestmentBySlug để nhận tham số phân trang
const fetchInvestmentBySlug = async (page = 0, size = 10) => {
  const slug = getSlugFromPath();
  if (!slug) {
    console.error("Không tìm thấy slug trong URL");
    return;
  }

  try {
    const response = await api.get(`/thg/public-view/investment/getIvmByslug/${slug}?page=${page}&size=${size}`);
    if (response.status === 200) {
      investmentDetail.value = response.data;
      mapToContributionData();
      currentUserHasInvested.value= investmentDetail.value.hasInvested;
    }
  } catch (error) {
    console.error("Lỗi khi fetch investment detail:", error);
    router.push("/khong-tim-thay")
  }
}

// Xử lý khi phân trang thay đổi
const handlePageChange = (newPagination) => {
  pagination.value = newPagination;
  fetchInvestmentBySlug(newPagination.page, newPagination.size);
}

// Map dữ liệu từ API sang contributionData
const mapToContributionData = () => {
  const data = investmentDetail.value;

  // Tính số ngày còn lại
  const endDate = new Date(data.endDate);
  const today = new Date();
  const timeDiff = endDate - today;
  const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));

  // Format số tiền
  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} triệu`;
    }
    return amount.toLocaleString('vi-VN');
  };

  contributionData.value = {
    title: data.name,
    description: data.description,
    targetProgress: data.progressPercent || 0,
    thumbnail: data.thumbnail || null,
    targetAmount: formatCurrency(data.targetAmount),
    stats: [
      { value: daysRemaining.toString(), label: "Số ngày còn lại" },
      { value: data.investorsCount?.toString() || "0", label: "Số người góp vốn" },
      { value: formatCurrency(data.targetAmount * (data.progressPercent || 0) / 100), label: "Tiến độ hiện tại" }
    ],
    hasInvested: data.hasInvested,
  };
}

onMounted(async () => {
  await Promise.all([
    fetchConfig(),
    fetchInvestmentBySlug(pagination.value.page, pagination.value.size)
  ]);
  isLoaded.value = true;
  console.log("Đã lấy API");
})
</script>

<style scoped>
.investment-container {
  padding-top: 80px;
}
</style>