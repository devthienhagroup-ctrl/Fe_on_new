<template>
  <div class="container-build pb-4 bg-light min-vh-92 danh-sach-du-an">
    <div
        class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2"
        style="border-bottom: solid 0.5px rgba(0,0,0,0.3)"
    >
      <h5 class="fw-bold mb-0 d-flex align-items-center">
        <button
            @click="goBack"
            class="btn border border-primary rounded-circle d-flex align-items-center justify-content-center me-2"
            style="width: 40px; height: 40px;"
        >
          <i class="fa-solid fa-chevron-left text-primary fs-5"></i>
        </button>
        Cập nhật dự án
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

    <div class="tabs-wrapper d-flex align-items-center justify-content-between border-bottom pb-2 px-3">
      <div class="tabs-du-an flex-grow-1 overflow-hidden">
        <div class="d-flex gap-4 small text-muted fw-medium px-2 inner-tabs">
          <span
              v-for="tab in tabs"
              :key="tab.key"
              :class="['tab-item', { active: activeTab.key === tab.key }]"
              @click="setActiveTab(tab)"
          >
            {{ tab.label }}
          </span>
        </div>
      </div>
    </div>

    <div class="px-4 pt-4">
      <div v-if="activeTab.key === 'info'" class="bg-white shadow-sm rounded-4 p-4 info-panel" style="min-height: 75vh">
        <div
            v-if="isLoadingProject"
            class="d-flex flex-column align-items-center justify-content-center py-5 text-muted gap-3"
        >
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="mb-0">Đang tải dữ liệu dự án...</p>
        </div>
        <form v-else class="d-flex flex-column gap-4" >
          <!-- Các trường thông tin dự án (giữ nguyên) -->
          <div class="form-row align-items-center">
            <label class="form-label fw-medium">Ưu tiên</label>
            <button
                type="button"
                @click="project.priority = !project.priority"
                class="ml-2 btn btn-light btn-sm border-0"
            >
              <i :class="project.priority ? 'fa-solid fa-flag text-warning' : 'fa-regular fa-flag text-secondary'"></i>
            </button>
            <span>
              {{ !project.priority ? 'Không ưu tiên' : 'Được ưu tiên' }}
            </span>
          </div>

          <div class="form-row align-items-center">
            <label class="form-label fw-medium">
              Tên dự án <span class="text-danger">*</span>
            </label>
            <div class="flex-grow-1 field-control">
              <input
                  type="text"
                  v-model="project.name"
                  class="form-control form-control-sm py-2"
                  placeholder="Nhập tên dự án"
                  style="font-size: 16px; border-radius: 12px;"
              />
            </div>
          </div>

          <div class="form-row align-items-start">
            <label class="form-label fw-medium">
              Mô tả dự án <span class="text-danger">*</span>
            </label>
            <div class="flex-grow-1 field-control">
              <DescriptionEditor v-model="project.description" />
            </div>
          </div>

          <div class="form-row align-items-center">
            <label class="form-label fw-medium">
              Chi phí dự án (VND) <span class="text-danger">*</span>
            </label>
            <div class="flex-grow-1 field-control">
              <input
                  type="text"
                  v-model="displayValue"
                  @input="onInput"
                  @blur="onBlur"
                  class="form-control form-control-sm py-2"
                  style="font-size: 16px; border-radius: 12px;"
              />
            </div>
          </div>

          <div class="form-row align-items-center">
            <label class="form-label fw-medium">Ngày bắt đầu dự kiến</label>
            <div class="flex-grow-1 field-control">
              <input
                  type="date"
                  v-model="project.expectedStartDate"
                  class="form-control form-control-sm py-2"
              />
            </div>
          </div>

          <div class="form-row align-items-center">
            <label class="form-label fw-medium">
              Ngày kết thúc dự kiến <span class="text-danger">*</span>
            </label>
            <div class="flex-grow-1 field-control">
              <input
                  type="date"
                  v-model="project.endDate"
                  class="form-control form-control-sm py-2"
                  style="font-size: 16px; border-radius: 12px;"
              />
            </div>
          </div>

          <div class="form-row align-items-center">
            <label class="form-label fw-medium">
              Phân loại dự án <span class="text-danger">*</span>
            </label>
            <div class="flex-grow-1 position-relative field-control">
              <div
                  class="form-control py-2 d-flex align-items-center justify-content-between"
                  style="font-size: 16px; border-radius: 12px; cursor: pointer;"
                  @click="toggleDropdown"
              >
                <div v-if="selectedType" class="d-flex align-items-center gap-2">
                  <i v-if="selectedType.icon" :class="selectedType.icon" :style="{ color: selectedType.color }"></i>
                  <span>{{ selectedType.typeName }}</span>
                </div>
                <div v-else>-- Chọn loại dự án --</div>
                <i class="fa-solid fa-caret-down text-secondary"></i>
              </div>

              <div
                  v-if="dropdownOpen"
                  class="custom-dropdown shadow position-absolute bg-white rounded-3 mt-1 w-100"
                  style="z-index: 10;"
              >
                <div
                    v-for="type in projectTypes"
                    :key="type.typeId"
                    class="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
                    style="cursor: pointer;"
                    @click="selectType(type)"
                >
                  <i v-if="type.icon" :class="type.icon" :style="{ color: type.color }"></i>
                  <span>{{ type.typeName }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row align-items-center">
            <label class="form-label fw-medium">
              Dịch vụ của dự án <span class="text-danger">*</span>
            </label>
            <div class="flex-grow-1 field-control">
              <select
                  v-model="project.service"
                  class="form-select form-select-sm py-2"
                  style="font-size: 16px; border-radius: 12px;"
              >
                <option :value="null" disabled>-- Chọn dịch vụ --</option>
                <option v-for="service in projectServices" :key="service.id" :value="service.id">
                  {{ service.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row align-items-center">
            <label class="form-label fw-medium">
              Điểm Effort <span class="text-danger">*</span>
            </label>
            <div class="flex-grow-1 field-control">
              <input
                  type="number"
                  v-model="project.effort"
                  class="form-control form-control-sm py-2"
                  placeholder="Nhập điểm effort (ví dụ: 100)"
                  min="1"
                  max="100000"
                  style="font-size: 16px; border-radius: 12px;"
              />
            </div>
          </div>

          <div class="form-row align-items-start">
            <label class="form-label fw-medium">File</label>
            <div class="flex-grow-1 field-control">
              <div class="d-flex align-items-center gap-2 mb-2">
                <button
                    type="button"
                    class="btn btn-light border d-flex align-items-center gap-2 py-1 px-2"
                    @click="triggerFileUpload"
                    style="font-size: 16px; border-radius: 12px;"
                >
                  <i class="fa-solid fa-upload text-secondary"></i> Thêm file
                </button>
                <span class="text-secondary small">Đã thêm {{ project.files.length }} file</span>
              </div>
              <ul v-if="project.files.length" class="list-unstyled mb-0 small">
                <li
                    v-for="(file, index) in project.files"
                    :key="`${file.name}-${index}`"
                    class="d-flex align-items-center gap-2 file-item"
                >
                  <div class="file-item-info d-flex align-items-center gap-2 flex-grow-1">
                    <i class="fa-regular fa-file-lines text-secondary"></i>
                    <span class="text-truncate">{{ file.name }}</span>
                    <button
                        type="button"
                        class="btn btn-link text-danger p-0 remove-file-btn"
                        @click="removeFile(index)"
                        aria-label="Remove file"
                    >
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </li>
              </ul>
              <input ref="fileInput" type="file" class="d-none" multiple @change="handleFiles" />
            </div>
          </div>
        </form>

        <div class="d-flex justify-content-end align-items-center mt-4 gap-3">
          <button
              type="button"
              class="btn btn-outline-secondary px-4 py-2 rounded-3"
              style="font-size: 16px;"
              @click="resetProjectInfo"
          >
            Reset
          </button>
          <button
              type="button"
              class="btn text-white px-4 py-2 rounded-3"
              style="background-color: #5B6EF5; font-size: 16px;"
              @click="goToMembersTab"
          >
            Tiếp theo
          </button>
        </div>
      </div>

      <!-- TAB 2: THÀNH VIÊN -->
      <div
          v-else-if="activeTab.key === 'members'"
          class="bg-white shadow-sm rounded-4 p-4 position-relative members-panel"
          style="min-height: 75vh"
      >
        <!-- Khách hàng -->
        <div class="customer-section mb-4">
          <div class="d-flex  align-items-center mb-2">
            <h6 class="section-title mb-0 me-3">Khách hàng</h6>
            <button
                type="button"
                class="btn btn-sm btn-primary d-flex align-items-center gap-1"
                @click="addCustomer"
                :disabled="!canAddCustomer"
            >
              <i class="fa-solid fa-plus"></i> Thêm khách hàng
            </button>
          </div>

          <div v-for="(customer, index) in customers" :key="index" class="row g-3 align-items-end mb-3">
            <div class="col-md-5">
              <label class="form-label fw-medium">Số điện thoại khách hàng</label>
              <input
                  type="text"
                  v-model="customer.phone"
                  @input="onCustomerPhoneChange(customer, index)"
                  class="form-control form-control-sm py-2"
                  placeholder="Nhập số điện thoại khách hàng"
                  style="font-size: 16px; border-radius: 12px;"
              />
            </div>

            <div class="col-md-5">
              <label class="form-label fw-medium">Tên khách hàng</label>
              <div class="customer-name-display form-control form-control-sm py-2 bg-light">
                {{ customer.name || 'Chưa có thông tin' }}
              </div>
            </div>

            <div class="col-md-2 text-end">
              <button
                  v-if="customers.length > 1"
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                  @click="removeCustomer(index)"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Thành viên dự án -->
        <div class="project-execution-section">
          <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
            <h6 class="section-title mb-0">Thực hiện dự án</h6>

            <div class="d-flex align-items-center gap-2 flex-nowrap">
              <select
                  v-model="viewMode"
                  class="form-select form-select-sm view-mode-select"
                  style="width: 180px;"
              >
                <option v-for="mode in viewModes" :key="mode.value" :value="mode.value">
                  {{ mode.label }}
                </option>
              </select>

              <button
                  type="button"
                  class="btn btn-primary btn-sm d-flex align-items-center gap-2"
                  @click="openDrawer"
              >
                <span>Thêm thành viên vào dự án</span>
              </button>
            </div>
          </div>

          <!-- Xem theo phòng ban -->
          <div v-if="viewMode === 'department'">
            <div v-if="membersByDepartment.length" class="d-flex flex-column gap-3">
              <div
                  v-for="department in membersByDepartment"
                  :key="department.id"
                  class="member-group border rounded-4 overflow-hidden"
              >
                <div class="member-group-header d-flex justify-content-between align-items-center p-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="member-avatar">
                      <img v-if="department.avatar" :src="department.avatar" :alt="department.name" />
                      <span v-else>{{ getInitials(department.name) }}</span>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ department.name }}</div>
                      <div class="text-muted small">{{ department.employees.length }} thành viên</div>
                    </div>
                  </div>
                  <button
                      type="button"
                      class="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                      @click="toggleDepartmentRow(department.id)"
                  >
                    <i
                        class="fa-solid fa-chevron-down transition"
                        :class="{ 'rotate-180': isDepartmentExpanded(department.id) }"
                    ></i>
                  </button>
                </div>
                <div v-if="isDepartmentExpanded(department.id)" class="member-group-body border-top">
                  <div class="table-responsive">
                    <table class="table table-sm mb-0 align-middle subtle-table">
                      <thead>
                      <tr class="text-muted small ">
                        <th scope="col" class="px-3">Thành viên</th>
                        <th scope="col">Vai trò</th>
                        <th scope="col" class="px-3 text-end">Nhóm</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="member in department.employees" :key="member.id">
                        <td>
                          <div class="d-flex align-items-center gap-2 px-3">
                            <div class="member-avatar">
                              <img v-if="member.avatarUrl" :src="member.avatarUrl" :alt="member.name" />
                              <span v-else>{{ member.avatarText }}</span>
                            </div>
                            <div>
                              <div class="fw-semibold">{{ member.name }}</div>
                              <div class="text-muted extra-small">{{ getMemberPosition(member) }}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <select
                              class="form-select form-select-sm px-3"
                              v-model="member.role"
                              @change="updateMemberRole(member.id, member.role)"
                          >
                            <option v-for="role in roleOptions" :key="role.roleName" :value="role.roleName">
                              {{ role.roleName }}
                            </option>
                          </select>
                        </td>
                        <td class="text-end text-muted px-3">{{ member.teamName }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="alert alert-light border text-center py-4 mb-0">
              Chưa có thành viên nào trong dự án.
            </div>
          </div>

          <!-- Xem theo team -->
          <div v-else-if="viewMode === 'group'">
            <div v-if="membersByGroup.length" class="d-flex flex-column gap-3">
              <div
                  v-for="group in membersByGroup"
                  :key="group.id"
                  class="member-group border rounded-4 overflow-hidden"
              >
                <div class="member-group-header d-flex justify-content-between align-items-center p-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="member-avatar">
                      <img v-if="group.avatar" :src="group.avatar" :alt="group.name" />
                      <span v-else>{{ getInitials(group.name) }}</span>
                    </div>
                    <div>
                      <div class="fw-semibold">{{ group.name }}</div>
                      <div class="text-muted small">{{ group.employees.length }} thành viên</div>
                    </div>
                  </div>
                  <button
                      type="button"
                      class="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                      @click="toggleGroupRow(group.id)"
                  >
                    <i
                        class="fa-solid fa-chevron-down transition"
                        :class="{ 'rotate-180': isGroupExpanded(group.id) }"
                    ></i>
                  </button>
                </div>
                <div v-if="isGroupExpanded(group.id)" class="member-group-body border-top">
                  <div class="table-responsive">
                    <table class="table table-sm mb-0 align-middle subtle-table">
                      <thead>
                      <tr class="text-muted small">
                        <th scope="col" class="px-3">Thành viên</th>
                        <th scope="col">Vai trò</th>
                        <th scope="col" class="text-end px-3">Phòng ban</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="member in group.employees" :key="member.id">
                        <td>
                          <div class="d-flex align-items-center gap-2 px-3">
                            <div class="member-avatar">
                              <img v-if="member.avatarUrl" :src="member.avatarUrl" :alt="member.name" />
                              <span v-else>{{ member.avatarText }}</span>
                            </div>
                            <div>
                              <div class="fw-semibold">{{ member.name }}</div>
                              <div class="text-muted extra-small">{{ getMemberPosition(member) }}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <select
                              class="form-select form-select-sm"
                              v-model="member.role"
                              @change="updateMemberRole(member.id, member.role)"
                          >
                            <option v-for="role in roleOptions" :key="role.roleName" :value="role.roleName">
                              {{ role.roleName }}
                            </option>
                          </select>
                        </td>
                        <td class="text-end text-muted px-3">{{ member.departmentName }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="alert alert-light border text-center py-4 mb-0">
              Chưa có thành viên nào trong dự án.
            </div>
          </div>

          <!-- Xem theo cá nhân -->
          <div v-else>
            <div v-if="projectMembers.length" class="table-responsive">
              <table class="table table-sm align-middle member-table subtle-table">
                <thead class="text-muted small">
                <tr>
                  <th scope="col">Thành viên</th>
                  <th scope="col" style="width: 180px">Vai trò</th>
                  <th scope="col">Nhóm</th>
                  <th scope="col">Phòng ban</th>
                  <th scope="col" class="text-end">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="member in projectMembers" :key="member.id">
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <div class="member-avatar">
                        <img v-if="member.avatarUrl" :src="member.avatarUrl" :alt="member.name" />
                        <span v-else>{{ member.avatarText }}</span>
                      </div>
                      <div class="member-info-text">
                        <div class="fw-semibold">{{ member.name }}</div>
                        <div class="text-muted extra-small">{{ getMemberPosition(member) }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                        class="form-select form-select-sm role-select"
                        v-model="member.role"
                        @change="updateMemberRole(member.id, member.role)"
                    >
                      <option v-for="role in roleOptions" :key="role.roleName" :value="role.roleName">
                        {{ role.roleName }}
                      </option>
                    </select>
                  </td>
                  <td class="member-group-cell">{{ member.teamName }}</td>
                  <td class="member-department-cell">{{ member.departmentName }}</td>
                  <td class="text-end">
                    <button
                        type="button"
                        class="btn btn-link text-danger px-0"
                        @click="removeMember(member.id)"
                        aria-label="Remove member"
                    >
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="alert alert-light border text-center py-4 mb-0">
              Chưa có thành viên nào trong dự án.
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-3 pt-4 mt-4 border-top">
          <button type="button" class="btn btn-outline-secondary px-4" @click="refreshMembers">
            Refresh
          </button>
          <button type="button" class="btn btn-primary px-4" @click="updateProject">
            Cập nhật dự án
          </button>
        </div>

        <!-- Drawer tìm kiếm -->
        <div v-if="drawerVisible" class="drawer-overlay" @click.self="cancelDrawer">
          <div class="drawer-panel">
            <div class="drawer-header d-flex justify-content-between align-items-center">
              <h6 class="mb-0 fw-semibold">Thêm thành viên vào dự án</h6>
              <button type="button" class="btn btn-light btn-sm rounded-circle" @click="cancelDrawer">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="drawer-search mb-3">
              <div class="row g-2 align-items-center">
                <div class="col-12">
                  <label class="form-label fw-medium small mb-1">Kiểu tìm kiếm</label>
                  <select v-model="searchType" class="form-select form-select-sm">
                    <option v-for="option in searchTypeOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                </div>
                <div class="col-12">
                  <label class="form-label fw-medium small mb-1">Từ khóa</label>
                  <div class="position-relative">
                    <input
                        type="text"
                        v-model="searchKeyword"
                        class="form-control form-control-sm ps-5"
                        placeholder="Nhập từ khóa để tìm kiếm"
                    />
                    <i
                        class="fa-solid fa-magnifying-glass position-absolute text-muted"
                        style="left: 12px; top: 50%; transform: translateY(-50%);"
                    ></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="drawer-content">
              <div v-if="searchLoading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div v-else-if="searchError" class="alert alert-warning">{{ searchError }}</div>
              <div v-else-if="!searchKeyword.trim()" class="text-muted small text-center py-4">
                Nhập từ khóa để bắt đầu tìm kiếm.
              </div>

              <div v-else>
                <!-- Kết quả: Cá nhân -->
                <div v-if="searchType === 'employee'">
                  <div v-if="employeeResults.length" class="d-flex flex-column gap-3">
                    <div
                        v-for="employee in employeeResults"
                        :key="employee.id"
                        class="search-result-card border rounded-4 p-3 d-flex justify-content-between align-items-center"
                    >
                      <div class="d-flex align-items-center gap-3">
                        <div class="member-avatar">
                          <img v-if="employee.avatarUrl" :src="employee.avatarUrl" :alt="employee.name" />
                          <span v-else>{{ employee.avatarText }}</span>
                        </div>
                        <div>
                          <div class="fw-semibold">{{ employee.name }}</div>
                          <div class="text-muted extra-small">
                            {{ employee.email || getMemberPosition(employee) }}
                          </div>
                        </div>
                      </div>
                      <button
                          type="button"
                          class="btn btn-outline-primary btn-sm"
                          :disabled="isMemberInProject(employee.id)"
                          @click="addEmployeeToProject(employee)"
                      >
                        {{ isMemberInProject(employee.id) ? 'Đã trong dự án' : 'Thêm vào dự án' }}
                      </button>
                    </div>
                  </div>
                  <div v-else class="text-muted small text-center py-4">Không tìm thấy nhân sự phù hợp.</div>
                </div>

                <!-- Kết quả: Team -->
                <div v-else-if="searchType === 'team'">
                  <div v-if="teamResults.length" class="d-flex flex-column gap-3">
                    <div v-for="team in teamResults" :key="team.id" class="drawer-group border rounded-4">
                      <div class="drawer-group-header d-flex justify-content-between align-items-center p-3">
                        <div class="d-flex align-items-center gap-3">
                          <div class="member-avatar">
                            <img v-if="team.avatar" :src="team.avatar" :alt="team.name" />
                            <span v-else>{{ getInitials(team.name) }}</span>
                          </div>
                          <div>
                            <div class="fw-semibold">{{ team.name }}</div>
                            <div class="text-muted extra-small">{{ team.employees.length }} nhân sự</div>
                          </div>
                        </div>
                      </div>
                      <div class="drawer-group-body">
                        <div
                            v-for="employee in team.employees"
                            :key="`${team.id}-${employee.id}`"
                            class="drawer-employee d-flex align-items-center justify-content-between gap-3"
                        >
                          <div class="d-flex align-items-center gap-3">
                            <div class="member-avatar">
                              <img v-if="employee.avatarUrl" :src="employee.avatarUrl" :alt="employee.name" />
                              <span v-else>{{ employee.avatarText }}</span>
                            </div>
                            <div>
                              <div class="fw-semibold">{{ employee.name }}</div>
                              <div class="text-muted extra-small">
                                {{ employee.email || getMemberPosition(employee) }}
                              </div>
                            </div>
                          </div>
                          <button
                              type="button"
                              class="btn btn-outline-primary btn-sm"
                              :disabled="isMemberInProject(employee.id)"
                              @click="addEmployeeToProject(employee)"
                          >
                            {{ isMemberInProject(employee.id) ? 'Đã trong dự án' : 'Thêm' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-muted small text-center py-4">
                    Không có nhóm nào phù hợp với điều kiện hiển thị.
                  </div>
                </div>

                <!-- Kết quả: Phòng ban -->
                <div v-else>
                  <div v-if="departmentResults.length" class="d-flex flex-column gap-3">
                    <div v-for="department in departmentResults" :key="department.id" class="drawer-group border rounded-4">
                      <div class="drawer-group-header d-flex justify-content-between align-items-center p-3">
                        <div class="d-flex align-items-center gap-3">
                          <div class="member-avatar">
                            <img v-if="department.avatar" :src="department.avatar" :alt="department.name" />
                            <span v-else>{{ getInitials(department.name) }}</span>
                          </div>
                          <div>
                            <div class="fw-semibold">{{ department.name }}</div>
                            <div class="text-muted extra-small">{{ department.employees.length }} nhân sự</div>
                          </div>
                        </div>
                      </div>
                      <div class="drawer-group-body">
                        <div
                            v-for="employee in department.employees"
                            :key="`${department.id}-${employee.id}`"
                            class="drawer-employee d-flex align-items-center justify-content-between gap-3"
                        >
                          <div class="d-flex align-items-center gap-3">
                            <div class="member-avatar">
                              <img v-if="employee.avatarUrl" :src="employee.avatarUrl" :alt="employee.name" />
                              <span v-else>{{ employee.avatarText }}</span>
                            </div>
                            <div>
                              <div class="fw-semibold">{{ employee.name }}</div>
                              <div class="text-muted extra-small">
                                {{ employee.email || getMemberPosition(employee) }}
                              </div>
                            </div>
                          </div>
                          <button
                              type="button"
                              class="btn btn-outline-primary btn-sm"
                              :disabled="isMemberInProject(employee.id)"
                              @click="addEmployeeToProject(employee)"
                          >
                            {{ isMemberInProject(employee.id) ? 'Đã trong dự án' : 'Thêm' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-muted small text-center py-4">
                    Không có phòng ban nào phù hợp với điều kiện hiển thị.
                  </div>
                </div>
              </div>
            </div>
          </div> <!-- /drawer-panel -->
        </div> <!-- /drawer-overlay -->
      </div> <!-- /members tab -->
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showError, showSuccess, showWarning, showLoading, updateAlertSuccess, updateAlertError } from "../assets/js/alertService.js";
import api from "../api/api.js";
import { useAuthStore } from "../stores/authStore.js";
import DescriptionEditor from "./common/DescriptionEditor.vue";
import NotificationBell from "./NotificationBell.vue";

const authStore = useAuthStore();
const info = authStore.userInfo;

const AVATAR_BASE_URL = " https://s3.cloudfly.vn/thg-storage/uploads-public/";

const router = useRouter();
const route = useRoute();

const tabs = [
  { key: "info", label: "Thông tin dự án" },
  { key: "members", label: "Tham gia dự án" }
];

const activeTab = ref(tabs[0]);
const hasLoadedMembersData = ref(false);
watch(activeTab, async (tab) => {
  if (tab.key === "members" && !hasLoadedMembersData.value) {
    const loaded = await getDataTab2();
    hasLoadedMembersData.value = loaded;
  }
});

const dropdownOpen = ref(false);
const projectTypes = ref([]);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectType = (type) => {
  if (!type) return;
  project.value.type = type.typeId;
  dropdownOpen.value = false;
};

const selectedType = computed(() =>
    projectTypes.value.find((t) => t.typeId === project.value.type)
);

const initialProject = () => ({
  name: "",
  endDate: new Date().toISOString().split("T")[0],
  expectedStartDate: new Date().toISOString().split("T")[0],
  description: "",
  price: 1000000,
  priority: false,
  type: null,
  service: null,
  effort: null,
  files: []
});

const project = ref(initialProject());
const projectServices = ref([]);
const fileInput = ref(null);
const isLoadingProject = ref(false);
const isSubmitting = ref(false);

/** ------------------ Khách hàng ------------------ */
const customers = ref([{ phone: "", name: "Chưa có thông tin" }]);

const canAddCustomer = computed(() => {
  const last = customers.value[customers.value.length - 1];
  return !!last.phone.trim() && last.name !== "Chưa có thông tin";
});

const addCustomer = () => {
  if (canAddCustomer.value) {
    customers.value.push({ phone: "", name: "Chưa có thông tin" });
  }
};

const removeCustomer = (index) => {
  customers.value.splice(index, 1);
};

const onCustomerPhoneChange = async (customer) => {
  const trimmedPhone = customer.phone.trim();
  if (!trimmedPhone) {
    customer.name = "Chưa có thông tin";
    return;
  }
  try {
    const response = await api.get("/admin.thg/project/find_customer", {
      params: { phone: trimmedPhone },
    });
    customer.name = response.data || "Không tìm thấy khách hàng";
  } catch (error) {
    console.error(error);
    customer.name = "Không tìm thấy khách hàng";
  }
};

/** ------------------ Members / Roles ------------------ */
const roleOptions = ref([]);

const DEFAULT_DEPARTMENT = { id: "__unknown__", name: "Chưa xác định", avatar: null };
const DEFAULT_TEAM = { id: "__unassigned__", name: "Chưa gán team", avatar: null };

const viewModes = [
  { value: "department", label: "Theo phòng ban" },
  { value: "group", label: "Theo team" },
  { value: "individual", label: "Theo cá nhân" }
];

const viewMode = ref(viewModes[0].value);

const getInitials = (text) => {
  if (!text) return "";
  const parts = text.trim().split(/\s+/);
  const initials = parts.map((p) => p[0]).join("");
  return initials.slice(0, 2).toUpperCase();
};

const buildAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (/^https?:/i.test(avatar)) return avatar;
  return `${AVATAR_BASE_URL}${avatar}`;
};

/** Xử lý dữ liệu thành viên từ API */
const processMemberData = (member) => {
  if (!member) return null;

  const memberId = member?.id ?? member?.employeeId;
  const normalizedId = memberId != null ? String(memberId) : nextEmployeeFallbackId();
  const displayName = member?.name ?? member?.employeeName ?? member?.fullName ?? "";

  // Xử lý department
  const departmentData = member?.department;
  const departmentName = departmentData?.departmentName ?? member?.departmentName ?? "Chưa xác định";
  const departmentAvatar = departmentData?.profileImage ? buildAvatarUrl(departmentData.profileImage) : null;
  const departmentId = `dept-${slugify(departmentName, normalizedId)}`;

  // Xử lý teams
  const teamsData = Array.isArray(member?.team) ? member.team : [];
  const teams = teamsData.map((team, index) => ({
    id: team?.id != null ? String(team.id) : `team-${slugify(team.name, `${normalizedId}-${index}`)}`,
    name: team?.name ?? `Team ${index + 1}`,
    avatar: team?.avatar ? buildAvatarUrl(team.avatar) : null
  }));

  const primaryTeam = teams[0] || DEFAULT_TEAM;

  return {
    id: normalizedId,
    name: displayName,
    avatarText: getInitials(displayName),
    avatarUrl: buildAvatarUrl(member?.avatar),
    role: ( member?.role ?? member?.roleName ?? (roleOptions.value[0]?.roleName || null)),
    departmentId,
    departmentName,
    departmentAvatar,
    teamId: primaryTeam.id,
    teamName: primaryTeam.name,
    teams,
    position: member?.position ?? member?.chucVu ?? null,
    email: member?.email ?? member?.mail ?? null,
    phone: member?.phone ?? member?.phoneNumber ?? member?.soDienThoai ?? null,
  };
};

/** Danh sách thành viên của dự án */
const projectMembers = ref([]);

/** Validate & resolve role */
const isValidRole = (role) => roleOptions.value.some((item) => item.roleName === role);
const resolveRole = (role) => (isValidRole(role) ? role : roleOptions.value[0]?.roleName || null);

/** Group theo phòng ban từ danh sách projectMembers */
const membersByDepartment = computed(() => {
  const grouped = new Map();

  projectMembers.value.forEach((member) => {
    const key = member.departmentId;
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: key,
        name: member.departmentName,
        avatar: member.departmentAvatar,
        employees: [],
      });
    }
    const bucket = grouped.get(key);
    if (!bucket.employees.find((m) => m.id === member.id)) {
      bucket.employees.push(member);
    }
  });

  return Array.from(grouped.values()).filter((d) => d.employees.length >= 2);
});

/** Group theo team từ danh sách projectMembers */
const membersByGroup = computed(() => {
  const grouped = new Map();

  projectMembers.value.forEach((member) => {
    const memberTeams = member.teams && member.teams.length > 0 ? member.teams : [DEFAULT_TEAM];

    memberTeams.forEach((team) => {
      const key = team.id;
      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          name: team.name,
          avatar: team.avatar,
          employees: [],
        });
      }
      const bucket = grouped.get(key);
      if (!bucket.employees.find((m) => m.id === member.id)) {
        bucket.employees.push(member);
      }
    });
  });

  return Array.from(grouped.values()).filter((t) => t.employees.length >= 2);
});

