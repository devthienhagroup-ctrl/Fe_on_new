<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import FileOrLand from "../land/FileOrLand.vue";

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const activeImage = ref(0);

// ========= DATA ==========
const asset = ref(null);
const rooms = ref([]);
const valuations = ref([]);
const pdfUrl = ref(null);

onMounted(() => loadDetail(id));

// ========= SAMPLE DATA ==========
const sampleAssets = ref([
  // ========= NHÀ =========
  {
    id: 1,
    loaiTaiSan: "NHA",
    phanLoaiHang: "BN30N",

    address: "12 Nguyễn Văn Đậu, Phường 5, Quận Phú Nhuận, TP.HCM",
    oldAddress: "12 NVD, P5, PN",
    plotNumber: "25",
    parcelNumber: "112",
    totalArea: 68,
    ownershipRelation: "Chính chủ",
    landUseRight: "Lâu dài",
    landPosition: "Mặt tiền",
    status: "Đang bán",
    desire: 5.6,

    giaBan: "6.5 tỷ",
    giaNoiBo: "6.2 tỷ",

    khuVucMa: "BN30N",
    phiMoiGioi: "2%",
    donViSoHuu: "THG",

    loaiDat: "ODT",
    chieuNgang: 4.2,
    chieuDai: 17,
    loGioi: "16m",
    doRongDuong: "12m",
    hinhDangThuaDat: "Vuông vức",
    hienTrangDat: "Đã xây dựng",
    quyHoach: "Đất ở đô thị",

    soLau: 1,
    soTang: 3,
    soPhongNgu: 4,
    soPhongTam: 3,
    loaiNha: "Nhà phố",
    noiThat: "Cơ bản",
    hienTrangNha: "Ở ngay",
    namXayDung: "2018",
    matTienNha: "4.2m",
    tongSoPhong: 7,
    floorArea: 185,
    structure: "1 trệt 2 lầu",

    slide: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6"
    ],

    fullName: "Nguyễn Văn A",
    phone: "0369 700 951",

    createAt: "2025-01-02",
    updateAt: "2025-01-10",
  },

  // ========= ĐẤT =========
  {
    id: 6,
    loaiTaiSan: "DAT",
    phanLoaiHang: "HOPTAC",

    address: "Lô B12, KDC Vĩnh Lộc, Bình Tân, TP.HCM",
    oldAddress: "Thửa 211, tờ 05",
    plotNumber: "05",
    parcelNumber: "211",
    totalArea: 250,
    ownershipRelation: "Chính chủ",
    landUseRight: "Lâu dài",
    landPosition: "Hẻm xe hơi",
    status: "Chưa đăng tin",
    desire: 3.2,

    giaBan: "3.8 tỷ",
    giaNoiBo: "3.6 tỷ",

    khuVucMa: "HTT",
    phiMoiGioi: "1.5%",
    donViSoHuu: "Đối tác",

    loaiDat: "CLN",
    chieuNgang: 8,
    chieuDai: 32,
    loGioi: "Không vướng",
    doRongDuong: "6m",
    hinhDangThuaDat: "Nở hậu",
    hienTrangDat: "Đất trống",
    quyHoach: "Đất trồng cây lâu năm",

    soLau: null,
    soTang: null,
    soPhongNgu: null,
    soPhongTam: null,
    loaiNha: null,
    noiThat: null,
    hienTrangNha: null,
    namXayDung: null,
    matTienNha: null,
    tongSoPhong: null,
    floorArea: null,
    structure: null,

    slide: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
    ],

    fullName: "Trần Đình Khải",
    phone: "0988 123 456",

    createAt: "2025-01-05",
    updateAt: "2025-01-09",
  }
]);

