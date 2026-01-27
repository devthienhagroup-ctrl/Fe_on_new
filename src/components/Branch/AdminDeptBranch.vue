<!-- AdminDeptBranch.vue -->
<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-slate-200">
      <div class="px-6 py-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4">
            <div class="ui-brand">
              <i class="fa-solid fa-building"></i>
            </div>
            <div class="leading-tight">
              <div class="text-[18px]  text-slate-900">
                Quản lý Phòng ban & Chi nhánh
              </div>
              <div class="text-[13px] text-slate-500">CRUD hoàn thiện • UI sáng • Dễ nhìn</div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-4 md:justify-end">
            <div class="hidden md:flex items-center gap-3">
              <div class="text-right">
                <div class="text-[14px] font-semibold text-slate-900">Admin User</div>
                <div class="text-[12px] text-slate-500">Quản trị hệ thống</div>
              </div>
              <div class="ui-avatar">
                <i class="fa-solid fa-user"></i>
              </div>
            </div>

            <button class="ui-icon-btn" type="button" aria-label="Thông báo">
              <i class="fa-solid fa-bell"></i>
              <span class="ui-badge">3</span>
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="mt-4">
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
              <span class="whitespace-nowrap">{{ t.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="px-6 py-5">
      <!-- ===================== DEPARTMENTS ===================== -->
      <section v-if="currentTab === 'departments'">
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="text-[18px]  text-slate-900">Quản lý Phòng ban</div>
            <div class="text-[13px] text-slate-500">
              Hiển thị:
              <span class=" text-indigo-700">{{ filteredDepartments.length }}</span>
              phòng ban
            </div>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div class="flex gap-2">
              <button
                  type="button"
                  class="ui-btn ui-btn-soft"
                  :class="{ active: deptView === 'table' }"
                  @click="deptView = 'table'"
              >
                <i class="fa-solid fa-table"></i> Bảng
              </button>
              <button
                  type="button"
                  class="ui-btn ui-btn-soft"
                  :class="{ active: deptView === 'card' }"
                  @click="deptView = 'card'"
              >
                <i class="fa-solid fa-grid-2"></i> Thẻ
              </button>
            </div>

            <button type="button" class="ui-btn ui-btn-primary" @click="openDeptModal()">
              <i class="fa-solid fa-plus"></i> Thêm phòng ban
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="ui-card p-4">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-4">
            <div>
              <label class="ui-label">Tìm kiếm</label>
              <div class="relative">
                <input
                    v-model.trim="deptFilter.search"
                    class="ui-input pl-10"
                    type="text"
                    placeholder="Tên phòng / Trưởng phòng..."
                    @keyup.enter="applyDeptFilter()"
                />
                <i class="fa-solid fa-magnifying-glass ui-input-ico"></i>
              </div>
            </div>

            <div>
              <label class="ui-label">Chi nhánh</label>
              <select v-model="deptFilter.branchId" class="ui-select">
                <option value="all">Tất cả</option>
                <option v-for="b in branches" :key="b.id" :value="b.id">
                  {{ b.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="ui-label">Chức năng</label>
              <select v-model="deptFilter.function" class="ui-select">
                <option value="all">Tất cả</option>
                <option v-for="f in functionOptions" :key="f.key" :value="f.key">{{ f.name }}</option>
              </select>
            </div>

            <div class="flex items-end">
              <button type="button" class="ui-btn ui-btn-indigo w-full" @click="applyDeptFilter()">
                <i class="fa-solid fa-filter"></i> Lọc
              </button>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="filteredDepartments.length === 0" class="ui-card mt-4 p-8 text-center">
          <div
              class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200"
          >
            <i class="fa-solid fa-users text-xl"></i>
          </div>
          <div class="mt-3 text-[16px]  text-slate-900">Không có dữ liệu</div>
          <div class="mt-1 text-[13px] text-slate-500">Thử thay đổi bộ lọc hoặc thêm phòng ban mới</div>
          <button type="button" class="ui-btn ui-btn-primary mt-4" @click="openDeptModal()">
            <i class="fa-solid fa-plus"></i> Thêm phòng ban
          </button>
        </div>

        <!-- TABLE VIEW (BẢNG THẬT) -->
        <div v-else-if="deptView === 'table'" class="mt-4 ui-card p-0">
          <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div class="text-[14px]  text-slate-900">Bảng phòng ban</div>
            <div class="text-[12px] text-slate-500">Tối giản trường quan trọng</div>
          </div>

          <div class="overflow-x-auto">
            <table class="ui-table">
              <thead>
              <tr>
                <th style="width: 44px">#</th>
                <th>Phòng ban</th>
                <th>Trưởng phòng</th>
                <th>Chi nhánh</th>
                <th>Chức năng</th>
                <th class="text-right" style="width: 140px">Nhân sự</th>
                <th class="text-right" style="width: 170px">Thao tác</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(d, idx) in filteredDepartments" :key="d.id">
                <td class="text-slate-500 font-bold">{{ idx + 1 }}</td>

                <td>
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="h-10 w-10 rounded-xl overflow-hidden ring-2 ring-slate-200 shrink-0">
                      <img :src="d.imageUrl" :alt="d.name" class="h-full w-full object-cover" />
                    </div>
                    <div class="min-w-0">
                      <div class="truncate text-[18px] text-slate-900" :title="d.name">
                        {{ d.name }}
                      </div>
                      <div class="text-[12px] text-slate-500 truncate">
                        {{ d.description }}
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="flex items-center gap-2">
                      <span class="ui-ico-pill ui-ico-blue">
                        <i class="fa-solid fa-user-tie"></i>
                      </span>
                    <span class="font-bold text-slate-800">{{ d.manager }}</span>
                  </div>
                </td>

                <td>
                  <div class="flex items-center gap-2">
                      <span class="ui-ico-pill ui-ico-purple">
                        <i class="fa-solid fa-code-branch"></i>
                      </span>
                    <span class="font-bold text-slate-800">
                        {{ branchById(d.branchId)?.name || "—" }}
                      </span>
                  </div>
                </td>

                <td>
                  <div class="flex flex-wrap gap-2">
                      <span v-for="f in d.functions.slice(0, 3)" :key="f" class="ui-tag" :class="funcTagClass(f)">
                        {{ functionName(f) }}
                      </span>
                    <span v-if="d.functions.length > 3" class="ui-tag ui-tag-gray">
                        +{{ d.functions.length - 3 }}
                      </span>
                  </div>
                </td>

                <td class="text-right">
                    <span class="ui-value ui-value-indigo whitespace-nowrap">
                      {{ d.employees }}
                    </span>
                </td>

                <td class="text-right">
                  <div class="flex justify-end gap-2">
                    <button
                        class="ui-mini-btn ui-mini-btn-slate"
                        type="button"
                        title="Xem chi tiết"
                        @click="openDeptDetail(d.id)"
                    >
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    <button
                        class="ui-mini-btn ui-mini-btn-blue"
                        type="button"
                        title="Sửa"
                        @click="openDeptModal(d.id)"
                    >
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                        class="ui-mini-btn ui-mini-btn-red"
                        type="button"
                        title="Xóa"
                        @click="openDeleteModal('dept', d.id, d.name)"
                    >
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
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

              <div class="absolute left-2 top-2">
                <span class="ui-value ui-value-white whitespace-nowrap">{{ d.employees }} NV</span>
              </div>

              <div class="absolute right-2 top-2 flex gap-1">
                <button class="ui-fab" type="button" title="Chi tiết" @click="openDeptDetail(d.id)">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button class="ui-fab" type="button" title="Sửa" @click="openDeptModal(d.id)">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                    class="ui-fab ui-fab-danger"
                    type="button"
                    title="Xóa"
                    @click="openDeleteModal('dept', d.id, d.name)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>

              <div class="absolute bottom-2 left-2 right-2">
                <div class="line-clamp-1 text-[14px]  text-white" :title="d.name">
                  {{ d.name }}
                </div>
                <div class="mt-1 flex items-center gap-2 text-[12px] text-white/90">
                  <i class="fa-solid fa-user-tie"></i>
                  <span class="truncate font-semibold">{{ d.manager }}</span>
                </div>
              </div>
            </div>

            <div class="p-4">
              <div class="line-clamp-2 text-[13px] text-slate-600">
                {{ d.description }}
              </div>

              <div class="mt-3 flex items-center gap-2">
                <span class="ui-ico-pill ui-ico-purple">
                  <i class="fa-solid fa-code-branch"></i>
                </span>
                <span class="truncate  text-slate-800 text-[13px]">
                  {{ branchById(d.branchId)?.name || "—" }}
                </span>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                <span v-for="f in d.functions.slice(0, 2)" :key="f" class="ui-tag" :class="funcTagClass(f)">
                  {{ functionName(f) }}
                </span>
                <span v-if="d.functions.length > 2" class="ui-tag ui-tag-gray">
                  +{{ d.functions.length - 2 }}
                </span>
              </div>

              <div class="mt-3 border-t border-slate-200 pt-3 flex items-center justify-between">
                <span class="ui-value ui-value-indigo whitespace-nowrap">{{ d.employees }} NV</span>
                <div class="flex gap-2">
                  <button class="ui-mini-btn ui-mini-btn-slate" type="button" title="Chi tiết" @click="openDeptDetail(d.id)">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button class="ui-mini-btn ui-mini-btn-blue" type="button" title="Sửa" @click="openDeptModal(d.id)">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="ui-mini-btn ui-mini-btn-red" type="button" title="Xóa" @click="openDeleteModal('dept', d.id, d.name)">
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
        <div class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="text-[18px]  text-slate-900">Quản lý Chi nhánh</div>
            <div class="text-[13px] text-slate-500">
              Hiển thị:
              <span class=" text-emerald-700">{{ filteredBranches.length }}</span>
              chi nhánh
            </div>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div class="flex gap-2">
              <button
                  type="button"
                  class="ui-btn ui-btn-soft"
                  :class="{ active: branchView === 'table' }"
                  @click="branchView = 'table'"
              >
                <i class="fa-solid fa-table"></i> Bảng
              </button>
              <button
                  type="button"
                  class="ui-btn ui-btn-soft"
                  :class="{ active: branchView === 'card' }"
                  @click="branchView = 'card'"
              >
                <i class="fa-solid fa-grid-2"></i> Thẻ
              </button>
            </div>

            <button type="button" class="ui-btn ui-btn-success" @click="openBranchModal()">
              <i class="fa-solid fa-plus"></i> Thêm chi nhánh
            </button>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="filteredBranches.length === 0" class="ui-card mt-4 p-8 text-center">
          <div
              class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200"
          >
            <i class="fa-solid fa-code-branch text-xl"></i>
          </div>
          <div class="mt-3 text-[16px]  text-slate-900">Không có dữ liệu</div>
          <div class="mt-1 text-[13px] text-slate-500">Thử thay đổi bộ lọc hoặc thêm chi nhánh mới</div>
          <button type="button" class="ui-btn ui-btn-success mt-4" @click="openBranchModal()">
            <i class="fa-solid fa-plus"></i> Thêm chi nhánh
          </button>
        </div>

        <!-- TABLE VIEW -->
        <div v-else-if="branchView === 'table'" class="mt-4 ui-card p-0">
          <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div class="text-[14px]  text-slate-900">Bảng chi nhánh</div>
            <div class="text-[12px] text-slate-500">Chi nhánh chỉ có: id, name, address</div>
          </div>

          <div class="overflow-x-auto">
            <table class="ui-table">
              <thead>
              <tr>
                <th style="width: 44px">#</th>
                <th>CHI NHÁNH</th>
                <th>ĐỊA CHỈ</th>
                <th class="text-right" style="width: 190px">SỐ LƯƠNG PHÒNG BAN</th>
                <th class="text-right" style="width: 190px">SỐ LƯỢNG NHÂN VIÊN</th>
                <th class="text-right" style="width: 170px">THAO TÁC</th>
              </tr>
              </thead>

              <tbody>
              <tr v-for="(b, idx) in filteredBranches" :key="b.id">
                <td class="text-slate-500 font-bold">{{ idx + 1 }}</td>

                <td>
                  <div class="flex items-center gap-2 min-w-0">
                      <span class="ui-ico-pill ui-ico-orange-soft">
                        <i class="fa-solid fa-code-branch"></i>
                      </span>
                    <div class="min-w-0">
                      <div class="truncate text-[14px] fw-medium text-slate-900 text-gradient-blue">{{ b.name }}</div>
                      <div class="text-[12px] text-slate-500 font-semibold">
                        ID: <span class="text-slate-700">{{ b.id }}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <div class="flex items-start gap-2">
                        <i class="fa-solid fa-location-dot" style="color: red"></i>
                    <div class="min-w-0">
                      <div class="text-[13px] font-medium text-slate-700">
                        {{ formatAddressDisplay(b.address) }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- FIX: 2 badge CHUNG HÀNG -->
                <td class="text-left">
                  <div class="inline-flex items-center justify-end gap-2 whitespace-nowrap">
                    <span class="ui-value ui-value-slate whitespace-nowrap">{{ deptCountByBranch(b.id) }} phòng</span>
                  </div>
                </td>
                <td class="text-left">
                  <div class="inline-flex items-center justify-end gap-2 whitespace-nowrap">
                    <span class="ui-value ui-value-emerald whitespace-nowrap">{{ employeeCountByBranch(b.id) }} NV</span>
                  </div>
                </td>

                <td class="text-right">
                  <div class="flex justify-end gap-2">
                    <button class="ui-mini-btn ui-mini-btn-slate" type="button" title="Xem chi tiết" @click="openBranchDetail(b.id)">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="ui-mini-btn ui-mini-btn-blue" type="button" title="Sửa" @click="openBranchModal(b.id)">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="ui-mini-btn ui-mini-btn-red" type="button" title="Xóa" @click="openDeleteModal('branch', b.id, b.name)">
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
          <div v-for="b in filteredBranches" :key="b.id" class="ui-card overflow-hidden">
            <div class="p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="ui-ico-pill ui-ico-emerald"><i class="fa-solid fa-code-branch"></i></span>
                    <div class="min-w-0">
                      <div class="truncate text-[18px]  text-slate-900">{{ b.name }}</div>
                      <div class="text-[12px] text-slate-500 font-semibold">
                        ID: <span class="text-slate-700">{{ b.id }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 flex items-start gap-2">
                    <span class="ui-ico-pill ui-ico-purple"><i class="fa-solid fa-location-dot"></i></span>
                    <div class="text-[13px] font-bold text-slate-700 line-clamp-2">
                      {{ formatAddressDisplay(b.address) }}
                    </div>
                  </div>

                  <div class="mt-3 inline-flex items-center gap-2 whitespace-nowrap">
                    <span class="ui-value ui-value-slate whitespace-nowrap">{{ deptCountByBranch(b.id) }} phòng</span>
                    <span class="ui-value ui-value-emerald whitespace-nowrap">{{ employeeCountByBranch(b.id) }} NV</span>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button class="ui-mini-btn ui-mini-btn-slate" type="button" title="Chi tiết" @click="openBranchDetail(b.id)">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button class="ui-mini-btn ui-mini-btn-blue" type="button" title="Sửa" @click="openBranchModal(b.id)">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button class="ui-mini-btn ui-mini-btn-red" type="button" title="Xóa" @click="openDeleteModal('branch', b.id, b.name)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
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
                <span class="ui-head-ico ui-ico-white">
                  <i class="fa-solid fa-sitemap"></i>
                </span>
                <span class="text-[16px] ">{{ deptModal.title }}</span>
              </div>
              <button class="ui-x" type="button" @click="closeAllModals()">&times;</button>
            </div>
          </div>

          <div class="p-5">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label class="ui-label">
                  <span class="ui-label-ico ui-ico-indigo"><i class="fa-solid fa-layer-group"></i></span>
                  Tên phòng ban <span class="text-rose-500">*</span>
                </label>
                <input v-model.trim="deptForm.name" class="ui-input" type="text" />
              </div>

              <div>
                <label class="ui-label">
                  <span class="ui-label-ico ui-ico-blue"><i class="fa-solid fa-user-tie"></i></span>
                  Trưởng phòng <span class="text-rose-500">*</span>
                </label>
                <input v-model.trim="deptForm.manager" class="ui-input" type="text" />
              </div>
            </div>

            <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label class="ui-label">
                  <span class="ui-label-ico ui-ico-emerald"><i class="fa-solid fa-code-branch"></i></span>
                  Chi nhánh <span class="text-rose-500">*</span>
                </label>
                <select v-model="deptForm.branchId" class="ui-select">
                  <option :value="null">Chọn chi nhánh</option>
                  <option v-for="b in branches" :key="b.id" :value="b.id">
                    {{ b.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="ui-label">
                  <span class="ui-label-ico ui-ico-slate"><i class="fa-solid fa-link"></i></span>
                  Link nhân viên <span class="text-rose-500">*</span>
                </label>
                <input v-model.trim="deptForm.employeeLink" class="ui-input" type="text" />
              </div>
            </div>

            <div class="mt-3">
              <label class="ui-label">
                <span class="ui-label-ico ui-ico-amber"><i class="fa-solid fa-align-left"></i></span>
                Mô tả <span class="text-rose-500">*</span>
              </label>
              <textarea v-model.trim="deptForm.description" class="ui-textarea" rows="2"></textarea>
            </div>

            <div class="mt-3">
              <label class="ui-label">
                <span class="ui-label-ico ui-ico-emerald"><i class="fa-solid fa-shapes"></i></span>
                Chức năng <span class="text-rose-500">*</span>
              </label>
              <div class="grid grid-cols-2 gap-2 md:grid-cols-3">
                <label v-for="f in functionOptions" :key="f.key" class="ui-check">
                  <input type="checkbox" :value="f.key" v-model="deptForm.functions" />
                  <span class="font-bold">{{ f.name }}</span>
                </label>
              </div>
            </div>

            <div class="mt-3">
              <label class="ui-label">
                <span class="ui-label-ico ui-ico-pink"><i class="fa-solid fa-image"></i></span>
                Ảnh đại diện
              </label>

              <div class="ui-upload" @click="triggerDeptFile()">
                <div class="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200">
                  <i class="fa-solid fa-cloud-arrow-up text-xl"></i>
                </div>
                <div class="mt-2 text-[13px] text-slate-700">
                  Kéo thả ảnh hoặc <b class="text-indigo-700">nhấn để chọn</b>
                </div>
                <div class="mt-1 text-[12px] text-slate-500">JPG/PNG/GIF (tối đa 5MB)</div>
                <input ref="deptFileInput" type="file" class="hidden" accept="image/*" @change="onDeptImageChange" />
              </div>

              <div v-if="deptForm.imageUrl" class="mt-3 overflow-hidden rounded-2xl border-2 border-slate-200">
                <img :src="deptForm.imageUrl" alt="Preview" class="h-40 w-full object-cover" />
              </div>
            </div>
          </div>

          <div class="ui-modal-foot">
            <button type="button" class="ui-btn ui-btn-ghost" @click="closeAllModals()">Hủy</button>
            <button type="button" class="ui-btn ui-btn-success" @click="saveDept()">
              <i class="fa-solid fa-check"></i> Lưu
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Branch Add/Edit Modal (ONLY: id, name, address) -->
    <transition name="fade">
      <div v-if="branchModal.open" class="ui-overlay" @mousedown.self="closeAllModals()">
        <div class="ui-modal modal-scroll">
          <div class="ui-modal-head ui-head-emerald">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="ui-head-ico ui-ico-white">
                  <i class="fa-solid fa-code-branch"></i>
                </span>
                <span class="text-[16px] ">{{ branchModal.title }}</span>
              </div>
              <button class="ui-x" type="button" @click="closeAllModals()">&times;</button>
            </div>
          </div>

          <div class="p-5">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="ui-label">
                  <span class="ui-label-ico ui-ico-emerald"><i class="fa-solid fa-building"></i></span>
                  Tên chi nhánh <span class="text-rose-500">*</span>
                </label>
                <input v-model.trim="branchForm.name" class="ui-input" type="text" />
              </div>
            </div>

            <div class="mt-3 ui-card p-4 border border-slate-200">
              <div class="text-[14px]  text-slate-900 mb-3 flex items-center gap-2">
                <span class="ui-ico-pill ui-ico-purple"><i class="fa-solid fa-location-dot"></i></span>
                Địa chỉ (bắt buộc)
              </div>

              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div class="md:col-span-2">
                  <label class="ui-label">
                    <span class="ui-label-ico ui-ico-slate"><i class="fa-solid fa-map"></i></span>
                    Địa chỉ chi tiết <span class="text-rose-500">*</span>
                  </label>
                  <input
                      v-model.trim="branchForm.addressDetail"
                      class="ui-input"
                      type="text"
                      placeholder="Ví dụ: Số 12 đường ABC, Quận 1"
                  />
                </div>

                <div>
                  <label class="ui-label">
                    <span class="ui-label-ico ui-ico-indigo"><i class="fa-solid fa-city"></i></span>
                    Tỉnh/Thành phố <span class="text-rose-500">*</span>
                  </label>
                  <select v-model="branchForm.provinceName" class="ui-select" @change="onProvinceChange()">
                    <option value="">Chọn Tỉnh/Thành</option>
                    <option v-for="p in provinces" :key="p.name" :value="p.name">{{ p.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="ui-label">
                    <span class="ui-label-ico ui-ico-blue"><i class="fa-solid fa-map-pin"></i></span>
                    Phường/Xã <span class="text-rose-500">*</span>
                  </label>
                  <select v-model="branchForm.wardName" class="ui-select" :disabled="!branchForm.provinceName">
                    <option value="">Chọn Phường/Xã</option>
                    <option v-for="w in wardsByProvince" :key="w.name" :value="w.name">{{ w.name }}</option>
                  </select>
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
            <button type="button" class="ui-btn ui-btn-success" @click="saveBranch()">
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
                <span class="ui-head-ico ui-ico-white">
                  <i class="fa-solid fa-eye"></i>
                </span>
                <span class="text-[16px] ">Chi tiết phòng ban</span>
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
                <div class="text-[18px]  text-slate-900 truncate">
                  {{ deptDetail.data.name }}
                </div>
                <div class="mt-1 text-[13px] text-slate-600">
                  {{ deptDetail.data.description }}
                </div>

                <div class="mt-3 flex flex-wrap gap-2">
                  <span class="ui-value ui-value-indigo whitespace-nowrap">{{ deptDetail.data.employees }} NV</span>
                  <span class="ui-tag ui-tag-slate">
                    <i class="fa-solid fa-calendar-days mr-1"></i> {{ deptDetail.data.createdAt }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div class="ui-info">
                <span class="ui-info-ico ui-ico-blue"><i class="fa-solid fa-user-tie"></i></span>
                <div class="min-w-0">
                  <div class="ui-info-label">Trưởng phòng</div>
                  <div class="ui-info-value">{{ deptDetail.data.manager }}</div>
                </div>
              </div>

              <div class="ui-info">
                <span class="ui-info-ico ui-ico-emerald"><i class="fa-solid fa-code-branch"></i></span>
                <div class="min-w-0">
                  <div class="ui-info-label">Chi nhánh</div>
                  <div class="ui-info-value">
                    {{ branchById(deptDetail.data.branchId)?.name || "—" }}
                  </div>
                </div>
              </div>

              <div class="ui-info md:col-span-2">
                <span class="ui-info-ico ui-ico-amber"><i class="fa-solid fa-shapes"></i></span>
                <div class="min-w-0">
                  <div class="ui-info-label">Chức năng</div>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span v-for="f in deptDetail.data.functions" :key="f" class="ui-tag" :class="funcTagClass(f)">
                      {{ functionName(f) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="ui-info md:col-span-2">
                <span class="ui-info-ico ui-ico-slate"><i class="fa-solid fa-link"></i></span>
                <div class="min-w-0">
                  <div class="ui-info-label">Link nhân viên</div>
                  <div class="ui-info-value">
                    <button class="ui-link" type="button" @click="goEmployees(deptDetail.data.employeeLink)">
                      <i class="fa-solid fa-arrow-up-right-from-square"></i> {{ deptDetail.data.employeeLink }}
                    </button>
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
                <span class="ui-head-ico ui-ico-white">
                  <i class="fa-solid fa-eye"></i>
                </span>
                <span class="text-[16px] ">Chi tiết chi nhánh</span>
              </div>
              <button class="ui-x" type="button" @click="closeAllModals()">&times;</button>
            </div>
          </div>

          <div class="p-5" v-if="branchDetail.data">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="ui-ico-pill ui-ico-emerald"><i class="fa-solid fa-code-branch"></i></span>
                  <div class="min-w-0">
                    <div class="text-[18px]  text-slate-900 truncate">{{ branchDetail.data.name }}</div>
                    <div class="text-[13px] text-slate-500 font-semibold">
                      ID: <span class="text-slate-800">{{ branchDetail.data.id }}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-3 flex items-start gap-2">
                  <span class="ui-ico-pill ui-ico-purple"><i class="fa-solid fa-location-dot"></i></span>
                  <div class="text-[14px]  text-slate-800">
                    {{ formatAddressDisplay(branchDetail.data.address) }}
                  </div>
                </div>

                <div class="mt-3 inline-flex items-center gap-2 whitespace-nowrap">
                  <span class="ui-value ui-value-slate whitespace-nowrap">{{ deptCountByBranch(branchDetail.data.id) }} phòng</span>
                  <span class="ui-value ui-value-emerald whitespace-nowrap">{{ employeeCountByBranch(branchDetail.data.id) }} NV</span>
                </div>
              </div>

              <button type="button" class="ui-btn ui-btn-emerald" @click="openBranchModal(branchDetail.data.id)">
                <i class="fa-solid fa-pen-to-square"></i> Sửa
              </button>
            </div>

            <div class="mt-4 ui-card p-4">
              <div class="text-[14px]  text-slate-900 mb-2 flex items-center gap-2">
                <span class="ui-ico-pill ui-ico-indigo"><i class="fa-solid fa-sitemap"></i></span>
                Phòng ban thuộc chi nhánh
              </div>

              <div class="flex flex-wrap gap-2">
                <template v-if="deptListByBranch(branchDetail.data.id).length">
                  <span v-for="d in deptListByBranch(branchDetail.data.id)" :key="d.id" class="ui-tag ui-tag-slate">
                    {{ d.name }}
                  </span>
                </template>
                <span v-else class="text-[13px] font-bold text-slate-500">Chưa có phòng ban</span>
              </div>
            </div>
          </div>

          <div class="ui-modal-foot">
            <button type="button" class="ui-btn ui-btn-ghost" @click="closeAllModals()">Đóng</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Modal -->
    <transition name="fade">
      <div v-if="deleteModal.open" class="ui-overlay" @mousedown.self="closeAllModals()">
        <div class="ui-modal max-w-sm">
          <div class="p-6 text-center">
            <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-rose-700 ring-2 ring-rose-200">
              <i class="fa-solid fa-triangle-exclamation text-xl"></i>
            </div>
            <div class="mt-3 text-[16px]  text-slate-900">{{ deleteModal.title }}</div>
            <div class="mt-1 text-[13px] text-slate-600">
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
import { computed, onMounted, reactive, ref } from "vue";
import api from "/src/api/api.js";

/**
 * ✅ Địa chỉ lấy từ: /src/assets/js/address.json
 * - Lưu address dạng: "chi tiết/!!Phường/!!Tỉnh"
 * - Hiển thị: thay "/!!" thành ", "
 * - Chọn tỉnh/phường bằng NAME (không dùng mã)
 */
import addressData from "/src/assets/js/address.json";

/** Tabs */
const tabs = [
  { key: "departments", label: "Phòng ban", icon: "fa-solid fa-users" },
  { key: "branches", label: "Chi nhánh", icon: "fa-solid fa-code-branch" },
];

const currentTab = ref("departments");
const deptView = ref("table"); // table | card
const branchView = ref("table"); // table | card

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

/** Department: store branchId */
const departments = ref([
  {
    id: 1,
    name: "Phòng Tư vấn Khách hàng",
    description: "Phụ trách tư vấn và hỗ trợ khách hàng về các sản phẩm và dịch vụ của công ty.",
    manager: "Nguyễn Thị Hương",
    branchId: 1,
    functions: ["consulting", "tele"],
    imageUrl:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    employeeLink: "/#",
    createdAt: "2023-01-15",
    employees: 15,
  },
  {
    id: 2,
    name: "Phòng Marketing",
    description: "Chịu trách nhiệm về các chiến lược marketing, quảng bá thương hiệu và sản phẩm.",
    manager: "Trần Văn Minh",
    branchId: 2,
    functions: ["marketing"],
    imageUrl:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    employeeLink: "/#",
    createdAt: "2023-02-20",
    employees: 12,
  },
  {
    id: 3,
    name: "Phòng Công nghệ Thông tin",
    description: "Phát triển và bảo trì hệ thống công nghệ thông tin, hỗ trợ kỹ thuật cho toàn công ty.",
    manager: "Lê Văn Hải",
    branchId: 3,
    functions: ["it", "deployment"],
    imageUrl:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80",
    employeeLink: "/#",
    createdAt: "2023-03-10",
    employees: 24,
  },
]);

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

/** Computed lists */
const filteredDepartments = computed(() => {
  const s = (appliedDeptFilter.search || "").toLowerCase();
  return departments.value.filter((d) => {
    if (appliedDeptFilter.branchId !== "all" && Number(d.branchId) !== Number(appliedDeptFilter.branchId)) return false;
    if (appliedDeptFilter.function !== "all" && !d.functions.includes(appliedDeptFilter.function)) return false;
    if (s) {
      const ok = d.name.toLowerCase().includes(s) || d.manager.toLowerCase().includes(s);
      if (!ok) return false;
    }
    return true;
  });
});

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
function functionName(key) {
  return functionMap[key]?.name || key;
}
function deptCountByBranch(branchId) {
  const branch = branchById(branchId);
  if (branch && Number.isFinite(Number(branch.roomCount))) {
    return Number(branch.roomCount);
  }
  return departments.value.filter((d) => Number(d.branchId) === Number(branchId)).length;
}
function employeeCountByBranch(branchId) {
  const branch = branchById(branchId);
  if (branch && Number.isFinite(Number(branch.employeeCount))) {
    return Number(branch.employeeCount);
  }
  return departments.value
    .filter((d) => Number(d.branchId) === Number(branchId))
    .reduce((sum, d) => sum + (Number(d.employees) || 0), 0);
}
function deptListByBranch(branchId) {
  return departments.value.filter((d) => Number(d.branchId) === Number(branchId));
}

/** Tag class (pastel nền + viền đậm + chữ đậm) */
function funcTagClass(func) {
  const map = {
    consulting: "ui-tag-blue",
    tele: "ui-tag-purple",
    marketing: "ui-tag-emerald",
    it: "ui-tag-indigo",
    deployment: "ui-tag-amber",
    qa: "ui-tag-red",
    hr: "ui-tag-slate",
    finance: "ui-tag-lime",
  };
  return map[func] || "ui-tag-slate";
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
const branchDetail = reactive({ open: false, data: null });

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

function onProvinceChange() {
  branchForm.wardName = "";
}

/** IDs */
const nextDeptId = ref(departments.value.length + 1);
const nextBranchId = ref(branches.value.length + 1);

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
  } else {
    branchForm.name = "";
    branchForm.addressDetail = "";
    branchForm.provinceName = "";
    branchForm.wardName = "";
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
  branchDetail.data = { ...b };
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
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80";

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

function saveBranch() {
  const name = branchForm.name.trim();
  const detail = branchForm.addressDetail.trim();
  const wardName = branchForm.wardName.trim();
  const provinceName = branchForm.provinceName.trim();

  if (!name || !detail || !wardName || !provinceName) {
    alert("Vui lòng nhập Tên chi nhánh và đủ 3 phần địa chỉ (Chi tiết / Phường / Tỉnh)!");
    return;
  }

  const storedAddress = buildAddress(detail, wardName, provinceName);

  if (branchModal.editingId) {
    const idx = branches.value.findIndex((x) => x.id === branchModal.editingId);
    if (idx !== -1) {
      branches.value[idx] = {
        ...branches.value[idx],
        name,
        address: storedAddress,
      };
    }
  } else {
    branches.value.push({
      id: nextBranchId.value++,
      name,
      address: storedAddress,
    });
  }

  closeAllModals();
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
      alert("Không thể xóa chi nhánh đang có phòng ban!");
      return;
    }
    branches.value = branches.value.filter((x) => x.id !== deleteModal.id);
    closeAllModals();
  }
}

function goEmployees(link) {
  alert(`Chuyển hướng đến danh sách nhân viên: ${link}`);
}

/** init */
applyDeptFilter();
applyBranchFilter();
onMounted(() => {
  fetchBranches();
});
</script>

<style scoped>
:global(html) {
  font-size: 16px;
}
:global(body) {
  font-size: 16px;
  background: #f8f9fa;
}

/* Scrollbar */
:global(::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}
:global(::-webkit-scrollbar-track) {
  background: rgba(11, 18, 32, 0.06);
  border-radius: 999px;
}
:global(::-webkit-scrollbar-thumb) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.55), rgba(118, 75, 162, 0.55));
  border-radius: 999px;
}

/* Header */
.ui-brand {
  width: 46px;
  height: 46px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 14px 34px rgba(102, 126, 234, 0.22);
  font-size: 18px;
}
.ui-avatar {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 55%, #764ba2 100%);
  box-shadow: 0 14px 34px rgba(245, 87, 108, 0.14);
  font-size: 14px;
}
.ui-icon-btn {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, #4facfe 0%, #43e97b 55%, #38f9d7 100%);
  box-shadow: 0 16px 36px rgba(79, 172, 254, 0.18);
  transition: transform 0.16s ease;
  font-size: 16px;
}
.ui-icon-btn:hover {
  transform: translateY(-1px);
}
.ui-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff5858, #f5576c);
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  border: 2px solid rgba(255, 255, 255, 0.95);
}

/* Tabs */
.ui-tabs {
  display: flex;
  gap: 0.5rem;
  overflow: auto;
  padding: 0.15rem;
}
.ui-tab {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.58rem 1rem;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 900;
  color: #475569;
  background: rgba(255, 255, 255, 0.92);
  border: 2px solid rgba(20, 30, 48, 0.12);
  transition: all 0.16s ease;
}
.ui-tab:hover {
  background: rgba(102, 126, 234, 0.06);
  border-color: rgba(102, 126, 234, 0.22);
  color: #3730a3;
}
.ui-tab.active {
  background: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.4);
  color: #3730a3;
  box-shadow: 0 12px 28px rgba(2, 6, 23, 0.06);
}

/* Card */
.ui-card {
  background: rgba(255, 255, 255, 0.92);
  border: 2px solid rgba(20, 30, 48, 0.12);
  border-radius: 18px;
  box-shadow: 0 12px 34px rgba(2, 6, 23, 0.05);
}
.ui-card:hover {
  border-color: rgba(102, 126, 234, 0.2);
}

/* Buttons */
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.64rem 1rem;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 950;
  border: 2px solid transparent;
  transition: all 0.16s ease;
}
.ui-btn:hover {
  transform: translateY(-1px);
}
.ui-btn:active {
  transform: translateY(0);
}
.ui-btn-ghost {
  background: rgba(255, 255, 255, 0.92);
  color: #334155;
  border-color: rgba(20, 30, 48, 0.12);
}
.ui-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.86);
}
.ui-btn-soft {
  background: rgba(102, 126, 234, 0.06);
  color: #3730a3;
  border-color: rgba(102, 126, 234, 0.25);
}
.ui-btn-soft.active {
  background: rgba(102, 126, 234, 0.12);
  border-color: rgba(102, 126, 234, 0.45);
}
.ui-btn-soft:hover {
  background: rgba(102, 126, 234, 0.1);
}
.ui-btn-primary {
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 14px 34px rgba(102, 126, 234, 0.18);
}
.ui-btn-success {
  color: #fff;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 55%, #4facfe 100%);
  box-shadow: 0 14px 34px rgba(67, 233, 123, 0.16);
}
.ui-btn-danger {
  color: #fff;
  background: linear-gradient(135deg, #ff5858 0%, #f5576c 60%, #f093fb 100%);
  box-shadow: 0 14px 34px rgba(255, 88, 88, 0.14);
}
.ui-btn-indigo {
  color: #fff;
  background: linear-gradient(135deg, #4f46e5 0%, #667eea 60%, #4facfe 100%);
  box-shadow: 0 14px 34px rgba(79, 70, 229, 0.16);
}
.ui-btn-emerald {
  color: #fff;
  background: linear-gradient(135deg, #10b981 0%, #43e97b 60%, #38f9d7 100%);
  box-shadow: 0 14px 34px rgba(67, 233, 123, 0.14);
}

/* Inputs */
.ui-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  font-weight: 950;
  color: #0b1220;
  margin-bottom: 6px;
}
.ui-label-ico {
  width: 28px;
  height: 28px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  border: 2px solid transparent;
  font-size: 12px;
}
.ui-input,
.ui-select,
.ui-textarea {
  width: 100%;
  border-radius: 18px;
  border: 2px solid rgba(20, 30, 48, 0.12);
  background: rgba(255, 255, 255, 0.92);
  padding: 0.72rem 0.85rem;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: all 0.16s ease;
}
.ui-textarea {
  padding: 0.78rem 0.85rem;
}
.ui-input:focus,
.ui-select:focus,
.ui-textarea:focus {
  border-color: rgba(102, 126, 234, 0.55);
  box-shadow: 0 0 0 5px rgba(102, 126, 234, 0.14);
}
.ui-input-ico {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #94a3b8;
}

/* Table */
.ui-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 12px;
}
.ui-table thead th {
  text-align: left;
  padding: 12px 14px;
  color: #0b1220;
  font-weight: 650;
  background: rgba(255, 255, 255, 0.86);
  border-bottom: 2px solid rgba(20, 30, 48, 0.12);
  white-space: nowrap;
}
.ui-table tbody td {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(20, 30, 48, 0.12);
  vertical-align: middle;
}
.ui-table tbody tr:hover td {
  background: rgba(102, 126, 234, 0.04);
}

/* Tags */
.ui-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 950;
  border: 2px solid transparent;
  white-space: nowrap;
}
.ui-tag-gray {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #0b1220;
}
.ui-tag-slate {
  background: #f1f5f9;
  border-color: #64748b;
  color: #0b1220;
}
.ui-tag-blue {
  background: #eff6ff;
  border-color: #2563eb;
  color: #1d4ed8;
}
.ui-tag-indigo {
  background: #eef2ff;
  border-color: #4f46e5;
  color: #3730a3;
}
.ui-tag-purple {
  background: #faf5ff;
  border-color: #764ba2;
  color: #6d28d9;
}
.ui-tag-emerald {
  background: #ecfdf5;
  border-color: #059669;
  color: #047857;
}
.ui-tag-amber {
  background: #fffbeb;
  border-color: #d97706;
  color: #b45309;
}
.ui-tag-red {
  background: #fff1f2;
  border-color: #f5576c;
  color: #be123c;
}
.ui-tag-lime {
  background: #f7fee7;
  border-color: #65a30d;
  color: #4d7c0f;
}

/* Value */
.ui-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  border: 2px solid transparent;
}
.ui-value-indigo {
  background: #eef2ff;
  border-color: #4f46e5;
  color: #3730a3;
}

.ui-value-slate {
  background: rgba(254, 249, 195, 0.67);      /* vàng nhạt tươi */
  border-color: #facc15;    /* vàng đậm */
  color: #d9ac01;           /* nâu vàng đậm – rất dễ đọc */
}

.ui-value-emerald {
  background: #ecfdf5;
  border-color: #059669;
  color: #047857;
}
.ui-value-white {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(255, 255, 255, 0.55);
  color: #0b1220;
}

/* Price */
.price{ font-weight: 950; white-space: nowrap; }
.p1{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.p2{ background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.p3{ background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.p4{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.p5{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }

/* Icon pill */
.ui-ico-pill {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  border: 2px solid transparent;
  font-size: 14px;
  flex-shrink: 0;
}
.ui-ico-blue {
  background: #eff6ff;
  border-color: #2563eb;
  color: #1d4ed8;
}
.ui-ico-indigo {
  background: #eef2ff;
  border-color: #4f46e5;
  color: #3730a3;
}
.ui-ico-purple {
  background: #faf5ff;
  border-color: #764ba2;
  color: #6d28d9;
}
.ui-ico-orange-soft {
  background: linear-gradient(135deg, #ffd194 0%, #ff9f1c 100%);
  border-color: #ff9f1c;
  color: #5a2d00;
  box-shadow: 0 8px 18px rgba(255, 159, 28, 0.25);
}

.ui-ico-emerald {
  background: #ecfdf5;
  border-color: #059669;
  color: #047857;
}
.ui-ico-amber {
  background: #fffbeb;
  border-color: #d97706;
  color: #b45309;
}
.ui-ico-pink {
  background: #fff1f2;
  border-color: #f5576c;
  color: #be123c;
}
.ui-ico-slate {
  background: #f1f5f9;
  border-color: #64748b;
  color: #0b1220;
}
.ui-ico-white {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.35);
  color: #fff;
}

/* Actions */
.ui-mini-btn {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.35);
}
.ui-mini-btn:hover {
  transform: translateY(-1px);
}
.ui-mini-btn-blue {
  background: linear-gradient(
      135deg,
      #6ecbff 0%,
      #4facfe 45%,
      #667eea 100%
  );
  box-shadow: 0 14px 32px rgba(79, 172, 254, 0.28);
}

.ui-mini-btn-red {
  background: linear-gradient(
      135deg,
      #fda4af 0%,
      #fb7185 55%,
      #f43f5e 100%
  );
  box-shadow: 0 14px 32px rgba(244, 63, 94, 0.26);
}

.ui-mini-btn-slate {
  background: linear-gradient(
      135deg,
      #e2e8f0 0%,
      #cbd5e1 55%,
      #94a3b8 100%
  );
  color: #0b1220;
  border-color: rgba(148, 163, 184, 0.9);
  box-shadow: 0 10px 24px rgba(100, 116, 139, 0.18);
}


/* FAB */
.ui-fab {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.92);
  color: #0b1220;
  border: 2px solid rgba(255, 255, 255, 0.65);
}
.ui-fab:hover {
  transform: translateY(-1px);
}
.ui-fab-danger {
  color: #ff5858;
}

/* Modal */
.ui-overlay {
  position: fixed;
  inset: 0;
  background: rgba(11, 18, 32, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 60;
}
.ui-modal {
  width: 100%;
  max-width: 860px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 30px 80px rgba(11, 18, 32, 0.3);
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.14);
}
.modal-scroll {
  max-height: 90vh;
  overflow: auto;
}
.ui-modal-head {
  padding: 14px 16px;
  color: #fff;
}
.ui-head-indigo {
  background: linear-gradient(135deg, #4f46e5, #667eea, #4facfe);
}
.ui-head-emerald {
  background: linear-gradient(135deg, #10b981, #43e97b, #38f9d7);
}
.ui-head-slate {
  background: linear-gradient(135deg, #334155, #64748b, #94a3b8);
}
.ui-head-ico {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  border: 2px solid rgba(255, 255, 255, 0.25);
}
.ui-modal-foot {
  border-top: 2px solid rgba(20, 30, 48, 0.12);
  padding: 12px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.ui-x {
  width: 38px;
  height: 38px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  border: 2px solid rgba(255, 255, 255, 0.22);
}
.ui-x:hover {
  background: rgba(255, 255, 255, 0.24);
}

/* Upload */
.ui-upload {
  border: 2px dashed rgba(20, 30, 48, 0.12);
  border-radius: 18px;
  padding: 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.16s ease;
  background: rgba(102, 126, 234, 0.05);
}
.ui-upload:hover {
  border-color: rgba(102, 126, 234, 0.45);
  box-shadow: 0 16px 44px rgba(11, 18, 32, 0.07);
}

/* Detail info */
.ui-info {
  display: flex;
  gap: 0.75rem;
  padding: 14px;
  border-radius: 18px;
  border: 2px solid rgba(20, 30, 48, 0.12);
  background: rgba(255, 255, 255, 0.92);
}
.ui-info-ico {
  width: 42px;
  height: 42px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  border: 2px solid transparent;
  flex-shrink: 0;
  font-size: 16px;
}
.ui-info-label {
  font-size: 12px;
  font-weight: 950;
  color: rgba(11, 18, 32, 0.62);
}
.ui-info-value {
  margin-top: 2px;
  font-size: 14px;
  font-weight: 950;
  color: #0b1220;
}
.ui-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  font-weight: 950;
  color: #2563eb;
}
.ui-link:hover {
  color: #1d4ed8;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.16s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Line clamp */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* Checkbox */
.ui-check {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.75rem;
  border-radius: 16px;
  border: 2px solid rgba(20, 30, 48, 0.12);
  background: rgba(255, 255, 255, 0.92);
  font-size: 13px;
}
.ui-check input {
  width: 18px;
  height: 18px;
}
.text-gradient-blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900 !important;
  text-shadow: 0 1px 1px rgba(0,0,0,.08);
}

</style>
