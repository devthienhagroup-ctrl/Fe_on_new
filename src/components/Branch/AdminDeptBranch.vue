<!-- AdminDeptBranch.vue (UI v2 - clean, modern, dễ nhìn) -->
<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <!-- Topbar -->
    <header class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div class="mx-auto max-w-[1400px] px-5 py-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <!-- Brand -->
          <div class="flex items-center gap-3">
            <div class="ui-brand">
              <i class="fa-solid fa-building"></i>
            </div>
            <div class="leading-tight">
              <div class="text-[16px] md:text-[18px] font-extrabold text-slate-900">
                Quản lý Phòng ban & Chi nhánh
              </div>
            </div>
          </div>

          <!-- Right -->
          <div class="flex items-center gap-2 md:gap-3 justify-between md:justify-end">
            <button class="ui-ico-btn" type="button" aria-label="Thông báo">
              <i class="fa-solid fa-bell"></i>
              <span class="ui-badge">3</span>
            </button>

            <div class="hidden md:flex items-center gap-3">
              <div class="text-right">
                <div class="text-[13px] font-extrabold text-slate-900 whitespace-nowrap">Admin User</div>
                <div class="text-[12px] text-slate-500 font-semibold whitespace-nowrap">Quản trị hệ thống</div>
              </div>
              <div class="ui-avatar">
                <i class="fa-solid fa-user"></i>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
    <!-- Tabs -->
    <div class="mt-4" style="margin-left: 110px">
      <div class="ui-tabs">
        <button
            v-for="t in tabs"
            :key="t.key"
            type="button"
            class="ui-tab"
            :class="{ active: currentTab === t.key }"
            @click="currentTab = t.key"
        >
          <i :class="t.icon"></i>
          <span class="whitespace-nowrap font-extrabold">{{ t.label }}</span>
          <span v-if="t.key === 'departments'" class="ui-chip">
                {{ filteredDepartments.length }}
              </span>
          <span v-else class="ui-chip ui-chip-emerald">
                {{ filteredBranches.length }}
              </span>
        </button>
      </div>
    </div>
    <main class="mx-auto max-w-[1400px] px-5 py-5">


      <!-- ===================== DEPARTMENTS ===================== -->
      <section v-if="currentTab === 'departments'">
        <!-- Toolbar -->
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="text-[16px] md:text-[18px] font-extrabold text-slate-900">Phòng ban</div>
            <div class="text-[12px] md:text-[13px] text-slate-500 font-semibold">
              Danh sách phòng ban theo chi nhánh
            </div>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <div class="ui-seg">
              <button
                  type="button"
                  class="ui-seg-btn"
                  :class="{ active: deptView === 'table' }"
                  @click="deptView = 'table'"
              >
                <i class="fa-solid fa-table"></i>
                <span class="hidden sm:inline">Bảng</span>
              </button>
              <button
                  type="button"
                  class="ui-seg-btn"
                  :class="{ active: deptView === 'card' }"
                  @click="deptView = 'card'"
              >
                <i class="fa-solid fa-grid-2"></i>
                <span class="hidden sm:inline">Thẻ</span>
              </button>
            </div>

            <button type="button" class="ui-btn ui-btn-primary" @click="openDeptModal()">
              <i class="fa-solid fa-plus"></i>
              Thêm phòng ban
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="ui-card p-4">
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="ui-dot ui-dot-indigo"></span>
              <div class="font-extrabold text-slate-900">Bộ lọc</div>
              <div class="text-[12px] text-slate-500 font-semibold hidden md:block">
                Nhấn Enter để tìm nhanh
              </div>
            </div>
            <button type="button" class="ui-btn ui-btn-ghost" @click="toggleDeptFilter = !toggleDeptFilter">
              <i class="fa-solid" :class="toggleDeptFilter ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              <span class="hidden sm:inline">{{ toggleDeptFilter ? "Thu gọn" : "Mở rộng" }}</span>
            </button>
          </div>

          <div v-show="toggleDeptFilter" class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            <div>
              <label class="ui-label">Tìm kiếm</label>
              <div class="ui-input-wrap">
                <input
                    v-model.trim="deptFilter.search"
                    class="ui-input pl-10"
                    type="text"
                    placeholder="Tên phòng ..."
                    @keyup.enter="applyDeptFilter()"
                />
              </div>
            </div>

            <div>
              <label class="ui-label">Chi nhánh</label>
              <select v-model="deptFilter.branchId" class="ui-input">
                <option value="all">Tất cả</option>
                <option v-for="b in branches" :key="b.id" :value="b.id">
                  {{ b.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="filteredDepartments.length === 0" class="ui-card mt-4 p-8 text-center">
          <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200">
            <i class="fa-solid fa-users text-xl"></i>
          </div>
          <div class="mt-3 text-[16px] font-extrabold text-slate-900">Không có dữ liệu</div>
          <div class="mt-1 text-[13px] text-slate-500 font-semibold">
            Thử thay đổi bộ lọc hoặc thêm phòng ban mới
          </div>
          <button type="button" class="ui-btn ui-btn-primary mt-4" @click="openDeptModal()">
            <i class="fa-solid fa-plus"></i> Thêm phòng ban
          </button>
        </div>

        <!-- TABLE VIEW -->
        <div v-else-if="deptView === 'table'" class="mt-4 ui-card p-0 overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-200/70 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="ui-dot ui-dot-indigo"></span>
              <div class="text-[14px] font-extrabold text-slate-900">Bảng phòng ban</div>
            </div>
            <div class="text-[12px] text-slate-500 font-semibold">
              Tổng: <span class="text-indigo-700 font-extrabold">{{ filteredDepartments.length }}</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="ui-table">
              <thead>
              <tr>
                <th style="width: 52px">#</th>
                <th>PHÒNG BAN</th>
                <th>TRƯỞNG PHÒNG</th>
                <th>CHI NHÁNH</th>
                <th>CHỨC NĂNG</th>
                <th class="text-right" style="width: 140px">NHÂN SỰ</th>
                <th class="text-right" style="width: 170px">THAO TÁC</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(d, idx) in filteredDepartments" :key="d.id">
                <td class="text-slate-500 font-extrabold">{{ idx + 1 }}</td>

                <td>
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="h-10 w-10 rounded-2xl overflow-hidden ring-2 ring-slate-200 shrink-0">
                      <img :src=" ' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + d.avatar" :alt="d.name" class="h-full w-full object-cover" />
                    </div>
                    <div class="min-w-0">
                      <div class="truncate text-[14px] md:text-[15px] font-extrabold text-slate-900" :title="d.name">
                        {{ d.name }}
                      </div>
                      <div class="text-[12px] text-slate-500 font-semibold truncate">
                        {{ d.description }}
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="flex items-center gap-2 min-w-0">
                    <!-- AVATAR TRƯỞNG PHÒNG -->
                    <div class="h-8 w-8 rounded-full overflow-hidden ring-2 ring-slate-200 shrink-0">
                      <img
                          v-if="d.managerAvatar"
                          :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + d.managerAvatar"
                          :alt="d.manager"
                          class="h-full w-full object-cover"
                      />
                      <div
                          v-else
                          class="h-full w-full flex items-center justify-center bg-rose-50 text-rose-600"
                          title="Phòng ban chưa có trưởng phòng"
                      >
                        <i class="fa-solid fa-circle-exclamation"></i>
                      </div>
                    </div>

                    <!-- TÊN TRƯỞNG PHÒNG -->
                    <div class="min-w-0">
      <span
          v-if="d.manager"
          class="font-extrabold text-slate-800 truncate block"
          :title="d.manager"
      >
        {{ d.manager }}
      </span>
                      <span
                          v-else
                          class="text-rose-600 font-extrabold text-[12px]"
                      >
        Chưa phân công
      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="flex items-center gap-2 min-w-0">
                      <span class="ui-pill ui-pill-purple">
                        <i class="fa-solid fa-code-branch"></i>
                      </span>
                    <span class="font-extrabold text-slate-800 truncate">
                        {{ d.branchName || "—" }}
                      </span>
                  </div>
                </td>

                <td>
                  <span class="ui-tag ui-tag-emerald">{{ d.functionName || "—" }}</span>
                </td>

                <td class="text-left">
                    <span class="ui-value ui-value-indigo whitespace-nowrap">
                      {{ d.employees }} nhân sự
                    </span>
                </td>

                <td class="text-left">
                  <div class="inline-flex justify-end gap-2 whitespace-nowrap">
                    <button class="ui-mini ui-mini-slate" type="button" title="Xem chi tiết" @click="openDeptDetail(d.id)">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="ui-mini ui-mini-blue" type="button" title="Sửa" @click="openDeptModal(d.id)">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="ui-mini ui-mini-red" type="button" title="Xóa" @click="openDeleteModal('dept', d.id, d.name)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- CARD VIEW -->
        <div v-else class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div v-for="d in filteredDepartments" :key="d.id" class="ui-card overflow-hidden">
            <div class="relative h-32">
              <img :src="d.imageUrl" :alt="d.name" class="h-full w-full object-cover" />
              <div class="absolute inset-0 ui-img-overlay"></div>

              <div class="absolute left-3 top-3">
                <span class="ui-value ui-value-white whitespace-nowrap">{{ d.employees }} nhân sự</span>
              </div>

              <div class="absolute bottom-3 left-3 right-3">
                <div class="line-clamp-1 text-[14px] font-extrabold text-white" :title="d.name">
                  {{ d.name }}
                </div>
                <div class="mt-1 flex items-center gap-2 text-[12px] text-white/90">
                  <i class="fa-solid fa-user-tie"></i>
                  <span class="truncate font-semibold">{{ d.manager }}</span>
                </div>
              </div>
            </div>

            <div class="p-4">
              <div class="line-clamp-2 text-[13px] text-slate-600 font-semibold">
                {{ d.description }}
              </div>

              <div class="mt-3 flex items-center gap-2 min-w-0">
                <span class="ui-pill ui-pill-purple"><i class="fa-solid fa-code-branch"></i></span>
                    <span class="truncate text-slate-800 text-[13px] font-extrabold">
                  {{ d.branchName || "—" }}
                </span>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                <span class="ui-tag ui-tag-emerald">{{ d.functionName || "—" }}</span>
              </div>

              <div class="mt-3 border-t border-slate-200/70 pt-3 flex items-center justify-between">
                <span class="ui-value ui-value-indigo whitespace-nowrap">{{ d.employees }} NV</span>
                <div class="inline-flex gap-2 whitespace-nowrap">
                  <button class="ui-mini ui-mini-slate" type="button" title="Chi tiết" @click="openDeptDetail(d.id)">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button class="ui-mini ui-mini-blue" type="button" title="Sửa" @click="openDeptModal(d.id)">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="ui-mini ui-mini-red" type="button" title="Xóa" @click="openDeleteModal('dept', d.id, d.name)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===================== BRANCHES ===================== -->
      <section v-else>
        <!-- Toolbar -->
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="text-[16px] md:text-[18px] font-extrabold text-slate-900">Chi nhánh</div>
            <div class="text-[12px] md:text-[13px] text-slate-500 font-semibold">
              Chi nhánh trong hệ thống
            </div>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" class="ui-btn ui-btn-emerald" @click="openBranchModal()">
              <i class="fa-solid fa-plus"></i>
              Thêm chi nhánh
            </button>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="filteredBranches.length === 0" class="ui-card mt-4 p-8 text-center">
          <div class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200">
            <i class="fa-solid fa-code-branch text-xl"></i>
          </div>
          <div class="mt-3 text-[16px] font-extrabold text-slate-900">Không có dữ liệu</div>
          <div class="mt-1 text-[13px] text-slate-500 font-semibold">
            Thử thay đổi bộ lọc hoặc thêm chi nhánh mới
          </div>
          <button type="button" class="ui-btn ui-btn-emerald mt-4" @click="openBranchModal()">
            <i class="fa-solid fa-plus"></i> Thêm chi nhánh
          </button>
        </div>

        <!-- TABLE VIEW -->
        <div v-else-if="branchView === 'table'" class="mt-4 ui-card p-0 overflow-hidden">
          <div
              class="px-4 py-3 border-b border-slate-200/70 flex items-center justify-between"
              style="background: linear-gradient(135deg, #d7e0fd 0%, #e5e1fa 50%, #ffe0f0 100%);"
          >
          <div class="flex items-center gap-2">
              <span class="ui-dot ui-dot-emerald"></span>
              <div class="text-[14px] font-extrabold text-slate-900">Bảng chi nhánh</div>
            </div>
            <div class="text-[12px] text-slate-500 font-semibold">
              Tổng: <span class="text-emerald-700 font-extrabold">{{ filteredBranches.length }}</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="ui-table">
              <thead>
              <tr>
                <th style="width: 52px">#</th>
                <th>CHI NHÁNH</th>
                <th>ĐỊA CHỈ</th>
                <th class="text-right" style="width: 200px">SỐ PHÒNG BAN</th>
                <th class="text-right" style="width: 200px">SỐ NHÂN VIÊN</th>
                <th class="text-right" style="width: 170px">THAO TÁC</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(b, idx) in filteredBranches" :key="b.id">
                <td class="text-slate-500 font-extrabold">{{ idx + 1 }}</td>

                <td>
                  <div class="flex items-center gap-2 min-w-0">
                      <span class="ui-pill ui-pill-emerald">
                        <i class="fa-solid fa-code-branch"></i>
                      </span>
                    <div class="min-w-0">
                      <div class="truncate text-[14px] font-extrabold text-slate-900">{{ b.name }}</div>
                      <div class="text-[12px] text-slate-500 font-semibold">
                        ID: <span class="text-slate-800 font-extrabold">{{ b.id }}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="flex items-start gap-2 min-w-0">
                      <span class="ui-pill ui-pill-slate">
                        <i class="fa-solid fa-location-dot" style="corlor: red !important;"></i>
                      </span>
                    <div class="min-w-0">
                      <div class="text-[13px] font-semibold text-slate-700 line-clamp-2">
                        {{ formatAddressDisplay(b.address) }}
                      </div>
                    </div>
                  </div>
                </td>

                <td class="text-left">
                  <span class="ui-value ui-value-slate whitespace-nowrap">{{ deptCountByBranch(b.id) }} phòng</span>
                </td>

                <td class="text-left">
                  <span class="ui-value ui-value-emerald whitespace-nowrap">{{ employeeCountByBranch(b.id) }} NV</span>
                </td>

                <td class="text-left">
                  <div class="inline-flex justify-end gap-2 whitespace-nowrap">
                    <button class="ui-mini ui-mini-slate" type="button" title="Xem chi tiết" @click="openBranchDetail(b.id)">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="ui-mini ui-mini-blue" type="button" title="Sửa" @click="openBranchModal(b.id)">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="ui-mini ui-mini-red" type="button" title="Xóa" @click="openDeleteModal('branch', b.id, b.name)">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>

    <!-- ===================== MODALS ===================== -->

    <!-- Dept Add/Edit Modal -->
    <transition name="fade">
      <div v-if="deptModal.open" class="ui-overlay" @mousedown.self="closeAllModals()">
        <div class="ui-modal modal-scroll">
          <div class="ui-modal-head ui-head-indigo">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="ui-head-ico">
                  <i class="fa-solid fa-sitemap"></i>
                </span>
                <span class="text-[15px] font-extrabold">{{ deptModal.title }}</span>
              </div>
              <button class="ui-x" type="button" @click="closeAllModals()">&times;</button>
            </div>
          </div>

          <div class="p-5">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label class="ui-label">Tên phòng ban <span class="text-rose-500">*</span></label>
                <input v-model.trim="deptForm.name" class="ui-input" type="text" />
              </div>
              <div>
                <label class="ui-label">Trưởng phòng <span class="text-rose-500">*</span></label>
                <input v-model.trim="deptForm.manager" class="ui-input" type="text" />
              </div>
            </div>

            <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label class="ui-label">Chi nhánh <span class="text-rose-500">*</span></label>
                <select v-model="deptForm.branchId" class="ui-input">
                  <option :value="null">Chọn chi nhánh</option>
                  <option v-for="b in branches" :key="b.id" :value="b.id">
                    {{ b.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="ui-label">Link nhân viên <span class="text-rose-500">*</span></label>
                <input v-model.trim="deptForm.employeeLink" class="ui-input" type="text" />
              </div>
            </div>

            <div class="mt-3">
              <label class="ui-label">Mô tả <span class="text-rose-500">*</span></label>
              <textarea v-model.trim="deptForm.description" class="ui-input" rows="2"></textarea>
            </div>

            <div class="mt-3">
              <label class="ui-label">Chức năng <span class="text-rose-500">*</span></label>
              <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
                <label v-for="f in functionOptions" :key="f.key" class="ui-check">
                  <input type="checkbox" :value="f.key" v-model="deptForm.functions" />
                  <span class="font-extrabold">{{ f.name }}</span>
                </label>
              </div>
            </div>

            <div class="mt-3">
              <label class="ui-label">Ảnh đại diện</label>
              <div class="ui-upload" @click="triggerDeptFile()">
                <div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200">
                  <i class="fa-solid fa-cloud-arrow-up text-xl"></i>
                </div>
                <div class="mt-2 text-[13px] text-slate-700 font-semibold">
                  Kéo thả ảnh hoặc <b class="text-indigo-700">nhấn để chọn</b>
                </div>
                <div class="mt-1 text-[12px] text-slate-500 font-semibold">JPG/PNG/GIF (tối đa 5MB)</div>
                <input ref="deptFileInput" type="file" class="hidden" accept="image/*" @change="onDeptImageChange" />
              </div>

              <div v-if="deptForm.imageUrl" class="mt-3 overflow-hidden rounded-2xl border-2 border-slate-200">
                <img :src="deptForm.imageUrl" alt="Preview" class="h-40 w-full object-cover" />
              </div>
            </div>
          </div>

          <div class="ui-modal-foot">
            <button type="button" class="ui-btn ui-btn-ghost" @click="closeAllModals()">Hủy</button>
            <button type="button" class="ui-btn ui-btn-primary" @click="saveDept()">
              <i class="fa-solid fa-check"></i> Lưu
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Branch Add/Edit Modal -->
    <transition name="fade">
      <div v-if="branchModal.open" class="ui-overlay" @mousedown.self="closeAllModals()">
        <div class="ui-modal modal-scroll">
          <div class="ui-modal-head ui-head-emerald">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="ui-head-ico">
                  <i class="fa-solid fa-code-branch"></i>
                </span>
                <span class="text-[15px] font-extrabold">{{ branchModal.title }}</span>
              </div>
              <button class="ui-x" type="button" @click="closeAllModals()">&times;</button>
            </div>
          </div>

          <div class="p-5">
            <div>
              <label class="ui-label">Tên chi nhánh <span class="text-rose-500">*</span></label>
              <input v-model.trim="branchForm.name" class="ui-input" type="text" />
            </div>

            <div class="mt-3 ui-card p-4 border border-slate-200/70">
              <div class="flex items-center gap-2 mb-3">
                <span class="ui-pill ui-pill-slate"><i class="fa-solid fa-location-dot"></i></span>
                <div class="font-extrabold text-slate-900">Địa chỉ (bắt buộc)</div>
              </div>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label class="ui-label">Tỉnh/Thành phố <span class="text-rose-500">*</span></label>
                  <div class="ui-select">
                    <button type="button" class="ui-select-trigger" @click="toggleProvinceDropdown()">
                      <span class="truncate">
                        {{ branchForm.provinceName || "Chọn Tỉnh/Thành" }}
                      </span>
                      <i class="fa-solid fa-chevron-down text-[12px] text-slate-400"></i>
                    </button>
                    <div v-if="provinceDropdownOpen" class="ui-select-panel">
                      <div class="ui-select-search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input
                          v-model.trim="provinceSearch"
                          type="text"
                          placeholder="Tìm tỉnh/thành..."
                          @keydown.escape.prevent="closeProvinceDropdown()"
                        />
                      </div>
                      <div class="ui-select-list">
                        <button
                          v-for="p in filteredProvinces"
                          :key="p.name"
                          type="button"
                          class="ui-select-item"
                          @click="selectProvince(p.name)"
                        >
                          {{ p.name }}
                        </button>
                        <div v-if="filteredProvinces.length === 0" class="ui-select-empty">
                          Không tìm thấy tỉnh/thành
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="ui-label">Phường/Xã <span class="text-rose-500">*</span></label>
                  <div class="ui-select" :class="{ disabled: !branchForm.provinceName }">
                    <button
                      type="button"
                      class="ui-select-trigger"
                      :disabled="!branchForm.provinceName"
                      @click="toggleWardDropdown()"
                    >
                      <span class="truncate">
                        {{ branchForm.wardName || "Chọn Phường/Xã" }}
                      </span>
                      <i class="fa-solid fa-chevron-down text-[12px] text-slate-400"></i>
                    </button>
                    <div v-if="wardDropdownOpen" class="ui-select-panel">
                      <div class="ui-select-search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input
                          v-model.trim="wardSearch"
                          type="text"
                          placeholder="Tìm phường/xã..."
                          @keydown.escape.prevent="closeWardDropdown()"
                        />
                      </div>
                      <div class="ui-select-list">
                        <button
                          v-for="w in filteredWards"
                          :key="w.name"
                          type="button"
                          class="ui-select-item"
                          @click="selectWard(w.name)"
                        >
                          {{ w.name }}
                        </button>
                        <div v-if="filteredWards.length === 0" class="ui-select-empty">
                          Không tìm thấy phường/xã
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="md:col-span-2">
                  <label class="ui-label">Địa chỉ chi tiết <span class="text-rose-500">*</span></label>
                  <input
                      v-model.trim="branchForm.addressDetail"
                      class="ui-input"
                      type="text"
                      placeholder="Ví dụ: Số 12 đường ABC, Quận 1"
                  />
                </div>
              </div>

              <div class="mt-3">
                <div class="text-[12px] text-slate-500 font-semibold">Xem trước địa chỉ:</div>
                <div class="mt-1 text-[14px]  text-slate-800">
                  {{ previewBranchAddress || "—" }}
                </div>
              </div>
            </div>
          </div>

          <div class="ui-modal-foot">
            <button type="button" class="ui-btn ui-btn-ghost" @click="closeAllModals()">Hủy</button>
            <button type="button" class="ui-btn ui-btn-emerald" @click="saveBranch()">
              <i class="fa-solid fa-check"></i> Lưu
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Dept Detail Modal -->
    <transition name="fade">
      <div v-if="deptDetail.open" class="ui-overlay" @mousedown.self="closeAllModals()">
        <div class="ui-modal modal-scroll">
          <div class="ui-modal-head ui-head-slate">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="ui-head-ico">
                  <i class="fa-solid fa-eye"></i>
                </span>
                <span class="text-[15px] font-extrabold">Chi tiết phòng ban</span>
              </div>
              <button class="ui-x" type="button" @click="closeAllModals()">&times;</button>
            </div>
          </div>

          <div class="p-5" v-if="deptDetail.data">
            <div class="flex items-start gap-4">
              <div class="h-16 w-16 rounded-2xl overflow-hidden ring-2 ring-slate-200 shrink-0">
                <img :src="deptDetail.data.imageUrl" :alt="deptDetail.data.name" class="h-full w-full object-cover" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-[16px] md:text-[18px] font-extrabold text-slate-900 truncate">
                  {{ deptDetail.data.name }}
                </div>
                <div class="mt-1 text-[13px] text-slate-600 font-semibold">
                  {{ deptDetail.data.description }}
                </div>

                <div class="mt-3 flex flex-wrap gap-2">
                  <span class="ui-value ui-value-indigo whitespace-nowrap">{{ deptDetail.data.employees }} NV</span>
                </div>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div class="ui-info">
                <span class="ui-pill ui-pill-blue"><i class="fa-solid fa-user-tie"></i></span>
                <div class="min-w-0">
                  <div class="ui-info-label">Trưởng phòng</div>
                  <div class="ui-info-value">{{ deptDetail.data.manager }}</div>
                </div>
              </div>

              <div class="ui-info">
                <span class="ui-pill ui-pill-purple"><i class="fa-solid fa-code-branch"></i></span>
                <div class="min-w-0">
                  <div class="ui-info-label">Chi nhánh</div>
                  <div class="ui-info-value">{{ deptDetail.data.branchName || "—" }}</div>
                </div>
              </div>

              <div class="ui-info md:col-span-2">
                <span class="ui-pill ui-pill-emerald"><i class="fa-solid fa-shapes"></i></span>
                <div class="min-w-0">
                  <div class="ui-info-label">Chức năng</div>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span class="ui-tag ui-tag-emerald">{{ deptDetail.data.functionName || "—" }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="ui-modal-foot">
            <button type="button" class="ui-btn ui-btn-ghost" @click="closeAllModals()">Đóng</button>
            <button v-if="deptDetail.data" type="button" class="ui-btn ui-btn-indigo" @click="openDeptModal(deptDetail.data.id)">
              <i class="fa-solid fa-pen-to-square"></i> Sửa
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Branch Detail Modal -->
    <transition name="fade">
      <div v-if="branchDetail.open" class="ui-overlay" @mousedown.self="closeAllModals()">
        <div class="ui-modal modal-scroll">
          <div class="ui-modal-head ui-head-slate">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="ui-head-ico">
                  <i class="fa-solid fa-eye"></i>
                </span>
                <span class="text-[15px] font-extrabold">Chi tiết chi nhánh</span>
              </div>
              <button class="ui-x" type="button" @click="closeAllModals()">&times;</button>
            </div>
          </div>

          <div class="p-4">
            <div v-if="branchDetail.error" class="text-center">
              <div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 ring-2 ring-rose-200">
                <i class="fa-solid fa-circle-exclamation text-lg"></i>
              </div>
              <div class="mt-3 text-[14px] font-extrabold text-slate-800">Không thể tải dữ liệu</div>
              <div class="mt-1 text-[12px] font-semibold text-slate-500">{{ branchDetail.error }}</div>
            </div>

            <div v-else-if="branchDetail.data">
              <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="ui-pill ui-pill-emerald"><i class="fa-solid fa-code-branch"></i></span>
                    <div class="min-w-0">
                      <div class="text-[16px] md:text-[18px] font-extrabold text-slate-900 truncate">
                        {{ branchDetail.data.name }}
                      </div>
                      <div class="text-[13px] text-slate-500 font-semibold">
                        ID: <span class="text-slate-800 font-extrabold">{{ branchDetail.data.id }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 flex items-start gap-2 min-w-0">
                    <span class="ui-pill ui-pill-slate"><i class="fa-solid fa-location-dot"></i></span>
                    <div class="text-[14px] font-semibold text-slate-800">
                      {{ formatAddressDisplay(branchDetail.data.address) }}
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <span class="ui-value ui-value-slate">{{ branchDetail.data.roomCount }} phòng</span>
                  <span class="ui-value ui-value-emerald">{{ branchDetail.data.employeeCount }} NV</span>
                </div>
              </div>

              <div class="mt-4">
                <div class="flex items-center gap-2 mb-3">
                  <span class="ui-dot ui-dot-indigo"></span>
                  <div class="text-[14px] font-extrabold text-slate-900">Phòng ban thuộc chi nhánh</div>
                  <span class="ui-chip">{{ branchDetail.data.rooms.length }}</span>
                </div>

                <div v-if="branchDetail.data.rooms.length" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div
                    v-for="(room, idx) in branchDetail.data.rooms"
                    :key="`${room.name}-${idx}`"
                    class="border border-slate-200/70 rounded-2xl p-3 bg-transparent"
                  >
                    <div class="flex items-start gap-2">
                      <span class="ui-pill ui-pill-indigo"><i class="fa-solid fa-building-user"></i></span>
                      <div class="min-w-0">
                        <div class="text-[14px] font-extrabold text-emerald-600">{{ room.name }}</div>
                        <div
                          class="text-[12px] font-semibold text-slate-500 mt-1 line-clamp-2"
                          v-html="room.description || 'Không có mô tả'"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-[13px] font-extrabold text-slate-500">Chưa có phòng ban</div>
              </div>
            </div>
          </div>

          <div class="ui-modal-foot">
            <button type="button" class="ui-btn ui-btn-emerald" @click="openBranchModal(branchDetail.data.id)">
              <i class="fa-solid fa-pen-to-square"></i> Sửa
            </button>
            <button type="button" class="ui-btn ui-btn-ghost" @click="closeAllModals()">Đóng</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Modal -->
    <transition name="fade">
      <div v-if="deleteModal.open" class="ui-overlay" @mousedown.self="closeAllModals()">
        <div class="ui-modal max-w-sm overflow-hidden">
          <div class="p-6 text-center">
            <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-rose-700 ring-2 ring-rose-200">
              <i class="fa-solid fa-triangle-exclamation text-xl"></i>
            </div>
            <div class="mt-3 text-[16px] font-extrabold text-slate-900">{{ deleteModal.title }}</div>
            <div class="mt-1 text-[13px] text-slate-600 font-semibold">
              Xóa <b class="text-slate-900">{{ deleteModal.name }}</b> ? (Không thể hoàn tác)
            </div>

            <div class="mt-5 flex justify-center gap-2">
              <button type="button" class="ui-btn ui-btn-ghost" @click="closeAllModals()">Hủy</button>
              <button type="button" class="ui-btn ui-btn-danger" @click="confirmDelete()">
                <i class="fa-solid fa-trash"></i> Xóa
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import api from "/src/api/api.js";
import addressData from "/src/assets/js/address.json";
import {
  confirmWithInput,
  showError,
  showLoading,
  showSuccess,
  updateAlertError,
  updateAlertSuccess,
} from "/src/assets/js/alertService.js";

/** Tabs */
const tabs = [
  { key: "departments", label: "Phòng ban", icon: "fa-solid fa-users" },
  { key: "branches", label: "Chi nhánh", icon: "fa-solid fa-code-branch" },
];

const currentTab = ref("departments");
const deptView = ref("table"); // table | card
const branchView = ref("table"); // table | card
const toggleDeptFilter = ref(true);

/** Function config */
const functionMap = {
  consulting: { name: "Tư vấn" },
  tele: { name: "Tele" },
  marketing: { name: "Marketing" },
  it: { name: "Thông tin" },
  deployment: { name: "Triển khai" },
  qa: { name: "QA/Testing" },
  hr: { name: "Nhân sự" },
  finance: { name: "Tài chính" },
};
const functionOptions = Object.entries(functionMap).map(([key, v]) => ({ key, name: v.name }));

/** Provinces */
const provinces = Array.isArray(addressData) ? addressData : [];
const wardsByProvince = computed(() => {
  const p = provinces.find((x) => x.name === branchForm.provinceName);
  return p?.wards || [];
});

const provinceDropdownOpen = ref(false);
const wardDropdownOpen = ref(false);
const provinceSearch = ref("");
const wardSearch = ref("");

const filteredProvinces = computed(() => {
  const keyword = provinceSearch.value.toLowerCase();
  return provinces.filter((p) => p.name.toLowerCase().includes(keyword));
});
const filteredWards = computed(() => {
  const keyword = wardSearch.value.toLowerCase();
  return wardsByProvince.value.filter((w) => w.name.toLowerCase().includes(keyword));
});

/** Branch data (BE: ChiNhanhDTO) */
const branches = ref([]);
const fetchBranches = async () => {
  try {
    const res = await api.get("/quan-ly-chi-nhanh/admin/all");
    const data = Array.isArray(res.data) ? res.data : [];
    branches.value = data.map((item) => ({
      id: item.id,
      name: item.ten,
      address: item.diaChi,
      roomCount: item.soLuongPhong ?? 0,
      employeeCount: item.soLuongNhanVien ?? 0,
    }));
  } catch (error) {
    console.error("❌ Lỗi fetch chi nhánh", error);
    branches.value = [];
  }
};

/** Department data (BE: DepartmentFullTableDTO) */
const departments = ref([]);

/** Filters */
const deptFilter = reactive({ branchId: "all", function: "all", search: "" });
const branchFilter = reactive({ search: "" });
const appliedDeptFilter = reactive({ branchId: "all", function: "all", search: "" });
const appliedBranchFilter = reactive({ search: "" });

function applyDeptFilter() {
  appliedDeptFilter.branchId = deptFilter.branchId;
  appliedDeptFilter.function = deptFilter.function;
  appliedDeptFilter.search = deptFilter.search;
}
function applyBranchFilter() {
  appliedBranchFilter.search = branchFilter.search;
}
function resetDeptFilter() {
  deptFilter.branchId = "all";
  deptFilter.function = "all";
  deptFilter.search = "";
  applyDeptFilter();
}
function resetBranchFilter() {
  branchFilter.search = "";
  applyBranchFilter();
}

/** Computed lists */
const filteredDepartments = computed(() => departments.value);

const filteredBranches = computed(() => {
  const s = (appliedBranchFilter.search || "").toLowerCase();
  return branches.value.filter((b) => {
    if (!s) return true;
    const addr = formatAddressDisplay(b.address).toLowerCase();
    return b.name.toLowerCase().includes(s) || addr.includes(s);
  });
});

/** Helpers */
function branchById(id) {
  return branches.value.find((b) => b.id === Number(id)) || null;
}
function deptCountByBranch(branchId) {
  const branch = branchById(branchId);
  if (branch && Number.isFinite(Number(branch.roomCount))) return Number(branch.roomCount);
  return departments.value.filter((d) => Number(d.branchId) === Number(branchId)).length;
}
function employeeCountByBranch(branchId) {
  const branch = branchById(branchId);
  if (branch && Number.isFinite(Number(branch.employeeCount))) return Number(branch.employeeCount);
  return departments.value
      .filter((d) => Number(d.branchId) === Number(branchId))
      .reduce((sum, d) => sum + (Number(d.employees) || 0), 0);
}
function deptListByBranch(branchId) {
  return departments.value.filter((d) => Number(d.branchId) === Number(branchId));
}

/** Address format */
function formatAddressDisplay(addr) {
  if (!addr) return "";
  return String(addr).split("/!!").join(", ");
}
function buildAddress(detail, wardName, provinceName) {
  return `${detail}/!!${wardName}/!!${provinceName}`;
}

/** Modals state */
const deptModal = reactive({ open: false, title: "Thêm phòng ban", editingId: null });
const branchModal = reactive({ open: false, title: "Thêm chi nhánh", editingId: null });
const deleteModal = reactive({ open: false, type: null, id: null, name: "", title: "" });
const deptDetail = reactive({ open: false, data: null });
const branchDetail = reactive({ open: false, data: null, loading: false, error: "" });

/** Forms */
const deptForm = reactive({
  name: "",
  manager: "",
  branchId: null,
  employeeLink: "/#",
  description: "",
  functions: [],
  imageUrl: "",
});
const branchForm = reactive({
  name: "",
  addressDetail: "",
  provinceName: "",
  wardName: "",
});

/** Preview address */
const previewBranchAddress = computed(() => {
  const a = branchForm.addressDetail?.trim();
  const w = branchForm.wardName?.trim();
  const p = branchForm.provinceName?.trim();
  if (!a || !w || !p) return "";
  return formatAddressDisplay(buildAddress(a, w, p));
});

/** IDs */
const nextDeptId = ref(departments.value.length + 1);
const nextBranchId = ref(branches.value.length + 1);

/** Fake select handlers */
function toggleProvinceDropdown() {
  provinceDropdownOpen.value = !provinceDropdownOpen.value;
  wardDropdownOpen.value = false;
}
function closeProvinceDropdown() {
  provinceDropdownOpen.value = false;
  provinceSearch.value = "";
}
function toggleWardDropdown() {
  if (!branchForm.provinceName) return;
  wardDropdownOpen.value = !wardDropdownOpen.value;
  provinceDropdownOpen.value = false;
}
function closeWardDropdown() {
  wardDropdownOpen.value = false;
  wardSearch.value = "";
}
function selectProvince(name) {
  branchForm.provinceName = name;
  branchForm.wardName = "";
  closeProvinceDropdown();
}
function selectWard(name) {
  branchForm.wardName = name;
  closeWardDropdown();
}

/** Upload */
const deptFileInput = ref(null);
function triggerDeptFile() {
  deptFileInput.value?.click();
}
function onDeptImageChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    deptForm.imageUrl = String(ev.target?.result || "");
  };
  reader.readAsDataURL(file);
}

/** Open/Close */
function closeAllModals() {
  deptModal.open = false;
  branchModal.open = false;
  deleteModal.open = false;
  deptDetail.open = false;
  branchDetail.open = false;

  deptModal.editingId = null;
  branchModal.editingId = null;

  deleteModal.type = null;
  deleteModal.id = null;
  deleteModal.name = "";
  deleteModal.title = "";

  deptDetail.data = null;
  branchDetail.data = null;
  branchDetail.loading = false;
  branchDetail.error = "";

  closeProvinceDropdown();
  closeWardDropdown();
}

function openDeptModal(id = null) {
  deptModal.open = true;
  deptModal.editingId = id;
  deptModal.title = id ? "Sửa phòng ban" : "Thêm phòng ban";

  if (id) {
    const d = departments.value.find((x) => x.id === id);
    if (!d) return;
    deptForm.name = d.name;
    deptForm.manager = d.manager;
    deptForm.branchId = d.branchId;
    deptForm.employeeLink = d.employeeLink || "/#";
    deptForm.description = d.description;
    deptForm.functions = [...(d.functions || [])];
    deptForm.imageUrl = d.imageUrl || "";
  } else {
    deptForm.name = "";
    deptForm.manager = "";
    deptForm.branchId = null;
    deptForm.employeeLink = "/#";
    deptForm.description = "";
    deptForm.functions = [];
    deptForm.imageUrl = "";
  }
}

function openBranchModal(id = null) {
  branchModal.open = true;
  branchModal.editingId = id;
  branchModal.title = id ? "Sửa chi nhánh" : "Thêm chi nhánh";

  if (id) {
    const b = branches.value.find((x) => x.id === id);
    if (!b) return;

    branchForm.name = b.name;
    const parts = String(b.address || "").split("/!!");
    branchForm.addressDetail = parts[0] || "";
    branchForm.wardName = parts[1] || "";
    branchForm.provinceName = parts[2] || "";
    provinceSearch.value = "";
    wardSearch.value = "";
  } else {
    branchForm.name = "";
    branchForm.addressDetail = "";
    branchForm.provinceName = "";
    branchForm.wardName = "";
    provinceSearch.value = "";
    wardSearch.value = "";
  }
}

function openDeleteModal(type, id, name) {
  deleteModal.open = true;
  deleteModal.type = type;
  deleteModal.id = id;
  deleteModal.name = name;
  deleteModal.title = type === "dept" ? "Xóa phòng ban?" : "Xóa chi nhánh?";
}

/** Detail modals */
function openDeptDetail(id) {
  const d = departments.value.find((x) => x.id === id);
  if (!d) return;
  deptDetail.open = true;
  deptDetail.data = { ...d };
}
function openBranchDetail(id) {
  const b = branches.value.find((x) => x.id === id);
  if (!b) return;
  branchDetail.open = true;
  branchDetail.loading = true;
  branchDetail.error = "";
  branchDetail.data = null;
  fetchBranchDetail(id, b);
}

async function fetchBranchDetail(id, fallbackBranch) {
  try {
    const res = await api.get(`/quan-ly-chi-nhanh/admin/${id}/chi-tiet`);
    const payload = res?.data || {};
    const chiNhanh = payload.chiNhanh || {};
    const danhSachPhong = Array.isArray(payload.danhSachPhong) ? payload.danhSachPhong : [];
    branchDetail.data = {
      id: chiNhanh.id ?? fallbackBranch.id,
      name: chiNhanh.ten ?? fallbackBranch.name,
      address: chiNhanh.diaChi ?? fallbackBranch.address,
      roomCount: chiNhanh.soLuongPhong ?? fallbackBranch.roomCount ?? danhSachPhong.length,
      employeeCount: chiNhanh.soLuongNhanVien ?? fallbackBranch.employeeCount ?? 0,
      rooms: danhSachPhong.map((room) => ({
        name: room.tenPhong,
        description: room.moTa,
      })),
    };
  } catch (error) {
    console.error("❌ Lỗi fetch chi tiết chi nhánh", error);
    branchDetail.error = "Vui lòng thử lại sau.";
    branchDetail.data = {
      ...fallbackBranch,
      roomCount: fallbackBranch.roomCount ?? 0,
      employeeCount: fallbackBranch.employeeCount ?? 0,
      rooms: deptListByBranch(id).map((room) => ({ name: room.name, description: room.description })),
    };
  } finally {
    branchDetail.loading = false;
  }
}

async function fetchDepartments() {
  try {
    const params = {};
    if (deptFilter.search) {
      params.name = deptFilter.search;
    }
    if (deptFilter.branchId !== "all") {
      params.branchId = deptFilter.branchId;
    }

    const res = await api.get("/admin.thg/department-new/view", { params });
    const data = Array.isArray(res.data) ? res.data : [];
    departments.value = data.map((item, index) => {
      const branchMatch = branches.value.find((b) => b.name === item.branchName) || null;
      return {
        id: index + 1,
        name: item.departmentName,
        avatar: item.avatar,
        description: item.description,
        manager: item.managerName,
        managerAvatar: item.managerAvatar,
        branchName: item.branchName,
        branchId: branchMatch?.id ?? null,
        functionName: item.functionName,
        employees: item.totalEmployee ?? 0,
        imageUrl:
          item.managerAvatar ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      };
    });
  } catch (error) {
    console.error("❌ Lỗi fetch phòng ban", error);
    departments.value = [];
  }
}

/** CRUD */
function saveDept() {
  const name = deptForm.name.trim();
  const manager = deptForm.manager.trim();
  const branchId = deptForm.branchId;
  const employeeLink = (deptForm.employeeLink || "/#").trim();
  const description = deptForm.description.trim();
  const functions = deptForm.functions || [];
  const imageUrl =
      deptForm.imageUrl ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

  if (!name || !manager || !branchId || !description || functions.length === 0) {
    alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    return;
  }

  if (deptModal.editingId) {
    const idx = departments.value.findIndex((x) => x.id === deptModal.editingId);
    if (idx !== -1) {
      departments.value[idx] = {
        ...departments.value[idx],
        name,
        manager,
        branchId,
        employeeLink,
        description,
        functions: [...functions],
        imageUrl,
      };
    }
  } else {
    departments.value.push({
      id: nextDeptId.value++,
      name,
      manager,
      branchId,
      employeeLink,
      description,
      functions: [...functions],
      imageUrl,
      createdAt: new Date().toISOString().split("T")[0],
      employees: Math.floor(Math.random() * 25) + 5,
    });
  }

  closeAllModals();
}

async function saveBranch() {
  const name = branchForm.name.trim();
  const detail = branchForm.addressDetail.trim();
  const wardName = branchForm.wardName.trim();
  const provinceName = branchForm.provinceName.trim();

  if (!name || !detail || !wardName || !provinceName) {
    showError("Thiếu thông tin", "Vui lòng nhập Tên chi nhánh và đủ 3 phần địa chỉ.");
    return;
  }

  const storedAddress = buildAddress(detail, wardName, provinceName);

  if (branchModal.editingId) {
    try {
      const res = await showLoading(
          api.put(`/quan-ly-chi-nhanh/admin/${branchModal.editingId}`, {
            name,
            address: storedAddress,
          })
      );
      if (res?.status === 200) {
        const idx = branches.value.findIndex((x) => x.id === branchModal.editingId);
        if (idx !== -1) {
          branches.value[idx] = { ...branches.value[idx], name, address: storedAddress };
        }
        if (branchDetail.open && branchDetail.data?.id === branchModal.editingId) {
          branchDetail.data = { ...branchDetail.data, name, address: storedAddress };
        }
        updateAlertSuccess("Cập nhật chi nhánh thành công!");
        closeAllModals();
      } else {
        updateAlertError("Không thể cập nhật chi nhánh, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("❌ Lỗi cập nhật chi nhánh", error);
      updateAlertError("Không thể cập nhật chi nhánh, vui lòng thử lại!");
    }
    return;
  }

  try {
    const res = await showLoading(
      api.post("/quan-ly-chi-nhanh/admin", {
        name,
        address: storedAddress,
      })
    );
    const payload = res?.data;
    if (payload?.success) {
      const newId = payload?.data ?? nextBranchId.value++;
      branches.value.push({ id: newId, name, address: storedAddress });
      showSuccess("Tạo chi nhánh thành công!");
      closeAllModals();
    } else {
      showError("Không thể tạo chi nhánh", payload?.message || "Vui lòng thử lại!");
    }
  } catch (error) {
    console.error("❌ Lỗi tạo chi nhánh", error);
    showError("Không thể tạo chi nhánh", "Vui lòng thử lại!");
  }
}

function confirmDelete() {
  if (!deleteModal.open) return;

  if (deleteModal.type === "dept") {
    departments.value = departments.value.filter((d) => d.id !== deleteModal.id);
    closeAllModals();
    return;
  }

  if (deleteModal.type === "branch") {
    if (departments.value.some((d) => Number(d.branchId) === Number(deleteModal.id))) {
      showError("Không thể xóa chi nhánh", "Chi nhánh đang có phòng ban.");
      return;
    }
    confirmWithInput(
      "Xác nhận xóa chi nhánh",
      `Nhập đúng tên chi nhánh "${deleteModal.name}" để xác nhận.`,
      deleteModal.name,
      async () => {
        try {
          const res = await showLoading(api.delete(`/quan-ly-chi-nhanh/admin/${deleteModal.id}`));
          const payload = res?.data;
          if (payload?.success) {
            branches.value = branches.value.filter((x) => x.id !== deleteModal.id);
            if (branchDetail.open && branchDetail.data?.id === deleteModal.id) {
              branchDetail.open = false;
              branchDetail.data = null;
            }
            showSuccess("Xóa chi nhánh thành công!");
            closeAllModals();
          } else {
            showError("Không thể xóa chi nhánh", payload?.message || "Vui lòng thử lại!");
          }
        } catch (error) {
          console.error("❌ Lỗi xóa chi nhánh", error);
          showError("Không thể xóa chi nhánh", "Vui lòng thử lại!");
        }
      }
    );
  }
}

/** init */
applyDeptFilter();
applyBranchFilter();
onMounted(async () => {
  await fetchBranches();
  await fetchDepartments();
});

let deptFetchTimer = null;
watch(
  () => [deptFilter.search, deptFilter.branchId],
  () => {
    applyDeptFilter();
    if (deptFetchTimer) {
      clearTimeout(deptFetchTimer);
    }
    deptFetchTimer = setTimeout(() => {
      fetchDepartments();
    }, 300);
  }
);
</script>

<style scoped>
/* Base */
:global(html) { font-size: 16px; }
:global(body) { background: #f8fafc; }

/* Scrollbar (subtle) */
:global(::-webkit-scrollbar){ width:8px; height:8px; }
:global(::-webkit-scrollbar-track){ background: rgba(2,6,23,.06); border-radius: 999px; }
:global(::-webkit-scrollbar-thumb){ background: rgba(100,116,139,.35); border-radius: 999px; }
:global(::-webkit-scrollbar-thumb:hover){ background: rgba(100,116,139,.5); }

/* Atoms */
.ui-card{
  background: rgba(255,255,255,.92);
  border: 1px solid rgba(148,163,184,.35);
  border-radius: 18px;
  box-shadow: 0 12px 34px rgba(2,6,23,.06);
}
.ui-dot{
  width:10px;height:10px;border-radius:999px; display:inline-block;
}
.ui-dot-indigo{ background:#4f46e5; box-shadow:0 0 0 4px rgba(79,70,229,.12); }
.ui-dot-emerald{ background:#10b981; box-shadow:0 0 0 4px rgba(16,185,129,.12); }

.ui-brand{
  width:44px;height:44px;border-radius:16px;
  display:grid;place-items:center;
  color:#fff;
  background: linear-gradient(135deg, #4f46e5 0%, #667eea 60%, #4facfe 100%);
  box-shadow: 0 14px 34px rgba(79,70,229,.18);
}
.ui-avatar{
  width:40px;height:40px;border-radius:999px;
  display:grid;place-items:center;color:#fff;
  background: linear-gradient(135deg, #111827 0%, #334155 60%, #64748b 100%);
  box-shadow: 0 14px 34px rgba(2,6,23,.18);
  font-size: 14px;
}

.ui-ico-btn{
  position:relative;
  width:44px;height:44px;border-radius:16px;
  display:grid;place-items:center;
  color:#0b1220;
  background:#fff;
  border: 1px solid rgba(148,163,184,.45);
  box-shadow: 0 10px 24px rgba(2,6,23,.06);
  transition: transform .16s ease, border-color .16s ease;
}
.ui-ico-btn:hover{ transform: translateY(-1px); border-color: rgba(79,70,229,.35); }
.ui-badge{
  position:absolute; top:-6px; right:-6px;
  width:20px; height:20px;
  display:grid; place-items:center;
  border-radius:999px;
  background: #ef4444;
  color:#fff; font-size:11px; font-weight:900;
  border: 2px solid #fff;
}

/* Tabs */
.ui-tabs{
  display:flex; gap:.6rem; overflow:auto; padding:.15rem;
}
.ui-tab{
  display:inline-flex; align-items:center; gap:.6rem;
  padding:.58rem 1rem;
  border-radius: 999px;
  background: #fff;
  border: 1px solid rgba(148,163,184,.45);
  color:#334155;
  transition: all .16s ease;
}
.ui-tab:hover{ border-color: rgba(79,70,229,.35); background: rgba(79,70,229,.04); }
.ui-tab.active{
  color: #3337de;
  border-color: rgba(56, 46, 224, 0.55);
  box-shadow: 0 12px 28px rgba(2,6,23,.06);
}
.ui-chip{
  margin-left:.2rem;
  padding:.15rem .5rem;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
  background: rgba(79,70,229,.10);
  color:#3730a3;
  border: 1px solid rgba(79,70,229,.25);
}
.ui-chip-emerald{
  background: rgba(16,185,129,.10);
  color:#065f46;
  border-color: rgba(16,185,129,.25);
}

/* Segmented */
.ui-seg{
  display:inline-flex;
  background:#fff;
  border: 1px solid rgba(148,163,184,.45);
  border-radius: 999px;
  padding: 4px;
  box-shadow: 0 10px 22px rgba(2,6,23,.05);
}
.ui-seg-btn{
  display:inline-flex; align-items:center; gap:.5rem;
  padding:.5rem .75rem;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;
  color:#334155;
  transition: all .16s ease;
}
.ui-seg-btn.active{
  background: rgba(79,70,229,.12);
  color:#3730a3;
}
.ui-seg-emerald .ui-seg-btn.active{
  background: rgba(16,185,129,.12);
  color:#065f46;
}

/* Buttons */
.ui-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:.6rem;
  padding: .62rem 1rem;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 950;
  border: 1px solid transparent;
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
  user-select:none;
}
.ui-btn:hover{ transform: translateY(-1px); }
.ui-btn:active{ transform: translateY(0); }

.ui-btn-ghost{
  background: #fff;
  color:#334155;
  border-color: rgba(148,163,184,.45);
  box-shadow: 0 10px 22px rgba(2,6,23,.05);
}
.ui-btn-ghost:hover{ border-color: rgba(79,70,229,.35); }

.ui-btn-primary{
  color:#fff;
  background: linear-gradient(135deg, #4f46e5 0%, #667eea 60%, #4facfe 100%);
  box-shadow: 0 14px 34px rgba(79,70,229,.18);
}
.ui-btn-indigo{
  color:#fff;
  background: linear-gradient(135deg, #4338ca 0%, #4f46e5 55%, #60a5fa 100%);
  box-shadow: 0 14px 34px rgba(67,56,202,.16);
}
.ui-btn-emerald{
  color:#fff;
  background: linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%);
  box-shadow: 0 14px 34px rgba(16,185,129,.16);
}
.ui-btn-danger{
  color:#fff;
  background: linear-gradient(135deg, #ef4444 0%, #fb7185 60%, #f43f5e 100%);
  box-shadow: 0 14px 34px rgba(244,63,94,.16);
}

/* Inputs */
.ui-label{
  font-size: 13px;
  font-weight: 600;
  color:#0b1220;
  margin-bottom: 6px;
}
.ui-input-wrap{ position:relative; }
.ui-input-ico{
  position:absolute; left:12px; top:50%;
  transform: translateY(-50%);
  color:#94a3b8;
  font-size: 14px;
}
.ui-input{
  width:100%;
  border-radius: 14px;
  border: 1px solid rgba(148,163,184,.55);
  background: #fff;
  padding: .72rem .9rem;
  font-size: 14px;
  outline: none;
  font-weight: 500;
  transition: box-shadow .16s ease, border-color .16s ease;
}
.ui-input:focus{
  border-color: rgba(79,70,229,.55);
  box-shadow: 0 0 0 5px rgba(79,70,229,.12);
}

/* Fake select */
.ui-select{ position:relative; }
.ui-select.disabled .ui-select-trigger{ background: #f1f5f9; color:#94a3b8; cursor:not-allowed; }
.ui-select-trigger{
  width:100%;
  border-radius: 14px;
  border: 1px solid rgba(148,163,184,.55);
  background: #fff;
  padding: .72rem .9rem;
  font-size: 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:.5rem;
  font-weight: 500;
  color:#0b1220;
}
.ui-select-panel{
  position:absolute;
  top: calc(100% + 6px);
  left:0;
  right:0;
  background:#fff;
  border:1px solid rgba(148,163,184,.55);
  border-radius: 16px;
  box-shadow: 0 18px 32px rgba(2,6,23,.12);
  z-index: 30;
  overflow: hidden;
}
.ui-select-search{
  display:flex;
  align-items:center;
  gap:.5rem;
  padding:.6rem .8rem;
  border-bottom:1px solid rgba(148,163,184,.35);
  font-size: 13px;
  color:#94a3b8;
}
.ui-select-search input{
  width:100%;
  border:none;
  outline:none;
  font-size: 13px;
  font-weight: 400;
  color:#0b1220;
}
.ui-select-list{
  max-height: 220px;
  overflow:auto;
  padding:.35rem;
}
.ui-select-item{
  width:100%;
  text-align:left;
  padding:.5rem .7rem;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color:#0b1220;
}
.ui-select-item:hover{
  background: rgba(79,70,229,.08);
  color:#3730a3;
}
.ui-select-empty{
  padding:.7rem;
  font-size: 12px;
  font-weight: 700;
  color:#94a3b8;
}

/* Table */
.ui-table{
  width:100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 12px;
}
.ui-table thead th{
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
  text-align:left;
  padding: 12px 14px;
  color:#0b1220;
  font-weight: 950;
  border-bottom: 1px solid rgba(148,163,184,.45);
  white-space: nowrap;
}
.ui-table tbody td{
  padding: 12px 14px;
  border-bottom: 1px solid rgba(148,163,184,.25);
  vertical-align: middle;
}
.ui-table tbody tr:hover td{ background: rgba(79,70,229,.03); }

/* Pills */
.ui-pill{
  width:34px;height:34px;border-radius: 14px;
  display:grid;place-items:center;
  border: 1px solid rgba(148,163,184,.35);
  background:#fff;
  color:#0b1220;
  flex-shrink:0;
}
.ui-pill-blue{ background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }
.ui-pill-purple{ background:#faf5ff; border-color:#e9d5ff; color:#6d28d9; }
.ui-pill-emerald{ background:#ecfdf5; border-color:#bbf7d0; color:#047857; }
.ui-pill-slate{ background:#f1f5f9; border-color:#cbd5e1; color:#334155; }

/* Tags */
.ui-tag{
  display:inline-flex; align-items:center;
  padding: .28rem .65rem;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 950;
  border: 1px solid rgba(148,163,184,.35);
  white-space: nowrap;
}
.ui-tag-gray{ background:#f1f5f9; color:#0b1220; border-color:#cbd5e1; }
.ui-tag-slate{ background:#f1f5f9; border-color:#cbd5e1; color:#0b1220; }
.ui-tag-blue{ background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }
.ui-tag-indigo{ background:#eef2ff; border-color:#c7d2fe; color:#3730a3; }
.ui-tag-purple{ background:#faf5ff; border-color:#e9d5ff; color:#6d28d9; }
.ui-tag-emerald{ background:#ecfdf5; border-color:#bbf7d0; color:#047857; }
.ui-tag-amber{ background:#fffbeb; border-color:#fde68a; color:#b45309; }
.ui-tag-red{ background:#fff1f2; border-color:#fecdd3; color:#be123c; }
.ui-tag-lime{ background:#f7fee7; border-color:#d9f99d; color:#4d7c0f; }

/* Values */
.ui-value{
  display:inline-flex; align-items:center; justify-content:center;
  padding: .18rem .55rem;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;
  border: 1px solid rgba(148,163,184,.35);
}
.ui-value-indigo{ background:#eef2ff; border-color:#c7d2fe; color:#3730a3; }
.ui-value-emerald{ background:#ecfdf5; border-color:#bbf7d0; color:#047857; }
.ui-value-slate{ background: rgba(254,249,195,.72); border-color:#facc15; color:#a16207; }
.ui-value-white{ background: rgba(255,255,255,.92); border-color: rgba(255,255,255,.55); color:#0b1220; }

/* Mini actions */
.ui-mini{
  width:34px;height:34px;border-radius: 12px;
  display:grid;place-items:center;
  border: 1px solid rgba(148,163,184,.55);
  background:#fff;
  transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
}
.ui-mini:hover{ transform: translateY(-1px); box-shadow: 0 10px 22px rgba(2,6,23,.08); }
.ui-mini-slate{ color:#334155; }
.ui-mini-blue{ color:#1d4ed8; border-color: rgba(59,130,246,.35); }
.ui-mini-red{ color:#e11d48; border-color: rgba(244,63,94,.35); }

/* Card overlay */
.ui-img-overlay{
  background: linear-gradient(180deg, rgba(2,6,23,.10) 0%, rgba(2,6,23,.45) 100%);
}

/* FAB */
.ui-fab{
  width:30px;height:30px;border-radius:999px;
  display:grid;place-items:center;
  background: rgba(255,255,255,.92);
  color:#0b1220;
  border: 1px solid rgba(255,255,255,.8);
}
.ui-fab:hover{ transform: translateY(-1px); }
.ui-fab-danger{ color:#ef4444; }

/* Modal */
.ui-overlay{
  position:fixed; inset:0;
  background: rgba(2,6,23,.55);
  display:flex; align-items:center; justify-content:center;
  padding: 18px;
  z-index: 60;
}
.ui-modal{
  width:100%;
  max-width: 560px;
  background:#fff;
  border-radius: 20px;
  box-shadow: 0 30px 80px rgba(2,6,23,.35);
  border: 1px solid rgba(255,255,255,.18);
}
.modal-scroll{ max-height: 90vh; overflow:auto; }
.ui-modal-head{ padding: 14px 16px; color:#fff; }
.ui-head-indigo{ background: linear-gradient(135deg, #4338ca, #4f46e5, #60a5fa); }
.ui-head-emerald{ background: linear-gradient(135deg, #059669, #10b981, #34d399); }
.ui-head-slate{ background: linear-gradient(135deg, #111827, #334155, #64748b); }
.ui-head-ico{
  width:34px;height:34px;border-radius: 14px;
  display:grid;place-items:center;
  border: 1px solid rgba(255,255,255,.35);
  background: rgba(255,255,255,.12);
}
.ui-modal-foot{
  border-top: 1px solid rgba(148,163,184,.35);
  padding: 12px 16px;
  display:flex; justify-content:flex-end; gap:10px;
}
.ui-x{
  width:38px;height:38px;border-radius: 14px;
  display:grid;place-items:center;
  color:#fff; font-size: 22px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.25);
}
.ui-x:hover{ background: rgba(255,255,255,.18); }

/* Upload */
.ui-upload{
  border: 1px dashed rgba(148,163,184,.7);
  border-radius: 16px;
  padding: 14px;
  text-align:center;
  cursor:pointer;
  background: rgba(79,70,229,.04);
  transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease;
}
.ui-upload:hover{
  border-color: rgba(79,70,229,.55);
  box-shadow: 0 16px 44px rgba(2,6,23,.07);
  transform: translateY(-1px);
}

/* Info */
.ui-info{
  display:flex; gap:.75rem;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(148,163,184,.35);
  background:#fff;
}
.ui-info-label{
  font-size:12px;
  font-weight: 900;
  color: rgba(2,6,23,.55);
}
.ui-info-value{
  margin-top:2px;
  font-size:14px;
  font-weight: 950;
  color:#0b1220;
}
.ui-link{
  display:inline-flex; align-items:center; gap:.5rem;
  font-weight: 950;
  color:#1d4ed8;
  max-width: 100%;
}
.ui-link:hover{ color:#1e40af; }

/* Transitions */
.fade-enter-active,.fade-leave-active{ transition: opacity .16s ease; }
.fade-enter-from,.fade-leave-to{ opacity: 0; }

/* Line clamp */
.line-clamp-1{ overflow:hidden; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:1; }
.line-clamp-2{ overflow:hidden; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:2; }

/* Checkbox */
.ui-check{
  display:flex; align-items:center; gap:.55rem;
  padding: .55rem .75rem;
  border-radius: 14px;
  border: 1px solid rgba(148,163,184,.45);
  background:#fff;
  font-size: 13px;
}
.ui-check input{ width:18px; height:18px; }
</style>
