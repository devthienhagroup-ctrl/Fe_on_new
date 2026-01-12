// ✅ Phải ở ngay đầu file
window.global = window;

// Vue core
import { createApp, watch } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuthStore } from './stores/authStore'
import { attachUserId, init, setupRouterTracking } from './ga4'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

//AOS
import AOS from "aos";
import "aos/dist/aos.css";

//
import "./components/user/UI/GlobalUI.css"
import './style.css'
// App init
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
const authStore = useAuthStore()

init()
attachUserId()
setupRouterTracking(router)

watch(
    () => authStore.userInfo?.id,
    () => {
        attachUserId()
    },
    { immediate: true }
)
app.use(router)
app.mount('#app')
// document.addEventListener("contextmenu", (event) => {
//     event.preventDefault();
//     console.log("[Security] Right click disabled.");
// });


// init 1 lần
AOS.init({
    once: true,
    duration: 700,
    easing: "ease-out-cubic",
});

// refresh mỗi lần đổi route
router.afterEach((to) => {
    if (!to.meta.useAOS) return;

    setTimeout(() => {
        AOS.refreshHard();
    }, 80);
});

import "/src/assets/css/global.css"