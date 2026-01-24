<template>
  <div class="topbar">
    <div class="brand">
      <div class="brand-ico">
        <i class="fa-solid fa-file-signature"></i>
      </div>
      <div class="min-w-0">
        <div class="brand-title">Quản lý Hợp đồng</div>
      </div>
    </div>
    <button
        type="button"
        class="header-menu-toggle"
        title="Ẩn/hiện menu"
        @click="sidebar.toggle()"
    >
      <i class="fa-solid fa-bars"></i>
      <span class="d-none d-md-inline">Menu</span>
    </button>
    <div class="top-actions">
      <router-link v-if="canContractSetting" class="btn ghost" to="/-thg/cau-hinh-phi-dich-vu">
        <i class="fa-solid fa-gear"></i>
        <span>Tinh chỉnh mức phí THG</span>
      </router-link>
      <div class="user-chip">
        <div class="user-meta">
          <div class="user-name">{{ info.fullName || 'Chưa có tên' }}</div>
        </div>
        <img
          v-if="info.avatarUrl"
          :src="' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + info.avatarUrl"
          alt="avatar"
          class="user-avatar"
        />
        <div v-else class="user-avatar user-avatar--fallback">
          {{ initials(info.fullName) }}
        </div>
      </div>
    </div>
  </div>

  <div class="ui-page">
    <!-- KPIs -->

    <!-- TABS -->
    <div class="tabs-shell">
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 1 }" @click="activeTab = 1">
          <i class="fa-solid fa-layer-group"></i>
          Danh sách & thao tác
          <span class="pill">{{ totalElements }}</span>
        </div>

        <div class="tab" :class="{ active: activeTab === 2 }" @click="activeTab = 2">
          <i class="fa-solid fa-chart-line"></i>
          Thống kê
          <span class="pill">0</span>
        </div>
      </div>

      <!-- PANEL TAB 1 -->
      <div class="panel attached" v-show="activeTab === 1">
        <div class="kpi-row mt-3 px-3">
          <div class="stat-card kpi-total">
            <div class="stat-card-content">
              <h5><i class="fa-solid fa-file-signature"></i> Tổng hợp đồng</h5>
              <div class="stat-number">{{ totalElements }}</div>
            </div>
            <i class="fa-solid fa-file-signature stat-icon"></i>
          </div>
          <div class="stat-card kpi-revenue">
            <div class="stat-card-content">
              <h5><i class="fa-solid fa-chart-line"></i> Tổng doanh thu</h5>
              <div class="stat-number">{{ formatTy(totalDoanhThu) }}</div>
            </div>
            <i class="fa-solid fa-chart-line stat-icon"></i>
          </div>
          <div class="stat-card kpi-adjust">
            <div class="stat-card-content">
              <h5><i class="fa-solid fa-sliders"></i> Tổng điều chỉnh</h5>
              <div class="stat-number">{{ formatTy(totalDieuChinh) }}</div>
            </div>
            <i class="fa-solid fa-sliders stat-icon"></i>
          </div>
          <div class="stat-card kpi-sales">
            <div class="stat-card-content">
              <h5><i class="fa-solid fa-sack-dollar"></i> Tổng doanh số</h5>
              <div class="stat-number">{{ formatTy(totalDoanhSo) }}</div>
            </div>
            <i class="fa-solid fa-sack-dollar stat-icon"></i>
          </div>
        </div>
        <div class="panel-h">
          <div class="tools">
            <div class="input select filter-item filter-search" :class="{ active: searchQuery }">
              <label>Tiềm kiếm</label>
              <i class="fa-solid fa-magnifying-glass mt-2"></i>
              <input v-model="searchQuery" type="text" placeholder="Tìm theo mã HĐ / khách / người tạo...">
            </div>

            <div class="select filter-item filter-service" :class="{ active: filterService }">
              <label>Dịch vụ</label>
              <select v-model="filterService">
                <option :value="null">Tất cả</option>
                <option v-for="service in serviceOptions" :key="service.id || service.name" :value="service.id || service.name">{{ service.name }}</option>
              </select>
            </div>

            <div class="select filter-item filter-status" :class="{ active: filterStatus }">
              <label>Trạng thái</label>
              <select v-model="filterStatus">
                <option :value="null">Tất cả</option>
                <option value="DANG_HIEU_LUC">Đang hiệu lực</option>
                <option value="HOAN_TAT">Hoàn tất</option>
                <option value="HUY">Đã hủy</option>
              </select>
            </div>

            <div class="input select filter-item filter-item filter-date" :class="{ active: tuNgay }">
              <label>Từ ngày</label>
              <input v-model="tuNgay" type="date">
            </div>

            <div class="input select filter-item filter-date" :class="{ active: denNgay }">
              <label>Đến ngày</label>
              <input v-model="denNgay" type="date">
            </div>
            <div class="tools-actions">
              <button class="btn primary" @click="openModal('modalContract')">
                <i class="fa-solid fa-plus"></i>
                <span>Thêm hợp đồng</span>
              </button>
            </div>
          </div>
        </div>

        <div class="panel-b">


          <div class="table-wrap">
            <div class="table-scroll">
              <table>
                <thead>
                <tr>
                  <th style="width:150px">Mã HĐ</th>
                  <th>Khách hàng</th>
                  <th style="width:220px">Dịch vụ</th>
                  <th style="width:120px">Giá tài sản</th>
                  <th style="width:160px">Giá sau giảm</th>
                  <th style="width:160px">Doanh thu</th>
                  <th style="width:180px">Doanh số</th>
                  <th style="width:120px">Trạng thái</th>
                  <th style="width:130px">Nhân viên tạo</th>
                  <th style="width:100px">Ngày tạo</th>
                  <th style="width:80px">Thao tác</th>
                </tr>
                </thead>
                <tbody>
                <tr v-if="contracts.length === 0">
                  <td colspan="11">
                    <div class="text-center py-10">
                      <div class="mx-auto w-12 h-12 rounded-2xl grid place-items-center text-white shadow-lg" style="background: var(--primary-gradient);">
                        <i class="fa-solid fa-face-smile"></i>
                      </div>
                      <div class="mt-3 font-extrabold">Chưa có dữ liệu</div>
                    </div>
                  </td>
                </tr>
                <tr v-for="contract in contracts" :key="contract.id">
                  <td>
                    <div class="font-extrabold mono">{{ contract.maHopDong }}</div>
                  </td>
                  <td>
                    <div class="font-bold">{{ contract.tenKhachHang }}</div>
                  </td>
                  <td>
                    <div class="font-extrabold">{{ contract.tenDichVu }}</div>
                    <div class="muted tiny">Giá gốc: <span class="mono">{{ formatMoney(contract.giaDichVuGoc) }}</span></div>
                  </td>
                  <td>
                    <div class="price p2">{{ formatMoney(getGiaTaiSanKy(contract)) }}</div>
                  </td>
                  <td>
                    <div class="price p4">{{ formatMoney(contract.giaSauGiam) }}</div>
                    <div class="muted tiny">Giảm: <span class="mono">{{ formatMoney(getGiaGiam(contract)) }}</span></div>
                  </td>
                  <td>
                    <div class="price p3">{{ formatMoney(getDoanhThu(contract)) }}</div>
                    <div class="muted tiny">Hoàn: <span class="mono">{{ formatMoney(getTongHoan(contract)) }}</span></div>
                  </td>
                  <td>
                    <div class="price p1">{{ formatMoney(getDoanhSo(contract)) }}</div>
                    <div class="muted tiny">ĐC: <span class="mono">{{ formatMoney(getTongDieuChinh(contract)) }}</span></div>
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
                  <td>
                    <div class="font-semibold">{{ shortenName(contract.nhanVienTao) }}</div>
                  </td>
                  <td class="mono">{{ formatCreatedAt(contract.ngayTao) }}</td>
                  <td>
                    <div class="actions" @click.stop>
                      <div class="icon-btn icon-menu" title="Tác vụ" @click.stop="toggleActionMenu(contract.id, $event)">
                        <i class="fa-solid fa-ellipsis"></i>
                      </div>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <teleport to="body">
          <div
            v-if="openActionMenu && activeActionContract"
            class="action-menu action-menu--floating"
            :style="actionMenuPositionStyle"
            @click.stop
          >
            <div class="action-item" @click="openDetail(activeActionContract); closeActionMenu()">
              <span class="icon-btn icon-view" aria-hidden="true">
                <i class="fa-solid fa-eye"></i>
              </span>
              <span class="action-label">Chi tiết</span>
            </div>
            <div
              v-if="canPayContract"
              class="action-item"
              :class="{ disabled: !isActiveContract(activeActionContract) }"
              @click="isActiveContract(activeActionContract) && (openPay(activeActionContract), closeActionMenu())"
            >
              <span class="icon-btn icon-pay" aria-hidden="true">
                <i class="fa-solid fa-circle-dollar-to-slot"></i>
              </span>
              <span class="action-label">Đóng phí</span>
            </div>
            <div
              v-if="canRefundContract"
              class="action-item"
              :class="{ disabled: !isActiveContract(activeActionContract) }"
              @click="isActiveContract(activeActionContract) && (openRefund(activeActionContract), closeActionMenu())"
            >
              <span class="icon-btn icon-refund" aria-hidden="true">
                <i class="fa-solid fa-arrow-rotate-left"></i>
              </span>
              <span class="action-label">Hoàn phí</span>
            </div>
            <div
              v-if="canAdjustContract"
              class="action-item"
              :class="{ disabled: !isActiveContract(activeActionContract) }"
              @click="isActiveContract(activeActionContract) && (openAdjust(activeActionContract), closeActionMenu())"
            >
              <span class="icon-btn icon-adjust" aria-hidden="true">
                <i class="fa-solid fa-sliders"></i>
              </span>
              <span class="action-label">Điều chỉnh</span>
            </div>
            <div v-if="canDeleteContract" class="action-item" @click="openDelete(activeActionContract); closeActionMenu()">
              <span class="icon-btn icon-del" aria-hidden="true">
                <i class="fa-solid fa-trash"></i>
              </span>
              <span class="action-label">Xóa</span>
            </div>
          </div>
        </teleport>
        <div class="pagination">
          <div class="muted tiny">
            Hiển thị {{ pageStart }}-{{ pageEnd }} / {{ totalElements }}
          </div>
          <div class="pager">
            <button class="btn ghost btn-page" :disabled="currentPage === 1" @click="prevPage">Trước</button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="btn ghost btn-page"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button class="btn ghost btn-page" :disabled="currentPage === totalPages" @click="nextPage">Sau</button>
          </div>
        </div>
      </div>

      <!-- PANEL TAB 2 -->
      <div class="panel attached" v-show="activeTab === 2">
        <ContractStatsDashboard/>
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

              <div v-if="canFullBranch" class="field">
                <label class="field-label">
                  <span class="label-ico tone-emerald"><i class="fa-solid fa-code-branch"></i></span>
                  <span>Chi nhánh</span>
                </label>
                <select v-model="newContract.branchId" :disabled="branchLoading">
                  <option v-for="branch in branchOptions" :key="branch.id" :value="branch.id">
                    {{ branch.label }}
                  </option>
                </select>
                <div class="muted tiny">Chọn chi nhánh áp dụng cho hợp đồng.</div>
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
                  <input
                    :value="formatNumberInput(newContract.giaTriTaiSan)"
                    type="text"
                    inputmode="numeric"
                    placeholder="VD: 1.500.000.000"
                    @input="newContract.giaTriTaiSan = parseNumberInput($event.target.value)"
                  >
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
                        :value="newContract.discountMode === 'PERCENT' ? newContract.discountValue : formatNumberInput(newContract.discountValue)"
                        type="text"
                        inputmode="numeric"
                        :placeholder="newContract.discountMode === 'PERCENT' ? 'VD: 10' : 'VD: 1.000.000'"
                        @input="setDiscountValueFromInput($event.target.value)"
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
      <div class="modal-card pay-modal">
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
                <input
                  :value="formatNumberInput(payment.amount)"
                  type="text"
                  inputmode="numeric"
                  placeholder="VD: 3.000.000"
                  @input="setPaymentAmountFromInput($event.target.value)"
                >
              </div>
              <div class="field">
                <label><i class="fa-solid fa-credit-card"></i> Hình thức thanh toán</label>
                <select v-model="payment.method">
                  <option value="TIEN_MAT">Tiền mặt</option>
                  <option value="CHUYEN_KHOAN">Chuyển khoản</option>
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
                <div class="muted tiny mt-1">{{ currentContract?.tenDichVu }} • Ngày tạo {{ formatCreatedAt(currentContract?.ngayTao) }} • Trạng thái {{ getStatusText(currentContract?.trangThaiHopDong) }}</div>

                <div class="grid grid-cols-2 gap-2 mt-3">
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá sau giảm</div>
                    <div class="v price p4">{{ formatMoney(currentContract?.giaSauGiam || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Tổng điều chỉnh</div>
                    <div class="v price p2">{{ formatMoney(getTongDieuChinh(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                  <div class="k"><span class="dot"></span>Còn thiếu</div>
                  <div class="v price p1">{{ formatMoney(getConThieu(currentContract)) }}</div>
                </div>
                <div class="kpi">
                  <div class="k"><span class="dot"></span>Đã thu</div>
                  <div class="v price p3">{{ formatMoney(getDoanhThuRow(currentContract)) }}</div>
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
          <button v-if="canPayContract" class="btn primary" @click="savePayment">
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
                <input
                  :value="formatNumberInput(refund.amount)"
                  type="text"
                  inputmode="numeric"
                  placeholder="VD: 500.000"
                  @input="setRefundAmountFromInput($event.target.value)"
                >
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
                <div class="muted tiny mt-1">{{ currentContract?.tenDichVu }} • Ngày tạo {{ formatCreatedAt(currentContract?.ngayTao) }} • Trạng thái {{ getStatusText(currentContract?.trangThaiHopDong) }}</div>

                <div class="grid grid-cols-2 gap-2 mt-3">
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá sau giảm</div>
                    <div class="v price p4">{{ formatMoney(currentContract?.giaSauGiam || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Tổng điều chỉnh</div>
                    <div class="v price p2">{{ formatMoney(getTongDieuChinh(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Còn thiếu</div>
                    <div class="v price p1">{{ formatMoney(getConThieu(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Đã thu</div>
                    <div class="v price p3">{{ formatMoney(getDoanhThuRow(currentContract)) }}</div>
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
          <button v-if="canRefundContract" class="btn primary" @click="saveRefund">
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
                <input
                  v-if="adjustment.type !== 'CHUYEN_DOI_DV'"
                  :value="formatNumberInput(adjustment.amount)"
                  type="text"
                  inputmode="numeric"
                  placeholder="VD: 300.000"
                  @input="handleAdjustmentAmountInput"
                >
                <input
                  v-else
                  type="text"
                  value="Theo dịch vụ chuyển đổi"
                  readonly
                >
                <div class="muted tiny">Chỉ nhập số dương cho điều chỉnh.</div>
              </div>

              <div class="field">
                <label><i class="fa-solid fa-layer-group"></i> Loại điều chỉnh</label>
                <select v-model="adjustment.type">
                  <option value="GIAM_GIA">Giảm thêm</option>
                  <option value="PHU_THU">Phụ thu</option>
                  <option value="PHAT">Phạt</option>
                  <option value="CHUYEN_DOI_DV">Chuyển đổi dịch vụ</option>
                </select>
              </div>

              <div class="field">
                <label><i class="fa-solid fa-clipboard"></i> Lý do</label>
                <textarea v-model="adjustment.reason" placeholder="VD: Phạt trễ tiến độ..."></textarea>
              </div>

              <template v-if="adjustment.type === 'CHUYEN_DOI_DV'">
                <div class="section-title">
                  <i class="fa-solid fa-briefcase"></i>
                  Dịch vụ & giá trị
                </div>

                <div class="field">
                  <label class="field-label">
                    <span class="label-ico tone-indigo"><i class="fa-solid fa-list"></i></span>
                    <span>Dịch vụ</span>
                  </label>
                  <select v-model="adjustment.serviceId">
                    <option v-for="service in serviceOptions" :key="service.id || service.name" :value="service.id || service.name">
                      {{ service.name }}
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 px-3 pb-2">
                  <div class="field !m-0">
                    <label class="field-label">
                      <span class="label-ico tone-teal"><i class="fa-solid fa-building"></i></span>
                      <span>Giá trị tài sản ký bán</span>
                    </label>
                    <input
                      :value="formatNumberInput(adjustment.giaTriTaiSan)"
                      type="text"
                      inputmode="numeric"
                      placeholder="VD: 1.500.000.000"
                      @input="adjustment.giaTriTaiSan = parseNumberInput($event.target.value)"
                    >
                  </div>

                  <div class="field !m-0">
                    <label class="field-label">
                      <span class="label-ico tone-orange"><i class="fa-solid fa-money-bill-wave"></i></span>
                      <span>Giá gốc</span>
                    </label>
                    <input :value="formatMoney(adjustment.giaDichVuGoc)" type="text" readonly>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 px-3 pb-2">
                  <div class="field !m-0">
                    <label class="field-label">
                      <span class="label-ico tone-pink"><i class="fa-solid fa-tags"></i></span>
                      <span>Giảm giá</span>
                      <div class="discount-toggle">
                        <button type="button" :class="{ active: adjustment.discountMode === 'MONEY' }" @click="setAdjustmentDiscountMode('MONEY')">
                          <i class="fa-solid fa-money-bill-wave"></i>
                          Tiền
                        </button>
                        <button type="button" :class="{ active: adjustment.discountMode === 'PERCENT' }" @click="setAdjustmentDiscountMode('PERCENT')">
                          <i class="fa-solid fa-percent"></i>
                          %
                        </button>
                      </div>
                    </label>
                    <div class="discount-input">
                      <div class="discount-value">
                        <input
                          :value="adjustment.discountMode === 'PERCENT' ? adjustment.discountValue : formatNumberInput(adjustment.discountValue)"
                          type="text"
                          inputmode="numeric"
                          :placeholder="adjustment.discountMode === 'PERCENT' ? 'VD: 10' : 'VD: 1.000.000'"
                          @input="setAdjustmentDiscountValueFromInput($event.target.value)"
                        >
                        <span class="discount-suffix">{{ adjustment.discountMode === 'PERCENT' ? '%' : '₫' }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="field !m-0">
                    <label class="field-label">
                      <span class="label-ico tone-purple"><i class="fa-solid fa-circle-dollar-to-slot"></i></span>
                      <span>Giá sau giảm</span>
                    </label>
                    <input :value="formatMoney(adjustment.giaSauGiam)" type="text" readonly>
                  </div>
                </div>

                <div class="section-title">
                  <i class="fa-solid fa-wallet"></i>
                  Tuỳ chọn thanh toán ban đầu
                </div>

                <div class="px-3 pb-2">
                  <div class="plan" id="planAdjustWrap">
                    <div class="plan-item" :class="{ active: adjustment.initPlan === 'COC' }" @click="adjustment.initPlan = 'COC'">
                      <div class="plan-ico"><i class="fa-solid fa-hand-holding-dollar"></i></div>
                      <div class="min-w-0">
                        <div class="plan-tt">Cọc (%)</div>
                      </div>
                    </div>

                    <div class="plan-item" :class="{ active: adjustment.initPlan === 'FULL' }" @click="adjustment.initPlan = 'FULL'">
                      <div class="plan-ico"><i class="fa-solid fa-circle-check"></i></div>
                      <div class="min-w-0">
                        <div class="plan-tt">Đóng tất</div>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 gap-3" :class="adjustment.initPlan === 'COC' ? 'md:grid-cols-3' : 'md:grid-cols-2'">
                    <div v-if="adjustment.initPlan === 'COC'" class="field !m-0">
                      <label class="field-label">
                        <span class="label-ico tone-gold"><i class="fa-solid fa-percent"></i></span>
                        <span>% cọc</span>
                      </label>
                      <input v-model.number="adjustment.tiLeCoc" type="number" min="0" max="100" placeholder="VD: 30"
                             :disabled="adjustment.initPlan === 'FULL'">
                    </div>

                    <div class="field !m-0">
                      <label class="field-label">
                        <span class="label-ico tone-cyan"><i class="fa-solid fa-money-check-dollar"></i></span>
                        <span>Số tiền</span>
                      </label>
                      <input :value="formatMoney(adjustmentFirstPaymentAmount)" type="text" readonly>
                    </div>

                    <div class="field !m-0">
                      <label class="field-label">
                        <span class="label-ico tone-forest"><i class="fa-solid fa-credit-card"></i></span>
                        <span>Hình thức</span>
                      </label>
                      <select v-model="adjustment.firstMethod">
                        <option value="CHUYEN_KHOAN">Chuyển khoản</option>
                        <option value="TIEN_MAT">Tiền mặt</option>
                      </select>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <div class="card">
              <div class="card-h"><i class="fa-solid fa-circle-info"></i> Tóm tắt hợp đồng</div>
              <div class="p-3">
                <div class="text-sm font-extrabold">{{ currentContract?.maHopDong }} • {{ currentContract?.tenKhachHang }}</div>
                <div class="muted tiny mt-1">{{ currentContract?.tenDichVu }} • Ngày tạo {{ formatCreatedAt(currentContract?.ngayTao) }} • Trạng thái {{ getStatusText(currentContract?.trangThaiHopDong) }}</div>

                <div class="grid grid-cols-2 gap-2 mt-3">
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá sau giảm</div>
                    <div class="v price p4">{{ formatMoney(currentContract?.giaSauGiam || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Tổng điều chỉnh</div>
                    <div class="v price p2">{{ formatMoney(getTongDieuChinh(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Doanh thu</div>
                    <div class="v price p1">{{ formatMoney(getDoanhThuRow(currentContract)) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Doanh số</div>
                    <div class="v price p3">{{ formatMoney(getDoanhSoRow(currentContract)) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-f">
          <button class="btn ghost" @click="closeModal('modalAdjust')">
            <i class="fa-solid fa-ban"></i> Hủy
          </button>
          <button v-if="canAdjustContract" class="btn primary" @click="saveAdjustment">
            <i class="fa-solid fa-check"></i> Xác nhận điều chỉnh
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: DETAIL -->
    <div class="modal" :class="{ show: showModal === 'modalDetail' }" @click.self="closeModal('modalDetail')">
      <div class="modal-card detail">
        <div class="modal-h">
          <div class="modal-title flex items-center gap-2">
            <i class="fa-solid fa-file-lines"></i>
            <span>Chi tiết hợp đồng {{ detailContract?.maHopDong }}</span>
            <span v-if="detailContract?.trangThaiHopDong === 'DANG_HIEU_LUC'" class="status st-on">
              Đang hiệu lực
                      </span>
            <span v-else-if="detailContract?.trangThaiHopDong === 'HOAN_TAT'" class="status st-done">
              Hoàn tất
                      </span>
            <span v-else-if="detailContract?.trangThaiHopDong === 'HUY'" class="status st-cancel">
              Đã hủy
            </span>
          </div>
          <button class="x" @click="closeModal('modalDetail')">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-b">
          <div class="detail-grid grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div class="card xl:col-span-1">
              <div class="card-h"><i class="fa-solid fa-circle-info"></i> Thông tin hợp đồng</div>

              <div class="p-3">
                <div class="text-sm font-extrabold">{{ detailContract?.maHopDong }} • {{ detailContract?.tenKhachHang }}</div>
                <div class="muted tiny mt-1">{{ detailContract?.tenDichVu }} • Ngày tạo {{ formatDateValue(detailContract?.ngayTao) }}</div>

                  <div class="grid grid-cols-3 gap-2 mt-3">
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá gốc</div>
                    <div class="v price p2 font-extrabold">{{ formatMoney(detailContract?.giaDichVuGoc || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Phí giảm</div>
                    <div class="v price p4 font-extrabold">{{ formatMoney(detailContract?.phiGiam || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá sau giảm</div>
                    <div class="v price p1 font-extrabold">{{ formatMoney(detailContract?.giaSauGiam || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Giá tài sản ký</div>
                    <div class="v price p3 font-extrabold">{{ formatMoney(detailContract?.giaTaiSanKy || 0) }}</div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Doanh thu</div>
                    <div class="v price p1 font-extrabold">{{ formatMoney(getDoanhThuRow(detailContract)) }}</div>
                    <div class="muted tiny mt-1">Tổng hoàn: <span class="mono">{{ formatMoney(getTongHoan(detailContract)) }}</span></div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Doanh số</div>
                    <div class="v price p3 font-extrabold">{{ formatMoney(getDoanhSoRow(detailContract)) }}</div>
                    <div class="muted tiny mt-1">Tổng điều chỉnh: <span class="mono">{{ formatMoney(getTongDieuChinh(detailContract)) }}</span></div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Doanh thu</div>
                    <div class="v price p1 font-extrabold">{{ formatMoney(getDoanhThuRow(detailContract)) }}</div>
                    <div class="muted tiny mt-1">Tổng hoàn: <span class="mono">{{ formatMoney(getTongHoan(detailContract)) }}</span></div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Doanh số</div>
                    <div class="v price p3 font-extrabold">{{ formatMoney(getDoanhSoRow(detailContract)) }}</div>
                    <div class="muted tiny mt-1">Tổng điều chỉnh: <span class="mono">{{ formatMoney(getTongDieuChinh(detailContract)) }}</span></div>
                  </div>
                  <div class="kpi">
                    <div class="k"><span class="dot"></span>Người tạo</div>
                    <div class="v font-extrabold">{{ detailContract?.nguoiTaoFullName || '-' }}</div>
                  </div>
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
                      <tr v-if="!detailContract?.dotDongTiens?.length">
                        <td colspan="5">
                          <div class="text-center py-6 muted">Chưa có đợt đóng phí.</div>
                        </td>
                      </tr>
                      <tr v-for="payment in detailContract?.dotDongTiens || []" :key="payment.id">
                        <td class="mono">{{ formatDateValue(payment.ngayDongTien) }}</td>
                        <td class="mono">{{ formatMoney(payment.soTienDong) }}</td>
                        <td class="mono">{{ payment.hinhThucThanhToan || '-' }}</td>
                        <td>{{ payment.ghiChu || '' }}</td>
                        <td class="mono">{{ payment.nguoiGhiNhanFullName || '-' }}</td>
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
                      <tr v-if="!detailContract?.hoanTiens?.length">
                        <td colspan="4">
                          <div class="text-center py-6 muted">Chưa có đợt hoàn phí.</div>
                        </td>
                      </tr>
                      <tr v-for="refund in detailContract?.hoanTiens || []" :key="refund.id">
                        <td class="mono">{{ formatDateValue(refund.ngayHoan) }}</td>
                        <td class="mono">{{ formatMoney(refund.soTienHoan) }}</td>
                        <td>{{ refund.lyDoHoan || '' }}</td>
                        <td class="mono">{{ refund.nguoiDuyetFullName || '-' }}</td>
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
                      <tr v-if="!detailContract?.dieuChinhHopDongs?.length">
                        <td colspan="4">
                          <div class="text-center py-6 muted">Chưa có điều chỉnh.</div>
                        </td>
                      </tr>
                      <tr v-for="adj in detailContract?.dieuChinhHopDongs || []" :key="adj.id">
                        <td class="mono">{{ formatDateValue(adj.ngayTao) }}</td>
                        <td class="mono">{{ formatMoney(adj.soTienDieuChinh) }}</td>
                        <td class="mono">{{ adj.loaiDieuChinh || '-' }}</td>
                        <td>{{ adj.lyDo || '' }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-f">
          <button
            v-if="detailContract?.trangThaiHopDong === 'DANG_HIEU_LUC' && canCancelContract"
            class="btn danger"
            @click="cancelContract"
          >
            <i class="fa-solid fa-ban"></i> Hủy hợp đồng
          </button>
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
            <div class="muted mt-2">{{ currentContract?.tenKhachHang }} • {{ currentContract?.tenDichVu }} • Doanh thu hiện tại: {{ formatMoney(getDoanhThu(currentContract)) }}</div>
            <div class="note mt-3">
              Xóa sẽ mất cả các đợt <b>đóng phí</b>, <b>hoàn phí</b>, <b>điều chỉnh</b> của hợp đồng này.
            </div>
          </div>
        </div>
        <div class="modal-f">
          <button class="btn ghost" @click="closeModal('modalDelete')">
            <i class="fa-solid fa-ban"></i> Hủy
          </button>
          <button v-if="canDeleteContract" class="btn danger" @click="confirmDelete">
            <i class="fa-solid fa-trash"></i> Xóa luôn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import api from '/src/api/api.js'
import { useAuthStore } from '../../stores/authStore'
import { useSidebarStore } from '../../stores/sidebarStore'
import {
  confirmWithInput,
  showCenterWarning,
  showError,
  showLoading,
  updateAlertError,
  updateAlertSuccess
} from '/src/assets/js/alertService.js'
import ContractStatsDashboard from "../thiet-kegiandien/ContractStatsDashboard.vue";
import {shortenName} from "../../assets/js/global.js";
const authStore = useAuthStore()
const sidebar = useSidebarStore()
const info = computed(() => authStore.userInfo || {})
const canPayContract = computed(() => authStore.hasPermission('HOPDONG_THU'))
const canRefundContract = computed(() => authStore.hasPermission('HOPDONG_HOANPHI'))
const canAdjustContract = computed(() => authStore.hasPermission('HOPDONG_DIEUCHINH'))
const canDeleteContract = computed(() => authStore.hasPermission('HOPDONG_DELETE'))
const canCancelContract = computed(() => authStore.hasPermission('HOPDONG_HUY'))
const canContractSetting = computed(() => authStore.hasPermission('HOPDONG_SETTING'))
const canFullBranch = computed(() => authStore.hasPermission('HOPDONG_FULL_CHINHANH'))
const todayISO = () => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
// Constants
const ENUM_STATUS = ['DANG_HIEU_LUC', 'HOAN_TAT', 'HUY']
const ENUM_PAY = ['TIEN_MAT', 'CHUYEN_KHOAN', 'QR', 'KHAC']
const ENUM_ADJ = ['GIAM_GIA', 'PHU_THU', 'PHAT', 'CHUYEN_DOI_DV']

// State
const activeTab = ref(1)
const contracts = ref([])
const totalElements = ref(0)
const totalPages = ref(1)
const seq = ref(1)
const services = ref([])
const segments = ref([])
const branchOptions = ref([])
const branchLoading = ref(false)

// Filters
const searchQuery = ref('')
const filterService = ref(null)
const filterStatus = ref(null)
const tuNgay = ref(null)
const denNgay = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const currentUserName = ref('Nguyễn Minh')
const searchTimer = ref(null)

// Customer search
const customerSearch = ref('')
const selectedCustomer = ref(null)
const customerSearchResults = ref([])
const customerSearchLoading = ref(false)
const customerSearchError = ref('')
const customerSearchTimer = ref(null)
const lastCustomerKeyword = ref('')
const suppressCustomerSearch = ref(false)
const CONTRACT_DRAFT_KEY = 'contractDraftFromAppointment'

// New contract form
const newContract = ref({
  maHopDong: '',
  maKhachHang: '',
  tenKhachHang: '',
  tenDichVu: '',
  serviceId: null,
  branchId: null,
  giaTriTaiSan: null,
  giaDichVuGoc: 0,
  phiGiam: 0,
  discountMode: 'PERCENT',
  discountValue: 0,
  giaSauGiam: 0,
  trangThaiHopDong: 'DANG_HIEU_LUC',
  ngayKy: todayISO(),
  initPlan: 'COC',
  tiLeCoc: 30,
  firstMethod: 'CHUYEN_KHOAN'
})

// Modals
const showModal = ref(null)
const currentContract = ref(null)
const detailContract = ref(null)
const openActionMenu = ref(null)
const actionMenuPosition = ref({ top: 0, left: 0 })

// Payment form
const payment = ref({
  amount: 0,
  method: 'CHUYEN_KHOAN',
  date: todayISO(),
  note: ''
})

// Refund form
const refund = ref({
  amount: 0,
  date: todayISO(),
  reason: ''
})

// Adjustment form
const adjustment = ref({
  amount: 0,
  type: 'GIAM_GIA',
  reason: '',
  tenDichVu: '',
  serviceId: null,
  giaTriTaiSan: null,
  giaDichVuGoc: 0,
  phiGiam: 0,
  discountMode: 'PERCENT',
  discountValue: 0,
  giaSauGiam: 0,
  initPlan: 'COC',
  tiLeCoc: 30,
  firstMethod: 'CHUYEN_KHOAN'
})

// Toast
const showToast = ref(false)
const toast = ref({
  type: 'info',
  title: '',
  text: '',
  icon: 'fa-solid fa-circle-info'
})

// Computed properties
const pageStart = computed(() => {
  if (!totalElements.value) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const pageEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalElements.value)
})

const totalDoanhThu = computed(() => {
  return contracts.value.reduce((sum, c) => sum + getDoanhThu(c), 0)
})

const totalDieuChinh = computed(() => {
  return contracts.value.reduce((sum, c) => sum + getTongDieuChinh(c), 0)
})

const totalDoanhSo = computed(() => {
  return contracts.value.reduce((sum, c) => sum + getDoanhSo(c), 0)
})

const serviceOptions = computed(() => {
  return services.value
})

const selectedService = computed(() => {
  if (!newContract.value.serviceId) return null
  return serviceOptions.value.find(s => String(s.id || s.name) === String(newContract.value.serviceId)) || null
})

const matchingSegment = computed(() => {
  const serviceId = newContract.value.serviceId
  const assetValue = Number(newContract.value.giaTriTaiSan || 0)
  if (!serviceId || assetValue <= 0) return null
  return segments.value.find(seg =>
      String(seg.serviceId) === String(serviceId) &&
      assetValue >= Number(seg.min) &&
      assetValue < Number(seg.max)
  ) || null
})

const segmentHint = computed(() => {
  if (!newContract.value.serviceId) {
    return 'Vui lòng chọn dịch vụ để hiển thị phân khúc.'
  }
  if (!newContract.value.giaTriTaiSan) {
    return 'Nhập giá trị tài sản để xác định mức giá gốc.'
  }
  if (!matchingSegment.value) {
    return 'Chưa có phân khúc phù hợp với giá trị tài sản này.'
  }
  return `Phân khúc ${formatMoney(matchingSegment.value.min)} → ${formatMoney(matchingSegment.value.max)}`
})

const firstPaymentAmount = computed(() => {
  if (newContract.value.initPlan === 'FULL') {
    return newContract.value.giaSauGiam
  } else {
    const percent = Math.max(0, Math.min(100, newContract.value.tiLeCoc || 0))
    return Math.round(newContract.value.giaSauGiam * (percent / 100))
  }
})

const adjustmentFirstPaymentAmount = computed(() => {
  if (adjustment.value.initPlan === 'FULL') {
    return adjustment.value.giaSauGiam
  }
  const percent = Math.max(0, Math.min(100, adjustment.value.tiLeCoc || 0))
  return Math.round((adjustment.value.giaSauGiam || 0) * (percent / 100))
})

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1
  queueSearch()
})

watch(filterService, () => {
  currentPage.value = 1
  fetchContracts()
})

watch(filterStatus, () => {
  currentPage.value = 1
  fetchContracts()
})

watch([tuNgay, denNgay], () => {
  currentPage.value = 1
  fetchContracts()
})

watch(currentPage, () => {
  fetchContracts()
})

watch(pageSize, () => {
  currentPage.value = 1
  fetchContracts()
})

watch(customerSearch, (val) => {
  if (suppressCustomerSearch.value) return

  if (selectedCustomer.value && (val || '').trim() === (selectedCustomer.value.name || '').trim()) {
    customerSearchResults.value = []
    customerSearchLoading.value = false
    customerSearchError.value = ''
    return
  }

  if (selectedCustomer.value && (val || '').trim() !== (selectedCustomer.value?.name || '').trim()) {
    selectedCustomer.value = null
    newContract.value.maKhachHang = ''
    newContract.value.tenKhachHang = ''
  }

  clearCustomerSearchTimer()

  const k = (val || '').trim()
  if (!k) {
    lastCustomerKeyword.value = ''
    customerSearchResults.value = []
    customerSearchError.value = ''
    customerSearchLoading.value = false
    return
  }

  customerSearchTimer.value = setTimeout(() => {
    fetchCustomerSearch(k)
  }, 250)
})

watch(() => newContract.value.serviceId, () => {
  updateServicePrice()
})

watch(() => newContract.value.giaTriTaiSan, () => {
  updateGiaGocFromAsset()
})

watch(() => newContract.value.discountMode, () => {
  updateGiaSauGiam()
})

watch(() => adjustment.value.serviceId, () => {
  updateAdjustmentServicePrice()
})

watch(() => adjustment.value.giaTriTaiSan, () => {
  updateAdjustmentGiaGocFromAsset()
})

watch(() => adjustment.value.discountMode, () => {
  updateAdjustmentGiaSauGiam()
})
const fetchBranchOptions = async () => {
  if (branchLoading.value) return
  branchLoading.value = true
  try {
    const res = await api.get('/customer-crm/admin/lich-hen/options')
    branchOptions.value = (Array.isArray(res.data) ? res.data : []).map((branch) => ({
      id: Number(branch.id),
      label: branch.address
    }))
    if (canFullBranch.value && branchOptions.value.length > 0) {
      const hasMatch = branchOptions.value.some(
          (branch) => String(branch.id) === String(newContract.value.branchId)
      )
      if (!hasMatch) {
        newContract.value.branchId = branchOptions.value[0].id ?? null
      }
    }
  } catch (e) {
    console.error('❌ Lỗi fetch branches', e)
    branchOptions.value = []
  } finally {
    branchLoading.value = false
  }
}
watch(
  canFullBranch,
  (value) => {
    if (value) {
      fetchBranchOptions()
      if (!newContract.value.branchId && branchOptions.value.length) {
        newContract.value.branchId = branchOptions.value[0].id ?? null
      }
      return
    }
    newContract.value.branchId = null
  },
  { immediate: true }
)

watch(() => payment.value.amount, (val) => {
  if (!currentContract.value) return

  const maxAmount = calcConThieu(currentContract.value)

  // 🔑 Parse → ÉP SỐ NGUYÊN
  let num = Math.floor(parseNumberInput(val))

  if (num > maxAmount) num = maxAmount
  if (num < 0) num = 0

  if (num !== payment.value.amount) {
    payment.value.amount = num
  }
})

watch(() => refund.value.amount, (val) => {
  if (!currentContract.value) return

  const maxAmount = getMaxRefundAmount(currentContract.value)
  let num = Math.floor(parseNumberInput(val))

  if (num > maxAmount) num = maxAmount
  if (num < 0) num = 0

  if (num !== refund.value.amount) {
    refund.value.amount = num
  }
})

// Methods
// Helper functions
const formatMoney = (n) => {
  const x = Math.round(Number(n || 0))
  const sign = x < 0 ? '-' : ''
  const abs = Math.abs(x)
  return sign + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'
}

const formatTy = (n) => {
  const value = Number(n || 0) / 1_000_000_000
  const abs = Math.abs(value)
  const formatted = value.toLocaleString('vi-VN', {
    minimumFractionDigits: abs > 0 && abs < 1 ? 1 : 0,
    maximumFractionDigits: 1
  })
  return `${formatted} tỷ`
}

const formatNumberInput = (n) => {
  if (n === null || n === undefined || n === '') return ''
  const x = Math.round(Number(n || 0))
  const sign = x < 0 ? '-' : ''
  const abs = Math.abs(x)
  return sign + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const parseNumberInput = (value, allowNegative = false) => {
  const raw = String(value || '').trim()
  if (!raw) return 0
  const noDots = raw.replace(/\./g, '')
  const cleaned = allowNegative ? noDots.replace(/[^0-9-]/g, '') : noDots.replace(/[^0-9]/g, '')
  let parsed = Number(cleaned)
  if (Number.isNaN(parsed)) parsed = 0
  if (!allowNegative) return Math.max(0, parsed)
  return parsed
}

const initials = (name) => {
  const parts = String(name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
  if (parts.length === 0) return 'NA'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const getStatusText = (status) => {
  switch(status) {
    case 'DANG_HIEU_LUC': return 'Đang hiệu lực'
    case 'HOAN_TAT': return 'Hoàn tất'
    case 'HUY': return 'Đã hủy'
    default: return status
  }
}



const formatCreatedAt = (value) => {
  if (!value) return '-'
  if (typeof value === 'string') {
    const parts = value.split(',')
    if (parts.length === 2) {
      const datePart = parts[0].trim()
      const timePart = parts[1].trim()
      if (timePart && datePart) return `${timePart} ${datePart}`
    }
    if (/\d{1,2}:\d{2}:\d{2}/.test(value) && /\d{1,2}\/\d{1,2}\/\d{4}/.test(value)) {
      return value
    }
  }
  const parsed = value instanceof Date ? value : new Date(value)
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.toLocaleTimeString('vi-VN')} ${parsed.toLocaleDateString('vi-VN')}`
  }
  return String(value)
}

const formatDateValue = (value) => {
  if (!value) return '-'
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }
  return formatCreatedAt(value)
}

const getGiaGiam = (contract) => {
  return Number(contract?.giaGiam ?? contract?.phiGiam ?? 0)
}

const getGiaTaiSanKy = (contract) => {
  return Number(contract?.giaTaiSanKyGoc ?? contract?.giaTriTaiSan ?? contract?.giaTriKyBan ?? 0)
}

const getTongHoan = (contract) => {
  if (contract?.giaHoanTien !== undefined && contract?.giaHoanTien !== null) {
    return Number(contract.giaHoanTien || 0)
  }
  return calcTongHoan(contract)
}

const getTongDieuChinh = (contract) => {
  if (contract?.tongDC !== undefined && contract?.tongDC !== null) {
    return Number(contract.tongDC || 0)
  }
  return 0
}

const getDoanhThuRow = (contract) => {
  return Number(contract?.doanhThu ?? 0)
}

const getDoanhSoRow = (contract) => {
  return Number(contract?.doanhSo ?? 0)
}

const getDoanhThu = (contract) => {
  if (contract?.doanhThu !== undefined && contract?.doanhThu !== null) {
    return Number(contract.doanhThu || 0)
  }
  return calcThucThu(contract)
}

const getDoanhSo = (contract) => {
  if (contract?.doanhSo !== undefined && contract?.doanhSo !== null) {
    return Number(contract.doanhSo || 0)
  }
  return calcDoanhThu(contract)
}

const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const randPriceForService = (serviceName) => {
  const svc = serviceOptions.value.find(s => s.name === serviceName) || serviceOptions.value[0]
  if (!svc) return 0
  const min = Number(svc.minPrice ?? svc.min ?? 0)
  const max = Number(svc.maxPrice ?? svc.max ?? min)
  if (!min || !max) return 0
  const step = 250000
  const raw = randInt(min, max)
  return Math.round(raw / step) * step
}

const pad4 = (n) => {
  return String(n).padStart(4, '0')
}

const fetchServices = async () => {
  try {
    const res = await api.get('/dich-vu-thg/admin', {
      params: {
        keyword: null
      }
    })
    services.value = res.data || []
  } catch (e) {
    console.error('❌ Lỗi fetch services', e)
    services.value = []
  }
}

const fetchSegments = async () => {
  try {
    const res = await api.get('/dich-vu-thg/admin/phan-khuc')
    segments.value = res.data || []
  } catch (e) {
    console.error('❌ Lỗi fetch segments', e)
    segments.value = []
  }
}



const queueSearch = () => {
  if (searchTimer.value) clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => {
    fetchContracts()
  }, 300)
}

const fetchContracts = async () => {
  const payload = {
    keyword: searchQuery.value || null,
    serviceId: filterService.value || null,
    trangThaiHopDong: filterStatus.value || null,
    tuNgay: tuNgay.value || null,
    denNgay: denNgay.value || null,
    page: currentPage.value,
    size: pageSize.value
  }

  try {
    const res = await api.post('/hop-dong/admin/search', payload)
    const page = res?.data || {}
    const items = Array.isArray(page.content) ? page.content : []
    contracts.value = items
    totalElements.value = Number(page.page.totalElements ?? items.length)
    totalPages.value = Number(page.page.totalPages ?? Math.max(1, Math.ceil(totalElements.value / pageSize.value)))
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1
    }
  } catch (e) {
    console.error('❌ Lỗi fetch contracts', e)
    contracts.value = []
    totalElements.value = 0
    totalPages.value = 1
  }
}

const getServiceById = (serviceId) => {
  return serviceOptions.value.find(s => String(s.id || s.name) === String(serviceId)) || null
}

const applyContractDraftFromAppointment = async () => {
  const raw = localStorage.getItem(CONTRACT_DRAFT_KEY)
  if (!raw) return
  localStorage.removeItem(CONTRACT_DRAFT_KEY)

  let draft = null
  try {
    draft = JSON.parse(raw)
  } catch (e) {
    return
  }

  if (!draft?.phone && !draft?.serviceId) return

  resetContractForm()

  if (draft?.serviceId) {
    const matchedService = getServiceById(draft.serviceId)
    if (matchedService) {
      newContract.value.serviceId = matchedService.id || matchedService.name
    }
  }

  openModal('modalContract')
  updateServicePrice()

  const phone = String(draft?.phone || '').trim()
  if (!phone) return

  suppressCustomerSearch.value = true
  customerSearch.value = phone
  suppressCustomerSearch.value = false

  await fetchCustomerSearch(phone)
  const matchedCustomer = customerSearchResults.value.find(
    (customer) => String(customer.phone || customer.raw?.phone || '') === phone
  )
  if (matchedCustomer) {
    selectCustomer(matchedCustomer)
  } else if (customerSearchResults.value.length === 1) {
    selectCustomer(customerSearchResults.value[0])
  }
}

const getSegmentsByService = (serviceId) => {
  return segments.value
      .filter(seg => String(seg.serviceId) === String(serviceId))
      .sort((a, b) => Number(a.min) - Number(b.min))
}

const findSegmentForAsset = (serviceId, assetValue) => {
  if (!serviceId || !assetValue) return null
  const segments = getSegmentsByService(serviceId)
  return segments.find(seg =>
      assetValue >= Number(seg.min) && assetValue < Number(seg.max)
  ) || null
}

const genContractCode = () => {
  const y = new Date().getFullYear()
  return `HD-${y}-${pad4(seq.value++)}`
}

// Calculation functions
const calcTongDong = (c) => {
  return (c?.dotDongTien || []).reduce((sum, x) => sum + (Number(x.soTienDong) || 0), 0)
}

const calcTongHoan = (c) => {
  return (c?.hoanTien || []).reduce((sum, x) => sum + (Number(x.soTienHoan) || 0), 0)
}

const calcTongDieuChinh = (c) => {
  return (c?.dieuChinh || []).reduce((sum, x) => sum + (Number(x.soTienDieuChinh) || 0), 0)
}

const calcThucThu = (c) => {
  return calcTongDong(c) - calcTongHoan(c)
}

const calcGiaDieuChinh = (c) => {
  return (Number(c?.giaSauGiam) || 0) + calcTongDieuChinh(c)
}

const calcDoanhThu = (c) => {
  return Math.min(calcGiaDieuChinh(c), calcThucThu(c))
}

const getConThieu = (c) => {
  const giaSauGiam = Number(c?.giaSauGiam || 0)
  const tongDieuChinh = getTongDieuChinh(c)
  const doanhThu = getDoanhThuRow(c)
  return Math.max(0, giaSauGiam + tongDieuChinh - doanhThu)
}

const calcConThieu = (c) => {
  return getConThieu(c)
}

const getMaxRefundAmount = (c) => {
  return Math.max(0, getDoanhThuRow(c))
}

// Modal control
const openModal = (modal) => {
  showModal.value = modal
}

const closeModal = (modal) => {
  resetContractForm()
  if (showModal.value === modal) {
    showModal.value = null
  }
  if (modal === 'modalDetail') {
    detailContract.value = null
  }
}

// Contract management
const resetContractForm = () => {
  const firstService = serviceOptions.value[0] || null
  newContract.value = {
    maHopDong: genContractCode(),
    maKhachHang: '',
    tenKhachHang: '',
    tenDichVu: firstService?.name || '',
    serviceId: firstService?.id || firstService?.name || null,
    branchId: canFullBranch.value ? branchOptions.value[0]?.id ?? null : null,
    giaTriTaiSan: null,
    giaDichVuGoc: 0,
    phiGiam: 0,
    discountMode: 'PERCENT',
    discountValue: 0,
    giaSauGiam: 0,
    trangThaiHopDong: 'DANG_HIEU_LUC',
    ngayKy: todayISO(),
    initPlan: 'COC',
    tiLeCoc: 30,
    firstMethod: 'CHUYEN_KHOAN'
  }
  customerSearch.value = ''
  selectedCustomer.value = null
  customerSearchResults.value = []
  customerSearchError.value = ''
  customerSearchLoading.value = false
  updateServicePrice()
}

const updateServicePrice = () => {
  const service = getServiceById(newContract.value.serviceId)
  newContract.value.tenDichVu = service?.name || ''
  updateGiaGocFromAsset()
}

const updateGiaGocFromAsset = () => {
  const assetValue = Number(newContract.value.giaTriTaiSan || 0)
  const segment = findSegmentForAsset(newContract.value.serviceId, assetValue)
  if (segment) {
    newContract.value.giaDichVuGoc = Number(segment.price || 0)
  } else {
    newContract.value.giaDichVuGoc = 0
  }
  updateGiaSauGiam()
}

const setDiscountMode = (mode) => {
  newContract.value.discountMode = mode
}

const updateGiaSauGiam = () => {
  const giaGoc = Number(newContract.value.giaDichVuGoc || 0)
  if (newContract.value.discountMode === 'PERCENT') {
    const percent = Math.max(0, Math.min(100, Number(newContract.value.discountValue || 0)))
    newContract.value.discountValue = percent
    newContract.value.phiGiam = Math.round(giaGoc * (percent / 100))
  } else {
    const money = Number(newContract.value.discountValue || 0)
    const clamped = Math.max(0, Math.min(giaGoc, money))
    newContract.value.discountValue = clamped
    newContract.value.phiGiam = clamped
  }
  newContract.value.giaSauGiam = Math.max(0, giaGoc - (newContract.value.phiGiam || 0))
}

const setDiscountValueFromInput = (value) => {
  if (newContract.value.discountMode === 'PERCENT') {
    newContract.value.discountValue = parseNumberInput(value)
  } else {
    newContract.value.discountValue = parseNumberInput(value)
  }
  updateGiaSauGiam()
}

const updateAdjustmentServicePrice = () => {
  const service = getServiceById(adjustment.value.serviceId)
  adjustment.value.tenDichVu = service?.name || ''
  updateAdjustmentGiaGocFromAsset()
}

const updateAdjustmentGiaGocFromAsset = () => {
  const assetValue = Number(adjustment.value.giaTriTaiSan || 0)
  const segment = findSegmentForAsset(adjustment.value.serviceId, assetValue)
  if (segment) {
    adjustment.value.giaDichVuGoc = Number(segment.price || 0)
  } else {
    adjustment.value.giaDichVuGoc = 0
  }
  updateAdjustmentGiaSauGiam()
}

const setAdjustmentDiscountMode = (mode) => {
  adjustment.value.discountMode = mode
}

const updateAdjustmentGiaSauGiam = () => {
  const giaGoc = Number(adjustment.value.giaDichVuGoc || 0)
  if (adjustment.value.discountMode === 'PERCENT') {
    const percent = Math.max(0, Math.min(100, Number(adjustment.value.discountValue || 0)))
    adjustment.value.discountValue = percent
    adjustment.value.phiGiam = Math.round(giaGoc * (percent / 100))
  } else {
    const money = Number(adjustment.value.discountValue || 0)
    const clamped = Math.max(0, Math.min(giaGoc, money))
    adjustment.value.discountValue = clamped
    adjustment.value.phiGiam = clamped
  }
  adjustment.value.giaSauGiam = Math.max(0, giaGoc - (adjustment.value.phiGiam || 0))
}

const setAdjustmentDiscountValueFromInput = (value) => {
  adjustment.value.discountValue = parseNumberInput(value)
  updateAdjustmentGiaSauGiam()
}

const setPaymentAmountFromInput = (value) => {
  const parsed = parseNumberInput(value)
  const maxAmount = calcConThieu(currentContract.value)
  payment.value.amount = Math.min(parsed, maxAmount)
}

const setRefundAmountFromInput = (value) => {
  const parsed = parseNumberInput(value)
  const maxAmount = getMaxRefundAmount(currentContract.value)
  refund.value.amount = Math.min(parsed, maxAmount)
}

const clearSelectedCustomer = () => {
  selectedCustomer.value = null
  customerSearch.value = ''
  customerSearchResults.value = []
  customerSearchError.value = ''
  customerSearchLoading.value = false
  newContract.value.maKhachHang = ''
  newContract.value.tenKhachHang = ''
}

const fetchCustomerSearch = async (keyword) => {
  const k = (keyword || '').trim()
  if (!k) {
    customerSearchResults.value = []
    customerSearchError.value = ''
    return
  }

  if (k === lastCustomerKeyword.value) return
  lastCustomerKeyword.value = k

  customerSearchLoading.value = true
  customerSearchError.value = ''

  try {
    const qs = new URLSearchParams({ keyword: k }).toString()
    const res = await api.get(`/customer-crm/admin/lich-hen/search-customer?${qs}`)
    const data = await res.data
    customerSearchResults.value = (Array.isArray(data) ? data : []).slice(0, 8).map((x) => ({
      id: x.customerId,
      name: x.customerName,
      phone: x.phone,
      raw: x
    }))
  } catch (e) {
    customerSearchResults.value = []
    customerSearchError.value = 'Không tìm thấy hoặc lỗi tải dữ liệu.'
  } finally {
    customerSearchLoading.value = false
  }
}

const clearCustomerSearchTimer = () => {
  if (customerSearchTimer.value) clearTimeout(customerSearchTimer.value)
  customerSearchTimer.value = null
}

const selectCustomer = (customer) => {
  suppressCustomerSearch.value = true
  clearCustomerSearchTimer()
  customerSearchLoading.value = false
  customerSearchError.value = ''
  customerSearchResults.value = []

  selectedCustomer.value = customer
  customerSearch.value = customer.name
  newContract.value.maKhachHang = customer.id
  newContract.value.tenKhachHang = customer.name
  if (customer?.raw?.giaTriTaiSan !== undefined && customer?.raw?.giaTriTaiSan !== null) {
    newContract.value.giaTriTaiSan = Number(customer.raw.giaTriTaiSan || 0)
  }

  setTimeout(() => {
    suppressCustomerSearch.value = false
  }, 0)
}

const saveContract = async () => {
  updateGiaSauGiam()
  if (!selectedCustomer.value) {
    showError('Thiếu dữ liệu', 'Bạn cần chọn khách hàng từ danh sách.')
    return
  }

  if (!newContract.value.tenDichVu) {
    showError('Thiếu dữ liệu', 'Bạn cần chọn Dịch vụ.')
    return
  }

  if (!newContract.value.giaTriTaiSan) {
    showError('Thiếu dữ liệu', 'Bạn cần nhập giá trị tài sản.')
    return
  }

  if (!newContract.value.giaDichVuGoc) {
    showError('Thiếu dữ liệu', 'Giá gốc chưa xác định theo phân khúc.')
    return
  }

  if (newContract.value.discountMode === 'MONEY' && newContract.value.discountValue <= 0) {
    showError('Giảm giá không hợp lệ', 'Giảm giá tiền phải > 0 và không vượt quá giá gốc.')
    return
  }

  const payload = {
    maKhachHang: newContract.value.maKhachHang,
    giaTriKyBan: newContract.value.giaTriTaiSan,
    giaDichVuGoc: newContract.value.giaDichVuGoc,
    phiGiam: newContract.value.phiGiam || 0,
    giaSauGiam: newContract.value.giaSauGiam,
    hinhThucThanhToan: newContract.value.firstMethod,
    serviceId: newContract.value.serviceId,
    branchId: canFullBranch.value ? newContract.value.branchId : null,
    soTienThanhToan: firstPaymentAmount.value,
    initPlan: newContract.value.initPlan
  }

  try {
    const res = await showLoading(api.post('/hop-dong/admin/create', payload))
    const created = res?.data || {}
    const hasPayments = Array.isArray(created.dotDongTien) && created.dotDongTien.length > 0
    const contract = {
      id: created.id || crypto.randomUUID(),
      maHopDong: created.maHopDong || newContract.value.maHopDong,
      maKhachHang: created.maKhachHang ?? newContract.value.maKhachHang,
      tenKhachHang: created.tenKhachHang || newContract.value.tenKhachHang,
      nhanVienTao: created.nhanVienTao || currentUserName.value,
      tenDichVu: created.tenDichVu || newContract.value.tenDichVu,
      serviceId: created.serviceId ?? newContract.value.serviceId,
      giaTriTaiSan: created.giaTriKyBan ?? created.giaTriTaiSan ?? newContract.value.giaTriTaiSan,
      giaDichVuGoc: created.giaDichVuGoc ?? newContract.value.giaDichVuGoc,
      phiGiam: created.phiGiam ?? newContract.value.phiGiam ?? 0,
      giaSauGiam: created.giaSauGiam ?? newContract.value.giaSauGiam,
      trangThaiHopDong: created.trangThaiHopDong ?? newContract.value.trangThaiHopDong,
      ngayKy: created.ngayKy ?? newContract.value.ngayKy ?? todayISO(),
      ngayTao: created.ngayTao ?? new Date().toLocaleString('vi-VN'),
      dotDongTien: hasPayments ? created.dotDongTien : [],
      hoanTien: created.hoanTien || [],
      dieuChinh: created.dieuChinh || [],
      initPlan: created.initPlan ?? newContract.value.initPlan,
      tiLeCoc: created.tiLeCoc ?? (newContract.value.initPlan === 'COC' ? (newContract.value.tiLeCoc || 0) : null)
    }

    if (!hasPayments && firstPaymentAmount.value > 0) {
      contract.dotDongTien.push({
        id: crypto.randomUUID(),
        soTienDong: firstPaymentAmount.value,
        hinhThucThanhToan: newContract.value.firstMethod,
        ngayDongTien: contract.ngayKy,
        ghiChu: newContract.value.initPlan === 'FULL' ?
            'Thanh toán đủ (tạo khi lập HĐ)' :
            `Cọc ${newContract.value.tiLeCoc || 0}% (tạo khi lập HĐ)`,
        nguoiGhiNhan: 'demo_admin',
        ngayTao: new Date().toLocaleString('vi-VN')
      })
    }

    await fetchContracts()
    updateAlertSuccess('Đã tạo hợp đồng',
        `${contract.maHopDong} • ${newContract.value.initPlan === 'FULL' ? 'Đóng tất' : 'Cọc'}: ${formatMoney(firstPaymentAmount.value)}`)
    closeModal('modalContract')

  } catch (error) {
    console.error('❌ Lỗi tạo hợp đồng', error)
    updateAlertError('Tạo hợp đồng thất bại', 'Vui lòng thử lại sau.')
  }
}

// Payment management
const openPay = (contract) => {
  const conThieu = calcConThieu(contract)
  if (conThieu <= 0) {
    showCenterWarning('Phí đã đóng hoàn tất', 'Không thể đóng thêm phí.')
    return
  }
  currentContract.value = contract
  payment.value = {
    amount: 0,
    method: 'CHUYEN_KHOAN',
    date: todayISO(),
    note: ''
  }
  openModal('modalPay')
}

const savePayment = async () => {
  if (payment.value.amount <= 0) {
    showCenterWarning('Số tiền không hợp lệ', 'Số tiền đóng phải > 0.')
    return
  }

  const maxAmount = calcConThieu(currentContract.value)
  if (payment.value.amount > maxAmount) {
    showCenterWarning('Số tiền vượt quá còn thiếu', `Tối đa còn thiếu: ${formatMoney(maxAmount)}.`)
    return
  }

  const contractIndex = contracts.value.findIndex(c => c.id === currentContract.value.id)
  if (contractIndex === -1) return

  const payload = {
    hopDongId: currentContract.value.id,
    soTienDong: payment.value.amount,
    hinhThucThanhToan: payment.value.method,
    ngayDongTien: payment.value.date || todayISO(),
    ghiChu: payment.value.note
  }

  try {
    await showLoading(api.post('/hop-dong/admin/dong-phi', payload))
    updateAlertSuccess('Đóng phí thành công', `+${formatMoney(payment.value.amount)} (${payment.value.method})`)
    await fetchContracts()
    closeModal('modalPay')
  } catch (error) {
    console.error('❌ Lỗi đóng phí', error)
    updateAlertError('Đóng phí thất bại', 'Vui lòng thử lại sau.')
  }
}

// Refund management
const openRefund = (contract) => {
  const maxRefund = getMaxRefundAmount(contract)
  if (maxRefund <= 0) {
    showCenterWarning('Chưa có phí đã thu', 'Không thể hoàn phí khi hợp đồng chưa thu tiền.')
    return
  }
  currentContract.value = contract
  refund.value = {
    amount: 0,
    date: todayISO(),
    reason: ''
  }
  openModal('modalRefund')
}

const saveRefund = async () => {
  if (refund.value.amount <= 0) {
    showCenterWarning('Số tiền không hợp lệ', 'Số tiền hoàn phải > 0.')
    return
  }

  const reason = (refund.value.reason || '').trim()
  if (reason.length < 10) {
    showCenterWarning('Thiếu lý do', 'Lý do hoàn tối thiểu 10 ký tự.')
    return
  }

  const maxRefund = getMaxRefundAmount(currentContract.value)
  if (refund.value.amount > maxRefund) {
    showCenterWarning('Số tiền vượt quá đã thu', `Tối đa đã thu: ${formatMoney(maxRefund)}.`)
    return
  }

  const payload = {
    hopDongId: currentContract.value.id,
    soTienHoan: refund.value.amount,
    ngayHoan: refund.value.date || todayISO(),
    lyDoHoan: reason
  }

  try {
    await showLoading(api.post('/hop-dong/admin/hoan-phi', payload))
    updateAlertSuccess('Hoàn phí thành công', `-${formatMoney(refund.value.amount)}`)
    await fetchContracts()
    closeModal('modalRefund')
  } catch (error) {
    console.error('❌ Lỗi hoàn phí', error)
    updateAlertError('Hoàn phí thất bại', 'Vui lòng thử lại sau.')
  }
}

// Adjustment management
const openAdjust = (contract) => {
  currentContract.value = contract
  adjustment.value = {
    amount: 0,
    type: 'GIAM_GIA',
    reason: '',
    tenDichVu: contract?.tenDichVu || '',
    serviceId: contract?.serviceId || null,
    giaTriTaiSan: getGiaTaiSanKy(contract),
    giaDichVuGoc: Number(contract?.giaDichVuGoc || 0),
    phiGiam: Number(contract?.phiGiam || 0),
    discountMode: 'PERCENT',
    discountValue: 0,
    giaSauGiam: Number(contract?.giaSauGiam || 0),
    initPlan: 'COC',
    tiLeCoc: 30,
    firstMethod: 'CHUYEN_KHOAN'
  }
  updateAdjustmentGiaGocFromAsset()
  openModal('modalAdjust')
}

const handleAdjustmentAmountInput = (event) => {
  adjustment.value.amount = parseNumberInput(event.target.value)
}

const saveAdjustment = async () => {
  if (!ENUM_ADJ.includes(adjustment.value.type)) {
    showCenterWarning('Loại điều chỉnh sai', 'Chọn GIAM_GIA/PHU_THU/PHAT/CHUYEN_DOI_DV.')
    return
  }

  if (adjustment.value.type !== 'CHUYEN_DOI_DV' && adjustment.value.amount <= 0) {
    showCenterWarning('Số tiền không hợp lệ', 'Điều chỉnh phải lớn hơn 0.')
    return
  }

  if (adjustment.value.type === 'GIAM_GIA') {
    const giaSauGiam = Number(currentContract.value?.giaSauGiam || 0)
    const tongDieuChinh = getTongDieuChinh(currentContract.value)
    const maxGiam = giaSauGiam + tongDieuChinh
    if (adjustment.value.amount > maxGiam) {
      showCenterWarning(
        'Số tiền giảm vượt mức',
        `Tối đa được giảm: ${formatMoney(maxGiam)}.`
      )
      return
    }
  }

  const reason = (adjustment.value.reason || '').trim()
  if (!reason) {
    showCenterWarning('Thiếu lý do', 'Bạn cần nhập lý do điều chỉnh.')
    return
  }

  if (adjustment.value.type === 'CHUYEN_DOI_DV') {
    updateAdjustmentGiaSauGiam()
    if (!adjustment.value.serviceId) {
      showCenterWarning('Thiếu dữ liệu', 'Bạn cần chọn dịch vụ chuyển đổi.')
      return
    }
    if (!adjustment.value.giaTriTaiSan) {
      showCenterWarning('Thiếu dữ liệu', 'Bạn cần nhập giá trị tài sản ký bán.')
      return
    }
    if (!adjustment.value.giaDichVuGoc) {
      showCenterWarning('Thiếu dữ liệu', 'Giá gốc chưa xác định theo phân khúc.')
      return
    }
    if (adjustment.value.discountMode === 'MONEY' && adjustment.value.discountValue <= 0) {
      showCenterWarning('Giảm giá không hợp lệ', 'Giảm giá tiền phải > 0 và không vượt quá giá gốc.')
      return
    }
    logServiceSwitchAdjustment({
      hopDongId: currentContract.value?.id,
      reason,
      serviceId: adjustment.value.serviceId,
      giaTriKyBan: adjustment.value.giaTriTaiSan,
      giaDichVuGoc: adjustment.value.giaDichVuGoc,
      phiGiam: adjustment.value.phiGiam,
      giaSauGiam: adjustment.value.giaSauGiam,
      initPlan: adjustment.value.initPlan,
      tiLeCoc: adjustment.value.initPlan === 'COC' ? adjustment.value.tiLeCoc : null,
      soTienThanhToan: adjustmentFirstPaymentAmount.value,
      hinhThucThanhToan: adjustment.value.firstMethod
    })
    closeModal('modalAdjust')
    return
  }

  const payload = {
    hopDongId: currentContract.value.id,
    soTienDieuChinh: adjustment.value.amount,
    loaiDieuChinh: adjustment.value.type,
    lyDo: reason
  }

  try {
    await showLoading(api.post('/hop-dong/admin/dieu-chinh', payload))
    updateAlertSuccess('Điều chỉnh thành công',
        `${adjustment.value.type === 'GIAM_GIA' ? '-' : '+'}${formatMoney(adjustment.value.amount)} (${adjustment.value.type})`)
    await fetchContracts()
    closeModal('modalAdjust')
  } catch (error) {
    console.error('❌ Lỗi điều chỉnh', error)
    updateAlertError('Điều chỉnh thất bại', 'Vui lòng thử lại sau.')
  }
}

const logServiceSwitchAdjustment = async  (payload) => {
  console.log('CHUYEN_DOI_DV payload', payload)
  try {
    await showLoading(api.post('/hop-dong/admin/chuyen-doi', payload))
    updateAlertSuccess('Điều chỉnh thành công',
        `${adjustment.value.type === 'GIAM_GIA' ? '-' : '+'}${formatMoney(adjustment.value.amount)} (${adjustment.value.type})`)
    await fetchContracts()
    closeModal('modalAdjust')
  } catch (error) {
    console.error('❌ Lỗi điều chỉnh', error)
    updateAlertError('Điều chỉnh thất bại', 'Vui lòng thử lại sau.')
  }

}

const isActiveContract = (contract) => contract?.trangThaiHopDong === 'DANG_HIEU_LUC'

const activeActionContract = computed(() =>
  contracts.value.find((contract) => contract.id === openActionMenu.value)
)

const actionMenuPositionStyle = computed(() => ({
  top: `${actionMenuPosition.value.top}px`,
  left: `${actionMenuPosition.value.left}px`
}))

const toggleActionMenu = (contractId, event) => {
  if (openActionMenu.value === contractId) {
    openActionMenu.value = null
    return
  }
  const target = event?.currentTarget
  if (target) {
    const rect = target.getBoundingClientRect()
    const menuWidth = 200
    const gap = 12
    const left = Math.max(12, rect.left - menuWidth - gap)
    const top = Math.min(
      window.innerHeight - 12,
      Math.max(12, rect.top + rect.height / 2)
    )
    actionMenuPosition.value = { top, left }
  }
  openActionMenu.value = contractId
}

const closeActionMenu = () => {
  openActionMenu.value = null
}

const handleDocumentClick = () => {
  openActionMenu.value = null
}

// Detail view
const openDetail = (contract) => {
  if (!contract) {
    return
  }
  currentContract.value = contract
  detailContract.value = {
    ...contract,
    dotDongTiens: contract?.dotDongTien || [],
    hoanTiens: contract?.hoanTien || [],
    dieuChinhHopDongs: contract?.dieuChinh || []
  }
  openModal('modalDetail')
  console.log(contract)
  fetchDetailContract(contract.id)
}

const fetchDetailContract = async (contractId) => {
  if (!contractId) return
  try {
      const res = await api.get(`/hop-dong/admin/${contractId}/detail`)
    detailContract.value = res?.data || detailContract.value
  } catch (error) {
    console.error('❌ Lỗi tải chi tiết hợp đồng', error)
    updateAlertError('Tải chi tiết thất bại', 'Vui lòng thử lại sau.')
  }
}

const cancelContract = async () => {
  const contract = detailContract.value || currentContract.value
  if (!contract?.id) return

  await confirmWithInput(
    'Xác nhận hủy hợp đồng',
    `Nhập mã hợp đồng ${contract.maHopDong} để xác nhận hủy.`,
    contract.maHopDong,
    async () => {
      try {
        await showLoading(api.get(`/hop-dong/admin/${contract.id}/trang-thai/HUY`))
        updateAlertSuccess('Đã hủy hợp đồng', `${contract.maHopDong} đã chuyển sang trạng thái HUY.`)
        if (detailContract.value) {
          detailContract.value.trangThaiHopDong = 'HUY'
        }
        if (currentContract.value) {
          currentContract.value.trangThaiHopDong = 'HUY'
        }
        await fetchContracts()
      } catch (error) {
        console.error('❌ Lỗi hủy hợp đồng', error)
        updateAlertError('Hủy hợp đồng thất bại', 'Vui lòng thử lại sau.')
      }
    }
  )
}

// Delete management
const openDelete = (contract) => {
  currentContract.value = contract
  openModal('modalDelete')
}

const confirmDelete = async () => {
  const contract = currentContract.value
  if (!contract) return

  closeModal('modalDelete')

  await confirmWithInput(
    'Xác nhận xóa hợp đồng',
    `Nhập mã hợp đồng ${contract.maHopDong} để xác nhận xóa.`,
    contract.maHopDong,
    async () => {
      try {
        await showLoading(api.delete(`/hop-dong/admin/${contract.id}`))
        updateAlertSuccess('Đã xóa hợp đồng', `Đã xóa ${contract.maHopDong}`)
        await fetchContracts()
      } catch (error) {
        console.error('❌ Lỗi xóa hợp đồng', error)
        updateAlertError('Xóa hợp đồng thất bại', 'Vui lòng thử lại sau.')
      }
    }
  )
}

// Filters
const resetFilters = () => {
  searchQuery.value = ''
  filterService.value = null
  filterStatus.value = null
  tuNgay.value = null
  denNgay.value = null
  currentPage.value = 1
  fetchContracts()
  showCenterWarning('Đã reset lọc', 'Hiển thị toàn bộ hợp đồng.')
}

const goToPage = (page) => {
  const next = Math.min(totalPages.value, Math.max(1, page))
  currentPage.value = next
}

const nextPage = () => {
  goToPage(currentPage.value + 1)
}

const prevPage = () => {
  goToPage(currentPage.value - 1)
}

// Seed data
const seedMock = () => {
  const names = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C', 'Phạm Minh D', 'Võ Thúy E', 'Đặng Quốc F']
  const staffNames = ['Nguyễn Minh', 'Trần Hà', 'Phạm Quân', 'Lê Thu']
  const serviceList = serviceOptions.value

  if (!serviceList.length) {
    showCenterWarning('Thiếu dữ liệu', 'Chưa tải được danh sách dịch vụ.')
    return
  }

  for (let i = 0; i < 5; i++) {
    const service = serviceList[randInt(0, serviceList.length - 1)]
    const segments = getSegmentsByService(service.id || service.name)
    const pickedSegment = segments.length ? segments[randInt(0, segments.length - 1)] : null
    const segmentMin = pickedSegment ? Number(pickedSegment.min) : 0
    const segmentMax = pickedSegment ? Number(pickedSegment.max) : 0
    const assetValue = pickedSegment
        ? randInt(segmentMin, Math.max(segmentMin + 1, segmentMax - 1))
        : randInt(500000000, 5000000000)
    const giaGoc = pickedSegment ? Number(pickedSegment.price || 0) : randPriceForService(service.name)
    const phiGiam = [0, 200000, 500000, 1000000, 1500000][randInt(0, 4)]
    const giaSau = Math.max(0, giaGoc - phiGiam)

    const st = ENUM_STATUS[randInt(0, 2)]
    const ky = new Date()
    ky.setDate(ky.getDate() - randInt(0, 25))
    const ngayKy = ky.toISOString().slice(0, 10)

    const contract = {
      id: crypto.randomUUID(),
      maHopDong: genContractCode(),
      maKhachHang: randInt(1001, 2000),
      tenKhachHang: names[randInt(0, names.length - 1)],
      nhanVienTao: staffNames[randInt(0, staffNames.length - 1)],
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
      hinhThucThanhToan: ENUM_PAY[randInt(0, 3)],
      ngayDongTien: ngayKy,
      ghiChu: 'Cọc 30% (mock)',
      nguoiGhiNhan: 'demo_admin',
      ngayTao: new Date().toLocaleString('vi-VN')
    })

    // Random extra payments
    const extraPay = randInt(0, 2)
    for (let k = 0; k < extraPay; k++) {
      contract.dotDongTien.push({
        id: crypto.randomUUID(),
        soTienDong: randInt(200000, Math.max(300000, Math.round(giaSau * 0.35))),
        hinhThucThanhToan: ENUM_PAY[randInt(0, 3)],
        ngayDongTien: todayISO(),
        ghiChu: `Đợt ${k + 2} (mock)`,
        nguoiGhiNhan: 'demo_admin',
        ngayTao: new Date().toLocaleString('vi-VN')
      })
    }

    // Random refund (10% chance)
    if (Math.random() < 0.10) {
      contract.hoanTien.push({
        id: crypto.randomUUID(),
        soTienHoan: randInt(100000, 800000),
        lyDoHoan: 'Hoàn một phần (mock)',
        ngayHoan: todayISO(),
        nguoiDuyet: 'demo_ke_toan',
        ngayTao: new Date().toLocaleString('vi-VN')
      })
    }

    // Random adjustment (25% chance)
    if (Math.random() < 0.25) {
      const sign = Math.random() < 0.55 ? -1 : 1
      const amt = sign * randInt(200000, 1200000)
      const type = sign < 0 ? 'GIAM_GIA' : (Math.random() < 0.5 ? 'PHU_THU' : 'PHAT')

      contract.dieuChinh.push({
        id: crypto.randomUUID(),
        soTienDieuChinh: amt,
        loaiDieuChinh: type,
        lyDo: sign < 0 ? 'Giảm thêm (mock)' : 'Phụ thu/Phạt (mock)',
        ngayTao: new Date().toLocaleString('vi-VN')
      })
    }

    contracts.value.unshift(contract)
  }

  showCenterWarning('Mock dữ liệu', 'Đã tạo thêm 5 hợp đồng mẫu.')
}

// Initialize sample data
const init3Samples = () => {
  const serviceList = serviceOptions.value
  const findService = (name) => serviceList.find(s => s.name === name) || serviceList[0] || null
  const base = [
    {
      maKhachHang: 1001,
      tenKhachHang: 'Nguyễn Văn A',
      tenDichVu: 'Thiết kế UI Website',
      phiGiam: 1000000,
      trangThaiHopDong: 'DANG_HIEU_LUC',
      ngayKy: todayISO(),
      initPlan: 'COC',
      tiLeCoc: 30
    },
    {
      maKhachHang: 1020,
      tenKhachHang: 'Trần Thị B',
      tenDichVu: 'SEO & Tối ưu Onpage',
      phiGiam: 0,
      trangThaiHopDong: 'HOAN_TAT',
      ngayKy: todayISO(),
      initPlan: 'FULL',
      tiLeCoc: null
    },
    {
      maKhachHang: 1108,
      tenKhachHang: 'Lê Hoàng C',
      tenDichVu: 'Branding / Bộ nhận diện',
      phiGiam: 1500000,
      trangThaiHopDong: 'DANG_HIEU_LUC',
      ngayKy: todayISO(),
      initPlan: 'COC',
      tiLeCoc: 40
    }
  ]

  contracts.value = base.map((x) => {
    const service = findService(x.tenDichVu)
    const segments = service ? getSegmentsByService(service.id || service.name) : []
    const pickedSegment = segments.length ? segments[0] : null
    const assetValue = pickedSegment
        ? Math.round((Number(pickedSegment.min) + Number(pickedSegment.max)) / 2)
        : randInt(500000000, 5000000000)
    const giaGoc = pickedSegment ? Number(pickedSegment.price || 0) : randPriceForService(x.tenDichVu)
    const giaSau = Math.max(0, giaGoc - (x.phiGiam || 0))
    const code = genContractCode()

    const contract = {
      id: crypto.randomUUID(),
      maHopDong: code,
      maKhachHang: x.maKhachHang,
      tenKhachHang: x.tenKhachHang,
      nhanVienTao: currentUserName.value,
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

// Lifecycle
onMounted(async () => {
  document.addEventListener('click', handleDocumentClick)
  await Promise.all([fetchServices(), fetchSegments()])
  resetContractForm()
  await applyContractDraftFromAppointment()
  await fetchContracts()
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
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
  padding: 5px 20px;
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
  padding: 0px 22px 16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.header-menu-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(102,126,234,.35);
  background: rgba(248,250,252,.9);
  color: #334155;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}
.header-menu-toggle:hover {
  background: rgba(226,232,240,.9);
  border-color: rgba(148,163,184,.9);
  color: #1e293b;
}
.header-menu-toggle:active {
  transform: scale(0.98);
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
.user-chip{
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.7);
  border: 1px solid rgba(15,23,42,.08);
}
.user-meta{
  display:flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.1;
}
.user-name{
  font-size: 13px;
  font-weight: 750;
  color: #0f172a;
}
.user-role{
  font-size: 11px;
  color: rgba(15,23,42,.6);
  font-weight: 600;
}
.user-avatar{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid rgba(15,23,42,.12);
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #fff;
  background: var(--primary-gradient);
  text-transform: uppercase;
}
.user-avatar--fallback{
  display: grid;
  place-items: center;
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
  grid-template-columns: 4.2fr 220px 190px  190px 190px 150px;
  gap: 10px;
  align-items:end;
  width: 100%;
  max-width: 1280px;
}
@media (max-width: 1100px){
  .tools{ grid-template-columns: 1fr 220px 190px; }
  .tools .tools-actions{ grid-column: 1 / -1; justify-content:flex-start; }
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
.filter-item input,
.filter-item select{
  background: linear-gradient(135deg, rgba(102,126,234,.08), rgba(79,172,254,.06)) !important;
}
.filter-search input{ border-color: rgba(79,172,254,.35); }
.filter-service select{ border-color: rgba(240,147,251,.35); }
.filter-status select{ border-color: rgba(67,233,123,.35); }
.filter-item.active input,
.filter-item.active select{
  box-shadow: 0 0 0 4px rgba(102,126,234,.16);
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

.stat-card{
  border-radius: 16px;
  padding: 18px 20px;
  color: #fff;
  transition: var(--t);
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(20,30,48,.16);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.stat-card::before{
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  opacity: 0.9;
  z-index: 1;
}
.stat-card::after{
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(30deg);
  transition: var(--t);
  z-index: 2;
}
.stat-card:hover::after{ transform: rotate(30deg) translateX(100px); }
.stat-card-content{ position: relative; z-index: 3; }
.stat-card h5{
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.stat-card .stat-number{
  font-size: 24px;
  font-weight: 800;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.stat-icon{
  position: absolute;
  bottom: 14px;
  right: 14px;
  font-size: 36px;
  opacity: 0.3;
  z-index: 3;
  transition: var(--t);
}
.stat-card:hover .stat-icon{
  transform: scale(1.05) rotate(5deg);
  opacity: 0.4;
}
.kpi-total{ background: var(--primary-gradient); }
.kpi-revenue{ background: var(--success-gradient); }
.kpi-adjust{ background: var(--warning-gradient); }
.kpi-sales{ background: var(--secondary-gradient); }
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
  font-weight: 600;
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

.pagination{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  padding: 12px 12px;
  flex-wrap: wrap;
}
.pager{
  display:flex;
  align-items:center;
  gap:6px;
  flex-wrap: wrap;
}
.btn-page{
  height: 32px;
  padding: 0 10px;
  border-radius: 10px;
}
.btn-page.active{
  background: var(--primary-gradient);
  color:#fff;
  border-color: transparent;
}

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
  position: relative;
  display:flex;
  justify-content:center;
  align-items:center;
  min-width: 40px;
}
.action-menu{
  display: grid;
  gap: 6px;
  padding: 8px;
  border-radius: 14px;
  background: rgb(255, 255, 255);
  border: 1px solid rgba(20,30,48,.12);
  box-shadow: 0 14px 26px rgba(20,30,48,.12);
  z-index: 2000;
  width: 200px;
}
.action-menu--floating{
  position: fixed;
  transform: translateY(-50%);
}
.action-item{
  display:flex;
  align-items:center;
  gap:10px;
  padding: 6px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: var(--t);
}
.action-item:hover{
  background: rgba(20,30,48,.04);
}
.action-label{
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}
.action-item.disabled{
  cursor: not-allowed;
  opacity: .55;
  pointer-events: none;
}
.action-item.disabled .icon-btn{
  filter: grayscale(1);
}
.icon-menu{
  --ig: var(--dark-gradient);
  background: linear-gradient(135deg, rgba(20,30,48,.12), rgba(36,59,85,.08));
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
.icon-btn.disabled{
  cursor: not-allowed;
  filter: grayscale(1);
  opacity: .5;
  box-shadow: none;
  pointer-events: none;
}
.icon-btn:hover{ transform: translateY(-1px); filter: brightness(1.02); }
.icon-btn.disabled:hover{ transform: none; filter: grayscale(1); }
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
.modal-card.pay-modal{
  width: min(1120px, 100%);
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
.detail-grid{
  grid-template-columns: 1fr !important;
}
.detail-grid > .card{
  grid-column: 1 / -1;
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
  grid-template-columns: 1fr;
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
