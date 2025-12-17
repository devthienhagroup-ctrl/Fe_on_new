<template>
  <div class="container-build pb-4 bg-light min-vh-70 danh-sach-cong-viec">
    <!-- Header -->
    <div
        class="d-flex justify-content-between align-items-center px-3 mb-2 pb-2"
        style="border-bottom: solid 0.5px rgba(0,0,0,0.3)"
    >
      <div class="d-flex align-items-center">
        <h5 class="fw-bold mb-0 d-flex align-items-center">
          <button
              v-if="canCreateWorkItem"
              @click="openCreateModal"
              class="btn border border-primary rounded-circle d-flex align-items-center justify-content-center me-2"
              style="width: 40px; height: 40px;"
          >
            <i class="fa-solid fa-plus text-primary fs-5"></i>
          </button>
          {{ projectName }}
        </h5>

        <!-- Avatar stack: danh sách user trong dự án -->
        <div
            v-if="(allAvatars && allAvatars.length) || false"
            class="d-flex align-items-center ms-3 avatar-stack"
            title="Thành viên dự án"
        >
          <!-- 3 avatar đầu -->
          <div
              v-for="(m, i) in (allAvatars ? allAvatars.slice(0,6) : [])"
              :key="i"
              class="avatar-wrapper"
              :style="{ left: (i * -10) + 'px', zIndex: i }"
          >
            <img
                class="avatar-small"
                :src="` https://s3.cloudfly.vn/thg-storage/uploads-public/${m.avatar}`"
                :alt="m.fullName"
            />
            <span class="tooltip1">
              {{ m.fullName }}<template v-if="m.email"> — {{ m.email }}</template>
            </span>
          </div>

          <!-- +N còn lại -->
          <div
              v-if="allAvatars && allAvatars.length > 6"
              class="avatar-wrapper"
              :style="{ left: ((allAvatars.slice(0,6)).length * -10) + 'px', zIndex: 100 }"
          >
            <div class="avatar-small bg-light text-dark fw-semibold d-flex align-items-center justify-content-center rounded-circle">
              +{{ allAvatars.length - 6 }}
            </div>
            <span class="tooltip">
              <template v-for="(m, i) in allAvatars.slice(6)" :key="i">
                {{ m.fullName }}<template v-if="m.email"> — {{ m.email }}</template><br />
              </template>
            </span>
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center justify-content-end gap-2">
        <NotificationBell />
        <div class="d-flex flex-column align-items-end text-end">
          <div class="fw-semibold text-dark">{{ info.fullName }}</div>
        </div>

        <img
            v-if="info.avatarUrl"
            :src="' https://s3.cloudfly.vn/thg-storage/uploads-public/' + info.avatarUrl"
            alt="avatar"
            class="rounded-circle border"
            style="width: 36px; height: 36px; object-fit: cover;"
        />
        <div v-else class="avatar-circle">
          {{ info.fullName?.charAt(0).toUpperCase() || 'U' }}
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div
        class="d-flex align-items-center border-bottom pb-2 px-3"
        style="border-bottom: solid 0.5px rgba(0,0,0,0.3)"
    >
      <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn btn btn-sm me-4 px-0"
          :class="{ active: activeTab === tab.key }"
          @click="setActiveTab(tab.key)"
      >
        <i :class="tab.icon" class="me-2"></i>
        {{ tab.label }}
      </button>
    </div>

    <!-- Nội dung tab -->
    <div class="" >
      <component :is="activeComponent" v-bind="tabProps" ref="childRef"></component>
    </div>
  </div>

  <transition name="fade-in-up">
    <div
        v-if="showCreateModal"
        class="modal fade show d-block modal-create"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div class="modal-header bg-white border-0 px-4 py-3">
            <h5 class="modal-title fw-semibold">Create new to-do item</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModalCreate"></button>
          </div>
          <div class="modal-body bg-light-subtle px-4 py-4">
            <form @submit.prevent>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label fw-semibold small">Title</label>
                    <input
                        v-model="formData.title"
                        type="text"
                        class="form-control rounded-3 py-2"
                        placeholder="Enter title"
                        required
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-semibold small">Description</label>
                    <DescriptionEditor ref="descriptionEditorRef" v-model="formData.description" />

                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-semibold small">Files</label>
                    <div class="d-flex align-items-center gap-3">
                      <button
                          type="button"
                          class="btn btn-outline-primary rounded-3 px-3"
                          @click="triggerFileUpload"
                      >
                        <i class="fa-solid fa-paperclip me-2"></i>
                        Add Files
                      </button>
                      <span class="text-muted small">{{ formData.files.length }} attachment<span v-if="formData.files.length !== 1">s</span></span>
                    </div>
                    <input
                        ref="fileInputRef"
                        type="file"
                        class="d-none"
                        multiple
                        @change="handleFilesSelected"
                    />
                    <ul v-if="formData.files.length" class="list-unstyled mt-3 mb-0 attachment-list">
                      <li
                          v-for="(file, index) in formData.files"
                          :key="`${file.name}-${index}`"
                          class="d-flex align-items-center justify-content-between bg-white rounded-3 border px-3 py-2 mb-2"
                      >
                        <div class="d-flex align-items-center gap-2">
                          <i class="fa-solid fa-file text-primary"></i>
                          <div class="d-flex flex-column">
                            <span class="small fw-semibold text-truncate file-name" :title="file.name">{{ file.name }}</span>
                            <small class="text-muted">{{ formatFileSize(file.size) }}</small>
                          </div>
                        </div>
                        <button type="button" class="btn btn-link text-danger p-0" @click="removeFile(index)" title="Xóa tệp">
                          <i class="fa-solid fa-xmark"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3 position-relative" @click.stop>
                    <label class="form-label fw-semibold small">Assignee</label>
                    <button
                        type="button"
                        class="btn btn-light border rounded-3 w-100 d-flex align-items-center justify-content-between py-2 px-3 assignee-trigger"
                        @click="toggleAssigneeDropdown"
                    >
                      <div class="d-flex align-items-center gap-2">
                        <div
                            v-if="formData.assignee && formData.assignee.avatar"
                            class="avatar-option rounded-circle overflow-hidden"
                            style="width: 36px; height: 36px;"
                        >
                          <img :src="formData.assignee.avatar" alt="avatar" class="w-100 h-100 object-fit-cover" />
                        </div>
                        <div
                            v-else
                            class="placeholder-avatar rounded-circle d-flex align-items-center justify-content-center"
                            style="width: 36px; height: 36px;"
                        >
                          <i class="fa-regular fa-user"></i>
                        </div>
                        <div class="text-start">
                          <span class="d-block fw-semibold small text-dark">{{ formData.assignee ? formData.assignee.label : 'Select assignee' }}</span>
                          <small class="text-muted" v-if="formData.assignee && formData.assignee.email">{{ formData.assignee.email }}</small>
                        </div>
                      </div>
                      <i class="fa-solid" :class="assigneeDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                    </button>
                    <div
                        v-if="assigneeDropdownOpen"
                        class="dropdown-panel mt-2"
                    >
                      <button
                          v-for="member in implementerOptions"
                          :key="member.id"
                          type="button"
                          class="dropdown-option d-flex align-items-center gap-3 w-100"
                          @click="selectAssignee(member)"
                      >
                        <div class="avatar-option rounded-circle overflow-hidden" style="width: 40px; height: 40px;">
                          <img
                              v-if="member.avatar"
                              :src="member.avatar"
                              alt="avatar"
                              class="w-100 h-100 object-fit-cover"
                          />
                          <div
                              v-else
                              class="w-100 h-100 d-flex align-items-center justify-content-center bg-light text-muted"
                          >
                            <i class="fa-regular fa-user"></i>
                          </div>
                        </div>
                        <div class="text-start">
                          <div class="fw-semibold small text-dark">{{ member.label }}</div>
                          <div class="text-muted small" v-if="member.type === 'employee' && member.email">{{ member.email }}</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold small">Start Date</label>
                    <input
                        v-model="formData.startDate"
                        type="datetime-local"
                        class="form-control rounded-3 py-2"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label fw-semibold small">Deadline</label>
                    <input
                        v-model="formData.deadline"
                        type="datetime-local"
                        class="form-control rounded-3 py-2"
                    />
                  </div>
                  <div class="mb-3 position-relative" @click.stop>
                    <label class="form-label fw-semibold small">Type</label>
                    <button
                        type="button"
                        class="btn btn-light border rounded-3 w-100 d-flex align-items-center justify-content-between py-2 px-3"
                        @click="toggleTypeDropdown"
                    >
                      <div class="d-flex align-items-center gap-2">
                        <span
                            v-if="formData.type"
                            class="badge rounded-circle d-inline-flex align-items-center justify-content-center"
                            :style="{ backgroundColor: formData.type.color || '#0d6efd', width: '28px', height: '28px' }"
                        >
                          <i :class="formData.type.icon || 'fa-solid fa-circle'" class="text-white"></i>
                        </span>
                        <div v-else class="placeholder-avatar rounded-circle d-flex align-items-center justify-content-center">
                          <i class="fa-regular fa-circle"></i>
                        </div>
                        <span class="fw-semibold small text-dark">
                          {{ formData.type ? formData.type.name : 'Select type' }}
                        </span>
                      </div>
                      <i class="fa-solid" :class="typeDropdownOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                    </button>
                    <div
                        v-if="typeDropdownOpen"
                        class="dropdown-panel mt-2"
                    >
                      <button
                          v-for="type in typeOptions"
                          :key="type.id"
                          type="button"
                          class="dropdown-option d-flex align-items-center gap-3 w-100"
                          @click="selectType(type)"
                      >
                        <span
                            class="badge rounded-circle d-inline-flex align-items-center justify-content-center"
                            :style="{ backgroundColor: type.color || '#0d6efd', width: '32px', height: '32px' }"
                        >
                          <i :class="type.icon || 'fa-solid fa-circle'" class="text-white"></i>
                        </span>
                        <span class="fw-semibold small text-dark">{{ type.name }}</span>
                      </button>
                    </div>
                  </div>
                  <div class="mb-0">
                    <label class="form-label fw-semibold small">Effort Points</label>
                    <input
                        v-model.number="formData.effort"
                        type="number"
                        min="0"
                        class="form-control rounded-3 py-2"
                        placeholder="Enter effort points"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer bg-white border-0 px-4 py-3 d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" @click="closeModalCreate">Cancel</button>
            <button type="button" class="btn btn-primary px-4" @click="create">Create</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <div v-if="showCreateModal" class="modal-backdrop fade show"></div>
