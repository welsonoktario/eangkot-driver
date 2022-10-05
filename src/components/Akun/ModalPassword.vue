<template>
  <app-layout>
    <template #header>
      <ion-title>{{
        auth.authUser.hasPassword ? 'Ubah Password' : 'Tambah Password'
      }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="back()">
          <ion-icon
            slot="icon-only"
            :md="closeOutline"
            :ios="closeCircle"
          ></ion-icon>
        </ion-button>
      </ion-buttons>
    </template>

    <template #content>
      <form>
        <ion-list :inset="true" class="ion-padding">
          <ion-item v-if="auth.authUser.hasPassword">
            <ion-label position="floating">Password lama</ion-label>
            <ion-input type="password" v-model="form.passwordLama"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{
              auth.authUser.hasPassword ? 'Password baru' : 'Password'
            }}</ion-label>
            <ion-input type="password" v-model="form.password"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{
              auth.authUser.hasPassword
                ? 'Ulangi password baru'
                : 'Ulangi password'
            }}</ion-label>
            <ion-input
              type="password"
              v-model="form.confirmPassword"
            ></ion-input>
          </ion-item>
        </ion-list>
      </form>
    </template>

    <template #footer>
      <ion-button
        @click="ubahPassword()"
        class="ion-margin"
        expand="block"
        fill="solid"
      >
        Simpan
      </ion-button>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth } from '@/stores'
import { showToast } from '@/utils'
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  modalController,
} from '@ionic/vue'
import { closeCircle, closeOutline } from 'ionicons/icons'
import { ref } from 'vue'

const auth = useAuth()

const form = ref({
  passwordLama: '',
  password: '',
  confirmPassword: '',
})

const back = async () => await modalController.dismiss()

const ubahPassword = async () => {
  if (form.value.password == form.value.confirmPassword) {
    const res = await auth.ubahPassword(form.value)
    const data = await res.data

    if (data.status == 'OK') {
      auth.authUser.hasPassword = true

      await auth.setAuthUser(auth.authUser)
      await modalController.dismiss(true)
    } else if (data.status == 'NOT_MATCH') {
      await showToast('Password lama tidak cocok', 'danger')
    } else {
      await showToast(data.msg, 'danger')
    }
  } else {
    await showToast('Password baru tidak cocok', 'warning')
  }
}
</script>
