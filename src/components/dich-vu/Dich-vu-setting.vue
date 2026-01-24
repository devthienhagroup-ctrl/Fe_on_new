<template>

  <div class="svc3-topbar">
    <div class="svc3-brand">
      <div class="svc3-brand-ico"><i class="fa-solid fa-layer-group"></i></div>
      <div class="min-w-0">
        <div class="svc3-title">Quản trị Dịch vụ</div>
      </div>
    </div>

    <div class="svc3-top-actions">

<!--      <button class="svc3-btn primary" @click="openCreateService()">-->
<!--        <i class="fa-solid fa-plus"></i>-->
<!--        <span>Thêm dịch vụ</span>-->
<!--      </button>-->
      <div class="d-flex flex-column align-items-end text-end">
        <div class="fw-semibold text-dark">
          {{ info.fullName }}
        </div>
      </div>

      <img
          v-if="info.avatarUrl"
          :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + info.avatarUrl"
          alt="avatar"
          class="rounded-circle border"
          style="width: 36px; height: 36px; object-fit: cover;"
      />

      <div v-else class="avatar-circle">
        {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
      </div>
    </div>
  </div>
  <div class="svc3-page">
    <div class="px-3 py-1">
      <!-- Top bar -->

      <!-- Tabs (ONLY 2) - browser style -->
      <div class="svc3-tabs-shell mt-2">
        <div class="svc3-tabs">
          <button class="svc3-tab" :class="{active: activeTab==='services'}" @click="activeTab='services'">
            <i class="fa-solid fa-list-check"></i>
            <span>Dịch vụ</span>
            <span class="svc3-pill">{{ services.length }}</span>
          </button>

          <button class="svc3-tab" :class="{active: activeTab==='segments'}" @click="activeTab='segments'">
            <i class="fa-solid fa-tags"></i>
            <span>Phân khúc</span>
            <span class="svc3-pill">{{ totalSegments }}</span>
          </button>

          <div class="svc3-tabs-fill"></div>
        </div>

        <!-- SERVICES TAB -->
        <section v-if="activeTab==='services'" class="svc3-panel attached">
          <div class="svc3-panel-h">
            <div class="svc3-panel-title">
              <DotLottieVue
                  src="https://lottie.host/5a73bb5b-1f82-4db1-b81b-32cc35cecd45/Hxy0beY7On.lottie"
                  autoplay
                  loop
                  style="
                            width: 40px;
                            height: 46px;
                            display: inline-block;
                            vertical-align: bottom;
                          "
              />
              <span class="fs-5">Danh sách dịch vụ</span>
            </div>

            <div class="svc3-tools">
              <div class="svc3-input">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input v-model.trim="serviceQuery" type="text" placeholder="Tìm theo tên hoặc mô tả..." />
              </div>

              <button class="svc3-btn ghost" @click="openCreateService()">
                <i class="fa-solid fa-circle-plus"></i>
                <span>New</span>
              </button>
            </div>
          </div>

          <div class="svc3-panel-b">
            <div v-if="filteredServices.length===0" class="svc3-empty">
              <div class="svc3-empty-ico"><i class="fa-solid fa-box-open"></i></div>
              <div class="svc3-empty-title">Chưa có dữ liệu phù hợp</div>
              <div class="svc3-empty-sub">Thử từ khóa khác hoặc thêm dịch vụ mới.</div>
              <button class="svc3-btn primary" @click="openCreateService()">
                <i class="fa-solid fa-plus"></i><span>Tạo dịch vụ</span>
              </button>
            </div>

            <div v-else class="svc3-table-wrap">
              <table class="svc3-table">
                <thead>
                <tr>
                  <th style="min-width:300px">Dịch vụ</th>
                  <th style="width:180px">Màu</th>
                  <th>Mô tả</th>
                  <th style="width:160px" class="text-left">Giá từ</th>
                  <th style="width:160px" class="text-left">Giá đến</th>
                  <th style="width:110px" class="text-center">SL Phân khúc</th>
                  <th style="width:170px" class="text-center">Thao tác</th>
                </tr>
                </thead>

                <tbody>
                <tr v-for="s in filteredServices" :key="s.id">
                  <td>
                    <div class="svc3-svc">
                      <div class="svc3-dot" :style="{background:s.color}"></div>
                      <div class="min-w-0">
                        <div class="svc3-svc-name">{{ s.name }}</div>
                        <div class="svc3-svc-sub">
                          <span class="mono">ID {{ pad3(s.id) }}</span>
                          <span class="muted">•</span>
                          <span class="muted">{{ s.segmentCount }} phân khúc</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div class="svc3-color">
                      <div class="svc3-swatch" :style="{background:s.color}"></div>
                      <span class="mono muted">{{ s.color }}</span>
                    </div>
                  </td>

                  <td>
                    <div class="svc3-ellipsis">{{ s.description || "—" }}</div>
                  </td>

                  <td class="text-left">
                    <span class="svc3-price p1">{{ formatCurrency(s.minPrice) }}</span>
                  </td>

                  <td class="text-left">
                    <span class="svc3-price p2">{{ formatCurrency(s.maxPrice) }}</span>
                  </td>

                  <td class="text-center">
                    <span class="svc3-badge">{{ s.segmentCount }}</span>
                  </td>

                  <td class="text-center">
                    <div class="svc3-actions justify-content-center">
                      <button class="svc3-icon info" title="Chi tiết" @click="openServiceDetail(s.id)">
                        <i class="fa-solid fa-eye"></i>
                      </button>
                      <button class="svc3-icon warn" title="Sửa" @click="openEditService(s.id)">
                        <i class="fa-solid fa-pen"></i>
                      </button>
                      <button class="svc3-icon danger" title="Xóa" @click="removeService(s)">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- SEGMENTS TAB -->
        <section v-if="activeTab==='segments'" class="svc3-panel attached">
          <div class="svc3-panel-h">
            <div class="svc3-panel-title">
              <DotLottieVue
                  src="https://lottie.host/ef658fd5-6fa8-46c4-9ab4-121172ab75a2/ykRlUdfBR8.lottie"
                  autoplay
                  loop
                  style="
                            width: 40px;
                            height:46px;
                            display: inline-block;
                            vertical-align: bottom;
                          "
              />
              <span class="fs-5">Phân khúc giá</span>
            </div>

            <div class="svc3-tools">
              <div v-if="segmentFilterServiceId != 'all'" class="svc3-input narrow">
                <i class="fa-solid fa-magnifying-glass-dollar"></i>
                <input
                    v-model="assetValueText"
                    type="text"
                    placeholder="Nhập giá trị tài sản..."
                    @input="onAssetMoneyInput"
                    @focus="onAssetMoneyFocus"
                    @blur="onAssetMoneyBlur"
                />
              </div>
              <div class="svc3-select">
                <select v-model="segmentFilterServiceId">
                  <option value="all">Tất cả</option>
                  <option v-for="s in services" :key="s.id" :value="String(s.id)">{{ s.name }}</option>
                </select>
              </div>

              <div class="svc3-select">
                <select v-model="segmentSort">
                  <option value="low-high">Giá ↑</option>
                  <option value="high-low">Giá ↓</option>
                  <option value="range-low">Khoảng ↑</option>
                  <option value="range-high">Khoảng ↓</option>
                </select>
              </div>


            </div>
          </div>

          <div class="svc3-panel-b">
            <div v-if="computedSegments.length===0" class="svc3-empty small">
              <div class="svc3-empty-ico"><i class="fa-solid fa-chart-line"></i></div>
              <div class="svc3-empty-title">Không có phân khúc phù hợp</div>
              <div class="svc3-empty-sub">Thử đổi bộ lọc hoặc nhập giá trị khác.</div>
            </div>

            <div v-else class="svc3-table-wrap">
              <table class="svc3-table">
                <thead>
                <tr>
                  <th style="min-width:280px">Dịch vụ</th>
                  <th>Giá trị tối thiểu ( >= )</th>
                  <th>Giá trị tối đa ( < ) </th>
                  <th style="width:180px" class="text-right">Giá dịch vụ</th>
                  <th style="width:170px" class="text-left">Thao tác</th>
                </tr>
                </thead>

                <tbody>
                <tr
                    v-for="seg in computedSegments"
                    :key="`${seg.serviceId}-${seg.id}`"
                    :class="{ hl: highlightKey === `${seg.serviceId}-${seg.id}` }"
                >
                  <td>
                    <div class="svc3-svc">
                      <div class="svc3-dot" :style="{background:seg.serviceColor}"></div>
                      <div class="min-w-0">
                        <div class="svc3-svc-name">{{ seg.serviceName }}</div>
                        <div class="svc3-svc-sub">
                          <span class="mono">ID {{ pad3(seg.serviceId) }}</span>
                          <span class="muted">•</span>
                          <span class="muted">Phân khúc #{{ seg.id }}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div class="svc3-range">
                        <span class="svc3-pill2">
                          <i class="fa-solid fa-arrow-up-short-wide"></i>
                          {{ formatCurrency(seg.min) }}
                        </span>
                    </div>
                  </td>
                  <td>
                    <div class="svc3-range">
                       <span class="svc3-pill2">
                          <i class="fa-solid fa-arrow-down-wide-short"></i>
                          {{ formatCurrency(seg.max) }}
                        </span>
                    </div>
                  </td>

                  <td class="text-left">
                    <span class="svc3-price p3">{{ formatCurrency(seg.price) }}</span>
                  </td>

                  <td class="text-align-center">
                    <div class="svc3-actions">
                      <button
                          class="svc3-icon warn"
                          title="Sửa phân khúc"
                          @click="openEditSegment(seg)"

                      >
                        <i class="fa-solid fa-pen"></i>
                      </button>

                      <button class="svc3-icon danger" title="Xóa phân khúc" @click="removeSegment(seg)">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>

              <div class="svc3-footnote">
                Tip: Nhập “Giá trị tài sản” để auto lọc + highlight phân khúc phù hợp.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- SERVICE DETAIL MODAL -->
    <div v-if="serviceDetailOpen" class="svc3-modal" @click.self="closeServiceDetail()">
      <div class="svc3-modal-card detail">
        <div class="svc3-modal-h">
          <div class="svc3-modal-title">
            <i class="fa-solid fa-circle-info"></i>
            <span>Chi tiết dịch vụ</span>
          </div>
          <button class="svc3-x" @click="closeServiceDetail()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="svc3-modal-b" v-if="detailService">
          <div class="svc3-detail-head">
            <div class="svc3-svc">
              <div class="svc3-dot big" :style="{background:detailService.color}"></div>
              <div class="min-w-0">
                <div class="svc3-detail-name flex items-center gap-2">
                  <span>{{ detailService.name }}</span>

                  <span
                      class="svc3-status"
                      :class="detailService.active ? 'on' : 'off'"
                  >
                  <i
                      class="fa-solid"
                      :class="detailService.active ? 'fa-circle-check' : 'fa-circle-pause'"
                  ></i>
                  {{ detailService.active ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
                </span>
                </div>
                <div class="svc3-svc-sub">
                  <span class="mono">ID {{ pad3(detailService.id) }}</span>
                  <span class="muted">•</span>
                  <span class="muted">{{ detailService.priceSegments.length }} phân khúc</span>
                </div>
              </div>
            </div>

            <div class="svc3-kpis">
              <div class="svc3-kpi">
                <div class="k">Giá thấp nhất</div>
                <div class="v p1">{{ formatCurrency(getMinPrice(detailService)) }}</div>
              </div>
              <div class="svc3-kpi">
                <div class="k">Giá cao nhất</div>
                <div class="v p2">{{ formatCurrency(getMaxPrice(detailService)) }}</div>
              </div>
            </div>
          </div>

          <div class="svc3-box">
            <div class="svc3-box-k">
              <i class="fa-solid fa-file-lines"></i><span>Mô tả</span>
            </div>
            <div class="svc3-box-v">{{ detailService.description || "—" }}</div>
          </div>

          <div class="svc3-box mt-3">
            <div class="svc3-box-k">
              <i class="fa-solid fa-tags"></i><span>Phân khúc</span>
            </div>

            <div class="svc3-seg-grid" v-if="detailService.priceSegments.length">
              <div v-for="seg in detailService.priceSegments" :key="seg.id" class="svc3-seg-card">
                <div class="svc3-seg-h">
                  <div class="t"><i class="fa-solid fa-tag"></i><span>Phân khúc {{ formatMoneyShort(seg.min) }} đến nhỏ hơn {{ formatMoneyShort(seg.max)}}</span></div>
                </div>
                <div class="svc3-seg-b">
                  <div class="row">
                    <b>{{ formatCurrency(seg.min) }} → {{ formatCurrency(seg.max) }}</b>
                  </div>
                  <div class="row">
                    <span class="muted">Giá : <b class="p3 svc3-price-strong">{{ formatCurrency(seg.price) }}</b></span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="svc3-empty small">
              <div class="svc3-empty-title">Chưa có phân khúc</div>
              <div class="svc3-empty-sub">Bấm Chỉnh sửa để thêm phân khúc.</div>
            </div>
          </div>
        </div>

        <div class="svc3-modal-f">
          <button class="svc3-btn ghost" @click="closeServiceDetail()">
            <i class="fa-solid fa-xmark"></i><span>Đóng</span>
          </button>
          <button v-if="detailService" class="svc3-btn primary" @click="(closeServiceDetail(), openEditService(detailService.id))">
            <i class="fa-solid fa-pen-to-square"></i><span>Chỉnh sửa</span>
          </button>
        </div>
      </div>
    </div>

    <!-- SERVICE EDIT MODAL (create/edit) -->
    <div v-if="serviceEditOpen" class="svc3-modal" @click.self="closeServiceEdit()">
      <div class="svc3-modal-card wide">
        <div class="svc3-modal-h">
          <div class="svc3-modal-title">
            <i class="fa-solid fa-pen-to-square"></i>
            <span>{{ serviceForm.id ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ" }}</span>
          </div>
          <button class="svc3-x" @click="closeServiceEdit()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="svc3-modal-b">
          <div class="svc3-form-grid">
            <div class="svc3-form-card">
              <div class="svc3-form-title"><i class="fa-solid fa-screwdriver-wrench"></i><span>Thông tin</span></div>

              <div class="svc3-field">
                <label><i class="fa-solid fa-tag"></i> Tên dịch vụ *</label>
                <input v-model.trim="serviceForm.name" type="text" placeholder="Nhập tên dịch vụ..." />
              </div>

              <div class="svc3-field">
                <label><i class="fa-solid fa-palette"></i> Màu phân loại *</label>
                <div class="svc3-colorpick">
                  <input v-model="serviceForm.color" class="svc3-colorinput" type="color" />
                  <div class="svc3-swatch big" :style="{background: serviceForm.color}"></div>
                  <span class="mono muted">{{ serviceForm.color }}</span>
                </div>
              </div>

              <div class="svc3-field">
                <label><i class="fa-solid fa-file-lines"></i> Mô tả</label>
                <textarea v-model.trim="serviceForm.description" rows="4" placeholder="Mô tả chi tiết..."></textarea>
              </div>

              <div class="svc3-field">
                <label><i class="fa-solid fa-toggle-on"></i> Trạng thái</label>
                <label class="svc3-switch">
                  <input v-model="serviceForm.active" type="checkbox" />
                  <span class="svc3-slider"></span>
                  <span class="svc3-switch-text" :class="{ on: serviceForm.active }">
                    {{ serviceForm.active ? 'Đang hoạt động' : 'Ngừng hoạt động' }}
                  </span>
                </label>
              </div>
            </div>

            <div class="svc3-form-card">
              <div class="svc3-form-title flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-tags"></i><span>Phân khúc</span>
                </div>
                <div class="flex gap-2">
                  <button class="svc3-btn ghost" @click="normalizeServiceSegments()">
                    <i class="fa-solid fa-broom"></i><span>Làm sạch</span>
                  </button>
                  <button class="svc3-btn primary" @click="addServiceSegment()">
                    <i class="fa-solid fa-plus"></i><span>Thêm</span>
                  </button>
                </div>
              </div>

              <div class="svc3-note">
                Quy tắc: <b>[min, max)</b> không được giao nhau và <b>min &lt; max</b>.
              </div>

              <!-- UPDATED: header columns, no per-row labels -->
              <div class="svc3-seg-edit-list compact">
                <div class="svc3-seg-cols">
                  <div class="c">Min</div>
                  <div class="c">Max</div>
                  <div class="c">Giá</div>
                  <div class="c act"></div>
                </div>

                <div
                    v-for="(seg, idx) in serviceForm.segments"
                    :key="seg._key"
                    class="svc3-seg-row"
                    :class="{ err: segErrors[idx] }"
                >
                  <input
                      v-model="seg.minText"
                      class="mono"
                      type="text"
                      placeholder="Min"
                      @input="onSegMoneyInput(idx,'minText')"
                      @focus="onSegMoneyFocus(idx,'minText')"
                      @blur="onSegMoneyBlur(idx,'minText')"
                  />

                  <input
                      v-model="seg.maxText"
                      class="mono"
                      type="text"
                      placeholder="Max"
                      @input="onSegMoneyInput(idx,'maxText')"
                      @focus="onSegMoneyFocus(idx,'maxText')"
                      @blur="onSegMoneyBlur(idx,'maxText')"
                  />

                  <input
                      v-model="seg.priceText"
                      class="mono"
                      type="text"
                      placeholder="Giá"
                      @input="onSegMoneyInput(idx,'priceText')"
                      @focus="onSegMoneyFocus(idx,'priceText')"
                      @blur="onSegMoneyBlur(idx,'priceText')"
                  />

                  <button class="svc3-icon danger mini" title="Xóa segment" @click="removeServiceSegment(idx)">
                    <i class="fa-solid fa-trash"></i>
                  </button>

                  <div v-if="segErrors[idx]" class="svc3-err2">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>{{ segErrors[idx] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="svc3-modal-f">
          <button class="svc3-btn ghost" @click="closeServiceEdit()">
            <i class="fa-solid fa-xmark"></i><span>Hủy</span>
          </button>

          <button v-if="serviceForm.id" class="svc3-btn danger" @click="removeService(serviceForm)">
            <i class="fa-solid fa-trash"></i><span>Xóa dịch vụ</span>
          </button>

          <button class="svc3-btn primary" @click="saveServiceFromModal()">
            <i class="fa-solid fa-floppy-disk"></i><span>Lưu</span>
          </button>
        </div>
      </div>
    </div>

    <!-- SEGMENT EDIT MODAL -->
    <div v-if="segmentEditOpen" class="svc3-modal" @click.self="closeSegmentEdit()">
      <div class="svc3-modal-card">
        <div class="svc3-modal-h">
          <div class="svc3-modal-title">
            <i class="fa-solid fa-pen"></i>
            <span>Chỉnh sửa phân khúc</span>
          </div>
          <button class="svc3-x" @click="closeSegmentEdit()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="svc3-modal-b">

          <!-- MIN / MAX INFO -->
          <div class="svc3-range-info">
            <div class="svc3-range-box min">
              <div class="lb">
                <i class="fa-solid fa-arrow-up-short-wide"></i>
                <span>Giá trị tối thiểu</span>
              </div>
              <div class="val mono">
                {{ segmentForm.minText }} ₫
              </div>
            </div>

            <div class="svc3-range-box max">
              <div class="lb">
                <i class="fa-solid fa-arrow-down-wide-short"></i>
                <span>Giá trị tối đa</span>
              </div>
              <div class="val mono">
                {{ segmentForm.maxText }} ₫
              </div>
            </div>
          </div>

          <!-- PRICE INPUT -->
          <div class="svc3-field mt-3">
            <label>
              <i class="fa-solid fa-dollar-sign"></i>
              Giá dịch vụ
            </label>
            <input
                v-model="segmentForm.priceText"
                class="mono"
                type="text"
                placeholder="Nhập giá dịch vụ..."
                @input="onSegmentFormMoneyInput('priceText')"
                @focus="onSegmentFormMoneyFocus('priceText')"
                @blur="onSegmentFormMoneyBlur('priceText')"
            />
          </div>

          <!-- ERROR -->
          <div v-if="segmentError" class="svc3-err mt-2">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>{{ segmentError }}</span>
          </div>

        </div>


        <div class="svc3-modal-f">
          <button class="svc3-btn ghost" @click="closeSegmentEdit()">
            <i class="fa-solid fa-xmark"></i><span>Hủy</span>
          </button>
          <button class="svc3-btn primary" @click="saveSegmentFromModal()">
            <i class="fa-solid fa-floppy-disk"></i><span>Lưu</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="svc3-toast-wrap" aria-live="polite">
      <div v-for="t in toasts" :key="t.id" class="svc3-toast" :class="t.type">
        <i
            class="fa-solid"
            :class="t.type==='success' ? 'fa-circle-check' : t.type==='error' ? 'fa-circle-xmark' : 'fa-circle-info'"
        ></i>
        <div class="min-w-0">
          <div class="tt">{{ t.type==='success' ? 'Thành công' : t.type==='error' ? 'Lỗi' : 'Thông báo' }}</div>
          <div class="tx">{{ t.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { computed, reactive, ref, onMounted, watch } from "vue";
import { useAuthStore } from "/src/stores/authStore.js";
const authStore = useAuthStore();
const info = authStore.userInfo;
/* ===== DATA ===== */
const services = ref([])

function formatMoneyShort(amount) {
  if (!amount || amount <= 0) return "0";

  const billion = 1_000_000_000;
  const million = 1_000_000;

  if (amount >= billion) {
    const v = amount / billion;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)} tỷ`;
  }

  if (amount >= million) {
    const v = amount / million;
    return `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(0)} triệu`;
  }

  return `${amount.toLocaleString("vi-VN")} ₫`;
}

import api from '/src/api/api.js' // nếu bạn đang dùng axios wrapper

const fetchServices = async () => {
  try {
    const res = await api.get('/dich-vu-thg/admin', {
      params: {
        keyword: serviceQuery.value || null
      }
    })

    // Map dữ liệu BE -> FE structure
    services.value = (res.data || []);
  } catch (e) {
    console.error('❌ Lỗi fetch services', e)
    services.value = []
  }
}



/* ===== TABS ===== */
const activeTab = ref("services");

/* ===== SERVICES FILTER ===== */
const serviceQuery = ref("");
const filteredServices = computed(() => {
  const q = serviceQuery.value.trim().toLowerCase();
  if (!q) return services.value;
  return services.value.filter(s =>
      (s.name || "").toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q)
  );
});

/* ===== SEGMENTS ===== */
const segmentFilterServiceId = ref("all");
const segmentSort = ref("low-high");
const assetValueText = ref("");
const highlightKey = ref("");

const assetValueNumber = computed(() => parseFormattedNumber(assetValueText.value));

const totalSegments = computed(() => segments.value.length);

const segments = ref([]);

const fetchAllSegments = async () => {
  const res = await api.get('/dich-vu-thg/admin/phan-khuc');
  segments.value = res.data || [];
};

const computedSegments = computed(() => {
  let list = [...segments.value];

  // filter theo dịch vụ
  if (segmentFilterServiceId.value !== "all") {
    list = list.filter(
        s => String(s.serviceId) === segmentFilterServiceId.value
    );
  }

  // highlight theo giá trị tài sản
  const x = assetValueNumber.value;
  highlightKey.value = "";
  if (x > 0) {
    const hit = list.find(seg => x >= seg.min && x < seg.max);
    if (hit) highlightKey.value = `${hit.serviceId}-${hit.id}`;
  }

  // sort
  list.sort((a, b) => {
    switch (segmentSort.value) {
      case "low-high": return a.price - b.price;
      case "high-low": return b.price - a.price;
      case "range-low": return (a.max - a.min) - (b.max - b.min);
      case "range-high": return (b.max - b.min) - (a.max - a.min);
      default: return 0;
    }
  });

  return list;
});


/* ===== MODALS ===== */
const serviceDetailOpen = ref(false);
const serviceEditOpen = ref(false);
const segmentEditOpen = ref(false);

/* Service detail */
const detailServiceId = ref(null);
const detailService = ref(null)
const fetchServiceDetail = async (id) => {
  try {
    const res = await api.get(`/dich-vu-thg/admin/${id}`)
    detailService.value = res.data
    serviceDetailOpen.value = true
  } catch (e) {
    console.error('❌ Lỗi fetch service detail', e)
    toast('error', 'Không tải được chi tiết dịch vụ')
  }
}


/* Service form modal (create/edit) */
const serviceForm = reactive({
  id: null,
  name: "",
  color: "#667eea",
  description: "",
  active: true,
  segments: []
});
const segErrors = ref([]);

/* Segment edit modal */
const segmentForm = reactive({
  serviceId: null,
  segmentId: null,
  minText: "",
  maxText: "",
  priceText: ""
});
const segmentError = ref("");

/* ===== TOAST ===== */
const toasts = ref([]);
function toast(type, message) {
  const id = `${Date.now()}-${Math.random()}`;
  toasts.value.push({ id, type, message });
  setTimeout(() => (toasts.value = toasts.value.filter(t => t.id !== id)), 2600);
}

/* ===== HELPERS ===== */
function pad3(n) { return String(n).padStart(3, "0"); }

function formatNumberWithDots(num) {
  if (num === null || num === undefined) return "";
  const n = Number(num);
  if (!Number.isFinite(n)) return "";
  return Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseFormattedNumber(str) {
  if (!str) return 0;
  const v = String(str).replace(/[^\d]/g, "");
  return v ? parseInt(v, 10) : 0;
}

function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(amount || 0);
  } catch {
    return `${formatNumberWithDots(amount || 0)} ₫`;
  }
}

function getMinPrice(service) {
  if (!service?.priceSegments?.length) return 0;
  return Math.min(...service.priceSegments.map(x => x.price));
}
function getMaxPrice(service) {
  if (!service?.priceSegments?.length) return 0;
  return Math.max(...service.priceSegments.map(x => x.price));
}

/* ===== ASSET INPUT ===== */
function onAssetMoneyInput() {
  const v = assetValueText.value.replace(/[^\d]/g, "");
  assetValueText.value = v ? formatNumberWithDots(parseInt(v, 10)) : "";
}
function onAssetMoneyFocus() {
  assetValueText.value = assetValueText.value.replace(/\./g, "");
}
function onAssetMoneyBlur() {
  const n = parseFormattedNumber(assetValueText.value);
  assetValueText.value = n ? formatNumberWithDots(n) : "";
}

/* ===== SERVICES ACTIONS ===== */
function openServiceDetail(id) {
  detailServiceId.value = id
  fetchServiceDetail(id)
}

function closeServiceDetail() {
  serviceDetailOpen.value = false;
  detailService.value = null;
  segmentEditOpen.value = false;
}



function openCreateService() {
  serviceForm.id = null;
  serviceForm.name = "";
  serviceForm.color = "#667eea";
  serviceForm.description = "";
  serviceForm.active = true;
  serviceForm.segments = [
    { _key: `${Date.now()}-${Math.random()}`, minText: formatNumberWithDots(1000000), maxText: formatNumberWithDots(5000000), priceText: formatNumberWithDots(8000000) }
  ];
  segErrors.value = new Array(serviceForm.segments.length).fill("");
  serviceEditOpen.value = true;
}

async function openEditService(id) {
  const fallback = services.value.find(x => x.id === id);
  if (!fallback) return;
  serviceEditOpen.value = true;
  try {
    const res = await api.get(`/dich-vu-thg/admin/${id}`);
    const s = res.data || fallback;
    serviceForm.id = s.id;
    serviceForm.name = s.name;
    serviceForm.color = s.color;
    serviceForm.description = s.description || "";
    serviceForm.active = s.active ?? true;
    serviceForm.segments = (s.priceSegments || []).map(seg => ({
      _key: `${Date.now()}-${Math.random()}`,
      minText: formatNumberWithDots(seg.min),
      maxText: formatNumberWithDots(seg.max),
      priceText: formatNumberWithDots(seg.price)
    }));
  } catch (e) {
    console.error("❌ Lỗi fetch service detail", e);
    toast("error", "Không tải được chi tiết dịch vụ, dùng dữ liệu danh sách.");
    serviceForm.id = fallback.id;
    serviceForm.name = fallback.name;
    serviceForm.color = fallback.color;
    serviceForm.description = fallback.description || "";
    serviceForm.active = fallback.active ?? true;
    serviceForm.segments = (fallback.priceSegments || []).map(seg => ({
      _key: `${Date.now()}-${Math.random()}`,
      minText: formatNumberWithDots(seg.min),
      maxText: formatNumberWithDots(seg.max),
      priceText: formatNumberWithDots(seg.price)
    }));
  }
  if (!serviceForm.segments.length) {
    serviceForm.segments = [{ _key: `${Date.now()}-${Math.random()}`, minText: formatNumberWithDots(1000000), maxText: formatNumberWithDots(5000000), priceText: formatNumberWithDots(8000000) }];
  }
  segErrors.value = new Array(serviceForm.segments.length).fill("");
}

function closeServiceEdit() {
  serviceEditOpen.value = false;
}

function addServiceSegment() {
  serviceForm.segments.push({ _key: `${Date.now()}-${Math.random()}`, minText: formatNumberWithDots(1000000), maxText: formatNumberWithDots(5000000), priceText: formatNumberWithDots(8000000) });
  segErrors.value.push("");
}

function removeServiceSegment(idx) {
  if (serviceForm.segments.length <= 1) return toast("error", "Dịch vụ phải có ít nhất 1 phân khúc.");
  serviceForm.segments.splice(idx, 1);
  segErrors.value.splice(idx, 1);
}

function normalizeServiceSegments() {
  const parsed = serviceForm.segments
      .map(s => ({
        _key: s._key,
        min: parseFormattedNumber(s.minText),
        max: parseFormattedNumber(s.maxText),
        price: parseFormattedNumber(s.priceText)
      }))
      .sort((a, b) => a.min - b.min);

  serviceForm.segments = parsed.map(p => ({
    _key: p._key,
    minText: formatNumberWithDots(p.min),
    maxText: formatNumberWithDots(p.max),
    priceText: formatNumberWithDots(p.price)
  }));

  segErrors.value = new Array(serviceForm.segments.length).fill("");
  toast("info", "Đã sắp xếp và làm sạch phân khúc.");
}

function onSegMoneyInput(idx, field) {
  const seg = serviceForm.segments[idx];
  const v = String(seg[field] || "").replace(/[^\d]/g, "");
  seg[field] = v ? formatNumberWithDots(parseInt(v, 10)) : "";
}
function onSegMoneyFocus(idx, field) {
  const seg = serviceForm.segments[idx];
  seg[field] = String(seg[field] || "").replace(/\./g, "");
}
function onSegMoneyBlur(idx, field) {
  const seg = serviceForm.segments[idx];
  const n = parseFormattedNumber(seg[field]);
  seg[field] = n ? formatNumberWithDots(n) : "";
}

function validateServiceForm() {
  if (!serviceForm.name.trim()) {
    toast("error", "Vui lòng nhập tên dịch vụ.");
    return false;
  }

  const segs = serviceForm.segments.map(s => ({
    min: parseFormattedNumber(s.minText),
    max: parseFormattedNumber(s.maxText),
    price: parseFormattedNumber(s.priceText)
  }));

  segErrors.value = new Array(segs.length).fill("");

  for (let i = 0; i < segs.length; i++) {
    const { min, max, price } = segs[i];
    if (!(min < max)) segErrors.value[i] = "Sai khoảng: min phải nhỏ hơn max.";
    else if (!(price > 0)) segErrors.value[i] = "Giá phải > 0.";
  }

  const withIdx = segs.map((s, i) => ({ ...s, i })).sort((a, b) => a.min - b.min);
  for (let k = 0; k < withIdx.length - 1; k++) {
    const a = withIdx[k], b = withIdx[k + 1];
    if (a.min < b.max && b.min < a.max) {
      segErrors.value[a.i] = "Trùng khoảng (overlap).";
      segErrors.value[b.i] = "Trùng khoảng (overlap).";
    }
  }

  if (segErrors.value.some(Boolean)) {
    toast("error", "Vui lòng sửa lỗi phân khúc trước khi lưu.");
    return false;
  }
  return true;
}

async function saveServiceFromModal() {
  if (!validateServiceForm()) return;

  // ❌ KHÔNG GỬI ID SEGMENT
  const normalizedSegments = serviceForm.segments.map(s => ({
    min: parseFormattedNumber(s.minText),
    max: parseFormattedNumber(s.maxText),
    price: parseFormattedNumber(s.priceText)
  }));

  const payload = {
    id: serviceForm.id || null, // null = create
    name: serviceForm.name.trim(),
    color: serviceForm.color || "#667eea",
    description: serviceForm.description.trim(),
    active: serviceForm.active,
    priceSegments: normalizedSegments
  };

  try {
    // BE xử lý create / update chung
    const res = await api.post('/dich-vu-thg/admin/save', payload);

    const saved = res.data;

    // === sync lại list FE từ BE ===
    const idx = services.value.findIndex(x => x.id === saved.id);
    if (idx !== -1) {
      services.value[idx] = saved;
      toast("success", "Đã cập nhật dịch vụ.");
      await fetchServices();
    } else {
      services.value.unshift(saved);
      toast("success", "Đã thêm dịch vụ mới.");
      await fetchServices();
    }

    serviceEditOpen.value = false;
  } catch (e) {
    console.error("❌ Lỗi lưu dịch vụ", e);
    toast("error", "Lưu dịch vụ thất bại.");
  }
}


import { confirmWithInput } from "/src/assets/js/alertService.js"

async function removeService(service) {
  const expectedText = service.name; // 👈 gõ đúng tên dịch vụ

  await confirmWithInput(
      "Xác nhận xoá dịch vụ",
      `Hãy nhập chính xác tên dịch vụ để xác nhận xoá:\n"${expectedText}"`,
      expectedText,
      async () => {
        try {
          await api.delete(`/dich-vu-thg/admin/${service.id}`);
          await fetchServices();
          services.value = services.value.filter(s => s.id !== service.id);
          toast("success", "Đã xoá dịch vụ.");

          if (detailServiceId.value === service.id) closeServiceDetail();
          if (serviceForm.id === service.id) closeServiceEdit();

        } catch (e) {
          console.error("❌ Lỗi xoá dịch vụ", e);
          toast("error", "Xoá dịch vụ thất bại.");
        }
      }
  );
}


/* ===== SEGMENTS ACTIONS ===== */
async function removeSegment(seg) {
  if (!seg) return;

  const expectedText = formatNumberWithDots(seg.price);

  await confirmWithInput(
      "Xác nhận xoá phân khúc",
      `Hãy nhập đúng GIÁ của phân khúc để xác nhận xoá:\n${formatCurrency(seg.price)}`,
      expectedText,
      async () => {
        try {
          await api.delete(
              `/dich-vu-thg/admin/${seg.serviceId}/phan-khuc/${seg.id}`
          );

          toast("success", "Đã xoá phân khúc.");

          // 🔄 reload lại dữ liệu
          await fetchServices();
          await fetchAllSegments();

        } catch (e) {
          console.error("❌ Lỗi xoá phân khúc", e);
          toast("error", e?.response?.data?.message || "Xoá phân khúc thất bại.");
        }
      }
  );
}


function openEditSegment(seg) {
  if (!seg) return;

  segmentForm.serviceId = seg.serviceId;
  segmentForm.segmentId = seg.id;

  segmentForm.minText = formatNumberWithDots(seg.min);
  segmentForm.maxText = formatNumberWithDots(seg.max);
  segmentForm.priceText = formatNumberWithDots(seg.price);

  segmentError.value = "";
  segmentEditOpen.value = true;
}


function closeSegmentEdit() {
  segmentEditOpen.value = false;
  segmentError.value = "";
}

function onSegmentFormMoneyInput(field) {
  const v = String(segmentForm[field] || "").replace(/[^\d]/g, "");
  segmentForm[field] = v ? formatNumberWithDots(parseInt(v, 10)) : "";
}
function onSegmentFormMoneyFocus(field) {
  segmentForm[field] = String(segmentForm[field] || "").replace(/\./g, "");
}
function onSegmentFormMoneyBlur(field) {
  const n = parseFormattedNumber(segmentForm[field]);
  segmentForm[field] = n ? formatNumberWithDots(n) : "";
}

function overlaps(serviceId, min, max, excludeSegmentId) {
  const s = services.value.find(x => x.id === serviceId);
  if (!s) return true;
  for (const seg of s.priceSegments) {
    if (seg.id === excludeSegmentId) continue;
    if (min < seg.max && seg.min < max) return true;
  }
  return false;
}

async function saveSegmentFromModal() {
  const serviceId = segmentForm.serviceId;
  const segmentId = segmentForm.segmentId;

  const min = parseFormattedNumber(segmentForm.minText);
  const max = parseFormattedNumber(segmentForm.maxText);
  const price = parseFormattedNumber(segmentForm.priceText);

  if (!(min < max)) {
    segmentError.value = "Sai khoảng: min phải nhỏ hơn max.";
    return;
  }
  if (!(price > 0)) {
    segmentError.value = "Giá phải > 0.";
    return;
  }

  const payload = {
    id: segmentId,
    min,
    max,
    price
  };

  try {
    await api.put(
        `/dich-vu-thg/admin/${serviceId}/phan-khuc/${segmentId}`,
        payload
    );

    toast("success", "Đã cập nhật giá phân khúc.");
    segmentEditOpen.value = false;

    // 🔄 reload lại dữ liệu
    await fetchServices();
    await fetchAllSegments();

  } catch (e) {
    console.error("❌ Lỗi lưu phân khúc", e);
    toast("error", "Lưu phân khúc thất bại.");
  }
}


/* ===== MISC ===== */
function seedMock() {
  toast("info", "Đang dùng mock data trong component.");
}
onMounted(async () => {
  await fetchServices()
  await fetchAllSegments();  // tab 2
})
watch(serviceQuery, async () => {
  await fetchServices()
})
watch(activeTab, async (newTab, oldTab) => {
  if (newTab === 'services') {
    // Khi quay lại tab dịch vụ
    await fetchServices();
  }

  if (newTab === 'segments') {
    // Khi chuyển sang tab phân khúc
    await fetchAllSegments();

    // reset các filter phụ để UX sạch
    highlightKey.value = "";
    assetValueText.value = "";

    // nếu đang filter theo service mà service bị xoá → reset
    if (
        segmentFilterServiceId.value !== 'all' &&
        !services.value.some(s => String(s.id) === segmentFilterServiceId.value)
    ) {
      segmentFilterServiceId.value = 'all';
    }
  }
});

</script>

<style scoped>
/* ===== TOKENS (scoped-safe) ===== */
.svc3-page{
  position: relative;
  top: -10px!important;
  --bg:
      radial-gradient(1200px 700px at 18% 8%, rgba(102,126,234,.16), transparent 60%),
      radial-gradient(900px 650px at 78% 0%, rgba(240,147,251,.12), transparent 58%),
      linear-gradient(135deg, rgba(15,23,42,.05), rgba(15,23,42,.00));
  --card: rgba(255,255,255,.92);
  --line: rgba(15, 23, 42, .10);
  --line2: rgba(15, 23, 42, .08);
  --text: #0b1220;
  --muted: rgba(11,18,32,.62);

  --g1: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  --g2: linear-gradient(135deg,#f093fb 0%,#f5576c 100%);
  --g3: linear-gradient(135deg,#43e97b 0%,#38f9d7 100%);
  --g4: linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);
  --gd: linear-gradient(135deg,#0f172a 0%,#1f2a44 100%);

  --r: 16px;
  --r2: 14px;
  --sh: 0 14px 34px rgba(0,0,0,.10);
  --sh2: 0 10px 22px rgba(0,0,0,.08);
  --t: all .18s cubic-bezier(.4,0,.2,1);
  min-height:85vh;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}
.muted{ color: var(--muted); }
.mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }

.tiny{ font-size: 12px; }

/* ===== TOPBAR ===== */
.svc3-topbar{
  position: relative;
  top: -10px!important;
  border: 1px solid var(--line);
  border-radius: var(--r);
  box-shadow: var(--sh2);
  padding: 12px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  backdrop-filter: blur(10px);
  border-bottom: solid 1px #bbbaba;
}
.svc3-brand{ display:flex; align-items:center; gap:10px; min-width:0; }
.svc3-brand-ico{
  width:38px; height:38px;
  border-radius:14px;
  display:grid; place-items:center;

  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 55%, #a855f7 100%);
  color: #ffffff;

  box-shadow: 0 14px 26px rgba(37,99,235,.22);
}
.svc3-title{
  font-size: 18px;
  font-weight: 750;
  letter-spacing: .2px;
  line-height: 1.1;

  background: linear-gradient(90deg, #2563eb 0%, #7c3aed 55%, #a855f7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
.svc3-top-actions{ display:flex; align-items:center; gap:8px; }

/* ===== BUTTONS ===== */
.svc3-btn{
  height:34px;
  padding: 0 10px;
  border-radius: 12px;
  border: none;
  cursor:pointer;
  font-size: 13px;
  font-weight: 650;
  display:inline-flex;
  align-items:center;
  gap:8px;
  transition: var(--t);
  position:relative;
  overflow:hidden;
}
.svc3-btn:hover{ transform: translateY(-1px); }
.svc3-btn.primary{
  background: var(--g1);
  color:#fff;
  box-shadow: 0 14px 28px rgba(102,126,234,.18);
}
.svc3-btn.ghost{
  background: rgba(15,23,42,.04);
  color: var(--text);
  border: 1px solid rgba(15,23,42,.10);
}
.svc3-btn.ghost:hover{
  border-color: rgba(102,126,234,.22);
  background: rgba(102,126,234,.06);
}
.svc3-btn.danger{
  background: linear-gradient(135deg,#ff5858 0%, #f09819 100%);
  color:#fff;
  box-shadow: 0 14px 28px rgba(255,88,88,.14);
}
.svc3-btn i{
  background-color: rgba(255, 255, 255, 0) !important;
}
/* ===== TABS (browser-like + attached panel) ===== */
.svc3-tabs-shell{ position: relative; }
.svc3-tabs{
  display:flex;
  align-items:flex-end;

}
.svc3-tab{
  flex: 0 0 auto;
  display:flex;
  align-items:center;
  gap:10px;
  padding: 8px 10px;
  border-radius: 18px 18px 0 0;
  border-bottom: none;
  cursor:pointer;
  transition: var(--t);
  font-size: 13px;
  font-weight: 650;
  position: relative;
  top:5px;
  z-index: 10;
}
.svc3-tab i{
  width:30px; height:30px;
  border-radius: 12px;
  display:grid; place-items:center;
  color: rgba(15,23,42,.78);
  transition: var(--t);
}
.svc3-tab:hover{
  transform: translateY(-1px);
  border-color: rgba(102,126,234,.22);
  color: #491eb7 !important;
}
.svc3-tab::after{
   content:"";
   position:absolute;
   left: 18px;
   right: 18px;
   bottom: 6px;          /* chỉnh lên/xuống tùy ý */
   height: 2px;
   border-radius: 999px;
   background: linear-gradient(90deg,#2563eb 0%, #7c3aed 55%, #a855f7 100%);
   transform: scaleX(0);
   transform-origin: center;
   transition: transform .18s cubic-bezier(.4,0,.2,1);
   opacity: .95;
 }

/* hover: lan ra từ giữa */
.svc3-tab:hover::after{
  transform: scaleX(1);
}
.svc3-tab:hover i{
  transform: translateY(-1px);
  border-color: rgba(102,126,234,.22);
  color: #491eb7 !important;
}
.svc3-tab.active{
  background: var(--card);
  border-color: var(--line);
  box-shadow: none;
  position: relative;
}
.svc3-tab.active i{ background: var(--g1); color:#fff; }
.svc3-pill{
  margin-left: 2px;
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(15,23,42,.06);
  display:inline-flex;
  align-items:center;
  justify-content:center;
  font-size: 12px;
  font-weight: 650;
}

/* ===== PANEL ===== */
.svc3-panel{
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  box-shadow: var(--sh);
  overflow:hidden;
  backdrop-filter: blur(10px);
}
.svc3-panel.attached{
  border-radius: 0 16px 16px 16px; /* dính với tab */
  margin-top: 0;
}
.svc3-panel-h{
  padding: 10px 12px;
  border-bottom: 1px solid rgba(15,23,42,.08);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  flex-wrap:wrap;
}
.svc3-panel-title{
  display:flex;
  align-items:center;
  gap:10px;
  font-weight: 700;
  font-size: 13px;
}
.svc3-panel-title i{
  width:30px; height:30px;
  border-radius: 12px;
  display:grid; place-items:center;
  background: var(--gd);
  color:#fff;
}
.svc3-hint{
  margin-left: 10px;
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px dashed rgba(15,23,42,.14);
  background: rgba(15,23,42,.02);
  color: rgba(11,18,32,.72);
  font-size: 12px;
}
.svc3-panel-b{ padding: 12px; }

/* ===== TOOLS ===== */
.svc3-tools{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.svc3-input{ position:relative; min-width: 280px; }
.svc3-input.narrow{ min-width: 260px; max-width: 320px; }
.svc3-input i{
  position:absolute; left:10px; top:50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: rgba(15,23,42,.55);
}
.svc3-input input{
  width:100%;
  height: 34px;
  padding: 0 10px 0 30px;
  border-radius: 12px;
  border: 1px solid rgba(15,23,42,.12);
  background: #fff;
  outline:none;
  font-size: 13px;
  font-weight: 550;
  transition: var(--t);
  color: #000;
}
.svc3-input input:focus{
  border-color: rgba(102,126,234,.45);
  box-shadow: 0 0 0 4px rgba(102,126,234,.12);
}
.svc3-select{ display:flex; flex-direction:column; gap:4px; }
.svc3-select label{
  font-size: 11px;
  color: var(--muted);
  font-weight: 650;
}
.svc3-select select{
  height:34px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid rgba(15,23,42,.12);
  background: #fff;
  font-size: 13px;
  font-weight: 550;
  outline:none;
  transition: var(--t);
}
.svc3-select select:focus{
  border-color: rgba(102,126,234,.45);
  box-shadow: 0 0 0 4px rgba(102,126,234,.12);
}

/* ===== TABLE ===== */
.svc3-table-wrap{
  border: 1px solid rgba(15,23,42,.10);
  border-radius: var(--r2);
  overflow:hidden;
  background:#fff;
}
.svc3-table{
  width:100%;
  border-collapse: collapse;
}
.svc3-table thead{
  background: var(--gd); /* nền LIỀN MẠCH */
}
.svc3-table thead th{
  background: transparent;
  color:#fff;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: .55px;
  text-transform: uppercase;
  padding: 10px 10px;
  text-align:left;
  white-space: nowrap;
}
.svc3-table tbody td{
  padding: 10px 10px;
  border-bottom: 1px solid rgba(15,23,42,.08);
  font-size: 13px;
  vertical-align: middle;
}
.svc3-table tbody tr:nth-child(even){ background: rgba(15,23,42,.012); }
.svc3-table tbody tr:hover{ background: rgba(102,126,234,.06); }
.svc3-table tbody tr.hl{
  background: linear-gradient(135deg, rgba(67,233,123,.14), rgba(56,249,215,.12));
}
.svc3-footnote{
  padding: 10px;
  font-size: 12px;
  color: var(--muted);
  background: rgba(15,23,42,.03);
  border-top: 1px solid rgba(15,23,42,.06);
}

/* ===== CELLS ===== */
.svc3-svc{ display:flex; align-items:center; gap:10px; }
.svc3-dot{
  width:12px; height:12px;
  border-radius: 7px;
  border: 2px solid #fff;
  box-shadow: 0 10px 18px rgba(0,0,0,.10);
}
.svc3-dot.big{ width:16px; height:16px; border-radius:10px; }
.svc3-svc-name{
  font-weight: 650;
  line-height: 1.1;
  white-space: nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
  max-width: 520px;
}
.svc3-svc-sub{
  margin-top:2px;
  font-size: 12px;
  display:flex;
  gap:8px;
  align-items:center;
  color: var(--muted);
}
.svc3-color{ display:flex; align-items:center; gap:10px; }
.svc3-swatch{
  width:26px; height:26px;
  border-radius: 12px;
  border: 2px solid #fff;
  box-shadow: 0 10px 18px rgba(0,0,0,.10);
}
.svc3-swatch.big{ width:34px; height:34px; border-radius:14px; }
.svc3-ellipsis{
  color: rgba(11,18,32,.78);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow:hidden;
}
.svc3-badge{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width: 34px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(15,23,42,.06);
  font-weight: 650;
  font-size: 12px;
}
.svc3-price{ font-weight: 750; font-size: 13px; white-space: nowrap; }
.svc3-price.p1{ background: var(--g1); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.svc3-price.p2{ background: var(--g2); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.svc3-price.p3{ background: var(--g3); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }

.svc3-actions{ display:flex; gap:6px; align-items:center; }

/* base */
.svc3-icon{
  width:32px; height:32px;
  border-radius:12px;
  cursor:pointer;
  display:grid;
  place-items:center;
  position: relative;
  transition: var(--t);
  box-shadow: 0 10px 16px rgba(0,0,0,.06);
  border: 1px solid transparent;   /* quan trọng để hover viền mượt */
}

/* icon gradient */
.svc3-icon i{
  background: var(--ig);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

/* bỏ viền gradient cũ */
.svc3-icon::before{ display:none; }

/* nền pastel mặc định + gradient icon theo loại */
.svc3-icon.info{
  --ig: linear-gradient(135deg,#22c55e 0%, #16a34a 45%, #34d399 100%);
  background: linear-gradient(135deg, rgba(34,197,94,.16) 0%, rgba(52,211,153,.10) 100%);
}
.svc3-icon.warn{
  --ig: linear-gradient(135deg,#0ea5e9 0%, #2563eb 55%, #60a5fa 100%);
  background: linear-gradient(135deg, rgba(14,165,233,.16) 0%, rgba(96,165,250,.10) 100%);
}
.svc3-icon.danger{
  --ig: linear-gradient(135deg,#ef4444 0%, #f97316 55%, #fb7185 100%);
  background: linear-gradient(135deg, rgba(239,68,68,.16) 0%, rgba(251,113,133,.10) 100%);
}

/* hover chung */
.svc3-icon:hover{
  transform: translateY(-1px);
  filter: brightness(1.02);
}

/* hover: nền đậm hơn + viền trùng tông */
.svc3-icon.info:hover{
  background: linear-gradient(135deg, rgba(34,197,94,.22) 0%, rgba(52,211,153,.14) 100%);
  box-shadow: 0 12px 20px rgba(34,197,94,.18);
  border-color: rgba(34,197,94,.35);
}
.svc3-icon.warn:hover{
  background: linear-gradient(135deg, rgba(14,165,233,.22) 0%, rgba(96,165,250,.14) 100%);
  box-shadow: 0 12px 20px rgba(37,99,235,.18);
  border-color: rgba(37,99,235,.35);
}
.svc3-icon.danger:hover{
  background: linear-gradient(135deg, rgba(239,68,68,.22) 0%, rgba(251,113,133,.14) 100%);
  box-shadow: 0 12px 20px rgba(239,68,68,.18);
  border-color: rgba(239,68,68,.35);
}


.svc3-icon.mini{ width:32px; height:32px; border-radius: 12px; }

/* ===== RANGE ===== */
.svc3-range{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.svc3-pill2{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(15,23,42,.03);
  font-size: 12px;
  font-weight: 650;
  white-space: nowrap;
}

/* ===== EMPTY ===== */
.svc3-empty{ padding: 26px 10px; text-align:center; }
.svc3-empty.small{ padding: 18px 10px; }
.svc3-empty-ico{
  width:48px; height:48px;
  margin: 0 auto 10px;
  border-radius: 16px;
  display:grid; place-items:center;
  background: var(--g1);
  color:#fff;
  box-shadow: 0 16px 28px rgba(102,126,234,.20);
}
.svc3-empty-title{ font-weight: 700; font-size: 13px; }
.svc3-empty-sub{ margin-top: 6px; color: var(--muted); font-size: 12px; }

/* ===== MODAL ===== */
.svc3-modal{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(6px);
  z-index: 80;
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 16px;
}
.svc3-modal-card{
  width: min(720px, 100%);
  background: rgba(255,255,255,.96);
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 18px;
  box-shadow: 0 30px 70px rgba(0,0,0,.30);
  overflow:hidden;
  animation: pop .16s ease;
}
.svc3-modal-card.detail{
  background:
    radial-gradient(120% 120% at 0% 0%, rgba(255,214,214,.55), transparent 55%),
    radial-gradient(120% 120% at 100% 0%, rgba(206,221,255,.55), transparent 60%),
    radial-gradient(120% 120% at 100% 100%, rgba(210,255,238,.55), transparent 55%),
    linear-gradient(160deg, rgba(255,255,255,.98), rgba(255,255,255,.92));
  border: 1px solid rgba(168,185,255,.35);
  box-shadow: 0 35px 80px rgba(88,116,255,.22);
}
.svc3-modal-card.wide{ width: min(1020px, 100%); }
@keyframes pop{ from{ opacity:0; transform: translateY(10px) scale(.98);} to{ opacity:1; transform: translateY(0) scale(1);} }
.svc3-modal-h{
  padding: 12px 12px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  border-bottom: 1px solid rgba(15,23,42,.08);
  background: rgba(15,23,42,.02);
}
.svc3-modal-card.detail .svc3-modal-h{
  background: linear-gradient(90deg, rgba(255,224,235,.65), rgba(224,238,255,.65), rgba(226,255,244,.65));
  border-bottom: 1px solid rgba(168,185,255,.35);
}
.svc3-modal-title{
  display:flex;
  align-items:center;
  gap:10px;
  font-weight: 700;
  font-size: 13px;
}
.svc3-modal-title i{
  width:30px; height:30px;
  border-radius: 12px;
  display:grid; place-items:center;
  background: var(--gd);
  color:#fff;
}
.svc3-modal-card.detail .svc3-modal-title i{
  background: linear-gradient(135deg, #ffb7c5, #c9d7ff);
  box-shadow: 0 12px 22px rgba(255, 183, 197, .35);
}
.svc3-x{
  width:36px; height:36px;
  border-radius: 12px;
  border: 1px solid rgba(15,23,42,.10);
  background: rgba(15,23,42,.03);
  cursor:pointer;
  transition: var(--t);
}
.svc3-x:hover{ transform: translateY(-1px); background: rgba(102,126,234,.08); border-color: rgba(102,126,234,.22); }
.svc3-modal-b{ padding: 12px; }
.svc3-modal-f{
  padding: 12px;
  display:flex;
  justify-content:flex-end;
  gap:8px;
  border-top: 1px solid rgba(15,23,42,.08);
  background: rgba(15,23,42,.02);
}
.svc3-modal-card.detail .svc3-modal-f{
  background: linear-gradient(90deg, rgba(229,240,255,.6), rgba(255,236,246,.6));
  border-top: 1px solid rgba(168,185,255,.35);
}
.svc3-modal-card.detail .svc3-detail-name span{
  color: #2f3b66;
}
.svc3-modal-card.detail .svc3-detail-name i{
  color: #5f79d6;
}
.svc3-modal-card.detail .svc3-svc-sub{
  color: rgba(47,59,102,.65);
}

/* Detail blocks */
.svc3-detail-head{
  display:flex;
  justify-content:space-between;
  gap:10px;
  flex-wrap:wrap;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(15,23,42,.08);
}
.svc3-modal-card.detail .svc3-detail-head{
  border-bottom: 1px solid rgba(168,185,255,.35);
}
.svc3-detail-name{ font-weight: 750; font-size: 14px; }
.svc3-kpis{ display:flex; gap:10px; }
.svc3-kpi{
  min-width: 140px;
  border: 1px solid rgba(15,23,42,.10);
  border-radius: 14px;
  padding: 8px 10px;
  background: #fff;
}
.svc3-modal-card.detail .svc3-kpi{
  background: linear-gradient(160deg, rgba(255,255,255,.95), rgba(235,248,255,.9));
  border: 1px solid rgba(168,185,255,.4);
  box-shadow: 0 12px 24px rgba(167,196,255,.22);
}
.svc3-modal-card.detail .svc3-kpi .k{
  color: rgba(70,85,130,.75);
}
.svc3-modal-card.detail .svc3-kpi .v{
  font-size: 14px;
  letter-spacing: .2px;
  background: none;
  -webkit-text-fill-color: initial;
}
.svc3-modal-card.detail .svc3-kpi .v.p1{
  color: #2f6f8f;
}
.svc3-modal-card.detail .svc3-kpi .v.p2{
  color: #8a4f8c;
}
.svc3-kpi .k{ font-size: 11px; color: var(--muted); font-weight: 650; }
.svc3-kpi .v{ margin-top:2px; font-weight: 750; font-size: 13px; }

.svc3-box{
  margin-top: 10px;
  border: 1px solid rgba(15,23,42,.10);
  border-radius: 14px;
  background: #fff;
  padding: 10px;
}
.svc3-modal-card.detail .svc3-box{
  background: linear-gradient(135deg, rgba(255,255,255,.96), rgba(255,239,247,.9));
  border: 1px solid rgba(255,192,226,.45);
  box-shadow: 0 14px 24px rgba(255,192,226,.2);
}
.svc3-modal-card.detail .svc3-box-k{
  color: rgba(55,68,112,.82);
}
.svc3-modal-card.detail .svc3-box-k i{
  color: #6b7fd9;
}
.svc3-box-k{ display:flex; align-items:center; gap:8px; font-size: 12px; font-weight: 700; color: rgba(11,18,32,.78); }
.svc3-box-v{ margin-top: 6px; font-size: 13px; color: rgba(11,18,32,.80); line-height: 1.6; }

.svc3-seg-grid{
  margin-top: 10px;
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap:10px;
}
@media (max-width: 900px){
  .svc3-seg-grid{ grid-template-columns: 1fr; }
}
.svc3-seg-card{
  border: 1px solid rgba(15,23,42,.10);
  border-radius: 14px;
  background: #fff;
  overflow:hidden;
}
.svc3-modal-card.detail .svc3-seg-card{
  background: linear-gradient(145deg, rgba(255,255,255,.98), rgba(232,244,255,.9));
  border: 1px solid rgba(168,185,255,.4);
  box-shadow: 0 14px 24px rgba(167,196,255,.2);
}
.svc3-seg-h{
  padding: 8px 10px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-bottom: 1px solid rgba(15,23,42,.08);
}
.svc3-modal-card.detail .svc3-seg-h{
  background: linear-gradient(90deg, rgba(255,238,247,.7), rgba(232,244,255,.7));
  border-bottom: 1px solid rgba(168,185,255,.35);
}
.svc3-modal-card.detail .svc3-seg-h .t{
  color: #3a4b7a;
}
.svc3-modal-card.detail .svc3-seg-h .t i{
  color: #7a8fe6;
}
.svc3-modal-card.detail .svc3-seg-b b{
  color: #2f4a74;
}
.svc3-modal-card.detail .svc3-price-strong{
  color: #2f5f88;
  background: none;
  -webkit-text-fill-color: initial;
}
.svc3-seg-h .t{ display:flex; align-items:center; gap:8px; font-weight: 700; font-size: 12px; }
.svc3-seg-b{ padding: 10px; display:grid; gap:8px; }
.svc3-seg-b .row{ display:flex; justify-content:space-between; gap:10px; font-size: 13px; }

/* Form modal */
.svc3-form-grid{
  display:grid;
  grid-template-columns: 1.7fr 3fr;
  gap: 12px;
}
@media (max-width: 1000px){
  .svc3-form-grid{ grid-template-columns: 1fr; }
}
.svc3-form-card{
  border: 1px solid rgba(15,23,42,.10);
  border-radius: 16px;
  background: rgba(255,255,255,.75);
  box-shadow: var(--sh2);
  overflow:hidden;
}
.svc3-form-title{
  padding: 10px 12px;
  display:flex;
  align-items:center;
  gap:10px;
  font-weight: 700;
  font-size: 13px;
  border-bottom: 1px solid rgba(15,23,42,.08);
  background: rgba(15,23,42,.02);
}
.svc3-form-title i{
  width:28px; height:28px;
  border-radius: 12px;
  display:grid; place-items:center;
  background: rgba(15,23,42,.06);
}

.svc3-field{ display:grid; gap:6px; margin: 10px 12px; }
.svc3-field label{
  font-size: 12px;
  font-weight: 650;
  color: rgba(11,18,32,.80);
  display:flex; align-items:center; gap:8px;
}
.svc3-field input,
.svc3-field textarea{
  border: 1px solid rgba(15,23,42,.12);
  border-radius: 12px;
  background: #fff;
  padding: 9px 10px;
  font-size: 13px;
  font-weight: 550;
  outline:none;
  transition: var(--t);
  color: #000;
}
.svc3-switch{
  display:inline-flex;
  align-items:center;
  gap:10px;
  cursor:pointer;
  user-select:none;
}
.svc3-switch input{
  position:absolute;
  opacity:0;
  pointer-events:none;
}
.svc3-slider{
  width:46px;
  height:26px;
  border-radius:999px;
  background: rgba(15,23,42,.2);
  position:relative;
  transition: var(--t);
  box-shadow: inset 0 2px 6px rgba(15,23,42,.2);
}
.svc3-slider::after{
  content:"";
  position:absolute;
  top:3px;
  left:3px;
  width:20px;
  height:20px;
  border-radius:50%;
  background:#fff;
  box-shadow: 0 6px 12px rgba(0,0,0,.18);
  transition: var(--t);
}
.svc3-switch input:checked + .svc3-slider{
  background: linear-gradient(135deg,#22c55e 0%, #16a34a 100%);
}
.svc3-switch input:checked + .svc3-slider::after{
  transform: translateX(20px);
}
.svc3-switch-text{
  font-weight: 650;
  color: rgba(15,23,42,.7);
  transition: var(--t);
}
.svc3-switch-text.on{
  color: #0f172a;
}
.svc3-field input:focus,
.svc3-field textarea:focus{
  border-color: rgba(102,126,234,.45);
  box-shadow: 0 0 0 4px rgba(102,126,234,.12);
}
.svc3-colorpick{ display:flex; align-items:center; gap:10px; }
.svc3-colorinput{
  width:44px; height:34px;
  border-radius: 12px;
  border: 2px solid #fff;
  padding:0;
  background: transparent;
  box-shadow: 0 10px 18px rgba(0,0,0,.10);
}

.svc3-note{
  margin: 10px 12px 0;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid rgba(102,126,234,.16);
  background: rgba(102,126,234,.06);
  font-size: 12px;
  color: rgba(11,18,32,.78);
}

/* ===== Segment edit (pro compact columns) ===== */
.svc3-seg-edit-list.compact{
  margin: 10px 12px 12px;
  border: 1px solid rgba(15,23,42,.10);
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
}
.svc3-seg-cols{
  display:grid;
  grid-template-columns: 1fr 1fr 1fr 44px;
  gap: 8px;
  padding: 10px 10px;
  background: var(--gd);
  color: rgba(255,255,255,.94);
  font-size: 11px;
  letter-spacing: .55px;
  text-transform: uppercase;
  font-weight: 650;
}
.svc3-seg-cols .act{ text-align:right; }

.svc3-seg-row{
  display:grid;
  grid-template-columns: 1fr 1fr 1fr 44px;
  gap: 8px;
  padding: 10px 10px;
  border-top: 1px solid rgba(15,23,42,.08);
  align-items:center;
  position: relative;
}
.svc3-seg-row input{
  height: 34px;
  border: 1px solid rgba(15,23,42,.12);
  border-radius: 12px;
  padding: 0 10px;
  font-size: 13px;
  outline:none;
  transition: var(--t);
  background: #fff;
}
.svc3-seg-row input:focus{
  border-color: rgba(102,126,234,.45);
  box-shadow: 0 0 0 4px rgba(102,126,234,.12);
}
.svc3-seg-row.err{
  background: rgba(255,88,88,.06);
}
.svc3-err2{
  grid-column: 1 / -1;
  margin-top: 2px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255,88,88,.10);
  border: 1px solid rgba(255,88,88,.20);
  color: rgba(11,18,32,.86);
  display:flex;
  gap:8px;
  align-items:center;
  font-size: 12px;
}

@media (max-width: 900px){
  .svc3-seg-cols,
  .svc3-seg-row{
    grid-template-columns: 1fr;
  }
  .svc3-seg-cols .act{ display:none; }
}

/* ===== TOAST ===== */
.svc3-toast-wrap{
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 90;
  display:grid;
  gap:8px;
}
.svc3-toast{
  width: 320px;
  border-radius: 16px;
  padding: 10px 12px;
  display:flex;
  gap:10px;
  color:#fff;
  border: 1px solid rgba(255,255,255,.20);
  box-shadow: 0 18px 34px rgba(0,0,0,.22);
  animation: in .18s ease;
}
@keyframes in{ from{ opacity:0; transform: translateX(14px);} to{ opacity:1; transform: translateX(0);} }
.svc3-toast.success{ background: var(--g3); }
.svc3-toast.error{ background: linear-gradient(135deg,#ff5858 0%, #f09819 100%); }
.svc3-toast.info{ background: var(--g4); }
.svc3-toast .tt{ font-weight: 750; font-size: 12px; }
.svc3-toast .tx{
  margin-top: 2px;
  font-size: 12px;
  opacity: .92;
  white-space: nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
}
@media (max-width: 640px){
  .svc3-toast{ width: calc(100vw - 28px); }
  .svc3-input{ min-width: 100%; }
}
.svc3-status{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:4px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:600;
  line-height:1;
  white-space:nowrap;
}

.svc3-status.on{
  color:#16a34a;
  background:rgba(34,197,94,.12);
  border:1px solid rgba(34,197,94,.25);
}

.svc3-status.off{
  color:#64748b;
  background:rgba(148,163,184,.12);
  border:1px solid rgba(148,163,184,.25);
}
.svc3-range-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
}

.svc3-range-box {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.svc3-range-box.min {
  border-left: 4px solid #38bdf8; /* blue */
}

.svc3-range-box.max {
  border-left: 4px solid #f59e0b; /* amber */
}

.svc3-range-box .lb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.svc3-range-box .val {
  margin-top: 4px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

</style>
