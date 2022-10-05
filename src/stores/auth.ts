import { Angkot } from '@/types'
import { User } from '@/types/user'
import { patch, post } from '@/utils/http'
import { Preferences } from '@capacitor/preferences'
import { DocumentData, QueryDocumentSnapshot } from '@firebase/firestore'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

type AuthState = {
  user: User | undefined
  driver: number | undefined
  token: string | undefined
  angkot: Angkot | undefined
  docRef: QueryDocumentSnapshot<DocumentData> | undefined
}

export const useAuth = defineStore('auth', {
  state: () =>
    reactive({
      user: undefined,
      driver: undefined,
      token: undefined,
      angkot: undefined,
      docRef: undefined,
    } as AuthState),
  getters: {
    authUser: (state) => state.user,
    authToken: (state) => state.token,
    authDriver: (state) => state.driver,
    authAngkot: (state) => state.angkot,
    angkotDocRef: (state) => state.docRef,
  },
  actions: {
    setAngkotDoc(doc: QueryDocumentSnapshot<DocumentData>) {
      this.docRef = doc
    },
    async setAuthUser(data: any, token: string = null) {
      this.user = data.user
      this.driver = data.user.driver.id
      this.angkot = data.user.driver.angkot

      await Preferences.remove({ key: 'user' })
      await Preferences.remove({ key: 'driver' })
      await Preferences.remove({ key: 'angkot' })

      await Preferences.set({ key: 'user', value: JSON.stringify(this.user) })
      await Preferences.set({ key: 'driver', value: this.driver.toString() })
      await Preferences.set({
        key: 'angkot',
        value: JSON.stringify(this.angkot),
      })

      if (token) {
        await Preferences.remove({ key: 'token' })
        this.token = token
        await Preferences.set({ key: 'token', value: token })
      }
    },
    async checkAuth() {
      const user = await Preferences.get({ key: 'user' })
      const token = await Preferences.get({ key: 'token' })
      const driver = await Preferences.get({ key: 'driver' })
      const angkot = await Preferences.get({ key: 'angkot' })

      if (
        user.value &&
        user.value != 'null' &&
        token.value &&
        token.value != 'null' &&
        driver.value &&
        driver.value != 'null' &&
        angkot.value &&
        angkot.value != 'null'
      ) {
        this.user = JSON.parse(user.value)
        this.token = token.value
        this.driver = driver.value
        this.angkot = JSON.parse(angkot.value)

        return true
      }

      return false
    },
    async login(phone: string) {
      return await post('auth/login', { phone, driver: true })
    },
    async requestOTP(phone: string) {
      return await post('auth/request-otp', { phone })
    },
    async checkOTP(phone: string, pin: string) {
      return await post('auth/check-otp', { phone, pin })
    },
    async register(nama: string, phone: string) {
      return await post('auth/register', { nama, phone })
    },
    async ubahProfil(data: object) {
      return await patch(`user/${this.authUser.id}`, data)
    },
    async ubahPassword(data: object) {
      return await patch(`user/${this.authUser.id}/ubah-password`, data)
    },
    async logout() {
      this.user = undefined
      this.token = undefined
      await Preferences.clear()
    },
  },
})