</template>
<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

import api from "../../api/api.js";

import AllWorkItemsTab from "./tabs/AllWorkItemsTab.vue";
import KanbanTab from "./tabs/KanbanTab.vue";
import SummaryTab from "./tabs/SummaryTab.vue";
import TimelineTab from "./tabs/TimelineTab.vue";
import {showLoading, updateAlertSuccess} from "../../assets/js/alertService.js";
import { useAuthStore } from "../../stores/authStore.js";
import DescriptionEditor from "../common/DescriptionEditor.vue";
import { socketService } from "../../services/socketService.js";
import { SOCKET_CONFIG } from "../../config/socketConfig.js";
import {
  enrichSocketEvent,
  isWorkItemEvent,
  isCommentEvent,
  isMemberEvent,
  isProjectMetaEvent,
} from "../../utils/socketEventUtils.js";
import NotificationBell from "../NotificationBell.vue";

const route = useRoute();
const authStore = useAuthStore();
const info = authStore.userInfo;

const canViewTimelineTab = computed(() =>
    authStore.hasProjectPermission("PROJECT_VIEW_TIMELINE") ||
    authStore.hasPermission("PROJECT_VIEW_TIMELINE")
)

const canViewSummaryTab = computed(() =>
    authStore.hasProjectPermission("PROJECT_VIEW_SUMARY") ||
    authStore.hasPermission("PROJECT_VIEW_SUMARY")
)

