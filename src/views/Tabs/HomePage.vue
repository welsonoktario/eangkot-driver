<template>
  <app-layout>
    <template #content>
      <div class="top-bar">
        <e-a-button
          class="ion-margin-end"
          @click="setOnline()"
          :color="isActive ? 'primary' : 'danger'"
        >
          <ion-icon :icon="power" />
        </e-a-button>
        <div class="fill">
          <h1 class="ion-no-margin">{{ isActive ? 'Online' : 'Offline' }}</h1>
        </div>
        <e-a-button class="btn-pesanan" @click="openModalPesanan()">
          <ion-icon :icon="receipt" />
          <ion-badge v-if="penumpangCount" color="danger" slot="end">{{
            penumpangCount
          }}</ion-badge>
        </e-a-button>
      </div>

      <ion-grid>
        <ion-row id="map-wrapper">
          <ion-col>
            <div
              id="map"
              :style="[
                isLoaded ? { visibility: 'visible' } : { visibility: 'hidden' },
              ]"
            ></div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </template>
  </app-layout>
</template>

<script setup lang="ts">
import EAButton from '@/components/EAButton.vue'
import ModalPesanan from '@/components/Home/ModalPesanan.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { patch } from '@/lib'
import { useAuth, usePenumpangs, usePesanan } from '@/stores'
import { PesananFB as Pesanan, StatusPesanan } from '@/types'
import { showToast } from '@/utils'
import { Geolocation } from '@capacitor/geolocation'
import {
  IonBadge,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
  loadingController,
  modalController,
} from '@ionic/vue'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  GeoPoint,
  getDocs,
  onSnapshot,
  query,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore'
import { power, receipt } from 'ionicons/icons'
import { GeolocateControl, Map, Marker } from 'mapbox-gl'
import { computed, inject, onMounted, ref } from 'vue'

const { authDriver, authUser, authAngkot, setAngkotDocId, authDocId } =
  useAuth()
const pesanan = usePesanan()
const penumpangs = usePenumpangs()
const db: Firestore = inject('db')

let map: Map
const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
const isLoaded = ref(false)
const isDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const isActive = ref(false)
const driverSnap = ref<Unsubscribe>()
const pesanansSnap = ref<Unsubscribe>()
const penumpangsSnap = ref<Unsubscribe>()
const markerLokasi = ref<Marker>()

onMounted(async () => {
  loadDocument()
  map = new Map({
    container: 'map',
    style: isDark
      ? 'mapbox://styles/mapbox/navigation-night-v1'
      : 'mapbox://styles/mapbox/navigation-day-v1', // style URL
    center: [112.7518702, -7.2621774], // starting position [lng, lat]
    zoom: 13, // starting zoom
    accessToken,
  })

  map.on('load', async () => {
    isLoaded.value = true
    map.resize()

    map.addSource('trayek', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })
    map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })
    map.addLayer({
      id: 'trayek',
      type: 'line',
      source: 'trayek',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#36817b',
        'line-width': 2,
      },
    })
    map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#000',
        'line-width': 2,
      },
    })
  })

  map.addControl(new GeolocateControl(), 'bottom-right')

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      event.matches
        ? map.setStyle('mapbox://styles/mapbox/dark-v10')
        : map.setStyle('mapbox://styles/mapbox/light-v10')
    })
})

const penumpangCount = computed(() =>
  pesanan.pesanans ? pesanan.pesanans.length : null
)

const loadDocument = async () => {
  const geo = await Geolocation.getCurrentPosition()
  const lokasi = geo.coords

  const q = query(
    collection(db, `angkots-${authAngkot.trayek.kode}`),
    where('id', '==', authAngkot.id)
  )

  try {
    const querySnapshot = await getDocs(q)

    if (querySnapshot.docs.length == 1) {
      const data = querySnapshot.docs[0].data()
      isActive.value = true

      if (!markerLokasi.value) {
        markerLokasi.value = new Marker()
          .setLngLat([lokasi.longitude, lokasi.latitude])
          .addTo(map)
        map.flyTo({
          animate: true,
          center: markerLokasi.value.getLngLat(),
        })
      } else {
        markerLokasi.value.setLngLat([
          data.lokasi.longitude,
          data.lokasi.latitude,
        ])
      }

      await updateDocId(querySnapshot.docs[0].id)
      await watchPesanan()
      await watchPenumpang()
    } else {
      if (markerLokasi.value) {
        markerLokasi.value.remove()
      }
    }
  } catch (e: any) {
    await showToast('Terjadi kesalahan memuat data angkot', 'danger')
  }
}

