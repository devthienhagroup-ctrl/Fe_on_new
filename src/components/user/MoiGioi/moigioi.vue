<template>
  <div class="broker-success-page">
    <!-- Header section -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Đối Tác Môi Giới Thành Công</h1>
        <p class="page-subtitle">
          Khám phá câu chuyện thành công từ mạng lưới đối tác môi giới và tham gia bảng thi đua hàng quý
        </p>
        <div class="stats-overview">
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(totalBrokers) }}+</div>
            <div class="stat-label">Môi giới đã hợp tác</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(totalSales) }} tỷ</div>
            <div class="stat-label">Tổng giá trị giao dịch</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ successRate }}%</div>
            <div class="stat-label">Tỉ lệ thành công</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ currentQuarter }}</div>
            <div class="stat-label">Quý thi đua hiện tại</div>
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
                placeholder="Tìm kiếm môi giới, chuyên môn..."
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

            <select v-model="selectedQuarter" class="filter-select">
              <option value="all">Tất cả các quý</option>
              <option v-for="quarter in quarters" :key="quarter.value" :value="quarter.value">{{ quarter.label }}</option>
            </select>
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

      <!-- Top 10 Competition Section -->
      <section class="competition-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <i class="fas fa-trophy"></i> BẢNG THI ĐUA TOP 10 MÔI GIỚI XUẤT SẮC
            </h2>
            <p class="section-subtitle">
              Thống kê thành tích thi đua theo quý - Top 3 nhận giải thưởng tiền mặt và huy chương
            </p>
          </div>
          <div class="competition-period">
            <span class="period-badge">{{ currentQuarterLabel }}</span>
            <div class="quarter-info">
              <i class="fas fa-calendar-alt"></i>
              <span>Thời gian: {{ quarterDates }}</span>
            </div>
          </div>
        </div>

        <!-- Competition Rewards Info -->
        <div class="rewards-section">
          <h3 class="rewards-title">
            <i class="fas fa-gift"></i> GIẢI THƯỞNG TOP 3
          </h3>
          <div class="rewards-grid">
            <div class="reward-card gold">
              <div class="reward-rank">
                <div class="medal-icon gold">
                  <i class="fas fa-crown"></i>
                </div>
                <h4>HẠNG 1</h4>
              </div>
              <div class="reward-details">
                <div class="reward-amount">50 TRIỆU VNĐ</div>
                <div class="reward-desc">Cúp vàng + Chứng nhận xuất sắc</div>
                <div class="reward-bonus">+ 1 chuyến du lịch Bali 5 sao</div>
              </div>
            </div>

            <div class="reward-card silver">
              <div class="reward-rank">
                <div class="medal-icon silver">
                  <i class="fas fa-medal"></i>
                </div>
                <h4>HẠNG 2</h4>
              </div>
              <div class="reward-details">
                <div class="reward-amount">30 TRIỆU VNĐ</div>
                <div class="reward-desc">Cúp bạc + Chứng nhận xuất sắc</div>
                <div class="reward-bonus">+ Máy tính bảng iPad Pro</div>
              </div>
            </div>

            <div class="reward-card bronze">
              <div class="reward-rank">
                <div class="medal-icon bronze">
                  <i class="fas fa-medal"></i>
                </div>
                <h4>HẠNG 3</h4>
              </div>
              <div class="reward-details">
                <div class="reward-amount">15 TRIỆU VNĐ</div>
                <div class="reward-desc">Cúp đồng + Chứng nhận xuất sắc</div>
                <div class="reward-bonus">+ Điện thoại iPhone 15 Pro</div>
              </div>
            </div>
          </div>

          <div class="rewards-note">
            <i class="fas fa-info-circle"></i>
            <span>Giải thưởng được trao vào cuối mỗi quý dựa trên tổng doanh số và số lượng BĐS đã bán</span>
          </div>
        </div>

        <!-- Top 10 Leaderboard -->
        <div class="leaderboard-container">
          <div class="leaderboard-header">
            <div class="leaderboard-col rank">HẠNG</div>
            <div class="leaderboard-col broker">MÔI GIỚI</div>
            <div class="leaderboard-col stats">THỐNG KÊ QUÝ</div>
            <div class="leaderboard-col score">ĐIỂM THI ĐUA</div>
            <div class="leaderboard-col trend">XU HƯỚNG</div>
          </div>

          <div class="leaderboard-body">
            <div
                v-for="(broker, index) in top10Brokers"
                :key="broker.id"
                :class="['leaderboard-row', getRankClass(index)]"
            >
              <div class="leaderboard-col rank">
                <div class="rank-display">
                  <div v-if="index === 0" class="rank-number gold">1</div>
                  <div v-else-if="index === 1" class="rank-number silver">2</div>
                  <div v-else-if="index === 2" class="rank-number bronze">3</div>
                  <div v-else class="rank-number">{{ index + 1 }}</div>

                  <div v-if="index < 3" class="rank-medal">
                    <i v-if="index === 0" class="fas fa-crown gold"></i>
                    <i v-else class="fas fa-medal" :class="index === 1 ? 'silver' : 'bronze'"></i>
                  </div>
                </div>
              </div>

              <div class="leaderboard-col broker">
                <div class="broker-info-compact">
                  <div class="broker-avatar-small">
                    <img :src="broker.avatar" :alt="broker.name" />
                    <div v-if="broker.verified" class="verification-badge">
                      <i class="fas fa-check-circle"></i>
                    </div>
                  </div>
                  <div class="broker-details">
                    <div class="broker-name">{{ broker.name }}</div>
                    <div class="broker-title">{{ broker.title }}</div>
                    <div class="broker-location">
                      <i class="fas fa-map-marker-alt"></i> {{ broker.location }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="leaderboard-col stats">
                <div class="quarter-stats">
                  <div class="stat-item-compact">
                    <div class="stat-value">{{ broker.quarterStats.propertiesSold }}</div>
                    <div class="stat-label">BĐS đã bán</div>
                  </div>
                  <div class="stat-item-compact">
                    <div class="stat-value">{{ formatCurrency(broker.quarterStats.totalSales) }}</div>
                    <div class="stat-label">Doanh số</div>
                  </div>
                  <div class="stat-item-compact">
                    <div class="stat-value">{{ broker.quarterStats.successRate }}%</div>
                    <div class="stat-label">Tỉ lệ thành công</div>
                  </div>
                </div>
              </div>

              <div class="leaderboard-col score">
                <div class="score-display">
                  <div class="score-value">{{ broker.competitionScore }}</div>
                  <div class="score-progress">
                    <div class="progress-bar">
                      <div
                          class="progress-fill"
                          :style="{ width: getScorePercentage(broker.competitionScore) + '%' }"
                          :class="getRankClass(index)"
                      ></div>
                    </div>
                    <div class="score-max">/ 1000</div>
                  </div>
                </div>
              </div>

              <div class="leaderboard-col trend">
                <div class="trend-display">
                  <div v-if="broker.trend === 'up'" class="trend-up">
                    <i class="fas fa-arrow-up"></i> +{{ broker.rankChange }} hạng
                  </div>
                  <div v-else-if="broker.trend === 'down'" class="trend-down">
                    <i class="fas fa-arrow-down"></i> -{{ broker.rankChange }} hạng
                  </div>
                  <div v-else class="trend-neutral">
                    <i class="fas fa-minus"></i> Giữ nguyên
                  </div>
                  <div class="trend-period">vs Quý trước</div>
                </div>
              </div>
            </div>
          </div>

          <div class="leaderboard-footer">
            <div class="update-info">
              <i class="fas fa-sync-alt"></i>
              <span>Cập nhật lần cuối: {{ lastUpdateTime }}</span>
            </div>
            <button class="btn-view-full" @click="scrollToAllBrokers">
              Xem tất cả môi giới <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- All Brokers section -->
      <section class="brokers-section" id="all-brokers">
        <div class="section-header">
          <div>
            <h2 class="section-title">Tất Cả Môi Giới Đã Hợp Tác</h2>
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
                <div v-if="broker.topRank" :class="['rank-badge', broker.topRank]">
                  <i v-if="broker.topRank === 'gold'" class="fas fa-crown"></i>
                  <i v-else class="fas fa-medal"></i>
                  <span>Top {{ broker.topRank === 'gold' ? 1 : broker.topRank === 'silver' ? 2 : 3 }}</span>
                </div>
              </div>
              <div class="broker-info">
                <h3 class="broker-name">{{ broker.name }}</h3>
                <div class="broker-title">{{ broker.title }}</div>
                <div class="broker-location">
                  <i class="fas fa-map-marker-alt"></i> {{ broker.location }}
                </div>
                <div class="broker-experience">
                  <i class="fas fa-briefcase"></i> {{ broker.experience }} năm kinh nghiệm
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

            <div class="broker-quarter-stats">
              <div class="quarter-stats-title">Thống kê quý {{ selectedQuarter !== 'all' ? selectedQuarter : currentQuarter }}</div>
              <div class="quarter-stats-grid">
                <div class="quarter-stat">
                  <div class="quarter-stat-value">{{ broker.quarterStats.propertiesSold }}</div>
                  <div class="quarter-stat-label">BĐS đã bán</div>
                </div>
                <div class="quarter-stat">
                  <div class="quarter-stat-value">{{ formatCurrency(broker.quarterStats.totalSales) }}</div>
                  <div class="quarter-stat-label">Doanh số</div>
                </div>
                <div class="quarter-stat">
                  <div class="quarter-stat-value">{{ broker.competitionScore }}</div>
                  <div class="quarter-stat-label">Điểm thi đua</div>
                </div>
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
              <div class="table-cell" style="flex: 1">BĐS đã bán</div>
              <div class="table-cell" style="flex: 1">Doanh số quý</div>
              <div class="table-cell" style="flex: 1">Điểm thi đua</div>
              <div class="table-cell" style="width: 150px">Hành động</div>
            </div>

            <div
                v-for="(broker, index) in currentBrokers"
                :key="broker.id"
                class="table-row"
                @click="showBrokerDetail(broker)"
            >
              <div class="table-cell" style="width: 50px">
                <div :class="['rank-indicator', { 'top-rank': broker.topRank }]" :data-rank="broker.topRank">
                  {{ (brokersPage - 1) * brokersPerPage + index + 1 }}
                </div>
              </div>
              <div class="table-cell" style="width: 80px">
                <div class="broker-avatar-small">
                  <img :src="broker.avatar" :alt="broker.name" />
                  <div v-if="broker.topRank" :class="['rank-badge-small', broker.topRank]">
                    <i v-if="broker.topRank === 'gold'" class="fas fa-crown"></i>
                    <i v-else class="fas fa-medal"></i>
                  </div>
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
              <div class="table-cell" style="flex: 1">{{ formatCurrency(broker.quarterStats.totalSales) }}</div>
              <div class="table-cell" style="flex: 1">
                <div class="score-badge" :class="getScoreClass(broker.competitionScore)">
                  {{ broker.competitionScore }}
                </div>
              </div>
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

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Tham Gia Bảng Thi Đua Và Nhận Giải Thưởng Giá Trị!</h2>
          <p class="cta-description">
            Trở thành đối tác môi giới để cạnh tranh trong bảng xếp hạng hàng quý, nhận giải thưởng tiền mặt,
            cúp vàng và nhiều phần thưởng hấp dẫn khác.
          </p>
          <div class="cta-buttons">
            <button class="btn-cta-primary" @click="showCollaborationForm()">
              <i class="fas fa-handshake"></i> Đăng ký hợp tác ngay
            </button>
            <button class="btn-cta-secondary" @click="scrollToCompetition">
              <i class="fas fa-trophy"></i> Xem bảng thi đua
            </button>
          </div>
          <div class="cta-benefits">
            <div class="benefit">
              <i class="fas fa-trophy"></i>
              <span>Giải thưởng tiền mặt lên đến 50 triệu đồng</span>
            </div>
            <div class="benefit">
              <i class="fas fa-chart-line"></i>
              <span>Thi đua hàng quý với cơ hội thăng hạng</span>
            </div>
            <div class="benefit">
              <i class="fas fa-medal"></i>
              <span>Cúp vàng, bạc, đồng cho top 3 xuất sắc</span>
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
                <div v-if="selectedBroker.topRank" :class="['rank-badge-large', selectedBroker.topRank]">
                  <i v-if="selectedBroker.topRank === 'gold'" class="fas fa-crown"></i>
                  <i v-else class="fas fa-medal"></i>
                  <span>TOP {{ selectedBroker.topRank === 'gold' ? 1 : selectedBroker.topRank === 'silver' ? 2 : 3 }}</span>
                </div>
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
                <div class="broker-detail-score">
                  <i class="fas fa-star"></i> Điểm thi đua: <strong>{{ selectedBroker.competitionScore }}</strong>/1000
                </div>
              </div>
            </div>

            <div class="broker-detail-stats">
              <div class="broker-detail-stat">
                <div class="stat-value">{{ selectedBroker.propertiesSold }}</div>
                <div class="stat-label">Tổng BĐS đã bán</div>
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

            <!-- Quarter Stats -->
            <div class="broker-detail-quarter">
              <h4>
                <i class="fas fa-chart-bar"></i>
                Thống kê thi đua Quý {{ selectedQuarter !== 'all' ? selectedQuarter : currentQuarter }}
              </h4>
              <div class="quarter-stats-grid">
                <div class="quarter-stat-card">
                  <div class="quarter-stat-icon">
                    <i class="fas fa-home"></i>
                  </div>
                  <div class="quarter-stat-content">
                    <div class="quarter-stat-value">{{ selectedBroker.quarterStats.propertiesSold }}</div>
                    <div class="quarter-stat-label">BĐS đã bán</div>
                  </div>
                </div>
                <div class="quarter-stat-card">
                  <div class="quarter-stat-icon">
                    <i class="fas fa-money-bill-wave"></i>
                  </div>
                  <div class="quarter-stat-content">
                    <div class="quarter-stat-value">{{ formatCurrency(selectedBroker.quarterStats.totalSales) }}</div>
                    <div class="quarter-stat-label">Doanh số quý</div>
                  </div>
                </div>
                <div class="quarter-stat-card">
                  <div class="quarter-stat-icon">
                    <i class="fas fa-percentage"></i>
                  </div>
                  <div class="quarter-stat-content">
                    <div class="quarter-stat-value">{{ selectedBroker.quarterStats.successRate }}%</div>
                    <div class="quarter-stat-label">Tỉ lệ thành công</div>
                  </div>
                </div>
                <div class="quarter-stat-card">
                  <div class="quarter-stat-icon">
                    <i class="fas fa-trophy"></i>
                  </div>
                  <div class="quarter-stat-content">
                    <div class="quarter-stat-value">{{ selectedBroker.competitionScore }}</div>
                    <div class="quarter-stat-label">Điểm thi đua</div>
                  </div>
                </div>
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

            <div class="broker-detail-competition-history">
              <h4>
                <i class="fas fa-history"></i>
                Lịch sử thi đua
              </h4>
              <div class="competition-history">
                <div v-for="history in selectedBroker.competitionHistory" :key="history.quarter" class="history-item">
                  <div class="history-quarter">Quý {{ history.quarter }}</div>
                  <div class="history-rank" :class="getRankClass(history.rank - 1)">
                    Hạng {{ history.rank }}
                  </div>
                  <div class="history-score">{{ history.score }} điểm</div>
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
            Trở thành đối tác môi giới để tham gia thi đua hàng quý và nhận nhiều ưu đãi hấp dẫn
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
              <label for="message">Lý do muốn hợp tác và tham gia thi đua</label>
              <textarea
                  id="message"
                  v-model="collaborationForm.message"
                  placeholder="Chia sẻ lý do bạn muốn hợp tác với chúng tôi và mục tiêu tham gia bảng thi đua..."
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
                Tôi đồng ý với các điều khoản hợp tác và quy chế thi đua
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
                Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để hướng dẫn tham gia thi đua
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
          <h4>Thi đua và giải thưởng</h4>
          <ul class="footer-links">
            <li><a href="#">Quy chế thi đua</a></li>
            <li><a href="#">Giải thưởng hàng quý</a></li>
            <li><a href="#">Tiêu chí xếp hạng</a></li>
            <li><a href="#">Lịch sử thi đua</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Hỗ trợ đối tác</h4>
          <ul class="footer-links">
            <li><a href="#">Chính sách hợp tác</a></li>
            <li><a href="#">Hướng dẫn tham gia thi đua</a></li>
            <li><a href="#">Tài liệu đào tạo</a></li>
            <li><a href="#">Hỏi đáp thường gặp</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Liên hệ thi đua</h4>
          <div class="contact-info">
            <p><i class="fas fa-phone-alt"></i> Hotline thi đua: 1900 5678</p>
            <p><i class="fas fa-envelope"></i> Email: thidua@realestate.com</p>
            <p><i class="fas fa-clock"></i> Giờ làm việc: 8:00 - 18:00 (T2 - T7)</p>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2023 RealEstate Competition. Tất cả các quyền được bảo lưu.</p>
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
const selectedQuarter = ref('Q4-2023')
const selectedBroker = ref(null)
const showCollaborationModal = ref(false)
const formSubmitting = ref(false)

// Pagination
const brokersPage = ref(1)
const brokersPerPage = ref(10)

// Competition quarters
const quarters = ref([
  { label: 'Quý 4 - 2023', value: 'Q4-2023' },
  { label: 'Quý 3 - 2023', value: 'Q3-2023' },
  { label: 'Quý 2 - 2023', value: 'Q2-2023' },
  { label: 'Quý 1 - 2023', value: 'Q1-2023' },
  { label: 'Quý 4 - 2022', value: 'Q4-2022' }
])

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

// Sample data for brokers with competition data
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
    topRank: 'gold',
    competitionScore: 945,
    quarterStats: {
      propertiesSold: 12,
      totalSales: 85,
      successRate: 95
    },
    trend: 'up',
    rankChange: 2,
    bio: 'Chuyên gia với hơn 8 năm kinh nghiệm trong lĩnh vực BĐS cao cấp. Đã hoàn thành hơn 40 dự án với tỷ lệ thành công ấn tượng.',
    testimonial: 'Tham gia thi đua đã thúc đẩy tôi làm việc hiệu quả hơn và đạt doanh số kỷ lục.',
    tags: ['Cao cấp', 'Căn hộ', 'Biệt thự', 'Top Seller'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 3, score: 820 },
      { quarter: 'Q2-2023', rank: 5, score: 780 },
      { quarter: 'Q1-2023', rank: 7, score: 720 },
      { quarter: 'Q4-2022', rank: 10, score: 680 }
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
    topRank: 'silver',
    competitionScore: 892,
    quarterStats: {
      propertiesSold: 10,
      totalSales: 72,
      successRate: 90
    },
    trend: 'up',
    rankChange: 1,
    bio: 'Chuyên gia BĐS khu vực Hà Nội với 6 năm kinh nghiệm, đặc biệt thành công với các dự án căn hộ trung và cao cấp.',
    testimonial: 'Thi đua đã giúp đội nhóm của tôi có động lực phấn đấu và đạt thành tích tốt hơn.',
    tags: ['Căn hộ', 'Đất nền', 'Team Leader'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 4, score: 810 },
      { quarter: 'Q2-2023', rank: 6, score: 760 },
      { quarter: 'Q1-2023', rank: 8, score: 710 },
      { quarter: 'Q4-2022', rank: 12, score: 650 }
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
    topRank: 'bronze',
    competitionScore: 865,
    quarterStats: {
      propertiesSold: 8,
      totalSales: 58,
      successRate: 88
    },
    trend: 'neutral',
    rankChange: 0,
    bio: 'Chuyên gia BĐS khu vực miền Trung, có mạng lưới khách hàng rộng và am hiểu thị trường địa phương.',
    testimonial: 'Giải thưởng thi đua là động lực lớn giúp tôi phấn đấu không ngừng.',
    tags: ['BĐS nghỉ dưỡng', 'Biệt thự', 'Đất nền'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 2, score: 850 },
      { quarter: 'Q2-2023', rank: 3, score: 800 },
      { quarter: 'Q1-2023', rank: 4, score: 750 },
      { quarter: 'Q4-2022', rank: 5, score: 700 }
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
    topRank: null,
    competitionScore: 812,
    quarterStats: {
      propertiesSold: 9,
      totalSales: 65,
      successRate: 92
    },
    trend: 'up',
    rankChange: 3,
    bio: 'Chuyên gia tư vấn BĐS cao cấp, đặc biệt thành công với phân khúc khách hàng VIP và người nước ngoài.',
    testimonial: 'Tham gia thi đua giúp tôi có thêm nhiều cơ hội hợp tác và phát triển sự nghiệp.',
    tags: ['Cao cấp', 'Khách VIP', 'Người nước ngoài'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 7, score: 780 },
      { quarter: 'Q2-2023', rank: 10, score: 720 },
      { quarter: 'Q1-2023', rank: 12, score: 680 },
      { quarter: 'Q4-2022', rank: 15, score: 620 }
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
    topRank: null,
    competitionScore: 745,
    quarterStats: {
      propertiesSold: 6,
      totalSales: 42,
      successRate: 85
    },
    trend: 'down',
    rankChange: 2,
    bio: 'Chuyên gia trẻ với 3 năm kinh nghiệm, năng động và nhiệt huyết, chuyên về phân khúc căn hộ trung cấp.',
    testimonial: 'Mặc dù hạng giảm nhưng tôi vẫn cố gắng hết mình trong cuộc thi đua này.',
    tags: ['Căn hộ', 'Trung cấp', 'Năng động'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 4, score: 810 },
      { quarter: 'Q2-2023', rank: 5, score: 790 },
      { quarter: 'Q1-2023', rank: 6, score: 740 },
      { quarter: 'Q4-2022', rank: 8, score: 690 }
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
    topRank: null,
    competitionScore: 798,
    quarterStats: {
      propertiesSold: 11,
      totalSales: 78,
      successRate: 93
    },
    trend: 'up',
    rankChange: 1,
    bio: 'Với 10 năm kinh nghiệm, là chuyên gia hàng đầu trong lĩnh vực BĐS thương mại và văn phòng.',
    testimonial: 'Thi đua tạo ra môi trường cạnh tranh lành mạnh giúp mọi người cùng tiến bộ.',
    tags: ['Thương mại', 'Văn phòng', 'Chuyên gia'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 6, score: 790 },
      { quarter: 'Q2-2023', rank: 7, score: 770 },
      { quarter: 'Q1-2023', rank: 9, score: 730 },
      { quarter: 'Q4-2022', rank: 11, score: 670 }
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
    topRank: null,
    competitionScore: 732,
    quarterStats: {
      propertiesSold: 7,
      totalSales: 48,
      successRate: 86
    },
    trend: 'neutral',
    rankChange: 0,
    bio: 'Chuyên gia về BĐS nghỉ dưỡng ven biển Đà Nẵng, có mối quan hệ rộng với các chủ đầu tư lớn.',
    testimonial: 'Thi đua là cơ hội để chứng tỏ năng lực và học hỏi từ các đồng nghiệp xuất sắc.',
    tags: ['Nghỉ dưỡng', 'Ven biển', 'Đầu tư'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 8, score: 770 },
      { quarter: 'Q2-2023', rank: 8, score: 760 },
      { quarter: 'Q1-2023', rank: 10, score: 710 },
      { quarter: 'Q4-2022', rank: 13, score: 660 }
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
    topRank: null,
    competitionScore: 685,
    quarterStats: {
      propertiesSold: 5,
      totalSales: 32,
      successRate: 82
    },
    trend: 'up',
    rankChange: 4,
    bio: 'Chuyên gia trẻ đầy tiềm năng tại Hải Phòng, chuyên về phân khúc nhà phố và đất nền đô thị.',
    testimonial: 'Lần đầu tham gia thi đua và đã có sự tiến bộ vượt bậc nhờ sự hỗ trợ từ công ty.',
    tags: ['Nhà phố', 'Đất nền', 'Trẻ tuổi'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 12, score: 700 },
      { quarter: 'Q2-2023', rank: 16, score: 650 },
      { quarter: 'Q1-2023', rank: 18, score: 600 },
      { quarter: 'Q4-2022', rank: 20, score: 550 }
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
    topRank: null,
    competitionScore: 642,
    quarterStats: {
      propertiesSold: 4,
      totalSales: 28,
      successRate: 80
    },
    trend: 'down',
    rankChange: 1,
    bio: 'Chuyên gia về BĐS khu vực Đồng bằng sông Cửu Long, am hiểu thị trường địa phương.',
    testimonial: 'Thi đua giúp tôi có thêm động lực để cải thiện kỹ năng và nâng cao hiệu suất làm việc.',
    tags: ['Đồng bằng', 'Đất nền', 'Địa phương'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 9, score: 750 },
      { quarter: 'Q2-2023', rank: 9, score: 740 },
      { quarter: 'Q1-2023', rank: 11, score: 690 },
      { quarter: 'Q4-2022', rank: 14, score: 640 }
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
    topRank: null,
    competitionScore: 765,
    quarterStats: {
      propertiesSold: 8,
      totalSales: 55,
      successRate: 88
    },
    trend: 'up',
    rankChange: 2,
    bio: 'Chuyên gia về BĐS nghỉ dưỡng tại Nha Trang, có kinh nghiệm làm việc với khách hàng quốc tế.',
    testimonial: 'Thi đua không chỉ là cạnh tranh mà còn là cơ hội để giao lưu và học hỏi kinh nghiệm.',
    tags: ['Nghỉ dưỡng', 'Du lịch', 'Quốc tế'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 10, score: 740 },
      { quarter: 'Q2-2023', rank: 11, score: 710 },
      { quarter: 'Q1-2023', rank: 13, score: 670 },
      { quarter: 'Q4-2022', rank: 16, score: 620 }
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
    topRank: null,
    competitionScore: 815,
    quarterStats: {
      propertiesSold: 10,
      totalSales: 72,
      successRate: 91
    },
    trend: 'neutral',
    rankChange: 0,
    bio: 'Chuyên gia với 7 năm kinh nghiệm, đặc biệt thành công trong lĩnh vực căn hộ cao cấp và biệt thự.',
    testimonial: 'Thi đua tạo động lực để tôi và đội nhóm không ngừng phấn đấu vươn lên.',
    tags: ['Cao cấp', 'Biệt thự', 'Kinh doanh'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 5, score: 800 },
      { quarter: 'Q2-2023', rank: 4, score: 810 },
      { quarter: 'Q1-2023', rank: 3, score: 820 },
      { quarter: 'Q4-2022', rank: 4, score: 780 }
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
    topRank: null,
    competitionScore: 698,
    quarterStats: {
      propertiesSold: 6,
      totalSales: 40,
      successRate: 84
    },
    trend: 'down',
    rankChange: 3,
    bio: 'Chuyên gia trẻ với sự nhiệt huyết và đam mê, chuyên về phân khúc căn hộ trung cấp tại Hà Nội.',
    testimonial: 'Dù thứ hạng có giảm nhưng tôi vẫn cảm thấy hài lòng với những gì đã đạt được.',
    tags: ['Trung cấp', 'Nhiệt huyết', 'Hà Nội'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 7, score: 780 },
      { quarter: 'Q2-2023', rank: 5, score: 790 },
      { quarter: 'Q1-2023', rank: 5, score: 760 },
      { quarter: 'Q4-2022', rank: 7, score: 710 }
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
    topRank: null,
    competitionScore: 755,
    quarterStats: {
      propertiesSold: 8,
      totalSales: 52,
      successRate: 87
    },
    trend: 'up',
    rankChange: 1,
    bio: 'Chuyên gia với 6 năm kinh nghiệm về BĐS nghỉ dưỡng và căn hộ cao cấp tại Đà Nẵng.',
    testimonial: 'Tham gia thi đua là cách tốt nhất để thể hiện năng lực và đóng góp cho công ty.',
    tags: ['Nghỉ dưỡng', 'Cao cấp', 'Đà Nẵng'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 11, score: 720 },
      { quarter: 'Q2-2023', rank: 12, score: 700 },
      { quarter: 'Q1-2023', rank: 14, score: 660 },
      { quarter: 'Q4-2022', rank: 17, score: 610 }
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
    topRank: null,
    competitionScore: 672,
    quarterStats: {
      propertiesSold: 5,
      totalSales: 35,
      successRate: 83
    },
    trend: 'up',
    rankChange: 2,
    bio: 'Chuyên gia về nhà phố và đất nền tại Hải Phòng, có mạng lưới khách hàng địa phương rộng.',
    testimonial: 'Thi đua giúp tôi có thêm nhiều mối quan hệ và cơ hội hợp tác mới.',
    tags: ['Nhà phố', 'Đất nền', 'Hải Phòng'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 14, score: 680 },
      { quarter: 'Q2-2023', rank: 16, score: 640 },
      { quarter: 'Q1-2023', rank: 17, score: 600 },
      { quarter: 'Q4-2022', rank: 19, score: 560 }
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
    topRank: null,
    competitionScore: 628,
    quarterStats: {
      propertiesSold: 4,
      totalSales: 25,
      successRate: 79
    },
    trend: 'neutral',
    rankChange: 0,
    bio: 'Chuyên gia trẻ về BĐS khu vực Cần Thơ, chuyên về phân khúc căn hộ và nhà phố.',
    testimonial: 'Thi đua là động lực để tôi không ngừng học hỏi và cải thiện kỹ năng.',
    tags: ['Căn hộ', 'Nhà phố', 'Cần Thơ'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 15, score: 670 },
      { quarter: 'Q2-2023', rank: 14, score: 680 },
      { quarter: 'Q1-2023', rank: 16, score: 630 },
      { quarter: 'Q4-2022', rank: 18, score: 580 }
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
    topRank: null,
    competitionScore: 738,
    quarterStats: {
      propertiesSold: 7,
      totalSales: 48,
      successRate: 86
    },
    trend: 'down',
    rankChange: 2,
    bio: 'Chuyên gia về BĐS nghỉ dưỡng ven biển Nha Trang, có kinh nghiệm làm việc với khách hàng cao cấp.',
    testimonial: 'Thi đua là cơ hội để tôi chứng minh năng lực và đóng góp cho sự phát triển chung.',
    tags: ['Nghỉ dưỡng', 'Ven biển', 'Cao cấp'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 9, score: 750 },
      { quarter: 'Q2-2023', rank: 7, score: 770 },
      { quarter: 'Q1-2023', rank: 8, score: 730 },
      { quarter: 'Q4-2022', rank: 9, score: 690 }
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
    topRank: null,
    competitionScore: 825,
    quarterStats: {
      propertiesSold: 13,
      totalSales: 92,
      successRate: 94
    },
    trend: 'up',
    rankChange: 1,
    bio: 'Chuyên gia hàng đầu với 12 năm kinh nghiệm trong lĩnh vực BĐS cao cấp và thương mại.',
    testimonial: 'Thi đua tạo ra không khí làm việc sôi nổi và hiệu quả trong toàn đội ngũ.',
    tags: ['Cao cấp', 'Thương mại', 'Hàng đầu'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 4, score: 810 },
      { quarter: 'Q2-2023', rank: 3, score: 820 },
      { quarter: 'Q1-2023', rank: 2, score: 830 },
      { quarter: 'Q4-2022', rank: 3, score: 790 }
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
    topRank: null,
    competitionScore: 710,
    quarterStats: {
      propertiesSold: 7,
      totalSales: 45,
      successRate: 85
    },
    trend: 'up',
    rankChange: 3,
    bio: 'Chuyên gia về căn hộ cao cấp tại Hà Nội, có kinh nghiệm làm việc với khách hàng doanh nhân.',
    testimonial: 'Thi đua giúp tôi có thêm động lực để đạt được những mục tiêu cao hơn.',
    tags: ['Cao cấp', 'Doanh nhân', 'Hà Nội'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 13, score: 690 },
      { quarter: 'Q2-2023', rank: 16, score: 650 },
      { quarter: 'Q1-2023', rank: 19, score: 590 },
      { quarter: 'Q4-2022', rank: 21, score: 540 }
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
    topRank: null,
    competitionScore: 748,
    quarterStats: {
      propertiesSold: 8,
      totalSales: 55,
      successRate: 87
    },
    trend: 'neutral',
    rankChange: 0,
    bio: 'Chuyên gia về BĐS nghỉ dưỡng và căn hộ cao cấp tại Đà Nẵng, có mối quan hệ rộng với các đối tác.',
    testimonial: 'Thi đua là sân chơi lành mạnh để các môi giới cùng nhau phát triển.',
    tags: ['Nghỉ dưỡng', 'Cao cấp', 'Đối tác'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 10, score: 740 },
      { quarter: 'Q2-2023', rank: 10, score: 730 },
      { quarter: 'Q1-2023', rank: 12, score: 680 },
      { quarter: 'Q4-2022', rank: 15, score: 630 }
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
    topRank: null,
    competitionScore: 658,
    quarterStats: {
      propertiesSold: 5,
      totalSales: 38,
      successRate: 82
    },
    trend: 'up',
    rankChange: 2,
    bio: 'Chuyên gia về nhà phố và đất nền tại Hải Phòng, có kinh nghiệm làm việc với khách hàng địa phương.',
    testimonial: 'Thi đua giúp tôi có thêm nhiều bài học quý giá và kinh nghiệm thực tế.',
    tags: ['Nhà phố', 'Đất nền', 'Địa phương'],
    competitionHistory: [
      { quarter: 'Q3-2023', rank: 16, score: 660 },
      { quarter: 'Q2-2023', rank: 18, score: 620 },
      { quarter: 'Q1-2023', rank: 20, score: 570 },
      { quarter: 'Q4-2022', rank: 22, score: 520 }
    ]
  }
])

