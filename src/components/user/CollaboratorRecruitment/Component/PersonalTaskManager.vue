<template>
  <div class="personal-task-management">
    <!-- Header -->
    <header class="header">
      <h1 class="title">QUẢN LÝ CÔNG VIỆC CÁ NHÂN</h1>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <!-- Left Column - 8/12 -->
        <div class="left-column">
          <!-- Task Name -->
          <div class="task-card">
            <h2 class="task-name">Cộng tác viên bất động sản</h2>

            <!-- Status Select -->
            <div class="status-section">
              <label class="status-label">Trạng thái:</label>
              <select v-model="selectedStatus" class="status-select" :class="statusClass">
                <option value="todo">Cần làm</option>
                <option value="progress">Đang làm</option>
                <option value="pending">Chờ duyệt</option>
                <option value="done">Hoàn thành</option>
              </select>
            </div>

            <!-- Description -->
            <div class="description-section">
              <h3 class="section-title">Mô tả</h3>
              <div class="description-box">
                <p class="description-text">
                  Công việc cộng tác viên bất động sản đòi hỏi ứng viên có kinh nghiệm tối thiểu 1 năm trong lĩnh vực bất động sản, am hiểu thị trường và có khả năng tư vấn khách hàng chuyên nghiệp.
                  <br><br>
                  <strong>Trách nhiệm chính:</strong>
                  <br>
                  - Tìm kiếm, tiếp cận và tư vấn khách hàng về các sản phẩm bất động sản
                  <br>
                  - Giới thiệu và quảng bá các dự án bất động sản mới
                  <br>
                  - Hỗ trợ khách hàng trong quá trình xem nhà, đàm phán và ký kết hợp đồng
                  <br>
                  - Duy trì mối quan hệ tốt với khách hàng hiện tại và tìm kiếm khách hàng tiềm năng
                  <br>
                  - Cập nhật thông tin thị trường bất động sản và các quy định pháp lý liên quan
                  <br><br>
                  <strong>Yêu cầu:</strong>
                  <br>
                  - Có kinh nghiệm ít nhất 1 năm trong lĩnh vực bất động sản
                  <br>
                  - Kỹ năng giao tiếp, đàm phán và thuyết phục tốt
                  <br>
                  - Có tinh thần trách nhiệm cao, chăm chỉ và nhiệt tình với công việc
                  <br>
                  - Có khả năng làm việc độc lập và theo nhóm
                  <br>
                  - Ưu tiên ứng viên có mối quan hệ rộng trong ngành bất động sản
                  <br><br>
                  <strong>Quyền lợi:</strong>
                  <br>
                  - Thu nhập hấp dẫn: Lương cứng + hoa hồng cao (lên đến 20-30% giá trị giao dịch)
                  <br>
                  - Được đào tạo chuyên sâu về sản phẩm và kỹ năng bán hàng
                  <br>
                  - Môi trường làm việc chuyên nghiệp, năng động
                  <br>
                  - Cơ hội thăng tiến và phát triển sự nghiệp rõ ràng
                  <br>
                  - Được hưởng đầy đủ các chế độ bảo hiểm theo quy định
                  <br>
                  - Có cơ hội tham gia các chuyến công tác, khảo sát thị trường
                </p>
              </div>
            </div>

            <!-- Attachments -->
            <div class="attachments-section">
              <h3 class="section-title">Tệp đính kèm</h3>
              <div class="attachments-grid">
                <div v-for="(file, index) in attachments" :key="index" class="attachment-item">
                  <div class="file-icon">
                    <i v-if="file.type === 'image'" class="fas fa-file-image"></i>
                    <i v-else-if="file.type === 'document'" class="fas fa-file-pdf"></i>
                    <i v-else class="fas fa-file"></i>
                  </div>
                  <span class="file-name">{{ file.name }}</span>
                </div>
              </div>
            </div>

            <!-- Discussion Component -->
            <DiscussionComponent
                :team="currentTeam"
                :messages="messages"
                :members="teamMembers"
                :current-user-id="currentUserId"
                :loading="loading"
                :sending="sending"
                :has-more="hasMoreMessages"
                @send="handleSendMessage"
                @recall="handleRecallMessage"
                @load-more="loadMoreMessages"
                @refresh="refreshMessages"
            />
          </div>
        </div>

        <!-- Right Column - 4/12 -->
        <div class="right-column">
          <!-- Details Card -->
          <div class="details-card">
            <h2 class="details-title">Chi tiết</h2>

            <!-- Creator Info -->
            <div class="info-section">
              <p class="info-label">Người tạo:</p>
              <div class="user-info">
                <img :src="creator.avatar" :alt="creator.name" class="avatar">
                <span class="user-name">{{ creator.name }}</span>
              </div>
            </div>

            <!-- Assignee Info -->
            <div class="info-section">
              <p class="info-label">Người thực hiện:</p>
              <div class="user-info">
                <img :src="assignee.avatar" :alt="assignee.name" class="avatar">
                <span class="user-name">{{ assignee.name }}</span>
              </div>
            </div>

            <!-- Dates -->
            <div class="info-section">
              <p class="info-text">Ngày bắt đầu dự kiến: {{ formatDate(plannedStartDate) }}</p>
              <p class="info-text">Hạn hoàn thành: {{ formatDate(dueDate) }}</p>
            </div>

            <!-- Divider -->
            <div class="divider"></div>

            <!-- Actual Dates & Progress -->
            <div class="info-section">
              <p class="info-text">Ngày bắt đầu thực tế: {{ formatDate(actualStartDate) }}</p>
              <div class="progress-section">
                <p class="progress-label">Tiến độ thực hiện: {{ progress }}%</p>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progress + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Card -->
          <div class="action-card">
            <h3 class="action-title">Xem thêm các công việc khác</h3>
            <router-link to="/collaborator-jobs" class="action-button">
              Ứng tuyển CTV
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DiscussionComponent from './DiscussionComponent.vue'

