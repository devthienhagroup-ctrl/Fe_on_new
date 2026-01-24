<template>
  <div class="contact-management bg-slate-50 min-h-screen font-sans text-slate-900">
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <header class="mb-8 space-y-6">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div class="relative z-10">
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Quản Lý Liên Hệ</h1>
            <p class="text-slate-500 text-sm mt-2 flex items-center gap-2">
              <span class="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Theo dõi và xử lý yêu cầu khách hàng
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-slate-400 group-focus-within:text-blue-600 transition-colors"></i>
              </div>
              <input
                  type="text"
                  v-model="filterState.keyword"
                  @input="handleFilterChange"
                  class="block w-full sm:w-64 pl-10 pr-3 py-2.5 bg-transparent border-none rounded-lg text-sm placeholder-slate-400 focus:ring-0 text-slate-700 font-medium"
                  placeholder="Tìm kiếm..."
              />
            </div>

            <div class="w-px bg-slate-200 my-1 hidden sm:block"></div>

            <div class="relative">
              <select
                  v-model="filterState.sortByDateDesc"
                  @change="handleFilterChange"
                  class="appearance-none block w-full pl-3 pr-9 py-2.5 bg-transparent border-none rounded-lg text-sm text-slate-600 font-medium focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors"
              >
                <option value="true">Mới nhất</option>
                <option value="false">Cũ nhất</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i class="fas fa-sort text-slate-400 text-xs"></i>
              </div>
            </div>

            <div class="w-px bg-slate-200 my-1 hidden sm:block"></div>

            <button
                @click="toggleAdvancedFilters"
                :class="['px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2', showAdvancedFilters ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900']"
            >
              <i class="fas fa-filter text-xs"></i>
              <span>Bộ lọc</span>
            </button>
          </div>
        </div>

        <div class="border-b border-slate-200">
          <div class="flex gap-6 overflow-x-auto pb-px">
            <button
                v-for="(label, status) in {
                  '': 'Tất cả',
                  'NEW': 'Mới',
                  'PROCESSING': 'Đang xử lý',
                  'RESOLVED': 'Đã xong',
                  'REJECTED': 'Từ chối'
                }"
                :key="status"
                @click="setStatus(status)"
                :class="[
                  'group relative pb-4 px-1 text-sm font-medium transition-colors whitespace-nowrap',
                  filterState.status === status
                    ? 'text-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                ]"
            >
              {{ label }}
              <span
                  :class="[
                  'absolute bottom-0 left-0 w-full h-0.5 rounded-t-full transition-all duration-300',
                  filterState.status === status ? 'bg-blue-600' : 'bg-transparent group-hover:bg-slate-300'
                ]"
              ></span>
            </button>
          </div>
        </div>

        <div
            id="advanced-filters"
            :class="['transition-all duration-300 ease-in-out overflow-hidden', showAdvancedFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0']"
            class="rounded-2xl"
        >
          <div class="bg-white p-6 border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 space-y-6 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khoảng thời gian</label>
                <div class="flex items-center gap-4">
                  <div class="relative flex-1">
                    <input
                        type="date"
                        v-model="advancedFilters.fromDate"
                        class="block w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white"
                    />
                  </div>
                  <span class="text-slate-400 font-medium">-</span>
                  <div class="relative flex-1">
                    <input
                        type="date"
                        v-model="advancedFilters.toDate"
                        class="block w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 hover:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lĩnh vực tư vấn</label>
                <div class="relative">
                  <button
                      id="field-dropdown-toggle"
                      @click="toggleFieldDropdown"
                      type="button"
                      class="w-full flex justify-between items-center px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 hover:bg-white hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <span class="text-slate-700 font-medium">{{ fieldButtonText }}</span>
                    <i class="fas fa-chevron-down text-slate-400 text-xs"></i>
                  </button>

                  <div
                      id="field-dropdown-menu"
                      :class="['absolute mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-20 dropdown-checkbox p-2', showFieldDropdown ? '' : 'hidden']"
                  >
                    <div class="space-y-1">
                      <label class="flex items-center p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors" v-for="field in availableConsultingFields" :key="field">
                        <input
                            type="checkbox"
                            :value="field.value"
                            v-model="advancedFilters.consultingFields"
                            class="rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50 h-4 w-4"
                        />
                        <span class="ml-3 text-sm font-medium text-slate-700">{{ field.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div id="selected-fields" class="flex flex-wrap gap-2 pt-1" v-if="advancedFilters.consultingFields.length > 0">
                  <span
                      v-for="field in advancedFilters.consultingFields"
                      :key="field"
                      class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {{ getConsultingFieldsLabel(field) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span class="text-sm text-slate-500">Hiển thị</span>
                <select
                    v-model.number="filterState.pageSize"
                    @change="handleFilterChange"
                    class="block w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span class="text-sm text-slate-500">dòng</span>
              </div>

              <div class="flex gap-3">
                <button
                    @click="resetFilters"
                    class="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                >
                  Đặt lại
                </button>
                <button
                    @click="applyFilters"
                    class="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
                >
                  Áp dụng bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="relative min-h-[400px]">
        <div v-if="isLoading" class="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px] z-10 flex justify-center items-start pt-20">
          <div class="flex flex-col items-center gap-3">
            <div class="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-blue-500"></div>
            <span class="text-sm font-medium text-slate-500">Đang tải dữ liệu...</span>
          </div>
        </div>

        <div v-if="error" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div class="bg-red-50 p-4 rounded-full mb-4">
            <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <p class="text-slate-800 font-medium mb-1">Đã xảy ra lỗi</p>
          <p class="text-slate-500 text-sm mb-4">{{ error }}</p>
          <button @click="fetchContacts" class="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm">
            Tải lại trang
          </button>
        </div>

        <div v-else>
          <div class="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-100/50 rounded-t-xl border border-slate-200 border-b-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div class="col-span-1">ID</div>
            <div class="col-span-2">Khách hàng</div>
            <div class="col-span-2">Liên hệ</div>
            <div class="col-span-2">Lĩnh vực</div>
            <div class="col-span-2">Trạng thái</div>
            <div class="col-span-2">Phụ trách</div>
            <div class="col-span-1 text-right">Thời gian</div>
          </div>

          <div id="contact-list" class="space-y-0 divide-y divide-slate-100 bg-white rounded-b-xl md:rounded-t-none rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div
                v-for="contact in paginatedContacts"
                :key="contact.id"
                @click="openPanel(contact.id)"
                class="group relative transition-all duration-200 hover:bg-blue-50/30 cursor-pointer"
            >
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-200"></div>

              <div class="md:grid md:grid-cols-12 md:gap-4 md:items-center p-4 md:px-6 md:py-4">
                <div class="col-span-1 flex items-center">
                  <span class="font-mono text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">#{{ contact.id }}</span>
                </div>

                <div class="col-span-12 md:col-span-2 mb-2 md:mb-0">
                  <div class="md:hidden text-xs font-semibold text-slate-400 mb-1">Khách hàng</div>
                  <div class="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {{ contact.fullName }}
                  </div>
                </div>

                <div class="col-span-12 md:col-span-2 mb-2 md:mb-0">
                  <div class="md:hidden text-xs font-semibold text-slate-400 mb-1">Liên hệ</div>
                  <div class="text-sm text-slate-600 space-y-0.5">
                    <div class="flex items-center gap-2 text-slate-700">
                      <i class="fas fa-phone text-xs text-slate-400 w-3"></i>
                      <span class="font-medium">{{ contact.phone }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-slate-500">
                      <i class="fas fa-envelope text-xs text-slate-400 w-3"></i>
                      <span class="truncate">{{ contact.email }}</span>
                    </div>
                  </div>
                </div>

                <div class="col-span-12 md:col-span-2 mb-2 md:mb-0">
                  <div class="md:hidden text-xs font-semibold text-slate-400 mb-1">Lĩnh vực</div>
                  <div class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {{ getConsultingFieldsLabel(contact.consultingField) }}
                  </div>
                </div>

                <div class="col-span-12 md:col-span-2 mb-2 md:mb-0">
                  <div class="md:hidden text-xs font-semibold text-slate-400 mb-1">Trạng thái</div>
                  <span
                      :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm', statusConfig[contact.status]?.classes || statusConfig.NEW.classes]"
                  >
                    <i :class="[statusConfig[contact.status]?.icon || 'fas fa-circle', 'text-[10px]']"></i>
                    {{ statusConfig[contact.status]?.label || contact.status }}
                  </span>
                </div>

                <div class="col-span-12 md:col-span-2 mb-2 md:mb-0">
                  <div class="md:hidden text-xs font-semibold text-slate-400 mb-1">Người phụ trách</div>
                  <div class="flex items-center gap-2">
                    <div v-if="contact.assignedEmployeeName" class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {{ contact.assignedEmployeeName.charAt(0) }}
                    </div>
                    <div v-else class="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs">
                      <i class="fas fa-user"></i>
                    </div>
                    <span :class="['text-sm', contact.assignedEmployeeName ? 'text-slate-700 font-medium' : 'text-slate-400 italic']">
                      {{ contact.assignedEmployeeName || 'Chưa chỉ định' }}
                    </span>
                  </div>
                </div>

                <div class="col-span-12 md:col-span-1 md:text-right">
                  <div class="md:hidden text-xs font-semibold text-slate-400 mb-1">Thời gian</div>
                  <div class="text-xs font-medium text-slate-500 group-hover:text-slate-700">
                    {{ timeAgo(contact.createdAt) }}
                  </div>
                </div>

                <div class="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <i class="fas fa-chevron-right text-slate-300"></i>
                </div>
              </div>
            </div>

            <div v-if="paginatedContacts.length === 0" class="flex flex-col items-center justify-center py-16 bg-white">
              <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-search text-slate-300 text-3xl"></i>
              </div>
              <h3 class="text-slate-900 font-medium mb-1">Không tìm thấy kết quả</h3>
              <p class="text-slate-500 text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          </div>

          <div v-if="totalContacts > 0" id="pagination"
               class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 px-1">
            <div class="text-sm text-slate-500 font-medium">
              Hiển thị <span class="text-slate-900">{{ startItem }}</span> - <span class="text-slate-900">{{ endItem }}</span>
              trên tổng số <span class="text-slate-900">{{ totalContacts }}</span>
            </div>
            <div class="flex items-center bg-white rounded-lg shadow-sm border border-slate-200 p-1">
              <button
                  @click="prevPage"
                  :disabled="filterState.pageNumber === 0"
                  class="p-2 rounded-md text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="px-4 text-sm font-semibold text-slate-700 select-none">
                Trang {{ currentPage }} / {{ totalPages }}
              </div>
              <button
                  @click="nextPage"
                  :disabled="filterState.pageNumber >= totalPages - 1"
                  class="p-2 rounded-md text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div
        id="overlay"
        @click="closePanel"
        :class="[
        'fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity duration-300',
        panelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
      ]"
        aria-hidden="true"
    ></div>

    <aside
        id="slide-panel"
        :class="[
        'fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[900px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col',
        panelOpen ? 'translate-x-0' : 'translate-x-full',
      ]"
    >
      <div class="px-3 py-3 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-20">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold text-slate-800" id="panel-title">
              {{ contactDraft ? 'Chi tiết yêu cầu #' + contactDraft.id : 'Chi tiết liên hệ' }}
            </h2>
            <span id="panel-status-badge" v-if="contactDraft">
                <span
                    :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border',
                    statusConfig[contactDraft.status]?.classes || statusConfig.NEW.classes,
                  ]"
                >
                  {{ statusConfig[contactDraft.status]?.label || contactDraft.status }}
                </span>
             </span>
          </div>
          <p class="text-xs text-slate-500 font-medium" v-if="contactDraft">
            Tạo ngày {{ formatDateTime(contactDraft.createdAt) }}
          </p>
        </div>

        <button
            @click="closePanel"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
        >
          <i class="fas fa-times text-lg"></i>
        </button>
      </div>

      <div v-if="isLoadingDetail" class="flex-1 flex flex-col items-center justify-center space-y-3">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-slate-100 border-t-blue-500"></div>
        <p class="text-slate-400 text-sm">Đang tải thông tin chi tiết...</p>
      </div>

      <div v-else-if="contactDraft" class="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-6 custom-scrollbar">

        <section class="bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
              <i class="fas fa-user"></i>
            </div>
            <h3 class="font-semibold text-slate-800 text-sm">Thông tin Khách hàng</h3>
          </div>

          <div class="p-3 grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
            <div>
              <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Họ và tên</label>
              <p class="font-semibold text-slate-900 text-base" id="detail-name">{{ contactDraft.fullName }}</p>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Liên hệ</label>
              <div class="space-y-1">
                <p class="font-medium text-slate-900 flex items-center gap-2 group">
                  <i class="fas fa-phone text-slate-300 text-xs w-4"></i>
                  <span id="detail-phone">{{ contactDraft.phone }}</span>
                  <button @click="copyToClipboard(contactDraft.phone)" class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 transition-all p-1">
                    <i class="far fa-copy text-xs"></i>
                  </button>
                </p>
                <p
                    class="font-medium text-blue-600 hover:underline cursor-pointer flex items-center gap-2 group"
                    id="detail-email"
                    @click="copyToClipboard(contactDraft.email)"
                >
                  <i class="fas fa-envelope text-slate-300 text-xs w-4"></i>
                  {{ contactDraft.email }}
                  <i class="far fa-copy text-xs opacity-0 group-hover:opacity-100 text-blue-400"></i>
                </p>
              </div>
            </div>

            <div class="md:col-span-2">
              <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Địa chỉ</label>
              <p class="font-medium text-slate-800 flex items-start gap-2" id="detail-address">
                <i class="fas fa-map-marker-alt text-slate-300 text-xs mt-1 w-4"></i>
                {{ contactDraft.address || 'Không có địa chỉ' }}
              </p>
            </div>

            <div class="md:col-span-2 lg:flex items-center gap-3">
              <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wide m-0">Lĩnh vực quan tâm</label>
              <div
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 m-0"
                  id="detail-field"
              >
                {{ getConsultingFieldsLabel(contactDraft.consultingField) }}
              </div>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs">
              <i class="fas fa-align-left"></i>
            </div>
            <h3 class="font-semibold text-slate-800 text-sm">Nội dung yêu cầu</h3>
          </div>
          <div class="p-3">
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p class="text-slate-700 text-sm leading-relaxed whitespace-pre-line font-medium" id="detail-description">
                {{ contactDraft.description }}
              </p>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">
              <i class="fas fa-tasks"></i>
            </div>
            <h3 class="font-semibold text-slate-800 text-sm">Quy trình xử lý</h3>
          </div>

          <div class="p-3 space-y-6">
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-3">Cập nhật trạng thái</label>
              <div class="flex flex-wrap gap-3">
                <button
                    v-for="statusOption in allowedStatusOptions"
                    :key="statusOption.value"
                    @click="changeStatusInDraft(statusOption.value)"
                    :disabled="isReadOnly && contactDraft.status !== statusOption.value"
                    :class="[
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 transform active:scale-95',
                        contactDraft.status === statusOption.value
                          ? 'ring-2 ring-offset-2 ring-offset-white shadow-md z-10'
                          : 'opacity-70 hover:opacity-100 hover:bg-slate-100 grayscale hover:grayscale-0',
                        contactDraft.status === statusOption.value ? (
                            statusOption.value === 'NEW' ? 'bg-blue-600 ring-blue-500 text-white' :
                            statusOption.value === 'PROCESSING' ? 'bg-amber-500 ring-amber-500 text-white' :
                            statusOption.value === 'RESOLVED' ? 'bg-emerald-600 ring-emerald-500 text-white' :
                            'bg-red-600 ring-red-500 text-white'
                        ) : 'bg-white border border-slate-200 text-slate-600'
                    ]"
                >
                  <i :class="[statusOption.icon, contactDraft.status === statusOption.value ? 'text-white' : '']"></i>
                  {{ statusOption.label }}
                  <i v-if="contactDraft.status === statusOption.value" class="fas fa-check ml-1 text-xs"></i>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                <i class="fas fa-user-tie"></i>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-0.5">Nhân viên phụ trách</p>
                <p class="font-semibold text-slate-900 text-sm" id="detail-assigned-employee">
                  {{ contactDraft.assignedEmployeeName || 'Chưa chỉ định' }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
            class="rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border overflow-hidden transition-colors duration-300"
            id="reply-section"
            :class="contactDraft.repliedContent && contactDraft.repliedContent.trim() !== ''
                  ? 'bg-emerald-50/50 border-emerald-100'
                  : 'bg-white border-slate-100'"
        >
          <div class="px-5 py-3 border-b flex items-center justify-between"
               :class="contactDraft.repliedContent && contactDraft.repliedContent.trim() !== '' ? 'border-emerald-100' : 'border-slate-50 bg-slate-50/30'"
          >
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                   :class="contactDraft.repliedContent && contactDraft.repliedContent.trim() !== '' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'">
                <i class="fas fa-paper-plane"></i>
              </div>
              <h3 class="font-semibold text-slate-800 text-sm">Phản hồi khách hàng</h3>
            </div>

            <span id="reply-status-badge">
              <span
                  v-if="contactDraft.repliedContent && contactDraft.repliedContent.trim() !== ''"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"
              >
                <i class="fas fa-check-circle mr-1"></i> Đã phản hồi
              </span>
              <span
                  v-else
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700"
              >
                <i class="fas fa-clock mr-1"></i> Chờ phản hồi
              </span>
            </span>
          </div>

          <div class="p-3">
            <div class="relative">
              <textarea
                  id="reply-content-edit"
                  v-model="contactDraft.repliedContent"
                  rows="6"
                  class="block w-full text-sm border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 p-4 placeholder-slate-400 resize-none transition-shadow"
                  placeholder="Nhập nội dung phản hồi chi tiết cho khách hàng tại đây..."
                  :disabled="isReadOnly"
              ></textarea>
<!--              <div class="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none">
                Hỗ trợ định dạng văn bản
              </div>-->
            </div>
            <p class="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <i class="fas fa-info-circle"></i>
              Nội dung này sẽ được lưu và gửi email cho khách hàng khi nhấn "Lưu thay đổi".
            </p>
          </div>
        </section>

        <section class="bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
          <div class="px-5 py-3 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">
              <i class="fas fa-lock"></i>
            </div>
            <h3 class="font-semibold text-slate-800 text-sm">Ghi chú nội bộ</h3>
          </div>
          <div class="p-3">
            <div class="relative">
                <textarea
                    id="detail-internal-note"
                    v-model="contactDraft.internalNote"
                    rows="3"
                    class="block w-full text-sm bg-amber-50/30 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 p-4 placeholder-slate-400 resize-none transition-shadow"
                    placeholder="Ghi chú chỉ hiển thị với nhân viên..."
                    :disabled="isReadOnly"
                ></textarea>
            </div>
          </div>
        </section>

        <div class="py-4 border-t border-slate-200 mt-4">
          <button
              class="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 hover:text-slate-600 transition-colors w-full"
              @click="$event.target.nextElementSibling.classList.toggle('hidden')"
          >
            <span>Thông tin kỹ thuật</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <label class="block text-[10px] uppercase text-slate-400 font-bold mb-1">Địa chỉ IP</label>
              <div class="flex items-center justify-between">
                <p class="font-mono text-xs text-slate-800" id="detail-ip">{{ contactDraft.ipAddress }}</p>
                <button @click="copyToClipboard(contactDraft.ipAddress)" class="text-slate-400 hover:text-blue-500">
                  <i class="far fa-copy text-xs"></i>
                </button>
              </div>
            </div>
            <div class="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <label class="block text-[10px] uppercase text-slate-400 font-bold mb-1">Thời gian cập nhật</label>
              <p class="font-mono text-xs text-slate-800" id="detail-updated-at">{{ formatDateTime(contactDraft.updatedAt) }}</p>
            </div>
            <div class="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <label class="block text-[10px] uppercase text-slate-400 font-bold mb-1">User Agent</label>
              <div class="flex items-start gap-2">
                <p class="font-mono text-[10px] text-slate-600 leading-tight flex-1 break-all" id="detail-user-agent">
                  {{ contactDraft.userAgent }}
                </p>
                <button @click="copyToClipboard(contactDraft.userAgent)" class="text-slate-400 hover:text-blue-500">
                  <i class="far fa-copy text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="contactDraft"
           class="p-3 border-t border-slate-100 bg-white sticky bottom-0 z-20 flex gap-4 justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">

        <div class="text-xs text-slate-500 hidden md:block" v-if="hasChanges">
          <i class="fas fa-pen text-amber-500 mr-1"></i> Có thay đổi chưa lưu
        </div>
        <div class="flex gap-3 justify-end w-full md:w-auto ml-auto">
          <button
              @click="closePanel"
              class="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
              @click="saveContact"
              :disabled="isSaving || !hasChanges || isReadOnly"
              class="px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all
             transform active:scale-[0.98]
             disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-slate-400
             flex items-center gap-2"
              :class="[
        (isSaving || !hasChanges || isReadOnly)
          ? 'bg-slate-400'
          : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25 hover:shadow-blue-500/40'
      ]"
          >
            <i v-if="isSaving" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{
              isSaving
                  ? 'Đang lưu...'
                  : isReadOnly
                      ? 'Chế độ xem'
                      : !hasChanges
                          ? 'Lưu thay đổi'
                          : 'Lưu thay đổi'
            }}
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, watch} from 'vue'
import Swal from 'sweetalert2'
import api from "../../api/api.js"

