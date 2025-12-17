<template>
  <div class="collaborator-recruitment">
    <!-- Header Banner -->
    <div class="banner-header">
      <div class="banner-content">
        <div class="left-column">
          <h1 class="main-title">Cơ hội cộng tác cùng Thiên Hà Group</h1>
          <h2 class="sub-title">Định hướng nghề môi giới chuyên nghiệp</h2>
          <p class="description">
            Tham gia vào hệ thống của Thiên Hà Group với vai trò cộng tác viên bất động sản để tiếp cận kho dự án lớn,
            quy trình làm việc bài bản và đội ngũ hỗ trợ tận tâm. Đây là bước khởi đầu lý tưởng cho những ai muốn nghiêm
            túc phát triển sự nghiệp môi giới nhưng cần một vị trí linh hoạt, không ràng buộc thời gian.
          </p>
        </div>
        <div class="right-column">
          <div class="glass-effect">
            <img :src="logoTHG" alt="Thiên Hà Group Logo" class="logo">
          </div>
        </div>
      </div>
    </div>

    <!-- Main Container -->
    <div class="main-container">
      <!-- Assigned Jobs Section - Carousel -->
      <section class="jobs-section">
        <h2 class="section-title">Công việc đã nhận</h2>

        <!-- Carousel Container -->
        <div class="carousel-container">
          <!-- Navigation Buttons -->
          <button class="carousel-btn carousel-btn-prev" @click="prevSlide">
            <i class="fa-solid fa-chevron-left"></i>
          </button>

          <!-- Carousel Track -->
          <div class="carousel-track" ref="carouselTrack">
            <div
                v-for="job in displayedAssignedJobs"
                :key="job.id"
                class="carousel-slide"
            >
              <div class="job-item">
                <div class="job-content">
                  <div class="job-image">
                    <img :src="job.image" :alt="job.title">
                  </div>
                  <div class="job-details">
                    <h3 class="job-title">{{ job.title }}</h3>
                    <div class="job-info-row">
                      <div class="job-detail salary">
                        <span class="icon money"><i class="fa-solid fa-money-bill-wave"></i></span>
                        <span class="salary-text">
                          <span>{{ formatSalary(job.salary) }}</span>
                        </span>
                      </div>
                    </div>
                    <div class="job-info-row">
                      <div class="job-detail">
                        <span class="icon location"><i class="fa-solid fa-location-dot"></i></span>
                        <span>{{ job.location }}</span>
                      </div>
                    </div>
                    <div class="job-info-row">
                      <div class="job-detail">
                        <span class="icon calendar"><i class="fa-solid fa-calendar"></i></span>
                        <span>{{ job.date }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="btn-detail info-btn"
                        @click="router.push('/collaborator-jobs/personal-task/' + job.id)">
                  <i class="fa-solid fa-circle-info"></i> Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <button class="carousel-btn carousel-btn-next" @click="nextSlide">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="loading-indicator">
          <i class="fa-solid fa-spinner fa-spin"></i> Đang tải thêm công việc...
        </div>
      </section>

      <!-- Available Jobs Section -->
      <section class="jobs-section">
        <div class="section-header">
          <h2 class="section-title">Các công việc đang tuyển</h2>

          <div class="view-toggle-container">
            <button
                class="view-toggle-btn"
                :class="{ active: !tableView }"
                @click="tableView = false"
                title="Xem dạng lưới"
            >
              <i class="fa-solid fa-grip"></i>
            </button>
            <button
                class="view-toggle-btn"
                :class="{ active: tableView }"
                @click="tableView = true"
                title="Xem dạng bảng"
            >
              <i class="fa-solid fa-table"></i>
            </button>
          </div>

        </div>
        <div class="filter-container">
          <div class="filter-item">
            <div class="search-box" :class="{ 'has-content': searchQuery }">
              <div class="search-icon">
                <i class="fa-solid fa-magnifying-glass"></i>
              </div>
              <input
                  type="text"
                  placeholder="Tìm kiếm công việc..."
                  v-model="searchQuery"
                  class="search-input"
              >
              <button
                  class="search-clear"
                  v-if="searchQuery"
                  @click="clearSearch"
              >
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Bộ lọc khu vực -->
          <div class="filter-item" :class="{ active: locationFilter !== '' }">
            <div class="filter-icon" @click="resetLocationFilter">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <select
                id="location-filter"
                v-model="locationFilter"
                class="filter-select"
            >
              <option value="">Tất cả khu vực</option>
              <option value="hcm">TP.HCM</option>
              <option value="hn">Hà Nội</option>
              <option value="dn">Đà Nẵng</option>
              <option value="other">Khu vực khác</option>
            </select>
          </div>

          <!-- Bộ lọc Quận/Huyện -->
          <div class="filter-item" :class="{ active: districtFilter !== '' }">
            <div class="filter-icon" @click="resetDistrictFilter">
              <i class="fa-solid fa-map"></i>
            </div>
            <select
                id="district-filter"
                v-model="districtFilter"
                class="filter-select"
            >
              <option value="">Tất cả Quận/Huyện</option>
              <option value="q1">Quận 1</option>
              <option value="q2">Quận 2</option>
              <option value="q3">Quận 3</option>
              <option value="q7">Quận 7</option>
              <option value="q9">Quận 9</option>
              <option value="bt">Bình Thạnh</option>
              <option value="td">Thủ Đức</option>
            </select>
          </div>

          <!-- Bộ lọc Xã/Phường -->
          <div class="filter-item" :class="{ active: wardFilter !== '' }">
            <div class="filter-icon" @click="resetWardFilter">
              <i class="fa-solid fa-map-pin"></i>
            </div>
            <select
                id="ward-filter"
                v-model="wardFilter"
                class="filter-select"
            >
              <option value="">Tất cả Xã/Phường</option>
              <option value="p1">Phường 1</option>
              <option value="p2">Phường 2</option>
              <option value="p3">Phường 3</option>
              <option value="pt">Phú Thạnh</option>
              <option value="tn">Tân Phong</option>
            </select>
          </div>

          <!-- Bộ lọc mức lương -->
          <div class="filter-item" :class="{ active: salaryRange.min > 0 || salaryRange.max < 50000000 }">
            <div class="filter-icon" @click="openSalaryModal">
              <i class="fa-solid fa-money-bill-wave"></i>
            </div>
            <div class="salary-display" @click="openSalaryModal">
              {{ formatSalaryDisplay() }}
            </div>
          </div>
        </div>


        <!-- Modal mức lương -->
        <div class="salary-modal" v-if="showSalaryModal">
          <div class="modal-overlay" @click="closeSalaryModal"></div>
          <div class="modal-content">
            <div class="modal-header">
              <h3>Chọn mức lương</h3>
              <button class="close-btn" @click="closeSalaryModal">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="salary-range">
              <div class="range-labels">
                <span>{{ formatSalary(salaryRange.min) }}</span>
                <span>{{ formatSalary(salaryRange.max) }}</span>
              </div>
              <div class="range-slider">
                <input
                    type="range"
                    min="0"
                    max="50000000"
                    step="1000000"
                    v-model="salaryRange.min"
                    class="slider min-slider"
                >
                <input
                    type="range"
                    min="0"
                    max="50000000"
                    step="1000000"
                    v-model="salaryRange.max"
                    class="slider max-slider"
                >
              </div>
              <div class="selected-range">
                Mức lương: {{ formatSalary(salaryRange.min) }} - {{ formatSalary(salaryRange.max) }}
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-apply" @click="applySalaryFilter">Áp dụng</button>
              <button class="btn-reset" @click="resetSalaryFilter">Đặt lại</button>
            </div>
          </div>
        </div>

        <!-- Dạng lưới -->
        <div v-if="!tableView" class="jobs-grid">
          <div
              v-for="job in paginatedJobs"
              :key="job.id"
              class="job-item"
              @mouseenter="hoveredJob = job.id"
              @mouseleave="hoveredJob = null"
          >
            <div class="job-content">
              <div class="job-image">
                <img :src="job.image" :alt="job.title">
              </div>
              <div class="job-details">
                <h3 class="job-title">{{ job.title }}</h3>
                <div class="job-info-row">
                  <div class="job-detail salary">
                    <span class="icon money"><i class="fa-solid fa-money-bill-wave"></i> </span>
                    <span class="salary-text">
                      <span v-if="isLoggedIn || job.salaryVisible">{{ formatSalary(job.salary) }}</span>
                      <span v-else>{{ hideSalary(job.salary) }}</span>
                      <span v-if="!isLoggedIn" class="toggle-salary" @click.stop="toggleSalaryVisibility(job.id)"
                            v-html=" !job.salaryVisible ? `<i class='fa-solid fa-eye'></i>️` : `<i class='fa-solid fa-eye-slash'></i>`">

                      </span>
                    </span>
                  </div>
                </div>
                <div class="job-info-row">
                  <div class="job-detail">
                    <span class="icon location"><i class="fa-solid fa-location-dot"></i></span>
                    <span>{{ job.location }}</span>
                  </div>
                </div>
                <div class="job-info-row">
                  <div class="job-detail">
                    <span class="icon calendar"><i class="fa-solid fa-calendar"></i></span>
                    <span>{{ job.date }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="job-actions">
              <button
                  class="btn-register"
                  :class="{ 'half-width': hoveredJob === job.id }"
              >
                <i class="fa-solid fa-paper-plane"></i> Đăng ký ngay
              </button>
              <button
                  @click="router.push('/collaborator-jobs/'+ job.id)"
                  class="btn-detail-2 outline"
                  v-if="hoveredJob === job.id"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        <!-- Dạng bảng -->
        <div v-else class="jobs-table-container">
          <table class="jobs-table">
            <thead>
            <tr>
              <th class="table-header">Công việc</th>
              <th class="table-header">Mức lương</th>
              <th class="table-header">Địa điểm</th>
              <th class="table-header">Ngày đăng</th>
              <th class="table-header">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="job in paginatedJobs"
                :key="job.id"
                class="table-row"
            >
              <td class="table-cell job-title-cell">
                <div class="job-title-wrapper">
                  <div class="job-image-table">
                    <img :src="job.image" :alt="job.title">
                  </div>
                  <div class="job-info-table">
                    <h3 class="job-title-table">{{ job.title }}</h3>
                    <p class="job-creator">{{ job.creator }}</p>
                  </div>
                </div>
              </td>
              <td class="table-cell salary-cell">
                <div class="salary-wrapper">
                  <span v-if="isLoggedIn || job.salaryVisible">{{ formatSalary(job.salary) }}</span>
                  <span v-else>{{ hideSalary(job.salary) }}</span>
                  <span class="toggle-salary" @click="toggleSalaryVisibility(job.id)"
                        v-html=" !job.salaryVisible ? `<i class='fa-solid fa-eye'></i>️` : `<i class='fa-solid fa-eye-slash'></i>`">
                  </span>
                </div>
              </td>
              <td class="table-cell location-cell">
                <div class="location-wrapper">
                  <i class="fa-solid fa-location-dot location-icon"></i>
                  <span>{{ job.location }}</span>
                </div>
              </td>
              <td class="table-cell date-cell">
                <div class="date-wrapper">
                  <i class="fa-solid fa-calendar date-icon"></i>
                  <span>{{ job.date }}</span>
                </div>
              </td>
              <td class="table-cell action-cell">
                <div class="action-wrapper">
                  <button
                      class="btn-register-table"
                      @click="router.push('/collaborator-jobs/'+ job.id)"
                  >
                    <i class="fa-solid fa-paper-plane"></i> Đăng ký
                  </button>
                  <button
                      class="btn-detail-table"
                      @click="router.push('/collaborator-jobs/'+ job.id)"
                  >
                    <i class="fa-solid fa-circle-info"></i> Chi tiết
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button class="page-btn"><i class="fa-solid fa-chevron-left"></i></button>

          <button
              v-for="page in totalPages"
              :key="page"
              class="page-btn"
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
          >
            {{ page }}
          </button>

          <button class="page-btn"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from "vue-router";

const router = useRouter()

// Mock data for images (replace with actual imports in your project)
const ctvBanner = '/imgs/ctv.png'
const logoTHG = '/imgs/logoTHG.png'

// Random image URLs for demonstration
const getRandomImage = (seed) => {
  return `https://picsum.photos/300/200?random=${seed}`
}

// Thêm vào script setup
const searchQuery = ref('')
const tableView = ref(false) // false = lưới, true = bảng

const clearSearch = () => {
  searchQuery.value = ''
}

// Carousel variables
const currentSlide = ref(0)
const slidesPerView = ref(3)
const isLoading = ref(false)
const carouselTrack = ref(null)
const allAssignedJobs = ref([])
const displayedAssignedJobs = ref([])

// Mock job data
const initialAssignedJobs = [
  {
    id: 1,
    title: 'Môi giới căn hộ cao cấp',
    salary: 15000000,
    salaryVisible: false,
    location: 'Quận 1, TP.HCM',
    date: '15/10/2023',
    image: getRandomImage(1),
    creator: 'Công ty BĐS Diamond Land',
    income: '15-25 triệu',
    applicants: 8,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tìm kiếm và tư vấn khách hàng về các dự án căn hộ cao cấp tại Quận 1</li>
        <li>Giới thiệu sản phẩm phù hợp với nhu cầu khách hàng</li>
        <li>Hỗ trợ khách hàng trong suốt quá trình giao dịch</li>
        <li>Theo dõi và chăm sóc khách hàng tiềm năng</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Lương cứng 15 triệu + hoa hồng không giới hạn</li>
        <li>Được đào tạo chuyên sâu về sản phẩm</li>
        <li>Môi trường làm việc chuyên nghiệp</li>
        <li>Cơ hội thăng tiến rõ ràng</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Có kinh nghiệm môi giới BĐS từ 1 năm</li>
        <li>Kỹ năng giao tiếp tốt</li>
        <li>Chăm chỉ, trung thực</li>
        <li>Biết sử dụng các công cụ marketing online</li>
      </ul>
    `
  },
  {
    id: 2,
    title: 'Tư vấn bất động sản nghỉ dưỡng',
    salary: 12000000,
    salaryVisible: false,
    location: 'Phú Quốc, Kiên Giang',
    date: '20/10/2023',
    image: getRandomImage(2),
    creator: 'Tập đoàn Sunshine Group',
    income: '12-30 triệu',
    applicants: 12,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tư vấn các sản phẩm BĐS nghỉ dưỡng tại Phú Quốc</li>
        <li>Kết nối với khách hàng có nhu cầu đầu tư</li>
        <li>Tổ chức các sự kiện giới thiệu sản phẩm</li>
        <li>Chăm sóc khách hàng sau bán hàng</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Lương cứng 12 triệu + hoa hồng hấp dẫn</li>
        <li>Được cung cấp database khách hàng tiềm năng</li>
        <li>Hỗ trợ chi phí đi lại, tiếp khách</li>
        <li>Nghỉ phép có lương theo quy định</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Ưu tiên ứng viên có kinh nghiệm BĐS nghỉ dưỡng</li>
        <li>Khả năng thuyết phục tốt</li>
        <li>Có mối quan hệ rộng trong ngành</li>
        <li>Sẵn sàng công tác tại Phú Quốc</li>
      </ul>
    `
  },
  {
    id: 3,
    title: 'Chuyên viên tư vấn đất nền',
    salary: 18000000,
    salaryVisible: false,
    location: 'Quận 9, TP.HCM',
    date: '25/10/2023',
    image: getRandomImage(3),
    creator: 'Công ty Đất Xanh Miền Nam',
    income: '18-35 triệu',
    applicants: 15,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tư vấn và môi giới các dự án đất nền tại khu vực Quận 9</li>
        <li>Phân tích thị trường và định giá BĐS</li>
        <li>Hỗ trợ khách hàng trong các thủ tục pháp lý</li>
        <li>Xây dựng mạng lưới khách hàng tiềm năng</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Lương cứng 18 triệu + hoa hồng cao</li>
        <li>Được đào tạo về pháp lý BĐS</li>
        <li>Thưởng theo hiệu suất hàng tháng</li>
        <li>Bảo hiểm đầy đủ theo luật lao động</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Tốt nghiệp ĐH chuyên ngành liên quan</li>
        <li>Có ít nhất 2 năm kinh nghiệm đất nền</li>
        <li>Hiểu biết về pháp lý BĐS</li>
        <li>Có kỹ năng đàm phán tốt</li>
      </ul>
    `
  }
]

const availableJobs = ref([
  {
    id: 4,
    title: 'Cộng tác viên dự án Vinhomes',
    salary: 20000000,
    salaryVisible: false,
    location: 'Quận 2, TP.HCM',
    date: '30/10/2023',
    image: getRandomImage(4),
    creator: 'Tập đoàn Vingroup',
    income: '20-50 triệu',
    applicants: 25,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Giới thiệu và tư vấn các sản phẩm của Vinhomes</li>
        <li>Kết nối khách hàng với chủ đầu tư</li>
        <li>Tổ chức tour tham quan dự án</li>
        <li>Hỗ trợ khách hàng hoàn thiện hồ sơ</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Hoa hồng lên đến 3% giá trị giao dịch</li>
        <li>Được training bài bản từ chuyên gia</li>
        <li>Làm việc tại văn phòng hiện đại</li>
        <li>Cơ hội trở thành nhân viên chính thức</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Có kinh nghiệm CTV BĐS là lợi thế</li>
        <li>Kỹ năng giao tiếp tự tin</li>
        <li>Có khả năng làm việc độc lập</li>
        <li>Cam kết làm việc lâu dài</li>
      </ul>
    `
  },
  {
    id: 5,
    title: 'Tư vấn viên căn hộ ven sông',
    salary: 16000000,
    salaryVisible: false,
    location: 'Quận 7, TP.HCM',
    date: '05/11/2023',
    image: getRandomImage(5),
    creator: 'Công ty BĐS Riverside',
    income: '16-32 triệu',
    applicants: 18,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tư vấn sản phẩm căn hộ cao cấp ven sông</li>
        <li>Tham gia các sự kiện mở bán định kỳ</li>
        <li>Xây dựng và chăm sóc tệp khách hàng VIP</li>
        <li>Phối hợp với bộ phận marketing triển khai chiến dịch</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Thu nhập cạnh tranh, thưởng theo dự án</li>
        <li>Được hỗ trợ chi phí truyền thông</li>
        <li>Môi trường làm việc sáng tạo</li>
        <li>Hỗ trợ mentor cá nhân</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Kỹ năng thuyết trình tốt</li>
        <li>Ưu tiên ứng viên có kinh nghiệm căn hộ cao cấp</li>
        <li>Chủ động trong công việc</li>
        <li>Sẵn sàng làm việc cuối tuần</li>
      </ul>
    `
  },
  {
    id: 6,
    title: 'Chuyên viên BĐS khu Đông',
    salary: 17000000,
    salaryVisible: false,
    location: 'Thủ Đức, TP.HCM',
    date: '10/11/2023',
    image: getRandomImage(6),
    creator: 'Đất Xanh Premium',
    income: '17-34 triệu',
    applicants: 20,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Chuyên tư vấn các dự án khu Đông TP.HCM</li>
        <li>Đánh giá và phân tích tiềm năng khu vực</li>
        <li>Hỗ trợ khách hàng lựa chọn sản phẩm phù hợp</li>
        <li>Làm việc trực tiếp với chủ đầu tư</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Hoa hồng cao, thưởng nóng theo giao dịch</li>
        <li>Được cung cấp data khách hàng nóng</li>
        <li>Tham gia khóa đào tạo pháp lý định kỳ</li>
        <li>Lộ trình thăng tiến rõ ràng</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Am hiểu thị trường khu Đông</li>
        <li>Có phương tiện di chuyển cá nhân</li>
        <li>Kỹ năng đàm phán và chốt sale</li>
        <li>Ưu tiên ứng viên biết tiếng Anh</li>
      </ul>
    `
  },
  {
    id: 7,
    title: 'Cộng tác viên đất nền Long An',
    salary: 14000000,
    salaryVisible: false,
    location: 'Đức Hòa, Long An',
    date: '15/11/2023',
    image: getRandomImage(7),
    creator: 'Công ty BĐS An Phú',
    income: '14-28 triệu',
    applicants: 10,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tìm kiếm khách hàng đầu tư đất nền</li>
        <li>Tổ chức các buổi tham quan thực tế</li>
        <li>Hỗ trợ thủ tục đặt cọc và chuyển nhượng</li>
        <li>Báo cáo kết quả hàng tuần</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Hỗ trợ chi phí xăng xe, điện thoại</li>
        <li>Thưởng theo KPI tuần và tháng</li>
        <li>Được tham gia các khóa học bán hàng</li>
        <li>Chế độ hoa hồng cạnh tranh</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Kỹ năng giao tiếp và chăm sóc khách hàng</li>
        <li>Chịu khó di chuyển tỉnh</li>
        <li>Có laptop và smartphone</li>
        <li>Trung thực, cầu tiến</li>
      </ul>
    `
  },
  {
    id: 8,
    title: 'Tư vấn viên shophouse',
    salary: 19000000,
    salaryVisible: false,
    location: 'Hà Nội',
    date: '20/11/2023',
    image: getRandomImage(8),
    creator: 'Sun Property',
    income: '19-40 triệu',
    applicants: 14,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tư vấn sản phẩm shophouse trung tâm</li>
        <li>Làm việc với khách hàng doanh nghiệp</li>
        <li>Phối hợp tổ chức sự kiện giới thiệu dự án</li>
        <li>Theo dõi tiến độ thanh toán và bàn giao</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Thu nhập cao, thưởng nóng theo hợp đồng</li>
        <li>Tham gia các hội thảo chuyên ngành</li>
        <li>Hỗ trợ vé máy bay khi công tác</li>
        <li>Bảo hiểm sức khỏe mở rộng</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Kinh nghiệm tối thiểu 1 năm</li>
        <li>Ưu tiên ứng viên biết ngoại ngữ</li>
        <li>Kỹ năng phân tích tài chính cơ bản</li>
        <li>Đam mê lĩnh vực bất động sản</li>
      </ul>
    `
  },
  {
    id: 9,
    title: 'Chuyên viên thuê căn hộ dịch vụ',
    salary: 13000000,
    salaryVisible: false,
    location: 'Quận 3, TP.HCM',
    date: '22/11/2023',
    image: getRandomImage(9),
    creator: 'Công ty Leasing Pro',
    income: '13-26 triệu',
    applicants: 9,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tìm kiếm khách thuê căn hộ dịch vụ</li>
        <li>Quản lý danh mục phòng trống</li>
        <li>Đàm phán hợp đồng thuê</li>
        <li>Chăm sóc khách trong suốt thời gian thuê</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Hoa hồng theo hợp đồng thuê</li>
        <li>Hỗ trợ chi phí marketing</li>
        <li>Làm việc giờ hành chính linh hoạt</li>
        <li>Cơ hội làm việc lâu dài</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Kỹ năng chăm sóc khách hàng tốt</li>
        <li>Biết sử dụng CRM cơ bản</li>
        <li>Ưu tiên ứng viên biết tiếng Anh</li>
        <li>Năng động, nhanh nhẹn</li>
      </ul>
    `
  },
  {
    id: 10,
    title: 'Cộng tác viên môi giới BĐS công nghiệp',
    salary: 22000000,
    salaryVisible: false,
    location: 'Bình Dương',
    date: '25/11/2023',
    image: getRandomImage(10),
    creator: 'Industrial Land Co.',
    income: '22-60 triệu',
    applicants: 11,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tư vấn đất khu công nghiệp và nhà xưởng</li>
        <li>Làm việc với khách hàng doanh nghiệp FDI</li>
        <li>Hỗ trợ thủ tục pháp lý và giấy phép</li>
        <li>Tham gia hội chợ và triển lãm ngành</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Hoa hồng cao theo diện tích giao dịch</li>
        <li>Hỗ trợ di chuyển và ăn ở khi công tác</li>
        <li>Đào tạo chuyên sâu về BĐS công nghiệp</li>
        <li>Cơ hội mở rộng mạng lưới doanh nghiệp</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Kinh nghiệm làm việc với khách hàng doanh nghiệp</li>
        <li>Hiểu biết về pháp lý khu công nghiệp</li>
        <li>Khả năng sử dụng tiếng Anh giao tiếp</li>
        <li>Chịu được áp lực doanh số</li>
      </ul>
    `
  },
  {
    id: 11,
    title: 'Chuyên viên tư vấn condotel',
    salary: 15000000,
    salaryVisible: false,
    location: 'Đà Nẵng',
    date: '28/11/2023',
    image: getRandomImage(11),
    creator: 'Ocean View Invest',
    income: '15-33 triệu',
    applicants: 13,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tư vấn sản phẩm condotel ven biển</li>
        <li>Hỗ trợ khách hàng tính toán lợi nhuận</li>
        <li>Tổ chức tour du lịch tham quan dự án</li>
        <li>Chăm sóc khách hàng sau bán hàng</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Thu nhập hấp dẫn, thưởng lễ tết</li>
        <li>Hỗ trợ chi phí công tác</li>
        <li>Tham gia team building hàng quý</li>
        <li>Bảo hiểm đầy đủ</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Yêu thích du lịch biển</li>
        <li>Có kinh nghiệm tư vấn đầu tư</li>
        <li>Khả năng thuyết phục và đàm phán</li>
        <li>Ưu tiên ứng viên tiếng Trung/Anh</li>
      </ul>
    `
  },
  {
    id: 12,
    title: 'Cộng tác viên dự án xanh',
    salary: 12500000,
    salaryVisible: false,
    location: 'Quận 9, TP.HCM',
    date: '30/11/2023',
    image: getRandomImage(12),
    creator: 'Green Home Land',
    income: '12-26 triệu',
    applicants: 7,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Giới thiệu các dự án nhà ở xanh</li>
        <li>Tư vấn chính sách vay ưu đãi</li>
        <li>Phối hợp tổ chức workshop về sống xanh</li>
        <li>Hỗ trợ khách hàng hoàn thiện hồ sơ pháp lý</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Hoa hồng tốt, thưởng hiệu suất</li>
        <li>Môi trường làm việc thân thiện</li>
        <li>Được đào tạo về xu hướng BĐS xanh</li>
        <li>Cơ hội trở thành chuyên viên chính thức</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Đam mê phong cách sống xanh</li>
        <li>Kỹ năng tư vấn tài chính cá nhân</li>
        <li>Chủ động và trách nhiệm</li>
        <li>Ưu tiên ứng viên có kinh nghiệm BĐS</li>
      </ul>
    `
  },
  {
    id: 13,
    title: 'Tư vấn viên biệt thự nghỉ dưỡng',
    salary: 25000000,
    salaryVisible: false,
    location: 'Nha Trang',
    date: '02/12/2023',
    image: getRandomImage(15),
    creator: 'Resort Holdings',
    income: '25-70 triệu',
    applicants: 6,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Kết nối khách hàng cao cấp mua biệt thự nghỉ dưỡng</li>
        <li>Hỗ trợ khách hàng trong các gói đầu tư cho thuê</li>
        <li>Tham gia các sự kiện giới thiệu tại resort</li>
        <li>Theo dõi tiến độ xây dựng và bàn giao</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Hoa hồng hấp dẫn theo giá trị hợp đồng</li>
        <li>Được trải nghiệm dịch vụ resort miễn phí theo chính sách</li>
        <li>Hỗ trợ chi phí công tác và lưu trú</li>
        <li>Đào tạo chuyên sâu về sản phẩm nghỉ dưỡng</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Kinh nghiệm chăm sóc khách hàng cao cấp</li>
        <li>Kỹ năng giao tiếp tiếng Anh tốt</li>
        <li>Am hiểu thị trường du lịch biển</li>
        <li>Hình thức chỉn chu, chuyên nghiệp</li>
      </ul>
    `
  },
  {
    id: 14,
    title: 'Chuyên viên bán hàng officetel',
    salary: 15500000,
    salaryVisible: false,
    location: 'Quận 1, TP.HCM',
    date: '04/12/2023',
    image: getRandomImage(16),
    creator: 'City Office Homes',
    income: '15-31 triệu',
    applicants: 16,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tư vấn các sản phẩm officetel trung tâm</li>
        <li>Hướng dẫn khách hàng thủ tục sang nhượng</li>
        <li>Hỗ trợ khách hàng doanh nghiệp nhỏ</li>
        <li>Đàm phán hợp đồng thuê và mua bán</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Lương cứng + hoa hồng hấp dẫn</li>
        <li>Hỗ trợ phí gửi xe, điện thoại</li>
        <li>Đào tạo kỹ năng bán hàng B2B</li>
        <li>Văn phòng làm việc trung tâm</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Kinh nghiệm bán hàng bất động sản tối thiểu 6 tháng</li>
        <li>Thái độ chuyên nghiệp, lịch sự</li>
        <li>Khả năng giao tiếp tiếng Anh là lợi thế</li>
        <li>Chịu được áp lực chỉ tiêu</li>
      </ul>
    `
  },
  {
    id: 15,
    title: 'Cộng tác viên bán đất nghỉ dưỡng Đà Lạt',
    salary: 13500000,
    salaryVisible: false,
    location: 'Đà Lạt, Lâm Đồng',
    date: '06/12/2023',
    image: getRandomImage(17),
    creator: 'Mountain Land',
    income: '13-29 triệu',
    applicants: 8,
    jobDescription: `
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Tìm kiếm khách hàng mua đất nghỉ dưỡng</li>
        <li>Tổ chức khảo sát đất và đo đạc</li>
        <li>Hỗ trợ thủ tục công chứng và sang tên</li>
        <li>Kết nối với cơ quan địa phương khi cần</li>
      </ul>

      <h3>Quyền lợi</h3>
      <ul>
        <li>Hoa hồng theo từng giao dịch</li>
        <li>Hỗ trợ phương tiện di chuyển nội tỉnh</li>
        <li>Được đào tạo kiến thức địa phương</li>
        <li>Lịch làm việc linh hoạt</li>
      </ul>

      <h3>Yêu cầu</h3>
      <ul>
        <li>Yêu thích thiên nhiên và du lịch</li>
        <li>Chủ động liên hệ khách hàng</li>
        <li>Biết sử dụng công cụ bản đồ</li>
        <li>Trung thực, cầu tiến</li>
      </ul>
    `
  }
])

const additionalAssignedJobs = [
  {
    id: 16,
    title: 'Cộng tác viên dự án mới 1',
    salary: 20000000,
    salaryVisible: false,
    location: 'Quận 2, TP.HCM',
    date: '01/12/2023',
    image: getRandomImage(13),
    creator: 'Tập đoàn Vingroup',
    income: '20-50 triệu',
    applicants: 5
  },
  {
    id: 17,
    title: 'Cộng tác viên dự án mới 2',
    salary: 18000000,
    salaryVisible: false,
    location: 'Quận 7, TP.HCM',
    date: '02/12/2023',
    image: getRandomImage(14),
    creator: 'Công ty BĐS Phú Gia',
    income: '18-45 triệu',
    applicants: 3
  }
]

// Reactive variables
const isLoggedIn = ref(false) // Change to true to test logged in state
const hoveredJob = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Computed properties
const totalPages = computed(() => Math.ceil(availableJobs.value.length / itemsPerPage.value))
const paginatedJobs = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  return availableJobs.value.slice(startIndex, startIndex + itemsPerPage.value)
})

