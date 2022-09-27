<template>
  <ion-header class="ion-no-border">
    <app-bar :title="title">
      <template #start>
        <e-a-buttons>
          <e-a-button class="ion-no-padding" fill="clear" @click="onStartClick">
            <ion-icon
              slot="icon-only"
              color="primary"
              :icon="closeOutline"
            ></ion-icon>
          </e-a-button>
        </e-a-buttons>
      </template>

      <template #end v-if="endIcon">
        <e-a-button @click="onEndClick">
          <ion-icon slot="icon-only" color="primary" :icon="endIcon"></ion-icon>
        </e-a-button>
      </template>
    </app-bar>

    <slot name="header" v-if="slots.header" />
  </ion-header>

  <ion-content>
    <slot name="content" />
  </ion-content>

  <ion-footer v-if="slots.footer">
    <slot name="footer" />
  </ion-footer>
</template>

<script lang="ts" setup>
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
} from '@ionic/vue'
import { closeOutline } from 'ionicons/icons'
import { useSlots } from 'vue'
import AppBar from './AppBar.vue'
import EAButton from "@/components/EAButton.vue";

defineProps({
  title: String,
  startIcon: {
    type: String,
    default: closeOutline,
  },
  endIcon: String,
})

const emits = defineEmits<{
  (e: 'startClick', params?: any): void
  (e: 'endClick', params?: any): void
}>()

const slots = useSlots()

const onStartClick = (params: any) => emits('startClick', params)
const onEndClick = (params: any) => emits('endClick', params)
</script>