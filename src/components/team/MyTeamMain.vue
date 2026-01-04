<template>
  <div class="myteam-layout container-fluid py-3" style="margin-top: 50px; min-height: 100vh">
    <hr/>
    <div class="row g-3">
      <div class="col-12 col-lg-4 col-xxl-3 d-flex flex-column gap-3">
        <TeamList
            :teams="teams"
            :loading="loadingTeams"
            :selected-id="selectedTeamId"
            @select="handleSelectTeam"
            @create="showCreateModal = true"
            @showSettingsModal="showSettingsModal = true"
        />
      </div>
      <div class="col-12 col-lg-8 col-xxl-9 d-flex flex-column gap-3">
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                  class="nav-link"
                  :class="{ active: activeTab === 'chat' }"
                  @click="activeTab = 'chat'"
                  type="button"
                  role="tab"
              >
                <i class="fa-solid fa-comments me-2"></i>
                Trò chuyện
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                  class="nav-link"
                  :class="{ active: activeTab === 'tasks' }"
                  @click="activeTab = 'tasks'"
                  type="button"
                  role="tab"
              >
                <i class="fa-solid fa-list-check me-2"></i>
                Nhiệm vụ
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                  class="nav-link"
                  :class="{ active: activeTab === 'members' }"
                  @click="activeTab = 'members'"
                  type="button"
                  role="tab"
              >
                <i class="fa-solid fa-users me-2"></i>
                Thành viên
              </button>
            </li>
          </ul>
        </div>

        <!-- Tab Content -->
        <div class="tab-content flex-grow-1">
          <!-- Tasks Tab -->
          <div
              class="tab-pane fade"
              :class="{ 'show active': activeTab === 'tasks' }"
              role="tabpanel"
          >
            <TeamTasks v-if="authStore.hasPermission('TEAMTASK_VIEW')"
                :tasks="teamTasks"
                :loading="taskLoading"
                @refresh="loadTeamTasks"
                @update-status="handleUpdateTaskStatus"
                @view="handleViewTask"
                @create="() => (showCreateTaskModal = true)"
                @manage-applicants="handleOpenApplicants"
                @filter-change="handleFilterChange"
            />
          </div>

          <!-- Chat Tab -->
          <div
              class="tab-pane fade"
              :class="{ 'show active': activeTab === 'chat' }"
              role="tabpanel"
          >
            <TeamChat
                :team="selectedTeam"
                :members="teamMembers"
                :messages="chatMessages"
                :loading="chatLoading"
                :sending="sendingMessage"
                :current-user-id="currentUserId"
                :can-recall="canRecallMessage"
                :has-more="hasMoreHistory"
                @send="handleSendMessage"
                @recall="handleRecallMessage"
                @load-more="loadOlderMessages"
                @refresh="loadChatHistory"
            />
          </div>
          <div
              class="tab-pane fade"
              :class="{ 'show active': activeTab === 'members' }"
              role="tabpanel"
          >
            <TeamMembers
                :members="teamMembers"
                :leader-id="currentTeamLeaderId"
                @remove-member="handleRemoveMember"
                @change-leader="handleChangeLeader"
                @disband="handleDisbandTeam"
            />
          </div>
          <div
            class="tab-pane fade"
            :class="{ 'show active': activeTab === 'appliers' }"
            role="tabpanel"
        >
          <TeamAppliers v-if="authStore.hasTeamPermission('TEAMUSER_APLLY_MEMBER') || authStore.hasPermission('TEAMUSER_APLLY_MEMBER')"
              :appliers="teamAppliers"
              @refresh="loadTeamAppliers"
              @approve="handleApproveApplier"
              @reject="handleRejectApplier"
          />
        </div>

        </div>
      </div>
    </div>

    <TeamCreate
        :visible="showCreateModal"
        @close="showCreateModal = false"
        @submit="handleCreateTeam"
    />
    <TeamTaskDetailModal
        :visible="showTaskDetail"
        :task="selectedTask"
        :current-user-id="currentUserId"
        @close="closeTaskDetail"
        @apply="handleApplyTask"
        @approve="handleApprove"
        @reject="handleReject"
    />
    <TaskApplicantsModal
        :visible="showApplicantsModal"
        :task="selectedTask"
        @close="() => (showApplicantsModal = false)"
        @decision="handleApplicantDecision"
        @update-role="handleUpdateTaskRole"
    />
    <TeamTaskCreateModal
        :visible="showCreateTaskModal"
        :members="teamMembers"
        @close="() => (showCreateTaskModal = false)"
        @submit="handleCreateTask"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import TeamList from './TeamList.vue'
