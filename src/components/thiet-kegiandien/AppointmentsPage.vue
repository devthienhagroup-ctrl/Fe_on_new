<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, watch, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import api from '/src/api/api.js'
import FileNew from './File.vue'
import NotificationBell from '/src/components/NotificationBell.vue'
Chart.register(...registerables)
import {useAuthStore} from "/src/stores/authStore.js";
const authStore = useAuthStore();
const info = authStore.userInfo;
// Trong script setup, thêm route
const rootRef = ref(null)
const cleanupHandlers = []
let chart1 = null
let chart2 = null
let chart3 = null
let chart4 = null
let chart5 = null
const statsReady = ref(false)

// ===== Stats (KHÔNG ăn theo bộ lọc) =====
const statTotal = ref(0)
const statSelectedDay = ref(0)
const statUp = ref(0)
const statPending = ref(0)
const statCancelled = ref(0)
// ===== Filter (CHỈ áp dụng cho Calendar + Day Schedule + Table) =====
const activeFilterText = ref('Tháng này')
const activeFilterCount = ref(0)
const filteredAppointments = ref([])

const daySlots = ref([])
const dayTitle = ref('')
const calendarTitle = ref('')
const calendarCells = ref([])
const historyItems = ref([])

const openActionMenuId = ref(null)
const dragOverSlot = ref(null)
// ===== Summary from BE =====
const statsAppointments = ref([])


function getActionInfo(action) {
  return APPOINTMENT_ACTION[action] || {
    label: action,
    cls: 'act-other',
  }
}

const registerWindowListener = (event, handler, options) => {
  window.addEventListener(event, handler, options)
  cleanupHandlers.push(() => window.removeEventListener(event, handler, options))
}

const $ = (sel, root = rootRef.value) => (root ? root.querySelector(sel) : null)
const pad2 = (n) => String(n).padStart(2, '0')
const nowISO = () => new Date().toISOString()
function getTodayISO() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const currentUser = { name: 'Lê Hiếu' }


const STAFF_BY_BRANCH = {
  CN_Q1: ['Lê Hiếu', 'Nguyễn Văn A', 'Trần Thị B'],
  CN_TD: ['Phạm Văn C', 'Trần Thị B'],
  CN_BD: ['Nguyễn Văn A', 'Phạm Văn C'],
}
const CONSULTANTS = ['Tư vấn 1', 'Tư vấn 2', 'Nguyễn Văn A', 'Trần Thị B', 'Lê Hiếu']

const STATUS = {
  WAITING: { label: 'Chờ đến hẹn', cls: 'st-wait', dot: '#fbbf24' },
  UP: { label: 'Đã lên', cls: 'st-up', dot: '#22c55e' },
  NOT_UP: { label: 'Chưa lên', cls: 'st-not', dot: '#fa709a' },
  POSTPONED: { label: 'Tạm hoãn', cls: 'st-post', dot: '#4facfe' },
  CANCELLED: { label: 'Huỷ', cls: 'st-cancel', dot: '#ff5858' },
}
// ===== Consult Status (KQ tư vấn) =====
const ConsultStatus = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
  CARE: 'CARE',
}

const CONSULT_STATUS = {
  SUCCESS: { label: 'Thành công', cls: 'cs-ok', icon: 'fa-circle-check' },
  FAIL: { label: 'Thất bại', cls: 'cs-fail', icon: 'fa-circle-xmark' },
  CARE: { label: 'Chăm sóc', cls: 'cs-care', icon: 'fa-hand-holding-heart' },
}
function getConsultInfo(value) {
  // ✅ null / undefined
  if (!value) {
    return {
      label: 'Chưa có',
      cls: 'cs-none',
      icon: 'fa-circle-minus',
    }
  }

  // ✅ value không nằm trong enum
  return CONSULT_STATUS[value] || {
    label: value,
    cls: 'cs-unknown',
    icon: 'fa-circle-question',
  }
}
function getStatusInfo(value) {
  return STATUS[value] || {
    label: value || 'Chưa có',
    cls: 'st-unknown',
    dot: '#94a3b8',
  }
}

const APPOINTMENT_ACTION = {
  CREATE: { label: 'Tạo mới', cls: 'act-create' },
  EDIT: { label: 'Chỉnh sửa', cls: 'act-edit' },
  STATUS: { label: 'Đổi trạng thái', cls: 'act-status' },
  RESCHEDULE: { label: 'Dời lịch', cls: 'act-reschedule' },
  NOTE: { label: 'Ghi chú', cls: 'act-note' },
  DELETE: { label: 'Xoá lịch', cls: 'act-delete' },
}

const CUSTOMER_TYPE = {
  CHINH_CHU:  { label: 'Chính chủ', cls: 'ct-owner' },
  MOI_GIOI:   { label: 'Môi giới', cls: 'ct-broker' },
  NGUOI_THAN: { label: 'Người thân', cls: 'ct-relative' },
}
function getCustomerTypeInfo(value) {
  return CUSTOMER_TYPE[value] || {
    label: value || 'Chưa có',
    cls: 'ct-unknown',
  }
}


const RATING = {
  BAN_NHANH_30N: { label: 'Bán nhanh 30 ngày', cls: 'rt-bn30' },
  BAN_GP: { label: 'Bán giải pháp', cls: 'rt-bgp' },
}

const services = ref([])
const servicesLoading = ref(false)
const serviceOptions = computed(() => services.value)

const normalizeColor = (color) => (color ? String(color).trim() : '')

function parseColorToRgb(color) {
  if (!color) return null
  const hex = color.startsWith('#') ? color.slice(1) : null
  if (hex) {
    const value = hex.length === 3
      ? hex.split('').map((c) => c + c).join('')
      : hex
    if (value.length !== 6) return null
    const r = Number.parseInt(value.slice(0, 2), 16)
    const g = Number.parseInt(value.slice(2, 4), 16)
    const b = Number.parseInt(value.slice(4, 6), 16)
    return [r, g, b]
  }
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (rgbMatch) {
    return [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])]
  }
  return null
}

function getServiceById(serviceId) {
  if (!serviceId) return null
  return serviceOptions.value.find((s) => String(s.id ?? s.name) === String(serviceId)) || null
}

function getServiceDisplay(appt) {
  const service = getServiceById(appt?.rating)
  const label =
    appt?.tenDichVu ||
    appt?.serviceName ||
    service?.name ||
    RATING[appt?.rating]?.label ||
    appt?.rating ||
    'Chưa có'
  const color = normalizeColor(
    appt?.mauDichVu ||
    appt?.serviceColor ||
    service?.mauDichVu ||
    service?.color
  )
  return { label, color }
}

function getServiceChipStyle(appt) {
  const { color } = getServiceDisplay(appt)
  const rgb = parseColorToRgb(color)
  if (!rgb) return {}
  const [r, g, b] = rgb
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.18)`,
    color: `rgb(${r}, ${g}, ${b})`,
    borderColor: `rgba(${r}, ${g}, ${b}, 0.28)`,
  }
}

const DAY_START_HOUR = 8
const DAY_END_HOUR = 17
const TIME_SLOTS = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR + 1 }, (_, i) => `${pad2(DAY_START_HOUR + i)}:00`)

function timeToMinutes(time) {
  const [h, m] = String(time || '').split(':')
  return Number(h) * 60 + Number(m)
}

function buildDaySlotTimes(list) {
  const times = new Set(TIME_SLOTS)
  list.forEach((a) => {
    if (!a?.time) return
    const minutes = timeToMinutes(a.time)
    if (Number.isNaN(minutes)) return
    if (minutes < DAY_START_HOUR * 60 || minutes > DAY_END_HOUR * 60) return
    times.add(a.time)
  })
  return Array.from(times).sort((a, b) => timeToMinutes(a) - timeToMinutes(b))
}

function formatVNDate(yyyyMMdd) {
  const [y, m, d] = yyyyMMdd.split('-')
  return `${d}/${m}/${y}`
}
function formatShortDateLabel(dateObj) {
  return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`
}
function formatCurrencyVND(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '-'
  return number.toLocaleString('vi-VN') + ' đ'
}
function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}
function startOfWeek(dateObj) {
  const d = new Date(dateObj)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}
function endOfWeek(dateObj) {
  const s = startOfWeek(dateObj)
  const e = new Date(s)
  e.setDate(e.getDate() + 7)
  return e
}
function endOfWeekInclusive(dateObj) {
  const s = startOfWeek(dateObj)
  const e = new Date(s)
  e.setDate(e.getDate() + 6)
  return e
}
function initials(name) {
  const parts = String(name || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
  if (parts.length === 0) return 'NA'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function showToast(title, body, type = 'info') {
  const wrap = $('#toastWrap')
  if (!wrap) return
  const icon = type === 'error' ? 'fa-triangle-exclamation' : type === 'success' ? 'fa-circle-check' : 'fa-circle-info'

  const t = document.createElement('div')
  t.className = `toast ${type}`
  t.innerHTML = `
    <div class="ico"><i class="fa-solid ${icon}"></i></div>
    <div class="t">
      <div class="a">${title}</div>
      <div class="b">${body || ''}</div>
    </div>
    <button class="x" aria-label="close"><i class="fa-solid fa-xmark"></i></button>
  `
  wrap.appendChild(t)

  const kill = () => t.remove()
  t.querySelector('.x').addEventListener('click', kill)
  setTimeout(kill, 3800)
}

// ===== Date =====
const selectedDateISO = ref(getTodayISO())
const calendarMonth = ref(new Date())

// ===== Filter controls =====
const activeRange = ref('month') // today | week | month
const activeStatus = ref('ALL')
const searchQuery = ref('')
const searchKeyword = ref('')
const appointmentsLoading = ref(false)
const appointmentsError = ref('')
let searchTimer = null

// ===== Modals =====
const editId = ref(null)
const isModalOpen = ref(false)
const isCreateModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const confirmDialog = reactive({
  open: false,
  title: '',
  message: '',
  confirmText: 'Đồng ý',
  cancelText: 'Để sau',
  variant: 'info',
  showCancel: true,
  resolve: null,
})
const selectedAppointment = ref(null)
const detailCardRef = ref(null)
const historyPanelRef = ref(null)

// ===== Create form =====
const createForm = reactive({
  customerSearch: '',
  selectedCustomer: null,
  branch: null,
  date: '',
  time: '',
  staff: '',
  consultant: 'Tư vấn 1',
  note: '',
  rating: null,
})

const editForm = reactive({
  branch: null,
  date: '',
  time: '',
  consultantId: null,
  status: 'WAITING',
  rating: null,
  note: '',
  customerNote: '',
  updateReason: '',
  consultStatus: null
})
const editContext = reactive({
  phone: '',
  serviceId: null,
})

function makeHistory(actor, action, desc) {
  return { ts: nowISO(), actor, action, desc }
}



/**
 * Flags for marker rule:
 * - createdByMe => ORANGE marker
 * - inCharge => BLUE marker
 */
const appointments = ref([])

function getRowMarker(appt) {
  if (appt?.createdByMe) return { color: '#f97316', glow: 'rgba(253, 230, 138, 0.75)' } // ORANGE
  if (appt?.inCharge) return { color: '#2563eb', glow: 'rgba(191, 219, 254, 0.78)' } // BLUE
  return { color: '#667eea', glow: 'rgba(224, 231, 255, 0.7)' }
}

function monthTitle(d) {
  return `Tháng ${d.getMonth() + 1}, ${d.getFullYear()}`
}

// ===== Conflict =====
function hasConflict({ id = null, date, time, staff }) {
  return appointments.value.find((a) => a.id !== id && a.date === date && a.time === time && a.staff === staff && a.status !== 'CANCELLED')
}

// ===== Apply filters (Calendar + Day + Table) =====
function applyFilters(list) {
  const out = [...list]
  out.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))
  return out
}

function updateFilterOutputs() {
  const filtered = applyFilters(appointments.value)
  filteredAppointments.value = filtered
  activeFilterCount.value = filtered.length

  const rangeText =
      activeRange.value === 'today' ? 'Ngày' : activeRange.value === 'week' ? 'Tuần' : 'Tháng'
  activeFilterText.value = `${rangeText}`
}

function updateGlobalStats() {
  const all = [...statsAppointments.value]
  statTotal.value = all.length
  statSelectedDay.value = all.filter((a) => a.date === selectedDateISO.value).length
  statUp.value = all.filter((a) => a.status === 'UP').length
  statPending.value = all.filter((a) => ['WAITING', 'NOT_UP', 'POSTPONED'].includes(a.status)).length
  statCancelled.value = all.filter((a) => a.status === 'CANCELLED').length
}

// ===== Calendar markers by day (orange/blue) =====
function getMonthKey() {
  const y = calendarMonth.value.getFullYear()
  const m = calendarMonth.value.getMonth()
  return { y, m, key: `${y}-${pad2(m + 1)}` }
}
function buildDayMarkerMap(monthKey) {
  const map = new Map() // dayNumber -> marker {color, glow}
  const monthAppts = appointments.value.filter((a) => a.date.startsWith(monthKey) && a.status !== 'CANCELLED')
  monthAppts.forEach((a) => {
    const day = Number(a.date.slice(-2))
    const mk = map.get(day)
    const marker = getRowMarker(a)
    // ưu tiên ORANGE nếu có createdByMe; nếu không thì BLUE
    if (!mk) {
      map.set(day, marker)
    } else {
      if (marker.color === '#ffb347') map.set(day, marker)
    }
  })
  return map
}

// ===== Disable calendar days for today/week =====
function isCellEnabled(iso) {
  if (!iso) return false
  if (activeRange.value === 'month') return true
  const refDate = new Date(`${selectedDateISO.value}T00:00:00`)
  if (activeRange.value === 'today') return true
  if (activeRange.value === 'week') {
    const s = startOfWeek(refDate)
    const e = endOfWeek(refDate)
    const d = new Date(`${iso}T00:00:00`)
    return d >= s && d < e
  }
  return true
}

