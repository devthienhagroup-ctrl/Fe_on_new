<template>
  <div class="broker-success-page">
    <!-- Header section -->
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Đối Tác Môi Giới Thành Công</h1>
        <p class="page-subtitle">
          Khám phá câu chuyện thành công từ mạng lưới đối tác môi giới và tham gia bảng thi đua hàng tháng
        </p>
        <div class="stats-overview">
          <div class="stat-item">
            <div class="stat-value">{{ formatNumber(totalBrokers) }}+</div>
            <div class="stat-label">Môi giới đã hợp tác</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ formatCurrency(totalTransactionValue) }}</div>
            <div class="stat-label">Tổng giá trị giao dịch</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ currentMonthLabel }}</div>
            <div class="stat-label">Tháng thi đua hiện tại</div>
          </div>
        </div>
      </div>
    </header>

    <main class="page-content">
      <!-- Top 10 Competition Section -->
      <section class="competition-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              <i class="fas fa-trophy"></i> BẢNG THI ĐUA TOP 10 MÔI GIỚI XUẤT SẮC
            </h2>
            <p class="section-subtitle">
              Thống kê thành tích thi đua theo tháng - Top 3 nhận giải thưởng tiền mặt và huy chương
            </p>
          </div>
          <div class="competition-period">
            <span class="period-badge">{{ currentMonthLabel }}</span>
            <div class="quarter-info">
              <i class="fas fa-calendar-alt"></i>
              <span>Thời gian: {{ monthDates }}</span>
            </div>
            <div class="competition-filter">
              <label class="competition-filter-label" for="competitionCity">Khu vực</label>
              <select id="competitionCity" v-model="competitionCity" class="filter-select area-filter" @change="handleCompetitionCityChange">
                <option value="">Toàn quốc</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Competition Rewards Info -->
        <div class="rewards-section">
          <h3 class="rewards-title">
            <i class="fas fa-gift"></i> {{ rewardTitle }}
          </h3>
          <div class="rewards-grid">
            <div
                v-for="reward in activeRewardPolicy"
                :key="reward.rank"
                class="reward-card"
                :class="reward.rank === 1 ? 'gold' : reward.rank === 2 ? 'silver' : 'bronze'"
            >
              <div class="reward-rank">
                <div class="medal-icon" :class="reward.rank === 1 ? 'gold' : reward.rank === 2 ? 'silver' : 'bronze'">
                  <i v-if="reward.rank === 1" class="fas fa-crown"></i>
                  <i v-else class="fas fa-medal"></i>
                </div>
                <h4>{{ reward.title }}</h4>
              </div>

              <div class="reward-details">
                <div class="reward-amount">
                  {{ formatCurrency(reward.amount) }}
                </div>

                <div
                    v-for="c in reward.conditions"
                    :key="c.id"
                    class="reward-desc"
                >
                  <i class="fas fa-check-circle me-1"></i>
                  {{ c.text }}
                </div>
              </div>
            </div>
          </div>
          <div class="rewards-note">
            <i class="fas fa-info-circle"></i>
            <span>Giải thưởng được trao vào cuối mỗi tháng dựa trên tổng doanh số và số lượng BĐS đã bán</span>
          </div>
        </div>

        <!-- Mobile Leaderboard (for small screens) -->
        <div class="mobile-leaderboard" v-if="isMobile && top10Brokers.length > 0">
          <div class="mobile-leaderboard-container">
            <div
                v-for="broker in top10Brokers"
                :key="broker.brokerId"
                :class="['mobile-leaderboard-item', getRankClass(broker.rank)]"
            >
              <div class="mobile-rank-info">
                <div class="mobile-rank-number">
                  <div v-if="broker.rank === 1" class="top-rank-mobile gold">
                    <i class="fas fa-crown"></i>
                    <div class="rank-number-mobile">1</div>
                  </div>
                  <div v-else-if="broker.rank === 2" class="top-rank-mobile silver">
                    <i class="fas fa-medal"></i>
                    <div class="rank-number-mobile">2</div>
                  </div>
                  <div v-else-if="broker.rank === 3" class="top-rank-mobile bronze">
                    <i class="fas fa-medal"></i>
                    <div class="rank-number-mobile">3</div>
                  </div>
                  <div v-else class="rank-number-mobile-regular">
                    {{ broker.rank }}
                  </div>
                </div>

                <div class="mobile-broker-avatar">
                  <img
                      :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' + (broker.avatar == null ? 'vat-default.jpg':broker.avatar)"
                      :alt="broker.name"
                  />
                </div>

                <div class="mobile-broker-info">
                  <div class="mobile-broker-name">{{ broker.name }}</div>
                  <div class="mobile-broker-location">
                    <i class="fas fa-map-marker-alt"></i> {{ broker.location }}
                  </div>
                </div>
              </div>

              <div class="mobile-month-stats">
                <div class="mobile-month-stat-item">
                  <div class="mobile-month-stat-value">{{ broker.monthStats.propertiesSold }}</div>
                  <div class="mobile-month-stat-label">BĐS đã bán</div>
                </div>
                <div class="mobile-month-stat-item">
                  <div class="mobile-month-stat-value doanh-so">{{ formatCurrency(broker.monthStats.totalSales) }}</div>
                  <div class="mobile-month-stat-label">{{ formatCurrencyFull(broker.monthStats.totalSales) }}</div>
                </div>
                <div class="mobile-trend-compact">
                  <div v-if="broker.trend && broker.trend.type === 'up'" class="trend-up">
                    <i class="fas fa-arrow-up"></i> +{{ broker.trend.change }}
                  </div>
                  <div v-else-if="broker.trend && broker.trend.type === 'down'" class="trend-down">
                    <i class="fas fa-arrow-down"></i> -{{ broker.trend.change }}
                  </div>
                  <div v-else-if="broker.trend && broker.trend.type === 'new'" class="trend-new">
                    <i class="fas fa-star"></i>
                  </div>
                  <div v-else class="trend-neutral">
                    <i class="fas fa-minus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Leaderboard (for larger screens) -->
        <div v-else-if="!isMobile && top10Brokers.length > 0" class="leaderboard-container">
          <div class="leaderboard-header">
            <div class="leaderboard-col rank text-center">HẠNG</div>
            <div class="leaderboard-col broker">MÔI GIỚI</div>
            <div class="leaderboard-col stats text-start">SỐ LƯỢNG BĐS ĐÃ BÁN</div>
            <div class="leaderboard-col">DOANH SỐ</div>
            <div class="leaderboard-col trend">XU HƯỚNG</div>
          </div>

          <div class="leaderboard-body">
            <div
                v-for="broker in top10Brokers"
                :key="broker.brokerId"
                :class="['leaderboard-row', getRankClass(broker.rank)]"
            >
              <div class="leaderboard-col rank" data-label="Hạng">
                <div class="rank-display">
                  <div v-if="broker.rank === 1" class="top-rank-large gold">
                    <i class="fas fa-crown"></i>
                    <div class="rank-number-large">1</div>
                  </div>
                  <div v-else-if="broker.rank === 2" class="top-rank-large silver">
                    <i class="fas fa-medal"></i>
                    <div class="rank-number-large">2</div>
                  </div>
                  <div v-else-if="broker.rank === 3" class="top-rank-large bronze">
                    <i class="fas fa-medal"></i>
                    <div class="rank-number-large">3</div>
                  </div>
                  <div v-else class="rank-number-regular">
                    {{ broker.rank }}
                  </div>
                </div>
              </div>

              <div class="leaderboard-col broker" data-label="Môi giới">
                <div class="broker-info-compact">
                  <div class="broker-avatar-small">
                    <img
                        :src="'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/' +  (broker.avatar == null ? 'vat-default.jpg':broker.avatar)"
                        :alt="broker.name"
                    />
                  </div>
                  <div class="broker-details">
                    <div class="broker-name">{{ broker.name }}</div>
                    <div class="broker-location">
                      <i class="fas fa-map-marker-alt"></i> {{ broker.location }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="leaderboard-col stats" data-label="Thống kê tháng">
                <div class="month-stats-grid">
                  <div class="month-stat-item">
                    <div class="month-stat-value">{{ broker.monthStats.propertiesSold }}</div>
                    <div class="month-stat-label">BĐS đã bán</div>
                  </div>
                </div>
              </div>

              <div class="leaderboard-col stats" data-label="Thống kê tháng">
                <div class="month-stat-item">
                  <div class="month-stat-value">{{ formatCurrency(broker.monthStats.totalSales) }}</div>
                  <div class="month-stat-label">{{ formatCurrencyFull(broker.monthStats.totalSales) }}</div>
                </div>
              </div>

              <div class="leaderboard-col trend" data-label="Xu hướng">
                <div class="trend-display" v-if="broker.trend">
                  <div v-if="broker.trend.type === 'up'" class="trend-up">
                    <i class="fas fa-arrow-up"></i> +{{ broker.trend.change }} hạng
                  </div>
                  <div v-else-if="broker.trend.type === 'down'" class="trend-down">
                    <i class="fas fa-arrow-down"></i> -{{ broker.trend.change }} hạng
                  </div>
                  <div v-else-if="broker.trend.type === 'new'" class="trend-new">
                    <i class="fas fa-star"></i> Mới
                  </div>
                  <div v-else class="trend-neutral">
                    <i class="fas fa-minus"></i> Giữ nguyên
                  </div>
                  <div class="trend-period">so với tháng trước</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="top10Brokers.length === 0" class="no-results">
          <i class="fas fa-chart-bar"></i>
          <p>Không có dữ liệu xếp hạng cho tháng này</p>
        </div>
      </section>

      <!-- All Brokers section -->
      <section class="brokers-section" id="all-brokers">
        <div class="filter-section">
          <div class="filter-controls">
            <div class="search-box">
              <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Tìm kiếm tên, sđt, email ..."
                  class="search-input"
                  @input="handleSearchChange"
              />
              <span class="search-icon">
                <i class="fas fa-search"></i>
              </span>
            </div>

            <div class="filter-options">
              <select v-model="selectedCity" class="filter-select" @change="handleCityChange">
                <option value="">Tất cả tỉnh/thành</option>
                <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
              </select>
            </div>
          </div>

          <!-- View Toggle for Brokers -->
          <div class="view-toggle-section" v-if="!isMobile">
            <h3 class="view-toggle-title">Chế độ xem:</h3>
            <div class="view-toggle">
              <button
                  :class="['view-toggle-btn', { active: brokerViewMode === 'grid' }]"
                  @click="brokerViewMode = 'grid'"
              >
                <i class="fas fa-th-large"></i> Lưới
              </button>
              <button
                  :class="['view-toggle-btn', { active: brokerViewMode === 'table' }]"
                  @click="brokerViewMode = 'table'"
              >
                <i class="fas fa-list"></i> Bảng
              </button>
            </div>
          </div>
        </div>

        <div class="section-header">
          <div>
            <h2 class="section-title">Tất Cả Môi Giới Đã Hợp Tác</h2>
            <p class="section-subtitle">
              Những môi giới đã đồng hành cùng chúng tôi và đạt được thành tích ấn tượng
            </p>
          </div>
          <div class="section-stats">
            <span class="section-stat">Hiển thị {{ brokers.length }} / {{ totalBrokers }} môi giới</span>
          </div>
        </div>

        <!-- Grid View for Brokers -->
        <div v-if="(brokerViewMode === 'grid' || isMobile) && brokers.length > 0" class="brokers-compact-grid">
          <div
              v-for="broker in brokers"
              :key="broker.id"
              class="broker-compact-card"
              @click="showBrokerDetail(broker)"
          >
            <div class="broker-compact-header">
              <div class="broker-compact-avatar">
                <img :src="getAvatarUrl(broker.avatar)" :alt="broker.name" />
                <div class="verification-badge" v-if="broker.verified">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div v-if="broker.topRank" :class="['rank-badge-compact', broker.topRank]">
                  <i v-if="broker.topRank === 'gold'" class="fas fa-crown"></i>
                  <i v-else class="fas fa-medal"></i>
                </div>
              </div>
              <div class="broker-compact-info">
                <div class="broker-name-compact">{{ displayName(broker.name) }}</div>
                <div class="broker-details-compact">
                  <span class="broker-location-compact">
                    <i class="fas fa-map-marker-alt"></i> {{ formatProvinceShort(broker.location) }}
                  </span>
                  <span class="broker-experience-compact">
                    <i class="fas fa-briefcase"></i> {{ broker.experience || 'Chưa có' }}
                  </span>
                </div>
              </div>
            </div>

            <div class="broker-compact-quote">
              <span class="quote-text"><i class="fas fa-quote-left"></i> {{ broker.bio || 'Không có châm ngôn' }} <i class="fas fa-quote-right"></i> </span>
            </div>

            <div class="broker-compact-stats">
              <div class="compact-stat-row">
                <div class="compact-stat-item">
                  <div class="compact-stat-value">{{ broker.totalSold || 0 }}</div>
                  <div class="compact-stat-label">BĐS đã bán</div>
                </div>
                <div class="compact-stat-item">
                  <div class="compact-stat-value">{{ formatCurrency(broker.totalSales) }}</div>
                  <div class="compact-stat-label">Tổng doanh số</div>
                </div>
              </div>

              <div class="compact-contact-info">
                <div class="compact-contact-item">
                  <i class="fas fa-envelope"></i>
                  <span class="compact-contact-text">
                      {{ broker.email || 'Chưa có email' }}
                    </span>
                                </div>

                                <div class="compact-contact-item">
                                  <i class="fas fa-phone-alt"></i>
                                  <span class="compact-contact-text">
                      {{ broker.phone || 'Chưa có SĐT' }}
                    </span>
                </div>
              </div>
            </div>

            <div class="broker-compact-tags">
              <span class="broker-tag-compact" v-for="tag in broker.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- Table View for Brokers -->
        <div v-if="brokerViewMode === 'table' && !isMobile && brokers.length > 0" class="brokers-table-view">
          <div class="brokers-table-container">
            <div class="brokers-table">

              <!-- HEADER -->
              <div class="table-header">
                <div class="table-cell" style="width: 50px">STT</div>
                <div class="table-cell" style="width: 60px">Ảnh</div>
                <div class="table-cell" style="flex: 1.7">Thông tin</div>
                <div class="table-cell" style="flex: 1.4">Liên hệ</div>
                <div class="table-cell" style="flex: 1.7">Châm ngôn</div>
                <div class="table-cell" style="flex: 0.7">BĐS đã bán</div>
                <div class="table-cell" style="flex: 1">Doanh số</div>
              </div>

              <div
                  v-for="(broker, index) in brokers"
                  :key="broker.id"
                  class="table-row"
                  @click="showBrokerDetail(broker)"
              >
                <div class="table-cell" style="width: 50px">
                  <div class="table-index">
                    {{ (brokersPage - 1) * brokersPerPage + index + 1 }}
                  </div>
                </div>

                <div class="table-cell" style="width: 60px">
                  <div class="table-avatar">
                    <img :src="getAvatarUrl(broker.avatar)" :alt="broker.name" />
                  </div>
                </div>

                <div class="table-cell" style="flex: 1.7">
                  <div class="table-broker-info">
                    <h4 class="table-broker-name">{{ broker.name }}</h4>
                    <div class="table-broker-location">
                      <i class="fas fa-map-marker-alt"></i> {{ broker.location }}
                    </div>
                    <div class="table-broker-experience">
                      <i class="fas fa-briefcase"></i>
                      {{ broker.experience || 'Chưa có kinh nghiệm' }}
                    </div>
                  </div>
                </div>

                <div class="table-cell" style="flex: 1.4">
                  <div class="table-broker-contact">
                    <div class="broker-contact-item">
                      <i class="fas fa-phone-alt"></i>
                      <span>{{ broker.phone || 'Chưa có SĐT' }}</span>
                    </div>
                    <div class="broker-contact-item">
                      <i class="fas fa-envelope"></i>
                      <span>{{ broker.email || 'Chưa có email' }}</span>
                    </div>
                  </div>
                </div>

                <div class="table-cell pe-4" style="flex: 1.7">
                  <div class="table-broker-motto">
                    <i class="fas fa-quote-left"></i>
                    {{ broker.bio || 'Không có châm ngôn' }}
                    <i class="fas fa-quote-right"></i>
                  </div>
                </div>

                <div class="table-cell" style="flex: 0.7">
                  <div class="table-stat">
                    <div class="table-stat-value">{{ broker.totalSold || 0 }} căn</div>
                    <div class="table-stat-label">BĐS đã bán</div>
                  </div>
                </div>

                <div class="table-cell" style="flex: 1">
                  <div class="table-stat">
                    <div class="table-stat-value">
                      {{ formatCurrency(broker.totalSales) }}
                    </div>
                    <div class="table-stat-label">
                      {{ formatCurrencyFull(broker.totalSales) }}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>


        <div v-if="brokers.length === 0 && !loading" class="no-results">
          <i class="fas fa-user-slash"></i>
          <p>Không tìm thấy môi giới phù hợp với tiêu chí tìm kiếm</p>
        </div>

        <!-- Pagination for Brokers -->
        <!-- Trong template, thay phần pagination hiện tại bằng: -->
        <!-- Pagination for Brokers -->
        <div v-if="brokers.length > 0 && totalBrokerPages > 1" class="pagination">
          <button
              class="pagination-btn"
              :disabled="brokersPage === 1"
              @click="brokersPage--"
          >
            <i class="fas fa-chevron-left"></i> <span v-if="!isMobile">Trước</span>
          </button>

          <div class="pagination-info" v-if="isMobile">
            <span class="current-page">{{ brokersPage }}</span>
            <span class="total-pages">/{{ totalBrokerPages }}</span>
          </div>

          <div v-else class="pagination-pages">
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
            <span v-if="!isMobile">Sau</span> <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Tham Gia Bảng Thi Đua Và Nhận Giải Thưởng Giá Trị!</h2>
          <p class="cta-description">
            Trở thành đối tác môi giới để cạnh tranh trong bảng xếp hạng hàng tháng, nhận giải thưởng tiền mặt,
            cúp vàng và nhiều phần thưởng hấp dẫn khác.
          </p>
          <div class="cta-buttons">
            <button class="btn-cta-primary" @click="scrollToCompetition">
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
              <span>Thi đua hàng tháng với cơ hội thăng hạng</span>
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
                <img :src="getAvatarUrl(selectedBroker.avatar)" :alt="selectedBroker.name" />
              </div>
              <div class="broker-detail-info">
                <h3 class="broker-detail-name">{{ selectedBroker.name }}</h3>
                <div class="broker-detail-grid">
                  <!-- Cột trái -->
                  <div class="broker-detail-col">
                    <div class="broker-detail-item">
                      <i class="fas fa-map-marker-alt icon-location"></i>
                      {{ selectedBroker.location }}
                    </div>

                    <div class="broker-detail-item">
                      <i class="fas fa-briefcase icon-exp"></i>
                      {{ selectedBroker.experience || 'Chưa có kinh nghiệm' }}
                    </div>
                  </div>

                  <!-- Cột phải -->
                  <div class="broker-detail-col">
                    <div class="broker-detail-item">
                      <i class="fas fa-phone-alt icon-phone"></i>
                      {{ selectedBroker.phone || 'Chưa có SĐT' }}
                    </div>

                    <div class="broker-detail-item">
                      <i class="fas fa-envelope icon-email"></i>
                      {{ selectedBroker.email || 'Chưa có email' }}
                    </div>
                  </div>
                </div>
                <div class="broker-detail-motto">
                  <i class="fas fa-quote-left"></i> {{ selectedBroker.bio || 'Không có châm ngôn' }} <i class="fas fa-quote-right"></i>
                </div>
              </div>
            </div>

            <!-- Month Stats -->
            <div class="broker-detail-month">
              <h4>
                <i class="fas fa-chart-bar"></i>
                Thống kê
              </h4>
              <div class="month-stats-grid">
                <div class="month-stat-card">
                  <div class="month-stat-icon">
                    <i class="fas fa-home"></i>
                  </div>
                  <div class="month-stat-content">
                    <div class="month-stat-value">{{ selectedBroker.totalSold || 0 }}</div>
                    <div class="month-stat-label">BĐS đã bán</div>
                  </div>
                </div>
                <div class="month-stat-card">
                  <div class="month-stat-icon">
                    <i class="fas fa-money-bill-wave"></i>
                  </div>
                  <div class="month-stat-content">
                    <div class="month-stat-value">{{ formatCurrency(selectedBroker.totalSales || 0) }}</div>
                    <div class="month-stat-label">Doanh số tháng</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="broker-detail-bio">
              <h4>Giới thiệu</h4>
              <p>{{ selectedBroker.bio || 'Không có thông tin giới thiệu' }}</p>
            </div>

            <div class="broker-detail-tags">
              <h4>Các khu vực tham gia</h4>
              <div class="detail-tags">
                <span class="detail-tag" v-for="tag in selectedBroker.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>

            <!-- Sold Projects Section -->
            <div class="broker-sold-projects" v-if="selectedBroker.soldProjects && selectedBroker.soldProjects.length > 0">
              <h4>
                <i class="fas fa-building"></i>
                Dự án đã bán thành công
              </h4>
              <div class="sold-projects-grid">
                <div v-for="project in selectedBroker.soldProjects.slice(0, 3)" :key="project.name" class="sold-project-card">
                  <div class="project-title">{{  formatAddress(project.name) }}</div>
                  <div class="project-type">{{ formatLoai( project.type) }}</div>
                  <div class="project-value">
                    <i class="fas fa-coins"></i> {{ formatCurrency(project.value) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Competition History Section -->
            <div class="broker-competition-history" v-if="selectedBroker.competitionHistory && selectedBroker.competitionHistory.length > 0">
              <h4>
                <i class="fas fa-history"></i>
                Lịch sử thi đua
              </h4>
              <div class="competition-history-table">
                <div class="history-header">
                  <div class="history-col">Tháng</div>
                  <div class="history-col">Hạng</div>
                  <div class="history-col">Số căn bán</div>
                  <div class="history-col">Doanh số</div>
                </div>
                <div
                    v-for="history in selectedBroker.competitionHistory.slice(0, 6)"
                    :key="history.month"
                    class="history-row"
                >
                  <div class="history-col">Tháng {{ history.month }}</div>
                  <div class="history-col">
                    <span :class="['history-rank', getRankClass(history.rank - 1)]">
                      {{ history.rank }}
                    </span>
                  </div>
                  <div class="history-col">{{ history.propertiesSold }} căn</div>
                  <div class="history-col">{{ formatCurrency(history.sales) }}</div>
                </div>
              </div>
            </div>
          </div>
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
            <li><a href="#">Giải thưởng hàng tháng</a></li>
            <li><a href="#">Tiêu chí xếp hạng</a></li>
            <li><a href="#">Lịch sử thi đua</a></li>
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import api from "../../../api/api.js";
import {showCenterError} from "../../../assets/js/alertService.js";
const displayName = (fullName) => {
  if (!fullName) return ''

  const MAX_LENGTH = 13
  const parts = fullName.trim().split(/\s+/)

  // tên ngắn hoặc chỉ 1 từ → giữ nguyên
  if (fullName.length <= MAX_LENGTH || parts.length === 1) {
    return fullName
  }

  // giữ tên (từ cuối)
  const lastName = parts[parts.length - 1]

  // gộp chữ cái đầu của họ + đệm
  const initials = parts
      .slice(0, -1)
      .map(p => p.charAt(0).toUpperCase())
      .join('')

  return `${initials}. ${lastName}`
}

const formatLoai = (loai) => {
  if (!loai) return "Không rõ";
  switch (loai.toUpperCase()) {
    case "NHA":
      return "Nhà";
    case "DAT":
      return "Đất";
    case "DATLON":
      return "Đất lớn";
    default:
      return loai;
  }
};

function formatAddress(address) {
  if (!address) return "";
  return address.replace(/\s*\/!!\s*/g, ", ");
}

// Reactive state
const totalTransactionValue = ref(0);
const totalBrokers = ref(0);
const brokers = ref([]);
const top10Brokers = ref([]);
const nationalPolicy = ref([]);
const provincePolicy = ref([]);
const searchQuery = ref('');
const selectedCity = ref('');
const selectedMonth = ref('');
const selectedBroker = ref(null);
const competitionCity = ref('');
const isMobile = ref(false);
const brokerViewMode = ref('grid');
const loading = ref(false);

// Pagination
const brokersPage = ref(1);
const brokersPerPage = ref(8);
const totalBrokerPages = ref(0);

const formatProvinceShort = (province) => {
  if (!province || typeof province !== "string") return province || "";
  return province
      .replace(/^Thành phố\s+/i, "Tp.")
      .replace(/^Tỉnh\s+/i, "T.");
};

// Policy mode
const policyMode = ref('NATIONAL');

// Cities data
import address from "/src/assets/js/address.json";
const cities = computed(() => address.map(item => item.name));

// Helper functions
const getCurrentMonthValue = () => {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${month}-${year}`
}

const getAvatarUrl = (avatar) => {
  if (!avatar) {
    return 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public/vat-default.jpg';
  }
  return `https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${avatar}`;
}
// Computed properties
const currentMonthLabel = computed(() => {
  if (!selectedMonth.value) {
    const now = new Date();
    return `Tháng ${now.getMonth() + 1} - ${now.getFullYear()}`;
  }
  const [month, year] = selectedMonth.value.split('-');
  return `Tháng ${month} - ${year}`;
});

const monthDates = computed(() => {
  if (!selectedMonth.value) return '';

  const [month, year] = selectedMonth.value.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const format = (d) =>
      `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`

  return `${format(start)} - ${format(end)}`;
});

const isNational = computed(() => !competitionCity.value);

const activeRewardPolicy = computed(() => {
  return isNational.value
      ? nationalPolicy.value
      : provincePolicy.value
});

const rewardTitle = computed(() => {
  return isNational.value
      ? 'GIẢI THƯỞNG TOP 3 TOÀN QUỐC'
      : 'GIẢI THƯỞNG TOP 3 MỖI KHU VỰC'
});

const brokerPages = computed(() => {
  const pages = [];
  const total = totalBrokerPages.value;
  const current = brokersPage.value;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total);
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total);
    }
  }

  return pages;
});

// API functions
const loadPolicy = async () => {
  try {
    const res = await api.get('/thg/public/moi-gioi/thuong-hang', {
      params: { type: policyMode.value }
    });

    const mapped = res.data.map(item => ({
      rank: item.thuHang,
      title: item.tieuDe,
      amount: item.soTienThuong,
      conditions: (item.moTaHangThuongs || []).map(m => ({
        id: m.id,
        text: m.noiDungMoTa
      }))
    }));

    if (policyMode.value === 'NATIONAL') {
      nationalPolicy.value = mapped;
    } else {
      provincePolicy.value = mapped;
    }
  } catch (e) {
    console.error(e);
    showCenterError('Không tải được chính sách thưởng');
  }
};

const loadBangMoiGioi = async () => {
  try {
    loading.value = true;
    const res = await api.get('/thg/public/moi-gioi/bang-moi-gioi', {
      params: {
        pageNo: brokersPage.value,
        pageSize: brokersPerPage.value,
        search: searchQuery.value || null,
        province: selectedCity.value || null
      }
    });

    brokers.value = res.data.content || [];
    totalBrokerPages.value = res.data.page.totalPages;

  } catch (e) {
    console.error(e);
    showCenterError('Không tải được bảng môi giới');
  } finally {
    loading.value = false;
  }
};

const loadThongKeHeader = async () => {
  try {
    const res = await api.get('/thg/public/moi-gioi/thong-ke');
    totalBrokers.value = res.data.soLuongMG;
    totalTransactionValue.value = res.data.tongTienGD;
  } catch (e) {
    console.error(e);
    showCenterError('Không tải được thống kê tổng quan');
  }
};

const loadRanking = async () => {
  try {
    const [month, year] = selectedMonth.value.split('-');
    const res = await api.get('/thg/public/moi-gioi/ranking', {
      params: {
        month,
        year,
        province: competitionCity.value || null
      }
    });

    top10Brokers.value = res.data.top10 || [];
  } catch (e) {
    console.error(e);
    showCenterError('Không tải được bảng xếp hạng');
  }
};

// Event handlers
const handleCompetitionCityChange = async () => {
  if (!competitionCity.value) {
    policyMode.value = 'NATIONAL';
  } else {
    policyMode.value = 'PROVINCE';
  }
  await loadPolicy();
  await loadRanking();
};

const handleSearchChange = () => {
  brokersPage.value = 1;
  loadBangMoiGioi();
};

const handleCityChange = () => {
  brokersPage.value = 1;
  loadBangMoiGioi();
};

// Utility functions
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatCurrency = (amount) => {
  if (!amount) return '0 đ';

  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  }

  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)} triệu`;
  }

  return `${amount.toLocaleString('vi-VN')} đ`;
};

const formatCurrencyFull = (amount) => {
  if (!amount) return '0 VNĐ';

  return (
      new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 0
      }).format(amount) + ' vnđ'
  );
};

