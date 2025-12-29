  <template>
    <div v-if="asset" class="executive-container">

      <!-- HEADER CARD -->
      <div class="executive-header">
        <div class="header-top">
          <div class="header-left">
            <button class="back-button" @click="router.push('/-thg/quan-ly-san-pham')">
              <i class="fa-solid fa-arrow-left"></i>
              <span>Quay lại danh sách</span>
            </button>

            <div class="property-title-section">
              <h1 class="property-address">{{ formatAddress( asset.address ) }}</h1>

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
                  <span class="price-selling">{{  formatMoneyVN(asset.giaBan) }}</span>
                </span>

                <div class="meta-divider"></div>

                <span class="meta-item">
                  <span class="meta-label">Giá nội bộ:</span>
                  <span class="price-internal">{{ formatMoneyVN(asset.giaNoiBo) }}</span>
                </span>

                <div class="meta-divider"></div>

                <span class="meta-item">
                  <span class="meta-label">Số lượt xem:</span>
                  <span class="price-internal">{{ formatMoneyVN(asset.luotXem) }}</span>
                </span>
                <div class="meta-divider"></div>

                <span class="meta-item">
                  <span class="meta-label">Số lượt thích:</span>
                  <span class="price-internal">{{ formatMoneyVN(asset.luotThich) }}</span>
                </span>
                <div class="meta-divider"></div>

                <span class="meta-item">
                  <span class="meta-label">Số lượt mở khóa:</span>
                  <span class="price-internal">{{ formatMoneyVN(asset.luotMoKhoa) }}</span>
                </span>

              </div>
            </div>
            <div v-if="asset.status === 'Đã bán'" class="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border mt-2">
              <!-- ICON -->
              <div
                  class="d-flex align-items-center justify-content-center
           rounded-3
           text-white shadow"
                  style="width: 48px; height: 48px;"
              >
                <i class="fa-solid fa-user-check fs-5" style="color: black"></i>
              </div>

              <!-- INFO -->
              <div class="flex-grow-1">
                <div class="fw-semibold text-dark">
                  {{ asset.nguoiBanTen || 'Chưa cập nhật người bán' }}
                </div>
                <div class="text-muted small">
                  Người bán thành công
                </div>
              </div>

              <!-- PRICE -->
              <div class="text-end">
                <div class="fw-bold text-success fs-5">
                  {{ asset.giaBanThanhCong
                    ? formatMoneyVN(asset.giaBanThanhCong)
                    : 'Chưa cập nhật'
                  }}
                </div>
                <div class="text-muted small">
                  Giá bán thành công
                </div>
              </div>
            </div>

          </div>

          <div class="header-actions">
            <button class="action-btn btn-edit" @click="$router.push(`/-thg/quan-ly-san-pham/cap-nhat/${asset.id}`)">
              <i class="fa-solid fa-pen"></i>
              <span>Cập nhật thông tin</span>
            </button>
          </div>
        </div>
      </div>

      <!-- TABS -->
<!--      <div class="asset-tabs">-->
<!--        <button-->
<!--            class="tab-btn"-->
<!--            :class="{ active: activeTab === 'DETAIL' }"-->
<!--            @click="activeTab = 'DETAIL'"-->
<!--        >-->
<!--          <i class="fa-solid fa-circle-info"></i>-->
<!--          Thông tin chi tiết-->
<!--        </button>-->

