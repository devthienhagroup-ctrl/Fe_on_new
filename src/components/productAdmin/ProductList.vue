  <template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-3">
      <div>

        <!-- Tiêu đề chính -->
        <div
            class="relative bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 rounded-2xl shadow-2xl p-5 mb-5">
          <div class="absolute inset-0 opacity-10 bg-pattern"></div>
          <div class="relative flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-white flex items-center gap-3 mb-1">
                <div class="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                  <i class="fa-solid fa-building text-2xl"></i>
                </div>
                Hệ Thống Quản Lý Bất Động Sản
              </h1>
              <p class="text-blue-100 text-sm flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Bảng điều khiển danh mục bất động sản • Dữ liệu trực tiếp
                <div class="bg-white rounded-4"><NotificationBell/></div>
              </p>
            </div>
            <div class="flex flex-col items-end gap-1">

              <!-- Hàng 1 -->
              <div class=" flex items-center gap-4 mb-2 backdrop-blur-sm bg-white/70 rounded-xl px-3 py-2 shadow-md">

                <!-- Chuông thông báo -->




                <!-- Thông tin người dùng -->
                <div class="flex flex-col text-right leading-tight">
                  <span class="font-semibold text-dark text-sm">{{ info.fullName }}</span>
                </div>

                <!-- Avatar -->
                <template v-if="info.avatarUrl">
                  <img
                      :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + info.avatarUrl"
                      alt="avatar"
                      class="rounded-full border border-white/40 shadow-md"
                      style="width: 36px; height: 36px; object-fit: cover;"
                  />
                </template>

                <!-- Nếu không có avatar -->
                <template v-else>
                  <div
                      class="rounded-full bg-white/20 backdrop-blur-sm text-white
           flex items-center justify-center font-bold shadow-md border border-white/40"
                      style="width: 36px; height: 36px;"
                  >
                    {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
                  </div>
                </template>

              </div>

              <!-- Hàng 2: giữ nguyên -->
              <div class="flex items-center gap-2">
                <button
                    @click="handleRefresh"
                    class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl text-sm"
                >
                  <i class="fa-solid fa-rotate-right"></i>
                  <span class="font-medium">Làm mới</span>
                </button>

              </div>

            </div>

          </div>
        </div>

        <!-- Thẻ chỉ số KPI -->
        <div class="grid grid-cols-4 gap-3 mb-5">

          <!-- 🟦 Tổng sản phẩm -->
          <div
              class="group bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-4 border border-blue-200
               hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">

            <div class="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-full -mr-12 -mt-12"></div>

            <div class="relative">
              <div class="flex items-center justify-between mb-2">
                <div class="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg
                      group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-box text-white text-lg"></i>
                </div>

                <div :class="[
                'flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full',
                stats.rateSanPham >= 0 ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100'
              ]">
                  <i :class="[
                  'fa-solid text-xs',
                  stats.rateSanPham >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'
                ]"></i>

                  {{ stats.rateSanPham.toFixed(1) }}% so với cùng kỳ
                </div>
              </div>

              <h3 class="text-slate-900 text-sm font-medium mb-1">Tổng Sản Phẩm</h3>
              <p class="text-2xl font-bold text-slate-900 mb-1">{{ stats.total }}</p>
              <p class="text-xs text-slate-600">Tài sản đang quản lý</p>
            </div>
          </div>

          <!-- 🟩 Tổng giá trị -->
          <div
              class="group bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-lg p-4 border border-emerald-200
               hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">

            <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-600/20 rounded-full -mr-12 -mt-12"></div>

            <div class="relative">
              <div class="flex items-center justify-between mb-2">
                <div class="bg-gradient-to-br from-emerald-600 to-emerald-700 p-2 rounded-xl shadow-lg
                      group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-sack-dollar text-white text-lg"></i>
                </div>

                <div :class="[
                'flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full',
                stats.rateGiaTri >= 0 ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100'
              ]">
                  <i :class="[
                  'fa-solid text-xs',
                  stats.rateGiaTri >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'
                ]"></i>

                  {{ stats.rateGiaTri.toFixed(1) }}% so với cùng kỳ
                </div>
              </div>

              <h3 class="text-slate-900 text-sm font-medium mb-1">Tổng Giá Trị</h3>
              <p class="text-2xl font-bold text-slate-900 mb-1">{{ formatMoneyVN(stats.totalValue) }}</p>
              <p class="text-xs text-slate-600">Giá trị danh mục đầu tư</p>
            </div>
          </div>

          <!-- 🟨 Giá trung bình -->
          <div
              class="group bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-lg p-4 border border-amber-200
               hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">

            <div class="absolute top-0 right-0 w-24 h-24 bg-amber-600/20 rounded-full -mr-12 -mt-12"></div>

            <div class="relative">
              <div class="flex items-center justify-between mb-2">
                <div class="bg-gradient-to-br from-amber-600 to-amber-700 p-2 rounded-xl shadow-lg
                      group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-chart-column text-white text-lg"></i>
                </div>

                <div :class="[
                'flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-full',
                stats.rateGiaTB >= 0 ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100'
              ]">
                  <i :class="[
                  'fa-solid text-xs',
                  stats.rateGiaTB >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'
                ]"></i>

                  {{ stats.rateGiaTB.toFixed(1) }}% so với cùng kỳ
                </div>
              </div>

              <h3 class="text-slate-900 text-sm font-medium mb-1">Giá TB/Sản Phẩm</h3>
              <p class="text-2xl font-bold text-slate-900 mb-1">{{ formatMoneyVN(stats.avgValue) }}</p>
              <p class="text-xs text-slate-600">Giá trị trung bình</p>
            </div>
          </div>

          <!-- 🟪 Đơn vị phân phối -->
          <div
              class="group bg-gradient-to-br from-white to-violet-50 rounded-xl shadow-lg p-4 border border-violet-200
               hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">

            <div class="absolute top-0 right-0 w-24 h-24 bg-violet-600/20 rounded-full -mr-12 -mt-12"></div>

            <div class="relative">
              <div class="flex items-center justify-between mb-2">
                <div class="bg-gradient-to-br from-violet-600 to-violet-700 p-2 rounded-xl shadow-lg
                      group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-handshake text-white text-lg"></i>
                </div>
              </div>

              <h3 class="text-slate-900 text-sm font-medium mb-1">Đơn Vị Phân Phối</h3>
              <div class="flex items-baseline gap-1">
                <p class="text-2xl font-bold text-slate-900">{{ stats.thgCount }}</p>
                <span class="text-xs text-slate-600">THG</span>

                <span class="text-slate-300">|</span>

                <p class="text-lg font-bold text-slate-900">{{ stats.partnerCount }}</p>
                <span class="text-xs text-slate-500">Đối tác</span>
              </div>
            </div>
          </div>

        </div>


        <!-- Bộ lọc nâng cao -->
        <div class="bg-white rounded-xl shadow-lg border border-slate-300 mb-5 p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="bg-gradient-to-r from-indigo-600 to-blue-600 p-1.5 rounded-lg">
                <i class="fa-solid fa-filter text-white text-sm"></i>
              </div>
              <h2 class="text-base font-bold text-slate-900">Bộ Lọc Nâng Cao</h2>
            </div>
            <div class="flex items-center gap-1">
              <button
                  @click="$router.push('/-thg/quan-ly-san-pham/tao-moi')"
                  class="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all shadow-md hover:shadow-lg text-sm"
              >
                <i class="fa-solid fa-plus text-xs"></i>
                <span class="font-medium">Thêm sản phẩm</span>
              </button>
              <button
                  @click="toggleSelectedRows"
                  class="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg text-sm"
              >
                <i class="fa-solid fa-repeat text-xs"></i>
                <span class="font-medium">Hiện ra ngoài</span>
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

          <div
              class="grid gap-2"
              style="grid-template-columns: repeat(8, minmax(0, 1fr));"
          >

            <!-- Mức giá -->
            <div class="min-w-0">
              <label class="block text-[11px] font-bold text-slate-800 mb-0.5 flex items-center gap-1 truncate mb-1">
                <i class="fa-solid fa-dollar-sign text-blue-600 text-[10px]"></i>
                <span class="truncate">Mức Giá</span>
              </label>
              <select
                  v-model="filterGiaRange"
                  class="w-full min-w-0 px-1.5 py-1 text-[12px]
             border border-slate-400 rounded-md
             focus:ring-1 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm"
              >
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
            <div class="min-w-0">
              <label class="block text-[11px] font-bold text-slate-800 mb-0.5 flex items-center gap-1 truncate mb-1">
                <i class="fa-solid fa-city text-emerald-600 text-[10px]"></i>
                <span class="truncate">Tỉnh Thành</span>
              </label>
              <select
                  v-model="filterProvince"
                  class="w-full min-w-0 px-1.5 py-1 text-[12px]
             border border-slate-400 rounded-md
             focus:ring-1 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm"
              >
                <option value="">Tất cả</option>
                <option v-for="p in provinces" :key="p" :value="p">
                  {{ formatProvinceShort(p) }}
                </option>
              </select>
            </div>

            <!-- Phường/Xã -->
            <div class="min-w-0">
              <label class="block text-[11px] font-bold text-slate-800 mb-0.5 flex items-center gap-1 truncate mb-1">
                <i class="fa-solid fa-location-dot text-violet-600 text-[10px]"></i>
                <span class="truncate">Phường/Xã</span>
              </label>
              <select
                  v-model="filterWard"
                  class="w-full min-w-0 px-1.5 py-1 text-[12px]
             border border-slate-400 rounded-md
             focus:ring-1 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm"
              >
                <option value="">Tất cả</option>
                <option v-for="w in wards" :key="w" :value="w">{{ w }}</option>
              </select>
            </div>

            <!-- Loại mặt hàng -->
            <div class="min-w-0">
              <label class="block text-[11px] font-bold text-slate-800 mb-0.5 flex items-center gap-1 truncate mb-1">
                <i class="fa-solid fa-tag text-rose-600 text-[10px]"></i>
                <span class="truncate">Loại MH</span>
              </label>
              <select
                  v-model="filterLoaiMH"
                  class="w-full min-w-0 px-1.5 py-1 text-[12px]
             border border-slate-400 rounded-md
             focus:ring-1 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm"
              >
                <option value="">Tất cả</option>
                <option value="BN30N">BN 30N</option>
                <option value="HOPTAC">Hợp tác</option>
                <option value="HTT">Thị trường</option>
              </select>
            </div>

            <!-- Vị trí -->
            <div class="min-w-0">
              <label class="block text-[11px] font-bold text-slate-800 mb-0.5 flex items-center gap-1 truncate mb-1">
                <i class="fa-solid fa-location-arrow text-cyan-600 text-[10px]"></i>
                <span class="truncate">Vị Trí</span>
              </label>
              <select
                  v-model="filterViTri"
                  class="w-full min-w-0 px-1.5 py-1 text-[12px]
             border border-slate-400 rounded-md
             focus:ring-1 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm"
              >
                <option value="">Tất cả</option>
                <option value="Mặt tiền">Mặt tiền</option>
                <option value="Hẻm">Hẻm</option>
                <option value="Hẻm cụt">Hẻm cụt</option>
                <option value="Khu dân cư">Khu dân cư</option>
                <option value="MT đường lớn">MT đường lớn</option>
                <option value="Chưa cập nhật">Chưa cập nhật</option>
              </select>
            </div>

            <!-- Tình trạng -->
            <div class="min-w-0">
              <label class="block text-[11px] font-bold text-slate-800 mb-0.5 flex items-center gap-1 truncate mb-1 mb-1">
                <i class="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i>
                <span class="truncate">Trạng thái</span>
              </label>
              <select
                  v-model="filterDaBan"
                  class="w-full min-w-0 px-1.5 py-1 text-[12px]
             border border-slate-400 rounded-md
             focus:ring-1 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm"
              >
                <option value="">Tất cả</option>
                <option value="Chưa định giá">Mới</option>
                <option value="Bán giải pháp">Bán giải pháp</option>
                <option value="Bán nhanh 30 ngày">Bán nhanh 30 ngày</option>
                <option value="Đã bán">Đã bán</option>
              </select>
            </div>

            <div class="min-w-0">
              <label class="block text-[11px] font-bold text-slate-800 mb-0.5 flex items-center gap-1 truncate mb-1 mb-1">
                <i class="fa-solid fa-circle-check text-primary text-[10px]"></i>
                <span class="truncate">Đăng ký kểm duyệt</span>
              </label>
              <select
                  v-model="filterKiemDuyet"
                  class="w-full min-w-0 px-1.5 py-1 text-[12px]
             border border-slate-400 rounded-md
             focus:ring-1 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm"
              >
                <option value="">Tất cả</option>
                <option :value="true">Có đăng ký</option>
                <option :value="false">Chưa đăng ký</option>
              </select>
            </div>

            <!-- Hiện ra ngoài -->
            <div class="min-w-0">
              <label class="block text-[11px] font-bold text-slate-800 mb-0.5 flex items-center gap-1 truncate mb-1">
                <i class="fa-solid fa-eye text-yellow-500 text-[10px]"></i>
                <span class="truncate">Hiển Thị</span>
              </label>
              <select
                  v-model="filterShow"
                  class="w-full min-w-0 px-1.5 py-1 text-[12px]
             border border-slate-400 rounded-md
             focus:ring-1 focus:ring-blue-600 focus:border-transparent
             bg-white shadow-sm"
              >
                <option value="">Tất cả</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

          </div>
        </div>

        <!-- Bảng dữ liệu -->
        <div class="bg-white rounded-2xl shadow-xl border border-slate-300 mb-5 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm rounded-2xl overflow-hidden">
              <thead class="table-header">
              <tr class="font-bold text-white">
                <th class="text-center">
                  <div class="flex justify-content-center items-center pr-1 ml-3 ">
                    <input
                        type="checkbox"
                        @change="toggleSelectAll"
                        ref="selectAllRef"
                        class="w-3 h-3 cursor-pointer"
                    />
                  </div>
                </th>
                <th class="text-center">STT</th>
                <th class="text-left">Chủ Nhà</th>
                <th class="text-left">SĐT</th>
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
                <th class="text-left">Show</th>
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
                <td class="text-center">
                  <div class="flex justify-end items-center pr-1 ml-3">
                    <input
                        type="checkbox"
                        v-model="selectedRows"
                        :value="item.id"
                        class="w-3 h-3 cursor-pointer"
                    />
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
                <td class="font-bold text-blue-700">{{ formatMoneyVN(item.giaBan) }}</td>
                <td
                    :class="item.giaDinhGia? 'font-bold text-blue-700' : 'text-slate-800 text-gray-800'"
                >
                  {{ item.giaDinhGia ? formatMoneyVN(item.giaDinhGia) : '—' }}
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
                  {{ item.phiMoiGioi != null ? item.phiMoiGioi + '%' : '-' }}
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
                      @click="toggleShowSingle(item)"
                      :class="[
                                'px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 transition-all shadow-sm font-semibold',
                                item.show
                                  ? 'bg-[#00C2A8] text-white hover:bg-[#00b89f]'   // YES
                                  : 'bg-[#E63946] text-white  hover:bg-[#d5303d]'   // NO
                              ]"
                      style="border-radius: 8px; font-size: 12px; line-height: 16px;" >
                    <i
                        :class="[
                              'fa-solid text-white text-[11px]',
                              item.show ? 'fa-check' : 'fa-xmark'
                            ]"
                    ></i>

                    {{ item.show ? 'Yes' : 'No' }}
                  </button>
                </td>

                <td class="text-center">
                  <button
                      @click="$router.push(`/-thg/quan-ly-san-pham/${item.id}`)"
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
          <div
              class="flex items-center justify-between p-3 bg-gradient-to-r from-slate-100 to-slate-200 border-t border-slate-300">
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

        <!--       Thống kê phân loại -->
        <div class="grid grid-cols-4 gap-3 mb-5">
          <div
              v-for="([category, count]) in Object.entries(stats.loaiMHStats)"
              :key="category"
              class="LoaiMH-card"
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-3">
        <span :class="['badge-LoaiMH', badgeClass(category)]">
          {{ category }}
        </span>

              <div class="icon-chart">
                <i class="fa-solid fa-chart-pie"></i>
              </div>
            </div>

            <!-- Number -->
            <p class="LoaiMH-count">
              {{ count }}
              <span class="LoaiMH-label">tài sản</span>
            </p>

            <!-- Progress bar -->
            <div class="progress-wrap">
              <div
                  class="progress"
                  :style="{ width: `${(count / stats.total) * 100}%` }"
              ></div>
            </div>

            <!-- Percent -->
            <p class="LoaiMH-percent">
              {{ ((count / stats.total) * 100).toFixed(1) }}% tổng danh mục
            </p>
          </div>
        </div>

        <!-- Thống kê vị trí -->
        <div class="bg-white rounded-xl shadow-lg border border-slate-300 p-4">
          <div class="flex items-center gap-2 mb-3">
            <div class="bg-gradient-to-r from-violet-600 to-purple-600 p-1.5 rounded-lg">
              <i class="fa-solid fa-location-dot text-white text-sm"></i>
            </div>
            <h2 class="text-base font-bold text-slate-900">Phân Tích Vị Trí</h2>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div
                v-for="([location, count]) in Object.entries(stats.khuVucStats)"
                :key="location"
                class="location-card"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="icon-wrap">
                    <i class="fa-solid fa-map-marker-alt text-violet-700"></i>
                  </div>
                  <h3 class="title">{{ chinhTenKhuVuc(location) }}</h3>
                </div>
              </div>

              <!-- Number -->
              <p class="count">{{ count }}</p>

              <div class="progress-wrap">
                <div
                    class="progress-bar"
                    :style="{ width: `${(count / stats.total) * 100}%` }"
                ></div>
              </div>

              <p class="percent">{{ ((count / stats.total) * 100).toFixed(1) }}%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </template>

  <script setup>
  import {ref, computed, watch, onMounted} from "vue";
  import addressData from "/src/assets/js/address.json";
  import NotificationBell from "/src/components/NotificationBell.vue";

  const filterShow = ref("");

  import {useAuthStore} from "/src/stores/authStore.js";
  const authStore = useAuthStore();
  const info = authStore.userInfo;



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
  const filterDaBan = ref("");
  const filterKiemDuyet = ref("");

  // Pagination
  const page = ref(0);
  const pageSize = ref(10);
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

    // Thay "Đường" (hoặc đường) thành "Đ."
    clean = clean.replace(/(\d+\s*)(đường)\s+/i, "$1Đ. ");

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


  const formatWardShort = (ward) => {
    if (!ward || typeof ward !== "string") return ward || "";
    return ward
        .replace(/^Phường\s+/i, "P.")
        .replace(/^Xã\s+/i, "X.")
        .replace(/^Thị trấn\s+/i, "TT.");
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
    if (dtcnValue > 10000) return "land-large";

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
  import {showCenterWarning, showCenterSuccess, showCenterError} from "../../assets/js/alertService.js";

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

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      selectedRows.value = landAssets.value.map((x) => x.id);
    } else {
      selectedRows.value = [];
    }
  };

  watch([selectedRows, landAssets], () => {
    const idsInPage = landAssets.value.map((x) => x.id);
    const selectedInPage = idsInPage.filter((id) =>
        selectedRows.value.includes(id)
    );

    if (!selectAllRef.value) return;

    if (selectedInPage.length === 0) {
      selectAllRef.value.checked = false;
      selectAllRef.value.indeterminate = false;
    } else if (selectedInPage.length === idsInPage.length) {
      selectAllRef.value.checked = true;
      selectAllRef.value.indeterminate = false;
    } else {
      selectAllRef.value.checked = false;
      selectAllRef.value.indeterminate = true;
    }
  });

  // Toggle show
  const toggleSelectedRows = async () => {
    await toggleShowFromServer();
    landAssets.value = landAssets.value.map((item) =>
        selectedRows.value.includes(item.id)
            ? {...item, show: !item.show}
            : item
    );
  };


  async function toggleShowFromServer() {
    if (selectedRows.value.length === 0) {
      showCenterWarning("Chưa chọn tài sản", "Vui lòng chọn ít nhất 1 dòng để cập nhật.");
      return;
    }

    try {
      await api.post("/admin.thg/product/admin/toggle-show-multiple", selectedRows.value);

      showCenterSuccess(
          "Đã cập nhật trạng thái!",
          `${selectedRows.value.length} tài sản đã được đổi trạng thái hiển thị.`
      );

    } catch (e) {
      console.error(e);
      showCenterError(
          "Lỗi cập nhật!",
          "Không thể thay đổi trạng thái hiển thị. Vui lòng thử lại."
      );
    }
  }


  async function toggleShowSingle(item) {
    try {
      await api.post(`/admin.thg/product/admin/toggle-show/${item.id}`);

      // Cập nhật giao diện FE
      item.show = !item.show;

      showCenterSuccess(
          "Cập nhật thành công",
          `Tài sản ID ${item.id} đã được đổi trạng thái hiển thị.`
      );

    } catch (e) {
      console.error(e);
      showCenterError(
          "Lỗi cập nhật!",
          "Không thể thay đổi trạng thái hiển thị tài sản. Vui lòng thử lại."
      );
    }
  }


  // API
  import api from "/src/api/api.js";
  import {showError} from "../../assets/js/alertService.js";

  const stats = ref({
    total: 0,
    loaiMHStats: {},
    khuVucStats: {},
    totalValue: 0,
    avgValue: 0,
    thgCount: 0,
    partnerCount: 0,
    rateSanPham: 0,
    rateGiaTri: 0,
    rateGiaTB: 0,
    rateDonVi: 0,
  });

  async function fetchDashboardStats() {
    try {
      const res = await api.get("/admin.thg/product/admin/tong-quan");
      const data = res.data;

      stats.value.total = data.tongSanPham;
      stats.value.totalValue = data.tongGiaTri;
      stats.value.avgValue = data.giaTrungBinh;
      stats.value.thgCount = data.soDonViTHG;
      stats.value.partnerCount = data.soDonViDoiTac;
      stats.value.rateSanPham = data.tyLeTangSanPham;
      stats.value.rateGiaTri = data.tyLeTangGiaTri;
      stats.value.rateGiaTB = data.tyLeTangGiaTB;
      stats.value.rateDonVi = data.tyLeTangDonVi;
      stats.value.loaiMHStats = data.loaiHangStats;
      stats.value.khuVucStats = data.khuVucStats;

    } catch (e) {
      console.error("Lỗi khi tải thống kê:", e);
    }
  }

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

  function chinhTenKhuVuc(value) {
    if (!value || typeof value !== "string") return value;
    const trimmed = value.trim();
    const regex = /^(thành\s*phố|tp\.?|tp)(\s+|$)/i;
    return regex.test(trimmed) ? trimmed : "Tỉnh " + trimmed;
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
        filterDaBan,
        filterShow,
        searchQuery,
        filterKiemDuyet,
        page,
        pageSize,
      ],
      () => debouncedFilter(),
      {deep: true, immediate: true}
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
      hienThi: filterShow.value === "" ? null : filterShow.value === "yes",
      kiemDuyet:  filterKiemDuyet.value === "" ? null: filterKiemDuyet.value,
      trangThai: filterDaBan.value || null
    };

    try {
      const res = await api.post(
          "/admin.thg/product/admin/bang-du-lieu",
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
    fetchDashboardStats();
    fetchFilteredAssets();
  });
  </script>

  <style scoped>

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

  th {
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

  .location-card {
    background: linear-gradient(to bottom right, #fafafa, #f3f4f6);
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition: transform .2s ease, box-shadow .2s ease;
  }

  .location-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  }

  .icon-wrap {
    background: #ede9fe; /* tím nhạt */
    padding: 6px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    font-size: 0.9rem;
    font-weight: 700;
    color: #4c1d95;
  }

  .count {
    font-size: 1.8rem;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 6px;
  }

  .progress-wrap {
    width: 100%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(to right, #7c3aed, #6366f1); /* tím đẹp */
    border-radius: 999px;
    transition: width 0.4s ease;
  }

  .percent {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }

  /* Card tổng thể */
  .LoaiMH-card {
    background: linear-gradient(to bottom right, #ffffff, #f8fafc);
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    transition: 0.25s ease;
  }

  .LoaiMH-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  }

  /* Badge nhu cầu */
  .badge-LoaiMH {
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 700;
    border-radius: 8px;
  }

  /* Icon góc phải */
  .icon-chart {
    background: #e2e8f0;
    padding: 6px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-chart i {
    color: #475569;
    font-size: 14px;
  }

  /* Số lượng */
  .LoaiMH-count {
    font-size: 26px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .LoaiMH-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }

  /* Progress bar */
  .progress-wrap {
    width: 100%;
    height: 6px;
    background: #e2e8f0;
    border-radius: 999px;
    overflow: hidden;
    margin-bottom: 4px;
  }

  .progress {
    height: 100%;
    background: linear-gradient(to right, #7c3aed, #6366f1);
    border-radius: 999px;
    transition: width 0.45s ease;
  }

  /* % */
  .LoaiMH-percent {
    font-size: 12px;
    color: #475569;
    font-weight: 500;
  }

  </style>
