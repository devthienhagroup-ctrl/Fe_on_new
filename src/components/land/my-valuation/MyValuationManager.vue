<template>
  <div class="valuation-experience bg-light py-3 py-md-5 pt-5 mt-5">
    <div class="container-fluid px-3 px-md-4">
      <div class="valuation-wrapper bg-white shadow-sm rounded-3 rounded-md-4 overflow-hidden">
        <!-- HEADER -->
        <header
            class="px-3 px-md-4 py-3 border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="flex-grow-1">
            <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <span class="badge rounded-pill text-bg-primary px-3 py-2 shadow-sm">
                <i class="fa-solid fa-compass me-2"></i>
                Trung tâm định giá
              </span>
              <span class="text-muted small d-none d-sm-inline">Tạo cảm hứng từ chuyên trang bất động sản.</span>
            </div>
            <h2 class="fw-semibold text-primary mb-1 fs-5 fs-md-4">Quản lý và theo dõi giá bất động sản của bạn</h2>
            <p class="text-muted mb-0 small">
              Theo dõi tài sản, kết quả định giá và gửi yêu cầu mới trong một trải nghiệm thống nhất.
            </p>
          </div>
        </header>

        <transition name="fade-slide" mode="out-in">
          <!-- LIST MODE WITH TABS -->
          <div v-if="viewMode === 'list'" key="list">
            <nav class="border-bottom px-3 px-md-4 bg-white">
              <ul class="nav nav-underline valuation-tabs gap-1 gap-md-2 flex-nowrap overflow-auto py-2 py-md-3">
                <li v-for="tab in tabs" :key="tab.key" class="nav-item">
                  <button
                      type="button"
                      class="nav-link d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-2 rounded-pill fw-semibold small"
                      :class="{ active: activeTab === tab.key }"
                      @click="switchTab(tab.key)"
                  >
                    <i :class="tab.icon"></i>
                    <span class="d-none d-sm-inline">{{ tab.label }}</span>
                    <span class="d-sm-none">{{ tabShortLabel(tab.key) }}</span>
                  </button>
                </li>
              </ul>
            </nav>

            <section class="px-3 px-md-4 py-3 py-md-4">
              <transition name="fade-slide" mode="out-in">
                <!-- TAB: ASSET LIST -->
                <div v-if="activeTab === 'assets'" key="assets">
                  <AssetListView
                      :assets="assets"
                      :status-badge-class="statusBadgeClass"
                      :format-date="formatDate"
                      @refresh="shuffleAssets"
                      @add-asset="openAddAssetForm"
                      @view-detail="openAssetDetail"
                      @request-valuation="openRequestFromAsset"
                  />
                </div>
                <!-- TAB: VALUATION RESULTS -->
                <div v-else-if="activeTab === 'results'" key="results">
                  <ValuationResultsView
                      :valuations="filteredValuations"
                      :filter-status="filterStatus"
                      :status-badge-class="statusBadgeClass"
                      :format-date="formatDate"
                      @toggle-filter="toggleResultFilter"
                      @view-detail="openAssetDetail"
                      @open-report="openValuationDetail"
                      @request-open-report="handleOpenReport"
                  />
                </div>
                <!-- TAB: REQUEST VALUATION -->
                <div v-else key="request">
                  <div class="row g-3 g-md-4 align-items-start">
                    <div class="col-12 col-lg-7">
                      <div class="mb-3 mb-md-4">
                        <h5 class="fw-semibold text-dark mb-1 fs-6 fs-md-5">Gửi yêu cầu định giá mới</h5>
                        <p class="text-muted small mb-0">Chọn tài sản có sẵn hoặc mô tả tài sản mới để chúng tôi hỗ
                          trợ.</p>
                        <div v-if="requestForm.assetOption === 'new'" class="form-check mt-2">
                          <input
                              id="on-behalf-checkbox"
                              v-model="requestForm.onBehalf"
                              class="form-check-input"
                              type="checkbox"
                          />
                          <label class="form-check-label small" for="on-behalf-checkbox">Nhập hộ</label>
                        </div>
                      </div>
                      <form class="card border-0 shadow-sm" @submit.prevent>
                        <div class="card-body p-3 p-md-4">
                          <div class="mb-3">
                            <label class="form-label fw-semibold small">Chọn tài sản</label>
                            <div class="d-flex gap-2 gap-md-3 flex-wrap">
                              <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    id="asset-existing"
                                    value="existing"
                                    v-model="requestForm.assetOption"
                                />
                                <label class="form-check-label small" for="asset-existing">Sử dụng tài sản đã có</label>
                              </div>
                              <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="radio"
                                    id="asset-new"
                                    value="new"
                                    v-model="requestForm.assetOption"
                                />
                                <label class="form-check-label small" for="asset-new">Mô tả tài sản mới</label>
                              </div>
                            </div>
                          </div>

                          <div
                              v-if="requestForm.assetOption === 'existing'"
                              class="mb-3 field-group"
                              :class="{ 'has-error': requestErrors.assetId }"
                          >
                            <label class="form-label small field-label required-label">
                              <span class="d-none d-sm-inline">Tài sản</span>
                              <span class="d-inline d-sm-none">
                                <i class="fa-solid fa-building me-1"></i>Tài sản
                              </span>
                            </label>
                            <small v-if="requestErrors.assetId" class="invalid-hint">{{ requestErrors.assetId }}</small>
                            <select
                                class="form-select form-select-sm"
                                :class="{ 'is-invalid': requestErrors.assetId }"
                                v-model="requestForm.assetId"
                            >
                              <option value="">-- Chọn tài sản --</option>
                              <option v-for="asset in assets" :key="asset.id" :value="asset.id">
                                {{ formatAddress(asset.address) }} ({{ asset.totalArea }} m²)
                              </option>
                            </select>
                          </div>

                          <div v-else class="row g-3 mb-3">
                            <div
                                class="col-12 field-group"
                                :class="{ 'has-error': requestErrors.newAsset.address }"
                            >
                              <label class="form-label small field-label required-label">
                                <span class="d-none d-sm-inline">Địa chỉ tài sản mới</span>
                                <span class="d-inline d-sm-none">
                                  <i class="fa-solid fa-location-dot me-1"></i>Địa chỉ
                                </span>
                              </label>
                              <small v-if="requestErrors.newAsset.address" class="invalid-hint">
                                {{ requestErrors.newAsset.address }}
                              </small>
                              <AddressSelector4 v-model="requestForm.newAsset.address"/>
                            </div>
                            <div class="col-12 field-group">
                              <label class="form-label small field-label">Địa chỉ cũ (nếu có)</label>
                              <input
                                  type="text"
                                  class="form-control form-control-sm"
                                  v-model="requestForm.newAsset.oldAddress"
                                  placeholder="Địa chỉ trước đây nếu đã chuyển đổi"
                              />
                            </div>
                            <div
                                class="col-12 col-md-6 field-group"
                                :class="{ 'has-error': requestErrors.newAsset.plotNumber }"
                            >
                              <label class="form-label small field-label required-label">
                                <span class="d-none d-sm-inline">Số tờ bản đồ</span>
                                <span class="d-inline d-sm-none">
                                  <i class="fa-solid fa-table-list me-1"></i>Số tờ
                                </span>
                              </label>
                              <small v-if="requestErrors.newAsset.plotNumber" class="invalid-hint">
                                {{ requestErrors.newAsset.plotNumber }}
                              </small>
                              <input
                                  type="text"
                                  class="form-control form-control-sm"
                                  :class="{ 'is-invalid': requestErrors.newAsset.plotNumber }"
                                  v-model="requestForm.newAsset.plotNumber"
                              />
                            </div>
                            <div
                                class="col-12 col-md-6 field-group"
                                :class="{ 'has-error': requestErrors.newAsset.parcelNumber }"
                            >
                              <label class="form-label small field-label required-label">
                                <span class="d-none d-sm-inline">Số thửa</span>
                                <span class="d-inline d-sm-none">
                                  <i class="fa-solid fa-hashtag me-1"></i>Số thửa
                                </span>
                              </label>
                              <small v-if="requestErrors.newAsset.parcelNumber" class="invalid-hint">
                                {{ requestErrors.newAsset.parcelNumber }}
                              </small>
                              <input
                                  type="text"
                                  class="form-control form-control-sm"
                                  :class="{ 'is-invalid': requestErrors.newAsset.parcelNumber }"
                                  v-model="requestForm.newAsset.parcelNumber"
                              />
                            </div>
                            <div
                                class="col-12 col-md-6 field-group"
                                :class="{ 'has-error': requestErrors.newAsset.totalArea }"
                            >
                              <label class="form-label small field-label required-label">
                                <span
                                    class="d-none d-sm-inline">Diện tích tổng (m²)</span><i>{{ formatSquareNumber5555(requestForm.newAsset.totalArea) }}</i>
                                <span class="d-inline d-sm-none">
                                  <i class="fa-solid fa-ruler-combined me-1"></i>DT tổng
                                </span>
                              </label>
                              <small v-if="requestErrors.newAsset.totalArea" class="invalid-hint">
                                {{ requestErrors.newAsset.totalArea }}
                              </small>
                              <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  class="form-control form-control-sm"
                                  :class="{ 'is-invalid': requestErrors.newAsset.totalArea }"
                                  v-model.number="requestForm.newAsset.totalArea"
                              />
                            </div>
                            <div class="col-12 col-md-6">
                              <label class="form-label small field-label">Diện tích sàn
                                (m²)</label><i>{{ formatSquareNumber5555(requestForm.newAsset.floorArea) }}</i>
                              <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  class="form-control form-control-sm"
                                  v-model.number="requestForm.newAsset.floorArea"
                              />
                            </div>
                            <div class="row g-3">
                              <!-- Quyền sử dụng tài sản -->
                              <div
                                  class="col-12 col-md-6 field-group"
                                  :class="{ 'has-error': requestErrors.newAsset.landUseRight }"
                              >
                                <label class="form-label small field-label required-label">
                                  <span class="d-none d-sm-inline">Quyền sử dụng tài sản</span>
                                  <span class="d-inline d-sm-none">Quyền SDĐ</span>
                                </label>
                                <small v-if="requestErrors.newAsset.landUseRight" class="invalid-hint">
                                  {{ requestErrors.newAsset.landUseRight }}
                                </small>

                                <!-- Select -->
                                <select
                                    v-model="landUseChoice"
                                    class="form-select form-select-sm mb-2"
                                    :class="{ 'is-invalid': requestErrors.newAsset.landUseRight }"
                                >
                                  <option value="">-- Chọn loại quyền --</option>
                                  <option value="Sổ đỏ lâu dài">Sổ đỏ lâu dài</option>
                                  <option value="Sổ hồng">Sổ hồng</option>
                                  <option value="Sổ đỏ 50 năm">Sổ đỏ 50 năm</option>
                                  <option value="Đang chờ cấp sổ">Đang chờ cấp sổ</option>
                                  <option value="Giấy tờ khác">Giấy tờ khác</option>
                                  <option value="Khác">Khác</option>
                                </select>

                                <!-- Input tự nhập -->
                                <input
                                    v-if="landUseChoice === 'Khác'"
                                    v-model="requestForm.newAsset.landUseRight"
                                    type="text"
                                    class="form-control form-control-sm"
                                    placeholder="Nhập loại quyền khác..."
                                />
                              </div>

                              <!-- Vị trí đất -->
                              <div
                                  class="col-12 col-md-6 field-group"
                                  :class="{ 'has-error': requestErrors.newAsset.landPosition }"
                              >
                                <label class="form-label small field-label required-label">
                                  <span class="d-none d-sm-inline">Vị trí</span>
                                  <span class="d-inline d-sm-none">Vị trí</span>
                                </label>
                                <small v-if="requestErrors.newAsset.landPosition" class="invalid-hint">
                                  {{ requestErrors.newAsset.landPosition }}
                                </small>

                                <!-- Select -->
                                <select
                                    v-model="landPositionChoice"
                                    class="form-select form-select-sm mb-2"
                                    :class="{ 'is-invalid': requestErrors.newAsset.landPosition }"
                                >
                                  <option value="">-- Chọn vị trí --</option>
                                  <option value="Mặt tiền">Mặt tiền</option>
                                  <option value="Hẻm">Hẻm</option>
                                  <option value="Hẻm cụt">Hẻm cụt</option>
                                  <option value="Khu dân cư">Khu dân cư</option>
                                  <option value="Mặt tiền đường lớn">Mặt tiền đường lớn</option>
                                  <option value="Khác">Khác</option>
                                </select>

                                <!-- Input tự nhập -->
                                <input
                                    v-if="landPositionChoice === 'Khác'"
                                    v-model="requestForm.newAsset.landPosition"
                                    type="text"
                                    class="form-control form-control-sm"
                                    placeholder="Nhập vị trí khác..."
                                />
                              </div>
                            </div>
                            <div
                                class="col-12 field-group"
                                :class="{ 'has-error': requestErrors.newAsset.ownershipRelation }"
                            >
                              <label class="form-label small field-label required-label">
                                <span class="d-none d-sm-inline">Quan hệ sở hữu</span>
                                <span class="d-inline d-sm-none">QH sở hữu</span>
                              </label>
                              <small v-if="requestErrors.newAsset.ownershipRelation" class="invalid-hint">
                                {{ requestErrors.newAsset.ownershipRelation }}
                              </small>

                              <!-- Select -->
                              <select
                                  v-model="ownershipChoice"
                                  class="form-select form-select-sm mb-2"
                                  :class="{ 'is-invalid': requestErrors.newAsset.ownershipRelation }"
                              >
                                <option value="">-- Chọn quan hệ sở hữu --</option>
                                <option value="Sở hữu riêng">Sở hữu riêng</option>
                                <option value="Sở hữu chung">Sở hữu chung</option>
                                <option value="Đồng sở hữu">Đồng sở hữu</option>
                                <option value="Khác">Khác</option>
                              </select>

                              <!-- Nếu chọn "Khác" thì hiển thị input tự nhập -->
                              <input
                                  v-if="ownershipChoice === 'Khác'"
                                  v-model="requestForm.newAsset.ownershipRelation"
                                  type="text"
                                  class="form-control form-control-sm"
                                  placeholder="Nhập quan hệ sở hữu khác..."
                              />

                              <!-- Nếu chọn giá trị bình thường thì gán trực tiếp -->
                              <input
                                  v-else
                                  v-model="ownershipChoice"
                                  type="hidden"
                              />
                            </div>

                            <div
                                class="col-12 field-group"
                                :class="{ 'has-error': requestErrors.newAsset.structure }"
                            >
                              <label class="form-label small field-label required-label">Kết cấu nhà/ hình dạng
                                đất </label>
                              <small v-if="requestErrors.newAsset.structure" class="invalid-hint">
                                {{ requestErrors.newAsset.structure }}
                              </small>
                              <input
                                  type="text"
                                  class="form-control form-control-sm"
                                  :class="{ 'is-invalid': requestErrors.newAsset.structure }"
                                  v-model="requestForm.newAsset.structure"
                                  placeholder="Ví dụ: 1 trệt 2 lầu, nhà cấp 4/ hình chữ nhật..."
                              />
                            </div>
                            <div
                                class="col-12 field-group"
                                :class="{ 'has-error': requestErrors.newAsset.desire }"
                            >
                              <label class="form-label small field-label required-label">Mức giá mong muốn (VNĐ)</label><i
                                class="small ">{{ convertToWords(requestForm.newAsset.desire) }}</i>
                              <small v-if="requestErrors.newAsset.desire" class="invalid-hint">
                                {{ requestErrors.newAsset.desire }}
                              </small>
                              <input
                                  type="number"
                                  min="0"
                                  step="1000000"
                                  class="form-control form-control-sm"
                                  :class="{ 'is-invalid': requestErrors.newAsset.desire }"
                                  v-model.number="requestForm.newAsset.desire"
                                  placeholder="Ví dụ: 100000000"
                              />
                            </div>
                            <div
                                class="col-12 field-group"
                                :class="{ 'has-error': requestErrors.newAsset.files }"
                            >
                              <label
                                  class="form-label small d-flex align-items-center justify-content-between required-label">
                                <span class="d-none d-sm-inline">Hình ảnh & tài liệu</span>
                                <span class="d-inline d-sm-none"><i class="fa-solid fa-paperclip me-1"></i>Tệp</span>
                                <span class="text-muted fw-normal">{{ requestForm.newAsset.files.length }} tệp</span>
                              </label>
                              <small v-if="requestErrors.newAsset.files" class="invalid-hint">
                                {{ requestErrors.newAsset.files }}
                              </small>
                              <FileOrLand
                                  :key="'request-new-asset'"
                                  :fileList="requestForm.newAsset.files"
                                  :entityId="null"
                                  :allow-download-all="false"
                                  entityType="land"
                                  :canEdit="true"
                                  @update:files="handleRequestAssetFilesUpdate"
                                  class="mt-2"
                              />

                            </div>
                          </div>

                          <div v-if="requestForm.assetOption === 'existing' || !requestForm.onBehalf" class="row g-2 g-md-3 mb-3">
                            <div
                                class="col-12 col-md-6 field-group"
                                :class="{ 'has-error': requestErrors.contact.name }"
                            >
                              <label class="form-label small field-label required-label">
                                <span class="d-none d-sm-inline">Họ và tên</span>
                                <span class="d-inline d-sm-none"><i class="fa-solid fa-user me-1"></i>Họ tên</span>
                              </label>
                              <small v-if="requestErrors.contact.name" class="invalid-hint">
                                {{ requestErrors.contact.name }}
                              </small>
                              <input
                                  type="text"
                                  class="form-control form-control-sm"
                                  :class="{ 'is-invalid': requestErrors.contact.name }"
                                  v-model="requestForm.contactName"
                                  readonly
                              />
                            </div>
                            <div
                                class="col-12 col-md-6 field-group"
                                :class="{ 'has-error': requestErrors.contact.phone }"
                            >
                              <label class="form-label small field-label required-label">
                                <span class="d-none d-sm-inline">Số điện thoại</span>
                                <span class="d-inline d-sm-none"><i class="fa-solid fa-phone me-1"></i>Điện thoại</span>
                              </label>
                              <small v-if="requestErrors.contact.phone" class="invalid-hint">
                                {{ requestErrors.contact.phone }}
                              </small>
                              <input
                                  type="tel"
                                  pattern="^(?:\+84|0)\d{9}$"
                                  inputmode="tel"
                                  class="form-control form-control-sm"
                                  :class="{ 'is-invalid': requestErrors.contact.phone }"
                                  v-model="requestForm.contactPhone"
                                  readonly
                              />
                            </div>
                            <div
                                class="col-12 field-group"
                                :class="{ 'has-error': requestErrors.contact.email }"
                            >
                              <label class="form-label small field-label required-label">
                                <span class="d-none d-sm-inline">Email</span>
                                <span class="d-inline d-sm-none"><i class="fa-solid fa-envelope me-1"></i>Email</span>
                              </label>
                              <small v-if="requestErrors.contact.email" class="invalid-hint">
                                {{ requestErrors.contact.email }}
                              </small>
                              <input
                                  type="email"
                                  class="form-control form-control-sm"
                                  :class="{ 'is-invalid': requestErrors.contact.email }"
                                  v-model="requestForm.contactEmail"
                                  readonly
                              />
                            </div>
                          </div>
                          <div v-else class="mb-3 p-3 border rounded-4 bg-light">
                            <div class="d-flex gap-3 flex-wrap mb-3">
                              <div class="form-check">
                                <input
                                    id="owner-existing"
                                    v-model="requestForm.ownerOption"
                                    class="form-check-input"
                                    type="radio"
                                    value="existing"
                                />
                                <label class="form-check-label small" for="owner-existing">Chọn chủ đã có</label>
                              </div>
                              <div class="form-check">
                                <input
                                    id="owner-new"
                                    v-model="requestForm.ownerOption"
                                    class="form-check-input"
                                    type="radio"
                                    value="new"
                                />
                                <label class="form-check-label small" for="owner-new">Nhập chủ mới</label>
                              </div>
                            </div>
                            <div v-if="requestForm.ownerOption === 'existing'" class="row g-2 align-items-end">
                              <div class="col-12 col-md-9">
                                <label class="form-label small mb-1">Tìm chủ theo SĐT</label>
                                <input
                                    v-model="requestForm.existingOwnerPhone"
                                    type="tel"
                                    class="form-control form-control-sm"
                                    placeholder="Nhập số điện thoại chủ"
                                />
                              </div>
                              <div class="col-12 col-md-3 d-flex align-items-end ">
                                <button type="button" style="padding: 7px 0; border-radius: 12px !important;"
                                        class="btn btn-primary btn-sm w-100" @click="handleExistingOwnerLookup">
                                  OK
                                </button>
                              </div>
                                <div v-if="requestForm.existingOwner !== null && thongBao === null">
                                  <strong>
                                    <span v-if="requestForm.existingOwner.gender === true">Anh</span>
                                    <span v-else-if="requestForm.existingOwner.gender === false">Chị</span>
                                    <span v-else>Anh/Chị</span>
                                    {{ requestForm.existingOwner.fullName }}
                                  </strong>
                                  <br>

                                  <div class="mb-1">
                                    <i class="fa-solid fa-phone text-primary me-1"></i>
                                    {{ requestForm.existingOwner.phone }}
                                  </div>

                                  <div class="mb-1">
                                    <i class="fa-solid fa-location-dot text-danger me-1"></i>
                                    {{ formatAddress(requestForm.existingOwner.newAddress) }}
                                  </div>

                                  <div v-if="requestForm.existingOwner.oldAddress" class="text-muted">
                                    <i class="fa-solid fa-house text-secondary me-1"></i>
                                    Địa chỉ cũ: {{ requestForm.existingOwner.oldAddress }}
                                  </div>
                                </div>

                                <div v-if="requestForm.existingOwner === null && thongBao !== null">
                                    <span class="d-inline-flex align-items-center text-danger" style="font-size:16px;">
                                      <i class="fa-solid fa-triangle-exclamation me-1"></i>
                                      {{ thongBao }}
                                    </span>
                                </div>
                            </div>
                            <div v-else class="row g-2 g-md-3">
                              <div class="col-12 col-md-6 field-group">
                                <label class="form-label small field-label">Họ và tên chủ mới</label>
                                <input
                                    v-model="requestForm.newOwner.fullName"
                                    type="text"
                                    class="form-control form-control-sm"
                                    placeholder="Nhập họ tên chủ mới"
                                />
                              </div>
                              <div class="col-12 col-md-6 field-group">
                                <label class="form-label small field-label">Số điện thoại</label>
                                <input
                                    v-model="requestForm.newOwner.phone"
                                    type="tel"
                                    class="form-control form-control-sm"
                                    placeholder="Nhập số điện thoại chủ mới"
                                />
                              </div>
                              <div class="col-12 col-md-6 field-group">
                                <label class="form-label small field-label">Giới tính</label>
                                <select v-model="requestForm.newOwner.gender" class="form-select form-select-sm">
                                  <option :value="null">Không xác định</option>
                                  <option :value="true">Nam</option>
                                  <option :value="false">Nữ</option>
                                </select>
                              </div>
                              <div class="col-12 field-group">
                                <label class="form-label small field-label">Địa chỉ mới</label>
                                <AddressSelector4 v-model="requestForm.newOwner.newAddress"/>
                              </div>
                              <div class="col-12 field-group">
                                <label class="form-label small field-label">Địa chỉ cũ (nếu có)</label>
                                <input
                                    v-model="requestForm.newOwner.oldAddress"
                                    type="text"
                                    class="form-control form-control-sm"
                                    placeholder="Nhập địa chỉ cũ"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                            class="card-footer bg-white border-0 px-3 px-md-4 py-3 d-flex flex-wrap gap-2 justify-content-between">
                          <div class="text-muted small">
                            <i class="fa-regular fa-clock me-1 me-md-2"></i>Phản hồi: 1-2 phút giờ làm việc.
                          </div>
                          <button v-if="requestForm.assetOption === 'existing'" type="button"
                                  class="btn btn-primary btn-sm rounded-3" @click="submitRequest">
                            <i class="fa-solid fa-paper-plane me-1 me-md-2"></i>Gửi yêu cầu
                          </button>
                          <button v-else class="btn btn-primary btn-sm rounded-3" type="button"
                                  @click="submitNewAssetAndRequest">
                            <i class="fa-solid fa-paper-plane me-1 me-md-2"></i>Gửi yêu cầu
                          </button>
                        </div>
                      </form>
                    </div>
                    <div class="col-12 col-lg-5">
                      <aside class="request-aside card border-0 bg-light h-100">
                        <div class="card-body p-3 p-md-4">
                          <h6 class="fw-semibold text-primary mb-2 mb-md-3 fs-6">Mẹo để định giá chính xác</h6>
                          <ul class="list-unstyled text-muted small mb-3 mb-md-4">
                            <li class="mb-2 mb-md-3">
                              <i class="fa-solid fa-circle-check me-2 text-success"></i>Cập nhật giấy tờ pháp lý và hình
                              ảnh mới nhất của tài sản.
                            </li>
                            <li class="mb-2 mb-md-3">
                              <i class="fa-solid fa-circle-check me-2 text-success"></i>Nêu rõ kỳ vọng giá để chuyên gia
                              có cơ sở so sánh.
                            </li>
                            <li class="mb-2 mb-md-3">
                              <i class="fa-solid fa-circle-check me-2 text-success"></i>Ưu đãi, định giá chi tiết-chính
                              xác với giá chỉ từ 500k.
                            </li>
                          </ul>
                          <div class="p-3 bg-white rounded-3 rounded-md-4 shadow-sm">
                            <div class="d-flex align-items-start gap-2 gap-md-3">
                              <i class="fa-solid fa-phone-volume text-primary mt-1"></i>
                              <div class="small text-muted">
                                <div class="fw-semibold text-dark">Hotline hỗ trợ</div>
                                <div>0911 231 882</div>
                              </div>
                            </div>
                            <div class="d-flex align-items-start gap-2 gap-md-3">
                              <i class="fa-solid fa-envelope text-danger"></i>
                              <div class="small text-muted">
                                <div class="fw-semibold text-dark">Hotline hỗ trợ</div>
                                <div>thienhalandgroupvn@gmail.com</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </aside>
                    </div>
                  </div>
                </div>
              </transition>
            </section>
          </div>

          <!-- ADD ASSET FORM VIEW -->
          <div v-else-if="viewMode === 'addAsset'" key="addAsset" class="article-view position-relative">

            <!-- PARTICLES -->
            <Particles
                id="tsparticles"
                class="particles-bg"
                :options="particleOptions"
            />

            <!-- HEADER -->
            <div class="article-header px-3 px-md-4 px-lg-5 py-3 border-bottom bg-white position-relative">
              <button class="btn btn-link text-decoration-none text-muted px-0 small" @click="returnToList('assets')">
                <i class="fa-solid fa-arrow-left-long me-1 me-md-2"></i>Quay lại danh sách tài sản
              </button>
              <h3 class="fw-semibold text-primary mt-2 mt-md-3 fs-5 fs-md-4">Thêm tài sản mới</h3>
              <p class="text-muted mb-0 small">Nhập thông tin cơ bản về bất động sản của bạn.</p>

              <!-- AIRPLANE ANIMATION -->
              <div class="airplane-container">
                <div class="airplane">
                  <i class="fa-solid fa-plane"></i>
                </div>
              </div>
            </div>

            <div class="px-3 px-md-4 px-lg-5 py-3 py-md-4 article-body position-relative">

              <!-- ⭐⭐⭐ LAYOUT 3 CỘT ⭐⭐⭐ -->
              <div class="row g-4">

                <!-- ============= CỘT 1 - TRÁI ============= -->
                <div class="col-12 col-lg-3">

                  <!-- HƯỚNG DẪN -->
                  <section class="mb-4">
                    <div class="card border-0 shadow-sm"
                         style="border-radius:14px; overflow:hidden; transition:box-shadow .3s ease;">

                      <!-- HEADER -->
                      <div @click="toggleExpand('guide')"
                           style="
           background: linear-gradient(90deg, #6a11cb 0%, #b621fe 100%);
           color:#fff;
           padding:16px 20px;
           cursor:pointer;
           display:flex;
           justify-content:space-between;
           align-items:center;
           font-weight:600;
         ">
                        <h5 style="margin:0; font-size:16px;">
                          <i class="fa-solid fa-book me-2" style="color:#f4d4ff;"></i>
                          Hướng dẫn sử dụng
                        </h5>

                        <i class="fa-solid fa-chevron-down transition-rotate"
                           :class="{ 'rotate-180': expandedSections.guide }"
                           style="color:#f4d4ff; font-size:16px; transition: transform .3s ease;"></i>
                      </div>

                      <!-- BODY -->
                      <transition name="expand">
                        <div v-show="expandedSections.guide"
                             style="background:#fef5ff; padding:22px 26px;">


                          <!-- BƯỚC 1 -->
                          <div style="background:#fff; border-left:4px solid #b621fe; padding:16px; border-radius:10px;
                    box-shadow:0 2px 6px rgba(182,33,254,0.15); margin-bottom:14px;">
                            <div class="d-flex justify-content-between align-items-center">
                              <strong style="color:#6a11cb;">Bước 1: Nhập thông tin tài sản</strong>

                              <!-- Arrow Button -->
                              <i @click.stop="toggleExpand('step1')"
                                 class="fa-solid fa-chevron-down transition-rotate"
                                 :class="{ 'rotate-180': expandedSections.step1 }"
                                 style="
                 background:#f8e7ff;
                 padding:8px 10px;
                 border-radius:8px;
                 color:#6a11cb;
                 font-size:13px;
                 cursor:pointer;
                 transition:transform .3s ease, background .3s ease;
               ">
                              </i>
                            </div>

                            <transition name="expand">
                              <p v-show="expandedSections.step1"
                                 style="margin-top:10px; color:#4a3e4e;">
                                Nhập địa chỉ, diện tích, số tờ – số thửa, pháp lý và hiện trạng tài sản.
                              </p>
                            </transition>
                          </div>


                          <!-- BƯỚC 2 -->
                          <div style="background:#fff; border-left:4px solid #b621fe; padding:16px; border-radius:10px;
                    box-shadow:0 2px 6px rgba(182,33,254,0.15); margin-bottom:14px;">
                            <div class="d-flex justify-content-between align-items-center">
                              <strong style="color:#6a11cb;">Bước 2: Tải hình ảnh</strong>

                              <i @click.stop="toggleExpand('step2')"
                                 class="fa-solid fa-chevron-down transition-rotate"
                                 :class="{ 'rotate-180': expandedSections.step2 }"
                                 style="
                 background:#f8e7ff;
                 padding:8px 10px;
                 border-radius:8px;
                 color:#6a11cb;
                 font-size:13px;
                 cursor:pointer;
                 transition:transform .3s ease;
               ">
                              </i>
                            </div>

                            <transition name="expand">
                              <p v-show="expandedSections.step2"
                                 style="margin-top:10px; color:#4a3e4e;">
                                Tải hình mặt tiền, sổ sách, đường trước nhà và ảnh hiện trạng rõ nét.
                              </p>
                            </transition>
                          </div>


                          <!-- BƯỚC 3 -->
                          <div style="background:#fff; border-left:4px solid #b621fe; padding:16px; border-radius:10px;
                    box-shadow:0 2px 6px rgba(182,33,254,0.15); margin-bottom:14px;">
                            <div class="d-flex justify-content-between align-items-center">
                              <strong style="color:#6a11cb;">Bước 3: Kiểm tra thông tin</strong>

                              <i @click.stop="toggleExpand('step3')"
                                 class="fa-solid fa-chevron-down transition-rotate"
                                 :class="{ 'rotate-180': expandedSections.step3 }"
                                 style="
                 background:#f8e7ff;
                 padding:8px 10px;
                 border-radius:8px;
                 color:#6a11cb;
                 font-size:13px;
                 cursor:pointer;
               ">
                              </i>
                            </div>

                            <transition name="expand">
                              <p v-show="expandedSections.step3"
                                 style="margin-top:10px; color:#4a3e4e;">
                                Kiểm tra kỹ trước khi gửi để tránh sai sót.
                              </p>
                            </transition>
                          </div>


                          <!-- BƯỚC 4 -->
                          <div style="background:#fff; border-left:4px solid #b621fe; padding:16px; border-radius:10px;
                    box-shadow:0 2px 6px rgba(182,33,254,0.15);">
                            <div class="d-flex justify-content-between align-items-center">
                              <strong style="color:#6a11cb;">Bước 4: Gửi tài sản</strong>

                              <i @click.stop="toggleExpand('step4')"
                                 class="fa-solid fa-chevron-down transition-rotate"
                                 :class="{ 'rotate-180': expandedSections.step4 }"
                                 style="
                 background:#f8e7ff;
                 padding:8px 10px;
                 border-radius:8px;
                 color:#6a11cb;
                 font-size:13px;
                 cursor:pointer;
               ">
                              </i>
                            </div>

                            <transition name="expand">
                              <p v-show="expandedSections.step4"
                                 style="margin-top:10px; color:#4a3e4e;">
                                Chuyên viên Thiên Hà Group sẽ liên hệ trong <strong>5–30 phút</strong>.
                              </p>
                            </transition>
                          </div>

                        </div>
                      </transition>

                    </div>
                  </section>

                  <!-- GIỚI THIỆU -->
                  <section class="mb-4">
                    <div class="card border-0 shadow-sm expandable-card">
                      <div class="card-header text-dark py-3 d-flex justify-content-between align-items-center"
                           @click="toggleExpand('intro')">
                        <h5 class="mb-0 fs-6"><i class="fa-solid fa-building me-2"></i>Thiên Hà Group</h5>
                        <i class="fa-solid fa-chevron-down transition-rotate"
                           :class="{ 'rotate-180': expandedSections.intro }"></i>
                      </div>
                      <transition name="expand">
                        <div v-show="expandedSections.intro" class="card-body p-3 p-md-4" style="color: rgba(51,51,51,0.75)">
                          <p><strong>Thiên Hà Group</strong> – hệ sinh thái đa ngành, hướng tới mang lại giá trị thực cho khách hàng và cộng đồng.</p>

                          <ul class="lh-lg">
                            <li>Uy tín – Minh bạch trong mọi giao dịch.</li>
                            <li>Tối ưu giá trị tài sản hiệu quả.</li>
                            <li>Quy trình chuyên nghiệp và nhanh gọn.</li>
                            <li>Dịch vụ toàn diện, hỗ trợ trọn gói.</li>
                            <li>Cam kết giải pháp bền vững, an toàn.</li>
                          </ul>
                        </div>
                      </transition>
                    </div>
                  </section>

                </div>

                <!-- ============= CỘT 2 - GIỮA (FORM) ============= -->
                <div class="col-12 col-lg-6">

                  <!-- 🔥 FORM GỐC CỦA BẠN GIỮ NGUYÊN 100% -->
                  <form @submit.prevent="" class="max-w-800 mx-auto form-highlight rounded-4" >
                    <div class="row g-0 g-md-4 p-0">
                      <div class="col-12">
                        <div class="card border-4 shadow-lg form-main-card m-0"  style="border-radius:15px; border: 0!important; overflow:hidden; margin: 0!important;">
                          <div class="card-header bg-primary text-white py-3">
                            <h5 class="mb-0 fs-6"><i class="fa-solid fa-location-dot me-2"></i>Thông tin tài sản mới</h5>
                          </div>
                          <div class="card-body p-3 p-md-4">
                            <div class="row g-3">
                              <div class="col-12 field-group" :class="{ 'has-error': addAssetErrors.address }" >
                                <label class="form-label small field-label required-label">
                                  <span class="d-none d-sm-inline">Địa chỉ tài sản mới</span>
                                  <span class="d-inline d-sm-none">
                                    <i class="fa-solid fa-location-dot me-1"></i>Địa chỉ
                                  </span>
                                </label>
                                <small v-if="addAssetErrors.address" class="invalid-hint">
                                  {{ addAssetErrors.address }}
                                </small>
                                <AddressSelector4 v-model="newAssetForm.address" />
                              </div>
                              <div class="col-12 field-group">
                                <label class="form-label small field-label">Địa chỉ cũ (nếu có)</label>
                                <input type="text" class="form-control form-control-sm" v-model="newAssetForm.oldAddress" placeholder="Địa chỉ trước đây nếu đã chuyển đổi" />
                              </div>
                              <div class="col-12 col-md-6 field-group" :class="{ 'has-error': addAssetErrors.plotNumber }" >
                                <label class="form-label small field-label required-label">
                                  <span class="d-none d-sm-inline">Số tờ bản đồ</span>
                                  <span class="d-inline d-sm-none"><i class="fa-solid fa-table-list me-1"></i>Số tờ</span>
                                </label>
                                <small v-if="addAssetErrors.plotNumber" class="invalid-hint">
                                  {{ addAssetErrors.plotNumber }}
                                </small>
                                <input type="text" class="form-control form-control-sm" :class="{ 'is-invalid': addAssetErrors.plotNumber }" v-model="newAssetForm.plotNumber" />
                              </div>
                              <div class="col-12 col-md-6 field-group" :class="{ 'has-error': addAssetErrors.parcelNumber }" >
                                <label class="form-label small field-label required-label">
                                  <span class="d-none d-sm-inline">Số thửa</span>
                                  <span class="d-inline d-sm-none"><i class="fa-solid fa-hashtag me-1"></i>Số thửa</span>
                                </label>
                                <small v-if="addAssetErrors.parcelNumber" class="invalid-hint">
                                  {{ addAssetErrors.parcelNumber }}
                                </small>
                                <input type="text" class="form-control form-control-sm" :class="{ 'is-invalid': addAssetErrors.parcelNumber }" v-model="newAssetForm.parcelNumber" />
                              </div>
                              <div class="col-12 col-md-6 field-group" :class="{ 'has-error': addAssetErrors.totalArea }" >
                                <label class="form-label small field-label required-label">
                                  <span class="d-none d-sm-inline">Diện tích tổng (m²)</span><i>{{formatSquareNumber5555(newAssetForm.totalArea)}}</i>
                                  <span class="d-inline d-sm-none"><i class="fa-solid fa-ruler-combined me-1"></i>DT tổng</span>
                                </label>
                                <small v-if="addAssetErrors.totalArea" class="invalid-hint">
                                  {{ addAssetErrors.totalArea }}
                                </small>
                                <input type="number" class="form-control form-control-sm" :class="{ 'is-invalid': addAssetErrors.totalArea }" v-model.number="newAssetForm.totalArea" step="0.01" min="0" />
                              </div>
                              <div class="col-12 col-md-6">
                                <label class="form-label small field-label">Diện tích sàn (m²)</label><i>{{formatSquareNumber5555(newAssetForm.floorArea)}}</i>
                                <input type="number" class="form-control form-control-sm" v-model.number="newAssetForm.floorArea" step="0.01" min="0" />
                              </div>
                              <div class="col-12 col-md-6 field-group" :class="{ 'has-error': addAssetErrors.landUseRight }" >
                                <label class="form-label small field-label required-label">
                                  <span class="d-none d-sm-inline">Quyền sử dụng tài sản</span>
                                  <span class="d-inline d-sm-none">Quyền SDTS</span>
                                </label>
                                <small v-if="addAssetErrors.landUseRight" class="invalid-hint">
                                  {{ addAssetErrors.landUseRight }}
                                </small>
                                <select class="form-select form-select-sm mb-2" v-model="newLandUseChoice" :class="{ 'is-invalid': addAssetErrors.landUseRight }">
                                  <option value="">-- Chọn loại quyền --</option>
                                  <option value="Sổ đỏ lâu dài">Sổ đỏ lâu dài</option>
                                  <option value="Sổ hồng">Sổ hồng</option>
                                  <option value="Sổ đỏ 50 năm">Sổ đỏ 50 năm</option>
                                  <option value="Đang chờ cấp sổ">Đang chờ cấp sổ</option>
                                  <option value="Giấy tờ khác">Giấy tờ khác</option>
                                  <option value="Khác">Khác</option>
                                </select>
                                <input v-if="newLandUseChoice === 'Khác'" type="text" class="form-control form-control-sm" v-model="newAssetForm.landUseRight" placeholder="Nhập loại quyền khác..." />
                              </div>
                              <!-- Vị trí đất -->
                              <div class="col-12 col-md-6 field-group" :class="{ 'has-error': addAssetErrors.landPosition }" >
                                <label class="form-label small field-label required-label">
                                  <span class="d-none d-sm-inline">Vị trí</span>
                                  <span class="d-inline d-sm-none">Vị trí</span>
                                </label>
                                <small v-if="addAssetErrors.landPosition" class="invalid-hint">
                                  {{ addAssetErrors.landPosition }}
                                </small>
                                <select class="form-select form-select-sm mb-2" v-model="newLandPositionChoice" :class="{ 'is-invalid': addAssetErrors.landPosition }">
                                  <option value="">-- Chọn vị trí --</option>
                                  <option value="Mặt tiền">Mặt tiền</option>
                                  <option value="Hẻm">Hẻm</option>
                                  <option value="Hẻm cụt">Hẻm cụt</option>
                                  <option value="Khu dân cư">Khu dân cư</option>
                                  <option value="Mặt tiền đường lớn">Mặt tiền đường lớn</option>
                                  <option value="Khác">Khác</option>
                                </select>
                                <input v-if="newLandPositionChoice === 'Khác'" type="text" class="form-control form-control-sm" v-model="newAssetForm.landPosition" placeholder="Nhập vị trí khác..." />
                              </div>
                              <!-- Quan hệ sở hữu -->
                              <div class="col-12 field-group" :class="{ 'has-error': addAssetErrors.ownershipRelation }" >
                                <label class="form-label small field-label required-label">
                                  <span class="d-none d-sm-inline">Quan hệ sở hữu</span>
                                  <span class="d-inline d-sm-none">QH sở hữu</span>
                                </label>
                                <small v-if="addAssetErrors.ownershipRelation" class="invalid-hint">
                                  {{ addAssetErrors.ownershipRelation }}
                                </small>
                                <select class="form-select form-select-sm mb-2" v-model="newOwnershipChoice" :class="{ 'is-invalid': addAssetErrors.ownershipRelation }">
                                  <option value="">-- Chọn quan hệ sở hữu --</option>
                                  <option value="Sở hữu riêng">Sở hữu riêng</option>
                                  <option value="Sở hữu chung">Sở hữu chung</option>
                                  <option value="Đồng sở hữu">Đồng sở hữu</option>
                                  <option value="Khác">Khác</option>
                                </select>
                                <input v-if="newOwnershipChoice === 'Khác'" v-model="newAssetForm.ownershipRelation" type="text" class="form-control form-control-sm" placeholder="Nhập quan hệ sở hữu khác..." />
                              </div>
                              <div class="col-12 field-group" :class="{ 'has-error': addAssetErrors.structure }" >
                                <label class="form-label small field-label required-label">Kết cấu nhà/ hình dạng đất</label>
                                <small v-if="addAssetErrors.structure" class="invalid-hint">
                                  {{ addAssetErrors.structure }}
                                </small>
                                <input type="text" class="form-control form-control-sm" :class="{ 'is-invalid': addAssetErrors.structure }" v-model="newAssetForm.structure" placeholder="Ví dụ: 1 trệt 2 lầu, nhà cấp 4/ hình chữ nhật..." />
                              </div>
                              <div class="col-12 field-group" :class="{ 'has-error': addAssetErrors.desire }" >
                                <label class="form-label small field-label required-label">Mức giá mong muốn (VNĐ)</label><i>{{ convertToWords(newAssetForm.desire) }}</i>
                                <small v-if="addAssetErrors.desire" class="invalid-hint">
                                  {{ addAssetErrors.desire }}
                                </small>
                                <input type="number" class="form-control form-control-sm" min="0" step="1000000" :class="{ 'is-invalid': addAssetErrors.desire }" v-model.number="newAssetForm.desire" placeholder="Nhập giá mong muốn" />
                              </div>
                              <div class="col-12 field-group" :class="{ 'has-error': addAssetErrors.files }" >
                                <label class="form-label small d-flex justify-content-between required-label">
                                  <span class="d-none d-sm-inline">Hình ảnh & tài liệu</span>
                                  <span class="d-inline d-sm-none"><i class="fa-solid fa-paperclip me-1"></i>Tệp</span>
                                  <span class="text-muted fw-normal">{{ newAssetForm.files.length }} tệp</span>
                                </label>
                                <small v-if="addAssetErrors.files" class="invalid-hint">
                                  {{ addAssetErrors.files }}
                                </small>
                                <FileOrLand :key="'new-asset'" :fileList="newAssetForm.files" :entityId="null" entityType="land" :canEdit="true" :allow-download-all="false" @update:files="handleNewAssetFilesUpdate" class="mt-2" />
                              </div>
                            </div>
                            <div class="d-flex flex-wrap gap-2 gap-md-3 p-2">
                              <button type="button" class="btn btn-outline-secondary btn-sm fs-6 rounded-2" @click="returnToList('assets')" style="margin-left: auto">
                                <i class="fa-solid fa-times me-1 me-md-2"></i>Hủy bỏ
                              </button>
                              <button type="button" class="btn btn-primary btn-sm fs-6 rounded-2" @click="submitNewAsset">
                                <i class="fa-solid fa-paper-plane me-1 me-md-2"></i>Thêm tài sản mới
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                      <div class="col-12">

                      </div>
                    </div>
                  </form>

                </div>

                <!-- ============= CỘT 3 - PHẢI ============= -->
                <div class="col-12 col-lg-3">

                  <!-- BÁN NHANH 30 NGÀY -->
                  <section class="mb-4">
                    <div class="card border-0 shadow-sm expandable-card"
                         style="border-radius:14px; overflow:hidden; transition:box-shadow .3s ease;">

                      <!-- HEADER -->
                      <div @click="toggleExpand('fastSell')"
                           style="
           background: linear-gradient(90deg, #1a1a1a 0%, #2b2b2b 100%);
           color: #f4c542;
           cursor: pointer;
           user-select: none;
           padding: 16px 20px;
           font-weight: 600;
           letter-spacing: .5px;
           display:flex;
           justify-content:space-between;
           align-items:center;
           transition:background .3s ease, padding .3s ease;
         ">
                        <h5 style="margin:0; font-size:16px; color:#f4c542;">
                          <i class="fa-solid fa-crown me-2" style="color:#f4c542;"></i>
                          Bán nhanh 30 ngày
                        </h5>

                        <i class="fa-solid fa-chevron-down transition-rotate"
                           :class="{ 'rotate-180': expandedSections.fastSell }"
                           style="color:#f4c542; transition:transform .3s ease;"></i>
                      </div>

                      <!-- BODY -->
                      <transition name="expand">
                        <div v-show="expandedSections.fastSell"
                             style="
             padding: 24px 26px;
             background: #fff7e0;
             color: #4a3e12;
             border-top: 3px solid #f4c542;
             animation: fadeIn .4s ease;
           ">

                          <p style="font-weight:500; font-size:15px;">
                            Chuyên viên <b style="color:#d4a017;">Thiên Hà Group</b> hỗ trợ bạn bán nhanh chỉ trong 30 ngày.
                          </p>

                          <ul class="lh-lg" style="margin-left:4px; font-size:15px;">
                            <li><span style="color:#d4a017; font-weight:700;">•</span> Định giá chuẩn thị trường</li>
                            <li><span style="color:#d4a017; font-weight:700;">•</span> Data khách mua thực mỗi ngày</li>
                            <li><span style="color:#d4a017; font-weight:700;">•</span> Marketing BĐS đa kênh</li>
                            <li><span style="color:#d4a017; font-weight:700;">•</span> Hỗ trợ pháp lý – quy hoạch</li>
                            <li><span style="color:#d4a017; font-weight:700;">•</span> Đàm phán giá bán tối ưu</li>
                            <li><span style="color:#d4a017; font-weight:700;">•</span> Chăm sóc khách hàng xuyên suốt</li>
                          </ul>

                          <div style="
               background:#fff0c2;
               border-left:5px solid #d4a017;
               padding:14px;
               color:#5c490c;
               font-weight:600;
               border-radius:8px;
               box-shadow:0 3px 10px rgba(212,160,23,.25);
               margin-top:14px;
             ">
                            <i class="fa-solid fa-star me-2" style="color:#d4a017;"></i>
                            Miễn phí tư vấn & phân tích giá trị!
                          </div>

                        </div>
                      </transition>

                    </div>
                  </section>


                  <!-- FAQ -->
                  <section class="mb-4">
                    <div class="card border-0 shadow-sm expandable-card">
                      <div class="card-header text-dark py-3 d-flex justify-content-between align-items-center"
                           @click="toggleExpand('faq')">
                        <h5 class="mb-0 fs-6"><i class="fa-solid fa-circle-question me-2"></i>FAQ</h5>
                        <i class="fa-solid fa-chevron-down transition-rotate"
                           :class="{ 'rotate-180': expandedSections.faq }"></i>
                      </div>

                      <transition name="expand">
                        <div v-show="expandedSections.faq" class="card-body p-3 p-md-4" style="color: rgba(51,51,51,0.75)">

                          <details class="mb-3">
                            <summary class="fw-semibold">Cần gì để đăng tài sản?</summary>
                            <p class="mt-2">Chỉ cần hình ảnh + thông tin cơ bản.</p>
                          </details>

                          <details class="mb-3">
                            <summary class="fw-semibold">Có hỗ trợ định giá không?</summary>
                            <p class="mt-2">Có, hệ thống + chuyên gia hỗ trợ miễn phí.</p>
                          </details>

                          <details class="mb-3">
                            <summary class="fw-semibold">Khi nào được liên hệ?</summary>
                            <p class="mt-2">Trong 30 phút kể từ khi gửi tài sản.</p>
                          </details>

                          <details class="mb-3">
                            <summary class="fw-semibold">Tôi có mất phí dịch vụ không?</summary>
                            <p class="mt-2">Không, tư vấn & thẩm định ban đầu đều miễn phí.</p>
                          </details>

                          <details>
                            <summary class="fw-semibold">Thông tin của tôi có được bảo mật?</summary>
                            <p class="mt-2">Có, mọi dữ liệu đều được bảo mật theo tiêu chuẩn nội bộ.</p>
                          </details>

                        </div>
                      </transition>
                    </div>
                  </section>

                </div>

              </div>
              <!-- END ROW -->
            </div>
          </div>

          <!-- CÁC VIEW KHÁC GIỮ NGUYÊN -->
          <!-- ARTICLE-LIKE ASSET DETAIL VIEW -->
          <AssetDetailView
              v-else-if="viewMode === 'assetDetail' && selectedAsset"
              key="assetDetail"
              :asset="selectedAsset"
              :history="assetValuationHistory"
              :profile="profile"
              :format-date="formatDate"
              :format-currency="formatCurrency"
              :status-badge-class="statusBadgeClass"
              @back="returnToList('assets')"
              @edit="openEditAssetForm"
              @request="openRequestFromAsset"
              @open-image="openImageModal"
              @update-files="handleFilesUpdate"
              @download-all="downloadAllFiles"
              @open-report="openValuationDetail"
              @request-open-report="handleOpenReport"
          />
          <!-- EDIT ASSET FORM VIEW -->
          <div v-else-if="viewMode === 'editAsset' && selectedAsset" key="editAsset" class="article-view">
            <div class="article-header px-3 px-md-4 px-lg-5 py-3 border-bottom bg-white">
              <button class="btn btn-link text-decoration-none text-muted px-0 small" @click="returnToAssetDetail()">
                <i class="fa-solid fa-arrow-left-long me-1 me-md-2"></i>Quay lại chi tiết tài sản
              </button>
              <h3 class="fw-semibold text-primary mt-2 mt-md-3 fs-5 fs-md-4">Chỉnh sửa tài sản</h3>
              <p class="text-muted mb-0 small">Cập nhật thông tin tài sản {{ selectedAsset.address }}</p>
            </div>

            <div class="px-3 px-md-4 px-lg-5 py-3 py-md-4 article-body">
              <form @submit.prevent="submitEditAsset" class="max-w-800 mx-auto">
                <div class="row g-3 g-md-4">
                  <div class="col-12">
                    <div class="card border-0 shadow-sm">
                      <div class="card-header bg-primary text-white py-3">
                        <h5 class="mb-0 fs-6">
                          <i class="fa-solid fa-location-dot me-2"></i>Thông tin tài sản
                        </h5>
                      </div>

                      <div class="card-body p-3 p-md-4">
                        <div class="row g-3">

                          <!-- Địa chỉ -->
                          <div class="col-12 field-group" :class="{ 'has-error': editAssetErrors.address }">
                            <label class="form-label small required-label">Địa chỉ tài sản</label>
                            <small v-if="editAssetErrors.address" class="invalid-hint">{{
                                editAssetErrors.address
                              }}</small>
                            <AddressSelector4 v-model="editAssetForm.address"/>
                          </div>

                          <!-- Địa chỉ cũ -->
                          <div class="col-12">
                            <label class="form-label small">Địa chỉ cũ (nếu có)</label>
                            <input type="text" class="form-control form-control-sm"
                                   v-model="editAssetForm.oldAddress"
                                   placeholder="Địa chỉ trước đây nếu đã chuyển đổi"/>
                          </div>

                          <!-- Số tờ bản đồ -->
                          <div class="col-12 col-md-6 field-group" :class="{ 'has-error': editAssetErrors.plotNumber }">
                            <label class="form-label small required-label">Số tờ bản đồ</label>
                            <small v-if="editAssetErrors.plotNumber" class="invalid-hint">{{
                                editAssetErrors.plotNumber
                              }}</small>
                            <input type="text" class="form-control form-control-sm"
                                   :class="{ 'is-invalid': editAssetErrors.plotNumber }"
                                   v-model="editAssetForm.plotNumber"/>
                          </div>

                          <div class="col-12 col-md-6 field-group"
                               :class="{ 'has-error': editAssetErrors.parcelNumber }">
                            <label class="form-label small required-label">Số thửa </label>
                            <small v-if="editAssetErrors.parcelNumber"
                                   class="invalid-hint">{{ editAssetErrors.parcelNumber }}</small>
                            <input type="text" class="form-control form-control-sm"
                                   :class="{ 'is-invalid': editAssetErrors.parcelNumber }"
                                   v-model="editAssetForm.parcelNumber"/>
                          </div>

                          <!-- Diện tích tổng -->
                          <div class="col-12 col-md-6 field-group" :class="{ 'has-error': editAssetErrors.totalArea }">
                            <label class="form-label small required-label">Diện tích tổng
                              (m²)</label><i>{{ convertToWordsSquare(editAssetForm.totalArea) }}</i>
                            <small v-if="editAssetErrors.totalArea" class="invalid-hint">{{
                                editAssetErrors.totalArea
                              }}</small>
                            <input type="number" class="form-control form-control-sm"
                                   :class="{ 'is-invalid': editAssetErrors.totalArea }"
                                   v-model.number="editAssetForm.totalArea"
                                   step="0.01" min="0"/>
                          </div>

                          <!-- Diện tích sàn -->
                          <div class="col-12 col-md-6">
                            <label class="form-label small">Diện tích sàn
                              (m²)</label><i>{{ convertToWordsSquare(editAssetForm.floorArea) }}</i>
                            <input type="number" class="form-control form-control-sm"
                                   v-model.number="editAssetForm.floorArea"
                                   step="0.01" min="0"/>
                          </div>

                          <div class="col-12 col-md-6 field-group"
                               :class="{ 'has-error': editAssetErrors.landUseRight }">
                            <label class="form-label small required-label">Quyền sử dụng tài sản</label>
                            <small v-if="editAssetErrors.landUseRight"
                                   class="invalid-hint">{{ editAssetErrors.landUseRight }}</small>
                            <select class="form-select form-select-sm mb-2"
                                    v-model="editLandUseChoice"
                                    :class="{ 'is-invalid': editAssetErrors.landUseRight }">
                              <option value="">-- Chọn loại quyền --</option>
                              <option value="Sổ đỏ lâu dài">Sổ đỏ lâu dài</option>
                              <option value="Sổ hồng">Sổ hồng</option>
                              <option value="Sổ đỏ 50 năm">Sổ đỏ 50 năm</option>
                              <option value="Đang chờ cấp sổ">Đang chờ cấp sổ</option>
                              <option value="Giấy tờ khác">Giấy tờ khác</option>
                              <option value="Khác">Khác</option>
                            </select>
                            <input v-if="editLandUseChoice === 'Khác'" type="text"
                                   class="form-control form-control-sm"
                                   v-model="editAssetForm.landUseRight"
                                   placeholder="Nhập loại quyền khác..."/>
                          </div>

                          <!-- Vị trí đất -->
                          <div class="col-12 col-md-6 field-group"
                               :class="{ 'has-error': editAssetErrors.landPosition }">
                            <label class="form-label small required-label">Vị trí</label>
                            <small v-if="editAssetErrors.landPosition"
                                   class="invalid-hint">{{ editAssetErrors.landPosition }}</small>
                            <select class="form-select form-select-sm mb-2"
                                    v-model="editLandPositionChoice"
                                    :class="{ 'is-invalid': editAssetErrors.landPosition }">
                              <option value="">-- Chọn vị trí --</option>
                              <option value="Mặt tiền">Mặt tiền</option>
                              <option value="Hẻm">Hẻm</option>
                              <option value="Hẻm cụt">Hẻm cụt</option>
                              <option value="Khu dân cư">Khu dân cư</option>
                              <option value="Mặt tiền đường lớn">Mặt tiền đường lớn</option>
                              <option value="Khác">Khác</option>
                            </select>
                            <input v-if="editLandPositionChoice === 'Khác'" type="text"
                                   class="form-control form-control-sm"
                                   v-model="editAssetForm.landPosition"
                                   placeholder="Nhập vị trí khác..."/>
                          </div>

                          <!-- Quan hệ sở hữu -->
                          <div class="col-12 field-group" :class="{ 'has-error': editAssetErrors.ownershipRelation }">
                            <label class="form-label small required-label">Quan hệ sở hữu</label>
                            <small v-if="editAssetErrors.ownershipRelation"
                                   class="invalid-hint">{{ editAssetErrors.ownershipRelation }}</small>
                            <select class="form-select form-select-sm mb-2"
                                    v-model="editOwnershipChoice"
                                    :class="{ 'is-invalid': editAssetErrors.ownershipRelation }">
                              <option value="">-- Chọn quan hệ sở hữu --</option>
                              <option value="Sở hữu riêng">Sở hữu riêng</option>
                              <option value="Sở hữu chung">Sở hữu chung</option>
                              <option value="Đồng sở hữu">Đồng sở hữu</option>
                              <option value="Khác">Khác</option>
                            </select>
                            <input v-if="editOwnershipChoice === 'Khác'"
                                   v-model="editAssetForm.ownershipRelation"
                                   type="text" class="form-control form-control-sm"
                                   placeholder="Nhập quan hệ sở hữu khác..."/>
                          </div>

                          <!-- Kết cấu -->
                          <div class="col-12 field-group" :class="{ 'has-error': editAssetErrors.structure }">
                            <label class="form-label small required-label">Kết cấu nhà/ hình dạng đất</label>
                            <small v-if="editAssetErrors.structure" class="invalid-hint">{{
                                editAssetErrors.structure
                              }}</small>
                            <input type="text" class="form-control form-control-sm"
                                   :class="{ 'is-invalid': editAssetErrors.structure }"
                                   v-model="editAssetForm.structure"
                                   placeholder="Ví dụ: 1 trệt 2 lầu, nhà cấp 4/ hình chữ nhật..."/>
                          </div>

                          <!-- Giá mong muốn -->
                          <div class="col-12 field-group" :class="{ 'has-error': editAssetErrors.desire }">
                            <label class="form-label small required-label">Mức giá mong muốn
                              (VNĐ)</label><i>{{ convertToWords(editAssetForm.desire) }}</i>
                            <small v-if="editAssetErrors.desire" class="invalid-hint">{{
                                editAssetErrors.desire
                              }}</small>
                            <input type="number" class="form-control form-control-sm"
                                   :class="{ 'is-invalid': editAssetErrors.desire }"
                                   v-model.number="editAssetForm.desire"
                                   min="0" step="1000000"
                                   placeholder="Nhập giá mong muốn nếu có"/>
                          </div>

                          <!-- Hình ảnh -->
                          <div class="col-12 field-group" :class="{ 'has-error': editAssetErrors.files }">
                            <label class="form-label small d-flex justify-content-between required-label">
                              Hình ảnh & tài liệu
                              <span class="text-muted fw-normal">{{ editAssetForm.files.length }} tệp</span>
                            </label>
                            <small v-if="editAssetErrors.files" class="invalid-hint">{{ editAssetErrors.files }}</small>
                            <FileOrLand
                                :fileList="editAssetForm.files"
                                :entityId="selectedAsset.id"
                                entityType="land"
                                :canEdit="true"
                                :allow-download-all="false"
                                @update:files="handleEditAssetFilesUpdate"
                                class="mt-2"
                            />

                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Buttons -->
                  <div class="col-12">
                    <div class="d-flex flex-wrap gap-2 gap-md-3 justify-content-between">
                      <button type="button" class="btn btn-outline-secondary btn-sm" @click="returnToAssetDetail()">
                        <i class="fa-solid fa-times me-1 me-md-2"></i>Hủy bỏ
                      </button>
                      <button type="submit" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-floppy-disk me-1 me-md-2"></i>Cập nhật tài sản
                      </button>
                    </div>
                  </div>

                </div>
              </form>
            </div>
          </div>

          <!-- ARTICLE-LIKE VALUATION DETAIL VIEW -->
          <div
              v-else-if="viewMode === 'valuationDetail' && reportDetail"
              key="valuationDetail"
              class="article-view"
          >
            <!-- Header -->
            <div class="article-header px-3 px-md-4 px-lg-5 py-3 border-bottom bg-white">
              <button
                  class="btn btn-link text-decoration-none text-muted px-0 small"
                  @click="returnToList(selectedValuationOrigin)"
              >
                <i class="fa-solid fa-arrow-left-long me-1 me-md-2"></i>Quay lại danh sách báo cáo
              </button>
              <h3 class="fw-semibold text-primary mt-2 mt-md-3 fs-5 fs-md-4">
                BÁO CÁO KẾT QUẢ ĐỊNH GIÁ SƠ BỘ
                <button
                    class="btn btn-fast-orange-history btn-sm rounded-3" type="button"
                    @click="openFastSale(reportDetail.landAsset.id, null, formatAddress(reportDetail.landAsset.address), 'BN30N')">
                  <i class="fa-solid fa-paper-plane me-1 me-md-2"></i>Bán nhanh 30 ngày
                </button>
              </h3>
              <p class="text-muted mb-0 small">
                {{ formatAddress(reportDetail.landAsset?.address) }}
                • Ngày hiệu lực:
                {{ formatDate(reportDetail.effectiveDate) }}
              </p>
            </div>

            <div class="px-3 px-md-4 px-lg-5 py-3 py-md-4 article-body">
              <!-- Công ty -->
              <section class="mb-4 mb-md-5">
                <h5 class="section-title">Thông tin công ty</h5>
                <ul class="list-unstyled text-muted small">
                  <li><strong>Công ty:</strong> CÔNG TY CỔ PHẦN ĐẦU TƯ BĐS THIÊN HÀ GROUP</li>
                  <li><strong>Trụ sở:</strong> 14 đường 15 KDC Vạn Phúc, P.Hiệp Bình Phước, TP.Thủ Đức, TP.HCM</li>
                  <li><strong>Chi nhánh:</strong> 01 Hoa Lài, P.7, Q.Phú Nhuận, TP.HCM</li>
                </ul>
              </section>

              <!-- Khách hàng -->
              <section class="mb-4 mb-md-5">
                <h5 class="section-title">Thông tin khách hàng</h5>
                <ul class="list-unstyled text-muted small">
                  <li><strong>Tên khách hàng:</strong> {{ reportDetail.owner?.fullName }}</li>
                  <li><strong>Địa chỉ:</strong>
                    {{ formatAddress(reportDetail.owner?.address) || formatAddress(reportDetail.landAsset?.address) }}
                  </li>
                  <li><strong>Số điện thoại:</strong> {{ reportDetail.owner?.phone || "--" }}</li>
                  <li><strong>Email:</strong> {{ reportDetail.owner?.email || "--" }}</li>
                </ul>
              </section>

              <!-- Tài sản -->
              <section class="mb-4 mb-md-5">
                <h5 class="section-title">Thông tin tài sản</h5>
                <div class="row">
                  <div class="col-md-6">
                    <ul class="list-unstyled text-muted small">
                      <li><strong>Địa chỉ tài sản:</strong> {{ formatAddress(reportDetail.landAsset?.address) }}</li>
                      <li><strong>Địa chỉ cũ:</strong> {{ formatAddress(reportDetail.landAsset?.oldAddress) }}</li>
                      <li><strong>Số tờ:</strong> {{ reportDetail.landAsset?.plotNumber }} <strong> Số thửa:</strong>
                        {{ reportDetail.landAsset?.parcelNumber }}
                      </li>
                      <li><strong>Diện tích tổng:</strong> {{ formatNumber(reportDetail.landAsset?.totalArea) }} m²</li>
                      <li><strong>Diện tích sàn:</strong> {{ reportDetail.landAsset?.floorArea || "--" }}</li>
                    </ul>
                  </div>
                  <div class="col-md-6">
                    <ul class="list-unstyled text-muted small">
                      <li><strong>Kết cấu:</strong> {{ reportDetail.landAsset?.structure || "--" }}</li>
                      <li><strong>Quan hệ sở hữu:</strong> {{ reportDetail.landAsset?.ownershipRelation || "--" }}</li>
                      <li><strong>Quyền sử dụng tài sản:</strong> {{ reportDetail.landAsset?.landUseRight }}</li>
                      <li><strong>Vị trí:</strong> {{ reportDetail.landAsset?.landPosition || "--" }}</li>
                      <li><strong>Trạng thái:</strong> {{ reportDetail.landAsset?.status }}</li>
                    </ul>
                  </div>
                </div>
              </section>

              <!-- Quy hoạch -->
              <section class="mb-4 mb-md-5">
                <h5 class="section-title">Quy hoạch & phân loại</h5>
                <ul class="list-unstyled text-muted small">
                  <li><strong>Quy hoạch:</strong> {{ reportDetail.planning }}</li>
                  <li><strong>Phân loại đất:</strong> {{ reportDetail.landClassification }}</li>
                </ul>
              </section>

              <!-- Chi tiết loại đất -->
              <section class="mb-4 mb-md-5">
                <h5 class="section-title">Chi tiết loại đất</h5>
                <div class="table-responsive">
                  <table class="table table-bordered table-hover small">
                    <thead class="table-light">
                    <tr>
                      <th>Loại đất</th>
                      <th>Diện tích (m²)</th>
                      <th>Đơn giá (VNĐ/m²)</th>
                      <th>Thành tiền (VNĐ)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, i) in reportDetail.valuationLandTypeList" :key="i">
                      <td>{{ item.landType }}</td>
                      <td>{{ formatNumber(item.area) }}</td>
                      <td>{{ formatCurrency(item.unitPrice) }}</td>
                      <td>{{ formatCurrency(item.priceValue) }}</td>
                    </tr>
                    </tbody>
                    <tfoot class="table-light">
                    <tr>
                      <td colspan="3" class="text-end fw-semibold">TỔNG GIÁ (VNĐ):</td>
                      <td class="fw-semibold">{{ formatCurrency(reportDetail.totalPrice) }}</td>
                    </tr>
                    <tr>
                      <td colspan="3" class="text-end fw-semibold">Tổng giá trị cao nhất (Làm tròn):</td>
                      <td class="fw-semibold">{{ formatCurrency(reportDetail.totalMaxPrice) }}</td>
                    </tr>
                    </tfoot>
                  </table>
                </div>
              </section>

              <!-- Kết quả định giá -->
              <section class="mb-4 mb-md-5">
                <h5 class="section-title">Kết quả định giá</h5>
                <div class="comparison-panel p-3 p-md-4 rounded-3 shadow-sm bg-white">
                  <div class="row g-2 align-items-center">
                    <div class="col-sm-6">
                      <div class="text-muted small">Tổng giá trị định giá</div>
                      <div class="fw-semibold text-dark fs-5">
                        {{ formatCurrency(reportDetail.totalPrice) }}
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="text-muted small">Bằng chữ</div>
                      <div class="fw-semibold text-dark">
                        {{ convertToWords(reportDetail.totalPrice) }}
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-muted small mt-3 mb-0">
                  <strong>Lưu ý:</strong> Đây là kết quả định giá sơ bộ, chưa phải bản chính thức. Giá có thể thay đổi
                  tùy vị trí thực tế.
                </p>
              </section>

              <!-- Thông tin báo cáo -->
              <section class="mb-4 mb-md-5">
                <h5 class="section-title">Thông tin báo cáo</h5>
                <div class="d-flex flex-wrap gap-3 text-muted small">
                  <span><i class="fa-regular fa-calendar-check me-2 text-primary"></i>Ngày hiệu lực: {{
                      formatDate(reportDetail.effectiveDate)
                    }}</span>
                  <span><i class="fa-regular fa-calendar-check me-2 text-primary"></i>Ngày hết hạn: {{
                      formatDate(reportDetail.expiryDate)
                    }}</span>
                  <span><i
                      class="fa-solid fa-hashtag me-2 text-primary"></i>Lần định giá: {{ reportDetail.valuationRound }}</span>
                  <span><i class="fa-solid fa-building me-2 text-primary"></i>Công ty: THIÊN HÀ GROUP</span>
                </div>
              </section>

              <!-- Tài liệu (bạn tự xử lý phần này) -->
              <section class="mb-4 mb-md-5">
                <h5 class="section-title">Tài liệu báo cáo</h5>
                <div class="mt-3">
                  <h6 class="small fw-semibold">File định giá</h6>
                  <div
                      v-if="reportDetail.filePDF"
                      class="d-flex align-items-center justify-content-between border rounded-4 p-2 px-3 mb-2 bg-light file-item"
                      style="max-width: 450px"
                  >
                    <!-- Cột trái: icon + thông tin file -->
                    <div class="d-flex align-items-center">
                      <i class="fa-solid fa-file-pdf text-danger fs-3 me-3"></i>
                      <div>
                        <div class="fw-semibold text-dark">
                          {{ reportDetail.filePDF.fileName }}
                        </div>
                        <div class="text-muted small">
                          {{ formatDateTime(reportDetail.filePDF.addedAt) }} •
                          {{ reportDetail.filePDF.fileSize ? formatFileSize(reportDetail.filePDF.fileSize) : '--' }}
                        </div>
                      </div>
                    </div>

                    <!-- Cột phải: nút hành động -->
                    <div class="d-flex align-items-center gap-2">
                      <button
                          class="btn btn-sm btn-outline-primary rounded-3"
                          @click="openPdfPreview(reportDetail.filePDF.fileId, reportDetail.filePDF.fileName)"
                      >
                        <i class="fa-solid fa-eye me-1"></i> Xem
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Buttons -->
              <div class="d-flex flex-wrap gap-2">
                <button class="btn btn-outline-primary btn-sm" @click="returnToList(selectedValuationOrigin)">
                  <i class="fa-solid fa-angles-left me-2"></i>Quay lại danh sách
                </button>
              </div>
              <div v-if="pdfPreviewUrl" class="mt-4">
                <div class="d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">Xem file định giá: {{ pdfPreviewName }}</h6>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" @click="clearPdfPreview">Đóng</button>
                    <a class="btn btn-sm btn-primary" :href="pdfPreviewUrl" download> <i
                        class="fa-solid fa-file-arrow-down me-2"/>️ Tải xuống</a>
                  </div>
                </div>
                <div class="ratio ratio-4x3 border rounded mt-2">
                  <iframe :src="pdfPreviewUrl" title="Xem PDF định giá" allowfullscreen></iframe>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <transition name="fade-slide">
        <div v-if="successMessage" class="alert alert-success shadow-sm mt-3 mt-md-4 rounded-3 rounded-md-4"
             role="alert">
          <i class="fa-solid fa-circle-check me-1 me-md-2"></i>{{ successMessage }}
        </div>
      </transition>
    </div>

    <!-- Image Modal -->
    <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true" v-if="selectedImage">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedImage.alt }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <img :src="selectedImage.tempUrl" class="img-fluid rounded-3"
                 :alt="selectedImage.alt" style="max-height: 70vh; object-fit: contain;">
          </div>
        </div>
      </div>
    </div>
    <AppointmentModal
        v-if="showModal"
        :landAssetId="currentLandAssetId"
        :valuationId="currentValuationId"
        :asset-address="currentAddress"
        :purpose="currenPurpose"
        :show="showModal"
        @close="showModal = false"
    />
  </div>
</template>

<script setup>
import {computed, reactive, ref, watch, nextTick, onMounted} from "vue";
import api from "../../../api/api.js";
import { loadPrivateFileDataUrl } from "../../../api/fileApi.js";
import FileOrLand from "../FileOrLand.vue";
import AssetListView from "./components/AssetListView.vue";
import ValuationResultsView from "./components/ValuationResultsView.vue";
import AssetDetailView from "./components/AssetDetailView.vue";
import {Modal} from 'bootstrap';
import {useAuthStore} from "../../../stores/authStore.js";
import AddressSelector4 from "./components/AddressSelector4.vue";
import {showLoading, updateAlertError, updateAlertSuccess} from "../../../assets/js/alertService.js";
import {useRouter} from "vue-router";


import AppointmentModal from "./components/AppointmentModal.vue"

const showModal = ref(false);
const currentLandAssetId = ref(null);
const currentValuationId = ref(null);
const currentAddress = ref(null);
const currenPurpose = ref(null);

function openFastSale(landAssetId, id, address, purpose) {
  // item là object định giá bạn đang loop
  currentLandAssetId.value = landAssetId;
  currentValuationId.value = id; // hoặc item.valuationId tùy BE
  currentAddress.value = address
  showModal.value = true;
  currenPurpose.value = purpose;
}

const authStore = useAuthStore();
const router = useRouter();

/* ---------------------- Xuất PDF (cải tiến) ---------------------- */
const pdfPreviewUrl = ref("");
const pdfPreviewName = ref("");

function clearPdfPreview() {
  if (pdfPreviewUrl.value && pdfPreviewUrl.value.startsWith("blob:")) URL.revokeObjectURL(pdfPreviewUrl.value);
  pdfPreviewUrl.value = "";
  pdfPreviewName.value = "";
}

const profile = reactive({
  fullName: "Nguyễn Minh Khôi",
  email: "khoi.nguyen@example.com",
});

const viewMode = ref("list");
const activeTab = ref("request");
const selectedAsset = ref(null);
const selectedValuation = ref(null);
const selectedValuationOrigin = ref("results");
const successMessage = ref("");
const filterStatus = ref("");
const selectedImage = ref(null);

// Expanded sections state
const expandedSections = reactive({
  guide: true,
  intro: true,
  fastSell: true,
  faq: true
});

function toggleExpand(section) {
  expandedSections[section] = !expandedSections[section];
}

// Particle options
const particleOptions = ref({
  background: {
    color: {
      value: "transparent"
    }
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse"
      },
      resize: true
    },
    modes: {
      repulse: {
        distance: 100,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: ["#0d6efd", "#20c997", "#6f42c1", "#fd7e14"]
    },
    links: {
      color: "#6c757d",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce"
      },
      random: false,
      speed: 1,
      straight: false
    },
    number: {
      density: {
        enable: true,
        area: 800
      },
      value: 40
    },
    opacity: {
      value: 0.3
    },
    shape: {
      type: "circle"
    },
    size: {
      value: { min: 1, max: 3 }
    }
  },
  detectRetina: true
});

