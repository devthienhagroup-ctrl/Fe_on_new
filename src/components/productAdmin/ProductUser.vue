<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-3 py-3" style="padding-top: 90px!important;">
    <div class="max-w-[1600px] mx-auto">
      <!-- Bộ lọc nâng cao -->
      <div class="bg-white rounded-xl shadow-lg border border-slate-300 mb-5 p-4"
           style="
            background-image: url('https://s3.cloudfly.vn/thg-storage-dev/uploads-public/thienhagroup_filter_2.png');
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
              <span class="text-sm font-medium">Slider</span>
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
          <!-- Toggle FILTER – chỉ dùng breakpoint RIÊNG -->


        </div>
        <div v-if="isFilterMobile" class="flex justify-end mb-3">
          <button
              @click="showFilterPanel = !showFilterPanel"
              class="px-3 py-1.5 rounded-lg border flex items-center gap-2
           transition-all"
              :class="showFilterPanel
      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
          >
            <i
                :class="[
        'fa-solid text-sm',
        showFilterPanel ? 'fa-chevron-up' : 'fa-chevron-down'
      ]"
            ></i>
            <span class="text-sm font-medium">
      {{ showFilterPanel ? 'Thu gọn bộ lọc' : 'Hiển thị bộ lọc' }}
    </span>
          </button>
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

        <div class="filter-row" v-show="!isFilterMobile || showFilterPanel">


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
                <th class="text-left">TT</th>
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
                <td class="text-slate-900 text-gray-800">
                  {{ catChuoi(item.ketCau || '-', 10) }}
                </td>
                <td class="text-slate-900 text-gray-800">{{  formatDate(item.capNhatNgay) }}</td>
                <td class="font-bold text-blue-700">
                  <div style="position: relative; top: -3px;">
                    {{ item.phiMoiGioi != null ? item.phiMoiGioi + '%' : '-' }}
                  </div>
                </td>
                <td class="font-bold">
                  <img v-if="item.status === 'Đã kiểm duyệt'"
                       src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/icon-kiem-duỵet.png"
                       style="width: 27px"
                  />
                  <img v-else-if="item.status === 'Đã bán'" src="/imgs/sold-out.png" style="width: 29px"/>
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
                <td class="text-center relative">
                  <!-- ACTION FULL (>=1300px) -->
                  <div class="action-full inline-flex items-center">
                    <button
                        @click="toggleLove(item)"
                        class="action-heart"
                    >
                      <i
                          :class="item.daThich
          ? 'fa-solid fa-heart text-black text-base'
          : 'fa-regular fa-heart text-base'"
                      ></i>
                    </button>

                    <!-- HỢP TÁC -->
                    <button
                        @click="openCollabModal(item)"
                        class="action-collab"
                    >
                      <i class="fa-solid fa-handshake text-[10px]"></i>
                      <span>Hợp tác</span>
                    </button>

                    <button
                        @click="$router.push(buildSeoUrl(item))"
                        class="action-view"
                    >
                      <i class="fa-regular fa-eye text-[10px]"></i>
                      <span>Xem</span>
                    </button>
                  </div>

                  <!-- ACTION DOT ( <1300px ) -->
                  <div class="action-dot relative inline-block">
                    <button class="dot-btn">
                      <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>

                    <!-- DROPDOWN -->
                    <div class="dot-menu">
                      <button
                          @click="toggleLove(item)"
                          class="dot-item"
                      >
                        <i
                            :class="item.daThich
            ? 'fa-solid fa-heart text-red-500'
            : 'fa-regular fa-heart'"
                        ></i>
                        <span>Yêu thích</span>
                      </button>
                      <!-- HỢP TÁC -->
                      <button
                          v-if="canRequestCollaboration(item)"
                          @click="openCollabModal(item)"
                          class="dot-item"
                      >
                        <i class="fa-solid fa-handshake"></i>
                        <span>Hợp tác</span>
                      </button>
                      <button
                          @click="$router.push(buildSeoUrl(item))"
                          class="dot-item"
                      >
                        <i class="fa-regular fa-eye"></i>
                        <span>Xem chi tiết</span>
                      </button>
                    </div>
                  </div>
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

      <!-- Chế độ xem slider - 3 loại mặt hàng -->
      <template v-else>
        <!-- Loading hiệu ứng cho toàn bộ page -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p class="text-lg font-semibold text-slate-700">Đang tải sản phẩm...</p>
          </div>
        </div>

        <!-- Hiển thị slider theo loại mặt hàng -->
        <div v-else>
          <!-- Loading skeleton cho BN30N khi đang load more -->
          <div v-if="bn30nLoading && bn30nItems.length === 0 && shouldShowCategory('BN30N')" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
              <div class="flex gap-2">
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div class="flex gap-4">
              <div v-for="i in 4" :key="i" class="slider-item">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 animate-pulse">
                  <div class="bg-slate-300 h-48 rounded-xl mb-4"></div>
                  <div class="space-y-3">
                    <div class="h-4 bg-slate-300 rounded"></div>
                    <div class="h-4 bg-slate-300 rounded w-2/3"></div>
                    <div class="h-4 bg-slate-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- BN30N - Bán nhanh 30 ngày -->
          <div v-if="shouldShowCategory('BN30N') && bn30nItems.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2
                  class="text-xl font-bold text-slate-800 flex items-center gap-2 px-3 py-2 rounded-lg"
                  style="
  background: linear-gradient(
    90deg,
    rgba(34,197,94,0.45) 0%,
    rgba(34,197,94,0.32) 50%,
    rgba(34,197,94,0.16) 80%,
    rgba(34,197,94,0) 100%
  );
  border-left: 10px solid #22c55e;