const cities = ref(['Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nha Trang', 'Đà Lạt'])

// Computed properties
const totalBrokers = computed(() => {
  return brokers.value.length
})

const totalSales = computed(() => {
  return brokers.value.reduce((sum, broker) => sum + broker.totalSales, 0)
})

const successRate = computed(() => {
  const avg = brokers.value.reduce((sum, broker) => sum + broker.successRate, 0) / brokers.value.length
  return Math.round(avg)
})

const currentQuarter = computed(() => {
  return selectedQuarter.value
})

const currentQuarterLabel = computed(() => {
  const quarter = quarters.value.find(q => q.value === selectedQuarter.value)
  return quarter ? quarter.label : 'Quý hiện tại'
})

const quarterDates = computed(() => {
  const quarterMap = {
    'Q4-2023': '01/10/2023 - 31/12/2023',
    'Q3-2023': '01/07/2023 - 30/09/2023',
    'Q2-2023': '01/04/2023 - 30/06/2023',
    'Q1-2023': '01/01/2023 - 31/03/2023',
    'Q4-2022': '01/10/2022 - 31/12/2022'
  }
  return quarterMap[selectedQuarter.value] || '01/10/2023 - 31/12/2023'
})

const lastUpdateTime = computed(() => {
  const now = new Date()
  return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
})

