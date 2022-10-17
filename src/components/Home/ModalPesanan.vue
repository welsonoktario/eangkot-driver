<template>
  <modal-layout title="Pesanan" @start-click="close()">
    <template #content> Hi </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import ModalLayout from '@/components/ModalLayout.vue'
import { modalController } from '@ionic/vue'

const close = async () => await modalController.dismiss()
</script>
