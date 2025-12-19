<template>

  <div class="broker-success-page">
    <!-- Header section -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Đối Tác Môi Giới Thành Công</h1>
        <p class="page-subtitle">
          Khám phá câu chuyện thành công từ mạng lưới đối tác môi giới và các bất động sản đã bán thành công cùng chúng tôi
        </p>
        <div class="stats-overview">
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(totalBrokers) }}+</div>
            <div class="stat-label">Môi giới đã hợp tác</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(totalProperties) }}+</div>
            <div class="stat-label">BĐS đã bán</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(totalSales) }} tỷ</div>
            <div class="stat-label">Tổng giá trị giao dịch</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ successRate }}%</div>
            <div class="stat-label">Tỉ lệ thành công</div>
          </div>
        </div>
      </div>
    </header>

    <main class="page-content">
      <!-- Filter section -->
      <div class="filter-section">
        <div class="filter-controls">
          <div class="search-box">
            <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm môi giới, dự án..."
                class="search-input"
            />
            <span class="search-icon">
              <i class="fas fa-search"></i>
            </span>
          </div>

          <div class="filter-options">
            <select v-model="selectedCity" class="filter-select">
              <option value="">Tất cả tỉnh/thành</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>

            <select v-model="selectedPropertyType" class="filter-select">
              <option value="">Tất cả loại BĐS</option>
              <option v-for="type in propertyTypes" :key="type" :value="type">{{ type }}</option>
            </select>

            <button class="btn-reset" @click="resetFilters">Đặt lại</button>
          </div>
        </div>

        <!-- View Toggle for Brokers -->
        <div class="view-toggle-section">
          <h3 class="view-toggle-title">Chế độ xem môi giới:</h3>
          <div class="view-toggle">
            <button
                :class="['view-toggle-btn', { active: brokerViewMode === 'grid' }]"
                @click="brokerViewMode = 'grid'"
            >
              <i class="fas fa-th-large"></i> Lưới
            </button>
            <button
                :class="['view-toggle-btn', { active: brokerViewMode === 'list' }]"
                @click="brokerViewMode = 'list'"
            >
              <i class="fas fa-list"></i> Danh sách
            </button>
          </div>
        </div>
      </div>

      <!-- Brokers section -->
      <section class="brokers-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Môi Giới Đã Hợp Tác Thành Công</h2>
            <p class="section-subtitle">
              Những môi giới đã đồng hành cùng chúng tôi và đạt được thành tích ấn tượng
            </p>
          </div>
          <div class="section-stats">
            <span class="section-stat">Hiển thị {{ currentBrokers.length }} / {{ filteredBrokers.length }} môi giới</span>
          </div>
        </div>

        <!-- Grid View for Brokers -->
        <div v-if="brokerViewMode === 'grid'" class="brokers-grid">
          <div
              v-for="broker in currentBrokers"
              :key="broker.id"
              class="broker-card"
              @click="showBrokerDetail(broker)"
          >
            <div class="broker-header">
              <div class="broker-avatar">
                <img :src="broker.avatar" :alt="broker.name" />
                <div class="verification-badge" v-if="broker.verified">
                  <i class="fas fa-check-circle"></i>
                </div>
              </div>
              <div class="broker-info">
                <h3 class="broker-name">{{ broker.name }}</h3>
                <div class="broker-title">{{ broker.title }}</div>
                <div class="broker-location">
                  <i class="fas fa-map-marker-alt"></i> {{ broker.location }}
                </div>
              </div>
            </div>

            <div class="broker-stats">
              <div class="broker-stat">
                <div class="stat-number">{{ broker.propertiesSold }}</div>
                <div class="stat-label">BĐS đã bán</div>
              </div>
              <div class="broker-stat">
                <div class="stat-number">{{ broker.successRate }}%</div>
                <div class="stat-label">Tỉ lệ thành công</div>
              </div>
              <div class="broker-stat">
                <div class="stat-number">{{ broker.totalSales }} tỷ</div>
                <div class="stat-label">Tổng giá trị</div>
              </div>
            </div>

            <div class="broker-testimonial">
              <p class="testimonial-text">"{{ broker.testimonial }}"</p>
            </div>

            <div class="broker-tags">
              <span class="broker-tag" v-for="tag in broker.tags" :key="tag">{{ tag }}</span>
            </div>

            <div class="broker-actions">
              <button class="btn-view-profile" @click.stop="showBrokerDetail(broker)">
                Xem hồ sơ
              </button>
              <button class="btn-collaborate" @click.stop="showCollaborationForm(broker)">
                Hợp tác ngay
              </button>
            </div>
          </div>
        </div>

        <!-- List View for Brokers -->
        <div v-if="brokerViewMode === 'list'" class="brokers-list">
          <div class="brokers-table">
            <div class="table-header">
              <div class="table-cell" style="width: 50px">#</div>
              <div class="table-cell" style="width: 80px">Ảnh</div>
              <div class="table-cell" style="flex: 2">Thông tin</div>
              <div class="table-cell" style="flex: 1.5">Chuyên môn</div>
              <div class="table-cell" style="flex: 1">Số BĐS đã bán</div>
              <div class="table-cell" style="flex: 1">Tỉ lệ thành công</div>
              <div class="table-cell" style="flex: 1">Tổng giá trị</div>
              <div class="table-cell" style="width: 150px">Hành động</div>
            </div>

            <div
                v-for="(broker, index) in currentBrokers"
                :key="broker.id"
                class="table-row"
                @click="showBrokerDetail(broker)"
            >
              <div class="table-cell" style="width: 50px">{{ (brokersPage - 1) * brokersPerPage + index + 1 }}</div>
              <div class="table-cell" style="width: 80px">
                <div class="broker-avatar-small">
                  <img :src="broker.avatar" :alt="broker.name" />
                </div>
              </div>
              <div class="table-cell" style="flex: 2">
                <div class="broker-info-list">
                  <h4 class="broker-name-list">{{ broker.name }}</h4>
                  <div class="broker-title-list">{{ broker.title }}</div>
                  <div class="broker-location-list">
                    <i class="fas fa-map-marker-alt"></i> {{ broker.location }}
                  </div>
                  <div class="broker-experience-list">
                    <i class="fas fa-briefcase"></i> {{ broker.experience }} năm kinh nghiệm
                  </div>
                </div>
              </div>
              <div class="table-cell" style="flex: 1.5">
                <div class="broker-tags-list">
                  <span class="broker-tag-list" v-for="tag in broker.tags" :key="tag">{{ tag }}</span>
                </div>
              </div>
              <div class="table-cell" style="flex: 1">{{ broker.propertiesSold }}</div>
              <div class="table-cell" style="flex: 1">{{ broker.successRate }}%</div>
              <div class="table-cell" style="flex: 1">{{ broker.totalSales }} tỷ</div>
              <div class="table-cell" style="width: 150px">
                <div class="broker-actions-list">
                  <button class="btn-view-profile-list" @click.stop="showBrokerDetail(broker)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn-collaborate-list" @click.stop="showCollaborationForm(broker)">
                    <i class="fas fa-handshake"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredBrokers.length === 0" class="no-results">
          <i class="fas fa-user-slash"></i>
          <p>Không tìm thấy môi giới phù hợp với tiêu chí tìm kiếm</p>
        </div>

        <!-- Pagination for Brokers -->
        <div v-if="filteredBrokers.length > 0" class="pagination">
          <button
              class="pagination-btn"
              :disabled="brokersPage === 1"
              @click="brokersPage--"
          >
            <i class="fas fa-chevron-left"></i> Trước
          </button>

          <div class="pagination-pages">
            <span v-for="page in brokerPages" :key="page">
              <button
                  v-if="page === '...'"
                  class="pagination-dots"
                  disabled
              >...</button>
              <button
                  v-else
                  :class="['pagination-page', { active: page === brokersPage }]"
                  @click="brokersPage = page"
              >
                {{ page }}
              </button>
            </span>
          </div>

          <button
              class="pagination-btn"
              :disabled="brokersPage === totalBrokerPages"
              @click="brokersPage++"
          >
            Sau <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      <!-- Properties section -->
      <section class="properties-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">Bất Động Sản Đã Bán Thành Công</h2>
            <p class="section-subtitle">
              Các bất động sản đã được bán thành công với sự hợp tác của đội ngũ môi giới
            </p>
          </div>
          <div class="section-stats">
            <span class="section-stat">Hiển thị {{ currentProperties.length }} / {{ filteredProperties.length }} BĐS</span>
          </div>
        </div>

        <!-- Properties Table -->
        <div class="properties-table">
          <div class="table-header">
            <div class="table-cell" style="width: 60px">#</div>
            <div class="table-cell" style="width: 100px">Ảnh</div>
            <div class="table-cell" style="flex: 2">Thông tin BĐS</div>
            <div class="table-cell" style="flex: 1">Loại BĐS</div>
            <div class="table-cell" style="flex: 1">Địa điểm</div>
            <div class="table-cell" style="flex: 1">Giá bán</div>
            <div class="table-cell" style="flex: 1">Ngày bán</div>
            <div class="table-cell" style="width: 120px">Môi giới</div>
            <div class="table-cell" style="width: 100px">Trạng thái</div>
          </div>

          <div
              v-for="(property, index) in currentProperties"
              :key="property.id"
              class="table-row"
              @click="showPropertyDetail(property)"
          >
            <div class="table-cell" style="width: 60px">{{ (propertiesPage - 1) * propertiesPerPage + index + 1 }}</div>
            <div class="table-cell" style="width: 100px">
              <div class="property-image-small">
                <img :src="property.image" :alt="property.name" />
              </div>
            </div>
            <div class="table-cell" style="flex: 2">
              <div class="property-info-list">
                <h4 class="property-name-list">{{ property.name }}</h4>
                <div class="property-description">{{ property.description }}</div>
              </div>
            </div>
            <div class="table-cell" style="flex: 1">{{ property.type }}</div>
            <div class="table-cell" style="flex: 1">{{ property.location }}</div>
            <div class="table-cell" style="flex: 1">{{ property.price }} tỷ</div>
            <div class="table-cell" style="flex: 1">{{ formatDate(property.soldDate) }}</div>
            <div class="table-cell" style="width: 120px">
              <div class="property-broker">
                <div class="broker-avatar-tiny">
                  <img :src="property.broker.avatar" :alt="property.broker.name" />
                </div>
                <span class="broker-name-tiny">{{ property.broker.name }}</span>
              </div>
            </div>
            <div class="table-cell" style="width: 100px">
              <span class="property-status sold">ĐÃ BÁN</span>
            </div>
          </div>
        </div>

        <div v-if="filteredProperties.length === 0" class="no-results">
          <i class="fas fa-building"></i>
          <p>Không tìm thấy BĐS phù hợp với tiêu chí tìm kiếm</p>
        </div>

        <!-- Pagination for Properties -->
        <div v-if="filteredProperties.length > 0" class="pagination">
          <button
              class="pagination-btn"
              :disabled="propertiesPage === 1"
              @click="propertiesPage--"
          >
            <i class="fas fa-chevron-left"></i> Trước
          </button>

          <div class="pagination-pages">
            <span v-for="page in propertyPages" :key="page">
              <button
                  v-if="page === '...'"
                  class="pagination-dots"
                  disabled
              >...</button>
              <button
                  v-else
                  :class="['pagination-page', { active: page === propertiesPage }]"
                  @click="propertiesPage = page"
              >
                {{ page }}
              </button>
            </span>
          </div>

          <button
              class="pagination-btn"
              :disabled="propertiesPage === totalPropertyPages"
              @click="propertiesPage++"
          >
            Sau <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Sẵn sàng hợp tác và thành công cùng chúng tôi?</h2>
          <p class="cta-description">
            Tham gia mạng lưới đối tác môi giới hàng đầu, tiếp cận nguồn hàng chất lượng
            và nhận hỗ trợ tối đa để gia tăng doanh thu.
          </p>
          <div class="cta-buttons">
            <button class="btn-cta-primary" @click="showCollaborationForm()">
              <i class="fas fa-handshake"></i> Đăng ký hợp tác ngay
            </button>
            <button class="btn-cta-secondary" @click="scrollToBrokers">
              <i class="fas fa-user-tie"></i> Xem môi giới thành công
            </button>
          </div>
          <div class="cta-benefits">
            <div class="benefit">
              <i class="fas fa-percentage"></i>
              <span>Hoa hồng hấp dẫn lên đến 3.5%</span>
            </div>
            <div class="benefit">
              <i class="fas fa-chart-line"></i>
              <span>Đào tạo & hỗ trợ chuyên môn liên tục</span>
            </div>
            <div class="benefit">
              <i class="fas fa-medal"></i>
              <span>Cơ hội nhận thưởng và giải thưởng giá trị</span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Broker Detail Modal -->
    <div v-if="selectedBroker" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>

        <div class="modal-body">
          <div class="broker-detail">
            <div class="broker-detail-header">
              <div class="broker-detail-avatar">
                <img :src="selectedBroker.avatar" :alt="selectedBroker.name" />
              </div>
              <div class="broker-detail-info">
                <h3 class="broker-detail-name">{{ selectedBroker.name }}</h3>
                <div class="broker-detail-title">{{ selectedBroker.title }}</div>
                <div class="broker-detail-location">
                  <i class="fas fa-map-marker-alt"></i> {{ selectedBroker.location }}
                </div>
                <div class="broker-detail-experience">
                  <i class="fas fa-briefcase"></i> {{ selectedBroker.experience }} năm kinh nghiệm
                </div>
              </div>
            </div>

            <div class="broker-detail-stats">
              <div class="broker-detail-stat">
                <div class="stat-value">{{ selectedBroker.propertiesSold }}</div>
                <div class="stat-label">BĐS đã bán</div>
              </div>
              <div class="broker-detail-stat">
                <div class="stat-value">{{ selectedBroker.successRate }}%</div>
                <div class="stat-label">Tỉ lệ thành công</div>
              </div>
              <div class="broker-detail-stat">
                <div class="stat-value">{{ selectedBroker.totalSales }} tỷ</div>
                <div class="stat-label">Tổng giá trị giao dịch</div>
              </div>
              <div class="broker-detail-stat">
                <div class="stat-value">{{ selectedBroker.averageTime }} ngày</div>
                <div class="stat-label">Thời gian bán trung bình</div>
              </div>
            </div>

            <div class="broker-detail-bio">
              <h4>Giới thiệu</h4>
              <p>{{ selectedBroker.bio }}</p>
            </div>

            <div class="broker-detail-testimonial">
              <h4>Câu chuyện thành công</h4>
              <blockquote>"{{ selectedBroker.testimonial }}"</blockquote>
            </div>

            <div class="broker-detail-properties">
              <h4>BĐS đã bán thành công (5 gần nhất)</h4>
              <div class="properties-list">
                <div
                    v-for="property in selectedBroker.recentProperties"
                    :key="property.id"
                    class="property-item"
                >
                  <div class="property-item-name">{{ property.name }}</div>
                  <div class="property-item-details">
                    <span class="property-item-location">{{ property.location }}</span>
                    <span class="property-item-value">{{ property.price }} tỷ</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="broker-detail-actions">
              <button class="btn-contact" @click="contactBroker(selectedBroker)">
                <i class="fas fa-phone-alt"></i> Liên hệ môi giới
              </button>
              <button class="btn-collaborate" @click="showCollaborationForm(selectedBroker)">
                <i class="fas fa-handshake"></i> Hợp tác với môi giới này
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Collaboration Form Modal -->
    <div v-if="showCollaborationModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content collaboration-form" @click.stop>
        <button class="modal-close" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>

        <div class="modal-body">
          <h2 class="form-title">Đăng Ký Hợp Tác Môi Giới</h2>
          <p class="form-subtitle">
            Điền thông tin để trở thành đối tác môi giới và nhận nhiều ưu đãi hấp dẫn
          </p>

          <form @submit.prevent="submitCollaborationForm" class="collaboration-form-content">
            <div class="form-row">
              <div class="form-group">
                <label for="fullName">Họ và tên *</label>
                <input
                    type="text"
                    id="fullName"
                    v-model="collaborationForm.fullName"
                    placeholder="Nhập họ và tên của bạn"
                    required
                />
              </div>
              <div class="form-group">
                <label for="phone">Số điện thoại *</label>
                <input
                    type="tel"
                    id="phone"
                    v-model="collaborationForm.phone"
                    placeholder="Nhập số điện thoại"
                    required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email *</label>
                <input
                    type="email"
                    id="email"
                    v-model="collaborationForm.email"
                    placeholder="Nhập email của bạn"
                    required
                />
              </div>
              <div class="form-group">
                <label for="city">Tỉnh/Thành phố *</label>
                <select id="city" v-model="collaborationForm.city" required>
                  <option value="">Chọn tỉnh/thành phố</option>
                  <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="experience">Kinh nghiệm môi giới *</label>
                <select id="experience" v-model="collaborationForm.experience" required>
                  <option value="">Chọn mức kinh nghiệm</option>
                  <option value="under1">Dưới 1 năm</option>
                  <option value="1-3">1 - 3 năm</option>
                  <option value="3-5">3 - 5 năm</option>
                  <option value="over5">Trên 5 năm</option>
                </select>
              </div>
              <div class="form-group">
                <label for="specialization">Chuyên môn *</label>
                <select id="specialization" v-model="collaborationForm.specialization" required>
                  <option value="">Chọn lĩnh vực chuyên môn</option>
                  <option value="apartment">Căn hộ chung cư</option>
                  <option value="house">Nhà phố, biệt thự</option>
                  <option value="land">Đất nền</option>
                  <option value="commercial">Bất động sản thương mại</option>
                  <option value="all">Đa dạng các loại hình</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="message">Lý do muốn hợp tác</label>
              <textarea
                  id="message"
                  v-model="collaborationForm.message"
                  placeholder="Chia sẻ lý do bạn muốn hợp tác với chúng tôi và mong muốn của bạn..."
                  rows="4"
              ></textarea>
            </div>

            <div class="form-group checkbox-group">
              <input
                  type="checkbox"
                  id="agreeTerms"
                  v-model="collaborationForm.agreeTerms"
                  required
              />
              <label for="agreeTerms">
                Tôi đồng ý với các điều khoản hợp tác và chính sách bảo mật
              </label>
            </div>

            <div class="form-submit">
              <button type="submit" class="btn-submit" :disabled="formSubmitting">
                <span v-if="formSubmitting">
                  <i class="fas fa-spinner fa-spin"></i> Đang gửi...
                </span>
                <span v-else>
                  <i class="fas fa-paper-plane"></i> Gửi đăng ký hợp tác
                </span>
              </button>
              <p class="form-note">
                Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ sau khi nhận được đăng ký
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="page-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Hỗ trợ đối tác môi giới</h4>
          <ul class="footer-links">
            <li><a href="#">Chính sách hợp tác</a></li>
            <li><a href="#">Quy trình làm việc</a></li>
            <li><a href="#">Hướng dẫn đăng ký</a></li>
            <li><a href="#">Chính sách hoa hồng</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Tài nguyên dành cho môi giới</h4>
          <ul class="footer-links">
            <li><a href="#">Tài liệu giới thiệu BĐS</a></li>
            <li><a href="#">Bộ công cụ marketing</a></li>
            <li><a href="#">Đào tạo chuyên môn</a></li>
            <li><a href="#">Hỏi đáp thường gặp</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Liên hệ hợp tác</h4>
          <div class="contact-info">
            <p><i class="fas fa-phone-alt"></i> Hotline: 1900 1234</p>
            <p><i class="fas fa-envelope"></i> Email: partner@realestate.com</p>
            <p><i class="fas fa-clock"></i> Giờ làm việc: 8:00 - 18:00 (T2 - T7)</p>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2023 RealEstate Partnership. Tất cả các quyền được bảo lưu.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive state using ref()
