import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import { Game, useCollection } from '../components/CollectionContext'
import { getGameImageUrl } from '../lib/utils'

const RATING_SIZE = 25

const getRatingColor = (rating: number) => {
  if (rating < 5) {
    return '#f00'
  } else if (rating >= 8) {
    return '#6c3'
  } else {
    return '#fc3'
  }
}

const Item = ({ game }: { game: Game }) => (
  <View style={styles.item}>
    <Image source={{ uri: getGameImageUrl(game.cover.image_id) }} style={styles.image} />
    {game.rating ? (
      <View style={[styles.ratingContainer, { backgroundColor: getRatingColor(game.rating) }]}>
        <Text style={styles.ratingNumber}>{game.rating}</Text>
      </View>
    ) : (
      <></>
    )}
  </View>
)

const CollectionScreen = () => {
  const { games } = useCollection()

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={({ item }) => <Item game={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={styles.container}
        numColumns={4}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    padding: 4,
  },
  image: {
    width: 90,
    height: 128,
  },
  ratingContainer: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
    right: 10,
    height: RATING_SIZE,
    width: RATING_SIZE,
    borderRadius: RATING_SIZE / 2,
  },
  ratingNumber: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
})

export default CollectionScreen
