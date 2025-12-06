<template>
  <div class="modal fade show d-block" tabindex="-1" v-if="visible">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content rounded-5 shadow-lg fs-6">
        <!-- HEADER -->
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center gap-2">
            <h5 class="fw-bold mb-0">{{ task.code }}</h5>
            <i class="fa-solid fa-flag text-secondary"></i>
          </div>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <!-- BODY -->
        <div class="modal-body d-flex gap-4">
          <!-- LEFT COLUMN -->
          <div class="flex-grow-1">
            <h5 class="fw-bold text-dark mb-2">{{ task.title }}</h5>
            <div class="d-flex align-items-center gap-2 mb-3">
              <span class="badge bg-light-purple text-dark fw-semibold px-3 py-2">{{ task.status }}</span>
            </div>

            <!-- DESCRIPTION -->
            <div class="mb-4">
              <label class="fw-semibold mb-1">Mô tả:</label>
              <div
                  v-if="!editField.description"
                  class="border rounded-3 bg-white p-3 small shadow-sm"
                  style="cursor: pointer;"
                  @click="editField.description = true"
              >
                <!-- Trường mô tả hiển thị nội dung HTML từ Quill Editor -->
                <div
                    v-if="task.description"
                    class="description-view"
                    v-html="task.description"
                ></div>
                <span v-else class="text-muted fst-italic">Chưa có mô tả</span>
              </div>
              <div v-else>
                <DescriptionEditor v-model="task.description" ref="modalDescriptionEditor" />
                <div class="d-flex justify-content-end gap-2 mt-2">
                  <button class="btn btn-primary btn-sm" type="button" @click="editField.description = false">Lưu mô tả</button>
                </div>
              </div>
            </div>

            <!-- ATTACHMENTS -->
            <div class="mb-3">
              <i class="fa-solid fa-paperclip me-2"></i>
              <div
                  v-for="(file, index) in task.attachments"
                  :key="index"
                  class="d-inline-flex align-items-center me-3 mb-2 bg-light rounded px-2 py-1"
              >
                <span class="text-primary fw-semibold small me-2">{{ file }}</span>
                <button class="btn btn-sm btn-light p-0 text-danger" @click="removeFile(index)">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <!-- BUTTONS -->
            <div class="d-flex gap-2 mb-3">
              <button class="btn btn-primary btn-sm px-3 py-1">Lưu</button>
              <button class="btn btn-outline-secondary btn-sm px-3 py-1" @click="close">Hủy</button>
            </div>

            <!-- COMMENTS -->
            <div class="mb-2">
              <label class="fw-semibold mb-1">Bình luận:</label>
              <input
                  type="text"
                  class="form-control text-fix"
                  v-model="newComment"
                  placeholder="Nhập bình luận..."
              />
            </div>

            <div
                v-for="(c, i) in task.comments"
                :key="i"
                class="d-flex align-items-start gap-2 py-3 border-bottom"
            >
              <div class="avatar-circle" :style="{ backgroundColor: c.color }">
                {{ c.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <div class="fw-semibold small">
                  {{ c.name }}
                  <span class="text-secondary ms-2">{{ c.time }}</span>
                </div>
                <div class="text-muted small">{{ c.text }}</div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="right-panel p-4 rounded-5 bg-light flex-shrink-0" style="width: 460px;">
            <!-- Tabs -->
            <div class="d-flex mb-3 border-bottom pb-2">
              <button
                  class="tab-btn flex-fill"
                  :class="{ active: activeTab === 'details' }"
                  @click="activeTab = 'details'"
              >
                Chi tiết
              </button>
              <button
                  class="tab-btn flex-fill"
                  :class="{ active: activeTab === 'logs' }"
                  @click="activeTab = 'logs'"
              >
                Nhật ký
              </button>
            </div>

            <!-- TAB: DETAILS -->
            <div v-if="activeTab === 'details'" class="small">
              <!-- Người tạo -->
              <div class="field-line">
                <strong>Người tạo:</strong>
                <div class="person">
                  <div class="avatar-option" :style="{ backgroundColor: task.creator.color }">
                    {{ task.creator.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="fw-semibold">{{ task.creator.name }}</div>
                    <div class="text-secondary small">{{ task.creator.email }}</div>
                  </div>
                </div>
              </div>

              <!-- Người giao việc -->
              <div class="field-line">
                <strong>Người giao việc:</strong>
                <div class="person">
                  <div class="avatar-option" :style="{ backgroundColor: task.assigner.color }">
                    {{ task.assigner.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="fw-semibold">{{ task.assigner.name }}</div>
                    <div class="text-secondary small">{{ task.assigner.email }}</div>
                  </div>
                </div>
              </div>

              <!-- Người thực hiện -->
              <div class="field-line">
                <strong>Người thực hiện:</strong>
                <v-select
                    v-model="task.implementer"
                    :options="implementers"
                    label="name"
                    :reduce="(p) => p"
                    :clearable="false"
                    class="vselect-clean flex-grow-1"
                    @search:focus="isFocused = true"
                    @search:blur="isFocused = false"
                >
                  <template #selected-option="{ name, color, email }">
                    <div v-if="!isFocused" class="person">
                      <div class="avatar-option" :style="{ backgroundColor: color }">
                        {{ name.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <div class="fw-semibold">{{ name }}</div>
                        <div class="text-secondary small">{{ email }}</div>
                      </div>
                    </div>
                  </template>

                  <template #option="{ name, color, email }">
                    <div class="person">
                      <div class="avatar-option" :style="{ backgroundColor: color }">
                        {{ name.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <div class="fw-semibold">{{ name }}</div>
                        <div class="text-secondary small">{{ email }}</div>
                      </div>
                    </div>
                  </template>
                </v-select>
              </div>

              <!-- Effort -->
              <div class="field-line" @click="toggleEdit('effort')">
                <strong>Effort:</strong>
                <input
                    v-if="editField.effort"
                    type="number"
                    class="form-control form-control-sm text-fix"
                    v-model="task.effort"
                    @blur="editField.effort = false"
                />
                <span v-else class="editable">{{ task.effort }}</span>
              </div>

              <div class="field-line" @click="toggleEdit('startDate')">
                <strong>Bắt đầu:</strong>
                <input
                    v-if="editField.startDate"
                    type="date"
                    class="form-control form-control-sm text-fix"
                    v-model="task.startDate"
                    @blur="editField.startDate = false"
                />
                <span v-else class="editable">{{ task.startDate }}</span>
              </div>

              <div class="field-line" @click="toggleEdit('endDate')">
                <strong>Hạn hoàn thành:</strong>
                <input
                    v-if="editField.endDate"
                    type="date"
                    class="form-control form-control-sm text-fix"
                    v-model="task.endDate"
                    @blur="editField.endDate = false"
                />
                <span v-else class="editable">{{ task.endDate }}</span>
              </div>

              <hr class="my-3" />

              <div class="field-line">
                <strong>Tiến độ:</strong>
                <div class="d-flex align-items-center gap-2 flex-grow-1">
                  <input type="range" class="form-range flex-grow-1" min="0" max="100" v-model="task.progress" />
                  <span>{{ task.progress }}%</span>
                </div>
              </div>

              <div class="field-line" @click="toggleEdit('achievedEffort')">
                <strong>Effort đạt:</strong>
                <input
                    v-if="editField.achievedEffort"
                    type="number"
                    class="form-control form-control-sm text-fix"
                    v-model="task.achievedEffort"
                    @blur="editField.achievedEffort = false"
                />
                <span v-else class="editable">{{ task.achievedEffort }}</span>
              </div>
            </div>

            <!-- TAB: LOGS (2 COLUMNS) -->
            <div v-else class="small">
              <div
                  v-for="(log, i) in task.logs"
                  :key="i"
                  class="log-row align-items-start py-3 border-bottom"
              >
                <div class="log-left">
                  <div class="avatar-circle small-avatar" :style="{ backgroundColor: log.color }">
                    {{ log.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="fw-semibold">{{ log.name }}</div>
                    <div class="text-secondary small">{{ log.time }}</div>
                  </div>
                </div>
                <div class="log-right text-muted">{{ log.action }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import vSelect from "vue3-select";
import "vue3-select/dist/vue3-select.css";
import DescriptionEditor from "./common/DescriptionEditor.vue";

const visible = ref(true);
const activeTab = ref("details");
const newComment = ref("");
const isFocused = ref(false);
const modalDescriptionEditor = ref(null);

const implementers = [
  { name: "Ngô Quốc Phú", color: "#d0ebff", email: "phu@thg.vn" },
  { name: "Diệp Minh Thuận", color: "#ffe066", email: "thuan@thg.vn" },
  { name: "Khánh Vy", color: "#b8e994", email: "vy@thg.vn" },
  { name: "Ngọc Anh", color: "#fab1a0", email: "anh@thg.vn" },
];

const editField = ref({
  description: false,
  effort: false,
  achievedEffort: false,
  startDate: false,
  endDate: false,
});

const task = ref({
  code: "VV-09",
  title: "Làm chức năng Quản lý khách hàng",
  status: "In Progress",
  description: "• Quản lý khách hàng theo khu vực, thống kê và cảnh báo.",
  attachments: ["KeHoachDuAn.docx", "KeHoachDuAn.xls"],
  creator: { name: "Ngô Quốc Phú", email: "phu@thg.vn", color: "#d0ebff" },
  assigner: { name: "Nguyễn Văn Tùng", email: "tung@thg.vn", color: "#ffd8a8" },
  implementer: { name: "Diệp Minh Thuận", color: "#ffe066", email: "thuan@thg.vn" },
  effort: 34,
  achievedEffort: 20,
  startDate: "2025-09-02",
  endDate: "2025-10-02",
  progress: 30,
  comments: [
    { name: "Ngô Quốc Phú", text: "Thông tin thêm nhiều tí", time: "21/02/2013 12:10", color: "#f3d996" },
  ],
  logs: [
    { name: "Ngô Quốc Phú", action: "Tạo mới công việc.", time: "21/02/2013 10:10", color: "#f3d996" },
    { name: "Diệp Minh Thuận", action: "Cập nhật tiến độ từ 30% lên 80%.", time: "21/02/2013 14:20", color: "#b8e994" },
    { name: "Khánh Vy", action: "Thêm file KeHoachDuAn.xls.", time: "21/02/2013 15:45", color: "#b3d9ff" },
  ],
});

function toggleEdit(field) {
  editField.value[field] = true;
}
function removeFile(index) {
  task.value.attachments.splice(index, 1);
}
function close() {
  visible.value = false;
}
</script>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.35);
}
.bg-light-purple {
  background-color: #e5d6ff !important;
}
.modal-content {
  border-radius: 20px !important;
}
.right-panel {
  border-radius: 20px;
}
.field-line {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 1.2rem;
}
.person {
  display: flex;
  align-items: center;
  gap: 8px;
}
.avatar-circle,
.avatar-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
.small-avatar {
  width: 26px;
  height: 26px;
  font-size: 12px;
}
.tab-btn {
  border: none;
  background: transparent;
  padding: 6px 10px;
  border-radius: 10px 10px 0 0;
  font-weight: 600;
  color: #555;
  transition: 0.2s;
}
.tab-btn.active {
  background-color: #dce8c7;
  color: #000;
}
.tab-btn:not(.active):hover {
  background-color: #f2f2f2;
}

/* SELECT FIX CARET */
.vselect-clean .vs__dropdown-toggle {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  height: 42px !important;
  padding: 0 6px !important;
  cursor: pointer !important;
}
.vselect-clean .vs__dropdown-toggle:hover {
  background: #f8f9fa !important;
  border-radius: 10px;
}
.vselect-clean .vs__search {
  margin: 0 !important;
  padding: 0 !important;
  flex: 1 !important;
  width: auto !important;
  min-width: 1px !important;
  font-size: 15px !important;
  text-align: left !important;
  background: transparent !important;
}
.vs__clear {
  display: none !important;
}

/* LOGS - TWO COLUMNS */
.log-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
}
.log-left {
  display: flex;
  align-items: flex-start;
  border-right: solid 1px black;
  background-color: rgba(255, 0, 0, 0.1);
  gap: 8px;
}
.log-right {

  line-height: 1.5;
  padding-top: 4px;
}
.log-row:hover {
  background: #f8f9fa;
  border-radius: 10px;
  transition: 0.2s;
}
</style>
