<template>
  <div>
    <!-- Header -->
    <div
        class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2"
        style="border-bottom: solid 0.5px rgba(0, 0, 0, 0.3)"
    >
      <h5 class="fw-bold mb-0 d-flex align-items-center">Quản lý đội nhóm</h5>

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

    <div class="main-layout px-3">
      <!-- Form section -->
      <div class="form-section card border rounded-4 shadow-sm small-text">
        <div class="card-header fw-semibold small-text border-bottom rounded-top-3" style="background-color: #f6e6d5">
          Thêm / sửa nhóm
        </div>

        <div class="p-4 team-form">
          <div class="row mb-3 align-items-center">
            <!-- Avatar -->
            <div class="col-5 text-center position-relative">
              <img
                  :src="previewAvatar || getFullUrl(selectedTeam.avatar)"
                  alt="Team avatar"
                  class="avatar-form-small"
              />
              <div class="overlay-camera" @click="triggerAvatarUpload">
                <i class="fas fa-camera"></i>
              </div>
              <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="d-none"
                  @change="handleAvatarChange"
              />
            </div>

            <!-- Tên nhóm -->
            <div class="col-7">
              <label class="form-label fw-semibold">Tên nhóm <span class="text-danger">*</span></label>
              <input
                  v-model="selectedTeam.teamName"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Nhập tên nhóm"
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Mô tả <span class="text-danger">*</span></label>
            <DescriptionEditor v-model="selectedTeam.teamDesc" />
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Phòng ban quản lý</label>
            <select v-model="selectedTeam.department.departmentName" class="form-select form-select-sm">
              <option value="">-- Chọn phòng ban --</option>
              <option
                  v-for="dep in departments"
                  :key="dep.departmentName"
                  :value="dep.departmentName"
              >
                {{ dep.departmentName }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Trạng thái hoạt động <span class="text-danger">*</span></label>
            <div class="d-flex align-items-center gap-3">
              <div class="form-check">
                <input
                    id="team-status-active"
                    class="form-check-input"
                    type="radio"
                    :value="true"
                    v-model="selectedTeam.status"
                />
                <label class="form-check-label" for="team-status-active">Hoạt động</label>
              </div>
              <div class="form-check">
                <input
                    id="team-status-inactive"
                    class="form-check-input"
                    type="radio"
                    :value="false"
                    v-model="selectedTeam.status"
                />
                <label class="form-check-label" for="team-status-inactive">Không hoạt động</label>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Trưởng nhóm <span class="text-danger">*</span></label>
            <select
                v-model="selectedTeam.leader.idE"
                @mousedown="beforeLeaderChange"
                @change="onLeaderChange"
                class="form-select form-select-sm"
            >
              <option value="" disabled>-- Chọn trưởng nhóm --</option>

              <!-- Nếu leader hiện tại không nằm trong danh sách thành viên, vẫn hiển thị -->
              <option v-if="selectedTeam.leader.idE !== '' "
                      :value="selectedTeam.leader.idE"
              >
                {{ selectedTeam.leader.fullName }} (Trưởng nhóm hiện tại)
              </option>

              <!-- Danh sách thành viên -->
              <option
                  v-for="member in selectedTeam.members"
                  :key="member.idE"
                  :value="member.idE"
              >
                {{ member.fullName }}
              </option>
            </select>

          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">Thành viên <span class="text-danger">*</span></label>

            <div class="members-box stacked">
              <!-- 4 thành viên đầu -->
              <template v-for="(member, index) in selectedTeam.members" :key="index">
                <div class="member-icon">
                  <img :src="getFullUrl(member.avatar)" class="member-avatar-lg" alt="member" />
                </div>
              </template>

              <!-- Nếu có hơn 4 thì hiện dấu + -->
              <div v-if="selectedTeam.members.length > 4" class="member-avatar-lg member-extra" style="font-size: 11px">+ {{ selectedTeam.members.length - visibleMembers.length }}</div>

              <span class="member-count">{{ selectedTeam.members.length }} thành viên</span>
              <!-- Nút mở modal -->
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="showModal = true">+</button>

              <!-- Modal hiển thị bằng v-if -->
              <div v-if="showModal" class="modal-overlay">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content rounded-4 shadow">
                    <div class="modal-header custom-header">
                      <h5 class="modal-title mb-0 text-white">Thêm thành viên vào team</h5>
                      <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
                    </div>

                    <div class="modal-body">
                      <label class="form-label fw-semibold">Nhập email thành viên</label>
                      <input
                          v-model="email"
                          type="email"
                          class="form-control"
                          placeholder="ví dụ: user@gmail.com"
                      />

                      <div v-if="loading" class="mt-3 text-secondary small">Đang tìm...</div>
                      <div v-if="error" class="alert alert-warning mt-3 py-2">{{ error }}</div>

                      <div v-if="member" class="member-card mt-3" @click="selectMember(member)">
                        <img
                            :src="' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + member.avatar"
                            class="member-avatar"
                            alt="Avatar"
                        />
                        <div>
                          <div class="fw-bold">{{ member.fullName }}</div>
                          <div class="text-muted">{{ member.email }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <a href="#" class="text-decoration-none small" @click.prevent="openMemberDetailModal">Xem chi tiết danh sách thành viên</a>
          </div>

          <div v-if="showMemberDetailModal" class="modal-overlay">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content rounded-4 shadow">
                <div class="modal-header custom-header">
                  <h5 class="modal-title mb-0 text-white">Danh sách thành viên</h5>
                  <button type="button" class="btn-close btn-close-white" @click="closeMemberDetailModal"></button>
                </div>

                <div class="modal-body">
                  <div v-if="selectedTeam.members.length === 0" class="text-muted text-center py-3">
                    Chưa có thành viên nào trong nhóm.
                  </div>
                  <div v-else class="member-detail-list">
                    <div
                        v-for="memberItem in selectedTeam.members"
                        :key="memberItem.idE || memberItem.email"
                        class="member-detail-item"
                    >
                      <div class="member-detail-info">
                        <img :src="getFullUrl(memberItem.avatar)" class="member-detail-avatar" alt="member" />
                        <div>
                          <div class="fw-semibold">{{ memberItem.fullName }}</div>
                          <div class="text-muted extra-small">{{ memberItem.email }}</div>
                        </div>
                      </div>
                      <button
                          class="btn btn-outline-danger btn-sm"
                          type="button"
                          @click="removeMember(memberItem.idE)"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div class="d-flex justify-content-end gap-2 mt-4">
            <button class="btn btn-outline-secondary btn-sm px-3" type="button" @click="resetForm">Làm mới</button>
            <button v-if="selectedTeam.teamId == null &&  authStore.listAuthority.includes('TEAM_CREATE')" class="btn btn-primary btn-sm px-3" type="button"  @click="addTeam()">
              <i class="fas fa-plus me-1"></i>
              Thêm mới
            </button>
            <button v-else-if="authStore.listAuthority.includes('TEAM_UPDATE')" class="btn btn-primary btn-sm px-3" type="button" @click="updateTeam()">
              <i class="fa-solid fa-pen-fancy"></i>
              Lưu
            </button>
          </div>
        </div>
      </div>

      <!-- Table section -->
      <div class="table-section card border rounded-4 shadow-sm overflow-hidden d-flex flex-column">
        <div class="card-header fw-semibold small-text border-bottom rounded-top-3" style="background-color: #eaf3ff">
          <div class="d-flex w-100 align-items-center justify-content-between flex-wrap gap-3">
            <h6 class="mb-0 fw-semibold">Danh sách</h6>
            <div class="table-controls d-flex align-items-center flex-wrap gap-2">
              <div class="input-group input-group-sm search-group w-auto" style="width:180px;">
                <input v-model="searchText" type="text" class="form-control" placeholder="Tìm nhóm..." />
              </div>
              <select v-model="statusFilter" class="form-select form-select-sm w-auto">
                <option :value="true">ON</option>
                <option :value="false">OFF</option>
              </select>
              <select v-model="selectedDept" class="form-select form-select-sm w-auto">
                <option value="">Tất cả phòng ban</option>
                <option
                    v-for="dep in departments"
                    :key="dep.departmentName"
                    :value="dep.departmentName"
                >
                  {{ dep.departmentName }}
                </option>
              </select>
              <div class="d-flex align-items-center gap-2 page-size-group">
                <label class="form-label fw-semibold small mb-0">Kích thước trang</label>
                <input
                    type="number"
                    min="1"
                    :max="totalElements"
                    pattern="[0-9]*"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                    class="form-control form-control-sm page-size-input"
                    v-model.number="pageSize"
                    @blur="validatePageSize"
                />
              </div>
              <div class="btn-group btn-group-sm" role="group">
                <button
                    type="button"
                    class="btn btn-outline-secondary"
                    :disabled="currentPageDisplay <= 1"
                    @click="goToPrevPage"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button
                    type="button"
                    class="btn btn-outline-secondary"
                    :disabled="currentPageDisplay >= totalPages"
                    @click="goToNextPage"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
              <span class="text-muted extra-small table-info-text">
                Trang {{ currentPage }} / {{ totalPages }} · {{ totalElements }} nhóm
              </span>
            </div>
          </div>
        </div>

        <div class="table-container flex-grow-1 overflow-auto px-3 pb-3">
          <table class="table align-middle modern-table small-text mb-0">
            <thead>
            <tr>
              <th>Tên nhóm</th>
              <th>PB quản lý</th>
              <th>Trưởng nhóm</th>
              <th>Thành viên</th>
              <th class="text-center">Hành động</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="teams.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">Không có nhóm phù hợp.</td>
            </tr>
            <tr
                v-for="team in teams"
                :key="team.teamId || team.teamName"
                class="table-row"
            >
              <td>
                <div class="team-name-cell">
                  <img :src="getFullUrl(team.avatar)" class="team-avatar" alt="team" />
                  <span class="fw-semibold">{{ team.teamName }}</span>
                </div>
              </td>
              <td>{{ team.department?.departmentName || "—" }}</td>
              <td>
                <div class="leader-cell">
                  <img :src="getFullUrl(team.leader?.avatar)" class="leader-avatar" alt="leader" />
                  <div>
                    <div class="fw-semibold">{{ team.leader?.fullName || "Chưa có" }}</div>
                    <div class="text-muted extra-small">{{ team.leader?.email || "" }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="members-cell stacked">
                  <!-- 4 avatar đầu -->
                  <template v-for="(member, index) in (team.members || []).slice(0, 4)" :key="index">
                    <img
                        :src="getFullUrl(member.avatar)"
                        class="member-avatar-lg"
                        alt="member"
                    />
                  </template>

                  <!-- Nếu có hơn 4 thì hiện ô + -->
                  <div v-if="(team.members?.length || 0) > 4" class="member-avatar-lg member-extra" style="font-size: 11px">+ {{team.members?.length - 4}}</div>

                  <span class="member-count-sm">{{ team.members?.length || 0 }} thành viên</span>
                </div>
              </td>

              <td>
                <div class="action-cell">
                  <button class="btn btn-soft-primary btn-sm" type="button"  @click="selectTeam(JSON.parse(JSON.stringify(team)))"><i class="fa-solid fa-pen"></i></button>
                  <button v-if="authStore.listAuthority.includes('TEAM_DELETE')" class="btn btn-soft-danger btn-sm" type="button" @click="deleteTeam(team)"><i class="fa-solid fa-trash"></i></button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import api from "../api/api.js";
import { showSuccess, showWarning, confirmWithInput, showError } from "../assets/js/alertService.js";
import { useAuthStore } from "../stores/authStore.js";
import DescriptionEditor from "./common/DescriptionEditor.vue";
import NotificationBell from "./NotificationBell.vue";

const authStore = useAuthStore();
const info = authStore.userInfo;

/* --- Bộ lọc & trạng thái --- */
const statusFilter = ref(true);
const searchText = ref("");
const selectedDept = ref("");
const pageSize = ref(5);
const currentPage = ref(1);
const currentPageDisplay = computed(() => currentPage.value);

/* --- Dữ liệu chính --- */
const teams = ref([]);
const departments = ref([]);
const totalElements = ref(0);
const totalPages = ref(1);

/* --- Team đang chọn --- */
const selectedTeam = ref({
  teamId: null,
  teamName: "",
  teamDesc: "",
  department: { departmentName: "" },
  status: true,
  leader: { idE: "", fullName: "" },
  members: [],
  avatar: "",
  _previousLeader: null,

});

function validateTeamData(team) {
  // 🔹 Kiểm tra tên nhóm
  if (!team.teamName || team.teamName.trim() === "") {
    showWarning("Vui lòng nhập tên nhóm!");
    return false;
  }

  // 🔹 Kiểm tra mô tả nhóm
  if (!team.teamDesc || team.teamDesc.trim() === "") {
    showWarning("Vui lòng nhập mô tả cho nhóm!");
    return false;
  }

  // 🔹 Kiểm tra trưởng nhóm
  if (!team.leader || !team.leader.idE) {
    showWarning("Vui lòng chọn trưởng nhóm!");
    return false;
  }

  // 🔹 Kiểm tra ảnh nhóm (avatar hoặc file mới)
  if (
      (!team.avatar || team.avatar.trim() === "") &&
      (!selectedAvatarFile.value || selectedAvatarFile.value === null)
  ) {
    showWarning("Vui lòng chọn ảnh đại diện cho nhóm!");
    return false;
  }

  // ✅ Nếu qua hết kiểm tra
  return true;
}


const visibleMembers = computed(() => selectedTeam.value.members.slice(0, 4));

/* --- Avatar Upload --- */
const fileInput = ref(null);
const previewAvatar = ref("");
const selectedAvatarFile = ref(null);

function validatePageSize() {
  let val = Number(pageSize.value);

  // Giới hạn hợp lệ
  if (isNaN(val) || val < 1) val = 1;
  else if (val > totalElements.value) val = totalElements.value;

  // Cập nhật lại model (Vue sẽ sync lại input)
  pageSize.value = val;

  // Gọi API khi thoát ô
  fetchTeams();
}

/* --- Avatar xử lý --- */
function triggerAvatarUpload() {
  fileInput.value?.click();
}
function handleAvatarChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  selectedAvatarFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => (previewAvatar.value = e.target?.result || "");
  reader.readAsDataURL(file);
}
function clearAvatarSelection() {
  previewAvatar.value = "";
  selectedAvatarFile.value = null;
  if (fileInput.value) fileInput.value.value = "";
}

/* --- Xử lý URL ảnh --- */
function getFullUrl(filename) {
  if (!filename) return " https://s3.cloudfly.vn/thg-storage-dev/uploads-public/default-image_730.jpg";
  if (filename.startsWith("http")) return filename;
  return ` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${filename}`;
}

/* --- Reset form --- */
function resetForm() {
  isInitializing.value = true; // 🚫 tắt watcher tạm thời

  Object.assign(selectedTeam.value, {
    teamId: null,
    teamName: "",
    teamDesc: "",
    department: { departmentName: "" },
    status: true,
    leader: { idE: "", fullName: "" },
    members: [],
    avatar: "",
  });

  clearAvatarSelection();

  // ✅ bật lại watcher sau khi form thực sự reset xong
  setTimeout(() => {
    isInitializing.value = false;
  }, 0);
}



/* --- API: Lấy danh sách phòng ban --- */
async function getDataFilter() {
  const res = await api.get("/admin.thg/team/data_filter", { withCredentials: true });
  departments.value = res.data;
}

/* --- API: Gọi danh sách nhóm (server-side pagination) --- */

async function fetchTeams() {
  try {
    const res = await api.get("/admin.thg/team/view", {
      params: {
        deparmentName: selectedDept.value || "",
        name: searchText.value || "",
        status: statusFilter.value,
        pageSize: pageSize.value,
        pageNo: currentPage.value - 1,
      },
    });

    // ✅ Gán dữ liệu từ backend đúng cấu trúc
    teams.value = res.data.content ?? [];

    // ✅ Lấy thông tin phân trang từ res.data.page
    const pageInfo = res.data.page ?? {};
    totalElements.value = pageInfo.totalElements ?? 0;
    totalPages.value = pageInfo.totalPages ?? 1;

    // Backend page.number bắt đầu từ 0 → frontend hiển thị +1
    currentPage.value = (pageInfo.number ?? 0) + 1;

    console.log("📦 API /view result:", res.data);

  } catch (error) {
    console.error("❌ Lỗi khi gọi API /view:", error);
  }
}




/* --- Chọn team --- */
async function selectTeam(team) {
  // Dọn form trước — dùng Object.assign để không mất reactivity

  Object.assign(selectedTeam.value, {
    teamId: team.teamId ?? null,
    teamName: team.teamName ?? "",
    teamDesc: team.teamDesc ?? "",
    department: { departmentName: team.department?.departmentName ?? "" },
    status: team.status ?? true,
    leader: team.leader ? { ...team.leader } : { idE: "", fullName: "" },
    members: team.members ? JSON.parse(JSON.stringify(team.members)) : [],
    avatar: team.avatar ?? "",
  });

  clearAvatarSelection();

  // Lưu leader hiện tại vào biến phụ để watcher dùng
  selectedTeam.value._previousLeader = team.leader ? { ...team.leader } : null;

  // Lọc leader ra khỏi members
  if (selectedTeam.value.leader?.idE) {
    selectedTeam.value.members = selectedTeam.value.members.filter(
        (m) => m.idE !== selectedTeam.value.leader.idE
    );
  }

  setTimeout(() => (isInitializing.value = false), 0);

}


/* --- Chuyển trang --- */
async function goToPrevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    await fetchTeams();
  }
}
async function goToNextPage() {
  currentPage.value++;
  await fetchTeams();
}

