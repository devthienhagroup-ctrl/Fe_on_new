<!-- SoldProjectCard.vue -->
<template>
  <div
      class="scroll-snap-item glass-card rounded-2xl p-6
           w-full min-w-[280px] max-w-[400px]
           sm:min-w-[300px]
           md:min-w-[320px]
           relative"
      @click="router.push(project.detailUrl || '#')"
  >
    <div class="flex flex-col justify-between">
      <!-- Phần header với vị trí tương đối cho nhãn absolute -->
      <div class="flex items-start justify-between relative">
        <div class="">
          <p class="text-sm text-purple-300 font-semibold truncate">{{ project.type }}</p>
          <p class="text-white font-bold text-xl break-words" style="margin-top: 10px; margin-bottom: 10px">{{ project.location }}</p>
        </div>

        <!-- Nhãn trạng thái absolute -->
        <span
            class="absolute top-0 right-0 px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-400/30 whitespace-nowrap">
        {{ project.status }}
      </span>
      </div>

      <div class="bottom-wrapper">
        <!-- Hình ảnh -->
        <div class=" h-48 rounded-xl overflow-hidden border border-white/10">
          <!-- Nếu có ảnh thật -->
          <img
              v-if="project.imageUrl"
              :src="project.imageUrl"
              :alt="project.type + ' - ' + project.location"
              class="w-full h-full object-cover"
          />
          <!-- Nếu không có ảnh, dùng gradient placeholder -->
          <div
              v-else
              class="w-full h-full"
              :class="project.imageClass || 'bg-gradient-to-br from-purple-500/20 to-blue-500/10'"
          >
            <div class="w-full h-full flex items-center justify-center text-slate-500">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Thông tin chi tiết -->
        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Giá bán:</span>
            <span class="text-white font-semibold truncate">{{ formatPrice(project.price) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Ngày bán:</span>
            <span class="text-white font-semibold truncate">{{ formatDate(project.saleTime) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Hoa hồng:</span>
            <span
                class="font-semibold truncate"
                :class="project.priceDifference >= 0 ? 'text-green-400' : 'text-rose-400'"
            >
          {{ formatPriceDifference(project.priceDifference) }}
        </span>
          </div>
        </div>

        <!-- Thêm các thông tin bổ sung nếu có -->
        <div v-if="project.additionalInfo" class="mt-4 pt-4 border-t border-white/10">
          <p class="text-xs text-slate-400 line-clamp-2">{{ project.additionalInfo }}</p>
        </div>

        <!--      &lt;!&ndash; Nút xem chi tiết (tuỳ chọn) &ndash;&gt;-->
        <!--      <div v-if="project.showDetailsButton" class="mt-6 pt-4 border-t border-white/10">-->
        <!--        <button-->
        <!--            @click="router.push(project.detailUrl || '#')"-->
        <!--            class="w-full px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 transition"-->
        <!--        >-->
        <!--          Xem chi tiết-->
        <!--        </button>-->
        <!--      </div>-->
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue';
import {baseImgaeUrl, buildSeoUrl} from "../../../assets/js/global.js";
import {useRouter} from "vue-router";

const router = useRouter();

const props = defineProps({
  project: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      type: 'Nhà phố',
      location: 'Quận 2, TP.HCM',
      status: 'ĐÃ BÁN',
      price: 14.5, // Có thể là số hoặc string
      saleTime: '28 ngày',
      priceDifference: 8, // Phần trăm
      imageUrl: '', // URL ảnh thật, nếu có
      imageClass: 'bg-gradient-to-br from-purple-500/20 to-blue-500/10', // Chỉ dùng khi không có imageUrl
      additionalInfo: '',
      detailUrl: '', //linh trang chi tiết
      showDetailsButton: false
    })
  }
});

const emit = defineEmits(['view-details']);

// Format giá tiền
const formatPrice = (price) => {
  if (typeof price === 'number') {
    return `${price.toFixed(1)} tỷ VNĐ`;
  }
  return price; // Nếu đã là string format sẵn
};

// Format chênh lệch giá
const formatPriceDifference = (difference) => {
  return difference >= 0 ? `+${difference}%` : `${difference}%`;
};

// Xử lý click xem chi tiết
const viewDetails = () => {
  emit('view-details', props.project);
};

const formatDate = (dateInput, format = 'dd/MM/yyyy') => {
  if (!dateInput) return '';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const pad = (n) => String(n).padStart(2, '0');

  const map = {
    dd: pad(date.getDate()),
    MM: pad(date.getMonth() + 1),
    yyyy: date.getFullYear(),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds())
  };

  return format.replace(/dd|MM|yyyy|HH|mm|ss/g, (key) => map[key]);
}

</script>