<!--        <button-->
<!--            class="tab-btn"-->
<!--            :class="{ active: activeTab === 'FILE' }"-->
<!--            @click="activeTab = 'FILE'"-->
<!--        >-->
<!--          <i class="fa-solid fa-handshake"></i>-->
<!--          Môi giới đã hợp tác-->
<!--        </button>-->
<!--      </div>-->


      <!-- TAB 1 -->
      <div v-if="activeTab === 'DETAIL'">
        <!-- MAIN CONTENT GRID -->
        <div class="content-grid">

          <!-- LEFT COLUMN - GALLERY -->
          <div class="gallery-section" style="width: 930px; max-width: 930px">
            <div class="gallery-wrapper">
              <div class="main-image-container">
                <img :src="asset.slide[activeImage]" alt="Property image" class="main-image" />
                <div class="image-counter">{{ activeImage + 1 }} / {{ asset.slide.length }}</div>
              </div>

              <div class="thumbnails-container">
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
              <div class="file-section">
                <FileOrLand entity-type="land" :entity-id="asset.id" :file-list="asset.files || [] "
                            :canEdit="false"/>
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

              <div class="info-grid">
                <div class="info-row">
                  <span class="info-label">Loại tài sản</span>
                  <span class="info-value" :class="badgeLoai(asset.loaiTaiSan)">
                  {{ formatLoai( asset.loaiTaiSan ) }}
                </span>
                </div>

                <div class="info-row">
                  <span class="info-label">Trạng thái</span>
                  <span class="info-value" :class="badgeStatus(asset.status)">
                  {{ formatStatus(asset.status) }}
                </span>
                </div>

                <div class="info-row highlight-row">
                  <span class="info-label">Giá bán</span>
                  <span class="info-value price-selling text-primary">{{ formatMoneyVN(asset.giaBan) }}</span>
                </div>

                <div class="info-row highlight-row">
                  <span class="info-label">Giá nội bộ</span>
                  <span class="info-value price-internal text-primary">{{  formatMoneyVN(asset.giaNoiBo) }}</span>
                </div>

                <div class="info-row highlight-row">
                  <span class="info-label">Giá mong muốn</span>
                  <span class="info-value price-internal text-primary">{{  formatMoneyVN( asset.desire ) }}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Liên hệ</span>
                  <span class="info-value"> <i class="fa-solid fa-phone text-danger"></i> {{ asset.lienHe ?? ' Chưa cập nhật' }}</span>
                </div>

                <div class="info-row">
                  <span class="info-label">Chủ sở hữu</span>
                  <span v-if="asset.ownerName != null" class="info-value">
                  {{ asset.ownerName ?? 'Chưa cập nhật' }}
                </span>
                  <span v-else class="text-gray-600 info-value">Chưa cập nhật</span>
                </div>

                <div class="info-row">
                  <span class="info-label">SĐT chủ sở hữu</span>
                  <span class="info-value"> {{ asset.ownerPhone ?? 'Chưa cập nhật' }}</span>
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
                  <span class="info-value text-primary">{{ asset.phiMoiGioi != null ? asset.phiMoiGioi + '%' : 'Chưa cập nhật' }}</span>
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
              <span class="detail-value">{{ formatAddressDetail( asset.address ) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Phường/Xã</span>
              <span class="detail-value">{{  formatWard( asset.address )  }}</span>
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
              <span class="detail-value">{{ asset.plotNumber ?? 'Chưa cập nhật' }} && {{ asset.parcelNumber ?? 'Chưa cập nhật' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Loại đất</span>
              <span class="detail-value">{{ asset.loaiDat }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Diện tích tổng</span>
              <span class="detail-value highlight">{{  formatArea( asset.totalArea) }}</span>
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
              <span class="detail-label">Chiều ngang & chiều dài</span>
              <span class="detail-value text-primary">
              Ngang {{ asset.chieuNgang != null ? formatArea2(asset.chieuNgang) + 'm' : 'Chưa cập nhật' }} ,
              Dài {{ asset.chieuDai != null ? formatArea2(asset.chieuDai) + 'm' : 'Chưa cập nhật' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Loại đất</span>
              <span class="detail-value">{{ asset.loaiDat ?? 'Chưa cập nhật' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Hình dạng/ kết cấu</span>
              <span class="detail-value">{{ asset.structure ?? 'Chưa cập nhật' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Hiện trạng đất</span>
              <span class="detail-value">{{ asset.hienTrangDat ?? 'Chưa cập nhật' }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Lộ giới & Độ rộng đường</span>
              <span class="detail-value">{{ asset.loGioi != null ? asset.loGioi + 'm' : 'Chưa cập nhật' }} &
              {{ asset.doRongDuong != null ? asset.doRongDuong + 'm' : 'Chưa cập nhật' }}</span>
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
              <span class="detail-value highlight">{{ formatArea( asset.floorArea ) }} </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Loại nhà</span>
              <span class="detail-value highlight">{{ asset.loaiNha ?? 'Chưa cập nhật' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Số tầng & Số lầu</span>
              <span class="detail-value">{{ asset.soTang != null ? asset.soTang + ' tầng' : 'Chưa cập nhật' }} &
              {{ asset.soLau != null ? asset.soLau + ' lầu' : 'Chưa cập nhật' }} </span>
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
              <span class="detail-value"> {{ asset.soPhongTam != null ? asset.soPhongTam + ' phòng' : 'Chưa cập nhật' }}</span>
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
            <!-- Nếu có room thì mới hiện table -->
            <table class="executive-table" v-if="asset.rooms && asset.rooms.length > 0">
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

          <div v-else class="table-wrapper">
            <table class="executive-table">
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
                <td class="valuation-round">Lần {{ v.valuationRound }}</td>
                <td>{{ v.effectiveDate }}</td>
                <td><span class="price-valuation">{{ formatMoneyVN( v.totalPrice ) }}</span></td>
                <td><span class="price-valuation">{{  formatMoneyVN( v.totalMaxPrice) }}</span></td>
                <td v-html="renderPriceCompare(asset.desire, v.totalPrice)"> </td>
                <td>
                  <button class="pdf-btn" @click="openPdf(v.pdfFile)">
                    <i class="fa-solid fa-file-pdf"></i>
                    <span>{{ v.pdfFile.fileName }}</span>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <!-- TAB 2 -->
      <div v-if="activeTab === 'FILE'">
        <HopTacMoiGioi />
      </div>



    </div>
  </template>

  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import FileOrLand from "../land/FileOrLand.vue";
  import HopTacMoiGioi from "./HopTacMoiGioi.vue";

  const activeTab = ref("DETAIL") // DETAIL | FILE
  const route = useRoute();
  const router = useRouter();
  const id = route.params.id;
  const activeImage = ref(0);

  const asset = ref(null);
  const rooms = ref([]);
  const pdfUrl = ref(null);

  onMounted(() => loadDetail(id));

  import api from "/src/api/api.js"
  import Spam from "./Spam.vue";

  async function loadDetail(id) {
    try {
      const res = await api.get(`/admin.thg/product/admin/chi-tiet/${id}`);
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
    if (dtcnValue > 10000) return "DATLON";

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

  function formatStatus(status) {
    if (!status) return "—";

    const map = {
      "Chưa định giá": "Chưa định giá",
      "Đã định giá sơ bộ": "Đã định giá sơ bộ",
      "Đã bán": "Đã bán",
      "Bán nhanh 30 ngày": "Bán nhanh 30 ngày"
    };

    return map[status] || status;
  }

  function badgeStatus(status) {
    switch (status) {
      case "Chưa định giá":
        return "badge rounded-pill bg-warning-subtle text-warning-emphasis px-3 py-2";

      case "Đã định giá sơ bộ":
        return "badge rounded-pill bg-primary-subtle text-primary-emphasis px-3 py-2";

      case "Đã bán":
        return "badge rounded-pill bg-secondary-subtle text-secondary-emphasis px-3 py-2 text-decoration-line-through";

      case "Bán nhanh 30N":
        return "badge rounded-pill bg-success-subtle text-success-emphasis px-3 py-2";

      default:
        return "badge rounded-pill bg-light text-dark px-3 py-2";
    }
  }
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
  grid-template-columns: 1fr 1.3fr;
  gap: 24px;
  margin-bottom: 24px;
}

/* ========= GALLERY ========= */
.gallery-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.gallery-wrapper {
  max-width: 920px !important;
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
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  overflow-x: auto;
  padding: 4px 0;
}

.thumbnails-scroll {
  display: flex;
  gap: 12px;
}

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
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
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
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-row:last-child {
  border-bottom: none;
}

.highlight-row {
  background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
  padding: 12px 16px;
  margin: 0 -16px;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 8px;
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
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
}

/* ========= DETAIL SECTIONS ========= */
.detail-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
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
  border-bottom: 2px solid #f1f5f9;
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
}

/* ========= DETAIL GRID ========= */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 32px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
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

/* ========= TABLE ========= */
.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
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

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .main-image-container {
    height: 300px;
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
}

@media (max-width: 480px) {
  .property-address {
    font-size: 18px;
  }

  .thumbnails-scroll {
    gap: 8px;
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
  font-size: 14px;
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
.asset-tabs {
  display: flex;
  gap: 12px;
  margin: 20px 0;
  border-bottom: 1px solid #e5e7eb;
}

.tab-btn {
  background: none;
  border: none;
  padding: 10px 16px;
  font-weight: 600;
  color: #64748b;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all .2s ease;
}

.tab-btn i {
  margin-right: 6px;
}

.tab-btn.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

</style>