// ========= Fake API ==========
function loadDetail(id) {
  const data = sampleAssets.value.find(a => a.id == id);
  if (!data) {
    console.error("Không tìm thấy tài sản id =", id);
    return;
  }
  asset.value = data;

  // tạo room mẫu cho nhà
  if (data.loaiTaiSan === "NHA") {
    rooms.value = [
      { loaiPhong: "Phòng ngủ", soLuong: data.soPhongNgu, dienTich: 14 },
      { loaiPhong: "Phòng tắm", soLuong: data.soPhongTam, dienTich: 6 },
      { loaiPhong: "Phòng khách", soLuong: 1, dienTich: 24 },
      { loaiPhong: "Bếp", soLuong: 1, dienTich: 16 },
    ];
  } else {
    rooms.value = [];
  }

  valuations.value = [
    {
      valuationId: 1,
      valuationRound: 1,
      effectiveDate: "2024-04-01",
      totalPrice: 2000000000,
      totalMaxPrice: 2300000000,
      pdfFile: {
        name: "BaoCaoLan1.pdf",
        url: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
      }
    }
  ];
}

// ========= COLOR ==========
const typeColor = (type) => {
  switch (type) {
    case "NHA": return "#6366f1";
    case "DAT": return "#8b5cf6";
  }
};

// ========= HÀM KIỂM TRA MÃ KHU VỰC ==========
const badgeClass = (code) => {
  const map = {
    "BN30N": "bg-red-200 badge-text-red",
    "HTT": "bg-green-200 badge-text-green",
    "HOPTAC": "bg-yellow-200 badge-text-yellow"
  };

  return map[code] || "bg-gray-200 badge-text-gray";
};

const parsedAddress = computed(() => {
  if (!asset.value?.address) return { street: "", ward: "", area: "" };

  const parts = asset.value.address.split(",").map(p => p.trim());

  return {
    street: parts[0] || "",
    ward: parts[1] || "",
    area: parts.slice(2).join(", ") || ""   // gộp quận/huyện + tỉnh/tp
  };
});

</script>

