<template>
  <div class="d-flex flex-column h-100">
    <!-- Header -->
    <div
        class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2 border-bottom"
        style="border-color: rgba(0, 0, 0, 0.3)"
    >
      <h5 class="fw-bold mb-0 d-flex align-items-center text-dark">
        <i class="fa-solid fa-shield-halved me-2 text-primary"></i> Quản lý phân quyền
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

    <!-- Main -->
    <div class="px-3">
      <div class="card border rounded-4 shadow-sm flex-grow-1 overflow-hidden position-relative">
        <div
            class="card-header fw-semibold border-bottom rounded-top-4"
            style="background-color: #60a5fa; color: #fff"
        >
          Quản lý quyền theo vai trò
        </div>

        <div class="p-4 flex-grow-1" style="min-height: 320px;">
          <!-- Dropdown chọn role -->
          <div class="mb-3">
            <label class="fw-medium mb-2">Chọn Role:</label>
            <div class="d-flex align-items-center gap-2">
              <select
                  v-model="selectedRole"
                  class="form-select form-select-sm"
                  style="width: 240px; border-radius: 8px"
                  @change="onRoleChange"
              >
                <option value="" disabled>-- Chọn vai trò --</option>
                <option
                    v-for="r in rolesFiltered"
                    :key="r.roleName"
                    :value="r.roleName"
                >
                  {{ r.roleName }}
                </option>
              </select>

              <!-- Nút thêm / sửa / xóa -->
              <button class="btn btn-outline-success btn-sm" @click="toggleAdd">
                <i class="fa-solid fa-plus"></i>
              </button>
              <button
                  class="btn btn-outline-warning btn-sm"
                  @click="toggleEdit"
                  :disabled="!selectedRole"
              >
                <i class="fa-solid fa-pen"></i>
              </button>
              <button
                  class="btn btn-outline-danger btn-sm"
                  @click="toggleDelete"
                  :disabled="!selectedRole"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
            <div
                v-if="selectedRoleObj"
                class="mt-2 small text-secondary ps-1"
                style="font-style: italic"
            >
              <i class="fa-regular fa-circle-question me-1 text-primary"></i>
              <template v-if="selectedRoleObj.description">
                <span class="description-view" v-html="selectedRoleObj.description"></span>
              </template>
              <template v-else>
                Không có mô tả cho vai trò này
              </template>
            </div>

            <!-- 🔹 Form thêm Role -->
            <div v-if="showAddRole" class="card mt-3 p-3 border rounded-3 shadow-sm">
              <div class="mb-2 fw-semibold text-success">
                <i class="fa-solid fa-user-plus me-1"></i> Thêm vai trò mới
              </div>

              <div class="mb-2">
                <label class="form-label fw-semibold small">Tên Role (IN HOA)</label>
                <input
                    v-model="newRole.roleName"
                    class="form-control form-control-sm"
                    placeholder="VD: PROJECT_MANAGER"
                    @input="newRole.roleName = newRole.roleName.toUpperCase()"
                />
              </div>

              <div class="mb-2">
                <label class="form-label fw-semibold small">Mô tả</label>
                <textarea
                    v-model="newRole.description"
                    class="form-control form-control-sm"
                    rows="2"
                    placeholder="Nhập mô tả vai trò (tuỳ chọn)"
                ></textarea>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-secondary btn-sm" @click="showAddRole = false">
                  Hủy
                </button>
                <button class="btn btn-success btn-sm" @click="saveNewRole">
                  <i class="fa-solid fa-save me-1"></i> Lưu
                </button>
              </div>
            </div>

            <!-- 🔹 Form chỉnh Role -->
            <div v-if="showEditRole" class="card mt-3 p-3 border rounded-3 shadow-sm">
              <div class="mb-2 fw-semibold text-warning">
                <i class="fa-solid fa-pen-to-square me-1"></i> Chỉnh sửa vai trò: {{ selectedRole }}
              </div>

              <div class="mb-2">
                <label class="form-label fw-semibold small">Tên Role mới (IN HOA)</label>
                <input
                    v-model="editRole.roleName"
                    class="form-control form-control-sm"
                    placeholder="VD: PROJECT_MANAGER_NEW"
                    @input="editRole.roleName = editRole.roleName.toUpperCase()"
                />
              </div>

              <div class="mb-2">
                <label class="form-label fw-semibold small">Mô tả mới</label>
                <textarea
                    v-model="editRole.description"
                    class="form-control form-control-sm"
                    rows="2"
                ></textarea>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-secondary btn-sm" @click="showEditRole = false">
                  Hủy
                </button>
                <button class="btn btn-warning btn-sm" @click="updateRole">
                  <i class="fa-solid fa-save me-1"></i> Cập nhật
                </button>
              </div>
            </div>

            <!-- 🔹 Form xóa Role -->
            <div v-if="showDeleteRole" class="card mt-3 p-3 border rounded-3 shadow-sm">
              <div class="mb-2 fw-semibold text-danger">
                <i class="fa-solid fa-trash-can me-1"></i> Xóa vai trò
              </div>

              <div class="mb-2">
                <label class="form-label fw-semibold small">Nhập tên Role cần xóa (IN HOA)</label>
                <input
                    v-model="deleteRole.target"
                    class="form-control form-control-sm"
                    placeholder="VD: PROJECT_MANAGER"
                    @input="deleteRole.target = deleteRole.target.toUpperCase()"
                />
              </div>

              <div class="mb-2">
                <label class="form-label fw-semibold small">Nhập Role thay thế (IN HOA)</label>
                <input
                    v-model="deleteRole.replace"
                    class="form-control form-control-sm"
                    placeholder="VD: PROJECT_VIEWER"
                    @input="deleteRole.replace = deleteRole.replace.toUpperCase()"
                />
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-secondary btn-sm" @click="showDeleteRole = false">
                  Hủy
                </button>
                <button class="btn btn-danger btn-sm" @click="deleteRoleConfirm">
                  <i class="fa-solid fa-trash me-1"></i> Xóa
                </button>
              </div>
            </div>
          </div>
          <!-- Accordion danh sách quyền - Sử dụng Taiwind CSS -->
          <div v-if="permissions.length" class="space-y-2">
            <div
                v-for="(group, idx) in permissions"
                :key="group.module"
                class="border-0 rounded-3 shadow-sm overflow-hidden"
            >
              <!-- Accordion Header -->
              <button
                  class="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors "
                  @click="toggleAccordion(idx)"
              >
                <div class="flex items-center">
                  <i class="fa-solid fa-layer-group me-2 text-primary"></i>
                  <span class="fw-semibold">{{ group.module }}</span>
                </div>
                <i
                    class="fa-solid transition-transform duration-300"
                    :class="accordionOpen[idx] ? 'fa-chevron-up' : 'fa-chevron-down'"
                ></i>
              </button>

              <!-- Accordion Content -->
              <div
                  v-show="accordionOpen[idx]"
                  class="bg-white border-t"
              >
                <div class="p-4">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-medium text-secondary">Danh sách quyền</span>
                    <button
                        class="btn btn-outline-primary btn-sm px-2"
                        @click="toggleAll(group)"
                    >
                      {{
                        isAllChecked(group)
                            ? 'Bỏ chọn tất cả'
                            : 'Chọn tất cả'
                      }}
                    </button>
                  </div>

                  <!-- Danh sách quyền -->
                  <div class="row g-3">
                    <div
                        class="col-lg-6 col-md-12"
                        v-for="perm in group.permissions"
                        :key="perm.permissionID"
                    >
                      <div
                          class="d-flex justify-content-between align-items-center border rounded-3 px-3 py-2 bg-light hoverable"
                          @click="showDescription(perm)"
                          style="cursor: pointer"
                      >
                        <span class="fw-medium text-dark">
                          {{ perm.key }}
                        </span>
                        <input
                            class="form-check-input"
                            type="checkbox"
                            v-model="perm.granted"
                            @click.stop
                        />
                      </div>

                      <!-- Mô tả -->
                      <div
                          v-if="activePermission === perm.permissionID"
                          class="mt-2 bg-white border-start border-1 border-primary rounded-lg px-3 py-2 small text-secondary"
                      >
                        <i class="fa-solid fa-circle-info me-1 text-primary"></i>
                        <template v-if="perm.description">
                          <!-- Trường mô tả hiển thị nội dung HTML từ Quill Editor -->
                          <span class="description-view" v-html="perm.description"></span>
                        </template>
                        <template v-else>
                          Không có mô tả chi tiết
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else class="text-center text-muted mt-5">
            <i class="fa-regular fa-folder-open fa-lg mb-2"></i><br />
            Chưa có dữ liệu quyền hoặc chưa chọn vai trò
          </div>

          <!-- Save -->
          <div class="d-flex justify-content-end mt-4">
            <button
                class="btn btn-success btn-sm px-4 shadow-sm"
                @click="updatePermissions"
                :disabled="!permissions.length || !selectedRole"
            >
              <i class="fa-solid fa-save me-1"></i> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api/api.js'
