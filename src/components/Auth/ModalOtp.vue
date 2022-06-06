<template>
  <app-layout>
    <template #header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="closeModal(null)">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>OTP</ion-title>
      </ion-toolbar>
    </template>

    <template #content>
      <ion-label>Kode OTP</ion-label>
      <div style="display: flex; flex-direction: row; width: 100%">
        <v-otp-input
          ref="pin"
          separator="-"
          :num-inputs="4"
          :should-auto-focus="true"
          :is-input-num="true"
          :placeholder="['*', '*', '*', '*']"
          @on-complete="handleOnComplete"
        />
      </div>
    </template>

    <template #footer>
      <ion-button @click="checkOtp()" class="ion-margin" expand="block">
        Lanjut
      </ion-button>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { $ref } from "vue/macros";
import { useAuth } from "@/stores";
import {
  IonLabel,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  modalController,
} from "@ionic/vue";
import { Dialog } from "@capacitor/dialog";
import { arrowBack } from "ionicons/icons";
import AppLayout from "@/layouts/AppLayout.vue";
import VOtpInput from "vue3-otp-input";

const auth = useAuth();

const props = defineProps({
  phone: {
    type: String,
    required: true,
  },
});

let pin = $ref("");

onMounted(() => requestOtp());

const handleOnComplete = (value: string) => {
  pin = value;
};

const closeModal = (data: any) => modalController.dismiss(data);

const requestOtp = async () => await auth.requestOTP(props.phone);

const checkOtp = async () => {
  const res = await auth.checkOTP(props.phone, pin);
  const data = await res.data;

  if (data.msg) {
    await modalController.dismiss(true);
  } else {
    await Dialog.alert({
      title: "Error",
      message: "Kode OTP tidak cocok",
    });
  }
};
</script>
