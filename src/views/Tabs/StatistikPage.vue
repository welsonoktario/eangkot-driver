<template>
  <app-layout>
    <template #header>
      <app-bar title="Statistik" />
    </template>

    <template #content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Pendapatan</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label>Pilih durasi:</ion-label>
            <ion-select
              interface="popover"
              placeholder="Durasi"
              :value="durasi.toString()"
              @ion-change="handleDurasiChange($event.detail.value)"
            >
              <ion-select-option value="3" selected
                >3 hari terakhir</ion-select-option
              >
              <ion-select-option value="7">7 hari terakhir</ion-select-option>
              <ion-select-option value="30">30 hari terakhir</ion-select-option>
            </ion-select>
          </ion-item>

          <Line
            v-if="!loading"
            class="ion-margin"
            ref="chart"
            :chart-data="chartData"
            :chart-options="chartOptions"
          />
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Riwayat Perjalanan</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list v-if="pesanans.length">
            <list-riwayat
              v-for="pesanan in pesanans"
              :key="`pesanan-${pesanan.id}`"
              :pesanan="pesanan"
            />
            <ion-item
              v-if="pesanans.length > 5"
              detail
              button
              @click="openModalListRiwayat()"
            >
              <p class="ion-text-center">Lihat lebih lengkap</p>
            </ion-item>
          </ion-list>
          <p v-else class="ion-text-center ion-margin-vertical">
            Belum ada riwayat
          </p>
        </ion-card-content>
      </ion-card>
    </template>
  </app-layout>
</template>

<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
import ListRiwayat from '@/components/Statistik/ListRiwayat.vue'
import ModalListRiwayat from '@/components/Statistik/ModalListRiwayat.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { Pesanan } from '@/types'
import { get } from '@/utils/http'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSelect,
  IonSelectOption,
  modalController,
} from '@ionic/vue'
import 'chart.js/auto'
import { onMounted, ref } from 'vue'
import { Line } from 'vue-chartjs'

const loading = ref(true)
const durasi = ref(3)
const pesanans = ref<Pesanan[]>([])
const chart = ref()
const chartData = ref()
const chartOptions: any = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  scales: {
    ongkos: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: '#8c8c8c',
      },
      ticks: {
        color: '#8c8c8c',
        major: {
          enabled: true,
        },
      },
    },
    jumlah: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: '#666666',
        major: {
          enabled: true,
        },
      },
    },
    x: {
      grid: {
        color: '#8c8c8c',
      },
    },
  },
}

const loadStatistik = async () => {
  loading.value = true
  const res = await get('driver/statistik?durasi=' + durasi.value)
  const { data } = res
  const total = []
  const jumlah = []

  pesanans.value = data.pesanans

  for (const tanggal in data.transaksis) {
    const transaksi = data.transaksis[tanggal]
    total.push(transaksi.total)
    jumlah.push(transaksi.transaksi)
  }

  chartData.value = {
    labels: ['Pendapatan', 'Jumlah Pesanan'],
    datasets: [
      {
        label: 'Pendapatan',
        data: total,
        yAxisID: 'ongkos',
        pointBackgroundColor: '#36817b',
        borderColor: '#4a8e88',
      },
      {
        label: 'Jumlah Transaksi',
        data: jumlah,
        yAxisID: 'jumlah',
        pointBackgroundColor: '#6a64ff',
        borderColor: '#7974ff',
      },
    ],
  }

  loading.value = false
  console.log(chart.value)
}

const handleRefresh = async (event: any) => {
  await loadStatistik()
  event.target.complete()
}

const handleDurasiChange = async (selectedDurasi: number) => {
  durasi.value = selectedDurasi
  await loadStatistik()
}

const openModalListRiwayat = async () => {
  const modal = await modalController.create({
    component: ModalListRiwayat,
  })

  await modal.present()
}

onMounted(async () => await loadStatistik())
</script>
