<template>
  <!-- ================= FILE BAR ================= -->
  <div class="file-bar">
    <!-- Main buttons row - 5 buttons in one line -->
    <div class="file-buttons-row">
      <!-- View buttons (icon only) -->
      <div class="view-buttons">
        <button class="file-btn view-btn image-btn"
                :disabled="!normalImages.length"
                :class="{ 'opacity-50 pointer-events-none': !normalImages.length }"
                @click="normalImages.length && openLightbox(0,'normal')"
                title="Xem ảnh thường">
          <i class="fa-solid fa-image"></i>
        </button>

        <button class="file-btn view-btn landbook-btn"
                :disabled="!landBookImages.length"
                :class="{ 'opacity-50 pointer-events-none': !landBookImages.length }"
                @click="landBookImages.length && openLightbox(0,'landBook')"
                title="Xem ảnh sổ đỏ">
          <i class="fa-solid fa-landmark-dome"></i>
        </button>

        <button class="file-btn view-btn file-gtn-btn "
                :disabled="!files.length"
                :class="{ 'opacity-50 pointer-events-none': !files.length }"
                @click="files.length && openFileModal()"
                title="Xem tài liệu">
          <i class="fa-solid fa-file-lines"></i>
        </button>
      </div>

      <!-- Upload buttons (with text) -->
      <div class="upload-buttons" v-if="canEdit && onUpload">
        <button class="file-btn upload-btn upload-file-btn" @click="triggerFileUpload('normal')">
          <i class="fa-solid fa-plus"></i>
          <span>File</span>
        </button>

        <button class="file-btn upload-btn upload-landbook-btn" @click="triggerFileUpload('landBook')">
          <i class="fa-solid fa-plus"></i>
          <span>Sổ</span>
        </button>
      </div>

      <!-- Download all button -->
      <button v-if="(normalImages.length || landBookImages.length || files.length) && allowDownloadAll"
              class="file-btn download-all-btn"
              @click="downloadAllFiles"
              title="Tải tất cả">
        <i class="fa-solid fa-download"></i>
      </button>
    </div>

    <input ref="fileInput"
           type="file"
           multiple
           class="d-none"
           @change="handleFileUpload" />
  </div>

  <!-- ================= FILE MODAL ================= -->
  <teleport to="body">
    <div v-if="showFileModal && files.length" class="file-modal" @click.self="closeFileModal">
      <div class="file-modal-container">
        <div class="file-modal-header">
          <div class="modal-header-left">
            <div class="modal-icon">
              <i class="fa-solid fa-folder-open"></i>
            </div>
            <div>
              <h5 class="modal-title">Tài liệu</h5>
              <div class="modal-subtitle">Tổng cộng {{ files.length }} file</div>
            </div>
          </div>
          <button class="modal-close-btn" @click="closeFileModal">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <div class="file-modal-body">
          <div v-if="files.length" class="file-list">
            <div v-for="(f,i) in files" :key="i" class="file-item">
              <div class="file-icon">
                <i class="fa-solid fa-file"></i>
              </div>
              <div class="file-info">
                <div class="file-name">{{ f.fileName }}</div>
                <div class="file-size">{{ formatFileSize(f.size) }}</div>
              </div>
              <div class="file-actions">
                <button class="file-action-btn download-btn"
                        @click="downloadFile(f.id,f.fileName)"
                        title="Tải xuống">
                  <i class="fa-solid fa-download"></i>
                </button>
                <button v-if="canEdit"
                        class="file-action-btn delete-btn"
                        @click="removeFile(i)"
                        title="Xóa">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="empty-files">
            <div class="empty-icon">
              <i class="fa-solid fa-file"></i>
            </div>
            <p class="empty-text">Chưa có tài liệu nào</p>
          </div>
        </div>

        <div class="file-modal-footer">
          <button class="btn btn-outline-secondary" @click="closeFileModal">Đóng</button>
        </div>
      </div>
    </div>
  </teleport>

  <!-- ================= LIGHTBOX MODAL ================= -->
  <teleport to="body">
    <div v-if="previewIndex !== null && ((currentImageType === 'normal' && normalImages.length) || (currentImageType === 'landBook' && landBookImages.length))" class="lightbox-modal" @click.self="closeLightbox">
      <div class="lightbox-container">
        <!-- Header -->
        <div class="lightbox-header">
          <div class="lightbox-header-left">
            <span class="image-type-badge" :class="currentImageType">
              <i :class="currentImageType === 'landBook' ? 'fa-solid fa-landmark-dome' : 'fa-solid fa-image'"></i>
              {{ currentImageType === 'landBook' ? 'Sổ đỏ' : 'Ảnh thường' }}
            </span>
            <div class="image-counter">
              <span class="current-index">{{ previewIndex + 1 }}</span>
              <span class="total-images">/{{ previewUrls.length }}</span>
            </div>
          </div>

          <div class="lightbox-header-right">
            <button v-if="canEdit"
                    class="lightbox-action-btn pin-btn"
                    :class="{ active: isMainImage(previewIndex) }"
                    @click="setMainImage(previewIndex)"
                    title="Đặt làm ảnh chính">
              <i class="fa-solid fa-thumbtack"></i>
            </button>

            <button class="lightbox-action-btn download-btn"
                    @click="downloadFile(currentImage?.id, currentImage?.fileName)"
                    title="Tải xuống">
              <i class="fa-solid fa-download"></i>
            </button>

            <button v-if="canEdit"
                    class="lightbox-action-btn delete-btn"
                    @click="removeImage(previewIndex)"
                    title="Xóa">
              <i class="fa-solid fa-trash"></i>
            </button>

            <button class="lightbox-action-btn close-btn" @click="closeLightbox" title="Đóng">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Main image -->
        <div class="lightbox-body">
          <button class="nav-btn prev-btn" @click="goPrev" title="Ảnh trước">
            <i class="fa-solid fa-chevron-left"></i>
          </button>

          <div class="image-container">
            <img :src="previewUrls[previewIndex]"
                 :alt="`Image ${previewIndex + 1}`"
                 class="main-image"
                 @click="closeLightbox" />
          </div>

          <button class="nav-btn next-btn" @click="goNext" title="Ảnh sau">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <!-- Thumbnails -->
        <div class="lightbox-thumbnails">
          <div class="thumbnails-container">
            <div v-for="(u,i) in previewUrls"
                 :key="i"
                 class="thumbnail"
                 :class="{ active: i === previewIndex, pinned: isMainImage(i) }"
                 @click="previewIndex = i">
              <img :src="u" :alt="`Thumbnail ${i + 1}`" />
              <div v-if="isMainImage(i)" class="pin-indicator">
                <i class="fa-solid fa-thumbtack"></i>
              </div>
              <div class="thumbnail-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { fetchBulkDownloadUrl, fetchPrivateDownloadUrl, loadPrivateFileDataUrl } from "/src/api/fileApi.js";
