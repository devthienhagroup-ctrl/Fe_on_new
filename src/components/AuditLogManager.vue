<template>
  <div class="d-flex flex-column h-100">
    <!-- Header -->
    <div
        class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2 border-bottom"
        style="border-color: rgba(0, 0, 0, 0.3)"
    >
      <h5 class="fw-bold text-dark mb-0 d-flex align-items-center">
        <i class="fa-solid fa-clock-rotate-left text-primary me-2"></i> Nhật ký hoạt động
      </h5>

      <div class="d-flex align-items-center justify-content-end gap-2">
        <button
            class="header-menu-toggle"
            title="Ẩn/hiện menu"
            @click="sidebar.toggle()"
        >
          <i class="fa-solid fa-bars"></i>
          <span class="d-none d-md-inline">Menu</span>
        </button>
        <NotificationBell />
        <div class="d-flex flex-column align-items-end text-end">
          <div class="fw-semibold text-dark">{{ info.fullName }}</div>
        </div>

        <img
            v-if="info.avatarUrl"
            :src="' https://s3.cloudfly.vn/thg-storage/uploads-public/' + info.avatarUrl"
            alt="avatar"
            class="rounded-circle border"
            style="width: 36px; height: 36px; object-fit: cover;"
        />
        <div v-else class="avatar-circle">
          {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
        </div>
      </div>
    </div>

    <!-- Bộ lọc -->
    <div class="main-layout px-3">
      <div class="card border-0 shadow-sm rounded-4 mb-3">
        <div class="card-body py-3 px-4">
          <div class="row g-3 align-items-center">
            <div class="col-md-3 col-6">
              <label class="form-label small mb-1 fw-medium">Hoạt động</label>
              <select v-model="filters.activity" class="form-select form-select-sm">
                <option value="">-- Tất cả --</option>
                <option v-for="a in activities" :key="a" :value="a">{{ a }}</option>
              </select>
            </div>

            <div class="col-md-3 col-6">
              <label class="form-label small mb-1 fw-medium">Loại đối tượng</label>
              <select v-model="filters.targetType" class="form-select form-select-sm">
                <option value="">-- Tất cả --</option>
                <option v-for="t in targets" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>

            <div class="col-md-3 col-6">
              <label class="form-label small mb-1 fw-medium">Từ ngày</label>
              <input type="date" v-model="filters.startDate" class="form-control form-control-sm" />
            </div>

            <div class="col-md-3 col-6">
              <label class="form-label small mb-1 fw-medium">Đến ngày</label>
              <input type="date" v-model="filters.endDate" class="form-control form-control-sm" />
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <div>
              <label class="form-label small mb-1 fw-medium me-2">Kích thước trang</label>
              <input
                  type="number"
                  v-model.number="pagination.size"
                  class="form-control form-control-sm d-inline-block"
                  style="width: 80px"
                  min="5"
                  max="100"
                  step="5"
                  @change="onSizeChange"
              />
            </div>
            <div>
              <button class="btn btn-sm btn-outline-primary me-2" @click="applyFilters">
                <i class="fa-solid fa-filter me-1"></i> Lọc
              </button>
              <button
                  v-if="authStore.listAuthority.includes('AUDIT_DELETE')"
                  class="btn btn-sm btn-outline-danger"
                  :disabled="!selectedIds.length"
                  @click="confirmDelete"
              >
                <i class="fa-solid fa-trash me-1"></i> Xóa đã chọn ({{ selectedIds.length }})
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bảng nhật ký -->
      <div
          class="card border-0 shadow-sm rounded-4 overflow-hidden flex-grow-1 d-flex flex-column position-relative"
      >
        <div v-if="isLoading" class="loading-overlay">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 small">
            <thead class="table-light">
            <tr>
              <th style="width: 4%">
                <input type="checkbox" v-model="selectAll" />
              </th>
              <th style="width: 5%">#</th>
              <th style="width: 12%">Nhân viên</th>
              <th style="width: 10%">Vai trò</th>
              <th style="width: 10%">Hoạt động</th>
              <th style="width: 12%">Loại đối tượng</th>
              <th style="width: 10%">ID</th>
              <th style="width: 15%">Thời gian</th>
              <th style="width: 10%">Địa chỉ IP</th>
              <th style="width: 12%">Thay đổi</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="logs.length === 0">
              <td colspan="10" class="text-center text-muted py-3">
                <i class="fa-regular fa-folder-open fa-lg mb-2"></i><br />
                Không có dữ liệu
              </td>
            </tr>
            <tr v-for="(log, index) in logs" :key="log.id">
              <td>
                <input type="checkbox" v-model="selectedIds" :value="log.id" />
              </td>
              <td>{{ index + 1 + pagination.pageNo * pagination.size }}</td>
              <td>{{ log.employeeName || '-' }}</td>
              <td>{{ log.userRole || '-' }}</td>
              <td>
                  <span
                      class="badge text-uppercase"
                      :class="{
                      'bg-success': log.activity === 'CREATE',
                      'bg-warning text-dark': log.activity === 'UPDATE',
                      'bg-danger': log.activity === 'DELETE',
                      'bg-info text-dark': log.activity === 'LOGIN'
                    }"
                  >{{ log.activity }}</span>
              </td>
              <td>{{ log.targetType }}</td>
              <td>{{ log.targetID }}</td>
              <td>{{ formatDateTime(log.actionTime) }}</td>
              <td>{{ log.ipAddress }}</td>
              <td>
                <button
                    class="btn btn-sm btn-outline-secondary rounded-pill px-2 py-0"
                    @click="showDiff(log)"
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Phân trang -->
        <div class="card-footer bg-light py-2 px-3 d-flex justify-content-between align-items-center">
          <div class="small text-muted">
            Trang {{ pagination.pageNo + 1 }} / {{ totalPages || 1 }} |
            Tổng <strong>{{ totalElements }}</strong> bản ghi
          </div>
          <div class="d-flex align-items-center gap-2">
            <button
                class="btn btn-sm btn-outline-secondary"
                :disabled="pagination.pageNo === 0"
                @click="toFirstPage"
            >
              <i class="fa-solid fa-angles-left"></i>
            </button>
            <button
                class="btn btn-sm btn-outline-secondary"
                :disabled="pagination.pageNo === 0"
                @click="prevPage"
            >
              <i class="fa-solid fa-angle-left"></i>
            </button>
            <button
                class="btn btn-sm btn-outline-secondary"
                :disabled="pagination.pageNo >= totalPages - 1"
                @click="nextPage"
            >
              <i class="fa-solid fa-angle-right"></i>
            </button>
            <button
                class="btn btn-sm btn-outline-secondary"
                :disabled="pagination.pageNo >= totalPages - 1"
                @click="toLastPage"
            >
              <i class="fa-solid fa-angles-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal chi tiết (Vue-controlled) -->
      <transition name="fade">
        <div v-if="showModal" class="custom-modal-backdrop" @click.self="closeDiff">
          <div class="custom-modal">
            <div class="custom-modal-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h6 class="mb-0 fw-semibold">
                <i class="fa-solid fa-code-compare me-2"></i> So sánh thay đổi
              </h6>
              <button class="btn-close btn-close-white" @click="closeDiff"></button>
            </div>
            <div class="custom-modal-body">
              <pre class="bg-light p-3 rounded-3 small text-dark" style="max-height: 400px; overflow:auto;">
