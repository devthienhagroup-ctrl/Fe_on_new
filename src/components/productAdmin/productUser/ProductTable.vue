<template>
  <div class="bg-white rounded-2xl shadow-xl border border-slate-300 mb-5 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm rounded-2xl overflow-hidden">
        <thead class="table-header">
        <tr class="font-bold text-white">
          <th class="text-center">STT</th>
          <th class="text-left">Chủ Nhà</th>
          <th class="text-left">Liên hệ</th>
          <th class="text-left">Giá Bán</th>
          <th class="text-left">Định Giá</th>
          <th class="text-left">Địa Chỉ</th>
          <th class="text-left">Phường/Xã</th>
          <th class="text-left">Khu Vực</th>
          <th class="text-left">Vị Trí</th>
          <th class="text-left">DTCN</th>
          <th class="text-left">Kết Cấu</th>
          <th class="text-left">Cập Nhật</th>
          <th class="text-left">Phí MG</th>
          <th class="text-left">TT</th>
          <th class="text-left">Loại MH</th>
          <th class="text-left">Đơn Vị</th>
          <th class="text-left">&nbsp; Thao Tác</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, idx) in landAssets"
            :key="item.id"
            :class="['transition-all duration-200', idx % 2 === 0 ? 'bg-blue-50/50' : 'bg-rose-50/50']"
            style="font-weight: 550;"
        >
          <td class="text-center">
            <div class="relative inline-flex items-center justify-center w-8 h-8">
              <i :class="[getAssetTypeIcon(item), getAssetTypeColor(item), 'absolute text-lg opacity-20']"></i>
              <span :class="['relative text-xs font-bold', getAssetTypeColor(item)]">
                  {{ idx + 1 }}
                </span>
            </div>
          </td>
          <td class="font-medium text-slate-900 text-gray-800">{{ item.tenChuNha || '—' }}</td>
          <td class="text-slate-900 text-gray-800">{{ item.soDienThoai || '—' }}</td>
          <td class="font-bold text-blue-700">{{  formatMoneyVN( item.giaBan ) }}</td>
          <td v-if="item.giaDinhGia === -1.1" class="text-slate-800">*********</td>
          <td v-else-if="item.giaDinhGia" class="font-bold text-blue-700">
            {{ formatMoneyVN(item.giaDinhGia) }}
          </td>
          <td v-else class="text-slate-800">—</td>
          <td class="text-slate-800 text-gray-800">{{ formatAddressDetail(item.diaChi) }}</td>
          <td class="text-slate-900 text-gray-800">{{ formatWard(item.diaChi) }}</td>
          <td class="text-slate-900 text-gray-800">{{ formatProvince(item.khuVuc) }}</td>
          <td class="text-slate-900 text-gray-800">{{ item.viTri }}</td>
          <td class="font-medium text-slate-800">{{ item.dtcn + 'm²' }}</td>
          <td class="text-slate-900 text-gray-800">{{ catChuoi(item.ketCau || '-', 10) }}</td>
          <td class="text-slate-900 text-gray-800">{{  formatDate(item.capNhatNgay) }}</td>
          <td class="font-bold text-blue-700">
            <div style="position: relative; top: -3px;">
              {{ item.phiMoiGioi != null ? item.phiMoiGioi + '%' : '-' }}
            </div>
          </td>
          <td class="font-bold">
            <img v-if="item.status === 'Đã kiểm duyệt'"
                 src="https://s3.cloudfly.vn/thg-storage/uploads-public/icon-kiem-duỵet.png"
                 style="width: 27px"
                 alt="checked"
            />
            <img v-else-if="item.status === 'Đã bán'" src="/imgs/sold-out.png" style="width: 29px"
                alt="checked"
            />
          </td>
          <td>
              <span :class="['px-2 py-1 rounded-lg font-semibold', badgeClass(item.loaiMH)]"
                    style="border-radius: 8px !important; font-size: 12px !important;">
                {{ item.loaiMH }}
              </span>
          </td>
          <td>
              <span
                  :class="[
                  'inline-flex items-center gap-1 px-2 py-1 font-semibold text-white shadow-sm',
                  item.donVi === 'THG' ? 'bg-[#6A0DAD]' : 'bg-[#0057D9]'
                ]"
                  style="border-radius: 8px; font-size: 12px; line-height: 16px;"
              >
                <i :class="['fa-solid text-white', item.donVi === 'THG' ? 'fa-building' : 'fa-handshake']"
                   style="font-size: 11px;"></i>
                {{ item.donVi }}
              </span>
          </td>
          <td class="text-center relative">
            <!-- ACTION FULL (>=1300px) -->
            <div class="action-full inline-flex items-center">
              <button @click="$emit('toggle-love', item)" class="action-heart">
                <i :class="item.daThich ? 'fa-solid fa-heart text-black text-base' : 'fa-regular fa-heart text-base'"></i>
              </button>

              <!-- HỢP TÁC -->
              <button v-if="canRequestCollaboration(item)" @click="$emit('open-collab', item)" class="action-collab">
                <i class="fa-solid fa-handshake text-[10px]"></i>
                <span>Hợp tác</span>
              </button>

              <button @click="$emit('view-detail', item)" class="action-view">
                <i class="fa-regular fa-eye text-[10px]"></i>
                <span>Xem</span>
              </button>
            </div>

            <!-- ACTION DOT ( <1300px ) -->
            <div class="action-dot relative inline-block">
              <button class="dot-btn">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>

              <!-- DROPDOWN -->
              <div class="dot-menu">
                <button @click="$emit('toggle-love', item)" class="dot-item">
                  <i :class="item.daThich ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'"></i>
                  <span>Yêu thích</span>
                </button>
                <button v-if="canRequestCollaboration(item)" @click="$emit('open-collab', item)" class="dot-item">
                  <i class="fa-solid fa-handshake"></i>
                  <span>Hợp tác</span>
                </button>
                <button @click="$emit('view-detail', item)" class="dot-item">
                  <i class="fa-regular fa-eye"></i>
                  <span>Xem chi tiết</span>
                </button>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 bg-gradient-to-r from-slate-100 to-slate-200 border-t border-slate-300">
      <div class="flex items-center gap-1">
        <button
            @click="$emit('go-to-page', 0)"
            :disabled="page === 0"
            class="p-1.5 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <i class="fa-solid fa-angles-left text-sm"></i>
        </button>
        <button
            @click="$emit('go-to-page', page - 1)"
            :disabled="page === 0"
            class="p-1.5 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <i class="fa-solid fa-angle-left text-sm"></i>
        </button>

        <div class="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg shadow-md">
          <span class="text-sm font-bold">
            Trang {{ page + 1 }} / {{ totalPages }}
          </span>
        </div>

        <button
            @click="$emit('go-to-page', page + 1)"
            :disabled="page >= totalPages - 1"
            class="p-1.5 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <i class="fa-solid fa-angle-right text-sm"></i>
        </button>
        <button
            @click="$emit('go-to-page', totalPages - 1)"
            :disabled="page >= totalPages - 1"
            class="p-1.5 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <i class="fa-solid fa-angles-right text-sm"></i>
        </button>
      </div>

      <div class="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
        <span class="text-sm font-semibold text-slate-900">Số dòng mỗi trang:</span>
        <input
            type="number"
            :value="pageSize"
            @input="$emit('update-page-size', $event.target.value)"
            class="w-16 px-2 py-1 border border-slate-400 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
            min="1"
        />
        <span class="text-sm text-slate-900 font-semibold">
          Hiển thị
          {{ page * pageSize + 1 }}
          -
          {{ Math.min((page + 1) * pageSize, totalRecords) }} của {{ totalRecords }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "/src/stores/authStore.js";

defineProps({
  landAssets: {
    type: Array,
    default: () => []
  },
  page: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 8
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number,
    default: 1
  }
});

