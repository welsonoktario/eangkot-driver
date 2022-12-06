<template>
  <div ref="mapContainer" class="map-wrapper"></div>
</template>

<script setup lang="ts">
import { showToast } from '@/utils';
import { Geolocation } from '@capacitor/geolocation'
import { LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl'
import { onMounted, onUnmounted, ref } from 'vue'

type MapBoxProps = {
  jemput: LngLatLike
  tujuan: LngLatLike
}

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const props = defineProps<MapBoxProps>()
const emits = defineEmits(['routeLoaded'])
const geo = ref<string>()
const markerCurrentPos = ref<Marker>()
const mapContainer = ref<HTMLElement>()
const map = ref<Map>()

onMounted(async () => {
  map.value = new Map({
    accessToken,
    style: 'mapbox://styles/mapbox/navigation-day-v1', // style URL
    center: [112.7518702, -7.2621774], // starting position [lng, lat]
    zoom: 13, // starting zoom
    container: mapContainer.value,
  })

  setTimeout(() => map.value.resize(), 100)
  geo.value = await Geolocation.watchPosition(
    { enableHighAccuracy: true, timeout: 5000 },
    (pos) => {
      const coords = pos.coords
      if (markerCurrentPos.value) {
        markerCurrentPos.value.setLngLat([coords.longitude, coords.latitude])
      } else {
        markerCurrentPos.value = new Marker()
          .setLngLat([coords.longitude, coords.latitude])
          .addTo(map.value)
      }
    }
  )

  await drawRoute()
})

const drawRoute = async () => {
  if (map.value) {
    const jemput = (props.jemput as number[]).join(',')
    const tujuan = (props.tujuan as number[]).join(',')
    const [res, addressJemput, addressTujuan] = await Promise.all([
      fetchRoute(jemput, tujuan),
      fetchAddres(props.jemput),
      fetchAddres(props.tujuan),
    ])
    const data = res.routes[0]
    const route = data.geometry.coordinates
    const geojson: any = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route,
      },
    }

    emits('routeLoaded', data)

    if (map.value.getSource('route')) {
      // @ts-ignore
      map.value.getSource('route').setData(geojson)
    } else {
      map.value.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson,
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75,
        },
      })
    }

    const bounds = new LngLatBounds(route[0], route[0])

    // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    for (const coord of route) {
      bounds.extend(coord)
    }

    map.value.fitBounds(bounds, {
      padding: {
        bottom: 300,
        top: 20,
        left: 64,
        right: 64,
      },
    })

    new Marker()
      .setLngLat(props.jemput)
      .setPopup(
        new Popup().setHTML(
          `<p style="color: #000">${addressJemput.results[0].formatted_address}</p>`
        )
      )
      .addTo(map.value)
    new Marker()
      .setLngLat(props.tujuan)
      .setPopup(
        new Popup().setHTML(
          `<p style="color: #000">${addressTujuan.results[0].formatted_address}</p>`
        )
      )
      .addTo(map.value)
  }
}

const fetchRoute = async (jemput: string, tujuan: string) => {
  try {
    const res = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${jemput};${tujuan}?geometries=geojson&access_token=${accessToken}`
    )
    const json = await res.json()

    return json
  } catch (e: any) {
    await showToast('Terjadi kesalahan mengambil data rotute', 'danger')
  }
}

const fetchAddres = async (lngLat: LngLatLike) => {
  try {
    const latLng = (lngLat as number[]).slice().reverse().join(',')
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=${apiKey}`
    )
    return await res.json()
  } catch (e: any) {
    await showToast('Terjadi kesalahan mengambil data alamat', 'danger')
  }
}

onUnmounted(
  async () =>
    geo.value &&
    (await Geolocation.clearWatch({
      id: geo.value,
    }))
)
</script>

<style scoped>
.map-wrapper {
  flex-grow: 1;
}
</style>
