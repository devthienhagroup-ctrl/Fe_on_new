import api from './api.js'

const privateFileCache = new Map()
const pendingRequests = new Map()
const SIGNED_URL_TTL_MS = 4 * 60 * 1000 // 4 phút để an toàn trước khi link hết hạn

const toFileId = (fileOrId) => {
  if (!fileOrId) return ''
  if (typeof fileOrId === 'string' || typeof fileOrId === 'number') return String(fileOrId)
  return fileOrId.id || fileOrId.fileId || fileOrId.file_id || ''
}

const normalizeSignedPayload = (payload) => {
  if (!payload) return null

  if (typeof payload === 'string') return { url: payload, fileName: null }

  if (typeof payload === 'object') {
    const url =
      payload.url ||
      payload.signedUrl ||
      payload.signedURL ||
      payload.link ||
      payload.location ||
      ''

    if (!url) return null

    return { url, fileName: payload.fileName || payload.filename || payload.name || null }
  }

  return null
}

const getCachedUrl = (id) => {
  const cached = privateFileCache.get(id)
  if (!cached) return null

  if (cached.expiresAt < Date.now()) {
    privateFileCache.delete(id)
    return null
  }

  return cached
}

const saveToCache = (id, payload) => {
  privateFileCache.set(id, {
    ...payload,
    expiresAt: Date.now() + SIGNED_URL_TTL_MS,
  })
}

const fetchSignedUrl = async (path, params = {}) => {
  const response = await api.get(path, {
    params,
    withCredentials: true,
  })

  return normalizeSignedPayload(response?.data)
}

export const loadPrivateFileDataUrl = async (fileOrId) => {
  const id = toFileId(fileOrId)
  if (!id) return null

  const cached = getCachedUrl(id)
  if (cached) return cached.url

  if (pendingRequests.has(id)) return pendingRequests.get(id)

  const requestPromise = fetchSignedUrl(`/api/files/${encodeURIComponent(id)}`)
    .then((payload) => {
      if (payload) saveToCache(id, payload)
      return payload?.url || null
    })
    .catch(() => null)
    .finally(() => pendingRequests.delete(id))

  pendingRequests.set(id, requestPromise)
  return requestPromise
}

export const fetchPrivateDownloadUrl = async (fileOrId) => {
  const id = toFileId(fileOrId)
  if (!id) return null

  const payload = await fetchSignedUrl(`/api/files/download/${encodeURIComponent(id)}`)
  return payload?.url || null
}

export const fetchBulkDownloadUrl = async (entityId, flag) => {
  if (!entityId || !flag) return null
  const payload = await fetchSignedUrl(`/api/files/download-all/${entityId}`, { flag })
  return payload?.url || null
}

export const clearPrivateFileCache = () => {
  privateFileCache.clear()
  pendingRequests.clear()
}

export const getCachedFileDataUrl = (fileOrId) => {
  const id = toFileId(fileOrId)
  if (!id) return null

  const cached = getCachedUrl(id)
  return cached?.url || null
}

export const resolveFileId = (fileOrId) => toFileId(fileOrId)
