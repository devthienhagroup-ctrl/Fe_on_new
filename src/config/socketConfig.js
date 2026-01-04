import SockJS from "sockjs-client";

export const SOCKET_CONFIG = {
  /**
   * SockJS endpoint cho Spring Boot backend
   */
  reconnectDelay: 5000,
  endpoint: "http://localhost:8084/apithienha/ws-thg",
  webSocketFactory: () => new SockJS("http://localhost:8084/apithienha/ws-thg"),

  // --- Mỗi project + mỗi employee đều có topic riêng ---
  projectTopic: (projectId, employeeId) => `/topic/projects/${projectId}/members/${employeeId}`,
  projectWorkItemsTopic: (projectId, employeeId) => `/topic/projects/${projectId}/work-items/${employeeId}`,
  projectCommentsTopic: (projectId, employeeId) => `/topic/projects/${projectId}/comments/${employeeId}`,
  projectMembersTopic: (projectId, employeeId) => `/topic/projects/${projectId}/members/${employeeId}`,
  projectTimelineTopic: (projectId, employeeId) => `/topic/projects/${projectId}/timeline/${employeeId}`,
  notificationTopic: (employeeId) => `/topic/notifications/${employeeId}`,
  valuationRequestTopic: (employeeId) => `/topic/valuation-requests/${employeeId}`,
  valuationResponseTopic: (employeeId) => `/topic/valuation-response/${employeeId}`,
  teamChatTopic: (teamId) => `/topic/my-team/${teamId}/chat`,
  checkoutTopic: (employeeId) => `/topic/checkout/${employeeId}`,
  teamEventTopic: (teamId) => `/topic/my-team/${teamId}/events`,

  invCheckoutTopic: (employeeId) => `/topic/checkout-inv/${employeeId}`,

  // --- Hàng đợi riêng user (convertAndSendToUser) ---
  userQueue: (userId) => `/queue/users/${userId}`,
};
