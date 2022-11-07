<template>
  <app-layout>
    <template #header>
      <app-bar title="Akun" />
    </template>

    <template #content>
      <ion-item class="ion-padding-vertical" lines="none">
        <ion-label v-if="auth.authUser" class="ion-text-center">
          <h1>{{ auth.authUser.nama }}</h1>
          <p v-if="auth.authUser.email">{{ auth.authUser.email }}</p>
          <p>{{ auth.authUser.noHp }}</p>
        </ion-label>
      </ion-item>

      <ion-list lines="full">
        <ion-item
          routerLink="/tabs/riwayat"
          routerDirection="root"
          button
          detail
        >
          <ion-icon slot="start" :md="time" :ios="timeOutline"></ion-icon>
          <ion-label>Riwayat perjalanan</ion-label>
        </ion-item>
        <ion-item @click="profil()" button detail>
          <ion-icon slot="start" :md="person" :ios="personOutline"></ion-icon>
          <ion-label>Ubah profil</ion-label>
        </ion-item>
        <ion-item @click="password()" button detail>
          <ion-icon slot="start" :md="key" :ios="keyOutline"></ion-icon>
          <ion-label>{{
            auth.authUser?.hasPassword ? 'Ubah password' : 'Tambah password'
          }}</ion-label>
        </ion-item>
        <ion-item @click="share()" button detail>
          <ion-icon slot="start" :md="people" :ios="peopleOutline"></ion-icon>
          <ion-label>Bagikan eAngkot</ion-label>
        </ion-item>
        <ion-item button detail>
          <ion-icon slot="start" :md="help" :ios="helpCircleOutline"></ion-icon>
          <ion-label>Bantuan</ion-label>
        </ion-item>
      </ion-list>
      <ion-item
        @click="logout()"
        lines="none"
        class="ion-margin-top"
        button
        detail
      >
        <ion-icon
          slot="start"
          :md="logOut"
          :ios="logOutOutline"
          color="danger"
        ></ion-icon>
        <ion-label color="danger">Keluar</ion-label>
      </ion-item>
    </template>
  </app-layout>
</template>

<script lang="ts" setup>
import ModalAkun from '@/components/Akun/ModalAkun.vue'
import ModalPassword from '@/components/Akun/ModalPassword.vue'
import AppBar from '@/components/AppBar.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth } from '@/stores'
import { showToast } from '@/utils'
import { Share } from '@capacitor/share'
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  modalController,
  useIonRouter,
} from '@ionic/vue'
import {
  help,
  helpCircleOutline,
  key,
  keyOutline,
  logOut,
  logOutOutline,
  people,
  peopleOutline,
  person,
  personOutline,
  time,
  timeOutline,
} from 'ionicons/icons'
import { getCurrentInstance } from 'vue'

const context = getCurrentInstance()
const auth = useAuth()
const ionRouter = useIonRouter()

const profil = async () => {
  const modal = await modalController.create({
    component: ModalAkun,
    canDismiss: true,
    presentingElement: context.parent.refs.ionRouterOutlet as HTMLElement,
  })

  await modal.present()

  const success = await (await modal.onDidDismiss()).data

  if (success) {
    await showToast('Profil berhasil diperbarui', 'success')
  }
}

const password = async () => {
  const modal = await modalController.create({
    component: ModalPassword,
    canDismiss: true,
    presentingElement: context.parent.refs.ionRouterOutlet as HTMLElement,
  })

  await modal.present()

  const success = await (await modal.onDidDismiss()).data

  if (success) {
    await showToast('Password berhasil diperbarui', 'success')
  }
}

const share = async () =>
  await Share.share({
    text: 'Download dan gunakan eAngkot sekarang juga!',
    url: 'https://google.com/',
    dialogTitle: 'Download eAngkot',
  })

const logout = async () => {
  await auth.logout()
  ionRouter.navigate('/auth/login', 'root', 'replace')
}
</script>
