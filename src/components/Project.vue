<template>
  <div class=" container-build pb-4 bg-light min-vh-90 danh-sach-du-an">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2 " style="border-bottom: solid 0.5px rgba(0,0,0,0.3)">
      <h5 class="fw-bold mb-0 d-flex align-items-center">
        <button
            v-if="canCreateProject"
            @click="goToCreateProject"
            class="btn border border-primary rounded-circle d-flex align-items-center justify-content-center  me-2"
            style="width: 40px; height: 40px;"
        >
          <i class="fa-solid fa-plus text-primary fs-5"></i>
        </button>
        Quản lý dự án
      </h5>

      <div class="d-flex align-items-center justify-content-end gap-2">
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
    <!-- Tabs -->
    <!-- Tabs -->
    <div class="tabs-wrapper d-flex align-items-center justify-content-between border-bottom pb-2  px-3">
      <!-- Thanh cuộn tab -->
      <div ref="tabContainer" class="tabs-du-an flex-grow-1 overflow-hidden">
        <div class="d-flex gap-4 small text-muted fw-medium px-2 inner-tabs">
      <span
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-item', { active: activeTab === tab }]"
          @click="setActiveTab(tab)"
      >
        {{ tab.label }} ( {{tab.count}} )
      </span>
        </div>
      </div>

      <!-- Nút cuộn -->
      <div class="scroll-controls d-flex align-items-center ms-2">
        <button class="btn-arrow" @click="scrollTabs('left')" :disabled="isAtStart">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button class="btn-arrow" @click="scrollTabs('right')" :disabled="isAtEnd">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>


    <!-- Toolbar -->
    <div class="toolbar d-flex align-items-center flex-wrap mb-3 px-3">

      <!-- Hiển thị số bản ghi -->
      <div class="d-flex align-items-center me-3 small text-muted">
        Hiển thị
        <input
            type="number"
            min="1"
            :max="total"
            v-model.number="size"
            class="inputNumber form-control-sm text-center mx-1 border rounded px-1"
            style="width: 55px"
        />
        / <b>{{ total }}</b> bản ghi
      </div>

      <!-- Phân trang -->
      <div class="d-flex align-items-center me-3">
        <button class="btn btn-sm btn-light border me-1" @click="goToFirstPage" :disabled="page === 1">
          <i class="fa-solid fa-backward-step"></i>
        </button>

        <button class="btn btn-sm btn-light border me-2" @click="prevPage" :disabled="page === 1">
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <span class="small text-muted">{{ pageString }}</span>

        <button class="btn btn-sm btn-light border ms-2 me-1" @click="nextPage" :disabled="page === totalPages">
          <i class="fa-solid fa-chevron-right"></i>
        </button>

        <button class="btn btn-sm btn-light border" @click="goToLastPage" :disabled="page === totalPages">
          <i class="fa-solid fa-forward-step"></i>
        </button>
      </div>

      <!-- Tìm kiếm -->
      <div class="d-flex align-items-center me-3">
        <input
            type="text"
            class="form-control form-control-sm me-2"
            placeholder="Nhập tên nhân sự cần tìm..."
            style="width: 200px"
            v-model="search"
        />
        <button class="btn btn-primary btn-sm" @click="getProjects">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      <!-- Bộ lọc -->
      <div class="d-flex align-items-center gap-2 small flex-grow-1 justify-content-end">
        <label class="d-flex align-items-center flex-nowrap mb-0">
          <span class="me-1">Tiến độ:</span>
          <select
              v-model="selectedProgress"
              class="form-select form-select-sm w-auto"
              @change="emitChange"
          >
            <option :value="null">Tất cả</option>
            <option value="TRE">Trễ</option>
            <option value="SOM">Sớm</option>
            <option value="DUNG">Đúng</option>
          </select>
        </label>


        <label class="d-flex align-items-center flex-nowrap mb-0">
          <span class="me-1">Ưu tiên:</span>
          <select
              v-model="selectedPriority"
              class="form-select form-select-sm w-auto"
              @change="emitChange"
          >
            <option :value="null">Tất cả</option>
            <option :value="true">Ưu tiên</option>
            <option :value="false">Không ưu tiên</option>
          </select>
        </label>


        <label class="d-flex align-items-center flex-nowrap mb-0">
          <span class="me-1">Sắp xếp:</span>
          <select
              v-model="selectedSort"
              class="form-select form-select-sm w-auto"
              @change="emitChange"
          >
            <option :value="defaultSort">Mặc định</option>
            <option :value="{ sortField: 'price', sortDir: 'ASC' }">Giá tăng dần</option>
            <option :value="{ sortField: 'price', sortDir: 'DESC' }">Giá giảm dần</option>
            <option :value="{ sortField: 'createdDate', sortDir: 'DESC' }">Ngày tạo mới nhất</option>
            <option :value="{ sortField: 'createdDate', sortDir: 'ASC' }">Ngày tạo xa nhất</option>
            <option :value="{ sortField: 'expectedEndDate', sortDir: 'DESC' }">Deadline xa nhất</option>
            <option :value="{ sortField: 'expectedEndDate', sortDir: 'ASC' }">Deadline gần nhất</option>
          </select>
        </label>

      </div>
    </div>


    <!-- Table -->
    <div class="px-4" >
    <div class="table-responsive bg-white shadow-sm" style="border-radius: 15px">
      <table class="table align-middle mb-0 text-secondary custom-table">
        <thead class="bg-light text-muted">
        <tr>
          <th class="text-start ten-du-an">Tên dự án</th>
          <th class="text-center nguoiTao">N.Tạo</th>
          <th class="text-start">Trạng thái</th>
          <th class="text-center">Effor</th>
          <th class="text-center">Ngày tạo</th>
          <th class="text-center tg-batDau">TG Bắt đầu</th>
          <th class="text-center">KếtThucDK</th>
          <th class="text-start gia-tien">Giá tiền</th>
          <th class="text-start thuc-hien">Thực hiện</th>
          <th class="text-start tien-do-col">Tiến độ</th>
          <th class="text-center">Ưu tiên</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(pro, index) in projects" :key="index" @click="$router.push(`/-thg/du-an/hang-muc/${pro.projectId}`)" class="project-row">
          <td class="text-start text-truncate" :title="pro.projectName">{{ pro.projectName }}</td>
          <td class="align-middle text-center nguoiTao">
            <div v-if="pro.createdBy.avatar != null" class="avatar-wrapper">
              <img
                  class="avatar-small"
                  :src="` https://s3.cloudfly.vn/thg-storage/uploads-public/${pro.createdBy.avatar}`"
                  alt="Avatar"
              >
              <span class="tooltip1">{{ pro.createdBy.fullName }} - {{pro.createdBy.email}}</span>
            </div>
            <span v-else class="text-muted fst-italic">NaN</span>
          </td>
          <td class="text-start">
            <span
                class="badge fw-semibold px-2 py-1"
                :class="{
                'bg-secondary-subtle text-secondary': pro.status === 'Mới khởi tạo',
                'bg-info-subtle text-primary': pro.status === 'Đang triển khai',
                'bg-warning-subtle text-warning': pro.status === 'Tạm ngừng',
                'bg-success-subtle text-success': pro.status === 'Hoàn thành',
                'bg-danger-subtle text-danger': pro.status === 'Hủy bỏ'
              }"
            >
              {{ pro.status }}
            </span>
                    </td>
          <td class="text-center">{{ pro.effort }}</td>
          <td class="text-center">{{ pro.createdDate }}</td>
          <td class="text-center">{{ pro.startDate }}</td>
          <td class="text-center">{{ pro.endDate }}</td>
          <td class="text-start">{{ pro.projectPrice.toLocaleString() }} VND</td>
          <td class="text-start">
            <div v-if="pro.listMember.length > 0" class="position-relative d-inline-flex avatar-stack mb-2">
              <!-- Lặp avatar -->
              <div
                  v-for="(avt, i) in getVisibleAvatars(pro.listMember)"
                  :key="i"
                  class="avatar-wrapper"
                  :style="{ left: i * -10 + 'px', zIndex: i }"
              >
                <img
                    class="avatar-small "
                    :src="` https://s3.cloudfly.vn/thg-storage/uploads-public/${avt.avatar}`"
                    :alt="avt.fullName"
                >
                <span class="tooltip1">
        {{ avt.fullName }} - {{ avt.email }}
      </span>
              </div>

              <!-- Avatar cuối cùng hiển thị +N, nằm TRÊN các avatar khác -->
              <div
                  v-if="pro.listMember.length > 3"
                  class="avatar-wrapper"
                  :style="{ left: getVisibleAvatars(pro.listMember).length * -10 + 'px', zIndex: 100 }"
              >
                <div
                    class="avatar-small bg-light text-dark fw-semibold d-flex align-items-center justify-content-center rounded-circle"
                >
                  +{{ pro.listMember.length - 3 }}
                </div>
                <span class="tooltip">
                  <template v-for="(avt, i) in getHiddenAvatars(pro.listMember)" :key="i">
                    {{ avt.fullName }} - {{ avt.email }}<br>
                  </template>
                </span>
              </div>
            </div>
            <span v-else class="text-muted fst-italic">NaN</span>
          </td>
          <td class="progress-cell">
            <div class="progress-container">

              <!-- 🔹 Nếu dự án đã hoàn thành -->
              <template v-if="pro.status === 'Hoàn thành'">
                <div class="finish-box">
                  Kết thúc thực tế: {{ pro.finishDate }}
                </div>

                <span
                    class="status-label"
                    :class="{
          'on-track': pro.progressStatus === 'DUNG',
          'late': pro.progressStatus === 'TRE',
          'early': pro.progressStatus === 'SOM'
        }"
                    :title="`Kế hoạch: ${pro.endDate}`"
                >
        {{
                    pro.progressStatus === 'DUNG'
                        ? 'Đúng tiến độ'
                        : pro.progressStatus === 'TRE'
                            ? 'Trễ tiến độ'
                            : 'Sớm tiến độ'
                  }}
      </span>
              </template>

              <!-- 🔹 Nếu chưa hoàn thành thì vẫn hiển thị thanh tiến độ -->
              <template v-else>
                <div
                    class="progress-wrapper"
                    :data-tooltip="`Kế hoạch: ${pro.plannedProgress}% | Thực tế: ${pro.actualProgress}%`"
                >
                  <div class="progress-bar expected" :style="{ width: pro.plannedProgress + '%' }"></div>
                  <div
                      class="progress-bar actual"
                      :class="{
            'on-track': pro.progressStatus === 'DUNG',
            'late': pro.progressStatus === 'TRE',
            'early': pro.progressStatus === 'SOM'
          }"
                      :style="{ width: pro.actualProgress + '%' }"
                  ></div>
                </div>

                <span
                    class="status-label"
                    :class="{
          'on-track': pro.progressStatus === 'DUNG',
          'late': pro.progressStatus === 'TRE',
          'early': pro.progressStatus === 'SOM'
        }"
                >
        {{
                    pro.progressStatus === 'DUNG'
                        ? 'Đúng tiến độ'
                        : pro.progressStatus === 'TRE'
                            ? 'Trễ tiến độ'
                            : 'Sớm tiến độ'
                  }}
      </span>
              </template>

            </div>
          </td>

          <td class="text-center">
            <i
                :class="pro.priority
                ? 'fa-solid fa-flag text-warning'    // khi priority = true
                : 'fa-regular fa-flag text-muted'   // khi priority = false
              "
            ></i>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>