const canCreateWorkItem = computed(() =>
    authStore.hasProjectPermission("WORKITEM_CREATE") ||
    authStore.hasPermission("WORKITEM_CREATE")
)

const canUpdateWorkItem = computed(() =>
    authStore.hasProjectPermission("WORKITEM_UPDATE") ||
    authStore.hasPermission("WORKITEM_UPDATE")
)

// ⚠️ bạn viết sai key: WORKITEM_EDIT_IMPLEMENTER
const canEditImplementer = computed(() =>
    authStore.hasProjectPermission("WORKITEM_EDIT_IMPLEMENTER") ||
    authStore.hasPermission("WORKITEM_EDIT_IMPLEMENTER")
)

const canViewWorkItemDetail = computed(() =>
    authStore.hasProjectPermission("WORKITEM_VIEW_ALL") ||
    authStore.hasPermission("WORKITEM_VIEW_ALL")
)





const rawTabs = [
  { key: "list", label: "List công việc", icon: "fa-solid fa-list-check" },
  { key: "kanban", label: "Kanban", icon: "fa-solid fa-chess-board" },
  { key: "report", label: "Báo cáo", icon: "fa-solid fa-globe" },
  { key: "info", label: "Thông tin", icon: "fa-solid fa-circle-info" },
];

const tabs = computed(() =>
    rawTabs.filter((tab) => {
      if (tab.key === "report") {
        return canViewSummaryTab.value;
      }
      if (tab.key === "info") {
        return canViewTimelineTab.value;
      }
      return true;
    })
);

