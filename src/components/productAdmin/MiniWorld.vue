<template>
  <div class="editor-wrapper">
    <div class="toolbar shadow-sm">
      <div class="toolbar-row menu-row">
        <span class="menu-item" v-for="item in menuItems" :key="item">{{ item }}</span>
      </div>

      <div class="toolbar-row control-row">
        <select class="form-select form-select-sm format-select" v-model="block" @change="applyBlock">
          <option v-for="option in blockOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>

        <select class="form-select form-select-sm font-select" v-model="font" @change="applyFont">
          <option v-for="name in fonts" :key="name" :value="name">{{ name }}</option>
        </select>

        <select class="form-select form-select-sm size-select" v-model="fontSize" @change="applyFontSize">
          <option v-for="size in fontSizes" :key="size" :value="size">{{ size }} px</option>
        </select>

        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('undo')">
          <i class="bi bi-arrow-counterclockwise"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('redo')">
          <i class="bi bi-arrow-clockwise"></i>
        </button>

        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('bold')">
          <i class="bi bi-type-bold"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('italic')">
          <i class="bi bi-type-italic"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('underline')">
          <i class="bi bi-type-underline"></i>
        </button>

        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('justifyleft')">
          <i class="bi bi-text-left"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('justifycenter')">
          <i class="bi bi-text-center"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('justifyright')">
          <i class="bi bi-text-right"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('justifyfull')">
          <i class="bi bi-justify"></i>
        </button>

        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('insertunorderedlist')">
          <i class="bi bi-list-ul"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('insertorderedlist')">
          <i class="bi bi-list-ol"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('outdent')">
          <i class="bi bi-text-indent-left"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('indent')">
          <i class="bi bi-text-indent-right"></i>
        </button>

        <div class="d-flex align-items-center gap-2">
          <label class="color-control">
            <span class="label">Màu chữ</span>
            <input type="color" v-model="foreColor" @change="applyColor('foreColor', foreColor.value)" />
          </label>
          <label class="color-control">
            <span class="label">Nền</span>
            <input type="color" v-model="backColor" @change="applyColor('hiliteColor', backColor.value)" />
          </label>
        </div>

        <button type="button" class="btn btn-light btn-sm" @click="addLink">
          <i class="bi bi-link-45deg"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="applyCommand('unlink')">
          <i class="bi bi-link-45deg text-decoration-line-through"></i>
        </button>

        <button type="button" class="btn btn-light btn-sm" @click="clearFormatting">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>

    <div class="editor-card shadow-sm">
      <div
          ref="editor"
          class="editable"
          contenteditable="true"
          @input="updateContent"
          :style="{
          fontFamily: font,
          fontSize: `${fontSize}px`,
        }"
      ></div>
      <div class="status-bar">Độ dài: {{ contentLength }} ký tự</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

const menuItems = ['Tập tin', 'Sửa', 'Xem', 'Chèn', 'Định dạng', 'Công cụ', 'Bảng', 'Trợ giúp']
const fonts = ['Roboto', 'Roboto Condensed', 'Segoe UI', 'Arial', 'Times New Roman']
const fontSizes = [12, 13, 14, 16, 18, 20, 24]
const blockOptions = [
  { label: 'Đoạn văn', value: 'P' },
  { label: 'Tiêu đề 1', value: 'H1' },
  { label: 'Tiêu đề 2', value: 'H2' },
  { label: 'Tiêu đề 3', value: 'H3' },
]

const block = ref('P')
const font = ref('Roboto Condensed')
const fontSize = ref(14)
const foreColor = ref('#1f89f5')
const backColor = ref('#ffffff')
const editor = ref(null)

const state = reactive({
  contentLength: 0,
})

const applyCommand = (command, value = null) => {
  document.execCommand(command, false, value)
  focusEditor()
}

const applyFont = () => applyCommand('fontName', font.value)
const applyFontSize = () => applyCommand('fontSize', mapFontSizeToCommand(fontSize.value))
const applyBlock = () => applyCommand('formatBlock', block.value)
const applyColor = (command, value) => applyCommand(command, value)

const addLink = () => {
  const url = window.prompt('Nhập đường dẫn')
  if (url) applyCommand('createLink', url)
}

const clearFormatting = () => {
  applyCommand('removeFormat')
  applyCommand('unlink')
}

const updateContent = () => {
  if (!editor.value) return
  state.contentLength = editor.value.innerText.trim().length
}

const focusEditor = () => {
  if (!editor.value) return
  editor.value.focus()
}

const mapFontSizeToCommand = (size) => {
  // execCommand fontSize nhận giá trị 1-7, map đơn giản để gần kích thước mong muốn
  if (size <= 12) return 2
  if (size <= 13) return 3
  if (size <= 14) return 4
  if (size <= 16) return 5
  if (size <= 18) return 6
  return 7
}

onMounted(() => {
  focusEditor()
  applyFont()
  applyFontSize()
  applyColor('foreColor', foreColor.value)
})

const contentLength = computed(() => state.contentLength)
</script>

<style scoped>
.editor-wrapper {
  padding: 20px;
  background: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
}

.toolbar {
  background: #fff;
  border: 1px solid #dfe3eb;
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 8px 12px;
}

.toolbar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.menu-row {
  font-size: 13px;
  margin-bottom: 8px;
}

.menu-item {
  padding: 4px 8px;
  color: #2a2f38;
  border-radius: 6px;
}

.menu-item:hover {
  background: #eef2f8;
}

.control-row .btn {
  border-color: #d9dde6;
  color: #2f3542;
}

.control-row .btn:hover {
  background: #eef2f8;
}

.format-select,
.font-select,
.size-select {
  width: max-content;
  min-width: 120px;
}

.size-select {
  min-width: 90px;
}

.color-control {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #525866;
}

.color-control input {
  width: 36px;
  height: 24px;
  padding: 0;
  border: 1px solid #d9dde6;
  border-radius: 6px;
}

.editor-card {
  background: #fff;
  border: 1px solid #dfe3eb;
  border-radius: 12px;
  overflow: hidden;
}

.editable {
  min-height: 320px;
  padding: 16px;
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2933;
}

.editable:focus {
  box-shadow: inset 0 0 0 2px #1f89f5;
}

.status-bar {
  padding: 8px 12px;
  border-top: 1px solid #e6e9f0;
  font-size: 12px;
  color: #6b7280;
  background: #fafbfc;
}
</style>