import TeamChat from './TeamChat.vue'
import TeamTasks from './TeamTasks.vue'
import TeamCreate from './TeamCreate.vue'
import TeamInvites from './TeamInvites.vue'
import TeamSettings from './TeamSettings.vue'
import TeamTaskDetailModal from './TeamTaskDetailModal.vue'
import TaskApplicantsModal from './TaskApplicantsModal.vue'
import TeamTaskCreateModal from './TeamTaskCreateModal.vue'
import TeamAppliers from "./TeamAppliers.vue";
import TeamMembers  from "./TeamMembers.vue";
import { useAuthStore } from '../../stores/authStore.js'
import { showError, showSuccess, confirmWithInput, confirmDeleteMember } from '../../assets/js/alertService.js'
import api from "../../api/api.js";

const authStore = useAuthStore()

const currentTeamLeaderId = computed(() => {
  const leader = teamMembers.value.find(m => m.teamRole === "LEADER")
  return leader?.idE || null
})


// Thêm state cho active tab
const activeTab = ref('chat') // Mặc định hiển thị tab Tasks
const teams = ref([])
const loadingTeams = ref(false)
const selectedTeamId = ref(null)
const selectedTeam = computed(() => teams.value.find((team) => team.teamId === selectedTeamId.value) || teamDetail.value)
const teamDetail = ref(null)
const teamMembers = ref([])
const teamSettings = ref({})
const teamTasks = ref([])
const taskLoading = ref(false)
const MESSAGES_PER_LOAD = 50
const chatMessages = ref([])
const chatLoading = ref(false)
const sendingMessage = ref(false)
const invites = ref([])
const incomingInvites = ref([])
const loadingInvites = ref(false)
const sendingInvite = ref(false)
const showCreateModal = ref(false)
const showSettingsModal = ref(false)
const showTaskDetail = ref(false)
const showApplicantsModal = ref(false)
const showCreateTaskModal = ref(false)
const selectedTask = ref(null)
const currentUser = computed(() => authStore.userInfo)
const currentUserId = computed(() => currentUser.value?.employeeID || currentUser.value?.id || currentUser.value?.userId)
const canRecallMessage = computed(() => !!currentUserId.value)
const pagination = ref({ cache: [] })
const hasMoreHistory = computed(() => (pagination.value.cache || []).length > 0)

const defaultSettings = {
  inviteMode: 'LEAD_ONLY',
  memberVisibility: 'TEAM',
  archivePolicy: '30D',
}

const simulateDelay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms))
const clone = (value) => (value == null ? value : JSON.parse(JSON.stringify(value)))
const generateId = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

const normalizeAttachment = (item) => {
  if (!item) return null
  const url = item.url || item.path || item
  if (!url) return null
  const name = item.name || url.split('/').pop()
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() || ''
  const imageExt = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  return {
    url,
    name,
    type: imageExt.includes(ext) ? 'image' : 'file',
  }
}

const normalizeMessage = (message) => {
  if (!message) return null
  return {
    id: message.id || message.messageId,
    content: message.content,
    createdAt: message.createdAt || message.createdDate,
    authorId: message.authorId || message.author?.id,
    author: message.author,
    isRecalled: message.isRecalled || message.status === 'RECALLED',
    replyToId: message.replyToId,
    replyTo: message.replyTo,
    attachments: (message.attachments || []).map(normalizeAttachment).filter(Boolean),
  }
}


const loadTeams = async () => {
  loadingTeams.value = true
  try {
    const res = await api.get("/user.thg/my-team/list-team")
    teams.value = res.data || []
    console.log(res.data);

    if (!selectedTeamId.value && teams.value.length) {
      selectedTeamId.value = teams.value[0].teamId
      await handleSelectTeam(teams.value[0]);
      await authStore.fetchTeamPermissions(teams.value[0].teamId);
      console.log(" quyền trong hệ team", authStore.listPermissionTeams)
    }

  } catch (e) {
    console.error("Lỗi load teams:", e)
  } finally {
    loadingTeams.value = false
  }
}

const handleSelectTeam = async (team) => {
  if (!team?.teamId) return
  selectedTeamId.value = team.teamId
  await Promise.all([
    loadTeamDetail(),
    loadTeamTasks(),
    loadChatHistory(true),
    loadTeamAppliers(),])
}

