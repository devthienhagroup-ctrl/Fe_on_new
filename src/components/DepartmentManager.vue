<template>
  <!-- Header -->
  <div class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2 " style="border-bottom: solid 0.5px rgba(0,0,0,0.3)">
    <h5 class="fw-bold mb-0 d-flex align-items-center">
      Quản lý phòng ban
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

  <!-- Nội dung chính -->
  <div class="main-layout px-3" style="height: 90%">
    <!-- Form trái -->
    <div class="form-section card border rounded-4 shadow-sm small-text">
      <div class="card-header fw-semibold small-text  border-bottom rounded-top-3"
        style="background-color: #88b686">
        Thêm / sửa phòng ban
      </div>
      <div class="p-4 department-form">
        <div class="text-center mb-4">
          <img
              :src="
    previewImage
      || (departmentForm.profileImage
          ? ` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${departmentForm.profileImage}`
          : ' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/default-image_730.jpg')
  "
              alt="Department"
              class="avatar-form"
              style="margin: auto"
          />
          <!-- Overlay chứa icon camera -->
          <div
              class="overlay-camera"
              @click="triggerFileInput"
          >
            <i class="fas fa-camera"></i>
          </div>
          <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleFileChange" />

        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Tên phòng ban <span class="text-danger">*</span></label>
          <input
              v-model="departmentForm.departmentName"
              type="text"
              class="form-control form-control-sm"
              placeholder="Nhập tên phòng ban"
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Mô tả <span class="text-danger">*</span></label>
          <DescriptionEditor v-model="departmentForm.description" />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Địa chỉ <span class="text-danger">*</span></label>
          <AddressSelector
              v-model="departmentForm.address"
              :key="addressKey"
          />
        </div>


        <div class="mb-4">
          <label class="form-label fw-semibold">
            Trưởng phòng <span class="text-danger">*</span>
          </label>

          <!-- Nếu có nhân sự -->
          <select
              v-if="departmentForm.listEmployees && departmentForm.listEmployees.length > 0"
              v-model="departmentForm.manager.managerId"
              class="form-select form-select-sm"
          >
            <option :value="null">-- Chưa có trưởng phòng --</option>
            <option
                v-for="m in departmentForm.listEmployees"
                :key="m.managerId"
                :value="m.managerId"
            >
              {{ m.fullName }} - {{ m.email }}
            </option>
          </select>

          <!-- Nếu chưa có nhân sự -->
          <div v-else class="text-muted fst-italic" style="margin-bottom: 25px;">
            Hãy thêm nhân sự vào phòng ban rồi chọn trưởng phòng.
          </div>
        </div>


        <div class="d-flex flex-column gap-2" v-if="departmentForm.departmentName">
          <a
              href="#"
              class="text-decoration-none small mt-2"
              :class="{
        'text-muted pointer-events-none': !departmentForm.departmentName, // khi rỗng
        'text-primary': departmentForm.departmentName // khi có tên
      }"
              :style="!departmentForm.departmentName ? 'cursor: not-allowed; opacity: 0.6;' : ''"
              @click.prevent="goToEmployee"
          >
            📋 Xem danh sách nhân sự
          </a>

          <a
              href="#"
              class="text-decoration-none small"
              :class="{
        'text-muted pointer-events-none': !departmentForm.departmentName,
        'text-primary': departmentForm.departmentName
      }"
              :style="!departmentForm.departmentName ? 'cursor: not-allowed; opacity: 0.6;' : ''"
              @click.prevent="goToTeamList"
          >
            👥 Xem danh sách nhóm
          </a>
        </div>

        <!-- Hai nút căn phải, sát nhau -->
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn btn-outline-secondary btn-sm px-3" @click="resetForm">Làm mới</button>
          <!-- Nếu chưa có id → hiện nút Thêm mới -->
          <button
              v-if="flag && authStore.listAuthority.includes('DEPARTMENT_CREATE')"
              class="btn btn-primary btn-sm px-3"
              @click="addDepartment"
          >
            <i class="fas fa-plus me-1"></i> Thêm mới
          </button>

          <!-- Nếu đã có id → hiện nút Cập nhật -->
          <button
              v-else-if=" !flag && authStore.listAuthority.includes('DEPARTMENT_UPDATE')"
              class="btn btn-success btn-sm px-3"
              @click="updateDepartment"
          >
            <i class="fas fa-save me-1"></i> Cập nhật
          </button>


        </div>


      </div>
    </div>

    <!-- Bảng phải -->
    <div class="table-section card border rounded-4 shadow-sm overflow-hidden d-flex flex-column" style="height: 100%">
      <div class="card-header fw-semibold small-text  border-bottom rounded-top-3"
                style="background-color: #fff3b0">
        Danh sách phòng ban
      </div>

      <div class="table-container flex-grow-1 overflow-auto">
        <table class="table align-middle modern-table small-text mb-0">
          <thead>
          <tr>
            <th>STT</th>
            <th>Tên phòng ban</th>
            <th>Ảnh</th>
            <th>Địa chỉ</th>
            <th>Trưởng phòng</th>
            <th class="text-center">Hành động</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(dept, index) in departments" :key="index">
            <td>{{ String(index + 1).padStart(2, '0') }}</td>
            <td>{{ dept.departmentName }}</td>
            <td>
              <img :src="` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${dept.profileImage}`" class="avatar-table" />
            </td>
            <td class="text-truncate address-cell" :title="dept.address">{{ formatAddress(dept.address) }}</td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <img v-if="dept.manager"
                    class="avatar-small"
                    :src="dept?.manager?.avatar ? ` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${dept.manager.avatar}` : '/images/default-avatar.png'"
                    alt=""
                />
                <div>
                  <div v-if="dept.manager" class="fw-semibold">{{ dept.manager.fullName }}</div>
                  <div
                                        v-else
                                        class="fw-semibold d-flex align-items-center gap-2 p-1 px-2 text-danger"
                                        style="
                      background-color: #fde8e8;       /* đỏ nhạt */
                      border: 1px solid #f5b5b5;      /* viền đỏ nhạt hơn chữ */
                      border-radius: 12px;            /* bo góc nhiều hơn */
                      font-size: 0.9rem;              /* chữ nhỏ gọn hơn */
                      line-height: 1.2;               /* giảm chiều cao */
                    "
                                    >
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Chưa có quản lý</span>
                  </div>

                  <div class="text-muted extra-small">{{ dept?.manager?.email || '' }}</div>
                </div>
              </div>
            </td>
            <td class="text-center">
              <button
                  v-if="authStore.listAuthority.includes('DEPARTMENT_UPDATE') || authStore.listAuthority.includes('DEPARTMENT_UPDATE')"
                  class="btn btn-soft-primary btn-sm me-1"
                  @click="getEdit(dept.departmentName)"
              >
                <i class="fa-solid fa-pen"></i>
              </button>
              <button v-if="authStore.listAuthority.includes('DEPARTMENT_DELETE')" class="btn btn-soft-danger btn-sm" @click="deleteDepartment(dept.departmentName)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import api from "../api/api.js";