/* --- Theo dõi thay đổi filter và gọi lại API --- */
watch([searchText, selectedDept, statusFilter], async () => {
  currentPage.value = 1;
  await fetchTeams();
});

/* --- Lần đầu load --- */
onMounted(async () => {
  await getDataFilter();
  await fetchTeams();
});

async function updateTeam() {
  if (!validateTeamData(selectedTeam.value)) return;
  try {
    console.log("========== 🧩 DỮ LIỆU TRƯỚC KHI GỬI ===========");
    console.log("📦 selectedTeam.value =", JSON.stringify(selectedTeam.value, null, 2));
    console.log("🖼️ selectedAvatarFile.value =", selectedAvatarFile.value);

    const formData = new FormData();

    // Thêm DTO vào form
    const dtoBlob = new Blob([JSON.stringify(selectedTeam.value)], {
      type: "application/json",
    });
    formData.append("teamManagerDTO", dtoBlob);

    // Thêm file (nếu có)
    if (selectedAvatarFile.value) {
      formData.append("file", selectedAvatarFile.value);
    }

    // ✅ In toàn bộ FormData ra console
    console.log("========== 📤 FORM DATA SẼ GỬI ===========");
    for (let pair of formData.entries()) {
      if (pair[0] === "teamManagerDTO") {
        const reader = new FileReader();
        reader.onload = () => {
          console.log("🧾 teamManagerDTO =", JSON.parse(reader.result));
        };
        reader.readAsText(pair[1]);
      } else if (pair[0] === "file") {
        console.log("📎 file =", pair[1].name || pair[1]);
      } else {
        console.log(pair[0], "=", pair[1]);
      }
    }

    console.log("========== 🚀 GỬI REQUEST ===========");
    const res = await api.post("/admin.thg/team/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    showSuccess("✅ Cập nhật thông tin nhóm thành công!");
    console.log("✅ KẾT QUẢ TRẢ VỀ:", res.data);

    // Sau khi cập nhật thành công, tải lại danh sách
    await fetchTeams();
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật team:", error);

    if (error.response) {
      console.error("📨 Response data:", error.response.data);
      console.error("📨 Response status:", error.response.status);
      console.error("📨 Response headers:", error.response.headers);
    }
  }
}

async function addTeam() {
  try {

    if (!validateTeamData(selectedTeam.value)) return;
    const formData = new FormData();

    // 🔹 Thêm DTO vào form dưới dạng JSON Blob
    const dtoBlob = new Blob([JSON.stringify(selectedTeam.value)], {
      type: "application/json",
    });
    formData.append("teamManagerDTO", dtoBlob);

    // 🔹 Thêm file avatar (nếu có)
    if (selectedAvatarFile.value) {
      formData.append("file", selectedAvatarFile.value);
    }

    const res = await api.post("/admin.thg/team/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true, // để cookie/token tự động gửi nếu cần auth
    });

    // ✅ Thông báo thành công
    showSuccess("🎉 Tạo nhóm mới thành công!");

    // 🔹 Làm mới danh sách team sau khi thêm
    await fetchTeams();

    // 🔹 Reset form sau khi thêm thành công
    resetForm();

  } catch (error) {
    console.error("❌ Lỗi khi thêm team:", error);

    if (error.response) {
      console.error("📨 Response data:", error.response.data);
      console.error("📨 Response status:", error.response.status);
      console.error("📨 Response headers:", error.response.headers);
    }
  }
}

