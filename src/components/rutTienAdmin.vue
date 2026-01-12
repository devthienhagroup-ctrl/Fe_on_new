<template>
  <div class="wr-page">

    <!-- TOP BAR -->
    <div class="wr-top">
      <div class="wr-title">
        <div class="wr-h1">Quản lý yêu cầu rút tiền</div>
        <div class="wr-sub">
          Theo dõi yêu cầu rút tiền từ ví cá nhân, xử lý và đối soát nhanh.
        </div>
      </div>

      <div class="wr-top-actions">
        <div class="wr-kpi">
          <div class="kpi-box">
            <div class="kpi-label">Chưa chuyển</div>
            <div class="kpi-value">{{ activeTab === 'PENDING' ? requests.length : '—' }}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Đã chuyển</div>
            <div class="kpi-value">{{ activeTab === 'SUCCESS' ? requests.length : '—' }}</div>
          </div>
          <div class="kpi-box">
            <div class="kpi-label">Tổng</div>
            <div class="kpi-value">{{ requests.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- TABS -->
    <div class="wr-tabs">
      <button
          class="tab tab-pending"
          :class="{ active: activeTab === 'PENDING' }"
          @click="activeTab = 'PENDING'"
      >
        <span class="dot dot-pending"></span>
        Chưa chuyển
        <span class="pill" v-if="activeTab === 'PENDING'">{{ requests.length }}</span>
      </button>

      <button
          class="tab tab-done"
          :class="{ active: activeTab === 'DONE' }"
          @click="activeTab = 'DONE'"
      >
        <span class="dot dot-done"></span>
        Đã chuyển
        <span class="pill" v-if="activeTab === 'DONE'">{{ requests.length }}</span>
      </button>
    </div>

    <!-- TABLE -->
    <div class="wr-card">
      <div class="wr-table-wrap">
        <table class="wr-table">
          <thead>
          <tr>
            <th style="width:280px">Khách hàng</th>
            <th style="width:140px" class="right">Số tiền</th>
            <th style="width:200px">Ngân hàng</th>
            <th style="width:220px">Số tài khoản</th>
            <th>Nội dung chuyển khoản</th>
            <th style="width:170px">TG yêu cầu</th>
            <th style="width:150px">Trạng thái</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="item in requests" :key="item.id">
            <!-- User -->
            <td>
              <div class="user-cell">
                <img
                    :src="resolveAvatar(item.avatar)"
                    class="avatar"
                    alt="avatar"
                    loading="lazy"
                />
                <div class="u-meta">
                  <div class="u-name">{{ item.customerName }}</div>
                  <div class="u-sub muted">{{ item.customerPhone || '—' }}</div>
                </div>
              </div>
            </td>


            <!-- Amount -->
            <td class="left">
              <div class="amount">
                <div class="amt">{{ formatMoney(item.amount) }}</div>
                <div class="muted small">VNĐ</div>
              </div>
            </td>

            <!-- Bank -->
            <td>
              <div class="bank-cell">
                <img v-if="item.bankLogo" :src="item.bankLogo" class="bank-logo" />
                <div class="bank-name">
                  <div class="b1">{{ item.bankName }}</div>
                  <div class="muted small">{{ item.bankCode || '—' }}</div>
                </div>
              </div>
            </td>

            <!-- Account -->
            <td>
              <div class="copy-row">
                <span class="mono">{{ item.accountNumber }}</span>
                <button
                    class="icon-btn"
                    :class="{ ok: copiedKey === `acc_${item.id}` }"
                    @click="copySilent(item.accountNumber, `acc_${item.id}`)"
                >
                  <i class="fas"
                     :class="copiedKey === `acc_${item.id}` ? 'fa-check' : 'fa-copy'"></i>
                </button>
              </div>
            </td>

            <!-- Content -->
            <td>
              <div class="copy-row">
                <span class="mono ellipsis">{{ item.transferContent }}</span>
                <button
                    class="icon-btn"
                    :class="{ ok: copiedKey === `ct_${item.id}` }"
                    @click="copySilent(item.transferContent, `ct_${item.id}`)"
                >
                  <i class="fas"
                     :class="copiedKey === `ct_${item.id}` ? 'fa-check' : 'fa-copy'"></i>
                </button>
              </div>
            </td>

            <!-- Created -->
            <td>{{ formatDateTime(item.createdAt) }}</td>

            <!-- Status -->
            <td>
                <span class="status" :class="item.status === 'PENDING' ? 'pending' : 'done'">
                  <i class="fas"
                     :class="item.status === 'PENDING' ? 'fa-clock' : 'fa-circle-check'"></i>
                  {{ item.status === 'PENDING' ? 'Ch.Chuyển' : 'Đã chuyển' }}
                </span>
              <div v-if="item.status === 'DONE' && item.transferredAt"
                   class="muted small mt-1">
                CK: {{ formatDateTime(item.transferredAt) }}
              </div>
            </td>
          </tr>

          <!-- EMPTY -->
          <tr v-if="requests.length === 0">
            <td colspan="9" class="empty">
              <div class="empty-box">
                <i class="fas fa-inbox"></i>
                <div>Không có dữ liệu</div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- FOOTER -->
      <div class="wr-footer">
        <div class="muted">
          Hiển thị <b>{{ pagedFrom }}</b> - <b>{{ pagedTo }}</b>
        </div>

        <div class="pager">
          <button class="btn ghost sm" :disabled="page === 1" @click="page = 1">
            <i class="fas fa-angles-left"></i>
          </button>
          <button class="btn ghost sm" :disabled="page === 1" @click="page--">
            <i class="fas fa-angle-left"></i>
          </button>

          <div class="page-pill">
            Trang <b>{{ page }}</b> / <b>{{ totalPages }}</b>
          </div>

          <button class="btn ghost sm" :disabled="page === totalPages" @click="page++">
            <i class="fas fa-angle-right"></i>
          </button>
          <button class="btn ghost sm" :disabled="page === totalPages" @click="page = totalPages">
            <i class="fas fa-angles-right"></i>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import api from '/src/api/api.js'

/* =========================
   STATE
========================= */
const activeTab = ref('PENDING')

const page = ref(1)
const pageSize = ref(10)
const totalPages = ref(1)
const loading = ref(false)

const requests = ref([])

const copiedKey = ref('')
let copiedTimer = null

const showDetail = ref(false)
const selected = ref(null)

const showConfirm = ref(false)
const confirmItem = ref(null)

/* =========================
   BANK MASTER (FE tự map logo)
========================= */
const banks = ref([
// BIG 4
  { code: 'VCB', name: 'Vietcombank', shortName: 'VCB', logo: 'https://api.vietqr.io/img/VCB.png' },
  { code: 'BIDV', name: 'BIDV', shortName: 'BIDV', logo: 'https://api.vietqr.io/img/BIDV.png' },
  { code: 'MB', name: 'MB Bank', shortName: 'MB', logo: 'https://api.vietqr.io/img/MB.png' },
  { code: 'CTG', name: 'VietinBank', shortName: 'CTG', logo: 'https://fingo.vn/wp-content/uploads/2022/11/vietinbank.png' },
  { code: 'AGRIBANK', name: 'Agribank', shortName: 'AGR', logo: 'https://cdn.luatminhkhue.vn/lmk/article/2023/images%20(9).jpg' },

// TMCP lớn
  { code: 'TCB', name: 'Techcombank', shortName: 'TCB', logo: 'https://api.vietqr.io/img/TCB.png' },
  { code: 'ACB', name: 'Asia Commercial Bank', shortName: 'ACB', logo: 'https://api.vietqr.io/img/ACB.png' },
  { code: 'VPB', name: 'VPBank', shortName: 'VPB', logo: 'https://api.vietqr.io/img/VPB.png' },
  { code: 'STB', name: 'Sacombank', shortName: 'STB', logo: 'https://api.vietqr.io/img/STB.png' },
  { code: 'TPB', name: 'TPBank', shortName: 'TPB', logo: 'https://api.vietqr.io/img/TPB.png' },
  { code: 'HDB', name: 'HDBank', shortName: 'HDB', logo: 'https://api.vietqr.io/img/HDB.png' },
  { code: 'VIB', name: 'VIB', shortName: 'VIB', logo: 'https://api.vietqr.io/img/VIB.png' },
  { code: 'MSB', name: 'MSB', shortName: 'MSB', logo: 'https://api.vietqr.io/img/MSB.png' },
  { code: 'OCB', name: 'OCB', shortName: 'OCB', logo: 'https://api.vietqr.io/img/OCB.png' },
  { code: 'SCB', name: 'SCB', shortName: 'SCB', logo: 'https://api.vietqr.io/img/SCB.png' },
  { code: 'SHB', name: 'SHB', shortName: 'SHB', logo: 'https://api.vietqr.io/img/SHB.png' },
  { code: 'EXIM', name: 'Eximbank', shortName: 'EIB', logo: 'https://api.vietqr.io/img/EIB.png' },
  { code: 'LPB', name: 'LPBank', shortName: 'LPB', logo: 'https://api.vietqr.io/img/LPB.png' },
  { code: 'BAB', name: 'Bac A Bank', shortName: 'BAB', logo: 'https://api.vietqr.io/img/BAB.png' },
  { code: 'SEAB', name: 'SeABank', shortName: 'SEAB', logo: 'https://api.vietqr.io/img/SEAB.png' },
  { code: 'KLB', name: 'KienlongBank', shortName: 'KLB', logo: 'https://api.vietqr.io/img/KLB.png' },
  { code: 'PGB', name: 'PG Bank', shortName: 'PGB', logo: 'https://api.vietqr.io/img/PGB.png' },
  { code: 'ABB', name: 'ABBANK', shortName: 'ABB', logo: 'https://api.vietqr.io/img/ABB.png' },
  { code: 'NAB', name: 'Nam A Bank', shortName: 'NAB', logo: 'https://api.vietqr.io/img/NAB.png' },
  { code: 'BVB', name: 'BaoViet Bank', shortName: 'BVB', logo: 'https://api.vietqr.io/img/BVB.png' },
  { code: 'VAB', name: 'VietABank', shortName: 'VAB', logo: 'https://api.vietqr.io/img/VAB.png' },

// NGÂN HÀNG SỐ / VÍ
  { code: 'TPBANK', name: 'TPBank Digital', shortName: 'TPB', logo: 'https://api.vietqr.io/img/TPB.png' }
])

const bankMap = computed(() => {
  const map = {}
  banks.value.forEach(b => (map[b.code] = b))
  return map
})

/* =========================
   API
========================= */
const fetchRequests = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/withdraw/requests', {
      params: {
        status: activeTab.value,
        page: page.value - 1, // Spring page bắt đầu từ 0
        size: pageSize.value
      }
    })

    const data = res.data

    requests.value = (data.content || []).map(r => {
      const bank = bankMap.value[r.bankCode] || {}
      return {
        ...r,
        bankName: bank.name || r.bankName,
        bankLogo: bank.logo || ''
      }
    })

    totalPages.value = data.totalPages || 1
  } finally {
    loading.value = false
  }
}

