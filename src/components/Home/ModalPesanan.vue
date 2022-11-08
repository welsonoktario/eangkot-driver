<template>
  <modal-layout title="Pesanan" @start-click="close()">
    <template #content>
      <ion-list inset lines="inset">
        <ion-item
          v-for="p in pesanan.pesanans"
          :key="p.docId"
          button
          detail
          color="light"
          @click="openModalDetail(p)"
        >
          <ion-label>
            <h2>{{ p.user.nama }}</h2>
            <p>{{ p.docId }}</p>
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
import { IonItem, IonLabel, IonList, modalController } from '@ionic/vue'
import ModalDetailPesanan from './ModalDetailPesanan.vue'

const pesanan = usePesanan()

const close = async () => await modalController.dismiss()

const openModalDetail = async (p: Pesanan) => {
  const modal = await modalController.create({
    component: ModalDetailPesanan,
    componentProps: {
      pesanan: p,
    },
  })

  await modal.present()
}
</script>
