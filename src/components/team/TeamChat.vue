<template>
  <div class="team-chat card border-0 shadow-sm">
    <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
      <div>
        <div class="d-flex align-items-center gap-2 mb-2">
          <h5 class="fw-semibold mb-0 text-dark">
            {{ team?.teamName || 'Chưa chọn nhóm' }}
            <i v-if="team?.referralCode" class="ref-code" style="font-size: 16px">
      (Mã GT: {{ team.referralCode }})
    </i>
          </h5>

          <!-- COPY BUTTON -->
          <button
              v-if="team?.referralCode"
              class="btn-copy"
              @click="copyReferralCode(team.referralCode)"
              title="Sao chép mã giới thiệu"
          >
            <i class="fa-solid fa-copy"></i>
          </button>
        </div>
        <small class="text-muted">Trò truyện nhóm</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" @click="$emit('refresh')">
          <i class="fa-solid fa-rotate"></i>
        </button>
      </div>
    </div>

    <div class="card-body p-0 d-flex flex-column">
      <div class="chat-messages" ref="messageContainer">

        <div>
          <button
              class="btn btn-link text-decoration-none w-100 small text-muted"
              @click="$emit('load-more')"
          >
            Xem thêm tin nhắn cũ
          </button>
          <div
              v-for="message in messages"
              :key="message.id"
              :id="`message-${message.id}`"
              :ref="(el) => registerMessageRef(message.id, el)"
              class="message-row"
              :class="{ 'justify-content-end': isMine(message) }"
          >
            <div
                class="message-bubble"
                :class="[
                isMine(message) ? 'mine' : 'theirs',
                highlightedMessage === message.id ? 'highlighted' : '',
                message.isRecalled ? 'recalled' : '',
              ]"
            >
              <div class="message-header mb-1">
                <strong>{{ message.senderName }}</strong>
              </div>

              <div
                  v-if="message.parentMessage"
                  class="reply-preview"
                  @click="jumpToMessage(message.parentMessage.id)"
              >
                <div class="small text-muted">
                  Trả lời {{ message.parentMessage.senderName }}
                </div>

                <!-- Nếu tin cha bị thu hồi -->
                <div v-if="message.parentMessage.isRecalled"
                     class=" text-muted fst-italic text-truncate">
                  Tin nhắn đã được thu hồi
                </div>

                <!-- Nếu tin cha còn -->
                <div v-else class="fw-semibold text-truncate">
                  {{ message.parentMessage.messageContent }}
                </div>
              </div>



              <div v-if="!message.isRecalled" class="message-content" v-html="formatContent(message.messageContent)"></div>
              <div v-else class="message-content text-muted fst-italic">Tin nhắn đã được thu hồi</div>

              <div v-if="message.attachments?.length" class="attachments">
                <template v-for="(file, index) in message.attachments" :key="index">

                  <!-- ẢNH -->
                  <!-- ẢNH -->
                  <a v-if="isImageFile(file)"
                     :href="getAttachmentUrl(file) || '#'"
                     target="_blank"
                     class="attachment-image"
                     :class="{ 'disabled-attachment': !getAttachmentUrl(file) }"
                     :ref="(el) => observeAttachment(file, el)">
                    <img :src="getAttachmentUrl(file) || '/placeholder-image.jpg'"
                         :alt="file.fileName || file.name || 'attachment'" />
                  </a>

                  <!-- FILE -->
                  <a v-else
                     :href="getAttachmentUrl(file) || '#'"
                     target="_blank"
                     class="attachment-file"
                     :class="{ 'disabled-attachment': !getAttachmentUrl(file) }"
                     :ref="(el) => observeAttachment(file, el)">
                    <i class="fa-solid fa-paperclip me-2"></i>
                    {{ file.fileName || file.name || 'Tập tin đính kèm' }}
                  </a>


                </template>
              </div>


              <div class="message-footer d-flex justify-content-between align-items-center mt-1">
                <small class="text-muted">{{ formatDate(message.createdAt) }}</small>
              </div>

              <div class="message-actions" v-if="!message.isRecalled">
                <button class="btn btn-action btn-reply" @click="setReplyTarget(message)">
                  <i :class="isMine(message) ? 'fa-solid fa-quote-left' : 'fa-solid fa-quote-right'"></i>
                </button>
                <button
                    class="btn btn-action btn-recall"
                    v-if="isMine(message) && canRecall && ( authStore.hasTeamPermission('TEAMCHAT_RECALL') ||
                     authStore.hasPermission('TEAMCHAT_RECALL'))"
                    @click="$emit('recall', message)"
                >
                  <i class="fa-solid fa-rotate-left"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="composer border-top">
        <div v-if="replyTarget" class="replying-to">
          <div>
            Đang trả lời <strong>{{ replyTarget.senderName }}</strong>
            <p class="mb-0 small text-muted text-truncate">{{ replyTarget.messageContent }}</p>
          </div>
          <button class="btn btn-link text-decoration-none" @click="replyTarget = null">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <!-- Mention dropdown khi gõ @ -->
        <div class="mention-dropdown-container" v-if="showMentionDropdown">
          <div class="mention-dropdown">
            <div class="fw-semibold small mb-2 px-3 pt-2">
              Nhắc tới thành viên
              <span v-if="mentionSearchText" class="text-muted">- Tìm: "{{ mentionSearchText }}"</span>
            </div>
            <div class="mention-list">
              <button
                  type="button"
                  class="mention-item d-flex align-items-center gap-2 w-100 px-3 py-2"
                  :class="{ 'active': mentionIndex === -1 }"
                  @click="selectMention(-1)"
              >
                <div class="mention-avatar all-mention">
                  <i class="fa-solid fa-users"></i>
                </div>
                <div class="d-flex flex-column align-items-start">
                  <span>@All</span>
                  <small class="text-muted">Nhắc đến tất cả mọi người</small>
                </div>
              </button>
              <button
                  v-for="(member, index) in filteredMembers"
                  :key="member.id || member.idE"
                  type="button"
                  class="mention-item d-flex align-items-center gap-2 w-100 px-3 py-2"
                  :class="{ 'active': mentionIndex === index }"
                  @click="selectMention(index)"
              >
                <img v-if="member.avatar" :src="buildPublicAvatarUrl(member.avatar)" class="mention-avatar" alt="avatar"/>
                <div v-else class="mention-avatar no-avatar">
                  <i class="fa-solid fa-user"></i>
                </div>
                <div class="d-flex flex-column align-items-start flex-grow-1">
                  <span>{{ member.fullName || member.name }}</span>
                  <small class="text-muted">@{{ member.tag }}</small>
                </div>
              </button>
              <div v-if="filteredMembers.length === 0" class="text-center text-muted py-3">
                Không tìm thấy thành viên phù hợp
              </div>
            </div>
          </div>
        </div>

        <div class="composer-input">
          <textarea
              v-model="newMessage"
              rows="2"
              class="form-control border-0"
              placeholder="Nhập tin nhắn, dùng @ để nhắc tới thành viên"
              @keydown.enter.exact.prevent="handleSend"
              @keydown="handleKeydown"
              @input="handleInput"
              @paste="handlePaste"
              ref="messageInput"
          ></textarea>
          <div class="composer-toolbar">
            <div class="d-flex gap-2">
              <div class="attachment-input">
                <input
                    type="file"
                    ref="fileInput"
                    class="form-control form-control-sm d-none"
                    @change="handleFileSelect"
                    multiple
                />
                <button class="btn btn-sm btn-outline-secondary" @click="triggerFileInput">
                  <i class="fa-solid fa-paperclip"></i>
                </button>
              </div>

              <!-- Giữ lại nút @ cũ -->
              <div class="dropdown" @click.stop>
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown"
                        type="button">
                  <i class="fa-solid fa-at"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-end p-2 mentions-dropdown">
                  <div class="fw-semibold small mb-2">Nhắc tới thành viên</div>
                  <button
                      type="button"
                      class="dropdown-item d-flex align-items-center gap-2"
                      @click="insertMentionAll"
                  >
                    <div class="mention-avatar all-mention small">
                      <i class="fa-solid fa-users"></i>
                    </div>
                    <div class="d-flex flex-column align-items-start">
                      <span>@All</span>
                      <small class="text-muted">Nhắc đến tất cả mọi người</small>
                    </div>
                  </button>
                  <button
                      v-for="member in availableMembersForDropdown"
                      :key="member.id || member.idE"
                      type="button"
                      class="dropdown-item d-flex align-items-center gap-2"
                      @click="insertMentionFromDropdown(member)"
                  >
                <img v-if="member.avatar" :src="buildPublicAvatarUrl(member.avatar)" class="mention-avatar" alt="avatar"/>
                    <div v-else class="mention-avatar no-avatar">
                      <i class="fa-solid fa-user"></i>
                    </div>
                    <div class="d-flex flex-column align-items-start">
                      <span>{{ member.fullName || member.name }}</span>
                      <small class="text-muted">@{{ member.tag }}</small>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <button v-if="authStore.hasTeamPermission('TEAMCHAT_SEND') || authStore.hasPermission('TEAMCHAT_SEND')"
                     class="btn btn-thg" :disabled="sending || !canSend" @click="handleSend">
              <i class="fa-solid fa-paper-plane me-1" :class="{ 'fa-beat': sending }"></i>
              Gửi
            </button>
          </div>
        </div>

        <div v-if="pendingAttachments.length" class="pending-attachments">
          <div
              v-for="(file, index) in pendingAttachments"
              :key="`${file.url}-${index}`"
              class="pending-attachment"
          >
            <div class="d-flex align-items-center gap-2">
              <i :class="file.type === 'image' ? 'fa-regular fa-image text-info' : 'fa-regular fa-file text-secondary'"></i>
              <span class="text-truncate">{{ file.name || file.url }}</span>
            </div>
            <button class="btn btn-link text-decoration-none text-danger" @click="removeAttachment(index)">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useAuthStore} from "../../stores/authStore.js";
