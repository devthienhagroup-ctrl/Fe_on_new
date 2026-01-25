<template>

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2 " style="border-bottom: solid 0.5px rgba(0,0,0,0.3)">
      <h5 class="fw-bold mb-0 d-flex align-items-center">
        <button
            v-if="authStore.listAuthority.includes('EMPLOYEE_CREATE')"
            @click="openModal3"
            class="btn border border-primary rounded-circle d-flex align-items-center justify-content-center  me-2"
            style="width: 40px; height: 40px;"
        >
          <i class="fa-solid fa-plus text-primary fs-5"></i>
        </button>
        Quản lý nhân sự
      </h5>

      <div class="d-flex align-items-center justify-content-end gap-2">
        <NotificationBell />
        <div class="d-flex flex-column align-items-end text-end">
          <div class="fw-semibold text-dark">{{ info.fullName }}</div>
        </div>

        <img
            v-if="info.avatarUrl"
            :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + info.avatarUrl"
            alt="avatar"
            class="rounded-circle border"
            style="width: 36px; height: 36px; object-fit: cover;"
        />
        <div v-else class="avatar-circle">
          {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
        </div>
      </div>
    </div>

    <!-- Filter bar -->
    <div
        class="filter-bar bg-light border rounded-4 px-3 py-2 d-flex align-items-center mb-3 mx-3"
    >
      <!-- Thông tin hiển thị -->
      <span class="small text-muted me-3">
      Hiển thị
      <input
          type="number"
          min="1"
          :max="total"
          v-model.number="size"
          class="inputNumber form-control-sm text-center mx-1 border rounded px-1"
      />
      / <b>{{ total }}</b> bản ghi
    </span>

      <!-- Pagination -->
      <div class="d-flex align-items-center ms-2">
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

      <!-- Bộ lọc -->
      <div class="d-flex align-items-center gap-2 flex-wrap ms-auto">
        <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Nhập tên nhân sự cần tìm..."
            style="width: 220px"
            v-model="search"
        />
        <button class="btn btn-primary btn-sm" @click="searchBTN">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>

        <select
            class="form-select form-select-sm"
            style="width: 160px"
            v-model="selectedDept"
        >
          <option value="">Tất cả phòng ban</option>
          <option v-for="dept in departments" :key="dept" :value="dept">
            {{ dept }}
          </option>
        </select>

        <select
            class="form-select form-select-sm"
            style="width: 160px"
            v-model="selectedGroup"
        >
          <option value="">Tất cả các nhóm</option>
          <option v-for="grp in groups" :key="grp" :value="grp">
            {{ grp }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="table-responsive border rounded-4 shadow-sm mx-3">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-header text-nowrap">
        <tr>
          <th class="fw-semibold text-start">Họ & Tên</th>
          <th class="fw-semibold text-start">Avatar</th>
          <th class="fw-semibold text-start">Email</th>
          <th class="fw-semibold text-start">Số điện thoại</th>
          <th class="fw-semibold text-start">Giới tính</th>
          <th class="fw-semibold text-start">Chức vụ</th>
          <th class="fw-semibold text-start">Phòng ban</th>
          <th class="fw-semibold text-start">Nhóm</th>
          <th class="fw-semibold text-start">Trạng thái</th>
          <th class="fw-semibold text-end">Hành động</th>
        </tr>
        </thead>


        <tbody>
        <tr v-for="(nv, i) in nhanSuList" :key="i" class="text-nowrap" style="font-size: 14px;">
          <!-- Họ tên -->
          <td class="text-start"> {{nv.fullName }}</td>

          <!-- Avatar -->
          <td>
            <div class="d-flex align-items-center">
              <img
                  v-if="nv.avatar"
                  :src="` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${nv.avatar}`"
                  alt="avatar"
                  class="avatar-img"
              />
              <div
                  v-else
                  class="rounded-circle bg-light d-flex justify-content-center align-items-center text-muted"
                  style="width:35px;height:35px"
              >
                {{ (nv.fullName || '?').charAt(0) }}
              </div>
            </div>
          </td>

          <!-- Email -->
          <td class="text-start">{{ nv.email }}</td>

          <!-- Số điện thoại -->
          <td class="text-start">{{ nv.phone }}</td>

          <!-- Giới tính -->
          <td class="text-start">{{ nv.gender ? 'Nam' : 'Nữ' }}</td>

          <!-- Chức vụ (map về tiếng Việt nếu cần) -->
          <td class="text-start">{{ nv.roleName }}</td>

          <!-- Phòng ban -->
          <td v-if="nv.departmentAvatar != null" class="text-start">
            <div class="d-flex align-items-center gap-2">
              <img
                  v-if="nv.departmentAvatar"
                  :src="` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${nv.departmentAvatar}`"
                  class="avatar-img"
              />
              <div
                  v-else
                  class="rounded-circle bg-light"
                  style="width:35px;height:35px"
              />
              <span>{{ nv.departmentName }}</span>
            </div>
          </td>
          <td v-else>
              Chưa có phòng ban
          </td>

          <!-- Nhóm (chỉ hiển thị nhóm đầu tiên + đếm phần còn lại) -->
          <td class="text-start">
            <template v-if="nv.teams && nv.teams.length">
              <div class="d-flex align-items-center gap-2">
                <img
                    :src="` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${nv.teams[0].avatar}`"
                    class="avatar-img"
                />
                <span>{{ nv.teams[0].name }}</span>
                <span v-if="nv.teams.length > 1" class="badge bg-light text-muted">
              +{{ nv.teams.length - 1 }}
            </span>
              </div>
            </template>
            <template v-else> Chưa có nhóm </template>
          </td>

          <!-- Trạng thái -->
          <td class="text-start">
        <span
            class="badge rounded-pill px-3 py-2"
            :class="nv.status ? 'status-on' : 'status-off'"
        >
          {{ nv.status ? 'Hoạt động' : 'Ngừng hoạt động' }}
        </span>
          </td>

          <!-- Hành động (đẩy sang phải, nút nền mềm) -->
          <td class="text-end">
            <div class="d-flex justify-content-end gap-2">
              <button
                  class="btn btn-sm btn-soft-primary"
                  title="Xem"
                  @click="openDetail(nv)"
              >
                <i class="fa-regular fa-eye"></i>
              </button>
              <button  v-if="authStore.listAuthority.includes('EMPLOYEE_UPDATE')" class="btn btn-sm btn-soft-success" title="Sửa" @click="openModal2(nv.employeeID)">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button v-if="authStore.listAuthority.includes('EMPLOYEE_DELETE')" class="btn btn-sm btn-soft-danger" title="Xóa" @click="deleteEmployee(nv.employeeID)">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

<div
    v-if="detailVisible"
    class="modal fade show d-block bg-black bg-opacity-50"
    tabindex="-1"
>
<div class="modal-dialog modal-lg modal-dialog-centered">
  <div class="modal-content rounded-4 shadow-sm p-5">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
      <h5 class="fw-bold text-primary mb-0">Chi tiết nhân sự</h5>
      <button type="button" class="btn btn-light btn-sm" @click="closeDetail">
        <i class="fa-solid fa-xmark fs-5"></i>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="detailLoading" class="text-center py-5 text-secondary">
      <div class="spinner-border text-primary mb-2" role="status"></div>
      <div>Đang tải dữ liệu...</div>
    </div>

    <!-- Error -->
    <div v-else-if="detailError" class="alert alert-danger text-center">
      {{ detailError }}
    </div>

    <!-- Body -->
    <div v-else-if="detail" class="row g-3">

      <!-- Avatar -->


      <!-- Thông tin chung -->
      <div class="col-md-12">
        <div class="row mb-3 mt-1">
          <div class="col-md-6 d-flex justify-content-center align-items-start">
            <img
                :src="detail.avatarUrl"
                alt="Avatar"
                class="rounded-circle"
                width="180"
                height="180"
                style="border: solid 1px black"
            />
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <strong >Họ tên:</strong> {{ detail.fullName }}
            </div>
            <div>
              <strong >Giới tính:</strong> {{ detail.gender ? 'Nam' : 'Nữ' }}
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-sm-6"><strong>Email:</strong> {{ detail.email }}</div>
          <div class="col-sm-6"><strong>Số điện thoại:</strong> {{ detail.phone }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-sm-6"><strong>Chức vụ:</strong> {{ detail.roleName }}</div>
          <div class="col-sm-6">
            <strong>Trạng thái:</strong>
            <span
                class="badge rounded-pill px-3 py-2 ms-2"
                :class="detail.status ? 'status-on' : 'status-off'"
            >
          {{ detail.status ? 'Hoạt động' : 'Ngừng hoạt động' }}
        </span>
          </div>
        </div>
        <div class="row mb-3 align-items-center">
          <div class="col-sm-6 d-flex align-items-center gap-2">
            <strong>Phòng ban:</strong>
            <div v-if="detail.departmentName != null">
              <img :src="detail.departmentAvatarUrl" class="rounded-circle border" width="30" height="30" />
              <span>{{ detail.departmentName }}</span>
            </div>
            <div v-else class="text-muted">
                Chưa có phòng ban
            </div>
          </div>
          <div class="col-sm-6 d-flex align-items-center gap-2 flex-wrap">
            <strong>Nhóm:</strong>
            <template  v-if=" detail.teams && detail.teams.length">
              <div v-for="t in detail.teams" :key="t.id" class="d-flex align-items-center gap-1">
                <img :src="' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'+t.avatar" class="rounded-circle border" width="28" height="28" />
                <span>{{ t.name }}</span>
              </div>
            </template>
            <span v-else class="text-muted">Chưa có nhóm nào !</span>
          </div>
        </div>
      </div>

      <!-- Dự án -->
      <div class="col-12">
        <strong>Các dự án đã tham gia:</strong>
        <div class="border rounded-3 overflow-hidden shadow-sm mt-4">
          <table class="table table-sm align-middle mb-0">
            <thead class="table-light text-center">
            <tr>
              <th>Khoảng thời gian</th>
              <th>Tên dự án</th>
              <th>Vai trò</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!detail.expEePros || !detail.expEePros.length">
              <td colspan="2" class="text-center text-muted">Chưa tham gia dự án nào</td>
            </tr>
            <tr v-for="(p, i) in detail.expEePros" :key="i">
              <td class="text-center">
                {{ formatDate(p.startTime) }} - {{ formatDate(p.endTime) }}
              </td>
              <td>{{ p.projectName }}</td>
              <td>{{ p.roleProject }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</div>
</div>
<div
    v-if="flagOpenModal2"
    class="modal fade show d-block bg-black bg-opacity-50"
    tabindex="-1"
>
<div class="modal-dialog modal-lg modal-dialog-centered">
  <div class="modal-content p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
      <h5 class="fw-bold text-primary mb-0">Chỉnh sửa nhân sự</h5>
      <button type="button" class="btn btn-light btn-sm" @click="closeUpdate">
        <i class="fa-solid fa-xmark fs-5"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="modal-body mb-3">
      <div class="row align-items-center mb-3">
        <div class="col-md-12 d-flex align-items-end">
          <!-- Ảnh đại diện -->
          <label for="avatarInput" class="position-relative" style="cursor: pointer;">
            <img
                :src="previewAvatar"
                alt="Avatar"
                class="rounded-circle border me-3"
                width="180"
                height="180"
                style="border: 1px solid black; object-fit: cover;"
            />
            <!-- icon overlay khi hover -->
            <div
                class="position-absolute top-50 start-50 translate-middle text-white bg-dark bg-opacity-50 rounded-circle p-2"
                style="opacity: 0; transition: 0.3s;"
                id="overlayIcon"
            >
              <i class="fa-solid fa-camera"></i>
            </div>
          </label>

          <!-- input file ẩn -->
          <input
              id="avatarInput"
              type="file"
              accept="image/*"
              class="d-none"
              @change="onAvatarChange"
          />
          <div>
            <label class="form-label">
              Tên nhân sự <span class="text-danger">*</span>
            </label>
            <input
                type="text"
                class="form-control"
                v-model="detailUpdate.fullName"
            />
            <div class="col-md-6 mt-3">
              <label class="form-label">Giới tính</label>
              <div class="d-flex gap-4">
                <div class="form-check">
                  <input class="form-check-input" type="radio" :value="true"  v-model="detailUpdate.gender" id="genderMale">
                  <label class="form-check-label" for="genderMale">Nam</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" :value="false" v-model="detailUpdate.gender" id="genderFemale">
                  <label class="form-check-label" for="genderFemale">Nữ</label>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <form @submit.prevent="updateEmployee">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Email nhân sự <span class="text-danger">*</span></label>
            <input type="email" class="form-control" v-model="detailUpdate.email" />
          </div>

          <div class="col-md-6">
            <label class="form-label">Số điện thoại nhân sự <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="detailUpdate.phone" />
          </div>

          <!-- 🌟 Chức vụ -->
          <div class="col-md-6">
            <label class="form-label">Chức vụ <span class="text-danger">*</span></label>

            <!-- Có quyền toàn hệ thống -->
            <select
                v-if="authStore.listAuthority.includes('EMPLOYEE_UPDATE_ROLE')"
                class="form-select"
                v-model="detailUpdate.roleName"
            >
              <option
                  v-for="role in detailUpdate.roleOptions"
                  :key="role.roleName"
                  :value="role.roleName"
              >
                {{ role.roleName }}
              </option>
            </select>

            <!-- Không có quyền chỉnh -->
            <input
                v-else
                type="text"
                class="form-control bg-light text-secondary"
                :value="detailUpdate.roleName"
                readonly
            />
          </div>

          <!-- 🌟 Trạng thái -->
          <div class="col-md-6">
            <label class="form-label">Trạng thái <span class="text-danger">*</span></label>

            <select
                v-if="authStore.listAuthority.includes('EMPLOYEE_UPDATE_ROLE')"
                class="form-select fw-semibold"
                v-model="detailUpdate.status"
                :class="statusSelectClass"
            >
              <option :value="true">Hoạt động</option>
              <option :value="false">Không hoạt động</option>
            </select>

            <input
                v-else
                type="text"
                class="form-control bg-light text-secondary fw-semibold"
                :value="detailUpdate.status ? 'Hoạt động' : 'Không hoạt động'"
                readonly
            />
          </div>




          <!-- Phòng ban -->
          <div class="col-md-6">
            <label class="form-label">Phòng ban <span class="text-danger">*</span></label>

            <!-- Nếu có quyền sửa toàn bộ -->
            <select
                v-if="authStore.listAuthority.includes('EMPLOYEE_UPDATE_ROLE')"
                class="form-select"
                v-model="selectedDepartment"
            >
              <option v-if="detailUpdate.departments.length <= 0" value="">Chưa có phòng ban</option>
              <option
                  v-for="dept in detailUpdate.departments"
                  :key="dept.name"
                  :value="dept.name"
              >
                {{ dept.name }}
              </option>
            </select>

            <!-- Nếu chỉ có quyền trong phòng mình -->
            <input
                v-else
                type="text"
                class="form-control bg-light"
                :value="detailUpdate.departmentName"
                readonly
            />
          </div>


          <!-- Nhóm -->
          <div class="col-md-6">
            <label class="form-label">Nhóm</label>

            <div
                v-if="detailUpdate.teams && detailUpdate.teams.length"
                class="d-flex flex-column gap-2"
            >
              <div
                  v-for="(team, index) in detailUpdate.teams"
                  :key="index"
                  class="d-flex align-items-center border rounded p-2 bg-light"
              >
                <img
                    :src="team.avatar ? ' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + team.avatar : '/images/default-team.png'"
                    alt="avatar"
                    class="me-3"
                    style="width: 20px; height: 20px; object-fit: cover; border-radius: 8px;"
                />
                <div class="fw-semibold">{{ team.name }}</div>&nbsp;&nbsp;
                <small class="text-muted">  Vai trò: {{ team.role }}</small>

              </div>
            </div>

            <div v-else class="text-muted fst-italic">
              Chưa có nhóm nào !
            </div>
          </div>

        </div>
      </form>
    </div>

    <!-- Footer -->
    <div class="modal-footer d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="closeUpdate">Hủy</button>
      <button type="button" class="btn btn-primary" @click="updateEmployee" >Cập nhật</button>
    </div>
  </div>
</div>
</div>

<div
    v-if="flagOpenModal"
    class="modal fade show d-block bg-black bg-opacity-50"
    tabindex="-1"
>
<div class="modal-dialog modal-lg modal-dialog-centered" style="max-width: 550px;">
  <div class="modal-content p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
      <h5 class="fw-bold text-primary mb-0">Thêm nhân sự mới</h5>
      <button type="button" class="btn btn-light btn-sm" @click="closeModal">
        <i class="fa-solid fa-xmark fs-5"></i>
      </button>
    </div>

    <!-- Body -->
    <div class="modal-body mb-3">
      <div class="row align-items-center mb-3">
        <div class="col-md-12 d-flex align-items-end">
          <!-- Ảnh đại diện -->
          <label for="avatarInputNew" class="position-relative" style="cursor: pointer;">
            <img
                :src="previewAvatarNew"
                alt="Avatar"
                class="rounded-circle border me-3"
                width="180"
                height="180"
                style="border: 1px solid black; object-fit: cover;"
            />
            <div
                class="position-absolute top-50 start-50 translate-middle text-white bg-dark bg-opacity-50 rounded-circle p-2"
                style="opacity: 0; transition: 0.3s;"
                id="overlayIcon"
            >
              <i class="fa-solid fa-camera"></i>
            </div>
            <div
                class="position-absolute top-50 start-50 translate-middle text-white bg-dark bg-opacity-50 rounded-circle p-2"
                style="opacity: 0; transition: 0.3s;"
                id="overlayIconNew"
            >
              <i class="fa-solid fa-camera"></i>
            </div>
          </label>

          <!-- input file ẩn -->
          <input
              id="avatarInputNew"
              type="file"
              accept="image/*"
              class="d-none"
              @change="onAvatarChange2"
          />

          <!-- Tên và giới tính -->
          <div>
            <label class="form-label">
              Tên nhân sự <span class="text-danger">*</span>
            </label>
            <input
                type="text"
                class="form-control"
                style="width: 272px"
                v-model="newE.fullName"
            />
            <div class="mt-3 ">
              <label class="form-label">Giới tính</label>
              <div class="d-flex gap-4 ps-4">
                <div class="form-check me-4" >
                  <input class="form-check-input" type="radio" :value="true" v-model="newE.gender" id="genderMaleNew">
                  <label class="form-check-label" for="genderMaleNew">Nam</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" :value="false" v-model="newE.gender" id="genderFemaleNew">
                  <label class="form-check-label" for="genderFemaleNew">Nữ</label>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="createEmployee">
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">Email nhân sự <span class="text-danger">*</span></label>
            <input type="email" class="form-control" v-model="newE.email" />
          </div>

          <div class="col-12">
            <label class="form-label">Số điện thoại nhân sự <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="newE.phone" />
          </div>

          <div class="col-12">
            <label class="form-label">Chức vụ <span class="text-danger">*</span></label>
            <select class="form-select" v-model="newE.roleName">
              <option
                  v-for="role in roleOptions"
                  :key="role.roleName"
                  :value="role.roleName"
              >
                {{ role.roleName }}
              </option>
            </select>
          </div>

          <!-- Phòng ban -->
          <div class="col-12">
            <label class="form-label">Phòng ban <span class="text-danger">*</span></label>
            <select class="form-select" v-model="newE.selectedDepartment">
              <option v-if="departmentForNews.length <= 0" value="" key=""> Chưa có phòng ban </option>
              <option
                  v-for="dept in departmentForNews"
                  :key="dept"
                  :value="dept"
              >
                {{ dept }}
              </option>
            </select>
          </div>
        </div>
      </form>
    </div>

    <!-- Footer -->
    <div class="modal-footer d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" @click="closeModal">Hủy</button>
      <button type="button" class="btn btn-primary" @click="createEmployee">Lưu</button>
    </div>
  </div>
</div>
</div>
</template>
<script setup>
import NotificationBell from "./NotificationBell.vue";

const statusSelectClass = computed(() => {
  return detailUpdate.value.status
      ? "text-success"
      : "text-danger";
});
import { ref, computed, watch, onMounted } from "vue";
import { useAuthStore } from "../stores/authStore.js";
import api from "../api/api.js";
import {nextTick} from "vue";
import { showSuccess, showError, showWarning } from "../assets/js/alertService.js";



// ========= Pagination & Filter =========
const total = ref(0);
const page = ref(1);
const size = ref(10);
const pageSize = ref(10);
const search = ref("");
const selectedDept = ref("");
const selectedGroup = ref("");
const departmentsData = ref([]);
const departments = ref([]);
const groups = ref([]);
const isAutoAdjustingSize = ref(false);
const totalPages = ref(0);
const pageString = computed(
    () =>
        `${String(page.value).padStart(2, "0")} / ${String(totalPages.value).padStart(
            2,
            "0"
        )}`
);

const goToFirstPage = () => (page.value = 1);
const goToLastPage = () => (page.value = totalPages.value);
const prevPage = () => page.value > 1 && page.value--;
const nextPage = () => page.value < totalPages.value && page.value++;

const authStore = useAuthStore();
const info = authStore.userInfo;

// ========= Danh sách nhân sự =========
const nhanSuList = ref([]);

// ========= Gọi API lấy danh sách phòng ban + nhóm =========
async function getDepartments() {
  try {
    const token = authStore.accessToken;

    const response = await api.get("/admin/api/getInit", {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    departmentsData.value = response.data;
    departments.value = response.data.map((d) => d.name);
    groups.value = response.data.flatMap((d) => d.listTeams.map((t) => t.name));
  } catch (error) {
    console.error("Lỗi khi lấy department:", error);
  }
}
// ========= Gọi API lấy danh sách nhân sự =========
const suppressSizeWatch = ref(false); // khóa an toàn

// ========= Gọi API lấy danh sách nhân sự =========
async function fetchEmployees() {
  try {


    const token = authStore.accessToken;
    const params = {
      page: page.value,
      size: size.value,
      ...(search.value ? { name: search.value } : {}),
      ...(selectedDept.value ? { department: selectedDept.value } : {}),
      ...(selectedGroup.value ? { teamName: selectedGroup.value } : {}),
    };

    const response = await api.get("/admin/api/find", {
      headers: { Authorization: `Bearer ${token}` },
      params,
      withCredentials: true,
    });

    const data = response.data;
    nhanSuList.value = data.content || [];
    total.value = data.page.totalElements || 0;
    totalPages.value = data.page.totalPages || 0;

    // ⚡ Nếu total nhỏ hơn size, giảm size mà không trigger watcher
    if (size.value > total.value && total.value > 0) {
      isAutoAdjustingSize.value = true;
      size.value = total.value;
      await nextTick(); // đợi Vue cập nhật xong
      isAutoAdjustingSize.value = false;
    }

  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân sự:", error);
  }
}


// ========= Theo dõi thay đổi phòng ban =========
watch(selectedDept, (newDept) => {
  if (!newDept) {
    groups.value = departmentsData.value.flatMap((d) =>
        d.listTeams.map((t) => t.name)
    );
  } else {
    const dept = departmentsData.value.find((d) => d.name === newDept);
    groups.value = dept ? dept.listTeams.map((t) => t.name) : [];
  }

  page.value = 1;
  selectedGroup.value = "";
  if(selectedDept.value === ''  && selectedGroup.value ==='')
    size.value = 10;
  fetchEmployees();
});

// ========= Theo dõi thay đổi nhóm =========
watch(selectedGroup, () => {
  page.value = 1;
  if(selectedDept.value === ''  && selectedGroup.value ==='')
    size.value = 10;
  fetchEmployees();
});

// ========= Theo dõi tìm kiếm =========
watch(search, () => {
  clearTimeout(window.searchTimer);
  window.searchTimer = setTimeout(() => fetchEmployees(), 400);
  page.value = 1;
});

const searchBTN = () => {
  console.log("🔍 Nút tìm kiếm được nhấn!");
  fetchEmployees();
  return null;
};

// ========= Theo dõi thay đổi trang =========
watch(page, () => {
  fetchEmployees();
});

// ========= Theo dõi đổi size page (gọi API nếu người dùng đổi) =========
watch(size, async (newVal, oldVal) => {
  if (isAutoAdjustingSize.value) return; // bỏ qua nếu hệ thống đang tự chỉnh size

  // Người dùng đổi size hợp lệ thì gọi API
  if (newVal < 1) {
    size.value = 1;
    return;
  }
  page.value = 1;
  await fetchEmployees();
});


// ========= Khởi tạo =========
onMounted(async () => {
  selectedDept.value = localStorage.getItem('departmentName') || '';
  localStorage.removeItem('departmentName');
  await getDepartments();
  await fetchEmployees();
});
let sizeTimer;
watch(size, (newVal, oldVal) => {
  if (isAutoAdjustingSize.value) return;
  clearTimeout(sizeTimer);
  sizeTimer = setTimeout(() => fetchEmployees(), 300);
});


const detailVisible = ref(false)
const detailLoading = ref(false)
const detailError = ref(null)
const detail = ref(null)


// ===== METHODS =====
function closeDetail() {
  detailVisible.value = false
  detail.value = null
}

function closeUpdate() {
  flagOpenModal2.value = false

  // ✅ Reset về object rỗng với cấu trúc ban đầu
  Object.assign(detailUpdate.value, {
    avatarUrl: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    group: '',
    status: '',
    activeStatus: '',
    // Thêm các field mới nếu có
    fullName: '',
    roleName: '',
    avatar: '',
    departmentName: '',
    departments: [],
    roleOptions: [],
    teams: []
  });

  // Reset các biến khác
  selectedDepartment.value = "";
  filteredTeams.value = [];

  previewAvatar.value = "";
  // Giữ file lại nếu sau này muốn gửi lên server

}

async function openDetail(empOrId) {
  const id = typeof empOrId === 'object'
      ? (empOrId.employeeID ?? empOrId.id)
      : empOrId

  if (!id) {
    console.warn('Thiếu ID nhân sự khi mở modal')
    return
  }

  detailVisible.value = true
  detailLoading.value = true
  detailError.value = null

  try {
    const { data } = await api.get(`/admin/api/detail/${id}`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      withCredentials: true,
    })

    // Chuẩn hóa đường dẫn ảnh
    const baseUrl = " https://s3.cloudfly.vn/thg-storage-dev/uploads-public/"
    detail.value = {
      ...data,
      avatarUrl: baseUrl + data.avatar,
      departmentAvatarUrl: baseUrl + data.departmentAvatar,
      projects: data.expEePros ?? [],
    }
    console.log( "View: " ,  detail)
  } catch (err) {
    console.error(`Lỗi tải chi tiết nhân sự ID=${id}:`, err)
    detailError.value = 'Không tải được chi tiết nhân sự.'
  } finally {
    detailLoading.value = false
  }
}

const formatDate = (d) =>
    new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(d))


const detailUpdate = ref({
})


const selectedDepartment = ref("")
const filteredTeams = ref([])


// ==== Hàm update ========
async function updateEmployee() {
  try {
    const formData = new FormData();

    if (detailUpdate.value.newAvatarFile) {
      formData.append("avatarNew", detailUpdate.value.newAvatarFile);
    }

    for (const key in detailUpdate.value) {
      if (["newAvatarFile", "departments", "roleOptions", "teams"].includes(key)) continue;

      let value = detailUpdate.value[key];
      if (key === "status" || key === "gender") {
        value = value ? "true" : "false";
      }
      formData.append(key, value ?? "");
    }

    console.log("🔍 FormData gửi lên:", [...formData.entries()]);

    // ✅ Chờ validate chạy xong
    const isValid = await validateForm(detailUpdate);
    if (!isValid) return;

    const res = await api.post("/admin/api/updateEmployee", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    console.log(res)

    const message = res.data.message;
    if (message.includes("thành công")) {
      showSuccess(message);
    }else{
      showWarning("Hành động không khả thi", message);
    }

    closeUpdate();
    await fetchEmployees();
  } catch (err) {
    console.log( "bị catch")
    return;
  }
}

async function validateForm(detailUpdate) {
  const emp = detailUpdate.value;

  if (!emp.fullName?.trim()) {
    showWarning("Thiếu thông tin", "Vui lòng nhập tên nhân sự.");
    return false;
  }
  if (!emp.email?.trim()) {
    showWarning("Thiếu thông tin", "Vui lòng nhập email nhân sự.");
    return false;
  }
  if (!validateEmail(emp.email)) { // ✅ sửa ở đây
    showWarning("Email không hợp lệ" , "Vui lòng nhập đúng định dạng email.");
    return false;
  }
  if (!emp.phone?.trim()) {
    showWarning("Thiếu thông tin", "Vui lòng nhập số điện thoại.");
    return false;
  }
  if (!/^(0|\+84)[0-9]{9,10}$/.test(emp.phone)) {
    showWarning("Số điện thoại không hợp lệ.");
    return false;
  }
  if (!emp.roleName) {
    showWarning("Thiếu thông tin", "Vui lòng chọn chức vụ.");
    return false;
  }
  if (emp.status === null || emp.status === undefined) {
    showWarning("Thiếu thông tin", "Vui lòng chọn trạng thái hoạt động.");
    return false;
  }
  if (!selectedDepartment.value) { // nếu selectedDepartment là ref
    showWarning("Thiếu thông tin", "Vui lòng chọn phòng ban.");
    return false;
  }

  return true;
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


const flagOpenModal2 = ref(false);

async function openModal2(id) {
  flagOpenModal2.value = true;
  try {
    const { data } = await api.get(`/admin/api/detail2/${id}`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
      withCredentials: true,
    });

    // ✅ merge đúng, giữ reactivity
    Object.assign(detailUpdate.value, {
      employeeID: data.employeeID,
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      roleName: data.roleName || "",
      status: data.status ?? true,
      gender: data.gender ?? null,
      avatar: data.avatar || "",
      departmentName: selectedDepartment || "",
      departments: data.departments || [],
      roleOptions: data.roleOptions || [],
      teams: data.teams || null,
    });

    selectedDepartment.value = data.departmentName || "";

    console.log("✅ Dữ liệu sau khi merge:", detailUpdate.value);
  } catch (err) {
    console.error("❌ Lỗi khi load dữ liệu nhân sự:", err);
  }
}


const previewAvatar = ref(""); // link ảnh hiển thị tạm

// 🧩 Cập nhật preview mỗi khi mở modal hoặc đổi avatar BE
watch(
    () => detailUpdate.value.avatar,
    (newAvatar) => {
      previewAvatar.value = newAvatar
          ? ` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${newAvatar}`
          : "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg";
    },
    { immediate: true }
);

// 🖼️ Khi chọn ảnh mới
function onAvatarChange(event) {
  const file = event.target.files[0];
  if (file) {
    // Tạo URL tạm để xem trước
    previewAvatar.value = URL.createObjectURL(file);
    // Giữ file lại nếu sau này muốn gửi lên server
    detailUpdate.value.newAvatarFile = file;
  }
}


//================= Hàm delete nhân viên ===============
import Swal from "sweetalert2";
async function deleteEmployee(idDeleted) {
  const result = await Swal.fire({
    title: "Xác nhận xóa?",
    text: "Bạn có chắc muốn xóa nhân viên này không?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Có, xóa ngay!",
    cancelButtonText: "Hủy",
  });
  if (!result.isConfirmed) {
    return; // Người dùng bấm Hủy
  }
  try {

    const res = await api.delete(`/admin/api/remove/` + idDeleted, {
      withCredentials: true,
    });
    console.log(res.data)
    const message = res.data;
    if (message.includes("thành công")) {
      showSuccess(message);
    }
    await fetchEmployees();
    return;
  } catch (err) {
    const message = err.response?.data || "Lỗi không xác định!";
    showError("Không thể thực hiện !", message);
  }
}


// Tạo mới
const roleOptions = ref([]);
const departmentForNews = ref([]);
const flagOpenModal = ref(false);
const previewAvatarNew = ref("https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-mens-default-avatar-png-image_2813163.jpg");
const newE = ref({
  fullName: "",
  gender: true,
  email: "",
  phone: "",
  status: true,
  roleName: "",
  selectedDepartment: ""

});

const closeModal = () => {
  flagOpenModal.value = false;
  previewAvatarNew.value = "https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-mens-default-avatar-png-image_2813163.jpg";

  newE.value = {
    fullName: "",
    gender: true,
    email: "",
    phone: "",
    status: true,
    roleName: "",
    selectedDepartment: ""
  };
};


const onAvatarChange2 = (e) => {
  const file = e.target.files[0];
  if (file) previewAvatarNew.value = URL.createObjectURL(file);
};


const openModal3 = async () => {
  flagOpenModal.value = true;
  await getRolesAnđepartment(); // tải danh sách chức vụ khi mở modal
};


async function getRolesAnđepartment() {
  try {
    const res = await api.get('/admin/api/getRolesAndDepartment', {
      withCredentials: true,
    });

    // gán danh sách roles
    roleOptions.value = res.data.roles || [];
    if (roleOptions.value.length > 0)
      newE.value.roleName = roleOptions.value[0].roleName;

    // gán danh sách departments
    departmentForNews.value = res.data.departments || [];
    if (departmentForNews.value.length > 0)
      console.log(departmentForNews);
    newE.value.selectedDepartment = departmentForNews.value[0];
  } catch (err) {
    const message = err.response?.data || "Lỗi không xác định!";
    showError("Không thể thực hiện!", message);
  }
}


const createEmployee = async () => {
  try {
    // Lấy file (nếu có)
    const fileInput = document.getElementById("avatarInputNew");
    const file = fileInput?.files[0] || null;

    // Tạo form data
    const formData = new FormData();

    // append toàn bộ thuộc tính của newE vào formData
    Object.keys(newE.value).forEach(key => {
      formData.append(key, newE.value[key]);
    });

    // Thêm file ảnh nếu có
    if (file) {
      formData.append("avatar", file);
    }
    const isValid = await validateForm2(newE);
    if (!isValid) return;
    // Gửi request
    const res = await api.post("/admin/api/createEmployee", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    showSuccess("Thành công", "Đã thêm nhân sự mới!");
    console.log("Tạo nhân sự mới:", res.data);

    closeModal();
    await fetchEmployees();
  } catch (err) {
    const message = err.response?.data || "Lỗi không xác định!";
    showError("Không thể thực hiện!", message);
  }
};

async function validateForm2(detailUpdate) {
  const emp = detailUpdate.value;

  if (!emp.fullName?.trim()) {
    showWarning("Thiếu thông tin", "Vui lòng nhập tên nhân sự.");
    return false;
  }

  if (!emp.email?.trim()) {
    showWarning("Thiếu thông tin", "Vui lòng nhập email nhân sự.");
    return false;
  }
  if (!validateEmail(emp.email)) { // ✅ sửa ở đây
    showWarning("Email không hợp lệ" , "Vui lòng nhập đúng định dạng email.");
    return false;
  }
  if (!emp.phone?.trim()) {
    showWarning("Thiếu thông tin", "Vui lòng nhập số điện thoại.");
    return false;
  }
  if (!/^(0|\+84)[0-9]{9,10}$/.test(emp.phone)) {
    showWarning("Số điện thoại không hợp lệ.");
    return false;
  }
  if (!emp.roleName) {
    showWarning("Thiếu thông tin", "Vui lòng chọn chức vụ.");
    return false;
  }
  if (emp.status === null || emp.status === undefined) {
    showWarning("Thiếu thông tin", "Vui lòng chọn trạng thái hoạt động.");
    return false;
  }
  if (!emp.selectedDepartment) { // nếu selectedDepartment là ref
    showWarning("Thiếu thông tin", "Vui lòng chọn phòng ban.");
    return false;
  }

  const fileInput = document.getElementById("avatarInputNew");
  const file = fileInput?.files[0] || null;

  if ( file == null){
    showWarning("Thiếu thông tin", "Vui lòng tải ảnh nhân sự.");
    return false;
  }

  return true;
}
</script>
<style scoped>
label[for="avatarInputNew"]:hover #overlayIconNew {
  opacity: 1 !important;
}
label[for="avatarInput"]:hover #overlayIcon {
  opacity: 1 !important;
}

.sidebar-menu {
  padding: 0 10px;
}

.sidebar-link {
  color: #333;
  font-size: 14px;
  transition: all 0.2s ease;
  border-radius: 15px;
  padding: 10px 0;
  display: block;
}

.sidebar-link:hover {
  color: #1274e5;
}

.active-item {
  background-color: rgba(238, 238, 241, 0.91);
  border-left: solid 4px #1274e5;
  border-radius: 12px;
}

.active-link {
  color: #1274e5 !important;
}

.active-link i {
  color: #1274e5;
}
.nav-link {
  font-size: 13px;
  color: #333;
  transition: 0.2s;
}
.nav-link:hover {
  color: #0d6efd;
  background-color: #e9f2ff;
  border-radius: 10px;
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
.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.table td,
.table th {
  vertical-align: middle;
}
.filter-bar select,
.filter-bar input {
  min-width: 130px;
}
.btn-danger-soft {
  color: #dc3545;
  border: none;
  transition: all 0.2s ease;
}
.table-header {
  background-color: #fff8e1; /* vàng nhạt nhẹ hơn table-warning */
  color: #656565 !important;           /* chữ xám đậm, tinh tế */
  border-bottom: 1px solid #e0e0e0;
}

.table-header th {
  padding: 12px 16px;
  color: #565555 !important;
  font-weight: 600;
  text-align: left;         /* căn trái toàn bộ tiêu đề */
  vertical-align: middle;
}

.btn-danger-soft:hover {
  background-color: #dc3545; /* đỏ đậm khi hover */
  color: white;
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.4);
}

.use{
  background-color: #F4EEEE;
  border-left: solid 2px #63C3FF;
}
.obj-cover { object-fit: cover; }

/* Status pill giống ảnh 2: nền xanh nhạt/chấm đỏ nhạt */
.status-on {
  background-color: rgba(var(--bs-success-rgb), 0.18) !important;
  color: var(--bs-success) !important;
}
.status-off {
  background-color: rgba(var(--bs-danger-rgb), 0.18) !important;
  color: var(--bs-danger) !important;
}

/* Nút “mềm” (soft buttons) */
.btn-soft-primary {
  background: rgba(var(--bs-primary-rgb), 0.12);
  color: var(--bs-primary);
  border: 0;
}
.btn-soft-success {
  background: rgba(var(--bs-success-rgb), 0.12);
  color: var(--bs-success);
  border: 0;
}
.btn-soft-danger {
  background: rgba(var(--bs-danger-rgb), 0.12);
  color: var(--bs-danger);
  border: 0;
}
.btn-soft-primary:hover { background: rgba(var(--bs-primary-rgb), 0.18); }
.btn-soft-success:hover { background: rgba(var(--bs-success-rgb), 0.18); }
.btn-soft-danger:hover { background: rgba(var(--bs-danger-rgb), 0.18); }

.avatar-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;           /* tương đương .rounded-circle */
  object-fit: cover;            /* tương đương .obj-cover */
  border: 0.5px solid #656565;  /* viền mảnh màu xám đậm */
}
/* Đồng bộ padding giữa th và td */
.table th,
.table td {
  padding-left: 16px !important;
  padding-right: 16px !important;
  vertical-align: middle;
}

/* Căn trái đều */
.table th.text-start,
.table td.text-start {
  text-align: left !important;
}

/* Nếu muốn tất cả đều thẳng hàng trái trừ cột hành động */
.table th:not(:last-child),
.table td:not(:last-child) {
  text-align: left !important;
}
.table th:last-child,
.table td:last-child {
  text-align: right !important;
}

.modal {
  display: block;
  backdrop-filter: blur(2px);
}
.table th, .table td {
  font-size: 0.9rem;
}
.modal-content {
  border-radius: 16px;
  overflow: hidden; /* giúp bo góc rõ khi có border hoặc shadow */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Bo góc nhẹ cho input, select, textarea */
.form-control,
.form-select {
  border-radius: 10px !important;
}

/* Bo góc cho button outline */
.btn-outline-secondary {
  border-radius: 8px;
}

/* Bo góc cho button chính */
.btn-primary {
  border-radius: 8px;
}

</style>