const expandedDepartments = ref([]);
const expandedGroups = ref([]);

const isDepartmentExpanded = (id) => expandedDepartments.value.includes(id);
const toggleDepartmentRow = (id) => {
  if (isDepartmentExpanded(id)) {
    expandedDepartments.value = expandedDepartments.value.filter((x) => x !== id);
  } else {
    expandedDepartments.value = [...expandedDepartments.value, id];
  }
};

const isGroupExpanded = (id) => expandedGroups.value.includes(id);
const toggleGroupRow = (id) => {
  if (isGroupExpanded(id)) {
    expandedGroups.value = expandedGroups.value.filter((x) => x !== id);
  } else {
    expandedGroups.value = [...expandedGroups.value, id];
  }
};

watch(viewMode, () => {
  expandedDepartments.value = [];
  expandedGroups.value = [];
});

// Các hàm utility
const slugify = (text, fallback) => {
  if (!text) return String(fallback);
  return (
      text
          .toString()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || String(fallback)
  );
};

let fallbackEmployeeCounter = 0;
const nextEmployeeFallbackId = () => {
  fallbackEmployeeCounter += 1;
  return `emp-${fallbackEmployeeCounter}`;
};

const getMemberPosition = (member) => {
  if (member?.position && String(member.position).trim()) return member.position;
  if (member?.role && String(member.role).trim()) return member.role;
  return "—";
};

