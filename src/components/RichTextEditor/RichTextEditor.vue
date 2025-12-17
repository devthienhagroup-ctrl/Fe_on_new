<template>
  <div class="rich-text-editor-wrapper">
    <div v-if="editor" class="container">
<!--      &lt;!&ndash; Thêm nút xuất HTML &ndash;&gt;-->
<!--      <div class="export-section">-->
<!--        <button class="export-btn" @click="exportHTML">-->
<!--          <i class="fas fa-download"></i> Xuất HTML-->
<!--        </button>-->
<!--        <button class="export-btn" @click="showHTML = !showHTML">-->
<!--          <i class="fas fa-code"></i> {{ showHTML ? 'Ẩn' : 'Xem' }} HTML-->
<!--        </button>-->
<!--      </div>-->

<!--      &lt;!&ndash; Hiển thị HTML &ndash;&gt;-->
<!--      <div v-if="showHTML" class="html-preview">-->
<!--        <h4>HTML Output:</h4>-->
<!--        <pre class="html-code">{{ getFullHTMLWithInlineCSS() }}</pre>-->
<!--      </div>-->

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
              </div>
            </div>
          </div>

          <!-- Hiển thị ảnh xem trước -->
          <div v-if="imagePreview" class="image-preview">
            <p>Ảnh xem trước:</p>
            <img :src="imagePreview" alt="Preview" class="preview-image">
            <div class="preview-actions">
              <button class="editor-btn btn-confirm" @click="confirmImageInsert">
                <i class="fas fa-check"></i> Chèn ảnh
              </button>
              <button class="editor-btn btn-cancel" @click="cancelImageInsert">
                <i class="fas fa-times"></i> Hủy
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Bảng -->
        <!-- Chỉnh sửa phần tab bảng trong template -->
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
      <editor-content :editor="editor"/>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, watch, defineProps, defineEmits} from 'vue'
import { Plugin } from 'prosemirror-state' // Thêm dòng này
import {TableCell, TableKit} from '@tiptap/extension-table'
import {StarterKit} from '@tiptap/starter-kit'
import {Editor, EditorContent} from '@tiptap/vue-3'
import {Image} from '@tiptap/extension-image'
import {Color} from '@tiptap/extension-color'
import {TextStyle} from '@tiptap/extension-text-style'
import {TextAlign} from '@tiptap/extension-text-align'
import {Extension} from '@tiptap/core'
import ImageResize from 'tiptap-extension-image-resize'

// Props và Emits
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])


// Thêm extension để xử lý kéo thả ảnh
const DragAndDropHandler = Extension.create({
  name: 'dragAndDropHandler',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            // Ngăn chặn hành vi mặc định khi kéo thả
            drop: (view, event) => {
              const { dataTransfer } = event

              // Kiểm tra nếu đang kéo thả file ảnh
              if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
                event.preventDefault()

                const files = Array.from(dataTransfer.files)
                const imageFiles = files.filter(file => file.type.startsWith('image/'))

                if (imageFiles.length > 0) {
                  // Xử lý upload ảnh
                  handleDroppedImages(imageFiles)
                  return true
                }
              }

              // Kiểm tra nếu đang kéo thả URL ảnh
              if (dataTransfer && dataTransfer.getData('text/html')) {
                const html = dataTransfer.getData('text/html')
                const imgMatch = html.match(/<img[^>]+src="([^">]+)"/)

                if (imgMatch && imgMatch[1]) {
                  event.preventDefault()
                  insertImageFromURL(imgMatch[1])
                  return true
                }
              }

              return false
            },

            // Ngăn chặn drag over mặc định
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

// Hàm xử lý ảnh được kéo thả
const handleDroppedImages = async (files) => {
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue

    if (file.size > 5 * 1024 * 1024) {
      alert(`Ảnh "${file.name}" vượt quá kích thước 5MB!`)
      continue
    }

    try {
      const imageUrl = URL.createObjectURL(file)
      // Chèn ảnh vào vị trí con trỏ
      editor.value.chain().focus().setImage({ src: imageUrl }).run()
    } catch (error) {
      console.error('Lỗi khi chèn ảnh:', error)
      alert(`Lỗi khi chèn ảnh "${file.name}"`)
    }
  }
}

