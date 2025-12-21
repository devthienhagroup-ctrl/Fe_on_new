<template>
  <div class="api-tester container mt-4">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h2 class="mb-0">API Tester</h2>
      </div>

      <div class="card-body">
        <!-- Form nhập liệu -->
        <div class="row mb-4">
          <div class="col-md-8">
            <div class="mb-3">
              <label for="api-url" class="form-label">API URL:</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-link-45deg"></i>
                </span>
                <input
                    id="api-url"
                    v-model="apiUrl"
                    type="text"
                    class="form-control"
                    placeholder="Nhập URL API (ví dụ: /api/users)"
                    @keyup.enter="sendRequest"
                />
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="mb-3">
              <label for="method" class="form-label">Phương thức:</label>
              <select
                  id="method"
                  v-model="selectedMethod"
                  class="form-select"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Request Body JSON (chỉ hiển thị với POST và PUT) -->
        <div v-if="selectedMethod === 'POST' || selectedMethod === 'PUT'" class="row mb-4">
          <div class="col-12">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <span>Request Body (JSON)</span>
                <div>
                  <button
                      v-if="requestBody.trim()"
                      class="btn btn-sm btn-outline-secondary me-2"
                      @click="formatRequestBody"
                  >
                    <i class="bi bi-code-slash me-1"></i>
                    Format JSON
                  </button>
                  <button
                      class="btn btn-sm btn-outline-info"
                      @click="loadSampleJson"
                  >
                    <i class="bi bi-lightbulb me-1"></i>
                    Mẫu JSON
                  </button>
                </div>
              </div>
              <div class="card-body p-0">
                <textarea
                    v-model="requestBody"
                    class="form-control json-editor"
                    placeholder='Nhập JSON body (ví dụ: {"name": "John", "age": 30})'
                    rows="6"
                    :class="{ 'is-invalid': jsonError }"
                    @input="clearJsonError"
                ></textarea>
                <div v-if="jsonError" class="invalid-feedback d-block p-2">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  {{ jsonError }}
                </div>
              </div>
              <div class="card-footer text-muted py-2">
                <small>
                  <i class="bi bi-info-circle me-1"></i>
                  Body chỉ áp dụng cho phương thức POST và PUT
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Nút gửi request -->
        <div class="d-flex justify-content-between mb-4">
          <button
              class="btn btn-success"
              :class="{ disabled: isLoading || !apiUrl || !isValidJson }"
              @click="sendRequest"
              :disabled="isLoading || !apiUrl || !isValidJson"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-send me-2"></i>
            {{ isLoading ? 'Đang gửi...' : 'Gửi Request' }}
          </button>

          <div>
            <button
                class="btn btn-outline-warning me-2"
                @click="clearBody"
                v-if="selectedMethod === 'POST' || selectedMethod === 'PUT'"
            >
              <i class="bi bi-trash me-2"></i>
              Clear Body
            </button>
            <button
                class="btn btn-outline-secondary"
                @click="resetForm"
            >
              <i class="bi bi-arrow-clockwise me-2"></i>
              Reset All
            </button>
          </div>
        </div>

        <!-- Kết quả API -->
        <div class="result-section">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="mb-0">Kết quả:</h5>
            <div>
              <span class="badge" :class="statusClass">
                {{ responseStatus ? `Status: ${responseStatus}` : 'Chưa có response' }}
              </span>
            </div>
          </div>

          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span>Response Data</span>
              <div>
                <button
                    v-if="responseData"
                    class="btn btn-sm btn-outline-primary me-2"
                    @click="copyToClipboard"
                >
                  <i class="bi bi-clipboard me-1"></i>
                  Copy
                </button>
                <button
                    v-if="responseData"
                    class="btn btn-sm btn-outline-secondary"
                    @click="downloadJson"
                >
                  <i class="bi bi-download me-1"></i>
                  Download
                </button>
              </div>
            </div>
            <div class="card-body p-0">
              <pre
                  v-if="responseData"
                  class="response-json p-3 mb-0"
                  :class="{ 'is-error': isError }"
              >{{ formattedResponse }}</pre>
              <div v-else class="p-3 text-muted">
                <i class="bi bi-info-circle me-2"></i>
                Kết quả API sẽ hiển thị ở đây...
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer text-muted">
        <small>
          <i class="bi bi-info-circle me-1"></i>
          Sử dụng API module từ <code>../../api/api</code>
        </small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from "../../api/api.js";

// Biến reactive
const apiUrl = ref('')
const selectedMethod = ref('GET')
const requestBody = ref('')
const responseData = ref(null)
const responseStatus = ref(null)
const isLoading = ref(false)
const isError = ref(false)
const jsonError = ref('')

// Computed property để kiểm tra body có hợp lệ không
const isValidJson = computed(() => {
  if (!requestBody.value.trim()) return true // Cho phép empty

  try {
    JSON.parse(requestBody.value)
    return true
  } catch (e) {
    return false
  }
})

