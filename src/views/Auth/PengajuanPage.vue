<template>
  <app-layout>
    <template #header>
      <app-bar title="Pengajuan Driver" />
    </template>

    <template #content>
      <ion-card v-if="!statusPengajuan" color="primary" class="ion-text-center">
        <ion-card-content>
          <ion-icon size="large" :icon="alertCircle"></ion-icon>
          <h3 color="primary">
            Sebelum dapat menggunakan aplikasi, anda harus mengajukan permohonan
            menjadi pengemudi angkot.
          </h3>
        </ion-card-content>
      </ion-card>

      <ion-card
        v-if="statusPengajuan === 'Ditolak'"
        color="danger"
        class="ion-text-center"
      >
        <ion-card-content>
          <ion-icon size="large" :icon="closeCircle"></ion-icon>
          <h3 color="primary">
            Pengajuan anda ditolak, silahkan ajukan kembali permohonan anda.
          </h3>
        </ion-card-content>
      </ion-card>

      <ion-card
        v-if="statusPengajuan === 'Pending'"
        color="primary"
        class="ion-text-center"
      >
        <ion-card-content>
          <ion-icon size="large" :icon="alertCircle"></ion-icon>
          <h3 color="primary">
            Pengajuan berhasil dikirim. Proses pengajuan akan diproses selama
            maksimal 3x24 jam.
          </h3>
        </ion-card-content>
      </ion-card>

      <ion-card
        v-if="statusPengajuan === 'Diterima'"
        color="primary"
        class="ion-text-center"
      >
        <ion-card-content>
          <ion-icon size="large" :icon="checkmarkCircle"></ion-icon>
          <h3 color="primary">
            Pengajuan anda telah diterima! Selamat menggunakan aplikasi.
          </h3>
        </ion-card-content>
      </ion-card>

      <template v-if="!statusPengajuan || statusPengajuan === 'Ditolak'">
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
                :key="t.kode"
                :value="t.id"
                >{{ t.kode }}</ion-select-option
              >
            </ion-select>
          </ion-item>
          <div class="ion-margin-vertical">
            <ion-item class="ion-margin-top">
              <div class="flex-col">
                <ion-label>Foto KTP</ion-label>
                <img v-if="ktp.webPath" :src="ktp.webPath" width="200" />
              </div>
              <e-a-button
                slot="end"
                @click="takePhoto('ktp')"
                expand="block"
                fill="clear"
                class="btn-foto"
              >
                Ambil foto
              </e-a-button>
            </ion-item>
            <ion-item class="ion-margin-top">
              <div class="flex-col">
                <ion-label>Foto SIM</ion-label>
                <img v-if="sim.webPath" :src="sim.webPath" width="200" />
              </div>
              <e-a-button
                slot="end"
                @click="takePhoto('sim')"
                expand="block"
                fill="clear"
                class="btn-foto"
              >
                Ambil foto
              </e-a-button>
            </ion-item>
          </div>
        </ion-list>
      </template>
    </template>

    <template #footer>
      <e-a-button
        v-if="!statusPengajuan || statusPengajuan == 'Ditolak'"
        class="ion-margin"
        expand="block"
        color="primary"
        @click="kirim()"
      >
        Kirim
      </e-a-button>
      <e-a-button
        v-if="statusPengajuan == 'Diterima'"
        class="ion-margin"
        expand="block"
        color="primary"
        @click="mulai()"
      >
        Mulai
      </e-a-button>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import EAButton from '@/components/EAButton.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { API_URL, get } from '@/lib'
import { useAuth, useTrayek } from '@/stores'
import { showDialog } from '@/utils'
import { HTTP } from '@awesome-cordova-plugins/http'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  useIonRouter,
} from '@ionic/vue'
import { alertCircle, checkmarkCircle, closeCircle } from 'ionicons/icons'
import { onMounted, ref } from 'vue'

const router = useIonRouter()
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
const statusPengajuan = ref('')
type PhotoType = 'ktp' | 'sim'

onMounted(async () => {
  await loadPengajuan()
  await trayek.loadTrayeks()
})

const loadPengajuan = async () => {
  try {
    const res = await get(`driver/${auth.authUser.id}`)
    const data = await res.data

    if (data.status == 'OK') {
      statusPengajuan.value = data.data.pengajuan.status
      delete data.data.pengajuan
      auth.setAuthUser(data.data, auth.authToken, 0.0)
    }
  } catch (e: any) {
    console.error(e)
  }
}

const takePhoto = async (type: PhotoType) => {
  const img = await Camera.getPhoto({
    quality: 50,
    allowEditing: false,
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
  const url = API_URL + 'driver'
  const filePaths = [ktp.value.filePath, sim.value.filePath]
  const names = ['ktp', 'sim']

  try {
    const res = await HTTP.uploadFile(
      url,
      {
        alamat: String(form.value.alamat),
        trayek: String(form.value.trayek),
      },
      {
        Accept: 'application/json',
        Authorization: `Bearer ${auth.authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      filePaths,
      names
    )

    const data = JSON.parse(res.data)

    if (data.status === 'OK') {
      statusPengajuan.value = 'Pending'
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

const mulai = async () => {
  router.navigate('/tabs/home', 'root', 'replace')
}
</script>

<style scoped>
.btn-foto {
  margin: 0;
  align-self: center !important;
}

.flex-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
