<template>
  <div class="file-bar d-flex align-items-center justify-content-between mb-3 rounded-4 bg-white">
    <!-- BÊN TRÁI -->
    <div class="d-flex align-items-center gap-4 flex-wrap">
      <div
          class="d-flex align-items-center gap-1 file-counter text-primary"
          role="button"
          @click="openLightbox(0)"
      >
        <i class="fa-regular fa-image fs-5"></i>
        <span class="fw-semibold small">Ảnh ({{ images.length }})</span>
      </div>

      <div
          class="d-flex align-items-center gap-1 file-counter text-secondary"
          role="button"
          @click="openFileModal"
      >
        <i class="fa-regular fa-file-lines fs-5"></i>
        <span class="fw-semibold small">File ({{ files.length }})</span>
      </div>

      <div
          v-if="(images.length || files.length) && allowDownloadAll "
          class="d-flex align-items-center gap-1 text-success"
          role="button"
          @click="downloadAllFiles"
      >
        <i class="fa-solid fa-cloud-arrow-down fs-5"></i>
        <span class="fw-semibold small">Tải xuống (tất cả)</span>
      </div>
    </div>
    <!-- BÊN PHẢI -->
    <div v-if="canEdit && onUpload">
      <button type = "button"
          class="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
          @click="triggerFileUpload"
      >
        <i class="fa-solid fa-cloud-arrow-up"></i>
        <span>Thêm tệp</span>
      </button>
      <input type="file" ref="fileInput" multiple class="d-none" @change="handleFileUpload" />
    </div>
  </div>

  <!-- 📄 Modal file -->
  <div v-if="showFileModal" class="modal-backdrop" @click.self="closeFileModal">
    <div class="modal-content rounded-4 bg-white p-4" style="width: 480px;">
      <h6 class="fw-bold mb-3 text-primary">
        <i class="fa-regular fa-folder-open me-2"></i>Danh sách tệp
      </h6>
      <table class="table table-sm align-middle mb-3">
        <thead class="table-light">
        <tr>
          <th>Tên file</th>
          <th class="text-end">Hành động</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(file, idx) in files" :key="file.id">
          <td class="text-truncate small">{{ file.fileName }}</td>
          <td class="text-end">
            <button type = "button" class="btn btn-light btn-sm border me-1" @click.stop="downloadFile(file.id, file.fileName)">
              <i class="fa-solid fa-download text-primary"></i>
            </button>
            <button type = "button"
                v-if="canEdit"
                class="btn btn-light btn-sm border"
                @click.stop="removeFile(idx)"
            >
              <i class="fa-solid fa-trash text-danger"></i>
            </button>
          </td>
        </tr>
        <tr v-if="files.length === 0">
          <td colspan="2" class="text-center text-muted small">Không có tệp nào</td>
        </tr>
        </tbody>
      </table>
      <div class="text-end">
        <button type = "button" class="btn btn-secondary btn-sm" @click="closeFileModal">Đóng</button>
      </div>
    </div>
  </div>

  <!-- 🖼 Lightbox full-screen -->
  <div v-if="previewIndex !== null" class="lightbox" @click.self="closeLightbox">
    <div class="lightbox-wrapper">
      <div class="image-container position-relative d-flex align-items-center justify-content-center">
        <!-- Nút trái -->
        <button type = "button"
            v-if="previewIndex > 0"
            class="btn nav-btn left"
            @click.stop="prevImage"
            title="Ảnh trước"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <!-- Ảnh chính -->
        <img :src="previewUrls[previewIndex]" class="lightbox-img" />

        <!-- Nút phải -->
        <button type = "button"
            v-if="previewIndex < previewUrls.length - 1"
            class="btn nav-btn right"
            @click.stop="nextImage"
            title="Ảnh kế tiếp"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>

        <!-- Nút góc phải -->
        <div class="lightbox-top-controls">
          <button type = "button" class="btn btn-dark btn-sm" @click.stop="closeLightbox" title="Đóng">
            <i class="fa-solid fa-xmark text-white"></i>
          </button>
          <button type = "button" class="btn btn-dark btn-sm"@click.stop="downloadFile(images[previewIndex]?.id, images[previewIndex]?.fileName)" title="Tải ảnh này">
            <i class="fa-solid fa-download text-success"></i>
          </button>
          <button type = "button"
              v-if="canEdit"
              class="btn btn-dark btn-sm"
              @click.stop="removeImage(previewIndex)"
              title="Xóa ảnh"
          >
            <i class="fa-solid fa-trash text-danger"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { fetchBulkDownloadUrl, fetchPrivateDownloadUrl, loadPrivateFileDataUrl } from "../api/fileApi.js";
import { showError } from "../assets/js/alertService.js";

const props = defineProps({
  fileList: { type: Array, required: true },
  entityId: { type: Number, required: true },       // 👈 id project/workitem
  entityType: { type: String, required: true },     // 👈 "project" hoặc "workitem"
  canEdit: { type: Boolean, default: true },
  onUpload: { type: Boolean, default: true },
  allowDownloadAll: { type: Boolean, default: true }
});

const emit = defineEmits(["update:files"]);

const fileInput = ref(null);
const images = ref([]);
const files = ref([]);
const previewUrls = ref([]);
const previewIndex = ref(null);
const showFileModal = ref(false);



