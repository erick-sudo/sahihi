import { defineStore } from "pinia";
import { BriefUser, User } from "../lib/definitions";
import useAPI from "../composables/useAPI";
import { axiosGet } from "../lib/axiosLib";
import { APIS } from "../lib/apis";

const handleRequest = useAPI();

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [] as BriefUser[],
    allUsers: [] as User[],
  }),
  getters: {
    getUsers(state) {
      return state.users;
    },
    getAllUsers(state) {
      return state.allUsers;
    },
  },
  actions: {
    async fetchUsers() {
      const response = await handleRequest<BriefUser[]>({
        func: axiosGet,
        args: [APIS.user.indexBrief],
      });
      if (response.status === "ok" && response.result) {
        this.users = response.result;
      }
    },

    async fetchAllUsers() {
      const response = await handleRequest<User[]>({
        func: axiosGet,
        args: [APIS.user.index],
      });
      if (response.status === "ok" && response.result) {
        this.allUsers = response.result;
      }
    },
  },
});