Old: {{ prettyJSON(selectedLog?.oldValue) }}

New: {{ prettyJSON(selectedLog?.newValue) }}
              </pre>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import api from "../api/api.js";
import { useAuthStore } from "../stores/authStore.js";
import { useSidebarStore } from "../stores/sidebarStore.js";
import NotificationBell from "./NotificationBell.vue";

const authStore = useAuthStore();
const info = authStore.userInfo;
const sidebar = useSidebarStore();

const isLoading = ref(false);
const logs = ref([]);
const activities = ref([]);
const targets = ref([]);
const selectedIds = ref([]);
const selectedLog = ref(null);
const showModal = ref(false);

const filters = ref({
  activity: "",
  targetType: "",
  startDate: "",
  endDate: "",
});

const pagination = ref({
  pageNo: 0,
  size: 10,
});

const totalPages = ref(0);
const totalElements = ref(0);

const selectAll = computed({
  get: () =>
      logs.value.length > 0 && selectedIds.value.length === logs.value.length,
  set: (val) => {
    selectedIds.value = val ? logs.value.map((l) => l.id) : [];
  },
});

const clampSize = () => {
  if (pagination.value.size < 5) pagination.value.size = 5;
  if (pagination.value.size > 100) pagination.value.size = 100;
};

const buildParams = () => {
  const params = {
    activity: filters.value.activity || null,
    targetType: filters.value.targetType || null,
    pageNo: pagination.value.pageNo,
    size: pagination.value.size,
  };
  if (filters.value.startDate)
    params.startDate = `${filters.value.startDate}T00:00:00`;
  if (filters.value.endDate)
    params.endDate = `${filters.value.endDate}T23:59:59`;
  return params;
};

