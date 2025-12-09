<template>
  <div class="bottom-sheet">
    <div class="sheet-content">

      <!-- Close Button -->
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>

      <!-- Title -->
      <h4 class="sheet-title">
        <i class="fas fa-user-check text-primary"></i>
        Cập nhật tình hình khách hàng
      </h4>

      <!-- Info -->
      <div class="info-box">
        <p><strong>Khách hàng:</strong> {{ appointment.customerName }}</p>
        <p><strong>Tài sản:</strong> {{ fixAddress(appointment.assetAddress) }}</p>
        <p>
          <strong>Lịch hẹn:</strong>
          {{ appointment.appointmentAt.replace('T', ' lúc ') }}
        </p>
      </div>

      <!-- Customer came or not -->
      <div class="form-group mt-3">
        <label class="form-label">Khách có lên văn phòng không?</label>

        <div class="option-row">
          <button
              :class="['option-btn', form.cameToOffice === true ? 'active-yes' : '']"
              @click="form.cameToOffice = true"
          >
            <i class="fas fa-check-circle"></i> Có
          </button>

          <button
              :class="['option-btn', form.cameToOffice === false ? 'active-no' : '']"
              @click="form.cameToOffice = false"
          >
            <i class="fas fa-times-circle"></i> Không
          </button>
        </div>

        <p v-if="errors.cameToOffice" class="text-danger small mt-1">
          {{ errors.cameToOffice }}
        </p>
      </div>

<<<<<<< HEAD
=======
      <!-- Agree Quick Sale -->
      <div class="form-group mt-3">
        <label class="form-label">Kết quả cuộc hẹn</label>

        <div class="quick-sale-check">
          <label class="custom-checkbox" style="color: #f1744f">
            <input type="checkbox" v-model="form.agreeQuickSale" />
            <span class="checkmark"></span>
            Khách đồng ý tham gia gói <strong>Bán nhanh 30 ngày </strong>
          </label>
        </div>
      </div>

>>>>>>> cfb5ea19bfe87cd0fa9bd9fba459fa67e7f38693
      <!-- Description -->
      <div class="form-group mt-3">
        <label class="form-label">Mô tả tình hình / lý do</label>
        <textarea
            class="form-control"
            rows="4"
            v-model="form.note"
            placeholder="Ví dụ: khách bận, khách đi xem đất, khách cần thêm thời gian..."
        ></textarea>

        <p v-if="errors.note" class="text-danger small mt-1">
          {{ errors.note }}
        </p>
      </div>

      <!-- Submit -->
      <div class="submit-row">
        <button class="btn btn-primary w-100" @click="submitUpdate">
<<<<<<< HEAD
          <i class="fas fa-save"></i> Cập nhật
=======
          <i class="fas fa-save"></i> Lưu kết quả
>>>>>>> cfb5ea19bfe87cd0fa9bd9fba459fa67e7f38693
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "/src/api/api.js";
import { showLoading, updateAlertSuccess, showWarning } from "/src/assets/js/alertService.js";

const props = defineProps({
  appointment: Object
});

const emit = defineEmits(["close", "updated"]);

const form = ref({
  cameToOffice: null,   // true / false
  note: "",
  agreeQuickSale: false
});

function fixAddress(address) {
  if (!address) return "";
  return address
      .replace(/\s*\/!!\s*/g, ", ")  // thay / thành ,
      .replace(/\s+/g, " ")         // xóa khoảng trắng dư
      .trim();
}


const errors = ref({
  cameToOffice: "",
  note: ""
});

function validate() {
  errors.value = { cameToOffice: "", note: "" };
  let ok = true;

  if (form.value.cameToOffice === null) {
    errors.value.cameToOffice = "Vui lòng chọn khách có đến văn phòng hay không.";
    ok = false;
  }

  if (!form.value.note || form.value.note.trim().length < 5) {
    errors.value.note = "Vui lòng nhập mô tả tối thiểu 5 ký tự.";
    ok = false;
  }

  return ok;
}

