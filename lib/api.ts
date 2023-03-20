import Constants from 'expo-constants'
import { ChatGPTResponse, CollectionGame, CollectionStatus, Query } from '../interfaces'
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
    return (await response.json()) as ChatGPTResponse
  } else {
    return Promise.reject(response)
  }
}

export const searchForGame = async (name: string, query?: Query) => {
  const accessToken = await getAccessToken()

  const body = JSON.stringify({ name, query })

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

export const fetchGameDetails = async (id: number) => {
  const accessToken = await getAccessToken()

  try {
    const response = await fetch(`${apiUrl}/api/games/${id}`, {
      method: 'GET',
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
    })
    const json = await response.json()
    return json as any
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

export const authUser = async (
  idToken: string,
  accessToken: string,
  issuedAt: number,
  expiresIn: number
) => {
  const body = JSON.stringify({
    idToken,
    accessToken,
    issuedAt,
    expiresIn,
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

export const addGameToCollection = async (gameId: number, rating?: number, status?: string) => {
  const accessToken = await getAccessToken()

  const body = JSON.stringify({
    gameId,
    rating,
    status,
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

export const updateGameInCollection = async (gameId: number, rating?: number, status?: string) => {
  const accessToken = await getAccessToken()

  const params: CollectionGame = { gameId }

  if (rating) {
    params.rating = rating
  }

  if (status) {
    params.status = status as CollectionStatus
  }

  const body = JSON.stringify(params)

  try {
    const response = await fetch(`${apiUrl}/api/collection`, {
      method: 'PUT',
      headers: { ...headers, Authorization: `Bearer ${accessToken}` },
      body,
    })
    const json = await response.json()
    return json as any
  } catch (error) {
    console.error(error)
  }
}

export const removeGameFromCollection = async (gameId: number) => {
  const accessToken = await getAccessToken()

  const body = JSON.stringify({
    gameId,
  })

  try {
    const response = await fetch(`${apiUrl}/api/collection`, {
      method: 'DELETE',
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
