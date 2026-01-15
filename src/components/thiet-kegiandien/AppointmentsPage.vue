<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import api from '/src/api/api.js'
Chart.register(...registerables)

const rootRef = ref(null)
const cleanupHandlers = []
let chart1 = null
let chart2 = null
let chart3 = null

// ===== Stats (KHÔNG ăn theo bộ lọc) =====
const statTotal = ref(0)
const statSelectedDay = ref(0)
const statUp = ref(0)
const statPending = ref(0)

// ===== Filter (CHỈ áp dụng cho Calendar + Day Schedule + Table) =====
const activeFilterText = ref('Tuần này')
const activeFilterCount = ref(0)
const filteredAppointments = ref([])

const daySlots = ref([])
const dayTitle = ref('')
const calendarTitle = ref('')
const calendarCells = ref([])
const historyItems = ref([])

const openActionMenuId = ref(null)
const dragOverSlot = ref(null)

const statusPopover = reactive({
  open: false,
  top: '0px',
  left: '0px',
  options: [],
  handler: null,
})

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
  WAITING: { label: 'Chờ xác nhận', cls: 'st-wait', dot: '#fbbf24' },
  UP: { label: 'Đã lên', cls: 'st-up', dot: '#22c55e' },
  NOT_UP: { label: 'Chưa lên', cls: 'st-not', dot: '#fa709a' },
  POSTPONED: { label: 'Tạm hoãn', cls: 'st-post', dot: '#4facfe' },
  CANCELLED: { label: 'Huỷ', cls: 'st-cancel', dot: '#ff5858' },
}

const CONSULT_STATUS = {
  SUCCESS: { label: 'Thành công', cls: 'cs-ok', icon: 'fa-circle-check' },
  FAIL: { label: 'Thất bại', cls: 'cs-fail', icon: 'fa-circle-xmark' },
  CARE: { label: 'Chăm sóc', cls: 'cs-care', icon: 'fa-hand-holding-heart' },
}

const CUSTOMER_TYPE = {
  OWNER: { label: 'Chính chủ', cls: 'ct-owner' },
  BROKER: { label: 'Môi giới', cls: 'ct-broker' },
  RELATIVE: { label: 'Người thân', cls: 'ct-relative' },
}

const RATING = {
  POTENTIAL: { label: 'Tiềm năng', cls: 'rt-pot' },
  NOT_POTENTIAL: { label: 'Không tiềm năng', cls: 'rt-npot' },
  CARE: { label: 'Chăm sóc', cls: 'rt-care' },
}

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']

function formatVNDate(yyyyMMdd) {
  const [y, m, d] = yyyyMMdd.split('-')
  return `${d}/${m}/${y}`
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
const activeRange = ref('week') // today | week | month
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
const selectedAppointment = ref(null)

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
  rating: 'BAN_NHANH_30N'
})

