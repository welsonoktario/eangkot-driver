<template>
  <app-layout>
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
            <ion-label position="floating">NIK KTP (16 angka)</ion-label>
            <ion-input required v-model="form.nik" type="tel"></ion-input>
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
                <img
                  v-if="detail.ktp.webPath"
                  :src="detail.ktp.webPath"
                  width="200"
                />
                <ion-button
                  @click="takePhoto('ktp')"
                  expand="block"
                  fill="clear"
                >
                  Ambil foto
                </ion-button>
              </div>
            </ion-item>
            <ion-item class="ion-margin-top">
              <ion-label position="stacked">Foto SIM</ion-label>
              <div>
                <img
                  v-if="detail.sim.webPath"
                  :src="detail.sim.webPath"
                  width="200"
                />
                <ion-button
                  @click="takePhoto('sim')"
                  expand="block"
                  fill="clear"
                >
                  Ambil foto
                </ion-button>
              </div>
            </ion-item>
          </div>
          <ion-button
            class="ion-margin-top ion-margin-horizontal"
            expand="block"
            color="primary"
            type="submit"
          >
            Kirim
          </ion-button>
        </ion-list>
      </form>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useAuth, useTrayek } from "@/stores";
import { Camera, CameraSource, CameraResultType } from "@capacitor/camera";
import { Dialog } from "@capacitor/dialog";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
} from "@ionic/vue";
import { checkmarkCircle } from "ionicons/icons";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import Http from "cordova-plugin-advanced-http";
import AppLayout from "@/layouts/AppLayout.vue";

const auth = useAuth();
const trayek = useTrayek();
const detail = ref({
  ktp: {
    filePath: "",
    webPath: "",
  },
  sim: {
    filePath: "",
    webPath: "",
  },
});
const form = reactive({
  alamat: "",
  nik: "",
  trayek: "",
});
const terkirim = ref(false);
type PhotoType = "ktp" | "sim";

onMounted(async () => await trayek.loadTrayeks());

const takePhoto = async (type: PhotoType) => {
  const img = await Camera.getPhoto({
    quality: 40,
    allowEditing: true,
    source: CameraSource.Camera,
    resultType: CameraResultType.Uri,
  });

  detail.value[type].webPath = img.webPath;
  detail.value[type].filePath = img.path;
};

const kirim = async () => {
  const url = process.env.VUE_APP_API_URL;
  const filePaths = [detail.value.ktp.filePath, detail.value.sim.filePath];
  const names = ["ktp", "sim"];
  
  Http.uploadFile(
    url,
    filePaths,
    names,
    {
      Authorization: auth.authToken,
    },
    async (res: any) => {
      console.log(res);
      const data = res.data;
      if (data.status === "OK") {
        terkirim.value = true;
      } else if (data.status === "FAIL") {
        await Dialog.alert({
          title: "Error",
          message: data.msg,
        });
      }
    },
    async (err: any) => {
      await Dialog.alert({
        title: "Error",
        message: err.data.msg,
      });
    }
  );
};
</script>