const props = defineProps({
  teamId: { type: Number, required: true },
});

const emit = defineEmits(["selected"]);

/* === Modal thêm thành viên === */
// ==== Modal dùng v-if ====
const showModal = ref(false);
const email = ref("");
const member = ref(null);
const error = ref("");
const loading = ref(false);
let debounceTimer = null;

// Khi nhập email -> debounce 600ms
watch(email, (val) => {
  clearTimeout(debounceTimer);
  if (!val.trim()) {
    member.value = null;
    error.value = "";
    return;
  }
  debounceTimer = setTimeout(getMember, 600);
});

// Gọi API backend /find_member
async function getMember() {
  try {
    loading.value = true;
    error.value = "";
    member.value = null;

    const res = await api.get("/admin.thg/team/find_member", {
      params: {
        emailMember: email.value,
        teamId: selectedTeam.value.teamId || 0,
      },
      withCredentials: true,
    });

    member.value = res.data;
  } catch (err) {
    console.error(err);
    error.value = "Không tìm thấy nhân sự nào cả !";
  } finally {
    loading.value = false;
  }
}

function selectMember(m) {
  if (!m) return;

  // 1️⃣ Nếu là leader hiện tại
  if (selectedTeam.value.leader && selectedTeam.value.leader.idE === m.idE) {
    showWarning("Thành viên này đang là trưởng nhóm, không thể thêm lại.");
    return;
  }

  // 2️⃣ Nếu đã có trong danh sách members
  if (selectedTeam.value.members.some(mem => mem.idE === m.idE)) {
    showWarning("Thành viên đã có trong nhóm.");
    return;
  }

  // 3️⃣ Nếu hợp lệ => thêm vào danh sách
  selectedTeam.value.members.push({ ...m });
  closeModal();
}



