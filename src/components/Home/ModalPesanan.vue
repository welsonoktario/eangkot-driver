<template>
  <modal-layout title="Pesanan" @start-click="close()">
    <template #content>
      <ion-list inset lines="inset">
        <ion-item
          v-for="p in pesanan.pesanans"
          :key="p.docId"
          button
          detail
          @click="openModalDetail(p)"
        >
          <ion-label>
            <h2>{{ p.user.nama }}</h2>
            <p>{{ tanggal(p.timestamp) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import ModalLayout from '@/layouts/ModalLayout.vue'
import { usePesanan } from '@/stores'
import { PesananFB as Pesanan } from '@/types'
import { Timestamp } from '@firebase/firestore'
import { IonItem, IonLabel, IonList, modalController } from '@ionic/vue'
import ModalDetailPesanan from './ModalDetailPesanan.vue'

const pesanan = usePesanan()

const close = async () => await modalController.dismiss()

const openModalDetail = async (p: Pesanan) => {
  const modal = await modalController.create({
    id: 'modal-detail-pesanan',
    component: ModalDetailPesanan,
    componentProps: {
      pesanan: p,
    },
  })

  await modal.present()
}

const tanggal = (timestamp: Timestamp) =>
  timestamp.toDate().toLocaleTimeString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
</script>