const fetchLogs = async () => {
  isLoading.value = true;
  try {
    const { data } = await api.get("/admin.thg/audit/list", {
      params: buildParams(),
      withCredentials: true,
    });
    logs.value = data?.content ?? [];
    totalPages.value = data?.page?.totalPages ?? 1;
    totalElements.value = data?.page?.totalElements ?? logs.value.length;
  } finally {
    isLoading.value = false;
  }
};

const fetchFilters = async () => {
  try {
    const [a, t] = await Promise.all([
      api.get("/admin.thg/audit/activities", { withCredentials: true }),
      api.get("/admin.thg/audit/targets", { withCredentials: true }),
    ]);
    activities.value = a.data || [];
    targets.value = t.data || [];
  } catch {}
};

const applyFilters = () => {
  pagination.value.pageNo = 0;
  fetchLogs();
};

const onSizeChange = () => {
  clampSize();
  pagination.value.pageNo = 0;
  fetchLogs();
};

const nextPage = () => {
  if (pagination.value.pageNo < (totalPages.value || 1) - 1) {
    pagination.value.pageNo++;
    fetchLogs();
  }
};
const prevPage = () => {
  if (pagination.value.pageNo > 0) {
    pagination.value.pageNo--;
    fetchLogs();
  }
};
const toFirstPage = () => {
  if (pagination.value.pageNo !== 0) {
    pagination.value.pageNo = 0;
    fetchLogs();
  }
};
const toLastPage = () => {
  const last = (totalPages.value || 1) - 1;
  if (last >= 0 && pagination.value.pageNo !== last) {
    pagination.value.pageNo = last;
    fetchLogs();
  }
};

const confirmDelete = async () => {
  const result = await Swal.fire({
    title: "Xác nhận xóa",
    text: `Xóa ${selectedIds.value.length} bản ghi?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    confirmButtonColor: "#d33",
  });
  if (!result.isConfirmed) return;

  await api.delete("/admin.thg/audit/delete", {
    data: selectedIds.value,
    withCredentials: true,
  });
  Swal.fire("Đã xóa!", "", "success");
  selectedIds.value = [];
  await fetchLogs();
};

const showDiff = (log) => {
  selectedLog.value = log;
  showModal.value = true;
};
const closeDiff = () => {
  showModal.value = false;
};

const prettyJSON = (str) => {
  if (!str) return "{}";
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
};

const formatDateTime = (dt) => {
  if (!dt) return "";
  const d = new Date(dt);
  return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

onMounted(async () => {
  clampSize();
  await fetchFilters();
  await fetchLogs();
});
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.65);
  z-index: 5;
}

.table th,
.table td {
  vertical-align: middle;
}
.badge {
  font-size: 11px;
  padding: 4px 8px;
}

/* Custom Modal */
.custom-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1055;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}
.custom-modal {
  width: 800px;
  max-width: 95%;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  animation: zoomIn 0.25s ease;
}
.custom-modal-body {
  padding: 1rem 1.5rem 1.5rem;
  max-height: 500px;
  overflow-y: auto;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes zoomIn {
  from {
    transform: scale(0.95);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.custom-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1055;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

/* Modal khung chính */
.custom-modal {
  width: 800px;
  max-width: 95%;
  background: #fff;
  border-radius: 16px; /* ✅ Bo đều 4 góc */
  overflow: hidden; /* ✅ Không cho header/footer lấn ra ngoài góc bo */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  animation: zoomIn 0.25s ease;
}

/* Header modal */
.custom-modal-header {
  padding: 0.75rem 1rem;
  background-color: #0d6efd; /* Màu primary Bootstrap */
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  border-top-left-radius: 16px;   /* ✅ Bo đều 4 góc */
  border-top-right-radius: 16px;
}

/* Nút đóng */
.custom-modal-header .btn-close {
  filter: brightness(0) invert(1);
  opacity: 0.9;
}
.custom-modal-header .btn-close:hover {
  opacity: 1;
}

/* Body modal */
.custom-modal-body {
  padding: 1rem 1.5rem 1.5rem;
  max-height: 500px;
  overflow-y: auto;
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes zoomIn {
  from {
    transform: scale(0.9);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.header-menu-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
  color: #334155;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.header-menu-toggle:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
  color: #1e293b;
}

.header-menu-toggle:active {
  transform: scale(0.98);
}
</style>
