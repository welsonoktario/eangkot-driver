<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="penumpang" href="/tabs/penumpang">
          <ion-icon :icon="car" />
          <ion-label>Penumpang</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="statistik" href="/tabs/statistik">
          <ion-icon :icon="statsChart" />
          <ion-label>Statistik</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="angkot" href="/tabs/angkot">
          <ion-icon :icon="car" />
          <ion-label>Angkot</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="akun" href="/tabs/akun">
          <ion-icon :icon="person" />
          <ion-label>Akun</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue'
import { car, home, person, statsChart } from 'ionicons/icons'
</script>
