<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-3 py-3" style="padding-top: 90px!important;">
    <div class="max-w-[1600px] mx-auto">
      <!-- Header với tab -->
      <div class="bg-white rounded-2xl shadow-xl border border-slate-300 mb-6 p-4 relative overflow-hidden"
           style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          ">
        <div class="relative z-10">
          <h1 class="text-2xl font-bold text-white mb-4 drop-shadow-lg">
            🏠 Kho Bất Động Sản Thiên Hà Group
          </h1>

          <!-- Thanh tìm kiếm -->
          <div class="mb-4">
            <div class="relative max-w-2xl">
              <i class="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base"></i>
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Tìm kiếm theo tên chủ nhà, số điện thoại, địa chỉ..."
                  class="w-full pl-12 pr-4 py-3 border-2 border-white/30 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm shadow-lg transition-all text-sm"
              />
              <button
                  @click="handleRefresh"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
              >
                <i class="fa-solid fa-rotate text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Tab chính -->
          <div class="flex flex-wrap gap-2 mb-4">
            <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                'px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2',
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              ]"
            >
              <i :class="tab.icon"></i>
              <span>{{ tab.label }}</span>
              <span v-if="tab.count !== undefined" class="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
                {{ tab.count }}
              </span>
            </button>
          </div>

          <!-- Bộ lọc tùy chọn -->
          <div class="flex flex-wrap gap-3">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs font-semibold text-white/90 mb-1">Mức giá</label>
              <select v-model="filterGiaRange"
                      class="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent bg-white/90 backdrop-blur-sm">
                <option value="">Tất cả mức giá</option>
                <option value="<1">Dưới 1 tỷ</option>
                <option value="1-3">1 - 3 tỷ</option>
                <option value="3-5">3 - 5 tỷ</option>
                <option value="5-10">5 - 10 tỷ</option>
                <option value=">10">Trên 10 tỷ</option>
              </select>
            </div>

            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs font-semibold text-white/90 mb-1">Khu vực</label>
              <select v-model="filterProvince"
                      class="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent bg-white/90 backdrop-blur-sm">
                <option value="">Tất cả tỉnh thành</option>
                <option v-for="p in provinces" :key="p" :value="p">
                  {{ formatProvinceShort(p) }}
                </option>
              </select>
            </div>

            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs font-semibold text-white/90 mb-1">Trạng thái</label>
              <select v-model="filterStatus"
                      class="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent bg-white/90 backdrop-blur-sm">
                <option value="">Tất cả trạng thái</option>
                <option value="Đang bán">Đang bán</option>
                <option value="Đã bán">Đã bán</option>
                <option value="Đã kiểm duyệt">Đã kiểm duyệt</option>
              </select>
            </div>

            <div class="flex items-end">
              <button
                  @click="toggleAdvancedFilter"
                  class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <i class="fa-solid fa-filter"></i>
                <span class="text-sm">Lọc nâng cao</span>
              </button>
            </div>
          </div>

          <!-- Bộ lọc nâng cao -->
          <div v-if="showAdvancedFilter" class="mt-4 p-4 bg-white/20 rounded-xl backdrop-blur-sm">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-semibold text-white/90 mb-1">Phường/Xã</label>
                <select v-model="filterWard"
                        class="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent bg-white/90">
                  <option value="">Tất cả phường/xã</option>
                  <option v-for="w in wards" :key="w" :value="w">{{ w }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-white/90 mb-1">Loại mặt hàng</label>
                <select v-model="filterLoaiMH"
                        class="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent bg-white/90">
                  <option value="">Tất cả loại</option>
                  <option value="BN30N">Bán nhanh 30 ngày</option>
                  <option value="HOPTAC">Hàng hợp tác</option>
                  <option value="HTT">Hàng thị trường</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-white/90 mb-1">Vị trí</label>
                <input
                    list="landPositions"
                    v-model="filterViTri"
                    placeholder="Nhập vị trí..."
                    class="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent bg-white/90"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-white/90 mb-1">Đã thích</label>
                <select v-model="filterLove"
                        class="w-full px-3 py-2 text-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent bg-white/90">
                  <option :value="null">Tất cả</option>
                  <option :value="true">Đã thích</option>
                  <option :value="false">Chưa thích</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Thống kê nhanh -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Tổng sản phẩm</p>
              <p class="text-2xl font-bold">{{ totalRecords }}</p>
            </div>
            <i class="fa-solid fa-boxes-stacked text-2xl opacity-80"></i>
          </div>
        </div>

        <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Đã mở khóa</p>
              <p class="text-2xl font-bold">{{ unlockedCount }}</p>
            </div>
            <i class="fa-solid fa-lock-open text-2xl opacity-80"></i>
          </div>
        </div>

        <div class="bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl p-4 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Đang hợp tác</p>
              <p class="text-2xl font-bold">{{ collabCount }}</p>
            </div>
            <i class="fa-solid fa-handshake text-2xl opacity-80"></i>
          </div>
        </div>

        <div class="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-4 text-white shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">Đã yêu thích</p>
              <p class="text-2xl font-bold">{{ likedCount }}</p>
            </div>
            <i class="fa-solid fa-heart text-2xl opacity-80"></i>
          </div>
        </div>
      </div>

      <!-- Chế độ xem -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex gap-2">
          <button
              @click="viewMode = 'card'"
              :class="[
              'px-4 py-2 rounded-lg border transition-all flex items-center gap-2',
              viewMode === 'card'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            ]"
          >
            <i class="fa-solid fa-grip"></i>
            <span>Thẻ</span>
          </button>

          <button
              @click="viewMode = 'table'"
              :disabled="isMobile"
              :class="[
              'px-4 py-2 rounded-lg border transition-all flex items-center gap-2',
              viewMode === 'table'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50',
              isMobile ? 'opacity-60 cursor-not-allowed' : ''
            ]"
          >
            <i class="fa-solid fa-table"></i>
            <span>Bảng</span>
          </button>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-sm text-slate-600">
            Hiển thị {{ page * pageSize + 1 }} - {{ Math.min((page + 1) * pageSize, totalRecords) }} của {{ totalRecords }}
          </div>
          <select
              v-model.number="pageSize"
              @change="updatePageSize"
              class="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="8">8 / trang</option>
            <option value="12">12 / trang</option>
            <option value="16">16 / trang</option>
            <option value="20">20 / trang</option>
          </select>
        </div>
      </div>

      <!-- Chế độ xem thẻ -->
      <template v-if="viewMode === 'card'">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <div
              v-for="item in landAssets"
              :key="item.id"
              class="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <!-- Ảnh và badge -->
            <div class="relative overflow-hidden" style="height: 220px">
              <img
                  :src="item.imageUrl || 'https://hoangphucphoto.com/wp-content/uploads/2024/11/anh-bds-1.jpg'"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  @click="goToDetail(item)"
              />

              <!-- Badge góc trái -->
              <div class="absolute top-3 left-3 flex flex-col gap-2">
                <div v-if="item.moKhoa" class="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <i class="fa-solid fa-lock-open text-xs"></i>
                  <span>Đã mở</span>
                </div>
                <div v-if="item.daThich" class="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <i class="fa-solid fa-heart text-xs"></i>
                  <span>Đã thích</span>
                </div>
              </div>

              <!-- Badge góc phải -->
              <div class="absolute top-3 right-3 flex flex-col gap-2">
                <div :class="badgeClass(item.loaiMH)" class="px-3 py-1 text-xs font-bold rounded-full">
                  {{ item.loaiMH }}
                </div>
                <div :class="item.donVi === 'THG' ? 'bg-purple-600' : 'bg-blue-600'" class="px-3 py-1 text-white text-xs font-bold rounded-full">
                  {{ item.donVi }}
                </div>
              </div>

              <!-- Trạng thái -->
              <div v-if="item.status === 'Đã bán'" class="absolute bottom-3 right-3">
                <img src="/imgs/sold-out.png" class="h-8" />
              </div>
            </div>

            <!-- Thông tin -->
            <div class="p-4">
              <!-- Địa chỉ -->
              <h3 class="font-bold text-slate-800 text-base mb-2 line-clamp-2">
                {{ formatWardCard(item.diaChi) }}, {{ formatProvinceCard(item.khuVuc) }}
              </h3>

              <!-- Giá -->
              <div class="flex items-center justify-between mb-3">
                <div class="text-lg font-bold text-rose-600">
                  {{ formatMoneyVN(item.giaBan) }}
                </div>
                <div class="text-sm text-blue-600 font-semibold flex items-center gap-1">
                  <i class="fa-solid fa-coins"></i>
                  <span>MG: {{ item.phiMoiGioi || 0 }}%</span>
                </div>
              </div>

              <!-- Thông tin chi tiết -->
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="space-y-1">
                  <div class="text-xs text-slate-500">Chủ nhà</div>
                  <div class="text-sm font-semibold text-slate-800 truncate">{{ item.tenChuNha || '—' }}</div>
                </div>
                <div class="space-y-1">
                  <div class="text-xs text-slate-500">Diện tích</div>
                  <div class="text-sm font-semibold text-slate-800">{{ item.dtcn }}m²</div>
                </div>
                <div class="space-y-1">
                  <div class="text-xs text-slate-500">Liên hệ</div>
                  <div class="text-sm font-semibold text-blue-600">{{ item.soDienThoai || '—' }}</div>
                </div>
                <div class="space-y-1">
                  <div class="text-xs text-slate-500">Vị trí</div>
                  <div class="text-sm font-semibold text-slate-800 truncate">{{ item.viTri || '—' }}</div>
                </div>
              </div>

              <!-- Nút hành động -->
              <div class="flex gap-2">
                <button
                    @click="$router.push(buildSeoUrl(item))"
                    class="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <i class="fa-regular fa-eye"></i>
                  <span>Xem</span>
                </button>

                <button
                    v-if="canRequestCollaboration(item)"
                    @click="openCollabModal(item)"
                    class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <i class="fa-solid fa-handshake"></i>
                </button>

                <button
                    @click="toggleLove(item)"
                    class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  <i :class="item.daThich ? 'fa-solid fa-heart text-rose-500' : 'fa-regular fa-heart'"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Chế độ xem bảng -->
      <template v-else>
        <div class="bg-white rounded-2xl shadow-lg border border-slate-300 overflow-hidden mb-8">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th class="p-3 text-left">STT</th>
                <th class="p-3 text-left">Chủ Nhà</th>
                <th class="p-3 text-left">Liên hệ</th>
                <th class="p-3 text-left">Giá Bán</th>
                <th class="p-3 text-left">Địa Chỉ</th>
                <th class="p-3 text-left">DT</th>
                <th class="p-3 text-left">Loại</th>
                <th class="p-3 text-left">Trạng thái</th>
                <th class="p-3 text-left">Thao tác</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, idx) in landAssets" :key="item.id"
                  :class="['border-b border-slate-200', idx % 2 === 0 ? 'bg-slate-50' : 'bg-white']">
                <td class="p-3">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-slate-700">{{ idx + 1 }}</span>
                    <i v-if="item.daThich" class="fa-solid fa-heart text-rose-500 text-sm"></i>
                  </div>
                </td>
                <td class="p-3 font-medium text-slate-800">{{ item.tenChuNha || '—' }}</td>
                <td class="p-3 text-blue-600 font-medium">{{ item.soDienThoai || '—' }}</td>
                <td class="p-3">
                  <div class="font-bold text-rose-600">{{ formatMoneyVN(item.giaBan) }}</div>
                  <div class="text-xs text-slate-500">MG: {{ item.phiMoiGioi || 0 }}%</div>
                </td>
                <td class="p-3 text-slate-700">
                  <div class="font-medium">{{ formatWardCard(item.diaChi) }}</div>
                  <div class="text-sm text-slate-500">{{ formatProvinceCard(item.khuVuc) }}</div>
                </td>
                <td class="p-3 font-semibold text-slate-800">{{ item.dtcn }}m²</td>
                <td class="p-3">
                    <span :class="badgeClass(item.loaiMH)" class="px-2 py-1 text-xs font-bold rounded-full">
                      {{ item.loaiMH }}
                    </span>
                </td>
                <td class="p-3">
                  <div class="flex flex-col gap-1">
                    <div v-if="item.moKhoa" class="text-xs text-green-600 font-semibold flex items-center gap-1">
                      <i class="fa-solid fa-lock-open"></i>
                      <span>Đã mở</span>
                    </div>
                    <div v-if="item.status === 'Đã bán'" class="text-xs text-rose-600 font-semibold">
                      Đã bán
                    </div>
                    <div v-else class="text-xs text-blue-600 font-semibold">
                      Đang bán
                    </div>
                  </div>
                </td>
                <td class="p-3">
                  <div class="flex gap-2">
                    <button
                        @click="$router.push(buildSeoUrl(item))"
                        class="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold flex items-center gap-1"
                    >
                      <i class="fa-regular fa-eye"></i>
                      <span>Xem</span>
                    </button>
                    <button
                        v-if="canRequestCollaboration(item)"
                        @click="openCollabModal(item)"
                        class="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors text-sm font-semibold flex items-center gap-1"
                    >
                      <i class="fa-solid fa-handshake"></i>
                      <span>HT</span>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- Phân trang -->
      <div class="bg-white rounded-2xl shadow-lg border border-slate-300 p-4">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-sm text-slate-600">
            Hiển thị {{ page * pageSize + 1 }} - {{ Math.min((page + 1) * pageSize, totalRecords) }} của {{ totalRecords }} bất động sản
          </div>

          <div class="flex items-center gap-2">
            <button
                @click="goToPage(page - 1)"
                :disabled="page === 0"
                class="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <i class="fa-solid fa-chevron-left"></i>
              <span>Trước</span>
            </button>

            <div class="flex gap-1">
              <button
                  v-for="p in paginationButtons"
                  :key="p"
                  @click="goToPage(p - 1)"
                  :class="[
                  'w-10 h-10 flex items-center justify-center rounded-lg font-semibold',
                  p === page + 1
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 hover:bg-slate-50'
                ]"
              >
                {{ p }}
              </button>
            </div>

            <button
                @click="goToPage(page + 1)"
                :disabled="page >= totalPages - 1"
                class="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <span>Sau</span>
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal hợp tác -->
    <div v-if="showCollabModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <i class="fa-solid fa-handshake text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-lg text-slate-800">Gửi đề nghị hợp tác</h3>
            <p class="text-sm text-slate-600">
              {{ formatWardCard(selectedAsset?.diaChi) }}, {{ formatProvinceCard(selectedAsset?.khuVuc) }}
            </p>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-semibold text-slate-700 mb-2">Lý do hợp tác</label>
          <textarea
              v-model="collabReason"
              rows="3"
              placeholder="Ví dụ: Tôi có khách hàng tiềm năng cho sản phẩm này..."
              class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <div class="flex gap-2 mb-4">
          <button
              v-for="hint in collabHints"
              :key="hint"
              @click="collabReason = hint"
              class="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
          >
            {{ hint }}
          </button>
        </div>

        <div class="flex items-center gap-2 mb-6">
          <input type="checkbox" v-model="agreePolicy" id="policy" class="rounded" />
          <label for="policy" class="text-sm text-slate-700">
            Tôi cam kết tuân thủ quy định và giá cả sản phẩm
          </label>
        </div>

        <div class="flex gap-3">
          <button
              @click="closeCollabModal"
              class="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
          >
            Hủy
          </button>
          <button
              @click="submitCollaboration"
              :disabled="!collabReason || !agreePolicy"
              :class="[
              'flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold transition-all',
              !collabReason || !agreePolicy ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            ]"
          >
            Gửi đề nghị
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "/src/stores/authStore.js";
import api from "/src/api/api.js";
import addressData from "/src/assets/js/address.json";
import { buildSeoUrl } from "../../assets/js/global.js";
import { showCenterSuccess, showCenterError, showCenterWarning } from "../../assets/js/alertService.js";

