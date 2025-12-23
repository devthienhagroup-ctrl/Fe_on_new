<template>
  <div class="d-flex justify-content-between align-items-center px-3 pb-2 " style="border-bottom: solid 0.5px rgba(0,0,0,0.3)">
    <h5 class="fw-bold mb-0 d-flex align-items-center" style="font-size: 20px">
      <i class="fas fa-users me-2 text-primary"></i>
      Quản lý người dùng
    </h5>

    <div class="d-flex align-items-center justify-content-end gap-2">
      <NotificationBell />
      <div class="d-flex flex-column align-items-end text-end">
        <div class="fw-semibold text-dark">{{ info.fullName }}</div>
      </div>

      <img
          v-if="info.avatarUrl"
          :src="' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + info.avatarUrl"
          alt="avatar"
          class="rounded-circle border"
          style="width: 36px; height: 36px; object-fit: cover;"
      />
      <div v-else class="avatar-circle">
        {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
      </div>
    </div>
  </div>
  <div class="container-fluid py-4 host-list-container">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-1">
      <div>
        <div class="d-flex align-items-center gap-2 mb-2">
          <h4 class="mb-0 fw-bold text-dark">
            Danh sách {{ selectedType === 'HOST' ? 'chủ nhà' : 'môi giới' }}
          </h4>

          <!-- SWITCH TYPE -->
          <select
              v-model="selectedType"
              class="form-select form-select-sm w-auto"
              style="min-width: 130px;"
          >
            <option value="HOST">Chủ nhà</option>
            <option value="MOI_GIOI">Môi giới</option>
          </select>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-1">
          <p class="text-muted mb-0">Quản lý thông tin các chủ nhà trong hệ thống</p>
          <button
              class="btn btn-primary rounded-3 btn-sm ms-2"
              @click="showCreateHostModal = true"
          >
            <i class="fas fa-plus me-1"></i>
            Thêm {{ selectedType === 'HOST' ? 'chủ nhà' : 'môi giới' }}
          </button>

        </div>
      </div>
      <div class="text-end">
        <span class="badge bg-light text-dark border">
          <i class="fas fa-users me-1"></i>
          Tổng: <span class="fw-bold">{{ totalRecords }}</span> host
        </span>
      </div>
    </div>

    <!-- FILTER SECTION -->
    <div class="card shadow-sm border-0 mb-4 filter-section filter-purple">
    <div class="card-header bg-transparent border-0 py-3">
        <h6 class="mb-0 fw-semibold">
          <i class="fas fa-filter me-2 text-primary"></i>
          Bộ lọc tìm kiếm
        </h6>
      </div>
      <div class="filter-full-width">
        <div class="card-body pt-0">
        <div class="row g-3">
          <!-- Search -->
          <div class="col-xl-4 col-lg-4 col-md-6">
            <i class="fas fa-magnifying-glass text-primary me-1"></i>
            <label class="form-label fw-medium small">Tìm kiếm</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light border-end-0">
                <i class="fas fa-search text-muted"></i>
              </span>
              <input
                  v-model="filters.search"
                  class="form-control border-start-0"
                  placeholder="Tên, Email, SĐT..."
              />
            </div>
          </div>

          <!-- Gender -->
          <div class="col-xl-2 col-lg-4 col-md-4">
            <i class="fas fa-venus-mars text-rose me-1"></i>
            <label class="form-label fw-medium small">Giới tính</label>
            <select v-model="filters.gender" class="form-select form-select-sm">
              <option :value="null">Tất cả</option>
              <option :value="true">Nam</option>
              <option :value="false">Nữ</option>
            </select>
          </div>

          <!-- Status -->
          <div class="col-xl-2 col-lg-4 col-md-4">
            <i class="fas fa-toggle-on text-emerald me-1"></i>
            <label class="form-label fw-medium small">Trạng thái</label>
            <select v-model="filters.status" class="form-select form-select-sm">
              <option :value="null">Tất cả</option>
              <option :value="true">Hoạt động</option>
              <option :value="false">Khoá</option>
            </select>
          </div>

          <!-- Province -->
          <div class="col-xl-2 col-lg-4 col-md-4">
            <i class="fas fa-city text-violet me-1"></i>
            <label class="form-label fw-medium small">Tỉnh/Thành</label>
            <select v-model="filters.tinh" class="form-select form-select-sm">
              <option value="">Tất cả tỉnh thành</option>
              <option
                  v-for="p in provinces"
                  :key="p.code"
                  :value="p.name"
              >
                {{ p.name }}
              </option>
            </select>
          </div>

          <!-- Ward -->
          <div class="col-xl-2 col-lg-4 col-md-4">
            <i class="fas fa-location-dot text-orange me-1"></i>
            <label class="form-label fw-medium small">Phường/Quận</label>
            <select
                v-model="filters.phuong"
                class="form-select form-select-sm"
            >
              <option value="">Tất cả phường/quận</option>

              <option
                  v-for="w in selectedProvince?.wards || []"
                  :key="w.code"
                  :value="w.name"
              >
                {{ w.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
      </div>
    </div>

    <!-- TABLE SECTION -->
    <div class="card shadow-sm border-0 table-section">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-header-purple">
            <tr>
              <th class="ps-4 py-3 border-bottom" style="width: 50px;">#</th>
              <th class="py-3 border-bottom">Họ tên</th>
              <th class="py-3 border-bottom">Email</th>
              <th class="py-3 border-bottom">SĐT</th>
              <th class="py-3 border-bottom">Giới tính</th>
              <th class="py-3 border-bottom">Địa chỉ</th>
              <th class="py-3 border-bottom text-center">
                {{ selectedType === 'HOST' ? 'Tài sản' : 'Đã bán' }}
              </th>
              <th class="py-3 border-bottom text-center">Trạng thái</th>
              <th class="py-3 border-bottom text-center">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            <!-- Loading State -->
            <tr v-if="loading">
              <td colspan="8" class="text-center py-5">
                <div class="spinner-border text-primary spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted mt-2 mb-0">Đang tải dữ liệu...</p>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr
                v-for="(item, index) in data"
                :key="item.id"
                class="table-row-hover"
                @click="selectHost(item)"
            >
              <td class="ps-4 fw-medium text-muted">
                {{ index + 1 + pageNo * pageSize }}
              </td>
              <td class="fw-semibold">
                <div class="d-flex align-items-center">
                  {{ item.fullName }}
                </div>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <i class="fas fa-envelope icon-email me-2"></i>
                  <span class="text-truncate" style="max-width: 200px;">
                      {{ item.email }}
                    </span>
                </div>
              </td>
              <td>
                <i class="fas fa-phone icon-phone me-2"></i>
                {{ item.phone || '—' }}
              </td>
              <td>
                  <span
                      class="badge badge-gender"
                      :class="item.gender ? 'male' : 'female'"
                  >
                    <i :class="item.gender ? 'fas fa-mars' : 'fas fa-venus'"></i>
                    {{ item.gender ? 'Nam' : 'Nữ' }}
                  </span>
              </td>
              <td class="address-cell">
                <div class="address-wrap">
                  <i class="fas fa-map-marker-alt icon-address me-2"></i>
                  <span class="text-truncate">
                    {{ formatAddress(item.address) }}
                  </span>
                </div>
              </td>
              <td class="text-center">
                  <span class="badge badge-asset">
                    <i
                        :class="selectedType === 'HOST'
                            ? 'fas fa-home'
                            : 'fas fa-handshake'"
                        class="me-1"
                    ></i>

                    {{ selectedType === 'HOST'
                      ? (item.countAsset || 0)
                      : (item.countDaBan || 0)
                    }}
                  </span>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center">
                  <div class="form-check form-switch">
                    <input
                        class="form-check-input status-toggle"
                        type="checkbox"
                        :checked="item.status"
                        @click.stop="toggleStatus(item)"
                    >
                  </div>
                  <span
                      class="badge badge-status ms-2"
                      :class="item.status ? 'active' : 'inactive'"
                  >
                      {{ item.status ? 'Hoạt động' : 'Khoá' }}
                    </span>
                </div>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-1">
                  <!-- XEM -->
                  <button
                      class="btn btn-sm btn-light btn-view"
                      title="Xem chi tiết"
                      @click.stop="viewHostDetail(item.id)"
                  >
                    <i class="fas fa-eye"></i>
                  </button>

                  <!-- CHỈNH SỬA -->
                  <button
                      class="btn btn-sm btn-light btn-edit"
                      title="Chỉnh sửa host"
                      @click.stop="openUpdateHost(item.id)"
                  >
                    <i class="fas fa-pen"></i>
                  </button>

                  <!-- XÓA -->
                  <button
                      class="btn btn-sm btn-light btn-delete"
                      title="Xóa host"
                      @click.stop="deleteHost(item)"
                  >
                    <i class="fas fa-trash text-danger"></i>
                  </button>
                </div>
              </td>

            </tr>

            <!-- Empty State -->
            <tr v-if="!loading && data.length === 0">
              <td colspan="9" class="text-center py-5">
                <div class="empty-state">
                  <i class="fas fa-users-slash fa-2x text-muted mb-3"></i>
                  <p class="text-muted mb-0">Không tìm thấy host nào</p>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PAGINATION -->
    <div class="d-flex justify-content-between align-items-center gap-3 mt-4 mb-4">
      <!-- INFO -->
      <div class="text-muted small">
        Hiển thị <span class="fw-bold">{{ data.length }}</span> trong tổng số
        <span class="fw-bold">{{ totalRecords }}</span> bản ghi
      </div>

      <!-- PAGE SIZE + PAGINATION -->
      <div class="d-flex align-items-center gap-3">
        <!-- PAGE SIZE -->
        <div class="d-flex align-items-center gap-2">
          <span class="text-muted small">Hiển thị</span>
          <select
              v-model="pageSize"
              class="form-select form-select-sm w-auto"
              style="min-width: 70px"
              @change="onPageSizeChange"
          >
            <option v-for="s in [5, 10, 20, 50]" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
          <span class="text-muted small">bản ghi</span>
        </div>

        <!-- PAGINATION -->
        <div class="d-flex align-items-center gap-2">
          <span class="text-muted small me-2">
            Trang {{ pageNo + 1 }} / {{ totalPages }}
          </span>

          <div class="btn-group btn-group-sm">
            <button
                class="btn btn-outline-secondary"
                :disabled="pageNo === 0"
                title="Trang đầu"
                @click="goFirstPage"
            >
              <i class="fas fa-angles-left"></i>
            </button>

            <button
                class="btn btn-outline-secondary"
                :disabled="pageNo === 0"
                title="Trang trước"
                @click="pageNo--"
            >
              <i class="fas fa-chevron-left"></i>
            </button>

            <button
                class="btn btn-outline-secondary"
                :disabled="pageNo >= totalPages - 1"
                title="Trang sau"
                @click="pageNo++"
            >
              <i class="fas fa-chevron-right"></i>
            </button>

            <button
                class="btn btn-outline-secondary"
                :disabled="pageNo >= totalPages - 1"
                title="Trang cuối"
                @click="goLastPage"
            >
              <i class="fas fa-angles-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div  class="w-100 text-center mb-4">
      <!-- TITLE -->
<!--      <hr/>-->
<!--      <div v-if="selectedType !== 'HOST'" class=" mb-5">-->
<!--        <h4 class="fw-bold w-100 text-start">Thống kê môi giới</h4>-->
<!--        <h4 class="fw-bold mb-4 " >-->
<!--          TOP môi giới chuyên nghiệp tại-->
<!--          <span class="text-primary">-->
<!--        {{ filters.tinh && filters.tinh.trim() !== ''-->
<!--              ? filters.tinh-->
<!--              : 'Toàn quốc' }}-->
<!--      </span>-->
<!--        </h4>-->

<!--        &lt;!&ndash; CARD LIST &ndash;&gt;-->
<!--        <div-->
<!--            v-if="podiumBrokers.length"-->
<!--            class="top-broker-podium"-->
<!--        >-->
<!--          <div-->
<!--              v-for="item in podiumBrokers"-->
<!--              :key="item.employeeId"-->
<!--              class="broker-card text-center podium-card"-->
<!--              :class="[`rank-${item.rank}`]"-->
<!--          >-->
<!--            &lt;!&ndash; AVATAR &ndash;&gt;-->

<!--              <div-->
<!--                  v-if="item.rank <= 3"-->
<!--                  class="top-text"-->
<!--                  :class="getTopClass(item.rank)"-->
<!--              >-->
<!--                TOP {{ item.rank }}-->
<!--              </div>-->
<!--              <div class="avatar-wrapper mx-auto">-->
<!--                <img-->
<!--                    :src="item.avatar-->
<!--                ? 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + item.avatar-->
<!--                :  'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + 'vat-default.jpg'"-->
<!--                    class="avatar-img"-->
<!--                />-->

<!--                &lt;!&ndash; BADGE &ndash;&gt;-->
<!--                <img-->
<!--                    src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/huy-hieu.png"-->
<!--                    class="badge-icon"-->
<!--                    style="width: 45px; height: 45px"-->
<!--                />-->
<!--              </div>-->

<!--            &lt;!&ndash; NAME &ndash;&gt;-->
<!--            <h6 class="fw-semibold mt-3 mb-1" style="font-size: 24px">-->
<!--              {{ item.fullName }}-->
<!--            </h6>-->

<!--            &lt;!&ndash; SOLD &ndash;&gt;-->
<!--            <p class="text-muted small mb-0" style="font-size: 16px">-->
<!--              Đã bán {{ item.totalSold }} căn-->
<!--            </p>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <div
          v-if="otherBrokers.length"
          class="d-flex justify-content-center gap-4 flex-wrap mt-4"
      >
        <div
            v-for="item in otherBrokers"
            :key="item.employeeId"
            class="broker-card text-center"
        >
          <!-- AVATAR -->

            <div
                v-if="item.rank <= 3"
                class="top-text"
                :class="getTopClass(item.rank)"
            >
              TOP {{ item.rank }}
            </div>
            <div class="avatar-wrapper mx-auto">
              <img
                  :src="item.avatar
              ? 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + item.avatar
              :  'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + 'vat-default.jpg'"
                  class="avatar-img"
              />

              <!-- BADGE -->
              <img
                  src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/huy-hieu.png"
                  class="badge-icon"
                  style="width: 45px; height: 45px"
              />
            </div>

          <!-- NAME -->
          <h6 class="fw-semibold mt-3 mb-1" style="font-size: 24px">
            {{ item.fullName }}
          </h6>

          <!-- SOLD -->
          <p class="text-muted small mb-0" style="font-size: 16px">
            Đã bán {{ item.totalSold }} căn
          </p>
        </div>
      </div>
      <!-- BIỂU ĐỒ THỐNG KÊ MÔI GIỚI -->
      <section class="broker-chart-panel">
        <header class="broker-chart-header">
          <div>
            <p class="chart-kicker mb-1">Analytics</p>
            <h5 class="chart-title">
              Thống kê
              {{ selectedType === 'HOST' ? 'chủ nhà' : 'môi giới' }}
              theo khu vực
            </h5>
          </div>
          <div class="chart-statistics">
            <div class="stat-chip primary">
              <span class="label">
                Tổng {{ selectedType === 'HOST' ? 'chủ nhà' : 'môi giới' }}
              </span>
              <strong class="value">{{ totalBrokerCount }}</strong>
            </div>
            <div class="stat-chip muted" v-if="brokerLabels.length">
              <span class="label">Số khu vực</span>
              <strong class="value">{{ brokerLabels.length }}</strong>
            </div>
          </div>
        </header>

        <div class="broker-chart-wrapper">
          <Bar
              v-if="brokerLabels.length"
              :data="chartData"
              :options="chartOptions"
          />
          <div v-else class="chart-empty-state">
            <div class="empty-icon">
              <i class="fas fa-chart-column"></i>
            </div>
            <div>
              <p class="mb-1 fw-semibold">Không có dữ liệu thống kê</p>
              <small class="text-muted">Vui lòng chọn khu vực hoặc thử lại sau.</small>
            </div>
          </div>
        </div>
      </section>
      <!-- Trong template của file chính, sau phần biểu đồ thống kê -->
      <div v-if="selectedType !== 'HOST'" class="w-100 text-center mb-4">
        <!-- ... phần top môi giới và biểu đồ ... -->

        <!-- CHÍNH SÁCH THƯỞNG MÔI GIỚI -->
        <thuong-moi-gioi />
      </div>
    </div>


    <HostDetailModal
        v-if="showDetail"
        :host="selectedHost"
        :type="selectedType"
        @close="showDetail = false"
    />

    <HostUpdateModal
        v-if="showUpdate"
        :host="selectedHost"
        :type="selectedType"
        @close="showUpdate = false"
        @reload="fetchData"
    />
    <CreateHostModal
        v-if="showCreateHostModal"
        :type="selectedType"
        @close="showCreateHostModal = false"
        @created="fetchData"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import api from "/src/api/api.js";
import provinces from "/src/assets/js/address.json";
import CreateHostModal from "./CreateHostModal.vue";
import HostUpdateModal from "./HostUpdateModal.vue";
import HostDetailModal from "./HostDetailModal.vue";
import { Bar } from 'vue-chartjs'
import { useAuthStore } from "/src/stores/authStore.js";
import thuongMoiGioi from "./thuongMoiGioi.vue"
const authStore = useAuthStore();
const info = authStore.userInfo;
// src/plugins/chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
)




const selectedType = ref('HOST'); // HOST | MOI_GIOI
const data = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const totalPages = ref(1);

const pageNo = ref(0);
const pageSize = ref(10);

const setTopRanks = (list) => {
  if (!Array.isArray(list)) return []

  return [...list]
      .sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0))
      .map((item, index) => ({
        ...item,
        rank: index + 1   // 1, 2, 3, ...
      }))
}


