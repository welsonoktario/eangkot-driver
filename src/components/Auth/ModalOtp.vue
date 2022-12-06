<template>
  <modal-layout title="OTP" @start-click="closeModal(false)">
    <template #content>
      <ion-label>Kode OTP</ion-label>
      <div style="display: flex; flex-direction: row; width: 100%">
        <v-otp-input
          ref="pin"
          separator="-"
          :num-inputs="4"
          :should-auto-focus="true"
          :is-input-num="true"
          :placeholder="['*', '*', '*', '*']"
          @on-complete="handleOnComplete"
        />
      </div>
    </template>

    <template #footer>
      <e-a-button @click="checkOtp()" class="ion-margin" expand="block">
        Lanjut
      </e-a-button>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import EAButton from '@/components/EAButton.vue'
import ModalLayout from '@/layouts/ModalLayout.vue'
import { useAuth } from '@/stores'
import { showDialog } from '@/utils'
import { IonLabel, modalController } from '@ionic/vue'
import { onMounted, ref } from 'vue'
import VOtpInput from 'vue3-otp-input'

const auth = useAuth()

const props = defineProps({
  phone: {
    type: String,
    required: true,
  },
})

const pin = ref('')

onMounted(() => requestOtp())

const handleOnComplete = (value: string) => {
  pin.value = value
}

const closeModal = (data: any) => modalController.dismiss(data)

const requestOtp = async () => await auth.requestOTP(props.phone)

const checkOtp = async () => {
  const res = await auth.checkOTP(props.phone, pin.value)
  const data = await res.data

  if (data.msg) {
    await modalController.dismiss(true)
  } else {
    await showDialog({
      title: 'Error',
      message: 'Kode OTP tidak cocok',
    })
  }
}
</script>