// Font family
const fontFamily = 'Ubuntu, sans-serif'

// Status
const selectedStatus = ref('todo')

const statusClass = computed(() => {
  return {
    'badge-todo': selectedStatus.value === 'todo',
    'badge-progress': selectedStatus.value === 'progress',
    'badge-pending': selectedStatus.value === 'pending',
    'badge-done': selectedStatus.value === 'done'
  }
})

// Attachments
const attachments = ref([
  { name: 'document.pdf', type: 'document' },
  { name: 'contract.docx', type: 'document' },
  { name: 'photo1.jpg', type: 'image' },
  { name: 'photo2.png', type: 'image' },
  { name: 'specs.pdf', type: 'document' }
])

// User data
const creator = ref({
  name: 'Nguyễn Văn A',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
})

const assignee = ref({
  name: 'Trần Thị B',
  avatar: 'https://images.unsplash.com/photo-1762793193663-cc343d78111c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
})

// Dates
const plannedStartDate = ref(new Date('2024-01-15'))
const dueDate = ref(new Date('2024-02-15'))
const actualStartDate = ref(new Date('2024-01-16'))

// Progress
const progress = ref(65)

// ========== DISCUSSION COMPONENT DATA ==========

// Current user
const currentUserId = ref(1)

// Team data
const currentTeam = ref({
  teamName: 'Nhóm Bất Động Sản',
  id: 1
})

// Team members
const teamMembers = ref([
  {
    id: 1,
    idE: 1,
    fullName: 'Nguyễn Văn A',
    name: 'Nguyễn Văn A',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    idE: 2,
    fullName: 'Trần Thị B',
    name: 'Trần Thị B',
    avatar: 'https://unsplash.com/photos/woman-in-a-suit-holding-an-umbrella-near-the-sea-7xIJ-HRelWc'
  },
  {
    id: 3,
    idE: 3,
    fullName: 'Lê Văn C',
    name: 'Lê Văn C',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 4,
    idE: 4,
    fullName: 'Phạm Thị D',
    name: 'Phạm Thị D',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 5,
    idE: 5,
    fullName: 'Hoàng Văn E',
    name: 'Hoàng Văn E',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  }
])