/* =========================
   WATCH
========================= */
watch([activeTab, page, pageSize], () => {
  fetchRequests()
}, { immediate: true })

watch(activeTab, () => {
  page.value = 1
})
const AVATAR_BASE = 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'

const resolveAvatar = (avatar) => {
  if (!avatar) {
    return AVATAR_BASE + 'vat-default.jpg'
  }

  // avatar đã là full URL
  if (avatar.startsWith('http')) {
    return avatar
  }

  // avatar là path BE trả về
  return AVATAR_BASE + avatar
}

/* =========================
   PAGINATION
========================= */
const canPrev = computed(() => page.value > 1)
const canNext = computed(() => page.value < totalPages.value)

const prevPage = () => {
  if (canPrev.value) page.value--
}

const nextPage = () => {
  if (canNext.value) page.value++
}

/* =========================
   ACTIONS
========================= */
const copySilent = async (text, key) => {
  try {
    await navigator.clipboard.writeText(String(text ?? ''))
    copiedKey.value = key
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => (copiedKey.value = ''), 650)
  } catch (_) {}
}

const openDetail = (item) => {
  selected.value = item
  showDetail.value = true
}

const closeDetail = () => {
  showDetail.value = false
  selected.value = null
}

const openConfirm = (item) => {
  confirmItem.value = item
  showConfirm.value = true
}