import { showError } from "/src/assets/js/alertService.js";

const props = defineProps({
  fileList: Array,
  entityId: Number,
  entityType: String,
  canEdit: Boolean,
  onUpload: Boolean,
  allowDownloadAll: Boolean
});

const emit = defineEmits(["update:files"]);

const fileInput = ref(null);
const normalImages = ref([]);
const landBookImages = ref([]);
const files = ref([]);
const previewUrls = ref([]);
const previewIndex = ref(null);
const currentImageType = ref("normal");
const showFileModal = ref(false);

const currentImage = computed(() => {
  const list = currentImageType.value === "landBook"
      ? landBookImages.value
      : normalImages.value;
  return list[previewIndex.value];
});

const isImage = n => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(n);

// Hàm format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

onMounted(() => {
  const list = props.fileList || [];
  normalImages.value = list.filter(f => isImage(f.fileName) && !f.isIG);
  landBookImages.value = list.filter(f => isImage(f.fileName) && f.isIG);
  files.value = list.filter(f => !isImage(f.fileName));
});

onBeforeUnmount(cleanupPreviewUrls);

watch(
    () => props.fileList,
    (list = []) => {
      normalImages.value = list.filter(f => isImage(f.fileName) && !f.isIG);
      landBookImages.value = list.filter(f => isImage(f.fileName) && f.isIG);
      files.value = list.filter(f => !isImage(f.fileName));
    },
    { immediate: true }
);

function triggerFileUpload(type) {
  currentImageType.value = type;
  fileInput.value.click();
}

