import { defineStore } from "pinia";
import { Customer } from "../lib/definitions";
import useAPI from "../composables/useAPI";
import { axiosGet, axiosPost } from "../lib/axiosLib";
import { APIS } from "../lib/apis";

const handleRequest = useAPI();

export const useCustomerStore = defineStore("customers", {
  state: () => ({
    customers: [] as Customer[],
  }),
  getters: {
    getCustomers(state) {
      return state.customers;
    },
  },
  actions: {
    async fetchCustomers() {
      const response = await handleRequest<Customer[]>({
        func: axiosGet,
        args: [APIS.customers.index],
      });
      if (response.status === "ok" && response.result) {
        this.customers = response.result;
      }
    },

    async search(v: string) {
      const response = await handleRequest<Customer[]>({
        func: axiosPost,
        args: [
          APIS.customers.search,
          {
            q: v,
            fields: ["name", "email", "phone", "company"],
          },
        ],
      });
      if (response.status === "ok" && response.result) {
        this.customers = response.result;
      }
    },
  },
});