const editForm = reactive({
  customer: '',
  phone: '',
  branch: 'CN_Q1',
  date: '',
  time: '',
  staff: '',
  consultant: '',
  status: 'UP',
  consultStatus: 'CARE',
  customerType: 'OWNER',
  rating: 'CARE',
  note: '',
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
      activeRange.value === 'today' ? 'Hôm nay' : activeRange.value === 'week' ? 'Tuần này' : 'Tháng này'
  const stText = activeStatus.value !== 'ALL' ? ` • ${STATUS[activeStatus.value].label}` : ''
  activeFilterText.value = `${rangeText}${stText}`
}

function updateGlobalStats() {
  const all = [...appointments.value]
  statTotal.value = all.length
  statSelectedDay.value = all.filter((a) => a.date === selectedDateISO.value).length
  statUp.value = all.filter((a) => a.status === 'UP').length
  statPending.value = all.filter((a) => ['WAITING', 'NOT_UP', 'POSTPONED'].includes(a.status)).length
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
  if (activeRange.value === 'today') return iso === selectedDateISO.value
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
    createdByMe: dto.createdByMe,
    inCharge: dto.inCharge,
    branch: dto.branch || '',
    customerType: dto.customerType || null,
    note: dto.note || '',
    history: dto.history || [],
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
  updateGlobalStats()
}

function handleCalendarClick(cell) {
  if (!cell.currentMonth || !cell.iso) return
  if (!cell.enabled) return

  selectedDateISO.value = cell.iso
  updateDaySchedule()
  updateFilterOutputs()
  updateGlobalStats()
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
  updateGlobalStats()
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
  statSelectedDay.value = list.length

  const byTime = new Map()
  TIME_SLOTS.forEach((t) => byTime.set(t, []))
  list.forEach((a) => {
    if (!byTime.has(a.time)) byTime.set(a.time, [])
    byTime.get(a.time).push(a)
  })

  daySlots.value = TIME_SLOTS.map((t) => ({ time: t, appointments: byTime.get(t) || [] }))
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
function handleDrop(e, targetTime) {
  e.preventDefault()
  dragOverSlot.value = null

  const id = Number(e.dataTransfer.getData('text/plain'))
  if (!id || !targetTime) return

  const appt = appointments.value.find((x) => x.id === id)
  if (!appt) return

  if (appt.status === 'CANCELLED') {
    showToast('Không thể dời giờ', 'Lịch đã huỷ không được kéo thả.', 'error')
    return
  }

  // nếu đang filter today/week thì chỉ cho drop vào selected day (đúng rồi) + cell enabled
  if (!isCellEnabled(selectedDateISO.value)) return

  if (appt.date === selectedDateISO.value && appt.time === targetTime) return

  const conflict = hasConflict({ id: appt.id, date: selectedDateISO.value, time: targetTime, staff: appt.staff })
  if (conflict) {
    showToast(
        'Trùng lịch theo nhân viên',
        `${appt.staff} đã có lịch ${formatVNDate(conflict.date)} • ${conflict.time} với ${conflict.customer}.`,
        'error',
    )
    return
  }

  const from = `${formatVNDate(appt.date)} • ${appt.time}`
  const to = `${formatVNDate(selectedDateISO.value)} • ${targetTime}`

  appt.date = selectedDateISO.value
  appt.time = targetTime
  appt.history = appt.history || []
  appt.history.unshift({ ts: nowISO(), actor: currentUser.name, action: 'RESCHEDULE', desc: `Dời lịch: ${from} → ${to}.` })

  showToast('Đã dời giờ', `${appt.customer}: ${from} → ${to}`, 'success')
  generateCalendar()
  updateDaySchedule()
  updateFilterOutputs()
  updateGlobalStats()
}

// ===== Status popover =====
function closeStatusPopover() {
  statusPopover.open = false
  statusPopover.options = []
  if (statusPopover.handler) {
    window.removeEventListener('click', statusPopover.handler)
    statusPopover.handler = null
  }
}
function setStatus(id, newStatus, source = 'STATUS') {
  const appt = appointments.value.find((x) => x.id === id)
  if (!appt) return
  const old = appt.status
  if (old === newStatus) return

  appt.status = newStatus
  appt.history = appt.history || []
  appt.history.unshift({ ts: nowISO(), actor: currentUser.name, action: source, desc: `Đổi trạng thái: ${STATUS[old].label} → ${STATUS[newStatus].label}.` })

  showToast('Đã cập nhật trạng thái', `${appt.customer}: ${STATUS[newStatus].label}`, 'success')
  generateCalendar()
  updateDaySchedule()
  updateFilterOutputs()
  updateGlobalStats()
}
function openStatusPopover(anchorEl, id) {
  const appt = appointments.value.find((x) => x.id === id)
  if (!appt) return

  if (statusPopover.handler) {
    window.removeEventListener('click', statusPopover.handler)
    statusPopover.handler = null
  }

  statusPopover.options = Object.keys(STATUS).map((k) => {
    const s = STATUS[k]
    return { key: k, label: s.label, dot: s.dot, active: k === appt.status, id }
  })

  const rect = anchorEl.getBoundingClientRect()
  const top = rect.bottom + window.scrollY + 8
  const left = Math.min(rect.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - 260)
  statusPopover.top = `${top}px`
  statusPopover.left = `${left}px`
  statusPopover.open = true

  const handler = (e) => {
    if (!e.target.closest('#statusPopover') && !e.target.closest('[data-status-badge="1"]') && !e.target.closest('[data-mini="status"]')) {
      closeStatusPopover()
    }
  }

  window.addEventListener('click', handler, { once: false })
  statusPopover.handler = handler
}
function handleStatusOptionClick(option) {
  setStatus(option.id, option.key, 'STATUS')
  closeStatusPopover()
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
    return { ...h, stamp }
  })
}

// ===== Detail modal =====
function openDetailModal(appt) {
  selectedAppointment.value = appt
  renderHistory(appt)
  isDetailModalOpen.value = true
}
function closeDetailModal() {
  isDetailModalOpen.value = false
  selectedAppointment.value = null
}