// Messages data
const messages = ref([
  {
    id: 1,
    authorId: 2,
    author: {
      id: 2,
      idE: 2,
      fullName: 'Trần Thị B',
      name: 'Trần Thị B',
      avatar: 'https://images.unsplash.com/photo-1762793193663-cc343d78111c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    content: 'Xin chào mọi người! Công việc bất động sản này có yêu cầu kinh nghiệm bao nhiêu năm?',
    createdAt: new Date('2024-01-10T09:30:00'),
    isRecalled: false,
    attachments: []
  },
  {
    id: 2,
    authorId: 1,
    author: {
      id: 1,
      idE: 1,
      fullName: 'Nguyễn Văn A',
      name: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Chào bạn! Yêu cầu tối thiểu 1 năm kinh nghiệm trong lĩnh vực bất động sản. Bạn có thể xem chi tiết tại: https://company.com/jobs',
    createdAt: new Date('2024-01-10T09:32:00'),
    isRecalled: false,
    attachments: []
  },
  {
    id: 3,
    authorId: 3,
    author: {
      id: 3,
      idE: 3,
      fullName: 'Lê Văn C',
      name: 'Lê Văn C',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Tôi có thể gửi CV qua email được không? @NguyenVanA',
    createdAt: new Date('2024-01-10T10:15:00'),
    isRecalled: false,
    attachments: []
  },
  {
    id: 4,
    authorId: 1,
    author: {
      id: 1,
      idE: 1,
      fullName: 'Nguyễn Văn A',
      name: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Được bạn nhé! Vui lòng gửi về email company@example.com. Đây là mẫu CV tham khảo.',
    createdAt: new Date('2024-01-10T10:20:00'),
    isRecalled: false,
    attachments: [
      {
        url: 'https://example.com/cv-template.docx',
        name: 'CV-template.docx',
        type: 'file'
      }
    ],
    replyTo: {
      id: 3,
      author: {
        fullName: 'Lê Văn C',
        name: 'Lê Văn C'
      },
      content: 'Tôi có thể gửi CV qua email được không? @NguyenVanA'
    }
  },
  {
    id: 5,
    authorId: 4,
    author: {
      id: 4,
      idE: 4,
      fullName: 'Phạm Thị D',
      name: 'Phạm Thị D',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Công việc này có được làm remote không? Và thời gian làm việc thế nào?',
    createdAt: new Date('2024-01-10T11:00:00'),
    isRecalled: false,
    attachments: []
  },
  {
    id: 6,
    authorId: 1,
    author: {
      id: 1,
      idE: 1,
      fullName: 'Nguyễn Văn A',
      name: 'Nguyễn Văn A',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    content: 'Có thể làm remote 3 ngày/tuần. Thời gian linh hoạt từ 8h-17h. Đây là hình ảnh văn phòng của chúng tôi:',
    createdAt: new Date('2024-01-10T11:05:00'),
    isRecalled: false,
    attachments: [
      {
        url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=500&h=300&fit=crop',
        name: 'office.jpg',
        type: 'image'
      }
    ]
  }
])

// Loading states
const loading = ref(false)
const sending = ref(false)
const hasMoreMessages = ref(true)

// ========== DISCUSSION COMPONENT METHODS ==========

const handleSendMessage = async (messageData) => {
  sending.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newMessage = {
      id: Date.now(),
      authorId: currentUserId.value,
      author: teamMembers.value.find(member => member.id === currentUserId.value),
      content: messageData.content,
      createdAt: new Date(),
      isRecalled: false,
      attachments: messageData.attachments.map(att => ({
        url: att.url,
        name: att.name,
        type: att.type
      })),
      replyTo: messageData.replyToId ? messages.value.find(msg => msg.id === messageData.replyToId) : null
    }

    messages.value.push(newMessage)

  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    sending.value = false
  }
}

const handleRecallMessage = async (message) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    const messageIndex = messages.value.findIndex(msg => msg.id === message.id)
    if (messageIndex !== -1) {
      messages.value[messageIndex].isRecalled = true
    }

  } catch (error) {
    console.error('Error recalling message:', error)
  }
}

const loadMoreMessages = async () => {
  if (loading.value) return

  loading.value = true
  try {
    // Simulate API call to load more messages
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Add older messages
    const olderMessages = [
      {
        id: -1,
        authorId: 5,
        author: {
          id: 5,
          idE: 5,
          fullName: 'Hoàng Văn E',
          name: 'Hoàng Văn E',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        },
        content: 'Chào mọi người, tôi mới tham gia nhóm. Rất vui được làm việc cùng mọi người!',
        createdAt: new Date('2024-01-09T08:00:00'),
        isRecalled: false,
        attachments: []
      }
    ]

    messages.value.unshift(...olderMessages)
    hasMoreMessages.value = false // No more messages to load

  } catch (error) {
    console.error('Error loading more messages:', error)
  } finally {
    loading.value = false
  }
}

const refreshMessages = async () => {
  loading.value = true
  try {
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Messages refreshed')
  } catch (error) {
    console.error('Error refreshing messages:', error)
  } finally {
    loading.value = false
  }
}

// Utility functions
const formatDate = (date) => {
  return date.toLocaleDateString('vi-VN')
}

onMounted(() => {
  console.log('Personal Task Management component mounted')
})
</script>

<style scoped>
.personal-task-management {
  font-family: 'Ubuntu', sans-serif;
  background-color: #f5f7fa;
  min-height: 100vh;
  padding: 20px 0;
  margin-top: 60px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 40px;
  color: #031358;
  font-weight: bold;
  margin: 0;
}

.main-content {
  max-width: 1400px;
  padding: 0 20px;
  margin: 0 auto;
}

/* Updated Container with proper 8/12 and 4/12 ratio */
.container {
  display: grid;
  grid-template-columns: 8fr 4fr; /* 8/12 and 4/12 ratio */
  gap: 30px;
  align-items: start;
}

/* Left Column - 8/12 width */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Right Column - 4/12 width */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-card,
.details-card,
.action-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.task-name {
  font-size: 33px;
  color: #000;
  font-weight: bold;
  text-align: left;
  margin: 0 0 20px 0;
}

.status-section {
  margin-bottom: 25px;
}

.status-label {
  font-size: 17px;
  color: #000;
  margin-right: 10px;
}

.status-select {
  padding: 8px 16px;
  border: 2px solid transparent;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Status Badge Classes */
.badge-todo {
  background: rgba(0, 48, 255, 0.1);
  color: #0030FF;
}

.badge-progress {
  background: rgba(255, 153, 0, 0.1);
  color: #FF9900;
}

.badge-pending {
  background: rgba(255, 102, 0, 0.1);
  color: #FF6600;
}

.badge-done {
  background: rgba(0, 200, 83, 0.1);
  color: #00C853;
}

.section-title {
  font-size: 24px;
  color: #000;
  margin: 0 0 15px 0;
  text-align: left;
}

.description-box {
  background: white;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;

  overflow-y: auto;
}

.description-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  margin: 0;
  text-align: left;
}

/* Updated Attachments Styles - Grid layout với 4 items mỗi hàng */
.attachments-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.attachment-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 15px 10px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 80px;
}

.attachment-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-icon {
  font-size: 24px;
  color: #031358;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
  word-break: break-word;
  line-height: 1.3;
}

/* Right Column Styles */
.details-title {
  font-size: 33px;
  color: #000;
  font-weight: bold;
  text-align: left;
  margin: 0 0 20px 0;
}

.info-section {
  margin-bottom: 20px;
}

.info-label {
  font-size: 17px;
  color: #000;
  text-align: left;
  margin: 0 0 10px 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 20px;
  color: #000;
  font-weight: bold;
}

.info-text {
  font-size: 16px;
  color: #333;
  text-align: left;
  margin: 5px 0;
}

.divider {
  height: 1px;
  background: #e0e0e0;
  margin: 20px 0;
}

.progress-section {
  margin-top: 15px;
}

.progress-label {
  font-size: 16px;
  color: #333;
  margin: 0 0 10px 0;
  text-align: left;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #031358, #0030FF);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Action Card */
.action-card {
  text-align: center;
}

.action-title {
  font-size: 25px;
  color: #031358;
  font-weight: bold;
  margin: 0 0 20px 0;
  text-align: left;
}

.action-button {
  display: block;
  width: 80%;
  padding: 10px;
  background: linear-gradient(90deg, #031358, #0030FF);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 17px;
  font-weight: bold;
  text-align: center;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.3);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Large devices (1200px and up) */
@media (min-width: 1200px) {
  .container {
    grid-template-columns: 8fr 4fr; /* 8/12 and 4/12 */
  }
}

/* Medium devices (992px - 1199px) */
@media (max-width: 1199px) and (min-width: 992px) {
  .container {
    grid-template-columns: 7fr 5fr; /* Slightly adjust ratio for medium screens */
    gap: 25px;
  }

  .attachments-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Small devices (768px - 991px) */
@media (max-width: 991px) and (min-width: 768px) {
  .container {
    grid-template-columns: 1fr; /* Stack columns on tablet */
    gap: 20px;
  }

  .left-column,
  .right-column {
    width: 100%;
  }

  .attachments-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .task-card,
  .details-card,
  .action-card {
    padding: 25px;
  }
}

/* Extra small devices (767px and below) */
@media (max-width: 767px) {
  .container {
    grid-template-columns: 1fr; /* Single column on mobile */
    gap: 15px;
  }

  .left-column,
  .right-column {
    width: 100%;
  }

  .attachments-grid {
    grid-template-columns: 1fr;
  }

  .task-card,
  .details-card,
  .action-card {
    padding: 20px;
  }

  .title {
    font-size: 32px;
  }

  .task-name,
  .details-title,
  .action-title {
    font-size: 28px;
  }

  .section-title {
    font-size: 20px;
  }
}

/* Very small devices (480px and below) */
@media (max-width: 480px) {
  .main-content {
    padding: 0 15px;
  }

  .task-card,
  .details-card,
  .action-card {
    padding: 15px;
  }

  .title {
    font-size: 28px;
  }

  .task-name,
  .details-title,
  .action-title {
    font-size: 24px;
  }

  .status-select {
    width: 100%;
    margin-top: 5px;
  }
}
</style>