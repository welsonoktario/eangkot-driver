<template>
  <AppLayout title="Ubah Profil">
    <template #header>
      <IonButtons slot="end">
        <e-a-button @click="back()">
          <IonIcon
            slot="icon-only"
            :md="closeOutline"
            :ios="closeCircle"
          ></IonIcon>
        </e-a-button>
      </IonButtons>
      <IonTitle>Ubah Profil</IonTitle>
    </template>

    <template #content>
      <form @submit.prevent="ubahProfil()">
        <IonList :inset="true" class="ion-padding">
          <IonItem>
            <IonLabel position="floating">Nama</IonLabel>
            <IonInput
              type="text"
              name="nama"
              placeholder="Nama"
              v-model="akun.nama"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              name="email"
              :placeholder="akun.email ? 'Email' : 'Tambah email'"
              v-model="akun.email"
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">No. HP</IonLabel>
            <IonInput
              type="tel"
              name="noHp"
              placeholder="No. HP"
              v-model="akun.noHp"
            ></IonInput>
          </IonItem>
        </IonList>
      </form>
    </template>

    <template #footer>
      <e-a-button
        @click="ubahProfil()"
        class="ion-margin"
        expand="block"
        fill="solid"
      >
        Simpan
      </e-a-button>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import AppLayout from "@/layouts/AppLayout.vue";
import { useAuth } from "@/stores";
import { showToast } from "@/utils";
import {
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  modalController,
} from "@ionic/vue";
import { closeCircle, closeOutline } from "ionicons/icons";
import { ref } from "vue";
import EAButton from "@/components/EAButton.vue";

const auth = useAuth();

const akun = ref(auth.authUser);

const ubahProfil = async () => {
  const res = await auth.ubahProfil(akun.value);
  const data = await res.data;

  if (data.status === "OK") {
    await auth.setAuthUser(akun.value);
    await modalController.dismiss(true);
  } else if (data.status === "FAIL") {
    await showToast(data.msg, "danger");
  }
};

const back = async () => await modalController.dismiss();
</script>
