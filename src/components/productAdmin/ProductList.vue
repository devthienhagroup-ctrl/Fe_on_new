<template>
  <div class="container-fluid py-3">

    <h4 class="fw-bold mb-3">Quản lý tài sản (Admin)</h4>

    <!-- ============ BỘ LỌC ============ -->
    <div class="card shadow-sm mb-3 border-0">
      <div class="card-body py-2">
        <div class="row g-2 align-items-end small">

          <!-- Mức giá -->
          <div class="col-md-2 col-6">
            <label class="form-label form-label-sm">
              <i class="fa-solid fa-dollar-sign me-1"></i>Mức giá
            </label>
            <select v-model="filterGiaRange" class="form-select form-select-sm">
              <option value="">Tất cả</option>
              <option value="1-3">1 - 3 tỷ</option>
              <option value="3-5">3 - 5 tỷ</option>
              <option value="5-7">5 - 7 tỷ</option>
              <option value="7-10">7 - 10 tỷ</option>
              <option value=">10">> 10 tỷ</option>
            </select>
          </div>

          <!-- Tỉnh thành -->
          <div class="col-md-2 col-6">
            <label class="form-label form-label-sm">
              <i class="fa-solid fa-city me-1"></i>Tỉnh thành
            </label>
            <select v-model="filterProvince" class="form-select form-select-sm">
              <option value="">Tất cả</option>
              <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>

          <!-- Phường/xã -->
          <div class="col-md-2 col-6">
            <label class="form-label form-label-sm">
              <i class="fa-solid fa-location-dot me-1"></i>Phường/xã
            </label>
            <select v-model="filterWard" class="form-select form-select-sm">
              <option value="">Tất cả</option>
              <option v-for="w in wards" :key="w" :value="w">{{ w }}</option>
            </select>
          </div>

          <!-- Đường -->
          <div class="col-md-2 col-6">
            <label class="form-label form-label-sm">
              <i class="fa-solid fa-road me-1"></i>Đường
            </label>
            <input
                v-model="filterStreet"
                class="form-control form-control-sm"
                placeholder="Tên đường"
            />
          </div>

          <!-- Nhu cầu -->
          <div class="col-md-2 col-6">
            <label class="form-label form-label-sm">
              <i class="fa-solid fa-tag me-1"></i>Nhu cầu
            </label>
            <select v-model="filterNhuCau" class="form-select form-select-sm">
              <option value="">Tất cả</option>
              <option v-for="n in uniqueNhuCau" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>

          <!-- DTCN -->
          <div class="col-md-2 col-6">
            <label class="form-label form-label-sm">
              <i class="fa-solid fa-ruler-combined me-1"></i>DTCN
            </label>
            <input
                v-model="filterDTCN"
                class="form-control form-control-sm"
                placeholder="DTCN"
            />
          </div>

          <!-- Vị trí -->
          <div class="col-md-2 col-6">
            <label class="form-label form-label-sm">
              <i class="fa-solid fa-location-arrow me-1"></i>Vị trí
            </label>
            <select v-model="filterViTri" class="form-select form-select-sm">
              <option value="">Tất cả</option>
              <option value="Mặt tiền">Mặt tiền</option>
              <option value="Hẻm">Hẻm</option>
              <option value="Chưa cập nhật">Chưa cập nhật</option>
            </select>
          </div>

          <!-- Ngày tạo -->
          <div class="col-md-2 col-6">
            <label class="form-label form-label-sm">
              <i class="fa-regular fa-calendar-plus me-1"></i>Ngày tạo
            </label>
            <input
                type="date"
                v-model="filterCreateDate"
                class="form-control form-control-sm"
            />
          </div>

          <!-- Ngày cập nhật -->
          <div class="col-md-2 col-6">
            <label class="form-label form-label-sm">
              <i class="fa-regular fa-calendar-check me-1"></i>Ngày cập nhật
            </label>
            <input
                type="date"
                v-model="filterUpdateDate"
                class="form-control form-control-sm"
            />
          </div>

          <!-- Nút tìm kiếm -->
          <div class="col-md-2 col-12 d-grid mt-2 mt-md-4">
            <button class="btn btn-primary btn-sm">
              <i class="fa-solid fa-magnifying-glass me-1"></i>Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ BẢNG DANH SÁCH ============ -->
    <div class="table-responsive rounded-3 shadow-sm">
      <table class="table table-borderless table-hover table-sm align-middle mb-0">
        <thead class="bg-light small">
        <tr>
          <th>STT</th>
          <th>Tên chủ nhà</th>
          <th>Số điện thoại</th>
          <th>Giá bán</th>
          <th>Định giá</th>
          <th>Địa chỉ</th>
          <th>Đường</th>
          <th>Phường/xã</th>
          <th>Khu vực</th>
          <th>Vị trí</th>
          <th>DTCN</th>
          <th>DT Sàn</th>
          <th>Ngang</th>
          <th>Dài</th>
          <th>Kết cấu</th>
          <th>Nhu cầu</th>
          <th>Phí môi giới</th>
          <th>Đơn vị</th>
          <th>Ngày tạo</th>
          <th>Ngày cập nhật</th>
          <th class="text-center">
            <i class="fa-regular fa-eye"></i>
          </th>
        </tr>
        </thead>

        <tbody class="small">
        <tr v-for="(item, idx) in filteredAssets" :key="idx">
          <td>{{ idx + 1 }}</td>
          <td>{{ item.tenChuNha }}</td>
          <td>{{ item.soDienThoai }}</td>
          <td>{{ item.giaBan }}</td>
          <td>{{ item.dinhGia }}</td>
          <td>{{ item.addressDetail }}</td>
          <td>{{ item.duong }}</td>
          <td>{{ item.ward }}</td>

          <!-- khu vực badge màu -->
          <td>
              <span class="badge px-2" :class="badgeClass(item.khuVuc)">
                {{ item.khuVuc }}
              </span>
          </td>

          <td>{{ item.viTri }}</td>
          <td>{{ item.dtcn }}</td>
          <td>{{ item.dtsan }}</td>
          <td>{{ item.ngang }}</td>
          <td>{{ item.dai }}</td>
          <td>{{ item.ketCau }}</td>

          <!-- nhu cầu badge màu -->
          <td>
              <span class="badge px-2" :class="badgeClass(item.nhuCau)">
                {{ item.nhuCau }}
              </span>
          </td>

          <td>{{ item.phiMoiGioi }}</td>

          <td>
              <span v-if="item.donVi === 'THG'" class="badge bg-primary px-2">
                THG
              </span>
            <span v-else class="badge bg-warning text-dark px-2">
                Đối tác
              </span>
          </td>

          <td>{{ item.createAt }}</td>
          <td>{{ item.updateAt }}</td>

          <td class="text-center">
            <button class="btn btn-outline-primary btn-sm rounded-pill">
              <i class="fa-regular fa-eye"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import addressData from "/src/assets/js/address.json";

