<template>
  <!-- Nút mở modal -->
  <button @click="openEditor" type="button" class="open-editor-btn">
    <i class="fas fa-edit"></i> Mở trình soạn thảo
  </button>

  <!-- Modal Rich Text Editor -->
  <Teleport to="body">
    <div v-if="isEditorOpen" class="editor-modal-overlay" @click="handleOverlayClick">
      <div ref="modalRef" class="editor-modal">
        <div class="editor-modal-header">
          <h3>Trình soạn thảo văn bản</h3>
          <div class="btn-group" style="display:flex; gap: 10px;">
            <button @click="closeEditor" class="modal-btn modal-btn-cancel">
              Hủy
            </button>
            <button @click="saveContent" class="modal-btn modal-btn-save">
              Lưu
            </button>
          </div>
        </div>

        <div class="editor-modal-body">
          <!-- Rich Text Editor Component -->
          <div class="rich-text-editor-wrapper">
            <div v-if="editor" class="container">
              <div class="control-group">
                <div class="tab-header">
                  <button
                      class="tab-btn"
                      :class="{ active: activeTab === 'format' }"
                      @click="activeTab = 'format'"
                  >
                    Định dạng
                  </button>
                  <button
                      class="tab-btn"
                      :class="{ active: activeTab === 'insert' }"
                      @click="activeTab = 'insert'"
                  >
                    Chèn
                  </button>
                  <button
                      class="tab-btn"
                      :class="{ active: activeTab === 'table' }"
                      @click="activeTab = 'table'"
                  >
                    Bảng
                  </button>
                </div>

                <!-- Tab Định dạng -->
                <div v-if="activeTab === 'format'" class="tab-content">
                  <div class="button-group">
                    <!-- Nhóm kiểu văn bản -->
                    <div class="button-subgroup">
                      <h5 class="subgroup-title">Kiểu văn bản</h5>
                      <div class="subgroup-buttons">
                        <button class="editor-btn" @click="editor.chain().focus().setParagraph().run()"
                                :class="{ 'is-active': editor.isActive('paragraph') }">
                          <i class="fas fa-paragraph"></i> Đoạn
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                                :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
                          <i class="fas fa-heading"></i> H1
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                                :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
                          <i class="fas fa-heading"></i> H2
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                                :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
                          <i class="fas fa-heading"></i> H3
                        </button>
                      </div>
                    </div>

                    <!-- Nhóm định dạng chữ -->
                    <div class="button-subgroup">
                      <h5 class="subgroup-title">Định dạng chữ</h5>
                      <div class="subgroup-buttons">
                        <button class="editor-btn" @click="editor.chain().focus().toggleBold().run()"
                                :disabled="!editor.can().chain().focus().toggleBold().run()"
                                :class="{ 'is-active': editor.isActive('bold') }">
                          <i class="fas fa-bold"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().toggleItalic().run()"
                                :disabled="!editor.can().chain().focus().toggleItalic().run()"
                                :class="{ 'is-active': editor.isActive('italic') }">
                          <i class="fas fa-italic"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().toggleStrike().run()"
                                :disabled="!editor.can().chain().focus().toggleStrike().run()"
                                :class="{ 'is-active': editor.isActive('strike') }">
                          <i class="fas fa-strikethrough"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Nhóm căn chỉnh -->
                    <div class="button-subgroup">
                      <h5 class="subgroup-title">Căn chỉnh</h5>
                      <div class="subgroup-buttons">
                        <button class="editor-btn" @click="editor.chain().focus().setTextAlign('left').run()"
                                :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
                          <i class="fas fa-align-left"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().setTextAlign('center').run()"
                                :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
                          <i class="fas fa-align-center"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().setTextAlign('right').run()"
                                :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
                          <i class="fas fa-align-right"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().setTextAlign('justify').run()"
                                :class="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }">
                          <i class="fas fa-align-justify"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Nhóm danh sách -->
                    <div class="button-subgroup">
                      <h5 class="subgroup-title">Danh sách</h5>
                      <div class="subgroup-buttons">
                        <button class="editor-btn" @click="editor.chain().focus().toggleBulletList().run()"
                                :class="{ 'is-active': editor.isActive('bulletList') }">
                          <i class="fas fa-list-ul"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().toggleOrderedList().run()"
                                :class="{ 'is-active': editor.isActive('orderedList') }">
                          <i class="fas fa-list-ol"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().toggleBlockquote().run()"
                                :class="{ 'is-active': editor.isActive('blockquote') }">
                          <i class="fas fa-quote-right"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Nhóm kích thước & màu chữ -->
                    <div class="button-subgroup">
                      <h5 class="subgroup-title">Kích thước & Màu</h5>
                      <div class="subgroup-controls">
                        <div class="font-size-group">
                          <label class="font-size-label">Cỡ chữ:</label>
                          <select v-model="selectedFontSize" @change="setFontSize" class="font-size-select">
                            <option value="">Mặc định</option>
                            <option value="12px">12px</option>
                            <option value="14px">14px</option>
                            <option value="16px">16px</option>
                            <option value="18px">18px</option>
                            <option value="20px">20px</option>
                            <option value="24px">24px</option>
                            <option value="28px">28px</option>
                            <option value="32px">32px</option>
                            <option value="36px">36px</option>
                            <option value="48px">48px</option>
                            <option value="72px">72px</option>
                          </select>
                          <button class="editor-btn btn-small" @click="resetFontSize">
                            <i class="fas fa-undo"></i>
                          </button>
                        </div>

                        <div class="color-picker-group">
                          <label class="color-label">Màu chữ:</label>
                          <input
                              type="color"
                              v-model="textColor"
                              class="color-input"
                              title="Chọn màu chữ"
                          >
                          <button class="editor-btn btn-small" @click="setTextColor">
                            <i class="fas fa-check"></i>
                          </button>
                          <button class="editor-btn btn-small" @click="resetTextColor">
                            <i class="fas fa-eraser"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Nhóm công cụ -->
                    <div class="button-subgroup">
                      <h5 class="subgroup-title">Công cụ</h5>
                      <div class="subgroup-buttons">
                        <button class="editor-btn" @click="editor.chain().focus().setHorizontalRule().run()">
                          <i class="fas fa-minus"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().setHardBreak().run()">
                          <i class="fas fa-level-down-alt"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().setCodeBlock().run()">
                          <i class="fas fa-code"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().undo().run()"
                                :disabled="!editor.can().undo()">
                          <i class="fas fa-undo"></i>
                        </button>
                        <button class="editor-btn" @click="editor.chain().focus().redo().run()"
                                :disabled="!editor.can().redo()">
                          <i class="fas fa-redo"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tab Chèn -->
                <div v-if="activeTab === 'insert'" class="tab-content">
                  <div class="button-group">
                    <div class="button-subgroup">
                      <h5 class="subgroup-title">Chèn đối tượng</h5>
                      <div class="subgroup-buttons">
                        <div class="upload-container">
                          <input
                              type="file"
                              ref="fileInput"
                              @change="handleImageUpload"
                              accept="image/*"
                              style="display: none"
                          >
                          <button class="editor-btn" @click="triggerFileInput">
                            <i class="fas fa-image"></i> Ảnh
                          </button>
                        </div>
                        <button class="editor-btn" @click="insertLink()">
                          <i class="fas fa-link"></i> Liên kết
                        </button>
                        <button class="editor-btn" @click="insertHTMLTable()">
                          <i class="fas fa-table"></i> Bảng mẫu
                        </button>
                        <button class="editor-btn" @click="openColumnPopup()">
                          <i class="fas fa-columns"></i> Chia cột
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Phần tùy chỉnh cột -->
                  <div v-if="editor && editor.isActive('columnsContainer')" class="columns-customization-row">
                    <h5 class="customization-title">Tùy chỉnh cột</h5>
                    <div class="customization-controls">
                      <!-- Số cột -->
                      <div class="control-item">
                        <label class="control-label">Số cột:</label>
                        <select v-model="selectedColumns" @change="updateColumnsCount" class="control-select">
                          <option value="2">2 cột</option>
                          <option value="3">3 cột</option>
                          <option value="4">4 cột</option>
                        </select>
                      </div>

                      <!-- Khoảng cách -->
                      <div class="control-item">
                        <label class="control-label">Khoảng cách:</label>
                        <select v-model="selectedGap" @change="updateColumnsGap" class="control-select">
                          <option value="8px">Nhỏ</option>
                          <option value="16px">Vừa</option>
                          <option value="24px">Lớn</option>
                          <option value="32px">Rất lớn</option>
                        </select>
                      </div>

                      <!-- Xóa cột -->
                      <div class="control-item">
                        <button class="editor-btn btn-danger" @click="removeColumns()">
                          <i class="fas fa-trash"></i> Xóa cột
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tab Bảng -->
                <div v-if="activeTab === 'table'" class="tab-content">
                  <div class="table-tab-wrapper">
                    <!-- Phần chọn kích thước bảng -->
                    <div class="table-size-selector">
                      <h4>Định dạng bảng</h4>
                      <div class="size-inputs">
                        <div class="input-group">
                          <label for="rows">Số dòng:</label>
                          <input
                              type="number"
                              id="rows"
                              v-model.number="tableRows"
                              min="1"
                              max="20"
                              class="size-input"
                          >
                        </div>
                        <div class="input-group">
                          <label for="cols">Số cột:</label>
                          <input
                              type="number"
                              id="cols"
                              v-model.number="tableCols"
                              min="1"
                              max="10"
                              class="size-input"
                          >
                        </div>
                      </div>
                      <div class="checkbox-group">
                        <label class="checkbox-label">
                          <input
                              type="checkbox"
                              v-model="tableHasHeader"
                              class="checkbox-input"
                          >
                          <span class="checkbox-custom"></span>
                          Có hàng tiêu đề
                        </label>
                      </div>

                      <!-- Color picker cho màu nền ô -->
                      <div class="color-picker-group">
                        <label class="color-label">Màu nền ô:</label>
                        <input
                            type="color"
                            v-model="cellBackgroundColor"
                            class="color-input"
                            title="Chọn màu nền ô"
                        >
                        <button class="editor-btn btn-small" @click="setCellBackgroundColor(cellBackgroundColor)">
                          <i class="fas fa-fill-drip"></i>
                        </button>
                        <button class="editor-btn btn-small" @click="removeCellBackgroundColor()">
                          <i class="fas fa-eraser"></i>
                        </button>
                      </div>

                      <!-- Color picker cho màu nền hàng tiêu đề -->
                      <div class="color-picker-group">
                        <label class="color-label">Màu tiêu đề:</label>
                        <input
                            type="color"
                            v-model="headerBackgroundColor"
                            class="color-input"
                            title="Chọn màu nền hàng tiêu đề"
                        >
                        <button class="editor-btn btn-small" @click="setHeaderBackgroundColor(headerBackgroundColor)">
                          <i class="fas fa-heading"></i>
                        </button>
                      </div>

                      <button class="editor-btn btn-primary" @click="insertTableWithSize">
                        <i class="fas fa-table"></i> Tạo bảng
                      </button>
                    </div>

                    <!-- Các nhóm nút thao tác bảng -->
                    <div class="table-controls-grid">
                      <!-- Nhóm thao tác cột -->
                      <div class="button-subgroup">
                        <h5 class="subgroup-title">Thao tác cột</h5>
                        <div class="subgroup-buttons">
                          <button class="editor-btn" @click="editor.chain().focus().addColumnBefore().run()"
                                  :disabled="!editor.can().addColumnBefore()">
                            <i class="fas fa-columns"></i> Thêm trước
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().addColumnAfter().run()"
                                  :disabled="!editor.can().addColumnAfter()">
                            <i class="fas fa-columns"></i> Thêm sau
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().deleteColumn().run()"
                                  :disabled="!editor.can().deleteColumn()">
                            <i class="fas fa-trash"></i> Xóa cột
                          </button>
                        </div>
                      </div>

                      <!-- Nhóm thao tác hàng -->
                      <div class="button-subgroup">
                        <h5 class="subgroup-title">Thao tác hàng</h5>
                        <div class="subgroup-buttons">
                          <button class="editor-btn" @click="editor.chain().focus().addRowBefore().run()"
                                  :disabled="!editor.can().addRowBefore()">
                            <i class="fas fa-grip-lines"></i> Thêm trước
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().addRowAfter().run()"
                                  :disabled="!editor.can().addRowAfter()">
                            <i class="fas fa-grip-lines"></i> Thêm sau
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().deleteRow().run()"
                                  :disabled="!editor.can().deleteRow()">
                            <i class="fas fa-trash"></i> Xóa hàng
                          </button>
                        </div>
                      </div>

                      <!-- Nhóm thao tác ô -->
                      <div class="button-subgroup">
                        <h5 class="subgroup-title">Thao tác ô</h5>
                        <div class="subgroup-buttons">
                          <button class="editor-btn" @click="editor.chain().focus().mergeCells().run()"
                                  :disabled="!editor.can().mergeCells()">
                            <i class="fas fa-object-group"></i> Gộp ô
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().splitCell().run()"
                                  :disabled="!editor.can().splitCell()">
                            <i class="fas fa-object-ungroup"></i> Tách ô
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().mergeOrSplit().run()"
                                  :disabled="!editor.can().mergeOrSplit()">
                            <i class="fas fa-exchange-alt"></i> Gộp/tách
                          </button>
                        </div>
                      </div>

                      <!-- Nhóm tiêu đề -->
                      <div class="button-subgroup">
                        <h5 class="subgroup-title">Tiêu đề</h5>
                        <div class="subgroup-buttons">
                          <button class="editor-btn"
                                  @click="editor.chain().focus().toggleHeaderColumn().run()"
                                  :disabled="!editor.can().toggleHeaderColumn()">
                            <i class="fas fa-toggle-on"></i> Cột
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().toggleHeaderRow().run()"
                                  :disabled="!editor.can().toggleHeaderRow()">
                            <i class="fas fa-toggle-on"></i> Hàng
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().toggleHeaderCell().run()"
                                  :disabled="!editor.can().toggleHeaderCell()">
                            <i class="fas fa-toggle-on"></i> Ô
                          </button>
                        </div>
                      </div>

                      <!-- Nhóm công cụ bảng -->
                      <div class="button-subgroup">
                        <h5 class="subgroup-title">Công cụ</h5>
                        <div class="subgroup-buttons">
                          <button class="editor-btn" @click="editor.chain().focus().deleteTable().run()"
                                  :disabled="!editor.can().deleteTable()">
                            <i class="fas fa-times-circle"></i> Xóa bảng
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().fixTables().run()"
                                  :disabled="!editor.can().fixTables()">
                            <i class="fas fa-wrench"></i> Sửa bảng
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().goToNextCell().run()"
                                  :disabled="!editor.can().goToNextCell()">
                            <i class="fas fa-arrow-right"></i> Ô tiếp
                          </button>
                          <button class="editor-btn" @click="editor.chain().focus().goToPreviousCell().run()"
                                  :disabled="!editor.can().goToPreviousCell()">
                            <i class="fas fa-arrow-left"></i> Ô trước
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <editor-content :editor="editor" class="editor-content"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Popup Chia Cột -->
  <Teleport to="body">
    <div v-if="isColumnPopupOpen" class="column-popup-overlay" @click="closeColumnPopup">
      <div class="column-popup" @click.stop>
        <div class="column-popup-header">
          <h3><i class="fas fa-columns"></i> Chia cột</h3>
          <button class="close-popup-btn" @click="closeColumnPopup">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="column-popup-body">
          <div class="column-settings">
            <!-- Số cột -->
            <div class="setting-item">
              <label class="setting-label">Số cột:</label>
              <div class="column-count-selector">
                <button
                    v-for="count in [2, 3, 4]"
                    :key="count"
                    class="column-count-btn"
                    :class="{ active: columnSettings.count === count }"
                    @click="columnSettings.count = count"
                >
                  {{ count }}
                </button>
              </div>
            </div>

            <!-- Khoảng cách -->
            <div class="setting-item">
              <label class="setting-label">Khoảng cách:</label>
              <select v-model="columnSettings.gap" class="setting-select">
                <option value="8px">Nhỏ</option>
                <option value="16px">Vừa</option>
                <option value="24px">Lớn</option>
                <option value="32px">Rất lớn</option>
              </select>
            </div>
          </div>
        </div>

        <div class="column-popup-footer">
          <button class="popup-btn btn-cancel" @click="closeColumnPopup">
            <i class="fas fa-times"></i> Hủy
          </button>
          <button class="popup-btn btn-confirm" @click="confirmInsertColumns">
            <i class="fas fa-check"></i> Chèn cột
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineProps, defineEmits, nextTick } from 'vue'
import { Plugin } from 'prosemirror-state'
import { TableCell, TableKit } from '@tiptap/extension-table'
import { StarterKit } from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { Image } from '@tiptap/extension-image'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { TextAlign } from '@tiptap/extension-text-align'
import { Extension } from '@tiptap/core'
import ImageResize from 'tiptap-extension-image-resize'
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
import { Node } from '@tiptap/core'
import { h } from 'vue'