</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import { useRouter } from "vue-router";
import api from "../api/api.js";
import { useAuthStore } from "../stores/authStore.js";


const authStore = useAuthStore();
const info = authStore.userInfo;
const canCreateProject = computed(
    () => Array.isArray(authStore.listAuthority) && authStore.listAuthority.includes('PROJECT_CREATE')
);

const router = useRouter();

const goToCreateProject = () => {
  router.push({ name: "CreateProject" });
};

// Giá trị sắp xếp
const sortOrder = ref("asc");

// Tab đang chọn
const activeTab = ref(null);

// Danh sách tab
const tabs = ref([]);

// Dữ liệu dự án
const projects = ref([]);

// --- Các hàm xử lý ---
const getVisibleAvatars = (list) => list.slice(0, 3);
const getHiddenAvatars =  (list) => {
  return list.slice(3); // phần còn lại
}

const sortByPrice = () => {
  duAnData.value.sort((a, b) =>
      sortOrder.value === "asc" ? a.giaTien - b.giaTien : b.giaTien - a.giaTien
  );
};

const setActiveTab = (tabKey) => {
  activeTab.value = tabKey;
};

// --- Dữ liệu lọc theo tab ---
const filteredDuAn = computed(() => {
  if (activeTab.value === "hoanThanh") {
    return duAnData.value.filter((d) => d.trangThai === "Đã hoàn thành");
  }
  if (activeTab.value === "dangTrienKhai") {
    return duAnData.value.filter((d) => d.trangThai === "Đang triển khai");
  }
  return duAnData.value;
});

