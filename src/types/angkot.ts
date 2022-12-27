import { LngLatLike } from 'mapbox-gl'
import { Trayek } from './trayek'

export type Angkot = {
  id: number
  docId: string
  noKendaraan: string
  lokasi: LngLatLike
  trayek: Trayek
}
