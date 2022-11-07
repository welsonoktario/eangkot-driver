<template>
  <app-layout>
    <template #header>
      <app-bar title="Statistik" />
    </template>

    <template #content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <Line
        v-if="!loading"
        class="ion-margin"
        ref="chart"
        :chart-data="chartData"
        :chart-options="chartOptions"
      />
    </template>
  </app-layout>
</template>

<script setup lang="ts">
import AppBar from '@/components/AppBar.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { get } from '@/utils/http'
import { IonRefresher, IonRefresherContent } from '@ionic/vue'
import 'chart.js/auto'
import { onMounted, ref } from 'vue'
import { Line } from 'vue-chartjs'

const loading = ref(true)
const chart = ref()
const chartData = ref()
const chartOptions = {
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
  const res = await get('driver/statistik')
  const { data } = res
  const total = []
  const jumlah = []

  for (const tanggal in data) {
    const transaksi = data[tanggal]
    total.push(transaksi.total)
    jumlah.push(transaksi.transaksi)
  }

  console.log(total, jumlah)

  chartData.value = {
    labels: Object.keys(data),
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
}

const handleRefresh = async (event: any) => {
  await loadStatistik()
  event.target.complete()
}

onMounted(async () => await loadStatistik())
</script>
