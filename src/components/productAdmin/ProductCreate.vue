<template>
  <div class="container-fluid px-4 py-3">
    <!-- Header với Breadcrumb -->
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-2">
            <li class="breadcrumb-item">
              <a href="#" class="text-decoration-none" @click.prevent="$router.back()">
                <i class="fas fa-home me-1"></i>Dashboard
              </a>
            </li>
            <li class="breadcrumb-item">
              <a href="#" class="text-decoration-none">Quản lý tài sản</a>
            </li>
            <li class="breadcrumb-item active">Tạo mới tài sản</li>
          </ol>
        </nav>
        <div class="d-flex align-items-center gap-3">
          <div class="icon-circle-admin">
            <i class="fas fa-city fs-4"></i>
          </div>
          <div>
            <h1 class="h3 mb-1 fw-bold text-dark">Tạo mới tài sản</h1>
            <p class="text-muted mb-0">Thêm tài sản mới vào hệ thống quản lý</p>
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
        <button type="button" class="btn btn-primary d-flex align-items-center gap-2 px-4" :disabled="isSubmitting" @click="submitForm">
          <i class="fas fa-save"></i><span>{{ isSubmitting ? 'Đang xử lý...' : 'Lưu tài sản' }}</span>
        </button>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <form @submit.prevent>
                    <!-- Thông tin cơ bản -->
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
                  <span>Loại tài sản <span class="text-danger">*</span></span>
                </label>
                <select class="form-select form-select-md" v-model="form.loaiTaiSan">
                  <option value="">-- Chọn loại tài sản --</option>
                  <option value="NHA">Nhà</option>
                  <option value="DAT">Đất</option>
                  <option value="DATLON">Đất lớn</option>
                </select>
                <small v-if="errors.loaiTaiSan" class="text-danger">{{ errors.loaiTaiSan }}</small>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-tag text-success"></i>
                  <span>Giá bán <span class="text-danger">*</span></span>
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
                  <span>Phân loại hàng <span class="text-danger">*</span></span>
                </label>
                <select class="form-select form-select-md" v-model="form.phanLoaiHang">
                  <option value="">-- Chọn phân loại --</option>
                  <option value="BN30N">Bán nhanh 30 ngày</option>
                  <option value="HOPTAC">Hợp tác</option>
                  <option value="HTT">Hàng thị trường</option>
                </select>
                <small v-if="errors.phanLoaiHang" class="text-danger">{{ errors.phanLoaiHang }}</small>
              </div>

              <div class="col-md-2">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-university text-info"></i>
                  <span>Đơn vị sở hữu <span class="text-danger">*</span></span>
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
                  <span>Giá nội bộ</span>
                </label>
                <div class="input-group input-group-md">
                  <span class="input-group-text bg-light"><i class="fas fa-eye"></i></span>
                  <input type="number" min="0" step="1000000" class="form-control" v-model.number="form.giaNoiBo" placeholder="Giá nội bộ">
                  <span class="input-group-text bg-light">VNĐ</span>
                </div>
                <small v-if="form.giaNoiBo" class="text-info fw-medium mt-1 d-block">
                  <i class="fas fa-chart-line me-1"></i>{{ formatMoneyVN(form.giaNoiBo) }}
                </small>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-bullseye text-danger"></i>
                  <span>Kỳ vọng</span>
                </label>
                <div class="input-group input-group-md">
                  <span class="input-group-text"><i class="fas fa-chart-line"></i></span>
                  <input  type="number" min="0" step="1000000" class="form-control" v-model.number="form.desire">
                  <span class="input-group-text bg-light">VNĐ</span>
                </div>
                <small v-if="form.desire" class="text-info fw-medium mt-1 d-block">
                  <i class="fas fa-chart-line me-1"></i>{{ formatMoneyVN(form.desire) }}
                </small>
              </div>

              <div class="col-md-2">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-percentage text-warning"></i>
                  <span>Phí môi giới (%)</span>
                </label>
                <div class="input-group input-group-md">
                  <input list="phiMoiGiois" type="number" min="0" max="100" step="0.1" class="form-control" v-model.number="form.phiMoiGioi">
                  <datalist id="phiMoiGiois">
                    <option value="1"></option>
                    <option value="1.5"></option>
                    <option value="2"></option>
                    <option value="2.5"></option>
                  </datalist>
                  <span class="input-group-text"><i class="fas fa-handshake"></i></span>
                </div>
              </div>

              <div class="col-md-2">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-eye text-primary"></i>
                  <span>Hiển thị</span>
                </label>
                <select class="form-select form-select-md" v-model="form.show">
                  <option :value="true">Hiển thị</option>
                  <option :value="false">Ẩn</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Địa chỉ &amp; vị trí -->
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
              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-map-marker-alt text-danger"></i>
                  <span>Tỉnh/Thành phố <span class="text-danger">*</span></span>
                </label>
                <select class="form-select form-select-md" v-model="formAddress.province">
                  <option value="">-- Chọn Tỉnh/TP --</option>
                  <option v-for="province in provinceOptions" :key="province.code" :value="province.name">{{ province.name }}</option>
                </select>
                <small v-if="errors.address" class="text-danger">{{ errors.address }}</small>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-map-pin text-success"></i>
                  <span>Xã/Phường<span class="text-danger">*</span></span>
                </label>
                <select class="form-select form-select-md" v-model="formAddress.ward" :disabled="!formAddress.province">
                  <option value="">-- Chọn khu vực --</option>
                  <option v-for="ward in wardOptions" :key="ward.name" :value="ward.name">{{ ward.name }}</option>
                </select>
                <small v-if="errors.address" class="text-danger">{{ errors.address }}</small>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-road text-secondary"></i>
                  <span>Số nhà, đường <span class="text-danger">*</span></span>
                </label>
                <input type="text" class="form-control form-control-md" v-model.trim="formAddress.street" placeholder="Số nhà, tên đường">
                <small v-if="errors.address" class="text-danger">{{ errors.address }}</small>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-map-pin text-primary"></i>
                  <span>Vị trí đất</span>
                </label>

                <input
                    list="landPositions"
                    type="text"
                    class="form-control form-control-md"
                    v-model.trim="form.landPosition"
                    placeholder="Mô tả vị trí tài sản( vd: hẻm, gần sông..v.v...)"
                >

                <datalist id="landPositions">
                  <option value="Mặt tiền đường chính"></option>
                  <option value="Mặt tiền quốc lộ"></option>
                  <option value="Mặt tiền tỉnh lộ"></option>
                  <option value="Mặt tiền nội bộ"></option>

                  <option value="Góc 2 mặt tiền"></option>
                  <option value="Góc 3 mặt tiền"></option>

                  <option value="Hẻm xe hơi"></option>
                  <option value="Hẻm xe hơi tránh nhau"></option>
                  <option value="Hẻm xe máy"></option>
                  <option value="Hẻm cụt"></option>

                </datalist>

              </div>


              <div class="col-md-8">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-history text-muted"></i>
                  <span>Địa chỉ cũ</span>
                </label>
                <input type="text" class="form-control form-control-md" v-model.trim="form.oldAddress" placeholder="Địa chỉ cũ (nếu có)">
              </div>
            </div>
          </section>

          <!-- Thông tin pháp lý &amp; diện tích -->
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
                  <span>Số thửa</span>
                </label>
                <input type="text" class="form-control form-control-md" v-model.trim="form.plotNumber" placeholder="Số thửa">
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-file-alt text-info"></i>
                  <span>Số tờ</span>
                </label>
                <input type="text" class="form-control form-control-md" v-model.trim="form.parcelNumber" placeholder="Số tờ">
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-expand-alt text-success"></i>
                  <span>Tổng diện tích (m²)</span>
                </label>
                <div class="input-group input-group-md">
                  <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.totalArea">
                  <span class="input-group-text"><i class="fas fa-ruler-combined"></i></span>
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-handshake text-warning"></i>
                  <span>Quan hệ sở hữu</span>
                </label>

                <input
                    type="text"
                    class="form-control form-control-md"
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
              </div>


              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-gavel text-danger"></i>
                  <span>Quyền sử dụng đất</span>
                </label>

                <input
                    type="text"
                    class="form-control form-control-md"
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
              </div>


              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-clipboard-check text-info"></i>
                  <span>Tình trạng</span>
                </label>
                <select class="form-select form-select-md" v-model="form.status">
                  <option value="">-- Chọn tình trạng --</option>
                  <option value="Chưa định giá sơ bộ">Mới</option>
                  <option value="Bán nhanh 30N">Bán nhanh 30 ngày</option>
                  <option value="Đã bán">Đã bán</option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-vector-square text-success"></i>
                  <span>Mặt tiền (m)</span>
                </label>
                <div class="input-group input-group-md">
                  <input type="number" min="0" class="form-control" v-model.number="form.matTienNha">
                  <span class="input-group-text"><i class="fas fa-home"></i></span>
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-arrows-alt-h text-primary"></i>
                  <span>Chiều ngang (m)</span>
                </label>
                <div class="input-group input-group-md">
                  <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.chieuNgang">
                  <span class="input-group-text"><i class="fas fa-ruler-horizontal"></i></span>
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-arrows-alt-v text-success"></i>
                  <span>Chiều dài (m)</span>
                </label>
                <div class="input-group input-group-md">
                  <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.chieuDai">
                  <span class="input-group-text"><i class="fas fa-ruler-vertical"></i></span>
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-search text-info"></i>
                  <span>Hiện trạng đất</span>
                </label>

                <input
                    type="text"
                    class="form-control form-control-md"
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
              </div>


              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-arrows-alt-h text-success"></i>
                  <span>Độ rộng đường (m)</span>
                </label>
                <div class="input-group input-group-md">
                  <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.doRongDuong">
                  <span class="input-group-text"><i class="fas fa-road"></i></span>
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-ruler-horizontal text-primary"></i>
                  <span>Lộ giới (m)</span>
                </label>
                <div class="input-group input-group-md">
                  <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.loGioi">
                  <span class="input-group-text"><i class="fas fa-ruler"></i></span>
                </div>
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-archway text-danger"></i>
                  <span>Hình dạng / Kết cấu</span>
                </label>
                <textarea class="form-control" v-model.trim="form.structure" rows="2" placeholder="Mô tả kết cấu công trình"></textarea>
              </div>
            </div>
          </section>
