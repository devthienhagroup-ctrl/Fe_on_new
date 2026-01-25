import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useSidebarStore = defineStore("sidebar", () => {
    // 👉 lấy trạng thái cũ nếu có
    const isExpanded = ref(
        localStorage.getItem("sidebar_expanded") !== null
            ? localStorage.getItem("sidebar_expanded") === "true"
            : false
    );

    const toggle = () => {
        isExpanded.value = !isExpanded.value;
    };

    const open = () => {
        isExpanded.value = true;
    };

    const close = () => {
        isExpanded.value = false;
    };

    // 👉 mỗi lần đổi trạng thái thì lưu lại
    watch(isExpanded, (val) => {
        localStorage.setItem("sidebar_expanded", val);
    });

    return { isExpanded, toggle, open, close };
});