const closeConfirm = () => {
  showConfirm.value = false
  confirmItem.value = null
}



/* =========================
   FORMATS
========================= */
const formatMoney = (v) =>
    Number(v || 0).toLocaleString('vi-VN')

const formatDateTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('vi-VN')
}
import { useAuthStore } from "/src/stores/authStore.js"
const authStore = useAuthStore()
import { onMounted, onUnmounted } from 'vue'
import { socketService } from '/src/services/socketService'
import { SOCKET_CONFIG } from '/src/config/socketConfig'
onMounted(() => {

  const token = () => authStore.accessToken
  socketService.connect(token)

  const adminId = authStore.userInfo?.id
  if (!adminId) return

  /* =========================
     SOCKET – ADMIN RÚT TIỀN
  ========================= */
  socketService.subscribe(
      SOCKET_CONFIG.withdrawAdminTopic(adminId),
      (event) => {
        console.log('💸 [ADMIN SOCKET] Withdraw event:', event)

        // event.type: DONE | MISMATCH | NOT_FOUND
        // event.payload: transactionId, code, amount, bankAccount, message

        // reload danh sách rút tiền
        fetchRequests()
      }
  )
})

</script>

<style scoped>
/* =========================
   THEME
========================= */
.wr-page {
  padding: 22px;
  background: #f6f8fc;
  min-height: 100vh;
  color: #0f172a;
}