import {showError, showSuccess, showWarning} from "../assets/js/alertService.js";
import { useAuthStore } from "../stores/authStore.js";
import { useSidebarStore } from "../stores/sidebarStore.js";
import DescriptionEditor from "./common/DescriptionEditor.vue";
import AddressSelector from "./land/my-valuation/components/AddressSelector.vue";
const authStore = useAuthStore();
const info = authStore.userInfo;
const sidebar = useSidebarStore();
const addressKey = ref(0);


function validateDepartment() {
  const form = departmentForm.value;

  // ===== VALIDATE TÊN PHÒNG BAN =====
  if (!form.departmentName || form.departmentName.trim() === "") {
    showWarning("Dữ liệu chưa hợp lệ!", "Tên phòng ban không được bỏ trống.");
    return false;
  }

  if (form.departmentName.length < 10) {
    showWarning("Dữ liệu chưa hợp lệ!", "Tên phòng ban phải có ít nhất 10 ký tự.");
    return false;
  }

  if (form.departmentName.length > 55) {
    showWarning("Dữ liệu chưa hợp lệ!", "Tên phòng ban quá dài .");
    return false;
  }

  // ===== VALIDATE MÔ TẢ =====
  if (!form.description || form.description.trim() === "") {
    showWarning("Dữ liệu chưa hợp lệ!", "Mô tả không được để trống.");
    return false;
  }

  if (form.description.length < 20 ) {
    showWarning("Dữ liệu chưa hợp lệ!", "Mô tả phải có ít nhất 20 ký tự.");
    return false;
  }

  if (form.description.length > 550) {
    showWarning("Dữ liệu chưa hợp lệ!", "Mô tả quá dài (tối đa 550 ký tự)");
    return false;
  }

  // ===== VALIDATE ĐỊA CHỈ =====
  if (!form.address || form.address.trim() === "") {
    showWarning("Dữ liệu chưa hợp lệ!", "Địa chỉ phòng ban không được để trống.");
    return false;
  }

  // ===== VALIDATE FILE ẢNH (CHỈ KHI THÊM MỚI) =====
  if (flag.value === true && !selectedFile.value) {
    showWarning("Dữ liệu chưa hợp lệ!", "Bạn cần chọn ảnh đại diện cho phòng ban.");
    return false;
  }

  return true;
}

