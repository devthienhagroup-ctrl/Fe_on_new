<template>
  <!-- ================= FILE BAR ================= -->
  <div class="file-bar d-flex align-items-center justify-content-between mb-3 rounded-4 bg-white">
    <div class="d-flex align-items-center gap-4 flex-wrap">
      <div class="file-counter text-primary"
           role="button"
           @click="openLightbox(0,'normal')">
        <i class="fa-regular fa-image"></i>
        <span>Ảnh ({{ normalImages.length }})</span>
      </div>

      <div class="file-counter text-warning"
           role="button"
           @click="openLightbox(0,'landBook')">
        <i class="fa-regular fa-file-certificate"></i>
        <span>Sổ ({{ landBookImages.length }})</span>
      </div>

      <div class="file-counter text-secondary"
           role="button"
           @click="openFileModal">
        <i class="fa-regular fa-file-lines"></i>
        <span>File ({{ files.length }})</span>
      </div>

      <div v-if="(normalImages.length || landBookImages.length || files.length) && allowDownloadAll"
           class="file-counter text-success"
           role="button"
           @click="downloadAllFiles">
        <i class="fa-solid fa-cloud-arrow-down"></i>
        <span>Tải tất cả</span>
      </div>
    </div>

    <div v-if="canEdit && onUpload" class="d-flex gap-2">
      <button class="btn btn-outline-primary btn-sm"
              @click="triggerFileUpload('normal')">
        <i class="fa-regular fa-image me-1"></i>Thêm ảnh
      </button>

      <button class="btn btn-outline-warning btn-sm"
              @click="triggerFileUpload('landBook')">
        <i class="fa-regular fa-file-certificate me-1"></i>Thêm sổ
      </button>

      <input ref="fileInput"
             type="file"
             multiple
             class="d-none"
             @change="handleFileUpload" />
    </div>
  </div>

  <!-- ================= FILE MODAL ================= -->
  <div v-if="showFileModal" class="modal-backdrop" @click.self="closeFileModal">
    <div class="modal-content bg-white rounded-4 p-4" style="width:480px">
      <h6 class="fw-bold mb-3">Danh sách file</h6>

      <table class="table table-sm">
        <tbody>
        <tr v-for="(f,i) in files" :key="i">
          <td class="small text-truncate">{{ f.fileName }}</td>
          <td class="text-end">
            <button class="btn btn-light btn-sm border me-1"
                    @click="downloadFile(f.id,f.fileName)">
              <i class="fa-solid fa-download text-primary"></i>
            </button>
            <button v-if="canEdit"
                    class="btn btn-light btn-sm border"
                    @click="removeFile(i)">
              <i class="fa-solid fa-trash text-danger"></i>
            </button>
          </td>
        </tr>
        <tr v-if="!files.length">
          <td class="text-center text-muted">Không có file</td>
        </tr>
        </tbody>
      </table>

      <div class="text-end">
        <button class="btn btn-secondary btn-sm" @click="closeFileModal">Đóng</button>
      </div>
    </div>
  </div>

  <!-- ================= LIGHTBOX MODAL ================= -->
  <div v-if="previewIndex !== null" class="lightbox-modal">
    <div class="lightbox-inner">

      <!-- HEADER -->
      <div class="lightbox-header">
        <span class="badge"
              :class="currentImageType==='landBook'?'bg-warning':'bg-primary'">
          {{ currentImageType==='landBook' ? 'Ảnh sổ' : 'Ảnh thường' }}
        </span>

        <div class="d-flex gap-2">
          <button class="btn btn-dark btn-sm"
                  @click="downloadFile(currentImage?.id,currentImage?.fileName)">
            <i class="fa-solid fa-download text-success"></i>
          </button>

          <button v-if="canEdit"
                  class="btn btn-dark btn-sm"
                  @click="removeImage(previewIndex)">
            <i class="fa-solid fa-trash text-danger"></i>
          </button>

          <button class="btn btn-dark btn-sm"
                  @click="closeLightbox">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- IMAGE -->
      <div class="lightbox-body">
        <img :src="previewUrls[previewIndex]"
             class="lightbox-main-img" />
      </div>

      <!-- THUMBNAILS -->
      <div class="lightbox-thumbs">
        <div v-for="(u,i) in previewUrls"
             :key="i"
             class="thumb"
             :class="{active:i===previewIndex}"
             @click="previewIndex=i">
          <img :src="u"/>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
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