const modalRef = ref(null)

// Thêm state cho columns
const selectedColumns = ref('2')
const selectedGap = ref('16px')
const showColumnBorder = ref(false)

// Popup chia cột state
const isColumnPopupOpen = ref(false)
const columnSettings = ref({
  count: 2,
  gap: '16px',
  hasBorder: false
})

const handleOverlayClick = (event) => {
  if (event.target.classList.contains('editor-modal-overlay')) {
    closeEditor()
  }
}

const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && isEditorOpen.value) {
    closeEditor()
  }
}

// Thêm và xóa event listener
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscapeKey)
})

// Props và Emits
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  fileDTOs: {
    type: Array,
    default: () => []
  },
  rawFiles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update:fileDTOs', 'update:rawFiles'])

// Modal state
const isEditorOpen = ref(false)

// Editor state
const editor = ref(null)
const activeTab = ref('format')
const fileInput = ref(null)
const textColor = ref('#000000')
const cellBackgroundColor = ref('#FAF594')
const headerBackgroundColor = ref('#E5E7EB')
const selectedFontSize = ref('')
const tableRows = ref(3)
const tableCols = ref(3)
const tableHasHeader = ref(true)

// Tạm lưu nội dung khi đang chỉnh sửa
const tempContent = ref('')

// State cho các file
const localFileDTOs = ref([])
const localRawFiles = ref([])