// ===== Edit modal =====
function openEditModal(id) {
  const appt = appointments.value.find((x) => x.id === id)
  if (!appt) return

  editId.value = id

  editForm.customer = appt.customer || ''
  editForm.phone = appt.phone || ''
  editForm.branch = appt.branch || 'CN_Q1'
  editForm.date = appt.date
  editForm.time = appt.time
  editForm.staff = appt.staff
  editForm.consultant = appt.consultant
  editForm.status = appt.status
  editForm.consultStatus = appt.consultStatus || 'CARE'
  editForm.customerType = appt.customerType || 'OWNER'
  editForm.rating = appt.rating || 'CARE'
  editForm.note = appt.note || ''

  renderHistory(appt)
  isModalOpen.value = true
}
function closeEditModal() {
  isModalOpen.value = false
  editId.value = null
}
function saveEditModal() {
  if (editId.value == null) return
  const idx = appointments.value.findIndex((x) => x.id === editId.value)
  if (idx < 0) return

  const current = appointments.value[idx]
  const next = {
    ...current,
    customer: editForm.customer.trim() || current.customer,
    phone: editForm.phone.trim(),
    branch: editForm.branch,
    date: editForm.date,
    time: editForm.time,
    staff: editForm.staff,
    consultant: editForm.consultant,
    status: editForm.status,
    consultStatus: editForm.consultStatus,
    customerType: editForm.customerType,
    rating: editForm.rating,
    note: editForm.note.trim(),
    inCharge: editForm.staff === currentUser.name,
  }

  if (next.status !== 'CANCELLED') {
    const conflict = hasConflict({ id: next.id, date: next.date, time: next.time, staff: next.staff })
    if (conflict) {
      showToast(
          'Trùng lịch theo nhân viên',
          `${next.staff} đã có lịch ${formatVNDate(conflict.date)} • ${conflict.time} với ${conflict.customer}.`,
          'error',
      )
      return
    }
  }

  const changes = []
  if ((current.branch || '') !== (next.branch || '')) changes.push('Đổi chi nhánh.')
  if (current.date !== next.date || current.time !== next.time) changes.push(`Dời lịch: ${formatVNDate(current.date)} • ${current.time} → ${formatVNDate(next.date)} • ${next.time}.`)
  if (current.staff !== next.staff) changes.push(`Đổi NV phụ trách: ${current.staff} → ${next.staff}.`)
  if (current.status !== next.status) changes.push(`Đổi tình trạng: ${STATUS[current.status].label} → ${STATUS[next.status].label}.`)
  if ((current.consultStatus || '') !== (next.consultStatus || '')) changes.push(`Đổi KQ tư vấn: ${CONSULT_STATUS[current.consultStatus]?.label || '-'} → ${CONSULT_STATUS[next.consultStatus]?.label || '-'}.`)
  if ((current.customerType || '') !== (next.customerType || '')) changes.push(`Đổi phân loại KH: ${CUSTOMER_TYPE[current.customerType]?.label || '-'} → ${CUSTOMER_TYPE[next.customerType]?.label || '-'}.`)
  if ((current.rating || '') !== (next.rating || '')) changes.push(`Đổi đánh giá: ${RATING[current.rating]?.label || '-'} → ${RATING[next.rating]?.label || '-'}.`)
  if ((current.note || '') !== (next.note || '')) changes.push('Cập nhật ghi chú.')
  if ((current.customer || '') !== (next.customer || '') || (current.phone || '') !== (next.phone || '')) changes.push('Cập nhật thông tin khách.')

  next.history = next.history || []
  if (changes.length) next.history.unshift(makeHistory(currentUser.name, 'EDIT', changes.join(' ')))

  appointments.value[idx] = next

  // giữ selectedDate trong range (week/today)
  selectedDateISO.value = next.date
  if (activeRange.value === 'month') {
    const d = new Date(`${next.date}T00:00:00`)
    calendarMonth.value = new Date(d.getFullYear(), d.getMonth(), 1)
  }

  showToast('Đã lưu thay đổi', `${next.customer}: ${formatVNDate(next.date)} • ${next.time}`, 'success')
  generateCalendar()
  updateDaySchedule()
  updateFilterOutputs()
  updateGlobalStats()
  closeEditModal()
}
// ===== Lấy tất cả chi nhánh =========
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


