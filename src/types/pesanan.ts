import { User } from './user'

export type Pesanan = {
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
