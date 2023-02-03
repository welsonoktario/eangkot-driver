<template>
  <app-layout>
    <template #header>
      <app-bar title="Penumpang" />
    </template>

    <template #content>
      <ion-list inset lines="inset">
        <ion-item
          v-for="penumpang in penumpangs"
          :key="`penumpang-${penumpang.docId}`"
          @click="openModalDetail(penumpang)"
          button
          detail
        >
          <ion-label>
            <h2>{{ penumpang.user.nama }}</h2>
            <p>{{ tanggal(penumpang.timestamp) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </template>
  </app-layout>
</template>

<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
import ModalDetailPenumpang from '@/components/Penumpang/ModalDetailPenumpang.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { usePenumpangs } from '@/stores'
import { PesananFB as Pesanan } from '@/types'
import { Timestamp } from '@firebase/firestore'
import { IonItem, IonLabel, IonList, modalController } from '@ionic/vue'

const { penumpangs } = usePenumpangs()

const openModalDetail = async (penumpang: Pesanan) => {
  const modal = await modalController.create({
    id: 'modal-detail-penumpang',
    component: ModalDetailPenumpang,
    componentProps: {
      penumpang,
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