<!-- Thông tin nhà (Chỉ hiển thị khi là nhà) -->
          <section v-if="isHouse" class="mb-5">
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
                  <span>Diện tích sàn (m²)</span>
                </label>
                <div class="input-group input-group-md">
                  <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.floorArea">
                  <span class="input-group-text"><i class="fas fa-th-large"></i></span>
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-house-user text-success"></i>
                  <span>Loại nhà</span>
                </label>

                <input
                    type="text"
                    class="form-control form-control-md"
                    v-model.trim="form.loaiNha"
                    list="loaiNhaList"
                    placeholder="Loại nhà"
                >

                <datalist id="loaiNhaList">
                  <option value="Nhà cấp 4"></option>
                  <option value="Chung cư"></option>
                  <option value="Nhà 4 tầng"></option>
                  <option value="Nhà phố"></option>
                  <option value="Nhà biệt thự"></option>
                </datalist>
              </div>


              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-door-closed text-warning"></i>
                  <span>Tổng số phòng</span>
                </label>
                <input type="number" min="0" class="form-control form-control-md" v-model.number="form.tongSoPhong">
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-bed text-primary"></i>
                  <span>Số phòng ngủ</span>
                </label>
                <input type="number" min="0" class="form-control form-control-md" v-model.number="form.soPhongNgu">
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-bath text-info"></i>
                  <span>Số phòng tắm</span>
                </label>
                <input type="number" min="0" class="form-control form-control-md" v-model.number="form.soPhongTam">
              </div>

              <div class="col-md-2">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-layer-group text-primary"></i>
                  <span>Số lầu</span>
                </label>
                <input type="number" min="0" class="form-control form-control-md" v-model.number="form.soLau">
              </div>

              <div class="col-md-2">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-building text-info"></i>
                  <span>Số tầng</span>
                </label>
                <input type="number" min="0" class="form-control form-control-md" v-model.number="form.soTang">
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-couch text-warning"></i>
                  <span>Nội thất</span>
                </label>

                <input
                    type="text"
                    class="form-control form-control-md"
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
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-search text-primary"></i>
                  <span>Hiện trạng nhà</span>
                </label>

                <input
                    type="text"
                    class="form-control form-control-md"
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
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-calendar-alt text-info"></i>
                  <span>Năm xây dựng</span>
                </label>
                <input type="text" class="form-control form-control-md" v-model.trim="form.namXayDung" placeholder="Năm xây dựng">
              </div>

            </div>
          </section>

          <!-- Danh sách phòng -->
          <section v-if="isHouse" class="mb-5">
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
                    Loại phòng
                  </th>

                  <th class="ps-2" style="width: 15%;">
                    <i class="fas fa-hashtag me-2 text-info"></i>
                    Số lượng
                  </th>

                  <th class="ps-2" style="width: 15%;">
                    <i class="fas fa-expand-alt me-2 text-success"></i>
                    Diện tích (m²)
                  </th>

                  <th style="width: 45%;">
                    <i class="fas fa-comment-alt me-2 text-warning"></i>
                    Mô tả
                  </th>

                  <th class="text-center pe-4" style="width: 60px;">
                    <i class="fas fa-cog text-muted"></i>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(room, index) in form.rooms" :key="index" class="room-row">
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
                    />
                  </td>
                  <td class="text-center">
                    <div class="input-group input-group-sm">
                      <input type="number" min="0" step="0.01" class="form-control form-control-sm w-full" v-model.number="room.dienTich">
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
            </div>
          </section>

          <!-- Thông tin chủ tài sản -->
          <section class="mb-5">
            <div class="d-flex align-items-center mb-4 border-bottom pb-3">
              <div class="section-icon bg-danger-light">
                <i class="fas fa-user-tie text-danger"></i>
              </div>
              <div>
                <h2 class="h5 fw-bold mb-1">Thông tin chủ tài sản</h2>
                <p class="text-muted small mb-0">Thông tin người sở hữu tài sản</p>
              </div>
            </div>

            <div class="alert alert-warning border-warning bg-warning-light mb-4" v-if="isLookupMode">
              <div class="d-flex align-items-start">
                <i class="fas fa-info-circle mt-1 me-2 text-warning"></i>
                <div>
                  <p class="mb-1 fw-medium">Chế độ tìm kiếm chủ tài sản</p>
                  <p class="small mb-0">Đối với hạng "Hợp tác" và "Bán nhanh 30 ngày", hệ thống sẽ tự động tìm và khóa thông tin khi tìm thấy chủ tài sản.</p>
                </div>
              </div>
            </div>

            <div class="row g-4">
              <div class="col-md-4" v-if="isLookupMode">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-search text-primary"></i>
                  <span>Tìm chủ tài sản <span class="text-danger">*</span></span>
                </label>
                <div class="input-group input-group-md">
                  <span class="input-group-text bg-light"><i class="fas fa-search text-muted"></i></span>
                  <input type="text" class="form-control" v-model.trim="ownerSearch"
                         @blur="handleOwnerLookup"
                         placeholder="Nhập số điện thoại hoặc email">
                  <button class="btn btn-outline-secondary" type="button" @click="handleOwnerLookup">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
                <div v-if="ownerLookupMessage" class="mt-2">
                  <div :class="['alert', ownerLookupMessage.includes('thành công') ? 'alert-success' : 'alert-danger', 'py-2 small']">
                    <i :class="ownerLookupMessage.includes('thành công') ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
                    {{ ownerLookupMessage }}
                  </div>
                </div>
                <small v-if="errors.ownerSearch" class="text-danger">{{ errors.ownerSearch }}</small>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-user text-success"></i>
                  <span>Họ tên chủ <span class="text-danger">*</span></span>
                </label>
                <div class="input-group input-group-md">
                  <span class="input-group-text bg-light"><i class="fas fa-user text-muted"></i></span>
                  <input type="text" class="form-control" v-model.trim="form.ownerFullName"
                         :readonly="isLookupMode && form.ownerId"
                         :class="{'bg-light': isLookupMode && form.ownerId}"
                         placeholder="Họ và tên đầy đủ">
                </div>
                <small v-if="errors.ownerFullName" class="text-danger">{{ errors.ownerFullName }}</small>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold d-flex align-items-center gap-2">
                  <i class="fas fa-phone text-info"></i>
                  <span>Số điện thoại <span class="text-danger">*</span></span>
                </label>
                <div class="input-group input-group-md">
                  <span class="input-group-text bg-light"><i class="fas fa-phone text-muted"></i></span>
                  <input type="text" class="form-control" v-model.trim="form.ownerPhone"
                         :readonly="isLookupMode && form.ownerId"
                         :class="{'bg-light': isLookupMode && form.ownerId}"
                         placeholder="Số điện thoại liên hệ">
                </div>
                <small v-if="errors.ownerPhone" class="text-danger">{{ errors.ownerPhone }}</small>
              </div>
            </div>
          </section>

          <!-- Upload hồ sơ -->
          <section class="mb-4">
            <div class="d-flex align-items-center mb-4 border-bottom pb-3">
              <div class="section-icon bg-secondary-light">
                <i class="fas fa-paperclip text-secondary"></i>
              </div>
              <div>
                <h2 class="h5 fw-bold mb-1">Tệp đính kèm</h2>
                <p class="text-muted small mb-0">Quản lý hồ sơ tài liệu</p>
              </div>
            </div>
            <FileOrLand
                :file-list="uploadedFiles"
                :entity-id="0"
                entity-type="land"
                :canEdit="true"
                :onUpload="true"
                :allowDownloadAll="false"
                @update:files="handleFileUpdate"
            />
          </section>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import api from '/src/api/api.js'
