// src/assets/js/authService.js
import api from '../../api/api'

// Đăng nhập -> trả về accessToken
export const login = async ({ email, password, rememberMe }) => {
    const res = await api.post('/thg/api/auth/login', { email, password, rememberMe })
    localStorage.setItem('remember', String(rememberMe))
    const accessToken = res.data?.accessToken
    const userInfo = res.data?.userInfo
    const listPermission = res.data?.listPermission

    if (!accessToken) throw new Error('No accessToken returned')

    return { accessToken, userInfo, listPermission } // 👈 trả cả 2
}


// Refresh -> trả về accessToken mới
export const refresh = async () => {
    const remember = localStorage.getItem('remember') === 'true'

    const res = await api.post(
        `/thg/api/auth/refresh?remember=${remember}`,
        {},
        { withCredentials: true }
    )

    const token = res.data?.accessToken
    console.log('Refetch thành công ✅✅✅✅✅')

    if (!token) throw new Error('No accessToken returned')
    return token
}


// Refresh + Renew quyền -> trả về accessToken + listAuthority
export const refreshRenew = async () => {
    const remember = localStorage.getItem('remember') === 'true'

    const res = await api.post(
        `/thg/api/auth/refresh-renew?remember=${remember}`,
        {},
        { withCredentials: true }
    )

    console.log('Refetch Renew thành công ✅')

    const accessToken = res.data?.accessToken
    const listAuthorityRaw = res.data?.listAuthority

    if (!accessToken) {
        throw new Error('No accessToken returned')
    }

    // ⭐ Chuẩn hóa authority cho FE
    const listAuthority = Array.isArray(listAuthorityRaw)
        ? listAuthorityRaw.map(a => (typeof a === 'string' ? a : a.authority))
        : []

    return {
        accessToken,
        listAuthority
    }
}

export function buildSeoUrl(p) {
    const loaiTaiSan = slugify(p.loaiMH || 'Khong-xac-dinh') // hoặc map từ p.loaiTaiSan
    const viTri = slugify(p.viTri || 'khong-xac-dinh')
    const phuong = slugify(p.diaChi?.split('/!!')[1] || '')
    const tinh = slugify(p.khuVuc || '')
    const dienTich = Math.floor(p.dtcn || 0)

    return `/san-pham-thien-ha/${loaiTaiSan}-${viTri}-${phuong}-${tinh}-${dienTich}m2-${p.id}`
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

    localStorage.removeItem('remember');
}
export const baseImgaeUrl="https://s3.cloudfly.vn/thg-storage/uploads-public/";

export function slugify(str = '') {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
}

// export function buildSeoUrl(p) {
//     const loaiTaiSan = slugify(p.loaiMH || 'Khong-xac-dinh') // hoặc map từ p.loaiTaiSan
//     const viTri = slugify(p.viTri || 'khong-xac-dinh')
//     const phuong = slugify(p.diaChi?.split('/!!')[1] || '')
//     const tinh = slugify(p.khuVuc || '')
//     const dienTich = Math.floor(p.dtcn || 0)
//
//     return `/san-pham-thien-ha/${loaiTaiSan}-${viTri}-${phuong}-${tinh}-${dienTich}m2-${p.id}`
// }





// export function slugify(str = '') {
//     return str
//         .toLowerCase()
//         .normalize('NFD')
//         .replace(/[\u0300-\u036f]/g, '')
//         .replace(/đ/g, 'd')
//         .replace(/[^a-z0-9\s-]/g, '')
//         .trim()
//         .replace(/\s+/g, '-')
// }