const tabContainer = ref(null);
const isAtStart = ref(true);
const isAtEnd = ref(false);

const updateScrollState = () => {
  const el = tabContainer.value;
  if (!el) return;
  isAtStart.value = el.scrollLeft <= 0;
  isAtEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;
};

const scrollTabs = (direction) => {
  const el = tabContainer.value;
  if (!el) return;
  const scrollAmount = el.clientWidth * 0.6; // Cuộn mượt, khoảng 60% chiều rộng
  const newScrollLeft =
      direction === "left"
          ? el.scrollLeft - scrollAmount
          : el.scrollLeft + scrollAmount;
  el.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  setTimeout(updateScrollState, 400);
};

// ================= Hàm lấy danh sách các tab =======================
async function getInit(){
  try {
    const res = await api.get("/admin.thg/project/init", {
      withCredentials: true
    });
    console.log(res.data);
    tabs.value = res.data;
    activeTab.value = tabs.value[0];
  } catch (err) {
    const message = err.response?.data || null;
    console.log(message);
    console.error(err);
  }
}

onMounted( async  () => {
  await getInit();
  const el = tabContainer.value;
  if (el) {
    el.addEventListener("scroll", updateScrollState);
    updateScrollState();
  }
  await getProjects();
});

// Gọi api selected dữ liệu
const page = ref(1)
const size = ref(10)
const total = ref(150) // tổng số bản ghi
const totalPages = computed(() => Math.ceil(total.value / size.value))

