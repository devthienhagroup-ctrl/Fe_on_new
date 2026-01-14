<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

const rootRef = ref(null);
const cleanupHandlers = [];

const statTotal = ref(0);
const statSelectedDay = ref(0);
const statUp = ref(0);
const statPending = ref(0);

const activeFilterText = ref('Tất cả');
const activeFilterCount = ref(0);
const filteredAppointments = ref([]);
const daySlots = ref([]);
const dayTitle = ref('');
const calendarTitle = ref('');
const calendarCells = ref([]);
const historyItems = ref([]);
const openActionMenuId = ref(null);
const dragOverSlot = ref(null);

const statusPopover = reactive({
  open: false,
  top: '0px',
  left: '0px',
  options: [],
  handler: null,
});

const registerWindowListener = (event, handler, options) => {
  window.addEventListener(event, handler, options);
  cleanupHandlers.push(() => window.removeEventListener(event, handler, options));
};

const $ = (sel, root = rootRef.value) => (root ? root.querySelector(sel) : null);
const $$ = (sel, root = rootRef.value) => Array.from(root ? root.querySelectorAll(sel) : []);
const pad2 = (n) => String(n).padStart(2, '0');
const nowISO = () => new Date().toISOString();

const currentUser = { name: 'Lê Hiếu' }; // demo
const STAFFS = ['Lê Hiếu', 'Nguyễn Văn A', 'Trần Thị B', 'Phạm Văn C'];
const CONSULTANTS = ['Lê Hiếu', 'Nguyễn Văn A', 'Trần Thị B', 'Phạm Văn C', 'Tư vấn 1', 'Tư vấn 2'];

const STATUS = {
  UP: { label: 'Đã lên', cls: 'status-up-option', dot: '#27ae60' },
  NOT_UP: { label: 'Chưa lên', cls: 'status-not-up-option', dot: '#f39c12' },
  POSTPONED: { label: 'Tạm hoãn', cls: 'status-postponed-option', dot: '#2980b9' },
  CANCELLED: { label: 'Huỷ', cls: 'status-cancelled-option', dot: '#e74c3c' },
};

const CONSULT_STATUS = {
  SUCCESS: { label: 'Thành công', cls: 'consult-success-badge', icon: 'fa-circle-check' },
  FAIL: { label: 'Thất bại', cls: 'consult-fail-badge', icon: 'fa-circle-xmark' },
  CARE: { label: 'Chăm sóc', cls: 'consult-care-badge', icon: 'fa-hand-holding-heart' },
};

const CUSTOMER_TYPE = {
  OWNER: { label: 'Chính chủ', cls: 'chip-owner' },
  BROKER: { label: 'Môi giới', cls: 'chip-broker' },
  RELATIVE: { label: 'Người thân', cls: 'chip-relative' },
};

const RATING = {
  POTENTIAL: { label: 'Tiềm năng', cls: 'chip-potential' },
  NOT_POTENTIAL: { label: 'Không tiềm năng', cls: 'chip-not-potential' },
  CARE: { label: 'Chăm sóc', cls: 'chip-care' },
};

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

function formatVNDate(yyyyMMdd) {
  const [y, m, d] = yyyyMMdd.split('-');
  return `${d}/${m}/${y}`;
}
function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function startOfWeek(dateObj) {
  const d = new Date(dateObj);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfWeek(dateObj) {
  const s = startOfWeek(dateObj);
  const e = new Date(s);
  e.setDate(e.getDate() + 7);
  return e;
}
function initials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'NA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function showToast(title, body, type = 'info') {
  const wrap = $('#toastWrap');
  if (!wrap) return;
  const icon =
    type === 'error'
      ? 'fa-triangle-exclamation'
      : type === 'success'
        ? 'fa-circle-check'
        : 'fa-circle-info';
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `
      <div class="ico"><i class="fa-solid ${icon}"></i></div>
      <div class="t">
        <div class="a">${title}</div>
        <div class="b">${body || ''}</div>
      </div>
      <button class="x" aria-label="close"><i class="fa-solid fa-xmark"></i></button>
    `;
  wrap.appendChild(t);

  const kill = () => {
    t.remove();
  };
  t.querySelector('.x').addEventListener('click', kill);
  setTimeout(kill, 3800);
}

const demoToday = new Date(2026, 0, 3);
const selectedDateISO = ref('2026-01-03');
const calendarMonth = ref(new Date(2026, 0, 1));

const activeRange = ref('all');
const activeStatus = ref('ALL');
const searchQuery = ref('');
const editId = ref(null);
const isModalOpen = ref(false);
const modalForm = reactive({
  customer: '',
  phone: '',
  date: '',
  time: TIME_SLOTS[0],
  staff: STAFFS[0],
  consultant: CONSULTANTS[0],
  status: 'UP',
  consultStatus: 'CARE',
  customerType: 'OWNER',
  rating: 'CARE',
  note: '',
});

function makeHistory(actor, action, desc) {
  return { ts: nowISO(), actor, action, desc };
}

const appointments = ref([
  {
    id: 1,
    customer: 'Nguyễn Văn A',
    phone: '0987 654 321',
    date: '2026-01-03',
    time: '10:00',
    staff: 'Lê Hiếu',
    consultant: 'Tư vấn 1',
    status: 'UP',
    consultStatus: 'SUCCESS',
    customerType: 'OWNER',
    rating: 'POTENTIAL',
    creator: 'Lê Hiếu',
    note: 'Khách ưu tiên làm nhanh.',
    history: [makeHistory('Lê Hiếu', 'CREATE', 'Tạo lịch hẹn.')],
  },
  {
    id: 2,
    customer: 'Trần Thị B',
    phone: '0912 345 678',
    date: '2026-01-03',
    time: '14:00',
    staff: 'Nguyễn Văn A',
    consultant: 'Tư vấn 2',
    status: 'NOT_UP',
    consultStatus: 'CARE',
    customerType: 'RELATIVE',
    rating: 'CARE',
    creator: 'Lê Hiếu',
    note: 'Gọi xác nhận trước 1h.',
    history: [makeHistory('Lê Hiếu', 'CREATE', 'Tạo lịch hẹn.')],
  },
  {
    id: 3,
    customer: 'Phạm Văn C',
    phone: '0933 222 111',
    date: '2026-01-02',
    time: '09:00',
    staff: 'Lê Hiếu',
    consultant: 'Nguyễn Văn A',
    status: 'CANCELLED',
    consultStatus: 'FAIL',
    customerType: 'BROKER',
    rating: 'NOT_POTENTIAL',
    creator: 'Nguyễn Văn A',
    note: '',
    history: [
      makeHistory('Nguyễn Văn A', 'CREATE', 'Tạo lịch hẹn.'),
      makeHistory('Nguyễn Văn A', 'STATUS', 'Đổi trạng thái: Huỷ.'),
    ],
  },
  {
    id: 4,
    customer: 'Lê Văn D',
    phone: '0978 876 543',
    date: '2026-01-01',
    time: '15:00',
    staff: 'Trần Thị B',
    consultant: 'Tư vấn 1',
    status: 'POSTPONED',
    consultStatus: 'CARE',
    customerType: 'OWNER',
    rating: 'CARE',
    creator: 'Lê Hiếu',
    note: 'Dời vì khách bận.',
    history: [
      makeHistory('Lê Hiếu', 'CREATE', 'Tạo lịch hẹn.'),
      makeHistory('Lê Hiếu', 'STATUS', 'Đổi trạng thái: Tạm hoãn.'),
    ],
  },
  {
    id: 5,
    customer: 'Mai H.',
    phone: '0901 111 222',
    date: '2026-01-10',
    time: '11:00',
    staff: 'Phạm Văn C',
    consultant: 'Tư vấn 2',
    status: 'NOT_UP',
    consultStatus: 'FAIL',
    customerType: 'BROKER',
    rating: 'NOT_POTENTIAL',
    creator: 'Lê Hiếu',
    note: '',
    history: [makeHistory('Lê Hiếu', 'CREATE', 'Tạo lịch hẹn.')],
  },
]);

function hasConflict({ id = null, date, time, staff }) {
  return appointments.value.find(
    (a) =>
      a.id !== id &&
      a.date === date &&
      a.time === time &&
      a.staff === staff &&
      a.status !== 'CANCELLED',
  );
}