const activeTab = ref("list");

// Component map
const componentMap = {
  list: AllWorkItemsTab,
  kanban: KanbanTab,
  report: SummaryTab,
  info: TimelineTab,
};

const activeComponent = computed(() => componentMap[activeTab.value] || AllWorkItemsTab);
const lastProjectEvent = ref(null);
const tabProps = computed(() => ({
  projectId: Number(route.params.projectId),
  socketEvent: lastProjectEvent.value,
  canUpdateWorkItem: canUpdateWorkItem.value,
  canEditImplementer: canEditImplementer.value,
  canViewDetail: canViewWorkItemDetail.value,
}));

watch(tabs, (newTabs) => {
  if (!newTabs.length) {
    activeTab.value = null;
    return;
  }
  if (!newTabs.some((tab) => tab.key === activeTab.value)) {
    activeTab.value = newTabs[0]?.key ?? null;
  }
});

const setActiveTab = (key) => {
  if (!tabs.value.some((tab) => tab.key === key)) return;
  activeTab.value = key;
};

// Fake data avatar team
const allAvatars = ref([]);

const showCreateModal = ref(false);
const assigneeDropdownOpen = ref(false);
const typeDropdownOpen = ref(false);

const implementerOptions = ref([]);
const typeOptions = ref([]);

const initialFormState = () => ({
  title: "",
  description: "",
  assignee: null,
  startDate: "",
  deadline: "",
  type: null,
  effort: null,
  files: [],
});

const formData = ref(initialFormState());

const resetFormData = () => {
  formData.value = initialFormState();
  descriptionEditorRef.value?.reset();
};

const fetchImplementers = async () => {
  try {
    const res = await api.get("/admin.thg/project/work/getImplementers", {
      params: { projectId: route.params.projectId },
      withCredentials: true,
    });

    const employeeList = res.data?.implementerList || [];
    const teamList = res.data?.implementerTeamList || [];

    const combined = [
      {
        id: null,
        label: "Chưa giao cho ai",
        avatar: "",
        email: "",
        type: null,
      },
      ...employeeList.map((item) => ({
        id: item.employeeID,
        label: item.fullName,
        email: item.email,
        avatar: ` https://s3.cloudfly.vn/thg-storage/uploads-public/${item.avatar}`,
        type: "employee",
      })),
      ...teamList.map((team) => ({
        id: team.teamID,
        label: team.teamName,
        avatar: ` https://s3.cloudfly.vn/thg-storage/uploads-public/${team.avatar}`,
        type: "team",
      })),
    ];

    formData.value.assignee = combined[0] || null;
    implementerOptions.value = combined;
  } catch (error) {
    console.error("❌ Failed to load implementers:", error);
    implementerOptions.value = [];
  }
};

const fetchWorkTypes = async () => {
  try {
    const res = await api.get("/admin.thg/project/work", { withCredentials: true });
    typeOptions.value = Array.isArray(res.data) ? res.data : [];

    if (typeOptions.value.length > 0 && !formData.value.type) {
      formData.value.type = typeOptions.value[0];
    }
  } catch (error) {
    console.error("Failed to load work types:", error);
    typeOptions.value = [];
  }
};

const fileInputRef = ref(null);

const openCreateModal = () => {
  if (!canCreateWorkItem.value) return;
  resetFormData();
  showCreateModal.value = true;
  assigneeDropdownOpen.value = false;
  typeDropdownOpen.value = false;

  fetchImplementers();
  fetchWorkTypes();
};

const closeModalCreate = () => {
  showCreateModal.value = false;
  assigneeDropdownOpen.value = false;
  typeDropdownOpen.value = false;
};

const triggerFileUpload = () => {
  fileInputRef.value?.click();
};

const handleFilesSelected = (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  const mergedFiles = [...formData.value.files, ...files];
  formData.value.files = mergedFiles;

  if (event.target) {
    event.target.value = "";
  }
};

