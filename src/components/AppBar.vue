<template>
  <div class="app-bar">
    <div class="app-bar-start">
      <slot name="start" v-if="slots.start"></slot>
    </div>
    <IonText class="app-bar-title">{{ title }}</IonText>
    <div class="app-bar-end">
      <slot name="end" v-if="slots.end"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IonText } from "@ionic/vue";
import { useSlots } from "vue";

const slots = useSlots();
defineProps({
  title: String,
});
</script>

<style scoped>
.app-bar {
  font-family: "Roboto Serif";
  font-weight: 600;
  display: inline-flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  color: var(--ion-color-primary);
  min-height: 56px;
  padding: 8px 8px 8px 8px;
  background: #fff;
}

@media (prefers-color-scheme: dark) {
  .app-bar {
    font-family: "Roboto Serif";
    font-weight: 600;
    display: inline-flex;
    width: 100%;
    align-items: center;
    gap: 8px;
    color: var(--ion-color-primary);
    min-height: 56px;
    padding: 8px 8px 8px 8px;
    background: #212121;
  }
}

.app-bar-start {
}

.app-bar-title {
  font-size: x-large;
  flex: 1;
  letter-spacing: -0.05rem;
}

.app-bar-end {
}
</style>