// Map lưu blob URL để tránh trùng lặp
const blobUrlMap = ref(new Map()) // key: file object reference, value: blob URL

// Watch props để cập nhật local state
watch(() => props.fileDTOs, (newFiles) => {
  if (JSON.stringify(newFiles) !== JSON.stringify(localFileDTOs.value)) {
    localFileDTOs.value = [...newFiles]
  }
}, { deep: true, immediate: true })

watch(() => props.rawFiles, (newRawFiles) => {
  if (JSON.stringify(newRawFiles) !== JSON.stringify(localRawFiles.value)) {
    localRawFiles.value = [...newRawFiles]
  }
}, { deep: true, immediate: true })

// Emit các thay đổi
watch(localFileDTOs, (newFiles) => {
  emit('update:fileDTOs', [...newFiles])
}, { deep: true })

watch(localRawFiles, (newRawFiles) => {
  emit('update:rawFiles', [...newRawFiles])
}, { deep: true })

// Hàm tạo blob URL không trùng lặp
const createUniqueBlobUrl = (file) => {
  // Kiểm tra nếu đã có blob URL cho file này
  if (blobUrlMap.value.has(file)) {
    return blobUrlMap.value.get(file)
  }

  // Tạo blob URL mới
  const blobUrl = URL.createObjectURL(file)

  // Lưu vào map để tránh trùng lặp
  blobUrlMap.value.set(file, blobUrl)

  console.log('📌 Tạo blob URL mới:', {
    filename: file.name,
    blobUrl: blobUrl.substring(0, 50) + '...',
    mapSize: blobUrlMap.value.size
  })

  return blobUrl
}

// Hàm giải phóng blob URL khi không cần
const revokeBlobUrl = (file) => {
  if (blobUrlMap.value.has(file)) {
    const blobUrl = blobUrlMap.value.get(file)
    URL.revokeObjectURL(blobUrl)
    blobUrlMap.value.delete(file)
    console.log('🗑️ Đã giải phóng blob URL:', blobUrl.substring(0, 50) + '...')
  }
}

