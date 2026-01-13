<template>
  <div class="app-scale">
    <div class="app-root">
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-custom">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="fas fa-phone-alt"></i>
          <span>ADMIN PRO</span>
        </a>

        <button class="navbar-toggler" type="button" @click="toggleMobileMenu">
          <span class="navbar-toggler-icon"><i class="fas fa-bars text-white"></i></span>
        </button>

        <div class="collapse navbar-collapse" :class="{ show: mobileMenuOpen }" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <a class="nav-link-custom active" href="#">
                <i class="fas fa-home me-2"></i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link-custom" href="#">
                <i class="fas fa-users me-2"></i> Khách hàng
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link-custom" href="#">
                <i class="fas fa-chart-bar me-2"></i> Báo cáo
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link-custom" href="#">
                <i class="fas fa-cog me-2"></i> Cài đặt
              </a>
            </li>
          </ul>

          <div class="d-flex align-items-center gap-3">
            <div class="dropdown">
              <button class="btn btn-outline-custom btn-custom" type="button" @click="toggleNotifications">
                <i class="fas fa-bell"></i>
                <span class="badge bg-danger rounded-pill">3</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" :class="{ show: notificationsOpen }">
                <li><h6 class="dropdown-header">Thông báo mới</h6></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-user-check text-success me-2"></i> 5 khách hàng mới</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-chart-line text-primary me-2"></i> Báo cáo tuần đã sẵn sàng</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-exclamation-triangle text-warning me-2"></i> Còn 12 cuộc gọi</a></li>
              </ul>
            </div>

            <div class="dropdown">
              <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle" @click="toggleUserMenu">
                <div class="user-avatar me-2">NV</div>
                <div class="d-flex flex-column">
                  <span class="text-white fw-medium">Nguyễn Văn A</span>
                  <small class="text-white-50">Telesale Manager</small>
                </div>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" :class="{ show: userMenuOpen }">
                <li><a class="dropdown-item" href="#"><i class="fas fa-user-circle me-2"></i> Hồ sơ</a></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2"></i> Cài đặt</a></li>
                <li><hr class="dropdown-divider" /></li>
                <li><a class="dropdown-item" href="#"><i class="fas fa-sign-out-alt me-2"></i> Đăng xuất</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- ✅ Shell: Sidebar đứng yên + Main cuộn riêng -->
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar-wrap">
        <div class="sidebar">
          <div class="sidebar-section">
            <h6 class="sidebar-title sidebar-title-icon">
              <i class="fas fa-filter"></i>
              Bộ lọc nâng cao
            </h6>
            <div class="filter-tabs">
              <button
                  v-for="tab in filterTabs"
                  :key="tab.value"
                  class="filter-tab"
                  :class="{ active: activeTab === tab.value }"
                  @click="setActiveTab(tab.value)"
              >
                {{ tab.label }}
              </button>
            </div>

            <div class="mb-3">
              <label class="form-label mb-2 fw-medium">Phân loại</label>
              <select class="form-select form-select-custom" v-model="filters.type">
                <option value="all">Tất cả phân loại</option>
                <option value="MOI_GIOI">Môi giới</option>
                <option value="CHINH_CHU">Chủ nhà</option>
                <option value="MOI_GIOI">Người thân</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label mb-2 fw-medium">Người tạo</label>
                <select v-model="filters.creator" class="form-select form-select-custom ">
                  <option value="all">-- Tất cả nhân viên --</option>
                  <option
                      v-for="nv in telesalesOptions"
                      :key="nv.id"
                      :value="nv.id"
                  >
                    {{ nv.tenNhanVien }}
                  </option>
                </select>

            </div>

            <div class="mb-3">
              <label class="form-label mb-2 fw-medium">Ngày tạo từ - đến</label>
              <div class="d-flex gap-2">
                <input
                  type="date"
                  class="form-control form-control-custom"
                  v-model="filters.createdFrom"
                  @input="applyFilters"
                >
              </div>
            </div>
            <div  class="d-flex gap-2">
              <input
                  type="date"
                  class="form-control form-control-custom"
                  v-model="filters.createdTo"
                  @input="applyFilters"
              >
            </div>

            <div class="mb-3 mt-3">
              <label class="form-label mb-2 fw-medium">Ngày cập nhật từ - đến</label>
              <div class="d-flex gap-2">
                <input
                  type="date"
                  class="form-control form-control-custom"
                  v-model="filters.updatedFrom"
                  @input="applyFilters"
                >
              </div>
            </div>
            <div class="mb-3">
              <input
                  type="date"
                  class="form-control form-control-custom"
                  v-model="filters.updatedTo"
                  @input="applyFilters"
              >
            </div>

            <div class="mb-3" v-if="activeTab === 'contacted'">
              <label class="form-label mb-2 fw-medium">Trạng thái</label>
              <select class="form-select form-select-custom" v-model="filters.status">
                <option value="all">Tất cả trạng thái</option>
                <option value="potential_7">Tiềm năng 7 ngày</option>
                <option value="potential_14">Tiềm năng 14 ngày</option>
                <option value="success">Thành công</option>
                <option value="wrong_number">Sai số</option>
                <option value="unreachable">Không liên lạc</option>
                <option value="care">Chăm sóc</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="form-label mb-2 fw-medium">Tỉnh/Thành phố</label>
              <input
                class="form-control form-control-custom"
                style="font-size: 16px !important;"
                list="province-filter-options"
                v-model="filters.province"
                placeholder="Tất cả tỉnh thành"
                @input="applyFilters"
              >
              <datalist id="province-filter-options" max-size="5">
                <option value="all">Tất cả tỉnh thành</option>
                <option v-for="province in provinceOptions" :key="province" :value="province"></option>
              </datalist>
            </div>

            <div class="d-grid gap-2">
              <button class="btn-outline-custom btn-custom" @click="resetFilters">
                <i class="fas fa-redo me-1"></i> Đặt lại
              </button>
            </div>
          </div>

          <div class="sidebar-section">
            <h6 class="sidebar-title">
              <i class="fas fa-tachometer-alt sidebar-icon-yellow"></i>
              Tiến độ hôm nay
            </h6>
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="fw-medium">Cuộc gọi: <span class="text-primary">28/40</span></span>
                <span class="fw-bold gradient-text">70%</span>
              </div>
              <div class="progress progress-custom">
                <div class="progress-bar" style="width: 70%; background: var(--primary-gradient);"></div>
              </div>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="fw-medium">Thành công: <span class="text-success">12</span></span>
                <span class="fw-bold gradient-text">42.8%</span>
              </div>
              <div class="progress progress-custom">
                <div class="progress-bar" style="width: 42.8%; background: var(--success-gradient);"></div>
              </div>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="fw-medium">Tiềm năng: <span class="text-warning">8</span></span>
                <span class="fw-bold gradient-text">28.6%</span>
              </div>
              <div class="progress progress-custom">
                <div class="progress-bar" style="width: 28.6%; background: var(--warning-gradient);"></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main (cuộn riêng) -->
      <section class="main-wrap">
        <div class="main-scroll">
          <div class="main-content">
            <!-- Stat Cards -->
            <div class="row mb-4">
              <div class="col-md-6 col-lg-3">
                <div class="stat-card" style="background: var(--primary-gradient);">
                  <div class="stat-card-content">
                    <h5><i class="fas fa-users"></i>Tổng data khách hàng</h5>
                    <div class="stat-number">1,248</div>
                    <div class="stat-change">
                      <i class="fas fa-arrow-up me-1"></i> 12% so với tháng trước
                    </div>
                  </div>
                  <i class="fas fa-user-friends stat-icon"></i>
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="stat-card" style="background: var(--success-gradient);">
                  <div class="stat-card-content">
                    <h5><i class="fas fa-phone-volume"></i>Cuộc gọi thực hiện</h5>
                    <div class="stat-number">28/40</div>
                    <div class="stat-change">
                      <i class="fas fa-check-circle me-1"></i> 70% hoàn thành
                    </div>
                  </div>
                  <i class="fas fa-phone-alt stat-icon"></i>
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="stat-card" style="background: var(--danger-gradient);">
                  <div class="stat-card-content">
                    <h5><i class="fas fa-chart-line"></i> Data gọi được</h5>
                    <div class="stat-number">42.5%</div>
                    <div class="stat-change">
                      <i class="fas fa-arrow-up me-1"></i> 5.2% so với tuần trước
                    </div>
                  </div>
                  <i class="fas fa-chart-pie stat-icon"></i>
                </div>
              </div>
              <div class="col-md-6 col-lg-3">
                <div class="stat-card" style="background: var(--info-gradient);">
                  <div class="stat-card-content">
                    <h5><i class="fas fa-calendar-check"></i> Số khách hẹn lên VP</h5>
                    <div class="stat-number">156</div>
                    <div class="stat-change">
                      <i class="fas fa-arrow-up me-1"></i> 18% so với tháng trước
                    </div>
                  </div>
                  <i class="fas fa-calendar-alt stat-icon"></i>
                </div>
              </div>
            </div>

            <!-- Charts -->
            <div class="row equal-height-row mb-4">
              <div class="col-lg-8">
                <div class="card-custom h-100">
                  <div class="card-header-custom">
                    <h3 class="section-title">
                    <span class="icon-gradient">
                      <i class="fas fa-chart-line"></i>
                    </span>
                      Thống kê cuộc gọi theo tháng
                    </h3>
                    <div>
                      <select class="form-select form-select-custom form-select-sm w-auto d-inline-block" v-model="chartYear">
                        <option value="2023">2023</option>
                        <option value="2024" selected>2024</option>
                        <option value="2022">2022</option>
                      </select>
                    </div>
                  </div>
                  <div class="card-body p-4">
                    <div class="chart-container">
                      <canvas ref="monthlyChart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="card-custom h-100">
                  <div class="card-header-custom">
                    <h3 class="section-title">
                      <span class="icon-gradient icon-customer">
                        <i class="fas fa-chart-pie"></i>
                      </span>
                      Phân bổ trạng thái
                    </h3>
                  </div>
                  <div class="card-body p-4 position-relative">
                    <div class="chart-container">
                      <div class="chart-center-text">
                        <div class="total-number">570</div>
                        <div class="total-label">Tổng khách hàng</div>
                      </div>
                      <canvas ref="statusChart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Controls and Table -->
            <div class="row">
              <div class="col-12">
                <!-- Bulk Actions -->
                <div class="bulk-actions" :class="{ show: selectedCount > 0 }">
                  <span class="fw-medium">{{ selectedCount }} khách hàng được chọn</span>
                  <div class="d-flex gap-2 ms-auto">
                    <button class=" btn-danger-custom btn-custom" @click="bulkDelete">
                      <i class="fas fa-trash me-1"></i> Xóa hàng loạt
                    </button>
                    <button class="btn-info-custom btn-custom" @click="openAssignDataModal">
                      <i class="fas fa-database me-2"></i> Cấp dữ liệu
                    </button>

                    <div class="d-flex gap-2">
                      <button class="btn-success-custom btn-custom" @click="exportExcel">
                        <i class="fas fa-file-excel me-2"></i> Excel
                      </button>
                      <button class="btn-danger-custom btn-custom" @click="exportPDF">
                        <i class="fas fa-file-pdf me-2"></i> PDF
                      </button>
                    </div>
                    <button class=" btn-outline-custom btn-custom" @click="clearSelection">
                      <i class="fas fa-times me-1"></i> Bỏ chọn
                    </button>
                  </div>
                </div>

                <!-- Table Controls -->
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                  <div
                      class="d-flex align-items-center gap-3"
                      style="width: 100%; max-width: 550px;"
                  >
                    <!-- Search -->
                    <div class="search-box flex-grow-1">
                      <i class="fas fa-search"></i>
                      <input
                          type="text"
                          class="form-control"
                          style="font-size: 18px !important;"
                          v-model="searchText"
                          placeholder="Tìm kiếm khách hàng..."
                          @input="applyFilters"
                      >
                    </div>

                    <!-- Page size -->
                    <span class="fw-medium text-nowrap">Hiển thị</span>

                    <select
                        class="form-select w-auto"  style="font-size: 18px !important; border-radius: 10px !important;"
                        v-model="pageSize"
                    >
                      <option :value="10">10</option>
                      <option :value="20">20</option>
                      <option :value="50">50</option>
                    </select>

                    <span class="fw-medium text-nowrap">
    / {{ totalElements }} khách
  </span>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <button class="btn-primary-custom btn-custom" @click="openAddCustomerModal()">
                      <i class="fas fa-plus me-2"></i> Thêm khách hàng
                    </button>
                  </div>
                </div>

                <!-- Table -->
                <div class="table-container">
                  <table class="table table-hover table-custom">
                    <thead>
                    <tr>
                      <th style="width: 10px !important; padding-left: 15px !important;">
                        <input
                            type="checkbox"
                            class="form-check-input checkbox-all"
                            :checked="isAllSelected"
                            @change="toggleSelectAll"
                        >
                      </th>
                      <th style="width: 10px !important;">#</th>
                      <th style="width: 220px!important;">Khách hàng</th>
                      <th  style="width: 130px!important;">SĐT</th>
                      <th style="width: 150px!important;">Tỉnh/TP</th>
                      <th style="width: 135px!important;">Phân loại</th>
                      <th style="width: 135px!important;">Trạng thái</th>
                      <th style="width: 120px!important;">Ngày CN</th>
                      <th style="width: 185px!important;">Người tạo</th>
                      <th style="width: 185px!important;">NVPT</th>
                      <th style="width: 120px!important;">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="(customer, index) in customers"
                        :key="customer.id"
                        class="table-row-clickable"
                        @click="openCustomerDetail(customer)"
                    >
                      <!-- Checkbox -->
                      <td style="width: 20px !important;">
                        <input
                            type="checkbox"
                            class="form-check-input customer-checkbox"
                            :checked="customer.selected"
                            @click.stop
                            @change="toggleCustomerSelection(customer.id)"
                        >
                      </td>

                      <!-- ID -->
                      <td style="width: 20px !important;">
                        <span class="badge bg-light text-dark">{{ customer.index }}</span>
                      </td>

                      <!-- Khách hàng -->
                      <td style="width: 220px!important;">
                        <div class="d-flex align-items-center">
                          <img
                              :src="customer.avatarKhach || generateAvatarFromName(customer.hoTen)"
                              :alt="customer.hoTen"
                              class="customer-avatar me-3"
                          />
                          <div>
                            <div class="fw-semibold">{{ shortenName( customer.hoTen, 15 )}}</div>
                            <small class="text-muted">{{ customer.ngayTao }}</small>
                          </div>
                        </div>
                      </td>

                      <!-- SĐT -->
                      <td class="fw-medium">
                        {{ formatPhoneNumber(customer.soDienThoai) }}
                      </td>

                      <!-- Tỉnh / TP -->
                      <td>
                        {{ getProvinceShortLabel(customer.tinhThanhPho) }}
                      </td>

                      <!-- Phân loại -->
                      <td>
    <span :class="`type-badge type-${customer.phanLoaiKhach}`">
      {{ getTypeLabel(customer.phanLoaiKhach) }}
    </span>
                      </td>

                      <!-- Trạng thái -->
                      <td>
    <span :class="`status-badge status-${customer.trangThai}`">
      {{ getStatusLabel(customer.trangThai) }}
    </span>
                      </td>

                      <!-- Ngày cập nhật -->
                      <td style="width: 120px!important;">
                          <span
                              class="badge bg-light text-dark"
                              style="font-size: 14px !important; font-weight: 500 !important;"
                          >
                            {{ customer.ngayCapNhat || 'Chưa có' }}
                          </span>
                      </td>

                      <!-- Người tạo -->
                      <td style="width: 170px!important;">
                        <div
                            class="d-flex align-items-center gap-2"
                            v-if="customer.nhanVienTaoTen"
                        >
                          <img
                              :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'+ customer.nhanVienTaoAvatar"
                              :alt="customer.nhanVienTaoTen"
                              class="member-avatar"
                          >
                          <span class="fw-medium">{{ shortenName(customer.nhanVienTaoTen,15) }}</span>
                        </div>
                        <span v-else class="text-muted">-</span>
                      </td>

                      <!-- NV phụ trách -->
                      <td style="width: 170px!important;">
                        <div
                            class="d-flex align-items-center gap-2"
                            v-if="customer.nhanVienPhuTrachTen"
                        >
                          <img
                              :src=" 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'+ customer.nhanVienPhuTrachAvatar"
                              :alt="customer.nhanVienPhuTrachTen"
                              class="member-avatar"
                          >
                          <span class="fw-medium">{{ shortenName(customer.nhanVienPhuTrachTen,15) }}</span>
                        </div>
                        <span v-else class="text-muted">-</span>
                      </td>

                      <!-- Thao tác -->
                      <td>
                        <div class="action-buttons">
                          <button
                              class="action-btn call-btn"
                              @click.stop="editCustomer(customer)"
                              title="Sửa"
                              style="background: var(--success-gradient);"
                          >
                            <i class="fas fa-edit"></i>
                          </button>
                          <button
                              class="action-btn delete-btn"
                              @click.stop="showDeleteConfirm(customer)"
                              title="Xóa"
                              style="background: var(--danger-gradient);"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="customers.length === 0">
                      <td colspan="12" class="text-center py-5">
                        <div class="mb-3"><i class="fas fa-users fa-3x gradient-text"></i></div>
                        <h5 class="text-muted mb-2">Không tìm thấy khách hàng nào</h5>
                        <p class="text-muted mb-0">Hãy thử thay đổi bộ lọc hoặc thêm khách hàng mới</p>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination -->
                <nav class="mt-4" v-if="totalPages > 1">
                  <ul class="pagination pagination-custom justify-content-center">

                    <!-- Prev -->
                    <li class="page-item" :class="{ disabled: page === 0 }">
                      <a class="page-link" href="#" @click.prevent="prevPage">
                        <i class="fas fa-chevron-left"></i>
                      </a>
                    </li>

                    <!-- First page -->
                    <li
                        class="page-item"
                        v-if="visiblePages[0] > 0"
                        @click.prevent="goToPage(0)"
                    >
                      <a class="page-link" href="#">1</a>
                    </li>

                    <!-- Dots -->
                    <li class="page-item disabled" v-if="visiblePages[0] > 1">
                      <span class="page-link">…</span>
                    </li>

                    <!-- Pages -->
                    <li
                        v-for="p in visiblePages"
                        :key="p"
                        class="page-item"
                        :class="{ active: p === page }"
                    >
                      <a class="page-link" href="#" @click.prevent="goToPage(p)">
                        {{ p + 1 }}
                      </a>
                    </li>

                    <!-- Dots -->
                    <li
                        class="page-item disabled"
                        v-if="visiblePages[visiblePages.length - 1] < totalPages - 2"
                    >
                      <span class="page-link">…</span>
                    </li>

                    <!-- Last page -->
                    <li
                        class="page-item"
                        v-if="visiblePages[visiblePages.length - 1] < totalPages - 1"
                        @click.prevent="goToPage(totalPages - 1)"
                    >
                      <a class="page-link" href="#">{{ totalPages }}</a>
                    </li>

                    <!-- Next -->
                    <li
                        class="page-item"
                        :class="{ disabled: page === totalPages - 1 }"
                    >
                      <a class="page-link" href="#" @click.prevent="nextPage">
                        <i class="fas fa-chevron-right"></i>
                      </a>
                    </li>

                  </ul>
                </nav>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modals -->
    <div v-if="isAnyModalOpen" class="modal-backdrop-custom"></div>
    <!-- Add Customer Modal -->
    <div v-if="showAddCustomerModal" class="modal fade modal-custom show" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-user-plus me-2"></i>
              Thêm khách hàng mới
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeAddCustomerModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCustomer">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="customerName" class="form-label fw-medium">Họ và tên <span class="text-danger">*</span></label>
                  <input type="text" class="form-control form-control-custom" v-model="customerForm.name" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="customerPhone" class="form-label fw-medium">Số điện thoại <span class="text-danger">*</span></label>
                  <input type="tel" class="form-control form-control-custom" v-model="customerForm.phone" required>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="customerProvince" class="form-label fw-medium">Tỉnh/Thành phố <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    class="form-control form-control-custom"
                    list="province-options"
                    v-model="customerForm.province"
                    placeholder="Chọn tỉnh/thành phố"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="customerOldProvince" class="form-label fw-medium">Tỉnh cũ (nếu có)</label>
                  <input
                    type="text"
                    class="form-control form-control-custom"
                    list="province-options"
                    v-model="customerForm.oldProvince"
                    placeholder="Chọn tỉnh/thành phố"
                  >
                  <datalist id="province-options">
                    <option v-for="province in provinceOptions" :key="province" :value="province"></option>
                  </datalist>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="customerType" class="form-label fw-medium">Phân loại khách hàng <span class="text-danger">*</span></label>
                  <select class="form-select form-select-custom" v-model="customerForm.type" required>
                    <option value="">Chọn phân loại</option>
                    <option value="MOI_GIOI">Môi giới</option>
                    <option value="CHINH_CHU">Chủ nhà</option>
                    <option value="NGUOI_THAN">Người thân</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="customerStatus" class="form-label fw-medium">Trạng thái <span class="text-danger">*</span></label>
                  <select class="form-select form-select-custom" v-model="customerForm.status" required>
                    <option value="new">Mới tiếp nhận</option>
                    <option value="potential_7">Tiềm năng 7 ngày</option>
                    <option value="potential_14">Tiềm năng 14 ngày</option>
                    <option value="success">Thành công (đặt lịch)</option>
                    <option value="wrong_number">Sai số</option>
                    <option value="unreachable">Không liên lạc được</option>
                    <option value="care">Chăm sóc</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label for="customerAvatar" class="form-label fw-medium">Ảnh đại diện (URL)</label>
                <input type="text" class="form-control form-control-custom" v-model="customerForm.avatar" placeholder="https://example.com/avatar.jpg">
                <small class="text-muted">Để trống để sử dụng ảnh mặc định</small>
              </div>

              <input type="hidden" v-model="customerForm.id" />
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-custom btn-custom" @click="closeAddCustomerModal">Hủy</button>
            <button type="button" class="btn btn-primary-custom btn-custom" @click="saveCustomer">
              <i class="fas fa-save me-2"></i> Lưu khách hàng
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Customer Modal -->
    <div v-if="showEditCustomerModal" class="modal fade modal-custom show" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-user-edit me-2"></i>
              Chỉnh sửa khách hàng
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeEditCustomerModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCustomer">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Họ và tên <span class="text-danger">*</span></label>
                  <input type="text" class="form-control form-control-custom" v-model="customerForm.name" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Số điện thoại <span class="text-danger">*</span></label>
                  <input type="tel" class="form-control form-control-custom" v-model="customerForm.phone" required>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Tỉnh/Thành phố <span class="text-danger">*</span></label>
                  <input
                    type="text"
                    class="form-control form-control-custom"
                    list="province-options"
                    v-model="customerForm.province"
                    placeholder="Chọn tỉnh/thành phố"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Tỉnh cũ (nếu có)</label>
                  <input
                    type="text"
                    class="form-control form-control-custom"
                    list="province-options"
                    v-model="customerForm.oldProvince"
                    placeholder="Chọn tỉnh/thành phố"
                  >
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Phân loại khách hàng <span class="text-danger">*</span></label>
                  <select class="form-select form-select-custom" v-model="customerForm.type" required>
                    <option value="">Chọn phân loại</option>
                    <option value="broker">Môi giới</option>
                    <option value="owner">Chủ nhà</option>
                    <option value="relative">Người thân</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label fw-medium">Trạng thái <span class="text-danger">*</span></label>
                  <select class="form-select form-select-custom" v-model="customerForm.status" required>
                    <option value="new">Mới tiếp nhận</option>
                    <option value="potential_7">Tiềm năng 7 ngày</option>
                    <option value="potential_14">Tiềm năng 14 ngày</option>
                    <option value="success">Thành công (đặt lịch)</option>
                    <option value="wrong_number">Sai số</option>
                    <option value="unreachable">Không liên lạc được</option>
                    <option value="care">Chăm sóc</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-medium">Ảnh đại diện (URL)</label>
                <input type="text" class="form-control form-control-custom" v-model="customerForm.avatar" placeholder="https://example.com/avatar.jpg">
                <small class="text-muted">Để trống để sử dụng ảnh mặc định</small>
              </div>

              <input type="hidden" v-model="customerForm.id" />
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-custom btn-custom" @click="closeEditCustomerModal">Hủy</button>
            <button type="button" class="btn btn-primary-custom btn-custom" @click="saveCustomer">
              <i class="fas fa-save me-2"></i> Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Detail Modal -->
    <div v-if="showDetailModal" class="modal fade modal-custom show" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-address-card me-2"></i>
              Chi tiết khách hàng
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeDetailModal"></button>
          </div>
          <div class="modal-body" v-if="selectedCustomer">
            <div class="d-flex align-items-center gap-3 mb-4">
              <img :src="selectedCustomer.avatar" :alt="selectedCustomer.name" class="customer-avatar-lg">
              <div>
                <h4 class="mb-1">{{ selectedCustomer.name }}</h4>
                <div class="text-muted">SĐT: {{ selectedCustomer.phone }}</div>
                <div class="text-muted">Ngày tạo: {{ selectedCustomer.createdAt }}</div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <div class="detail-label">Tỉnh/TP</div>
                <div class="detail-value">{{selectedCustomer.province }}</div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="detail-label">Tỉnh cũ</div>
                <div class="detail-value">{{ selectedCustomer.oldProvince || '-' }}</div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="detail-label">Phân loại</div>
                <div class="detail-value">{{ getTypeLabel(selectedCustomer.type) }}</div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="detail-label">Trạng thái</div>
                <div class="detail-value">{{ getStatusLabel(selectedCustomer.status) }}</div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="detail-label">Ngày cập nhật</div>
                <div class="detail-value">{{ selectedCustomer.lastUpdated }}</div>
              </div>
              <div class="col-md-6 mb-3">
                <div class="detail-label">Người tạo</div>
                <div class="detail-value">
                  {{ getCreatorInfo(selectedCustomer.creatorId)?.name || '-' }}
                </div>
              </div>
              <div class="col-md-12 mb-2">
                <div class="detail-label">Ghi chú</div>
                <div class="detail-value">{{ selectedCustomer.notes || '-' }}</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-custom btn-custom" @click="closeDetailModal">Đóng</button>
            <button type="button" class="btn btn-primary-custom btn-custom" @click="openEditFromDetail">
              <i class="fas fa-edit me-2"></i> Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Data Modal -->
    <div v-if="showAssignDataModal" class="modal fade modal-custom assign-data-modal show" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fas fa-user-tag me-2"></i> Cấp dữ liệu cho Telesale</h5>
            <button type="button" class="btn-close btn-close-white" @click="closeAssignDataModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-4">
              <h6 class="fw-medium mb-3">Chọn nhân viên Telesale</h6>
              <div class="staff-grid">
                <div
                    v-for="staff in staffMembers"
                    :key="staff.id"
                    class="staff-card"
                    :class="{ selected: staff.selected }"
                    @click="toggleStaffSelection(staff)"
                >
                  <img :src="staff.avatar" :alt="staff.name" class="staff-avatar">
                  <div class="staff-name">{{ staff.name }}</div>
                  <div class="staff-role">{{ staff.role }}</div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="dataQuantity" class="form-label fw-medium">Số lượng dữ liệu cấp</label>
                <input type="number" class="form-control form-control-custom" v-model="assignData.quantity" min="1" max="1000">
                <small class="text-muted">Số khách hàng sẽ được cấp (1-1000)</small>
              </div>
              <div class="col-md-6 mb-3">
                <label for="dataType" class="form-label fw-medium">Loại dữ liệu</label>
                <select class="form-select form-select-custom" v-model="assignData.type">
                  <option value="new">Khách hàng mới</option>
                  <option value="potential">Khách tiềm năng</option>
                  <option value="all">Tất cả loại khách</option>
                  <option value="by_province">Theo tỉnh thành</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label for="assignNotes" class="form-label fw-medium">Ghi chú phân công</label>
              <textarea class="form-control form-control-custom" v-model="assignData.notes" rows="2" placeholder="Ghi chú về việc phân công dữ liệu..."></textarea>
            </div>

            <div class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>
              <span>{{ assignSummary }}</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-custom btn-custom" @click="closeAssignDataModal">Hủy</button>
            <button type="button" class="btn btn-primary-custom btn-custom" @click="confirmAssignData">
              <i class="fas fa-check me-2"></i> Xác nhận cấp dữ liệu
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="showConfirmDeleteModal" class="modal fade modal-custom show" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fas fa-exclamation-triangle me-2"></i> Xác nhận xóa</h5>
            <button type="button" class="btn-close btn-close-white" @click="closeConfirmDeleteModal"></button>
          </div>
          <div class="modal-body">
            <div class="text-center mb-4">
              <div class="mb-3">
                <i class="fas fa-trash-alt fa-3x text-danger"></i>
              </div>
              <h4 class="fw-bold">Bạn có chắc chắn muốn xóa khách hàng "{{ deletingCustomer?.name }}" ?</h4>
              <p class="text-muted">Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.</p>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-outline-custom btn-custom" @click="closeConfirmDeleteModal">Hủy</button>
            <button type="button" class="btn btn-danger-custom btn-custom" @click="confirmDelete">
              <i class="fas fa-trash me-2"></i> Xác nhận xóa
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      <div class="d-flex align-items-start">
        <i :class="`fas fa-${notification.icon} me-2 mt-1`"></i>
        <span>{{ notification.message }}</span>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, nextTick, watch } from 'vue'
