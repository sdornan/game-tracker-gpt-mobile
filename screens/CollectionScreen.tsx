import { MaterialIcons } from '@expo/vector-icons'
import { SearchBar } from '@rneui/themed'
import { ComponentProps, useState } from 'react'
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useCollection } from '../components/CollectionContext'
import Rating from '../components/Rating'
import StatusIcon from '../components/StatusIcon'
import { CollectionStatus, Game } from '../interfaces'
import { getGameImageUrl, padWithEmptyItems } from '../lib/utils'

const Item = ({ game, navigation }: { game: Game; navigation }) => {
  const statusIcon: Record<
    CollectionStatus,
    { name: ComponentProps<typeof MaterialIcons>['name']; color: string }
  > = {
    playing: { name: 'play-arrow', color: '#ffa500' },
    paused: { name: 'pause', color: '#ffff00' },
    completed: { name: 'check', color: '#32cd32' },
    abandoned: { name: 'close', color: '#ff0000' },
    wishlist: { name: 'star', color: '#1e90ff' },
  }

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Game', { gameId: game.id, gameName: game.name })}
      disabled={!game.id}>
      {game.id ? (
        <Image
          source={{ uri: getGameImageUrl(game?.cover?.image_id) || null }}
          style={styles.image}
        />
      ) : (
        <View style={styles.image} />
      )}
      {game.rating ? <Rating rating={game.rating} style={styles.rating} /> : <></>}
      {game.status ? <StatusIcon status={game.status} style={styles.status} /> : <></>}
    </TouchableOpacity>
  )
}

const CollectionScreen = ({ navigation }) => {
  const { games } = useCollection()
  const [search, setSearch] = useState('')

  const updateSearch = (search: string) => {
    setSearch(search)
  }

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(search.toLowerCase())
  )

  const paddedGames = padWithEmptyItems(filteredGames)

  return (
    <View style={styles.container}>
      <SearchBar
        platform="ios"
        onChangeText={updateSearch}
        value={search}
        containerStyle={{ backgroundColor: '#e7052c2' }}
      />

      <View style={styles.listContainer}>
        <FlatList
          data={paddedGames}
          renderItem={({ item }) => <Item game={item} navigation={navigation} />}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          numColumns={4}
          columnWrapperStyle={{ justifyContent: 'space-around' }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    paddingLeft: 4,
    paddingRight: 4,
  },
  item: {
    padding: 4,
    flex: 1 / 4,
  },
  image: {
    // width: 90,
    height: 128,
  },
  rating: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  status: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
})

export default CollectionScreen
