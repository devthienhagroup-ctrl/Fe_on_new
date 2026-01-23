<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import api from '/src/api/api.js'

/* =========================
   USER (tạm – lấy từ auth sau)
========================= */
function formatDiaChi(raw) {
  if (!raw) return ''

  return raw
      .split('/!!')
      .map(s => s.trim())
      .filter(Boolean)
      .join(', ')
}

function formatHoaHong(value) {
  if (value == null || isNaN(value)) return '0.00'
  return Number(value).toFixed(2)
}

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const mins = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMs / 3600000)
  const days = Math.floor(diffMs / 86400000)
  if (mins < 1) return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days === 1) return 'Hôm qua'
  if (days < 7) return `${days} ngày trước`
  return formatDate(dateString)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

/* =========================
   FORMAT
========================= */
function formatMoneyVN(value) {
  if (value == null || isNaN(value)) return "0"
  const num = Number(value)
  if (num < 1_000_000) return num.toLocaleString("vi-VN")
  if (num < 1_000_000_000) {
    const trieu = num / 1_000_000
    return `${trieu.toFixed(trieu % 1 === 0 ? 0 : 1)} triệu`
  }
  const ty = num / 1_000_000_000
  return `${ty.toFixed(ty % 1 === 0 ? 0 : 2)} tỷ`
}

/* =========================
   STATUS
========================= */
const STATUS = {
  CHO_XU_LY: { label: 'Đang chờ', pill: 'pill-wait', dot: 'dot-wait' },
  DONG_Y: { label: 'Đã đồng ý', pill: 'pill-accept', dot: 'dot-accept' },
  TU_CHOI: { label: 'Từ chối', pill: 'pill-reject', dot: 'dot-reject' }
}

/* =========================
   STATE
========================= */
const requests = ref([])
const loadingList = ref(false)

const activeTab = ref('ALL')
const keyword = ref('')
const sortMode = ref('NEWEST')

/* =========================
   THỐNG KÊ
========================= */
const thongKe = ref({
  sentMonth: 0,
  acceptedMonth: 0,
  rejectedMonth: 0,
  sentTotal: 0,
  acceptedTotal: 0,
  rejectedTotal: 0
})

/* =========================
   COMPUTED KPI
========================= */
const totalSentMonth = computed(() => thongKe.value.sentMonth)
const totalAcceptedMonth = computed(() => thongKe.value.acceptedMonth)
const totalRejectedMonth = computed(() => thongKe.value.rejectedMonth)

const totalSentAll = computed(() => thongKe.value.sentTotal)
const totalAcceptedAll = computed(() => thongKe.value.acceptedTotal)
const totalRejectedAll = computed(() => thongKe.value.rejectedTotal)
const totalWait = computed(
    () => totalSentAll.value - totalRejectedAll.value - totalAcceptedAll.value
)

/* =========================
   DONUT DATA
========================= */
const countAccept = computed(() => thongKe.value.acceptedTotal)
const countReject = computed(() => thongKe.value.rejectedTotal)
const countWait = computed(() =>
    thongKe.value.sentTotal
    - thongKe.value.acceptedTotal
    - thongKe.value.rejectedTotal
)

/* =========================
   LOAD THỐNG KÊ
========================= */
const loadThongKe = async () => {
  try {
    const { data } = await api.get(
        '/user/api/de-nghi-hop-tac/thong-ke'
    )
    thongKe.value = data
  } catch (e) {
    console.error('Load thống kê thất bại', e)
  }
}

/* =========================
   LOAD DANH SÁCH
========================= */
const loadDanhSach = async () => {
  loadingList.value = true
  try {
    const { data } = await api.get(
        '/user/api/de-nghi-hop-tac/danh-sach',
        {
          params: {
            q: keyword.value,
            tab: activeTab.value,
            sort: sortMode.value
          }
        }
    )
    requests.value = data
  } catch (e) {
    console.error('Load danh sách thất bại', e)
  } finally {
    loadingList.value = false
  }
}

/* =========================
   WATCH – TỰ LOAD
========================= */
watch(activeTab, loadDanhSach)
watch(sortMode, loadDanhSach)

/* debounce search 500ms */
let searchTimer
watch(keyword, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(loadDanhSach, 500)
})

/* =========================
   TAB COUNTS (tính từ list)
========================= */
const countAll = computed(() => requests.value.length)
const countWaitTab = computed(() =>
    requests.value.filter(r => r.trangThai === 'CHO_XU_LY').length
)
const countAcceptTab = computed(() =>
    requests.value.filter(r => r.trangThai === 'DONG_Y').length
)
const countRejectTab = computed(() =>
    requests.value.filter(r => r.trangThai === 'TU_CHOI').length
)