function formatAddress(address) {
  if (!address) return "";
  return address.replace(/\s*\/!!\s*/g, ", ");
}

const previewImage = ref();
const managers = ref([
  { name: "Ngô Quốc Phú", email: "ngoquocphu71@gmail.com" },
  { name: "Nguyễn Thế Dương", email: "duong@example.com" },
]);

const departmentForm = ref({
  oldDepartmentName: null,   // ✅ thêm
  departmentName: "",
  description: "",
  address: "",
  profileImage: "",
  manager: {
    managerId: null
  },
  listEmployees: []
});

const flag = ref(true);
const departments = ref([]);

const openAddForm = () => alert("Mở form thêm phòng ban");


async function getTable(){
  try {
    const res = await api.get("/admin.thg/department/view", {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    departments.value = res.data;
    console.log(departments.value);
    return null;
  } catch (err) {
    const message = err.response?.data || null;
    console.log(message);
    console.error(err);
  }
}

async function getEdit(name) {
  try {
    flag.value = false;
    const res = await api.get(`/admin.thg/department/view/${name}`, {
      withCredentials: true,
    });

    // ✅ Kiểm tra kết quả trả về
    if (res.data.status === "error") {
      showWarning("Không thể xem phòng ban", res.data.message);
      return;
    }

    // ✅ Lấy dữ liệu chính xác
    const data = res.data.data ?? {};
    departmentForm.value = {
      ...departmentForm.value,
      ...data,
      oldDepartmentName: data.departmentName, // ✅ LƯU TÊN CŨ
      manager: data.manager ?? { managerId: null },
    };
    addressKey.value++;
    previewImage.value = null;
    selectedFile.value = null;

    console.log("📦 Dữ liệu phòng ban:", departmentForm.value);
  } catch (err) {
    console.error("❌ Lỗi khi gọi API:", err);
    showError("Lỗi hệ thống", "Không thể tải thông tin phòng ban!");
  }
}


const fileInput = ref(null);
const triggerFileInput = () => {
  fileInput.value.click();
};

const selectedFile = ref(null); // <--- file thật để upload

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file; // ✅ lưu lại để gửi BE
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result; // hiển thị ảnh chọn
    };
    reader.readAsDataURL(file);
  }
};



onMounted(async () => {
  await getTable();
});

