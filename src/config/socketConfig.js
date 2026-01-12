import SockJS from "sockjs-client";

export const SOCKET_CONFIG = {
  /**
   * SockJS endpoint cho Spring Boot backend
   */
  reconnectDelay: 5000,
  endpoint: "https://thienhagroup.vn/apithienha/ws-thg",
  webSocketFactory: () => new SockJS("https://thienhagroup.vn/apithienha/ws-thg"),

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
  invitationTopic: (employeeId) => `/topic/invitations/${employeeId}`,
  withdrawUserTopic(employeeId) {return `/topic/withdraw/user/${employeeId}`},
  /* =========================
     RÚT TIỀN – ADMIN
  ========================= */
  withdrawAdminTopic(adminId) {return `/topic/withdraw/admin/${adminId}`},


  invCheckoutTopic: (employeeId) => `/topic/checkout-inv/${employeeId}`,

  // --- Hàng đợi riêng user (convertAndSendToUser) ---
  userQueue: (userId) => `/queue/users/${userId}`,
};
