<template>
  <app-layout>
    <template #header>
      <app-bar title="Angkot" />
    </template>

    <template #content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Detail Angkot</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-label>Gambar Angkot</ion-label>
          <img class="ion-margin-top" :src="trayek.gambar" :alt="trayek.kode" />
          <ion-item>
            <ion-label slot="start">No. Kendaraan</ion-label>
            <ion-label slot="end">{{ angkot.noKendaraan }}</ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Detail Trayek</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label slot="start">Kode Trayek</ion-label>
            <ion-label slot="end">{{ trayek.kode }}</ion-label>
          </ion-item>
          <ion-item>
            <div class="flex-col">
              <h2>Rute</h2>
              <p class="item-p">{{ trayek.rute }}</p>
            </div>
          </ion-item>
          <ion-item>
            <div class="flex-col">
              <h2>Rute Berangkat</h2>
              <p class="item-p">{{ trayek.ruteBerangkat }}</p>
            </div>
          </ion-item>
          <ion-item>
            <div class="flex-col">
              <h2>Rute Kembali</h2>
              <p class="item-p">{{ trayek.ruteKembali }}</p>
            </div>
          </ion-item>
        </ion-card-content>
      </ion-card>
    </template>
  </app-layout>
</template>

<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth } from '@/stores'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
} from '@ionic/vue'

const { authAngkot: angkot } = useAuth()
const trayek = angkot.trayek
</script>

<style scoped>
.nowrap {
  white-space: pre;
}

.flex-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.item-p {
  color: var(--ion-color-step-600, #666666);
}
</style>
