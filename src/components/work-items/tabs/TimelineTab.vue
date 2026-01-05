<template>
  <div class="px-4 py-4">
    <!-- Header -->
    <div class="row align-items-center mb-4 ms-2">
      <!-- Cột 1 -->
      <div class="col-lg-2 col-md-6 col-12">
        <h5 class="mb-0 fw-medium text-dark-subtle">
          <i class="fa-solid fa-diagram-project me-2 text-primary"></i>
          Thông tin chung
        </h5>
      </div>

      <!-- Cột 2 -->
      <div class="col-lg-6 col-md-6 col-12 text-center">
        <div class="card-header bg-light border-0 fw-medium small text-dark-subtle" style="font-size: 22px">
          <i class="fa-solid fa-clock-rotate-left me-2 text-primary"></i> Nhật ký hoạt động
        </div>
      </div>

      <!-- Cột 3 -->
      <div class="col-lg-4 col-12 text-lg-end text-start mt-2 mt-lg-0">
        <div class="align-items-end d-fle flex-wrap gap-2 mt-1">
          <button
              v-for="btn in allowedActions"
              :key="btn.key"
              class="btn btn-sm shadow-sm  me-2"
              :class="btn.class"
              @click="btn.onClick"
          >
            <i :class="btn.icon" class=""></i>{{ btn.text }}
          </button>
          <button v-if="authStore.listAuthority.includes('PROJECT_UPDATE')" class="btn btn-primary btn-sm shadow-sm px-3" @click="onEdit">
            <i class="fa-solid fa-pen-to-square me-2"></i> Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
    <!-- Thông tin chung -->
    <div class="row g-4 small text-secondary">
      <!-- Cột trái -->
      <div class="col-12 col-lg-4">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body py-3">
            <dl class="row mb-0 label-slim">
              <dt class="col-5">Tên dự án</dt>
              <dd class="col-7 text-dark">{{ project.name }}</dd>
              <dt class="col-5">Ngày tạo</dt>
              <dd class="col-7">{{ project.createdAt }}</dd>
              <dt class="col-5">Bắt đầu dự kiến</dt>
              <dd class="col-7">{{ project.expectedStartDate }}</dd>
              <dt class="col-5">Bắt đầu thực tế</dt>
              <dd class="col-7">{{ project.actualStartDate }}</dd>
              <dt class="col-5">Kết thúc dự kiến</dt>
              <dd class="col-7">{{ project.expectedEnd }}</dd>
              <dt class="col-5">Kết thúc thực tế</dt>
              <dd class="col-7">{{ project.actualEnd }}</dd>
              <dt class="col-5">Giá tiền</dt>
              <dd class="col-7 fw-semibold text-success">{{ formatVND(project.price) }}</dd>
              <dt class="col-5">Điểm effort</dt>
              <dd class="col-7 fw-semibold text-success">{{ project.effort }}</dd>
              <dt class="col-5">Ưu tiên</dt>
              <dd class="col-7">
                <i
                    v-if="project.priority"
                    class="fa-solid fa-flag text-warning fs-5"
                    title="Dự án ưu tiên"
                    style="filter: drop-shadow(0 0 2px #ffc107);"
                ></i>
                <i
                    v-else
                    class="fa-regular fa-flag text-muted fs-5"
                    title="Không ưu tiên"
                ></i>
              </dd>


              <dt class="col-5 align-self-start">Trạng thái</dt>
              <dd class="col-7">
                <div class="d-flex flex-column gap-2">
                  <!-- Hàng 1: badge -->
                  <div>
                    <span :class="['badge rounded-pill px-3 py-2', statusPillClass]">{{ statusLabel }}</span>
                  </div>

                  <!-- Hàng 2: nút hành động -->
                </div>
              </dd>



              <dt class="col-5">Người tạo</dt>
              <dd class="col-7 text-dark">{{ project.createdBy }}</dd>
              <dt class="col-5">Loại</dt>
              <dd class="col-7 d-flex align-items-center gap-2">
                <template v-if="project.type">
                  <i :class="project.type.icon" class="fs-6" :style="{ color: project.type.color }"></i>
                  <span>{{ project.type.name }}</span>
                </template>
                <span v-else>Không xác định</span>
              </dd>
              <dt class="col-5">SĐT KH</dt>
              <dd class="col-7">{{ project.customerPhone }}</dd>
              <dt class="col-5">Khách hàng</dt>
              <dd class="col-7">{{ project.customerName }}</dd>
              <dt class="col-5">Địa chỉ</dt>
              <dd class="col-7">{{ project.address }}</dd>
              <dt class="col-5">Dịch vụ</dt>
              <dd class="col-7">{{ project.serviceType }}</dd>
              <dt class="col-5 mb-2">Mô tả: </dt>
              <dd class="col-12 text-dark">
                <!-- Trường mô tả hiển thị nội dung HTML từ Quill Editor -->
                <div
                    class="mb-0 text-wrap text-break description-view"
                    v-html="project.description"
                ></div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Cột phải - Nhật ký -->
      <div class="col-12 col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-0 activity-log">
            <div class="activity-log-table">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                <tr class="text-secondary">
                  <th style="width: 150px;">Thời gian</th>
                  <th style="width: 160px;">Người thực hiện</th>
                  <th>Nội dung</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(log, idx) in logs" :key="idx" :class="{ 'latest-log': idx === 0 }">
                  <td class="text-nowrap">{{ log.time }}</td>
                  <td>{{ log.actor }}</td>
                  <td>{{ log.content }}</td>
                </tr>
                <tr v-if="!logs.length">
                  <td colspan="3" class="text-muted fst-italic text-center py-3">Chưa có nhật ký</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr class="my-5" />

    <!-- Tham gia dự án -->
    <section>
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h6 class="fw-medium text-dark-subtle mb-0">
          <i class="fa-solid fa-people-group me-2 text-primary"></i> Tham gia dự án
        </h6>
        <div class="btn-group btn-group-sm" role="group">
          <input type="radio" class="btn-check" id="view-people" value="people" v-model="memberView" />
          <label class="btn btn-outline-primary" for="view-people"><i class="fa-regular fa-user"></i> Người</label>

          <input type="radio" class="btn-check" id="view-dept" value="department" v-model="memberView" />
          <label class="btn btn-outline-primary" for="view-dept"><i class="fa-regular fa-building"></i> Phòng</label>

          <input type="radio" class="btn-check" id="view-team" value="team" v-model="memberView" />
          <label class="btn btn-outline-primary" for="view-team"><i class="fa-solid fa-users-between-lines"></i> Team</label>
        </div>
      </div>

      <!-- View theo người -->
      <div v-if="memberView === 'people'" class="border rounded-4 p-3 bg-white shadow-sm small">
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          <div v-for="m in membersFlat" :key="m.id" class="col">
            <div class="d-flex align-items-center border rounded-4 p-2 shadow-sm bg-light-subtle">
              <img :src="m.avatar" class="rounded-circle border" style="width: 40px; height: 40px; object-fit: cover;" />
              <div class="ms-3 flex-grow-1">
                <div class="fw-medium text-dark">{{ m.name }}</div>
                <div class="text-muted small">{{ m.position }} • {{ m.roleLabel }} • {{ m.department }} • {{ m.team }}</div>
              </div>
              <span class="badge bg-light text-secondary border">{{ m.type }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- View theo phòng ban -->
      <div v-else-if="memberView === 'department'" class="border rounded-4 p-3 bg-white shadow-sm small">
        <div v-for="dept in membersByDepartment" :key="dept.department" class="mb-3">
          <div
              class="d-flex align-items-center justify-content-between bg-light-subtle border rounded-3 p-2"
              @click="toggleDepartment(dept.department)"
              style="cursor: pointer"
          >
            <div class="d-flex align-items-center gap-2">
              <img :src="dept.avatar" class="rounded-circle border" style="width: 36px; height: 36px; object-fit: cover;" />
              <h6 class="fw-semibold text-primary mb-0">
                {{ dept.department }} <small class="text-muted">({{ dept.members.length }} người)</small>
              </h6>
            </div>
            <i :class="['fa-solid', dept.expanded ? 'fa-chevron-up' : 'fa-chevron-down', 'text-secondary']"></i>
          </div>
          <transition name="fade">
            <div v-show="dept.expanded" class="mt-3 ps-3">
              <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                <div v-for="m in dept.members" :key="m.id" class="col">
                  <div class="d-flex align-items-center border rounded-4 p-2 shadow-sm bg-white">
                    <img :src="m.avatar" class="rounded-circle border" style="width: 36px; height: 36px; object-fit: cover;" />
                    <div class="ms-3 flex-grow-1">
                      <div class="fw-medium text-dark">{{ m.name }}</div>
                      <div class="text-muted small">{{ m.position }} • {{ m.roleLabel }} • {{ m.email }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- View theo team -->
      <div v-else class="border rounded-4 p-3 bg-white shadow-sm small">
        <div v-for="team in membersByTeam" :key="team.key" class="mb-3">
          <div
              class="d-flex align-items-center justify-content-between bg-light-subtle border rounded-3 p-2"
              @click="toggleTeam(team.key)"
              style="cursor: pointer"
          >
            <div class="d-flex align-items-center gap-2">
              <img :src="team.avatar" class="rounded-circle border" style="width: 36px; height: 36px; object-fit: cover;" />
              <h6 class="fw-semibold text-primary mb-0">
                {{ team.name }} <small class="text-muted">({{ team.members.length }} người)</small>
              </h6>
            </div>
            <i :class="['fa-solid', team.expanded ? 'fa-chevron-up' : 'fa-chevron-down', 'text-secondary']"></i>
          </div>
          <transition name="fade">
            <div v-show="team.expanded" class="mt-3 ps-3">
              <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                <div v-for="m in team.members" :key="m.id" class="col">
                  <div class="d-flex align-items-center border rounded-4 p-2 shadow-sm bg-white">
                    <img :src="m.avatar" class="rounded-circle border" style="width: 36px; height: 36px; object-fit: cover;" />
                    <div class="ms-3 flex-grow-1">
                      <div class="fw-medium text-dark">{{ m.name }}</div>
                      <div class="text-muted small">{{ m.position }} • {{ m.role }} • {{ m.email }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </section>

    <hr class="my-5" />

    <!-- File đính kèm -->
    <section>
      <h6 class="fw-medium text-dark-subtle mb-3">
        <i class="fa-solid fa-paperclip me-2 text-primary"></i> Tệp đính kèm
      </h6>
      <div class="table-responsive border rounded-4 shadow-sm bg-white small">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light text-secondary">
          <tr>
            <th style="width: 40px;">#</th>
            <th>Tên file</th>
            <th>Người upload</th>
            <th>Ngày thêm</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(f, i) in files" :key="f.id ?? i">
            <td>{{ i + 1 }}</td>
            <td
                @click.stop="downloadFile(f.id, f.name)"
                class="cursor-pointer text-primary fw-medium"
            >
              <i class="fa-solid fa-file-word me-2"></i>{{ f.name }}
            </td>
            <td>{{ f.uploader || '-' }}</td>
            <td>{{ formatDateTime(f.addedAt) }}</td>
          </tr>
          <tr v-if="!files.length">
            <td colspan="4" class="text-muted text-center py-3 fst-italic">Chưa có tệp đính kèm</td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import api from '../../../api/api.js'
import { fetchPrivateDownloadUrl } from '../../../api/fileApi.js'
import { useRoute } from 'vue-router'
import { showError } from "../../../assets/js/alertService.js";
import { eventMatchesProject, isProjectMetaEvent, isTimelineEvent, isWorkItemEvent, isCommentEvent, isMemberEvent } from '../../../utils/socketEventUtils.js'
const authStore = useAuthStore()
const info = authStore.userInfo

const props = defineProps({
  projectId: {
    type: Number,
    default: null,
  },
  socketEvent: {
    type: Object,
    default: null,
  },
});

const STATUS_LABEL = {
  CHUA_BAT_DAU: 'Mới khởi tạo',
  DANG_TRIEN_KHAI: 'Đang triển khai',
  TAM_NGUNG: 'Tạm ngừng',
  HOAN_THANH: 'Hoàn thành',
  HUY_BO: 'Hủy bỏ'
}

const ROLE_LABEL = {
  OWNER: 'Quản lý',
  EDITER: 'Biên tập',
  VIEWER: 'Quan sát'
}

const ASSET_BASE_URL = ' https://s3.cloudfly.vn/thg-storage-dev/uploads-public/'
const DEFAULT_MEMBER_AVATAR = 'https://placehold.co/40x40?text=--'
const DEFAULT_DEPARTMENT_AVATAR = 'https://placehold.co/36x36?text=PB'
const DEFAULT_TEAM_AVATAR = 'https://placehold.co/36x36?text=TM'

const route = useRoute()
const effectiveProjectId = computed(() => props.projectId ?? Number(route.params.projectId) ?? null)

const formatDate = (value, fallback = 'Chưa cập nhật') => {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

const formatDateTime = (value, fallback = 'Chưa cập nhật') => {
  if (!value) return fallback
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return fallback
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

const formatVND = (n) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(n ?? 0))

const resolveAsset = (path, fallback) => {
  if (!path) return fallback
  if (/^https?:\/\//i.test(path)) return path
  return `${ASSET_BASE_URL}${path}`
}

const project = reactive({
  name: '',
  createdAt: 'Chưa cập nhật',
  description: '',
  effort: 0,
  priority: false,
  expectedStartDate: 'Chưa cập nhật',
  actualStartDate: 'Chưa cập nhật',
  expectedEnd: 'Chưa cập nhật',
  actualEnd: 'Chưa cập nhật',
  price: 0,
  status: 'CHUA_BAT_DAU',
  createdBy: '',
  type: null,
  customerPhone: 'Chưa cập nhật',
  customerName: 'Chưa cập nhật',
  address: 'Chưa cập nhật',
  serviceType: 'Chưa cập nhật'
})

const logs = ref([])
const files = ref([])
const membersRaw = ref([])
const memberView = ref('people')

const departmentExpansion = reactive({})
const teamExpansion = reactive({})

const membersFlat = computed(() => {
  return (membersRaw.value ?? []).map((member, memberIndex) => {
    const teams = (member.team ?? []).map((team, idx) => {
      const name = team?.name?.trim() || 'Chưa đặt tên'
      const key = team?.id != null ? `team-${team.id}` : `team-${memberIndex}-${idx}`
      return {
        id: team?.id ?? `${memberIndex}-${idx}`,
        key,
        name,
        avatar: resolveAsset(team?.avatar, DEFAULT_TEAM_AVATAR)
      }
    })

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      role: member.role,
      roleLabel: ROLE_LABEL[member.role] ?? member.role ?? 'Không rõ',
      position: member.position ?? 'Không rõ',
      department: member.department?.departmentName ?? 'Chưa cập nhật',
      departmentAvatar: resolveAsset(member.department?.profileImage, DEFAULT_DEPARTMENT_AVATAR),
      team: teams.length ? teams.map((t) => t.name).join(', ') : 'Chưa có team',
      teams,
      type: member.role ?? 'Không rõ',
      avatar: resolveAsset(member.avatar, DEFAULT_MEMBER_AVATAR)
    }
  })
})

const membersByDepartment = computed(() => {
  const map = new Map()
  membersFlat.value.forEach((member) => {
    const key = member.department
    if (!map.has(key)) {
      map.set(key, {
        department: key,
        avatar: member.departmentAvatar,
        members: []
      })
      if (!(key in departmentExpansion)) {
        departmentExpansion[key] = true
      }
    }
    map.get(key).members.push(member)
  })
  return Array.from(map.values())
      .filter((dept) => dept.members.length >= 2) // ✅ chỉ lấy phòng có >= 2 người
      .map((dept) => ({
        ...dept,
        expanded: departmentExpansion[dept.department]
      }));
});

const membersByTeam = computed(() => {
  const map = new Map()
  membersFlat.value.forEach((member) => {
    const memberInfo = {
      id: member.id,
      name: member.name,
      position: member.position,
      role: member.roleLabel,
      email: member.email,
      avatar: member.avatar
    }

    if (!member.teams.length) {
      const key = 'team-unassigned'
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: 'Chưa có team',
          avatar: DEFAULT_TEAM_AVATAR,
          members: []
        })
        if (!(key in teamExpansion)) {
          teamExpansion[key] = true
        }
      }
      map.get(key).members.push(memberInfo)
      return
    }

    member.teams.forEach((team) => {
      if (!map.has(team.key)) {
        map.set(team.key, {
          key: team.key,
          name: team.name,
          avatar: team.avatar,
          members: []
        })
        if (!(team.key in teamExpansion)) {
          teamExpansion[team.key] = true
        }
      }
      map.get(team.key).members.push(memberInfo)
    })
  })

  return Array.from(map.values())
      .filter((team) => team.members.length >= 2) // ✅ chỉ lấy team có >= 2 người
      .map((team) => ({
        ...team,
        expanded: teamExpansion[team.key]
      }));
});

const statusLabel = computed(() => STATUS_LABEL[project.status] ?? project.status)

const statusPillClass = computed(() => {
  switch (project.status) {
    case 'CHUA_BAT_DAU':
      return 'bg-secondary text-white'
    case 'DANG_TRIEN_KHAI':
      return 'bg-info text-dark'
    case 'TAM_NGUNG':
      return 'bg-warning text-dark'
    case 'HOAN_THANH':
      return 'bg-success text-white'
    case 'HUY_BO':
      return 'bg-danger text-white'
    default:
      return 'bg-light text-dark'
  }
})

const allowedActions = computed(() => {
  if (project.status === 'CHUA_BAT_DAU') {
    return [
      {
        key: 'run',
        text: 'Khởi động',
        class: 'btn-success',
        icon: 'fa-solid fa-play',
        onClick: () => (updateStatus('DANG_TRIEN_KHAI'))
      },
      {
        key: 'cancel',
        text: 'Hủy bỏ',
        class: 'btn-outline-danger',
        icon: 'fa-solid fa-xmark',
        onClick: () => (updateStatus('HUY_BO'))
      }
    ]
  }
  if (project.status === 'DANG_TRIEN_KHAI') {
    return [
      {
        key: 'pause',
        text: 'Tạm dừng',
        class: 'btn-outline-warning',
        icon: 'fa-solid fa-pause',
        onClick: () => (updateStatus('TAM_NGUNG'))
      },
      {
        key: 'cancel',
        text: 'Hủy bỏ',
        class: 'btn-outline-danger',
        icon: 'fa-solid fa-xmark',
        onClick: () => updateStatus('HUY_BO')
      }
      ,{
        key: 'done',
        text: 'Hoàn thành',
        class: 'btn-success',
        icon: 'fa-solid fa-check',
        onClick: () => (updateStatus('HOAN_THANH'))
      }
    ]
  }
  if (project.status === 'TAM_NGUNG') {
    return [
      {
        key: 'resume',
        text: 'Tiếp tục triển khai',
        class: 'btn-success',
        icon: 'fa-solid fa-play',
        onClick: () => updateStatus('DANG_TRIEN_KHAI')
      },
      {
        key: 'cancel',
        text: 'Hủy bỏ',
        class: 'btn-outline-danger',
        icon: 'fa-solid fa-xmark',
        onClick: () => updateStatus('HUY_BO')
      }
    ]
  }
  return []
})

const toggleDepartment = (department) => {
  departmentExpansion[department] = !departmentExpansion[department]
}

const toggleTeam = (teamKey) => {
  teamExpansion[teamKey] = !teamExpansion[teamKey]
}

import { useRouter } from 'vue-router'
const router = useRouter()
const onEdit = () => {
  if (effectiveProjectId.value) {
    router.push(`/-thg/du-an/cap-nhat/${effectiveProjectId.value}`)
  } else {
    router.push('/-thg/du-an/cap-nhat')
  }
}

const resetExpansionStates = () => {
  Object.keys(departmentExpansion).forEach((key) => delete departmentExpansion[key])
  Object.keys(teamExpansion).forEach((key) => delete teamExpansion[key])
}

const applyProjectData = (data) => {
  const customer = data?.customers?.[0] ?? {}
  project.name = data?.name ?? ''
  project.createdAt = formatDate(data?.createdAt)
  project.expectedStartDate = formatDate(data?.expectedStartDate)
  project.actualStartDate = formatDate(data?.actualStartDate)
  project.expectedEnd = formatDate(data?.expectedEnd)
  project.actualEnd = data?.actualEnd ? formatDate(data.actualEnd) : 'Chưa cập nhật'
  project.price = data?.price ?? 0
  project.status = data?.status ?? 'CHUA_BAT_DAU'
  project.createdBy = data?.createdBy ?? ''
  project.type = data?.type ?? null
  project.customerPhone = customer?.customerPhone ?? 'Chưa cập nhật'
  project.customerName = customer?.customerName ?? 'Chưa cập nhật'
  project.address = customer?.address ?? 'Chưa cập nhật'
  project.serviceType = data?.serviceType ?? 'Chưa cập nhật'
  project.description = data?.description ?? 'Không có mô tả'
  project.priority = data?.priority ?? false
  project.effort = data.effort ?? 0

  logs.value = (data?.logs ?? [])
      .slice()
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .map((log) => ({
        time: formatDateTime(log.time, 'Không xác định'),
        actor: log?.actor ?? 'Không rõ',
        content: log?.content ?? 'Không có nội dung'
      }))

  files.value = (data?.files ?? []).map((file, index) => ({
    id: file?.id ?? `file-${index}`,
    name: file?.name ?? 'Không xác định',
    uploader: file?.uploader ?? 'Chưa rõ',
    addedAt: formatDateTime(file?.addedAt, 'Chưa cập nhật')
  }))

  resetExpansionStates()
  membersRaw.value = data?.members ?? []
}

async function getProject(projectId) {
  try {
    const res = await api.get('/admin.thg/project/detail', {
      params: { projectId },
      withCredentials: true
    })
    if (res?.data) {
      applyProjectData(res.data)
      return res.data
    }
  } catch (err) {
    console.error('❌ Lỗi khi lấy chi tiết dự án:', err)
  }
  return null
}

onMounted(async () => {
  if (effectiveProjectId.value) {
    await getProject(effectiveProjectId.value)
  }
})

async function downloadFile(fileId, fileName1) {
  try {
    // 🔹 Bước 1: user click → mở dialog ngay
    const handle = await window.showSaveFilePicker({
      suggestedName: fileName1 || "downloaded_file",
      types: [
        {
          description: "Tài liệu văn phòng",
          accept: {
            "application/msword": [".doc", ".docx"],
            "application/vnd.ms-excel": [".xls", ".xlsx"],
            "application/vnd.ms-powerpoint": [".ppt", ".pptx"],
            "application/pdf": [".pdf"],
            "text/plain": [".txt"],
          },
        },
        {
          description: "Hình ảnh & đồ họa",
          accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg", ".webp"],
          },
        },
        {
          description: "Tệp nén & dữ liệu",
          accept: {
            "application/zip": [".zip"],
            "application/x-rar-compressed": [".rar"],
            "application/json": [".json"],
            "text/csv": [".csv"],
          },
        },
        {
          description: "Tất cả các loại tệp",
          accept: { "*/*": [] }, // ✅ Không để ".*"
        },
      ],
    });

    const downloadUrl = await fetchPrivateDownloadUrl(fileId)
    if (!downloadUrl) throw new Error("Không lấy được link tải")

    const response = await fetch(downloadUrl)
    if (!response.ok) throw new Error("Không thể tải dữ liệu")

    // 🔹 Bước 3: ghi dữ liệu vào file đã chọn
    const writable = await handle.createWritable();
    await writable.write(await response.blob());
    await writable.close();


  } catch (error) {
    console.error("❌ Lỗi khi tải file:", error);
    if (error.name === "AbortError") {

    } else {
      showError("Không thể tải file. Vui lòng thử lại.");
    }
  }
}