const getRankClass = (rank) => {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return '';
};

const showBrokerDetail = (broker) => {
  selectedBroker.value = broker;
};

const closeModal = () => {
  selectedBroker.value = null;
};

const scrollToCompetition = () => {
  setTimeout(() => {
    const competitionSection = document.querySelector('.competition-section');
    if (competitionSection) {
      competitionSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    brokerViewMode.value = 'grid';
  }
};

// Watchers
watch([brokersPage], async () => {
  await loadBangMoiGioi();
});

watch([selectedMonth, competitionCity], async () => {
  await loadRanking();
}, { immediate: false });

watch(policyMode, async () => {
  await loadPolicy();
});

// Lifecycle hooks
onMounted(async () => {
  handleResize();
  window.addEventListener('resize', handleResize);

  // Initialize selected month
  selectedMonth.value = getCurrentMonthValue();

  // Load initial data
  await Promise.all([
    loadThongKeHeader(),
    loadPolicy(),
    loadRanking(),
    loadBangMoiGioi()
  ]);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
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
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.06);
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: center;
  margin-bottom: 1.25rem;
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 1rem 1.25rem 1rem 3.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1.1rem;
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
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  color: #777;
  font-size: 1.1rem;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: center;
}

.filter-select {
  padding: 1rem 1.25rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1.1rem;
  background-color: white;
  min-width: 220px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #26d0ce;
  box-shadow: 0 0 0 3px rgba(38, 208, 206, 0.2);
}

.competition-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.competition-filter-label {
  font-weight: 600;
  color: white;
  font-size: 1.1rem;
}

.area-filter {
  min-width: 240px;
}

/* View Toggle */
.view-toggle-section {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #eee;
}

.view-toggle-title {
  font-size: 1.2rem;
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
  padding: 0.85rem 1.75rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
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
  gap: 1.25rem;
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  padding: 2rem;
  border-radius: 15px;
  color: white;
}

.competition-section .section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.competition-section .section-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0;
  line-height: 1.6;
}

.competition-period {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
}

.period-badge {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.75rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1.2rem;
  backdrop-filter: blur(10px);
}

.quarter-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
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
  font-size: 1.7rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 1.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.75rem;
  margin-bottom: 1.75rem;
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
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.reward-rank h4 {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  color: #333;
}

.medal-icon {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
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
  padding-left: 0.75rem;
}

.reward-amount {
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a2980;
  margin-bottom: 0.75rem;
}

.reward-desc {
  font-size: 1.2rem;
  color: #444;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.reward-bonus {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
}

.rewards-note {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background-color: #f0f7ff;
  border-radius: 8px;
  color: #1a2980;
  font-size: 1.05rem;
  font-weight: 500;
}

.rewards-note i {
  font-size: 1.3rem;
}

/* Mobile Leaderboard */
.mobile-leaderboard {
  display: none;
}

@media (max-width: 768px) {
  .mobile-leaderboard {
    display: block;
  }

  .leaderboard-container {
    display: none;
  }

  .mobile-leaderboard-container {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    background-color: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  }

  .mobile-leaderboard-item {
    padding: 1.25rem;
    border-bottom: 1px solid #eee;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* GOLD → XANH DƯƠNG */
  .mobile-leaderboard-item.gold {
    background-color: rgba(59, 130, 246, 0.06); /* blue */
    border-left: 4px solid #3B82F6;
  }

  /* SILVER → TÍM */
  .mobile-leaderboard-item.silver {
    background-color: rgba(139, 92, 246, 0.06); /* purple */
    border-left: 4px solid #8B5CF6;
  }

  /* BRONZE → XANH LÁ */
  .mobile-leaderboard-item.bronze {
    background-color: rgba(34, 197, 94, 0.06); /* green */
    border-left: 4px solid #22C55E;
  }


  .mobile-rank-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mobile-rank-number {
    width: 45px;
    text-align: center;
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

  .mobile-broker-avatar {
    position: relative;
    width: 60px;
    height: 60px;
  }

  .mobile-broker-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid white;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }

  .mobile-rank-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    border: 2px solid white;
  }

  .mobile-rank-badge.gold {
    background-color: #FFD700;
    color: #8B7500;
  }

  .mobile-rank-badge.silver {
    background-color: #C0C0C0;
    color: #505050;
  }

  .mobile-rank-badge.bronze {
    background-color: #CD7F32;
    color: #5D2906;
  }

  .mobile-broker-info {
    flex: 1;
    min-width: 0;
  }

  .mobile-broker-name {
    font-weight: 700;
    color: #1a2980;
    font-size: 1.2rem;
    margin-bottom: 0.35rem;
  }

  .mobile-broker-location {
    font-size: 1rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mobile-trend-compact {
    margin-left: auto;
    padding-left: 0.75rem;
  }

  .mobile-trend-compact .trend-up {
    color: #28a745;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 1rem;
  }

  .mobile-trend-compact .trend-down {
    color: #dc3545;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 1rem;
  }

  .mobile-trend-compact .trend-neutral {
    color: #6c757d;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 1rem;
  }

  .mobile-stats-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    gap: 0.75rem;
  }

  .mobile-stat-item {
    text-align: center;
    flex: 1;
  }

  .mobile-stat-value {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1a2980;
    margin-bottom: 0.3rem;
  }

  .mobile-stat-label {
    font-size: 0.95rem;
    color: #666;
    font-weight: 500;
  }
}

/* Desktop Leaderboard */
.leaderboard-container {
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

/* CSS cho bảng sếp hạng mới - 5 cột */
.leaderboard-header {
  display: grid;
  grid-template-columns: 100px 1.5fr 1.5fr 1.2fr 1fr; /* 5 cột */
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  font-weight: 600;
  padding: 1.5rem;
  font-size: 1.1rem;
  align-items: center;
}

.leaderboard-body {
  max-height: 600px;
  overflow-y: auto;
}

.leaderboard-row {
  display: grid;
  grid-template-columns: 100px 1.5fr 1.5fr 0.8fr 1.4fr;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  transition: all 0.3s;
  align-items: center;
}

.leaderboard-row:hover {
  background-color: #f8f9fa;
}

/* GOLD → XANH DƯƠNG */
.leaderboard-row.gold {
  background-color: rgba(59, 130, 246, 0.06); /* blue */
  border-left: 4px solid #3B82F6;
}

/* SILVER → TÍM */
.leaderboard-row.silver {
  background-color: rgba(139, 92, 246, 0.06); /* purple */
  border-left: 4px solid #8B5CF6;
}

/* BRONZE → XANH LÁ */
.leaderboard-row.bronze {
  background-color: rgba(34, 197, 94, 0.06); /* green */
  border-left: 4px solid #22C55E;
}


.rank-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.rank-number {
  font-size: 1.6rem;
  font-weight: 800;
  width: 45px;
  height: 45px;
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
  font-size: 2rem;
}

/* Fix màu icon hạng */
.rank-icon.gold { color: #FFD700; }
.rank-icon.silver { color: #C0C0C0; }
.rank-icon.bronze { color: #CD7F32; }


.broker-info-compact {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.broker-avatar-small {
  position: relative;
  width: 65px;
  height: 65px;
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
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border: 2px solid white;
}

.broker-details {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.broker-name {
  font-weight: 700;
  color: #1a2980;
  font-size: 1.2rem;
}

.broker-location {
  font-size: 0.95rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.month-stats {
  display: flex;
  gap: 1.75rem;
}

.stat-item-compact {
  text-align: center;
}

.stat-item-compact .stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 0.35rem;
}

.stat-item-compact .stat-label {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.score-display {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.score-value {
  font-size: 1.9rem;
  font-weight: 800;
  color: #1a2980;
  text-align: center;
}

.score-progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-bar {
  flex-grow: 1;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 5px;
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
  font-size: 1rem;
  color: #666;
  font-weight: 500;
  min-width: 50px;
}

.trend-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.trend-up {
  color: #28a745;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 1.1rem;
}

.trend-down {
  color: #dc3545;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 1.1rem;
}

.trend-neutral {
  color: #6c757d;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 1.1rem;
}

.trend-period {
  font-size: 0.9rem;
  color: #666;
}

.leaderboard-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem 2rem;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
}

.update-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #666;
  font-size: 1rem;
}

.update-info i {
  color: #26d0ce;
  font-size: 1.1rem;
}

.btn-view-full {
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
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
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1a2980;
  margin-bottom: 0.75rem;
}

.section-subtitle {
  color: #666;
  font-size: 1.2rem;
  max-width: 800px;
  line-height: 1.6;
}

.section-stats {
  display: flex;
  align-items: center;
}

.section-stat {
  background-color: #f0f7ff;
  color: #1a2980;
  padding: 0.85rem 1.75rem;
  border-radius: 25px;
  font-size: 1.05rem;
  font-weight: 600;
}

/* Compact Brokers Grid */
.brokers-compact-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.75rem;
  margin-bottom: 3rem;
}

.broker-compact-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  padding: 1.75rem;
  min-height: 260px;
}

.broker-compact-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.broker-compact-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.25rem;
}

.broker-compact-avatar {
  position: relative;
  flex-shrink: 0;
}

.broker-compact-avatar img {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rank-badge-compact {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border: 3px solid white;
}

.rank-badge-compact.gold {
  background-color: #FFD700;
  color: #8B7500;
}

.rank-badge-compact.silver {
  background-color: #C0C0C0;
  color: #505050;
}

.rank-badge-compact.bronze {
  background-color: #CD7F32;
  color: #5D2906;
}

.broker-compact-info {
  flex: 1;
  min-width: 0;
}

.broker-name-compact {
  font-weight: 700;
  color: #1a2980;
  font-size: 1.4rem;
  margin-bottom: 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.broker-details-compact {
  display: flex;
  flex-direction: column;   /* ⬅️ quan trọng */
  align-items: flex-start;  /* canh trái */
  gap: 0.2rem;             /* khoảng cách giữa các dòng */
  font-size: 0.9rem;
  color: #666;
}

.broker-location-compact,
.broker-experience-compact {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  white-space: normal;      /* cho phép xuống dòng */
}


.broker-compact-quote {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  font-style: italic;
  color: #555;
  font-size: 1.05rem;
  line-height: 1.5;
  min-height: 40px;
}

.broker-compact-quote i {
  color: #26d0ce;
  font-size: 1rem;
  margin-top: 0.25rem;
}

.quote-text {
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.broker-compact-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.compact-stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.compact-stat-item {
  text-align: center;
  flex: 1;
}

.compact-stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 0.25rem;
}

.compact-stat-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.compact-month-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.compact-month-label {
  color: #666;
  font-weight: 500;
  font-size: 0.95rem;
}

.compact-month-data {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.compact-month-item {
  color: #1a2980;
  font-weight: 600;
  font-size: 0.95rem;
}

.broker-compact-tags {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: auto;
}

.broker-tag-compact {
  background-color: #f0f7ff;
  color: #1a2980;
  padding: 0.3rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.broker-tag-more {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Table View for Brokers */
.brokers-table-view {
  margin-bottom: 3rem;
}

.brokers-table-container {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.brokers-table {
  width: 100%;
}

.table-header {
  display: flex;
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  font-weight: 600;
  padding: 1.5rem 1.75rem;
  font-size: 1.1rem;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #eee;
  transition: all 0.3s;
  cursor: pointer;
  padding: 1.25rem 1.75rem;
  align-items: center;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-cell {
  display: flex;
  align-items: center;
}

.table-index {
  font-weight: 600;
  color: #666;
  font-size: 1.1rem;
}

.table-avatar {
  position: relative;
  width: 55px;
  height: 55px;
}

.table-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-rank-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  border: 2px solid white;
}

.table-rank-badge.gold {
  background-color: #FFD700;
  color: #8B7500;
}

.table-rank-badge.silver {
  background-color: #C0C0C0;
  color: #505050;
}

.table-rank-badge.bronze {
  background-color: #CD7F32;
  color: #5D2906;
}

.table-broker-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-left: 1rem;
}

.table-broker-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a2980;
  margin: 0;
}

.table-broker-location,
.table-broker-experience {
  font-size: 0.95rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-broker-motto {
  font-size: 0.95rem;
  color: #555;
  font-style: italic;
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.table-broker-motto i {
  color: #26d0ce;
  font-size: 0.8rem;
  margin-top: 0.15rem;
}

.table-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.table-tag {
  background-color: #f0f7ff;
  color: #1a2980;
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.table-tag-more {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.table-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.table-stat-value {
  font-weight: 700;
  color: #1a2980;
  font-size: 1.1rem;
}

.table-stat-label {
  color: #666;
  font-size: 0.9rem;
}

.table-success-rate {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.success-rate-value {
  font-weight: 700;
  color: #1a2980;
  font-size: 1.1rem;
}

.success-rate-progress {
  width: 100%;
}

.success-rate-progress .progress-bar {
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.success-rate-progress .progress-fill {
  background: linear-gradient(90deg, #26d0ce, #1a2980);
  height: 100%;
  border-radius: 3px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  margin-top: 2.5rem;
}

.pagination-btn {
  padding: 0.85rem 1.5rem;
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.05rem;
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
  gap: 0.35rem;
}

.pagination-page {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 2px solid #ddd;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  font-size: 1.05rem;
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
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1rem;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 1.75rem;
  color: #666;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.no-results i {
  font-size: 3.5rem;
  margin-bottom: 1.75rem;
  color: #ddd;
}

.no-results p {
  font-size: 1.3rem;
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
  margin-bottom: 1.25rem;
}

.cta-description {
  font-size: 1.2rem;
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
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.btn-cta-primary {
  padding: 1.25rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-cta-primary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}

.cta-benefits {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 2rem;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.05rem;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 25px;
  backdrop-filter: blur(10px);
}

.benefit i {
  color: #FFD700;
  font-size: 1.3rem;
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
  padding: 1.75rem;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: white;
  border-radius: 15px;
  max-width: 850px;
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
  top: 1.25rem;
  right: 1.25rem;
  background: none;
  border: none;
  font-size: 1.6rem;
  color: #666;
  cursor: pointer;
  z-index: 10;
  width: 45px;
  height: 45px;
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
  padding: 2.5rem;
}

/* Broker Detail Modal */
.broker-detail-header {
  display: flex;
  margin-bottom: 2rem;
}

.broker-detail-avatar {
  margin-right: 2.5rem;
  position: relative;
}

.broker-detail-avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #f8f9fa;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.rank-badge-large {
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 0.6rem 1.25rem;
  border-radius: 25px;
  font-weight: 800;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
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
  font-size: 2.2rem;
  font-weight: 800;
  color: #1a2980;
  margin-bottom: 0.75rem;
}

.broker-detail-location, .broker-detail-experience {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #666;
  margin-bottom: 0.6rem;
  font-size: 1.1rem;
}

.broker-detail-motto {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  color: #555;
  font-style: italic;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  font-size: 1.1rem;
}

.broker-detail-motto i {
  color: #26d0ce;
  font-size: 1rem;
  margin-top: 0.2rem;
}

.broker-detail-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
  margin-bottom: 2.5rem;
  padding: 1.75rem;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.broker-detail-stat {
  text-align: center;
}

.broker-detail-stat .stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1a2980;
  margin-bottom: 0.35rem;
}

.broker-detail-stat .stat-label {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

/* Month Stats in Detail Modal */
.broker-detail-month {
  margin-bottom: 2.5rem;
  padding: 1.75rem;
  background-color: #f0f7ff;
  border-radius: 12px;
  border-left: 4px solid #1a2980;
}

.broker-detail-month h4 {
  font-size: 1.4rem;
  color: #1a2980;
  margin-bottom: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.month-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.75rem;
}

.month-stat-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
}

.month-stat-icon {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: #f0f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #1a2980;
}

.month-stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.month-stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a2980;
}

.month-stat-label {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.broker-detail-bio {
  margin-bottom: 2.5rem;
}

.broker-detail-bio h4 {
  font-size: 1.4rem;
  color: #1a2980;
  margin-bottom: 1.25rem;
  font-weight: 700;
}

.broker-detail-bio p {
  line-height: 1.6;
  color: #555;
  font-size: 1.1rem;
}

.broker-detail-tags {
  margin-bottom: 2.5rem;
}

.broker-detail-tags h4 {
  font-size: 1.4rem;
  color: #1a2980;
  margin-bottom: 1.25rem;
  font-weight: 700;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.detail-tag {
  background-color: #f0f7ff;
  color: #1a2980;
  padding: 0.6rem 1.25rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
}

/* Sold Projects Section */
.broker-sold-projects {
  margin-bottom: 2.5rem;
}

.broker-sold-projects h4 {
  font-size: 1.4rem;
  color: #1a2980;
  margin-bottom: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sold-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.sold-project-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.25rem;
  border-left: 4px solid #1a2980;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.project-title {
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
}

.project-location {
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  margin-bottom: 0.35rem;
}

.project-type {
  color: #666;
  font-size: 1rem;
  margin-bottom: 0.35rem;
}

.project-value {
  color: #28a745;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.05rem;
}

/* Competition History Section */
.broker-competition-history {
  margin-bottom: 2rem;
}

.broker-competition-history h4 {
  font-size: 1.4rem;
  color: #1a2980;
  margin-bottom: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.competition-history-table {
  background-color: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.history-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  background: linear-gradient(90deg, #1a2980 0%, #26d0ce 100%);
  color: white;
  font-weight: 600;
  padding: 1.25rem;
  font-size: 1.1rem;
}

.history-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 1.25rem;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.history-row:nth-child(even) {
  background-color: white;
}

.history-col {
  text-align: center;
  font-size: 1.05rem;
}

.history-rank {
  display: inline-block;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1.1rem;
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

/* Footer */
.page-footer {
  background-color: #1a2980;
  color: white;
  padding: 3rem 2rem 1.75rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1400px;
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
  font-size: 1.3rem;
  margin-bottom: 1.75rem;
  font-weight: 700;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.85rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  font-size: 1.05rem;
}

.footer-links a:hover {
  color: white;
  padding-left: 0.6rem;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.05rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 1.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .page-content {
    padding: 0 1rem;
  }

  .brokers-compact-grid {
    grid-template-columns: repeat(3, 1fr);
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
    grid-template-columns: 70px 1.5fr 2fr 1fr 0.8fr;
  }

  .month-stats {
    flex-direction: column;
    gap: 0.85rem;
  }

  .brokers-compact-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .broker-compact-card {
    padding: 1.5rem;
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
    font-size: 1.1rem;
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
    display: none;
  }

  .competition-section .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .competition-period {
    align-items: flex-start;
  }

  .brokers-compact-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .broker-compact-card {
    padding: 1.75rem;
    min-height: 280px;
  }

  .broker-detail-header {
    flex-direction: column;
    text-align: center;
  }

  .broker-detail-avatar {
    margin-right: 0;
    margin-bottom: 1.75rem;
  }

  .broker-detail-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .month-stats-grid {
    grid-template-columns: 1fr;
  }

  .history-header, .history-row {
    grid-template-columns: 1fr 1fr;
    font-size: 0.95rem;
  }

  .history-header {
    font-size: 0.9rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }

  .pagination {
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  .pagination-pages {
    display: flex;
    gap: 0.4rem;
    order: 0;
  }

  .pagination-btn:first-child {
    order: 2;
  }

  .pagination-btn:last-child {
    order: 3;
  }
}

@media (max-width: 576px) {
  .cta-title {
    font-size: 1.6rem;
  }

  .modal-body {
    padding: 1.75rem;
  }

  .broker-detail-stats {
    grid-template-columns: 1fr;
  }

  .broker-compact-card {
    min-height: 280px;
  }

  .broker-compact-avatar img {
    width: 70px;
    height: 70px;
  }

  .broker-name-compact {
    font-size: 1.25rem;
  }

  .broker-details-compact {
    font-size: 1rem;
  }

  .broker-compact-quote {
    font-size: 1.05rem;
  }

  .compact-stat-value {
    font-size: 1.25rem;
  }

  .compact-stat-label {
    font-size: 0.9rem;
  }
}



.leaderboard-row {
  display: grid;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  transition: all 0.3s;
  align-items: center;
}

.leaderboard-row:hover {
  background-color: #f8f9fa;
}

/* Icon lớn cho top 1,2,3 */
.top-rank-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.top-rank-large i {
  font-size: 2.5rem;
  margin-bottom: 0.25rem;
}

.rank-number-large {
  font-size: 1.8rem;
  font-weight: 900;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.top-rank-large.gold i {
  color: #FFD700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.top-rank-large.silver i {
  color: #C0C0C0;
  text-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
}

.top-rank-large.bronze i {
  color: #CD7F32;
  text-shadow: 0 0 10px rgba(205, 127, 50, 0.5);
}

.rank-number-regular {
  font-size: 2rem;
  font-weight: 800;
  color: #1a2980;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  margin: 0 auto;
}

/* Grid cho thống kê tháng */
.month-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  text-align: center;
}

.month-stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.month-stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a2980;
  line-height: 1.2;
}

.month-stat-value.doanh-so {
  font-size: 1.2rem; /* Nhỏ hơn một chút để phù hợp với số tiền dài */
  word-break: break-word;
}

.month-stat-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* Responsive cho bảng */
@media (max-width: 1200px) {
  .leaderboard-header,
  .leaderboard-row {
    grid-template-columns: 100px 1.5fr 1.5fr 1.2fr 1fr;
  }

  .top-rank-large i {
    font-size: 2rem;
  }

  .rank-number-large {
    font-size: 1.5rem;
  }

  .rank-number-regular {
    font-size: 1.8rem;
    width: 50px;
    height: 50px;
  }

  .month-stats-grid {
    gap: 1rem;
  }

  .month-stat-value {
    font-size: 1.2rem;
  }

  .month-stat-value.doanh-so {
    font-size: 1rem;
  }
}

@media (max-width: 992px) {
  .leaderboard-header,
  .leaderboard-row {
    grid-template-columns: 100px 1.5fr 1.5fr 1.2fr 1fr;
    padding: 1.25rem 1rem;
  }

  .top-rank-large i {
    font-size: 1.8rem;
  }

  .rank-number-large {
    font-size: 1.3rem;
  }

  .rank-number-regular {
    font-size: 1.6rem;
    width: 45px;
    height: 45px;
  }

  .month-stats-grid {
    gap: 0.75rem;
  }

  .month-stat-value {
    font-size: 1.1rem;
  }

  .month-stat-value.doanh-so {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  /* Hiển thị mobile view cho màn hình nhỏ */
  .leaderboard-container {
    display: none;
  }

  .mobile-leaderboard {
    display: block;
  }

  /* Mobile view cũng cần điều chỉnh */
  .mobile-month-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .mobile-month-stat-item {
    text-align: center;
  }

  .mobile-month-stat-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a2980;
    margin-bottom: 0.25rem;
  }

  .mobile-month-stat-value.doanh-so {
    font-size: 1.2rem;
  }

  .mobile-month-stat-label {
    font-size: 0.85rem;
    color: #666;
  }
}

/* Fix responsive cho mobile leaderboard */
.mobile-leaderboard-item .mobile-stats-row {
  display: none; /* Ẩn thống kê cũ */
}

.mobile-leaderboard-item .mobile-month-stats {
  display: grid;
  grid-template-columns: 0.7fr 0.9fr 0.5fr;
  gap: 1rem;
  width: 100%;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

/* Cập nhật phần thống kê trong modal cũng cần sửa */
.modal-month-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 1rem;
}

.modal-month-stat-item {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.modal-month-stat-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a2980;
  margin-bottom: 0.5rem;
}

.modal-month-stat-label {
  font-size: 0.95rem;
  color: #666;
}
/* CSS cho mobile leaderboard mới */
.mobile-leaderboard {
  display: none;
}

@media (max-width: 768px) {
  .mobile-leaderboard {
    display: block;
  }

  .mobile-leaderboard-container {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    background-color: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  }

  .mobile-leaderboard-item {
    padding: 1.25rem;
    border-bottom: 1px solid #eee;
  }

  .mobile-rank-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mobile-rank-number {
    width: 50px;
    text-align: center;
  }

  .top-rank-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .top-rank-mobile i {
    font-size: 1.8rem;
  }

  .rank-number-mobile {
    font-size: 1.3rem;
    font-weight: 900;
  }

  .top-rank-mobile.gold i {
    color: #FFD700;
  }

  .top-rank-mobile.silver i {
    color: #C0C0C0;
  }

  .top-rank-mobile.bronze i {
    color: #CD7F32;
  }

  .rank-number-mobile-regular {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1a2980;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    margin: 0 auto;
  }

  .mobile-broker-avatar {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
  }

  .mobile-broker-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .mobile-broker-info {
    flex: 1;
    min-width: 0;
  }

  .mobile-broker-name {
    font-weight: 700;
    color: #1a2980;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-broker-location {
    font-size: 0.9rem;
    color: #666;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .mobile-trend-compact {
    margin-left: auto;
    padding-left: 0.5rem;
  }

  .mobile-month-stats {
    display: grid;
    grid-template-columns: 0.7fr 0.9fr 0.4fr;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .mobile-month-stat-item {
    text-align: center;
  }

  .mobile-month-stat-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a2980;
    margin-bottom: 0.25rem;
  }

  .mobile-month-stat-value.doanh-so {
    font-size: 1.2rem;
    word-break: break-word;
  }

  .mobile-month-stat-label {
    font-size: 0.85rem;
    color: #666;
  }
}

.compact-contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background-color: #f8f9fa;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.compact-contact-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #1a2980;
  font-weight: 500;
  min-width: 0; /* rất quan trọng để cắt text */
}

.compact-contact-item i {
  font-size: 0.8rem;
  opacity: 0.7;
  flex-shrink: 0;
}

.compact-contact-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-broker-contact {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.95rem;
  color: #555;
}

.broker-contact-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.broker-contact-item i {
  font-size: 0.75rem;
  opacity: 0.7;
  flex-shrink: 0;
}
.broker-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
  margin-top: 8px;
}

.broker-detail-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.broker-detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  color: #666;
}

/* ICON COLORS */
.icon-location {
  color: #ef4444; /* đỏ */
}

.icon-exp {
  color: #6366f1; /* tím */
}

.icon-phone {
  color: #22c55e; /* xanh lá */
}

.icon-email {
  color: #0ea5e9; /* xanh dương */
}
/* CSS mới */
.pagination {
  margin-top: 2.5rem;
  width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.pagination-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 80px;
  padding: 0 1rem;
}

.current-page {
  color: #1a2980;
  font-size: 1.3rem;
  font-weight: 700;
}

.total-pages {
  color: #666;
  font-size: 1.1rem;
}

.pagination-btn {
  padding: 0.85rem 1.5rem;
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.05rem;
  min-width: 100px;
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

/* Desktop pagination pages */
.pagination-pages {
  display: flex;
  gap: 0.35rem;
}

.pagination-page {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  border: 2px solid #ddd;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.1rem;
}

/* Responsive pagination */
@media (max-width: 768px) {
  .pagination-container {
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    width: 100%;
  }

  .pagination-pages {
    display: none;
  }

  .pagination-info {
    order: 0;
    min-width: 60px;
    padding: 0;
    flex: 0 0 auto;
  }

  .pagination-btn:first-child {
    order: -1;
    flex: 0 0 auto;
  }

  .pagination-btn:last-child {
    order: 1;
    flex: 0 0 auto;
  }

  .pagination-btn {
    min-width: 50px;
    width: 50px;
    height: 50px;
    padding: 0;
    font-size: 1rem;
  }

  .pagination-btn span {
    display: none;
  }

  .pagination-btn i {
    font-size: 1.1rem;
    margin: 0;
  }

  /* Đảm bảo căn giữa hoàn toàn */
  .pagination {
    display: flex;
    justify-content: center;
  }

  .pagination-container {
    max-width: 300px;
    margin: 0 auto;
  }
}

/* Responsive thêm cho màn hình rất nhỏ */
@media (max-width: 480px) {
  .pagination-container {
    max-width: 280px;
    gap: 0.25rem;
  }

  .pagination-btn {
    min-width: 45px;
    width: 45px;
    height: 45px;
  }

  .pagination-info {
    min-width: 50px;
    font-size: 1rem;
  }

  .current-page {
    font-size: 1.2rem;
  }

  .total-pages {
    font-size: 1rem;
  }
}
</style>