const teamAppliers = ref([]);

const loadTeamAppliers = async () => {
  try {
    const res = await api.get(`/user.thg/my-team/appliers/${selectedTeamId.value}`);
    teamAppliers.value = res.data || [];
  } catch (e) {
    console.error("Lỗi load appliers:", e);
  }
};


const loadTeamDetail = async () => {
  try {
    const res = await api.get(`/user.thg/my-team/detail/${selectedTeamId.value}`)
    // teamDetail.value = res.data
    teamMembers.value = res.data.members || []
    console.log(teamMembers.value);
  } catch (e) {
    console.error("Lỗi load team detail:", e)
  }
}

const loadTeamSettings = async () => {
  try {
    const res = await api.get(`/apithienha/user.thg/my-team/settings/${selectedTeamId.value}`)
    teamSettings.value = res.data
  } catch (e) {
    console.error("Lỗi load settings:", e)
  }
}


const selectedStatuses = ref(['TODO', 'IN_PROGRESS', 'DONE', 'IN_PREVIEW'])

const handleFilterChange = ({ selectedLabels }) => {
  selectedStatuses.value = selectedLabels
  loadTeamTasks()  // tự load lại khi lọc
}

const loadTeamTasks = async () => {
  taskLoading.value = true

  try {
    const statusParam = selectedStatuses.value.join(",") // chuỗi
    const res = await api.get(
        `/user.thg/my-team/tasks/${selectedTeamId.value}`,
        {
          params: {
            statuses: statusParam
          }
        }
    )
    console.log(res.data);
    teamTasks.value = res.data || []
  } catch (e) {
    console.error("Lỗi load tasks:", e)
  } finally {
    taskLoading.value = false
  }
}

const page = ref(0)
const size = 50;
const noMoreMessages = ref(false)

const loadChatHistory = async (reset = false) => {
  if (chatLoading.value) return
  chatLoading.value = true

  try {
    if (reset) {
      page.value = 0
      noMoreMessages.value = false
      chatMessages.value = []
    }

    const res = await api.get(
        `/user.thg/my-team/chat/messages/${selectedTeamId.value}`,
        { params: { page: page.value, size } }
    )

    const list = res.data || []
    console.log("📥 Page:", page.value, "Data:", list)

    if (list.length === 0) {
      noMoreMessages.value = true
      return
    }

    if (reset) {
      // ⭐ Lần đầu → ghi thẳng list (KHÔNG REVERSE)
      chatMessages.value = list

      await nextTick()
      scrollToBottom()

    } else {
      // ⭐ Load thêm → prepend
      const container = document.querySelector(".chat-messages")
      const oldHeight = container?.scrollHeight || 0
      const oldTop = container?.scrollTop || 0

      chatMessages.value = [...list, ...chatMessages.value]

      await nextTick()

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const newHeight = container.scrollHeight
          container.scrollTop = newHeight - oldHeight + oldTop
        })
      })
    }

    page.value += 1

  } catch (e) {
    console.error("❌ Lỗi load chat:", e)
  } finally {
    chatLoading.value = false
  }
}

const loadOlderMessages = async () => {
  if (noMoreMessages.value || chatLoading.value) return
  await loadChatHistory(false)
}


const isOwnMessage = (message) => {
  if (!message || !currentUserId.value) return false
  const senderId = message.senderId ?? message.author?.id ?? message.author?.idE
  return senderId != null && String(senderId) === String(currentUserId.value)
}



const handleSendMessage = async ({ content, attachments, replyToId }) => {
  sendingMessage.value = true

  try {
    const formData = new FormData()
    formData.append("teamId", selectedTeamId.value)
    formData.append("content", content)
    formData.append("replyToId", replyToId || "")

    ;(attachments || []).forEach(att => {
      if (att.file instanceof File) {
        formData.append("files", att.file)
      } else {
        console.warn("❌ attachment không phải file thật:", att)
      }
    })


    // 🟦🟦🟦 LOG TẤT CẢ DỮ LIỆU GỬI LÊN 🟦🟦🟦
    console.group("📤 FormData gửi lên BE")
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, {
          name: value.name,
          size: value.size,
          type: value.type
        })
      } else {
        console.log(key, value)
      }
    }
    console.groupEnd()

    const res = await api.post("/user.thg/my-team/chat/send", formData)
    console.log(res.data)

  } catch (e) {
    showError("Gửi tin nhắn thất bại")
  } finally {
    sendingMessage.value = false
  }
}


