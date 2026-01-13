// src/stores/authStore.js
import { defineStore } from 'pinia'
import * as authService from '../assets/js/global.js'
import router from "../router/index.js"
import { socketService } from "../services/socketService.js"
import { showLoading, updateAlertSuccess } from "../assets/js/alertService.js";
import api from "../api/api.js";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null,
        userEmail: null,
        userInfo: null,
        listPermission: null,
        listAuthority: null,
        listPermissionProjects: [],
        listPermissionTeams: []
    }),

    actions: {
        setToken(token) { this.accessToken = token },
        setuserEmail(email) { this.userEmail = email },
        setUserInfo(userInfo) { this.userInfo = userInfo },

        setListPermission(listPermission) {
            this.listPermission = listPermission
        },

        setListAuthority(listAuthority) {
            this.listAuthority = listAuthority
        },

        setListPermissionProjects(listPermissionProjects) {
            this.listPermissionProjects = listPermissionProjects
        },

        setListPermissionTeams(listPermissionTeams) {
            this.listPermissionTeams = listPermissionTeams
        },

        clearToken() {
            this.accessToken = null
            this.userEmail = null
            this.userInfo = null
            this.listPermission = null
            this.listAuthority = null
            this.listPermissionProjects = []
            this.listPermissionTeams = []
        },

        async login({ email, password, rememberMe }) {
            const {
                accessToken,
                userInfo,
                listAuthority,
                listPermission,
                listPermissionProjects,
                listPermissionTeams
            } = await authService.login({ email, password, rememberMe })

            this.setToken(accessToken)
            this.setuserEmail(email)
            this.setUserInfo(userInfo)

            this.setListAuthority(listAuthority)
            this.setListPermission(listPermission)
            this.setListPermissionProjects(listPermissionProjects)
            this.setListPermissionTeams(listPermissionTeams)

            return accessToken
        },

        async refetch() {
            const newToken = await authService.refresh()
            this.setToken(newToken)
            return newToken
        },

        async refetchRenew() {
            const { accessToken, listAuthority } = await authService.refreshRenew()

            this.setToken(accessToken)

            // Nếu API trả về quyền mới → cập nhật
            if (listAuthority?.length) {
                this.setListAuthority(listAuthority)
            }

            return accessToken
        },

        async logout() {
            try {
                await showLoading(() => authService.logout());
            } finally {
                this.clearToken()
                socketService.disconnect()

                const isAuthPage = router.currentRoute.value.meta?.requiresAuth

                if (isAuthPage) {
                    const link = localStorage.getItem("loginFrom");
                    await router.push(link === "admin" ? "/-thg/dang-nhap" : "/")
                }

                updateAlertSuccess("Đăng xuất thành công")
            }
        },

        // ==============================
// ⭐ 1) LẤY QUYỀN TRONG PROJECT
// ==============================
        // ==============================
// ⭐ 1) LẤY QUYỀN TRONG PROJECT
// ==============================
        async fetchProjectPermissions(projectId) {
            try {
                const res = await api.get("/project-permissions", {
                    params: { projectId }
                });

                // 🟢 Ép về LIST (array)
                const projectList = Array.isArray(res.data.permissions)
                    ? res.data.permissions
                    : [];

                this.setListPermissionProjects(projectList);

                return projectList;

            } catch (e) {
                console.error("❌ Lỗi load quyền project:", e);
                this.setListPermissionProjects([]);
                return [];
            }
        },

// ==============================
// ⭐ 2) LẤY QUYỀN TRONG TEAM
// ==============================
        async fetchTeamPermissions(teamId) {
            try {
                const res = await api.get("/team-permissions", {
                    withCredentials: true,
                    params: { teamId }
                });

                // 🟢 Ép về LIST (array)
                const teamList = Array.isArray(res.data.permissions)
                    ? res.data.permissions
                    : [];

                this.setListPermissionTeams(teamList);

                return teamList;

            } catch (e) {
                console.error("❌ Lỗi load quyền team:", e);
                this.setListPermissionTeams([]);
                return [];
            }
        },
        hasTeamPermission(permissionKey) {
            return Array.isArray(this.listPermissionTeams) &&
                this.listPermissionTeams.includes(permissionKey);
        },
        hasProjectPermission(permissionKey) {
            return Array.isArray(this.listPermissionProjects) &&
                this.listPermissionProjects.includes(permissionKey);
        },
        hasPermission(permissionKey) {
            return Array.isArray(this.listAuthority) &&
                this.listAuthority.includes(permissionKey);
        }





    },

    persist: {
        enabled: true,
        strategies: [{ key: 'auth', storage: localStorage }],
    },
})