const tabs = [
  {key: "request", label: "Yêu cầu định giá", icon: "fa-solid fa-pen-to-square"},
  {key: "results", label: "Lịch sử định giá", icon: "fa-solid fa-scroll"},
  {key: "assets", label: "Tài sản của bạn", icon: "fa-solid fa-building"}
];

const LAND_USE_OPTIONS = [
  "Sổ đỏ lâu dài",
  "Sổ hồng",
  "Sổ đỏ 50 năm",
  "Đang chờ cấp sổ",
  "Giấy tờ khác"
];
const LAND_POSITION_OPTIONS = [
  "Mặt tiền",
  "Hẻm",
  "Hẻm cụt",
  "Khu dân cư",
  "Mặt tiền đường lớn"
];
const OWNERSHIP_OPTIONS = [
  "Sở hữu riêng",
  "Sở hữu chung",
  "Đồng sở hữu"
];
const phoneRegex = /^(?:\+84|0)\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Form thêm tài sản mới
const newAssetForm = reactive({
  address: "",
  oldAddress: "",
  plotNumber: "",
  parcelNumber: "",
  totalArea: null,
  floorArea: null,
  ownershipRelation: "",
  landUseRight: "",
  landPosition: "",
  status: "Chua định giá",
  desire: null,
  structure: "",
  files: [],
  realFiles: [], // 🔥 BIẾN LƯU FILE THẬT MỚI THÊM
  deletedFileIds: [] // 🔥 BIẾN LƯU FILE BỊ XÓA (chỉ id)
});

