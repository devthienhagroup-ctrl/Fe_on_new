import { useAuthStore } from './stores/authStore';

const MEASUREMENT_ID = 'G-3K18DLHJY0';
let initialized = false;

function hasGtag() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

function getUserId() {
  try {
    const authStore = useAuthStore();
    return authStore?.userInfo?.id || null;
  } catch (error) {
    console.warn('GA4: Unable to resolve user id', error);
    return null;
  }
}

export function init() {
  if (initialized) return;
  if (!hasGtag()) {
    console.warn('GA4: gtag is not ready');
    return;
  }

  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
  });
  attachUserId();
  initialized = true;
}

export function attachUserId() {
  if (!hasGtag()) return;
  const userId = getUserId();

  window.gtag('set', {
    user_id: userId || null,
  });
}

export function pageView(path, title) {
  if (!hasGtag()) return;
  const userId = getUserId();

  window.gtag('event', 'page_view', {
    page_path: path || window.location.pathname,
    page_location: window.location.href,
    page_title: title || document.title,
    user_id: userId || undefined,
  });
}

export function event(eventName, params = {}) {
  if (!hasGtag() || !eventName) return;
  const userId = getUserId();
  const payload = { ...params };

  if (userId) {
    payload.user_id = userId;
  }

  window.gtag('event', eventName, payload);
}

export function setupRouterTracking(router) {
  if (!router) return;

  router.afterEach((to) => {
    pageView(to.fullPath, to.name || document.title);
  });
}

export default {
  init,
  attachUserId,
  pageView,
  event,
  setupRouterTracking,
};
