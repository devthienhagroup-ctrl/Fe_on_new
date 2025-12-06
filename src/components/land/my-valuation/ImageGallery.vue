<template>
  <div class="file-bar d-flex align-items-center justify-content-between mb-3 rounded-4 bg-white">
    <!-- BÊN TRÁI: Bộ đếm ảnh -->
    <div class="d-flex align-items-center gap-4 flex-wrap">
      <div
          class="d-flex align-items-center gap-1 file-counter text-primary"
          role="button"
          @click="openLightbox(0)"
      >
        <i class="fa-regular fa-image fs-5"></i>
        <span class="fw-semibold small">Ảnh sổ ({{ images.length }})</span>
      </div>
    </div>

    <!-- BÊN PHẢI: Upload ảnh -->
    <div v-if="canEdit">
      <button
          type="button"
          class="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
          @click="triggerFileUpload"
      >
        <i class="fa-solid fa-cloud-arrow-up"></i>
        <span>Thêm ảnh</span>
      </button>
      <input
          type="file"
          ref="fileInput"
          accept="image/*"
          multiple
          class="d-none"
          @change="handleFileUpload"
      />
    </div>
  </div>

  <!-- 🖼 LIGHTBOX HIỂN THỊ ẢNH -->
  <div v-if="previewIndex !== null" class="lightbox" @click.self="closeLightbox">
    <div class="lightbox-wrapper">
      <div class="image-container position-relative d-flex align-items-center justify-content-center">

        <!-- Nút trái -->
        <button
            v-if="previewIndex > 0"
            type="button"
            class="btn nav-btn left"
            @click.stop="prevImage"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <!-- Ảnh -->
        <img :src="previewUrls[previewIndex]" class="lightbox-img" />

        <!-- Nút phải -->
        <button
            v-if="previewIndex < previewUrls.length - 1"
            type="button"
            class="btn nav-btn right"
            @click.stop="nextImage"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>

        <!-- Nút xóa + đóng -->
        <div class="lightbox-top-controls">
          <button type="button" class="btn btn-dark btn-sm" @click.stop="closeLightbox">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <button
              v-if="canEdit"
              type="button"
              class="btn btn-dark btn-sm"
              @click.stop="removeImage(previewIndex)"
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
import { loadPrivateFileDataUrl } from "/src/api/fileApi.js"; // nếu bạn cần load ảnh từ id

const props = defineProps({
  fileList: { type: Array, required: true }, // danh sách ảnh từ BE
  canEdit: { type: Boolean, default: true },
});

const emit = defineEmits(["update:files"]);

const fileInput = ref(null);
const images = ref([]);
const previewUrls = ref([]);
const previewIndex = ref(null);

// ===== INIT =====
onMounted(() => {
  const list = Array.isArray(props.fileList) ? props.fileList : [];
  images.value = list.filter((f) => f && isImage(f.fileName));
});

onBeforeUnmount(cleanupPreviewUrls);

const isImage = (fileName) =>
    /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(fileName);

// ===== UPLOAD =====
function triggerFileUpload() {
  if (!props.canEdit) return;
  fileInput.value?.click();
}

function handleFileUpload(e) {
  if (!props.canEdit) return;

  const newFiles = Array.from(e.target.files);

  newFiles.forEach((f) => {
    if (!isImage(f.name)) return; // chỉ nhận ảnh

    images.value.push({
      fileName: f.name,
      file: f,
      id: null,
    });
  });

  emit("update:files", [...images.value]);
  e.target.value = "";
}

// ===== LIGHTBOX =====
async function openLightbox(startIndex) {
  cleanupPreviewUrls();
  previewUrls.value = [];

  for (const img of images.value) {
    if (img?.file instanceof File) {
      previewUrls.value.push(URL.createObjectURL(img.file));
    } else if (img?.id) {
      const signedUrl = await loadPrivateFileDataUrl(img.id);
      if (signedUrl) previewUrls.value.push(signedUrl);
    }
  }

  previewIndex.value = startIndex;
}

function closeLightbox() {
  previewIndex.value = null;
  cleanupPreviewUrls();
}

function cleanupPreviewUrls() {
  previewUrls.value
    .filter((url) => url?.startsWith("blob:"))
    .forEach((url) => URL.revokeObjectURL(url));
  previewUrls.value = [];
}

function nextImage() {
  if (previewIndex.value < previewUrls.value.length - 1) previewIndex.value++;
}
function prevImage() {
  if (previewIndex.value > 0) previewIndex.value--;
}

function removeImage(i) {
  if (!props.canEdit) return;
  images.value.splice(i, 1);

  emit("update:files", [...images.value]);

  if (i >= images.value.length) previewIndex.value--;
  if (images.value.length === 0) closeLightbox();
}
</script>

<style scoped>
.file-bar {
  transition: all 0.2s ease;
  margin-top: 4px;
}
.file-bar:hover {
  background-color: #f8fafc;
}

/* LIGHTBOX */
.lightbox {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}
.lightbox-img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 12px;
}

.nav-btn {
  position: absolute;
  top: 50%;
  padding: 0.8rem 1rem;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 50%;
  color: white;
}
.nav-btn.left {
  left: -3rem;
}
.nav-btn.right {
  right: -3rem;
}
.lightbox-top-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
}
</style>