// Hàm extract images từ HTML và cập nhật fileDTOs
const extractAndUpdateImagesFromHTML = (html) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const imgElements = doc.querySelectorAll('img')

  const blobUrlsInHTML = []

  imgElements.forEach(img => {
    const src = img.getAttribute('src')

    if (!src) return

    if (src.startsWith('blob:')) {
      // Nếu là blob URL (ảnh mới upload)
      blobUrlsInHTML.push(src)

      // Tìm fileDTO tương ứng
      const existingFileDTO = localFileDTOs.value.find(fileDTO =>
          fileDTO.blobUrl === src
      )

      if (!existingFileDTO) {
        // Tìm rawFile tương ứng với blob URL này
        let correspondingFile = null

        // Duyệt qua map để tìm file tương ứng
        for (const [file, blobUrl] of blobUrlMap.value.entries()) {
          if (blobUrl === src) {
            correspondingFile = file
            break
          }
        }

        if (correspondingFile) {
          // Tạo fileDTO mới
          const newFileDTO = {
            filename: correspondingFile.name,
            blobUrl: src, // Sử dụng blob URL làm key
            status: 'NEW',
            rawFile: correspondingFile
          }

          localFileDTOs.value.push(newFileDTO)
          console.log('✅ Đã thêm fileDTO NEW từ blob URL:', src.substring(0, 50) + '...')
        }
      }
    } else if (src.includes('https://s3.cloudfly.vn/thg-storage-dev/uploads-public/')) {
      // Nếu là ảnh cũ từ server
      const filename = src.split('/').pop()
      blobUrlsInHTML.push(src)

      const existingFileDTO = localFileDTOs.value.find(fileDTO =>
          fileDTO.filename === filename && fileDTO.status === 'EXISTING'
      )

      if (!existingFileDTO) {
        const newFileDTO = {
          filename: filename,
          blobUrl: src,
          status: 'EXISTING'
        }

        localFileDTOs.value.push(newFileDTO)
        console.log('✅ Đã thêm fileDTO EXISTING từ URL server:', filename)
      }
    }
  })

  // Kiểm tra và loại bỏ fileDTOs không còn trong HTML
  localFileDTOs.value = localFileDTOs.value.filter(fileDTO => {
    const stillExists = blobUrlsInHTML.includes(fileDTO.blobUrl)

    if (!stillExists) {
      if (fileDTO.status === 'NEW') {
        console.log('🗑️ Xóa fileDTO NEW không còn trong HTML:', fileDTO.blobUrl.substring(0, 50) + '...')

        // Giải phóng blob URL
        if (fileDTO.rawFile) {
          revokeBlobUrl(fileDTO.rawFile)
        }

        // Xóa rawFile tương ứng
        const rawFileIndex = localRawFiles.value.findIndex(f =>
            f === fileDTO.rawFile
        )

        if (rawFileIndex !== -1) {
          localRawFiles.value.splice(rawFileIndex, 1)
          console.log('🗑️ Đã xóa rawFile tương ứng')
        }

        return false
      } else if (fileDTO.status === 'EXISTING') {
        // Đánh dấu ảnh cũ là cần xóa
        fileDTO.status = 'REMOVE'
        console.log('🔄 Đã đánh dấu fileDTO EXISTING thành REMOVE:', fileDTO.filename)
        return true
      }
    }

    return true
  })
}

// Hàm xử lý khi ảnh được thêm vào editor
const handleImageAdded = async (file) => {
  try {
    // Tạo blob URL không trùng lặp
    const blobUrl = createUniqueBlobUrl(file)

    // Chèn ảnh vào editor với blob URL
    editor.value.chain().focus().setImage({
      src: blobUrl
    }).run()

    console.log('➕ Đã thêm ảnh với blob URL:', blobUrl.substring(0, 50) + '...')

    // Tạo fileDTO
    const fileDTO = {
      filename: file.name,
      blobUrl: blobUrl,
      status: 'NEW',
      rawFile: file
    }

    // Thêm vào localFileDTOs nếu chưa có
    const existingIndex = localFileDTOs.value.findIndex(f => f.blobUrl === blobUrl)
    if (existingIndex === -1) {
      localFileDTOs.value.push(fileDTO)
    } else {
      localFileDTOs.value[existingIndex] = fileDTO
    }

    // Thêm vào rawFiles nếu chưa có
    const rawFileExists = localRawFiles.value.some(f => f === file)
    if (!rawFileExists) {
      localRawFiles.value.push(file)
    }

    console.log('📋 Đã tạo fileDTO:', {
      filename: file.name,
      blobUrl: blobUrl.substring(0, 50) + '...',
      status: 'NEW'
    })

    console.log('📊 Trạng thái sau khi thêm ảnh:', {
      fileDTOs: localFileDTOs.value.map(f => ({
        filename: f.filename,
        blobUrl: f.blobUrl?.substring(0, 30) + '...',
        status: f.status
      })),
      rawFiles: localRawFiles.value.length,
      blobUrlMapSize: blobUrlMap.value.size
    })

  } catch (error) {
    console.error('❌ Lỗi khi thêm ảnh:', error)
    alert(`Lỗi khi chèn ảnh "${file.name}"`)
  }
}

// Hàm xử lý khi ảnh bị xóa khỏi editor
const handleImageDeleted = (src) => {
  console.log('❌ Ảnh bị xóa khỏi editor:', src?.substring(0, 50) + '...')

  if (!src) return

  // Tìm và xử lý fileDTO
  const fileIndex = localFileDTOs.value.findIndex(f => f.blobUrl === src)
  if (fileIndex !== -1) {
    const fileDTO = localFileDTOs.value[fileIndex]

    if (fileDTO.status === 'NEW') {
      // Xóa hoàn toàn fileDTO mới
      localFileDTOs.value.splice(fileIndex, 1)
      console.log('✅ Đã xóa fileDTO NEW:', src.substring(0, 50) + '...')

      // Giải phóng blob URL và xóa rawFile
      if (fileDTO.rawFile) {
        revokeBlobUrl(fileDTO.rawFile)

        const rawFileIndex = localRawFiles.value.findIndex(f => f === fileDTO.rawFile)
        if (rawFileIndex !== -1) {
          localRawFiles.value.splice(rawFileIndex, 1)
          console.log('✅ Đã xóa rawFile tương ứng')
        }
      }
    } else if (fileDTO.status === 'EXISTING') {
      // Đánh dấu ảnh cũ là cần xóa
      fileDTO.status = 'REMOVE'
      console.log('🔄 Đã đánh dấu fileDTO EXISTING thành REMOVE:', fileDTO.filename)
    }
  }
}

// Mở popup chia cột
const openColumnPopup = () => {
  isColumnPopupOpen.value = true
}

// Đóng popup chia cột
const closeColumnPopup = () => {
  isColumnPopupOpen.value = false
}

