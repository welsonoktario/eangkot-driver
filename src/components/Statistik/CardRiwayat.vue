<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Transaksi #{{ transaksi.id }}</ion-card-title>
    </ion-card-header>
    <ion-card-content> Tanggal: {{ transaksi.tanggal }} </ion-card-content>
  </ion-card>
</template>

<script lang="ts" setup>
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/vue'

defineProps({
  transaksi: {
    type: Object,
    required: true,
  },
})
</script>
