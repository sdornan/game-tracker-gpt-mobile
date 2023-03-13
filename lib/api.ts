import Constants from 'expo-constants'
import { getAccessToken } from './store'
const { manifest } = Constants

const apiUrl =
  typeof manifest.packagerOpts === `object` && manifest.packagerOpts.dev
    ? `http://${manifest.debuggerHost.split(':').shift()}:3000`
    : `https://api.example.com`

const headers: RequestInit['headers'] = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

type Action = 'add' | 'remove' | 'rate'

type ChatGptActivity = {
  action: Action | Action[]
  game: string
  rating?: number
}

export const sendChatMessage = async (message: string) => {
  const accessToken = await getAccessToken()

  const body = JSON.stringify({ message })

  let response

  try {
    response = await fetch(`${apiUrl}/api/chat`, {
      method: 'POST',
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
      body,
    })
  } catch (error) {
    console.error(error)
  }

  if (response?.ok) {
    return (await response.json()) as ChatGptActivity
  } else {
    return Promise.reject(response)
  }
}

export const searchForGame = async (name: string) => {
  const accessToken = await getAccessToken()

  const body = JSON.stringify({ name })

  try {
    const response = await fetch(`${apiUrl}/api/games/search`, {
      method: 'POST',
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
      body,
    })
    const json = await response.json()
    return json as any[]
  } catch (error) {
    console.error(error)
  }
}

export const fetchGames = async (id: number[]) => {
  if (!id.length) {
    return Promise.resolve([])
  }

  const accessToken = await getAccessToken()

  const body = JSON.stringify({ id })

  try {
    const response = await fetch(`${apiUrl}/api/games`, {
      method: 'POST',
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
      body,
    })
    const json = await response.json()
    return json as any[]
  } catch (error) {
    console.error(error)
  }
}

export const authUser = async (idToken: string, accessToken: string) => {
  const body = JSON.stringify({
    idToken,
    accessToken,
  })

  try {
    const response = await fetch(`${apiUrl}/api/auth`, {
      method: 'POST',
      headers,
      body,
    })
    const json = await response.json()
    return json as any
  } catch (error) {
    console.error(error)
  }
}

export const addGameToCollection = async (gameId: number, rating?: number) => {
  const accessToken = await getAccessToken()

  const body = JSON.stringify({
    gameId,
    rating,
  })

  try {
    const response = await fetch(`${apiUrl}/api/collection`, {
      method: 'POST',
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
      body,
    })
    const json = await response.json()
    return json as any
  } catch (error) {
    console.error(error)
  }
}

export const fetchGameCollection = async () => {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return Promise.reject([])
  }

  let response

  try {
    response = await fetch(`${apiUrl}/api/collection`, {
      method: 'GET',
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
    })
  } catch (error) {
    console.error(error)
  }

  if (response?.ok) {
    return await response.json()
  } else {
    return Promise.reject(response)
  }
}