function handleFileUpload(e) {
  const arr = [...e.target.files].map(f => ({
    file: f,
    fileName: f.name,
    isIG: currentImageType.value === 'landBook',
    size: f.size
  }));

  arr.forEach(f => {
    if (isImage(f.fileName)) {
      (f.isIG ? landBookImages : normalImages).value.push(f);
    } else {
      files.value.push(f);
    }
  });

  emitAll();
  e.target.value = "";
}

async function openLightbox(i, type) {
  cleanupPreviewUrls();
  currentImageType.value = type;
  const list = type === "landBook" ? landBookImages.value : normalImages.value;

  for (const img of list) {
    if (img.file) {
      previewUrls.value.push(URL.createObjectURL(img.file));
    } else {
      previewUrls.value.push(await loadPrivateFileDataUrl(img.id));
    }
  }

  previewIndex.value = i;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  previewIndex.value = null;
  cleanupPreviewUrls();
  document.body.style.overflow = "auto";
}

function cleanupPreviewUrls() {
  previewUrls.value.forEach(u => u.startsWith("blob:") && URL.revokeObjectURL(u));
  previewUrls.value = [];
}

function removeImage(i) {
  const list = currentImageType.value === "landBook" ? landBookImages.value : normalImages.value;
  list.splice(i, 1);
  previewUrls.value.splice(i, 1);
  if (!previewUrls.value.length) closeLightbox();
  else previewIndex.value = Math.min(previewIndex.value, previewUrls.value.length - 1);
  emitAll();
}

function isMainImage(i) {
  const list = currentImageType.value === "landBook" ? landBookImages.value : normalImages.value;
  return Boolean(list[i]?.isOnTop);
}

function setMainImage(i) {
  [normalImages.value, landBookImages.value].forEach((list) => {
    list.forEach((img) => {
      if (img) img.isOnTop = false;
    });
  });
  const list = currentImageType.value === "landBook" ? landBookImages.value : normalImages.value;
  if (list[i]) list[i].isOnTop = true;
  emitAll();
}

function removeFile(i) {
  files.value.splice(i, 1);
  emitAll();
}

function emitAll() {
  emit("update:files", [...normalImages.value, ...landBookImages.value, ...files.value]);
}

function openFileModal() { showFileModal.value = true; }
function closeFileModal() { showFileModal.value = false; }

function goPrev() {
  if (previewIndex.value === null || !previewUrls.value.length) return;
  previewIndex.value = (previewIndex.value - 1 + previewUrls.value.length) % previewUrls.value.length;
}

function goNext() {
  if (previewIndex.value === null || !previewUrls.value.length) return;
  previewIndex.value = (previewIndex.value + 1) % previewUrls.value.length;
}

async function downloadFile(id, name) {
  try {
    const url = await fetchPrivateDownloadUrl(id);
    triggerBrowserDownload(url, name);
  } catch {
    showError("Không thể tải file");
  }
}

async function downloadAllFiles() {
  const url = await fetchBulkDownloadUrl(props.entityId, props.entityType);
  triggerBrowserDownload(url, `files_${props.entityType}_${props.entityId}.zip`);
}

function triggerBrowserDownload(url, name) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
}

const getKhachDaLienHe = async () => {
  try {
    const res = await api.get(
        '/customer-crm/telesales/khach-da-lien-he',
        {
          params: {
            page: 0,
            size: 10,
            status: 'DC_TELESALES', // hoặc null
            type: null,             // VD: 'NONG', 'AM'
            search: ''              // hoặc null
          }
        }
    )

    console.log('✅ Response full:', res)
    console.log('📦 Page data:', res.data)
    console.log('📋 Content:', res.data.content)
    console.log('📄 Total elements:', res.data.totalElements)
    console.log('📑 Total pages:', res.data.totalPages)

  } catch (err) {
    console.error('❌ Lỗi gọi API khach-da-lien-he:', err)
  }
}

getKhachDaLienHe();
</script>

<style scoped>
/* ================= FILE BAR (For 400px container) ================= */
.file-bar {
  width: 100%;
  max-width: 400px;
  padding: 0;          /* ❗ bỏ padding */
  border: none;        /* ❗ bỏ viền */
  background: none;    /* ❗ bỏ nền */
  box-shadow: none;    /* ❗ bỏ shadow */
}


/* Main buttons row - All 5 buttons in one line */
.file-buttons-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