// Hàm chèn ảnh từ URL
const insertImageFromURL = (src) => {
  if (src) {
    editor.value.chain().focus().setImage({ src }).run()
  }
}

// Sửa hàm handleImageUpload để tránh nhân đôi
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

    // Reset input file trước
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    selectedImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Sửa hàm confirmImageInsert
const confirmImageInsert = () => {
  if (imagePreview.value && selectedImageFile.value) {
    const imageUrl = URL.createObjectURL(selectedImageFile.value)

    // Đảm bảo chỉ chèn một lần
    editor.value.chain().focus().setImage({ src: imageUrl }).run()

    // Reset ngay sau khi chèn
    cancelImageInsert()
  }
}

// Thêm hàm reset editor state nếu cần
const resetEditorImageState = () => {
  imagePreview.value = null
  selectedImageFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Thêm Image extension với attributes tốt hơn
const ImageWithDragDrop = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      draggable: {
        default: 'true',
      },
      'data-drag-handle': {
        default: 'true',
      }
    }
  },
})

onMounted(() => {
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
      // Sử dụng Image extension đã extend
      ImageWithDragDrop.configure({
        HTMLAttributes: {
          class: 'inserted-image',
          draggable: 'false', // Tắt khả năng kéo trên ảnh đã chèn
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
      // Thêm extension xử lý kéo thả
      DragAndDropHandler,
    ],
    content: props.modelValue || `
        <h3>
          Bạn đã thấy các bảng của chúng tôi chưa? Chúng thật tuyệt vời!
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
    onUpdate: handleUpdate,
    // Thêm editor props để kiểm soát kéo thả tốt hơn
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: 'min-height: 500px;'
      },
      handleDrop: (view, event, slice, moved) => {
        // Ngăn chặn xử lý mặc định, để plugin xử lý
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          event.preventDefault()
          return true
        }
        return false
      },
    },
  })
})


// Tạo FontSize extension trực tiếp
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
      setFontSize: fontSize => ({chain}) => {
        return chain()
            .setMark('textStyle', {fontSize})
            .run()
      },
      unsetFontSize: () => ({chain}) => {
        return chain()
            .setMark('textStyle', {fontSize: null})
            .removeEmptyTextStyle()
            .run()
      },
    }
  },
})

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

const editor = ref(null)
const activeTab = ref('format')
const fileInput = ref(null)
const imagePreview = ref(null)
const selectedImageFile = ref(null)
const showHTML = ref(false)
const textColor = ref('#000000')
const cellBackgroundColor = ref('#FAF594')
const headerBackgroundColor = ref('#E5E7EB')

// Biến cho font size
const selectedFontSize = ref('')

// Biến cho kích thước bảng
const tableRows = ref(3)
const tableCols = ref(3)
const tableHasHeader = ref(true)

// Hàm lấy HTML với CSS inline đầy đủ
const getFullHTMLWithInlineCSS = () => {
  if (!editor.value) return ''

  const content = editor.value.getHTML()

  // CSS inline cho tất cả các thành phần
  const inlineStyles = `
    <style>
      /* Reset và base styles */
      body {
        margin: 0;
        padding: 20px;
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #000000;
        background-color: #ffffff;
      }

      /* Heading styles */
      h1 { font-size: 1.4rem; line-height: 1.1; margin-top: 3.5rem; margin-bottom: 1.5rem; text-wrap: pretty; }
      h2 { font-size: 1.2rem; line-height: 1.1; margin-top: 3.5rem; margin-bottom: 1.5rem; text-wrap: pretty; }
      h3 { font-size: 1.1rem; line-height: 1.1; margin-top: 2.5rem; text-wrap: pretty; }
      h4, h5, h6 { font-size: 1rem; line-height: 1.1; margin-top: 2.5rem; text-wrap: pretty; }

      /* Paragraph styles */
      p { margin: 1rem 0; }

      /* List styles */
      ul, ol {
        padding: 0 1rem;
        margin: 1.25rem 1rem 1.25rem 0.4rem;
      }
      ul li p, ol li p {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }

      /* Code styles */
      code {
        background-color: #d8b8e8;
        border-radius: 0.4rem;
        color: #000000;
        font-size: 0.85rem;
        padding: 0.25em 0.3em;
      }

      pre {
        background: #000000;
        border-radius: 0.5rem;
        color: #ffffff;
        font-family: 'JetBrainsMono', monospace;
        margin: 1.5rem 0;
        padding: 0.75rem 1rem;
      }

      pre code {
        background: none;
        color: inherit;
        font-size: 0.8rem;
        padding: 0;
      }

      /* Blockquote styles */
      blockquote {
        border-left: 3px solid #999999;
        margin: 1.5rem 0;
        padding-left: 1rem;
      }

      /* HR styles */
      hr {
        border: none;
        border-top: 1px solid rgba(153, 153, 153, 0.5);
        margin: 2rem 0;
      }

      /* Table styles */
      table {
        border-collapse: collapse;
        margin: 1.5rem 0;
        overflow: hidden;
        table-layout: fixed;
        width: 100%;
      }

      table td, table th {
        border: 1px solid #999999;
        box-sizing: border-box;
        min-width: 1em;
        padding: 6px 8px;
        position: relative;
        vertical-align: top;
      }

      table th {
        background-color: #E5E7EB !important;
        font-weight: bold;
        text-align: left;
      }

      table td > *, table th > * {
        margin-bottom: 0;
      }

      /* Image styles */
      .inserted-image {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        margin: 8px 0;
      }

      /* Link styles */
      a { color: #3b82f6; text-decoration: underline; }
      a:hover { color: #2563eb; }

      /* Text alignment */
      .text-align-left { text-align: left; }
      .text-align-center { text-align: center; }
      .text-align-right { text-align: right; }
      .text-align-justify { text-align: justify; }
    </style>
  `

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Document</title>
  ${inlineStyles}
</head>
<body>
  ${content}
</body>
</html>`
}

// Hàm xuất HTML với CSS inline
const exportHTML = () => {
  const fullHTML = getFullHTMLWithInlineCSS()

  // Tạo blob và download
  const blob = new Blob([fullHTML], {type: 'text/html'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  // Hiển thị thông báo
  alert('Đã xuất HTML thành công!')
}

// Hàm đặt font size
const setFontSize = () => {
  if (editor.value) {
    if (selectedFontSize.value) {
      editor.value.chain().focus().setFontSize(selectedFontSize.value).run()
    } else {
      editor.value.chain().focus().unsetFontSize().run()
    }
  }
}

// Hàm reset font size
const resetFontSize = () => {
  if (editor.value) {
    editor.value.chain().focus().unsetFontSize().run()
    selectedFontSize.value = ''
  }
}

// Hàm đặt màu chữ
const setTextColor = () => {
  if (textColor.value && editor.value) {
    editor.value.chain().focus().setColor(textColor.value).run()
  }
}

// Hàm reset màu chữ
const resetTextColor = () => {
  if (editor.value) {
    editor.value.chain().focus().unsetColor().run()
    textColor.value = '#000000'
  }
}

// Hàm chọn màu nền ô
const setCellBackgroundColor = (color) => {
  if (editor.value) {
    editor.value.chain().focus().setCellAttribute('backgroundColor', color).run()
  }
}

// Hàm xóa màu nền ô (sửa lỗi)
const removeCellBackgroundColor = () => {
  if (editor.value) {
    editor.value.chain().focus().unsetCellAttribute('backgroundColor').run()
  }
}

// Hàm đặt màu nền cho hàng tiêu đề
const setHeaderBackgroundColor = (color) => {
  if (editor.value) {
    // Áp dụng màu cho tất cả các ô trong hàng tiêu đề
    editor.value.chain().focus().setCellAttribute('backgroundColor', color).run()
  }
}

// Hàm tạo bảng với kích thước đã chọn
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

  // Tự động áp dụng màu cho hàng tiêu đề nếu có
  if (tableHasHeader.value) {
    setTimeout(() => {
      // Di chuyển đến hàng đầu tiên và áp dụng màu
      editor.value.chain().focus().setCellAttribute('backgroundColor', headerBackgroundColor.value).run()
    }, 100)
  }
}

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

// Hoặc copy vào clipboard
const copyHTML = async () => {
  try {
    await navigator.clipboard.writeText(getFullHTMLWithInlineCSS())
    alert('Đã copy HTML vào clipboard!')
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

// const handleImageUpload = (event) => {
//   const file = event.target.files[0]
//   if (file) {
//     if (!file.type.startsWith('image/')) {
//       alert('Vui lòng chọn file ảnh!')
//       return
//     }
//
//     if (file.size > 5 * 1024 * 1024) {
//       alert('Kích thước ảnh không được vượt quá 5MB!')
//       return
//     }
//
//     selectedImageFile.value = file
//     const reader = new FileReader()
//     reader.onload = (e) => {
//       imagePreview.value = e.target.result
//     }
//     reader.readAsDataURL(file)
//   }
// }
//
// const confirmImageInsert = () => {
//   if (imagePreview.value && selectedImageFile.value) {
//     const imageUrl = URL.createObjectURL(selectedImageFile.value)
//     editor.value.chain().focus().setImage({src: imageUrl}).run()
//     cancelImageInsert()
//   }
// }

const cancelImageInsert = () => {
  imagePreview.value = null
  selectedImageFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const insertLink = () => {
  const url = window.prompt('Nhập URL liên kết:')
  if (url) {
    editor.value.chain().focus().setLink({href: url}).run()
  }
}

const insertHTMLTable = () => {
  editor.value
      .chain()
      .focus()
      .insertContent(tableHTML, {parseOptions: {preserveWhitespace: false}})
      .run()
}

// Watch for content changes and emit update
const handleUpdate = () => {
  if (editor.value) {
    emit('update:modelValue', editor.value.getHTML())
  }
}

// Watch for prop changes and update editor
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue, false)
  }
})

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      TextStyle, // Thêm TextStyle trước Color
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
      ImageResize, // Thêm extension resize ảnh
      TableKit.configure({
        table: {
          resizable: true,
        },
        tableCell: false,
      }),
      CustomTableCell,
      FontSize, // Thêm FontSize extension
    ],
    content: props.modelValue || `
        <h3>
          Bạn đã thấy các bảng của chúng tôi chưa? Chúng thật tuyệt vời!
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
    onUpdate: handleUpdate,
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style scoped>
/* Scoped styles - chỉ áp dụng cho component này */
.rich-text-editor-wrapper {
  width: 100%;
}

.export-section {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.export-btn {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  padding: 8px 16px !important;
  background-color: #3b82f6 !important;
  border: 1px solid #3b82f6 !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  font-size: 14px !important;
  transition: all 0.2s ease !important;
  color: white !important;
  font-family: inherit !important;
  min-height: auto !important;
  line-height: normal !important;
  box-shadow: none !important;
  outline: none !important;
}

.export-btn:hover {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
  transform: translateY(-1px) !important;
}

.html-preview {
  margin-bottom: 16px;
  padding: 16px;
  background-color: #1e293b;
  border-radius: 8px;
  border: 1px solid #334155;
}

.html-preview h4 {
  margin: 0 0 12px 0;
  color: #f1f5f9;
  font-size: 14px;
  font-weight: 600;
}

.html-code {
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
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
  min-width: 200px;
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

/* Các styles khác cho UI controls... */
.font-size-group,
.color-picker-group,
.table-size-selector,
.upload-container,
.image-preview,
.preview-actions {
  /* Các style cụ thể cho từng phần */
}

.font-size-group, .color-picker-group {
  display: flex;
  gap: 8px;
}


.font-size-select, .color-input {
  border: 1px solid var(--border-color) !important;
  border-radius: 6px !important;
}

.size-inputs {
  display: flex;
}

.size-inputs .input-group {
  gap: 10px
}

.size-inputs .input-group > input[type=number] {
  border: 1px solid var(--border-color) !important;
  border-radius: 6px !important;
}

.table-tab-wrapper {
  display: flex;
}



.table-tab-wrapper .subgroup-buttons .editor-btn{
  flex: none;
  width: 100%;
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
  padding: 20px;
  background-color: white;
  min-height: 500px;
}


/* CSS mới cho tab bảng */
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

/* Điều chỉnh lại các nút trong tab bảng */
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

/* Đảm bảo các nút không bị tràn */
.subgroup-buttons {
  max-width: 100%;
  overflow: hidden;
}

.editor-btn {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Điều chỉnh cho các nút nhỏ trong color picker */
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
/* Thêm style để chỉ ra vùng drop hợp lệ */
.rich-text-editor-wrapper .tiptap {
  min-height: 500px;
}

.rich-text-editor-wrapper .tiptap.drag-over {
  background-color: #f0f9ff;
  border: 2px dashed #3b82f6;
}
</style>

<style>
/* Global styles - nhưng được scoped bằng wrapper class */
.rich-text-editor-wrapper .tiptap:first-child {
  margin-top: 0;
}

/* List styles */
.rich-text-editor-wrapper .tiptap ul,
.rich-text-editor-wrapper .tiptap ol {
  padding: 0 1rem;
  margin: 1.25rem 1rem 1.25rem 0.4rem;
}

.rich-text-editor-wrapper .tiptap ul li p,
.rich-text-editor-wrapper .tiptap ol li p {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

/* Heading styles */
.rich-text-editor-wrapper .tiptap h1,
.rich-text-editor-wrapper .tiptap h2,
.rich-text-editor-wrapper .tiptap h3,
.rich-text-editor-wrapper .tiptap h4,
.rich-text-editor-wrapper .tiptap h5,
.rich-text-editor-wrapper .tiptap h6 {
  line-height: 1.1;
  margin-top: 2.5rem;
  text-wrap: pretty;
}

.rich-text-editor-wrapper .tiptap h1,
.rich-text-editor-wrapper .tiptap h2 {
  margin-top: 3.5rem;
  margin-bottom: 1.5rem;
}

.rich-text-editor-wrapper .tiptap h1 {
  font-size: 1.4rem;
}

.rich-text-editor-wrapper .tiptap h2 {
  font-size: 1.2rem;
}

.rich-text-editor-wrapper .tiptap h3 {
  font-size: 1.1rem;
}

.rich-text-editor-wrapper .tiptap h4,
.rich-text-editor-wrapper .tiptap h5,
.rich-text-editor-wrapper .tiptap h6 {
  font-size: 1rem;
}

/* Code and preformatted text styles */
.rich-text-editor-wrapper .tiptap code {
  background-color: var(--purple-light);
  border-radius: 0.4rem;
  color: var(--black);
  font-size: 0.85rem;
  padding: 0.25em 0.3em;
}

.rich-text-editor-wrapper .tiptap pre {
  background: var(--black);
  border-radius: 0.5rem;
  color: var(--white);
  font-family: 'JetBrainsMono', monospace;
  margin: 1.5rem 0;
  padding: 0.75rem 1rem;
}

.rich-text-editor-wrapper .tiptap pre code {
  background: none;
  color: inherit;
  font-size: 0.8rem;
  padding: 0;
}

.rich-text-editor-wrapper .tiptap blockquote {
  border-left: 3px solid var(--gray-3);
  margin: 1.5rem 0;
  padding-left: 1rem;
}

.rich-text-editor-wrapper .tiptap hr {
  border: none;
  border-top: 1px solid var(--gray-2);
  margin: 2rem 0;
}

/* Table-specific styling */
.rich-text-editor-wrapper .tiptap table {
  border-collapse: collapse;
  margin: 0;
  overflow: hidden;
  table-layout: fixed;
  width: 100%;
}

.rich-text-editor-wrapper .tiptap table td,
.rich-text-editor-wrapper .tiptap table th {
  border: 1px solid var(--gray-3);
  box-sizing: border-box;
  min-width: 1em;
  padding: 6px 8px;
  position: relative;
  vertical-align: top;
}

.rich-text-editor-wrapper .tiptap table td > *,
.rich-text-editor-wrapper .tiptap table th > * {
  margin-bottom: 0;
}

.rich-text-editor-wrapper .tiptap table th {
  background-color: var(--gray-1);
  font-weight: bold;
  text-align: left;
}

.rich-text-editor-wrapper .tiptap table .selectedCell:after {
  background: var(--gray-2);
  content: '';
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  position: absolute;
  z-index: 2;
  opacity: 0.2;
}

.rich-text-editor-wrapper .tiptap table .column-resize-handle {
  background-color: var(--purple);
  bottom: -2px;
  pointer-events: none;
  position: absolute;
  right: -2px;
  top: 0;
  width: 4px;
}

.rich-text-editor-wrapper .tiptap .tableWrapper {
  margin: 1.5rem 0;
  overflow-x: auto;
}

.rich-text-editor-wrapper .tiptap.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}

/* Image styles in editor */
.rich-text-editor-wrapper .inserted-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 8px 0;
}

/* Image resize styles */
.rich-text-editor-wrapper .tiptap img.ProseMirror-selectednode {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}

.rich-text-editor-wrapper .tiptap .image-resizer {
  display: inline-block;
  position: relative;
}

.rich-text-editor-wrapper .tiptap .image-resizer .resize-handle {
  position: absolute;
  background: var(--primary-color);
  border: 1px solid white;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  z-index: 10;
}

.rich-text-editor-wrapper .tiptap .image-resizer .resize-handle.top-left {
  top: -5px;
  left: -5px;
  cursor: nwse-resize;
}

.rich-text-editor-wrapper .tiptap .image-resizer .resize-handle.top-right {
  top: -5px;
  right: -5px;
  cursor: nesw-resize;
}

.rich-text-editor-wrapper .tiptap .image-resizer .resize-handle.bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize;
}

.rich-text-editor-wrapper .tiptap .image-resizer .resize-handle.bottom-right {
  bottom: -5px;
  right: -5px;
  cursor: nwse-resize;
}

/* Text alignment styles */
.rich-text-editor-wrapper .tiptap .text-align-left {
  text-align: left;
}

.rich-text-editor-wrapper .tiptap .text-align-center {
  text-align: center;
}

.rich-text-editor-wrapper .tiptap .text-align-right {
  text-align: right;
}

.rich-text-editor-wrapper .tiptap .text-align-justify {
  text-align: justify;
}

/* CSS Variables */
.rich-text-editor-wrapper {
  --purple: #8e44ad;
  --purple-light: #d8b8e8;
  --black: #000000;
  --white: #ffffff;
  --gray-1: #f5f5f5;
  --gray-2: rgba(153, 153, 153, 0.5);
  --gray-3: #999999;
  --primary-color: #3b82f6;
  --hover-color: #eff6ff;
  --border-color: #d1d5db;
  --disabled-color: #9ca3af;
  --tab-active-color: #2563eb;
  --success-color: #10b981;
  --danger-color: #ef4444;
}

/* Thêm style cho trạng thái kéo thả */
.rich-text-editor-wrapper .tiptap .ProseMirror-dropcursor {
  width: 4px;
  background-color: #3b82f6;
}

/* Style cho ảnh khi đang được kéo */
.rich-text-editor-wrapper .tiptap img[draggable="true"] {
  cursor: grab;
}

.rich-text-editor-wrapper .tiptap img[draggable="true"]:active {
  cursor: grabbing;
}

/* Vùng drop indicator */
.rich-text-editor-wrapper .tiptap .drop-indicator {
  background-color: #3b82f6;
  height: 2px;
  margin: 2px 0;
  opacity: 0.6;
}
</style>