const router = useRouter();
const authStore = useAuthStore();

// Tab configuration
const tabs = [
  { id: 'all', label: 'Tất cả', icon: 'fa-solid fa-layer-group', count: computed(() => totalRecords.value) },
  { id: 'yours', label: 'Của bạn', icon: 'fa-solid fa-user', count: computed(() => yourAssetsCount.value) },
  { id: 'unlocked', label: 'Đã mở khóa', icon: 'fa-solid fa-lock-open', count: computed(() => unlockedCount.value) },
  { id: 'collab', label: 'Hợp tác', icon: 'fa-solid fa-handshake', count: computed(() => collabCount.value) },
];

const activeTab = ref('all');

// Data
const landAssets = ref([]);
const totalRecords = ref(0);

// Filters
const searchQuery = ref("");
const filterGiaRange = ref("");
const filterProvince = ref("");
const filterWard = ref("");
const filterLoaiMH = ref("");
const filterViTri = ref("");
const filterLove = ref(null);
const filterStatus = ref("");
const showAdvancedFilter = ref(false);

// Pagination
const page = ref(0);
const pageSize = ref(12);
const viewMode = ref('card');
const isMobile = ref(false);

// Modal
const showCollabModal = ref(false);
const selectedAsset = ref(null);
const collabReason = ref("");
const agreePolicy = ref(false);
const collabHints = [
  "Có khách hàng tiềm năng",
  "Am hiểu khu vực",
  "Từng giao dịch tương tự",
  "Có thể chốt nhanh"
];

