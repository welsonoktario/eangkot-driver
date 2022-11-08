import { Transaksi } from './transaksi'
import { User } from './user'

export type PesananFB = {
  docId: string
  jemput: {
    lat: [number, number]
    long: [number, number]
  }
  tujuan: {
    lat: [number, number]
    long: [number, number]
  }
  status: string
  tanggal: string
  user?: User
  timer: number
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