const goFirstPage = () => {
  if (pageNo.value > 0) {
    pageNo.value = 0;
  }
};

const goLastPage = () => {
  if (pageNo.value < totalPages.value - 1) {
    pageNo.value = totalPages.value - 1;
  }
};

const filters = ref({
  search: null,
  gender: null,
  status: null,
  tinh: '',
  phuong: ''
});

const selectedProvince = computed(() =>
    provinces.find(p => p.name === filters.value.tinh)
);

// Computed properties
const totalPagesComputed = computed(() => {
  return Math.ceil(totalRecords.value / pageSize.value);
});

// Methods
const getInitials = (name) => {
  if (!name) return '?';
  return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
};

const formatAddress = (address) => {
  if (!address) return "Chưa cập nhật";

  return address
      .replace(/^\d+\/!!/, "")
      .replace(/\/!!/g, ", ");
};

const showCreateHostModal = ref(false);

let searchTimeout = null;
watch(
    () => ({ ...filters.value }),
    (newFilters, oldFilters) => {
      // reset page khi filter đổi
      pageNo.value = 0;

      // debounce riêng cho search
      if (newFilters.search !== oldFilters?.search) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          fetchData();
        }, 400); // 👈 300–500ms là đẹp
      } else {
        fetchData();
      }
    },
    { deep: true }
);
watch(
    () => filters.value.tinh,
    (newTinh, oldTinh) => {
      if (newTinh !== oldTinh) {
        filters.value.phuong = ''; // 👈 luôn đưa về "Tất cả phường/quận"
      }
      if (selectedType.value !== 'HOST') {
        fetchTopBrokers()    // 👈 hàm gọi API thống kê
      }
    }

);