defineEmits([
  'go-to-page',
  'update-page-size',
  'toggle-love',
  'open-collab',
  'view-detail'
]);

const authStore = useAuthStore();

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`;
};

const formatAddressDetail = (diaChi) => {
  let raw = diaChi || "";
  let clean = raw.split("/!!")[0].trim();
  clean = clean.replace(/đường/iu, "Đ.");
  return clean;
};

const formatWard = (addressDetail) => {
  const raw = addressDetail || "";
  const parts = raw.split("/!!");
  let ward = parts[1]?.trim() || "";
  return ward
      .replace(/^Phường\s+/i, "P. ")
      .replace(/^Xã\s+/i, "X. ")
      .replace(/^Thị trấn\s+/i, "TT. ");
};

const formatProvince = (province) => {
  if (typeof province !== "string") return province || "";
  return province
      .replace(/^Thành phố\s+/i, "TP.")
      .replace(/^Tỉnh\s+/i, "T.");
};

const getAssetType = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const ketCau = (item.ketCau || "").toLowerCase();

  if (item.loaiTaiSan) {
    const map = {
      NHA: "house",
      DAT: "land",
      DATLON: "land-large"
    };
    if (map[item.loaiTaiSan]) return map[item.loaiTaiSan];
  }

  const houseKeywords = [
    "lầu", "trệt", "tầng", "hầm", "gác",
    "nhà cấp", "cấp 1", "cấp 2", "cấp 3", "cấp 4",
    "biệt thự", "villa", "shophouse", "townhouse", "nhà",
    "chung cư", "căn hộ", "chcc", "studio",
    "condotel", "officetel", "apartment", "can ho",
    "chung cu", "tower", "block"
  ];

  if (houseKeywords.some(keyword => ketCau.includes(keyword))) return "house";
  if (dtcnValue > 1000) return "land-large";
  return "land";
};

const getAssetTypeIcon = (item) => {
  const type = getAssetType(item);
  switch (type) {
    case "house": return "fa-solid fa-house-chimney";
    case "land-large": return "fa-solid fa-mountain-city";
    default: return "fa-solid fa-map-location-dot";
  }
};

const getAssetTypeColor = (item) => {
  const type = getAssetType(item);
  switch (type) {
    case "house": return "text-emerald-700";
    case "land-large": return "text-rose-700";
    default: return "text-blue-700";
  }
};

const catChuoi = (text, max = 11) => {
  if (!text) return '-';
  return text.length > max ? text.slice(0, max) + '...' : text;
};

const badgeClass = (code) => {
  const map = {
    BN30N: "bg-green-500 text-white font-semibold",
    HTT: "bg-yellow-500 text-white font-semibold",
    HOPTAC: "bg-orange-500 text-white font-semibold",
  };
  return map[code] || "bg-slate-400 text-white font-semibold";
};

function formatMoneyVN(value) {
  if (value == null || isNaN(value)) return "0";
  const num = Number(value);

  if (num < 1_000_000) return num.toLocaleString("vi-VN");
  if (num < 1_000_000_000) {
    const trieu = num / 1_000_000;
    return `${trieu.toFixed(trieu % 1 === 0 ? 0 : 1)} triệu`;
  }

  const ty = num / 1_000_000_000;
  return `${ty.toFixed(ty % 1 === 0 ? 0 : 2)} tỷ`;
}

const canRequestCollaboration = (item) => {
  if (item.status === 'Đã bán') return false;
  if (item.isOwner) return false;
  if (item.daGuiYeuCau) return false;
  return true;
};
</script>

<style scoped>
.table-header {
  background: linear-gradient(to right, #641eaf, #562df3);
  border-bottom: 2px solid #a78bfa;
}

.action-heart {
  background: rgba(133,132,132,0.13);
  padding: 0 10px;
  margin-right: 5px;
  border-radius: 8px;
}

.action-view {
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px;
  background: #BFDBFE;
  color: #1D4ED8;
  border: 1px solid #93C5FD;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.action-collab {
  padding: 2px 12px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px;
  background: #f8d7ac;
  color: #f57430;
  border: 1px solid #f8b66c;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 6px;
  margin-right: 10px;
}

.action-collab:hover {
  background: #fed7aa;
  border-color: #fdba74;
}

.dot-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(133,132,132,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-menu {
  position: absolute;
  right: 0;
  top: 36px;
  min-width: 140px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 20px rgba(0,0,0,.12);
  padding: 6px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-5px);
  transition: .2s;
  z-index: 50;
}

.dot-item {
  width: 100%;
  padding: 6px 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
}

.dot-item:hover {
  background: #f1f5f9;
}

.action-dot:hover .dot-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

@media (max-width: 1299px) {
  .action-full {
    display: none;
  }
}

@media (min-width: 1300px) {
  .action-dot {
    display: none;
  }
}

th {
  padding-top: 7px !important;
  padding-bottom: 7px !important;
}

td {
  padding: 5px 5px 10px 0 !important;
}

* {
  font-size: 14px;
}

table * {
  font-size: 13.5px !important;
}
</style>