const setOnline = async () => {
  let watch: any
  const loading = await loadingController.create({
    animated: true,
    message: 'Loading...',
    backdropDismiss: false,
  })

  await loading.present()

  if (!isActive.value) {
    const geo = await Geolocation.getCurrentPosition()
    const lokasi = geo.coords

    try {
      const colRef = collection(db, `angkots-${authAngkot.trayek.kode}`)
      const adr = await addDoc(colRef, {
        id: authAngkot.id,
        driver: {
          id: authDriver,
          nama: authUser.nama,
          noHp: authUser.noHp,
        },
        noKendaraan: authAngkot.noKendaraan,
        lokasi: new GeoPoint(lokasi.latitude, lokasi.longitude),
      })

      setAngkotDocId(adr.id)
      isActive.value = true
      const docRef = doc(db, `angkots-${authAngkot.trayek.kode}`, adr.id)

      markerLokasi.value = new Marker()
        .setLngLat([lokasi.longitude, lokasi.latitude])
        .addTo(map)
      map.flyTo({
        animate: true,
        center: markerLokasi.value.getLngLat(),
      })

      watch = await Geolocation.watchPosition(
        { enableHighAccuracy: true, timeout: 1000 },
        (pos) => {
          if (pos) {
            const lokasi = pos.coords
            updateDoc(docRef, {
              lokasi: new GeoPoint(lokasi.latitude, lokasi.longitude),
            })
          }
        }
      )
    } catch (e: any) {
      await showToast('Terjadi kesalahan mengaktifkan angkot', 'danger')
    }
  } else {
    markerLokasi.value.remove()

    try {
      const colRef = collection(
        db,
        `angkots-${authAngkot.trayek.kode}/${authDocId}/penumpangs`
      )
      const q = query(colRef, where('status', '==', 'pending'))
      const snapshots = await getDocs(q)

      if (!snapshots.empty) {
        alert('Tidak dapat menonaktifkan angkot. Masih terdapat ada penumpang')
      } else {
        await deleteDoc(doc(db, `angkots-${authAngkot.trayek.kode}`, authDocId))

        watch && (await Geolocation.clearWatch({ id: watch }))
        isActive.value = false
      }
    } catch (e: any) {
      await showToast('Terjadi kesalahan menonaktifkan angkot', 'danger')
    }
  }

  loading.dismiss()
}

const openModalPesanan = async () => {
  const modal = await modalController.create({
    component: ModalPesanan,
  })

  await modal.present()
}

const updateDocId = async (id: string) => {
  const res = await patch(`angkot/${authAngkot.id}/doc`, {
    docId: id,
  })
  console.log(res.data)
}

const watchPesanan = async () => {
  const colRef = collection(
    db,
    `angkots-${authAngkot.trayek.kode}/${authDocId}/penumpangs`
  )
  const q = query(colRef, where('status', '==', 'pending'))

  pesanansSnap.value = onSnapshot(q, (doc) => {
    const data = doc.docs.map((d) => {
      const data = d.data()
      data.jemput = [data.jemput.longitude, data.jemput.latitude]
      data.tujuan = [data.tujuan.longitude, data.tujuan.latitude]
      data.docId = d.id

      return data
    }) as Pesanan[]

    pesanan.setPesanans(data)
  })
}

const watchPenumpang = async () => {
  const colRef = collection(
    db,
    `angkots-${authAngkot.trayek.kode}/${authDocId}/penumpangs`
  )
  const q = query(
    colRef,
    where('status', 'in', [StatusPesanan.ACCEPT, StatusPesanan.PROCESS])
  )

  penumpangsSnap.value = onSnapshot(q, (doc) => {
    console.log(doc.docs)
    const data = doc.docs.map((d) => {
      const data = d.data()
      data.jemput = [data.jemput.longitude, data.jemput.latitude]
      data.tujuan = [data.tujuan.longitude, data.tujuan.latitude]
      data.docId = d.id

      return data
    }) as Pesanan[]

    penumpangs.setPenumpangs(data)
  })
}
</script>

<style lang="scss" scoped>
ion-item {
  align-items: center !important;
}

ion-content {
  --offset-bottom: auto !important;
  --overflow: auto;
  --background: #f7f7fa;
  overflow: auto;
}

ion-content::part(background) {
  bottom: 0;
}

ion-content::-webkit-scrollbar {
  display: none;
  scrollbar-width: none;
}

#map {
  width: 100%;
  height: 100%;
  visibility: hidden;
}

ion-grid {
  display: flex;
  flex-flow: column;
  height: 100%;
  padding: 0;
}

ion-col {
  padding: 0;
}

#map-wrapper {
  flex-grow: 1;
}

.top-bar {
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 90;
  width: 100%;
  padding: 8px 16px;

  .fill {
    flex-grow: 1;
  }

  ion-button.btn-pesanan {
    position: relative;

    &::part(native) {
      overflow: visible;
    }

    ion-badge {
      position: absolute;
      top: -0.25rem;
      right: -1rem;
    }
  }
}
</style>