function generateCalendar() {
  calendarTitle.value = monthTitle(calendarMonth.value)
  const year = calendarMonth.value.getFullYear()
  const month = calendarMonth.value.getMonth()
  const todayIso = getTodayISO()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const { key: monthKey } = getMonthKey()
  const markerMap = buildDayMarkerMap(monthKey)

  const cells = []

  for (let i = firstDay - 1; i >= 0; i -= 1) {
    cells.push({
      key: `prev-${i}`,
      label: prevMonthDays - i,
      iso: null,
      currentMonth: false,
      enabled: false,
      marker: null,
      classes: ['cal-date', 'other'],
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = `${year}-${pad2(month + 1)}-${pad2(day)}`
    const classes = ['cal-date', 'current']
    if (iso === todayIso) classes.push('today')
    if (iso === selectedDateISO.value) classes.push('selected')

    const marker = markerMap.get(day) || null
    if (marker) classes.push('has-appt')

    const enabled = isCellEnabled(iso)
    if (!enabled) classes.push('disabled')

    cells.push({
      key: `current-${iso}`,
      label: day,
      iso,
      currentMonth: true,
      enabled,
      marker,
      classes,
    })
  }

  const totalCells = 42
  const nextMonthDays = totalCells - (firstDay + daysInMonth)
  for (let i = 1; i <= nextMonthDays; i += 1) {
    cells.push({
      key: `next-${i}`,
      label: i,
      iso: null,
      currentMonth: false,
      enabled: false,
      marker: null,
      classes: ['cal-date', 'other'],
    })
  }

  calendarCells.value = cells
}

function getFilterRange() {
  const selectedDate = new Date(`${selectedDateISO.value}T00:00:00`)

  if (activeRange.value === 'today') {
    return { startDate: selectedDateISO.value, endDate: selectedDateISO.value }
  }

  if (activeRange.value === 'week') {
    const start = startOfWeek(selectedDate)
    const end = endOfWeekInclusive(selectedDate)
    return { startDate: toISODate(start), endDate: toISODate(end) }
  }

  const year = calendarMonth.value.getFullYear()
  const month = calendarMonth.value.getMonth()
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  return { startDate: toISODate(start), endDate: toISODate(end) }
}

function mapAppointmentFromApi(dto) {
  return {
    id: dto.appointmentId,
    customerId: dto.customerId,
    customer: dto.customerName,
    phone: dto.customerPhone,
    date: dto.appointmentDate,
    time: dto.appointmentTime,
    staffId: dto.staffId,
    staff: dto.staffName,
    consultantId: dto.consultantId,
    consultant: dto.consultantName,
    creatorId: dto.creatorId,
    creator: dto.creatorName,
    status: dto.status,
    consultStatus: dto.consultStatus,
    rating: dto.rating,
    tenDichVu: dto.tenDichVu ?? dto.serviceName ?? dto.dichVuName ?? '',
    mauDichVu: dto.mauDichVu ?? dto.serviceColor ?? dto.dichVuColor ?? '',
    fee: dto.phi ?? 0,
    createdByMe: dto.createdByMe,
    inCharge: dto.inCharge,
    branch: dto.branch || '',
    customerType: dto.customerType || null,
    note: dto.note || '',
    history: dto.history || [],
  }
}
const detailLoading = ref(false)
const detailError = ref('')
const editLoading = ref(false)
const editError = ref('')
function mapAppointmentDetailFromApi(dto) {
  return {
    id: dto.appointmentId,

    customerId: dto.customer?.id,
    customer: dto.customer?.name,
    phone: dto.customer?.phone,
    address: dto.customer?.address,
    oldAddress: dto.customer?.oldAress,
    customerNote: dto.customer?.customerNote,
    customerFee: dto.customer?.phi ?? null,
    customerType: dto.customer?.customerType,
    files: dto.customer?.files || [],
    giaBDS: dto.customer?.giaBDS || null,
    date: dto.appointmentDate,
    time: dto.appointmentTime,
    status: dto.status,
    consultStatus: dto.consultStatus,
    rating: dto.rating,
    maDichVu: dto.maDichVu ?? dto.serviceId ?? dto.dichVuId ?? null,
    tenDichVu: dto.tenDichVu ?? dto.serviceName ?? dto.dichVuName ?? '',
    mauDichVu: dto.mauDichVu ?? dto.serviceColor ?? dto.dichVuColor ?? '',
    note: dto.note,
    branchId: dto.branchID ?? null,   // ✅ ID
    branch: dto.branch ?? null,

    consultantId: dto.consultant?.id ?? dto.consultantId,
    consultant: dto.consultant?.name,
    creator: dto.creator?.name,

    history: (dto.histories || []).map(h => ({
      ts: h.createdAt,
      actor: h.actorName,
      action: h.action,
      desc: h.note,
      status: h.status,
      consultStatus: h.consultStatus,
    })),
  }
}
async function openDetailModal(appt) {
  isDetailModalOpen.value = true
  selectedAppointment.value = null
  detailLoading.value = true
  detailError.value = ''

  try {
    const res = await api.get(`/customer-crm/admin/lich-hen/${appt.id}`)
    const mapped = mapAppointmentDetailFromApi(res.data)
    selectedAppointment.value = mapped
    renderHistory(mapped)
    await nextTick()
    syncHistoryPanelHeight()
  } catch (e) {
    detailError.value = 'Không thể tải chi tiết lịch hẹn'
  } finally {
    detailLoading.value = false
  }
}

async function fetchAppointments() {
  if (appointmentsLoading.value) return

  const { startDate, endDate } = getFilterRange()
  const payload = {
    startDate,
    endDate,
    status: activeStatus.value === 'ALL' ? null : activeStatus.value,
    search: searchKeyword.value ? searchKeyword.value.trim() : null,
  }

  appointmentsLoading.value = true
  appointmentsError.value = ''

  try {
    const res = await api.post('/customer-crm/admin/lich-hen/filter', payload)
    const data = Array.isArray(res.data) ? res.data : []
    appointments.value = data.map(mapAppointmentFromApi)
  } catch (e) {
    appointments.value = []
    appointmentsError.value = 'Không thể tải lịch hẹn.'
    showToast('Lỗi tải lịch hẹn', e?.response?.data?.message || 'Không thể tải dữ liệu.', 'error')
  } finally {
    appointmentsLoading.value = false
  }

  generateCalendar()
  updateDaySchedule()
  updateFilterOutputs()
}

async function fetchStatsAppointments() {
  const { startDate, endDate } = getFilterRange()
  const payload = {
    startDate,
    endDate,
    status: null,
    search: null,
  }

  try {
    const res = await api.post('/customer-crm/admin/lich-hen/filter', payload)
    const data = Array.isArray(res.data) ? res.data : []
    statsAppointments.value = data.map(mapAppointmentFromApi)
  } catch (e) {
    statsAppointments.value = []
    showToast('Lỗi tải thống kê', e?.response?.data?.message || 'Không thể tải dữ liệu.', 'error')
  }
}

async function refreshAppointmentsAndStats() {
  await Promise.all([fetchAppointments(), fetchStatsAppointments()])
}

function handleCalendarClick(cell) {
  if (!cell.currentMonth || !cell.iso) return
  if (!cell.enabled) return

  selectedDateISO.value = cell.iso
  updateDaySchedule()
  updateFilterOutputs()
  generateCalendar()
}

function handleMonthNav(dir) {
  if (activeRange.value !== 'month') return
  const y = calendarMonth.value.getFullYear()
  const m = calendarMonth.value.getMonth()
  const next = new Date(y, m + dir, 1)
  calendarMonth.value = next
  const nextISO = `${next.getFullYear()}-${pad2(next.getMonth() + 1)}-01`
  selectedDateISO.value = nextISO
  generateCalendar()
  updateDaySchedule()
  updateFilterOutputs()
}

function shiftSelectedDate(days) {
  const base = new Date(`${selectedDateISO.value}T00:00:00`)
  base.setDate(base.getDate() + days)
  selectedDateISO.value = toISODate(base)
  calendarMonth.value = new Date(base.getFullYear(), base.getMonth(), 1)
  generateCalendar()
  updateDaySchedule()
  updateFilterOutputs()
}

function handleRangeNav(dir) {
  if (activeRange.value === 'month') {
    handleMonthNav(dir)
    return
  }
  if (activeRange.value === 'week') {
    shiftSelectedDate(dir * 7)
    return
  }
  if (activeRange.value === 'today') {
    shiftSelectedDate(dir)
  }
}

// ===== Day schedule (ăn theo selectedDate + filter range disable) =====
function apptsForSelectedDay() {
  // Day Schedule cũng phải nằm trong range
  const inRange = isCellEnabled(selectedDateISO.value)
  if (!inRange) return []
  return appointments.value.filter((a) => a.date === selectedDateISO.value).sort((a, b) => a.time.localeCompare(b.time))
}

function updateDaySchedule() {
  dayTitle.value = `Day Schedule • ${formatVNDate(selectedDateISO.value)}`
  const list = apptsForSelectedDay()

  const slotTimes = buildDaySlotTimes(list)
  const byTime = new Map()
  slotTimes.forEach((t) => byTime.set(t, []))
  list.forEach((a) => {
    const minutes = timeToMinutes(a.time)
    if (Number.isNaN(minutes)) return
    if (minutes < DAY_START_HOUR * 60 || minutes > DAY_END_HOUR * 60) return
    if (!byTime.has(a.time)) byTime.set(a.time, [])
    byTime.get(a.time).push(a)
  })

  daySlots.value = slotTimes.map((t) => ({ time: t, appointments: byTime.get(t) || [] }))
}

// ===== Drag/drop =====
function handleDragStart(e, appt) {
  if (appt.status === 'CANCELLED') return
  e.dataTransfer.setData('text/plain', String(appt.id))
  e.dataTransfer.effectAllowed = 'move'
}
function handleDragOver(e, time) {
  e.preventDefault()
  dragOverSlot.value = time
}
function handleDragLeave(time) {
  if (dragOverSlot.value === time) dragOverSlot.value = null
}
async function handleDrop(e, targetTime) {
  e.preventDefault()
  dragOverSlot.value = null

  const id = Number(e.dataTransfer.getData('text/plain'))
  if (!id || !targetTime) return

  const appt = appointments.value.find((x) => x.id === id)
  if (!appt) return

  if (appt.status === 'CANCELLED') {
    showToast('Không thể dời giờ', 'Lịch đã huỷ không thể thay đổi.', 'error')
    return
  }

  // chỉ cho đổi trong ngày đang chọn
  if (!isCellEnabled(selectedDateISO.value)) return

  if (appt.date === selectedDateISO.value && appt.time === targetTime) return

  try {
    const payload = {
      appointmentId: appt.id,
      appointmentDate: selectedDateISO.value,
      appointmentTime: targetTime, // String HH:mm
    }

    const res = await showLoading(
        api.post('/customer-crm/admin/lich-hen/update-time', payload)
    )

    if (!res.data.success) {
      updateAlertError(res?.data?.message || 'Không thể dời giờ')
      return
    }

    // ✅ CHỈ SAU KHI BE OK → reload
    await refreshAppointmentsAndStats()

    updateAlertSuccess(
        res?.data?.message || 'Đã dời giờ hẹn',
        `${appt.customer}: ${formatVNDate(appt.date)} → ${targetTime}`,
    )
  } catch (e) {
    console.error(e)
    showToast(
        'Lỗi dời giờ',
        e?.response?.data?.message || 'Không thể cập nhật giờ hẹn.',
        'error'
    )
  }
}

// ===== Customer search =====
// ===== Customer search (CALL API) =====
let suppressCustomerSearch = false
const customerSearchResults = ref([])
const customerSearchLoading = ref(false)
const customerSearchError = ref('')

let customerSearchTimer = null
let lastCustomerKeyword = ''

async function fetchCustomerSearch(keyword) {
  const k = (keyword || '').trim()
  if (!k) {
    customerSearchResults.value = []
    customerSearchError.value = ''
    return
  }

  // tránh spam cùng keyword
  if (k === lastCustomerKeyword) return
  lastCustomerKeyword = k

  customerSearchLoading.value = true
  customerSearchError.value = ''

  try {
    const qs = new URLSearchParams({ keyword: k }).toString()
    const res = await api.get(`/customer-crm/admin/lich-hen/search-customer?${qs}`)

    const data = await res.data

    // BE trả: List<CustomerSimpleDTO> { customerId, customerName, phone }
    customerSearchResults.value = (Array.isArray(data) ? data : []).slice(0, 8).map((x) => ({
      id: x.customerId,
      name: x.customerName,
      phone: x.phone,
      avatar: initials(x.customerName),
      raw: x,
    }))
  } catch (e) {
    customerSearchResults.value = []
    customerSearchError.value = 'Không tìm thấy hoặc lỗi tải dữ liệu.'
  } finally {
    customerSearchLoading.value = false
  }
}

function clearCustomerSearchTimer() {
  if (customerSearchTimer) clearTimeout(customerSearchTimer)
  customerSearchTimer = null
}

// WATCH: gõ là gọi API (debounce)
watch(
    () => createForm.customerSearch,
    (val) => {
      if (suppressCustomerSearch) return

      // nếu đã chọn customer và input đang đúng tên customer => không search nữa
      if (createForm.selectedCustomer && (val || '').trim() === (createForm.selectedCustomer.name || '').trim()) {
        customerSearchResults.value = []
        customerSearchLoading.value = false
        customerSearchError.value = ''
        return
      }

      // nếu đã chọn nhưng user gõ khác => bỏ chọn để search lại
      if (createForm.selectedCustomer && (val || '').trim() !== (createForm.selectedCustomer?.name || '').trim()) {
        createForm.selectedCustomer = null
      }

      clearCustomerSearchTimer()

      const k = (val || '').trim()
      if (!k) {
        lastCustomerKeyword = ''
        customerSearchResults.value = []
        customerSearchError.value = ''
        customerSearchLoading.value = false
        return
      }

      customerSearchTimer = setTimeout(() => {
        fetchCustomerSearch(k)
      }, 250)
    },
    { immediate: false },
)


// chọn customer
function selectCustomer(customer) {
  // chặn watch chạy API khi set lại input
  suppressCustomerSearch = true

  clearCustomerSearchTimer()
  customerSearchLoading.value = false
  customerSearchError.value = ''
  customerSearchResults.value = []

  createForm.selectedCustomer = customer
  createForm.customerSearch = customer.name

  // mở lại sau 1 tick (để watch nhận biết)
  setTimeout(() => {
    suppressCustomerSearch = false
  }, 0)
}



// ===== Create modal =====
function getStaffOptionsByBranch(branchKey) {
  return STAFF_BY_BRANCH[branchKey] || []
}
async function openCreateModal() {
  createForm.customerSearch = ''
  createForm.selectedCustomer = null
  createForm.date = selectedDateISO.value
  createForm.time = ''
  createForm.note = ''

  // ✅ CHI NHÁNH ĐẦU TIÊN
  if (!createForm.branch && BRANCHES.value.length > 0) {
    createForm.branch = BRANCHES.value[0].key
  }

  applyServiceDefaults()

  // ✅ LOAD NV TƯ VẤN THEO CHI NHÁNH
  await fetchCreateConsultantsByBranch(createForm.branch)

  isCreateModalOpen.value = true
}

function closeCreateModal() {
  isCreateModalOpen.value = false
  createForm.selectedCustomer = null
  createForm.customerSearch = ''
}

// ===== History =====
function renderHistory(appt) {
  const history = (appt.history || []).slice(0, 120)
  historyItems.value = history.map((h) => {
    const dt = new Date(h.ts)
    const stamp = `${pad2(dt.getHours())}:${pad2(dt.getMinutes())} • ${pad2(dt.getDate())}/${pad2(dt.getMonth() + 1)}/${dt.getFullYear()}`
    const actionInfo = getActionInfo(h.action)
    return { ...h, stamp, actionLabel: actionInfo.label, actionClass: actionInfo.cls }
  })
}

// ===== Detail modal =====
function closeDetailModal() {
  isDetailModalOpen.value = false
  selectedAppointment.value = null
}

function syncHistoryPanelHeight() {
  if (!detailCardRef.value || !historyPanelRef.value) return
  const leftHeight = detailCardRef.value.offsetHeight
  if (!leftHeight) return
  historyPanelRef.value.style.height = `${leftHeight}px`
}

// ===== Edit modal =====
async function openEditModal(id) {
  editId.value = id
  closeDetailModal()
  isModalOpen.value = true
  editLoading.value = true
  editError.value = ''

  try {
    const res = await api.get(`/customer-crm/admin/lich-hen/${id}`)
    const mapped = mapAppointmentDetailFromApi(res.data)
    console.log('Edit appointment data', mapped.branchId)
    editForm.branch = BRANCHES.value.find(
        b => b.key === mapped.branchId
    )?.key ?? null
    console.log('Mapped branch ID for edit form', editForm.branch)
    editForm.date = mapped.date || ''
    editForm.time = mapped.time || ''
    editForm.consultantId = mapped.consultantId || null
    editForm.status = mapped.status || 'WAITING'
    editForm.rating = mapped.maDichVu ?? mapped.rating ?? null
    editForm.note = mapped.note || ''
    editForm.customerNote = mapped.customerNote || ''
    editForm.consultStatus = mapped.consultStatus || null
    editContext.phone = mapped.phone || ''
    editContext.serviceId = mapped.maDichVu ?? mapped.rating ?? null
    applyServiceDefaults()

    renderHistory(mapped)
    await fetchEditConsultantsByBranch(editForm.branch)
  } catch (e) {
    editError.value = 'Không thể tải chi tiết lịch hẹn'
    showToast('Lỗi tải lịch hẹn', 'Không thể tải chi tiết lịch hẹn.', 'error')
  } finally {
    editLoading.value = false
  }
}
function closeEditModal() {
  isModalOpen.value = false
  editId.value = null
  editError.value = ''
  editLoading.value = false,
  editForm.updateReason = ''
}

function openConfirmDialog({
  title,
  message,
  confirmText = 'Đồng ý',
  cancelText = 'Để sau',
  variant = 'info',
  showCancel = true,
} = {}) {
  return new Promise((resolve) => {
    confirmDialog.open = true
    confirmDialog.title = title || 'Xác nhận thao tác'
    confirmDialog.message = message || ''
    confirmDialog.confirmText = confirmText
    confirmDialog.cancelText = cancelText
    confirmDialog.variant = variant
    confirmDialog.showCancel = showCancel
    confirmDialog.resolve = resolve
  })
}

const closeConfirmDialog = (value = false) => {
  confirmDialog.open = false
  if (confirmDialog.resolve) {
    confirmDialog.resolve(value)
  }
  confirmDialog.resolve = null
}

function getConfirmIcon(variant) {
  const icons = {
    success: 'fa-circle-check',
    danger: 'fa-triangle-exclamation',
    warning: 'fa-circle-exclamation',
    info: 'fa-circle-info',
  }
  return icons[variant] || icons.info
}
async function saveEditModal() {
  if (editId.value == null) return

  const payload = {
    appointmentId: editId.value,
    branchId: editForm.branch,
    appointmentDate: editForm.date,
    appointmentTime: editForm.time,
    consultantId: editForm.consultantId,
    status: editForm.status,
    rating: editForm.rating,
    consultStatus: editForm.consultStatus || null, // ✅ thêm
    note: editForm.note?.trim(),
    customerNote: editForm.customerNote?.trim(),
    updateReason: editForm.updateReason?.trim(),
  }

  console.log('Update appointment payload', payload)

  try {
    const res = await showLoading( api.post(
        '/customer-crm/admin/lich-hen/update',
        payload
    ));

    if (res.data.success) {
      updateAlertSuccess(res?.data?.message || 'Cập nhật lịch hẹn thành công')
      await refreshAppointmentsAndStats()
      const temp = editForm.consultStatus;
      closeEditModal()
      // reload list / calendar nếu cần
      if ( temp === ConsultStatus.SUCCESS) {
        const shouldCreateContract = await openConfirmDialog({
          title: 'Tạo hợp đồng cho khách hàng?',
          message: 'Buổi hẹn thành công. Bạn có muốn tạo hợp đồng ngay bây giờ không?',
          confirmText: 'Tạo hợp đồng',
          cancelText: 'Để sau',
          variant: 'success',
        })
        if (shouldCreateContract) {
          const payloadDraft = {
            phone: editContext.phone || null,
            serviceId: editForm.rating ?? editContext.serviceId ?? null,
            branchId: editForm.branch ?? null,
          }
          localStorage.setItem('contractDraftFromAppointment', JSON.stringify(payloadDraft))
          window.location.assign('/-thg/quan-ly-hop-dong')
        }
      }
    } else {
      updateAlertError(res?.data?.message || 'Cập nhật thất bại')
      await openConfirmDialog({
        title: 'Cập nhật thất bại',
        message: res?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
        confirmText: 'Đóng',
        showCancel: false,
        variant: 'danger',
      })
    }
  } catch (e) {
    console.error('❌ Lỗi gọi API update lịch hẹn', e)
  }
}
// ===== Lấy tất cả chi nhánh =========
const applyServiceDefaults = () => {
  const firstServiceId = serviceOptions.value[0]?.id ?? null
  const createHasService = serviceOptions.value.some(
    (service) => String(service.id ?? service.name) === String(createForm.rating)
  )
  const editHasService = serviceOptions.value.some(
    (service) => String(service.id ?? service.name) === String(editForm.rating)
  )
  if ((!createForm.rating || !createHasService) && firstServiceId) {
    createForm.rating = firstServiceId
  }
  if (isModalOpen.value && (!editForm.rating || !editHasService) && firstServiceId) {
    editForm.rating = firstServiceId
  }
}

const fetchServices = async () => {
  if (servicesLoading.value) return
  servicesLoading.value = true
  try {
    const res = await api.get('/dich-vu-thg/admin', {
      params: { keyword: null },
    })
    services.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    services.value = []
    showToast('Lỗi tải dịch vụ', 'Không thể tải danh sách dịch vụ.', 'error')
  } finally {
    servicesLoading.value = false
    applyServiceDefaults()
  }
}

// ===== Branch options (API) =====
const BRANCHES = ref([])
const branchLoading = ref(false)

async function fetchBranchOptions() {
  if (branchLoading.value) return

  branchLoading.value = true
  try {
    const res = await api.get('/customer-crm/admin/lich-hen/options')

    // BE trả: [{ id, address }]
    BRANCHES.value = (Array.isArray(res.data) ? res.data : []).map(b => ({
      key: Number(b.id),      // đảm bảo là number
      label: b.address,
    }))

    // ✅ AUTO SELECT CHI NHÁNH ĐẦU TIÊN
    if (!createForm.branch && BRANCHES.value.length > 0) {
      createForm.branch = BRANCHES.value[0].key
      createForm.staff = getStaffOptionsByBranch(createForm.branch)[0] || ''
    }

  } catch (e) {
    showToast('Lỗi tải chi nhánh', 'Không thể tải danh sách chi nhánh.', 'error')
    BRANCHES.value = []
  } finally {
    branchLoading.value = false
  }
}
function getBranchLabel(branchKey) {
  if (!branchKey) return '-'
  return BRANCHES.value.find((b) => b.key === branchKey)?.label || branchKey
}
// ======= Lấy nhân viên theo chi nhánh =======
// ===== Consultants for CREATE modal =====
const CREATE_CONSULTANTS = ref([])
const createConsultantsLoading = ref(false)
async function fetchCreateConsultantsByBranch(branchId) {
  if (!branchId) {
    CREATE_CONSULTANTS.value = []
    createForm.consultant = null
    return
  }

  createConsultantsLoading.value = true
  try {
    const res = await api.get('/customer-crm/admin/lich-hen/consultants', {
      params: { branchId },
    })

    CREATE_CONSULTANTS.value = Array.isArray(res.data) ? res.data : []

    // ✅ AUTO CHỌN NGƯỜI ĐẦU TIÊN
    createForm.consultant = CREATE_CONSULTANTS.value[0]?.id || null
  } catch (e) {
    CREATE_CONSULTANTS.value = []
    createForm.consultant = null
    showToast('Lỗi tải NV tư vấn', 'Không thể tải danh sách nhân viên tư vấn.', 'error')
  } finally {
    createConsultantsLoading.value = false
  }
}
watch(
    () => createForm.branch,
    async (branchId) => {
      if (!isCreateModalOpen.value) return
      await fetchCreateConsultantsByBranch(branchId)
    },
)

// ===== Consultants for EDIT modal =====
const EDIT_CONSULTANTS = ref([])
const editConsultantsLoading = ref(false)
async function fetchEditConsultantsByBranch(branchId) {
  if (!branchId) {
    EDIT_CONSULTANTS.value = []
    editForm.consultantId = null
    return
  }

  editConsultantsLoading.value = true
  try {
    const res = await api.get('/customer-crm/admin/lich-hen/consultants', {
      params: { branchId },
    })

    EDIT_CONSULTANTS.value = Array.isArray(res.data) ? res.data : []

    if (!EDIT_CONSULTANTS.value.find((c) => c.id === editForm.consultantId)) {
      editForm.consultantId = EDIT_CONSULTANTS.value[0]?.id || null
    }
  } catch (e) {
    EDIT_CONSULTANTS.value = []
    editForm.consultantId = null
    showToast('Lỗi tải NV phụ trách', 'Không thể tải danh sách nhân viên.', 'error')
  } finally {
    editConsultantsLoading.value = false
  }
}
watch(
    () => editForm.branch,
    async (branchId) => {
      if (!isModalOpen.value) return
      await fetchEditConsultantsByBranch(branchId)
    },
)


function buildCreateAppointmentPayload() {
  return {
    customerId: createForm.selectedCustomer.id,
    consultantId: createForm.consultant,      // ID NV tư vấn
    branchId: createForm.branch,               // ID chi nhánh
    appointmentDate: createForm.date,          // yyyy-MM-dd
    appointmentTime: createForm.time,          // HH:mm
    note: createForm.note || '',
    rating: createForm.rating || null,
  }
}
async function createAppointmentApi() {
  const payload = buildCreateAppointmentPayload()

  return api.post(
      '/customer-crm/admin/lich-hen/create-lich-hen',
      payload
  )
}

import {showCenterWarning, updateAlertError, updateAlertSuccess, showLoading} from "../../assets/js/alertService.js";
function isValidAppointmentTime(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // ❌ chỉ chặn ngày quá khứ (nếu muốn)
  if (date < today) {
    return {
      valid: false,
      message: 'Không thể tạo lịch hẹn cho ngày đã qua.'
    }
  }

  // ✅ không giới hạn giờ
  return { valid: true }
}



async function saveNewAppointment() {
  if (!createForm.selectedCustomer) {
    showCenterWarning('Thiếu thông tin', 'Vui lòng chọn khách hàng.', 'error')
    return
  }
  if (!createForm.date || !createForm.time) {
    showCenterWarning('Thiếu thông tin', 'Vui lòng chọn ngày và giờ.', 'error')
    return
  }
  if (!createForm.branch) {
    showCenterWarning('Thiếu thông tin', 'Vui lòng chọn chi nhánh.', 'error')
    return
  }
  if (!createForm.consultant) {
    showCenterWarning('Thiếu thông tin', 'Vui lòng chọn NV tư vấn.', 'error')
    return
  }
  if (!createForm.rating) {
    showCenterWarning('Thiếu thông tin', 'Vui lòng chọn dịch vụ.', 'error')
    return
  }

  const timeCheck = isValidAppointmentTime(
      createForm.date,
      createForm.time
  )

  if (!timeCheck.valid) {
    showCenterWarning('Thời gian không hợp lệ', timeCheck.message, 'error')
    return
  }

  try {
    const res = await showLoading(createAppointmentApi());

    if (!res.data.success) {
      updateAlertError(res?.data?.message || 'Không thể tạo lịch hẹn')
      return
    }

    updateAlertSuccess(res?.data?.message || 'Tạo lịch hẹn thành công')

    const createdAppointmentId =
      res?.data?.data?.appointmentId ??
      res?.data?.data?.id ??
      res?.data?.appointmentId ??
      res?.data?.id ??
      null
    const createdCustomerId = createForm.selectedCustomer?.id ?? null
    const createdDate = createForm.date
    const createdTime = createForm.time
    await refreshAppointmentsAndStats()
    closeCreateModal()
    if (createdAppointmentId) {
      await openDetailModal({ id: createdAppointmentId })
    } else {
      const fallback = appointments.value.find(
        (appt) =>
          appt.customerId === createdCustomerId &&
          appt.date === createdDate &&
          appt.time === createdTime,
      )
      if (fallback) {
        await openDetailModal({ id: fallback.id })
      }
    }
  } catch (e) {
    console.error(e)
    showToast(
        'Tạo lịch thất bại',
        e?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
        'error'
    )
  }
}

// ===== Export (theo filter của table) =====
function exportCSV() {
  const filtered = applyFilters(appointments.value)
  const header = ['Khách hàng', 'SĐT', 'Chi nhánh', 'Ngày', 'Giờ', 'NV phụ trách', 'Tình trạng', 'KQ tư vấn', 'Phân loại', 'Đánh giá', 'Người tạo', 'Ghi chú']

  const rows = filtered.map((a) => [
    a.customer,
    a.phone,
    a.branch ? BRANCHES.find((b) => b.key === a.branch)?.label || a.branch : '-',
    a.date,
    a.time,
    a.staff,
    STATUS[a.status].label,
    CONSULT_STATUS[a.consultStatus]?.label || '',
    CUSTOMER_TYPE[a.customerType]?.label || '',
    getServiceDisplay(a).label || '',
    a.creator,
    a.note || '',
  ])

  const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v || '').replaceAll('"', '""')}"`).join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `lich-hen_${selectedDateISO.value}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)

  showToast('Xuất file thành công', `Đã xuất ${filtered.length} dòng CSV.`, 'success')
}