function closeModal() {
  showModal.value = false;
  email.value = "";
  member.value = null;
  error.value = "";
}

const showMemberDetailModal = ref(false);

function openMemberDetailModal() {
  showMemberDetailModal.value = true;
}

function closeMemberDetailModal() {
  showMemberDetailModal.value = false;
}

function removeMember(memberId) {
  if (!memberId) return;
  selectedTeam.value.members = selectedTeam.value.members.filter((item) => item.idE !== memberId);
  if (selectedTeam.value.leader.idE === memberId) {
    selectedTeam.value.leader = { idE: "", fullName: "" };
  }
}
// Theo dõi thay đổi leader trong form
const isInitializing = ref(false);
watch(
    () => selectedTeam.value.leader.idE,
    () => {
      const currentLeader = selectedTeam.value.leader;
      selectedTeam.value._previousLeader =
          currentLeader && currentLeader.idE ? { ...currentLeader } : null;
    }
);

let tempOldLeader = null;

function beforeLeaderChange() {
  // Lưu leader cũ trước khi Vue đổi ID
  if (selectedTeam.value.leader && selectedTeam.value.leader.idE) {
    tempOldLeader = { ...selectedTeam.value.leader };
  } else {
    tempOldLeader = null;
  }
  console.log("🟡 [beforeLeaderChange] tempOldLeader =", tempOldLeader);
}