<template>
  <div v-if="asset" class="container my-4">

    <!-- HEADER -->
    <div class="card p-3 mb-4 shadow-sm header-card"
         :style="{ borderLeft: '6px solid ' + typeColor(asset.loaiTaiSan)}">

      <div class="d-flex justify-content-between align-items-start">
        <div>
          <div class="back-btn mb-1" @click="router.push('/test01')">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Quay lại danh sách sản phẩm hệ thống</span>
          </div>

          <h3 class="fw-bold mb-1">{{ asset.address }}</h3>

          <div class="text-muted d-flex align-items-center gap-3 flex-wrap">
            <span class="d-flex align-items-center gap-1">
              Loại mặt hàng:
              <span :class="['khu-vuc-badge', badgeClass(asset.phanLoaiHang)]">
                {{ asset.phanLoaiHang }}
              </span>
            </span>
            |
            <span class="d-flex align-items-center gap-1">
              Giá bán:
              <span class="gia-ban fw-bold">{{ asset.giaBan }}</span>
            </span>
            |
            <span class="d-flex align-items-center gap-1">
              Giá nội bộ:
              <span class="gia-noi-bo fw-bold">{{ asset.giaNoiBo }}</span>
            </span>
          </div>
        </div>

        <div>
          <button class="btn btn-outline-primary btn-sm me-2"
                  @click="$router.push(`/admin/product/update/${asset.id}`)">
            <i class="fa-solid fa-pen"></i> Chỉnh sửa
          </button>
          <button class="btn btn-outline-primary btn-sm me-2">
            <i class="fa-regular fa-newspaper"></i> Tin tức
          </button>
        </div>
      </div>
    </div>

    <!-- GALLERY + THÔNG TIN -->
    <div class="row">

      <!-- Gallery -->
      <div class="col-md-7">
        <div class="gallery mb-4">
          <div class="main-image">
            <img :src="asset.slide[activeImage]" />
          </div>

          <div class="thumb-list">
            <img
                v-for="(img, i) in asset.slide"
                :src="img"
                :key="i"
                @click="activeImage = i"
                :class="{ active_thumb: activeImage === i }"
            />
          </div>
        </div>
      </div>

      <!-- Thông tin chung -->
      <div class="col-md-5">
        <div class="card p-3 shadow-sm">
          <h4 class="section-title" style="font-weight: 700">Thông tin chung</h4>

          <ul class="info-list">
            <li><b>Loại tài sản:</b> {{ asset.loaiTaiSan }}</li>
            <li><b>Giá bán:</b> <span class="gia-ban fw-bold">{{ asset.giaBan }}</span></li>
            <li><b>Giá nội bộ:</b> <span class="gia-noi-bo fw-bold">{{ asset.giaNoiBo }}</span></li>
            <li><b>Loại đất:</b> {{ asset.loaiDat }}</li>
            <li><b>Chủ sở hữu:</b> {{ asset.fullName }} ({{ asset.phone }})</li>
            <li>
              <b>Đơn vị sở hữu:</b>
              <span class="d-inline-flex align-items-center gap-1">
                <span>{{ asset.donViSoHuu }}</span>
                <img v-if="asset.donViSoHuu === 'THG'" src="/imgs/logokn.png" alt="THG" class="donvi-logo">
                <i v-else-if="asset.donViSoHuu === 'Đối tác'" class="fa-solid fa-handshake text-primary"></i>
              </span>
            </li>
            <li><b>Phí môi giới:</b> {{ asset.phiMoiGioi }}</li>
          </ul>

          <FileOrLand :entity-type="'LAND'" :entity-id="asset.id" :file-list="[]" />
        </div>
      </div>
    </div>

    <!-- BLOCK THÔNG TIN PHÁP LÝ – CHUNG CHO NHÀ & ĐẤT -->
    <div class="section-card section-legal">
      <h4 class="section-title-with-icon">
        <i class="fa-solid fa-scale-balanced"></i>
        Thông tin pháp lý & quản trị
      </h4>

      <ul class="info-list three-column">
        <li><b>Đường:</b> {{ parsedAddress.street }}</li>
        <li><b>Phường/Xã:</b> {{ parsedAddress.ward }}</li>
        <li><b>Khu vực:</b> {{ parsedAddress.area }}</li>

        <li><b>Địa chỉ cũ:</b> {{ asset.oldAddress }}</li>
        <li><b>Số tờ bản đồ:</b> {{ asset.plotNumber }}</li>

        <li><b>Số thửa đất:</b> {{ asset.parcelNumber }}</li>
        <li><b>Diện tích tổng:</b> {{ asset.totalArea }} m²</li>
        <li><b>Quan hệ sở hữu:</b> {{ asset.ownershipRelation }}</li>

        <li><b>Quyền sử dụng đất:</b> {{ asset.landUseRight }}</li>
        <li><b>Vị trí:</b> {{ asset.landPosition }}</li>
        <li><b>Trạng thái:</b> {{ asset.status }}</li>

        <li><b>Mức độ mong muốn:</b> {{ asset.desire }}</li>
      </ul>
    </div>

    <!-- BLOCK NHÀ -->
    <div class="section-card section-house" v-if="asset.loaiTaiSan === 'NHA'">
      <h4 class="section-title-with-icon">
        <i class="fa-solid fa-house-chimney"></i>
        Kích thước & Kết cấu (Nhà)
      </h4>

      <ul class="info-list three-column">
        <li><b>Ngang:</b> {{ asset.chieuNgang }}m</li>
        <li><b>Dài:</b> {{ asset.chieuDai }}m</li>
        <li><b>Diện tích sàn:</b> {{ asset.floorArea }} m²</li>

        <li><b>Kết cấu:</b> {{ asset.structure }}</li>
        <li><b>Số tầng:</b> {{ asset.soTang }}</li>
        <li><b>Số lầu:</b> {{ asset.soLau }}</li>

        <li><b>Phòng ngủ:</b> {{ asset.soPhongNgu }}</li>
        <li><b>Phòng tắm:</b> {{ asset.soPhongTam }}</li>
        <li><b>Năm xây dựng:</b> {{ asset.namXayDung }}</li>

        <li><b>Nội thất:</b> {{ asset.noiThat }}</li>
        <li><b>Mặt tiền:</b> {{ asset.matTienNha }}</li>
        <li><b>Tổng số phòng:</b> {{ asset.tongSoPhong }}</li>
      </ul>
    </div>

    <!-- BLOCK ĐẤT -->
    <div class="section-card section-land" v-if="asset.loaiTaiSan === 'DAT'">
      <h4 class="section-title-with-icon">
        <i class="fa-solid fa-mountain-sun"></i>
        Thông tin thửa đất
      </h4>

      <ul class="info-list three-column">
        <li><b>Ngang:</b> {{ asset.chieuNgang }}m</li>
        <li><b>Dài:</b> {{ asset.chieuDai }}m</li>
        <li><b>Diện tích:</b> {{ asset.totalArea }} m²</li>

        <li><b>Loại đất:</b> {{ asset.loaiDat }}</li>
        <li><b>Hình dạng:</b> {{ asset.hinhDangThuaDat }}</li>
        <li><b>Hiện trạng:</b> {{ asset.hienTrangDat }}</li>

        <li><b>Lộ giới:</b> {{ asset.loGioi }}</li>
        <li><b>Độ rộng đường:</b> {{ asset.doRongDuong }}</li>
        <li><b>Quy hoạch:</b> {{ asset.quyHoach }}</li>
      </ul>
    </div>

    <!-- CHI TIẾT PHÒNG -->
    <div class="section-card section-rooms" v-if="asset.loaiTaiSan === 'NHA'">
      <h4 class="section-title-with-icon">
        <i class="fa-solid fa-door-closed"></i>
        Chi tiết phòng
      </h4>

      <table class="table">
        <thead>
        <tr>
          <th>Loại phòng</th>
          <th>Số lượng</th>
          <th>Diện tích</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(r, index) in rooms" :key="index">
          <td>{{ r.loaiPhong }}</td>
          <td>{{ r.soLuong }}</td>
          <td>{{ r.dienTich }} m²</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- LỊCH SỬ ĐỊNH GIÁ -->
    <div class="section-card section-valuation">
      <h4 class="section-title-with-icon">
        <i class="fa-solid fa-chart-line"></i>
        Lịch sử định giá
      </h4>

      <table class="table table-bordered small">
        <thead class="table-light">
        <tr>
          <th>Lần</th>
          <th>Ngày hiệu lực</th>
          <th>Tổng giá</th>
          <th>Cao nhất</th>
          <th>File PDF</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="v in valuations" :key="v.valuationId">
          <td>Định giá lần {{ v.valuationRound }}</td>
          <td>{{ v.effectiveDate }}</td>
          <td><span class="gia-dinh-gia">{{ (v.totalPrice/1e9).toFixed(2) }} tỷ</span></td>
          <td><span class="gia-dinh-gia">{{ (v.totalMaxPrice/1e9).toFixed(2) }} tỷ</span></td>
          <td>
            <button class="btn btn-sm btn-outline-primary"
                    @click="pdfUrl = v.pdfFile.url">
              <i class="fa-solid fa-file-pdf"></i> {{ v.pdfFile.name }}
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- PDF REVIEW -->
    <div v-if="pdfUrl" class="pdf-modal">
      <div class="pdf-backdrop" @click="pdfUrl=null"></div>

      <div class="pdf-viewer">
        <iframe :src="pdfUrl"></iframe>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ========= MÀU SẮC GIÁ ========= */
