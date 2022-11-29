import { keysToSnake } from '@/utils'
import { CapacitorHttp as Http, HttpOptions } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

const API_URL = import.meta.env.VITE_API_URL

export const get = async (endpoint: string) => {
  const isAPI = !endpoint.includes('http')
  const url = isAPI ? API_URL + endpoint : endpoint
  const headers = {
    Accept: 'application/json',
  }

  if (isAPI) {
    const { value } = await Preferences.get({ key: 'token' })

    Object.assign(headers, {
      Authorization: `Bearer ${value}`,
    })
  }

  const options: HttpOptions = {
    url,
    headers,
  }

  return await Http.get(options)
}

export const post = async (
  endpoint: string,
  payload: object,
  headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  }
) => {
  const isAPI = !endpoint.includes('http')
  const isChannel = endpoint.includes('broadcasting')
  const url = isAPI ? API_URL + endpoint : endpoint
  const data = keysToSnake(payload)

  if (isAPI || isChannel) {
    const { value } = await Preferences.get({ key: 'token' })

    !value &&
      value !== 'null' &&
      Object.assign(headers, {
        Authorization: `Bearer ${value}`,
      })
  }

  const options: HttpOptions = {
    url,
    data,
    headers,
  }

  return await Http.post(options)
}

export const patch = async (endpoint: string, payload: object) => {
  const isAPI = !endpoint.includes('http')
  const url = isAPI ? API_URL + endpoint : endpoint
  const data = keysToSnake(payload)
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  }

  if (isAPI) {
    const { value } = await Preferences.get({ key: 'token' })

    !value && value === 'null'
      ? null
      : Object.assign(headers, {
          Authorization: `Bearer ${value}`,
        })
  }

  const options: HttpOptions = {
    url,
    data,
    headers,
  }

  return await Http.patch(options)
}