function onLeaderChange(e) {
  const newLeaderId = Number(e.target.value);
  console.log("🔵 [onLeaderChange] newLeaderId =", newLeaderId);

  if (!newLeaderId) {
    console.log("⚠️ Không chọn leader mới → bỏ qua");
    return;
  }

  // Tìm leader mới trong danh sách members
  const newLeader = selectedTeam.value.members.find(m => m.idE === newLeaderId);
  console.log("🟢 [onLeaderChange] newLeader =", newLeader);

  if (!newLeader) {
    console.log("⚠️ Không tìm thấy leader mới trong members → dừng");
    return;
  }

  // Gán leader mới
  selectedTeam.value.leader = { ...newLeader };
  console.log("✅ [onLeaderChange] leader mới gán =", selectedTeam.value.leader);

  // Xóa leader mới khỏi danh sách members
  selectedTeam.value.members = selectedTeam.value.members.filter(m => m.idE !== newLeaderId);
  console.log("📦 [onLeaderChange] members sau khi xóa leader mới =", selectedTeam.value.members);

  // Thêm lại leader cũ (nếu hợp lệ)
  if (
      tempOldLeader &&
      tempOldLeader.idE &&
      tempOldLeader.idE !== newLeaderId &&
      !selectedTeam.value.members.some(m => m.idE === tempOldLeader.idE)
  ) {
    selectedTeam.value.members.push(tempOldLeader);
    console.log("🧩 [onLeaderChange] thêm lại leader cũ =", tempOldLeader);
  } else {
    console.log("🚫 [onLeaderChange] KHÔNG thêm lại leader cũ:", {
      tempOldLeader,
      members: selectedTeam.value.members,
    });
  }

  // Reset biến tạm
  tempOldLeader = null;

  console.log("🔚 [KẾT QUẢ CUỐI] leader =", selectedTeam.value.leader);
  console.log("🔚 [KẾT QUẢ CUỐI] members =", selectedTeam.value.members);
}


