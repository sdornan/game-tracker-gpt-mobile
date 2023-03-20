import * as AuthSession from 'expo-auth-session'
import * as Google from 'expo-auth-session/providers/google'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { authUser } from '../lib/api'
import { getAccessToken, getRefreshToken, storeTokens } from '../lib/store'

type User = {
  email: string
  family_name: string
  given_name: string
  id: string
  locale: string
  name: string
  picture: string
  verified_email: boolean
}

const AuthContext = createContext({
  user: null,
  request: null,
  signInWithGoogle: null,
  logOut: null,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useProvideAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

const useProvideAuth = () => {
  const [user, setUser] = useState<User>(null)

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '988986080253-l04s45t5k5j6s9o52podjukrhv687c12.apps.googleusercontent.com',
    androidClientId: '988986080253-aijealndmpdlham7j78ms75pm0mbb3bn.apps.googleusercontent.com',
  })

  const handleStartup = async () => {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return
    }

    const user = await getUserInfo(accessToken)

    if (user) {
      setUser(user)
    }
  }

  useEffect(() => {
    handleStartup()
  }, [])

  const handleTokens = async (response: AuthSession.TokenResponse) => {
    const { idToken, accessToken, refreshToken, issuedAt, expiresIn } = response
    const loggedIn = await authenticateUser(idToken, accessToken, issuedAt, expiresIn)
    const stored = await storeTokens({ idToken, accessToken, refreshToken })
    const user = await getUserInfo(accessToken)

    if (loggedIn && stored && user) {
      setUser(user)
    }
  }

  useEffect(() => {
    if (response?.type === 'success') {
      handleTokens(response.authentication)
    }
  }, [response])

  const authenticateUser = async (
    idToken: string,
    accessToken: string,
    issuedAt: number,
    expiresIn: number
  ) => {
    try {
      await authUser(idToken, accessToken, issuedAt, expiresIn)

      return true
    } catch (error) {
      // Add your own error handler here
    }
  }

  const getUserInfo = async (accessToken: string) => {
    let response

    try {
      response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    } catch (error) {
      // Add your own error handler here
    }

    if (response?.ok) {
      return await response.json()
    } else {
      if (response?.status === 401) {
        refreshAccessToken()
      }
    }
  }

  const refreshAccessToken = async () => {
    const refreshToken = await getRefreshToken()

    try {
      const response = await AuthSession.refreshAsync(
        {
          clientId: '988986080253-l04s45t5k5j6s9o52podjukrhv687c12.apps.googleusercontent.com',
          refreshToken,
        },
        {
          tokenEndpoint: 'https://oauth2.googleapis.com/token',
        }
      )

      if (response.idToken && response.accessToken) {
        handleTokens(response)
      }
    } catch (error) {
      // Add your own error handler here
    }
  }

  const logOut = () => {
    setUser(null)
  }

  return {
    user,
    request,
    signInWithGoogle: promptAsync,
    logOut,
  }
}