const removeFile = (index) => {
  if (index < 0 || index >= formData.value.files.length) return;
  const updated = [...formData.value.files];
  updated.splice(index, 1);
  formData.value.files = updated;
};

const toggleAssigneeDropdown = () => {
  assigneeDropdownOpen.value = !assigneeDropdownOpen.value;
  if (assigneeDropdownOpen.value) {
    typeDropdownOpen.value = false;
  }
};

const selectAssignee = (member) => {
  formData.value.assignee = member;
  assigneeDropdownOpen.value = false;
};

const toggleTypeDropdown = () => {
  typeDropdownOpen.value = !typeDropdownOpen.value;
  if (typeDropdownOpen.value) {
    assigneeDropdownOpen.value = false;
  }
};

const selectType = (type) => {
  formData.value.type = type;
  typeDropdownOpen.value = false;
};

const childRef = ref(null);

const projectSubscriptions = [];
const projectId = computed(() => Number(route.params.projectId) || null);

const cleanupProjectSubscriptions = () => {
  while (projectSubscriptions.length) {
    const unsubscribe = projectSubscriptions.pop();
    try {
      unsubscribe?.();
    } catch (error) {
      console.warn('[WorkItemManager] Failed to unsubscribe from project topic', error);
    }
  }
};

const refreshActiveTab = (event) => {
  console.log("📦 refreshActiveTab triggered | activeTab:", activeTab.value);
  const current = childRef.value;
  if (!current) return;

  if ((activeTab.value === 'list' || activeTab.value === 'kanban') && typeof current.fetchWorkItems === 'function') {
    current.fetchWorkItems();
  }

  if (activeTab.value === 'report' && typeof current.fetchDashboardData === 'function') {
    current.fetchDashboardData();
  }

  if (activeTab.value === 'info' && typeof current.reloadProject === 'function') {
    current.reloadProject();
  }

  if (typeof current.handleSocketEvent === 'function') {
    current.handleSocketEvent(event);
  }
};

const handleProjectEvent = (event, scope) => {
  console.log("🧩 handleProjectEvent triggered | scope:", scope, "| domain:", event?.domain, "| type:", event?.type);

  if (!event) return;
  const enriched = enrichSocketEvent(event, {
    projectId: projectId.value,
    scope,
  });

  lastProjectEvent.value = enriched;

  if (isMemberEvent(enriched)) {
    getInfoProject();
  }

  if (isWorkItemEvent(enriched) || isCommentEvent(enriched)) {
    refreshActiveTab(enriched);
  } else if (isProjectMetaEvent(enriched) && activeTab.value === 'info') {
    refreshActiveTab(enriched);
  }
};

const subscribeToProjectSocket = () => {
  cleanupProjectSubscriptions();

  const token = () => authStore.accessToken;
  const id = projectId.value;
  const employeeId = authStore.userInfo?.id;

  if (!token() || !id) return;

  console.log("🔌 [Socket] Preparing subscription for project:", id, "| employee:", employeeId);

  socketService.connect(token);

  const topics = [
    { destination: SOCKET_CONFIG.projectTopic(id, employeeId), scope: "project" },
    { destination: SOCKET_CONFIG.projectWorkItemsTopic(id, employeeId), scope: "work-items" },
    { destination: SOCKET_CONFIG.projectCommentsTopic(id, employeeId), scope: "comments" },
    { destination: SOCKET_CONFIG.projectMembersTopic(id, employeeId), scope: "members" },
    { destination: SOCKET_CONFIG.projectTimelineTopic(id, employeeId), scope: "timeline" },
  ];

  topics.forEach(({ destination, scope }) => {
    const unsubscribe = socketService.subscribe(destination, (payload) => {
      console.log("📨 [Socket] Event received on:", destination, "→ scope:", scope);
      handleProjectEvent(payload, scope);
    });

    projectSubscriptions.push(unsubscribe);
  });
};


watch(projectId, () => {
  lastProjectEvent.value = null;
  subscribeToProjectSocket();
}, { immediate: true });

watch(() => authStore.accessToken, (token) => {
  if (!token) {
    cleanupProjectSubscriptions();
  } else {
    subscribeToProjectSocket();
  }
});

onBeforeUnmount(() => {
  cleanupProjectSubscriptions();
});