const brokerStatistic = ref([])
const brokerLabels = ref([])
const brokerValues = ref([])
const totalBrokerCount = computed(() => brokerValues.value.reduce((sum, v) => sum + Number(v || 0), 0))

const fetchBrokerStatisticByArea = async () => {
  try {
    console.log('🚀 Gọi API thống kê môi giới theo khu vực...')
    const url =
        selectedType.value === 'HOST'
            ? '/host/statistic-by-area'
            : '/moigioi/statistic-by-area'


    const res = await api.get(url)

    console.log('📊 Data:', res.data)

    // lưu raw data
    brokerStatistic.value = res.data || []

    // mapping cho chart
    brokerLabels.value = brokerStatistic.value.map(i => i.area)
    brokerValues.value = brokerStatistic.value.map(i => i.totalBroker)

    console.log('🏷️ Labels:', brokerLabels.value)
    console.log('📈 Values:', brokerValues.value)

  } catch (error) {
    console.error('❌ Lỗi gọi thống kê môi giới:', error)

    // reset khi lỗi
    brokerStatistic.value = []
    brokerLabels.value = []
    brokerValues.value = []
  }
}

const chartData = computed(() => ({
  labels: brokerLabels.value,
  datasets: [
    {
      label: 'Số lượng môi giới',
      data: brokerValues.value,

      // 🌈 Gradient giả lập (Chart.js v3+)
      backgroundColor: 'rgba(99, 102, 241, 0.85)', // indigo-500
      hoverBackgroundColor: 'rgba(79, 70, 229, 0.95)',

      borderRadius: 10,
      barThickness: 48,
      maxBarThickness: 56
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  layout: {
    padding: {
      top: 30,
      left: 20,
      right: 20,
      bottom: 10
    }
  },

  plugins: {
    legend: {
      display: false
    },

    tooltip: {
      backgroundColor: '#111827', // gray-900
      titleColor: '#fff',
      bodyColor: '#E5E7EB',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: ctx =>
            ` ${ctx.raw} ${selectedType.value === 'HOST' ? 'chủ nhà' : 'môi giới'}`
      }
    }
  },

  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#374151',
        font: {
          size: 13,
          weight: '600'
        }
      }
    },

    y: {
      beginAtZero: true,
      suggestedMax: Math.max(...brokerValues.value) + 1, // 👈 tránh 0–1
      ticks: {
        precision: 0,
        stepSize: 1,
        color: '#6B7280',
        font: {
          size: 12
        }
      },
      grid: {
        display: false
      }
    }
  }
}
const onPageSizeChange = () => {
  pageNo.value = 0;
  fetchData();
};

