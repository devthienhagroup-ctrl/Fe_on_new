<template>
  <div class="container my-4">

    <!-- ==================== HEADER ==================== -->
    <div class="card p-3 shadow-sm mb-4 d-flex justify-content-between align-items-center flex-row">
      <div class="back-btn"
           @click="router.push(`/admin/products/${id}`)"
           style="cursor:pointer; color:#555;">
        <i class="fa-solid fa-arrow-left me-2"></i>
        Quay lại trang chi tiết
      </div>

      <h3 class="fw-bold m-0">
        <i class="fa-solid fa-pen"></i> Cập nhật sản phẩm #{{ id }}
      </h3>
    </div>

    <!-- ==================== THÔNG TIN CHUNG ==================== -->
    <div class="card p-3 shadow-sm mb-4">
      <h5 class="section-title">Thông tin chung</h5>

      <div class="row g-3">
        <div class="col-md-4">
          <label>Loại tài sản</label>
          <select v-model="form.loaiTaiSan" class="form-select">
            <option value="NHA">Nhà</option>
            <option value="DAT">Đất</option>
          </select>
        </div>

        <div class="col-md-8">
          <label>Địa chỉ</label>
          <input v-model="form.address" class="form-control" />
        </div>

        <div class="col-md-6">
          <label>Địa chỉ cũ</label>
          <input v-model="form.oldAddress" class="form-control" />
        </div>

        <div class="col-md-6">
          <label>Mã khu vực</label>
          <input v-model="form.khuVucMa" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Số tờ bản đồ</label>
          <input v-model="form.plotNumber" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Số thửa đất</label>
          <input v-model="form.parcelNumber" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Diện tích tổng (m²)</label>
          <input type="number" v-model="form.totalArea" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Quan hệ sở hữu</label>
          <input v-model="form.ownershipRelation" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Quyền sử dụng đất</label>
          <input v-model="form.landUseRight" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Vị trí đất</label>
          <input v-model="form.landPosition" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Trạng thái</label>
          <input v-model="form.status" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Mức độ mong muốn</label>
          <input type="number" step="0.1" v-model="form.desire" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Giá bán</label>
          <input v-model="form.giaBan" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Giá nội bộ</label>
          <input v-model="form.giaNoiBo" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Phí môi giới</label>
          <input v-model="form.phiMoiGioi" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Đơn vị sở hữu</label>
          <input v-model="form.donViSoHuu" class="form-control" />
        </div>

      </div>
    </div>

    <!-- ==================== THÔNG TIN ĐẤT ==================== -->
    <div class="card p-3 shadow-sm mb-4">
      <h5 class="section-title">Thông tin thửa đất</h5>

      <div class="row g-3">
        <div class="col-md-4">
          <label>Loại đất</label>
          <input v-model="form.loaiDat" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Ngang (m)</label>
          <input type="number" v-model="form.chieuNgang" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Dài (m)</label>
          <input type="number" v-model="form.chieuDai" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Lộ giới</label>
          <input v-model="form.loGioi" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Độ rộng đường</label>
          <input v-model="form.doRongDuong" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Quy hoạch</label>
          <input v-model="form.quyHoach" class="form-control" />
        </div>
      </div>
    </div>

    <!-- ==================== THÔNG TIN NHÀ ==================== -->
    <div class="card p-3 shadow-sm mb-4" v-if="form.loaiTaiSan === 'NHA'">
      <h5 class="section-title">Thông tin nhà</h5>

      <div class="row g-3">
        <div class="col-md-4">
          <label>Số tầng</label>
          <input v-model="form.soTang" type="number" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Số lầu</label>
          <input v-model="form.soLau" type="number" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Năm xây dựng</label>
          <input v-model="form.namXayDung" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Phòng ngủ</label>
          <input v-model="form.soPhongNgu" type="number" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Phòng tắm</label>
          <input v-model="form.soPhongTam" type="number" class="form-control" />
        </div>

        <div class="col-md-4">
          <label>Nội thất</label>
          <input v-model="form.noiThat" class="form-control" />
        </div>

        <div class="col-md-6">
          <label>Kết cấu</label>
          <input v-model="form.structure" class="form-control" />
        </div>

        <div class="col-md-6">
          <label>Diện tích sàn</label>
          <input v-model="form.floorArea" type="number" class="form-control" />
        </div>
      </div>
    </div>

    <!-- ==================== CHI TIẾT PHÒNG ==================== -->
    <div class="card p-3 shadow-sm mb-4" v-if="form.loaiTaiSan === 'NHA'">
      <h5 class="section-title">Chi tiết phòng</h5>

      <table class="table table-bordered">
        <thead>
        <tr>
          <th>Loại phòng</th>
          <th>Số lượng</th>
          <th>Diện tích (m²)</th>
          <th></th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(r, i) in rooms" :key="i">
          <td><input v-model="r.loaiPhong" class="form-control" /></td>
          <td><input v-model="r.soLuong" type="number" class="form-control" /></td>
          <td><input v-model="r.dienTich" type="number" class="form-control" /></td>
          <td>
            <button class="btn btn-sm btn-danger" @click="removeRoom(i)">
              <i class="fa-solid fa-x"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <button class="btn btn-primary btn-sm" @click="addRoom">
        <i class="fa-solid fa-plus"></i> Thêm phòng
      </button>
    </div>

    <!-- ==================== SAVE BTN ==================== -->
    <div class="text-end mb-5">
      <button class="btn btn-success px-4" @click="save">
        <i class="fa-solid fa-floppy-disk"></i> Lưu lại
      </button>
    </div>

  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