// Carousel methods
const loadMoreJobs = async () => {
  if (isLoading.value) return

  isLoading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const startIndex = allAssignedJobs.value.length
    const newJobs = additionalAssignedJobs.slice(startIndex, startIndex + slidesPerView.value)

    if (newJobs.length > 0) {
      allAssignedJobs.value = [...allAssignedJobs.value, ...newJobs]
      updateDisplayedJobs()
    }

  } catch (error) {
    console.error('Error loading more jobs:', error)
  } finally {
    isLoading.value = false
  }
}

const updateDisplayedJobs = () => {
  const startIndex = currentSlide.value * slidesPerView.value
  displayedAssignedJobs.value = allAssignedJobs.value.slice(startIndex, startIndex + slidesPerView.value)
}

const nextSlide = async () => {
  const maxSlide = Math.ceil(allAssignedJobs.value.length / slidesPerView.value) - 1

  if (currentSlide.value >= maxSlide) {
    await loadMoreJobs()
  }

  if (currentSlide.value < Math.ceil(allAssignedJobs.value.length / slidesPerView.value) - 1) {
    currentSlide.value++
    updateDisplayedJobs()
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
    updateDisplayedJobs()
  }
}

// Initialize carousel
const initializeCarousel = () => {
  allAssignedJobs.value = [...initialAssignedJobs]
  updateDisplayedJobs()

  // Xử lý kéo ngang trên mobile
  if (carouselTrack.value) {
    let startX = 0
    let currentX = 0
    let isDragging = false

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX
      isDragging = true
    }

    const handleTouchMove = (e) => {
      if (!isDragging) return
      currentX = e.touches[0].clientX
    }

    const handleTouchEnd = async () => {
      if (!isDragging) return

      const diff = startX - currentX
      const threshold = 50

      if (diff > threshold) {
        await nextSlide()
      } else if (diff < -threshold) {
        prevSlide()
      }

      isDragging = false
    }

    carouselTrack.value.addEventListener('touchstart', handleTouchStart)
    carouselTrack.value.addEventListener('touchmove', handleTouchMove)
    carouselTrack.value.addEventListener('touchend', handleTouchEnd)
  }
}

