// src/api/api.js
import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import router from "../router/index.js"
import { showAlert, showError } from "../assets/js/alertService.js";

/* ===================== CONFIG ===================== */

const api = axios.create({
    baseURL: 'http://localhost:8084/apithienha',
    withCredentials: true, // gửi cookie refreshToken
})

/**
 * Các API PUBLIC – PHẢI KHỚP 100% với requestMatchers().permitAll()
 */
const PUBLIC_API_PREFIX = [
    "/thg/public/",
    "/thg/api/auth/",
    "/user.thg/product/user/",
    "/uploads/",
    "/uploadpss/",
    "/ws-thg/",
    "/webhook/"
]

const isPublicApi = (url = "") =>
    PUBLIC_API_PREFIX.some(prefix => url.startsWith(prefix))

/* ===================== REQUEST INTERCEPTOR ===================== */

api.interceptors.request.use(
    (config) => {
        const auth = useAuthStore()
        const url = config?.url || ""

        // 🔍 DEBUG REQUEST
        console.debug("[API REQUEST]", {
            url,
            method: config.method,
            isPublic: isPublicApi(url),
            hasToken: !!auth?.accessToken
        })

        // ❌ KHÔNG gắn token cho PUBLIC API
        if (!isPublicApi(url) && auth?.accessToken) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${auth.accessToken}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

/* ===================== RESPONSE INTERCEPTOR ===================== */

let refreshPromise = null

api.interceptors.response.use(
    (res) => {
        if (res?.config?._retryCount) delete res.config._retryCount
        return res
    },
    async (error) => {
        const { response, config } = error || {}
        const status = response?.status
        const originalRequest = config
        const auth = useAuthStore()

        if (!originalRequest) return Promise.reject(error)

        const url = originalRequest.url || ""
        const publicApi = isPublicApi(url)

        originalRequest._retryCount = originalRequest._retryCount || 0
        const alreadyRetried = originalRequest.__isRetryRequest === true

        // 🔍 DEBUG RESPONSE
        console.error("[API RESPONSE ERROR]", {
            url,
            status,
            isPublic: publicApi,
            retryCount: originalRequest._retryCount,
            alreadyRetried
        })

        /* ========= 500 – KHÔNG ĐỘNG GÌ ========= */
        if (status === 500) {
            console.warn("❌ 500 Server error – bỏ qua interceptor")
            return Promise.reject(error)
        }

        /* ========= PUBLIC API 401 – TUYỆT ĐỐI KHÔNG LOGOUT ========= */
        if (status === 401 && publicApi) {
            console.warn("⚠️ 401 từ PUBLIC API – IGNORE", url)
            return Promise.reject(error)
        }

        /* ========= REFRESH TOKEN – CHỈ KHI 401 PRIVATE ========= */
        if (
            status === 401 &&
            !publicApi &&
            !alreadyRetried &&
            auth?.accessToken &&
            originalRequest._retryCount < 1
        ) {
            try {
                originalRequest._retryCount++

                console.info("🔁 Attempt refresh token…")

                if (!refreshPromise) {
                    refreshPromise = auth.refetch()
                        .finally(() => refreshPromise = null)
                }

                await refreshPromise

                const newAuth = useAuthStore()

                originalRequest.__isRetryRequest = true
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAuth.accessToken}`,
                }

                console.info("✅ Retry original request after refresh:", url)

                return api.request(originalRequest)

            } catch (e) {
                console.error("❌ Refresh token FAILED", e)

                await auth.logout()
                const link = localStorage.getItem("loginFrom")
                router.push(link === "admin" ? "/-thg/dang-nhap" : "/dang-nhap")

                showError("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại")
                return Promise.reject(e)
            }
        }

        /* ========= 403 – KHÔNG LOGOUT ========= */
        if (status === 403) {
            showAlert(
                "Không có quyền",
                "Bạn không được phép thực hiện hành động này."
            )
            return Promise.reject(error)
        }

        /* ========= 401 PRIVATE nhưng không refresh được ========= */
        if (status === 401 && !publicApi) {
            console.error("🚪 401 PRIVATE – LOGOUT", url)

            await auth.logout()
            const link = localStorage.getItem("loginFrom")
            router.push(link === "admin" ? "/-thg/dang-nhap" : "/dang-nhap")

            showError("Phiên đăng nhập không hợp lệ", "Vui lòng đăng nhập lại")
        }

        return Promise.reject(error)
    }
)

export default api