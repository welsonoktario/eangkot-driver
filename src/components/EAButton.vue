<template>
  <ion-button
    :fill="fill ?? 'solid'"
    :expand="expand"
    :color="color ?? 'primary'"
    class="btn"
  >
    <slot />
  </ion-button>
</template>

<script lang="ts" setup>
import { IonButton } from "@ionic/vue";

type ButtonProps = {
  fill?: "clear" | "outline" | "solid";
  expand?: "block" | "full" | undefined;
  icon?: string;
  color?: "primary" | "success" | "warning" | "danger";
};

defineProps<ButtonProps>();
</script>

<style lang="scss" scoped>
.btn {
  --border-radius: 999px;
  text-transform: none;
  letter-spacing: 0.02rem;
  font-weight: 500;
  font-size: medium;
}
</style>