import Chart from 'chart.js/auto'
import addressData from '/src/assets/js/address.json'

// State management
const customers = ref([])
const totalElements = ref(0)
const totalPages = ref(0)
const loading = ref(false)

const staffMembers = ref([
  { id: 1, name: "Nguyễn Văn A", role: "Telesale Manager", avatar: "https://randomuser.me/api/portraits/men/1.jpg", selected: false },
  { id: 2, name: "Trần Thị B", role: "Senior Telesale", avatar: "https://randomuser.me/api/portraits/women/2.jpg", selected: false },
  { id: 3, name: "Lê Văn C", role: "Telesale Executive", avatar: "https://randomuser.me/api/portraits/men/3.jpg", selected: false },
  { id: 4, name: "Phạm Thị D", role: "Junior Telesale", avatar: "https://randomuser.me/api/portraits/women/4.jpg", selected: false },
  { id: 5, name: "Hoàng Văn E", role: "Telesale Team Lead", avatar: "https://randomuser.me/api/portraits/men/5.jpg", selected: false },
  { id: 6, name: "Vũ Thị F", role: "Telesale Specialist", avatar: "https://randomuser.me/api/portraits/women/6.jpg", selected: false },
  { id: 7, name: "Đặng Văn G", role: "Senior Telesale", avatar: "https://randomuser.me/api/portraits/men/7.jpg", selected: false },
  { id: 8, name: "Bùi Thị H", role: "Telesale Executive", avatar: "https://randomuser.me/api/portraits/women/8.jpg", selected: false }
])