const pageString = computed(() => `Trang ${page.value} / ${totalPages.value}`)

const goToFirstPage = () => (page.value = 1)
const goToLastPage = () => (page.value = totalPages.value)
const nextPage = () => {
  if (page.value < totalPages.value) page.value++
  getProjects();
}
const prevPage = () => {
  if (page.value > 1) page.value--
  getProjects();
}

// --- Search ---
const search = ref('')
const searchBTN = () => {
  console.log('Tìm kiếm:', search.value)
  // Gọi API tìm kiếm ở đây
}

// --- Filter state ---
const selectedProgress = ref(null) // 'TRE' | 'SOM' | 'DUNG' | null
const selectedPriority = ref(null) // true | false | null
const defaultSort = { sortField: null, sortDir: null }
const selectedSort = ref(defaultSort)

const emitChange = () => {
  const params = {
    progressFilter: selectedProgress.value ?? null,
    priority: selectedPriority.value,
    sortField: selectedSort.value.sortField,
    sortDir: selectedSort.value.sortDir,
  }
  console.log('Bộ lọc thay đổi:', params)
  // Bạn có thể emit ra ngoài: emit('change', params)
}
const flag = ref(0);

async function getProjects() {
  try {
    if(size.value < 1 ){
      size.value =10;
      flag.value = 1;
    }
    console.log(activeTab.value.flag);
    console.log(activeTab.value.key)
    const res = await api.get("/admin.thg/project/view", {
      withCredentials: true,
      params: {
        // các tham số lọc & sắp xếp
        priority: selectedPriority.value,
        name: search.value,
        progressFilter: selectedProgress.value,
        flag: activeTab.value.flag,
        key: activeTab.value.key,
        sortField: selectedSort.value.sortField,
        sortDir: selectedSort.value.sortDir,

        // phân trang
        page: page.value - 1, // Spring dùng page = 0-based
        size: size.value
      }
    })
    // // ✅ Gán dữ liệu nhận từ backend
    projects.value = res.data.content

    total.value = res.data.page.totalElements
    totalPages.value = res.data.page.totalPages
    if(size.value > total.value ) {
      flag.value = 1;
      size.value = total.value
    }
    console.log("📦 Dữ liệu nhận:", res.data)
  } catch (err) {
    console.error("❌ Lỗi tải dự án:", err.response?.data || err.message)
  }
}
import { watch } from 'vue'
// Theo dõi đồng thời nhiều giá trị
watch(
    [
      activeTab,
      () => selectedSort.value.sortField,
      () => selectedSort.value.sortDir,
      selectedPriority,
      selectedProgress
    ],
    () => {
      console.log("🎯 Bộ lọc thay đổi");
      page.value = 1;
      getProjects();
    },
    { deep: true }
);