/** Drawer + Search */
const drawerVisible = ref(false);

const searchTypeOptions = [
  { value: "team", label: "Tìm theo tên nhóm (team)" },
  { value: "department", label: "Tìm theo tên phòng ban (department)" },
  { value: "employee", label: "Tìm theo tên hoặc email người dùng (employee)" }
];

const searchType = ref("employee");
const searchKeyword = ref("");
const searchLoading = ref(false);
const searchError = ref("");
const searchResults = ref([]);
let searchDebounceTimer = null;

const clearSearchDebounce = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = null;
  }
};

const clearSearchState = () => {
  clearSearchDebounce();
  searchKeyword.value = "";
  searchResults.value = [];
  searchError.value = "";
  searchLoading.value = false;
};

const openDrawer = () => {
  drawerVisible.value = true;
  searchType.value = "employee";
  clearSearchState();
};

const cancelDrawer = () => {
  drawerVisible.value = false;
  clearSearchState();
};

const performSearch = async () => {
  const keyword = searchKeyword.value.trim();
  if (!keyword) {
    searchResults.value = [];
    searchError.value = "";
    searchLoading.value = false;
    return;
  }

  searchLoading.value = true;
  searchError.value = "";
  try {
    const response = await api.get("/admin.thg/project/search", {
      params: { type: searchType.value, keyword },
      withCredentials: true,
    });
    const data = Array.isArray(response.data) ? response.data : [];
    searchResults.value = data;
  } catch (error) {
    console.error(error);
    searchResults.value = [];
    searchError.value = "Không thể tìm kiếm thành viên. Vui lòng thử lại sau.";
  } finally {
    searchLoading.value = false;
  }
};