// Computed property để format JSON
const formattedResponse = computed(() => {
  try {
    if (!responseData.value) return ''

    // Clone dữ liệu để không làm thay đổi response gốc
    let data = JSON.parse(JSON.stringify(responseData.value))

    // Nếu có field contentJson và nó là string, parse nó thành object
    if (data.contentJson && typeof data.contentJson === 'string') {
      try {
        data.contentJson = JSON.parse(data.contentJson)
      } catch (e) {
        // Nếu parse lỗi thì giữ nguyên string
        console.error('Lỗi parse contentJson:', e)
      }
    }

    return JSON.stringify(data, null, 2)
  } catch (error) {
    // Nếu không phải là object/JSON thì trả về string
    return String(responseData.value)
  }
})

// Computed property cho status badge
const statusClass = computed(() => {
  if (!responseStatus.value) return 'bg-secondary'

  if (responseStatus.value >= 200 && responseStatus.value < 300) {
    return 'bg-success'
  } else if (responseStatus.value >= 400 && responseStatus.value < 500) {
    return 'bg-warning text-dark'
  } else {
    return 'bg-danger'
  }
})

// Hàm gửi request API
const sendRequest = async () => {
  if (!apiUrl.value.trim() || isLoading.value) return

  // Validate JSON nếu có body
  if ((selectedMethod.value === 'POST' || selectedMethod.value === 'PUT') && requestBody.value.trim()) {
    if (!isValidJson.value) {
      jsonError.value = 'JSON body không hợp lệ. Vui lòng kiểm tra lại.'
      return
    }
  }

  isLoading.value = true
  isError.value = false
  responseData.value = null
  responseStatus.value = null
  jsonError.value = ''

  try {
    let response
    let bodyData = null

    // Parse body nếu có
    if ((selectedMethod.value === 'POST' || selectedMethod.value === 'PUT') && requestBody.value.trim()) {
      try {
        bodyData = JSON.parse(requestBody.value)
      } catch (e) {
        throw new Error('Lỗi parse JSON body: ' + e.message)
      }
    }

    switch (selectedMethod.value) {
      case 'GET':
        response = await api.get(apiUrl.value)
        break
      case 'POST':
        response = await api.post(apiUrl.value, bodyData || {})
        break
      case 'PUT':
        response = await api.put(apiUrl.value, bodyData || {})
        break
      case 'DELETE':
        response = await api.delete(apiUrl.value)
        break
      default:
        throw new Error('Phương thức không hợp lệ')
    }

    responseData.value = response.data
    responseStatus.value = response.status
  } catch (error) {
    isError.value = true
    responseData.value = {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    }
    responseStatus.value = error.response?.status || 'Error'
  } finally {
    isLoading.value = false
  }
}

// Hàm reset form
const resetForm = () => {
  apiUrl.value = ''
  selectedMethod.value = 'GET'
  requestBody.value = ''
  jsonError.value = ''
  responseData.value = null
  responseStatus.value = null
  isError.value = false
}

// Hàm clear body
const clearBody = () => {
  requestBody.value = ''
  jsonError.value = ''
}

// Hàm format JSON body
const formatRequestBody = () => {
  if (!requestBody.value.trim()) return

  try {
    const parsed = JSON.parse(requestBody.value)
    requestBody.value = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
  } catch (error) {
    jsonError.value = 'JSON không hợp lệ: ' + error.message
  }
}

// Hàm load mẫu JSON
const loadSampleJson = () => {
  requestBody.value = JSON.stringify({
    name: "Nguyễn Văn A",
    email: "example@email.com",
    age: 25,
    active: true,
    address: {
      street: "123 Đường ABC",
      city: "Hà Nội",
      country: "Việt Nam"
    },
    tags: ["user", "vip", "active"]
  }, null, 2)
  jsonError.value = ''
}

// Hàm clear json error khi người dùng bắt đầu gõ
const clearJsonError = () => {
  if (jsonError.value) {
    jsonError.value = ''
  }
}

// Hàm copy kết quả vào clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(formattedResponse.value)
    alert('Đã copy kết quả vào clipboard!')
  } catch (error) {
    console.error('Lỗi khi copy:', error)
    alert('Lỗi khi copy vào clipboard')
  }
}

// Hàm download JSON
const downloadJson = () => {
  if (!responseData.value) return

  const dataStr = JSON.stringify(responseData.value, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

  const exportFileDefaultName = `api-response-${new Date().getTime()}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}
</script>

<style scoped>
.api-tester {
  max-width: 1200px;
}

.response-json {
  background-color: #f8f9fa;
  border-radius: 0 0 0.375rem 0.375rem;
  max-height: 500px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.response-json.is-error {
  background-color: #fff5f5;
  color: #dc3545;
}

.json-editor {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.json-editor:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  outline: 0;
}

.json-editor.is-invalid {
  border-color: #dc3545;
  background-color: #fff5f5;
}

.json-editor.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.input-group-text {
  min-width: 45px;
  justify-content: center;
}

.card {
  border: 1px solid rgba(0,0,0,.125);
}

.btn-success:disabled {
  opacity: 0.65;
}

/* Custom scrollbar cho kết quả JSON */
.response-json::-webkit-scrollbar {
  width: 8px;
}

.response-json::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.response-json::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.response-json::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Custom scrollbar cho JSON editor */
.json-editor::-webkit-scrollbar {
  width: 8px;
}

.json-editor::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.json-editor::-webkit-scrollbar-thumb {
  background: #adb5bd;
  border-radius: 4px;
}

.json-editor::-webkit-scrollbar-thumb:hover {
  background: #6c757d;
}
</style>