import { LngLatLike } from 'mapbox-gl'
import { Trayek } from './trayek'

export type Angkot = {
  id: number
  noKendaraan: string
  lokasi: LngLatLike
  trayek: Trayek
}
