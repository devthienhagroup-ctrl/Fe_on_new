import SockJS from "sockjs-client";

/**
 * A lightweight STOMP client that focuses on the subset of the protocol we need
 * for subscribing to server events. Now uses SockJS for Spring Boot compatibility.
 */
export class MinimalStompClient {
  constructor({
                url,
                tokenProvider,
                reconnectDelay = 5000,
                debug = false,
                onConnect,
                onDisconnect,
                onError,
              }) {
    this.url = url;
    this.tokenProvider = tokenProvider;
    this.reconnectDelay = reconnectDelay;
    this.debug = debug;
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.onError = onError;

    this.ws = null;
    this.connected = false;
    this.connecting = false;
    this.shouldReconnect = true;
    this.reconnectTimer = null;
    this.subscriptions = new Map();
    this.subscriptionSeq = 0;
    this.messageBuffer = "";
  }

  connect() {
    this.shouldReconnect = true;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this._log("⚠️ Socket already open or connecting");
      return;
    }
    this._openSocket();
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      if (this.connected) {
        this._sendFrame("DISCONNECT");
      }
      this.ws.close();
      this.ws = null;
    }

    this.connected = false;
    this.connecting = false;
    this._log("🔌 Disconnected manually");
  }

  subscribe(destination, callback) {
    if (!destination || typeof callback !== "function") {
      throw new Error("subscribe requires a destination and a callback");
    }

    const id = `sub-${++this.subscriptionSeq}`;
    const subscription = { id, destination, callback, active: false };

    this.subscriptions.set(id, subscription);
    this._trySendSubscribe(subscription);

    return () => {
      const current = this.subscriptions.get(id);
      if (!current) return;
      if (current.active && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this._sendFrame("UNSUBSCRIBE", { id });
      }
      this.subscriptions.delete(id);
    };
  }

  send(destination, body = "", headers = {}) {
    if (!destination) throw new Error("send requires a destination");
    const payload = typeof body === "string" ? body : JSON.stringify(body ?? "");
    this._sendFrame("SEND", { destination, ...headers }, payload);
  }

  /** ✅ Dùng SockJS thay vì WebSocket */
  _openSocket() {
    try {
      this.messageBuffer = "";
      this.connecting = true;
      this._log("🧩 Creating SockJS connection to", this.url);

      this.ws = new SockJS(this.url, null, { withCredentials: true });
      this.ws.onopen = () => this._handleOpen();
      this.ws.onmessage = (event) => this._handleMessage(event);
      this.ws.onerror = (event) => this._handleError(event);
      this.ws.onclose = (event) => this._handleClose(event);
    } catch (error) {
      this._log("❌ SockJS creation failed", error);
      this._scheduleReconnect();
    }
  }

  _handleOpen() {
    this._log("✅ SockJS connection open");
    this._sendConnectFrame();
  }

  _handleMessage(event) {
    const data = typeof event.data === "string" ? event.data : "";
    if (!data) return;

    this.messageBuffer += data;
    let frameEnd = this.messageBuffer.indexOf("\0");
    while (frameEnd !== -1) {
      const rawFrame = this.messageBuffer.slice(0, frameEnd);
      this.messageBuffer = this.messageBuffer.slice(frameEnd + 1);
      if (rawFrame.trim().length === 0) {
        frameEnd = this.messageBuffer.indexOf("\0");
        continue;
      }
      const frame = this._parseFrame(rawFrame);
      this._dispatchFrame(frame);
      frameEnd = this.messageBuffer.indexOf("\0");
    }
  }

  _handleError(event) {
    this._log("🚨 SockJS error", event);
    if (typeof this.onError === "function") this.onError(event);
  }

  _handleClose(event) {
    this._log("❌ SockJS closed", event);
    this.connected = false;
    this.connecting = false;
    if (typeof this.onDisconnect === "function") this.onDisconnect(event);
    this._scheduleReconnect();
  }

  _sendConnectFrame() {
    const headers = {
      "accept-version": "1.2",
      "heart-beat": "10000,10000",
    };

    const token = typeof this.tokenProvider === "function" ? this.tokenProvider() : null;
    if (token) headers.Authorization = `Bearer ${token}`;

    const hostHeader = this._resolveHostHeader();
    if (hostHeader) headers.host = hostHeader;

    this._sendFrame("CONNECT", headers);
  }

  _resolveHostHeader() {
    try {
      const url = new URL(this.url);
      return url.host;
    } catch {
      return undefined;
    }
  }

  _dispatchFrame(frame) {
    if (!frame) return;
    this._log("📦 Frame received", frame.command, frame.headers);

    switch (frame.command) {
      case "CONNECTED":
        this.connected = true;
        this.connecting = false;
        this.subscriptions.forEach((s) => {
          s.active = false;
          this._trySendSubscribe(s);
        });
        if (typeof this.onConnect === "function") this.onConnect(frame);
        break;

      case "MESSAGE":
        const subId = frame.headers.subscription;
        const sub = this.subscriptions.get(subId);
        if (sub && typeof sub.callback === "function") {
          try {
            sub.callback(frame);
          } catch (err) {
            this._log("❗ Error in subscription callback", err);
          }
        }
        break;

      case "ERROR":
        this._log("⚠️ STOMP error frame", frame);
        if (typeof this.onError === "function") this.onError(frame);
        break;

      default:
        this._log("🟡 Unhandled STOMP frame", frame.command);
    }
  }

  _trySendSubscribe(subscription) {
    if (!subscription || subscription.active) return;
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.connected) return;

    this._sendFrame("SUBSCRIBE", {
      id: subscription.id,
      destination: subscription.destination,
      ack: "auto",
    });
    subscription.active = true;
    this._log(`🔔 Subscribed to ${subscription.destination}`);
  }

  _scheduleReconnect() {
    if (!this.shouldReconnect || this.reconnectTimer) return;
    this._log("⏳ Reconnecting in", this.reconnectDelay, "ms");
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this._openSocket();
    }, this.reconnectDelay);
  }

  _sendFrame(command, headers = {}, body = "") {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this._log("⚠️ Cannot send frame, socket not open:", command);
      return;
    }

    let frame = `${command}\n`;
    for (const [key, value] of Object.entries(headers)) {
      if (value === undefined || value === null) continue;
      frame += `${key}:${value}\n`;
    }
    frame += "\n";
    if (body) frame += body;
    frame += "\0";

    this.ws.send(frame);
    this._log("➡️ Sent frame", command, headers);
  }

  _parseFrame(raw) {
    const lines = raw.split("\n");
    const command = lines[0]?.trim() || "";
    const headers = {};
    let i = 1;
    for (; i < lines.length; i++) {
      const line = lines[i];
      if (line === "") {
        i++;
        break;
      }
      const idx = line.indexOf(":");
      if (idx > -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        headers[key] = value;
      }
    }
    const body = lines.slice(i).join("\n");
    return { command, headers, body };
  }

  _log(...args) {
    if (this.debug) console.debug("[MinimalStompClient]", ...args);
  }
}
