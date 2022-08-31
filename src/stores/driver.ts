import { defineStore } from "pinia";
import { reactive } from "vue";

export const useDriver = defineStore("driver", {
  state: () =>
    reactive({
      driver: undefined,
    }),
  getters: {
    authDriver: (state) => state.driver,
  },
  actions: {},
});