// ========== MOCK DATA (ít nhất 5 dòng, dựa trên bảng bạn gửi) ==========
const landAssets = ref([
  {
    tenChuNha: "Nguyễn Minh Nam", soDienThoai: "0369 700 951",
    giaBan: "2 tỷ/Căn", giaTriTy: 2, dinhGia: "30vnđ",
    dtcn: "20m2", dtsan: "900m2", ngang: "10m", dai: "30m",
    ketCau: "1 trệt 3 lầu", viTri: "Chưa cập nhật",
    addressDetail: "36", duong: "đường D5", ward: "Phường Thạnh Mỹ Tây",
    province: "Thành phố Hồ Chí Minh", khuVuc: "BG30N", nhuCau: "BG30N",
    phiMoiGioi: "2%", donVi: "THG",
    createAt: "2025-01-01", updateAt: "2025-01-05"
  },
  {
    tenChuNha: "Nguyễn Hữu Tình", soDienThoai: "123456789",
    giaBan: "3.61 tỷ/Căn", giaTriTy: 3.61, dinhGia: "3.2 tỷ",
    dtcn: "120m2", dtsan: "320m2", ngang: "40m", dai: "80m",
    ketCau: "1 trệt 3 lầu", viTri: "Mặt tiền",
    addressDetail: "23", duong: "đường Trần Não", ward: "Phường Khánh Hội",
    province: "Thành phố Hồ Chí Minh", khuVuc: "GTT", nhuCau: "GTT",
    phiMoiGioi: "2%", donVi: "THG",
    createAt: "2025-01-02", updateAt: "2025-01-06"
  },
  {
    tenChuNha: "Nguyễn Hữu Tuấn", soDienThoai: "0923456111",
    giaBan: "5.8 tỷ/Căn", giaTriTy: 5.8, dinhGia: "1 tỷ",
    dtcn: "100m2", dtsan: "100m2", ngang: "10m", dai: "10m",
    ketCau: "1 trệt 3 lầu", viTri: "Chưa cập nhật",
    addressDetail: "45", duong: "đường Lê Quang Định", ward: "Phường Chợ Lớn",
    province: "Thành phố Hồ Chí Minh", khuVuc: "BG7N", nhuCau: "BG7N",
    phiMoiGioi: "2%", donVi: "THG",
    createAt: "2025-01-03", updateAt: "2025-01-07"
  },
  {
    tenChuNha: "Nguyễn Hữu Tình", soDienThoai: "123456789",
    giaBan: "580000vnđ/m2", giaTriTy: 0.58, dinhGia: "3 tỷ",
    dtcn: "200m2", dtsan: "40m2", ngang: "5m", dai: "8m",
    ketCau: "1 trệt 2 lầu", viTri: "Hẻm",
    addressDetail: "23/1", duong: "đường Lê Nin", ward: "Phường Phú Định",
    province: "Thành phố Hồ Chí Minh", khuVuc: "BG15N", nhuCau: "BG15N",
    phiMoiGioi: "3%", donVi: "THG",
    createAt: "2025-01-04", updateAt: "2025-01-08"
  },
  {
    tenChuNha: "Nguyễn Hữu Tình", soDienThoai: "123456789",
    giaBan: "10.99 triệu/Tháng", giaTriTy: 0.01099, dinhGia: "1 tỷ",
    dtcn: "100m2", dtsan: "900m2", ngang: "10m", dai: "30m",
    ketCau: "1 trệt 3 lầu", viTri: "Mặt tiền",
    addressDetail: "14", duong: "đường số 2", ward: "Phường Bảo An",
    province: "Tỉnh Khánh Hòa", khuVuc: "BG30N", nhuCau: "BG30N",
    phiMoiGioi: "2%", donVi: "Đối tác",
    createAt: "2025-01-05", updateAt: "2025-01-09"
  }
]);