const tabs = computed(() => ([
  { key: 'ALL', label: 'Tất cả', count: totalSentAll.value },
  { key: 'CHO_XU_LY', label: 'Đang chờ', count: totalWait.value  },
  { key: 'DONG_Y', label: 'Đồng ý', count: totalAcceptedAll.value },
  { key: 'TU_CHOI', label: 'Từ chối', count: totalRejectedAll.value }
]))

const statusInfo = (k) => STATUS[k] || {}

/* =========================
   CHARTS
========================= */
let barChart, donutChart

const buildCharts = async () => {
  await nextTick()
  if (barChart) barChart.destroy()
  if (donutChart) donutChart.destroy()

  const barEl = document.getElementById('barChart')
  const donutEl = document.getElementById('donutChart')
  if (!barEl || !donutEl) return

  /* BAR */
  barChart = new Chart(barEl, {
    type: 'bar',
    data: {
      labels: ['Tháng này', 'Tất cả'],
      datasets: [
        {
          label: 'Đã gửi',
          data: [totalSentMonth.value, totalAcceptedAll.value],
          backgroundColor: 'rgba(59,130,246,.95)',
          borderRadius: 8
        },
        {
          label: 'Đồng ý',
          data: [totalAcceptedMonth.value, totalAcceptedAll.value],
          backgroundColor: 'rgba(16,185,129,.95)',
          borderRadius: 8
        },
        {
          label: 'Từ chối',
          data: [totalRejectedMonth.value, totalRejectedAll.value],
          backgroundColor: 'rgba(239,68,68,.95)',
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          // Thêm cấu hình để giảm khoảng cách và thu hẹp cột
          barPercentage: 0.6, // Giảm chiều rộng cột (0.8 mặc định, 0.6 sẽ nhỏ hơn)
          categoryPercentage: 0.7 // Giảm không gian của nhóm cột
        },
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      },
      // Có thể thêm tùy chọn datasets để điều chỉnh chiều rộng
      datasets: {
        bar: {
          barThickness: 'flex', // hoặc đặt giá trị cụ thể như 20
          maxBarThickness: 40 // Giới hạn chiều rộng tối đa
        }
      },
      // Điều chỉnh layout để có thêm không gian
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 0,
          bottom: 0
        }
      }
    }
  })

  /* DONUT + TEXT GIỮA */
  donutChart = new Chart(donutEl, {
    type: 'doughnut',
    data: {
      labels: ['Chờ xử lý', 'Đồng ý', 'Từ chối'],
      datasets: [{
        data: [countWait.value, countAccept.value, countReject.value],
        backgroundColor: [
          'rgba(245,158,11,.95)',
          'rgba(16,185,129,.95)',
          'rgba(239,68,68,.95)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%'
    },
    plugins: [{
      id: 'centerText',
      afterDraw(chart) {
        const { ctx } = chart
        const meta = chart.getDatasetMeta(0)
        if (!meta?.data?.[0]) return
        const x = meta.data[0].x
        const y = meta.data[0].y
        const total =
            countWait.value + countAccept.value + countReject.value

        ctx.save()
        ctx.textAlign = 'center'
        ctx.fillStyle = '#0f172a'
        ctx.font = '800 26px Inter'
        ctx.fillText(total, x, y - 6)
        ctx.fillStyle = '#64748b'
        ctx.font = '500 13px Inter'
        ctx.fillText('tổng yêu cầu', x, y + 18)
        ctx.restore()
      }
    }]
  })
}

/* =========================
   INIT
========================= */

import { socketService } from "/src/services/socketService.js"
import { SOCKET_CONFIG } from "/src/config/socketConfig.js"
import { useAuthStore } from "/src/stores/authStore.js"
const authStore = useAuthStore()
onMounted(async () => {
  // 1️⃣ Load lần đầu (song song)
  await Promise.all([
    loadThongKe(),
    loadDanhSach()
  ])

  await buildCharts()

  // 2️⃣ Connect socket
  const token = () => authStore.accessToken
  socketService.connect(token)

  const employeeId = authStore.userInfo?.id
  if (!employeeId) return

  // 3️⃣ Subscribe socket
  socketService.subscribe(
      SOCKET_CONFIG.invitationTopic(employeeId),
      async (event) => {
        if (!event?.type) return

        console.log('📩 Invitation socket:', event.type)

        // ✅ chỉ xử lý đúng loại event
        if (
            event.type === 'INVITATION_HANDLED'
        ) {
          await Promise.all([
            loadThongKe(),
            loadDanhSach()
          ])

         await buildCharts()
        }
      }
  )
})


watch(thongKe, buildCharts, { deep: true })
</script>

<template>
  <div class="page" style="margin-top: 60px !important;">
    <!-- ===== HERO ===== -->
    <section class="hero">
      <div class="hero__bg"></div>

      <div class="hero__content">
        <div class="hero__left">
          <div class="hero__title">
            <div class="hero__icon">
              <i class="fa-solid fa-handshake"></i>
            </div>
            <div>
              <h1>Lịch sử yêu cầu hợp tác</h1>
              <p>Theo dõi các lời đề nghị bạn đã gửi — phân loại theo trạng thái & thống kê theo thời gian.</p>
            </div>
          </div>

          <div class="hero__chips">
            <span class="chip chip--soft">
              <i class="fa-regular fa-calendar"></i>
              Tháng này: <b>{{ totalSentMonth }}</b> đã gửi · <b>{{ totalAcceptedMonth }}</b> đồng ý · <b>{{ totalRejectedMonth }}</b> từ chối
            </span>
            <span class="chip chip--solid">
              <i class="fa-solid fa-chart-line"></i>
              Tổng: <b>{{ totalSentAll }}</b> đã gửi · <b>{{ totalAcceptedAll }}</b> đồng ý
            </span>
          </div>
        </div>

        <!-- ===== KPI ===== -->
        <div class="hero__kpi">

          <div class="kpi kpi--violet">
            <div class="kpi__top">
              <span class="kpi__label">Tổng đã gửi</span>
              <span class="kpi__icon"><i class="fa-solid fa-layer-group"></i></span>
            </div>
            <div class="kpi__value">{{ totalSentAll }}</div>
            <div class="kpi__hint">Tất cả dữ liệu</div>
          </div>

          <div class="kpi kpi--emerald">
            <div class="kpi__top">
              <span class="kpi__label">Tổng đồng ý</span>
                <span class="kpi__icon"><i class="fa-solid fa-circle-check"></i></span>
            </div>
            <div class="kpi__value">{{ totalAcceptedAll }}</div>
            <div class="kpi__hint">Tất cả dữ liệu</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== CONTENT ===== -->
    <section class="content">
      <!-- ===== CHARTS ===== -->
      <div class="grid">
        <div class="card card--chart">
          <div class="card__head">
            <div>
              <div class="card__title">Thống kê theo tháng & tổng</div>
              <div class="card__sub">So sánh “đã gửi” và “đồng ý”</div>
            </div>
            <span class="pill pill-ghost">
              <span class="dot dot-ghost"></span> Tổng quan
            </span>
          </div>
          <div class="chartWrap chartWrap--bar">
            <canvas id="barChart"></canvas>
          </div>
        </div>

        <div class="card card--chart">
          <div class="card__head">
            <div>
              <div class="card__title">Tỷ trọng trạng thái</div>
              <div class="card__sub">Phân bổ yêu cầu theo trạng thái</div>
            </div>
          </div>
          <div class="chartWrap chartWrap--donut">
            <canvas id="donutChart"></canvas>
          </div>
        </div>
      </div>

      <!-- ===== FILTER BAR ===== -->
      <div class="toolbar">
        <div class="tabs">
          <button
              v-for="t in tabs"
              :key="t.key"
              class="tab"
              :class="{ active: activeTab === t.key }"
              @click="activeTab = t.key"
          >
            {{ t.label }}
            <span class="tab__count">{{ t.count }}</span>
          </button>
        </div>

        <div class="actions">
          <div class="search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input v-model="keyword" placeholder="Tìm theo địa chỉ, nội dung, tên quản lý..." />
          </div>

          <div class="select">
            <i class="fa-solid fa-arrow-down-wide-short"></i>
            <select v-model="sortMode">
              <option value="NEWEST">Mới nhất</option>
              <option value="OLDEST">Cũ nhất</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ===== LIST ===== -->
      <div v-if="requests.length" class="list">
        <article v-for="r in requests" :key="r.id" class="item">
          <div class="item__top">
            <div class="id">
              <span class="pill" :class="statusInfo(r.trangThai).pill">
                <span class="dot" :class="statusInfo(r.trangThai).dot"></span>
                {{ statusInfo(r.trangThai).label }}
              </span>

              <span v-if="r.duocXemCan" class="pill pill-view">
                <i class="fa-regular fa-eye"></i> Được xem căn
              </span>

              <span v-if="r.tenTeamThamGia" class="pill pill-team">
                <i class="fa-solid fa-users"></i> {{ r.tenTeamThamGia }}
              </span>
            </div>

            <div class="manager">
              <div class="avatar">
                <img v-if="r.nguoiAvatarQuanLy" :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'
                + (r.nguoiAvatarQuanLy == null ? 'vat-default.jpg': r.nguoiAvatarQuanLy )"
                     alt="avatar" />
                <div v-else class="avatar__fallback">
                  <i class="fa-regular fa-user"></i>
                </div>
              </div>
              <div class="manager__info">
                <div class="manager__name">{{ r.tenNguoiQuanLy || 'Quản lý' }}</div>
                <div class="manager__sub">Người quản lý sản phẩm</div>
              </div>
            </div>
          </div>

          <div class="item__mid">
            <div class="addr">
              <i class="fa-solid fa-location-dot"></i>
              <span>{{ formatDiaChi(r.diaChiTaiSan) }}</span>
            </div>

            <div class="metaRow">
              <div class="meta">
                <div class="meta__icon"><i class="fa-solid fa-tag"></i></div>
                <div>
                  <div class="meta__label">Giá bán</div>
                  <div class="meta__value">{{ formatMoneyVN(r.giaBan) }}</div>
                </div>
              </div>

              <div class="meta">
                <div class="meta__icon"><i class="fa-solid fa-percent"></i></div>
                <div>
                  <div class="meta__label">Hoa hồng</div>
                  <div class="meta__value">{{ formatHoaHong(r.hoaHong) }}%</div>
                </div>
              </div>

              <div class="meta">
                <div class="meta__icon"><i class="fa-regular fa-clock"></i></div>
                <div>
                  <div class="meta__label">Thời gian gửi</div>
                  <div class="meta__value">{{ formatTimeAgo(r.thoiGianDeNghi) }}</div>
                </div>
              </div>

              <div class="meta">
                <div class="meta__icon"><i class="fa-regular fa-circle-check"></i></div>
                <div>
                  <div class="meta__label">Thời gian xử lý</div>
                  <div class="meta__value">{{ formatTimeAgo(r.thoiGianXuLy) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="item__bottom">
            <div class="note">
              <div class="note__title">
                <i class="fa-regular fa-message"></i>
                Nội dung đề nghị
              </div>
              <div class="note__text">{{ r.noiDungDeNghi || '—' }}</div>
            </div>

            <div v-if="r.ghiChu" class="note note--hint">
              <div class="note__title">
                <i class="fa-solid fa-pen"></i>
                Ghi chú xử lý
              </div>
              <div class="note__text">{{ r.ghiChu }}</div>
            </div>
          </div>
        </article>
      </div>

      <!-- ===== EMPTY ===== -->
      <div v-else class="empty">
        <div class="empty__icon">
          <i class="fa-regular fa-folder-open"></i>
        </div>
        <div class="empty__title">Không có dữ liệu phù hợp</div>
        <div class="empty__sub">Thử đổi tab hoặc từ khóa tìm kiếm nhé.</div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* =========================
   BASE - MÀU SẮC NỔI BẬT HƠN
========================= */
.page{
  --bg: #0b1220;
  --card: rgba(255,255,255,.98); /* Sáng hơn */
  --stroke: rgba(15,23,42,.15); /* Đậm hơn */
  --text: #0f172a;
  --muted: #475569; /* Đậm hơn cho dễ đọc */
  --text-secondary: #334155;

  --blue: #3b82f6;
  --blue-light: #60a5fa;
  --blue-gradient: linear-gradient(135deg, #3b82f6, #1d4ed8);

  --green: #10b981;
  --green-light: #34d399;
  --green-gradient: linear-gradient(135deg, #10b981, #047857);

  --violet: #8b5cf6;
  --violet-light: #a78bfa;
  --violet-gradient: linear-gradient(135deg, #8b5cf6, #7c3aed);

  --emerald: #059669;
  --emerald-light: #10b981;
  --emerald-gradient: linear-gradient(135deg, #059669, #047857);

  --yellow: #f59e0b;
  --yellow-light: #fbbf24;
  --yellow-gradient: linear-gradient(135deg, #f59e0b, #d97706);

  --red: #ef4444;
  --red-light: #f87171;
  --red-gradient: linear-gradient(135deg, #ef4444, #dc2626);

  --orange: #f97316;
  --orange-light: #fb923c;

  min-height: 100vh;
  background:
      radial-gradient(1200px 600px at 10% -10%, rgba(99,102,241,.15), transparent 55%),
      radial-gradient(900px 500px at 95% 0%, rgba(16,185,129,.12), transparent 55%),
      radial-gradient(900px 600px at 20% 95%, rgba(59,130,246,.12), transparent 55%),
      linear-gradient(180deg, #ffffff, #f8fafc); /* Nền trắng sáng hơn */
  color: var(--text);
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow-x: hidden;
}

/* =========================
   HERO - TĂNG CƯỜNG MÀU SẮC
========================= */
.hero{
  position: relative;
  padding: 32px 60px 24px;
  max-width: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255,255,255,.95), rgba(248,250,252,.95));
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}
.hero__bg{
  position:absolute;
  inset: 0;
  background:
      radial-gradient(900px 500px at 20% 20%, rgba(37,99,235,.15), transparent 55%),
      radial-gradient(900px 500px at 80% 0%, rgba(16,185,129,.12), transparent 55%),
      linear-gradient(135deg, rgba(255,255,255,.95), rgba(240, 249, 255, 0.8));
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(20px);
}
.hero__content{
  position: relative;
  margin: 0;
  max-width: 100%;
  display: grid;
  grid-template-columns: 1.1fr .9fr;
  gap: 24px;
}
.hero__title{
  display:flex;
  gap: 16px;
  align-items:flex-start;
}
.hero__icon{
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: var(--blue-gradient);
  border: 1px solid rgba(37,99,235,.2);
  box-shadow: 0 8px 32px rgba(37,99,235,.15);
  color: white;
}
.hero h1{
  margin:0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -.02em;
  background: linear-gradient(135deg, #1e40af, #1e3a8a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero p{
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.5;
  font-size: 15px;
  font-weight: 500;
}
.hero__chips{
  margin-top: 20px;
  display:flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* =========================
   KPI - MÀU SẮC SẮC NÉT
========================= */
.hero__kpi{
  display:grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.kpi{
  padding: 20px 16px 16px;
  border-radius: 20px;
  color: white;
  box-shadow: 0 20px 50px rgba(15,23,42,.2);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* ===== VÒNG LÓA SÁNG ===== */
.kpi::after {
  content: '';
  position: absolute;
  top: -30%;
  right: -30%;
  width: 220px;
  height: 220px;
  background: radial-gradient(
      circle,
      rgba(255,255,255,.45) 0%,
      rgba(255,255,255,.25) 25%,
      rgba(255,255,255,.12) 40%,
      transparent 65%
  );
  opacity: .6;
  pointer-events: none;
  transform: scale(.8);
  animation: sunPulse 4.5s ease-in-out infinite;
}
.kpi:hover::after {
   opacity: .9;
   transform: scale(1);
   animation-duration: 2.5s;
 }

/* ===== ANIMATION ===== */
@keyframes sunPulse {
  0% {
    transform: scale(.75);
    opacity: .5;
  }
  50% {
    transform: scale(1);
    opacity: .85;
  }
  100% {
    transform: scale(.75);
    opacity: .5;
  }
}

.kpi:hover{
  transform: translateY(-4px);
  box-shadow: 0 25px 60px rgba(15,23,42,.25);
}
.kpi:before{
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(135deg, rgba(255,255,255,.15), transparent);
  opacity: 0.5;
}
.kpi__top{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 2;
}
.kpi__label{
  font-size: 13px;
  font-weight: 600;
  opacity: .95;
  text-shadow: 0 1px 2px rgba(0,0,0,.1);
}
.kpi__icon{
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(255,255,255,.25);
  backdrop-filter: blur(10px);
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
}
.kpi__value{
  margin-top: 12px;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -.03em;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0,0,0,.2);
}
.kpi__hint{
  margin-top: 6px;
  font-size: 12px;
  opacity: .9;
  font-weight: 500;
  position: relative;
  z-index: 2;
}
.kpi--violet{
  background: var(--violet-gradient);
  border-color: rgba(139,92,246,.3);
}
.kpi--emerald{
  background: var(--emerald-gradient);
  border-color: rgba(5,150,105,.3);
}

/* =========================
   CONTENT WRAP
========================= */
.content{
  margin: 20px 60px 0;
}

/* =========================
   CARD - MÀU SẮC RÕ RÀNG
========================= */
.card{
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(15,23,42,.08);
  overflow: hidden;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
.card:hover{
  box-shadow: 0 12px 40px rgba(15,23,42,.12);
  border-color: rgba(148, 163, 184, 0.4);
}
.card__head{
  padding: 20px 20px 0;
  display:flex;
  align-items:flex-start;
  justify-content: space-between;
  gap: 16px;
}
.card__title{
  font-weight: 700;
  letter-spacing: -.01em;
  color: #1e293b;
  font-size: 17px;
}
.card__sub{
  margin-top: 6px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
}

/* =========================
   GRID
========================= */
.grid{
  display:grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.card--chart{ padding-bottom: 16px; }
.chartWrap{
  padding: 12px 16px 20px;
}
.chartWrap--bar{ height: 280px; }
.chartWrap--donut{ height: 280px; }

/* =========================
   TOOLBAR - MÀU SẮC NỔI BẬT
========================= */
.toolbar{
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(15,23,42,.08);
  padding: 16px 20px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tabs{
  display:flex;
  gap: 12px;
  flex-wrap: wrap;
}
.tab{
  border: 1px solid rgba(226, 232, 240, 0.9);
  background: #f8fafc;
  color: #475569;
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 600;
  font-size: 14px;
  display:flex;
  align-items:center;
  gap: 8px;
  cursor:pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.tab:before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(37,99,235,.05), rgba(16,185,129,.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}
.tab:hover{
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(15,23,42,.1);
  border-color: rgba(148, 163, 184, 0.6);
  color: #334155;
}
.tab:hover:before{
  opacity: 1;
}
.tab.active{
  background: linear-gradient(135deg, rgba(37,99,235,.12), rgba(16,185,129,.1));
  border-color: rgba(37,99,235,.3);
  color: #1e40af;
  box-shadow: 0 4px 20px rgba(37,99,235,.15);
}
.tab__count{
  min-width: 28px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(15,23,42,.08);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  position: relative;
  z-index: 1;
}
.tab.active .tab__count{
  background: rgba(141, 126, 126, 0.2);
  color: #0641c5;
}

.actions{
  display:flex;
  gap: 16px;
  align-items:center;
  flex-wrap: wrap;
}
.search, .select{
  display:flex;
  align-items:center;
  gap: 12px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 16px;
  background: #f8fafc;
  padding: 12px 16px;
  transition: all 0.3s ease;
}
.search:hover, .select:hover{
  border-color: #cbd5e1;
  background: white;
  box-shadow: 0 4px 15px rgba(15,23,42,.05);
}
.search i, .select i{
  color: #64748b;
  font-size: 16px;
}
.search input{
  border: none;
  outline: none;
  width: 320px;
  font-size: 14px;
  background: transparent;
  color: #334155;
  font-weight: 500;
}
.search input::placeholder{
  color: #94a3b8;
}
.select select{
  border: none;
  outline: none;
  background: transparent;
  font-weight: 600;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
}

/* =========================
   LIST / ITEM - MÀU SẮC PHÂN CẤP RÕ RÀNG
========================= */
.list{
  display:flex;
  flex-direction: column;
  gap: 16px;
}

.item{
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(15,23,42,.08);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}
.item:hover{
  transform: translateY(-4px);
  box-shadow: 0 15px 50px rgba(15,23,42,.12);
  border-color: #cbd5e1;
}

.item__top{
  padding: 20px 20px 16px;
  display:flex;
  align-items:flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}
.id{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items:center;
}
.manager{
  display:flex;
  align-items:center;
  gap: 12px;
}
.avatar{
  width: 44px;
  height: 44px;
  border-radius: 50px;
  overflow:hidden;
  border: 2px solid rgba(226, 232, 240, 0.8);
  background: #f8fafc;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow: 0 4px 12px rgba(15,23,42,.05);
}
.avatar img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.avatar__fallback{
  color: #64748b;
  font-size: 18px;
}
.manager__info{
  display: flex;
  flex-direction: column;
}
.manager__name{
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
}
.manager__sub{
  color: var(--muted);
  font-size: 12px;
  margin-top: 2px;
  font-weight: 500;
}

.item__mid{
  padding: 20px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}
.addr{
  display:flex;
  gap: 12px;
  align-items:flex-start;
  font-weight: 700;
  letter-spacing: -.01em;
  color: #1e293b;
  margin-bottom: 20px;
}
.addr i{
  margin-top: 2px;
  color: var(--blue);
  font-size: 18px;
}
.addr span{
  line-height: 1.4;
  font-size: 16px;
}

.metaRow{
  margin-top: 16px;
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.meta{
  padding: 16px;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: #f8fafc;
  display:flex;
  gap: 12px;
  align-items:flex-start;
  transition: all 0.3s ease;
}
.meta:hover{
  background: white;
  border-color: #cbd5e1;
  box-shadow: 0 4px 15px rgba(15,23,42,.05);
  transform: translateY(-2px);
}
.meta__icon{
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: var(--blue-gradient);
  color: white;
  flex: 0 0 auto;
  box-shadow: 0 4px 12px rgba(37,99,235,.2);
}
.meta:nth-child(2) .meta__icon{
  background: var(--green-gradient);
}
.meta:nth-child(3) .meta__icon{
  background: linear-gradient(135deg, #f97316, #ea580c);
}
.meta:nth-child(4) .meta__icon{
  background: var(--emerald-gradient);
}
.meta__label{
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
}
.meta__value{
  margin-top: 2px;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -.01em;
  color: #1e293b;
}

.item__bottom{
  padding: 20px;
  display:grid;
  grid-template-columns: 1.6fr .9fr;
  gap: 20px;
}
.note{
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}
.note:hover{
  background: white;
  border-color: #cbd5e1;
  box-shadow: 0 4px 15px rgba(15,23,42,.05);
}
.note__title{
  display:flex;
  align-items:center;
  gap: 12px;
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 12px;
}
.note__title i{
  color: var(--blue);
  font-size: 16px;
}
.note__text{
  color: #334155;
  line-height: 1.6;
  font-size: 14px;
  font-weight: 500;
}
.note--hint{
  background: linear-gradient(135deg, rgba(16,185,129,.08), rgba(37,99,235,.06));
  border-color: rgba(16,185,129,.2);
}
.note--hint:hover{
  background: linear-gradient(135deg, rgba(16,185,129,.12), rgba(37,99,235,.08));
}

/* =========================
   PILL / CHIP / DOT - MÀU SẮC ĐẬM
========================= */
.pill{
  display:inline-flex;
  align-items:center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid rgba(15,23,42,.15);
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(15,23,42,.05);
}
.pill:hover{
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15,23,42,.1);
}
.pill-soft{
  background: #f1f5f9;
  border-color: rgba(15,23,42,.1);
  color: #475569;
}
.pill-ghost{
  background: rgba(255,255,255,.8);
  backdrop-filter: blur(10px);
}
.pill-view{
  background: linear-gradient(135deg, rgba(37,99,235,.12), rgba(37,99,235,.08));
  border-color: rgba(37,99,235,.25);
  color: #1d4ed8;
}
.pill-team{
  background: linear-gradient(135deg, rgba(139,92,246,.12), rgba(124,58,237,.08));
  border-color: rgba(139,92,246,.25);
  color: #7c3aed;
}

.pill-wait{
  background: linear-gradient(135deg, rgba(245,158,11,.15), rgba(245,158,11,.1));
  border-color: rgba(245,158,11,.25);
  color: #b45309;
}
.pill-accept{
  background: linear-gradient(135deg, rgba(16,185,129,.15), rgba(16,185,129,.1));
  border-color: rgba(16,185,129,.25);
  color: #047857;
}
.pill-reject{
  background: linear-gradient(135deg, rgba(239,68,68,.15), rgba(239,68,68,.1));
  border-color: rgba(239,68,68,.25);
  color: #b91c1c;
}

.dot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display:inline-block;
  box-shadow: 0 0 0 3px rgba(15,23,42,.1);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 3px rgba(15,23,42,.1); }
  50% { box-shadow: 0 0 0 6px rgba(15,23,42,.05); }
  100% { box-shadow: 0 0 0 3px rgba(15,23,42,.1); }
}
.dot-ghost{
  background: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148,163,184,.2);
}
.dot-wait{
  background: var(--yellow);
  box-shadow: 0 0 0 3px rgba(245,158,11,.2);
}
.dot-accept{
  background: var(--green);
  box-shadow: 0 0 0 3px rgba(16,185,129,.2);
}
.dot-reject{
  background: var(--red);
  box-shadow: 0 0 0 3px rgba(239,68,68,.2);
}

/* =========================
   CHIP - MÀU SẮC RÕ RÀNG
========================= */
.chip{
  display:inline-flex;
  align-items:center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 4px 20px rgba(15,23,42,.08);
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  transition: all 0.3s ease;
}
.chip:hover{
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(15,23,42,.12);
}
.chip--soft{
  background: white;
}
.chip--solid{
  background: linear-gradient(135deg, rgba(37,99,235,.1), rgba(16,185,129,.08));
  border-color: rgba(37,99,235,.15);
  color: #1e40af;
}
.chip b{
  color: #1e293b;
  font-weight: 700;
}

/* =========================
   EMPTY - THIẾT KẾ ĐẸP HƠN
========================= */
.empty{
  margin-top: 32px;
  padding: 60px 40px;
  text-align:center;
  border-radius: 20px;
  border: 2px dashed rgba(226, 232, 240, 0.8);
  background: linear-gradient(135deg, rgba(248,250,252,.8), rgba(240,249,255,.6));
  backdrop-filter: blur(10px);
}
.empty__icon{
  width: 80px;
  height: 80px;
  border-radius: 24px;
  margin: 0 auto 20px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: var(--blue-gradient);
  color: white;
  box-shadow: 0 8px 32px rgba(37,99,235,.2);
  font-size: 32px;
}
.empty__title{
  font-weight: 700;
  letter-spacing: -.01em;
  color: #1e293b;
  font-size: 20px;
  margin-bottom: 8px;
}
.empty__sub{
  color: var(--muted);
  font-size: 15px;
  font-weight: 500;
}

/* =========================
   RESPONSIVE - GIỮ NGUYÊN MÀU SẮC
========================= */

/* Tablet và nhỏ hơn (dưới 1100px) */
@media (max-width: 1100px) {
  .hero__content{
    grid-template-columns: 1fr;
  }
  .grid{
    grid-template-columns: 1fr;
  }
  .chartWrap--bar, .chartWrap--donut{
    height: 300px;
  }
}

/* Tablet nhỏ (dưới 900px) */
@media (max-width: 900px) {
  .metaRow{
    grid-template-columns: repeat(2, 1fr);
  }
  .item__bottom{
    grid-template-columns: 1fr;
  }
  .search input{
    width: 100%;
  }
}

/* Mobile (dưới 768px) */
@media (max-width: 768px) {
  .hero{
    padding: 24px 30px 20px;
  }
  .content{
    margin: 0 24px;
  }
  .toolbar{
    flex-direction: column;
    align-items: stretch;
    padding: 20px;
  }
  .actions{
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }
  .search, .select{
    width: 100%;
  }
  .tabs{
    justify-content: center;
  }
  .item__top{
    flex-direction: column;
    align-items: stretch;
  }
}

/* Mobile nhỏ (dưới 560px) */
@media (max-width: 560px) {
  .hero h1{
    font-size: 24px;
  }
  .kpi__value{
    font-size: 24px;
  }
  .hero__kpi{
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .kpi{
    padding: 16px 12px 14px;
  }
  .addr span{
    font-size: 15px;
  }
}

/* Mobile rất nhỏ (dưới 375px) */
@media (max-width: 374px) {
  .hero{
    padding: 20px 16px 16px;
  }
  .content{
    margin: 0 16px;
  }
  .hero__title{
    flex-direction: column;
    gap: 12px;
  }
  .hero__icon{
    width: 44px;
    height: 44px;
  }
  .kpi{
    padding: 14px 10px 12px;
  }
  .kpi__value{
    font-size: 20px;
  }
  .tab{
    padding: 8px 12px;
    font-size: 13px;
  }
  .meta{
    padding: 12px;
  }
  .meta__icon{
    width: 32px;
    height: 32px;
  }
}

/* Đảm bảo không tràn ngang */
* {
  max-width: 100%;
}

/* Font size desktop */
@media (min-width: 769px) {
  .hero h1 { font-size: 28px; }
  .hero p { font-size: 15px; }
  .kpi__value { font-size: 32px; }
  .kpi__label { font-size: 13px; }
  .kpi__hint { font-size: 12px; }
  .tab { font-size: 14px; }
  .search input { font-size: 14px; }
  .select select { font-size: 14px; }
  .manager__name { font-size: 14px; }
  .manager__sub { font-size: 12px; }
  .addr span { font-size: 16px; }
  .meta__label { font-size: 13px; }
  .meta__value { font-size: 15px; }
  .note__title { font-size: 14px; }
  .note__text { font-size: 14px; }
  .pill { font-size: 12px; }
  .chip { font-size: 14px; }
}

/* Hiệu ứng hover tinh tế */
@media (hover: hover) {
  .item:hover .meta__icon {
    transform: scale(1.1);
  }
  .kpi:hover .kpi__icon {
    transform: rotate(5deg);
  }
}
</style>
