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
          button
          detail
          @click="openModalDetail(penumpang)"
        >
          <ion-label>
            <h2>{{ penumpang.user.nama }}</h2>
            <p>{{ penumpang.docId }}</p>
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
</script>
