import { Picker } from '@react-native-picker/picker'
import { useState } from 'react'
import { View } from 'react-native'
import { CollectionStatus } from '../interfaces'

const FilterMenu = ({ isVisible, onClose, onFilter }) => {
  const [selectedValue, setSelectedValue] = useState(null)

  if (!isVisible) return null

  const statuses: CollectionStatus[] = ['playing', 'paused', 'completed', 'abandoned', 'wishlist']

  const filterOptions = [
    { label: 'all', value: null },
    ...Object.keys(statuses).map((status) => ({
      label: status,
      value: status,
    })),
  ]

  return (
    <View
      style={{
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        zIndex: 999,
      }}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(value) => setSelectedValue(value)}
        style={{ width: '80%', height: 50 }}></Picker>
    </View>
  )
}

export default FilterMenu
