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
          <ion-badge color="danger" slot="end">2</ion-badge>
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
import AppLayout from '@/layouts/AppLayout.vue'
import ModalPesanan from '@/components/Home/ModalPesanan.vue'
import {
  IonBadge,
  IonCol,
  IonGrid,
  IonRow,
  IonIcon,
  loadingController,
  modalController,
} from '@ionic/vue'
import { GeolocateControl, Map, Marker } from 'mapbox-gl'
import { inject, onMounted, ref } from 'vue'
import { receipt, power } from 'ionicons/icons'
import EAButton from '@/components/EAButton.vue'
import {
  doc,
  Firestore,
  collection,
  onSnapshot,
  Unsubscribe,
  GeoPoint,
  deleteDoc,
  getDocs,
  updateDoc,
  query,
  where,
  addDoc,
} from 'firebase/firestore'
import { Geolocation } from '@capacitor/geolocation'
import { useAuth } from '@/stores'
import { User } from '@/types'

const { authDriver, authUser, authAngkot, setAngkotDocId, authDocId } =
  useAuth()
const db: Firestore = inject('db')

let map: Map
const accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN
const isLoaded = ref(false)
const isDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const isActive = ref(false)
const driverSnap = ref<Unsubscribe>()
const penumpangsSnap = ref<Unsubscribe>()
const penumpangs = ref<User[]>()
const markerLokasi = ref<Marker>()

onMounted(async () => {
  loadDocument()
  map = new Map({
    container: 'map',
    style: isDark
      ? 'mapbox://styles/mapbox/dark-v10'
      : 'mapbox://styles/mapbox/light-v10', // style URL
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

const loadDocument = async () => {
  const geo = await Geolocation.getCurrentPosition()
  const lokasi = geo.coords

  const q = query(
    collection(db, `angkots-${authAngkot.trayek.kode}`),
    where('id', '==', authAngkot.id)
  )
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    setAngkotDocId(doc.id)
  })

  if (authDocId) {
    const docRef = doc(db, `angkots-${authAngkot.trayek.kode}`, authDocId)
    const colRef = collection(
      db,
      `angkots-${authAngkot.trayek.kode}/${authDocId}/penumpangs`
    )

    driverSnap.value = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data()
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
      } else {
        markerLokasi.value.remove()
      }
    })

    penumpangsSnap.value = onSnapshot(colRef, (doc) => {
      penumpangs.value = doc.docs.map((d) => d.data()) as User[]
    })
  }
}

// ini susah 🫠
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

      // watch pergerakan angkot
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
      console.error(e)
    }
  } else {
    markerLokasi.value.remove()

    try {
      const colRef = collection(
        db,
        `angkots-${authAngkot.trayek.kode}/${authDocId}/penumpangs`
      )
      const snapshots = await getDocs(colRef)

      if (!snapshots.empty) {
        alert('Masi ada penumpang')
      } else {
        await deleteDoc(doc(db, `angkots-${authAngkot.trayek.kode}`, authDocId))

        // hapus watch pergerakan angkot
        if (watch) {
          await Geolocation.clearWatch({ id: watch })
        }
        isActive.value = false
      }
    } catch (e: any) {
      console.error(e)
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
