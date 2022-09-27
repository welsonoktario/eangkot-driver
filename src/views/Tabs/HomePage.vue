<template>
  <app-layout>
    <template #content>
      <div class="top-bar">
        <div class="fill">
          <h1 class="ion-no-margin">{{ isActive ? 'Online' : 'Offline' }}</h1>
        </div>
        <e-a-button
          @click="isActive = !isActive"
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
} from 'firebase/firestore'

let map: Map
const accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN
const isLoaded = ref(false)
const isDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const isActive = ref(false)
const db: Firestore = inject('db')
const driver = ref<Unsubscribe>()
const penumpangs = ref<Unsubscribe>()

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
  const docRef = doc(db, 'angkots', '1')
  const colRef = collection(db, 'angkots/1/penumpangs')

  driver.value = onSnapshot(docRef, (doc) => {
    console.log('[Doc] Current data: ', doc.data())
  })

  penumpangs.value = onSnapshot(colRef, (doc) => {
    const ps = doc.docs.map((d) => d.data())
    console.log('[Col] Current data: ', ps)
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
}
</style>
