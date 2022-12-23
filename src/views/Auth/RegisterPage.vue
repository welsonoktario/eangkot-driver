<template>
  <AppLayout>
    <template #header>
      <AppBar title="Daftar Akun">
        <template #start>
          <IonButtons>
            <IonBackButton></IonBackButton>
          </IonButtons>
        </template>
      </AppBar>
    </template>

    <template #content>
      <ion-list inset>
        <ion-item>
          <ion-label position="floating">Nama</ion-label>
          <ion-input
            required
            type="text"
            autocomplete="name"
            placeholder="Nama"
            v-model="nama"
          ></ion-input>
        </ion-item>
      </ion-list>
    </template>

    <template #footer>
      <e-a-button
        @click="register()"
        class="ion-margin"
        expand="block"
        color="primary"
        :disabled="nama ? false : true"
      >
        Daftar
      </e-a-button>
    </template>
  </AppLayout>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'
import EAButton from '@/components/EAButton.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth } from '@/stores/auth'
import { User } from '@/types/user'
import { showDialog } from '@/utils'
import {
  IonBackButton,
  IonButtons,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  useIonRouter,
} from '@ionic/vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const ionRouter = useIonRouter()
const auth = useAuth()

const { phone } = route.params
const nama = ref('')

const register = async () => {
  try {
    const res = await auth.register(nama.value, phone.toString())
    const data = await res.data

    if (data.status == 'OK') {
      await auth.setAuthUser(data.data.user as User, data.data.token)
      ionRouter.push('/auth/pengajuan')
    } else if (data.status == 'FAIL') {
      await showDialog({
        title: 'Error',
        message: data.msg,
      })
    }
  } catch (e: any) {
    console.log(e)
    await showDialog({
      title: 'Error',
      message: 'Terjadi kesalahan sistem. Silahkan coba lagi nanti',
    })
  }
}
</script>