// Methods
const formatSalary = (salary) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(salary)
}

const hideSalary = (salary) => {
  const salaryStr = salary.toString()
  return salaryStr.charAt(0) + 'x.xxx.xxx ₫'
}

const toggleSalaryVisibility = (jobId) => {
  // Kiểm tra nếu chưa đăng nhập
  if (!isLoggedIn.value) {
    showLoginAlert();
    return;
  }

  const allJobs = [...initialAssignedJobs, ...availableJobs.value]
  const job = allJobs.find(j => j.id === jobId)
  if (job) {
    job.salaryVisible = !job.salaryVisible
  }
}

// Thêm hàm hiển thị thông báo đăng nhập
const showLoginAlert = () => {
  Swal.fire({
    title: 'Yêu cầu đăng nhập',
    text: 'Bạn cần đăng nhập để xem mức lương chi tiết',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Đăng nhập',
    cancelButtonText: 'Để sau',
    confirmButtonColor: '#0030FF',
    cancelButtonColor: '#6c757d'
  }).then((result) => {
    if (result.isConfirmed) {
      // Chuyển hướng đến trang đăng nhập
      router.push('/dang-nhap');
    }
  });
}

// Filter variables
const locationFilter = ref('')
const districtFilter = ref('')
const wardFilter = ref('')
const showSalaryModal = ref(false)
const salaryRange = ref({
  min: 0,
  max: 50000000
})