const filteredBrokers = computed(() => {
  let filtered = [...brokers.value]

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

  // Sort by competition score
  filtered.sort((a, b) => b.competitionScore - a.competitionScore)

  return filtered
})

const top10Brokers = computed(() => {
  let filtered = [...brokers.value]

  // Filter by city if selected
  if (selectedCity.value) {
    filtered = filtered.filter(broker =>
        broker.location === selectedCity.value
    )
  }

  // Sort by competition score and take top 10
  return filtered
      .sort((a, b) => b.competitionScore - a.competitionScore)
      .slice(0, 10)
})

// Pagination computed properties
const totalBrokerPages = computed(() => {
  return Math.ceil(filteredBrokers.value.length / brokersPerPage.value)
})

const currentBrokers = computed(() => {
  const start = (brokersPage.value - 1) * brokersPerPage.value
  const end = start + brokersPerPage.value
  return filteredBrokers.value.slice(start, end)
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

// Methods
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatCurrency = (amount) => {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)} tỷ`
  } else {
    return `${amount} triệu`
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const getRankClass = (index) => {
  if (index === 0) return 'gold'
  if (index === 1) return 'silver'
  if (index === 2) return 'bronze'
  return ''
}

const getScorePercentage = (score) => {
  return (score / 1000) * 100
}

const getScoreClass = (score) => {
  if (score >= 900) return 'score-excellent'
  if (score >= 800) return 'score-good'
  if (score >= 700) return 'score-average'
  return 'score-fair'
}

const showBrokerDetail = (broker) => {
  selectedBroker.value = broker
}

const showCollaborationForm = (broker = null) => {
  if (broker) {
    collaborationForm.value.message = `Tôi muốn hợp tác với môi giới ${broker.name} và tham gia thi đua. ${collaborationForm.value.message}`
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
    alert('Đăng ký hợp tác thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để hướng dẫn tham gia thi đua.')
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

const closeModal = () => {
  selectedBroker.value = null
  showCollaborationModal.value = false
}

const scrollToCompetition = () => {
  setTimeout(() => {
    const competitionSection = document.querySelector('.competition-section')
    if (competitionSection) {
      competitionSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

const scrollToAllBrokers = () => {
  setTimeout(() => {
    const brokersSection = document.querySelector('.brokers-section')
    if (brokersSection) {
      brokersSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, 100)
}

// Lifecycle hook
onMounted(() => {
  console.log('Broker success page with competition mounted')
})
</script>

<style scoped>
.broker-success-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f8f9fa;
  padding: 0;
}

/* Header Styles */
.page-header {
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.page-subtitle {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 2.5rem;
  opacity: 0.95;
  line-height: 1.6;
}

.stats-overview {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3rem;
  margin-top: 2.5rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.95;
  font-weight: 500;
}

/* Main Content */
.page-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Filter Section */
.filter-section {
  margin: 2rem 0;
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
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
  background-color: white;
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
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background-color: white;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #26d0ce;
  box-shadow: 0 0 0 3px rgba(38, 208, 206, 0.2);
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
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
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
  font-weight: 500;
}

.view-toggle-btn.active {
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  color: white;
}

.view-toggle-btn:not(.active):hover {
  background-color: #f8f9fa;
}

/* Competition Section */
.competition-section {
  margin: 3rem 0;
}

.competition-section .section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  padding: 2rem;
  border-radius: 15px;
  color: white;
}

.competition-section .section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.competition-section .section-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0;
}

.competition-period {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-end;
}

.period-badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.1rem;
  backdrop-filter: blur(10px);
}

.quarter-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  opacity: 0.9;
}

/* Rewards Section */
.rewards-section {
  background-color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.rewards-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.reward-card {
  padding: 2rem;
  border-radius: 12px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.reward-card.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFEC8B 100%);
  border-color: #FFD700;
}

.reward-card.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%);
  border-color: #C0C0C0;
}

.reward-card.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #E8C8A9 100%);
  border-color: #CD7F32;
}

.reward-rank {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.reward-rank h4 {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
  color: #333;
}

.medal-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.medal-icon.gold {
  background: radial-gradient(circle at 30% 30%, #FFD700, #B8860B);
  color: #8B7500;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.medal-icon.silver {
  background: radial-gradient(circle at 30% 30%, #C0C0C0, #808080);
  color: #505050;
  box-shadow: 0 4px 15px rgba(192, 192, 192, 0.4);
}

.medal-icon.bronze {
  background: radial-gradient(circle at 30% 30%, #CD7F32, #8B4513);
  color: #5D2906;
  box-shadow: 0 4px 15px rgba(205, 127, 50, 0.4);
}

.reward-details {
  padding-left: 0.5rem;
}

.reward-amount {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a2980;
  margin-bottom: 0.5rem;
}

.reward-desc {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.reward-bonus {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.rewards-note {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #f0f7ff;
  border-radius: 8px;
  color: #1a2980;
  font-size: 0.95rem;
  font-weight: 500;
}

.rewards-note i {
  font-size: 1.2rem;
}

/* Leaderboard */
.leaderboard-container {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.leaderboard-header {
  display: grid;
  grid-template-columns: 80px 2fr 3fr 1.5fr 1fr;
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  font-weight: 600;
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
}

.leaderboard-body {
  max-height: 600px;
  overflow-y: auto;
}

.leaderboard-row {
  display: grid;
  grid-template-columns: 80px 2fr 3fr 1.5fr 1fr;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
  transition: all 0.3s;
  align-items: center;
}

.leaderboard-row:hover {
  background-color: #f8f9fa;
}

.leaderboard-row.gold {
  background-color: rgba(255, 215, 0, 0.05);
  border-left: 4px solid #FFD700;
}

.leaderboard-row.silver {
  background-color: rgba(192, 192, 192, 0.05);
  border-left: 4px solid #C0C0C0;
}

.leaderboard-row.bronze {
  background-color: rgba(205, 127, 50, 0.05);
  border-left: 4px solid #CD7F32;
}

.rank-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
}

.rank-number {
  font-size: 1.5rem;
  font-weight: 800;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.rank-number.gold {
  background-color: #FFD700;
  color: #8B7500;
}

.rank-number.silver {
  background-color: #C0C0C0;
  color: #505050;
}

.rank-number.bronze {
  background-color: #CD7F32;
  color: #5D2906;
}

.rank-medal {
  font-size: 1.8rem;
}

.rank-medal .gold {
  color: #FFD700;
}

.rank-medal .silver {
  color: #C0C0C0;
}

.rank-medal .bronze {
  color: #CD7F32;
}

.broker-info-compact {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.broker-avatar-small {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.broker-avatar-small img {
  width: 100%;
  height: 100%;
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
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  border: 2px solid white;
}

.broker-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.broker-name {
  font-weight: 700;
  color: #1a2980;
  font-size: 1.1rem;
}

.broker-title {
  color: #26d0ce;
  font-weight: 500;
  font-size: 0.9rem;
}

.broker-location {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quarter-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item-compact {
  text-align: center;
}

.stat-item-compact .stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 0.25rem;
}

.stat-item-compact .stat-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.score-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.score-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a2980;
  text-align: center;
}

.score-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex-grow: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.gold {
  background: linear-gradient(90deg, #FFD700, #FFEC8B);
}

.progress-fill.silver {
  background: linear-gradient(90deg, #C0C0C0, #E8E8E8);
}

.progress-fill.bronze {
  background: linear-gradient(90deg, #CD7F32, #E8C8A9);
}

.progress-fill:not(.gold):not(.silver):not(.bronze) {
  background: linear-gradient(90deg, #26d0ce, #1a2980);
}

.score-max {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  min-width: 45px;
}

.trend-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.trend-up {
  color: #28a745;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend-down {
  color: #dc3545;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend-neutral {
  color: #6c757d;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.trend-period {
  font-size: 0.8rem;
  color: #666;
}

.leaderboard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
}

.update-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #666;
  font-size: 0.9rem;
}

.update-info i {
  color: #26d0ce;
}

.btn-view-full {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-view-full:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(26, 41, 128, 0.3);
}

/* Section Styles */
.brokers-section {
  margin: 3rem 0;
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
  font-weight: 800;
  color: #1a2980;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #666;
  font-size: 1.1rem;
  max-width: 800px;
}

.section-stats {
  display: flex;
  align-items: center;
}

.section-stat {
  background-color: #f0f7ff;
  color: #1a2980;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
}

/* Brokers Grid */
.brokers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.broker-card {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #eee;
}

.broker-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.broker-header {
  display: flex;
  padding: 1.5rem;
  background: linear-gradient(90deg, #f8f9fa 0%, white 100%);
  border-bottom: 1px solid #eee;
  position: relative;
}

.broker-avatar {
  position: relative;
  margin-right: 1.5rem;
}

.broker-avatar img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.rank-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 2;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFEC8B 100%);
  color: #8B7500;
  border: 2px solid #FFD700;
}

.rank-badge.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%);
  color: #505050;
  border: 2px solid #C0C0C0;
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #E8C8A9 100%);
  color: #5D2906;
  border: 2px solid #CD7F32;
}

.broker-info {
  flex: 1;
}

.broker-name {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
  color: #1a2980;
}

.broker-title {
  color: #26d0ce;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.broker-location, .broker-experience {
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
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
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a2980;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.broker-quarter-stats {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.quarter-stats-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 1rem;
  text-align: center;
}

.quarter-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.quarter-stat {
  text-align: center;
  padding: 0.75rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.quarter-stat-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1a2980;
  margin-bottom: 0.25rem;
}

.quarter-stat-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
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
  font-size: 0.95rem;
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
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.broker-actions {
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  gap: 0.75rem;
}

.btn-view-profile, .btn-collaborate, .btn-cta-primary, .btn-cta-secondary, .btn-contact, .btn-submit {
  padding: 0.85rem 1.5rem;
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
  border: 2px solid #ddd;
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
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.table-header {
  display: flex;
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  font-weight: 600;
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
  padding: 1.25rem 1rem;
  display: flex;
  align-items: center;
}

.rank-indicator {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  color: #666;
  background-color: #f8f9fa;
}

.rank-indicator.top-rank {
  font-weight: 800;
}

.rank-indicator[data-rank="gold"] {
  background-color: #FFD700;
  color: #8B7500;
}

.rank-indicator[data-rank="silver"] {
  background-color: #C0C0C0;
  color: #505050;
}

.rank-indicator[data-rank="bronze"] {
  background-color: #CD7F32;
  color: #5D2906;
}

.broker-avatar-small {
  position: relative;
  width: 60px;
  height: 60px;
}

.broker-avatar-small img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.rank-badge-small {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  z-index: 2;
}

.rank-badge-small.gold {
  background-color: #FFD700;
  color: #8B7500;
  border: 2px solid white;
}

.rank-badge-small.silver {
  background-color: #C0C0C0;
  color: #505050;
  border: 2px solid white;
}

.rank-badge-small.bronze {
  background-color: #CD7F32;
  color: #5D2906;
  border: 2px solid white;
}

.broker-info-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.broker-name-list {
  font-size: 1.1rem;
  font-weight: 700;
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
  font-weight: 500;
}

.score-badge {
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-weight: 700;
  text-align: center;
  min-width: 60px;
}

.score-excellent {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.score-good {
  background-color: rgba(0, 123, 255, 0.1);
  color: #007bff;
  border: 1px solid rgba(0, 123, 255, 0.3);
}

.score-average {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.score-fair {
  background-color: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.3);
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

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.75rem 1.25rem;
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #1a2980;
  color: #1a2980;
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
  width: 45px;
  height: 45px;
  border-radius: 8px;
  border: 2px solid #ddd;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.pagination-page:hover {
  background-color: #f8f9fa;
  border-color: #1a2980;
  color: #1a2980;
}

.pagination-page.active {
  background-color: #1a2980;
  color: white;
  border-color: #1a2980;
}

.pagination-dots {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 1.5rem;
  color: #666;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #ddd;
}

.no-results p {
  font-size: 1.2rem;
  font-weight: 500;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  padding: 3rem 2rem;
  margin: 3rem 0;
  border-radius: 15px;
}

.cta-content {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.1rem;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
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
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cta-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
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
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

.benefit i {
  color: #FFD700;
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
  border-radius: 15px;
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
  position: relative;
}

.broker-detail-avatar img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #f8f9fa;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.rank-badge-large {
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 800;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
}

.rank-badge-large.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFEC8B 100%);
  color: #8B7500;
  border: 3px solid #FFD700;
}

.rank-badge-large.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%);
  color: #505050;
  border: 3px solid #C0C0C0;
}

.rank-badge-large.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #E8C8A9 100%);
  color: #5D2906;
  border: 3px solid #CD7F32;
}

.broker-detail-info {
  flex: 1;
}

.broker-detail-name {
  font-size: 2rem;
  font-weight: 800;
  color: #1a2980;
  margin-bottom: 0.5rem;
}

.broker-detail-title {
  font-size: 1.3rem;
  color: #26d0ce;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.broker-detail-location, .broker-detail-experience, .broker-detail-score {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.broker-detail-score {
  color: #1a2980;
  font-weight: 500;
}

.broker-detail-score strong {
  color: #26d0ce;
  font-size: 1.1rem;
}

.broker-detail-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.broker-detail-stat {
  text-align: center;
}

.broker-detail-stat .stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a2980;
  margin-bottom: 0.25rem;
}

.broker-detail-stat .stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* Quarter Stats in Detail Modal */
.broker-detail-quarter {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f0f7ff;
  border-radius: 12px;
  border-left: 4px solid #1a2980;
}

.broker-detail-quarter h4 {
  font-size: 1.3rem;
  color: #1a2980;
  margin-bottom: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.quarter-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.quarter-stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.quarter-stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #1a2980;
}

.quarter-stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.quarter-stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a2980;
}

.quarter-stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.broker-detail-bio, .broker-detail-testimonial, .broker-detail-competition-history {
  margin-bottom: 2rem;
}

.broker-detail-bio h4, .broker-detail-testimonial h4, .broker-detail-competition-history h4 {
  font-size: 1.3rem;
  color: #1a2980;
  margin-bottom: 1rem;
  font-weight: 700;
}

.broker-detail-bio p {
  line-height: 1.6;
  color: #555;
  font-size: 1rem;
}

.broker-detail-testimonial blockquote {
  border-left: 4px solid #26d0ce;
  padding-left: 1.5rem;
  font-style: italic;
  color: #555;
  line-height: 1.6;
  margin: 0;
  font-size: 1.05rem;
}

.competition-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1a2980;
}

.history-quarter {
  font-weight: 600;
  color: #1a2980;
  font-size: 1rem;
}

.history-rank {
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.history-rank.gold {
  background-color: rgba(255, 215, 0, 0.2);
  color: #8B7500;
  border: 1px solid #FFD700;
}

.history-rank.silver {
  background-color: rgba(192, 192, 192, 0.2);
  color: #505050;
  border: 1px solid #C0C0C0;
}

.history-rank.bronze {
  background-color: rgba(205, 127, 50, 0.2);
  color: #5D2906;
  border: 1px solid #CD7F32;
}

.history-rank:not(.gold):not(.silver):not(.bronze) {
  background-color: rgba(38, 208, 206, 0.2);
  color: #1a7775;
  border: 1px solid #26d0ce;
}

.history-score {
  font-weight: 600;
  color: #666;
  font-size: 0.95rem;
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
  font-weight: 600;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-contact:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

/* Collaboration Form */
.collaboration-form {
  max-width: 700px;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a2980;
  text-align: center;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.05rem;
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
  font-size: 0.95rem;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background-color: white;
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
  color: #555;
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
  padding: 3rem 2rem 1.5rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1400px;
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
  font-weight: 700;
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
  font-size: 0.95rem;
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
  font-size: 0.95rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .page-content {
    padding: 0 1rem;
  }

  .brokers-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  .rewards-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .page-title {
    font-size: 2.2rem;
  }

  .stats-overview {
    gap: 2rem;
  }

  .stat-value {
    font-size: 2.2rem;
  }

  .leaderboard-header, .leaderboard-row {
    grid-template-columns: 60px 1.5fr 2fr 1fr 0.8fr;
  }

  .quarter-stats {
    flex-direction: column;
    gap: 0.75rem;
  }

  .brokers-table, .leaderboard-body {
    overflow-x: auto;
  }

  .table-header, .table-row {
    min-width: 1000px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 2rem 1rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .stats-overview {
    gap: 1.5rem;
  }

  .stat-value {
    font-size: 1.8rem;
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
    align-items: stretch;
    gap: 0.75rem;
  }

  .competition-section .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .competition-period {
    align-items: flex-start;
  }

  .broker-header {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
  }

  .broker-avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }

  .broker-actions, .broker-detail-actions, .cta-buttons {
    flex-direction: column;
  }

  .broker-detail-header {
    flex-direction: column;
    text-align: center;
  }

  .broker-detail-avatar {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }

  .broker-detail-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .leaderboard-header, .leaderboard-row {
    grid-template-columns: 50px 1fr 1fr 1fr;
  }

  .leaderboard-col.stats {
    display: none;
  }

  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 2rem;
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

  .cta-title {
    font-size: 1.6rem;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .broker-detail-stats {
    grid-template-columns: 1fr;
  }

  .quarter-stats-grid {
    grid-template-columns: 1fr;
  }

  .leaderboard-header, .leaderboard-row {
    grid-template-columns: 40px 1fr 1fr;
  }

  .leaderboard-col.score {
    display: none;
  }

  .table-header, .table-row {
    min-width: 800px;
  }
}
</style>