import { buildPublicAvatarUrl, isImageFile } from '../../utils/fileUrl.js'
import {showError, showSuccess} from "../../assets/js/alertService.js";
import {getCachedFileDataUrl, loadPrivateFileDataUrl, resolveFileId} from "../../api/fileApi.js";

const authStore = useAuthStore();

const props = defineProps({
  team: {type: Object, default: null},
  messages: {type: Array, default: () => []},
  members: {type: Array, default: () => []},
  loading: {type: Boolean, default: false},
  currentUserId: {type: [String, Number], default: null},
  sending: {type: Boolean, default: false},
  canRecall: {type: Boolean, default: true},
  hasMore: {type: Boolean, default: false},
})

const emit = defineEmits(['send', 'recall', 'load-more', 'refresh'])

const newMessage = ref('')
const pendingAttachments = ref([])
const replyTarget = ref(null)
const highlightedMessage = ref(null)
const messageContainer = ref(null)
const messageInput = ref(null)
const messageRefs = new Map()
const fileInput = ref(null)
const attachmentUrls = ref({})
const attachmentPromises = new Map()
const attachmentElements = new Map()

// Mention functionality
const showMentionDropdown = ref(false)
const mentionIndex = ref(-1)
const mentionStartPos = ref(-1)
const mentionSearchText = ref('')

