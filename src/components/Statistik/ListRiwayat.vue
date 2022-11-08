<template>
  <ion-item detail button @click="openModalDetail">
    <ion-label slot="start">Transakasi #{{ pesanan.transaksi.id }}</ion-label>
    <ion-label slot="end">Tanggal: {{ pesanan.transaksi.tanggal }}</ion-label>
  </ion-item>
</template>

<script setup lang="ts">
import { Pesanan } from '@/types'
import { IonItem, IonLabel, modalController } from '@ionic/vue'
import ModalDetailRiwayat from './ModalDetailRiwayat.vue'

type ListRiwayatProps = {
  pesanan: Pesanan
}

const props = defineProps<ListRiwayatProps>()

const openModalDetail = async () => {
  const modal = await modalController.create({
    component: ModalDetailRiwayat,
    componentProps: props,
  })

  await modal.present()
}
</script>