async function deleteTeam(team) {
  try {
    // 🧩 Kiểm tra dữ liệu
    if (!team || !team.teamId) {
      showWarning("Không thể xóa nhóm", "Thiếu thông tin nhóm!");
      return;
    }

    // 🚨 Hiển thị cảnh báo xác nhận nhập tên nhóm
    await confirmWithInput(
        "Xác nhận giải tán nhóm",
        `Nhập chính xác tên nhóm "${team.teamName}" để xác nhận giải tán.`,
        team.teamName,
        async () => {
          try {
            console.log("🚀 Đang gọi API xoá nhóm:", team.teamId);
            const res = await api.delete(`/admin.thg/team/delete/${team.teamId}`, {
              withCredentials: true,
            });

            console.log("✅ Kết quả xoá:", res.data);
            showSuccess("Đã giải tán nhóm thành công!", `Nhóm ${team.teamName} đã bị xoá.`);

            // 🌀 Reload lại danh sách nhóm sau khi xoá
            await fetchTeams();
          } catch (error) {
            console.error("❌ Lỗi khi xoá nhóm:", error);
            if (error.response) {
              showError("Xoá nhóm thất bại", error.response.data || "Không thể xoá nhóm này.");
            } else {
              showError("Lỗi hệ thống", "Vui lòng thử lại sau.");
            }
          }
        }
    );
  } catch (err) {
    console.error("⚠️ Lỗi ngoài dự kiến khi xoá nhóm:", err);
    showError("Lỗi hệ thống", err.message);
  }
}

