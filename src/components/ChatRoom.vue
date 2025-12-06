<template>
  <div class="chat-room card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-2">
        <div class="chat-title">Team Chat</div>
        <span v-if="teamName" class="badge bg-light text-dark">{{ teamName }}</span>
      </div>
      <button
        class="btn btn-sm btn-outline-secondary"
        :disabled="isLoading"
        @click="loadInitialMessages"
      >
        <i class="fa-solid fa-rotate"></i>
      </button>
    </div>

    <div class="card-body d-flex flex-column chat-body">
      <div class="chat-messages" ref="messageContainer">
        <div v-if="isLoading" class="text-center text-muted py-4">
          <i class="fa-solid fa-spinner fa-spin me-2"></i>Đang tải tin nhắn...
        </div>

        <template v-else>
          <button
            v-if="hasMore"
            class="btn btn-link text-decoration-none w-100 load-more"
            :disabled="isLoadingMore"
            @click="loadOlderMessages"
          >
            <span v-if="isLoadingMore">
              <i class="fa-solid fa-spinner fa-spin me-2"></i>Đang tải...
            </span>
            <span v-else>Xem tin nhắn cũ</span>
          </button>

          <div
            v-for="message in messages"
            :key="message.id"
            class="message-row"
            :class="{ 'align-right': isOwnMessage(message) }"
          >
            <div class="avatar" v-if="!isOwnMessage(message)">
              <img v-if="message.avatar" :src="message.avatar" alt="avatar" />
              <div v-else class="avatar-placeholder">
                <i class="fa-solid fa-user"></i>
              </div>
            </div>

            <div class="bubble" :class="isOwnMessage(message) ? 'mine' : 'theirs'">
              <div class="sender" v-if="!isOwnMessage(message)">{{ message.senderName }}</div>
              <div v-if="message.type === 'image' && message.content" class="image-message">
                <img :src="message.content" alt="image message" />
              </div>
              <div v-else-if="message.type === 'file'" class="file-message">
                <div class="file-name">{{ message.content || 'Tập tin' }}</div>
                <a
                  v-if="message.fileUrl"
                  class="btn btn-sm btn-outline-light"
                  :href="message.fileUrl"
                  download
                >
                  <i class="fa-solid fa-download me-1"></i>Tải xuống
                </a>
              </div>
              <div v-else class="text-message">{{ message.content }}</div>
              <div class="timestamp">{{ formatTimestamp(message.createdAt) }}</div>
            </div>

            <div class="avatar" v-if="isOwnMessage(message)">
              <img v-if="message.avatar" :src="message.avatar" alt="avatar" />
              <div v-else class="avatar-placeholder">
                <i class="fa-solid fa-user"></i>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import api from '@/api/api.js'

const props = defineProps({
  teamId: {
    type: [String, Number],
    required: true,
  },
  currentUserId: {
    type: [String, Number],
    required: true,
  },
  teamName: {
    type: String,
    default: '',
  },
})

const size = 40
const page = ref(0)
const messages = ref([])
const hasMore = ref(true)
const isLoading = ref(false)
const isLoadingMore = ref(false)
const messageContainer = ref(null)

const isOwnMessage = (message) => {
  if (!message || props.currentUserId == null) return false
  return String(message.senderId) === String(props.currentUserId)
}

const formatTimestamp = (value) => {
  if (!value) return ''
  return dayjs(value).format('HH:mm, DD/MM/YYYY')
}

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`

const normalizeMessages = (list = []) => {
  return [...list]
    .map((item) => ({
      id: item.id || item.messageId || generateId(),
      senderId: item.senderId || item.authorId || item.userId,
      senderName: item.senderName || item.authorName || item.author?.name || 'Người dùng',
      avatar: item.avatar || item.author?.avatar,
      content: item.content || item.messageContent || item.text,
      createdAt: item.createdAt || item.createdDate || item.time,
      type: item.type || item.messageType || inferType(item),
      fileUrl: item.fileUrl || item.url,
    }))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

const inferType = (item) => {
  const type = (item.type || item.messageType || '').toLowerCase()
  if (type) return type
  const url = item.fileUrl || item.url || item.content
  if (!url) return 'text'
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase()
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext)) return 'image'
  return item.fileUrl || item.url ? 'file' : 'text'
}

const fetchMessages = async (pageNumber) => {
  if (!props.teamId) return []
  const res = await api.get(`/chat/messages/${props.teamId}`, {
    params: { page: pageNumber, size },
  })
  return Array.isArray(res.data) ? res.data : []
}

const scrollToBottom = async () => {
  await nextTick()
  const container = messageContainer.value
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

const appendOldMessages = async (olderMessages, oldScrollHeight, oldScrollTop) => {
  if (!olderMessages.length) return
  const container = messageContainer.value
  messages.value = [...olderMessages, ...messages.value]
  await nextTick()
  if (container) {
    const newScrollHeight = container.scrollHeight
    container.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight)
  }
}

const loadInitialMessages = async () => {
  if (isLoading.value) return
  isLoading.value = true
  hasMore.value = true
  page.value = 0
  try {
    const data = await fetchMessages(0)
    messages.value = normalizeMessages(data)
    hasMore.value = data.length === size
    await scrollToBottom()
  } finally {
    isLoading.value = false
  }
}

const loadOlderMessages = async () => {
  if (isLoading.value || isLoadingMore.value || !hasMore.value) return
  const container = messageContainer.value
  if (!container) return
  const oldScrollHeight = container.scrollHeight
  const oldScrollTop = container.scrollTop
  isLoadingMore.value = true
  try {
    const nextPage = page.value + 1
    const data = await fetchMessages(nextPage)
    const normalized = normalizeMessages(data)
    await appendOldMessages(normalized, oldScrollHeight, oldScrollTop)
    hasMore.value = data.length === size
    if (data.length > 0) {
      page.value = nextPage
    }
  } finally {
    isLoadingMore.value = false
  }
}

onMounted(loadInitialMessages)

watch(
  () => props.teamId,
  async () => {
    messages.value = []
    page.value = 0
    hasMore.value = true
    await loadInitialMessages()
  }
)
</script>

<style scoped>
.chat-room {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.card-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
}

.chat-title {
  font-weight: 700;
  font-size: 16px;
}

.chat-body {
  padding: 0;
  flex: 1;
  min-height: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.load-more {
  margin-bottom: 4px;
  color: #2563eb;
}

.message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message-row.align-right {
  flex-direction: row-reverse;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  color: #6b7280;
}

.bubble {
  max-width: 70%;
  padding: 10px 12px;
  border-radius: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bubble.mine {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.bubble.theirs {
  background: #f3f4f6;
  color: #111827;
  border-bottom-left-radius: 4px;
}

.sender {
  font-weight: 700;
  font-size: 13px;
}

.text-message {
  white-space: pre-wrap;
  word-break: break-word;
}

.image-message img {
  max-width: 260px;
  border-radius: 8px;
  display: block;
}

.file-message {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-name {
  font-weight: 600;
}

.timestamp {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
}

.bubble.theirs .timestamp {
  color: #6b7280;
}
</style>
