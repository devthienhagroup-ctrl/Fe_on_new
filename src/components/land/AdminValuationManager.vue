<template>
  <div>
    <div class="d-flex justify-content-between align-items-center px-3 mb-3 pb-2 " style="border-bottom: solid 0.5px rgba(0,0,0,0.3)">
      <h5 class="fw-bold mb-0 d-flex align-items-center">
        Quản lý định giá
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
        <NotificationBell/>
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

    <!-- Tabs -->
    <ul class="nav nav-tabs valuation-tabs px-4">
      <li class="nav-item" v-for="tab in tabs" :key="tab.key">
        <button
            class="nav-link"
            :class="{ active: activeTab === tab.key }"
            type="button"
            @click="switchTab(tab.key)"
        >
          {{ tab.label }}
        </button>
      </li>
    </ul>

    <div class="tab-content card card-body border-top-0 rounded-top-0">

      <!-- TAB 1: DANH SÁCH TÀI SẢN -->
      <section v-show="activeTab === 'assets'">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 class="mb-0">Tài sản</h5>
          <div class="d-flex gap-2">
            <input
                v-model="assetSearch"
                class="form-control form-control-sm"
                placeholder="Tìm địa chỉ / số tờ / số thửa / tên khách / mong muốn"
                style="width: 400px"
                @keyup.enter="loadAssets(1)"
            />
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle table-sm">
            <thead class="table-light">
            <tr>
              <th>Địa chỉ</th>
              <th>Số tờ</th>
              <th>Số thửa</th>
              <th>Diện tích</th>
              <th>Chủ sở hữu</th>
              <th>Sở hữu tài sản</th>
              <th>Quyền sử dụng</th>
              <th>Trạng thái</th>
              <th>Số lần ĐG</th>
              <th class="text-end">#</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="asset in assetsData.content" :key="asset.id">
              <td>
                <div class="fw-semibold">
                  {{
                    formatAddress(asset.address)?.length > 45
                        ? formatAddress(asset.address).slice(0, 45) + "..."
                        : formatAddress(asset.address)
                  }}
                </div>
                <div class="text-muted small">
                  {{
                    formatAddress(asset.oldAddress)?.length > 45
                        ? formatAddress(asset.oldAddress).slice(0, 45) + '...'
                        : formatAddress(asset.oldAddress) || '—'
                  }}
                </div>
              </td>
              <td>{{ asset.plotNumber || '-' }}</td>
              <td>{{ asset.parcelNumber || '-' }}</td>
              <td>{{ numberFormat(asset.totalArea) }} m²</td>
              <td>{{ asset.ownerFullName || '—' }}</td>
              <td>{{ asset.ownershipRelation || '—' }}</td>
              <td>{{ asset.landUseRight || '—' }}</td>
              <td>
                <span :class="formatAssetStatus(asset.status).class" class="asset-status-row">
                  {{ formatAssetStatus(asset.status).text }}
                </span>
              </td>
              <td>{{ asset.valuationRound || 0 }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary me-2 rounded-3" @click="viewAssetDetail(asset)">Chi tiết</button>
              </td>
            </tr>
            <tr v-if="!assetsData.content.length">
              <td colspan="9" class="text-center text-muted py-3">Chưa có tài sản phù hợp.</td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
          <div class="small text-muted">
            Tổng: {{ assetsData.page?.totalElements || 0 }} tài sản — Trang {{ assetsData.page?.number + 1 || 1 }} / {{ assetsData.page?.totalPages || 1 }}
          </div>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary" :disabled="!assetsData.page || assetsData.page.number <= 0" @click="loadAssets(assetsData.page.number)">« Trước</button>
            <button class="btn btn-sm btn-outline-secondary" :disabled="!assetsData.page || assetsData.page.number >= assetsData.page.totalPages - 1" @click="loadAssets(assetsData.page.number + 2)">Sau »</button>
          </div>
        </div>
      </section>

      <!-- TAB 2: CHI TIẾT TÀI SẢN + LỊCH SỬ ĐỊNH GIÁ -->
      <section v-show="activeTab === 'detail'">
        <div v-if="selectedAsset" class="asset-detail">

          <!-- Header + actions -->
          <div class="row g-3" style="width: 100%">
            <div class="col-lg-10 col-md-12">
              <div>Địa chỉ: </div>
              <div>
                <AddressSelector3 v-if="assetEditMode"
                    class="w-100"
                    v-model="assetEditCache.address"
                    placeholder="Chọn hoặc nhập địa chỉ tài sản"
                    :key="assetEditCache.id"
                />
              <h5 v-else class="mb-1" v-if="!assetEditMode">{{ formatAddress(selectedAsset.address) }}</h5>
              </div>
              <div v-if="!assetEditMode" class="text-muted">Địa chỉ cũ: {{ selectedAsset.oldAddress || '—' }}</div>
              <div v-else class="mb-2 mt-2">
                <div>Địa chỉ cũ:</div>
                <input v-model="assetEditCache.oldAddress" class="form-control form-control-sm better-input" placeholder="Địa chỉ cũ" />
              </div>
              <div class="asset-status-inner">
                <div class="asset-status-row text-muted text-start " style="font-size: 16px;">
                  Trạng thái:
                  <span :class="formatAssetStatus(selectedAsset.status).class"
                        class="asset-status-pill">
                    {{ formatAssetStatus(selectedAsset.status).text }}
                  </span>
                </div>
              </div>

            </div>
            <div class="col-lg-2 col-md-12">
              <button v-if="!assetEditMode" class="btn btn-sm btn-outline-primary" @click="enterAssetEdit">Chỉnh sửa</button>
              <button v-else class="btn btn-sm btn-success me-2" @click="saveAssetEdit">Lưu</button>
              <button v-if="assetEditMode" class="btn btn-sm btn-outline-secondary" @click="cancelAssetEdit">Hủy</button>
            </div>
          </div>

          <!-- File Gallery -->
          <FileOrLand
              v-if="selectedAsset?.id"
              :key="galleryKey"
              :fileList="selectedAsset.files || []"
              :entityId="selectedAsset.id"
              entityType="land"
              :canEdit="assetEditMode"
              @update:files="handleFilesUpdate"
              class="mt-3"
          />
          <!-- 🔽 Hiển thị lỗi File -->
          <div v-if="assetEditMode && editAssetErrors.files" class="text-danger small mt-1">
            {{ editAssetErrors.files }}
          </div>


          <!-- Info blocks -->
          <div class="row g-3 mt-2">
            <div class="col-md-6">
              <div class="info-block">
                <h6>Thông tin tài sản</h6>
                <ul class="list-unstyled mb-0 small" v-if="!assetEditMode">
                  <li><strong>Số tờ:</strong> {{ selectedAsset.plotNumber || '—' }}</li>
                  <li><strong>Số thửa:</strong> {{ selectedAsset.parcelNumber || '—' }}</li>
                  <li><strong>Diện tích tổng:</strong> {{ numberFormat(selectedAsset.totalArea) }} m²</li>
                  <li><strong>Quan hệ sở hữu:</strong> {{ selectedAsset.ownershipRelation || '—' }}</li>
                  <li><strong>Quyền sử dụng:</strong> {{ selectedAsset.landUseRight || '—' }}</li>
                  <li><strong>Vị trí:</strong> {{ selectedAsset.landPosition || '—' }}</li>
                  <li><strong>Mong muốn:</strong> {{ numberFormat(selectedAsset.desire) || '—' }}</li>
                  <li><strong>Trạng thái:</strong> {{ selectedAsset.status || '—' }}</li>
                  <li><strong>Diện tích sàn:</strong> {{ numberFormat(selectedAsset.floorArea) || '—' }} m²</li>
                  <li><strong>Kết cấu:</strong> {{ selectedAsset.structure || '—' }}</li>
                </ul>
                <div v-else class="row g-2 small">
                  <div class="col-6">
                    <label class="form-label label-muted">Số tờ</label>
                    <input
                        v-model="assetEditCache.plotNumber"
                        class="form-control form-control-sm better-input"
                        :class="{ 'is-invalid': editAssetErrors.plotNumber }"
                    />
                    <div v-if="editAssetErrors.plotNumber" class="invalid-feedback">
                      {{ editAssetErrors.plotNumber }}
                    </div>
                  </div>

                  <div class="col-6">
                    <label class="form-label label-muted">Số thửa</label>
                    <input
                        v-model="assetEditCache.parcelNumber"
                        class="form-control form-control-sm better-input"
                        :class="{ 'is-invalid': editAssetErrors.parcelNumber }"
                    />
                    <div v-if="editAssetErrors.parcelNumber" class="invalid-feedback">
                      {{ editAssetErrors.parcelNumber }}
                    </div>
                  </div>

                  <div class="col-6">
                    <label class="form-label label-muted">Diện tích (m²)</label>
                    <input
                        type="number"
                        v-model.number="assetEditCache.totalArea"
                        class="form-control form-control-sm better-input"
                        :class="{ 'is-invalid': editAssetErrors.totalArea }"
                    />
                    <div v-if="editAssetErrors.totalArea" class="invalid-feedback">
                      {{ editAssetErrors.totalArea }}
                    </div>
                  </div>

                  <div class="col-6">
                    <label class="form-label label-muted">Quan hệ sở hữu</label>
                    <input
                        v-model="assetEditCache.ownershipRelation"
                        class="form-control form-control-sm better-input"
                        :class="{ 'is-invalid': editAssetErrors.ownershipRelation }"
                    />
                    <div v-if="editAssetErrors.ownershipRelation" class="invalid-feedback">
                      {{ editAssetErrors.ownershipRelation }}
                    </div>
                  </div>

                  <div class="col-6">
                    <label class="form-label label-muted">Quyền sử dụng</label>
                    <input
                        v-model="assetEditCache.landUseRight"
                        class="form-control form-control-sm better-input"
                        :class="{ 'is-invalid': editAssetErrors.landUseRight }"
                    />
                    <div v-if="editAssetErrors.landUseRight" class="invalid-feedback">
                      {{ editAssetErrors.landUseRight }}
                    </div>
                  </div>

                  <div class="col-6">
                    <label class="form-label label-muted">Vị trí</label>
                    <input
                        v-model="assetEditCache.landPosition"
                        class="form-control form-control-sm better-input"
                        :class="{ 'is-invalid': editAssetErrors.landPosition }"
                    />
                    <div v-if="editAssetErrors.landPosition" class="invalid-feedback">
                      {{ editAssetErrors.landPosition }}
                    </div>
                  </div>


                  <div class="col-6">
                    <label class="form-label label-muted">Diện tích sàn</label>
                    <input
                        v-model="assetEditCache.floorArea"
                        class="form-control form-control-sm better-input"
                    />
                  </div>

                  <div class="col-6">
                    <label class="form-label label-muted">Kết cấu nhà/ hình dạng đất</label>
                    <input
                        v-model="assetEditCache.structure"
                        class="form-control form-control-sm better-input"
                        :class="{ 'is-invalid': editAssetErrors.structure }"
                        placeholder="Ví dụ: 1 trệt, 2 lầu/ đất hình chữ nhật...."
                    />
                    <div v-if="editAssetErrors.structure" class="invalid-feedback">
                      {{ editAssetErrors.structure }}
                    </div>
                  </div>



                  <div class="col-12">
                    <label class="form-label label-muted">Mức giá mong muốn (VNĐ)</label>
                    <input
                        type="number"
                        v-model.number="assetEditCache.desire"
                        class="form-control form-control-sm better-input"
                        :class="{ 'is-invalid': editAssetErrors.desire }"
                    />
                    <div v-if="editAssetErrors.desire" class="invalid-feedback">
                      {{ editAssetErrors.desire }}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- Chủ sở hữu + thông tin khách -->
            <div class="col-md-6">
              <div class="info-block">
                <h6>Chủ sở hữu</h6>
                <ul class="list-unstyled mb-0 small" >
                  <li><strong>Tên chủ sở hữu:</strong> {{ selectedAsset.ownerOfLand.fullName || '—' }}</li>
                  <li><strong>Địa chỉ:</strong> {{ formatAddress(selectedAsset.ownerOfLand.address) || '—' }}</li>
                  <li><strong>Số điện thoại:</strong> {{ selectedAsset.ownerOfLand.phone || '—' }}</li>
                  <li><strong>Email:</strong> {{ selectedAsset.ownerOfLand.email || 'Không có' }}</li>
                  <li><strong>Người tạo tài sản:</strong> {{ selectedAsset.nguoiTao || 'Chính chủ' }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Lịch sử định giá -->
          <div class="mt-4">
            <h6 class="mb-3">Lịch sử định giá</h6>
            <div v-if="!selectedAsset.valuationReports || !selectedAsset.valuationReports.length" class="alert alert-light mb-0">
              Chưa có lần định giá nào.
            </div>
            <div v-else class="valuation-history space-y-3">
              <div class="history-item" v-for="report in selectedAsset.valuationReports" :key="report.valuationId">
                <button
                    class="history-toggle w-full"
                    type="button"
                    @click="toggleHistory(report.valuationId)"
                >
                  <div class="history-toggle-content">
                    <div class="history-toggle-title">
                      Lần {{ report.valuationRound }} — {{ formatDate(report.effectiveDate) }} → {{ formatDate(report.expiryDate) }}
                    </div>
                    <div class="history-toggle-price">{{ numberFormat(report.totalPrice) }} ₫</div>
                  </div>
                  <span class="history-toggle-icon" :class="{ 'is-open': isHistoryOpen(report.valuationId) }">
                    <i class="fa-solid fa-chevron-down"></i>
                  </span>
                </button>
                <div class="history-panel" :class="{ 'is-open': isHistoryOpen(report.valuationId) }">
                  <div class="history-panel-inner">
                    <div class="row small border-bottom pb-2 mb-2">
                      <div class="col-md-6">
                        <p><strong>Quy hoạch:</strong> {{ report.planning || '—' }}</p>
                        <p><strong>Phân loại đất tổng thể:</strong> {{ report.landClassification || '—' }}</p>
                        <p>
                          <strong>Bằng chữ:</strong>
                          {{ convertToWords(report.totalPrice) }}
                        </p>
                      </div>
                      <div class="col-md-6">
                        <p><strong>Ngày tạo:</strong> {{ formatDateTime(report.createdAt) }}</p>
                        <p><strong>Cập nhật:</strong> {{ formatDateTime(report.updatedAt) }}</p>
                        <p><strong>Trạng thái báo cáo:</strong>
                          <span
                              :class="formatReportStatus(report.status).class"
                              class="badge ms-2"
                          >
                            {{ formatReportStatus(report.status).text }}
                          </span>
                        </p>
                      </div>
                    </div>

                    <!-- 💰 So sánh giá mong muốn và giá định giá -->
                    <div
                        v-if="selectedAsset.desire && report.totalPrice"
                        class="alert mt-3"
                        :class="{
              'alert-danger': (selectedAsset.desire - report.totalPrice) / report.totalPrice > 0.05,
              'alert-success': (report.totalPrice - selectedAsset.desire) / report.totalPrice > 0.05,
              'alert-info': Math.abs((selectedAsset.desire - report.totalPrice) / report.totalPrice) <= 0.05
            }"
                    >
                      <template v-if="(selectedAsset.desire - report.totalPrice) / report.totalPrice > 0">
                        <i class="fa-solid fa-sack-dollar text-success me-1"></i>
                        Chủ nhà mong muốn <b>cao hơn</b> giá định giá khoảng
                        {{ (((selectedAsset.desire - report.totalPrice) / report.totalPrice) * 100).toFixed(2) }}%
                      </template>

                      <template v-else-if="(selectedAsset.desire - report.totalPrice) / report.totalPrice < 0">
                        <i class="fa-solid fa-sack-dollar text-success me-1"></i>
                        Chủ nhà mong muốn <b>thấp hơn</b> giá định giá khoảng
                        {{ (((report.totalPrice - selectedAsset.desire) / report.totalPrice) * 100).toFixed(2) }}%
                      </template>

                      <template v-else>
                        <i class="fa-solid fa-sack-dollar text-success me-1"></i>
                        Chủ nhà mong muốn <b>bằng</b> giá định giá khu vực
                      </template>

                    </div>

                    <!-- Bảng loại đất -->
                    <div class="table-responsive mt-2">
                      <table class="table table-sm table-bordered align-middle">
                        <thead class="table-light">
                        <tr>
                          <th>Loại đất</th>
                          <th class="text-end">Diện tích (m²)</th>
                          <th class="text-end">Đơn giá (VNĐ/m²)</th>
                          <th class="text-end">Giá (VNĐ)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="type in report.valuationLandTypes" :key="type.landTypeId">
                          <td>{{ type.landType }}</td>
                          <td class="text-end">{{ numberFormat(type.area) }}</td>
                          <td class="text-end">{{ numberFormat(type.unitPrice) }}</td>
                          <td class="text-end">{{ numberFormat(type.priceValue) }}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>

                    <!-- Files PDF -->
                    <div class="mt-3">
                      <h6 class="small fw-semibold">File định giá</h6>
                      <div v-if="!report.files || !report.files.length" class="text-muted small">Chưa đính kèm file.</div>
                      <ul v-else class="list-unstyled small mb-0">
                        <li
                            v-for="file in report.files"
                            :key="file.id"
                            class="d-flex justify-content-between align-items-center gap-3 py-2 border-top"
                        >
                          <div>
                            <div class="fw-semibold">{{ file.fileName }}</div>
                            <div class="text-muted">
                              Tạo: {{ formatDateTime(file.addedAt) }} —
                              {{ file.sizeBytes ? numberFormat(file.sizeBytes) + ' bytes' : '—' }}
                            </div>
                          </div>
                          <div class="d-flex gap-2">
                            <button
                                class="btn btn-sm btn-outline-primary"
                                @click="openPdfPreview(file.fileId, file.fileName)"
                            >
                              Xem
                            </button>
                            <!-- Chỉ hiện khi trạng thái là INREVIEW -->
                            <template v-if="report.status === 'INREVIEW'">
                              <button
                                  class="btn btn-sm btn-outline-warning"
                                  @click="handleEditReport(report)"
                              >
                                Chỉnh sửa
                              </button>

                              <button
                                  class="btn btn-sm btn-success"
                                  @click="handleReturnResult(report)"
                              >
                                Trả kết quả
                              </button>
                            </template>

                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- PDF Preview -->
          <div v-if="pdfPreviewUrl" class="mt-4">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0">Xem file định giá: {{ pdfPreviewName }}</h6>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-secondary" @click="clearPdfPreview">Đóng</button>
                <a class="btn btn-sm btn-primary" :href="pdfPreviewUrl" download>⬇️ Tải xuống</a>
              </div>
            </div>
            <div class="ratio ratio-4x3 border rounded mt-2">
              <iframe :src="pdfPreviewUrl" title="Xem PDF định giá" allowfullscreen></iframe>
            </div>
          </div>

        </div>
        <div v-else class="text-center text-muted py-5">Chọn một tài sản ở tab "Tài sản" để xem chi tiết.</div>
      </section>

      <!-- TAB 3: YÊU CẦU ĐỊNH GIÁ -->
      <section v-show="activeTab === 'requests'">
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 class="mb-0">Yêu cầu định giá</h5>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle table-sm">
            <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Tên chủ</th>
              <th>SĐT</th>
              <th>Người yêu cầu</th>
              <th>Địa chỉ tài sản</th>
              <th>Diện tích</th>
              <th>Mong muốn</th>
              <th>Trạng thái</th>
              <th>Ngày yêu cầu</th>
              <th class="text-start">#</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(request, index) in filteredRequests" :key="request.id">
              <td>{{ index + 1 }}</td>
              <td>{{ request.ownerFullName }}</td>
              <td>{{ request.ownerPhone }}</td>
              <td>{{ request.nguoiYeuCau }}</td>
              <td>{{ formatAddress(request.address) }}</td>
              <td>{{ numberFormat(request.totalArea) }} m²</td>
              <td>{{ numberFormat(request.desire) || '—' }}</td>
              <td>
                <span :class="formatStatus(request.statusService).class">
                  {{ formatStatus(request.statusService).text }}
                </span>
              </td>
              <td>{{ formatTimeAgo(request.assignedDate) }}</td>
              <td class="text-end col-actions">
                <div class="d-flex justify-content-start align-items-center gap-2">
                  <button v-if=" request.statusService === 'NEW' "
                      class="btn btn-sm btn-primary rounded-3"
                      @click="startValuationFromRequest(request)"
                  >
                    Tiếp nhận
                  </button>
                  <button v-else
                          class="btn btn-sm btn-primary rounded-3" style="min-width: 78.68px"
                          @click="startValuationFromRequest(request)"
                  >
                    Tiếp tục
                  </button>

                  <!-- Nút XÓA -->
                  <button
                      class="btn btn-sm btn-outline-danger rounded-3"
                      @click="deleteRequest(request)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!filteredRequests.length">
              <td colspan="9" class="text-center text-muted py-3">Không có yêu cầu phù hợp.</td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Hiển thị tổng số (không có phân trang) -->
        <div class="small text-muted mt-3">
          Tổng: {{ filteredRequests.length }} yêu cầu
        </div>
      </section>

      <!-- TAB 4: BIỂU MẪU ĐỊNH GIÁ -->
      <section v-show="activeTab === 'valuation'">

        <!-- 🔷 CARD THÔNG TIN KHÁCH + TÀI SẢN -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body p-3 p-md-4">

            <!-- TIÊU ĐỀ -->
            <h5 class="fw-bold text-primary mb-3">
              Thông tin định giá & tài sản
            </h5>

            <div class="row g-3">

              <!-- Khách hàng -->
              <div class="col-md-3">
                <div class="small text-muted mb-1">Tên khách</div>
                <div class="fw-semibold">{{ valuationDraft.ownerFullName || '—' }}</div>
              </div>

              <div class="col-md-3">
                <div class="small text-muted mb-1">Số điện thoại</div>
                <div class="fw-semibold">{{ valuationDraft.ownerPhone || '—' }}</div>
              </div>

              <div class="col-md-3">
                <div class="small text-muted mb-1">Email</div>
                <div class="fw-semibold">{{ valuationDraft.ownerEmail || 'Không có' }}</div>
              </div>

              <div class="col-md-3">
                <div class="small text-muted mb-1">Mong muốn</div>
                <div class="fw-semibold">{{ numberFormat(valuationDraft.desire) || '—' }}</div>
              </div>

            </div>

            <!-- THỜI GIAN HIỆU LỰC - TIÊU ĐỀ LỚN -->
            <!-- TÓM TẮT TÀI SẢN - DẠNG COMPACT -->
            <div v-if="currentAsset" class="mt-4 pt-3 border-top">
              <h6 class="fw-bold text-primary mb-3 d-flex align-items-center">
                Thông tin tài sản {{ formatAddress(currentAsset?.address) }}

                <button
                    class="btn btn-outline-primary btn-sm ms-3 px-3 py-1 d-flex align-items-center rounded-3"
                    @click="viewAssetDetailUpdate(currentAsset)"
                >
                  <i class="fa-solid fa-pen me-1"></i>
                  Chỉnh sửa
                </button>
              </h6>
              <div class="row g-3">

                <!-- Cột 1 -->
                <div class="col-md-4">
                  <div class="info-compact">
                    <span class="text-muted small">Số tờ:</span>
                    <span class="fw-semibold ms-2">{{ currentAsset.plotNumber || '—' }}</span>
                  </div>
                  <div class="info-compact">
                    <span class="text-muted small">Số thửa:</span>
                    <span class="fw-semibold ms-2">{{ currentAsset.parcelNumber || '—' }}</span>
                  </div>
                  <div class="info-compact">
                    <span class="text-muted small">Diện tích tổng:</span>
                    <span class="fw-semibold ms-2">{{ numberFormat(currentAsset.totalArea) }} m²</span>
                  </div>
                </div>

                <!-- Cột 2 -->
                <div class="col-md-4">
                  <div class="info-compact">
                    <span class="text-muted small">Diện tích sàn:</span>
                    <span class="fw-semibold ms-2">{{ numberFormat(currentAsset.floorArea) }} m²</span>
                  </div>
                  <div class="info-compact">
                    <span class="text-muted small">Kết cấu:</span>
                    <span class="fw-semibold ms-2">{{ currentAsset.structure || '—' }}</span>
                  </div>
                  <div class="info-compact">
                    <span class="text-muted small">Quan hệ sở hữu:</span>
                    <span class="fw-semibold ms-2">{{ currentAsset.ownershipRelation || '—' }}</span>
                  </div>
                </div>

                <!-- Cột 3 -->
                <div class="col-md-4">
                  <div class="info-compact">
                    <span class="text-muted small">Quyền sử dụng đất:</span>
                    <span class="fw-semibold ms-2">{{ currentAsset.landUseRight || '—' }}</span>
                  </div>
                  <div class="info-compact">
                    <span class="text-muted small">Vị trí:</span>
                    <span class="fw-semibold ms-2">{{ currentAsset.landPosition || '—' }}</span>
                  </div>
                  <div class="info-compact">
                    <span class="text-muted small">Trạng thái:</span>
                    <span class="fw-semibold ms-2">{{ currentAsset.status || '—' }}</span>
                  </div>
                </div>

              </div>



              <!-- FILE HÌNH ẢNH -->
              <div class="mt-3">
                <div class="small text-muted mb-2">Hình ảnh & tài liệu</div>
                <FileOrLand
                    :key="valuationDraft?.id"
                    :fileList="currentAsset.fileTables || []"
                    :entityId="valuationDraft.id"
                    entityType="land"
                    :canEdit="false"
                    @update:files="handleFilesUpdate"
                />
              </div>

            </div>
            <div class="mt-4 pt-3 border-top">
              <h6 class="fw-bold text-secondary mb-3">Thời gian hiệu lực</h6>

              <div class="row g-3">
                <div class="col-md-6">
                  <div class="small text-muted mb-1">Ngày hiệu lực</div>
                  <input
                      type="date"
                      class="form-control better-input"
                      v-model="valuationDraft.effectiveDate"
                      :class="{ 'is-invalid': valuationErrors.effectiveDate }"
                  />
                  <div v-if="valuationErrors.effectiveDate" class="invalid-feedback">
                    {{ valuationErrors.effectiveDate }}
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="small text-muted mb-1">Ngày hết hạn</div>
                  <input
                      type="date"
                      class="form-control better-input"
                      v-model="valuationDraft.expiryDate"
                      :class="{ 'is-invalid': valuationErrors.expiryDate }"
                  />
                  <div v-if="valuationErrors.expiryDate" class="invalid-feedback">
                    {{ valuationErrors.expiryDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🔷 CARD PHÂN LOẠI & QUY HOẠCH -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body p-3 p-md-4">
            <h5 class="fw-bold text-primary mb-3">Phân loại & Quy hoạch</h5>

            <div class="row g-3">
              <div class="col-md-12">
                <label class="form-label label-strong">Phân loại đất tổng thể</label>
                <input
                    class="form-control better-input"
                    v-model="valuationDraft.landClassification"
                    placeholder="Nhập phân loại đất tổng thể..."
                    :class="{ 'is-invalid': valuationErrors.landClassification }"
                />
                <div v-if="valuationErrors.landClassification" class="invalid-feedback">
                  {{ valuationErrors.landClassification }}
                </div>
              </div>

              <div class="col-12">
                <label class="form-label label-strong">Quy hoạch</label>
                <textarea
                    class="form-control better-input"
                    rows="2"
                    v-model="valuationDraft.planning"
                    placeholder="Nhập thông tin quy hoạch..."
                    :class="{ 'is-invalid': valuationErrors.planning }"
                ></textarea>
                <div v-if="valuationErrors.planning" class="invalid-feedback">
                  {{ valuationErrors.planning }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🔷 CARD BẢNG LOẠI ĐẤT -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body p-3 p-md-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="fw-bold text-primary mb-0">Bảng loại đất</h5>
              <button class="btn btn-sm btn-outline-primary" @click="addTypeRow">
                <i class="fa fa-plus me-1"></i>Thêm dòng
              </button>
            </div>

            <div class="table-responsive">
              <table class="table table-bordered table-sm align-middle">
                <thead class="table-light">
                <tr>
                  <th style="width: 350px">Loại đất</th>
                  <th style="width: 200px" class="text-end">Diện tích (m²)</th>
                  <th style="width: 250px" class="text-end">Đơn giá (VNĐ/m²)</th>
                  <th class="text-end">Giá (VNĐ)</th>
                  <th class="text-center" style="width: 70px">#</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="(row, index) in valuationDraft.valuationLandTypes" :key="row._key">
                  <td>
                    <template v-if="!row.isCustom">
                      <div class="dropdown-wrapper relative">
                        <select
                            class="valuation-select w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            v-model="row.landType"
                            @change="handleLandTypeChange(row, $event)"
                        >
                          <option disabled value="">-- Chọn loại đất --</option>
                          <option>Đất ở tại đô thị</option>
                          <option>Đất ở tại nông thôn</option>
                          <option>Đất trồng cây lâu năm</option>
                          <option>Đất trồng cây hàng năm</option>
                          <option>Đất thương mại dịch vụ</option>
                          <option value="__custom__">+ Tự nhập...</option>
                        </select>
                        <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                          <i class="fa-solid fa-chevron-down"></i>
                        </span>
                      </div>
                    </template>

                    <template v-else>
                      <div class="d-flex align-items-center gap-2">
                        <input
                            type="text"
                            class="form-control form-control-sm better-input"
                            v-model="row.landType"
                            placeholder="Nhập loại đất..."
                        />
                        <button class="btn btn-sm btn-outline-secondary" @click="row.isCustom = false; row.landType = ''">
                          ↩
                        </button>
                      </div>
                    </template>
                  </td>

                  <td>
                    <input
                        type="number"
                        class="form-control form-control-sm text-end better-input"
                        v-model.number="row.areaFormatted"
                        @input="handleAreaInput(row, $event)"
                        placeholder="0"
                        step="0.1"
                    />
                  </td>

                  <td>
                    <div class="input-group input-group-sm">
                      <input
                          type="number"
                          class="form-control form-control-sm text-end better-input"
                          v-model.number="row.unitPriceFormatted"
                          @input="handleUnitPriceInput(row, $event)"
                          placeholder="0"
                      />
                    </div>
                  </td>


                  <td class="text-end fw-semibold">{{ numberFormat(row.priceValue) }} ₫</td>

                  <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" @click="removeTypeRow(index)">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>

                <tr v-if="!valuationDraft.valuationLandTypes.length">
                  <td colspan="5" class="text-center text-muted py-4">
                    <i class="fa fa-table me-2"></i>Chưa có loại đất nào. Hãy thêm dòng để bắt đầu.
                  </td>
                </tr>
                </tbody>
              </table>

              <div v-if="valuationErrors.valuationLandTypes" class="text-danger small mt-1">
                {{ valuationErrors.valuationLandTypes }}
              </div>
            </div>

            <!-- TỔNG GIÁ TRỊ -->
            <div class="d-flex justify-content-end align-items-center mt-3">
              <div class="text-end">
                <div class="fw-bold fs-5 text-primary">Tổng giá trị: {{ numberFormat(typesTotal) }} ₫</div>
                <div class="small text-muted">Tự động tính từ bảng trên</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 🔷 CARD KẾT QUẢ ĐỊNH GIÁ -->
        <div class="card shadow-sm border-0">
          <div class="card-body p-3 p-md-4">
            <h5 class="fw-bold text-primary mb-3">Kết quả định giá</h5>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label label-strong">Làm tròn cao nhất</label>
                <input
                    type="text"
                    class="form-control better-input text-start"
                    v-model="totalMaxPriceFormatted"
                    @input="handleTotalMaxPriceInput"
                    :class="{ 'is-invalid': valuationErrors.totalMaxPrice }"
                />
                <div v-if="valuationErrors.totalMaxPrice" class="invalid-feedback">
                  {{ valuationErrors.totalMaxPrice }}
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label label-strong">Bằng chữ</label>
                <input
                    class="form-control better-input"
                    v-model="valuationDraft.inWords"
                    placeholder="Viết bằng chữ..."
                    :class="{ 'is-invalid': valuationErrors.inWords }"
                />
                <div v-if="valuationErrors.inWords" class="invalid-feedback">
                  {{ valuationErrors.inWords }}
                </div>
              </div>
            </div>

            <!-- HÀNH ĐỘNG -->
            <div class="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
              <div class="d-flex gap-2">
                <button v-if="!pdfPreviewUrl" class="btn btn-outline-primary" @click="previewPDF">
                  <i class="fa fa-eye me-2"></i>Xem trước PDF
                </button>
                <button v-else class="btn btn-primary" @click="saveValuation">
                  <i class="fa fa-save me-2"></i>Lưu định giá
                </button>
                <button class="btn btn-outline-secondary" @click="resetValuationDraft">
                  <i class="fa fa-refresh me-2"></i>Làm mới
                </button>
              </div>

              <div class="text-end">
                <div class="fw-semibold text-success">Tổng: {{ numberFormat(typesTotal) }} ₫</div>
                <div class="small text-muted">{{ valuationDraft.valuationLandTypes.length }} loại đất</div>
              </div>

            </div>

            <!-- PDF PREVIEW -->
            <div v-if="pdfPreviewUrl" class="mt-4">
              <h6 class="fw-bold text-primary mb-2">Xem trước PDF</h6>

              <iframe
                  :src="pdfPreviewUrl"
                  style="height: 1000px; width:100%"
                  allowfullscreen
              ></iframe>

              <div class="text-end mt-3">
                <button class="btn btn-secondary me-2" @click="clearPdfPreview">
                  <i class="fa fa-times me-1"></i>Đóng xem trước
                </button>
              </div>
            </div>


          </div>
        </div>

      </section>


    </div>

    <!-- Modal Thêm/Sửa tài sản -->
    <div class="modal fade" id="assetModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ assetForm.id ? 'Cập nhật tài sản' : 'Thêm tài sản' }}</h5>
            <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label label-strong">Địa chỉ</label>
                <input class="form-control better-input" v-model="assetForm.address" />
              </div>
              <div class="col-12">
                <label class="form-label label-strong">Địa chỉ cũ</label>
                <input class="form-control better-input" v-model="assetForm.oldAddress" />
              </div>
              <div class="col-6">
                <label class="form-label label-strong">Số tờ</label>
                <input class="form-control better-input" v-model="assetForm.plotNumber" />
              </div>
              <div class="col-6">
                <label class="form-label label-strong">Số thửa</label>
                <input class="form-control better-input" v-model="assetForm.parcelNumber" />
              </div>
              <div class="col-6">
                <label class="form-label label-strong">Diện tích (m²)</label>
                <input type="number" class="form-control better-input" v-model.number="assetForm.totalArea" />
              </div>
              <div class="col-6">
                <label class="form-label label-strong">Tên chủ sở hữu</label>
                <input class="form-control better-input" v-model="assetForm.ownerFullName" />
              </div>
              <div class="col-6">
                <label class="form-label label-strong">Quan hệ sở hữu</label>
                <input class="form-control better-input" v-model="assetForm.ownershipRelation" />
              </div>
              <div class="col-6">
                <label class="form-label label-strong">Quyền sử dụng</label>
                <input class="form-control better-input" v-model="assetForm.landUseRight" />
              </div>
              <div class="col-6">
                <label class="form-label label-strong">Vị trí</label>
                <input class="form-control better-input" v-model="assetForm.landPosition" />
              </div>
              <div class="col-6">
                <label class="form-label label-strong">Loại đất</label>
                <input class="form-control better-input" v-model="assetForm.desire" />
              </div>
              <div class="col-12">
                <label class="form-label label-strong">Trạng thái</label>
                <input class="form-control better-input" v-model="assetForm.status" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="saveAssetModal">Lưu</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NotificationBell from "../NotificationBell.vue";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { PDFDocument, rgb } from "pdf-lib";
import * as fontkit from "fontkit";
import fontRegular from "../../assets/font-times-new-roman/SVN-Times New Roman.ttf";
import fontBold from "../../assets/font-times-new-roman/SVN-Times New Roman Bold.ttf";
import logoImg from "/imgs/logo.png";
import FileOrLand from "./FileOrLand.vue";
import { loadPrivateFileDataUrl } from "../../api/fileApi.js";
import { showLoading, updateAlertError, updateAlertSuccess, showSuccess, showWarning } from "../../assets/js/alertService.js";
import AddressSelector3 from "./my-valuation/components/AddressSelector3.vue";
import  api  from "../../api/api.js"
import { useAuthStore } from "../../stores/authStore.js";
import { useSidebarStore } from "../../stores/sidebarStore.js";
const authStore = useAuthStore();
const info = authStore.userInfo;
const sidebar = useSidebarStore();

/* ---------------------- Tabs ---------------------- */
const tabs = [
  { key: "assets", label: "Tài sản" },
  { key: "detail", label: "Chi tiết" },
  { key: "requests", label: "Yêu cầu định giá" },
  { key: "valuation", label: "Định giá" },
];
const activeTab = ref("assets");
function switchTab(tab) {
  activeTab.value = tab;

  // Rời khỏi tab định giá hoặc tab chi tiết → clear asset
  if (tab !== "valuation" && tab !== "detail") {
    selectedAsset.value = null;
  }
}

const openHistoryId = ref(null);

function toggleHistory(id) {
  openHistoryId.value = openHistoryId.value === id ? null : id;
}

function isHistoryOpen(id) {
  return openHistoryId.value === id;
}

const editAssetMode = ref(false);
const editAsset = ref({});

function toggleEditAsset() {
  if (!editAssetMode.value) {
    editAsset.value = { ...currentAsset.value }; // copy dữ liệu hiện tại
    editAssetMode.value = true;
  } else {
    editAssetMode.value = false;
  }
}

function saveAssetEditsLocal() {
  // Ghi tạm thay đổi vào currentAsset, không gọi API
  Object.assign(currentAsset.value, editAsset.value);
  editAssetMode.value = false;
  updateAlertSuccess("✅ Đã cập nhật thông tin tài sản (chưa gửi server)");
}

/* ---------------------- Data Structures ---------------------- */
const assetsData = reactive({
  content: [],
  page: {
    size: 10,
    number: 0,
    totalElements: 0,
    totalPages: 1
  }
});

const requestsData = reactive({
  content: []
});

/* ---------------------- Asset list + API ---------------------- */
const assetSearch = ref("");
const assetPage = ref(1);

// === Lấy danh sách tài sản đất (bảng quản trị) ===
async function loadAssets(pageNo = 1, pageSize = 10) {
  try {
    const res = await api.get("/admin.thg/land-assets/table", {
      params: {
        pageNo: pageNo,
        pageSize,
        search: assetSearch.value || null
      },
      withCredentials: true
    });

    Object.assign(assetsData, res.data);
    console.log("📄 Danh sách tài sản:", assetsData);
  } catch (err) {
    const message = err.response?.data || "Lỗi khi tải danh sách tài sản";
    console.error("⚠️ Lỗi khi tải danh sách tài sản:", err);
    updateAlertError(message);
  }
}

// Tìm kiếm tài sản
watch(assetSearch, () => {
  loadAssets(1);
});

/* ---------------------- Detail Asset ---------------------- */

async function viewAssetDetailUpdate(asset){
  await viewAssetDetail(asset)
  editAssetMode.value = true;
}
const galleryKey = ref(0);

const selectedAsset = ref(null);
watch(
    () => selectedAsset.value?.id,
    () => {
      openHistoryId.value = null;
    }
);
async function viewAssetDetail(asset) {
  try {
    const oldServiceRQID = selectedAsset.value?.serviceRQID;
    const res = await api.get(`/admin.thg/land-assets/detail/${asset.id}`);
    console.log("📋 Chi tiết tài sản:", res.data);


    selectedAsset.value = null;

    // 🧱 2️⃣ Gán dữ liệu mới từ backend
    selectedAsset.value = res.data || {};
    galleryKey.value++;



    // 🧩 3️⃣ Đảm bảo luôn có mảng trống (tránh dính file cũ)
    ['files', 'fileTables', 'newFiles', 'deletedFileIds'].forEach(k => {
      if (!Array.isArray(selectedAsset.value[k])) selectedAsset.value[k] = [];
    });

    console.log("👉 FULL DTO backend trả về:", JSON.stringify(res.data, null, 2));

    activeTab.value = "detail";
    editAssetMode.value = false;
  } catch (err) {
    console.error("⚠️ Lỗi khi tải chi tiết tài sản:", err);
    updateAlertError(err.response?.data || "Lỗi khi tải chi tiết tài sản");
  }
}

/* 🔥 File Gallery handler - Áp dụng logic quản lý file tương tự */
function handleFilesUpdate(updatedFiles) {
  if (!selectedAsset.value) return;

  console.group("🧩 [DEBUG] handleFilesUpdate");

  // 1️⃣ Tách file cũ / mới
  const existingFiles = updatedFiles.filter(f => !f.file && f.id);
  const newFiles = updatedFiles.filter(f => f.file instanceof File);

  // 2️⃣ Phân loại theo isIG (ảnh sổ)
  const newNormalFiles = newFiles.filter(f => !f.isIG).map(f => f.file);
  const newLandBookFiles = newFiles.filter(f => f.isIG).map(f => f.file);

  // 3️⃣ Tìm file xoá
  const originalIds = (selectedAsset.value.files || []).map(f => f.id);
  const currentIds = existingFiles.map(f => f.id);

  const deletedFileIds = originalIds.filter(id => {
    const file = selectedAsset.value.files.find(f => f.id === id);
    return !currentIds.includes(id) && file && !file.isIG;
  });

  const deletedLandBookFileIds = originalIds.filter(id => {
    const file = selectedAsset.value.files.find(f => f.id === id);
    return !currentIds.includes(id) && file && file.isIG;
  });

  // 4️⃣ Gắn vào selectedAsset
  selectedAsset.value.files = updatedFiles;
  selectedAsset.value.newFiles = newNormalFiles;
  selectedAsset.value.newLandBookFiles = newLandBookFiles;

  selectedAsset.value.deletedFileIds = deletedFileIds;
  selectedAsset.value.deletedLandBookFileIds = deletedLandBookFileIds;

  console.log("🆕 newNormalFiles:", newNormalFiles);
  console.log("🆕 newLandBookFiles:", newLandBookFiles);
  console.log("🗑 deletedFileIds:", deletedFileIds);
  console.log("🗑 deletedLandBookFileIds:", deletedLandBookFileIds);

  console.groupEnd();
}

/* ---------------------- Asset CRUD ---------------------- */
const assetForm = reactive({});


async function previewPDF() {
  const a = currentAsset.value;
  if (!a) {
    updateAlertError("Chưa chọn tài sản để xem trước!");
    return;
  }
  if (!validateValuationDraft()) return;

  try {
    // Chuẩn bị dữ liệu report như trong saveValuation
    const report = {
      valuationId: valuationDraft.valuationId || Date.now(),
      effectiveDate: valuationDraft.effectiveDate,
      expiryDate: valuationDraft.expiryDate,
      valuationRound: valuationDraft.valuationRound,
      planning: valuationDraft.planning,
      landClassification: valuationDraft.landClassification,
      totalPrice: typesTotal.value,
      totalMaxPrice: valuationDraft.totalMaxPrice,
      inWords: valuationDraft.inWords,
      valuationLandTypes: valuationDraft.valuationLandTypes,
    };

    // Tạo PDF tạm thời
    const pdfBytes = await generateValuationPDF(a, report);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Hiển thị ngay tại khung preview hiện có
    pdfPreviewUrl.value = url;
    pdfPreviewName.value = `THG_DinhGia_XemTruoc_${a.id}.pdf`;

    updateAlertSuccess("Đã tạo bản xem thử PDF!");
  } catch (err) {
    console.error("❌ Lỗi khi tạo PDF xem trước:", err);
    updateAlertError("Không thể tạo file PDF xem trước.");
  }
}

async function saveAssetModal() {
  if (!assetForm.address) {
    updateAlertError("Nhập địa chỉ tài sản");
    return;
  }

  try {

    if (assetForm.id) {
      // Cập nhật tài sản
      await api.put(`/admin.thg/land-assets/${assetForm.id}`, assetForm);
      updateAlertSuccess("Cập nhật tài sản thành công");
    } else {
      // Thêm tài sản mới
      await api.post("/admin.thg/land-assets", assetForm);
      updateAlertSuccess("Thêm tài sản thành công");
    }

    bootstrap.Modal.getInstance("#assetModal").hide();
    loadAssets(assetsData.page.number + 1); // Reload current page
  } catch (err) {
    const message = err.response?.data || "Lỗi khi lưu tài sản";
    console.error("⚠️ Lỗi khi lưu tài sản:", err);
    updateAlertError(message);
  } finally {
    showLoading(false);
  }
}

/* 🔥 Chỉnh sửa inline - Áp dụng logic quản lý file tương tự */
const assetEditMode = ref(false);
const assetEditCache = reactive({});
function enterAssetEdit() {
  assetEditMode.value = true;
  Object.assign(assetEditCache, { ...selectedAsset.value });
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
});

const isImage = (fileName) => /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName || "");
function validateEditAssetForm() {
  let valid = true;

  // Reset lỗi đúng cách
  for (let k in editAssetErrors) editAssetErrors[k] = '';

  const a = assetEditCache;

  // ====== VALIDATE TRƯỜNG CƠ BẢN ======
  if (!a.address?.trim()) {
    editAssetErrors.address = 'Vui lòng chọn địa chỉ tài sản';
    valid = false;
  }
  if (!a.plotNumber) {
    editAssetErrors.plotNumber = 'Vui lòng nhập số tờ bản đồ';
    valid = false;
  }
  if (!a.parcelNumber) {
    editAssetErrors.parcelNumber = 'Vui lòng nhập số thửa';
    valid = false;
  }
  if (!a.totalArea || a.totalArea <= 0) {
    editAssetErrors.totalArea = 'Diện tích tổng phải lớn hơn 0';
    valid = false;
  }
  if (!a.landUseRight) {
    editAssetErrors.landUseRight = 'Nhập quyền sử dụng đất';
    valid = false;
  }
  if (!a.landPosition) {
    editAssetErrors.landPosition = 'Nhập vị trí tài sản';
    valid = false;
  }
  if (!a.ownershipRelation) {
    editAssetErrors.ownershipRelation = 'Nhập quan hệ sở hữu';
    valid = false;
  }
  if (!a.structure?.trim()) {
    editAssetErrors.structure = 'Vui lòng nhập kết cấu nhà/đất';
    valid = false;
  }
  if (!a.desire || a.desire <= 0) {
    editAssetErrors.desire = 'Nhập giá mong muốn hợp lệ';
    valid = false;
  }

  // ====== VALIDATE FILES ======
  const normalImages = a.files.filter(f => !f.isIG);
  const landBookImages = a.files.filter(f => f.isIG);

  // ẢNH THƯỜNG: ít nhất 4
  if (normalImages.length < 4) {
    editAssetErrors.files =
        `Cần ít nhất 4 ảnh thường (hiện có ${normalImages.length}/4)`;
    valid = false;
  }

  // ẢNH SỔ: ít nhất 1
  if (landBookImages.length < 1) {
    editAssetErrors.files =
        `Cần ít nhất 1 ảnh sổ đỏ / sổ hồng hợp lệ`;
    valid = false;
  }

  return valid;
}



async function saveAssetEdit() {
  try {
    if (!validateEditAssetForm()) {
      return;
    }

    // 🧩 Tạo FormData
    const formData = new FormData();
    console.log("📝 Dữ liệu assetEditCache:", assetEditCache);

    // 🔥 Tạo DTO bỏ các trường file
    const dto = { ...assetEditCache };
    delete dto.files;
    delete dto.newFiles;
    delete dto.deletedFileIds;
    delete dto.fileTables;
    delete dto.valuationReports;
    delete dto.ownerOfLand;

    // Đưa JSON DTO vào "data"
    // 🔥 Đưa JSON DTO
    formData.append(
        "data",
        new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

// 🔥 ẢNH THƯỜNG MỚI
    (selectedAsset.value.newFiles || []).forEach(file => {
      formData.append("files", file);
    });

// 🔥 ẢNH SỔ MỚI
    (selectedAsset.value.newLandBookFiles || []).forEach(file => {
      formData.append("landBookFiles", file);
    });

// 🔥 ID ảnh thường xoá
    if (selectedAsset.value.deletedFileIds?.length > 0) {
      formData.append(
          "deletedFileIds",
          selectedAsset.value.deletedFileIds.join(",")
      );
    }

// 🔥 ID ảnh sổ xoá
    if (selectedAsset.value.deletedLandBookFileIds?.length > 0) {
      formData.append(
          "deletedLandBookFileIds",
          selectedAsset.value.deletedLandBookFileIds.join(",")
      );
    }


    await showLoading(
        api.post(
            `/admin.thg/land-assets/update`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        )
    );

    // 🟢 Cập nhật giao diện local
    Object.assign(selectedAsset.value, assetEditCache);

    // 🔥 Reset các biến quản lý file sau khi lưu thành công
    selectedAsset.value.newFiles = [];
    selectedAsset.value.deletedFileIds = [];

    assetEditMode.value = false;
    await loadAssets(assetsData.page.number, assetsData.page.size);
    await viewAssetDetail(selectedAsset.value);
    activeTab.value = "detail";
    updateAlertSuccess("✅ Cập nhật tài sản thành công");

  } catch (err) {
    const message = err.response?.data || "❌ Lỗi khi cập nhật tài sản";
    console.error("⚠️ Lỗi khi cập nhật tài sản:", err);

    // 🔥 Reset các biến quản lý file khi có lỗi
    selectedAsset.value.newFiles = [];
    selectedAsset.value.deletedFileIds = [];

    updateAlertError(message);
  }
}

function cancelAssetEdit() {
  assetEditMode.value = false;
  // 🔥 Reset các biến quản lý file khi hủy
  if (selectedAsset.value) {
    selectedAsset.value.newFiles = [];
    selectedAsset.value.deletedFileIds = [];
  }
}

/* ---------------------- Requests API ---------------------- */
const requestSearch = ref("");

// === Lấy danh sách yêu cầu định giá ===
async function loadRequests() {
  try {
    const res = await api.get('/admin.thg/land-assets/valuation/list');
    // Gán trực tiếp vào content vì API trả về array
    requestsData.content = res.data || [];

    console.log("📄 Danh sách yêu cầu:", requestsData.content);
  } catch (err) {
    const message = err.response?.data || "Lỗi khi tải danh sách yêu cầu";
    console.error("⚠️ Lỗi khi tải danh sách yêu cầu:", err);
    updateAlertError(message);
  }
}

// Filter requests real-time
const filteredRequests = computed(() => {
  if (!requestSearch.value) return requestsData.content;

  const search = requestSearch.value.toLowerCase();
  return requestsData.content.filter(request =>
      (request.ownerFullName?.toLowerCase().includes(search)) ||
      (request.phone?.toLowerCase().includes(search)) ||
      (request.email?.toLowerCase().includes(search)) ||
      (request.assetAddress?.toLowerCase().includes(search)) ||
      (request.note?.toLowerCase().includes(search))
  );
});

function resetRequestSearch() {
  requestSearch.value = "";
}

function startValuationFromRequest(request) {
  resetValuationDraft();

  // Tạo một asset object từ request để sử dụng trong form định giá
  const tempAsset = {
    id: request.id, // Sử dụng ID của request
    address: request.address,
    oldAddress: request.oldAddress || "",
    plotNumber: request.plotNumber || "",
    parcelNumber: request.parcelNumber || "",
    totalArea: request.totalArea || 0,
    ownerFullName: request.ownerFullName,
    ownershipRelation: request.ownershipRelation || "",
    landUseRight: request.landUseRight || "",
    landPosition: request.landPosition || "",
    fileTables: request.fileTables || [],
    structure: request.structure || "",
    desire: request.desire || "",
    status: request.status || "Mới",
    floorArea: request.floorArea || "",
    valuationRound: 0,
    serviceRQID: request.serviceRQID,
    // Thêm các trường có thể thiếu
    ownerOfLand: {
      fullName: request.ownerFullName,
      address:  request.ownerAddress,
      phone: request.ownerPhone,
      email: request.ownerEmail
    }
  };

  // Gán tài sản hiện tại và thông tin khách hàng
  console.log(request)
  selectedAsset.value = tempAsset;
  valuationDraft.landAssetId = request.id;
  valuationDraft.ownerFullName = request.ownerFullName;
  valuationDraft.ownerPhone = request.ownerPhone;
  valuationDraft.ownerEmail = request.ownerEmail;
  valuationDraft.desire = request.desire;
  valuationDraft.address = request.address;

  const rest = api.get("/admin.thg/land-assets/valuation/acp/" + request.serviceRQID);

  activeTab.value = "valuation";
}

/* ---------------------- Valuation Form ---------------------- */
const valuationDraft = reactive({
  valuationId: null,
  ownerFullName: "",
  ownerPhone: "",
  ownerEmail: "",
  desire: "",
  landAssetId: null,
  address: "",
  effectiveDate: today(),
  expiryDate: plusDays(today(), 30),
  valuationRound: 1,
  planning: "",
  landClassification: "",
  totalMaxPrice: 0,
  inWords: "",
  valuationLandTypes: []
});

const currentAsset = computed(() => selectedAsset.value || assetsData.content.find(a => a.id === valuationDraft.landAssetId) || null);

/* Format số với dấu phân cách */
function formatNumberWithSeparator(value) {
  if (!value && value !== 0) return '';
  const num = Number(String(value).replace(/\./g, ''));
  if (isNaN(num)) return String(value);
  return num.toLocaleString('vi-VN');
}

function parseFormattedNumber(v) {
  if (!v) return 0;

  let str = String(v).trim();

  // Nếu user nhập 1,4 → đổi về 1.4
  str = str.replace(',', '.');

  // Nếu user nhập 1.234.567 → xoá dấu chấm phân cách
  // TRỪ dấu chấm cuối làm thập phân
  const parts = str.split('.');

  if (parts.length > 2) {
    const last = parts.pop(); // phần thập phân
    str = parts.join('') + '.' + last;
  }

  const num = Number(str);
  return isNaN(num) ? 0 : num;
}


function addTypeRow() {
  valuationDraft.valuationLandTypes.push({
    _key: cryptoKey(),
    landType: "",
    isCustom: false,
    area: 0,
    areaFormatted: "0",
    unitPrice: 0,
    unitPriceFormatted: "0",
    priceValue: 0
  });
}

function removeTypeRow(i) { valuationDraft.valuationLandTypes.splice(i, 1); }

function updateTypePrice(row) {
  const area = parseFormattedNumber(row.areaFormatted);
  const unitPrice = parseFormattedNumber(row.unitPriceFormatted);
  row.area = area;
  row.unitPrice = unitPrice;
  row.priceValue = area * unitPrice;
}

function handleLandTypeChange(row, event) {
  if (event.target.value === "__custom__") {
    row.isCustom = true;
    row.landType = "";
  } else {
    row.isCustom = false;
  }
}

function formatAssetStatus(status) {
  if (!status) return { text: "—", class: "badge bg-secondary" };

  switch (status.toUpperCase()) {
    case "CHƯA ĐỊNH GIÁ":
      return {
        text: "Chưa định giá",
        class: "badge badge-red-subtle text-danger fw-semibold"
      };

    case "ĐÃ ĐỊNH GIÁ SƠ BỘ":
      return {
        text: "Đã định giá sơ bộ",
        class: "badge badge-green-subtle text-success fw-semibold"
      };

    case "BÁN NHANH 30 NGÀY":
      return {
        text: "Bán nhanh 30 ngày",
        class: "badge badge-purple-subtle fw-semibold"
      };

    case "ĐÃ BÁN":
      return {
        text: "Đã bán",
        class: "badge badge-info-subtle fw-semibold"
      };


    default:
      return { text: status, class: "badge bg-light text-dark" };
  }
}



function handleCustomLandTypeInput(row) {
  if (row.customLandType && row.customLandType.trim() !== '') {
    row.landType = row.customLandType.trim();
  }
}

function handleAreaInput(row, event) {
  updateTypePrice(row);
}


function formatAreaInput(row) {
  row.areaFormatted = formatNumberWithSeparator(row.area);
}

function handleUnitPriceInput(row, event) {
  updateTypePrice(row);
}


function formatUnitPriceInput(row) {
  row.unitPriceFormatted = formatNumberWithSeparator(row.unitPrice);
}

/* Tổng giá = sum(priceValue) */
const typesTotal = computed(() =>
    valuationDraft.valuationLandTypes.reduce((s, v) => s + (Number(v.priceValue)||0), 0)
);

/* Làm tròn cao nhất với format */
const totalMaxPriceFormatted = computed({
  get: () => formatNumberWithSeparator(valuationDraft.totalMaxPrice),
  set: (value) => {
    const num = parseFormattedNumber(value);
    valuationDraft.totalMaxPrice = num;
    if (!manualInWordsEdit.value) {
      valuationDraft.inWords = convertToWords(num);
    }
  }
});

function handleTotalMaxPriceInput(event) {
  totalMaxPriceFormatted.value = event.target.value;
}

function formatTotalMaxPrice() {
  totalMaxPriceFormatted.value = formatNumberWithSeparator(valuationDraft.totalMaxPrice);
}

/* Bằng chữ với viết hoa chữ đầu */
const manualInWordsEdit = ref(false);

function capitalizeFirstLetterAuto(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function capitalizeFirstLetter(event) {
  manualInWordsEdit.value = true;
  const value = event.target.value;
  valuationDraft.inWords = value.charAt(0).toUpperCase() + value.slice(1);
}

/* Khi tổng thay đổi → tự set Làm tròn cao nhất & Bằng chữ */
watch(typesTotal, (total) => {
  if (!manualInWordsEdit.value) {
    valuationDraft.totalMaxPrice = roundMillion(total);
    valuationDraft.inWords = convertToWords(valuationDraft.totalMaxPrice);
  }
});
const isEditingAsset = ref(false);

/* Reset form */
function resetValuationDraft() {
  Object.assign(valuationDraft, {
    valuationId: null,
    ownerFullName: "",
    ownerPhone: "",
    ownerEmail: "",
    desire: "",
    landAssetId: null,
    address: "",
    effectiveDate: today(),
    expiryDate: plusDays(today(), 30),
    valuationRound: 1,
    planning: "",
    landClassification: "",
    totalMaxPrice: 0,
    totalPrice: 0,
    inWords: "",
    valuationLandTypes: [],
  });

  // ❌ KHÔNG XOÁ selectedAsset
  // selectedAsset.value = null     ← GỠ BỎ

  pdfPreviewUrl.value = "";
  pdfPreviewName.value = "";

  manualInWordsEdit.value = false;
}


/* Start valuation từ asset */
function startValuation(asset, report = null) {
  const oldSRQ = selectedAsset.value?.serviceRQID;
  selectedAsset.value = asset;
  resetValuationDraft();

  valuationDraft.landAssetId = asset.id;
  valuationDraft.ownerFullName = asset.ownerFullName || "";
  valuationDraft.valuationRound = (asset.valuationRound || 0) + 1;

  if (report) {
    // Copy từ báo cáo cũ
    valuationDraft.valuationId = report.valuationId;
    valuationDraft.effectiveDate = report.effectiveDate;
    valuationDraft.expiryDate = report.expiryDate;
    valuationDraft.planning = report.planning || "";
    valuationDraft.landClassification = report.landClassification || "";
    valuationDraft.valuationLandTypes = report.valuationLandTypes.map(t => ({
      _key: cryptoKey(),
      landType: t.landType,
      customLandType: "",
      area: t.area,
      areaFormatted: formatNumberWithSeparator(t.area),
      unitPrice: t.unitPrice,
      unitPriceFormatted: formatNumberWithSeparator(t.unitPrice),
      priceValue: t.priceValue
    }));
  }

  activeTab.value = "valuation";
}

/* ---------------------- Xuất PDF (cải tiến) ---------------------- */
const pdfPreviewUrl = ref("");
const pdfPreviewName = ref("");
function clearPdfPreview() {
  if (pdfPreviewUrl.value && pdfPreviewUrl.value.startsWith("blob:")) URL.revokeObjectURL(pdfPreviewUrl.value);
  pdfPreviewUrl.value = ""; pdfPreviewName.value = "";
}

const valuationErrors = reactive({
  effectiveDate: '',
  valuationLandTypes: '',
  totalMaxPrice: '',
  inWords: '',
  landClassification: '',
  planning: ''
});


function validateValuationDraft() {
  Object.keys(valuationErrors).forEach(k => valuationErrors[k] = "");
  let valid = true;

  if (!valuationDraft.effectiveDate) {
    valuationErrors.effectiveDate = "Chọn ngày hiệu lực.";
    valid = false;
  }

  if (!valuationDraft.landClassification) {
    valuationErrors.landClassification = "Vui lòng nhập phân loại đất tổng thể.";
    valid = false;
  }

  if (!valuationDraft.planning) {
    valuationErrors.planning = "Vui lòng nhập thông tin quy hoạch.";
    valid = false;
  }

  if (!valuationDraft.valuationLandTypes.length) {
    valuationErrors.valuationLandTypes = "Thêm ít nhất 1 loại đất để định giá.";
    valid = false;
  }

  if (!valuationDraft.totalMaxPrice || valuationDraft.totalMaxPrice <= 0) {
    valuationErrors.totalMaxPrice = "Làm tròn cao nhất phải lớn hơn 0.";
    valid = false;
  }

  if (!valuationDraft.inWords) {
    valuationErrors.inWords = "Vui lòng nhập bằng chữ.";
    valid = false;
  }


  return valid;
}


async function saveValuation() {
  const isEditing = valuationDraft.valuationId != null;   // true nếu đang chỉnh sửa

  const a = currentAsset.value;
  if (!a) {
    updateAlertError("❌ Chưa chọn tài sản để định giá!");
    return;
  }

  if (!validateValuationDraft()) {
    return;
  }

  try {
    // ====== 1️⃣ Chuẩn bị report ======
    const report = {
      valuationId: valuationDraft.valuationId,
      effectiveDate: valuationDraft.effectiveDate,
      expiryDate: valuationDraft.expiryDate,
      valuationRound: valuationDraft.valuationRound,
      planning: valuationDraft.planning,
      landClassification: valuationDraft.landClassification,
      totalPrice: typesTotal.value,
      totalMaxPrice: valuationDraft.totalMaxPrice,
      inWords: valuationDraft.inWords,
      valuationLandTypes: valuationDraft.valuationLandTypes.map((r, i) => ({
        landTypeId: Date.now() + i,
        landType: r.landType,
        area: r.area,
        unitPrice: r.unitPrice,
        priceValue: r.priceValue
      }))
    };

    // ====== 2️⃣ Chuẩn bị asset ======
    const asset = {
      id: a.id,
      desire: a.desire,
      address: a.address,
      oldAddress: a.oldAddress,
      plotNumber: a.plotNumber,
      parcelNumber: a.parcelNumber,
      totalArea: a.totalArea,
      ownerFullName: a.ownerFullName,
      ownerPhone: a.ownerPhone,
      ownerEmail: a.ownerEmail,
      ownershipRelation: a.ownershipRelation,
      landUseRight: a.landUseRight,
      landPosition: a.landPosition,
      status: "Đã định giá sơ bộ",
      valuationRound: report.valuationRound,
      assignedDate: a.assignedDate || new Date().toISOString(),
      fileTables: a.fileTables || [],
      floorArea: a.floorArea,
      structure: a.structure,
      serviceRQID: a.serviceRQID
    };

    // ====== 3️⃣ Gộp JSON ======
    const payload = {
      landAsset: asset,
      valuationReport: report
    };

    // ====== 4️⃣ Build lại PDF (cả tạo & chỉnh sửa) ======
    let pdfBytes = await generateValuationPDF(a, report);

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfFile = new File(
        [blob],
        `THG_DinhGia_${report.valuationRound}_${a.id}.pdf`,
        { type: "application/pdf" }
    );

    // ====== 5️⃣ FormData ======
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));

    // ảnh mới
    (a.newFiles || []).forEach(f => formData.append("files", f));

    // PDF luôn được gửi (kể cả chỉnh sửa)
    formData.append("pdfFile", pdfFile);

    // Nếu chỉnh sửa → đính kèm valuationId
    if (isEditing) {
      formData.append("valuationId", valuationDraft.valuationId);
    }

    // ====== 6️⃣ Chọn URL theo chế độ ======
    const url = isEditing
        ? "/admin.thg/land-assets/valuation-reports/update"
        : "/admin.thg/land-assets/valuation-reports";

    // ====== 7️⃣ Gửi API ======
    await showLoading(
        api.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
    );

    // ====== 8️⃣ Làm mới UI ======
    updateAlertSuccess(
        isEditing
            ? "✅ Đã cập nhật báo cáo định giá!"
            : "✅ Đã tạo báo cáo định giá mới!"
    );

    await loadAssets(assetsData.page.number, assetsData.page.size);
    await loadRequests();
    await viewAssetDetail(asset);
    resetValuationDraft();
  } catch (err) {
    console.error("⚠️ Lỗi khi lưu định giá:", err);
    updateAlertError(err.response?.data || "Lỗi khi lưu định giá");
  }
}


async function handleReturnResult(report) {
  try {
    console.log("📤 Trả kết quả định giá:", report);

    // 1) Gọi API trả kết quả
    const res = await showLoading(api.get(
        `/admin.thg/land-assets/good-report/${report.valuationId}`
    ));

    updateAlertSuccess("Đã trả kết quả định giá!");

    // 2) Load lại chi tiết tài sản sau khi trả kết quả
    if (selectedAsset.value) {
      await viewAssetDetail({ id: selectedAsset.value.id });
    }

    // 3) Mở tab Chi tiết
    activeTab.value = "detail";

  } catch (err) {
    console.error("❌ Lỗi khi trả kết quả:", err);
    updateAlertError(err.response?.data || "Lỗi trả kết quả");
  }
}


function handleEditReport(report) {
  console.log("✏️ Chỉnh sửa báo cáo định giá:", report);

  // ❗ Reset nhưng KHÔNG đụng selectedAsset
  resetValuationDraft();

  const asset = selectedAsset.value;
  if (!asset) {
    console.error("❌ Không có selectedAsset — không thể chỉnh sửa.");
    return;
  }

  // ===== GÁN THÔNG TIN KHÁCH =====
  valuationDraft.landAssetId = asset.id;
  valuationDraft.ownerFullName = asset.ownerFullName;
  valuationDraft.ownerPhone = asset.ownerPhone;
  valuationDraft.ownerEmail = asset.ownerEmail;
  valuationDraft.desire = asset.desire;
  valuationDraft.address = asset.address;

  // ===== GÁN REPORT =====
  valuationDraft.valuationId = report.valuationId;
  valuationDraft.effectiveDate = report.effectiveDate;
  valuationDraft.expiryDate = report.expiryDate;
  valuationDraft.valuationRound = report.valuationRound;
  valuationDraft.landClassification = report.landClassification;
  valuationDraft.planning = report.planning;
  valuationDraft.totalMaxPrice = report.totalMaxPrice;
  valuationDraft.inWords = report.inWords;

  // ===== BẢNG LOẠI ĐẤT =====
  valuationDraft.valuationLandTypes = report.valuationLandTypes.map(t => ({
    _key: cryptoKey(),
    landType: t.landType,
    isCustom: false,
    area: t.area,
    areaFormatted: String(t.area),
    unitPrice: t.unitPrice,
    unitPriceFormatted: String(t.unitPrice),
    priceValue: t.priceValue
  }));

  // MỞ TAB
  activeTab.value = "valuation";
  showSuccess("Đang chỉnh sửa báo cáo lần " + report.valuationRound);
}

/* Vẽ PDF theo mẫu với cải tiến */
async function generateValuationPDF(asset, report) {
  console.log("Dữ liệu: ",  asset);
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  const [regBytes, boldBytes, logoBytes] = await Promise.all([
    fetch(fontRegular).then(r => r.arrayBuffer()),
    fetch(fontBold).then(r => r.arrayBuffer()),
    fetch(logoImg).then(r => r.arrayBuffer())
  ]);

  const fR = await pdf.embedFont(regBytes);
  const fB = await pdf.embedFont(boldBytes);
  const logo = await pdf.embedPng(logoBytes);

  const page = pdf.addPage([595, 842]); // A4
  const { height, width } = page.getSize();
  const toY = (t) => height - t;
  const lineColor = rgb(0.55, 0.55, 0.55); // màu line thống nhất, xám trung tính

  // ==== HEADER ====
  const logoW = 65, logoH = 65;
  const logoX = 45, logoY = height - 95;
  page.drawImage(logo, { x: logoX, y: logoY, width: logoW, height: logoH });

  const textStartX = logoX + logoW + 15;
  page.drawText("BẢNG BÁO CÁO KẾT QUẢ ĐỊNH GIÁ SƠ BỘ", {
    x: textStartX, y: height - 55, font: fB, size: 15
  });
  page.drawText("CÔNG TY CỔ PHẦN ĐẦU TƯ BĐS THIÊN HÀ GROUP", {
    x: textStartX, y: height - 75, font: fB, size: 11
  });
  page.drawText("Địa chỉ: 14 đường 15 KDC Vạn Phúc, P.Hiệp Bình Phước, TP.Thủ Đức, TP.HCM", {
    x: textStartX, y: height - 95, font: fR, size: 8
  });
  page.drawText("Chi nhánh: 01 Hoa Lài, P.7, Q.Phú Nhuận, TP.HCM", {
    x: textStartX, y: height - 107, font: fR, size: 8
  });

  drawHLine(page, 30, width - 30, height - 120, 0.6, lineColor);

  // ==== THÔNG TIN KHÁCH HÀNG ====
  let curY = 135;
  page.drawText("THÔNG TIN KHÁCH HÀNG", { x: 30, y: toY(curY), font: fB, size: 11 });
  curY += 16;
  drawLabelValue(page, "Tên khách hàng:", asset.ownerOfLand.fullName || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Số điện thoại:", asset.ownerOfLand.phone || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Địa chỉ:",  formatAddress(asset.ownerOfLand.address)|| "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Email:", asset.ownerOfLand.email || "", 40, curY, fB, fR);

  curY += 20;
  drawHLine(page, 30, width - 30, toY(curY), 0.5, lineColor);

  // ==== THÔNG TIN TÀI SẢN ====
  curY += 15;
  page.drawText("THÔNG TIN TÀI SẢN", { x: 30, y: toY(curY), font: fB, size: 11 });
  curY += 16;
  drawLabelValue(page, "Địa chỉ tài sản:", formatAddress(asset.address) || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Địa chỉ cũ:", asset.oldAddress || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Số tờ:", asset.plotNumber || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Số thửa:", asset.parcelNumber || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Diện tích tổng:", `${numberFormat(asset.totalArea)} m²`, 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Diền tích sàn:", asset.floorArea || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Kết cấu nhà / đất:", asset.structure || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Sở hữu tài sản:", asset.ownershipRelation || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Quyền sử dụng tài sản:", asset.landUseRight || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Vị trí:", asset.landPosition || "", 40, curY, fB, fR);

  curY += 20;
  drawHLine(page, 30, width - 30, toY(curY), 0.5, lineColor);

  // ==== KẾT QUẢ ĐỊNH GIÁ ====
  curY += 15;
  page.drawText("KẾT QUẢ ĐỊNH GIÁ", { x: 30, y: toY(curY), font: fB, size: 11 });
  curY += 16;
  drawLabelValue(page, "Ngày hiệu lực:", formatDate(report.effectiveDate), 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Lần định giá:", String(report.valuationRound || ""), 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Quy hoạch:", report.planning || "", 40, curY, fB, fR);
  curY += 14;
  drawLabelValue(page, "Phân loại:", report.landClassification || "", 40, curY, fB, fR);

  // ==== BẢNG LOẠI ĐẤT ====
  curY += 25;
  const totalWidth = 530; // mở rộng bảng
  const startX = (width - totalWidth) / 2;
  const colW = [150, 100, 130, 150];
  const colX = [startX, startX + colW[0], startX + colW[0] + colW[1], startX + colW[0] + colW[1] + colW[2]];
  const rowH = 20;

  // Header không tô màu, chỉ line
  drawTableRow(page, toY(curY), rowH, colX, colW, fB,
      ["Loại đất", "Diện tích (m²)", "Đơn giá (VNĐ/m²)", "Giá (VNĐ)"],
      10, true, [0, 0, 0]
  );

  let dataY = curY + rowH;
  report.valuationLandTypes.forEach((r) => {
    drawTableRow(page, toY(dataY), rowH, colX, colW, fR,
        [
          r.landType || "",
          numberFormat(r.area),
          numberFormat(r.unitPrice),
          numberFormat(r.priceValue)
        ],
        9, false, [0.3, 0.3, 0.3]
    );
    dataY += rowH;
  });

  // Tổng giá
  drawTableRow(page, toY(dataY), rowH, colX, colW, fB,
      ["TỔNG GIÁ (VNĐ)", "", "", numberFormat(report.totalPrice)],
      10, false, [0, 0, 0]
  );

  // ==== Tổng giá trị cao nhất ====
  dataY += 30;
  drawHLine(page, 30, width - 30, toY(dataY), 0.5, lineColor);
  dataY += 18;

  page.drawText(
      `Tổng giá trị cao nhất (Làm tròn): ${numberFormat(report.totalMaxPrice)} VNĐ`,
      { x: 40, y: toY(dataY), font: fB, size: 11 }
  );

  dataY += 20;

  page.drawText(
      `Bằng chữ: ${report.inWords || ""}`,
      { x: 40, y: toY(dataY), font: fB, size: 11 }
  );

  // ==== GHI CHÚ VÀ LINK HỆ THỐNG ====
  dataY += 50; // cách một chút với phần trên
  const noteText =
      "Lưu ý: Đây là kết quả đánh giá sơ bộ theo khu vực, chưa phải bản chính thức giá bán thành công. " +
      "Để bán nhanh trong 30 ngày cần khảo sát thực tế và định giá chuẩn xác nhất. " +
      "Giá có thể tăng hoặc giảm tùy vị trí thực tế.";

  // Ghi chú (màu xám nhẹ)
  const noteSize = 9;
  const noteColor = rgb(0.35, 0.35, 0.35);
  const wrappedNote = splitTextIntoLines(noteText, 90); // chia dòng cho vừa A4
  let noteY = dataY;

  wrappedNote.forEach(line => {
    page.drawText(line, {
      x: 40,
      y: toY(noteY),
      size: noteSize,
      font: fR,
      color: noteColor,
    });
    noteY += noteSize + 2;
  });

  // Thêm link dẫn ngược về hệ thống
  noteY += 12;
  const linkColor = rgb(0.1, 0.1, 0.1); // gần đen
  const link1 = "https://thienhagroup.vn";    // đường dẫn thật bạn có thể thay
  const link2 = "https://thienhagroup.vngiai-phap-ban-nhanh";    // đường dẫn thật bạn có thể thay

  page.drawText("Khảo sát thực tế - ", { x: 40, y: toY(noteY), font: fB, size: 10, color: linkColor });
  const link1X = 40 + fB.widthOfTextAtSize("Khảo sát thực tế - ", 10);
  page.drawText(link1, { x: link1X, y: toY(noteY), font: fR, size: 10, color: rgb(0, 0, 1) }); // màu xanh

  noteY += 14;
  page.drawText("Bán nhanh 30 ngày - ", { x: 40, y: toY(noteY), font: fB, size: 10, color: linkColor });
  const link2X = 40 + fB.widthOfTextAtSize("Bán nhanh 30 ngày - ", 10);
  page.drawText(link2, { x: link2X, y: toY(noteY), font: fR, size: 10, color: rgb(0, 0, 1) });

  return await pdf.save();
}

function splitTextIntoLines(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length > maxChars) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
    } else {
      currentLine += word + " ";
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

/* ---------------------- Helpers vẽ PDF ---------------------- */
function drawHLine(page, x1, x2, y, thickness = 0.5, color = rgb(0, 0, 0)) {
  page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color });
}

function drawLabelValue(page, label, value, x, top, fLabel, fVal, sLabel = 9, sVal = 9) {
  const y = page.getSize().height - top;

  // luôn ép kiểu về chuỗi để tránh lỗi
  const labelText = String(label ?? "");
  const valueText = String(value ?? "");

  page.drawText(labelText, { x, y, font: fLabel, size: sLabel });
  page.drawText(valueText, { x: x + 100, y, font: fVal, size: sVal });
}

function drawTableRow(page, y, h, colX, colW, font, texts, size = 9, header = false, color = [0, 0, 0], boldLast = false) {
  const textColor = rgb(...color);
  const borderColor = rgb(0.7, 0.7, 0.7); // Viền bảng màu xám nhạt

  // Vẽ đường viền bảng
  const left = colX[0] - 5;
  const right = left + colW.reduce((a, b) => a + b, 0) + 10;
  page.drawRectangle({
    x: left,
    y: y - h,
    width: right - left,
    height: h,
    borderWidth: 0.3, // Viền mỏng hơn
    borderColor: borderColor
  });

  // Vẽ đường kẻ cột
  for (let i = 1; i < colX.length; i++) {
    const x = colX[i] - 5;
    page.drawLine({
      start: { x, y: y - h },
      end: { x, y },
      thickness: 0.3, // Viền mỏng hơn
      color: borderColor
    });
  }

  // Vẽ text
  texts.forEach((t, i) => {
    const isLast = i === texts.length - 1;
    const textFont = (boldLast && isLast) ? font : font;
    const textSize = header ? size + 1 : size;

    page.drawText(String(t || ""), {
      x: colX[i],
      y: y - h + 6,
      font: textFont,
      size: textSize,
      color: textColor
    });
  });
}

function drawTwoCol(page, leftText, rightText, x, top, fL, fR) {
  const y = page.getSize().height - top;
  page.drawText(leftText, { x, y, font: fL, size: 9 });
  page.drawText(rightText || "", { x: 300, y, font: fR, size: 9 });
}

/* ---------------------- Utils ---------------------- */
function numberFormat(n) {
  if (n === null || n === undefined || n === "") return "0";
  const num = Number(n);
  if (Number.isNaN(num)) return String(n);
  return num.toLocaleString("vi-VN");
}

function formatStatus(status) {
  switch (status) {
    case "NEW":
      return {
        text: "Chưa xử lý",
        class: "status-badge badge-new"
      };

    case "INPROGRESS":
      return {
        text: "Đang thực hiện",
        class: "status-badge badge-inprogress"
      };

    default:
      return {
        text: status,
        class: "status-badge badge-default"
      };
  }
}



function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("vi-VN");
}

