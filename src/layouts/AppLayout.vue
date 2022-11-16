<template>
  <ion-page>
    <ion-header
      class="ion-no-border"
      :class="{ 'bg-transparent': transparent }"
    >
      <slot name="header"> </slot>
    </ion-header>

    <ion-content>
      <slot name="content"></slot>
    </ion-content>

    <ion-footer v-if="slots['footer']">
      <slot name="footer"></slot>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonContent, IonFooter, IonHeader, IonPage } from '@ionic/vue'
import { useSlots } from 'vue'

defineProps({
  transparent: Boolean,
})

const slots = useSlots()
</script>

<style lang="scss">
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

ion-header.bg-transparent {
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  .app-bar {
    background: transparent;

    .app-bar-start > ion-back-button {
      --background: #fff;
    }
  }
}

@media (prefers-color-scheme: dark) {
  ion-header.bg-transparent {
    background: transparent;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    .app-bar {
      background: transparent;

      .app-bar-start > ion-back-button {
        --background: #212121;
      }
    }
  }
}
</style>
