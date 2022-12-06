<template>
  <app-layout>
    <template #header>
      <app-bar title="Riwayat" />
    </template>
    <ion-grid
      style="height: 100%"
      class="ion-margin-horizontal"
      v-if="terkirim"
    >
      <ion-row
        style="height: 100%"
        class="ion-justify-content-center ion-align-items-center"
      >
        <ion-col>
          <ion-icon
            :name="checkmarkCircle"
            size="large"
            color="primary"
          ></ion-icon>
          <p>
            Pengajuan berhasil dikirim. Proses pengajuan akan diproses selama
            maksimal 3x24 jam.
          </p>
        </ion-col>
      </ion-row>
    </ion-grid>

    <template v-else>
      <form @submit.prevent="kirim()">
        <ion-list>
          <ion-item>
            <ion-label position="floating">Alamat Lengkap</ion-label>
            <ion-input
              v-model="form.alamat"
              type="text"
              autocomplete="street-address"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Trayek Pilihan</ion-label>
            <ion-select v-model="form.trayek">
              <ion-select-option
                v-for="t in trayek.trayeks"
                :key="t.id"
                :value="t.kode"
                >{{ t.kode }}</ion-select-option
              >
            </ion-select>
          </ion-item>
          <div class="ion-margin-vertical">
            <ion-item class="ion-margin-top">
              <ion-label position="stacked">Foto KTP</ion-label>
              <div>
                <img v-if="ktp.webPath" :src="ktp.webPath" width="200" />
                <e-a-button
                  @click="takePhoto('ktp')"
                  expand="block"
                  fill="clear"
                >
                  Ambil foto
                </e-a-button>
              </div>
            </ion-item>
            <ion-item class="ion-margin-top">
              <ion-label position="stacked">Foto SIM</ion-label>
              <div>
                <img v-if="sim.webPath" :src="sim.webPath" width="200" />
                <e-a-button
                  @click="takePhoto('sim')"
                  expand="block"
                  fill="clear"
                >
                  Ambil foto
                </e-a-button>
              </div>
            </ion-item>
          </div>
          <e-a-button
            class="ion-margin-top ion-margin-horizontal"
            expand="block"
            color="primary"
            type="submit"
          >
            Kirim
          </e-a-button>
        </ion-list>
      </form>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import EAButton from '@/components/EAButton.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth, useTrayek } from '@/stores'
import { showDialog } from '@/utils'
import { HTTP } from '@awesome-cordova-plugins/http'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import {
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue'
import { checkmarkCircle } from 'ionicons/icons'
import { onMounted, ref } from 'vue'

const auth = useAuth()
const trayek = useTrayek()
const ktp = ref({
  filePath: '',
  webPath: '',
})
const sim = ref({
  filePath: '',
  webPath: '',
})
const form = ref({
  alamat: '',
  trayek: '',
})
const terkirim = ref(false)
type PhotoType = 'ktp' | 'sim'

onMounted(async () => await trayek.loadTrayeks())

const takePhoto = async (type: PhotoType) => {
  const img = await Camera.getPhoto({
    quality: 40,
    allowEditing: true,
    source: CameraSource.Camera,
    resultType: CameraResultType.Uri,
  })

  if (type == 'ktp') {
    ktp.value = {
      webPath: img.webPath,
      filePath: img.path,
    }
  } else {
    sim.value = {
      webPath: img.webPath,
      filePath: img.path,
    }
  }
}

const kirim = async () => {
  const url = import.meta.env.VITE_API_URL
  const filePaths = [ktp.value.filePath, sim.value.filePath]
  const names = ['ktp', 'sim']

  try {
    const res = await HTTP.uploadFile(
      url,
      form.value,
      {
        Accept: 'application/json',
        Authorization: auth.authToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      filePaths,
      names
    )

    console.log(res)
    const data = res.data

    if (data.status === 'OK') {
      terkirim.value = true
    } else if (data.status === 'FAIL') {
      await showDialog({
        title: 'Error',
        message: data.msg,
      })
    }
  } catch (e: any) {
    console.log(e)
    await showDialog({
      title: 'Error',
      message: e.data.msg,
    })
  }
}
</script>
