<template>
  <div class="container-fluid px-4 py-3" style="margin-top: 60px !important;">
    <div class="d-flex align-items-center justify-content-between">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-2">
            <li class="breadcrumb-item">
              <i class="fas fa-home me-1"></i><a href="/san-pham-cua-ban" class="text-decoration-none"> Quản lý sản phẩm</a>
            </li>
            <li class="breadcrumb-item active">Cập nhật sản phẩm</li>
          </ol>
        </nav>
        <div class="d-flex align-items-center gap-3">
          <div class="icon-circle-admin">
            <i class="fas fa-city fs-4"></i>
          </div>
          <div>
            <h1 class="h3 mb-1 fw-bold text-dark">Cập nhật sản phẩm</h1>
            <p class="text-muted mb-0">Chỉnh sửa thông tin tài sản trong hệ thống</p>
          </div>
        </div>
      </div>
      <div class="d-flex gap-2">
        <button type="button" class="btn btn-outline-secondary d-flex align-items-center gap-2" @click="$router.back()">
          <i class="fas fa-arrow-left"></i><span>Quay lại</span>
        </button>
        <button type="button" class="btn btn-outline-warning d-flex align-items-center gap-2" @click="resetForm">
          <i class="fas fa-redo"></i><span>Đặt lại</span>
        </button>
        <button
          v-if="isLastTab"
          type="button"
          class="btn btn-primary d-flex align-items-center gap-2 px-4"
          :disabled="isSubmitting"
          @click="submitForm"
        >
          <i class="fas fa-save"></i><span>{{ isSubmitting ? 'Đang xử lý...' : 'Lưu thay đổi' }}</span>
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <form @submit.prevent>
          <div class="tab-navigation">
            <ul class="nav nav-tabs flex-wrap">
              <li v-for="tab in tabs" :key="tab.id" class="nav-item">
                <button
                  type="button"
                  class="nav-link"
                  :class="{
                    active: activeTab === tab.id,
                    completed: isTabCompleted(tab.id),
                    pending: isTabPending(tab.id),
                  }"
                  @click="setActiveTab(tab.id)"
                >
                  <i :class="tab.icon" class="me-2"></i>{{ tab.label }}
                </button>
              </li>
            </ul>
          </div>

          <div v-show="activeTab === 'basic'" class="tab-panel">
            <section class="mb-5">
              <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                <div class="section-icon bg-primary-light">
                  <i class="fas fa-info-circle text-primary"></i>
                </div>
                <div>
                  <h2 class="h5 fw-bold mb-1">Thông tin cơ bản</h2>
                  <p class="text-muted small mb-0">Thông tin chính xác định tài sản</p>
                </div>
              </div>
              <div class="row g-4">
                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-building text-primary"></i>
                    <span>Loại sản phẩm  <span class="text-danger">*</span></span>
                  </label>
                  <select class="form-select form-select-md" v-model="form.loaiTaiSan">
                    <option value="">-- Chọn sản phẩm --</option>
                    <option value="NHA">Nhà</option>
                    <option value="DAT">Đất</option>
                    <option value="DATLON">Đất lớn</option>
                  </select>
                  <small v-if="errors.loaiTaiSan" class="text-danger">{{ errors.loaiTaiSan }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-tag text-success"></i>
                    <span>Giá bán  <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <span class="input-group-text bg-light"><i class="fas fa-money-bill-wave"></i></span>
                    <input type="number" min="0" step="1000000" class="form-control" v-model.number="form.giaBan" placeholder="Nhập giá bán">
                    <span class="input-group-text bg-light">VNĐ</span>
                  </div>
                  <div class="d-flex align-items-center justify-content-between mt-1">
                    <small v-if="errors.giaBan" class="text-danger">{{ errors.giaBan }}</small>
                    <small v-if="form.giaBan" class="text-success fw-medium">
                      <i class="fas fa-coins me-1"></i>{{ formatMoneyVN(form.giaBan) }}
                    </small>
                  </div>
                </div>

                <div class="col-md-2">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-tags text-warning"></i>
                    <span>Phân loại hàng  <span class="text-danger">*</span></span>
                  </label>
                  <select class="form-select form-select-md" v-model="form.phanLoaiHang">
                    <option value="">-- Chọn phân loại --</option>
                    <option value="HOPTAC">Hợp tác</option>
                    <option value="HTT">Hàng thị trường</option>
                  </select>
                  <small v-if="errors.phanLoaiHang" class="text-danger">{{ errors.phanLoaiHang }}</small>
                </div>

                <div class="col-md-2">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-university text-info"></i>
                    <span>Đơn vị sở hữu  <span class="text-danger">*</span></span>
                  </label>
                  <select class="form-select form-select-md" v-model="form.donViSoHuu">
                    <option value="">-- Chọn đơn vị --</option>
                    <option value="THG">THG</option>
                    <option value="DT">Đối tác</option>
                  </select>
                  <small v-if="errors.donViSoHuu" class="text-danger">{{ errors.donViSoHuu }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-building text-info"></i>
                    <span>Giá nội bộ  <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <span class="input-group-text bg-light"><i class="fas fa-eye"></i></span>
                    <input type="number" min="0" step="1000000" class="form-control" v-model.number="form.giaNoiBo" placeholder="Giá nội bộ">
                    <span class="input-group-text bg-light">VNĐ</span>
                  </div>
                  <div class="d-flex align-items-center justify-content-between mt-1">
                    <small v-if="errors.giaNoiBo" class="text-danger">{{ errors.giaNoiBo }}</small>
                    <small v-if="form.giaNoiBo" class="text-info fw-medium">
                      <i class="fas fa-chart-line me-1"></i>{{ formatMoneyVN(form.giaNoiBo) }}
                    </small>
                  </div>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-bullseye text-danger"></i>
                    <span>Mong muốn <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <span class="input-group-text"><i class="fas fa-chart-line"></i></span>
                    <input type="number" min="0" step="1000000" class="form-control" v-model.number="form.desire" placeholder="Gía mong muốn của chủ sở hữu">
                    <span class="input-group-text bg-light">VNĐ</span>
                  </div>
                  <div class="d-flex align-items-center justify-content-between mt-1">
                    <small v-if="errors.desire" class="text-danger">{{ errors.desire }}</small>
                    <small v-if="form.desire" class="text-info fw-medium">
                      <i class="fas fa-chart-line me-1"></i>{{ formatMoneyVN(form.desire) }}
                    </small>
                  </div>
                </div>

                <div class="col-md-2">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-percentage text-warning"></i>
                    <span>Phí môi giới (%) <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <input list="phiMoiGiois" type="number" min="0" max="100" step="0.1" class="form-control"
                           v-model.number="form.phiMoiGioi" placeholder="Hoa hồng cho môi giới">
                    <datalist id="phiMoiGiois">
                      <option value="1"></option>
                      <option value="1.5"></option>
                      <option value="2"></option>
                      <option value="2.5"></option>
                    </datalist>
                    <span class="input-group-text"><i class="fas fa-handshake"></i></span>
                  </div>
                  <small v-if="errors.phiMoiGioi" class="text-danger">{{ errors.phiMoiGioi }}</small>
                </div>

              </div>
            </section>
          </div>

          <div v-show="activeTab === 'address'" class="tab-panel">
            <section class="mb-5">
              <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                <div class="section-icon bg-success-light">
                  <i class="fas fa-map-marked-alt text-success"></i>
                </div>
                <div>
                  <h2 class="h5 fw-bold mb-1">Địa chỉ &amp; vị trí</h2>
                  <p class="text-muted small mb-0">Chi tiết nơi tọa lạc của tài sản</p>
                </div>
              </div>
              <div class="row g-4">
                <Address5 :key="addressKey" v-model="form.address"></Address5>
                <small v-if="errors.address" class="text-danger">
                  {{ errors.address }}
                </small>
                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-map-pin text-primary"></i>
                    <span>Vị trí đất <span class="text-danger">*</span></span>
                  </label>

                  <input
                      list="landPositions"
                      type="text"
                      class="form-control "
                      v-model.trim="form.landPosition"
                      placeholder="Mô tả vị trí tài sản( vd: hẻm, gần sông..v.v...)"
                  >

                  <datalist id="landPositions">
                    <option value="Mặt tiền đường chính"></option>
                    <option value="Mặt tiền quốc lộ"></option>
                    <option value="Mặt tiền tỉnh lộ"></option>
                    <option value="Mặt tiền hẻm"></option>
                    <option value="Hẻm xe hơi"></option>
                    <option value="Hẻm xe ba gác"></option>
                    <option value="Hẻm lớn"></option>
                    <option value="Hẻm nhỏ"></option>
                    <option value="Gần chợ"></option>
                    <option value="Gần trường học"></option>
                  </datalist>
                  <small v-if="errors.landPosition" class="text-danger">{{ errors.landPosition }}</small>
                </div>

                <div class="col-md-16">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-map-signs text-success"></i>
                    <span>Địa chỉ cũ</span>
                  </label>
                  <input type="text" class="form-control" v-model.trim="form.oldAddress" placeholder="Địa chỉ trước đây (nếu có)">
                </div>
              </div>
            </section>
          </div>

          <div v-show="activeTab === 'legal'" class="tab-panel">
            <section class="mb-5">
              <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                <div class="section-icon bg-warning-light">
                  <i class="fas fa-balance-scale text-warning"></i>
                </div>
                <div>
                  <h2 class="h5 fw-bold mb-1">Thông tin pháp lý &amp; diện tích</h2>
                  <p class="text-muted small mb-0">Các thông tin mô tả đặc điểm và pháp lý của tài sản</p>
                </div>
              </div>

              <div class="row g-4">
                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-hashtag text-primary"></i>
                    <span>Số thửa <span class="text-danger">*</span></span>
                  </label>
                  <input type="text" class="form-control" v-model.trim="form.plotNumber" placeholder="Số thửa">
                  <small v-if="errors.plotNumber" class="text-danger">{{ errors.plotNumber }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-file-alt text-info"></i>
                    <span>Số tờ <span class="text-danger">*</span></span>
                  </label>
                  <input type="text" class="form-control" v-model.trim="form.parcelNumber" placeholder="Số tờ">
                  <small v-if="errors.parcelNumber" class="text-danger">{{ errors.parcelNumber }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-expand-alt text-success"></i>
                    <span>Tổng diện tích (m²) <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.totalArea" placeholder="Tổng diện tích tài sản">
                    <span class="input-group-text"><i class="fas fa-ruler-combined"></i></span>
                  </div>
                  <small v-if="errors.totalArea" class="text-danger">{{ errors.totalArea }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-handshake text-warning"></i>
                    <span>Quan hệ sở hữu <span class="text-danger">*</span></span>
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="form.ownershipRelation"
                    list="ownershipRelations"
                    placeholder="Quan hệ với chủ sở hữu"
                  >

                  <datalist id="ownershipRelations">
                    <option value="Chính chủ"></option>
                    <option value="Người thân"></option>
                    <option value="Uỷ quyền"></option>
                    <option value="Đồng sở hữu"></option>
                    <option value="Môi giới đại diện"></option>
                  </datalist>
                  <small v-if="errors.ownershipRelation" class="text-danger">{{ errors.ownershipRelation }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-gavel text-danger"></i>
                    <span>Quyền sử dụng  <span class="text-danger">*</span></span>
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="form.landUseRight"
                    list="landUseRights"
                    placeholder="Quyền sử dụng đất"
                  >

                  <datalist id="landUseRights">
                    <option value="Sổ đỏ"></option>
                    <option value="Sổ hồng"></option>
                    <option value="Đất thổ cư"></option>
                    <option value="Đất nông nghiệp"></option>
                    <option value="Giấy tờ viết tay"></option>
                  </datalist>
                  <small v-if="errors.landUseRight" class="text-danger">{{ errors.landUseRight }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-clipboard-check text-info"></i>
                    <span>Trạng thái <span class="text-danger">*</span></span>
                  </label>
                  <select class="form-select form-select-md" v-model="form.status">
                    <option value="">-- Chọn tình trạng --</option>
                    <option value="Chưa định giá">Mới</option>
                    <option value="Bán giải pháp">Bán giải pháp</option>
                    <option value="Bán nhanh 30 ngày">Bán nhanh 30 ngày</option>
                    <option value="Đã bán">Đã bán</option>
                  </select>
                  <small v-if="errors.status" class="text-danger">{{ errors.status }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-vector-square text-success"></i>
                    <span>Mặt tiền (m) <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <input type="number" min="0" class="form-control" step="0.01" v-model.number="form.matTienNha"
                           placeholder="Mặt tiền tổng tài sản">
                    <span class="input-group-text"><i class="fas fa-home"></i></span>
                  </div>
                  <small v-if="errors.matTienNha" class="text-danger">{{ errors.matTienNha }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-arrows-alt-h text-primary"></i>
                    <span>Chiều ngang (m) <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.chieuNgang"
                           placeholder="Tổng chiều ngang tài sản">
                    <span class="input-group-text"><i class="fas fa-ruler-horizontal"></i></span>
                  </div>
                  <small v-if="errors.chieuNgang" class="text-danger">{{ errors.chieuNgang }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-arrows-alt-v text-success"></i>
                    <span>Chiều dài (m) <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.chieuDai"
                           placeholder="Tổng chiều dài sản phẩm">
                    <span class="input-group-text"><i class="fas fa-ruler-vertical"></i></span>
                  </div>
                  <small v-if="errors.chieuDai" class="text-danger">{{ errors.chieuDai }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-search text-info"></i>
                    <span>Hiện trạng đất <span class="text-danger">*</span></span>
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="form.hienTrangDat"
                    list="hienTrangDatList"
                    placeholder="Hiện trạng"
                  >

                  <datalist id="hienTrangDatList">
                    <option value="Đất trống"></option>
                    <option value="Có nhà"></option>
                    <option value="Đã lên thổ cư"></option>
                    <option value="Đang cho thuê"></option>
                    <option value="Đang tranh chấp"></option>
                  </datalist>
                  <small v-if="errors.hienTrangDat" class="text-danger">{{ errors.hienTrangDat }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-arrows-alt-h text-success"></i>
                    <span>Độ rộng đường (m) <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.doRongDuong"
                           placeholder="Độ rồng đường vào tài sản">
                    <span class="input-group-text"><i class="fas fa-road"></i></span>
                  </div>
                  <small v-if="errors.doRongDuong" class="text-danger">{{ errors.doRongDuong }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-ruler-horizontal text-primary"></i>
                    <span>Lộ giới (m) <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.loGioi"
                           placeholder="Lộ giới">
                    <span class="input-group-text"><i class="fas fa-ruler"></i></span>
                  </div>
                  <small v-if="errors.loGioi" class="text-danger">{{ errors.loGioi }}</small>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-archway text-danger"></i>
                    <span>Hình dạng / Kết cấu <span class="text-danger">*</span></span>
                  </label>
                  <textarea class="form-control" v-model.trim="form.structure" rows="2" placeholder="Mô tả kết cấu công trình"></textarea>
                  <small v-if="errors.structure" class="text-danger">{{ errors.structure }}</small>
                </div>
              </div>
            </section>

            <section v-if="isSold" class="mb-5">
              <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                <div class="section-icon bg-success-light">
                  <i class="fas fa-user-check text-success"></i>
                </div>
                <div>
                  <h2 class="h5 fw-bold mb-1">Người bán thành công</h2>
                  <p class="text-muted small mb-0">Thông tin người chốt giao dịch</p>
                </div>
              </div>

              <div class="row g-4">
                <div class="col-md-4">
                  <label class="form-label fw-semibold">
                    Email / Số điện thoại <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-search"></i>
                    </span>
                    <input
                      v-model.trim="form.nguoiBanSearch"
                      @blur="handleNguoiBanLookup"
                      type="text"
                      class="form-control"
                      placeholder="Nhập email hoặc SĐT"
                    />
                  </div>
                  <small v-if="errors.nguoiBanSearch" class="text-danger">
                    {{ errors.nguoiBanSearch }}
                  </small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">
                    Người bán
                  </label>
                  <input
                    type="text"
                    class="form-control bg-light"
                    readonly
                    v-model="form.nguoiBanTen"
                    placeholder="Tự động load"
                  />
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">
                    Giá bán thành công <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <input
                      type="number"
                      min="0"
                      step="1000000"
                      v-model.number="form.giaBanThanhCong"
                      class="form-control"
                      placeholder="Giá chốt"
                    />
                    <span class="input-group-text">VNĐ</span>
                  </div>
                  <small v-if="errors.giaBanThanhCong" class="text-danger">
                    {{ errors.giaBanThanhCong }}
                  </small>
                  <small v-else-if="form.giaBanThanhCong" class="text-info fw-medium mt-1 d-block">
                    <i class="fas fa-chart-line me-1"></i>{{ formatMoneyVN(form.giaBanThanhCong) }}
                  </small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">
                    Ngày bán <span class="text-danger">*</span>
                  </label>
                  <input
                    v-model="form.ngayBan"
                    type="date"
                    class="form-control"
                  />
                  <small v-if="errors.ngayBan" class="text-danger">
                    {{ errors.ngayBan }}
                  </small>
                </div>
              </div>
            </section>
          </div>

          <div v-show="activeTab === 'house'" class="tab-panel">
            <section class="mb-5">
              <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                <div class="section-icon bg-warning-light">
                  <i class="fas fa-home text-warning"></i>
                </div>
                <div>
                  <h2 class="h5 fw-bold mb-1">Thông tin nhà</h2>
                  <p class="text-muted small mb-0">Chi tiết về công trình nhà ở</p>
                </div>
              </div>
              <div class="row g-4">
                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-layer-group text-info"></i>
                    <span>Diện tích sàn (m²) <span class="text-danger">*</span></span>
                  </label>
                  <div class="input-group input-group-md">
                    <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.floorArea">
                    <span class="input-group-text"><i class="fas fa-th-large"></i></span>
                  </div>
                  <small v-if="errors.floorArea" class="text-danger">{{ errors.floorArea }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-house-user text-success"></i>
                    <span>Loại nhà <span class="text-danger">*</span></span>
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="form.loaiNha"
                    placeholder="Loại nhà"
                    list="loaiNhaList"
                  >
                  <datalist id="loaiNhaList">
                    <option value="Nhà cấp 4"></option>
                    <option value="Chung cư"></option>
                    <option value="Nhà 4 tầng"></option>
                    <option value="Nhà phố"></option>
                    <option value="Nhà biệt thự"></option>
                  </datalist>
                  <small v-if="errors.loaiNha" class="text-danger">{{ errors.loaiNha }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-door-closed text-warning"></i>
                    <span>Tổng số phòng <span class="text-danger">*</span></span>
                  </label>
                  <input type="number" min="0" class="form-control" v-model.number="form.tongSoPhong">
                  <small v-if="errors.tongSoPhong" class="text-danger">{{ errors.tongSoPhong }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-bed text-primary"></i>
                    <span>Số phòng ngủ <span class="text-danger">*</span></span>
                  </label>
                  <input type="number" min="0" class="form-control" v-model.number="form.soPhongNgu">
                  <small v-if="errors.soPhongNgu" class="text-danger">{{ errors.soPhongNgu }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-bath text-info"></i>
                    <span>Số phòng tắm <span class="text-danger">*</span></span>
                  </label>
                  <input type="number" min="0" class="form-control" v-model.number="form.soPhongTam">
                  <small v-if="errors.soPhongTam" class="text-danger">{{ errors.soPhongTam }}</small>
                </div>

                <div class="col-md-2">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-layer-group text-primary"></i>
                    <span>Số lầu <span class="text-danger">*</span></span>
                  </label>
                  <input type="number" min="0" class="form-control" v-model.number="form.soLau">
                  <small v-if="errors.soLau" class="text-danger">{{ errors.soLau }}</small>
                </div>

                <div class="col-md-2">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-building text-info"></i>
                    <span>Số tầng <span class="text-danger">*</span></span>
                  </label>
                  <input type="number" min="0" class="form-control" v-model.number="form.soTang">
                  <small v-if="errors.soTang" class="text-danger">{{ errors.soTang }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-couch text-warning"></i>
                    <span>Nội thất <span class="text-danger">*</span></span>
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="form.noiThat"
                    list="noiThatList"
                    placeholder="Nội thất"
                  >

                  <datalist id="noiThatList">
                    <option value="Full nội thất"></option>
                    <option value="Cơ bản"></option>
                    <option value="Nội thất trống"></option>
                    <option value="Có tủ bếp"></option>
                    <option value="Có máy lạnh"></option>
                  </datalist>
                  <small v-if="errors.noiThat" class="text-danger">{{ errors.noiThat }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-search text-primary"></i>
                    <span>Hiện trạng nhà <span class="text-danger">*</span></span>
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    v-model.trim="form.hienTrangNha"
                    list="hienTrangNhaList"
                    placeholder="Hiện trạng"
                  >

                  <datalist id="hienTrangNhaList">
                    <option value="Nhà mới"></option>
                    <option value="Nhà đang ở"></option>
                    <option value="Nhà đang cho thuê"></option>
                    <option value="Nhà xuống cấp"></option>
                    <option value="Nhà bỏ trống"></option>
                  </datalist>
                  <small v-if="errors.hienTrangNha" class="text-danger">{{ errors.hienTrangNha }}</small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold d-flex align-items-center gap-2">
                    <i class="fas fa-calendar-alt text-info"></i>
                    <span>Năm xây dựng <span class="text-danger">*</span></span>
                  </label>
                  <input type="text" class="form-control" v-model.trim="form.namXayDung" placeholder="Năm xây dựng">
                  <small v-if="errors.namXayDung" class="text-danger">{{ errors.namXayDung }}</small>
                </div>
              </div>
            </section>

            <section class="mb-5">
              <div class="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                <div class="d-flex align-items-center">
                  <div class="section-icon bg-info-light">
                    <i class="fas fa-door-open text-info"></i>
                  </div>
                  <div>
                    <h2 class="h5 fw-bold mb-1">Danh sách phòng</h2>
                    <p class="text-muted small mb-0">Quản lý các phòng trong nhà</p>
                  </div>
                </div>
                <button type="button" class="btn btn-primary btn-sm d-flex align-items-center gap-2" @click="addRoom">
                  <i class="fas fa-plus"></i><span>Thêm phòng</span>
                </button>
              </div>
              <div class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead class="table-light">
                  <tr>
                    <th class="ps-4" style="width: 25%;">
                      <i class="fas fa-door-closed me-2 text-primary"></i>
                      Loại phòng  <span class="text-danger">*</span>
                    </th>

                    <th class="ps-2" style="width: 20%;">
                      <i class="fas fa-hashtag me-2 text-info"></i>
                      Số lượng  <span class="text-danger">*</span>
                    </th>

                    <th class="ps-2" style="width: 20%;">
                      <i class="fas fa-expand-alt me-2 text-success"></i>
                      Diện tích (m²)  <span class="text-danger">*</span>
                    </th>

                    <th style="width: 35%;">
                      <i class="fas fa-comment-alt me-2 text-warning"></i>
                      Mô tả  <span class="text-danger">*</span>
                    </th>

                    <th class="text-center pe-4" style="width: 60px;">
                      <i class="fas fa-cog text-muted"></i>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(room, index) in form.rooms" :key="room.id || index" class="room-row">
                    <td class="ps-4">
                      <input
                        type="text"
                        list="roomTypeList"
                        class="form-control form-control-sm"
                        v-model.trim="room.loaiPhong"
                        placeholder="Phòng ngủ, phòng khách..."
                      />

                      <datalist id="roomTypeList">
                        <option value="Phòng ngủ" />
                        <option value="Nhà vệ sinh" />
                        <option value="Phòng khách" />
                        <option value="Phòng bếp" />
                        <option value="Phòng ăn" />
                        <option value="Phòng làm việc" />
                        <option value="Phòng đọc sách" />
                        <option value="Phòng thờ" />
                        <option value="Kho" />
                        <option value="Sân thượng" />
                      </datalist>
                    </td>
                    <td class="text-center">
                      <input
                        type="number"
                        min="0"
                        class="form-control form-control-sm w-full"
                        v-model.number="room.soLuong"
                        placeholder="Số lượng phòng tương đồng"
                      />
                    </td>
                    <td class="text-center">
                      <div class="input-group input-group-sm">
                        <input type="number" min="0" step="0.01" class="form-control form-control-sm w-full" v-model.number="room.dienTich"
                               placeholder="Diện tích mỗi phòng">
                        <span class="input-group-text"><i class="fas fa-ruler-combined"></i></span>
                      </div>
                    </td>
                    <td>
                      <input type="text" class="form-control form-control-sm" v-model.trim="room.moTa" placeholder="Ghi chú về phòng">
                    </td>
                    <td class="text-center pe-4">
                      <button type="button" class="btn btn-sm btn-outline-danger" @click="removeRoom(index)" :disabled="form.rooms.length === 1">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="form.rooms.length === 0">
                    <td colspan="5" class="text-center py-4 text-muted">
                      <i class="fas fa-door-closed me-2"></i>Chưa có phòng nào được thêm
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="errors.rooms" class="text-danger small mt-2">{{ errors.rooms }}</div>
              </div>
            </section>
          </div>

          <div v-show="activeTab === 'manager'" class="tab-panel">
            <section class="mb-5">
              <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                <div class="section-icon bg-warning-light">
                  <i class="fas fa-user-shield text-warning"></i>
                </div>
                <div>
                  <h2 class="h5 fw-bold mb-1">Thông tin người quản lý</h2>
                  <p class="text-muted small mb-0">Tìm kiếm người quản lý trong hệ thống</p>
                </div>
              </div>

              <div class="owner-mode-card">
                <div class="row g-3 align-items-end">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold d-flex align-items-center gap-2">
                      <i class="fas fa-search text-primary"></i>
                      <span>Tìm người quản lý <span class="text-danger">*</span></span>
                    </label>
                    <div class="input-group input-group-md">
                      <span class="input-group-text bg-light"><i class="fas fa-search text-muted"></i></span>
                      <input
                        type="text"
                        class="form-control"
                        v-model.trim="managerSearch"
                        placeholder="Nhập số điện thoại hoặc email"
                      >
                    </div>
                    <small v-if="errors.managerSearch" class="text-danger">{{ errors.managerSearch }}</small>
                  </div>
                  <div class="col-md-2">
                    <button type="button" class="btn btn-primary w-100" @click="handleManagerLookup">
                      <i class="fas fa-search me-1"></i>Tìm
                    </button>
                  </div>
                </div>
                <div v-if="managerLookupMessage" class="mt-3">
                  <div :class="['alert', managerLookupMessage.includes('thành công') ? 'alert-success' : 'alert-danger', 'py-2 small']">
                    <i :class="managerLookupMessage.includes('thành công') ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                    {{ managerLookupMessage }}
                  </div>
                </div>
                <div v-if="hasManager" class="owner-info-card mt-3">
                  <div class="owner-info-header">
                    <i class="fas fa-user-check"></i>
                    <span>Người quản lý trong hệ thống</span>
                  </div>
                  <div class="owner-info-body">
                    <div class="owner-name">{{ managerInfo.fullName }}</div>
                    <div class="owner-meta">
                      <i class="fas fa-phone text-primary me-2"></i>{{ managerInfo.phone }}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div v-show="activeTab === 'owner'" class="tab-panel">
            <section class="mb-5">
              <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                <div class="section-icon bg-danger-light">
                  <i class="fas fa-user-tie text-danger"></i>
                </div>
                <div>
                  <h2 class="h5 fw-bold mb-1">Thông tin chủ tài sản và liên hệ</h2>
                  <p class="text-muted small mb-0">Thông tin người sở hữu tài sản</p>
                </div>
              </div>

              <div class="owner-mode-switch mb-4">
                <div class="form-check">
                  <input
                      id="owner-nonsystem"
                      v-model="ownerMode"
                      class="form-check-input"
                      type="radio"
                      value="nonSystem"
                  />
                  <label class="form-check-label fw-semibold" for="owner-nonsystem">
                    Chủ tài sản không sử dụng hệ thống
                  </label>
                </div>
                <div class="form-check">
                  <input
                    id="owner-system"
                    v-model="ownerMode"
                    class="form-check-input"
                    type="radio"
                    value="system"
                  />
                  <label class="form-check-label fw-semibold" for="owner-system">
                    Chủ tài sản có sử dụng hệ thống
                  </label>
                </div>

              </div>

              <div v-if="isSystemOwnerMode" class="owner-mode-card">
                <div class="row g-3 align-items-end">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold d-flex align-items-center gap-2">
                      <i class="fas fa-search text-primary"></i>
                      <span>Tìm chủ tài sản  <span class="text-danger">*</span></span>
                    </label>
                    <div class="input-group input-group-md">
                      <span class="input-group-text bg-light"><i class="fas fa-search text-muted"></i></span>
                      <input
                        type="text"
                        class="form-control"
                        v-model.trim="ownerSearch"
                        placeholder="Nhập số điện thoại hoặc email"
                      >
                    </div>
                    <small v-if="errors.ownerSearch" class="text-danger">{{ errors.ownerSearch }}</small>
                  </div>
                  <div class="col-md-2">
                    <button type="button" class="btn btn-primary w-100" @click="handleOwnerLookup">
                      <i class="fas fa-search me-1"></i>Tìm
                    </button>
                  </div>
                </div>
                <div v-if="ownerLookupMessage" class="mt-3">
                  <div :class="['alert', ownerLookupMessage.includes('thành công') ? 'alert-success' : 'alert-danger', 'py-2 small']">
                    <i :class="ownerLookupMessage.includes('thành công') ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                    {{ ownerLookupMessage }}
                  </div>
                </div>
                <div v-if="hasSystemOwner" class="owner-info-card mt-3">
                  <div class="owner-info-header">
                    <i class="fas fa-user-check"></i>
                    <span>Chủ tài sản trong hệ thống</span>
                  </div>
                  <div class="owner-info-body">
                    <div class="owner-name">{{ form.ownerFullName }}</div>
                    <div class="owner-meta">
                      <i class="fas fa-phone text-primary me-2"></i>{{ form.ownerPhone }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="owner-mode-card">
                <div class="d-flex gap-3 flex-wrap mb-3">
                  <div class="form-check">
                    <input
                      id="owner-existing"
                      v-model="nonSystemOwnerOption"
                      class="form-check-input"
                      type="radio"
                      value="existing"
                    />
                    <label class="form-check-label" for="owner-existing">Chọn chủ đã có</label>
                  </div>
                  <div class="form-check">
                    <input
                      id="owner-new"
                      v-model="nonSystemOwnerOption"
                      class="form-check-input"
                      type="radio"
                      value="new"
                    />
                    <label class="form-check-label" for="owner-new">Nhập chủ mới</label>
                  </div>
                </div>

                <div v-if="nonSystemOwnerOption === 'existing'">
                  <div class="row g-3 align-items-end">
                    <div class="col-md-6">
                      <label class="form-label fw-semibold d-flex align-items-center gap-2">
                        <i class="fas fa-search text-primary"></i>
                        <span>Tìm chủ tài sản  <span class="text-danger">*</span></span>
                      </label>
                      <div class="input-group input-group-md">
                        <span class="input-group-text bg-light"><i class="fas fa-search text-muted"></i></span>
                        <input
                          type="text"
                          class="form-control"
                          v-model.trim="nonSystemOwnerSearch"
                          placeholder="Nhập số điện thoại"
                        >
                      </div>
                      <small v-if="errors.nonSystemOwnerSearch" class="text-danger">{{ errors.nonSystemOwnerSearch }}</small>
                    </div>
                    <div class="col-md-2">
                      <button type="button" class="btn btn-primary w-100" @click="handleNonSystemOwnerLookup">
                        <i class="fas fa-search me-1"></i>Tìm
                      </button>
                    </div>
                  </div>
                  <div v-if="nonSystemLookupMessage" class="mt-3">
                    <div :class="['alert', nonSystemLookupMessage.includes('thành công') ? 'alert-success' : 'alert-danger', 'py-2 small']">
                      <i :class="nonSystemLookupMessage.includes('thành công') ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                      {{ nonSystemLookupMessage }}
                    </div>
                  </div>
                  <div v-if="nonSystemExistingOwner" class="owner-info-card mt-3">
                    <div class="owner-info-header">
                      <i class="fas fa-user-check"></i>
                      <span>Chủ tài sản</span>
                    </div>
                    <div class="owner-info-body">
                      <div class="owner-name">{{ nonSystemExistingOwner.fullName }}</div>
                      <div class="owner-meta">
                        <i class="fas fa-phone text-primary me-2"></i>{{ nonSystemExistingOwner.phone }}
                      </div>
                      <div v-if="nonSystemExistingOwner.newAddress" class="owner-meta">
                        <i class="fas fa-map-marker-alt text-danger me-2"></i>{{ formatAddress(nonSystemExistingOwner.newAddress) }}
                      </div>
                      <div v-if="nonSystemExistingOwner.oldAddress" class="owner-note text-muted">
                        Địa chỉ cũ: {{ nonSystemExistingOwner.oldAddress }}
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else>
                  <div class="row g-3">
                    <div class="col-md-4">
                      <label class="form-label fw-semibold d-flex align-items-center gap-2">
                        <i class="fas fa-user text-success"></i>
                        <span>Họ tên chủ <span class="text-danger">*</span></span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        v-model.trim="nonSystemNewOwner.fullName"
                        placeholder="Họ và tên đầy đủ"
                      />
                      <small v-if="errors.ownerFullName" class="text-danger">{{ errors.ownerFullName }}</small>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-semibold d-flex align-items-center gap-2">
                        <i class="fas fa-phone text-info"></i>
                        <span>Số điện thoại <span class="text-danger">*</span></span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        v-model.trim="nonSystemNewOwner.phone"
                        placeholder="Số điện thoại liên hệ"
                      />
                      <small v-if="errors.ownerPhone" class="text-danger">{{ errors.ownerPhone }}</small>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-semibold d-flex align-items-center gap-2">
                        <i class="fas fa-venus-mars text-warning"></i>
                        <span>Giới tính</span>
                      </label>
                      <select class="form-select" v-model="nonSystemNewOwner.gender">
                        <option :value="null">-- Chọn --</option>
                        <option :value="true">Nam</option>
                        <option :value="false">Nữ</option>
                      </select>
                    </div>
                    <div class="col-12">
                      <Address5 v-model="nonSystemNewOwner.newAddress"></Address5>
                      <small v-if="errors.ownerNewAddress" class="text-danger">{{ errors.ownerNewAddress }}</small>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-semibold d-flex align-items-center gap-2">
                        <i class="fas fa-map text-secondary"></i>
                        <span>Địa chỉ cũ</span>
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        v-model.trim="nonSystemNewOwner.oldAddress"
                        placeholder="Địa chỉ trước đây (nếu có)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="row g-4 mt-2">
                <div class="col-md-4">
                  <label class="form-label fw-semibold">
                    Liên hệ <span class="text-danger">*</span>
                  </label>
                  <input
                      v-model="form.lienHeMoKhoa"
                      type="tel"
                      class="form-control"
                      placeholder="VD: 0909 123 456"
                  />
                  <small v-if="errors.lienHeMoKhoa" class="text-danger">
                    {{ errors.lienHeMoKhoa }}
                  </small>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">
                    Hiện thông tin chủ khi MG mở khóa
                  </label>
                  <select v-model="form.hienThongTinChuKhiMoKhoa" class="form-select">
                    <option :value="true">Có</option>
                    <option :value="false">Không</option>
                  </select>
                </div>

                <div class="col-md-4">
                  <label class="form-label fw-semibold">
                    Hiện liên hệ khi MG mở khóa
                  </label>
                  <select v-model="form.hienLienHeKhiMoKhoa" class="form-select">
                    <option :value="true">Có</option>
                    <option :value="false">Không</option>
                  </select>
                </div>
              </div>
            </section>

            <section class="mb-4">
              <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                <div class="section-icon bg-info-light">
                  <i class="fas fa-pen-nib text-info"></i>
                </div>
                <div>
                  <h2 class="h5 fw-bold mb-1">Mô tả ngắn</h2>
                  <p class="text-muted small mb-0">Tóm tắt nhanh nổi bật của tài sản</p>
                </div>
              </div>

              <div class="short-description-card">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-align-left text-primary"></i>
                  <span>Nội dung mô tả</span>
                </label>
                <textarea
                    class="form-control short-description-input"
                    rows="4"
                    v-model.trim="form.moTaNgan"
                    placeholder="Ví dụ: Nhà góc 2 mặt tiền, gần trung tâm, phù hợp kinh doanh..."></textarea>
                <small v-if="errors.moTaNgan" class="text-danger">{{ errors.moTaNgan }}</small>
              </div>
            </section>

            <section class="mb-4">
              <div class="d-flex align-items-center mb-4 border-bottom pb-3">
                <div class="section-icon bg-secondary-light">
                  <i class="fas fa-paperclip text-secondary"></i>
                </div>
                <div>
                  <h2 class="h5 fw-bold mb-1">Tệp đính kèm <span class="text-danger">*</span></h2>
                  <p class="text-muted small mb-0">Quản lý hồ sơ tài liệu</p>
                </div>
              </div>
              <FileOrLand
                  :file-list="form.files"
                  :entity-id="assetId"
                  entity-type="land"
                  :canEdit="true"
                  :onUpload="true"
                  :allowDownloadAll="false"
                  @update:files="handleFileUpdate"
              />
              <div v-if="errors.files" class="text-danger small mt-2">{{ errors.files }}</div>
              <div v-if="errors.mainImage" class="text-danger small mt-2">{{ errors.mainImage }}</div>
            </section>
          </div>

          <div class="tab-actions d-flex justify-content-between align-items-center mt-4">
            <button type="button" class="btn btn-outline-secondary" :disabled="isFirstTab" @click="goToPrevTab">
              <i class="fas fa-arrow-left me-2"></i>Quay lại
            </button>
            <button v-if="!isLastTab" type="button" class="btn btn-primary" @click="goToNextTab">
              Tiếp theo<i class="fas fa-arrow-right ms-2"></i>
            </button>
            <button
                v-else
                type="button"
                class="btn btn-primary d-flex align-items-center gap-2 px-4"
                :disabled="isSubmitting"
                @click="submitForm"
            >
              <i class="fas fa-save"></i><span>{{ isSubmitting ? 'Đang xử lý...' : 'Lưu thay đổi' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '/src/api/api.js'
import FileOrLand from '../productAdmin/FileNew.vue'
import { showLoading, updateAlertError, updateAlertSuccess } from '../../assets/js/alertService.js'
import router from '../../router/index.js'
import Address5 from '../productAdmin/Address5.vue'
import { useAuthStore } from '../../stores/authStore.js'

const route = useRoute()
const assetId = Number(route.params.id)
const asset = ref(null)
const originalFiles = ref([])
const isHydrating = ref(false)

const defaultRoom = () => ({ loaiPhong: '', soLuong: null, dienTich: null, moTa: '' })

const form = reactive({
  address: '',
  oldAddress: '',
  plotNumber: '',
  parcelNumber: '',
  totalArea: null,
  ownershipRelation: '',
  landUseRight: '',
  landPosition: '',
  status: '',
  desire: null,
  show: false,
  loaiTaiSan: '',
  phanLoaiHang: '',
  giaBan: null,
  giaNoiBo: null,
  khuVucMa: '',
  phiMoiGioi: null,
  donViSoHuu: '',
  loaiDat: '',
  chieuNgang: null,
  chieuDai: null,
  loGioi: null,
  doRongDuong: null,
  hienTrangDat: '',
  soLau: null,
  soTang: null,
  soPhongNgu: null,
  soPhongTam: null,
  matTienNha: null,
  tongSoPhong: null,
  floorArea: null,
  loaiNha: '',
  noiThat: '',
  hienTrangNha: '',
  namXayDung: '',
  structure: '',
  ownerId: null,
  ownerFullName: '',
  ownerPhone: '',
  ownerMode: 'system',
  ownerOption: 'existing',
  ownerGender: null,
  ownerNewAddress: '',
  ownerOldAddress: '',
  nguoiQuanLyID: null,
  moTaNgan: '',
  rooms: [defaultRoom()],
  hienThongTinChuKhiMoKhoa: true,
  hienLienHeKhiMoKhoa: true,
  lienHeMoKhoa: '',
  nguoiBanId: null,
  nguoiBanTen: '',
  nguoiBanSearch: '',
  giaBanThanhCong: null,
  ngayBan: '',
  files: [],
  newFiles: [],
  newLandBookFiles: [],
  deletedFileIds: [],
  deletedLandBookFileIds: [],
})

const errors = reactive({})
const ownerSearch = ref('')
const ownerLookupMessage = ref('')
const ownerMode = ref('nonSystem')
const managerSearch = ref('')
const managerLookupMessage = ref('')
const managerInfo = reactive({
  fullName: '',
  phone: '',
})
const nonSystemOwnerOption = ref('new')
const nonSystemOwnerSearch = ref('')
const nonSystemLookupMessage = ref('')
const nonSystemExistingOwner = ref(null)
const nonSystemNewOwner = reactive({
  fullName: '',
  phone: '',
  gender: null,
  newAddress: '',
  oldAddress: '',
})
const isSubmitting = ref(false)

const isHouse = computed(() => form.loaiTaiSan === 'NHA')
const isSystemOwnerMode = computed(() => ownerMode.value === 'system')
const hasSystemOwner = computed(() => isSystemOwnerMode.value && form.ownerFullName && form.ownerPhone)
const hasManager = computed(() => form.nguoiQuanLyID && managerInfo.fullName && managerInfo.phone)

const tabs = computed(() => {
  const baseTabs = [
    { id: 'basic', label: 'Thông tin cơ bản', icon: 'fas fa-info-circle' },
    { id: 'address', label: 'Địa chỉ', icon: 'fas fa-map-marked-alt' },
    { id: 'legal', label: 'Pháp lý & diện tích', icon: 'fas fa-balance-scale' },
  ]

  if (isHouse.value) {
    baseTabs.push({id: 'house', label: 'Thông tin nhà & phòng', icon: 'fas fa-home'})
  }

  if (useAuthStore().hasPermission('PRODUCT_EDIT_MANAGER')) {
    baseTabs.push({ id: 'manager', label: 'Người quản lý', icon: 'fas fa-user-shield' })
  }

  baseTabs.push({ id: 'owner', label: 'Chủ tài sản & hồ sơ', icon: 'fas fa-user-tie' })
  return baseTabs
})

const activeTab = ref('basic')
const tabOrder = computed(() => tabs.value.map((tab) => tab.id))
const isFirstTab = computed(() => tabOrder.value.indexOf(activeTab.value) === 0)
const isLastTab = computed(() => tabOrder.value.indexOf(activeTab.value) === tabOrder.value.length - 1)
const getTabIndex = (tabId) => tabOrder.value.indexOf(tabId)
const isTabCompleted = (tabId) => getTabIndex(tabId) < getTabIndex(activeTab.value)
const isTabPending = (tabId) => getTabIndex(tabId) > getTabIndex(activeTab.value)

const addressKey = ref(0)

const isSold = computed(() => form.status === 'Đã bán')

watch(
  () => form.loaiTaiSan,
  (value) => {
    if (value !== 'NHA') {
      form.rooms = []
    } else if (!form.rooms.length) {
      form.rooms = [defaultRoom()]
    }
  }
)
watch(isHouse, (value) => {
  if (!value && activeTab.value === 'house') {
    activeTab.value = 'legal'
  }
})

watch(ownerMode, (value) => {
  if (isHydrating.value) return
  form.ownerMode = value
  ownerLookupMessage.value = ''
  errors.ownerSearch = ''
  nonSystemLookupMessage.value = ''
  errors.nonSystemOwnerSearch = ''

  if (value === 'system') {
    nonSystemOwnerSearch.value = ''
    nonSystemExistingOwner.value = null
    Object.assign(nonSystemNewOwner, {
      fullName: '',
      phone: '',
      gender: null,
      newAddress: '',
      oldAddress: '',
    })
    form.ownerOption = nonSystemOwnerOption.value
    form.ownerGender = null
    form.ownerNewAddress = ''
    form.ownerOldAddress = ''
  } else {
    ownerSearch.value = ''
    form.ownerId = null
    form.ownerFullName = ''
    form.ownerPhone = ''
  }
})

watch(nonSystemOwnerOption, (value) => {
  if (isHydrating.value) return
  form.ownerOption = value
  nonSystemLookupMessage.value = ''
  errors.nonSystemOwnerSearch = ''
  nonSystemExistingOwner.value = null
  if (value === 'existing') {
    Object.assign(nonSystemNewOwner, {
      fullName: '',
      phone: '',
      gender: null,
      newAddress: '',
      oldAddress: '',
    })
  } else {
    form.ownerId = null
  }
})

watch(nonSystemNewOwner, (value) => {
  form.ownerFullName = value.fullName || ''
  form.ownerPhone = value.phone || ''
  form.ownerGender = value.gender ?? null
  form.ownerNewAddress = value.newAddress || ''
  form.ownerOldAddress = value.oldAddress || ''
}, { deep: true })

watch(() => form.status, (newStatus) => {
  if (newStatus !== 'Đã bán') {
    form.nguoiBanId = null
    form.nguoiBanTen = ''
    form.nguoiBanSearch = ''
    form.giaBanThanhCong = null
    form.ngayBan = ''
  }
})

const addRoom = () => {
  form.rooms.push(defaultRoom())
}

const removeRoom = (index) => {
  if (form.rooms.length > 1) form.rooms.splice(index, 1)
}

const handleFileUpdate = (files) => {
  form.files = Array.isArray(files) ? files : []

  const existingFiles = form.files.filter(file => !file.file && file.id)
  const newFiles = form.files.filter(file => file.file instanceof File)

  form.newFiles = newFiles
    .filter(f => !f.isIG)
    .map(f => ({ file: f.file, isOnTop: f.isOnTop }))

  form.newLandBookFiles = newFiles
    .filter(f => f.isIG)
    .map(f => ({ file: f.file, isOnTop: f.isOnTop }))

  const originalIds = (originalFiles.value || []).map(f => f.id)
  const currentIds = existingFiles.map(f => f.id)

  form.deletedFileIds = originalIds.filter(id => {
    const file = (originalFiles.value || []).find(f => f.id === id)
    return !currentIds.includes(id) && file && !file.isIG
  })

  form.deletedLandBookFileIds = originalIds.filter(id => {
    const file = (originalFiles.value || []).find(f => f.id === id)
    return !currentIds.includes(id) && file && file.isIG
  })
}
const formatAddress = (address) => {
  if (!address) return ''
  return address.replace(/\s*\/!!\s*/g, ', ')
}
const normalizeText = (value) => (value || '').toString().trim().toLowerCase()
const isImageFile = (fileName) => /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName || '')
const requireTextField = (value, key, message) => {
  if (!normalizeText(value)) {
    errors[key] = message
    return false
  }
  return true
}

const requireNumberField = (value, key, message, allowZero = false) => {
  const numberValue = Number(value)
  if (value === null || value === undefined || value === '' || Number.isNaN(numberValue) || (!allowZero && numberValue < 0)) {
    errors[key] = message
    return false
  }
  return true
}

const formatMoneyVN = (value) => {
  if (value == null || isNaN(value)) return '0'
  const num = Number(value)

  if (num < 1_000_000) {
    return num.toLocaleString('vi-VN') + ' VNĐ'
  }

  if (num < 1_000_000_000) {
    const trieu = num / 1_000_000
    return `${trieu.toFixed(trieu % 1 === 0 ? 0 : 1)} triệu`
  }

  const ty = num / 1_000_000_000
  return `${ty.toFixed(ty % 1 === 0 ? 0 : 2)} tỷ`
}

const formatDateForInput = (value) => {
  if (!value) return ''
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 10)
}

const clearErrors = (fields) => {
  fields.forEach((field) => {
    if (errors[field]) {
      delete errors[field]
    }
  })
}

const validateOwnerSection = () => {
  let valid = true

  if (ownerMode.value === 'system') {
    if (!ownerSearch.value) {
      errors.ownerSearch = 'Nhập phone hoặc email để tìm kiếm'
      valid = false
    } else if (!form.ownerId) {
      errors.ownerSearch = 'Chưa tìm thấy chủ tài sản'
      valid = false
    }
  } else if (nonSystemOwnerOption.value === 'existing') {
    if (!nonSystemOwnerSearch.value) {
      errors.nonSystemOwnerSearch = 'Nhập số điện thoại để tìm kiếm'
      valid = false
    } else if (!nonSystemExistingOwner.value) {
      errors.nonSystemOwnerSearch = 'Chưa chọn được chủ đã có'
      valid = false
    }
  } else {
    if (!nonSystemNewOwner.fullName) {
      errors.ownerFullName = 'Nhập họ tên chủ'
      valid = false
    }
    if (!nonSystemNewOwner.phone) {
      errors.ownerPhone = 'Nhập số điện thoại'
      valid = false
    } else if (!isValidVietnamPhone(nonSystemNewOwner.phone)) {
      errors.ownerPhone = 'Số điện thoại không đúng định dạng'
      valid = false
    }
    if (!nonSystemNewOwner.newAddress) {
      errors.ownerNewAddress = 'Nhập địa chỉ mới'
      valid = false
    }
  }

  if (!form.lienHeMoKhoa) {
    errors.lienHeMoKhoa = 'Vui lòng nhập số điện thoại liên hệ'
    valid = false
  } else if (!isValidVietnamPhone(form.lienHeMoKhoa)) {
    errors.lienHeMoKhoa = 'Số điện thoại không đúng định dạng'
    valid = false
  }

  return valid
}

const validateManagerSection = () => true

const validateTab = (tabId) => {
  let isValid = true
  const track = (valid) => {
    if (!valid) isValid = false
  }

  if (tabId === 'basic') {
    clearErrors(['loaiTaiSan', 'phanLoaiHang', 'donViSoHuu', 'giaBan', 'giaNoiBo', 'desire', 'phiMoiGioi'])
    track(requireTextField(form.loaiTaiSan, 'loaiTaiSan', 'Bắt buộc chọn loại tài sản'))
    track(requireTextField(form.phanLoaiHang, 'phanLoaiHang', 'Bắt buộc chọn phân loại'))
    track(requireTextField(form.donViSoHuu, 'donViSoHuu', 'Chọn đơn vị sở hữu'))
    track(requireNumberField(form.giaBan, 'giaBan', 'Vui lòng nhập giá bán hợp lệ'))
    track(requireNumberField(form.giaNoiBo, 'giaNoiBo', 'Nhập giá nội bộ'))
    track(requireNumberField(form.desire, 'desire', 'Nhập giá mong muốn'))
    track(requireNumberField(form.phiMoiGioi, 'phiMoiGioi', 'Nhập phí môi giới', true))
  }

  if (tabId === 'address') {
    clearErrors(['address', 'landPosition'])
    if (!form.address) {
      errors.address = 'Vui lòng nhập đầy đủ địa chỉ'
      isValid = false
    } else {
      const parts = form.address.split('/!!')
      if (parts.length < 3 || parts.some(p => !p || !p.trim())) {
        errors.address = 'Vui lòng nhập đầy đủ địa chỉ'
        isValid = false
      }
    }
    track(requireTextField(form.landPosition, 'landPosition', 'Nhập vị trí đất'))
  }

  if (tabId === 'legal') {
    clearErrors([
      'plotNumber',
      'parcelNumber',
      'totalArea',
      'ownershipRelation',
      'landUseRight',
      'status',
      'matTienNha',
      'chieuNgang',
      'chieuDai',
      'hienTrangDat',
      'doRongDuong',
      'loGioi',
      'structure',
      'nguoiBanSearch',
      'giaBanThanhCong',
      'ngayBan',
    ])
    track(requireTextField(form.plotNumber, 'plotNumber', 'Nhập số thửa'))
    track(requireTextField(form.parcelNumber, 'parcelNumber', 'Nhập số tờ'))
    track(requireNumberField(form.totalArea, 'totalArea', 'Nhập tổng diện tích hợp lệ'))
    track(requireTextField(form.ownershipRelation, 'ownershipRelation', 'Nhập quan hệ sở hữu'))
    track(requireTextField(form.landUseRight, 'landUseRight', 'Nhập quyền sử dụng đất'))
    track(requireTextField(form.status, 'status', 'Chọn tình trạng'))
    track(requireNumberField(form.matTienNha, 'matTienNha', 'Nhập mặt tiền hợp lệ'))
    track(requireNumberField(form.chieuNgang, 'chieuNgang', 'Nhập chiều ngang hợp lệ'))
    track(requireNumberField(form.chieuDai, 'chieuDai', 'Nhập chiều dài hợp lệ'))
    track(requireTextField(form.hienTrangDat, 'hienTrangDat', 'Nhập hiện trạng đất'))
    track(requireNumberField(form.doRongDuong, 'doRongDuong', 'Nhập độ rộng đường hợp lệ'))
    track(requireNumberField(form.loGioi, 'loGioi', 'Nhập lộ giới hợp lệ'))
    track(requireTextField(form.structure, 'structure', 'Nhập mô tả hình dạng/kết cấu'))

    if (isSold.value) {
      if (!form.nguoiBanId) {
        errors.nguoiBanSearch = 'Bắt buộc chọn người bán'
        isValid = false
      }
      if (!form.giaBanThanhCong || form.giaBanThanhCong <= 0) {
        errors.giaBanThanhCong = 'Nhập giá bán thành công'
        isValid = false
      }
      if (!form.ngayBan) {
        errors.ngayBan = 'Nhập ngày bán'
        isValid = false
      }
    }
  }

  if (tabId === 'house' && isHouse.value) {
    clearErrors([
      'floorArea',
      'loaiNha',
      'tongSoPhong',
      'soPhongNgu',
      'soPhongTam',
      'soTang',
      'noiThat',
      'hienTrangNha',
      'namXayDung',
      'rooms',
      'soLau',
    ])
    track(requireNumberField(form.floorArea, 'floorArea', 'Nhập diện tích sàn hợp lệ'))
    track(requireTextField(form.loaiNha, 'loaiNha', 'Nhập loại nhà'))
    track(requireNumberField(form.tongSoPhong, 'tongSoPhong', 'Nhập tổng số phòng'))
    track(requireNumberField(form.soPhongNgu, 'soPhongNgu', 'Nhập số phòng ngủ'))
    track(requireNumberField(form.soPhongTam, 'soPhongTam', 'Nhập số phòng tắm'))
    track(requireNumberField(form.soTang, 'soTang', 'Nhập số tầng'))
    track(requireTextField(form.noiThat, 'noiThat', 'Nhập thông tin nội thất'))
    track(requireTextField(form.hienTrangNha, 'hienTrangNha', 'Nhập hiện trạng nhà'))
    track(requireTextField(form.namXayDung, 'namXayDung', 'Nhập năm xây dựng'))

    if (form.soLau == null) {
      errors.soLau = 'Nhập số lầu'
      isValid = false
    }

    const hasRooms = form.rooms.length > 0
    const invalidRoom = form.rooms.some((room) => {
      const hasLoaiPhong = normalizeText(room.loaiPhong)
      const hasSoLuong = typeof room.soLuong === 'number' && room.soLuong > 0
      const hasDienTich = typeof room.dienTich === 'number' && room.dienTich > 0
      const hasMoTa = normalizeText(room.moTa)
      return !(hasLoaiPhong && hasSoLuong && hasDienTich && hasMoTa)
    })

    if (!hasRooms || invalidRoom) {
      errors.rooms = 'Nhà phải có ít nhất 1 phòng và điền đủ loại phòng, số lượng, diện tích, mô tả'
      isValid = false
    }
  }

  if (tabId === 'manager') {
    clearErrors(['managerSearch'])
    track(validateManagerSection())
  }

  return isValid
}

const setActiveTab = (tabId) => {
  if (!tabOrder.value.includes(tabId) || tabId === activeTab.value) return
  const currentIndex = tabOrder.value.indexOf(activeTab.value)
  const nextIndex = tabOrder.value.indexOf(tabId)
  if (nextIndex > currentIndex && !validateTab(activeTab.value)) return
  activeTab.value = tabId
}

const goToNextTab = () => {
  const currentIndex = tabOrder.value.indexOf(activeTab.value)
  const nextTab = tabOrder.value[currentIndex + 1]
  if (!nextTab) return
  if (!validateTab(activeTab.value)) return
  activeTab.value = nextTab
}

const goToPrevTab = () => {
  const currentIndex = tabOrder.value.indexOf(activeTab.value)
  const prevTab = tabOrder.value[currentIndex - 1]
  if (!prevTab) return
  activeTab.value = prevTab
}

const tabFieldMap = {
  basic: ['loaiTaiSan', 'phanLoaiHang', 'donViSoHuu', 'giaBan', 'giaNoiBo', 'desire', 'phiMoiGioi'],
  address: ['address', 'landPosition', 'oldAddress'],
  legal: [
    'plotNumber',
    'parcelNumber',
    'totalArea',
    'ownershipRelation',
    'landUseRight',
    'status',
    'matTienNha',
    'chieuNgang',
    'chieuDai',
    'hienTrangDat',
    'doRongDuong',
    'loGioi',
    'structure',
    'nguoiBanSearch',
    'giaBanThanhCong',
    'ngayBan',
  ],
  house: [
    'floorArea',
    'loaiNha',
    'tongSoPhong',
    'soPhongNgu',
    'soPhongTam',
    'soTang',
    'noiThat',
    'hienTrangNha',
    'namXayDung',
    'rooms',
    'soLau',
  ],
  manager: ['managerSearch'],
  owner: [
    'ownerSearch',
    'nonSystemOwnerSearch',
    'ownerFullName',
    'ownerPhone',
    'ownerNewAddress',
    'lienHeMoKhoa',
    'moTaNgan',
    'files',
    'mainImage',
  ],
}

const findTabForField = (field) => {
  const order = tabOrder.value
  return order.find((tab) => tabFieldMap[tab]?.includes(field)) || 'basic'
}

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  const track = (valid) => {
    if (!valid) isValid = false
  }

  track(requireTextField(form.loaiTaiSan, 'loaiTaiSan', 'Bắt buộc chọn loại tài sản'))
  track(requireTextField(form.phanLoaiHang, 'phanLoaiHang', 'Bắt buộc chọn phân loại'))
  track(requireTextField(form.donViSoHuu, 'donViSoHuu', 'Chọn đơn vị sở hữu'))
  track(requireNumberField(form.giaBan, 'giaBan', 'Vui lòng nhập giá bán hợp lệ'))
  track(requireNumberField(form.giaNoiBo, 'giaNoiBo', 'Nhập giá nội bộ'))
  track(requireNumberField(form.desire, 'desire', 'Nhập giá mong muốn'))

  if (!form.address) {
    errors.address = 'Vui lòng nhập đầy đủ địa chỉ'
    isValid = false
  } else {
    const parts = form.address.split('/!!')
    if (parts.length < 3 || parts.some(p => !p || !p.trim())) {
      errors.address = 'Vui lòng nhập đầy đủ địa chỉ'
      isValid = false
    }
  }

  track(requireTextField(form.landPosition, 'landPosition', 'Nhập vị trí đất'))
  track(requireTextField(form.plotNumber, 'plotNumber', 'Nhập số thửa'))
  track(requireTextField(form.parcelNumber, 'parcelNumber', 'Nhập số tờ'))
  track(requireNumberField(form.totalArea, 'totalArea', 'Nhập tổng diện tích hợp lệ'))
  track(requireTextField(form.ownershipRelation, 'ownershipRelation', 'Nhập quan hệ sở hữu'))
  track(requireTextField(form.landUseRight, 'landUseRight', 'Nhập quyền sử dụng đất'))
  track(requireTextField(form.status, 'status', 'Chọn tình trạng'))
  track(requireNumberField(form.matTienNha, 'matTienNha', 'Nhập mặt tiền hợp lệ'))
  track(requireNumberField(form.chieuNgang, 'chieuNgang', 'Nhập chiều ngang hợp lệ'))
  track(requireNumberField(form.chieuDai, 'chieuDai', 'Nhập chiều dài hợp lệ'))
  track(requireTextField(form.hienTrangDat, 'hienTrangDat', 'Nhập hiện trạng đất'))
  track(requireNumberField(form.doRongDuong, 'doRongDuong', 'Nhập độ rộng đường hợp lệ'))
  track(requireNumberField(form.loGioi, 'loGioi', 'Nhập lộ giới hợp lệ'))
  track(requireTextField(form.structure, 'structure', 'Nhập mô tả hình dạng/kết cấu'))
  track(requireNumberField(form.phiMoiGioi, 'phiMoiGioi', 'Nhập phí môi giới', true))

  if (!validateOwnerSection()) {
    isValid = false
  }

  if (!validateManagerSection()) {
    isValid = false
  }

  if (isSold.value) {
    if (!form.nguoiBanId) {
      errors.nguoiBanSearch = 'Bắt buộc chọn người bán'
      isValid = false
    }

    if (!form.giaBanThanhCong || form.giaBanThanhCong <= 0) {
      errors.giaBanThanhCong = 'Nhập giá bán thành công'
      isValid = false
    }

    if (!form.ngayBan) {
      errors.ngayBan = 'Nhập ngày bán'
      isValid = false
    }
  }

  if (isHouse.value) {
    track(requireNumberField(form.floorArea, 'floorArea', 'Nhập diện tích sàn hợp lệ'))
    track(requireTextField(form.loaiNha, 'loaiNha', 'Nhập loại nhà'))
    track(requireNumberField(form.tongSoPhong, 'tongSoPhong', 'Nhập tổng số phòng'))
    track(requireNumberField(form.soPhongNgu, 'soPhongNgu', 'Nhập số phòng ngủ'))
    track(requireNumberField(form.soPhongTam, 'soPhongTam', 'Nhập số phòng tắm'))
    track(requireNumberField(form.soTang, 'soTang', 'Nhập số tầng'))
    track(requireTextField(form.noiThat, 'noiThat', 'Nhập thông tin nội thất'))
    track(requireTextField(form.hienTrangNha, 'hienTrangNha', 'Nhập hiện trạng nhà'))
    track(requireTextField(form.namXayDung, 'namXayDung', 'Nhập năm xây dựng'))

    const hasRooms = form.rooms.length > 0
    const invalidRoom = form.rooms.some((room) => {
      const hasLoaiPhong = normalizeText(room.loaiPhong)
      const hasSoLuong = typeof room.soLuong === 'number' && room.soLuong > 0
      const hasDienTich = typeof room.dienTich === 'number' && room.dienTich > 0
      const hasMoTa = normalizeText(room.moTa)
      return !(hasLoaiPhong && hasSoLuong && hasDienTich && hasMoTa)
    })

    if (form.soLau == null) {
      errors.soLau = 'Nhập số lầu'
    }

    if (!hasRooms || invalidRoom) {
      errors.rooms = 'Nhà phải có ít nhất 1 phòng và điền đủ loại phòng, số lượng, diện tích, mô tả'
      isValid = false
    }
  }

  const normalImages = form.files.filter((file) => file && !file.isIG && isImageFile(file.fileName))
  const landBookImages = form.files.filter((file) => file && file.isIG && isImageFile(file.fileName))

  if (normalImages.length < 4 || landBookImages.length < 1) {
    errors.files = 'Cần tối thiểu 4 ảnh thường và 1 ảnh sổ'
    isValid = false
  }

  const hasMainImage = form.files.some((file) => file && file.isOnTop && isImageFile(file.fileName))
  if (!hasMainImage) {
    errors.mainImage = 'Vui lòng chọn 1 ảnh chính'
    isValid = false
  }

  if (!form.moTaNgan || form.moTaNgan.trim().length < 100) {
    errors.moTaNgan = 'Mô tả ngắn tối thiểu 100 ký tự'
    isValid = false
  }

  return isValid
}

const isValidVietnamPhone = (phone) => {
  if (!phone) return false

  const cleaned = phone.replace(/\s+/g, '')

  return /^(0|\+84)[3|5|7|8|9]\d{8}$/.test(cleaned)
}

const handleOwnerLookup = async ({ silent = false } = {}) => {
  if (!silent) {
    ownerLookupMessage.value = ''
  }
  if (!isSystemOwnerMode.value) return
  if (!ownerSearch.value) {
    if (!silent) {
      errors.ownerSearch = 'Nhập phone hoặc email để tìm kiếm'
    }
    return
  }
  errors.ownerSearch = ''

  try {
    const { data } = await api.get('/admin.thg/product/admin/tim-chu-tai-san', {
      params: {
        search: ownerSearch.value,
        phanLoaiHang: form.phanLoaiHang,
      },
    })

    if (data) {
      form.ownerId = data.id
      form.ownerFullName = data.fullName
      form.ownerPhone = data.phone
      form.ownerGender = data.gender ?? null
      form.ownerNewAddress = data.newAddress || ''
      form.ownerOldAddress = data.oldAddress || ''

      // 🔴 CHỐT: chỉ show message khi KHÔNG hydrate
      if (!silent && !isHydrating.value) {
        ownerLookupMessage.value = 'Tìm thấy chủ tài sản thành công'
      }
    } else {
      form.ownerId = null
      form.ownerFullName = ''
      form.ownerPhone = ''
      if (!isHydrating.value) {
        ownerLookupMessage.value = 'Không tìm thấy chủ tài sản với thông tin đã nhập'
      }
    }
  } catch (e) {
    if (!isHydrating.value) {
      ownerLookupMessage.value = 'Lỗi khi tìm kiếm chủ tài sản'
    }
  }
}

const handleManagerLookup = async ({ silent = false } = {}) => {
  if (!silent) {
    managerLookupMessage.value = ''
  }
  if (!managerSearch.value) {
    if (!silent) {
      errors.managerSearch = 'Nhập phone hoặc email để tìm kiếm'
    }
    return
  }
  errors.managerSearch = ''

  try {
    const { data } = await api.get('/admin.thg/product/admin/tim-chu-tai-san', {
      params: {
        search: managerSearch.value,
        phanLoaiHang: form.phanLoaiHang,
      },
    })

    if (data) {
      form.nguoiQuanLyID = data.id
      managerInfo.fullName = data.fullName
      managerInfo.phone = data.phone

      if (!silent && !isHydrating.value) {
        managerLookupMessage.value = 'Tìm thấy người quản lý thành công'
      }
    } else {
      form.nguoiQuanLyID = null
      managerInfo.fullName = ''
      managerInfo.phone = ''
      if (!isHydrating.value) {
        managerLookupMessage.value = 'Không tìm thấy người quản lý với thông tin đã nhập'
      }
    }
  } catch (e) {
    if (!isHydrating.value) {
      managerLookupMessage.value = 'Lỗi khi tìm kiếm người quản lý'
    }
  }
}

const handleNonSystemOwnerLookup = async ({ silent = false } = {}) => {
  if (!silent) {
    nonSystemLookupMessage.value = ''
  }
  nonSystemExistingOwner.value = null
  const phone = nonSystemOwnerSearch.value.trim()
  if (!phone) {
    if (!silent) {
      errors.nonSystemOwnerSearch = 'Nhập số điện thoại để tìm kiếm'
    }
    return
  }
  if (!/^[0-9]{9,11}$/.test(phone.replace(/\s+/g, ''))) {
    if (!silent) {
      errors.nonSystemOwnerSearch = 'Số điện thoại không hợp lệ'
    }
    return
  }
  errors.nonSystemOwnerSearch = ''
  try {
    const { data } = await api.get('/thg.user/my-land/tim-chu-nha-tam', {
      params: { phone },
    })
    if (data && data.id) {
      nonSystemExistingOwner.value = data
      form.ownerId = data.id
      form.ownerFullName = data.fullName || ''
      form.ownerPhone = data.phone || ''
      form.ownerGender = data.gender ?? null
      form.ownerNewAddress = data.newAddress || ''
      form.ownerOldAddress = data.oldAddress || ''
      if (!silent) {
        nonSystemLookupMessage.value = 'Tìm thấy chủ tài sản thành công'
      }
    } else {
      form.ownerId = null
      form.ownerFullName = ''
      form.ownerPhone = ''
      nonSystemLookupMessage.value = 'Không tìm thấy chủ tài sản'
    }
  } catch (e) {
    nonSystemLookupMessage.value = 'Lỗi khi tìm kiếm chủ tài sản'
  }
}

const handleNguoiBanLookup = async ({ silent = false } = {}) => {
  if (!form.nguoiBanSearch) {
    if (!silent) {
      errors.nguoiBanSearch = 'Nhập email hoặc số điện thoại'
    }
    return
  }

  errors.nguoiBanSearch = ''

  try {
    const { data } = await api.get(
      '/admin.thg/product/admin/tim-nguoi',
      {
        params: { search: form.nguoiBanSearch }
      }
    )

    if (data) {
      form.nguoiBanId = data.id
      form.nguoiBanTen = data.fullName || data.name
    } else {
      form.nguoiBanId = null
      form.nguoiBanTen = ''
      errors.nguoiBanSearch = 'Không tìm thấy người bán'
    }
  } catch (e) {
    errors.nguoiBanSearch = 'Lỗi tìm người bán'
  }
}

const hydrateForm = (data) => {
  isHydrating.value = true
  const sellerSearch =
    data.nguoiBanEmail ||
    data.emailNguoiBan ||
    data.nguoiBanSearch ||
    data.sellerEmail ||
    ''
  Object.assign(form, {
    ...data,
    ownerFullName: data.ownerFullName || data.ownerName || '',
    ownerPhone: data.ownerPhone || '',
    ownerMode: data.ownerMode || 'system',
    ownerOption: data.ownerOption || 'existing',
    ownerGender: data.ownerGender ?? null,
    ownerNewAddress: data.ownerNewAddress || '',
    ownerOldAddress: data.ownerOldAddress || '',
    moTaNgan: data.moTaNgan || '',
    rooms: data.rooms && data.rooms.length ? data.rooms : [defaultRoom()],
    nguoiBanSearch: sellerSearch || data.nguoiBanSearch || '',
    ngayBan: formatDateForInput(data.ngayBan),
    files: data.files || [],
    newFiles: [],
    newLandBookFiles: [],
    deletedFileIds: [],
    deletedLandBookFileIds: [],
  })
  ownerMode.value = form.ownerMode
  nonSystemOwnerOption.value = form.ownerOption
  ownerSearch.value = ''
  ownerLookupMessage.value = ''
  nonSystemOwnerSearch.value = ''
  nonSystemLookupMessage.value = ''
  managerSearch.value = ''
  managerLookupMessage.value = ''
  managerInfo.fullName = ''
  managerInfo.phone = ''
  Object.assign(nonSystemNewOwner, {
    fullName: form.ownerFullName,
    phone: form.ownerPhone,
    gender: form.ownerGender ?? null,
    newAddress: form.ownerNewAddress || '',
    oldAddress: form.ownerOldAddress || '',
  })
  originalFiles.value = JSON.parse(JSON.stringify(form.files || []))
  addressKey.value += 1
  isHydrating.value = false
}

const prefillOwnerAndManager = async () => {
  const ownerPhone = (form.ownerPhone || '').trim()
  if (ownerPhone) {
    if (form.ownerMode === 'system') {
      ownerSearch.value = ownerPhone
      await handleOwnerLookup({ silent: true })
    } else if (form.ownerMode === 'nonSystem' && form.ownerOption === 'existing') {
      nonSystemOwnerSearch.value = ownerPhone
      await handleNonSystemOwnerLookup({ silent: true })
    }
  }

  const managerPhone = (
    form.nguoiQuanLyPhone ||
    form.nguoiQuanLySdt ||
    form.managerPhone ||
    form.managerPhoneNumber ||
    ''
  ).toString().trim()

  if (managerPhone) {
    managerSearch.value = managerPhone
    await handleManagerLookup({ silent: true })
  }
}

const prefillSeller = async () => {
  if (form.status !== 'Đã bán') return
  const sellerSearch = (form.nguoiBanSearch || '').trim()
  if (!sellerSearch) return
  await handleNguoiBanLookup({ silent: true })
}

const loadAssetDetail = async () => {
  try {
    const res = await api.get(`/admin.thg/product/admin/chi-tiet/${assetId}`)
    asset.value = res.data
    hydrateForm(asset.value)
    await prefillOwnerAndManager()
    await prefillSeller()
  } catch (error) {
    updateAlertError('Không thể tải dữ liệu tài sản!')
  }
}

import { confirmYesNo } from "../../assets/js/alertService.js";

const resetForm = async () => {
  await confirmYesNo(
      'Xác nhận đặt lại',
      'Bạn có chắc muốn <b>đặt lại tất cả thay đổi</b>?',
      () => {
        if (asset.value) {
          hydrateForm(asset.value)
          prefillOwnerAndManager()
        }

        activeTab.value = 'basic'

        Object.keys(errors).forEach(k => {
          errors[k] = ''
        })
      }
  )
}


const buildFormData = () => {
  const dto = {
    ...form,
    address: form.address,
    khuVucMa: form.address.split('/!!')[2],
    rooms: isHouse.value ? form.rooms : [],
    newFiles: undefined,
    newLandBookFiles: undefined,
  }

  const fd = new FormData()

  fd.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  )

  const mainFile = form.newFiles.find((file) => file?.isOnTop && file.file instanceof File)
    || form.newLandBookFiles.find((file) => file?.isOnTop && file.file instanceof File)

  if (mainFile) {
    fd.append('newFileOntop', mainFile.file)
  }

  form.newFiles.forEach((file) => {
    if (file?.file instanceof File) {
      fd.append('newFiles', file.file)
    }
  })

  form.newLandBookFiles.forEach((file) => {
    if (file?.file instanceof File) {
      fd.append('newLandBookFiles', file.file)
    }
  })

  return fd
}

const submitForm = async () => {
  ownerLookupMessage.value = ''
  if (!validateForm()) {
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      activeTab.value = findTabForField(firstError)
      const element = document.querySelector(`[v-model="${firstError}"]`) || document.querySelector(`select[v-model="${firstError}"]`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  isSubmitting.value = true
  try {
    const payload = buildFormData()

    const res = await showLoading(
      api.post(`/admin.thg/product/admin/cap-nhat/${assetId}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )

    if (res.status === 200) {
      updateAlertSuccess('Cập nhật dữ liệu thành công', 'Hệ thống đã ghi nhận!')
      router.back()
    }
  } catch (e) {
    updateAlertError('Không thể cập nhật sản phẩm, vui lòng thử lại sau!')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await loadAssetDetail()
})
</script>

<style scoped>
.card {
  border-radius: 12px;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.section-icon {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 12px;
}

.tab-navigation .nav-tabs {
  border-bottom: 1px solid #dee2e6;
  gap: 4px;
}

.tab-navigation .nav-link {
  border: 1px solid transparent;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  background: #f1f3f5;
  color: #495057;
  font-weight: 600;
  padding: 10px 16px;
  transition: all 0.2s ease;
}

.tab-navigation .nav-link.completed {
  background: #e7f1ff;
  color: #1d4ed8;
}

.tab-navigation .nav-link.pending {
  opacity: 0.6;
}

.tab-navigation .nav-link.active {
  background: #ffffff;
  border-color: #dee2e6;
  border-bottom-color: #ffffff;
  color: #111827;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

.tab-panel {
  border: 1px solid #dee2e6;
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 24px;
  background: #fff;
  margin-top: -1px;
}

.tab-actions {
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
}

.owner-mode-switch {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.owner-mode-card {
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 20px;
  background: #f8fafc;
}

.owner-info-card {
  border-radius: 16px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.12);
}

.owner-info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}

.owner-info-body {
  padding: 16px;
}

.owner-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.owner-meta {
  font-size: 0.95rem;
  color: #1e293b;
  margin-bottom: 4px;
}

.owner-note {
  font-size: 0.85rem;
}

.bg-primary-light { background-color: rgba(13, 110, 253, 0.1); }
.bg-success-light { background-color: rgba(25, 135, 84, 0.1); }
.bg-warning-light { background-color: rgba(255, 193, 7, 0.1); }
.bg-info-light { background-color: rgba(13, 202, 240, 0.1); }
.bg-danger-light { background-color: rgba(220, 53, 69, 0.1); }
.bg-secondary-light { background-color: rgba(108, 117, 125, 0.1); }

.icon-circle-admin {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.from-control{
  border-radius: 10px !important;
}

.form-control:readonly {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-control-md {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.table th {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d;
}

.room-row:hover {
  background-color: #f8f9fa;
}

.breadcrumb {
  background-color: transparent;
  padding: 0;
}

.breadcrumb-item a {
  color: #6c757d;
  transition: color 0.2s;
}

.breadcrumb-item a:hover {
  color: #4361ee;
}

.breadcrumb-item.active {
  color: #212529;
  font-weight: 500;
}

.alert-warning.bg-warning-light {
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.badge {
  padding: 0.35em 0.65em;
  font-size: 0.75em;
}

.form-label i {
  min-width: 18px;
  text-align: center;
}

.text-primary { color: #4361ee !important; }
.text-success { color: #28a745 !important; }

.short-description-card {
  background: #f7f9ff;
  border: 1px solid rgba(67, 97, 238, 0.15);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.08);
}

.short-description-input {
  border-radius: 10px;
  border-color: rgba(67, 97, 238, 0.2);
  resize: vertical;
  min-height: 120px;
}
.text-warning { color: #ffc107 !important; }
.text-info { color: #17a2b8 !important; }
.text-danger { color: #dc3545 !important; }
.text-secondary { color: #6c757d !important; }

.form-control:focus, .form-select:focus {
  border-color: #4361ee;
  box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #4361ee, #3a0ca3);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #3a56d4, #2a0a7a);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .form-label {
    font-size: 0.875rem;
  }

  .form-label i {
    font-size: 0.75rem;
  }
}
</style>
