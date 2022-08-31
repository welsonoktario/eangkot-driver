<template>
  <AppLayout>
    <IonGrid style="height: 100%" class="ion-margin-horizontal" v-if="terkirim">
      <IonRow
        style="height: 100%"
        class="ion-justify-content-center ion-align-items-center"
      >
        <IonCol>
          <IonIcon
            :name="checkmarkCircle"
            size="large"
            color="primary"
          ></IonIcon>
          <p>
            Pengajuan berhasil dikirim. Proses pengajuan akan diproses selama
            maksimal 3x24 jam.
          </p>
        </IonCol>
      </IonRow>
    </IonGrid>

    <template v-else>
      <form @submit.prevent="kirim()">
        <IonList>
          <IonItem>
            <IonLabel position="floating">Alamat Lengkap</IonLabel>
            <IonInput
              v-model="form.alamat"
              type="text"
              autocomplete="street-address"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">NIK KTP (16 angka)</IonLabel>
            <IonInput required v-model="form.nik" type="tel"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Trayek Pilihan</IonLabel>
            <IonSelect v-model="form.trayek">
              <IonSelectOption
                v-for="t in trayek.trayeks"
                :key="t.id"
                :value="t.kode"
                >{{ t.kode }}</IonSelectOption
              >
            </IonSelect>
          </IonItem>
          <div class="ion-margin-vertical">
            <IonItem class="ion-margin-top">
              <IonLabel position="stack">Foto KTP</IonLabel>
              <div>
                <img v-if="display.ktp" :src="display.ktp" width="200" />
                <IonButton
                  @click="takePhoto('ktp')"
                  expand="block"
                  fill="clear"
                >
                  Ambil foto
                </IonButton>
              </div>
            </IonItem>
            <IonItem class="ion-margin-top">
              <IonLabel position="stack">Foto SIM</IonLabel>
              <div>
                <img v-if="display.sim" :src="display.sim" width="200" />
                <IonButton
                  @click="takePhoto('sim')"
                  expand="block"
                  fill="clear"
                >
                  Ambil foto
                </IonButton>
              </div>
            </IonItem>
          </div>
          <IonButton
            class="ion-margin-top ion-margin-horizontal"
            expand="block"
            color="primary"
            type="submit"
          >
            Kirim
          </IonButton>
        </IonList>
      </form>
    </template>
  </AppLayout>
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
import AppLayout from "@/layouts/AppLayout.vue";

const auth = useAuth();
const trayek = useTrayek();
const form = reactive({
  alamat: "",
  nik: "",
  trayek: "",
});
const terkirim = ref(false);
const display = ref({
  ktp: "",
  sim: "",
});
const detail = ref({
  ktp: {
    blob: null,
    format: "",
  },
  sim: {
    blob: null,
    format: "",
  },
});
type PhotoType = "ktp" | "sim";

onMounted(async () => await trayek.loadTrayeks());

const takePhoto = async (type: PhotoType) => {
  const image = await Camera.getPhoto({
    quality: 40,
    allowEditing: true,
    source: CameraSource.Camera,
    resultType: CameraResultType.Base64,
  });

  detail.value[type].blob = await b64toBlob(image.base64String, image.format);
  detail.value[type].format = image.format;
  display.value[
    type
  ] = `data:image/${image.format};base64,${image.base64String}`;
};

const kirim = async () => {
  const formData = new FormData();
  formData.append("alamat", form.alamat);
  formData.append("nik", form.nik);
  formData.append("trayek", form.trayek);
  formData.append("foto_ktp", detail.value.ktp.blob);
  formData.append("format_ktp", detail.value.ktp.format);
  formData.append("foto_sim", detail.value.sim.blob);
  formData.append("format_sim", detail.value.sim.format);
 
  const res = await auth.pengajuanDriver(formData);
  const data = await res.data;

  if (data.status === "OK") {
    terkirim.value = true;
  } else if (data.status === "FAIL") {
    await Dialog.alert({
      title: "Error",
      message: data.msg,
    });
  }
};

const b64toBlob = async (base64: string, format: string) =>
  await (await fetch(`data:image/${format};base64,${base64}`)).blob();
</script>