const canSend = computed(() => {
  return Boolean(newMessage.value.trim() || pendingAttachments.value.length)
})

const latestMessageId = ref(null)

const filteredMembers = computed(() => {
  let members = props.members.filter(member => {
    const memberId = member.id || member.idE
    return memberId && String(memberId) !== String(props.currentUserId)
  })

  if (mentionSearchText.value) {
    const searchTerm = mentionSearchText.value.toLowerCase()

    members = members.filter(member => {
      const name = (member.fullName || member.name || '').toLowerCase()
      const tag = (member.tag || '').toLowerCase()

      return (
          name.includes(searchTerm) ||
          tag.includes(searchTerm)
      )
    })
  }

  return members
})

watch(
    () => props.messages?.[props.messages.length - 1]?.id,
    (newId) => {
      if (newId && newId !== latestMessageId.value) {
        latestMessageId.value = newId
        scrollToBottom()
      }

      // Nếu danh sách được reset (team khác), đảm bảo cập nhật lại id cuối
      if (!newId) {
        latestMessageId.value = null
      }
    },
)

const page = ref(0)
const size = 40
const internalMessages = ref([])  // dùng để hiển thị
const hasMoreInternal = ref(true)
watch(
    () => props.messages,
    (newList) => {
      internalMessages.value = [...newList]
      nextTick(() => scrollToBottom())
    },
    { immediate: true }
)
const loadMessages = async (reset = false) => {
  if (props.loading) return

  try {
    if (reset) {
      page.value = 0
      internalMessages.value = []
      hasMoreInternal.value = true
    }

    emit("load-more", { page: page.value, size })

  } catch (e) {
    console.error("Lỗi load:", e)
  }
}



