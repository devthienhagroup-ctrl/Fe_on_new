<template>
  <div class="thg-modal-backdrop">
    <div class="thg-modal">
      <!-- Header -->
      <div class="thg-modal-header">
        <h5 class="mb-0">
          <i class="fas fa-calendar-alt"></i> Đặt lịch hẹn
        </h5>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Body -->
      <div class="thg-modal-body">
        <div>
          <div class="info-box">
            <p>
              <i class="fas fa-user"></i> <strong>Khách hàng:</strong> {{ customerName }}
            </p>
            <p>
              <i class="fas fa-map-marker-alt"></i> <strong>Địa chỉ tài sản:</strong> {{ assetAddress }}
            </p>
          </div>

          <!-- Contact via Zalo -->
          <div class="form-group mt-3">
            <label class="form-label">
              <i class="fas fa-comments"></i> Chúng tôi có thể liên hệ với bạn qua Zalo chứ?
            </label>
            <select v-model="form.contactZalo" @change="toggleZaloInput" class="form-control">
              <option value="">-- Chọn giúp mình nhé --</option>
              <option value="yes">Có, liên hệ Zalo</option>
              <option value="no">Không, vui lòng gọi điện</option>
            </select>

            <div v-if="showZaloInput" class="zalo-contact">
              <p v-if="errors.zaloPhone" class="input-error">{{ errors.zaloPhone }}</p>
              <input
                  type="tel"
                  v-model="form.zaloPhone"
                  class="form-control"
                  placeholder="Nhập số điện thoại Zalo"
              />

            </div>
          </div>
          <!-- Appointment Branch -->
          <div class="form-group mt-3">
            <label class="form-label">
              <i class="fas fa-building"></i> Bạn muốn đến đâu để gặp chúng tôi?
            </label>
            <select v-model="form.branch" class="form-control">
              <option value="">-- Chọn chi nhánh --</option>
              <option value="14 đường 15, KĐT Vạn Phúc, Hiệp Bình Phước, Thủ Đức, TP.HCM">14 đường 15, KĐT Vạn Phúc, Hiệp Bình Phước, Thủ Đức, TP.HCM</option>
              <option value="01 Hoa Lài, Phường 7, Quận Phú Nhuận, TP.HCM">01 Hoa Lài, Phường 7, Quận Phú Nhuận, TP.HCM</option>
            </select>
            <p v-if="errors.branch" class="input-error">{{ errors.branch }}</p>
          </div>

          <!-- Appointment Date -->
          <div class="form-group mt-3">
            <label class="form-label">
              <i class="fas fa-calendar-day"></i> Ngày hẹn
            </label>
            <input type="date" v-model="form.date" class="form-control" />
            <p v-if="errors.date" class="input-error">{{ errors.date }}</p>
          </div>

          <!-- Appointment Time -->
          <div class="form-group mt-3">
            <label class="form-label">
              <i class="fas fa-clock"></i> Giờ hẹn
            </label>
            <input type="time" v-model="form.time" class="form-control" />
            <p v-if="errors.time" class="input-error">{{ errors.time }}</p>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <div class="thg-modal-footer">
        <button class="btn thg-btn-secondary" @click="closeModal">
          <i class="fas fa-clock"></i> Để sau
        </button>
        <button class="btn thg-btn-primary" @click="submitForm">
          <i class="fas fa-check"></i> Xác nhận lịch hẹn
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {useAuthStore} from "../../../../stores/authStore.js";
const auth = useAuthStore();
const errors = ref({
  zaloPhone: "",
  date: "",
  time: "",
  branch: "",
});
function validateForm() {
  errors.value = {
    zaloPhone: "",
    date: "",
    time: ""
  };

  let valid = true;

  const today = new Date();
  const selectedDate = new Date(form.value.date + "T00:00:00");
  const selectedTime = form.value.time;

  // Validate ngày
  if (!form.value.date) {
    errors.value.date = "Vui lòng chọn ngày hẹn!";
    valid = false;

  } else if (selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    errors.value.date = "Ngày hẹn phải từ hôm nay trở đi!";
    valid = false;
  }

  // Validate giờ
  if (!selectedTime) {
    errors.value.time = "Vui lòng chọn giờ hẹn!";
    valid = false;

  } else {
    // Chuyển giờ:phút → phút từ 00:00
    const [hour, minute] = selectedTime.split(":").map(Number);
    const totalMinutes = hour * 60 + minute;

    const minTime = 8 * 60 + 30;     // 08:30
    const maxTime = 17 * 60;         // 17:00
    const breakStart = 12 * 60;      // 12:00
    const breakEnd = 13 * 60 + 30;   // 13:30

    // Giờ hợp lệ trong 08:30 - 17:00
    if (totalMinutes < minTime || totalMinutes > maxTime) {
      errors.value.time = "Giờ hẹn phải từ 08:30 đến 17:00!";
      valid = false;
    }

    // Chặn giờ nghỉ trưa
    if (totalMinutes >= breakStart && totalMinutes < breakEnd) {
      errors.value.time = "Giờ nghỉ trưa (12:00 - 13:30), vui lòng chọn giờ khác!";
      valid = false;
    }

    // Nếu chọn hôm nay → giờ phải lớn hơn thời điểm hiện tại
    if (selectedDate.toDateString() === today.toDateString()) {
      const nowMinutes = today.getHours() * 60 + today.getMinutes();

      if (totalMinutes <= nowMinutes) {
        errors.value.time = "Thời gian phải lớn hơn thời điểm hiện tại!";
        valid = false;
      }
    }
  }

  // Validate Zalo
  if (form.value.contactZalo === "yes") {
    const phone = form.value.zaloPhone;

    if (!phone) {
      errors.value.zaloPhone = "Vui lòng nhập số điện thoại Zalo!";
      valid = false;
    } else {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

      if (!phoneRegex.test(phone)) {
        errors.value.zaloPhone = "Số Zalo không hợp lệ! Vui lòng nhập đúng 10 chữ số.";
        valid = false;
      }
    }
  }

  if (!form.value.branch) {
    errors.value.branch = "Vui lòng chọn chi nhánh!";
    valid = false;
  }


  return valid;
}
// Props từ cha
const props = defineProps({
  landAssetId: Number,
  valuationId: Number,
  assetAddress: String,
  show: Boolean,
  purpose: String
});