function formatDateTime(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleString("vi-VN");
}

// Thêm hàm format thời gian tương đối
function formatTimeAgo(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return "1 ngày trước";
  if (diffDays < 7) return `${diffDays} ngày trước`;

  // Nếu quá 7 ngày thì hiển thị ngày tháng cụ thể
  return formatDateTime(dateString);
}

function today() { return new Date().toISOString().slice(0, 10); }

function plusDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
function cryptoKey() { return "k-" + Math.random().toString(36).slice(2, 10); }

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

const roundMillion = (n) => Math.round((n || 0) / 1000000) * 1000000;

/* Đọc số Việt Nam */
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


function formatAddress(address) {
  if (!address) return "";
  return address.replace(/\s*\/!!\s*/g, ", ");
}

import {socketService} from "../../services/socketService.js";
import { SOCKET_CONFIG } from "../../config/socketConfig.js";
/* ---------------------- Lifecycle ---------------------- */
onMounted(() => {
  // 🔌 Kết nối socket
  loadAssets(1);
  loadRequests();

  const token = () => authStore.accessToken;
  socketService.connect(token);
  const employeeId = authStore.userInfo?.id;
  // 🏡 Lắng nghe sự kiện "Yêu cầu định giá mới"
  socketService.subscribe(SOCKET_CONFIG.valuationRequestTopic(employeeId), (event) => {
    if (event?.payload) {
      console.log("📨 Có yêu cầu định giá mới:", event.payload);
      // ✅ Tải lại danh sách yêu cầu mới nhất
      loadRequests();
    }
  });


});
function formatReportStatus(status) {
  if (!status) {
    return {
      text: "Chưa có trạng thái",
      class: "badge badge-subtle bg-secondary text-dark"
    };
  }

  switch (status.toUpperCase()) {
    case "INREVIEW":
      return {
        text: "Chưa trả kết quả",
        class: "badge badge-subtle bg-warning text-dark"
      };

    case "DONE":
      return {
        text: "Đã trả kết quả",
        class: "badge badge-subtle bg-success"
      };

    case "DONEEND":
      return {
        text: "Khách đã xem kết quả",
        class: "badge badge-info-subtle"
      };

    default:
      return {
        text: status,
        class: "badge bg-light text-dark"
      };
  }
}

