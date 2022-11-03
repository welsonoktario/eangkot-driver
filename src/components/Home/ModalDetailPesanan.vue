<template>
  <modal-layout title="Detail Pesanan" @start-click="close()">
    <template #content>
      {{ pesanan.docId }}
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import ModalLayout from '@/components/ModalLayout.vue'
import { usePesanan } from '@/stores'
import { Pesanan } from '@/types'
import { modalController } from '@ionic/vue'

type PesananDetailProps = {
  pesanan: Pesanan
}

const props = defineProps<PesananDetailProps>()
const pesananStore = usePesanan()

const close = async () => await modalController.dismiss()
</script>