// Computed
const provinces = computed(() => addressData.map(x => x.name));
const wards = computed(() => {
  if (!filterProvince.value) return [];
  const province = addressData.find(p => p.name === filterProvince.value);
  return province?.wards?.map(w => w.name) || [];
});

const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value || 1));
const paginationButtons = computed(() => {
  const buttons = [];
  const total = totalPages.value;
  const current = page.value + 1;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) buttons.push(i);
  } else {
    if (current <= 3) {
      buttons.push(1, 2, 3, '...', total);
    } else if (current >= total - 2) {
      buttons.push(1, '...', total - 2, total - 1, total);
    } else {
      buttons.push(1, '...', current - 1, current, current + 1, '...', total);
    }
  }
  return buttons;
});

// Statistics
const unlockedCount = computed(() => landAssets.value.filter(item => item.moKhoa).length);
const likedCount = computed(() => landAssets.value.filter(item => item.daThich).length);
const yourAssetsCount = computed(() => landAssets.value.filter(item => item.donVi === 'THG').length);
const collabCount = computed(() => landAssets.value.filter(item => item.loaiMH === 'HOPTAC').length);

// Functions
const formatProvinceShort = (province) => {
  if (!province) return "";
  return province
      .replace(/^Thành phố\s+/i, "TP.")
      .replace(/^Tỉnh\s+/i, "T.");
};

