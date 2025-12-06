<template>
  <div class="description-editor">
    <!-- Trình soạn thảo mô tả sử dụng TipTap để tạo HTML thuần -->
    <div class="rich-editor border rounded-4 bg-white p-2 shadow-sm">
      <div class="editor-toolbar d-flex flex-wrap align-items-center gap-2 mb-2">
        <button
            type="button"
            class="btn btn-light btn-sm"
            :class="{ active: editor?.isActive('bold') }"
            @click="runCommand('toggleBold')"
        >
          <i class="fa-solid fa-bold"></i>
        </button>
        <button
            type="button"
            class="btn btn-light btn-sm"
            :class="{ active: editor?.isActive('italic') }"
            @click="runCommand('toggleItalic')"
        >
          <i class="fa-solid fa-italic"></i>
        </button>
        <button
            type="button"
            class="btn btn-light btn-sm"
            :class="{ active: editor?.isActive('bulletList') }"
            @click="runCommand('toggleBulletList')"
        >
          <i class="fa-solid fa-list-ul"></i>
        </button>
        <button
            type="button"
            class="btn btn-light btn-sm"
            :class="{ active: editor?.isActive('orderedList') }"
            @click="runCommand('toggleOrderedList')"
        >
          <i class="fa-solid fa-list-ol"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="setLink">
          <i class="fa-solid fa-link"></i>
        </button>
        <div class="vr mx-1"></div>
        <button type="button" class="btn btn-light btn-sm" @click="runCommand('undo')" :disabled="!editor?.can().undo()">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
        <button type="button" class="btn btn-light btn-sm" @click="runCommand('redo')" :disabled="!editor?.can().redo()">
          <i class="fa-solid fa-rotate-right"></i>
        </button>
        <input type="color" class="form-control-color form-control-sm" title="Tô màu chữ" @input="setColor($event)" />
      </div>
      <EditorContent v-if="editor" :editor="editor" class="editor-content" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const editor = ref(null);

const sanitizedContent = computed(() => {
  if (!props.modelValue || !props.modelValue.trim()) {
    return "";
  }
  return props.modelValue;
});

const initializeEditor = () => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({ link: false }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: sanitizedContent.value || "<p></p>",
    onUpdate: ({ editor: instance }) => {
      emit("update:modelValue", instance.getHTML());
    },
  });
};

onMounted(() => {
  initializeEditor();
});

onBeforeUnmount(() => {
  editor.value?.destroy();
  editor.value = null;
});

watch(sanitizedContent, (newValue) => {
  if (!editor.value) return;
  const current = editor.value.getHTML();
  if (newValue && newValue !== current) {
    editor.value.commands.setContent(newValue, false);
  }
  if (!newValue && current !== "<p></p>") {
    editor.value.commands.setContent("<p></p>", false);
  }
});

const runCommand = (command) => {
  if (!editor.value) return;
  editor.value.chain().focus()[command]().run();
};

const setLink = () => {
  if (!editor.value) return;
  const previousUrl = editor.value.getAttributes("link").href;
  const url = window.prompt("🔗 Nhập đường dẫn cần chèn:", previousUrl || "");
  if (url === null) return;

  if (url === "") {
    editor.value.chain().focus().unsetLink().run();
    return;
  }

  if (!/^https?:\/\//i.test(url)) {
    window.alert("⚠️ Link không hợp lệ, vui lòng nhập link đầy đủ (https://...)");
    return;
  }

  editor.value.chain().focus().setLink({ href: url }).run();
};

const setColor = (event) => {
  if (!editor.value) return;
  const color = event.target.value;
  editor.value.chain().focus().setColor(color).run();
};

const reset = (value = "") => {
  if (!editor.value) return;
  const content = value && value.trim() ? value : "<p></p>";
  editor.value.commands.setContent(content, false);
  emit("update:modelValue", content === "<p></p>" ? "" : content);
};

const focus = () => {
  editor.value?.commands.focus("end");
};

defineExpose({
  reset,
  focus,
  getHTML: () => editor.value?.getHTML() ?? "",
});
</script>

<style scoped>
.description-editor .rich-editor {
  min-height: 160px;
  max-height: 320px;
  overflow-y: auto;
}

.description-editor .editor-content {
  min-height: 140px;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.75rem;
}

.description-editor :deep(.ProseMirror) {
  padding: 12px 14px;
  outline: none;
  white-space: pre-wrap;
}

.description-editor :deep(.ProseMirror p) {
  margin: 0 0 0.5rem;
}

.description-editor :deep(.ProseMirror ul),
.description-editor :deep(.ProseMirror ol) {
  padding-left: 1.25rem;
}

.description-editor :deep(.ProseMirror a) {
  color: #0d6efd;
  text-decoration: underline;
}

.description-editor :deep(.ProseMirror strong) {
  font-weight: 600;
}

.description-editor :deep(.ProseMirror em) {
  font-style: italic;
}

.description-editor .editor-toolbar .btn {
  border: none;
  color: #495057;
  transition: all 0.2s ease;
}

.description-editor .editor-toolbar .btn:hover {
  background-color: #f1f3f5;
}

.description-editor .editor-toolbar .btn.active {
  background-color: #0d6efd;
  color: #fff;
}

.description-editor .editor-toolbar .btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