"
>
                  Bán Nhanh 30 Ngày
                <span class="text-sm font-normal text-slate-700">
    ({{ bn30nTotal }} sản phẩm)
  </span>
              </h2>

              <div class="flex items-center gap-2">
                <button @click="scrollSlider('bn30n', -1)"
                        class="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-all">
                  <i class="fa-solid fa-chevron-left text-slate-700"></i>
                </button>
                <button @click="scrollSlider('bn30n', 1)"
                        class="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-all">
                  <i class="fa-solid fa-chevron-right text-slate-700"></i>
                </button>
              </div>
            </div>

            <!-- Slider container -->
            <div class="relative">
              <div ref="bn30nSlider" class="flex overflow-x-auto scrollbar-hide gap-4 pb-4 slider-container"
                   @scroll="handleScroll('bn30n')"
                   style="scroll-behavior: smooth;">
                <div v-for="item in bn30nItems" :key="item.id"
                     class="slider-item">
                  <!-- Card item (giữ nguyên cấu trúc) -->
                  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden
                      hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full">
                    <!-- Ảnh -->
                    <div @click="goToDetail(item)" style="cursor: pointer;">
                      <div class="relative w-full overflow-hidden" style="height: 200px">
                        <div class="relative w-full h-full px-3 pt-3 rounded-3 overflow-hidden aspect-[4/3] w-full">
                          <img
                              :src="item.imageUrl || 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg'"
                              class="w-full rounded-3 h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <!-- Tag loại tài sản -->
                        <div class="absolute top-2 mt-3 ms-3 left-2 flex items-center gap-2">
                          <!-- Loại tài sản -->
                          <div
                              class="px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm text-white"
                              style="font-size: 10px !important;">
                            <i :class="getAssetTypeIcon(item)" style="font-size: 13px !important;"></i>
                            {{ getLoai(item) || '—' }}
                          </div>

                          <!-- Trạng thái khóa/mở -->
                          <div
                              class="px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm"
                              :class="item.moKhoa ? 'text-green-300' : 'text-yellow-300'"
                              style="font-size: 10px !important;">
                            <i :class="item.moKhoa ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'" style="font-size: 10px !important;"></i>
                            <span style="font-size: 10px !important;">{{ item.moKhoa ? 'Đã mở' : 'Chưa mở' }}</span>
                          </div>
                        </div>
                        <div v-if="'Đã bán' === item.status" class="absolute top-3 mr- ms-3 right-2 flex items-center gap-2" style="width: 60px; position: absolute; top: 7px; right: 3px">
                          <img src="/imgs/sold-out.png"/>
                        </div>
                        <div v-else-if="'Đã kiểm duyệt' === item.status" class="absolute top-3 mr-0 ms-3 right-2 flex items-center gap-2" style="width: 60px; position: absolute; top: 7px; right: 3px">
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
                                class="px-2 py-0.5 rounded-full bg-green-500 text-white font-semibold"
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
                      </div>
                    </div>

                    <!-- Nút xem chi tiết + nút yêu thích -->
                    <div class="flex items-center gap-2 px-3 pb-3">
                      <!-- Nút Xem chi tiết -->
                      <button
                          @click="$router.push(buildSeoUrl(item))"
                          class="flex-1 py-2.5 bg-gradient-to-r from-slate-900 to-black text-white rounded-full
                           text-[14px] font-semibold flex items-center justify-center gap-2
                           hover:opacity-90 transition-all"
                      >
                        <i class="fa-regular fa-eye text-sm"></i>
                        Xem chi tiết
                      </button>

                      <!-- Hợp tác -->
                          <button
                              @click="openCollabModal(item)"
                              class="px-4 py-2.5 rounded-full
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       text-white font-semibold text-[14px]
                       hover:opacity-90 transition-all shadow-sm"
                          >
                            <i class="fa-solid fa-handshake text-sm"></i>
                            Hợp tác
                          </button>

                      <!-- Nút Yêu thích -->
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

                <!-- Load more indicator -->
                <div v-if="bn30nLoading && bn30nItems.length > 0" class="slider-item flex items-center justify-center">
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
                    <p class="mt-2 text-sm text-slate-600">Đang tải thêm...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading skeleton cho HOPTAC khi đang load more -->
          <div v-if="hoptacLoading && hoptacItems.length === 0 && shouldShowCategory('HOPTAC')" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
              <div class="flex gap-2">
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div class="flex gap-4">
              <div v-for="i in 4" :key="i" class="slider-item">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 animate-pulse">
                  <div class="bg-slate-300 h-48 rounded-xl mb-4"></div>
                  <div class="space-y-3">
                    <div class="h-4 bg-slate-300 rounded"></div>
                    <div class="h-4 bg-slate-300 rounded w-2/3"></div>
                    <div class="h-4 bg-slate-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- HOPTAC - Hàng hợp tác -->
          <div v-if="shouldShowCategory('HOPTAC') && hoptacItems.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2
                  class="text-xl font-bold text-slate-800 flex items-center gap-2 px-3 py-2 rounded-lg"
                  style="
    background: linear-gradient(
      90deg,
      rgba(249,115,22,0.45) 0%,
      rgba(249,115,22,0.32) 50%,
      rgba(249,115,22,0.16) 80%,
      rgba(249,115,22,0) 100%
    );
    border-left: 7px solid #fb923c;
  "
              >
                Hàng Hợp Tác
                <span class="text-sm font-normal text-slate-700">
    ({{ hoptacTotal }} sản phẩm)
  </span>
              </h2>

              <div class="flex items-center gap-2">
                <button @click="scrollSlider('hoptac', -1)"
                        class="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-all">
                  <i class="fa-solid fa-chevron-left text-slate-700"></i>
                </button>
                <button @click="scrollSlider('hoptac', 1)"
                        class="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-all">
                  <i class="fa-solid fa-chevron-right text-slate-700"></i>
                </button>
              </div>
            </div>

            <!-- Slider container -->
            <div class="relative">
              <div ref="hoptacSlider" class="flex overflow-x-auto scrollbar-hide gap-4 pb-4 slider-container"
                   @scroll="handleScroll('hoptac')"
                   style="scroll-behavior: smooth;">
                <div v-for="item in hoptacItems" :key="item.id"
                     class="slider-item">
                  <!-- Card item (tương tự như trên, chỉ đổi màu badge) -->
                  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden
                      hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full">
                    <!-- Nội dung card tương tự như BN30N -->
                    <!-- ... (giữ nguyên cấu trúc card) -->
                    <div @click="goToDetail(item)" style="cursor: pointer;">
                      <div class="relative w-full overflow-hidden" style="height: 200px">
                        <div class="relative w-full h-full px-3 pt-3 rounded-3 overflow-hidden aspect-[4/3] w-full">
                          <img
                              :src="item.imageUrl || 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg'"
                              class="w-full rounded-3 h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <!-- Tag loại tài sản -->
                        <div class="absolute top-2 mt-3 ms-3 left-2 flex items-center gap-2">
                          <div
                              class="px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm text-white"
                              style="font-size: 10px !important;">
                            <i :class="getAssetTypeIcon(item)" style="font-size: 13px !important;"></i>
                            {{ getLoai(item) || '—' }}
                          </div>
                          <div
                              class="px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm"
                              :class="item.moKhoa ? 'text-green-300' : 'text-yellow-300'"
                              style="font-size: 10px !important;">
                            <i :class="item.moKhoa ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'" style="font-size: 10px !important;"></i>
                            <span style="font-size: 10px !important;">{{ item.moKhoa ? 'Đã mở' : 'Chưa mở' }}</span>
                          </div>
                        </div>
                        <div v-if="'Đã bán' === item.status" class="absolute top-3 mr- ms-3 right-2 flex items-center gap-2" style="width: 60px; position: absolute; top: 7px; right: 3px">
                          <img src="/imgs/sold-out.png"/>
                        </div>
                        <div v-else-if="'Đã kiểm duyệt' === item.status" class="absolute top-3 mr-0 ms-3 right-2 flex items-center gap-2" style="width: 60px; position: absolute; top: 7px; right: 3px">
                          <img src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/icon-kiem-duỵet.png"/>
                        </div>
                      </div>

                      <div class="p-3 leading-tight text-slate-800">
                        <div class="font-semibold text-slate-900 mb-1"
                             style="
                              font-size: 15px;
                              font-weight: 700;
                              text-transform: uppercase;
                              white-space: nowrap;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            ">
                          {{ formatWardCard(item.diaChi) }}, {{ formatProvinceCard(item.khuVuc) }}
                        </div>
                        <div class="font-semibold text-slate-500" style="font-size: 13px">
                          Ngày cập nhật: {{ formatDate(item.capNhatNgay) }}
                        </div>

                        <div class="flex items-center justify-between mt-1">
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

                          <div class="flex items-center gap-2 mt-2">
                            <div
                                class="px-2.5 py-0.5 rounded-full text-white shadow-sm"
                                :class="item.donVi === 'THG' ? 'bg-[#6A0DAD]' : 'bg-[#0057D9]'"
                                style="font-weight: 550; font-size: 12.5px !important;">
                              {{ item.donVi }}
                            </div>
                            <span
                                class="px-2 py-0.5 rounded-full bg-orange-500 text-white font-semibold"
                                style="font-weight: 550; font-size: 12.5px !important;">
                              {{ item.loaiMH }}
                            </span>
                          </div>
                        </div>

                        <div class="flex items-center justify-between mt-2 text-[14px]">
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
                          <div class="flex items-center gap-3 text-slate-500 text-[12px] shrink-0">
                            <div class="flex items-center gap-1 font-medium ">
                              <span class="font-medium text-slate-700">
                                {{ item.soLuotXem ?? 0 }}
                              </span>đã xem
                            </div>
                            <div class="flex items-center gap-1 font-medium ">
                              <span class="font-medium text-slate-700">
                                {{ item.soLuotThich ?? 0 }}
                              </span>đã thích
                            </div>
                          </div>
                        </div>

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
                      </div>
                    </div>

                    <div class="flex items-center gap-2 px-3 pb-3">
                      <button
                          @click="$router.push(buildSeoUrl(item))"
                          class="flex-1 py-2.5 bg-gradient-to-r from-slate-900 to-black text-white rounded-full
                           text-[14px] font-semibold flex items-center justify-center gap-2
                           hover:opacity-90 transition-all"
                      >
                        <i class="fa-regular fa-eye text-sm"></i>
                        Xem chi tiết
                      </button>
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

                <!-- Load more indicator -->
                <div v-if="hoptacLoading && hoptacItems.length > 0" class="slider-item flex items-center justify-center">
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
                    <p class="mt-2 text-sm text-slate-600">Đang tải thêm...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading skeleton cho HTT khi đang load more -->
          <div v-if="httLoading && httItems.length === 0 && shouldShowCategory('HTT')" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
              <div class="flex gap-2">
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
                <div class="w-10 h-10 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div class="flex gap-4">
              <div v-for="i in 4" :key="i" class="slider-item">
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 animate-pulse">
                  <div class="bg-slate-300 h-48 rounded-xl mb-4"></div>
                  <div class="space-y-3">
                    <div class="h-4 bg-slate-300 rounded"></div>
                    <div class="h-4 bg-slate-300 rounded w-2/3"></div>
                    <div class="h-4 bg-slate-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- HTT - Hàng thị trường -->
          <div v-if="shouldShowCategory('HTT') && httItems.length > 0" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <h2
                  class="text-xl font-bold text-slate-800 flex items-center gap-2 px-3 py-2 rounded-lg"
                  style="
    background: linear-gradient(
      90deg,
      rgba(234,179,8,0.45) 0%,
      rgba(234,179,8,0.32) 50%,
      rgba(234,179,8,0.16) 80%,
      rgba(234,179,8,0) 100%
    );
    border-left: 7px solid #facc15;
  "
              >
                Hàng Thị Trường
                <span class="text-sm font-normal text-slate-700">
    ({{ httTotal }} sản phẩm)
  </span>
              </h2>

              <div class="flex items-center gap-2">
                <button @click="scrollSlider('htt', -1)"
                        class="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-all">
                  <i class="fa-solid fa-chevron-left text-slate-700"></i>
                </button>
                <button @click="scrollSlider('htt', 1)"
                        class="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-50 transition-all">
                  <i class="fa-solid fa-chevron-right text-slate-700"></i>
                </button>
              </div>
            </div>

            <!-- Slider container -->
            <div class="relative">
              <div ref="httSlider" class="flex overflow-x-auto scrollbar-hide gap-4 pb-4 slider-container"
                   @scroll="handleScroll('htt')"
                   style="scroll-behavior: smooth;">
                <div v-for="item in httItems" :key="item.id"
                     class="slider-item">
                  <!-- Card item (tương tự như trên, chỉ đổi màu badge) -->
                  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden
                      hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full">
                    <!-- Nội dung card tương tự như BN30N -->
                    <!-- ... (giữ nguyên cấu trúc card) -->
                    <div @click="goToDetail(item)" style="cursor: pointer;">
                      <div class="relative w-full overflow-hidden" style="height: 200px">
                        <div class="relative w-full h-full px-3 pt-3 rounded-3 overflow-hidden aspect-[4/3] w-full">
                          <img
                              :src="item.imageUrl || 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg'"
                              class="w-full rounded-3 h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <!-- Tag loại tài sản -->
                        <div class="absolute top-2 mt-3 ms-3 left-2 flex items-center gap-2">
                          <div
                              class="px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm text-white"
                              style="font-size: 10px !important;">
                            <i :class="getAssetTypeIcon(item)" style="font-size: 13px !important;"></i>
                            {{ getLoai(item) || '—' }}
                          </div>
                          <div
                              class="px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap backdrop-blur-sm bg-black/20 ring-1 ring-white/20 shadow-sm"
                              :class="item.moKhoa ? 'text-green-300' : 'text-yellow-300'"
                              style="font-size: 10px !important;">
                            <i :class="item.moKhoa ? 'fa-solid fa-lock-open' : 'fa-solid fa-lock'" style="font-size: 10px !important;"></i>
                            <span style="font-size: 10px !important;">{{ item.moKhoa ? 'Đã mở' : 'Chưa mở' }}</span>
                          </div>
                        </div>
                        <div v-if="'Đã bán' === item.status" class="absolute top-3 mr- ms-3 right-2 flex items-center gap-2" style="width: 60px; position: absolute; top: 7px; right: 3px">
                          <img src="/imgs/sold-out.png"/>
                        </div>
                        <div v-else-if="'Đã kiểm duyệt' === item.status" class="absolute top-3 mr-0 ms-3 right-2 flex items-center gap-2" style="width: 60px; position: absolute; top: 7px; right: 3px">
                          <img src="https://s3.cloudfly.vn/thg-storage-dev/uploads-public/icon-kiem-duỵet.png"/>
                        </div>
                      </div>

                      <div class="p-3 leading-tight text-slate-800">
                        <div class="font-semibold text-slate-900 mb-1"
                             style="
                              font-size: 15px;
                              font-weight: 700;
                              text-transform: uppercase;
                              white-space: nowrap;
                              overflow: hidden;
                              text-overflow: ellipsis;
                            ">
                          {{ formatWardCard(item.diaChi) }}, {{ formatProvinceCard(item.khuVuc) }}
                        </div>
                        <div class="font-semibold text-slate-500" style="font-size: 13px">
                          Ngày cập nhật: {{ formatDate(item.capNhatNgay) }}
                        </div>

                        <div class="flex items-center justify-between mt-1">
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

                          <div class="flex items-center gap-2 mt-2">
                            <div
                                class="px-2.5 py-0.5 rounded-full text-white shadow-sm"
                                :class="item.donVi === 'THG' ? 'bg-[#6A0DAD]' : 'bg-[#0057D9]'"
                                style="font-weight: 550; font-size: 12.5px !important;">
                              {{ item.donVi }}
                            </div>
                            <span
                                class="px-2 py-0.5 rounded-full bg-yellow-500 text-white font-semibold"
                                style="font-weight: 550; font-size: 12.5px !important;">
                              {{ item.loaiMH }}
                            </span>
                          </div>
                        </div>

                        <div class="flex items-center justify-between mt-2 text-[14px]">
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
                          <div class="flex items-center gap-3 text-slate-500 text-[12px] shrink-0">
                            <div class="flex items-center gap-1 font-medium ">
                              <span class="font-medium text-slate-700">
                                {{ item.soLuotXem ?? 0 }}
                              </span>đã xem
                            </div>
                            <div class="flex items-center gap-1 font-medium ">
                              <span class="font-medium text-slate-700">
                                {{ item.soLuotThich ?? 0 }}
                              </span>đã thích
                            </div>
                          </div>
                        </div>

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
                      </div>
                    </div>

                    <div class="flex items-center gap-2 px-3 pb-3">
                      <button
                          @click="$router.push(buildSeoUrl(item))"
                          class="flex-1 py-2.5 bg-gradient-to-r from-slate-900 to-black text-white rounded-full
                           text-[14px] font-semibold flex items-center justify-center gap-2
                           hover:opacity-90 transition-all"
                      >
                        <i class="fa-regular fa-eye text-sm"></i>
                        Xem chi tiết
                      </button>
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

                <!-- Load more indicator -->
                <div v-if="httLoading && httItems.length > 0" class="slider-item flex items-center justify-center">
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500 mx-auto"></div>
                    <p class="mt-2 text-sm text-slate-600">Đang tải thêm...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No data message -->
          <div v-if="!hasData && !loading" class="text-center py-12">
            <div class="text-slate-400 mb-4">
              <i class="fa-solid fa-inbox text-5xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-slate-700 mb-2">Không có sản phẩm nào</h3>
            <p class="text-slate-500">Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn.</p>
          </div>
        </div>
      </template>
    </div>
  </div>
  <div v-if="showCollabModal" class="collab-overlay">
    <div class="collab-modal">
      <!-- Header -->
      <div class="collab-header">
        <div class="collab-icon">🤝</div>
        <div class="collab-title-wrap">
          <h3 class="collab-title">Gửi lời đề nghị hợp tác</h3>
          <p class="collab-subtitle">
            Sản phẩm:
            <span>
            {{ formatWardCard(selectedAsset?.diaChi) }},
            {{ formatProvinceCard(selectedAsset?.khuVuc) }}
          </span>
          </p>
        </div>
      </div>

      <!-- Content -->
      <div class="collab-body">
        <p class="text-primary fs-6 fw-bold">Chúng tôi sẽ công khai cho bạn tất cả thông tin và cam kết trã phí môi giới đầy đủ như đã công bố!</p>
        <label class="collab-label">Lý do bạn muốn hợp tác</label>

        <textarea
            v-model="collabReason"
            rows="3"
            placeholder="Ví dụ: Tôi có khách đang tìm mua khu vực này, đã từng chốt nhiều giao dịch tương tự..."
            class="collab-textarea"
        ></textarea>

        <!-- Gợi ý -->
        <div class="collab-hints">
          <button
              v-for="hint in collabHints"
              :key="hint"
              @click="collabReason = hint"
              class="collab-hint-btn"
          >
            {{ hint }}
          </button>
        </div>

        <!-- Cam kết -->
        <label class="collab-policy">
          <input type="checkbox" v-model="agreePolicy" />
          Tôi cam kết tuân thủ giá và quy định của sản phẩm
        </label>
      </div>

      <!-- Footer -->
      <div class="collab-footer">
        <button class="btn-cancel" @click="closeCollabModal">
          Hủy
        </button>
        <button
            class="btn-submit"
            :disabled="!collabReason || !agreePolicy"
            @click="submitCollaboration"
        >
          Gửi đề nghị
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const agreePolicy = ref(false);
const collabHints = [
  "Tôi có khách đang tìm mua khu vực này",
  "Am hiểu giá thị trường và khu vực",
  "Đã từng bán nhiều sản phẩm tương tự",
  "Có nguồn khách sẵn, có thể chốt nhanh"
];
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import addressData from "/src/assets/js/address.json";
import NotificationBell from "/src/components/NotificationBell.vue";

