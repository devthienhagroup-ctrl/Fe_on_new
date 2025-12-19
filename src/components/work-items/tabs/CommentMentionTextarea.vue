<template>
  <div class="mention-textarea">
    <div
        ref="overlayRef"
        class="mention-overlay"
        aria-hidden="true"
        :style="overlayInlineStyles"
        v-html="overlayContent"
    ></div>
    <textarea
        ref="textareaRef"
        :value="localValue"
        :rows="rows"
        :placeholder="placeholder"
        :class="textareaClass"
        @input="onInput"
        @keydown="onKeydown"
        @keyup="onCaretChange"
        @click="onCaretChange"
        @blur="onBlur"
        @scroll="onScroll"
    ></textarea>

    <transition name="mention-fade">
      <ul
          v-if="showSuggestions && suggestions.length"
          class="mention-suggestions list-unstyled mb-0"
      >
        <li
            v-for="(employee, index) in suggestions"
            :key="employee.employeeID || employee.id || employee.fullName || index"
            class="mention-suggestion"
            :class="{ active: index === highlightedIndex }"
            @mousedown.prevent="selectEmployee(employee)"
            @mouseenter="highlightedIndex = index"
        >
          <img
              v-if="employee.avatar"
              :src="buildAvatarUrl(employee.avatar)"
              class="avatar"
              alt="avatar"
          />
          <div v-else class="avatar placeholder">
            <i class="fa-regular fa-user"></i>
          </div>
          <span class="name">{{ employee.fullName }}</span>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  employees: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: [Number, String],
    default: 2,
  },
  placeholder: {
    type: String,
    default: "",
  },
  textareaClass: {
    type: [String, Array, Object],
    default: "form-control",
  },
});

const emit = defineEmits(["update:modelValue"]);

const textareaRef = ref(null);
const overlayRef = ref(null);
const localValue = ref(props.modelValue ?? "");
const showSuggestions = ref(false);
const highlightedIndex = ref(0);
const mentionQuery = ref("");
const mentionStart = ref(null);
const overlayInlineStyles = ref({
  padding: "0.375rem 0.75rem",
});
let resizeObserver;

watch(
    () => props.modelValue,
    (val) => {
      if (val !== localValue.value) {
        localValue.value = val ?? "";
      }
    }
);

watch(
    () => props.textareaClass,
    () => {
      nextTick(() => {
        syncOverlayStyle();
      });
    }
);

watch(localValue, (val) => {
  emit("update:modelValue", val);
  nextTick(() => {
    syncOverlayScroll();
    syncOverlayStyle();
  });
});

onMounted(() => {
  nextTick(() => {
    syncOverlayScroll();
    syncOverlayStyle();
    if (typeof ResizeObserver !== "undefined" && textareaRef.value) {
      resizeObserver = new ResizeObserver(() => {
        syncOverlayScroll();
        syncOverlayStyle();
      });
      resizeObserver.observe(textareaRef.value);
    }
  });
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = undefined;
  }
});

const overlayContent = computed(() => {
  const value = localValue.value ?? "";
  if (!value) {
    return `<span class="mention-overlay__placeholder">${escapeHtml(
        props.placeholder || ""
    )}</span>`;
  }
  return highlightMentions(escapeHtml(value));
});

const normalizedEmployees = computed(() => {
  const seen = new Set();
  return (props.employees || []).reduce((acc, employee) => {
    if (!employee) return acc;
    const fullName = employee.fullName || employee.name || employee.displayName || "";
    if (!fullName) return acc;
    const id =
        employee.employeeID ??
        employee.id ??
        employee.employeeId ??
        employee.userID ??
        employee.email ??
        fullName;

    if (seen.has(id)) return acc;
    seen.add(id);

    acc.push({
      ...employee,
      employeeID: id,
      fullName,
    });
    return acc;
  }, []);
});

const suggestions = computed(() => {
  if (!showSuggestions.value) return [];
  const list = normalizedEmployees.value;
  if (!mentionQuery.value) {
    return list.slice(0, 5);
  }
  const query = slugify(mentionQuery.value);
  const withoutDiacritics = removeDiacritics(mentionQuery.value).toLowerCase();
  return list
      .filter((employee) => {
        const nameSlug = slugify(employee.fullName);
        const nameNoDiacritics = removeDiacritics(employee.fullName).toLowerCase();
        return nameSlug.includes(query) || nameNoDiacritics.includes(withoutDiacritics);
      })
      .slice(0, 5);
});

function onInput(event) {
  localValue.value = event.target.value;
  updateMentionState(event.target);
}

function onScroll(event) {
  syncOverlayScroll(event.target);
}

