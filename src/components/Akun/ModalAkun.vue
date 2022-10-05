<template>
  <app-layout title="Ubah Profil">
    <template #header>
      <ion-buttons slot="end">
        <ion-button @click="back()">
          <ion-icon
            slot="icon-only"
            :md="closeOutline"
            :ios="closeCircle"
          ></ion-icon>
        </ion-button>
      </ion-buttons>
      <ion-title>Ubah Profil</ion-title>
    </template>

    <template #content>
      <form @submit.prevent="ubahProfil()">
        <ion-list :inset="true" class="ion-padding">
          <ion-item>
            <ion-label position="floating">Nama</ion-label>
            <ion-input
              type="text"
              name="nama"
              placeholder="Nama"
              v-model="akun.nama"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input
              type="email"
              name="email"
              :placeholder="akun.email ? 'Email' : 'Tambah email'"
              v-model="akun.email"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">No. HP</ion-label>
            <ion-input
              type="tel"
              name="noHp"
              placeholder="No. HP"
              v-model="akun.noHp"
            ></ion-input>
          </ion-item>
        </ion-list>
      </form>
    </template>

    <template #footer>
      <ion-button
        @click="ubahProfil()"
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

const akun = ref(auth.authUser)

const ubahProfil = async () => {
  const res = await auth.ubahProfil(akun.value)
  const data = await res.data

  if (data.status === 'OK') {
    await auth.setAuthUser(akun.value)
    await modalController.dismiss(true)
  } else if (data.status === 'FAIL') {
    await showToast(data.msg, 'danger')
  }
}

const back = async () => await modalController.dismiss()
</script>