const formatWardCard = (address) => {
  if (!address) return "";
  const parts = address.split("/!!");
  return parts[1]?.trim() || parts[0]?.trim() || "";
};

const formatProvinceCard = (province) => {
  if (!province) return "";
  return province.replace(/^Thành phố\s+|^Tỉnh\s+/i, "");
};

const formatMoneyVN = (value) => {
  if (value == null || isNaN(value)) return "0";
  const num = Number(value);
  if (num < 1_000_000_000) {
    return `${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)} triệu`;
  }
  return `${(num / 1_000_000_000).toFixed(num % 1_000_000_000 === 0 ? 0 : 2)} tỷ`;
};

const badgeClass = (code) => {
  const map = {
    BN30N: "bg-green-100 text-green-800",
    HTT: "bg-yellow-100 text-yellow-800",
    HOPTAC: "bg-orange-100 text-orange-800",
  };
  return map[code] || "bg-slate-100 text-slate-800";
};

const goToDetail = (item) => {
  router.push(buildSeoUrl(item));
};

const toggleAdvancedFilter = () => {
  showAdvancedFilter.value = !showAdvancedFilter.value;
};

const handleRefresh = () => {
  searchQuery.value = "";
  filterGiaRange.value = "";
  filterProvince.value = "";
  filterWard.value = "";
  filterLoaiMH.value = "";
  filterViTri.value = "";
  filterLove.value = null;
  filterStatus.value = "";
  page.value = 0;
  fetchFilteredAssets();
};