watch(searchKeyword, () => {
  if (!drawerVisible.value) return;
  clearSearchDebounce();
  if (!searchKeyword.value.trim()) {
    searchResults.value = [];
    searchError.value = "";
    searchLoading.value = false;
    return;
  }
  searchDebounceTimer = setTimeout(() => {
    performSearch();
  }, 500);
});

watch(searchType, () => {
  if (!drawerVisible.value) return;
  clearSearchDebounce();
  if (searchKeyword.value.trim()) {
    performSearch();
  } else {
    searchResults.value = [];
    searchError.value = "";
    searchLoading.value = false;
  }
});

onBeforeUnmount(() => {
  clearSearchDebounce();
});

const transformSearchEmployee = (rawEmployee, index = 0) => {
  if (!rawEmployee) return null;
  return processMemberData(rawEmployee);
};

const normalizedSearchResults = computed(() =>
    searchResults.value.map((item, index) => transformSearchEmployee(item, index)).filter(Boolean)
);

const filteredSearchResults = computed(() => {
  const existingIds = new Set(projectMembers.value.map((m) => m.id));
  return normalizedSearchResults.value.filter((e) => !existingIds.has(e.id));
});

const employeeResults = computed(() =>
    searchType.value === "employee" ? filteredSearchResults.value : []
);

