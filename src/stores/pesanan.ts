import { PesananFB } from '@/types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

type PesananState = {
  _pesanans: PesananFB[]
}

export const usePesanan = defineStore('pesanan', {
  state: () =>
    reactive<PesananState>({
      _pesanans: [],
    }),
  getters: {
    pesanans: (state) => state._pesanans,
  },
  actions: {
    setPesanans(pesanans: PesananFB[]) {
      if (!this._pesanans.length) {
        pesanans.forEach((p1) => {
          if (!this._pesanans.some((p2: PesananFB) => p2.docId === p1.docId)) {
            this._pesanans.push(p1)
          }
        })
      } else {
        this._pesanans = pesanans
      }
    },
    updatePesanan(
      pesanan: PesananFB,
      status: 'pending' | 'diterima' | 'ditolak' | 'mengantar' | 'selesai'
    ) {
      const selectedPesanan =
        this._pesanans[
          this._pesanans.findIndex((p) => p.docId == pesanan.docId)
        ]
      selectedPesanan.status = status
    },
    removePesanan(index: number) {
      this._pesanans.splice(index, 1)
    },
  },
})
