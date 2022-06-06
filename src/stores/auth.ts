import { User } from "@/models/user";
import { defineStore } from "pinia";
import { Storage } from "@capacitor/storage";
import { patch, post } from "@/utils/http";

type AuthState = {
  user: User | undefined;
  token: string | undefined;
};

export const useAuth = defineStore("auth", {
  state: () =>
    ({
      user: undefined,
      token: undefined,
    } as AuthState),
  getters: {
    authUser: (state) => state.user,
    authToken: (state) => state.token,
  },
  actions: {
    async setAuthUser(user: User, token: string = null) {
      this.user = user;

      await Storage.remove({ key: "user" });
      await Storage.set({ key: "user", value: JSON.stringify(user) });

      if (token) {
        await Storage.remove({ key: "token" });
        this.token = token;
        await Storage.set({ key: "token", value: token });
      }
    },
    async checkAuth() {
      const user = await Storage.get({ key: "user" });
      const token = await Storage.get({ key: "token" });

      if (
        user.value &&
        user.value != "null" &&
        token.value &&
        token.value != "null"
      ) {
        this.user = JSON.parse(user.value);
        this.token = token.value;

        return true;
      }

      return false;
    },
    async login(phone: string) {
      return await post(`${process.env.VUE_APP_API_URL}auth/login`, { phone });
    },
    async requestOTP(phone: string) {
      return await post(`${process.env.VUE_APP_API_URL}auth/request-otp`, { phone });
    },
    async checkOTP(phone: string, pin: string) {
      return await post(`${process.env.VUE_APP_API_URL}auth/check-otp`, { phone, pin });
    },
    async register(nama: string, phone: string) {
      return await post(`${process.env.VUE_APP_API_URL}auth/register`, { nama, phone });
    },
    async ubahProfil(data: object) {
      return await patch(`user/${this.authUser.id}`, data);
    },
    async ubahPassword(data: object) {
      return await patch(`user/${this.authUser.id}/ubah-password`, data);
    },
    async logout() {
      this.user = undefined;
      this.token = undefined;
      await Storage.clear();
    },
  },
});