const goToPage = (p) => {
  if (p < 0) p = 0;
  if (p >= totalPages.value) p = totalPages.value - 1;
  page.value = p;
};

const updatePageSize = () => {
  if (pageSize.value < 1) pageSize.value = 1;
  page.value = 0;
  fetchFilteredAssets();
};

// API Functions
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
    trangThai: filterStatus.value || null,
    daThich: filterLove.value || null,
  };

  try {
    const res = await api.post("/user.thg/product/user/bang-du-lieu", payload);

    landAssets.value = Array.isArray(res.data.content)
        ? res.data.content.map(item => ({
          ...item,
          imageUrl: item.imageUrl || "https://s3.cloudfly.vn/thg-storage/uploads-public/default.jpg"
        }))
        : [];

    totalRecords.value = res.data.page?.totalElements || 0;
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
  }
}

const toggleLove = async (item) => {
  if (!authStore.accessToken) {
    localStorage.setItem("redirectAfterLogin", "/san-pham-thien-ha");
    router.push("/dang-nhap");
    return;
  }

  item.daThich = !item.daThich;
  item.soLuotThich = item.daThich
      ? (item.soLuotThich || 0) + 1
      : Math.max(0, (item.soLuotThich || 1) - 1);

  try {
    await api.post("/user.thg/product/user/love/toggle", null, {
      params: { idAsset: item.id }
    });
  } catch (e) {
    item.daThich = !item.daThich;
    item.soLuotThich = item.daThich
        ? (item.soLuotThich || 0) + 1
        : Math.max(0, (item.soLuotThich || 1) - 1);
  }
};