// Xác nhận chèn cột từ popup
const confirmInsertColumns = () => {
  // Đảm bảo có giá trị mặc định
  const count = columnSettings.value?.count || 2
  const gap = columnSettings.value?.gap || '16px'

  // Cập nhật giá trị từ popup vào state chính
  selectedColumns.value = count.toString()
  selectedGap.value = gap

  // Gọi hàm chèn cột
  insertColumns(count, gap)

  // Đóng popup
  closeColumnPopup()
}

// Hàm chèn columns (sửa lại để nhận tham số)
const insertColumns = (count = 2, gap = '16px') => {
  const columnsCount = count
  const gapValue = gap

  const columnsHTML = `
    <div data-type="columns-container"
         data-columns="${columnsCount}"
         data-gap="${gapValue}"
         class="editor-columns-container"
         style="display: flex; gap: ${gapValue}; width: 100%; margin: 1rem 0;">
      ${Array.from({ length: columnsCount }).map((_, index) => `
        <div data-type="column"
             class="editor-column"
             style="flex: 1; min-width: 0; border-radius: 8px; padding: 16px; border: 1px dashed #d1d5db; background-color: #f5f5f5;">
          <p>Nội dung cột ${index + 1}</p>
        </div>
      `).join('')}
    </div>
  `

  if (editor.value) {
    editor.value
        .chain()
        .focus()
        .insertContent(columnsHTML, { parseOptions: { preserveWhitespace: false } })
        .run()
  }
}

// Hàm cập nhật số lượng cột
const updateColumnsCount = () => {
  if (editor.value && editor.value.isActive('columnsContainer')) {
    const columnsCount = parseInt(selectedColumns.value)

    editor.value
        .chain()
        .focus()
        .updateColumnsAttributes({ columns: columnsCount })
        .run()
  }
}

const removeColumns = () => {
  if (editor.value && editor.value.isActive('columnsContainer')) {
    editor.value
        .chain()
        .focus()
        .removeColumns()
        .run()
  }
}

// Hàm cập nhật khoảng cách cột
const updateColumnsGap = () => {
  if (editor.value && editor.value.isActive('columnsContainer')) {
    editor.value
        .chain()
        .focus()
        .updateColumnsAttributes({ gap: selectedGap.value })
        .run()
  }
}

// Mở modal
const openEditor = () => {
  isEditorOpen.value = true
  tempContent.value = props.modelValue

  // Log trạng thái ban đầu
  console.log('🚀 Mở trình soạn thảo với:', {
    modelValueLength: props.modelValue?.length,
    fileDTOs: localFileDTOs.value,
    rawFiles: localRawFiles.value.length
  })

  nextTick(() => {
    initEditor()
  })
}

// Đóng modal
const closeEditor = () => {
  isEditorOpen.value = false
  if (editor.value) {
    editor.value.destroy()
    editor.value = null
  }
}

// Lưu nội dung
const saveContent = () => {
  if (editor.value) {
    const html = editor.value.getHTML()

    // Trước khi emit, cập nhật fileDTOs từ HTML hiện tại
    extractAndUpdateImagesFromHTML(html)

    // Emit contentHTML
    emit('update:modelValue', html)

    console.log('💾 Lưu nội dung:', {
      contentHTML: html.substring(0, 100) + '...',
      fileDTOs: localFileDTOs.value.map(f => ({
        filename: f.filename,
        blobUrl: f.blobUrl?.substring(0, 30) + '...',
        status: f.status
      })),
      rawFiles: localRawFiles.value.map(f => f.name),
      blobUrlMapSize: blobUrlMap.value.size
    })
  }
  closeEditor()
}

// Khởi tạo editor
const initEditor = () => {
  if (editor.value) {
    editor.value.destroy()
  }

  // Khởi tạo fileDTOs từ contentHTML nếu chưa có
  if (props.modelValue) {
    extractAndUpdateImagesFromHTML(props.modelValue)
  }

  // Sử dụng Image extension mặc định
  editor.value = new Editor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'inserted-image',
        },
      }),
      ImageResize,
      TableKit.configure({
        table: {
          resizable: true,
        },
        tableCell: false,
      }),
      CustomTableCell,
      FontSize,
      DragAndDropHandler,
      // Thêm columns extension
      ColumnsExtension,
      ColumnNode.configure({
        HTMLAttributes: {
          class: 'editor-column',
        },
        ...(typeof window !== 'undefined' && {
          addNodeView() {
            return ({node, editor: ed, getPos}) => {
              const component = ColumnComponent
              return {
                dom: document.createElement('div'),
                component,
              }
            }
          },
        }),
      }),
      ColumnsContainerNode.configure({
        HTMLAttributes: {
          class: 'editor-columns-container',
        },
        ...(typeof window !== 'undefined' && {
          addNodeView() {
            return ({node, editor: ed, getPos}) => {
              const component = ColumnsContainerComponent
              return {
                dom: document.createElement('div'),
                component,
              }
            }
          },
        }),
      }),
    ],
    content: tempContent.value || props.modelValue || `
        <h3>
          Bạn đã thấy các bảng của chúng tôi chưa? Chúng thật tuyệt vì chúng ta đã sửa logic blob URL không trùng!
        </h3>
        <ul>
          <li>Bảng với hàng, ô và tiêu đề (tùy chọn)</li>
          <li>Hỗ trợ <code>colgroup</code> và <code>rowspan</code></li>
          <li>Và cả cột có thể thay đổi kích thước (tùy chọn)</li>
        </ul>
        <p>
          Đây là một ví dụ:
        </p>
        <table>
          <tbody>
            <tr>
              <th>Tên</th>
              <th colspan="3">Mô tả</th>
            </tr>
            <tr>
              <td>Cyndi Lauper</td>
              <td>Ca sĩ</td>
              <td>Nhạc sĩ</td>
              <td>Diễn viên</td>
            </tr>
            <tr>
              <td>Marie Curie</td>
              <td>Nhà khoa học</td>
              <td>Nhà hóa học</td>
              <td>Nhà vật lý</td>
            </tr>
            <tr>
              <td>Indira Gandhi</td>
              <td>Thủ tướng</td>
              <td colspan="2">Chính trị gia</td>
            </tr>
          </tbody>
        </table>
      `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: 'min-height: 300px;'
      },
      // Thêm handler cho xóa node (xóa ảnh)
      handleDOMEvents: {
        keydown: (view, event) => {
          // Xử lý khi nhấn Delete/Backspace
          if (event.key === 'Delete' || event.key === 'Backspace') {
            const { selection } = view.state
            const { $from } = selection

            // Kiểm tra nếu đang xóa node ảnh
            const node = $from.nodeBefore || $from.nodeAfter
            if (node && node.type.name === 'image') {
              const src = node.attrs.src

              console.log('⌨️ Xóa ảnh bằng phím:', src?.substring(0, 50) + '...')

              // Đợi một chút để DOM cập nhật
              setTimeout(() => {
                handleImageDeleted(src)
              }, 100)
            }
          }
          return false
        }
      }
    },

    onTransaction({ transaction }) {
      // Theo dõi các transaction để phát hiện xóa ảnh
      if (transaction.steps && transaction.steps.length > 0) {
        transaction.steps.forEach(step => {
          if (step.slice && step.slice.content.size === 0) {
            // Đây có thể là xóa node
            // Không cần xử lý gì thêm vì đã có logic trong handleDOMEvents
          }
        })
      }
    }
  })

  // Thêm event listener cho thay đổi nội dung
  editor.value.on('update', ({ editor: ed }) => {
    const html = ed.getHTML()
    // Cập nhật fileDTOs từ HTML hiện tại
    extractAndUpdateImagesFromHTML(html)

    console.log('🔄 Editor updated - HTML mẫu:', html.substring(0, 200))
    console.log('📊 Trạng thái fileDTOs:', localFileDTOs.value.map(f => ({
      blobUrl: f.blobUrl?.substring(0, 30) + '...',
      status: f.status
    })))
  })

  // Thêm mutation observer để theo dõi thay đổi DOM
  setTimeout(() => {
    const editorContent = document.querySelector('.editor-content .ProseMirror')
    if (editorContent) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            // Kiểm tra nếu có node bị xóa
            mutation.removedNodes.forEach((node) => {
              if (node.nodeName === 'IMG') {
                const src = node.src
                handleImageDeleted(src)
              }
            })
          }
        })
      })

      observer.observe(editorContent, {
        childList: true,
        subtree: true
      })

      // Lưu observer để cleanup
      editor.value.observer = observer
    }
  }, 500)
}