.muted { color: #64748b; }
.small { font-size: 12px; }
.mt-4 { margin-top: 4px; }
.mt-6 { margin-top: 6px; }

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  letter-spacing: 0.2px;
}

/* =========================
   TOP
========================= */
.wr-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.wr-title .wr-h1 {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.3px;
  color: #071341;
}

.wr-title .wr-sub {
  margin-top: 6px;
  color: #64748b;
  font-weight: 500;
}

.wr-kpi {
  display: flex;
  gap: 10px;
}

.kpi-box {
  background: white;
  border: 1px solid #e8eef7;
  border-radius: 14px;
  padding: 10px 12px;
  min-width: 120px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.04);
}

.kpi-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
}

.kpi-value {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 900;
  color: #071341;
}

/* =========================
   TABS
========================= */
.wr-tabs {
  display: flex;
  gap: 10px;
  margin: 14px 0 12px;
}

.tab {
  border: 1px solid #e8eef7;
  background: #ffffff;
  color: #0f172a;
  border-radius: 14px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
  box-shadow: 0 10px 28px rgba(2, 6, 23, 0.04);
}

.tab:hover { transform: translateY(-1px); }

.tab.active {
  background: linear-gradient(135deg, #071341 0%, #0b2bd6 100%);
  color: #fff;
  border-color: rgba(255,255,255,0.15);
  box-shadow: 0 14px 32px rgba(11, 43, 214, 0.22);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 99px;
  display: inline-block;
}

.dot-pending { background: #f59e0b; box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.15); }
.dot-done { background: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15); }

.pill {
  font-size: 12px;
  font-weight: 900;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.06);
}

.tab.active .pill { background: rgba(255,255,255,0.22); }

/* =========================
   TOOLBAR
========================= */
.wr-toolbar {
  background: white;
  border: 1px solid #e8eef7;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 14px 34px rgba(2, 6, 23, 0.04);
}

.wr-toolbar .left {
  flex: 1;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 320px;
  flex: 1;
  border: 1px solid #e8eef7;
  border-radius: 14px;
  padding: 10px 12px;
  background: #fbfdff;
}

.search i { color: #94a3b8; }

.search input {
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
  font-weight: 700;
  color: #0f172a;
}

.search .clear {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.select {
  border: 1px solid #e8eef7;
  border-radius: 12px;
  padding: 10px 12px;
  background: #fbfdff;
  font-weight: 800;
  color: #0f172a;
  outline: none;
}

.w-xs { width: 84px; }
.w-sm { width: 100px; }
.w-md { width: 120px; }

.page-size {
  display: flex;
  gap: 8px;
  align-items: center;
}

.right { text-align: right; }
.center { text-align: center; }

/* =========================
   CARD + TABLE
========================= */
.wr-card {
  margin-top: 12px;
  background: white;
  border: 1px solid #e8eef7;
  border-radius: 16px;
  box-shadow: 0 18px 44px rgba(2, 6, 23, 0.05);
  overflow: hidden;
}

.wr-table-wrap { overflow: auto; }

.wr-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1180px;
}

.wr-table thead th {
  position: sticky;
  top: 0;
  background: #f7faff;
  border-bottom: 1px solid #e8eef7;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #475569;
  padding: 14px 14px;
  text-align: left;
  font-weight: 900;
}

.wr-table tbody td {
  padding: 14px 14px;
  border-bottom: 1px solid #eef3fb;
  vertical-align: middle;
  color: #0f172a;
}

.wr-table tbody tr:hover {
  background: #fbfdff;
}

/* user */
.user-cell {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  object-fit: cover;
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.12);
}

.avatar.xl { width: 64px; height: 64px; }