// Theo dõi size riêng (để tránh loop)
watch(size, (newSize, oldSize) => {
  // chỉ gọi nếu size thay đổi hợp lệ và không bị ép lại trong getProjects
  if (newSize !== oldSize && newSize > 0 && newSize <= total.value) {
    getProjects();
  }
});

function dayDiff(date1, date2) {
  if (!date1 || !date2) return 0;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
}

import NotificationBell from "../components/NotificationBell.vue";
</script>


<style scoped>

.progress-cell {
  padding: 6px 8px;
}

/* Tổng thể chia 2 phần: thanh và nhãn, luôn cùng hàng ngang */
.progress-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

/* Thanh tiến độ có chiều rộng cố định để các dòng bằng nhau */
.progress-wrapper {
  width: 170px;            /* 👈 cố định chiều rộng */
  height: 10px;             /* thanh mảnh, chuyên nghiệp */
  border: 1px solid #d1d5db;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;          /* không bị co lại */
  background: transparent;
}

/* Thanh chung */
.progress-bar {
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 6px;
  transition: width 0.4s ease, background-color 0.4s ease;
}

/* Mong đợi */
.progress-bar.expected {
  background-color: rgba(147, 197, 253, 0.35);
  z-index: 1;
}

/* Thực tế */
.progress-bar.actual {
  z-index: 2;
}
.progress-bar.actual.on-track {
  background-color: rgba(41, 132, 238, 0.85);
}
.progress-bar.actual.early {
  background-color: rgba(56, 180, 92, 0.85);
}
.progress-bar.actual.late {
  background-color: rgba(230, 92, 92, 0.85);
}

/* Nhãn trạng thái — căn trái */
.status-label {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  text-align: left;         /* 👈 căn trái */
}

/* Tone màu nhãn dịu, đồng bộ */
.status-label.on-track {
  background-color: rgba(147, 197, 253, 0.25);
  color: #1d4ed8;
}
.status-label.early {
  background-color: rgba(187, 247, 208, 0.35);
  color: #166534;
}
.status-label.late {
  background-color: rgba(254, 202, 202, 0.4);
  color: #991b1b;
}

.nguoiTao{
  width: 60px !important;
  max-width: 60px !important;
}
.avatar-stack {
  position: relative;
  overflow: visible;
}
.avatar-wrapper:hover {
  z-index: 1000;
}
.avatar-stack:hover {
  z-index: 1500;
}
.avatar-wrapper:hover {
  z-index: 1000;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  overflow: visible;
}

.tooltip {
  visibility: hidden;
  opacity: 0;
  background-color: #8cbbdc;
  color: #fff;
  text-align: left;          /* 👈 canh chữ bên trái */
  border-radius: 6px;
  padding: 4px 8px;
  position: absolute;
  top: 50%;                  /* 👈 căn giữa theo chiều dọc avatar */
  right: 110%;               /* 👈 hiện tooltip bên trái */
  transform: translateY(-50%); /* 👈 căn giữa theo trục dọc */
  white-space: nowrap;
  z-index: 99999;
  transition: opacity 0.2s ease-in-out;
}

/* Mũi tên nhỏ ở cạnh phải tooltip (chỉ về avatar) */
.tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent #8cbbdc;
}

/* Tooltip mới — hiện ở trên avatar */
.tooltip1 {
  visibility: hidden;
  opacity: 0;
  background-color: #8cbbdc;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 4px 8px;
  position: absolute;
  bottom: 120%;             /* 👈 hiển thị phía trên */
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 99999;
  transition: opacity 0.2s ease-in-out;
}