import { confirmYesNo } from "../../assets/js/alertService.js";

async function deleteRequest(request) {
  if (!request?.serviceRQID) return;

  await confirmYesNo(
      "Xóa yêu cầu định giá?",
      `Bạn có chắc muốn xóa yêu cầu của <b>${request.ownerFullName}</b>?<br>
     <span class="text-danger">Hành động này không thể hoàn tác!</span>`,
      async () => {
        try {
          console.log("🗑️ Đang xoá yêu cầu:", request);

          await api.delete(`/admin.thg/land-assets/valuation/delete/${request.serviceRQID}`);

          await loadRequests();

          showSuccess("Đã xoá yêu cầu định giá!");
        } catch (err) {
          console.error("❌ Lỗi xoá yêu cầu:", err);
          showError("Không thể xóa yêu cầu", err.response?.data || "");
        }
      }
  );
}

</script>

<style scoped>
/* CSS giữ nguyên như file gốc */
.valuation-tabs .nav-link { cursor: pointer; }

.card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
}

.info-block {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #edf1f7;
}

.asset-brief {
  border: 1px dashed #d9e3f0;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fbfdff;
}
.asset-brief .brief-line { font-size: 13.5px; margin-bottom: 4px; }
.asset-brief .brief-line span { color: #0b5ed7; font-weight: 600; }

.label-strong { font-weight: 600; color: #0b5ed7; }
.label-muted { font-weight: 600; color: #6b7280; }
.better-input {
  background: #ffffff;
  border: 1px solid #d0d7e2;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.03);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
}
.better-input:focus {
  border-color: #0b74ff;
  outline: 0;
  box-shadow: 0 0 0 0.15rem rgba(11,116,255,.15);
}

.table thead th { font-weight: 600; background-color: #f8f9fa; }
.table td, .table th { vertical-align: middle !important; font-size: 13.5px; padding: 8px 12px; }
.table-bordered > :not(caption) > * { border-width: 1px; }

.form-control {
  min-height: 38px;
}

.form-control-sm {
  min-height: 32px;
  padding: 4px 8px;
}

.valuation-history {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
}

.history-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: #f8fafc;
  border: none;
  text-align: left;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.history-toggle:hover {
  background: #e2e8f0;
}

.history-toggle-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-toggle-title {
  font-size: 0.95rem;
}

.history-toggle-price {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
}

.history-toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #e2e8f0;
  color: #475569;
  transition: transform 0.2s ease, background 0.2s ease;
}

.history-toggle-icon.is-open {
  transform: rotate(180deg);
  background: #cbd5f5;
}

.history-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;
}

.history-panel.is-open {
  max-height: 2000px;
}

.history-panel-inner {
  padding: 16px;
}

.info-compact {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.info-compact:last-child {
  border-bottom: none;
}

.info-compact .text-muted {
  min-width: 140px;
  font-size: 0.875rem;
}

.info-compact .fw-semibold {
  font-size: 0.9rem;
  color: #333;
}

.better-input {
  border-radius: 6px;
  border: 1px solid #ddd;
  padding: 8px 12px;
  font-size: 14px;
  transition: all 0.2s;
}

.better-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.1);
}

.label-strong {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.card {
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.card-body {
  padding: 1.5rem;
}

/* Tiêu đề section */
h5, h6 {
  color: #2c3e50;
}

h6.fw-bold {
  font-size: 1.1rem;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 0.5rem;
}

/* Khoảng cách cho các trường thông tin */
.small.text-muted {
  margin-bottom: 4px;
  display: block;
}

.fw-semibold {
  display: block;
  margin-bottom: 8px;
}
/* Giảm khoảng trắng giữa nav-tabs và nội dung */
.nav-tabs {
  margin-bottom: 6px !important;
}

.tab-content {
  margin-top: 0 !important;
  padding-top: 10px !important;
}
/* Tab style đẹp */
.valuation-tabs .nav-link {
  color: #555;
  font-weight: 600;
  border: none !important;
  padding: 10px 16px;
  border-radius: 8px 8px 0 0;
  transition: all 0.25s;
}

.valuation-tabs .nav-link:hover {
  background: rgba(13, 110, 253, 0.08);
  color: #0d6efd;
}

.valuation-tabs .nav-link:hover {
  background: rgba(13, 110, 253, 0.08);
  color: #0d6efd;
}

.valuation-tabs .nav-link.active {
  background: #0d6efd !important;
  color: white !important;
  border: none !important;
  padding-top: 7px; /* nhìn cân đối hơn */
  box-shadow: 0 -2px 6px rgba(0,0,0,0.12);
}
.badge-flash {
  animation: flash 1.5s infinite linear;
}

@keyframes flash {
  0% { opacity: 1; }
  50% { opacity: .5; }
  100% { opacity: 1; }
}
/* --- TRẠNG THÁI ĐẸP HƠN CHO TAB 3 --- */
.status-chip {
  display: inline-block;
  padding: 5px 10px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
}

.status-processing {
  background: rgba(255, 193, 7, 0.15);
  color: #d39e00;
}

.status-done {
  background: rgba(25, 135, 84, 0.15);
  color: #198754;
}

.status-reject {
  background: rgba(220, 53, 69, 0.15);
  color: #dc3545;
}

.status-pending {
  background: rgba(108, 117, 125, 0.15);
  color: #6c757d;
}

/* --- CỘT CUỐI RỘNG HƠN & ĐẸP HƠN --- */
.col-actions {
  width: 150px !important;
  text-align: center;
}

/* Nút tác vụ nhỏ gọn */
.action-btn {
  padding: 4px 8px;
  font-size: 12px;
}
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 12px;
  line-height: 1;
}

/* NEW */
.badge-new {
  background: rgba(108, 117, 125, 0.18);
  color: #5c636a;
  border: 1px solid rgba(108, 117, 125, 0.25);
}

/* Đang thực hiện */
.badge-inprogress {
  background: rgba(255, 193, 7, 0.20);
  color: #b88600;
  border: 1px solid rgba(255, 193, 7, 0.35);
}

/* Mặc định */
.badge-default {
  background: rgba(0, 0, 0, 0.08);
  color: #444;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.asset-detail .address-selector,
.asset-detail .dropdown-wrapper {
  width: 100% !important;
  display: block;
}
.valuation-select:hover {
  border-color: #94a3b8;
}

.valuation-select:focus-visible {
  outline: none;
}
.asset-status-row {
  display: flex;
  justify-content: center;   /* ⬅️ căn giữa ngang */
  align-items: center;       /* ⬅️ căn giữa dọc */
  gap: 6px;
  position: relative;
  bottom: -3px;
  white-space: nowrap;
  font-size: 11.5px;
  border-radius: 10px;

  text-overflow: ellipsis;
  overflow: hidden;

  text-align: center; /* không có tác dụng khi dùng flex */
}


.asset-status-pill {
  font-size: 13px !important; /* chữ trạng thái to hơn */
  padding: 4px 10px;          /* kích thước nhỏ gọn */
  border-radius: 12px;
  white-space: nowrap;
  position: relative;
  bottom:-5px;/* không cho xuống dòng */
  max-width: 150px;           /* giới hạn chiều rộng */
  overflow: hidden;
  display: block !important;
  text-align: left !important;
}
.asset-status-inner {
  display: flex;
  align-items: center;
  gap: 6px;
  text-align: left;
  white-space: nowrap;
}
/* Base subtle badge */
.badge-subtle {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 1px solid transparent;
}

/* ĐỎ subtle */
/* Base subtle badge (áp dụng chung) */
.badge-subtle {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 1px solid transparent;   /* sẽ override ở từng màu */
}

/* ĐỎ subtle */
.badge-red-subtle {
  background: rgba(231, 76, 60, 0.15);
  color: #c0392b;
  border: 1px solid rgba(231, 76, 60, 0.35);
  border-radius: 20px;
  padding: 5px 5px;
  font-size: 13px;
}

/* XANH subtle */
.badge-green-subtle {
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border: 1px solid rgba(46, 204, 113, 0.35);
  border-radius: 20px;
  padding: 5px 5px;
  font-size: 13px;
}

/* TÍM subtle */
.badge-purple-subtle {
  background: rgba(155, 89, 182, 0.15);
  color: #8e44ad;
  border: 1px solid rgba(155, 89, 182, 0.35);
  border-radius: 20px;
  padding: 5px 5px;
  font-size: 13px;
}

.badge-info-subtle {
  background: rgba(13, 110, 253, 0.15);
  color: #0d6efd;
  border: 1px solid rgba(13, 110, 253, 0.35);
  border-radius: 20px;
  padding: 5px 5px;
  font-size: 13px;
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
</style>
