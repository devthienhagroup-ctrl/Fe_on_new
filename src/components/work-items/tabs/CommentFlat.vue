  <template>
    <div class="comment-flat d-flex align-items-start gap-2 py-2">
      <div class="avatar-circle mt-1 flex-shrink-0">
        <img
            class="rounded-circle"
            :src="comment.avatar ? ` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${comment.avatar}` : '/images/default-avatar.png'"
            alt="avatar"
            width="32"
            height="32"
        />
      </div>

      <div class="flex-grow-1">
        <div class="fw-semibold small">{{ comment.fullName }}</div>

        <div class="text-muted small" v-if="comment.replyToName">
          ↪ Trả lời <b>{{ comment.replyToName }}</b>
        </div>

        <!-- Nội dung có tô màu @ -->
        <div v-html="formattedContent" class="comment-text"></div>

        <button
            class="btn btn-sm btn-link text-primary text-decoration-none p-0 mt-1"
            @click="$emit('reply', comment)"
        >
          <i class="fa-regular fa-comment-dots me-1"></i> Trả lời
        </button>

        <!-- Nếu có replies, render tiếp -->
        <div v-if="comment.replies && comment.replies.length" class="mt-2">
          <CommentFlat
              v-for="r in comment.replies"
              :key="r.commentID || r.id"
              :comment="r"
              @reply="$emit('reply', $event)"
          />
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { computed } from "vue";
  import CommentFlat from "./CommentFlat.vue";

  const props = defineProps({ comment: Object });

  const formattedContent = computed(() => {
    const content = props.comment?.content ?? "";
    if (!content) return "";
    const withMentions = highlightMentions(content);
    return withMentions.replace(/\n/g, "<br />");
  });

  function highlightMentions(value = "") {
    return value.replace(
        /(^|[^@\w])(@[\p{L}\p{N}_]+)/gu,
        (match, prefix, mention) => `${prefix}<span class="comment-mention">${mention}</span>`
    );
  }
  </script>

  <style scoped>
  .comment-flat {
    font-size: 14px;
  }
  .comment-flat:hover {
    background-color: #fafafa;
  }
  :deep(.comment-mention) {
    color: #0d6efd;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
  }
  :deep(.comment-mention:hover) {
    color: #0b5ed7;
    text-decoration: underline;
  }
  </style>
