import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider, useAuth } from './components/AuthContext'
import { CollectionProvider } from './components/CollectionContext'
import AuthScreen from './screens/AuthScreen'
import ChatScreen from './screens/ChatScreen'
import CollectionScreen from './screens/CollectionScreen'

const queryClient = new QueryClient()

const Tab = createBottomTabNavigator()

const App = () => {
  const { user } = useAuth()

  return (
    <>
      {user === null ? (
        <AuthScreen />
      ) : (
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Collection" component={CollectionScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </>
  )
}

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CollectionProvider>
        <App />
      </CollectionProvider>
    </AuthProvider>
  </QueryClientProvider>
)

export default Root