</script>


<style scoped>
/* Header đen, chữ trắng, căn giữa đẹp */
.custom-header {
  background-color: #212529; /* đen đậm */
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* Nút X màu trắng chuẩn Bootstrap */
.btn-close-white {
  filter: invert(1) brightness(200%);
  opacity: 0.9;
}

.btn-close-white:hover {
  opacity: 1;
}

/* Modal nền mờ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

/* Hộp modal */
.modal-dialog {
  max-width: 500px;
  width: 90%;
}

.modal-content {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

/* Header đen */
.modal-header {
  background-color: #212529;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  background-color: #fff;
  padding: 1.25rem;
}

/* Thành viên */
.member-card {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-top: 10px;
  transition: 0.2s;
  cursor: pointer;
}
.member-card:hover {
  background-color: #f5f5f5;
  transform: scale(1.02);
}
.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}


.small-text {
  font-size: 0.9rem;
}
.extra-small {
  font-size: 0.75rem;
}

.main-layout {
  display: flex;
  gap: 16px;
  align-items: stretch;
}

.form-section {
  width: 31%;
  min-width: 320px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  background: #fff;
  min-height: 88vh;
  display: flex;
  flex-direction: column;
}

.team-form .form-label {
  margin-bottom: 6px;
}

.team-form .mb-3 {
  margin-bottom: 1.25rem !important;
}

.avatar-form {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.25);
  object-fit: cover;
}

.overlay-camera {
  margin-top: 10px;
  color: #a4a3a3;
}

.overlay-camera:hover {
  cursor: pointer;
  transform: scale(1.05);
  color: #426ba8;
}

.table-section {
  flex: 1;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  min-height: 80vh;
}

.table-container {
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
  padding: 0.5rem 1rem 1rem;
}

.table-container::-webkit-scrollbar {
  width: 6px;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
}

.table-controls {
  justify-content: flex-end;
}

.table-controls > * {
  flex-shrink: 0;
}

.table-info-text {
  white-space: nowrap;
}

.search-group {
  min-width: 220px;
}

.modern-table {
  border-collapse: collapse;
  width: 100%;
}

