import { Penumpang, PesananFB as Pesanan, StatusPesanan } from '@/types'
import { Marker } from 'mapbox-gl'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

type PenumpangsState = {
  _penumpangs: Pesanan[]
  _markersJemput: Marker[]
  _markersTujuan: Marker[]
}

const markerJemput = document.createElement('div')
markerJemput.className = 'marker-jemput'

const markersTujuan = document.createElement('div')
markersTujuan.className = 'marker-tujuan'

export const usePenumpangs = defineStore('penumpangs', {
  state: () =>
    reactive<PenumpangsState>({
      _penumpangs: [],
      _markersJemput: [],
      _markersTujuan: [],
    }),
  getters: {
    penumpangs: (state) => state._penumpangs,
    markersJemput: (state) => state._markersJemput,
    markersTujuan: (state) => state._markersTujuan,
  },
  actions: {
    setPenumpangs(penumpangs: Pesanan[]) {
      this._penumpangs = penumpangs
    },
    addPenumpang(penumpang: Pesanan) {
      this._penumpangs.push(penumpang)
    },
    updatePenumpang(penumpang: Pesanan, status: StatusPesanan) {
      const index = this._penumpangs.findIndex(
        (p: Pesanan) => p.docId === penumpang.docId
      )
      this._penumpangs[index].status = status
    },
    removePenumpang(penumpang: Pesanan) {
      this._penumpangs = this._penumpangs.filter(
        (p: Pesanan) => p.docId !== penumpang.docId
      )
    },
    updateMarkers() {
      this._markersJemput.forEach((marker: Marker) => marker.remove())
      this._markersTujuan.forEach((marker: Marker) => marker.remove())

      this._markersJemput = (this._penumpangs as Penumpang[])
        .filter((penumpang) => penumpang.status === StatusPesanan.ACCEPT)
        .map((penumpang) =>
          new Marker(markerJemput).setLngLat(penumpang.jemput)
        )
      this._markersTujuan = (this._penumpangs as Penumpang[])
        .filter((penumpang) => penumpang.status === StatusPesanan.PROCESS)
        .map((penumpang) =>
          new Marker(markersTujuan).setLngLat(penumpang.jemput)
        )
    },
  },
})
