<template>
  <app-layout>
    <template #content>
      <div class="top-bar">
        <div class="fill">
          <h1 class="ion-no-margin">{{ isActive ? 'Online' : 'Offline' }}</h1>
        </div>
        <e-a-button
          @click="setOnline()"
          :color="isActive ? 'primary' : 'danger'"
        >
          <ion-icon :icon="power" />
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
import { IonCol, IonGrid, IonRow, IonIcon } from '@ionic/vue'
import { GeolocateControl, Map } from 'mapbox-gl'
import { inject, onMounted, ref } from 'vue'
import { power } from 'ionicons/icons'
import EAButton from '@/components/EAButton.vue'
import {
  doc,
  Firestore,
  collection,
  onSnapshot,
  Unsubscribe,
  setDoc,
  GeoPoint,
  deleteDoc,
  getDocs,
  updateDoc,
  query,
  where,
  DocumentData,
  DocumentReference,
  addDoc,
} from 'firebase/firestore'
import { Geolocation } from '@capacitor/geolocation'
import { useAuth } from '@/stores'
import { User } from '@/types'

const { authDriver, authUser, authAngkot, setAngkotDoc, angkotDocRef } =
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
  const q = query(
    collection(db, `angkots-${authAngkot.trayek.kode}`),
    where('id', '==', authAngkot.id)
  )
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    setAngkotDoc(doc)
  })

  if (angkotDocRef) {
    const docRef = doc(db, `angkots-${authAngkot.trayek.kode}`, angkotDocRef.id)
    const colRef = collection(
      db,
      `angkots-${authAngkot.trayek.kode}/${angkotDocRef.id}/penumpangs`
    )

    driverSnap.value = onSnapshot(docRef, (doc) => {
      console.log('[Doc] Current data: ', doc.data())
      if (doc.exists()) {
        isActive.value = true
      }
    })

    penumpangsSnap.value = onSnapshot(colRef, (doc) => {
      penumpangs.value = doc.docs.map((d) => d.data()) as User[]
    })
  }
}

const setOnline = async () => {
  let watch: any

  if (!isActive.value) {
    const geo = await Geolocation.getCurrentPosition()
    const lokasi = geo.coords

    try {
      const colRef = collection(db, `angkots-${authAngkot.trayek.kode}`)
      const adr = await addDoc(colRef, {
        driver: {
          id: authDriver,
          nama: authUser.nama,
        },
        noKendaraan: authAngkot.noKendaraan,
        lokasi: new GeoPoint(lokasi.latitude, lokasi.longitude),
      })

      setAngkotDoc(adr)
      isActive.value = true
      const docRef = doc(db, `angkots-${authAngkot.trayek.kode}`, `${adr.id}`)

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
    try {
      const colRef = collection(
        db,
        `angkots-${authAngkot.trayek.kode}/${angkotDocRef.id}/penumpangs`
      )
      const snapshots = await getDocs(colRef)

      if (!snapshots.empty) {
        alert('Masi ada penumpang')
      } else {
        await deleteDoc(
          doc(db, `angkots-${authAngkot.trayek.kode}`, `${angkotDocRef.id}`)
        )

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
}
</style>
