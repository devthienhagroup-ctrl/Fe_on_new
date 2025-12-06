<template>
  <div class="bottom-sheet">
    <div class="sheet-content">
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>

      <h4>Gán nhân viên phụ trách</h4>

      <!-- Search -->
      <div class="search-wrapper">
        <input type="text" class="form-control"
               placeholder="Nhập tên / email / sđt nhân viên..."
               v-model="keyword"
               @input="searchEmployeeDebounced">
      </div>

      <!-- Results -->
      <div class="result-list">
        <div
            v-for="emp in employees"
            :key="emp.employeeId"
            class="employee-item"
            @click="assign(emp)"
        >
          <img :src="emp.avatar" class="avatar">
          <div>
            <b>{{ emp.fullName }}</b>
            <p>{{ emp.email }} · {{ emp.phone }}</p>
          </div>
        </div>
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

const emit = defineEmits(["close", "assigned"]);

const keyword = ref("");
const employees = ref([]);

let timer = null;

function searchEmployeeDebounced() {
  clearTimeout(timer);
  timer = setTimeout(() => searchEmployee(), 300);
}

async function searchEmployee() {
  if (!keyword.value.trim()) {
    employees.value = [];
    return;
  }

  try {
    const res = await api.get(`/admin/customer-appointment/search?keyword=${keyword.value}`);
    employees.value = res.data.map(emp => ({
      ...emp,
      avatar: emp.avatar
          ? `https://s3.cloudfly.vn/thg-storage/uploads-public/${emp.avatar}`
          : "/imgs/default-user.png"
    }));

  } catch (e) {
    console.error(e);
  }
}

async function assign(emp) {
  try {
    const payload = {
      appointmentId: props.appointment.id,
      employeeId: emp.employeeId
    };

    const res = await showLoading(api.post("/admin/customer-appointment/assign-employee", payload));

    if (!res.data.success) {
      showWarning(res.data.message);
      return;
    }

    updateAlertSuccess("Gán nhân viên thành công!");
    emit("assigned");
    emit("close");

  } catch (e) {
    console.error(e);
    showWarning("Không gán được nhân viên!");
  }
}
</script>
<style scoped>
.bottom-sheet {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.sheet-content {
  width: 95%;
  max-width: 460px;
  max-height: 80%;
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  overflow-y: auto;
  position: relative;
  animation: popup .25s ease;
}

@keyframes popup {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.close-btn {
  position: absolute;
  right: 16px;
  top: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.employee-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.employee-item:hover {
  background: #f8f8f8;
}
.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
.search-wrapper {
  margin-bottom: 15px;
}
</style>
