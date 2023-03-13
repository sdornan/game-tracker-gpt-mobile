import * as WebBrowser from 'expo-web-browser'
import { Button, StyleSheet, View } from 'react-native'
import { useAuth } from '../components/AuthContext'

WebBrowser.maybeCompleteAuthSession()

const AuthScreen = () => {
  const { request, signInWithGoogle } = useAuth()

  return (
    <View style={styles.container}>
      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => {
          signInWithGoogle()
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})

export default AuthScreen
