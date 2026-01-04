<template>
  <div class="applicants-tab px-3">
    <div class="tab-toolbar d-flex flex-wrap align-items-start align-items-md-center justify-content-between mb-3 gap-3">
      <div>
        <h6 class="mb-1 fw-semibold">Ứng tuyển theo công việc</h6>
        <p class="text-muted small mb-0">
          Theo dõi danh sách ứng viên đang ứng tuyển các công việc trong dự án.
        </p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <div class="position-relative search-field">
          <i class="fa-solid fa-magnifying-glass position-absolute text-muted"></i>
          <input
            v-model="searchKeyword"
            type="text"
            class="form-control form-control-sm ps-5"
            placeholder="Tìm theo tên công việc hoặc ứng viên"
          />
        </div>
      </div>
    </div>


    <div class="table-responsive bg-white shadow-sm rounded-4 position-relative">
      <table class="table table-hover align-middle mb-0 applicants-table">
        <thead class="table-light text-secondary">
          <tr>
            <th scope="col">Ứng viên</th>
            <th scope="col">Công việc</th>
            <th scope="col">Ngày ứng tuyển</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Tệp đính kèm</th>
            <th scope="col" class="text-end">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="applicant in filteredApplicants" :key="applicant.id">
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="applicant-avatar">
                  <img
                    v-if="applicant.avatarUrl"
                    :src="applicant.avatarUrl"
                    :alt="applicant.candidateName"
                  />
                  <span v-else>{{ applicant.initials }}</span>
                </div>
                <div>
                  <div class="fw-semibold">{{ applicant.candidateName }}</div>
                  <div class="text-muted extra-small">
                    {{ applicant.email }} · {{ applicant.phone }}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="fw-semibold">{{ applicant.jobTitle }}</div>
            </td>
            <td>
              <div class="fw-semibold">{{ applicant.appliedDate }}</div>
            </td>
            <td>
              <span :class="['status-pill', statusClass(applicant.status)]">
                {{ applicant.status }}
              </span>
            </td>
            <td>
              <button
                v-if="applicant.file"
                type="button"
                class="btn btn-link p-0 text-primary fw-semibold"
                @click="openFile(applicant.file)"
              >
                <i class="fa-solid fa-paperclip me-1"></i>
                {{ applicant.file.fileName || "Tệp đính kèm" }}
              </button>
              <span v-else class="text-muted small">Không có tệp</span>
            </td>
            <td class="text-end">
              <div v-if="canTakeAction(applicant.status)" class="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-success"
                  @click="openAcceptModal(applicant)"
                >
                  <i class="fa-solid fa-check me-1"></i>
                  Chấp nhận
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-outline-danger"
                  @click="openRejectModal(applicant)"
                >
                  <i class="fa-solid fa-xmark me-1"></i>
                  Từ chối
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!filteredApplicants.length">
            <td colspan="6" class="text-center text-muted py-4">
              Không tìm thấy ứng viên phù hợp.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showAcceptModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h6 class="modal-title fw-semibold">Thư chào mừng</h6>
            <button type="button" class="btn-close" @click="closeModals"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted small mb-2">
              Gửi thư chào mừng cho ứng viên <strong>{{ selectedApplicant?.candidateName }}</strong>.
            </p>
            <textarea
              v-model="welcomeMessage"
              class="form-control"
              rows="4"
              placeholder="Nhập nội dung thư chào mừng..."
            ></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="closeModals">Hủy</button>
            <button type="button" class="btn btn-primary" @click="submitAccept">
              Gửi thư
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showRejectModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h6 class="modal-title fw-semibold">Thư từ chối</h6>
            <button type="button" class="btn-close" @click="closeModals"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted small mb-2">
              Lý do từ chối (có thể bỏ qua) cho
              <strong>{{ selectedApplicant?.candidateName }}</strong>.
            </p>
            <textarea
              v-model="rejectReason"
              class="form-control"
              rows="4"
              placeholder="Nhập lý do từ chối (không bắt buộc)..."
            ></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="closeModals">Hủy</button>
            <button type="button" class="btn btn-danger" @click="submitReject">
              Xác nhận từ chối
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAcceptModal || showRejectModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import api from "../../../api/api.js";
import { fetchPrivateDownloadUrl } from "../../../api/fileApi.js";
import { showError, showSuccess } from "../../../assets/js/alertService.js";

const props = defineProps({
  projectId: {
    type: Number,
    required: true
  }
});

const applicants = ref([]);

const searchKeyword = ref("");
const showAcceptModal = ref(false);
const showRejectModal = ref(false);
const selectedApplicant = ref(null);
const welcomeMessage = ref("");
const rejectReason = ref("");
let searchTimeout = null;

const ASSET_BASE_URL = "https://s3.cloudfly.vn/thg-storage-dev/uploads-public/";

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa cập nhật";
  return new Intl.DateTimeFormat("vi-VN").format(date);
};

const getInitials = (name) => {
  if (!name) return "--";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(-2).map((part) => part[0]).join("");
  return initials.toUpperCase() || "--";
};

const buildAvatarUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${ASSET_BASE_URL}${path}`;
};

const mapApplicant = (item) => {
  const file = item?.files?.[0] ?? null;
  return {
    id: item?.ungTuyenId ?? `${item?.nguoiUngTuyenId ?? ""}-${item?.workItemId ?? ""}`,
    candidateName: item?.hoTen ?? "Chưa cập nhật",
    initials: getInitials(item?.hoTen),
    email: item?.email ?? "Chưa cập nhật",
    phone: item?.soDienThoai ?? "Chưa cập nhật",
    avatarUrl: buildAvatarUrl(item?.avatar),
    jobTitle: item?.tenViTri ?? "Chưa cập nhật",
    appliedDate: formatDate(item?.ngayUngTuyen),
    status: item?.trangThai ?? "Đang đánh giá",
    workItemId: item?.workItemId ?? null,
    applicationId: item?.ungTuyenId ?? null,
    file: file
      ? {
          id: file.id,
          fileName: file.fileName,
          url: file.url,
          isPrivate: file.isPrivate
        }
      : null
  };
};

const fetchApplicants = async () => {
  if (!props.projectId) return;
  try {
    const response = await api.get("/admin.thg/project/work/ung-tuyen", {
      params: {
        projectId: props.projectId,
        search: searchKeyword.value.trim() || undefined
      }
    });
    const data = Array.isArray(response?.data) ? response.data : [];
    applicants.value = data.map(mapApplicant);
  } catch (error) {
    console.error("Không thể tải danh sách ứng tuyển:", error);
    showError("Không thể tải danh sách ứng tuyển.");
  }
};

const triggerBrowserDownload = (url, fileName) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener";
  if (fileName) anchor.download = fileName;
  anchor.click();
};

const openFile = async (file) => {
  if (!file) return;
  try {
    const downloadUrl = await fetchPrivateDownloadUrl(file.id);
    if (!downloadUrl) {
      showError("Không thể tải tệp đính kèm.");
      return;
    }

    triggerBrowserDownload(downloadUrl, file.fileName);
  } catch (error) {
    console.error("Không thể mở tệp đính kèm:", error);
    showError("Không thể tải tệp đính kèm.");
  }
};

const filteredApplicants = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();

  return applicants.value.filter((applicant) => {
    if (!keyword) return true;
    const matchesJob = applicant.jobTitle.toLowerCase().includes(keyword);
    const matchesCandidate = applicant.candidateName.toLowerCase().includes(keyword);
    return matchesJob || matchesCandidate;
  });
});

const openAcceptModal = (applicant) => {
  selectedApplicant.value = applicant;
  welcomeMessage.value = "";
  showAcceptModal.value = true;
  showRejectModal.value = false;
};

const openRejectModal = (applicant) => {
  selectedApplicant.value = applicant;
  rejectReason.value = "";
  showRejectModal.value = true;
  showAcceptModal.value = false;
};

const closeModals = () => {
  showAcceptModal.value = false;
  showRejectModal.value = false;
  selectedApplicant.value = null;
};

const submitDecision = async ({ isAccepted }) => {
  if (!selectedApplicant.value) return;
  const payload = {
    workItemId: selectedApplicant.value.workItemId,
    ungTuyenId: selectedApplicant.value.applicationId,
    flag: isAccepted,
    lyDo: rejectReason.value.trim() || null,
    thuChao: welcomeMessage.value.trim() || null
  };

  try {
    await api.post("/admin.thg/project/work/ung-tuyen/duyet", payload);
    selectedApplicant.value.status = isAccepted ? "Đạt yêu cầu" : "Không phù hợp";
    showSuccess(isAccepted ? "Đã chấp nhận ứng viên." : "Đã từ chối ứng viên.");
    closeModals();
  } catch (error) {
    console.error("Không thể cập nhật trạng thái ứng tuyển:", error);
    showError("Không thể cập nhật trạng thái ứng tuyển.");
  }
};

const submitAccept = () => submitDecision({ isAccepted: true });
const submitReject = () => submitDecision({ isAccepted: false });

const canTakeAction = (status) => status === "Đang đánh giá";

const statusClass = (status) => {
  switch (status) {
    case "Đang đánh giá":
      return "status-review";
    case "Đã nhận hồ sơ":
      return "status-received";
    case "Phỏng vấn":
      return "status-interview";
    case "Đạt yêu cầu":
      return "status-pass";
    case "Không phù hợp":
      return "status-reject";
    default:
      return "status-review";
  }
};

watch(
  () => props.projectId,
  () => {
    fetchApplicants();
  },
  { immediate: true }
);

watch(searchKeyword, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchApplicants();
  }, 350);
});
</script>

<style scoped>
.applicants-tab {
  width: 100%;
  padding-bottom: 8px;
}

.search-field {
  min-width: 320px;
}

.search-field i {
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
}

.applicants-table th,
.applicants-table td {
  padding: 14px 16px;
}

.applicant-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #eef1ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #4c5be5;
  overflow: hidden;
}

.applicant-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.extra-small {
  font-size: 12px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-review {
  background: rgba(76, 91, 229, 0.12);
  color: #4c5be5;
}

.status-received {
  background: rgba(14, 165, 233, 0.12);
  color: #0284c7;
}

.status-interview {
  background: rgba(245, 158, 11, 0.16);
  color: #b45309;
}

.status-pass {
  background: rgba(34, 197, 94, 0.16);
  color: #15803d;
}

.status-reject {
  background: rgba(239, 68, 68, 0.16);
  color: #b91c1c;
}
</style>