const resetLocationFilter = () => {
  locationFilter.value = ''
}

const resetDistrictFilter = () => {
  districtFilter.value = ''
}

const resetWardFilter = () => {
  wardFilter.value = ''
}

const openSalaryModal = () => {
  showSalaryModal.value = true
}

const closeSalaryModal = () => {
  showSalaryModal.value = false
}

const applySalaryFilter = () => {
  closeSalaryModal()
  // Logic áp dụng bộ lọc lương ở đây
}

const resetSalaryFilter = () => {
  salaryRange.value = { min: 0, max: 50000000 }
}

const formatSalaryDisplay = () => {
  if (salaryRange.value.min === 0 && salaryRange.value.max === 50000000) {
    return 'Tất cả mức lương'
  }
  return `${formatSalary(salaryRange.value.min)} - ${formatSalary(salaryRange.value.max)}`
}

// Initialize
onMounted(() => {
  initializeCarousel()
})
</script>

<style scoped>
/* Carousel Styles */
.carousel-container {
  position: relative;
  margin-bottom: 50px;
  padding: 0 50px;
}

.carousel-track {
  display: flex;
  gap: 30px;
  transition: transform 0.3s ease;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.carousel-track::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.carousel-slide {
  flex: 0 0 calc(33.333% - 20px);
  min-width: 0;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(3, 19, 88, 0.3);
}

.carousel-btn:hover {
  background: linear-gradient(135deg, #0030FF, #031358);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn-prev {
  left: 0;
}

.carousel-btn-next {
  right: 0;
}

.carousel-btn i {
  font-size: 18px;
}

.loading-indicator {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
}

.loading-indicator i {
  margin-right: 10px;
}

@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

.collaborator-recruitment {
  margin-top: 60px;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Ubuntu', sans-serif;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Banner Header */
.banner-header {
  background-image: url('/imgs/ctv.png');
  background-size: cover;
  background-position: center;
  color: white;
  padding: 80px 20px;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.left-column {
  flex: 1;
  padding-right: 40px;
}

.main-title {
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: left;
  line-height: 1.2;
}

.sub-title {
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 30px;
  text-align: left;
}

.description {
  font-size: 20px;
  line-height: 1.6;
  text-align: justify;
  padding-left: 50px;
  position: relative;
}

.description::before {
  content: "🔗";
  position: absolute;
  left: 0;
  top: 0;
}

.right-column {
  flex: 0 0 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glass-effect {
  width: 250px;
  height: 250px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.logo {
  width: 80%;
  filter: brightness(0) invert(1);
}

/* Main Container */
.main-container {
  padding: 60px 20px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: left;
  color: #031358;
}

/* View Toggle */
.view-toggle-container {
  display: flex;
  gap: 5px;
  margin-left: 20px;
}

.view-toggle-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #e8e8e8;
  background: #fff;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-toggle-btn:hover {
  border-color: #0030FF;
  color: #0030FF;
}

.view-toggle-btn.active {
  background: linear-gradient(135deg, #031358, #0030FF);
  border-color: #0030FF;
  color: white;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.filter-container {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.filter-item {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 200px;
}

.filter-item.active {
  background: linear-gradient(135deg, #031358, #0030FF);
  border-color: #0030FF;
}

.filter-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-right: 2px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-item.active .filter-icon {
  background: transparent;
  border-right-color: rgba(255, 255, 255, 0.3);
}

.filter-icon i {
  font-size: 16px;
  color: #6b7280;
  transition: all 0.3s ease;
}

.filter-item.active .filter-icon i {
  color: #fff;
}

.filter-select {
  border: none;
  padding: 10px 12px;
  font-size: 13px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  min-width: 180px;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
}

.filter-select option {
  color: #374151;
  background: #fff;
}

.filter-item.active .filter-select {
  background: transparent;
  color: #fff;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 14px;
}

.filter-item.active .filter-select option {
  color: #374151;
  background: #fff;
}

.salary-display {
  padding: 10px 12px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  min-width: 140px;
  white-space: nowrap;
}

.filter-item.active .salary-display {
  color: #fff;
}

/* Modal mức lương */
.salary-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-header h3 {
  margin: 0;
  color: #031358;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.salary-range {
  margin-bottom: 24px;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
}

.range-slider {
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
}

.slider {
  position: absolute;
  width: 100%;
  height: 4px;
  background: #e8e8e8;
  border-radius: 2px;
  outline: none;
  pointer-events: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #031358, #0030FF);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 2px 8px rgba(3, 19, 88, 0.3);
  border: 2px solid #fff;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #031358, #0030FF);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 2px 8px rgba(3, 19, 88, 0.3);
  border: 2px solid #fff;
}

.selected-range {
  text-align: center;
  margin-top: 20px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-weight: 600;
  color: #031358;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-apply, .btn-reset {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-apply {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: #fff;
}

.btn-apply:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(3, 19, 88, 0.3);
}

.btn-reset {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-reset:hover {
  background: #e5e7eb;
}

/* CSS cho thanh tìm kiếm */
.search-container {
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 200px;
}

.search-box.has-content {
  border-color: #0030FF !important;
  box-shadow: 0 0 0 3px rgba(0, 48, 255, 0.1);
}

.search-box.has-content .search-icon {
  background: linear-gradient(135deg, #031358, #0030FF);
  border-right-color: rgba(255, 255, 255, 0.3);
}

.search-box.has-content .search-icon i {
  color: #fff;
}

.search-box:focus-within {
  border-color: #0030FF !important;
  box-shadow: 0 0 0 3px rgba(0, 48, 255, 0.1);
}

.search-box:focus-within .search-icon {
  background: linear-gradient(135deg, #031358, #0030FF);
  border-right-color: rgba(255, 255, 255, 0.3);
}

.search-box:focus-within .search-icon i {
  color: #fff;
}

.search-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-right: 2px solid #e8e8e8;
  transition: all 0.3s ease;
}

.search-icon i {
  font-size: 16px;
  color: #6b7280;
  transition: all 0.3s ease;
}

.search-input {
  flex: 1;
  border: none;
  padding: 10px 12px;
  font-size: 13px;
  background: #fff;
  color: #374151;
  outline: none;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-clear {
  background: none;
  border: none;
  padding: 8px;
  margin-right: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #6b7280;
}

.search-clear:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Dạng lưới */
.jobs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 50px;
}

.job-item {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.job-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.job-content {
  display: flex;
  padding: 20px;
  gap: 15px;
  flex-grow: 1;
}

.job-image {
  flex: 0 0 100px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
}

.job-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.job-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.job-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #031358;
  line-height: 1.3;
}

.job-info-row {
  display: flex;
  align-items: center;
}

.job-detail {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.job-detail.salary {
  font-weight: 600;
  color: #e74c3c;
}

.icon {
  margin-right: 8px;
  font-size: 14px;
  min-width: 16px;
}

.salary-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-salary {
  cursor: pointer;
  font-size: 12px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.toggle-salary:hover {
  opacity: 1;
}

/* Buttons */
.info-btn {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border: none;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.info-btn:hover {
  background: linear-gradient(135deg, #0030FF, #031358);
}

.job-actions {
  display: flex;
  padding: 0 20px 20px;
  gap: 10px;
}

.btn-register {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border: none;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  border-radius: 8px;
}

.btn-register.half-width {
  width: 50%;
}

.btn-detail {
  background: transparent;
  color: #0030FF;
  border: 2px solid #0030FF;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  width: 90%;
  margin: 5px auto;
}

.btn-detail:hover {
  background: #0030FF;
  color: white;
}

.btn-detail-2 {
  background: transparent;
  color: #0030FF;
  border: 2px solid #0030FF;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  width: 50%;
}

.btn-detail-2:hover {
  background: #0030FF;
  color: white;
}

/* Dạng bảng */
.jobs-table-container {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  overflow-x: auto;
}

.jobs-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  color: white;
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 16px;
  border-bottom: 2px solid #e8e8e8;
  position: relative;
}

thead {
  background: linear-gradient(135deg, #031358, #0030FF);
}

.table-header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.table-row {
  border-bottom: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-cell {
  padding: 16px 20px;
  vertical-align: middle;
}

.job-title-cell {
  min-width: 250px;
}

.job-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.job-image-table {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.job-image-table img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.job-info-table {
  flex: 1;
}

.job-title-table {
  font-size: 16px;
  font-weight: 600;
  color: #031358;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.job-creator {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.salary-cell {
  min-width: 150px;
}

.salary-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #e74c3c;
}

.location-cell, .date-cell {
  min-width: 150px;
}

.location-wrapper, .date-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.location-icon, .date-icon {
  color: #6b7280;
  width: 16px;
  text-align: center;
}

.action-cell {
  min-width: 180px;
}

.action-wrapper {
  display: flex;
  gap: 8px;
}

.btn-register-table {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  white-space: nowrap;
}

.btn-register-table:hover {
  background: linear-gradient(135deg, #0030FF, #031358);
  transform: translateY(-1px);
}

.btn-detail-table {
  background: transparent;
  color: #0030FF;
  border: 1px solid #0030FF;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  white-space: nowrap;
}

.btn-detail-table:hover {
  background: #0030FF;
  color: white;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.page-btn.active,
.page-btn:hover {
  background: linear-gradient(135deg, #031358, #0030FF);
  color: white;
  border-color: #0030FF;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .section-header {
    flex-direction: column;
    gap: 16px;
  }

  .view-toggle-container {
    order: 1;
    margin-left: 0;
    margin-bottom: 10px;
  }

  .filter-container {
    order: 2;
    justify-content: center;
    width: 100%;
  }

  .jobs-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .banner-content {
    flex-direction: column;
    text-align: center;
  }

  .left-column {
    padding-right: 0;
    margin-bottom: 40px;
  }

  .description {
    text-align: center;
    padding-left: 0;
  }

  .description::before {
    display: none;
  }
}

@media (max-width: 768px) {
  .jobs-grid {
    grid-template-columns: 1fr;
  }

  .main-title {
    font-size: 32px;
  }

  .sub-title {
    font-size: 24px;
  }

  .description {
    font-size: 18px;
  }

  .glass-effect {
    width: 200px;
    height: 200px;
  }

  .job-content {
    flex-direction: column;
    text-align: center;
  }

  .job-image {
    align-self: center;
  }

  .job-info-row {
    justify-content: center;
  }

  .search-box {
    width: 100%;
  }

  .search-input {
    min-width: 0;
  }

  .filter-container {
    flex-direction: column;
    width: 100%;
  }

  .filter-item {
    width: 100%;
  }

  .filter-select, .salary-display {
    flex: 1;
  }

  .jobs-table {
    min-width: 700px;
  }

  .jobs-table-container {
    border-radius: 8px;
    margin-left: -10px;
    margin-right: -10px;
    border-radius: 0;
  }

  .table-header {
    padding: 10px 12px;
    font-size: 13px;
  }

  .table-cell {
    padding: 10px 12px;
  }

  .job-title-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .job-image-table {
    width: 40px;
    height: 40px;
  }

  .job-title-table {
    font-size: 13px;
  }

  .job-creator {
    font-size: 12px;
  }

  .salary-wrapper, .location-wrapper, .date-wrapper {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    margin: 20px;
    width: calc(100% - 40px);
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-apply, .btn-reset {
    width: 100%;
  }

  .job-actions {
    flex-direction: column;
  }

  .btn-register.half-width,
  .btn-detail {
    width: 100%;
  }

  .action-wrapper {
    flex-direction: column;
  }

  .btn-register-table, .btn-detail-table {
    width: 100%;
    font-size: 11px;
    padding: 6px 10px;
  }
}
</style>