const creatorOptions = ref([
  { id: 1, name: "Trần Minh Anh", avatar: "https://randomuser.me/api/portraits/women/11.jpg" },
  { id: 2, name: "Phạm Quốc Huy", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
  { id: 3, name: "Nguyễn Thảo My", avatar: "https://randomuser.me/api/portraits/women/13.jpg" },
  { id: 4, name: "Lê Hoàng Nam", avatar: "https://randomuser.me/api/portraits/men/14.jpg" }
])

// UI state
const mobileMenuOpen = ref(false)
const notificationsOpen = ref(false)
const userMenuOpen = ref(false)
const activeTab = ref('all')
const chartYear = ref('2024')
const searchText = ref('')

// Modal states
const showAddCustomerModal = ref(false)
const showAssignDataModal = ref(false)
const showCallModal = ref(false)
const showConfirmDeleteModal = ref(false)
const showEditCustomerModal = ref(false)
const showDetailModal = ref(false)
const isAnyModalOpen = computed(() =>
  showAddCustomerModal.value ||
  showEditCustomerModal.value ||
  showDetailModal.value ||
  showAssignDataModal.value ||
  showConfirmDeleteModal.value
)

// Data state
const filters = reactive({
  type: 'all',
  status: 'all',
  province: '',
  creator: 'all',
  createdFrom: '',
  createdTo: '',
  updatedFrom: '',
  updatedTo: ''
})

const customerForm = reactive({
  id: null,
  name: '',
  phone: '',
  province: '',
  oldProvince: '',
  type: '',
  status: 'new',
  avatar: '',
  notes: ''
})

const assignData = reactive({
  quantity: 50,
  type: 'new',
  notes: ''
})

const callingCustomer = ref(null)
const deletingCustomer = ref(null)
const callSeconds = ref(0)
const callNotes = ref('')
const isEditing = ref(false)
const selectedCustomer = ref(null)

const notification = reactive({
  show: false,
  message: '',
  type: 'info',
  icon: 'info-circle'
})

// Refs
const monthlyChart = ref(null)
const statusChart = ref(null)

// Computed properties
const filterTabs = computed(() => [
  { value: 'all', label: 'Tất cả' },
  { value: 'new', label: 'Mới' },
  { value: 'contacted', label: 'Đã dùng' }
])


const selectedCount = computed(() => {
  return customers.value.filter(c => c.selected).length
})

const isAllSelected = computed(() => {
  return selectedCount.value === customers.value.length && customers.value.length > 0
})

const callTimer = computed(() => {
  const minutes = Math.floor(callSeconds.value / 60).toString().padStart(2, '0')
  const seconds = (callSeconds.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const assignSummary = computed(() => {
  const selectedStaff = staffMembers.value.filter(s => s.selected)
  if (selectedStaff.length === 0) return 'Chưa có nhân viên nào được chọn'

  let typeText = ''
  switch (assignData.type) {
    case 'new': typeText = 'khách hàng mới'; break
    case 'potential': typeText = 'khách tiềm năng'; break
    case 'all': typeText = 'tất cả loại khách'; break
    case 'by_province': typeText = 'theo tỉnh thành'; break
  }

  const staffNames = selectedStaff.map(s => s.name).join(', ')
  return `Sẽ cấp ${assignData.quantity} ${typeText} cho ${selectedStaff.length} nhân viên: ${staffNames}`
})

const provinceOptions = computed(() => {
  const provinceNames = addressData.map(province => province.name)
  return [...provinceNames, 'Khác']
})

const creatorsById = computed(() => {
  return creatorOptions.value.reduce((acc, creator) => {
    acc[creator.id] = creator
    return acc
  }, {})
})

const staffById = computed(() => {
  return staffMembers.value.reduce((acc, staff) => {
    acc[staff.id] = staff
    return acc
  }, {})
})

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value
  userMenuOpen.value = false
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
  notificationsOpen.value = false
}

const setActiveTab = (tab) => {
  activeTab.value = tab
  applyFilters()
}

const applyFilters = () => {
  // Filters are automatically applied through computed property
}

const resetFilters = () => {
  activeTab.value = 'all'
  filters.type = 'all'
  filters.status = 'all'
  filters.province = ''
  filters.creator = 'all'
  filters.createdFrom = ''
  filters.createdTo = ''
  filters.updatedFrom = ''
  filters.updatedTo = ''
  searchText.value = ''
  showNotification('Đã đặt lại tất cả bộ lọc', 'info')
}

const openAddCustomerModal = () => {
  resetCustomerForm()
  isEditing.value = false
  showAddCustomerModal.value = true
}

const closeAddCustomerModal = () => {
  showAddCustomerModal.value = false
}

const editCustomer = (customer) => {
  console.log('Hàm chạy được')
  Object.assign(customerForm, {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    province: customer.province,
    oldProvince: customer.oldProvince || '',
    type: customer.type,
    status: customer.status,
    avatar: customer.avatar || '',
    notes: customer.notes || ''
  })
  isEditing.value = true
  showEditCustomerModal.value = true
}

const closeEditCustomerModal = () => {
  showEditCustomerModal.value = false
  isEditing.value = false
}

const resetCustomerForm = () => {
  Object.assign(customerForm, {
    id: null,
    name: '',
    phone: '',
    province: '',
    oldProvince: '',
    type: '',
    status: 'new',
    avatar: '',
    notes: ''
  })
}

const saveCustomer = () => {
  if (!customerForm.name || !customerForm.phone || !customerForm.province || !customerForm.type || !customerForm.status) {
    showNotification('Vui lòng điền đầy đủ các trường bắt buộc!', 'warning')
    return
  }

  if (isEditing.value && customerForm.id) {
    const index = customers.value.findIndex(c => c.id === customerForm.id)
    if (index !== -1) {
      customers.value[index] = {
        ...customers.value[index],
        ...customerForm,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
      showNotification('Cập nhật khách hàng thành công!', 'success')
    }
  } else {
    const newId = customers.value.length > 0
        ? Math.max(...customers.value.map(c => c.id)) + 1
        : 1

    customers.value.push({
      id: newId,
      name: customerForm.name,
      phone: customerForm.phone,
      province: customerForm.province,
      oldProvince: customerForm.oldProvince || null,
      avatar: customerForm.avatar || `https://randomuser.me/api/portraits/${customerForm.type === 'owner' || customerForm.type === 'broker' ? 'men' : 'women'}/${Math.floor(Math.random() * 70) + 1}.jpg`,
      type: customerForm.type,
      status: customerForm.status,
      notes: customerForm.notes || '',
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      creatorId: creatorOptions.value[0]?.id ?? null,
      assigneeId: staffMembers.value[0]?.id ?? null,
      selected: false
    })
    showNotification('Thêm khách hàng mới thành công!', 'success')
  }

  showAddCustomerModal.value = false
  showEditCustomerModal.value = false
  isEditing.value = false
  resetCustomerForm()
}

const startCall = (customer) => {
  callingCustomer.value = customer
  callSeconds.value = 0
  callNotes.value = ''
  showCallModal.value = true

  // Start timer
  const timer = setInterval(() => {
    if (showCallModal.value) {
      callSeconds.value++
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

const endCall = () => {
  showCallModal.value = false
  callingCustomer.value = null
  callSeconds.value = 0

  if (callNotes.value.trim()) {
    showNotification('Cuộc gọi đã kết thúc. Ghi chú đã được lưu.', 'success')
  }
}

const saveCallResult = (result) => {
  if (!callingCustomer.value) return

  const customer = customers.value.find(c => c.id === callingCustomer.value.id)
  if (!customer) return

  let newStatus = customer.status
  let resultText = ''

  switch (result) {
    case 'success': newStatus = 'success'; resultText = 'Đã đặt lịch thành công'; break
    case 'potential': newStatus = 'potential_7'; resultText = 'Khách hàng tiềm năng'; break
    case 'failed': newStatus = 'unreachable'; resultText = 'Không liên lạc được'; break
    case 'callback': newStatus = 'care'; resultText = 'Cần gọi lại'; break
  }

  customer.status = newStatus
  customer.lastUpdated = new Date().toISOString().split('T')[0]

  const autoNote = `[${new Date().toLocaleDateString('vi-VN')}] Kết quả: ${resultText}`
  customer.notes = customer.notes
      ? `${customer.notes}\n${autoNote}\n${callNotes.value}`
      : `${autoNote}\n${callNotes.value}`

  showNotification(`Đã cập nhật trạng thái khách hàng thành: ${getStatusLabel(newStatus)}`, 'success')
  showCallModal.value = false
}

const showDeleteConfirm = (customer) => {
  deletingCustomer.value = customer
  showConfirmDeleteModal.value = true
}

const closeConfirmDeleteModal = () => {
  showConfirmDeleteModal.value = false
}

const confirmDelete = () => {
  if (deletingCustomer.value) {
    customers.value = customers.value.filter(c => c.id !== deletingCustomer.value.id)
    showNotification(`Đã xóa khách hàng "${deletingCustomer.value.name}" thành công!`, 'success')
    showConfirmDeleteModal.value = false
  }
}

const toggleCustomerSelection = (id) => {
  const customer = customers.value.find(c => c.id === id)
  if (customer) {
    customer.selected = !customer.selected
  }
}

const toggleSelectAll = (event) => {
  const checked = event.target.checked
  customers.value.forEach(customer => {
    customer.selected = checked
  })
}

const clearSelection = () => {
  customers.value.forEach(c => c.selected = false)
}

const bulkDelete = () => {
  const selectedCustomers = customers.value.filter(c => c.selected)
  if (selectedCustomers.length > 0) {
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedCustomers.length} khách hàng đã chọn?`)) {
      customers.value = customers.value.filter(c => !c.selected)
      showNotification(`Đã xóa ${selectedCustomers.length} khách hàng thành công!`, 'success')
    }
  }
}

const openAssignDataModal = () => {
  showAssignDataModal.value = true
}

const closeAssignDataModal = () => {
  showAssignDataModal.value = false
}

const toggleStaffSelection = (staff) => {
  staff.selected = !staff.selected
}

const confirmAssignData = () => {
  const selectedStaff = staffMembers.value.filter(s => s.selected)
  if (selectedStaff.length === 0) {
    showNotification('Vui lòng chọn ít nhất một nhân viên!', 'warning')
    return
  }
  if (assignData.quantity < 1 || assignData.quantity > 1000) {
    showNotification('Số lượng dữ liệu phải từ 1 đến 1000!', 'warning')
    return
  }

  const dataPerStaff = Math.floor(assignData.quantity / selectedStaff.length)
  const remainder = assignData.quantity % selectedStaff.length

  let resultMessage = `Đã cấp ${assignData.quantity} dữ liệu ${assignData.type} cho ${selectedStaff.length} nhân viên:\n`
  selectedStaff.forEach((staff, index) => {
    let staffQuantity = dataPerStaff
    if (index < remainder) staffQuantity++
    resultMessage += `- ${staff.name}: ${staffQuantity} khách\n`
  })
  if (assignData.notes) resultMessage += `\nGhi chú: ${assignData.notes}`

  showNotification(resultMessage, 'success')

  // Reset staff selection
  staffMembers.value.forEach(s => s.selected = false)
  assignData.quantity = 50
  assignData.type = 'new'
  assignData.notes = ''
  showAssignDataModal.value = false
}

const exportExcel = () => {
  showNotification('Xuất dữ liệu ra Excel thành công!', 'success')
}

const exportPDF = () => {
  showNotification('Xuất dữ liệu ra PDF thành công!', 'success')
}

const showNotification = (message, type = 'info') => {
  notification.message = message
  notification.type = type
  notification.icon = type === 'success' ? 'check-circle' :
      type === 'warning' ? 'exclamation-triangle' : 'info-circle'
  notification.show = true

  setTimeout(() => {
    notification.show = false
  }, 5000)
}

// Helper functions
const toDate = (value) => {
  if (!value) return new Date(0)
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const getStatusLabel = (status) => {
  const statusMap = {
      'NEW': 'Mới',
    'TN_7NGAY': 'TN 7 ngày',
    'TN_14NGAY': 'TN 14 ngày',
    'THANH_CONG': 'Thành công',
    'SAI_SO': 'Sai số',
    'KHONG_LIEN_LAC_DUOC': 'KLLD',
    'CHAM_SOC': 'Chăm sóc',
    'DC_TELESALES': 'Chưa gọi',
    'THAT_BAI': 'Thất bại'
  }
  return statusMap[status] || status
}

const getTypeLabel = (type) => {
  const typeMap = { 'MOI_GIOI': 'Môi giới', 'CHINH_CHU': 'Chủ nhà', 'NGUOI_THAN': 'Người thân' }
  return typeMap[type] || type
}

const getProvinceLabel = (province) => {
  if (!province) return '-'
  if (province === 'Khác' || province === 'other') return 'Khác'
  const provinceMatch = addressData.find(item => item.name === province)
  if (provinceMatch) return provinceMatch.name
  const legacyMap = {
    'hanoi': 'Thành phố Hà Nội',
    'hcm': 'Thành phố Hồ Chí Minh',
    'danang': 'Thành phố Đà Nẵng',
    'haiphong': 'Thành phố Hải Phòng',
    'cantho': 'Thành phố Cần Thơ'
  }
  return legacyMap[province] || province
}

const formatPhoneNumber = (phone) => {
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
}

const openCustomerDetail = async (customer) => {
  await fetchCustomerDetail(customer.id);
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedCustomer.value = null
}

const openEditFromDetail = () => {
  console.log("hzm")
  if (!selectedCustomer.value) return
  editCustomer(selectedCustomer.value)
  showDetailModal.value = false
}

const getCreatorInfo = (creatorId) => {
  return creatorsById.value[creatorId] || null
}

const getAssigneeInfo = (assigneeId) => {
  return staffById.value[assigneeId] || null
}

const getProvinceShortLabel = (province) => {
  const label = getProvinceLabel(province)

  if (!label || label === '-' || label === 'Khác') return label

  return label
      .replace(/^Thành phố\s+/i, 'TP. ')
      .replace(/^Tỉnh\s+/i, 'T. ')
}

// Initialize charts
const initCharts = () => {
  // Monthly Chart
  const monthlyCtx = monthlyChart.value?.getContext('2d')
  if (monthlyCtx) {
    new Chart(monthlyCtx, {
      type: 'line',
      data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
          { label: 'Thành công', data: [65, 59, 80, 81, 56, 55, 70, 75, 82, 78, 85, 90], borderColor: '#43e97b', backgroundColor: 'rgba(67, 233, 123, 0.1)', tension: 0.2, fill: true, borderWidth: 3 },
          { label: 'Tiềm năng', data: [28, 48, 40, 19, 86, 27, 35, 42, 50, 45, 60, 55], borderColor: '#fa709a', backgroundColor: 'rgba(250, 112, 154, 0.1)', tension: 0.2, fill: true, borderWidth: 3 },
          { label: 'Không liên lạc', data: [18, 25, 22, 15, 30, 20, 18, 22, 25, 20, 28, 30], borderColor: '#ff5858', backgroundColor: 'rgba(255, 88, 88, 0.1)', tension: 0.2, fill: true, borderWidth: 3 },
          { label: 'Tổng cuộc gọi', data: [120, 140, 150, 130, 180, 110, 130, 145, 165, 150, 185, 190], borderColor: '#667eea', backgroundColor: 'rgba(102, 126, 234, 0.1)', tension: 0.2, fill: true, borderWidth: 3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { font: { family: 'Poppins', size: 14  }, padding: 20, usePointStyle: true } },
          tooltip: { backgroundColor: 'rgba(255, 255, 255, 0.9)', titleColor: '#333', bodyColor: '#666', borderColor: '#667eea', borderWidth: 1, cornerRadius: 10, padding: 12 }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { font: { family: 'Inter' } } },
          x: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { font: { family: 'Inter' } } }
        }
      }
    })
  }

  // Status Chart
  const statusCtx = statusChart.value?.getContext('2d')
  if (statusCtx) {
    const statusData = [156, 85, 42, 78, 24, 65, 120]
    new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: ['Thành công', 'Tiềm năng 7 ngày', 'Tiềm năng 14 ngày', 'Không liên lạc', 'Sai số', 'Chăm sóc', 'Mới'],
        datasets: [{
          data: statusData,
          backgroundColor: ['#43e97b', '#fa709a', '#f09819', '#ff5858', '#8E2DE2', '#FF5ACD', '#4facfe'],
          borderWidth: 0,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Inter', size: 14 }, padding: 15 } },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || ''
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return `${label}: ${value} (${percentage}%)`
              }
            }
          }
        },
        cutout: '75%'
      }
    })
  }
}

const fetchTeleSales = async () => {
  try {
    const res = await api.get('/customer-crm/admin/telesales')
    telesalesOptions.value = res.data
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  await fetchTeleSales()
  await fetchCustomers()
  initCharts()
})


watch(activeTab, (tab) => {
  if (tab !== 'contacted') {
    filters.status = 'all'
  }
})
watch(searchText, () => {
  page.value = 0
  fetchCustomers()
})
watch(
    () => ({ ...filters }),
    () => {
      page.value = 0
      fetchCustomers()
    },
    { deep: true }
)
const page = ref(0)
const pageSize = ref(10)
watch(activeTab, (tab) => {
  if (tab !== 'contacted') {
    filters.status = 'all'
  }
  fetchCustomers()
})
watch(page, () => {
  fetchCustomers()
})

import api from '/src/api/api.js'
import {generateAvatarFromName, shortenName} from "../../assets/js/global.js";
const telesalesOptions = ref([])


const buildFilterPayload = () => ({
  search: searchText.value || null,

  phanLoaiKhach: filters.type !== 'all' ? filters.type : null,
  trangThai: filters.status !== 'all' ? filters.status : null,
  tinhThanhPho: filters.province || null,
  nguoiTaoId: filters.creator !== 'all' ? filters.creator : null,

  ngayTaoTu: filters.createdFrom || null,
  ngayTaoDen: filters.createdTo || null,
  ngayCapNhatTu: filters.updatedFrom || null,
  ngayCapNhatDen: filters.updatedTo || null,

  page: page.value,
  size: pageSize.value
})

const fetchCustomers = async () => {
  loading.value = true
  try {
    const res = await api.post(
        '/customer-crm/admin/filter',
        buildFilterPayload()
    )

    customers.value = res.data.content
    totalElements.value = res.data.page.totalElements
    totalPages.value = res.data.page.totalPages
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
const visiblePages = computed(() => {
  const maxVisible = 5
  if (totalPages.value === 0) return []

  let start = Math.max(0, page.value - Math.floor(maxVisible / 2))
  let end = start + maxVisible

  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(0, end - maxVisible)
  }

  const pages = []
  for (let i = start; i < end; i++) {
    pages.push(i)
  }
  return pages
})
const goToPage = (p) => {
  if (p < 0 || p >= totalPages.value || p === page.value) return
  page.value = p
}

const prevPage = () => {
  if (page.value > 0) page.value--
}

const nextPage = () => {
  if (page.value < totalPages.value - 1) page.value++
}
watch(pageSize, () => {
  page.value = 0
  fetchCustomers()
})
async function fetchCustomerDetail(customerId) {
  if (!customerId) return

  try {
    const res = await api.get(`/customer-crm/admin/host-temp/${customerId}`)
    selectedCustomer.value = res.data
    console.log("selectedCustomer", selectedCustomer.value)
    showDetailModal.value = true
  } catch (e) {
    console.error(e)
  }
}

</script>

<style scoped>
body {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --success-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  --warning-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  --danger-gradient: linear-gradient(135deg, #ff5858 0%, #f09819 100%);
  --info-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --dark-gradient: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  --light-gradient: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);

  --primary-color: #667eea;
  --secondary-color: #f093fb;
  --success-color: #43e97b;
  --warning-color: #fa709a;
  --danger-color: #ff5858;
  --info-color: #4facfe;
  --dark-color: #141e30;
  --light-color: #f8f9fa;

  --shadow-soft: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 8px 30px rgba(0, 0, 0, 0.12);
  --shadow-hard: 0 15px 50px rgba(0, 0, 0, 0.2);

  --border-radius-sm: 12px;
  --border-radius-md: 16px;
  --border-radius-lg: 20px;

  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;

  --nav-h: 85px;
  --shell-pad: 18px;
  --sidebar-w: 350px;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  color: #333;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

/* ✅ BODY KHÔNG SCROLL */
html, body { height: 100%; }

h1,h2,h3,h4,h5,h6 { font-family: 'Poppins', sans-serif; font-weight: 600; }

/* Custom Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
::-webkit-scrollbar-thumb { background: var(--primary-color); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); }

/* ✅ SCALE 0.8 GIỮ NGUYÊN (KHÔNG SCALE HTML) */
.app-scale {
  transform: scale(0.8);
  transform-origin: 0 0;
  width: 125%;
  height: 125%;
}

/* ✅ App layout full height, chỉ main cuộn */
.app-root {
  height: 125vh;
  display: flex;
  flex-direction: column;
}

.app-shell {
  display: flex;
  gap: var(--shell-pad);
  padding: var(--shell-pad);
  overflow: hidden;
}

/* Navbar */
.navbar-custom {
  background: var(--dark-gradient);
  backdrop-filter: blur(10px);
  padding: 15px 0;
  box-shadow: var(--shadow-medium);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 1030;
  height: var(--nav-h);
}

.navbar-custom .navbar-brand {
  font-weight: 700;
  font-size: 1.5rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1;
}

.navbar-custom .navbar-brand i {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 1.8rem;
}

.nav-link-custom {
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 500;
  padding: 8px 16px !important;
  border-radius: 10px;
  transition: var(--transition-normal);
  margin: 0 2px;
  position: relative;
  overflow: hidden;
}

.nav-link-custom:hover, .nav-link-custom.active {
  color: white !important;
  background: rgba(255, 255, 255, 0.1);
}

.nav-link-custom::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--primary-gradient);
  transition: var(--transition-normal);
}

.nav-link-custom:hover::after, .nav-link-custom.active::after { width: 80%; }

.user-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--primary-gradient);
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; color: white; font-size: 14px;
}

/* Sidebar (đứng yên) */
.sidebar-wrap {
  width: var(--sidebar-w);
  flex: 0 0 var(--sidebar-w);
  overflow: hidden;
}

.sidebar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius-lg);
  padding: 25px;
  box-shadow: 1px 0 1px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: 100%;
  overflow-y: auto;
}

.sidebar-section { margin-bottom: 30px; }

.sidebar-title {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #1e3a8a; /* chữ xanh */
  margin-bottom: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.03);
  border-radius: var(--border-radius-sm);
  padding: 5px;
  margin-bottom: 20px;
}

.filter-tab {
  flex: 1;
  padding: 10px 10px;
  border: none;
  background: transparent;
  color: #6c757d;
  font-weight: 500;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-fast);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.filter-tab.active {
  color: white;
  background: var(--primary-gradient);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.filter-tab:not(.active):hover {
  color: var(--primary-color);
  background: rgba(102, 126, 234, 0.1);
}

/* Form Controls */
.form-control-custom, .form-select-custom {
  border: 2px solid rgba(0, 0, 0, 0.08) !important; ;
  border-radius: var(--border-radius-sm) !important;
  padding: 12px 15px !important;
  font-size: 18px !important;
  transition: var(--transition-fast) !important;
  background: rgba(255, 255, 255, 0.9) !important;
}

.form-control-custom:focus, .form-select-custom:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2) !important;
  background: white !important;
}

.form-control-custom, .form-select-custom option {
  font-size: 14px !important;
}

/* ✅ MAIN WRAP đứng yên, chỉ MAIN-SCROLL cuộn */
.main-wrap {
  flex: 1 1 auto;
  overflow: hidden;
}

.main-scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
}

/* Main Content inner padding giữ nguyên kiểu cũ */
.main-content {
  min-height: 100%;
  padding: 0 20px;
}

/* Stat Cards */
.stat-card {
  border-radius: var(--border-radius-md);
  padding: 25px;
  color: white;
  margin-bottom: 25px;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-soft);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  opacity: 0.9;
  z-index: 1;
}

.stat-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(30deg);
  transition: var(--transition-normal);
  z-index: 2;
}

.stat-card:hover::after { transform: rotate(30deg) translateX(100px); }

.stat-card-content { position: relative; z-index: 3; }

.stat-card h5 {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-card .stat-number {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.stat-card .stat-change {
  font-size: 16px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-icon {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 48px;
  opacity: 0.3;
  z-index: 3;
  transition: var(--transition-normal);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
  opacity: 0.4;
}

/* Card Custom */
.card-custom {
  border-radius: var(--border-radius-lg);
  border: none;
  box-shadow: var(--shadow-soft);
  transition: all var(--transition-normal);
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-custom:hover { box-shadow: var(--shadow-medium); transform: translateY(-5px); }

.card-header-custom {
  background: var(--light-gradient);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px 25px;
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0 !important;
  font-weight: 600!important;
  display: flex;
  justify-content: space-between;
  align-items: center;
}


/* Buttons */
.btn-custom {
  border-radius: var(--border-radius-sm);
  padding: 10px 20px;
  font-weight: 500;
  transition: all var(--transition-normal);
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.btn-custom::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: var(--transition-normal);
}

.btn-custom:hover::before { left: 100%; }

.btn-primary-custom { background: var(--primary-gradient); color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }
.btn-primary-custom:hover { color: white; transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6); }
.btn-success-custom { background: var(--success-gradient); color: white; box-shadow: 0 4px 15px rgba(67, 233, 123, 0.4); }
.btn-danger-custom { background: var(--danger-gradient); color: white; box-shadow: 0 4px 15px rgba(255, 88, 88, 0.4); }
.btn-warning-custom { background: var(--warning-gradient); color: white; box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4); }
.btn-info-custom { background: var(--info-gradient); color: white; box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4); }
.btn-outline-custom { background: transparent; border: 2px solid var(--primary-color); color: var(--primary-color); }
.btn-outline-custom:hover { background: var(--primary-gradient); color: white; border-color: transparent; }

/* Table */
.table-container {
  background: white;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-soft);
}

.table-custom { margin-bottom: 0;  border-spacing: 0; border-collapse:collapse !important; background-clip: border-box !important;}
.table-custom thead {
  background: linear-gradient(180deg, #7dd3fc 0%, #38bdf8 100%) !important;
}

.table-custom thead th {
  background: linear-gradient(180deg, #7dd3fc 0%, #38bdf8 100%) !important;
  background-clip: border-box !important;
  padding: 15px 25px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  text-align: left !important;
  border-left: none !important;
  border-right: none !important;
  border-top: none !important;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05) !important;
}

.table-custom td {
  padding: 15px !important ;
  vertical-align: middle !important;
  border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
  font-size: 16px !important;
}

.table-custom tbody tr { transition: var(--transition-fast); }
.table-row-clickable { cursor: pointer; }
.table-custom tbody tr:hover { background: rgba(102, 126, 234, 0.03)!important;  }
.table-custom tbody tr:hover td {
  background: rgba(102, 126, 234, 0.06) !important;
  border: none !important;
}

.customer-avatar {
  width: 42px; height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: var(--transition-normal);
}

.customer-avatar-lg {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.detail-label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d;
  margin-bottom: 4px;
}

.detail-value {
  font-weight: 600;
  color: #1f2937;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-custom tbody tr:hover .customer-avatar {
  transform: scale(1.1) !important;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
}

/* Status Badges */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  text-align: center;
  min-width: 100px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* ===== Trạng thái mới ===== */
.status-NEW {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

/* ===== Đã cấp telesales ===== */
.status-DC_TELESALES {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* ===== Đang chăm sóc ===== */
.status-CHAM_SOC {
  background: linear-gradient(135deg, #FF5ACD 0%, #FBDA61 100%);
  color: white;
}

/* ===== Tiềm năng 7 ngày ===== */
.status-TN_7NGAY {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

/* ===== Tiềm năng 14 ngày ===== */
.status-TN_14NGAY {
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
  color: white;
}

/* ===== Thất bại / không quan tâm ===== */
.status-THAT_BAI {
  background: linear-gradient(135deg, #6a85b6 0%, #bac8e0 100%);
  color: white;
}

/* ===== Không liên lạc được ===== */
.status-KHONG_LIEN_LAC_DUOC {
  background: linear-gradient(135deg, #FF5858 0%, #F09819 100%);
  color: white;
}

/* ===== Sai số liệu ===== */
.status-SAI_SO_LIEU {
  background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
  color: white;
}

/* ===== Thành công (lên VP) ===== */
.status-THANH_CONG {
  background: linear-gradient(135deg, #3CD3AD 0%, #4CB8C4 100%);
  color: white;
}


/* Type Badges */
.type-badge {
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}
.type-MOI_GIOI { background: linear-gradient(135deg, rgba(67, 233, 123, 0.15) 0%, rgba(56, 249, 215, 0.15) 100%); color: #049a44; border: 1px solid rgba(67, 233, 123, 0.3); }
.type-CHINH_CHU { background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%); color: #062bd5; border: 1px solid rgba(102, 126, 234, 0.3); }
.type-NGUOI_THAN { background: linear-gradient(135deg, rgba(250, 112, 154, 0.15) 0%, rgba(254, 225, 64, 0.15) 100%); color: #da0344; border: 1px solid rgba(250, 112, 154, 0.3); }

/* Action Buttons */
.action-buttons { display: flex; gap: 6px; }
.action-btn {
  width: 34px; height: 34px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  border: none;
  transition: all var(--transition-fast);
  color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}
.action-btn:hover { transform: translateY(-2px) scale(1.1); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); }

/* Charts */
.chart-container { position: relative; height: 320px; width: 100%; padding: 15px; }
.chart-center-text {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}
.chart-center-text .total-number {
  font-size: 28px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 5px;
}
.chart-center-text .total-label { font-size: 12px; color: #6c757d; font-weight: 500; }

/* Bulk Actions */
.bulk-actions {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: var(--border-radius-md);
  margin-bottom: 25px;
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: none;
  align-items: center;
  gap: 15px;
  animation: slideInDown 0.5s ease;
}
.bulk-actions.show { display: flex; }

/* Progress */
.progress-custom {
  height: 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
}
.progress-custom .progress-bar {
  border-radius: 10px;
  transition: width 1s ease-in-out;
  position: relative;
  overflow: hidden;
}
.progress-custom .progress-bar::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 2s infinite;
}
@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

/* Search Box */
.search-box { position: relative; }
.search-box input {
  padding-left: 45px;
  border-radius: var(--border-radius-sm);
  border: 2px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.9);
  transition: var(--transition-fast);
}
.search-box input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  background: white;
}
.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  z-index: 10;
}

/* Pagination */
.pagination-custom .page-link {
  border: none;
  margin: 0 10px;
  border-radius: 10px;
  color: #6c757d;
  font-weight: 500;
  transition: var(--transition-fast);
  padding: 8px 15px;
}
.pagination-custom .page-item.active .page-link {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
}
.pagination-custom .page-link:hover:not(.active) { background: rgba(102, 126, 234, 0.1); color: var(--primary-color); }

/* Modals */
.modal-custom .modal-content {
  border-radius: var(--border-radius-lg);
  border: none;
  overflow: hidden;
  box-shadow: var(--shadow-hard);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}
.modal-custom .modal-header {
  background: var(--primary-gradient);
  color: white;
  padding: 25px;
  border-bottom: none;
}
.modal-custom .modal-title { font-weight: 600; font-size: 1.3rem; }
.modal-custom .modal-body { padding: 25px; }
.modal-custom .modal-footer {
  padding: 20px 25px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
}
.modal.fade.show {
  display: block;
}
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
  z-index: 1040;
  opacity: 0;
  animation: modalBackdropFadeIn 0.2s ease forwards;
}

@keyframes modalBackdropFadeIn {
  to {
    opacity: 1;
  }
}

/* Assign Data Modal */
.assign-data-modal .staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin: 20px 0;
}
.assign-data-modal .staff-card {
  background: white;
  border-radius: var(--border-radius-sm);
  padding: 15px;
  text-align: center;
  border: 2px solid transparent;
  transition: all var(--transition-normal);
  cursor: pointer;
  box-shadow: var(--shadow-soft);
}
.assign-data-modal .staff-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color);
  box-shadow: var(--shadow-medium);
}
.assign-data-modal .staff-card.selected {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: var(--primary-color);
}
.assign-data-modal .staff-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 3px solid #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
.assign-data-modal .staff-name { font-weight: 600; margin-bottom: 5px; }
.assign-data-modal .staff-role { font-size: 12px; color: #6c757d; }

/* Call Modal */
.call-avatar {
  width: 100px; height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
}
.call-timer {
  font-size: 3.5rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 20px 0;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Glow + gradient text */
.glow { box-shadow: 0 0 20px rgba(102, 126, 234, 0.5); }
.gradient-text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Equal height row */
.equal-height-row { display: flex; flex-wrap: wrap; }
.equal-height-row > [class*='col-'] { display: flex; flex-direction: column; }

/* ✅ Responsive */
@media (max-width: 992px) {
  .app-shell { flex-direction: column; }
  .sidebar-wrap { width: 100%; flex: 0 0 auto; height: 320px; }
  .main-wrap { flex: 1 1 auto; }
}
.progress{
  height: 12px !important;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e3a8a;

  background: none !important;
  -webkit-text-fill-color: initial !important;
}

.icon-gradient {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff !important;

  font-size: 16px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.section-title i {
  -webkit-text-fill-color: #ffffff !important;
}
.icon-customer {
  background: linear-gradient(135deg, #f59e0b, #f97316); /* vàng → cam */
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.45);
}

.sidebar-title-icon {
  color: #1e3a8a; /* chữ xanh */
}

.sidebar-title-icon i {
  background: linear-gradient(135deg, #4facfe, #00f2fe); /* nền icon */
  color: #ffffff; /* icon trắng */

  width: 26px;
  height: 26px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 6px;
}
.sidebar-icon-yellow {
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: #ffffff;

  width: 26px;
  height: 26px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 6px;
}
.table-custom {
  table-layout: fixed;
  width: 100%;
}
.col-checkbox,
.col-index {
  width: 36px;
  max-width: 36px;
  min-width: 36px;
  padding: 0 !important;
  text-align: center;
}
.col-checkbox .form-check-input {
  margin: 0;
  transform: scale(0.85);
}



</style>