.u-name { font-weight: 900; color: #071341; }
.u-name.xl { font-size: 18px; }
.u-sub { font-size: 12px; }

/* bank */
.bank-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bank-logo {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  object-fit: contain;
  background: #fff;
  border: 1px solid #eef3fb;
  padding: 4px;
}

.bank-name .b1 { font-weight: 900; }
.amount .amt { font-weight: 900; color: #071341; }

/* copy row */
.copy-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
}

.ellipsis {
  max-width: 420px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid #e8eef7;
  background: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform .12s ease, background .12s ease, border-color .12s ease;
  color: #071341;
}

.icon-btn:hover { transform: translateY(-1px); background: #f7faff; border-color: #dbe7fb; }

.icon-btn.ok {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
  color: #0f766e;
}

.icon-btn.close { border-radius: 12px; }

/* status */
.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 13px;
}

.status.pending {
  background: rgba(245, 158, 11, 0.14);
  color: #92400e;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.status.done {
  background: rgba(16, 185, 129, 0.14);
  color: #065f46;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.status.mini {
  padding: 4px 10px;
  font-size: 12px;
  margin-left: 10px;
}

/* buttons */
.btn {
  border: 1px solid #e8eef7;
  background: #fff;
  border-radius: 14px;
  padding: 10px 14px;
  font-weight: 900;
  cursor: pointer;
  color: #071341;
  transition: transform .12s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;
}

.btn:hover { transform: translateY(-1px); background: #f7faff; border-color: #dbe7fb; }

.btn.primary {
  background: linear-gradient(135deg, #071341 0%, #0b2bd6 100%);
  color: #fff;
  border-color: rgba(255,255,255,0.15);
  box-shadow: 0 14px 32px rgba(11, 43, 214, 0.22);
}

.btn.primary:hover { background: linear-gradient(135deg, #071341 0%, #1a43ff 100%); }

.btn.ghost { background: #fff; }
.btn.sm { padding: 8px 10px; border-radius: 12px; }

.actions {
  display: inline-flex;
  gap: 8px;
  justify-content: center;
}

/* empty */
.empty {
  padding: 30px 12px;
  text-align: center;
}

.empty-box { display: inline-block; padding: 10px 0 18px; }
.empty-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(148, 163, 184, 0.14);
  color: #64748b;
}

.empty-title { font-weight: 900; color: #071341; }
.empty-sub { margin-top: 6px; color: #64748b; font-weight: 700; }

/* footer */
.wr-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-top: 1px solid #eef3fb;
  background: #fbfdff;
}

.pager {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.page-pill {
  padding: 8px 12px;
  border-radius: 14px;
  border: 1px solid #e8eef7;
  background: #ffffff;
  font-weight: 900;
}

/* =========================
   DRAWER
========================= */
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.45);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
}

.drawer {
  width: 520px;
  max-width: 92vw;
  height: 100%;
  background: #fff;
  box-shadow: -30px 0 90px rgba(2, 6, 23, 0.25);
  display: flex;
  flex-direction: column;
}

.drawer-head {
  padding: 14px 16px;
  border-bottom: 1px solid #eef3fb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.drawer-title {
  font-weight: 900;
  font-size: 16px;
  color: #071341;
}

.drawer-body {
  padding: 16px;
  overflow: auto;
}

.d-user {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid #eef3fb;
  background: #fbfdff;
}

.grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.box {
  border: 1px solid #eef3fb;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
}

.box.full { grid-column: 1 / -1; }

.box-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.box-value {
  margin-top: 6px;
  font-weight: 900;
  color: #071341;
}

.drawer-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* =========================
   MODAL
========================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.45);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: 520px;
  max-width: 92vw;
  background: #fff;
  border-radius: 18px;
  border: 1px solid #eef3fb;
  box-shadow: 0 30px 90px rgba(2, 6, 23, 0.3);
  overflow: hidden;
}

.modal-head {
  padding: 14px 16px;
  border-bottom: 1px solid #eef3fb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fbfdff;
}

.modal-title {
  font-weight: 900;
  color: #071341;
}

.modal-body {
  padding: 14px 16px;
}

.confirm-line {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed #eef3fb;
}

.note {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.25);
  font-weight: 500;
}

.modal-actions {
  padding: 14px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eef3fb;
  background: #fbfdff;
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 900px) {
  .wr-top { flex-direction: column; align-items: stretch; }
  .wr-kpi { flex-wrap: wrap; }
  .search { min-width: 240px; }
}
</style>