function onKeydown(event) {
  if (!showSuggestions.value || !suggestions.value.length) {
    return;
  }

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      highlightedIndex.value = (highlightedIndex.value + 1) % suggestions.value.length;
      break;
    case "ArrowUp":
      event.preventDefault();
      highlightedIndex.value =
          (highlightedIndex.value - 1 + suggestions.value.length) % suggestions.value.length;
      break;
    case "Enter":
    case "Tab":
      event.preventDefault();
      selectEmployee(suggestions.value[highlightedIndex.value]);
      break;
    case "Escape":
      event.preventDefault();
      closeSuggestions();
      break;
    default:
      break;
  }
}

function onCaretChange(event) {
  updateMentionState(event.target);
}

function onBlur() {
  window.setTimeout(() => {
    closeSuggestions();
  }, 120);
}

function updateMentionState(target) {
  if (!target) return;
  const value = target.value;
  const caret = target.selectionStart ?? value.length;
  const textBeforeCaret = value.slice(0, caret);
  const mentionMatch = textBeforeCaret.match(/(?:^|\s)(@[^\s@]*)$/u);

  if (mentionMatch) {
    mentionStart.value = caret - mentionMatch[1].length;
    mentionQuery.value = mentionMatch[1].slice(1);
    highlightedIndex.value = 0;
    showSuggestions.value = normalizedEmployees.value.length > 0;
  } else {
    closeSuggestions();
  }
}

function selectEmployee(employee) {
  if (!employee) return;
  const textarea = textareaRef.value;
  if (!textarea) return;

  const value = localValue.value;
  const caret = textarea.selectionStart ?? value.length;
  const start = mentionStart.value ?? caret;
  const before = value.slice(0, start);
  const after = value.slice(caret);

  let mention = `@${slugify(employee.fullName)}`;
  if (after.length === 0 || !/\s/.test(after.charAt(0))) {
    mention += " ";
  }

  localValue.value = `${before}${mention}${after}`;

  nextTick(() => {
    const cursorPosition = (before + mention).length;
    textarea.focus();
    textarea.setSelectionRange(cursorPosition, cursorPosition);
  });

  closeSuggestions();
}

function closeSuggestions() {
  showSuggestions.value = false;
  mentionQuery.value = "";
  mentionStart.value = null;
  highlightedIndex.value = 0;
}

function removeDiacritics(value = "") {
  return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
}

function slugify(value = "") {
  return removeDiacritics(value)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "");
}

function escapeHtml(value = "") {
  return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function highlightMentions(value = "") {
  const withBreaks = value.replace(/\n/g, "<br />");
  return withBreaks.replace(/(^|[^a-zA-Z0-9@])(@[a-z0-9_]+)/gi, (match, prefix, mention) => {
    return `${prefix}<span class="mention-overlay__mention">${mention}</span>`;
  });
}

function buildAvatarUrl(avatar) {
  if (!avatar) return "";
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  return ` https://s3.cloudfly.vn/thg-storage-dev/uploads-public/${avatar}`;
}

function syncOverlayScroll(source) {
  const textarea = source || textareaRef.value;
  const overlay = overlayRef.value;
  if (!textarea || !overlay) return;
  const scrollTop = textarea.scrollTop ?? 0;
  const scrollLeft = textarea.scrollLeft ?? 0;
  overlay.style.transform = `translate(${-scrollLeft}px, ${-scrollTop}px)`;
}

function syncOverlayStyle() {
  const textarea = textareaRef.value;
  if (!textarea || typeof window === "undefined") return;
  const styles = window.getComputedStyle(textarea);
  overlayInlineStyles.value = {
    padding: styles.padding,
    fontSize: styles.fontSize,
    fontFamily: styles.fontFamily,
    fontWeight: styles.fontWeight,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    textAlign: styles.textAlign,
    textTransform: styles.textTransform,
  };
}
</script>

<style scoped>
.mention-textarea {
  position: relative;
}

.mention-overlay {
  position: absolute;
  inset: 0;
  color: #212529;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  box-sizing: border-box;
  min-height: 100%;
  white-space: pre-wrap;
  word-break: break-word;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.mention-overlay__placeholder {
  color: #adb5bd;
}

.mention-overlay__mention {
  color: #0d6efd;
  font-weight: 600;
}

.mention-textarea textarea {
  width: 100%;
  resize: vertical;
  position: relative;
  background-color: transparent;
  color: transparent;
  caret-color: #212529;
  z-index: 1;
}

.mention-textarea textarea::placeholder {
  color: transparent;
}

.mention-suggestions {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% + 4px);
  margin-bottom: 4px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  max-height: 220px;
  overflow-y: auto;
  z-index: 20;
  padding: 4px 0;
}

.mention-suggestion {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.mention-suggestion .avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  background: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 0.85rem;
}

.mention-suggestion.active,
.mention-suggestion:hover {
  background-color: #e9f3ff;
}

.mention-suggestion .name {
  font-size: 0.92rem;
  color: #212529;
  font-weight: 500;
}

.mention-fade-enter-active,
.mention-fade-leave-active {
  transition: opacity 0.15s ease;
}

.mention-fade-enter-from,
.mention-fade-leave-to {
  opacity: 0;
}
</style>
