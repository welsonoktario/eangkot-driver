import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.eangkot.driver',
  appName: 'eAngkot Driver',
  webDir: 'public',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config