function buildCreateAppointmentPayload() {
  return {
    customerId: createForm.selectedCustomer.id,
    consultantId: createForm.consultant,      // ID NV tư vấn
    branchId: createForm.branch,               // ID chi nhánh
    appointmentDate: createForm.date,          // yyyy-MM-dd
    appointmentTime: createForm.time,          // HH:mm
    note: createForm.note || '',
    rating: createForm.rating || 'BAN_NHANH_30N',
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
  // dateStr: yyyy-MM-dd
  // timeStr: HH:mm

  // parse ngày KHÔNG dính timezone
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)

  // ❌ Chủ nhật
  if (date.getDay() === 0) {
    return {
      valid: false,
      message: 'Không thể tạo lịch hẹn vào Chủ nhật.'
    }
  }

  // 👉 hôm nay (00:00)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // ❌ ngày quá khứ
  if (date < today) {
    return {
      valid: false,
      message: 'Không thể tạo lịch hẹn cho ngày đã qua.'
    }
  }

  // ===== CHECK GIỜ =====
  const [hour, minute] = timeStr.split(':').map(Number)
  const totalMinutes = hour * 60 + minute

  const MORNING_START = 8 * 60 + 30   // 08:30
  const MORNING_END   = 12 * 60       // 12:00
  const AFTERNOON_START = 13 * 60 + 30 // 13:30
  const AFTERNOON_END   = 17 * 60      // 17:00

  const isMorning =
      totalMinutes >= MORNING_START && totalMinutes <= MORNING_END

  const isAfternoon =
      totalMinutes >= AFTERNOON_START && totalMinutes <= AFTERNOON_END

  if (!isMorning && !isAfternoon) {
    return {
      valid: false,
      message:
          'Thời gian hẹn chỉ từ 08:30–12:00 hoặc 13:30–17:00.'
    }
  }

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

    if( !res.data.success) {
      updateAlertError('Không thể tạo lịch hẹn', res.data.message || 'Có lỗi xảy ra, vui lòng thử lại.', 'error')
      return
    }

    updateAlertSuccess('Tạo lịch hẹn thành công', 'Lịch hẹn đã được tạo.')


    closeCreateModal()
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
    RATING[a.rating]?.label || '',
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
}
function makeGrad(ctx, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, 220)
  stops.forEach((s) => g.addColorStop(s[0], s[1]))
  return g
}
function initCharts() {
  const c1 = $('#appointmentsChart')
  const c2 = $('#statusChart')
  const c3 = $('#successChart')
  if (!c1 || !c2 || !c3) return

  destroyCharts()

  // Chart 1 (Bar)
  const ctx1 = c1.getContext('2d')
  const barGrad = makeGrad(ctx1, [
    [0, 'rgba(102,126,234,0.95)'],
    [0.55, 'rgba(118,75,162,0.78)'],
    [1, 'rgba(79,172,254,0.50)'],
  ])

  chart1 = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['3/1', '2/1', '1/1', '31/12', '30/12', '29/12', '28/12'],
      datasets: [
        {
          label: 'Số lịch hẹn',
          data: [4, 3, 2, 1, 2, 3, 2],
          backgroundColor: barGrad,
          borderWidth: 0,
          borderRadius: 14,
          borderSkipped: false,
          barPercentage: 0.7,
          categoryPercentage: 0.72,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(20,22,30,0.92)',
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
          grid: { color: 'rgba(20,22,30,.08)' },
        },
        x: {
          ticks: { color: '#5b6576', font: { weight: '600' } },
          grid: { display: false },
        },
      },
    },
  })

  // Chart 2 (Doughnut)
  const ctx2 = c2.getContext('2d')
  const gUp = makeGrad(ctx2, [
    [0, 'rgba(67,233,123,0.95)'],
    [1, 'rgba(56,249,215,0.55)'],
  ])
  const gNot = makeGrad(ctx2, [
    [0, 'rgba(250,112,154,0.92)'],
    [1, 'rgba(254,225,64,0.50)'],
  ])
  const gPost = makeGrad(ctx2, [
    [0, 'rgba(79,172,254,0.95)'],
    [1, 'rgba(0,242,254,0.55)'],
  ])
  const gCancel = makeGrad(ctx2, [
    [0, 'rgba(255,88,88,0.90)'],
    [1, 'rgba(240,152,25,0.55)'],
  ])

  chart2 = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: ['Đã lên', 'Chưa lên', 'Tạm hoãn', 'Huỷ'],
      datasets: [
        {
          data: [45, 30, 15, 10],
          backgroundColor: [gUp, gNot, gPost, gCancel],
          borderWidth: 0,
          hoverOffset: 6,
          spacing: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#455064', boxWidth: 10, boxHeight: 10, font: { weight: '600' } },
        },
        tooltip: {
          backgroundColor: 'rgba(20,22,30,0.92)',
          padding: 10,
          titleColor: '#fff',
          bodyColor: '#e8edf6',
          displayColors: true,
        },
      },
    },
  })

  // Chart 3 (Pie)
  const ctx3 = c3.getContext('2d')
  const gSuccess = makeGrad(ctx3, [
    [0, 'rgba(67,233,123,0.95)'],
    [1, 'rgba(56,249,215,0.55)'],
  ])
  const gFail = makeGrad(ctx3, [
    [0, 'rgba(255,88,88,0.90)'],
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
          data: [60, 20, 20],
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
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#455064', boxWidth: 10, boxHeight: 10, font: { weight: '600' } },
        },
        tooltip: {
          backgroundColor: 'rgba(20,22,30,0.92)',
          padding: 10,
          titleColor: '#fff',
          bodyColor: '#e8edf6',
        },
      },
    },
  })
}