.modern-table th {
  background-color: #e0dddd;
  font-weight: 600;
  text-align: left;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.modern-table td {
  padding: 10px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.modern-table tr:hover td {
  background-color: rgba(0, 0, 0, 0.03);
}

.team-avatar,
.leader-avatar,
.member-avatar-lg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  object-fit: cover;
}

.team-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.leader-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.members-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.member-count,
.member-count-sm {
  font-size: 13px;
  color: #666;
}

.members-box {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.member-icon {
  display: inline-flex;
}

.action-cell {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.btn-soft-primary {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  border: none;
}

.btn-soft-primary:hover {
  background-color: rgba(13, 110, 253, 0.2);
}

.btn-soft-danger {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border: none;
}

.btn-soft-danger:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

.table-row {
  cursor: pointer;
}

.page-size-input {
  width: 90px;
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
/* Avatar nhỏ để nằm chung hàng với ô tên */
.avatar-form-small{
  width:70px; height:70px; border-radius:50%;
  object-fit:cover; border:2px solid rgba(0,0,0,.25);
}


.overlay-camera:hover{ transform:scale(1.05); color:#0d6efd; }

/* Ô tìm kiếm nhỏ gọn, không bị đẩy xuống dòng */
.search-group{ min-width:0; }
.search-group input{ font-size:.85rem; padding:4px 6px; }

/* Giữ tất cả control trên cùng 1 hàng */
.table-controls{ flex-wrap:nowrap; gap:6px; }
.table-info-text{ white-space:nowrap; }
/* ======= Avatar chồng nhau ======= */
.members-cell,
.members-box {
  display: flex;
  align-items: center;
  position: relative;
}

.member-avatar-lg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  margin-left: -15px; /* che 1/2 avatar trước */
  transition: transform 0.2s;
}

.member-avatar-lg:first-child {
  margin-left: 0;
}

.member-avatar-lg:hover {
  z-index: 2;
  transform: scale(1.1);
}
/* ==== Avatar thành viên chồng lên nhau (trong form và bảng) ==== */
.members-box,
.members-cell {
  display: flex;
  align-items: center;
  position: relative;
}

.member-icon {
  position: relative;
}

.member-avatar-lg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  margin-left: -15px; /* avatar sau che một nửa avatar trước */
  transition: transform 0.2s;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.member-avatar-lg:first-child {
  margin-left: 0;
}

.member-avatar-lg:hover {
  transform: scale(1.1);
  z-index: 2;
}
/* === Avatar thành viên chồng lên nhau === */
.members-box.stacked {
  display: flex;
  align-items: center;
  position: relative;
  flex-wrap: nowrap;
}

.members-box.stacked .member-icon {
  position: relative;
  margin-left: -15px;
}

.members-box.stacked .member-icon:first-child {
  margin-left: 0;
}

.members-box.stacked .member-avatar-lg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.members-box.stacked .member-avatar-lg:hover {
  transform: scale(1.1);
  z-index: 2;
}
.members-box.stacked {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  position: relative;
}

.members-box.stacked .member-icon {
  margin-left: -15px;
  position: relative;
}

.members-box.stacked .member-icon:first-child {
  margin-left: 0;
}

.member-avatar-lg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s;
}

.member-avatar-lg:hover {
  transform: scale(1.1);
  z-index: 3;
}

/* Avatar “+” cuối cùng */
.member-extra {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -15px;
  background-color: #dee2e6;
  color: #333;
  font-weight: 700;
  font-size: 1.2rem;
}
.members-cell.stacked {
  display: flex;
  align-items: center;
  position: relative;
  flex-wrap: nowrap;
}

.members-cell.stacked .member-avatar-lg {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #fff;
  object-fit: cover;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  margin-left: -15px;
  transition: transform 0.2s;
}

.members-cell.stacked .member-avatar-lg:first-child {
  margin-left: 0;
}

.members-cell.stacked .member-avatar-lg:hover {
  transform: scale(1.1);
  z-index: 3;
}

/* Ô “+” */
.member-extra {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -15px;
  background-color: #dee2e6;
  color: #333;
  font-weight: 700;
  font-size: 1.2rem;
}
.member-card {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-top: 10px;
  transition: 0.2s;
  cursor: pointer;
}
.member-card:hover {
  background-color: #f5f5f5;
  transform: scale(1.02);
}
.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
}

.member-detail-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-detail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  gap: 12px;
}

.member-detail-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-detail-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

</style>