const canRequestCollaboration = (item) => {
  if (!authStore.accessToken) return false;
  if (item.status === 'Đã bán') return false;
  if (item.isOwner) return false;
  if (item.daGuiYeuCau) return false;
  return true;
};

const openCollabModal = (item) => {
  if (!authStore.accessToken) {
    localStorage.setItem("redirectAfterLogin", "/san-pham-thien-ha");
    router.push("/dang-nhap");
    return;
  }

  selectedAsset.value = item;
  collabReason.value = "";
  agreePolicy.value = false;
  showCollabModal.value = true;
};

const closeCollabModal = () => {
  showCollabModal.value = false;
  selectedAsset.value = null;
};

const submitCollaboration = async () => {
  if (!selectedAsset.value?.id) {
    showCenterError("Không xác định được sản phẩm");
    return;
  }

  try {
    const payload = {
      sanPhamId: selectedAsset.value.id,
      noiDungHopTac: collabReason.value
    };

    const res = await api.post("/admin/api/de-nghi-hop-tac/gui-loi-moi", payload);
    closeCollabModal();
    if (!res.data.success) {
      showCenterWarning(res.data.message || "Không thể gửi đề nghị hợp tác");
      return;
    }

    showCenterSuccess(res.data.message || "Gửi đề nghị hợp tác thành công");


  } catch (e) {
    console.error(e);
    showCenterError("Có lỗi xảy ra khi gửi đề nghị hợp tác");
  }
};

// Watchers
const debounce = (fn, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const debouncedFilter = debounce(fetchFilteredAssets, 300);

watch([
  activeTab,
  searchQuery,
  filterGiaRange,
  filterProvince,
  filterWard,
  filterLoaiMH,
  filterViTri,
  filterLove,
  filterStatus,
  page,
  pageSize,
], debouncedFilter, { immediate: true });

const updateViewportMode = () => {
  const w = window.innerWidth;
  isMobile.value = w < 768;
  if (isMobile.value) {
    viewMode.value = 'card';
    pageSize.value = 8;
  }
};

// Lifecycle
onMounted(() => {
  updateViewportMode();
  window.addEventListener('resize', updateViewportMode);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewportMode);
});
</script>

<style scoped>
/* Custom styles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.table-enter-active,
.table-leave-active {
  transition: opacity 0.3s ease;
}

.table-enter-from,
.table-leave-to {
  opacity: 0;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Card hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Shimmer loading effect */
.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Badge animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>