/* View buttons (3 icons only) */
.view-buttons {
  display: flex;
  gap: 8px;
  flex: 1;
}

/* Upload buttons (2 buttons with text) */
.upload-buttons {
  display: flex;
  gap: 8px;
}

/* Common button style */
.file-btn {
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

/* View buttons (icon only) */
.view-btn {
  width: 40px;
  min-width: 40px;
  font-size: 16px;
}

.view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Image button */
.image-btn {
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.05);
}

.image-btn:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.5);
}

/* Landbook button */
.landbook-btn {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(245, 158, 11, 0.05);
}

.landbook-btn:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.5);
}

/* File button */

/* Upload buttons (with text) */
.upload-btn {
  padding: 0 16px;
  gap: 6px;
  font-size: 13px;
  border: 1px dashed;
}

.upload-file-btn {
  color: #4f46e5;
  border-color: rgba(79, 70, 229, 0.3);
  background: rgba(79, 70, 229, 0.05);
}

.upload-file-btn:hover {
  background: rgba(79, 70, 229, 0.1);
  border-color: rgba(79, 70, 229, 0.5);
  transform: translateY(-1px);
}

.upload-landbook-btn {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(245, 158, 11, 0.05);
}

.upload-landbook-btn:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.5);
  transform: translateY(-1px);
}

/* File GTN button */
.file-gtn-btn {
  color: #10b981; /* xanh lá */
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
}

.file-gtn-btn:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.5);
}


/* Download all button */
.download-all-btn {
  width: 40px;
  min-width: 40px;
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
  font-size: 16px;
}

.download-all-btn:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

/* File counts badges */
.file-counts {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.image-count {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.landbook-count {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.file-count {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.count-number {
  font-weight: 600;
  font-size: 13px;
}

/* ================= FILE MODAL (Full screen) ================= */
.file-modal {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.file-modal-container {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.file-modal-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.modal-subtitle {
  font-size: 13px;
  color: #64748b;
}

.modal-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: white;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: #f1f5f9;
  color: #ef4444;
}

.file-modal-body {
  padding: 20px 0;
  max-height: 60vh;
  overflow-y: auto;
}

.file-list {
  padding: 0 24px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.file-item:hover {
  background: #f8fafc;
}

.file-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(124, 58, 237, 0.1));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
  font-size: 16px;
  margin-right: 12px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 2px;
  word-break: break-all;
}

.file-size {
  font-size: 12px;
  color: #94a3b8;
}

.file-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.file-item:hover .file-actions {
  opacity: 1;
}

.file-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-btn:hover {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.delete-btn:hover {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

.empty-files {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(124, 58, 237, 0.1));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
  font-size: 24px;
  margin: 0 auto 16px;
}

.empty-text {
  color: #94a3b8;
  font-size: 14px;
}

.file-modal-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  text-align: right;
}

/* ================= LIGHTBOX MODAL (Full screen) ================= */
.lightbox-modal {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000;
}

/* Lightbox Header */
.lightbox-header {
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.lightbox-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.image-type-badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.image-type-badge.normal {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
}

.image-type-badge.landBook {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
}

.image-counter {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.current-index {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.total-images {
  color: rgba(255, 255, 255, 0.6);
}

.lightbox-header-right {
  display: flex;
  gap: 8px;
}

.lightbox-action-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lightbox-action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.pin-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.download-btn:hover {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.delete-btn:hover {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
}

.close-btn:hover {
  background: #64748b;
  border-color: #64748b;
  color: white;
}

/* Lightbox Body */
.lightbox-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: 24px;
}

.next-btn {
  right: 24px;
}

.image-container {
  max-width: 90vw;
  max-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  cursor: zoom-out;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

/* Lightbox Thumbnails */
.lightbox-thumbnails {
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.thumbnails-container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
}

.thumbnail {
  position: relative;
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.thumbnail:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.thumbnail.active {
  border-color: #3b82f6;
  transform: scale(1.05);
}

.thumbnail.pinned {
  border-color: #f59e0b;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
}

.pin-indicator {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: #f59e0b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 400px) {
  .file-buttons-row {
    gap: 6px;
  }

  .view-buttons {
    gap: 6px;
  }

  .upload-buttons {
    gap: 6px;
  }

  .upload-btn {
    padding: 0 12px;
    font-size: 12px;
  }
}
</style>