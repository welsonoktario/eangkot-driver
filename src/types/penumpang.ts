import { LngLatLike } from 'mapbox-gl'
import { StatusPesanan } from './statusPesanan'
import { User } from './user'

export type Penumpang = {
  docId: string
  jemput: LngLatLike
  tujuan: LngLatLike
  status: StatusPesanan
  user: User
}
