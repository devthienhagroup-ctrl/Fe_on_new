<template>

  <div v-if="asset" class="executive-container" style="padding-top: 90px !important;">

    <!-- HEADER CARD -->
    <div class="executive-header">
      <div class="header-top">
        <div class="header-left">
          <button class="back-button" @click="router.back()">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Quay lại danh sách</span>
          </button>

          <div class="property-title-section">
            <h1 class="property-address">{{   buildSeoTitle( asset ) ?? 'Chưa cập nhật' }}</h1>

            <div class="flex justify-between">
            <div class="property-meta">
                <span class="meta-item">
                  <span class="meta-label">Loại mặt hàng:</span>
                  <span :class="['property-badge', badgeClass(asset.phanLoaiHang)]">
                    {{ asset.phanLoaiHang ?? 'Chưa cập nhật' }}
                  </span>
                </span>

              <div class="meta-divider"></div>

              <span class="meta-item">
                  <span class="meta-label">Giá bán:</span>
                  <span class="price-selling">{{  formatMoneyVN(asset.giaBan) ?? 'Chưa cập nhật' }}</span>
                </span>

              <div class="meta-divider"></div>

              <span class="meta-item">
                  <span class="meta-label">Giá nội bộ:</span>
                   <span class="price-internal block">
                       {{ asset.giaNoiBo === -1.1 ? '**********' : (formatMoneyVN(asset.giaNoiBo) ?? 'Chưa cập nhật') }}
                </span>
                </span>
            </div>
              <ReportProduct :listing-id="id"/>
            </div>

            <div class="press-hero">
              <div class="press-top-row">
                <div class="press-badge">
                  <i class="fa-solid fa-newspaper"></i>
                  <span>Ấn phẩm dành cho môi giới</span>
                </div>
                <div class="press-time">
                  <DotLottieVue
                      src="https://lottie.host/61153ea4-8b80-495a-a839-ab5f1ce029e6/dJBFFfgOe4.lottie"
                      autoplay
                      loop
                      style="
                            width: 40px;
                            height: 40px;
                            display: inline-block;
                            vertical-align: bottom;
                          "
                  />
                  <span>Tin nhanh | Cập nhật mới nhất</span>
                </div>
              </div>

              <p class="press-lede">
                {{ formatAddress(asset.address) ?? 'Chưa cập nhật' }} đang mở chào bán với mức giá cạnh tranh, pháp lý minh bạch và quỹ hoa hồng hấp dẫn. Mọi thông tin được biên tập theo định dạng tạp chí để anh/chị môi giới dễ tư vấn và chốt khách.
              </p>
              <p class="press-lede" v-html="asset.moTaNgan">
              </p>
              <div class="commission-spotlight">
                <div class="spotlight-badge">
                  <i class="fa-solid fa-sparkles"></i>
                  Ưu tiên cộng đồng môi giới
                </div>
                <div class="spotlight-copy">
                  <div class="spotlight-line">
                    <span v-if="asset.status !== 'Đã bán'">Anh/chị </span>
                    <span v-else>Ngày {{ formatNgayBan(asset.ngayBan) }} <span style="color: #fc2727; font-weight: 800">{{ asset.nguoiBan }}</span> đã </span>
                    chốt căn này <span v-if="asset.status === 'Đã bán'"> với giá {{  formatMoneyVN(asset.giaBanThanhCong) }} </span> nhận trọn
                    <span class="spotlight-percent">
                    {{ asset.phiMoiGioi != null ? asset.phiMoiGioi + '%' : 'Chưa cập nhật' }}
                    </span> hoa hồng</div>
                  <div class="spotlight-line">
                    Tương đương <span class="spotlight-amount"> <DotLottieVue
                      src="https://lottie.host/8d71de76-976c-465c-89a2-4566dab2a452/hAewJBkGNO.lottie"
                      autoplay
                      loop
                      style="
                            width: 30px;
                            height: 30px;
                            display: inline-block;
                            vertical-align: bottom;
                          "
                    />{{
                      tinhHoaHong(asset) != null
                          ? formatMoneyVN(tinhHoaHong(asset))
                          : 'Chưa cập nhật'
                    }}</span>
                    được giải ngân nhanh<span v-if="asset.status !== 'Đã bán'">, không để anh/chị chờ đợi.</span>
                  </div>
                </div>
                <div class="spotlight-wave"></div>
              </div>

              <div class="press-grid">
                <div class="press-card">
                  <span class="press-label">Giá công bố</span>
                  <span class="press-value">
                       {{ formatMoneyVN(asset.giaBan) ?? 'Chưa cập nhật' }}
                    <DotLottieVue
                      src="https://lottie.host/87fdfae5-3796-4026-b945-4a0e36bedcb6/r8ftGwOC5C.lottie"
                      autoplay
                      loop
                      style="
                            width: 35px;
                            height: 35px;
                            display: inline-block;
                            vertical-align: bottom;
                          "
                  /></span>
                  <span class="press-desc">Cập nhật theo bảng giá mới nhất</span>
                </div>
                <div class="press-card">
                  <span class="press-label">Giá nội bộ</span>
                  <span class="press-value text-primary mt-2">
                      {{ asset.giaNoiBo === -1.1 ? '*******' : (formatMoneyVN(asset.giaNoiBo) ?? 'Chưa cập nhật') }}
                    </span>
                  <span class="press-desc">Giá chốt hợp đồng tối thiểu</span>
                </div>
                <div class="press-card">
                  <span class="press-label">Diện tích</span>
                    <span class="press-value mt-2">{{ formatArea(asset.totalArea) ?? 'Chưa cập nhật' }}</span>
                  <span class="press-desc">Diện tích sẵn sàng bàn giao</span>
                </div>
                <div class="press-card press-commission-card">
                  <span class="press-label">Hoa hồng</span>
                  <span class="press-value press-commission">
                    <DotLottieVue
                        src="https://lottie.host/0d33a3ef-36a8-4096-af70-3c1668b578d9/1eeRku3lYw.lottie"
                        autoplay
                        loop
                        style="
                            width: 35px;
                            height: 35px;
                            display: inline-block;
                            vertical-align: middle;
                          "
                    /><span style="position: relative; top:5px">{{ asset.phiMoiGioi != null ? asset.phiMoiGioi + '%' : 'Chưa cập nhật' }}</span>

                  </span>
                  <span class="press-desc">Cam kết chi trả rõ ràng, minh bạch</span>
                </div>
              </div>

              <div v-if="!asset.daMoKhoa" class="press-cta">
                <div class="press-quote">
                  "Mở khóa ngay để xem thông tin liên hệ và dữ liệu nội bộ chi tiết về sản phẩm!"
                </div>
                <!-- Nút mở khóa toàn khối -->
                <button
                    @click="handleUnlock( asset )"
                    class="unlock-button-glow w-full text-left relative overflow-hidden group" style="max-width: 300px"
                >
                  <span class="unlock-shine"></span>

                  <div class="contact-icon z-10">
                    <DotLottieVue
                        src="https://lottie.host/68218690-b607-4da9-9c9a-f75270cf5854/DH5nYNGUkY.lottie"
                        autoplay
                        loop
                        style="
                            width: 60px;
                            height: 60px;
                            display: inline-block;
                            vertical-align: bottom;
                            position: relative;
                            top: -10px;
                            left: -9px;
                          "
                    />
                  </div>
                  <div class="z-10">
                    <div class="contact-title font-semibold">
                      Mở khóa ngay
                    </div>
                  </div>
                </button>



              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN CONTENT GRID -->
    <div class="content-grid" >

      <!-- LEFT COLUMN - GALLERY -->
      <div class="gallery-section" >
        <div class="gallery-wrapper" >
          <!-- ====== ẢNH CHÍNH ====== -->
          <div class="main-image-container" >
            <!-- 🔓 ĐÃ MỞ KHÓA -->
            <img
                v-if="asset.daMoKhoa"
                :src="asset.slide[activeImage]"
                alt="Property image"
                class="main-image"
            />

            <!-- 🔒 CHƯA MỞ KHÓA -->
            <img
                v-else
                :src="lockedImage"
                alt="Locked property image"
                class="main-image"
            />

            <div class="image-counter">
              <template v-if="asset.daMoKhoa">
                {{ activeImage + 1 }} / {{ asset.slide.length }}
              </template>
              <template v-else>
                1 / {{asset.soLuongFile}}
              </template>
            </div>
          </div>

          <!-- ====== THUMBNAILS (CHỈ KHI ĐÃ MỞ) ====== -->
          <div
              v-if="asset.daMoKhoa"
              class="thumbnails-container"
          >
            <div class="thumbnails-scroll">
              <img
                  v-for="(img, i) in asset.slide"
                  :key="i"
                  :src="img"
                  @click="activeImage = i"
                  :class="['thumbnail', { 'thumbnail-active': activeImage === i }]"
                  alt="Thumbnail"
              />
            </div>
          </div>
          <div
              v-if="!asset.daMoKhoa && asset.soLuongFile > 0"
              class="thumbnails-container"
          >
            <div class="thumbnails-scroll">
              <img
                  v-for="i in asset.soLuongFile"
                  :key="i"
                  :src="thumbnailImage"
                  class="thumbnail thumbnail-disabled"
                  alt="Thumbnail locked"
              />
            </div>
          </div>

          <div v-if="asset.daMoKhoa" class="file-section">
            <FileOrLand entity-type="land" :entity-id="asset.id" :file-list="asset.files || [] "
                        :canEdit="false"/>
          </div>
          <div
              v-else
              class="
    font-bold italic text-slate-700
    border border-dashed border-slate-400
    rounded-lg
    px-4 py-2
    text-center
    bg-white/70
  "
              style=" border: dashed 1px rgba(52,52,52,0.44) !important "
          >
            Mở khóa để xem chi tiết + {{ asset.soLuongFiles }} ảnh và file khác.
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN - GENERAL INFO -->
      <div class="info-section">
        <div class="info-card">
          <div class="card-header">
            <i class="fa-solid fa-circle-info header-icon"></i>
            <h3 class="card-title">Thông tin chung</h3>
          </div>

          <div class="info-grid magazine-grid">
            <div class="info-row">
              <span class="info-label">Loại tài sản</span>
              <span class="info-value" :class="badgeLoai(asset.loaiTaiSan)">
                  {{ formatLoai( asset.loaiTaiSan ) ?? 'Chưa cập nhật' }}
                </span>
            </div>

            <div class="info-row highlight-row">
              <span class="info-label">Giá bán</span>
              <span class="info-value price-selling text-primary">{{ formatMoneyVN(asset.giaBan) ?? 'Chưa cập nhật' }}</span>
            </div>

            <div class="info-row highlight-row">
              <span class="info-label">Giá nội bộ</span>
              <span class="info-value price-internal text-primary">
                {{ asset.giaNoiBo === -1.1 ? '*****' : (formatMoneyVN(asset.giaNoiBo) ?? 'Chưa cập nhật') }}
              </span>
            </div>

            <div class="info-row highlight-row">
              <span class="info-label">Giá mong muốn</span>
              <span class="info-value price-internal text-primary">
                  {{ asset.desire === -1.1 ? '*****' : (formatMoneyVN(asset.desire) ?? 'Chưa cập nhật') }}
                </span>
            </div>


            <div class="info-row">
              <span class="info-label">Liên hệ</span>
              <span class="info-value"> <i class="fa-solid fa-phone text-danger"></i> {{ asset.lienHe ?? ' Chưa cập nhật' }}</span>
            </div>

            <div class="info-row">
              <span class="info-label">Tên chủ sở hữu</span>
              <span v-if="asset.ownerName != null" class="info-value">
                  {{ asset.ownerName ?? 'Chưa cập nhật' }}
              </span>
              <span v-else class="text-gray-600 info-value">Chưa cập nhật</span>
            </div>

            <div class="info-row">
              <span class="info-label">SĐT chủ sở hữu</span>
              <span v-if="asset.ownerPhone != null" class="info-value">
                  {{ asset.ownerPhone ?? 'Chưa cập nhật' }}
              </span>
              <span v-else class="text-gray-600 info-value">Chưa cập nhật</span>
            </div>

            <div class="info-row">
              <span class="info-label">Đơn vị sở hữu</span>
              <span class="info-value owner-unit">
                  <img v-if="asset.donViSoHuu === 'THG'" src="/imgs/logokn.png" alt="THG" class="unit-logo">
                  <span  v-else-if="asset.donViSoHuu === 'DT'">
                     <i class="fa-solid fa-handshake unit-icon"></i> Đối tác
                  </span>

              </span>
            </div>

            <div class="info-row">
              <span class="info-label">Phí môi giới</span>
              <span class="info-value text-primary info-commission-pill">
                <i class="fa-solid fa-bolt"></i>
                {{ asset.phiMoiGioi != null ? asset.phiMoiGioi + '%' : 'Chưa cập nhật' }}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- LEGAL INFO SECTION -->
    <div class="detail-section section-legal">
      <div class="section-header">
        <div class="section-title-group">
          <i class="fa-solid fa-scale-balanced section-icon"></i>
          <h3 class="section-title">Thông tin pháp lý & quản trị</h3>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-item">
            <span class="detail-label">Đường</span>
            <span class="detail-value">{{ formatAddressDetail( asset.address ) ?? 'Chưa cập nhật' }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Phường/Xã</span>
            <span class="detail-value">{{  formatWard( asset.address ) ?? 'Chưa cập nhật'  }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Khu vực</span>
            <span class="detail-value">{{ asset.khuVucMa ?? 'Chưa cập nhật' }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Địa chỉ cũ</span>
            <span class="detail-value">{{ asset.oldAddress ?? 'Chưa cập nhật' }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Số tờ bản đồ & Số thửa đất</span>
            <span v-if=" !asset.daMoKhoa " class="detail-value">**********</span>
            <span v-else class="detail-value">{{ asset.plotNumber ?? 'Chưa cập nhật'}} & {{asset.parcelNumber ?? 'Chưa cập nhật'}}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Loại đất</span>
            <span class="detail-value">{{ asset.loaiDat ?? 'Chưa cập nhật' }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Diện tích tổng</span>
            <span class="detail-value highlight">{{  formatArea( asset.totalArea) ?? 'Chưa cập nhật' }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Quan hệ sở hữu</span>
            <span class="detail-value">{{ asset.ownershipRelation ?? 'Chưa cập nhật' }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Quyền sử dụng đất</span>
            <span class="detail-value">{{ asset.landUseRight ?? 'Chưa cập nhật' }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Vị trí</span>
            <span class="detail-value">{{ asset.landPosition ?? 'Chưa cập nhật' }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Trạng thái</span>
            <span v-if="asset.status == null" class="detail-value">Chưa cập nhật</span>
            <span v-else-if="asset === 'Đã bán'" class="detail-value">Đã bán</span>
            <span v-else class="detail-value">Đang rao bán</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Chiều ngang và chiều dài</span>
          <span class="detail-value text-primary">
              Ngang {{ asset.chieuNgang != null ? formatArea2(asset.chieuNgang) + 'm' : 'Chưa cập nhật' }} , Dài {{ asset.chieuDai != null ? formatArea2(asset.chieuDai) + 'm' : 'Chưa cập nhật' }}
          </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Loại đất</span>
            <span class="detail-value">{{ asset.loaiDat ?? 'Chưa cập nhật' }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Hình dạng / Kết cấu</span>
            <span class="detail-value">{{ asset.structure ?? 'Chưa cập nhật' }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Hiện trạng</span>
            <span class="detail-value">{{ asset.hienTrangDat ?? 'Chưa cập nhật' }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Lộ giới & Độ rộng đường</span>
            <span class="detail-value">{{ asset.loGioi != null ? asset.loGioi + 'm' : 'Chưa cập nhật' }} & {{ asset.doRongDuong != null ? asset.doRongDuong + 'm' : 'Chưa cập nhật' }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Quy hoạch</span>
            <span class="detail-value">{{ asset.quyHoach ?? 'Chưa cập nhật' }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Mặt tiền</span>
            <span class="detail-value">{{ asset.matTienNha != null ? asset.matTienNha + ' m' : 'Chưa cập nhật' }}</span>
        </div>
      </div>
    </div>

    <!-- HOUSE SECTION -->
    <div class="detail-section section-house" v-if=" getAssetType(asset) === 'NHA'">
      <div class="section-header">
        <div class="section-title-group">
          <i class="fa-solid fa-house-chimney section-icon"></i>
          <h3 class="section-title">Kích thước & Kết cấu (Nhà)</h3>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-item">
            <span class="detail-label">Diện tích sàn</span>
            <span class="detail-value highlight">{{ formatArea( asset.floorArea ) ?? 'Chưa cập nhật' }} </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Loại nhà</span>
            <span class="detail-value highlight">{{ asset.loaiNha ?? 'Chưa cập nhật' }}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Số tầng & Số lầu</span>
            <span class="detail-value">{{ asset.soTang != null ? asset.soTang + ' tầng' : 'Chưa cập nhật' }} & {{ asset.soLau != null ? asset.soLau + ' lầu' : 'Chưa cập nhật' }} </span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Hiện trạng nhà</span>
            <span class="detail-value">{{ asset.hienTrangNha ?? 'Chưa cập nhật' }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Phòng ngủ</span>
            <span class="detail-value">{{ asset.soPhongNgu != null ? asset.soPhongNgu + ' phòng' : 'Chưa cập nhật' }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Phòng tắm</span>
            <span class="detail-value">{{ asset.soPhongTam != null ? asset.soPhongTam + ' phòng' : 'Chưa cập nhật' }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Tổng số phòng</span>
            <span class="detail-value">{{ asset.tongSoPhong != null ? asset.tongSoPhong + ' phòng' : 'Chưa cập nhật' }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Năm xây dựng</span>
            <span class="detail-value">{{ asset.namXayDung ?? 'Chưa cập nhật' }}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Nội thất</span>
            <span class="detail-value">{{ asset.noiThat ?? 'Chưa cập nhật' }}</span>
        </div>
      </div>
    </div>

    <!-- ROOMS DETAIL -->
    <div class="detail-section section-rooms" v-if="getAssetType(asset) === 'NHA'">
      <div class="section-header">
        <div class="section-title-group">
          <i class="fa-solid fa-door-closed section-icon"></i>
          <h3 class="section-title">Chi tiết phòng</h3>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="executive-table magazine-table" v-if="asset.rooms && asset.rooms.length > 0">
          <thead>
          <tr>
            <th>Loại phòng</th>
            <th>Số lượng</th>
            <th>Diện tích (từng phòng)</th>
            <th>Mô tả</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(r, index) in asset.rooms" :key="index">
              <td class="room-type">{{ r.loaiPhong ?? 'Chưa cập nhật' }}</td>
              <td class="text-start">{{ r.soLuong ?? 'Chưa cập nhật' }}</td>
              <td class="room-area">{{ r.dienTich != null ? r.dienTich + ' m²' : 'Chưa cập nhật' }}</td>
            <td class="room-desc">{{ r.moTa || '—' }}</td>
          </tr>
          </tbody>
        </table>

        <!-- Nếu không có dữ liệu -->
        <div v-else class="text-center text-muted py-3">
          Chưa có thông tin
        </div>
      </div>
    </div>

    <!-- VALUATION SECTION -->
    <div class="detail-section section-valuation">
      <div class="section-header">
        <div class="section-title-group">
          <i class="fa-solid fa-chart-line section-icon"></i>
          <h3 class="section-title">Định giá</h3>
        </div>
      </div>

      <div v-if="!asset.valuations || asset.valuations.length === 0" class="empty-state">
        <i class="fa-solid fa-chart-simple empty-icon"></i>
        <p class="empty-text">Chưa có dữ liệu định giá cho tài sản này</p>
      </div>

      <div v-else class="table-wrapper valuation-wrapper">
        <table class="executive-table magazine-table">
          <thead>
          <tr>
            <th>Lần định giá</th>
            <th>Ngày hiệu lực</th>
            <th>Tổng giá</th>
            <th>Giá cao nhất</th>
            <th>Tương quan</th>
            <th>File PDF</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="v in asset.valuations" :key="v.valuationId">
              <td class="valuation-round">Lần {{ v.valuationRound ?? 'Chưa cập nhật' }}</td>
              <td>{{ v.effectiveDate ?? 'Chưa cập nhật' }}</td>
              <td>
                <span class="price-valuation">
                  {{ v.totalPrice === -1.1 ? '*****' : (formatMoneyVN(v.totalPrice) ?? 'Chưa cập nhật') }}
                </span>
              </td>

              <td>
                <span class="price-valuation">
                  {{ v.totalMaxPrice === -1.1 ? '*****' : (formatMoneyVN(v.totalMaxPrice) ?? 'Chưa cập nhật') }}
                </span>
              </td>

              <td>
                <span
                    v-if="asset.desire === -1.1 || v.totalPrice === -1.1"
                >
                  *******
                </span>

                <span
                    v-else
                    v-html="renderPriceCompare(asset.desire, v.totalPrice)"
                ></span>
              </td>

              <td>
                <button class="pdf-btn" @click="openPdf(v.pdfFile)">
                  <i class="fa-solid fa-file-pdf"></i>
                  <span>{{ v.pdfFile?.fileName ?? 'Chưa cập nhật' }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import FileOrLand from "../../land/FileOrLand.vue";
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const activeImage = ref(0);

const asset = ref(null);
const rooms = ref([]);
const pdfUrl = ref(null);

onMounted(() => loadDetail(id));

import api from "/src/api/api.js"
import Spam from "../Spam.vue";

const tinhHoaHong = (asset) => {
  if (asset.phiMoiGioi == null) return null;

  const giaCoSo =
      asset.status === 'Đã bán'
          ? asset.giaBanThanhCong
          : asset.giaBan;

  if (giaCoSo == null) return null;

  return (asset.phiMoiGioi * giaCoSo) / 100;
};


const thumbnailImage = computed(() => {
  return asset.anhMacDinh
      || 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/default.jpg';
});

async function loadDetail(id) {
  try {
    const res = await api.get(`/user.thg/product/user/chi-tiet/${id}`);
    const data = res.data;
    asset.value = data;
    console.log("Dữ liệu từ API:", data);
  } catch (e) {
    console.warn("API chưa có dữ liệu — fallback mock");
  }
}

const typeColor = (type) => {
  switch (type) {
    case "NHA": return "#6366f1";
    case "DAT": return "#8b5cf6";
  }
};

const lockedImage = computed(() => {
  return asset.anhMacDinh
      || 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/default.jpg';
});



function formatNgayBan(dateTime) {
  if (!dateTime) return '';

  const date = new Date(dateTime);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


const parsedAddress = computed(() => {
  if (!asset.value?.address) return { street: "", ward: "", area: "" };
  const parts = asset.value.address.split(",").map(p => p.trim());
  return {
    street: parts[0] || "",
    ward: parts[1] || "",
    area: parts.slice(2).join(", ") || ""
  };
});

// Hàm phụ trợ
function formatAddress(address) {
  if (!address) return "";
  return address.replace(/\/!!/g, ", ");
}

function formatAddressFromItem(item) {
  if (!item || !item.address) return ''
  return item.address.replace(/\/!!/g, ', ')
}

function mapLoaiMH(code) {
  switch (code) {
    case 'BN30N':
      return 'Bán nhanh 30 ngày'
    case 'HOPTAC':
      return 'Hợp tác phân phối'
    case 'HTT':
      return 'Hàng thị trường'
    default:
      return 'Bất động sản'
  }
}
function buildSeoTitle(item) {
  if (!item) return ''

  const loaiMH = mapLoaiMH(item.phanLoaiHang)
  const loaiTaiSan = item.loaiTaiSan === 'NHA'
      ? 'Nhà đất'
      : 'Bất động sản'

  // Cắt địa chỉ để lấy phường + tỉnh
  const parts = item.address?.split('/!!') || []
  const phuong = parts[1] || ''
  const tinh = parts[2] || item.khuVucMa || ''

  const dienTich = item.totalArea
      ? `${Math.floor(item.totalArea)}m²`
      : ''

  return `${loaiMH} ${loaiTaiSan} ${dienTich} tại ${phuong} ${tinh} | Thiên Hà Group`
      .replace(/\s+/g, ' ')
      .trim()
}


function formatMoneyVN(value) {
  if (value == null || isNaN(value)) return "0";
  const num = Number(value);

  if (num < 1_000_000) {
    return num.toLocaleString("vi-VN");
  }

  if (num < 1_000_000_000) {
    const trieu = num / 1_000_000;
    return `${trieu.toFixed(trieu % 1 === 0 ? 0 : 1)} triệu`;
  }

  const ty = num / 1_000_000_000;
  return `${ty.toFixed(ty % 1 === 0 ? 0 : 2)} tỷ`;
}
const badgeLoai = (loai) => {
  if (!loai) return "";

  const clean = loai.toUpperCase();

  switch (clean) {
    case "NHA":
      return "badge-loai badge-nha";
    case "DAT":
      return "badge-loai badge-dat";
    case "DATLON":
      return "badge-loai badge-datlon";
    default:
      return "badge-loai";
  }
};

const formatLoai = (loai) => {
  if (!loai) return "";
  switch (loai.toUpperCase()) {
    case "NHA":
      return "Nhà";
    case "DAT":
      return "Đất";
    case "DATLON":
      return "Đất lớn";
    default:
      return loai;
  }
};


const badgeClass = (code) => {
  const map = {
    BN30N:
        "badge rounded-3 text-white fw-semibold bn30n-color fs-6",
    HTT:
        "badge rounded-3 text-white fw-semibold htt-color fs-6",
    HOPTAC:
        "badge rounded-3 text-white fw-semibold hoptac-color fs-6"
  };

  return map[code] || "badge rounded-4 text-white fw-semibold default-color";
};

const formatAddressDetail = (diaChi) => {
  let raw = diaChi || "";

  // Lấy phần trước /!! đầu tiên
  let clean = raw.split("/!!")[0].trim();

  return clean;
};



const formatWard = (addressDetail) => {
  const raw = addressDetail || "";
  const parts = raw.split("/!!");

  // Ward nằm ở vị trí 1
  let ward = parts[1]?.trim() || "";

  return ward;
};
import { useAuthStore } from "/src/stores/authStore.js";
import {handleServiceUsageResponse, showCenterSuccess} from "../../../assets/js/alertService.js";
import ReportProduct from "./ReportProduct.vue";
const authStore = useAuthStore();
const auth = useAuthStore();

async function handleUnlock(asset) {

  localStorage.setItem("redirectAfterLogin", "/san-pham-thien-ha/" + asset.id);
  if (!auth.accessToken) {
    auth.openLoginModal();
    return;
  }

  if (!asset?.id) {
    console.error("❌ Thiếu asset.id");
    return;
  }

  try {
    // Gọi API kiểm tra có được unlock không
    const res = await api.get(`/thg.user/my-land/checkout/check/${asset.id}`);

    const ok = handleServiceUsageResponse(res.data, {
      router, // 👈 TRUYỀN ROUTER VÀO
      onContinue: () => {
        localStorage.setItem("landAssetId", asset.id);
        router.push("/thanh-toan-san-pham");
      }
    })


    if(!ok)
      return;

    showCenterSuccess("Mở khóa sản phẩm thành công!")
    location.reload();

  } catch (e) {
    console.error("❌ Lỗi khi gọi API kiểm tra mở khóa", e);
  }
}



const formatArea = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "";

  // Làm tròn 2 số thập phân
  let num = Number(value).toFixed(2);

  // Nếu .00 thì bỏ phần thập phân
  if (num.endsWith(".00")) {
    num = Number(num).toLocaleString("en-US");
  } else {
    num = Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  return num + " m²";
};

const formatArea2 = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "";

  // Làm tròn 2 số thập phân
  let num = Number(value).toFixed(2);

  // Nếu .00 thì bỏ phần thập phân
  if (num.endsWith(".00")) {
    num = Number(num).toLocaleString("en-US");
  } else {
    num = Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  return num;
};

const getAssetType = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const structure = (item.structure || "").toLowerCase();

  // Ưu tiên dữ liệu từ backend
  if (item.loaiTaiSan) {
    const map = {
      NHA: "NHA",
      DAT: "DAT",
      DATLON: "DATLON"
    };

    if (map[item.loaiTaiSan]) {
      return map[item.loaiTaiSan];
    }
  }

  // Từ khóa nhận diện nhà (bao gồm cả chung cư, căn hộ)
  const houseKeywords = [
    // Nhà truyền thống
    "lầu", "trệt", "tầng", "hầm", "gác",
    "nhà cấp", "cấp 1", "cấp 2", "cấp 3", "cấp 4",
    "biệt thự", "villa", "shophouse", "townhouse", "nhà",

    // Chung cư & căn hộ → cũng tính là "nhà"
    "chung cư", "căn hộ", "chcc", "studio",
    "condotel", "officetel", "apartment", "can ho",
    "chung cu", "tower", "block"
  ];

  // Nếu kết cấu chứa từ khóa → là nhà
  if (houseKeywords.some(keyword => structure.includes(keyword))) {
    return "NHA";
  }

  // Nếu diện tích lớn → đất lớn
  if (dtcnValue > 1000) return "DATLON";

  // Còn lại → đất
  return "DAT";
};

const renderPriceCompare = (desirePrice, totalPrice) => {
  console.log("🔥 DEBUG INPUT --------------------------------");
  console.log("desirePrice:", desirePrice);
  console.log("totalPrice :", totalPrice);

  // Validate
  if (!desirePrice || !totalPrice || isNaN(desirePrice) || isNaN(totalPrice)) {
    console.log("❌ INVALID INPUT");
    return "";
  }

  // Tính toán
  const diff =   totalPrice - desirePrice;
  const percent = ((diff / totalPrice) * 100).toFixed(2);

  console.log("📌 diff (chênh lệch):", diff);
  console.log("📌 percent (% chênh lệch):", percent);

  // Trường hợp giá mong muốn cao hơn
  if (diff > 0) {
    console.log("📈 Kết luận: GIÁ CAO HƠN → icon đi lên + màu đỏ");
    return `
        <span class="text-success fw-semibold">
          <i class="bi bi-graph-up-arrow"></i>
          +${percent}% cao hơn kỳ vọng chủ nhà
        </span>
      `;
  }

  // Trường hợp giá thấp hoặc bằng
  console.log("📉 Kết luận: GIÁ THẤP HƠN → icon đi xuống + màu xanh");
  return `
      <span class="text-danger fw-semibold">
        <i class="bi bi-graph-down-arrow"></i>
        ${percent}% thấp hơn kỳ vọng chủ nhà
      </span>
    `;
};

const openPdf = async (pdfFile) => {
  try {
    if (!pdfFile || !pdfFile.id) {
      console.warn("❌ Không có file hợp lệ");
      return;
    }

    console.log("📌 Đang gọi API lấy signed URL...");

    const res = await api.get(`/api/files/${pdfFile.id}`);

    if (res && res.data && res.data.url) {
      console.log("✔ Signed URL:", res.data.url);

      // Mở PDF bằng URL tạm thời
      window.open(res.data.url, "_blank");
    } else {
      console.error("❌ API không trả URL", res);
    }

  } catch (e) {
    console.error("❌ Lỗi API:", e);
  }
};

</script>

<style scoped>
/* ========= EXECUTIVE CONTAINER ========= */
.executive-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

/* ========= HEADER ========= */
.executive-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.header-left {
  flex: 1;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
}

.back-button:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  transform: translateX(-2px);
}

.property-title-section {
  margin-top: 8px;
}

.property-address {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.property-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-label {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.meta-divider {
  width: 1px;
  height: 20px;
  background: #cbd5e1;
}

.press-hero {
  margin-top: 20px;
  background: linear-gradient(120deg, #ffffff 0%, #f8fafc 50%, #eef2ff 100%);
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 8px 20px -8px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.press-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.press-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #1d4ed8;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0.2px;
  box-shadow: 0 10px 30px -12px rgba(29, 78, 216, 0.6);
}

.press-time {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 10px;
  background: #e2e8f0;
}

.press-lede {
  margin: 0;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.6;
  font-weight: 600;
}

.press-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.press-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 10px 25px -16px rgba(15, 23, 42, 0.35);
  position: relative;
  overflow: hidden;
}

.press-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #475569;
  font-weight: 700;
}

.press-value {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.press-commission {
  color: #dc2626;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 2px 10px rgba(248, 113, 113, 0.5);
  animation: pulseGlow 2s ease-in-out infinite;
}

.press-commission-card {
  background: linear-gradient(135deg, #fff1f2 0%, #ffffff 100%);
  border-color: #fecdd3;
  box-shadow: 0 16px 36px -20px rgba(239, 68, 68, 0.55);
}

.press-commission-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 0%, rgba(254, 226, 226, 0.55) 40%, transparent 80%);
  transform: translateX(-100%);
  animation: shimmer 4s infinite;
  pointer-events: none;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #ef4444;
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5);
  animation: pulseDot 1.6s infinite;
}

.press-desc {
  color: #64748b;
  font-size: 13px;
}

.press-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
}

.press-quote {
  flex: 1;
  font-style: italic;
  color: #1e293b;
  font-weight: 700;
  line-height: 1.5;
}

.press-contact {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 14px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  box-shadow: 0 12px 28px -14px rgba(16, 185, 129, 0.8);
}

.contact-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.15);
  font-size: 18px;
}

.contact-title {
  font-weight: 800;
  font-size: 15px;
}

.contact-sub {
  font-size: 13px;
  opacity: 0.9;
}

.commission-spotlight {
  position: relative;
  margin: 6px 0 0;
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(120deg, #0f172a 0%, #1e293b 40%, #0f172a 100%);
  color: #f8fafc;
  overflow: hidden;
  box-shadow: 0 14px 30px -18px rgba(15, 23, 42, 0.8), 0 0 0 1px rgba(148, 163, 184, 0.35);
}

.spotlight-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 10px 24px -16px rgba(34, 197, 94, 0.8);
}

.spotlight-copy {
  margin-top: 10px;
  display: grid;
  gap: 6px;
  position: relative;
  z-index: 1;
}

.spotlight-line {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1px;
}

.spotlight-percent {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 12px;
  background: #e0f2fe;
  color: #0ea5e9;
  font-weight: 800;
  box-shadow: 0 8px 20px -14px rgba(14, 165, 233, 0.9);
  animation: spotlightPulse 1.4s ease-in-out infinite;
}

.spotlight-amount {
  font-weight: 800;
  color: #f7fc5d;
  padding: 5px 8px;
  border-radius: 10px;
  background: rgba(240, 253, 250, 0.12);
}

.spotlight-wave {
  position: absolute;
  inset: -30%;
  background: radial-gradient(circle at 10% 20%, rgba(34, 197, 94, 0.25), transparent 45%),
  radial-gradient(circle at 90% 10%, rgba(59, 130, 246, 0.3), transparent 40%),
  radial-gradient(circle at 30% 80%, rgba(45, 212, 191, 0.22), transparent 40%);
  filter: blur(12px);
  opacity: 0.65;
  animation: waveSlide 9s linear infinite;
}

@keyframes pulseGlow {
  0% { text-shadow: 0 0 0 rgba(239, 68, 68, 0.3); }
  50% { text-shadow: 0 4px 14px rgba(239, 68, 68, 0.8); }
  100% { text-shadow: 0 0 0 rgba(239, 68, 68, 0.3); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(120%); opacity: 0; }
}

@keyframes pulseDot {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  70% { transform: scale(1.1); box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

@keyframes spotlightPulse {
  0% { transform: translateY(0); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.45); }
  50% { transform: translateY(-1px); box-shadow: 0 10px 28px -16px rgba(14, 165, 233, 0.9); }
  100% { transform: translateY(0); box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.45); }
}

@keyframes waveSlide {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(2deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1); }
}

.property-badge {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-red {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.badge-green {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.badge-yellow {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #854d0e;
  border: 1px solid #fcd34d;
}

.badge-gray {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #475569;
  border: 1px solid #cbd5e1;
}

/* ========= PRICES ========= */
.price-selling {
  color: #dc2626;
  font-weight: 700;
  font-size: 15px;
}

.price-internal {
  color: #0369a1;
  font-weight: 700;
  font-size: 15px;
}

.price-valuation {
  color: #7c3aed;
  font-weight: 700;
  font-size: 15px;
}

/* ========= HEADER ACTIONS ========= */
.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-edit {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -1px rgba(59, 130, 246, 0.4);
}

.btn-news {
  background: white;
  color: #475569;
  border: 2px solid #cbd5e1;
}

.btn-news:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  transform: translateY(-2px);
}

/* ========= CONTENT GRID ========= */
.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.33fr) minmax(320px, 0.67fr);
  gap: 24px;
  margin-bottom: 24px;
  align-items: start;
}

/* ========= GALLERY ========= */
.gallery-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  width: 100%;
  min-width: 0;
  height: 690px;
}

.gallery-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.main-image-container {
  position: relative;
  width: 100%;
  height: 450px;
  border-radius: 12px;
  overflow: hidden;
  background: #000; /* hoặc #f1f5f9 cho đẹp */
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;   /* 👈 KHÔNG CẮT ẢNH */
  object-position: center;
}



.image-counter {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.thumbnails-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0;
}

.thumbnails-scroll {
  display: inline-flex;
  gap: 12px;
  width: max-content;
}

/* ====== THUMBNAILS DEFAULT (DESKTOP) ====== */
.thumbnail {
  flex-shrink: 0;
  width: 100px;
  height: 75px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.2s;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .thumbnails-container {
    padding: 2px 0;
  }

  .thumbnails-scroll {
    gap: 8px;
  }

  .thumbnail {
    width: 64px;
    height: 48px;
    border-width: 2px;
  }
}


.thumbnail:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.thumbnail-active {
  border-color: #3b82f6;
  opacity: 1;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* ========= INFO SECTION ========= */
.info-section {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 520px;
  min-width: 0;
}

.info-card {
  background: linear-gradient(180deg, #fffdf6 0%, #ffffff 60%);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 18px 36px -24px rgba(15, 23, 42, 0.45);
  border: 1px solid #e7dec8;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.section-deck {
  color: #475569;
  font-size: 15px;
  line-height: 1.6;
  background: #f8fafc;
  border-left: 4px solid #94a3b8;
  padding: 12px 16px;
  border-radius: 12px;
  margin: -4px 0 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.editorial-band {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(90deg, #e0f2fe, #f8fafc, #e0f2fe);
  padding: 10px 14px;
  border-radius: 12px;
  margin-bottom: 18px;
  border: 1px solid #bfdbfe;
}

.band-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #0ea5e9;
  box-shadow: 0 0 0 6px rgba(14, 165, 233, 0.12);
}

.band-text {
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #0f172a;
  font-weight: 700;
}

.header-icon {
  font-size: 22px;
  color: #3b82f6;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.magazine-grid {
  background: #ffffff;
  padding: 12px;
  border-radius: 14px;
  border: 1px dashed #e2e8f0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 10px 24px -20px rgba(15, 23, 42, 0.35);
}

.info-row:last-child {
  border-bottom: none;
}

.highlight-row {
  background: linear-gradient(90deg, #e0f2fe 0%, #ffffff 100%);
  padding: 12px 16px;
  margin: 0;
  border: 1px solid #bae6fd;
  border-radius: 10px;
}

.info-label {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.info-value {
  color: #0f172a;
  font-size: 15px;
  font-weight: 600;
  text-align: right;
}

.info-commission-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, #e0f2fe 0%, #c7d2fe 100%);
  color: #1d4ed8;
  box-shadow: 0 8px 20px -14px rgba(59, 130, 246, 0.6);
}

.phone-number {
  color: #64748b;
  font-weight: 500;
}

.owner-unit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unit-logo {
  width: 50px;
  height: 30px;
  object-fit: contain;
}

.unit-icon {
  font-size: 18px;
  color: #3b82f6;
}

.file-section {
  border-top: 2px solid #f1f5f9;
}

.info-footnote {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 16px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.footnote-bullet {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  margin-top: 4px;
  box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.12);
}

.footnote-copy {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

/* ========= DETAIL SECTIONS ========= */
.detail-section {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 85%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 18px 40px -26px rgba(15, 23, 42, 0.35);
  border: 1px solid #e2e8f0;
  border-left: 4px solid;
}

.section-legal {
  border-left-color: #0ea5e9;
}

.section-house {
  border-left-color: #10b981;
}

.section-land {
  border-left-color: #f59e0b;
}

.section-rooms {
  border-left-color: #8b5cf6;
}

.section-valuation {
  border-left-color: #ef4444;
}

.section-header {
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.magazine-ribbon {
  margin-top: 18px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 14px;
  align-items: center;
  background: linear-gradient(90deg, #fef3c7, #fff7ed);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #fef3c7;
  box-shadow: 0 10px 28px -24px rgba(234, 88, 12, 0.5);
}

.ribbon-tag {
  background: #f59e0b;
  color: #fff7ed;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.ribbon-copy {
  margin: 0;
  color: #92400e;
  line-height: 1.6;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  font-size: 24px;
  color: inherit;
}

.section-legal .section-icon {
  color: #0ea5e9;
}

.section-house .section-icon {
  color: #10b981;
}

.section-land .section-icon {
  color: #f59e0b;
}

.section-rooms .section-icon {
  color: #8b5cf6;
}

.section-valuation .section-icon {
  color: #ef4444;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: 0.4px;
}

/* ========= DETAIL GRID ========= */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 24px;
}

.magazine-highlight .detail-item {
  background: linear-gradient(180deg, #ffffff 0%, #f0f9ff 90%);
  border: 1px solid #e0f2fe;
  position: relative;
  overflow: hidden;
}

.magazine-highlight .detail-item::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 26px -20px rgba(15, 23, 42, 0.45);
}

.detail-label {
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  color: #0f172a;
  font-size: 15px;
  font-weight: 600;
}

.detail-value.highlight {
  color: #3b82f6;
  font-size: 16px;
  font-weight: 700;
}

.editorial-note {
  margin-top: 18px;
  padding: 14px 16px;
  background: linear-gradient(90deg, #ecfeff, #f8fafc);
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px 16px;
  align-items: center;
}

.note-title {
  font-weight: 800;
  text-transform: uppercase;
  color: #0f172a;
  letter-spacing: 0.8px;
}

.note-copy {
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

/* ========= TABLE ========= */
.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.table-caption {
  background: #0f172a;
  color: #e2e8f0;
  padding: 10px 14px;
  border-radius: 12px 12px 0 0;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  font-weight: 700;
}

.magazine-table thead {
  background: linear-gradient(90deg, #e0f2fe, #f8fafc);
}

.magazine-table tbody tr:nth-child(odd) {
  background: #f8fafc;
}

.magazine-table tbody tr:nth-child(even) {
  background: #ffffff;
}

.table-footnote {
  padding: 10px 14px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px;
  color: #475569;
  font-size: 14px;
}

.valuation-wrapper {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 24px -22px rgba(15, 23, 42, 0.35);
}

.valuation-wrapper .table-caption {
  background: #111827;
  color: #f3f4f6;
}

.valuation-note {
  padding: 14px 16px;
  background: #fff7ed;
  border-top: 1px solid #ffe4e6;
  border-radius: 0 0 16px 16px;
  color: #92400e;
}

.executive-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.executive-table thead {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.executive-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.executive-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.executive-table tbody tr:hover {
  background: #f8fafc;
}

.executive-table tbody tr:last-child {
  border-bottom: none;
}

.executive-table td {
  padding: 16px 20px;
  color: #334155;
}

.room-type {
  font-weight: 600;
  color: #0f172a;
}

.text-center {
  text-align: center;
}

.room-area {
  font-weight: 600;
  color: #3b82f6;
}

.room-desc {
  color: #64748b;
  font-style: italic;
}

.valuation-round {
  font-weight: 700;
  color: #7c3aed;
}

.pdf-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.pdf-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px -1px rgba(239, 68, 68, 0.4);
}

/* ========= EMPTY STATE ========= */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.empty-text {
  color: #64748b;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

/* ========= PDF MODAL ========= */
.pdf-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.pdf-container {
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pdf-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.pdf-close:hover {
  background: rgba(239, 68, 68, 0.95);
  transform: rotate(90deg);
}

.pdf-frame {
  width: 100%;
  height: 100%;
  border: none;
}

/* ========= RESPONSIVE ========= */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .press-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .main-image-container {
    height: 380px;
  }

  .gallery-section,
  .info-card {
    padding: 20px;
  }

  .content-grid {
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .executive-container {
    padding: 16px;
  }

  .executive-header {
    padding: 20px;
  }

  .header-top {
    flex-direction: column;
  }

  .property-address {
    font-size: 22px;
  }

  .gallery-section {
    padding: 16px;
    height: auto;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-section {
    padding: 20px;
  }

  .property-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .meta-divider {
    display: none;
  }

  .press-grid {
    grid-template-columns: 1fr;
  }

  .press-cta {
    flex-direction: column;
    align-items: flex-start;
  }

  .executive-table th,
  .executive-table td {
    padding: 12px 10px;
  }
}

@media (max-width: 480px) {
  .property-address {
    font-size: 18px;
  }

  .thumbnails-container {
    overflow-x: auto;
  }

  .thumbnails-scroll {
    flex-wrap: nowrap;
    gap: 10px;
  }

  .thumbnail {
    width: 80px;
    height: 60px;
  }
}

.badge-loai {
  padding: 3px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  display: inline-block;
}

.badge-nha {
  background-color: #e0f7fa;
  color: #006064;
}

.badge-dat {
  background-color: #e8f5e9;
  color: #1b5e20;
}

.badge-datlon {
  background-color: #fff3e0;
  color: #e65100;
}
.bn30n-color {
  background-color: #22c55e !important; /* green-500 */
  border-color: #16a34a !important;     /* green-600 */
}
.htt-color {
  background-color: #eab308 !important; /* yellow-500 */
  border-color: #ca8a04 !important;     /* yellow-600 */
}
.hoptac-color {
  background-color: #f97316 !important; /* orange-500 */
  border-color: #ea580c !important;     /* orange-600 */
}
.default-color {
  background-color: #94a3b8 !important; /* slate-400 */
  border-color: #64748b !important;     /* slate-500 */
}
.unlock-button-glow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  box-shadow: 0 12px 28px -14px rgba(16, 185, 129, 0.8);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
}

.unlock-button-glow:hover {
  transform: scale(1.02);
  box-shadow: 0 16px 32px -12px rgba(5, 150, 105, 0.7);
}

.unlock-shine {
  content: "";
  position: absolute;
  top: 0;
  left: -60%;
  width: 40%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: skewX(-20deg);
  z-index: 1;
  transition: none;
}

.group:hover .unlock-shine {
  animation: unlockShineMove 1s ease-in-out forwards;
}

@keyframes unlockShineMove {
  0% {
    left: -60%;
  }
  100% {
    left: 120%;
  }
}
.main-image.locked {
  filter: blur(6px);
}

@media (max-width: 768px) {
  .gallery-section {
    padding: 12px;
    height: auto;
  }

  .main-image-container {
    width: 100%;
    height: 280px;          /* 👈 QUAN TRỌNG: thấp hơn chiều rộng */
    border-radius: 12px;
    overflow: hidden;
  }


  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 60%; /* 👈 giống thumbnail */
  }

  .thumbnails-container {
    overflow-x: auto;
    padding: 6px 10px;
  }

  .thumbnails-scroll {
    display: flex;
    gap: 6px;
    width: max-content;
  }

  .thumbnail {
    width: 56px;
    height: 42px;
    border-radius: 6px;
  }
}
.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