import Swal from 'sweetalert2'
import { showSuccess } from '../assets/js/alertService.js'
import {useAuthStore} from "../stores/authStore.js";
import { useSidebarStore } from "../stores/sidebarStore.js";
import NotificationBell from "./NotificationBell.vue";
const authStore = useAuthStore()
const info = authStore.userInfo
const sidebar = useSidebarStore()

const roles = ref([])
const selectedRole = ref('')
const permissions = ref([])
const activePermission = ref(null)
const accordionOpen = ref({}) // Quản lý trạng thái accordion

const selectedRoleObj = computed(() =>
    roles.value.find((r) => r.roleName === selectedRole.value)
)

// Toggle accordion
const toggleAccordion = (idx) => {
  accordionOpen.value[idx] = !accordionOpen.value[idx]
}

// 🧩 Lấy danh sách Role
const fetchRoles = async () => {
  try {
    const { data } = await api.get('/admin.thg/role-permission/roles')
    roles.value = data.filter((r) => r.roleName)

    if (roles.value.length) {
      selectedRole.value = roles.value[0].roleName
      await fetchPermissions()
    }
  } catch {
    Swal.fire('Lỗi', 'Không thể tải danh sách Role', 'error')
  }
}

// 🧩 Lấy quyền theo Role
const fetchPermissions = async () => {
  if (!selectedRole.value) return
  try {
    const { data } = await api.get(`/admin.thg/role-permission/${selectedRole.value}`)
    permissions.value = data || []

    // Mở tất cả accordion khi tải dữ liệu mới
    if (permissions.value.length) {
      permissions.value.forEach((_, idx) => {
        accordionOpen.value[idx] = true
      })
    }
  } catch {
    Swal.fire('Lỗi', 'Không thể tải quyền. Vui lòng kiểm tra lại.', 'error')
  }
}