const emit = defineEmits(["close"]);
console.log("TTTTT", auth.userInfo)
const customerName = auth.userInfo.fullName;
const assetAddress =  props.assetAddress;
const loaded = ref(false);
const showZaloInput = ref(false);

const form = ref({
  contactZalo: "",
  zaloPhone: "",
  date: "",
  time: "",
  branch: "",
});
console.log( props )
// Toggle hiển thị ô nhập Zalo
function toggleZaloInput() {
  showZaloInput.value = form.value.contactZalo === 'yes';
}



function closeModal() {
  emit("close");
}

import api from "../../../../api/api.js";
import { showLoading, updateAlertSuccess, showWarning } from "../../../../assets/js/alertService.js";

async function submitForm() {
  if (!validateForm()) {
    return;
  }

  try {
    const appointmentAt = `${form.value.date}T${form.value.time}`;

    const payload = {
      landId: props.landAssetId,
      valuationId: props.valuationId,
      appointmentAt: appointmentAt,
      zalo: form.value.zaloPhone || null,
      purpose: props.purpose,
      branch: form.value.branch
    };
    closeModal();
    const res = await showLoading(api.post("/customer-appointment/create", payload));

    if (res.data?.success === false) {
      showWarning(res.data.message || "Không thể tạo lịch hẹn!");
      return;
    }

    updateAlertSuccess("🎉 Đặt lịch hẹn thành công!");

    emit("reload");

  } catch (e) {
    console.error(e);
    showWarning("Có lỗi xảy ra khi tạo lịch hẹn!");
  }
}

watch(
    () => props.show,
    (newVal) => {
      if (newVal) {
        loadInfo();
        // Reset form khi mở modal
        form.value = {
          contactZalo: "",
          zaloPhone: "",
          date: "",
          time: "",
          branch: ""
        };
        showZaloInput.value = false;
      }
    }
);
</script>

<style scoped>
/* Backdrop */
.input-error {
  color: #d9534f;
  font-size: 13px;
  margin-top: 4px;
}

.thg-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Modal */
.thg-modal {
  width: 95%;
  max-width: 480px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  animation: fadeDown 0.25s ease;
}

@keyframes fadeDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Header */
.thg-modal-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #8B5FBF, #6A3093);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.thg-modal-header h5 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Body */
.thg-modal-body {
  padding: 20px;
}

.info-box {
  background: #f8f5ff;
  padding: 12px 16px;
  border-radius: 10px;
  border-left: 4px solid #8B5FBF;
}

.info-box p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #5a4a6a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #8B5FBF;
  box-shadow: 0 0 0 2px rgba(139, 95, 191, 0.2);
}

select.form-control {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a4a6a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

/* Zalo Contact */
.zalo-contact {
  margin-top: 8px;
  padding: 10px;
  background: #f0f7ff;
  border-radius: 6px;
  border-left: 3px solid #0068ff;
}

.zalo-contact p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #0068ff;
  display: flex;
  align-items: center;
  gap: 6px;
}

.zalo-contact .form-control {
  border-color: #0068ff;
}

/* Footer */
.thg-modal-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.thg-btn-primary {
  background: linear-gradient(135deg, #8B5FBF, #6A3093);
  color: white;
}

.thg-btn-primary:hover {
  background: linear-gradient(135deg, #7a4da8, #5a277d);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(139, 95, 191, 0.3);
}

.thg-btn-secondary {
  background: #f0f0f0;
  color: #5a4a6a;
}

.thg-btn-secondary:hover {
  background: #e0e0e0;
}

.loading-text {
  padding: 20px;
  text-align: center;
  color: #777;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.fa-spin {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mt-3 {
  margin-top: 16px;
}

.mb-0 {
  margin-bottom: 0;
}
</style>