import { useAuthStore } from "/src/stores/authStore.js";
const authStore = useAuthStore();
const info = authStore.userInfo;

const goToDetail = (item) => {
  router.push(buildSeoUrl(item));
}

// Data
const landAssets = ref([]);
const totalRecords = ref(0);

// Slider data
const bn30nItems = ref([]);
const hoptacItems = ref([]);
const httItems = ref([]);

// Pagination for sliders
const bn30nPage = ref(0);
const hoptacPage = ref(0);
const httPage = ref(0);
const pageSizeSlider = ref(5); // Số lượng items mỗi lần load - ĐÃ THAY ĐỔI THÀNH 4
const loading = ref(false);
const bn30nLoading = ref(false);
const hoptacLoading = ref(false);
const httLoading = ref(false);

// Slider refs
const bn30nSlider = ref(null);
const hoptacSlider = ref(null);
const httSlider = ref(null);

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
const filterStatus = ref("Chưa bán");
const filterLove = ref(null);
const isFilterMobile = ref(false);   // chỉ dùng cho FILTER
const showFilterPanel = ref(true);   // trạng thái mở/đóng filter

// Pagination
const page = ref(0);
const pageSize = ref(8);
const viewMode = ref('card');
const isMobile = ref(false);
const updateViewportMode = () => {
  isMobile.value = typeof window !== 'undefined' && window.innerWidth < 1050;
  if (isMobile.value) {
    viewMode.value = 'card';
  }
  const w = window.innerWidth;
  if (w < 736) {
    isFilterMobile.value = true;
    showFilterPanel.value = false; // 👈 mobile: mặc định THU GỌN
  } else {
    isFilterMobile.value = false;
    showFilterPanel.value = true;  // 👈 desktop: luôn MỞ
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

// Check if should show category
const shouldShowCategory = (category) => {
  if (!filterLoaiMH.value) return true; // Hiển thị tất cả nếu không lọc
  return filterLoaiMH.value === category;
};

// Check if has data
const hasData = computed(() => {
  return bn30nItems.value.length > 0 || hoptacItems.value.length > 0 || httItems.value.length > 0;
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

const catChuoi = (text, max = 11) => {
  if (!text) return '-'
  return text.length > max
      ? text.slice(0, max) + '...'
      : text
}

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
    () => {
      if (viewMode.value === 'table') {
        debouncedFilter();
      } else {
        // Reset slider data when filters change
        bn30nPage.value = 0;
        hoptacPage.value = 0;
        httPage.value = 0;
        bn30nItems.value = [];
        hoptacItems.value = [];
        httItems.value = [];
        fetchSliderData();
      }
    },
    { deep: true, immediate: true }
);

// FETCH FILTERED (for table view)
async function fetchFilteredAssets() {
  if (viewMode.value !== 'table') return;

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

// Helper function để xử lý items
function processItems(items) {
  return Array.isArray(items)
      ? items.map(item => ({
        ...item,
        imageUrl: item.imageUrl
            ? item.imageUrl
            : "https://s3.cloudfly.vn/thg-storage-dev/uploads-public/default.jpg"
      }))
      : [];
}

// FETCH SLIDER DATA - FIXED VERSION
async function fetchSliderData() {
  loading.value = true;

  try {
    const basePayload = {
      trangSo: 0,
      soDong: pageSizeSlider.value,
      tuKhoa: searchQuery.value || null,
      mucGia: filterGiaRange.value || null,
      phuongXa: filterWard.value || null,
      khuVuc: filterProvince.value || null,
      viTri: filterViTri.value || null,
      moKhoa: filterUnlock.value === "" ? null : filterUnlock.value === "yes",
      trangThai: filterStatus.value || null,
      daThich: filterLove.value || null,
    };

    if (!filterLoaiMH.value) {
      const [bn30nRes, hoptacRes, httRes] = await Promise.all([
        api.post("/user.thg/product/user/bang-du-lieu", {
          ...basePayload,
          loaiMH: "BN30N",
        }),
        api.post("/user.thg/product/user/bang-du-lieu", {
          ...basePayload,
          loaiMH: "HOPTAC",
        }),
        api.post("/user.thg/product/user/bang-du-lieu", {
          ...basePayload,
          loaiMH: "HTT",
        }),
      ]);

      bn30nItems.value = processItems(bn30nRes.data.content || []);
      hoptacItems.value = processItems(hoptacRes.data.content || []);
      httItems.value = processItems(httRes.data.content || []);

      // ✅ LẤY ĐÚNG TỔNG
      bn30nTotal.value = bn30nRes.data.page?.totalElements || 0;
      hoptacTotal.value = hoptacRes.data.page?.totalElements || 0;
      httTotal.value = httRes.data.page?.totalElements || 0;
    } else {
      const res = await api.post("/user.thg/product/user/bang-du-lieu", {
        ...basePayload,
        loaiMH: filterLoaiMH.value,
      });

      const items = processItems(res.data.content || []);
      const total = res.data.page?.totalElements || 0;

      bn30nItems.value = filterLoaiMH.value === "BN30N" ? items : [];
      hoptacItems.value = filterLoaiMH.value === "HOPTAC" ? items : [];
      httItems.value = filterLoaiMH.value === "HTT" ? items : [];

      bn30nTotal.value = filterLoaiMH.value === "BN30N" ? total : 0;
      hoptacTotal.value = filterLoaiMH.value === "HOPTAC" ? total : 0;
      httTotal.value = filterLoaiMH.value === "HTT" ? total : 0;
    }

    bn30nPage.value = 0;
    hoptacPage.value = 0;
    httPage.value = 0;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

const bn30nTotal = ref(0);
const hoptacTotal = ref(0);
const httTotal = ref(0);

// Load more for specific category
async function loadMoreCategory(category) {
  const config = {
    BN30N: {
      page: bn30nPage,
      items: bn30nItems,
      total: bn30nTotal,
      loading: bn30nLoading,
    },
    HOPTAC: {
      page: hoptacPage,
      items: hoptacItems,
      total: hoptacTotal,
      loading: hoptacLoading,
    },
    HTT: {
      page: httPage,
      items: httItems,
      total: httTotal,
      loading: httLoading,
    },
  };

  const c = config[category];
  if (!c) return;

  // ❌ ĐÃ LOAD HẾT → KHÔNG GỌI API NỮA
  if (c.items.value.length >= c.total.value) return;

  c.loading.value = true;
  c.page.value++;

  try {
    const res = await api.post("/user.thg/product/user/bang-du-lieu", {
      trangSo: c.page.value,
      soDong: pageSizeSlider.value,
      loaiMH: category,
      tuKhoa: searchQuery.value || null,
      mucGia: filterGiaRange.value || null,
      phuongXa: filterWard.value || null,
      khuVuc: filterProvince.value || null,
      viTri: filterViTri.value || null,
      moKhoa: filterUnlock.value === "" ? null : filterUnlock.value === "yes",
      trangThai: filterStatus.value || null,
      daThich: filterLove.value || null,
    });

    c.items.value.push(...processItems(res.data.content || []));
  } catch (e) {
    c.page.value--;
    console.error(e);
  } finally {
    c.loading.value = false;
  }
}


// Slider scrolling
// Slider scrolling - SIMPLE VERSION
// Slider scrolling - DEBUG VERSION
const scrollSlider = (category, direction) => {
  const sliderRef =
      category === 'bn30n' ? bn30nSlider :
          category === 'hoptac' ? hoptacSlider : httSlider;

  if (!sliderRef.value) {
    console.log(`Slider ${category} not found`);
    return;
  }

  const firstItem = sliderRef.value.querySelector('.slider-item');
  if (!firstItem) {
    console.log(`No .slider-item found in ${category}`);
    return;
  }

  // DEBUG: Log thông tin
  console.log(`Slider ${category}:`, {
    itemWidth: firstItem.offsetWidth,
    gap: parseInt(getComputedStyle(sliderRef.value).gap),
    scrollLeftBefore: sliderRef.value.scrollLeft
  });

  const style = getComputedStyle(sliderRef.value);
  const gap = parseInt(style.gap) || 16;
  const itemWidth = firstItem.offsetWidth;
  const scrollAmount = itemWidth + gap;

  sliderRef.value.scrollLeft += direction * scrollAmount;

  console.log(`Scrolled ${direction > 0 ? 'right' : 'left'} by ${scrollAmount}px`);
};

// Handle scroll to load more - SIMPLE VERSION
const handleScroll = (category) => {
  const sliderRef =
      category === 'bn30n' ? bn30nSlider :
          category === 'hoptac' ? hoptacSlider : httSlider;

  const loadingRef =
      category === 'bn30n' ? bn30nLoading :
          category === 'hoptac' ? hoptacLoading : httLoading;

  const categoryCode =
      category === 'bn30n' ? 'BN30N' :
          category === 'hoptac' ? 'HOPTAC' : 'HTT';

  if (!sliderRef.value || loadingRef.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = sliderRef.value;

  // Khi còn 200px đến cuối thì load more
  if (scrollWidth - scrollLeft - clientWidth < 200) {
    loadMoreCategory(categoryCode);
  }
};


const auth = useAuthStore();
import { useRouter } from "vue-router";
import {buildSeoUrl} from "../../assets/js/global.js";
const router = useRouter();
async function toggleLove(item) {
  // ❌ Chưa đăng nhập → đá ra trang đăng nhập
  localStorage.setItem("redirectAfterLogin", buildSeoUrl(item));
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
        "/thg.user/my-land/love/toggle",
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

  if (viewMode.value === 'table') {
    fetchFilteredAssets();
  } else {
    // Đảm bảo loading được hiển thị trước khi fetch data
    loading.value = true;
    nextTick(() => {
      fetchSliderData();
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportMode);
});


// 'table' hoặc 'card'
const showCollabModal = ref(false);
const selectedAsset = ref({ daGuiYeuCau: false });
const collabReason = ref("");
async function submitCollaboration() {
  // ❌ chưa đăng nhập
  if (!auth.accessToken) {
    localStorage.setItem("redirectAfterLogin", "/san-pham-thien-ha");
    router.push({
      path: "/dang-nhap"
    });
    return;
  }

  if (!selectedAsset.value?.id) {
    showCenterError("Không xác định được sản phẩm");
    return;
  }

  try {
    const payload = {
      sanPhamId: selectedAsset.value.id,
      noiDungHopTac: collabReason.value
    };

    const res = await api.post(
        "/admin/api/de-nghi-hop-tac/gui-loi-moi",
        payload
    );
    closeCollabModal();
    // ✅ API luôn trả 200 → check success
    if (!res.data.success) {
      showCenterWarning(res.data.message || "Không thể gửi đề nghị hợp tác");
      return;
    }

    // ✅ Thành công
    showCenterSuccess(res.data.message || "Gửi đề nghị hợp tác thành công");



  } catch (e) {
    console.error(e);
    showCenterError("Có lỗi xảy ra khi gửi đề nghị hợp tác");
  }
}
const canRequestCollaboration = (item) => {
  if (!auth.accessToken) return false;
  if (item.status === 'Đã bán') return false;
  if (item.isOwner) return false;        // backend trả về
  if (item.daGuiYeuCau) return false;    // backend trả về
  return true;
};

const openCollabModal = (item) => {
  selectedAsset.value = item;
  collabReason.value = "";
  showCollabModal.value = true;
};

const closeCollabModal = () => {
  showCollabModal.value = false;
};

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

/* Hide scrollbar for slider */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* Slider container */
.slider-container {
  scroll-behavior: smooth;
}

/* Slider item - CỐ ĐỊNH WIDTH */
.slider-item {
  flex: 0 0 auto;
  width: 350px; /* ĐÃ TĂNG WIDTH LÊN */
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
.action-heart {
  background: rgba(133,132,132,0.13);
  padding: 0 10px;
  margin-right: 5px;
  border-radius: 8px;
}

.action-view {
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px;
  background: #BFDBFE;
  color: #1D4ED8;
  border: 1px solid #93C5FD;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ===== DOT BUTTON ===== */
.dot-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(133,132,132,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-menu {
  position: absolute;
  right: 0;
  top: 36px;
  min-width: 140px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 20px rgba(0,0,0,.12);
  padding: 6px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-5px);
  transition: .2s;
  z-index: 50;
}

.dot-item {
  width: 100%;
  padding: 6px 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
}

.dot-item:hover {
  background: #f1f5f9;
}

/* Hover mở menu */
.action-dot:hover .dot-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* ===== RESPONSIVE RULE ===== */
@media (max-width: 1299px) {
  .action-full {
    display: none;
  }
}

@media (min-width: 1300px) {
  .action-dot {
    display: none;
  }
}

/* Responsive cho slider */
@media (max-width: 768px) {
  .slider-item {
    width: 350px; /* Nhỏ hơn trên mobile */
  }
}

@media (max-width: 480px) {
  .slider-item {
    width: 350px; /* Nhỏ hơn trên mobile nhỏ */
  }
}


/* ===== MODAL ===== */
.collab-modal {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.28);
}

/* ===== HEADER ===== */
.collab-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.collab-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5edff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.collab-title {
  font-size: 1.05rem;        /* >= 1rem */
  font-weight: 700;          /* giảm đậm */
  color: #111827;
}

.collab-subtitle {
  font-size: 0.9rem;
  font-weight: 500;
  color: #4b5563;
}

/* ===== BODY ===== */
.collab-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.collab-label {
  font-size: 1rem;           /* >= 1rem */
  font-weight: 600;
  color: #111827;
}

.collab-textarea {
  width: 100%;
  min-height: 96px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.2px solid #d1d5db;
  font-size: 1rem;           /* >= 1rem */
  font-weight: 400;
  color: #111827;
  resize: none;
}

.collab-textarea::placeholder {
  color: #6b7280;
  font-weight: 400;
}

.collab-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* ===== HINT BUTTONS ===== */
.collab-hints {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.collab-hint-btn {
  padding: 5px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 999px;
  background: #e5e7eb;
  color: #111827;
  border: none;
  cursor: pointer;
}

.collab-hint-btn:hover {
  background: #d1d5db;
}

/* ===== POLICY ===== */
.collab-policy {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1f2937;
}

/* ===== FOOTER ===== */
.collab-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.btn-cancel {
  padding: 7px 14px;
  border-radius: 8px;
  background: #e5e7eb;
  color: #111827;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.btn-submit {
  padding: 7px 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #2563eb, #4338ca);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 480px) {
  .collab-modal {
    max-width: 100%;
    padding: 16px;
    border-radius: 12px;
  }

  .collab-title {
    font-size: 1rem;
  }

  .collab-textarea {
    min-height: 88px;
  }

  .collab-footer {
    gap: 8px;
  }
}
/* Nút hợp tác (table) */
.action-collab {
  padding: 2px 12px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 8px;
  background: #f8d7ac;      /* nền cam nhạt */
  color: #f57430;           /* chữ cam đậm */
  border: 1px solid #f8b66c;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 6px;
  margin-right: 10px;
}

.action-collab:hover {
  background: #fed7aa;
  border-color: #fdba74;
}
.collab-overlay {
  position: fixed;
  inset: 0;
  z-index: 99998;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
}
</style>
