import { Pesanan } from '@/types'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

type PesananState = {
  _pesanans: Pesanan[]
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
    setPesanans(pesanans: Pesanan[]) {
      this._pesanans = pesanans
    },
    updatePesanan(
      pesanan: Pesanan,
      status: 'pending' | 'diterima' | 'ditolak' | 'mengantar' | 'selesai'
    ) {
      const selectedPesanan =
        this._pesanans[
          this._pesanans.findIndex((p) => p.docId == pesanan.docId)
        ]
      selectedPesanan.status = status
    },
  },
})
