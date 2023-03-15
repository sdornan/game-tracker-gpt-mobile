import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { addGameToCollection, fetchGameCollection, fetchGames } from '../lib/api'
import { useAuth } from './AuthContext'

type CollectionGame = {
  gameId: number
  rating: number
}

export type Game = {
  id: number
  name: string
  slug: string
  rating_count: number
  cover: {
    image_id: string
  }
  rating?: number
}

const CollectionContext = createContext({
  games: [],
  mutation: null,
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
      })) ?? [],
    [collectionData, gamesData]
  )

  const mutation = useMutation((newGame: Game) => addGameToCollection(newGame.id, newGame.rating), {
    onSuccess: () => {
      queryClient.invalidateQueries('collection')
    },
  })

  return { games, mutation }
}