const selectHost = (host) => {
  console.log('Selected host:', host);
  // Add your host selection logic here
};

watch(selectedType, () => {
  pageNo.value = 0;
  fetchData();

  console.log( selectedType.value )
  if (selectedType.value !== 'HOST') {
    console.log( "Chạy" )
    fetchTopBrokers()

  } else {
    topBrokers.value = []
  }
  fetchBrokerStatisticByArea()
});

const topBrokers = ref([])
const loadingTopBroker = ref(false)
const podiumBrokers = computed(() => topBrokers.value.slice(0, 3))
const otherBrokers = computed(() => topBrokers.value.slice(3))

const fetchTopBrokers = async () => {
  loadingTopBroker.value = true
  try {
    const res = await api.get('/moigioi/top-moi-gioi', {
      params: {
        area: filters.value.tinh   // ✅ dùng filters.tinh
      }
    })

    topBrokers.value = setTopRanks(res.data || [])
    console.log("Dữ liệu: ", topBrokers.value );
  } catch (e) {
    console.error('❌ Lỗi lấy top môi giới', e)
    topBrokers.value = []
  } finally {
    loadingTopBroker.value = false
  }
}
const getTopClass = (rank) => {
  if (rank === 1) return 'top-1'
  if (rank === 2) return 'top-2'
  if (rank === 3) return 'top-3'
  return ''
}


