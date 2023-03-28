import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ReactNode, createContext, useContext } from 'react'
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

  const { data: collectionData } = useQuery<CollectionGame[]>({
    queryKey: ['collection'],
    queryFn: fetchGameCollection,
    onError: (error: Response) => {
      if (error?.status === 401) {
        logOut()
      }
    },
  })

  const gameIds = collectionData?.map((g) => g.gameId) ?? []

  const { data: gamesData } = useQuery<Game[]>({
    queryKey: ['games', gameIds.join(',')],
    queryFn: () => {
      return fetchGames(gameIds)
    },
    enabled: !!gameIds.length,
  })

  const games =
    gamesData?.map((game) => ({
      ...game,
      rating: collectionData.find((c) => c.gameId === game.id)?.rating ?? null,
      status: collectionData.find((c) => c.gameId === game.id)?.status ?? null,
    })) ?? []

  const addMutation = useMutation({
    mutationFn: addGameToCollection,
    onSuccess: () => {
      console.log('onSuccess')
      queryClient.refetchQueries({ queryKey: ['collection'] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeGameFromCollection,
    onSuccess: () => {
      console.log('onSuccess')
      queryClient.refetchQueries({ queryKey: ['collection'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateGameInCollection,
    onSuccess: () => {
      console.log('onSuccess')
      queryClient.refetchQueries({ queryKey: ['collection'] })
    },
  })

  return { games, addMutation, removeMutation, updateMutation }
}