const teamResults = computed(() => {
  if (searchType.value !== "team") return [];

  const grouped = new Map();
  filteredSearchResults.value.forEach((employee) => {
    employee.teams?.forEach((team) => {
      if (!team?.id) return;

      if (!grouped.has(team.id)) {
        grouped.set(team.id, {
          id: team.id,
          name: team.name,
          avatar: team.avatar || null,
          employees: [],
        });
      }
      const entry = grouped.get(team.id);
      if (!entry.employees.find((x) => x.id === employee.id)) {
        entry.employees.push(employee);
      }
    });
  });

  return Array.from(grouped.values());
});

const departmentResults = computed(() => {
  if (searchType.value !== "department") return [];

  const grouped = new Map();
  filteredSearchResults.value.forEach((employee) => {
    const key = employee.departmentId;
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: key,
        name: employee.departmentName,
        avatar: employee.departmentAvatar || null,
        employees: [],
      });
    }
    const entry = grouped.get(key);
    if (!entry.employees.find((x) => x.id === employee.id)) {
      entry.employees.push(employee);
    }
  });

  return Array.from(grouped.values());
});

/** Actions */
const addEmployeeToProject = (employee) => {
  const existingMember = projectMembers.value.find((m) => m.id === employee.id);
  if (!existingMember) {
    projectMembers.value.push({
      ...employee,
      role: resolveRole(employee.role)
    });
    showSuccess?.("Đã thêm thành viên vào dự án");
  }
};

