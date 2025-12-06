import { defineStore } from "pinia";
import { ref } from "vue";

export const useSidebarStore = defineStore("sidebar", () => {
    const isExpanded = ref(true);  // mặc định đang mở

    const toggle = () => isExpanded.value = !isExpanded.value;
    const open = () => isExpanded.value = true;
    const close = () => isExpanded.value = false;

    return { isExpanded, toggle, open, close };
});
