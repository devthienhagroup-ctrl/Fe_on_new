  <template>
    <div class="coop-page">
      <!-- TOP BAR -->
      <header class="topbar">
        <div class="topbar__left">
          <div class="topbar__icon"><i class="fas fa-handshake"></i></div>
          <div>
            <h1 class="topbar__title">Quản lý đề nghị hợp tác</h1>
            <p class="topbar__sub">Tổng hợp & xử lý yêu cầu hợp tác từ đối tác</p>
          </div>
          <NotificationBell/>
        </div>


        <div class="topbar__right">
          <div class="kpi">
            <div class="kpi__value">{{ pendingCount }}</div>
            <div class="kpi__label">Chờ xử lý</div>
          </div>

          <div class="kpi">
            <div class="kpi__value">{{ processedCount }}</div>
            <div class="kpi__label">Đã xử lý</div>
          </div>

          <div class="kpi">
            <div class="kpi__value">{{ totalCount }}</div>
            <div class="kpi__label">Tổng</div>
          </div>

          <div class="kpi kpi--accent">
            <div class="kpi__value">{{ acceptanceRate }}%</div>
            <div class="kpi__label">Tỷ lệ chấp nhận</div>
          </div>

        </div>
      </header>

      <!-- CONTENT -->
      <main class="content">
        <!-- LEFT -->
        <section class="panel panel--list">
          <div class="panel__header">
            <div class="tabs">
              <button class="tab" :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">
                <i class="fas fa-clock"></i>
                Chờ xử lý
                <span class="tab__count" style="background-color: #f52c2c!important; color: whitesmoke!important;">{{ pendingCount }}</span>
              </button>
              <button class="tab" :class="{ active: activeTab === 'processed' }" @click="activeTab = 'processed'">
                <i class="fas fa-check-circle"></i>
                Đã xử lý
                <span class="tab__count">{{ processedCount }}</span>
              </button>
              <button class="tab" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
                <i class="fas fa-layer-group"></i>
                Tất cả
                <span class="tab__count">{{ totalCount }}</span>
              </button>
            </div>

            <div class="controls">
              <div class="search">
                <i class="fas fa-search"></i>
                <input
                    v-model="propertyAddressFilter"
                    type="text"
                    placeholder="Tìm theo địa chỉ tài sản / người gửi..."
                />
                <button v-if="propertyAddressFilter" class="clear" @click="handleSearchClear">
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <div class="meta">
                <button class="btn-search" @click="handleSearch">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  Tìm
                </button>
              </div>

            </div>
          </div>

          <div class="list">
          <article
              v-for="request in requests"
              :key="request.id"
              class="item"
              :class="[
      request.trangThai,
      request.priority === 'high' ? 'high' : '',
      isNewRequest(request) ? 'new' : ''
    ]"
          >
            <div class="item__left">
              <div class="badge-status" :class=" (request.trangThai)">
                {{ getStatusText(request.trangThai) }}
              </div>

              <div class="addr">
                <i class="fas fa-home"></i>
                <div class="addr__text">{{ formatDiaChi(request.diaChiTaiSan) }}</div>
              </div>

              <div class="chips">
        <span class="chip chip--price">
          <i class="fas fa-tag"></i> {{ formatCurrency(request.giaBan) }}
        </span>
                <span class="chip chip--com">
          <i class="fas fa-percentage"></i> {{ formatHoaHong(request.hoaHong) }}%
        </span>
                <span class="chip chip--time">
          <i class="far fa-clock"></i>
          {{ formatTimeAgo(request.thoiGianDeNghi) }}
        </span>
              </div>

              <div class="row">
                <div class="person">
                  <div class="avatar">
                    <img
                        :src="'https://s3.cloudfly.vn/thg-storage/uploads-public/' + (request.avatarNguoiGui == null ? 'vat-default.jpg': request.avatarNguoiGui)"
                        :alt="request.tenNguoiGui"
                    />
                  </div>
                  <div>
                    <div class="person__name">{{ request.tenNguoiGui }}</div>
                    <div class="person__sub">
              <span class="muted">
                <i class="fas fa-map-marker-alt"></i>
                {{ formatDiaChi(request.diaChiNguoiGui) }}
              </span>
                    </div>
                  </div>
                </div>

                <div class="contact">
                  <button class="contact__btn" type="button">
                    <i class="fas fa-envelope"></i>
                    <span>{{ request.emailNguoiGui }}</span>
                  </button>
                  <button class="contact__btn" type="button">
                    <i class="fas fa-phone"></i>
                    <span>{{ request.sdtNguoiGui }}</span>
                  </button>
                </div>
              </div>

              <div v-if="request.noiDungDeNghi" class="proposal">
                <div class="proposal__label">
                  <i class="fas fa-comment-dots"></i> Nội dung đề nghị
                </div>
                <div class="proposal__text">
                  {{ request.noiDungDeNghi }}
                </div>
              </div>

              <div v-if="request.trangThai !== 'CHO_XU_LY'" class="result">
                <div class="result__head">
                  <i class="fas fa-clipboard-check"></i>
                  Kết quả xử lý
                </div>

                <div class="result__body">
          <span class="result__type" :class="request.trangThai">
              {{ request.trangThai === 'DONG_Y' ? 'Đã chấp nhận' : 'Đã từ chối' }}
          </span>
                  <span class="result__time">
            <i class="far fa-calendar-alt"></i>
            {{ formatDate(request.thoiGianXuLy) }}
          </span>
                </div>

                <div v-if="request.trangThai === 'DONG_Y'" class="result__extra">
          <span class="mini">
            <i class="fas fa-eye"></i>
            Xem căn: <b>{{ request.duocXemCan ? 'Có' : 'Không' }}</b>
          </span>
                  <span v-if="request.tenTeamThamGia" class="mini">
            <i class="fas fa-users"></i>
            Nhóm: <b>{{ request.tenTeamThamGia }}</b>
          </span>
                  <span v-if="request.ghiChu" class="mini">
            <i class="fas fa-sticky-note"></i>
            Ghi chú: <b>{{ request.ghiChu }}</b>
          </span>
                </div>
              </div>
            </div>

              <div class="item__right">
                <div class="manager">
                  <div class="manager__avatar">
                    <img
                        :src="'https://s3.cloudfly.vn/thg-storage/uploads-public/' + (request.nguoiAvatarQuanLy == null ? 'vat-default.jpg': request.nguoiAvatarQuanLy )"
                        :alt="request.tenNguoiQuanLy"
                    />
                  </div>
                  <div class="manager__meta">
                    <div class="manager__label">Người quản lý</div>
                    <div class="manager__name">{{ request.tenNguoiQuanLy }}</div>
                  </div>
                </div>

                <!-- ACTION BUTTONS -->
                <div v-if="request.trangThai === 'CHO_XU_LY'" class="actions">
                  <button class="btn btn--ok" @click="openApproveModal(request)">
                    <i class="fas fa-check"></i> Đồng ý
                  </button>

                  <button
                      class="btn btn--no"
                      @click="openRejectModal(request)"
                  >
                    <i class="fas fa-times"></i> Từ chối
                  </button>

                </div>
              </div>
          </article>
          </div>
          <div  class="pagination">
            <button
                class="pg-btn"
                :disabled="page === 0"
                @click="goToPage(0)"
            >
              <i class="fas fa-angle-double-left"></i>
            </button>

            <button
                class="pg-btn"
                :disabled="page === 0"
                @click="goToPage(page - 1)"
            >
              <i class="fas fa-angle-left"></i>
            </button>

            <button
                v-for="p in visiblePages"
                :key="p"
                class="pg-btn"
                :class="{ active: p === page }"
                @click="goToPage(p)"
            >
              {{ p + 1 }}
            </button>

            <button
                class="pg-btn"
                :disabled="page >= totalPages - 1"
                @click="goToPage(page + 1)"
            >
              <i class="fas fa-angle-right"></i>
            </button>

            <button
                class="pg-btn"
                :disabled="page >= totalPages - 1"
                @click="goToPage(totalPages - 1)"
            >
              <i class="fas fa-angle-double-right"></i>
            </button>
          </div>

        </section>

        <!-- RIGHT -->
        <aside class="panel panel--side">
          <div class="panel__header panel__header--tight">
            <div class="side-title">
              <i class="fas fa-chart-pie"></i>
              Thống kê
            </div>
          </div>

          <div class="side-body">
            <div class="side-kpis">
              <div class="side-kpi">
                <div class="side-kpi__label">Hôm nay</div>
                <div class="side-kpi__value">{{ homNayCount  }}</div>
              </div>
              <div class="side-kpi">
                <div class="side-kpi__label">Tuần này</div>
                <div class="side-kpi__value">{{ tuanNayCount }}</div>
              </div>
              <div class="side-kpi">
                <div class="side-kpi__label">Tháng này</div>
                <div class="side-kpi__value">{{ thangNayCount }}</div>
              </div>
            </div>

            <div class="chart-box">
              <div class="chart-box__head">
                <i class="fas fa-map-marked-alt"></i>
                Phân bố theo tỉnh
              </div>
              <div class="chart-box__canvas">
                <canvas ref="regionChart"></canvas>
              </div>
            </div>

            <div class="chart-box">
              <div class="chart-box__head">
                <i class="fas fa-chart-line"></i>
                Tăng trưởng 6 tháng
                <span class="pill" :class="growthTrend">
                  <i class="fas" :class="growthTrendIcon"></i> {{ growthPercentage }}%
                </span>
              </div>
              <div class="chart-box__canvas">
                <canvas ref="growthChart"></canvas>
              </div>
            </div>
          </div>
        </aside>
      </main>
      <TuChoiModal
          v-if="showRejectModal"
          @close="showRejectModal = false"
          @confirm="confirmReject"
      />
      <SelectGroupModal
          v-if="showModal"
          @close="showModal = false"
          @confirm="handleConfirm"
      />
    </div>

  </template>

  <script setup>
  import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
  import Chart from 'chart.js/auto'
  import NotificationBell from "../NotificationBell.vue";
  import SelectGroupModal from './chapNhanModal.vue'


  const activeTab = ref('pending')
  const propertyAddressFilter = ref('')
  const chartPeriod = ref('month')
  const showProcessModal = ref(false)
  const selectedRequest = ref(null)

  const regionChart = ref(null)
  const growthChart = ref(null)
  let regionChartInstance = null
  let growthChartInstance = null

  watch(activeTab, async () => {
    page.value = 0
    await loadDanhSach()
  })
  const handleSearch = async () => {
    page.value = 0
    await loadDanhSach()
  }
  const handleSearchClear = async () => {
    propertyAddressFilter.value = '';
    page.value = 0
    await loadDanhSach()
  }

  const goToPage = async (p) => {
    if (p < 0 || p >= totalPages.value) return
    page.value = p
    await loadDanhSach()
  }

  /**
   * Hiển thị tối đa 5 trang xung quanh trang hiện tại
   */
  const visiblePages = computed(() => {
    const range = 2
    let start = Math.max(0, page.value - range)
    let end = Math.min(totalPages.value - 1, page.value + range)

    // đảm bảo luôn đủ 5 nút nếu có thể
    if (end - start < range * 2) {
      if (start === 0) {
        end = Math.min(totalPages.value - 1, start + range * 2)
      } else if (end === totalPages.value - 1) {
        start = Math.max(0, end - range * 2)
      }
    }

    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  })

  const managerAvatars = {
    'Nguyễn Văn A': 'https://randomuser.me/api/portraits/men/32.jpg',
    'Lê Minh Đức': 'https://randomuser.me/api/portraits/men/45.jpg',
    'Nguyễn Thị Hồng': 'https://randomuser.me/api/portraits/women/44.jpg',
    'Vũ Thị Lan': 'https://randomuser.me/api/portraits/women/65.jpg',
    'Trần Văn Hải': 'https://randomuser.me/api/portraits/men/22.jpg',
    'Phạm Thị Thu': 'https://randomuser.me/api/portraits/women/33.jpg',
    'Đinh Văn Long': 'https://randomuser.me/api/portraits/men/55.jpg',
    'Lý Văn Sơn': 'https://randomuser.me/api/portraits/men/66.jpg',
    'Hoàng Thị Nga': 'https://randomuser.me/api/portraits/women/77.jpg',
    'Nguyễn Văn Tú': 'https://randomuser.me/api/portraits/men/88.jpg'
  }

  const cooperationRequests = ref([])
  const  filteredRequests = ref([])

  const todayRequests = computed(() => {
    const today = new Date().toDateString()
    return cooperationRequests.value.filter(r => new Date(r.requestTime).toDateString() === today).length
  })
  const thisWeekRequests = computed(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return cooperationRequests.value.filter(r => new Date(r.requestTime) >= oneWeekAgo).length
  })
  const thisMonthRequests = computed(() => {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    return cooperationRequests.value.filter(r => new Date(r.requestTime) >= startOfMonth).length
  })


  const formatCurrency = (amount) => {
    if (!amount) return '0 VND'
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)} tỷ VND`
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)} triệu VND`
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
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

  const getStatusText = (status) => {
    if (status === 'CHO_XU_LY') return 'Chờ xử lý'
    if (status === 'DONG_Y') return 'Đã chấp nhận'
    if (status === 'TU_CHOI') return 'Đã từ chối'
    return status
  }

  const isNewRequest = (request) => {
    if (request.trangThai !== 'CHO_XU_LY') return false
    const t = new Date(request.thoiGianDeNghi)
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    return t > oneDayAgo
  }

  const processRequest = (request) => {
    selectedRequest.value = request
    showProcessModal.value = true
  }
  const closeProcessModal = () => {
    showProcessModal.value = false
    selectedRequest.value = null
  }

  const acceptRequest = () => {
    if (!selectedRequest.value) return
    const idx = cooperationRequests.value.findIndex(r => r.id === selectedRequest.value.id)
    if (idx !== -1) {
      cooperationRequests.value[idx] = {
        ...cooperationRequests.value[idx],
        status: 'accepted',
        processedTime: new Date().toISOString(),
        viewingAllowed: true,
        groupName: cooperationRequests.value[idx].groupName || 'Nhóm Mặc Định',
        notes: cooperationRequests.value[idx].notes || 'Đã chấp nhận qua modal'
      }
    }
    closeProcessModal()
  }

  const rejectRequest = () => {
    if (!selectedRequest.value) return
    const idx = cooperationRequests.value.findIndex(r => r.id === selectedRequest.value.id)
    if (idx !== -1) {
      cooperationRequests.value[idx] = {
        ...cooperationRequests.value[idx],
        status: 'rejected',
        processedTime: new Date().toISOString(),
        rejectionReason: cooperationRequests.value[idx].rejectionReason || 'Không phù hợp với tiêu chí hiện tại'
      }
    }
    closeProcessModal()
  }

  const addNote = () => {
    if (!selectedRequest.value) return
    const note = prompt('Thêm ghi chú cho đề nghị này:')
    if (!note) return
    const idx = cooperationRequests.value.findIndex(r => r.id === selectedRequest.value.id)
    if (idx !== -1) cooperationRequests.value[idx].notes = note
  }

  const generateColors = (count) => {
    const baseHue = 210        // xanh – tím (rất đẹp cho dashboard)
    const goldenAngle = 137.508

    return Array.from({ length: count }, (_, i) => {
      const hue = (baseHue + i * goldenAngle) % 360
      return `hsl(${Math.round(hue)}, 65%, 55%)`
    })
  }

  const totalRegionCount = computed(() =>
      thongKeTheoTinh.value.reduce((sum, i) => sum + i.soLuong, 0)
  )
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw(chart) {
      const { ctx, chartArea } = chart
      if (!chartArea) return

      const centerX = (chartArea.left + chartArea.right) / 2
      const centerY = (chartArea.top + chartArea.bottom) / 2

      ctx.save()

      // ===== TEXT TỔNG =====
      ctx.font = '600 20px Inter, sans-serif'
      ctx.fillStyle = '#111827'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(totalRegionCount.value, centerX, centerY - 6)

      // ===== LABEL =====
      ctx.font = '400 12px Inter, sans-serif'
      ctx.fillStyle = '#6b7280'
      ctx.fillText('Tổng đề nghị', centerX, centerY + 14)

      ctx.restore()
    }
  }

  const initRegionChart = () => {
    if (regionChartInstance) regionChartInstance.destroy()
    const ctx = regionChart.value?.getContext('2d')
    if (!ctx) return

    const labels = thongKeTheoTinh.value.map(i => i.tinh)
    const data = thongKeTheoTinh.value.map(i => i.soLuong)

    const backgroundColors = generateColors(labels.length)

    regionChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: backgroundColors,
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        }
      },
      plugins: [centerTextPlugin] // 👈 QUAN TRỌNG
    })
  }

  const handleResize = () => {
    if (regionChartInstance) initRegionChart()
    if (growthChartInstance) initGrowthChart()
  }



  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (regionChartInstance) regionChartInstance.destroy()
    if (growthChartInstance) growthChartInstance.destroy()
  })

  watch(chartPeriod, () => {
    initRegionChart()
  })
  const tangTruong6Thang = ref([])
  const initGrowthChart = () => {
    if (growthChartInstance) growthChartInstance.destroy()
    const ctx = growthChart.value?.getContext('2d')
    if (!ctx) return

    const labels = tangTruong6Thang.value.map(i => i.thang)
    const data = tangTruong6Thang.value.map(i => i.soLuong)

    growthChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124,58,237,.15)',
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#7c3aed'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.raw} đề nghị`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    })
  }
  const growthPercentage = computed(() => {
    const arr = tangTruong6Thang.value
    if (arr.length < 2) return 0

    const last = arr[arr.length - 1].soLuong
    const prev = arr[arr.length - 2].soLuong
    if (prev === 0) return 100

    return Math.round(((last - prev) / prev) * 100)
  })

  const growthTrend = computed(() => {
    if (growthPercentage.value > 0) return 'positive'
    if (growthPercentage.value < 0) return 'negative'
    return 'neutral'
  })

  const growthTrendIcon = computed(() => {
    if (growthTrend.value === 'positive') return 'fa-arrow-up'
    if (growthTrend.value === 'negative') return 'fa-arrow-down'
    return 'fa-minus'
  })

  const loadTangTruong6Thang = async () => {
    try {
      const res = await api.get(
          '/admin/api/de-nghi-hop-tac/tang-truong-6-thang'
      )
      tangTruong6Thang.value = res.data || []
      initGrowthChart()
    } catch (e) {
      console.error('Lỗi load tăng trưởng 6 tháng', e)
    }
  }


  import api from "/src/api/api.js";

  const thongKe = ref({
    tongSo: 0,
    choXuLy: 0,
    dongY: 0,
    tuChoi: 0,
    tyLeDongY: 0
  });

  const loadThongKe = async () => {
    try {
      const res = await api.get(
          '/admin/api/de-nghi-hop-tac/thong-ke'
      )
      thongKe.value = res.data
    } catch (e) {
      console.error('Lỗi load thống kê đề nghị hợp tác', e)
    }
  }
  const pendingCount = computed(() => thongKe.value.choXuLy)
  const processedCount = computed(() =>
      thongKe.value.dongY + thongKe.value.tuChoi
  )
  const totalCount = computed(() => thongKe.value.tongSo)
  const acceptanceRate = computed(() => thongKe.value.tyLeDongY)
  const homNayCount = computed(() => thongKe.value.homNay || 0)
  const tuanNayCount = computed(() => thongKe.value.tuanNay || 0)
  const thangNayCount = computed(() => thongKe.value.thangNay || 0)
  const thongKeTheoTinh = ref([])

  const loadThongKeTheoTinh = async () => {
    try {
      const res = await api.get(
          '/admin/api/de-nghi-hop-tac/thong-ke-theo-tinh'
      )
      thongKeTheoTinh.value = res.data || []
    } catch (e) {
      console.error('Lỗi load thống kê theo tỉnh', e)
    }
  }

  const requests = ref([])

  const page = ref(0)
  const size = ref(10)
  const totalPages = ref(0)
  const totalElements = ref(0)

  const loadingList = ref(false)

  const tabParam = computed(() => {
    if (activeTab.value === 'pending') return 'pending'
    if (activeTab.value === 'processed') return 'processed'
    return 'all'
  })

  const loadDanhSach = async () => {
    loadingList.value = true
    try {
      const res = await api.get('/admin/api/de-nghi-hop-tac/danh-sach', {
        params: {
          tab: tabParam.value,
          q: propertyAddressFilter.value || '',
          page: page.value,
          size: size.value
        }
      })

      const p = res.data

      requests.value = p.content
      totalPages.value = p.totalPages
      totalElements.value = p.totalElements

    } catch (e) {
      console.error('Lỗi load danh sách đề nghị', e)
    } finally {
      loadingList.value = false
    }
  }

  function formatHoaHong(value) {
    if (value == null || isNaN(value)) return '0.00'
    return Number(value).toFixed(2)
  }



  import { socketService } from "/src/services/socketService.js"
  import { SOCKET_CONFIG } from "/src/config/socketConfig.js"
  import { useAuthStore } from "/src/stores/authStore.js"

  const authStore = useAuthStore()

  const reloadAll = async () => {
    await loadThongKe()
    await loadThongKeTheoTinh()
    await loadDanhSach()
    await loadTangTruong6Thang()
  }

  onMounted(async () => {
    // 1️⃣ Load lần đầu
    await reloadAll()
    initRegionChart()
    window.addEventListener('resize', handleResize)

    // 2️⃣ Connect socket
    const token = () => authStore.accessToken
    socketService.connect(token)

    const employeeId = authStore.userInfo?.id
    if (!employeeId) return

    // 3️⃣ Subscribe socket dashboard
    socketService.subscribe(
        SOCKET_CONFIG.invitationTopic(employeeId),
        async (event) => {
          console.log("📩 Invitation socket event:", event)
          await reloadAll()
        }
    )

  })

  import TuChoiModal from './tuChoiModal.vue'

  const rejectReason = ref('')

  const openRejectModal = (request) => {
    rejectingRequest.value = request
    showRejectModal.value = true
  }

  const showRejectModal = ref(false)
  const rejectingRequest = ref(null)
  import {showCenterSuccess, showCenterWarning} from "../../assets/js/alertService.js";

  const confirmReject = async (reason) => {
    if (!rejectingRequest.value) return

    try {
      await api.post(
          `/admin/api/de-nghi-hop-tac/${rejectingRequest.value.id}/tu-choi`,
          null,
          {
            params: {
              lyDo: reason
            }
          }
      )


      showRejectModal.value = false
      showCenterSuccess("Từ chối thành công!", "Lời từ chối của bạn đã được gửi đi.")
      rejectingRequest.value = null

      await reloadAll()
    } catch (e) {
      showCenterWarning("Từ chối thất bại!", "Hệ thống đã gặp lỗi không mong muốn.")
    }

  }
  const showModal = ref(false)
  const approvingRequest = ref(null)
  const openApproveModal = (request) => {
    approvingRequest.value = request
    showModal.value = true
  }

  const handleConfirm = async ({ groupId, message }) => {
    await api.post(
        `/admin/api/de-nghi-hop-tac/${approvingRequest.value.id}/dong-y`,
        null,
        {
          params: {
            teamId: groupId,   // có thể null
            thuNgo: message
          }
        }
    )


    showModal.value = false
    showCenterSuccess("Phê duyệt thành công!", "CTV sẽ được xem căn này và được thêm vào nhóm.")
    approvingRequest.value = null
    await reloadAll()
  }




  function formatDiaChi(raw) {
    if (!raw) return ''

    return raw
        .split('/!!')
        .map(s => s.trim())
        .filter(Boolean)
        .join(', ')
  }


  </script>

  <style scoped>
  .btn-search{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid rgba(15,23,42,.15);
    background: linear-gradient(
        135deg,
        rgba(37,99,235,.12),
        rgba(16,185,129,.10)
    );
    font-weight: 800;
    font-size: 13px;
    color: #0f172a;
    cursor: pointer;
    transition: all .18s ease;
  }

  .btn-search i{
    font-size: 13px;
  }

  .btn-search:hover{
    transform: translateY(-1px);
    box-shadow: 0 12px 30px rgba(15,23,42,.12);
  }

  .btn-search:active{
    transform: translateY(0);
    box-shadow: 0 6px 16px rgba(15,23,42,.14);
  }

  /* ====== THEME ====== */
  .coop-page{
    min-height:100vh;
    background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 55%, #f8fafc 100%);
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    color:#0f172a;
  }

  /* ====== TOPBAR ====== */
  .topbar{
    position: sticky;
    top: 0;
    z-index: 30;
    padding: 16px 18px;
    background: rgba(255,255,255,.85);
    border-bottom: 1px solid rgba(15,23,42,.08);
    backdrop-filter: blur(12px);
    display:flex;
    gap:16px;
    justify-content:space-between;
    align-items:center;
  }
  .topbar__left{ display:flex; gap:12px; align-items:center; }
  .topbar__icon{
    width:44px;height:44px;border-radius:12px;
    display:grid;place-items:center;
    background: linear-gradient(135deg, #7c3aed, #06b6d4);
    color:#fff;
    box-shadow: 0 10px 25px rgba(124,58,237,.25);
  }
  .topbar__title{
    margin:0;
    font-size: 18px;
    font-weight: 850;
    letter-spacing: -.2px;
  }
  .topbar__sub{
    margin:2px 0 0;
    font-size: 13px;
    color: rgba(15,23,42,.65);
    font-weight: 600;
  }
  .topbar__right{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    justify-content:flex-end;
  }
  .kpi{
    min-width: 110px;
    padding: 10px 12px;
    border-radius: 14px;
    background: #fff;
    border: 1px solid rgba(15,23,42,.08);
    box-shadow: 0 10px 25px rgba(15,23,42,.06);
  }
  .kpi--accent{
    border-color: rgba(124,58,237,.25);
    background: linear-gradient(135deg, rgba(124,58,237,.10), rgba(6,182,212,.08));
  }
  .kpi__value{ font-size: 18px; font-weight: 900; line-height: 1; }
  .kpi__label{ margin-top: 6px; font-size: 12px; font-weight: 700; color: rgba(15,23,42,.6); }

  /* ====== LAYOUT ====== */
  .content{
    margin: 0 auto;
    padding: 18px;
    display:grid;
    grid-template-columns: 1fr 420px; /* hoặc 440px */
    gap: 16px;
  }


  .panel{
    background:#fff;
    border: 1px solid rgba(15,23,42,.08);
    border-radius: 18px;
    box-shadow: 0 15px 35px rgba(15,23,42,.06);
    overflow:hidden;
  }

  .panel__header{
    padding: 14px 14px;
    border-bottom: 1px solid rgba(15,23,42,.08);
    background: linear-gradient(180deg, rgba(248,250,252,.9), rgba(255,255,255,1));
    display:flex;
    gap:12px;
    justify-content:space-between;
    align-items:center;
    flex-wrap:wrap;
  }
  .panel__header--tight{
    padding: 12px 14px;
  }

  /* ====== TABS ====== */
  .tabs{
    display:flex;
    gap:8px;
    padding: 6px;
    border-radius: 14px;
    background: rgba(15,23,42,.03);
    border: 1px solid rgba(15,23,42,.06);
  }
  .tab{
    border:0;
    background: transparent;
    padding: 10px 12px;
    border-radius: 12px;
    font-weight: 800;
    font-size: 13px;
    color: rgba(15,23,42,.65);
    cursor:pointer;
    display:flex;
    align-items:center;
    gap:8px;
  }
  .tab__count{
    min-width: 26px;
    height: 22px;
    padding: 0 8px;
    border-radius: 999px;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    font-size: 12px;
    font-weight: 900;
    background: rgba(15,23,42,.08);
    color: rgba(15,23,42,.75);
  }
  .tab.active{
    color:#0f172a;
    background: linear-gradient(135deg, rgba(124,58,237,.16), rgba(6,182,212,.10));
    border: 1px solid rgba(124,58,237,.22);
  }
  .tab.active .tab__count{
    background: rgba(124,58,237,.18);
    color:#4c1d95;
  }

  /* ====== CONTROLS ====== */
  .controls{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; justify-content:flex-end; }
  .search{
    position:relative;
    display:flex;
    align-items:center;
    gap:8px;
    padding: 10px 12px;
    border-radius: 14px;
    background:#fff;
    border: 1px solid rgba(15,23,42,.10);
    min-width: 280px;
  }
  .search i{ color: rgba(15,23,42,.45); }
  .search input{
    border:0;
    outline:none;
    width: 100%;
    font-size: 13.5px;
    font-weight: 650;
    color:#0f172a;
  }
  .clear{
    border:0;
    width: 28px;height:28px;
    border-radius: 10px;
    background: rgba(15,23,42,.06);
    cursor:pointer;
  }
  .meta__pill{
    padding: 10px 12px;
    border-radius: 14px;
    background: rgba(245,158,11,.14);
    border: 1px solid rgba(245,158,11,.25);
    font-weight: 900;
    font-size: 12.5px;
    color: #92400e;
  }

  /* ====== LIST ====== */
  .list{
    padding: 14px;
    max-height: calc(100vh - 120px);
    overflow:auto;
  }
  .item{
    display:grid;
    grid-template-columns: 1fr 230px;
    gap: 12px;
    padding: 14px;
    border-radius: 16px;
    border: 1px solid rgba(15,23,42,.08);
    box-shadow: 0 12px 25px rgba(15,23,42,.05);
    margin-bottom: 12px;
    position:relative;
    background: #fff;
  }
  .item:hover{
    border-color: rgba(124,58,237,.22);
    box-shadow: 0 18px 40px rgba(15,23,42,.08);
  }
  .item.new{ outline: 2px solid rgba(239,68,68,.20); }
  .item.high{ border-color: rgba(245,158,11,.28); }

  .badge-status{
    width: fit-content;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: .2px;
  }
  .badge-status.CHO_XU_LY{ background: rgba(245,158,11,.16); color: #92400e; border: 1px solid rgba(245,158,11,.25); }
  .badge-status.DONG_Y{ background: rgba(34,197,94,.14); color: #166534; border: 1px solid rgba(34,197,94,.22); }
  .badge-status.TU_CHOI{ background: rgba(239,68,68,.14); color: #991b1b; border: 1px solid rgba(239,68,68,.22); }

  .addr{ margin-top: 10px; display:flex; gap:10px; align-items:flex-start; }
  .addr i{ color:#7c3aed; margin-top: 2px; }
  .addr__text{ font-size: 14px; font-weight: 900; color:#0f172a; line-height: 1.35; }

  .chips{ margin-top: 10px; display:flex; gap:8px; flex-wrap:wrap; }
  .chip{
    display:inline-flex;
    align-items:center;
    gap:6px;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    border: 1px solid rgba(15,23,42,.08);
    background: rgba(15,23,42,.03);
    color: rgba(15,23,42,.75);
  }
  .chip--price{ background: rgba(124,58,237,.12); border-color: rgba(124,58,237,.20); color:#4c1d95; }
  .chip--com{ background: rgba(6,182,212,.12); border-color: rgba(6,182,212,.20); color:#155e75; }
  .chip--time{ background: rgba(15,23,42,.04); }
  .chip--prio{ background: rgba(245,158,11,.14); border-color: rgba(245,158,11,.25); color:#92400e; }

  .row{
    margin-top: 12px;
    display:flex;
    gap:12px;
    justify-content:space-between;
    align-items:flex-start;
    flex-wrap:wrap;
  }
  .person{ display:flex; gap:10px; align-items:center; }
  .avatar{
    width:44px;height:44px;
    overflow:hidden;
    border: 1px solid rgba(15,23,42,.10);
    border-radius: 50px;
  }
  .avatar img{ width:100%;height:100%;object-fit:cover; }
  .person__name{ font-size: 13.5px; font-weight: 950; }
  .muted{ color: rgba(15,23,42,.6); font-weight: 650; font-size: 12.5px; display:inline-flex; gap:6px; align-items:center; }

  .contact{ display:flex; gap:8px; flex-wrap:wrap; }
  .contact__btn{
    border: 1px solid rgba(15,23,42,.10);
    background:#fff;
    padding: 8px 10px;
    border-radius: 12px;
    font-size: 12.5px;
    font-weight: 800;
    color: rgba(15,23,42,.75);
    display:inline-flex;
    gap:8px;
    align-items:center;
    cursor:pointer;
  }
  .contact__btn:hover{ border-color: rgba(124,58,237,.22); color:#0f172a; }

  .proposal{
    margin-top: 12px;
    border-radius: 14px;
    border: 1px solid rgba(124,58,237,.14);
    background: linear-gradient(135deg, rgba(124,58,237,.08), rgba(6,182,212,.05));
    padding: 12px;
  }
  .proposal__label{
    font-size: 12.5px;
    font-weight: 950;
    color:#4c1d95;
    display:flex;
    gap:8px;
    align-items:center;
  }
  .proposal__text{
    margin-top: 8px;
    font-size: 13.5px;
    font-weight: 650;
    color: rgba(15,23,42,.78);
    line-height: 1.5;
  }

  .result{
    margin-top: 12px;
    padding: 12px;
    border-radius: 14px;
    border: 1px solid rgba(15,23,42,.08);
    background: rgba(248,250,252,.9);
  }
  .result__head{
    font-size: 12.5px;
    font-weight: 950;
    color: rgba(15,23,42,.7);
    display:flex;
    gap:8px;
    align-items:center;
  }
  .result__body{
    margin-top: 8px;
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    align-items:center;
    justify-content:space-between;
  }
  .result__type{
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
    border: 1px solid rgba(15,23,42,.08);
  }
  .result__type.DONG_Y{ background: rgba(34,197,94,.12); border-color: rgba(34,197,94,.22); color:#166534; }
  .result__type.TU_CHOI{ background: rgba(239,68,68,.12); border-color: rgba(239,68,68,.22); color:#991b1b; }
  .result__time{ font-size: 12.5px; font-weight: 750; color: rgba(15,23,42,.65); display:flex; gap:8px; align-items:center; }

  .result__extra{ margin-top: 10px; display:flex; gap:10px; flex-wrap:wrap; }
  .mini{
    font-size: 12.5px;
    font-weight: 700;
    color: rgba(15,23,42,.75);
    display:inline-flex;
    gap:8px;
    align-items:center;
  }
  .mini b{ color:#0f172a; }

  .item__right{
    display:flex;
    flex-direction:column;
    gap:10px;
    justify-content:space-between;
    padding-left: 6px;
  }
  .manager{
    display:flex;
    gap:10px;
    align-items:center;
    padding: 10px;
    border-radius: 16px;
    border: 1px solid rgba(15,23,42,.08);
    background: rgba(15,23,42,.02);
  }
  .manager__avatar{
    width:40px;height:40px;border-radius: 50px;
    overflow:hidden;
    border: 1px solid rgba(15,23,42,.10);
  }
  .manager__avatar img{ width:100%;height:100%;object-fit:cover; }
  .manager__label{ font-size: 12px; font-weight: 850; color: rgba(15,23,42,.55); }
  .manager__name{ font-size: 13px; font-weight: 950; color:#0f172a; margin-top: 2px; }

  .btn{
    width: 100%;
    border: 0;
    cursor: pointer;
    padding: 12px 12px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 950;
    color:#fff;
    background: linear-gradient(135deg, #7c3aed, #06b6d4);
    box-shadow: 0 12px 25px rgba(124,58,237,.20);
    display:flex;
    gap:10px;
    align-items:center;
    justify-content:center;
  }
  .btn:hover{ filter: brightness(1.03); transform: translateY(-1px); }
  .btn:active{ transform: translateY(0); }

  .empty{
    padding: 40px 14px;
    text-align:center;
    color: rgba(15,23,42,.6);
  }
  .empty__icon{
    width:64px;height:64px;border-radius: 18px;
    margin: 0 auto 10px;
    display:grid;place-items:center;
    background: rgba(15,23,42,.04);
    border: 1px solid rgba(15,23,42,.08);
    color: rgba(15,23,42,.55);
    font-size: 26px;
  }
  .empty__title{ font-size: 16px; font-weight: 950; color: rgba(15,23,42,.75); }
  .empty__sub{ margin-top: 6px; font-size: 13px; font-weight: 650; }

  /* ====== SIDEBAR ====== */
  .panel--side .side-body{ padding: 14px; display:flex; flex-direction:column; gap:12px; }
  .side-title{ font-weight: 950; display:flex; gap:10px; align-items:center; color:#0f172a; }
  .select{
    border: 1px solid rgba(15,23,42,.12);
    border-radius: 12px;
    padding: 10px 12px;
    font-size: 13px;
    font-weight: 850;
    outline:none;
    background:#fff;
  }
  .select:focus{ border-color: rgba(124,58,237,.35); box-shadow: 0 0 0 3px rgba(124,58,237,.12); }

  .side-kpis{
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    gap:10px;
  }
  .side-kpi{
    padding: 12px;
    border-radius: 16px;
    border: 1px solid rgba(15,23,42,.08);
    background: rgba(15,23,42,.02);
  }
  .side-kpi__label{ font-size: 12px; font-weight: 850; color: rgba(15,23,42,.55); }
  .side-kpi__value{ margin-top: 6px; font-size: 18px; font-weight: 950; color:#0f172a; }

  .chart-box{
    border-radius: 18px;
    border: 1px solid rgba(15,23,42,.08);
    overflow:hidden;
    background:#fff;
  }
  .chart-box__head{
    padding: 12px 12px;
    display:flex;
    gap:10px;
    align-items:center;
    justify-content:space-between;
    font-size: 13px;
    font-weight: 950;
    border-bottom: 1px solid rgba(15,23,42,.08);
    background: rgba(248,250,252,.9);
  }
  .chart-box__canvas{
    height: 250px;
    padding: 12px;
  }
  .pill{
    margin-left:auto;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 950;
    display:inline-flex;
    gap:8px;
    align-items:center;
    border: 1px solid rgba(15,23,42,.08);
  }
  .pill.positive{ background: rgba(34,197,94,.12); border-color: rgba(34,197,94,.22); color:#166534; }
  .pill.negative{ background: rgba(239,68,68,.12); border-color: rgba(239,68,68,.22); color:#991b1b; }
  .pill.neutral{ background: rgba(148,163,184,.18); border-color: rgba(148,163,184,.28); color:#334155; }

  /* ====== MODAL ====== */
  .modal-overlay{
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(2,6,23,.72);
    backdrop-filter: blur(8px);
  }
  .modal__head{
    padding: 14px 14px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    border-bottom: 1px solid rgba(15,23,42,.08);
    background: linear-gradient(180deg, rgba(248,250,252,.95), #fff);
  }
  .modal__title{
    font-size: 14px;
    font-weight: 950;
    display:flex;
    gap:10px;
    align-items:center;
    color:#0f172a;
  }
  .icon-btn{
    border:0;
    width:40px;height:40px;
    border-radius: 14px;
    background: rgba(15,23,42,.06);
    cursor:pointer;
  }
  .icon-btn:hover{ background: rgba(15,23,42,.10); }
  .modal__body{ padding: 14px; }
  .modal__foot{
    padding: 12px 14px;
    border-top: 1px solid rgba(15,23,42,.08);
    background: rgba(248,250,252,.95);
    display:flex;
    justify-content:flex-end;
  }
  .btn--ghost{
    background: rgba(15,23,42,.10);
    color:#0f172a;
    box-shadow:none;
  }
  .btn--ghost:hover{ background: rgba(15,23,42,.14); }

  .m-summary{ display:flex; flex-direction:column; gap:12px; }
  .m-person{ display:flex; gap:12px; align-items:center; }
  .m-avatar{
    width:52px;height:52px;border-radius: 16px;
    overflow:hidden;
    border: 1px solid rgba(15,23,42,.10);
  }
  .m-avatar img{ width:100%;height:100%;object-fit:cover; }
  .m-name{ font-size: 14px; font-weight: 950; }
  .m-sub{ margin-top: 2px; font-size: 12.5px; font-weight: 700; color: rgba(15,23,42,.6); }

  .m-grid{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap:10px;
  }
  .m-box{
    padding: 12px;
    border-radius: 16px;
    border: 1px solid rgba(15,23,42,.08);
    background: rgba(15,23,42,.02);
  }
  .m-box__label{
    font-size: 12px;
    font-weight: 900;
    color: rgba(15,23,42,.55);
    display:flex;
    gap:8px;
    align-items:center;
  }
  .m-box__value{
    margin-top: 8px;
    font-size: 13.5px;
    font-weight: 900;
    color:#0f172a;
    line-height: 1.35;
  }
  .m-box__value--accent{ color:#4c1d95; }

  .m-proposal{
    padding: 12px;
    border-radius: 16px;
    border: 1px solid rgba(124,58,237,.14);
    background: linear-gradient(135deg, rgba(124,58,237,.08), rgba(6,182,212,.05));
  }
  .m-proposal__label{
    font-size: 12.5px;
    font-weight: 950;
    color:#4c1d95;
    display:flex;
    gap:8px;
    align-items:center;
  }
  .m-proposal__text{
    margin-top: 8px;
    font-size: 13.5px;
    font-weight: 650;
    color: rgba(15,23,42,.78);
    line-height: 1.55;
  }

  .m-actions{
    margin-top: 12px;
    display:grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap:10px;
  }
  .btn--ok{ background: linear-gradient(135deg, #22c55e, #06b6d4); }
  .btn--no{ background: linear-gradient(135deg, #ef4444, #f59e0b); }
  .btn--note{ background: linear-gradient(135deg, #f59e0b, #7c3aed); }

  /* ====== RESPONSIVE ====== */
  @media (max-width: 1100px){
    .content{ grid-template-columns: 1fr; }
    .panel--side{ order: 2; }
  }
  @media (max-width: 780px){
    .topbar{ position: relative; }
    .topbar__right{ justify-content:flex-start; }
    .kpi{ min-width: 120px; }
    .item{ grid-template-columns: 1fr; }
    .item__right{ flex-direction:row; align-items:center; }
    .btn{ width: auto; flex: 1; }
    .manager{ flex: 1; }
    .m-grid{ grid-template-columns: 1fr; }
    .m-actions{ grid-template-columns: 1fr; }
    .search{ min-width: 220px; width: 100%; }
    .controls{ width: 100%; justify-content:space-between; }
    .tabs{ width: 100%; overflow:auto; }
  }
  .list::-webkit-scrollbar {
    width: 6px;
  }
  .list::-webkit-scrollbar-thumb {
    background: rgba(124,58,237,.35);
    border-radius: 999px;
  }
  .list::-webkit-scrollbar-track {
    background: transparent;
  }
  .list.loading {
    opacity: .6;
    pointer-events: none;
  }
  .pagination{
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px dashed rgba(15,23,42,.12);
    display:flex;
    gap:6px;
    justify-content:center;
    align-items:center;
    flex-wrap:wrap;
  }

  .pg-btn{
    min-width: 36px;
    height: 36px;
    border-radius: 12px;
    border: 1px solid rgba(15,23,42,.10);
    background:#fff;
    font-size: 13px;
    font-weight: 900;
    color: rgba(15,23,42,.75);
    cursor:pointer;
    display:grid;
    place-items:center;
  }

  .pg-btn:hover{
    border-color: rgba(124,58,237,.35);
    color:#4c1d95;
  }

  .pg-btn.active{
    background: linear-gradient(135deg, #7c3aed, #06b6d4);
    color:#fff;
    border: 0;
  }

  .pg-btn:disabled{
    opacity: .4;
    cursor: not-allowed;
  }
  .actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 12px;
  }
  .textarea {
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    resize: none;
    font-family: inherit;
  }

  .textarea:focus {
    outline: none;
    border-color: #ef4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
  }

  /* ✅ Vue 3 scoped – xuyên ra ngoài component */
  :deep(.modal-backdrop) {
    --bs-backdrop-bg: rgba(2, 6, 23, 1);
    --bs-backdrop-opacity: 0.92;
    backdrop-filter: blur(14px) saturate(1.1);
  }


  </style>
