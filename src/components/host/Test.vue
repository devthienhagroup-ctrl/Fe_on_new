<template>
  <div class="container-fluid py-4 host-list-container">
    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="mb-1 fw-bold text-dark">Danh sách Host</h4>
        <p class="text-muted mb-0">Quản lý thông tin các chủ nhà trong hệ thống</p>
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
              <th class="py-3 border-bottom text-center">Tài sản</th>
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
                    <i class="fas fa-home icon-asset me-1"></i>
                    {{ item.countAsset || 0 }}
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
              <td colspan="8" class="text-center py-5">
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
    <div class="d-flex justify-content-between align-items-center mt-4">
      <div class="text-muted small">
        Hiển thị <span class="fw-bold">{{ data.length }}</span> trong tổng số
        <span class="fw-bold">{{ totalRecords }}</span> bản ghi
      </div>

      <div class="d-flex align-items-center gap-3">
        <div class="d-flex align-items-center gap-2">
          <span class="text-muted small">Hiển thị</span>
          <select
              v-model="pageSize"
              class="form-select form-select-sm w-auto"
              style="min-width: 70px;"
              @change="onPageSizeChange"
          >
            <option v-for="s in [5, 10, 20, 50]" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
          <span class="text-muted small">bản ghi</span>
        </div>

        <div class="d-flex align-items-center gap-2">
          <span class="text-muted small me-2">
            Trang {{ pageNo + 1 }} / {{ totalPages }}
          </span>

          <div class="btn-group btn-group-sm" role="group">
            <!-- FIRST PAGE -->
            <button
                class="btn btn-outline-secondary"
                :disabled="pageNo === 0"
                title="Trang đầu"
                @click="goFirstPage"
            >
              <i class="fas fa-angles-left"></i>
            </button>

            <!-- PREV PAGE -->
            <button
                class="btn btn-outline-secondary"
                :disabled="pageNo === 0"
                title="Trang trước"
                @click="pageNo--"
            >
              <i class="fas fa-chevron-left"></i>
            </button>

            <!-- NEXT PAGE -->
            <button
                class="btn btn-outline-secondary"
                :disabled="pageNo >= totalPages - 1"
                title="Trang sau"
                @click="pageNo++"
            >
              <i class="fas fa-chevron-right"></i>
            </button>

            <!-- LAST PAGE -->
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
    <HostDetailModal
        v-if="showDetail"
        :host="selectedHost"
        @close="showDetail = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import api from "/src/api/api.js";
import provinces from "/src/assets/js/address.json";

const data = ref([]);
const loading = ref(false);
const totalRecords = ref(0);
const totalPages = ref(1);

const pageNo = ref(0);
const pageSize = ref(10);

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
    }
);




const onPageSizeChange = () => {
  pageNo.value = 0;
  fetchData();
};

const selectHost = (host) => {
  console.log('Selected host:', host);
  // Add your host selection logic here
};



const fetchData = async () => {
  loading.value = true;
  try {
    const res = await api.post("/host/list", {
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
  try {
    const res = await api.get(`/host/${id}`);
    console.log("HOST DETAIL:", res.data);
    selectedHost.value = res.data
    showDetail.value = true
  } catch (e) {
    console.error("Lỗi lấy chi tiết host:", e);
  }
};

import HostDetailModal from './HostDetailModal.vue'

const showDetail = ref(false)
const selectedHost = ref(null)


import { confirmYesNo, showCenterSuccess, showCenterError } from '/src/assets/js/alertService.js'

/* =========================
   XÓA HOST
========================= */
const deleteHost = (item) => {
  confirmYesNo(
      "Xác nhận xóa",
      `
<div style="
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
">
  <p>Bạn có chắc chắn muốn <b>xóa chủ nhà</b>:</p>
  <p><b>${item.fullName}</b></p>
  <p class="text-danger small">
    ⚠ Tất cả tài sản, dữ liệu liên quan sẽ bị xóa vĩnh viễn.
  </p>
</div>
`
      ,
      async () => {
        try {
          await api.delete(`/host/delete/${item.id}`);

          showCenterSuccess(
              "Xóa thành công",
              "Host và toàn bộ dữ liệu liên quan đã được xóa"
          );

          await fetchData(); // reload bảng
        } catch (e) {
          showCenterError( "Không thể xóa", "Vui lòng kiểm tra dữ liệu liên quan")
        }
      }
  );
};
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


</style>