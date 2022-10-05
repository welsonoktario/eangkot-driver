import { Angkot } from '@/types'
import { User } from '@/types/user'
import { patch, post } from '@/utils/http'
import { Preferences } from '@capacitor/preferences'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

type AuthState = {
  user: User | undefined
  driver: number | undefined
  token: string | undefined
  angkot: Angkot | undefined
  docId: string
}

export const useAuth = defineStore('auth', {
  state: () =>
    reactive({
      user: undefined,
      driver: undefined,
      token: undefined,
      angkot: undefined,
      docId: '',
    } as AuthState),
  getters: {
    authUser: (state) => state.user,
    authToken: (state) => state.token,
    authDriver: (state) => state.driver,
    authAngkot: (state) => state.angkot,
    authDocId: (state) => state.docId,
  },
  actions: {
    setAngkotDocId(id: string) {
      this.docId = id
      Preferences.remove({ key: 'docId' })
      Preferences.set({ key: 'docId', value: id })
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
        this.token = token
        await Preferences.remove({ key: 'token' })
        await Preferences.set({ key: 'token', value: token })
      }
    },
    async checkAuth() {
      let isAuthenticated = true
      const keys = ['user', 'token', 'driver', 'angkot']
      const preferences = [
        Preferences.get({ key: 'user' }),
        Preferences.get({ key: 'token' }),
        Preferences.get({ key: 'driver' }),
        Preferences.get({ key: 'angkot' }),
      ]

      const prefValues = await Promise.all(preferences)

      prefValues.forEach((res, i) => {
        if (res.value && res.value !== 'null') {
          const key = keys[i]
          if (key === 'user' || key === 'angkot') {
            this[key] = JSON.parse(res.value)
          } else {
            this[key] = res.value
          }
        } else {
          isAuthenticated = false
        }
      })

      const { value } = await Preferences.get({ key: 'docId' })

      if (value) {
        this.docId = value
      }

      return isAuthenticated
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