// ===== Charts =====
function destroyCharts() {
  if (chart1) {
    chart1.destroy()
    chart1 = null
  }
  if (chart2) {
    chart2.destroy()
    chart2 = null
  }
  if (chart3) {
    chart3.destroy()
    chart3 = null
  }
  if (chart4) {
    chart4.destroy()
    chart4 = null
  }
  if (chart5) {
    chart5.destroy()
    chart5 = null
  }
}
function makeGrad(ctx, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, 220)
  stops.forEach((s) => g.addColorStop(s[0], s[1]))
  return g
}
const doughnutCenterPlugin = {
  id: 'doughnutCenterText',
  beforeDraw(chart) {
    const { ctx, chartArea } = chart
    if (!chartArea) return
    const dataset = chart.data.datasets?.[0]
    if (!dataset) return
    const total = (dataset.data || []).reduce((sum, val) => sum + (Number(val) || 0), 0)

    const centerX = (chartArea.left + chartArea.right) / 2
    const centerY = (chartArea.top + chartArea.bottom) / 2

    ctx.save()
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(total.toLocaleString('vi-VN'), centerX, centerY - 4)
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Tổng', centerX, centerY + 16)
    ctx.restore()
  },
}
function initCharts() {
  const c1 = $('#appointmentsChart')
  const c2 = $('#statusChart')
  const c3 = $('#successChart')
  const c4 = $('#successChartSecondary')
  const c5 = $('#revenueChart')

  destroyCharts()

  // Chart 1 (Bar)
  if (c1) {
    const ctx1 = c1.getContext('2d')
    const barGrad = makeGrad(ctx1, [
      [0, 'rgba(102,126,234,0.95)'],
      [0.6, 'rgba(118,75,162,0.7)'],
      [1, 'rgba(79,172,254,0.35)'],
    ])

    chart1 = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Số lịch hẹn',
            data: [],
            backgroundColor: barGrad,
            borderWidth: 0,
            borderRadius: 10,
            borderSkipped: false,
            barPercentage: 0.62,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(15,23,42,0.95)',
            padding: 10,
            titleColor: '#fff',
            bodyColor: '#e8edf6',
            displayColors: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#5b6576', font: { weight: '600' } },
            grid: { color: 'rgba(148,163,184,0.22)' },
          },
          x: {
            ticks: { color: '#5b6576', font: { weight: '600' } },
            grid: { display: false },
          },
        },
      },
    })
  }

  // Chart 2 (Doughnut)
  if (c2) {
    const ctx2 = c2.getContext('2d')
    const gWait = makeGrad(ctx2, [
      [0, 'rgba(251,191,36,0.95)'],
      [1, 'rgba(253,230,138,0.55)'],
    ])
    const gUp = makeGrad(ctx2, [
      [0, 'rgba(67,233,123,0.95)'],
      [1, 'rgba(56,249,215,0.55)'],
    ])
    const gNot = makeGrad(ctx2, [
      [0, 'rgba(250,112,154,0.92)'],
      [1, 'rgba(254,225,64,0.55)'],
    ])
    const gPost = makeGrad(ctx2, [
      [0, 'rgba(79,172,254,0.95)'],
      [1, 'rgba(0,242,254,0.55)'],
    ])
    const gCancel = makeGrad(ctx2, [
      [0, 'rgba(255,88,88,0.9)'],
      [1, 'rgba(240,152,25,0.55)'],
    ])
    chart2 = new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [gWait, gUp, gNot, gPost, gCancel],
            borderWidth: 0,
            hoverOffset: 6,
            spacing: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // ✅ PADDING CHO NGUYÊN CHART
        layout: {
          padding: {
            top: 16,
            right: 18,
            bottom: 22,
            left: 18,
          },
        },
        cutout: '72%',
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#455064', boxWidth: 10, boxHeight: 10, font: { weight: '600' } },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(20,22,30,0.92)',
            padding: 10,
            titleColor: '#fff',
            bodyColor: '#e8edf6',
            displayColors: true,
          },
        },
      },
      plugins: [doughnutCenterPlugin],
    })
  }

  // Chart 3 (Pie)
  if (c3) {
    const ctx3 = c3.getContext('2d')
    const gSuccess = makeGrad(ctx3, [
      [0, 'rgba(67,233,123,0.95)'],
      [1, 'rgba(56,249,215,0.55)'],
    ])
    const gFail = makeGrad(ctx3, [
      [0, 'rgba(255,88,88,0.9)'],
      [1, 'rgba(240,152,25,0.55)'],
    ])
    const gCare = makeGrad(ctx3, [
      [0, 'rgba(79,172,254,0.95)'],
      [1, 'rgba(0,242,254,0.55)'],
    ])
    chart3 = new Chart(ctx3, {
      type: 'pie',
      data: {
        labels: ['Thành công', 'Thất bại', 'Chăm sóc'],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: [gSuccess, gFail, gCare],
            borderWidth: 0,
            hoverOffset: 6,
            spacing: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 16,
            right: 18,
            bottom: 22,
            left: 18,
          },
        },
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#455064', boxWidth: 10, boxHeight: 10, font: { weight: '600' } },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(20,22,30,0.92)',
            padding: 10,
            titleColor: '#fff',
            bodyColor: '#e8edf6',
          },
        },
      },
    })
  }

  // Chart 4 (Pie - Secondary)
  if (c4) {
    const ctx4 = c4.getContext('2d')
    const gSuccess2 = makeGrad(ctx4, [
      [0, 'rgba(67,233,123,0.95)'],
      [1, 'rgba(56,249,215,0.55)'],
    ])
    const gFail2 = makeGrad(ctx4, [
      [0, 'rgba(255,88,88,0.9)'],
      [1, 'rgba(240,152,25,0.55)'],
    ])
    const gCare2 = makeGrad(ctx4, [
      [0, 'rgba(79,172,254,0.95)'],
      [1, 'rgba(0,242,254,0.55)'],
    ])
    chart4 = new Chart(ctx4, {
      type: 'pie',
      data: {
        labels: ['Thành công', 'Thất bại', 'Chăm sóc'],
        datasets: [
          {
            data: [0, 0, 0],
            backgroundColor: [gSuccess2, gFail2, gCare2],
            borderWidth: 0,
            hoverOffset: 6,
            spacing: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 16,
            right: 18,
            bottom: 22,
            left: 18,
          },
        },
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#455064', boxWidth: 10, boxHeight: 10, font: { weight: '600' } },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(20,22,30,0.92)',
            padding: 10,
            titleColor: '#fff',
            bodyColor: '#e8edf6',
          },
        },
      },
    })
  }

  // Chart 5 (Revenue)
  if (c5) {
    const ctx5 = c5.getContext('2d')
    const revenueGrad = makeGrad(ctx5, [
      [0, 'rgba(102,126,234,0.5)'],
      [0.6, 'rgba(118,75,162,0.25)'],
      [1, 'rgba(79,172,254,0.12)'],
    ])
    const revenueBorder = makeGrad(ctx5, [
      [0, 'rgba(102,126,234,0.95)'],
      [1, 'rgba(118,75,162,0.85)'],
    ])
    chart5 = new Chart(ctx5, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Doanh thu',
            data: [],
            backgroundColor: revenueGrad,
            borderColor: revenueBorder,
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#667eea',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(15,23,42,0.95)',
            padding: 10,
            titleColor: '#fff',
            bodyColor: '#e8edf6',
            callbacks: {
              label(context) {
                return `Doanh thu: ${formatCurrencyVND(context.parsed.y)}`
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#5b6576',
              font: { weight: '600' },
              callback: (value) => formatCurrencyVND(value),
            },
            grid: { color: 'rgba(148,163,184,0.22)' },
          },
          x: {
            ticks: { color: '#5b6576', font: { weight: '600' } },
            grid: { display: false },
          },
        },
      },
    })
  }
}