// ===== FORM OBJECT =====
const form = ref({
  loaiTaiSan: "",
  phanLoaiHang: "",
  address: "",
  oldAddress: "",
  plotNumber: "",
  parcelNumber: "",
  totalArea: null,
  ownershipRelation: "",
  landUseRight: "",
  landPosition: "",
  status: "",
  desire: null,

  // Giá
  giaBan: "",
  giaNoiBo: "",
  phiMoiGioi: "",
  donViSoHuu: "",

  // khu vực
  khuVucMa: "",

  // ĐẤT
  loaiDat: "",
  chieuNgang: null,
  chieuDai: null,
  loGioi: "",
  doRongDuong: "",
  hinhDangThuaDat: "",
  hienTrangDat: "",
  quyHoach: "",

  // NHÀ
  soLau: null,
  soTang: null,
  soPhongNgu: null,
  soPhongTam: null,
  loaiNha: "",
  noiThat: "",
  hienTrangNha: "",
  namXayDung: "",
  matTienNha: "",
  tongSoPhong: null,
  floorArea: null,
  structure: "",
});

// Rooms (chỉ dùng cho NHA)
const rooms = ref([]);

// fake data
const sampleAssets = [
  {
    id: 1,
    loaiTaiSan: "NHA",
    phanLoaiHang: "BN30N",
    address: "12 Nguyễn Văn Đậu",
    oldAddress: "12 NVD",
    plotNumber: "25",
    parcelNumber: "112",
    totalArea: 68,
    ownershipRelation: "Chính chủ",
    landUseRight: "Lâu dài",
    landPosition: "Mặt tiền",
    status: "Đang bán",
    desire: 5.5,

    giaBan: "6.5 tỷ",
    giaNoiBo: "6.2 tỷ",
    khuVucMa: "BN30N",
    phiMoiGioi: "2%",
    donViSoHuu: "THG",

    loaiDat: "ODT",
    chieuNgang: 4,
    chieuDai: 17,
    loGioi: "16m",
    doRongDuong: "12m",
    hinhDangThuaDat: "Vuông vức",
    hienTrangDat: "Đã xây",
    quyHoach: "Đất ở",

    soLau: 1,
    soTang: 3,
    soPhongNgu: 4,
    soPhongTam: 3,
    loaiNha: "Nhà phố",
    noiThat: "Cơ bản",
    hienTrangNha: "Ở ngay",
    namXayDung: "2018",
    matTienNha: "4m",
    tongSoPhong: 7,
    floorArea: 180,
    structure: "1 trệt 2 lầu",

    rooms: [
      { loaiPhong: "Phòng ngủ", soLuong: 4, dienTich: 12 },
      { loaiPhong: "Phòng tắm", soLuong: 3, dienTich: 6 }
    ]
  },

  // === ĐẤT ===
  {
    id: 6,
    loaiTaiSan: "DAT",
    phanLoaiHang: "HOPTAC",
    address: "Lô B12 Vĩnh Lộc",
    oldAddress: "Thửa 12",
    plotNumber: "05",
    parcelNumber: "211",
    totalArea: 250,
    ownershipRelation: "Chính chủ",
    landUseRight: "Lâu dài",
    landPosition: "Hẻm xe hơi",
    status: "Chưa đăng tin",
    desire: 2.8,

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
    quyHoach: "Cây lâu năm",
    rooms: []
  }
];

// load data
onMounted(() => {
  const data = sampleAssets.find(a => a.id == id);
  if (!data) return;

  Object.assign(form.value, data);
  rooms.value = JSON.parse(JSON.stringify(data.rooms || []));
});

function save() {
  console.log("DATA SUBMIT:", form.value, rooms.value);
  alert("Đã lưu!");
}

function addRoom() {
  rooms.value.push({ loaiPhong: "", soLuong: 1, dienTich: null });
}

function removeRoom(i) {
  rooms.value.splice(i, 1);
}
</script>
<style scoped>
.section-title {
  border-left: 4px solid #6366f1;
  padding-left: 8px;
  margin-bottom: 12px;
  font-weight: 600;
}
</style>
