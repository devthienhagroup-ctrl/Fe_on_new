const API_BASE_URL = 'https://thienhagroup.vn/apithienha'
const PUBLIC_AVATAR_BASE = 'https://s3.cloudfly.vn/thg-storage-dev/uploads-public'

const normalizeFileId = (fileOrId) => {
  if (!fileOrId) return ''
  if (typeof fileOrId === 'string' || typeof fileOrId === 'number') {
    return String(fileOrId)
  }
  return fileOrId.id || fileOrId.fileId || fileOrId.file_id || ''
}

export const buildPrivateFileViewUrl = (fileOrId) => {
  const id = normalizeFileId(fileOrId)
  return id ? `${API_BASE_URL}/api/files/${encodeURIComponent(id)}` : ''
}

export const buildPrivateFileDownloadUrl = (fileOrId) => {
  const id = normalizeFileId(fileOrId)
  return id ? `${API_BASE_URL}/api/files/download/${encodeURIComponent(id)}` : ''
}

export const buildPublicAvatarUrl = (fileName) => {
  if (!fileName) return ''
  return `${PUBLIC_AVATAR_BASE}/${fileName}`
}

const extractFileName = (file) => {
  if (!file) return ''
  if (typeof file === 'string') return file
  return file.fileName || file.name || file.url || ''
}

export const isImageFile = (file) => {
  const fileName = extractFileName(file)
  if (!fileName) return false
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)
}