// ========================== RECALL MESSAGE ==========================
const handleRecallMessage = async (msg) => {
  try {
    await api.post(`/user.thg/my-team/chat/recall/${msg.id}`)

    const found = chatMessages.value.find(m => m.id === msg.id)
    if (found) {
      found.isRecalled = true
      found.messageContent = null
    }

    // 2. Cập nhật cho tất cả tin nhắn con
    chatMessages.value.forEach(m => {
      if (m.parentId === msg.id && m.parentMessage) {
        m.parentMessage.isRecalled = true
        m.parentMessage.messageContent = null
      }
    })

    showSuccess("Thu hồi tin nhắn thành công")
  } catch (e) {
    showError("Thu hồi thất bại")
  }
}

const handleUpdateTaskStatus = async ({ task, status }) => {
  if (!task?.id) return

  try {
    const res = await api.put(`/user.thg/my-team/task/update-status/${task.id}`, {
      status: status
    })

    showSuccess("Cập nhật trạng thái thành công!")

    // Load lại danh sách task để update UI
    await loadTeamTasks()

  } catch (e) {
    console.error("Lỗi update task:", e)
    showError("Cập nhật trạng thái thất bại!")
  }
}


const handleInvite = async (email) => {
  sendingInvite.value = true
  if (mockDatabase.invites.some((invite) => invite.email === email)) {
    showError('Email đã tồn tại trong danh sách lời mời')
    sendingInvite.value = false
    return
  }
  await simulateDelay(200)
  mockDatabase.invites.unshift({
    id: generateId('invite'),
    email,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  })
  await loadInvites()
  showSuccess('Đã tạo lời mời mẫu', email)
  sendingInvite.value = false
}

const handleResendInvite = async (invite) => {
  await simulateDelay(150)
  showSuccess('Đã mô phỏng gửi lại lời mời', invite.email)
}

const handleCancelInvite = async (invite) => {
  mockDatabase.invites = mockDatabase.invites.filter((item) => item.id !== invite.id)
  await simulateDelay(150)
  await loadInvites()
}

const loadInvites = async () => {
  loadingInvites.value = true
  try {
    const res = await api.get("/apithienha/user.thg/my-team/invites")
    invites.value = res.data.sent || []
    incomingInvites.value = res.data.received || []
  } finally {
    loadingInvites.value = false
  }
}

const handleSaveSettings = async (settings) => {
  if (!selectedTeamId.value) return
  mockDatabase.settings[selectedTeamId.value] = { ...defaultSettings, ...settings }
  await simulateDelay(200)
  await loadTeamSettings()
  showSuccess('Đã lưu cấu hình mô phỏng')
}

const handleViewTask = (task) => {
  selectedTask.value = task
  showTaskDetail.value = true
}

const closeTaskDetail = () => {
  showTaskDetail.value = false
  selectedTask.value = null
}

const handleApplyTask = async ({ note }) => {
  if (!selectedTask.value?.id) return

  try {
    await api.post(`/user.thg/my-team/task/apply`, {
      taskId: selectedTask.value.id,
      message: note
    })

    showSuccess("Đã gửi yêu cầu tham gia nhiệm vụ")

    // Reload lại danh sách task
    await loadTeamTasks()

    // Reload lại task đang mở
    const updatedTask = teamTasks.value.find(t => t.id === selectedTask.value.id)
    if (updatedTask) {
      selectedTask.value = updatedTask
    }

  } catch (err) {
    console.error("Lỗi gửi ứng tuyển:", err)
    showError("Không thể gửi yêu cầu tham gia")
  }
}


const handleOpenApplicants = (task) => {
  selectedTask.value = task
  showApplicantsModal.value = true
}

const handleApplicantDecision = async ({ applicantId, status }) => {
  if (!selectedTask.value?.id) return

  try {
    await api.post(`/user.thg/my-team/task/applicant/decision`, {
      taskId: selectedTask.value.id,
      applicantId,
      status
    })

    showSuccess(status === 'APPROVED' ? 'Đã duyệt ứng viên' : 'Đã từ chối ứng viên')

    // Reload lại danh sách task
    await loadTeamTasks()

    // Reload lại task detail đang mở
    const updatedTask = teamTasks.value.find(t => t.id === selectedTask.value.id)
    if (updatedTask) {
      selectedTask.value = updatedTask
    }

  } catch (err) {
    console.error("Lỗi duyệt ứng viên:", err)
    showError("Không thể xử lý yêu cầu")
  }
}

