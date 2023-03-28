import Constants from 'expo-constants'
import { CollectionGame, CollectionStatus, Game } from '../interfaces'
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

const apiFetch = async (method: string, endpoint: string, body?: object) => {
  const accessToken = await getAccessToken()

  const requestOptions: RequestInit = {
    method,
    headers: { ...headers, Authorization: `Bearer ${accessToken}` },
  }

  if (body) {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${apiUrl}${endpoint}`, requestOptions)
    if (!response.ok) {
      throw response
    }
    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const sendChatMessage = async (message: string) => {
  return await apiFetch('POST', '/api/chat', { message })
}

export const searchForGame = async (name: string) => {
  return await apiFetch('POST', '/api/games/search', { name })
}

export const fetchGameDetails = async (id: number) => {
  return await apiFetch('GET', `/api/games/${id}`)
}

export const fetchGames = async (id: number[]) => {
  if (!id.length) {
    return Promise.resolve([])
  }
  return await apiFetch('POST', '/api/games', { id })
}

export const authUser = async (
  idToken: string,
  accessToken: string,
  issuedAt: number,
  expiresIn: number
) => {
  return await apiFetch('POST', '/api/auth', { idToken, accessToken, issuedAt, expiresIn })
}

export const addGameToCollection = async (game: Game) => {
  const { id: gameId, rating, status } = game
  return await apiFetch('POST', '/api/collection', { gameId, rating, status })
}

export const updateGameInCollection = async (game: Game) => {
  const { id: gameId, rating, status } = game

  const params: CollectionGame = { gameId }

  if (rating) {
    params.rating = rating
  }

  if (status) {
    params.status = status as CollectionStatus
  }

  return await apiFetch('PUT', '/api/collection', params)
}

export const removeGameFromCollection = async (game: Game) => {
  const { id: gameId } = game
  return await apiFetch('DELETE', '/api/collection', { gameId })
}

export const fetchGameCollection = async () => {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return Promise.reject([])
  }

  return await apiFetch('GET', '/api/collection')
}
