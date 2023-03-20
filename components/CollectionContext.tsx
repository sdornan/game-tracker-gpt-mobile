import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CollectionGame, Game } from '../interfaces'
import {
  addGameToCollection,
  fetchGameCollection,
  fetchGames,
  removeGameFromCollection,
  updateGameInCollection,
} from '../lib/api'
import { useAuth } from './AuthContext'

const CollectionContext = createContext({
  games: [],
  addMutation: null,
  removeMutation: null,
  updateMutation: null,
})

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
  const collection = useProvideCollection()

  return <CollectionContext.Provider value={collection}>{children}</CollectionContext.Provider>
}

export const useCollection = () => {
  return useContext(CollectionContext)
}

const useProvideCollection = () => {
  const { logOut } = useAuth()

  const queryClient = useQueryClient()

  const { data: collectionData } = useQuery<CollectionGame[]>('collection', fetchGameCollection, {
    onError: (error: Response) => {
      if (error?.status === 401) {
        logOut()
      }
    },
  })

  const gameIds = useMemo(() => collectionData?.map((g) => g.gameId) ?? [], [collectionData])

  const { data: gamesData } = useQuery<Game[]>(['games', gameIds.join(',')], () => {
    return fetchGames(gameIds)
  })

  const games = useMemo(
    () =>
      gamesData?.map((game) => ({
        ...game,
        rating: collectionData.find((c) => c.gameId === game.id)?.rating ?? null,
        status: collectionData.find((c) => c.gameId === game.id)?.status ?? null,
      })) ?? [],
    [collectionData, gamesData]
  )

  const addMutation = useMutation(
    (game: Game) => addGameToCollection(game.id, game.rating, game.status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('collection')
      },
    }
  )

  const removeMutation = useMutation((game: Game) => removeGameFromCollection(game.id), {
    onSuccess: () => {
      queryClient.invalidateQueries('collection')
    },
  })

  const updateMutation = useMutation(
    (game: Game) => updateGameInCollection(game.id, game.rating, game.status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('collection')
      },
    }
  )

  return { games, addMutation, removeMutation, updateMutation }
}