const onRoleChange = async () => {
  if (selectedRole.value) await fetchPermissions()
}

// 🧩 Toggle chọn tất cả
const isAllChecked = (group) => group.permissions.every((p) => p.granted)
const toggleAll = (group) => {
  const allChecked = isAllChecked(group)
  group.permissions.forEach((p) => (p.granted = !allChecked))
}

// 🧩 Hiển thị mô tả quyền
const showDescription = (perm) => {
  activePermission.value =
      activePermission.value === perm.permissionID ? null : perm.permissionID
}

// 🧩 Cập nhật quyền
const updatePermissions = async () => {
  if (!selectedRole.value) {
    Swal.fire('Cảnh báo', 'Vui lòng chọn Role trước khi lưu', 'warning')
    return
  }

  const selectedIds = permissions.value
      .flatMap((g) => g.permissions)
      .filter((p) => p.granted)
      .map((p) => p.permissionID)

  try {
    const { data } = await api.post(
        `/admin.thg/role-permission/${selectedRole.value}/update`,
        selectedIds
    )
    showSuccess(data?.message || 'Cập nhật quyền thành công!')
  } catch {
    Swal.fire('Lỗi', 'Không thể cập nhật quyền, vui lòng thử lại.', 'error')
  }
}

const rolesFiltered = computed(() =>
    roles.value.filter((r) => r.roleName)
)

onMounted(fetchRoles)

// 🔹 Thêm role bằng v-if
const showAddRole = ref(false)
const newRole = ref({
  roleName: '',
  description: ''
})

