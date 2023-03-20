import { MaterialIcons } from '@expo/vector-icons'
import { ComponentProps, useMemo } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useCollection } from '../components/CollectionContext'
import { CollectionStatus, Game } from '../interfaces'
import { getGameImageUrl } from '../lib/utils'

const ICON_SIZE = 25

const Item = ({ game, navigation }: { game: Game; navigation }) => {
  const ratingColor = useMemo(() => {
    if (game.rating < 5) {
      return '#ff0000'
    } else if (game.rating >= 8) {
      return '#32cd32'
    } else {
      return '#ffa500'
    }
  }, [game?.rating])

  type StatusIconMap = {
    [k in CollectionStatus]: { name: ComponentProps<typeof MaterialIcons>['name']; color: string }
  }
  const statusIcon: StatusIconMap = {
    playing: { name: 'play-arrow', color: '#ffa500' },
    paused: { name: 'pause', color: '#ffff00' },
    completed: { name: 'check', color: '#32cd32' },
    abandoned: { name: 'close', color: '#ff0000' },
    wishlist: { name: 'star', color: '#1e90ff' },
  }

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Game', { gameId: game.id, gameName: game.name })}>
      <Image
        source={{ uri: getGameImageUrl(game?.cover?.image_id) || null }}
        style={styles.image}
      />
      {game.rating ? (
        <View style={[styles.ratingContainer, { backgroundColor: ratingColor }]}>
          <Text style={styles.ratingNumber}>{game.rating}</Text>
        </View>
      ) : (
        <></>
      )}
      {game.status ? (
        <View style={[styles.statusContainer, { backgroundColor: statusIcon[game.status].color }]}>
          <MaterialIcons size={24} name={statusIcon[game.status].name} color="#fff" />
        </View>
      ) : (
        <></>
      )}
    </TouchableOpacity>
  )
}

const CollectionScreen = ({ navigation }) => {
  const { games } = useCollection()

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={({ item }) => <Item game={item} navigation={navigation} />}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
    right: 10,
    height: ICON_SIZE,
    width: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
  },
  ratingNumber: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
  statusContainer: {
    position: 'absolute',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10,
    left: 10,
    height: ICON_SIZE,
    width: ICON_SIZE,
    borderRadius: 5,
  },
})

export default CollectionScreen
