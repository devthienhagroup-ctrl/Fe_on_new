// src/api/api.js
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import router from "../router/index.js"
import { showAlert, showError } from "../assets/js/alertService.js";
const api = axios.create({
    baseURL: 'http://localhost:8084/apithienha',
    withCredentials: true, // để gửi kèm cookie refreshToken
})


// Gắn Authorization cho mọi request
api.interceptors.request.use(
    (config) => {
        const auth = useAuthStore()
        if (auth?.accessToken) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${auth.accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Xử lý 401/403
let refreshPromise = null;

api.interceptors.response.use(
    (res) => {
        if (res?.config?._retryCount) delete res.config._retryCount;
        return res;
    },
    async (error) => {
        const { response, config } = error || {};
        const status = response?.status;
        const originalRequest = config;
        const auth = useAuthStore();

        originalRequest._retryCount = originalRequest._retryCount || 0;

        const isAuthEndpoint = originalRequest?.url?.includes("/thg/api/auth/");
        const alreadyRetried = originalRequest?.__isRetryRequest === true;

        // ⭐ Không retry nếu lỗi 500
        if (status === 500) {
            console.warn("Server error 500 — giữ nguyên trạng thái, không logout, không redirect.");
            return Promise.reject(error);
        }

        // 🔁 Tự refresh token (trừ khi lỗi 500)
        if (
            !alreadyRetried &&
            !isAuthEndpoint &&
            auth?.accessToken &&
            originalRequest._retryCount < 1
        ) {
            try {
                originalRequest._retryCount++;

                if (!refreshPromise) {
                    refreshPromise = auth.refetch().finally(() => (refreshPromise = null));
                }

                await refreshPromise;

                originalRequest.__isRetryRequest = true;
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${auth.accessToken}`,
                };

                return api.request(originalRequest);
            } catch (e) {
                console.error("Token refresh failed:", e);

                // ❗ Nếu token lỗi nhưng không phải 500 thì mới logout
                if (status !== 500) {
                    await auth.logout();
                    const link = localStorage.getItem("loginFrom");
                    if (link === "admin") router.push("/-thg/dang-nhap");
                    else router.push("/dang-nhap");

                    showError("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại");
                }

                return Promise.reject(e);
            }
        }

        // 🚫 403 nhưng không phải 500 → xử lý cảnh báo (không logout nếu bạn muốn)
        if (status === 403) {
            showAlert(
                "Cảnh báo truy cập trái phép!",
                "Bạn không có quyền thực hiện hành động này."
            );
            // Không logout, không redirect khi 500
            const link = localStorage.getItem("loginFrom");
            if (link === "admin") router.push("/-thg/quan-ly");
            else router.push("/");
        }

        // 🚪 401 mà không refresh được → logout (nhưng không logout nếu 500)
        if (status === 401 && !isAuthEndpoint && status !== 500) {
            await auth.logout();
            const link = localStorage.getItem("loginFrom");
            if (link === "admin") router.push("/-thg/dang-nhap");
            else router.push("/dang-nhap");

            showError("Phiên đăng nhập không hợp lệ", "Vui lòng đăng nhập lại");
        }

        return Promise.reject(error);
    }
);


export default api