import FileOrLand from '../land/FileOrLand.vue'
import addressData from '/src/assets/js/address.json'

// Format money function
function formatMoneyVN(value) {
  if (value == null || isNaN(value)) return "0";
  const num = Number(value);

  if (num < 1_000_000) {
    return num.toLocaleString("vi-VN") + " VNĐ";
  }

  if (num < 1_000_000_000) {
    const trieu = num / 1_000_000;
    return `${trieu.toFixed(trieu % 1 === 0 ? 0 : 1)} triệu`;
  }

  const ty = num / 1_000_000_000;
  return `${ty.toFixed(ty % 1 === 0 ? 0 : 2)} tỷ`;
}

const defaultRoom = () => ({ loaiPhong: '', soLuong: null, dienTich: null, moTa: '' })

const form = reactive({
  oldAddress: '',
  plotNumber: '',
  parcelNumber: '',
  totalArea: null,
  ownershipRelation: '',
  landUseRight: '',
  landPosition: '',
  status: '',
  desire: null,
  show: true,
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
  hinhDangThuaDat: '',
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
  rooms: [defaultRoom()],
})

const formAddress = reactive({ street: '', ward: '', province: '' })
const uploadedFiles = ref([])

const errors = reactive({})
const ownerSearch = ref('')
const ownerLookupMessage = ref('')
const isSubmitting = ref(false)