.gia-ban {
  color: #dc2626; /* Red-600 */
  font-weight: 700;
}

.gia-noi-bo {
  color: #052796; /* Emerald-600 */
  font-weight: 700;
}

.gia-dinh-gia {
  color: #7c3aed; /* Violet-600 */
  font-weight: 700;
}

/* ========= HIỆU ỨNG KHU VỰC ========= */
.khu-vuc-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.khu-vuc-bn30n {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: 2px solid #3b82f6;
}

.khu-vuc-htt {
  background: linear-gradient(135deg, #10b981, #047857);
  color: white;
  border: 2px solid #10b981;
}

.khu-vuc-hoptac {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: 2px solid #f59e0b;
}

.khu-vuc-default {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: white;
  border: 2px solid #6b7280;
}

/* Hiệu ứng hover */
.khu-vuc-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* ========= LOGO ĐƠN VỊ ========= */
.donvi-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* ========= CARD SECTION STYLES ========= */
.section-card,
.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
  margin-bottom: 20px;
}

/* ========= TIÊU ĐỀ SECTION ========= */
.section-title-with-icon {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  margin: -20px -20px 20px -20px;
  border-radius: 12px 12px 0 0;
  font-weight: 700;
  font-size: 1.25rem;
}

/* Màu nền cho từng tiêu đề */
.section-legal .section-title-with-icon {
  background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.section-house .section-title-with-icon {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.section-land .section-title-with-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.section-rooms .section-title-with-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.section-valuation .section-title-with-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-legal {
  border-left: 5px solid #0ea5e9;   /* xanh biển */
}

.section-house {
  border-left: 5px solid #10b981;   /* xanh lá */
}

.section-land {
  border-left: 5px solid #f59e0b;   /* vàng cam */
}

.section-rooms {
  border-left: 5px solid #8b5cf6;   /* tím */
}

.section-valuation {
  border-left: 5px solid #ef4444;   /* đỏ */
}

/* Icon trong tiêu đề */
.section-title-with-icon i {
  font-size: 1.4rem;
}

/* ========= CÁC STYLES KHÁC ========= */

/* PDF modal */
.pdf-modal {
  position: fixed;
  inset: 0;
  z-index: 9990;
}
.pdf-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
}
.pdf-viewer {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 90%;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

/* Gallery */
.gallery {
  display: flex;
  gap: 15px;
}

/* Ảnh lớn */
.main-image {
  flex: 7;
}

.main-image img {
  width: 100%;
  height: 320px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Thumbnail right side */
.thumb-list {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

/* ảnh nhỏ */
.thumb-list img {
  width: 100%;
  height: 70px;
  border-radius: 6px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  transition: .2s;
}

/* active */
.thumb-list img.active_thumb {
  border-color: #6366f1;
  box-shadow: 0 0 8px rgba(99,102,241,0.55);
  opacity: 0.92;
}

/* 3 column info */
.three-column {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 20px;
}

@media (max-width: 992px) {
  .three-column {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .three-column {
    grid-template-columns: 1fr;
  }
}

/* Back button */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #2563eb;
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 6px;
  transition: .2s;
}
.back-btn:hover {
  background: rgba(37, 99, 235, 0.12);
  transform: translateX(-3px);
}
.back-btn i {
  font-size: 17px;
}

/* Info list styling */
.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.info-list li:last-child {
  border-bottom: none;
}

/* Table styling */
.table {
  margin-bottom: 0;
}

.table thead th {
  background-color: rgba(0,0,0,0.02);
  border-bottom: 2px solid rgba(0,0,0,0.1);
}
/* Màu nền */
.bg-purple-50 {
  background-color: #faf5ff;
}
.badge-text-red {
  color: #991b1b !important; /* red-800 */
}
.badge-text-blue {
  color: #1e3a8a !important; /* blue-800 */
}
.badge-text-green {
  color: #065f46 !important; /* green-800 */
}
.badge-text-yellow {
  color: #854d0e !important; /* yellow-800 */
}
.badge-text-purple {
  color: #5b21b6 !important; /* purple-800 */
}
</style>