// Data từ API
const contacts = ref([])
const totalContacts = ref(0)

// Filter State
const filterState = reactive({
  keyword: '',
  status: 'NEW',
  sortByDateDesc: 'true',
  pageNumber: 0,
  pageSize: 10
})

// Advanced Filters (tách riêng)
const advancedFilters = reactive({
  fromDate: null,
  toDate: null,
  consultingFields: []
})

// UI State
const showAdvancedFilters = ref(false)
const showFieldDropdown = ref(false)
const panelOpen = ref(false)
const contactDraft = ref(null)
const originalContactData = ref(null) // Lưu dữ liệu gốc để so sánh
const isLoading = ref(false)
const isLoadingDetail = ref(false)
const isSaving = ref(false)
const error = ref(null)
const originalStatus = ref(null)
const allowedStatusOptions = ref([])

// Status Flow
const statusFlow = {
  NEW: ['PROCESSING', 'RESOLVED', 'REJECTED'],
  PROCESSING: ['RESOLVED', 'REJECTED'],
  RESOLVED: [],
  REJECTED: []
}

// Status Config với icon
const statusConfig = reactive({
  NEW: {
    label: 'Mới',
    icon: 'fas fa-star',
    classes: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/30'
  },
  PROCESSING: {
    label: 'Đang xử lý',
    icon: 'fas fa-sync-alt',
    classes: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/30'
  },
  RESOLVED: {
    label: 'Đã xong',
    icon: 'fas fa-check-circle',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/30'
  },
  REJECTED: {
    label: 'Từ chối',
    icon: 'fas fa-times-circle',
    classes: 'bg-red-50 text-red-700 border-red-200 ring-red-500/30'
  }
})