onMounted(() => {
  const list = props.fileList || [];
  normalImages.value = list.filter(f => isImage(f.fileName) && !f.isIG);
  landBookImages.value = list.filter(f => isImage(f.fileName) && f.isIG);
  files.value = list.filter(f => !isImage(f.fileName));
});

onBeforeUnmount(cleanupPreviewUrls);

function triggerFileUpload(type){
  currentImageType.value = type;
  fileInput.value.click();
}

function handleFileUpload(e){
  const arr = [...e.target.files].map(f=>({
    file:f,
    fileName:f.name,
    isIG: currentImageType.value==='landBook'
  }));

  arr.forEach(f=>{
    if(isImage(f.fileName)){
      (f.isIG?landBookImages:normalImages).value.push(f);
    } else files.value.push(f);
  });

  emitAll();
  e.target.value="";
}

async function openLightbox(i,type){
  cleanupPreviewUrls();
  currentImageType.value = type;
  const list = type==="landBook"?landBookImages.value:normalImages.value;

  for(const img of list){
    if(img.file) previewUrls.value.push(URL.createObjectURL(img.file));
    else previewUrls.value.push(await loadPrivateFileDataUrl(img.id));
  }

  previewIndex.value = i;
  document.body.style.overflow="hidden";
}

function closeLightbox(){
  previewIndex.value=null;
  cleanupPreviewUrls();
  document.body.style.overflow="auto";
}

function cleanupPreviewUrls(){
  previewUrls.value.forEach(u=>u.startsWith("blob:")&&URL.revokeObjectURL(u));
  previewUrls.value=[];
}

function removeImage(i){
  const list = currentImageType.value==="landBook"?landBookImages.value:normalImages.value;
  list.splice(i,1);
  previewUrls.value.splice(i,1);
  if(!previewUrls.value.length) closeLightbox();
  else previewIndex.value=Math.min(previewIndex.value,previewUrls.value.length-1);
  emitAll();
}

function removeFile(i){
  files.value.splice(i,1);
  emitAll();
}

function emitAll(){
  emit("update:files",[...normalImages.value,...landBookImages.value,...files.value]);
}

function openFileModal(){ showFileModal.value=true }
function closeFileModal(){ showFileModal.value=false }

async function downloadFile(id,name){
  try{
    const url=await fetchPrivateDownloadUrl(id);
    triggerBrowserDownload(url,name);
  }catch{
    showError("Không thể tải file");
  }
}

async function downloadAllFiles(){
  const url=await fetchBulkDownloadUrl(props.entityId,props.entityType);
  triggerBrowserDownload(url,`files_${props.entityType}_${props.entityId}.zip`);
}

function triggerBrowserDownload(url,name){
  const a=document.createElement("a");
  a.href=url; a.download=name; a.click();
}
</script>

<style scoped>
/* ================= FILE BAR ================= */
.file-bar{padding:12px 16px}
.file-counter{cursor:pointer;display:flex;gap:6px;align-items:center}
.file-counter:hover{opacity:.85}

/* ================= LIGHTBOX MODAL ================= */
.lightbox-modal{
  position:fixed;
  inset:0;
  z-index:99999;
  background:rgba(0,0,0,.65);
  backdrop-filter:blur(6px);
  display:flex;
  justify-content:center;
  align-items:center;
}

.lightbox-inner{
  width:100vw;
  height:100vh;
  max-width:100vw;
  max-height:100vh;
  display:flex;
  flex-direction:column;
}

.lightbox-header{
  flex-shrink:0;
  padding:12px 16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  background:rgba(0,0,0,.35);
}

.lightbox-body{
  flex:1;
  min-height:0;
  display:flex;
  justify-content:center;
  align-items:center;
  overflow:hidden;
}

.lightbox-main-img{
  max-width:90vw;
  max-height:75vh;
  object-fit:contain;
  border-radius:14px;
  box-shadow:0 0 40px rgba(255,255,255,.25);
}

.lightbox-thumbs{
  flex-shrink:0;
  display:flex;
  gap:10px;
  padding:12px 16px;
  overflow-x:auto;
  justify-content:center;
  background:rgba(0,0,0,.35);
}

.thumb{
  width:72px;
  height:54px;
  border-radius:8px;
  overflow:hidden;
  cursor:pointer;
  opacity:.55;
  border:2px solid transparent;
  transition:.2s;
}
.thumb:hover{opacity:.85}
.thumb.active{opacity:1;border-color:#0d6efd}
.thumb img{width:100%;height:100%;object-fit:cover}
</style>