const handleApprove = ({ applicantId }) => {
  handleApplicantDecision({
    applicantId,
    status: "APPROVED"
  })
}

const handleReject = ({ applicantId }) => {
  handleApplicantDecision({
    applicantId,
    status: "REJECTED"
  })
}


const handleUpdateTaskRole = async ({ memberId, role }) => {
  if (!selectedTask.value || !selectedTeamId.value) return
  const list = mockDatabase.tasks[selectedTeamId.value] || []
  const task = list.find((item) => item.id === selectedTask.value.id)
  if (!task) return
  const permission = (task.permissions || []).find((perm) => perm.memberId === memberId)
  if (permission) {
    permission.role = role
  } else {
    task.permissions = [...(task.permissions || []), { memberId, role }]
  }
  selectedTask.value = clone(task)
  await simulateDelay(150)
  showSuccess('Đã cập nhật quyền nhiệm vụ')
}

const handleCreateTask = async (payload) => {
  if (!selectedTeamId.value) return;

  try {
    const formData = new FormData();

    // ⭐ GÓI DTO THÀNH JSON STRING
    const dto = {
      teamId: selectedTeamId.value,
      title: payload.title,
      description: payload.description || "",
      dueAt: payload.dueAt,                     // dạng ISO string
      applicationDeadline: payload.applicationDeadline || "",
      assigneeId: payload.assigneeId || null
    };

    formData.append("dto", new Blob(
        [JSON.stringify(dto)],
        { type: "application/json" }
    ));

    // ⭐ File đính kèm
    if (payload.attachments?.length) {
      payload.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    // CALL API
    await api.post("/user.thg/my-team/task/create", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    showSuccess("Tạo nhiệm vụ thành công");
    showCreateTaskModal.value = false;

    await loadTeamTasks();

  } catch (err) {
    console.error("❌ Lỗi tạo nhiệm vụ:", err);
    showError("Không thể tạo nhiệm vụ");
  }
};


const handleRespondInvite = async ({ invite, status }) => {
  await simulateDelay(200)
  const target = mockDatabase.incomingInvites.find((item) => item.id === invite.id)
  if (target) {
    target.status = status
    if (status === 'ACCEPTED') {
      const team = mockDatabase.teams.find((item) => item.teamId === target.teamId)
      if (team && !team.members.some((member) => member.id === currentUserId.value)) {
        team.members.push(currentUser.value)
        team.memberCount = team.members.length
      }
      await loadTeams()
      showSuccess('Bạn đã tham gia', target.teamName)
    }
  }
  await loadInvites()
}

const handleCreateTeam = async (payload) => {
  try {
    // Kiểm tra dữ liệu trước khi submit
    if (!payload.teamName?.trim()) {
      showError("Tên nhóm là bắt buộc")
      return
    }

    if (!payload.teamDesc?.trim()) {
      showError("Mô tả nhóm là bắt buộc")
      return
    }

    if (!payload.avatarFile) {
      showError("Vui lòng chọn ảnh nhóm")
      return
    }

    const formData = new FormData()

    formData.append("teamName", payload.teamName)
    formData.append("teamDescription", payload.teamDesc)
    formData.append("avatar", payload.avatarFile) // backend nhận MultipartFile

    const res = await api.post(
        "/user.thg/my-team/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
    )

    showCreateModal.value = false
    await loadTeams()
    await handleSelectTeam(res.data)
    showSuccess("Tạo nhóm thành công")
  } catch (e) {
    console.error(e)
    showError("Tạo nhóm thất bại")
  }
}


const handleRemoveMember = async (member) => {
  await confirmDeleteMember(member.fullName, async () => {
    const res = await api.delete("/user.thg/my-team/member/remove", {
      params: {
        teamId: selectedTeamId.value,
        memberId: member.idE
      }
    });

    const msg = res.data?.message || "Thực hiện xong";

    if (msg.includes("thành công")) {
      await loadTeamDetail();
    } else {
      // ❗ Không lỗi nhưng show cảnh báo
      showError(msg);
    }
  });
};

const handleChangeLeader = async (email) => {
  if (!selectedTeamId.value) return;

  const res = await api.post("/user.thg/my-team/leader/change", null, {
    params: {
      teamId: selectedTeamId.value,
      email
    }
  });

  const message = res.data?.message;

  if (message.includes("thành công")) {
    showSuccess(message);
    await loadTeamDetail();
  } else {
    showError(message);
  }
};

const handleDisbandTeam = async () => {

  await confirmWithInput(
      "Giải tán nhóm?",
      "Nhập: GIAI TAN để xác nhận",
      "GIAI TAN",
      async () => {

        const res = await api.post("/user.thg/my-team/disband", null, {
          params: {
            teamId: selectedTeamId.value
          }
        });

        const message = res.data?.message;

        if (message.includes("thành công")) {
          // reload lại danh sách team
          await loadTeams();

          selectedTeamId.value = null;
        } else {
          showError(message);
        }
      }
  );
};

const handleApproveApplier = async (u) => {
  try {
    await api.post(`/user.thg/my-team/applier/approve`, {
      teamId: selectedTeamId.value,
      applicantId: u.id
    });

    showSuccess("Đã duyệt CTV");
    await loadTeams();

  } catch (e) {
    showError("Không thể duyệt");
  }
};

const handleRejectApplier = async (u) => {
  try {
    await api.post(`/user.thg/my-team/applier/reject`, {
      teamId: selectedTeamId.value,
      applicantId: u.id
    });

    showSuccess("Đã từ chối");
    await loadTeams();

  } catch (e) {
    showError("Không thể từ chối");
  }
};

import {socketService} from "/src/services/socketService.js";
import { SOCKET_CONFIG } from "/src/config/socketConfig.js";


const scrollToBottom = async () => {
  await nextTick();

  const container = document.querySelector(".chat-messages");
  if (!container) return;

  container.scrollTop = container.scrollHeight;
};

const subscribeTeamChat = (teamId) => {
  const topic = SOCKET_CONFIG.teamChatTopic(teamId);

  console.log(`📡 Đang subscribe team #${teamId} → ${topic}`);

  socketService.subscribe(topic, (event) => {
    console.log("📥 [TEAM_CHAT EVENT]", event);

    if (!event || event.domain !== "TEAM_CHAT") return;

    const message = event.payload;

    // Nếu đang mở team này
    if (selectedTeamId.value === teamId) {
      chatMessages.value.push(message);
      scrollToBottom();
      if (isOwnMessage(message)) {
        setTimeout(() => scrollToBottom(), 120)
      }
      return;
    }

    // Nếu team khác → tăng số tin chưa đọc
    const team = teams.value.find(t => t.teamId === teamId);
    if (team) {
      team.unreadCount = (team.unreadCount || 0) + 1;
      console.log(`🔴 Unread +1 team #${teamId} =`, team.unreadCount);
    }
  });
};


/* ---------------------- Lifecycle ---------------------- */
onMounted(async () => {
  // 1) Load danh sách team
  await loadTeams();

  // 2) Kết nối socket
  const token = () => authStore.accessToken;
  socketService.connect(token);

  // 3) Subscribe chat cho từng team
  teams.value.forEach(team => {
    subscribeTeamChat(team.teamId);
    console.log(`📡 Subscribed → Team ${team.teamId}`);
  });

  // 4) Load QUYỀN cho team đầu tiên (nếu muốn)
  if (teams.value.length) {
    const rest = await authStore.fetchTeamPermissions(teams.value[0].teamId);
    console.log(rest.data);
  }
});


</script>

<style scoped>
.tab-navigation {
  border-bottom: 1px solid #dee2e6;
}

.nav-tabs .nav-link {
  color: #6c757d;
  font-weight: 500;
  border: none;
  padding: 0.75rem 1.25rem;
  transition: all 0.2s ease;
}

.nav-tabs .nav-link:hover {
  color: #495057;
  border: none;
  background-color: rgba(0, 0, 0, 0.03);
}

.nav-tabs .nav-link.active {
  color: #0030FF;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid #0030FF;
  font-weight: 600;
}

.tab-content {
  min-height: 400px;
}

.avatar-fallback {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.btn-gradient {
  background: linear-gradient(135deg, #1f4d88, #14213d);
  color: #fff;
  border: none;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(15, 32, 55, 0.25);
}

.btn-gradient:disabled {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .myteam-layout {
    padding: 0 0.75rem;
  }

  .nav-tabs .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>