onMounted(() => {
  const list = Array.isArray(props.fileList) ? props.fileList : [];

  images.value = list.filter((f) => f && isImage(f.fileName));
  files.value = list.filter((f) => f && !isImage(f.fileName));

  document.body.style.overflow = "auto";
});

onBeforeUnmount(() => cleanupPreviewUrls());

const isImage = (fileName) => /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName);

function triggerFileUpload() {
  if (!props.canEdit) return;
  fileInput.value?.click();
}

function handleFileUpload(e) {
  if (!props.canEdit) return;

  const newFiles = Array.from(e.target.files);
  const uploaded = [];

  newFiles.forEach((f) => {
    const obj = { fileName: f.name, id: null, file: f };
    uploaded.push(obj);

    if (isImage(f.name)) images.value.push(obj);
    else files.value.push(obj);
  });

  // ✅ Emit toàn bộ danh sách (gồm cả cũ + mới)
  const allFiles = [...images.value, ...files.value];
  emit("update:files", allFiles);

  // Reset input file để có thể chọn lại cùng tên file lần sau
  e.target.value = "";
}


// === Lightbox ===
async function openLightbox(startIndex) {

  console.log("Chạy")
  cleanupPreviewUrls();
  previewUrls.value = [];
  document.body.style.overflow = "hidden";

  for (const img of images.value) {
    try {
      if (img?.file instanceof File) {

        const localUrl = URL.createObjectURL(img.file);
        previewUrls.value.push(localUrl);
      } else if (img?.id) {
        const signedUrl = await loadPrivateFileDataUrl(img.id);
        if (signedUrl) previewUrls.value.push(signedUrl);
      }

    } catch (err) {
      console.error("❌ Lỗi tải ảnh:", img.id, err);
    }
  }

  if (previewUrls.value.length > 0) previewIndex.value = startIndex;
}

function closeLightbox() {
  previewIndex.value = null;
  cleanupPreviewUrls();
  document.body.style.overflow = "auto";
}

function cleanupPreviewUrls() {
  previewUrls.value
    .filter((u) => u?.startsWith("blob:"))
    .forEach((u) => URL.revokeObjectURL(u));
  previewUrls.value = [];
}

function nextImage() { if (previewIndex.value < previewUrls.value.length - 1) previewIndex.value++; }
function prevImage() { if (previewIndex.value > 0) previewIndex.value--; }

function removeImage(i) {
  if (!props.canEdit) return;
  // Xóa ảnh hiện tại
  images.value.splice(i, 1);
  previewUrls.value.splice(i, 1);

  // Nếu không còn ảnh nào → đóng
  if (previewUrls.value.length === 0) {
    closeLightbox();
    emit("update:files", [...images.value, ...files.value]);
    return;
  }

  // Nếu còn ảnh sau → hiển thị ảnh kế tiếp (giữ nguyên index)
  if (i < previewUrls.value.length) {
    previewIndex.value = i;
  }
  // Nếu vừa xoá ảnh cuối → lùi lại 1 ảnh
  else if (i >= previewUrls.value.length) {
    previewIndex.value = previewUrls.value.length - 1;
  }
  emit("update:files", [...images.value, ...files.value]);
}


function openFileModal() { showFileModal.value = true; }
function closeFileModal() { showFileModal.value = false; }
function removeFile(i) {
  if (!props.canEdit) return;
  files.value.splice(i, 1);
  emit("update:files", [...images.value, ...files.value]);
}

async function downloadFile(fileId, fileName1) {
  try {
    const downloadUrl = await fetchPrivateDownloadUrl(fileId);
    if (!downloadUrl) throw new Error("Không lấy được link tải");

    triggerBrowserDownload(downloadUrl, fileName1);
  } catch (error) {
    console.error("❌ Lỗi tải file:", error);
    if (error.name !== "AbortError") showError("Không thể tải file. Vui lòng thử lại.");
  }
}

async function downloadAllFiles() {
  const id = props.entityId;
  const flag = props.entityType;

  try {
    const downloadUrl = await fetchBulkDownloadUrl(id, flag);
    if (!downloadUrl) throw new Error("Không lấy được link tải tất cả tệp");

    triggerBrowserDownload(downloadUrl, `files_${flag}_${id}.zip`);
  } catch (error) {
    console.error("❌ Lỗi tải tất cả file:", error);
    showError("Không thể tải tệp. Vui lòng thử lại.");
  }
}

function triggerBrowserDownload(url, fileName) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";
  if (fileName) a.download = fileName;
  a.click();
}
</script>

<style scoped>
.file-bar {
  transition: all 0.2s ease;
  margin-top: 4px;
  margin-bottom: 4px;
}
.file-bar:hover { background-color: #f8fafc; }
.file-counter:hover {
  opacity: 0.9;
  transform: scale(1.02);
  transition: 0.2s ease;
}

/* === Lightbox ảnh === */
.lightbox {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
  overflow: hidden;
}
.lightbox-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
  transition: transform 0.3s ease;
  box-shadow: 0 0 40px rgba(255, 255, 255, 0.25);
}
.lightbox-top-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.65);
  border: none;
  border-radius: 50%;
  padding: 0.8rem 1rem;
  color: white;
  font-size: 1.4rem;
  z-index: 5;
  transition: 0.2s ease;
}
.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.05);
}
.nav-btn.left {
  left: -3rem; /* nằm sát bên trái ảnh */
}
.nav-btn.right {
  right: -3rem; /* nằm sát bên phải ảnh */
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
</style>
