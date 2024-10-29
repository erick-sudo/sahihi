import { defineStore } from "pinia";
import { AuthenticationContext } from "../lib/definitions";

export const useAuthStore = defineStore("auth", {
  state: (): { auth: AuthenticationContext | null } => ({
    /** {{ User | null }} */
    auth: null,
  }),
  getters: {
    currentAuth(state) {
      return state.auth;
    },
    isAdmin(state) {
      return !!state.auth?.authorities.some((a) => a.name === "ROLE_ADMIN");
    },
    isProjectManager(state) {
      return !!state.auth?.authorities.some(
        (a) => a.name === "ROLE_PROJECT_MANAGER"
      );
    },
    isEngineer(state) {
      return !!state.auth?.authorities.some((a) => a.name === "ROLE_ENGINEER");
    },
  },
  actions: {
    clearAuth() {
      this.auth = null;
    },

    updateAuth(newAuth: AuthenticationContext) {
      this.auth = newAuth;
    },
  },
});
