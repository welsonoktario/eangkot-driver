<template>
  <modal-layout title="Detail Pesanan" @start-click="close()">
    <template #content>
      <div class="flex-col fill-container">
        <map-box
          @route-loaded="onRouteLoaded"
          :jemput="pesanan.jemput"
          :tujuan="pesanan.tujuan"
        />
        <ion-modal
          id="modal-sheet-detail"
          ref="modalDetail"
          :is-open="true"
          :initial-breakpoint="0.35"
          :breakpoints="[0.1, 0.35, 1]"
          :backdrop-dismiss="false"
          :backdrop-breakpoint="0.5"
        >
          <ion-content class="ion-padding">
            <h3>Detail Pesanan</h3>

            <ion-item>
              <ion-label>Nama</ion-label>
              <p slot="end">{{ pesanan.user.nama }}</p>
            </ion-item>
            <ion-item :href="whatsAppUrl" button detail>
              <ion-icon :icon="logoWhatsapp" color="primary" slot="start" />
              <ion-label>No. HP</ion-label>
              <p>{{ pesanan.user.noHp }}</p>
            </ion-item>
            <ion-item>
              <ion-label>Jarak</ion-label>
              <p slot="end">{{ distance }}</p>
            </ion-item>
            <ion-item>
              <ion-label>Perkiraan waktu</ion-label>
              <p slot="end">{{ duration }}</p>
            </ion-item>
            <div class="ion-margin-top flex-row justify-between">
              <e-a-button
                class="flex-grow"
                color="danger"
                fill="clear"
                @click="handlePesanan(StatusPesanan.CANCEL)"
              >
                Tolak
              </e-a-button>
              <e-a-button
                class="flex-grow"
                @click="handlePesanan(StatusPesanan.ACCEPT)"
              >
                Terima
              </e-a-button>
            </div>
          </ion-content>
        </ion-modal>
      </div>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import EAButton from '@/components/EAButton.vue'
import MapBox from '@/components/MapBox.vue'
import ModalLayout from '@/layouts/ModalLayout.vue'
import { useAuth, usePenumpangs } from '@/stores'
import { PesananFB as Pesanan, StatusPesanan } from '@/types'
import { forHumans } from '@/utils/dateUtil'
import { doc, Firestore, updateDoc } from '@firebase/firestore'
import {
  IonContent,
  IonItem,
  IonLabel,
  IonModal,
  modalController,
} from '@ionic/vue'
import { computed } from '@vue/reactivity'
import { logoWhatsapp } from 'ionicons/icons'
import { inject, ref } from 'vue'

type PesananDetailProps = {
  pesanan: Pesanan
}

const props = defineProps<PesananDetailProps>()
const db: Firestore = inject('db')
const { authAngkot, authDocId } = useAuth()
const penumpangs = usePenumpangs()
const modalDetail = ref()
const routeDetail = ref()

const whatsAppUrl = computed(() => {
  const number = props.pesanan.user?.noHp.replace('0', '+62')

  return `whatsapp://send?phone=${number}`
})

const distance = computed(
  () =>
    routeDetail.value && (routeDetail.value.distance / 1000).toFixed(2) + ' km'
)

const duration = computed(
  () => routeDetail.value && forHumans(routeDetail.value.duration)
)

const onRouteLoaded = (route: any) => {
  routeDetail.value = route
}

const handlePesanan = async (aksi: StatusPesanan) => {
  const docPath = `angkots-${authAngkot.trayek.kode}/${authDocId}/penumpangs/${props.pesanan.docId}`
  const docRef = doc(db, docPath)

  await updateDoc(docRef, {
    status: aksi,
  })

  // aksi == StatusPesanan.ACCEPT && penumpangs.addPenumpang(props.pesanan)

  await close()
}

const close = async () => {
  await modalController.dismiss(null, null, 'modal-sheet-detail')
  await modalController.dismiss(null, null, 'modal-detail-pesanan')
}
</script>

<style scoped>
.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.flex-grow {
  flex-grow: 1;
}

.fill-container {
  height: 100%;
  width: 100%;
}

.justify-between {
  justify-content: space-between;
}
</style>
