export type CollectionAction = 'add' | 'remove' | 'update'

export type CollectionStatus = 'playing' | 'paused' | 'completed' | 'abandoned' | 'wishlist'

export type Game = {
  id: number
  name: string
  slug: string
  rating_count: number
  cover: {
    image_id: string
  }
  rating?: number
  status?: CollectionStatus
}

export type ChatGPTResponse = {
  category: 'collection' | 'query'
  action?: CollectionAction
  game: string
  status?: CollectionStatus
  rating?: number
}

export type CollectionStackParamList = {
  Grid: undefined
  Game: { gameId: number; gameName: string }
}

export type CollectionGame = {
  gameId: number
  rating?: number
  status?: CollectionStatus
}
