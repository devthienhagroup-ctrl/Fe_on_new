<script setup>
import { ref } from "vue";

const url = ref("http://localhost:8084"); // không dùng nhưng giữ nguyên UI
const total = ref(20);
const count = ref(0);
const isRunning = ref(false);

// ======================= GA4 SPAM FUNCTION =======================
async function simulateUser() {
  const clientId = `${Date.now()}.${Math.floor(Math.random() * 100000)}`;

  await fetch(
      "https://www.google-analytics.com/mp/collect?measurement_id=G-3K18DLHJY0&api_secret=G-3K18DLHJY0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: clientId,
          events: [
            {
              name: "page_view",
              params: {
                page_title: "Fake User Test",
                page_location: "http://localhost:8084test-spam",
                page_referrer: ""
              }
            }
          ]
        })
      }
  );
}

// ======================= START TEST =======================
async function startTest() {
  count.value = 0;
  isRunning.value = true;

  for (let i = 0; i < total.value; i++) {
    simulateUser().finally(() => {
      count.value++;
    });

    // delay 200ms để GA4 không drop event
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  isRunning.value = false;
}
</script>
<template>
  <div class="container my-4">

    <div class="card p-3 shadow-sm mb-4">
      <h3 class="fw-bold">
        <i class="fa-solid fa-rocket"></i>
        Test Traffic Website (REAL TAB)
      </h3>
    </div>

    <div class="card p-3 shadow-sm">

      <div class="mb-3">
        <label>URL website</label>
        <input v-model="url" class="form-control" />
      </div>

      <div class="mb-3">
        <label>Số fake user cần tạo</label>
        <input v-model="total" type="number" class="form-control" />
      </div>

      <button class="btn btn-primary" @click="startTest" :disabled="isRunning">
        <i class="fa-solid fa-paper-plane"></i>
        {{ isRunning ? 'Đang tạo user...' : 'Start Test' }}
      </button>

      <div class="mt-4">
        <h5>Kết quả:</h5>
        <div class="result-box">
          Đã gửi: <b>{{ count }}</b> / {{ total }}
        </div>
      </div>

    </div>

  </div>
</template>
