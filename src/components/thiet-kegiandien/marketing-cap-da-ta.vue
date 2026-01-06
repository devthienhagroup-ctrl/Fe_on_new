<template>
  <div class="mkt-data-system">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <h1 class="page-title">
          <i class="fas fa-users"></i>
          Quản lý Dữ liệu Khách hàng - Phòng Marketing
        </h1>
        <p class="page-subtitle">Nhập và quản lý thông tin khách hàng từ nhiều nền tảng</p>
      </div>
      <div class="header-right">
        <div class="user-info">
          <div class="user-avatar">
            <i class="fas fa-user-tie"></i>
          </div>
          <div class="user-details">
            <span class="user-name">Nhân viên Marketing</span>
            <span class="user-role">Phòng Marketing</span>
          </div>
          <button class="logout-btn">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Dashboard Stats -->
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-icon primary">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Hôm nay</h3>
          <p class="stat-value">{{ stats.today }}</p>
          <p class="stat-desc">khách hàng đã nhập</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">
          <i class="fas fa-calendar-alt"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Tháng trước</h3>
          <p class="stat-value">{{ stats.lastMonth }}</p>
          <p class="stat-desc">khách hàng đã nhập</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon info">
          <i class="fas fa-phone-volume"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Liên lạc được</h3>
          <p class="stat-value">{{ stats.contacted }}</p>
          <p class="stat-desc">khách hàng</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">
          <i class="fas fa-phone-slash"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Không liên lạc được</h3>
          <p class="stat-value">{{ stats.notContacted }}</p>
          <p class="stat-desc">khách hàng</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Form Section -->
      <div class="card form-card">
        <div class="card-header">
          <h2 class="card-title">
            <i class="fas fa-user-plus"></i>
            Thêm khách hàng mới
          </h2>
          <div class="card-subtitle">Nhập thông tin khách hàng từ các nền tảng</div>
        </div>

        <div class="card-body">
          <form @submit.prevent="submitForm" class="customer-form">
            <div class="form-grid">
              <!-- Row 1 -->
              <div class="form-group">
                <label class="form-label required">Họ tên khách hàng</label>
                <input
                    type="text"
                    v-model="formData.fullName"
                    class="form-control"
                    placeholder="Nhập họ tên đầy đủ"
                    required
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Số điện thoại</label>
                <input
                    type="tel"
                    v-model="formData.phone"
                    class="form-control"
                    placeholder="Nhập số điện thoại"
                    required
                >
              </div>

              <div class="form-group">
                <label class="form-label required">Khu vực (tỉnh/thành)</label>
                <select
                    v-model="formData.area"
                    class="form-control"
                    required
                >
                  <option value="">Chọn tỉnh/thành</option>
                  <option v-for="area in areas" :key="area" :value="area">{{ area }}</option>
                </select>
              </div>

              <!-- Row 2 -->
              <div class="form-group">
                <label class="form-label required">Giá bán (VNĐ)</label>
                <input
                    type="number"
                    v-model="formData.price"
                    class="form-control"
                    placeholder="Nhập giá bán"
                    required
                >
                <div class="form-hint">Giá ban đầu chủ nhà ra</div>
              </div>

              <div class="form-group">
                <label class="form-label">Ảnh tài sản</label>
                <div class="file-upload">
                  <input
                      type="file"
                      ref="fileInput"
                      @change="handleFileUpload"
                      accept="image/*"
                      class="file-input"
                  >
                  <div class="file-upload-area" @click="triggerFileInput">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p v-if="!formData.image">Chọn file ảnh</p>
                    <p v-else>{{ formData.image.name }}</p>
                    <span class="file-hint">Chọn file từ máy tính</span>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label required">Phân loại</label>
                <div class="radio-group">
                  <label class="radio-label" v-for="type in customerTypes" :key="type.value">
                    <input
                        type="radio"
                        v-model="formData.type"
                        :value="type.value"
                        required
                    >
                    <span class="radio-custom"></span>
                    {{ type.label }}
                  </label>
                </div>
              </div>

              <!-- Row 3 -->
              <div class="form-group full-width">
                <label class="form-label">Ghi chú</label>
                <textarea
                    v-model="formData.notes"
                    class="form-control"
                    rows="3"
                    placeholder="Ghi chú thêm về khách hàng..."
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="resetForm">
                <i class="fas fa-redo"></i>
                Làm mới
              </button>
              <button type="submit" class="btn btn-primary">
                <i class="fas fa-save"></i>
                {{ isEditing ? 'Cập nhật' : 'Thêm khách hàng' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Customer List -->
      <div class="card list-card">
        <div class="card-header">
          <div class="card-header-left">
            <h2 class="card-title">
              <i class="fas fa-list"></i>
              Danh sách khách hàng đang xử lý
            </h2>
            <div class="card-subtitle">Dữ liệu chưa được chuyển đến Telesale</div>
          </div>

          <div class="card-header-right">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Tìm kiếm theo tên, SĐT, khu vực..."
                  class="search-input"
              >
            </div>

            <div class="action-buttons">
              <button
                  class="btn btn-danger"
                  @click="deleteSelected"
                  :disabled="selectedCustomers.length === 0"
              >
                <i class="fas fa-trash"></i>
                Xóa đã chọn
              </button>

              <button
                  class="btn btn-primary"
                  @click="transferSelected"
                  :disabled="selectedCustomers.length === 0"
              >
                <i class="fas fa-paper-plane"></i>
                Cấp data đã chọn
              </button>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="table-responsive">
            <table class="customer-table">
              <thead>
              <tr>
                <th width="50">
                  <input
                      type="checkbox"
                      v-model="selectAll"
                      @change="toggleSelectAll"
                  >
                </th>
                <th>Họ tên</th>
                <th>SĐT</th>
                <th>Khu vực</th>
                <th>Giá bán</th>
                <th>Phân loại</th>
                <th>Trạng thái</th>
                <th>Ngày nhập</th>
                <th>Thao tác</th>
              </tr>
              </thead>

              <tbody>
              <tr v-if="filteredCustomers.length === 0">
                <td colspan="9" class="empty-state">
                  <i class="fas fa-inbox"></i>
                  <p>Không có dữ liệu khách hàng đang xử lý</p>
                </td>
              </tr>

              <tr
                  v-for="customer in filteredCustomers"
                  :key="customer.id"
                  :class="{ selected: isSelected(customer.id) }"
              >
                <td>
                  <input
                      type="checkbox"
                      :value="customer.id"
                      v-model="selectedCustomers"
                  >
                </td>
                <td>
                  <div class="customer-name">
                    {{ customer.fullName }}
                    <span v-if="customer.notes" class="note-indicator" title="Có ghi chú">
                        <i class="fas fa-sticky-note"></i>
                      </span>
                  </div>
                </td>
                <td>{{ customer.phone }}</td>
                <td>
                  <span class="area-badge">{{ customer.area }}</span>
                </td>
                <td class="price-cell">{{ formatPrice(customer.price) }} VNĐ</td>
                <td>
                    <span :class="['type-badge', getTypeClass(customer.type)]">
                      {{ customer.type }}
                    </span>
                </td>
                <td>
                    <span :class="['status-badge', getStatusClass(customer.status)]">
                      {{ getStatusText(customer.status) }}
                    </span>
                </td>
                <td>{{ formatDate(customer.dateAdded) }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                        class="btn-icon btn-edit"
                        @click="editCustomer(customer)"
                        title="Chỉnh sửa"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                        class="btn-icon btn-delete"
                        @click="deleteCustomer(customer.id)"
                        title="Xóa"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <div class="selected-count">
              Đã chọn: {{ selectedCustomers.length }} / {{ filteredCustomers.length }}
            </div>

            <div class="telesale-info">
              <div class="telesale-stat">
                <i class="fas fa-user"></i>
                <span>Telesale 1: {{ telesaleEmployees[0].todayCount }}/5 data hôm nay</span>
              </div>
              <div class="telesale-stat">
                <i class="fas fa-user"></i>
                <span>Telesale 2: {{ telesaleEmployees[1].todayCount }}/5 data hôm nay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="card chart-card">
        <div class="card-header">
          <h2 class="card-title">
            <i class="fas fa-chart-bar"></i>
            Thống kê theo khu vực
          </h2>
        </div>

        <div class="card-body">
          <div class="chart-container">
            <div class="chart">
              <div
                  v-for="(count, area) in stats.byArea"
                  :key="area"
                  class="chart-bar"
                  :style="{ height: (count / maxAreaCount * 100) + '%' }"
                  :title="`${area}: ${count} khách`"
              >
                <div class="bar-label">{{ count }}</div>
              </div>
            </div>
            <div class="chart-labels">
              <div v-for="(count, area) in stats.byArea" :key="area" class="chart-label">
                {{ area }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transfer Modal -->
    <div v-if="showTransferModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-paper-plane"></i>
            Chuyển dữ liệu đến Telesale
          </h3>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <p class="modal-text">
            Chọn nhân viên Telesale để nhận <strong>{{ selectedCustomers.length }}</strong> data khách hàng:
          </p>

          <div class="employee-list">
            <div
                v-for="employee in telesaleEmployees"
                :key="employee.id"
                :class="['employee-card', { selected: selectedEmployee === employee.id }]"
                @click="selectEmployee(employee.id)"
            >
              <div class="employee-avatar">
                <i class="fas fa-user-tie"></i>
              </div>
              <div class="employee-info">
                <h4>{{ employee.name }}</h4>
                <p class="employee-status">
                  Đã nhận: {{ employee.todayCount }}/{{ employee.dailyLimit }} data hôm nay
                </p>
                <div class="progress-bar">
                  <div
                      class="progress-fill"
                      :style="{ width: (employee.todayCount / employee.dailyLimit * 100) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="employee-check">
                <i class="fas fa-check" v-if="selectedEmployee === employee.id"></i>
              </div>
            </div>
          </div>

          <div v-if="selectedEmployee" class="transfer-summary">
            <div class="summary-item">
              <i class="fas fa-users"></i>
              <span>Số lượng: {{ selectedCustomers.length }} khách hàng</span>
            </div>
            <div class="summary-item">
              <i class="fas fa-user-check"></i>
              <span>Người nhận: {{ getEmployeeName(selectedEmployee) }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">
            Hủy
          </button>
          <button
              class="btn btn-primary"
              @click="confirmTransfer"
              :disabled="!selectedEmployee"
          >
            <i class="fas fa-paper-plane"></i>
            Xác nhận chuyển
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MktDataSystem',

  data() {
    return {
      // Form data
      formData: {
        fullName: '',
        phone: '',
        area: '',
        price: '',
        image: null,
        type: 'Chủ nhà',
        notes: ''
      },

      // Edit state
      isEditing: false,
      editingId: null,

      // Search
      searchQuery: '',

      // Selection
      selectedCustomers: [],
      selectAll: false,

      // Modal
      showTransferModal: false,
      selectedEmployee: null,

      // Data
      customers: [],
      nextId: 4,

      // Telesale employees
      telesaleEmployees: [
        { id: 'telesale1', name: 'Nguyễn Văn A', dailyLimit: 5, todayCount: 0 },
        { id: 'telesale2', name: 'Trần Thị B', dailyLimit: 5, todayCount: 0 }
      ],

      // Areas
      areas: [
        'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng',
        'Cần Thơ', 'Khánh Hòa', 'Bình Dương', 'Đồng Nai',
        'Hà Tĩnh', 'Nghệ An', 'Thừa Thiên Huế', 'Quảng Nam'
      ],

      // Customer types
      customerTypes: [
        { value: 'Chủ nhà', label: 'Chủ nhà' },
        { value: 'Môi giới', label: 'Môi giới' },
        { value: 'Người thân', label: 'Người thân' }
      ],

      // Stats
      stats: {
        today: 0,
        lastMonth: 24,
        contacted: 18,
        notContacted: 6,
        byArea: {
          'Hà Nội': 8,
          'TP. Hồ Chí Minh': 7,
          'Đà Nẵng': 3,
          'Khác': 6
        }
      }
    }
  },

  computed: {
    // Filter customers based on search query and status
    filteredCustomers() {
      return this.customers.filter(customer => {
        // Only show pending or overlimit customers (not transferred)
        if (customer.status === 'transferred') return false;

        // Apply search filter
        const query = this.searchQuery.toLowerCase();
        return (
            customer.fullName.toLowerCase().includes(query) ||
            customer.phone.includes(query) ||
            customer.area.toLowerCase().includes(query)
        );
      });
    },

    // Calculate max area count for chart scaling
    maxAreaCount() {
      return Math.max(...Object.values(this.stats.byArea));
    }
  },

  watch: {
    // Update stats when customers change
    customers: {
      handler() {
        this.updateStats();
      },
      deep: true
    }
  },

  created() {
    this.initializeData();
  },

  methods: {
    // Initialize with sample data
    initializeData() {
      this.customers = [
        {
          id: 1,
          fullName: 'Nguyễn Văn An',
          phone: '0912345678',
          area: 'Hà Nội',
          price: '2500000000',
          image: null,
          notes: 'Khách hàng quan tâm bán nhà mặt phố',
          type: 'Chủ nhà',
          status: 'pending',
          dateAdded: new Date().toISOString().split('T')[0]
        },
        {
          id: 2,
          fullName: 'Trần Thị Bình',
          phone: '0923456789',
          area: 'TP. Hồ Chí Minh',
          price: '3500000000',
          image: null,
          notes: 'Cần bán gấp căn hộ chung cư',
          type: 'Môi giới',
          status: 'overlimit',
          dateAdded: new Date().toISOString().split('T')[0]
        },
        {
          id: 3,
          fullName: 'Lê Văn Cường',
          phone: '0934567890',
          area: 'Đà Nẵng',
          price: '1800000000',
          image: null,
          notes: 'Nhà riêng 3 tầng',
          type: 'Chủ nhà',
          status: 'pending',
          dateAdded: new Date().toISOString().split('T')[0]
        }
      ];

      this.nextId = 4;
      this.updateStats();
    },

    // Update statistics
    updateStats() {
      const today = new Date().toISOString().split('T')[0];
      this.stats.today = this.customers.filter(c => c.dateAdded === today).length;
    },

    // Handle form submission
    submitForm() {
      if (this.isEditing) {
        // Update existing customer
        const index = this.customers.findIndex(c => c.id === this.editingId);
        if (index !== -1) {
          this.customers[index] = {
            ...this.customers[index],
            ...this.formData
          };
          console.log(`Đã cập nhật khách hàng: ${this.formData.fullName}`);
        }
      } else {
        // Add new customer
        const newCustomer = {
          id: this.nextId++,
          ...this.formData,
          status: 'pending',
          dateAdded: new Date().toISOString().split('T')[0]
        };

        this.customers.push(newCustomer);
        console.log(`Đã thêm khách hàng: ${this.formData.fullName}`);

        // Auto transfer if possible
        this.autoTransferData(newCustomer.id);
      }

      this.resetForm();
    },

    // Auto transfer data to telesale with less data
    autoTransferData(customerId) {
      const minCount = Math.min(
          this.telesaleEmployees[0].todayCount,
          this.telesaleEmployees[1].todayCount
      );

      const availableEmployee = this.telesaleEmployees.find(
          emp => emp.todayCount === minCount && emp.todayCount < emp.dailyLimit
      );

      if (availableEmployee) {
        const customerIndex = this.customers.findIndex(c => c.id === customerId);
        if (customerIndex !== -1) {
          this.customers[customerIndex].status = 'transferred';
          this.customers[customerIndex].transferredTo = availableEmployee.id;

          availableEmployee.todayCount++;

          console.log(`Đã tự động chuyển data cho ${availableEmployee.name}`);
          console.log(`${availableEmployee.name}: ${availableEmployee.todayCount}/${availableEmployee.dailyLimit}`);

          alert(`Data đã được tự động chuyển cho ${availableEmployee.name}`);
        }
      } else {
        // Mark as overlimit if both employees are at limit
        const customerIndex = this.customers.findIndex(c => c.id === customerId);
        if (customerIndex !== -1) {
          this.customers[customerIndex].status = 'overlimit';
          console.log('Cả hai nhân viên đã đạt giới hạn. Data sẽ được xử lý thủ công.');
        }
      }
    },

    // Handle file upload
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.image = file;
      }
    },

    // Trigger file input click
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // Edit customer
    editCustomer(customer) {
      this.formData = { ...customer };
      this.isEditing = true;
      this.editingId = customer.id;

      // Scroll to form
      document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
    },

    // Reset form
    resetForm() {
      this.formData = {
        fullName: '',
        phone: '',
        area: '',
        price: '',
        image: null,
        type: 'Chủ nhà',
        notes: ''
      };

      this.isEditing = false;
      this.editingId = null;

      // Reset file input
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    // Delete customer
    deleteCustomer(id) {
      if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
        const index = this.customers.findIndex(c => c.id === id);
        if (index !== -1) {
          this.customers.splice(index, 1);
          console.log('Đã xóa khách hàng');
        }
      }
    },

    // Delete selected customers
    deleteSelected() {
      if (this.selectedCustomers.length === 0) return;

      if (confirm(`Bạn có chắc chắn muốn xóa ${this.selectedCustomers.length} khách hàng đã chọn?`)) {
        this.customers = this.customers.filter(
            customer => !this.selectedCustomers.includes(customer.id)
        );
        this.selectedCustomers = [];
        console.log('Đã xóa khách hàng đã chọn');
      }
    },

    // Check if customer is selected
    isSelected(id) {
      return this.selectedCustomers.includes(id);
    },

    // Toggle select all
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedCustomers = this.filteredCustomers.map(c => c.id);
      } else {
        this.selectedCustomers = [];
      }
    },

    // Transfer selected customers
    transferSelected() {
      if (this.selectedCustomers.length === 0) {
        alert('Vui lòng chọn ít nhất một khách hàng để chuyển data');
        return;
      }

      // Check if any employee has capacity
      const hasCapacity = this.telesaleEmployees.some(
          emp => emp.todayCount < emp.dailyLimit
      );

      if (hasCapacity) {
        this.showTransferModal = true;
      } else {
        alert('Cả hai nhân viên Telesale đã đạt giới hạn data hôm nay. Vui lòng thử lại vào ngày mai.');
      }
    },

    // Select employee for transfer
    selectEmployee(employeeId) {
      const employee = this.telesaleEmployees.find(emp => emp.id === employeeId);

      // Check if employee has capacity for selected customers
      if (employee.todayCount + this.selectedCustomers.length > employee.dailyLimit) {
        alert(`${employee.name} chỉ còn ${employee.dailyLimit - employee.todayCount} slot trống.`);
        return;
      }

      this.selectedEmployee = employeeId;
    },

    // Get employee name by ID
    getEmployeeName(employeeId) {
      const employee = this.telesaleEmployees.find(emp => emp.id === employeeId);
      return employee ? employee.name : '';
    },

    // Confirm transfer
    confirmTransfer() {
      if (!this.selectedEmployee || this.selectedCustomers.length === 0) return;

      const employee = this.telesaleEmployees.find(emp => emp.id === this.selectedEmployee);

      // Update customer status
      this.selectedCustomers.forEach(id => {
        const customerIndex = this.customers.findIndex(c => c.id === id);
        if (customerIndex !== -1) {
          this.customers[customerIndex].status = 'transferred';
          this.customers[customerIndex].transferredTo = this.selectedEmployee;
        }
      });

      // Update employee count
      employee.todayCount += this.selectedCustomers.length;

      console.log(`Đã chuyển ${this.selectedCustomers.length} data cho ${employee.name}`);
      console.log(`${employee.name}: ${employee.todayCount}/${employee.dailyLimit}`);

      // Close modal and reset selection
      this.closeModal();
      this.selectedCustomers = [];

      alert(`Đã chuyển ${this.selectedCustomers.length} data cho ${employee.name}`);
    },

    // Close modal
    closeModal() {
      this.showTransferModal = false;
      this.selectedEmployee = null;
    },

    // Format price
    formatPrice(price) {
      return Number(price).toLocaleString('vi-VN');
    },

    // Format date
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    },

    // Get status class
    getStatusClass(status) {
      switch (status) {
        case 'pending': return 'status-pending';
        case 'transferred': return 'status-transferred';
        case 'overlimit': return 'status-overlimit';
        default: return '';
      }
    },

    // Get status text
    getStatusText(status) {
      switch (status) {
        case 'pending': return 'Đang chờ';
        case 'transferred': return 'Đã chuyển';
        case 'overlimit': return 'Vượt giới hạn';
        default: return '';
      }
    },

    // Get type class
    getTypeClass(type) {
      switch (type) {
        case 'Chủ nhà': return 'type-owner';
        case 'Môi giới': return 'type-broker';
        case 'Người thân': return 'type-relative';
        default: return '';
      }
    }
  }
}
</script>