const updateMemberRole = (memberId, role) => {
  if (!isValidRole(role)) return;
  const member = projectMembers.value.find((m) => m.id === memberId);
  if (member) member.role = role;
};

const removeMember = (memberId) => {
  projectMembers.value = projectMembers.value.filter((m) => m.id !== memberId);
};

const refreshMembers = () => {
  projectMembers.value = [];
  viewMode.value = viewModes[0].value;
  expandedDepartments.value = [];
  expandedGroups.value = [];
  customers.value = [{ phone: "", name: "Chưa có thông tin" }];
};

/** Validate + Update Project */
const validateProject = () => {
  const start = new Date(project.value.expectedStartDate);
  const end = new Date(project.value.endDate);

  if (end <= start) {
    showWarning?.("Ngày kết thúc dự kiến phải lớn hơn ngày bắt đầu ít nhất 1 ngày!");
    return false;
  }
  if (!project.value.name.trim()) {
    showWarning?.("Vui lòng nhập tên dự án");
    return false;
  }
  if (project.value.price == null) {
    showWarning?.("Vui lòng nhập Kinh phí dự án ");
    return false;
  }
  if (!project.value.type) {
    showWarning?.("Vui lòng chọn loại dự án");
    return false;
  }
  if (!project.value.service) {
    showWarning?.("Vui lòng chọn dịch vụ");
    return false;
  }
  if (!project.value.effort || Number(project.value.effort) <= 0) {
    showWarning?.("Điểm effort phải lớn hơn 0");
    return false;
  }
  return true;
};

