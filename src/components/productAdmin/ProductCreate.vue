<template>
  <div class="container py-4">
    <div class="bg-light border rounded-3 shadow-sm p-4 p-md-5">
      <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <p class="text-muted mb-1">Quản lý tài sản</p>
          <h1 class="h4 mb-0 fw-bold">Tạo mới tài sản</h1>
        </div>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-outline-secondary" @click="$router.back()">
            <i class="fa-solid fa-arrow-left me-2"></i>Quay lại
          </button>
          <button type="button" class="btn btn-outline-warning" @click="resetForm">
            <i class="fa-solid fa-rotate-left me-2"></i>Đặt lại
          </button>
          <button type="button" class="btn btn-primary" :disabled="isSubmitting" @click="submitForm">
            <i class="fa-solid fa-floppy-disk me-2"></i>{{ isSubmitting ? 'Đang gửi...' : 'Lưu' }}
          </button>
        </div>
      </div>

      <form @submit.prevent class="needs-validation" novalidate>
        <!-- Thông tin cơ bản -->
        <section class="mb-4">
          <div class="d-flex align-items-center mb-3">
            <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 36px; height: 36px;">
              <i class="fa-solid fa-info"></i>
            </div>
            <h2 class="h5 mb-0">Thông tin cơ bản</h2>
          </div>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label fw-semibold">Loại tài sản *</label>
              <select class="form-select" v-model="form.loaiTaiSan">
                <option value="">-- Chọn loại --</option>
                <option value="NHA">Nhà</option>
                <option value="DAT">Đất</option>
                <option value="DATLON">Đất lớn</option>
              </select>
              <small v-if="errors.loaiTaiSan" class="text-danger">{{ errors.loaiTaiSan }}</small>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Phân loại hàng *</label>
              <select class="form-select" v-model="form.phanLoaiHang">
                <option value="">-- Chọn phân loại --</option>
                <option value="BN30N">Bán nhanh 30 ngày</option>
                <option value="HOPTAC">Hợp tác</option>
                <option value="HTT">Hàng thị trường</option>
              </select>
              <small v-if="errors.phanLoaiHang" class="text-danger">{{ errors.phanLoaiHang }}</small>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Đơn vị sở hữu *</label>
              <select class="form-select" v-model="form.donViSoHuu">
                <option value="">-- Chọn đơn vị --</option>
                <option value="THG">THG</option>
                <option value="DT">Đối tác</option>
              </select>
              <small v-if="errors.donViSoHuu" class="text-danger">{{ errors.donViSoHuu }}</small>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Địa chỉ *</label>
              <input type="text" class="form-control" v-model.trim="form.address" placeholder="Số nhà, đường, phường/xã">
              <small v-if="errors.address" class="text-danger">{{ errors.address }}</small>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Địa chỉ cũ</label>
              <input type="text" class="form-control" v-model.trim="form.oldAddress" placeholder="Địa chỉ cũ (nếu có)">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Số thửa</label>
              <input type="text" class="form-control" v-model.trim="form.plotNumber">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Số tờ</label>
              <input type="text" class="form-control" v-model.trim="form.parcelNumber">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Tổng diện tích (m²)</label>
              <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.totalArea">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Quan hệ sở hữu</label>
              <input type="text" class="form-control" v-model.trim="form.ownershipRelation">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Quyền sử dụng đất</label>
              <input type="text" class="form-control" v-model.trim="form.landUseRight">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Tình trạng</label>
              <input type="text" class="form-control" v-model.trim="form.status">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Độ rộng đường (m)</label>
              <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.doRongDuong">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Lộ giới (m)</label>
              <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.loGioi">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Diện tích sàn (m²)</label>
              <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.floorArea">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Giá bán *</label>
              <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.giaBan">
              <small v-if="errors.giaBan" class="text-danger">{{ errors.giaBan }}</small>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Giá nội bộ</label>
              <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.giaNoiBo">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Khu vực mã</label>
              <input type="text" class="form-control" v-model.trim="form.khuVucMa">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Phí môi giới (%)</label>
              <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.phiMoiGioi">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Kỳ vọng (tỷ)</label>
              <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.desire">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Hiển thị</label>
              <select class="form-select" v-model="form.show">
                <option :value="true">Hiển thị</option>
                <option :value="false">Ẩn</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Thông tin vị trí -->
        <section class="mb-4">
          <div class="d-flex align-items-center mb-3">
            <div class="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 36px; height: 36px;">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <h2 class="h5 mb-0">Thông tin vị trí</h2>
          </div>
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label fw-semibold">Vị trí đất</label>
              <input type="text" class="form-control" v-model.trim="form.landPosition">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Loại đất</label>
              <input type="text" class="form-control" v-model.trim="form.loaiDat">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Hình dạng thửa đất</label>
              <input type="text" class="form-control" v-model.trim="form.hinhDangThuaDat">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Hiện trạng đất</label>
              <input type="text" class="form-control" v-model.trim="form.hienTrangDat">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Quy hoạch</label>
              <input type="text" class="form-control" v-model.trim="form.quyHoach">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Chiều ngang (m)</label>
              <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.chieuNgang">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Chiều dài (m)</label>
              <input type="number" min="0" step="0.01" class="form-control" v-model.number="form.chieuDai">
            </div>
          </div>
        </section>

        <!-- Thông tin nhà -->
        <section v-if="isHouse" class="mb-4">
          <div class="d-flex align-items-center mb-3">
            <div class="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 36px; height: 36px;">
              <i class="fa-solid fa-house"></i>
            </div>
            <h2 class="h5 mb-0">Thông tin nhà</h2>
          </div>
          <div class="row g-3">
            <div class="col-md-3">
              <label class="form-label fw-semibold">Số lầu</label>
              <input type="number" min="0" class="form-control" v-model.number="form.soLau">
            </div>
            <div class="col-md-3">
              <label class="form-label fw-semibold">Số tầng</label>
              <input type="number" min="0" class="form-control" v-model.number="form.soTang">
            </div>
            <div class="col-md-3">
              <label class="form-label fw-semibold">Mặt tiền nhà</label>
              <input type="number" min="0" class="form-control" v-model.number="form.matTienNha">
            </div>
            <div class="col-md-3">
              <label class="form-label fw-semibold">Tổng số phòng</label>
              <input type="number" min="0" class="form-control" v-model.number="form.tongSoPhong">
            </div>
            <div class="col-md-3">
              <label class="form-label fw-semibold">Số phòng ngủ</label>
              <input type="number" min="0" class="form-control" v-model.number="form.soPhongNgu">
            </div>
            <div class="col-md-3">
              <label class="form-label fw-semibold">Số phòng tắm</label>
              <input type="number" min="0" class="form-control" v-model.number="form.soPhongTam">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Loại nhà</label>
              <input type="text" class="form-control" v-model.trim="form.loaiNha">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Nội thất</label>
              <input type="text" class="form-control" v-model.trim="form.noiThat">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Hiện trạng nhà</label>
              <input type="text" class="form-control" v-model.trim="form.hienTrangNha">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Năm xây dựng</label>
              <input type="text" class="form-control" v-model.trim="form.namXayDung">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Kết cấu</label>
              <input type="text" class="form-control" v-model.trim="form.structure">
            </div>
          </div>
        </section>

        <!-- Danh sách phòng -->
        <section class="mb-4">
          <div class="d-flex align-items-center mb-3 justify-content-between flex-wrap gap-2">
            <div class="d-flex align-items-center">
              <div class="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 36px; height: 36px;">
                <i class="fa-solid fa-door-open"></i>
              </div>
              <h2 class="h5 mb-0">Danh sách phòng</h2>
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary" @click="addRoom">
              <i class="fa-solid fa-plus me-2"></i>Thêm phòng
            </button>
          </div>
          <div class="table-responsive">
            <table class="table align-middle table-bordered bg-white">
              <thead class="table-light">
              <tr>
                <th style="min-width: 140px">Loại phòng</th>
                <th style="width: 140px">Số lượng</th>
                <th style="width: 160px">Diện tích (m²)</th>
                <th>Mô tả</th>
                <th style="width: 80px"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(room, index) in form.rooms" :key="index">
                <td><input type="text" class="form-control" v-model.trim="room.loaiPhong" placeholder="Phòng ngủ"></td>
                <td><input type="number" min="0" class="form-control" v-model.number="room.soLuong"></td>
                <td><input type="number" min="0" step="0.01" class="form-control" v-model.number="room.dienTich"></td>
                <td><input type="text" class="form-control" v-model.trim="room.moTa" placeholder="Ghi chú"></td>
                <td class="text-center">
                  <button type="button" class="btn btn-sm btn-outline-danger" @click="removeRoom(index)" :disabled="form.rooms.length === 1">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Thông tin chủ tài sản -->
        <section class="mb-4">
          <div class="d-flex align-items-center mb-3">
            <div class="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 36px; height: 36px;">
              <i class="fa-solid fa-user"></i>
            </div>
            <h2 class="h5 mb-0">Thông tin chủ tài sản</h2>
          </div>
          <div class="row g-3">
            <div class="col-md-4" v-if="isLookupMode">
              <label class="form-label fw-semibold">Tìm chủ (phone/email) *</label>
              <input type="text" class="form-control" v-model.trim="ownerSearch" @blur="handleOwnerLookup" placeholder="Nhập số điện thoại hoặc email">
              <small v-if="ownerLookupMessage" class="text-danger">{{ ownerLookupMessage }}</small>
              <small v-if="errors.ownerSearch" class="text-danger">{{ errors.ownerSearch }}</small>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Họ tên chủ *</label>
              <input type="text" class="form-control" v-model.trim="form.ownerFullName" :readonly="isLookupMode">
              <small v-if="errors.ownerFullName" class="text-danger">{{ errors.ownerFullName }}</small>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-semibold">Số điện thoại *</label>
              <input type="text" class="form-control" v-model.trim="form.ownerPhone" :readonly="isLookupMode">
              <small v-if="errors.ownerPhone" class="text-danger">{{ errors.ownerPhone }}</small>
            </div>
          </div>
          <div class="alert alert-secondary small mt-3" v-if="isLookupMode">
            <i class="fa-solid fa-circle-info me-2"></i>Hạng "HOPTAC" và "BN30N" chỉ cho nhập 1 ô phone/email để tìm kiếm. Hệ thống tự khóa họ tên &amp; SĐT khi tìm thấy.
          </div>
        </section>

        <!-- Upload hồ sơ -->
        <section class="mb-4">
          <div class="d-flex align-items-center mb-3">
            <div class="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center me-2" style="width: 36px; height: 36px;">
              <i class="fa-solid fa-upload"></i>
            </div>
            <h2 class="h5 mb-0">Tệp đính kèm</h2>
          </div>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">Hồ sơ liên quan</label>
              <input class="form-control" type="file" multiple @change="onFileChange($event, 'newFiles')">
              <div class="form-text">Chấp nhận nhiều file</div>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">Sổ đỏ</label>
              <input class="form-control" type="file" multiple @change="onFileChange($event, 'newLandBookFiles')">
              <div class="form-text">Chấp nhận nhiều file</div>
            </div>
          </div>
        </section>

      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import api from '/src/api/api.js'

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
  quyHoach: '',
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

