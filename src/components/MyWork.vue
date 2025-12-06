<template>
  <div class="job-management-app">
    <!-- Header -->
    <header class="app-header">
      <h1>Công Việc Của Tôi</h1>
      <div class="user-info">
        <span class="user-name">Nguyễn Văn A</span>
        <div class="avatar">A</div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Top Jobs Tab -->
        <div v-if="activeTab === 'top-jobs'" class="tab-panel">
          <div class="search-filter-section">
            <div class="search-box">
              <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Tìm kiếm công việc, vị trí, công ty..."
                  class="search-input"
              >
              <button class="search-button">
                <i class="search-icon">🔍</i>
              </button>
            </div>
            <div class="filter-options">
              <select v-model="selectedLocation" class="filter-select">
                <option value="">Tất cả địa điểm</option>
                <option v-for="location in locations" :key="location" :value="location">
                  {{ location }}
                </option>
              </select>
              <select v-model="selectedIndustry" class="filter-select">
                <option value="">Tất cả ngành nghề</option>
                <option v-for="industry in industries" :key="industry" :value="industry">
                  {{ industry }}
                </option>
              </select>
              <select v-model="selectedSalary" class="filter-select">
                <option value="">Mức lương</option>
                <option value="0-10">Dưới 10 triệu</option>
                <option value="10-15">10 - 15 triệu</option>
                <option value="15-20">15 - 20 triệu</option>
                <option value="20+">Trên 20 triệu</option>
              </select>
            </div>
          </div>

          <div class="jobs-grid">
            <div
                v-for="job in filteredTopJobs"
                :key="job.id"
                class="job-card"
            >
              <div class="job-header">
                <div class="company-logo">
                  <img :src="job.company.logo" :alt="job.company.name" v-if="job.company.logo">
                  <div class="logo-placeholder" v-else>{{ job.company.name.charAt(0) }}</div>
                </div>
                <div class="job-title-section">
                  <h3 class="job-title">{{ job.title }}</h3>
                  <p class="company-name">{{ job.company.name }}</p>
                </div>
                <button
                    class="save-job-btn"
                    :class="{ saved: job.isSaved }"
                    @click="toggleSaveJob(job)"
                >
                  <i>{{ job.isSaved ? '★' : '☆' }}</i>
                </button>
              </div>

              <div class="job-details">
                <div class="job-meta">
                  <span class="salary">{{ job.salary }}</span>
                  <span class="location">📍 {{ job.location }}</span>
                  <span class="type">{{ job.type }}</span>
                </div>
                <div class="job-description">
                  {{ job.description }}
                </div>
                <div class="job-tags">
                  <span v-for="tag in job.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>

              <div class="job-footer">
                <span class="posted-time">Đăng {{ job.postedTime }}</span>
                <button class="apply-btn" @click="applyForJob(job)">
                  Ứng tuyển ngay
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredTopJobs.length === 0" class="no-results">
            <p>Không tìm thấy công việc phù hợp với bộ lọc của bạn.</p>
          </div>
        </div>

        <!-- Applied Jobs Tab -->
        <div v-if="activeTab === 'applied-jobs'" class="tab-panel">
          <div class="applied-jobs-list">
            <div
                v-for="application in appliedJobs"
                :key="application.id"
                class="application-card"
            >
              <div class="application-header">
                <div class="company-logo">
                  <img :src="application.job.company.logo" :alt="application.job.company.name" v-if="application.job.company.logo">
                  <div class="logo-placeholder" v-else>{{ application.job.company.name.charAt(0) }}</div>
                </div>
                <div class="application-info">
                  <h3 class="job-title">{{ application.job.title }}</h3>
                  <p class="company-name">{{ application.job.company.name }}</p>
                  <div class="application-meta">
                    <span class="applied-date">Đã ứng tuyển: {{ application.appliedDate }}</span>
                    <span class="application-status" :class="application.status">
                      {{ getStatusText(application.status) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="application-actions">
                <button class="view-job-btn" @click="viewJobDetails(application.job)">
                  Xem chi tiết
                </button>
                <button class="withdraw-btn" @click="withdrawApplication(application.id)"
                        v-if="application.status === 'pending'">
                  Rút đơn
                </button>
              </div>
            </div>
          </div>

          <div v-if="appliedJobs.length === 0" class="no-applications">
            <p>Bạn chưa ứng tuyển công việc nào.</p>
            <button class="browse-jobs-btn" @click="activeTab = 'top-jobs'">
              Khám phá công việc
            </button>
          </div>
        </div>

        <!-- Feedback Tab -->
        <div v-if="activeTab === 'feedback'" class="tab-panel">
          <div class="feedback-list">
            <div
                v-for="feedback in feedbackList"
                :key="feedback.id"
                class="feedback-card"
            >
              <div class="feedback-header">
                <div class="company-logo">
                  <img :src="feedback.job.company.logo" :alt="feedback.job.company.name" v-if="feedback.job.company.logo">
                  <div class="logo-placeholder" v-else>{{ feedback.job.company.name.charAt(0) }}</div>
                </div>
                <div class="feedback-info">
                  <h3 class="job-title">{{ feedback.job.title }}</h3>
                  <p class="company-name">{{ feedback.job.company.name }}</p>
                </div>
                <div class="feedback-result" :class="feedback.result">
                  {{ getResultText(feedback.result) }}
                </div>
              </div>

              <div class="feedback-content">
                <p class="feedback-message" v-if="feedback.message">
                  {{ feedback.message }}
                </p>
                <div class="feedback-meta">
                  <span class="feedback-date">Phản hồi: {{ feedback.date }}</span>
                  <span class="interview-date" v-if="feedback.interviewDate">
                    Lịch phỏng vấn: {{ feedback.interviewDate }}
                  </span>
                </div>
              </div>

              <div class="feedback-actions">
                <button class="view-details-btn" @click="viewFeedbackDetails(feedback)">
                  Xem chi tiết
                </button>
                <button class="save-feedback-btn" @click="saveFeedback(feedback)">
                  Lưu phản hồi
                </button>
              </div>
            </div>
          </div>

          <div v-if="feedbackList.length === 0" class="no-feedback">
            <p>Chưa có phản hồi nào từ nhà tuyển dụng.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Job Detail Modal -->
    <div v-if="selectedJob" class="modal-overlay" @click="selectedJob = null">
      <div class="modal-content" @click.stop>
        <button class="close-modal" @click="selectedJob = null">×</button>
        <JobDetail :job="selectedJob" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JobManagementApp',
  data() {
    return {
      activeTab: 'top-jobs',
      searchQuery: '',
      selectedLocation: '',
      selectedIndustry: '',
      selectedSalary: '',
      selectedJob: null,
      tabs: [
        { id: 'top-jobs', label: 'Top Công Việc', count: 12 },
        { id: 'applied-jobs', label: 'Đã Tham Gia', count: 5 },
        { id: 'feedback', label: 'Phản Hồi', count: 3 }
      ],
      locations: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'],
      industries: ['Công nghệ thông tin', 'Kinh doanh', 'Marketing', 'Kế toán', 'Nhân sự'],
      topJobs: [
        {
          id: 1,
          title: 'Frontend Developer (Vue.js)',
          company: {
            name: 'TechCorp Vietnam',
            logo: ''
          },
          salary: '15-20 triệu',
          location: 'Hà Nội',
          type: 'Toàn thời gian',
          description: 'Chúng tôi đang tìm kiếm một Frontend Developer có kinh nghiệm với Vue.js để tham gia vào đội ngũ phát triển sản phẩm.',
          tags: ['Vue.js', 'JavaScript', 'HTML/CSS'],
          postedTime: '2 ngày trước',
          isSaved: false
        },
        {
          id: 2,
          title: 'Backend Developer (Node.js)',
          company: {
            name: 'StartUp Innovation',
            logo: ''
          },
          salary: '18-25 triệu',
          location: 'Hồ Chí Minh',
          type: 'Toàn thời gian',
          description: 'Tuyển dụng Backend Developer có kinh nghiệm với Node.js và MongoDB để phát triển hệ thống backend.',
          tags: ['Node.js', 'MongoDB', 'API'],
          postedTime: '1 ngày trước',
          isSaved: true
        },
        {
          id: 3,
          title: 'UI/UX Designer',
          company: {
            name: 'Creative Agency',
            logo: ''
          },
          salary: '12-18 triệu',
          location: 'Đà Nẵng',
          type: 'Bán thời gian',
          description: 'Cần tuyển UI/UX Designer có kinh nghiệm thiết kế giao diện người dùng cho ứng dụng web và mobile.',
          tags: ['Figma', 'UI/UX', 'Wireframe'],
          postedTime: '3 ngày trước',
          isSaved: false
        },
        // Thêm nhiều công việc khác...
      ],
      appliedJobs: [
        {
          id: 101,
          job: {
            id: 1,
            title: 'Frontend Developer (Vue.js)',
            company: {
              name: 'TechCorp Vietnam',
              logo: ''
            }
          },
          appliedDate: '15/10/2023',
          status: 'pending' // pending, reviewing, accepted, rejected
        },
        {
          id: 102,
          job: {
            id: 2,
            title: 'Backend Developer (Node.js)',
            company: {
              name: 'StartUp Innovation',
              logo: ''
            }
          },
          appliedDate: '10/10/2023',
          status: 'reviewing'
        },
        // Thêm các ứng tuyển khác...
      ],
      feedbackList: [
        {
          id: 201,
          job: {
            id: 3,
            title: 'UI/UX Designer',
            company: {
              name: 'Creative Agency',
              logo: ''
            }
          },
          result: 'accepted', // accepted, rejected, interview
          message: 'Chúc mừng! Bạn đã được mời tham gia vòng phỏng vấn trực tiếp.',
          date: '18/10/2023',
          interviewDate: '25/10/2023 14:00'
        },
        {
          id: 202,
          job: {
            id: 4,
            title: 'Product Manager',
            company: {
              name: 'ProductTech',
              logo: ''
            }
          },
          result: 'rejected',
          message: 'Cảm ơn bạn đã quan tâm. Hiện tại hồ sơ của bạn chưa phù hợp với yêu cầu công việc.',
          date: '12/10/2023'
        },
        // Thêm phản hồi khác...
      ]
    }
  },
  computed: {
    filteredTopJobs() {
      let filtered = this.topJobs;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(job =>
            job.title.toLowerCase().includes(query) ||
            job.company.name.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query)
        );
      }

      if (this.selectedLocation) {
        filtered = filtered.filter(job => job.location === this.selectedLocation);
      }

      if (this.selectedIndustry) {
        filtered = filtered.filter(job => job.tags.includes(this.selectedIndustry));
      }

      return filtered;
    }
  },
  methods: {
    toggleSaveJob(job) {
      job.isSaved = !job.isSaved;
      // Gọi API để lưu/cập nhật trạng thái
    },

    applyForJob(job) {
      // Logic ứng tuyển công việc
      const application = {
        id: Date.now(),
        job: job,
        appliedDate: new Date().toLocaleDateString('vi-VN'),
        status: 'pending'
      };

      this.appliedJobs.unshift(application);

      // Cập nhật số lượng tab
      this.tabs.find(tab => tab.id === 'applied-jobs').count = this.appliedJobs.length;

      // Hiển thị thông báo thành công
      alert(`Đã ứng tuyển thành công vào vị trí ${job.title} tại ${job.company.name}`);
    },

    withdrawApplication(applicationId) {
      if (confirm('Bạn có chắc chắn muốn rút đơn ứng tuyển này?')) {
        const index = this.appliedJobs.findIndex(app => app.id === applicationId);
        if (index !== -1) {
          this.appliedJobs.splice(index, 1);
          this.tabs.find(tab => tab.id === 'applied-jobs').count = this.appliedJobs.length;
        }
      }
    },

    viewJobDetails(job) {
      this.selectedJob = job;
    },

    getStatusText(status) {
      const statusMap = {
        'pending': 'Đang chờ xét duyệt',
        'reviewing': 'Đang xem xét',
        'accepted': 'Được chấp nhận',
        'rejected': 'Đã từ chối'
      };
      return statusMap[status] || 'Không xác định';
    },

    getResultText(result) {
      const resultMap = {
        'accepted': 'Được nhận',
        'rejected': 'Không được nhận',
        'interview': 'Mời phỏng vấn'
      };
      return resultMap[result] || 'Không xác định';
    },

    viewFeedbackDetails(feedback) {
      // Logic xem chi tiết phản hồi
      console.log('Xem chi tiết phản hồi:', feedback);
    },

    saveFeedback(feedback) {
      // Logic lưu phản hồi
      console.log('Lưu phản hồi:', feedback);
    }
  }
}
</script>

