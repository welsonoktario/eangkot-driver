<template>
  <IonPage>
    <IonHeader
      v-if="!fullscreen"
      :collapse="largeTitle ? 'fade' : null"
      :translucent="largeTitle"
    >
      <IonToolbar>
        <slot name="header">
          <IonTitle> {{ title }} </IonTitle>
        </slot>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonHeader v-if="largeTitle" collapse="condense">
        <IonToolbar>
          <IonTitle size="large">{{ title }}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <slot name="content"></slot>
    </IonContent>

    <IonFooter v-if="slots['footer']">
      <slot name="footer"></slot>
    </IonFooter>
  </IonPage>
</template>

<script lang="ts" setup>
import { useSlots } from "vue";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonFooter,
  IonToolbar,
  IonTitle,
} from "@ionic/vue";

defineProps({
  title: String,
  largeTitle: Boolean,
  fullscreen: Boolean,
});

const slots = useSlots();
</script>

<style>
.md ion-toolbar {
  --ion-background-color: var(--ion-color-primary);
}

.md ion-toolbar ion-title {
  --color: var(--ion-color-primary-contrast);
}

.md ion-toolbar ion-buttons ion-button {
  --color: var(--ion-color-primary-contrast) !important;
}

.ios ion-toolbar ion-buttons ion-button {
  --color: var(--ion-color-medium) !important;
}

.md ion-toolbar ion-buttons ion-back-button {
  --color: var(--ion-color-primary-contrast) !important;
}
</style>