// ========== STATE FILTER ==========
const filterGiaRange = ref("");
const filterProvince = ref("");
const filterWard = ref("");
const filterStreet = ref("");
const filterNhuCau = ref("");
const filterDTCN = ref("");
const filterViTri = ref("");
const filterCreateDate = ref("");
const filterUpdateDate = ref("");

// Tỉnh / phường / nhu cầu
const provinces = computed(() => addressData.map(x => x.name));
const wards = computed(() => [...new Set(landAssets.value.map(x => x.ward))]);
const uniqueNhuCau = computed(() => [...new Set(landAssets.value.map(x => x.nhuCau))]);

// Badge màu cho BG30N, BG15N, BG7N, GTT, GMM...
const badgeClass = (code) => {
  if (code === "BG30N") return "bg-danger";
  if (code === "BG15N") return "bg-warning text-dark";
  if (code === "BG7N") return "bg-success";
  if (code === "GTT") return "bg-primary";
  if (code === "GMM") return "bg-purple";
  return "bg-secondary";
};

// Helper parse date
const toDate = (d) => (d ? new Date(d) : null);

// Lọc theo khoảng giá (dùng giaTriTy)
const matchGiaRange = (asset) => {
  const v = asset.giaTriTy;
  if (!filterGiaRange.value || v == null) return true;

  switch (filterGiaRange.value) {
    case "1-3": return v >= 1 && v < 3;
    case "3-5": return v >= 3 && v < 5;
    case "5-7": return v >= 5 && v < 7;
    case "7-10": return v >= 7 && v < 10;
    case ">10": return v >= 10;
    default: return true;
  }
};

// Danh sách sau khi lọc
const filteredAssets = computed(() =>
    landAssets.value.filter(x => {
      if (!matchGiaRange(x)) return false;
      if (filterProvince.value && x.province !== filterProvince.value) return false;
      if (filterWard.value && x.ward !== filterWard.value) return false;
      if (filterStreet.value && !x.duong.toLowerCase().includes(filterStreet.value.toLowerCase())) return false;
      if (filterNhuCau.value && x.nhuCau !== filterNhuCau.value) return false;
      if (filterViTri.value && x.viTri !== filterViTri.value) return false;
      if (filterDTCN.value && !x.dtcn.toLowerCase().includes(filterDTCN.value.toLowerCase())) return false;

      if (filterCreateDate.value) {
        const c = toDate(x.createAt);
        const f = toDate(filterCreateDate.value);
        if (!c || c < f) return false;
      }

      if (filterUpdateDate.value) {
        const u = toDate(x.updateAt);
        const f2 = toDate(filterUpdateDate.value);
        if (!u || u < f2) return false;
      }

      return true;
    })
);
</script>

<style scoped>
.table {
  font-size: 13px;
}

.badge {
  border-radius: 999px;
  font-size: 11px;
}

.bg-purple {
  background-color: #9c27b0;
}

.form-label-sm {
  font-size: 12px;
  margin-bottom: 2px;
}
</style>