const registerMessageRef = (id, el) => {
  if (!id) return
  if (el) {
    messageRefs.set(id, el)
  } else {
    messageRefs.delete(id)
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    const el = messageContainer.value
    if (el) {
      el.scrollTo({top: el.scrollHeight, behavior: 'smooth'})
    }
  })
}

const isMine = (message) => {
  if (!props.currentUserId || !message) return false
  const candidate = message.senderId ?? message.author?.id ?? message.author?.idE
  return candidate != null && String(candidate) === String(props.currentUserId)
}

const formatDate = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  }).format(new Date(date))
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    const url = URL.createObjectURL(file)
    pendingAttachments.value.push({
      url: url,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      name: file.name,
      file: file
    })
  })
  event.target.value = ''
}

// Handle paste from clipboard
const handlePaste = async (event) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile()
      if (file) {
        const url = URL.createObjectURL(file)
        pendingAttachments.value.push({
          url: url,
          type: 'image',
          name: `pasted-image-${Date.now()}.png`,
          file: file
        })
      }
    }
  }
}

const removeAttachment = (index) => {
  const attachment = pendingAttachments.value[index]
  if (attachment.url.startsWith('blob:')) {
    URL.revokeObjectURL(attachment.url)
  }
  pendingAttachments.value.splice(index, 1)
}

const formatContent = (content) => {
  if (!content) return ''

  return content
      // link
      .replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>')
      // newline
      .replace(/\n/g, '<br />')
      // highlight all @tag
      .replace(/@([a-zA-Z0-9._-]+)/g, '<span class="mention-text">@$1</span>')
}

const setAttachmentUrl = (id, value) => {
  attachmentUrls.value = { ...attachmentUrls.value, [id]: value || '' }
}

const loadAttachment = (file) => {
  if (file?.tempUrl) return file.tempUrl

  const id = resolveFileId(file)
  if (!id) return null

  const cached = attachmentUrls.value[id] || getCachedFileDataUrl(id)
  if (cached) {
    setAttachmentUrl(id, cached)
    return cached
  }

  if (attachmentPromises.has(id)) return attachmentPromises.get(id)

  const promise = loadPrivateFileDataUrl(id)
      .then((dataUrl) => {
        setAttachmentUrl(id, dataUrl || '')
        return dataUrl
      })
      .catch(() => null)
      .finally(() => attachmentPromises.delete(id))

  attachmentPromises.set(id, promise)
  return promise
}

const attachmentObserver = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        const file = attachmentElements.get(entry.target)
        if (file) {
          loadAttachment(file)
          attachmentObserver.unobserve(entry.target)
          attachmentElements.delete(entry.target)
        }
      })
    }, { rootMargin: '200px' })
    : null

const getAttachmentUrl = (file) => {
  if (file?.tempUrl) return file.tempUrl

  const id = resolveFileId(file)
  if (!id) return null

  const cached = attachmentUrls.value[id] || getCachedFileDataUrl(id)
  if (cached) {
    setAttachmentUrl(id, cached)
    return cached
  }

  return null
}