// ===== Action menu =====
function toggleActionMenu(id) {
  openActionMenuId.value = openActionMenuId.value === id ? null : id
}
function handleAction(type, appt, event) {
  openActionMenuId.value = null
  if (type === 'edit') openEditModal(appt.id)
  else if (type === 'status') openStatusPopover(event.currentTarget, appt.id)
  else if (type === 'delete') {
    appointments.value = appointments.value.filter((x) => x.id !== appt.id)
    generateCalendar()
    updateDaySchedule()
    updateFilterOutputs()
    updateGlobalStats()
    showToast('Đã xoá lịch hẹn', appt.customer || 'Đã xoá.', 'success')
  } else if (type === 'detail') openDetailModal(appt)
}

// ===== Helpers =====
function getStatusInfo(status) {
  return STATUS[status]
}
function getConsultInfo(status) {
  return CONSULT_STATUS[status] || CONSULT_STATUS.CARE
}
function getCustomerTypeInfo(value) {
  return CUSTOMER_TYPE[value] || Object.values(CUSTOMER_TYPE)[0]
}
function getRatingInfo(value) {
  return RATING[value] || Object.values(RATING)[0]
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
    () => searchQuery.value,
    (val) => {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        searchKeyword.value = (val || '').trim()
      }, 300)
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

// ===== Mount =====
onMounted(async () => {
  if (!rootRef.value) return

  // ===== Init date =====
  selectedDateISO.value = getTodayISO()
  calendarMonth.value = new Date() // tháng hiện tại

  // ===== Init data =====
  await fetchAppointments()

  // ===== Init charts =====
  await nextTick()
  initCharts()

  // ===== Fetch branch options (ONLY ONCE) =====
  try {
    await fetchBranchOptions()
  } catch (e) {
    console.error('Fetch branch failed', e)
  }

  // ===== Ready toast =====
  showToast('Sẵn sàng', 'Hệ thống quản lý lịch hẹn đã sẵn sàng.', 'success')

  // ===== Global listeners =====
  registerWindowListener('keydown', (e) => {
    if (e.key === 'Escape' && (isModalOpen.value || isCreateModalOpen.value || isDetailModalOpen.value)) {
      if (isModalOpen.value) closeEditModal()
      if (isCreateModalOpen.value) closeCreateModal()
      if (isDetailModalOpen.value) closeDetailModal()
    }
  })

  registerWindowListener('resize', async () => {
    await nextTick()
    initCharts()
  })
})


onBeforeUnmount(() => {
  destroyCharts()
  cleanupHandlers.forEach((cleanup) => cleanup())
})
</script>