// Cleanup khi component unmount
onBeforeUnmount(() => {
  // Giải phóng tất cả blob URL
  blobUrlMap.value.forEach((blobUrl, file) => {
    URL.revokeObjectURL(blobUrl)
  })
  blobUrlMap.value.clear()

  if (editor.value) {
    if (editor.value.observer) {
      editor.value.observer.disconnect()
    }
    editor.value.destroy()
  }
})

// Drag and Drop Handler
const DragAndDropHandler = Extension.create({
  name: 'dragAndDropHandler',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            drop: (view, event) => {
              const { dataTransfer } = event
              if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
                event.preventDefault()
                const files = Array.from(dataTransfer.files)
                const imageFiles = files.filter(file => file.type.startsWith('image/'))
                if (imageFiles.length > 0) {
                  imageFiles.forEach(file => handleImageAdded(file))
                  return true
                }
              }
              return false
            },
            dragover: (view, event) => {
              const { dataTransfer } = event
              if (dataTransfer && dataTransfer.types.includes('Files')) {
                event.preventDefault()
                return true
              }
              return false
            }
          }
        }
      })
    ]
  }
})

// FontSize Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
            .setMark('textStyle', { fontSize })
            .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run()
      },
    }
  },
})

// Custom Table Cell
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-background-color'),
        renderHTML: attributes => {
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
    }
  },
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 5MB!')
      return
    }

    // Xử lý ảnh
    handleImageAdded(file)

    // Reset input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

// Các hàm khác
const insertLink = () => {
  // Lấy URL từ người dùng
  const url = window.prompt('Nhập URL hoặc đường dẫn liên kết:\n• Bắt đầu bằng http/https: Link thông thường\n• Bắt đầu bằng /: Router link', '')
  if (!url) return

  const href = url.trim()
  let linkType = 'external' // 'external', 'router', 'other'

  if (href.startsWith('http://') || href.startsWith('https://')) {
    linkType = 'external'
  } else if (href.startsWith('/')) {
    linkType = 'router'
  } else if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    linkType = 'other'
  } else {
    linkType = 'external'
  }

  // Lấy text đang được chọn
  let selectedText = ''
  if (editor.value) {
    const { from, to } = editor.value.state.selection
    selectedText = editor.value.state.doc.textBetween(from, to, ' ')
  }

  // Nếu không có text được chọn, yêu cầu nhập text
  let linkText = selectedText
  if (!linkText) {
    linkText = window.prompt('Nhập text hiển thị cho link:', href)
    if (!linkText) return
  }

  if (editor.value) {
    if (linkType === 'router') {
      // Router link
      if (selectedText) {
        // Áp dụng link lên text đang chọn
        editor.value.chain()
            .focus()
            .setLink({
              href: href,
              'data-router-link': true
            })
            .run()
      } else {
        // Chèn link mới
        editor.value.chain()
            .focus()
            .insertContent(`<a href="${href}" data-router-link="true">${linkText}</a>`)
            .run()
      }
    } else {
      // External link hoặc other
      const finalHref = linkType === 'external' && !href.startsWith('http') ?
          `https://${href}` : href

      if (selectedText) {
        editor.value.chain()
            .focus()
            .setLink({
              href: finalHref,
              target: '_blank',
              rel: 'noopener noreferrer nofollow'
            })
            .run()
      } else {
        editor.value.chain()
            .focus()
            .insertContent(`<a href="${finalHref}" target="_blank" rel="noopener noreferrer nofollow">${linkText}</a>`)
            .run()
      }
    }
  }
}

const insertHTMLTable = () => {
  const tableHTML = `
    <table style="width:100%">
      <tr>
        <th>Họ</th>
        <th>Tên</th>
        <th>Tuổi</th>
      </tr>
      <tr>
        <td>Minh</td>
        <td>Nguyễn</td>
        <td>25</td>
      </tr>
      <tr>
        <td>Lan</td>
        <td>Trần</td>
        <td>30</td>
      </tr>
      <tr>
        <td>Hùng</td>
        <td>Lê</td>
        <td>28</td>
      </tr>
    </table>`

  editor.value
      .chain()
      .focus()
      .insertContent(tableHTML, { parseOptions: { preserveWhitespace: false } })
      .run()
}

const setFontSize = () => {
  if (editor.value) {
    if (selectedFontSize.value) {
      editor.value.chain().focus().setFontSize(selectedFontSize.value).run()
    } else {
      editor.value.chain().focus().unsetFontSize().run()
    }
  }
}

const resetFontSize = () => {
  if (editor.value) {
    editor.value.chain().focus().unsetFontSize().run()
    selectedFontSize.value = ''
  }
}

const setTextColor = () => {
  if (textColor.value && editor.value) {
    editor.value.chain().focus().setColor(textColor.value).run()
  }
}

const resetTextColor = () => {
  if (editor.value) {
    editor.value.chain().focus().unsetColor().run()
    textColor.value = '#000000'
  }
}

const setCellBackgroundColor = (color) => {
  if (editor.value) {
    editor.value.chain().focus().setCellAttribute('backgroundColor', color).run()
  }
}

const removeCellBackgroundColor = () => {
  if (editor.value) {
    editor.value.chain().focus().unsetCellAttribute('backgroundColor').run()
  }
}

