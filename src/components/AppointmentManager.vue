<template>
  <div class="appointment-manager">

    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center px-3 pb-2"
         style="border-bottom: solid 0.5px rgba(0,0,0,0.3)">
      <h5 class="fw-bold mb-0 d-flex align-items-center gap-2">
        <i class="fa-solid fa-calendar-check text-orange fs-4"></i>
        Quản lý lịch hẹn
      </h5>

      <div class="d-flex align-items-center justify-content-end gap-2">
        <NotificationBell />
        <div class="d-flex flex-column align-items-end text-end">
          <div class="fw-semibold text-dark">{{ info.fullName }}</div>
        </div>

        <img v-if="info.avatarUrl"
             :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + info.avatarUrl"
             class="rounded-circle border"
             style="width: 36px; height: 36px; object-fit: cover;" />

        <div v-else class="avatar-circle">
          {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
        </div>
      </div>
    </div>
    <!-- CONTENT -->
    <div class="p-3">

      <!-- PAGINATION + SEARCH -->
      <div class="pagination-top d-flex align-items-center justify-content-between mb-3">

        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-orange" :disabled="page === 0" @click="goFirstPage">« Đầu</button>
          <button class="btn btn-sm btn-outline-orange" :disabled="page === 0" @click="prevPage">‹ Trước</button>

          <span class="px-2 fw-semibold">Trang {{ page + 1 }}</span>

          <button class="btn btn-sm btn-outline-orange" :disabled="items.length < size" @click="nextPage">Sau ›</button>
          <button class="btn btn-sm btn-outline-orange" :disabled="items.length < size" @click="goLastPage">Cuối »</button>
        </div>

        <div class="search-box d-flex gap-2">
          <input type="text" class="form-control form-control-sm" style="max-width: 220px"
                 placeholder="Tìm khách hàng..."
                 v-model="keyword" @keyup.enter="loadData" />
          <button class="btn btn-orange btn-sm" @click="loadData">
            <i class="fas fa-search"></i>
          </button>
        </div>
      </div>

      <!-- TABS -->
      <div class="tabs mb-3">
        <button v-if="auth.hasPermission('APPOINTMENT_VIEW_ALL')" :class="{ active: tab === 'upcoming' }" @click="changeTab('upcoming')">Chưa ghi nhận kết quả</button>
        <button v-if="auth.hasPermission('APPOINTMENT_VIEW_ALL')" :class="{ active: tab === 'past' }" @click="changeTab('past')">Đã ghi nhận kết quả</button>
        <button v-if="auth.hasPermission('APPOINTMENT_VIEW_ASSIGNED')" :class="{ active: tab === 'mine' }" @click="changeTab('mine')">Do bạn phụ trách</button>
      </div>

      <!-- FILTERS FOR TAB 2 -->
      <div v-if="tab === 'past'" class="d-flex gap-3 mb-3">

        <select v-model="filterCame" class="form-select form-select-sm" style="width:150px;">
          <option :value="null">Lên VP: Tất cả</option>
          <option :value="true">Khách lên VP</option>
          <option :value="false">Không lên VP</option>
        </select>

        <select v-model="filterBN30N" class="form-select form-select-sm" style="width:170px;">
          <option :value="null">Kết quả: Tất cả</option>
          <option value="BN30N">Đồng ý BN30N</option>
          <option value="NO">Chỉ lấy KQDG</option>
        </select>
      </div>

      <!-- FILTERS FOR TAB 3 -->
      <div v-if="tab === 'mine'" class="mb-3">

        <select v-model="mineStatus" class="form-select form-select-sm" style="width:200px;">
          <option value="upcoming">Chưa ghi nhận kết quả</option>
          <option value="done">Đã ghi nhận kết quả</option>
        </select>

        <div v-if="mineStatus === 'done'" class="d-flex gap-3 mt-2">

          <select v-model="filterCame" class="form-select form-select-sm" style="width:150px;">
            <option :value="null">Lên VP: Tất cả</option>
            <option :value="true">Khách lên VP</option>
            <option :value="false">Không lên VP</option>
          </select>

          <select v-model="filterBN30N" class="form-select form-select-sm" style="width:170px;">
            <option :value="null">Kết quả: Tất cả</option>
            <option value="BN30N">Đồng ý BN30N</option>
            <option value="NO">Chỉ lấy KQDG</option>
          </select>
        </div>
      </div>

      <!-- LIST -->
      <div class="appointment-list">

        <div v-for="item in items" :key="item.id" class="appointment-card p-3">

          <div class="row align-items-center gy-3 gx-4">

            <div class="col-auto">
              <img :src="item.customerAvatarFull" class="avatar-40" />
            </div>

            <div class="col">
              <div class="row gx-4 gy-2 align-items-center">
                <div class="col-md-2">
                  <label class="label">Khách hàng</label>
                  <div class="fw-semibold">{{ item.customerName }}</div>
                </div>

                <div class="col-md-2">
                  <label class="label">Địa chỉ</label>
                  <div>{{ fixAddress(item.assetAddress) }}</div>
                </div>

                <div class="col-md-2">
                  <label class="label">Thời gian</label>
                  <div>
                    <i class="fas fa-clock text-orange"></i>
                    {{ formatDate(item.appointmentAt) }}
                  </div>
                </div>

                <div class="col-md-2">
                  <label class="label">Chi nhánh</label>
                  <div>
                    <i class="fas fa-building text-orange"></i>
                    {{ shortBranch( item.branch )}}
                  </div>
                </div>

                <div class="col-md-2">
                  <label class="label d-block mb-1">Mục đích</label>

                  <div :class="['purpose-badge', getPurposeClass(item.purpose)]">
                    <i class="fas fa-clipboard-list me-1"></i>
                    {{ mapPurpose(item.purpose) }}
                  </div>
                </div>


                <div class="col-md-2">
                  <label class="label">Phụ trách</label>
                  <div v-if="item.employeeName">{{ item.employeeName }}</div>
                  <div v-else class="text-secondary fst-italic small">Chưa gán</div>
                </div>
              </div>

              <!-- Appointment Result SHOW -->
              <div v-if="expandedRowId === item.id" class="mt-3 p-2 bg-light rounded border">

                <div><strong>Kết quả:</strong></div>

                <div>- Khách lên VP:
                  <strong :class="item.appointmentResult.cameToOffice ? 'text-success' : 'text-danger'">
                    {{ item.appointmentResult.cameToOffice ? 'Có' : 'Không' }}
                  </strong>
                </div>

                <div>- Mô tả: {{ item.appointmentResult.note }}</div>

                <div>- Bán nhanh 30N:
                  <strong :class="item.appointmentResult.agreeQuickSale ? 'text-orange' : ''">
                    {{ item.appointmentResult.agreeQuickSale? 'Khách đồng ý BN30N' : "Không" }}
                  </strong>
                </div>

              </div>

            </div>

            <!-- ACTIONS -->
            <div class="col-auto">

              <!-- GÁN -->
              <button v-if="!item.employeeName && auth.hasPermission('APPOINTMENT_ASSIGN')"
                      class="btn btn-sm btn-outline-orange"
                      @click="openAssignModal(item)">
                <i class="fas fa-user-plus"></i> Gán
              </button>

              <!-- GHI KẾT QUẢ -->
              <button v-else-if="!item.appointmentResult && ( auth.hasPermission('APPOINTMENT_RESULT_ALL') || auth.hasPermission('APPOINTMENT_RESULT_ASSIGNED'))"
                      class="btn btn-sm btn-outline-success"
                      @click="openUpdateModal(item)">
                <i class="fas fa-edit"></i> Ghi kết quả
              </button>

              <!-- XEM KẾT QUẢ -->
              <button v-else
                      class="btn btn-sm btn-outline-primary"
                      @click="toggleResult(item)">
                <i class="fas fa-eye"></i>
                {{ expandedRowId === item.id ? "Ẩn kết quả" : "Xem kết quả" }}
              </button>


            </div>

          </div>
        </div>

      </div>

      <!-- MODALS -->
      <AssignEmployeeModal
          v-if="showAssignModal"
          :appointment="selectedAppointment"
          @close="showAssignModal = false"
          @assigned="loadData" />

      <UpdateAppointmentModal
          v-if="showUpdateModal"
          :appointment="selectedAppointment"
          @close="showUpdateModal = false"
          @updated="loadData" />


    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "/src/api/api.js";
import NotificationBell from "/src/components/NotificationBell.vue";
import { useAuthStore } from "/src/stores/authStore.js";
import AssignEmployeeModal from "./AssignEmployeeModal.vue";
import UpdateAppointmentModal from "./UpdateAppointmentModal.vue";
import { showWarning } from "/src/assets/js/alertService.js";



/* NEW STATE */
const filterCame = ref(null);
const filterBN30N = ref(null);
const mineStatus = ref("upcoming");

function mapPurpose(code) {
  if (!code) return "—";
  switch (code.trim().toUpperCase()) {
    case "BN30N": return "Bán nhanh 30N";
    case "NKQ": return "Nhận KQ ĐG";
    default: return code;
  }
}
function shortBranch(address) {
  if (!address) return "";

  const parts = address.split(",");
  const lastTwo = parts.slice(-2).map(p => p.trim());
  return lastTwo.join(", ");
}

const auth = useAuthStore();
const info = auth.userInfo;

const tab = ref("upcoming");

const keyword = ref("");
const items = ref([]);
const page = ref(0);
const size = 10;
const totalPages = ref(50);
const expandedRowId = ref(null);

function toggleResult(item) {
  expandedRowId.value = expandedRowId.value === item.id ? null : item.id;
}



const showAssignModal = ref(false);
const showUpdateModal = ref(false);
const showViewModal = ref(false);
const selectedAppointment = ref(null);

function fixAddress(address) {
  return address ? address.replace(/\//g, ", ") : "";
}

function changeTab(t) {
  tab.value = t;
  page.value = 0;
  filterCame.value = null;
  filterBN30N.value = null;
  mineStatus.value = "upcoming";
  expandedRowId.value = null;
  loadData();
}


// Khi đổi mineStatus (tab 3)
watch(mineStatus, () => {
  // reset filter khi đổi trạng thái
  filterCame.value = null;
  filterBN30N.value = null;
  page.value = 0;
  loadData();
});

// Khi đổi 2 filter (tab 2 + tab 3 trạng thái done)
watch([filterCame, filterBN30N], () => {
  // Chỉ load lại khi đang ở tab "past"
  // hoặc tab "mine" + mineStatus = done
  if (tab.value === "past" || (tab.value === "mine" && mineStatus.value === "done")) {
    page.value = 0;
    loadData();
  }
});
function getPurposeClass(code) {
  if (!code) return "purpose-default";

  switch (code.trim().toUpperCase()) {
    case "BN30N":
      return "purpose-bn30n";        // Bán nhanh
    case "NKQ":
      return "purpose-nkq";          // Nhận kết quả
    default:
      return "purpose-default";
  }
}

async function loadData() {
  try {
    let url = "";

    if (tab.value === "upcoming") {
      url = `/admin/customer-appointment/upcoming?search=${keyword.value}&page=${page.value}&size=${size}`;
    }
    else if (tab.value === "past") {
      url = `/admin/customer-appointment/past?search=${keyword.value}&page=${page.value}&size=${size}`;
    }
    else {
      url = `/admin/customer-appointment/mine?search=${keyword.value}&page=${page.value}&size=${size}&mineStatus=${mineStatus.value}`;
    }

    /* Add filters */
    if (filterCame.value !== null)
      url += `&cameToOffice=${filterCame.value}`;

    if (filterBN30N.value !== null) {
      url += `&agreeQuickSale=${filterBN30N.value === "NO" ? "null" : filterBN30N.value}`;
    }

    const res = await api.get(url);

    items.value = res.data.map(item => ({
      ...item,
      customerAvatarFull: item.customerAvatar
          ? `https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${item.customerAvatar}`
          : "/imgs/default-user.png",
    }));

  } catch (e) {
    console.error(e);
    showWarning("Không thể tải danh sách!");
  }
}

function nextPage() { page.value++; loadData(); }
function prevPage() { if (page.value > 0) page.value--; loadData(); }
function goFirstPage() { page.value = 0; loadData(); }
function goLastPage() { page.value = totalPages.value - 1; loadData(); }

function openAssignModal(item) {
  selectedAppointment.value = item;
  showAssignModal.value = true;
}

function openUpdateModal(item) {
  selectedAppointment.value = item;
  showUpdateModal.value = true;
}


function openViewModal(item) {
  selectedAppointment.value = item;
  showViewModal.value = true;
}

function formatDate(dt) {
  return dt.replace("T", " lúc ");
}

onMounted(() => {
  if (auth.hasPermission('APPOINTMENT_VIEW_ALL')) {
    tab.value = 'upcoming';
  } else {
    tab.value = 'mine';
  }
  loadData();
});

</script>

<!-- VIEW RESULT MODAL INLINE -->
<style scoped>
.text-orange { color: #ff7e29 !important; }
.btn-orange { background: #ff7e29; color: #fff; }

.btn-outline-orange {
  border: 1px solid #ff7e29;
  color: #ff7e29;
}
.btn-outline-orange:hover {
  background: #ff7e29;
  color: #fff;
}

/* Header giữ nguyên */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0,0,0,0.2);

  /* NGĂN XUỐNG DÒNG */
  flex-wrap: nowrap;
  width: 100%;
  overflow: hidden;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;

  /* NGĂN XUỐNG DÒNG */
  flex-wrap: nowrap;
  white-space: nowrap;
}

.user-box {
  display: flex;
  flex-direction: column;

  /* NGẮN LẠI, TRÁNH ĐẨY XUỐNG */
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar,
.avatar-circle {
  flex-shrink: 0;             /* Không co lại */
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

/* Giảm width bell */
.header-right > * {
  flex-shrink: 0;
}


.avatar, .avatar-circle {
  width:36px;
  height:36px;
  border-radius:50%;
  object-fit:cover;
}

.avatar-circle {
  background:#ff7e29;
  color:white;
  display:flex;
  justify-content:center;
  align-items:center;
  font-weight:bold;
}

/* Avatar cho khách và nhân viên */
.avatar-40 {
  width:40px;
  height:40px;
  border-radius:50%;
  object-fit:cover;
}

.avatar-30 {
  width:30px;
  height:30px;
  border-radius:50%;
  object-fit:cover;
}

/* Label */
.label {
  font-size: 12px;
  color: #777;
}

.appointment-card {
  background:#fff;
  border-radius:10px;
  box-shadow:0 2px 6px rgba(0,0,0,0.1);
}

.tabs {
  display:flex;
  gap:10px;
}
.tabs button {
  padding:6px 16px;
  border: none;
  background:#eee;
  border-radius:6px;
}
.tabs button.active {
  background:#ff7e29;
  color:#fff;
}

.pagination-top {
  border-bottom:1px solid #ddd;
  padding-bottom:8px;
}

.tabs button.active {
  background: #ff9f43;
  color: white;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 380px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.purpose-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 20px;       /* Bo tròn 2 đầu */
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
}

/* BN30N - màu cam nổi bật */
.purpose-bn30n {
  background: rgba(255, 159, 67, 0.15);
  color: #ff7e29;
  border: 1px solid #ff9f43;
}

/* NKQ - màu xanh dương */
.purpose-nkq {
  background: rgba(52, 152, 219, 0.15);
  color: #2980b9;
  border: 1px solid #3498db;
}

</style>
