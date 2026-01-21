<template>
  <div class="ui-page">
    <!-- TOPBAR -->
    <div class="topbar">
      <div class="brand">
        <div class="brand-ico">
          <i class="fa-solid fa-file-signature"></i>
        </div>
        <div class="min-w-0">
          <div class="brand-title">Quản lý Hợp đồng</div>
          <div class="brand-sub">Upgrade Demo UI • Responsive • Không sửa HĐ • Có xem chi tiết</div>
        </div>
      </div>

      <div class="top-actions">
        <button class="btn ghost" @click="seedMock">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span class="hidden sm:inline">Tạo dữ liệu mẫu</span>
          <span class="sm:hidden">Mock</span>
        </button>

        <button class="btn ghost" @click="resetContractForm">
          <i class="fa-solid fa-broom"></i>
          <span class="hidden sm:inline">Tạo mới form</span>
          <span class="sm:hidden">Form</span>
        </button>

        <button class="btn primary" @click="openModal('modalContract')">
          <i class="fa-solid fa-plus"></i>
          <span>Thêm hợp đồng</span>
        </button>
      </div>
    </div>

    <!-- TABS -->
    <div class="tabs-shell">
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 1 }" @click="activeTab = 1">
          <i class="fa-solid fa-layer-group"></i>
          Danh sách & thao tác
          <span class="pill">{{ filteredContracts.length }}</span>
        </div>

        <div class="tab" :class="{ active: activeTab === 2 }" @click="activeTab = 2">
          <i class="fa-solid fa-chart-line"></i>
          Thống kê
          <span class="pill">0</span>
        </div>
      </div>

      <!-- PANEL TAB 1 -->
      <div class="panel attached" v-show="activeTab === 1">
        <div class="panel-h">
          <div class="tools">
            <div class="input">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input v-model="searchQuery" type="text" placeholder="Tìm theo mã HĐ / khách / người tạo...">
            </div>

            <div class="select">
              <label>Dịch vụ</label>
              <select v-model="filterService">
                <option value="">Tất cả</option>
                <option v-for="service in serviceOptions" :key="service.id || service.name" :value="service.name">{{ service.name }}</option>
              </select>
            </div>

            <div class="select">
              <label>Trạng thái</label>
              <select v-model="filterStatus">
                <option value="">Tất cả</option>
                <option value="DANG_HIEU_LUC">DANG_HIEU_LUC</option>
                <option value="HOAN_TAT">HOAN_TAT</option>
                <option value="HUY">HUY</option>
              </select>
            </div>

            <div class="tools-actions">
              <button class="btn ghost" @click="resetFilters">
                <i class="fa-solid fa-rotate"></i>
                Reset lọc
              </button>
            </div>
          </div>
        </div>

        <div class="panel-b">
          <!-- KPIs -->
          <div class="kpi-row">
            <div class="kpi">
              <div class="k"><span class="dot"></span>Tổng hợp đồng</div>
              <div class="v price p4">{{ filteredContracts.length }}</div>
            </div>
            <div class="kpi">
              <div class="k"><span class="dot"></span>Tổng thực thu</div>
              <div class="v price p3">{{ formatMoney(totalThucThu) }}</div>
            </div>
            <div class="kpi">
              <div class="k"><span class="dot"></span>Tổng điều chỉnh</div>
              <div class="v price p2">{{ formatMoney(totalDieuChinh) }}</div>
            </div>
            <div class="kpi">
              <div class="k"><span class="dot"></span>Tổng doanh thu (min)</div>
              <div class="v price p1">{{ formatMoney(totalDoanhThu) }}</div>
            </div>
          </div>

          <div class="table-wrap">
            <div class="table-scroll">
              <table>
                <thead>
                <tr>
                  <th style="width:150px">Mã HĐ</th>
                  <th>Khách hàng</th>
                  <th style="width:260px">Dịch vụ</th>
                  <th style="width:140px">Giá sau giảm</th>
                  <th style="width:140px">Thực thu</th>
                  <th style="width:140px">Doanh thu</th>
                  <th style="width:120px">Trạng thái</th>
                  <th style="width:120px">Ngày ký</th>
                  <th style="width:230px">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="filteredContracts.length === 0">
                  <td colspan="9">
                    <div class="text-center py-10">
                      <div class="mx-auto w-12 h-12 rounded-2xl grid place-items-center text-white shadow-lg" style="background: var(--primary-gradient);">
                        <i class="fa-solid fa-face-smile"></i>
                      </div>
                      <div class="mt-3 font-extrabold">Chưa có dữ liệu</div>
                      <div class="mt-2 muted">File upgrade đã có sẵn 3 hợp đồng mẫu. Nếu bạn xoá hết, hãy bấm "Tạo dữ liệu mẫu".</div>
                    </div>
                  </td>
                </tr>
                <tr v-for="contract in filteredContracts" :key="contract.id">
                  <td>
                    <div class="font-extrabold mono">{{ contract.maHopDong }}</div>
                    <div class="muted tiny">ID KH: {{ contract.maKhachHang }}</div>
                  </td>
                  <td>
                    <div class="font-bold">{{ contract.tenKhachHang }}</div>
                    <div class="muted tiny">Tạo: {{ contract.ngayTao }}</div>
                  </td>
                  <td>
                    <div class="font-extrabold">{{ contract.tenDichVu }}</div>
                    <div class="muted tiny">Giá gốc: <span class="mono">{{ formatMoney(contract.giaDichVuGoc) }}</span></div>
                  </td>
                  <td>
                    <div class="price p4">{{ formatMoney(contract.giaSauGiam) }}</div>
                  </td>
                  <td>
                    <div class="price p3">{{ formatMoney(calcThucThu(contract)) }}</div>
                  </td>
                  <td>
                    <div class="price p1">{{ formatMoney(calcDoanhThu(contract)) }}</div>
                  </td>
                  <td>
                      <span v-if="contract.trangThaiHopDong === 'DANG_HIEU_LUC'" class="status st-on">
                        <i class="fa-solid fa-circle"></i>Đang hiệu lực
                      </span>
                    <span v-else-if="contract.trangThaiHopDong === 'HOAN_TAT'" class="status st-done">
                        <i class="fa-solid fa-circle"></i>Hoàn tất
                      </span>
                    <span v-else-if="contract.trangThaiHopDong === 'HUY'" class="status st-cancel">
                        <i class="fa-solid fa-circle"></i>Đã hủy
                      </span>
                  </td>
                  <td class="mono">{{ contract.ngayKy }}</td>
                  <td>
                    <div class="actions">
                      <div class="icon-btn icon-view" title="Xem chi tiết" @click="openDetail(contract)">
                        <i class="fa-solid fa-eye"></i>
                      </div>
                      <div class="icon-btn icon-pay" title="Đóng phí" @click="openPay(contract)">
                        <i class="fa-solid fa-circle-dollar-to-slot"></i>
                      </div>
                      <div class="icon-btn icon-refund" title="Hoàn phí" @click="openRefund(contract)">
                        <i class="fa-solid fa-arrow-rotate-left"></i>
                      </div>
                      <div class="icon-btn icon-adjust" title="Điều chỉnh" @click="openAdjust(contract)">
                        <i class="fa-solid fa-sliders"></i>
                      </div>
                      <div class="icon-btn icon-del" title="Xóa" @click="openDelete(contract)">
                        <i class="fa-solid fa-trash"></i>
                      </div>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- PANEL TAB 2 -->
      <div class="panel attached" v-show="activeTab === 2">
        <div class="panel-h">
          <div class="panel-title">
            <i class="fa-solid fa-chart-simple"></i>
            Thống kê (để trống)
          </div>
        </div>
        <div class="panel-b">
          <div class="text-center py-16">
            <div class="mx-auto w-12 h-12 rounded-2xl grid place-items-center text-white shadow-lg"
                 style="background: var(--info-gradient);">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <div class="mt-3 font-extrabold">Tab thống kê</div>
            <div class="mt-2 muted">Bạn yêu cầu để trống. Khi cần mình làm dashboard Chart.js sau.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST -->
    <div class="toast-wrap">
      <div class="toast" :class="toast.type" v-if="showToast" @click="showToast = false">
        <div class="mt-0.5">
          <i :class="toast.icon"></i>
        </div>
        <div class="min-w-0">
          <div class="tt">{{ toast.title }}</div>
          <div class="tx">{{ toast.text }}</div>
        </div>
        <div class="x ml-auto">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>
    </div>

    <!-- MODAL: CREATE CONTRACT -->
    <div class="modal" :class="{ show: showModal === 'modalContract' }" @click.self="closeModal('modalContract')">
      <div class="modal-card detail contract-modal">
        <div class="modal-h">
          <div class="modal-title">
            <i class="fa-solid fa-file-circle-plus"></i>
            <span>Thêm hợp đồng</span>
          </div>
          <button class="x" @click="closeModal('modalContract')" title="Đóng">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-b">
          <div class="form-grid form-grid--contract">
            <div class="card">
              <div class="card-h">
                <i class="fa-solid fa-file-lines icon-tone tone-sky"></i>
                Thông tin hợp đồng
              </div>

              <div class="section-title">
                <i class="fa-solid fa-user"></i>
                Thông tin khách
              </div>

              <div class="customer-search grid grid-cols-1 md:grid-cols-2 gap-3 px-3 pb-2">
                <div class="field !m-0">
                <label class="field-label">
                  <span class="label-ico tone-lilac"><i class="fa-solid fa-magnifying-glass"></i></span>
                  <span>Tìm khách theo tên</span>
                </label>
                <input v-model="customerSearch" type="text" placeholder="Nhập tên khách hàng để tìm...">

                <div class="search-results" v-if="customerSearchResults.length">
                  <div v-for="customer in customerSearchResults" :key="customer.id" class="customer-result" @click="selectCustomer(customer)">
                    <div class="customer-avatar sm">{{ initials(customer.name) }}</div>
                    <div class="cr-main">
                      <div class="customer-name">{{ customer.name }}</div>
                      <div class="customer-phone"><i class="fa-solid fa-phone me-1"></i>{{ customer.phone }}</div>
                    </div>
                  </div>
                </div>
                <div v-else-if="customerSearchLoading" class="search-results empty">
                  <div class="customer-result muted">
                    <div class="cr-main">
                      <div class="customer-name">Đang tìm khách hàng...</div>
                      <div class="customer-phone">Vui lòng chờ</div>
                    </div>
                  </div>
                </div>
                <div v-else-if="customerSearchError && customerSearch.trim()" class="search-results empty">
                  <div class="customer-result muted">
                    <div class="cr-main">
                      <div class="customer-name">{{ customerSearchError }}</div>
                      <div class="customer-phone">Thử nhập tên khác.</div>
                    </div>
                  </div>
                </div>

                <div v-if="selectedCustomer" class="selected-customer">
                  <div class="customer-avatar">{{ initials(selectedCustomer.name) }}</div>
                  <div class="min-w-0">
                    <div class="customer-name">{{ selectedCustomer.name }}</div>
                    <div class="customer-phone"><i class="fa-solid fa-phone me-1"></i>{{ selectedCustomer.phone }}</div>
                  </div>
                  <button class="clear-btn" type="button" @click="clearSelectedCustomer">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
                <div class="field !m-0" style="max-height: 50px !important;">
                  <label class="field-label">
                    <span class="label-ico tone-emerald"><i class="fa-solid fa-phone"></i></span>
                    <span>Số điện thoại</span>
                  </label>
                  <input :value="selectedCustomer?.phone || ''" type="text" readonly>
                </div>
              </div>
              <div class="section-title">
                <i class="fa-solid fa-briefcase"></i>
                Dịch vụ & giá trị
              </div>

              <div class="field">
                <label class="field-label">
                  <span class="label-ico tone-indigo"><i class="fa-solid fa-list"></i></span>
                  <span>Dịch vụ</span>
                </label>
                <select v-model="newContract.serviceId">
                  <option v-for="service in serviceOptions" :key="service.id || service.name" :value="service.id || service.name">
                    {{ service.name }}
                  </option>
                </select>
                <div class="muted tiny">Dịch vụ lấy từ hệ thống, giá gốc dựa theo phân khúc.</div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 px-3 pb-2">
                <div class="field !m-0">
                  <label class="field-label">
                    <span class="label-ico tone-teal"><i class="fa-solid fa-building"></i></span>
                    <span>Giá trị tài sản chấp nhận ký bán</span>
                  </label>
                  <input v-model.number="newContract.giaTriTaiSan" type="number" min="0" placeholder="VD: 1500000000">
                  <div class="muted tiny">Nhập giá trị tài sản để xác định phân khúc.</div>
                </div>

                <div class="field !m-0">
                  <label class="field-label">
                    <span class="label-ico tone-orange"><i class="fa-solid fa-money-bill-wave"></i></span>
                    <span>Giá gốc</span>
                  </label>
                  <input :value="formatMoney(newContract.giaDichVuGoc)" type="text" readonly>
                  <div class="muted tiny">&nbsp;</div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 px-3 pb-2">
                <div class="field !m-0">
                  <label class="field-label">
                    <span class="label-ico tone-pink"><i class="fa-solid fa-tags"></i></span>
                    <span>Giảm giá</span><div class="discount-toggle">
                    <button type="button" :class="{ active: newContract.discountMode === 'MONEY' }" @click="setDiscountMode('MONEY')">
                      <i class="fa-solid fa-money-bill-wave"></i>
                      Tiền
                    </button>
                    <button type="button" :class="{ active: newContract.discountMode === 'PERCENT' }" @click="setDiscountMode('PERCENT')">
                      <i class="fa-solid fa-percent"></i>
                      %
                    </button>
                  </div>
                  </label>
                  <div class="discount-input">

                    <div class="discount-value">
                      <input
                        v-model.number="newContract.discountValue"
                        type="number"
                        :min="newContract.discountMode === 'PERCENT' ? 0 : 1"
                        :max="newContract.discountMode === 'PERCENT' ? 100 : (newContract.giaDichVuGoc || 0)"
                        :placeholder="newContract.discountMode === 'PERCENT' ? 'VD: 10' : 'VD: 1000000'"
                        @input="updateGiaSauGiam"
                      >
                      <span class="discount-suffix">{{ newContract.discountMode === 'PERCENT' ? '%' : '₫' }}</span>
                    </div>
                  </div>
                  <div class="muted tiny">
                    {{ newContract.discountMode === 'PERCENT'
                      ? 'Giới hạn 0 - 100%.' : 'Giới hạn > 0 và không vượt quá giá gốc.' }}
                  </div>
                </div>

                <div class="field !m-0">
                  <label class="field-label" style="margin-top: 7px !important;">
                    <span class="label-ico tone-purple"><i class="fa-solid fa-circle-dollar-to-slot"></i></span>
                    <span>Giá sau giảm</span>
                  </label>
                  <input style="margin-top: 6px !important;" :value="formatMoney(newContract.giaSauGiam)" type="text" readonly >
                  <div class="muted tiny">&nbsp;</div>
                </div>
              </div>

              <div class="segment-hint" v-if="segmentHint">
                <i class="fa-solid fa-circle-info"></i>
                {{ segmentHint }}
              </div>

              <div class="section-title">
                <i class="fa-solid fa-wallet"></i>
                Tuỳ chọn thanh toán ban đầu
              </div>

              <div class="px-3 pb-2">
                <div class="plan" id="planWrap">
                  <div class="plan-item" :class="{ active: newContract.initPlan === 'COC' }" @click="newContract.initPlan = 'COC'; updateFirstPayment()">
                    <div class="plan-ico"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                    <div class="min-w-0">
                      <div class="plan-tt">Cọc (%)</div>
                    </div>
                  </div>

                  <div class="plan-item" :class="{ active: newContract.initPlan === 'FULL' }" @click="newContract.initPlan = 'FULL'; updateFirstPayment()">
                    <div class="plan-ico"><i class="fa-solid fa-circle-check"></i></div>
                    <div class="min-w-0">
                      <div class="plan-tt">Đóng tất</div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-3" :class="newContract.initPlan === 'COC' ? 'md:grid-cols-3' : 'md:grid-cols-2'">
                  <div v-if="newContract.initPlan === 'COC'" class="field !m-0">
                    <label class="field-label">
                      <span class="label-ico tone-gold"><i class="fa-solid fa-percent"></i></span>
                      <span>% cọc</span>
                    </label>
                    <input v-model.number="newContract.tiLeCoc" type="number" min="0" max="100" placeholder="VD: 30"
                           :disabled="newContract.initPlan === 'FULL'" @input="updateFirstPayment">
                    <div class="muted tiny">Chỉ dùng khi chọn Cọc (%).</div>
                  </div>

                  <div class="field !m-0">
                    <label class="field-label">
                      <span class="label-ico tone-cyan"><i class="fa-solid fa-money-check-dollar"></i></span>
                      <span>Tiền thanh toán</span>
                    </label>
                    <input :value="formatMoney(firstPaymentAmount)" type="text" readonly>
                    <div class="muted tiny">Tự tính theo lựa chọn phía trên.</div>
                  </div>

                  <div class="field !m-0">
                    <label class="field-label">
                      <span class="label-ico tone-forest"><i class="fa-solid fa-credit-card"></i></span>
                      <span>Hình thức</span>
                    </label>
                    <select v-model="newContract.firstMethod">
                      <option value="CHUYEN_KHOAN">Chuyển khoản</option>
                      <option value="TIEN_MAT">Tiền mặt</option>
                    </select>
                    <div class="muted tiny">&nbsp;</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-f">
          <button class="btn ghost" @click="closeModal('modalContract')">
            <i class="fa-solid fa-ban"></i> Hủy
          </button>
          <button class="btn primary" @click="saveContract">
            <i class="fa-solid fa-floppy-disk"></i> Lưu hợp đồng
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: PAY -->
    <div class="modal" :class="{ show: showModal === 'modalPay' }" @click.self="closeModal('modalPay')">
      <div class="modal-card">
        <div class="modal-h">
          <div class="modal-title">
            <i class="fa-solid fa-circle-dollar-to-slot"></i>
            Đóng phí
          </div>
          <button class="x" @click="closeModal('modalPay')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-b">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div class="card">
              <div class="card-h"><i class="fa-solid fa-receipt"></i> Thông tin đợt đóng</div>
              <div class="field">
                <label><i class="fa-solid fa-money-bill"></i> Số tiền đóng</label>
                <input v-model.number="payment.amount" type="number" placeholder="VD: 3000000">
              </div>
              <div class="field">
                <label><i class="fa-solid fa-credit-card"></i> Hình thức thanh toán</label>
                <select v-model="payment.method">
                  <option value="TIEN_MAT">TIEN_MAT</option>
                  <option value="CHUYEN_KHOAN">CHUYEN_KHOAN</option>
                  <option value="QR">QR</option>
                  <option value="KHAC">KHAC</option>
                </select>
              </div>
              <div class="field">
                <label><i class="fa-solid fa-calendar-day"></i> Ngày đóng tiền</label>
                <input v-model="payment.date" type="date">
              </div>
              <div class="field">
                <label><i class="fa-solid fa-note-sticky"></i> Ghi chú</label>
                <input v-model="payment.note" type="text" placeholder="VD: Đợt 2">
              </div>
            </div>

            <div class="card">
              <div class="card-h"><i class="fa-solid fa-circle-info"></i> Tóm tắt hợp đồng</div>
              <div class="p-3">
                <div class="text-sm font-extrabold">{{ currentContract?.maHopDong }} • {{ currentContract?.tenKhachHang }}</div>
                <div class="muted tiny mt-1">{{ currentContract?.tenDichVu }} • Ngày ký {{ currentContract?.ngayKy }} • Trạng thái {{ getStatusText(currentContract?.trangThaiHopDong) }}</div>

                <div class="grid grid-cols-2 gap-2 mt-3">
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá điều chỉnh</div>
                    <div class="v price p2">{{ formatMoney(calcGiaDieuChinh(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Thực thu</div>
                    <div class="v price p3">{{ formatMoney(calcThucThu(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Doanh thu (min)</div>
                    <div class="v price p1">{{ formatMoney(calcDoanhThu(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Còn thiếu</div>
                    <div class="v price p4">{{ formatMoney(Math.max(0, calcGiaDieuChinh(currentContract) - calcThucThu(currentContract))) }}</div>
                  </div>
                </div>

                <div class="note mt-3">
                  <b>Lưu ý:</b> Đóng phí sẽ làm tăng <span class="mono">Thực thu</span>.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-f">
          <button class="btn ghost" @click="closeModal('modalPay')">
            <i class="fa-solid fa-ban"></i> Hủy
          </button>
          <button class="btn primary" @click="savePayment">
            <i class="fa-solid fa-check"></i> Xác nhận đóng
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: REFUND -->
    <div class="modal" :class="{ show: showModal === 'modalRefund' }" @click.self="closeModal('modalRefund')">
      <div class="modal-card">
        <div class="modal-h">
          <div class="modal-title">
            <i class="fa-solid fa-arrow-rotate-left"></i>
            Hoàn phí
          </div>
          <button class="x" @click="closeModal('modalRefund')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-b">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div class="card">
              <div class="card-h"><i class="fa-solid fa-reply"></i> Thông tin hoàn</div>
              <div class="field">
                <label><i class="fa-solid fa-money-bill-transfer"></i> Số tiền hoàn</label>
                <input v-model.number="refund.amount" type="number" placeholder="VD: 500000">
              </div>
              <div class="field">
                <label><i class="fa-solid fa-calendar-day"></i> Ngày hoàn</label>
                <input v-model="refund.date" type="date">
              </div>
              <div class="field">
                <label><i class="fa-solid fa-clipboard"></i> Lý do hoàn</label>
                <textarea v-model="refund.reason" placeholder="VD: Khách huỷ 1 phần..."></textarea>
              </div>
            </div>

            <div class="card">
              <div class="card-h"><i class="fa-solid fa-circle-info"></i> Tóm tắt hợp đồng</div>
              <div class="p-3">
                <div class="text-sm font-extrabold">{{ currentContract?.maHopDong }} • {{ currentContract?.tenKhachHang }}</div>
                <div class="muted tiny mt-1">{{ currentContract?.tenDichVu }} • Ngày ký {{ currentContract?.ngayKy }} • Trạng thái {{ getStatusText(currentContract?.trangThaiHopDong) }}</div>

                <div class="grid grid-cols-2 gap-2 mt-3">
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá điều chỉnh</div>
                    <div class="v price p2">{{ formatMoney(calcGiaDieuChinh(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Thực thu</div>
                    <div class="v price p3">{{ formatMoney(calcThucThu(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Doanh thu (min)</div>
                    <div class="v price p1">{{ formatMoney(calcDoanhThu(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Còn thiếu</div>
                    <div class="v price p4">{{ formatMoney(Math.max(0, calcGiaDieuChinh(currentContract) - calcThucThu(currentContract))) }}</div>
                  </div>
                </div>

                <div class="note mt-3">
                  <b>Lưu ý:</b> Hoàn phí sẽ làm giảm <span class="mono">Thực thu</span>.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-f">
          <button class="btn ghost" @click="closeModal('modalRefund')">
            <i class="fa-solid fa-ban"></i> Hủy
          </button>
          <button class="btn primary" @click="saveRefund">
            <i class="fa-solid fa-check"></i> Xác nhận hoàn
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: ADJUST -->
    <div class="modal" :class="{ show: showModal === 'modalAdjust' }" @click.self="closeModal('modalAdjust')">
      <div class="modal-card">
        <div class="modal-h">
          <div class="modal-title">
            <i class="fa-solid fa-sliders"></i>
            Điều chỉnh hợp đồng
          </div>
          <button class="x" @click="closeModal('modalAdjust')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-b">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div class="card">
              <div class="card-h"><i class="fa-solid fa-pen-to-square"></i> Thông tin điều chỉnh</div>

              <div class="field">
                <label><i class="fa-solid fa-coins"></i> Số tiền điều chỉnh</label>
                <input v-model.number="adjustment.amount" type="number" placeholder="VD: -500000 hoặc 300000">
                <div class="muted tiny">Âm = giảm thêm • Dương = phụ thu / phạt</div>
              </div>

              <div class="field">
                <label><i class="fa-solid fa-layer-group"></i> Loại điều chỉnh</label>
                <select v-model="adjustment.type">
                  <option value="GIAM_GIA">GIAM_GIA</option>
                  <option value="PHU_THU">PHU_THU</option>
                  <option value="PHAT">PHAT</option>
                </select>
              </div>

              <div class="field">
                <label><i class="fa-solid fa-clipboard"></i> Lý do</label>
                <textarea v-model="adjustment.reason" placeholder="VD: Phạt trễ tiến độ..."></textarea>
              </div>
            </div>

            <div class="card">
              <div class="card-h"><i class="fa-solid fa-circle-info"></i> Tác động sau điều chỉnh</div>
              <div class="p-3">
                <div class="text-sm font-extrabold">{{ currentContract?.maHopDong }} • {{ currentContract?.tenKhachHang }}</div>
                <div class="muted tiny mt-1">{{ currentContract?.tenDichVu }} • Ngày ký {{ currentContract?.ngayKy }} • Trạng thái {{ getStatusText(currentContract?.trangThaiHopDong) }}</div>

                <div class="grid grid-cols-2 gap-2 mt-3">
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá trị tài sản</div>
                    <div class="v price p4">{{ formatMoney(currentContract?.giaTriTaiSan || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá gốc</div>
                    <div class="v price p2">{{ formatMoney(currentContract?.giaDichVuGoc || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá chốt</div>
                    <div class="v price p4">{{ formatMoney(currentContract?.giaSauGiam || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Tổng điều chỉnh</div>
                    <div class="v price p2">{{ formatMoney(calcTongDieuChinh(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá điều chỉnh</div>
                    <div class="v price p2">{{ formatMoney(calcGiaDieuChinh(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Doanh thu (min)</div>
                    <div class="v price p1">{{ formatMoney(calcDoanhThu(currentContract)) }}</div>
                  </div>
                </div>

                <div class="note mt-3">
                  <b>Gợi ý:</b> Nếu điều chỉnh âm làm "Giá điều chỉnh" thấp hơn "Thực thu", bạn đang thu dư → có thể cần hoàn.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-f">
          <button class="btn ghost" @click="closeModal('modalAdjust')">
            <i class="fa-solid fa-ban"></i> Hủy
          </button>
          <button class="btn primary" @click="saveAdjustment">
            <i class="fa-solid fa-check"></i> Xác nhận điều chỉnh
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: DETAIL -->
    <div class="modal" :class="{ show: showModal === 'modalDetail' }" @click.self="closeModal('modalDetail')">
      <div class="modal-card detail">
        <div class="modal-h">
          <div class="modal-title">
            <i class="fa-solid fa-file-lines"></i>
            <span>Chi tiết hợp đồng {{ currentContract?.maHopDong }}</span>
          </div>
          <button class="x" @click="closeModal('modalDetail')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-b">
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div class="card xl:col-span-1">
              <div class="card-h"><i class="fa-solid fa-circle-info"></i> Thông tin hợp đồng</div>

              <div class="p-3">
                <div class="text-sm font-extrabold">{{ currentContract?.maHopDong }} • {{ currentContract?.tenKhachHang }}</div>
                <div class="muted tiny mt-1">{{ currentContract?.tenDichVu }} • Ngày ký {{ currentContract?.ngayKy }} • Trạng thái {{ getStatusText(currentContract?.trangThaiHopDong) }}</div>

                <div class="grid grid-cols-2 gap-2 mt-3">
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá chốt</div>
                    <div class="v price p4">{{ formatMoney(currentContract?.giaSauGiam || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá điều chỉnh</div>
                    <div class="v price p2">{{ formatMoney(calcGiaDieuChinh(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Thực thu</div>
                    <div class="v price p3">{{ formatMoney(calcThucThu(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Doanh thu</div>
                    <div class="v price p1">{{ formatMoney(calcDoanhThu(currentContract)) }}</div>
                  </div>
                </div>

                <div class="note mt-3">
                  <b>Lưu ý:</b> Đây là màn hình chỉ xem. Muốn thao tác thì dùng các nút ở bảng.
                </div>
              </div>
            </div>

            <div class="card xl:col-span-2">
              <div class="card-h"><i class="fa-solid fa-layer-group"></i> Lịch sử phát sinh</div>

              <div class="p-3">
                <!-- Payments -->
                <div class="font-extrabold mb-2 flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full" style="background: var(--success-gradient);"></span>
                  Đóng phí
                </div>
                <div class="table-wrap mb-4">
                  <div class="table-scroll">
                    <table style="min-width: 860px">
                      <thead>
                      <tr>
                        <th style="width:190px">Ngày</th>
                        <th style="width:160px">Số tiền</th>
                        <th style="width:160px">Hình thức</th>
                        <th>Ghi chú</th>
                        <th style="width:160px">Người ghi nhận</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-if="!currentContract?.dotDongTien?.length">
                        <td colspan="5">
                          <div class="text-center py-6 muted">Chưa có đợt đóng phí.</div>
                        </td>
                      </tr>
                      <tr v-for="payment in currentContract?.dotDongTien || []" :key="payment.id">
                        <td class="mono">{{ payment.ngayDongTien || '-' }}</td>
                        <td class="mono">{{ formatMoney(payment.soTienDong) }}</td>
                        <td class="mono">{{ payment.hinhThucThanhToan || '-' }}</td>
                        <td>{{ payment.ghiChu || '' }}</td>
                        <td class="mono">{{ payment.nguoiGhiNhan || '-' }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Refunds -->
                <div class="font-extrabold mb-2 flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full" style="background: var(--secondary-gradient);"></span>
                  Hoàn phí
                </div>
                <div class="table-wrap mb-4">
                  <div class="table-scroll">
                    <table style="min-width: 860px">
                      <thead>
                      <tr>
                        <th style="width:190px">Ngày</th>
                        <th style="width:160px">Số tiền</th>
                        <th>Lý do</th>
                        <th style="width:160px">Người duyệt</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-if="!currentContract?.hoanTien?.length">
                        <td colspan="4">
                          <div class="text-center py-6 muted">Chưa có đợt hoàn phí.</div>
                        </td>
                      </tr>
                      <tr v-for="refund in currentContract?.hoanTien || []" :key="refund.id">
                        <td class="mono">{{ refund.ngayHoan || '-' }}</td>
                        <td class="mono">{{ formatMoney(refund.soTienHoan) }}</td>
                        <td>{{ refund.lyDoHoan || '' }}</td>
                        <td class="mono">{{ refund.nguoiDuyet || '-' }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Adjust -->
                <div class="font-extrabold mb-2 flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full" style="background: var(--warning-gradient);"></span>
                  Điều chỉnh
                </div>
                <div class="table-wrap">
                  <div class="table-scroll">
                    <table style="min-width: 860px">
                      <thead>
                      <tr>
                        <th style="width:210px">Ngày</th>
                        <th style="width:160px">Số tiền</th>
                        <th style="width:160px">Loại</th>
                        <th>Lý do</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-if="!currentContract?.dieuChinh?.length">
                        <td colspan="4">
                          <div class="text-center py-6 muted">Chưa có điều chỉnh.</div>
                        </td>
                      </tr>
                      <tr v-for="adj in currentContract?.dieuChinh || []" :key="adj.id">
                        <td class="mono">{{ adj.ngayTao || '-' }}</td>
                        <td class="mono">{{ formatMoney(adj.soTienDieuChinh) }}</td>
                        <td class="mono">{{ adj.loaiDieuChinh || '-' }}</td>
                        <td>{{ adj.lyDo || '' }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="note mt-3">
                  <b>Mẹo:</b> Nếu bạn muốn hiển thị "đợt" theo thứ tự, cứ sort theo ngày hoặc theo index trong mảng.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-f">
          <button class="btn ghost" @click="closeModal('modalDetail')">
            <i class="fa-solid fa-xmark"></i> Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: DELETE -->
    <div class="modal" :class="{ show: showModal === 'modalDelete' }" @click.self="closeModal('modalDelete')">
      <div class="modal-card">
        <div class="modal-h">
          <div class="modal-title">
            <i class="fa-solid fa-triangle-exclamation"></i>
            Xác nhận xóa
          </div>
          <button class="x" @click="closeModal('modalDelete')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-b">
          <div class="p-2">
            <div class="font-extrabold">Xóa hợp đồng {{ currentContract?.maHopDong }}?</div>
            <div class="muted mt-2">{{ currentContract?.tenKhachHang }} • {{ currentContract?.tenDichVu }} • Doanh thu hiện tại: {{ formatMoney(calcDoanhThu(currentContract)) }}</div>
            <div class="note mt-3">
              Xóa sẽ mất cả các đợt <b>đóng phí</b>, <b>hoàn phí</b>, <b>điều chỉnh</b> của hợp đồng này.
            </div>
          </div>
        </div>
        <div class="modal-f">
          <button class="btn ghost" @click="closeModal('modalDelete')">
            <i class="fa-solid fa-ban"></i> Hủy
          </button>
          <button class="btn danger" @click="confirmDelete">
            <i class="fa-solid fa-trash"></i> Xóa luôn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '/src/api/api.js'
import { showError, showLoading, updateAlertError, updateAlertSuccess } from '/src/assets/js/alertService.js'

export default {
  name: 'ContractManagement',

  data() {
    return {
      // Constants
      ENUM_STATUS: ['DANG_HIEU_LUC', 'HOAN_TAT', 'HUY'],
      ENUM_PAY: ['TIEN_MAT', 'CHUYEN_KHOAN', 'QR', 'KHAC'],
      ENUM_ADJ: ['GIAM_GIA', 'PHU_THU', 'PHAT'],

      // State
      activeTab: 1,
      contracts: [],
      seq: 1,
      services: [],
      segments: [],

      // Filters
      searchQuery: '',
      filterService: '',
      filterStatus: '',

      // Customer search
      customerSearch: '',
      selectedCustomer: null,
      customerSearchResults: [],
      customerSearchLoading: false,
      customerSearchError: '',
      customerSearchTimer: null,
      lastCustomerKeyword: '',
      suppressCustomerSearch: false,

      // New contract form
      newContract: {
        maHopDong: '',
        maKhachHang: '',
        tenKhachHang: '',
        tenDichVu: '',
        serviceId: null,
        giaTriTaiSan: null,
        giaDichVuGoc: 0,
        phiGiam: 0,
        discountMode: 'PERCENT',
        discountValue: 0,
        giaSauGiam: 0,
        trangThaiHopDong: 'DANG_HIEU_LUC',
        ngayKy: this.todayISO(),
        initPlan: 'COC',
        tiLeCoc: 30,
        firstMethod: 'CHUYEN_KHOAN'
      },

      // Modals
      showModal: null,
      currentContract: null,

      // Payment form
      payment: {
        amount: 0,
        method: 'CHUYEN_KHOAN',
        date: this.todayISO(),
        note: ''
      },

      // Refund form
      refund: {
        amount: 0,
        date: this.todayISO(),
        reason: ''
      },

      // Adjustment form
      adjustment: {
        amount: 0,
        type: 'GIAM_GIA',
        reason: ''
      },

      // Toast
      showToast: false,
      toast: {
        type: 'info',
        title: '',
        text: '',
        icon: 'fa-solid fa-circle-info'
      }
    }
  },

  computed: {
    filteredContracts() {
      return this.contracts.filter(contract => {
        const hay = `${contract.maHopDong} ${contract.tenKhachHang} ${contract.tenDichVu}`.toLowerCase()
        const okQ = !this.searchQuery || hay.includes(this.searchQuery.toLowerCase())
        const okSvc = !this.filterService || contract.tenDichVu === this.filterService
        const okSt = !this.filterStatus || contract.trangThaiHopDong === this.filterStatus
        return okQ && okSvc && okSt
      })
    },

    totalThucThu() {
      return this.filteredContracts.reduce((sum, c) => sum + this.calcThucThu(c), 0)
    },

    totalDieuChinh() {
      return this.filteredContracts.reduce((sum, c) => sum + this.calcTongDieuChinh(c), 0)
    },

    totalDoanhThu() {
      return this.filteredContracts.reduce((sum, c) => sum + this.calcDoanhThu(c), 0)
    },

    serviceOptions() {
      return this.services
    },

    selectedService() {
      if (!this.newContract.serviceId) return null
      return this.serviceOptions.find(s => String(s.id || s.name) === String(this.newContract.serviceId)) || null
    },

    matchingSegment() {
      const serviceId = this.newContract.serviceId
      const assetValue = Number(this.newContract.giaTriTaiSan || 0)
      if (!serviceId || assetValue <= 0) return null
      return this.segments.find(seg =>
          String(seg.serviceId) === String(serviceId) &&
          assetValue >= Number(seg.min) &&
          assetValue < Number(seg.max)
      ) || null
    },

    segmentHint() {
      if (!this.newContract.serviceId) {
        return 'Vui lòng chọn dịch vụ để hiển thị phân khúc.'
      }
      if (!this.newContract.giaTriTaiSan) {
        return 'Nhập giá trị tài sản để xác định mức giá gốc.'
      }
      if (!this.matchingSegment) {
        return 'Chưa có phân khúc phù hợp với giá trị tài sản này.'
      }
      return `Phân khúc ${this.formatMoney(this.matchingSegment.min)} → ${this.formatMoney(this.matchingSegment.max)}`
    },

    firstPaymentAmount() {
      if (this.newContract.initPlan === 'FULL') {
        return this.newContract.giaSauGiam
      } else {
        const percent = Math.max(0, Math.min(100, this.newContract.tiLeCoc || 0))
        return Math.round(this.newContract.giaSauGiam * (percent / 100))
      }
    }
  },

  watch: {
    customerSearch(val) {
      if (this.suppressCustomerSearch) return

      if (this.selectedCustomer && (val || '').trim() === (this.selectedCustomer.name || '').trim()) {
        this.customerSearchResults = []
        this.customerSearchLoading = false
        this.customerSearchError = ''
        return
      }

      if (this.selectedCustomer && (val || '').trim() !== (this.selectedCustomer?.name || '').trim()) {
        this.selectedCustomer = null
        this.newContract.maKhachHang = ''
        this.newContract.tenKhachHang = ''
      }

      this.clearCustomerSearchTimer()

      const k = (val || '').trim()
      if (!k) {
        this.lastCustomerKeyword = ''
        this.customerSearchResults = []
        this.customerSearchError = ''
        this.customerSearchLoading = false
        return
      }

      this.customerSearchTimer = setTimeout(() => {
        this.fetchCustomerSearch(k)
      }, 250)
    },

    'newContract.serviceId'() {
      this.updateServicePrice()
    },

    'newContract.giaTriTaiSan'() {
      this.updateGiaGocFromAsset()
    },

    'newContract.discountMode'() {
      this.updateGiaSauGiam()
    }
  },

  methods: {
    // Helper functions
    formatMoney(n) {
      const x = Math.round(Number(n || 0))
      const sign = x < 0 ? '-' : ''
      const abs = Math.abs(x)
      return sign + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'
    },

    initials(name) {
      const parts = String(name || '')
          .trim()
          .split(/\s+/)
          .filter(Boolean)
      if (parts.length === 0) return 'NA'
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    },

    getStatusText(status) {
      switch(status) {
        case 'DANG_HIEU_LUC': return 'Đang hiệu lực'
        case 'HOAN_TAT': return 'Hoàn tất'
        case 'HUY': return 'Đã hủy'
        default: return status
      }
    },

    todayISO() {
      const d = new Date()
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    },

    randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },

    randPriceForService(serviceName) {
      const svc = this.serviceOptions.find(s => s.name === serviceName) || this.serviceOptions[0]
      if (!svc) return 0
      const min = Number(svc.minPrice ?? svc.min ?? 0)
      const max = Number(svc.maxPrice ?? svc.max ?? min)
      if (!min || !max) return 0
      const step = 250000
      const raw = this.randInt(min, max)
      return Math.round(raw / step) * step
    },

    pad4(n) {
      return String(n).padStart(4, '0')
    },

    async fetchServices() {
      try {
        const res = await api.get('/dich-vu-thg/admin', {
          params: {
            keyword: null
          }
        })
        this.services = res.data || []
      } catch (e) {
        console.error('❌ Lỗi fetch services', e)
        this.services = []
      }
    },

    async fetchSegments() {
      try {
        const res = await api.get('/dich-vu-thg/admin/phan-khuc')
        this.segments = res.data || []
      } catch (e) {
        console.error('❌ Lỗi fetch segments', e)
        this.segments = []
      }
    },

    getServiceById(serviceId) {
      return this.serviceOptions.find(s => String(s.id || s.name) === String(serviceId)) || null
    },

    getSegmentsByService(serviceId) {
      return this.segments
          .filter(seg => String(seg.serviceId) === String(serviceId))
          .sort((a, b) => Number(a.min) - Number(b.min))
    },

    findSegmentForAsset(serviceId, assetValue) {
      if (!serviceId || !assetValue) return null
      const segments = this.getSegmentsByService(serviceId)
      return segments.find(seg =>
          assetValue >= Number(seg.min) && assetValue < Number(seg.max)
      ) || null
    },

    genContractCode() {
      const y = new Date().getFullYear()
      return `HD-${y}-${this.pad4(this.seq++)}`
    },

    // Calculation functions
    calcTongDong(c) {
      return (c?.dotDongTien || []).reduce((sum, x) => sum + (Number(x.soTienDong) || 0), 0)
    },

    calcTongHoan(c) {
      return (c?.hoanTien || []).reduce((sum, x) => sum + (Number(x.soTienHoan) || 0), 0)
    },

    calcTongDieuChinh(c) {
      return (c?.dieuChinh || []).reduce((sum, x) => sum + (Number(x.soTienDieuChinh) || 0), 0)
    },

    calcThucThu(c) {
      return this.calcTongDong(c) - this.calcTongHoan(c)
    },

    calcGiaDieuChinh(c) {
      return (Number(c?.giaSauGiam) || 0) + this.calcTongDieuChinh(c)
    },

    calcDoanhThu(c) {
      return Math.min(this.calcGiaDieuChinh(c), this.calcThucThu(c))
    },

    // Toast
    showToastMessage(type, title, text) {
      this.toast = {
        type,
        title,
        text,
        icon: type === 'success' ? 'fa-solid fa-circle-check' :
            type === 'error' ? 'fa-solid fa-triangle-exclamation' :
                'fa-solid fa-circle-info'
      }
      this.showToast = true
      setTimeout(() => {
        this.showToast = false
      }, 3000)
    },

    // Modal control
    openModal(modal) {
      this.showModal = modal
    },

    closeModal(modal) {
      this.resetContractForm()
      if (this.showModal === modal) {
        this.showModal = null
      }
    },

    // Contract management
    resetContractForm() {
      const firstService = this.serviceOptions[0] || null
      this.newContract = {
        maHopDong: this.genContractCode(),
        maKhachHang: '',
        tenKhachHang: '',
        tenDichVu: firstService?.name || '',
        serviceId: firstService?.id || firstService?.name || null,
        giaTriTaiSan: null,
        giaDichVuGoc: 0,
        phiGiam: 0,
        discountMode: 'PERCENT',
        discountValue: 0,
        giaSauGiam: 0,
        trangThaiHopDong: 'DANG_HIEU_LUC',
        ngayKy: this.todayISO(),
        initPlan: 'COC',
        tiLeCoc: 30,
        firstMethod: 'CHUYEN_KHOAN'
      }
      this.customerSearch = ''
      this.selectedCustomer = null
      this.customerSearchResults = []
      this.customerSearchError = ''
      this.customerSearchLoading = false
      this.updateServicePrice()
      this.showToastMessage('info', 'Tạo mới form', 'Đã reset form hợp đồng.')
    },

    updateServicePrice() {
      const service = this.getServiceById(this.newContract.serviceId)
      this.newContract.tenDichVu = service?.name || ''
      this.updateGiaGocFromAsset()
    },

    updateGiaGocFromAsset() {
      const assetValue = Number(this.newContract.giaTriTaiSan || 0)
      const segment = this.findSegmentForAsset(this.newContract.serviceId, assetValue)
      if (segment) {
        this.newContract.giaDichVuGoc = Number(segment.price || 0)
      } else {
        this.newContract.giaDichVuGoc = 0
      }
      this.updateGiaSauGiam()
    },

    setDiscountMode(mode) {
      this.newContract.discountMode = mode
    },

    updateGiaSauGiam() {
      const giaGoc = Number(this.newContract.giaDichVuGoc || 0)
      if (this.newContract.discountMode === 'PERCENT') {
        const percent = Math.max(0, Math.min(100, Number(this.newContract.discountValue || 0)))
        this.newContract.discountValue = percent
        this.newContract.phiGiam = Math.round(giaGoc * (percent / 100))
      } else {
        const money = Number(this.newContract.discountValue || 0)
        const clamped = Math.max(0, Math.min(giaGoc, money))
        this.newContract.discountValue = clamped
        this.newContract.phiGiam = clamped
      }
      this.newContract.giaSauGiam = Math.max(0, giaGoc - (this.newContract.phiGiam || 0))
      this.updateFirstPayment()
    },

    updateFirstPayment() {
      // Handled by computed property
    },

    clearSelectedCustomer() {
      this.selectedCustomer = null
      this.customerSearch = ''
      this.customerSearchResults = []
      this.customerSearchError = ''
      this.customerSearchLoading = false
      this.newContract.maKhachHang = ''
      this.newContract.tenKhachHang = ''
    },

    async fetchCustomerSearch(keyword) {
      const k = (keyword || '').trim()
      if (!k) {
        this.customerSearchResults = []
        this.customerSearchError = ''
        return
      }

      if (k === this.lastCustomerKeyword) return
      this.lastCustomerKeyword = k

      this.customerSearchLoading = true
      this.customerSearchError = ''

      try {
        const qs = new URLSearchParams({ keyword: k }).toString()
        const res = await api.get(`/customer-crm/admin/lich-hen/search-customer?${qs}`)
        const data = await res.data
        this.customerSearchResults = (Array.isArray(data) ? data : []).slice(0, 8).map((x) => ({
          id: x.customerId,
          name: x.customerName,
          phone: x.phone,
          raw: x
        }))
      } catch (e) {
        this.customerSearchResults = []
        this.customerSearchError = 'Không tìm thấy hoặc lỗi tải dữ liệu.'
      } finally {
        this.customerSearchLoading = false
      }
    },

    clearCustomerSearchTimer() {
      if (this.customerSearchTimer) clearTimeout(this.customerSearchTimer)
      this.customerSearchTimer = null
    },

    selectCustomer(customer) {
      this.suppressCustomerSearch = true
      this.clearCustomerSearchTimer()
      this.customerSearchLoading = false
      this.customerSearchError = ''
      this.customerSearchResults = []

      this.selectedCustomer = customer
      this.customerSearch = customer.name
      this.newContract.maKhachHang = customer.id
      this.newContract.tenKhachHang = customer.name
      if (customer?.raw?.giaTriTaiSan !== undefined && customer?.raw?.giaTriTaiSan !== null) {
        this.newContract.giaTriTaiSan = Number(customer.raw.giaTriTaiSan || 0)
      }

      setTimeout(() => {
        this.suppressCustomerSearch = false
      }, 0)
    },

    async saveContract() {
      this.updateGiaSauGiam()
      if (!this.selectedCustomer) {
        showError('Thiếu dữ liệu', 'Bạn cần chọn khách hàng từ danh sách.')
        return
      }

      if (!this.newContract.tenDichVu) {
        showError('Thiếu dữ liệu', 'Bạn cần chọn Dịch vụ.')
        return
      }

      if (!this.newContract.giaTriTaiSan) {
        showError('Thiếu dữ liệu', 'Bạn cần nhập giá trị tài sản.')
        return
      }

      if (!this.newContract.giaDichVuGoc) {
        showError('Thiếu dữ liệu', 'Giá gốc chưa xác định theo phân khúc.')
        return
      }

      if (this.newContract.discountMode === 'MONEY' && this.newContract.discountValue <= 0) {
        showError('Giảm giá không hợp lệ', 'Giảm giá tiền phải > 0 và không vượt quá giá gốc.')
        return
      }

      const payload = {
        maKhachHang: this.newContract.maKhachHang,
        giaTriKyBan: this.newContract.giaTriTaiSan,
        giaDichVuGoc: this.newContract.giaDichVuGoc,
        phiGiam: this.newContract.phiGiam || 0,
        giaSauGiam: this.newContract.giaSauGiam,
        hinhThucThanhToan: this.newContract.firstMethod,
        serviceId: this.newContract.serviceId,
        soTienThanhToan: this.firstPaymentAmount,
        initPlan: this.newContract.initPlan
      }

      try {
        const res = await showLoading(api.post('/hop-dong/admin/create', payload))
        const created = res?.data || {}
        const hasPayments = Array.isArray(created.dotDongTien) && created.dotDongTien.length > 0
        const contract = {
          id: created.id || crypto.randomUUID(),
          maHopDong: created.maHopDong || this.newContract.maHopDong,
          maKhachHang: created.maKhachHang ?? this.newContract.maKhachHang,
          tenKhachHang: created.tenKhachHang || this.newContract.tenKhachHang,
          tenDichVu: created.tenDichVu || this.newContract.tenDichVu,
          serviceId: created.serviceId ?? this.newContract.serviceId,
          giaTriTaiSan: created.giaTriKyBan ?? created.giaTriTaiSan ?? this.newContract.giaTriTaiSan,
          giaDichVuGoc: created.giaDichVuGoc ?? this.newContract.giaDichVuGoc,
          phiGiam: created.phiGiam ?? this.newContract.phiGiam ?? 0,
          giaSauGiam: created.giaSauGiam ?? this.newContract.giaSauGiam,
          trangThaiHopDong: created.trangThaiHopDong ?? this.newContract.trangThaiHopDong,
          ngayKy: created.ngayKy ?? this.newContract.ngayKy ?? this.todayISO(),
          ngayTao: created.ngayTao ?? new Date().toLocaleString('vi-VN'),
          dotDongTien: hasPayments ? created.dotDongTien : [],
          hoanTien: created.hoanTien || [],
          dieuChinh: created.dieuChinh || [],
          initPlan: created.initPlan ?? this.newContract.initPlan,
          tiLeCoc: created.tiLeCoc ?? (this.newContract.initPlan === 'COC' ? (this.newContract.tiLeCoc || 0) : null)
        }

        if (!hasPayments && this.firstPaymentAmount > 0) {
          contract.dotDongTien.push({
            id: crypto.randomUUID(),
            soTienDong: this.firstPaymentAmount,
            hinhThucThanhToan: this.newContract.firstMethod,
            ngayDongTien: contract.ngayKy,
            ghiChu: this.newContract.initPlan === 'FULL' ?
                'Thanh toán đủ (tạo khi lập HĐ)' :
                `Cọc ${this.newContract.tiLeCoc || 0}% (tạo khi lập HĐ)`,
            nguoiGhiNhan: 'demo_admin',
            ngayTao: new Date().toLocaleString('vi-VN')
          })
        }

        this.contracts.unshift(contract)
        updateAlertSuccess('Đã tạo hợp đồng',
            `${contract.maHopDong} • ${this.newContract.initPlan === 'FULL' ? 'Đóng tất' : 'Cọc'}: ${this.formatMoney(this.firstPaymentAmount)}`)
        this.closeModal('modalContract')

      } catch (error) {
        console.error('❌ Lỗi tạo hợp đồng', error)
        updateAlertError('Tạo hợp đồng thất bại', 'Vui lòng thử lại sau.')
      }
    },

    // Payment management
    openPay(contract) {
      this.currentContract = contract
      this.payment = {
        amount: 0,
        method: 'CHUYEN_KHOAN',
        date: this.todayISO(),
        note: ''
      }
      this.openModal('modalPay')
    },

    savePayment() {
      if (this.payment.amount <= 0) {
        this.showToastMessage('error', 'Số tiền không hợp lệ', 'Số tiền đóng phải > 0.')
        return
      }

      const contractIndex = this.contracts.findIndex(c => c.id === this.currentContract.id)
      if (contractIndex === -1) return

      this.contracts[contractIndex].dotDongTien.push({
        id: crypto.randomUUID(),
        soTienDong: this.payment.amount,
        hinhThucThanhToan: this.payment.method,
        ngayDongTien: this.payment.date || this.todayISO(),
        ghiChu: this.payment.note,
        nguoiGhiNhan: 'demo_admin',
        ngayTao: new Date().toLocaleString('vi-VN')
      })

      this.showToastMessage('success', 'Đóng phí thành công', `+${this.formatMoney(this.payment.amount)} (${this.payment.method})`)
      this.closeModal('modalPay')
    },

    // Refund management
    openRefund(contract) {
      this.currentContract = contract
      this.refund = {
        amount: 0,
        date: this.todayISO(),
        reason: ''
      }
      this.openModal('modalRefund')
    },

    saveRefund() {
      if (this.refund.amount <= 0) {
        this.showToastMessage('error', 'Số tiền không hợp lệ', 'Số tiền hoàn phải > 0.')
        return
      }

      if (!this.refund.reason) {
        this.showToastMessage('error', 'Thiếu lý do', 'Bạn cần nhập lý do hoàn.')
        return
      }

      const contractIndex = this.contracts.findIndex(c => c.id === this.currentContract.id)
      if (contractIndex === -1) return

      this.contracts[contractIndex].hoanTien.push({
        id: crypto.randomUUID(),
        soTienHoan: this.refund.amount,
        lyDoHoan: this.refund.reason,
        ngayHoan: this.refund.date || this.todayISO(),
        nguoiDuyet: 'demo_ke_toan',
        ngayTao: new Date().toLocaleString('vi-VN')
      })

      this.showToastMessage('success', 'Hoàn phí thành công', `-${this.formatMoney(this.refund.amount)}`)
      this.closeModal('modalRefund')
    },

    // Adjustment management
    openAdjust(contract) {
      this.currentContract = contract
      this.adjustment = {
        amount: 0,
        type: 'GIAM_GIA',
        reason: ''
      }
      this.openModal('modalAdjust')
    },

    saveAdjustment() {
      if (this.adjustment.amount === 0) {
        this.showToastMessage('error', 'Số tiền không hợp lệ', 'Điều chỉnh phải khác 0 (âm hoặc dương).')
        return
      }

      if (!this.ENUM_ADJ.includes(this.adjustment.type)) {
        this.showToastMessage('error', 'Loại điều chỉnh sai', 'Chọn GIAM_GIA/PHU_THU/PHAT.')
        return
      }

      if (!this.adjustment.reason) {
        this.showToastMessage('error', 'Thiếu lý do', 'Bạn cần nhập lý do điều chỉnh.')
        return
      }

      const contractIndex = this.contracts.findIndex(c => c.id === this.currentContract.id)
      if (contractIndex === -1) return

      this.contracts[contractIndex].dieuChinh.push({
        id: crypto.randomUUID(),
        soTienDieuChinh: this.adjustment.amount,
        loaiDieuChinh: this.adjustment.type,
        lyDo: this.adjustment.reason,
        ngayTao: new Date().toLocaleString('vi-VN')
      })

      this.showToastMessage('success', 'Điều chỉnh thành công',
          `${this.adjustment.amount > 0 ? '+' : ''}${this.formatMoney(this.adjustment.amount)} (${this.adjustment.type})`)
      this.closeModal('modalAdjust')
    },

    // Detail view
    openDetail(contract) {
      this.currentContract = contract
      this.openModal('modalDetail')
    },

    // Delete management
    openDelete(contract) {
      this.currentContract = contract
      this.openModal('modalDelete')
    },

    confirmDelete() {
      this.contracts = this.contracts.filter(c => c.id !== this.currentContract.id)
      this.showToastMessage('success', 'Đã xóa', `Đã xóa ${this.currentContract.maHopDong}`)
      this.closeModal('modalDelete')
    },

    // Filters
    resetFilters() {
      this.searchQuery = ''
      this.filterService = ''
      this.filterStatus = ''
      this.showToastMessage('info', 'Đã reset lọc', 'Hiển thị toàn bộ hợp đồng.')
    },

    // Seed data
    seedMock() {
      const names = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C', 'Phạm Minh D', 'Võ Thúy E', 'Đặng Quốc F']
      const serviceList = this.serviceOptions

      if (!serviceList.length) {
        this.showToastMessage('error', 'Thiếu dữ liệu', 'Chưa tải được danh sách dịch vụ.')
        return
      }

      for (let i = 0; i < 5; i++) {
        const service = serviceList[this.randInt(0, serviceList.length - 1)]
        const segments = this.getSegmentsByService(service.id || service.name)
        const pickedSegment = segments.length ? segments[this.randInt(0, segments.length - 1)] : null
        const segmentMin = pickedSegment ? Number(pickedSegment.min) : 0
        const segmentMax = pickedSegment ? Number(pickedSegment.max) : 0
        const assetValue = pickedSegment
            ? this.randInt(segmentMin, Math.max(segmentMin + 1, segmentMax - 1))
            : this.randInt(500000000, 5000000000)
        const giaGoc = pickedSegment ? Number(pickedSegment.price || 0) : this.randPriceForService(service.name)
        const phiGiam = [0, 200000, 500000, 1000000, 1500000][this.randInt(0, 4)]
        const giaSau = Math.max(0, giaGoc - phiGiam)

        const st = this.ENUM_STATUS[this.randInt(0, 2)]
        const ky = new Date()
        ky.setDate(ky.getDate() - this.randInt(0, 25))
        const ngayKy = ky.toISOString().slice(0, 10)

        const contract = {
          id: crypto.randomUUID(),
          maHopDong: this.genContractCode(),
          maKhachHang: this.randInt(1001, 2000),
          tenKhachHang: names[this.randInt(0, names.length - 1)],
          tenDichVu: service.name,
          serviceId: service.id || service.name,
          giaTriTaiSan: assetValue,
          giaDichVuGoc: giaGoc,
          phiGiam,
          giaSauGiam: giaSau,
          trangThaiHopDong: st,
          ngayKy,
          ngayTao: new Date().toLocaleString('vi-VN'),
          dotDongTien: [],
          hoanTien: [],
          dieuChinh: [],
          initPlan: 'COC',
          tiLeCoc: 30
        }

        // Initial deposit
        const deposit = Math.round(giaSau * 0.3)
        contract.dotDongTien.push({
          id: crypto.randomUUID(),
          soTienDong: deposit,
          hinhThucThanhToan: this.ENUM_PAY[this.randInt(0, 3)],
          ngayDongTien: ngayKy,
          ghiChu: 'Cọc 30% (mock)',
          nguoiGhiNhan: 'demo_admin',
          ngayTao: new Date().toLocaleString('vi-VN')
        })

        // Random extra payments
        const extraPay = this.randInt(0, 2)
        for (let k = 0; k < extraPay; k++) {
          contract.dotDongTien.push({
            id: crypto.randomUUID(),
            soTienDong: this.randInt(200000, Math.max(300000, Math.round(giaSau * 0.35))),
            hinhThucThanhToan: this.ENUM_PAY[this.randInt(0, 3)],
            ngayDongTien: this.todayISO(),
            ghiChu: `Đợt ${k + 2} (mock)`,
            nguoiGhiNhan: 'demo_admin',
            ngayTao: new Date().toLocaleString('vi-VN')
          })
        }

        // Random refund (10% chance)
        if (Math.random() < 0.10) {
          contract.hoanTien.push({
            id: crypto.randomUUID(),
            soTienHoan: this.randInt(100000, 800000),
            lyDoHoan: 'Hoàn một phần (mock)',
            ngayHoan: this.todayISO(),
            nguoiDuyet: 'demo_ke_toan',
            ngayTao: new Date().toLocaleString('vi-VN')
          })
        }

        // Random adjustment (25% chance)
        if (Math.random() < 0.25) {
          const sign = Math.random() < 0.55 ? -1 : 1
          const amt = sign * this.randInt(200000, 1200000)
          const type = sign < 0 ? 'GIAM_GIA' : (Math.random() < 0.5 ? 'PHU_THU' : 'PHAT')

          contract.dieuChinh.push({
            id: crypto.randomUUID(),
            soTienDieuChinh: amt,
            loaiDieuChinh: type,
            lyDo: sign < 0 ? 'Giảm thêm (mock)' : 'Phụ thu/Phạt (mock)',
            ngayTao: new Date().toLocaleString('vi-VN')
          })
        }

        this.contracts.unshift(contract)
      }

      this.showToastMessage('success', 'Mock dữ liệu', 'Đã tạo thêm 5 hợp đồng mẫu.')
    },

    // Initialize sample data
    init3Samples() {
      const serviceList = this.serviceOptions
      const findService = (name) => serviceList.find(s => s.name === name) || serviceList[0] || null
      const base = [
        {
          maKhachHang: 1001,
          tenKhachHang: 'Nguyễn Văn A',
          tenDichVu: 'Thiết kế UI Website',
          phiGiam: 1000000,
          trangThaiHopDong: 'DANG_HIEU_LUC',
          ngayKy: this.todayISO(),
          initPlan: 'COC',
          tiLeCoc: 30
        },
        {
          maKhachHang: 1020,
          tenKhachHang: 'Trần Thị B',
          tenDichVu: 'SEO & Tối ưu Onpage',
          phiGiam: 0,
          trangThaiHopDong: 'HOAN_TAT',
          ngayKy: this.todayISO(),
          initPlan: 'FULL',
          tiLeCoc: null
        },
        {
          maKhachHang: 1108,
          tenKhachHang: 'Lê Hoàng C',
          tenDichVu: 'Branding / Bộ nhận diện',
          phiGiam: 1500000,
          trangThaiHopDong: 'DANG_HIEU_LUC',
          ngayKy: this.todayISO(),
          initPlan: 'COC',
          tiLeCoc: 40
        }
      ]

      this.contracts = base.map((x) => {
        const service = findService(x.tenDichVu)
        const segments = service ? this.getSegmentsByService(service.id || service.name) : []
        const pickedSegment = segments.length ? segments[0] : null
        const assetValue = pickedSegment
            ? Math.round((Number(pickedSegment.min) + Number(pickedSegment.max)) / 2)
            : this.randInt(500000000, 5000000000)
        const giaGoc = pickedSegment ? Number(pickedSegment.price || 0) : this.randPriceForService(x.tenDichVu)
        const giaSau = Math.max(0, giaGoc - (x.phiGiam || 0))
        const code = this.genContractCode()

        const contract = {
          id: crypto.randomUUID(),
          maHopDong: code,
          maKhachHang: x.maKhachHang,
          tenKhachHang: x.tenKhachHang,
          tenDichVu: service?.name || x.tenDichVu,
          serviceId: service?.id || service?.name || null,
          giaTriTaiSan: assetValue,
          giaDichVuGoc: giaGoc,
          phiGiam: x.phiGiam || 0,
          giaSauGiam: giaSau,
          trangThaiHopDong: x.trangThaiHopDong,
          ngayKy: x.ngayKy,
          ngayTao: new Date().toLocaleString('vi-VN'),
          dotDongTien: [],
          hoanTien: [],
          dieuChinh: [],
          initPlan: x.initPlan,
          tiLeCoc: x.tiLeCoc
        }

        // Initial payment
        let amount = 0
        if (x.initPlan === 'FULL') amount = giaSau
        else amount = Math.round(giaSau * ((x.tiLeCoc || 30) / 100))

        contract.dotDongTien.push({
          id: crypto.randomUUID(),
          soTienDong: amount,
          hinhThucThanhToan: 'CHUYEN_KHOAN',
          ngayDongTien: x.ngayKy,
          ghiChu: x.initPlan === 'FULL'
              ? 'Thanh toán đủ (mẫu)'
              : `Cọc ${x.tiLeCoc || 30}% (mẫu)`,
          nguoiGhiNhan: 'demo_admin',
          ngayTao: new Date().toLocaleString('vi-VN')
        })

        // Add extra payment if HOAN_TAT and not FULL
        if (x.trangThaiHopDong === 'HOAN_TAT' && x.initPlan !== 'FULL') {
          const remain = Math.max(0, giaSau - amount)
          if (remain > 0) {
            contract.dotDongTien.push({
              id: crypto.randomUUID(),
              soTienDong: remain,
              hinhThucThanhToan: 'CHUYEN_KHOAN',
              ngayDongTien: x.ngayKy,
              ghiChu: 'Đóng nốt (mẫu)',
              nguoiGhiNhan: 'demo_admin',
              ngayTao: new Date().toLocaleString('vi-VN')
            })
          }
        }

        return contract
      })
    }
  },

  async mounted() {
    await Promise.all([this.fetchServices(), this.fetchSegments()])
    this.init3Samples()
    this.resetContractForm()
  }
}
</script>

<style scoped>
/* CSS styles from original file - với chỉnh sửa cho 5 nút thao tác */
.ui-page{
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --success-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  --warning-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  --danger-gradient: linear-gradient(135deg, #ff5858 0%, #f09819 100%);
  --info-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --dark-gradient: linear-gradient(135deg, #141e30 0%, #243b55 100%);
  --light-gradient: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);

  --primary-color: #667eea;
  --secondary-color: #f093fb;
  --success-color: #43e97b;
  --warning-color: #fa709a;
  --danger-color: #ff5858;
  --info-color: #4facfe;
  --dark-color: #141e30;
  --light-color: #f8f9fa;

  --card: rgba(255,255,255,.92);
  --card2: rgba(255,255,255,.86);
  --text: #0b1220;
  --muted: rgba(11,18,32,.62);
  --line: rgba(20,30,48,.12);
  --line2: rgba(20,30,48,.08);

  --r: 18px;
  --r2: 14px;
  --sh: 0 18px 40px rgba(20,30,48,.12);
  --sh2: 0 12px 26px rgba(20,30,48,.10);
  --t: all .18s cubic-bezier(.4,0,.2,1);

  min-height: 92vh;
  color: var(--text);
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background:
      radial-gradient(1200px 700px at 12% 6%, rgba(102,126,234,.18), transparent 60%),
      radial-gradient(900px 650px at 88% 0%, rgba(240,147,251,.16), transparent 58%),
      radial-gradient(1000px 750px at 70% 100%, rgba(79,172,254,.14), transparent 55%),
      linear-gradient(135deg, rgba(20,30,48,.05), rgba(20,30,48,.00));
  padding: 20px 25px;
  position: relative;
  top: -10px;
}
.muted{ color: var(--muted); }
.mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
.tiny{ font-size: 12px; }
.no-select{ user-select:none; }

/* =========================
   TOPBAR
========================= */
.topbar{
  border: 1px solid var(--line);
  border-radius: var(--r);
  box-shadow: var(--sh2);
  background: rgba(255,255,255,.66);
  backdrop-filter: blur(10px);
  padding: 12px 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.brand{ display:flex; align-items:center; gap:10px; min-width: 0; }
.brand-ico{
  width:40px; height:40px;
  border-radius: 14px;
  display:grid; place-items:center;
  color:#fff;
  background: var(--primary-gradient);
  box-shadow: 0 16px 28px rgba(102,126,234,.24);
  flex: 0 0 auto;
}
.brand-title{
  font-size: 18px;
  font-weight: 850;
  letter-spacing: .2px;
  line-height: 1.1;
  background: var(--dark-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 62vw;
}
@media (max-width: 640px){
  .brand-title{ max-width: 78vw; }
}
.brand-sub{ font-size:12px; color: rgba(11,18,32,.62); font-weight: 650; margin-top:2px; }

.top-actions{
  display:flex; align-items:center; gap:8px;
  flex-wrap: wrap;
  justify-content:flex-end;
  width: fit-content;
  margin-left: auto;
}

/* =========================
   BUTTONS
========================= */
.btn{
  height: 36px;
  padding: 0 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 760;
  display:inline-flex;
  align-items:center;
  gap:8px;
  transition: var(--t);
  position: relative;
  overflow:hidden;
  white-space: nowrap;
}
.btn:hover{ transform: translateY(-1px); filter: brightness(1.01); }
.btn:active{ transform: translateY(0px); }

.btn.primary{ background: var(--primary-gradient); color:#fff; box-shadow: 0 14px 28px rgba(102,126,234,.22); }
.btn.secondary{ background: var(--secondary-gradient); color:#fff; box-shadow: 0 14px 28px rgba(240,147,251,.20); }
.btn.ghost{
  background: rgba(20,30,48,.04);
  color: var(--text);
  border: 1px solid rgba(20,30,48,.12);
}
.btn.ghost:hover{ border-color: rgba(102,126,234,.26); background: rgba(102,126,234,.07); }
.btn.danger{ background: var(--danger-gradient); color:#fff; box-shadow: 0 14px 28px rgba(255,88,88,.18); }

/* =========================
   TABS
========================= */
.tabs-shell{ margin-top: 14px; }
.tabs{
  display:flex;
  gap: 8px;
  align-items:flex-end;
  flex-wrap: wrap;
}
.tab{
  display:flex; align-items:center; gap:10px;
  padding: 9px 12px;
  border-radius: 18px 18px 0 0;
  cursor:pointer;
  transition: var(--t);
  font-size: 13px;
  font-weight: 780;
  position: relative;
  border: 1px solid transparent;
  background: rgba(255,255,255,.35);
  backdrop-filter: blur(8px);
}
.tab i{
  width:30px; height:30px;
  border-radius: 12px;
  display:grid; place-items:center;
  background: rgba(20,30,48,.06);
  color: rgba(20,30,48,.82);
  transition: var(--t);
}
.tab:hover{ transform: translateY(-1px); }
.tab::after{
  content:"";
  position:absolute;
  left: 16px; right: 16px;
  bottom: 6px;
  height: 2px;
  border-radius: 999px;
  background: var(--info-gradient);
  transform: scaleX(0);
  transform-origin:center;
  transition: transform .18s cubic-bezier(.4,0,.2,1);
  opacity:.95;
}
.tab:hover::after{ transform: scaleX(1); }

.tab.active{
  background: var(--card);
  border-color: var(--line);
  box-shadow: none;
}
.tab.active i{ background: var(--primary-gradient); color:#fff; }

.pill{
  margin-left: 2px;
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(20,30,48,.06);
  display:inline-flex;
  align-items:center;
  justify-content:center;
  font-size: 12px;
  font-weight: 780;
}

/* =========================
   PANEL
========================= */
.panel{
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r);
  box-shadow: var(--sh);
  overflow:hidden;
  backdrop-filter: blur(10px);
}
.panel.attached{
  border-radius: 0 18px 18px 18px;
  margin-top: 0;
}
.panel-h{
  padding: 10px 12px;
  border-bottom: 1px solid var(--line2);
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:10px;
  flex-wrap: wrap;
}
.panel-title{
  display:flex;
  align-items:center;
  gap:10px;
  font-weight: 900;
  font-size: 13px;
  min-width: 240px;
}
.panel-title i{
  width:32px; height:32px;
  border-radius: 12px;
  display:grid; place-items:center;
  background: var(--dark-gradient);
  color:#fff;
  box-shadow: 0 14px 26px rgba(20,30,48,.18);
  flex: 0 0 auto;
}
.panel-b{ padding: 12px; }

/* =========================
   TOOLS / FILTERS (responsive, không tràn)
========================= */
.tools{
  display:grid;
  grid-template-columns: 1.2fr 220px 190px auto;
  gap: 10px;
  align-items:end;
  width: 100%;
  max-width: 980px;
  margin-left: auto;
}
@media (max-width: 1100px){
  .tools{ grid-template-columns: 1fr 220px 190px; }
  .tools .tools-actions{ grid-column: 1 / -1; justify-content:flex-end; }
}
@media (max-width: 720px){
  .tools{ grid-template-columns: 1fr; max-width: 100%; }
  .tools .tools-actions{ justify-content: stretch; }
  .tools .tools-actions .btn{ width: 100%; justify-content:center; }
}

.input{
  position:relative;
  width: 100%;
  min-width: 0;
}
.input i{
  position:absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: rgba(20,30,48,.55);
}
.input input{
  width:100%;
  height: 36px;
  padding: 0 10px 0 32px;
  border-radius: 12px;
  border: 1px solid rgba(20,30,48,.14);
  background: #fff;
  outline:none;
  font-size: 13px;
  font-weight: 650;
  transition: var(--t);
  color:#000;
  min-width: 0;
}
.input input:focus{
  border-color: rgba(79,172,254,.55);
  box-shadow: 0 0 0 4px rgba(79,172,254,.14);
}
.select{
  display:flex;
  flex-direction:column;
  gap:5px;
  min-width: 0;
}
.select label{
  font-size: 11px;
  color: var(--muted);
  font-weight: 850;
  margin-left: 2px;
  letter-spacing: .2px;
  text-transform: uppercase;
}
.select select{
  height:36px;
  padding: 0 10px;
  border-radius: 12px;
  border: 1px solid rgba(20,30,48,.14);
  background: #fff;
  font-size: 13px;
  font-weight: 650;
  outline:none;
  transition: var(--t);
  width: 100%;
  min-width: 0;
}
.select select:focus{
  border-color: rgba(102,126,234,.55);
  box-shadow: 0 0 0 4px rgba(102,126,234,.14);
}
.tools-actions{ display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap; }

/* =========================
   KPI
========================= */
.kpi-row{
  display:grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap:10px;
  margin-bottom: 12px;
}
@media (max-width: 980px){ .kpi-row{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 520px){ .kpi-row{ grid-template-columns: 1fr; } }
.kpi{
  border: 1px solid rgba(20,30,48,.12);
  border-radius: 14px;
  padding: 10px 12px;
  background: rgba(255,255,255,.84);
  box-shadow: 0 12px 24px rgba(20,30,48,.08);
  overflow:hidden;
}
.kpi .k{
  font-size: 11px;
  color: rgba(11,18,32,.60);
  font-weight: 900;
  letter-spacing: .3px;
  text-transform: uppercase;
  display:flex;
  gap:8px;
  align-items:center;
}
.kpi .k .dot{
  width: 8px; height: 8px; border-radius: 999px;
  background: var(--info-gradient);
  flex: 0 0 auto;
}
.kpi .v{
  margin-top: 4px;
  font-weight: 950;
  font-size: 16px;
  white-space: nowrap;
  overflow:hidden;
  text-overflow: ellipsis;
}
.price{ font-weight: 950; white-space: nowrap; }
.p1{ background: var(--primary-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.p2{ background: var(--secondary-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.p3{ background: var(--success-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.p4{ background: var(--info-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.p5{ background: var(--warning-gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }

.note{
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(102,126,234,.18);
  background: rgba(102,126,234,.07);
  font-size: 12px;
  color: rgba(11,18,32,.78);
  overflow-wrap: anywhere;
}

/* =========================
   TABLE (không tràn, có scroll ngang)
========================= */
.table-wrap{
  border: 1px solid rgba(20,30,48,.12);
  border-radius: var(--r2);
  overflow:hidden;
  background:#fff;
}
.table-scroll{
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
table{
  width: 100%;
  border-collapse: collapse;
  min-width: 1100px; /* Tăng độ rộng tối thiểu cho 5 nút */
}
thead{ background: var(--dark-gradient); }
thead th{
  color:#fff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .55px;
  text-transform: uppercase;
  padding: 10px 10px;
  text-align:left;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 5;
}
tbody td{
  padding: 10px 10px;
  border-bottom: 1px solid rgba(20,30,48,.08);
  font-size: 13px;
  vertical-align: middle;
}
tbody tr:nth-child(even){ background: rgba(20,30,48,.012); }
tbody tr:hover{ background: rgba(79,172,254,.08); }

.footnote{
  padding: 10px;
  font-size: 12px;
  color: var(--muted);
  background: rgba(20,30,48,.03);
  border-top: 1px solid rgba(20,30,48,.06);
  display:flex;
  justify-content:space-between;
  gap:10px;
  flex-wrap:wrap;
}

/* =========================
   BADGES
========================= */
.status{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:4px 10px;
  border-radius:999px;
  font-size:12px;
  font-weight:850;
  line-height:1;
  white-space:nowrap;
  border: 1px solid transparent;
}
.st-on{ color:#16a34a; background:rgba(34,197,94,.12); border-color: rgba(34,197,94,.26); }
.st-done{ color:#2563eb; background:rgba(37,99,235,.12); border-color: rgba(37,99,235,.26); }
.st-cancel{ color:#ef4444; background:rgba(239,68,68,.12); border-color: rgba(239,68,68,.26); }

/* =========================
   ACTION ICONS - chỉnh sửa cho 5 nút nằm trên 1 hàng
========================= */
.actions{
  display:flex;
  gap:4px; /* Giảm khoảng cách giữa các nút */
  align-items:center;
  flex-wrap:nowrap; /* Không cho wrap */
  min-width: 180px; /* Đảm bảo đủ chỗ cho 5 nút */
}
.icon-btn{
  width:32px; /* Giảm kích thước nút */
  height:32px; /* Giảm kích thước nút */
  border-radius: 10px; /* Giảm border-radius */
  cursor:pointer;
  display:grid;
  place-items:center;
  transition: var(--t);
  box-shadow: 0 8px 14px rgba(20,30,48,.10); /* Giảm shadow */
  border: 1px solid transparent;
  user-select: none;
  flex: 0 0 auto;
  flex-shrink: 0; /* Không cho co lại */
}
.icon-btn i{
  background: var(--ig);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  font-size: 13px; /* Giảm kích thước icon */
}
.icon-view{
  --ig: var(--info-gradient);
  background: linear-gradient(135deg, rgba(79,172,254,.18), rgba(0,242,254,.10));
}
.icon-pay{
  --ig: var(--success-gradient);
  background: linear-gradient(135deg, rgba(67,233,123,.18), rgba(56,249,215,.10));
}
.icon-refund{
  --ig: var(--secondary-gradient);
  background: linear-gradient(135deg, rgba(240,147,251,.18), rgba(245,87,108,.10));
}
.icon-adjust{
  --ig: var(--warning-gradient);
  background: linear-gradient(135deg, rgba(250,112,154,.18), rgba(254,225,64,.10));
}
.icon-del{
  --ig: var(--danger-gradient);
  background: linear-gradient(135deg, rgba(255,88,88,.18), rgba(240,152,25,.10));
}
.icon-btn:hover{ transform: translateY(-1px); filter: brightness(1.02); }
.icon-view:hover{ border-color: rgba(79,172,254,.40); box-shadow: 0 12px 20px rgba(79,172,254,.20); }
.icon-pay:hover{ border-color: rgba(67,233,123,.42); box-shadow: 0 12px 20px rgba(67,233,123,.18); }
.icon-refund:hover{ border-color: rgba(240,147,251,.42); box-shadow: 0 12px 20px rgba(245,87,108,.18); }
.icon-adjust:hover{ border-color: rgba(254,225,64,.55); box-shadow: 0 12px 20px rgba(254,225,64,.18); }
.icon-del:hover{ border-color: rgba(255,88,88,.42); box-shadow: 0 12px 20px rgba(255,88,88,.18); }

/* =========================
   MODAL
========================= */
.modal{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.55);
  backdrop-filter: blur(7px);
  z-index: 80;
  display:none;
  align-items:center;
  justify-content:center;
  padding: 16px;
}
.modal.show{ display:flex; }
.modal-card{
  width: min(980px, 100%);
  max-height: calc(100vh - 32px);
  overflow: hidden;
  background: rgba(255,255,255,.96);
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 18px;
  box-shadow: 0 34px 80px rgba(0,0,0,.32);
  animation: pop .16s ease;
  display:flex;
  flex-direction: column;
}
.modal-card.detail{
  background:
      radial-gradient(120% 120% at 0% 0%, rgba(255,214,214,.55), transparent 55%),
      radial-gradient(120% 120% at 100% 0%, rgba(206,221,255,.55), transparent 60%),
      radial-gradient(120% 120% at 100% 100%, rgba(210,255,238,.55), transparent 55%),
      linear-gradient(160deg, rgba(255,255,255,.98), rgba(255,255,255,.92));
  border: 1px solid rgba(168,185,255,.35);
  box-shadow: 0 35px 90px rgba(88,116,255,.22);
}
@keyframes pop{ from{ opacity:0; transform: translateY(10px) scale(.98);} to{ opacity:1; transform: translateY(0) scale(1);} }

.modal-h{
  padding: 12px 12px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  border-bottom: 1px solid rgba(20,30,48,.10);
  background: linear-gradient(90deg, rgba(255,224,235,.60), rgba(224,238,255,.60), rgba(226,255,244,.60));
}
.modal-title{
  display:flex;
  align-items:center;
  gap:10px;
  font-weight: 950;
  font-size: 13px;
  min-width: 0;
}
.modal-title i{
  width:32px; height:32px;
  border-radius: 12px;
  display:grid; place-items:center;
  background: var(--primary-gradient);
  color:#fff;
  box-shadow: 0 12px 22px rgba(102,126,234,.22);
  flex: 0 0 auto;
}
.x{
  width: 38px; height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(20,30,48,.12);
  background: rgba(20,30,48,.04);
  cursor:pointer;
  transition: var(--t);
  flex: 0 0 auto;
  display: grid;
  place-items: center;
}
.x:hover{ transform: translateY(-1px); background: rgba(102,126,234,.10); border-color: rgba(102,126,234,.26); }

.modal-b{
  padding: 12px;
  overflow: auto;
}
.modal-f{
  padding: 12px;
  display:flex;
  justify-content:flex-end;
  gap:8px;
  border-top: 1px solid rgba(20,30,48,.10);
  background: rgba(20,30,48,.02);
  flex-wrap: wrap;
}
@media (max-width: 520px){
  .modal-f .btn{ width: 100%; justify-content:center; }
}

/* =========================
   FORM CARDS
========================= */
.form-grid{
  display:grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 12px;
}
.form-grid.form-grid--contract{
  grid-template-columns: 1.05fr 1.2fr;
  align-items: start;
}
@media (max-width: 980px){ .form-grid{ grid-template-columns: 1fr; } }

.card{
  border: 1px solid rgba(20,30,48,.12);
  border-radius: 16px;
  background: rgba(255,255,255,.86);
  box-shadow: var(--sh2);
  overflow:hidden;
}
.card-h{
  padding: 10px 12px;
  display:flex;
  align-items:center;
  gap:10px;
  font-weight: 950;
  font-size: 13px;
  border-bottom: 1px solid rgba(20,30,48,.10);
  background: rgba(20,30,48,.03);
}
.card-h i{
  width:28px; height:28px;
  border-radius: 12px;
  display:grid; place-items:center;
  background: rgba(20,30,48,.07);
}
.card-h .icon-tone{
  color:#fff;
  box-shadow: 0 10px 18px rgba(15,23,42,.15);
}
.icon-tone.tone-sky{ background: linear-gradient(135deg, #38bdf8, #818cf8); }
.icon-tone.tone-lilac{ background: linear-gradient(135deg, #a78bfa, #f472b6); }
.icon-tone.tone-rose{ background: linear-gradient(135deg, #fb7185, #f97316); }
.icon-tone.tone-emerald{ background: linear-gradient(135deg, #22c55e, #14b8a6); }
.icon-tone.tone-amber{ background: linear-gradient(135deg, #f59e0b, #f97316); }
.icon-tone.tone-mint{ background: linear-gradient(135deg, #34d399, #06b6d4); }
.icon-tone.tone-indigo{ background: linear-gradient(135deg, #6366f1, #2563eb); }
.icon-tone.tone-teal{ background: linear-gradient(135deg, #14b8a6, #0ea5e9); }
.icon-tone.tone-orange{ background: linear-gradient(135deg, #f97316, #fb7185); }
.icon-tone.tone-pink{ background: linear-gradient(135deg, #ec4899, #f472b6); }
.icon-tone.tone-purple{ background: linear-gradient(135deg, #8b5cf6, #6366f1); }
.icon-tone.tone-gold{ background: linear-gradient(135deg, #facc15, #f59e0b); }
.icon-tone.tone-cyan{ background: linear-gradient(135deg, #22d3ee, #38bdf8); }
.icon-tone.tone-forest{ background: linear-gradient(135deg, #16a34a, #059669); }

.contract-modal{
  width: min(920px, 100%);
}
.contract-modal .modal-h{
  padding: 10px 12px;
  background: linear-gradient(90deg, rgba(255,224,235,.55), rgba(224,238,255,.55), rgba(226,255,244,.55));
}
.contract-modal .modal-b{
  padding: 10px;
}
.contract-modal .modal-f{
  padding: 10px 12px;
}
.contract-modal .form-grid{
  gap: 10px;
  grid-template-columns: 1fr;
}
.contract-modal .card{
  border-radius: 14px;
}
.contract-modal .card-h{
  padding: 8px 12px;
  font-size: 12px;
}
.contract-modal .card-h i{
  background: transparent;
  box-shadow: none;
  color: var(--tone-color, #64748b);
}
.contract-modal .icon-tone{
  color: var(--tone-color, #64748b);
  background: transparent;
  box-shadow: none;
}
.contract-modal .tone-sky{ --tone-color: #38bdf8; }
.contract-modal .tone-lilac{ --tone-color: #a78bfa; }
.contract-modal .tone-rose{ --tone-color: #fb7185; }
.contract-modal .tone-emerald{ --tone-color: #22c55e; }
.contract-modal .tone-amber{ --tone-color: #f59e0b; }
.contract-modal .tone-mint{ --tone-color: #34d399; }
.contract-modal .tone-indigo{ --tone-color: #6366f1; }
.contract-modal .tone-teal{ --tone-color: #14b8a6; }
.contract-modal .tone-orange{ --tone-color: #f97316; }
.contract-modal .tone-pink{ --tone-color: #ec4899; }
.contract-modal .tone-purple{ --tone-color: #8b5cf6; }
.contract-modal .tone-gold{ --tone-color: #f59e0b; }
.contract-modal .tone-cyan{ --tone-color: #22d3ee; }
.contract-modal .tone-forest{ --tone-color: #16a34a; }

.segment-hint{
  margin: 4px 12px 10px;
  padding: 6px 10px;
  border-radius: 12px;
  background: rgba(79,172,254,.08);
  border: 1px dashed rgba(79,172,254,.35);
  font-size: 12px;
  color: rgba(11,18,32,.78);
  display:flex;
  gap:8px;
  align-items:center;
}
.segment-hint i{ color: #4facfe; }

.section-title{
  margin: 12px 12px 6px;
  padding-top: 10px;
  border-top: 1px dashed rgba(148,163,184,.5);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: rgba(11,18,32,.72);
  display:flex;
  align-items:center;
  gap:8px;
}
.section-title i{
  color: rgba(99,102,241,.8);
}
.section-title:first-of-type{
  border-top: none;
  padding-top: 0;
}

.customer-search{ position: relative; }
.search-results{
  margin-top: 8px;
  border-radius: 12px;
  border: 1px solid rgba(20,30,48,.12);
  background: #fff;
  box-shadow: 0 14px 26px rgba(15,23,42,.08);
  max-height: 220px;
  overflow: auto;
}
.search-results.empty{ background: rgba(20,30,48,.02); }
.customer-result{
  display:flex;
  gap:10px;
  align-items:center;
  padding: 8px 10px;
  cursor:pointer;
  transition: var(--t);
}
.customer-result:hover{ background: rgba(102,126,234,.08); }
.customer-result .cr-main{ flex: 1; }
.customer-avatar{
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display:grid;
  place-items:center;
  font-weight: 800;
  color:#fff;
  background: linear-gradient(135deg, #667eea, #764ba2);
  flex: 0 0 auto;
}
.customer-avatar.sm{ width: 32px; height: 32px; font-size: 12px; }
.customer-name{ font-weight: 800; color:#0b1220; }
.customer-phone{ font-size: 12px; color:#159b7d; font-weight: 700; }
.customer-phone i{ color:#22c55e; }
.selected-customer{
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px dashed rgba(102,126,234,.35);
  background: rgba(102,126,234,.08);
  display:flex;
  gap:10px;
  align-items:center;
}
.clear-btn{
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background: rgba(255,88,88,.12);
  color: #ff5858;
  display:grid;
  place-items:center;
  cursor:pointer;
  transition: var(--t);
}
.clear-btn:hover{ transform: translateY(-1px); background: rgba(255,88,88,.2); }
.field{ display:grid; gap:6px; margin: 10px 12px; }
.contract-modal .field{
  margin: 8px 12px;
  gap: 5px;
}
.field-label{
  display:flex;
  align-items:center;
  gap:8px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .4px;
  color: rgba(11,18,32,.78);
}
.label-ico{
  width: 20px;
  height: 20px;
  display:grid;
  place-items:center;
  border-radius: 8px;
  color: var(--tone-color, #64748b);
  background: rgba(15,23,42,.04);
  font-size: 12px;
}
.contract-modal .label-ico{
  background: transparent;
  width: 18px;
  height: 18px;
  border-radius: 6px;
}
.field label{
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(11,18,32,.82);
  display:flex; align-items:center; gap:8px;
}
.field input, .field select, .field textarea{
  border: 1px solid rgba(20,30,48,.14);
  border-radius: 12px;
  background: #fff;
  padding: 9px 10px;
  font-size: 14px;
  font-weight: 500;
  outline:none;
  transition: var(--t);
  color:#000;
  width: 100%;
  min-width: 0;
}
.field textarea{ min-height: 88px; resize: vertical; }
.field input:focus, .field select:focus, .field textarea:focus{
  border-color: rgba(79,172,254,.55);
  box-shadow: 0 0 0 4px rgba(79,172,254,.14);
}

/* =========================
   RADIO PLAN (Cọc/Đóng tất)
========================= */
.plan{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 8px 12px 10px 12px;
  width: 260px;
}
@media (max-width: 640px){ .plan{ grid-template-columns: 1fr; } }
.plan-item{
  border: 1px solid rgba(20,30,48,.14);
  border-radius: 24px;
  padding: 8px 10px;
  width: 120px;
  background: rgba(255,255,255,.86);
  display:flex;
  gap:10px;
  align-items:flex-start;
  cursor:pointer;
  transition: var(--t);
}
.plan-item:hover{ transform: translateY(-1px); border-color: rgba(102,126,234,.30); box-shadow: 0 14px 24px rgba(102,126,234,.12); }
.plan-item.active{
  border-color: rgba(102,126,234,.44);
  background: rgba(102,126,234,.06);
  box-shadow: 0 14px 26px rgba(102,126,234,.14);
}
.plan-ico{
  width: 24px; height: 24px;
  border-radius: 8px;
  display:grid; place-items:center;
  color:#fff;
  background: var(--primary-gradient);
  flex: 0 0 auto;
  box-shadow: 0 14px 24px rgba(102,126,234,.18);
}
.plan-item:nth-child(2) .plan-ico{ background: var(--success-gradient); box-shadow: 0 14px 24px rgba(67,233,123,.16); }
.plan-tt{ margin-top: 5px; font-weight: 600; font-size: 14px;}
.plan-tx{ margin-top:2px; font-size: 12px; color: rgba(11,18,32,.64); font-weight: 650; }

.discount-input{
  display:grid;
  gap:8px;
}
.discount-toggle{
  display:flex;
  gap:6px;
  background: rgba(15,23,42,.04);
  border-radius: 999px;
  padding: 4px;
  width: fit-content;
}
.discount-toggle button{
  border: none;
  background: transparent;
  color: rgba(11,18,32,.7);
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  padding: 4px 10px;
  display:flex;
  align-items:center;
  gap:6px;
  cursor:pointer;
  transition: var(--t);
}
.discount-toggle button.active{
  background: rgba(102,126,234,.14);
  color: #1d4ed8;
}
.discount-value{
  position: relative;
}
.discount-value input{
  padding-right: 34px;
}
.discount-suffix{
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 800;
  color: rgba(11,18,32,.6);
}

/* =========================
   TOAST
========================= */
.toast-wrap{
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 90;
  display:grid;
  gap:8px;
}
.toast{
  width: 340px;
  border-radius: 16px;
  padding: 10px 12px;
  display:flex;
  gap:10px;
  color:#fff;
  border: 1px solid rgba(255,255,255,.22);
  box-shadow: 0 18px 34px rgba(0,0,0,.22);
  animation: in .18s ease;
  overflow:hidden;
}
@keyframes in{ from{ opacity:0; transform: translateX(14px);} to{ opacity:1; transform: translateX(0);} }
.toast.success{ background: var(--success-gradient); }
.toast.error{ background: var(--danger-gradient); }
.toast.info{ background: var(--info-gradient); }
.toast .tt{ font-weight: 950; font-size: 12px; }
.toast .tx{ margin-top: 2px; font-size: 12px; opacity: .92; white-space: nowrap; overflow:hidden; text-overflow: ellipsis; }

@media (max-width: 640px){
  .toast{ width: calc(100vw - 28px); }
}

.hidden{ display:none !important; }
</style>