const setHeaderBackgroundColor = (color) => {
  if (editor.value) {
    editor.value.chain().focus().setCellAttribute('backgroundColor', color).run()
  }
}

const insertTableWithSize = () => {
  if (tableRows.value < 1 || tableCols.value < 1) {
    alert('Số dòng và số cột phải lớn hơn 0!')
    return
  }
  if (tableRows.value > 20 || tableCols.value > 10) {
    alert('Số dòng tối đa là 20 và số cột tối đa là 10!')
    return
  }
  editor.value.chain().focus().insertTable({
    rows: tableRows.value,
    cols: tableCols.value,
    withHeaderRow: tableHasHeader.value
  }).run()
  if (tableHasHeader.value) {
    setTimeout(() => {
      editor.value.chain().focus().setCellAttribute('backgroundColor', headerBackgroundColor.value).run()
    }, 100)
  }
}

// Columns Extension
const ColumnsExtension = Extension.create({
  name: 'columns',
})

const ColumnNode = Node.create({
  name: 'column',
  group: 'block',
  content: 'block+',
  defining: true,
  isolating: true,

  parseHTML() {
    return [
      { tag: 'div[data-type="column"]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'column' }, 0]
  },

  addAttributes() {
    return {
      width: {
        default: '50%',
        parseHTML: element => element.getAttribute('data-width') || '50%',
        renderHTML: attributes => {
          return {
            'data-width': attributes.width,
            style: `width: ${attributes.width};`,
          }
        },
      },
      class: {
        default: 'editor-column',
      },
    }
  },
})

const ColumnsContainerNode = Node.create({
  name: 'columnsContainer',
  group: 'block',
  content: 'column+',
  defining: true,

  parseHTML() {
    return [
      { tag: 'div[data-type="columns-container"]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const style = `display: flex; gap: ${HTMLAttributes.gap || '16px'}; width: 100%; margin: 1rem 0;`
    return ['div', {
      ...HTMLAttributes,
      'data-type': 'columns-container',
      'data-columns': HTMLAttributes.columns || 2,
      'data-gap': HTMLAttributes.gap || '16px',
      style: style,
      class: `editor-columns-container`
    }, 0]
  },

  addAttributes() {
    return {
      class: {
        default: 'editor-columns-container',
      },
      columns: {
        default: 2,
        parseHTML: element => parseInt(element.getAttribute('data-columns')) || 2,
        renderHTML: attributes => {
          return {
            'data-columns': attributes.columns,
          }
        },
      },
      gap: {
        default: '16px',
        parseHTML: element => element.getAttribute('data-gap') || '16px',
        renderHTML: attributes => {
          return {
            'data-gap': attributes.gap,
          }
        },
      },
    }
  },

  // THÊM PHẦN QUAN TRỌNG NÀY
  addCommands() {
    return {
      updateColumnsAttributes: (attributes) => ({ commands }) => {
        return commands.updateAttributes('columnsContainer', attributes)
      },
      removeColumns: () => ({ commands }) => {
        return commands.deleteNode('columnsContainer')
      },
    }
  },
})

// Column Node View Component
const ColumnComponent = {
  props: nodeViewProps,
  setup(props) {
    return () => h(
        NodeViewWrapper,
        {
          as: 'div',
          style: `width: ${props.node.attrs.width};`,
          'data-type': 'column',
          class: 'editor-column',
        },
        h(NodeViewContent, { as: 'div', class: 'column-content' })
    )
  },
}

const ColumnsContainerComponent = {
  props: nodeViewProps,
  setup(props) {
    const inlineStyle = {
      '--columns-gap': props.node.attrs.gap,
      '--columns-count': props.node.attrs.columns,
    }

    return () => h(
        NodeViewWrapper,
        {
          as: 'div',
          'data-type': 'columns-container',
          class: `editor-columns-container`,
          style: inlineStyle,
          'data-columns': props.node.attrs.columns,
          'data-gap': props.node.attrs.gap,
        },
        h(NodeViewContent, { as: 'div', class: 'columns-wrapper' })
    )
  },
}

// Trong initEditor, thêm event listener:
onMounted(() => {
  console.log("GỌI onMounted");

  initializeFileDTOsFromContent();

  // Thêm event listener cho selection change
  if (editor.value) {
    editor.value.on('selectionUpdate', ({ editor: ed }) => {
      if (ed.isActive('columnsContainer')) {
        const { $from } = ed.state.selection
        let node = $from.node()

        if (node.type.name !== 'columnsContainer') {
          let depth = $from.depth
          while (depth > 0 && node.type.name !== 'columnsContainer') {
            depth--
            node = $from.node(depth)
          }
        }

        if (node.type.name === 'columnsContainer') {
          selectedColumns.value = node.attrs.columns?.toString() || '2'
          selectedGap.value = node.attrs.gap || '16px'
        }
      }
    })
  }
})

// Thêm watcher để tự động khởi tạo fileDTOs khi modelValue thay đổi
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    console.log('📝 modelValue changed, extracting images')
    extractAndUpdateImagesFromHTML(newValue)
  }
}, { immediate: true }) // immediate: true để chạy ngay khi mounted

// Hàm khởi tạo fileDTOs từ content HTML
const initializeFileDTOsFromContent = () => {

  if (props.modelValue) {
    console.log('🚀 Khởi tạo fileDTOs từ modelValue')
    extractAndUpdateImagesFromHTML(props.modelValue)

    console.log('📊 Trạng thái fileDTOs sau khi khởi tạo:', {
      fileDTOs: localFileDTOs.value.map(f => ({
        filename: f.filename,
        blobUrl: f.blobUrl?.substring(0, 30) + '...',
        status: f.status
      })),
      rawFiles: localRawFiles.value.length,
      blobUrlMapSize: blobUrlMap.value.size
    })
  }
}

// Thêm extension này vào phần extensions
import { Mark, mergeAttributes } from '@tiptap/core'

const LinkWithRouter = Mark.create({
  name: 'link',
  priority: 1000, // Độ ưu tiên cao hơn link mặc định
  keepOnSplit: false,
  inclusive: true,

  addOptions() {
    return {
      openOnClick: true,
      linkOnPaste: true,
      autolink: true,
      protocols: [],
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
        class: 'link',
      },
    }
  },

  addAttributes() {
    return {
      href: {
        default: null,
      },
      target: {
        default: this.options.HTMLAttributes.target,
      },
      rel: {
        default: this.options.HTMLAttributes.rel,
      },
      class: {
        default: this.options.HTMLAttributes.class,
      },
      'data-router-link': {
        default: false,
        parseHTML: element => element.hasAttribute('data-router-link'),
        renderHTML: attributes => {
          if (attributes['data-router-link']) {
            return { 'data-router-link': 'true' }
          }
          return {}
        }
      }
    }
  },

  parseHTML() {
    return [
      { tag: 'a[href]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const isRouterLink = HTMLAttributes['data-router-link']

    // Xử lý router-link
    if (isRouterLink) {
      const { 'data-router-link': _, ...attrs } = HTMLAttributes
      return ['a', mergeAttributes(
          attrs,
          {
            'data-router-link': 'true',
            target: null, // Router link không mở tab mới
            rel: null
          }
      ), 0]
    }

    // Link thông thường
    return ['a', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setLink: attributes => ({ chain }) => {
        return chain()
            .setMark(this.name, attributes)
            .setMeta('preventAutolink', true)
            .run()
      },
      toggleLink: attributes => ({ chain }) => {
        return chain()
            .toggleMark(this.name, attributes, { extendEmptyMarkRange: true })
            .run()
      },
      unsetLink: () => ({ chain }) => {
        return chain()
            .unsetMark(this.name, { extendEmptyMarkRange: true })
            .run()
      },
    }
  },
})

</script>
<style scoped>
:deep(.editor-content .ProseMirror) {
  padding: 20px;
}

/* Nút mở editor */
.open-editor-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.open-editor-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

/* Modal overlay */
.editor-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

.editor-modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
  overflow: hidden;
  z-index: 10000;
}

.editor-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.editor-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.editor-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.modal-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.modal-btn-cancel {
  background-color: white;
  border-color: #d1d5db;
  color: #374151;
}

.modal-btn-cancel:hover {
  background-color: #f3f4f6;
}

.modal-btn-save {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.modal-btn-save:hover {
  background-color: #059669;
  border-color: #059669;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Adjust editor styles for modal */
.editor-modal-body .rich-text-editor-wrapper {
  width: 100%;
  height: 100%;
}

.editor-modal-body .container {
  max-width: 100%;
  margin: 0;
  padding: 20px;
}

.editor-modal-body .editor-content {
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .editor-modal {
    width: 95%;
    max-height: 95vh;
  }

  .editor-modal-body .editor-content {
    min-height: 300px;
  }
}

/* Scoped styles */
.rich-text-editor-wrapper {
  width: 100%;
}

.tab-header {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 16px;
}

.tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-3);
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: var(--primary-color);
  background-color: var(--hover-color);
}

.tab-btn.active {
  color: var(--tab-active-color);
  border-bottom-color: var(--tab-active-color);
  background-color: var(--hover-color);
}

.tab-content {
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  background-color: var(--gray-1);
  border-radius: 8px;
}

.button-subgroup {
  margin-bottom: 16px;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  flex: 1;
  min-width: 250px;
}

.subgroup-title {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.subgroup-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.subgroup-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editor-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  padding: 8px 12px !important;
  background-color: white !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  transition: all 0.2s ease !important;
  color: #374151 !important;
  font-family: inherit !important;
  min-height: 36px !important;
  line-height: normal !important;
  box-shadow: none !important;
  outline: none !important;
  white-space: nowrap !important;
}

.btn-small {
  padding: 6px 8px !important;
  min-height: 32px !important;
  font-size: 12px !important;
}

.subgroup-buttons .editor-btn {
  flex: 1;
  min-width: 60px;
}

.editor-btn:hover:not(:disabled) {
  background-color: var(--hover-color) !important;
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
  transform: translateY(-1px) !important;
}

.editor-btn:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  background-color: var(--gray-1) !important;
  color: var(--disabled-color) !important;
}

