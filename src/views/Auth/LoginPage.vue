<template>
  <AppLayout :fullscreen="true">
    <template #content>
      <IonGrid style="height: 100%" class="ion-padding-bottom">
        <IonRow style="height: 50%">
          <IonCol>
            <h1 class="ion-text-center">eAngkot</h1>
          </IonCol>
        </IonRow>
        <IonRow
          class="ion-align-items-end ion-padding-horizontal"
          style="height: 50%"
        >
          <IonCol>
            <IonList lines="full">
              <form class="ion-margin-horizontal" @submit.prevent="otp()">
                <IonItem>
                  <IonLabel position="floating">No. HP</IonLabel>
                  <IonInput required v-model="phone" type="tel"></IonInput>
                </IonItem>
                <IonButton
                  class="ion-margin-vertical"
                  expand="block"
                  color="primary"
                  type="submit"
                >
                  Mulai
                </IonButton>
              </form>
            </IonList>
          </IonCol>
        </IonRow>
      </IonGrid>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  modalController,
  useIonRouter,
} from "@ionic/vue";
import { useAuth } from "@/stores/auth";
import { User } from "@/models/user";
import AppLayout from "@/layouts/AppLayout.vue";
import ModalOtp from "@/components/Auth/ModalOtp.vue";

const ionRouter = useIonRouter();
const auth = useAuth();
const phone = ref("");

/* const loginOld = async () => {
  const res = await axios.post("auth/login", { phone: phone.value });
  const data = await res.data;

  if (data.msg === "REGISTERED") {
    await auth.setAuthUser(data.data.user as User, data.data.token);

    ionRouter.push("/tabs/home");
  } else if (data.msg === "REGISTER") {
    ionRouter.push(`/auth/register/${phone.value}`);
  }
}; */

const login = async () => {
  const res = await auth.login(phone.value);
  const data = await res.data;

  if (data.msg === "REGISTERED") {
    await auth.setAuthUser(data.data.user as User, data.data.token);

    ionRouter.push("/tabs/home");
  } else if (data.msg === "REGISTER") {
    ionRouter.push(`/auth/register/${phone.value}`);
  }
};

const otp = async () => {
  const modal = await modalController.create({
    component: ModalOtp,
    componentProps: {
      phone: phone.value,
    },
    canDismiss: true,
  });

  await modal.present();

  const verified: boolean = (await modal.onDidDismiss()).data;

  if (verified) {
    login();
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100%;
  vertical-align: middle;
}

.spin {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

ion-spinner {
  width: 28px;
  height: 28px;
  stroke: #444;
  fill: #222;
}
</style>