// Form chỉnh sửa tài sản
const editAssetForm = reactive({
  address: "",
  oldAddress: "",
  plotNumber: "",
  parcelNumber: "",
  totalArea: null,
  floorArea: null,
  ownershipRelation: "",
  landUseRight: "",
  landPosition: "",
  status: "Chua định giá",
  desire: null,
  structure: "",
  files: [],
  realFiles: [], // 🔥 BIẾN LƯU FILE THẬT MỚI THÊM
  deletedFileIds: [] // 🔥 BIẾN LƯU FILE BỊ XÓA (chỉ id)
});


function formatDateTime(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleString("vi-VN");
}


function formatFileSize(size) {
  if (size === null || size === undefined || size === "") return "0 bytes";

  const num = Number(size);
  if (Number.isNaN(num) || num < 0) return String(size);

  const units = ["bytes", "KB", "MB", "GB", "TB"];
  let index = 0;
  let value = num;

  // 🔁 Chia liên tục cho 1024 đến khi nhỏ hơn 1024 hoặc hết đơn vị
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }

  // Làm tròn có chừng mực (2 chữ số thập phân cho MB, GB)
  const formatted =
      index === 0 ? value.toLocaleString("vi-VN") : value.toFixed(2);

  return `${formatted} ${units[index]}`;
}