const provinces = addressData || []
const provinceOptions = computed(() => provinces)
const selectedProvince = computed(() => provinceOptions.value.find((p) => normalizeText(p.name) === normalizeText(formAddress.province)))
const wardOptions = computed(() => selectedProvince.value?.wards || [])
const isHouse = computed(() => form.loaiTaiSan === 'NHA')
const isLookupMode = computed(() => ['HOPTAC', 'BN30N'].includes(form.phanLoaiHang))

// Helper functions
const getLoaiTaiSanText = (value) => {
  const map = { 'NHA': 'Nhà', 'DAT': 'Đất', 'DATLON': 'Đất lớn' }
  return map[value] || 'Chưa chọn'
}

const getPhanLoaiText = (value) => {
  const map = { 'BN30N': 'Bán nhanh 30 ngày', 'HOPTAC': 'Hợp tác', 'HTT': 'Hàng thị trường' }
  return map[value] || 'Chưa chọn'
}

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

watch(
    () => formAddress.province,
    (newProvince) => {
      const province = provinceOptions.value.find((p) => normalizeText(p.name) === normalizeText(newProvince))
      if (!province) {
        formAddress.ward = ''
        return
      }
      const wardStillValid = province.wards.find((ward) => normalizeText(ward.name) === normalizeText(formAddress.ward))
      if (!wardStillValid) {
        formAddress.ward = ''
      }
    }
)

