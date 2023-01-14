import { patch, post } from '@/lib/http'
import { Angkot } from '@/types'
import { User } from '@/types/user'
import { Preferences } from '@capacitor/preferences'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

type AuthState = {
  user: User | undefined
  token: string | undefined
  driver: number | undefined
  rating: number | null
  angkot: Angkot | undefined
  docId: string
}

export enum AuthStatus {
  NOT_LOGGED_ID = 'not-logged-in',
  LOGGED_ID = 'logged-id',
  PENGAJUAN = 'pengajuan',
}

export const useAuth = defineStore('auth', {
  state: () =>
    reactive({
      user: undefined,
      token: undefined,
      driver: undefined,
      rating: null,
      angkot: undefined,
      docId: '',
    } as AuthState),
  persist: true,
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
    },
    async setAuthUser(user: any, token: string = null, rating: number = null) {
      this.user = user
      this.rating = rating

      await Preferences.remove({ key: 'user' })
      await Preferences.set({ key: 'user', value: JSON.stringify(this.user) })

      if (user.driver) {
        this.driver = user.driver?.id
        this.angkot = user.driver?.angkot
        this.docId = user.driver?.angkot?.docId
      }

      if (token) {
        this.token = token

        await Preferences.remove({ key: 'token' })
        await Preferences.set({ key: 'token', value: token })
      }
    },
    async checkAuthStatus() {
      const authStatus = {
        user: AuthStatus.LOGGED_ID,
        driver: AuthStatus.LOGGED_ID,
      }

      const keys = ['user', 'token']

      const userPrefs = await Promise.all([
        Preferences.get({ key: 'user' }),
        Preferences.get({ key: 'token' }),
      ])

      userPrefs.forEach((pref, i) => {
        const { value } = pref
        const key = keys[i]

        if (value && value !== 'null') {
          key === 'user' ? (this[key] = JSON.parse(value)) : (this[key] = value)
        } else {
          authStatus.user = AuthStatus.NOT_LOGGED_ID
        }
      })

      if (this.user?.driver) {
        this.driver = this.user.driver
        this.angkot = this.driver?.angkot
        this.docId = this.driver?.angkot?.docId
      }

      if (this.user && !this.user.driver) {
        authStatus.driver = AuthStatus.PENGAJUAN
      }

      const { value } = await Preferences.get({ key: 'docId' })
      this.docId = value

      return authStatus
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
