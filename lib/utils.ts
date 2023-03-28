export const getGameImageUrl = (imageId: string, imageSize = 'cover_small') =>
  `https://images.igdb.com/igdb/image/upload/t_${imageSize}_2x/${imageId}.png`

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const padWithEmptyItems = (arr: any[], multiple = 4) => {
  const itemCount = arr.length
  const remainder = itemCount % multiple

  if (remainder === 0) {
    return arr
  }

  const paddingCount = multiple - remainder
  const padding = new Array(paddingCount).fill({ id: null })

  return [...arr, ...padding]
}
