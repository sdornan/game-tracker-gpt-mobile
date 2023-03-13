import * as SecureStore from 'expo-secure-store'

interface Tokens {
  idToken: string
  accessToken: string
  refreshToken?: string
}

export const storeTokens = async ({ idToken, accessToken, refreshToken }: Tokens) => {
  await SecureStore.setItemAsync('idToken', idToken)
  await SecureStore.setItemAsync('accessToken', accessToken)
  if (refreshToken) {
    await SecureStore.setItemAsync('refreshToken', refreshToken)
  }
  return true
}

export const getAccessToken = async () => {
  return SecureStore.getItemAsync('accessToken')
}

export const getRefreshToken = async () => {
  return SecureStore.getItemAsync('refreshToken')
}
