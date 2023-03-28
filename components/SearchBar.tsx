import { Entypo, Feather } from '@expo/vector-icons'
import React from 'react'
import { Button, Keyboard, StyleSheet, TextInput, View } from 'react-native'

const SearchBar = ({ clicked, searchPhrase, setSearchPhrase, setClicked }) => {
  return (
    <View style={styles.container}>
      <View style={clicked ? styles.searchBar__clicked : styles.searchBar__unclicked}>
        {/* search Icon */}
        <Feather name="search" size={20} color="black" style={{ marginLeft: 1 }} />
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true)
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Entypo
            name="cross"
            size={20}
            color="black"
            style={{ padding: 1 }}
            onPress={() => {
              setSearchPhrase('')
            }}
          />
        )}
      </View>
      {/* cancel button, depending on whether the search bar is clicked or not */}
      {clicked && (
        <View>
          <Button
            title="Cancel"
            onPress={() => {
              setSearchPhrase('')
              Keyboard.dismiss()
              setClicked(false)
            }}></Button>
        </View>
      )}
    </View>
  )
}
export default SearchBar

// styles
const styles = StyleSheet.create({
  container: {
    margin: 4,
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // width: '100%',
  },
  searchBar__unclicked: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#d9dbda',
    borderRadius: 15,
    alignItems: 'center',
  },
  searchBar__clicked: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    // width: '82%',
    backgroundColor: '#d9dbda',
    borderRadius: 15,
    alignItems: 'center',
    // justifyContent: 'space-evenly',
    // marginRight: 10,
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: '90%',
  },
})