const observeAttachment = (file, el) => {
  const id = resolveFileId(file)
  if (!id) return

  if (!attachmentObserver) {
    loadAttachment(file)
    return
  }

  if (el) {
    attachmentElements.set(el, file)
    attachmentObserver.observe(el)
  } else {
    attachmentElements.delete(el)
  }
}


const setReplyTarget = (message) => {
  replyTarget.value = message
}

const jumpToMessage = (id) => {
  if (!id) return
  const target = messageRefs.get(id)
  if (target) {
    target.scrollIntoView({behavior: 'smooth', block: 'center'})
    highlightedMessage.value = id
    setTimeout(() => {
      highlightedMessage.value = null
    }, 2000)
  }
}

// Mention functionality - khi gõ @
const handleInput = () => {
  checkForMentionTrigger()
}

const handleKeydown = (event) => {
  if (showMentionDropdown.value) {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      mentionIndex.value = mentionIndex.value <= 0 ? filteredMembers.value.length : mentionIndex.value - 1
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      mentionIndex.value = mentionIndex.value >= filteredMembers.value.length ? -1 : mentionIndex.value + 1
    } else if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation() // <== Thêm dòng này

      if (mentionIndex.value >= -1) {
        selectMention(mentionIndex.value)
      }

    } else if (event.key === 'Escape') {
      hideMentionDropdown()
    }
    // Không xử lý backspace ở đây, để handleInput xử lý
  } else if (event.key === '@') {
    // ❌ KHÔNG preventDefault nữa
    setTimeout(() => {
      showMentionDropdown.value = true
      mentionIndex.value = -1
      mentionStartPos.value = newMessage.value.length
      mentionSearchText.value = ''
    }, 10)
  }
}


  const checkForMentionTrigger = () => {
  const text = newMessage.value
  const cursorPos = messageInput.value?.selectionStart || text.length

  // Tìm ký tự @ cuối cùng trước con trỏ
  const lastAtPos = text.lastIndexOf('@', cursorPos - 1)

  if (lastAtPos !== -1) {
    const followingText = text.substring(lastAtPos + 1, cursorPos)
    // Kiểm tra nếu không có khoảng trắng sau @ (vẫn đang gõ tên)
    if (!followingText.includes(' ')) {
      showMentionDropdown.value = true
      mentionStartPos.value = lastAtPos
      mentionIndex.value = -1
      mentionSearchText.value = followingText
      return
    }
  }

  hideMentionDropdown()
}

const hideMentionDropdown = () => {
  showMentionDropdown.value = false
  mentionIndex.value = -1
  mentionStartPos.value = -1
  mentionSearchText.value = ''
}

const selectMention = (index) => {
  let mentionText = ''

  if (index === -1) {
    mentionText = '@All'
  } else {
    const member = filteredMembers.value[index]
    mentionText = member.tag
  }

  if (mentionStartPos.value !== -1) {
    const beforeMention = newMessage.value.substring(0, mentionStartPos.value)
    const currentText = newMessage.value
    const cursorPos = messageInput.value?.selectionStart || currentText.length
    const afterMention = currentText.substring(cursorPos)

    // ❌ KHÔNG thêm @ nữa
    newMessage.value = beforeMention + mentionText + ' ' + afterMention

    nextTick(() => {
      messageInput.value?.focus()
      const newCursorPos = beforeMention.length + mentionText.length + 1
      messageInput.value.setSelectionRange(newCursorPos, newCursorPos)
    })
  } else {
    newMessage.value += mentionText + ' '
  }

  hideMentionDropdown()
}

const availableMembersForDropdown = computed(() => {
  return props.members.filter(member => {
    const memberId = member.id || member.idE
    return memberId && String(memberId) !== String(props.currentUserId)
  })
})

const insertMentionFromDropdown = (member) => {

  newMessage.value = `${newMessage.value}@${member.tag} `
  // Focus lại input sau khi chọn
  nextTick(() => {
    messageInput.value?.focus()
  })
}

