<template>
  <app-layout>
    <template #header>
      <app-bar title="Angkot" />
    </template>

    <template #content>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Detail Angkot</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonLabel>Gambar Angkot</IonLabel>
          <img class="ion-margin-top" :src="trayek.gambar" :alt="trayek.kode" />
          <IonItem>
            <IonLabel slot="start">No. Kendaraan</IonLabel>
            <IonLabel slot="end">{{ angkot.noKendaraan }}</IonLabel>
          </IonItem>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Detail Trayek</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonLabel slot="start">Kode Trayek</IonLabel>
            <IonLabel slot="end">{{ trayek.kode }}</IonLabel>
          </IonItem>
          <IonItem>
            <div class="flex-col">
              <h2>Rute</h2>
              <p class="item-p">{{ trayek.rute }}</p>
            </div>
          </IonItem>
          <IonItem>
            <div class="flex-col">
              <h2>Rute Berangkat</h2>
              <p class="item-p">{{ trayek.ruteBerangkat }}</p>
            </div>
          </IonItem>
          <IonItem>
            <div class="flex-col">
              <h2>Rute Kembali</h2>
              <p class="item-p">{{ trayek.rutePulang }}</p>
            </div>
          </IonItem>
        </IonCardContent>
      </IonCard>
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
