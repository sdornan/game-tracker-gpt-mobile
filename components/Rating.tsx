import { useMemo } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

type RatingNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

const validateRating = (rating: number): rating is RatingNumber => {
  if (rating < 1 || rating > 10) {
    throw new Error('Invalid rating value. Rating must be between 1 and 10.')
  }
  return true
}

const Rating = ({
  rating,
  size = 25,
  style,
}: {
  rating: number
  size?: number
  style?: StyleProp<ViewStyle>
}) => {
  if (!validateRating(rating)) {
    return null
  }

  const color = useMemo(() => {
    if (rating < 5) {
      return '#ff0000'
    } else if (rating >= 8) {
      return '#32cd32'
    } else {
      return '#ffa500'
    }
  }, [rating])

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color, height: size, width: size, borderRadius: size / 2 },
        style,
      ]}>
      <Text style={[styles.number, { fontSize: size * 0.75 }]}>{rating}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontWeight: 'bold',
    color: '#fff',
  },
})

export default Rating