const files = reactive({
  newFiles: [],
  newLandBookFiles: [],
})

const errors = reactive({})
const ownerSearch = ref('')
const ownerLookupMessage = ref('')
const isSubmitting = ref(false)

const isHouse = computed(() => form.loaiTaiSan === 'NHA')
const isLookupMode = computed(() => ['HOPTAC', 'BN30N'].includes(form.phanLoaiHang))

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

const onFileChange = (event, key) => {
  const selected = Array.from(event.target.files || [])
  files[key] = selected
}

const validateForm = () => {
  errors.address = form.address ? '' : 'Vui lòng nhập địa chỉ'
  errors.loaiTaiSan = form.loaiTaiSan ? '' : 'Bắt buộc chọn loại tài sản'
  errors.phanLoaiHang = form.phanLoaiHang ? '' : 'Bắt buộc chọn phân loại'
  errors.donViSoHuu = form.donViSoHuu ? '' : 'Chọn đơn vị sở hữu'
  errors.giaBan = form.giaBan !== null ? '' : 'Vui lòng nhập giá bán'
  errors.ownerFullName = !isLookupMode.value && !form.ownerFullName ? 'Nhập họ tên chủ' : ''
  errors.ownerPhone = !isLookupMode.value && !form.ownerPhone ? 'Nhập số điện thoại' : ''
  errors.ownerSearch = isLookupMode.value && !ownerSearch.value ? 'Nhập phone hoặc email để tìm kiếm' : ''
  return Object.values(errors).every((v) => !v)
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
    } else {
      ownerLookupMessage.value = 'Không tìm thấy chủ tài sản'
    }
  } catch (e) {
    ownerLookupMessage.value = 'Không tìm thấy chủ tài sản'
  }
}

const resetForm = () => {
  Object.assign(form, {
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
    quyHoach: '',
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
  ownerSearch.value = ''
  ownerLookupMessage.value = ''
  files.newFiles = []
  files.newLandBookFiles = []
  Object.keys(errors).forEach((k) => (errors[k] = ''))
}

const buildFormData = () => {
  const dto = { ...form, rooms: form.rooms }
  const fd = new FormData()
  fd.append('dto', JSON.stringify(dto))
  files.newFiles.forEach((file) => fd.append('newFiles', file))
  files.newLandBookFiles.forEach((file) => fd.append('newLandBookFiles', file))
  return fd
}

const submitForm = async () => {
  ownerLookupMessage.value = ''
  if (!validateForm()) return
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
section {
  background: #fff;
  padding: 1.25rem;
  border: 1px solid #e6e6e6;
  border-radius: 0.75rem;
}

.table > :not(caption) > * > * {
  padding: 0.65rem;
}
</style>