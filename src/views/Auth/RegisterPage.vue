<template>
  <AppLayout>
    <template #header>
      <IonButtons slot="start">
        <IonBackButton></IonBackButton>
      </IonButtons>

      <IonTitle>Register</IonTitle>
    </template>

    <template #content>
      <IonList>
        <IonItem>
          <IonLabel position="floating">Nama</IonLabel>
          <IonInput
            required
            type="text"
            autocomplete="name"
            v-model="nama"
          ></IonInput>
        </IonItem>
      </IonList>
    </template>

    <template #footer>
      <IonButton
        @click="register()"
        class="ion-margin"
        expand="block"
        color="primary"
        :disabled="nama ? false : true"
      >
        Daftar
      </IonButton>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/stores/auth";
import { User } from "@/models/user";
import {
  IonButton,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  useIonRouter,
} from "@ionic/vue";
import AppLayout from "@/layouts/AppLayout.vue";

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
