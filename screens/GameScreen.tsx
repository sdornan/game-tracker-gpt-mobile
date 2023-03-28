import { useQuery } from '@tanstack/react-query'
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
import { useCollection } from '../components/CollectionContext'
import Rating from '../components/Rating'
import StatusIcon from '../components/StatusIcon'
import { fetchGameDetails } from '../lib/api'
import { getGameImageUrl } from '../lib/utils'

const CollectionScreen = ({ route }) => {
  const { gameId } = route.params

  const { isLoading, data: gameData } = useQuery(['games', gameId], () => {
    return fetchGameDetails(gameId)
  })

  const { games: collectionData } = useCollection()

  const collectionGame = collectionData.find((g) => g.id === gameId)

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const earliestReleaseDate = gameData?.release_dates.sort((a, b) => a.date - b.date)?.[0]

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
        {collectionGame.status || collectionGame.rating ? (
          <View style={styles.ratingStatusRow}>
            {collectionGame.status ? (
              <View style={styles.statusContainer}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.status}>
                  <StatusIcon status={collectionGame?.status} size={32} />
                  <Text style={styles.statusText}>{collectionGame.status}</Text>
                </View>
              </View>
            ) : (
              <></>
            )}

            {collectionGame.rating ? (
              <View style={styles.ratingContainer}>
                <Text style={styles.label}>Rating</Text>
                <Rating rating={collectionGame?.rating} size={35} />
              </View>
            ) : (
              <></>
            )}
          </View>
        ) : (
          <></>
        )}

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
  ratingStatusRow: {
    flex: 1,
    flexDirection: 'row',
  },
  statusContainer: {
    flex: 1,
    flexDirection: 'column',
    rowGap: 5,
  },
  ratingContainer: {
    flex: 1,
    flexDirection: 'column',
    rowGap: 5,
  },
  status: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  statusText: {
    fontSize: 18,
    textTransform: 'capitalize',
    fontWeight: '600',
  },
})

export default CollectionScreen
