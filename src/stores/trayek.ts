import { reactive } from "vue";
import { defineStore } from "pinia";
import { Trayek } from "@/types";
import { get } from "@/lib/http";

export const useTrayek = defineStore("trayek", {
  state: () =>
    reactive({
      _trayeks: [] as Trayek[],
    }),
  getters: {
    trayeks: (state) => state._trayeks,
  },
  actions: {
    async loadTrayeks() {
      const res = await get("trayek");
      const data = await res.data;

      if (data.status === "OK") {
        this._trayeks = data.data;
      }
    },
  },
});