.editor-btn.is-active {
  background-color: var(--primary-color) !important;
  color: white !important;
  border-color: var(--primary-color) !important;
}

.font-size-group, .color-picker-group {
  display: flex;
  gap: 8px;
}

.font-size-select, .color-input {
  border: 1px solid var(--border-color) !important;
  border-radius: 6px !important;
}

/* CSS cho tab bảng */
.table-tab-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.table-size-selector {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
}

.table-size-selector h4 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.size-inputs {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.input-group label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.size-input {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.checkbox-group {
  margin-bottom: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
}

.checkbox-input {
  margin: 0;
}

.table-controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.table-tab-wrapper .button-subgroup {
  margin-bottom: 0;
  min-width: auto;
}

.table-tab-wrapper .subgroup-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 6px;
}

.table-tab-wrapper .editor-btn {
  min-width: 100px;
  justify-content: flex-start;
  padding: 8px 10px !important;
  font-size: 13px !important;
}

.table-tab-wrapper .editor-btn i {
  margin-right: 4px;
  font-size: 12px;
}

/* Responsive cho màn hình nhỏ */
@media (max-width: 768px) {
  .table-controls-grid {
    grid-template-columns: 1fr;
  }

  .size-inputs {
    flex-direction: column;
    gap: 12px;
  }

  .table-tab-wrapper .subgroup-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Color picker */
.color-picker-group {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.color-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  min-width: 80px;
}

.color-input {
  width: 40px;
  height: 32px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: var(--primary-color) !important;
  color: white !important;
  border-color: var(--primary-color) !important;
  width: 100%;
  margin-top: 8px;
}

.btn-primary:hover {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
}

/* Container styles */
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.editor-content {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: white;
  min-height: 500px;
}

/* Phần tùy chỉnh cột gom thành một dòng */
.columns-customization-row {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
}

.customization-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.customization-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
}

.control-select {
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  min-width: 100px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
}

.checkbox-input {
  margin: 0;
}

.btn-danger {
  background-color: #ef4444 !important;
  color: white !important;
  border-color: #ef4444 !important;
}

.btn-danger:hover {
  background-color: #dc2626 !important;
  border-color: #dc2626 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .customization-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .control-item {
    width: 100%;
    justify-content: space-between;
  }
}

/* Popup Chia Cột */
.column-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  animation: fadeIn 0.2s ease;
}

.column-popup {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.column-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.column-popup-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-popup-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 20px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-popup-btn:hover {
  color: #374151;
  background-color: #f3f4f6;
}

.column-popup-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.column-popup-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.popup-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel {
  background-color: white;
  border-color: #d1d5db;
  color: #374151;
}

.btn-cancel:hover {
  background-color: #f3f4f6;
}

.btn-confirm {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-confirm:hover {
  background-color: #059669;
  border-color: #059669;
}

/* Cài đặt cột */
.column-settings {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.column-count-selector {
  display: flex;
  gap: 8px;
}

.column-count-btn {
  flex: 1;
  padding: 12px 16px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.column-count-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.column-count-btn.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.setting-select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.setting-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Xem trước cột */
.column-preview {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.preview-container {
  display: flex;
  width: 100%;
  min-height: 80px;
  align-items: stretch;
}

.preview-column {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  color: #6b7280;
  transition: all 0.2s ease;
}

/* Responsive cho popup */
@media (max-width: 640px) {
  .column-popup {
    width: 95%;
    max-height: 90vh;
  }

  .column-count-selector {
    flex-direction: column;
  }

  .column-popup-footer {
    flex-direction: column;
  }

  .popup-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>