<template>
  <div ref="rootRef" class="appointments-page">
    <div class="toast-wrap" id="toastWrap"></div>

    <main class="main-content">
      <div class="header">
        <div class="page-title">
          <h2><i class="fa-solid fa-calendar-check me-2"></i>Quản lý lịch hẹn</h2>
          <p>Tạo, theo dõi và cập nhật trạng thái • phân loại • đánh giá</p>
        </div>
      </div>

      <!-- Stats (KHÔNG ăn filter) -->
      <section class="stats">
        <div class="stat s1">
          <div class="k">Tổng lịch hẹn</div>
          <div class="v">{{ statTotal }}</div>
          <div class="hint">Toàn hệ thống</div>
          <div class="i"><i class="fa-solid fa-layer-group"></i></div>
        </div>
        <div class="stat s2">
          <div class="k">Trong ngày đang chọn</div>
          <div class="v">{{ statSelectedDay }}</div>
          <div class="hint">Theo calendar</div>
          <div class="i"><i class="fa-solid fa-calendar-day"></i></div>
        </div>
        <div class="stat s3">
          <div class="k">Đã lên</div>
          <div class="v">{{ statUp }}</div>
          <div class="hint">Toàn hệ thống</div>
          <div class="i"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div class="stat s4">
          <div class="k">Chưa lên / Tạm hoãn</div>
          <div class="v">{{ statPending }}</div>
          <div class="hint">Toàn hệ thống</div>
          <div class="i"><i class="fa-solid fa-bell"></i></div>
        </div>
      </section>

      <!-- Charts row (NẰM TRÊN BỘ LỌC + LỊCH) -->
      <section class="charts-row">
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

      <!-- Filters (CHỈ cho lịch + day + table) -->
      <div class="filters">
        <div class="filter-tabs">
          <button class="filter-btn" :class="{ active: activeRange === 'today' }" @click="activeRange = 'today'">
            Hôm nay
          </button>
          <button class="filter-btn" :class="{ active: activeRange === 'week' }" @click="activeRange = 'week'">
            Tuần này
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
            <div v-if="activeRange === 'month'" class="calendar-nav">
              <button class="icon-btn" @click="handleMonthNav(-1)">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button class="icon-btn" @click="handleMonthNav(1)">
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
                              class="status-badge"
                              data-status-badge="1"
                              :class="getStatusInfo(appt.status).cls"
                              @click.stop="openStatusPopover($event.currentTarget, appt.id)"
                          >
                            {{ getStatusInfo(appt.status).label }}
                            <i class="fa-solid fa-chevron-down" style="font-size: 11px; opacity: 0.85"></i>
                          </span>
                        </div>

                        <div class="appt-sub">
                          KQ tư vấn: <b>{{ getConsultInfo(appt.consultStatus).label }}</b>
                        </div>
                      </div>

                      <div class="appt-cta">
                        <button class="mini-btn" title="Sửa" @click.stop="openEditModal(appt.id)">
                          <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button class="mini-btn" title="Đổi trạng thái" data-mini="status" @click.stop="openStatusPopover($event.currentTarget, appt.id)">
                          <i class="fa-solid fa-rotate"></i>
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

              <td>
                  <span class="consult-badge" :class="getConsultInfo(appt.consultStatus).cls">
                    <i class="fa-solid" :class="getConsultInfo(appt.consultStatus).icon"></i>
                    {{ getConsultInfo(appt.consultStatus).label }}
                  </span>
              </td>

              <td>
                  <span class="chip" :class="getCustomerTypeInfo(appt.customerType).cls">
                    {{ getCustomerTypeInfo(appt.customerType).label }}
                  </span>
              </td>

              <td>
                  <span class="chip" :class="getRatingInfo(appt.rating).cls">
                    {{ getRatingInfo(appt.rating).label }}
                  </span>
              </td>

              <td style="position: relative">
                  <span
                      class="status-badge"
                      data-status-badge="1"
                      :class="getStatusInfo(appt.status).cls"
                      @click.stop="openStatusPopover($event.currentTarget, appt.id)"
                  >
                    {{ getStatusInfo(appt.status).label }}
                    <i class="fa-solid fa-chevron-down" style="font-size: 11px; opacity: 0.85"></i>
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
                    <button @click.stop="handleAction('edit', appt, $event)">
                      <i class="fa-regular fa-pen-to-square"></i>
                      Sửa lịch hẹn
                    </button>
                    <button @click.stop="handleAction('status', appt, $event)">
                      <i class="fa-solid fa-rotate"></i>
                      Đổi tình trạng
                    </button>
                    <button @click.stop="handleAction('delete', appt, $event)">
                      <i class="fa-regular fa-trash-can"></i>
                      Xoá lịch hẹn
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
    <div class="status-pop" id="statusPopover" :class="{ open: statusPopover.open }" :style="{ top: statusPopover.top, left: statusPopover.left }">
      <button v-for="option in statusPopover.options" :key="option.key" class="opt" @click.stop="handleStatusOptionClick(option)">
        <span>{{ option.label }}</span>
        <span class="dot" :style="{ background: option.dot, boxShadow: option.active ? '0 0 0 3px rgba(20,22,30,.06)' : '' }"></span>
      </button>
    </div>

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

                  <option value="BAN_NHANH_30N">
                    Bán nhanh 30 ngày
                  </option>

                  <option value="BAN_GP">
                    Bán giải pháp
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
      <div class="editor-modal edit" role="dialog" aria-modal="true">
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

        <div class="modal-body grid">
          <div class="modal-card">
            <div class="card-cap">
              <i class="fa-solid fa-gear"></i>
              <span>Nội dung chỉnh sửa</span>
            </div>

            <div class="section-title">
              <span class="sec-ico si1"><i class="fa-solid fa-user"></i></span>
              <span>Khách hàng</span>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi1"><i class="fa-solid fa-user"></i></span>
                    Tên khách
                  </span>
                </label>
                <input type="text" class="form-input" v-model="editForm.customer" />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi8"><i class="fa-solid fa-phone"></i></span>
                    Số điện thoại
                  </span>
                </label>
                <input type="text" class="form-input" v-model="editForm.phone" />
              </div>
            </div>

            <div class="section-title">
              <span class="sec-ico si2"><i class="fa-solid fa-building"></i></span>
              <span>Chi nhánh & nhân sự</span>
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
                    @change="editForm.staff = (getStaffOptionsByBranch(editForm.branch)[0] || '')"
                >
                  <option v-for="b in BRANCHES" :key="b.key" :value="b.key">{{ b.label }}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi5"><i class="fa-solid fa-user-tie"></i></span>
                    NV phụ trách
                  </span>
                </label>
                <select class="form-select" v-model="editForm.staff">
                  <option v-for="staff in getStaffOptionsByBranch(editForm.branch)" :key="staff" :value="staff">{{ staff }}</option>
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
                <select class="form-select" v-model="editForm.time">
                  <option v-for="slot in TIME_SLOTS" :key="slot" :value="slot">{{ slot }}</option>
                </select>
              </div>
            </div>

            <div class="section-title">
              <span class="sec-ico si3"><i class="fa-solid fa-tags"></i></span>
              <span>Trạng thái & đánh giá</span>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi9"><i class="fa-solid fa-traffic-light"></i></span>
                    Tình trạng
                  </span>
                </label>
                <select class="form-select" v-model="editForm.status">
                  <option value="UP">Đã lên</option>
                  <option value="NOT_UP">Chưa lên</option>
                  <option value="POSTPONED">Tạm hoãn</option>
                  <option value="CANCELLED">Huỷ</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi10"><i class="fa-solid fa-bullseye"></i></span>
                    KQ tư vấn
                  </span>
                </label>
                <select class="form-select" v-model="editForm.consultStatus">
                  <option value="SUCCESS">Thành công</option>
                  <option value="FAIL">Thất bại</option>
                  <option value="CARE">Chăm sóc</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi11"><i class="fa-solid fa-tag"></i></span>
                    Phân loại
                  </span>
                </label>
                <select class="form-select" v-model="editForm.customerType">
                  <option value="OWNER">Chính chủ</option>
                  <option value="BROKER">Môi giới</option>
                  <option value="RELATIVE">Người thân</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="lbl">
                    <span class="lbl-ico gi12"><i class="fa-solid fa-star"></i></span>
                    Đánh giá
                  </span>
                </label>
                <select class="form-select" v-model="editForm.rating">
                  <option value="POTENTIAL">Tiềm năng</option>
                  <option value="NOT_POTENTIAL">Không tiềm năng</option>
                  <option value="CARE">Chăm sóc</option>
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
              <textarea class="form-textarea" v-model="editForm.note" placeholder="Cập nhật ghi chú..."></textarea>
            </div>
          </div>

          <div class="modal-panel">
            <h5>
              <span class="sec-ico si4"><i class="fa-solid fa-clock-rotate-left"></i></span>
              Lịch sử thay đổi
            </h5>

            <div class="history">
              <div v-if="!historyItems.length" class="muted-empty">Chưa có lịch sử.</div>
              <div v-else>
                <div v-for="item in historyItems" :key="item.ts" class="h-item">
                  <div class="h-top">
                    <span>{{ item.actor }} • {{ item.action }}</span>
                    <span>{{ item.stamp }}</span>
                  </div>
                  <div class="h-desc">{{ item.desc || '' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-foot">
          <button class="btn btn-secondary" type="button" @click="closeEditModal">Đóng</button>
          <button class="btn btn-primary" type="button" @click="saveEditModal">
            <i class="fa-solid fa-floppy-disk"></i>Lưu thay đổi
          </button>
        </div>
      </div>
    </div>

    <!-- Modal chi tiết (màu mới đẹp hơn + icon nhỏ chung label) -->
    <div v-if="isDetailModalOpen && selectedAppointment" class="backdrop" @click.self="closeDetailModal">
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
          <div class="modal-card detail-card">
            <div class="card-cap">
              <i class="fa-solid fa-id-card"></i>
              <span>Thông tin lịch hẹn</span>
            </div>

            <div class="detail-grid">
              <div class="d-item">
                <div class="d-ico di1"><i class="fa-solid fa-user"></i></div>
                <div class="d-main">
                  <div class="d-label">Khách hàng</div>
                  <div class="d-value">{{ selectedAppointment.customer }}</div>
                </div>
              </div>

              <div class="d-item">
                <div class="d-ico di2"><i class="fa-solid fa-phone"></i></div>
                <div class="d-main">
                  <div class="d-label">Số điện thoại</div>
                  <div class="d-value">{{ selectedAppointment.phone || 'Chưa có' }}</div>
                </div>
              </div>

              <div class="d-item">
                <div class="d-ico di3"><i class="fa-solid fa-building"></i></div>
                <div class="d-main">
                  <div class="d-label">Chi nhánh</div>
                  <div class="d-value">{{ selectedAppointment.branch }}</div>
                </div>
              </div>

              <div class="d-item">
                <div class="d-ico di4"><i class="fa-regular fa-calendar"></i></div>
                <div class="d-main">
                  <div class="d-label">Ngày & Giờ</div>
                  <div class="d-value">{{ formatVNDate(selectedAppointment.date) }} • {{ selectedAppointment.time }}</div>
                </div>
              </div>

              <div class="d-item">
                <div class="d-ico di5"><i class="fa-solid fa-user-tie"></i></div>
                <div class="d-main">
                  <div class="d-label">NV phụ trách</div>
                  <div class="d-value">{{ selectedAppointment.staff }}</div>
                </div>
              </div>

              <div class="d-item">
                <div class="d-ico di6"><i class="fa-solid fa-circle-dot"></i></div>
                <div class="d-main">
                  <div class="d-label">Tình trạng</div>
                  <div class="d-value">
                    <span class="status-badge" :class="getStatusInfo(selectedAppointment.status).cls">
                      {{ getStatusInfo(selectedAppointment.status).label }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="d-item">
                <div class="d-ico di7"><i class="fa-solid fa-bullseye"></i></div>
                <div class="d-main">
                  <div class="d-label">KQ tư vấn</div>
                  <div class="d-value">
                    <span class="consult-badge" :class="getConsultInfo(selectedAppointment.consultStatus).cls">
                      <i class="fa-solid" :class="getConsultInfo(selectedAppointment.consultStatus).icon"></i>
                      {{ getConsultInfo(selectedAppointment.consultStatus).label }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="d-item">
                <div class="d-ico di8"><i class="fa-solid fa-tag"></i></div>
                <div class="d-main">
                  <div class="d-label">Phân loại</div>
                  <div class="d-value">
                    <span class="chip" :class="getCustomerTypeInfo(selectedAppointment.customerType).cls">
                      {{ getCustomerTypeInfo(selectedAppointment.customerType).label }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="d-item">
                <div class="d-ico di9"><i class="fa-solid fa-star"></i></div>
                <div class="d-main">
                  <div class="d-label">Đánh giá</div>
                  <div class="d-value">
                    <span class="chip" :class="getRatingInfo(selectedAppointment.rating).cls">
                      {{ getRatingInfo(selectedAppointment.rating).label }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="d-item">
                <div class="d-ico di10"><i class="fa-solid fa-shield-halved"></i></div>
                <div class="d-main">
                  <div class="d-label">Người tạo</div>
                  <div class="d-value">{{ selectedAppointment.creator }}</div>
                </div>
              </div>
            </div>

            <div class="note-box">
              <div class="note-cap"><i class="fa-regular fa-note-sticky"></i> Ghi chú</div>
              <div class="note-body">{{ selectedAppointment.note || 'Không có ghi chú' }}</div>
            </div>
          </div>

          <div class="modal-panel">
            <h5>
              <span class="sec-ico si4"><i class="fa-solid fa-clock-rotate-left"></i></span>
              Lịch sử thay đổi
            </h5>

            <div class="history">
              <div v-if="!historyItems.length" class="muted-empty">Chưa có lịch sử.</div>
              <div v-else>
                <div v-for="item in historyItems" :key="item.ts" class="h-item">
                  <div class="h-top">
                    <span>{{ item.actor }} • {{ item.action }}</span>
                    <span>{{ item.stamp }}</span>
                  </div>
                  <div class="h-desc">{{ item.desc || '' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-foot">
          <button class="btn btn-secondary" type="button" @click="closeDetailModal">Đóng</button>
          <button class="btn btn-primary" type="button" @click="openEditModal(selectedAppointment.id)">
            <i class="fa-regular fa-pen-to-square"></i>Chỉnh sửa
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
  zoom: 0.8;
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
  margin-bottom:14px;
}
.page-title h2{
  font-size:22px; font-weight:900;
  color:#0b1220;
  display:flex; align-items:center;
}
.page-title p{ font-size:13px; color:#5b6576; margin-top:4px; font-weight:600; }

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
.chart-container{
  height: 240px;
  border-radius: 16px;
  overflow:hidden;
  background: linear-gradient(135deg, rgba(255,255,255,0.70), rgba(255,255,255,0.86));
  border: 1px solid rgba(20,22,30,0.06);
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
.ct-owner{ background: rgba(148,163,184,0.16); color:#334155; }
.ct-broker{ background: rgba(67,233,123,0.18); color:#0b7f6a; }
.ct-relative{ background: rgba(250,112,154,0.16); color:#a43e73; }

.rt-pot{ background: rgba(67,233,123,0.18); color:#0b7f6a; }
.rt-npot{ background: rgba(255,88,88,0.18); color:#b83b2c; }
.rt-care{ background: rgba(79,172,254,0.18); color:#0b6ea8; }

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
  width: min(1020px, 96vw);
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
  max-height: 420px;
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
.h-desc{ font-size:12.5px; color:#5b6576; font-weight:650; line-height:1.4; }
.muted-empty{ font-weight:800; color:#93a2b8; font-size:12.5px; }

.modal-foot{
  padding:14px 16px;
  border-top:1px solid rgba(20,22,30,0.10);
  display:flex;
  gap:10px;
  justify-content:flex-end;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(10px);
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

/* Responsive */
@media (max-width:768px){
  .filters{ align-items:flex-start; }
  .search-bar{ width:100%; }
}
</style>