const fetchData = async () => {
  loading.value = true;
  try {
    const apiUrl =
        selectedType.value === 'HOST'
            ? '/host/list'
            : '/moigioi/list';

    const res = await api.post(apiUrl, {
      ...filters.value,
      pageNo: pageNo.value,
      pageSize: pageSize.value
    });

    data.value = res.data?.content ?? res.data ?? [];
    totalRecords.value = res.data?.page.totalElements ?? data.value.length;
    totalPages.value = res.data?.page.totalPages ?? Math.ceil(totalRecords.value / pageSize.value);
  } catch (e) {
    console.error(e);
    data.value = [];
    totalRecords.value = 0;
    totalPages.value = 1;
  } finally {
    loading.value = false;
  }
};

// Auto fetch when filters change
watch([pageNo, pageSize], fetchData, { immediate: true });


onMounted(() => {
  // Add Font Awesome if not already loaded
  if (!document.querySelector('#font-awesome')) {
    const link = document.createElement('link');
    link.id = 'font-awesome';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }
  fetchBrokerStatisticByArea()
});

const toggleStatus = async (item) => {
  // lưu trạng thái cũ để rollback nếu lỗi
  const oldStatus = item.status;

  // update UI trước cho mượt
  item.status = !item.status;

  try {
    const res = await api.put(`/host/${item.id}/toggle-status`);

    // nếu backend trả status mới
    if (typeof res.data === 'boolean') {
      item.status = res.data;
    }
  } catch (err) {
    console.error("Toggle status error:", err);

    // rollback UI nếu lỗi
    item.status = oldStatus;

    alert("Không thể đổi trạng thái host");
  }
};
const viewHostDetail = async (id) => {
  const detail = await fetchHostDetail(id);
  if (detail) {
    console.log("HOST DETAIL:", detail);
    selectedHost.value = detail;
    showDetail.value = true;
  }
};