// Computed: Kiểm tra xem có thay đổi nào không
const hasChanges = computed(() => {
  if (!contactDraft.value || !originalContactData.value) return false

  const draft = contactDraft.value
  const original = originalContactData.value

  // So sánh các trường có thể thay đổi
  return draft.status !== original.status ||
      draft.repliedContent !== original.repliedContent ||
      draft.internalNote !== original.internalNote ||
      draft.assignedEmployeeId !== original.assignedEmployeeId
})

// Computed: Kiểm tra xem có phải chỉ đọc không (RESOLVED hoặc REJECTED)
const isReadOnly = computed(() => {
  if (!originalStatus.value) return false
  return ['RESOLVED', 'REJECTED'].includes(originalStatus.value)
})

// Tính toán availableStatusOptions dựa trên originalStatus
const computeAllowedStatusOptions = () => {
  if (!originalStatus.value) return []

  const allowedStatuses = statusFlow[originalStatus.value] || []
  const allowedOptions = []

  // Thêm trạng thái hiện tại (original) vào danh sách để hiển thị
  allowedOptions.push({
    value: originalStatus.value,
    label: statusConfig[originalStatus.value]?.label || originalStatus.value,
    icon: statusConfig[originalStatus.value]?.icon || 'fas fa-question',
    classes: statusConfig[originalStatus.value]?.classes || ''
  })

  // Thêm các trạng thái được phép chuyển đổi
  allowedStatuses.forEach(statusKey => {
    if (statusConfig[statusKey]) {
      allowedOptions.push({
        value: statusKey,
        label: statusConfig[statusKey].label,
        icon: statusConfig[statusKey].icon,
        classes: statusConfig[statusKey].classes
      })
    }
  })

  return allowedOptions
}