watch(() => form.phanLoaiHang, () => {
  ownerLookupMessage.value = ''
  errors.ownerSearch = ''
  if (isLookupMode.value) {
    form.ownerFullName = ''
    form.ownerPhone = ''
    form.ownerId = null
  }
})

const addRoom = () => {
  form.rooms.push(defaultRoom())
}

const removeRoom = (index) => {
  if (form.rooms.length > 1) form.rooms.splice(index, 1)
}

const handleFileUpdate = (files) => {
  uploadedFiles.value = Array.isArray(files) ? files : []
}

const normalizeText = (value) => (value || '').toString().trim().toLowerCase()

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  if (!form.loaiTaiSan) {
    errors.loaiTaiSan = 'Bắt buộc chọn loại tài sản'
    isValid = false
  }

  if (!form.phanLoaiHang) {
    errors.phanLoaiHang = 'Bắt buộc chọn phân loại'
    isValid = false
  }

  if (!form.donViSoHuu) {
    errors.donViSoHuu = 'Chọn đơn vị sở hữu'
    isValid = false
  }

  if (!form.giaBan && form.giaBan !== 0) {
    errors.giaBan = 'Vui lòng nhập giá bán'
    isValid = false
  }

  if (!formAddress.street || !formAddress.ward || !formAddress.province) {
    errors.address = 'Vui lòng nhập đầy đủ địa chỉ'
    isValid = false
  }

  if (!isLookupMode.value) {
    if (!form.ownerFullName) {
      errors.ownerFullName = 'Nhập họ tên chủ'
      isValid = false
    }
    if (!form.ownerPhone) {
      errors.ownerPhone = 'Nhập số điện thoại'
      isValid = false
    }
  } else if (!ownerSearch.value) {
    errors.ownerSearch = 'Nhập phone hoặc email để tìm kiếm'
    isValid = false
  }

  return isValid
}