const insertMentionAll = () => {
  newMessage.value = `${newMessage.value}@All `
  // Focus lại input sau khi chọn
  nextTick(() => {
    messageInput.value?.focus()
  })
}

const handleSend = () => {
  if (!canSend.value) return
  emit('send', {
    content: newMessage.value.trim(),
    attachments: pendingAttachments.value,
    replyToId: replyTarget.value?.id || null,
  })
  newMessage.value = ''
  pendingAttachments.value = []
  replyTarget.value = null
  hideMentionDropdown()
}

// Click outside để đóng mention dropdown
const handleClickOutside = (event) => {
  if (showMentionDropdown.value && !event.target.closest('.mention-dropdown-container') && !event.target.closest('.composer-input')) {
    hideMentionDropdown()
  }
}

const copyReferralCode = async (code) => {
  try {
    await navigator.clipboard.writeText(code);
    showSuccess("Đã sao chép mã giới thiệu!");
  } catch (err) {
    // Fallback cho HTTP (VPS không HTTPS)
    try {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      showSuccess("Đã sao chép mã giới thiệu!");
    } catch (e) {
      showError("Không thể sao chép");
    }
  }
};


onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  messageRefs.clear()

  attachmentObserver?.disconnect()
  attachmentElements.clear()

  // Dọn dẹp blob URLs
  pendingAttachments.value.forEach(attachment => {
    if (attachment.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url)
    }
  })
})




</script>

<style scoped>
.team-chat {
  border-radius: 18px;
  height: 100%;
  position: relative;
}

.card-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  background: #f6f6f5;
  max-height: 60vh;
}

.message-row {
  display: flex;
  margin-bottom: 1rem;
  position: relative;
}