const showDetail = ref(false)
const selectedHost = ref(null)
const showUpdate = ref(false)

const fetchHostDetail = async (id) => {
  try {
    const url =
        selectedType.value === 'HOST'
            ? `/host/${id}`
            : `/moigioi/${id}`;

    const res = await api.get(url);
    return res.data;
  } catch (e) {
    console.error("Lỗi lấy chi tiết:", e);
    return null;
  }
};


const openUpdateHost = async (id) => {
  const detail = await fetchHostDetail(id);
  if (detail) {
    selectedHost.value = detail;
    showUpdate.value = true;
  }
};


import { confirmYesNo, showCenterSuccess, showCenterError } from '/src/assets/js/alertService.js'
import NotificationBell from "../NotificationBell.vue";

/* =========================
   XÓA HOST
========================= */
const deleteHost = (item) => {
  const isHost = selectedType.value === 'HOST'
  const label = isHost ? 'chủ nhà' : 'môi giới'
  const apiUrl = `/host/delete/${item.id}`

  confirmYesNo(
      "Xác nhận xóa",
      `
<div style="
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
">
  <p>Bạn có chắc chắn muốn <b>xóa ${label}</b>:</p>
  <p><b>${item.fullName}</b></p>
  <p class="text-danger small">
    ⚠ Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
  </p>
</div>
`,
      async () => {
        try {
          await api.delete(apiUrl)

          showCenterSuccess(
              "Xóa thành công",
              `${label.charAt(0).toUpperCase() + label.slice(1)} và toàn bộ dữ liệu liên quan đã được xóa`
          )

          await fetchData() // reload bảng
        } catch (e) {
          showCenterError(
              "Không thể xóa",
              "Vui lòng kiểm tra dữ liệu liên quan"
          )
        }
      }
  )
}

</script>

<style scoped>


.table-header-purple th {
  background-color: #e9e8ff; /* tím pastel */
  color: #2e2b5f;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #d6d4ff;
  vertical-align: middle;
}

/* =========================
   BIỂU ĐỒ THỐNG KÊ MÔI GIỚI
   ========================= */
.broker-chart-panel {
  margin-top: 16px;
  padding: 18px 20px 22px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  color: #0f172a;
}

.broker-chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 16px;
}

.chart-kicker {
  font-size: 11px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: #6366f1;
  margin-bottom: 6px;
}

.chart-title {
  margin: 0 0 6px;
  font-weight: 800;
  color: #111827;
}

.chart-subtitle {
  margin: 0;
  color: #4b5563;
  font-size: 13px;
}

.chart-statistics {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stat-chip {
  padding: 10px 14px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 130px;
  border: 1px solid rgba(99, 102, 241, 0.15);
  background: #f8fafc;
}

.stat-chip .label {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 10px;
  color: #6b7280;
}

.stat-chip .value {
  font-size: 22px;
  color: #111827;
}

.stat-chip.primary {
  background: #eef2ff;
}

.stat-chip.muted {
  background: #f9fafb;
}

.broker-chart-wrapper {
  position: relative;
  min-height: 340px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 16px 18px;
  overflow: hidden;
}

.broker-chart-wrapper canvas {
  max-height: 300px;
}

.chart-empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: #4b5563;
  text-align: left;
}