async function create(){
  const payload = new FormData();
  payload.append("title", formData.value.title);
  payload.append("description", formData.value.description || "");
  payload.append("assigneeId", formData.value.assignee?.id ?? null);
  payload.append("typeAssignee", formData.value.assignee?.type ?? "");
  payload.append("startDate", formData.value.startDate ? formData.value.startDate : "");
  payload.append("deadline", formData.value.deadline ? formData.value.deadline : "");
  payload.append("typeId", formData.value.type?.id ?? "");
  payload.append("effort", formData.value.effort ?? "");
  payload.append("projectId", route.params.projectId ?? 0)

  formData.value.files.forEach((file) => {
    payload.append("files", file);
  });

  console.log("✅ New Work Item FormData ready:");
  for (const [key, value] of payload.entries()) {
    console.log(`${key}:`, value);
  }
  console.log("📦 File count:", formData.value.files.length);

  const res = await showLoading(
      api.post("/admin.thg/project/work/create", payload, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
  );

  closeModalCreate();

  updateAlertSuccess("Thêm công việc mới thành công")

  childRef.value.fetchWorkItems();
}

const descriptionEditorRef = ref(null);

onMounted( async () => {
  await authStore.fetchProjectPermissions( route.params.projectId );
  descriptionEditorRef.value?.reset();
  await getInfoProject();
});

const formatFileSize = (size) => {
  if (!size && size !== 0) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};


const projectName = ref();

async function getInfoProject() {
  console.log("id pro:", route.params.projectId)

  try {
    // ✅ nhớ await
    const res = await api.get("/admin.thg/project/" + route.params.projectId, {
      withCredentials: true,
    })

    // ✅ gán vào allAvatars
    allAvatars.value = res.data.listMember.map(member => ({
      fullName: member.fullName,
      avatar: member.avatar
    }))

    projectName.value = res.data.projectName;

    console.log("In4:", res.data)
  } catch (error) {
    console.error("Lỗi khi lấy thông tin project:", error)
  }
}

</script>

<style scoped>
.container-build { width: 100%; }

/* Avatar user hiện tại (góc phải) */
.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #d6d9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #333;
}

/* ===== Avatar stack (list user dự án) ===== */
.avatar-stack { position: relative; height: 28px; }
.avatar-wrapper { position: relative; display: inline-block; overflow: visible; }
.avatar-small {
  width: 28px; height: 28px; border-radius: 50%;
  border: 0.5px solid rgba(0,0,0,0.68); object-fit: cover;
}

/* Tooltip chung hiển thị phía dưới */
.tooltip,
.tooltip1 {
  visibility: hidden;
  opacity: 0;
  background-color: #8cbbdc;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 4px 8px;
  position: absolute;
  top: 120%;            /* ✅ đổi từ bottom sang top */
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 99999;
  transition: opacity 0.2s ease-in-out;
}

/* Mũi tên hướng lên (chỉ lên phần tử gốc) */
.tooltip::after,
.tooltip1::after {
  content: '';
  position: absolute;
  bottom: 100%;          /* ✅ mũi tên ở trên tooltip */
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent #8cbbdc transparent;
}


/* Hover hiển thị tooltip */
.avatar-wrapper:hover .tooltip,
.avatar-wrapper:hover .tooltip1 {
  visibility: visible; opacity: 1;
}

/* Tabs */
.tab-btn {
  background: transparent; border: none; color: #6c757d;
  font-weight: 500; transition: all 0.2s ease;
}
.tab-btn:hover { color: #0d6efd; }
.tab-btn.active {
  color: #0d6efd; border-bottom: 2px solid #0d6efd; font-weight: 600;
}

.modal-create {
  z-index: 1055;
}

.modal-create .modal-content {
  border-radius: 1rem;
}

.placeholder-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f1f5;
  color: #6c757d;
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.9rem;
  padding: 0.5rem;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  z-index: 20;
}

.dropdown-option {
  border: none;
  background: transparent;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  transition: background-color 0.2s ease;
}

.dropdown-option:hover {
  background-color: #f8f9fa;
}

.dropdown-option:focus {
  outline: none;
  background-color: #f8f9fa;
}

.assignee-trigger {
  background-color: #f8f9ff;
}

.fade-in-up-enter-active {
  animation: fadeInUp 0.3s ease;
}

.fade-in-up-leave-active {
  animation: fadeInUp 0.2s ease reverse;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.attachment-list .file-name {
  max-width: 240px;
}

@media (max-width: 576px) {
  .attachment-list .file-name {
    max-width: 160px;
  }
}

</style>
