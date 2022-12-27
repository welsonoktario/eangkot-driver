<template>
  <modal-layout title="Detail Penumpang" @start-click="close()">
    <template #content>
      <div class="flex-col fill-container">
        <map-box
          @route-loaded="onRouteLoaded"
          :jemput="penumpang.jemput"
          :tujuan="penumpang.tujuan"
        />
        <ion-modal
          id="modal-sheet-detail"
          ref="modalDetail"
          :is-open="true"
          :initial-breakpoint="0.35"
          :breakpoints="[0.1, 0.35]"
          :backdrop-dismiss="false"
          :backdrop-breakpoint="0.5"
        >
          <ion-content class="ion-padding">
            <h3>Detail Penumpang</h3>

            <ion-item>
              <ion-label>Nama</ion-label>
              <p slot="end">{{ penumpang.user.nama }}</p>
            </ion-item>
            <ion-item>
              <ion-label>Jarak</ion-label>
              <p slot="end">{{ distance }}</p>
            </ion-item>
            <ion-item>
              <ion-label>Perkiraan waktu</ion-label>
              <p slot="end">{{ duration }}</p>
            </ion-item>
            <div class="ion-margin-top">
              <e-a-button
                @click="
                  penumpang.status == StatusPesanan.PROCESS
                    ? selesaiPenumpang()
                    : prosesPenumpang()
                "
                expand="block"
              >
                {{
                  penumpang.status == StatusPesanan.PROCESS
                    ? 'Selesai'
                    : 'Proses'
                }}
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
import { inject, ref } from 'vue'

type PenumpangDetailProps = {
  penumpang: Pesanan
}

const props = defineProps<PenumpangDetailProps>()
const db: Firestore = inject('db')
const { authAngkot, authDocId } = useAuth()
const penumpangs = usePenumpangs()
const modalDetail = ref()
const routeDetail = ref()

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

const prosesPenumpang = async () => {
  const docPath = `angkots-${authAngkot.trayek.kode}/${authAngkot.docId}/penumpangs/${props.penumpang.docId}`
  const docRef = doc(db, docPath)

  await updateDoc(docRef, {
    status: StatusPesanan.PROCESS,
  })

  penumpangs.updatePenumpang(props.penumpang, StatusPesanan.PROCESS)

  await close()
}

const selesaiPenumpang = async () => {
  const docPath = `angkots-${authAngkot.trayek.kode}/${authAngkot.docId}/penumpangs/${props.penumpang.docId}`
  const docRef = doc(db, docPath)

  await updateDoc(docRef, {
    status: StatusPesanan.DONE,
  })

  penumpangs.removePenumpang(props.penumpang)

  await close()
}

const close = async () => {
  await modalController.dismiss(null, null, 'modal-sheet-detail')
  await modalController.dismiss(null, null, 'modal-detail-penumpang')
}
</script>

<style scoped>
.flex-col {
  display: flex;
  flex-direction: column;
}

.fill-container {
  height: 100%;
  width: 100%;
}
</style>