.chart-empty-state .empty-icon {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #eef2ff;
  display: grid;
  place-items: center;
  color: #6366f1;
  font-size: 22px;
}

@media (max-width: 992px) {
  .broker-chart-header {
    flex-direction: column;
  }

  .chart-statistics {
    width: 100%;
  }
}



/* FIX lệch địa chỉ */
.address-cell {
  vertical-align: middle !important;
}

.address-wrap {
  display: flex;
  align-items: center;   /* 👈 FIX CHÍNH */
  line-height: 1.4;
}

.address-wrap i {
  flex-shrink: 0;
}

.host-list-container {
  background: #f5f7fa;
  min-height: 100vh;
}

/* Filter Section */
.filter-section {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.filter-section:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

/* Table Section */
.table-section {
  border-radius: 12px;
  overflow: hidden;
}

.table-row-hover {
  transition: all 0.2s ease;
  cursor: pointer;
}

.table-row-hover:hover {
  background-color: rgba(13, 110, 253, 0.05) !important;
  transform: translateY(-1px);
}

.table-row-hover:hover td {
  border-color: rgba(13, 110, 253, 0.1);
}

/* Avatar */
.avatar-sm {
  width: 32px;
  height: 32px;
}

.avatar-initial {
  width: 100%;
  height: 100%;
  font-size: 12px;
  font-weight: 600;
  background-color: #2563eb;
  color: #fff;
}

/* Badges */
.badge {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Gender */
.badge-gender {
  padding: 5px 12px;
}

.badge-gender.male {
  background-color: #2563eb;
  color: white;
}

.badge-gender.female {
  background-color: #db2777;
  color: white;
}

/* Status */
.badge-status.active {
  background-color: #059669;
  color: white;
}

.badge-status.inactive {
  background-color: #6b7280;
  color: white;
}

/* Asset */
.badge-asset {
  background-color: #7c3aed;
  color: white;
  box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);
}

/* Status Toggle */
.status-toggle {
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.status-toggle:checked {
  background-color: #059669;
  border-color: #059669;
}

/* Empty State */
.empty-state {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.empty-state:hover {
  opacity: 1;
}

/* Address Cell */
.address-cell {
  max-width: 250px;
}

/* Pagination Buttons */
.btn-outline-secondary {
  border-color: #dee2e6;
  color: #6c757d;
}

.btn-outline-secondary:hover:not(:disabled) {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(13, 110, 253, 0.2);
}

.btn-outline-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Table Headers */
th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: #64748b;
}

/* Custom Scrollbar for table */
.table-responsive::-webkit-scrollbar {
  height: 6px;
}

.table-responsive::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.table-responsive::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animation for loading */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table-row-hover {
  animation: fadeIn 0.3s ease-out;
}

/* FILTER LABEL ICONS */
.filter-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: #334155;
}

/* semantic colors */
.text-primary {
  color: #2563eb !important;
}
.text-rose {
  color: #db2777 !important;
}
.text-emerald {
  color: #07eca5 !important;
}
.text-violet {
  color: #fcdb07 !important;
}
.text-orange {
  color: #ea580c !important;
}
/* STATUS TOGGLE – custom size */
.status-toggle {
  width: 56px;          /* 👈 track dài hơn */
  height: 22px;
  cursor: pointer;
  background-color: #e5e7eb;
  border-color: #e5e7eb;
}

/* nút tròn (handle) */
/* bản nhỏ gọn hơn */
.status-toggle {
  width: 52px;
  height: 20px;
}
.status-toggle::before {
  width: 14px;
  height: 14px;
}
.status-toggle:checked::before {
  transform: translateX(28px);
}

/* =========================
   TABLE ICON COLORS
   ========================= */

/* Email */
.icon-email {
  color: #f6d600; /* blue */
}

/* Phone */
.icon-phone {
  color: #059669; /* emerald */
}

/* Address */
.icon-address {
  color: #ea580c; /* orange */
}

/* Asset */
.icon-asset {
  color: #f8f6f6; /* violet */
}

/* Icon hover nhẹ khi hover row */
.table-row-hover:hover .icon-email,
.table-row-hover:hover .icon-phone,
.table-row-hover:hover .icon-address,
.table-row-hover:hover .icon-asset {
  filter: brightness(0.85);
}
.filter-purple {
  background: linear-gradient(
      135deg,
      #3b3b8f 0%,     /* tím đậm */
      #4b3dfa 100%   /* tím xanh */
  );
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}
.btn-view,
.btn-edit,
.btn-delete {
  padding: 4px 8px;
  border-radius: 10px;          /* CỐ ĐỊNH */
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}


/* icon */
/* =========================
   RESET CHUNG CHO 2 NÚT
========================= */
.btn-view,
.btn-edit,
.btn-delete {
  padding: 6px 10px;
  border-radius: 12px;            /* BO GÓC CỐ ĐỊNH */
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;      /* NỀN LUÔN CÓ */
  border: 1px solid #e5e7eb;
  transition: all 0.18s ease;
}

/* =========================
   VIEW BUTTON – XANH
========================= */
.btn-view i {
  color: #1d4ed8;                 /* xanh đậm */
  font-size: 13px;
}

/* hover */
.btn-view:hover {
  background-color: #dbeafe;
  border-color: #bfdbfe;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.15);
}

.btn-view:hover i {
  color: #1e40af;
}

/* active click */
.btn-view:active {
  transform: scale(0.96);
}

/* =========================
   EDIT BUTTON – VÀNG
========================= */
.btn-edit i {
  color: #d97706;                 /* vàng đậm */
  font-size: 13px;
}

.btn-edit:hover {
  background-color: #fef3c7;
  border-color: #fde68a;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(217, 119, 6, 0.15);
}

.btn-edit:hover i {
  color: #b45309;
}

.btn-edit:active {
  transform: scale(0.96);
}

/* =========================
   DELETE BUTTON – ĐỎ
========================= */
.btn-delete i {
  color: #dc2626;                 /* đỏ đậm */
  font-size: 13px;
}

/* hover */
.btn-delete:hover {
  background-color: #fee2e2;
  border-color: #fecaca;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 38, 38, 0.15);
}

.btn-delete:hover i {
  color: #b91c1c;
}

/* active click */
.btn-delete:active {
  transform: scale(0.96);
}

/* TOP BROKER PODIUM */
.top-broker-podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

/* CARD – to hơn, dáng dọc 6:4 */
.broker-card {
  width: var(--card-size, 280px);
  background: var(--card-bg, #ffffff);
  text-align: center;
  border-radius: 24px;
  padding: 28px 20px 28px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: flex-end;
  transform: scale(var(--scale, 1));
  transform-origin: bottom center;
  transition: transform 0.2s ease;
}

.podium-card {
  --card-size: 280px;
  --scale: 1;
  --order: 0;
  order: var(--order);
}

/* AVATAR – viền xanh ngoài */
.avatar-wrapper {
  position: relative;
  width: 172px;
  height: 172px;
  border-radius: 50%;
  background: #2563eb;        /* xanh */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* VÒNG TRẮNG Ở GIỮA (pseudo-element) */
.avatar-wrapper::before {
  content: '';
  position: absolute;
  width: 163px;
  height: 163px;
  border-radius: 50%;
  background: #ffffff;
}

/* ẢNH – nằm trong vòng trắng */
.avatar-img {
  position: relative;
  width: 155px;
  height: 155px;
  border-radius: 50%;
  object-fit: cover;
  background: #f1f1f1;
}


.badge-icon {
  position: absolute;
  bottom: 0px;
  right: 5px;
  width: 48px !important;
  height: 48px !important;
}
/* base */
.top-text {
  display: block;          /* 👈 BLOCK thật */
  margin-bottom: 10px;     /* 👈 đẩy avatar xuống */

  font-weight: 900;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* podium ranks */
.podium-card.rank-1 {
  --card-size: 300px;
  --scale: 1;
  --order: 2;
  --card-bg: #e6f1ff;
}

.podium-card.rank-2 {
  --card-size: 260px;
  --scale: 0.94;
  --order: 1;
  --card-bg: #ede9fe;
}

.podium-card.rank-3 {
  --card-size: 240px;
  --scale: 0.88;
  --order: 3;
  --card-bg: #e3f7f5;
}


/* TOP 1 */
.top-text.top-1 {
  font-size: 36px;
  background-image: linear-gradient(
      120deg,
      #F59E0B 20%,
      #FDE68A 35%,
      #F59E0B 50%,
      #FBBF24 65%,
      #F59E0B 80%
  );
  text-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
}


/* TOP 2 */
.top-text.top-2 {
  font-size: 30px;
  background-image: linear-gradient(
      120deg,
      #6B7280 20%,
      #E5E7EB 40%,
      #9CA3AF 60%,
      #6B7280 80%
  );
  text-shadow: 0 0 10px rgba(156, 163, 175, 0.3);
  animation-duration: 3.5s;
}


/* TOP 3 */
.top-text.top-3 {
  font-size: 24px;
  background-image: linear-gradient(
      120deg,
      #B45309 20%,
      #FCD34D 45%,
      #92400E 70%
  );
  text-shadow: 0 0 8px rgba(180, 83, 9, 0.3);
  animation-duration: 4s;
}


@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
.top-text {
  font-weight: 800;
  position: relative;
  display: inline-block;
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  animation: shimmer 3s linear infinite;
}



</style>