const brokerViewMode = ref('grid')
const searchQuery = ref('')
const selectedCity = ref('')
const selectedPropertyType = ref('')
const selectedBroker = ref(null)
const showCollaborationModal = ref(false)
const formSubmitting = ref(false)

// Pagination
const brokersPage = ref(1)
const brokersPerPage = ref(10)
const propertiesPage = ref(1)
const propertiesPerPage = ref(5)

// Collaboration form data using ref()
const collaborationForm = ref({
  fullName: '',
  phone: '',
  email: '',
  city: '',
  experience: '',
  specialization: '',
  message: '',
  agreeTerms: false
})

// Sample data for brokers (increased to 20)
const brokers = ref([
  {
    id: 1,
    name: 'Nguyễn Văn An',
    title: 'Chuyên viên môi giới cao cấp',
    location: 'Hồ Chí Minh',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    verified: true,
    propertiesSold: 42,
    successRate: 92,
    totalSales: 320,
    experience: 8,
    averageTime: 45,
    bio: 'Chuyên gia với hơn 8 năm kinh nghiệm trong lĩnh vực BĐS cao cấp. Đã hoàn thành hơn 40 dự án với tỷ lệ thành công ấn tượng.',
    testimonial: 'Hợp tác với đội ngũ đã giúp tôi tiếp cận nguồn hàng chất lượng và tăng doanh thu lên 40% chỉ sau 6 tháng.',
    tags: ['Cao cấp', 'Căn hộ', 'Biệt thự', 'Top Seller'],
    recentProperties: [
      { id: 1, name: 'Sunshine City', location: 'Quận 7', price: 45 },
      { id: 2, name: 'Vinhomes Grand Park', location: 'Quận 9', price: 68 },
      { id: 3, name: 'Masteri Centre Point', location: 'Quận 2', price: 32 },
      { id: 4, name: 'The Nassim', location: 'Quận 1', price: 120 },
      { id: 5, name: 'Estella Heights', location: 'Quận 2', price: 40 }
    ]
  },
  {
    id: 2,
    name: 'Trần Thị Bích',
    title: 'Trưởng nhóm môi giới',
    location: 'Hà Nội',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    verified: true,
    propertiesSold: 38,
    successRate: 88,
    totalSales: 280,
    experience: 6,
    averageTime: 52,
    bio: 'Chuyên gia BĐS khu vực Hà Nội với 6 năm kinh nghiệm, đặc biệt thành công với các dự án căn hộ trung và cao cấp.',
    testimonial: 'Nhờ hệ thống hỗ trợ và đào tạo bài bản, tôi đã phát triển được đội nhóm 10 người và tăng doanh số gấp 3 lần.',
    tags: ['Căn hộ', 'Đất nền', 'Team Leader'],
    recentProperties: [
      { id: 6, name: 'Times City Park Hill', location: 'Hai Bà Trưng', price: 55 },
      { id: 7, name: 'Goldmark City', location: 'Thanh Xuân', price: 38 },
      { id: 8, name: 'Dự án đô thị Văn Khê', location: 'Hà Đông', price: 42 },
      { id: 9, name: 'Hà Nội Sunshine Center', location: 'Đống Đa', price: 65 },
      { id: 10, name: 'The Terra An Hưng', location: 'Hà Đông', price: 28 }
    ]
  },
  {
    id: 3,
    name: 'Lê Minh Đức',
    title: 'Chuyên viên môi giới BĐS',
    location: 'Đà Nẵng',
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    verified: true,
    propertiesSold: 25,
    successRate: 85,
    totalSales: 180,
    experience: 4,
    averageTime: 60,
    bio: 'Chuyên gia BĐS khu vực miền Trung, có mạng lưới khách hàng rộng và am hiểu thị trường địa phương.',
    testimonial: 'Chính sách hoa hồng hấp dẫn và sự hỗ trợ nhiệt tình từ đội ngũ đã giúp tôi đạt doanh số kỷ lục.',
    tags: ['BĐS nghỉ dưỡng', 'Biệt thự', 'Đất nền'],
    recentProperties: [
      { id: 11, name: 'Furama Resort Đà Nẵng', location: 'Ngũ Hành Sơn', price: 75 },
      { id: 12, name: 'Danang Beach Resort', location: 'Sơn Trà', price: 52 },
      { id: 13, name: 'Monarchy Đà Nẵng', location: 'Hải Châu', price: 28 },
      { id: 14, name: 'Hilton Đà Nẵng', location: 'Ngũ Hành Sơn', price: 95 },
      { id: 15, name: 'Novotel Đà Nẵng', location: 'Hải Châu', price: 45 }
    ]
  },
  {
    id: 4,
    name: 'Phạm Thu Hà',
    title: 'Chuyên viên tư vấn cao cấp',
    location: 'Hồ Chí Minh',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    verified: true,
    propertiesSold: 31,
    successRate: 90,
    totalSales: 245,
    experience: 5,
    averageTime: 48,
    bio: 'Chuyên gia tư vấn BĐS cao cấp, đặc biệt thành công với phân khúc khách hàng VIP và người nước ngoài.',
    testimonial: 'Nguồn hàng đa dạng và chất lượng giúp tôi dễ dàng đáp ứng nhu cầu của những khách hàng khó tính nhất.',
    tags: ['Cao cấp', 'Khách VIP', 'Người nước ngoài'],
    recentProperties: [
      { id: 16, name: 'The Nassim', location: 'Quận 1', price: 120 },
      { id: 17, name: 'Saigon Pearl', location: 'Bình Thạnh', price: 85 },
      { id: 18, name: 'Estella Heights', location: 'Quận 2', price: 40 },
      { id: 19, name: 'Masteri Thảo Điền', location: 'Quận 2', price: 55 },
      { id: 20, name: 'Sunwah Pearl', location: 'Quận 1', price: 90 }
    ]
  },
  {
    id: 5,
    name: 'Hoàng Văn Cường',
    title: 'Chuyên viên môi giới',
    location: 'Hà Nội',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    verified: true,
    propertiesSold: 18,
    successRate: 82,
    totalSales: 125,
    experience: 3,
    averageTime: 65,
    bio: 'Chuyên gia trẻ với 3 năm kinh nghiệm, năng động và nhiệt huyết, chuyên về phân khúc căn hộ trung cấp.',
    testimonial: 'Được đào tạo bài bản và hỗ trợ tận tình giúp tôi tự tin hơn trong công việc và đạt được thành công nhanh chóng.',
    tags: ['Căn hộ', 'Trung cấp', 'Năng động'],
    recentProperties: [
      { id: 21, name: 'Vincom Center', location: 'Ba Đình', price: 35 },
      { id: 22, name: 'Handico Tower', location: 'Nam Từ Liêm', price: 28 },
      { id: 23, name: 'Hapro Tower', location: 'Đống Đa', price: 32 },
      { id: 24, name: 'Sông Đà Tower', location: 'Cầu Giấy', price: 40 },
      { id: 25, name: 'Lotte Center', location: 'Ba Đình', price: 95 }
    ]
  },
  {
    id: 6,
    name: 'Đỗ Thị Lan',
    title: 'Trưởng phòng môi giới',
    location: 'Hồ Chí Minh',
    avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
    verified: true,
    propertiesSold: 56,
    successRate: 94,
    totalSales: 420,
    experience: 10,
    averageTime: 40,
    bio: 'Với 10 năm kinh nghiệm, là chuyên gia hàng đầu trong lĩnh vực BĐS thương mại và văn phòng.',
    testimonial: 'Hệ thống làm việc chuyên nghiệp và minh bạch giúp tôi tập trung phát triển kinh doanh và mang lại giá trị cho khách hàng.',
    tags: ['Thương mại', 'Văn phòng', 'Chuyên gia'],
    recentProperties: [
      { id: 26, name: 'Bitexco Financial Tower', location: 'Quận 1', price: 150 },
      { id: 27, name: 'Lim Tower', location: 'Quận 3', price: 85 },
      { id: 28, name: 'Pearl Plaza', location: 'Bình Thạnh', price: 65 },
      { id: 29, name: 'Centec Tower', location: 'Quận 3', price: 75 },
      { id: 30, name: 'Saigon Trade Center', location: 'Quận 1', price: 110 }
    ]
  },
  {
    id: 7,
    name: 'Vũ Minh Tuấn',
    title: 'Chuyên viên cao cấp',
    location: 'Đà Nẵng',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    verified: true,
    propertiesSold: 22,
    successRate: 87,
    totalSales: 160,
    experience: 4,
    averageTime: 55,
    bio: 'Chuyên gia về BĐS nghỉ dưỡng ven biển Đà Nẵng, có mối quan hệ rộng với các chủ đầu tư lớn.',
    testimonial: 'Chính sách hợp tác linh hoạt và hỗ trợ marketing hiệu quả giúp tôi tiếp cận được nhiều khách hàng tiềm năng.',
    tags: ['Nghỉ dưỡng', 'Ven biển', 'Đầu tư'],
    recentProperties: [
      { id: 31, name: 'Hyatt Regency Đà Nẵng', location: 'Sơn Trà', price: 88 },
      { id: 32, name: 'Pullman Đà Nẵng', location: 'Hải Châu', price: 62 },
      { id: 33, name: 'Mường Thanh Đà Nẵng', location: 'Sơn Trà', price: 45 },
      { id: 34, name: 'Grand Tourane Đà Nẵng', location: 'Ngũ Hành Sơn', price: 52 },
      { id: 35, name: 'Brilliant Đà Nẵng', location: 'Hải Châu', price: 38 }
    ]
  },
  {
    id: 8,
    name: 'Ngô Văn Hải',
    title: 'Chuyên viên môi giới',
    location: 'Hải Phòng',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    verified: true,
    propertiesSold: 15,
    successRate: 80,
    totalSales: 95,
    experience: 2,
    averageTime: 70,
    bio: 'Chuyên gia trẻ đầy tiềm năng tại Hải Phòng, chuyên về phân khúc nhà phố và đất nền đô thị.',
    testimonial: 'Được đào tạo chuyên sâu và hỗ trợ từ các chuyên gia giàu kinh nghiệm giúp tôi phát triển nhanh trong nghề.',
    tags: ['Nhà phố', 'Đất nền', 'Trẻ tuổi'],
    recentProperties: [
      { id: 36, name: 'Vincom Hải Phòng', location: 'Ngô Quyền', price: 42 },
      { id: 37, name: 'Hải Phòng Marina', location: 'Hồng Bàng', price: 58 },
      { id: 38, name: 'Sông Giá Residence', location: 'Dương Kinh', price: 35 },
      { id: 39, name: 'Vinhomes Imperia', location: 'Hồng Bàng', price: 68 },
      { id: 40, name: 'Hải Phòng Tower', location: 'Ngô Quyền', price: 48 }
    ]
  },
  {
    id: 9,
    name: 'Lê Thị Mai',
    title: 'Chuyên viên tư vấn',
    location: 'Cần Thơ',
    avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
    verified: true,
    propertiesSold: 12,
    successRate: 78,
    totalSales: 65,
    experience: 2,
    averageTime: 75,
    bio: 'Chuyên gia về BĐS khu vực Đồng bằng sông Cửu Long, am hiểu thị trường địa phương.',
    testimonial: 'Làm việc trong môi trường chuyên nghiệp với nguồn hàng đa dạng giúp tôi tự tin hơn khi tư vấn cho khách hàng.',
    tags: ['Đồng bằng', 'Đất nền', 'Địa phương'],
    recentProperties: [
      { id: 41, name: 'Vincom Cần Thơ', location: 'Ninh Kiều', price: 38 },
      { id: 42, name: 'Cần Thơ Central', location: 'Cái Răng', price: 45 },
      { id: 43, name: 'Aeon Mall Cần Thơ', location: 'Bình Thủy', price: 52 },
      { id: 44, name: 'Sông Hậu Residence', location: 'Ninh Kiều', price: 28 },
      { id: 45, name: 'Cần Thơ Plaza', location: 'Ô Môn', price: 32 }
    ]
  },
  {
    id: 10,
    name: 'Trịnh Thị Hương',
    title: 'Chuyên viên cao cấp',
    location: 'Nha Trang',
    avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
    verified: true,
    propertiesSold: 28,
    successRate: 89,
    totalSales: 195,
    experience: 5,
    averageTime: 50,
    bio: 'Chuyên gia về BĐS nghỉ dưỡng tại Nha Trang, có kinh nghiệm làm việc với khách hàng quốc tế.',
    testimonial: 'Hệ thống làm việc hiệu quả và chuyên nghiệp giúp tôi quản lý công việc tốt hơn và đạt hiệu suất cao.',
    tags: ['Nghỉ dưỡng', 'Du lịch', 'Quốc tế'],
    recentProperties: [
      { id: 46, name: 'Vinpearl Nha Trang', location: 'Vĩnh Hòa', price: 85 },
      { id: 47, name: 'Sheraton Nha Trang', location: 'Lộc Thọ', price: 72 },
      { id: 48, name: 'Melia Nha Trang', location: 'Phước Hải', price: 65 },
      { id: 49, name: 'Intercontinental Nha Trang', location: 'Vĩnh Thọ', price: 95 },
      { id: 50, name: 'Amanoi Nha Trang', location: 'Vĩnh Lương', price: 120 }
    ]
  },
  {
    id: 11,
    name: 'Bùi Văn Thành',
    title: 'Trưởng nhóm kinh doanh',
    location: 'Hồ Chí Minh',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    verified: true,
    propertiesSold: 47,
    successRate: 91,
    totalSales: 350,
    experience: 7,
    averageTime: 42,
    bio: 'Chuyên gia với 7 năm kinh nghiệm, đặc biệt thành công trong lĩnh vực căn hộ cao cấp và biệt thự.',
    testimonial: 'Chính sách hoa hồng cạnh tranh và sự hỗ trợ từ đội ngũ đã giúp tôi đạt được thu nhập mong muốn.',
    tags: ['Cao cấp', 'Biệt thự', 'Kinh doanh'],
    recentProperties: [
      { id: 51, name: 'The Estella', location: 'Quận 2', price: 75 },
      { id: 52, name: 'Saigon Riverside', location: 'Quận 7', price: 88 },
      { id: 53, name: 'Celadon City', location: 'Tân Phú', price: 42 },
      { id: 54, name: 'Jamona Heights', location: 'Quận 7', price: 55 },
      { id: 55, name: 'Lavilla Green', location: 'Quận 9', price: 38 }
    ]
  },
  {
    id: 12,
    name: 'Nguyễn Thị Hồng',
    title: 'Chuyên viên môi giới',
    location: 'Hà Nội',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    verified: true,
    propertiesSold: 21,
    successRate: 84,
    totalSales: 145,
    experience: 3,
    averageTime: 60,
    bio: 'Chuyên gia trẻ với sự nhiệt huyết và đam mê, chuyên về phân khúc căn hộ trung cấp tại Hà Nội.',
    testimonial: 'Được làm việc trong môi trường chuyên nghiệp với đội ngũ hỗ trợ nhiệt tình giúp tôi phát triển sự nghiệp nhanh chóng.',
    tags: ['Trung cấp', 'Nhiệt huyết', 'Hà Nội'],
    recentProperties: [
      { id: 56, name: 'Hanoi Garden City', location: 'Thanh Xuân', price: 32 },
      { id: 57, name: 'An Binh City', location: 'Long Biên', price: 28 },
      { id: 58, name: 'Splendora Bắc An Khánh', location: 'Hoài Đức', price: 45 },
      { id: 59, name: 'D', location: 'Tây Hồ', price: 68 },
      { id: 60, name: 'Sun Grand City', location: 'Thanh Xuân', price: 52 }
    ]
  },
  {
    id: 13,
    name: 'Phan Văn Dũng',
    title: 'Chuyên viên cao cấp',
    location: 'Đà Nẵng',
    avatar: 'https://randomuser.me/api/portraits/men/70.jpg',
    verified: true,
    propertiesSold: 33,
    successRate: 88,
    totalSales: 240,
    experience: 6,
    averageTime: 48,
    bio: 'Chuyên gia với 6 năm kinh nghiệm về BĐS nghỉ dưỡng và căn hộ cao cấp tại Đà Nẵng.',
    testimonial: 'Hợp tác với công ty đã mang lại cho tôi nguồn hàng chất lượng và khách hàng tiềm năng.',
    tags: ['Nghỉ dưỡng', 'Cao cấp', 'Đà Nẵng'],
    recentProperties: [
      { id: 61, name: 'Fusion Suites Đà Nẵng', location: 'Ngũ Hành Sơn', price: 58 },
      { id: 62, name: 'Naman Retreat', location: 'Ngũ Hành Sơn', price: 85 },
      { id: 63, name: 'Premier Village', location: 'Sơn Trà', price: 72 },
      { id: 64, name: 'Risemount Resort', location: 'Ngũ Hành Sơn', price: 48 },
      { id: 65, name: 'A La Carte Đà Nẵng', location: 'Hải Châu', price: 62 }
    ]
  },
  {
    id: 14,
    name: 'Đinh Thị Thu',
    title: 'Chuyên viên tư vấn',
    location: 'Hải Phòng',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    verified: true,
    propertiesSold: 19,
    successRate: 83,
    totalSales: 115,
    experience: 3,
    averageTime: 62,
    bio: 'Chuyên gia về nhà phố và đất nền tại Hải Phòng, có mạng lưới khách hàng địa phương rộng.',
    testimonial: 'Sự hỗ trợ từ đội ngũ và hệ thống làm việc chuyên nghiệp giúp tôi tự tin hơn trong công việc.',
    tags: ['Nhà phố', 'Đất nền', 'Hải Phòng'],
    recentProperties: [
      { id: 66, name: 'Hải Phòng Garden', location: 'Lê Chân', price: 32 },
      { id: 67, name: 'An Dương Residence', location: 'An Dương', price: 28 },
      { id: 68, name: 'Hải Phòng Star', location: 'Kiến An', price: 38 },
      { id: 69, name: 'Vinhomes Imperia 2', location: 'Hồng Bàng', price: 72 },
      { id: 70, name: 'Hải Phòng Central', location: 'Ngô Quyền', price: 45 }
    ]
  },
  {
    id: 15,
    name: 'Lý Văn Hùng',
    title: 'Chuyên viên môi giới',
    location: 'Cần Thơ',
    avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
    verified: true,
    propertiesSold: 14,
    successRate: 79,
    totalSales: 80,
    experience: 2,
    averageTime: 68,
    bio: 'Chuyên gia trẻ về BĐS khu vực Cần Thơ, chuyên về phân khúc căn hộ và nhà phố.',
    testimonial: 'Được đào tạo bài bản và làm việc trong môi trường chuyên nghiệp giúp tôi phát triển kỹ năng nhanh chóng.',
    tags: ['Căn hộ', 'Nhà phố', 'Cần Thơ'],
    recentProperties: [
      { id: 71, name: 'Cần Thơ Central Park', location: 'Ninh Kiều', price: 35 },
      { id: 72, name: 'Vincom Xuân Khánh', location: 'Ninh Kiều', price: 42 },
      { id: 73, name: 'Cần Thơ Sky Garden', location: 'Cái Răng', price: 38 },
      { id: 74, name: 'Hùng Vương Plaza', location: 'Ninh Kiều', price: 45 },
      { id: 75, name: 'Cần Thơ Riverside', location: 'Bình Thủy', price: 52 }
    ]
  },
  {
    id: 16,
    name: 'Võ Thị Kim',
    title: 'Chuyên viên cao cấp',
    location: 'Nha Trang',
    avatar: 'https://randomuser.me/api/portraits/women/35.jpg',
    verified: true,
    propertiesSold: 26,
    successRate: 86,
    totalSales: 185,
    experience: 5,
    averageTime: 52,
    bio: 'Chuyên gia về BĐS nghỉ dưỡng ven biển Nha Trang, có kinh nghiệm làm việc với khách hàng cao cấp.',
    testimonial: 'Chính sách hợp tác minh bạch và sự hỗ trợ nhiệt tình từ đội ngũ đã giúp tôi đạt được thành công.',
    tags: ['Nghỉ dưỡng', 'Ven biển', 'Cao cấp'],
    recentProperties: [
      { id: 76, name: 'Vinpearl Luxury', location: 'Vĩnh Hòa', price: 95 },
      { id: 77, name: 'Mia Resort Nha Trang', location: 'Cam Lâm', price: 85 },
      { id: 78, name: 'Six Senses Ninh Vân Bay', location: 'Ninh Hòa', price: 120 },
      { id: 79, name: 'Ana Mandara Resort', location: 'Vĩnh Hải', price: 72 },
      { id: 80, name: 'Diamond Bay Resort', location: 'Vĩnh Thái', price: 68 }
    ]
  },
  {
    id: 17,
    name: 'Trần Văn Hải',
    title: 'Trưởng phòng kinh doanh',
    location: 'Hồ Chí Minh',
    avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
    verified: true,
    propertiesSold: 62,
    successRate: 93,
    totalSales: 480,
    experience: 12,
    averageTime: 38,
    bio: 'Chuyên gia hàng đầu với 12 năm kinh nghiệm trong lĩnh vực BĐS cao cấp và thương mại.',
    testimonial: 'Làm việc trong môi trường chuyên nghiệp với hệ thống hỗ trợ toàn diện giúp tôi đạt được hiệu quả công việc tối ưu.',
    tags: ['Cao cấp', 'Thương mại', 'Hàng đầu'],
    recentProperties: [
      { id: 81, name: 'Landmark 81', location: 'Bình Thạnh', price: 180 },
      { id: 82, name: 'The River Thu Thiem', location: 'Quận 2', price: 125 },
      { id: 83, name: 'Empire City', location: 'Quận 2', price: 95 },
      { id: 84, name: 'Grand Manhattan', location: 'Bình Thạnh', price: 85 },
      { id: 85, name: 'Sun Avenue', location: 'Quận 7', price: 68 }
    ]
  },
  {
    id: 18,
    name: 'Nguyễn Thị Lan Anh',
    title: 'Chuyên viên môi giới',
    location: 'Hà Nội',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    verified: true,
    propertiesSold: 24,
    successRate: 85,
    totalSales: 165,
    experience: 4,
    averageTime: 58,
    bio: 'Chuyên gia về căn hộ cao cấp tại Hà Nội, có kinh nghiệm làm việc với khách hàng doanh nhân.',
    testimonial: 'Được tiếp cận nguồn hàng chất lượng và hỗ trợ marketing hiệu quả giúp tôi dễ dàng chốt giao dịch.',
    tags: ['Cao cấp', 'Doanh nhân', 'Hà Nội'],
    recentProperties: [
      { id: 86, name: 'Keangnam Hanoi', location: 'Nam Từ Liêm', price: 75 },
      { id: 87, name: 'Hanoi Daewoo Hotel', location: 'Ba Đình', price: 92 },
      { id: 88, name: 'Lotte Center Hanoi', location: 'Ba Đình', price: 88 },
      { id: 89, name: 'Capital Garden', location: 'Đống Đa', price: 52 },
      { id: 90, name: 'Hanoi Paragon', location: 'Thanh Xuân', price: 65 }
    ]
  },
  {
    id: 19,
    name: 'Hoàng Văn Nam',
    title: 'Chuyên viên cao cấp',
    location: 'Đà Nẵng',
    avatar: 'https://randomuser.me/api/portraits/men/60.jpg',
    verified: true,
    propertiesSold: 29,
    successRate: 87,
    totalSales: 210,
    experience: 5,
    averageTime: 50,
    bio: 'Chuyên gia về BĐS nghỉ dưỡng và căn hộ cao cấp tại Đà Nẵng, có mối quan hệ rộng với các đối tác.',
    testimonial: 'Hệ thống làm việc chuyên nghiệp và hỗ trợ kịp thời giúp tôi giải quyết mọi vấn đề trong công việc.',
    tags: ['Nghỉ dưỡng', 'Cao cấp', 'Đối tác'],
    recentProperties: [
      { id: 91, name: 'Furama Villas', location: 'Ngũ Hành Sơn', price: 85 },
      { id: 92, name: 'Premier Residence', location: 'Sơn Trà', price: 72 },
      { id: 93, name: 'Naman Pure Bliss', location: 'Ngũ Hành Sơn', price: 95 },
      { id: 94, name: 'Risemount Apartment', location: 'Hải Châu', price: 48 },
      { id: 95, name: 'Fusion Ocean View', location: 'Ngũ Hành Sơn', price: 68 }
    ]
  },
  {
    id: 20,
    name: 'Phạm Thị Thanh',
    title: 'Chuyên viên tư vấn',
    location: 'Hải Phòng',
    avatar: 'https://randomuser.me/api/portraits/women/48.jpg',
    verified: true,
    propertiesSold: 17,
    successRate: 81,
    totalSales: 105,
    experience: 3,
    averageTime: 64,
    bio: 'Chuyên gia về nhà phố và đất nền tại Hải Phòng, có kinh nghiệm làm việc với khách hàng địa phương.',
    testimonial: 'Được đào tạo chuyên sâu và hỗ trợ từ đội ngũ giàu kinh nghiệm giúp tôi phát triển kỹ năng nhanh chóng.',
    tags: ['Nhà phố', 'Đất nền', 'Địa phương'],
    recentProperties: [
      { id: 96, name: 'Hải Phòng City Gate', location: 'Ngô Quyền', price: 42 },
      { id: 97, name: 'An Dương Star', location: 'An Dương', price: 35 },
      { id: 98, name: 'Hải Phòng Garden 2', location: 'Lê Chân', price: 38 },
      { id: 99, name: 'Vinhomes Imperia 3', location: 'Hồng Bàng', price: 78 },
      { id: 100, name: 'Hải Phòng Tower 2', location: 'Ngô Quyền', price: 52 }
    ]
  }
])

