<template>
  <div
      class="comment-node d-flex align-items-start gap-2 py-3 border-bottom"
      :class="{ 'comment-node--nested': depth > 0 }"
  >
    <!-- Avatar -->
    <div class="avatar-circle mt-1">
      <img
          class="rounded-circle"
          :src="comment.avatar ? ` https://s3.cloudfly.vn/thg-storage/uploads-public/${comment.avatar}` : '/images/default-avatar.png'"
          alt="avatar"
          width="35"
          height="35"
      />
    </div>

    <div class="flex-grow-1">
      <!-- Header -->
      <div class="fw-semibold small d-flex align-items-center justify-content-between">
        <div class="mb-0 small">
          {{ comment.fullName }}
          <span class="text-muted ">
            (<span class="text-primary">CM-{{ comment.commentID }}</span>)
          </span>
        </div>
        <span class="text-secondary small me-2" style="font-size: 13px!important;">
          {{ formatDate(comment.createAt) }}
        </span>
      </div>

      <!-- Nội dung -->
      <div>
        <template v-if="comment.replyToName">
          <span class="text-muted small">
            ↪ Trả lời <b>{{ comment.replyToName }}</b> (CM-{{ comment.replyToId }})
          </span><br />
        </template>

        <!-- Nếu đang chỉnh sửa -->
        <div v-if="editing">
          <CommentMentionTextarea
              v-model="editContent"
              :employees="commentMentionEmployees"
              :rows="2"
              textarea-class="form-control form-control-sm mt-2"
              placeholder="Chỉnh sửa bình luận..."
          />
          <div class="mt-2 text-end">
            <button class="btn btn-sm btn-success me-2" @click="saveEdit">
              <i class="fa-regular fa-floppy-disk me-1"></i> Lưu
            </button>
            <button class="btn btn-sm btn-secondary" @click="cancelEdit">Hủy</button>
          </div>
        </div>

        <!-- Nếu không chỉnh sửa -->
        <div v-else class="comment-text" v-html="formattedContent"></div>
      </div>

      <!-- Hành động -->
      <div class="d-flex align-items-center gap-3 mt-1">
        <button
            class="btn btn-sm btn-link text-primary text-decoration-none p-0"
            @click="$emit('reply', comment)"
        >
          <i class="fa-regular fa-comment-dots me-1"></i> Trả lời
        </button>

        <button
            v-if="canEditOwnComment"
            class="btn btn-sm btn-link text-warning text-decoration-none p-0"
            @click="startEdit"
        >
          <i class="fa-regular fa-pen-to-square me-1"></i> Chỉnh sửa
        </button>
      </div>

      <!-- Replies -->
      <div
          v-if="comment.replies && comment.replies.length"
          class="comment-replies mt-2"
          :class="{ 'comment-replies--top-level': depth === 0 }"
      >
        <CommentNode
            v-for="(r, j) in comment.replies"
            :key="j"
            :comment="r"
            :depth="depth + 1"
            :comment-mention-employees="commentMentionEmployees"
            @reply="$emit('reply', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, ref } from "vue";
import { useAuthStore } from "../../../stores/authStore.js";
import api from "../../../api/api.js";
import CommentMentionTextarea from "./CommentMentionTextarea.vue";
import { showError, showSuccess } from "../../../assets/js/alertService.js";

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  depth: {
    type: Number,
    default: 0,
  },
  commentMentionEmployees: {
    type: Array,
    default: () => [],
  },
});

const authStore = useAuthStore();
const userEmail = computed(() => authStore.userEmail || authStore.userInfo?.email || null);
const canEditComment = computed(() => Array.isArray(authStore.listAuthority) && authStore.listAuthority.includes('COMMENT_UPDATE'));

const editing = ref(false);
const editContent = ref("");

const canEditOwnComment = computed(() => {
  return (
      canEditComment.value &&
      !!userEmail.value &&
      props.comment.email === userEmail.value
  );
});

const formattedContent = computed(() => {
  const content = props.comment?.content ?? "";
  if (!content) return "";
  const escaped = escapeHtml(content);
  const withMentions = highlightMentions(escaped);
  return withMentions.replace(/\n/g, "<br />");
});
import { nextTick } from "vue";
function startEdit() {
  if (!canEditOwnComment.value) return;
  editContent.value = props.comment.content;
  editing.value = true;

  // 🟢 Sau khi hiển thị textarea, đảm bảo mention hoạt động
  nextTick(() => {
    const textarea = document.querySelector(".form-control-sm.mt-2");
    if (textarea) {
      textarea.focus();
      // Gây trigger lại input để mention system nhận biết
      const event = new Event("input", { bubbles: true });
      textarea.dispatchEvent(event);
    }
  });
}



function cancelEdit() {
  editing.value = false;
  editContent.value = "";
}

async function saveEdit() {
  if (!canEditOwnComment.value) return;
  if (!editContent.value.trim()) return;

  try {
    await api.post("/admin.thg/project/work/update_comment", {
      commentID: props.comment.commentID,
      content: editContent.value,
    });
    props.comment.content = editContent.value;
    editing.value = false;
    showSuccess("Đã cập nhật bình luận!");
  } catch (err) {
    console.error(err);
    showError("Không thể cập nhật bình luận!");
  }
}

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN");
}

function escapeHtml(value = "") {
  return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function highlightMentions(value = "") {
  return value.replace(/(^|[^@\w])(@[\p{L}\p{N}_]+)/gu, (match, prefix, mention) => {
    return `${prefix}<span class="comment-mention">${mention}</span>`;
  });
}
</script>

<style scoped>
.comment-node {
  font-size: 14px;
  --comment-indent: 20px;
}
.comment-node:hover {
  background: #fafafa;
  transition: 0.2s ease;
}
.comment-node--nested {
  border-left: 2px solid rgba(0, 0, 0, 0.08);
  margin-left: calc(-1 * var(--comment-indent));
  padding-left: var(--comment-indent);
}
.comment-replies--top-level {
  margin-left: var(--comment-indent);
}
.comment-text {
  font-size: 14px;
  color: #212529;
  word-break: break-word;
  white-space: normal;
}
:deep(.comment-mention) {
  color: #0d6efd;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s;
}
:deep(.comment-mention:hover) {
  text-decoration: underline;
  color: #0b5ed7;
}
</style>
