import { Dialog } from '@capacitor/dialog'

type DialogOptions = {
  title?: string
  message: string
  buttonTitle?: string
}

export const showDialog = async (options: DialogOptions) =>
  await Dialog.alert(options)
