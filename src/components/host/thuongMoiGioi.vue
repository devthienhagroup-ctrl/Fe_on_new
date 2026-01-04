    <template>
      <div class="reward-admin">

        <!-- HEADER -->
        <div class="admin-header-container">
          <div class="header-content">
            <div class="header-icon rank-1">
              <i class="fa fa-trophy"></i>
            </div>
            <div class="header-meta">
              <span class="header-subtitle">Quản trị hệ thống • Chính sách thưởng</span>
              <h1 class="header-title">Cấu hình chính sách khen thưởng</h1>
            </div>
          </div>

          <!-- Actions -->
          <div class="header-actions">
            <div class="mode-indicator" :class="policyMode.toLowerCase()">
              <i class="fa" :class="policyMode === 'NATIONAL' ? 'fa-globe-asia' : 'fa-map-marked-alt'"></i>
              {{ policyMode === 'NATIONAL' ? 'Toàn quốc' : 'Khu vực' }}
            </div>

            <!-- ROW ACTION BUTTONS -->
            <div class="header-action-row">
              <button
                  v-if="editMode"
                  class="btn btn-action-cancel"
                  @click="cancelEdit"
              >
                <i class="fa fa-times"></i>
                Hủy
              </button>

              <button
                  class="btn btn-action-main"
                  :class="editMode ? 'btn-save' : 'btn-edit'"
                  @click="toggleEditMode"
              >
                <i class="fa" :class="editMode ? 'fa-save' : 'fa-pen'"></i>
                {{ editMode ? 'Lưu thay đổi' : 'Chỉnh sửa' }}
              </button>
            </div>
          </div>
        </div>

        <!-- POLICY MODE SWITCH -->
        <div class="policy-switch-tabs">
          <div class="tabs-container">
            <button
                class="policy-tab"
                :class="{ active: policyMode === 'NATIONAL' }"
                @click="policyMode = 'NATIONAL'"
            >
              <div class="tab-icon national">
                <i class="fa fa-globe-asia"></i>
              </div>
              <div class="tab-content">
                <div class="tab-title">Toàn quốc</div>
                <div class="tab-subtitle">Chính sách chung</div>
              </div>
            </button>

            <button
                class="policy-tab"
                :class="{ active: policyMode === 'PROVINCE' }"
                @click="policyMode = 'PROVINCE'"
            >
              <div class="tab-icon province">
                <i class="fa fa-map-marked-alt"></i>
              </div>
              <div class="tab-content">
                <div class="tab-title">Khu vực</div>
                <div class="tab-subtitle">Tỉnh / Thành phố</div>
              </div>
            </button>
          </div>
          <div class="tabs-indicator" :style="policyMode === 'PROVINCE' ? 'transform: translateX(100%);' : ''"></div>
        </div>

        <!-- TIERS với 3 hạng KHÁC BIỆT HOÀN TOÀN -->
        <div class="tiers-admin">
          <div
              v-for="tier in activePolicy"
              :key="tier.rank"
              class="tier-admin-card"
              :class="'rank-' + tier.rank"
          >
            <!-- Card Header -->
            <div class="tier-card-header" :style="getRankGradient(tier.rank)">
              <div class="tier-rank-badge" :style="{ 'background-color': getRankColor(tier.rank, 'primary'), 'color': 'white' }">
                <span class="rank-text">TOP</span>
                <span class="rank-number">{{ tier.rank }}</span>
              </div>
              <div class="tier-title-section">
                <div
                    class="tier-title-input-wrapper"
                    v-if="editMode"
                    :style="{
      border: `2px solid ${getRankColor(tier.rank, 'primary')}`,
      borderRadius: '8px'
    }"
                >
                <input
                      v-model="tier.title"
                      class="form-control tier-title-input-admin"
                      :placeholder="'Tên hạng ' + tier.rank"
                      :style="{ 'color': getRankColor(tier.rank, 'primary') }"
                  />
                </div>
                <template v-else>
                  <h3 class="tier-title-display" style=" color: black !important;">
                    {{ tier.title }}
                  </h3>
                  <div class="tier-subtitle" style="color: #051931; font-weight: 600; font-size: 14px">{{ getTierSubtitle(tier.rank) }}</div>
                </template>
              </div>
            </div>

            <!-- Card Body -->
            <div class="tier-card-body">
              <!-- Reward Amount -->
              <div class="tier-amount-section">
                <label class="section-label">
                  <i class="fa fa-award me-1"></i>Giá trị thưởng
                </label>
                <div class="amount-display-wrapper">
                  <div v-if="editMode" class="amount-input-wrapper">
                    <div class="input-group">
                      <input
                          type="number"
                          v-model.number="tier.amount"
                          class="form-control tier-amount-input-admin"
                          :style="{ 'border-color': getRankColor(tier.rank, 'primary') }"
                      />
                      <span class="input-group-text" :style="{
                        'background-color': getRankColor(tier.rank, 'light'),
                        'color': getRankColor(tier.rank, 'primary'),
                        'border-color': getRankColor(tier.rank, 'primary')
                      }">VNĐ</span>
                    </div>
                  </div>
                  <div v-else class="tier-amount-display">
                    <span class="amount-value" :style="{ color: getRankColor(tier.rank, 'primary') }">
                      {{ formatMoney(tier.amount) }}
                    </span>
                    <span class="amount-currency">VNĐ</span>
                  </div>
                </div>
              </div>

              <!-- Conditions Section -->
              <div class="conditions-section">
                <div class="section-header">
                  <label class="section-label">
                    <i class="fa fa-clipboard-check me-1"></i>Mô tả áp dụng
                  </label>
                  <div class="condition-count" :style="{
                    'background-color': getRankColor(tier.rank, 'light'),
                    'color': getRankColor(tier.rank, 'primary')
                  }">
                    {{ tier.conditions.length }} Mô tả
                  </div>
                </div>

                <div class="conditions-list">
                  <div
                      v-for="(condition, index) in tier.conditions"
                      :key="condition.id"
                      class="condition-item-admin"
                      :class="{ 'editing': editMode }"
                      :style="editMode ? { 'border-color': getRankColor(tier.rank, 'light') } : {}"
                  >
                    <div class="condition-content">
                      <i class="fa fa-check-circle condition-icon" :style="{ color: getRankColor(tier.rank, 'primary') }"></i>
                      <div class="condition-text-wrapper">
                        <input
                            v-if="editMode"
                            v-model="condition.text"
                            class="form-control condition-input-admin"
                            placeholder="Nhập Mô tả..."
                            :style="{ 'border-color': getRankColor(tier.rank, 'light') }"
                        />
                        <div v-else class="condition-text">{{ condition.text }}</div>
                      </div>
                    </div>
                    <button
                        v-if="editMode"
                        class="btn btn-icon btn-remove-condition"
                        @click="removeCondition(tier, index)"
                        title="Xóa Mô tả"
                        :style="{ 'color': getRankColor(tier.rank, 'primary') }"
                    >
                      <i class="fa fa-times"></i>
                    </button>
                  </div>
                </div>

                <!-- Add Condition Button -->
                <button
                    v-if="editMode"
                    class="btn btn-add-condition-admin"
                    @click="addCondition(tier)"
                    :style="{
                      'border-color': getRankColor(tier.rank, 'primary')
                    }"
                >
                  <i class="fa fa-plus-circle"></i>
                  Thêm Mô tả mới
                </button>
                <div v-else-if="!tier.conditions.length" class="no-conditions">
                  <i class="fa fa-info-circle"></i>
                  Chưa có Mô tả nào được thiết lập
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="tier-card-footer" :style="{ 'background-color': getRankColor(tier.rank, 'lightest') }">
              <div class="tier-stats">
                <div class="stat-item">
                  <div class="stat-value" :style="{ 'color': getRankColor(tier.rank, 'primary') }">
                    {{ tier.conditions.length }}
                  </div>
                  <div class="stat-label" >Mô tả</div>
                </div>
                <div class="stat-divider" :style="{ 'background-color': getRankColor(tier.rank, 'light') }"></div>
                <div class="stat-item">
                  <div class="stat-value" :style="{ 'color': getRankColor(tier.rank, 'primary') }">
                    {{ formatMoney(tier.amount) }}
                  </div>
                  <div class="stat-label" >Mức thưởng</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>

    <script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    import api from '/src/api/api.js'
    import {
      showCenterSuccess,
      showCenterError,
      showCenterWarning
    } from '/src/assets/js/alertService.js'

    /* ================== STATE ================== */

    const editMode = ref(false)
    const policyMode = ref('NATIONAL')

    const nationalPolicy = ref([])
    const provincePolicy = ref([])

    /* ================== COLORS ================== */

    const rankColors = {
      1: {
        primary: '#1E3A8A',
        dark: '#172554',
        light: '#DBEAFE',
        lightest: '#EFF6FF',
        muted: '#3B82F6',
        gradient: 'linear-gradient(135deg, #1E3A8A, #2563EB)'
      },
      2: {
        primary: '#059669',
        dark: '#047857',
        light: '#D1FAE5',
        lightest: '#ECFDF5',
        muted: '#34D399',
        gradient: 'linear-gradient(135deg, #10B981, #059669)'
      },
      3: {
        primary: '#D97706',
        dark: '#B45309',
        light: '#FEF3C7',
        lightest: '#FFFBEB',
        muted: '#F59E0B',
        gradient: 'linear-gradient(135deg, #F59E0B, #D97706)'
      }
    }

    const getRankColor = (rank, type = 'primary') =>
        rankColors[rank]?.[type] || rankColors[1][type]

    const getRankGradient = (rank) =>
        rankColors[rank]?.gradient || rankColors[1].gradient

    /* ================== COMPUTED ================== */

    const activePolicy = computed(() =>
        policyMode.value === 'NATIONAL'
            ? nationalPolicy.value
            : provincePolicy.value
    )

    /* ================== API ================== */

    const loadPolicy = async () => {
      try {
        const res = await api.get('/api/admin/reward-policy', {
          params: { type: policyMode.value }
        })

        const mapped = res.data.map(item => ({
          rank: item.thuHang,
          title: item.tieuDe,
          amount: item.soTienThuong,
          conditions: (item.moTaHangThuongs || []).map(m => ({
            id: m.id,
            text: m.noiDungMoTa
          }))
        }))

        if (policyMode.value === 'NATIONAL') {
          nationalPolicy.value = mapped
        } else {
          provincePolicy.value = mapped
        }
      } catch (e) {
        console.error(e)
        showCenterError('Không tải được chính sách thưởng')
      }
    }

    const savePolicy = async () => {
      if (!validatePolicy()) return false

      try {
        await api.put(
            '/api/admin/reward-policy',
            activePolicy.value,
            { params: { type: policyMode.value } }
        )

        showCenterSuccess('Lưu chính sách thưởng thành công')
        await loadPolicy()
        return true
      } catch (e) {
        console.error(e)
        showCenterError('Lưu chính sách thưởng thất bại')
        return false
      }
    }


    /* ================== VALIDATE ================== */

    const validatePolicy = () => {
      for (const tier of activePolicy.value) {
        if (!tier.title || !tier.title.trim()) {
          showCenterWarning(`Vui lòng nhập tên hạng TOP ${tier.rank}`)
          return false
        }

        if (!tier.amount || tier.amount <= 0) {
          showCenterWarning(`Mức thưởng TOP ${tier.rank} không hợp lệ`)
          return false
        }

        for (const c of tier.conditions) {
          if (!c.text || !c.text.trim()) {
            showCenterWarning(`Mô tả TOP ${tier.rank} không được để trống`)
            return false
          }
        }
      }
      return true
    }

    /* ================== ACTIONS ================== */

    const addCondition = (tier) => {
      if (!editMode.value) return
      tier.conditions.push({
        id: Date.now(),
        text: ''
      })
    }

    const removeCondition = (tier, index) => {
      if (!editMode.value) return
      tier.conditions.splice(index, 1)
    }
    const backupPolicy = ref([])
    const toggleEditMode = async () => {
      // BẬT EDIT
      if (!editMode.value) {
        backupPolicy.value = JSON.parse(JSON.stringify(activePolicy.value))
        editMode.value = true
        return
      }

      // ĐANG EDIT → LƯU
      const success = await savePolicy()

      if (!success) {
        // ❌ validate fail hoặc API lỗi → GIỮ editMode
        return
      }

      // ✅ LƯU OK → THOÁT EDIT
      editMode.value = false
    }


    // ========== Hàm hủy thay đổi ==========================
    const cancelEdit = () => {

      if (policyMode.value === 'NATIONAL') {
        nationalPolicy.value = JSON.parse(JSON.stringify(backupPolicy.value))
      } else {
        provincePolicy.value = JSON.parse(JSON.stringify(backupPolicy.value))
      }

      editMode.value = false
    }


    /* ================== UI HELPERS ================== */

    const getTierSubtitle = (rank) => {
      const subtitles = {
        1: 'Vị trí dẫn đầu • Ưu tiên cao nhất',
        2: 'Thành tích xuất sắc • Vị trí quan trọng',
        3: 'Thành tích tốt • Khuyến khích phát triển'
      }
      return subtitles[rank] || 'Hạng mục thưởng'
    }

    const formatMoney = (v) =>
        new Intl.NumberFormat('vi-VN').format(v)

    /* ================== LIFECYCLE ================== */

    watch(policyMode, async () => {
      await loadPolicy()
    })

    onMounted(async () => {
      await loadPolicy()
    })
    </script>

  <style scoped>
  /* ===== ACTION BUTTON ROW ===== */
  .header-action-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* ===== CANCEL BUTTON ===== */
  .btn-action-cancel {
    padding: 0.625rem 1.25rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.875rem;
    border: 1px solid #e5e7eb;
    background: #f9fafb;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
  }

  .btn-action-cancel:hover {
    background: #fee2e2;
    color: #b91c1c;
    border-color: #fecaca;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(185, 28, 28, 0.2);
  }

  /* ===== LAYOUT CONTAINER ===== */
  .reward-admin {
    padding-top: 20px;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #1f2937;
  }

  /* ===== ADMIN HEADER ===== */
  .admin-header-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .header-content {
    display: flex;
    gap: 1rem;
    flex: 1;
  }

  .header-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
  }

  /* Màu TÍM cho icon header */
  .header-icon.rank-1 {
    background: linear-gradient(
        135deg,
        #FACC15 0%,   /* vàng sáng */
        #F59E0B 45%,  /* vàng kim */
        #D97706 100%  /* vàng đậm */
    );
    box-shadow:
        0 4px 14px rgba(245, 158, 11, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
    color: #7C2D12;
  }


  .header-meta {
    flex: 1;
  }

  .header-subtitle {
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }

  .header-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
    line-height: 1.2;
  }

  .header-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.75rem;
  }

  .mode-indicator {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
    transition: all .25s ease;
    border: 1px solid transparent;
  }


  .mode-indicator.national {
    background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
    color: #1E3A8A;
    border-color: #93C5FD;
  }

  .mode-indicator.province {
    background: linear-gradient(135deg, #ECFDF5, #D1FAE5);
    color: #059669;
    border-color: #6EE7B7;
  }

  .btn-action-main {
    padding: 0.625rem 1.25rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-edit {
    background: #8B5CF6;
    color: white;
  }

  .btn-edit:hover {
    background: #7C3AED;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }

  .btn-save {
    background: #EA580C;
    color: white;
  }

  .btn-save:hover {
    background: #C2410C;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
  }

  /* ===== POLICY TABS ===== */
  .policy-switch-tabs {
    position: relative;
    background: white;
    border-radius: 12px;
    padding: 0.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .tabs-container {
    display: flex;
    position: relative;
    z-index: 1;
  }

  .policy-tab {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .policy-tab:hover {
    background: #f9fafb;
  }

  .policy-tab.active {
    color: #111827;
    background-color: rgba(122, 181, 250, 0.29); /* ánh sáng nhẹ */
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.08);
  }


  .tab-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.2s ease;
  }

  .tab-icon.national {
    background: linear-gradient(135deg, #8B5CF6, #7C3AED);
  }

  .tab-icon.province {
    background: linear-gradient(135deg, #0D9488, #0F766E);
  }

  .tab-content {
    flex: 1;
  }

  .tab-title {
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 0.125rem;
  }

  .tab-subtitle {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .tabs-indicator {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    width: calc(50% - 0.5rem);
    height: calc(100% - 1rem);
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
  }

  /* ===== TIER CARDS - 3 HẠNG HOÀN TOÀN KHÁC BIỆT ===== */
  .tiers-admin {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .tier-admin-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
  }

  .tier-admin-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }

  /* Border màu đặc trưng theo rank */
  /* TOP 1 – NAVY (Leader / Luxury) */
  .tier-admin-card.rank-1 {
    border-top: 4px solid #1E3A8A;
  }

  /* TOP 2 – EMERALD GREEN (Growth / Success) */
  .tier-admin-card.rank-2 {
    border-top: 4px solid #059669;
  }

  /* TOP 3 – AMBER GOLD (Highlight / Reward) */
  .tier-admin-card.rank-3 {
    border-top: 4px solid #D97706;
  }


  .tier-card-header {
    padding: 1.5rem 1.5rem 1rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    position: relative;
    overflow: hidden;
    color: white;
  }

  .tier-rank-badge {
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    text-align: center;
    min-width: 60px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    position: relative;
    z-index: 1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
  }

  .rank-text {
    display: block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    opacity: 0.9;
  }

  .rank-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1;
  }

  .tier-title-section {
    flex: 1;
    position: relative;
    z-index: 1;
  }

  .tier-title-display {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
    color: white !important;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .tier-subtitle {
    font-size: 0.75rem;
    font-weight: 500;
    opacity: 0.95;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .tier-title-input-admin {
    font-size: 1rem;
    font-weight: 600;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    width: 100%;
    background: rgba(255, 255, 255, 0.9);
    color: #111827;
  }

  .tier-title-input-admin:focus {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    outline: none;
    border-color: white;
  }

  .tier-card-body {
    padding: 1.5rem;
    flex: 1;
  }

  /* Amount Section */
  .tier-amount-section {
    margin-bottom: 1.5rem;
  }

  .section-label {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .amount-display-wrapper {
    margin-bottom: 0.5rem;
  }

  .tier-amount-input-admin {
    font-size: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px 0 0 8px;
    padding: 0.75rem;
    font-weight: 600;
    text-align: right;
    transition: all 0.2s ease;
  }

  .tier-amount-input-admin:focus {
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    outline: none;
    z-index: 1;
  }

  .input-group-text {
    border: 2px solid #e5e7eb;
    border-left: none;
    border-radius: 0 8px 8px 0;
    font-weight: 600;
    padding: 0.75rem 1rem;
    transition: all 0.2s ease;
  }

  .tier-amount-display {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .amount-value {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
  }

  .amount-currency {
    font-size: 1rem;
    font-weight: 600;
    color: #6b7280;
  }

  .amount-hint {
    font-size: 0.75rem;
    font-style: italic;
  }

  /* Conditions Section */
  .conditions-section {
    border-top: 1px solid #f3f4f6;
    padding-top: 1.5rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .condition-count {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }

  .conditions-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .condition-item-admin {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.875rem;
    background: #f9fafb;
    border-radius: 10px;
    border: 1px solid transparent;
    transition: all 0.2s ease;
  }

  .condition-item-admin.editing {
    background: white;
    border-color: #e5e7eb;
  }

  .condition-item-admin:hover {
    background: white;
    border-color: #d1d5db;
  }

  .condition-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    flex: 1;
  }

  .condition-icon {
    font-size: 1rem;
    margin-top: 0.125rem;
    flex-shrink: 0;
  }

  .condition-text-wrapper {
    flex: 1;
  }

  .condition-text {
    font-size: 0.875rem;
    color: #374151;
    line-height: 1.5;
    text-align: left !important;
  }

  .condition-input-admin {
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    width: 100%;
    color: #374151;
  }

  .condition-input-admin:focus {
    border-color: #8B5CF6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
    outline: none;
  }

  .btn-remove-condition {
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    background: transparent;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .btn-remove-condition:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .btn-add-condition-admin {
    width: 100%;
    padding: 0.75rem;
    border: 2px dashed #d1d5db;
    background: transparent;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-add-condition-admin:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  .no-conditions {
    text-align: center;
    padding: 2rem 1rem;
    color: #9ca3af;
    font-size: 0.875rem;
    background: #f9fafb;
    border-radius: 10px;
    border: 1px dashed #d1d5db;
  }

  .no-conditions i {
    display: block;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #d1d5db;
  }

  /* Card Footer */
  .tier-card-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tier-stats {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 700;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .stat-divider {
    width: 1px;
    height: 24px;
  }

  .tier-status {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  </style>