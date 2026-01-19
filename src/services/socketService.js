import { reactive } from "vue";
import { SOCKET_CONFIG } from "../config/socketConfig.js";
import { cloneSocketEvent } from "../utils/socketEventUtils.js";
import { MinimalStompClient } from "./MinimalStompClient.js"; // nhớ import bản mới
import SockJS from "sockjs-client"; // dùng cho SockJS endpoint

function parseFrame(frame) {
  if (!frame) return null;
  const meta = {
    headers: frame.headers || {},
    command: frame.command,
    destination: frame.headers?.destination,
    subscription: frame.headers?.subscription,
    rawBody: frame.body,
  };

  let data = frame.body ?? null;
  if (typeof data === "string") {
    const trimmed = data.trim();
    if (trimmed.length === 0) {
      data = null;
    } else {
      try {
        data = JSON.parse(trimmed);
      } catch {
        data = trimmed;
      }
    }
  }

  if (data && typeof data === "object") {
    const enriched = cloneSocketEvent(data);
    Object.defineProperty(enriched, "_meta", { value: meta, enumerable: false });
    return enriched;
  }

  const fallback = { payload: data };
  Object.defineProperty(fallback, "_meta", { value: meta, enumerable: false });
  return fallback;
}

class SocketService {
  constructor() {
    this.client = null;
    this.state = reactive({
      isConnected: false,
      lastError: null,
    });
    this.tokenProvider = null;
  }

  ensureClient() {
    if (!this.client) {
      this.client = new MinimalStompClient({
        url: SOCKET_CONFIG.endpoint, // ví dụ: https://thienhagroup.vn/apithienha/ws-thg
        tokenProvider: () =>
            typeof this.tokenProvider === "function" ? this.tokenProvider() : null,
        reconnectDelay: 5000,
        debug: true, // ✅ bật debug để thấy log chi tiết
        onConnect: () => {
          this.state.isConnected = true;
          this.state.lastError = null;
          console.log("🟢 Socket connected");
        },
        onDisconnect: () => {
          this.state.isConnected = false;
          console.warn("🔴 Socket disconnected");
        },
        onError: (err) => {
          this.state.lastError = err;
          console.error("[socketService] STOMP error", err);
        },
      });
    }
    return this.client;
  }

  connect(tokenProvider) {
    if (tokenProvider) {
      this.tokenProvider = tokenProvider;
    }
    const client = this.ensureClient();
    console.log("🚀 Connecting to socket via SockJS...");
    client.connect();
  }

  disconnect() {
    if (this.client) {
      console.log("🧹 Disconnecting socket...");
      this.client.disconnect();
    }
  }

  subscribe(destination, callback) {
    if (!destination || typeof callback !== "function") {
      console.warn("[socketService] subscribe requires a destination and callback");
      return () => {};
    }

    const client = this.ensureClient();
    const unsubscribe = client.subscribe(destination, (frame) => {
      const payload = parseFrame(frame);
      console.log("📩 Received frame from:", destination, "\n➡️ Raw frame:", frame, "\n➡️ Parsed payload:", payload);
      try {
        callback(payload, frame);
      } catch (error) {
        console.error("[socketService] Error in subscription callback", error);
      }
    });

    console.log("🔔 Subscribed to:", destination);
    return () => {
      try {
        unsubscribe();
        console.log("🚫 Unsubscribed from:", destination);
      } catch (error) {
        console.warn("[socketService] Failed to unsubscribe", error);
      }
    };
  }

  send(destination, body, headers = {}) {
    const client = this.ensureClient();
    let payload = body;
    const sendHeaders = { ...headers };
    if (body && typeof body === "object") {
      payload = JSON.stringify(body);
      if (!sendHeaders["content-type"]) {
        sendHeaders["content-type"] = "application/json";
      }
    }
    console.log("📤 Sending socket message to:", destination, payload);
    client.send(destination, payload, sendHeaders);
  }
}

export const socketService = new SocketService();