const saveNewRole = async () => {
  const roleName = newRole.value.roleName.trim().toUpperCase()

  if (!roleName) {
    Swal.fire('Cảnh báo', 'Vui lòng nhập tên vai trò!', 'warning')
    return
  }

  // Kiểm tra trùng role
  const exists = roles.value.some(r => r.roleName === roleName)
  if (exists) {
    Swal.fire('Cảnh báo', 'Tên Role đã tồn tại!', 'warning')
    return
  }

  try {
    const { data } = await api.post('/admin.thg/role-permission/add-role', newRole.value)
    showSuccess(data?.message || 'Thêm vai trò thành công!')
    showAddRole.value = false
    newRole.value = { roleName: '', description: '' }
    await fetchRoles()
  } catch {
    Swal.fire('Lỗi', 'Không thể thêm vai trò mới.', 'error')
  }
}


// Hiện/ẩn form
const showEditRole = ref(false)
const showDeleteRole = ref(false)

const toggleAdd = () => {
  showAddRole.value = !showAddRole.value
  showEditRole.value = false
  showDeleteRole.value = false
}
const toggleEdit = () => {
  showEditRole.value = !showEditRole.value
  showAddRole.value = false
  showDeleteRole.value = false
  if (showEditRole.value && selectedRoleObj.value) {
    editRole.value.roleName = selectedRoleObj.value.roleName
    editRole.value.description = selectedRoleObj.value.description || ''
  }
}
const toggleDelete = () => {
  showDeleteRole.value = !showDeleteRole.value
  showAddRole.value = false
  showEditRole.value = false
  deleteRole.value = { target: '', replace: '' }
}

// === CHỈNH ROLE ===
const editRole = ref({ roleName: '', description: '' })

const updateRole = async () => {
  const newName = editRole.value.roleName.trim().toUpperCase()
  if (!newName) {
    Swal.fire('Cảnh báo', 'Vui lòng nhập tên vai trò mới!', 'warning')
    return
  }

  const exists = roles.value.some(r => r.roleName === newName)
  if (exists && newName !== selectedRole.value) {
    Swal.fire('Cảnh báo', 'Tên Role mới đã tồn tại!', 'warning')
    return
  }

  try {
    const body = {
      oldRole: selectedRole.value,
      newRole: newName,
      description: editRole.value.description
    }
    const { data } = await api.put('/admin.thg/role-permission/update-role', body)
    if (data === true) {
      showSuccess('Cập nhật vai trò thành công!')
    } else {
      Swal.fire('Lỗi', 'Không thể cập nhật vai trò (trùng tên hoặc không tồn tại)', 'error')
    }
    showEditRole.value = false
    await fetchRoles()
  } catch {
    Swal.fire('Lỗi', 'Không thể cập nhật vai trò.', 'error')
  }
}

// === XÓA ROLE ===
const deleteRole = ref({ target: '', replace: '' })

const deleteRoleConfirm = async () => {
  const target = deleteRole.value.target.trim().toUpperCase()
  const replace = deleteRole.value.replace.trim().toUpperCase()

  if (!target || !replace) {
    Swal.fire('Cảnh báo', 'Vui lòng nhập đầy đủ tên Role cần xóa và Role thay thế!', 'warning')
    return
  }

  const existsTarget = roles.value.some(r => r.roleName === target)
  const existsReplace = roles.value.some(r => r.roleName === replace)

  if (!existsTarget) {
    Swal.fire('Cảnh báo', `Role cần xóa (${target}) không tồn tại!`, 'warning')
    return
  }
  if (!existsReplace) {
    Swal.fire('Cảnh báo', `Role thay thế (${replace}) không tồn tại!`, 'warning')
    return
  }

  try {
    const body = { targetRole: target, replaceRole: replace }
    const { data } = await api.post('/admin.thg/role-permission/delete-role', body)
    showSuccess(data?.message || 'Xóa vai trò thành công!')
    showDeleteRole.value = false
    await fetchRoles()
  } catch {
    Swal.fire('Lỗi', 'Không thể xóa vai trò.', 'error')
  }
}
</script>

<style scoped>
.hoverable {
  transition: all 0.2s ease;
}
.hoverable:hover {
  background-color: #f1f5f9;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
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

/* Animation cho accordion */
.accordion-content {
  transition: all 0.3s ease;
}
</style>