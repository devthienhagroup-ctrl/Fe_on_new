  <template>
    <div class="all-work-items" >
      <div class="tab-toolbar d-flex flex-wrap align-items-center justify-content-between mb-3">
        <div class="d-flex align-items-center flex-wrap gap-3">
          <div class="records-display d-flex align-items-center">
            <span class="text-muted small me-2">Hiển thị</span>
            <input
              v-model.number="size"
              type="number"
              min="1"
              class="form-control form-control-sm text-center"
              @change="handleSizeChange"
            />
            <span class="text-muted small ms-2">/ <strong>{{ totalItems }}</strong> bản ghi</span>
          </div>

          <div class="pagination-controls d-flex align-items-center gap-1">
            <button class="btn btn-sm btn-light border" @click="goToFirstPage" :disabled="page === 1">
              <i class="fa-solid fa-backward-step"></i>
            </button>
            <button class="btn btn-sm btn-light border" @click="prevPage" :disabled="page === 1">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <span class="text-muted small px-2">{{ pageSummary }}</span>
            <button class="btn btn-sm btn-light border" @click="nextPage" :disabled="page === totalPages">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <button class="btn btn-sm btn-light border" @click="goToLastPage" :disabled="page === totalPages">
              <i class="fa-solid fa-forward-step"></i>
            </button>
          </div>
        </div>

        <div class="d-flex align-items-center flex-wrap gap-2">
          <div class="search-group d-flex align-items-center">
            <div class="input-group input-group-sm">
              <input
                v-model="searchInput"
                @keyup.enter="applySearch"
                type="text"
                class="form-control"
                placeholder="Nhập tên công việc..."
              />
              <button class="btn btn-primary" type="button" @click="applySearch">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>

          <div class="sort-group">
            <select v-model="selectedSortKey" class="form-select form-select-sm" @change="handleSortChange">
              <option v-for="option in sortOptions" :key="option.key" :value="option.key">
                {{ option.label }}
              </option>
            </select>
          </div>

          <button class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2" @click="openFilterModal">
            <i class="fa-solid fa-filter"></i>
            Bộ lọc
          </button>
        </div>
      </div>

      <div class="kanban-board-wrapper position-relative">
        <div v-if="loading" class="table-overlay d-flex align-items-center justify-content-center rounded-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div class="kanban-board d-flex flex-wrap">
          <div
            v-for="column in kanbanColumns"
            :key="column.value"
            class="kanban-column shadow-sm rounded-4 d-flex flex-column"
            :class="{ 'is-drop-target': dragState.overStatus === column.value && dragState.activeId }"
            @dragover.prevent="onDragOver(column.value, $event)"
            @dragenter.prevent="onDragEnter(column.value)"
            @dragleave="onDragLeave(column.value, $event)"
            @drop.prevent="onDrop(column.value)"
          >
            <div class="kanban-column-header d-flex align-items-center justify-content-between mb-3">
              <div class="d-flex align-items-center gap-2 text-uppercase fw-semibold text-secondary">
                <span>{{ column.label }}</span>
                <span class="badge bg-light text-secondary fw-semibold">
                  {{ groupedWorkItems[column.value]?.length || 0 }}
                </span>
              </div>
              <button
                  v-if="column.value === 'TODO'"
                  class="btn btn-sm btn-outline-primary fw-semibold mb-0"
                  type="button"
              >
                + Create
              </button>
              <button
                  v-else
                  class="btn btn-sm invisible mb-0"
              >
                + Create
              </button>
            </div>

            <div class="kanban-cards flex-grow-1 d-flex flex-column pe-0 gap-2">
              <div
                v-if="!loading && (!groupedWorkItems[column.value] || groupedWorkItems[column.value].length === 0)"
                class="text-muted small fst-italic text-center py-3 bg-light rounded-3"
              >
                Không có công việc
              </div>

              <div
                v-for="item in groupedWorkItems[column.value]"
                :key="item.workItemID"
                class="kanban-card"
                :class="{
                  'is-dragging': dragState.activeId === item.workItemID,
                  'kanban-card--disabled': !canDetail
                }"
                :draggable="canUpdate"
                @dragstart="onDragStart(item, column.value, $event)"
                @dragend="onDragEnd"
                @click="handleCardClick(item.workItemID)"
                role="button"
              >
                <div class="kanban-card-body">
                  <div class="d-flex align-items-start justify-content-between gap-2">
                    <h6 class="fw-semibold text-dark mb-0 kanban-card-title">{{ item.title }}</h6>
                    <div class="d-flex align-items-center gap-2">
                      <i :class="item.priority ? 'fa-solid fa-flag text-warning' : 'fa-regular fa-flag text-muted'"></i>
                    </div>
                  </div>

                  <div>
                    <div v-if="item.implementer" class="d-flex align-items-center gap-2">
                      <img
                        class="avatar-small"
                        :src="item.implementer.avatar
                          ? ` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${item.implementer.avatar}`
                          : '/images/default-avatar.png'"
                        alt="Avatar nhân viên"
                      />
                      <div class="text-truncate flex-grow-1">
                        <div class="fw-semibold text-dark small mb-0">{{ item.implementer.fullName }}</div>
                        <div class="text-muted extra-small text-truncate">{{ item.implementer.email }}</div>
                      </div>
                    </div>
                    <div v-else-if="item.implementerTeam" class="d-flex align-items-center gap-2">
                      <img
                        class="avatar-small"
                        :src="item.implementerTeam.avatar
                          ? ` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${item.implementerTeam.avatar}`
                          : '/images/default-team.png'"
                        alt="Avatar nhóm"
                      />
                      <div>
                        <div class="fw-semibold text-dark small mb-0">{{ item.implementerTeam.teamName }}</div>
                        <div class="text-muted extra-small">Team</div>
                      </div>
                    </div>
                    <div v-else class="d-flex align-items-center gap-2 text-danger extra-small">
                      <i class="fas fa-exclamation-triangle"></i>
                      <span>Chưa phân công</span>
                    </div>
                  </div>

                  <div class="d-flex align-items-center justify-content-between">
                    <div class="text-muted extra-small d-flex align-items-center gap-2">
                      <i
                        v-if="item.type"
                        :class="item.type.icon"
                        :style="{ color: item.type.color, fontSize: '1rem' }"
                      ></i>
                      <i class="fa-regular fa-calendar"></i>
                      <span>{{ formatDate(item.deadline) }}</span>
                    </div>
                    <div class="d-inline-flex align-items-center">
                    <i
                        v-if="item.status === 'DONE'"
                        class="fa-solid fa-check-circle text-success me-2"
                        aria-hidden="true"
                    ></i>
                    <span
                      class="badge fw-semibold px-2 py-1  gap-1"
                      :class="progressBadgeClass(item.progress)"
                    >
                      {{ progressLabel(item.progress) }}
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isFilterModalOpen" class="filter-modal-backdrop" @click.self="closeFilterModal">
        <div class="filter-modal rounded-4 shadow-lg">
          <div class="modal-header border-0 pb-0">
            <h6 class="modal-title fw-bold">Bộ lọc công việc</h6>
            <button type="button" class="btn-close"  style="
      width: 2rem;
      height: 2rem;
      opacity: 0.8;
    " @click="closeFilterModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label small text-muted">Trạng thái</label>
                <select v-model="pendingFilters.status" class="form-select">
                  <option :value="null">Tất cả</option>
                  <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                    {{ status.label }}
                  </option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label small text-muted">Loại</label>
                <select v-model="pendingFilters.typeId" class="form-select">
                  <option :value="null">Tất cả</option>
                  <option v-for="type in typeOptions" :key="type.id" :value="type.id">{{ type.name }}</option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label small text-muted">Tiến độ</label>
                <select v-model="pendingFilters.progress" class="form-select">
                  <option :value="null">Tất cả</option>
                  <option v-for="progress in progressOptions" :key="progress.value" :value="progress.value">
                    {{ progress.label }}
                  </option>
                </select>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label small text-muted">Ưu tiên</label>
                <select v-model="pendingFilters.priority" class="form-select">
                  <option :value="null">Tất cả</option>
                  <option v-for="priority in priorityOptions" :key="priority.value" :value="priority.value">
                    {{ priority.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0 pt-4">
            <button type="button" class="btn btn-light me-3" @click="resetPendingFilters">Đặt lại</button>
            <button type="button" class="btn btn-primary" @click="applyFilters">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>


  <!--  modal detail-->
    <div class="modal fade show d-block" tabindex="-1" v-if="showModalDetail">
      <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content rounded-5 shadow-lg fs-6">
          <!-- HEADER -->
          <div class="modal-header border-0 pb-0">
            <div class="d-flex align-items-center gap-2">
              <i :class="task.iconType" :style="{ color: task.colorType, fontSize: '20px' }"></i>
              <h5 class="fw-bold mb-0"> VV - {{ task.id }}</h5>
              <i
                  :class="task.priority
                  ? 'fa-solid fa-flag text-warning'    // khi priority = true
                  : 'fa-regular fa-flag text-muted'   // khi priority = false
                "
              ></i>
            </div>
            <button type="button" class="btn-close" @click="close"></button>
          </div>

          <!-- BODY -->
          <div class="modal-body d-flex gap-4 modal-body-fixed">
          <!-- LEFT COLUMN -->
            <div class="flex-grow-1">
              <!-- Tiêu đề (cho phép chỉnh sửa) -->
              <div class="mb-3">
                <template v-if="canUpdate">
                  <h1
                      v-if="!editField.title"
                      class="editable-heading"
                      style="font-size: 24px;"
                      @click="startEditing('title')"
                  >
                    {{ task.title || '— Chưa có tiêu đề —' }}
                  </h1>
                  <input
                      v-else
                      type="text"
                      class="form-control text-fix"
                      style="font-size: 24px!important;"
                      v-model="task.title"
                      ref="titleInputRef"
                      @blur="finishEditing('title')"
                      @keyup.enter.prevent="finishEditing('title')"
                  />
                </template>
                <h1 v-else style="font-size: 24px;">
                  {{ task.title || '— Chưa có tiêu đề —' }}
                </h1>
              </div>

              <div class="mt-3 mb-3">
                <template v-if="canUpdate">
                  <div class="dropdown">
                    <button
                        class="btn fw-semibold dropdown-toggle px-3 py-2"
                        :class="statusBadgeClass(task.status)"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style="font-size: 14px;"
                    >
                      {{ statusLabel(task.status) }}
                    </button>

                    <ul class="dropdown-menu shadow">
                      <li
                          v-for="s in statusOptions"
                          :key="s.value"
                          @click="changeStatus(s.value)"
                          class="dropdown-item d-flex align-items-center gap-2"
                          style="cursor: pointer;"
                      >
                        <i :class="statusIcon(s.value)" :style="{ color: s.color }"></i>
                        {{ s.label }}
                      </li>
                    </ul>
                  </div>
                </template>
                <template v-else>
                  <span
                      class="badge fw-semibold px-3 py-2"
                      :class="statusBadgeClass(task.status)"
                      style="font-size: 14px;"
                  >
                    {{ statusLabel(task.status) }}
                  </span>
                </template>
              </div>


              <!-- DESCRIPTION -->
              <div class="mb-4">
                <label class="fw-semibold mb-1">Mô tả:</label>
                <template v-if="canUpdate">
                  <div
                      v-if="!editField.description"
                      class="border rounded-3 bg-white p-3 editable-block"
                      style="font-size: 15.5px !important;"
                      @click="startEditing('description')"
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
                    <DescriptionEditor ref="descriptionEditorRef" v-model="task.description" />
                    <div class="d-flex justify-content-end gap-2 mt-2">
                      <button class="btn btn-primary btn-sm" type="button" @click="finishEditing('description')">OK</button>
                    </div>
                  </div>
                </template>
                <div v-else class="border rounded-3 bg-white p-3" style="font-size: 15.5px !important;">
                  <div
                      v-if="task.description"
                      class="description-view"
                      v-html="task.description"
                  ></div>
                  <span v-else class="text-muted fst-italic">Chưa có mô tả</span>
                </div>
              </div>

              <!-- ATTACHMENTS -->
              <FileGallery
                  :fileList="task.fileList"
                  :entityId="task.id"
                  :can-edit="canUpdate"
                  entityType="workitem"
                  @update:files="handleFilesUpdate"
              />

              <!-- BUTTONS -->
              <div v-if="canUpdate" class="d-flex gap-2 mb-3">
                <button class="btn btn-primary btn-sm px-3 py-1" @click="saveTask">Lưu</button>
                <button class="btn btn-outline-secondary btn-sm px-3 py-1" style="border-radius: 10px !important;" @click="reset">Hủy</button>
              </div>

              <!-- COMMENTS -->
              <!-- COMMENTS -->
              <div class="mb-2 mt-4">
                <label class="fw-semibold mb-2">Thảo luận:</label>

                <!-- Nếu đang reply -->
                <div v-if="replyTo" class="text-secondary mb-1" style="font-size: 15px">
                  Đang trả lời <b>{{ replyTo.fullName }}</b>
                  (<span class="text-primary">CM-{{ replyTo.commentID }}</span>)
                  <button
                      class="btn btn-sm btn-link text-danger p-0 mb-1"
                      @click="cancelReply"
                  >
                    (Hủy)
                  </button>
                </div>

                <!-- Ô nhập bình luận -->
                <CommentMentionTextarea
                    v-model="newComment.content"
                    :employees="commentMentionEmployees"
                    :rows="2"
                    textarea-class="form-control mb-2"
                    placeholder="Nhập bình luận..."
                />
                <div class="text-end mb-3">
                  <button class="btn btn-sm btn-primary" @click="submitComment">
                    Gửi
                  </button>
                </div>

                <!-- Danh sách bình luận -->
                <div v-if="task.comments && task.comments.length">
                  <CommentNode
                      v-for="(c, i) in task.comments"
                      :key="i"
                      :comment="c"
                      :comment-mention-employees="commentMentionEmployees"
                      @reply="handleReply"
                  />
                </div>
                <div v-else class="text-muted small">Chưa có bình luận nào</div>
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
                  <div class="person d-flex align-items-center gap-2">
                    <!-- Avatar -->
                    <div class="avatar-option rounded-circle overflow-hidden" style="width: 35px; height: 35px;">
                      <img
                          v-if="task.createBy && task.createBy.avatar"
                          :src="` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${task.createBy.avatar}`"
                          alt="avatar"
                          class="w-100 h-100 object-fit-cover"
                      />
                    </div>

                    <!-- Thông tin -->
                    <div>
                      <div class="fw-semibold" style="font-size: 16px !important">{{ task.createBy?.fullName || 'Không rõ' }}</div>
                      <div class="text-secondary small">{{ task.createBy?.email || 'Không có email' }}</div>
                    </div>
                  </div>

                </div>

                <!-- Người giao việc -->
                <div class="field-line">
                  <strong>Người giao việc:</strong>
                  <div v-if="task.asigger?.avatar" class="person d-flex align-items-center gap-2">
                    <div class="avatar-option rounded-circle overflow-hidden" style="width: 35px; height: 35px;">
                      <img
                          v-if="task.asigger?.avatar"
                          :src="` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${task.asigger.avatar}`"
                          alt="avatar"
                          class="w-100 h-100 object-fit-cover"
                      />
                    </div>

                    <div>
                      <div class="fw-semibold"  style="font-size: 16px !important">{{ task.asigger?.fullName || 'Không rõ người giao' }}</div>
                      <div class="text-secondary small">{{ task.asigger?.email || 'Không có email' }}</div>
                    </div>
                  </div>
                  <div v-else class="text-secondary">-- Không có --</div>

                </div>

                <!-- Người thực hiện -->
                <div class="field-line">
                  <strong>Thực hiện:</strong>
                  <template v-if="canAssign">
                    <v-select
                        v-model="selectedExecutor"
                        :options="mergedExecutors"
                        label="displayName"
                        :reduce="(o) => o"
                        :clearable="false"
                        class="vselect-clean flex-grow-1"
                        @update:modelValue="onSelectExecutor"
                        @search:focus="isFocusedExecutor = true"
                        @search:blur="isFocusedExecutor = false"
                    >
                      <!-- Khi đã chọn -->
                      <template #selected-option="{ displayName, email, avatar, isTeam }">
                        <div v-if="!isFocusedExecutor" class="person d-flex align-items-center gap-2">
                          <div
                              class="avatar-option rounded-circle overflow-hidden"
                              style="width: 35px; height: 35px;"
                          >
                            <img
                                v-if="avatar"
                                :src="` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${avatar}`"
                                class="object-fit-cover"
                                style="width: 35px !important; height: 35px!important; "
                                alt="avatar"
                            />
                            <div
                                v-else
                                class="d-flex align-items-center justify-content-center w-100 h-100 text-white fw-bold"
                                :style="{ backgroundColor: isTeam ? '#198754' : '#6c757d' }"
                            >
                              {{ displayName.charAt(0).toUpperCase() }}
                            </div>
                          </div>
                          <div>
                            <div class="fw-semibold"  style="font-size: 16px !important">{{ displayName }}</div>
                            <div v-if="!isTeam" class="text-secondary small">{{ email }}</div>
                            <div v-else class="text-secondary small">Nhóm thực hiện</div>
                          </div>
                        </div>
                      </template>

                      <!-- Khi hiển thị trong dropdown -->
                      <template #option="{ displayName, email, avatar, isTeam }">
                        <div class="person d-flex align-items-center gap-2">
                          <div
                              class="avatar-option rounded-circle overflow-hidden"
                              style="width: 35px; height: 35px;"
                          >
                            <img
                                v-if="avatar"
                                :src="` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${avatar}`"
                                class="w-100 h-100 object-fit-cover"
                                alt="avatar"
                            />
                            <div
                                v-else
                                class="d-flex align-items-center justify-content-center w-100 h-100 text-white fw-bold"
                                :style="{ backgroundColor: isTeam ? '#198754' : '#adb5bd' }"
                            >
                              {{ displayName.charAt(0).toUpperCase() }}
                            </div>
                          </div>
                          <div>
                            <div class="fw-semibold">{{ displayName }}</div>
                            <div v-if="!isTeam" class="text-secondary small">{{ email }}</div>
                            <div v-else class="text-secondary small">Nhóm thực hiện</div>
                          </div>
                        </div>
                      </template>
                    </v-select>
                  </template>
                  <template v-else>
                    <div class="person d-flex align-items-center gap-2 flex-grow-1">
                      <div class="avatar-option rounded-circle overflow-hidden" style="width: 35px; height: 35px;">
                        <img
                            v-if="selectedExecutor?.avatar"
                            :src="` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${selectedExecutor.avatar}`"
                            class="object-fit-cover"
                            style="width: 35px !important; height: 35px!important; "
                            alt="avatar"
                        />
                        <div
                            v-else
                            class="d-flex align-items-center justify-content-center w-100 h-100 text-white fw-bold"
                            :style="{ backgroundColor: selectedExecutor?.isTeam ? '#198754' : '#6c757d' }"
                        >
                          {{ selectedExecutor?.displayName?.charAt(0)?.toUpperCase() || '-' }}
                        </div>
                      </div>
                      <div>
                        <div class="fw-semibold" style="font-size: 16px !important">
                          {{ selectedExecutor?.displayName || 'Không có người thực hiện' }}
                        </div>
                        <div class="text-secondary small">
                          <template v-if="selectedExecutor && !selectedExecutor.isTeam">
                            {{ selectedExecutor.email || 'Không có email' }}
                          </template>
                          <template v-else-if="selectedExecutor && selectedExecutor.isTeam">
                            Nhóm thực hiện
                          </template>
                          <template v-else>
                            —
                          </template>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>


                <!-- Effort -->
                <div class="field-line" :class="{ 'field-line--editable': canUpdate }" @click="startEditing('effort')">
                  <strong>Effort:</strong>
                  <input
                      v-if="editField.effort"
                      type="number"
                      class="form-control form-control-sm text-fix"
                      v-model="task.effort"
                      ref="effortInputRef"
                      @blur="finishEditing('effort')"
                      @keyup.enter.prevent="finishEditing('effort')"
                  />
                  <span v-else class="editable" style="font-size: 15px !important">{{ task.effort }}</span>
                </div>

                <div class="field-line" :class="{ 'field-line--editable': canUpdate }" @click="startEditing('expStartDate')">
                  <strong>Bắt đầu dự kiến:</strong>
                  <input
                      v-if="editField.expStartDate"
                      style="width: 262px; ;"
                      type="datetime-local"
                      class="form-control form-control-sm text-fix"
                      v-model="task.expStartDate"
                      ref="expStartDateInputRef"
                      @blur="finishEditing('expStartDate')"
                      @keyup.enter.prevent="finishEditing('expStartDate')"
                  />
                  <span v-else class="editable" style="font-size: 15px !important">{{ formatDateTime(task.expStartDate) }}</span>
                </div>

                <div class="field-line" :class="{ 'field-line--editable': canUpdate }" @click="startEditing('deadline')">
                  <strong>Hạn hoàn thành:</strong>
                  <input
                      v-if="editField.deadline"
                      type="datetime-local"
                      style="width: 261px"
                      class="form-control form-control-sm text-fix"
                      v-model="task.deadline"
                      ref="deadlineInputRef"
                      @blur="finishEditing('deadline')"
                      @keyup.enter.prevent="finishEditing('deadline')"
                  />
                  <span v-else class="editable" style="font-size: 15px !important">{{ formatDateTime(task.deadline) }}</span>
                </div>

                <div class="field-line" :class="{ 'field-line--editable': canUpdate }" @click="startEditing('mucLuong')">
                  <strong>Mức lương:</strong>
                  <input
                      v-if="editField.mucLuong"
                      type="number"
                      style="width: 261px"
                      class="form-control form-control-sm text-fix"
                      v-model="task.mucLuong"
                      ref="mucLuongInputRef"
                      @blur="finishEditing('mucLuong')"
                      @keyup.enter.prevent="finishEditing('mucLuong')"
                  />
                  <span v-else class="editable" style="font-size: 15px !important">{{ formatCurrency(task.mucLuong) }}</span>
                </div>

                <div class="field-line" :class="{ 'field-line--editable': canUpdate }" @click="startEditing('hanUngTuyen')">
                  <strong>Hạn ứng tuyển:</strong>
                  <input
                      v-if="editField.hanUngTuyen"
                      type="datetime-local"
                      style="width: 261px"
                      class="form-control form-control-sm text-fix"
                      v-model="task.hanUngTuyen"
                      ref="hanUngTuyenInputRef"
                      @blur="finishEditing('hanUngTuyen')"
                      @keyup.enter.prevent="finishEditing('hanUngTuyen')"
                  />
                  <span v-else class="editable" style="font-size: 15px !important">{{ formatDateTime(task.hanUngTuyen) }}</span>
                </div>

                <div class="field-line" :class="{ 'field-line--editable': canUpdate }" @click="startEditing('choPhepUngTuyen')">
                  <strong>Cho phép ứng tuyển:</strong>
                  <select
                      v-if="editField.choPhepUngTuyen"
                      class="form-select form-select-sm text-fix"
                      style="width: 261px"
                      v-model="task.choPhepUngTuyen"
                      ref="choPhepUngTuyenInputRef"
                      @change="finishEditing('choPhepUngTuyen')"
                      @blur="finishEditing('choPhepUngTuyen')"
                  >
                    <option :value="true">Có</option>
                    <option :value="false">Không</option>
                  </select>
                  <span v-else class="editable" style="font-size: 15px !important">{{ formatBoolean(task.choPhepUngTuyen) }}</span>
                </div>

                <div class="field-line flex-column align-items-start" :class="{ 'field-line--editable': canUpdate }" @click="startEditing('address')">
                  <strong>Địa chỉ:</strong>
                  <div class="w-100">
                    <template v-if="canUpdate">
                      <div v-if="editField.address">
                        <Address5 v-model="task.address" />
                        <div class="d-flex justify-content-end gap-2 mt-2">
                          <button class="btn btn-primary btn-sm" type="button" @click.stop="finishEditing('address')">OK</button>
                        </div>
                      </div>
                      <span v-else class="editable" style="font-size: 15px !important">{{ formatAddress(task.address) }}</span>
                    </template>
                    <span v-else style="font-size: 15px !important">{{ formatAddress(task.address) }}</span>
                  </div>
                </div>

                <hr class="my-3" />

                <strong>Tiến độ:</strong>
                <div class="progress-container mb-3 mt-3">
                  <div
                      class="progress-bar expected"
                      :style="{ width: task.expProgress + '%'}"
                  ></div>
                  <div
                      class="progress-bar actual"
                      :style="{ width: task.actualProgress + '%'}"
                  ></div>
                </div>

                <div class="field-line">

                  <div class="d-flex justify-content-between">
                    <div class="d-flex justify-content-between align-items-center me-2">
                      <span style="font-size: 14px !important;"
                          :class="['status-badge', progressClass, 'px-3', 'rounded-pill', 'fw-semibold']"
                      >
                      <i :class="[progressIcon, 'me-1']"></i>
                      {{ task.progress }}
                    </span>
                    </div>
                    <span style="font-size: 15px !important;">Dự kiến: {{ task.expProgress?.toFixed(0) }}%</span> &nbsp;&nbsp;
                    <span style="font-size: 15px !important;">Thực tế: {{ task.actualProgress?.toFixed(0) }}%</span>
                  </div>
                </div>



                <div class="field-line" :class="{ 'field-line--editable': canUpdate }" @click="startEditing('actualEffort')">
                  <strong>Effort đạt:</strong>
                  <input
                      v-if="editField.actualEffort"
                      type="number"
                      style="width: 312px"
                      class="form-control form-control-sm text-fix"
                      v-model="task.actualEffort"
                      ref="actualEffortInputRef"
                      @blur="finishEditing('actualEffort')"
                      @keyup.enter.prevent="finishEditing('actualEffort')"
                  />
                  <span v-else class="editable pt-0" style="font-size: 15px !important">{{ task.actualEffort }}</span>
                </div>

                <!-- 🕒 Bắt đầu thực tế -->
                <div class="field-line">
                  <strong>Bắt đầu thực tế:</strong>
                  <span style="font-size: 15px !important;">{{ formatDateTime(task.actualStartDate) }}</span>
                </div>

                <!-- ✅ Hoàn thành thực tế -->
                <div class="field-line">
                  <strong>Kết thúc thực tế:</strong>
                  <span style="font-size: 15px !important;">{{ formatDateTime(task.actualEndDate) }}</span>
                </div>

              </div>

              <!-- TAB: LOGS (2 COLUMNS) -->
              <!-- TAB: LOGS (hiển thị kiểu comment) -->
              <div v-else class="small log-section">
                <div
                    v-for="(log, i) in task.logList"
                    :key="i"
                    class="log-item d-flex align-items-start gap-3 mb-3 p-3 rounded-4 shadow-sm bg-white border"
                >
                  <!-- AVATAR -->
                  <div
                      class="avatar-wrapper rounded-circle overflow-hidden flex-shrink-0 mt-1"
                      style="width: 40px; height: 40px;"
                  >
                    <img
                        v-if="log.avatar"
                        :src="` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${log.avatar}`"
                        alt="avatar"
                        class="w-100 h-100 object-fit-cover"
                    />
                    <div
                        v-else
                        class="d-flex align-items-center justify-content-center w-100 h-100 bg-secondary text-white fw-semibold"
                    >
                      {{ log.fullName ? log.fullName.charAt(0).toUpperCase() : '?' }}
                    </div>
                  </div>

                  <!-- NỘI DUNG LOG -->
                  <div class="log-content flex-grow-1">
                    <div class="d-flex align-items-center justify-content-between">
                      <div class="fw-semibold text-dark">{{ log.fullName }}</div>
                      <div class="text-secondary small fw-medium">{{ formatDateTime(log.createAt) }}</div>
                    </div>
                    <div  style="white-space: pre-wrap; font-size: 15px">
                      {{ log.content }}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import vSelect from "vue3-select";
  import api from '../../../api/api.js'
  import { fetchPrivateDownloadUrl } from '../../../api/fileApi.js'
  import "vue3-select/dist/vue3-select.css";
  import DescriptionEditor from "../../common/DescriptionEditor.vue";
  import FileGallery from "../../FileGallery.vue"
  import Address5 from "./Address6.vue";
  import { eventMatchesProject, isWorkItemEvent, isCommentEvent } from '../../../utils/socketEventUtils.js'


  const showModal = ref(false);

  const canUpdate = computed(() => props.canUpdateWorkItem)
  const canAssign = computed(() => props.canEditImplementer)
  const canDetail = computed(() => props.canViewDetail)

  const props = defineProps({
    projectId: {
      type: Number,
      required: true
    },
    socketEvent: {
      type: Object,
      default: null
    },
    canUpdateWorkItem: {
      type: Boolean,
      default: false
    },
    canEditImplementer: {
      type: Boolean,
      default: false
    },
    canViewDetail: {
      type: Boolean,
      default: false
    }
  })

  const loading = ref(false)
  const workItems = ref([])
  const totalItems = ref(0)
  const page = ref(1)
  const size = ref(10)
  const searchInput = ref('')
  const searchTerm = ref('')
  const isFilterModalOpen = ref(false)

  const selectedFilters = reactive({
    status: null,
    typeId: null,
    progress: null,
    priority: null
  })

  const pendingFilters = reactive({
    status: null,
    typeId: null,
    progress: null,
    priority: null
  })

  const statusOptions = [
    { label: 'TODO', value: 'TODO' },
    { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
    { label: 'IN_REVIEW', value: 'IN_REVIEW' },
    { label: 'DONE', value: 'DONE' }
  ]

  const progressOptions = [
    { label: 'Trễ tiến độ', value: 'TRE' },
    { label: 'Sớm tiến độ', value: 'SOM' },
    { label: 'Đúng tiến độ', value: 'DUNG' },
  ]

  const priorityOptions = [
    { label: 'Ưu tiên', value: true },
    { label: 'Không ưu tiên', value: false }
  ]

  const sortOptions = [
    { key: 'default', label: 'Sắp xếp mặc định', field: null, dir: null },
    { key: 'effort-asc', label: 'Effort (thấp - cao)', field: 'effort', dir: 'ASC' },
    { key: 'effort-desc', label: 'Effort (cao - thấp)', field: 'effort', dir: 'DESC' },
    { key: 'deadline-asc', label: 'Deadline (gần nhất)', field: 'deadline', dir: 'ASC' },
    { key: 'deadline-desc', label: 'Deadline (xa nhất)', field: 'deadline', dir: 'DESC' }
  ]

  const selectedSortKey = ref(sortOptions[0].key)
  const sortState = reactive({ sortField: null, sortDir: null })

  const typeOptions = ref([])

  const kanbanColumns = [
    { label: 'TODO', value: 'TODO' },
    { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
    { label: 'IN_REVIEW', value: 'IN_REVIEW' },
    { label: 'DONE', value: 'DONE' }
  ]

  const dragState = reactive({
    activeId: null,
    overStatus: null
  })

  const groupedWorkItems = computed(() => {
    const groups = kanbanColumns.reduce((acc, column) => {
      acc[column.value] = []
      return acc
    }, {})

    workItems.value.forEach((item) => {
      const statusKey = item?.status && Object.prototype.hasOwnProperty.call(groups, item.status)
        ? item.status
        : 'TODO'
      groups[statusKey].push(item)
    })

    return groups
  })

  const resetDragState = () => {
    dragState.activeId = null
    dragState.overStatus = null
  }

  const onDragStart = (item, status, event) => {
    if (!props.canUpdateWorkItem) return;
    dragState.activeId = item.workItemID
    dragState.overStatus = status || item.status || null

    if (event?.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(item.workItemID))
    }
  }

  const onDragOver = (status, event) => {
    if (!props.canUpdateWorkItem) return;
    if (!dragState.activeId) return
    dragState.overStatus = status
    if (event?.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  const onDragEnter = (status) => {
    if (!props.canUpdateWorkItem) return;
    if (!dragState.activeId) return
    dragState.overStatus = status
  }

  const onDragLeave = (status, event) => {
    if (!props.canUpdateWorkItem) return;
    if (!dragState.activeId) return
    const nextTarget = event?.relatedTarget
    if (nextTarget && event?.currentTarget?.contains(nextTarget)) return
    if (dragState.overStatus === status) {
      dragState.overStatus = null
    }
  }

  const onDragEnd = () => {
    resetDragState()
  }

  const onDrop = async (status) => {
    if (!props.canUpdateWorkItem) return
    if (!dragState.activeId) return

    const activeId = dragState.activeId
    const itemIndex = workItems.value.findIndex((workItem) => workItem.workItemID === activeId)
    if (itemIndex === -1) {
      resetDragState()
      return
    }

    const targetItem = workItems.value[itemIndex]
    const originalStatus = targetItem.status || 'TODO'

    if (originalStatus === status) {
      resetDragState()
      return
    }

    targetItem.status = status
    resetDragState()

    const success = await updateWorkItemStatus(activeId, status, { refreshModal: false })
    if (!success) {
      targetItem.status = originalStatus
      showError('Không thể cập nhật trạng thái công việc', 'Vui lòng thử lại sau!')
    }
  }

  const normalizeProgressKey = (value) => {
    if (!value) return ''
    return value
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
  }

  const progressMetaMap = {
    SOM: { label: 'SỚM', class: 'bg-success-subtle text-success' },
    DUNG: { label: 'ĐÚNG', class: 'bg-warning-subtle text-warning' },
    TRE: { label: 'TRỄ', class: 'bg-danger-subtle text-danger' }
  }

  const progressBadgeClass = (progress) => {
    const meta = progressMetaMap[normalizeProgressKey(progress)]
    return meta ? meta.class : 'bg-light text-muted'
  }

  const progressLabel = (progress) => {
    const meta = progressMetaMap[normalizeProgressKey(progress)]
    if (meta) return meta.label
    return progress || 'Không rõ'
  }

  const totalPages = computed(() => (totalItems.value > 0 ? Math.ceil(totalItems.value / size.value) : 1))
  const pageSummary = computed(() => `Trang ${page.value} / ${totalPages.value}`)

  const clampPercent = (value) => {
    if (value == null || Number.isNaN(Number(value))) return 0
    return Math.max(0, Math.min(100, Number.parseFloat(value)))
  }

  const tooltipText = (item) => {
    return `Kế hoạch: ${Math.round(clampPercent(item.expProgress))}% | Thực tế: ${Math.round(clampPercent(item.actualProgress))}%`
  }

  const statusMap = {
    TODO: { label: 'To Do', class: 'status-new' },
    IN_PROGRESS: { label: 'In Progress', class: 'status-in-progress' },
    IN_REVIEW: { label: 'In Review', class: 'status-review' },
    DONE: { label: 'Done', class: 'status-done' }
  }

  const progressBarClass = (item) => {
    if (item.progress === 'TRỄ') return 'late'
    if (item.progress === 'SỚM') return 'early'
    return 'on-track'
  }

  const progressLabelClass = (item) => {
    if (item.progress === 'TRỄ') return 'late'
    if (item.progress === 'SỚM') return 'early'
    if (item.status === 'DONE') return 'done'
    return 'on-track'
  }

  const progressText = (item) => {
    if (item.progress === 'TRỄ') return 'trễ tiến độ'
    if (item.progress === 'SỚM') return 'sớm tiến độ'
    if (item.progress === 'ĐÚNG') return 'đúng tiến độ'
    return 'đúng tiến độ'
  }

  const statusClass = (status) => statusMap[status]?.class || 'status-default'
  const statusLabel = (status) => statusMap[status]?.label || status

  const getType = (id) => typeOptions.value.find((item) => item.id === id) || null

  const formatDate = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  }

  const openFilterModal = () => {
    pendingFilters.status = selectedFilters.status
    pendingFilters.typeId = selectedFilters.typeId
    pendingFilters.progress = selectedFilters.progress
    pendingFilters.priority = selectedFilters.priority
    isFilterModalOpen.value = true
  }

  const closeFilterModal = () => {
    isFilterModalOpen.value = false
  }

  const resetPendingFilters = () => {
    pendingFilters.status = null
    pendingFilters.typeId = null
    pendingFilters.progress = null
    pendingFilters.priority = null
  }

  const applyFilters = () => {
    selectedFilters.status = pendingFilters.status
    selectedFilters.typeId = pendingFilters.typeId
    selectedFilters.progress = pendingFilters.progress
    selectedFilters.priority = pendingFilters.priority
    page.value = 1
    closeFilterModal()
    fetchWorkItems()
  }

  const handleSortChange = () => {
    const selected = sortOptions.find((option) => option.key === selectedSortKey.value)
    sortState.sortField = selected?.field || null
    sortState.sortDir = selected?.dir || null
    page.value = 1
    fetchWorkItems()
  }

  const applySearch = () => {
    searchTerm.value = searchInput.value.trim()
    page.value = 1
    fetchWorkItems()
  }

  const goToFirstPage = () => {
    if (page.value !== 1) {
      page.value = 1
      fetchWorkItems()
    }
  }

  const goToLastPage = () => {
    if (page.value !== totalPages.value) {
      page.value = totalPages.value
      fetchWorkItems()
    }
  }

  const nextPage = () => {
    if (page.value < totalPages.value) {
      page.value += 1
      fetchWorkItems()
    }
  }

  const prevPage = () => {
    if (page.value > 1) {
      page.value -= 1
      fetchWorkItems()
    }
  }

  const handleSizeChange = () => {
    if (!size.value || size.value < 1) {
      size.value = 1
    }
    page.value = 1
    fetchWorkItems()
  }

  const fetchWorkTypes = async () => {
    try {
      const res = await api.get('/admin.thg/project/work', { withCredentials: true })
      typeOptions.value = Array.isArray(res.data) ? res.data : []
      console.log("Loại" , res.data)
    } catch (error) {
      console.error('Không thể tải danh sách loại công việc:', error)
      typeOptions.value = []
    }
  }

  const buildProgressParam = (value) => value

  const fetchWorkItems = async () => {
    loading.value = true
    try {
      const params = {
        name: searchTerm.value || null,
        projectId: props.projectId,
        status: selectedFilters.status,
        typeId: selectedFilters.typeId,
        priority: selectedFilters.priority,
        progress: buildProgressParam(selectedFilters.progress),
        sortField: sortState.sortField,
        sortDir: sortState.sortDir,
        page: page.value - 1,
        size: size.value
      }

      Object.keys(params).forEach((key) => {
        if (params[key] === null || params[key] === undefined || params[key] === '') {
          delete params[key]
        }
      })

      const res = await api.get('/admin.thg/project/work/view', {
        params,
        withCredentials: true
      })

      workItems.value = res.data?.content || []
      totalItems.value = res.data?.page?.totalElements || 0

      const apiTotalPages = res.data?.page?.totalPages ?? 1
      const normalizedPages = apiTotalPages && apiTotalPages > 0 ? apiTotalPages : 1
      if (page.value > normalizedPages) {
        page.value = normalizedPages
        loading.value = false
        await fetchWorkItems()
        return
      }
      console.log(res.data)
    } catch (error) {
      console.error('Không thể tải danh sách công việc:', error)
      workItems.value = []
      totalItems.value = 0
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await fetchWorkTypes()
    await fetchWorkItems()
  })

   // detail ------
  import "vue3-select/dist/vue3-select.css";

  const activeTab = ref("details");

  const editField = ref({
    title: false,
    description: false,
    effort: false,
    actualEffort: false,
    expStartDate: false,
    deadline: false,
    mucLuong: false,
    hanUngTuyen: false,
    choPhepUngTuyen: false,
    address: false,
  });

  const titleInputRef = ref(null);
  const descriptionEditorRef = ref(null);
  const effortInputRef = ref(null);
  const actualEffortInputRef = ref(null);
  const expStartDateInputRef = ref(null);
  const deadlineInputRef = ref(null);
  const mucLuongInputRef = ref(null);
  const hanUngTuyenInputRef = ref(null);
  const choPhepUngTuyenInputRef = ref(null);

  const fieldRefs = {
    title: titleInputRef,
    description: descriptionEditorRef,
    effort: effortInputRef,
    actualEffort: actualEffortInputRef,
    expStartDate: expStartDateInputRef,
    deadline: deadlineInputRef,
    mucLuong: mucLuongInputRef,
    hanUngTuyen: hanUngTuyenInputRef,
    choPhepUngTuyen: choPhepUngTuyenInputRef
  };

  const task = ref({
    id: null,
    iconType: "",
    colorType: "",
    priority: false,
    title: "",
    description: "",
    fileList: [],
    createBy: {
      id: null,
      fullName: "",
      email: "",
      avatar: ""
    },
    asigger: {
      id: null,
      fullName: "",
      email: "",
      avatar: ""
    },

    actualStartDate: null,
    actualEndDate: null,

    implementerList: [],
    implementer: null,
    implementerTeamList: [],
    implementerTeam: null,
    effort: null,
    actualEffort: null,
    deadline: null,
    expStartDate: null,
    mucLuong: null,
    hanUngTuyen: null,
    choPhepUngTuyen: false,
    address: "",
    progress: null,
    actualProgress: null,
    expProgress: null,
    comments: null,
    logList: []
  });

  function startEditing(field) {
    if (!props.canUpdateWorkItem) return;
    editField.value[field] = true;
    nextTick(() => {
      const target = fieldRefs[field]?.value;
      if (target) {
        if (typeof target.focus === 'function') {
          target.focus();
        } else if (target?.$el && typeof target.$el.focus === 'function') {
          target.$el.focus();
        }
        if (typeof target.select === 'function') {
          target.select();
        }
      }
    });
  }

  function finishEditing(field) {
    if (!props.canUpdateWorkItem) return;
    editField.value[field] = false;
  }

  function close() {
    showModalDetail.value = false;
    uploadedFiles.value = [];
  }

  const showModalDetail = ref(false);

  function handleCardClick(id) {
    if (!props.canViewDetail) return;
    openModalDetail(id);
  }

  const originalFiles = ref([]);
  async function openModalDetail(id) {
    if (!props.canViewDetail) return;
    try {
      // 🔍 Kiểm tra id có hợp lệ không
      if (!id) {
        console.warn("⚠️ ID không hợp lệ:", id);
        return;
      }

      console.log("📡 Gọi API:", `/admin.thg/project/work/view_detail/${id}`);

      const res = await api.get(`/admin.thg/project/work/view_detail/${id}`, {
        withCredentials: true,
      });

      // ✅ Kiểm tra phản hồi từ server
      if (res && res.data) {
        console.log("📦 Dữ liệu chi tiết:", res.data);
        task.value = res.data; // gán dữ liệu vào object task reactive
        originalFiles.value = JSON.parse(JSON.stringify(task.value.fileList || []));
        mentionEmployeePool.value = Array.isArray(res.data?.implementerList) ? res.data.implementerList : [];
        showModalDetail.value = true;
      } else {
        console.warn("⚠️ Không có dữ liệu trả về từ API!");
      }

    } catch (err) {
      console.error("❌ Lỗi khi gọi API:", err);
      alert("Không thể tải dữ liệu chi tiết công việc. Vui lòng thử lại sau!");
    }
  }

  const isFocusedExecutor = ref(false);
  const selectedExecutor = ref(null);

  watch(
      () => props.socketEvent,
      async (event) => {
        if (!event) return;
        if (!eventMatchesProject(event, props.projectId)) return;
        if (isWorkItemEvent(event) || isCommentEvent(event)) {
          await fetchWorkItems();
          if (showModalDetail.value && task.value?.id) {
            await openModalDetail(task.value.id);
          }
        }
      }
  );
  watch(
      () => task.value,
      (newTask) => {
        if (!newTask) return;

        if (newTask.implementer) {
          selectedExecutor.value = {
            ...newTask.implementer,
            id: newTask.implementer.employeeID,
            displayName: newTask.implementer.fullName,
            isTeam: false
          };
        } else if (newTask.implementerTeam) {
          selectedExecutor.value = {
            ...newTask.implementerTeam,
            id: newTask.implementerTeam.teamID,
            displayName: newTask.implementerTeam.teamName,
            email: null,
            isTeam: true
          };
        } else {
          // ⚡ Nếu cả hai đều null → chọn option “Để trống”
          selectedExecutor.value = {
            id: -999,
            displayName: "Để trống",
            isTeam: false,
            email: "Không phân cho ai",
            avatar: null,
            employeeID: -999,
          };
        }
      },
      { immediate: true } // chạy luôn lần đầu khi có dữ liệu
  );


  // 🧠 Hợp nhất danh sách người và nhóm
  const mergedExecutors = computed(() => {
    const persons = task.value.implementerList.map((p) => ({
      ...p,
      id: p.employeeID,
      displayName: p.fullName,
      isTeam: false
    }));
    const teams = task.value.implementerTeamList.map((t) => ({
      ...t,
      id: t.teamID,
      displayName: t.teamName,
      email: null,
      isTeam: true
    }));

    const emptyExecutor = {
      id: -999,
      displayName: "Để trống",
      isTeam: false,
      email: " Không phân cho ai ",
      avatar: null,
      employeeID: -999
    };
    if(task.value.status === "TODO" )
      return [emptyExecutor, ...persons, ...teams];
    else
      return [...persons, ...teams]
  });

  // 🎯 Gán dữ liệu chính xác vào task khi chọn
  // Gọi api thay ổi người thực hiện công việc
  async function onSelectExecutor(selected) {
    if (!props.canEditImplementer) return;
    if (!selected) {
      task.value.implementer = null;
      task.value.implementerTeam = null;
      return;
    }

    if (selected.isTeam) {
      task.value.implementerTeam = selected;
      task.value.implementer = null;
    } else {
      task.value.implementer = selected;
      task.value.implementerTeam = null;
    }
    console.log("Đã chọn:", selected.isTeam ? "Team" : "Person", selected);
    await updateImplementerAndImplementerTeam(selected);
  }

  // Gọi API
  async function updateImplementerAndImplementerTeam(selected){
    if (!props.canEditImplementer) return;
    try{
      let url = null;
      if( selected.isTeam){
        url = "/admin.thg/project/work/updateImplementerTeam/" + task.value.id
      }else{
        url = "/admin.thg/project/work/updateImplementer/" + task.value.id
      }

      const res = await api.post(url, selected, {
        withCredentials: true
      });

      console.log(res.data);

      await openModalDetail(task.value.id);

    }catch (e) {
      showError("Đã sảy ra lỗi", "Vui lòng thử lại sau!")
    }

  }




  function formatDateTime(value) {
    if (!value) return "--";
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function formatCurrency(value) {
    if (value === null || value === undefined || value === "") return "—";
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return value;
    return `${new Intl.NumberFormat("vi-VN").format(numericValue)} ₫`;
  }

  function formatBoolean(value) {
    if (value === null || value === undefined) return "—";
    return value ? "Có" : "Không";
  }

  function formatAddress(value) {
    if (!value) return "—";
    return value.replace(/\s*\/!!\s*/g, ", ");
  }

  const progressClass = computed(() => {
    switch (task.value.progress) {
      case "SỚM":
        return "text-success bg-success-subtle";
      case "TRỄ":
        return "text-danger bg-danger-subtle";
      default: // ĐÚNG
        return "text-warning bg-warning-subtle";
    }
  });

  const progressIcon = computed(() => {
    switch (task.value.progress) {
      case "SỚM":
        return "fa-solid fa-circle-up";
      case "TRỄ":
        return "fa-solid fa-circle-down";
      default: // ĐÚNG
        return "fa-solid fa-circle-check";
    }
  });

  /* ---------------------- COMPONENT COMMENT NODE (ĐỆ QUY) ---------------------- */
  import CommentNode from "./CommentNode.vue";
  import CommentMentionTextarea from "./CommentMentionTextarea.vue";
  import {showError, showLoading, showSuccess, updateAlertSuccess} from "/src/assets/js/alertService.js";


  /* ---------------------- LOGIC XỬ LÝ BÌNH LUẬN ---------------------- */
  const replyTo = ref(null);
  const newComment = ref({ content: "", parentID: null });
  const mentionEmployeePool = ref([]);

  const commentMentionEmployees = computed(() => {
    const result = [];
    const seen = new Set();

    const addCandidate = (candidate) => {
      if (!candidate) return;
      const fullName = candidate.fullName || candidate.name || candidate.displayName;
      if (!fullName) return;

      const id =
          candidate.employeeID ??
          candidate.id ??
          candidate.employeeId ??
          candidate.userID ??
          candidate.userId ??
          candidate.commentByID ??
          candidate.commentById ??
          candidate.email ??
          fullName;

      if (!id || seen.has(id)) return;
      seen.add(id);

      result.push({
        employeeID: id,
        fullName,
        avatar: candidate.avatar || null,
      });
    };

    const walkComments = (list) => {
      if (!Array.isArray(list)) return;
      list.forEach((item) => {
        addCandidate({
          employeeID:
              item.employeeID ??
              item.userID ??
              item.userId ??
              item.commentByID ??
              item.commentById ??
              item.id,
          fullName: item.fullName,
          avatar: item.avatar,
        });
        walkComments(item.replies);
      });
    };

    mentionEmployeePool.value.forEach(addCandidate);
    addCandidate(task.value?.createBy);
    addCandidate(task.value?.asigger);
    addCandidate(task.value?.implementer);
    walkComments(task.value?.comments);

    return result;
  });

  function handleReply(comment) {
    replyTo.value = comment;
    newComment.value.parentID = comment.commentID;
  }

  function cancelReply() {
    replyTo.value = null;
    newComment.value.parentID = null;
  }

  async function submitComment() {
    if (!newComment.value.content.trim()) return;

    try {
      const payload = {
        content: newComment.value.content,
        parentCommentID: newComment.value.parentID,
        workItemID: task.value.id
      };

      console.log("📤 Sending comment:", payload);
      await api.post("/admin.thg/project/work/add_comment", payload, { withCredentials: true });

      // reset
      newComment.value = { content: "", parentID: null };
      replyTo.value = null;

      // reload comments
      await openModalDetail(task.value.id);
    } catch (err) {
      console.error("❌ Không thể gửi bình luận:", err);
    }
  }

  /* 🧩 Bổ sung tên người được trả lời (FE hiển thị đẹp hơn) */
  function enrichReplyNames(list, parent = null) {
    if (!list) return;
    list.forEach((c) => {
      if (parent) {
        c.replyToName = parent.fullName;
        c.replyToId = parent.commentID;
      }
      enrichReplyNames(c.replies, c);
    });
  }

  /* Gọi enrich sau khi load chi tiết */
  watch(task, (newVal) => {
    if (newVal && newVal.comments) enrichReplyNames(newVal.comments);
    if (Array.isArray(newVal?.implementerList)) {
      mentionEmployeePool.value = newVal.implementerList;
    }
  });

  const uploadedFiles = ref([]); // chứa file thật để upload

  function handleFilesUpdate(updatedFiles) {
    if (!props.canUpdateWorkItem) return;
    if (!Array.isArray(updatedFiles)) return;

    console.group("🧩 [DEBUG] handleFilesUpdate (WorkItem)");

    // 1️⃣ Phân loại
    const existingFiles = updatedFiles.filter(f => f.id && !f.file);
    const newFiles = updatedFiles.filter(f => f.file instanceof File);

    // 2️⃣ Tìm file bị xoá (so với bản gốc)
    const originalFileIds = (originalFiles.value || []).map(f => f.id);
    const currentFileIds = existingFiles.map(f => f.id);
    const deletedFileIds = originalFileIds.filter(id => !currentFileIds.includes(id));

    console.log("📦 originalFileIds:", originalFileIds);
    console.log("📦 currentFileIds:", currentFileIds);
    console.log("🗑 deletedFileIds:", deletedFileIds);

    // 3️⃣ Gán vào task
    task.value.fileList = updatedFiles;
    task.value.newFiles = newFiles.map(f => f.file);
    task.value.deletedFileIds = deletedFileIds;

    console.log("📋 task sau cập nhật:", {
      fileList: task.value.fileList,
      newFiles: task.value.newFiles,
      deletedFileIds: task.value.deletedFileIds,
    });

    console.groupEnd();
  }


  function statusBadgeClass(status) {
    switch (status) {
      case "TODO": return "status-new";
      case "IN_PROGRESS": return "status-in-progress";
      case "IN_REVIEW": return "status-review";
      case "DONE": return "status-done";
      default: return "status-default";
    }
  }


  async function changeStatus(newStatus) {
    if (!props.canUpdateWorkItem) return;
    const previousStatus = task.value.status
    task.value.status = newStatus
    document.body.click()
    const success = await updateWorkItemStatus(task.value.id, newStatus)
    if (!success) {
      task.value.status = previousStatus
      showError('Không thể cập nhật trạng thái công việc', 'Vui lòng thử lại sau!')
    }
  }

  function statusIcon(status) {
    switch (status) {
      case "NEW": return "fa-regular fa-file";
      case "IN_PROGRESS": return "fa-solid fa-spinner";
      case "IN_REVIEW": return "fa-regular fa-eye";
      case "DONE": return "fa-solid fa-check";
      default: return "fa-regular fa-circle-question";
    }
  }


// ==================== ttair file =============================
  // ==================== tải file có hộp thoại lưu =============================
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
      if (!downloadUrl) throw new Error('Không lấy được link tải')

      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error('Không thể tải dữ liệu')

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

  // Update status
  async function updateWorkItemStatus(id, newStatus, options = {}) {
    if (!props.canUpdateWorkItem) return false;
    const { refreshModal = true } = options

    try {
      await api.post(`/admin.thg/project/work/view_detail/${id}/`, null, {
        params: { status: newStatus },
        withCredentials: true,
      })

      if (refreshModal) {
        await openModalDetail(id)
      }

      return true
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật trạng thái:', err)
      return false
    }
  }


  async function saveTask() {
    if (!props.canUpdateWorkItem) return;
    try {
      // 🧩 Chuẩn bị FormData
      const formData = new FormData();
      formData.append("task", new Blob([JSON.stringify(task.value)], { type: "application/json" }));
      uploadedFiles.value.forEach(file => formData.append("files", file));

      // 🛰️ Gọi API và hiển thị loading ít nhất 2 giây

      console.log( task.value)
      console.log( uploadedFiles.value)
      const res = await showLoading(
          api.post("/admin.thg/project/work/save", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          })
      );

      console.log("✅ Đã cập nhật công việc:", res.data);
      close();
      // 🧩 Sau khi API hoàn tất
      // ✅ Hiện alert thành công
      updateAlertSuccess("Cập nhật thành công!", "Dữ liệu đã được lưu trên hệ thống.");
      await fetchWorkItems();
    } catch (err) {
      console.error("❌ Lỗi khi lưu task:", err);
      showError("Lỗi khi lưu công việc!", "Vui lòng thử lại sau.");
    }
  }


  function reset(){
    showModalDetail.value = false;
    uploadedFiles.value = [];
  }

  defineExpose({
    fetchWorkItems, // 👈 cho phép cha gọi hàm này
  });


  </script>

  <style scoped>
  .fa-paperclip:hover {
    color: #0d6efd;
    transform: scale(1.1);
    transition: all 0.15s ease;
  }

  .all-work-items {
    padding: 1rem 1.5rem 2rem;
  }

  .kanban-board-wrapper {
    min-height: 420px;
  }

  .kanban-board {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .kanban-column {
    flex: 1 1 260px;
    max-height: 70vh;
    padding: 0.5rem;
    background-color: rgba(225, 226, 227, 0.24);
    border: 1px solid rgba(15, 23, 42, 0.08);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .kanban-column.is-drop-target {
    border-color: rgba(13, 110, 253, 0.5);
    box-shadow: inset 0 0 0 2px rgba(13, 110, 253, 0.15), 0 0 0 3px rgba(13, 110, 253, 0.08);
  }

  .kanban-column-header .badge {
    font-size: 0.75rem;
  }

  .kanban-cards {
    overflow-y: auto;
    padding-right: 0.35rem;
  }

  .kanban-cards::-webkit-scrollbar {
    width: 6px;
  }

  .kanban-cards::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.5);
    border-radius: 999px;
  }

  .kanban-card {
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.2s ease, border-color 0.2s ease;
    position: relative;
  }

  .kanban-card-body {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .kanban-card.is-dragging {
    transform: scale(1.05);
    box-shadow: 0 14px 28px rgba(13, 110, 253, 0.18), 0 6px 12px rgba(15, 23, 42, 0.14);
  }

  .kanban-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .kanban-card-title {
    font-size: 1rem;
    line-height: 1.4;
  }

  .extra-small {
    font-size: 0.75rem;
  }

  @media (max-width: 1200px) {
    .kanban-column {
      flex: 1 1 calc(50% - 0.75rem);
      max-height: none;
    }
  }

  @media (max-width: 768px) {
    .kanban-column {
      flex: 1 1 100%;
      max-height: none;
    }

    .kanban-cards {
      max-height: none;
    }
  }

  .tab-toolbar input[type='number'] {
    width: 70px;
  }

  .custom-table {
    font-size: 13.5px;
    border-collapse: separate;
    border-spacing: 0;
  }

  .custom-table thead th {
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    color: #6b7280;
  }

  .custom-table tbody td {
    padding: 0.75rem;
    vertical-align: middle;
  }

  .custom-table tbody tr:hover {
    background-color: #f9fafb;
  }

  .title-cell {
    max-width: 230px;
  }

  .type-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }

  .progress-cell {
    min-width: 230px;
  }

  .progress-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .progress-wrapper {
    position: relative;
    width: 160px;
    height: 6px;
    background-color: rgba(148, 163, 184, 0.2);
    border-radius: 12px;
    overflow: hidden;
  }

  .progress-wrapper::after {
    content: attr(data-tooltip);
    position: absolute;
    top: -30px;
    left: 0;
    padding: 2px 6px;
    background-color: rgba(17, 24, 39, 0.85);
    color: #fff;
    font-size: 11px;
    border-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    white-space: nowrap;
  }

  .progress-wrapper:hover::after {
    opacity: 1;
  }

  .progress-bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    transition: width 0.4s ease;
  }

  .progress-bar.expected {
    background-color: rgba(96, 165, 250, 0.35);
    z-index: 1;
  }

  .progress-bar.actual {
    z-index: 2;
  }

  .progress-bar.actual.on-track {
    background-color: rgba(37, 99, 235, 0.9);
  }

  .progress-bar.actual.early {
    background-color: rgba(16, 185, 129, 0.85);
  }

  .progress-bar.actual.late {
    background-color: rgba(239, 68, 68, 0.85);
  }

  .status-label {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .status-label.on-track {
    background-color: rgba(147, 197, 253, 0.25);
    color: #1d4ed8;
  }

  .status-label.early {
    background-color: rgba(187, 247, 208, 0.6);
    color: #166534;
  }

  .status-label.late {
    background-color: rgba(254, 202, 202, 0.65);
    color: #991b1b;
  }

  .status-label.done {
    background-color: rgba(217, 249, 157, 0.65);
    color: #4d7c0f;
  }

  .finish-box {
    background-color: #ecfdf5;
    color: #047857;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .table-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(2px);
  }

  .filter-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    padding: 1.5rem;
  }

  .filter-modal {
    background: #fff;
    width: min(520px, 100%);
    max-height: 90vh;
    overflow-y: auto;
    padding: 1.5rem;
  }

  .status-new {
    background-color: rgb(236, 230, 126);
    font-size: 12px;
    color: black;
  }

  .status-in-progress {
    background-color: #579dff;
    font-size: 12px;
    color: black;
  }

  .status-review {
    background-color: rgb(229, 155, 238);
    font-size: 12px;
    color: black;
  }

  .status-done {
    background-color: rgb(108, 197, 119);
    font-size: 12px;
    color: black;
  }

  .status-default {
    background-color: rgba(148, 163, 184, 0.3);
    color: #475569;
  }

  @media (max-width: 992px) {
    .tab-toolbar {
      flex-direction: column;
      align-items: stretch !important;
      gap: 1rem;
    }

    .pagination-controls {
      margin-top: 0.5rem;
    }

    .progress-cell {
      min-width: 180px;
    }
  }

  .nguoiTao{
    width: 65px !important;
    max-width: 65px !important;
  }

  .avatar-small {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid rgba(72, 71, 71, 0.15);
    object-fit: cover;
  }

  :deep(tr.row55:hover td) {
    cursor: pointer !important;
    transition: all 0.3s ease !important;
  }
  .modal {
    background: rgba(0, 0, 0, 0.35);
  }
  .bg-light-purple {
    background-color: #e5d6ff !important;
  }
  .modal-content {
    padding: 10px;
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
  .field-line--editable {
    cursor: pointer;
  }
  .editable-heading {
    cursor: pointer;
  }
  .editable-block {
    cursor: pointer;
  }
  .kanban-card--disabled {
    cursor: default;
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
    background-color: #8ec282;
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
    grid-template-columns: auto 1fr;
    gap: 12px;
  }
  .log-left {
    display: flex;
    align-items: flex-start;
    min-width: 180px;
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
  /* ép chiều cao và padding */
  .vselect-clean .vs__dropdown-toggle {
    border-radius: 10px !important;
    padding: 10px 12px !important;
    min-height: 60px !important;    /* cao hơn mặc định */
    height: 60px !important;        /* ép cao cố định */
    display: flex !important;
    align-items: center !important;
  }

  :deep(.vselect-clean .vs__dropdown-toggle) {
    height: 42px !important;
    min-height: 42px !important;
    border-radius: 12px !important;
  }
  .progress-container {
    position: relative;
    width: 100%;
    height: 10px;
    background-color: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
  }

  /* tiến độ dự kiến (lớp dưới) */
  .progress-bar.expected {
    position: absolute;
    height: 100%;
    background-color: #a5d8ff; /* xanh nhạt */
    width: 0;
    transition: width 0.4s ease;
  }

  /* tiến độ thực tế (lớp trên) */
  .progress-bar.actual {
    position: absolute;
    height: 100%;
    background-color: #4dabf7; /* xanh đậm hơn */
    width: 0;
    transition: width 0.4s ease;
  }
  .progress-container {
    position: relative;
    width: 100%;
    height: 10px;
    background-color: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
  }
  .progress-bar.expected {
    position: absolute;
    height: 100%;
    background-color: #a5d8ff;
    transition: width 0.4s ease;
  }
  .progress-bar.actual {
    position: absolute;
    height: 100%;
    background-color: #4dabf7;
    transition: width 0.4s ease;
  }
  .status-badge {
    font-size: 13px;
    display: inline-flex;
    align-items: center;
  }

  .comment-node {
    font-size: 14px;
  }

  .comment-node .border-start {
    border-color: rgba(0, 0, 0, 0.08) !important;
  }

  .border-light {
    border-color: rgba(0, 0, 0, 0.08) !important;
  }

  .comment-node:hover {
    background: #fafafa;
    transition: 0.2s ease;
  }
  .modal-body-fixed {
    max-height: 90vh; /* giới hạn chiều cao tổng thể */
    overflow: hidden; /* tránh cuộn toàn bộ modal */
  }

  .right-panel {
    overflow-y: auto;       /* 🔹 cho phép cuộn riêng */
    max-height: 90vh;       /* 🔹 chiều cao tối đa của cột phải */
    padding-right: 10px;    /* tránh dính sát scrollbar */
    scrollbar-width: thin;  /* thanh cuộn mảnh hơn (Firefox) */
  }

  .right-panel::-webkit-scrollbar {
    width: 6px; /* thanh cuộn nhỏ gọn */
  }

  .right-panel::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  .right-panel::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  .modal-body-fixed > .flex-grow-1 {
    overflow-y: auto;
    max-height: 90vh;
    padding-right: 10px;
  }
  /* 🔹 Tăng kích thước chữ trong toàn bộ modal */
  .modal-content {
    font-size: 15.5px !important; /* chữ to hơn mặc định (14 → 15.5) */
  }

  /* 🔹 Nếu muốn phần chữ trong cột phải nhỏ hơn một chút */
  .right-panel {
    font-size: 14.5px !important;
  }

  /* 🔹 Mở rộng modal chi tiết công việc */
  .modal-dialog.modal-xl {
    max-width: 1280px !important; /* mặc định Bootstrap chỉ ~1140px */
  }

  /* 🔹 Nếu muốn chiếm gần hết màn hình (rất rộng, kiểu dashboard) */
  @media (min-width: 1200px) {
    .modal-dialog.modal-xl {
      max-width: 1280px !important;
    }
  }
  /* 🔹 To hơn toàn bộ chữ trong modal & bảng */
  .all-work-items,
  .modal-content {
    font-size: 15.5px !important;   /* mặc định khoảng 13.5–14px → tăng vừa đẹp */
    line-height: 1.55 !important;   /* giãn dòng nhẹ cho dễ đọc */
    color: #222 !important;         /* màu chữ đậm hơn chút */
  }

  .small{
    font-size: 13px !important;
  }
  /* 🔹 Thanh cuộn mảnh, đồng bộ cho cả 2 cột */
  .modal-body-fixed > .flex-grow-1,
  .right-panel {
    overflow-y: auto;
    max-height: 90vh;
    padding-right: 10px;
    scrollbar-width: thin;
  }

  .modal-body-fixed > .flex-grow-1::-webkit-scrollbar,
  .right-panel::-webkit-scrollbar {
    width: 6px;
  }

  .modal-body-fixed > .flex-grow-1::-webkit-scrollbar-thumb,
  .right-panel::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  .modal-body-fixed > .flex-grow-1::-webkit-scrollbar-thumb:hover,
  .right-panel::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  /* 🔹 Toàn bộ phần modal chi tiết */
  .modal-content {
    font-size: 16px !important;      /* tăng rõ ràng, dễ đọc hơn */
    line-height: 1.6 !important;     /* giãn dòng hợp lý */
    color: #222 !important;
  }

  /* 🔹 Các nhãn (label, tiêu đề) */
  .modal-content label,
  .modal-content strong,
  .modal-content .fw-semibold,
  .modal-content h5,
  .modal-content h6 {
    font-size: 16.5px !important;
    font-weight: 600 !important;
  }

  /* 🔹 Ô nhập liệu, dropdown, textarea */
  .modal-content input,
  .modal-content select,
  .modal-content textarea,
  .modal-content .vselect-clean .vs__dropdown-toggle {
    font-size: 15.5px !important;
    padding: 10px 12px !important;
  }

  /* 🔹 Badge trạng thái */
  .modal-content .btn.dropdown-toggle {
    font-size: 15px !important;
    padding: 6px 12px !important;
  }

  /* 🔹 Bình luận (comment) */
  .modal-content .comment-node {
    font-size: 15px !important;
    line-height: 1.55 !important;
  }

  /* 🔹 Tabs “Chi tiết” / “Nhật ký” */
  .modal-content .tab-btn {
    font-size: 15.5px !important;
    padding: 8px 12px !important;
  }

  /* 🔹 Nhật ký (log-list) */
  .modal-content .log-row {
    font-size: 15px !important;
    line-height: 1.55 !important;
  }

  /* 🔹 Nút (Lưu, Hủy, Gửi bình luận,...) */
  .modal-content .btn {
    font-size: 15px !important;
    font-weight: 500 !important;
  }

  /* 🌟 Làm to ô nhập bình luận */
  :deep(.modal-content textarea.form-control) {
    font-size: 16px !important;       /* chữ to */
    line-height: 1.6 !important;
    min-height: 110px !important;     /* cao hơn rõ rệt */
    padding: 12px 14px !important;
    resize: vertical !important;
  }

  /* 🌟 To hơn toàn bộ chữ trong phần bình luận */
  :deep(.modal-content .comment-node) {
    font-size: 16px !important;
    line-height: 1.6 !important;
    padding: 8px 0 !important;
  }

  /* 🌟 Tên người bình luận & thời gian */
  :deep(.modal-content .comment-node .fw-semibold) {
    font-size: 16.2px !important;
    font-weight: 600 !important;
  }
  :deep(.modal-content .comment-node .text-secondary) {
    font-size: 14.8px !important;
  }

  /* 🌟 Nút “Gửi” bình luận */
  :deep(.modal-content .btn.btn-primary) {
    font-size: 15.5px !important;
    padding: 8px 18px !important;
    border-radius: 10px !important;
  }

  /* 🌟 Dãn cách bố cục comment */
  :deep(.modal-content .mb-2.mt-4) {
    margin-top: 1.4rem !important;
  }
  :deep(.modal-content .text-end.mb-3) {
    margin-bottom: 1.4rem !important;
  }

  /* 🌟 Nếu muốn phần hiển thị reply cũng to và có giãn cách */
  :deep(.comment-node .border-start) {
    border-color: rgba(0, 0, 0, 0.08) !important;
    margin-left: 8px;
    padding-left: 12px;
  }
  </style>