async function openPdfPreview(fileId, fileName) {
  try {
    const signedUrl = await loadPrivateFileDataUrl(fileId);
    if (!signedUrl) throw new Error("Không lấy được liên kết file");

    clearPdfPreview(); // Xóa preview cũ nếu có

    pdfPreviewUrl.value = signedUrl;
    pdfPreviewName.value = fileName;

  } catch (err) {
    console.error("⚠️ Lỗi khi tải file PDF:", err);
    updateAlertError("Lỗi khi tải file PDF");
  }
}

// Dữ liệu mẫu cho tài sản với 5 hình ảnh
const assets = ref([])


// Dữ liệu mẫu cho báo cáo định giá
const valuations = ref([
  {
    id: "VAL-2024-001",
    assetId: "ASSET-001",
    title: "Báo cáo định giá nhà phố Nguyễn Du",
    status: "Hoàn tất",
    summary: "Giá trị định giá phản ánh sức hút của khu vực trung tâm với nhu cầu cao cho mô hình vừa ở vừa làm việc.",
    updatedAt: "2024-03-12",
    effectiveDate: "2024-03-15",
    expiryDate: "2024-06-15",
    analyst: "Trần Đức Hải",
    desiredPrice: 5200000000,
    valuationPrice: 4800000000,
    planning: "Khu trung tâm thương mại - dịch vụ với yêu cầu bảo tồn mặt đứng kiến trúc đặc trưng.",
    classification: "Đất ở đô thị, chức năng kết hợp thương mại tầng trệt.",
    resultText: "Qua khảo sát thị trường và so sánh các giao dịch tương đồng, giá trị đề xuất phản ánh đúng mặt bằng giá hiện hành và tiềm năng khai thác của tài sản trong bối cảnh thị trường hiện tại.",
    customer: {
      name: "Nguyễn Minh Khôi",
      phone: "0908 123 456",
      email: "khoi.nguyen@example.com",
      note: "Mong muốn cân nhắc phương án bán trong quý II.",
    },
    assetSummary: "Nhà phố 2 mặt thoáng, cải tạo hiện đại với hiệu suất khai thác 95%. Mặt tiền hướng đông nam, đón ánh sáng tự nhiên, thuận lợi cho kinh doanh.",
    desiredPriceNote: "Mức giá đề xuất cao hơn trung bình khu vực 8%.",
  },
  {
    id: "VAL-2024-004",
    assetId: "ASSET-002",
    title: "Định giá tòa nhà văn phòng Võ Văn Kiệt",
    status: "Đang định giá",
    summary: "Tòa nhà văn phòng 5 tầng đang cho thuê ổn định, cần cập nhật giá trị theo hợp đồng thuê mới ký tháng 02/2024.",
    updatedAt: "2024-02-27",
    effectiveDate: "2024-03-05",
    expiryDate: "2024-09-05",
    analyst: "Lê Thanh Bình",
    desiredPrice: 7600000000,
    valuationPrice: 0,
    planning: "Khu vực ưu tiên phát triển dịch vụ - thương mại kết hợp văn phòng.",
    classification: "Tài sản thương mại hạng B",
    resultText: "Đang thu thập thêm dữ liệu giao dịch để hoàn thiện báo cáo.",
    customer: {
      name: "Nguyễn Minh Khôi",
      phone: "0908 123 456",
      email: "khoi.nguyen@example.com",
      note: "Yêu cầu giữ nguyên khách thuê hiện tại khi chuyển nhượng.",
    },
    assetSummary: "Tòa nhà sở hữu vị trí trung tâm, lưu lượng giao thông cao, nhu cầu thuê ổn định.",
    desiredPriceNote: "Chủ tài sản mong muốn mức giá bao gồm toàn bộ trang thiết bị.",
  },
  {
    id: "VAL-2024-006",
    assetId: "ASSET-003",
    title: "Định giá biệt thự ven sông Thủ Thiêm",
    status: "Hoàn tất",
    summary: "Báo cáo tập trung vào giá trị cảnh quan ven sông và tiềm năng khai thác du lịch nghỉ dưỡng.",
    updatedAt: "2024-01-18",
    effectiveDate: "2024-01-22",
    expiryDate: "2024-07-22",
    analyst: "Vũ Hồng An",
    desiredPrice: 4200000000,
    valuationPrice: 4500000000,
    planning: "Thuộc phân khu nhà ở thấp tầng, ưu tiên không gian xanh và bến thuyền dịch vụ.",
    classification: "Đất ở kết hợp dịch vụ du lịch",
    resultText: "Giá trị định giá cao hơn mong muốn 7% nhờ lợi thế vị trí ven sông và quỹ đất rộng.",
    customer: {
      name: "Nguyễn Minh Khôi",
      phone: "0908 123 456",
      email: "khoi.nguyen@example.com",
      note: "Đang cân nhắc phương án hợp tác khai thác cùng đối tác du lịch.",
    },
    assetSummary: "Quỹ đất lớn, tiếp giáp công viên bờ sông, phù hợp phát triển sản phẩm nghỉ dưỡng cao cấp.",
    desiredPriceNote: "Chênh lệch tích cực so với kỳ vọng ban đầu 7%.",
  }
]);