const consultingFields = [
  {label: 'Quản lý nhóm', value: 'team-management'},
  {label: 'Định giá BĐS', value: 'estimate-property'},
  {label: 'Quản lý dự án', value: 'project-manager'},
  {label: 'Bán nhanh BĐS', value: 'quick-sale'},
  {label: 'Quản lý tài sản', value: 'property-management'},
  {label: 'Ứng tuyển cộng tác viên', value: 'ctv-recruitment'},
  {label: 'Khác', value: 'other'}
];

// Computed: Danh sách các lĩnh vực tư vấn từ dữ liệu
const availableConsultingFields = computed(() => {
  return consultingFields;
})

const getConsultingFieldsLabel = (value) => {
  return consultingFields.find(field => field.value === value)?.label || value
}

// Computed: Text hiển thị trên dropdown button
const fieldButtonText = computed(() => {
  if (advancedFilters.consultingFields.length === 0) {
    return 'Tất cả lĩnh vực'
  } else if (advancedFilters.consultingFields.length === 1) {
    return getConsultingFieldsLabel(advancedFilters.consultingFields[0])
  } else {
    return `${advancedFilters.consultingFields.length} lĩnh vực đã chọn`
  }
})

// SweetAlert2 configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

function showSuccess(message) {
  Toast.fire({
    icon: 'success',
    title: message
  })
}