// ===== Action menu =====
function toggleActionMenu(id) {
  openActionMenuId.value = openActionMenuId.value === id ? null : id
}
function canEditAppointment(appt) {
  return !appt?.consultStatus
}
function handleAction(type, appt, event) {
  openActionMenuId.value = null
  if (type === 'edit') {
    if (!canEditAppointment(appt)) {
      showToast('Không thể chỉnh sửa', 'Lịch hẹn đã có kết quả tư vấn.', 'warning')
      return
    }
    openEditModal(appt.id)
  }
  else if (type === 'status') openStatusPopover(event.currentTarget, appt.id)
  else if (type === 'delete') {
    appointments.value = appointments.value.filter((x) => x.id !== appt.id)
    generateCalendar()
    updateDaySchedule()
    updateFilterOutputs()
    showToast('Đã xoá lịch hẹn', appt.customer || 'Đã xoá.', 'success')
  } else if (type === 'detail') openDetailModal(appt)
}
function updateStatusChart() {
  if (!chart2) return

  const counts = {
    WAITING: 0,
    UP: 0,
    NOT_UP: 0,
    POSTPONED: 0,
    CANCELLED: 0,
  }

  statsAppointments.value.forEach((appt) => {
    if (!appt?.status) return
    if (counts[appt.status] === undefined) return
    counts[appt.status] += 1
  })

  chart2.data.labels = [
    STATUS.WAITING.label,
    STATUS.UP.label,
    STATUS.NOT_UP.label,
    STATUS.POSTPONED.label,
    STATUS.CANCELLED.label,
  ]

  chart2.data.datasets[0].data = [
    counts.WAITING || 0,
    counts.UP || 0,
    counts.NOT_UP || 0,
    counts.POSTPONED || 0,
    counts.CANCELLED || 0,
  ]

  chart2.update()
}

function getLast7Days() {
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d)
  }
  return days
}
function updateAppointmentsChart() {
  if (!chart1) return

  const counts = new Map()
  statsAppointments.value.forEach((appt) => {
    if (!appt?.date) return
    counts.set(appt.date, (counts.get(appt.date) || 0) + 1)
  })

  const days = getLast7Days()
  chart1.data.labels = days.map((d) => formatShortDateLabel(d))
  chart1.data.datasets[0].data = days.map((d) => {
    const iso = toISODate(d)
    return counts.get(iso) || 0
  })
  chart1.update()
}
function updateConsultChart() {
  if (!chart3 && !chart4) return
  const counts = {
    [ConsultStatus.SUCCESS]: 0,
    [ConsultStatus.FAIL]: 0,
    [ConsultStatus.CARE]: 0,
  }

  statsAppointments.value.forEach((appt) => {
    if (!appt?.consultStatus) return
    if (counts[appt.consultStatus] === undefined) return
    counts[appt.consultStatus] += 1
  })

  const dataset = [
    counts[ConsultStatus.SUCCESS],
    counts[ConsultStatus.FAIL],
    counts[ConsultStatus.CARE],
  ]

  if (chart3) {
    chart3.data.datasets[0].data = dataset
    chart3.update()
  }
  if (chart4) {
    chart4.data.datasets[0].data = dataset
    chart4.update()
  }
}

function getDateRangeDays() {
  const { startDate, endDate } = getFilterRange()
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  const days = []
  const cursor = new Date(start)
  while (cursor <= end) {
    days.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

function updateRevenueChart() {
  if (!chart5) return

  const totals = new Map()
  statsAppointments.value.forEach((appt) => {
    if (!appt?.date) return
    if (appt.status !== 'UP') return
    if (appt.consultStatus !== ConsultStatus.SUCCESS) return
    const fee = Number(appt.fee || 0)
    if (!Number.isFinite(fee)) return
    totals.set(appt.date, (totals.get(appt.date) || 0) + fee)
  })

  const days = getDateRangeDays()
  chart5.data.labels = days.map((d) => formatShortDateLabel(d))
  chart5.data.datasets[0].data = days.map((d) => totals.get(toISODate(d)) || 0)
  chart5.update()
}

// ===== Watchers =====
watch(
    () => [activeRange.value, activeStatus.value],
    () => {
      // đổi range:
      // - today/week: khoá month nav, giữ selectedDate nằm trong range
      if (activeRange.value === 'month') {
        const d = new Date(`${selectedDateISO.value}T00:00:00`)
        calendarMonth.value = new Date(d.getFullYear(), d.getMonth(), 1)
      } else {
        // đảm bảo selected date enable
        if (!isCellEnabled(selectedDateISO.value)) {
          // kéo về start tuần / today
          if (activeRange.value === 'today') selectedDateISO.value = getTodayISO()
          if (activeRange.value === 'week') selectedDateISO.value = toISODate(startOfWeek(new Date(`${selectedDateISO.value}T00:00:00`)))
        }
      }

      generateCalendar()
      updateDaySchedule()
      updateFilterOutputs()
    },
)
watch(
    () => {
      const { startDate, endDate } = getFilterRange()
      return `${startDate}|${endDate}`
    },
    () => {
      if (!statsReady.value) return
      fetchStatsAppointments()
    },
    { immediate: false }
)

watch(
    () => searchQuery.value,
    (val) => {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        searchKeyword.value = (val || '').trim()
      }, 300)
    },
)

watch(
    () => [selectedAppointment.value, historyItems.value.length],
    async () => {
      await nextTick()
      syncHistoryPanelHeight()
    },
)

watch(
    () => selectedDateISO.value,
    () => {
      updateGlobalStats()
    },
)

watch(
    () => {
      const { startDate, endDate } = getFilterRange()
      return [startDate, endDate, activeStatus.value, searchKeyword.value].join('|')
    },
    () => {
      fetchAppointments()
    },
)
watch(
    () => statsAppointments.value,
    () => {
      updateGlobalStats()
      updateAppointmentsChart()
      updateStatusChart()
      updateConsultChart()
      updateRevenueChart()
    },
)
async function autoPickCustomerByPhone(phone) {
  // gán vào input tìm kiếm
  createForm.customerSearch = phone

  // gọi search
  await fetchCustomerSearch(phone)

  // đợi DOM + data
  await nextTick()

  // auto chọn khách đầu tiên (SĐT unique)
  if (customerSearchResults.value.length > 0) {
    selectCustomer(customerSearchResults.value[0])
  }


}

// ===== Mount =====
onMounted(async () => {
  if (!rootRef.value) return
// ===== AUTO MỞ MODAL TẠO LỊCH TỪ TELESALE =====

  const flagDatLich = localStorage.getItem('flagDatLich')
  const customerPhone = localStorage.getItem('customerPhone')
  try {
    await fetchServices()
    await fetchBranchOptions()
  } catch (e) {
    console.error('Fetch branch failed', e)
  }
  if (flagDatLich === 'true' && customerPhone) {
    // mở modal tạo lịch
    await openCreateModal()
    await nextTick()
    // auto tìm + chọn khách theo SĐT
    await autoPickCustomerByPhone(customerPhone)

    // xoá localStorage để tránh lặp
    localStorage.removeItem('flagDatLich')
    localStorage.removeItem('customerPhone')
  }
  // ===== Init date =====
  selectedDateISO.value = getTodayISO()
  calendarMonth.value = new Date() // tháng hiện tại

  // ===== Init data =====
  await fetchAppointments()


  // ===== Init charts =====
  await nextTick()
  initCharts()
  updateStatusChart()
  updateAppointmentsChart()
  updateConsultChart()
  updateRevenueChart()
  statsReady.value = true

  // ===== Fetch branch options (ONLY ONCE) =====


  // ===== Ready toast =====
  showToast('Sẵn sàng', 'Hệ thống quản lý lịch hẹn đã sẵn sàng.', 'success')

  // ===== Global listeners =====
  registerWindowListener('keydown', (e) => {
    if (e.key === 'Escape' && (isModalOpen.value || isCreateModalOpen.value || isDetailModalOpen.value || confirmDialog.open)) {
      if (isModalOpen.value) closeEditModal()
      if (isCreateModalOpen.value) closeCreateModal()
      if (isDetailModalOpen.value) closeDetailModal()
      if (confirmDialog.open) closeConfirmDialog(false)
    }
  })

  registerWindowListener('resize', async () => {
    await nextTick()
    initCharts()
    syncHistoryPanelHeight()
    updateStatusChart()
    updateAppointmentsChart()
    updateConsultChart()
    updateRevenueChart()
  })

  await fetchStatsAppointments()

})


onBeforeUnmount(() => {
  destroyCharts()
  cleanupHandlers.forEach((cleanup) => cleanup())
})
</script>

