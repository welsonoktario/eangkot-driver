<template>
  <modal-layout title="Riwayat" @start-click="back()">
    <template #content>
      <ion-list v-if="pesanans.length" lines="none" class="h-full">
        <card-riwayat
          v-for="item in pesanans"
          @click="detail(item.id)"
          :transaksi="item.transaksi"
          :key="item.id"
        />
      </ion-list>

      <div v-else-if="loading" class="spin">
        <ion-spinner></ion-spinner>
      </div>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import CardRiwayat from '@/components/Statistik/CardRiwayat.vue'
import ModalDetailRiwayat from '@/components/Statistik/ModalDetailRiwayat.vue'
import ModalLayout from '@/layouts/ModalLayout.vue'
import { Pesanan } from '@/types'
import { get } from '@/utils/http'
import { IonList, IonSpinner, modalController } from '@ionic/vue'
import { onMounted, ref } from 'vue'

const loading = ref(true)
const pesanans = ref<Pesanan[]>([])

onMounted(async () => {
  await loadPesanan()
})

const back = async () => await modalController.dismiss()

const loadPesanan = async () => {
  try {
    const res = await get('driver/pesanan')
    const { data } = await res.data
    console.log(data)
    loading.value = false
  } catch (e: any) {
    console.log(e)
  }
}

const detail = async (id: number) => {
  const modal = await modalController.create({
    component: ModalDetailRiwayat,
    componentProps: {
      id,
    },
    breakpoints: [0, 0.75, 1],
    initialBreakpoint: 0.75,
  })

  await modal.present()
}
</script>

<style scoped>
.h-full {
  height: 100%;
}
</style>