.message-bubble {
  max-width: 75%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message-bubble.mine {
  position: relative;
  background: #fff;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  z-index: 1;
}

.message-bubble.mine::before {
  content: "";
  position: absolute;
  inset: 0; /* full */
  padding: 2.5px; /* độ dày viền */
  border-radius: 10px; /* BO GÓC NÈ */
  background: linear-gradient(135deg, #031358, #0030FF);
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
  linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  z-index: -1;
  opacity: 0.7;
}

.message-bubble.theirs {
  background-color: #fff;
}

.message-bubble.highlighted {
  box-shadow: 0 0 0 3px rgba(3, 19, 88, 0.4);
}

.reply-preview {
  background: rgba(3, 19, 88, 0.05);
  border-radius: 10px;
  padding: 0.35rem 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-left: 3px solid #0030FF;
}

.message-content a {
  color: #0030FF;
  text-decoration: underline;
}

.attachments {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.attachment-image {
  border-radius: 12px;
  overflow: hidden;
  display: block;
}

.attachment-image img {
  max-width: 220px;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.attachment-image:hover img {
  transform: scale(1.05);
}

.attachment-file {
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  border: 1px dashed rgba(3, 19, 88, 0.3);
  font-size: 0.85rem;
  color: #031358;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
}

  .attachment-file:hover {
    background: rgba(3, 19, 88, 0.05);
    border-color: #0030FF;
  }

  .disabled-attachment {
    pointer-events: none;
    opacity: 0.7;
  }

  .message-footer {
    font-size: 0.75rem;
  }

/* Message actions positioning */
.message-actions {
  position: absolute;
  top: 8px;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: all 0.3s ease;
}

/* Tin nhắn của mình - nút hành động bên trái */
.message-row.justify-content-end .message-actions {
  left: -45px;
  flex-direction: column;
}

/* Tin nhắn của người khác - nút hành động bên phải */
.message-row:not(.justify-content-end) .message-actions {
  right: -45px;
  flex-direction: column;
}

.message-row:hover .message-actions {
  opacity: 1;
  transform: translateX(0);
}

.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(3, 19, 88, 0.2);
  color: #031358;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.btn-action:hover {
  background: #031358;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.3);
}

.composer {
  padding: 0.75rem 1.25rem;
  background-color: #fff;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  position: relative;
}

.replying-to {
  background: rgba(3, 19, 88, 0.08);
  border-radius: 12px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid #0030FF;
}

.composer-input textarea {
  resize: none;
  box-shadow: none;
  border: 1px solid rgba(3, 19, 88, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
}

.composer-input textarea:focus {
  border-color: #0030FF;
  box-shadow: 0 0 0 0.2rem rgba(0, 48, 255, 0.1);
}

.composer-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.attachment-input {
  display: flex;
  gap: 0.35rem;
}

.pending-attachments {
  margin-top: 0.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pending-attachment {
  background: rgba(3, 19, 88, 0.05);
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-width: 220px;
  border: 1px solid rgba(3, 19, 88, 0.1);
}

.btn-thg {
  background: linear-gradient(135deg, #031358, #0030FF);
  border: none;
  color: #fff;
  font-weight: 600;
  border-radius: 12px;
  padding: 0.5rem 1.25rem;
  transition: all 0.2s ease;
}

.btn-thg:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.3);
}

.btn-thg:disabled {
  opacity: 0.6;
  transform: none;
}

/* Mention dropdown styles */
.mention-dropdown-container {
  position: absolute;
  bottom: 100%;
  left: 1.25rem;
  right: 1.25rem;
  z-index: 1000;
  margin-bottom: 0.5rem;
}

.mention-dropdown {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(3, 19, 88, 0.1);
  max-height: 240px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mention-list {
  overflow-y: auto;
  max-height: 200px;
}

.mention-item {
  border: none;
  background: none;
  text-align: left;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(3, 19, 88, 0.05);
}

.mention-item:last-child {
  border-bottom: none;
}

.mention-item:hover,
.mention-item.active {
  background: rgba(3, 19, 88, 0.05);
}

.mention-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(3, 19, 88, 0.1);
  color: #031358;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.mention-avatar.all-mention {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
}

.mention-avatar.all-mention.small {
  width: 24px;
  height: 24px;
  font-size: 0.7rem;
}

.mention-avatar.no-avatar {
  background: rgba(3, 19, 88, 0.1);
  color: #031358;
}

/* Dropdown menu cũ */
.mentions-dropdown {
  max-height: 240px;
  overflow-y: auto;
  min-width: 280px;
  border-radius: 12px;
  border: 1px solid rgba(3, 19, 88, 0.1);
}

.message-bubble.recalled {
  background: repeating-linear-gradient(45deg, #f8f9fa, #f8f9fa 10px, #ececec 10px, #ececec 20px);
  color: #6c757d;
}

/* Custom scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(3, 19, 88, 0.05);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(3, 19, 88, 0.2);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(3, 19, 88, 0.4);
}

.mention-list::-webkit-scrollbar,
.mentions-dropdown::-webkit-scrollbar {
  width: 4px;
}

.mention-list::-webkit-scrollbar-track,
.mentions-dropdown::-webkit-scrollbar-track {
  background: rgba(3, 19, 88, 0.05);
}

.mention-list::-webkit-scrollbar-thumb,
.mentions-dropdown::-webkit-scrollbar-thumb {
  background: rgba(3, 19, 88, 0.2);
  border-radius: 2px;
}

.mention-text {
  color: #0d6efd;          /* Xanh đặc trưng THG */
  font-weight: 600;
  background: rgba(13,110,253,0.08);
  padding: 2px 4px;
  border-radius: 6px;
}

.message-content :deep(.mention-text) {
  color: #0d6efd;
  font-weight: 600;
  background: rgba(13,110,253,0.08);
  padding: 2px 4px;
  border-radius: 6px;
}

.ref-code {
  color: #0030ff;
  font-weight: 600;
  margin-left: 4px;
}

.btn-copy {
  border: none;
  background: rgba(0, 48, 255, 0.08);
  color: #0030ff;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-copy:hover {
  background: rgba(0, 48, 255, 0.18);
  transform: translateY(-1px);
}

</style>