<template>
  <div class="header">
    <div class="page-title">
      <h2><i class="fa-solid fa-calendar-check me-2"></i>Quản lý lịch hẹn</h2>
      <p>Tạo, theo dõi và cập nhật trạng thái • phân loại • đánh giá</p>
    </div>
    <div class="d-flex align-items-center gap-2 ">
      <NotificationBell />
      <div class="d-flex flex-column align-items-end text-end">
        <div class="fw-semibold text-dark">{{ info.fullName }}</div>
      </div>

      <img
          v-if="info.avatarUrl"
          :src="' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + info.avatarUrl"
          alt="avatar"
          class="rounded-circle border"
          style="width: 36px; height: 36px; object-fit: cover;"
      />
      <div v-else class="avatar-circle">
        {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
      </div>
    </div>
  </div>
  <div ref="rootRef" class="appointments-page">
    <div class="toast-wrap" id="toastWrap"></div>

    <main class="main-content">


      <!-- Stats (KHÔNG ăn filter) -->
      <section class="stats">
        <div class="stat s1">
          <div class="k">Tổng lịch hẹn</div>
          <div class="v">{{ statTotal }}</div>
          <div class="hint">Trong {{ activeFilterText }}</div>
          <div class="i"><i class="fa-solid fa-layer-group"></i></div>
        </div>
        <div class="stat s5">
          <div class="k">Huỷ hẹn</div>
          <div class="v">{{ statCancelled }}</div>
          <div class="hint">Trong {{ activeFilterText }}</div>
          <div class="i"><i class="fa-solid fa-circle-xmark"></i></div>
        </div>
        <div class="stat s3">
          <div class="k">Đã lên</div>
          <div class="v">{{ statUp }}</div>
          <div class="hint">Trong {{ activeFilterText }}</div>
          <div class="i"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div class="stat s4">
          <div class="k">Chưa lên / Tạm hoãn</div>
          <div class="v">{{ statPending }}</div>
          <div class="hint">Trong {{ activeFilterText }}</div>
          <div class="i"><i class="fa-solid fa-bell"></i></div>
        </div>
      </section>

      <!-- Charts row (NẰM TRÊN BỘ LỌC + LỊCH) -->
      <section v-if="authStore.hasPermission('TELE_VIEN')" class="charts-row">
        <div class="chart-card c1">
          <div class="chart-head">
            <div class="ico-bubble gA"><i class="fa-solid fa-chart-column"></i></div>
            <div>
              <h4>Lịch hẹn theo ngày</h4>
              <p class="sub">Xu hướng 7 ngày gần nhất</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="appointmentsChart"></canvas>
          </div>
        </div>

        <div class="chart-card c2">
          <div class="chart-head">
            <div class="ico-bubble gB"><i class="fa-solid fa-chart-pie"></i></div>
            <div>
              <h4>Phân bố trạng thái</h4>
              <p class="sub">Tổng quan tình trạng lịch</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="statusChart"></canvas>
          </div>
        </div>

        <div class="chart-card c3">
          <div class="chart-head">
            <div class="ico-bubble gC"><i class="fa-solid fa-bullseye"></i></div>
            <div>
              <h4>Tỷ lệ thành công tư vấn</h4>
              <p class="sub">Hiệu quả theo kết quả</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="successChart"></canvas>
          </div>
        </div>
      </section>

      <section v-if="authStore.hasPermission('TU_VAN_VIEN')" class="charts-row">
        <div class="chart-card c3">
          <div class="chart-head">
            <div class="ico-bubble gC"><i class="fa-solid fa-bullseye"></i></div>
            <div>
              <h4>Tỷ lệ thành công tư vấn</h4>
              <p class="sub">Biểu đồ kết quả (bản sao)</p>
            </div>
          </div>
          <div class=" chart-container-wrapper">
          <div class="chart-container">
            <canvas id="successChartSecondary"></canvas>
          </div>
          </div>
        </div>

        <div class="chart-card c1 revenue-chart">
          <div class="chart-head">
            <div class="ico-bubble gA"><i class="fa-solid fa-sack-dollar"></i></div>
            <div>
              <h4>Doanh thu</h4>
              <p class="sub">Tổng phí từ lịch hẹn trong khoảng thời gian</p>
            </div>
          </div>
          <div class="chart-container">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>
      </section>

      <!-- Filters (CHỈ cho lịch + day + table) -->
      <div class="filters">
        <div class="filter-tabs">
          <button class="filter-btn" :class="{ active: activeRange === 'today' }" @click="activeRange = 'today'">
            Ngày
          </button>
          <button class="filter-btn" :class="{ active: activeRange === 'week' }" @click="activeRange = 'week'">
            Tuần
          </button>
          <button class="filter-btn" :class="{ active: activeRange === 'month' }" @click="activeRange = 'month'">
            Tháng
          </button>
        </div>

        <div class="status-filter">
          <div class="status-tag st-all" :class="{ active: activeStatus === 'ALL' }" @click="activeStatus = 'ALL'">Tất cả</div>
          <div class="status-tag st-wait-tag" :class="{ active: activeStatus === 'WAITING' }" @click="activeStatus = 'WAITING'">Chờ xác nhận</div>
          <div class="status-tag st-up-tag" :class="{ active: activeStatus === 'UP' }" @click="activeStatus = 'UP'">Đã lên</div>
          <div class="status-tag st-not-tag" :class="{ active: activeStatus === 'NOT_UP' }" @click="activeStatus = 'NOT_UP'">Chưa lên</div>
          <div class="status-tag st-post-tag" :class="{ active: activeStatus === 'POSTPONED' }" @click="activeStatus = 'POSTPONED'">Tạm hoãn</div>
          <div class="status-tag st-cancel-tag" :class="{ active: activeStatus === 'CANCELLED' }" @click="activeStatus = 'CANCELLED'">Huỷ</div>

          <div class="search-bar">
            <input
                id="searchInput"
                type="text"
                v-model="searchQuery"
                placeholder="Tìm theo tên / SĐT / NV phụ trách / người tạo..."
            />
          </div>
        </div>

        <div class="action-buttons">
<!--          <button class="btn btn-secondary" @click="exportCSV"><i class="fas fa-download"></i>Xuất file</button>-->
          <button class="btn btn-primary" @click="openCreateModal"><i class="fas fa-plus"></i>Tạo lịch hẹn</button>
        </div>
      </div>

      <!-- Calendar + Day Schedule -->
      <div class="calendar-day-row">
        <section class="card-surface calendar-section">
          <div class="card-head">
            <div class="card-title">
              <div class="ico-bubble gD"><i class="fa-solid fa-calendar"></i></div>
              <div>
                <h3>{{ calendarTitle }}</h3>
                <p class="sub">Click ngày để xem lịch • Chỉ ngày trong phạm vi filter được thao tác</p>
              </div>
            </div>

            <!-- chỉ hiện khi Tháng này -->
            <div class="calendar-nav">
              <button class="icon-btn" @click="handleRangeNav(-1)">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="icon-btn" @click="handleRangeNav(1)">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div class="calendar-days">
            <div class="day-name">CN</div>
            <div class="day-name">T2</div>
            <div class="day-name">T3</div>
            <div class="day-name">T4</div>
            <div class="day-name">T5</div>
            <div class="day-name">T6</div>
            <div class="day-name">T7</div>
          </div>

          <div class="calendar-dates">
            <div
                v-for="cell in calendarCells"
                :key="cell.key"
                :class="cell.classes"
                @click="handleCalendarClick(cell)"
                :style="cell.marker ? { '--mk': cell.marker.color, '--mkGlow': cell.marker.glow } : {}"
            >
              {{ cell.label }}
            </div>
          </div>

          <div class="legend">
            <div class="lg">
              <span class="mk mk-orange"></span>
              <span>Do mình tạo</span>
            </div>
            <div class="lg">
              <span class="mk mk-blue"></span>
              <span>Mình phụ trách</span>
            </div>
          </div>
        </section>

        <section class="card-surface day-section">
          <div class="card-head">
            <div class="card-title">
              <div class="ico-bubble gE"><i class="fa-solid fa-clock"></i></div>
              <div>
                <h3>{{ dayTitle }}</h3>
                <p class="sub">Kéo thả để dời giờ • Badge trạng thái giống table</p>
              </div>
            </div>
          </div>

          <!-- thu chiều cao bằng lịch + có scroll riêng -->
          <div class="day-body">
            <div class="slots">
              <div v-for="slot in daySlots" :key="slot.time" class="slot">
                <div class="slot-time">{{ slot.time }}</div>
                <div
                    class="slot-drop"
                    :class="{ over: dragOverSlot === slot.time }"
                    @dragover.prevent="handleDragOver($event, slot.time)"
                    @dragleave="handleDragLeave(slot.time)"
                    @drop.prevent="handleDrop($event, slot.time)"
                >
                  <template v-if="slot.appointments.length">
                    <div
                        v-for="appt in slot.appointments"
                        :key="appt.id"
                        class="appt-card"
                        :draggable="appt.status !== 'CANCELLED'"
                        :class="{ disabled: appt.status === 'CANCELLED' }"
                        @dragstart="handleDragStart($event, appt)"
                        @click="openDetailModal(appt)"
                        style="cursor: pointer"
                    >
                      <!-- marker dot (blink halo) -->
                      <span
                          class="appt-dot"
                          :style="{ '--mk': getRowMarker(appt).color, '--mkGlow': getRowMarker(appt).glow }"
                      ></span>

                      <div class="appt-main">
                        <div class="n">{{ appt.customer }}</div>
                        <div class="m phone-line">
                          <i class="fa-solid fa-phone me-1"></i>
                          {{ appt.phone || '' }}
                        </div>

                        <div class="appt-meta">
                          <span class="pill-soft">
                            <i class="fa-solid fa-building"></i>{{ appt.branch ? appt.branch : '-' }}
                          </span>
                          <span class="pill-soft">
                            <i class="fa-solid fa-user-tie"></i>{{ appt.staff }}
                          </span>

                          <!-- trạng thái giống table -->
                          <span
                              class="status-badge readonly"
                              :class="getStatusInfo(appt.status).cls"
                          >
                            {{ getStatusInfo(appt.status).label }}
                          </span>
                        </div>

                        <div v-if="appt.consultStatus" class="appt-sub">
                          KQ tư vấn: <b>{{ getConsultInfo(appt.consultStatus).label }}</b>
                        </div>
                      </div>

                      <div class="appt-cta">
                        <button
                          class="mini-btn"
                          :class="{ 'is-disabled': !canEditAppointment(appt) }"
                          :disabled="!canEditAppointment(appt)"
                          :title="!canEditAppointment(appt) ? 'Lịch hẹn đã có kết quả tư vấn' : 'Sửa'"
                          @click.stop="handleAction('edit', appt, $event)"
                        >
                          <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                      </div>
                    </div>
                  </template>

                  <span v-else class="slot-empty">
                    <i class="fa-regular fa-hand-point-up me-2"></i>Kéo thả lịch vào đây
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Table -->
      <section class="appointments-list">
        <div class="list-header">
          <h3><i class="fa-solid fa-list-check me-2"></i>Lịch hẹn theo bộ lọc</h3>
          <div class="pill-muted">
            <i class="fa-solid fa-filter"></i>
            <span>{{ activeFilterText }}</span>
            <span style="opacity: 0.55">•</span>
            <span>{{ activeFilterCount }}</span>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Ngày & Giờ</th>
              <th>Chi nhánh</th>
              <th>NV phụ trách</th>
              <th>KQ tư vấn</th>
              <th>Phân loại</th>
              <th>Dịch vụ</th>
              <th>Tình trạng</th>
              <th>Người tạo</th>
              <th style="width: 90px">Thao tác</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="appt in filteredAppointments" :key="appt.id">
              <td>
                <div class="customer-info">
                  <div
                      class="customer-avatar"
                      :style="{ '--mk': getRowMarker(appt).color, '--mkGlow': getRowMarker(appt).glow }"
                  >
                    {{ initials(appt.customer) }}
                    <span class="ava-dot"></span>
                  </div>
                  <div>
                    <div class="customer-name">{{ appt.customer }}</div>
                    <div class="customer-phone"><i class="fa-solid fa-phone me-1"></i>{{ appt.phone || '' }}</div>
                  </div>
                </div>
              </td>

              <td>
                  <span class="pill-muted">
                    <i class="fa-regular fa-calendar"></i>{{ formatVNDate(appt.date) }} • {{ appt.time }}
                  </span>
              </td>

              <td>
                  <span class="pill-soft">
                    <i class="fa-solid fa-building"></i>{{ appt.branch ? appt.branch : '-' }}
                  </span>
              </td>

              <td>{{ appt.staff }}</td>

              <td v-if="appt.consultStatus != null">
                  <span class="consult-badge" :class="getConsultInfo(appt.consultStatus).cls">
                    <i class="fa-solid" :class="getConsultInfo(appt.consultStatus).icon"></i>
                    {{ getConsultInfo(appt.consultStatus).label }}
                  </span>
              </td>
              <td v-else>
                 <span>- - - -</span>
              </td>

              <td>
                  <span class="chip" :class="getCustomerTypeInfo(appt.customerType).cls">
                    {{ getCustomerTypeInfo(appt.customerType).label }}
                  </span>
              </td>

              <td>
                  <span class="chip service-chip" :style="getServiceChipStyle(appt)">
                    {{ getServiceDisplay(appt).label }}
                  </span>
              </td>

              <td style="position: relative">
                  <span
                      class="status-badge readonly"
                      :class="getStatusInfo(appt.status).cls"
                  >
                    {{ getStatusInfo(appt.status).label }}
                  </span>
              </td>

              <td>{{ appt.creator }}</td>

              <td>
                <div class="action-dropdown">
                  <button class="action-btn" @click.stop="toggleActionMenu(appt.id)">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <div class="menu-pop" :class="{ open: openActionMenuId === appt.id }">
                    <button @click.stop="handleAction('detail', appt, $event)">
                      <i class="fa-regular fa-eye"></i>
                      Xem chi tiết
                    </button>
                    <button
                      :class="{ 'is-disabled': !canEditAppointment(appt) }"
                      :disabled="!canEditAppointment(appt)"
                      :title="!canEditAppointment(appt) ? 'Lịch hẹn đã có kết quả tư vấn' : ''"
                      @click.stop="handleAction('edit', appt, $event)"
                    >
                      <i class="fa-regular fa-pen-to-square"></i>
                      Sửa lịch hẹn
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <!-- Quick status popover -->

    <!-- Modal tạo lịch hẹn mới -->
    <div v-if="isCreateModalOpen" class="backdrop" @click.self="closeCreateModal">
      <div class="editor-modal create" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div class="mh-left">
            <div class="mh-ico"><i class="fa-solid fa-plus"></i></div>
            <div>
              <h4>Tạo lịch hẹn mới</h4>
            </div>
          </div>
          <button class="modal-close" type="button" @click="closeCreateModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body single">
          <div class="modal-card">
            <div class="card-cap">
              <i class="fa-solid fa-clipboard-check"></i>
              <span>Thông tin lịch hẹn</span>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi1"><i class="fa-solid fa-user"></i></span>
                    Khách hàng <span class="req">*</span>
                  </span>
                </label>

                <div class="customer-search">
                  <input
                      type="text"
                      class="form-input"
                      v-model="createForm.customerSearch"
                      placeholder="Tìm theo tên hoặc SĐT..."
                  />
                  <div class="search-results" v-if="customerSearchResults.length > 0">
                    <div v-for="customer in customerSearchResults" :key="customer.id" class="customer-result" @click="selectCustomer(customer)">
                      <div class="customer-avatar sm">{{ customer.avatar }}</div>
                      <div class="cr-main">
                        <div class="customer-name">{{ customer.name }}</div>
                        <div class="customer-phone"><i class="fa-solid fa-phone me-1"></i>{{ customer.phone }}</div>
                      </div>
                      <div class="pick"><i class="fa-solid fa-arrow-right"></i></div>
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

                  <div v-else-if="customerSearchError && createForm.customerSearch.trim()" class="search-results empty">
                    <div class="customer-result muted">
                      <div class="cr-main">
                        <div class="customer-name">{{ customerSearchError }}</div>
                        <div class="customer-phone">Thử nhập tên khác hoặc SĐT</div>
                      </div>
                    </div>
                  </div>
                  <div v-if="createForm.selectedCustomer" class="selected-customer">
                    <div class="customer-avatar">{{ initials(createForm.selectedCustomer.name) }}</div>
                    <div>
                      <div class="customer-name">{{ createForm.selectedCustomer.name }}</div>
                      <div class="customer-phone"><i class="fa-solid fa-phone me-1"></i>{{ createForm.selectedCustomer.phone }}</div>
                    </div>
                    <button class="clear-btn" type="button" @click="() => { createForm.selectedCustomer = null; createForm.customerSearch=''; customerSearchResults=[]; customerSearchError=''; }">
                    <i class="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi3"><i class="fa-regular fa-calendar"></i></span>
                    Ngày đặt lịch <span class="req">*</span>
                  </span>
                </label>
                <input type="date" class="form-input" v-model="createForm.date" />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi4"><i class="fa-regular fa-clock"></i></span>
                    Giờ đặt lịch <span class="req">*</span>
                  </span>
                </label>
                <!-- native time -->
                <input type="time" class="form-input" v-model="createForm.time" />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi2"><i class="fa-solid fa-building"></i></span>
                    Chi nhánh <span class="req">*</span>
                  </span>
                </label>
                <select
                    class="form-select"
                    v-model="createForm.branch"
                    @change="createForm.staff = (getStaffOptionsByBranch(createForm.branch)[0] || '')"
                >
                  <option
                      v-for="b in BRANCHES"
                      :key="b.key"
                      :value="b.key"
                  >
                    {{ b.label }}
                  </option>
                </select>

              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi6"><i class="fa-solid fa-headset"></i></span>
                    Nhân viên tư vấn
                  </span>
                </label>
                <select class="form-select" v-model="createForm.consultant">
                  <option v-if="createConsultantsLoading" disabled>
                    Đang tải nhân viên...
                  </option>

                  <option
                      v-for="c in CREATE_CONSULTANTS"
                      :key="c.id"
                      :value="c.id"
                  >
                    {{ c.name }} <span v-if="c.phone">- {{ c.phone }}</span>
                  </option>
                </select>

              </div>
              <div class="form-group">
                <label class="form-label">
    <span class="lbl">
      <span class="lbl-ico gi9">
        <i class="fa-solid fa-bullseye"></i>
      </span>
      Dịch vụ tư vấn
    </span>
                </label>

                <select class="form-select" v-model="createForm.rating">
                  <option disabled value="">-- Chọn dịch vụ --</option>
                  <option v-if="servicesLoading" disabled value="">Đang tải dịch vụ...</option>
                  <option v-if="!servicesLoading && !serviceOptions.length" disabled value="">Chưa có dịch vụ</option>
                  <option
                      v-for="service in serviceOptions"
                      :key="service.id || service.name"
                      :value="service.id ?? service.name"
                  >
                    {{ service.name }}
                  </option>
                </select>
              </div>

            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="lbl">
                  <span class="lbl-ico gi7"><i class="fa-regular fa-note-sticky"></i></span>
                  Ghi chú
                </span>
              </label>
              <textarea class="form-textarea" v-model="createForm.note" placeholder="Thêm ghi chú cho lịch hẹn..."></textarea>
            </div>

            <div class="mini-help">
              <i class="fa-solid fa-circle-info me-2"></i>
              Nếu trùng lịch theo nhân viên, hệ thống sẽ báo ngay khi bấm <b>Tạo lịch</b>.
            </div>
          </div>
        </div>

        <div class="modal-foot">
          <button class="btn btn-secondary" type="button" @click="closeCreateModal">Huỷ</button>
          <button class="btn btn-primary" type="button" @click="saveNewAppointment">
            <i class="fa-solid fa-floppy-disk"></i>Tạo lịch hẹn
          </button>
        </div>
      </div>
    </div>

    <!-- Modal chỉnh sửa (FIX scrollbar + icon nhỏ chung label) -->
    <div v-if="isModalOpen" class="backdrop" @click.self="closeEditModal">
      <div class="editor-modal-update edit" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div class="mh-left">
            <div class="mh-ico"><i class="fa-regular fa-pen-to-square"></i></div>
            <div>
              <h4>Chỉnh sửa lịch hẹn</h4>
              <p class="mh-sub">Có scroll riêng • icon nhỏ nền gradient</p>
            </div>
          </div>
          <button class="modal-close" type="button" @click="closeEditModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body  single">
          <div v-if="editLoading" class="detail-state">
            <i class="fa-solid fa-circle-notch fa-spin"></i>
            Đang tải chi tiết...
          </div>
          <div v-else-if="editError" class="detail-state error">
            {{ editError }}
          </div>
          <template v-else>
            <div class="modal-card">
              <div class="card-cap">
                <i class="fa-solid fa-gear"></i>
                <span>Nội dung chỉnh sửa</span>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <span class="lbl">
                      <span class="lbl-ico gi2"><i class="fa-solid fa-building"></i></span>
                      Chi nhánh
                    </span>
                  </label>
                  <select
                      class="form-select"
                      v-model="editForm.branch"
                  >
                    <option v-for="b in BRANCHES" :key="b.key" :value="b.key">{{ b.label }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="lbl">
                      <span class="lbl-ico gi6"><i class="fa-solid fa-headset"></i></span>
                      Nhân viên phụ trách
                    </span>
                  </label>
                  <select class="form-select" v-model="editForm.consultantId">
                    <option v-if="editConsultantsLoading" disabled>
                      Đang tải nhân viên...
                    </option>
                    <option
                        v-for="c in EDIT_CONSULTANTS"
                        :key="c.id"
                        :value="c.id"
                    >
                      {{ c.name }} <span v-if="c.phone">- {{ c.phone }}</span>
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="lbl">
                      <span class="lbl-ico gi3"><i class="fa-regular fa-calendar"></i></span>
                      Ngày hẹn
                    </span>
                  </label>
                  <input type="date" class="form-input" v-model="editForm.date" />
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="lbl">
                      <span class="lbl-ico gi4"><i class="fa-regular fa-clock"></i></span>
                      Giờ hẹn
                    </span>
                  </label>
                  <input type="time" class="form-input" v-model="editForm.time" />
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <span class="lbl">
                      <span class="lbl-ico gi9"><i class="fa-solid fa-traffic-light"></i></span>
                      Trạng thái
                    </span>
                  </label>
                  <select class="form-select" v-model="editForm.status">
                    <option value="WAITING">Chờ đến hẹn</option>
                    <option value="UP">Đã lên</option>
                    <option value="NOT_UP">Chưa lên</option>
                    <option value="POSTPONED">Tạm hoãn</option>
                    <option value="CANCELLED">Huỷ</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <span class="lbl">
                      <span class="lbl-ico gi12"><i class="fa-solid fa-star"></i></span>
                      Dịch vụ tư vấn
                    </span>
                  </label>
                  <select class="form-select" v-model="editForm.rating">
                    <option disabled value="">-- Chọn dịch vụ --</option>
                    <option v-if="servicesLoading" disabled value="">Đang tải dịch vụ...</option>
                    <option v-if="!servicesLoading && !serviceOptions.length" disabled value="">Chưa có dịch vụ</option>
                    <option
                        v-for="service in serviceOptions"
                        :key="service.id || service.name"
                        :value="service.id ?? service.name"
                    >
                      {{ service.name }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">
    <span class="lbl">
      <span class="lbl-ico gi10"><i class="fa-solid fa-handshake"></i></span>
      Kết quả tư vấn
    </span>
                  </label>

                  <select class="form-select" v-model="editForm.consultStatus">
                    <option :value="null">Chưa có</option>
                    <option :value="ConsultStatus.SUCCESS">Thành công</option>
                    <option :value="ConsultStatus.FAIL">Thất bại</option>
                    <option :value="ConsultStatus.CARE">Chăm sóc</option>
                  </select>
                </div>

              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi7"><i class="fa-regular fa-note-sticky"></i></span>
                    Ghi chú lịch hẹn
                  </span>
                </label>
                <textarea class="form-textarea" v-model="editForm.note" placeholder="Cập nhật ghi chú lịch hẹn..."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi7"><i class="fa-regular fa-note-sticky"></i></span>
                    Ghi chú khách hàng
                  </span>
                </label>
                <textarea class="form-textarea" v-model="editForm.customerNote" placeholder="Cập nhật ghi chú khách hàng..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">
                <span class="lbl">
                  <span class="lbl-ico gi13">
                     <span class="lbl-ico gi7"><i class="fa-regular fa-note-sticky"></i></span>
                  </span>
                  Lý do cập nhật <span class="req">*</span>
                </span>
                </label>

                <textarea
                    class="form-textarea reason-textarea"
                    v-model="editForm.updateReason"
                    placeholder="Nhập lý do chỉnh sửa lịch hẹn (vd: khách đổi giờ, đổi chi nhánh, cập nhật NV tư vấn...)"
                    rows="3"
                ></textarea>
              </div>
            </div>


            <div class="form-group edit-session-note">
              <div class="session-note">
                <i class="fa-solid fa-circle-info"></i>
                <span>
      <b>Lưu ý:</b> Mỗi lần cập nhật lịch hẹn sẽ được ghi nhận vào
      <b>lịch sử chỉnh sửa</b> để theo dõi thay đổi.
    </span>
              </div>
            </div>

          </template>
        </div>

        <div class="modal-foot">
          <button class="btn btn-secondary" type="button" @click="closeEditModal">Đóng</button>
          <button class="btn btn-primary" type="button" @click="saveEditModal">
            <i class="fa-solid fa-floppy-disk"></i>Cập nhật
          </button>
        </div>
      </div>
    </div>

    <!-- Modal chi tiết (màu mới đẹp hơn + icon nhỏ chung label) -->
    <div v-if="isDetailModalOpen" class="backdrop" @click.self="closeDetailModal">
      <div class="editor-modal detail" role="dialog" aria-modal="true">
        <div class="modal-head">
          <div class="mh-left">
            <div class="mh-ico"><i class="fa-regular fa-eye"></i></div>
            <div>
              <h4>Chi tiết lịch hẹn</h4>
              <p class="mh-sub">Màu sáng • card pastel • dễ đọc</p>
            </div>
          </div>
          <button class="modal-close" type="button" @click="closeDetailModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body grid">
          <div v-if="detailLoading" class="detail-state">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Đang tải dữ liệu...
          </div>
          <div v-else-if="detailError" class="detail-state error">
            <i class="fa-solid fa-triangle-exclamation"></i>
            {{ detailError }}
          </div>
          <div v-else-if="!selectedAppointment" class="detail-state error">
            <i class="fa-solid fa-circle-xmark"></i>
            Không có dữ liệu chi tiết.
          </div>
          <template v-else>
            <div ref="detailCardRef" class="modal-card detail-card">
              <div class="card-cap">
                <i class="fa-solid fa-id-card"></i>
                <span>Chi tiết lịch hẹn</span>
              </div>

              <div class="detail-section">
                <div class="section-head">
                  <span class="section-ico si-appointment"><i class="fa-regular fa-calendar-check"></i></span>
                  <h5>Thông tin lịch hẹn</h5>
                </div>
                <div class="section-divider"></div>
                <div class="section-grid">
                  <div class="field-row">
                    <div class="field-label">Ngày & Giờ</div>
                    <div class="field-value">{{ formatVNDate(selectedAppointment.date) }} • {{ selectedAppointment.time }}</div>
                  </div>
                  <div class="field-row">
                    <div class="field-label">Trạng thái</div>
                    <div class="field-value">
                      <span class="status-badge" :class="getStatusInfo(selectedAppointment.status).cls">
                        {{ getStatusInfo(selectedAppointment.status).label }}
                      </span>
                    </div>
                  </div>
                  <div class="field-row">
                    <div class="field-label">KQ tư vấn</div>
                    <div class="field-value">
                      <span class="consult-badge" :class="getConsultInfo(selectedAppointment.consultStatus).cls">
                        <i class="fa-solid" :class="getConsultInfo(selectedAppointment.consultStatus).icon"></i>
                        {{ getConsultInfo(selectedAppointment.consultStatus).label }}
                      </span>
                    </div>
                  </div>
                  <div class="field-row">
                  <div class="field-label">Loại dịch vụ</div>
                  <div class="field-value">
                      <span class="chip service-chip" :style="getServiceChipStyle(selectedAppointment)">
                        {{ getServiceDisplay(selectedAppointment).label }}
                      </span>
                  </div>
                </div>
                  <div class="field-row">
                    <div class="field-label">Chi nhánh</div>
                    <div class="field-value">{{ getBranchLabel(selectedAppointment.branch) }}</div>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <div class="section-head">
                  <span class="section-ico si-customer"><i class="fa-solid fa-user"></i></span>
                  <h5>Thông tin khách hàng</h5>
                </div>
                <div class="section-divider"></div>
                <div class="section-grid">
                  <div class="field-row">
                    <div class="field-label">Tên khách hàng</div>
                    <div class="field-value">{{ selectedAppointment.customer || '-' }}</div>
                  </div>
                  <div class="field-row">
                    <div class="field-label">Giá BĐS: </div>
                    <div class="field-value">
                      {{ formatCurrencyVND(selectedAppointment.giaBDS) }}
                    </div>

                  </div>
                  <div class="field-row">
                    <div class="field-label">Số điện thoại</div>
                    <div class="field-value">{{ selectedAppointment.phone || '-' }}</div>
                  </div>
                  <div class="field-row">
                    <div class="field-label">Địa chỉ hiện tại</div>
                    <div class="field-value">{{ selectedAppointment.address || '-' }}</div>
                  </div>
                  <div class="field-row">
                    <div class="field-label">Địa chỉ cũ</div>
                    <div class="field-value">{{ selectedAppointment.oldAddress || '-' }}</div>
                  </div>
                  <div class="field-row">
                    <div class="field-label">Loại khách</div>
                    <div class="field-value">
                      <span class="chip" :class="getCustomerTypeInfo(selectedAppointment.customerType).cls">
                        {{ getCustomerTypeInfo(selectedAppointment.customerType).label }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <div class="section-head">
                  <span class="section-ico si-note"><i class="fa-regular fa-note-sticky"></i></span>
                  <h5>Ghi chú</h5>
                </div>
                <div class="section-divider"></div>
                <div class="note-grid">
                  <div class="note-card">
                    <div class="note-title">Ghi chú lịch hẹn</div>
                    <div class="note-body">{{ selectedAppointment.note || 'Không có ghi chú' }}</div>
                  </div>
                  <div class="note-card">
                    <div class="note-title">Ghi chú khách</div>
                    <div class="note-body">{{ selectedAppointment.customerNote || 'Không có ghi chú' }}</div>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <div class="section-head">
                  <span class="section-ico si-staff"><i class="fa-solid fa-user-tie"></i></span>
                  <h5>Nhân sự liên quan</h5>
                </div>
                <div class="section-divider"></div>
                <div class="section-grid">
                  <div class="field-row">
                    <div class="field-label">Tư vấn viên</div>
                    <div class="field-value">{{ selectedAppointment.consultant || '-' }}</div>
                  </div>
                  <div class="field-row">
                    <div class="field-label">Người tạo</div>
                    <div class="field-value">{{ selectedAppointment.creator || '-' }}</div>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <div class="section-head">
                  <span class="section-ico si-file"><i class="fa-solid fa-paperclip"></i></span>
                  <h5>Tệp đính kèm</h5>
                  <span class="section-sub">({{ selectedAppointment.files.length }} tệp)</span>
                </div>
                <div class="section-divider"></div>
                <div class="file-list">
                  <div v-if="!selectedAppointment.files.length" class="muted-empty">Không có tệp đính kèm.</div>
                  <FileNew
                      v-else
                      :key="'appointment-files'"
                      :file-list="selectedAppointment.files"
                      :entity-id="selectedAppointment.customerId"
                      entity-type="host"
                      :allow-download-all="true"
                      :can-edit="false"
                      :on-upload="false"
                  />
                </div>
              </div>
            </div>

            <div ref="historyPanelRef" class="modal-panel">
              <h5>
                <span class="sec-ico si4"><i class="fa-solid fa-clock-rotate-left"></i></span>
                Lịch sử thay đổi
              </h5>

              <div class="history">
                <div v-if="!historyItems.length" class="muted-empty">Chưa có lịch sử.</div>
                <div v-else>
                  <div v-for="item in historyItems" :key="item.ts" class="h-item">
                    <div class="h-top">
                      <span>
                        {{ item.actor }} •
                        <span class="action-pill" :class="getActionInfo(item.action).cls">
                          {{ getActionInfo(item.action).label }}
                        </span>
                      </span>
                      <span>{{ item.stamp }}</span>
                    </div>
                    <div v-if="item.status || item.consultStatus" class="h-meta">
                      <span v-if="item.status" class="status-badge" :class="getStatusInfo(item.status).cls">
                        {{ getStatusInfo(item.status).label }}
                      </span>
                      <span v-if="item.consultStatus" class="consult-badge" :class="getConsultInfo(item.consultStatus).cls">
                        <i class="fa-solid" :class="getConsultInfo(item.consultStatus).icon"></i>
                        {{ getConsultInfo(item.consultStatus).label }}
                      </span>
                    </div>
                    <div class="h-desc">{{ item.desc || '' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="modal-foot">
          <button class="btn btn-secondary" type="button" @click="closeDetailModal">Đóng</button>
          <button
            class="btn btn-primary"
            type="button"
            :class="{ 'is-disabled': selectedAppointment && !canEditAppointment(selectedAppointment) }"
            :disabled="selectedAppointment && !canEditAppointment(selectedAppointment)"
            :title="selectedAppointment && !canEditAppointment(selectedAppointment) ? 'Lịch hẹn đã có kết quả tư vấn' : ''"
            @click="openEditModal(selectedAppointment.id)"
          >
            <i class="fa-regular fa-pen-to-square"></i>Chỉnh sửa
          </button>
        </div>
      </div>
    </div>

    <div v-if="confirmDialog.open" class="backdrop popup-backdrop" @click.self="closeConfirmDialog(false)">
      <div class="popup-modal" :class="`variant-${confirmDialog.variant}`" role="dialog" aria-modal="true">
        <div class="popup-head">
          <div class="popup-icon">
            <i class="fa-solid" :class="getConfirmIcon(confirmDialog.variant)"></i>
          </div>
          <button class="popup-close" type="button" @click="closeConfirmDialog(false)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="popup-body">
          <h4>{{ confirmDialog.title }}</h4>
          <p>{{ confirmDialog.message }}</p>
        </div>
        <div class="popup-foot">
          <button
            v-if="confirmDialog.showCancel"
            class="btn btn-secondary"
            type="button"
            @click="closeConfirmDialog(false)"
          >
            {{ confirmDialog.cancelText }}
          </button>
          <button class="btn btn-primary popup-confirm" type="button" @click="closeConfirmDialog(true)">
            {{ confirmDialog.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* ===== Base ===== */
.appointments-page{
  min-height:100vh;
  font-family:'Inter',sans-serif;
  color:#0f172a;
  line-height:1.6;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  zoom: 0.9;
}
/* ===== Revenue chart chiếm 2 cột ===== */
.revenue-chart{
  grid-column: span 2;
  min-height: 420px;
}

.revenue-chart .chart-container{
  height: 340px; /* cao hơn chart thường */
}

/* ===== Toast ===== */
.toast-wrap{
  position:fixed; right:18px; top:18px;
  display:flex; flex-direction:column; gap:10px;
  z-index:999; pointer-events:none;
}
.toast{
  pointer-events:auto;
  min-width:280px; max-width:420px;
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(20,22,30,0.10);
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.10);
  padding:12px;
  display:flex; gap:10px; align-items:flex-start;
  animation: pop 0.12s ease-out;
  backdrop-filter: blur(10px);
}
.toast .ico{
  width:38px; height:38px;
  border-radius: 14px;
  display:flex; align-items:center; justify-content:center;
  background: linear-gradient(135deg, rgba(102,126,234,0.20), rgba(118,75,162,0.18));
  color:#3b4cc0;
  flex:0 0 auto;
}
.toast.success .ico{ background: linear-gradient(135deg, rgba(67,233,123,0.22), rgba(56,249,215,0.16)); color:#159b7d; }
.toast.error .ico{ background: linear-gradient(135deg, rgba(255,88,88,0.22), rgba(240,152,25,0.14)); color:#d14526; }
.toast .t{ display:flex; flex-direction:column; gap:2px; flex:1; }
.toast .t .a{ font-weight:900; font-size:13px; color:#0b1220; }
.toast .t .b{ font-weight:600; font-size:12.5px; color:#5b6576; }
.toast .x{
  width:34px; height:34px;
  border-radius:12px;
  border:1px solid rgba(20,22,30,0.10);
  background: rgba(255,255,255,0.92);
  cursor:pointer;
  display:flex; align-items:center; justify-content:center;
}
@keyframes pop{ from{ transform:translateY(-4px); opacity:.7;} to{transform:translateY(0); opacity:1;} }

/* ===== Layout ===== */
.main-content{ padding:22px; }
.header{
  display:flex; justify-content:space-between; align-items:center;
  gap:16px; flex-wrap:wrap;
  padding: 0 25px;
}
.page-title h2{
  font-size:22px; font-weight:900;
  color:#0b1220;
  display:flex; align-items:center;
}
.page-title p{ font-size:13px; color:#5b6576;  font-weight:600; }

.search-bar{ position:relative; width:420px; max-width:100%; }
.search-bar input{
  width:100%;
  padding:7px 14px 8px 15px;
  border:1px solid rgba(20,22,30,0.10);
  border-radius:24px;
  font-size:14px;
  background: rgba(255,255,255,0.86);
  transition:0.2s ease;
  backdrop-filter: blur(10px);
}
.search-bar input:focus{
  outline:none;
  border-color: rgba(102,126,234,0.45);
  box-shadow: 0 0 0 4px rgba(102,126,234,0.12);
}
.search-icon{ position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#93a2b8; }

/* ===== Stats ===== */
.stats{
  display:grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap:14px;
  margin: 10px 0 14px;
}
.stat{
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(20,22,30,0.10);
  border-radius: 18px;
  padding:14px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.08);
  position:relative;
  overflow:hidden;
  backdrop-filter: blur(10px);
  transition: 0.22s ease;
}
.stat::before{
  content:"";
  position:absolute;
  left:-2px; right:-2px; top:-2px;
  height:6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity:0.65;
}
.stat.s2::before{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat.s3::before{ background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat.s4::before{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat:hover{ transform: translateY(-2px); box-shadow: 0 16px 44px rgba(0,0,0,0.12); }
.stat .k{ font-size:12px; color:#5b6576; font-weight:800; }
.stat .v{ font-size:20px; font-weight:900; margin-top:2px; color:#0b1220; }
.stat .hint{ font-size:12px; color:#93a2b8; margin-top:2px; font-weight:700; }
.stat .i{
  position:absolute; right:12px; top:12px;
  width:42px; height:42px;
  border-radius: 16px;
  display:flex; align-items:center; justify-content:center;
  background: linear-gradient(135deg, rgba(102,126,234,0.16), rgba(118,75,162,0.12));
  color:#4450c5;
}
.stat.s2 .i{ background: linear-gradient(135deg, rgba(79,172,254,0.18), rgba(0,242,254,0.12)); color:#0b7aa8; }
.stat.s3 .i{ background: linear-gradient(135deg, rgba(67,233,123,0.18), rgba(56,249,215,0.10)); color:#159b7d; }
.stat.s4 .i{ background: linear-gradient(135deg, rgba(250,112,154,0.18), rgba(254,225,64,0.10)); color:#b54d7a; }
@media (max-width:1100px){ .stats{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width:560px){ .stats{ grid-template-columns: 1fr; } }

/* ===== Charts row: 3 chart chung 1 hàng ===== */
.charts-row{
  display:grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap:14px;
  margin: 6px 0 16px;
}
@media (max-width:1100px){ .charts-row{ grid-template-columns: 1fr; } }

.chart-card{
  background: rgba(255,255,255,0.88);
  border: 1px solid rgba(20,22,30,0.10);
  border-radius: 18px;
  padding:14px 14px 16px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.08);
  backdrop-filter: blur(10px);
  position:relative;
  overflow:hidden;
  min-height: 320px;
}
.chart-card::before{
  content:"";
  position:absolute;
  left:-2px; right:-2px; top:-2px;
  height:6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity:0.65;
}
.chart-card.c2::before{ background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.chart-card.c3::before{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

.chart-head{ display:flex; gap:12px; align-items:center; margin-bottom:10px; }
.chart-head h4{ margin:0; font-size:14px; font-weight:900; color:#0b1220; }
.sub{ margin:2px 0 0; font-size:12.5px; color:#5b6576; font-weight:650; }

.chart-container-wrapper{
  width: 100%;
  height: 80%;
  align-items: center;
  display: flex;
  justify-content: center;
}

.chart-container{
  width: 100%;
  height: 240px;
  border-radius: 16px;
  overflow:hidden;
  background: linear-gradient(135deg, rgba(255,255,255,0.70), rgba(255,255,255,0.86));
  border: 1px solid rgba(20,22,30,0.06);

}
.chart-container canvas{
  width:100% !important;
  height:100% !important;
  display:block;
  pointer-events:auto;
}

/* ===== Bubbles ===== */
.ico-bubble{
  width:42px; height:42px;
  border-radius: 16px;
  display:flex; align-items:center; justify-content:center;
  color:#fff;
  box-shadow: 0 15px 45px rgba(0,0,0,0.18);
  flex:0 0 auto;
}
.ico-bubble.gA{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.ico-bubble.gB{ background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.ico-bubble.gC{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.ico-bubble.gD{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.ico-bubble.gE{ background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }

/* ===== Filters ===== */
.filters{
  display:flex; align-items:center; gap:12px;
  flex-wrap:wrap;
  margin-bottom: 16px;
}
.filter-tabs, .status-filter{ display:flex; gap:8px; flex-wrap:wrap; }
.action-buttons{ margin-left:auto; display:flex; gap:10px; }

.filter-btn{
  padding:10px 14px;
  border:1px solid rgba(20,22,30,0.10);
  background: rgba(255,255,255,0.86);
  border-radius: 14px;
  font-size:13px;
  font-weight:800;
  color:#334155;
  cursor:pointer;
  transition:0.2s ease;
  backdrop-filter: blur(10px);
}
.filter-btn:hover{ border-color: rgba(102,126,234,0.35); color:#3846c2; }
.filter-btn.active{
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color:#fff;
  border-color: transparent;
  box-shadow: 0 16px 40px rgba(102,126,234,0.22);
}

.status-tag{
  padding:8px 12px;
  border-radius: 999px;
  font-size:12.5px;
  font-weight:800;
  cursor:pointer;
  border:1px solid transparent;
  transition:0.2s ease;
  user-select:none;
  backdrop-filter: blur(10px);
}
.status-tag.active{
  transform: translateY(-1px);
  border:1px solid rgba(20,22,30,0.08);
  box-shadow: 0 14px 28px rgba(0,0,0,0.10);
}
.st-all{ background: rgba(148,163,184,0.20); color:#334155; }
.st-wait-tag{ background: rgba(251,191,36,0.18); color:#a16207; }
.st-up-tag{ background: rgba(67,233,123,0.18); color:#0b7f6a; }
.st-not-tag{ background: rgba(250,112,154,0.18); color:#a43e73; }
.st-post-tag{ background: rgba(79,172,254,0.18); color:#0b6ea8; }
.st-cancel-tag{ background: rgba(255,88,88,0.18); color:#b83b2c; }

.btn{
  padding:11px 14px;
  border-radius:14px;
  font-size:13px;
  font-weight:850;
  cursor:pointer;
  display:inline-flex;
  align-items:center;
  gap:8px;
  transition:0.2s ease;
  border:none;
}
.btn:disabled,
.btn.is-disabled{
  cursor:not-allowed;
  opacity:0.6;
  filter: grayscale(0.1);
  box-shadow:none;
}
.btn:disabled:hover,
.btn.is-disabled:hover{
  transform:none;
  filter: grayscale(0.1);
}
.btn-sm{ padding:10px 12px; border-radius:12px; font-size:12.6px; }
.btn-primary{
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color:#fff;
  box-shadow: 0 16px 40px rgba(102,126,234,0.20);
}
.btn-primary:hover{ transform: translateY(-1px); filter: brightness(0.99); }
.btn-secondary{
  background: rgba(255,255,255,0.86);
  color:#3846c2;
  border:1px solid rgba(102,126,234,0.35);
  backdrop-filter: blur(10px);
}
.btn-secondary:hover{
  background: rgba(102,126,234,0.06);
  border-color: rgba(102,126,234,0.55);
  color:#2f3aa8;
}

/* ===== Calendar + Day row ===== */
.calendar-day-row{
  display:grid;
  grid-template-columns: 1fr 1.55fr;
  gap:16px;
  align-items:stretch;
  margin-bottom: 18px;
}
@media (max-width:1100px){ .calendar-day-row{ grid-template-columns: 1fr; } }

.card-surface{
  background: rgba(255,255,255,0.88);
  border:1px solid rgba(20,22,30,0.10);
  border-radius:18px;
  padding:16px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.08);
  backdrop-filter: blur(10px);
  display:flex;
  flex-direction:column;
  max-height: 520px; /* 2 thẻ bằng chiều cao */
}
.card-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:12px;
  margin-bottom:12px;
}
.card-title{ display:flex; gap:12px; align-items:center; }
.card-title h3{ font-size:15.4px; font-weight:900; color:#0b1220; margin:0; }

/* Calendar nav only month */
.calendar-nav{ display:flex; gap:8px; }
.icon-btn{
  width:40px; height:40px;
  border-radius:14px;
  border:1px solid rgba(20,22,30,0.10);
  background: rgba(255,255,255,0.92);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer;
  transition:0.2s ease;
}
.icon-btn:hover{
  background: rgba(102,126,234,0.06);
  border-color: rgba(102,126,234,0.30);
  color:#3846c2;
}

/* Calendar grid */
.calendar-days{ display:grid; grid-template-columns: repeat(7,1fr); gap:8px; margin-bottom:10px; }
.day-name{
  text-align:center;
  font-weight:800;
  color:#93a2b8;
  font-size:12px;
  padding:6px;
}

.calendar-dates{ display:grid; grid-template-columns: repeat(7,1fr); gap:8px; }

.cal-date{
  height:46px;
  display:flex; align-items:center; justify-content:center;
  border-radius:14px;
  cursor:pointer;
  transition:0.2s ease;
  font-weight:850;
  font-size:13px;
  position:relative;
  border:1px solid transparent;
  user-select:none;
}
.cal-date.current{ color:#0b1220; }
.cal-date.other{ color:#c7d2e0; cursor:default; }
.cal-date:hover{ background: rgba(102,126,234,0.08); }
.cal-date.today{
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color:#fff;
}
.cal-date.selected{
  background: rgba(79,172,254,0.14);
  color:#0b6ea8;
  border:1px solid rgba(79,172,254,0.24);
  box-shadow: 0 0 0 4px rgba(79,172,254,0.10);
}
.cal-date.disabled{
  opacity:0.45;
  cursor:not-allowed;
  background: rgba(148,163,184,0.08);
}
.cal-date.disabled:hover{ background: rgba(148,163,184,0.08); }

/* has appointment: DOT + soft pastel halo */
.cal-date.has-appt::before{
  content:"";
  position:absolute;
  left:5%;
  top: calc(100% - 40px);
  width:16px;
  height:16px;
  transform: translate(-50%, -50%);
  border-radius:50%;
  background: var(--mkGlow, rgba(79,172,254,0.28));
}

.cal-date.has-appt::after{
  content:"";
  position:absolute;
  left:5%;
  top: calc(100% - 40px);
  width:8px;
  height:8px;
  transform: translate(-50%, -50%);
  border-radius:50%;
  background: var(--mk, #4facfe);
}

.legend{
  margin-top:auto;
  display:flex;
  gap:14px;
  align-items:center;
  padding-top:12px;
  border-top: 1px solid rgba(20,22,30,0.06);
}
.lg{ display:flex; gap:8px; align-items:center; font-weight:750; font-size:12.5px; color:#5b6576; }
.mk{
  width:10px; height:10px; border-radius: 50%;
  box-shadow: 0 0 0 6px var(--mkGlow, rgba(20,22,30,0.05));
}
.mk-orange{ background:#f97316; --mkGlow: rgba(253, 230, 138, 0.75); }
.mk-blue{ background:#2563eb; --mkGlow: rgba(191, 219, 254, 0.78); }

/* Day schedule (scroll riêng) */
.day-actions{ display:flex; gap:10px; flex-wrap:wrap; }
.day-body{
  flex:1;
  min-height:0;
  overflow:hidden;
}
.slots{
  height:100%;
  overflow:auto;
  padding-right:4px;
  display:flex;
  flex-direction:column;
  gap:10px;
}
.slot{ display:grid; grid-template-columns: 84px 1fr; gap:10px; align-items:stretch; }
.slot-time{
  border:1px solid rgba(20,22,30,0.10);
  border-radius:14px;
  background: rgba(255,255,255,0.86);
  display:flex; align-items:center; justify-content:center;
  font-weight:900;
  color:#334155;
  font-size:12.5px;
  min-height:56px;
}
.slot-drop{
  border:1px dashed rgba(102,126,234,0.35);
  border-radius:14px;
  background: rgba(102,126,234,0.05);
  min-height:56px;
  padding:8px;
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  align-items:center;
  transition:0.15s ease;
}
.slot-drop.over{
  background: rgba(102,126,234,0.09);
  border-color: rgba(102,126,234,0.55);
  box-shadow: 0 0 0 4px rgba(102,126,234,0.12);
}
.slot-empty{ font-weight:800; color:#93a2b8; font-size:12.5px; }

/* Appt card */
.appt-card{
  border:1px solid rgba(20,22,30,0.10);
  border-radius:16px;
  background: rgba(255,255,255,0.94);
  box-shadow: 0 12px 28px rgba(0,0,0,0.10);
  padding:10px 10px;
  display:flex;
  gap:10px;
  cursor:grab;
  user-select:none;
  align-self: center;
  min-width: 290px;
  transition:0.15s ease;
}
.appt-card:hover{ transform: translateY(-1px); box-shadow: 0 18px 40px rgba(0,0,0,0.14); }
.appt-card.disabled{ opacity:0.6; cursor:not-allowed; }
.appt-card:active{ cursor:grabbing; }

.appt-dot{
  width:10px;
  height:10px;
  border-radius:50%;
  background: var(--mk, #4facfe);
  position:relative;
  flex:0 0 auto;
}

/* halo */
.appt-dot::before{
  content:"";
  position:absolute;
  left:50%;
  top:50%;
  width:20px;
  height:20px;
  transform: translate(-50%, -50%);
  border-radius:50%;
  background: var(--mkGlow, rgba(79,172,254,0.30));
}


.appt-main{ display:flex; flex-direction:column; gap:2px; min-width:0; }
.appt-main .n{
  font-weight:950;
  font-size:13px;
  color: #0a1630; /* xanh nước biển đậm đen */
}
.phone-line{
  font-weight:750;
  font-size:12px;
  color:#159b7d; /* xanh lá */
}
.phone-line i{ color:#22c55e; }
.appt-meta{ display:flex; gap:8px; flex-wrap:wrap; margin-top:6px; align-items:center; }

.pill-soft{
  display:inline-flex;
  gap:6px;
  align-items:center;
  padding:6px 10px;
  border-radius:999px;
  background: rgba(148,163,184,0.16);
  border:1px solid rgba(20,22,30,0.06);
  font-weight:800;
  font-size:12px;
  color:#334155;
  white-space:nowrap;
}
.appt-sub{ font-weight:700; font-size:12px; color:#5b6576; margin-top:2px; }

.appt-cta{ margin-left:auto; display:flex; gap:6px; }
.mini-btn{
  width:36px; height:36px;
  border-radius:14px;
  border:1px solid rgba(20,22,30,0.10);
  background: rgba(255,255,255,0.92);
  cursor:pointer;
  transition:0.15s ease;
  display:flex; align-items:center; justify-content:center;
  color:#455064;
}
.mini-btn:hover{
  background: rgba(102,126,234,0.08);
  color:#3846c2;
  border-color: rgba(102,126,234,0.28);
}
.mini-btn.is-disabled,
.mini-btn:disabled{
  cursor:not-allowed;
  opacity:0.55;
  background: rgba(226,232,240,0.5);
  border-color: rgba(148,163,184,0.35);
  color:#64748b;
}
.mini-btn.is-disabled:hover,
.mini-btn:disabled:hover{
  background: rgba(226,232,240,0.5);
  border-color: rgba(148,163,184,0.35);
  color:#64748b;
}

/* Status badges (table + day schedule) */
.status-badge{
  padding:7px 12px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
  display:inline-flex;
  align-items:center;
  gap:8px;
  cursor:pointer;
  user-select:none;
  border:1px solid rgba(20,22,30,0.06);
  transition:0.15s ease;
  white-space:nowrap;
}
.status-badge:hover{ transform: translateY(-1px); box-shadow: 0 14px 22px rgba(0,0,0,0.10); }

.st-wait{ background: rgba(251,191,36,0.2); color:#a16207; }
.st-up{ background: rgba(67,233,123,0.18); color:#0b7f6a; }
.st-not{ background: rgba(250,112,154,0.18); color:#a43e73; }
.st-post{ background: rgba(79,172,254,0.18); color:#0b6ea8; }
.st-cancel{ background: rgba(255,88,88,0.18); color:#b83b2c; }

/* ===== Table ===== */
.appointments-list .list-header{
  display:flex; justify-content:space-between; align-items:center;
  gap:10px; flex-wrap:wrap;
  margin-bottom:12px;
}
.appointments-list h3{ font-size:16px; font-weight:900; display:flex; align-items:center; }
.pill-muted{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  background: rgba(148,163,184,0.16);
  color:#334155;
  font-weight:850;
  font-size:12px;
  border:1px solid rgba(20,22,30,0.06);
}

.table-container{
  overflow-x:auto;
  border-radius:14px;
  border:1px solid rgba(20,22,30,0.10);
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(10px);
}
table{ width:100%; border-collapse:collapse; min-width: 1280px; }
th{
  text-align:left;
  padding:14px;
  border-bottom:1px solid rgba(20,22,30,0.10);
  font-weight:900;
  color:#334155;
  font-size:12.5px;
  background: rgba(253,251,251,0.90);
  position:sticky; top:0; z-index:1;
  white-space:nowrap;
}
td{
  padding:14px;
  border-bottom:1px solid rgba(20,22,30,0.06);
  font-size:13.5px;
  color:#0b1220;
  vertical-align:middle;
}
tr:hover td{ background: rgba(102,126,234,0.035); }

.customer-info{ display:flex; align-items:center; gap:10px; }
.customer-avatar{
  width:40px; height:40px;
  border-radius:50%;
  background: rgba(102,126,234,0.12);
  color:#2f3aa8;
  display:flex; align-items:center; justify-content:center;
  font-weight:900;
  border:1px solid rgba(102,126,234,0.18);
  position:relative;
}
.customer-avatar.sm{ width:34px; height:34px; }
.customer-name{ font-weight:950; margin-bottom:2px; color:#0a1630; }
.customer-phone{ font-size:12px; color:#159b7d; font-weight:750; }
.customer-phone i{ color:#22c55e; }

.customer-avatar .ava-dot{
  position:absolute;
  right:-1px; top:-1px;
  width:10px; height:10px;
  border-radius:50%;
  background: var(--mk, #4facfe);
  box-shadow: 0 0 0 2px rgba(255,255,255,0.85);
}
.customer-avatar .ava-dot::before{
  content:"";
  position:absolute;
  left:50%;
  top:50%;
  width:20px;
  height:20px;
  transform: translate(-50%, -50%);
  border-radius:999px;
  background: var(--mkGlow, rgba(79,172,254,0.28));
}

/* Chips / consult */
.chip{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:6px 10px;
  border-radius:999px;
  font-weight:900;
  font-size:12px;
  border:1px solid rgba(20,22,30,0.06);
  white-space:nowrap;
}
.service-chip{
  background: rgba(148,163,184,0.22);
  color:#475569;
}
.ct-owner{ background: rgba(148,163,184,0.16); color:#334155; }
.ct-broker{ background: rgba(67,233,123,0.18); color:#0b7f6a; }
.ct-relative{ background: rgba(250,112,154,0.16); color:#a43e73; }
.ct-unknown{ background: rgba(148,163,184,0.22); color:#475569; }

.rt-bn30{ background: rgba(34,197,94,0.18); color:#166534; }
.rt-bgp{ background: rgba(147,51,234,0.18); color:#6b21a8; }
.rt-unknown{ background: rgba(148,163,184,0.22); color:#475569; }

.consult-badge{
  padding:7px 12px;
  border-radius:999px;
  font-size:12px;
  font-weight:900;
  display:inline-flex;
  align-items:center;
  gap:8px;
  border:1px solid rgba(20,22,30,0.06);
  white-space:nowrap;
}
.consult-badge i{ font-size:11px; opacity:0.9; }
.cs-ok{ background: rgba(67,233,123,0.18); color:#0b7f6a; }
.cs-fail{ background: rgba(255,88,88,0.18); color:#b83b2c; }
.cs-care{ background: rgba(79,172,254,0.18); color:#0b6ea8; }

.st-unknown{ background: rgba(148,163,184,0.2); color:#475569; }

/* Action menu */
.action-dropdown{ position:relative; }
.action-btn{
  width:40px; height:40px;
  border-radius:14px;
  border:1px solid rgba(20,22,30,0.10);
  background: rgba(255,255,255,0.92);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer;
  transition:0.18s ease;
}
.action-btn:hover{
  background: rgba(102,126,234,0.06);
  border-color: rgba(102,126,234,0.28);
  color:#3846c2;
}
.menu-pop{
  position:absolute;
  right:0; top:44px;
  min-width:210px;
  background: rgba(255,255,255,0.94);
  border:1px solid rgba(20,22,30,0.10);
  border-radius:16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  padding:8px;
  display:none;
  z-index:50;
  animation: pop 0.12s ease-out;
  backdrop-filter: blur(10px);
}
.menu-pop.open{ display:block; }
.menu-pop button{
  width:100%;
  text-align:left;
  border:none;
  background:transparent;
  padding:10px 10px;
  border-radius:12px;
  cursor:pointer;
  font-weight:800;
  color:#0b1220;
  display:flex;
  align-items:center;
  gap:10px;
}
.menu-pop button:hover{ background: rgba(102,126,234,0.08); color:#3846c2; }
.menu-pop button.is-disabled,
.menu-pop button:disabled{
  opacity:0.55;
  cursor:not-allowed;
}
.menu-pop button.is-disabled:hover,
.menu-pop button:disabled:hover{
  background: transparent;
  color:#0b1220;
}

/* Quick status popover */
.status-pop{
  position:absolute;
  background: rgba(255,255,255,0.94);
  border:1px solid rgba(20,22,30,0.10);
  border-radius:16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  padding:8px;
  display:none;
  z-index:60;
  min-width:220px;
  animation: pop 0.12s ease-out;
  backdrop-filter: blur(10px);
}
.status-pop.open{ display:block; }
.status-pop .opt{
  width:100%;
  border:none;
  background:transparent;
  padding:10px 10px;
  border-radius:12px;
  cursor:pointer;
  font-weight:850;
  display:flex;
  align-items:center;
  justify-content:space-between;
  color:#0b1220;
}
.status-pop .opt:hover{ background: rgba(102,126,234,0.08); color:#3846c2; }
.dot{ width:10px; height:10px; border-radius:50%; display:inline-block; margin-left:10px; }

/* ===== Modal ===== */
.backdrop{
  position:fixed;
  inset:0;
  background: rgba(20,22,30,0.62);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:1000;
  backdrop-filter: blur(6px);
  padding:24px;
}
.editor-modal{
  width: min(1050px, 96vw);
  background: rgba(253,251,251,0.92);
  border-radius: 26px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.20);
  display:flex;
  flex-direction:column;
  max-height: calc(100vh - 48px);
  overflow:hidden;
  animation: modalIn 0.16s ease-out;
  border:1px solid rgba(255,255,255,0.38);
}
.editor-modal-update{
  width: min(750px, 96vw);
  background: rgba(253,251,251,0.92);
  border-radius: 26px;
  box-shadow: 0 15px 50px rgba(0,0,0,0.20);
  display:flex;
  flex-direction:column;
  max-height: calc(100vh - 48px);
  overflow:hidden;
  animation: modalIn 0.16s ease-out;
  border:1px solid rgba(255,255,255,0.38);
}
@keyframes modalIn{ from{ transform:translateY(10px); opacity:.7;} to{transform:translateY(0); opacity:1;} }

.modal-head{
  padding:16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-bottom:1px solid rgba(20,22,30,0.10);
  background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(253,251,251,0.86));
}
.mh-left{ display:flex; gap:12px; align-items:center; }
.mh-ico{
  width:44px; height:44px;
  border-radius: 16px;
  display:flex; align-items:center; justify-content:center;
  color:#fff;
  box-shadow: 0 15px 45px rgba(0,0,0,0.18);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.editor-modal.create .mh-ico{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.editor-modal.detail .mh-ico{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }

.modal-head h4{ font-size:15.4px; font-weight:900; margin:0; color:#0b1220; }
.mh-sub{ margin:2px 0 0; font-size:12.5px; color:#5b6576; font-weight:650; }

.modal-close{
  width:42px; height:42px;
  border-radius:14px;
  border:1px solid rgba(20,22,30,0.10);
  background: rgba(255,255,255,0.92);
  cursor:pointer;
}

/* BODY scroll fix */
.modal-body{
  flex:1;
  overflow:auto;
  padding:16px;
}
.modal-body.grid{
  display:grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap:14px;
  align-content:start;
  align-items:stretch;
}
.modal-body.single{ display:block; }
@media (max-width:920px){
  .modal-body.grid{ grid-template-columns: 1fr; }
}

.modal-card{
  background: rgba(255,255,255,0.92);
  border:1px solid rgba(20,22,30,0.10);
  border-radius:18px;
  padding:12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.10);
}
.detail-card{
  background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.86));
}
.detail-state{
  grid-column: 1 / -1;
  background: rgba(255,255,255,0.88);
  border:1px solid rgba(20,22,30,0.10);
  border-radius:18px;
  padding:20px;
  font-weight:800;
  color:#334155;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.detail-state.error{ color:#b83b2c; }

.card-cap{
  display:inline-flex;
  gap:10px;
  align-items:center;
  padding:8px 10px;
  border-radius:14px;
  background: linear-gradient(135deg, rgba(102,126,234,0.12), rgba(118,75,162,0.10));
  border:1px solid rgba(102,126,234,0.16);
  font-weight:900;
  color:#2f3aa8;
  margin-bottom:10px;
}

.modal-panel{
  border:1px solid rgba(20,22,30,0.10);
  border-radius:18px;
  padding:12px;
  background: rgba(255,255,255,0.88);
  box-shadow: 0 8px 26px rgba(0,0,0,0.08);
  backdrop-filter: blur(10px);
  min-height: 260px;
  height:100%;
  display:flex;
  flex-direction:column;
  overflow:hidden;
}
.modal-panel h5{
  font-size:13px;
  font-weight:900;
  margin-bottom:8px;
  display:flex;
  align-items:center;
  gap:8px;
  color:#0b1220;
}
.history{
  display:flex;
  flex-direction:column;
  gap:8px;
  flex:1;
  overflow:auto;
  padding-right:4px;
}
.h-item{
  border:1px solid rgba(20,22,30,0.10);
  border-radius:16px;
  padding:10px;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
.h-top{
  display:flex;
  justify-content:space-between;
  gap:10px;
  flex-wrap:wrap;
  font-weight:900;
  font-size:12px;
  color:#334155;
  margin-bottom:4px;
}
.h-meta{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  margin-bottom:6px;
}
.h-desc{ font-size:12.5px; color:#5b6576; font-weight:650; line-height:1.4; }
.muted-empty{ font-weight:800; color:#93a2b8; font-size:12.5px; }
.action-pill{
  display:inline-flex;
  align-items:center;
  padding:2px 8px;
  border-radius:999px;
  font-weight:800;
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:0.02em;
}
.act-create{ background: rgba(67,233,123,0.2); color:#0b7f6a; }
.act-edit{ background: rgba(102,126,234,0.18); color:#2f3aa8; }
.act-status{ background: rgba(251,191,36,0.2); color:#a16207; }
.act-reschedule{ background: rgba(79,172,254,0.2); color:#0b6ea8; }
.act-note{ background: rgba(236,72,153,0.18); color:#9f1239; }
.act-delete{ background: rgba(255,88,88,0.2); color:#b83b2c; }
.act-other{ background: rgba(148,163,184,0.2); color:#334155; }

.modal-foot{
  padding:14px 16px;
  border-top:1px solid rgba(20,22,30,0.10);
  display:flex;
  gap:10px;
  justify-content:flex-end;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(10px);
}

/* ===== Popup confirm ===== */
.popup-backdrop{
  background: rgba(15,23,42,0.72);
}
.popup-modal{
  width: min(420px, 92vw);
  background: rgba(255,255,255,0.98);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(15,23,42,0.25);
  border: 1px solid rgba(15,23,42,0.08);
  display:flex;
  flex-direction:column;
  gap:16px;
  animation: modalIn 0.18s ease-out;
}
.popup-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.popup-icon{
  width:54px;
  height:54px;
  border-radius:18px;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  box-shadow: 0 14px 30px rgba(15,23,42,0.18);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.popup-modal.variant-success .popup-icon{
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
}
.popup-modal.variant-danger .popup-icon{
  background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
}
.popup-modal.variant-warning .popup-icon{
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
}
.popup-modal.variant-info .popup-icon{
  background: linear-gradient(135deg, #38bdf8 0%, #6366f1 100%);
}
.popup-close{
  width:38px;
  height:38px;
  border-radius:12px;
  border:1px solid rgba(15,23,42,0.12);
  background: rgba(248,250,252,0.9);
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}
.popup-body h4{
  margin:0 0 6px;
  font-size:17px;
  font-weight:900;
  color:#0f172a;
}
.popup-body p{
  margin:0;
  color:#475569;
  font-size:14px;
  font-weight:600;
  line-height:1.5;
}
.popup-foot{
  display:flex;
  gap:10px;
  justify-content:flex-end;
}
.popup-confirm{
  box-shadow: 0 12px 24px rgba(79,70,229,0.2);
}

/* Section title + gradient icons */
.section-title{
  display:flex;
  align-items:center;
  gap:10px;
  margin:12px 0 10px;
  font-weight:950;
  color:#0b1220;
  font-size:13px;
}
.sec-ico{
  width:22px; height:22px;
  border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  color:#fff;
  box-shadow: 0 8px 18px rgba(0,0,0,0.14);
}
.sec-ico i{ font-size:12px; }
.si1{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.si2{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.si3{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.si4{ background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

/* Form */
.form-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
@media (max-width:560px){ .form-grid{ grid-template-columns: 1fr; } }

.form-group{ margin-bottom:12px; }
.form-label{
  display:block;
  margin-bottom:6px;
  font-weight:850;
  color:#334155;
  font-size:12.5px;
}
.req{ color:#ff5858; }

/* label icon (icon nhỏ + nền gradient, icon trắng) */
.lbl{
  display:inline-flex;
  align-items:center;
  gap:8px;
}
.lbl-ico{
  width:22px; height:22px; /* tổng chiều cao ~ label */
  border-radius:7px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  box-shadow: 0 8px 18px rgba(0,0,0,0.14);
  flex:0 0 auto;
}
.lbl-ico i{ font-size:11px; }

/* different gradients */
.gi1{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.gi2{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.gi3{ background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.gi4{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.gi5{ background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.gi6{ background: linear-gradient(135deg, #141e30 0%, #243b55 100%); }
.gi7{ background: linear-gradient(135deg, #ff5858 0%, #f09819 100%); }
.gi8{ background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.gi9{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.gi10{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.gi11{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.gi12{ background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }

.form-input, .form-select, .form-textarea{
  width:100%;
  padding:11px 12px;
  border:1px solid rgba(20,22,30,0.10);
  border-radius:14px;
  font-size:14px;
  transition:0.2s ease;
  background: rgba(255,255,255,0.92);
}
.form-textarea{ min-height:92px; resize:vertical; }
.form-input:focus, .form-select:focus, .form-textarea:focus{
  outline:none;
  border-color: rgba(102,126,234,0.45);
  box-shadow: 0 0 0 4px rgba(102,126,234,0.12);
}

/* Customer search */
.customer-search{ position:relative; }
.search-results{
  position:absolute;
  top:100%;
  left:0; right:0;
  background: rgba(255,255,255,0.96);
  border:1px solid rgba(20,22,30,0.10);
  border-radius:14px;
  margin-top:6px;
  z-index:100;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  backdrop-filter: blur(10px);
  overflow:hidden;
}
.customer-result{
  padding:10px 12px;
  display:flex;
  align-items:center;
  gap:10px;
  cursor:pointer;
  transition: background 0.15s ease;
}
.customer-result:hover{ background: rgba(102,126,234,0.08); }
.customer-result .cr-main{ flex:1; }
.customer-result .pick{
  width:30px; height:30px;
  border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  background: rgba(102,126,234,0.10);
  color:#3846c2;
  border:1px solid rgba(102,126,234,0.14);
}
.selected-customer{
  margin-top:10px;
  padding:12px;
  background: rgba(79,172,254,0.08);
  border-radius:14px;
  display:flex;
  align-items:center;
  gap:12px;
  border:1px solid rgba(79,172,254,0.16);
}
.clear-btn{
  margin-left:auto;
  width:34px; height:34px;
  border-radius:12px;
  border:1px solid rgba(20,22,30,0.10);
  background: rgba(255,255,255,0.92);
  cursor:pointer;
  display:flex; align-items:center; justify-content:center;
}

.mini-help{
  margin-top:10px;
  color:#5b6576;
  font-weight:650;
  font-size:12.5px;
}

/* Detail grid */
.detail-grid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:10px;
}
@media (max-width:560px){ .detail-grid{ grid-template-columns: 1fr; } }
.d-item{
  display:flex;
  gap:10px;
  align-items:center;
  padding:10px;
  border-radius:16px;
  border:1px solid rgba(20,22,30,0.06);
  background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(253,251,251,0.88));
}
.d-ico{
  width:38px; height:38px;
  border-radius:16px;
  display:flex; align-items:center; justify-content:center;
  color:#fff;
  box-shadow: 0 12px 26px rgba(0,0,0,0.16);
  flex:0 0 auto;
}
.d-ico i{ font-size:15px; }
.di1{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.di2{ background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.di3{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.di4{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.di5{ background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.di6{ background: linear-gradient(135deg, #141e30 0%, #243b55 100%); }
.di7{ background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.di8{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.di9{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.di10{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.d-main{ flex:1; min-width:0; }
.d-label{ font-size:12px; color:#5b6576; font-weight:800; }
.d-value{ font-size:13.5px; color:#0b1220; font-weight:850; margin-top:2px; }

.note-box{
  margin-top:12px;
  border-radius:18px;
  border:1px solid rgba(20,22,30,0.08);
  background: linear-gradient(135deg, rgba(79,172,254,0.14), rgba(102,126,234,0.10));
  padding:12px;
}
.note-cap{
  font-weight:950;
  color:#0b1220;
  display:flex;
  gap:8px;
  align-items:center;
  margin-bottom:6px;
}
.note-body{
  background: rgba(255,255,255,0.90);
  border:1px solid rgba(20,22,30,0.06);
  border-radius:16px;
  padding:10px;
  font-size:13px;
  color:#334155;
  font-weight:650;
  line-height:1.5;
}

/* Detail sections (compact, grouped) */
.detail-section + .detail-section{
  margin-top:12px;
  padding-top:12px;
  border-top:1px dashed rgba(148,163,184,0.35);
}
.section-head{
  display:flex;
  align-items:center;
  gap:8px;
  margin-bottom:8px;
  color:#0b1220;
}
.section-divider{
  height:2px;
  width:100%;
  border-radius:999px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  margin-bottom:10px;
  opacity:0.85;
}
.section-head h5{
  margin:0;
  font-size:13.5px;
  font-weight:900;
}
.section-ico{
  width:26px; height:26px;
  border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  color:#fff;
  box-shadow: 0 8px 18px rgba(0,0,0,0.14);
  flex:0 0 auto;
}
.section-ico i{ font-size:12px; }
.si-appointment{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.si-customer{ background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.si-note{ background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.si-staff{ background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.si-file{ background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.section-sub{
  margin-left:auto;
  font-size:12px;
  font-weight:800;
  color:#64748b;
}
.section-grid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:8px;
}
@media (max-width:560px){ .section-grid{ grid-template-columns: 1fr; } }
.field-row{
  display:flex;
  flex-direction:column;
  gap:4px;
  padding:8px 10px;
  border-radius:14px;
  border:1px solid rgba(20,22,30,0.06);
  background: rgba(255,255,255,0.92);
}
.field-label{
  font-size:12px;
  font-weight:800;
  color:#5b6576;
}
.field-value{
  font-size:13px;
  font-weight:850;
  color:#0b1220;
  display:flex;
  align-items:center;
  gap:6px;
  flex-wrap:wrap;
}
.note-grid{
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap:10px;
}
@media (max-width:560px){ .note-grid{ grid-template-columns: 1fr; } }
.note-card{
  border-radius:16px;
  border:1px solid rgba(20,22,30,0.06);
  background: rgba(255,255,255,0.92);
  padding:10px;
}
.note-title{
  font-size:12px;
  font-weight:900;
  color:#334155;
  margin-bottom:6px;
}
.file-list ul{
  list-style:none;
  padding:0;
  margin:0;
  display:flex;
  flex-direction:column;
  gap:6px;
}
.file-list li{
  display:flex;
  align-items:center;
  gap:8px;
  font-size:12.5px;
  font-weight:750;
  color:#334155;
  padding:6px 8px;
  border-radius:12px;
  border:1px solid rgba(20,22,30,0.06);
  background: rgba(255,255,255,0.92);
}
.file-list i{ color:#64748b; }

/* Responsive */
@media (max-width:768px){
  .filters{ align-items:flex-start; }
  .search-bar{ width:100%; }
}
.action-pill.act-create {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.action-pill.act-edit {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: #fff;
}
.consult-badge.cs-none {
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
  color: #374151;
}

.consult-badge.cs-unknown {
  background: linear-gradient(135deg, #facc15, #f97316);
  color: #fff;
}
/* ===== Modal Edit: full left column ===== */
.editor-modal.edit .modal-body.single {
  display: block;
  padding: 18px 20px 8px;
}

.editor-modal.edit .modal-card {
  width: 100%;
  max-width: 100%;
}

/* ===== Ghi chú phiên chỉnh sửa ===== */
.edit-session-note {
  margin-top: 12px;
}

.session-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  border: 1px dashed #c7d2fe;
  font-size: 13px;
  color: #334155;
}

.session-note i {
  margin-top: 2px;
  color: #6366f1;
  font-size: 14px;
}
.reason-textarea {
  background: linear-gradient(135deg, #fff7ed, #fff);
  border: 1px solid #fed7aa;
}

.reason-textarea:focus {
  border-color: #fb923c;
  box-shadow: 0 0 0 3px rgba(251, 146, 60, 0.15);
}
</style>