// Các hàm hỗ trợ khác giữ nguyên
function tabShortLabel(key) {
  switch (key) {
    case 'assets':
      return 'Tài sản';
    case 'results':
      return 'Kết quả';
    case 'request':
      return 'Yêu cầu';
    default:
      return key;
  }
}

const valuationsWithAsset = computed(() =>
    valuations.value
        .map((item) => ({
          ...item,
          asset: assets.value.find((asset) => asset.id === item.assetId) || {},
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
);

const filteredValuations = computed(() => {
  if (!filterStatus.value) {
    return valuationsWithAsset.value;
  }
  return valuationsWithAsset.value.filter((valuation) => valuation.status === filterStatus.value);
});

const assetValuationHistory = computed(() => {
  if (!selectedAsset.value) return [];
  return valuationsWithAsset.value.filter((valuation) => valuation.assetId === selectedAsset.value.id);
});

watch(viewMode, () => {
  window.scrollTo({top: 0, behavior: "smooth"});
});

function switchTab(tabKey) {
  activeTab.value = tabKey;
}

function toggleResultFilter() {
  filterStatus.value = filterStatus.value ? "" : "Hoàn tất";
}

function openAssetDetail(asset) {
  selectedAsset.value = asset;
  viewMode.value = "assetDetail";
}

function openAddAssetForm() {
  viewMode.value = "addAsset";
  newAssetForm.address = "";
  newAssetForm.oldAddress = "";
  newAssetForm.plotNumber = "";
  newAssetForm.parcelNumber = "";
  newAssetForm.totalArea = null;
  newAssetForm.floorArea = null;
  newAssetForm.ownershipRelation = "";
  newAssetForm.landUseRight = "";
  newAssetForm.landPosition = "";
  newAssetForm.status = "Chua định giá";
  newAssetForm.desire = null;
  newAssetForm.structure = "";
  newAssetForm.files = [];
  newAssetForm.realFiles = [];
  newAssetForm.deletedFileIds = [];
  newLandUseChoice.value = "";
  newLandPositionChoice.value = "";
  newOwnershipChoice.value = "";
  clearLandErrors(addAssetErrors);
}

// 🔥 HÀM MỞ FORM CHỈNH SỬA TÀI SẢN
function openEditAssetForm(asset) {
  selectedAsset.value = asset;
  viewMode.value = "editAsset";

  console.log("🔍 Dữ liệu tài sản khi mở form chỉnh sửa:", asset);

  // Đổ dữ liệu tài sản vào form chỉnh sửa
  editAssetForm.address = asset.address || "";
  editAssetForm.oldAddress = asset.oldAddress || "";
  editAssetForm.plotNumber = asset.plotNumber || "";
  editAssetForm.parcelNumber = asset.parcelNumber || "";
  editAssetForm.totalArea = asset.totalArea || null;
  editAssetForm.floorArea = asset.floorArea || null;
  editAssetForm.ownershipRelation = asset.ownershipRelation || "";
  editAssetForm.landUseRight = asset.landUseRight || "";
  editAssetForm.landPosition = asset.landPosition || "";
  editAssetForm.status = asset.status || "Chưa định giá";
  editAssetForm.desire = asset.desire || null;
  editAssetForm.structure = asset.structure || "";

  // 🔥 QUAN TRỌNG: Gộp tất cả files (images + files + landBookFiles) vào một mảng với đúng cấu trúc
  const allFiles = [
    ...(asset.images || []).map(img => ({
      ...img,
      type: 'image',
      fileName: img.fileName || img.url,
      url: img.url,
      id: img.id
    })),
    ...(asset.files || []).map(file => ({
      ...file,
      type: 'file',
      fileName: file.fileName || file.url,
      url: file.url,
      id: file.id
    })),
    ...(asset.landBookFiles || []).map(landBook => ({
      ...landBook,
      type: 'image',
      fileName: landBook.fileName || landBook.url,
      url: landBook.url,
      id: landBook.id,
      isIG: true // 🔥 Đánh dấu đây là ảnh sổ
    }))
  ];

  console.log("📁 Tất cả files sau khi gộp:", allFiles);

  editAssetForm.files = allFiles;

  // Reset các biến quản lý file
  editAssetForm.realFiles = []; // 🔥 FILE THẬT MỚI THÊM
  editAssetForm.deletedFileIds = []; // 🔥 FILE BỊ XÓA (chỉ id)

  // Đồng bộ select boxes
  syncEditSelectBoxes();

  // Clear errors
  clearEditAssetErrors();
}

function openRequestFromAsset(asset) {
  switchTab("request");
  viewMode.value = "list";
  requestForm.assetOption = "existing";
  requestForm.assetId = asset.id;
}

const reportDetail = ref();

async function openValuationDetail(valuation) {
  try {
    // 1️⃣ Gọi API lấy chi tiết báo cáo
    const res = await api.get(`/thg.user/my-land/view/report/${valuation.id}`, {
      withCredentials: true,
    });

    reportDetail.value = res.data
    console.log("🔹 reportDetail: ", reportDetail.value);

    // 3️⃣ Ghi nhớ nguồn gốc & đổi chế độ xem
    selectedValuationOrigin.value = viewMode.value === "assetDetail" ? "assets" : "results";
    viewMode.value = "valuationDetail";
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết báo cáo:", err);
    showError("Không thể tải chi tiết báo cáo. Vui lòng thử lại!");
  }
}

function openImageModal(image) {
  selectedImage.value = image;
  nextTick(() => {
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  });
}

function handleNewAssetFilesUpdate(updatedFiles) {
  const normalizedFiles = Array.isArray(updatedFiles) ? updatedFiles : [];
  newAssetForm.files = normalizedFiles;
  const newRealFiles = normalizedFiles
      .filter(f => f)
      .map(f => f);
  newAssetForm.realFiles = newRealFiles; // 🔥 FILE THẬT MỚI THÊM
}


function handleRequestAssetFilesUpdate(updatedFiles) {
  const normalizedFiles = Array.isArray(updatedFiles) ? updatedFiles : [];
  requestForm.newAsset.files = normalizedFiles;
  const newRealFiles = normalizedFiles
      .filter(f => f)  // file mới chọn từ máy
      .map(f => f);

  // 🧱 Cập nhật asset
  requestForm.realFile = newRealFiles; // 🔥 FILE THẬT MỚI THÊM
}

function normalizeNewFile(f) {
  const name = f.file?.name || f.fileName;

  // Phân loại đúng theo extension
  const ext = name.split('.').pop()?.toLowerCase();
  let type = "file";

  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
    type = "image";
  }

  return {
    id: null,
    fileName: name,
    file: f.file,
    type: type,     // ⭐ QUAN TRỌNG - FileOrLand cần type
    isIG: f.isIG || false,
  };
}

// 🔥 HÀM XỬ LÝ CẬP NHẬT FILE TRONG FORM CHỈNH SỬA
function handleEditAssetFilesUpdate(updatedFiles) {
  console.group("🧩 [DEBUG] handleEditAssetFilesUpdate");

  console.log("➡️ updatedFiles (toàn bộ):", updatedFiles);

  // 1️⃣ Phân loại files: file hiện có vs file mới thêm
  const existingFiles = updatedFiles.filter(f => !f.file && f.id);
  const newFiles = updatedFiles.filter(f => f.file instanceof File);

  console.log("✅ existingFiles (đã có sẵn, giữ lại):", existingFiles);
  console.log("🆕 newFiles (mới upload):", newFiles);

  // 2️⃣ So sánh với files ban đầu để tìm file bị xóa
  const originalFileIds = (selectedAsset.value.images || [])
      .concat(selectedAsset.value.files || [])
      .concat(selectedAsset.value.landBookFiles || [])
      .map(f => f.id);

  const currentFileIds = existingFiles.map(f => f.id);
  const deletedFileIds = originalFileIds.filter(id => !currentFileIds.includes(id));

  console.log("📦 originalFileIds (ban đầu):", originalFileIds);
  console.log("📦 currentFileIds (sau khi chỉnh):", currentFileIds);
  console.log("🗑 deletedFileIds (file bị xóa):", deletedFileIds);

  // 3️⃣ Cập nhật form
  editAssetForm.files = updatedFiles;
  editAssetForm.realFiles = newFiles; // 🔥 Lưu toàn bộ file mới
  editAssetForm.deletedFileIds = deletedFileIds; // 🔥 FILE BỊ XÓA (chỉ id)

  console.log("📋 editAssetForm:", {
    files: editAssetForm.files,
    realFiles: editAssetForm.realFiles,
    deletedFileIds: editAssetForm.deletedFileIds,
  });

  console.groupEnd();
}


function handleFilesUpdate(updatedFiles) {
  if (!selectedAsset.value) return;

  // Phân loại files từ updatedFiles
  const images = updatedFiles.filter(file => file.type === 'image' && !file.isIG);
  const normalFiles = updatedFiles.filter(file => file.type === 'file' && !file.isIG);
  const landBookFiles = updatedFiles.filter(file => file.isIG);

  selectedAsset.value.images = images;
  selectedAsset.value.files = normalFiles;
  selectedAsset.value.landBookFiles = landBookFiles;
}


function returnToList(tabKey) {
  viewMode.value = "list";
  switchTab(tabKey);
}

function returnToAssetDetail() {
  viewMode.value = "assetDetail";
}

function downloadAllFiles(asset) {
  successMessage.value = `Đang tải xuống tất cả tài liệu và hình ảnh của ${asset.address}`;
  setTimeout(() => {
    successMessage.value = "Tải xuống tất cả tài liệu thành công!";
  }, 2000);
  setTimeout(() => {
    successMessage.value = "";
  }, 5000);
}

// 🔥 HÀM KIỂM TRA FILE CÓ PHẢI LÀ ẢNH KHÔNG
function isImageFile(file) {
  if (!file || !file.fileName) return false;
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(file.fileName);
}

// 🔥 HÀM KIỂM TRA FILE CÓ PHẢI LÀ ẢNH SỔ KHÔNG
function isIGFile(file) {
  if (!file) return false;
  return file.isIG ||
      file.fileName?.includes('landbook') ||
      file.fileName?.includes('sổ') ||
      file.fileName?.includes('land_book') ||
      file.fileName?.includes('so') ||
      file.fileName?.includes('certificate') ||
      file.fileName?.includes('red_book') ||
      file.fileName?.includes('pink_book');
}

const requestForm = reactive({
  assetOption: "new",
  assetId: "",
  newAsset: {
    address: "",
    oldAddress: "",
    plotNumber: "",
    parcelNumber: "",
    totalArea: null,
    floorArea: null,
    ownershipRelation: "",
    landUseRight: "",
    landPosition: "",
    status: "Chưa định giá",
    structure: "",
    files: [],
    desire: null
  },
  onBehalf: false,
  ownerOption: "existing",
  existingOwnerPhone: "",
  existingOwner: null,
  newOwner: {
    fullName: "",
    phone: "",
    gender: null,
    newAddress: "",
    oldAddress: ""
  },
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  desiredPrice: null,
  note: "",
  realFile: [] // 🔥 FILE THẬT MỚI THÊM (cho request)
});

const thongBao = ref(null);

const createLandErrorState = () => ({
  address: "",
  plotNumber: "",
  parcelNumber: "",
  totalArea: "",
  landUseRight: "",
  landPosition: "",
  ownershipRelation: "",
  structure: "",
  desire: "",
  files: ""
});

const requestErrors = reactive({
  assetId: "",
  newAsset: createLandErrorState(),
  contact: {
    name: "",
    phone: "",
    email: ""
  }
});

const addAssetErrors = reactive(createLandErrorState());

watch(
    () => authStore.userInfo,
    (user) => {
      requestForm.contactName = user?.fullName || "";
      requestForm.contactPhone = user?.phone || "";
      requestForm.contactEmail = user?.email || "";
    },
    {immediate: true, deep: true}
);

watch(
    () => requestForm.assetOption,
    (option) => {
      if (option === "existing") {
        clearLandErrors(requestErrors.newAsset);
        requestForm.onBehalf = false;
        resetOnBehalfInfo();
      } else {
        requestForm.assetId = "";
        requestErrors.assetId = "";
      }
    }
);

watch(
    () => requestForm.onBehalf,
    (val) => {
      if (val) {
        clearContactErrors();
      } else {
        resetOnBehalfInfo();
        const user = authStore.userInfo;
        requestForm.contactName = user?.fullName || "";
        requestForm.contactPhone = user?.phone || "";
        requestForm.contactEmail = user?.email || "";
      }
    }
);

function clearLandErrors(target) {
  Object.keys(target).forEach((key) => {
    target[key] = "";
  });
}

function clearContactErrors() {
  requestErrors.contact.name = "";
  requestErrors.contact.phone = "";
  requestErrors.contact.email = "";
}

function resetOnBehalfInfo() {
  requestForm.ownerOption = "existing";
  requestForm.existingOwnerPhone = "";
  requestForm.newOwner.fullName = "";
  requestForm.newOwner.phone = "";
  requestForm.newOwner.gender = null;
  requestForm.newOwner.newAddress = "";
  requestForm.newOwner.oldAddress = "";
}

function countImageFiles(list = []) {
  return list.filter((item) => isImageFileEntry(item)).length;
}

function validateLandForm(form, errorBag) {
  clearLandErrors(errorBag);
  let valid = true;

  const a = form;

  // ==== VALIDATE ĐỊA CHỈ (3 PHẦN BẮT BUỘC) ====
  if (!a.address || !a.address.trim()) {
    errorBag.address = "Vui lòng chọn địa chỉ tài sản.";
    valid = false;
  } else {
    const parts = a.address.split("/!!").map(p => p.trim());

    if (parts.length !== 3) {
      errorBag.address = "Địa chỉ phải gồm đủ: Địa chỉ cụ thể / Phường-Xã / Tỉnh-Thành.";
      valid = false;
    } else {
      const [street, ward, province] = parts;

      if (!street) {
        errorBag.address = "Vui lòng nhập địa chỉ cụ thể (số nhà, đường).";
        valid = false;
      } else if (!ward) {
        errorBag.address = "Vui lòng chọn Phường / Xã.";
        valid = false;
      } else if (!province) {
        errorBag.address = "Vui lòng chọn Tỉnh / Thành phố.";
        valid = false;
      }
    }
  }

  // ==== VALIDATE TRƯỜNG CƠ BẢN ====
  if (!a.plotNumber?.trim()) {
    errorBag.plotNumber = "Vui lòng nhập số tờ bản đồ.";
    valid = false;
  }
  if (!a.parcelNumber?.trim()) {
    errorBag.parcelNumber = "Vui lòng nhập số thửa.";
    valid = false;
  }
  if (!a.totalArea || a.totalArea <= 0) {
    errorBag.totalArea = "Diện tích tổng phải lớn hơn 0.";
    valid = false;
  }
  if (!a.landUseRight?.trim()) {
    errorBag.landUseRight = "Vui lòng chọn quyền sử dụng tài sản.";
    valid = false;
  }
  if (!a.landPosition?.trim()) {
    errorBag.landPosition = "Vui lòng chọn vị trí.";
    valid = false;
  }
  if (!a.ownershipRelation?.trim()) {
    errorBag.ownershipRelation = "Vui lòng nhập quan hệ sở hữu.";
    valid = false;
  }
  if (!a.structure?.trim()) {
    errorBag.structure = "Vui lòng mô tả kết cấu hoặc hình dạng tài sản.";
    valid = false;
  }
  if (!a.desire || a.desire <= 0) {
    errorBag.desire = "Vui lòng nhập mức giá mong muốn hợp lệ.";
    valid = false;
  }

  // ==== VALIDATE FILES ====
  const files = form.files || [];
  const normalImages = files.filter(f => !f.isIG);
  const landBookImages = files.filter(f => f.isIG);

  if (normalImages.length < 4 || landBookImages.length < 1) {
    errorBag.files =
        `Cần ít nhất 4 hình ảnh thường và 1 ảnh sổ (hiện có ${normalImages.length} ảnh thường, ${landBookImages.length} ảnh sổ).`;
    valid = false;
  }

  return valid;
}



function validateContactInfo() {
  clearContactErrors();
  let valid = true;
  const name = (requestForm.contactName || "").trim();
  const phone = (requestForm.contactPhone || "").replace(/\s+/g, "");
  const email = (requestForm.contactEmail || "").trim();

  if (!name) {
    requestErrors.contact.name = "Vui lòng cung cấp họ tên.";
    valid = false;
  }
  if (!phoneRegex.test(phone)) {
    requestErrors.contact.phone = "Số điện thoại không hợp lệ.";
    valid = false;
  }
  if (!emailRegex.test(email)) {
    requestErrors.contact.email = "Email không hợp lệ.";
    valid = false;
  }

  requestForm.contactName = name;
  requestForm.contactPhone = phone;
  requestForm.contactEmail = email;
  return valid;
}

function validateRequestForm(option = requestForm.assetOption) {
  let isValid = true;
  if (!(option === "new" && requestForm.onBehalf)) {
    isValid = validateContactInfo();
  } else {
    clearContactErrors();
  }
  requestErrors.assetId = "";
  if (option === "existing") {
    clearLandErrors(requestErrors.newAsset);
    if (!requestForm.assetId) {
      requestErrors.assetId = "Vui lòng chọn tài sản trong danh sách.";
      isValid = false;
    }
    return isValid;
  }
  const landValid = validateLandForm(requestForm.newAsset, requestErrors.newAsset);
  return isValid && landValid;
}

function formatAddress(address) {
  if (!address) return "";
  return address.replace(/\s*\/!!\s*/g, ", ");
}

async function handleExistingOwnerLookup() {
  try {
    // reset UI
    requestForm.existingOwner = null;
    thongBao.value = null;

    const phone = requestForm.existingOwnerPhone?.trim();

    // 🔥 VALIDATE TRƯỚC
    if (!phone || !/^[0-9]{9,11}$/.test(phone)) {
      requestForm.existingOwner = null;
      thongBao.value = 'Số điện thoại không hợp lệ';
      return; // ⛔ KHÔNG GỌI API
    }

    const res = await api.get(
        "/thg.user/my-land/tim-chu-nha-tam",
        { params: { phone } }
    );

    // 🔥 CHECK CHẶT
    if (res.data && res.data.id) {
      requestForm.existingOwner = res.data;
    } else {
      thongBao.value = 'Không tìm thấy chủ nhà';
    }

  } catch (e) {
    thongBao.value = 'Có lỗi khi tìm chủ nhà';
    console.error(e);
  }
}


// Hàm submit yêu cầu định giá
async function submitRequest() {
  if (!validateRequestForm("existing")) return;
  try {
    const res = await showLoading(api.post("/thg.user/my-land/request-report", requestForm.assetId, {
      headers: {"Content-Type": "application/json"},
      withCredentials: true,
    }));
    resetRequestForm();
    console.log("Kết quả:", res.data);
    activeTab.value = 'results';
    if (res.data?.usageLeft === false) {
      updateAlertError(res.data.message || "Bạn đã hết lượt sử dụng!");
      setTimeout(() => {
        router.push({path: "/feature-in-development"});
      }, 1200);
    } else {
      updateAlertSuccess("Yêu cầu định giá thành công và tài sản mới của bạn đã được lưu");
    }
  } catch (err) {
    console.error("Lỗi khi gửi yêu cầu:", err);
  }
}

// 🔥 HÀM PHÂN LOẠI FILE
function classifyFiles(files) {
  const normalFiles = [];
  const landBookFiles = [];

  files.forEach(file => {
    // Kiểm tra nhiều điều kiện để phân loại ảnh sổ
    const isIG = file.isIG ||
        file.fileName?.includes('landbook') ||
        file.fileName?.includes('sổ') ||
        file.fileName?.includes('land_book') ||
        file.fileName?.includes('so') ||
        file.fileName?.includes('certificate') ||
        file.fileName?.includes('red_book') ||
        file.fileName?.includes('pink_book');

    if (isIG) {
      landBookFiles.push(file);
    } else {
      normalFiles.push(file);
    }
  });

  return {normalFiles, landBookFiles};
}

// 🔥 HÀM PHÂN LOẠI FILE BỊ XÓA
function classifyDeletedFiles(deletedFileIds, allFiles) {
  const deletedNormalIds = [];
  const deletedLandBookIds = [];

  deletedFileIds.forEach(id => {
    const file = allFiles.find(f => f.id === id);
    if (file) {
      const isIG = file.isIG ||
          file.fileName?.includes('landbook') ||
          file.fileName?.includes('sổ') ||
          file.fileName?.includes('land_book') ||
          file.fileName?.includes('so') ||
          file.fileName?.includes('certificate') ||
          file.fileName?.includes('red_book') ||
          file.fileName?.includes('pink_book');

      if (isIG) {
        deletedLandBookIds.push(id);
      } else {
        deletedNormalIds.push(id);
      }
    }
  });

  return {deletedNormalIds, deletedLandBookIds};
}

async function submitNewAssetAndRequest() {
  if (!validateRequestForm("new")) return;
  if (requestForm.onBehalf) {
    if (!validateRequestForm("new")) return;

    const payload = {
      asset: { ...requestForm.newAsset },
      owner:
          requestForm.ownerOption === "existing"
              ? { type: "existing", id: requestForm.existingOwner.id }
              : { type: "new", info: { ...requestForm.newOwner } }
    };

    console.log("📝 Thông tin nhập hộ:", payload);

    try {
      const res = await submitMultipart(payload);

      if (res.data?.success === false) {
        updateAlertError(res.data.message || "Không thể xử lý yêu cầu");
        return; // ⛔ DỪNG TẠI ĐÂY
      }


      if (res.data?.usageLeft === false) {
        updateAlertError(res.data.message || "Bạn đã hết lượt sử dụng!");
        setTimeout(() => {
          router.push({ path: "/feature-in-development" });
        }, 1200);
      } else {
        resetRequestForm();
        activeTab.value = "results";
        updateAlertSuccess("Yêu cầu định giá và thêm tài sản thành công");
        await getViewLandAsset();
      }
    } catch (e) {
      console.error("❌ Lỗi khi gửi (onBehalf):", e);
    }

    return;
  }
  try {
    const formData = new FormData();

    // ✅ Tạo bản sao newAsset, bỏ trường files
    const dto = {...requestForm.newAsset};
    delete dto.files;

    // 1️⃣ Gắn DTO (JSON)
    formData.append("dto", new Blob([JSON.stringify(dto)], {type: "application/json"}));

    // 🔥 PHÂN LOẠI FILE: ảnh thường vs ảnh sổ
    const normalFiles = [];
    const landBookFiles = [];

    requestForm.realFile.forEach(f => {
      if (f.isIG || f.fileName?.includes('landbook') || f.fileName?.includes('sổ') || f.fileName?.includes('land_book')) {
        landBookFiles.push(f);
      } else {
        normalFiles.push(f);
      }
    });

    // Gắn file (phân loại)
    normalFiles.forEach(f => formData.append("files", f.file));
    landBookFiles.forEach(f => formData.append("landBookFiles", f.file));

    // 3️⃣ Gửi request
    const res = await showLoading(api.post(
        "/thg.user/my-land/request-report-new-asset",
        formData,
        {
          withCredentials: true,
          headers: {"Content-Type": "multipart/form-data"},
        }
    ));

    if (res.data?.usageLeft === false) {
      updateAlertError(res.data.message || "Bạn đã hết lượt sử dụng!");
      setTimeout(() => {
        router.push({path: "/feature-in-development"});
      }, 1200);
    } else {
      resetRequestForm();
      activeTab.value = 'results';
      updateAlertSuccess("Yêu cầu định giá và thêm tài sản thành công");
      await getViewLandAsset();
      console.log("✅ Gửi thành công:");
    }
  } catch (error) {
    console.error("❌ Lỗi khi gửi:", error);
  }
}

async function submitMultipart(dto) {
  const formData = new FormData();
  // owner.info.tpye = 'new' với trường hợp nhập mới
  // owner.info.tpye = 'existing' với truường hợp khách cũ , dùng
  // gắn DTO
  formData.append(
      "dto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
  );

  // 🔥 phân loại file
  const normalFiles = [];
  const landBookFiles = [];

  requestForm.realFile.forEach(f => {
    if (
        f.isIG ||
        f.fileName?.includes("landbook") ||
        f.fileName?.includes("sổ") ||
        f.fileName?.includes("land_book")
    ) {
      landBookFiles.push(f);
    } else {
      normalFiles.push(f);
    }
  });

  normalFiles.forEach(f => formData.append("files", f.file));
  landBookFiles.forEach(f => formData.append("landBookFiles", f.file));

  return showLoading(
      api.post(
          "/thg.user/my-land/request-report-new-asset-2",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
          }
      )
  );
}


// Hàm xử lý chuyển thanh toán
function handleOpenReport(valuation) {
  console.log("Nhận valuation:", valuation);
  router.push("/thanh-toan")
}


// Hàm reset form yêu cầu
function resetRequestForm() {
  requestForm.assetOption = "existing";
  requestForm.assetId = "";
  requestForm.newAsset.address = "";
  requestForm.newAsset.oldAddress = "";
  requestForm.newAsset.totalArea = null;
  requestForm.newAsset.floorArea = null;
  requestForm.newAsset.plotNumber = "";
  requestForm.newAsset.parcelNumber = "";
  requestForm.newAsset.ownershipRelation = "";
  requestForm.newAsset.landUseRight = "";
  requestForm.newAsset.landPosition = "";
  requestForm.newAsset.status = "Chờ duyệt";
  requestForm.newAsset.structure = "";
  requestForm.newAsset.desire = null;
  requestForm.newAsset.files = [];
  requestForm.realFile = [];
  requestForm.desiredPrice = null;
  requestForm.note = "";
  requestForm.onBehalf = false;
  resetOnBehalfInfo();
  const user = authStore.userInfo;
  requestForm.contactName = user?.fullName || "";
  requestForm.contactPhone = user?.phone || "";
  requestForm.contactEmail = user?.email || "";
  landUseChoice.value = "";
  landPositionChoice.value = "";
  ownershipChoice.value = "";
  clearLandErrors(requestErrors.newAsset);
  clearContactErrors();
  requestErrors.assetId = "";
  formattedPrice.value = "";
}

// Hàm xáo trộn tài sản
function shuffleAssets() {
  assets.value = [...assets.value].sort(() => Math.random() - 0.5);
}

// Hàm tải PDF
function downloadPDF(valuation) {
  successMessage.value = `Đang tải báo cáo PDF: ${valuation.title}`;
  setTimeout(() => {
    successMessage.value = "Tải xuống báo cáo PDF thành công!";
  }, 1500);
  setTimeout(() => {
    successMessage.value = "";
  }, 4000);
}

// Hàm phân loại badge theo status
function statusBadgeClass(status) {
  switch (status) {
    case "Hoàn tất":
      return "text-bg-success";
    case "Đang xử lý":
      return "text-bg-warning";
    case "Đang sử dụng":
    case "Đang cho thuê":
    case "Tiếp nhận":
      return "text-bg-info";
    case "Đang trống":
    case "Đang xây dựng":
    case "Chờ cải tạo":
      return "text-bg-secondary";
    case "Chờ duyệt":
      return "text-bg-dark";
    default:
      return "text-bg-light";
  }
}

// Hàm định dạng ngày
function formatDate(date) {
  if (!date) return "Không có";
  const str = typeof date === "string" ? date : date.toISOString();
  const datePart = str.split("T")[0]; // "2025-11-11"
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year}`;
}

// Hàm định dạng tiền tệ
function formatCurrency(value) {
  if (!value) return "--";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

// Hàm tính chênh lệch giá
function priceDifference(valuation) {
  if (!valuation || !valuation.desiredPrice || !valuation.valuationPrice) return null;
  const difference = valuation.valuationPrice - valuation.desiredPrice;
  const percentage = (difference / valuation.desiredPrice) * 100;
  return {
    difference,
    percentage,
  };
}

// Hàm hiển thị chênh lệch giá
function priceDifferenceText(valuation) {
  const diff = priceDifference(valuation);
  if (!diff) return "Chờ kết quả";
  const prefix = diff.difference >= 0 ? "+" : "";
  return `${prefix}${diff.percentage.toFixed(1)}% so với kỳ vọng`;
}

// Hàm phân loại màu chênh lệch
function differenceClass(valuation) {
  const diff = priceDifference(valuation);R
  if (!diff) return "text-muted";
  return diff.difference >= 0 ? "text-success" : "text-danger";
}


//Test API

async function getViewLandAsset() {
  const res = await api.get("/thg.user/my-land/view",
      {
        withCredentials: true
      })
  console.log(res.data);
  assets.value = res.data;
}

function formatNumber(num) {
  return num ? num.toLocaleString("vi-VN") : "--";
}

// Optional: chuyển số sang chữ (giả lập nhanh)
function convertToWords(amount) {
  amount = Math.floor(Math.abs(Number(amount) || 0));
  if (amount === 0) return "Không đồng";

  const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const DonVi = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  function read3Digits(n) {
    let hundred = Math.floor(n / 100);
    let ten = Math.floor((n % 100) / 10);
    let unit = n % 10;
    let result = "";

    // Hàng trăm
    if (hundred > 0) {
      result += ChuSo[hundred] + " trăm";
    }

    // Hàng chục
    if (ten > 1) {
      result += (result ? " " : "") + ChuSo[ten] + " mươi";
      if (unit === 1) result += " mốt";
      else if (unit === 5) result += " lăm";
      else if (unit > 0) result += " " + ChuSo[unit];
    } else if (ten === 1) {
      result += (result ? " " : "") + "mười";
      if (unit === 5) result += " lăm";
      else if (unit > 0) result += " " + ChuSo[unit];
    } else if (ten === 0 && unit > 0) {
      if (hundred > 0) result += " lẻ " + ChuSo[unit];
      else result += ChuSo[unit];
    }

    return result.trim();
  }

  // Tách số thành từng nhóm 3 chữ số
  let result = [];
  let unitIndex = 0;

  while (amount > 0) {
    let block = amount % 1000;
    if (block > 0) {
      let blockText = read3Digits(block);
      if (DonVi[unitIndex]) blockText += " " + DonVi[unitIndex];
      result.unshift(blockText);
    }
    amount = Math.floor(amount / 1000);
    unitIndex++;
  }

  // Chuẩn hóa chuỗi
  let finalText = result.join(" ").replace(/\s+/g, " ").trim();
  finalText = finalText.charAt(0).toUpperCase() + finalText.slice(1);
  finalText += " đồng chẵn";

  return finalText;
}

function convertToWordsSquare(amount) {
  if (amount === null || amount === undefined) return "";
  amount = Number(amount);

  const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const DonVi = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  // Xử lý phần thập phân
  let integerPart = Math.floor(amount);
  let decimalPart = Math.round((amount - integerPart) * 100); // đọc 2 số sau phẩy

  function read3Digits(n) {
    let hundred = Math.floor(n / 100);
    let ten = Math.floor((n % 100) / 10);
    let unit = n % 10;
    let result = "";

    if (hundred > 0) result += ChuSo[hundred] + " trăm";

    if (ten > 1) {
      result += (result ? " " : "") + ChuSo[ten] + " mươi";
      if (unit === 1) result += " mốt";
      else if (unit === 5) result += " lăm";
      else if (unit > 0) result += " " + ChuSo[unit];
    } else if (ten === 1) {
      result += (result ? " " : "") + "mười";
      if (unit === 5) result += " lăm";
      else if (unit > 0) result += " " + ChuSo[unit];
    } else if (ten === 0 && unit > 0) {
      if (hundred > 0) result += " lẻ " + ChuSo[unit];
      else result += ChuSo[unit];
    }

    return result.trim();
  }

  // Đọc phần nguyên
  function readNumber(num) {
    if (num === 0) return "Không";

    let result = [];
    let unitIndex = 0;

    while (num > 0) {
      let block = num % 1000;
      if (block > 0) {
        let blockText = read3Digits(block);
        if (DonVi[unitIndex]) blockText += " " + DonVi[unitIndex];
        result.unshift(blockText);
      }
      num = Math.floor(num / 1000);
      unitIndex++;
    }

    let text = result.join(" ").replace(/\s+/g, " ").trim();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Ghép phần nguyên + phần thập phân
  let finalText = readNumber(integerPart);

  if (decimalPart > 0) {
    finalText += " phẩy";
    decimalPart
        .toString()
        .split("")
        .forEach(d => finalText += " " + ChuSo[Number(d)]);
  }

  finalText += " mét vuông";

  return finalText;
}

function formatSquareNumber5555(value) {
  if (value === null || value === undefined || value === "") return "";

  // Giữ nguyên chuỗi để không mất số 0 phía sau
  const str = value.toString();

  // Tách phần nguyên & thập phân
  const [intPart, decimalPart] = str.split(".");

  // Format phần nguyên theo chuẩn VN
  const formattedInt = Number(intPart).toLocaleString("vi-VN");

  // Ghép lại
  let result = decimalPart !== undefined
      ? `${formattedInt},${decimalPart}`
      : formattedInt;

  return result + " m²";
}

const formattedPrice = ref("");

function onPriceInput(e) {
  // Loại bỏ ký tự không phải số
  const raw = e.target.value.replace(/\D/g, "");
  // Cập nhật model thật (dạng số)
  requestForm.desiredPrice = raw ? parseInt(raw) : null;
  // Cập nhật hiển thị có dấu chấm
  formattedPrice.value = formatNumber(raw);
}

// Khi có dữ liệu ban đầu (chỉnh sửa)
watch(() => requestForm.desiredPrice, (val) => {
  formattedPrice.value = val ? formatNumber(val) : "";
});

const ownershipChoice = ref("");
// Biến trung gian để theo dõi lựa chọn
const landUseChoice = ref("");
const landPositionChoice = ref("");

// Theo dõi quyền sử dụng đất
watch(landUseChoice, (val) => {
  if (val !== "Khác") {
    requestForm.newAsset.landUseRight = val;
  } else {
    requestForm.newAsset.landUseRight = "";
  }
});

// Theo dõi vị trí đất
watch(landPositionChoice, (val) => {
  if (val !== "Khác") {
    requestForm.newAsset.landPosition = val;
  } else {
    requestForm.newAsset.landPosition = "";
  }
});

watch(ownershipChoice, (val) => {
  if (val !== "Khác") {
    requestForm.newAsset.ownershipRelation = val || "";
  } else {
    requestForm.newAsset.ownershipRelation = "";
  }
});

// Nếu có dữ liệu sẵn (khi mở form sửa) → tự động đồng bộ lại select
watch(
    () => requestForm.newAsset.landUseRight,
    (val) => {
      if (val && !LAND_USE_OPTIONS.includes(val)) {
        landUseChoice.value = "Khác";
      } else {
        landUseChoice.value = val;
      }
    },
    {immediate: true}
);

watch(
    () => requestForm.newAsset.landPosition,
    (val) => {
      if (val && !LAND_POSITION_OPTIONS.includes(val)) {
        landPositionChoice.value = "Khác";
      } else {
        landPositionChoice.value = val;
      }
    },
    {immediate: true}
);

watch(
    () => requestForm.newAsset.ownershipRelation,
    (val) => {
      if (val && !OWNERSHIP_OPTIONS.includes(val)) {
        ownershipChoice.value = "Khác";
      } else {
        ownershipChoice.value = val;
      }
    },
    {immediate: true}
);
// Biến trung gian cho lựa chọn (để hiển thị "Khác" → input)
const newLandUseChoice = ref("");
const newLandPositionChoice = ref("");
const newOwnershipChoice = ref("");

// Theo dõi Quyền sử dụng đất
watch(newLandUseChoice, (val) => {
  if (val !== "Khác") newAssetForm.landUseRight = val;
  else newAssetForm.landUseRight = "";
});

// Theo dõi Vị trí đất
watch(newLandPositionChoice, (val) => {
  if (val !== "Khác") newAssetForm.landPosition = val;
  else newAssetForm.landPosition = "";
});

// Theo dõi Quan hệ sở hữu
watch(newOwnershipChoice, (val) => {
  if (val !== "Khác") newAssetForm.ownershipRelation = val;
  else newAssetForm.ownershipRelation = "";
});

// 🔥 BIẾN TRUNG GIAN CHO FORM CHỈNH SỬA
const editLandUseChoice = ref("");
const editLandPositionChoice = ref("");
const editOwnershipChoice = ref("");

// 🔥 HÀM ĐỒNG BỘ SELECT BOXES CHO FORM CHỈNH SỬA
function syncEditSelectBoxes() {
  // Đồng bộ quyền sử dụng đất
  if (editAssetForm.landUseRight && !LAND_USE_OPTIONS.includes(editAssetForm.landUseRight)) {
    editLandUseChoice.value = "Khác";
  } else {
    editLandUseChoice.value = editAssetForm.landUseRight;
  }

  // Đồng bộ vị trí đất
  if (editAssetForm.landPosition && !LAND_POSITION_OPTIONS.includes(editAssetForm.landPosition)) {
    editLandPositionChoice.value = "Khác";
  } else {
    editLandPositionChoice.value = editAssetForm.landPosition;
  }

  // Đồng bộ quan hệ sở hữu
  if (editAssetForm.ownershipRelation && !OWNERSHIP_OPTIONS.includes(editAssetForm.ownershipRelation)) {
    editOwnershipChoice.value = "Khác";
  } else {
    editOwnershipChoice.value = editAssetForm.ownershipRelation;
  }
}

// 🔥 THEO DÕI CÁC SELECT BOX TRONG FORM CHỈNH SỬA
watch(editLandUseChoice, (val) => {
  if (val !== "Khác") editAssetForm.landUseRight = val;
  else editAssetForm.landUseRight = "";
});

watch(editLandPositionChoice, (val) => {
  if (val !== "Khác") editAssetForm.landPosition = val;
  else editAssetForm.landPosition = "";
});

watch(editOwnershipChoice, (val) => {
  if (val !== "Khác") editAssetForm.ownershipRelation = val;
  else editAssetForm.ownershipRelation = "";
});

// ✅ HÀm thêm tài sản mới độc lập
async function submitNewAsset() {
  if (!validateLandForm(newAssetForm, addAssetErrors)) return;
  try {
    const formData = new FormData();

    // Tạo DTO bỏ file preview
    const dto = {...newAssetForm};
    delete dto.files;
    delete dto.realFiles;
    delete dto.deletedFileIds;

    // Gắn JSON DTO
    formData.append("dto", new Blob([JSON.stringify(dto)], {type: "application/json"}));

    // 🔥 PHÂN LOẠI FILE: ảnh thường vs ảnh sổ
    // Với tài sản mới, tất cả file đều là ảnh thường (files)
    // Ảnh sổ (landBookFiles) sẽ được upload riêng nếu có
    const normalFiles = [];
    const landBookFiles = [];

    newAssetForm.realFiles.forEach(f => {
      // Mặc định tất cả là ảnh thường, trừ khi có đánh dấu đặc biệt
      if (f.isIG || f.fileName?.includes('landbook') || f.fileName?.includes('sổ') || f.fileName?.includes('land_book')) {
        landBookFiles.push(f);
      } else {
        normalFiles.push(f);
      }
    });

    // Gắn file thật (phân loại)
    normalFiles.forEach(f => formData.append("files", f.file));
    landBookFiles.forEach(f => formData.append("landBookFiles", f.file));


    const res = await showLoading(api.post("/thg.user/my-land/add-new", formData, {
      withCredentials: true,
      headers: {"Content-Type": "multipart/form-data"}
    }));

    // Reset form
    Object.keys(newAssetForm).forEach(k => {
      if (Array.isArray(newAssetForm[k])) newAssetForm[k] = [];
      else if (typeof newAssetForm[k] === "number") newAssetForm[k] = null;
      else newAssetForm[k] = "";
    });
    newAssetForm.status = "Chưa định giá";
    newLandUseChoice.value = "";
    newLandPositionChoice.value = "";
    newOwnershipChoice.value = "";
    clearLandErrors(addAssetErrors);

    if (res.data?.usageLeft === false) {
      updateAlertError(res.data.message || "Bạn đã hết lượt sử dụng!");
      setTimeout(() => {
        router.push({path: "/feature-in-development"});
      }, 1200);

    } else {
      await getViewLandAsset(); // làm mới danh sách tài sản
      returnToList("assets");

      updateAlertSuccess("Thêm tài sản mới thành công!");
      console.log("✅ Tài sản mới:", res.data);
    }
  } catch (err) {
    console.error("❌ Lỗi khi thêm tài sản:", err);
    updateAlertError("Thêm tài sản mới thất bại!");
  }
}

// 🔥 HÀM CẬP NHẬT TÀI SẢN
// 🔥 HÀM CẬP NHẬT TÀI SẢN - ĐÃ SỬA
async function submitEditAsset() {
  try {
    if (!validateEditAssetForm()) return;

    const formData = new FormData();

    // Tạo DTO bỏ các trường file
    const dto = {...editAssetForm};
    delete dto.files;
    delete dto.realFiles;
    delete dto.deletedFileIds;

    // Gắn JSON DTO
    formData.append("dto", new Blob([JSON.stringify(dto)], {type: "application/json"}));

    // 🔥 PHÂN LOẠI FILE MỚI: ảnh thường vs ảnh sổ
    const normalFiles = [];
    const landBookFiles = [];
    console.log("ET: ", editAssetForm)
    editAssetForm.realFiles.forEach(f => {
      // Phân loại dựa trên thuộc tính isIG hoặc fileName
      if (f.isIG ||
          f.fileName?.includes('landbook') ||
          f.fileName?.includes('sổ') ||
          f.fileName?.includes('land_book') ||
          f.fileName?.includes('so') ||
          f.fileName?.includes('certificate') ||
          f.fileName?.includes('red_book') ||
          f.fileName?.includes('pink_book')) {
        landBookFiles.push(f);
      } else {
        normalFiles.push(f);
      }
    });

    console.log("📁 File mới - Ảnh thường:", normalFiles);
    console.log("📁 File mới - Ảnh sổ:", landBookFiles);

    // Gắn file mới thêm (phân loại)
    normalFiles.forEach(f => formData.append("files", f.file));
    landBookFiles.forEach(f => formData.append("landBookFiles", f.file));

    // 🔥 PHÂN LOẠI FILE BỊ XÓA: ảnh thường vs ảnh sổ
    const deletedNormalIds = [];
    const deletedLandBookIds = [];

    // Phân loại file bị xóa dựa trên dữ liệu gốc
    editAssetForm.deletedFileIds.forEach(id => {
      // Kiểm tra trong images (ảnh thường)
      const isImage = selectedAsset.value.images?.some(img => img.id === id);
      // Kiểm tra trong files (file thường)
      const isNormalFile = selectedAsset.value.files?.some(file => file.id === id);
      // Kiểm tra trong landBookFiles (ảnh sổ)
      const isIGFile = selectedAsset.value.landBookFiles?.some(landBook => landBook.id === id);

      if (isIGFile) {
        deletedLandBookIds.push(id);
      } else if (isImage || isNormalFile) {
        deletedNormalIds.push(id);
      }
    });

    console.log("🗑 File bị xóa - Ảnh thường:", deletedNormalIds);
    console.log("🗑 File bị xóa - Ảnh sổ:", deletedLandBookIds);

    // Gắn danh sách file bị xóa (phân loại)
    if (deletedNormalIds.length > 0) {
      formData.append("deletedFileIds", deletedNormalIds.join(","));
    }
    if (deletedLandBookIds.length > 0) {
      formData.append("deletedLandBookFileIds", deletedLandBookIds.join(","));
    }

    const res = await showLoading(api.put(`/thg.user/my-land/update/${selectedAsset.value.id}`, formData, {
      withCredentials: true,
      headers: {"Content-Type": "multipart/form-data"}
    }));

    // Cập nhật lại danh sách tài sản
    await getViewLandAsset();

    // Quay về chi tiết tài sản
    returnToAssetDetail();

    updateAlertSuccess("Cập nhật tài sản thành công!");
    console.log("✅ Tài sản cập nhật:", res.data);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật tài sản:", err);
    updateAlertError("Cập nhật tài sản thất bại!");
  }
}

const editAssetErrors = reactive({
  address: '',
  plotNumber: '',
  parcelNumber: '',
  totalArea: '',
  landUseRight: '',
  landPosition: '',
  ownershipRelation: '',
  structure: '',
  desire: '',
  files: ''
})
const isImage = (fileName) => /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName || "");
const validateEditAssetForm = () => {
  let valid = true
  Object.keys(editAssetErrors).forEach(k => (editAssetErrors[k] = ''))

  if (!editAssetForm.address || !editAssetForm.address.trim()) {
    editAssetErrors.address = 'Vui lòng chọn địa chỉ tài sản.'
    valid = false
  }
  if (!editAssetForm.plotNumber) {
    editAssetErrors.plotNumber = 'Vui lòng nhập số tờ bản đồ.'
    valid = false
  }
  if (!editAssetForm.parcelNumber) {
    editAssetErrors.parcelNumber = 'Vui lòng nhập số thửa.'
    valid = false
  }
  if (!editAssetForm.totalArea || editAssetForm.totalArea <= 0) {
    editAssetErrors.totalArea = 'Diện tích tổng phải lớn hơn 0.'
    valid = false
  }
  if (!editAssetForm.landUseRight || !editLandUseChoice.value) {
    editAssetErrors.landUseRight = 'Vui lòng chọn quyền sử dụng tài sản.'
    valid = false
  }
  if (!editAssetForm.landPosition || !editLandPositionChoice.value) {
    editAssetErrors.landPosition = 'Vui lòng chọn vị trí.'
    valid = false
  }
  if (!editAssetForm.ownershipRelation || !editOwnershipChoice.value) {
    editAssetErrors.ownershipRelation = 'Vui lòng chọn quan hệ sở hữu.'
    valid = false
  }
  if (!editAssetForm.structure || !editAssetForm.structure.trim()) {
    editAssetErrors.structure = 'Vui lòng nhập kết cấu hoặc hình dạng đất.'
    valid = false
  }
  if (!editAssetForm.desire || editAssetForm.desire <= 0) {
    editAssetErrors.desire = 'Vui lòng nhập mức giá mong muốn hợp lệ.'
    valid = false
  }

  // 🔥 VALIDATION FILES: Kiểm tra có ít nhất 4 ảnh thường (không tính ảnh sổ)
  // 🔍 Phân loại file
  const normalImages = editAssetForm.files.filter(f => !f.isIG);
  const landBookImages = editAssetForm.files.filter(f => f.isIG);


// 🔥 1. ÍT NHẤT 4 ẢNH THƯỜNG
  if (normalImages.length < 4) {
    editAssetErrors.files = `Cần ít nhất 4 hình ảnh thường (hiện có ${normalImages.length}/4)`;
    valid = false;
  }

// 🔥 2. ÍT NHẤT 1 ẢNH SỔ
  if (landBookImages.length < 1) {
    editAssetErrors.files = `Cần ít nhất 1 ảnh của SỔ ĐỎ / SỔ HỒNG`;
    valid = false;
  }

  return valid;
}

function formatNumberWithSeparator(value) {
  if (!value && value !== 0) return '';
  const num = Number(String(value).replace(/\./g, ''));
  if (isNaN(num)) return String(value);
  return num.toLocaleString('vi-VN');
}

onMounted(async () => {
  const flag = localStorage.getItem("flag");
  localStorage.removeItem("flag")
  if( flag != null && flag ){
    const idR = localStorage.getItem("valuationReportId");
    localStorage.removeItem("valuationReportId")
    viewMode.value = 'valuationDetail';
    const valuation = { id: idR };
    await openValuationDetail(valuation);
  }

  await getViewLandAsset();
})


</script>

<style scoped>
/* Các style khác giữ nguyên */
.valuation-experience {
  min-height: 100vh;
}

.field-group {
  margin-bottom: 0.75rem;
}

.field-label {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
  font-size: 0.9rem;
}

.required-label::after {
  content: " *";
  color: #dc3545;
  font-weight: 600;
}

.invalid-hint {
  color: #dc3545;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  display: block;
}

.form-control,
.form-select {
  border-radius: 0.75rem;
  font-size: 0.95rem;
  min-height: 42px;
}

.form-control-sm,
.form-select-sm {
  min-height: 38px;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.15);
}

.field-group.has-error .form-control,
.field-group.has-error .form-select {
  border-color: #dc3545 !important;
}

.field-group.has-error .form-control:focus,
.field-group.has-error .form-select:focus {
  box-shadow: 0 0 0 0.15rem rgba(220, 53, 69, 0.25);
}

.field-group :deep(.address-selector select),
.field-group :deep(.address-selector input) {
  border-radius: 0.75rem;
  font-size: 0.95rem;
  min-height: 38px;
}

.field-group.has-error :deep(.address-selector select),
.field-group.has-error :deep(.address-selector input) {
  border-color: #dc3545 !important;
}

@media (max-width: 575.98px) {
  .field-label {
    font-size: 0.82rem;
  }

  .field-group {
    margin-bottom: 0.5rem;
  }
}

.profile-circle {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #3a7bd5, #00d2ff);
  font-size: 0.9rem;
}

.object-cover {
  object-fit: cover;
}

.valuation-tabs .nav-link {
  color: #6c757d;
  background-color: rgba(13, 110, 253, 0.08);
  transition: all 0.3s ease;
  border: 1px solid transparent;
  white-space: nowrap;
}

.valuation-tabs .nav-link:hover {
  color: #0d6efd;
  box-shadow: 0 10px 22px -18px rgba(13, 110, 253, 0.4);
}

.valuation-tabs .nav-link.active {
  color: #0d6efd;
  background-color: #ffffff;
  border-color: rgba(13, 110, 253, 0.2);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.1);
}

.asset-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 1rem;
  overflow: hidden;
}

.asset-card .action-button {
  flex: 1 1 calc(50% - 0.5rem);
  min-width: calc(50% - 0.5rem);
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.asset-card .action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px -18px rgba(13, 110, 253, 0.45);
}

.asset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px -12px rgba(13, 110, 253, 0.25);
}

.article-view {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
}

.article-body {
  max-width: 100%;
  margin: 0 auto;
  line-height: 1.6;
}

.section-title {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.8rem;
  color: #0d6efd;
  margin-bottom: 0.75rem;
}

.info-panel {
  border-radius: 1rem;
}

.history-item {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
}

.comparison-panel {
  font-family: system-ui, -apple-system, sans-serif;
}

.max-w-800 {
  max-width: 800px;
}

.analysis-card {
  border-left: 4px solid #0d6efd;
}

.document-item {
  transition: all 0.3s ease;
  cursor: pointer;
}

.document-item:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-actions {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-card:hover .image-actions {
  opacity: 1;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.25s ease;
}

.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* NEW STYLES FOR EXPANDABLE CARDS AND ANIMATIONS */
.expandable-card {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expandable-card .card-header {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.expandable-card .card-header:hover {
  background-color: rgba(13, 110, 253, 0.05);
}

.transition-rotate {
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* Form highlight styles */
.form-highlight {
  position: relative;
}

.form-main-card {
  border: 2px solid rgba(13, 110, 253, 0.1);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  position: relative;
  z-index: 2;
}

.form-main-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #0d6efd, #6f42c1);
  border-radius: 1rem;
  z-index: -1;
  opacity: 0.1;
}

/* Airplane animation */
.airplane-container {
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 40px;
  overflow: hidden;
}

.airplane {
  position: absolute;
  left: -60px;
  top: 50%;
  transform: translateY(-50%);
  animation: flyAcross 8s linear infinite;
  color: #0d6efd;
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.airplane::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -20px;
  right: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #0d6efd);
  transform: translateY(-50%);
}

@keyframes flyAcross {
  0% {
    left: -60px;
    transform: translateY(-50%) rotate(0deg);
  }
  10% {
    transform: translateY(-60%) rotate(5deg);
  }
  20% {
    transform: translateY(-40%) rotate(-3deg);
  }
  30% {
    transform: translateY(-55%) rotate(4deg);
  }
  40% {
    transform: translateY(-45%) rotate(-2deg);
  }
  50% {
    transform: translateY(-50%) rotate(0deg);
  }
  100% {
    left: calc(100% + 60px);
    transform: translateY(-50%) rotate(0deg);
  }
}

/* Particles background */
.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.6;
}

.article-header,
.article-body {
  position: relative;
  z-index: 2;
}

/* Side column cards styling */
.expandable-card .card-body {
  border-top: 1px solid rgba(0,0,0,0.05);
}

/* Responsive improvements */
@media (max-width: 991.98px) {
  .form-highlight .row > .col-lg-3 {
    margin-bottom: 1rem;
  }

  .form-main-card {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 767.98px) {
  .valuation-tabs {
    scrollbar-width: none;
  }

  .valuation-tabs::-webkit-scrollbar {
    display: none;
  }

  .article-body {
    padding: 0 0.25rem;
  }

  .asset-card .card-body,
  .valuation-summary .card-body {
    padding: 1rem;
  }

  .airplane {
    font-size: 1.2rem;
  }

  @keyframes flyAcross {
    0% {
      left: -40px;
    }
    100% {
      left: calc(100% + 40px);
    }
  }
}

@media (min-width: 768px) {
  .rounded-md-4 {
    border-radius: 1.5rem !important;
  }
}

.file-item:hover {
  background-color: #f8f9fa;
  border-color: #cfe2ff;
  transition: all 0.2s ease;
}

.file-item .fw-semibold {
  font-size: 0.95rem;
}

.file-item i.fa-file-pdf {
  color: #dc3545; /* đỏ PDF */
}
.btn-fast-orange-history {
  position: relative;                 /* ⭐ để chứa hiệu ứng */
  overflow: hidden;                   /* ⭐ tránh tràn */
  background: linear-gradient(135deg, #ff9f43, #ff7e29);
  border: 1px solid #d96a1b;
  color: #fff !important;
  top: -3px;
  margin-left: 10px;
  font-weight: 600;
  border-radius: 8px !important;
  padding: 5px 12px;
  box-shadow: 0 4px 14px rgba(255, 126, 41, 0.35);
  letter-spacing: 0.3px;
  transition: all 0.25s ease;
}

/* ✨ Hiệu ứng vàng chạy */
.btn-fast-orange-history::after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 70%;
  height: 100%;
  background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.45),
      rgba(255, 224, 135, 0.65),   /* ⭐ vàng nhẹ đẹp */
      transparent
  );
  transform: skewX(-20deg);
  animation: fastOrangeShine 2.2s infinite ease-in-out;
  pointer-events: none; /* tránh lỗi click */
}

@keyframes fastOrangeShine {
  0% { left: -120%; }
  60% { left: 130%; }
  100% { left: 160%; }
}

/* Hover nảy */
.btn-fast-orange-history:hover {
  background: linear-gradient(135deg, #ffae59, #ff8d3d);
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 8px 20px rgba(255, 126, 41, 0.45);
}
</style>