const handleOwnerLookup = async () => {
  ownerLookupMessage.value = ''
  if (!isLookupMode.value) return
  if (!ownerSearch.value) {
    errors.ownerSearch = 'Nhập phone hoặc email để tìm kiếm'
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
      ownerLookupMessage.value = 'Tìm thấy chủ tài sản thành công'
    } else {
      ownerLookupMessage.value = 'Không tìm thấy chủ tài sản với thông tin đã nhập'
    }
  } catch (e) {
    ownerLookupMessage.value = 'Lỗi khi tìm kiếm chủ tài sản'
  }
}

const resetForm = () => {
  Object.assign(form, {
    oldAddress: '',
    plotNumber: '',
    parcelNumber: '',
    totalArea: null,
    ownershipRelation: '',
    landUseRight: '',
    landPosition: '',
    status: '',
    desire: null,
    show: true,
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
    hinhDangThuaDat: '',
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
    rooms: [defaultRoom()],
  })
  Object.assign(formAddress, { street: '', ward: '', province: '' })
  ownerSearch.value = ''
  ownerLookupMessage.value = ''
  uploadedFiles.value = []
  Object.keys(errors).forEach((k) => (errors[k] = ''))
}

const buildFormData = () => {
  const addressPayload = [formAddress.street, formAddress.ward, formAddress.province].join('/!!')
  const dto = {
    ...form,
    address: addressPayload,
    khuVucMa: formAddress.province || form.khuVucMa,
    rooms: isHouse.value ? form.rooms : [],
  }
  const fd = new FormData()
  fd.append('dto',  new Blob( [JSON.stringify(dto)], { type: "application/json" }));
  uploadedFiles.value.forEach((file) => {
    if (file.file instanceof File) {
      const key = file.isIG ? 'newLandBookFiles' : 'newFiles'
      fd.append(key, file.file)
    }
  })
  return fd
}

const submitForm = async () => {
  ownerLookupMessage.value = ''
  if (!validateForm()) {
    // Scroll to first error
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      const element = document.querySelector(`[v-model="${firstError}"]`) || document.querySelector(`select[v-model="${firstError}"]`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  isSubmitting.value = true
  try {
    const payload = buildFormData()
    await api.post('/admin.thg/product/admin/tao-moi', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    alert('Tạo tài sản thành công!')
    resetForm()
  } catch (e) {
    alert('Không thể tạo tài sản, vui lòng thử lại')
  } finally {
    isSubmitting.value = false
  }
}
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

/* Color coding for different field types */
.text-primary { color: #4361ee !important; }
.text-success { color: #28a745 !important; }
.text-warning { color: #ffc107 !important; }
.text-info { color: #17a2b8 !important; }
.text-danger { color: #dc3545 !important; }
.text-secondary { color: #6c757d !important; }

/* Hover effects for interactive elements */
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .form-label {
    font-size: 0.875rem;
  }

  .form-label i {
    font-size: 0.75rem;
  }
}
</style>