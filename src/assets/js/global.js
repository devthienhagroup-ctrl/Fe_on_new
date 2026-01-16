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

export function shortenName(fullName, maxLength = 10) {
    if (!fullName) return ''

    const name = fullName.trim().replace(/\s+/g, ' ')
    if (name.length <= maxLength) return name

    const parts = name.split(' ')
    if (parts.length === 1) return name.slice(0, maxLength)

    const lastName = parts[parts.length - 1]
    const initials = parts
        .slice(0, -1)
        .map(word => word.charAt(0).toUpperCase())
        .join('')

    const shortName = `${initials}.${lastName}`

    // nếu vẫn dài hơn max → cắt tên cuối
    if (shortName.length > maxLength) {
        const allowedLastNameLength =
            maxLength - initials.length - 1 // trừ dấu '.'

        if (allowedLastNameLength <= 0) {
            return initials.slice(0, maxLength)
        }

        return `${initials}.${lastName.slice(0, allowedLastNameLength)}`
    }

    return shortName
}

export function generateAvatarFromName(name, size = 64) {
    if (!name) return ''

    const cleanName = name.trim()
    const parts = cleanName.split(/\s+/)

    // Lấy chữ cái đầu + chữ cái cuối
    let initials = ''
    if (parts.length === 1) {
        initials = parts[0].charAt(0)
    } else {
        initials =
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
    }

    initials = initials.toUpperCase()

    // ===== Hash tên để tạo màu ổn định =====
    const hash = Array.from(cleanName).reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0
    )

    const hue1 = hash % 360
    const hue2 = (hue1 + 40) % 360

    const color1 = `hsl(${hue1}, 75%, 55%)`
    const color2 = `hsl(${hue2}, 75%, 45%)`

    // ===== SVG Avatar =====
    const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="100%" stop-color="${color2}" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" rx="${size / 2}" fill="url(#grad)" />
    <text
      x="50%"
      y="52%"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="${size * 0.42}"
      font-family="Inter, Arial, sans-serif"
      fill="white"
      font-weight="600"
    >
      ${initials}
    </text>
  </svg>
  `

    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}
