import { defineStore } from "pinia";
import { reactive } from "vue";
import { Transaksi, Ulasan } from "@/types";
import { get, patch } from "@/lib/http";

export const useRiwayat = defineStore("riwayat", {
  state: () =>
    reactive({
      _transaksis: [] as Transaksi[],
    }),
  getters: {
    transaksis: (state) => state._transaksis,
  },
  actions: {
    setTransaksis(transaksis: Transaksi[]) {
      this._transaksis = transaksis;
    },
    updateTransaksi(transaksi: Transaksi) {
      this._transaksis.find((t: Transaksi) => t.id == transaksi.id).ulasan =
        transaksi.ulasan;
    },
    findTransaksi(id: number) {
      return this._transaksis.find((t: Transaksi) => t.id === id) as Transaksi;
    },
    async loadRiwayat(id: number) {
      return await get(`transaksi?user_id=${id}`);
    },
    async addUlasan(id: number, ulasan: Ulasan) {
      return await patch(`transaksi/${id}`, ulasan);
    },
  },
});
