// src/assets/js/authService.js
import api from '../../api/api'

// Đăng nhập -> trả về accessToken
export const login = async ({ email, password, rememberMe }) => {
    const res = await api.post('/thg/api/auth/login', { email, password, rememberMe })

    const accessToken = res.data?.accessToken
    const userInfo = res.data?.userInfo
    const listPermission = res.data?.listPermission

    if (!accessToken) throw new Error('No accessToken returned')

    return { accessToken, userInfo, listPermission } // 👈 trả cả 2
}


// Refresh -> trả về accessToken mới
export const refresh = async () => {
    const res = await api.post('/thg/api/auth/refresh', {}, { withCredentials: true })
    const token = res.data?.accessToken
    console.log("Refetch thành công ✅✅✅✅✅")
    if (!token) throw new Error('No accessToken returned')
    return token
}

export const refreshRenew = async () => {
    const res = await api.post(
        '/thg/api/auth/refresh-renew',
        {},
        { withCredentials: true }
    )

    console.log("Refetch thành công ✅")

    const accessToken = res.data?.accessToken
    const listAuthorityRaw = res.data?.listAuthority

    if (!accessToken) {
        throw new Error("No accessToken returned")
    }

    // ⭐ CHUYỂN 'listAuthority' về dạng mảng string để FE dùng được
    const listAuthority = Array.isArray(listAuthorityRaw)
        ? listAuthorityRaw.map(a => (typeof a === "string" ? a : a.authority))
        : []

    return {
        accessToken,
        listAuthority
    }
}


// Logout (gửi kèm bearer hiện tại và cookie refresh)
export const logout = async (accessToken) => {
    await api.post(
        '/thg/api/auth/logout',
        {},
        {
            withCredentials: true,
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        }
    )
}




