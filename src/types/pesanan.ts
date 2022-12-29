import { Timestamp } from '@firebase/firestore'
import { LngLatLike } from 'mapbox-gl'
import { StatusPesanan } from './statusPesanan'
import { Transaksi } from './transaksi'
import { User } from './user'

export type PesananFB = {
  docId: string
  jemput: LngLatLike
  tujuan: LngLatLike
  status: StatusPesanan
  tanggal: string
  user?: User
  timestamp: Timestamp
}

export type Pesanan = {
  id: number
  jemput: {
    lat: number[]
    long: number[]
  }
  tujuan: {
    lat: number[]
    long: number[]
  }
  penumpang: number
  status: string
  tanggal: string
  user?: User
  driver?: any
  transaksi?: Transaksi
}