async function addDepartment() {

  if (!validateDepartment()) return;

  try{
    const formData = new FormData();
    formData.append("departmentForm", new Blob([JSON.stringify(departmentForm.value)], { type: "application/json" }));
    formData.append("file", selectedFile.value);
    console.log("Gửi về BE", departmentForm.value);
    const { data } = await api.post("/admin.thg/department/add", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    showSuccess("Thêm mới thành công !", "Thêm một phòng ban đã được ghi vào hệ thống.");
    resetForm();
    await getTable();

    return;
  }catch (err){
    showError("Cập nhật thất bại !", "Dữ liệu chưa được ghi nhận.");
  }
};


async function updateDepartment() {

  if (!validateDepartment()) return;

  try{
    const formData = new FormData();
    formData.append("departmentForm", new Blob([JSON.stringify(departmentForm.value)], { type: "application/json" }));
    formData.append("file", selectedFile.value);
    console.log("Gửi về BE", departmentForm.value);
    const { data } = await api.post("/admin.thg/department/update", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    showSuccess("Cập nhật thành công !", "Dữ liệu đã được ghi nhận.");
    await getTable();
    await getEdit(departmentForm.value.departmentName);


    return;
  }catch (err){
    showError("Cập nhật thất bại !", "Dữ liệu chưa được ghi nhận.");
  }

}

const resetForm = () => {
  addressKey.value--;
  departmentForm.value = {
    departmentName: "",
    description: "",
    address: "",
    profileImage: "",
    manager: {
      managerId: null
    },
    listEmployees: []
  };
  selectedFile.value= null;
  previewImage.value = '';
  flag.value = true;
};

async function deleteDepartment(name) {
  try{
    const res = await api.delete("/admin.thg/department/remove/" + name, {
      withCredentials: true
    });
    showSuccess("Xóa phòng ban thành công !");
    await getTable();
    resetForm();
    return;
  }catch (err){
    showError("Xóa thất bại!", "Đã có lỗi sảy ra !");
  }

}


import { useRouter } from 'vue-router'
import NotificationBell from "./NotificationBell.vue";

const router = useRouter()

function goToEmployee() {
  // ✅ Lưu tên phòng ban vào localStorage
  localStorage.setItem('departmentName', departmentForm.value.departmentName)
  // ✅ Chuyển hướng sang trang /-thg/nhan-vien (SPA, không reload)
  router.push('/-thg/nhan-vien')
}
</script>

<style scoped>
.small-text { font-size: 0.9rem; }
.extra-small { font-size: 0.75rem; }

/* === Layout chính === */
.main-layout {
  display: flex;
  gap: 16px;
  height: calc(100vh - 110px);
}
.form-section {
  width: 31%;
  min-width: 320px;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 16px;
}
.table-section {
  flex: 1;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
}

/* === Avatar === */
.avatar-form {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.25);
  object-fit: cover;
}
.avatar-table {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.2);
  object-fit: cover;
}
.avatar-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 0.5px solid rgba(0,0,0,0.15);
  object-fit: cover;
}

/* === Bảng === */
.table-container {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.3) transparent;
}
.table-container::-webkit-scrollbar {
  width: 6px;
}
.table-container::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
  border-radius: 6px;
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

.address-cell {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* === Mềm mại === */
.card,
.form-control,
.form-select,
.btn {
  border-radius: 12px !important;
}

/* === Nút mềm === */
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
.modern-table th:first-child,
.modern-table td:first-child {
  padding-left: 24px !important;
}

.department-form {
  font-size: 0.95rem; /* tăng cỡ chữ một chút */
}

/* Giãn khoảng cách giữa label và input group */
.department-form .form-label {
  margin-bottom: 6px;
}

.department-form .mb-3,
.department-form .mb-4 {
  margin-bottom: 1.25rem !important; /* khoảng cách giữa các group input */
}

/* Nút mềm mại hơn */
.department-form .btn {
  font-size: 0.9rem;
  border-radius: 8px;
}

/* Ảnh avatar trong form lớn hơn nhẹ */
.avatar-form {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.25);
  object-fit: cover;
}
.main-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

/* Form bên trái – tự cao, không cuộn */
.form-section {
  width: 31%;
  min-width: 320px;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 16px;
  background: #fff;
}

/* Bảng bên phải – cố định cao theo viewport */
.table-section {
  flex: 1;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 16px;
  height: 1000px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px); /* ✅ giữ đúng chiều cao phần nội dung */
  overflow: hidden; /* tránh tràn */
}

/* Thanh cuộn chỉ trong phần bảng */
.table-container {
  flex-grow: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.3) transparent;
}
.table-container::-webkit-scrollbar {
  width: 6px;
}
.table-container::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.3);
  border-radius: 6px;
}
.avatar-form {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ddd;
  transition: 0.3s;
}

/* overlay icon */
.overlay-camera {
  margin-top: 10px;
  color: #a4a3a3;
}

.overlay-camera:hover {
  cursor: pointer;            /* chuột hình bàn tay */
  transform: scale(1.05);
  color: #426ba8;/* phóng to nhẹ overlay */
}

.overlay-camera i {
  font-size: 24px;
}

/* hover hiện overlay */
.text-center:hover .overlay-camera {
  opacity: 1;
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
/* Modal nền */

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
