import { MaterialIcons } from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createTheme, lightColors, ThemeProvider } from '@rneui/themed'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Font from 'expo-font'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { AuthProvider, useAuth } from './components/AuthContext'
import { CollectionProvider } from './components/CollectionContext'
import { CollectionStackParamList } from './interfaces'
import AuthScreen from './screens/AuthScreen'
import ChatScreen from './screens/ChatScreen'
import CollectionScreen from './screens/CollectionScreen'
import GameScreen from './screens/GameScreen'

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
})

const queryClient = new QueryClient()

const cacheFonts = (fonts: any) => fonts.map((font: any) => Font.loadAsync(font))

const Tab = createBottomTabNavigator()

const Stack = createNativeStackNavigator<CollectionStackParamList>()

const Collection = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Grid" component={CollectionScreen} options={{ title: 'Collection' }} />
      <Stack.Screen name="Game" component={GameScreen} options={{ headerTitle: '' }} />
    </Stack.Navigator>
  )
}

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const loadResourcesAndDataAsync = async () => {
      try {
        const fontAssets = cacheFonts([MaterialIcons.font])

        await Promise.all([...fontAssets])
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  if (!appIsReady) {
    return null
  }

  return (
    <>
      {user === null ? (
        <AuthScreen />
      ) : (
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="Chat"
              component={ChatScreen}
              options={{
                tabBarIcon: ({ color, size }) => {
                  return <MaterialIcons name="chat-bubble" size={size} color={color} />
                },
              }}
            />
            <Tab.Screen
              name="Collection"
              component={Collection}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                  return <MaterialIcons name="grid-view" size={size} color={color} />
                },
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </>
  )
}

const Root = () => (
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CollectionProvider>
          <App />
        </CollectionProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
)

export default Root
