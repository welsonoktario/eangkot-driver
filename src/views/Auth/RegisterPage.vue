<template>
  <app-layout>
    <template #header>
      <e-a-buttons slot="start">
        <ion-back-button></ion-back-button>
      </e-a-buttons>

      <ion-title>Register</ion-title>
    </template>

    <template #content>
      <ion-list>
        <ion-item>
          <ion-label position="floating">Nama</ion-label>
          <ion-input
            required
            type="text"
            autocomplete="name"
            v-model="nama"
          ></ion-input>
        </ion-item>
      </ion-list>
    </template>

    <template #footer>
      <e-a-button
        @click="register()"
        class="ion-margin"
        expand="block"
        color="primary"
        :disabled="nama ? false : true"
      >
        Daftar
      </e-a-button>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/stores/auth";
import { User } from "@/types/user";
import {
  IonBackButton,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  useIonRouter,
} from "@ionic/vue";
import AppLayout from "@/layouts/AppLayout.vue";
import EAButton from "@/components/EAButton.vue";

const route = useRoute();
const ionRouter = useIonRouter();
const auth = useAuth();

const { phone } = route.params;
const nama = ref("");

const register = async () => {
  const res = await auth.register(nama.value, phone.toString());
  const data = await res.data;

  if (data.status == "OK") {
    await auth.setAuthUser(data.data.user as User, data.data.token);
    ionRouter.push("/tabs/home");
  }
};
</script>
