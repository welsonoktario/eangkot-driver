<template>
  <modal-layout title="Detail Riwayat" @start-click="back()">
    <template #content>
      <ion-list inset>
        <ion-list-header>
          <ion-label>Detail Pesanan</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-icon slot="start" :md="calendar" :ios="calendarOutline"></ion-icon>
          <ion-label>{{ transaksi.tanggal }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :md="person" :ios="personOutline"></ion-icon>
          <ion-label>{{ authUser.nama }}, {{ authAngkot.noKendaraan }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :md="car" :ios="carOutline"></ion-icon>
          <ion-label>{{ authAngkot.trayek.kode }}</ion-label>
        </ion-item>

        <ion-list-header>
          <ion-label>Detail Transaksi</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-icon slot="start" :md="calendar" :ios="calendarOutline"></ion-icon>
          <ion-label>{{ transaksi.tanggal }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :md="cash" :ios="cashOutline"></ion-icon>
          <ion-label>{{ ongkos }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :md="time" :ios="timeOutline"></ion-icon>
          <ion-label>{{ durasi }}</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" :md="map" :ios="mapOutline"></ion-icon>
          <ion-label>{{ transaksi.jarakPerjalanan }} km</ion-label>
        </ion-item>
        <ion-list-header>
          <ion-label>Rating dan Komentar</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-icon slot="start" :md="star" :ios="starOutline"></ion-icon>
          <ion-label>{{
            transaksi.ulasan ? transaksi.ulasan.rating : "Belum ada rating"
          }}</ion-label>
        </ion-item>
        <ion-item class="ion-margin-bottom item-input">
          <ion-label position="stacked">Komentar</ion-label>
          <ion-textarea
            placeholder="Berikan komentar"
            :rows="3"
            :autoGrow="true"
            :value="transaksi.ulasan ? transaksi.ulasan.komentar : 'Tidak ada komentar'"
            :readonly="true"
          ></ion-textarea>
        </ion-item>
      </ion-list>
    </template>
  </modal-layout>
</template>

<script lang="ts" setup>
import ModalLayout from "@/layouts/ModalLayout.vue";
import { useAuth } from "@/stores";
import { Transaksi } from "@/types";
import { rupiah } from "@/utils";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonTextarea,
  modalController,
} from "@ionic/vue";
import {
  calendar,
  calendarOutline,
  car,
  carOutline,
  cash,
  cashOutline,
  map,
  mapOutline,
  person,
  personOutline,
  star,
  starOutline,
  time,
  timeOutline,
} from "ionicons/icons";
import { computed, ref } from "vue";

type ModalDetailRiwayatProps = {
  transaksi: Transaksi;
};

const { authUser, authAngkot } = useAuth();

const props = defineProps<ModalDetailRiwayatProps>();

const ongkos = computed(() => rupiah(props.transaksi.ongkos));
const durasi = computed(() => {
  const d = props.transaksi.durasiPerjalanan;
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? h + " jam " : "";
  const mDisplay = m > 0 ? m + " menit " : "";
  const sDisplay = s > 0 ? s + " detik" : "";

  return hDisplay + mDisplay + sDisplay;
});
const isModalRatingOpen = ref(false);

const back = async () => await modalController.dismiss();
</script>

<style scoped>
.md .item-input {
  margin: 0 16px 0 16px;
}

.select-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
