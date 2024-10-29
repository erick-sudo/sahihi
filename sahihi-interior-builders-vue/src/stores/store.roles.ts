import { defineStore } from "pinia";
import { GrantedAuthority } from "../lib/definitions";
import useAPI from "../composables/useAPI";
import { axiosGet } from "../lib/axiosLib";
import { APIS } from "../lib/apis";

const handleRequest = useAPI();

export const useRoleStore = defineStore("roles", {
  state: () => ({
    roles: [] as GrantedAuthority[],
  }),
  getters: {
    getRoles(state) {
      return state.roles;
    },
  },
  actions: {
    async fetchRoles() {
      const response = await handleRequest<GrantedAuthority[]>({
        func: axiosGet,
        args: [APIS.authorization.roles.index],
      });
      if (response.status === "ok" && response.result) {
        this.roles = response.result;
      }
    },
  },
});
