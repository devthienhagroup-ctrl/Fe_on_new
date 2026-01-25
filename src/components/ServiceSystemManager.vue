<template>
  <div class="pb-4 bg-light min-vh-95">
    <!-- HEADER -->
    <div
        class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2 header-bar"
    >
      <h5 class="fw-bold mb-0 d-flex align-items-center">
        <button
            v-if="canCreatePackage"
            @click="openCreateDrawer"
            class="btn border border-primary rounded-circle d-flex align-items-center justify-content-center me-2 create-btn"
            style="width: 38px; height: 38px;"
        >
          <i class="fa-solid fa-plus text-primary fs-5"></i>
        </button>
        <i class="fa-solid fa-box-open text-primary me-2"></i>
        Quản lý gói dịch vụ
      </h5>

      <div class="d-flex align-items-center justify-content-end gap-2">
        <NotificationBell />
        <div class="d-flex flex-column align-items-end text-end">
          <div class="fw-semibold text-dark">{{ info.fullName }}</div>
        </div>
        <img
            v-if="info.avatarUrl"
            :src="' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + info.avatarUrl"
            alt="avatar"
            class="rounded-circle border profile-avatar"
        />
        <div v-else class="avatar-circle">
          {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
        </div>
      </div>
    </div>

    <!-- TABS -->
    <ul class="nav nav-tabs mb-3 bg-white px-3 pt-2">
      <li class="nav-item">
        <button
            class="nav-link d-flex align-items-center"
            :class="{ active: activeTab === 'packages' }"
            @click="activeTab = 'packages'"
        >
          <i class="fa-solid fa-box me-2 text-primary"></i>
          Gói dịch vụ
        </button>
      </li>
      <li class="nav-item">
        <button
            class="nav-link d-flex align-items-center"
            :class="{ active: activeTab === 'stats' }"
            @click="activeTab = 'stats'"
        >
          <i class="fa-solid fa-chart-column me-2 text-success"></i>
          Thống kê
        </button>
      </li>
      <li class="nav-item">
        <button
            class="nav-link d-flex align-items-center"
            :class="{ active: activeTab === 'services' }"
            @click="activeTab = 'services'; loadServiceEditor()"
        >
          <i class="fa-solid fa-screwdriver-wrench me-2 text-warning"></i>
          Quản lý dịch vụ
        </button>
      </li>
    </ul>

    <!-- DANH SÁCH GÓI DẠNG GIFT BOX -->
    <div v-show="activeTab === 'packages'" class="px-3">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div class="input-group w-auto search-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="fa-solid fa-magnifying-glass text-secondary"></i>
          </span>
          <input
              v-model="search"
              class="form-control border-start-0"
              placeholder="Tìm gói dịch vụ..."
              @keyup.enter="loadPackages"
          />
        </div>
        <div class="d-flex align-items-center gap-3 flex-wrap">
          <span class="text-muted me-2">Sắp xếp:</span>
          <select v-model="sortBy" class="form-select form-select-sm w-auto" @change="sortPackages">
            <option value="name">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="price">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="duration">Thời hạn ngắn nhất</option>
            <option value="duration-desc">Thời hạn dài nhất</option>
          </select>

          <!-- VIEW TOGGLE -->
          <div class="btn-group btn-group-sm" role="group">
            <button
                type="button"
                class="btn btn-outline-secondary"
                :class="{ 'active': viewMode === 'grid' }"
                @click="viewMode = 'grid'"
            >
              <i class="fa-solid fa-grip"></i>
            </button>
            <button
                type="button"
                class="btn btn-outline-secondary"
                :class="{ 'active': viewMode === 'list' }"
                @click="viewMode = 'list'"
            >
              <i class="fa-solid fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- GIFT BOX VIEW -->
      <div v-if="viewMode === 'grid'" class="row g-3">
        <div
            v-for="(pkg, index) in packages"
            :key="pkg.packageId"
            class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-6"
        >
          <div class="gift-package-card h-100" :class="{ 'inactive-package': !pkg.isActive, 'no-services': !pkg.details || pkg.details.length === 0 }">
            <div class="gift-package-ribbon" :class="pkg.isActive ? 'bg-success' : 'bg-secondary'">
              <i class="fa-solid" :class="pkg.isActive ? 'fa-play' : 'fa-pause'"></i>
              {{ pkg.isActive ? "Hoạt động" : "Ngưng" }}
            </div>

            <div v-if="!pkg.details || pkg.details.length === 0" class="gift-package-warning">
              <i class="fa-solid fa-triangle-exclamation"></i>
              Chưa cấu hình
            </div>

            <div class="gift-package-header">
              <div class="gift-package-icon">
                <i class="fa-solid fa-gift"></i>
              </div>
              <h6 class="gift-package-title">{{ pkg.packageName }}</h6>
            </div>

            <div class="gift-package-details">
              <div class="gift-package-price">
                {{ formatCurrency(pkg.basePrice) }}
              </div>

              <div class="gift-package-meta">
                <div class="meta-item">
                  <i class="fa-regular fa-clock text-primary"></i>
                  <span>{{ pkg.durationDays }} ngày</span>
                </div>
                <div class="meta-item">
                  <i class="fa-solid fa-cubes text-info"></i>
                  <span>{{ pkg.details?.length || 0 }} dịch vụ</span>
                </div>
              </div>

              <div class="gift-package-description">
                {{ getShortDescription(pkg.description) }}
              </div>
            </div>

            <div class="gift-package-actions">
              <button class="btn btn-sm btn-outline-info" @click="openStats(pkg)" title="Thống kê">
                <i class="fa-solid fa-chart-column"></i>
              </button>
              <button class="btn btn-sm btn-outline-primary" @click="toggleEdit(index, pkg)" title="Chỉnh sửa">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="deletePackage(pkg.packageId)" title="Xóa">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-if="packages.length === 0" class="col-12 text-center py-5">
          <div class="empty-gift-box">
            <i class="fa-solid fa-gift fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">Chưa có gói dịch vụ nào</h5>
            <button v-if="canCreatePackage" class="btn btn-primary mt-2" @click="openCreateDrawer">
              <i class="fa-solid fa-plus me-2"></i>Tạo gói đầu tiên
            </button>
          </div>
        </div>
      </div>

      <div v-if="viewMode === 'list'" class="table-responsive">
        <table class="table table-striped align-middle">
          <thead class="table-primary">
          <tr>
            <th><i class="fa-solid fa-box me-2"></i>Tên gói</th>
            <th><i class="fa-solid fa-coins me-2"></i>Giá</th>
            <th><i class="fa-regular fa-clock me-2"></i>Thời hạn (ngày)</th>
            <th><i class="fa-solid fa-toggle-on me-2"></i>Trạng thái</th>
            <th class="text-end"><i class="fa-solid fa-gear me-2"></i>Hành động</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(pkg, index) in packages" :key="pkg.packageId">
            <tr>
              <td>
                <div class="d-flex align-items-center">
                  <div class="package-icon me-2">
                    <i class="fa-solid fa-gift text-primary"></i>
                  </div>
                  <div>
                    <div class="fw-semibold">{{ pkg.packageName }}</div>
                    <div class="small text-muted text-truncate" style="max-width: 200px;" v-html="pkg.description || 'Chưa có mô tả'"></div>
                  </div>
                </div>
              </td>
              <td class="fw-bold text-primary">{{ formatCurrency(pkg.basePrice) }}</td>
              <td>{{ pkg.durationDays }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                    <span class="badge" :class="pkg.isActive ? 'bg-success' : 'bg-secondary'">
                      {{ pkg.isActive ? "Hoạt động" : "Ngưng" }}
                    </span>
                  <span
                      v-if="!pkg.details || pkg.details.length === 0"
                      class="badge bg-warning text-dark"
                  >
                      <i class="fa-solid fa-triangle-exclamation me-1"></i>Chưa cấu hình
                    </span>
                </div>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-info me-2" @click="openStats(pkg)" title="Thống kê">
                  <i class="fa-solid fa-chart-column"></i>
                </button>
                <button class="btn btn-sm btn-outline-primary me-2" @click="toggleEdit(index, pkg)" title="Chỉnh sửa">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deletePackage(pkg.packageId)" title="Xóa">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>

      <div v-if="editingRow !== null" class="modal-overlay" @click.self="cancelEdit">
        <div class="modal-panel">
          <div class="modal-content-wrapper">
            <div class="modal-header-custom">
              <h5 class="fw-semibold mb-0">
                <i class="fa-solid fa-pen-to-square me-2 text-primary"></i>
                Chỉnh sửa gói: {{ form.packageName }}
              </h5>
              <button type="button" class="btn-close" @click="cancelEdit"></button>
            </div>

            <div class="modal-body-scroll">
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Tên gói <span class="text-danger">*</span></label>
                  <input
                      v-model="form.packageName"
                      class="form-control rounded-3"
                      :class="{'is-invalid': formErrors.packageName}"
                  />
                  <div v-if="formErrors.packageName" class="invalid-feedback">
                    {{ formErrors.packageName }}
                  </div>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Giá cơ bản <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <input
                        v-model.number="form.basePrice"
                        type="number"
                        class="form-control rounded-3"
                        :class="{'is-invalid': formErrors.basePrice}"
                    />
                    <span class="input-group-text">₫</span>
                    <div v-if="formErrors.basePrice" class="invalid-feedback">
                      {{ formErrors.basePrice }}
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-semibold">Thời hạn <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <input
                        v-model.number="form.durationDays"
                        type="number"
                        class="form-control rounded-3"
                        :class="{'is-invalid': formErrors.durationDays}"
                    />
                    <span class="input-group-text">ngày</span>
                    <div v-if="formErrors.durationDays" class="invalid-feedback">
                      {{ formErrors.durationDays }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <div class="form-row align-items-start">
                  <label class="form-label fw-medium">
                    Mô tả: <span class="text-danger">*</span>
                  </label>
                  <div class="flex-grow-1 field-control">
                    <DescriptionEditor v-model="form.description" />
                    <div v-if="formErrors.description" class="text-danger small mt-1">
                      {{ formErrors.description }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold">Trạng thái</label>
                <select v-model="form.isActive" class="form-select rounded-3">
                  <option :value="true">Hoạt động</option>
                  <option :value="false">Ngưng</option>
                </select>
                <div v-if="formErrors.details" class="text-danger small mt-1">
                  {{ formErrors.details }}
                </div>
              </div>

              <div class="card rounded-4 border-0 shadow-sm">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <label class="fw-semibold mb-0">
                    <i class="fa-solid fa-cubes me-2 text-secondary"></i>Dịch vụ nhỏ trong gói
                  </label>
                  <button class="btn btn-sm btn-primary rounded-pill" @click="openServiceDrawer">
                    <i class="fa-solid fa-plus me-1"></i> Thêm dịch vụ
                  </button>
                </div>
                <div class="card-body">
                  <div v-if="form.details.length === 0" class="text-center py-4 text-muted">
                    <i class="fa-regular fa-circle-xmark fa-2x mb-2"></i>
                    <div>Chưa có dịch vụ nhỏ nào.</div>
                  </div>

                  <div v-else class="row g-2">
                    <div v-for="(srv, idx) in form.details" :key="srv.serviceId" class="col-md-6">
                      <div class="service-item border rounded-4 p-3 h-100">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div class="fw-semibold">{{ srv.serviceName }}</div>
                            <div class="text-primary fw-bold">{{ formatCurrency(srv.price || 0) }}</div>
                          </div>
                          <button class="btn btn-sm btn-link text-danger p-0" @click="removeDetail(idx)" title="Xóa dịch vụ">
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        <label class="small text-muted mb-1">Số lượng giới hạn</label>
                        <input
                            type="number"
                            v-model.number="srv.quantity"
                            class="form-control form-control-sm rounded-3"
                            placeholder="Trống = vô hạn"
                            min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer-custom">
              <button class="btn btn-secondary rounded-pill" @click="cancelEdit">
                <i class="fa-solid fa-ban me-1"></i>Hủy
              </button>
              <button class="btn btn-primary rounded-pill" @click="savePackage">
                <i class="fa-solid fa-floppy-disk me-1"></i>Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCreateDrawer" class="modal-overlay" @click.self="closeCreateDrawer">
      <div class="modal-panel">
        <div class="modal-content-wrapper">
          <div class="modal-header-custom">
            <h5 class="fw-semibold mb-0">
              <i class="fa-solid fa-plus text-primary me-2"></i>Tạo gói dịch vụ mới
            </h5>
            <button type="button" class="btn-close" @click="closeCreateDrawer"></button>
          </div>

          <div class="modal-body-scroll">
            <div class="mb-3">
              <label class="form-label fw-semibold">Tên gói <span class="text-danger">*</span></label>
              <input
                  v-model="createForm.packageName"
                  class="form-control rounded-3"
                  placeholder="Nhập tên gói dịch vụ"
                  :class="{'is-invalid': createFormErrors.packageName}"
              />
              <div v-if="createFormErrors.packageName" class="invalid-feedback">
                {{ createFormErrors.packageName }}
              </div>
            </div>

            <div class="row mb-3 g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Giá cơ bản <span class="text-danger">*</span></label>
                <div class="input-group">
                  <input
                      v-model.number="createForm.basePrice"
                      type="number"
                      class="form-control rounded-3"
                      :class="{'is-invalid': createFormErrors.basePrice}"
                  />
                  <span class="input-group-text">₫</span>
                  <div v-if="createFormErrors.basePrice" class="invalid-feedback">
                    {{ createFormErrors.basePrice }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Thời hạn (ngày) <span class="text-danger">*</span></label>
                <input
                    v-model.number="createForm.durationDays"
                    type="number"
                    class="form-control rounded-3"
                    :class="{'is-invalid': createFormErrors.durationDays}"
                />
                <div v-if="createFormErrors.durationDays" class="invalid-feedback">
                  {{ createFormErrors.durationDays }}
                </div>
              </div>
            </div>

            <div class="mb-3">
              <div class="form-row align-items-start">
                <label class="form-label fw-medium">
                  Mô tả: <span class="text-danger">*</span>
                </label>
                <div class="flex-grow-1 field-control">
                  <DescriptionEditor v-model="createForm.description" />
                  <div v-if="createFormErrors.description" class="text-danger small mt-1">
                    {{ createFormErrors.description }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Trạng thái</label>
              <select v-model="createForm.isActive" class="form-select rounded-3">
                <option :value="true">Hoạt động</option>
                <option :value="false">Ngưng</option>
              </select>
            </div>
          </div>

          <div class="modal-footer-custom">
            <button class="btn btn-secondary rounded-pill" @click="closeCreateDrawer">
              <i class="fa-solid fa-ban me-1"></i>Hủy
            </button>
            <button class="btn btn-primary rounded-pill" @click="createPackage">
              <i class="fa-solid fa-floppy-disk me-1"></i>Tạo gói
            </button>
          </div>
        </div>
      </div>
    </div>


    <div v-show="activeTab === 'services'" class="px-3">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div class="input-group w-auto search-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="fa-solid fa-magnifying-glass text-secondary"></i>
          </span>
          <input
              v-model="serviceEditorSearch"
              class="form-control border-start-0"
              placeholder="Tìm dịch vụ..."
              @keyup.enter="loadServiceEditor"
          />
        </div>
      </div>

      <div class="row g-3">
        <div
            v-for="svc in editableServices"
            :key="svc.serviceId"
            class="col-xxl-2 col-xl-3 col-lg-4 col-md-4 col-sm-6"
        >
          <div class="gift-service-card h-100">
            <div class="gift-service-ribbon" :class="svc.isActive ? 'bg-success' : 'bg-secondary'">
              {{ svc.isActive ? "Hoạt động" : "Ngưng" }}
            </div>
            <div class="gift-service-header">
              <i class="fa-solid fa-cube gift-service-icon"></i>
              <h6 class="gift-service-title">{{ svc.serviceName }}</h6>
            </div>
            <div class="gift-service-price">
              {{ formatCurrency(svc.price) }}
            </div>
            <div class="gift-service-description">
              {{ getShortDescription(svc.description) }}
            </div>
            <div class="gift-service-actions">
              <button class="btn btn-sm btn-outline-primary rounded-pill" @click="openEditService(svc)">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-if="editableServices.length === 0" class="col-12 text-center py-5">
          <i class="fa-solid fa-cube fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Chưa có dịch vụ nào</h5>
          <button class="btn btn-primary mt-2 rounded-pill" @click="openCreateServiceDrawer">
            <i class="fa-solid fa-plus me-2"></i>Tạo dịch vụ đầu tiên
          </button>
        </div>
      </div>
    </div>

    <div v-if="showServiceDrawer" class="modal-overlay" @click.self="closeServiceDrawer">
      <div class="modal-panel">
        <div class="modal-content-wrapper">
          <div class="modal-header-custom">
            <h5 class="fw-semibold mb-0">
              <i class="fa-solid fa-cubes text-primary me-2"></i>Chọn dịch vụ nhỏ
            </h5>
            <button type="button" class="btn-close" @click="closeServiceDrawer"></button>
          </div>

          <div class="modal-body-scroll">
            <div class="input-group mb-3">
              <input
                  v-model="serviceSearch"
                  class="form-control border-start-0 rounded-3"
                  placeholder="Tìm dịch vụ..."
                  @keyup.enter="loadServices"
              />
              <button class="btn btn-outline-primary rounded-3" @click="loadServices">
                <i class="fa-solid fa-rotate me-1"></i>Nạp
              </button>
            </div>

            <div class="border rounded-4 overflow-auto shadow-sm" style="max-height: 50vh;">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                <tr>
                  <th style="width: 40px;">
                    <input type="checkbox" :checked="allSelectableChecked" @change="toggleSelectAll($event)" />
                  </th>
                  <th>Tên dịch vụ</th>
                  <th class="text-end">Giá</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="servicesLoading">
                  <td colspan="3" class="text-center py-4">
                    <i class="fa-solid fa-spinner fa-spin me-2"></i>Đang tải...
                  </td>
                </tr>

                <tr v-for="s in selectableServices" :key="s.serviceId">
                  <td>
                    <input
                        type="checkbox"
                        :value="s.serviceId"
                        v-model="selectedServiceIds"
                    />
                  </td>
                  <td>
                    <div class="fw-semibold">{{ s.serviceName }}</div>
                    <div class="small text-muted" v-if="s.description" v-html="s.description"></div>
                  </td>
                  <td class="text-end fw-semibold">
                    {{ formatCurrency(s.price || 0) }}
                  </td>
                </tr>

                <tr v-if="!servicesLoading && selectableServices.length === 0">
                  <td colspan="3" class="text-center py-4 text-muted">
                    <i class="fa-regular fa-face-meh-blank me-2"></i>Không tìm thấy dịch vụ phù hợp
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="modal-footer-custom">
            <div class="small text-muted">
              Đã chọn: <span class="fw-semibold">{{ selectedServiceIds.length }}</span>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-secondary rounded-pill" @click="closeServiceDrawer">
                <i class="fa-solid fa-ban me-1"></i>Đóng
              </button>
              <button class="btn btn-primary rounded-pill" :disabled="!selectedServiceIds.length" @click="addSelectedServices">
                <i class="fa-solid fa-plus me-1"></i>Thêm vào gói
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTab === 'stats'" class="stats-container px-3">
      <div class="d-flex align-items-end gap-3 mb-4 flex-wrap">
        <select v-model="statsMode" class="form-select w-auto rounded-3">
          <option value="summary">Tổng hợp tất cả gói</option>
          <option value="single">Theo gói cụ thể</option>
        </select>

        <select
            v-if="statsMode === 'single'"
            v-model.number="selectedPackageId"
            class="form-select w-auto rounded-3"
        >
          <option disabled value="">Chọn gói</option>
          <option v-for="p in packages" :key="p.packageId" :value="p.packageId">
            {{ p.packageName }}
          </option>
        </select>

        <input
            v-model.number="selectedYear"
            type="number"
            class="form-control w-auto rounded-3"
            min="2000"
            max="2100"
            style="width: 120px;"
        />

        <button class="btn btn-primary rounded-pill" @click="loadChartData">
          <i class="fa-solid fa-chart-line me-1"></i> Tải thống kê
        </button>
      </div>

      <div class="stats-chart-container bg-white rounded-4 shadow-sm p-4">
        <div v-if="!hasData" class="text-muted fw-semibold fs-5 d-flex flex-column align-items-center justify-content-center">
          <i class="fa-solid fa-chart-simple me-2 text-secondary mb-3" style="font-size: 3rem;"></i>
          <span>Không có dữ liệu để hiển thị</span>
          <small class="text-muted mt-2">Vui lòng chọn năm và tải thống kê</small>
        </div>
        <canvas v-else id="statsChart"></canvas>
      </div>
    </div>

    <div v-if="showServiceEditorDrawer" class="modal-overlay" @click.self="closeServiceEdit">
      <div class="modal-panel">
        <div class="modal-content-wrapper">
          <div class="modal-header-custom">
            <h5 class="fw-semibold mb-0">
              <i class="fa-solid fa-pen-to-square text-warning me-2"></i>
              {{ editingService.serviceId ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ mới' }}
            </h5>
            <button type="button" class="btn-close" @click="closeServiceEdit"></button>
          </div>

          <div class="modal-body-scroll">
            <div class="mb-3">
              <label class="form-label fw-semibold">Tên dịch vụ <span class="text-danger">*</span></label>
              <input
                  v-model="editingService.serviceName"
                  class="form-control rounded-3"
                  :class="{'is-invalid': editingServiceErrors.serviceName}"
                  placeholder="Nhập tên dịch vụ"
              />
              <div v-if="editingServiceErrors.serviceName" class="invalid-feedback">
                {{ editingServiceErrors.serviceName }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Giá (VNĐ) <span class="text-danger">*</span></label>
              <input
                  v-model.number="editingService.price"
                  type="number"
                  class="form-control rounded-3"
                  :class="{'is-invalid': editingServiceErrors.price}"
                  placeholder="0"
              />
              <div v-if="editingServiceErrors.price" class="invalid-feedback">
                {{ editingServiceErrors.price }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Mô tả <span class="text-danger">*</span></label>
              <DescriptionEditor v-model="editingService.description" />
              <div v-if="editingServiceErrors.description" class="text-danger small mt-1">
                {{ editingServiceErrors.description }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Trạng thái</label>
              <select v-model="editingService.isActive" class="form-select rounded-3">
                <option :value="true">Hoạt động</option>
                <option :value="false">Ngưng</option>
              </select>
            </div>
          </div>

          <div class="modal-footer-custom">
            <button class="btn btn-secondary rounded-pill" @click="closeServiceEdit">
              <i class="fa-solid fa-ban me-1"></i>Hủy
            </button>
            <button class="btn btn-primary rounded-pill" @click="saveServiceEdit">
              <i class="fa-solid fa-floppy-disk me-1"></i>{{ editingService.serviceId ? 'Lưu' : 'Tạo' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
Chart.defaults.font.size = 13.5;
Chart.defaults.font.family = "'Segoe UI', 'Helvetica Neue', Arial";
Chart.defaults.font.weight = "500";

import NotificationBell from "./NotificationBell.vue";
import api from "../api/api.js";
import { useAuthStore } from "../stores/authStore.js";
import {
  showWarning,
  confirmWithInput,
  showLoading,
  updateAlertSuccess,
  updateAlertError,
} from "../assets/js/alertService.js";
import DescriptionEditor from "./common/DescriptionEditor.vue";

Chart.register(...registerables);

const packages = ref([]);
const search = ref("");
const canCreatePackage = ref(true);
const editingRow = ref(null);
const hasData = ref(false);
const viewMode = ref("grid");
const sortBy = ref("name");

const showCreateDrawer = ref(false);

const showServiceDrawer = ref(false);
const services = ref([]);
const serviceSearch = ref("");
const servicesLoading = ref(false);
const selectedServiceIds = ref([]);

const authStore = useAuthStore();
const info = authStore.userInfo;

const activeTab = ref("packages");
const statsMode = ref("summary");
const selectedPackageId = ref("");
const selectedYear = ref(new Date().getFullYear());
let chartInstance = null;

const formErrors = ref({});
const createFormErrors = ref({});
const editingServiceErrors = ref({});

const form = ref({
  packageId: null,
  packageName: "",
  basePrice: 0,
  durationDays: 30,
  isActive: true,
  description: "",
  details: [],
});

const createForm = ref({
  packageName: "",
  basePrice: 0,
  durationDays: 30,
  isActive: false,
  description: ""
});

function getShortDescription(description) {
  if (!description) return 'Chưa có mô tả';
  const plainText = description.replace(/<[^>]*>/g, '');
  if (plainText.length <= 60) return plainText;
  return plainText.substring(0, 60) + '...';
}

function validatePackageForm(formData, isCreate = false) {
  const errors = {};

  if (!formData.packageName || formData.packageName.trim().length === 0) {
    errors.packageName = "Tên gói không được để trống";
  } else if (formData.packageName.trim().length < 3) {
    errors.packageName = "Tên gói phải có ít nhất 3 ký tự";
  }

  if (formData.basePrice == null || formData.basePrice < 0) {
    errors.basePrice = "Giá phải lớn >= 0";
  }

  if (!formData.durationDays || formData.durationDays <= 0) {
    errors.durationDays = "Thời hạn phải lớn hơn 0";
  }

  if (!formData.description || formData.description.trim().length === 0) {
    errors.description = "Mô tả không được để trống";
  }

  if (!isCreate && formData.isActive && (!formData.details || formData.details.length === 0)) {
    errors.details = "Gói đang hoạt động phải có ít nhất một dịch vụ";
  }

  return errors;
}

function validateServiceForm(formData) {
  const errors = {};

  if (!formData.serviceName || formData.serviceName.trim().length === 0) {
    errors.serviceName = "Tên dịch vụ không được để trống";
  } else if (formData.serviceName.trim().length < 3) {
    errors.serviceName = "Tên dịch vụ phải có ít nhất 3 ký tự";
  }

  if (formData.price == null || formData.price < 0) {
    errors.price = "Giá phải lớn hơn hoặc bằng 0";
  }

  if (!formData.description || formData.description.trim().length === 0) {
    errors.description = "Mô tả không được để trống";
  }

  return errors;
}

async function loadPackages() {
  const res = await api.get("/admin.thg/servicesystem/packages", {
    params: { keyword: search.value },
  });
  packages.value = res.data;
  sortPackages();
}

function sortPackages() {
  if (!packages.value.length) return;

  packages.value.sort((a, b) => {
    switch(sortBy.value) {
      case 'name':
        return a.packageName.localeCompare(b.packageName);
      case 'name-desc':
        return b.packageName.localeCompare(a.packageName);
      case 'price':
        return a.basePrice - b.basePrice;
      case 'price-desc':
        return b.basePrice - a.basePrice;
      case 'duration':
        return a.durationDays - b.durationDays;
      case 'duration-desc':
        return b.durationDays - a.durationDays;
      default:
        return 0;
    }
  });
}

function toggleEdit(index, pkg) {
  editingRow.value = editingRow.value === index ? null : index;
  if (editingRow.value !== null) {
    form.value = JSON.parse(JSON.stringify(pkg));
    formErrors.value = {};
  }
}

function cancelEdit() {
  editingRow.value = null;
  formErrors.value = {};
}

async function savePackage() {
  formErrors.value = validatePackageForm(form.value, false);

  if (Object.keys(formErrors.value).length > 0) {
    showWarning("Dữ liệu không hợp lệ", "Vui lòng kiểm tra lại các trường thông tin");
    return;
  }

  try {
    await showLoading(api.put(`/admin.thg/servicesystem/packages/${form.value.packageId}`, form.value));
    updateAlertSuccess("Lưu gói thành công!");
    editingRow.value = null;
    await loadPackages();
  } catch (err) {
    updateAlertError("Lưu thất bại", err.response?.data?.message || "Lỗi không xác định");
  }
}

async function createPackage() {
  createFormErrors.value = validatePackageForm(createForm.value, true);

  if (Object.keys(createFormErrors.value).length > 0) {
    showWarning("Dữ liệu không hợp lệ", "Vui lòng kiểm tra lại các trường thông tin");
    return;
  }

  try {
    await showLoading(api.post("/admin.thg/servicesystem/packages", createForm.value));
    updateAlertSuccess("Tạo mới gói thành công!");
    showCreateDrawer.value = false;
    createForm.value = { packageName: "", basePrice: 0, durationDays: 30, isActive: false, description: "" };
    createFormErrors.value = {};
    await loadPackages();
  } catch (err) {
    updateAlertError("Tạo mới thất bại", err.response?.data?.message || "Lỗi không xác định");
  }
}

async function deletePackage(id) {
  await confirmWithInput("Xác nhận xóa gói", 'Nhập "delete" để xác nhận.', "delete", async () => {
    try {
      await showLoading(api.delete(`/admin.thg/servicesystem/packages/${id}`));
      updateAlertSuccess("Đã xóa thành công!");
      await loadPackages();
    } catch (err) {
      updateAlertError("Xóa thất bại", err.response?.data?.message || "Lỗi khi xóa gói!");
    }
  });
}

function openCreateDrawer() {
  showCreateDrawer.value = true;
  createFormErrors.value = {};
}

function closeCreateDrawer() {
  showCreateDrawer.value = false;
  createFormErrors.value = {};
}

const selectableServices = computed(() => {
  if (!services.value) return [];
  const existingIds = new Set((form.value.details || []).map(d => d.serviceId));
  return services.value.filter(s => !existingIds.has(s.serviceId));
});

const allSelectableChecked = computed(() => {
  if (!selectableServices.value.length) return false;
  const selectableIds = selectableServices.value.map(s => s.serviceId);
  return selectableIds.every(id => selectedServiceIds.value.includes(id));
});

function toggleSelectAll(e) {
  const checked = e.target.checked;
  if (checked) {
    selectedServiceIds.value = selectableServices.value.map(s => s.serviceId);
  } else {
    selectedServiceIds.value = [];
  }
}

async function loadServices() {
  try {
    servicesLoading.value = true;
    const res = await api.get("/admin.thg/servicesystem/services/search", {
      params: { keyword: serviceSearch.value }
    });
    services.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    updateAlertError("Không thể tải danh sách dịch vụ", err.response?.data?.message || "Lỗi không xác định");
  } finally {
    servicesLoading.value = false;
  }
}

function openServiceDrawer() {
  selectedServiceIds.value = [];
  showServiceDrawer.value = true;
  loadServices();
}

function closeServiceDrawer() {
  showServiceDrawer.value = false;
}

function addSelectedServices() {
  if (!selectedServiceIds.value.length) return;

  const mapById = new Map(services.value.map(s => [s.serviceId, s]));
  const existingIds = new Set((form.value.details || []).map(d => d.serviceId));

  const toAdd = selectedServiceIds.value
      .filter(id => !existingIds.has(id))
      .map(id => {
        const s = mapById.get(id);
        return {
          serviceId: s.serviceId,
          serviceName: s.serviceName,
          price: s.price,
          quantity: null,
        };
      });

  if (!form.value.details) form.value.details = [];
  form.value.details.push(...toAdd);

  updateAlertSuccess(`Đã thêm ${toAdd.length} dịch vụ vào gói`);
  closeServiceDrawer();
}

function removeDetail(idx) {
  form.value.details.splice(idx, 1);
}

function openStats(pkg) {
  statsMode.value = "single";
  selectedPackageId.value = pkg.packageId;
  activeTab.value = "stats";
  loadChartData();
}

function formatCurrency(num) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num || 0);
}

onMounted(loadPackages);

async function loadChartData() {
  try {
    const url =
        statsMode.value === "single"
            ? `/admin.thg/servicesystem/packages/${selectedPackageId.value}/stats/year`
            : `/admin.thg/servicesystem/packages/stats/summary`;

    const res = await showLoading(api.get(url, { params: { year: selectedYear.value } }));
    const data = res.data || {};
    const labels = data.months || [];
    const users = data.totalUsers || [];
    const revenue = data.totalRevenue || [];

    const hasValues = labels.length > 0 && (users.some((u) => u > 0) || revenue.some((r) => r > 0));
    hasData.value = hasValues;

    if (!hasValues) {
      if (chartInstance) chartInstance.destroy();
      updateAlertSuccess("Không có dữ liệu thống kê trong năm này");
      return;
    }

    await nextTick();
    const canvas = document.getElementById("statsChart");
    if (!canvas) return console.error("Không tìm thấy phần tử canvas #statsChart");
    const ctx = canvas.getContext("2d");

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels.map((m) => `T${m}`),
        datasets: [
          {
            type: "bar",
            label: "Người dùng đăng ký",
            data: users,
            backgroundColor: "rgba(56, 161, 105, 0.7)",
            borderRadius: 6,
          },
          {
            type: "line",
            label: "Doanh thu (VNĐ)",
            data: revenue,
            borderColor: "rgba(49, 151, 149, 0.9)",
            borderWidth: 3,
            fill: false,
            tension: 0.3,
            pointBackgroundColor: "rgba(49, 151, 149, 1)",
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Số người dùng" },
            grid: {
              color: 'rgba(0, 0, 0, 0.08)',
            }
          },
          y1: {
            beginAtZero: true,
            position: "right",
            title: { display: true, text: "Doanh thu (VNĐ)" },
            grid: { drawOnChartArea: false },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed.y;
                return ctx.dataset.label.includes("Doanh thu")
                    ? `💰 ${val.toLocaleString("vi-VN")} ₫`
                    : `👥 ${val} người`;
              },
            },
          },
        },
      },
    });

    updateAlertSuccess("Tải thống kê thành công!");
  } catch (err) {
    hasData.value = false;
    console.error(err);
    updateAlertError("Không thể tải thống kê", err.response?.data?.message || "Lỗi không xác định");
  }
}

const editableServices = ref([]);
const serviceEditorSearch = ref("");
const editingService = ref({
  serviceId: null,
  serviceName: "",
  price: 0,
  description: "",
  isActive: true
});
const showServiceEditorDrawer = ref(false);

async function loadServiceEditor() {
  try {
    const res = await api.get("/admin.thg/servicesystem/services_all", {
      params: { keyword: serviceEditorSearch.value }
    });
    editableServices.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    updateAlertError("Không thể tải danh sách dịch vụ", err.response?.data?.message || "Lỗi không xác định");
  }
}

function openEditService(svc) {
  editingService.value = JSON.parse(JSON.stringify(svc));
  editingServiceErrors.value = {};
  showServiceEditorDrawer.value = true;
}

function openCreateServiceDrawer() {
  editingService.value = {
    serviceId: null,
    serviceName: "",
    price: 0,
    description: "",
    isActive: true
  };
  editingServiceErrors.value = {};
  showServiceEditorDrawer.value = true;
}

async function saveServiceEdit() {
  editingServiceErrors.value = validateServiceForm(editingService.value);

  if (Object.keys(editingServiceErrors.value).length > 0) {
    showWarning("Dữ liệu không hợp lệ", "Vui lòng kiểm tra lại các trường thông tin");
    return;
  }

  try {
    if (editingService.value.serviceId) {
      await showLoading(api.put(`/admin.thg/servicesystem/services_all/${editingService.value.serviceId}`, editingService.value));
      updateAlertSuccess("Đã lưu thay đổi!");
    } else {
      await showLoading(api.post("/admin.thg/servicesystem/services_all", editingService.value));
      updateAlertSuccess("Đã tạo dịch vụ mới!");
    }
    showServiceEditorDrawer.value = false;
    await loadServiceEditor();
  } catch (err) {
    updateAlertError(editingService.value.serviceId ? "Lưu thất bại" : "Tạo mới thất bại",
        err.response?.data?.message || "Lỗi không xác định");
  }
}

function closeServiceEdit() {
  showServiceEditorDrawer.value = false;
  editingService.value = {
    serviceId: null,
    serviceName: "",
    price: 0,
    description: "",
    isActive: true
  };
  editingServiceErrors.value = {};
}
</script>

<style scoped>
:global(body) {
  background-color: #f5f7f6;
}

.header-bar {
  border-bottom: solid 1px rgba(0, 0, 0, 0.08);
}

.create-btn {
  transition: all 0.2s ease;
}

.create-btn:hover {
  background-color: rgba(47, 133, 90, 0.1);
}

.profile-avatar {
  width: 36px;
  height: 36px;
  object-fit: cover;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #2f855a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1050;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.modal-panel {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 28px;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
}

.modal-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal-header-custom,
.modal-footer-custom {
  padding: 18px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.modal-header-custom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, rgba(56, 161, 105, 0.1), rgba(72, 187, 120, 0.08));
}

.modal-footer-custom {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: #f9faf9;
}

.modal-body-scroll {
  padding: 24px 28px 28px;
  overflow-y: auto;
}

.modal-body-scroll::-webkit-scrollbar {
  width: 6px;
}

.modal-body-scroll::-webkit-scrollbar-thumb {
  background: rgba(47, 133, 90, 0.45);
  border-radius: 999px;
}

.field-control :deep(.ProseMirror),
.field-control :deep(textarea),
.field-control :deep(.quill-editor) {
  min-height: 120px;
  border-radius: 18px;
}

.search-group {
  min-width: 280px;
}

.gift-package-card {
  background: linear-gradient(135deg, #ffffff 0%, #f7faf8 100%);
  border: 1px solid #e3f1e9;
  border-radius: 18px;
  padding: 1rem;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 6px 16px rgba(36, 120, 83, 0.08);
  overflow: hidden;
  height: 100%;
}

.gift-package-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2f855a, #38a169);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.gift-package-card:hover::before {
  transform: scaleX(1);
}

.gift-package-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(36, 120, 83, 0.16);
  border-color: #2f855a;
}

.gift-package-card.inactive-package {
  opacity: 0.8;
  background: linear-gradient(135deg, #f8f9fa 0%, #edf2f7 100%);
}

.gift-package-card.no-services {
  border-left: 3px solid #ecc94b;
}

.gift-package-ribbon {
  position: absolute;
  top: 10px;
  right: -6px;
  padding: 4px 12px;
  border-radius: 12px 3px 3px 12px;
  font-size: 0.6rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.gift-package-ribbon::before {
  content: '';
  position: absolute;
  top: 100%;
  right: 0;
  border-left: 6px solid transparent;
  border-top: 6px solid;
  border-top-color: inherit;
  filter: brightness(0.8);
}

.gift-package-warning {
  position: absolute;
  top: 10px;
  left: -6px;
  background: #f6ad55;
  color: #7b341e;
  padding: 3px 10px;
  border-radius: 3px 12px 12px 3px;
  font-size: 0.55rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.gift-package-header {
  text-align: center;
  margin-bottom: 0.8rem;
  padding-top: 0.25rem;
}

.gift-package-icon {
  width: 46px;
  height: 46px;
  margin: 0 auto 0.6rem;
  background: linear-gradient(135deg, #2f855a, #38a169);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(47, 133, 90, 0.25);
}

.gift-package-icon i {
  font-size: 1.3rem;
  color: white;
}

.gift-package-title {
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.4rem;
}

.gift-package-details {
  margin-bottom: 0.8rem;
}

.gift-package-price {
  text-align: center;
  font-size: 1.05rem;
  font-weight: 700;
  color: #2f855a;
  margin-bottom: 0.6rem;
  padding: 0.5rem;
  background: rgba(47, 133, 90, 0.08);
  border-radius: 12px;
  border: 1px dashed rgba(47, 133, 90, 0.2);
}

.gift-package-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
  gap: 0.35rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  color: #4a5568;
  flex: 1;
  justify-content: center;
  padding: 0.35rem;
  background: rgba(74, 85, 104, 0.05);
  border-radius: 8px;
}

.meta-item i {
  font-size: 0.75rem;
}

.gift-package-description {
  color: #4a5568;
  text-align: center;
  line-height: 1.35;
  font-size: 0.78rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.2rem;
}

.gift-package-actions {
  display: flex;
  justify-content: center;
  gap: 0.35rem;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.gift-package-actions .btn {
  border-radius: 10px;
  padding: 0.25rem 0.45rem;
  font-size: 0.72rem;
  transition: all 0.3s ease;
}

.gift-package-actions .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}

.gift-service-card {
  background: linear-gradient(135deg, #ffffff 0%, #f7faf8 100%);
  border: 1px solid #e3f1e9;
  border-radius: 16px;
  padding: 0.9rem;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(36, 120, 83, 0.08);
  overflow: hidden;
  height: 100%;
}

.gift-service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 26px rgba(36, 120, 83, 0.14);
  border-color: #2f855a;
}

.gift-service-ribbon {
  position: absolute;
  top: 8px;
  right: -5px;
  padding: 3px 10px;
  border-radius: 10px 2px 2px 10px;
  font-size: 0.55rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  z-index: 2;
}

.gift-service-ribbon::before {
  content: '';
  position: absolute;
  top: 100%;
  right: 0;
  border-left: 5px solid transparent;
  border-top: 5px solid;
  border-top-color: inherit;
  filter: brightness(0.8);
}

.gift-service-header {
  text-align: center;
  margin-bottom: 0.75rem;
}

.gift-service-icon {
  font-size: 1.6rem;
  color: #2f855a;
  margin-bottom: 0.45rem;
  display: block;
}

.gift-service-title {
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  font-size: 0.83rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.1rem;
}

.gift-service-price {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: #2f855a;
  margin-bottom: 0.5rem;
  padding: 0.4rem;
  background: rgba(47, 133, 90, 0.08);
  border-radius: 8px;
}

.gift-service-description {
  color: #4a5568;
  text-align: center;
  line-height: 1.3;
  font-size: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2rem;
  margin-bottom: 0.75rem;
}

.gift-service-actions {
  text-align: center;
}

.gift-service-actions .btn {
  border-radius: 6px;
  padding: 0.2rem 0.4rem;
  font-size: 0.7rem;
}

.empty-gift-box {
  padding: 3rem 1rem;
}

.package-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(47, 133, 90, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-item {
  transition: all 0.2s;
  border-radius: 8px;
}

.service-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

.text-primary {
  color: #2f855a !important;
}

.btn-primary {
  background-color: #2f855a;
  border-color: #2f855a;
}

.btn-primary:hover {
  background-color: #276749;
  border-color: #276749;
}

.btn-outline-primary {
  color: #2f855a;
  border-color: #2f855a;
}

.btn-outline-primary:hover {
  background-color: #2f855a;
  border-color: #2f855a;
}

.table-primary {
  background-color: rgba(47, 133, 90, 0.12) !important;
}

.border-primary {
  border-color: #2f855a !important;
}

.nav-tabs .nav-link.active {
  color: #2f855a;
  border-bottom: 2px solid #2f855a;
}

.stats-container {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
}

.stats-chart-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

#statsChart {
  width: 100% !important;
  height: 400px !important;
}

@media (max-width: 992px) {
  .search-group {
    min-width: 200px;
  }
}

@media (max-width: 576px) {
  .gift-package-card,
  .gift-service-card {
    padding: 0.85rem;
  }

  .gift-package-icon {
    width: 42px;
    height: 42px;
  }

  .gift-package-icon i {
    font-size: 1.2rem;
  }
}

</style>