async function updateProject() {
  if (!validateProject()) return;

  const projectId = route.params?.projectId ?? null;
  if (!projectId) {
    showError?.("Không xác định được dự án cần cập nhật.");
    return;
  }

  const payload = {
    projectInfo: {
      projectId,
      name: project.value.name.trim(),
      endDate: project.value.endDate,
      description: project.value.description,
      price: project.value.price,
      priority: project.value.priority,
      typeId: project.value.type,
      serviceId: project.value.service,
      effort: Number(project.value.effort),
      customerPhones: customers.value.filter((c) => c.phone.trim()).map((c) => c.phone.trim()),
    },
    members: projectMembers.value.map((member) => ({
      employeeId: member.id,
      role: member.role,
    })),
  };

  try {
    isSubmitting.value = true;
    const formData = new FormData();
    formData.append("projectInfo", JSON.stringify(payload.projectInfo));
    formData.append("members", JSON.stringify(payload.members));
    project.value.files.forEach((file) => formData.append("files", file));

    const response = await showLoading(
        api.post("/admin.thg/project/update/" + projectId, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        })
    );

    updateAlertSuccess("Cập nhật dự án thành công!", "Dữ liệu đã được lưu trên hệ thống.");
    console.log("Server response:", response.data);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật dự án:", error);
    updateAlertError("Lỗi khi cập nhật dự án!", "Vui lòng thử lại sau.");
  } finally {
    isSubmitting.value = false;
  }
}

/** Load Project Data */
async function getProject(projectId) {
  if (!projectId) return null;

  isLoadingProject.value = true;
  try {
    const res = await api.get("/admin.thg/project/detail", {
      params: { projectId },
      withCredentials: true,
    });
    if (res?.data) {
      await applyProjectData(res.data);
      return res.data;
    }
  } catch (err) {
    console.error("❌ Failed to fetch project detail:", err);
    showError?.("Không thể tải thông tin dự án");
  } finally {
    isLoadingProject.value = false;
  }
  return null;
}

const applyProjectData = async (data) => {
  if (!data) return;

  project.value = {
    ...project.value,
    name: data.name ?? "",
    endDate: data.expectedEnd ?? data.endDate ?? project.value.endDate,
    expectedStartDate: data.expectedStartDate ?? data.expectedStartDate ?? project.value.expectedStartDate,
    description: data.description ?? "",
    price: Number.isFinite(Number(data.price)) ? Number(data.price) : 0,
    priority: Boolean(data.priority),
    type: data.type?.id ?? data.typeId ?? null,
    service: data.serviceId ?? data.service?.id ?? null,
    effort: data.effort ?? project.value.effort,
    files: [],
  };

  customers.value = (Array.isArray(data.customers) && data.customers.length
      ? data.customers.map((customer) => ({
        phone: customer?.customerPhone ?? customer?.phone ?? "",
        name: customer?.customerName ?? customer?.name ?? "Chưa có thông tin",
      }))
      : [{ phone: "", name: "Chưa có thông tin" }]);

  // Xử lý thành viên với dữ liệu từ API
  projectMembers.value = (Array.isArray(data.members) ? data.members : [])
      .map(processMemberData)
      .filter(Boolean);
};

