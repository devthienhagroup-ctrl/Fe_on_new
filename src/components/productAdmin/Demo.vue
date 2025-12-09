<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-3" style="padding-top: 90px!important;">
    <div class="max-w-[1600px] mx-auto">
      <!-- Bộ lọc nâng cao -->
      <div class="bg-white rounded-xl shadow-lg border border-slate-300 mb-5 p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="bg-gradient-to-r from-indigo-600 to-blue-600 p-1.5 rounded-lg">
              <i class="fa-solid fa-filter text-white text-sm"></i>
            </div>
            <h2 class="text-base font-bold text-slate-900">Bộ Lọc Nâng Cao</h2>
          </div>

          <!-- Nút chuyển đổi giữa bảng và thẻ -->
          <div class="flex items-center gap-2">
            <button
                @click="viewMode = 'table'"
                :class="[
                'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2',
                viewMode === 'table'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              ]"
                title="Chế độ bảng"
            >
              <i class="fa-solid fa-table text-sm"></i>
              <span class="text-sm font-medium">Bảng</span>
            </button>

            <button
                @click="viewMode = 'card'"
                :class="[
                'px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2',
                viewMode === 'card'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              ]"
                title="Chế độ thẻ"
            >
              <i class="fa-solid fa-grip text-sm"></i>
              <span class="text-sm font-medium">Thẻ</span>
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

        <div class="grid grid-cols-6 gap-2">
          <!-- Các bộ lọc hiện tại... -->
          <!-- Mức giá -->
          <div>
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <i class="fa-solid fa-dollar-sign text-blue-600 text-xs"></i>
              Mức Giá
            </label>
            <select
                v-model="filterGiaRange"
                class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-sm transition-all"
            >
              <option value="">Tất cả</option>
              <option value="<1>">< 1 tỷ</option>
              <option value="1-3">1 - 3 tỷ</option>
              <option value="3-5">3 - 5 tỷ</option>
              <option value="5-7">5 - 7 tỷ</option>
              <option value="7-10">7 - 10 tỷ</option>
              <option value=">10">&gt; 10 tỷ</option>
            </select>
          </div>

          <!-- Tỉnh thành -->
          <div>
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <i class="fa-solid fa-city text-emerald-600 text-xs"></i>
              Tỉnh Thành
            </label>
            <select
                style="max-height: 100px !important;"
                v-model="filterProvince"
                class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-sm transition-all"
            >
              <option value="">Tất cả</option>
              <option v-for="p in provinces" :key="p" :value="p">{{ formatProvinceShort(p) }}</option>
            </select>
          </div>

          <!-- Phường/Xã -->
          <div>
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <i class="fa-solid fa-location-dot text-violet-600 text-xs"></i>
              Phường/Xã
            </label>
            <select
                v-model="filterWard"
                class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-sm transition-all"
            >
              <option value="">Tất cả</option>
              <option v-for="w in wards" :key="w" :value="w">{{ w }}</option>
            </select>
          </div>

          <!-- Loại mặt hàng -->
          <div>
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <i class="fa-solid fa-tag text-rose-600 text-xs"></i>
              Loại Mặt Hàng
            </label>

            <select
                v-model="filterLoaiMH"
                class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
             focus:ring-2 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm transition-all"
            >
              <option value="">Tất cả</option>

              <option value="BN30N">Bán nhanh 30 ngày</option>
              <option value="HOPTAC">Hàng hợp tác</option>
              <option value="HTT">Hàng thị trường</option>
            </select>
          </div>


          <!-- Vị trí -->
          <div>
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <i class="fa-solid fa-location-arrow text-cyan-600 text-xs"></i>
              Vị Trí
            </label>
            <select
                v-model="filterViTri"
                class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-sm transition-all"
            >
              <option value="">Tất cả</option>
              <option value="Mặt tiền">Mặt tiền</option>
              <option value="Hẻm">Hẻm</option>
              <option value="Hẻm cụt">Hẻm cụt</option>
              <option value="Khu dân cư">Khu dân cư</option>
              <option value="Mặt tiền đường lớn">Mặt tiền đường lớn</option>
              <option value="Chưa cập nhật">Chưa cập nhật</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <i class="fa-solid fa-unlock-alt text-yellow-500 text-xs"></i>
              Đã mở khóa
            </label>

            <select
                v-model="filterUnlock"
                class="w-full px-2 py-1.5 text-sm border border-slate-400 rounded-lg
           focus:ring-2 focus:ring-blue-600 focus:border-transparent
           bg-white shadow-sm transition-all"
            >
              <option value="">Tất cả</option>
              <option value="yes">Đã mở</option>
              <option value="no">Chưa mở</option>
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
                <th class="text-left">Phí MG</th>
                <th class="text-left">Loại MH</th>
                <th class="text-left">Đơn Vị</th>
                <th class="text-center">Thao Tác</th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(item, idx) in landAssets"
                  :key="item.id"
                  :class="['transition-all duration-200', idx % 2 === 0 ? 'bg-blue-50/50' : 'bg-rose-50/50']"
                  style="font-weight: 550;"
              >
                <td class="text-center" :class="!item.unlocked ? 'blink-row' : ''">
                  <div class="flex justify-center items-center pr-1 ml-3">
                    <i
                        v-if="item.unlocked"
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
                <td class="font-bold text-blue-700">
                  {{ item.phiMoiGioi + '%' || '-' }}
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
                      @click="$router.push(`/admin/products-2/${item.id}`)"
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
          <div class="flex items-center justify-between p-3 bg-gradient-to-r from-slate-100 to-slate-200 border-t border-slate-300">
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

            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-slate-900">Số dòng mỗi trang:</span>
              <input
                  type="number"
                  v-model.number="pageSize"
                  @change="updatePageSize"
                  class="w-16 px-2 py-1 border border-slate-400 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
                  min="1"
              />
              <span class="text-sm text-slate-900">
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
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-800">
            Tổng số: {{ totalRecords }} bất động sản
          </h3>
          <div class="flex items-center gap-3">
            <div class="text-sm text-slate-600">
              {{ page * pageSize + 1 }} - {{ Math.min((page + 1) * pageSize, totalRecords) }} của {{ totalRecords }}
            </div>
            <select
                v-model.number="pageSize"
                @change="updatePageSize"
                class="px-2 py-1.5 border border-slate-400 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm"
            >
              <option value="6">6 thẻ/trang</option>
              <option value="9">9 thẻ/trang</option>
              <option value="12">12 thẻ/trang</option>
              <option value="15">15 thẻ/trang</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div
              v-for="(item) in landAssets"
              :key="item.id"
              class="bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <!-- Header thẻ với địa chỉ chi tiết -->
            <div class="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
              <div class="flex items-start justify-between mb-2">
                <!-- Địa chỉ chi tiết thay cho STT -->
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <div :class="['p-2 rounded-lg', getAssetTypeColor(item).replace('text-', 'bg-') + ' bg-opacity-20']">
                      <i :class="[getAssetTypeIcon(item), getAssetTypeColor(item), 'text-base']"></i>
                    </div>
                    <div class="flex-1">
                      <div class="text-xs font-semibold text-slate-500 mb-0.5">Địa chỉ</div>
                      <div class="text-sm font-bold text-slate-900 truncate">
                        {{ formatAddressDetail(item.diaChi) }}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-xs px-2 py-1 bg-blue-100/50 rounded text-blue-700 font-medium">
                      <i class="fa-solid fa-location-dot text-violet-500 mr-1"></i>
                      {{ formatWard(item.diaChi) }}
                    </span>
                    <span class="text-xs px-2 py-1 bg-emerald-100/50 rounded text-emerald-700 font-medium">
                      <i class="fa-solid fa-city text-emerald-500 mr-1"></i>
                      {{ formatProvince(item.khuVuc) }}
                    </span>
                  </div>
                </div>

                <!-- Trạng thái mở khóa -->
                <div class="text-right ml-2">
                  <div class="text-xs font-semibold text-slate-500 mb-1">Trạng thái</div>
                  <div v-if="item.unlocked" class="flex items-center gap-1 text-green-600 justify-end">
                    <i class="fa-solid fa-lock-open text-sm"></i>
                    <span class="text-xs font-medium">Đã mở</span>
                  </div>
                  <div v-else class="flex items-center gap-1 text-yellow-600 justify-end">
                    <i class="fa-solid fa-lock text-sm"></i>
                    <span class="text-xs font-medium">Chưa mở</span>
                  </div>
                </div>
              </div>

              <!-- Loại mặt hàng và đơn vị -->
              <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/50">
                <span :class="['px-2 py-1 rounded-lg font-semibold text-xs', badgeClass(item.loaiMH)]">
                  {{ item.loaiMH }}
                </span>
                <span
                    :class="[
                      'px-2 py-1 rounded-lg font-semibold text-xs text-white shadow-sm',
                      item.donVi === 'THG' ? 'bg-[#6A0DAD]' : 'bg-[#0057D9]'
                    ]"
                >
                  {{ item.donVi }}
                </span>
              </div>
            </div>

            <!-- Thông tin chính -->
            <div class="p-4">
              <!-- Thông tin chủ nhà và giá -->
              <div class="mb-4">
                <!-- Chủ nhà và liên hệ -->
                <div class="mb-3">
                  <div class="text-xs font-semibold text-slate-500 mb-1">Chủ nhà & Liên hệ</div>
                  <div class="flex items-center justify-between">
                    <div class="text-sm font-bold text-slate-900 truncate max-w-[60%]">
                      {{ item.tenChuNha || '—' }}
                    </div>
                    <div class="text-xs text-blue-600 font-medium">
                      <i class="fa-solid fa-phone text-blue-500 mr-1"></i>
                      {{ item.soDienThoai || '—' }}
                    </div>
                  </div>
                </div>

                <!-- Giá bán và định giá -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-blue-50/50 p-3 rounded-lg">
                    <div class="text-xs font-semibold text-slate-500 mb-1">Giá bán</div>
                    <div class="text-sm font-bold text-blue-700">{{ formatMoneyVN(item.giaBan) }}</div>
                  </div>
                  <div class="bg-slate-50 p-3 rounded-lg">
                    <div class="text-xs font-semibold text-slate-500 mb-1">Định giá</div>
                    <div v-if="item.giaDinhGia === -1.1" class="text-sm text-slate-800">*********</div>
                    <div v-else-if="item.giaDinhGia" class="text-sm font-bold text-blue-700">{{ formatMoneyVN(item.giaDinhGia) }}</div>
                    <div v-else class="text-sm text-slate-500">—</div>
                  </div>
                </div>
              </div>

              <!-- Thông tin chi tiết - 3 cột -->
              <div class="grid grid-cols-3 gap-3 mb-4">
                <div class="text-center">
                  <div class="text-xs font-semibold text-slate-500 mb-1">Diện tích</div>
                  <div class="text-sm font-bold text-slate-800">{{ item.dtcn }}m²</div>
                </div>
                <div class="text-center">
                  <div class="text-xs font-semibold text-slate-500 mb-1">Vị trí</div>
                  <div class="text-sm text-slate-800 truncate" :title="item.viTri">{{ item.viTri || '—' }}</div>
                </div>
                <div class="text-center">
                  <div class="text-xs font-semibold text-slate-500 mb-1">Phí MG</div>
                  <div class="text-sm font-bold text-blue-700">{{ item.phiMoiGioi }}%</div>
                </div>
              </div>

              <!-- Kết cấu -->
              <div class="mb-4">
                <div class="text-xs font-semibold text-slate-500 mb-1">Kết cấu</div>
                <div class="text-sm text-slate-800 line-clamp-2 bg-slate-50 p-2 rounded">
                  {{ item.ketCau || 'Chưa có thông tin' }}
                </div>
              </div>

              <!-- Nút hành động -->
              <button
                  @click="$router.push(`/admin/products/${item.id}`)"
                  class="w-full px-3 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm group-hover:shadow-md"
              >
                <i class="fa-regular fa-eye text-sm"></i>
                <span>Xem chi tiết</span>
                <i class="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Phân trang cho chế độ thẻ -->
        <div class="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg border border-slate-300">
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

          <div class="text-sm text-slate-700">
            Hiển thị {{ Math.min((page + 1) * pageSize, totalRecords) }} / {{ totalRecords }} bất động sản
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>

import { ref, computed, watch, onMounted } from "vue";
import { useSidebarStore } from "/src/stores/sidebarStore.js";
import addressData from "/src/assets/js/address.json";
import NotificationBell from "/src/components/NotificationBell.vue";

const filterUnlock = ref("");

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

// Pagination
const page = ref(0);
const pageSize = ref(9); // Mặc định 9 thẻ cho 3 cột
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
  return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
  ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;
};

const formatAddressDetail = (diaChi) => {
  let raw = diaChi || "";

  // Lấy phần trước /!! đầu tiên
  let clean = raw.split("/!!")[0].trim();

  // Thay Đường bằng Đ.
  clean = clean.replace(/đường/iu, "Đ.");

  return clean;
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
  };

  try {
    const res = await api.post(
        "/user.thg/product/user/bang-du-lieu",
        payload
    );

    console.log("DATA BE:", res.data);

    landAssets.value = Array.isArray(res.data.content)
        ? res.data.content
        : [];
    totalRecords.value = res.data.page?.totalElements || 0;
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
  }
}

onMounted(() => {
  fetchFilteredAssets();
});
const viewMode = ref('table'); // 'table' hoặc 'card'
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
</style>