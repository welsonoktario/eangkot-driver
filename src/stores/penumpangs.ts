import { PesananFB as Pesanan } from '@/types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

type PenumpangsState = {
  _penumpangs: Pesanan[]
}

export const usePenumpangs = defineStore('penumpangs', {
  state: () =>
    reactive<PenumpangsState>({
      _penumpangs: [],
    }),
  getters: {
    penumpangs: (state) => state._penumpangs,
  },
  actions: {
    setPenumpangs(penumpangs: Pesanan[]) {
      this._penumpangs = penumpangs
    },
    addPenumpang(penumpang: Pesanan) {
      this._penumpangs.push(penumpang)
    },
    removePenumpang(penumpang: Pesanan) {
      this._penumpangs = this._penumpangs.filter(
        (p: Pesanan) => p.docId !== penumpang.docId
      )
    },
  },
})
