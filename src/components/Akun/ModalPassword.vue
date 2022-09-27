<template>
  <AppLayout>
    <template #header>
      <IonTitle>{{
        auth.authUser.hasPassword ? "Ubah Password" : "Tambah Password"
      }}</IonTitle>
      <IonButtons slot="end">
        <e-a-button @click="back()">
          <IonIcon
            slot="icon-only"
            :md="closeOutline"
            :ios="closeCircle"
          ></IonIcon>
        </e-a-button>
      </IonButtons>
    </template>

    <template #content>
      <form>
        <IonList :inset="true" class="ion-padding">
          <IonItem v-if="auth.authUser.hasPassword">
            <IonLabel position="floating">Password lama</IonLabel>
            <IonInput type="password" v-model="form.passwordLama"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{{
              auth.authUser.hasPassword ? "Password baru" : "Password"
            }}</IonLabel>
            <IonInput type="password" v-model="form.password"></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{{
              auth.authUser.hasPassword
                ? "Ulangi password baru"
                : "Ulangi password"
            }}</IonLabel>
            <IonInput type="password" v-model="form.confirmPassword"></IonInput>
          </IonItem>
        </IonList>
      </form>
    </template>

    <template #footer>
      <e-a-button
        @click="ubahPassword()"
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

const form = ref({
  passwordLama: "",
  password: "",
  confirmPassword: "",
});

const back = async () => await modalController.dismiss();

const ubahPassword = async () => {
  if (form.value.password == form.value.confirmPassword) {
    const res = await auth.ubahPassword(form.value);
    const data = await res.data;

    if (data.status == "OK") {
      auth.authUser.hasPassword = true;

      await auth.setAuthUser(auth.authUser);
      await modalController.dismiss(true);
    } else if (data.status == "NOT_MATCH") {
      await showToast("Password lama tidak cocok", "danger");
    } else {
      await showToast(data.msg, "danger");
    }
  } else {
    await showToast("Password baru tidak cocok", "warning");
  }
};
</script>