import { updateAlertSuccess, showLoading } from "../../../assets/js/alertService.js";
import {useAuthStore} from "../../../stores/authStore.js";

async function updateStatus(newStatus) {
  try {
    const formData = new FormData();
    formData.append("newStatus", newStatus);

    if (!effectiveProjectId.value) return;
    const res = await showLoading(
        api.post(
            `/admin.thg/project/update_status/${effectiveProjectId.value}`,
            formData,
            { withCredentials: true }
        )
    );
    applyProjectData(res.data)

    updateAlertSuccess("Cập nhật trạng thái dự án thành công");
  } catch (e) {
    console.error(e);
  }
}


watch(
    () => props.socketEvent,
    async (event) => {
      if (!event) return;
      if (!eventMatchesProject(event, effectiveProjectId.value)) return;
      if (
          isProjectMetaEvent(event) ||
          isTimelineEvent(event) ||
          isWorkItemEvent(event) ||
          isCommentEvent(event) ||
          isMemberEvent(event)
      ) {
        if (effectiveProjectId.value) {
          await getProject(effectiveProjectId.value);
        }
      }
    }
);

defineExpose({
  reloadProject: async () => {
    if (effectiveProjectId.value) {
      await getProject(effectiveProjectId.value);
    }
  },
});


</script>

