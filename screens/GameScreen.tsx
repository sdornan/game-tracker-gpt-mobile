import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useQuery } from 'react-query'
import { fetchGameDetails } from '../lib/api'
import { getGameImageUrl } from '../lib/utils'

const CollectionScreen = ({ route }) => {
  const { gameId } = route.params

  const { isLoading, data: gameData } = useQuery(['games', gameId], () => {
    return fetchGameDetails(gameId)
  })

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const earliestReleaseDate = gameData.release_dates.sort((a, b) => a.date - b.date)?.[0]

  const genres = gameData.genres.map((g) => g.name).join(', ')

  const platforms = gameData.platforms.map((p) => p.name).join(', ')

  const developer = gameData.involved_companies.find((c) => c.developer)?.company.name

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={20}
        source={{
          uri: getGameImageUrl(gameData.screenshots[0].image_id, 'screenshot_big'),
        }}>
        <View style={styles.header}>
          <Image
            style={styles.coverImage}
            source={{ uri: getGameImageUrl(gameData.cover.image_id) }}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.name}>{gameData.name}</Text>
            <Text style={styles.releaseDate}>{earliestReleaseDate.human}</Text>
            <Text style={styles.developer}>{developer}</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.bodyContainer}>
        <View>
          <Text style={styles.label}>Genres</Text>
          <Text>{genres}</Text>
        </View>
        <View>
          <Text style={styles.label}>Platforms</Text>
          <Text>{platforms}</Text>
        </View>
        <Text>{gameData.summary}</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    height: 200,
    width: Dimensions.get('window').width,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    columnGap: 15,
  },
  coverImage: {
    width: 135,
    height: 180,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    rowGap: 10,
  },
  name: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  releaseDate: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    opacity: 0.8,
  },
  developer: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    opacity: 0.8,
  },
  bodyContainer: {
    flex: 1,
    margin: 10,
    rowGap: 10,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
  },
})

export default CollectionScreen
