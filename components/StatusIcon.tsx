import { MaterialIcons } from '@expo/vector-icons'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

const StatusIcon = ({
  status,
  size = 25,
  style,
}: {
  status: string
  size?: number
  style?: StyleProp<ViewStyle>
}) => {
  const statusIcon = {
    playing: { name: 'play-arrow', color: '#ffa500' },
    paused: { name: 'pause', color: '#ffff00' },
    completed: { name: 'check', color: '#32cd32' },
    abandoned: { name: 'close', color: '#ff0000' },
    wishlist: { name: 'star', color: '#1e90ff' },
  }

  if (!status) {
    return null
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: statusIcon[status].color, width: size, height: size },
        style,
      ]}>
      <MaterialIcons size={size} name={statusIcon[status].name} color="#fff" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
})

export default StatusIcon