function applyFilters(list) {
  let out = [...list];
  const refDate = new Date(`${selectedDateISO.value}T00:00:00`);
  const refISO = selectedDateISO.value;

  if (activeRange.value === 'today') {
    out = out.filter((a) => a.date === refISO);
  } else if (activeRange.value === 'week') {
    const s = startOfWeek(refDate);
    const e = endOfWeek(refDate);
    out = out.filter((a) => {
      const d = new Date(`${a.date}T00:00:00`);
      return d >= s && d < e;
    });
  } else if (activeRange.value === 'month') {
    const y = refDate.getFullYear();
    const m = refDate.getMonth();
    out = out.filter((a) => {
      const d = new Date(`${a.date}T00:00:00`);
      return d.getFullYear() === y && d.getMonth() === m;
    });
  }

  if (activeStatus.value !== 'ALL') {
    out = out.filter((a) => a.status === activeStatus.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    out = out.filter(
      (a) =>
        (a.customer || '').toLowerCase().includes(q) ||
        (a.phone || '').toLowerCase().includes(q) ||
        (a.staff || '').toLowerCase().includes(q) ||
        (a.consultant || '').toLowerCase().includes(q) ||
        (a.creator || '').toLowerCase().includes(q),
    );
  }

  out.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  return out;
}

function updateStats(filtered) {
  statTotal.value = filtered.length;

  const dayCount = appointments.value.filter((a) => a.date === selectedDateISO.value).length;
  statSelectedDay.value = dayCount;

  const up = filtered.filter((a) => a.status === 'UP').length;
  statUp.value = up;

  const pending = filtered.filter((a) => ['NOT_UP', 'POSTPONED'].includes(a.status)).length;
  statPending.value = pending;
}

function updateFilteredAppointments() {
  const filtered = applyFilters(appointments.value);
  filteredAppointments.value = filtered;

  activeFilterCount.value = filtered.length;
  activeFilterText.value =
    (activeRange.value === 'all'
      ? 'Tất cả'
      : activeRange.value === 'today'
        ? 'Hôm nay'
        : activeRange.value === 'week'
          ? 'Tuần này'
          : 'Tháng này') +
    (activeStatus.value !== 'ALL' ? ` • ${STATUS[activeStatus.value].label}` : '');

  updateStats(filtered);
}

function monthTitle(d) {
  const m = d.getMonth() + 1;
  const y = d.getFullYear();
  return `Tháng ${m}, ${y}`;
}

function generateCalendar() {
  calendarTitle.value = monthTitle(calendarMonth.value);
  const year = calendarMonth.value.getFullYear();
  const month = calendarMonth.value.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const monthKey = `${year}-${pad2(month + 1)}`;
  const apptDays = new Set(
    appointments.value
      .filter((a) => a.date.startsWith(monthKey) && a.status !== 'CANCELLED')
      .map((a) => Number(a.date.slice(-2))),
  );

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i -= 1) {
    cells.push({
      key: `prev-${i}`,
      label: prevMonthDays - i,
      iso: null,
      currentMonth: false,
      classes: ['date', 'other-month'],
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = `${year}-${pad2(month + 1)}-${pad2(day)}`;
    const classes = ['date', 'current-month'];

    if (iso === toISODate(demoToday)) classes.push('today');
    if (iso === selectedDateISO.value) classes.push('selected');
    if (apptDays.has(day)) classes.push('has-appointment');

    cells.push({
      key: `current-${iso}`,
      label: day,
      iso,
      currentMonth: true,
      classes,
    });
  }

  const totalCells = 42;
  const nextMonthDays = totalCells - (firstDay + daysInMonth);
  for (let i = 1; i <= nextMonthDays; i += 1) {
    cells.push({
      key: `next-${i}`,
      label: i,
      iso: null,
      currentMonth: false,
      classes: ['date', 'other-month'],
    });
  }

  calendarCells.value = cells;
}

function handleCalendarClick(cell) {
  if (!cell.currentMonth || !cell.iso) return;
  selectedDateISO.value = cell.iso;
  $('#fDate').value = cell.iso;
  generateCalendar();
  updateFilteredAppointments();
  updateDaySchedule();
}

function apptsForSelectedDay() {
  return appointments.value
    .filter((a) => a.date === selectedDateISO.value)
    .sort((a, b) => a.time.localeCompare(b.time));
}

function updateDaySchedule() {
  dayTitle.value = `Day Schedule • ${formatVNDate(selectedDateISO.value)}`;
  const list = apptsForSelectedDay();
  statSelectedDay.value = list.length;

  const byTime = new Map();
  TIME_SLOTS.forEach((t) => byTime.set(t, []));
  list.forEach((a) => {
    if (!byTime.has(a.time)) byTime.set(a.time, []);
    byTime.get(a.time).push(a);
  });

  daySlots.value = TIME_SLOTS.map((t) => ({
    time: t,
    appointments: byTime.get(t) || [],
  }));
}

function handleDragStart(e, appt) {
  if (appt.status === 'CANCELLED') return;
  e.dataTransfer.setData('text/plain', String(appt.id));
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e, time) {
  e.preventDefault();
  dragOverSlot.value = time;
}

function handleDragLeave(time) {
  if (dragOverSlot.value === time) dragOverSlot.value = null;
}

function handleDrop(e, targetTime) {
  e.preventDefault();
  dragOverSlot.value = null;

  const id = Number(e.dataTransfer.getData('text/plain'));
  if (!id || !targetTime) return;

  const appt = appointments.value.find((x) => x.id === id);
  if (!appt) return;

  if (appt.status === 'CANCELLED') {
    showToast('Không thể dời giờ', 'Lịch đã huỷ không được kéo thả.', 'error');
    return;
  }

  if (appt.date === selectedDateISO.value && appt.time === targetTime) return;

  const conflict = hasConflict({ id: appt.id, date: selectedDateISO.value, time: targetTime, staff: appt.staff });
  if (conflict) {
    showToast(
      'Trùng lịch theo nhân viên',
      `${appt.staff} đã có lịch ${formatVNDate(conflict.date)} • ${conflict.time} với ${conflict.customer}.`,
      'error',
    );
    return;
  }

  const from = `${formatVNDate(appt.date)} • ${appt.time}`;
  const to = `${formatVNDate(selectedDateISO.value)} • ${targetTime}`;

  appt.date = selectedDateISO.value;
  appt.time = targetTime;
  appt.history = appt.history || [];
  appt.history.unshift({ ts: nowISO(), actor: currentUser.name, action: 'RESCHEDULE', desc: `Dời lịch: ${from} → ${to}.` });

  showToast('Đã dời giờ', `${appt.customer}: ${from} → ${to}`, 'success');
  generateCalendar();
  updateDaySchedule();
  updateFilteredAppointments();
}

function closeStatusPopover() {
  statusPopover.open = false;
  statusPopover.options = [];
  if (statusPopover.handler) {
    window.removeEventListener('click', statusPopover.handler);
    statusPopover.handler = null;
  }
}

function setStatus(id, newStatus, source = 'STATUS') {
  const appt = appointments.value.find((x) => x.id === id);
  if (!appt) return;

  const old = appt.status;
  if (old === newStatus) return;

  appt.status = newStatus;
  appt.history = appt.history || [];
  appt.history.unshift({ ts: nowISO(), actor: currentUser.name, action: source, desc: `Đổi trạng thái: ${STATUS[old].label} → ${STATUS[newStatus].label}.` });

  showToast('Đã cập nhật trạng thái', `${appt.customer}: ${STATUS[newStatus].label}`, 'success');
  generateCalendar();
  updateDaySchedule();
  updateFilteredAppointments();
}

function openStatusPopover(anchorEl, id) {
  const appt = appointments.value.find((x) => x.id === id);
  if (!appt) return;

  if (statusPopover.handler) {
    window.removeEventListener('click', statusPopover.handler);
    statusPopover.handler = null;
  }

  statusPopover.options = Object.keys(STATUS).map((k) => {
    const s = STATUS[k];
    return {
      key: k,
      label: s.label,
      dot: s.dot,
      active: k === appt.status,
      id,
    };
  });

  const rect = anchorEl.getBoundingClientRect();
  const top = rect.bottom + window.scrollY + 8;
  const left = Math.min(rect.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - 240);
  statusPopover.top = `${top}px`;
  statusPopover.left = `${left}px`;
  statusPopover.open = true;

  const handler = (e) => {
    if (!e.target.closest('#statusPopover') && !e.target.closest('[data-status-badge="1"]') && !e.target.closest('[data-mini="status"]')) {
      closeStatusPopover();
    }
  };

  window.addEventListener('click', handler, { once: false });
  statusPopover.handler = handler;
}

function handleStatusOptionClick(option) {
  setStatus(option.id, option.key, 'STATUS');
  closeStatusPopover();
}

function getSelectedTime() {
  const t = $('.time-option.selected');
  return t ? t.textContent.trim() : '10:00';
}
function getSelectedStatusFromForm() {
  const s = $('#statusSelection .status-option.selected');
  return s ? s.getAttribute('data-status') : 'UP';
}
function getSelectedConsultStatusFromForm() {
  const s = $('#consultSelection .consult-option.selected');
  return s ? s.getAttribute('data-consult') : 'SUCCESS';
}

function fillSelect(sel, options, selected) {
  sel.innerHTML = options.map((x) => `<option ${x === selected ? 'selected' : ''}>${x}</option>`).join('');
}

function resetForm() {
  $('#formTitle').textContent = 'Tạo lịch hẹn mới';
  $('#fCustomer').value = '';
  $('#fPhone').value = '';
  $('#fDate').value = selectedDateISO.value;

  fillSelect($('#fStaff'), STAFFS, 'Lê Hiếu');
  fillSelect($('#fConsultant'), CONSULTANTS, 'Tư vấn 1');

  $('#fCustomerType').value = 'OWNER';
  $('#fRating').value = 'POTENTIAL';

  $$('#timeSelection .time-option').forEach((x) => x.classList.remove('selected'));
  $$('#timeSelection .time-option').find((x) => x.textContent.trim() === '10:00')?.classList.add('selected');

  $$('#statusSelection .status-option').forEach((x) => x.classList.remove('selected'));
  $('#statusSelection .status-option[data-status="UP"]').classList.add('selected');

  $$('#consultSelection .consult-option').forEach((x) => x.classList.remove('selected'));
  $('#consultSelection .consult-option[data-consult="SUCCESS"]').classList.add('selected');

  $('#fNote').value = '';
}

function highlightForm() {
  const form = $('#formSection');
  const old = form.style.boxShadow;
  form.style.boxShadow = '0 0 0 3px rgba(77, 124, 254, 0.22)';
  setTimeout(() => {
    form.style.boxShadow = old || '0 4px 12px rgba(0,0,0,.05)';
  }, 900);
}

function saveFromForm() {
  const customer = $('#fCustomer').value.trim();
  if (!customer) {
    highlightForm();
    $('#fCustomer').focus();
    showToast('Thiếu thông tin', 'Vui lòng nhập tên khách hàng.', 'error');
    return;
  }

  const phone = $('#fPhone').value.trim();
  const staff = $('#fStaff').value;
  const consultant = $('#fConsultant').value;
  const date = $('#fDate').value;
  const time = getSelectedTime();
  const status = getSelectedStatusFromForm();
  const consultStatus = getSelectedConsultStatusFromForm();
  const customerType = $('#fCustomerType').value;
  const rating = $('#fRating').value;
  const note = $('#fNote').value.trim();

  const conflict = hasConflict({ id: null, date, time, staff });
  if (conflict) {
    showToast(
      'Trùng lịch theo nhân viên',
      `${staff} đã có lịch ${formatVNDate(conflict.date)} • ${conflict.time} với ${conflict.customer}.`,
      'error',
    );
    return;
  }

  const nextId = Math.max(0, ...appointments.value.map((a) => a.id)) + 1;
  const appt = {
    id: nextId,
    customer,
    phone,
    staff,
    consultant,
    date,
    time,
    status,
    consultStatus,
    customerType,
    rating,
    creator: currentUser.name,
    note,
    history: [makeHistory(currentUser.name, 'CREATE', 'Tạo lịch hẹn.')],
  };

  appointments.value.push(appt);

  selectedDateISO.value = date;
  $('#fDate').value = date;

  showToast('Đã tạo lịch hẹn', `${customer}: ${formatVNDate(date)} • ${time}`, 'success');
  generateCalendar();
  updateDaySchedule();
  updateFilteredAppointments();
  resetForm();
}

function renderHistory(appt) {
  const history = (appt.history || []).slice(0, 80);
  historyItems.value = history.map((h) => {
    const dt = new Date(h.ts);
    const stamp = `${pad2(dt.getHours())}:${pad2(dt.getMinutes())} • ${pad2(dt.getDate())}/${pad2(dt.getMonth() + 1)}/${dt.getFullYear()}`;
    return { ...h, stamp };
  });
}

function openModal(id) {
  const appt = appointments.value.find((x) => x.id === id);
  if (!appt) return;

  editId.value = id;

  modalForm.customer = appt.customer || '';
  modalForm.phone = appt.phone || '';
  modalForm.date = appt.date;
  modalForm.time = TIME_SLOTS.includes(appt.time) ? appt.time : TIME_SLOTS[0];
  modalForm.staff = STAFFS.includes(appt.staff) ? appt.staff : STAFFS[0];
  modalForm.consultant = CONSULTANTS.includes(appt.consultant) ? appt.consultant : CONSULTANTS[0];
  modalForm.status = appt.status;
  modalForm.consultStatus = appt.consultStatus || 'CARE';
  modalForm.customerType = appt.customerType || 'OWNER';
  modalForm.rating = appt.rating || 'CARE';
  modalForm.note = appt.note || '';

  renderHistory(appt);

  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editId.value = null;
}

function saveModal() {
  if (editId.value == null) return;
  const idx = appointments.value.findIndex((x) => x.id === editId.value);
  if (idx < 0) return;

  const current = appointments.value[idx];

  const next = {
    ...current,
    customer: modalForm.customer.trim() || current.customer,
    phone: modalForm.phone.trim(),
    date: modalForm.date,
    time: modalForm.time,
    staff: modalForm.staff,
    consultant: modalForm.consultant,
    status: modalForm.status,
    consultStatus: modalForm.consultStatus,
    customerType: modalForm.customerType,
    rating: modalForm.rating,
    note: modalForm.note.trim(),
  };

  if (next.status !== 'CANCELLED') {
    const conflict = hasConflict({ id: next.id, date: next.date, time: next.time, staff: next.staff });
    if (conflict) {
      showToast(
        'Trùng lịch theo nhân viên',
        `${next.staff} đã có lịch ${formatVNDate(conflict.date)} • ${conflict.time} với ${conflict.customer}.`,
        'error',
      );
      return;
    }
  }

  const changes = [];
  if (current.date !== next.date || current.time !== next.time) {
    changes.push(`Dời lịch: ${formatVNDate(current.date)} • ${current.time} → ${formatVNDate(next.date)} • ${next.time}.`);
  }
  if (current.staff !== next.staff) {
    changes.push(`Đổi NV phụ trách: ${current.staff} → ${next.staff}.`);
  }
  if (current.consultant !== next.consultant) {
    changes.push(`Đổi NV tư vấn: ${current.consultant || '-'} → ${next.consultant || '-'}.`);
  }
  if (current.status !== next.status) {
    changes.push(`Đổi tình trạng: ${STATUS[current.status].label} → ${STATUS[next.status].label}.`);
  }
  if ((current.consultStatus || '') !== (next.consultStatus || '')) {
    changes.push(`Đổi tình trạng tư vấn: ${CONSULT_STATUS[current.consultStatus]?.label || '-'} → ${CONSULT_STATUS[next.consultStatus]?.label || '-'}.`);
  }
  if ((current.customerType || '') !== (next.customerType || '')) {
    changes.push(`Đổi phân loại KH: ${CUSTOMER_TYPE[current.customerType]?.label || '-'} → ${CUSTOMER_TYPE[next.customerType]?.label || '-'}.`);
  }
  if ((current.rating || '') !== (next.rating || '')) {
    changes.push(`Đổi đánh giá: ${RATING[current.rating]?.label || '-'} → ${RATING[next.rating]?.label || '-'}.`);
  }
  if ((current.note || '') !== (next.note || '')) {
    changes.push('Cập nhật ghi chú.');
  }
  if ((current.customer || '') !== (next.customer || '') || (current.phone || '') !== (next.phone || '')) {
    changes.push('Cập nhật thông tin khách.');
  }

  next.history = next.history || [];
  if (changes.length) {
    next.history.unshift(makeHistory(currentUser.name, 'EDIT', changes.join(' ')));
  }

  appointments.value[idx] = next;

  selectedDateISO.value = next.date;
  $('#fDate').value = next.date;

  showToast('Đã lưu thay đổi', `${next.customer}: ${formatVNDate(next.date)} • ${next.time}`, 'success');
  generateCalendar();
  updateDaySchedule();
  updateFilteredAppointments();
  closeModal();
}

function exportCSV() {
  const filtered = applyFilters(appointments.value);
  const header = [
    'Khách hàng',
    'SĐT',
    'Ngày',
    'Giờ',
    'NV phụ trách',
    'NV tư vấn',
    'Tình trạng',
    'KQ tư vấn',
    'Phân loại',
    'Đánh giá',
    'Người tạo',
    'Ghi chú',
  ];

  const rows = filtered.map((a) => [
    a.customer,
    a.phone,
    a.date,
    a.time,
    a.staff,
    a.consultant,
    STATUS[a.status].label,
    CONSULT_STATUS[a.consultStatus]?.label || '',
    CUSTOMER_TYPE[a.customerType]?.label || '',
    RATING[a.rating]?.label || '',
    a.creator,
    a.note || '',
  ]);

  const csv = [header, ...rows]
    .map((r) => r.map((v) => `"${String(v || '').replaceAll('"', '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lich-hen_${selectedDateISO.value}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  showToast('Xuất file thành công', `Đã xuất ${filtered.length} dòng CSV.`, 'success');
}

function initTimeSelection() {
  const timeOptions = $$('.time-option');
  timeOptions.forEach((option) => {
    option.addEventListener('click', function handleTimeClick() {
      timeOptions.forEach((opt) => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
}

function initStatusSelection() {
  const statusOptions = $$('#statusSelection .status-option');
  statusOptions.forEach((option) => {
    option.addEventListener('click', function handleStatusClick() {
      statusOptions.forEach((opt) => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
}

function initConsultSelection() {
  const opts = $$('#consultSelection .consult-option');
  opts.forEach((option) => {
    option.addEventListener('click', function handleConsultClick() {
      opts.forEach((o) => o.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
}

function initStatusFilter() {
  const tags = $$('#statusFilter .status-tag');
  tags.forEach((tag) => {
    tag.addEventListener('click', () => {
      tags.forEach((t) => t.classList.remove('active'));
      tag.classList.add('active');
      activeStatus.value = tag.getAttribute('data-status');
      updateFilteredAppointments();
    });
  });
}

function initFilterTabs() {
  const btns = $$('#filterTabs .filter-btn');
  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      btns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeRange.value = btn.getAttribute('data-range');
      updateFilteredAppointments();
    });
  });
}

function initSearch() {
  $('#searchInput').addEventListener('input', (e) => {
    searchQuery.value = e.target.value || '';
    updateFilteredAppointments();
  });
}

function initCreateBtn() {
  $('#createAppointmentBtn').addEventListener('click', () => {
    $('#formSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    highlightForm();
    resetForm();
  });
}

function initFormButtons() {
  $('#cancelFormBtn').addEventListener('click', () => resetForm());
  $('#saveFormBtn').addEventListener('click', () => saveFromForm());
}

function initCalendarNav() {
  $('#prevMonthBtn').addEventListener('click', () => {
    calendarMonth.value = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() - 1, 1);
    generateCalendar();
  });
  $('#nextMonthBtn').addEventListener('click', () => {
    calendarMonth.value = new Date(calendarMonth.value.getFullYear(), calendarMonth.value.getMonth() + 1, 1);
    generateCalendar();
  });
}

function initDayButtons() {
  $('#jumpToFormBtn').addEventListener('click', () => {
    $('#fDate').value = selectedDateISO.value;
    $('#formSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    highlightForm();
  });
  $('#refreshDayBtn').addEventListener('click', () => {
    updateDaySchedule();
    showToast('Đã làm mới', `Day Schedule • ${formatVNDate(selectedDateISO.value)}`, 'success');
  });
}

function initExport() {
  $('#exportBtn').addEventListener('click', exportCSV);
}

function toggleActionMenu(id) {
  openActionMenuId.value = openActionMenuId.value === id ? null : id;
}

function handleAction(type, appt, event) {
  openActionMenuId.value = null;
  if (type === 'edit') {
    openModal(appt.id);
  } else if (type === 'status') {
    openStatusPopover(event.currentTarget, appt.id);
  } else if (type === 'delete') {
    appointments.value = appointments.value.filter((x) => x.id !== appt.id);
    generateCalendar();
    updateDaySchedule();
    updateFilteredAppointments();
    showToast('Đã xoá lịch hẹn', appt.customer || 'Đã xoá.', 'success');
  }
}

function getStatusInfo(status) {
  return STATUS[status];
}

function getConsultInfo(status) {
  return CONSULT_STATUS[status] || CONSULT_STATUS.CARE;
}

function getCustomerTypeInfo(value) {
  return CUSTOMER_TYPE[value] || Object.values(CUSTOMER_TYPE)[0];
}

function getRatingInfo(value) {
  return RATING[value] || Object.values(RATING)[0];
}

onMounted(() => {
  if (!rootRef.value) return;

  selectedDateISO.value = '2026-01-03';
  $('#fDate').value = selectedDateISO.value;

  fillSelect($('#fStaff'), STAFFS, 'Lê Hiếu');
  fillSelect($('#fConsultant'), CONSULTANTS, 'Tư vấn 1');

  initTimeSelection();
  initStatusSelection();
  initConsultSelection();
  initStatusFilter();
  initFilterTabs();
  initSearch();
  initCreateBtn();
  initFormButtons();
  initCalendarNav();
  initDayButtons();
  initExport();

  registerWindowListener('click', (e) => {
    if (!e.target.closest('[data-action-menu="1"]') && !e.target.closest('[data-action-btn="1"]')) {
      openActionMenuId.value = null;
    }
  });

  generateCalendar();
  updateDaySchedule();
  updateFilteredAppointments();

  showToast('Sẵn sàng', 'Đã thêm NV tư vấn + KQ tư vấn + phân loại + đánh giá.', 'success');

  registerWindowListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen.value) {
      closeModal();
    }
  });
});

onBeforeUnmount(() => {
  cleanupHandlers.forEach((cleanup) => cleanup());
});
</script>

<template>
  <div ref="rootRef" class="appointments-page">
    <div class="toast-wrap" id="toastWrap"></div>

    <div class="appointments-container">
      <main class="main-content">
        <div class="header">
          <div class="page-title">
            <h2>Quản lý lịch hẹn</h2>
            <p>Tạo, theo dõi và cập nhật trạng thái + tư vấn + phân loại + đánh giá</p>
          </div>

          <div class="search-bar">
            <i class="fas fa-search search-icon"></i>
            <input id="searchInput" type="text" placeholder="Tìm theo tên / SĐT / NV phụ trách / NV tư vấn..." />
          </div>
        </div>

        <section class="stats">
          <div class="stat">
            <div class="k">Tổng lịch hẹn (theo bộ lọc)</div>
            <div class="v">{{ statTotal }}</div>
            <div class="hint">Cập nhật theo tab / trạng thái / tìm kiếm</div>
            <div class="i"><i class="fa-solid fa-layer-group"></i></div>
          </div>
          <div class="stat">
            <div class="k">Trong ngày đang chọn</div>
            <div class="v">{{ statSelectedDay }}</div>
            <div class="hint">Số lịch trong Day Schedule</div>
            <div class="i"><i class="fa-solid fa-calendar-day"></i></div>
          </div>
          <div class="stat">
            <div class="k">Đã lên</div>
            <div class="v">{{ statUp }}</div>
            <div class="hint">Trong danh sách đang lọc</div>
            <div class="i"><i class="fa-solid fa-circle-check"></i></div>
          </div>
          <div class="stat">
            <div class="k">Chưa lên / Tạm hoãn</div>
            <div class="v">{{ statPending }}</div>
            <div class="hint">Trong danh sách đang lọc</div>
            <div class="i"><i class="fa-solid fa-bell"></i></div>
          </div>
        </section>

        <div class="filters">
          <div class="filter-tabs" id="filterTabs">
            <button class="filter-btn active" data-range="all">Tất cả lịch hẹn</button>
            <button class="filter-btn" data-range="today">Hôm nay</button>
            <button class="filter-btn" data-range="week">Tuần này</button>
            <button class="filter-btn" data-range="month">Tháng này</button>
          </div>

          <div class="status-filter" id="statusFilter">
            <div class="status-tag status-all active" data-status="ALL">Tất cả</div>
            <div class="status-tag status-up" data-status="UP">Đã lên</div>
            <div class="status-tag status-not-up" data-status="NOT_UP">Chưa lên</div>
            <div class="status-tag status-postponed" data-status="POSTPONED">Tạm hoãn</div>
            <div class="status-tag status-cancelled" data-status="CANCELLED">Huỷ</div>
          </div>

          <div class="action-buttons">
<!--            <button class="btn btn-secondary" id="exportBtn"><i class="fas fa-download"></i>Xuất file</button>-->
            <button class="btn btn-primary" id="createAppointmentBtn"><i class="fas fa-plus"></i>Tạo lịch hẹn</button>
          </div>
        </div>

        <div class="appointment-container">
          <div class="stack">
            <section class="calendar-section">
              <div class="calendar-header">
                <h3 id="calendarTitle">{{ calendarTitle }}</h3>
                <div class="calendar-nav">
                  <button class="calendar-nav-btn" id="prevMonthBtn"><i class="fas fa-chevron-left"></i></button>
                  <button class="calendar-nav-btn" id="nextMonthBtn"><i class="fas fa-chevron-right"></i></button>
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

              <div class="calendar-dates" id="calendarDates">
                <div
                  v-for="cell in calendarCells"
                  :key="cell.key"
                  :class="cell.classes"
                  @click="handleCalendarClick(cell)"
                >
                  {{ cell.label }}
                </div>
              </div>
            </section>

            <section class="day-section" id="daySection">
              <div class="day-head">
                <div class="day-title">
                  <h4 id="dayTitle">{{ dayTitle }}</h4>
                  <p id="daySub">Kéo thả để dời giờ. Click badge để đổi trạng thái. Tất cả thay đổi có lịch sử.</p>
                </div>
                <div class="day-actions">
                  <button class="btn btn-secondary" id="jumpToFormBtn"><i class="fa-solid fa-plus"></i>Thêm lịch ngày này</button>
                  <button class="btn btn-secondary" id="refreshDayBtn"><i class="fa-solid fa-rotate"></i>Làm mới</button>
                </div>
              </div>

              <div class="slots" id="slots">
                <div v-for="slot in daySlots" :key="slot.time" class="slot">
                  <div class="slot-time">{{ slot.time }}</div>
                  <div
                    class="slot-drop"
                    data-slot="1"
                    :data-time="slot.time"
                    :class="{ over: dragOverSlot === slot.time }"
                    @dragover="handleDragOver($event, slot.time)"
                    @dragleave="handleDragLeave(slot.time)"
                    @drop="handleDrop($event, slot.time)"
                  >
                    <template v-if="slot.appointments.length">
                      <div
                        v-for="appt in slot.appointments"
                        :key="appt.id"
                        class="appt-card"
                        data-appt-card="1"
                        :data-id="appt.id"
                        :draggable="appt.status !== 'CANCELLED'"
                        :class="{ disabled: appt.status === 'CANCELLED' }"
                        @dragstart="handleDragStart($event, appt)"
                      >
                        <span class="appt-badge" :style="{ background: getStatusInfo(appt.status).dot }"></span>
                        <div class="appt-main">
                          <div class="n">{{ appt.customer }}</div>
                          <div class="m">{{ appt.phone || '' }}</div>
                          <div class="appt-meta">{{ appt.staff }} • {{ getStatusInfo(appt.status).label }}</div>
                          <div class="appt-sub">TV: {{ appt.consultant || '-' }} • {{ getConsultInfo(appt.consultStatus).label }}</div>
                        </div>
                        <div class="appt-cta">
                          <button class="mini-btn" title="Sửa" @click.stop="openModal(appt.id)">
                            <i class="fa-regular fa-pen-to-square"></i>
                          </button>
                          <button class="mini-btn" title="Đổi trạng thái" data-mini="status" @click.stop="openStatusPopover($event.currentTarget, appt.id)">
                            <i class="fa-solid fa-rotate"></i>
                          </button>
                        </div>
                      </div>
                    </template>
                    <span v-else style="font-weight:800; color:#94a3b8; font-size:12.5px;">Kéo thả lịch vào đây</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section class="form-section" id="formSection">
            <h3 id="formTitle">Tạo lịch hẹn mới</h3>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Khách hàng</label>
                <input id="fCustomer" type="text" class="form-input" placeholder="Nhập tên khách hàng" />
              </div>
              <div class="form-group">
                <label class="form-label">Số điện thoại</label>
                <input id="fPhone" type="text" class="form-input" placeholder="VD: 0987 654 321" />
              </div>

              <div class="form-group">
                <label class="form-label">Ngày đặt lịch</label>
                <input id="fDate" type="date" class="form-input" value="2026-01-03" />
              </div>

              <div class="form-group">
                <label class="form-label">Nhân viên phụ trách</label>
                <select id="fStaff" class="form-select"></select>
              </div>

              <div class="form-group">
                <label class="form-label">Nhân viên tư vấn</label>
                <select id="fConsultant" class="form-select"></select>
              </div>

              <div class="form-group">
                <label class="form-label">Phân loại khách hàng</label>
                <select id="fCustomerType" class="form-select">
                  <option value="OWNER">Chính chủ</option>
                  <option value="BROKER">Môi giới</option>
                  <option value="RELATIVE">Người thân</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Đánh giá</label>
                <select id="fRating" class="form-select">
                  <option value="POTENTIAL">Tiềm năng</option>
                  <option value="NOT_POTENTIAL">Không tiềm năng</option>
                  <option value="CARE">Chăm sóc</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Giờ đặt lịch</label>
              <div class="time-selection" id="timeSelection">
                <div class="time-option">08:00</div>
                <div class="time-option">09:00</div>
                <div class="time-option selected">10:00</div>
                <div class="time-option">11:00</div>
                <div class="time-option">13:00</div>
                <div class="time-option">14:00</div>
                <div class="time-option">15:00</div>
                <div class="time-option">16:00</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Tình trạng khách hàng (đến lịch)</label>
              <div class="status-selection" id="statusSelection">
                <div class="status-option status-up-option selected" data-status="UP">Đã lên</div>
                <div class="status-option status-not-up-option" data-status="NOT_UP">Chưa lên</div>
                <div class="status-option status-postponed-option" data-status="POSTPONED">Tạm hoãn</div>
                <div class="status-option status-cancelled-option" data-status="CANCELLED">Huỷ</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Tình trạng tư vấn</label>
              <div class="consult-selection" id="consultSelection">
                <div class="consult-option consult-success selected" data-consult="SUCCESS">Thành công</div>
                <div class="consult-option consult-fail" data-consult="FAIL">Thất bại</div>
                <div class="consult-option consult-care" data-consult="CARE">Chăm sóc</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Ghi chú</label>
              <textarea
                id="fNote"
                class="form-textarea"
                placeholder="Ví dụ: Khách ưu tiên làm buổi sáng, đã đặt cọc, yêu cầu kỹ thuật viên A..."
              ></textarea>
            </div>

            <div class="form-actions">
              <button class="btn btn-secondary" id="cancelFormBtn">Huỷ</button>
              <button class="btn btn-primary" id="saveFormBtn">Lưu lịch hẹn</button>
            </div>
          </section>
        </div>

        <section class="appointments-list">
          <div class="list-header">
            <h3>Lịch hẹn gần đây</h3>
            <div class="pill-muted" id="activeFilterPill">
              <i class="fa-solid fa-filter"></i>
              <span id="activeFilterText">{{ activeFilterText }}</span>
              <span style="opacity:.6;">•</span>
              <span id="activeFilterCount">{{ activeFilterCount }}</span>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Ngày & Giờ</th>
                  <th>NV phụ trách</th>
                  <th>NV tư vấn</th>
                  <th>KQ tư vấn</th>
                  <th>Phân loại</th>
                  <th>Đánh giá</th>
                  <th>Tình trạng</th>
                  <th>Người tạo</th>
                  <th style="width:90px;">Thao tác</th>
                </tr>
              </thead>
              <tbody id="appointmentsTbody">
                <tr v-for="appt in filteredAppointments" :key="appt.id" :data-row-id="appt.id">
                  <td>
                    <div class="customer-info">
                      <div class="customer-avatar">{{ initials(appt.customer) }}</div>
                      <div>
                        <div class="customer-name">{{ appt.customer }}</div>
                        <div class="customer-phone">{{ appt.phone || '' }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="pill-muted">
                      <i class="fa-regular fa-calendar"></i>{{ formatVNDate(appt.date) }} • {{ appt.time }}
                    </span>
                  </td>
                  <td>{{ appt.staff }}</td>
                  <td>{{ appt.consultant || '-' }}</td>
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
                  <td style="position:relative;">
                    <span
                      class="status-badge"
                      data-status-badge="1"
                      :data-id="appt.id"
                      :class="getStatusInfo(appt.status).cls"
                      @click.stop="openStatusPopover($event.currentTarget, appt.id)"
                    >
                      {{ getStatusInfo(appt.status).label }}
                      <i class="fa-solid fa-chevron-down" style="font-size:11px; opacity:.85;"></i>
                    </span>
                  </td>
                  <td>{{ appt.creator }}</td>
                  <td>
                    <div class="action-dropdown">
                      <button class="action-btn" data-action-btn="1" :data-id="appt.id" @click.stop="toggleActionMenu(appt.id)">
                        <i class="fas fa-ellipsis-v"></i>
                      </button>
                      <div class="menu-pop" data-action-menu="1" :data-id="appt.id" :class="{ open: openActionMenuId === appt.id }">
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
    </div>

    <div
      class="status-pop"
      id="statusPopover"
      :class="{ open: statusPopover.open }"
      :style="{ top: statusPopover.top, left: statusPopover.left }"
    >
      <button
        v-for="option in statusPopover.options"
        :key="option.key"
        class="opt"
        @click.stop="handleStatusOptionClick(option)"
      >
        <span>{{ option.label }}</span>
        <span
          class="dot"
          :style="{ background: option.dot, boxShadow: option.active ? '0 0 0 3px rgba(15,23,42,.06)' : '' }"
        ></span>
      </button>
    </div>

    <div v-if="isModalOpen" class="backdrop" @click.self="closeModal">
      <div class="editor-modal" role="dialog" aria-modal="true">
        <div class="modal-head">
          <h4 id="modalTitle">Sửa lịch hẹn</h4>
          <button class="modal-close" type="button" @click="closeModal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="modal-body">
          <div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Khách hàng</label>
                <input id="mCustomer" v-model="modalForm.customer" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Số điện thoại</label>
                <input id="mPhone" v-model="modalForm.phone" type="text" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Ngày hẹn</label>
                <input id="mDate" v-model="modalForm.date" type="date" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Giờ hẹn</label>
                <select id="mTime" v-model="modalForm.time" class="form-select">
                  <option v-for="slot in TIME_SLOTS" :key="slot" :value="slot">{{ slot }}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">NV phụ trách</label>
                <select id="mStaff" v-model="modalForm.staff" class="form-select">
                  <option v-for="staff in STAFFS" :key="staff" :value="staff">{{ staff }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">NV tư vấn</label>
                <select id="mConsultant" v-model="modalForm.consultant" class="form-select">
                  <option v-for="consultant in CONSULTANTS" :key="consultant" :value="consultant">
                    {{ consultant }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Tình trạng (đến lịch)</label>
                <select id="mStatus" v-model="modalForm.status" class="form-select">
                  <option value="UP">Đã lên</option>
                  <option value="NOT_UP">Chưa lên</option>
                  <option value="POSTPONED">Tạm hoãn</option>
                  <option value="CANCELLED">Huỷ</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Tình trạng tư vấn</label>
                <select id="mConsultStatus" v-model="modalForm.consultStatus" class="form-select">
                  <option value="SUCCESS">Thành công</option>
                  <option value="FAIL">Thất bại</option>
                  <option value="CARE">Chăm sóc</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Phân loại khách hàng</label>
                <select id="mCustomerType" v-model="modalForm.customerType" class="form-select">
                  <option value="OWNER">Chính chủ</option>
                  <option value="BROKER">Môi giới</option>
                  <option value="RELATIVE">Người thân</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Đánh giá</label>
                <select id="mRating" v-model="modalForm.rating" class="form-select">
                  <option value="POTENTIAL">Tiềm năng</option>
                  <option value="NOT_POTENTIAL">Không tiềm năng</option>
                  <option value="CARE">Chăm sóc</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Ghi chú</label>
              <textarea id="mNote" v-model="modalForm.note" class="form-textarea"></textarea>
            </div>
          </div>

          <div class="modal-panel">
            <h5><i class="fa-solid fa-clock-rotate-left"></i>Lịch sử thay đổi</h5>
            <div class="history" id="historyList">
              <div v-if="!historyItems.length" style="font-weight:800; color:#94a3b8; font-size:12.5px;">
                Chưa có lịch sử.
              </div>
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
          <button class="btn btn-secondary" type="button" @click="closeModal">Đóng</button>
          <button class="btn btn-primary" type="button" @click="saveModal">
            <i class="fa-solid fa-floppy-disk"></i>Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.appointments-page{
  min-height:100vh;
  background:#f5f7fa;
  color:#0f172a;
  line-height:1.6;
}

*{ margin:0; padding:0; box-sizing:border-box; font-family:'Inter', sans-serif; }

.appointments-container{ min-height:100vh; }

/* Main */
.main-content{ width:100%; padding:22px; }
.header{
  display:flex; justify-content:space-between; align-items:center;
  margin-bottom:18px; gap:16px; flex-wrap:wrap;
}
.page-title h2{ font-size:22px; font-weight:800; color:#0b1220; }
.page-title p{ font-size:13px; color:#64748b; margin-top:4px; }

.search-bar{ position:relative; width:420px; max-width:100%; }
.search-bar input{
  width:100%; padding:12px 14px 12px 40px;
  border:1px solid rgba(15,23,42,.08);
  border-radius:12px; font-size:14px;
  background:#ffffff; transition:.2s ease;
}
.search-bar input:focus{ outline:none; border-color:rgba(77,124,254,.5); box-shadow: 0 0 0 3px rgba(77, 124, 254, 0.12); }
.search-icon{ position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#94a3b8; }

/* Stats */
.stats{
  display:grid; grid-template-columns: repeat(4, minmax(0,1fr));
  gap:14px; margin: 10px 0 18px;
}
.stat{
  background:#ffffff; border:1px solid rgba(15,23,42,.08);
  border-radius: 16px;
  padding:14px;
  box-shadow: 0 4px 12px rgba(0,0,0,.05);
  position:relative;
  transition:.22s ease;
}
.stat:hover{ transform: translateY(-2px); box-shadow: 0 10px 25px rgba(15,23,42,.06); }
.stat .k{ font-size:12px; color:#64748b; font-weight:600; }
.stat .v{ font-size:20px; font-weight:800; margin-top:2px; }
.stat .hint{ font-size:12px; color:#94a3b8; margin-top:2px; }
.stat .i{
  position:absolute; right:12px; top:12px;
  width:40px; height:40px; border-radius:14px;
  display:flex; align-items:center; justify-content:center;
  background:rgba(77,124,254,.10); color:#4d7cfe;
}
@media (max-width: 1100px){ .stats{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 560px){ .stats{ grid-template-columns: 1fr; } }

/* Filters */
.filters{
  display:flex;
  align-items:center;
  margin-bottom:16px;
  gap:12px;
  flex-wrap:wrap;
}

/* ✅ TẤT CẢ MẶC ĐỊNH CĂN TRÁI */
.filter-tabs,
.status-filter{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}

/* ✅ CHỈ NÚT TẠO MỚI CĂN PHẢI */
.action-buttons{
  margin-left:auto;
  display:flex;
  gap:10px;
}

.filter-tabs{ display:flex; gap:8px; flex-wrap:wrap; }
.filter-btn{
  padding:10px 14px; border:1px solid rgba(15,23,42,.08); background:#ffffff;
  border-radius:12px; font-size:13px; font-weight:600; color:#334155;
  cursor:pointer; transition:.2s ease;
}
.filter-btn:hover{ border-color:rgba(77,124,254,.35); color:#4d7cfe; }
.filter-btn.active{
  background: linear-gradient(135deg, #4d7cfe, #7c3aed);
  color:white; border-color:transparent;
  box-shadow: 0 10px 22px rgba(77,124,254,.25);
}

.status-filter{ display:flex; gap:8px; flex-wrap:wrap; }
.status-tag{
  padding:8px 12px; border-radius:999px;
  font-size:12.5px; font-weight:700; cursor:pointer;
  border:1px solid transparent;
  transition:.2s ease;
  user-select:none;
}
.status-tag.active{ box-shadow: inset 0 0 0 2px rgba(30, 41, 243, 0.1); transform: translateY(-1px); border: solid 1px #283e91
}
.status-all{ background:#f1f5f9; color:#334155; }
.status-up{ background:#e7f7ef; color:#27ae60; }
.status-not-up{ background:#fff4e6; color:#f39c12; }
.status-postponed{ background:#e3f2fd; color:#2980b9; }
.status-cancelled{ background:#ffeaea; color:#e74c3c; }

.action-buttons{ display:flex; gap:10px; flex-wrap:wrap; }
.btn{
  padding:11px 14px; border-radius:12px; font-size:13px; font-weight:700;
  cursor:pointer; display:flex; align-items:center; gap:8px;
  transition:.2s ease; border:none;
}
.btn-primary{
  background:linear-gradient(135deg, #4d7cfe, #7c3aed);
  color:white;
  box-shadow: 0 10px 22px rgba(77,124,254,.22);
}
.btn-primary:hover{ filter:brightness(.98); transform: translateY(-1px); }
.btn-secondary{
  background:#ffffff; color:#4d7cfe;
  border:1px solid rgba(77,124,254,.45);
}
.btn-secondary:hover{ background:rgba(77,124,254,.06); color: #0942cb;
  border:1px solid #0942cb;
}

/* Layout */
.appointment-container{
  display:grid; grid-template-columns: 1fr 1fr; gap:16px;
  margin-bottom:18px;
  align-items:start;
}
@media (max-width: 1100px){ .appointment-container{ grid-template-columns:1fr; } }

.stack{ display:flex; flex-direction:column; gap:16px; }

.calendar-section, .form-section, .appointments-list, .day-section{
  background:#ffffff; border-radius: 16px;
  padding:18px; box-shadow: 0 4px 12px rgba(0,0,0,.05);
  border:1px solid rgba(15,23,42,.08);
}

/* Calendar */
.calendar-header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.calendar-header h3{ font-size:16px; font-weight:800; color:#0b1220; }
.calendar-nav{ display:flex; gap:8px; }
.calendar-nav-btn{
  width:38px; height:38px; border-radius:12px; border:1px solid rgba(15,23,42,.08);
  background:#ffffff; display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:.2s ease;
}
.calendar-nav-btn:hover{ background:#f8fafc; }

.calendar-days{ display:grid; grid-template-columns:repeat(7, 1fr); gap:8px; margin-bottom:10px; }
.day-name{ text-align:center; font-weight:800; color:#94a3b8; font-size:12px; padding:6px; }

.calendar-dates{ display:grid; grid-template-columns:repeat(7, 1fr); gap:8px; }
.date{
  height:46px; display:flex; align-items:center; justify-content:center;
  border-radius:12px; cursor:pointer; transition:.2s ease;
  font-weight:800; font-size:13px; position:relative;
  border:1px solid transparent;
  user-select:none;
}
.date:hover{ background:rgba(77,124,254,.08); }
.date.current-month{ color:#0f172a; }
.date.other-month{ color:#cbd5e1; }
.date.today{ background:linear-gradient(135deg, #4d7cfe, #7c3aed); color:white; }
.date.selected{
  background:rgba(41,128,185,.10); color:#2980b9;
  border:1px solid rgba(41,128,185,.45);
  box-shadow: 0 0 0 3px rgba(41,128,185,.10);
}
.date.has-appointment::after{
  content:""; position:absolute; bottom:6px; left:50%; transform:translateX(-50%);
  width:7px; height:7px; border-radius:50%;
  background:#4d7cfe;
  box-shadow: 0 0 0 3px rgba(77,124,254,.10);
}

/* Day schedule */
.day-head{
  display:flex; justify-content:space-between; align-items:flex-start;
  gap:12px; flex-wrap:wrap;
  margin-bottom:12px;
}
.day-title{ display:flex; flex-direction:column; gap:4px; }
.day-title h4{ font-size:15px; font-weight:900; }
.day-title p{ font-size:12.5px; color:#64748b; font-weight:700; }
.day-actions{ display:flex; gap:10px; flex-wrap:wrap; }

.slots{
  display:flex; flex-direction:column; gap:10px;
  max-height: 520px;
  overflow:auto;
  padding-right:4px;
}
.slot{
  display:grid; grid-template-columns: 84px 1fr;
  gap:10px;
  align-items:stretch;
}
.slot-time{
  border:1px solid rgba(15,23,42,.08);
  border-radius:12px;
  background:#fbfdff;
  display:flex; align-items:center; justify-content:center;
  font-weight:900;
  color:#334155;
  font-size:12.5px;
  min-height:54px;
}
.slot-drop{
  border:1px dashed rgba(77,124,254,.35);
  border-radius:12px;
  background: rgba(77,124,254,.04);
  min-height:54px;
  padding:8px;
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  align-items:center;
  transition:.15s ease;
}
.slot-drop.over{
  background: rgba(77,124,254,.08);
  border-color: rgba(77,124,254,.55);
  box-shadow: 0 0 0 3px rgba(77, 124, 254, 0.12);
}
.appt-card{
  border:1px solid rgba(15,23,42,.08);
  border-radius:12px;
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(15,23,42,.06);
  padding:8px 10px;
  display:flex; gap:10px; align-items:flex-start;
  cursor:grab;
  user-select:none;
  min-width: 260px;
}
.appt-card.disabled{
  opacity:.6;
  cursor:not-allowed;
}
.appt-card:active{ cursor:grabbing; }
.appt-badge{ width:10px; height:10px; border-radius:50%; margin-top:6px; flex:0 0 auto; }
.appt-main{ display:flex; flex-direction:column; gap:2px; }
.appt-main .n{ font-weight:900; font-size:13px; }
.appt-main .m{ font-weight:800; font-size:12px; color:#64748b; }
.appt-meta{ font-weight:900; font-size:12px; color:#334155; }
.appt-sub{ font-weight:800; font-size:12px; color:#64748b; }
.appt-cta{ margin-left:auto; display:flex; gap:6px; }
.mini-btn{
  width:34px; height:34px;
  border-radius:12px;
  border:1px solid rgba(15,23,42,.08);
  background:#ffffff;
  cursor:pointer;
  transition:.15s ease;
  display:flex; align-items:center; justify-content:center;
  color: #ab0c23;
}
.mini-btn:hover{ background:#f8fafc; color:#4d7cfe; border-color: rgba(77,124,254,.35); }

/* Form */
.form-section h3{ font-size:16px; font-weight:800; margin-bottom:12px; }
.form-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
@media (max-width: 560px){ .form-grid{ grid-template-columns:1fr; } }

.form-group{ margin-bottom:12px; }
.form-label{ display:block; margin-bottom:6px; font-weight:800; color:#334155; font-size:12.5px; }
.form-input, .form-select, .form-textarea{
  width:100%; padding:11px 12px; border:1px solid rgba(15,23,42,.08);
  border-radius:12px; font-size:14px; transition:.2s ease; background:#ffffff;
}
.form-textarea{ min-height:90px; resize:vertical; }
.form-input:focus, .form-select:focus, .form-textarea:focus{ outline:none; border-color:rgba(77,124,254,.5); box-shadow: 0 0 0 3px rgba(77, 124, 254, 0.12); }

.time-selection{ display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; }
@media (max-width: 768px){ .time-selection{ grid-template-columns:repeat(2,1fr); } }
.time-option{
  padding:10px; text-align:center; border:1px solid rgba(15,23,42,.08);
  border-radius:12px; cursor:pointer; transition:.18s ease; font-weight:800; font-size:13px;
  user-select:none;
}
.time-option:hover{ border-color:rgba(77,124,254,.45); color:#4d7cfe; }
.time-option.selected{
  background:linear-gradient(135deg, #4d7cfe, #7c3aed);
  color:white; border-color:transparent;
  box-shadow: 0 10px 20px rgba(77,124,254,.18);
}

.status-selection{ display:grid; grid-template-columns:repeat(2, 1fr); gap:10px; }
.status-option{
  padding:12px; text-align:center; border-radius:12px;
  cursor:pointer; transition:.18s ease; font-weight:900;
  border:2px solid transparent; user-select:none; font-size:13px;
}
.status-option.selected{
  border: 2px solid rgba(18, 86, 246, 0.35) !important;
}
.status-up-option{ background:#e7f7ef; color:#27ae60; }
.status-not-up-option{ background:#fff4e6; color:#f39c12; }
.status-postponed-option{ background:#e3f2fd; color:#2980b9; }
.status-cancelled-option{ background:#ffeaea; color:#e74c3c; }

/* Consulting status */
.consult-selection{ display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; }
@media (max-width: 560px){ .consult-selection{ grid-template-columns:1fr; } }
.consult-option{
  padding:12px; text-align:center; border-radius:12px;
  cursor:pointer; transition:.18s ease; font-weight:900;
  border:2px solid transparent; user-select:none; font-size:13px;
}
.consult-option.selected{ border: 2px solid rgba(18, 86, 246, 0.35) !important; }
.consult-success{ background:#e7f7ef; color:#27ae60; }
.consult-fail{ background:#ffeaea; color:#e74c3c; }
.consult-care{ background:#e3f2fd; color:#2980b9; }

.form-actions{ display:flex; gap:10px; margin-top:8px; }
.form-actions .btn{ flex:1; justify-content:center; }

/* Table */
.appointments-list .list-header{
  display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; gap:10px; flex-wrap:wrap;
}
.appointments-list h3{ font-size:16px; font-weight:900; }
.pill-muted{
  display:inline-flex; align-items:center; gap:8px;
  padding:8px 10px; border-radius:999px;
  background:#f1f5f9; color:#334155; font-weight:900; font-size:12px;
  border:1px solid rgba(15,23,42,.06);
}

.table-container{ overflow-x:auto; border-radius:12px; border:1px solid rgba(15,23,42,.08); }
table{ width:100%; border-collapse:collapse; min-width:1320px; background:#ffffff; }
th{
  text-align:left; padding:14px; border-bottom:1px solid rgba(15,23,42,.08);
  font-weight:900; color:#334155; font-size:12.5px;
  background: #fbfdff;
  position:sticky; top:0; z-index:1;
  white-space:nowrap;
}
td{ padding:14px; border-bottom:1px solid rgba(15,23,42,.06); font-size:13.5px; color:#0f172a; vertical-align:middle; }
tr:hover td{ background: rgba(77,124,254,.03); }

.customer-info{ display:flex; align-items:center; gap:10px; }
.customer-avatar{
  width:40px; height:40px; border-radius:50%;
  background:#eef2ff; color:#3730a3;
  display:flex; align-items:center; justify-content:center;
  font-weight:900;
  border:1px solid rgba(99,102,241,.18);
}
.customer-name{ font-weight:900; margin-bottom:2px; }
.customer-phone{ font-size:12px; color:#64748b; font-weight:700; }

.status-badge{
  padding:7px 12px; border-radius:999px;
  font-size:12px; font-weight:900;
  display:inline-flex; align-items:center; gap:8px;
  cursor:pointer; user-select:none;
  border:1px solid rgba(15,23,42,.06);
  transition:.15s ease;
  white-space:nowrap;
}
.status-badge:hover{ transform: translateY(-1px); box-shadow: 0 10px 18px rgba(15,23,42,.06); }

.chip{
  display:inline-flex; align-items:center; gap:8px;
  padding:6px 10px; border-radius:999px;
  font-weight:900; font-size:12px;
  border:1px solid rgba(15,23,42,.06);
  white-space:nowrap;
}
.chip-owner{ background:#f1f5f9; color:#334155; }
.chip-broker{ background:#fff7ed; color:#9a3412; }
.chip-relative{ background:#eef2ff; color:#3730a3; }

.chip-potential{ background:#e7f7ef; color:#27ae60; }
.chip-not-potential{ background:#ffeaea; color:#e74c3c; }
.chip-care{ background:#e3f2fd; color:#2980b9; }

.consult-badge{
  padding:7px 12px; border-radius:999px;
  font-size:12px; font-weight:900;
  display:inline-flex; align-items:center; gap:8px;
  border:1px solid rgba(15,23,42,.06);
  white-space:nowrap;
}
.consult-badge i{ font-size:11px; opacity:.9; }
.consult-success-badge{ background:#e7f7ef; color:#27ae60; }
.consult-fail-badge{ background:#ffeaea; color:#e74c3c; }
.consult-care-badge{ background:#e3f2fd; color:#2980b9; }

/* Action menu */
.action-dropdown{ position:relative; }
.action-btn{
  width:38px; height:38px; border-radius:12px; border:1px solid rgba(15,23,42,.08);
  background:#ffffff; display:flex; align-items:center; justify-content:center;
  cursor:pointer; transition:.18s ease;
}
.action-btn:hover{ background:#f8fafc; }
.menu-pop{
  position:absolute; right:0; top:42px;
  min-width:200px;
  background:#ffffff;
  border:1px solid rgba(15,23,42,.08);
  border-radius:14px;
  box-shadow: 0 10px 25px rgba(15,23,42,.06);
  padding:8px;
  display:none;
  z-index:50;
  animation: pop .12s ease-out;
}
.menu-pop.open{ display:block; background-color: rgb(253, 253, 253)
}
@keyframes pop{ from{ transform: translateY(-4px); opacity:.7; } to{ transform: translateY(0); opacity:1; } }
.menu-pop button{
  width:100%; text-align:left;
  border:none; background:transparent;
  padding:10px 10px;
  border-radius:12px;
  cursor:pointer;
  font-weight:800;
  color:#0f172a;
  display:flex; align-items:center; gap:10px;
}
.menu-pop button:hover{ background:rgba(77,124,254,.08); color:#4d7cfe; }

/* Quick status popover */
.status-pop{
  position:absolute;
  background:#ffffff;
  border:1px solid rgba(15,23,42,.08);
  border-radius:14px;
  box-shadow: 0 10px 25px rgba(15,23,42,.06);
  padding:8px;
  display:none;
  z-index:60;
  min-width:210px;
  animation: pop .12s ease-out;
}
.status-pop.open{ display:block }
.status-pop .opt{
  width:100%;
  border:none;
  background:transparent;
  padding:10px 10px;
  border-radius:12px;
  cursor:pointer;
  font-weight:900;
  display:flex; align-items:center; justify-content:space-between;
}
.status-pop .opt:hover{ background:#f8fafc; }
.dot{ width:10px; height:10px; border-radius:50%; display:inline-block; margin-left:10px; }

/* Modal */
.backdrop{
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 24px;
}

.editor-modal{
  width: min(980px, 95vw);
  background: #f8fafc;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 48px);
  overflow: hidden;

  /* ❌ BỎ TOÀN BỘ CÁI NÀY */
  /* top: 50%; */
  /* left: 50%; */
  /* transform: translate(-50%, -50%); */

  /* animation OK */
  animation: modalIn .16s ease-out;
}


@keyframes modalIn{ from{ transform: translateY(8px); opacity:.75; } to{ transform: translateY(0); opacity:1; } }

.modal-head{
  padding:16px;
  display:flex; justify-content:space-between; align-items:center;
  border-bottom:1px solid rgba(15,23,42,.08);
  background: linear-gradient(180deg, #fbfdff, #ffffff);
}
.modal-head h4{ font-size:15px; font-weight:900; }
.modal-close{
  width:40px; height:40px;
  border-radius:12px; border:1px solid rgba(15,23,42,.08);
  background:#ffffff; cursor:pointer;
}
.modal-body{ padding:16px; display:grid; grid-template-columns: 1.15fr .85fr; gap:14px; }
@media (max-width: 920px){ .modal-body{ grid-template-columns:1fr; } }

.modal-panel{
  border:1px solid rgba(15,23,42,.08);
  border-radius:16px;
  padding:12px;
  background:#fbfdff;
}
.modal-panel h5{
  font-size:13px; font-weight:900; margin-bottom:8px;
  display:flex; align-items:center; gap:8px;
}
.history{
  display:flex; flex-direction:column; gap:8px;
  max-height: 380px;
  overflow:auto;
  padding-right:4px;
}
.h-item{
  border:1px solid rgba(15,23,42,.08);
  border-radius:14px;
  padding:10px;
  background:#ffffff;
  box-shadow: 0 6px 14px rgba(15,23,42,.05);
}
.h-top{
  display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;
  font-weight:900;
  font-size:12px;
  color:#334155;
  margin-bottom:4px;
}
.h-desc{
  font-size:12.5px;
  color:#64748b;
  font-weight:700;
  line-height:1.4;
}

.modal-foot{
  padding:14px 16px;
  border-top:1px solid rgba(15,23,42,.08);
  display:flex; gap:10px; justify-content:flex-end;
  background:#fbfdff;
}

/* Toast */
.toast-wrap{
  position:fixed;
  right:18px;
  top:18px;
  display:flex;
  flex-direction:column;
  gap:10px;
  z-index:999;
  pointer-events:none;
}
.toast{
  pointer-events:auto;
  min-width: 280px;
  max-width: 420px;
  background: #ffffff;
  border:1px solid rgba(15,23,42,.08);
  border-radius:16px;
  box-shadow: 0 10px 25px rgba(15,23,42,.06);
  padding:12px 12px;
  display:flex;
  gap:10px;
  align-items:flex-start;
  animation: pop .12s ease-out;
}
.toast .ico{
  width:36px; height:36px;
  border-radius:14px;
  display:flex; align-items:center; justify-content:center;
  background: rgba(77,124,254,.10);
  color: #4d7cfe;
  flex:0 0 auto;
}
.toast .t{ display:flex; flex-direction:column; gap:2px; flex:1; }
.toast .t .a{ font-weight:900; font-size:13px; color:#0f172a; }
.toast .t .b{ font-weight:700; font-size:12.5px; color:#64748b; }
.toast .x{
  width:34px; height:34px;
  border-radius:12px;
  border:1px solid rgba(15,23,42,.08);
  background:#ffffff;
  cursor:pointer;
  display:flex; align-items:center; justify-content:center;
}

/* Responsive */
@media (max-width: 768px){
  .filters{ align-items:flex-start; }
  .search-bar{ width:100%; }
}
</style>