<style scoped>
.job-management-app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.app-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-weight: 500;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.main-content {
  padding: 20px;
}

.tab-navigation {
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  overflow: hidden;
}

.tab-button {
  flex: 1;
  padding: 15px 20px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button.active {
  background-color: #3498db;
  color: white;
}

.tab-button:not(.active):hover {
  background-color: #f1f8ff;
}

.tab-count {
  background-color: #e74c3c;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
}

.tab-button.active .tab-count {
  background-color: white;
  color: #3498db;
}

.tab-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.tab-panel {
  padding: 20px;
}

/* Search & Filter Styles */
.search-filter-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  max-width: 600px;
}

.search-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.search-button {
  padding: 12px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.filter-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  min-width: 150px;
}

/* Job Cards Styles */
.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.job-card {
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  background-color: white;
}

.job-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.job-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.company-logo {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-weight: bold;
  color: #7f8c8d;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  border-radius: 8px;
}

.job-title-section {
  flex: 1;
}

.job-title {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #2c3e50;
}

.company-name {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.save-job-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #bdc3c7;
}

.save-job-btn.saved {
  color: #f1c40f;
}

.job-details {
  margin-bottom: 15px;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.salary {
  color: #e74c3c;
  font-weight: bold;
}

.location, .type {
  color: #7f8c8d;
  font-size: 14px;
}

.job-description {
  color: #5a6c7d;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background-color: #e1f5fe;
  color: #0288d1;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.posted-time {
  color: #95a5a6;
  font-size: 12px;
}

.apply-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.apply-btn:hover {
  background-color: #27ae60;
}

/* Applied Jobs Styles */
.application-card {
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.application-header {
  display: flex;
  align-items: center;
  flex: 1;
}

.application-info {
  margin-left: 15px;
}

.application-meta {
  display: flex;
  gap: 15px;
  margin-top: 5px;
}

.applied-date {
  color: #7f8c8d;
  font-size: 14px;
}

.application-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.application-status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.application-status.reviewing {
  background-color: #cce7ff;
  color: #004085;
}

.application-status.accepted {
  background-color: #d4edda;
  color: #155724;
}

.application-status.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.application-actions {
  display: flex;
  gap: 10px;
}

.view-job-btn, .withdraw-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.view-job-btn {
  background-color: #3498db;
  color: white;
  border: none;
}

.withdraw-btn {
  background-color: white;
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

/* Feedback Styles */
.feedback-card {
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
}

.feedback-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.feedback-info {
  flex: 1;
  margin-left: 15px;
}

.feedback-result {
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 500;
}

.feedback-result.accepted {
  background-color: #d4edda;
  color: #155724;
}

.feedback-result.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.feedback-result.interview {
  background-color: #cce7ff;
  color: #004085;
}

.feedback-content {
  margin-bottom: 15px;
}

.feedback-message {
  margin: 0 0 10px 0;
  color: #5a6c7d;
}

.feedback-meta {
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #7f8c8d;
}

.feedback-actions {
  display: flex;
  gap: 10px;
}

.view-details-btn, .save-feedback-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.view-details-btn {
  background-color: #3498db;
  color: white;
  border: none;
}

.save-feedback-btn {
  background-color: white;
  color: #3498db;
  border: 1px solid #3498db;
}

/* Empty States */
.no-results, .no-applications, .no-feedback {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.browse-jobs-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 20px;
}

.close-modal {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .jobs-grid {
    grid-template-columns: 1fr;
  }

  .application-card, .feedback-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .application-actions, .feedback-actions {
    margin-top: 15px;
    width: 100%;
    justify-content: space-between;
  }

  .filter-options {
    flex-direction: column;
  }

  .filter-select {
    min-width: 100%;
  }

  .app-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>