/** Nav + common helpers */
const goBack = () => {
  router.push({ name: "Project" });
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFiles = (event) => {
  const newFiles = Array.from(event.target.files || []);
  if (newFiles.length) {
    project.value.files = [...project.value.files, ...newFiles];
  }
  if (event.target) event.target.value = "";
};

const removeFile = (index) => {
  project.value.files = project.value.files.filter((_, fileIndex) => fileIndex !== index);
};

const goToMembersTab = () => {
  const membersTab = tabs.find((t) => t.key === "members");
  if (membersTab) activeTab.value = membersTab;
};

const resetProjectInfo = () => {
  project.value = initialProject();
  if (fileInput.value) fileInput.value.value = "";
};

/** Load Tab1 data (types, services) & Tab2 data (roles) */
onMounted(async () => {
  await getTypesAndServices();
  if (route.params?.projectId) {
    await getProject(route.params.projectId);
  }
});

async function getTypesAndServices() {
  try {
    const res = await api.get("/admin.thg/project/data_create", { withCredentials: true });
    projectTypes.value = res.data?.types || [];
    projectServices.value = res.data?.services || [];
  } catch (error) {
    console.error(error);
    showError?.("Không thể tải dữ liệu tạo dự án");
  }
}

async function getDataTab2() {
  try {
    const res = await api.get("/admin.thg/project/data_create_tab2", { withCredentials: true });
    roleOptions.value = res.data?.roles || [];
    return true;
  } catch (error) {
    console.error(error);
    showError?.("Không thể tải dữ liệu thành viên (roles)");
    return false;
  }
}

/** Giá tiền: input format */
const displayValue = ref(project.value.price.toLocaleString("vi-VN"));

function onInput(e) {
  const raw = e.target.value.replace(/[^\d]/g, "");
  if (raw === "") {
    project.value.price = 1000000;
    displayValue.value = "";
    return;
  }
  const num = Number(raw);
  project.value.price = num;
  displayValue.value = raw;
}

function onBlur() {
  displayValue.value = project.value.price.toLocaleString("vi-VN");
}

watch(
    () => project.value.price,
    (val) => {
      displayValue.value = val.toLocaleString("vi-VN");
    }
);
</script>
<style scoped>
/* Giữ nguyên toàn bộ CSS từ file gốc */
.dropdown-item:hover {
  background-color: #f5f6ff;
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
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tabs-du-an::-webkit-scrollbar {
  display: none;
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
  color: #4c5be5;
}

.tab-item.active {
  color: #4c5be5 !important;
  border-bottom: 2px solid #4c5be5;
  font-weight: 600;
}

.info-panel,
.members-panel {
  width: 100%;
  max-width: 70%;
  margin-right: auto;
}

@media (max-width: 992px) {
  .info-panel,
  .members-panel {
    max-width: 100%;
  }
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

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.form-row label {
  min-width: 220px;
  margin-bottom: 0;
  align-self: center;
}

.form-row.align-items-start label {
  align-self: flex-start;
  padding-top: 6px;
}

.field-control {
  flex: 1 1 66%;
  max-width: 66%;
}

@media (max-width: 768px) {
  .form-row label {
    min-width: 160px;
  }
  .field-control {
    flex-basis: 100%;
    max-width: 100%;
  }
}

.customer-name-display {
  border-radius: 12px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.section-title {
  font-weight: 600;
}

.view-mode-select {
  min-width: 180px;
}

.member-group {
  border-color: #e4e7ff !important;
}

.member-group-header {
  background: linear-gradient(90deg, rgba(91, 110, 245, 0.12), rgba(91, 110, 245, 0));
}

.member-group-header .btn {
  width: 32px;
  height: 32px;
}

.transition {
  transition: transform 0.2s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.member-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #eef1ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #495057;
  font-size: 14px;
  overflow: hidden;
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.member-info-text {
  min-width: 220px;
  max-width: 260px;
  white-space: normal;
}

.member-info-text .fw-semibold,
.member-info-text .extra-small {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.member-group-cell,
.member-department-cell {
  min-width: 180px;
  max-width: 220px;
  white-space: normal;
}

.role-select {
  min-width: 180px;
}

.extra-small {
  font-size: 12px;
}

.member-table td,
.member-table th {
  vertical-align: middle;
}

.subtle-table tbody tr td {
  padding-top: 14px;
  padding-bottom: 14px;
}

.file-item {
  background: #f8f9fc;
  border-radius: 10px;
  padding: 8px 12px;
}

.file-item-info .remove-file-btn {
  margin-left: auto;
}

.file-item-info .text-truncate {
  max-width: 280px;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: flex-end;
  z-index: 1050;
}

.drawer-panel {
  width: 620px;
  max-width: 100%;
  background: #fff;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.1);
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.drawer-group {
  overflow: hidden;
  border-color: #e4e7ff !important;
}

.drawer-group:hover {
  border-color: #c7cdfc !important;
  box-shadow: 0 10px 24px rgba(76, 91, 229, 0.12);
}

.drawer-group-header {
  background: linear-gradient(90deg, rgba(76, 91, 229, 0.12), rgba(76, 91, 229, 0));
}

.drawer-group-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 16px;
  background-color: #f8f9fc;
}

.drawer-employee {
  background: #fff;
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #eef1ff;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.drawer-employee:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(76, 91, 229, 0.12);
  border-color: #ccd2ff;
}

.search-result-card {
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.search-result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(76, 91, 229, 0.12);
  border-color: #ccd2ff !important;
}
</style>