async function submitUpdate() {
  if (!validate()) return;

  const payload = {
    appointmentId: props.appointment.id,
    cameToOffice: form.value.cameToOffice,
    note: form.value.note,
    purpose: props.appointment.purpose,
    agreeQuickSale: form.value.agreeQuickSale ? "BN30N" : null
  };

  try {
    emit("close");
    const res = await showLoading(
        api.post("/admin/customer-appointment/update-status", payload)
    );

    if (!res.data.success) {
      showWarning(res.data.message || "Cập nhật thất bại!");
      return;
    }

    updateAlertSuccess("Ghi kết quả cuộc hẹn thành công!");

    emit("updated");

  } catch (e) {
    console.error(e);
    showWarning("Không thể cập nhật!");
  }
}
</script>

<style scoped>
/* ===== Overlay làm mờ đẹp ===== */
.bottom-sheet {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* ===== Hộp nội dung popup ===== */
.sheet-content {
  width: 95%;
  max-width: 480px;
  max-height: 85%;
  background: #ffffff;
  border-radius: 18px;
  padding: 22px 20px 26px 20px;
  overflow-y: auto;
  position: relative;
  animation: popup .25s ease;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  border: 1px solid rgba(0,0,0,0.05);
}

/* Animation mượt */
@keyframes popup {
  from { transform: translateY(20px) scale(0.9); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

/* ===== Nút đóng ===== */
.close-btn {
  background: #f3f3f3;
  border: none;
  font-size: 20px;
  position: absolute;
  right: 18px;
  top: 14px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: .25s;
}
.close-btn:hover {
  background: #e9e9e9;
  transform: rotate(90deg);
}

/* ===== Tiêu đề ===== */
.sheet-title {
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 18px;
  color: #333;
}

/* ===== Hộp thông tin khách ===== */
.info-box {
  background: #f7f9fc;
  padding: 14px 14px;
  border-radius: 12px;
  font-size: 14px;
  border: 1px solid #e1e6ef;
  box-shadow: inset 0 0 4px rgba(0,0,0,0.03);
  line-height: 1.5;
}

/* ===== Nhóm chọn có/không ===== */
.option-row {
  display: flex;
  gap: 12px;
}

.option-btn {
  flex: 1;
  padding: 11px;
  border-radius: 10px;
  border: 1px solid #dcdcdc;
  text-align: center;
  background: #fafafa;
  font-weight: 500;
  cursor: pointer;
  transition: .25s;
}

.option-btn:hover {
  background: #f0f0f0;
}

.option-btn.active-yes {
  border-color: #2ecc71;
  background: linear-gradient(135deg, #28a745, #2ecc71);
  color: #fff;
  box-shadow: 0 6px 14px rgba(46, 204, 113, 0.35);
}

.option-btn.active-no {
  border-color: #e74c3c;
  background: linear-gradient(135deg, #dc3545, #e74c3c);
  color: #fff;
  box-shadow: 0 6px 14px rgba(231, 76, 60, 0.35);
}

/* ===== Checkbox BN30N đẹp ===== */
.custom-checkbox {
  position: relative;
  padding-left: 32px;
  cursor: pointer;
  font-size: 15px;
  user-select: none;
  color: #444;
  display: inline-block;
  font-weight: 500;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-checkbox .checkmark {
  position: absolute;
  left: 0;
  top: 2px;
  height: 20px;
  width: 20px;
  background-color: #ececec;
  border-radius: 6px;
  transition: all 0.25s;
  border: 1px solid #ccc;
}

.custom-checkbox:hover .checkmark {
  background-color: #e0e0e0;
}

.custom-checkbox input:checked ~ .checkmark {
  background: linear-gradient(135deg, #ff9f43, #ff7e29);
  border-color: #d96a1b;
  box-shadow: 0 3px 8px rgba(255, 126, 41, 0.45);
}

.custom-checkbox .checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* ===== Textarea ===== */
textarea.form-control {
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  transition: .25s;
}

textarea.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,.15);
}

/* ===== Nút submit đẹp ===== */
.submit-row {
  margin-top: 22px;
}

.submit-row .btn-primary {
  padding: 11px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  transition: .25s;
  background: linear-gradient(135deg, #007bff, #0056d6);
}

.submit-row .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 98, 255, 0.3);
}
</style>