<style scoped>
/* Reset and base styles */
.mkt-data-system {
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header */
.header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-left .page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left .page-subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 20px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  opacity: 0.8;
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Dashboard Stats */
.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  padding: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.primary { background: #e0f2fe; color: #0369a1; }
.stat-icon.success { background: #dcfce7; color: #166534; }
.stat-icon.info { background: #f0f9ff; color: #0c4a6e; }
.stat-icon.warning { background: #fef3c7; color: #92400e; }

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 5px;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2px;
}

.stat-desc {
  font-size: 12px;
  color: #94a3b8;
}

/* Main Content */
.main-content {
  padding: 0 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Cards */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 20px 30px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-left {
  flex: 1;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-subtitle {
  font-size: 14px;
  color: #64748b;
}

.card-header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-body {
  padding: 30px;
}

/* Form */
.customer-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 0;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control::placeholder {
  color: #94a3b8;
}

.form-hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 5px;
}

/* File Upload */
.file-upload {
  position: relative;
}

.file-input {
  display: none;
}

.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
}

.file-upload-area:hover {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.file-upload-area i {
  font-size: 32px;
  color: #94a3b8;
  margin-bottom: 10px;
}

.file-upload-area p {
  margin: 0;
  font-weight: 500;
  color: #475569;
}

.file-hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 5px;
}

/* Radio Group */
.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #475569;
}

.radio-label input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s;
}

.radio-label input[type="radio"]:checked + .radio-custom {
  border-color: #3b82f6;
  background: #3b82f6;
}

.radio-label input[type="radio"]:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

/* Textarea */
textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

/* Buttons */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #e2e8f0;
  color: #475569;
}

.btn-secondary:hover:not(:disabled) {
  background: #cbd5e1;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

/* Search Box */
.search-box {
  position: relative;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Table */
.table-responsive {
  overflow-x: auto;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
}

.customer-table thead {
  background: #f1f5f9;
}

.customer-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  white-space: nowrap;
  border-bottom: 2px solid #e2e8f0;
}

.customer-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  color: #475569;
}

.customer-table tbody tr:hover {
  background: #f8fafc;
}

.customer-table tbody tr.selected {
  background: #f0f9ff;
}

/* Table cells */
.customer-name {
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.note-indicator {
  color: #f59e0b;
  font-size: 12px;
}

.area-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.price-cell {
  font-weight: 600;
  color: #1e293b;
}

/* Badges */
.type-badge,
.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.type-owner { background: #dcfce7; color: #166534; }
.type-broker { background: #fef3c7; color: #92400e; }
.type-relative { background: #e0e7ff; color: #3730a3; }

.status-pending { background: #fef3c7; color: #92400e; }
.status-transferred { background: #dcfce7; color: #166534; }
.status-overlimit { background: #fee2e2; color: #991b1b; }

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-edit {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn-edit:hover {
  background: #bfdbfe;
}

.btn-delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fecaca;
}

/* Table Footer */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.selected-count {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

.telesale-info {
  display: flex;
  gap: 30px;
}

.telesale-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

.telesale-stat i {
  color: #3b82f6;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px !important;
  color: #94a3b8;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 20px;
  color: #cbd5e1;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* Chart */
.chart-card .card-body {
  padding: 30px;
}

.chart-container {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  height: 200px;
}

.chart {
  display: flex;
  align-items: flex-end;
  gap: 30px;
  flex: 1;
  height: 100%;
  padding-bottom: 30px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 6px 6px 0 0;
  min-height: 20px;
  position: relative;
  transition: height 0.3s;
}

.chart-bar:hover {
  opacity: 0.8;
}

.bar-label {
  position: absolute;
  top: -25px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.chart-labels {
  display: flex;
  gap: 30px;
  width: 100%;
  margin-top: 10px;
}

.chart-label {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(3px);
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  animation: modalAppear 0.3s ease;
}

@keyframes modalAppear {
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
  padding: 20px 30px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #e2e8f0;
  color: #475569;
}

.modal-body {
  padding: 30px;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-text {
  margin-bottom: 20px;
  color: #475569;
  line-height: 1.6;
}

.modal-text strong {
  color: #1e293b;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

/* Employee List */
.employee-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.employee-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.employee-card:hover {
  border-color: #cbd5e1;
}

.employee-card.selected {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.employee-avatar {
  width: 50px;
  height: 50px;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.employee-info {
  flex: 1;
}

.employee-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #1e293b;
}

.employee-status {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #64748b;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 3px;
  transition: width 0.3s;
}

.employee-check {
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.employee-card.selected .employee-check {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* Transfer Summary */
.transfer-summary {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #475569;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-item i {
  color: #3b82f6;
}

/* Responsive */
@media (max-width: 1200px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .header-right {
    width: 100%;
  }

  .user-info {
    width: 100%;
    justify-content: space-between;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .card-header-right {
    width: 100%;
    flex-direction: column;
  }

  .search-box {
    min-width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-stats {
    grid-template-columns: 1fr;
  }

  .telesale-info {
    flex-direction: column;
    gap: 10px;
  }

  .table-footer {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}
</style>