// Sample data for properties (BĐS đã bán)
const properties = ref([
  {
    id: 1,
    name: 'Biệt thự ven sông',
    description: 'Biệt thự 3 tầng, 5 phòng ngủ, view sông đẹp',
    type: 'Biệt thự',
    location: 'Quận 2, Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 45,
    soldDate: '2023-10-15',
    broker: { id: 1, name: 'Nguyễn Văn An', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
  },
  {
    id: 2,
    name: 'Căn hộ cao cấp Masteri',
    description: 'Căn hộ 3 phòng ngủ, full nội thất cao cấp',
    type: 'Căn hộ',
    location: 'Quận 2, Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 28,
    soldDate: '2023-09-22',
    broker: { id: 4, name: 'Phạm Thu Hà', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }
  },
  {
    id: 3,
    name: 'Nhà phố mặt tiền',
    description: 'Nhà phố 4 tầng, mặt tiền 6m, kinh doanh tốt',
    type: 'Nhà phố',
    location: 'Quận 3, Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 32,
    soldDate: '2023-11-05',
    broker: { id: 6, name: 'Đỗ Thị Lan', avatar: 'https://randomuser.me/api/portraits/women/26.jpg' }
  },
  {
    id: 4,
    name: 'Đất nền dự án',
    description: 'Đất nền 200m2 trong khu đô thị mới',
    type: 'Đất nền',
    location: 'Quận 9, Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 18,
    soldDate: '2023-08-30',
    broker: { id: 1, name: 'Nguyễn Văn An', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
  },
  {
    id: 5,
    name: 'Penthouse view thành phố',
    description: 'Penthouse 2 tầng, 4 phòng ngủ, view toàn cảnh',
    type: 'Căn hộ',
    location: 'Quận 1, Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 65,
    soldDate: '2023-10-28',
    broker: { id: 4, name: 'Phạm Thu Hà', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }
  },
  {
    id: 6,
    name: 'Biệt thự nghỉ dưỡng',
    description: 'Biệt thự 4 phòng ngủ, hồ bơi riêng, view biển',
    type: 'Biệt thự',
    location: 'Ngũ Hành Sơn, Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 75,
    soldDate: '2023-09-15',
    broker: { id: 3, name: 'Lê Minh Đức', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' }
  },
  {
    id: 7,
    name: 'Căn hộ trung tâm',
    description: 'Căn hộ 2 phòng ngủ, vị trí đắc địa, tiện ích đầy đủ',
    type: 'Căn hộ',
    location: 'Hai Bà Trưng, Hà Nội',
    image: 'https://images.unsplash.com/photo-1574362848149-114c3e2ea0d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 22,
    soldDate: '2023-11-10',
    broker: { id: 2, name: 'Trần Thị Bích', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
  },
  {
    id: 8,
    name: 'Shophouse mặt tiền',
    description: 'Shophouse 3 tầng, mặt tiền 8m, vị trí kinh doanh vàng',
    type: 'Nhà phố',
    location: 'Bình Thạnh, Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 42,
    soldDate: '2023-10-05',
    broker: { id: 11, name: 'Bùi Văn Thành', avatar: 'https://randomuser.me/api/portraits/men/55.jpg' }
  },
  {
    id: 9,
    name: 'Đất nền ven sông',
    description: 'Đất nền 300m2, view sông, tiềm năng đầu tư cao',
    type: 'Đất nền',
    location: 'Quận 7, Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 25,
    soldDate: '2023-09-28',
    broker: { id: 1, name: 'Nguyễn Văn An', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
  },
  {
    id: 10,
    name: 'Villa resort cao cấp',
    description: 'Villa 5 phòng ngủ, đầy đủ tiện nghi resort, view biển đẹp',
    type: 'Biệt thự',
    location: 'Sơn Trà, Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 88,
    soldDate: '2023-11-18',
    broker: { id: 7, name: 'Vũ Minh Tuấn', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' }
  },
  {
    id: 11,
    name: 'Căn hộ studio',
    description: 'Căn hộ studio 35m2, full nội thất, cho thuê tốt',
    type: 'Căn hộ',
    location: 'Quận 1, Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 15,
    soldDate: '2023-10-12',
    broker: { id: 5, name: 'Hoàng Văn Cường', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' }
  },
  {
    id: 12,
    name: 'Nhà phố cổ điển',
    description: 'Nhà phố 3 tầng phong cách cổ điển, nội thất gỗ quý',
    type: 'Nhà phố',
    location: 'Ba Đình, Hà Nội',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 38,
    soldDate: '2023-11-22',
    broker: { id: 12, name: 'Nguyễn Thị Hồng', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' }
  },
  {
    id: 13,
    name: 'Đất nền dự án đô thị',
    description: 'Đất nền 150m2 trong khu đô thị thông minh',
    type: 'Đất nền',
    location: 'Nam Từ Liêm, Hà Nội',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 20,
    soldDate: '2023-09-20',
    broker: { id: 2, name: 'Trần Thị Bích', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
  },
  {
    id: 14,
    name: 'Căn hộ duplex',
    description: 'Căn hộ duplex 2 tầng, 3 phòng ngủ, thiết kế hiện đại',
    type: 'Căn hộ',
    location: 'Quận 2, Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 48,
    soldDate: '2023-11-15',
    broker: { id: 4, name: 'Phạm Thu Hà', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }
  },
  {
    id: 15,
    name: 'Biệt thự vườn',
    description: 'Biệt thự 4 phòng ngủ, vườn rộng 500m2, hồ bơi riêng',
    type: 'Biệt thự',
    location: 'Quận 9, Hồ Chí Minh',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    price: 55,
    soldDate: '2023-10-25',
    broker: { id: 1, name: 'Nguyễn Văn An', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
  }
])

const cities = ref(['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nha Trang', 'Đà Lạt'])
const propertyTypes = ref(['Căn hộ', 'Biệt thự', 'Nhà phố', 'Đất nền', 'Shophouse', 'Villa', 'Penthouse'])

// Computed properties
const totalBrokers = computed(() => {
  return brokers.value.length
})

const totalProperties = computed(() => {
  return properties.value.length
})

const totalSales = computed(() => {
  return brokers.value.reduce((sum, broker) => sum + broker.totalSales, 0)
})

const successRate = computed(() => {
  const avg = brokers.value.reduce((sum, broker) => sum + broker.successRate, 0) / brokers.value.length
  return Math.round(avg)
})

const filteredBrokers = computed(() => {
  let filtered = brokers.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(broker =>
        broker.name.toLowerCase().includes(query) ||
        broker.title.toLowerCase().includes(query) ||
        broker.location.toLowerCase().includes(query) ||
        broker.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Filter by city
  if (selectedCity.value) {
    filtered = filtered.filter(broker =>
        broker.location === selectedCity.value
    )
  }

  return filtered
})

const filteredProperties = computed(() => {
  let filtered = properties.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.type.toLowerCase().includes(query)
    )
  }

  // Filter by city
  if (selectedCity.value) {
    filtered = filtered.filter(property =>
        property.location.includes(selectedCity.value)
    )
  }

  // Filter by property type
  if (selectedPropertyType.value) {
    filtered = filtered.filter(property =>
        property.type === selectedPropertyType.value
    )
  }

  return filtered
})

// Pagination computed properties
const totalBrokerPages = computed(() => {
  return Math.ceil(filteredBrokers.value.length / brokersPerPage.value)
})

const totalPropertyPages = computed(() => {
  return Math.ceil(filteredProperties.value.length / propertiesPerPage.value)
})

const currentBrokers = computed(() => {
  const start = (brokersPage.value - 1) * brokersPerPage.value
  const end = start + brokersPerPage.value
  return filteredBrokers.value.slice(start, end)
})

const currentProperties = computed(() => {
  const start = (propertiesPage.value - 1) * propertiesPerPage.value
  const end = start + propertiesPerPage.value
  return filteredProperties.value.slice(start, end)
})

const brokerPages = computed(() => {
  const pages = []
  const total = totalBrokerPages.value
  const current = brokersPage.value

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
})

const propertyPages = computed(() => {
  const pages = []
  const total = totalPropertyPages.value
  const current = propertiesPage.value

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
})

// Methods
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const showBrokerDetail = (broker) => {
  selectedBroker.value = broker
}

const showPropertyDetail = (property) => {
  alert(`Chi tiết BĐS: ${property.name}\nMô tả: ${property.description}\nĐịa điểm: ${property.location}\nLoại: ${property.type}\nGiá bán: ${property.price} tỷ VNĐ\nNgày bán: ${formatDate(property.soldDate)}`)
}

const showCollaborationForm = (broker = null) => {
  if (broker) {
    collaborationForm.value.message = `Tôi muốn hợp tác với môi giới ${broker.name}. ${collaborationForm.value.message}`
  }
  showCollaborationModal.value = true
}

const contactBroker = (broker) => {
  alert(`Liên hệ với ${broker.name}\nSố điện thoại: 09XX XXX XXX\nEmail: ${broker.name.toLowerCase().replace(/\s/g, '')}@example.com`)
}

const submitCollaborationForm = () => {
  formSubmitting.value = true

  // Simulate API call
  setTimeout(() => {
    alert('Đăng ký hợp tác thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.')
    formSubmitting.value = false
    showCollaborationModal.value = false
    resetCollaborationForm()
  }, 1500)
}

const resetCollaborationForm = () => {
  collaborationForm.value = {
    fullName: '',
    phone: '',
    email: '',
    city: '',
    experience: '',
    specialization: '',
    message: '',
    agreeTerms: false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCity.value = ''
  selectedPropertyType.value = ''
  brokersPage.value = 1
  propertiesPage.value = 1
}

const closeModal = () => {
  selectedBroker.value = null
  showCollaborationModal.value = false
}

const scrollToBrokers = () => {
  setTimeout(() => {
    const brokersSection = document.querySelector('.brokers-section')
    if (brokersSection) {
      brokersSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

// Lifecycle hook
onMounted(() => {
  console.log('Broker success page mounted')
})
</script>

<style scoped>
.broker-success-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f8f9fa;
}

/* Header Styles */
.page-header {
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  padding: 3rem 1.5rem;
  text-align: center;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 2.5rem;
  opacity: 0.9;
  line-height: 1.6;
}

.stats-overview {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2.5rem;
  margin-top: 2.5rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

/* Filter Section */
.filter-section {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 3rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #26d0ce;
  box-shadow: 0 0 0 3px rgba(38, 208, 206, 0.2);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.85rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  min-width: 180px;
}

.btn-reset {
  padding: 0.85rem 1.5rem;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-reset:hover {
  background-color: #e9ecef;
}

/* View Toggle */
.view-toggle-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.view-toggle-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #444;
  margin: 0;
}

.view-toggle {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
  background-color: white;
}

.view-toggle-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.view-toggle-btn.active {
  background-color: #1a2980;
  color: white;
}

.view-toggle-btn:not(.active):hover {
  background-color: #f8f9fa;
}

/* Section Styles */
.brokers-section, .properties-section {
  max-width: 1200px;
  margin: 0 auto 4rem;
  padding: 0 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #666;
  font-size: 1.1rem;
  max-width: 600px;
}

.section-stats {
  display: flex;
  align-items: center;
}

.section-stat {
  background-color: #f0f7ff;
  color: #1a2980;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Brokers Grid */
.brokers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.broker-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.broker-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.broker-header {
  display: flex;
  padding: 1.5rem;
  background: linear-gradient(90deg, #f8f9fa 0%, white 100%);
  border-bottom: 1px solid #eee;
}

.broker-avatar {
  position: relative;
  margin-right: 1.5rem;
}

.broker-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.verification-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #26d0ce;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border: 2px solid white;
}

.broker-info {
  flex: 1;
}

.broker-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #1a2980;
}

.broker-title {
  color: #26d0ce;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.broker-location {
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.broker-stats {
  display: flex;
  justify-content: space-around;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.broker-stat {
  text-align: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.broker-testimonial {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.testimonial-text {
  font-style: italic;
  color: #555;
  line-height: 1.5;
  margin: 0;
}

.broker-tags {
  padding: 1rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.broker-tag {
  background-color: #f0f7ff;
  color: #1a2980;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.broker-actions {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.btn-view-profile, .btn-collaborate, .btn-view-details, .btn-cta-primary, .btn-cta-secondary, .btn-contact, .btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 0.95rem;
}

.btn-view-profile {
  flex: 1;
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-view-profile:hover {
  background-color: #e9ecef;
}

.btn-collaborate, .btn-cta-primary, .btn-submit {
  flex: 1;
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  color: white;
}

.btn-collaborate:hover, .btn-cta-primary:hover, .btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(26, 41, 128, 0.3);
}

/* Brokers List View */
.brokers-list {
  margin-bottom: 3rem;
}

.brokers-table {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.table-header {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  font-weight: 600;
  color: #444;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #eee;
  transition: all 0.3s;
  cursor: pointer;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-cell {
  padding: 1rem;
  display: flex;
  align-items: center;
}

.broker-avatar-small {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.broker-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.broker-info-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.broker-name-list {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a2980;
  margin: 0;
}

.broker-title-list {
  font-size: 0.9rem;
  color: #26d0ce;
  font-weight: 500;
}

.broker-location-list, .broker-experience-list {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.broker-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.broker-tag-list {
  background-color: #f0f7ff;
  color: #1a2980;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.broker-actions-list {
  display: flex;
  gap: 0.5rem;
}

.btn-view-profile-list, .btn-collaborate-list {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view-profile-list {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-collaborate-list {
  background-color: #1a2980;
  color: white;
}

.btn-view-profile-list:hover {
  background-color: #e9ecef;
}

.btn-collaborate-list:hover {
  background-color: #26d0ce;
  transform: translateY(-2px);
}

/* Properties Table */
.properties-table {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
}

.property-image-small {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
}

.property-image-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.property-info-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.property-name-list {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a2980;
  margin: 0;
}

.property-description {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

.property-broker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.broker-avatar-tiny {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
}

.broker-avatar-tiny img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.broker-name-tiny {
  font-size: 0.85rem;
  color: #444;
}

.property-status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.property-status.sold {
  background-color: #d4edda;
  color: #155724;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.pagination-page {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-page:hover {
  background-color: #f8f9fa;
}

.pagination-page.active {
  background-color: #1a2980;
  color: white;
  border-color: #1a2980;
}

.pagination-dots {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  padding: 4rem 1.5rem;
  margin: 4rem 0;
  border-radius: 12px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.btn-cta-primary, .btn-cta-secondary {
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.05rem;
}

.btn-cta-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.cta-benefits {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.benefit i {
  color: #26d0ce;
  font-size: 1.2rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s;
  width: 100%;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  z-index: 10;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.modal-close:hover {
  background-color: #f8f9fa;
  color: #333;
}

.modal-body {
  padding: 2rem;
}

/* Broker Detail Modal */
.broker-detail-header {
  display: flex;
  margin-bottom: 2rem;
}

.broker-detail-avatar {
  margin-right: 2rem;
}

.broker-detail-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #f8f9fa;
}

.broker-detail-info {
  flex: 1;
}

.broker-detail-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 0.5rem;
}

.broker-detail-title {
  font-size: 1.2rem;
  color: #26d0ce;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.broker-detail-location, .broker-detail-experience {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.broker-detail-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.broker-detail-stat {
  text-align: center;
}

.broker-detail-stat .stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 0.25rem;
}

.broker-detail-stat .stat-label {
  font-size: 0.9rem;
  color: #666;
}

.broker-detail-bio, .broker-detail-testimonial, .broker-detail-properties {
  margin-bottom: 2rem;
}

.broker-detail-bio h4, .broker-detail-testimonial h4, .broker-detail-properties h4 {
  font-size: 1.3rem;
  color: #1a2980;
  margin-bottom: 1rem;
  font-weight: 600;
}

.broker-detail-bio p {
  line-height: 1.6;
  color: #555;
}

.broker-detail-testimonial blockquote {
  border-left: 4px solid #26d0ce;
  padding-left: 1.5rem;
  font-style: italic;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.properties-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.property-item {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1a2980;
}

.property-item-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.property-item-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
}

.broker-detail-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-contact {
  flex: 1;
  background-color: #28a745;
  color: white;
}

.btn-contact:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

/* Collaboration Form */
.collaboration-form {
  max-width: 700px;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a2980;
  text-align: center;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
  min-width: 250px;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #444;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #26d0ce;
  box-shadow: 0 0 0 3px rgba(38, 208, 206, 0.2);
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.checkbox-group input {
  width: auto;
  margin-top: 0.25rem;
}

.checkbox-group label {
  font-weight: normal;
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-submit {
  margin-top: 2rem;
  text-align: center;
}

.form-note {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Footer */
.page-footer {
  background-color: #1a2980;
  color: white;
  padding: 3rem 1.5rem 1.5rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-section {
  flex: 1;
  min-width: 250px;
}

.footer-section h4 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
}

.footer-links a:hover {
  color: white;
  padding-left: 0.5rem;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 1.5rem;
  color: #666;
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #ddd;
}

.no-results p {
  font-size: 1.2rem;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .brokers-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  .broker-detail-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .brokers-table, .properties-table {
    overflow-x: auto;
  }

  .table-header, .table-row {
    min-width: 1000px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.2rem;
  }

  .stats-overview {
    gap: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
  }

  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .view-toggle-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .broker-header {
    flex-direction: column;
    text-align: center;
  }

  .broker-avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .broker-detail-header {
    flex-direction: column;
    text-align: center;
  }

  .broker-detail-avatar {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }

  .broker-detail-actions, .broker-actions {
    flex-direction: column;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-pages {
    order: 1;
  }

  .pagination-btn:first-child {
    order: 2;
  }

  .pagination-btn:last-child {
    order: 3;
  }
}

@media (max-width: 576px) {
  .brokers-grid {
    grid-template-columns: 1fr;
  }

  .broker-detail-stats {
    grid-template-columns: 1fr;
  }

  .cta-title {
    font-size: 1.8rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .table-header, .table-row {
    min-width: 1200px;
  }
}
</style>