function showError(message) {
  Toast.fire({
    icon: 'error',
    title: message
  })
}

function showConfirm(title, text, confirmButtonText = 'Xác nhận') {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmButtonText,
    cancelButtonText: 'Hủy'
  })
}

// Helper Functions
function copyToClipboard(text) {
  navigator.clipboard
      .writeText(text)
      .then(() => {
        showSuccess('Đã sao chép vào clipboard')
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
        showError('Không thể sao chép')
      })
}

function timeAgo(date) {
  if (!date) return 'Chưa có'
  const dateObj = new Date(date)
  const seconds = Math.floor((new Date() - dateObj) / 1000)
  let interval = seconds / 31536000

  if (interval > 1) return Math.floor(interval) + ' năm trước'
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' tháng trước'
  interval = seconds / 86400
  if (interval > 1) {
    if (Math.floor(interval) > 30) return dateObj.toLocaleDateString('vi-VN')
    return Math.floor(interval) + ' ngày trước'
  }
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' giờ trước'
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' phút trước'
  return 'Vừa xong'
}

function formatDateTime(date) {
  if (!date) return 'Chưa cập nhật'
  return new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// API Functions
async function fetchContacts() {
  try {
    isLoading.value = true
    error.value = null

    // Xây dựng FilterDTO
    const filterDTO = {
      keyword: filterState.keyword,
      status: filterState.status || null,
      sortByDateDesc: filterState.sortByDateDesc === 'true',
      pageNumber: filterState.pageNumber,
      pageSize: filterState.pageSize,
      consultingFields: advancedFilters.consultingFields.length > 0 ? advancedFilters.consultingFields : null
    }

    // Thêm ngày nếu có
    if (advancedFilters.fromDate) {
      filterDTO.fromDate = new Date(advancedFilters.fromDate + 'T00:00:00')
    }
    if (advancedFilters.toDate) {
      filterDTO.toDate = new Date(advancedFilters.toDate + 'T23:59:59')
    }

    const response = await api.post('/thg/contact/filter', filterDTO)

    contacts.value = response.data.content.map(contact => ({
      ...contact,
      assignedEmployee: contact.assignedEmployeeId ? {
        id: contact.assignedEmployeeId,
        name: contact.assignedEmployeeName
      } : null
    }))

    totalContacts.value = response.data.totalElements
  } catch (err) {
    console.error('Error fetching contacts:', err)
    error.value = 'Không thể tải danh sách liên hệ. Vui lòng thử lại.'
    showError('Không thể tải danh sách liên hệ')
  } finally {
    isLoading.value = false
  }
}

async function fetchContactDetail(id) {
  try {
    isLoadingDetail.value = true
    const response = await api.get(`/thg/contact/getById/${id}`)

    const contactData = response.data
    return {
      ...contactData,
      assignedEmployee: contactData.assignedEmployeeId ? {
        id: contactData.assignedEmployeeId,
        name: contactData.assignedEmployeeName
      } : null
    }
  } catch (err) {
    console.error('Error fetching contact detail:', err)
    showError('Không thể tải thông tin chi tiết')
    throw err
  } finally {
    isLoadingDetail.value = false
  }
}

async function updateContact(data) {
  try {
    const resolveDTO = {
      id: data.id,
      status: data.status,
      repliedContent: data.repliedContent,
      internalNote: data.internalNote,
      assignedEmployeeId: data.assignedEmployee?.id || null
    }
    console.log("Chuẩn bị lưu", resolveDTO)
    const response = await api.post('/thg/contact/resolve', resolveDTO)
    return response.data
  } catch (err) {
    console.error('Error updating contact:', err)
    throw err
  }
}

// Computed properties
const paginatedContacts = computed(() => contacts.value)
const totalPages = computed(() => Math.ceil(totalContacts.value / filterState.pageSize))
const startItem = computed(() => (filterState.pageNumber * filterState.pageSize) + 1)
const endItem = computed(() => Math.min(startItem.value + paginatedContacts.value.length - 1, totalContacts.value))
const currentPage = computed(() => filterState.pageNumber + 1)

// UI Functions
function setStatus(status) {
  filterState.status = status
  filterState.pageNumber = 0
  fetchContacts()
}

function toggleAdvancedFilters() {
  showAdvancedFilters.value = !showAdvancedFilters.value
}

function toggleFieldDropdown() {
  showFieldDropdown.value = !showFieldDropdown.value
}

function resetFilters() {
  filterState.keyword = ''
  filterState.status = 'NEW'
  filterState.sortByDateDesc = 'true'
  filterState.pageNumber = 0
  filterState.pageSize = 10

  advancedFilters.fromDate = null
  advancedFilters.toDate = null
  advancedFilters.consultingFields = []

  fetchContacts()
  showSuccess('Đã đặt lại bộ lọc')
}

function applyFilters() {
  showAdvancedFilters.value = false
  filterState.pageNumber = 0
  fetchContacts()
  showSuccess('Đã áp dụng bộ lọc')
}

function handleFilterChange() {
  fetchContacts()
}

function prevPage() {
  if (filterState.pageNumber > 0) {
    filterState.pageNumber--
    fetchContacts()
  }
}

function nextPage() {
  if (filterState.pageNumber < totalPages.value - 1) {
    filterState.pageNumber++
    fetchContacts()
  }
}

// Panel Functions
// Panel Functions
async function openPanel(id) {
  try {
    const contactDetail = await fetchContactDetail(id)

    if (!contactDetail) {
      showError('Không tìm thấy thông tin liên hệ')
      return
    }

    // Lưu trạng thái gốc và dữ liệu gốc
    originalStatus.value = contactDetail.status
    originalContactData.value = JSON.parse(JSON.stringify(contactDetail))
    allowedStatusOptions.value = computeAllowedStatusOptions()

    contactDraft.value = JSON.parse(JSON.stringify(contactDetail))
    panelOpen.value = true
  } catch (err) {
    // Error đã được xử lý trong fetchContactDetail
  }
}


function closePanel() {
  panelOpen.value = false
  contactDraft.value = null
  originalContactData.value = null
  originalStatus.value = null
  allowedStatusOptions.value = []
}

function changeStatusInDraft(newStatus) {
  if (contactDraft.value) {
    contactDraft.value.status = newStatus
  }
}

async function saveContact() {
  if (!contactDraft.value || !hasChanges.value) return

  try {
    isSaving.value = true

    const result = await showConfirm(
        'Xác nhận lưu thay đổi',
        'Bạn có chắc chắn muốn lưu các thay đổi này?',
        'Lưu thay đổi'
    )

    if (result.isConfirmed) {
      await updateContact(contactDraft.value)

      // Cập nhật lại dữ liệu gốc sau khi lưu thành công
      originalContactData.value = JSON.parse(JSON.stringify(contactDraft.value))
      originalStatus.value = contactDraft.value.status

      // Refresh danh sách
      await fetchContacts()

      showSuccess('Đã lưu thay đổi thành công!')
    }
  } catch (err) {
    showError('Lưu thay đổi thất bại. Vui lòng thử lại.')
  } finally {
    isSaving.value = false
  }
}

// Event Listeners
function handleClickOutside(event) {
  const dropdownToggle = document.getElementById('field-dropdown-toggle')
  const dropdownMenu = document.getElementById('field-dropdown-menu')

  if (dropdownToggle && dropdownMenu) {
    if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
      showFieldDropdown.value = false
    }
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closePanel()
  }
}

// Watch for filter changes
watch(
    () => [filterState.keyword, filterState.sortByDateDesc],
    () => {
      if (!isLoading.value) {
        fetchContacts()
      }
    }
)

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
  fetchContacts()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dropdown-checkbox {
  max-height: 250px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.dropdown-checkbox::-webkit-scrollbar {
  width: 5px;
}

.dropdown-checkbox::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-checkbox::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>