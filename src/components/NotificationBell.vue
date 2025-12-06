<template>
  <div class="position-relative">
    <!-- 🔔 Nút chuông -->
    <button
        class="btn p-0 bg-transparent border-0 position-relative"
        @click="openModal"
        style="width: 38px; height: 38px;"
    >
      <i class="fa-solid fa-bell fs-4 text-primary"></i>

      <!-- 🔴 Badge số thông báo chưa đọc -->
      <span
          v-if="unreadCount > 0"
          class="position-absolute badge rounded-pill bg-danger d-flex align-items-center justify-content-center"
          style="min-width: 18px; height: 18px; font-size: 11px; top: 3px; right: 2px; transform: translate(35%, -35%); padding: 0; border: 2px solid white;"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Nền mờ -->
    <div v-if="showModal" class="modal-backdrop fade show" style="opacity: 0.25;"></div>

    <!-- 🪟 Modal -->
    <div
        v-if="showModal"
        class="modal fade show d-block"
        tabindex="-1"
        style="background: rgba(0,0,0,0.3);"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content border-0 shadow-lg" style="border-radius: 14px;">
          <!-- Header -->
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title mb-0">
              <i class="fa-solid fa-bell me-2"></i> Trung tâm thông báo
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>

          <!-- Tabs -->
          <ul class="nav nav-tabs bg-light px-3 pt-2">
            <li class="nav-item">
              <button
                  class="nav-link"
                  :class="{ active: activeTab === 'new' }"
                  @click="switchTab('new')"
              >
                🆕 Thông báo mới
                <span v-if="newNoti.length" class="badge bg-danger ms-1">{{ newNoti.length }}</span>
              </button>
            </li>
            <li class="nav-item">
              <button
                  class="nav-link"
                  :class="{ active: activeTab === 'read' }"
                  @click="switchTab('read')"
              >
                ✅ Đã đọc
              </button>
            </li>
          </ul>

          <!-- Body -->
          <div class="modal-body p-3">
            <div class="row" style="min-height: 420px;">
              <!-- Danh sách -->
              <div class="col-md-5 border-end" style="max-height: 500px; overflow-y: auto;">
                <div
                    v-for="(noti, index) in currentList"
                    :key="noti.id || index"
                    class="p-3 mb-2 border rounded notification-item"
                    :class="{ 'bg-light': activeTab === 'new' && !noti.pendingMove }"
                    style="cursor: pointer;"
                    @click="selectNotification(noti)"
                >
                  <div class="fw-semibold">{{ noti.title }}</div>
                  <div class="text-muted small text-truncate" style="max-width: 250px;">
                    {{ noti.message }}
                  </div>
                  <div class="text-secondary small">{{ formatDate(noti.dateTime) }}</div>
                </div>

                <div
                    v-if="currentList.length === 0"
                    class="text-center text-muted py-4"
                >
                  Không có thông báo nào.
                </div>
              </div>

              <!-- Chi tiết -->
              <div class="col-md-7 ps-4">
                <div v-if="!selectedNoti" class="text-center text-muted mt-5">
                  Hãy chọn 1 thông báo để xem chi tiết
                </div>

                <div v-else>
                  <h5 class="fw-bold mb-2">{{ selectedNoti.title }}</h5>
                  <p class="text-muted small mb-3">
                    {{ formatDate(selectedNoti.dateTime) }}
                  </p>
                  <div class="border p-3 rounded bg-light">
                    {{ selectedNoti.message }}
                  </div>
                  <div class="mt-3 text-end">
                    <span class="badge bg-success" v-if="selectedNoti.pendingMove">Tạm đã đọc</span>
                    <span class="badge bg-secondary" v-else-if="selectedNoti.isRead">Đã đọc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer border-0">
            <button class="btn btn-secondary" @click="closeModal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import  api  from "../api/api.js";

const showModal = ref(false);
const activeTab = ref("new");
const selectedNoti = ref(null);

const newNoti = ref([]);
const readNoti = ref([]);

// Tổng số chưa đọc
const unreadCount = computed(() => newNoti.value.length);

// Danh sách hiện tại theo tab
const currentList = computed(() =>
    activeTab.value === "new" ? newNoti.value : readNoti.value
);

// 🔄 Gọi API lấy thông báo
async function loadNotifications() {
  try {
    const res = await api.get("/admin.thg/notification/list");
    newNoti.value = res.data.new || [];
    readNoti.value = res.data.read || [];
    console.log(res.data);
  } catch (err) {
    console.error("❌ Lỗi khi load thông báo:", err);
  }
}

// 📬 Đánh dấu đã đọc
async function markAsRead(noti) {
  try {
    await api.post("/admin.thg/notification/read", null, {
      params: { notificationId: noti.id },
    });
    console.log("✅ Đã đánh dấu đã đọc:", noti.id);
  } catch (err) {
    console.error("❌ Lỗi khi đánh dấu đã đọc:", err);
  }
}

function openModal() {
  showModal.value = true;
}

function closeModal() {
  // Khi đóng modal, chuyển pendingMove => isRead
  newNoti.value = newNoti.value.filter(n => !n.pendingMove);
  readNoti.value.push(
      ...newNoti.value.filter(n => n.pendingMove).map(n => ({ ...n, isRead: true, pendingMove: false }))
  );
  selectedNoti.value = null;
  showModal.value = false;
}

function switchTab(tab) {
  activeTab.value = tab;
  selectedNoti.value = null;
}

function selectNotification(noti) {
  selectedNoti.value = noti;

  // Nếu chưa đọc thì đánh dấu là đã đọc và chuyển qua tab "Đã đọc" ngay
  if (!noti.isRead) {
    markAsRead(noti); // Gọi API backend

    // Xóa khỏi danh sách "mới"
    newNoti.value = newNoti.value.filter(n => n.id !== noti.id);

    // Đánh dấu đã đọc và thêm sang danh sách "đã đọc"
    noti.isRead = true;
    readNoti.value.unshift(noti);

    // Nếu đang ở tab "new", thì vẫn giữ modal nhưng nó sẽ biến mất khỏi danh sách
    if (activeTab.value === "new" && newNoti.value.length === 0) {
      activeTab.value = "read"; // Nếu không còn mới thì tự chuyển sang tab đã đọc
    }
  }
}


function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("vi-VN");
}

onMounted(() => {
  loadNotifications();
});

import { socketService } from "../services/socketService.js";
import { SOCKET_CONFIG } from "../config/socketConfig.js";
import { useAuthStore } from "../stores/authStore.js"
const authStore = useAuthStore();
onMounted(() => {
  const token = () => authStore.accessToken;
  socketService.connect(token);
  const employeeId = authStore.userInfo?.id;

  socketService.subscribe(SOCKET_CONFIG.notificationTopic(employeeId), (event) => {
    console.log("🔔 Có thông báo mới:", event);
    // => thêm vào danh sách thông báo
    if (event?.payload) {
      loadNotifications();
    }
  });
});

</script>

<style scoped>
.notification-item:hover {
  background-color: #eef5ff !important;
  transition: 0.2s;
}

.modal-content {
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
