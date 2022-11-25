import { Ulasan } from './ulasan'
import { User } from './user'

export type Transaksi = {
  id: number
  user?: User
  ongkos: number
  durasiPerjalanan: number
  jarakPerjalanan: number
  lokasiJemput: string
  lokasiTujuan: string
  tanggal: string
  ulasan?: Ulasan
}