<style scoped>
.text-dark-subtle {
  color: #3f3f3f !important;
}

.text-secondary {
  color: #555 !important;
}

.label-slim dt {
  font-weight: 400;
  color: #444;
}

.label-slim dd {
  color: #222;
}

.activity-log {
  font-size: 0.95rem;
  color: #333;
}

.activity-log-table {
  max-height: 570px;
  overflow-y: auto;
}

.activity-log-table table {
  margin-bottom: 0;
}

.activity-log-table thead th {
  position: sticky;
  top: 0;
  background-color: #f8f9fa;
  z-index: 1;
}

.activity-log .latest-log {
  border-left: 4px solid #0d6efd;
  background-color: #f8f9fa;
}

.table > :not(caption) > * > * {
  vertical-align: middle;
}

.card {
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-1px);
}

.cursor-pointer {
  cursor: pointer;
  transition: color 0.2s ease, text-decoration 0.2s ease;
}

.cursor-pointer:hover {
  color: #0a58ca; /* xanh đậm hơn */
  text-decoration: underline;
}
.fa-flag.text-warning {
  animation: flagPulse 1.5s infinite alternate;
}

@keyframes flagPulse {
  from { transform: rotate(-5deg) scale(1); opacity: 0.9; }
  to   { transform: rotate(5deg) scale(1.1); opacity: 1; }
}

</style>
