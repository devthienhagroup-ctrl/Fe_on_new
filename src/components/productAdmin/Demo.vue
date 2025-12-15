<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-5 py-3" style="padding-top: 90px!important;">
    <div class="max-w-[1600px] mx-auto">
      <!-- Bộ lọc nâng cao -->
      <div class="bg-white rounded-xl shadow-lg border border-slate-300 mb-5 p-4"
           style="
            background-image: url('https://s3.cloudfly.vn/thg-storage/uploads-public/thienhagroup_filter_2.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          ">
        <div class="filter-header mb-3">
          <div class="filter-title-wrap">
            <h1 class="filter-title">
              Sản Phẩm Thiên Hà Group Dành Riêng Cho Bạn
            </h1>
          </div>

          <!-- Nút chuyển đổi giữa bảng và thẻ -->
          <div class="filter-actions">
            <button
                @click="viewMode = 'card'"
                :class="[
        'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2',
        viewMode === 'card'
          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
      ]"
            >
              <i class="fa-solid fa-grip text-sm"></i>
              <span class="text-sm font-medium">Thẻ</span>
            </button>

            <button
                @click="viewMode = 'table'"
                :disabled="isMobile"
                :class="[
        'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2',
        viewMode === 'table'
          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50',
        isMobile ? 'opacity-60 cursor-not-allowed' : ''
      ]"
            >
              <i class="fa-solid fa-table text-sm"></i>
              <span class="text-sm font-medium">Bảng</span>
            </button>
          </div>
        </div>


        <!-- Thanh tìm kiếm -->
        <div class="mb-3">
          <div class="relative">
            <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm theo tên chủ nhà hoặc số điện thoại, địa chỉ chi tết..."
                class="w-full pl-9 pr-4 py-2 border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-sm transition-all text-sm"
            />
          </div>
        </div>

        <div class="filter-row">

        <!-- Mức giá -->
          <div class="filter-item">
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
              <i class="fa-solid fa-dollar-sign text-blue-600 text-xs icon-glow" ></i>
              Mức Giá
            </label>
            <select v-model="filterGiaRange"
                    class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
             focus:ring-2 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm transition-all">
              <option value="">Tất cả</option>
              <option value="<1>">&lt; 1 tỷ</option>
              <option value="1-3">1 - 3 tỷ</option>
              <option value="3-5">3 - 5 tỷ</option>
              <option value="5-7">5 - 7 tỷ</option>
              <option value="7-10">7 - 10 tỷ</option>
              <option value=">10">&gt; 10 tỷ</option>
            </select>
          </div>

          <!-- Tỉnh thành -->
          <div class="filter-item">
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
              <i class="fa-solid fa-city text-emerald-600 text-xs icon-glow"></i>
              Tỉnh Thành
            </label>
            <select v-model="filterProvince"
                    class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
             focus:ring-2 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm transition-all">
              <option value="">Tất cả</option>
              <option v-for="p in provinces" :key="p" :value="p">
                {{ formatProvinceShort(p) }}
              </option>
            </select>
          </div>

          <!-- Phường/Xã -->
          <div class="filter-item">
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
              <i class="fa-solid fa-location-dot text-violet-600 text-xs icon-glow"></i>
              Phường/Xã
            </label>
            <select v-model="filterWard"
                    class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
             focus:ring-2 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm transition-all">
              <option value="">Tất cả</option>
              <option v-for="w in wards" :key="w" :value="w">{{ w }}</option>
            </select>
          </div>

          <!-- Loại mặt hàng -->
          <div class="filter-item">
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
              <i class="fa-solid fa-tag text-rose-600 text-xs icon-glow"></i>
              Loại Mặt Hàng
            </label>
            <select v-model="filterLoaiMH"
                    class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
             focus:ring-2 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm transition-all">
              <option value="">Tất cả</option>
              <option value="BN30N">Bán nhanh 30 ngày</option>
              <option value="HOPTAC">Hàng hợp tác</option>
              <option value="HTT">Hàng thị trường</option>
            </select>
          </div>

          <!-- Vị trí -->
          <div class="filter-item">
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
              <i class="fa-solid fa-location-arrow text-cyan-400 text-xs icon-glow"></i>
              Vị Trí
            </label>
            <input
                list="landPositions"
                v-model="filterViTri"
                placeholder="Chọn hoặc nhập vị trí..."
                class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
             focus:ring-2 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm transition-all" />
            <datalist id="landPositions">
              <option value="Mặt tiền đường chính"></option>
              <option value="Góc 2 mặt tiền"></option>
              <option value="Hẻm xe hơi"></option>
              <option value="Khu dân cư"></option>
            </datalist>
          </div>

          <!-- Mở khóa -->
          <div class="filter-item">
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
              <i class="fa-solid fa-unlock text-yellow-500 text-xs icon-glow"></i>
              Mở khóa
            </label>
            <select v-model="filterUnlock"
                    class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
             focus:ring-2 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm transition-all">
              <option value="">Tất cả</option>
              <option value="yes">Đã mở</option>
              <option value="no">Chưa mở</option>
            </select>
          </div>

          <!-- Trạng thái -->
          <div class="filter-item">
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
              <i class="fa-solid fa-circle-info text-pink-500 text-xs icon-glow"></i>
              Trạng thái
            </label>
            <select v-model="filterStatus"
                    class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
             focus:ring-2 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm transition-all">
              <option value="">Tất cả</option>
              <option value="Chưa bán">Chưa bán</option>
              <option value="Đã bán">Đã bán</option>
            </select>
          </div>

          <!-- Đã thích -->
          <div class="filter-item">
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 label-glow" style="color: white!important;">
              <i class="fa-solid fa-heart text-black text-xs icon-glow"></i>
              Đã thích
            </label>
            <select v-model="filterLove"
                    class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
             focus:ring-2 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm transition-all">
              <option :value="null">Tất cả</option>
              <option :value="true">Đã thích</option>
              <option :value="false">Chưa thích</option>
            </select>
          </div>

        </div>

      </div>

      <!-- Hiển thị theo chế độ -->
      <template v-if="viewMode === 'table'">
        <!-- Bảng dữ liệu (giữ nguyên) -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-300 mb-5 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm rounded-2xl overflow-hidden">
              <!-- Table content giữ nguyên... -->
              <thead class="table-header">
              <tr class="font-bold text-white">
                <th class="text-center">
                  <div class="flex justify-center items-center pr-1 ml-3">
                    <i class="fa-solid fa-lock text-yellow-500 text-sm"></i>
                  </div>
                </th>
                <th class="text-center">STT</th>
                <th class="text-left">Chủ Nhà</th>
                <th class="text-left">Liên hệ</th>
                <th class="text-left">Giá Bán</th>
                <th class="text-left">Định Giá</th>
                <th class="text-left">Địa Chỉ</th>
                <th class="text-left">Phường/Xã</th>
                <th class="text-left">Khu Vực</th>
                <th class="text-left">Vị Trí</th>
                <th class="text-left">DTCN</th>
                <th class="text-left">Kết Cấu</th>
                <th class="text-left">Cập Nhật</th>
                <th class="text-left">Phí MG</th>
                <th class="text-left">Trạng thái</th>
                <th class="text-left">Loại MH</th>
                <th class="text-left">Đơn Vị</th>
                <th class="text-left">&nbsp; Thao Tác</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(item, idx) in landAssets"
                  :key="item.id"
                  :class="['transition-all duration-200', idx % 2 === 0 ? 'bg-blue-50/50' : 'bg-rose-50/50']"
                  style="font-weight: 550;"
              >
                <td class="text-center" :class="!item.moKhoa ? 'blink-row' : ''">
                  <div class="flex justify-center items-center pr-1 ml-3">
                    <i
                        v-if="item.moKhoa"
                        class="fa-solid fa-lock-open text-green-600 text-lg"
                        title="Đã mở khóa"
                    ></i>
                    <i
                        v-else
                        class="fa-solid fa-lock text-yellow-500 text-lg"
                        title="Chưa mở khóa"
                    ></i>
                  </div>
                </td>
                <td class="text-center">
                  <div class="relative inline-flex items-center justify-center w-8 h-8">
                    <i :class="[getAssetTypeIcon(item), getAssetTypeColor(item), 'absolute text-lg opacity-20']"></i>
                    <span :class="['relative text-xs font-bold', getAssetTypeColor(item)]">
                      {{ idx + 1 }}
                    </span>
                  </div>
                </td>
                <td class="font-medium text-slate-900 text-gray-800">{{ item.tenChuNha || '—' }}</td>
                <td class="text-slate-900 text-gray-800">{{ item.soDienThoai || '—' }}</td>
                <td class="font-bold text-blue-700">{{  formatMoneyVN( item.giaBan ) }}</td>
                <td
                    v-if="item.giaDinhGia === -1.1"
                    class="text-slate-800"
                >
                  *********
                </td>
                <td
                    v-else-if="item.giaDinhGia"
                    class="font-bold text-blue-700"
                >
                  {{ formatMoneyVN(item.giaDinhGia) }}
                </td>
                <td
                    v-else
                    class="text-slate-800"
                >
                  —
                </td>
                <td class="text-slate-800 text-gray-800">{{ formatAddressDetail(item.diaChi) }}</td>
                <td class="text-slate-900 text-gray-800">{{ formatWard(item.diaChi) }}</td>
                <td class="text-slate-900 text-gray-800">{{ formatProvince(item.khuVuc) }}</td>
                <td class="text-slate-900 text-gray-800">{{ item.viTri }}</td>
                <td class="font-medium text-slate-800">{{ item.dtcn + 'm²' }}</td>
                <td class="text-slate-900 text-gray-800 max-w-[150px] truncate">
                  {{ item.ketCau || '-' }}
                </td>
                <td class="text-slate-900 text-gray-800">{{  formatDate(item.capNhatNgay) }}</td>
                <td class="font-bold text-blue-700">
                  <div style="position: relative; top: -3px;">
                    <DotLottieVue
                        src="https://lottie.host/a94085b1-dc72-4753-88d0-4bdfad75c588/NgBvXtuOwE.lottie"
                        autoplay
                        loop
                        style="
                            width: 20px;
                            height: 26px;
                            display: inline-block;
                            vertical-align: bottom;
                            position: relative; top: -1px;
                          "
                    />{{ item.phiMoiGioi != null ? item.phiMoiGioi + '%' : '-' }}
                  </div>
                </td>
                <td class="font-bold">
                  <span :class="badgeStatus(item.status)">
                    {{ formatStatusTW(item.status) }}
                  </span>
                </td>
                <td>
                    <span :class="['px-2 py-1 rounded-lg font-semibold', badgeClass(item.loaiMH)]"
                          style="border-radius: 8px !important; font-size: 12px !important;">
                      {{ item.loaiMH }}
                    </span>
                </td>
                <td>
                  <span
                      :class="[
                    'inline-flex items-center gap-1 px-2 py-1 font-semibold text-white shadow-sm',
                    item.donVi === 'THG'
                      ? 'bg-[#6A0DAD]'
                      : 'bg-[#0057D9]'
                  ]"
                      style="border-radius: 8px; font-size: 12px; line-height: 16px;"
                  >
                  <i
                      :class="[
                      'fa-solid text-white',
                      item.donVi === 'THG' ? 'fa-building' : 'fa-handshake'
                    ]"
                      style="font-size: 11px;"
                  ></i>
                  {{ item.donVi }}
                </span>
                </td>
                <td class="text-center">
                  <button
                      @click="toggleLove(item)"
                      style="background-color: rgba(133,132,132,0.13); padding: 0 10px; margin-right: 5px; border-radius: 8px">
                    <i
                        :class="item.daThich
      ? 'fa-solid fa-heart text-black text-base'
      : 'fa-regular fa-heart text-base'"
                    ></i>
                  </button>
                  <button
                      @click="$router.push(`/san-pham-thien-ha/${item.id}`)"
                      class="
                                px-1.5
                                py-[2px]
                                rounded-md
                                inline-flex items-center gap-1
                                text-[10px] font-semibold
                                bg-[#BFDBFE]
                                text-[#1D4ED8]
                                border border-[#93C5FD]
                                shadow-sm
                                hover:bg-[#93C5FD]
                                transition-all duration-200
                              "
                      style="border-radius: 8px; font-size: 11px;"
                  >
                    <i class="fa-regular fa-eye text-[10px] text-[#1D4ED8]"></i>
                    <span>Xem</span>
                  </button>

                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- Phân trang -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 bg-gradient-to-r from-slate-100 to-slate-200 border-t border-slate-300">
            <div class="flex items-center gap-1">
              <button
                  @click="goToPage(0)"
                  :disabled="page === 0"
                  class="p-1.5 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <i class="fa-solid fa-angles-left text-sm"></i>
              </button>
              <button
                  @click="goToPage(page - 1)"
                  :disabled="page === 0"
                  class="p-1.5 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <i class="fa-solid fa-angle-left text-sm"></i>
              </button>

              <div class="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg shadow-md">
                <span class="text-sm font-bold">
                  Trang {{ page + 1 }} / {{ totalPages }}
                </span>
              </div>

              <button
                  @click="goToPage(page + 1)"
                  :disabled="page >= totalPages - 1"
                  class="p-1.5 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <i class="fa-solid fa-angle-right text-sm"></i>
              </button>
              <button
                  @click="goToPage(totalPages - 1)"
                  :disabled="page >= totalPages - 1"
                  class="p-1.5 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <i class="fa-solid fa-angles-right text-sm"></i>
              </button>
            </div>

            <div class="flex flex-col items-center gap-2 sm:flex-row sm:items-center">
              <span class="text-sm font-semibold text-slate-900">Số dòng mỗi trang:</span>
              <input
                  type="number"
                  v-model.number="pageSize"
                  @change="updatePageSize"
                  class="w-16 px-2 py-1 border border-slate-400 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                  min="1"
              />
              <span class="text-sm text-slate-900 font-semibold">
                Hiển thị
                {{ page * pageSize + 1 }}
                -
                {{ Math.min((page + 1) * pageSize, totalRecords) }} của {{ totalRecords }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <!-- Chế độ xem thẻ - 3 cột -->
      <template v-else>
        <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 class="text-lg font-bold text-slate-800">
            Tổng số: {{ totalRecords }} bất động sản
          </h3>
          <div class="flex flex-nowrap items-center gap-2 sm:gap-3">
            <div class="text-sm text-slate-600 font-bold">
              {{ page * pageSize + 1 }} - {{ Math.min((page + 1) * pageSize, totalRecords) }} của {{ totalRecords }}
            </div>
            <select
                v-model.number="pageSize"
                @change="updatePageSize"
                class="px-2 py-1.5 border border-slate-400 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
            >
              <option value="8">8 thẻ/trang</option>
              <option value="12">12 thẻ/trang</option>
              <option value="16">16 thẻ/trang</option>
              <option value="20">20 thẻ/trang</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">

          <div
              v-for="item in landAssets"
              :key="item.id"
              class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden
         hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <!-- Ảnh -->
            <div class="relative w-full overflow-hidden" style="height: 200px">
              <div class="relative w-full h-full px-3 pt-3  rounded-3 overflow-hidden aspect-[4/3] w-full">
                <img
                    :src="item.imageUrl || 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg'"
                    class="w-full rounded-3 h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <!-- Tag loại tài sản -->
              <div class="absolute top-2  mt-3 ms-3 left-2 flex items-center gap-2">

                <!-- Loại tài sản -->
                <div
                    class="px-2 py-1 rounded-full font-semibold
    flex items-center gap-1 whitespace-nowrap
    backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm text-white"  style="font-size: 10px !important;"
                >
                  <i :class="getAssetTypeIcon(item)" style="font-size: 13px !important;"></i>
                  {{ getLoai(item) || '—' }}
                </div>

                <!-- Trạng thái khóa/mở -->
                <div
                    class="px-2 py-1 rounded-full font-semibold
    flex items-center gap-1 whitespace-nowrap
    backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm"
                    :class="item.moKhoa ? 'text-green-300' : 'text-yellow-300'" style="font-size: 10px !important;"
                >
                  <i :class="item.moKhoa ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'" style="font-size: 10px !important;"></i>
                  <span style="font-size: 10px !important;">{{ item.moKhoa ? 'Đã mở' : 'Chưa mở' }}</span>
                </div>
              </div>
              <div v-if="'Đã bán' === item.status" class="absolute top-3 mr- ms-3 right-2 flex items-center gap-2" style="width: 60px; pxposition: absolute; top: 7px; right: 3px">
                  <img src="/imgs/sold-out.png"/>
              </div>
              <div v-else-if="'Đã kiểm duyệt' === item.status" class="absolute top-3  mr-0 ms-3 right-2 flex items-center gap-2" style="width: 60px
                  ; position: absolute; top: 7px; right: 3px">
                <img src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/icon-kiem-duỵet.png"/>
              </div>
            </div>

            <!-- Thông tin tài sản -->
            <div class="p-3 leading-tight text-slate-800">
              <!-- Địa chỉ chi tiết (tiêu đề) -->
              <div
                  class="font-semibold text-slate-900 mb-1"
                  style="
                    font-size: 15px;
                    font-weight: 700;
                    text-transform: uppercase;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
              >
                {{ formatWardCard(item.diaChi) }}, {{ formatProvinceCard(item.khuVuc) }}
              </div>
              <div class="font-semibold text-slate-500" style="font-size: 13px">
                Ngày cập nhật: {{ formatDate(item.capNhatNgay) }}
              </div>

              <!-- Giá + Loại mua bán/thuê -->
              <div class="flex items-center justify-between mt-1">

                <!-- Giá bán (bên trái) -->
                <div style="color: #dc2626; font-weight: 700; font-size: 16px">
                  {{ formatMoneyVN(item.giaBan) }}
                  <span class="text-[12px] text-slate-500 font-semibold">Hoa hồng: </span>
                  <DotLottieVue
                      src="https://lottie.host/a94085b1-dc72-4753-88d0-4bdfad75c588/NgBvXtuOwE.lottie"
                      autoplay
                      loop
                      style="
                            width: 20px;
                            height: 26px;
                            display: inline-block;
                            vertical-align: bottom;
                          "
                  />
                  <span class="font-semibold text-blue-700 text-[14px]">
                    {{ item.phiMoiGioi != null ? item.phiMoiGioi + '%' : '-' }}
                  </span>
                </div>

                <!-- Đơn vị + Loại MH (bên phải) -->
                <div class="flex items-center gap-2 mt-2">

                  <!-- Đơn vị -->
                  <div
                      class="px-2.5 py-0.5 rounded-full text-white shadow-sm"
                      :class="item.donVi === 'THG' ? 'bg-[#6A0DAD]' : 'bg-[#0057D9]'"
                      style="font-weight: 550; font-size: 12.5px !important;"
                  >
                    {{ item.donVi }}
                  </div>

                  <!-- Loại MH -->
                  <span
                      class="px-2 py-0.5 rounded-full"
                      :class="badgeClass(item.loaiMH)"
                      style="font-weight: 550; font-size: 12.5px !important;"
                  >
                      {{ item.loaiMH }}
                    </span>

                </div>
              </div>

              <!-- Chủ nhà + SĐT -->
              <!-- Dòng Định giá phía trên -->
              <div class="flex items-center justify-between mt-2 text-[14px]">
                <!-- BÊN TRÁI: GIÁ ĐỊNH -->
                <span class="font-semibold text-slate-700 truncate max-w-[55%]">
                    <template v-if="!item.giaDinhGia">
                      Chưa định giá
                    </template>
                    <template v-else-if="item.giaDinhGia == -1.1">
                      *********** (Giá định)
                    </template>
                    <template v-else>
                      {{ formatMoneyVN(item.giaDinhGia) }} (Giá định)
                    </template>
                  </span>

                <!-- BÊN PHẢI: LƯỢT XEM + LƯỢT THÍCH -->
                <div class="flex items-center gap-3 text-slate-500 text-[12px] shrink-0">
                  <!-- Lượt xem -->
                  <div class="flex items-center gap-1 font-medium ">
                    <span class="font-medium text-slate-700">
                      {{ item.soLuotXem ?? 0 }}
                    </span>đã xem
                  </div>

                  <!-- Lượt thích -->
                  <div class="flex items-center gap-1 font-medium ">
                    <span class="font-medium text-slate-700">
                      {{ item.soLuotThich ?? 0 }}
                    </span>đã thích
                  </div>
                </div>
              </div>


              <!-- Giá bán & Định giá (nếu cần hiển thị) -->
              <div class="grid grid-cols-2 gap-2 mt-2">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <div class="text-[12px] text-slate-500 font-semibold">Chủ nhà</div>
                  <div class="text-[14px] font-semibold text-slate-800 mt-0.5 truncate">
                    {{ item.tenChuNha || '—' }}
                  </div>
                </div>
                <div class="p-2 bg-slate-50 rounded-lg">
                  <div class="text-[12px] text-slate-500 font-semibold">Liên hệ</div>
                  <div class="text-[14px] font-semibold text-blue-700 mt-0.5 flex items-center gap-1">
                    <i class="fa-solid fa-phone text-blue-500"></i>
                    {{ item.soDienThoai || '—' }}
                  </div>
                </div>
              </div>

              <!-- Chi tiết: DT, Vị trí, MG -->
              <div class="grid grid-cols-2 gap-2 mt-2 text-start">
                <div>
                  <div class="text-[12px] text-slate-500 font-semibold">Diện tích</div>
                  <div class="font-bold">{{ item.dtcn }}m²</div>
                </div>
                <div>
                  <div class="text-[12px] text-slate-500 font-semibold">Vị trí</div>
                  <div class="text-slate-800 text-[13px] truncate font-bold">{{ item.viTri || '—' }}</div>
                </div>
              </div>

              <!-- Nút xem chi tiết + nút yêu thích -->
              <div class="flex items-center gap-2 mt-3">
                <!-- Nút Xem chi tiết (primary) -->
                <!-- Nút Xem chi tiết (giữ nguyên màu, chỉ bỏ border) -->
                <button
                    @click="$router.push(`/san-pham-thien-ha/${item.id}`)"
                    class="flex-1 py-2.5 bg-gradient-to-r from-slate-900 to-black text-white rounded-full
         text-[14px] font-semibold flex items-center justify-center gap-2
         hover:opacity-90 transition-all"
                >
                  <i class="fa-regular fa-eye text-sm"></i>
                  Xem chi tiết
                </button>

                <!-- Nút Yêu thích (không border + nền xám nhạt) -->
                <button
                    @click="toggleLove(item)"
                    class="w-10 h-10 rounded-full bg-slate-100 text-slate-800 shadow-sm
         hover:bg-slate-200 flex items-center justify-center transition"
                >
                  <i
                      :class="item.daThich
      ? 'fa-solid fa-heart text-black text-base'
      : 'fa-regular fa-heart text-base'"
                  ></i>
                </button>

              </div>
            </div>
          </div>

        </div>


        <!-- Phân trang cho chế độ thẻ -->
        <div
            class="
    flex flex-col items-center gap-3
    p-4 bg-white rounded-xl shadow-lg border border-slate-300
    sm:flex-row sm:items-center sm:justify-between
  "
        >
        <div class="flex items-center gap-1">
            <button
                @click="goToPage(0)"
                :disabled="page === 0"
                class="p-2 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <i class="fa-solid fa-angles-left text-sm"></i>
            </button>
            <button
                @click="goToPage(page - 1)"
                :disabled="page === 0"
                class="p-2 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <i class="fa-solid fa-angle-left text-sm"></i>
            </button>

            <div class="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg shadow-md">
              <span class="text-sm font-bold">
                Trang {{ page + 1 }} / {{ totalPages }}
              </span>
            </div>

            <button
                @click="goToPage(page + 1)"
                :disabled="page >= totalPages - 1"
                class="p-2 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <i class="fa-solid fa-angle-right text-sm"></i>
            </button>
            <button
                @click="goToPage(totalPages - 1)"
                :disabled="page >= totalPages - 1"
                class="p-2 rounded-lg bg-white border border-slate-400 text-slate-800 hover:bg-blue-100 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <i class="fa-solid fa-angles-right text-sm"></i>
            </button>
          </div>

          <div
              class="text-sm text-slate-700 sm:text-right flex items-center justify-center sm:justify-end"
              style="font-weight: 600"
          >
          Hiển thị {{ Math.min((page + 1) * pageSize, totalRecords) }} / {{ totalRecords }} bất động sản
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useSidebarStore } from "/src/stores/sidebarStore.js";
import addressData from "/src/assets/js/address.json";
import NotificationBell from "/src/components/NotificationBell.vue";


import { useAuthStore } from "/src/stores/authStore.js";
const authStore = useAuthStore();
const info = authStore.userInfo;

const sidebar = useSidebarStore();

// Data
const landAssets = ref([]);
const totalRecords = ref(0);

// Filters
const filterGiaRange = ref("");
const filterProvince = ref("");
const filterWard = ref("");
const filterStreet = ref("");
const filterLoaiMH = ref("");
const filterDTCN = ref("");
const filterViTri = ref("");
const filterCreateDate = ref("");
const filterUpdateDate = ref("");
const searchQuery = ref("");
const filterUnlock = ref("");
const filterStatus = ref("");
const filterLove = ref(null);

// Pagination
const page = ref(0);
const pageSize = ref(8);
const viewMode = ref('card');
const isMobile = ref(false);
const updateViewportMode = () => {
  isMobile.value = typeof window !== 'undefined' && window.innerWidth < 768;
  if (isMobile.value) {
    viewMode.value = 'card';
  }
};
watch(viewMode, (mode) => {
  pageSize.value = mode === 'card' ? 8 : 10;
});// Mặc định 9 thẻ cho 3 cột
const totalPages = computed(() =>
    Math.ceil(totalRecords.value / pageSize.value || 1)
);

// Unique values
const provinces = computed(() => addressData.map(x => x.name));

const wards = computed(() => {
  if (!filterProvince.value) return [];

  const province = addressData.find(p => p.name === filterProvince.value);
  if (!province || !Array.isArray(province.wards)) return [];

  return province.wards.map(w => w.name);
});
watch(filterProvince, () => {
  filterWard.value = "";   // reset về Tất cả
});


// Format functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getFullYear()).slice(-2)}`;
};


const formatAddressDetail = (diaChi) => {
  let raw = diaChi || "";

  // Lấy phần trước /!! đầu tiên
  let clean = raw.split("/!!")[0].trim();

  // Thay Đường bằng Đ.
  clean = clean.replace(/đường/iu, "Đ.");

  return clean;
};

const badgeStatus = (status) => {
  if (status === "Đã bán") {
    return "px-2 pe-2 py-1 rounded-lg bg-gray-600 text-white font-semibold line-through";
  }else if (status !== "Đã bán" ) {
    return "px-2 pe-2 py-1 rounded-lg bg-blue-600 text-white font-semibold";
  }else{
      return "px-2 pe-2 py-1 rounded-lg bg-slate-500 text-white font-medium";
  }
};



function formatStatusTW(status) {
  if (!status) return "Chưa cập nhật";

  if ( 'Đã bán' === status ){
    return 'Đã bán';
  }else if( 'Đã kiểm duyệt' === status ){
    return "Đã kiểm duyệt"
  }else{
    return 'Đang bán';
  }
}

const formatWardCard = (addressDetail) => {
  const raw = addressDetail || "";
  const parts = raw.split("/!!");

  // Ward nằm ở vị trí 1
  let ward = parts[1]?.trim() || "";

  return ward;
};

const formatWard = (addressDetail) => {
  const raw = addressDetail || "";
  const parts = raw.split("/!!");

  // Ward nằm ở vị trí 1
  let ward = parts[1]?.trim() || "";

  return ward
      .replace(/^Phường\s+/i, "P. ")
      .replace(/^Xã\s+/i, "X. ")
      .replace(/^Thị trấn\s+/i, "TT. ");
};

const formatProvinceCard = (province) => {
  if (typeof province !== "string") return province || "";
  return province;
};

const formatProvince = (province) => {
  if (typeof province !== "string") return province || "";
  return province
      .replace(/^Thành phố\s+/i, "TP.")
      .replace(/^Tỉnh\s+/i, "T.");
};

const formatProvinceShort = (province) => {
  if (!province || typeof province !== "string") return province || "";
  return province
      .replace(/^Thành phố\s+/i, "TP.")
      .replace(/^Tỉnh\s+/i, "T.");
};

// Type
const getAssetType = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const ketCau = (item.ketCau || "").toLowerCase();

  // Ưu tiên dữ liệu từ backend
  if (item.loaiTaiSan) {
    const map = {
      NHA: "house",
      DAT: "land",
      DATLON: "land-large"
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
  if (houseKeywords.some(keyword => ketCau.includes(keyword))) {
    return "house";
  }

  // Nếu diện tích lớn → đất lớn
  if (dtcnValue > 1000) return "land-large";

  // Còn lại → đất
  return "land";
};

const getLoai = (item) => {
  const dtcnValue = parseFloat(item.dtcn) || 0;
  const structure = (item.structure || "").toLowerCase();

  // Ưu tiên dữ liệu từ backend
  if (item.loaiTaiSan) {
    const map = {
      NHA: "Nhà",
      DAT: "Đất",
      DATLON: "Đất lớn"
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
    return "Nhà";
  }

  // Nếu diện tích lớn → đất lớn
  if (dtcnValue > 10000) return "Đất lớn";

  // Còn lại → đất
  return "Đất";
};

const getAssetTypeIcon = (item) => {
  const type = getAssetType(item);
  switch (type) {
    case "house":
      return "fa-solid fa-house-chimney";
    case "land-large":
      return "fa-solid fa-mountain-city";
    default:
      return "fa-solid fa-map-location-dot";
  }
};

const getAssetTypeColor = (item) => {
  const type = getAssetType(item);
  switch (type) {
    case "house":
      return "text-emerald-700";
    case "land-large":
      return "text-rose-700";
    default:
      return "text-blue-700";
  }
};

const badgeClass = (code) => {
  const map = {
    BN30N:
        "bg-green-500 text-white font-semibold ",
    HTT:
        "bg-yellow-500 text-white font-semibold",
    HOPTAC:
        "bg-orange-500 text-white font-semibold",
  };

  return (
      map[code] ||
      "bg-slate-400 text-white font-semibold"
  );
};

// Range
const matchGiaRange = (asset) => {
  const v = asset.giaTriTy;
  if (!filterGiaRange.value || v == null) return true;
  switch (filterGiaRange.value) {
    case "1-3":
      return v >= 1 && v < 3;
    case "3-5":
      return v >= 3 && v < 5;
    case "5-7":
      return v >= 5 && v < 7;
    case "7-10":
      return v >= 7 && v < 10;
    case ">10":
      return v >= 10;
    default:
      return true;
  }
};

// Pagination actions
const goToPage = (p) => {
  if (p < 0) p = 0;
  if (p >= totalPages.value) p = totalPages.value - 1;
  page.value = p;
};

const updatePageSize = () => {
  if (pageSize.value < 1) pageSize.value = 1;
  page.value = 0;
};

// Export/import
import { showCenterWarning, showCenterSuccess, showCenterError } from "../../assets/js/alertService.js";

const handleExport = () => showCenterWarning("Xuất Excel", "Chức năng đang phát trển !")
const handleImport = () => showCenterWarning("Nhập Excel", "Chức năng đang phát trển !")

// Refresh
const handleRefresh = () => {
  filterGiaRange.value = "";
  filterProvince.value = "";
  filterWard.value = "";
  filterStreet.value = "";
  filterLoaiMH.value = "";
  filterViTri.value = "";
  filterDTCN.value = "";
  filterCreateDate.value = "";
  filterUpdateDate.value = "";
  searchQuery.value = "";
  page.value = 0;
};

// Select rows
const selectedRows = ref([]);
const selectAllRef = ref(null);


// API
import api from "/src/api/api.js";

// Money format
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

// Debounce
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const debouncedFilter = debounce(fetchFilteredAssets, 300);

// WATCH FILTERS
watch(
    [
      filterGiaRange,
      filterProvince,
      filterWard,
      filterLoaiMH,
      filterViTri,
      filterUnlock,
      searchQuery,
      filterLove,
      filterStatus,
      page,
      pageSize,
    ],
    () => debouncedFilter(),
    { deep: true, immediate: true }
);

// FETCH FILTERED
async function fetchFilteredAssets() {
  const payload = {
    trangSo: page.value,
    soDong: pageSize.value,
    tuKhoa: searchQuery.value || null,
    mucGia: filterGiaRange.value || null,
    phuongXa: filterWard.value || null,
    khuVuc: filterProvince.value || null,
    viTri: filterViTri.value || null,
    loaiMH: filterLoaiMH.value || null,
    moKhoa: filterUnlock.value === "" ? null : filterUnlock.value === "yes",
    trangThai: filterStatus.value || null,
    daThich: filterLove.value || null,
  };

  try {
    const res = await api.post(
        "/user.thg/product/user/bang-du-lieu",
        payload
    );

    console.log("DATA BE:", res.data);

    landAssets.value = Array.isArray(res.data.content)
        ? res.data.content.map(item => ({
          ...item,
          imageUrl: item.imageUrl
              ? item.imageUrl
              : "https://s3.cloudfly.vn/thg-storage-dev/uploads-public/default.jpg"
        }))
        : [];


    totalRecords.value = res.data.page?.totalElements || 0;
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
  }
}

const auth = useAuthStore();
import { useRouter } from "vue-router";
const router = useRouter();
async function toggleLove(item) {
  // ❌ Chưa đăng nhập → đá ra trang đăng nhập
  localStorage.setItem("redirectAfterLogin", "/san-pham-thien-ha");
  if (!auth.accessToken) {
    router.push({
      path: "/dang-nhap"
    });
    return;
  }

  // ✅ Optimistic update (cho mượt UX)
  item.daThich = !item.daThich;
  item.soLuotThich = item.daThich
      ? item.soLuotThich + 1
      : item.soLuotThich - 1;

  try {
    await api.post(
        "/user.thg/product/user/love/toggle",
        null,
        {
          params: {
            idAsset: item.id
          }
        }
    );
  } catch (e) {
    // ❌ Nếu API lỗi → rollback lại
    item.daThich = !item.daThich;
    item.soLuotThich = item.daThich
        ? item.soLuotThich + 1
        : item.soLuotThich - 1;
  }
}



onMounted(() => {
  updateViewportMode();
  window.addEventListener('resize', updateViewportMode);
  fetchFilteredAssets();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportMode);
});
 // 'table' hoặc 'card'
</script>

<style scoped>
/* Thêm style cho chế độ thẻ */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hiệu ứng cho thẻ */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(4px);
}

/* Các style hiện tại giữ nguyên... */
* {
  font-size: 14px;
}

table * {
  font-size: 13.5px !important;
}

td {
  padding: 5px 5px 10px 0 !important;
}

.bg-pattern {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIuNSIgb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+');
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Hover effects for cards */
.group:hover {
  transform: translateY(-4px);
}

/* Table row hover */
tbody tr:hover {
  background-color: rgba(239, 246, 255, 0.7) !important;
}

/* Focus visible for accessibility */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

/* Border radius for table */
table {
  border-radius: 16px;
  overflow: hidden;
}
th{
  padding-top: 7px !important;
  padding-bottom: 7px !important;
}
/* Màu tím header bảng */
.table-header {
  background: linear-gradient(to right, #641eaf, #562df3); /* tím pastel */
  border-bottom: 2px solid #a78bfa; /* tím đậm hơn xíu */
}

/* Padding riêng cho thẻ TH */
.th-cell {
  padding: 10px 12px !important;
  font-weight: 700;
  color: white;
  text-align: left;
}
.blink-row {
  animation: blink 1.4s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.45; }
  100% { opacity: 1; }
}

.label-glow,
.icon-glow {
  text-shadow:
      0 0 6px rgba(9, 9, 9, 0.9),
      0 0 12px rgba(10, 10, 10, 0.8);
}
/* Hàng filter */
.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* Mỗi filter */
.filter-item {
  width: 100%;
}

/* Tablet */
@media (min-width: 640px) {
  .filter-item {
    width: calc(50% - 12px);
  }
}

/* Tablet ngang */
@media (min-width: 768px) {
  .filter-item {
    width: calc(25% - 12px);
  }
}

/* Laptop trở lên → 1 hàng */
@media (min-width: 1024px) {
  .filter-row {
    flex-wrap: nowrap;
  }

  .filter-item {
    flex: 1;
    min-width: 100px;
  }
}
/* Header chứa tiêu đề + nút */
.filter-header {
  display: flex;
  flex-direction: column; /* mobile: 2 dòng */
  gap: 12px;
}

/* Wrap tiêu đề */
.filter-title-wrap {
  display: flex;
  align-items: center;
}

/* Tiêu đề */
.filter-title {
  font-weight: 700;
  font-size: 20px;
  color: white;
  text-shadow: 0 0 6px rgba(10, 10, 10, 0.9);
}

/* Nút */
.filter-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end; /* mobile: nút sát phải */
}

/* Desktop trở lên */
@media (min-width: 768px) {
  .filter-header {
    flex-direction: row;      /* cùng hàng */
    align-items: center;
  }

  .filter-actions {
    margin-left: auto;        /* đẩy nút sang phải cha */
  }
  .filter-title {
    font-size: 22px;
  }
}



</style>