/* Mũi tên nhỏ chỉ xuống avatar */
.tooltip1::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #8cbbdc transparent transparent transparent;
}

/* Hiển thị tooltip khi hover */
.avatar-wrapper:hover .tooltip,
.avatar-wrapper:hover .tooltip1 {
  visibility: visible;
  opacity: 1;
}

.avatar-small {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 0.5px solid rgba(0, 0, 0, 0.68);
  object-fit: cover;
}

.avatar-stack {
  height: 24px;
  position: relative;
  width: 70px;
}

/* Table */
.custom-table {
  font-size: 13.5px;
  border-collapse: separate;
  border-spacing: 0;
}
.custom-table th,
.custom-table td {
  padding: 0.5rem 0.65rem;
  vertical-align: middle;
}
.custom-table thead th {
  border-bottom: 2px solid #dee2e6;
}
.custom-table tbody tr {
  border-bottom: 1px solid #dee2e6;
}
.custom-table tbody tr:hover {
  background-color: #f8f9fa;
}
.stt{
  width: 70px !important;
  max-width: 70px !important;
}
/* Tên dự án - cắt chữ dư */
.ten-du-an {
  width: 210px !important;
  max-width: 210px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.gia-tien{
  width: 130px !important;
  max-width: 130px !important;
}
.tg-batDau{
  width: 120px !important;
  max-width: 120px !important;
}
.custom-table {
  table-layout: fixed !important;
  width: 100%;
}
/* Tiến độ rộng hơn */
.tien-do-col {
  width: 300px !important;
  margin-left: 25px;
}
.thuc-hien{
  width: 105px !important;
}
/* Progress bar */
.progress-thin {
  height: 4px !important;
  border-radius: 3px;
  overflow: hidden;
}
.wide-progress {
  width: 70% !important;
}
.progress-cell {
  width: 130px !important;
}

/* Tabs */
.tabs-du-an span {
  cursor: pointer;
}
.tabs-du-an span.active {
  color: #0d6efd !important;
  border-bottom: 2px solid #0d6efd;
}

/* Checkbox */
input[type="checkbox"] {
  accent-color: #0d6efd;
}

/* Colors */
.bg-purple {
  background-color: #b197fc !important;
}
.tabs-wrapper {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 4px;
  margin-bottom: 12px;
}

.tabs-du-an {
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */
}
.tabs-du-an::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.inner-tabs {
  white-space: nowrap;
  min-width: max-content;
}

.tab-item {
  cursor: pointer;
  transition: all 0.2s;
  padding-bottom: 4px;
}
.tab-item:hover {
  color: #0d6efd;
}
.tab-item.active {
  color: #0d6efd !important;
  border-bottom: 2px solid #0d6efd;
  font-weight: 600;
}

/* ===== Nút mũi tên cuộn ===== */
.scroll-controls {
  flex-shrink: 0;
  display: flex;
  gap: 4px;
}
.btn-arrow {
  border: none;
  background: transparent;
  color: #6c757d;
  padding: 2px 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-arrow:hover {
  color: #0d6efd;
  transform: scale(1.1);
}
.btn-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}
.avatar-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #d6d9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #333;
}


/* Input & select */
.toolbar input,
.toolbar select {
  border-radius: 6px;
  transition: box-shadow 0.2s ease;
}

.toolbar input:focus,
.toolbar select:focus {
  box-shadow: 0 0 4px rgba(13, 110, 253, 0.5);
  outline: none;
}

:deep(.custom-table tbody tr.project-row) {
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  z-index: 0;
}

:deep(.custom-table tbody tr.project-row:hover) {
  z-index: 20;
}

:deep(.custom-table tbody tr.project-row:hover td) {
  background-color: #818cf8 !important;
  color: #fff !important;
  transition: all 0.25s ease;
}
:deep(.custom-table thead.bg-light) {
  background: #818cf8 !important;
  color: #ffffff !important;
  font-weight: 600;
  border-bottom: 2px solid #5a4eb8;
}
:deep(.table-responsive) {
  overflow: visible;
  position: relative;
  z-index: 0;
}



</style>
