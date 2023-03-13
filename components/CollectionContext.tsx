import { createContext, ReactNode, useContext } from 'react'
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

const CollectionContext = createContext(null)

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

  const gameIds = collectionData?.map((g) => g.gameId) ?? []

  const { data: games } = useQuery<Game[]>(
    ['games', gameIds.join(',')],
    () => {
      return fetchGames(gameIds)
    },
    {
      onSuccess: (data) => {
        data = data.map((g) => ({
          ...g,
          rating: collectionData.find((c) => c.gameId === g.id)?.rating,
        }))
      },
    }
  )

  const mutation = useMutation((newGame: Game) => addGameToCollection(newGame.id, newGame.rating), {
    onSuccess: () => {
      queryClient.invalidateQueries('collection')
    },
  })

  return { games, mutation }
}
